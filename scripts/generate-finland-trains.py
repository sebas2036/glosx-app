#!/usr/bin/env python3
"""
Sección "Trenes en Finlandia": página con las guías de rutas de Finlandia + tabla de horarios (primer/último tren, trenes directos al día,
duración más rápida) calculada del GTFS abierto de Digitraffic / Fintraffic (CC BY 4.0), y CSV descargable.
Entrada: assets/data/horarios-finlandia.json (scripts/horarios-finlandia.py). Salida: finland-trains/index.html (en) + es/fr/it/ja y assets/data/horarios-finlandia.csv. Cabecera y estilos: se copian del índice de rutas de cada idioma.
Uso: python3 scripts/generate-finland-trains.py   (desde la raíz del repo)
"""
import json, re, csv, html, os, datetime

ROOT = os.path.join(os.path.dirname(__file__), '..')
D = json.load(open(os.path.join(ROOT, 'assets/data/horarios-finlandia.json'), encoding='utf8'))
REF = D['reference_week']
CITY = {'Helsinki': 'helsinki', 'Tampere': 'tampere', 'Turku': 'turku', 'Rovaniemi': 'rovaniemi', 'Oulu': 'oulu'}
SLUGS = {d for d in os.listdir(os.path.join(ROOT, 'rutas')) if os.path.isfile(os.path.join(ROOT, 'rutas', d, 'index.html'))}
GUIDES = sorted(s for s in SLUGS if all(p in CITY.values() for p in s.split('-')))
NAMES = {'en': {}, 'es': {}, 'fr': {}, 'it': {}, 'ja': {'helsinki': 'ヘルシンキ', 'tampere': 'タンペレ', 'turku': 'トゥルク', 'rovaniemi': 'ロヴァニエミ', 'oulu': 'オウル'}}
OMIO_SLUG = {'Helsinki Airport': 'helsinki-airport', 'Hämeenlinna': 'hameenlinna', 'Jyväskylä': 'jyvaskyla', 'Kemijärvi': 'kemijarvi', 'Riihimäki': 'riihimaki', 'Turku satama': 'turku', 'Seinäjoki': 'seinajoki'}
# conexiones con página oficial en el catálogo de Omio, por idioma (comprobado contra el backend el 24-oct-2026; ver omio-finland-catalog.json)
CAT = {l: {tuple(x.split('|')) for x in v} for l, v in json.load(open(os.path.join(ROOT, 'scripts/omio-finland-catalog.json'), encoding='utf8')).items()}
CAT_LANG = {'es': 'es', 'fr': 'fr', 'it': 'it', 'en': 'de', 'ja': 'de'}   # Omio no tiene catálogo en inglés ni japonés: página oficial en alemán
def has_omio(a, b, lang):
    k = tuple(sorted((a, b)))
    return k in CAT.get(CAT_LANG[lang], set())
def omio(a, b, lang):
    sl = lambda x: OMIO_SLUG.get(x, x.lower().replace(' ', '-'))
    return 'https://voxa-production-dc15.up.railway.app/affiliate/europe-train?from=%s&to=%s&src=finland_table&lang=%s' % (sl(a), sl(b), CAT_LANG[lang])
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


