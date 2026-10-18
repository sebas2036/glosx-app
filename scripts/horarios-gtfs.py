#!/usr/bin/env python3
"""
Calcula, para las rutas de glosx que tienen viajes directos en horarios abiertos (GTFS), el primer y el último tren y
cuántos trenes hay al día (laborable / sábado / domingo), en una semana de referencia.
Fuentes (licencia abierta, descargadas el 17-oct-2026 a ~/proyectos/glosx-horarios-datos, FUERA del repositorio):
  - DELFI e.V. / GTFS.de (Fernverkehr "fv_free", CC BY 4.0): DB y operadores en cruces con Alemania
  - Eurostar International Ltd (Licence Ouverte 2.0)
  - Renfe Viajeros, AVE internacional España–Francia (Licence Ouverte 2.0)
Uso: python3 -I scripts/horarios-gtfs.py <carpeta_datos> <salida.json>
Solo biblioteca estándar. Los archivos descargados se tratan como datos no confiables: solo se leen tablas CSV.
"""
import csv, io, json, re, sys, zipfile, unicodedata, datetime, statistics, collections

DATA, OUT = sys.argv[1], sys.argv[2]
REF = {'weekday': datetime.date(2026, 10, 20), 'saturday': datetime.date(2026, 10, 24), 'sunday': datetime.date(2026, 10, 25)}
SOURCES = {
    'db': {'zip': 'db/fv_free.zip', 'name': 'DELFI e.V. / GTFS.de', 'license': 'CC BY 4.0', 'url': 'https://gtfs.de'},
    'eurostar': {'zip': 'eurostar/eurostar_gtfs.zip', 'name': 'Eurostar International Ltd', 'license': 'Licence Ouverte 2.0', 'url': 'https://transport.data.gouv.fr/datasets/eurostar-gtfs-plan-de-transport-et-temps-reel'},
    'sncf': {'zip': 'sncf/sncf_gtfs.zip', 'name': 'SNCF Voyageurs', 'license': 'ODbL 1.0', 'url': 'https://transport.data.gouv.fr/datasets/horaires-sncf', 'private': True},
    'sbb': {'zip': 'sbb/sbb_gtfs.zip', 'name': 'SBB / opentransportdata.swiss', 'license': 'datos abiertos de opentransportdata.swiss', 'url': 'https://opentransportdata.swiss', 'descs': {'IC', 'IR', 'RE', 'EC', 'ICE', 'TGV', 'RJX', 'RJ', 'NJ', 'EN', 'PE', 'GEX'}},
    'renfe_ld': {'zip': 'renfe_ld/renfe_av_ld.zip', 'name': 'Renfe', 'license': 'CC BY 4.0', 'url': 'https://data.renfe.com/dataset/horarios-de-alta-velocidad-larga-distancia-y-media-distancia', 'short_names': {'AVE', 'AVLO', 'ALVIA', 'EUROMED', 'INTERCITY'}},
    'renfe': {'zip': 'renfe/renfe_ave_int.zip', 'name': 'Renfe Viajeros', 'license': 'Licence Ouverte 2.0', 'url': 'https://transport.data.gouv.fr/datasets/horaires-ave-espagne-france'},
}
norm = lambda s: ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn')
# ciudad (nombre en inglés como en generate-routes.js) -> fragmentos del nombre de estación
ALIAS = {
    'Amsterdam': ['amsterdam'], 'Berlin': ['berlin'], 'Brussels': ['bruxelles', 'brussel'], 'Barcelona': ['barcelona'], 'Girona': ['girona'],
    'Lyon': ['lyon'], 'Basel': ['basel'], 'Paris': ['paris'], 'Hamburg': ['hamburg'], 'Prague': ['praha'], 'Vienna': ['wien'],
    'Budapest': ['budapest'], 'Copenhagen': ['kobenhavn', 'copenhagen'], 'Dortmund': ['dortmund'], 'Munich': ['munchen', 'munich'],
    'Frankfurt': ['frankfurt'], 'Cologne': ['koln'], 'London': ['pancras', 'london'], 'Madrid': ['madrid'], 'Marseille': ['marseille'],
    'Zurich': ['zurich'], 'Figueres': ['figueres'], 'Zaragoza': ['zaragoza'], 'Salzburg': ['salzburg'], 'Innsbruck': ['innsbruck'],
    'Stuttgart': ['stuttgart'], 'Nuremberg': ['nurnberg'], 'Dresden': ['dresden'], 'Leipzig': ['leipzig'], 'Hannover': ['hannover'],
    'Rotterdam': ['rotterdam'], 'Antwerp': ['antwerpen'], 'Lille': ['lille'], 'Avignon': ['avignon'], 'Montpellier': ['montpellier'],
    'Warsaw': ['warszawa'], 'Seville': ['sevilla'], 'Valencia': ['valencia'], 'Malaga': ['malaga'], 'Cordoba': ['cordoba'], 'Alicante': ['alicante'], 'Bilbao': ['bilbao'], 'Granada': ['granada'], 'Bern': ['bern '], 'Geneva': ['geneve', 'geneva'], 'Mainz': ['mainz'], 'Aachen': ['aachen'],
}
SWISS = {'Zurich', 'Geneva', 'Basel', 'Bern', 'Lucerne', 'Interlaken', 'Zermatt', 'Montreux', 'St. Moritz', 'Lausanne', 'Lugano', 'Lauterbrunnen', 'Chur'}
GERMAN = {'Berlin','Hamburg','Munich','Frankfurt','Cologne','Dortmund','Stuttgart','Nuremberg','Dresden','Leipzig','Hannover','Mainz','Aachen'}
# Solo se publica lo que es completo para el operador citado: Eurostar (todos sus pares) y larga distancia dentro de Alemania (DB/DELFI).
# Renfe (solo trenes internacionales) y los pares de Austria/Chequia/Hungría del feed alemán NO se publican: darían recuentos falsos.
def allowed(key, a, b):
    if key == 'eurostar': return True
    if key == 'db': return a in GERMAN and b in GERMAN
    if key == 'sncf': return True
    if key == 'sbb': return a in SWISS and b in SWISS   # los trenes internacionales vienen partidos en tramos en este feed: solo pares dentro de Suiza
    if key == 'renfe_ld': return {a, b} not in ({'Barcelona', 'Girona'}, {'Girona', 'Figueres'})   # ahí dominan los regionales (Rodalies), que este archivo no incluye
    return False
