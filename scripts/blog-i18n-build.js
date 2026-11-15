#!/usr/bin/env node
/**
 * Arma /<lang>/blog-xxx.html a partir del artículo inglés EN VIVO y las traducciones por bloque de
 * scripts/i18n-blog/<slug>.<lang>.json (claves de blog-i18n-extract.js; si falta una clave queda el inglés).
 * Pone título, descripción, canonical, idioma, datos estructurados traducidos, enlaces internos a la versión
 * del idioma, hreflang completo en todas las versiones del artículo y la URL en el sitemap. Idempotente.
 * Uso: node scripts/blog-i18n-build.js blog-xxx.html de [pt zh ...]   (después: node scripts/add-lang-options.js)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ALL = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'];
const HL = l => l === 'zh' ? 'zh-Hans' : l;
const LOCALE = { en: 'en_US', es: 'es_ES', fr: 'fr_FR', de: 'de_DE', it: 'it_IT', pt: 'pt_PT', ja: 'ja_JP', zh: 'zh_CN' };
const BLOCK = 'h1|h2|h3|h4|p|li|td|th|figcaption|summary|blockquote|dt|dd|button|label|caption';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => esc(s).replace(/"/g, '&quot;');
const plain = s => String(s).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, '’').trim();
const exists = f => fs.existsSync(path.join(ROOT, f));
const [file, ...langs] = process.argv.slice(2);
const slug = file.replace(/\/index\.html$/, '').replace(/\.html$/, '');
const EN = require(`./i18n-blog/${slug}.en.json`);
const byText = new Map(Object.entries(EN).filter(([k]) => !k.startsWith('_')).map(([k, v]) => [v, k]));
const src = fs.readFileSync(path.join(ROOT, file), 'utf8');

// bloques que se repiten en todos los artículos (pie, rutas relacionadas): diccionario común por texto inglés,
// y los enlaces a rutas toman el nombre del h1 de la página de la ruta en ese idioma
const COMMON = {};
function common(en, l) {
  if (!COMMON[l]) { const f = path.join(__dirname, 'i18n-blog', `_common.${l}.json`); COMMON[l] = fs.existsSync(f) ? require(f) : {}; }
  if (COMMON[l][en] !== undefined) return COMMON[l][en];
  const m = en.match(/^<a href="\/rutas\/([a-z0-9-]+)\/">[^<]*<\/a>$/);
  if (m && exists(`rutas/${m[1]}/${l}/index.html`)) {
    const t = (fs.readFileSync(path.join(ROOT, 'rutas', m[1], l, 'index.html'), 'utf8').match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1];
    if (t) return `<a href="/rutas/${m[1]}/">${t.trim().replace('→', '&rarr;').replace('&rarr;', '→')}</a>`;
  }
  return undefined;
}
const SRC = process.env.SRC_LANG || 'en';   // idioma de la página raíz (horarios-trenes-espana está en español)
const pagePath = l => l === SRC ? file : `${l}/${file}`;
const pageUrl = l => 'https://glosx.app/' + pagePath(l).replace(/index\.html$/, '');

function build(l) {
  const T = require(`./i18n-blog/${slug}.${l}.json`);
  const bi = src.indexOf('<body');
  let head = src.slice(0, bi), body = src.slice(bi);
  // bloques del cuerpo (fuera de <script>/<style>/<svg>)
  const keep = [];
  body = body.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/g, m => { keep.push(m); return `\u0000${keep.length - 1}\u0000`; });
  const re = new RegExp(`<(${BLOCK})(\\s[^>]*)?>([\\s\\S]*?)</\\1>`, 'g');
  const nested = new RegExp(`<(${BLOCK}|div|ul|ol|table|section)[\\s>]`);
  const reps = [];
  let m;
  while ((m = re.exec(body))) {
    const inner = m[3];
    if (nested.test(inner)) { re.lastIndex = m.index + m[1].length + 1; continue; }
    const k = byText.get(inner.trim());
    const tr = (k && T[k] !== undefined) ? T[k] : common(inner.trim(), l);
    if (tr !== undefined) { const s0 = m.index + m[0].indexOf('>') + 1; reps.push([s0, s0 + inner.length, inner.replace(inner.trim(), tr)]); continue; }
    if (false) { const s0 = m.index + m[0].indexOf('>') + 1; reps.push([s0, s0 + inner.length, inner.replace(inner.trim(), T[k])]); }
  }
  for (const [s0, e0, t] of reps.reverse()) body = body.slice(0, s0) + t + body.slice(e0);
  const tr2 = inner => { const k = byText.get(inner.trim()); return k && T[k] !== undefined ? T[k] : common(inner.trim(), l); };
  body = body.replace(/(<span class="klook-cta-(?:title|sub)">)(.*)(<\/span>\s*)$/gm, (m, a, inner, b) => { const t = tr2(inner); return t === undefined ? m : a + t + b; });
  body = body.replace(/(<a [^>]*class="cta-btn[^"]*"[^>]*>)([^<]+)(<\/a>)/g, (m, a, inner, b) => { const t = tr2(inner); return t === undefined ? m : a + t + b; });
  body = body.replace(/(<div(?:\s[^>]*)?>)([^<]*(?:<(?:strong|em|b|i|a|br|code)[^>]*>[^<]*(?:<\/(?:strong|em|b|i|a|code)>)?[^<]*)*)(<\/div>)/g, (m, a, inner, b) => { if (!inner.trim()) return m; const t = tr2(inner); return t === undefined ? m : a + inner.replace(inner.trim(), t) + b; });
  body = body.replace(/(<span class="(?:badge|tag)">)([^<]*[A-Za-z]{3}[^<]*)(<\/span>)/g, (m, a, inner, b) => { const t = tr2(inner); return t === undefined ? m : a + t + b; });
  body = body.replace(/(<span>)([^<]*[A-Za-z]{3}[^<]*)(<\/span>)/g, (m, a, inner, b) => { const t = tr2(inner); return t === undefined ? m : a + t + b; });
  // nombre de la ruta en las tarjetas de rutas relacionadas
  body = body.replace(/(<a href="\/rutas\/([a-z0-9-]+)\/"[^>]*class="related-link"[^>]*>)([^<]+)/g, (m, a, s2, name) => { const t = common(`<a href="/rutas/${s2}/">${name.trim()}</a>`, l); const n = t && (t.match(/>([^<]+)<\/a>$/) || [])[1]; return n ? a + n : m; });
  body = body.replace(/\u0000(\d+)\u0000/g, (m, i) => keep[+i]);
  // datos estructurados: textos de las preguntas y titulares traducidos
  const pairs = [];
  for (const [k, en] of Object.entries(EN)) if (!k.startsWith('_') && T[k] !== undefined) pairs.push([plain(en), plain(T[k])]);
  if (T._title) pairs.push([plain(EN._title).replace(/ — WoW Train · glosx\.app$| \| WoW Train · glosx\.app$/, ''), plain(T._title).replace(/ — WoW Train · glosx\.app$| \| WoW Train · glosx\.app$/, '')]);
  if (T._desc) pairs.push([plain(EN._desc), plain(T._desc)]);
  pairs.sort((a, b) => b[0].length - a[0].length);
  const fixLd = s => s.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (m, a, json, b) => {
    for (const [e, t] of pairs) if (e.length > 3) json = json.split(JSON.stringify(e).slice(1, -1)).join(JSON.stringify(t).slice(1, -1));
    json = json.replace(/("name":\s*)"Home"/g, `$1"${{ de: 'Startseite', pt: 'Início', zh: '首页', es: 'Inicio', fr: 'Accueil', it: 'Home', ja: 'ホーム' }[l] || 'Home'}"`).replace(/("item":\s*)"https:\/\/glosx\.app\/"/g, `$1"https://glosx.app/${l}/"`);
    json = json.split(`"https://glosx.app/${file}"`).join(`"${pageUrl(l)}"`).split(`"${pageUrl(SRC)}"`).join(`"${pageUrl(l)}"`).replace(/"inLanguage":\s*"[a-z-]+"/g, `"inLanguage":"${HL(l)}"`);
    return a + json + b;
  });
  head = fixLd(head); body = fixLd(body);
  // cabecera
  const title = T._title || EN._title, desc = T._desc || EN._desc;
  head = head.replace(/<html lang="[^"]*"/, `<html lang="${HL(l)}"`);
  head = head.replace(/(<title[^>]*>)[^<]*(<\/title>)/, `$1${esc(title)}$2`);
  head = head.replace(/(<meta name="description" content=")[^"]*(")/, `$1${attr(desc)}$2`);
  head = head.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${attr(title)}$2`).replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${attr(desc)}$2`);
  head = head.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${attr(title)}$2`).replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${attr(desc)}$2`);
  head = head.replace(/(<meta property="og:locale" content=")[^"]*(")/, `$1${LOCALE[l]}$2`);
  head = head.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${pageUrl(l)}$2`);
  head = head.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${pageUrl(l)}$2`);
  head = head.replace(/<script>try\{localStorage\.setItem\('glosx_lang','[a-z]+'\);localStorage\.setItem\('glosx_lang_manual','1'\);\}catch\(e\)\{\}<\/script>\n?/g, '');
  head = head.replace('</head>', `<script>try{localStorage.setItem('glosx_lang','${l}');localStorage.setItem('glosx_lang_manual','1');}catch(e){}</script>\n</head>`);
  let h = head + body;
  h = h.replace(/<html lang="[^"]*"/, `<html lang="${HL(l)}"`);
  // código de idioma visible en el selector
  h = h.replace(/(<span id="langCode">)[^<]*(<\/span>)/, `$1${l === 'zh' ? '中文' : l.toUpperCase()}$2`);
  // enlaces internos a la versión de este idioma (si existe) y rutas relativas a absolutas
  h = h.replace(/(href|src)="(?!https?:|\/|#|mailto:|data:|tel:|javascript:)([^"]+)"/g, '$1="/$2"');
  h = h.replace(/href="\/"/g, `href="/${l}/"`);
  h = h.replace(/href="\/rutas\/"/g, exists(`${l}/rutas/index.html`) ? `href="/${l}/rutas/"` : 'href="/rutas/"');
  h = h.replace(/href="\/rutas\/([a-z0-9-]+)\/"/g, (m, s) => exists(`rutas/${s}/${l}/index.html`) ? `href="/rutas/${s}/${l}/"` : m);
  h = h.replace(/href="\/((?:blog|guide)[a-z0-9-]*\.html|about\.html)"/g, (m, f) => exists(`${l}/${f}`) || f === file ? `href="/${l}/${f}"` : m);
  h = h.replace(/href="\/(trains-from-[a-z-]+)\/"/g, (m, f) => exists(`${l}/${f}/index.html`) ? `href="/${l}/${f}/"` : m);
  h = h.replace(/href="\/(ai-planner|explore|hoy)\/"/g, (m, f) => exists(`${l}/${f}/index.html`) ? `href="/${l}/${f}/"` : m);
  fs.mkdirSync(path.dirname(path.join(ROOT, pagePath(l))), { recursive: true });
  fs.writeFileSync(path.join(ROOT, pagePath(l)), h);
}
for (const l of langs) build(l);

// hreflang completo en todas las versiones
const have = ALL.filter(l => exists(pagePath(l)));
const block = have.map(l => `<link rel="alternate" hreflang="${HL(l)}" href="${pageUrl(l)}" />`).concat(`<link rel="alternate" hreflang="x-default" href="${pageUrl('en')}" />`);
const urls = have.map(pageUrl).map(u => u.replace(/[.?]/g, '\\$&')).join('|');
for (const l of have) {
  const f = path.join(ROOT, pagePath(l));
  let h = fs.readFileSync(f, 'utf8');
  const re = new RegExp(`[ \\t]*<link rel="alternate" hreflang="[^"]+" href="(?:${urls})" ?/>\\n`, 'g');
  const first = h.search(re);
  if (first < 0) h = h.replace(/(<link rel="canonical"[^>]*>\n)/, `$1${block.map(x => '  ' + x + '\n').join('')}`);
  else { const ind = (h.slice(first).match(/^[ \t]*/) || [''])[0]; h = h.slice(0, first) + block.map(x => ind + x + '\n').join('') + h.slice(first).replace(re, ''); }
  fs.writeFileSync(f, h);
}
// sitemap
const sm = path.join(ROOT, 'sitemap.xml');
let x = fs.readFileSync(sm, 'utf8');
const locs = new Set(have.map(pageUrl)), pr = {};
x = x.replace(/  <url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>\n/g, (b, loc) => { if (!locs.has(loc)) return b; pr[loc] = [(b.match(/<lastmod>([^<]+)</) || [])[1], (b.match(/<priority>([^<]+)</) || [])[1]]; return ''; });
const today = new Date().toISOString().slice(0, 10);
const alts = have.map(l => `    <xhtml:link rel="alternate" hreflang="${HL(l)}" href="${pageUrl(l)}" />`).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('en')}" />`;
let add = '';
for (const l of have) { const u = pageUrl(l), p = pr[u] || []; add += `  <url>\n    <loc>${u}</loc>\n    <lastmod>${langs.includes(l) ? today : p[0] || today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p[1] || '0.7'}</priority>\n${alts}\n  </url>\n`; }
fs.writeFileSync(sm, x.replace('</urlset>', add + '</urlset>'));
fs.appendFileSync(path.join(__dirname, 'blog-i18n-urls.txt'), langs.map(pageUrl).join('\n') + '\n');
console.log(file, '→', langs.join(', '), '· versiones:', have.join(' '));
