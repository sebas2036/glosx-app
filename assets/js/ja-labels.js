/*
 * Japonés para lo que se dibuja con JavaScript en las páginas /ja/: el menú de hoteles por ciudad
 * (países y ciudades salían en inglés). Solo cambia el texto visible; los valores que usa el
 * planificador y los enlaces de afiliado siguen siendo los originales.
 */
(function () {
  'use strict';
  if (String(document.documentElement.lang || '').slice(0, 2) !== 'ja') return;
  var CITY = {
    Amsterdam: 'アムステルダム', Barcelona: 'バルセロナ', Basel: 'バーゼル', Berlin: 'ベルリン', Bern: 'ベルン', Bordeaux: 'ボルドー',
    Brno: 'ブルノ', Bruges: 'ブルージュ', Brussels: 'ブリュッセル', Budapest: 'ブダペスト', Cambridge: 'ケンブリッジ', Cologne: 'ケルン',
    Copenhagen: 'コペンハーゲン', Dortmund: 'ドルトムント', Edinburgh: 'エディンバラ', Figueres: 'フィゲラス', Florence: 'フィレンツェ',
    Frankfurt: 'フランクフルト', Geneva: 'ジュネーブ', Girona: 'ジローナ', Graz: 'グラーツ', Hamburg: 'ハンブルク', Innsbruck: 'インスブルック',
    Interlaken: 'インターラーケン', Jungfraujoch: 'ユングフラウヨッホ', Krems: 'クレムス', Lauterbrunnen: 'ラウターブルンネン',
    Liverpool: 'リバプール', Ljubljana: 'リュブリャナ', London: 'ロンドン', Lourdes: 'ルルド', Lucerne: 'ルツェルン', Lyon: 'リヨン',
    Madrid: 'マドリード', Mainz: 'マインツ', Malaga: 'マラガ', Manchester: 'マンチェスター', Marseille: 'マルセイユ', Milan: 'ミラノ',
    Miramas: 'ミラマス', Monaco: 'モナコ', Montreux: 'モントルー', Munich: 'ミュンヘン', Naples: 'ナポリ', Nice: 'ニース',
    Oxford: 'オックスフォード', Paris: 'パリ', Pisa: 'ピサ', Positano: 'ポジターノ', Prague: 'プラハ', Rome: 'ローマ', Salerno: 'サレルノ',
    Salzburg: 'ザルツブルク', Sargans: 'ザルガンス', Seville: 'セビリア', Siena: 'シエナ', Sorrento: 'ソレント', Spiez: 'シュピーツ',
    'St. Moritz': 'サンモリッツ', Stockholm: 'ストックホルム', Strasbourg: 'ストラスブール', Tende: 'タンド', Toulouse: 'トゥールーズ',
    Turin: 'トリノ', Valencia: 'バレンシア', Venice: 'ヴェネツィア', Vienna: 'ウィーン', York: 'ヨーク', Zaragoza: 'サラゴサ',
    Zermatt: 'ツェルマット', Zurich: 'チューリッヒ', Zweisimmen: 'ツヴァイジンメン'
  };
  var COUNTRY = {
    Austria: 'オーストリア', Belgium: 'ベルギー', 'Czech Republic': 'チェコ', Denmark: 'デンマーク', France: 'フランス', Germany: 'ドイツ',
    Hungary: 'ハンガリー', Slovenia: 'スロベニア', Italy: 'イタリア', Monaco: 'モナコ', Netherlands: 'オランダ', Spain: 'スペイン',
    Sweden: 'スウェーデン', Switzerland: 'スイス', 'United Kingdom': 'イギリス'
  };
  function apply() {
    var menu = document.getElementById('klookCityMenu');
    if (!menu || menu.getAttribute('data-ja')) return;
    menu.setAttribute('data-ja', '1');
    menu.querySelectorAll('.klook-city-group-label').forEach(function (el) { var t = el.textContent.trim(); if (COUNTRY[t]) el.textContent = COUNTRY[t]; });
    menu.querySelectorAll('.klook-city-item').forEach(function (el) { var t = el.textContent.trim(); if (CITY[t]) el.textContent = CITY[t]; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
  window.addEventListener('load', apply);
})();
