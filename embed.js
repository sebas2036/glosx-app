/*
 * Ficha viva de WoW Train para blogs externos ("Lleva esta ruta a tu blog").
 *
 * El bloguero pega:
 *   <a class="wow-train-card" href="https://glosx.app/rutas/<ruta>/..." data-site="su-blog.com" data-by="Su marca">Horarios: WoW Train (glosx.app)</a>
 *   <script src="https://glosx.app/embed.js" async></script>
 *
 * Este script convierte cada enlace en la ficha completa y deja ese mismo enlace al pie.
 * - Sin el enlace no hay ficha: el script solo se engancha a <a class="wow-train-card"> que apunten a glosx.app.
 * - Solo se dibuja en el blog registrado (data-site); en otro dominio queda el enlace simple.
 * - Los datos se leen en vivo de glosx.app (h1 y .lead de la ruta; horario oficial cuando existe), así que se actualizan solos.
 * Sin dependencias, estilos en línea, sin emojis.
 */
(function () {
  'use strict';

  var ORIGIN = 'https://glosx.app';
  var FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  var T = {
    en: { fast: 'Fastest', eyebrow: 'Train route', first: 'First train', last: 'Last train', n: 'Trains per weekday', avg: 'Typical journey', source: 'Official timetable', by: 'Shared by' },
    es: { fast: 'Más rápido', eyebrow: 'Ruta en tren', first: 'Primer tren', last: 'Último tren', n: 'Trenes por día laborable', avg: 'Duración habitual', source: 'Horario oficial', by: 'Compartido por' },
    fr: { fast: 'Le plus rapide', eyebrow: 'Itinéraire en train', first: 'Premier train', last: 'Dernier train', n: 'Trains par jour de semaine', avg: 'Durée habituelle', source: 'Horaire officiel', by: 'Partagé par' },
    it: { fast: 'Il più veloce', eyebrow: 'Percorso in treno', first: 'Primo treno', last: 'Ultimo treno', n: 'Treni nei giorni feriali', avg: 'Durata abituale', source: 'Orario ufficiale', by: 'Condiviso da' },
    ja: { fast: '最速', eyebrow: '鉄道ルート', first: '始発', last: '終電', n: '平日の本数', avg: '標準的な所要時間', source: '公式時刻表', by: '提供' }
  };

  var json = null;
  function routes() {
    if (!json) json = fetch(ORIGIN + '/assets/data/horarios-rutas.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    return json;
  }

  function hm(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return h ? h + ' h ' + (m < 10 ? '0' : '') + m : m + ' min';
  }

  function stats(j, slug, tx) {
    var r = j && j.routes && j.routes[slug];
    if (!r || !r.dirs) return null;
    var keys = Object.keys(r.dirs), head = slug.split('-')[0];
    var key = keys.filter(function (k) { return k.toLowerCase().replace(/[^a-z]/g, '').indexOf(head) === 0; })[0] || keys[0];
    var wk = r.dirs[key] && r.dirs[key].weekday;
    if (!wk) return null;
    var n = 0, first = '99:99', last = '00:00', med = [], src = [];
    Object.keys(wk).forEach(function (s) {
      var v = wk[s];
      n += v.n; if (v.first < first) first = v.first; if (v.last > last) last = v.last; med.push(v.median_min);
      var f = j.feeds && j.feeds[s];
      if (f) src.push(f.name + (f.license ? ' (' + f.license + ')' : ''));
    });
    if (!n) return null;
    return { rows: [[tx.first, first], [tx.last, last], [tx.n, String(n)], [tx.avg, hm(Math.min.apply(null, med))]], source: tx.source + ': ' + src.join(', ') };
  }

  // Tablas por país: la fila de la conexión (Viaje | | Primer tren | Último tren | Laborable | Sábado | Domingo | Más rápido)
  function tableRow(doc, title, tx) {
    if (!title) return null;
    var trs = doc.querySelectorAll('main.hx table tbody tr');
    for (var i = 0; i < trs.length; i++) {
      var td = trs[i].children;
      if (td.length < 8 || td[0].textContent.trim() !== title) continue;
      var src = '', ps = doc.querySelectorAll('main.hx p');
      for (var j = 0; j < ps.length; j++) {
        var mm = ps[j].textContent.match(/\(([^)]*(CC BY|NLOD|CC0|Licen)[^)]*)\)/);
        if (mm) { src = mm[1]; break; }
      }
      return { rows: [[tx.first, td[2].textContent.trim()], [tx.last, td[3].textContent.trim()], [tx.n, td[4].textContent.trim()], [tx.fast, td[7].textContent.trim()]], source: tx.source + ': ' + src };
    }
    return null;
  }

  function el(tag, css, text) {
    var e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (text != null) e.textContent = text;
    return e;
  }

  // Construye la ficha con DOM (sin innerHTML: el texto viene de otra página y del atributo data-by)
  function build(a, d, tx) {
    var box = el('div', 'box-sizing:border-box;max-width:520px;margin:20px auto;padding:18px 20px;background:#ffffff;border:1px solid #e6e2db;border-radius:14px;font-family:' + FONT + ';color:#14151a;line-height:1.5;text-align:left');
    box.appendChild(el('p', 'margin:0 0 4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:#C10016', tx.eyebrow));
    box.appendChild(el('p', 'margin:0 0 8px;font-size:18px;font-weight:700;color:#14151a', d.title));
    if (d.lead) box.appendChild(el('p', 'margin:0 0 12px;font-size:14px;color:#44454d', d.lead));
    if (d.st) {
      var t = el('table', 'width:100%;border-collapse:collapse;margin:0 0 12px;border-top:1px solid #efece6');
      d.st.rows.forEach(function (r) {
        var tr = el('tr');
        tr.appendChild(el('td', 'padding:6px 0;color:#55565f;font-size:13px;border:0', r[0]));
        tr.appendChild(el('td', 'padding:6px 0;text-align:right;font-weight:600;font-size:13px;color:#14151a;border:0;white-space:nowrap', r[1]));
        t.appendChild(tr);
      });
      box.appendChild(t);
    }
    var foot = el('p', 'margin:0;font-size:12px;color:#6b6c75');
    a.style.cssText = 'color:#C10016;font-weight:600;text-decoration:none';
    foot.appendChild(a);                       // el mismo enlace del bloguero: la ficha y el backlink son una sola cosa
    if (d.st) foot.appendChild(document.createTextNode(' · ' + d.st.source));
    box.appendChild(foot);
    var by = (a.getAttribute('data-by') || '').trim().slice(0, 60);
    if (by) box.appendChild(el('p', 'margin:6px 0 0;font-size:12px;color:#6b6c75', tx.by + ' ' + by));
    return box;
  }

  function hostOk(site) {
    site = String(site || '').toLowerCase().replace(/^www\./, '');
    var h = location.hostname.toLowerCase().replace(/^www\./, '');
    return !!site && (h === site || h.slice(-(site.length + 1)) === '.' + site);
  }

  function render(a) {
    if (a.getAttribute('data-wt-done')) return;
    a.setAttribute('data-wt-done', '1');
    var url;
    try { url = new URL(a.href); } catch (e) { return; }
    if (url.origin !== ORIGIN || !hostOk(a.getAttribute('data-site'))) return;   // queda el enlace simple
    var m = url.pathname.match(/^\/rutas\/([a-z0-9-]+)\//);
    Promise.all([fetch(url.href).then(function (r) { return r.ok ? r.text() : ''; }), routes()]).then(function (res) {
      if (!res[0]) return;
      var doc = new DOMParser().parseFromString(res[0], 'text/html');
      var l = String(doc.documentElement.lang || 'en').slice(0, 2);
      var tx = T[l] || T.en;
      var h1 = doc.querySelector('h1'), lead = doc.querySelector('p.lead');
      var d = {
        title: a.getAttribute('data-title') || (h1 ? h1.textContent.trim() : ''),
        lead: lead ? lead.textContent.trim() : '',
        st: m ? stats(res[1], m[1], tx) : tableRow(doc, a.getAttribute('data-title'), tx)
      };
      if (!d.title) return;
      var parent = a.parentNode, next = a.nextSibling;
      var box = build(a, d, tx);
      parent.insertBefore(box, next);
    }).catch(function () {});
  }

  function scan() {
    var list = document.querySelectorAll('a.wow-train-card');
    for (var i = 0; i < list.length; i++) render(list[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan); else scan();
})();