# Bloque "Qué hacer en Laponia": excursiones de Klook vía el backend (marker de afiliado). Sin precios ni puntuaciones (cambian).
LAP = {
 'en': ('What to do in Lapland', 'Many travellers take the train to Rovaniemi for the northern lights and Santa Claus Village. The aurora season runs from late August to early April.', [('tours', 'Lapland tours', 'Northern lights, husky and reindeer tours from Rovaniemi'), ('santa', 'Santa Claus Village', 'Guided visit from central Rovaniemi'), ('daytrips', 'Day trips in Lapland', 'Excursions and activities for a day')], 'See on Klook'),
 'es': ('Qué hacer en Laponia', 'Mucha gente toma el tren a Rovaniemi para ver auroras boreales y visitar Santa Claus Village. La temporada de auroras va de fines de agosto a principios de abril.', [('tours', 'Excursiones en Laponia', 'Auroras boreales, huskies y renos desde Rovaniemi'), ('santa', 'Santa Claus Village', 'Visita guiada desde el centro de Rovaniemi'), ('daytrips', 'Excursiones de un día', 'Actividades y paseos para un día')], 'Ver en Klook'),
 'fr': ('Que faire en Laponie', 'Beaucoup de voyageurs prennent le train pour Rovaniemi pour les aurores boréales et le village du Père Noël. La saison des aurores va de fin août à début avril.', [('tours', 'Excursions en Laponie', 'Aurores boréales, huskies et rennes au départ de Rovaniemi'), ('santa', 'Village du Père Noël', 'Visite guidée depuis le centre de Rovaniemi'), ('daytrips', 'Excursions d’une journée', 'Activités et sorties à la journée')], 'Voir sur Klook'),
 'it': ('Cosa fare in Lapponia', 'Molti viaggiatori prendono il treno per Rovaniemi per l’aurora boreale e il Villaggio di Babbo Natale. La stagione dell’aurora va da fine agosto a inizio aprile.', [('tours', 'Escursioni in Lapponia', 'Aurora boreale, husky e renne da Rovaniemi'), ('santa', 'Villaggio di Babbo Natale', 'Visita guidata dal centro di Rovaniemi'), ('daytrips', 'Gite di un giorno', 'Attività ed escursioni in giornata')], 'Vedi su Klook'),
 'ja': ('ラップランドでの過ごし方', 'オーロラやサンタクロース村を目当てにロヴァニエミまで列車で向かう旅行者が多くいます。オーロラのシーズンは8月下旬から4月上旬です。', [('tours', 'ラップランドのツアー', 'ロヴァニエミ発のオーロラ・ハスキー・トナカイツアー'), ('santa', 'サンタクロース村', 'ロヴァニエミ中心部からのガイド付き訪問'), ('daytrips', 'ラップランドの日帰りツアー', '1日で楽しめるアクティビティ')], 'Klookで見る'),
}
def lap_html(lang):
    h, intro, items, cta = LAP[lang]
    cards = ''.join('<a class="lap-card" href="https://voxa-production-dc15.up.railway.app/affiliate/klook-lapland?item=%s&amp;lang=%s" target="_blank" rel="noopener sponsored" onclick="try{gtag(\'event\',\'klook_click\',{source:\'finland_lapland\',item:\'%s\'})}catch(e){}"><strong>%s</strong><span>%s</span><em>%s &rarr;</em></a>' % (k, lang, k, html.escape(t), html.escape(d), html.escape(cta)) for k, t, d in items)
    return '<h2>%s</h2>\n    <p>%s</p>\n    <div class="lap">%s</div>\n    ' % (h, html.escape(intro), cards)

