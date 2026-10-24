#!/usr/bin/env python3
"""
Sección "Trenes en Suecia": página con las guías de rutas de Suecia + tabla de horarios (primer/último tren, trenes directos al día,
duración más rápida) calculada del GTFS abierto de Trafiklab / Samtrafiken (CC0), y CSV descargable.
Entrada: assets/data/horarios-suecia.json (scripts/horarios-suecia.py). Salida: sweden-trains/index.html (en) + es/fr/it/ja y assets/data/horarios-suecia.csv. Cabecera y estilos: se copian del índice de rutas de cada idioma.
Uso: python3 scripts/generate-sweden-trains.py   (desde la raíz del repo)
"""
import json, re, csv, html, os, datetime

ROOT = os.path.join(os.path.dirname(__file__), '..')
D = json.load(open(os.path.join(ROOT, 'assets/data/horarios-suecia.json'), encoding='utf8'))
REF = D['reference_week']
CITY = {'Stockholm C': 'stockholm', 'Göteborg C': 'gothenburg', 'Malmö C': 'malmo', 'København H': 'copenhagen', 'Oslo S': 'oslo'}
SLUGS = {d for d in os.listdir(os.path.join(ROOT, 'rutas')) if os.path.isfile(os.path.join(ROOT, 'rutas', d, 'index.html'))}
GUIDES = sorted(s for s in SLUGS if all(p in CITY.values() for p in s.split('-')))
NAMES = {'en': {}, 'es': {'stockholm': 'Estocolmo', 'copenhagen': 'Copenhague', 'gothenburg': 'Gotemburgo'}, 'fr': {'copenhagen': 'Copenhague', 'gothenburg': 'Göteborg'}, 'it': {'stockholm': 'Stoccolma', 'copenhagen': 'Copenaghen', 'gothenburg': 'Göteborg'}, 'ja': {'stockholm': 'ストックホルム', 'copenhagen': 'コペンハーゲン', 'oslo': 'オスロ', 'gothenburg': 'ヨーテボリ', 'prague': 'プラハ'}}
OMIO_SLUG = {'Stockholm C': 'stockholm', 'Göteborg C': 'gothenburg', 'Malmö C': 'malmo', 'Lund C': 'lund', 'Uppsala C': 'uppsala', 'Stockholm Arlanda': 'stockholm-arlanda', 'Linköping C': 'linkoping', 'Norrköping C': 'norrkoping', 'Västerås C': 'vasteras', 'Örebro C': 'orebro', 'Jönköping C': 'jonkoping', 'Karlstad C': 'karlstad', 'Sundsvall C': 'sundsvall', 'Umeå C': 'umea', 'Luleå C': 'lulea', 'Helsingborg C': 'helsingborg', 'Kalmar C': 'kalmar', 'Växjö': 'vaxjo', 'Gävle C': 'gavle', 'Östersund C': 'ostersund', 'Åre': 'are', 'Nässjö C': 'nassjo', 'Hässleholm C': 'hassleholm', 'Halmstad C': 'halmstad', 'Skövde C': 'skovde', 'Borlänge C': 'borlange', 'Falun C': 'falun', 'København H': 'copenhagen', 'Oslo S': 'oslo', 'Karlskrona C': 'karlskrona', 'Eskilstuna C': 'eskilstuna', 'Södertälje Syd': 'sodertalje', 'Boden C': 'boden', 'Abisko Östra': 'abisko', 'Abisko Turiststation': 'abisko'}
# conexiones con página oficial en el catálogo de Omio, por idioma (comprobado contra el backend el 24-oct-2026; ver omio-sweden-catalog.json)
CAT = {l: {tuple(x.split('|')) for x in v} for l, v in json.load(open(os.path.join(ROOT, 'scripts/omio-sweden-catalog.json'), encoding='utf8')).items()}
CAT_LANG = {'es': 'es', 'fr': 'fr', 'it': 'it', 'en': 'de', 'ja': 'de'}   # Omio no tiene catálogo en inglés ni japonés: página oficial en alemán
def has_omio(a, b, lang):
    k = tuple(sorted((a, b)))
    return k in CAT.get(CAT_LANG[lang], set())
