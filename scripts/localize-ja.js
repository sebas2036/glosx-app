#!/usr/bin/env node
/**
 * Remates del japonés en las páginas /ja/: etiquetas "Ciudad → Ciudad" que seguían en inglés,
 * aria-label/title/alt en inglés y nombres de país. Es idempotente; solo toca texto y atributos
 * de presentación (nunca href, onclick ni parámetros del planificador).
 * Uso: node scripts/localize-ja.js        (también lo llaman los generadores)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const JA_CITY = (function () {
  const src = fs.readFileSync(path.join(__dirname, 'generate-home-i18n.js'), 'utf8');
  const map = eval('({' + src.match(/const JA_CITY = \{([\s\S]*?)\n\};/)[1] + '})');
  return Object.assign(map, {
    Lisbon: 'リスボン', Porto: 'ポルト', Oslo: 'オスロ', Bergen: 'ベルゲン', Mainz: 'マインツ', Riomaggiore: 'リオマッジョーレ',
    Bregenz: 'ブレゲンツ', Trondheim: 'トロンハイム', Gothenburg: 'ヨーテボリ', Faro: 'ファロ', Málaga: 'マラガ',
    Sargans: 'ザルガンス', Spiez: 'シュピーツ', Zweisimmen: 'ツヴァイジンメン', Jungfraujoch: 'ユングフラウヨッホ'
  });
})();
const COUNTRY_JA = {
  Austria: 'オーストリア', Belgium: 'ベルギー', 'Czech Republic': 'チェコ', Denmark: 'デンマーク', France: 'フランス',
  Germany: 'ドイツ', Hungary: 'ハンガリー', Slovenia: 'スロベニア', Italy: 'イタリア', Monaco: 'モナコ',
  Netherlands: 'オランダ', Spain: 'スペイン', Sweden: 'スウェーデン', Switzerland: 'スイス', 'United Kingdom': 'イギリス',
  Portugal: 'ポルトガル', Norway: 'ノルウェー'
};
const ATTR_JA = {
  Menu: 'メニュー', Search: '検索', Close: '閉じる', Language: '言語', Region: '地域',
  'Rail operators': '対応する鉄道会社', 'Choose a route': 'ルートを選ぶ', 'Choose a city': '都市を選ぶ',
  'Booking tab helper': '予約タブのガイド', 'Install app': 'アプリをインストール',
  'Swap origin and destination': '出発地と到着地を入れ替える'
};
const pair = (txt) => {
  const m = txt.match(/^(\s*)(.+?) (→|&rarr;) (.+?)(\s*)$/);
  if (!m || !JA_CITY[m[2]] || !JA_CITY[m[4]]) return txt;
  return m[1] + JA_CITY[m[2]] + ' ' + m[3] + ' ' + JA_CITY[m[4]] + m[5];
};

// enlaces a páginas que ya existen en japonés (legales, soporte y, a medida que se traducen, blog y guías)
function jaLinks(html) {
  const fsx = require('fs');
  return html.replace(/href="\/((?:privacy|terms|cookies|imprint|support|blog|guide-[a-z0-9-]+|blog-[a-z0-9-]+)\.html)"/g, (m, f) =>
    fsx.existsSync(path.join(ROOT, 'ja', f)) ? 'href="/ja/' + f + '"' : m);
}

function localize(html) {
  html = jaLinks(html);
  html = html.replace(/(<(?:span|a|li|div)[^>]*class="[^"]*(?:route-chip|explore-route-pill|related-link|ri-route)[^"]*"[^>]*>)([^<]+)(<)/g, (m, a, t, c) => a + pair(t) + c);
  html = html.replace(/(aria-label|title)="([^"]*)"/g, (m, k, v) => ATTR_JA[v] ? k + '="' + ATTR_JA[v] + '"' : m);
  html = html.replace(/(<img[^>]*class="country-photo"[^>]*alt=")([^"]*)(")/g, (m, a, v, c) => a + (COUNTRY_JA[v] || v) + c);
  html = html.replace(/(<img[^>]*alt=")([^"]*)("[^>]*class="country-photo")/g, (m, a, v, c) => a + (COUNTRY_JA[v] || v) + c);
  return html;
}

function files() {
  const out = [];
  for (const f of ['ja/index.html', 'ja/about.html', 'ja/explore/index.html', 'ja/hoy/index.html']) if (fs.existsSync(path.join(ROOT, f))) out.push(f);
  for (const n of fs.readdirSync(path.join(ROOT, 'ja'))) if (n.endsWith('.html') && !out.includes('ja/' + n)) out.push('ja/' + n);
  return out;
}
function run() {
  let changed = 0;
  for (const rel of files()) {
    const f = path.join(ROOT, rel), src = fs.readFileSync(f, 'utf8'), out = localize(src);
    if (out !== src) { fs.writeFileSync(f, out); changed++; }
  }
  return changed;
}
module.exports = { run, localize, JA_CITY, COUNTRY_JA };
if (require.main === module) console.log('Páginas ja con remates:', run());

// ── Páginas de ruta europeas en japonés: duraciones, precios y operadores ─────────────────────────
// "2h 30m" -> "2時間30分"; ciudades nuevas que seguían en inglés; y a los operadores europeos se les añade
// una referencia que un lector japonés entiende al instante (la "versión local" del Shinkansen).
const EXTRA_CITY = { Gothenburg: 'ヨーテボリ', Trondheim: 'トロンハイム', Faro: 'ファロ', Oslo: 'オスロ', Lisbon: 'リスボン', Porto: 'ポルト', Bergen: 'ベルゲン' };
const OPERATOR_JA = {
  'Renfe AVE': 'Renfe AVE（スペインの新幹線にあたる高速列車）', TGV: 'TGV（フランスの新幹線にあたる高速列車）',
  'TGV Lyria': 'TGVリリア（フランスとスイスを結ぶ高速列車）', 'SNCF TGV': 'SNCF TGV（フランスの高速列車）',
  'DB ICE': 'ドイツ鉄道ICE（ドイツの高速列車）', ICE: 'ICE（ドイツの高速列車）', Eurostar: 'ユーロスター（英仏海峡トンネルを通る国際高速列車）',
  Thalys: 'タリス（パリ・ブリュッセル・アムステルダムを結ぶ国際高速列車）', Railjet: 'レイルジェット（オーストリアの高速列車）',
  'ÖBB Railjet': 'オーストリア鉄道のレイルジェット（高速列車）', ÖBB: 'オーストリア鉄道（ÖBB）', SBB: 'スイス国鉄（SBB）',
  Trenitalia: 'トレニタリア（イタリア国鉄。高速列車フレッチャロッサなど）', 'SNCF TER': 'SNCF TER（フランスの地域列車）',
  'SNCF Intercités': 'SNCFアンテルシテ（フランスの都市間列車）', LNER: 'LNER（ロンドンとスコットランドを結ぶ都市間列車）',
  Avanti: 'アバンティ（ロンドンとマンチェスターなどを結ぶ列車）', Renfe: 'Renfe（スペイン国鉄）', SNCB: 'SNCB（ベルギー国鉄）'
};
const dur = (h, m) => (h ? h + '時間' : '') + (m && Number(m) ? Number(m) + '分' : '');
function jaText(t) {
  t = t.replace(/(\d+)h\s*(\d{1,2})m\b/g, (_, h, m) => dur(h, m));
  t = t.replace(/\b(\d+)h\b/g, (_, h) => h + '時間');
  t = t.replace(/\b(\d{1,3})m\b(?!\w)/g, (_, m) => m + '分');
  t = t.replace(/\b(Gothenburg|Trondheim|Faro|Oslo|Lisbon|Porto|Bergen)\b/g, (_, n) => EXTRA_CITY[n]);
  return t;
}
function localizeRoute(html) {
  const tokens = html.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<[^>]+>)/g);
  let prev = '';
  return tokens.map((tok) => {
    if (tok.startsWith('<script') || tok.startsWith('<style')) { prev = tok; return tok; }
    if (tok.startsWith('<')) {
      if (/^<meta\b/.test(tok)) tok = tok.replace(/(content=")([^"]*)(")/, (m, a, v, c) => a + jaText(v) + c);
      prev = tok; return tok;
    }
    let out = jaText(tok);
    // celdas de tabla y "運行会社：X": el operador entero, con su referencia
    const m = out.match(/^(運行会社：)?\s*([A-Za-zÖČ][A-Za-zÖČ /]*?)\s*$/);
    if (m && OPERATOR_JA[m[2]] && (m[1] || /^<td\b/.test(prev))) out = (m[1] || '') + OPERATOR_JA[m[2]];
    return out;
  }).join('');
}
function runRoutes() {
  const src = fs.readFileSync(path.join(__dirname, 'generate-routes.js'), 'utf8');
  const slugs = new Set(); const re = /slug: '([a-z-]+)', from: '/g; let m;
  while ((m = re.exec(src))) slugs.add(m[1]);
  let changed = 0;
  for (const s of slugs) {
    const f = path.join(ROOT, 'rutas', s, 'ja', 'index.html');
    if (!fs.existsSync(f)) continue;
    const a = fs.readFileSync(f, 'utf8'), b = jaLinks(localizeRoute(a));
    if (a !== b) { fs.writeFileSync(f, b); changed++; }
  }
  return changed;
}
function runJapanLinks() {
  let changed = 0;
  for (const d of fs.readdirSync(path.join(ROOT, 'rutas'))) {
    const f = path.join(ROOT, 'rutas', d, 'ja', 'index.html');
    if (!fs.existsSync(f)) continue;
    const a = fs.readFileSync(f, 'utf8'), b = jaLinks(a);
    if (a !== b) { fs.writeFileSync(f, b); changed++; }
  }
  return changed;
}
module.exports.runRoutes = runRoutes;
module.exports.runJapanLinks = runJapanLinks;
if (require.main === module) console.log('Rutas europeas ja con remates:', runRoutes(), '| enlaces ja en rutas:', runJapanLinks());

// ── /ja/explore/: nombres de ruta y países en japonés, y enlaces a las guías en japonés ───────────
function localizeExplore(html) {
  const jd = require('./japan-ja-data.js');
  const pairs = require('./japan-pairs-data.json');
  const name = Object.assign({}, JA_CITY);
  pairs.cities.forEach(c => { if (jd.CITY[c.slug]) name[c.display] = jd.CITY[c.slug]; });
  const country = Object.assign({}, COUNTRY_JA, { Japan: '日本', 'Czech Republic': 'チェコ', Norway: 'ノルウェー', Portugal: 'ポルトガル', Slovenia: 'スロベニア' });
  const nm = (x) => name[x] || x;
  html = html.replace(/^(\s*)\['([^'\n]+) → ([^'\n]+)','([^'\n]+)','([a-z0-9-]+)'\],$/gm, (m, ind, a, b, ctry, slug) => {
    const c = ctry.split(' → ').map(x => country[x] || x).join(' → ');
    return `${ind}['${nm(a)} → ${nm(b)}','${c}','${slug}'],`;
  });
  // enlaces de las tarjetas "ガイドあり" a la versión en japonés
  html = html.replace(/^(\s*)'([a-z0-9-]+)': '\/rutas\/([a-z0-9-]+)\/',$/gm, (m, ind, k, slug) =>
    fs.existsSync(path.join(ROOT, 'rutas', slug, 'ja', 'index.html')) ? `${ind}'${k}': '/rutas/${slug}/ja/',` : m);
  return html;
}
function runExplore() {
  const f = path.join(ROOT, 'ja/explore/index.html');
  if (!fs.existsSync(f)) return 0;
  const a = fs.readFileSync(f, 'utf8'), b = localizeExplore(a);
  if (a !== b) { fs.writeFileSync(f, b); return 1; }
  return 0;
}
module.exports.runExplore = runExplore;
if (require.main === module) console.log('Explorar ja:', runExplore());
