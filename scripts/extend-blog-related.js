#!/usr/bin/env node
/**
 * Añade rutas con muchas impresiones a la sección "Related route guides" de cada artículo del blog (en/es/fr/it/ja),
 * según el tema del artículo. Idempotente: solo agrega las rutas que falten. Uso: node scripts/extend-blog-related.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { JA_CITY } = require('./localize-ja.js');
const { CITY_LOCAL } = require('./localize-cities.js');

const BY_POST = {
  'blog-ai-train-trip-planner-europe': ['london-paris', 'paris-amsterdam', 'amsterdam-berlin', 'paris-barcelona'],
  'blog-backpacking-italy': ['rome-venice', 'rome-naples', 'venice-milan', 'milan-florence'],
  'blog-italy-interrail-itinerary': ['rome-venice', 'florence-venice', 'milan-rome', 'rome-naples'],
  'blog-florence-siena-day-trip': ['florence-venice', 'milan-florence', 'rome-venice', 'florence-pisa'],
  'blog-best-train-trips-europe': ['london-paris', 'london-edinburgh', 'paris-amsterdam', 'munich-venice'],
  'blog-europe-train-itinerary': ['london-paris', 'paris-amsterdam', 'amsterdam-berlin', 'berlin-prague'],
  'blog-cheap-train-tickets-europe': ['london-liverpool', 'paris-lyon', 'berlin-hamburg', 'munich-berlin'],
  'blog-eurail-pass-vs-point-to-point': ['london-paris', 'paris-lyon', 'paris-bordeaux', 'munich-berlin'],
  'blog-cote-bleue-marseille-train': ['nice-monaco', 'paris-nice', 'barcelona-lyon', 'paris-lyon'],
  'blog-flying-vs-train-europe': ['london-amsterdam', 'london-brussels', 'munich-berlin', 'paris-barcelona'],
  'blog-madrid-barcelona-train-guide': ['paris-barcelona', 'madrid-valencia', 'zaragoza-barcelona', 'barcelona-valencia'],
  'blog-night-trains-europe': ['munich-venice', 'prague-vienna', 'paris-nice', 'berlin-prague'],
  'blog-paris-lourdes-pilgrimage-train': ['paris-toulouse', 'toulouse-lourdes', 'paris-bordeaux', 'paris-lyon'],
  'blog-scenic-train-routes-europe': ['geneva-zermatt', 'interlaken-lauterbrunnen', 'nice-monaco', 'munich-venice'],
  'blog-train-europe-survival-guide': ['london-paris', 'london-brussels', 'brussels-paris', 'frankfurt-paris'],
  'blog-tren-arraigo-pueblos': ['madrid-seville', 'madrid-malaga', 'barcelona-girona', 'zaragoza-barcelona'],
  'blog-fastest-growing-train-routes-europe-2026': ['prague-budapest', 'amsterdam-brussels', 'london-paris', 'paris-amsterdam']
};
const SUFFIX = { en: '/', es: '/es/', fr: '/fr/', it: '/it/', ja: '/ja/' };

function routes() {
  const src = fs.readFileSync(path.join(__dirname, 'generate-routes.js'), 'utf8');
  const m = {}; const re = /slug: '([a-z-]+)', from: '([^']+)', to: '([^']+)'/g; let x;
  while ((x = re.exec(src))) m[x[1]] = { from: x[2], to: x[3] };
  return m;
}
const label = (n, lang) => lang === 'ja' ? (JA_CITY[n] || n) : (lang !== 'en' && CITY_LOCAL[lang] && CITY_LOCAL[lang][n]) || n;

function run() {
  const R = routes(); let changed = 0;
  for (const [post, slugs] of Object.entries(BY_POST)) {
    for (const lang of ['en', 'es', 'fr', 'it', 'ja']) {
      const f = path.join(ROOT, lang === 'en' ? '' : lang, post + '.html');
      if (!fs.existsSync(f)) continue;
      let html = fs.readFileSync(f, 'utf8');
      const sec = html.match(/(<section class="related-routes"[\s\S]*?<ul>)([\s\S]*?)(<\/ul>)/);
      if (!sec) continue;
      let add = '';
      for (const s of slugs) {
        if (!R[s] || !fs.existsSync(path.join(ROOT, 'rutas', s, lang === 'en' ? '' : lang, 'index.html'))) continue;
        if (sec[2].includes('/rutas/' + s + '/')) continue;
        add += `      <li><a href="/rutas/${s}${SUFFIX[lang]}">${label(R[s].from, lang)} → ${label(R[s].to, lang)}</a></li>\n`;
      }
      if (!add) continue;
      html = html.replace(sec[0], sec[1] + sec[2].replace(/\s*$/, '\n') + add + '      ' + sec[3]);
      fs.writeFileSync(f, html); changed++;
    }
  }
  return changed;
}
module.exports = { run };
if (require.main === module) console.log('Artículos con rutas relacionadas ampliadas:', run());
