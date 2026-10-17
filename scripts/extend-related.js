#!/usr/bin/env node
/**
 * Amplía el bloque "More European train routes" de cada página de ruta europea de 4 a 10 enlaces, con criterio:
 * comparten ciudad (+5), comparten país (+2) y las rutas con más impresiones en Search Console (+1, scripts/seo-top-routes.json),
 * para repartir enlazado interno hacia lo que más posiciones puede ganar. Idempotente (reconstruye siempre el bloque).
 * Uso: node scripts/extend-related.js     (también lo llama generate-routes.js al terminar)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LIMIT = 10;
const TOP = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, 'seo-top-routes.json'), 'utf8')));
const { JA_CITY } = require('./localize-ja.js');
const { CITY_LOCAL } = require('./localize-cities.js');

function routes() {
  const src = fs.readFileSync(path.join(__dirname, 'generate-routes.js'), 'utf8');
  const out = []; const re = /slug: '([a-z-]+)', from: '([^']+)', to: '([^']+)', country: '([^']+)'/g; let m;
  while ((m = re.exec(src))) out.push({ slug: m[1], from: m[2], to: m[3], country: m[4] });
  return out;
}
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const SUFFIX = { en: '/', es: '/es/', fr: '/fr/', it: '/it/', ja: '/ja/' };
const label = (name, lang) => lang === 'ja' ? (JA_CITY[name] || name) : (lang !== 'en' && CITY_LOCAL[lang] && CITY_LOCAL[lang][name]) || name;

function pick(route, all) {
  const myC = route.country.split('-');
  const cities = new Set([route.from, route.to]);
  const pairKey = (r) => [r.from, r.to].sort().join('|');
  const seen = new Set([pairKey(route)]);
  return all.filter(r => r.slug !== route.slug).map(r => {
    let s = 0;
    if (cities.has(r.from) || cities.has(r.to)) s += 5;
    if (r.country.split('-').some(c => myC.includes(c))) s += 2;
    if (TOP.has(r.slug)) s += 1;
    return { r, s };
  }).sort((a, b) => b.s - a.s || hash(a.r.slug + route.slug) - hash(b.r.slug + route.slug)).map(x => x.r).filter(r => { const k = pairKey(r); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, LIMIT);
}

function run() {
  const all = routes(); let changed = 0;
  for (const route of all) {
    const rel = pick(route, all);
    for (const lang of ['en', 'es', 'fr', 'it', 'ja']) {
      const f = path.join(ROOT, 'rutas', route.slug, lang === 'en' ? '' : lang, 'index.html');
      if (!fs.existsSync(f)) continue;
      const html = fs.readFileSync(f, 'utf8');
      if (!/<div class="related-grid">/.test(html)) continue;
      const links = rel.map(r => `
    <a href="/rutas/${r.slug}${SUFFIX[lang]}" class="related-link">${label(r.from, lang)} &rarr; ${label(r.to, lang)}</a>
  `).join('');
      const out = html.replace(/(<div class="related-grid">)[\s\S]*?(\s*<\/div>\s*<\/div>\s*<\/main>)/, (m, a) => a + '\n        ' + links + '\n      </div>\n    </div>\n  </main>');
      if (out !== html) { fs.writeFileSync(f, out); changed++; }
    }
  }
  return changed;
}
module.exports = { run };
if (require.main === module) console.log('Páginas con rutas relacionadas ampliadas:', run());
