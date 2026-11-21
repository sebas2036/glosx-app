#!/usr/bin/env node
/* Añade la línea "Destacado en los showcases de opentransportdata.swiss" (la de cada portada, en su idioma) al pie de los
 * índices de rutas, "Sobre nosotros" y el índice del blog. Idempotente. Uso: node scripts/add-showcase-link.js [--dry] */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), DRY = process.argv.includes('--dry');
const LANGS = ['', 'es', 'fr', 'it', 'de', 'pt', 'ja', 'zh'];
let n = 0;
for (const l of LANGS) {
  const home = fs.readFileSync(path.join(ROOT, l, 'index.html'), 'utf8');
  const m = home.match(/<p class="trust-showcase"[^>]*>[\s\S]*?<\/p>/);
  if (!m) { console.log('sin línea en la portada', l || 'en'); continue; }
  const line = '    ' + m[0].replace(/margin-top:8px;/, 'margin:14px 0 0;') + '\n';
  for (const f of ['rutas/index.html', 'about.html', 'blog.html']) {
    const rel = path.join(l, f), p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) { console.log('no existe', rel); continue; }
    let s = fs.readFileSync(p, 'utf8');
    if (s.includes('showcase/wow-train')) continue;
    if (!/<footer[^>]*>\s*\n/.test(s)) { console.log('sin <footer>', rel); continue; }
    s = s.replace(/(<footer[^>]*>\s*\n)([\s\S]*?)(<\/footer>)/, (a, o, mid, c) => o + mid.replace(/\s*$/, '\n') + line + '  ' + c);
    if (!DRY) fs.writeFileSync(p, s);
    n++; console.log('ok', rel);
  }
}
console.log('Listo:', n);
