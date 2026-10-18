#!/usr/bin/env python3
"""
Genera /horarios-trenes-espana/ (página enlazable con datos abiertos de Renfe) y assets/data/horarios-espana.csv
a partir de assets/data/horarios-rutas.json (público; lo produce scripts/horarios-gtfs.py).
Uso: python3 scripts/generate-horarios-espana.py   (desde la raíz del repo)
Cabecera y estilos: se copian de es/rutas/index.html.
"""
import json, re, csv, html, os

ROOT = os.path.join(os.path.dirname(__file__), '..')
D = json.load(open(os.path.join(ROOT, 'assets/data/horarios-rutas.json'), encoding='utf8'))
FEED = D['feeds']['renfe_ld']
ES = {'Seville': 'Sevilla', 'Malaga': 'Málaga', 'Cordoba': 'Córdoba'}
nm = lambda c: ES.get(c, c)
DAYS = [('weekday', 'Laborable'), ('saturday', 'Sábado'), ('sunday', 'Domingo')]
def dur(m): return f'{m // 60} h {m % 60:02d} min' if m >= 60 else f'{m} min'
fecha = lambda s: f'{s[6:8]}/{s[4:6]}/{s[:4]}'

rows, csv_rows = [], []
for slug, r in sorted(D['routes'].items()):
    if 'renfe_ld' not in r['sources']:
        continue
    for key, v in r['dirs'].items():
        a, b = key.split('>')
        w = v.get('weekday', {}).get('renfe_ld')
        if not w:
            continue
        s = v.get('saturday', {}).get('renfe_ld') or {}
        u = v.get('sunday', {}).get('renfe_ld') or {}
        rows.append((nm(a), nm(b), slug, w, s, u))
        for k, lab in DAYS:
            x = v.get(k, {}).get('renfe_ld')
            if x:
                csv_rows.append([slug, nm(a), nm(b), lab, x['first'], x['last'], x['n'], x['median_min']])
rows.sort(key=lambda t: (t[0], t[1]))

with open(os.path.join(ROOT, 'assets/data/horarios-espana.csv'), 'w', encoding='utf8', newline='') as f:
    wr = csv.writer(f)
    wr.writerow(['ruta', 'origen', 'destino', 'dia', 'primer_tren', 'ultimo_tren', 'trenes_directos', 'duracion_mediana_min', 'fuente', 'licencia', 'url'])
    wr.writerows([r + ['Renfe (horarios abiertos), procesado por glosx.app', 'CC BY 4.0', 'https://glosx.app/horarios-trenes-espana/'] for r in csv_rows])

tr = ''
for a, b, slug, w, s, u in rows:
    tr += ('<tr><td><a href="/rutas/%s/es/">%s &rarr; %s</a></td><td>%s</td><td>%s</td><td>%d</td><td>%s</td><td>%s</td><td>%s</td></tr>\n'
           % (slug, html.escape(a), html.escape(b), w['first'], w['last'], w['n'], s.get('n', '–'), u.get('n', '–'), dur(w['median_min'])))

tpl = open(os.path.join(ROOT, 'es/rutas/index.html'), encoding='utf8').read()
head = tpl[:tpl.index('<nav>')]
nav = '<nav>\n    <a href="/es/">WoW Train</a>\n    <div class="nav-right"><a href="/es/rutas/" style="font-weight:600;text-decoration:none;color:inherit">&larr; Todas las rutas</a></div>\n  </nav>'
foot = tpl[tpl.index('<footer>'):tpl.index('</footer>') + 9]
TITLE = 'Horarios de trenes en España con datos abiertos de Renfe · glosx.app'
DESC = ('glosx.app: primer tren, último tren y trenes directos al día de %d trayectos de alta velocidad y larga distancia de Renfe, '
        'con datos abiertos (CC BY 4.0). Tabla y CSV descargables.' % len(rows))
