#!/usr/bin/env python3
"""
Datos del modo EE. UU. de la portada (assets/js/usa.js, entre /*US_DATA*/ y /*END*/).
Fuente: scripts/data/us-routes.json (GTFS oficial) + nombres de scripts/us_cities.py + fotos de assets/img/ciudades/.
Uso: python3 scripts/generate-us-home.py   (idempotente)
"""
import importlib.util, json, os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from us_cities import CITY, IMG, OMIO  # noqa: E402

spec = importlib.util.spec_from_file_location('ushub', os.path.join(ROOT, 'scripts/generate-us-hub.py'))
HUB = importlib.util.module_from_spec(spec); spec.loader.exec_module(HUB)
spec2 = importlib.util.spec_from_file_location('usroutes', os.path.join(ROOT, 'scripts/generate-us-routes.py'))
RT = importlib.util.module_from_spec(spec2); spec2.loader.exec_module(RT); RIMG = RT.ROUTE_IMG

DATA = json.load(open(os.path.join(ROOT, 'scripts/data/us-routes.json'), encoding='utf8'))['routes']
LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh']
IMGDIR = os.path.join(ROOT, 'assets/img/ciudades')

cities = {}
for r in DATA.values():
    for name, slug, st in ((r['from'], r['ca'], r['state_a']), (r['to'], r['cb'], r['state_b'])):
        if slug in cities: continue
        f = IMG.get(slug, slug)
        img = next((f'/assets/img/ciudades/{f}.{x}' for x in ('webp', 'jpg') if os.path.exists(os.path.join(IMGDIR, f'{f}.{x}'))), None)
        cities[slug] = {'s': slug, 'en': name, 'st': st, 'img': img, 'o': OMIO.get(name, name.lower()),
                        'n': {l: CITY.get(name, {}).get(l, name) for l in LANGS if CITY.get(name, {}).get(l, name) != name}}


def leg(d):
    w = d['weekday']
    return [w.get('n', 0), w.get('fastest_min'), w.get('first')]


routes = {}
for s, r in DATA.items():
    routes[s] = [r['ca'], r['cb'], r['fastest_min'], r['operator'], r['services'][:4], HUB.corridor(r), leg(r['dirs']['ab']), leg(r['dirs']['ba'])]

out = {'cities': sorted(cities.values(), key=lambda c: c['s']), 'routes': routes,
       'order': sorted(DATA, key=lambda s: -DATA[s]['score']),
       'corr': {k: {l: HUB.T[l]['co'][k] for l in LANGS} for k in HUB.ORDER}, 'corrOrder': HUB.ORDER}

p = os.path.join(ROOT, 'assets/js/usa.js')
src = open(p, encoding='utf8').read()
blob = json.dumps(out, ensure_ascii=False, separators=(',', ':'))
src, n = re.subn(r'/\*US_DATA\*/.*?/\*END\*/', lambda m: '/*US_DATA*/' + blob + '/*END*/', src, flags=re.S)
assert n == 1, 'marcador /*US_DATA*/ no encontrado'
open(p, 'w', encoding='utf8').write(src)
print('usa.js: ', len(cities), 'ciudades,', len(routes), 'rutas,', sum(1 for c in cities.values() if c['img']), 'con foto')

# Tarjeta "Guía de la ruta" del planificador (planner-info.js): foto + primer tren y trenes directos un día laborable
cp = os.path.join(ROOT, 'assets/data/route-cards.json')
cards = json.load(open(cp, encoding='utf8'))
for s, r in DATA.items():
    e = {}
    img = ('/assets/img/adventure/' + RIMG[s]) if s in RIMG else (cities[r['cb']]['img'] or cities[r['ca']]['img'])
    if img: e['i'] = img
    for k, d in (('f', 'ab'), ('r', 'ba')):
        w = r['dirs'][d]['weekday']
        if w.get('n'): e[k] = [w['first'], w['n']]
    cards[s] = e
json.dump(cards, open(cp, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print('route-cards.json:', len(cards), 'rutas en total')
