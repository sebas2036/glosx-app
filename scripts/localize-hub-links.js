#!/usr/bin/env node
/**
 * En todas las páginas de un idioma (/<l>/... y rutas/<slug>/<l>/), cambia los enlaces a las páginas
 * "Trenes desde..." en inglés (/trains-from-x/) por su versión en ese idioma, si existe. Idempotente.
 * Uso: node scripts/localize-hub-links.js
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const LANGS = ['es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'];
const hubs = fs.readdirSync(ROOT).filter(d => d.startsWith('trains-from-'));
function walk(dir, out) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.html')) out.push(p); } return out; }
let n = 0;
for (const l of LANGS) {
  const ok = hubs.filter(h => fs.existsSync(path.join(ROOT, l, h, 'index.html')));
  if (!ok.length) continue;
  const files = walk(path.join(ROOT, l), []);
  for (const d of fs.readdirSync(path.join(ROOT, 'rutas'))) { const f = path.join(ROOT, 'rutas', d, l, 'index.html'); if (fs.existsSync(f)) files.push(f); }
  const re = new RegExp(`href="/(${ok.join('|')})/"`, 'g');
  for (const f of files) {
    const s = fs.readFileSync(f, 'utf8');
    if (!re.test(s)) continue; re.lastIndex = 0;
    // no tocar el selector de idioma (enlace a la versión inglesa)
    const t = s.replace(/(<a\b[^>]*?)href="\/(trains-from-[a-z-]+)\/"([^>]*>)/g, (m, a, h, b) => (/lang-option|hreflang=/.test(a + b) || !ok.includes(h)) ? m : `${a}href="/${l}/${h}/"${b}`);
    if (t !== s) { fs.writeFileSync(f, t); n++; }
  }
}
console.log('páginas actualizadas:', n);
