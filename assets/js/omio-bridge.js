/*
 * Puente de transición hacia Omio (Europa).
 *
 * Cuando el usuario pulsa un botón de reserva europeo (enlace o window.open hacia
 * /affiliate/europe-train), Omio se abre en otra pestaña y en esta aparece una tarjeta
 * con la ruta, una barra de progreso y la nota de que el recorrido viaja cargado.
 * No bloquea nada: el enlace se abre en el mismo gesto del usuario (sin riesgo de
 * bloqueo de ventanas emergentes) y la tarjeta es solo guía visual.
 * Japón usa /affiliate/klook-train y no pasa por acá.
 */
(function () {
  'use strict';

  var MARK = '/affiliate/europe-train';
  var SHOW_MS = 4200;

  var T = {
    en: { title: 'Syncing your itinerary with Omio…', body: 'Loading your trip details securely for payment.', done: 'Omio opened in a new tab. Your route is already loaded.', fidelity: 'Our AI already did the planning: you won’t need to type your route again.', again: 'Open Omio again', close: 'Close', external: 'Opens in a new tab on Omio, the official booking platform.', label: 'Booking transition' },
    es: { title: 'Sincronizando tu itinerario con Omio…', body: 'Cargando tus datos de viaje de forma segura para el pago.', done: 'Omio se abrió en una pestaña nueva. Tu ruta ya va cargada.', fidelity: 'Nuestra IA ya hizo el trabajo previo: no tendrás que escribir tu ruta de nuevo.', again: 'Abrir Omio de nuevo', close: 'Cerrar', external: 'Se abre en una pestaña nueva en Omio, la plataforma oficial de reserva.', label: 'Transición a la reserva' },
    fr: { title: 'Synchronisation de votre itinéraire avec Omio…', body: 'Chargement sécurisé de vos données de voyage pour le paiement.', done: 'Omio s’est ouvert dans un nouvel onglet. Votre trajet est déjà chargé.', fidelity: 'Notre IA a déjà fait le travail : vous n’aurez pas à ressaisir votre trajet.', again: 'Rouvrir Omio', close: 'Fermer', external: 'S’ouvre dans un nouvel onglet sur Omio, la plateforme officielle de réservation.', label: 'Transition vers la réservation' },
    de: { title: 'Deine Route wird mit Omio synchronisiert…', body: 'Deine Reisedaten werden sicher für die Zahlung geladen.', done: 'Omio wurde in einem neuen Tab geöffnet. Deine Route ist bereits geladen.', fidelity: 'Unsere KI hat die Planung schon erledigt: Du musst deine Route nicht erneut eingeben.', again: 'Omio erneut öffnen', close: 'Schließen', external: 'Öffnet sich in einem neuen Tab bei Omio, der offiziellen Buchungsplattform.', label: 'Übergang zur Buchung' },
    it: { title: 'Sincronizzazione del tuo itinerario con Omio…', body: 'Caricamento sicuro dei dati di viaggio per il pagamento.', done: 'Omio si è aperto in una nuova scheda. Il tuo percorso è già caricato.', fidelity: 'La nostra IA ha già fatto il lavoro: non dovrai riscrivere il tuo percorso.', again: 'Riapri Omio', close: 'Chiudi', external: 'Si apre in una nuova scheda su Omio, la piattaforma ufficiale di prenotazione.', label: 'Passaggio alla prenotazione' },
    pt: { title: 'A sincronizar o teu itinerário com a Omio…', body: 'A carregar os teus dados de viagem em segurança para o pagamento.', done: 'A Omio abriu num novo separador. O teu percurso já vai carregado.', fidelity: 'A nossa IA já fez o trabalho prévio: não precisas de escrever o teu percurso outra vez.', again: 'Abrir a Omio de novo', close: 'Fechar', external: 'Abre num novo separador na Omio, a plataforma oficial de reserva.', label: 'Transição para a reserva' },
    ja: { title: 'Omioと旅程を同期しています…', body: '支払いのために旅行情報を安全に読み込んでいます。', done: 'Omioを新しいタブで開きました。経路はすでに入力済みです。', fidelity: 'AIが下準備を済ませました。経路を入力し直す必要はありません。', again: 'Omioをもう一度開く', close: '閉じる', external: '公式予約サイトOmioが新しいタブで開きます。', label: '予約サイトへの移動' }
  };

  var CSS = [
    '.omb{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(20,21,26,.42)}',
    '.omb.is-open{display:flex}',
    '.omb-card{width:min(440px,100%);background:linear-gradient(135deg,#F9EBDF 0%,#F1F2F6 100%);color:#14151a;border:1px solid rgba(20,21,26,.14);border-radius:14px;padding:26px 24px 20px;box-shadow:0 18px 48px rgba(20,21,26,.22);font-family:"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}',
    '.omb-route{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:20px;font-weight:600;letter-spacing:-.01em;margin:0 0 14px}',
    '.omb-route svg{width:18px;height:18px;flex:none;stroke:#C10016;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.omb-title{font-size:15px;font-weight:600;margin:0 0 4px}',
    '.omb-body{font-size:14px;line-height:1.5;color:#55565f;margin:0 0 14px}',
    '.omb-track{display:flex;align-items:center;gap:12px;margin:0 0 16px}',
    '.omb-node{flex:none;width:38px;height:38px;display:flex;align-items:center;justify-content:center}',
    '.omb-node.is-glosx{background:#C10016;color:#fff;border-radius:10px;font-weight:700;font-size:19px}',
    '.omb-node.is-omio{background:#fff;border:2px solid #FB6B6C;border-radius:50%;transition:background .4s}',
    '.omb-node.is-omio img{width:20px;height:20px;border-radius:4px}',
    '.omb.is-done .omb-node.is-omio{background:#FB6B6C}',
    '.omb-bar{flex:1;height:5px;border-radius:5px;background:rgba(20,21,26,.1);overflow:hidden}',
    '.omb-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#C10116,#FB6B6C);border-radius:5px}',
    '.omb.is-open .omb-bar i{animation:ombFill 1.7s cubic-bezier(.3,.6,.3,1) forwards}',
    '.omb.is-done .omb-bar i{width:100%;animation:none}',
    '@keyframes ombFill{from{width:6%}to{width:100%}}',
    '.omb-fid{font-size:13px;line-height:1.5;color:#14151a;background:rgba(255,255,255,.7);border-radius:8px;padding:10px 12px;margin:0 0 12px}',
    '.omb-note{font-size:12px;line-height:1.45;color:#55565f;margin:0 0 16px}',
    '.omb-actions{display:flex;gap:10px;flex-wrap:wrap}',
    '.omb-btn{font:inherit;font-size:14px;font-weight:600;border-radius:8px;padding:10px 16px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(20,21,26,.14);background:#fff;color:#14151a}',
    '.omb-btn.is-primary{background:linear-gradient(100deg,#C10016 0%,#D4323C 80%,#E5484D 100%);border-color:#C10016;color:#fff;box-shadow:0 6px 18px rgba(251,107,108,.32)}',
    '.omb-btn:focus-visible{outline:2px solid #14151a;outline-offset:2px}',
    '@media (prefers-reduced-motion:reduce){.omb.is-open .omb-bar i{animation:none;width:100%}}'
  ].join('');

  var root, timer, lastUrl = '', prevFocus = null;

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

  function build() {
    if (root) return root;
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    root = document.createElement('div');
    root.className = 'omb';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.hidden = false;
    root.addEventListener('click', function (e) { if (e.target === root) hide(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('is-open')) hide(); });
    document.body.appendChild(root);
    return root;
  }

  function hide() {
    if (!root) return;
    clearTimeout(timer);
    root.classList.remove('is-open', 'is-done');
    if (prevFocus && prevFocus.focus) { try { prevFocus.focus(); } catch (e) {} }
  }

  function show(url) {
    var q;
    try { q = new URL(url, location.href).searchParams; } catch (e) { return; }
    var from = cityName(q.get('from')), to = cityName(q.get('to'));
    var tx = T[lang()];
    lastUrl = url;
    build();
    prevFocus = document.activeElement;
    root.setAttribute('aria-label', tx.label);
    root.innerHTML =
      '<div class="omb-card">' +
        '<p class="omb-route"><span>' + esc(from) + '</span>' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
          '<span>' + esc(to) + '</span></p>' +
        '<p class="omb-title" id="ombTitle" aria-live="polite">' + esc(tx.title) + '</p>' +
        '<p class="omb-body" id="ombBody">' + esc(tx.body) + '</p>' +
        '<div class="omb-track" aria-hidden="true">' +
          '<span class="omb-node is-glosx">W</span>' +
          '<div class="omb-bar"><i></i></div>' +
          '<span class="omb-node is-omio"><img src="https://www.google.com/s2/favicons?sz=64&domain=omio.com" alt="" width="20" height="20"></span>' +
        '</div>' +
        '<p class="omb-fid">' + esc(tx.fidelity) + '</p>' +
        '<p class="omb-note">' + esc(tx.external) + '</p>' +
        '<div class="omb-actions">' +
          '<a class="omb-btn is-primary" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(tx.again) + ' <span aria-hidden="true">↗</span></a>' +
          '<button type="button" class="omb-btn" id="ombClose">' + esc(tx.close) + '</button>' +
        '</div>' +
      '</div>';
    root.classList.remove('is-done');
    root.classList.add('is-open');
    root.querySelector('#ombClose').addEventListener('click', hide);
    root.querySelector('#ombClose').focus();
    clearTimeout(timer);
    timer = setTimeout(function () {
      root.classList.add('is-done');
      root.querySelector('#ombTitle').textContent = tx.done;
      root.querySelector('#ombBody').textContent = '';
      timer = setTimeout(hide, SHOW_MS);
    }, 1700);
    try {
      if (typeof gtag === 'function') gtag('event', 'omio_click', { from: q.get('from'), to: q.get('to') });
    } catch (e) {}
  }

  function isOmio(u) { return typeof u === 'string' && u.indexOf(MARK) > -1; }

  // window.open hacia el endpoint europeo (botones que abren por JS)
  var nativeOpen = window.open;
  window.open = function (u) {
    if (isOmio(u)) { try { show(u); } catch (e) {} }
    return nativeOpen.apply(window, arguments);
  };

  // enlaces <a href=".../affiliate/europe-train..."> (el clic sigue su curso normal)
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (a && !a.closest('.omb') && isOmio(a.getAttribute('href'))) { try { show(a.href); } catch (err) {} }
  }, true);
})();
