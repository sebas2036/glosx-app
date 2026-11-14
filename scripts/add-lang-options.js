#!/usr/bin/env node
/**
 * Selector de idioma con los 8 idiomas del sitio (en, es, fr, de, it, pt, ja, zh) en todas las páginas
 * que usan el selector con enlaces (<div class="lang-dropdown" id="langDropdown"><a class="lang-option" …>).
 * Si la página existe en ese idioma enlaza a esa versión; si no, a la portada de ese idioma
 * (o a su índice de rutas en las páginas de ruta, si existe). No toca los hreflang (los ponen los generadores).
 * Idempotente. Correrlo después de cualquier generador de páginas.  Uso: node scripts/add-lang-options.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LANGS = [['en', 'en', 'English'], ['es', 'es', 'Español'], ['fr', 'fr', 'Français'], ['de', 'de', 'Deutsch'], ['it', 'it', 'Italiano'], ['pt', 'pt', 'Português'], ['ja', 'ja', '日本語'], ['zh', 'zh-Hans', '中文']];
const SKIP = new Set(['node_modules', '.git', 'assets', 'scripts']);

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
const exists = href => {
  const clean = href.split(/[?#]/)[0];
  const f = clean.endsWith('/') ? path.join(ROOT, clean, 'index.html') : path.join(ROOT, clean);
  return fs.existsSync(f);
};

let changed = 0, files = 0;
for (const file of walk(ROOT, [])) {
  const h = fs.readFileSync(file, 'utf8');
  const start = h.indexOf('<div class="lang-dropdown" id="langDropdown"><a class="lang-option');
  if (start < 0) continue;
  const open = '<div class="lang-dropdown" id="langDropdown">';
  const inner0 = start + open.length, end = h.indexOf('</div>', inner0);
  const inner = h.slice(inner0, end);
  const opts = {};
  let active = null;
  for (const m of inner.matchAll(/<a class="lang-option( active)?" href="([^"]+)" hreflang="([^"]+)" lang="[^"]+">[^<]*<\/a>/g)) {
    const code = m[3] === 'zh-Hans' ? 'zh' : m[3].slice(0, 2);
    opts[code] = m[2];
    if (m[1]) active = code;
  }
  if (!opts.en) continue;
  files++;
  // patrón para idiomas faltantes: a partir de una versión con prefijo de idioma conocida
  const tplLang = ['es', 'fr', 'it', 'ja', 'zh'].find(l => opts[l] && opts[l].includes(`/${l}/`));
  const guess = l => {
    if (!tplLang) return null;
    const t = opts[tplLang];
    const i = t.lastIndexOf(`/${tplLang}/`);
    return t.slice(0, i) + `/${l}/` + t.slice(i + tplLang.length + 2);
  };
  const isRoute = opts.en.startsWith('/rutas/');
  const fallback = l => (isRoute && fs.existsSync(path.join(ROOT, l, 'rutas', 'index.html'))) ? `/${l}/rutas/` : `/${l}/`;
  const html = LANGS.map(([code, hl, name]) => {
    let href = opts[code];
    if (!href) { const g = guess(code); href = g && exists(g) ? g : fallback(code); }
    return `<a class="lang-option${code === active ? ' active' : ''}" href="${href}" hreflang="${hl}" lang="${hl}">${name}</a>`;
  }).join('');
  if (html === inner) continue;
  fs.writeFileSync(file, h.slice(0, inner0) + html + h.slice(end));
  changed++;
}
console.log(`Selector de 8 idiomas: ${changed} páginas actualizadas de ${files} con selector`);