SBB_STATIONS = {
    'zurich hb': 'Zurich', 'geneve': 'Geneva', 'basel sbb': 'Basel', 'bern': 'Bern', 'luzern': 'Lucerne', 'interlaken ost': 'Interlaken', 'zermatt': 'Zermatt',
    'montreux': 'Montreux', 'st. moritz': 'St. Moritz', 'lausanne': 'Lausanne', 'lugano': 'Lugano', 'lauterbrunnen': 'Lauterbrunnen', 'chur': 'Chur',
    'milano centrale': 'Milan', 'paris gare de lyon': 'Paris', 'munchen hbf': 'Munich', 'wien hbf': 'Vienna', 'frankfurt (main) hbf': 'Frankfurt', 'stuttgart hbf': 'Stuttgart', 'venezia s. lucia': 'Venice',
}
SNCF_STATIONS = {  # nombre normalizado de la estación -> ciudad (evita falsos como "Orleans Avenue de Paris")
    'paris est': 'Paris', 'paris gare de lyon hall 1 - 2': 'Paris', 'paris gare du nord': 'Paris', 'paris montparnasse hall 1 - 2': 'Paris', 'paris austerlitz': 'Paris',
    'lyon part dieu': 'Lyon', 'lyon perrache': 'Lyon', 'marseille saint-charles': 'Marseille', 'nice-ville': 'Nice', 'bordeaux saint-jean': 'Bordeaux',
    'toulouse matabiau': 'Toulouse', 'lille europe': 'Lille', 'lille flandres': 'Lille', 'strasbourg': 'Strasbourg', 'lourdes': 'Lourdes', 'avignon tgv': 'Avignon',
    'montpellier saint-roch': 'Montpellier', 'miramas': 'Miramas', 'basel sbb': 'Basel', 'geneve cornavin': 'Geneva', 'bruxelles midi': 'Brussels', 'colmar': 'Colmar',
    'milano porta garibaldi': 'Milan', 'dijon': 'Dijon', 'nantes': 'Nantes', 'rennes': 'Rennes', 'tours': 'Tours', 'angouleme': 'Angouleme', 'poitiers': 'Poitiers', 'mulhouse': 'Mulhouse',
}
EXCL = ('flughafen', 'airport', 'schiphol', 'zaventem', '(oder)', 'bf ehrenfeld', 'gl.')
def city_of(stop_name):
    n = norm(stop_name)
    if any(x in n for x in EXCL): return None
    for c, frs in ALIAS.items():
        if any(f in n for f in frs): return c
    return None

