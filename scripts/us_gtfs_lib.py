"""Libreria GTFS de EE. UU. (Amtrak + Brightline): pares con tren directo de un dia.
Corrige horas de origen rotas (salto >12 h) y pasa las salidas a hora local de cada estacion.
Pares con tren directo (Amtrak + Brightline) desde el GTFS oficial, para un dia de referencia.
Uso: python3 -I us_pairs.py <amtrak.zip> <brightline.zip> <YYYYMMDD> <out.json>"""
import zipfile, csv, io, sys, json, re, datetime, collections

def load(path):
    z = zipfile.ZipFile(path)
    r = lambda n: list(csv.DictReader(io.TextIOWrapper(z.open(n), 'utf-8-sig'))) if n in z.namelist() else []
    return {n: r(n + '.txt') for n in ('stops', 'trips', 'stop_times', 'calendar', 'calendar_dates', 'routes', 'agency')}

def active(g, day):
    d = datetime.date(int(day[:4]), int(day[4:6]), int(day[6:]))
    wd = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][d.weekday()]
    on = {c['service_id'] for c in g['calendar'] if c['start_date'] <= day <= c['end_date'] and c[wd] == '1'}
    for x in g['calendar_dates']:
        if x['date'] == day:
            (on.add if x['exception_type'] == '1' else on.discard)(x['service_id'])
    return on

def secs(t):
    h, m, s = map(int, t.split(':')); return h * 3600 + m * 60 + s

GAP = 12 * 3600

def segment_times(seq):
    """Mediana del tiempo entre paradas consecutivas, solo de viajes sin saltos raros."""
    acc = collections.defaultdict(list)
    for lst in seq.values():
        l = sorted(lst)
        ok = all(secs(l[k][1]['arrival_time']) - secs(l[k-1][1]['departure_time']) <= GAP for k in range(1, len(l)))
        if not ok: continue
        for k in range(1, len(l)):
            acc[(l[k-1][1]['stop_id'], l[k][1]['stop_id'])].append(secs(l[k][1]['arrival_time']) - secs(l[k-1][1]['departure_time']))
    return {k: sorted(v)[len(v) // 2] for k, v in acc.items()}

def repair(lst, segt):
    """Viajes del feed de Amtrak con un salto falso entre dos paradas (todo lo posterior corrido): se corrige el desfase
    con el tiempo real de ese tramo en otros viajes; si no hay referencia, se descarta lo anterior al salto."""
    lst = [(q, dict(st)) for q, st in lst]
    touched = False
    k = 1
    while k < len(lst):
        a, b = lst[k-1][1], lst[k][1]
        gap = secs(b['arrival_time']) - secs(a['departure_time'])
        if gap > GAP:
            ref = segt.get((a['stop_id'], b['stop_id'])) or segt.get((b['stop_id'], a['stop_id']))  # sentido contrario como referencia
            touched = True
            if ref is None and gap >= 86400 and gap % 86400 <= GAP:
                ref = gap % 86400  # salto de dias enteros (feed de Cascades): se resta el multiplo de 24 h
            if ref is None:
                lst = lst[k:]; k = 1; continue
            off = gap - ref
            for j in range(k, len(lst)):
                for f in ('arrival_time', 'departure_time'):
                    t = secs(lst[j][1][f]) - off
                    lst[j][1][f] = '%02d:%02d:%02d' % (t // 3600, t % 3600 // 60, t % 60)
        k += 1
    return lst, touched

from zoneinfo import ZoneInfo
def local(sec, day, agency_tz, stop_tz):
    base = datetime.datetime(int(day[:4]), int(day[4:6]), int(day[6:]), 12, tzinfo=ZoneInfo(agency_tz)) - datetime.timedelta(hours=12)
    t = (base + datetime.timedelta(seconds=sec)).astimezone(ZoneInfo(stop_tz or agency_tz))
    return t.hour*60 + t.minute

def pairs(g, day, op_default, prefix=''):
    on = active(g, day)
    stop = {s['stop_id']: s for s in g['stops']}
    route = {r['route_id']: r for r in g['routes']}
    agname = {a.get('agency_id', ''): a['agency_name'] for a in g['agency']}
    okr = lambda r: r.get('route_type', '2') == '2' and (len(agname) <= 1 or agname.get(r.get('agency_id', '')) == op_default)
    trips = {t['trip_id']: t for t in g['trips'] if t['service_id'] in on and okr(route.get(t['route_id'], {}))}
    seq = collections.defaultdict(list)
    for st in g['stop_times']:
        if st['trip_id'] in trips and st['departure_time'] and st['arrival_time']:
            seq[st['trip_id']].append((int(st['stop_sequence']), st))
    SEGT = segment_times(seq)
    raw = collections.Counter()
    out = collections.defaultdict(list)
    for tid, lst in seq.items():
        lst.sort()
        for i0 in range(len(lst)):  # conteo bruto (sin horas) para detectar paradas perdidas al reparar
            if lst[i0][1].get('pickup_type') == '1': continue
            for j0 in range(i0 + 1, len(lst)):
                if lst[j0][1].get('drop_off_type') == '1': continue
                raw[(lst[i0][1]['stop_id'], lst[j0][1]['stop_id'])] += 1
        lst, bad = repair(lst, SEGT)
        rt = route.get(trips[tid]['route_id'], {})
        name = rt.get('route_long_name') or rt.get('route_short_name') or op_default
        for i in range(len(lst)):
            a = lst[i][1]
            if a.get('pickup_type') == '1': continue
            for j in range(i + 1, len(lst)):
                b = lst[j][1]
                if b.get('drop_off_type') == '1': continue
                dur = secs(b['arrival_time']) - secs(a['departure_time'])
                out[(a['stop_id'], b['stop_id'])].append((secs(a['departure_time']), dur, name, bad))
    atz = g['agency'][0]['agency_timezone']
    res = []
    for (a, b), v in out.items():
        tz = stop[a].get('stop_timezone') or atz
        deps = sorted(local(x[0], day, atz, tz) * 60 for x in v)
        res.append(dict(from_id=prefix+a, to_id=prefix+b, from_name=stop[a]['stop_name'], to_name=stop[b]['stop_name'],
                        trains=len(v), fastest_min=min(x[1] for x in v) // 60,
                        first='%02d:%02d' % divmod(deps[0] // 60, 60), last='%02d:%02d' % divmod(deps[-1] // 60, 60),
                        services=sorted({x[2] for x in v}), operator=op_default, repaired=any(x[3] for x in v), suspect=raw[(a, b)] != len(v)))
    return res

if __name__ == '__main__':
    am, bl, day, outp = sys.argv[1:5]
    A = load(am); B = load(bl)
    print('Amtrak calendar range:', min(c['start_date'] for c in A['calendar']), max(c['end_date'] for c in A['calendar']))
    print('Amtrak stops sample:', [s['stop_name'] for s in A['stops'][:8]])
    res = pairs(A, day, 'Amtrak') + pairs(B, day, 'Brightline', 'BL:')
    json.dump(res, open(outp, 'w'), ensure_ascii=False)
    print('pares directos:', len(res))
