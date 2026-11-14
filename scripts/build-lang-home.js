#!/usr/bin/env node
/**
 * Portadas en alemán y portugués (/de/, /pt/), generadas desde /index.html con las traducciones que ya
 * existen en assets/js/main.js (TRANSLATIONS.de / .pt), igual que generate-home-i18n.js hace con es/fr/it/ja
 * (no regenera esas portadas). Además deja el set completo de 8 hreflang en las 8 portadas y en el sitemap.
 * Idempotente. Volver a correrlo cuando cambie /index.html.  Uso: node scripts/build-lang-home.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const SRC = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const MAIN = fs.readFileSync(path.join(ROOT, 'assets/js/main.js'), 'utf8');

function extractTranslations(src) {
  const i = src.indexOf('{', src.indexOf('const TRANSLATIONS = {'));
  let d = 0, j = i, q = null;
  for (; j < src.length; j++) {
    const c = src[j];
    if (q) { if (c === '\\') { j++; continue; } if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; continue; }
    if (c === '{') d++;
    if (c === '}') { d--; if (d === 0) break; }
  }
  return vm.runInNewContext('(' + src.slice(i, j + 1) + ')');
}
const TR = extractTranslations(MAIN);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => esc(s).replace(/"/g, '&quot;');

const META = {
  de: {
    title: 'WoW Train (glosx.app) — Kostenloser KI-Zugreiseplaner für Europa, Japan und China',
    desc: 'Kostenloser KI-Planer für Zugreisen. Beschreibe deine Reise und erhalte eine komplette Bahnroute durch Europa, Japan und China – mit Umstiegen, Hotels und Buchungslinks.',
    ogTitle: 'WoW Train — KI-Zugreiseplaner', ogDesc: 'Beschreibe deine Reise und erhalte in Sekunden eine Bahnroute durch Europa, Japan und China – Umstiege, Hotels und Tickets.', locale: 'de_DE'
  },
  pt: {
    title: 'WoW Train (glosx.app) — Planeador de viagens de comboio com IA grátis: Europa, Japão e China',
    desc: 'Planeador gratuito de viagens de comboio com IA. Descreva a sua viagem e receba um itinerário completo de comboio pela Europa, Japão e China, com ligações, hotéis e links de reserva.',
    ogTitle: 'WoW Train — Planeador de viagens de comboio com IA', ogDesc: 'Descreva a sua viagem e receba em segundos um itinerário de comboio pela Europa, Japão e China: ligações, hotéis e bilhetes.', locale: 'pt_PT'
  }
};
const ALL = [['en', ''], ['es', 'es/'], ['fr', 'fr/'], ['de', 'de/'], ['it', 'it/'], ['pt', 'pt/'], ['ja', 'ja/'], ['zh-Hans', 'zh/']];
const HREFLANG = ALL.map(([l, p]) => `<link rel="alternate" hreflang="${l}" href="https://glosx.app/${p}" />`).join('\n  ') + '\n  <link rel="alternate" hreflang="x-default" href="https://glosx.app/" />';
const setHreflang = h => h.replace(/(?:\s*<link rel="alternate" hreflang="[^"]+" href="https:\/\/glosx\.app\/(?:[a-z]{2}\/)?" \/>)+/, '\n  ' + HREFLANG);

function translate(html, dict) {
  html = html.replace(/(<([a-zA-Z0-9]+)([^>]*)\bdata-i18n="([a-zA-Z0-9_]+)"([^>]*)>)([^<]*)(<\/\2>)/g, (m, open, tag, a, key, b, old, close) => dict[key] === undefined || !old.trim() ? m : open + esc(dict[key]) + close);
  for (const key of ['cookie_text', 'nav_essentials']) if (dict[key] !== undefined) html = html.replace(new RegExp(`(data-i18n="${key}">)([^<]*)`), (m, p1) => p1 + esc(dict[key]));
  html = html.replace(/(<[a-zA-Z0-9]+[^>]*\bdata-i18n-placeholder="([a-zA-Z0-9_]+)"[^>]*\bplaceholder=")[^"]*(")/g, (m, a, key, b) => dict[key] === undefined ? m : a + attr(dict[key]) + b);
  html = html.replace(/(<[a-zA-Z0-9]+[^>]*\bdata-i18n-aria-label="([a-zA-Z0-9_]+)"[^>]*\baria-label=")[^"]*(")/g, (m, a, key, b) => dict[key] === undefined ? m : a + attr(dict[key]) + b);
  if (dict.stats_prose) html = html.replace(/(<[^>]*id="statsProse"[^>]*>)[\s\S]*?(<\/p>)/, (m, a, b) => a + dict.stats_prose + b);
  return html;
}

function build(lang) {
  const t = TR[lang], m = META[lang];
  let h = translate(SRC, t);
  h = h.replace('<html lang="en">', `<html lang="${lang}">`);
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${esc(m.title)}</title>`);
  h = h.replace(/(<meta name="description" content=")[^"]*(")/, `$1${attr(m.desc)}$2`);
  h = h.replace(/\s*<meta name="keywords" content="[^"]*" \/>/, '');
  h = h.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${attr(m.ogTitle)}$2`).replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${attr(m.ogDesc)}$2`);
  h = h.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${attr(m.ogTitle)}$2`).replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${attr(m.ogDesc)}$2`);
  h = h.replace('<meta property="og:locale" content="en_US" />', `<meta property="og:locale" content="${m.locale}" />`);
  h = h.replace('<meta property="og:url" content="https://glosx.app/" />', `<meta property="og:url" content="https://glosx.app/${lang}/" />`);
  h = h.replace('<link rel="canonical" href="https://glosx.app/" id="canonicalLink" />', `<link rel="canonical" href="https://glosx.app/${lang}/" id="canonicalLink" />`);
  h = setHreflang(h);
  h = h.replace('"url": "https://glosx.app/",', `"url": "https://glosx.app/${lang}/",`).replace('"target": "https://glosx.app/?q={search_term_string}"', `"target": "https://glosx.app/${lang}/?q={search_term_string}"`);
  const faq = [['faq1_q', 'faq1_a'], ['faq2_q', 'faq2_a'], ['faq4_q', 'faq4_a'], ['faq5_q', 'faq5_a']].filter(([q, a]) => t[q] && t[a])
    .map(([q, a]) => `      {\n        "@type": "Question",\n        "name": ${JSON.stringify(t[q])},\n        "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(t[a])} }\n      }`).join(',\n');
  h = h.replace(/<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/, `<script type="application/ld+json">\n  {\n    "@context": "https://schema.org",\n    "@type": "FAQPage",\n    "mainEntity": [\n${faq}\n    ]\n  }\n  </script>`);
  h = h.replace('</head>', `<script>try{localStorage.setItem('glosx_lang','${lang}');localStorage.setItem('glosx_lang_manual','1');}catch(e){}</script>\n</head>`);
  // enlaces internos a su versión en este idioma solo si existe
  const has = rel => fs.existsSync(path.join(ROOT, rel));
  h = h.replace(/href="\/rutas\/([a-z0-9-]+)\/"/g, (x, slug) => has(`rutas/${slug}/${lang}/index.html`) ? `href="/rutas/${slug}/${lang}/"` : x);
  if (has(`${lang}/rutas/index.html`)) h = h.split('href="/rutas/"').join(`href="/${lang}/rutas/"`);
  return h;
}

for (const lang of ['de', 'pt']) {
  fs.mkdirSync(path.join(ROOT, lang), { recursive: true });
  fs.writeFileSync(path.join(ROOT, lang, 'index.html'), build(lang));
}
// set completo de hreflang en las otras portadas
for (const f of ['index.html', 'es/index.html', 'fr/index.html', 'it/index.html', 'ja/index.html', 'zh/index.html']) {
  const p = path.join(ROOT, f);
  fs.writeFileSync(p, setHreflang(fs.readFileSync(p, 'utf8')));
}
// sitemap: /de/ y /pt/ + hreflang completos en los bloques de portada
const sm = path.join(ROOT, 'sitemap.xml');
let x = fs.readFileSync(sm, 'utf8');
const ALTS = ALL.map(([l, p]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="https://glosx.app/${p}" />`).join('\n') + '\n    <xhtml:link rel="alternate" hreflang="x-default" href="https://glosx.app/" />';
for (const lang of ['de', 'pt']) if (!x.includes(`<loc>https://glosx.app/${lang}/</loc>`)) x = x.replace('</urlset>', `  <url>\n    <loc>https://glosx.app/${lang}/</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n${ALTS}\n  </url>\n</urlset>`);
x = x.replace(/<url>\s*<loc>https:\/\/glosx\.app\/(?:[a-z]{2}\/)?<\/loc>[\s\S]*?<\/url>/g, b => b.replace(/(\s*<xhtml:link rel="alternate" hreflang="[^"]+" href="https:\/\/glosx\.app\/(?:[a-z]{2}\/)?" ?\/>)+/, '\n' + ALTS));
fs.writeFileSync(sm, x);
console.log('Portadas /de/ y /pt/ listas · hreflang de 8 idiomas en las 8 portadas y el sitemap');
