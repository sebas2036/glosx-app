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
    en: { sat: 'Trains on Saturday', sun: 'Trains on Sunday', guide: 'Train travel guide', fast: 'Fastest', eyebrow: 'Train route', first: 'First train', last: 'Last train', n: 'Trains per weekday', avg: 'Typical journey', source: 'Official timetable', by: 'Shared by' },
    es: { sat: 'Trenes el sábado', sun: 'Trenes el domingo', guide: 'Guía de viaje en tren', fast: 'Más rápido', eyebrow: 'Ruta en tren', first: 'Primer tren', last: 'Último tren', n: 'Trenes por día laborable', avg: 'Duración habitual', source: 'Horario oficial', by: 'Compartido por' },
    fr: { sat: 'Trains le samedi', sun: 'Trains le dimanche', guide: 'Guide du voyage en train', fast: 'Le plus rapide', eyebrow: 'Itinéraire en train', first: 'Premier train', last: 'Dernier train', n: 'Trains par jour de semaine', avg: 'Durée habituelle', source: 'Horaire officiel', by: 'Partagé par' },
    it: { sat: 'Treni il sabato', sun: 'Treni la domenica', guide: 'Guida al viaggio in treno', fast: 'Il più veloce', eyebrow: 'Percorso in treno', first: 'Primo treno', last: 'Ultimo treno', n: 'Treni nei giorni feriali', avg: 'Durata abituale', source: 'Orario ufficiale', by: 'Condiviso da' },
    ja: { sat: '土曜日の本数', sun: '日曜日の本数', guide: '鉄道旅行ガイド', fast: '最速', eyebrow: '鉄道ルート', first: '始発', last: '終電', n: '平日の本数', avg: '標準的な所要時間', source: '公式時刻表', by: '提供' }
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

  // Atribución que pide la licencia: el paréntesis con CC BY / NLOD / CC0 / Licence (también paréntesis japoneses （）)
  function licenseOf(ps) {
    for (var j = 0; j < ps.length; j++) {
      var mm = ps[j].textContent.match(/[(（]([^()（）]*(?:CC BY|NLOD|CC0|Licen)[^()（）]*)[)）]/);
      if (mm) return mm[1].trim();
    }
    return '';
  }
  // "00:08 (+1)" es después de medianoche: cuenta como 24:08 al comparar
  function tkey(t) { return (/\(\+1\)/.test(t) ? 1440 : 0) + (parseInt(t, 10) * 60 + parseInt(t.slice(3, 5), 10)); }
  function clip(t) { t = t.replace(/\s+/g, ' ').trim(); return t.length > 240 ? t.slice(0, 237).replace(/\s+\S*$/, '') + '…' : t; }

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
      n += v.n; if (tkey(v.first) < tkey(first)) first = v.first; if (tkey(v.last) > tkey(last)) last = v.last; med.push(v.median_min);
      var f = j.feeds && j.feeds[s];
      if (f) src.push(f.name + (f.license ? ' (' + f.license + ')' : ''));
    });
    if (!n) return null;
    var dayN = function (d) { var t = r.dirs[key][d], c = 0; if (t) Object.keys(t).forEach(function (s) { c += t[s].n || 0; }); return c; };
    var sat = dayN('saturday'), sun = dayN('sunday');
    return { rows: [[tx.first, first], [tx.last, last], [tx.n, String(n)]].concat(sat ? [[tx.sat, String(sat)]] : []).concat(sun ? [[tx.sun, String(sun)]] : []).concat([[tx.avg, hm(Math.min.apply(null, med))]]), source: tx.source + ': ' + src.join(', ') };
  }

  // Tablas por país: la fila de la conexión (Viaje | | Primer tren | Último tren | Laborable | Sábado | Domingo | Más rápido)
  function tableRow(doc, title, tx) {
    if (!title) return null;
    var trs = doc.querySelectorAll('main.hx table tbody tr');
    for (var i = 0; i < trs.length; i++) {
      var td = trs[i].children;
      if (td.length < 8 || td[0].textContent.trim() !== title) continue;
      var src = licenseOf(doc.querySelectorAll('main.hx p'));
      return { rows: [[tx.first, td[2].textContent.trim()], [tx.last, td[3].textContent.trim()], [tx.n, td[4].textContent.trim()], [tx.sat, td[5].textContent.trim()], [tx.sun, td[6].textContent.trim()], [tx.fast, td[7].textContent.trim()]], source: tx.source + ': ' + src };
    }
    return null;
  }

  // Datos clave de la página: primeras respuestas de su FAQ (JSON-LD), primera oración de cada una, sin menciones de terceros
  // Foto de portada de la página: fondo del hero (rutas y blog) o og:image si no es la genérica del sitio
  function heroImg(doc) {
    var e = doc.querySelector('.route-hero, .blog-hero, [class*="hero"][style*="url("]');
    var m = e && (e.getAttribute('style') || '').match(/url\(['"]?([^'")]+)/);
    var u = m ? m[1] : '';
    if (!u) {   // las rutas la llevan en la regla .route-hero del <style>
      var css = Array.prototype.map.call(doc.querySelectorAll('style'), function (x) { return x.textContent; }).join(' ');
      var h = css.match(/\.route-hero\s*\{[^}]*url\(['"]?([^'")]+)/);
      if (h) u = h[1];
    }
    if (!u) { var og = doc.querySelector('meta[property="og:image"]'); u = og ? og.getAttribute('content') : ''; }
    if (!/^https:\/\//.test(u) || /hero-bg\.jpg/.test(u)) return '';
    if (/images\.pexels\.com/.test(u)) u = u.replace(/\?.*$/, '') + '?auto=compress&cs=tinysrgb&w=800';
    return u;
  }

  function facts(doc, lead) {
    var out = [];
    var walk = function (o) {
      if (!o || typeof o !== 'object' || out.length >= 5) return;
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (o['@type'] === 'FAQPage' && Array.isArray(o.mainEntity)) {
        o.mainEntity.forEach(function (q) {
          if (out.length >= 5 || !q || !q.acceptedAnswer) return;
          var t = String(q.acceptedAnswer.text || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
          // primera oración; si es un "Sí." o "Depende…" se suma la segunda, que es la que trae el dato
          var m = t.match(/^(.+?[.!?。！？])(\s|$)(.+?[.!?。！？])?/);
          t = m ? (m[1].length < 45 && m[3] ? m[1] + ' ' + m[3] : m[1]) : t;
          if (t.length < 25) return;
          if (!t || /omio|klook|booking/i.test(t)) return;
          // respuestas de relleno ("mira el horario en vivo", "sí, se puede ir en tren") no aportan a la ficha
          if (/en vivo|live schedule|en direct|in tempo reale|リアルタイム|se cubre en tren|is covered by train|desservi en train|coperto in treno|cambian según|vary by|change by day|varient selon|variano in base/i.test(t)) return;
          var nums = t.match(/\d+/g);
          if (lead && nums && nums.every(function (n) { return lead.indexOf(n) > -1; })) return;   // ya lo dice el resumen
          if (t.length > 170) t = t.slice(0, 167).replace(/\s+\S*$/, '') + '…';
          var qn = String(q.name || '').replace(/\s+/g, ' ').trim();
          if (qn.length > 90) qn = '';
          out.push([qn, t]);
        });
        return;
      }
      Object.keys(o).forEach(function (k) { walk(o[k]); });
    };
    var ss = doc.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < ss.length; i++) { try { walk(JSON.parse(ss[i].textContent)); } catch (e) {} }
    return out;
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
    if (d.img) {
      var im = el('img', 'display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:10px;margin:0 0 12px;border:0');
      im.src = d.img; im.alt = d.title; im.loading = 'lazy';
      box.appendChild(im);
    }
    box.appendChild(el('p', 'margin:0 0 4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:#C10016', d.article ? tx.guide : tx.eyebrow));
    box.appendChild(el('p', 'margin:0 0 8px;font-size:18px;font-weight:700;color:#14151a', d.title));
    if (d.lead) box.appendChild(el('p', 'margin:0 0 12px;font-size:14px;color:#44454d', d.lead));
    if (d.facts && d.facts.length) {
      var ul = el('ul', 'margin:0 0 12px;padding:0;list-style:none;font-size:13px;color:#44454d');
      d.facts.forEach(function (f) {
        var li = el('li', 'margin:0 0 6px');
        if (f[0]) { li.appendChild(el('b', 'display:block;font-weight:600;color:#14151a', f[0])); }
        li.appendChild(document.createTextNode(f[1]));
        ul.appendChild(li);
      });
      box.appendChild(ul);
    }
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
    // sello de la marca al pie de cada ficha
    var seal = el('div', 'display:flex;align-items:center;justify-content:flex-end;gap:8px;margin:12px 0 0;padding-top:10px;border-top:1px solid #ececef');
    var lg = el('img', 'width:26px;height:26px;border-radius:6px;display:block;border:0');
    lg.src = ORIGIN + '/logo.png'; lg.alt = 'WoW Train'; lg.width = 26; lg.height = 26;
    seal.appendChild(lg);
    seal.appendChild(el('span', 'font-size:12px;font-weight:600;letter-spacing:.02em;color:#2b2c33', 'WoW Train · glosx.app'));
    // candado: el sello vive en un shadow root (el CSS del blog no entra) y el contenedor lleva estilos
    // en línea con !important, que le ganan a cualquier regla de la hoja de estilos del blog
    var host = document.createElement('div');
    host.style.cssText = 'display:block!important;visibility:visible!important;opacity:1!important;height:auto!important;max-height:none!important;overflow:visible!important;position:static!important;clip:auto!important;clip-path:none!important;transform:none!important;filter:none!important;margin:0!important;padding:0!important';
    if (host.attachShadow) { host.attachShadow({ mode: 'closed' }).appendChild(seal); } else { host.appendChild(seal); }
    box.appendChild(host);
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
    Promise.all([fetch(url.href).then(function (r) { return r.ok ? r.text() : ''; }), m ? routes() : null]).then(function (res) {
      if (!res[0]) return;
      var doc = new DOMParser().parseFromString(res[0], 'text/html');
      var l = String(doc.documentElement.lang || 'en').slice(0, 2);
      var tx = T[l] || T.en;
      var h1 = doc.querySelector('h1'), lead = doc.querySelector('p.lead');
      var d = {
        title: a.getAttribute('data-title') || (h1 ? h1.textContent.trim() : ''),
        article: /\/blog-[^/]+\.html$/.test(url.pathname),
        lead: lead ? clip(lead.textContent) : '',
        facts: facts(doc, lead ? lead.textContent : ''),
        img: heroImg(doc),
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
  // Blogs que cargan el contenido después (temas con navegación por JS, páginas infinitas): volver a buscar enlaces nuevos
  if (window.MutationObserver) new MutationObserver(function () { scan(); }).observe(document.documentElement, { childList: true, subtree: true });
})();
