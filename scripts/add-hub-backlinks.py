#!/usr/bin/env python3
"""
Enlaces de vuelta "Part of our {pais} train guide" desde las paginas de ruta (ingles, raiz) hacia sus hubs.
Se inserta un parrafo antes del primer <div class="related-routes"> (misma posicion que el enlace de swiss-trains). Idempotente:
no agrega un hub que la pagina ya enlaza. No toca las rutas en prueba de titulos hasta el 20-dic-2026.
Uso: python3 scripts/add-hub-backlinks.py [--apply]   (desde la raiz del repo; sin --apply solo informa)
"""
import os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
APPLY = '--apply' in sys.argv
TEST_PAGES = {'frankfurt-cologne', 'barcelona-valencia', 'brno-vienna', 'vienna-krems', 'basel-lauterbrunnen', 'dortmund-munich'}
LABEL = {
    'germany-trains': 'Germany train guide', 'spain-trains': 'Spain train guide', 'italy-trains': 'Italy train guide',
    'france-trains': 'France train guide', 'benelux-trains': 'Belgium and Netherlands train guide',
    'austria-trains': 'Austria train guide', 'swiss-trains': 'Switzerland train guide',
    'trains-from-london': 'trains from London guide',
    'trains-from-france-to-spain': 'France to Spain train guide', 'trains-from-germany-to-italy': 'Germany to Italy train guide',
    'trains-from-france-to-italy': 'France to Italy train guide',
}
MAP = {}   # ruta -> [hubs]
def add(hub, slugs):
    for s in slugs: MAP.setdefault(s, []).append(hub)
# las 18 rutas con mas impresiones (menos las dos de la prueba de titulos)
add('trains-from-london', ['london-liverpool', 'london-oxford', 'london-cambridge', 'london-brussels', 'london-amsterdam'])
add('benelux-trains', ['brussels-bruges', 'amsterdam-brussels', 'brussels-paris', 'paris-bruges'])
add('swiss-trains', ['basel-paris', 'geneva-paris', 'paris-zurich'])
add('france-trains', ['nice-monaco', 'paris-toulouse', 'paris-lyon', 'paris-milan'])
add('germany-trains', ['munich-berlin', 'frankfurt-paris'])
# hubs existentes que hoy no recibian enlace de vuelta
add('austria-trains', ['graz-vienna', 'innsbruck-vienna', 'vienna-salzburg', 'vienna-krems'])
add('trains-from-france-to-spain', ['lyon-turin', 'paris-amsterdam', 'paris-barcelona', 'paris-nice'])
add('trains-from-germany-to-italy', ['munich-berlin', 'munich-venice', 'vienna-budapest', 'zurich-milan'])
add('trains-from-france-to-italy', ['lyon-turin', 'milan-rome', 'paris-nice', 'zurich-milan'])

changed, skipped = [], []
for slug, hubs in sorted(MAP.items()):
    if slug in TEST_PAGES:
        skipped.append((slug, 'en prueba de titulos hasta el 20-dic-2026')); continue
    p = os.path.join(ROOT, 'rutas', slug, 'index.html')
    s = open(p, encoding='utf-8').read()
    new = [h for h in hubs if f'href="/{h}/"' not in s]
    if not new:
        skipped.append((slug, 'ya enlaza a ' + ', '.join(hubs))); continue
    if '<div class="related-routes">' not in s:
        skipped.append((slug, 'SIN bloque related-routes')); continue
    links = ' &middot; '.join(f'<a href="/{h}/">{LABEL[h]}</a>' for h in new)
    para = f'<p class="hub-link" style="font-size:14px;margin:8px 0 24px;">Part of our {links} &rarr;</p>\n    '
    s2 = s.replace('<div class="related-routes">', para + '<div class="related-routes">', 1)
    changed.append((slug, new))
    if APPLY: open(p, 'w', encoding='utf-8').write(s2)

print(('APLICADO' if APPLY else 'EN SECO'), '| paginas modificadas:', len(changed))
for s, n in changed: print('  +', s, '->', n)
print('omitidas:', len(skipped))
for s, why in skipped: print('  -', s, '|', why)
