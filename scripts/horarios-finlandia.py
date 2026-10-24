#!/usr/bin/env python3
"""
Horarios de trenes en Finlandia a partir del GTFS de pasajeros de Digitraffic (Fintraffic, licencia CC BY 4.0).
Para cada par de estaciones de la lista (en los dos sentidos): trenes directos al día (laborable, sábado, domingo),
primer y último tren y duración del más rápido y mediana. Solo trenes (route_type ferroviario), sin bus/tram/barco.
Uso: python3 scripts/horarios-finlandia.py <ruta al zip> assets/data/horarios-finlandia.json
Zip: https://rata.digitraffic.fi/api/v1/trains/gtfs-passenger-stops.zip (sin clave; ~3 MB, no va al repo).
"""
import csv, io, json, sys, zipfile, unicodedata, datetime, statistics, collections, itertools

ZIP, OUT = sys.argv[1], sys.argv[2]
REF = {'weekday': datetime.date(2026, 12, 1), 'saturday': datetime.date(2026, 12, 5), 'sunday': datetime.date(2026, 12, 6)}
norm = lambda s: ''.join(c for c in unicodedata.normalize('NFD', s.lower().replace('ø', 'o').replace('æ', 'ae')) if unicodedata.category(c) != 'Mn').strip()
# nombre de estación en el GTFS (normalizado) -> nombre que mostramos
STATIONS = {'helsinki': 'Helsinki', 'pasila': 'Pasila', 'tikkurila': 'Tikkurila', 'lentoasema': 'Helsinki Airport', 'tampere': 'Tampere', 'turku': 'Turku', 'turku satama': 'Turku satama', 'oulu': 'Oulu', 'rovaniemi': 'Rovaniemi', 'kolari': 'Kolari', 'kemijarvi': 'Kemijärvi', 'kemi': 'Kemi', 'joensuu': 'Joensuu', 'kuopio': 'Kuopio', 'lahti': 'Lahti', 'jyvaskyla': 'Jyväskylä', 'seinajoki': 'Seinäjoki', 'vaasa': 'Vaasa', 'kajaani': 'Kajaani', 'savonlinna': 'Savonlinna', 'kouvola': 'Kouvola', 'hameenlinna': 'Hämeenlinna', 'riihimaki': 'Riihimäki', 'pori': 'Pori', 'kokkola': 'Kokkola', 'ylivieska': 'Ylivieska', 'iisalmi': 'Iisalmi', 'mikkeli': 'Mikkeli', 'lappeenranta': 'Lappeenranta', 'imatra': 'Imatra', 'hanko': 'Hanko', 'salo': 'Salo', 'kerava': 'Kerava', 'tornio': 'Tornio'}
RAIL = {'2'} | {str(x) for x in range(100, 118)}   # tren (GTFS básico y extendido)

def rows(z, name):
    with z.open(name) as f:
        r = csv.reader(io.TextIOWrapper(f, encoding='utf-8-sig'))
        h = [x.strip() for x in next(r)]
        for row in r: yield dict(zip(h, (x.strip() for x in row)))
def secs(t):
    h, m, s = (t.split(':') + ['0', '0'])[:3]
    return int(h) * 3600 + int(m) * 60 + int(s)
fmt = lambda s: f"{(s // 3600) % 24:02d}:{(s % 3600) // 60:02d}"

z = zipfile.ZipFile(ZIP)
stop = {}
for s in rows(z, 'stops.txt'):
    n = STATIONS.get(norm(s['stop_name']))
    if n: stop[s['stop_id']] = n
    if s.get('parent_station') and s['parent_station'] in stop: stop[s['stop_id']] = stop[s['parent_station']]
for s in rows(z, 'stops.txt'):   # segunda pasada: andenes cuyo padre aparece después
    if s['stop_id'] not in stop and s.get('parent_station') in stop: stop[s['stop_id']] = stop[s['parent_station']]
rail_routes = {r['route_id']: (r.get('route_desc', ''), r.get('agency_id', '')) for r in rows(z, 'routes.txt') if r.get('route_type', '') in RAIL}
cal = {r['service_id']: r for r in rows(z, 'calendar.txt')} if 'calendar.txt' in z.namelist() else {}
refs = {d.strftime('%Y%m%d'): k for k, d in REF.items()}
cd = collections.defaultdict(dict)
for r in rows(z, 'calendar_dates.txt'):
    if r['date'] in refs: cd[r['service_id']][r['date']] = r['exception_type']
def active(svc, day):
    d = day.strftime('%Y%m%d'); e = cd.get(svc, {}).get(d)
    if e == '1': return True
    if e == '2': return False
    c = cal.get(svc)
    if not c or not (c['start_date'] <= d <= c['end_date']): return False
    return c[['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][day.weekday()]] == '1'
trips = {}
for t in rows(z, 'trips.txt'):
    if t['route_id'] in rail_routes:
        kinds = [k for k, d in REF.items() if active(t['service_id'], d)]
        cat, ag = rail_routes[t['route_id']]
        # el feed parte un mismo tren en varios viajes (p. ej. Zürich–Bern + Bern–Genève): se unen por operador + número de tren
        if kinds: trips[t['trip_id']] = (kinds, cat, (ag, t.get('trip_short_name') or t['trip_id']))
per = collections.defaultdict(list)
for r in rows(z, 'stop_times.txt'):
    if r['trip_id'] in trips and r['stop_id'] in stop:
        try: per[r['trip_id']].append((secs(r['departure_time'] or r['arrival_time']), stop[r['stop_id']], secs(r['arrival_time'] or r['departure_time'])))
        except ValueError: pass
trains = collections.defaultdict(list)   # (día, operador, número) -> paradas
for tid, st in per.items():
    kinds, cat, key = trips[tid]
    for k in kinds: trains[(k,) + key].extend(st)
res = collections.defaultdict(lambda: collections.defaultdict(dict))
for (k, ag, num), st in trains.items():
    st.sort()
    seq = []
    for dep, name, arr in st:   # (salida, estación, llegada); une el fin de un tramo con el inicio del siguiente
        if seq and seq[-1][1] == name: seq[-1] = (dep, name, seq[-1][2])
        else: seq.append((dep, name, arr))
    for i, j in itertools.combinations(range(len(seq)), 2):
        a, b = seq[i][1], seq[j][1]
        if a == b: continue
        dep, arr = seq[i][0], seq[j][2]
        if arr <= dep or arr - dep > 24 * 3600 or dep >= 28 * 3600: continue   # >28:00 = mañana del día siguiente de un servicio nocturno
        res[(a, b)][k][(ag, num)] = (dep, arr - dep)
out = []
for (a, b), byk in sorted(res.items()):
    rec = {'from': a, 'to': b}
    for k in REF:
        tr = byk.get(k)
        if not tr: continue
        deps = sorted(v[0] for v in tr.values()); durs = [v[1] // 60 for v in tr.values()]
        rec[k] = {'n': len(deps), 'first': fmt(deps[0]), 'last': fmt(deps[-1]), 'fastest_min': min(durs), 'median_min': int(statistics.median(durs))}
    if 'weekday' in rec and rec['weekday']['n'] >= 1: out.append(rec)
dates = [r['start_date'] for r in cal.values()] + [d for v in cd.values() for d in v]
json.dump({'source': {'name': 'Digitraffic / Fintraffic', 'url': 'https://www.digitraffic.fi/en/railway-traffic/', 'license': 'CC BY 4.0', 'file': ZIP.rsplit('/', 1)[-1]},
           'reference_week': {k: v.isoformat() for k, v in REF.items()}, 'pairs': out}, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('pares con tren directo:', len(out))
