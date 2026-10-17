/*
 * Rellena la tarjeta compacta del planificador cuando el par de ciudades es conocido (sin llamar a la IA):
 * duración aproximada por medio de transporte (tren, bus, vuelo, ferry) y acceso a la guía de la ruta.
 * Datos: assets/data/pair-data.json (catálogo de productos de Omio; duración aproximada, no la del tren
 * más rápido). Reusa los estilos .rp-* de route-premium.css.
 */
(function () {
  'use strict';

  var L10N = {
    en: { opts: 'Travel options', train: 'Train', bus: 'Bus', flight: 'Flight', ferry: 'Ferry', h: ' h ', m: ' min', note: 'Approximate typical journey times based on Omio data. They vary by date and operator.', guide: 'See the full route guide' },
    es: { opts: 'Opciones de viaje', train: 'Tren', bus: 'Autobús', flight: 'Avión', ferry: 'Ferri', h: ' h ', m: ' min', note: 'Duraciones aproximadas según datos de Omio. Varían según la fecha y el operador.', guide: 'Ver la guía completa de la ruta' },
    fr: { opts: 'Options de voyage', train: 'Train', bus: 'Bus', flight: 'Avion', ferry: 'Ferry', h: ' h ', m: ' min', note: 'Durées approximatives d’après les données d’Omio. Elles varient selon la date et l’opérateur.', guide: 'Voir le guide complet de la ligne' },
    it: { opts: 'Come viaggiare', train: 'Treno', bus: 'Autobus', flight: 'Aereo', ferry: 'Traghetto', h: ' h ', m: ' min', note: 'Durate approssimative secondo i dati di Omio. Variano in base alla data e all’operatore.', guide: 'Vedi la guida completa del percorso' },
    ja: { opts: '移動手段', train: '電車', bus: 'バス', flight: '飛行機', ferry: 'フェリー', h: '時間', m: '分', note: 'Omioのデータに基づくおおよその所要時間です。日付や運行会社によって異なります。', guide: 'ルートガイドを見る' }
  };
  var ICON = {
    train: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l2-4M15 21l-2-4"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/></svg>',
    bus: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="15" rx="2.5"/><path d="M4 11h16M7 21v-3M17 21v-3"/><circle cx="8" cy="14.5" r=".6"/><circle cx="16" cy="14.5" r=".6"/></svg>',
    flight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12l18-8-5 17-4-7-9-2z"/><path d="M12 14l9-10"/></svg>',
    ferry: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15l2 4c1.5.8 3 .8 4.5 0 1.5.8 3 .8 4.5 0 1.5.8 3 .8 4.5 0l2-4-3-5H7z"/><path d="M12 3v7M9 6h6"/></svg>'
  };
  var MODES = ['train', 'bus', 'flight', 'ferry'];
  var data = null, loading = null;

  function lang() {
    var l = String(document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return L10N[l] ? l : 'en';
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function fmt(min, t) {
    var h = Math.floor(min / 60), m = min % 60;
    if (!h) return '≈ ' + m + t.m;
    if (!m) return '≈ ' + h + t.h.trim();
    return '≈ ' + h + t.h + String(m).padStart(t.m === '分' ? 1 : 2, '0') + t.m;
  }
  function load() {
    if (data) return Promise.resolve(data);
    if (!loading) loading = fetch('/assets/data/pair-data.json').then(function (r) { return r.json(); }).then(function (d) { data = d; return d; }).catch(function () { return null; });
    return loading;
  }
  function norm(slug) { return String(slug || '').toLowerCase().replace(/-(hbf|central|station|centrale|termini|ost|west)$/, ''); }
  function cityId(d, slug) { return d.c[slug] || d.c[norm(slug)]; }

  function guideUrl(a, b) {
    var pages = window.GLOSX_ROUTE_PAGES;
    if (!pages) return null;
    var cand = [norm(a) + '-' + norm(b), a + '-' + b, norm(b) + '-' + norm(a), b + '-' + a], hit = null;
    for (var i = 0; i < cand.length && !hit; i++) if (pages.has(cand[i])) hit = cand[i];
    if (!hit) return null;
    var l = lang();
    return '/rutas/' + hit + '/' + (l === 'en' ? '' : l + '/');
  }

  function fill(seg, d) {
    if (seg.getAttribute('data-pi')) return;
    var desc = seg.querySelector('.ai-segment-desc'), time = seg.querySelector('.ai-segment-time'), body = seg.querySelector('.ai-segment-body');
    // solo las tarjetas compactas vacías (las de la IA ya traen su propio texto)
    if (!body || (desc && desc.textContent.trim()) || (time && time.textContent.trim())) return;
    var buy = seg.querySelector('a.ai-segment-buy[href*="europe-train"]');
    if (!buy) return;
    var q;
    try { q = new URL(buy.href).searchParams; } catch (e) { return; }
    var a = q.get('from'), b = q.get('to');
    seg.setAttribute('data-pi', '1');
    var t = L10N[lang()];
    var o = d && cityId(d, a), de = d && cityId(d, b), raw = o && de && (d.p[o + '_' + de] || d.p[de + '_' + o]);
    var vals = raw ? raw.split(',').map(Number) : [];
    var present = MODES.filter(function (k, i) { return vals[i] > 0; });
    var html = '';
    if (present.length) {
      var max = Math.max.apply(null, present.map(function (k) { return vals[MODES.indexOf(k)]; }));
      html += '<div class="rp-eyebrow pi-eyebrow">' + esc(t.opts) + '</div><div class="rp-modes pi-modes">' + present.map(function (k) {
        var v = vals[MODES.indexOf(k)], pct = Math.max(8, Math.round(v / max * 100));
        return '<div class="rp-row' + (k === 'train' ? ' is-train' : '') + '"><span class="rp-ico">' + ICON[k] + '</span>' +
          '<div><div class="rp-label">' + esc(t[k]) + '</div><div class="rp-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div></div>' +
          '<span class="rp-time">' + fmt(v, t) + '</span></div>';
      }).join('') + '</div><p class="rp-note pi-note">' + esc(t.note) + '</p>';
      if (vals[0] > 0 && time) time.textContent = fmt(vals[0], t);
    }
    var g = guideUrl(a, b);
    if (g) html += '<a class="pi-guide" href="' + esc(g) + '">' + esc(t.guide) + ' <span aria-hidden="true">→</span></a>';
    if (!html) return;
    var box = document.createElement('div');
    box.className = 'pi';
    box.innerHTML = html;
    seg.insertBefore(box, buy);   // bloque propio del grid (el cuerpo de la tarjeta compacta está oculto por el tema)
  }

  function scan() {
    var segs = document.querySelectorAll('.ai-segment:not([data-pi])');
    if (!segs.length) return;
    load().then(function (d) { segs.forEach(function (s) { fill(s, d); }); });
  }

  var timer;
  new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(scan, 60); })
    .observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
