#!/usr/bin/env python3
"""
Lote 7 de China (54 rutas, 28-nov-2026): lo que generate-routes-china.js no hace y los lotes anteriores
hicieron a mano. Idempotente (no duplica nada si se vuelve a correr):
  - enlace "Part of our China train guide" en las páginas en inglés nuevas
  - assets/data/route-data.json (coordenadas, duración más rápida, cn=1) y route-cards.json (foto, primera salida, trenes)
  - assets/js/japan.js: ciudades nuevas, pares, info, grupos, guías y páginas zh del modo China
  - lista de ciudades de China en main.js / main.min.js
  - páginas Explorar (8 idiomas): enlaces, fichas y contador
  - sitemap.xml: 8 URLs por ruta con hreflang
Correr después de node scripts/generate-routes-china.js.  Uso: python3 scripts/integrate-china-lote7.py
"""
import json, os, re, subprocess

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
P = lambda *a: os.path.join(ROOT, *a)
rd = lambda p: open(P(p), encoding='utf8').read()
def wr(p, s): open(P(p), 'w', encoding='utf8').write(s)

KL = json.load(open(P('scripts/china-klook.json'), encoding='utf8'))['routes']
NEW = [k for k, v in KL.items() if v.get('date') == '2026-12-10']
DATA = json.loads(subprocess.check_output(['node', '-e',
  "const d=require('./scripts/routes-china-data.js');process.stdout.write(JSON.stringify({CITY:d.CITY,LIST:d.LIST}))"], cwd=ROOT))
CITY = DATA['CITY']; PHOTO = {x[0]: x[3] for x in DATA['LIST']}
LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh']
SUF = {'en': '', 'es': 'es/', 'fr': 'fr/', 'de': 'de/', 'it': 'it/', 'pt': 'pt/', 'ja': 'ja/', 'zh': 'zh/'}
HREF = {'en': 'en', 'es': 'es', 'fr': 'fr', 'de': 'de', 'it': 'it', 'pt': 'pt', 'ja': 'ja', 'zh': 'zh-Hans'}
assert len(NEW) == 54, len(NEW)

# 1) enlace al hub de China (solo inglés, igual que el resto de rutas de China)
HUB = '<p class="hub-link" style="font-size:14px;margin:8px 0 24px;">Part of our <a href="/china-trains/">China train guide</a> &rarr;</p>'
for s in NEW:
    p = f'rutas/{s}/index.html'; h = rd(p)
    if 'class="hub-link"' not in h:
        h = h.replace('    <div class="related-routes">', '    ' + HUB + '\n    <div class="related-routes">', 1); wr(p, h)

# 2) route-data.json y route-cards.json
RDj = json.loads(rd('assets/data/route-data.json'))
coord = {}
for k, v in RDj.items():
    if v.get('cn'):
        a, b = k.replace('hong-kong', 'hongkong').split('-'); coord.setdefault(a, v['a']); coord.setdefault(b, v['b'])
coord.setdefault('dunhuang', [40.1421, 94.6620]); coord.setdefault('emeishan', [29.6010, 103.4843])
for s in NEW:
    a, b = s.split('-')
    RDj.setdefault(s, {'a': coord[a], 'b': coord[b], 'm': {'train': KL[s]['fastest_min']}, 'cn': 1, 'c7': 1})
wr('assets/data/route-data.json', json.dumps(RDj, ensure_ascii=False, separators=(',', ':')))
RC = json.loads(rd('assets/data/route-cards.json'))
for s in NEW:
    RC.setdefault(s, {'i': f'https://images.pexels.com/photos/{PHOTO[s]}/pexels-photo-{PHOTO[s]}.jpeg?auto=compress&cs=tinysrgb&w=400',
                      'f': [KL[s]['first'], KL[s]['trains']]})
wr('assets/data/route-cards.json', json.dumps(dict(sorted(RC.items())), ensure_ascii=False, separators=(',', ':')))

# 3) japan.js, modo China
js = rd('assets/js/japan.js')
if "slug: 'dunhuang'" not in js:
    js = js.replace("      { display: 'Yinchuan', slug: 'yinchuan', keywords: ['yinchuan', 'ningxia', '银川', '銀川'] }",
      "      { display: 'Yinchuan', slug: 'yinchuan', keywords: ['yinchuan', 'ningxia', '银川', '銀川'] },\n"
      "      { display: 'Dunhuang', slug: 'dunhuang', keywords: ['dunhuang', 'mogao', '敦煌'] },\n"
      "      { display: 'Emeishan', slug: 'emeishan', keywords: ['emeishan', 'emei', 'mount emei', '峨眉山', '峨眉'] }", 1)
    js = js.replace("  var CN_JA = { beijing: '北京',", "  var CN_JA = { dunhuang: '敦煌', emeishan: '峨眉山', beijing: '北京',", 1)
    js = js.replace("  CN_DATA.valLoc.zh = { beijing: '北京',", "  CN_DATA.valLoc.zh = { dunhuang: '敦煌', emeishan: '峨眉山', beijing: '北京',", 1)
def grp(s):
    a, b = s.split('-')
    if a == 'beijing' and b != 'hongkong': return 'north'
    if s == 'shijiazhuang-taiyuan': return 'north'
    if 'hongkong' in (a, b) or a == 'guangzhou' or b in ('guangzhou', 'shenzhen'): return 'south'
    if a in ('chengdu', 'chongqing', 'dali', 'dunhuang', 'emeishan', 'kunming', 'lanzhou'): return 'west'
    return 'east'
