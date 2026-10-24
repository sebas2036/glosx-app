#!/usr/bin/env python3
"""
Sección "Trenes en Austria": página con las guías de rutas de Austria + tabla de horarios (primer/último tren, trenes directos al día,
duración más rápida) calculada del GTFS Soll-Fahrplan de ÖBB Open Data (CC BY 4.0), y CSV descargable.
Entrada: assets/data/horarios-austria.json (scripts/horarios-austria.py). Salida: austria-trains/index.html (en) + es/fr/it/ja y assets/data/horarios-austria.csv. Cabecera y estilos: se copian del índice de rutas de cada idioma.
Uso: python3 scripts/generate-austria-trains.py   (desde la raíz del repo)
"""
import json, re, csv, html, os, datetime

ROOT = os.path.join(os.path.dirname(__file__), '..')
D = json.load(open(os.path.join(ROOT, 'assets/data/horarios-austria.json'), encoding='utf8'))
REF = D['reference_week']
CITY = {'Wien Hbf': 'vienna', 'Salzburg': 'salzburg', 'Innsbruck': 'innsbruck', 'Graz': 'graz', 'Krems': 'krems'}
SLUGS = {d for d in os.listdir(os.path.join(ROOT, 'rutas')) if os.path.isfile(os.path.join(ROOT, 'rutas', d, 'index.html'))}
GUIDES = sorted(s for s in SLUGS if all(p in CITY.values() for p in s.split('-')))
NAMES = {'en': {}, 'es': {'vienna': 'Viena'}, 'fr': {'vienna': 'Vienne'}, 'it': {'vienna': 'Vienna'}, 'ja': {'vienna': 'ウィーン', 'salzburg': 'ザルツブルク', 'innsbruck': 'インスブルック', 'graz': 'グラーツ', 'krems': 'クレムス'}}
OMIO_SLUG = {'Wien Hbf': 'vienna', 'Wien Meidling': 'vienna', 'Wien Westbahnhof': 'vienna', 'Vienna Airport': 'vienna-airport', 'Schwarzach-St. Veit': 'schwarzach-st-veit', 'St. Anton am Arlberg': 'st-anton-am-arlberg'}
# conexiones con página oficial en el catálogo de Omio, por idioma (comprobado contra el backend el 24-oct-2026; ver omio-austria-catalog.json)
CAT = {l: {tuple(x.split('|')) for x in v} for l, v in json.load(open(os.path.join(ROOT, 'scripts/omio-austria-catalog.json'), encoding='utf8')).items()}
CAT_LANG = {'es': 'es', 'fr': 'fr', 'it': 'it', 'en': 'de', 'ja': 'de'}   # Omio no tiene catálogo en inglés ni japonés: página oficial en alemán
import unicodedata
def slug(x): return re.sub(r'[^a-z0-9]+', '-', ''.join(c for c in unicodedata.normalize('NFD', x.lower()) if unicodedata.category(c) != 'Mn')).strip('-')
def has_omio(a, b, lang):
    k = tuple(sorted((a, b)))
    return k in CAT.get(CAT_LANG[lang], set())
