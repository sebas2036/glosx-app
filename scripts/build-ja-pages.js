#!/usr/bin/env node
/**
 * Construye las páginas estáticas en japonés (/ja/<archivo>) a partir de la versión en inglés + un spec
 * escrito en japonés nativo (scripts/ja-pages/<nombre>.js: { file, title, description, main, updated? }).
 * Usa el mismo CSS de la página original y cambia: idioma, metas, canonical, hreflang, nav y pie.
 * Idempotente. Uso: node scripts/build-ja-pages.js [archivo.html]
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const dir = path.join(__dirname, 'ja-pages');
const only = process.argv[2];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const NAV = (logo) => `<nav>\n    ${logo.replace('href="/"', 'href="/ja/"')}\n    <a href="/ja/" class="nav-back">← ホームへ戻る</a>\n  </nav>`;
const FOOTER = `<footer>\n    <p>© 2026 GLOSX · <a href="/ja/">glosx.app</a> · <a href="/ja/support.html">サポート</a> · <a href="/ja/privacy.html">プライバシー</a> · <a href="/ja/terms.html">利用規約</a></p>\n  </footer>`;

function altLinks(file) {
  const rel = file === 'index.html' ? '' : file;
  const langs = ['en', 'es', 'fr', 'it', 'ja'].filter(l => fs.existsSync(path.join(ROOT, l === 'en' ? '' : l, file)));
  const url = l => `https://glosx.app/${l === 'en' ? '' : l + '/'}${rel}`;
  return langs.map(l => `  <link rel="alternate" hreflang="${l}" href="${url(l)}" />`).join('\n') + `\n  <link rel="alternate" hreflang="x-default" href="${url('en')}" />`;
}

// conserva los hreflang que ya tenga la página (p. ej. de/pt) y suma los que falten, incluido ja
function mergedAlt(html, file) {
  const have = [...html.matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)" \/>/g)].map(m => [m[1], m[2]]);
  const def = [...altLinks(file).matchAll(/hreflang="([^"]*)" href="([^"]*)"/g)].map(m => [m[1], m[2]]);
  const map = new Map(have);
  for (const [l, u] of def) if (!map.has(l)) map.set(l, u);
  if (!map.has('ja')) map.set('ja', 'https://glosx.app/ja/' + (file === 'index.html' ? '' : file));
  if (!map.has('en')) map.set('en', 'https://glosx.app/' + (file === 'index.html' ? '' : file));
  const order = [...map.keys()].filter(k => k !== 'x-default').concat(map.has('x-default') ? ['x-default'] : []);
  return order.map(l => `  <link rel="alternate" hreflang="${l}" href="${map.get(l)}" />`).join('\n');
}

function build(spec) {
  const src = fs.readFileSync(path.join(ROOT, spec.file), 'utf8');
  let h = src;
  h = h.replace('<html lang="en">', '<html lang="ja">');
  h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(spec.title)}</title>`);
  const setMeta = (re, val) => { h = h.replace(re, (m, a, b) => a + esc(val) + b); };
  setMeta(/(<meta name="description" content=")[^"]*(")/, spec.description);
  setMeta(/(<meta property="og:title" content=")[^"]*(")/, spec.ogTitle || spec.title);
  setMeta(/(<meta property="og:description" content=")[^"]*(")/, spec.description);
  setMeta(/(<meta name="twitter:title" content=")[^"]*(")/, spec.ogTitle || spec.title);
  setMeta(/(<meta name="twitter:description" content=")[^"]*(")/, spec.description);
  const jaUrl = `https://glosx.app/ja/${spec.file}`;
  h = h.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${jaUrl}$2`);
  h = h.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${jaUrl}$2`);
  h = h.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>/g, '');
  h = h.replace(/(<link rel="canonical" href="[^"]*" \/>)/, `$1\n${mergedAlt(src, spec.file)}`);
  const logo = (src.match(/<nav>\s*(<a href="\/"[\s\S]*?<\/a>)/) || [])[1];
  if (!logo) throw new Error('No se encontró el logo en ' + spec.file);
  h = h.replace(/<nav>[\s\S]*?<\/nav>/, NAV(logo));
  h = h.replace(/<footer>[\s\S]*?<\/footer>/, FOOTER);
  h = h.replace(/<main>[\s\S]*?<\/main>/, `<main>\n${spec.main}\n  </main>`);
  const out = path.join(ROOT, 'ja', spec.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, h);
  return out;
}

// agrega hreflang ja a las versiones existentes (en/es/fr/it) de cada página
function addAltToOthers(file) {
  for (const l of ['', 'es', 'fr', 'it']) {
    const p = path.join(ROOT, l, file);
    if (!fs.existsSync(p)) continue;
    let h = fs.readFileSync(p, 'utf8');
    const block = mergedAlt(h, file);
    h = h.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>/g, '');
    h = h.replace(/(<link rel="canonical" href="[^"]*" \/>)/, `$1\n${block}`);
    fs.writeFileSync(p, h);
  }
}

const specs = fs.readdirSync(dir).filter(f => f.endsWith('.js')).map(f => require(path.join(dir, f)));
let n = 0;
for (const s of specs.flat()) {
  if (only && s.file !== only) continue;
  build(s); addAltToOthers(s.file); n++;
}
console.log('Páginas en japonés generadas:', n);
