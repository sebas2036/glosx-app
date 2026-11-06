/*
 * "Lleva esta ruta a tu blog": ficha insertable para blogueros.
 *
 * En las páginas de ruta, antes de las preguntas frecuentes, muestra una vista previa de una ficha con
 * el resumen real de la ruta (h1 + párrafo .lead) y, si la ruta tiene horario oficial en
 * /assets/data/horarios-rutas.json, primer tren, último tren y trenes por día con la fuente citada.
 * El botón copia el HTML de la ficha con estilos en línea (se ve igual en WordPress, Ghost, etc.).
 * Al pie va "Horarios: WoW Train (glosx.app)" enlazando a esta misma ruta: el enlace es de marca y
 * nunca se le pide a nadie; llega solo si la ficha le sirve al blogger.
 *
 * En las tablas por país (.hx table) añade un botón "Insertar" por fila con la misma ficha.
 */
(function () {
  'use strict';

  var T = {
    en: { title: 'Add this route to your blog', sub: 'Writing about this route? Tell us your blog and take this card with live times, free.', url: 'Your blog (URL)', name: 'Your name or brand', get: 'Get my card', bad: 'Enter your blog address (https://...) and your name.', ready: 'Paste this code into your post. The card shows up with the link to WoW Train; keep both together.', by: 'Shared by', copy: 'Copy code', copied: 'Code copied', preview: 'Preview', eyebrow: 'Train route', first: 'First train', last: 'Last train', n: 'Trains per weekday', avg: 'Typical journey', credit: 'Times', guide: 'Route guide', source: 'Official timetable', insert: 'Insert', close: 'Close', fastest: 'Fastest' },
    es: { title: 'Lleva esta ruta a tu blog', sub: '¿Escribes sobre esta ruta? Dinos tu blog y llévate esta ficha con horarios actualizados, gratis.', url: 'Tu blog (URL)', name: 'Tu nombre o marca', get: 'Obtener mi ficha', bad: 'Escribe la dirección de tu blog (https://...) y tu nombre.', ready: 'Pega este código en tu artículo. La ficha aparece junto con el enlace a WoW Train; mantenlos juntos.', by: 'Compartido por', copy: 'Copiar código', copied: 'Código copiado', preview: 'Vista previa', eyebrow: 'Ruta en tren', first: 'Primer tren', last: 'Último tren', n: 'Trenes por día laborable', avg: 'Duración habitual', credit: 'Horarios', guide: 'Guía de la ruta', source: 'Horario oficial', insert: 'Insertar', close: 'Cerrar', fastest: 'Más rápido' },
    fr: { title: 'Ajoutez cet itinéraire à votre blog', sub: 'Vous écrivez sur cet itinéraire ? Indiquez votre blog et emportez cette fiche aux horaires à jour, gratuitement.', url: 'Votre blog (URL)', name: 'Votre nom ou marque', get: 'Obtenir ma fiche', bad: 'Indiquez l’adresse de votre blog (https://...) et votre nom.', ready: 'Collez ce code dans votre article. La fiche s’affiche avec le lien vers WoW Train ; gardez-les ensemble.', by: 'Partagé par', copy: 'Copier le code', copied: 'Code copié', preview: 'Aperçu', eyebrow: 'Itinéraire en train', first: 'Premier train', last: 'Dernier train', n: 'Trains par jour de semaine', avg: 'Durée habituelle', credit: 'Horaires', guide: 'Guide de l’itinéraire', source: 'Horaire officiel', insert: 'Insérer', close: 'Fermer', fastest: 'Le plus rapide' },
    it: { title: 'Porta questo percorso sul tuo blog', sub: 'Scrivi di questo percorso? Indica il tuo blog e porta via questa scheda con orari aggiornati, gratis.', url: 'Il tuo blog (URL)', name: 'Il tuo nome o marchio', get: 'Ottieni la mia scheda', bad: 'Inserisci l’indirizzo del tuo blog (https://...) e il tuo nome.', ready: 'Incolla questo codice nel tuo articolo. La scheda appare insieme al link a WoW Train; tienili insieme.', by: 'Condiviso da', copy: 'Copia il codice', copied: 'Codice copiato', preview: 'Anteprima', eyebrow: 'Percorso in treno', first: 'Primo treno', last: 'Ultimo treno', n: 'Treni nei giorni feriali', avg: 'Durata abituale', credit: 'Orari', guide: 'Guida al percorso', source: 'Orario ufficiale', insert: 'Inserisci', close: 'Chiudi', fastest: 'Il più veloce' },
    ja: { title: 'このルートをあなたのブログに', sub: 'このルートについて書いていますか？ブログを教えていただければ、最新の時刻入りカードを無料でお使いいただけます。', url: 'ブログのURL', name: 'お名前またはブランド', get: 'カードを取得', bad: 'ブログのアドレス（https://...）とお名前を入力してください。', ready: 'このコードを記事に貼り付けてください。カードはWoW Trainへのリンクと一緒に表示されます。両方をそのまま残してください。', by: '提供', copy: 'コードをコピー', copied: 'コピーしました', preview: 'プレビュー', eyebrow: '鉄道ルート', first: '始発', last: '終電', n: '平日の本数', avg: '標準的な所要時間', credit: '時刻', guide: 'ルートガイド', source: '公式時刻表', insert: '埋め込む', close: '閉じる', fastest: '最速' }
  };

  var l = String(document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
  var tx = T[l] || T.en;
  var FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function hm(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return h ? h + ' h ' + (m < 10 ? '0' : '') + m : m + ' min';
  }
  function canonical() {
    var c = document.querySelector('link[rel="canonical"]');
    return c ? c.href : location.href.split('#')[0].split('?')[0];
  }

  // Ficha que se lleva el blogger: estilos en línea, sin dependencias, sin emojis.
  function cardHTML(d) {
    var rows = '';
    (d.stats || []).forEach(function (s) {
      rows += '<tr><td style="padding:6px 0;color:#55565f;font-size:13px">' + esc(s[0]) + '</td>' +
        '<td style="padding:6px 0;text-align:right;font-weight:600;font-size:13px;color:#14151a">' + esc(s[1]) + '</td></tr>';
    });
    return '<div style="box-sizing:border-box;max-width:520px;margin:20px auto;padding:18px 20px;background:#ffffff;' +
      'border:1px solid #e6e2db;border-radius:14px;font-family:' + FONT + ';color:#14151a;line-height:1.5">' +
      '<p style="margin:0 0 4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:#C10016">' + esc(tx.eyebrow) + '</p>' +
      '<p style="margin:0 0 8px;font-size:18px;font-weight:700">' + esc(d.title) + '</p>' +
      (d.lead ? '<p style="margin:0 0 12px;font-size:14px;color:#44454d">' + esc(d.lead) + '</p>' : '') +
      (rows ? '<table style="width:100%;border-collapse:collapse;margin:0 0 12px;border-top:1px solid #efece6">' + rows + '</table>' : '') +
      '<p style="margin:0;font-size:12px;color:#6b6c75">' + esc(rows ? tx.credit : tx.guide) + ': <a href="' + esc(d.url) + '" style="color:#C10016;font-weight:600;text-decoration:none">WoW Train (glosx.app)</a>' +
      (d.source ? ' &middot; ' + esc(d.source) : '') + '</p></div>';
  }

  function copy(text, btn) {
    function done() {
      btn.textContent = tx.copied;
      btn.classList.add('is-done');
      setTimeout(function () { btn.textContent = tx.copy; btn.classList.remove('is-done'); }, 2200);
      if (window.gtag) window.gtag('event', 'embed_copy', { page_path: location.pathname });
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
  }

  function css() {
    if (document.getElementById('rte-style')) return;
    var st = document.createElement('style');
    st.id = 'rte-style';
    st.textContent =
      '.rte{margin:32px 0;padding:20px 22px;border:1px solid rgba(20,21,26,.12);border-radius:16px;background:#fff;color:#14151a;font-family:inherit}' +
      '.rte h2.rte-h{font-size:18px;margin:0 0 4px;color:#14151a}' +
      '.rte-sub{margin:0 0 14px;font-size:14px;color:#55565f;line-height:1.5}' +
      '.rte-prev{margin:0 0 14px;padding:4px 10px;background:#faf8f5;border-radius:12px}' +
      '.rte-prev-l{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6b6c75;font-weight:700;margin:8px 0 0}' +
      '.rte-btn{font:inherit;font-size:14px;font-weight:700;color:#fff;background:#C10016;border:0;border-radius:999px;padding:10px 20px;cursor:pointer}' +
      '.rte-btn:hover{background:#A8000F}.rte-btn.is-done{background:#14151a}' +
      '.rte-btn:focus-visible,.rte-ins:focus-visible{outline:2px solid #14151a;outline-offset:2px}' +
      '.rte-ins{font:inherit;font-size:12px;font-weight:600;color:#C10016;background:none;border:1px solid rgba(193,0,22,.35);border-radius:999px;padding:3px 10px;cursor:pointer}' +
      '.rte-ins:hover{background:#fff4f4}' +
      '.rte-ov{position:fixed;inset:0;z-index:2147483000;background:rgba(20,21,26,.55);display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto}' +
      '.rte-box{position:relative;width:min(560px,100%);max-height:100%;overflow-y:auto}' +
      '.rte-box .rte{margin:0}' +
      '.rte-x{position:absolute;top:8px;right:10px;z-index:1;font:inherit;font-size:24px;line-height:1;border:0;background:none;color:#55565f;cursor:pointer;padding:4px 8px}' +
      '.rte-form{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 10px}.rte-in{flex:1 1 200px;min-width:0;font:inherit;font-size:14px;padding:10px 14px;border:1px solid rgba(20,21,26,.18);border-radius:10px;background:#faf8f5;color:#14151a}' +
      '.rte-in:focus{outline:2px solid #14151a;outline-offset:1px;background:#fff}.rte-err{color:#A8000F;font-size:13px;margin:0 0 10px}' +
      '.rte-out{margin-top:6px}.rte-code{box-sizing:border-box;width:100%;font:12px/1.5 ui-monospace,Menlo,monospace;padding:10px 12px;border:1px solid rgba(20,21,26,.14);border-radius:10px;background:#faf8f5;color:#44454d;margin:0 0 10px;resize:vertical}' +
      '@media (max-width:600px){.rte{padding:16px}.rte-btn{width:100%}}';
    document.head.appendChild(st);
  }

  // Caja de llenado: sin blog y nombre no hay código; el código es el enlace a glosx.app + embed.js,
  // y la ficha solo se dibuja si ese enlace está y en el blog registrado (ver /embed.js).
  function block(d, compact) {
    var el = document.createElement('section');
    el.className = 'rte';
    el.setAttribute('aria-label', tx.title);
    el.innerHTML = (compact ? '' : '<h2 class="rte-h">' + esc(tx.title) + '</h2>') +
      '<p class="rte-sub">' + esc(tx.sub) + '</p>' +
      '<form class="rte-form" novalidate>' +
        '<input class="rte-in" type="url" name="u" placeholder="' + esc(tx.url) + '" aria-label="' + esc(tx.url) + '" required>' +
        '<input class="rte-in" type="text" name="n" maxlength="60" placeholder="' + esc(tx.name) + '" aria-label="' + esc(tx.name) + '" required>' +
        '<button type="submit" class="rte-btn">' + esc(tx.get) + '</button>' +
      '</form><p class="rte-err" role="alert" hidden></p><div class="rte-out" hidden></div>';
    var form = el.querySelector('form'), err = el.querySelector('.rte-err'), out = el.querySelector('.rte-out');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = form.u.value.trim(), name = form.n.value.trim().replace(/[<>"]/g, '').slice(0, 60), host = '';
      if (raw && !/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
      try { var u = new URL(raw); if (/^https?:$/.test(u.protocol) && u.hostname.indexOf('.') > 0) host = u.hostname.toLowerCase().replace(/^www\./, ''); } catch (x) {}
      if (!host || !name) { err.textContent = tx.bad; err.hidden = false; return; }
      err.hidden = true;
      var code = '<a class="wow-train-card" href="' + esc(d.url) + '" data-site="' + esc(host) + '" data-by="' + esc(name) + '"' +
        (d.titleAttr ? ' data-title="' + esc(d.titleAttr) + '"' : '') + '>' + esc(d.stats ? tx.credit : tx.guide) + ': WoW Train (glosx.app)</a>\n' +
        '<script src="https://glosx.app/embed.js" async></' + 'script>';
      var prev = cardHTML(d).replace(/<\/div>$/, '<p style="margin:6px 0 0;font-size:12px;color:#6b6c75">' + esc(tx.by + ' ' + name) + '</p></div>');
      out.innerHTML = '<div class="rte-prev"><span class="rte-prev-l">' + esc(tx.preview) + '</span>' + prev + '</div>' +
        '<p class="rte-sub">' + esc(tx.ready) + '</p><textarea class="rte-code" readonly rows="4"></textarea>' +
        '<button type="button" class="rte-btn">' + esc(tx.copy) + '</button>';
      out.querySelector('.rte-code').value = code;
      out.hidden = false;
      var btn = out.querySelector('.rte-btn');
      btn.addEventListener('click', function () { copy(code, btn); });
      if (window.gtag) window.gtag('event', 'embed_register', { blog_host: host, blog_brand: name, page_path: location.pathname });
    });
    return el;
  }

  // ---- páginas de ruta ----
  function routeSlug() {
    var m = location.pathname.match(/\/rutas\/([a-z0-9-]+)\//);
    return m ? m[1] : null;
  }

  // Suma las fuentes del día laborable para la dirección que coincide con el título.
  function officialStats(json, slug, h1) {
    var r = json && json.routes && json.routes[slug];
    if (!r || !r.dirs) return null;
    var keys = Object.keys(r.dirs);
    var head = slug.split('-')[0];
    var key = keys.filter(function (k) { return k.toLowerCase().replace(/[^a-z]/g, '').indexOf(head) === 0; })[0] || keys[0];
    var wk = r.dirs[key] && r.dirs[key].weekday;
    if (!wk) return null;
    var n = 0, first = '99:99', last = '00:00', med = [], src = [];
    Object.keys(wk).forEach(function (s) {
      var v = wk[s];
      n += v.n; if (v.first < first) first = v.first; if (v.last > last) last = v.last; med.push(v.median_min);
      var f = json.feeds && json.feeds[s];
      if (f) src.push(f.name + (f.license ? ' (' + f.license + ')' : ''));
    });
    if (!n) return null;
    return {
      stats: [[tx.first, first], [tx.last, last], [tx.n, String(n)], [tx.avg, hm(Math.min.apply(null, med))]],
      source: tx.source + ': ' + src.join(', ')
    };
  }

  function initRoute() {
    var slug = routeSlug();
    var faq = null;
    var hs = document.querySelectorAll('h2');
    var FAQ = /^(Frequently asked questions|Preguntas frecuentes|Questions fréquentes|Domande frequenti|よくある質問)$/;
    for (var i = 0; i < hs.length; i++) if (FAQ.test(hs[i].textContent.trim())) { faq = hs[i]; break; }
    var h1 = document.querySelector('h1');
    if (!slug || !faq || !h1) return;
    var lead = document.querySelector('p.lead');
    var title = h1.textContent.trim();
    var d = {
      title: title,
      route: title.replace(/\s+(by train|en tren|en train|in treno)$/i, ''),
      lead: lead ? lead.textContent.trim() : '',
      url: canonical()
    };
    css();
    var place = function (extra) {
      if (extra) { d.stats = extra.stats; d.source = extra.source; }
      faq.parentNode.insertBefore(block(d), faq);
    };
    fetch('/assets/data/horarios-rutas.json').then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { place(officialStats(j, slug, title)); }, function () { place(null); });
  }

  // ---- tablas por país (.hx table: Viaje | | Primer tren | Último tren | Laborable | Sábado | Domingo | Más rápido) ----
  function initTables() {
    var table = document.querySelector('main.hx .tw table');
    if (!table) return;
    var src = '';
    var ps = document.querySelectorAll('main.hx p');
    for (var i = 0; i < ps.length; i++) if (/CC BY|NLOD|CC0|Licen|licen/.test(ps[i].textContent) && ps[i].textContent.length < 160) {
      var m = ps[i].textContent.match(/\(([^)]+)\)/);  // "(Datenquelle: ÖBB, CC BY 4.0)" → la atribución que pide la licencia
      src = tx.source + ': ' + (m ? m[1] : ps[i].textContent.replace(/^[^:]*:\s*/, '')).trim().replace(/\.$/, '');
      break;
    }
    var head = table.querySelectorAll('thead th');
    var lab = [];
    for (var j = 0; j < head.length; j++) lab.push(head[j].textContent.trim());
    css();
    var url = canonical();
    Array.prototype.forEach.call(table.querySelectorAll('tbody tr'), function (tr) {
      var td = tr.children;
      if (td.length < 8 || !td[1]) return;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'rte-ins'; b.textContent = tx.insert;
      td[1].appendChild(b);
      b.addEventListener('click', function () {
        var route = td[0].textContent.trim();
        var d = {
          title: route, titleAttr: route, route: route, lead: '', url: url, source: src,
          stats: [[tx.first, td[2].textContent.trim()], [tx.last, td[3].textContent.trim()], [tx.n, td[4].textContent.trim()], [tx.fastest, td[7].textContent.trim()]]
        };
        modal(block(d), b);
      });
    });
  }

  // Ventana centrada (la tabla es más ancha que el móvil y la ficha no cabe dentro de una fila).
  function modal(content, opener) {
    var ov = document.createElement('div');
    ov.className = 'rte-ov';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    var box = document.createElement('div');
    box.className = 'rte-box';
    var x = document.createElement('button');
    x.type = 'button'; x.className = 'rte-x'; x.setAttribute('aria-label', tx.close); x.textContent = '×';
    box.appendChild(x); box.appendChild(content); ov.appendChild(box);
    document.body.appendChild(ov);
    function close() { ov.remove(); document.removeEventListener('keydown', key); if (opener) opener.focus(); }
    function key(e) { if (e.key === 'Escape') close(); }
    x.addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', key);
    content.querySelector('.rte-btn').focus();
  }

  function init() { if (routeSlug()) initRoute(); else initTables(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
