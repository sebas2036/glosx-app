#!/usr/bin/env node
/**
 * Añade preguntas "humanas" (scripts/faq-more.json) al FAQ de cada ruta (HTML visible + FAQPage JSON-LD)
 * SIN regenerar el sitio, para no pisar los títulos/metas de CTR que viven solo en el HTML.
 * Usa los datos reales de cada ruta (duración, operador, precio). Idempotente (marca data-more).
 * Uso: node scripts/inject-faq-more.js en [slug ...]     (idioma: en)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const lang = process.argv[2] || 'en';
const only = process.argv.slice(3);
const MORE = JSON.parse(fs.readFileSync(path.join(__dirname, 'faq-more.json'), 'utf8'))[lang];
if (!MORE) { console.error('Sin preguntas para', lang); process.exit(1); }
const g = fs.readFileSync(path.join(__dirname, 'generate-routes.js'), 'utf8');
const re = /slug: '([a-z-]+)', from: '([^']+)', to: '([^']+)', country: '[^']+', duration: '([^']+)', operator: '([^']+)', price: '([^']+)'/g;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let m, done = 0, skipped = 0;
while ((m = re.exec(g))) {
  const [, slug, from, to, duration, operator, price] = m;
  if (only.length && !only.includes(slug)) continue;
  const file = path.join(ROOT, 'rutas', slug, lang === 'en' ? '' : lang, 'index.html');
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('data-more="1"')) { skipped++; continue; }
  const fill = (s) => s.replace(/\{\{from\}\}/g, from).replace(/\{\{to\}\}/g, to).replace(/\{\{duration\}\}/g, duration).replace(/\{\{operator\}\}/g, operator).replace(/\{\{price\}\}/g, price);
  const items = MORE.map((x) => ({ q: fill(x.q), a: fill(x.a) }));
  const block = items.map((x) => `
      <div class="faq-item" data-more="1">
        <h3 class="faq-q">${esc(x.q)}</h3>
        <p class="faq-a">${esc(x.a)}</p>
      </div>`).join('');
  const i = html.indexOf('<section class="faq">');
  if (i < 0) continue;
  const end = html.indexOf('</section>', i);
  html = html.slice(0, end) + block.replace(/^\n/, '\n') + '\n    ' + html.slice(end);
  // JSON-LD FAQPage
  html = html.replace(/<script type="application\/ld\+json">(.*?)<\/script>/s, (all, body) => {
    try {
      const d = JSON.parse(body);
      const fp = d['@graph'].find((n) => n['@type'] === 'FAQPage');
      if (!fp) return all;
      items.forEach((x) => fp.mainEntity.push({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } }));
      return '<script type="application/ld+json">' + JSON.stringify(d) + '</script>';
    } catch (e) { return all; }
  });
  fs.writeFileSync(file, html);
  done++;
}
console.log(`[${lang}] FAQ ampliado en ${done} rutas (${skipped} ya lo tenían)`);
