#!/usr/bin/env node
/**
 * Índice de rutas en chino (/zh/rutas/), a partir de /rutas/index.html: lista solo las rutas que tienen
 * versión /zh/, agrupadas en China, Japón y Europa (lee el título y la insignia de cada página zh).
 * El bloque de China va entre las mismas marcas que usa generate-routes-china.js. También suma
 * hreflang zh-Hans y la opción 中文 en los otros índices, y la URL al sitemap. Idempotente.
 * Uso: node scripts/build-zh-hub.js   (correr después de generar páginas zh nuevas)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const RUTAS = path.join(ROOT, 'rutas');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const groups = { cn: [], jp: [], eu: [] };
for (const slug of fs.readdirSync(RUTAS).sort()) {
  const p = path.join(RUTAS, slug, 'zh', 'index.html');
  if (!fs.existsSync(p)) continue;
  const h = fs.readFileSync(p, 'utf8');
  const t = (h.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1];
  const badge = (h.match(/线路指南 · (中国|日本|欧洲)/) || [])[1];
  if (!t || !badge) { console.error('Sin título o insignia:', slug); continue; }
  groups[{ 中国: 'cn', 日本: 'jp', 欧洲: 'eu' }[badge]].push([slug, t.trim()]);
}
const list = arr => '    <ul class="routes-index-list">\n' + arr.map(([s, t]) => `      <li><a href="/rutas/${s}/zh/">${esc(t).replace('→', '&rarr;')}</a></li>`).join('\n') + '\n    </ul>';
const total = groups.cn.length + groups.jp.length + groups.eu.length;

let s = fs.readFileSync(path.join(RUTAS, 'index.html'), 'utf8');
s = s.replace('<html lang="en">', '<html lang="zh-Hans">');
s = s.replace(/<title>[^<]*<\/title>/, '<title>火车线路指南：中国、日本、欧洲 · WoW Train · glosx.app</title>');
const desc = `WoW Train 的中文火车线路指南：${groups.cn.length} 条中国高铁线路、${groups.jp.length} 条日本线路和 ${groups.eu.length} 条欧洲线路，附行程时长、车站和订票方法。`;
s = s.replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`);
s = s.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${desc}$2`);
s = s.replace(/(<meta property="og:title" content=")[^"]*(")/, '$1火车线路指南 · WoW Train$2');
s = s.replace(/(<meta name="twitter:title" content=")[^"]*(")/, '$1火车线路指南 · WoW Train$2');
s = s.replace('<link rel="canonical" href="https://glosx.app/rutas/" />', '<link rel="canonical" href="https://glosx.app/zh/rutas/" />');
s = s.replace('<meta property="og:url" content="https://glosx.app/rutas/" />', '<meta property="og:url" content="https://glosx.app/zh/rutas/" />');
s = s.replace('<a href="/">WoW Train</a>', '<a href="/zh/">WoW Train</a>');
s = s.replace(/<a href="\/"([^>]*)>(\s*(?:&larr;|←)\s*)Home<\/a>/, '<a href="/zh/"$1>$2首页</a>');
s = s.replace(/<span id="langCode">[^<]*<\/span>/, '<span id="langCode">中文</span>');
s = s.replace(/\s*<div class="hub-mosaic">[\s\S]*?<\/div>\n/, '\n');
s = s.replace(/<header>[\s\S]*?<\/header>/, `<header>
    <h1>火车线路指南</h1>
    <p>WoW Train 的中文线路指南：行程时长、车站、实用建议和订票方法。其他线路目前只有英文等语言版本，可以在<a href="/rutas/">全部线路（英文）</a>中查看。</p>
  </header>`);
s = s.replace(/<section class="routes-index"[\s\S]*?<\/section>/, `<section class="routes-index" aria-label="线路指南">
    <!-- china-guides:start -->
    <h2 id="china">中国线路指南 · ${groups.cn.length} 条</h2>
${list(groups.cn)}
    <!-- china-guides:end -->
    <h2 id="japan">日本线路指南 · ${groups.jp.length} 条</h2>
${list(groups.jp)}
    <h2 id="europe">欧洲线路指南 · ${groups.eu.length} 条</h2>
${list(groups.eu)}
  </section>`);
s = s.replace(/<footer>[\s\S]*?<\/footer>/, '<footer>\n    <p>&copy; 2026 GLOSX &middot; <a href="/zh/">glosx.app</a> &middot; <a href="/rutas/">全部线路（英文）</a></p>\n  </footer>');
s = s.replace(/<script src="\/assets\/js\/rutas-search\.js[^"]*" defer><\/script>\n\s*/, '');

// hreflang + opción 中文 en los 6 índices
const HUBS = ['rutas/index.html', 'es/rutas/index.html', 'fr/rutas/index.html', 'it/rutas/index.html', 'ja/rutas/index.html'];
const addZh = h => {
  if (!h.includes('hreflang="zh-Hans"')) h = h.replace(/(\n\s*<link rel="alternate" hreflang="x-default")/, '\n  <link rel="alternate" hreflang="zh-Hans" href="https://glosx.app/zh/rutas/" />$1');
  if (!h.includes('href="/zh/rutas/"')) h = h.replace(/(<div class="lang-dropdown"[^>]*>[\s\S]*?)(<\/div>)/, '$1<a class="lang-option" href="/zh/rutas/" hreflang="zh-Hans" lang="zh-Hans">中文</a>$2');
  return h;
};
s = addZh(s).replace(/<a class="lang-option active"/, '<a class="lang-option"').replace('<a class="lang-option" href="/zh/rutas/"', '<a class="lang-option active" href="/zh/rutas/"');
fs.mkdirSync(path.join(ROOT, 'zh', 'rutas'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'zh', 'rutas', 'index.html'), s);
for (const f of HUBS) { const p = path.join(ROOT, f); if (fs.existsSync(p)) fs.writeFileSync(p, addZh(fs.readFileSync(p, 'utf8'))); }

const sm = path.join(ROOT, 'sitemap.xml');
let x = fs.readFileSync(sm, 'utf8');
if (!x.includes('<loc>https://glosx.app/zh/rutas/</loc>')) {
  x = x.replace('</urlset>', `  <url>\n    <loc>https://glosx.app/zh/rutas/</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>`);
  fs.writeFileSync(sm, x);
}
console.log(`/zh/rutas/ listo: ${total} rutas (China ${groups.cn.length}, Japón ${groups.jp.length}, Europa ${groups.eu.length})`);
