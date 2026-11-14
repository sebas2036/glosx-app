#!/usr/bin/env node
/**
 * Páginas fijas en los idiomas que les faltan (fase 5 de los 8 idiomas, 14-nov-2026): /hoy/, /ai-planner/,
 * /explore/ y /about.html en de, pt, zh (y ja en ai-planner). Parte de la página inglesa EN VIVO (no de
 * generadores viejos), aplica en el servidor el diccionario que la página ya usa en el navegador
 * (TRANSLATIONS de main.js, TRANSLATIONS_AI, o el T propio de la página), y le suma al diccionario de la
 * página el chino/japonés que faltaba (scripts/i18n-static/*.json) en TODAS sus versiones.
 * Deja hreflang completo en todas las versiones, URLs en el sitemap y el idioma fijado por la URL.
 * Idempotente. Después: node scripts/add-lang-options.js.  Uso: node scripts/build-lang-static.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const ALL = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'];
const HL = l => l === 'zh' ? 'zh-Hans' : l;
const LOCALE = { en: 'en_US', es: 'es_ES', fr: 'fr_FR', de: 'de_DE', it: 'it_IT', pt: 'pt_PT', ja: 'ja_JP', zh: 'zh_CN' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => esc(s).replace(/"/g, '&quot;');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// objeto JS que empieza en el primer "{" después de `marker`
function objAt(src, marker) {
  const a = src.indexOf(marker);
  if (a < 0) return null;
  const i = src.indexOf('{', a);
  let d = 0, j = i, q = null;
  for (; j < src.length; j++) {
    const c = src[j];
    if (q) { if (c === '\\') { j++; continue; } if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; continue; }
    if (c === '{') d++;
    if (c === '}') { d--; if (!d) break; }
  }
  return { start: i, end: j + 1, obj: vm.runInNewContext('(' + src.slice(i, j + 1) + ')') };
}
const MAIN_T = objAt(read('assets/js/main.js'), 'const TRANSLATIONS = {').obj;
const EXTRA_AI = require('./i18n-static/ai-planner-zh-ja.json');
const EXTRA_EA = require('./i18n-static/explore-about-zh.json');

const PAGES = [
  { id: 'hoy', path: l => l === 'en' ? 'hoy/index.html' : `${l}/hoy/index.html`, url: l => l === 'en' ? '/hoy/' : `/${l}/hoy/`, langs: ['de', 'pt', 'zh'], dict: () => MAIN_T,
    meta: {
      de: ['Heute fahren wir nach…? — Zugziel-Roulette für Europa | WoW Train · glosx.app', 'Dreh ein echtes europäisches Städtepaar. WoW Train erstellt die Bahnroute und schickt dich für Fahrzeiten und Tickets zu Omio. Kostenlos, ohne Konto.'],
      pt: ['Hoje vamos para…? — roleta de destinos de comboio na Europa | WoW Train · glosx.app', 'Rode um par real de cidades europeias. A WoW Train monta o itinerário de comboio e leva-o à Omio para horários e bilhetes. Grátis, sem conta.'],
      zh: ['今天去哪儿？— 欧洲火车目的地转盘 | WoW Train · glosx.app', '随机转出一对真实的欧洲城市。WoW Train 帮你排好火车行程，再带你去 Omio 查看时刻和车票。免费，无需注册。'] } },
  { id: 'ai-planner', path: l => l === 'en' ? 'ai-planner/index.html' : `${l}/ai-planner/index.html`, url: l => l === 'en' ? '/ai-planner/' : `/${l}/ai-planner/`, langs: ['de', 'pt', 'zh', 'ja'],
    inline: 'var TRANSLATIONS_AI = ', extra: EXTRA_AI, h1Id: 'aiHeroH1', h1Key: 'ai_h1',
    meta: {
      de: ['KI-Reiseplaner für Europa — Zugreisen in Sekunden planen | WoW Train · glosx.app', 'Der KI-Reiseplaner für Züge in Europa. Beschreibe deine Reise in eigenen Worten und erhalte eine komplette Route mit Fahrplänen, Betreibern und Buchungslinks zu Omio.'],
      pt: ['Planeador de viagens com IA para a Europa — planeie viagens de comboio num instante | WoW Train · glosx.app', 'O planeador de viagens com IA para comboios europeus. Descreva a sua viagem por palavras suas e receba uma rota completa com horários, operadores e links de reserva na Omio.'],
      zh: ['欧洲 AI 旅行规划器 — 几秒钟规划火车旅行 | WoW Train · glosx.app', '专为欧洲火车打造的 AI 旅行规划器。用平常的话描述你的行程，就能得到包含时刻、运营商和 Omio 订票链接的完整线路。'],
      ja: ['ヨーロッパのAI旅行プランナー — 鉄道旅行をすぐに計画 | WoW Train · glosx.app', 'ヨーロッパの鉄道のためのAI旅行プランナー。旅の希望をふだんの言葉で書くだけで、時刻、運行会社、Omioの予約リンクつきのルートが完成します。'] } },
  { id: 'explore', path: l => l === 'en' ? 'explore/index.html' : `${l}/explore/index.html`, url: l => l === 'en' ? '/explore/' : `/${l}/explore/`, langs: ['de', 'pt', 'zh'],
    inline: 'var T = ', extra: { zh: EXTRA_EA.explore },
    meta: {
      de: ['Gratis-Guide: Die besten Zugstrecken in Europa, Japan und China | WoW Train · glosx.app', 'Der kostenlose Guide zu den besten Zugstrecken in Europa, Japan und China — Frankreich, Spanien, Italien, Schweiz, Österreich und mehr. Preise, Bahnhöfe, Landschaft und wann du buchen solltest.'],
      pt: ['Guia grátis: as melhores rotas de comboio na Europa, Japão e China | WoW Train · glosx.app', 'O guia grátis das melhores rotas de comboio na Europa, Japão e China — França, Espanha, Itália, Suíça, Áustria e mais. Preços, estações, paisagens e quando reservar.'],
      zh: ['免费指南：欧洲、日本和中国最佳火车线路 | WoW Train · glosx.app', '欧洲、日本和中国最佳火车线路免费指南：法国、西班牙、意大利、瑞士、奥地利等。价格、车站、沿途风景和最佳订票时间。'] } },
  { id: 'about', path: l => l === 'en' ? 'about.html' : `${l}/about.html`, url: l => l === 'en' ? '/about.html' : `/${l}/about.html`, langs: ['de', 'pt', 'zh'],
    inline: 'const T = ', extra: { zh: EXTRA_EA.about }, metaFromDict: true }
];

// suma al diccionario propio de la página los idiomas que faltan (en todas sus versiones)
function addToInline(h, p) {
  if (!p.inline) return h;
  const o = objAt(h, p.inline);
  if (!o) return h;
  let add = '';
  for (const [l, d] of Object.entries(p.extra || {})) if (!o.obj[l]) add += `\n      ${l}: ${JSON.stringify(d)},`;
  return add ? h.slice(0, o.start + 1) + add + h.slice(o.start + 1) : h;
}
function dictFor(p, l, h) { return p.inline ? (objAt(h, p.inline).obj[l] || {}) : (p.dict()[l] || {}); }

function translate(h, d, p) {
  // texto plano
  h = h.replace(/(<([a-zA-Z0-9]+)([^>]*)\bdata-i18n="([a-zA-Z0-9_]+)"([^>]*)>)([^<]*)(<\/\2>)/g, (m, open, tag, a, key, b, old, close) =>
    d[key] === undefined || !old.trim() || /</.test(d[key]) ? m : open + esc(d[key]) + close);
  // valores con HTML (párrafos con enlaces, <br>, <em>): reemplaza el contenido del elemento
  for (const [key, val] of Object.entries(d)) {
    if (!/</.test(val)) continue;
    const re = new RegExp(`(<([a-zA-Z0-9]+)[^>]*\\bdata-i18n="${key}"[^>]*>)([\\s\\S]*?)(</\\2>)`);
    h = h.replace(re, (m, open, tag, old, close) => open + val + close);
  }
  h = h.replace(/(<meta[^>]*\bdata-i18n="([a-zA-Z0-9_]+)"[^>]*\bcontent=")[^"]*(")/g, (m, a, key, b) => d[key] === undefined ? m : a + attr(d[key]) + b);
  h = h.replace(/(<[a-zA-Z0-9]+[^>]*\bdata-i18n-placeholder="([a-zA-Z0-9_]+)"[^>]*\bplaceholder=")[^"]*(")/g, (m, a, key, b) => d[key] === undefined ? m : a + attr(d[key]) + b);
  if (p.h1Id && d[p.h1Key]) h = h.replace(new RegExp(`(<h1 id="${p.h1Id}"[^>]*>)[\\s\\S]*?(</h1>)`), `$1${d[p.h1Key]}$2`);
  return h;
}
const exists = f => fs.existsSync(path.join(ROOT, f));
function localizeLinks(h, l) {
  h = h.replace(/href="\/"/g, `href="/${l}/"`);
  h = h.replace(/href="\/rutas\/"/g, `href="/${l}/rutas/"`);
  h = h.replace(/href="\/rutas\/([a-z0-9-]+)\/"/g, (m, s) => exists(`rutas/${s}/${l}/index.html`) ? `href="/rutas/${s}/${l}/"` : m);
  for (const q of PAGES) h = h.split(`href="${q.url('en')}"`).join(exists(q.path(l)) || q.langs.includes(l) ? `href="${q.url(l)}"` : `href="${q.url('en')}"`);
  return h;
}
function setHead(h, p, l, d) {
  const m = p.metaFromDict ? [d.page_title, d.page_desc] : p.meta[l];
  const U = 'https://glosx.app' + p.url(l);
  h = h.replace(/<html lang="[^"]*"/, `<html lang="${HL(l)}"`);
  h = h.replace(/(<title[^>]*>)[^<]*(<\/title>)/, `$1${esc(m[0])}$2`);
  h = h.replace(/(<meta name="description"[^>]*content=")[^"]*(")/, `$1${attr(m[1])}$2`);
  h = h.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${attr(m[0])}$2`).replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${attr(m[1])}$2`);
  h = h.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${attr(m[0])}$2`).replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${attr(m[1])}$2`);
  h = h.replace(/(<meta property="og:locale" content=")[^"]*(")/, `$1${LOCALE[l]}$2`);
  h = h.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${U}$2`);
  h = h.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${U}$2`);
  h = h.replace(/<script>try\{localStorage\.setItem\('glosx_lang','[a-z]+'\);localStorage\.setItem\('glosx_lang_manual','1'\);\}catch\(e\)\{\}<\/script>\n?/g, '');
  h = h.replace('</head>', `<script>try{localStorage.setItem('glosx_lang','${l}');localStorage.setItem('glosx_lang_manual','1');}catch(e){}</script>\n</head>`);
  return h;
}
function setHreflang(h, p) {
  const have = ALL.filter(l => exists(p.path(l)));
  const block = have.map(l => `<link rel="alternate" hreflang="${HL(l)}" href="https://glosx.app${p.url(l)}" />`).concat(`<link rel="alternate" hreflang="x-default" href="https://glosx.app${p.url('en')}" />`);
  const urls = ALL.map(l => 'https://glosx.app' + p.url(l)).map(u => u.replace(/[.?]/g, '\\$&')).join('|');
  const re = new RegExp(`[ \\t]*<link rel="alternate" hreflang="[^"]+" href="(?:${urls})" ?/>\\n`, 'g');
  const first = h.search(re);
  if (first < 0) return h.replace(/(<link rel="canonical"[^>]*>\n)/, `$1${block.map(x => '  ' + x + '\n').join('')}`);
  const indent = (h.slice(first).match(/^[ \t]*/) || [''])[0];
  return h.slice(0, first) + block.map(x => indent + x + '\n').join('') + h.slice(first).replace(re, '');
}

