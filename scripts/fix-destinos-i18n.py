#!/usr/bin/env python3
"""Después de traducir /destinos/<x>/<lang>/ con blog-i18n-build.js (LANG_SUFFIX=1): marca el idioma activo en el selector
y traduce el enlace '← Discover' (con su ancla a la portada del idioma). Idempotente. Uso: python3 scripts/fix-destinos-i18n.py"""
import os, re
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
BACK = {'fr': 'Découvrir', 'de': 'Entdecken', 'it': 'Scopri', 'pt': 'Descobrir', 'ja': '見つける', 'zh': '发现'}
n = 0
for d in sorted(os.listdir(os.path.join(ROOT, 'destinos'))):
    for l, b in BACK.items():
        p = os.path.join(ROOT, 'destinos', d, l, 'index.html')
        if not os.path.exists(p): continue
        s = open(p, encoding='utf8').read(); t = s
        t = t.replace('class="lang-option active"', 'class="lang-option"')
        t = t.replace(f'class="lang-option" href="/destinos/{d}/{l}/"', f'class="lang-option active" href="/destinos/{d}/{l}/"')
        t = re.sub(r'<a href="[^"]*#discover" class="nav-back">[^<]*</a>', f'<a href="/{l}/#discover" class="nav-back">← {b}</a>', t)
        if t != s: open(p, 'w', encoding='utf8').write(t); n += 1
print('destinos corregidos:', n)
