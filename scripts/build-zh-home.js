#!/usr/bin/env node
/**
 * Portada en chino simplificado (/zh/index.html), generada desde /index.html (inglés):
 * metas, canonical, schema y todos los textos data-i18n ya escritos en chino en el HTML (para Google),
 * más hreflang zh-Hans y la opción 中文 del selector en las 6 portadas. Idempotente.
 * Volver a correrlo cada vez que cambie /index.html.  Uso: node scripts/build-zh-home.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ZH = require('./zh-home-strings.json');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => esc(s).replace(/"/g, '&quot;');
function rep(s, a, b) { if (!s.includes(a)) throw new Error('No está: ' + a.slice(0, 80)); return s.split(a).join(b); }

const META = {
  title: 'WoW Train (glosx.app) — 免费 AI 火车行程规划：欧洲、日本、中国',
  desc: '免费的 AI 火车行程规划工具。说出你的旅行，就能得到欧洲、日本和中国的完整火车行程，含换乘、酒店和订票链接。',
  ogTitle: 'WoW Train — AI 火车行程规划',
  ogDesc: '说出你的旅行，AI 几秒钟就能排好欧洲、日本和中国的火车行程：换乘、酒店和车票。'
};
const FAQ = [['faq1_q', 'faq1_a'], ['faq2_q', 'faq2_a'], ['faq4_q', 'faq4_a'], ['faq5_q', 'faq5_a']];

let s = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
s = rep(s, '<html lang="en">', '<html lang="zh-Hans">');
s = s.replace(/<title>[^<]*<\/title>/, `<title>${esc(META.title)}</title>`);
s = s.replace(/(<meta name="description" content=")[^"]*(")/, `$1${attr(META.desc)}$2`);
s = rep(s, '<meta property="og:locale" content="en_US" />', '<meta property="og:locale" content="zh_CN" />');
s = s.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${attr(META.ogTitle)}$2`);
s = s.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${attr(META.ogDesc)}$2`);
s = s.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${attr(META.ogTitle)}$2`);
s = s.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${attr(META.ogDesc)}$2`);
s = rep(s, '<meta property="og:url" content="https://glosx.app/" />', '<meta property="og:url" content="https://glosx.app/zh/" />');
s = rep(s, '<link rel="canonical" href="https://glosx.app/" id="canonicalLink" />', '<link rel="canonical" href="https://glosx.app/zh/" id="canonicalLink" />');
s = rep(s, '"url": "https://glosx.app/",', '"url": "https://glosx.app/zh/",');
s = rep(s, '"target": "https://glosx.app/?q={search_term_string}"', '"target": "https://glosx.app/zh/?q={search_term_string}"');
// preguntas frecuentes del schema
const faqStart = s.indexOf('"@type": "FAQPage"');
const faqEnd = s.indexOf('</script>', faqStart);
const faqJson = '"@type": "FAQPage",\n    "mainEntity": [\n' + FAQ.map(([q, a]) =>
  `      {\n        "@type": "Question",\n        "name": ${JSON.stringify(ZH[q])},\n        "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(ZH[a])} }\n      }`).join(',\n') + '\n    ]\n  }\n  ';
s = s.slice(0, faqStart) + faqJson + s.slice(faqEnd);
// idioma fijado en esta URL
s = rep(s, '</head>', "<script>try{localStorage.setItem('glosx_lang','zh');localStorage.setItem('glosx_lang_manual','1');}catch(e){}</script>\n</head>");
// textos data-i18n simples (sin etiquetas adentro)
let n = 0;
s = s.replace(/(data-i18n="([a-z0-9_]+)"[^>]*>)([^<]*)(<)/g, (m, open, key, txt, lt) => {
  if (ZH[key] === undefined || !txt.trim()) return m;
  n++; return open + esc(ZH[key]) + lt;
});
s = s.replace(/(data-i18n-placeholder="([a-z0-9_]+)"[^>]*?placeholder=")[^"]*(")/g, (m, a, key, b) => ZH[key] ? a + attr(ZH[key]) + b : m);
s = s.replace(/(<[^>]*id="statsProse"[^>]*>)[\s\S]*?(<\/p>)/, (m, a, b) => a + ZH.stats_prose + b);
fs.mkdirSync(path.join(ROOT, 'zh'), { recursive: true });

// hreflang zh-Hans + opción 中文 en las 6 portadas
const HOMES = ['index.html', 'es/index.html', 'fr/index.html', 'it/index.html', 'ja/index.html'];
const addZh = h => {
  if (!h.includes('hreflang="zh-Hans"')) h = rep(h, '  <link rel="alternate" hreflang="ja" href="https://glosx.app/ja/" />\n', '  <link rel="alternate" hreflang="ja" href="https://glosx.app/ja/" />\n  <link rel="alternate" hreflang="zh-Hans" href="https://glosx.app/zh/" />\n');
  if (!h.includes(`data-lang="zh"`)) h = h.replace(/(\s*)(<div class="lang-option" data-lang="ja" onclick="setLang\('ja'\)"><span>日本語<\/span><\/div>)/, `$1$2$1<div class="lang-option" data-lang="zh" onclick="setLang('zh')"><span>中文</span></div>`);
  return h;
};
s = addZh(s);
fs.writeFileSync(path.join(ROOT, 'zh/index.html'), s);
for (const f of HOMES) { const p = path.join(ROOT, f); fs.writeFileSync(p, addZh(fs.readFileSync(p, 'utf8'))); }

// sitemap: /zh/ y hreflang zh-Hans en los bloques de las portadas
const sm = path.join(ROOT, 'sitemap.xml');
let x = fs.readFileSync(sm, 'utf8');
const ZH_ALT = '<xhtml:link rel="alternate" hreflang="zh-Hans" href="https://glosx.app/zh/" />';
x = x.replace(/<url>[\s\S]*?<\/url>/g, b => {
  if (!/<loc>https:\/\/glosx\.app\/(?:es\/|fr\/|it\/|ja\/)?<\/loc>/.test(b) || b.includes('hreflang="zh-Hans"')) return b;
  return b.replace(/(\s*)(<xhtml:link rel="alternate" hreflang="x-default")/, `$1${ZH_ALT}$1$2`);
});
if (!x.includes('<loc>https://glosx.app/zh/</loc>')) {
  const alts = [['en', ''], ['es', 'es/'], ['fr', 'fr/'], ['it', 'it/'], ['ja', 'ja/'], ['zh-Hans', 'zh/']].map(([l, p]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="https://glosx.app/${p}" />`).join('\n');
  x = x.replace('</urlset>', `  <url>\n    <loc>https://glosx.app/zh/</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="https://glosx.app/" />\n  </url>\n</urlset>`);
}
fs.writeFileSync(sm, x);
console.log('zh/index.html listo ·', n, 'textos en chino en el HTML');
