#!/usr/bin/env node
/**
 * Extrae los bloques de texto de un artículo del blog en inglés para traducirlo (fase 5 de los 8 idiomas).
 * Bloque = contenido HTML de un elemento de texto "hoja" (h1-h4, p, li, td, th, figcaption, summary, blockquote,
 * dt, dd, span.badge...) dentro del cuerpo visible + title/description. Salida: scripts/i18n-blog/<slug>.en.json
 * ({ "id": "html" }). Las traducciones van en <slug>.<lang>.json con las mismas claves y las arma
 * scripts/blog-i18n-build.js.  Uso: node scripts/blog-i18n-extract.js blog-xxx.html
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const file = process.argv[2];
const h = fs.readFileSync(path.join(ROOT, file), 'utf8');
const BLOCK = 'h1|h2|h3|h4|p|li|td|th|figcaption|summary|blockquote|dt|dd|button|label|caption';

function blocks(html) {
  const body = html.slice(html.indexOf('<body'));
  const clean = body.replace(/<script[\s\S]*?<\/script>/g, m => ' '.repeat(m.length)).replace(/<style[\s\S]*?<\/style>/g, m => ' '.repeat(m.length)).replace(/<svg[\s\S]*?<\/svg>/g, m => ' '.repeat(m.length));
  const out = [];
  const re = new RegExp(`<(${BLOCK})(\\s[^>]*)?>([\\s\\S]*?)</\\1>`, 'g');
  let m;
  while ((m = re.exec(clean))) {
    const inner = m[3];
    // solo hojas: sin bloques adentro
    if (new RegExp(`<(${BLOCK}|div|ul|ol|table|section)[\\s>]`).test(inner)) { re.lastIndex = m.index + m[1].length + 1; continue; }
    const t = inner.replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, ' ').trim();
    if (!/[A-Za-z]{2}/.test(t)) continue;
    out.push(inner.trim());
  }
  return out;
}
const seen = new Map();
const add = s => { if (!seen.has(s)) seen.set(s, 'b' + seen.size); };
const title = (h.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1];
const desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1];
const out = { _title: title, _desc: desc };
for (const b of blocks(h)) add(b);
for (const [s, id] of seen) out[id] = s;
const dir = path.join(__dirname, 'i18n-blog');
fs.mkdirSync(dir, { recursive: true });
const slug = file.replace(/\.html$/, '');
fs.writeFileSync(path.join(dir, slug + '.en.json'), JSON.stringify(out, null, 1));
const words = Object.values(out).join(' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
console.log(slug, Object.keys(out).length, 'bloques,', words, 'palabras');
