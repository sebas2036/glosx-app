#!/usr/bin/env python3
"""
Alta de EE. UU. en indices, sitemaps y llms.txt (idempotente):
- seccion "United States" en rutas/index.html y <lang>/rutas/index.html (marcadores usa-guides:start/end) y chip del hub en la lista de guias por pais;
- <url> de las 260 rutas x 8 idiomas + hub x 8 en sitemap.xml y en sitemap-<lang>.xml, con hreflang completo;
- linea del hub en llms.txt.
Uso: python3 scripts/us-index-sitemap.py
"""
import json, os, re, sys, html

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from us_cities import CITY  # noqa: E402

DATA = json.load(open(os.path.join(ROOT, 'scripts/data/us-routes.json'), encoding='utf8'))['routes']
ORDERED = sorted(DATA, key=lambda s: -DATA[s]['score'])
LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh']
HL = {'en': 'en', 'es': 'es', 'fr': 'fr', 'de': 'de', 'it': 'it', 'pt': 'pt', 'ja': 'ja', 'zh': 'zh-Hans'}
TODAY = '2026-11-27'
H2 = {'en': 'United States route guides &middot; {n} routes', 'es': 'Guías de rutas de Estados Unidos · {n} rutas', 'fr': 'Guides d\'itinéraires aux États-Unis · {n} itinéraires',
      'de': 'Streckenführer USA · {n} Strecken', 'it': 'Guide dei percorsi negli Stati Uniti · {n} percorsi', 'pt': 'Guias de rotas dos Estados Unidos · {n} rotas',
      'ja': 'アメリカのルートガイド・{n}路線', 'zh': '美国线路指南 · {n} 条'}
HUBTXT = {'en': 'How rail works in the US, by corridor →', 'es': 'Cómo funciona el tren en EE. UU., por corredor →', 'fr': 'Le train aux États-Unis, par corridor →',
          'de': 'Bahnfahren in den USA, nach Korridor →', 'it': 'Il treno negli Stati Uniti, per corridoio →', 'pt': 'O comboio nos EUA, por corredor →',
          'ja': 'アメリカの鉄道を回廊別に見る →', 'zh': '按走廊了解美国铁路 →'}
cname = lambda c, l: CITY.get(c, {}).get(l, c)
suf = lambda l: '' if l == 'en' else l + '/'
rurl = lambda s, l: f'https://glosx.app/rutas/{s}/{suf(l)}'
hurl = lambda l: f'https://glosx.app/{suf(l)}usa-trains/'


def index_pages():
    for l in LANGS:
        p = os.path.join(ROOT, 'rutas' if l == 'en' else f'{l}/rutas', 'index.html')
        s = open(p, encoding='utf8').read()
        s = re.sub(r'\n    <!-- usa-guides:start -->.*?<!-- usa-guides:end -->', '', s, flags=re.S)
        lis = '\n'.join(f'      <li><a href="/rutas/{x}/{suf(l)}">{html.escape(cname(DATA[x]["from"], l))} &rarr; {html.escape(cname(DATA[x]["to"], l))}</a></li>' for x in ORDERED)
        block = (f'\n    <!-- usa-guides:start -->\n    <h2 id="usa">{H2[l].format(n=len(DATA))}</h2>\n'
                 f'    <p style="margin:0 0 12px;font-size:14px;"><a href="/{suf(l)}usa-trains/">{HUBTXT[l]}</a></p>\n'
                 f'    <ul class="routes-index-list">\n{lis}\n    </ul>\n    <!-- usa-guides:end -->')
        assert '<!-- china-guides:end -->' in s, p
        s = s.replace('<!-- china-guides:end -->', '<!-- china-guides:end -->' + block, 1)
        if l == 'en' and 'href="/usa-trains/"' not in s.split('<!-- usa-guides:start -->')[0]:
            s = s.replace('<li><a href="/china-trains/">China</a></li></ul>', '<li><a href="/china-trains/">China</a></li><li><a href="/usa-trains/">United States</a></li></ul>', 1)
        open(p, 'w', encoding='utf8').write(s)


def url_block(loc, alts, prio='0.7'):
    links = ''.join(f'\n      <xhtml:link rel="alternate" hreflang="{HL[x]}" href="{u}" />' for x, u in alts) + \
            f'\n      <xhtml:link rel="alternate" hreflang="x-default" href="{alts[0][1]}" />'
    return f'  <url>\n    <loc>{loc}</loc>\n    <lastmod>{TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>{prio}</priority>{links}\n  </url>\n'


def sitemaps():
    entries = {l: [] for l in LANGS}
    for l in LANGS:
        entries[l].append(url_block(hurl(l), [(x, hurl(x)) for x in LANGS], '0.8'))
        for x in ORDERED:
            entries[l].append(url_block(rurl(x, l), [(y, rurl(x, y)) for y in LANGS]))
    added = {}
    for fname, langs in [('sitemap.xml', LANGS)] + [(f'sitemap-{l}.xml', [l]) for l in LANGS]:
        p = os.path.join(ROOT, fname)
        s = open(p, encoding='utf8').read()
        new = [b for l in langs for b in entries[l] if re.search(r'<loc>(.*?)</loc>', b).group(1) not in s]
        s = s.replace('</urlset>', ''.join(new) + '</urlset>', 1)
        open(p, 'w', encoding='utf8').write(s)
        added[fname] = len(new)
    return added


def llms():
    p = os.path.join(ROOT, 'llms.txt'); s = open(p, encoding='utf8').read()
    if 'usa-trains' in s: return
    line = f'- [Trains in the United States](https://glosx.app/usa-trains/): Amtrak corridors, Brightline in Florida and long-distance trains, with {len(DATA)} routes and timetable data from the official GTFS feeds\n'
    m = re.search(r'- \[Trains in China\][^\n]*\n', s)
    s = s[:m.end()] + line + s[m.end():] if m else s + line
    open(p, 'w', encoding='utf8').write(s)


if __name__ == '__main__':
    index_pages(); print('indices: 8 idiomas')
    print('sitemaps:', sitemaps())
    llms(); print('llms.txt ok')
