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
    'body.ri-searching .ri-tabs{display:none}';
  document.head.appendChild(st);

  // Parte el contenido en paneles, cada uno con su H2. El id del H2 dice la región; sin id = Europa.
  function regionOf(h) { return h.id === 'japan' ? 1 : (h.id === 'china' ? 2 : 0); }
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