def omio(a, b, lang):
    sl = lambda x: OMIO_SLUG.get(x, x.lower().replace(' ', '-'))
    return 'https://voxa-production-dc15.up.railway.app/affiliate/europe-train?from=%s&to=%s&src=sweden_table&lang=%s' % (sl(a), sl(b), CAT_LANG[lang])
BOOK = {'en': ('Book', 'Book on Omio'), 'es': ('Reservar', 'Reservar en Omio'), 'fr': ('Réserver', 'Réserver sur Omio'), 'it': ('Prenota', 'Prenota su Omio'), 'ja': ('予約', 'Omioで予約')}
SHOWCASE = 'https://data.Trafiklab / Samtrafiken (CC0)/en/showcase/wow-train'
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
 'en': dict(dir='sweden-trains', tpl='rutas/index.html', home='/', all_routes='/rutas/', back='&larr; All routes', suffix='',
   title='Train times in Sweden from open Trafiklab data · glosx.app',
   desc='First train, last train, direct trains per day and fastest journey for {n} rail connections in Sweden and to Copenhagen, Oslo and Narvik, from the national open timetable published by Trafiklab (CC0). Table and CSV, plus route guides.',
   h1='Trains in Sweden', sub='First and last train, direct trains per day and the fastest journey for {n} rail connections in Sweden (and to Copenhagen, Oslo and Narvik), calculated by glosx.app from the national open timetable published by Trafiklab.',
   guides='Sweden route guides', cols=['Trip', 'First train', 'Last train', 'Weekday', 'Saturday', 'Sunday', 'Fastest'],
   src='Source: glosx.app, from the national open timetable GTFS Sverige 2 (Trafiklab / Samtrafiken, CC0).', csv='Download the data as CSV',
   csvnote='(one row per connection, direction and type of day).', how='How it was calculated',
   li=['<strong>Source:</strong> the national timetable <a href="{src}" rel="noopener">GTFS Sverige 2</a>, published by Trafiklab (Samtrafiken) under the CC0 1.0 public-domain dedication.',
       '<strong>Reference week:</strong> Tuesday {wd} (weekday), Saturday {sa} and Sunday {su}, in the 2027 timetable. The night trains to Kiruna, Abisko and Narvik run in this timetable from 13 December 2026.',
       '<strong>What counts:</strong> direct trains (SJ, Snälltåget, Vy, VR, Öresundståg, Mälartåg, Norrtåg, Arlanda Express and regional trains) that stop at both stations in that direction, including night trains. Buses and ferries are not included.',
       '<strong>Fastest:</strong> the quickest direct train of the weekday. Times change with the timetable: check your date before you travel.'],
   cite='How to cite this data', citetxt='Timetable data: Trafiklab / Samtrafiken (CC0), processed by <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='glosx.app also publishes <a href="/norway-trains/">train times in Norway</a> and <a href="/swiss-trains/">in Switzerland</a>, and is featured in the <a href="{sc}" rel="noopener">showcases of opentransportdata.swiss (SBB)</a>.', dl='Connections in Sweden'),
 'es': dict(dir='es/trenes-suecia', tpl='es/rutas/index.html', home='/es/', all_routes='/es/rutas/', back='&larr; Todas las rutas', suffix='es/',
   title='Horarios de trenes en Suecia con datos abiertos de Trafiklab · glosx.app',
   desc='Primer tren, último tren, trenes directos al día y viaje más rápido de {n} conexiones ferroviarias en Suecia y hacia Copenhague, Oslo y Narvik, con el horario abierto nacional de Trafiklab (CC0). Tabla, CSV y guías de rutas.',
   h1='Trenes en Suecia', sub='Primer y último tren, trenes directos al día y el viaje más rápido de {n} conexiones en Suecia (y hacia Copenhague, Oslo y Narvik), calculados por glosx.app a partir del horario abierto nacional que publica Trafiklab.',
   guides='Guías de rutas en Suecia', cols=['Trayecto', 'Primer tren', 'Último tren', 'Laborable', 'Sábado', 'Domingo', 'Más rápido'],
   src='Fuente: glosx.app a partir del horario abierto nacional GTFS Sverige 2 (Trafiklab / Samtrafiken, CC0).', csv='Descargar los datos en CSV',
   csvnote='(una fila por conexión, sentido y tipo de día).', how='Cómo se han calculado',
   li=['<strong>Fuente:</strong> el horario nacional <a href="{src}" rel="noopener">GTFS Sverige 2</a>, publicado por Trafiklab (Samtrafiken) bajo dominio público CC0 1.0.',
       '<strong>Semana de referencia:</strong> martes {wd} (laborable), sábado {sa} y domingo {su}, del horario 2027. Los trenes nocturnos a Kiruna, Abisko y Narvik circulan en este horario desde el 13 de diciembre de 2026.',
       '<strong>Qué cuenta:</strong> trenes directos (SJ, Snälltåget, Vy, VR, Öresundståg, Mälartåg, Norrtåg, Arlanda Express y regionales) que paran en las dos estaciones en ese sentido, incluidos los nocturnos. No incluye autobuses ni ferris.',
       '<strong>Más rápido:</strong> el tren directo más rápido del día laborable. Los horarios cambian con cada temporada: confirma tu fecha antes de viajar.'],
   cite='Cómo citar estos datos', citetxt='Datos de horarios: Trafiklab / Samtrafiken (CC0), procesados por <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='glosx.app también publica los horarios de trenes en <a href="/es/trenes-noruega/">Noruega</a> y <a href="/es/trenes-suiza/">Suiza</a>, y figura en los <a href="{sc}" rel="noopener">showcases de opentransportdata.swiss (SBB)</a>.', dl='Conexiones en Suecia'),
 'fr': dict(dir='fr/trains-suede', tpl='fr/rutas/index.html', home='/fr/', all_routes='/fr/rutas/', back='&larr; Tous les trajets', suffix='fr/',
   title='Horaires des trains en Suède avec les données ouvertes de Trafiklab · glosx.app',
   desc='Premier train, dernier train, trains directs par jour et trajet le plus rapide pour {n} liaisons ferroviaires en Suède et vers Copenhague, Oslo et Narvik, d’après l’horaire ouvert national de Trafiklab (CC0). Tableau, CSV et guides.',
   h1='Trains en Suède', sub='Premier et dernier train, trains directs par jour et trajet le plus rapide pour {n} liaisons en Suède (et vers Copenhague, Oslo et Narvik), calculés par glosx.app à partir de l’horaire ouvert national publié par Trafiklab.',
   guides='Guides de trajets en Suède', cols=['Trajet', 'Premier train', 'Dernier train', 'Semaine', 'Samedi', 'Dimanche', 'Le plus rapide'],
   src='Source : glosx.app, d’après l’horaire ouvert national GTFS Sverige 2 (Trafiklab / Samtrafiken, CC0).', csv='Télécharger les données en CSV',
   csvnote='(une ligne par liaison, sens et type de jour).', how='Méthode de calcul',
   li=['<strong>Source :</strong> l’horaire national <a href="{src}" rel="noopener">GTFS Sverige 2</a>, publié par Trafiklab (Samtrafiken) dans le domaine public CC0 1.0.',
       '<strong>Semaine de référence :</strong> mardi {wd} (semaine), samedi {sa} et dimanche {su}, horaire 2027. Les trains de nuit vers Kiruna, Abisko et Narvik circulent dans cet horaire depuis le 13 décembre 2026.',
       '<strong>Ce qui est compté :</strong> les trains directs (SJ, Snälltåget, Vy, VR, Öresundståg, Mälartåg, Norrtåg, Arlanda Express et régionaux) qui s’arrêtent dans les deux gares dans ce sens, trains de nuit compris. Bus et ferries non inclus.',
       '<strong>Le plus rapide :</strong> le train direct le plus rapide du jour de semaine. Les horaires changent : vérifiez votre date avant de voyager.'],
   cite='Comment citer ces données', citetxt='Données horaires : Trafiklab / Samtrafiken (CC0), traitées par <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='glosx.app publie aussi les horaires des trains en <a href="/fr/trains-norvege/">Norvège</a> et en <a href="/fr/trains-suisse/">Suisse</a>, et figure parmi les <a href="{sc}" rel="noopener">showcases d’opentransportdata.swiss (CFF)</a>.', dl='Liaisons en Suède'),
 'it': dict(dir='it/treni-svezia', tpl='it/rutas/index.html', home='/it/', all_routes='/it/rutas/', back='&larr; Tutte le tratte', suffix='it/',
   title='Orari dei treni in Svezia con i dati aperti di Trafiklab · glosx.app',
   desc='Primo treno, ultimo treno, treni diretti al giorno e viaggio più veloce per {n} collegamenti ferroviari in Svezia e verso Copenaghen, Oslo e Narvik, dall’orario aperto nazionale di Trafiklab (CC0). Tabella, CSV e guide.',
   h1='Treni in Svezia', sub='Primo e ultimo treno, treni diretti al giorno e viaggio più veloce per {n} collegamenti in Svezia (e verso Copenaghen, Oslo e Narvik), calcolati da glosx.app dall’orario aperto nazionale pubblicato da Trafiklab.',
   guides='Guide delle tratte in Svezia', cols=['Tratta', 'Primo treno', 'Ultimo treno', 'Feriale', 'Sabato', 'Domenica', 'Più veloce'],
   src='Fonte: glosx.app, dall’orario aperto nazionale GTFS Sverige 2 (Trafiklab / Samtrafiken, CC0).', csv='Scarica i dati in CSV',
   csvnote='(una riga per collegamento, direzione e tipo di giorno).', how='Come sono stati calcolati',
   li=['<strong>Fonte:</strong> l’orario nazionale <a href="{src}" rel="noopener">GTFS Sverige 2</a>, pubblicato da Trafiklab (Samtrafiken) in pubblico dominio CC0 1.0.',
       '<strong>Settimana di riferimento:</strong> martedì {wd} (feriale), sabato {sa} e domenica {su}, orario 2027. I treni notturni per Kiruna, Abisko e Narvik circolano in questo orario dal 13 dicembre 2026.',
       '<strong>Cosa viene contato:</strong> treni diretti (SJ, Snälltåget, Vy, VR, Öresundståg, Mälartåg, Norrtåg, Arlanda Express e regionali) che fermano in entrambe le stazioni in quella direzione, notturni compresi. Esclusi autobus e traghetti.',
       '<strong>Più veloce:</strong> il treno diretto più rapido del giorno feriale. Gli orari cambiano: controlla la tua data prima di partire.'],
   cite='Come citare questi dati', citetxt='Dati orari: Trafiklab / Samtrafiken (CC0), elaborati da <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='glosx.app pubblica anche gli orari dei treni in <a href="/it/treni-norvegia/">Norvegia</a> e in <a href="/it/treni-svizzera/">Svizzera</a>, ed è presente tra gli <a href="{sc}" rel="noopener">showcase di opentransportdata.swiss (FFS)</a>.', dl='Collegamenti in Svezia'),
 'ja': dict(dir='ja/sweden-trains', tpl='ja/rutas/index.html', home='/ja/', all_routes='/ja/rutas/', back='&larr; すべての路線', suffix='ja/',
   title='スウェーデンの列車時刻（Trafiklabオープンデータ）· glosx.app',
   desc='スウェーデン国内とコペンハーゲン・オスロ・ナルヴィク方面の鉄道{n}区間の始発・終電・1日の直通本数・最速所要時間を、Trafiklab（CC0）の全国オープン時刻表から集計。表とCSV、路線ガイド付き。',
   h1='スウェーデンの列車', sub='スウェーデンの{n}区間（コペンハーゲン・オスロ・ナルヴィク方面を含む）について、始発・終電・1日の直通本数・最速所要時間を、Trafiklabが公開する全国オープン時刻表からglosx.appが集計しました。',
   guides='スウェーデンの路線ガイド', cols=['区間', '始発', '終電', '平日', '土曜', '日曜', '最速'],
   src='出典：Trafiklab / Samtrafiken（CC0）の全国オープン時刻表GTFS Sverige 2をもとにglosx.appが作成。', csv='CSVでデータをダウンロード',
   csvnote='（区間・方向・曜日ごとに1行）。', how='集計方法',
   li=['<strong>出典：</strong>Trafiklab（Samtrafiken）がCC0 1.0（パブリックドメイン）で公開する全国時刻表<a href="{src}" rel="noopener">GTFS Sverige 2</a>。',
       '<strong>基準週：</strong>2027年ダイヤの平日{wd}（火）、土曜{sa}、日曜{su}。キルナ・アビスコ・ナルヴィク行きの夜行列車は2026年12月13日からこのダイヤで運行。',
       '<strong>対象：</strong>その方向で両駅に停車する直通列車（SJ、Snälltåget、Vy、VR、Öresundståg、Mälartåg、Norrtåg、アーランダ・エクスプレス、地域列車。夜行列車を含む）。バス・フェリーは含みません。',
       '<strong>最速：</strong>平日のいちばん速い直通列車。時刻は変わるため、乗車日の時刻を確認してください。'],
   cite='データの引用方法', citetxt='時刻表データ：Trafiklab / Samtrafiken（CC0）、<strong>glosx.app</strong>が加工、<a href="{url}">{url}</a>。',
   showcase='glosx.appは<a href="/ja/norway-trains/">ノルウェー</a>と<a href="/ja/swiss-trains/">スイス</a>の列車時刻も公開しており、<a href="{sc}" rel="noopener">opentransportdata.swiss（SBB）のショーケース</a>で紹介されています。', dl='スウェーデンの区間'),
}

fdate = lambda s, l: (lambda d: d.strftime('%d/%m/%Y') if l in ('es', 'fr', 'it') else f'{d.year}年{d.month}月{d.day}日' if l == 'ja' else d.strftime('%-d %B %Y'))(datetime.date.fromisoformat(s))
os.makedirs(os.path.join(ROOT, 'assets/data'), exist_ok=True)
with open(os.path.join(ROOT, 'assets/data/horarios-suecia.csv'), 'w', encoding='utf8', newline='') as f:
    w = csv.writer(f)
    w.writerow(['from', 'to', 'day', 'first_train', 'last_train', 'direct_trains', 'fastest_min', 'median_min', 'source', 'url'])
    for p in sorted(D['pairs'], key=lambda p: (p['from'], p['to'])):
        for day in ('weekday', 'saturday', 'sunday'):
            x = p.get(day)
            if x: w.writerow([p['from'], p['to'], day, x['first'], x['last'], x['n'], x['fastest_min'], x['median_min'], 'Trafiklab / Samtrafiken (CC0), processed by glosx.app', 'https://glosx.app/sweden-trains/'])

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
          'citation': 'Trafiklab / Samtrafiken (CC0), processed by glosx.app', 'temporalCoverage': '%s/%s' % (REF['weekday'], REF['sunday']),
          'spatialCoverage': {'@type': 'Country', 'name': 'Sweden'},
          'distribution': [{'@type': 'DataDownload', 'encodingFormat': 'text/csv', 'contentUrl': 'https://glosx.app/assets/data/horarios-suecia.csv'}]}
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
        bkc = ('<a class="bk" href="%s" target="_blank" rel="noopener sponsored" aria-label="%s: %s" onclick="try{gtag(\'event\',\'omio_click\',{source:\'sweden_table\'})}catch(e){}">%s &rarr;</a>' % (html.escape(omio(p['from'], p['to'], lang)), BOOK[lang][1], html.escape(p['from'] + ' – ' + p['to']), BOOK[lang][0])) if has_omio(p['from'], p['to'], lang) else ''
        tr += '<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%d</td><td>%s</td><td>%s</td><td>%s</td></tr>\n' % (name, bkc, w['first'], w['last'], w['n'], s.get('n', '–'), u.get('n', '–'), dur(w['fastest_min']))
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
    <p><a href="/assets/data/horarios-suecia.csv" download>%s</a> %s</p>
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
    print(lang, url, 'filas', len(rows), 'guias', len(GUIDES))
