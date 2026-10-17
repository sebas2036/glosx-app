#!/usr/bin/env node
/**
 * Mantiene al día las páginas de listado con TODAS las rutas de Japón (a mano + lote 2 + generadas):
 *   - /rutas/index.html: bloque "Japan route guides"
 *   - /explore, /es/explore, /fr/explore, /it/explore: tarjetas (país Japan) y enlaces a la guía
 * Idempotente: reemplaza lo que ya tenga entre marcadores. Uso: node scripts/sync-japan-listings.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function allRoutes() {
  const src = fs.readFileSync(path.join(__dirname, 'generate-routes-japan.js'), 'utf8');
  // las rutas escritas a mano viven en generate-routes-japan.js: se leen vía su propio módulo evaluando el arreglo
  const m = src.match(/const ROUTES = \[([\s\S]*?)\n\];\n/);
  const hand = eval('[' + m[1] + '\n]');
  return hand.concat(require('./routes-japan-lote2'), require('./routes-japan-auto'));
}
const routes = allRoutes();
const EUROPE_GUIDES = 115;
const total = EUROPE_GUIDES + routes.length;
const label = r => r.from.en + ' → ' + r.to.en;

// 1) /rutas/
{
  const p = path.join(ROOT, 'rutas/index.html');
  let s = fs.readFileSync(p, 'utf8');
  const items = routes.map(r => `      <li><a href="/rutas/${r.slug}/">${label(r).replace('→', '&rarr;')}</a> <a class="ri-es" href="/rutas/${r.slug}/es/" hreflang="es" lang="es">ES</a></li>`).join('\n');
  const block = `<!-- japan-guides:start -->\n    <h2>Japan route guides &middot; ${routes.length} routes &middot; EN ES FR IT</h2>\n    <ul class="routes-index-list">\n${items}\n    </ul>\n    <!-- japan-guides:end -->`;
  if (s.includes('<!-- japan-guides:start -->')) s = s.replace(/<!-- japan-guides:start -->[\s\S]*?<!-- japan-guides:end -->/, block);
  else {
    const i = s.indexOf('<h2>Japan route guides');
    const j = s.indexOf('</ul>', i) + '</ul>'.length;
    s = s.slice(0, i) + block + s.slice(j);
  }
  fs.writeFileSync(p, s);
}

// 2) Explorar
for (const f of ['explore/index.html', 'es/explore/index.html', 'fr/explore/index.html', 'it/explore/index.html']) {
  const p = path.join(ROOT, f);
  let s = fs.readFileSync(p, 'utf8');
  // quita lo anterior de Japón (entradas de ROUTES y GUIDES de rutas de Japón)
  const slugs = new Set(routes.map(r => r.slug));
  s = s.replace(/^      \['[^']*','Japan','[a-z0-9-]+'\],\n/gm, '');
  s = s.replace(/^      '([a-z0-9-]+)': '\/rutas\/[a-z0-9-]+\/',\n/gm, (m, k) => slugs.has(k) ? '' : m);
  const g = routes.map(r => `      '${r.slug}': '/rutas/${r.slug}/',\n`).join('');
  const rr = routes.map(r => `      ['${label(r)}','Japan','${r.slug}'],\n`).join('');
  s = s.replace("      'lucerne-bern': '/rutas/lucerne-bern/',\n", "      'lucerne-bern': '/rutas/lucerne-bern/',\n" + g);
  s = s.replace("      ['Lucerne → Bern','Switzerland','lucerne-bern'],\n", "      ['Lucerne → Bern','Switzerland','lucerne-bern'],\n" + rr);
  s = s.replace(/(?<![0-9])(1[0-9]{2}|2[0-9]{2}|3[0-9]{2}) (real routes|rutas reales|itinéraires réels|itinerari reali|echte Routen|rotas reais|guides|guías|full route guides|Routen-Guides|guide|guias)/g, (m, n, w) => (parseInt(n, 10) >= 100 ? total + ' ' + w : m));
  fs.writeFileSync(p, s);
}
