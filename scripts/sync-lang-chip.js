#!/usr/bin/env node
/**
 * Un solo chip de idioma en todas las páginas del sitio.
 *  - Lee qué versiones existen de cada página (en / es / fr / it / ja) y muestra solo esas.
 *  - Cada opción apunta a la MISMA página en el otro idioma; la actual va marcada.
 *  - Sustituye el chip estático que ya hubiera o lo añade junto al enlace "volver" del nav.
 *  - Comprueba que todos los enlaces del chip existan (si no, avisa y no los pone).
 * No toca las portadas (su chip traduce en la misma página con JavaScript).
 * Uso: node scripts/sync-lang-chip.js [--dry]     (idempotente)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DRY = process.argv.includes('--dry');
const LANGS = ['es', 'fr', 'it', 'ja'];
const NAMES = { en: 'English', es: 'Español', fr: 'Français', it: 'Italiano', ja: '日本語' };
const SKIP_DIRS = new Set(['node_modules', 'scripts', 'assets', '.git', 'scenic', 'country-pics', 'video', 'tests']);

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.html')) out.push(path.relative(ROOT, p));
  }
  return out;
}
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

// ¿cómo se nombra la versión de otro idioma de esta página?
function parse(rel) {
  const parts = rel.split(path.sep);
  // sufijo: rutas/<slug>/(lang/)index.html y destinos/<slug>/(lang/)index.html
  if ((parts[0] === 'rutas' || parts[0] === 'destinos') && parts[parts.length - 1] === 'index.html' && parts.length >= 3) {
    const hasLang = LANGS.includes(parts[parts.length - 2]) && parts.length >= 4;
    const lang = hasLang ? parts[parts.length - 2] : 'en';
    const base = hasLang ? parts.slice(0, -2) : parts.slice(0, -1);
    return { lang, variant: (l) => [...base, ...(l === 'en' ? [] : [l]), 'index.html'].join('/') };
  }
  // prefijo: es/blog-x.html, ja/explore/index.html
  const lang = LANGS.includes(parts[0]) ? parts[0] : 'en';
  const rest = lang === 'en' ? parts : parts.slice(1);
  return { lang, variant: (l) => [...(l === 'en' ? [] : [l]), ...rest].join('/') };
}
const toUrl = (rel) => '/' + rel.replace(/index\.html$/, '');

function chipHtml(lang, items) {
  const opts = items.map(([l, url]) => `<a class="lang-option${l === lang ? ' active' : ''}" href="${url}" hreflang="${l}" lang="${l}">${NAMES[l]}</a>`).join('');
  return `<div class="lang-wrapper" data-lang-chip><button type="button" class="lang-btn" id="langBtn" aria-label="Language" aria-haspopup="true" aria-expanded="false"><span id="langCode">${lang.toUpperCase()}</span><span style="font-size:10px;opacity:0.6">▾</span></button><div class="lang-dropdown" id="langDropdown">${opts}</div></div>`;
}

// bloque <div class="lang-wrapper"...> ... balanceado
function findWrapper(html) {
  const i = html.indexOf('<div class="lang-wrapper');
  if (i < 0) return null;
  const re = /<div\b|<\/div>/g; re.lastIndex = i; let depth = 0, m;
  while ((m = re.exec(html))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) return [i, m.index + 6];
  }
  return null;
}

const files = walk(ROOT, []);
const stat = { replaced: 0, inserted: 0, same: 0, skipHome: 0, skipJs: 0, skipStub: 0, skipNoNav: 0, brokenLinks: 0 };
const notes = { skipJs: [], noNav: [], broken: [] };
const isHome = (rel) => /^(?:(?:es|fr|it|ja)\/)?index\.html$/.test(rel);

for (const rel of files) {
  if (isHome(rel) || rel === '404.html') { stat.skipHome++; continue; }
  let html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (/noindex|http-equiv="refresh"/i.test(html.slice(0, 4000)) && !/<nav/.test(html)) { stat.skipStub++; continue; }
  if (!/<nav\b/.test(html)) { stat.skipNoNav++; notes.noNav.push(rel); continue; }
  const w = findWrapper(html);
  if (w) {
  }
  const { lang, variant } = parse(rel);
  const items = [];
  for (const l of ['en', ...LANGS]) {
    const v = variant(l);
    if (l === lang || exists(v)) items.push([l, toUrl(v)]);
    else if (l !== lang) { /* no existe: no se muestra */ }
  }
  // enlaces rotos: solo se ponen los que existen (ya filtrado); se cuenta lo que faltaría respecto al chip viejo
  if (items.length < 2) { if (w) { /* una sola versión: se quita el chip */ html = html.slice(0, w[0]) + html.slice(w[1]); if (!DRY) fs.writeFileSync(path.join(ROOT, rel), html); stat.replaced++; } continue; }
  const chip = chipHtml(lang, items);
  let out;
  if (w) {
    out = html.slice(0, w[0]) + chip + html.slice(w[1]);
    if (out === html) { stat.same++; } else stat.replaced++;
  } else {
    // insertar junto al enlace "volver" del nav
    const nm = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/);
    const back = nm && nm[1].match(/<a\b[^>]*class="[^"]*(?:nav-back|back)[^"]*"[^>]*>/);
    if (nm && !back) {
      // sin enlace "volver": el chip va al final del nav
      out = html.replace(nm[0], nm[0].replace(/<\/nav>$/, chip + '</nav>'));
      stat.inserted++;
    } else if (!nm) { stat.skipNoNav++; notes.noNav.push(rel); continue; }
    else {
    const navStart = html.indexOf(nm[0]);
    const at = navStart + nm[0].indexOf(back[0]);
    const before = nm[1].slice(0, nm[1].indexOf(back[0]));
    const inRight = /<div\b[^>]*class="[^"]*nav-right[^"]*"[^>]*>\s*$/.test(before);
    if (inRight) out = html.slice(0, at) + chip + '\n      ' + html.slice(at);
    else {
      // el enlace volver cuelga directo del nav: se agrupa con el chip
      const endBack = html.indexOf('</a>', at) + 4;
      out = html.slice(0, at) + '<div class="nav-right">' + chip + html.slice(at, endBack) + '</div>' + html.slice(endBack);
    }
    stat.inserted++;
    }
  }
  // hoja y script comunes
  if (!/lang-chip\.css/.test(out)) out = out.replace('</head>', '  <link rel="stylesheet" href="/assets/css/lang-chip.css?v=1">\n</head>');
  if (!/lang-chip\.js/.test(out)) out = out.replace('</body>', '  <script src="/assets/js/lang-chip.js?v=1" defer></script>\n</body>');
  if (!DRY && out !== html) fs.writeFileSync(path.join(ROOT, rel), out);
}
console.log(DRY ? '[DRY]' : '[OK]', JSON.stringify(stat));
if (notes.skipJs.length) console.log('Con chip que traduce con JS (no se tocan):', notes.skipJs.length, notes.skipJs.slice(0, 12).join(', '));
if (notes.noNav.length) console.log('Sin nav/volver (no se tocan):', notes.noNav.length, notes.noNav.slice(0, 12).join(', '));
