#!/usr/bin/env node
/**
 * Conecta los datos estructurados de todas las páginas con la ficha de organización de la portada
 * (mismo "@id"), para que Google entienda que WoW Train y glosx.app son la misma marca. Idempotente.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ORG_ID = 'https://glosx.app/#organization';

function walk(dir, out) {
  for (const f of fs.readdirSync(dir)) {
    if (['node_modules', '.git', 'scripts'].includes(f)) continue;
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}

const isBrandOrg = o => o && typeof o === 'object' && o['@type'] === 'Organization' && /^(WoW Train|GLOSX)$/i.test(o.name || '');

function fix(node, depth) {
  let changed = false;
  if (Array.isArray(node)) { node.forEach(n => { if (fix(n, depth + 1)) changed = true; }); return changed; }
  if (!node || typeof node !== 'object') return false;
  if (isBrandOrg(node)) {
    if (node['@id'] !== ORG_ID) { node['@id'] = ORG_ID; changed = true; }
    if (!node.url) { node.url = 'https://glosx.app/'; changed = true; }
    // la ficha completa (con logo) lleva los dos nombres de la marca
    if (node.logo) {
      const alts = new Set([].concat(node.alternateName || []));
      ['GLOSX', 'glosx.app'].forEach(a => alts.add(a));
      const next = Array.from(alts);
      if (JSON.stringify(next) !== JSON.stringify([].concat(node.alternateName || []))) { node.alternateName = next; changed = true; }
    }
  }
  for (const k of Object.keys(node)) { if (fix(node[k], depth + 1)) changed = true; }
  return changed;
}

function run() {
  let files = 0;
  for (const f of walk(ROOT, [])) {
    const src = fs.readFileSync(f, 'utf8');
    if (!/application\/ld\+json/.test(src)) continue;
    let touched = false;
    const out = src.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (m, body) => {
      let obj;
      try { obj = JSON.parse(body); } catch (e) { return m; }
      if (!fix(obj, 0)) return m;
      touched = true;
      const pretty = /\n/.test(body.trim());
      return '<script type="application/ld+json">' + (pretty ? '\n  ' + JSON.stringify(obj, null, 2).replace(/\n/g, '\n  ') + '\n  ' : JSON.stringify(obj)) + '</script>';
    });
    if (touched && out !== src) { fs.writeFileSync(f, out); files++; }
  }
  return files;
}

module.exports = { run };
if (require.main === module) console.log('Páginas con datos estructurados actualizados:', run());
