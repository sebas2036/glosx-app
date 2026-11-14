#!/usr/bin/env node
/**
 * Índices de rutas en alemán y portugués (/de/rutas/, /pt/rutas/), a partir de /rutas/index.html, igual que
 * build-zh-hub.js: lista solo las rutas que existen en ese idioma, agrupadas en China, Japón y Europa (lee el
 * título y la insignia de cada página). El bloque de China va entre las marcas de generate-routes-china.js.
 * Además deja el set de 8 hreflang en los 8 índices y suma las URLs al sitemap. Idempotente.
 * Correr después de generar páginas de/pt nuevas, y luego scripts/add-lang-options.js.
 * Uso: node scripts/build-lang-hub.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const RUTAS = path.join(ROOT, 'rutas');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const L = {
  de: {
    badge: /Streckenführer · (China|Japan|Europa)/, grp: { China: 'cn', Japan: 'jp', Europa: 'eu' },
    title: 'Zugstrecken-Führer: China, Japan und Europa · WoW Train · glosx.app', og: 'Zugstrecken-Führer · WoW Train',
    desc: g => `Zugstrecken-Führer von WoW Train auf Deutsch: ${g.cn.length} Schnellzugstrecken in China mit Fahrzeit, Bahnhöfen, Tipps und Buchung.`,
    h1: 'Zugstrecken-Führer', intro: 'Fahrzeiten, Bahnhöfe, praktische Tipps und Buchung für jede Strecke. Weitere Strecken gibt es vorerst auf Englisch und in anderen Sprachen unter <a href="/rutas/">allen Strecken (Englisch)</a>.',
    home: 'Startseite', aria: 'Streckenführer', all: 'Alle Strecken (Englisch)',
    h2: { cn: n => `Streckenführer für China · ${n} Strecken`, jp: n => `Streckenführer für Japan · ${n} Strecken`, eu: n => `Streckenführer für Europa · ${n} Strecken` }
  },
  pt: {
    badge: /Guia de rota · (China|Japão|Europa)/, grp: { China: 'cn', Japão: 'jp', Europa: 'eu' },
    title: 'Guias de rotas de comboio: China, Japão e Europa · WoW Train · glosx.app', og: 'Guias de rotas de comboio · WoW Train',
    desc: g => `Guias de rotas de comboio da WoW Train em português: ${g.cn.length} rotas de alta velocidade na China, com duração, estações, conselhos e reserva.`,
    h1: 'Guias de rotas de comboio', intro: 'Duração, estações, conselhos práticos e reserva para cada rota. As outras rotas estão, por agora, em inglês e noutras línguas em <a href="/rutas/">todas as rotas (inglês)</a>.',
    home: 'Início', aria: 'Guias de rotas', all: 'Todas as rotas (inglês)',
    h2: { cn: n => `Guias de rotas na China · ${n} rotas`, jp: n => `Guias de rotas no Japão · ${n} rotas`, eu: n => `Guias de rotas na Europa · ${n} rotas` }
  }
};
const ALL = [['en', ''], ['es', 'es/'], ['fr', 'fr/'], ['de', 'de/'], ['it', 'it/'], ['pt', 'pt/'], ['ja', 'ja/'], ['zh-Hans', 'zh/']];
const HREFLANG = ALL.map(([l, p]) => `<link rel="alternate" hreflang="${l}" href="https://glosx.app/${p}rutas/" />`).join('\n  ') + '\n  <link rel="alternate" hreflang="x-default" href="https://glosx.app/rutas/" />';
const setHreflang = h => h.replace(/(?:\s*<link rel="alternate" hreflang="[^"]+" href="https:\/\/glosx\.app\/(?:[a-z]{2}\/)?rutas\/" \/>)+/, '\n  ' + HREFLANG);

const SRC = fs.readFileSync(path.join(RUTAS, 'index.html'), 'utf8');
const slugs = fs.readdirSync(RUTAS).sort();
for (const [lang, c] of Object.entries(L)) {
  const g = { cn: [], jp: [], eu: [] };
  for (const slug of slugs) {
    const p = path.join(RUTAS, slug, lang, 'index.html');
    if (!fs.existsSync(p)) continue;
    const h = fs.readFileSync(p, 'utf8');
    const t = (h.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1];
    const b = (h.match(c.badge) || [])[1];
    if (!t || !b) { console.error('Sin título o insignia:', lang, slug); continue; }
    g[c.grp[b]].push([slug, t.trim()]);
  }
  const list = arr => '    <ul class="routes-index-list">\n' + arr.map(([s, t]) => `      <li><a href="/rutas/${s}/${lang}/">${esc(t).replace('→', '&rarr;')}</a></li>`).join('\n') + '\n    </ul>';
  const sec = k => g[k].length ? `    <h2 id="${{ cn: 'china', jp: 'japan', eu: 'europe' }[k]}">${c.h2[k](g[k].length)}</h2>\n${list(g[k])}\n` : '';
  let s = SRC.replace('<html lang="en">', `<html lang="${lang}">`);
  s = s.replace(/<title>[^<]*<\/title>/, `<title>${c.title}</title>`);
  s = s.replace(/(<meta name="description" content=")[^"]*(")/, `$1${c.desc(g)}$2`).replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${c.desc(g)}$2`);
  s = s.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${c.desc(g)}$2`);
  s = s.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${c.og}$2`).replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${c.og}$2`);
  s = s.replace('<link rel="canonical" href="https://glosx.app/rutas/" />', `<link rel="canonical" href="https://glosx.app/${lang}/rutas/" />`);
  s = s.replace('<meta property="og:url" content="https://glosx.app/rutas/" />', `<meta property="og:url" content="https://glosx.app/${lang}/rutas/" />`);
  s = s.replace('<a href="/">WoW Train</a>', `<a href="/${lang}/">WoW Train</a>`);
  s = s.replace(/<a href="\/"([^>]*)>(\s*(?:&larr;|←)\s*)Home<\/a>/, `<a href="/${lang}/"$1>$2${c.home}</a>`);
  s = s.replace(/<span id="langCode">[^<]*<\/span>/, `<span id="langCode">${lang.toUpperCase()}</span>`);
  s = s.replace(/\s*<div class="hub-mosaic">[\s\S]*?<\/div>\n/, '\n');
  s = s.replace(/<header>[\s\S]*?<\/header>/, `<header>\n    <h1>${c.h1}</h1>\n    <p>${c.intro}</p>\n  </header>`);
  s = s.replace(/<section class="routes-index"[\s\S]*?<\/section>/, `<section class="routes-index" aria-label="${c.aria}">
    <!-- china-guides:start -->
${sec('cn')}    <!-- china-guides:end -->
${sec('jp')}${sec('eu')}  </section>`);
  s = s.replace(/<footer>[\s\S]*?<\/footer>/, `<footer>\n    <p>&copy; 2026 GLOSX &middot; <a href="/${lang}/">glosx.app</a> &middot; <a href="/rutas/">${c.all}</a></p>\n  </footer>`);
  s = s.replace(/<script src="\/assets\/js\/rutas-search\.js[^"]*" defer><\/script>\n\s*/, '');
  // opción activa: la pone add-lang-options.js a partir de esta
  s = s.replace(/<a class="lang-option active"/, '<a class="lang-option"');
  s = s.replace(/(<div class="lang-dropdown" id="langDropdown">)/, `$1<a class="lang-option active" href="/${lang}/rutas/" hreflang="${lang}" lang="${lang}">${lang === 'de' ? 'Deutsch' : 'Português'}</a>`);
  s = setHreflang(s);
  fs.mkdirSync(path.join(ROOT, lang, 'rutas'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, lang, 'rutas', 'index.html'), s);
  console.log(`/${lang}/rutas/ listo: China ${g.cn.length}, Japón ${g.jp.length}, Europa ${g.eu.length}`);
}
// 8 hreflang en los demás índices
for (const f of ['rutas/index.html', 'es/rutas/index.html', 'fr/rutas/index.html', 'it/rutas/index.html', 'ja/rutas/index.html', 'zh/rutas/index.html']) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) fs.writeFileSync(p, setHreflang(fs.readFileSync(p, 'utf8')));
}
const sm = path.join(ROOT, 'sitemap.xml');
let x = fs.readFileSync(sm, 'utf8');
for (const lang of Object.keys(L)) if (!x.includes(`<loc>https://glosx.app/${lang}/rutas/</loc>`)) x = x.replace('</urlset>', `  <url>\n    <loc>https://glosx.app/${lang}/rutas/</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>`);
fs.writeFileSync(sm, x);
