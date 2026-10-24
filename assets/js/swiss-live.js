/*
 * Próximas salidas en vivo en las guías de rutas suizas (OJP 2.0 de opentransportdata.swiss, vía backend voxa /swiss/departures).
 * Cada conexión lleva a Omio con el afiliado (subId1 swiss_live_<desde>_<hasta>). Si no hay datos, el bloque no aparece.
 */
(function () {
  'use strict';
  var API = 'https://voxa-production-dc15.up.railway.app';
  var CITIES = ['zurich', 'geneva', 'bern', 'basel', 'lucerne', 'interlaken', 'lauterbrunnen', 'zermatt', 'montreux', 'stmoritz', 'lugano'];
  var m = location.pathname.match(/^\/rutas\/([a-z]+)-([a-z]+)\//);
  if (!m || CITIES.indexOf(m[1]) < 0 || CITIES.indexOf(m[2]) < 0) return;
  var from = m[1], to = m[2];
  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  var T = {
    en: { h: 'Next departures', live: 'Live data: opentransportdata.swiss (SBB) · updated every 2 minutes', direct: 'Direct', tr: function (n) { return n + (n === 1 ? ' change' : ' changes'); }, plat: 'Platform', late: 'delayed', canc: 'Cancelled', book: 'Book on Omio' },
    es: { h: 'Próximas salidas', live: 'Datos en vivo: opentransportdata.swiss (SBB) · se actualizan cada 2 minutos', direct: 'Directo', tr: function (n) { return n + (n === 1 ? ' transbordo' : ' transbordos'); }, plat: 'Andén', late: 'con retraso', canc: 'Cancelado', book: 'Reservar en Omio' },
    fr: { h: 'Prochains départs', live: 'Données en direct : opentransportdata.swiss (CFF) · mises à jour toutes les 2 minutes', direct: 'Direct', tr: function (n) { return n + (n === 1 ? ' correspondance' : ' correspondances'); }, plat: 'Voie', late: 'en retard', canc: 'Supprimé', book: 'Réserver sur Omio' },
    it: { h: 'Prossime partenze', live: 'Dati in tempo reale: opentransportdata.swiss (FFS) · aggiornati ogni 2 minuti', direct: 'Diretto', tr: function (n) { return n + (n === 1 ? ' cambio' : ' cambi'); }, plat: 'Binario', late: 'in ritardo', canc: 'Soppresso', book: 'Prenota su Omio' },
    ja: { h: '次の出発', live: 'リアルタイムデータ：opentransportdata.swiss（SBB）・2分ごとに更新', direct: '直通', tr: function (n) { return '乗換' + n + '回'; }, plat: '番線', late: '遅れ', canc: '運休', book: 'Omioで予約' }
  };
  var t = T[lang] || T.en;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function hm(iso) {
    try { return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zurich' }).format(new Date(iso)); } catch (e) { return ''; }
  }
  function dur(min) { var h = Math.floor(min / 60), r = min % 60; return h ? h + ' h ' + String(r).padStart(2, '0') : r + ' min'; }
  var book = API + '/affiliate/europe-train?from=' + from + '&to=' + to + '&src=swiss_live&lang=' + lang;

  var css = document.createElement('style');
  css.textContent =
    '.sl{margin:28px 0;padding:20px 20px 8px;border:1px solid rgba(20,21,26,.14);border-radius:16px;background:#fff}' +
    '.sl h2{margin:0 0 4px;font-size:20px}.sl .sl-src{margin:0 0 12px;font-size:12px;color:#6b6c75}' +
    '.sl a.sl-row{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:12px 0;border-top:1px solid rgba(20,21,26,.08);color:#14151a;text-decoration:none}' +
    '.sl a.sl-row:hover .sl-cta{background:#A8000F}' +
    '.sl .sl-t{font-size:18px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}.sl .sl-t s{color:#9a9ba3;font-weight:500;margin-right:6px}' +
    '.sl .sl-m{font-size:13px;color:#4a4b55;line-height:1.45;min-width:0}.sl .sl-m b{color:#14151a}.sl .sl-late{color:#C10016;font-weight:600}' +
    '.sl .sl-cta{background:#C10016;color:#fff;font-weight:700;font-size:13px;padding:9px 14px;border-radius:999px;white-space:nowrap}' +
    '@media(max-width:560px){.sl a.sl-row{grid-template-columns:1fr auto}.sl .sl-m{grid-column:1/-1;grid-row:2}}';
  document.head.appendChild(css);

  fetch(API + '/swiss/departures?from=' + from + '&to=' + to).then(function (r) { return r.json(); }).then(function (d) {
    var trips = (d && d.trips || []).filter(function (x) { return !x.cancelled; }).slice(0, 4);
    if (!trips.length) return;
    var rows = trips.map(function (x) {
      var dep = hm(x.departure), depE = x.departureEstimated ? hm(x.departureEstimated) : dep, arr = hm(x.arrivalEstimated || x.arrival);
      var late = depE !== dep;
      var services = x.legs.map(function (l) { return esc(l.service); }).join(' · ');
      var plat = x.legs[0] && x.legs[0].platform ? ' · ' + t.plat + ' ' + esc(x.legs[0].platform) : '';
      return '<a class="sl-row" href="' + esc(book) + '" target="_blank" rel="noopener sponsored" onclick="try{gtag(\'event\',\'omio_click\',{source:\'swiss_live\',route:\'' + from + '-' + to + '\'})}catch(e){}">' +
        '<span class="sl-t">' + (late ? '<s>' + dep + '</s>' + depE : dep) + ' – ' + arr + '</span>' +
        '<span class="sl-m"><b>' + dur(x.durationMin) + '</b> · ' + (x.transfers ? t.tr(x.transfers) : t.direct) + plat + '<br>' + services + (late ? ' · <span class="sl-late">' + t.late + '</span>' : '') + '</span>' +
        '<span class="sl-cta">' + t.book + ' →</span></a>';
    }).join('');
    var box = document.createElement('section');
    box.className = 'sl';
    box.setAttribute('aria-label', t.h);
    box.innerHTML = '<h2>' + esc(t.h) + '</h2><p class="sl-src">' + esc(t.live) + '</p>' + rows;
    var anchor = document.querySelector('.rp') || document.querySelector('.train-segment') || document.querySelector('.klook-cta');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(box, anchor.nextSibling);
  }).catch(function () {});
})();
