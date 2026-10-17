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

function localize(html) {
  html = html.replace(/(<(?:span|a|li|div)[^>]*class="[^"]*(?:route-chip|explore-route-pill|related-link|ri-route)[^"]*"[^>]*>)([^<]+)(<)/g, (m, a, t, c) => a + pair(t) + c);
  html = html.replace(/(aria-label|title)="([^"]*)"/g, (m, k, v) => ATTR_JA[v] ? k + '="' + ATTR_JA[v] + '"' : m);
  html = html.replace(/(<img[^>]*class="country-photo"[^>]*alt=")([^"]*)(")/g, (m, a, v, c) => a + (COUNTRY_JA[v] || v) + c);
  html = html.replace(/(<img[^>]*alt=")([^"]*)("[^>]*class="country-photo")/g, (m, a, v, c) => a + (COUNTRY_JA[v] || v) + c);
  return html;
}

function files() {
  const out = [];
  for (const f of ['ja/index.html', 'ja/about.html', 'ja/explore/index.html', 'ja/hoy/index.html']) if (fs.existsSync(path.join(ROOT, f))) out.push(f);
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
