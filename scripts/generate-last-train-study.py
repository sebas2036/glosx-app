#!/usr/bin/env python3
"""
Estudio "último tren del día" entre ciudades principales de 6 países, a partir de los CSV de datos abiertos de assets/data.
Genera /last-train-europe/ (en) y /es/ultimo-tren-europa/ (es). Pieza enlazable para prensa y blogs.
Uso: python3 scripts/generate-last-train-study.py   (después de regenerar los horarios-*.csv)
"""
import csv, os, json

ROOT = os.path.join(os.path.dirname(__file__), '..')
DATA = os.path.join(ROOT, 'assets', 'data')

# (archivo, origen, destino, nombre en, nombre es, página del país)
PAIRS = [
    ('suiza', 'Zurich HB', 'Bern', 'Zurich → Bern', 'Zúrich → Berna', 'ch'),
    ('suiza', 'Zurich HB', 'Basel SBB', 'Zurich → Basel', 'Zúrich → Basilea', 'ch'),
    ('suiza', 'Bern', 'Lausanne', 'Bern → Lausanne', 'Berna → Lausana', 'ch'),
    ('austria', 'Wien Hbf', 'Salzburg', 'Vienna → Salzburg', 'Viena → Salzburgo', 'at'),
    ('austria', 'Wien Hbf', 'Graz', 'Vienna → Graz', 'Viena → Graz', 'at'),
    ('austria', 'Wien Hbf', 'Linz', 'Vienna → Linz', 'Viena → Linz', 'at'),
    ('suecia', 'Stockholm C', 'Göteborg C', 'Stockholm → Gothenburg', 'Estocolmo → Gotemburgo', 'se'),
    ('suecia', 'Stockholm C', 'Malmö C', 'Stockholm → Malmö', 'Estocolmo → Malmö', 'se'),
    ('suecia', 'Stockholm C', 'Uppsala C', 'Stockholm → Uppsala', 'Estocolmo → Upsala', 'se'),
    ('finlandia', 'Helsinki', 'Tampere', 'Helsinki → Tampere', 'Helsinki → Tampere', 'fi'),
    ('finlandia', 'Helsinki', 'Turku', 'Helsinki → Turku', 'Helsinki → Turku', 'fi'),
    ('finlandia', 'Helsinki', 'Oulu', 'Helsinki → Oulu', 'Helsinki → Oulu', 'fi'),
    ('noruega', 'Oslo S', 'Bergen', 'Oslo → Bergen', 'Oslo → Bergen', 'no'),
    ('noruega', 'Oslo S', 'Trondheim S', 'Oslo → Trondheim', 'Oslo → Trondheim', 'no'),
    ('noruega', 'Oslo S', 'Stavanger', 'Oslo → Stavanger', 'Oslo → Stavanger', 'no'),
    ('espana', 'Madrid', 'Barcelona', 'Madrid → Barcelona', 'Madrid → Barcelona', 'es'),
    ('espana', 'Madrid', 'Valencia', 'Madrid → Valencia', 'Madrid → Valencia', 'es'),
    ('espana', 'Madrid', 'Sevilla', 'Madrid → Seville', 'Madrid → Sevilla', 'es'),
    ('espana', 'Madrid', 'Málaga', 'Madrid → Málaga', 'Madrid → Málaga', 'es'),
]
DAYS_ES = {'Laborable': 'weekday', 'Sábado': 'saturday', 'Domingo': 'sunday'}
COUNTRY = {
    'ch': ('Switzerland', 'Suiza', '/swiss-trains/', '/es/trenes-suiza/'),
    'at': ('Austria', 'Austria', '/austria-trains/', '/es/trenes-austria/'),
    'se': ('Sweden', 'Suecia', '/sweden-trains/', '/es/trenes-suecia/'),
    'fi': ('Finland', 'Finlandia', '/finland-trains/', '/es/trenes-finlandia/'),
    'no': ('Norway', 'Noruega', '/norway-trains/', '/es/trenes-noruega/'),
    'es': ('Spain', 'España', '/horarios-trenes-espana/', '/horarios-trenes-espana/'),
}


