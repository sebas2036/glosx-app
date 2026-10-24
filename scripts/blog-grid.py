#!/usr/bin/env python3
"""
Blog en grilla: cada tarjeta .post de blog.html (en/es/fr/it/ja) lleva arriba la foto de su artículo y abajo etiqueta, título,
descripción y fecha; las tarjetas van una al lado de la otra (3 columnas en escritorio, 2 en tablet, 1 en móvil).
Foto: og:image del artículo; si es la genérica del sitio (hero-bg.jpg), la primera foto de Pexels/Unsplash/Wikimedia de la página.
Idempotente: rehace la foto de cada tarjeta en cada corrida. Correrlo después de añadir una tarjeta nueva al principio de blog.html.
Uso: python3 scripts/blog-grid.py
"""
import os, re, html

ROOT = os.path.join(os.path.dirname(__file__), '..')
GENERIC = 'hero-bg.jpg'
CSS_MARK = '/* blog-grid */'
CSS = CSS_MARK + '''
    main.blog-grid { max-width: 1180px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: stretch; }
    main.blog-grid .post { display: flex; flex-direction: column; padding: 0; overflow: hidden; margin: 0; }
    main.blog-grid .post-img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; background: #e9e4dc; }
    main.blog-grid .post-body { display: flex; flex-direction: column; flex: 1; padding: 18px 20px 20px; }
    main.blog-grid .post-title { font-size: 19px; line-height: 1.3; margin: 8px 0 8px; }
    main.blog-grid .post-desc { font-size: 14px; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    main.blog-grid .post-meta { margin-top: auto; padding-top: 12px; }
    @media (max-width: 980px) { main.blog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 620px) { main.blog-grid { grid-template-columns: 1fr; gap: 18px; } }
'''


def photo(href):
    f = os.path.join(ROOT, href.split('#')[0].lstrip('/'))
    if os.path.isdir(f): f = os.path.join(f, 'index.html')
    if not os.path.isfile(f): return None
    s = open(f, encoding='utf8').read()
    og = re.search(r'<meta property="og:image" content="([^"]+)"', s)
    if og and GENERIC not in og.group(1): url = og.group(1)
    else:
        m = re.search(r'https://(?:images\.pexels\.com|images\.unsplash\.com|upload\.wikimedia\.org)/[^"\'\s)]+', s)
        if not m: return None
        url = m.group(0)
    url = html.unescape(url)
    # miniatura liviana para la grilla
    if 'images.pexels.com' in url: url = re.sub(r'\?.*$', '', url) + '?auto=compress&cs=tinysrgb&w=640'
    elif 'images.unsplash.com' in url: url = re.sub(r'\?.*$', '', url) + '?auto=format&fit=crop&w=640&q=70'
    return url


def card(m):
    href, inner = m.group(1), m.group(2)
    inner = re.sub(r'\s*<img class="post-img"[^>]*>', '', inner)
    inner = re.sub(r'\s*<div class="post-body">([\s\S]*)</div>\s*$', r'\1', inner)
    title = re.search(r'<div class="post-title">([\s\S]*?)</div>', inner)
    alt = html.escape(re.sub(r'<[^>]+>', '', title.group(1)).strip(), quote=True) if title else ''
    url = photo(href)
    img = '\n      <img class="post-img" src="%s" alt="%s" loading="lazy" width="640" height="400" />' % (html.escape(url, quote=True), alt) if url else ''
    lines = [x.strip() for x in inner.strip().split('\n') if x.strip()]
    body = '\n      <div class="post-body">\n' + '\n'.join('        ' + x for x in lines) + '\n      </div>\n    '
    return '<a href="%s" class="post">%s%s</a>' % (href, img, body)


for lang in ['', 'es/', 'fr/', 'it/', 'ja/']:
    p = os.path.join(ROOT, lang, 'blog.html')
    s = open(p, encoding='utf8').read()
    s, n = re.subn(r'<a href="([^"]*)" class="post">([\s\S]*?)</a>', card, s)
    s = re.sub(r'<main(?: class="blog-grid")?>', '<main class="blog-grid">', s, count=1)
    if CSS_MARK not in s:
        i = s.index('</style>')
        s = s[:i] + '    ' + CSS + '  ' + s[i:]
    open(p, 'w', encoding='utf8').write(s)
    print(lang or 'en/', n, 'tarjetas')
