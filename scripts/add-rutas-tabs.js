#!/usr/bin/env node
/* Agrega el script de pestañas (Europa / Japón / China) a los índices /rutas/ de los 8 idiomas. Idempotente.
 * Uso: node scripts/add-rutas-tabs.js   (correrlo después de regenerar los índices con generate-rutas-hub.js, build-lang-hub.js o build-zh-hub.js) */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const FILES = ['rutas', 'es/rutas', 'fr/rutas', 'it/rutas', 'de/rutas', 'pt/rutas', 'ja/rutas', 'zh/rutas'].map(d => path.join(d, 'index.html'));
const TAG = '  <script src="/assets/js/rutas-tabs.js?v=3" defer></script>\n';
let n = 0;
for (const f of FILES) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { console.log('falta', f); continue; }
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('rutas-tabs.js')) { console.log('ya tiene', f); continue; }
  const anchor = /([ \t]*<script src="\/assets\/js\/rutas-search\.js[^"]*" defer><\/script>\n)/;
  const alt = /([ \t]*<script src="\/assets\/js\/lang-chip\.js[^"]*" defer><\/script>)/;
  if (anchor.test(s)) s = s.replace(anchor, TAG + '$1');
  else if (alt.test(s)) s = s.replace(alt, TAG + '$1');
  else { console.log('sin ancla', f); continue; }
  fs.writeFileSync(p, s); n++; console.log('ok', f);
}
console.log('Listo:', n, 'archivos');
