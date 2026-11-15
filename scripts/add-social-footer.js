#!/usr/bin/env node
/**
 * Íconos de redes de glosx (Instagram, Threads, Facebook, Pinterest, TikTok) al principio del <footer> de todas las páginas.
 * Monocromo (currentColor), círculos con borde fino, sin dependencias. Idempotente: reemplaza el bloque si ya está.
 * Correr después de regenerar páginas.  Uso: node scripts/add-social-footer.js
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['.git', 'node_modules', 'scripts', 'assets']);

const A = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
const NETS = [
  ['Instagram', 'https://www.instagram.com/glosxapp/', `<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/>`],
  ['Threads', 'https://www.threads.com/@glosxapp', `<path d="M16.6 10.4c-.6-2.2-2.3-3.4-4.6-3.4-3 0-4.9 2.1-4.9 5.1 0 3.1 1.9 5.2 5 5.2 2.4 0 3.9-1.2 3.9-3 0-1.7-1.5-2.7-3.6-2.7-1.6 0-2.7.8-2.7 1.9 0 1 .9 1.7 2.1 1.7 1.7 0 2.8-1.3 2.8-3.4"/><path d="M19.2 8.4C18 5 15.4 3.2 12 3.2 6.9 3.2 3.6 6.8 3.6 12s3.3 8.8 8.4 8.8c3.8 0 6.6-2 7.3-5.1"/>`],
  ['Facebook', 'https://www.facebook.com/glosx.app', `<path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8.9v3h2.6V21"/>`],
  ['Pinterest', 'https://www.pinterest.com/glosxapp/', `<circle cx="12" cy="12" r="9"/><path d="M10.6 20.6l1.6-7.1"/><path d="M9.3 14.6c-.7-.7-1-1.6-1-2.6 0-2.5 2-4.4 4.4-4.4 2.3 0 3.9 1.5 3.9 3.6 0 2.4-1.2 4.2-3 4.2-1 0-1.7-.8-1.5-1.8l.6-2.4"/>`],
  ['TikTok', 'https://www.tiktok.com/@wowtrain0', `<path d="M13.5 3.5v11.2a3.4 3.4 0 1 1-3.4-3.4"/><path d="M13.5 3.5c.4 2.5 2.1 4.2 4.8 4.5"/>`],
];
const icons = NETS.map(([n, u, svg]) =>
  `<a href="${u}" target="_blank" rel="noopener me" aria-label="${n}" title="${n}"><svg viewBox="0 0 24 24" width="20" height="20" ${A} aria-hidden="true">${svg}</svg></a>`).join('');
const STYLE = '.glx-social{position:static;display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin:0 0 18px}'
  + '.glx-social a{position:static;display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;'
  + 'border:1px solid rgba(20,21,26,.22);color:#14151a;text-decoration:none;transition:border-color .2s,color .2s,transform .2s}'
  + '.glx-social a:hover,.glx-social a:focus-visible{border-color:#C10016;color:#C10016;transform:translateY(-1px)}'
  + '@media (prefers-reduced-motion:reduce){.glx-social a{transition:none}.glx-social a:hover{transform:none}}';
const BLOCK = `<!-- glx-social --><style>${STYLE}</style><div class="glx-social" role="group" aria-label="glosx.app">${icons}</div><!-- /glx-social -->`;

if (process.env.SOCIAL_PREVIEW) {   // vista previa: SOCIAL_PREVIEW=/ruta/salida.html node scripts/add-social-footer.js
  fs.writeFileSync(process.env.SOCIAL_PREVIEW, `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#fafaf8;font-family:sans-serif"><div style="height:40px"></div><footer style="border-top:1px solid #ddd;padding:32px 24px;text-align:center;font-size:12px;color:#55565f">${BLOCK}<p>© 2026 GLOSX — WoW Train · glosx.app</p></footer>`);
  process.exit(0);
}
function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(path.join(dir, e.name), out); }
    else if (e.name.endsWith('.html')) out.push(path.join(dir, e.name));
  }
  return out;
}
let n = 0, sin = 0;
for (const f of walk(ROOT, [])) {
  let s = fs.readFileSync(f, 'utf8');
  if (!/<footer[\s>]/.test(s)) { sin++; continue; }
  const t = s.replace(/<!-- glx-social -->[\s\S]*?<!-- \/glx-social -->\s*/g, '').replace(/(<footer[^>]*>)/, `$1\n    ${BLOCK}`);
  if (t !== s) { fs.writeFileSync(f, t); n++; }
}
console.log(`redes en el pie: ${n} páginas actualizadas (${sin} sin <footer>)`);
