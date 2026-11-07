#!/usr/bin/env node
/**
 * Enlazado interno de las rutas de Japón ("Más rutas de tren en Japón" / 日本のほかの鉄道ルート).
 *
 * Antes cada ruta enlazaba las 6 primeras de la lista que compartían ciudad, así que las rutas grandes
 * (Tokio–Kioto: 74 enlaces) se llevaban todo y 55 rutas no recibían ningún enlace.
 * Ahora: 8 enlaces por ruta, elegidos entre las que comparten ciudad (o están a una ciudad de distancia),
 * dando prioridad a las que menos enlaces reciben, y una segunda pasada que asegura un mínimo de entrada.
 *
 * Escribe scripts/japan-related.json (lo usa generate-routes-japan.js al regenerar) y reescribe el bloque
 * .related-grid de las páginas ya publicadas en los 5 idiomas, sin tocar nada más de la página.
 * Uso: node scripts/japan-related-links.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PER_PAGE = 8;      // enlaces por página
const MIN_IN = 5;        // enlaces entrantes mínimos por ruta
const MAX_PAGE = 10;     // tope de enlaces en una página al completar mínimos
const SUFFIX = { en: '/', es: '/es/', fr: '/fr/', it: '/it/', ja: '/ja/' };

// Los datos de rutas viven dentro del generador: se evalúa solo la parte que arma ROUTES
function loadRoutes() {
  const src = fs.readFileSync(path.join(__dirname, 'generate-routes-japan.js'), 'utf8');
  const cut = src.indexOf('const missingJa');
  if (cut < 0) throw new Error('No encontré "const missingJa" en generate-routes-japan.js');
  const body = src.slice(0, cut).replace(/^#!.*\n/, '') + '\nreturn ROUTES;';
  const req = p => require(p.startsWith('.') ? path.join(__dirname, p) : p);
  return new Function('require', '__dirname', body)(req, __dirname);
}

function plan(routes) {
  // estaciones que son la misma ciudad a efectos de vecindad (si no, Asakusa–Nikko queda aislada)
  const ALIAS = { asakusa: 'tokyo', shinagawa: 'tokyo', shinjuku: 'tokyo', tennoji: 'osaka' };
  const keys = r => [r.fromKey, r.toKey].map(k => ALIAS[k] || k);
  const byCity = new Map();
  routes.forEach(r => keys(r).forEach(k => { if (!byCity.has(k)) byCity.set(k, []); byCity.get(k).push(r); }));
  const near1 = r => new Set(keys(r).flatMap(k => byCity.get(k)).filter(x => x !== r));
  const near2 = r => {
    const s1 = near1(r), out = new Set();
    s1.forEach(x => near1(x).forEach(y => { if (y !== r && !s1.has(y)) out.add(y); }));
    return out;
  };
  const inbound = new Map(routes.map(r => [r.slug, 0]));
  const links = new Map(routes.map(r => [r.slug, []]));
  const add = (r, x) => { links.get(r.slug).push(x.slug); inbound.set(x.slug, inbound.get(x.slug) + 1); };

  // 1) rutas con menos vecinos primero, así no se quedan sin opciones
  const order = routes.slice().sort((a, b) => near1(a).size - near1(b).size || a.slug.localeCompare(b.slug));
  for (const r of order) {
    const pick = pool => [...pool].filter(x => !links.get(r.slug).includes(x.slug))
      .sort((a, b) => inbound.get(a.slug) - inbound.get(b.slug) || a.slug.localeCompare(b.slug));
    for (const x of pick(near1(r))) { if (links.get(r.slug).length >= PER_PAGE) break; add(r, x); }
    for (const x of pick(near2(r))) { if (links.get(r.slug).length >= PER_PAGE) break; add(r, x); }
  }
  // 2) mínimo de entrada: las que reciben poco se suman a páginas vecinas que tengan lugar
  for (const t of routes) {
    for (const pool of [near1(t), near2(t)]) {
      const hosts = [...pool].filter(h => !links.get(h.slug).includes(t.slug) && links.get(h.slug).length < MAX_PAGE)
        .sort((a, b) => links.get(a.slug).length - links.get(b.slug).length || a.slug.localeCompare(b.slug));
      for (const h of hosts) { if (inbound.get(t.slug) >= MIN_IN) break; add(h, t); }
    }
  }
  return { links, inbound };
}

const routes = loadRoutes();
const bySlug = new Map(routes.map(r => [r.slug, r]));
const { links, inbound } = plan(routes);

const out = {};
links.forEach((v, k) => { out[k] = v; });
fs.writeFileSync(path.join(__dirname, 'japan-related.json'), JSON.stringify(out, null, 1) + '\n');

let pages = 0, missing = 0;
const GRID = /(<div class="related-grid">)[\s\S]*?(\n\s*<\/div>)/;
for (const [slug, targets] of links) {
  for (const lang of Object.keys(SUFFIX)) {
    const file = path.join(ROOT, 'rutas', slug, lang === 'en' ? '' : lang, 'index.html');
    if (!fs.existsSync(file)) { missing++; continue; }
    const html = fs.readFileSync(file, 'utf8');
    if (!GRID.test(html)) { missing++; continue; }
    const items = targets.map(s => bySlug.get(s)).filter(x => x && x.from[lang] && x.to[lang])
      .map(x => `<a href="/rutas/${x.slug}${SUFFIX[lang]}" class="related-link">${x.from[lang]} &rarr; ${x.to[lang]}</a>`)
      .join('\n        ');
    const next = html.replace(GRID, (m, a, b) => `${a}\n        ${items}${b}`);
    if (next !== html) { fs.writeFileSync(file, next); pages++; }
  }
}
const vals = [...inbound.values()];
console.log(`${routes.length} rutas · ${pages} páginas reescritas · ${missing} sin página/bloque`);
console.log(`enlaces entrantes: mín ${Math.min(...vals)} · máx ${Math.max(...vals)} · con 0: ${vals.filter(v => v === 0).length} · con <${MIN_IN}: ${vals.filter(v => v < MIN_IN).length}`);
