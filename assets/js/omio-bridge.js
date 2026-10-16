/*
 * Transición hacia Omio (Europa).
 *
 * Al pulsar un botón de reserva europeo (enlace o window.open hacia /affiliate/europe-train),
 * la pestaña nueva se abre al instante con una pantalla propia de glosx que se funde del tono
 * cálido de glosx al azul de la cabecera de Omio, mientras se carga la reserva. La pantalla se
 * redirige sola a Omio (el último fotograma coincide con el azul de Omio, sin corte).
 * La pestaña original queda en glosx con un aviso discreto para reabrir.
 *
 * Si el navegador bloquea la pestaña nueva, la misma transición se muestra en esta pestaña y
 * después se navega a Omio. Japón usa /affiliate/klook-train y no pasa por acá.
 */
(function () {
  'use strict';

  var MARK = '/affiliate/europe-train';
  var HOLD_MS = 1800;      // duración de la animación antes de redirigir
  var TOAST_MS = 6500;

  var T = {
    en: { title: 'Syncing your itinerary with Omio…', body: 'Loading your trip details securely for payment.', done: 'Omio opened in a new tab. Your route is already loaded.', fidelity: 'Our AI already did the planning: you won’t need to type your route again.', again: 'Open Omio again', close: 'Close', label: 'Booking transition' },
    es: { title: 'Sincronizando tu itinerario con Omio…', body: 'Cargando tus datos de viaje de forma segura para el pago.', done: 'Omio se abrió en una pestaña nueva. Tu ruta ya va cargada.', fidelity: 'Nuestra IA ya hizo el trabajo previo: no tendrás que escribir tu ruta de nuevo.', again: 'Abrir Omio de nuevo', close: 'Cerrar', label: 'Transición a la reserva' },
    fr: { title: 'Synchronisation de votre itinéraire avec Omio…', body: 'Chargement sécurisé de vos données de voyage pour le paiement.', done: 'Omio s’est ouvert dans un nouvel onglet. Votre trajet est déjà chargé.', fidelity: 'Notre IA a déjà fait le travail : vous n’aurez pas à ressaisir votre trajet.', again: 'Rouvrir Omio', close: 'Fermer', label: 'Transition vers la réservation' },
    de: { title: 'Deine Route wird mit Omio synchronisiert…', body: 'Deine Reisedaten werden sicher für die Zahlung geladen.', done: 'Omio wurde in einem neuen Tab geöffnet. Deine Route ist bereits geladen.', fidelity: 'Unsere KI hat die Planung schon erledigt: Du musst deine Route nicht erneut eingeben.', again: 'Omio erneut öffnen', close: 'Schließen', label: 'Übergang zur Buchung' },
    it: { title: 'Sincronizzazione del tuo itinerario con Omio…', body: 'Caricamento sicuro dei dati di viaggio per il pagamento.', done: 'Omio si è aperto in una nuova scheda. Il tuo percorso è già caricato.', fidelity: 'La nostra IA ha già fatto il lavoro: non dovrai riscrivere il tuo percorso.', again: 'Riapri Omio', close: 'Chiudi', label: 'Passaggio alla prenotazione' },
    pt: { title: 'A sincronizar o teu itinerário com a Omio…', body: 'A carregar os teus dados de viagem em segurança para o pagamento.', done: 'A Omio abriu num novo separador. O teu percurso já vai carregado.', fidelity: 'A nossa IA já fez o trabalho prévio: não precisas de escrever o teu percurso outra vez.', again: 'Abrir a Omio de novo', close: 'Fechar', label: 'Transição para a reserva' },
    ja: { title: 'Omioと旅程を同期しています…', body: '支払いのために旅行情報を安全に読み込んでいます。', done: 'Omioを新しいタブで開きました。経路はすでに入力済みです。', fidelity: 'AIが下準備を済ませました。経路を入力し直す必要はありません。', again: 'Omioをもう一度開く', close: '閉じる', label: '予約サイトへの移動' }
  };

  // Tarjeta de transición (la misma en la pestaña nueva y en el respaldo de esta pestaña)
  var CARD_CSS = [
    '.omb-card{width:min(440px,100%);box-sizing:border-box;background:rgba(255,255,255,.84);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#182C66;border:1px solid rgba(24,44,102,.14);border-radius:16px;padding:24px 24px 22px;box-shadow:0 18px 48px rgba(20,21,26,.22);font-family:"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;animation:ombIn .55s cubic-bezier(.2,.7,.2,1) both}',
    '.omb-brand{display:flex;align-items:center;gap:10px;margin:0 0 14px;font-size:22px;font-weight:700;letter-spacing:-.02em;color:#182C66}',
    '.omb-brand img{width:36px;height:36px;border-radius:10px;background:#fff;box-shadow:0 0 0 1px rgba(24,44,102,.12);padding:5px}',
    '.omb-route{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:20px;font-weight:600;letter-spacing:-.01em;margin:0 0 16px}',
    '.omb-route svg{width:18px;height:18px;flex:none;stroke:#FB6B6C;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.omb-title{font-size:15px;font-weight:600;margin:0 0 4px}',
    '.omb-body{font-size:14px;line-height:1.5;color:#4A5578;margin:0 0 16px}',
    '.omb-track{display:flex;align-items:center;gap:12px;margin:0 0 16px}',
    '.omb-node{flex:none;width:38px;height:38px;display:flex;align-items:center;justify-content:center}',
    '.omb-node.is-glosx{background:#C10016;color:#fff;border-radius:10px;font-weight:700;font-size:19px;animation:ombPulse 1.4s ease-in-out infinite}',
    '.omb-node.is-omio{width:42px;height:42px;background:#fff;border:2px solid #FB6B6C;border-radius:50%;animation:ombPulseCoral 1.4s ease-in-out infinite}',
    '.omb-node.is-omio img{width:24px;height:24px;border-radius:5px}',
    '.omb-bar{flex:1;height:5px;border-radius:5px;background:rgba(24,44,102,.12);overflow:hidden}',
    '.omb-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#C10016,#FB6B6C);border-radius:5px;animation:ombFill 1.7s cubic-bezier(.3,.6,.3,1) forwards}',
    '.omb-fid{font-size:13px;line-height:1.5;color:#182C66;background:#EEF3FB;border-radius:8px;padding:10px 12px;margin:0}',
    '@keyframes ombIn{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}',
    '@keyframes ombFill{from{width:6%}to{width:100%}}',
    '@keyframes ombPulse{0%,100%{box-shadow:0 0 0 0 rgba(193,0,22,.35)}50%{box-shadow:0 0 0 8px rgba(193,0,22,0)}}',
    '@keyframes ombPulseCoral{0%,100%{box-shadow:0 0 0 0 rgba(251,107,108,.45)}50%{box-shadow:0 0 0 9px rgba(251,107,108,0)}}',
    '@media (prefers-reduced-motion:reduce){.omb-card,.omb-node.is-glosx,.omb-node.is-omio{animation:none}.omb-bar i{animation:none;width:100%}}'
  ].join('');

  // Fondo: la cabecera de Omio (índigo a celeste) desde el primer fotograma, para generar confianza
  var BG_CSS = [
    '.bg1,.bg2{position:absolute;inset:0}',
    '.bg1{background:linear-gradient(160deg,#5C6898 0%,#779DCE 100%)}',
    '.bg2{background:radial-gradient(60% 50% at 50% 38%,rgba(255,255,255,.28) 0%,rgba(255,255,255,0) 70%);opacity:0;animation:ombGlow 1.8s ease-out forwards}',
    '@keyframes ombGlow{0%{opacity:0}100%{opacity:1}}',
    '@media (prefers-reduced-motion:reduce){.bg2{animation:none;opacity:1}}'
  ].join('');

  var PAGE_CSS = '*{box-sizing:border-box}html,body{height:100%;margin:0}' +
    'body{position:relative;display:flex;align-items:center;justify-content:center;padding:16px;overflow:hidden}.omb-card{position:relative}';

  var toast, toastTimer;

  function lang() {
    var l = String(document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return T[l] ? l : 'en';
  }

  function cityName(slug) {
    var list = window._GLOSX_CITIES || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].slug === slug && list[i].display) return String(list[i].display).split(' / ')[0];
    }
    return String(slug || '').replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function routeOf(url) {
    var q;
    try { q = new URL(url, location.href).searchParams; } catch (e) { return null; }
    return { from: cityName(q.get('from')), to: cityName(q.get('to')) };
  }

  function cardHTML(r, tx) {
    return '<div class="omb-card" role="status" aria-live="polite">' +
      '<div class="omb-brand"><img src="https://www.google.com/s2/favicons?sz=128&domain=omio.com" alt="" width="36" height="36"><span>Omio</span></div>' +
      '<p class="omb-route"><span>' + esc(r.from) + '</span>' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '<span>' + esc(r.to) + '</span></p>' +
      '<p class="omb-title">' + esc(tx.title) + '</p>' +
      '<p class="omb-body">' + esc(tx.body) + '</p>' +
      '<div class="omb-track" aria-hidden="true">' +
        '<span class="omb-node is-glosx">W</span>' +
        '<div class="omb-bar"><i></i></div>' +
        '<span class="omb-node is-omio"><img src="https://www.google.com/s2/favicons?sz=128&domain=omio.com" alt="" width="24" height="24"></span>' +
      '</div>' +
      '<p class="omb-fid">' + esc(tx.fidelity) + '</p>' +
    '</div>';
  }

  // Documento completo que se escribe en la pestaña nueva; se redirige solo a Omio.
  function transitionDoc(url, r, tx, l) {
    var go = JSON.stringify(String(url)).replace(/</g, '\\u003c');
    return '<!DOCTYPE html><html lang="' + l + '"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<meta name="robots" content="noindex"><title>' + esc(tx.title) + '</title>' +
      '<style>' + PAGE_CSS + BG_CSS + CARD_CSS + '</style></head><body>' +
      '<div class="bg1"></div><div class="bg2"></div>' + cardHTML(r, tx) +
      '<script>try{window.opener=null}catch(e){}' +
      'var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;' +
      'setTimeout(function(){location.replace(' + go + ')},reduce?500:' + HOLD_MS + ');</' + 'script>' +
      '</body></html>';
  }

  function track(url) {
    try {
      var q = new URL(url, location.href).searchParams;
      if (typeof gtag === 'function') gtag('event', 'omio_click', { from: q.get('from'), to: q.get('to') });
    } catch (e) {}
  }

  // ---- aviso discreto en la pestaña original ----
  function hideToast() {
    clearTimeout(toastTimer);
    if (toast) toast.classList.remove('is-open');
  }

  function showToast(url, tx) {
    if (!document.getElementById('omb-style')) {
      var st = document.createElement('style');
      st.id = 'omb-style';
      st.textContent = '.omb-toast{position:fixed;left:50%;bottom:20px;z-index:2147483000;transform:translate(-50%,16px);opacity:0;pointer-events:none;transition:opacity .35s ease,transform .35s ease;display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center;max-width:min(520px,calc(100vw - 24px));background:linear-gradient(135deg,#F1F2F6 0%,#E8F1FC 100%);color:#182C66;border:1px solid rgba(251,107,108,.6);border-radius:14px;padding:12px 16px;box-shadow:0 12px 32px rgba(20,21,26,.2);font:500 14px/1.4 "IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}' +
        '.omb-toast.is-open{opacity:1;transform:translate(-50%,0);pointer-events:auto}' +
        '.omb-toast a{font-weight:600;color:#182C66;text-decoration:underline;white-space:nowrap}' +
        '.omb-toast button{font:inherit;font-weight:600;border:1px solid rgba(20,21,26,.14);background:#fff;color:#182C66;border-radius:8px;padding:6px 12px;cursor:pointer}' +
        '.omb-toast a:focus-visible,.omb-toast button:focus-visible{outline:2px solid #14151a;outline-offset:2px}' +
        '@media (prefers-reduced-motion:reduce){.omb-toast{transition:none}}';
      document.head.appendChild(st);
    }
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'omb-toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<span>' + esc(tx.done) + '</span>' +
      '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" data-omb="1">' + esc(tx.again) + ' ↗</a>' +
      '<button type="button" id="ombToastClose">' + esc(tx.close) + '</button>';
    toast.querySelector('#ombToastClose').addEventListener('click', hideToast);
    // forzar un fotograma antes de abrir para que la transición CSS se vea
    requestAnimationFrame(function () { toast.classList.add('is-open'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, TOAST_MS);
  }

  // ---- respaldo: la misma transición en esta pestaña y después se navega ----
  function sameTab(url, r, tx) {
    if (!document.getElementById('omb-style-card')) {
      var st = document.createElement('style');
      st.id = 'omb-style-card';
      st.textContent = '.omb-overlay{position:fixed;inset:0;z-index:2147483001;display:flex;align-items:center;justify-content:center;padding:16px;overflow:hidden}' + BG_CSS + CARD_CSS;
      document.head.appendChild(st);
    }
    var overlay = document.createElement('div');
    overlay.className = 'omb-overlay';
    overlay.innerHTML = '<div class="bg1"></div><div class="bg2"></div>' + cardHTML(r, tx);
    overlay.querySelector('.omb-card').style.position = 'relative';
    document.body.appendChild(overlay);
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(function () { location.assign(url); }, reduce ? 500 : HOLD_MS);
  }

  var nativeOpen = window.open;

  // Idioma del visitante para que el backend use el enlace oficial de Omio en su idioma y su moneda.
  function withLang(url) {
    if (/[?&]lang=/.test(url)) return url;
    var l = String(document.documentElement.lang || '').slice(0, 2).toLowerCase();
    return l ? url + (url.indexOf('?') > -1 ? '&' : '?') + 'lang=' + encodeURIComponent(l) : url;
  }

  // Abre la pestaña de transición dentro del gesto del usuario (sin bloqueo de ventanas emergentes).
  function openWithTransition(url) {
    url = withLang(url);
    var r = routeOf(url);
    if (!r) return nativeOpen.call(window, url, '_blank');
    var l = lang(), tx = T[l];
    track(url);
    var w = null;
    try { w = nativeOpen.call(window, '', '_blank'); } catch (e) { w = null; }
    if (w && w.document) {
      try {
        w.document.open();
        w.document.write(transitionDoc(url, r, tx, l));
        w.document.close();
        showToast(url, tx);
        return w;
      } catch (e) {
        try { w.close(); } catch (e2) {}
      }
    }
    sameTab(url, r, tx);     // bloqueada o sin acceso a la ventana: se hace en esta pestaña
    return null;
  }

  function isOmio(u) { return typeof u === 'string' && u.indexOf(MARK) > -1; }

  window.open = function (u) {
    if (isOmio(u)) return openWithTransition(u);
    return nativeOpen.apply(window, arguments);
  };

  // Enlaces <a href=".../affiliate/europe-train...">: se controla la apertura para animarla.
  // Con tecla modificadora o clic central se deja el comportamiento normal del navegador.
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || !isOmio(a.getAttribute('href')) || a.getAttribute('data-omb')) return;
    e.preventDefault();
    openWithTransition(a.href);
  }, true);
})();
