#!/usr/bin/env python3
"""
Enlaces contextuales dentro de los parrafos de blogs en ingles hacia los hubs de pais (22-nov-2026).
Seleccion EXPLICITA y revisada a mano: solo envuelve en <a> una frase que YA esta escrita en un parrafo en prosa (no inserta texto nuevo),
fuera de enlaces, titulos, listas y lineas de datos. Las rutas prioritarias ya estaban enlazadas desde los blogs (verificado: 0 menciones sin enlazar).
No enlaza a las rutas en prueba de titulos (hasta el 20-dic-2026). Idempotente.
Uso: python3 scripts/add-blog-links.py [--apply]   (desde la raiz del repo)
"""
import re, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
APPLY = '--apply' in sys.argv
# (blog, destino, frase, fragmento del parrafo que identifica el lugar exacto)
ALLOW = [
    ('blog-best-train-trips-europe', '/spain-trains/', 'Renfe', "Renfe's advance fares start"),
    ('blog-best-train-trips-europe', '/italy-trains/', 'Trenitalia', 'Trenitalia and Italo compete on this route'),
    ('blog-best-train-trips-europe', '/france-trains/', 'SNCF', 'Renfe in Spain, SNCF in France'),
    ('blog-cheap-train-tickets-europe', '/france-trains/', 'SNCF', 'Carte Jeune'),
    ('blog-eurail-pass-vs-point-to-point', '/france-trains/', 'trains in France', 'High-speed trains in France, Spain and Italy'),
    ('blog-eurail-pass-vs-point-to-point', '/germany-trains/', 'Deutsche Bahn', 'Prices are set by each national rail operator'),
    ('blog-madrid-barcelona-train-guide', '/spain-trains/', 'Renfe', 'live departures and the best fares across Renfe'),
    ('blog-italy-interrail-itinerary', '/italy-trains/', 'Trenitalia', 'Frecciarossa (Trenitalia) and Italo both run'),
    ('blog-backpacking-italy', '/italy-trains/', 'Trenitalia', 'live schedules and fares across Trenitalia'),
]
def wrap(inner, url, phrase):
    parts = re.split(r'(<[^>]+>)', inner); depth = 0
    for i, part in enumerate(parts):
        if part.startswith('<'):
            m = re.match(r'<(/?)([a-zA-Z0-9]+)', part)
            if m and m.group(2).lower() == 'a': depth += -1 if m.group(1) else 1
            continue
        if depth > 0: continue
        m = re.search(r'(?<![\w-])' + re.escape(phrase) + r'(?![\w-])', part)
        if m:
            parts[i] = part[:m.start()] + f'<a href="{url}">{m.group(0)}</a>' + part[m.end():]
            return ''.join(parts), True
    return inner, False

done = []; fail = []
for blog, url, phrase, ctx in ALLOW:
    p = os.path.join(ROOT, blog + '.html'); s = open(p, encoding='utf-8').read()
    if f'href="{url}"' in s: fail.append((blog, url, 'ya enlazado')); continue
    ok = False
    for m in re.finditer(r'(<p(?:\s[^>]*)?>)(.*?)(</p>)', s, re.S):
        plain = re.sub(r'<[^>]+>', '', m.group(2))
        if ctx in plain:
            new, ok = wrap(m.group(2), url, phrase)
            if ok:
                s = s[:m.start()] + m.group(1) + new + m.group(3) + s[m.end():]
                break
    if ok:
        done.append((blog, url, phrase, ctx))
        if APPLY: open(p, 'w', encoding='utf-8').write(s)
    else: fail.append((blog, url, 'no se encontro el parrafo'))
print(('APLICADO' if APPLY else 'EN SECO'), '| enlaces:', len(done))
for b, u, ph, c in done: print(f'  + {b}: "{ph}" -> {u}')
for b, u, why in fail: print(f'  - {b} {u}: {why}')