T = {
 'en': dict(dir='finland-trains', tpl='rutas/index.html', home='/', all_routes='/rutas/', back='&larr; All routes', suffix='',
   title='Train times in Finland from open Digitraffic data · glosx.app',
   desc='First train, last train, direct trains per day and fastest journey for {n} rail connections in Finland, from the open passenger timetable of Digitraffic (Fintraffic, CC BY 4.0). Table and CSV.',
   h1='Trains in Finland', sub='First and last train, direct trains per day and the fastest journey for {n} rail connections in Finland, from Helsinki to Lapland, calculated by glosx.app from the open passenger timetable published by Digitraffic.',
   guides='Finland route guides', cols=['Trip', 'First train', 'Last train', 'Weekday', 'Saturday', 'Sunday', 'Fastest'],
   src='Source: glosx.app, from the open passenger timetable of Digitraffic (Fintraffic, CC BY 4.0).', csv='Download the data as CSV',
   csvnote='(one row per connection, direction and type of day).', how='How it was calculated',
   li=['<strong>Source:</strong> the passenger GTFS timetable published by <a href="{src}" rel="noopener">Digitraffic</a>, the open traffic-data service of Fintraffic, under the Creative Commons Attribution 4.0 licence.',
       '<strong>Reference week:</strong> Tuesday {wd} (weekday), Saturday {sa} and Sunday {su}. Some seasonal trains, such as the ski-season night train to Kolari, do not run that week.',
       '<strong>What counts:</strong> direct VR long-distance and regional trains, and Helsinki commuter trains, that stop at both stations in that direction, including night trains. Buses are not included.',
       '<strong>Fastest:</strong> the quickest direct train of the weekday. Times change with the timetable: check your date before you travel.'],
   cite='How to cite this data', citetxt='Timetable data: Digitraffic / Fintraffic (CC BY 4.0), processed by <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='glosx.app also publishes train times in <a href="/sweden-trains/">Sweden</a>, <a href="/norway-trains/">Norway</a> and <a href="/swiss-trains/">Switzerland</a>, and is featured in the <a href="{sc}" rel="noopener">showcases of opentransportdata.swiss (SBB)</a>.', dl='Connections in Finland'),
 'es': dict(dir='es/trenes-finlandia', tpl='es/rutas/index.html', home='/es/', all_routes='/es/rutas/', back='&larr; Todas las rutas', suffix='es/',
   title='Horarios de trenes en Finlandia con datos abiertos de Digitraffic · glosx.app',
   desc='Primer tren, último tren, trenes directos al día y viaje más rápido de {n} conexiones ferroviarias en Finlandia, con el horario abierto de pasajeros de Digitraffic (Fintraffic, CC BY 4.0). Tabla y CSV.',
   h1='Trenes en Finlandia', sub='Primer y último tren, trenes directos al día y el viaje más rápido de {n} conexiones en Finlandia, de Helsinki a Laponia, calculados por glosx.app a partir del horario abierto de pasajeros que publica Digitraffic.',
   guides='Guías de rutas en Finlandia', cols=['Trayecto', 'Primer tren', 'Último tren', 'Laborable', 'Sábado', 'Domingo', 'Más rápido'],
   src='Fuente: glosx.app a partir del horario abierto de pasajeros de Digitraffic (Fintraffic, CC BY 4.0).', csv='Descargar los datos en CSV',
   csvnote='(una fila por conexión, sentido y tipo de día).', how='Cómo se han calculado',
   li=['<strong>Fuente:</strong> el horario GTFS de pasajeros que publica <a href="{src}" rel="noopener">Digitraffic</a>, el servicio de datos abiertos de tráfico de Fintraffic, con licencia Creative Commons Atribución 4.0.',
       '<strong>Semana de referencia:</strong> martes {wd} (laborable), sábado {sa} y domingo {su}. Algunos trenes de temporada, como el nocturno de esquí a Kolari, no circulan esa semana.',
       '<strong>Qué cuenta:</strong> trenes directos de larga distancia y regionales de VR, y trenes de cercanías de Helsinki, que paran en las dos estaciones en ese sentido, incluidos los nocturnos. No incluye autobuses.',
       '<strong>Más rápido:</strong> el tren directo más rápido del día laborable. Los horarios cambian con cada temporada: confirma tu fecha antes de viajar.'],
   cite='Cómo citar estos datos', citetxt='Datos de horarios: Digitraffic / Fintraffic (CC BY 4.0), procesados por <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='glosx.app también publica los horarios de trenes en <a href="/es/trenes-suecia/">Suecia</a>, <a href="/es/trenes-noruega/">Noruega</a> y <a href="/es/trenes-suiza/">Suiza</a>, y figura en los <a href="{sc}" rel="noopener">showcases de opentransportdata.swiss (SBB)</a>.', dl='Conexiones en Finlandia'),
 'fr': dict(dir='fr/trains-finlande', tpl='fr/rutas/index.html', home='/fr/', all_routes='/fr/rutas/', back='&larr; Tous les trajets', suffix='fr/',
   title='Horaires des trains en Finlande avec les données ouvertes de Digitraffic · glosx.app',
   desc='Premier train, dernier train, trains directs par jour et trajet le plus rapide pour {n} liaisons ferroviaires en Finlande, d’après l’horaire ouvert de Digitraffic (Fintraffic, CC BY 4.0). Tableau et CSV.',
   h1='Trains en Finlande', sub='Premier et dernier train, trains directs par jour et trajet le plus rapide pour {n} liaisons en Finlande, d’Helsinki à la Laponie, calculés par glosx.app à partir de l’horaire ouvert publié par Digitraffic.',
   guides='Guides de trajets en Finlande', cols=['Trajet', 'Premier train', 'Dernier train', 'Semaine', 'Samedi', 'Dimanche', 'Le plus rapide'],
   src='Source : glosx.app, d’après l’horaire ouvert de Digitraffic (Fintraffic, CC BY 4.0).', csv='Télécharger les données en CSV',
   csvnote='(une ligne par liaison, sens et type de jour).', how='Méthode de calcul',
   li=['<strong>Source :</strong> l’horaire GTFS voyageurs publié par <a href="{src}" rel="noopener">Digitraffic</a>, le service de données ouvertes de Fintraffic, sous licence Creative Commons Attribution 4.0.',
       '<strong>Semaine de référence :</strong> mardi {wd} (semaine), samedi {sa} et dimanche {su}. Certains trains saisonniers, comme le train de nuit des sports d’hiver vers Kolari, ne circulent pas cette semaine-là.',
       '<strong>Ce qui est compté :</strong> les trains directs grandes lignes et régionaux de VR et les trains de banlieue d’Helsinki qui s’arrêtent dans les deux gares dans ce sens, trains de nuit compris. Bus non inclus.',
       '<strong>Le plus rapide :</strong> le train direct le plus rapide du jour de semaine. Les horaires changent : vérifiez votre date avant de voyager.'],
   cite='Comment citer ces données', citetxt='Données horaires : Digitraffic / Fintraffic (CC BY 4.0), traitées par <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='glosx.app publie aussi les horaires des trains en <a href="/fr/trains-suede/">Suède</a>, en <a href="/fr/trains-norvege/">Norvège</a> et en <a href="/fr/trains-suisse/">Suisse</a>, et figure parmi les <a href="{sc}" rel="noopener">showcases d’opentransportdata.swiss (CFF)</a>.', dl='Liaisons en Finlande'),
 'it': dict(dir='it/treni-finlandia', tpl='it/rutas/index.html', home='/it/', all_routes='/it/rutas/', back='&larr; Tutte le tratte', suffix='it/',
   title='Orari dei treni in Finlandia con i dati aperti di Digitraffic · glosx.app',
   desc='Primo treno, ultimo treno, treni diretti al giorno e viaggio più veloce per {n} collegamenti ferroviari in Finlandia, dall’orario aperto di Digitraffic (Fintraffic, CC BY 4.0). Tabella e CSV.',
   h1='Treni in Finlandia', sub='Primo e ultimo treno, treni diretti al giorno e viaggio più veloce per {n} collegamenti in Finlandia, da Helsinki alla Lapponia, calcolati da glosx.app dall’orario aperto pubblicato da Digitraffic.',
   guides='Guide delle tratte in Finlandia', cols=['Tratta', 'Primo treno', 'Ultimo treno', 'Feriale', 'Sabato', 'Domenica', 'Più veloce'],
   src='Fonte: glosx.app, dall’orario aperto di Digitraffic (Fintraffic, CC BY 4.0).', csv='Scarica i dati in CSV',
   csvnote='(una riga per collegamento, direzione e tipo di giorno).', how='Come sono stati calcolati',
   li=['<strong>Fonte:</strong> l’orario GTFS passeggeri pubblicato da <a href="{src}" rel="noopener">Digitraffic</a>, il servizio di dati aperti sul traffico di Fintraffic, con licenza Creative Commons Attribuzione 4.0.',
       '<strong>Settimana di riferimento:</strong> martedì {wd} (feriale), sabato {sa} e domenica {su}. Alcuni treni stagionali, come il notturno della stagione sciistica per Kolari, non circolano quella settimana.',
       '<strong>Cosa viene contato:</strong> treni diretti a lunga percorrenza e regionali di VR e treni suburbani di Helsinki che fermano in entrambe le stazioni in quella direzione, notturni compresi. Esclusi gli autobus.',
       '<strong>Più veloce:</strong> il treno diretto più rapido del giorno feriale. Gli orari cambiano: controlla la tua data prima di partire.'],
   cite='Come citare questi dati', citetxt='Dati orari: Digitraffic / Fintraffic (CC BY 4.0), elaborati da <strong>glosx.app</strong>, <a href="{url}">{url}</a>.',
   showcase='glosx.app pubblica anche gli orari dei treni in <a href="/it/treni-svezia/">Svezia</a>, in <a href="/it/treni-norvegia/">Norvegia</a> e in <a href="/it/treni-svizzera/">Svizzera</a>, ed è presente tra gli <a href="{sc}" rel="noopener">showcase di opentransportdata.swiss (FFS)</a>.', dl='Collegamenti in Finlandia'),
 'ja': dict(dir='ja/finland-trains', tpl='ja/rutas/index.html', home='/ja/', all_routes='/ja/rutas/', back='&larr; すべての路線', suffix='ja/',
   title='フィンランドの列車時刻（Digitrafficオープンデータ）· glosx.app',
   desc='フィンランドの鉄道{n}区間の始発・終電・1日の直通本数・最速所要時間を、Digitraffic（Fintraffic、CC BY 4.0）のオープン旅客時刻表から集計。表とCSV付き。',
   h1='フィンランドの列車', sub='ヘルシンキからラップランドまで、フィンランドの{n}区間について、始発・終電・1日の直通本数・最速所要時間を、Digitrafficが公開するオープン旅客時刻表からglosx.appが集計しました。',
   guides='フィンランドの路線ガイド', cols=['区間', '始発', '終電', '平日', '土曜', '日曜', '最速'],
   src='出典：Digitraffic / Fintraffic（CC BY 4.0）のオープン旅客時刻表をもとにglosx.appが作成。', csv='CSVでデータをダウンロード',
   csvnote='（区間・方向・曜日ごとに1行）。', how='集計方法',
   li=['<strong>出典：</strong>Fintrafficのオープン交通データサービス<a href="{src}" rel="noopener">Digitraffic</a>が公開する旅客GTFS時刻表（CC BY 4.0）。',
       '<strong>基準週：</strong>平日は{wd}（火）、土曜{sa}、日曜{su}。コラリ行きのスキーシーズン夜行列車など、季節列車はこの週は運行しません。',
       '<strong>対象：</strong>その方向で両駅に停車するVRの長距離・地域列車とヘルシンキ近郊列車の直通列車（夜行列車を含む）。バスは含みません。',
       '<strong>最速：</strong>平日のいちばん速い直通列車。時刻は変わるため、乗車日の時刻を確認してください。'],
   cite='データの引用方法', citetxt='時刻表データ：Digitraffic / Fintraffic（CC BY 4.0）、<strong>glosx.app</strong>が加工、<a href="{url}">{url}</a>。',
   showcase='glosx.appは<a href="/ja/sweden-trains/">スウェーデン</a>・<a href="/ja/norway-trains/">ノルウェー</a>・<a href="/ja/swiss-trains/">スイス</a>の列車時刻も公開しており、<a href="{sc}" rel="noopener">opentransportdata.swiss（SBB）のショーケース</a>で紹介されています。', dl='フィンランドの区間'),
}

fdate = lambda s, l: (lambda d: d.strftime('%d/%m/%Y') if l in ('es', 'fr', 'it') else f'{d.year}年{d.month}月{d.day}日' if l == 'ja' else d.strftime('%-d %B %Y'))(datetime.date.fromisoformat(s))
os.makedirs(os.path.join(ROOT, 'assets/data'), exist_ok=True)
with open(os.path.join(ROOT, 'assets/data/horarios-finlandia.csv'), 'w', encoding='utf8', newline='') as f:
    w = csv.writer(f)
    w.writerow(['from', 'to', 'day', 'first_train', 'last_train', 'direct_trains', 'fastest_min', 'median_min', 'source', 'url'])
    for p in sorted(D['pairs'], key=lambda p: (p['from'], p['to'])):
        for day in ('weekday', 'saturday', 'sunday'):
            x = p.get(day)
            if x: w.writerow([p['from'], p['to'], day, x['first'], x['last'], x['n'], x['fastest_min'], x['median_min'], 'Digitraffic / Fintraffic (CC BY 4.0), processed by glosx.app', 'https://glosx.app/finland-trains/'])

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
          'citation': 'Digitraffic / Fintraffic (CC BY 4.0), processed by glosx.app', 'temporalCoverage': '%s/%s' % (REF['weekday'], REF['sunday']),
          'spatialCoverage': {'@type': 'Country', 'name': 'Finland'},
          'distribution': [{'@type': 'DataDownload', 'encodingFormat': 'text/csv', 'contentUrl': 'https://glosx.app/assets/data/horarios-finlandia.csv'}]}
    head = head.replace('</head>', '<script type="application/ld+json">%s</script>\n<style>\n'
        '.hx{max-width:1100px;margin:0 auto;padding:8px 24px 56px}.hx h2{font-size:20px;margin:34px 0 10px}.hx p,.hx li{line-height:1.6;font-size:15px}\n'
        '.hx .tw{overflow-x:auto;border:1px solid rgba(20,21,26,.14);border-radius:12px;background:#fff}.hx table{border-collapse:collapse;width:100%%;min-width:760px;font-size:14px}\n'
        '.hx th,.hx td{padding:10px 12px;text-align:left;border-bottom:1px solid rgba(20,21,26,.08);white-space:nowrap}.hx th{font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#6b6c75;background:#faf8f5;position:sticky;top:0}\n'
        '.hx td:nth-child(n+3){font-variant-numeric:tabular-nums}.hx tr:last-child td{border-bottom:0}.hx a{color:#C10016}.hx .cita{background:#faf8f5;border-radius:12px;padding:14px 16px;font-size:14px}\n'
        '.hx a.bk{display:inline-block;background:#C10016;color:#fff;font-weight:700;font-size:13px;padding:7px 12px;border-radius:999px;text-decoration:none}.hx a.bk:hover{background:#A8000F}\n'
        '.hx .lap{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:12px 0 8px}.hx a.lap-card{display:flex;flex-direction:column;gap:6px;padding:16px;border:1px solid rgba(20,21,26,.14);border-radius:12px;background:#fff;text-decoration:none;color:#14151a}.hx a.lap-card:hover{border-color:#C10016}.hx a.lap-card span{font-size:14px;color:#4a4b55;line-height:1.45}.hx a.lap-card em{font-style:normal;font-weight:700;color:#C10016;font-size:14px;margin-top:auto}\n'
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
        bkc = ('<a class="bk" href="%s" target="_blank" rel="noopener sponsored" aria-label="%s: %s" onclick="try{gtag(\'event\',\'omio_click\',{source:\'finland_table\'})}catch(e){}">%s &rarr;</a>' % (html.escape(omio(p['from'], p['to'], lang)), BOOK[lang][1], html.escape(p['from'] + ' – ' + p['to']), BOOK[lang][0])) if has_omio(p['from'], p['to'], lang) else ''
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
    <p><a href="/assets/data/horarios-finlandia.csv" download>%s</a> %s</p>
    <h2>%s</h2>
    <ul>%s</ul>
    <h2>%s</h2>
    <p class="cita">%s</p>
    <p>%s</p>
  </main>
  ''' % (t['h1'], t['sub'].format(n=len(rows)), t['guides'], gl, lap_html(lang), t['dl'], ''.join('<th>%s</th>' % c for c in t['cols'][:1] + [''] + t['cols'][1:]), tr, t['src'],
         t['csv'], t['csvnote'], t['how'], li, t['cite'], t['citetxt'].format(url=url), t['showcase'].format(sc=SHOWCASE))
    out = head + nav + '\n  ' + body + foot + '\n</body>\n</html>\n'
    os.makedirs(os.path.join(ROOT, t['dir']), exist_ok=True)
    open(os.path.join(ROOT, t['dir'], 'index.html'), 'w', encoding='utf8').write(out)
    print(lang, url, 'filas', len(rows), 'guias', len(GUIDES))
