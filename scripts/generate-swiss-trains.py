#!/usr/bin/env python3
"""
Sección "Trenes en Suiza": página con las guías de rutas suizas + tabla de horarios (primer/último tren, trenes directos al día,
duración más rápida) calculada del GTFS abierto de opentransportdata.swiss, y CSV descargable.
Entrada: assets/data/horarios-suiza.json (scripts/horarios-suiza.py). Salida: swiss-trains/index.html (en),
es/trenes-suiza/index.html (es) y assets/data/horarios-suiza.csv. Cabecera y estilos: se copian del índice de rutas de cada idioma.
Uso: python3 scripts/generate-swiss-trains.py   (desde la raíz del repo)
"""
import json, re, csv, html, os, datetime

ROOT = os.path.join(os.path.dirname(__file__), '..')
D = json.load(open(os.path.join(ROOT, 'assets/data/horarios-suiza.json'), encoding='utf8'))
REF = D['reference_week']
CITY = {'Zurich HB': 'zurich', 'Genève': 'geneva', 'Bern': 'bern', 'Basel SBB': 'basel', 'Luzern': 'lucerne', 'Interlaken Ost': 'interlaken',
        'Lauterbrunnen': 'lauterbrunnen', 'Zermatt': 'zermatt', 'Montreux': 'montreux', 'St. Moritz': 'stmoritz', 'Lugano': 'lugano'}
SLUGS = {d for d in os.listdir(os.path.join(ROOT, 'rutas')) if os.path.isfile(os.path.join(ROOT, 'rutas', d, 'index.html'))}
SWISS_GUIDES = sorted(s for s in SLUGS if all(p in CITY.values() for p in s.split('-')))
NAMES = {'es': {'zurich': 'Zúrich', 'geneva': 'Ginebra', 'basel': 'Basilea', 'lucerne': 'Lucerna', 'bern': 'Berna', 'stmoritz': 'St. Moritz'}, 'en': {'stmoritz': 'St. Moritz'},
         'fr': {'geneva': 'Genève', 'basel': 'Bâle', 'bern': 'Berne', 'stmoritz': 'Saint-Moritz'},
         'it': {'zurich': 'Zurigo', 'geneva': 'Ginevra', 'basel': 'Basilea', 'lucerne': 'Lucerna', 'bern': 'Berna', 'stmoritz': 'St. Moritz'},
         'ja': {'zurich': 'チューリッヒ', 'geneva': 'ジュネーブ', 'basel': 'バーゼル', 'lucerne': 'ルツェルン', 'bern': 'ベルン', 'interlaken': 'インターラーケン', 'lauterbrunnen': 'ラウターブルンネン', 'zermatt': 'ツェルマット', 'montreux': 'モントルー', 'stmoritz': 'サンモリッツ'}}
OMIO_SLUG = {'Zurich HB': 'zurich', 'Genève': 'geneva', 'Basel SBB': 'basel', 'Luzern': 'lucerne', 'Interlaken Ost': 'interlaken',
             'St. Gallen': 'st-gallen', 'Zurich Airport': 'zurich-airport', 'Genève-Aéroport': 'geneva-airport', 'Fribourg': 'fribourg',
             'Neuchâtel': 'neuchatel', 'St. Moritz': 'st-moritz'}
def omio(a, b, lang):
    sl = lambda x: OMIO_SLUG.get(x, x.lower().replace(' ', '-'))
    return 'https://voxa-production-dc15.up.railway.app/affiliate/europe-train?from=%s&to=%s&src=swiss_table&lang=%s' % (sl(a), sl(b), lang)
BOOK = {'en': ('Book', 'Book on Omio'), 'es': ('Reservar', 'Reservar en Omio'), 'fr': ('Réserver', 'Réserver sur Omio'), 'it': ('Prenota', 'Prenota su Omio'), 'ja': ('予約', 'Omioで予約')}
SHOWCASE = 'https://data.opentransportdata.swiss/en/showcase/wow-train'
SRC = D['source']['url']