URL = 'https://glosx.app/horarios-trenes-espana/'
head = re.sub(r'<title>.*?</title>', '<title>%s</title>' % TITLE, head)
head = re.sub(r'<meta name="description"[^>]*>', '<meta name="description" content="%s" />' % DESC, head)
head = re.sub(r'<link rel="canonical"[^>]*>', '<link rel="canonical" href="%s" />' % URL, head)
head = re.sub(r'\s*<link rel="alternate" hreflang[^>]*>', '', head)
head = re.sub(r'<meta property="og:title"[^>]*>', '<meta property="og:title" content="%s" />' % TITLE, head)
head = re.sub(r'<meta property="og:description"[^>]*>', '<meta property="og:description" content="%s" />' % DESC, head)
head = re.sub(r'<meta property="og:url"[^>]*>', '<meta property="og:url" content="%s" />' % URL, head)
head = re.sub(r'<meta name="twitter:title"[^>]*>', '<meta name="twitter:title" content="%s" />' % TITLE, head)
head = re.sub(r'<meta name="twitter:description"[^>]*>', '<meta name="twitter:description" content="%s" />' % DESC, head)
ld = {
    '@context': 'https://schema.org', '@type': 'Dataset', 'name': 'glosx.app · Horarios de trenes de alta velocidad y larga distancia en España (primer tren, último tren y frecuencia)',
    'description': DESC, 'url': URL, 'inLanguage': 'es', 'license': 'https://creativecommons.org/licenses/by/4.0/',
    'isBasedOn': FEED['url'], 'creator': {'@type': 'Organization', 'name': 'glosx.app', 'url': 'https://glosx.app/'}, 'publisher': {'@type': 'Organization', 'name': 'glosx.app', 'url': 'https://glosx.app/'}, 'citation': 'Renfe (horarios abiertos, CC BY 4.0), procesados por glosx.app',
    'temporalCoverage': '2026-10-20/2026-10-25', 'spatialCoverage': {'@type': 'Country', 'name': 'España'},
    'distribution': [{'@type': 'DataDownload', 'encodingFormat': 'text/csv', 'contentUrl': 'https://glosx.app/assets/data/horarios-espana.csv'}],
}
head = head.replace('</head>', '<script type="application/ld+json">%s</script>\n<style>\n'
    '.hx{max-width:1100px;margin:0 auto;padding:8px 24px 56px}.hx h2{font-size:20px;margin:34px 0 10px}.hx p,.hx li{line-height:1.6;font-size:15px}\n'
    '.hx .tw{overflow-x:auto;border:1px solid rgba(20,21,26,.14);border-radius:12px;background:#fff}.hx table{border-collapse:collapse;width:100%%;min-width:760px;font-size:14px}\n'
    '.hx th,.hx td{padding:10px 12px;text-align:left;border-bottom:1px solid rgba(20,21,26,.08);white-space:nowrap}.hx th{font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#6b6c75;background:#faf8f5}\n'
    '.hx td:nth-child(n+3){font-variant-numeric:tabular-nums}.hx tr:last-child td{border-bottom:0}.hx a{color:#C10016}.hx .cita{background:#faf8f5;border-radius:12px;padding:14px 16px;font-size:14px}\n'
    '</style>\n</head>' % json.dumps(ld, ensure_ascii=False))
body = '''<header>
    <h1>Horarios de trenes en España con datos abiertos <span style="color:#C10016">· glosx.app</span></h1>
    <p>Primer tren, último tren y trenes directos al día de %d trayectos de alta velocidad y larga distancia de Renfe, calculados por glosx.app a partir de su horario abierto.</p>
  </header>
  <main class="hx">
    <div class="tw"><table>
      <thead><tr><th>Trayecto</th><th>Primer tren</th><th>Último tren</th><th>Trenes laborable</th><th>Sábado</th><th>Domingo</th><th>Duración típica</th></tr></thead>
      <tbody>
%s      </tbody>
    </table></div>
    <p style="font-size:13px;color:#6b6c75;margin-top:8px">Fuente: glosx.app a partir de los horarios abiertos de Renfe (CC BY 4.0).</p>
    <p><a href="/assets/data/horarios-espana.csv" download>Descargar los datos en CSV de glosx.app</a> (una fila por trayecto, sentido y tipo de día; cada fila indica su fuente).</p>
    <h2>Cómo se han calculado</h2>
    <ul>
      <li><strong>Fuente y tratamiento:</strong> glosx.app procesa el horario abierto de Renfe: <a href="%s" rel="noopener">alta velocidad, larga distancia y media distancia</a>, publicados bajo licencia <a href="https://creativecommons.org/licenses/by/4.0/deed.es" rel="noopener">CC BY 4.0</a>. El archivo es válido del %s al %s.</li>
      <li><strong>Semana de referencia:</strong> del 20 al 25 de octubre de 2026 (laborable = martes 20, sábado 24, domingo 25). Consultado el 17 de octubre de 2026.</li>
      <li><strong>Qué cuenta:</strong> trenes directos que paran en las dos ciudades en ese sentido: AVE, AVLO, Alvia, Avant e Intercity. Sin Cercanías ni media distancia lenta.</li>
      <li><strong>Qué no incluye:</strong> otros operadores (Ouigo, Iryo), por eso hay más salidas en el mercado que las de esta tabla. Los horarios cambian por temporada: confirma tu fecha antes de reservar.</li>
      <li><strong>Duración típica:</strong> mediana de los trenes del día laborable.</li>
    </ul>
    <h2>Cómo citar estos datos</h2>
    <p class="cita">Datos de horarios: Renfe (horarios abiertos, CC BY 4.0), procesados por <strong>glosx.app</strong>, <a href="%s">%s</a>.</p>
    <p>Cada trayecto tiene su guía con mapa, horarios y reserva en <a href="/es/rutas/">todas las rutas</a>.</p>
  </main>
  ''' % (len(rows), tr, FEED['url'], fecha(FEED['valid_from']), fecha(FEED['valid_to']), URL, URL)
out = head + nav + '\n  ' + body + foot + '\n</body>\n</html>\n'
os.makedirs(os.path.join(ROOT, 'horarios-trenes-espana'), exist_ok=True)
open(os.path.join(ROOT, 'horarios-trenes-espana/index.html'), 'w', encoding='utf8').write(out)
print('trayectos:', len(rows), '| filas CSV:', len(csv_rows))