def rd(z, name):
    if name not in z.namelist(): return []
    out = []
    for r in csv.DictReader(io.TextIOWrapper(z.open(name), encoding='utf-8-sig')):
        out.append({(k or '').strip(): (v or '').strip() for k, v in r.items()})
    return out
def secs(t):
    h, m, s = (t.split(':') + ['0', '0'])[:3]
    return int(h) * 3600 + int(m) * 60 + int(s)
def ymd(s): return datetime.date(int(s[:4]), int(s[4:6]), int(s[6:8]))

# rutas de Europa de generate-routes.js
g = open(__file__.replace('horarios-gtfs.py', 'generate-routes.js'), encoding='utf8').read()
ROUTES = [(m.group(1), m.group(2), m.group(3)) for m in re.finditer(r"slug: '([a-z-]+)', from: '([^']+)', to: '([^']+)'", g)]
PAIRS = {}
for slug, a, b in ROUTES: PAIRS[(a, b)] = slug; PAIRS[(b, a)] = slug

result = collections.defaultdict(lambda: {'dirs': {}, 'sources': set()})
meta = {}
for key, src in SOURCES.items():
    z = zipfile.ZipFile(f"{DATA}/{src['zip']}")
    stops_rows = rd(z, 'stops.txt')
    stops = {s['stop_id']: (SNCF_STATIONS.get(norm(s['stop_name'])) if key == 'sncf' else SBB_STATIONS.get(norm(s['stop_name'])) if key == 'sbb' else city_of(s['stop_name'])) for s in stops_rows}
    shift = {s['stop_id']: (-3600 if (key == 'eurostar' and s.get('stop_timezone') == 'Europe/London') else 0) for s in stops_rows}
    cal = {r['service_id']: r for r in rd(z, 'calendar.txt')}
    refset = {d.strftime('%Y%m%d') for d in REF.values()}
    cd = collections.defaultdict(dict)
    with z.open('calendar_dates.txt') as f:   # solo los días de referencia (el archivo suizo pesa cientos de MB)
        rdr = csv.reader(io.TextIOWrapper(f, encoding='utf-8-sig'))
        h = [x.strip() for x in next(rdr)]; i_s, i_d, i_e = h.index('service_id'), h.index('date'), h.index('exception_type')
        for row in rdr:
            if row[i_d].strip() in refset: cd[row[i_s].strip()][row[i_d].strip()] = row[i_e].strip()
    ok_routes = None
    if 'short_names' in src:
        ok_routes = {r['route_id'] for r in rd(z, 'routes.txt') if r.get('route_short_name', '').upper() in src['short_names']}
    if 'descs' in src:
        ok_routes = {r['route_id'] for r in rd(z, 'routes.txt') if r.get('route_desc', '').upper() in src['descs']}
    trips = {}
    with z.open('trips.txt') as f:
        rdr = csv.reader(io.TextIOWrapper(f, encoding='utf-8-sig'))
        h = [x.strip() for x in next(rdr)]; i_r, i_s, i_t = h.index('route_id'), h.index('service_id'), h.index('trip_id')
        for row in rdr:
            if ok_routes is None or row[i_r].strip() in ok_routes: trips[row[i_t].strip()] = row[i_s].strip()
    def active(service, day):
        d = day.strftime('%Y%m%d')
        e = cd.get(service, {}).get(d)
        if e == '1': return True
        if e == '2': return False
        c = cal.get(service)
        if not c: return False
        if not (c['start_date'] <= d <= c['end_date']): return False
        return c[['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][day.weekday()]] == '1'
    # paradas por viaje, solo las que son de una ciudad conocida
    per_trip = collections.defaultdict(list)
    with z.open('stop_times.txt') as f:
        rdr = csv.reader(io.TextIOWrapper(f, encoding='utf-8-sig'))
        h = [x.strip() for x in next(rdr)]
        i_t, i_s, i_q, i_a, i_d = h.index('trip_id'), h.index('stop_id'), h.index('stop_sequence'), h.index('arrival_time'), h.index('departure_time')
        for row in rdr:
            tid = row[i_t].strip()
            if tid not in trips: continue
            sid = row[i_s].strip(); c = stops.get(sid)
            if not c: continue
            try: per_trip[tid].append((int(row[i_q]), c, secs((row[i_a] or row[i_d]).strip()), secs((row[i_d] or row[i_a]).strip()), shift.get(sid, 0)))
            except ValueError: pass
    vf = vt = None
    ds = [r['start_date'] for r in cal.values()] + [d for v in cd.values() for d in v]
    de = [r['end_date'] for r in cal.values()] + [d for v in cd.values() for d in v]
    meta[key] = {'valid_from': min(ds), 'valid_to': max(de)}
    ref_ok = {k: {} for k in REF}
    for tid, rows in per_trip.items():
        rows.sort()
        svc = trips[tid]
        for i in range(len(rows)):
            for j in range(i + 1, len(rows)):
                a, b = rows[i][1], rows[j][1]
                if a == b or (a, b) not in PAIRS or not allowed(key, a, b): continue
                dep, arr = rows[i][3], rows[j][2]
                if arr < dep: continue
                dep_local = dep + rows[i][4]
                for kind, day in REF.items():
                    if active(svc, day):
                        ref_ok[kind].setdefault((a, b), {})[tid] = (dep_local, arr + rows[j][4], arr - dep)
    for kind, d in ref_ok.items():
        for (a, b), tr in d.items():
            slug = PAIRS[(a, b)]
            r = result[slug]
            r['sources'].add(key)
            slot = r['dirs'].setdefault(f'{a}>{b}', {})
            slot.setdefault('by', {})[key] = slot.get('by', {})
            deps = sorted(v[0] for v in tr.values())
            durs = [v[2] // 60 for v in tr.values()]
            fmt = lambda s: f"{(s // 3600) % 24:02d}:{(s % 3600) // 60:02d}" + (" (+1)" if s >= 86400 else "")
            slot.setdefault(kind, {})[key] = {'n': len(deps), 'first': fmt(deps[0]), 'last': fmt(deps[-1]), 'median_min': int(statistics.median(durs))}
out = {'reference_week': {k: v.isoformat() for k, v in REF.items()}, 'feeds': {k: {**{kk: vv for kk, vv in SOURCES[k].items() if kk not in ('short_names', 'descs')}, **meta[k]} for k in SOURCES}, 'routes': {}}
for slug, r in sorted(result.items()):
    out['routes'][slug] = {'sources': sorted(r['sources']), 'dirs': {k: {kk: vv for kk, vv in v.items() if kk != 'by'} for k, v in r['dirs'].items()}}
# Los datos derivados de SNCF (ODbL, "compartir igual") NO van al archivo público del repositorio: solo al archivo completo, fuera del repo.
PRIVATE = {k for k, v in SOURCES.items() if v.get('private')}
public = {'reference_week': out['reference_week'], 'feeds': {k: v for k, v in out['feeds'].items() if k not in PRIVATE}, 'routes': {}}
for slug, r in out['routes'].items():
    src = [x for x in r['sources'] if x not in PRIVATE]
    if not src: continue
    public['routes'][slug] = {'sources': src, 'dirs': {k: {kk: {sk: sv for sk, sv in vv.items() if sk not in PRIVATE} for kk, vv in v.items()} for k, v in r['dirs'].items()}}
json.dump(public, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
FULL = sys.argv[3] if len(sys.argv) > 3 else None
if FULL: json.dump(out, open(FULL, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('rutas con datos reales:', len(out['routes']), 'de', len(ROUTES))
print(', '.join(sorted(out['routes'])))