def load(name):
    rows = {}
    for r in csv.DictReader(open(os.path.join(DATA, 'horarios-%s.csv' % name), encoding='utf8')):
        if name == 'espana':
            rows[(r['origen'], r['destino'], DAYS_ES[r['dia']])] = (r['ultimo_tren'], int(r['trenes_directos']))
        else:
            rows[(r['from'], r['to'], r['day'])] = (r['last_train'], int(r['direct_trains']))
    return rows


def mins(t):
    h, m = map(int, t.split(':'))
    return h * 60 + m + (1440 if h < 4 else 0)  # pasada la medianoche cuenta como noche del mismo día


cache, rows = {}, []
for f, a, b, en, es, cc in PAIRS:
    d = cache.setdefault(f, load(f))
    wk, sa, su = d[(a, b, 'weekday')], d.get((a, b, 'saturday')), d.get((a, b, 'sunday'))
    rows.append(dict(en=en, es=es, cc=cc, last=wk[0], n=wk[1], sat=sa[1] if sa else 0, sun=su[1] if su else 0, sun_last=su[0] if su else '-'))
rows.sort(key=lambda r: -mins(r['last']))

# promedio por país del último tren (laborable)
by = {}
for r in rows:
    by.setdefault(r['cc'], []).append(mins(r['last']))