def dur(m): return f'{m // 60} h {m % 60:02d}' if m >= 60 else f'{m} min'
def guide(a, b):
    ca, cb = CITY.get(a), CITY.get(b)
    if not ca or not cb: return None
    for s in (f'{ca}-{cb}', f'{cb}-{ca}'):
        if s in SLUGS: return s
    return None

# una fila por par (sentido A>B con A<B alfabético) para que la tabla no sea el doble de larga; el CSV lleva los dos sentidos
seen, rows = set(), []
for p in sorted(D['pairs'], key=lambda p: (p['from'], p['to'])):
    k = tuple(sorted((p['from'], p['to'])))
    if k in seen: continue
    seen.add(k); rows.append(p)

T = {
 'en': dict(dir='swiss-trains', tpl='rutas/index.html', home='/', all_routes='/rutas/', back='&larr; All routes', suffix='',
   title='Train times in Switzerland from open SBB data · glosx.app',
   desc='First train, last train, direct trains per day and fastest journey for {n} Swiss rail connections, from the open timetable of opentransportdata.swiss (SBB). Table and CSV, plus route guides.',
   h1='Trains in Switzerland', sub='First and last train, direct trains per day and the fastest journey for {n} Swiss connections, calculated by glosx.app from the official open timetable of opentransportdata.swiss (SBB).',
   guides='Swiss route guides', cols=['Trip', 'First train', 'Last train', 'Weekday', 'Saturday', 'Sunday', 'Fastest'],
   src='Source: glosx.app, from the open timetable of opentransportdata.swiss (SBB).', csv='Download the data as CSV',
   csvnote='(one row per connection, direction and type of day).', how='How it was calculated',
   li=['<strong>Source:</strong> the official GTFS timetable of <a href="{src}" rel="noopener">opentransportdata.swiss</a>, the open data platform for Swiss public transport, file {file}.',
       '<strong>Reference week:</strong> Tuesday {wd} (weekday), Saturday {sa} and Sunday {su}. Engineering works change some services on other dates (for example, in late October 2026 there were no trains between Visp and Zermatt).',
       '<strong>What counts:</strong> direct trains of all categories (IC, IR, RE, regional and mountain railways) that stop at both stations in that direction. Buses, trams, boats and cable cars are not included.',
       '<strong>Fastest:</strong> the quickest direct train of the weekday. Times change with the timetable: check your date before you travel.'],
   cite='How to cite this data', citetxt='Timetable data: opentransportdata.swiss (SBB), processed by <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='WoW Train is featured in the <a href="{sc}" rel="noopener">showcases of opentransportdata.swiss</a>.', dl='Swiss connections'),
 'es': dict(dir='es/trenes-suiza', tpl='es/rutas/index.html', home='/es/', all_routes='/es/rutas/', back='&larr; Todas las rutas', suffix='es/',
   title='Horarios de trenes en Suiza con datos abiertos de SBB · glosx.app',
   desc='Primer tren, último tren, trenes directos al día y viaje más rápido de {n} conexiones ferroviarias suizas, con el horario abierto de opentransportdata.swiss (SBB). Tabla, CSV y guías de rutas.',
   h1='Trenes en Suiza', sub='Primer y último tren, trenes directos al día y el viaje más rápido de {n} conexiones suizas, calculados por glosx.app a partir del horario abierto oficial de opentransportdata.swiss (SBB).',
   guides='Guías de rutas en Suiza', cols=['Trayecto', 'Primer tren', 'Último tren', 'Laborable', 'Sábado', 'Domingo', 'Más rápido'],
   src='Fuente: glosx.app a partir del horario abierto de opentransportdata.swiss (SBB).', csv='Descargar los datos en CSV',
   csvnote='(una fila por conexión, sentido y tipo de día).', how='Cómo se han calculado',
   li=['<strong>Fuente:</strong> el horario GTFS oficial de <a href="{src}" rel="noopener">opentransportdata.swiss</a>, la plataforma de datos abiertos del transporte público suizo, archivo {file}.',
       '<strong>Semana de referencia:</strong> martes {wd} (laborable), sábado {sa} y domingo {su}. Las obras cambian algunos servicios en otras fechas (por ejemplo, a fines de octubre de 2026 no hubo trenes entre Visp y Zermatt).',
       '<strong>Qué cuenta:</strong> trenes directos de todas las categorías (IC, IR, RE, regionales y trenes de montaña) que paran en las dos estaciones en ese sentido. No incluye autobuses, tranvías, barcos ni teleféricos.',
       '<strong>Más rápido:</strong> el tren directo más rápido del día laborable. Los horarios cambian con cada temporada: confirma tu fecha antes de viajar.'],
   cite='Cómo citar estos datos', citetxt='Datos de horarios: opentransportdata.swiss (SBB), procesados por <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='WoW Train figura en los <a href="{sc}" rel="noopener">showcases de opentransportdata.swiss</a>.', dl='Conexiones suizas'),
}

T['fr'] = dict(dir='fr/trains-suisse', tpl='fr/rutas/index.html', home='/fr/', all_routes='/fr/rutas/', back='&larr; Tous les trajets', suffix='fr/',
   title='Horaires des trains en Suisse avec les données ouvertes des CFF · glosx.app',
   desc='Premier train, dernier train, trains directs par jour et trajet le plus rapide pour {n} liaisons ferroviaires suisses, d’après l’horaire ouvert d’opentransportdata.swiss (CFF). Tableau, CSV et guides de trajets.',
   h1='Trains en Suisse', sub='Premier et dernier train, trains directs par jour et trajet le plus rapide pour {n} liaisons suisses, calculés par glosx.app à partir de l’horaire ouvert officiel d’opentransportdata.swiss (CFF).',
   guides='Guides de trajets en Suisse', cols=['Trajet', 'Premier train', 'Dernier train', 'Semaine', 'Samedi', 'Dimanche', 'Le plus rapide'],
   src='Source : glosx.app, d’après l’horaire ouvert d’opentransportdata.swiss (CFF).', csv='Télécharger les données en CSV',
   csvnote='(une ligne par liaison, sens et type de jour).', how='Méthode de calcul',
   li=['<strong>Source :</strong> l’horaire GTFS officiel d’<a href="{src}" rel="noopener">opentransportdata.swiss</a>, la plateforme de données ouvertes des transports publics suisses, fichier {file}.',
       '<strong>Semaine de référence :</strong> mardi {wd} (semaine), samedi {sa} et dimanche {su}. Des travaux modifient certains services à d’autres dates (par exemple, fin octobre 2026, aucun train entre Viège et Zermatt).',
       '<strong>Ce qui est compté :</strong> les trains directs de toutes catégories (IC, IR, RE, régionaux et trains de montagne) qui s’arrêtent dans les deux gares dans ce sens. Bus, trams, bateaux et téléphériques non inclus.',
       '<strong>Le plus rapide :</strong> le train direct le plus rapide du jour de semaine. Les horaires changent : vérifiez votre date avant de voyager.'],
   cite='Comment citer ces données', citetxt='Données horaires : opentransportdata.swiss (CFF), traitées par <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='WoW Train figure parmi les <a href="{sc}" rel="noopener">showcases d’opentransportdata.swiss</a>.', dl='Liaisons suisses')
T['it'] = dict(dir='it/treni-svizzera', tpl='it/rutas/index.html', home='/it/', all_routes='/it/rutas/', back='&larr; Tutte le tratte', suffix='it/',
   title='Orari dei treni in Svizzera con i dati aperti delle FFS · glosx.app',
   desc='Primo treno, ultimo treno, treni diretti al giorno e viaggio più veloce per {n} collegamenti ferroviari svizzeri, dall’orario aperto di opentransportdata.swiss (FFS). Tabella, CSV e guide delle tratte.',
   h1='Treni in Svizzera', sub='Primo e ultimo treno, treni diretti al giorno e viaggio più veloce per {n} collegamenti svizzeri, calcolati da glosx.app dall’orario aperto ufficiale di opentransportdata.swiss (FFS).',
   guides='Guide delle tratte in Svizzera', cols=['Tratta', 'Primo treno', 'Ultimo treno', 'Feriale', 'Sabato', 'Domenica', 'Più veloce'],
   src='Fonte: glosx.app, dall’orario aperto di opentransportdata.swiss (FFS).', csv='Scarica i dati in CSV',
   csvnote='(una riga per collegamento, direzione e tipo di giorno).', how='Come sono stati calcolati',
   li=['<strong>Fonte:</strong> l’orario GTFS ufficiale di <a href="{src}" rel="noopener">opentransportdata.swiss</a>, la piattaforma open data del trasporto pubblico svizzero, file {file}.',
       '<strong>Settimana di riferimento:</strong> martedì {wd} (feriale), sabato {sa} e domenica {su}. I lavori modificano alcuni servizi in altre date (ad esempio, a fine ottobre 2026 non c’erano treni tra Visp e Zermatt).',
       '<strong>Cosa viene contato:</strong> treni diretti di tutte le categorie (IC, IR, RE, regionali e treni di montagna) che fermano in entrambe le stazioni in quella direzione. Esclusi autobus, tram, battelli e funivie.',
       '<strong>Più veloce:</strong> il treno diretto più rapido del giorno feriale. Gli orari cambiano: controlla la tua data prima di partire.'],
   cite='Come citare questi dati', citetxt='Dati orari: opentransportdata.swiss (FFS), elaborati da <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='WoW Train è presente tra gli <a href="{sc}" rel="noopener">showcase di opentransportdata.swiss</a>.', dl='Collegamenti svizzeri')
T['ja'] = dict(dir='ja/swiss-trains', tpl='ja/rutas/index.html', home='/ja/', all_routes='/ja/rutas/', back='&larr; すべての路線', suffix='ja/',
   title='スイスの列車時刻（SBBオープンデータ）· glosx.app',
   desc='スイスの鉄道{n}区間の始発・終電・1日の直通本数・最速所要時間を、opentransportdata.swiss（SBB）のオープン時刻表から集計。表とCSV、路線ガイド付き。',
   h1='スイスの列車', sub='スイスの{n}区間について、始発・終電・1日の直通本数・最速所要時間を、opentransportdata.swiss（SBB）の公式オープン時刻表からglosx.appが集計しました。',
   guides='スイスの路線ガイド', cols=['区間', '始発', '終電', '平日', '土曜', '日曜', '最速'],
   src='出典：opentransportdata.swiss（SBB）のオープン時刻表をもとにglosx.appが作成。', csv='CSVでデータをダウンロード',
   csvnote='（区間・方向・曜日ごとに1行）。', how='集計方法',
   li=['<strong>出典：</strong><a href="{src}" rel="noopener">opentransportdata.swiss</a>（スイス公共交通のオープンデータ基盤）の公式GTFS時刻表、ファイル {file}。',
       '<strong>基準週：</strong>平日は{wd}（火）、土曜{sa}、日曜{su}。ほかの日は工事で運行が変わることがあります（例：2026年10月下旬はフィスプ–ツェルマット間の列車運休）。',
       '<strong>対象：</strong>その方向で両駅に停車する全種別（IC、IR、RE、普通、登山鉄道）の直通列車。バス・トラム・船・ロープウェイは含みません。',
       '<strong>最速：</strong>平日のいちばん速い直通列車。時刻は変わるため、乗車日の時刻を確認してください。'],
   cite='データの引用方法', citetxt='時刻表データ：opentransportdata.swiss（SBB）、<strong>glosx.app</strong>が加工、<a href="{url}">{url}</a>。',
   showcase='WoW Trainは<a href="{sc}" rel="noopener">opentransportdata.swissのショーケース</a>で紹介されています。', dl='スイスの区間')

fdate = lambda s, l: (lambda d: d.strftime('%d/%m/%Y') if l in ('es', 'fr', 'it') else f'{d.year}年{d.month}月{d.day}日' if l == 'ja' else d.strftime('%-d %B %Y'))(datetime.date.fromisoformat(s))
os.makedirs(os.path.join(ROOT, 'assets/data'), exist_ok=True)
with open(os.path.join(ROOT, 'assets/data/horarios-suiza.csv'), 'w', encoding='utf8', newline='') as f:
    w = csv.writer(f)
    w.writerow(['from', 'to', 'day', 'first_train', 'last_train', 'direct_trains', 'fastest_min', 'median_min', 'source', 'url'])
    for p in sorted(D['pairs'], key=lambda p: (p['from'], p['to'])):
        for day in ('weekday', 'saturday', 'sunday'):
            x = p.get(day)
            if x: w.writerow([p['from'], p['to'], day, x['first'], x['last'], x['n'], x['fastest_min'], x['median_min'], 'opentransportdata.swiss (SBB), processed by glosx.app', 'https://glosx.app/swiss-trains/'])

for lang, t in T.items():
    url = f"https://glosx.app/{t['dir']}/"
    tpl = open(os.path.join(ROOT, t['tpl']), encoding='utf8').read()
    head = tpl[:tpl.index('<nav>')]
    foot = tpl[tpl.index('<footer>'):tpl.index('</footer>') + 9]
    title = t['title']; desc = t['desc'].format(n=len(rows))
    head = re.sub(r'<title>.*?</title>', '<title>%s</title>' % html.escape(title, quote=False), head)
    for pat, val in [(r'<meta name="description"[^>]*>', '<meta name="description" content="%s" />' % html.escape(desc)),
                     (r'<link rel="canonical"[^>]*>', '<link rel="canonical" href="%s" />' % url),
                     (r'<meta property="og:title"[^>]*>', '<meta property="og:title" content="%s" />' % html.escape(title)),
                     (r'<meta property="og:description"[^>]*>', '<meta property="og:description" content="%s" />' % html.escape(desc)),
                     (r'<meta property="og:url"[^>]*>', '<meta property="og:url" content="%s" />' % url),
                     (r'<meta name="twitter:title"[^>]*>', '<meta name="twitter:title" content="%s" />' % html.escape(title)),
                     (r'<meta name="twitter:description"[^>]*>', '<meta name="twitter:description" content="%s" />' % html.escape(desc))]:
        head = re.sub(pat, val, head)
    head = re.sub(r'\s*<link rel="alternate" hreflang[^>]*>', '', head)
    alts = ''.join('\n  <link rel="alternate" hreflang="%s" href="https://glosx.app/%s/" />' % (l, T[l]['dir']) for l in T) + \
           '\n  <link rel="alternate" hreflang="x-default" href="https://glosx.app/%s/" />' % T['en']['dir']
    head = head.replace('<link rel="canonical" href="%s" />' % url, '<link rel="canonical" href="%s" />%s' % (url, alts), 1)
    ld = {'@context': 'https://schema.org', '@type': 'Dataset', 'name': title.split(' · ')[0], 'description': desc, 'url': url, 'inLanguage': lang,
          'isBasedOn': SRC, 'creator': {'@type': 'Organization', 'name': 'glosx.app', 'url': 'https://glosx.app/'},
          'citation': 'opentransportdata.swiss (SBB), processed by glosx.app', 'temporalCoverage': '%s/%s' % (REF['weekday'], REF['sunday']),
          'spatialCoverage': {'@type': 'Country', 'name': 'Switzerland'},
          'distribution': [{'@type': 'DataDownload', 'encodingFormat': 'text/csv', 'contentUrl': 'https://glosx.app/assets/data/horarios-suiza.csv'}]}
    head = head.replace('</head>', '<script type="application/ld+json">%s</script>\n<style>\n'
        '.hx{max-width:1100px;margin:0 auto;padding:8px 24px 56px}.hx h2{font-size:20px;margin:34px 0 10px}.hx p,.hx li{line-height:1.6;font-size:15px}\n'
        '.hx .tw{overflow-x:auto;border:1px solid rgba(20,21,26,.14);border-radius:12px;background:#fff}.hx table{border-collapse:collapse;width:100%%;min-width:760px;font-size:14px}\n'
        '.hx th,.hx td{padding:10px 12px;text-align:left;border-bottom:1px solid rgba(20,21,26,.08);white-space:nowrap}.hx th{font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#6b6c75;background:#faf8f5;position:sticky;top:0}\n'
        '.hx td:nth-child(n+3){font-variant-numeric:tabular-nums}.hx tr:last-child td{border-bottom:0}.hx a{color:#C10016}.hx .cita{background:#faf8f5;border-radius:12px;padding:14px 16px;font-size:14px}\n'
        '.hx a.bk{display:inline-block;background:#C10016;color:#fff;font-weight:700;font-size:13px;padding:7px 12px;border-radius:999px;text-decoration:none}.hx a.bk:hover{background:#A8000F}\n'
        '.hx .gl{display:flex;flex-wrap:wrap;gap:8px;padding:0;list-style:none}.hx .gl a{display:inline-block;padding:8px 14px;border:1px solid rgba(20,21,26,.14);border-radius:999px;text-decoration:none;color:#14151a;font-size:14px}.hx .gl a:hover{border-color:#C10016}\n'
        '</style>\n</head>' % json.dumps(ld, ensure_ascii=False))
    nav = '<nav>\n    <a href="%s">WoW Train</a>\n    <div class="nav-right"><a href="%s" style="font-weight:600;text-decoration:none;color:inherit">%s</a></div>\n  </nav>' % (t['home'], t['all_routes'], t['back'])
    gl = ''.join('<li><a href="/rutas/%s/%s">%s</a></li>' % (s, t['suffix'], ' &rarr; '.join(NAMES[lang].get(w, w.capitalize()) for w in s.split('-'))) for s in SWISS_GUIDES)
    tr = ''
    for p in rows:
        w = p['weekday']; s = p.get('saturday') or {}; u = p.get('sunday') or {}
        g = guide(p['from'], p['to'])
        name = '%s &rarr; %s' % (html.escape(p['from']), html.escape(p['to']))
        if g: name = '<a href="/rutas/%s/%s">%s</a>' % (g, t['suffix'], name)
        tr += '<tr><td>%s</td><td><a class="bk" href="%s" target="_blank" rel="noopener sponsored" aria-label="%s: %s" onclick="try{gtag(\'event\',\'omio_click\',{source:\'swiss_table\'})}catch(e){}">%s &rarr;</a></td><td>%s</td><td>%s</td><td>%d</td><td>%s</td><td>%s</td><td>%s</td></tr>\n' % (name, html.escape(omio(p['from'], p['to'], lang)), BOOK[lang][1], html.escape(p['from'] + ' – ' + p['to']), BOOK[lang][0], w['first'], w['last'], w['n'], s.get('n', '–'), u.get('n', '–'), dur(w['fastest_min']))
    li = ''.join('<li>%s</li>' % x.format(src=SRC, file=html.escape(D['source']['file']), wd=fdate(REF['weekday'], lang), sa=fdate(REF['saturday'], lang), su=fdate(REF['sunday'], lang)) for x in t['li'])
    body = '''<header>
    <h1>%s <span style="color:#C10016">· glosx.app</span></h1>
    <p>%s</p>
  </header>
  <main class="hx">
    <h2>%s</h2>
    <ul class="gl">%s</ul>
    <h2>%s</h2>
    <div class="tw"><table>
      <thead><tr>%s</tr></thead>
      <tbody>
%s      </tbody>
    </table></div>
    <p style="font-size:13px;color:#6b6c75;margin-top:8px">%s</p>
    <p><a href="/assets/data/horarios-suiza.csv" download>%s</a> %s</p>
    <h2>%s</h2>
    <ul>%s</ul>
    <h2>%s</h2>
    <p class="cita">%s</p>
    <p>%s</p>
  </main>
  ''' % (t['h1'], t['sub'].format(n=len(rows)), t['guides'], gl, t['dl'], ''.join('<th>%s</th>' % c for c in t['cols'][:1] + [''] + t['cols'][1:]), tr, t['src'],
         t['csv'], t['csvnote'], t['how'], li, t['cite'], t['citetxt'].format(url=url), t['showcase'].format(sc=SHOWCASE))
    out = head + nav + '\n  ' + body + foot + '\n</body>\n</html>\n'
    os.makedirs(os.path.join(ROOT, t['dir']), exist_ok=True)
    open(os.path.join(ROOT, t['dir'], 'index.html'), 'w', encoding='utf8').write(out)
    print(lang, url, 'filas', len(rows), 'guias', len(SWISS_GUIDES))