const made = [];
for (const p of PAGES) {
  // 1) el diccionario de la página con los idiomas que faltaban, en las versiones que ya existen
  for (const l of ALL) if (exists(p.path(l))) { const f = path.join(ROOT, p.path(l)), h = fs.readFileSync(f, 'utf8'), h2 = addToInline(h, p); if (h2 !== h) fs.writeFileSync(f, h2); }
  // 2) versiones nuevas desde la inglesa en vivo
  const en = read(p.path('en'));
  for (const l of p.langs) {
    let h = en;
    const d = dictFor(p, l, h);
    if (!Object.keys(d).length) throw new Error(`Sin diccionario ${l} para ${p.id}`);
    h = translate(h, d, p);
    h = setHead(h, p, l, d);
    h = localizeLinks(h, l);
    fs.mkdirSync(path.dirname(path.join(ROOT, p.path(l))), { recursive: true });
    fs.writeFileSync(path.join(ROOT, p.path(l)), h);
    made.push('https://glosx.app' + p.url(l));
  }
  // 3) hreflang completo en todas las versiones
  for (const l of ALL) if (exists(p.path(l))) { const f = path.join(ROOT, p.path(l)); fs.writeFileSync(f, setHreflang(fs.readFileSync(f, 'utf8'), p)); }
}

