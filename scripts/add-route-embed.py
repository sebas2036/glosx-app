#!/usr/bin/env python3
"""
Añade la ficha "Lleva esta ruta a tu blog" (assets/js/route-embed.js) a todas las páginas de ruta
(/rutas/*/ en 5 idiomas, Europa y Japón) y a las tablas de datos abiertos por país.
Idempotente: reemplaza la versión si ya está. Correrlo después de regenerar rutas o tablas.
Uso: python3 scripts/add-route-embed.py
"""
import glob, os, re

ROOT = os.path.join(os.path.dirname(__file__), '..')
V = 2
TAG = '  <script src="/assets/js/route-embed.js?v=%d" defer></script>\n' % V
TABLES = ['swiss-trains', 'es/trenes-suiza', 'fr/trains-suisse', 'it/treni-svizzera', 'ja/swiss-trains',
          'austria-trains', 'es/trenes-austria', 'fr/trains-autriche', 'it/treni-austria', 'ja/austria-trains',
          'norway-trains', 'es/trenes-noruega', 'fr/trains-norvege', 'it/treni-norvegia', 'ja/norway-trains',
          'sweden-trains', 'es/trenes-suecia', 'fr/trains-suede', 'it/treni-svezia', 'ja/sweden-trains',
          'finland-trains', 'es/trenes-finlandia', 'fr/trains-finlande', 'it/treni-finlandia', 'ja/finland-trains']

files = glob.glob(os.path.join(ROOT, 'rutas', '*', 'index.html')) + glob.glob(os.path.join(ROOT, 'rutas', '*', '*', 'index.html'))
files += [os.path.join(ROOT, t, 'index.html') for t in TABLES]
n = 0
for p in files:
    if not os.path.isfile(p):
        continue
    s = open(p, encoding='utf8').read()
    s2 = re.sub(r'[ \t]*<script src="/assets/js/route-embed\.js\?v=\d+" defer></script>\n?', '', s)
    if '</body>' not in s2:
        continue
    s2 = s2.replace('</body>', TAG + '</body>', 1)
    if s2 != s:
        open(p, 'w', encoding='utf8').write(s2)
        n += 1
print(n, 'páginas actualizadas de', len(files))
