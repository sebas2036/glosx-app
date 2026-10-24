#!/usr/bin/env python3
"""
Horarios de trenes en Suecia a partir del GTFS Sverige 2 de Trafiklab (Samtrafiken, licencia CC0).
Para cada par de estaciones de la lista (en los dos sentidos): trenes directos al día (laborable, sábado, domingo),
primer y último tren y duración del más rápido y mediana. Solo trenes (route_type ferroviario), sin bus/tram/barco.
Uso: python3 scripts/horarios-suecia.py <ruta al zip> assets/data/horarios-suecia.json
Zip: https://api.resrobot.se/gtfs/sweden.zip?key=<clave GTFS Sverige 2 del usuario> (~60 MB, no va al repo; la clave no se guarda).
"""
import csv, io, json, sys, zipfile, unicodedata, datetime, statistics, collections, itertools

ZIP, OUT = sys.argv[1], sys.argv[2]
REF = {'weekday': datetime.date(2027, 1, 12), 'saturday': datetime.date(2027, 1, 16), 'sunday': datetime.date(2027, 1, 17)}   # horario 2027: los nocturnos al norte (Narvik) circulan desde el 13-dic-2026
norm = lambda s: ''.join(c for c in unicodedata.normalize('NFD', s.lower().replace('ø', 'o').replace('æ', 'ae')) if unicodedata.category(c) != 'Mn').strip()
# nombre de estación en el GTFS (normalizado) -> nombre que mostramos
STATIONS = {'stockholm centralstation': 'Stockholm C', 'goteborg centralstation': 'Göteborg C', 'malmo centralstation': 'Malmö C', 'lund centralstation': 'Lund C', 'uppsala centralstation': 'Uppsala C', 'arlanda centralstation': 'Stockholm Arlanda', 'linkoping centralstation': 'Linköping C', 'norrkoping centralstation': 'Norrköping C', 'vasteras centralstation': 'Västerås C', 'orebro centralstation': 'Örebro C', 'jonkoping centralstation': 'Jönköping C', 'karlstad centralstation': 'Karlstad C', 'sundsvall centralstation': 'Sundsvall C', 'umea centralstation': 'Umeå C', 'lulea centralstation': 'Luleå C', 'kiruna station': 'Kiruna', 'abisko ostra station': 'Abisko Östra', 'abisko turiststation': 'Abisko Turiststation', 'narvik station': 'Narvik', 'helsingborg centralstation': 'Helsingborg C', 'kalmar centralstation': 'Kalmar C', 'vaxjo station': 'Växjö', 'gavle centralstation': 'Gävle C', 'ostersund centralstation': 'Östersund C', 'are station': 'Åre', 'hallsberg station': 'Hallsberg', 'nassjo centralstation': 'Nässjö C', 'alvesta station': 'Alvesta', 'hassleholm centralstation': 'Hässleholm C', 'halmstad centralstation': 'Halmstad C', 'varberg station': 'Varberg', 'skovde centralstation': 'Skövde C', 'borlange centralstation': 'Borlänge C', 'falun centralstation': 'Falun C', 'mora station': 'Mora', 'kopenhamn h': 'København H', 'oslo s': 'Oslo S', 'karlskrona centralstation': 'Karlskrona C', 'ystad station': 'Ystad', 'eskilstuna centralstation': 'Eskilstuna C', 'sodertalje syd station': 'Södertälje Syd', 'boden c/resecentrum': 'Boden C'}
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
json.dump({'source': {'name': 'Trafiklab / Samtrafiken (GTFS Sverige 2)', 'url': 'https://www.trafiklab.se/api/gtfs-datasets/gtfs-sverige-2/', 'license': 'CC0 1.0', 'file': ZIP.rsplit('/', 1)[-1]},
           'reference_week': {k: v.isoformat() for k, v in REF.items()}, 'pairs': out}, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('pares con tren directo:', len(out))
