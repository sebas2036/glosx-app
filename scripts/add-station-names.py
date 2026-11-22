#!/usr/bin/env python3
"""
Nombres exactos de estacion en el primer parrafo (<p class="lead">) y en la respuesta del FAQ "Which station do I leave from and arrive at?"
de las rutas objetivo. SOLO usa el par que la propia pagina ya declara en su tarjeta ("Stations: A -> B"); si la pagina no lo trae no se toca
(no se inventan nombres). La respuesta generica original se reemplaza (en el HTML visible y en el FAQPage JSON-LD).
Idempotente. Uso: python3 scripts/add-station-names.py [--apply]   (desde la raiz del repo)
"""
import re, os, sys, html, json

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
APPLY = '--apply' in sys.argv
ROUTES = ['london-liverpool', 'london-brussels', 'london-oxford', 'london-amsterdam', 'london-cambridge', 'brussels-bruges', 'basel-paris', 'nice-monaco',
          'paris-toulouse', 'paris-zurich', 'geneva-paris', 'paris-milan', 'brussels-paris', 'munich-berlin', 'amsterdam-brussels', 'frankfurt-paris',
          'paris-lyon', 'paris-bruges']
GEN = "It depends on the service. Large cities can have more than one station, so check the departure and arrival stations shown on each result before you book."
PAIR = re.compile(r'Stations:\s*(?:</?[^>]*>\s*)*([^<→]+?)\s*(?:→|&rarr;)\s*([^<]+?)\s*(?:<|View)')

done, skip = [], []
for sl in ROUTES:
    p = os.path.join(ROOT, 'rutas', sl, 'index.html')
    s = open(p, encoding='utf-8').read()
    m = PAIR.search(re.sub(r'\s+', ' ', s))
    if not m:
        skip.append((sl, 'la pagina no declara estaciones')); continue
    a, b = html.unescape(m.group(1)).strip(), html.unescape(m.group(2)).strip()
    sentence = f'Trains on this route run from {a} to {b}.'
    new_faq = f'{sentence} Large cities can have more than one station, so check the departure and arrival stations shown on each result before you book.'
    n_faq = s.count(GEN)
    s2 = s.replace(GEN, new_faq)
    lead = re.search(r'(<p class="lead">)(.*?)(</p>)', s2, re.S)
    lead_ok = lead and (a not in lead.group(2))
    if lead_ok:
        s2 = s2.replace(lead.group(0), lead.group(1) + lead.group(2).rstrip() + f' Trains run from {html.escape(a, quote=False)} to {html.escape(b, quote=False)}.' + lead.group(3), 1)
    if n_faq == 0 and not lead_ok:
        skip.append((sl, 'ya tenia los nombres')); continue
    for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s2, re.S): json.loads(x)   # el JSON-LD sigue siendo valido
    done.append((sl, a, b, n_faq, bool(lead_ok)))
    if APPLY: open(p, 'w', encoding='utf-8').write(s2)
print('APLICADO' if APPLY else 'EN SECO', '| paginas:', len(done))
for sl, a, b, n, l in done: print(f'  + {sl:20} {a} -> {b} | FAQ x{n} | primer parrafo: {"si" if l else "ya estaba"}')
for sl, why in skip: print(f'  - {sl:20} {why}')
