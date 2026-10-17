#!/usr/bin/env node
/**
 * Preguntas naturales para las rutas de JAPÓN (FAQ visible + FAQPage), igual que inject-faq-more.js pero
 * solo con los nombres de ciudad (estas rutas no tienen duración/operador/precio estructurados).
 * Uso: node scripts/inject-faq-japan.js <en|es|fr|it|ja>    (idempotente por pregunta)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const lang = process.argv[2] || 'en';
const MORE = JSON.parse(fs.readFileSync(path.join(__dirname, 'faq-more-japan.json'), 'utf8'))[lang];
const jsrc = fs.readFileSync(path.join(__dirname, 'generate-routes-japan.js'), 'utf8');
const hand = eval('[' + jsrc.match(/const ROUTES = \[([\s\S]*?)\n\];\n/)[1] + '\n]');
const JP = hand.concat(require('./routes-japan-lote2'), require('./routes-japan-auto'));
const CITY_JA = require('./japan-ja-data.js').CITY;
const name = (x, key) => lang === 'ja' ? (CITY_JA[key] || x.en) : (x[lang] || x.en);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let done = 0, skipped = 0, missing = 0;
for (const r of JP) {
  const file = path.join(ROOT, 'rutas', r.slug, lang === 'en' ? '' : lang, 'index.html');
  if (!fs.existsSync(file)) { missing++; continue; }
  let html = fs.readFileSync(file, 'utf8');
  const f = name(r.from, r.fromKey), t = name(r.to, r.toKey);
  const items = MORE.map((x) => ({ q: x.q.replace(/\{\{from\}\}/g, f).replace(/\{\{to\}\}/g, t), a: x.a })).filter((x) => !html.includes(`>${esc(x.q)}<`));
  if (!items.length) { skipped++; continue; }
  const i = html.indexOf('<section class="faq">');
  if (i < 0) { missing++; continue; }
  const end = html.indexOf('</section>', i);
  const block = items.map((x) => `
      <div class="faq-item" data-more="1">
        <h3 class="faq-q">${esc(x.q)}</h3>
        <p class="faq-a">${esc(x.a)}</p>
      </div>`).join('');
  html = html.slice(0, end) + block + '\n    ' + html.slice(end);
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
console.log(`[${lang}] Japón: FAQ ampliado en ${done} rutas (${skipped} ya lo tenían, ${missing} sin página/FAQ)`);
