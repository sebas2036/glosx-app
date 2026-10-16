/*
 * Módulo "Cómo viajar" de las páginas de ruta europeas: mapa con el recorrido y duraciones
 * aproximadas por medio (tren, bus, vuelo, ferry). Datos: assets/data/route-data.json, sacado del
 * catálogo de productos de Omio (coordenadas y duración mínima por medio; ver glosx-omio-europa).
 * Las duraciones se rotulan como aproximadas: el catálogo no es la duración del tren más rápido.
 * Leaflet se carga solo cuando el módulo está cerca de la pantalla. Mosaicos de OpenStreetMap (uso ligero, con atribución);
 * CARTO ya exige clave de API.
 */
(function () {
  'use strict';

  var LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  var LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

  var L10N = {
    en: { eyebrow: 'Travel options', title: 'How to get from {a} to {b}', train: 'Train', bus: 'Bus', flight: 'Flight', ferry: 'Ferry', h: ' h ', m: ' min', note: 'Approximate typical journey times based on Omio data. They vary by date and operator.' },
    es: { eyebrow: 'Opciones de viaje', title: 'Cómo ir de {a} a {b}', train: 'Tren', bus: 'Autobús', flight: 'Avión', ferry: 'Ferri', h: ' h ', m: ' min', note: 'Duraciones aproximadas según datos de Omio. Varían según la fecha y el operador.' },
    fr: { eyebrow: 'Options de voyage', title: 'Comment aller de {a} à {b}', train: 'Train', bus: 'Bus', flight: 'Avion', ferry: 'Ferry', h: ' h ', m: ' min', note: 'Durées approximatives d’après les données d’Omio. Elles varient selon la date et l’opérateur.' },
    it: { eyebrow: 'Come viaggiare', title: 'Come andare da {a} a {b}', train: 'Treno', bus: 'Autobus', flight: 'Aereo', ferry: 'Traghetto', h: ' h ', m: ' min', note: 'Durate approssimative secondo i dati di Omio. Variano in base alla data e all’operatore.' },
    ja: { eyebrow: '移動手段', title: '{a}から{b}への行き方', train: '電車', bus: 'バス', flight: '飛行機', ferry: 'フェリー', h: '時間', m: '分', note: 'Omioのデータに基づくおおよその所要時間です。日付や運行会社によって異なります。' }
  };

  // Íconos de línea (monocromos), sin emojis
  var ICON = {
    train: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l2-4M15 21l-2-4"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/></svg>',
    bus: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="15" rx="2.5"/><path d="M4 11h16M7 21v-3M17 21v-3"/><circle cx="8" cy="14.5" r=".6"/><circle cx="16" cy="14.5" r=".6"/></svg>',
    flight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12l18-8-5 17-4-7-9-2z"/><path d="M12 14l9-10"/></svg>',
    ferry: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15l2 4c1.5.8 3 .8 4.5 0 1.5.8 3 .8 4.5 0 1.5.8 3 .8 4.5 0l2-4-3-5H7z"/><path d="M12 3v7M9 6h6"/></svg>'
  };

  function lang() {
    var l = String(document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return L10N[l] ? l : 'en';
  }

  function slugFromPath() {
    var m = location.pathname.match(/^\/rutas\/([^\/]+)\//);
    return m ? m[1] : null;
  }

  function fmt(min, t) {
    var h = Math.floor(min / 60), m = min % 60;
    if (!h) return '≈ ' + m + t.m;
    if (!m) return '≈ ' + h + t.h.trim();
    return '≈ ' + h + t.h + String(m).padStart(t.m === '分' ? 1 : 2, '0') + t.m;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function build(d, names, t) {
    var modes = ['train', 'bus', 'flight', 'ferry'].filter(function (k) { return d.m[k]; });
    var max = Math.max.apply(null, modes.map(function (k) { return d.m[k]; }));
    var rows = '';
    if (modes.length > 1) {
      rows = '<div class="rp-modes">' + modes.map(function (k) {
        var pct = Math.max(8, Math.round(d.m[k] / max * 100));
        return '<div class="rp-row' + (k === 'train' ? ' is-train' : '') + '">' +
          '<span class="rp-ico">' + ICON[k] + '</span>' +
          '<div><div class="rp-label">' + esc(t[k]) + '</div><div class="rp-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div></div>' +
          '<span class="rp-time">' + fmt(d.m[k], t) + '</span></div>';
      }).join('') + '</div><p class="rp-note">' + esc(t.note) + '</p>';
    }
    var sec = document.createElement('section');
    sec.className = 'rp';
    sec.setAttribute('aria-label', t.eyebrow);
    sec.innerHTML = '<div class="rp-head"><div class="rp-eyebrow">' + esc(t.eyebrow) + '</div>' +
      '<h2 class="rp-title">' + esc(t.title.replace('{a}', names[0]).replace('{b}', names[1])) + '</h2></div>' +
      '<div class="rp-map" id="rpMap" role="img" aria-label="' + esc(names[0] + ' – ' + names[1]) + '"></div>' + rows;
    return sec;
  }

  // Curva suave entre dos puntos (Bézier cuadrática desplazada en perpendicular)
  function arc(a, b) {
    var dx = b[1] - a[1], dy = b[0] - a[0];
    var c = [(a[0] + b[0]) / 2 + dx * 0.18, (a[1] + b[1]) / 2 - dy * 0.18];
    var pts = [];
    for (var i = 0; i <= 40; i++) {
      var s = i / 40, u = 1 - s;
      pts.push([u * u * a[0] + 2 * u * s * c[0] + s * s * b[0], u * u * a[1] + 2 * u * s * c[1] + s * s * b[1]]);
    }
    return pts;
  }

  function loadLeaflet(cb) {
    if (window.L) return cb();
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = LEAFLET_CSS;
    document.head.appendChild(css);
    var js = document.createElement('script');
    js.src = LEAFLET_JS;
    js.onload = cb;
    document.head.appendChild(js);
  }

  function draw(d, names) {
    var el = document.getElementById('rpMap');
    if (!el || !window.L) return;
    var map = L.map(el, { zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: false, boxZoom: false, keyboard: false, attributionControl: true });
    map.attributionControl.setPrefix(false);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 12, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    }).addTo(map);
    var line = arc(d.a, d.b);
    L.polyline(line, { color: '#C10016', weight: 3, opacity: 0.9, lineCap: 'round' }).addTo(map);
    function pin(pos, cls, label, dir) {
      L.marker(pos, { icon: L.divIcon({ className: '', html: '<div class="rp-pin ' + cls + '"></div>', iconSize: [14, 14], iconAnchor: [7, 7] }), interactive: false })
        .addTo(map).bindTooltip(label, { permanent: true, direction: dir, className: 'rp-tip', offset: [0, dir === 'top' ? -6 : 6] });
    }
    pin(d.a, '', names[0], 'top');
    pin(d.b, 'is-end', names[1], 'bottom');
    map.fitBounds(L.latLngBounds(line), { padding: [34, 34], maxZoom: 9 });
  }

  function init(data) {
    var slug = slugFromPath();
    var d = slug && data[slug];
    var anchor = document.querySelector('.train-segment');
    if (!d || !anchor || document.querySelector('.rp')) return;
    var title = anchor.querySelector('.train-segment-title');
    var parts = title ? title.textContent.split('→') : [];
    var names = [(parts[0] || '').trim() || slug.split('-')[0], (parts[1] || '').trim() || slug.split('-')[1]];
    var sec = build(d, names, L10N[lang()]);
    anchor.parentNode.insertBefore(sec, anchor.nextSibling);
    var started = false;
    function go() {
      if (started) return;
      started = true;
      loadLeaflet(function () { draw(d, names); });
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); go(); }
      }, { rootMargin: '300px' });
      io.observe(sec);
    } else { go(); }
  }

  fetch('/assets/data/route-data.json').then(function (r) { return r.json(); }).then(init).catch(function () {});
})();
