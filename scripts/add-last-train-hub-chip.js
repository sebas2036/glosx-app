#!/usr/bin/env node
/**
 * Enlaza la página "último tren de Europa" desde el índice de rutas de cada idioma (grupo "puntos de partida populares").
 * Sin este enlace, las 8 versiones de esa página no tenían ningún enlace entrante (páginas huérfanas).
 * Idempotente. Correr después de regenerar los índices de rutas (build-lang-hub.js, build-zh-hub.js, etc.).
 * Uso: node scripts/add-last-train-hub-chip.js
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const T = {
  en: ['rutas/index.html', '/last-train-europe/', 'Last trains in Europe'],
  es: ['es/rutas/index.html', '/es/ultimo-tren-europa/', 'Último tren en Europa'],
  fr: ['fr/rutas/index.html', '/fr/last-train-europe/', 'Derniers trains en Europe'],
  de: ['de/rutas/index.html', '/de/last-train-europe/', 'Letzte Züge in Europa'],
  it: ['it/rutas/index.html', '/it/last-train-europe/', 'Ultimi treni in Europa'],
  pt: ['pt/rutas/index.html', '/pt/last-train-europe/', 'Últimos comboios na Europa'],
  ja: ['ja/rutas/index.html', '/ja/last-train-europe/', 'ヨーロッパの終電'],
  zh: ['zh/rutas/index.html', '/zh/last-train-europe/', '欧洲末班车'],
};
let n = 0;
for (const [l, [file, href, label]] of Object.entries(T)) {
  const f = path.join(ROOT, file);
  let s = fs.readFileSync(f, 'utf8');
  if (s.includes(`href="${href}"`)) { console.log(l, 'ya estaba'); continue; }
  const t = s.replace(/(<ul class="hub-chips">[\s\S]*?)(<\/ul>)/, `$1<li><a href="${href}">${label}</a></li>$2`);
  if (t === s) { console.log(l, 'SIN grupo hub-chips'); continue; }
  fs.writeFileSync(f, t); n++; console.log(l, 'enlace agregado');
}
console.log(`${n} índices actualizados`);