def omio(a, b, lang):
    sl = lambda x: OMIO_SLUG.get(x, slug(x))
    return 'https://voxa-production-dc15.up.railway.app/affiliate/europe-train?from=%s&to=%s&src=austria_table&lang=%s' % (sl(a), sl(b), CAT_LANG[lang])
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
 'en': dict(dir='austria-trains', tpl='rutas/index.html', home='/', all_routes='/rutas/', back='&larr; All routes', suffix='',
   title='Train times in Austria from open ÖBB data · glosx.app',
   desc='First train, last train, direct trains per day and fastest journey for {n} rail connections in Austria, from the open ÖBB timetable (GTFS, CC BY 4.0). Table and CSV.',
   h1='Trains in Austria', sub='First and last train, direct trains per day and the fastest journey for {n} rail connections in Austria, from Vienna to the Alps, calculated by glosx.app from the open timetable published by ÖBB.',
   guides='Austria route guides', cols=['Trip', 'First train', 'Last train', 'Weekday', 'Saturday', 'Sunday', 'Fastest'],
   src='Source: glosx.app, from the open ÖBB timetable (Datenquelle: ÖBB, CC BY 4.0).', csv='Download the data as CSV',
   csvnote='(one row per connection, direction and type of day).', how='How it was calculated',
   li=['<strong>Source:</strong> the GTFS timetable (Soll-Fahrplan 2026) published by <a href="{src}" rel="noopener">ÖBB Open Data</a> under the Creative Commons Attribution 4.0 licence. It covers ÖBB passenger trains, the City Airport Train and the Montafonerbahn.',
       '<strong>Reference week:</strong> Tuesday {wd} (weekday), Saturday {sa} and Sunday {su}.',
       '<strong>What counts:</strong> direct trains (Railjet, Intercity, Nightjet, regional and S-Bahn) that stop at both stations in that direction, including night trains. Private operators such as WESTbahn are not in this feed, and buses are not included.',
       '<strong>Fastest:</strong> the quickest direct train of the weekday. Times change with the timetable: check your date before you travel.'],
   cite='How to cite this data', citetxt='Timetable data: ÖBB Open Data (CC BY 4.0), processed by <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='glosx.app also publishes train times in <a href="/swiss-trains/">Switzerland</a>, <a href="/norway-trains/">Norway</a>, <a href="/sweden-trains/">Sweden</a> and <a href="/finland-trains/">Finland</a>, and is featured in the <a href="{sc}" rel="noopener">showcases of opentransportdata.swiss (SBB)</a>.', dl='Connections in Austria'),
 'es': dict(dir='es/trenes-austria', tpl='es/rutas/index.html', home='/es/', all_routes='/es/rutas/', back='&larr; Todas las rutas', suffix='es/',
   title='Horarios de trenes en Austria con datos abiertos de ÖBB · glosx.app',
   desc='Primer tren, último tren, trenes directos al día y viaje más rápido de {n} conexiones ferroviarias en Austria, con el horario abierto de ÖBB (GTFS, CC BY 4.0). Tabla y CSV.',
   h1='Trenes en Austria', sub='Primer y último tren, trenes directos al día y el viaje más rápido de {n} conexiones en Austria, de Viena a los Alpes, calculados por glosx.app a partir del horario abierto que publica ÖBB.',
   guides='Guías de rutas en Austria', cols=['Trayecto', 'Primer tren', 'Último tren', 'Laborable', 'Sábado', 'Domingo', 'Más rápido'],
   src='Fuente: glosx.app a partir del horario abierto de ÖBB (Datenquelle: ÖBB, CC BY 4.0).', csv='Descargar los datos en CSV',
   csvnote='(una fila por conexión, sentido y tipo de día).', how='Cómo se han calculado',
   li=['<strong>Fuente:</strong> el horario GTFS (Soll-Fahrplan 2026) que publica <a href="{src}" rel="noopener">ÖBB Open Data</a> con licencia Creative Commons Atribución 4.0. Incluye los trenes de pasajeros de ÖBB, el City Airport Train y el Montafonerbahn.',
       '<strong>Semana de referencia:</strong> martes {wd} (laborable), sábado {sa} y domingo {su}.',
       '<strong>Qué cuenta:</strong> trenes directos (Railjet, Intercity, Nightjet, regionales y S-Bahn) que paran en las dos estaciones en ese sentido, incluidos los nocturnos. Los operadores privados como WESTbahn no están en este horario, y no incluye autobuses.',
       '<strong>Más rápido:</strong> el tren directo más rápido del día laborable. Los horarios cambian con cada temporada: confirma tu fecha antes de viajar.'],
   cite='Cómo citar estos datos', citetxt='Datos de horarios: ÖBB Open Data (CC BY 4.0), procesados por <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='glosx.app también publica los horarios de trenes en <a href="/es/trenes-suiza/">Suiza</a>, <a href="/es/trenes-noruega/">Noruega</a>, <a href="/es/trenes-suecia/">Suecia</a> y <a href="/es/trenes-finlandia/">Finlandia</a>, y figura en los <a href="{sc}" rel="noopener">showcases de opentransportdata.swiss (SBB)</a>.', dl='Conexiones en Austria'),
 'fr': dict(dir='fr/trains-autriche', tpl='fr/rutas/index.html', home='/fr/', all_routes='/fr/rutas/', back='&larr; Tous les trajets', suffix='fr/',
   title='Horaires des trains en Autriche avec les données ouvertes des ÖBB · glosx.app',
   desc='Premier train, dernier train, trains directs par jour et trajet le plus rapide pour {n} liaisons ferroviaires en Autriche, d’après l’horaire ouvert des ÖBB (GTFS, CC BY 4.0). Tableau et CSV.',
   h1='Trains en Autriche', sub='Premier et dernier train, trains directs par jour et trajet le plus rapide pour {n} liaisons en Autriche, de Vienne aux Alpes, calculés par glosx.app à partir de l’horaire ouvert publié par les ÖBB.',
   guides='Guides de trajets en Autriche', cols=['Trajet', 'Premier train', 'Dernier train', 'Semaine', 'Samedi', 'Dimanche', 'Le plus rapide'],
   src='Source : glosx.app, d’après l’horaire ouvert des ÖBB (Datenquelle : ÖBB, CC BY 4.0).', csv='Télécharger les données en CSV',
   csvnote='(une ligne par liaison, sens et type de jour).', how='Méthode de calcul',
   li=['<strong>Source :</strong> l’horaire GTFS (Soll-Fahrplan 2026) publié par <a href="{src}" rel="noopener">ÖBB Open Data</a> sous licence Creative Commons Attribution 4.0. Il couvre les trains voyageurs des ÖBB, le City Airport Train et la Montafonerbahn.',
       '<strong>Semaine de référence :</strong> mardi {wd} (semaine), samedi {sa} et dimanche {su}.',
       '<strong>Ce qui est compté :</strong> les trains directs (Railjet, Intercity, Nightjet, régionaux et S-Bahn) qui s’arrêtent dans les deux gares dans ce sens, trains de nuit compris. Les opérateurs privés comme WESTbahn ne figurent pas dans cet horaire, et les bus ne sont pas inclus.',
       '<strong>Le plus rapide :</strong> le train direct le plus rapide du jour de semaine. Les horaires changent : vérifiez votre date avant de voyager.'],
   cite='Comment citer ces données', citetxt='Données horaires : ÖBB Open Data (CC BY 4.0), traitées par <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='glosx.app publie aussi les horaires des trains en <a href="/fr/trains-suisse/">Suisse</a>, en <a href="/fr/trains-norvege/">Norvège</a>, en <a href="/fr/trains-suede/">Suède</a> et en <a href="/fr/trains-finlande/">Finlande</a>, et figure parmi les <a href="{sc}" rel="noopener">showcases d’opentransportdata.swiss (CFF)</a>.', dl='Liaisons en Autriche'),
 'it': dict(dir='it/treni-austria', tpl='it/rutas/index.html', home='/it/', all_routes='/it/rutas/', back='&larr; Tutte le tratte', suffix='it/',
   title='Orari dei treni in Austria con i dati aperti delle ÖBB · glosx.app',
   desc='Primo treno, ultimo treno, treni diretti al giorno e viaggio più veloce per {n} collegamenti ferroviari in Austria, dall’orario aperto delle ÖBB (GTFS, CC BY 4.0). Tabella e CSV.',
   h1='Treni in Austria', sub='Primo e ultimo treno, treni diretti al giorno e viaggio più veloce per {n} collegamenti in Austria, da Vienna alle Alpi, calcolati da glosx.app dall’orario aperto pubblicato dalle ÖBB.',
   guides='Guide delle tratte in Austria', cols=['Tratta', 'Primo treno', 'Ultimo treno', 'Feriale', 'Sabato', 'Domenica', 'Più veloce'],
   src='Fonte: glosx.app, dall’orario aperto delle ÖBB (Datenquelle: ÖBB, CC BY 4.0).', csv='Scarica i dati in CSV',
   csvnote='(una riga per collegamento, direzione e tipo di giorno).', how='Come sono stati calcolati',
   li=['<strong>Fonte:</strong> l’orario GTFS (Soll-Fahrplan 2026) pubblicato da <a href="{src}" rel="noopener">ÖBB Open Data</a> con licenza Creative Commons Attribuzione 4.0. Comprende i treni passeggeri delle ÖBB, il City Airport Train e la Montafonerbahn.',
       '<strong>Settimana di riferimento:</strong> martedì {wd} (feriale), sabato {sa} e domenica {su}.',
       '<strong>Cosa viene contato:</strong> treni diretti (Railjet, Intercity, Nightjet, regionali e S-Bahn) che fermano in entrambe le stazioni in quella direzione, notturni compresi. Gli operatori privati come WESTbahn non sono in questo orario, ed esclusi gli autobus.',
       '<strong>Più veloce:</strong> il treno diretto più rapido del giorno feriale. Gli orari cambiano: controlla la tua data prima di partire.'],
   cite='Come citare questi dati', citetxt='Dati orari: ÖBB Open Data (CC BY 4.0), elaborati da <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='glosx.app pubblica anche gli orari dei treni in <a href="/it/treni-svizzera/">Svizzera</a>, in <a href="/it/treni-norvegia/">Norvegia</a>, in <a href="/it/treni-svezia/">Svezia</a> e in <a href="/it/treni-finlandia/">Finlandia</a>, ed è presente tra gli <a href="{sc}" rel="noopener">showcase di opentransportdata.swiss (FFS)</a>.', dl='Collegamenti in Austria'),
 'ja': dict(dir='ja/austria-trains', tpl='ja/rutas/index.html', home='/ja/', all_routes='/ja/rutas/', back='&larr; すべての路線', suffix='ja/',
   title='オーストリアの列車時刻（ÖBBオープンデータ）· glosx.app',
   desc='オーストリアの鉄道{n}区間の始発・終電・1日の直通本数・最速所要時間を、ÖBBのオープン時刻表（GTFS、CC BY 4.0）から集計。表とCSV付き。',
   h1='オーストリアの列車', sub='ウィーンからアルプスまで、オーストリアの{n}区間について、始発・終電・1日の直通本数・最速所要時間を、ÖBBが公開するオープン時刻表からglosx.appが集計しました。',
   guides='オーストリアの路線ガイド', cols=['区間', '始発', '終電', '平日', '土曜', '日曜', '最速'],
   src='出典：ÖBBのオープン時刻表（Datenquelle: ÖBB、CC BY 4.0）をもとにglosx.appが作成。', csv='CSVでデータをダウンロード',
   csvnote='（区間・方向・曜日ごとに1行）。', how='集計方法',
   li=['<strong>出典：</strong><a href="{src}" rel="noopener">ÖBB Open Data</a>が公開するGTFS時刻表（Soll-Fahrplan 2026、CC BY 4.0）。ÖBBの旅客列車、City Airport Train、モンタフォン鉄道を含みます。',
       '<strong>基準週：</strong>平日は{wd}（火）、土曜{sa}、日曜{su}。',
       '<strong>対象：</strong>その方向で両駅に停車する直通列車（Railjet、インターシティ、ナイトジェット、地域列車、Sバーン。夜行列車を含む）。WESTbahnなどの民間事業者とバスは含みません。',
       '<strong>最速：</strong>平日のいちばん速い直通列車。時刻は変わるため、乗車日の時刻を確認してください。'],
   cite='データの引用方法', citetxt='時刻表データ：ÖBB Open Data（CC BY 4.0）、<strong>glosx.app</strong>が加工、<a href="{url}">{url}</a>。',
   showcase='glosx.appは<a href="/ja/swiss-trains/">スイス</a>・<a href="/ja/norway-trains/">ノルウェー</a>・<a href="/ja/sweden-trains/">スウェーデン</a>・<a href="/ja/finland-trains/">フィンランド</a>の列車時刻も公開しており、<a href="{sc}" rel="noopener">opentransportdata.swiss（SBB）のショーケース</a>で紹介されています。', dl='オーストリアの区間'),
}

fdate = lambda s, l: (lambda d: d.strftime('%d/%m/%Y') if l in ('es', 'fr', 'it') else f'{d.year}年{d.month}月{d.day}日' if l == 'ja' else d.strftime('%-d %B %Y'))(datetime.date.fromisoformat(s))
os.makedirs(os.path.join(ROOT, 'assets/data'), exist_ok=True)
with open(os.path.join(ROOT, 'assets/data/horarios-austria.csv'), 'w', encoding='utf8', newline='') as f:
    w = csv.writer(f)
    w.writerow(['from', 'to', 'day', 'first_train', 'last_train', 'direct_trains', 'fastest_min', 'median_min', 'source', 'url'])
    for p in sorted(D['pairs'], key=lambda p: (p['from'], p['to'])):
        for day in ('weekday', 'saturday', 'sunday'):
            x = p.get(day)
            if x: w.writerow([p['from'], p['to'], day, x['first'], x['last'], x['n'], x['fastest_min'], x['median_min'], 'ÖBB Open Data (CC BY 4.0), processed by glosx.app', 'https://glosx.app/austria-trains/'])

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
          'citation': 'ÖBB Open Data (CC BY 4.0), processed by glosx.app', 'temporalCoverage': '%s/%s' % (REF['weekday'], REF['sunday']),
          'spatialCoverage': {'@type': 'Country', 'name': 'Austria'},
          'distribution': [{'@type': 'DataDownload', 'encodingFormat': 'text/csv', 'contentUrl': 'https://glosx.app/assets/data/horarios-austria.csv'}]}
    head = head.replace('</head>', '<script type="application/ld+json">%s</script>\n<style>\n'
        '.hx{max-width:1100px;margin:0 auto;padding:8px 24px 56px}.hx h2{font-size:20px;margin:34px 0 10px}.hx p,.hx li{line-height:1.6;font-size:15px}\n'
        '.hx .tw{overflow-x:auto;border:1px solid rgba(20,21,26,.14);border-radius:12px;background:#fff}.hx table{border-collapse:collapse;width:100%%;min-width:760px;font-size:14px}\n'
        '.hx th,.hx td{padding:10px 12px;text-align:left;border-bottom:1px solid rgba(20,21,26,.08);white-space:nowrap}.hx th{font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#6b6c75;background:#faf8f5;position:sticky;top:0}\n'
        '.hx td:nth-child(n+3){font-variant-numeric:tabular-nums}.hx tr:last-child td{border-bottom:0}.hx a{color:#C10016}.hx .cita{background:#faf8f5;border-radius:12px;padding:14px 16px;font-size:14px}\n'
        '.hx a.bk{display:inline-block;background:#C10016;color:#fff;font-weight:700;font-size:13px;padding:7px 12px;border-radius:999px;text-decoration:none}.hx a.bk:hover{background:#A8000F}\n'
        '.hx .gl{display:flex;flex-wrap:wrap;gap:8px;padding:0;list-style:none}.hx .gl a{display:inline-block;padding:8px 14px;border:1px solid rgba(20,21,26,.14);border-radius:999px;text-decoration:none;color:#14151a;font-size:14px}.hx .gl a:hover{border-color:#C10016}\n'
        '</style>\n</head>' % json.dumps(ld, ensure_ascii=False))
    nav = '<nav>\n    <a href="%s">WoW Train</a>\n    <div class="nav-right"><a href="%s" style="font-weight:600;text-decoration:none;color:inherit">%s</a></div>\n  </nav>' % (t['home'], t['all_routes'], t['back'])
    gl = ''.join('<li><a href="/rutas/%s/%s">%s</a></li>' % (s, t['suffix'], ' &rarr; '.join(NAMES[lang].get(w, w.capitalize()) for w in s.split('-'))) for s in GUIDES)
    tr = ''
    for p in rows:
        w = p['weekday']; s = p.get('saturday') or {}; u = p.get('sunday') or {}
        g = guide(p['from'], p['to'])
        name = '%s &rarr; %s' % (html.escape(p['from']), html.escape(p['to']))
        if g: name = '<a href="/rutas/%s/%s">%s</a>' % (g, t['suffix'], name)
        bkc = ('<a class="bk" href="%s" target="_blank" rel="noopener sponsored" aria-label="%s: %s" onclick="try{gtag(\'event\',\'omio_click\',{source:\'austria_table\'})}catch(e){}">%s &rarr;</a>' % (html.escape(omio(p['from'], p['to'], lang)), BOOK[lang][1], html.escape(p['from'] + ' – ' + p['to']), BOOK[lang][0])) if has_omio(p['from'], p['to'], lang) else ''
        tr += '<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%d</td><td>%s</td><td>%s</td><td>%s</td></tr>\n' % (name, bkc, w['first'], w['last'], w['n'], s.get('n', '–'), u.get('n', '–'), dur(w['fastest_min']))
    li = ''.join('<li>%s</li>' % x.format(src=SRC, file=html.escape(D['source']['file']), wd=fdate(REF['weekday'], lang), sa=fdate(REF['saturday'], lang), su=fdate(REF['sunday'], lang)) for x in t['li'])
    body = '''<header>
    <h1>%s <span style="color:#C10016">· glosx.app</span></h1>
    <p>%s</p>
  </header>
  <main class="hx">
    <h2>%s</h2>
    <ul class="gl">%s</ul>
    %s<h2>%s</h2>
    <div class="tw"><table>
      <thead><tr>%s</tr></thead>
      <tbody>
%s      </tbody>
    </table></div>
    <p style="font-size:13px;color:#6b6c75;margin-top:8px">%s</p>
    <p><a href="/assets/data/horarios-austria.csv" download>%s</a> %s</p>
    <h2>%s</h2>
    <ul>%s</ul>
    <h2>%s</h2>
    <p class="cita">%s</p>
    <p>%s</p>
  </main>
  ''' % (t['h1'], t['sub'].format(n=len(rows)), t['guides'], gl, '', t['dl'], ''.join('<th>%s</th>' % c for c in t['cols'][:1] + [''] + t['cols'][1:]), tr, t['src'],
         t['csv'], t['csvnote'], t['how'], li, t['cite'], t['citetxt'].format(url=url), t['showcase'].format(sc=SHOWCASE))
    out = head + nav + '\n  ' + body + foot + '\n</body>\n</html>\n'
    os.makedirs(os.path.join(ROOT, t['dir']), exist_ok=True)
    open(os.path.join(ROOT, t['dir'], 'index.html'), 'w', encoding='utf8').write(out)
    print(lang, url, 'filas', len(rows), 'guias', len(GUIDES))
