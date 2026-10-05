#!/usr/bin/env node
/**
 * Une el nombre de la marca con el dominio en los <title> de todas las páginas indexables
 * ("WoW Train" + "glosx.app"), para que Google asocie ambos. Es idempotente.
 *   - sin la marca        -> "<título> | WoW Train · glosx.app"
 *   - termina en la marca -> "<título> — WoW Train · glosx.app"   (se añade solo el dominio)
 *   - marca en el medio   -> "WoW Train" pasa a "WoW Train (glosx.app)"
 * Se salta: scripts/, páginas noindex/redirección, plantillas con {{...}} y títulos que ya llevan glosx.
 * Uso: node scripts/apply-brand-title.js        (también lo llaman los generadores al terminar)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

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

function brandTitle(title) {
  const t = title.trim();
  if (!t || /\{\{/.test(t) || /glosx/i.test(t)) return t;
  if (/WoW Train\s*$/.test(t)) return t + ' · glosx.app';
  if (t.includes('WoW Train')) return t.replace('WoW Train', 'WoW Train (glosx.app)');
  return t + ' | WoW Train · glosx.app';
}

function run() {
  let changed = 0;
  for (const f of walk(ROOT, [])) {
    const src = fs.readFileSync(f, 'utf8');
    if (/noindex|http-equiv="refresh"/i.test(src)) continue;
    const out = src.replace(/<title((?:\s[^>]*)?)>([\s\S]*?)<\/title>/, (m, attrs, t) => {
      const nt = brandTitle(t);
      return nt === t.trim() ? m : '<title' + attrs + '>' + nt + '</title>';
    });
    if (out !== src) { fs.writeFileSync(f, out); changed++; }
  }
  return changed;
}

module.exports = { run, brandTitle };
if (require.main === module) console.log('Títulos actualizados:', run());
