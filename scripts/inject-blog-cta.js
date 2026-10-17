#!/usr/bin/env node
/**
 * Mueve la monetización del blog hacia donde el lector SÍ llega: copia los botones de reserva que ya tiene cada artículo
 * (Omio en Europa, Klook en Japón) y los coloca (1) tras la introducción, antes del primer H2, y (2) al cierre, antes del bloque final.
 * No inventa rutas: solo reutiliza los botones reales del propio artículo. Idempotente (marca data-cta-extra).
 * Uso: node scripts/inject-blog-cta.js [--dry] [archivo ...]     (sin archivos: todos los blog-*.html de todos los idiomas)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
let files = args.filter((a) => !a.startsWith('--'));
if (!files.length) {
  files = [];
  for (const d of ['', 'es', 'fr', 'it', 'ja']) {
    const dir = path.join(ROOT, d);
    for (const f of fs.readdirSync(dir)) if (/^blog-.*\.html$/.test(f)) files.push(path.join(d, f));
  }
}
const CTA = /<a [^>]*class="klook-cta"[^>]*>[\s\S]*?<\/a>/g;
const stat = { done: 0, skip: 0, noCta: 0, early: 0, end: 0 };
for (const rel of files) {
  const file = path.join(ROOT, rel);
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('data-cta-extra')) { stat.skip++; continue; }
  const m0 = html.indexOf('<main'), m1 = html.indexOf('</main>');
  if (m0 < 0 || m1 < 0) { stat.skip++; continue; }
  const main = html.slice(m0, m1);
  const ctas = [...main.matchAll(CTA)].filter((m) => /\/affiliate\/(europe-train|klook-train)/.test(m[0]));
  if (!ctas.length) { stat.noCta++; continue; }
  const tag = (block, where) => block
    .replace('class="klook-cta"', `class="klook-cta" data-cta-extra="${where}"`)
    .replace(/(source:')([^']*)(')/, `$1$2_${where}$3`)
    .replace(/(route:')([^']*)(')/, `$1$2$3`);
  const h2 = main.indexOf('<h2');
  const first = ctas[0], last = ctas[ctas.length - 1];
  const fracFirst = (first.index - 0) / main.length, fracLast = last.index / main.length;
  let out = main, addedEarly = false, addedEnd = false;
  // cierre: antes del bloque final .cta (o al final del artículo)
  if (ctas.length >= 2 && fracLast < 0.9) {
    const at = out.lastIndexOf('<div class="cta">');
    const pos = at > -1 ? at : out.length;
    out = out.slice(0, pos) + tag(last[0], 'end') + '\n\n    ' + out.slice(pos);
    addedEnd = true;
  }
  // tras la introducción: antes del primer H2, si el primer botón está lejos
  if (h2 > -1 && first.index > h2 && (ctas.length >= 2 || fracFirst > 0.4)) {
    out = out.slice(0, h2) + tag(first[0], 'top') + '\n\n    ' + out.slice(h2);
    addedEarly = true;
  }
  if (!addedEarly && !addedEnd) { stat.skip++; continue; }
  if (!DRY) fs.writeFileSync(file, html.slice(0, m0) + out + html.slice(m1));
  stat.done++; if (addedEarly) stat.early++; if (addedEnd) stat.end++;
}
console.log(DRY ? '[DRY]' : '[OK]', JSON.stringify(stat));
