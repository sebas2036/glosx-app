#!/usr/bin/env python3
"""
Datos reales de las rutas de EE. UU. desde el GTFS oficial (Amtrak, Brightline y Amtrak Gold Runner).
Rutas: scripts/data/us-routes-selection.json (ver scripts/us-routes-select.py).
Semana de referencia: martes 8, sabado 12 y domingo 13 de diciembre de 2026. Por sentido y tipo de dia:
trenes directos, primera y ultima salida (hora local de la estacion de salida), tren mas rapido y servicios.
Fuentes guardadas en /Volumes/X9 Pro/gtfs-data/{amtrak,brightline,sanjoaquins}.
Uso: python3 -I scripts/us-routes-data.py  ->  scripts/data/us-routes.json
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from us_gtfs_lib import load, pairs  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
GT = '/Volumes/X9 Pro/gtfs-data'
DAYS = {'weekday': '20261208', 'saturday': '20261212', 'sunday': '20261213'}
SEL = json.load(open(os.path.join(ROOT, 'scripts/data/us-routes-selection.json'), encoding='utf8'))

A = load(f'{GT}/amtrak/amtrak_gtfs.zip'); B = load(f'{GT}/brightline/bl_gtfs.zip'); S = load(f'{GT}/sanjoaquins/sanjoaquins.zip')
coords = {}
for g, px in ((A, ''), (B, 'BL:'), (S, 'GR:')):
    coords.update({px + s['stop_id']: (float(s['stop_lat']), float(s['stop_lon'])) for s in g['stops']})
IDX = {}
for kind, day in DAYS.items():
    for p in pairs(A, day, 'Amtrak') + pairs(B, day, 'Brightline', 'BL:') + pairs(S, day, 'Gold Runner', 'GR:'):
        IDX[(kind, p['from_id'], p['to_id'])] = p

out = {'source': {'amtrak': 'https://content.amtrak.com/content/gtfs/GTFS.zip', 'brightline': 'http://feed.gobrightline.com/bl_gtfs.zip',
                  'gold_runner': 'https://data.trilliumtransit.com/gtfs/sanjoaquins-ca-us/sanjoaquins-ca-us.zip',
                  'reference_days': DAYS, 'checked': '2026-11-27'}, 'routes': {}}
flagged = []
for o in SEL:
    a, b = o['a'], o['b']
    r = {k: o[k] for k in ('from', 'to', 'ca', 'cb', 'state_a', 'state_b', 'from_station', 'to_station', 'operator', 'score')}
    r.update({'a': coords[a], 'b': coords[b], 'dirs': {}})
    for d, (x, y) in (('ab', (a, b)), ('ba', (b, a))):
        r['dirs'][d] = {}
        for kind in DAYS:
            p = IDX.get((kind, x, y))
            if p and p['suspect']: flagged.append((o['slug'], d, kind))
            r['dirs'][d][kind] = ({'n': p['trains'], 'first': p['first'], 'last': p['last'], 'fastest_min': p['fastest_min'], 'services': p['services']}
                                  if p and not p['suspect'] else {'n': 0})
    vals = [v for dd in r['dirs'].values() for v in dd.values() if v.get('n')]
    r['fastest_min'] = min(v['fastest_min'] for v in vals)
    r['services'] = sorted({s for v in vals for s in v.get('services', [])})
    out['routes'][o['slug']] = r
json.dump(out, open(os.path.join(ROOT, 'scripts/data/us-routes.json'), 'w'), ensure_ascii=False, indent=1)
print('rutas:', len(out['routes']), '| sentido/dia con datos dudosos (quedan en 0):', len(flagged), flagged[:10])
zero = [s for s, r in out['routes'].items() if not r['dirs']['ab']['weekday']['n'] or not r['dirs']['ba']['weekday']['n']]
print('sin tren un dia de semana en algun sentido:', zero)
