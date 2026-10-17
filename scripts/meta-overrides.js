#!/usr/bin/env node
/**
 * Metas (description / og / twitter) de las páginas de ruta que se reescribieron para CTR.
 * Viven en scripts/seo-meta-overrides.json ({ "rutas/<slug>[/<lang>]": "<descripción>" }) y los generadores
 * las aplican al escribir cada página, así regenerar ya no las pisa.
 *   node scripts/meta-overrides.js snapshot   -> reescribe el JSON con las metas actuales del HTML
 *   (los generadores llaman a apply(relPath, html))
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FILE = path.join(__dirname, 'seo-meta-overrides.json');
let cache = null;
function load() { if (!cache) cache = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : {}; return cache; }
const esc = (s) => s.replace(/\$/g, '$$$$');

function apply(relPath, html) {
  const d = load()[relPath];
  if (!d) return html;
  for (const re of [/(<meta name="description" content=")[^"]*(")/, /(<meta property="og:description" content=")[^"]*(")/, /(<meta name="twitter:description" content=")[^"]*(")/]) {
    html = html.replace(re, (m, a, b) => a + d + b);
  }
  return html;
}

function snapshot() {
  const out = {};
  const rutas = path.join(ROOT, 'rutas');
  for (const slug of fs.readdirSync(rutas)) {
    for (const lang of ['', 'es', 'fr', 'it', 'ja']) {
      const f = path.join(rutas, slug, lang, 'index.html');
      if (!fs.existsSync(f)) continue;
      const h = fs.readFileSync(f, 'utf8');
      if (/noindex|http-equiv="refresh"/i.test(h)) continue;
      const m = h.match(/<meta name="description" content="([^"]*)"/);
      if (m) out['rutas/' + slug + (lang ? '/' + lang : '')] = m[1];
    }
  }
  fs.writeFileSync(FILE, JSON.stringify(out, null, 0));
  return Object.keys(out).length;
}
module.exports = { apply, snapshot };
if (require.main === module && process.argv[2] === 'snapshot') console.log('Metas guardadas:', snapshot());