lines = js.split('\n')
for i, l in enumerate(lines):
    t = l.lstrip()
    if t.startswith('routes: [[') and "['xian', 'yinchuan']" in l:
        add = ''.join(f", ['{s.split('-')[0]}', '{s.split('-')[1]}']" for s in NEW if f"['{s.split('-')[0]}', '{s.split('-')[1]}']" not in l)
        lines[i] = l.replace(']],', ']' + add + '],', 1) if l.rstrip().endswith('],') else l
    elif t.startswith("info: '") and 'xian-yinchuan,' in l:
        add = ''.join(f";{s},{KL[s]['fastest_min']},1,,{KL[s]['trains']}" for s in NEW if f";{s}," not in l and not l.split("'")[1].startswith(s + ','))
        lines[i] = re.sub(r"',\s*$", add + "',", l, count=1)
    elif t.startswith('guides: \'') and 'xian-yinchuan' in l or t.startswith("var ZH_PAGES = '"):
        q = l.index("'") + 1; body = l[q:l.index("'", q)]
        add = ''.join(s + ' ' for s in NEW if f' {s} ' not in body)
        lines[i] = l[:q] + body + add + l[l.index("'", q):]
g0 = next(i for i, l in enumerate(lines) if l.startswith('  var CN_DATA = {'))
g1 = next(i for i in range(g0, len(lines)) if lines[i].lstrip().startswith('quick: [['))
for gid in ('north', 'east', 'south', 'west'):
    for i in range(g0, g1):
        if f"{{ id: '{gid}', names:" in lines[i] and lines[i + 1].lstrip().startswith('pairs: [['):
            nl = lines[i + 1]
            add = ''.join(f", ['{s.split('-')[0]}', '{s.split('-')[1]}']" for s in NEW if grp(s) == gid and f"['{s.split('-')[0]}', '{s.split('-')[1]}']" not in nl)
            if add: lines[i + 1] = nl.replace(']]', ']' + add + ']', 1)
js = '\n'.join(lines)
wr('assets/js/japan.js', js)

# 4) lista de ciudades de China del buscador (main.js y main.min.js)
for f in ('assets/js/main.js', 'assets/js/main.min.js'):
    s = rd(f)
    m = re.search(r"(['\"]?China['\"]?:\s*\[)([^\]]*)\]", s)
    names = [x.strip().strip('"') for x in m.group(2).split(',') if x.strip()]
    for n in ('Dunhuang', 'Emeishan'):
        if n not in names: names.append(n)
    names.sort()
    sep = ', ' if ', "' in m.group(2) else ','
    s = s[:m.start(2)] + sep.join(f'"{n}"' for n in names) + s[m.end(2):]
    wr(f, s)

# 5) Explorar (8 idiomas)
CJ = lambda k: CITY[k]['ja']
for l in LANGS:
    f = ('explore/index.html' if l == 'en' else f'{l}/explore/index.html')
    s = rd(f)
    if "'emeishan-leshan'" in s: continue
    link = ''.join(f"      '{x}': '/rutas/{x}/{'ja/' if l == 'ja' else ''}',\n" for x in NEW)
    s = s.replace("      'xian-yinchuan': '/rutas/xian-yinchuan/" + ('ja/' if l == 'ja' else '') + "',\n",
                  "      'xian-yinchuan': '/rutas/xian-yinchuan/" + ('ja/' if l == 'ja' else '') + "',\n" + link, 1)
    def card(x):
        a, b = x.split('-')
        if l == 'ja': return f"      ['{CJ(a)} → {CJ(b)}','中国','{x}'],\n"
        A = CITY[a]['en'].replace("'", "\\'"); B = CITY[b]['en'].replace("'", "\\'")
        return f"      ['{A} → {B}','China','{x}'],\n"
    old = ("      ['西安 → 銀川','中国','xian-yinchuan'],\n" if l == 'ja' else "      ['Xi\\'an → Yinchuan','China','xian-yinchuan'],\n")
    assert old in s, f
    s = s.replace(old, old + ''.join(card(x) for x in NEW), 1)
    s, nrep = re.subn(r'(?<![\d.])424(?=[ 本の条份])', '478', s); assert nrep >= 4, (f, nrep)
    wr(f, s)

# 6) sitemap.xml
sm = rd('sitemap.xml')
blocks = []
for x in NEW:
    if f'<loc>https://glosx.app/rutas/{x}/</loc>' in sm: continue
    url = lambda l: f'https://glosx.app/rutas/{x}/{SUF[l]}'
    alts = ''.join(f'      <xhtml:link rel="alternate" hreflang="{HREF[l]}" href="{url(l)}" />\n' for l in LANGS)
    alts += f'      <xhtml:link rel="alternate" hreflang="x-default" href="{url("en")}" />\n'
    for l in LANGS:
        blocks.append(f'  <url>\n    <loc>{url(l)}</loc>\n    <lastmod>2026-11-28</lastmod>\n    <changefreq>monthly</changefreq>\n'
                      f'    <priority>{"0.8" if l == "en" else "0.7"}</priority>\n{alts}  </url>\n')
sm = sm.replace('</urlset>', ''.join(blocks) + '</urlset>', 1)
wr('sitemap.xml', sm)
open(P('scripts/china-urls-lote7.txt'), 'w').write(''.join(f'https://glosx.app/rutas/{x}/{SUF[l]}\n' for x in NEW for l in LANGS))
print('ok', len(NEW), 'rutas;', len(blocks), 'URLs nuevas en el sitemap')
