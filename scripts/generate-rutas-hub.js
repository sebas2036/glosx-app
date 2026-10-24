#!/usr/bin/env node
/**
 * Genera el índice de rutas en es / fr / it / ja (/{lang}/rutas/) a partir de /rutas/index.html (inglés):
 * mismos listados (rutas de Europa y de Japón), con nombres de ciudad traducidos y enlaces a la versión de cada ruta
 * en ese idioma. Añade hreflang a las 5 versiones y las URLs al sitemap. Idempotente.
 * Uso: node scripts/generate-rutas-hub.js   (después: node scripts/sync-lang-chip.js y python3 scripts/hub-paises.py)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LANGS = ['es', 'fr', 'it', 'ja'];
const SUF = { es: 'es/', fr: 'fr/', it: 'it/', ja: 'ja/' };

const T = {
  es: { title: 'Todas las rutas de tren de Europa', desc: 'Índice completo de guías de rutas de tren de WoW Train: {n} rutas europeas y {j} de Japón, con horarios, precios y reservas, en inglés, español, francés, italiano y japonés.', back: '← Inicio', h1: 'Todas las rutas de tren de Europa y Japón', hubs: 'Puntos de partida populares', hubA: 'Trenes desde Londres', hubB: 'Trenes desde París', hubC: 'Reino Unido a Europa en Eurostar', intro: 'Todas las guías de rutas de WoW Train: horarios, precios, estaciones y cuándo reservar. Cada ruta está disponible en inglés, español, francés, italiano y japonés.', h2e: '{n} guías de rutas de Europa', h2j: 'Guías de rutas de Japón · {j} rutas', aria: 'Todas las guías de rutas', explore: 'Explorar', hubNote: '(en inglés)' },
  fr: { title: 'Tous les itinéraires en train en Europe', desc: 'Index complet des guides d’itinéraires de WoW Train : {n} liaisons européennes et {j} au Japon, avec horaires, prix et réservation, en anglais, espagnol, français, italien et japonais.', back: '← Accueil', h1: 'Tous les itinéraires en train en Europe et au Japon', hubs: 'Points de départ populaires', hubA: 'Trains depuis Londres', hubB: 'Trains depuis Paris', hubC: 'Du Royaume-Uni à l’Europe en Eurostar', intro: 'Tous les guides d’itinéraires de WoW Train : horaires, prix, gares et quand réserver. Chaque itinéraire est disponible en anglais, espagnol, français, italien et japonais.', h2e: '{n} guides d’itinéraires en Europe', h2j: 'Guides d’itinéraires au Japon · {j} itinéraires', aria: 'Tous les guides d’itinéraires', explore: 'Explorer', hubNote: '(en anglais)' },
  it: { title: 'Tutti i percorsi in treno in Europa', desc: 'Indice completo delle guide ai percorsi di WoW Train: {n} tratte europee e {j} in Giappone, con orari, prezzi e prenotazione, in inglese, spagnolo, francese, italiano e giapponese.', back: '← Home', h1: 'Tutti i percorsi in treno in Europa e in Giappone', hubs: 'Punti di partenza popolari', hubA: 'Treni da Londra', hubB: 'Treni da Parigi', hubC: 'Dal Regno Unito all’Europa con Eurostar', intro: 'Tutte le guide ai percorsi di WoW Train: orari, prezzi, stazioni e quando prenotare. Ogni percorso è disponibile in inglese, spagnolo, francese, italiano e giapponese.', h2e: '{n} guide ai percorsi in Europa', h2j: 'Guide ai percorsi in Giappone · {j} percorsi', aria: 'Tutte le guide ai percorsi', explore: 'Esplora', hubNote: '(in inglese)' },
  ja: { title: 'ヨーロッパの鉄道ルート一覧', desc: 'WoW Trainのルートガイド総覧：ヨーロッパ{n}路線と日本{j}路線。時刻、料金、予約を英語・スペイン語・フランス語・イタリア語・日本語で。', back: '← ホーム', h1: 'ヨーロッパと日本の鉄道ルート一覧', hubs: '人気の出発地', hubA: 'ロンドン発の列車', hubB: 'パリ発の列車', hubC: 'ユーロスターで英国からヨーロッパへ', intro: 'WoW Trainの全ルートガイド：時刻、料金、駅、予約のタイミング。各ルートは英語・スペイン語・フランス語・イタリア語・日本語で読めます。', h2e: 'ヨーロッパのルートガイド{n}本', h2j: '日本のルートガイド・{j}路線', aria: 'すべてのルートガイド', explore: '探す', hubNote: '（英語）' }
};

// nombres de ciudad por idioma (los mismos diccionarios del panel de hoteles)
const js = fs.readFileSync(path.join(ROOT, 'assets/js/japan.js'), 'utf8');
const NAMES = JSON.parse(js.match(/var HOTEL_NAMES = (\{.*?\});\n  function hname/s)[1]);
const nm = (lg, c) => (NAMES[lg] && NAMES[lg][c]) || c;

// rutas de Europa
const g = fs.readFileSync(path.join(__dirname, 'generate-routes.js'), 'utf8');
const EU = {}; for (const m of g.matchAll(/slug: '([a-z-]+)', from: '([^']+)', to: '([^']+)'/g)) EU[m[1]] = [m[2], m[3]];
const euSlugs = Object.keys(EU).sort();
// rutas de Japón (nombres propios por idioma)
const jsrc = fs.readFileSync(path.join(__dirname, 'generate-routes-japan.js'), 'utf8');
const hand = eval('[' + jsrc.match(/const ROUTES = \[([\s\S]*?)\n\];\n/)[1] + '\n]');
const JP = hand.concat(require('./routes-japan-lote2'), require('./routes-japan-auto'));
const CITY_JA = require('./japan-ja-data.js').CITY;
const jpLabel = (lg, r) => {
  const part = (x, k) => lg === 'ja' ? (CITY_JA[k] || x.en) : (x[lg] || x.en);
  return part(r.from, r.fromKey) + ' → ' + part(r.to, r.toKey);
};

const en = fs.readFileSync(path.join(ROOT, 'rutas/index.html'), 'utf8');
const hreflang = (cur) => ['en', ...LANGS].map((l) => `  <link rel="alternate" hreflang="${l}" href="https://glosx.app/${l === 'en' ? '' : l + '/'}rutas/" />`).join('\n') + '\n  <link rel="alternate" hreflang="x-default" href="https://glosx.app/rutas/" />';

for (const lg of LANGS) {
  const t = T[lg], n = euSlugs.length, j = JP.length;
  const li = (slug, label) => `      <li><a href="/rutas/${slug}/${SUF[lg]}">${label.replace('→', '&rarr;')}</a></li>`;
  const euList = euSlugs.map((s) => li(s, nm(lg, EU[s][0]) + ' → ' + nm(lg, EU[s][1]))).join('\n');
  const jpList = JP.slice().sort((a, b) => a.slug.localeCompare(b.slug)).map((r) => li(r.slug, jpLabel(lg, r))).join('\n');
  const fill = (s) => s.replace('{n}', n).replace('{j}', j);
  const html = `<!DOCTYPE html>
<html lang="${lg}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.title} &middot; WoW Train · glosx.app</title>
  <meta name="description" content="${fill(t.desc)}" />
  <link rel="canonical" href="https://glosx.app/${lg}/rutas/" />
${hreflang(lg)}
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${t.title} &middot; WoW Train" />
  <meta property="og:url" content="https://glosx.app/${lg}/rutas/" />
  <meta property="og:image" content="https://glosx.app/og-image.jpg" />
${en.match(/  <link rel="icon"[\s\S]*?<\/style>/)[0]}
  <link rel="stylesheet" href="/assets/css/lang-chip.css?v=1">
</head>
<body>
  <nav>
    <a href="/${lg}/">WoW Train</a>
    <a href="/${lg}/" class="back">${t.back}</a>
  </nav>
  <header>
    <h1>${t.h1}</h1>
    <p class="hub-links">${t.hubs}: <a href="/trains-from-london/">${t.hubA}</a> · <a href="/trains-from-paris/">${t.hubB}</a> · <a href="/trains-from-uk-to-europe/">${t.hubC}</a> ${t.hubNote}</p>
    <p>${t.intro}</p>
  </header>
  <section class="routes-index" aria-label="${t.aria}">
    <h2>${fill(t.h2e)}</h2>
    <ul class="routes-index-list">
${euList}
    </ul>
    <h2>${fill(t.h2j)}</h2>
    <ul class="routes-index-list">
${jpList}
    </ul>
  </section>
  <footer>
    <p>&copy; 2026 GLOSX &middot; <a href="/${lg}/">glosx.app</a> &middot; <a href="/${lg}/explore/">${t.explore}</a> &middot; <a href="/${lg}/blog.html">Blog</a></p>
  </footer>
  <script src="/assets/js/lang-chip.js?v=1" defer></script>
</body>
</html>
`;
  const out = path.join(ROOT, lg, 'rutas', 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

// hreflang en la versión inglesa
let enOut = en;
if (!/hreflang="ja" href="https:\/\/glosx\.app\/ja\/rutas\/"/.test(enOut)) {
  enOut = enOut.replace('  <meta name="robots" content="index, follow" />', hreflang('en') + '\n  <meta name="robots" content="index, follow" />');
  fs.writeFileSync(path.join(ROOT, 'rutas/index.html'), enOut);
}

// sitemap: URLs nuevas con hreflang (si no están)
const smPath = path.join(ROOT, 'sitemap.xml');
let sm = fs.readFileSync(smPath, 'utf8');
if (!sm.includes('https://glosx.app/es/rutas/</loc>')) {
  const alts = ['en', ...LANGS].map((l) => `    <xhtml:link xmlns:xhtml="http://www.w3.org/1999/xhtml" rel="alternate" hreflang="${l}" href="https://glosx.app/${l === 'en' ? '' : l + '/'}rutas/" />`).join('\n');
  const block = (loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>2026-10-17</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n${alts}\n  </url>\n`;
  sm = sm.replace('  <url>\n    <loc>https://glosx.app/hoy/</loc>', LANGS.map((l) => block(`https://glosx.app/${l}/rutas/`)).join('') + '  <url>\n    <loc>https://glosx.app/hoy/</loc>');
  fs.writeFileSync(smPath, sm);
}
console.log('Índices de rutas generados:', LANGS.join(', '), '| Europa', euSlugs.length, '| Japón', JP.length);
