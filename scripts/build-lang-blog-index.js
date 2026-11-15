#!/usr/bin/env node
/**
 * Índice del blog en alemán, portugués y chino (/de|pt|zh/blog.html), a partir de /blog.html EN VIVO:
 * solo las tarjetas de los artículos que ya existen en ese idioma, con título y descripción tomados del
 * propio artículo traducido (h1 y meta description), y al final un enlace al resto de artículos en inglés.
 * Deja hreflang completo en las 8 versiones del índice y el sitemap. Idempotente.
 * Correr después de traducir artículos nuevos.  Uso: node scripts/build-lang-blog-index.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ALL = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'];
const HL = l => l === 'zh' ? 'zh-Hans' : l;
const LOCALE = { de: 'de_DE', pt: 'pt_PT', zh: 'zh_CN' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const exists = f => fs.existsSync(path.join(ROOT, f));
const T = {
  de: { title: 'Blog: Bahnreisen in Europa, Japan und China erklärt — WoW Train · glosx.app', desc: 'Guides, Panoramastrecken und praktische Tipps für Bahnreisen in Europa, Japan und China – von WoW Train.',
    badge: 'Das Journal', h1: 'Bahnreisen,<br/>einfach erklärt.', lead: 'Guides, Panoramastrecken und praktische Tipps für Bahnreisen. Von Reisenden für Reisende geschrieben.', back: '← Startseite',
    more: 'Weitere Artikel auf Englisch →', months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'], read: n => `${n} Min. Lesezeit` },
  pt: { title: 'Blog: viagens de comboio na Europa, Japão e China explicadas — WoW Train · glosx.app', desc: 'Guias, rotas panorâmicas e conselhos práticos para viajar de comboio na Europa, no Japão e na China – da WoW Train.',
    badge: 'O Diário', h1: 'Viajar de comboio,<br/>explicado.', lead: 'Guias, rotas panorâmicas e conselhos práticos para viajar de comboio. Escrito por viajantes, para viajantes.', back: '← Início',
    more: 'Mais artigos em inglês →', months: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'], read: n => `${n} min de leitura` },
  zh: { title: '博客：欧洲、日本和中国火车旅行指南 — WoW Train · glosx.app', desc: 'WoW Train 的火车旅行指南、风景线路和实用建议，覆盖欧洲、日本和中国。',
    badge: '旅行笔记', h1: '火车旅行，<br/>讲清楚。', lead: '火车旅行指南、风景线路和实用建议。由旅行者写给旅行者。', back: '← 首页',
    more: '更多英文文章 →', months: null, read: n => `阅读约 ${n} 分钟` }
};
const TAGS = {
  de: { China: 'China', Japan: 'Japan', 'Night Trains': 'Nachtzüge', 'Night trains': 'Nachtzüge', 'Budget Rail': 'Günstig reisen', 'Train vs Flight': 'Zug oder Flug', 'Rail Travel': 'Bahnreisen', 'Scenic routes': 'Panoramastrecken', 'Route guide': 'Streckenführer', 'Travel Guide': 'Reiseguide', 'Saving money': 'Sparen', 'Japan train guide': 'Japan mit dem Zug' },
  pt: { China: 'China', Japan: 'Japão', 'Night Trains': 'Comboios noturnos', 'Night trains': 'Comboios noturnos', 'Budget Rail': 'Comboio barato', 'Train vs Flight': 'Comboio vs. avião', 'Rail Travel': 'Viagens de comboio', 'Scenic routes': 'Rotas panorâmicas', 'Route guide': 'Guia de rota', 'Travel Guide': 'Guia de viagem', 'Saving money': 'Poupar', 'Japan train guide': 'Japão de comboio' },
  zh: { China: '中国', Japan: '日本', 'Night Trains': '夜车', 'Night trains': '夜车', 'Budget Rail': '省钱出行', 'Train vs Flight': '火车还是飞机', 'Rail Travel': '铁路旅行', 'Scenic routes': '风景线路', 'Route guide': '线路指南', 'Travel Guide': '旅行指南', 'Saving money': '省钱', 'Japan train guide': '日本火车指南' }
};
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function meta(s, l) {
  const m = s.match(/^(\w+) (\d{4}) · (\d+) min read$/);
  if (!m) return s;
  const mi = MONTHS.indexOf(m[1]);
  const date = l === 'zh' ? `${m[2]} 年 ${mi + 1} 月` : l === 'de' ? `${T.de.months[mi]} ${m[2]}` : `${T.pt.months[mi]} de ${m[2]}`;
  return `${date} · ${T[l].read(m[3])}`;
}
const src = fs.readFileSync(path.join(ROOT, 'blog.html'), 'utf8');
const url = l => `https://glosx.app/${l === 'en' ? '' : l + '/'}blog.html`;

for (const l of ['de', 'pt', 'zh']) {
  const t = T[l];
  let h = src;
  const a = h.indexOf('<main class="blog-grid">'), b = h.indexOf('</main>', a);
  const cards = h.slice(a, b).match(/<a href="\/(blog-[a-z0-9-]+\.html)" class="post">[\s\S]*?<\/a>/g) || [];
  const kept = [];
  for (const c of cards) {
    const f = c.match(/href="\/(blog-[a-z0-9-]+\.html)"/)[1];
    if (!exists(`${l}/${f}`)) continue;
    const art = fs.readFileSync(path.join(ROOT, l, f), 'utf8');
    const title = ((art.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim();
    const desc = (art.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
    let k = c.replace(`href="/${f}"`, `href="/${l}/${f}"`);
    if (title) k = k.replace(/(<div class="post-title">)[\s\S]*?(<\/div>)/, `$1${esc(title)}$2`).replace(/( alt=")[^"]*(")/, `$1${esc(title)}$2`);
    if (desc) k = k.replace(/(<div class="post-desc">)[\s\S]*?(<\/div>)/, `$1${desc}$2`);
    k = k.replace(/(<span class="post-tag">)([^<]*)(<\/span>)/, (m, x, tag, y) => x + (TAGS[l][tag] || tag) + y);
    k = k.replace(/(<div class="post-meta">)([^<]*)(<\/div>)/, (m, x, s, y) => x + meta(s.trim(), l) + y);
    kept.push(k);
  }
  const main = `<main class="blog-grid">\n    ${kept.join('\n\n    ')}\n    <p style="grid-column:1/-1;text-align:center;margin:24px 0 8px;"><a href="/blog.html">${t.more}</a></p>\n  `;
  h = h.slice(0, a) + main + h.slice(b);
  h = h.replace(/<html lang="[^"]*"/, `<html lang="${HL(l)}"`);
  h = h.replace(/(<title[^>]*>)[^<]*(<\/title>)/, `$1${esc(t.title)}$2`);
  h = h.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(t.desc)}$2`);
  h = h.replace(/\s*<meta name="keywords" content="[^"]*" \/>/, '');
  h = h.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(t.title)}$2`).replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(t.desc)}$2`);
  h = h.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(t.title)}$2`).replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(t.desc)}$2`);
  h = h.replace(/(<meta property="og:locale" content=")[^"]*(")/, `$1${LOCALE[l]}$2`);
  h = h.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url(l)}$2`).replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url(l)}$2`);
  h = h.replace(/(<span class="badge">)[^<]*(<\/span>)/, `$1${t.badge}$2`);
  h = h.replace(/(<div class="blog-index-hero"[\s\S]*?<h1>)[\s\S]*?(<\/h1>)/, `$1${t.h1}$2`);
  h = h.replace(/(<div class="blog-index-hero"[\s\S]*?<p class="lead">)[\s\S]*?(<\/p>)/, `$1\n        ${t.lead}\n      $2`);
  h = h.replace(/(<a href="\/" class="nav-back">)[^<]*(<\/a>)/, `$1${t.back}$2`);
  h = h.replace(/href="\/"/g, `href="/${l}/"`).replace(/href="\/rutas\/"/g, `href="/${l}/rutas/"`).replace(/href="\/about\.html"/g, `href="/${l}/about.html"`);
  h = h.replace(/(<span id="langCode">)[^<]*(<\/span>)/, `$1${l === 'zh' ? '中文' : l.toUpperCase()}$2`);
  h = h.replace(/<script>try\{localStorage\.setItem\('glosx_lang','[a-z]+'\);localStorage\.setItem\('glosx_lang_manual','1'\);\}catch\(e\)\{\}<\/script>\n?/g, '');
  h = h.replace('</head>', `<script>try{localStorage.setItem('glosx_lang','${l}');localStorage.setItem('glosx_lang_manual','1');}catch(e){}</script>\n</head>`);
  fs.writeFileSync(path.join(ROOT, l, 'blog.html'), h);
  console.log(`/${l}/blog.html: ${kept.length} artículos`);
}
// hreflang en las 8 versiones + sitemap
const have = ALL.filter(l => exists(l === 'en' ? 'blog.html' : `${l}/blog.html`));
const block = have.map(l => `<link rel="alternate" hreflang="${HL(l)}" href="${url(l)}" />`).concat(`<link rel="alternate" hreflang="x-default" href="${url('en')}" />`);
const re = new RegExp(`[ \\t]*<link rel="alternate" hreflang="[^"]+" href="https://glosx\\.app/(?:[a-z]{2}/)?blog\\.html" ?/>\\n`, 'g');
for (const l of have) {
  const f = path.join(ROOT, l === 'en' ? 'blog.html' : `${l}/blog.html`);
  let h = fs.readFileSync(f, 'utf8');
  const first = h.search(re);
  if (first < 0) h = h.replace(/(<link rel="canonical"[^>]*>\n)/, `$1${block.map(x => '  ' + x + '\n').join('')}`);
  else { const ind = (h.slice(first).match(/^[ \t]*/) || [''])[0]; h = h.slice(0, first) + block.map(x => ind + x + '\n').join('') + h.slice(first).replace(re, ''); }
  fs.writeFileSync(f, h);
}
const sm = path.join(ROOT, 'sitemap.xml');
let x = fs.readFileSync(sm, 'utf8');
const locs = new Set(have.map(url));
x = x.replace(/  <url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>\n/g, (bb, loc) => locs.has(loc) ? '' : bb);
const alts = have.map(l => `    <xhtml:link rel="alternate" hreflang="${HL(l)}" href="${url(l)}" />`).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${url('en')}" />`;
const today = new Date().toISOString().slice(0, 10);
x = x.replace('</urlset>', have.map(l => `  <url>\n    <loc>${url(l)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n${alts}\n  </url>\n`).join('') + '</urlset>');
fs.writeFileSync(sm, x);
