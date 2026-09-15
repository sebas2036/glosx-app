#!/usr/bin/env node
/**
 * Arma/actualiza la cola de contenido para el orquestador de promoción.
 * Lee las rutas reales de generate-routes.js y los posts del blog, y arma
 * un content-queue.json con lo que falta promocionar y lo que ya se usó
 * (para no repetir destino en cada tanda).
 *
 * No necesita ninguna credencial — corre siempre.
 * Uso: node scripts/promo/build-content-queue.js
 */
const fs = require('fs');
const path = require('path');

const QUEUE_PATH = path.join(__dirname, 'content-queue.json');
const ROUTES_SCRIPT = path.join(__dirname, '../generate-routes.js');
const BLOG_DIR = path.join(__dirname, '../..');

function loadRoutes() {
  const src = fs.readFileSync(ROUTES_SCRIPT, 'utf8');
  const block = src.slice(src.indexOf('const routes ='), src.indexOf('\n];', src.indexOf('const routes =')));
  const slugs = [...block.matchAll(/slug: '([^']+)'/g)].map(m => m[1]);
  const froms = [...block.matchAll(/from: '([^']+)'/g)].map(m => m[1]);
  const tos = [...block.matchAll(/to: '([^']+)'/g)].map(m => m[1]);
  return slugs.map((slug, i) => ({
    type: 'ruta',
    id: slug,
    url: `https://glosx.app/rutas/${slug}/`,
    label: `${froms[i]} → ${tos[i]}`,
    from: froms[i],
    to: tos[i]
  }));
}

function loadBlogPosts() {
  return fs.readdirSync(BLOG_DIR)
    .filter(f => /^blog-.*\.html$/.test(f))
    .map(f => ({
      type: 'blog',
      id: f.replace('.html', ''),
      url: `https://glosx.app/${f}`,
      label: f.replace('blog-', '').replace('.html', '').replace(/-/g, ' ')
    }));
}

function main() {
  const items = [...loadRoutes(), ...loadBlogPosts()];
  let existing = { items: {}, log: [] };
  if (fs.existsSync(QUEUE_PATH)) {
    existing = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  }

  // Merge: conserva el historial de promoción de los items que ya existían,
  // agrega los nuevos con lastPromoted: null (nunca se usaron).
  const merged = {};
  for (const item of items) {
    merged[item.id] = existing.items[item.id] || { ...item, lastPromoted: null, timesPromoted: 0 };
    // Actualiza label/url por si cambiaron
    merged[item.id].url = item.url;
    merged[item.id].label = item.label;
    merged[item.id].type = item.type;
    if (item.from) merged[item.id].from = item.from;
    if (item.to) merged[item.id].to = item.to;
  }

  const output = { updatedAt: new Date().toISOString(), items: merged, log: existing.log || [] };
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(output, null, 2));

  const total = Object.keys(merged).length;
  const neverPromoted = Object.values(merged).filter(i => !i.lastPromoted).length;
  console.log(`Cola actualizada: ${total} items totales (${neverPromoted} nunca promocionados).`);
  console.log(`Guardado en ${QUEUE_PATH}`);
}

main();
