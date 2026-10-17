#!/usr/bin/env node
/**
 * Añade el tipo schema.org TrainTrip al JSON-LD de cada página de ruta (Europa y Japón, 5 idiomas), sin regenerar el sitio.
 * Solo datos que existen: ciudades de origen y destino (en el idioma de la página), operador (rutas de Europa) y la URL canónica.
 * No se inventan estaciones, horarios ni precios. Idempotente (no duplica si ya hay un TrainTrip).
 * Uso: node scripts/inject-traintrip.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LANGS = ['en', 'es', 'fr', 'it', 'ja'];
const jsrc = fs.readFileSync(path.join(ROOT, 'assets/js/japan.js'), 'utf8');
const NAMES = JSON.parse(jsrc.match(/var HOTEL_NAMES = (\{.*?\});\n  function hname/s)[1]);
const nmEU = (lang, c) => (NAMES[lang] && NAMES[lang][c]) || c;
// Europa
const g = fs.readFileSync(path.join(__dirname, 'generate-routes.js'), 'utf8');
const EU = [];
for (const m of g.matchAll(/slug: '([a-z-]+)', from: '([^']+)', to: '([^']+)', country: '[^']+', duration: '([^']+)', operator: '([^']+)'/g)) EU.push({ slug: m[1], from: m[2], to: m[3], operator: m[5] });
// Japón
const jhand = fs.readFileSync(path.join(__dirname, 'generate-routes-japan.js'), 'utf8');
const hand = eval('[' + jhand.match(/const ROUTES = \[([\s\S]*?)\n\];\n/)[1] + '\n]');
const JP = hand.concat(require('./routes-japan-lote2'), require('./routes-japan-auto'));
const CITY_JA = require('./japan-ja-data.js').CITY;
const AIRPORT_JA = { narita: '成田空港', naritaairport: '成田空港', kansaiairport: '関西空港', newchitoseairport: '新千歳空港' };
const nmJP = (lang, x, key) => lang === 'ja' ? (CITY_JA[key] || AIRPORT_JA[key] || x.en) : (x[lang] || x.en);

const station = (name) => ({ '@type': 'TrainStation', name, address: { '@type': 'PostalAddress', addressLocality: name } });
const stat = { done: 0, had: 0, missing: 0 };
function apply(file, from, to, operator) {
  if (!fs.existsSync(file)) { stat.missing++; return; }
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;
  html = html.replace(/<script type="application\/ld\+json">(.*?)<\/script>/s, (all, body) => {
    try {
      const d = JSON.parse(body);
      if (!d['@graph']) return all;
      if (d['@graph'].some((n) => n['@type'] === 'TrainTrip')) { stat.had++; return all; }
      const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
      const node = { '@type': 'TrainTrip', name: `${from} → ${to}`, departureStation: station(from), arrivalStation: station(to) };
      if (operator) node.provider = { '@type': 'Organization', name: operator };
      if (canon) node.url = canon;
      d['@graph'].push(node);
      changed = true;
      return '<script type="application/ld+json">' + JSON.stringify(d) + '</script>';
    } catch (e) { return all; }
  });
  if (changed) { fs.writeFileSync(file, html); stat.done++; }
}
for (const lang of LANGS) {
  const pre = lang === 'en' ? '' : lang;
  for (const r of EU) apply(path.join(ROOT, 'rutas', r.slug, pre, 'index.html'), nmEU(lang, r.from), nmEU(lang, r.to), r.operator);
  for (const r of JP) apply(path.join(ROOT, 'rutas', r.slug, pre, 'index.html'), nmJP(lang, r.from, r.fromKey), nmJP(lang, r.to, r.toKey), null);
}
console.log(JSON.stringify(stat));
