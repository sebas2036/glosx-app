/*
 * Buscador de /rutas/ (todos los idiomas). Filtra mientras se escribe: "paris" muestra todas las rutas con París
 * (como origen o destino). Funciona con los nombres de ciudad en cualquier idioma (Sevilla, Séville, Siviglia, Seville),
 * sin acentos y con varias palabras ("madrid sevilla"). Se monta solo: no necesita marcado en la página.
 */
(function () {
  'use strict';
  var sections = document.querySelectorAll('.routes-index');
  if (!sections.length) return;

  var LANG = (document.documentElement.lang || 'en').slice(0, 2);
  var T = {
    en: { label: 'Search routes', ph: 'Search a city, e.g. Paris', count: function (n) { return n + (n === 1 ? ' route' : ' routes'); }, empty: 'No routes match. Try another city or fewer words.', clear: 'Clear' },
    es: { label: 'Buscar rutas', ph: 'Busca una ciudad, por ejemplo París', count: function (n) { return n + (n === 1 ? ' ruta' : ' rutas'); }, empty: 'No hay rutas con esa búsqueda. Prueba con otra ciudad o menos palabras.', clear: 'Borrar' },
    fr: { label: 'Rechercher des trajets', ph: 'Cherchez une ville, par exemple Paris', count: function (n) { return n + (n === 1 ? ' trajet' : ' trajets'); }, empty: 'Aucun trajet ne correspond. Essayez une autre ville ou moins de mots.', clear: 'Effacer' },
    it: { label: 'Cerca tratte', ph: 'Cerca una città, ad esempio Parigi', count: function (n) { return n + (n === 1 ? ' tratta' : ' tratte'); }, empty: 'Nessuna tratta trovata. Prova un’altra città o meno parole.', clear: 'Cancella' },
    ja: { label: '路線を検索', ph: '都市名で検索（例：パリ）', count: function (n) { return n + '路線'; }, empty: '該当する路線がありません。別の都市名でお試しください。', clear: 'クリア' }
  };
  var L = T[LANG] || T.en;

  // Nombres locales -> nombre en inglés (que es el que llevan las direcciones de las páginas)
  var ALIAS = {
    londres: 'london', londra: 'london', bruselas: 'brussels', bruxelles: 'brussels', ginebra: 'geneva', geneve: 'geneva', ginevra: 'geneva',
    berna: 'bern', berne: 'bern', basilea: 'basel', bale: 'basel', lucerna: 'lucerne', milano: 'milan', roma: 'rome', florencia: 'florence',
    firenze: 'florence', venecia: 'venice', venise: 'venice', venezia: 'venice', napoles: 'naples', napoli: 'naples', turin: 'turin', torino: 'turin',
    praga: 'prague', viena: 'vienna', vienne: 'vienna', francfort: 'frankfurt', fráncfort: 'frankfurt', francoforte: 'frankfurt', colonia: 'cologne',
    hamburgo: 'hamburg', hambourg: 'hamburg', amburgo: 'hamburg', copenhague: 'copenhagen', copenaghen: 'copenhagen', estocolmo: 'stockholm',
    stoccolma: 'stockholm', gotemburgo: 'gothenburg', goteborg: 'gothenburg', edimburgo: 'edinburgh', edimbourg: 'edinburgh', lisboa: 'lisbon',
    lisbonne: 'lisbon', lisbona: 'lisbon', oporto: 'porto', sevilla: 'seville', seville: 'seville', siviglia: 'seville', malaga: 'malaga',
    cordoba: 'cordoba', cordoue: 'cordoba', cordova: 'cordoba', burdeos: 'bordeaux', marsella: 'marseille', marsiglia: 'marseille', niza: 'nice',
    nizza: 'nice', estrasburgo: 'strasbourg', strasburgo: 'strasbourg', brujas: 'bruges', amberes: 'antwerp', anvers: 'antwerp', anversa: 'antwerp',
    gante: 'ghent', gand: 'ghent', liubliana: 'ljubljana', lubiana: 'ljubljana', salzburgo: 'salzburg', salzbourg: 'salzburg', salisburgo: 'salzburg',
    varsovia: 'warsaw', varsovie: 'warsaw', varsavia: 'warsaw', cracovia: 'krakow', cracovie: 'krakow', barcelone: 'barcelona', barcellona: 'barcelona',
    segovie: 'segovia', tolede: 'toledo', grenade: 'granada', salamanque: 'salamanca', gerona: 'girona', tolosa: 'toulouse', monaco: 'munich',
    zurich: 'zurich', zúrich: 'zurich', zuerich: 'zurich', munchen: 'munich', munich: 'munich', santiago: 'santiago', compostela: 'compostela'
  };

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function tokens(s) {
    return norm(s).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  }

  // Estilos propios (no dependen de la hoja de la página)
  var st = document.createElement('style');
  st.textContent =
    '.ri-search{max-width:1100px;margin:8px auto 0;padding:0 24px}' +
    '.ri-search-box{position:relative;max-width:520px;margin:0 auto}' +
    '.ri-search input{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:13px 44px 13px 16px;border:1.5px solid rgba(20,21,26,.22);border-radius:12px;background:#fff;color:#14151a;outline:none;-webkit-appearance:none;appearance:none}' +
    '.ri-search input:focus{border-color:#C10016;box-shadow:0 0 0 3px rgba(193,0,22,.14)}' +
    '.ri-search input::-webkit-search-cancel-button{display:none}' +
    '.ri-clear{position:absolute;right:6px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:#6b6c75;font:inherit;font-size:13px;padding:8px 10px;border-radius:8px;cursor:pointer}' +
    '.ri-clear:hover{color:#14151a}' +
    '.ri-status{max-width:520px;margin:8px auto 0;font-size:13px;color:#6b6c75;text-align:center;min-height:18px}' +
    '.ri-empty{max-width:520px;margin:28px auto;padding:0 24px;text-align:center;color:#6b6c75;font-size:15px}';
  document.head.appendChild(st);

  var wrap = document.createElement('div');
  wrap.className = 'ri-search';
  wrap.innerHTML =
    '<div class="ri-search-box"><input type="search" id="riQ" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" aria-label="' + L.label + '" placeholder="' + L.ph + '">' +
    '<button type="button" class="ri-clear" hidden>' + L.clear + '</button></div><p class="ri-status" id="riStatus" role="status" aria-live="polite"></p>';
  sections[0].parentNode.insertBefore(wrap, sections[0]);
  var empty = document.createElement('p');
  empty.className = 'ri-empty';
  empty.hidden = true;
  empty.textContent = L.empty;
  sections[sections.length - 1].parentNode.insertBefore(empty, sections[sections.length - 1].nextSibling);

  var input = wrap.querySelector('input'), clear = wrap.querySelector('.ri-clear'), status = wrap.querySelector('#riStatus');

  // Texto buscable de cada ruta: lo que se ve + las palabras de la dirección (siempre en inglés)
  var items = [];
  sections.forEach(function (sec) {
    sec.querySelectorAll('li').forEach(function (li) {
      var a = li.querySelector('a');
      var slug = '';
      var m = a && a.getAttribute('href') && a.getAttribute('href').match(/\/rutas\/([^\/]+)\//);
      if (m) slug = m[1].replace(/-/g, ' ');
      items.push({ li: li, sec: sec, hay: norm(li.textContent) + ' ' + norm(slug) });
    });
  });
  var total = items.length;

  function run(q) {
    var terms = tokens(q);
    var shown = 0;
    var perSec = new Map();
    items.forEach(function (it) {
      var ok = terms.every(function (t) {
        return it.hay.indexOf(t) !== -1 || (ALIAS[t] && it.hay.indexOf(ALIAS[t]) !== -1);
      });
      it.li.hidden = !ok;
      if (ok) { shown++; perSec.set(it.sec, (perSec.get(it.sec) || 0) + 1); }
    });
    sections.forEach(function (sec) { sec.hidden = terms.length > 0 && !perSec.get(sec); });
    empty.hidden = !(terms.length && shown === 0);
    status.textContent = terms.length ? (shown ? L.count(shown) : '') : '';
    clear.hidden = !q;
  }

  input.addEventListener('input', function () { run(input.value); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; run(''); } });
  clear.addEventListener('click', function () { input.value = ''; run(''); input.focus(); });

  try {
    var q = new URLSearchParams(location.search).get('q');
    if (q) { input.value = q; run(q); }
  } catch (e) { /* sin parámetro */ }
})();
