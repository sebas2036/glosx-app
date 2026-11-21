/*
 * Pestañas Europa / Japón / China en /rutas/ (todos los idiomas).
 * Parte la lista única en tres paneles y muestra uno a la vez. Todo el HTML sigue en la página (Google lo lee igual).
 * Mientras se busca, se ven todos los paneles con resultados. Debe cargarse ANTES de rutas-search.js.
 */
(function () {
  'use strict';
  var sec = document.querySelector('section.routes-index');
  if (!sec) return;
  var kids = Array.prototype.slice.call(sec.children);
  var heads = kids.filter(function (n) { return n.tagName === 'H2'; });
  if (heads.length < 2) return;

  var LANG = (document.documentElement.lang || 'en').slice(0, 2);
  var NAMES = {
    en: ['Europe', 'Japan', 'China'], es: ['Europa', 'Japón', 'China'], fr: ['Europe', 'Japon', 'Chine'],
    de: ['Europa', 'Japan', 'China'], it: ['Europa', 'Giappone', 'Cina'], pt: ['Europa', 'Japão', 'China'],
    ja: ['ヨーロッパ', '日本', '中国'], zh: ['欧洲', '日本', '中国']
  };
  var N = NAMES[LANG] || NAMES.en;
  var KEYS = ['europe', 'japan', 'china'];

  var st = document.createElement('style');
  st.textContent =
    '.ri-tabs{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;max-width:1100px;margin:22px auto 8px;padding:0 24px}' +
    '.ri-tab{font:inherit;font-size:15px;font-weight:600;padding:10px 20px;border:1.5px solid rgba(20,21,26,.18);border-radius:999px;background:#fff;color:#14151a;cursor:pointer;display:inline-block}' +
    '.ri-tab:hover{border-color:#14151a}' +
    '.ri-tab[aria-selected="true"]{background:#14151a;border-color:#14151a;color:#fff}' +
    '.ri-tab:focus-visible{outline:3px solid rgba(193,0,22,.35);outline-offset:2px}' +
    'section.routes-index.ri-off{display:none}' +
    'body.ri-searching section.routes-index.ri-off:not([hidden]){display:block}' +
    '.ri-tabbed>h2{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
    '.ri-tabbed{margin-top:12px}' +
    'body.ri-searching .ri-tabbed>h2{position:static;width:auto;height:auto;overflow:visible;clip:auto;white-space:normal}' +
    'body.ri-searching .ri-tabs{display:none}' +
    // Filas con forma: cada ruta es una fila blanca con borde suave
    '.routes-index .routes-index-list{columns:auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;font-size:15px}' +
    '.routes-index .routes-index-list li{margin:0;break-inside:auto}' +
    '.routes-index .routes-index-list li a{display:flex;align-items:center;gap:8px;padding:11px 14px;background:#fff;border:1px solid rgba(20,21,26,.12);border-radius:10px;color:#14151a;text-decoration:none;transition:border-color .15s,box-shadow .15s}' +
    '.routes-index .routes-index-list li a:hover,.routes-index .routes-index-list li a:focus-visible{border-color:#C10016;box-shadow:0 2px 10px rgba(20,21,26,.06);text-decoration:none;color:#14151a}' +
    '.ri-o{color:#6b6c75}.ri-arr{color:#C10016;transition:transform .15s}' +
    '.routes-index .routes-index-list li a:hover .ri-arr{transform:translateX(3px)}' +
    '.ri-group{font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#14151a;margin:30px 0 12px;padding-bottom:8px;border-bottom:1px solid rgba(20,21,26,.14);text-align:left}' +
    '.ri-group:first-of-type{margin-top:14px}' +
    '@media (max-width:860px){.routes-index .routes-index-list{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
    '@media (max-width:520px){.routes-index .routes-index-list{grid-template-columns:1fr}}' +
    '@media (prefers-reduced-motion:reduce){.routes-index .routes-index-list li a,.ri-arr{transition:none}.routes-index .routes-index-list li a:hover .ri-arr{transform:none}}';
  document.head.appendChild(st);

  // Parte el contenido en paneles, cada uno con su H2. El id del H2 dice la región; sin id = Europa.
  // Si un H2 no tiene id (en la versión en inglés Japón tampoco lo tiene), toma el primer hueco libre en orden de aparición.
  var taken = {};
  heads.forEach(function (h) { if (h.id === 'europe') taken[0] = 1; if (h.id === 'japan') taken[1] = 1; if (h.id === 'china') taken[2] = 1; });
  var assigned = new Map();
  heads.forEach(function (h) {
    var r = h.id === 'europe' ? 0 : (h.id === 'japan' ? 1 : (h.id === 'china' ? 2 : -1));
    if (r === -1) { r = 0; while (taken[r]) r++; taken[r] = 1; }
    assigned.set(h, r);
  });
  function regionOf(h) { return assigned.get(h); }
  var panels = [];
  heads.forEach(function (h, i) {
    var p = document.createElement('section');
    p.className = 'routes-index ri-tabbed';
    p.setAttribute('aria-label', sec.getAttribute('aria-label') || '');
    var next = heads[i + 1];
    var n = h;
    while (n && n !== next) {
      var after = n.nextSibling;
      p.appendChild(n);
      n = after;
    }
    panels[regionOf(h)] = p;
  });
  panels = panels.filter(Boolean);
  panels.forEach(function (p) { sec.parentNode.insertBefore(p, sec); });
  sec.parentNode.removeChild(sec);

  // Origen en gris, flecha en rojo y destino en negro (el texto completo no cambia)
  panels.forEach(function (p) {
    p.querySelectorAll('.routes-index-list li a').forEach(function (a) {
      var parts = a.textContent.split(/\s*[→]\s*/);
      if (parts.length !== 2) return;
      a.textContent = '';
      var o = document.createElement('span'); o.className = 'ri-o'; o.textContent = parts[0];
      var ar = document.createElement('span'); ar.className = 'ri-arr'; ar.setAttribute('aria-hidden', 'true'); ar.textContent = '→';
      var d = document.createElement('span'); d.className = 'ri-d'; d.textContent = parts[1];
      a.appendChild(o); a.appendChild(ar); a.appendChild(d);
    });
  });

  // Europa: agrupa las rutas por país de origen y ordena cada grupo A-Z en el idioma de la página
  var CITY = {
    amsterdam: 'NL', brussels: 'BE', paris: 'FR', bordeaux: 'FR', lyon: 'FR', marseille: 'FR', nice: 'FR', strasbourg: 'FR', tende: 'FR', toulouse: 'FR',
    madrid: 'ES', barcelona: 'ES', alicante: 'ES', santiago: 'ES', malaga: 'ES', seville: 'ES', girona: 'ES', zaragoza: 'ES',
    milan: 'IT', rome: 'IT', florence: 'IT', naples: 'IT', venice: 'IT', turin: 'IT',
    berlin: 'DE', munich: 'DE', frankfurt: 'DE', cologne: 'DE', dortmund: 'DE', koblenz: 'DE', hamburg: 'DE',
    basel: 'CH', bern: 'CH', geneva: 'CH', interlaken: 'CH', lucerne: 'CH', montreux: 'CH', stmoritz: 'CH', zurich: 'CH', zermatt: 'CH',
    london: 'GB', vienna: 'AT', graz: 'AT', innsbruck: 'AT', salzburg: 'AT', prague: 'CZ', brno: 'CZ', budapest: 'HU', ljubljana: 'SI',
    lisbon: 'PT', oslo: 'NO', stockholm: 'SE', copenhagen: 'DK'
  };
  var COUNTRY = {
    en: { ES: 'Spain', FR: 'France', IT: 'Italy', DE: 'Germany', CH: 'Switzerland', GB: 'United Kingdom', AT: 'Austria', NL: 'Netherlands', BE: 'Belgium', CZ: 'Czechia', HU: 'Hungary', SI: 'Slovenia', PT: 'Portugal', NO: 'Norway', SE: 'Sweden', DK: 'Denmark', XX: 'Other' },
    es: { ES: 'España', FR: 'Francia', IT: 'Italia', DE: 'Alemania', CH: 'Suiza', GB: 'Reino Unido', AT: 'Austria', NL: 'Países Bajos', BE: 'Bélgica', CZ: 'Chequia', HU: 'Hungría', SI: 'Eslovenia', PT: 'Portugal', NO: 'Noruega', SE: 'Suecia', DK: 'Dinamarca', XX: 'Otras' },
    fr: { ES: 'Espagne', FR: 'France', IT: 'Italie', DE: 'Allemagne', CH: 'Suisse', GB: 'Royaume-Uni', AT: 'Autriche', NL: 'Pays-Bas', BE: 'Belgique', CZ: 'Tchéquie', HU: 'Hongrie', SI: 'Slovénie', PT: 'Portugal', NO: 'Norvège', SE: 'Suède', DK: 'Danemark', XX: 'Autres' },
    de: { ES: 'Spanien', FR: 'Frankreich', IT: 'Italien', DE: 'Deutschland', CH: 'Schweiz', GB: 'Vereinigtes Königreich', AT: 'Österreich', NL: 'Niederlande', BE: 'Belgien', CZ: 'Tschechien', HU: 'Ungarn', SI: 'Slowenien', PT: 'Portugal', NO: 'Norwegen', SE: 'Schweden', DK: 'Dänemark', XX: 'Weitere' },
    it: { ES: 'Spagna', FR: 'Francia', IT: 'Italia', DE: 'Germania', CH: 'Svizzera', GB: 'Regno Unito', AT: 'Austria', NL: 'Paesi Bassi', BE: 'Belgio', CZ: 'Cechia', HU: 'Ungheria', SI: 'Slovenia', PT: 'Portogallo', NO: 'Norvegia', SE: 'Svezia', DK: 'Danimarca', XX: 'Altre' },
    pt: { ES: 'Espanha', FR: 'França', IT: 'Itália', DE: 'Alemanha', CH: 'Suíça', GB: 'Reino Unido', AT: 'Áustria', NL: 'Países Baixos', BE: 'Bélgica', CZ: 'Chéquia', HU: 'Hungria', SI: 'Eslovénia', PT: 'Portugal', NO: 'Noruega', SE: 'Suécia', DK: 'Dinamarca', XX: 'Outras' },
    ja: { ES: 'スペイン', FR: 'フランス', IT: 'イタリア', DE: 'ドイツ', CH: 'スイス', GB: 'イギリス', AT: 'オーストリア', NL: 'オランダ', BE: 'ベルギー', CZ: 'チェコ', HU: 'ハンガリー', SI: 'スロベニア', PT: 'ポルトガル', NO: 'ノルウェー', SE: 'スウェーデン', DK: 'デンマーク', XX: 'その他' },
    zh: { ES: '西班牙', FR: '法国', IT: '意大利', DE: '德国', CH: '瑞士', GB: '英国', AT: '奥地利', NL: '荷兰', BE: '比利时', CZ: '捷克', HU: '匈牙利', SI: '斯洛文尼亚', PT: '葡萄牙', NO: '挪威', SE: '瑞典', DK: '丹麦', XX: '其他' }
  };
  var CN = COUNTRY[LANG] || COUNTRY.en;
  (function groupEurope() {
    var list = panels[0].querySelector('.routes-index-list');
    if (!list) return;
    var groups = {};
    Array.prototype.slice.call(list.children).forEach(function (li) {
      var a = li.querySelector('a');
      var m = a && a.getAttribute('href').match(/\/rutas\/([^\/]+)\//);
      var origin = m ? m[1].split('-')[0] : '';
      var c = CITY[origin] || 'XX';
      (groups[c] = groups[c] || []).push(li);
    });
    var order = Object.keys(groups).sort(function (x, y) {
      if (x === 'XX') return 1; if (y === 'XX') return -1;
      return groups[y].length - groups[x].length || x.localeCompare(y);
    });
    var frag = document.createDocumentFragment();
    order.forEach(function (c) {
      var h = document.createElement('h3');
      h.className = 'ri-group';
      h.textContent = CN[c] || c;
      var ul = document.createElement('ul');
      ul.className = 'routes-index-list';
      groups[c].sort(function (a, b) { return a.textContent.localeCompare(b.textContent, LANG); }).forEach(function (li) { ul.appendChild(li); });
      frag.appendChild(h); frag.appendChild(ul);
    });
    list.parentNode.insertBefore(frag, list);
    list.parentNode.removeChild(list);
  })();

  // China: agrupa por ciudad de origen. Las ciudades con pocas rutas van juntas en "Otras ciudades"
  // (cuando una ciudad llegue a 3 rutas tendrá su propio grupo sola).
  var OTHER = { en: 'Other cities', es: 'Otras ciudades', fr: 'Autres villes', de: 'Weitere Städte', it: 'Altre città', pt: 'Outras cidades', ja: 'その他の都市', zh: '其他城市' };
  var GROUP_CHINA = false; // se activa cuando el usuario apruebe la agrupación de China por ciudad de origen
  if (GROUP_CHINA) (function groupChina() {
    var panel = panels[2];
    var list = panel && panel.querySelector('.routes-index-list');
    if (!list) return;
    var byCity = {};
    Array.prototype.slice.call(list.children).forEach(function (li) {
      var a = li.querySelector('a');
      var m = a && a.getAttribute('href').match(/\/rutas\/([^\/]+)\//);
      var k = m ? m[1].split('-')[0] : 'x';
      (byCity[k] = byCity[k] || []).push(li);
    });
    var big = [], rest = [];
    Object.keys(byCity).forEach(function (k) { (byCity[k].length >= 3 ? big : rest).push(k); });
    function txt(li, cls) { var e = li.querySelector(cls); return e ? e.textContent : li.textContent; }
    big.sort(function (x, y) { return byCity[y].length - byCity[x].length || txt(byCity[x][0], '.ri-o').localeCompare(txt(byCity[y][0], '.ri-o'), LANG); });
    var frag = document.createDocumentFragment();
    function addGroup(title, lis, byOrigin) {
      var h = document.createElement('h3'); h.className = 'ri-group'; h.textContent = title;
      var ul = document.createElement('ul'); ul.className = 'routes-index-list';
      lis.sort(function (p, q) {
        var o = byOrigin ? txt(p, '.ri-o').localeCompare(txt(q, '.ri-o'), LANG) : 0;
        return o || txt(p, '.ri-d').localeCompare(txt(q, '.ri-d'), LANG);
      }).forEach(function (li) { ul.appendChild(li); });
      frag.appendChild(h); frag.appendChild(ul);
    }
    big.forEach(function (k) { addGroup(txt(byCity[k][0], '.ri-o'), byCity[k], false); });
    var others = [];
    rest.forEach(function (k) { others = others.concat(byCity[k]); });
    if (others.length) addGroup(OTHER[LANG] || OTHER.en, others, true);
    list.parentNode.insertBefore(frag, list);
    list.parentNode.removeChild(list);
  })();

  var bar = document.createElement('div');
  bar.className = 'ri-tabs';
  bar.setAttribute('role', 'tablist');
  var tabs = panels.map(function (p, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'ri-tab';
    b.setAttribute('role', 'tab');
    b.textContent = N[i] || '';
    b.addEventListener('click', function () { show(i, true); });
    bar.appendChild(b);
    return b;
  });
  panels[0].parentNode.insertBefore(bar, panels[0]);

  function show(i, push) {
    panels.forEach(function (p, k) { p.classList.toggle('ri-off', k !== i); });
    tabs.forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1; });
    if (push && history.replaceState) history.replaceState(null, '', i === 0 ? location.pathname + location.search : '#' + KEYS[i]);
  }

  function fromHash() {
    var h = (location.hash || '').replace('#', '');
    var i = KEYS.indexOf(h);
    if (i === -1) {
      // Enlaces a una región de Japón (#jp-...) o a un id de dentro de un panel
      var el = h && document.getElementById(h);
      if (el) panels.forEach(function (p, k) { if (p.contains(el)) i = k; });
    }
    show(i === -1 ? 0 : i, false);
    if (h) { var t = document.getElementById(h); if (t && t.scrollIntoView) t.scrollIntoView(); }
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();

  // Al buscar, mostrar todos los paneles con resultados
  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'riQ') document.body.classList.toggle('ri-searching', !!e.target.value);
  });
  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('ri-clear')) document.body.classList.remove('ri-searching');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && e.target && e.target.id === 'riQ') document.body.classList.remove('ri-searching');
  });
  try { if (new URLSearchParams(location.search).get('q')) document.body.classList.add('ri-searching'); } catch (err) { /* sin parámetro */ }
})();
