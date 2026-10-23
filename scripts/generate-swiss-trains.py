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
NAMES = {'es': {'zurich': 'Zúrich', 'geneva': 'Ginebra', 'basel': 'Basilea', 'lucerne': 'Lucerna', 'bern': 'Berna', 'stmoritz': 'St. Moritz'}, 'en': {'stmoritz': 'St. Moritz'}}
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
fdate = lambda s, l: datetime.date.fromisoformat(s).strftime('%d/%m/%Y' if l == 'es' else '%-d %B %Y')
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
        '.hx td:nth-child(n+2){font-variant-numeric:tabular-nums}.hx tr:last-child td{border-bottom:0}.hx a{color:#C10016}.hx .cita{background:#faf8f5;border-radius:12px;padding:14px 16px;font-size:14px}\n'
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
        tr += '<tr><td>%s</td><td>%s</td><td>%s</td><td>%d</td><td>%s</td><td>%s</td><td>%s</td></tr>\n' % (name, w['first'], w['last'], w['n'], s.get('n', '–'), u.get('n', '–'), dur(w['fastest_min']))
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
  ''' % (t['h1'], t['sub'].format(n=len(rows)), t['guides'], gl, t['dl'], ''.join('<th>%s</th>' % c for c in t['cols']), tr, t['src'],
         t['csv'], t['csvnote'], t['how'], li, t['cite'], t['citetxt'].format(url=url), t['showcase'].format(sc=SHOWCASE))
    out = head + nav + '\n  ' + body + foot + '\n</body>\n</html>\n'
    os.makedirs(os.path.join(ROOT, t['dir']), exist_ok=True)
    open(os.path.join(ROOT, t['dir'], 'index.html'), 'w', encoding='utf8').write(out)
    print(lang, url, 'filas', len(rows), 'guias', len(SWISS_GUIDES))
