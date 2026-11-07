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
    en: { sat: 'Trains on Saturday', sun: 'Trains on Sunday', titleA: 'Add this guide to your blog', subA: 'Writing about this? Tell us your blog and take this card with a link to our guide, free.', eyebrowA: 'Train travel guide', title: 'Add this route to your blog', sub: 'Writing about this route? Tell us your blog and take this card with live times, free.', url: 'Your blog (URL)', name: 'Your name or brand', get: 'Get my card', bad: 'Enter your blog address (https://...) and your name.', ready: 'Paste this code into your post. The card shows up with the link to WoW Train; keep both together.', by: 'Shared by', copy: 'Copy code', copied: 'Code copied', preview: 'Preview', eyebrow: 'Train route', first: 'First train', last: 'Last train', n: 'Trains per weekday', avg: 'Typical journey', credit: 'Times', guide: 'Route guide', source: 'Official timetable', insert: 'Insert', close: 'Close', fastest: 'Fastest' },
    es: { sat: 'Trenes el sábado', sun: 'Trenes el domingo', titleA: 'Lleva esta guía a tu blog', subA: '¿Escribes sobre este tema? Dinos tu blog y llévate esta ficha con enlace a nuestra guía, gratis.', eyebrowA: 'Guía de viaje en tren', title: 'Lleva esta ruta a tu blog', sub: '¿Escribes sobre esta ruta? Dinos tu blog y llévate esta ficha con horarios actualizados, gratis.', url: 'Tu blog (URL)', name: 'Tu nombre o marca', get: 'Obtener mi ficha', bad: 'Escribe la dirección de tu blog (https://...) y tu nombre.', ready: 'Pega este código en tu artículo. La ficha aparece junto con el enlace a WoW Train; mantenlos juntos.', by: 'Compartido por', copy: 'Copiar código', copied: 'Código copiado', preview: 'Vista previa', eyebrow: 'Ruta en tren', first: 'Primer tren', last: 'Último tren', n: 'Trenes por día laborable', avg: 'Duración habitual', credit: 'Horarios', guide: 'Guía de la ruta', source: 'Horario oficial', insert: 'Insertar', close: 'Cerrar', fastest: 'Más rápido' },
    fr: { sat: 'Trains le samedi', sun: 'Trains le dimanche', titleA: 'Ajoutez ce guide à votre blog', subA: 'Vous écrivez sur ce sujet ? Indiquez votre blog et emportez cette fiche avec le lien vers notre guide, gratuitement.', eyebrowA: 'Guide du voyage en train', title: 'Ajoutez cet itinéraire à votre blog', sub: 'Vous écrivez sur cet itinéraire ? Indiquez votre blog et emportez cette fiche aux horaires à jour, gratuitement.', url: 'Votre blog (URL)', name: 'Votre nom ou marque', get: 'Obtenir ma fiche', bad: 'Indiquez l’adresse de votre blog (https://...) et votre nom.', ready: 'Collez ce code dans votre article. La fiche s’affiche avec le lien vers WoW Train ; gardez-les ensemble.', by: 'Partagé par', copy: 'Copier le code', copied: 'Code copié', preview: 'Aperçu', eyebrow: 'Itinéraire en train', first: 'Premier train', last: 'Dernier train', n: 'Trains par jour de semaine', avg: 'Durée habituelle', credit: 'Horaires', guide: 'Guide de l’itinéraire', source: 'Horaire officiel', insert: 'Insérer', close: 'Fermer', fastest: 'Le plus rapide' },
    it: { sat: 'Treni il sabato', sun: 'Treni la domenica', titleA: 'Porta questa guida sul tuo blog', subA: 'Scrivi di questo tema? Indica il tuo blog e porta via questa scheda con il link alla nostra guida, gratis.', eyebrowA: 'Guida al viaggio in treno', title: 'Porta questo percorso sul tuo blog', sub: 'Scrivi di questo percorso? Indica il tuo blog e porta via questa scheda con orari aggiornati, gratis.', url: 'Il tuo blog (URL)', name: 'Il tuo nome o marchio', get: 'Ottieni la mia scheda', bad: 'Inserisci l’indirizzo del tuo blog (https://...) e il tuo nome.', ready: 'Incolla questo codice nel tuo articolo. La scheda appare insieme al link a WoW Train; tienili insieme.', by: 'Condiviso da', copy: 'Copia il codice', copied: 'Codice copiato', preview: 'Anteprima', eyebrow: 'Percorso in treno', first: 'Primo treno', last: 'Ultimo treno', n: 'Treni nei giorni feriali', avg: 'Durata abituale', credit: 'Orari', guide: 'Guida al percorso', source: 'Orario ufficiale', insert: 'Inserisci', close: 'Chiudi', fastest: 'Il più veloce' },
    ja: { sat: '土曜日の本数', sun: '日曜日の本数', titleA: 'このガイドをあなたのブログに', subA: 'このテーマについて書いていますか？ブログを教えていただければ、ガイドへのリンク付きカードを無料でお使いいただけます。', eyebrowA: '鉄道旅行ガイド', title: 'このルートをあなたのブログに', sub: 'このルートについて書いていますか？ブログを教えていただければ、最新の時刻入りカードを無料でお使いいただけます。', url: 'ブログのURL', name: 'お名前またはブランド', get: 'カードを取得', bad: 'ブログのアドレス（https://...）とお名前を入力してください。', ready: 'このコードを記事に貼り付けてください。カードはWoW Trainへのリンクと一緒に表示されます。両方をそのまま残してください。', by: '提供', copy: 'コードをコピー', copied: 'コピーしました', preview: 'プレビュー', eyebrow: '鉄道ルート', first: '始発', last: '終電', n: '平日の本数', avg: '標準的な所要時間', credit: '時刻', guide: 'ルートガイド', source: '公式時刻表', insert: '埋め込む', close: '閉じる', fastest: '最速' }
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
  // "00:08 (+1)" es después de medianoche (igual que embed.js)
  function tkey(t) { return (/\(\+1\)/.test(t) ? 1440 : 0) + (parseInt(t, 10) * 60 + parseInt(t.slice(3, 5), 10)); }
  function clip(t) { t = t.replace(/\s+/g, ' ').trim(); return t.length > 240 ? t.slice(0, 237).replace(/\s+\S*$/, '') + '…' : t; }
  function canonical() {
    var c = document.querySelector('link[rel="canonical"]');
    return c ? c.href : location.href.split('#')[0].split('?')[0];
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

  // Ficha que se lleva el blogger: estilos en línea, sin dependencias, sin emojis.
  function cardHTML(d) {
    var rows = '';
    (d.stats || []).forEach(function (s) {
      rows += '<tr><td style="padding:6px 0;color:#55565f;font-size:13px">' + esc(s[0]) + '</td>' +
        '<td style="padding:6px 0;text-align:right;font-weight:600;font-size:13px;color:#14151a">' + esc(s[1]) + '</td></tr>';
    });
    return '<div style="box-sizing:border-box;max-width:520px;margin:20px auto;padding:18px 20px;background:#ffffff;' +
      'border:1px solid #e6e2db;border-radius:14px;font-family:' + FONT + ';color:#14151a;line-height:1.5">' +
      (d.img ? '<img src="' + esc(d.img) + '" alt="' + esc(d.title) + '" loading="lazy" style="display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:10px;margin:0 0 12px;border:0">' : '') +
      '<div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;margin:-4px 0 12px">' +
      '<img src="/logo.png" alt="WoW Train" width="26" height="26" style="width:26px;height:26px;border-radius:6px;display:block;border:0;margin:0">' +
      '<span style="font-size:12px;font-weight:600;letter-spacing:.02em;color:#2b2c33">WoW Train · glosx.app</span></div>' +
      '<p style="margin:0 0 4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:#C10016">' + esc(d.eyebrow || tx.eyebrow) + '</p>' +
      '<p style="margin:0 0 8px;font-size:18px;font-weight:700">' + esc(d.title) + '</p>' +
      (d.lead ? '<p style="margin:0 0 12px;font-size:14px;color:#44454d">' + esc(d.lead) + '</p>' : '') +
      ((d.facts || []).length ? '<ul style="margin:0 0 12px;padding:0;list-style:none;font-size:13px;color:#44454d">' + d.facts.map(function (f) { return '<li style="margin:0 0 6px">' + (f[0] ? '<b style="display:block;font-weight:600;color:#14151a">' + esc(f[0]) + '</b>' : '') + esc(f[1]) + '</li>'; }).join('') + '</ul>' : '') +
      (rows ? '<table style="width:100%;border-collapse:collapse;margin:0 0 12px;border-top:1px solid #efece6">' + rows + '</table>' : '') +
      '<p style="margin:0;font-size:12px;color:#6b6c75">' + esc(rows ? tx.credit : (d.article ? tx.eyebrowA : tx.guide)) + ': <a href="' + esc(d.url) + '" style="color:#C10016;font-weight:600;text-decoration:none">WoW Train (glosx.app)</a>' +
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
      try { if (document.execCommand('copy')) done(); } catch (e) {}
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
      '.rte-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:16px 0;padding:12px 16px;border:1px solid rgba(20,21,26,.12);border-radius:14px;background:#fff;font-size:15px;font-weight:600;color:#14151a}' +
      '.rte-bar-btn{font:inherit;font-size:13px;font-weight:700;color:#C10016;background:#fff;border:1px solid rgba(193,0,22,.4);border-radius:999px;padding:7px 14px;cursor:pointer}.rte-bar-btn:hover{background:#fff4f4}.rte-bar-btn:focus-visible{outline:2px solid #14151a;outline-offset:2px}' +
      '.rte-bar + .rte{margin-top:0}' +
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
    el.innerHTML = (compact ? '' : '<h2 class="rte-h">' + esc(d.article ? tx.titleA : tx.title) + '</h2>') +
      '<p class="rte-sub">' + esc(d.article ? tx.subA : tx.sub) + '</p>' +
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
        (d.titleAttr ? ' data-title="' + esc(d.titleAttr) + '"' : '') + '>' + esc(d.stats ? tx.credit : (d.article ? tx.eyebrowA : tx.guide)) + ': WoW Train (glosx.app)</a>\n' +
        '<script src="https://glosx.app/embed.js" async></' + 'script>';
      var prev = cardHTML(d).replace(/<\/div>$/, '<p style="margin:6px 0 0;font-size:12px;color:#6b6c75">' + esc(tx.by + ' ' + name) + '</p>' +
        '</div>');
      out.innerHTML = '<div class="rte-prev"><span class="rte-prev-l">' + esc(tx.preview) + '</span>' + prev + '</div>' +
        '<p class="rte-sub">' + esc(tx.ready) + '</p><textarea class="rte-code" readonly rows="4"></textarea>' +
        '<button type="button" class="rte-btn">' + esc(tx.copy) + '</button>';
      out.querySelector('.rte-code').value = code;
      out.hidden = false;
      var btn = out.querySelector('.rte-btn');
      btn.addEventListener('click', function () { copy(code, btn); });
      // Solo el dominio (dimensión estándar link_domain): nada de nombres ni URLs completas, GA4 no admite datos personales.
      // La marca queda en el código que pega el bloguero (data-by) y check-embeds.js la lee de su página.
      if (window.gtag) window.gtag('event', 'embed_register', { link_domain: host, page_path: location.pathname });
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
      n += v.n; if (tkey(v.first) < tkey(first)) first = v.first; if (tkey(v.last) > tkey(last)) last = v.last; med.push(v.median_min);
      var f = json.feeds && json.feeds[s];
      if (f) src.push(f.name + (f.license ? ' (' + f.license + ')' : ''));
    });
    if (!n) return null;
    var dayN = function (d) { var t = r.dirs[key][d], c = 0; if (t) Object.keys(t).forEach(function (s) { c += t[s].n || 0; }); return c; };
    var sat = dayN('saturday'), sun = dayN('sunday');
    return {
      stats: [[tx.first, first], [tx.last, last], [tx.n, String(n)]].concat(sat ? [[tx.sat, String(sat)]] : []).concat(sun ? [[tx.sun, String(sun)]] : []).concat([[tx.avg, hm(Math.min.apply(null, med))]]),
      source: tx.source + ': ' + src.join(', ')
    };
  }

  // Bloque completo antes de "before" y, bajo el resumen (lead), una barra corta que despliega la misma caja
  function mount(d, before, lead) {
    before.parentNode.insertBefore(block(d), before);
    if (!lead) return;
    var bar = document.createElement('div');
    bar.className = 'rte-bar';
    bar.innerHTML = '<span>' + esc(d.article ? tx.titleA : tx.title) + '</span><button type="button" class="rte-bar-btn" aria-expanded="false">' + esc(tx.get) + '</button>';
    var open = null;
    bar.querySelector('button').addEventListener('click', function () {
      if (open) { open.remove(); open = null; this.setAttribute('aria-expanded', 'false'); return; }
      open = block(d, true);
      bar.parentNode.insertBefore(open, bar.nextSibling);
      this.setAttribute('aria-expanded', 'true');
      open.querySelector('input').focus();
    });
    lead.parentNode.insertBefore(bar, lead.nextSibling);
  }

  // ---- artículos del blog: ficha con título, resumen y enlace al artículo (sin horarios) ----
  function initArticle() {
    var main = document.querySelector('main'), h1 = document.querySelector('h1');
    if (!main || !h1) return;
    var lead = main.querySelector('p.lead');
    var before = main.querySelector('.cta') || main.lastElementChild;
    if (!before) return;
    var txt = lead ? clip(lead.textContent) : '';
    css();
    mount({ article: true, eyebrow: tx.eyebrowA, title: h1.textContent.trim(), titleAttr: '', lead: txt, facts: facts(document, lead ? lead.textContent : ''), img: heroImg(document), url: canonical() }, before, lead);
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
      lead: lead ? clip(lead.textContent) : '',
      facts: facts(document, lead ? lead.textContent : ''),
      img: heroImg(document),
      url: canonical()
    };
    css();
    var place = function (extra) {
      if (extra) { d.stats = extra.stats; d.source = extra.source; }
      mount(d, faq, lead);
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
    // misma regla que embed.js (licenseOf): el paréntesis con la licencia, también （） en japonés
    for (var i = 0; i < ps.length; i++) {
      var m = ps[i].textContent.match(/[(（]([^()（）]*(?:CC BY|NLOD|CC0|Licen)[^()（）]*)[)）]/);
      if (m) { src = tx.source + ': ' + m[1].trim(); break; }
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
          stats: [[tx.first, td[2].textContent.trim()], [tx.last, td[3].textContent.trim()], [tx.n, td[4].textContent.trim()], [tx.sat, td[5].textContent.trim()], [tx.sun, td[6].textContent.trim()], [tx.fastest, td[7].textContent.trim()]]
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

  function init() { if (routeSlug()) initRoute(); else if (/\/blog-[^/]+\.html$/.test(location.pathname)) initArticle(); else initTables(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