avg = sorted(((sum(v) / len(v), k) for k, v in by.items()), reverse=True)
fmt = lambda m: '%02d:%02d' % ((int(m) // 60) % 24, int(m) % 60)

T = {
    'en': dict(path='last-train-europe/index.html', url='https://glosx.app/last-train-europe/', lang='en',
               title='How late is the last train? Main city pairs in 6 European countries',
               desc='Last direct train of the day between the main cities of Switzerland, Austria, Sweden, Finland, Norway and Spain, from official open timetables (GTFS). Data study by glosx.app.',
               h1='How late is the last train?',
               lead='The last direct train of the day between the main cities of six European countries, calculated by glosx.app from the official open timetables of each rail operator (weekday, autumn 2026).',
               k=['Leaves latest', 'Leaves earliest', 'Biggest weekend cut'],
               rank='Average last departure by country', tab='Last direct train on a weekday',
               th=['Trip', 'Country', 'Last train', 'Trains / weekday', 'Saturday', 'Sunday'],
               note='Times are local departure times. A departure after midnight counts as the same evening. On a few long routes the last direct train is a night train.',
               method='How it was calculated', methods=['Source: the official GTFS timetables published by SBB (opentransportdata.swiss), ÖBB, Trafiklab / Samtrafiken, Digitraffic / Fintraffic, Entur and Renfe.', 'Only direct trains count; coupled trains running at the same times count once.', 'Reference days: one weekday, one Saturday and one Sunday of the autumn 2026 timetable.', 'Timetables change: check the operator before you travel.'],
               more='Full tables by country', cite='How to cite', dl='Download all the data (Zenodo, CC BY 4.0)',
               alt='/es/ultimo-tren-europa/', back='All routes', c=0),
    'es': dict(path='es/ultimo-tren-europa/index.html', url='https://glosx.app/es/ultimo-tren-europa/', lang='es',
               title='¿A qué hora sale el último tren? Ciudades principales de 6 países de Europa',
               desc='Último tren directo del día entre las ciudades principales de Suiza, Austria, Suecia, Finlandia, Noruega y España, según los horarios abiertos oficiales (GTFS). Estudio de datos de glosx.app.',
               h1='¿A qué hora sale el último tren?',
               lead='El último tren directo del día entre las ciudades principales de seis países europeos, calculado por glosx.app a partir de los horarios abiertos oficiales de cada operador (día laborable, otoño de 2026).',
               k=['Sale más tarde', 'Sale más temprano', 'Mayor recorte el fin de semana'],
               rank='Último tren promedio por país', tab='Último tren directo en día laborable',
               th=['Trayecto', 'País', 'Último tren', 'Trenes / laborable', 'Sábado', 'Domingo'],
               note='Horas de salida locales. Una salida después de medianoche cuenta como la misma noche. En algunas rutas largas el último tren directo es un tren nocturno.',
               method='Cómo se calculó', methods=['Fuente: los horarios GTFS oficiales publicados por SBB (opentransportdata.swiss), ÖBB, Trafiklab / Samtrafiken, Digitraffic / Fintraffic, Entur y Renfe.', 'Solo cuentan los trenes directos; los trenes acoplados que circulan a la misma hora cuentan una vez.', 'Días de referencia: un laborable, un sábado y un domingo del horario de otoño de 2026.', 'Los horarios cambian: consulta al operador antes de viajar.'],
               more='Tablas completas por país', cite='Cómo citar', dl='Descargar todos los datos (Zenodo, CC BY 4.0)',
               alt='/last-train-europe/', back='Todas las rutas', c=1),
}

for lang, t in T.items():
    c = t['c']
    name = lambda r: r['es'] if c else r['en']
    first, last = rows[0], rows[-1]
    cut = max((r for r in rows if r['sat']), key=lambda r: (r['n'] - r['sat']) / r['n'])  # sin dato de sábado no cuenta
    kp = [(t['k'][0], first['last'], name(first)), (t['k'][1], last['last'], name(last)),
          (t['k'][2], '%d → %d' % (cut['n'], cut['sat']), name(cut) + (' (sábado)' if c else ' (Saturday)'))]
    cn = lambda k: COUNTRY[k][1 if c else 0]
    cl = lambda k: COUNTRY[k][3 if c else 2]
    trs = ''.join('<tr><td>%s</td><td><a href="%s">%s</a></td><td><strong>%s</strong></td><td>%d</td><td>%s</td><td>%s</td></tr>' % (name(r), cl(r['cc']), cn(r['cc']), r['last'], r['n'], r['sat'] or '–', r['sun'] or '–') for r in rows)
    bars = ''.join('<li><span>%s</span><b style="width:%d%%"></b><em>%s</em></li>' % (cn(k), max(8, round(100 * (m - 1080) / (avg[0][0] - 1080))), fmt(m)) for m, k in avg)
    ld = {'@context': 'https://schema.org', '@type': 'Dataset', 'name': t['title'], 'description': t['desc'], 'url': t['url'],
          'license': 'https://creativecommons.org/licenses/by/4.0/', 'creator': {'@type': 'Organization', 'name': 'WoW Train', 'url': 'https://glosx.app/'},
          'sameAs': 'https://doi.org/10.5281/zenodo.23827431', 'temporalCoverage': '2026-11/2026-12', 'isAccessibleForFree': True,
          'spatialCoverage': [{'@type': 'Place', 'name': c} for c in ['Switzerland', 'Austria', 'Sweden', 'Finland', 'Norway', 'Spain']]}
    html = '''<!DOCTYPE html>
<html lang="%(lang)s">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>%(title)s · glosx.app</title>
  <meta name="description" content="%(desc)s" />
  <link rel="canonical" href="%(url)s" />
  <link rel="alternate" hreflang="en" href="https://glosx.app/last-train-europe/" />
  <link rel="alternate" hreflang="es" href="https://glosx.app/es/ultimo-tren-europa/" />
  <link rel="alternate" hreflang="x-default" href="https://glosx.app/last-train-europe/" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="%(title)s" />
  <meta property="og:description" content="%(desc)s" />
  <meta property="og:url" content="%(url)s" />
  <meta property="og:image" content="https://glosx.app/og-image.jpg" />
  <link rel="icon" type="image/png" href="/logo.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <script type="application/ld+json">%(ld)s</script>
  <style>
    :root { --bg:#fafaf8; --text:#14151a; --muted:#55565f; --red:#C10016; --line:rgba(20,21,26,.12); }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font-family:'IBM Plex Sans',-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; line-height:1.5; }
    nav { display:flex; align-items:center; justify-content:space-between; padding:18px 28px; border-bottom:1.5px solid var(--text); }
    nav a { color:var(--text); text-decoration:none; font-weight:600; }
    header { max-width:900px; margin:0 auto; padding:56px 24px 12px; }
    header h1 { font-size:40px; line-height:1.1; margin:0 0 14px; letter-spacing:-.8px; text-wrap:balance; }
    header p { color:var(--muted); font-size:17px; max-width:680px; margin:0; }
    main { max-width:900px; margin:0 auto; padding:8px 24px 64px; }
    main h2 { font-size:20px; margin:40px 0 12px; }
    .kpi { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; margin-top:28px; }
    .kpi div { background:#fff; border:1px solid var(--line); border-radius:14px; padding:16px 18px; }
    .kpi small { display:block; font-size:12px; text-transform:uppercase; letter-spacing:.8px; color:var(--muted); font-weight:700; }
    .kpi strong { display:block; font-size:30px; font-variant-numeric:tabular-nums; color:var(--red); margin:4px 0 2px; }
    .kpi span { font-size:14px; }
    .bars { list-style:none; padding:0; margin:0; display:grid; gap:8px; }
    .bars li { display:grid; grid-template-columns:110px 1fr 56px; align-items:center; gap:10px; font-size:14px; }
    .bars b { display:block; height:14px; background:var(--red); border-radius:0 7px 7px 0; }
    .bars em { font-style:normal; font-variant-numeric:tabular-nums; font-weight:600; }
    .tw { overflow-x:auto; border:1px solid var(--line); border-radius:12px; background:#fff; }
    table { border-collapse:collapse; width:100%%; min-width:640px; font-size:14px; }
    th, td { padding:10px 12px; text-align:left; border-bottom:1px solid rgba(20,21,26,.07); white-space:nowrap; }
    th { font-size:12px; text-transform:uppercase; letter-spacing:.6px; color:#6b6c75; background:#faf8f5; }
    td:nth-child(n+3) { font-variant-numeric:tabular-nums; }
    tr:last-child td { border-bottom:0; }
    main a { color:var(--red); }
    .note { font-size:13px; color:#6b6c75; margin-top:8px; }
    .cita { background:#faf8f5; border-radius:12px; padding:14px 16px; font-size:14px; }
    .gl { display:flex; flex-wrap:wrap; gap:8px; padding:0; list-style:none; }
    .gl a { display:inline-block; padding:8px 14px; border:1px solid var(--line); border-radius:999px; text-decoration:none; color:var(--text); font-size:14px; background:#fff; }
    .gl a:hover { border-color:var(--red); }
    footer { text-align:center; padding:28px; color:var(--muted); font-size:13px; border-top:1px solid var(--line); }
    footer a { color:var(--muted); }
    @media (max-width:700px) { header h1 { font-size:30px; } .kpi { grid-template-columns:1fr; } .bars li { grid-template-columns:90px 1fr 50px; } }
  </style>
</head>
<body>
  <nav>
    <a href="/">WoW Train</a>
    <a href="%(home)srutas/">&larr; %(back)s</a>
  </nav>
  <header>
    <h1>%(h1)s</h1>
    <p>%(lead)s</p>
  </header>
  <main>
    <div class="kpi">%(kpi)s</div>
    <h2>%(rank)s</h2>
    <ul class="bars">%(bars)s</ul>
    <h2>%(tab)s</h2>
    <div class="tw"><table>
      <thead><tr>%(th)s</tr></thead>
      <tbody>%(trs)s</tbody>
    </table></div>
    <p class="note">%(note)s</p>
    <h2>%(method)s</h2>
    <ul>%(methods)s</ul>
    <p><a href="https://doi.org/10.5281/zenodo.23827431" rel="noopener">%(dl)s</a></p>
    <h2>%(more)s</h2>
    <ul class="gl">%(gl)s</ul>
    <h2>%(cite)s</h2>
    <p class="cita">WoW Train (glosx.app), &ldquo;%(title)s&rdquo;, <a href="%(url)s">%(url)s</a>. DOI <a href="https://doi.org/10.5281/zenodo.23827431">10.5281/zenodo.23827431</a>.</p>
  </main>
  <footer>
    <p>&copy; 2026 GLOSX &middot; <a href="/">glosx.app</a> &middot; <a href="/explore/">Explore</a> &middot; <a href="/blog.html">Blog</a> &middot; <a href="%(alt)s">%(altn)s</a></p>
  </footer>
</body>
</html>
''' % dict(t, ld=json.dumps(ld, ensure_ascii=False), home='/es/' if c else '/',
           kpi=''.join('<div><small>%s</small><strong>%s</strong><span>%s</span></div>' % x for x in kp),
           bars=bars, th=''.join('<th>%s</th>' % x for x in t['th']), trs=trs,
           methods=''.join('<li>%s</li>' % x for x in t['methods']),
           gl=''.join('<li><a href="%s">%s</a></li>' % (cl(k), cn(k)) for k in COUNTRY),
           altn='English' if c else 'Español')
    p = os.path.join(ROOT, t['path'])
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf8').write(html)
    print(lang, p)
print([(r['en'], r['last']) for r in rows[:3]], avg)
