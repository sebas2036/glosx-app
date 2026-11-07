#!/usr/bin/env node
/**
 * Aplica scripts/japan-city-photos.json a las páginas ya publicadas de las rutas automáticas de Japón:
 * cambia la foto genérica (por tipo de ciudad) por la foto verificada de la ciudad de destino, en los 5 idiomas.
 * Solo toca el id de la foto de portada (.route-hero y og/twitter image); el resto de la página queda igual.
 * Uso: node scripts/japan-apply-city-photos.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = require('./japan-city-photos.json');
const auto = require('./routes-japan-auto');
let pages = 0, routes = 0;
for (const r of auto) {
  const want = CITY[r.toKey];
  if (!want) continue;
  let touched = false;
  for (const l of ['', 'es', 'fr', 'it', 'ja']) {
    const f = path.join(ROOT, 'rutas', r.slug, l, 'index.html');
    if (!fs.existsSync(f)) continue;
    const s = fs.readFileSync(f, 'utf8');
    const m = s.match(/\.route-hero \{[^}]*pexels\.com\/photos\/(\d+)\//);
    if (!m || m[1] === String(want)) continue;
    const out = s.split(`photos/${m[1]}/pexels-photo-${m[1]}`).join(`photos/${want}/pexels-photo-${want}`);
    fs.writeFileSync(f, out); pages++; touched = true;
  }
  if (touched) routes++;
}
console.log(`${routes} rutas, ${pages} páginas con foto de ciudad aplicada`);