// 4) sitemap
const sm = path.join(ROOT, 'sitemap.xml');
let x = fs.readFileSync(sm, 'utf8');
const today = new Date().toISOString().slice(0, 10);
for (const p of PAGES) {
  const have = ALL.filter(l => exists(p.path(l)));
  const locs = new Set(have.map(l => 'https://glosx.app' + p.url(l)));
  const keep = {};
  x = x.replace(/  <url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>\n/g, (b, loc) => { if (!locs.has(loc)) return b; keep[loc] = (b.match(/<priority>([^<]+)</) || [])[1]; return ''; });
  const alts = have.map(l => `    <xhtml:link rel="alternate" hreflang="${HL(l)}" href="https://glosx.app${p.url(l)}" />`).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="https://glosx.app${p.url('en')}" />`;
  let add = '';
  for (const l of have) { const u = 'https://glosx.app' + p.url(l); add += `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${keep[u] || (l === 'en' ? '0.8' : '0.7')}</priority>\n${alts}\n  </url>\n`; }
  x = x.replace('</urlset>', add + '</urlset>');
}
fs.writeFileSync(sm, x);
fs.writeFileSync(path.join(__dirname, 'static-i18n-urls.txt'), made.join('\n') + '\n');
console.log('Páginas fijas nuevas:', made.length);
