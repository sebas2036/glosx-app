#!/usr/bin/env python3
"""Parte sitemap.xml en un sitemap por idioma (sitemap-en.xml … sitemap-zh.xml) + sitemap-index.xml.
Sirve para ver en Search Console cuántas páginas indexó Google de cada idioma. sitemap.xml sigue siendo
el completo (lo actualizan los demás scripts): volver a correr esto después de cada cambio.
Uso: python3 scripts/split-sitemaps.py"""
import re, os, datetime
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
x = open(os.path.join(ROOT, 'sitemap.xml'), encoding='utf8').read()
i = x.index('<urlset')
head = x[:x.index('>', i) + 1] + '\n'   # declaración XML + <urlset …> con sus namespaces (xhtml incluido)
blocks = re.findall(r'[ \t]*<url[\s>][\s\S]*?</url>', x)
LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh']
def lang_of(loc):
    p = loc.replace('https://glosx.app/', '')
    m = re.match(r'(es|fr|de|it|pt|ja|zh|en)/', p) or re.search(r'/(es|fr|de|it|pt|ja|zh)/$', p)   # /es/… o /rutas/x/es/
    if m: return m.group(1)
    if p.startswith('horarios-trenes-espana'): return 'es'
    return 'en'
groups = {l: [] for l in LANGS}
for b in blocks:
    loc = re.search(r'<loc>([^<]+)</loc>', b).group(1)
    groups[lang_of(loc)].append(b)
today = datetime.date.today().isoformat()
for l, bs in groups.items():
    open(os.path.join(ROOT, f'sitemap-{l}.xml'), 'w', encoding='utf8').write(head + '\n'.join(bs) + '\n</urlset>\n')
idx = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
    f'  <sitemap>\n    <loc>https://glosx.app/sitemap-{l}.xml</loc>\n    <lastmod>{today}</lastmod>\n  </sitemap>\n' for l in LANGS) + '</sitemapindex>\n'
open(os.path.join(ROOT, 'sitemap-index.xml'), 'w', encoding='utf8').write(idx)
print({l: len(b) for l, b in groups.items()}, 'total', sum(len(b) for b in groups.values()))
