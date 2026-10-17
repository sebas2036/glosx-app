/*
 * Transición hacia Klook (Japón).
 *
 * Igual que la de Omio: al pulsar un botón de reserva de Japón (enlace o window.open hacia
 * /affiliate/klook-train) la pestaña nueva se abre al instante con una pantalla propia de glosx que
 * se funde hacia el naranja de Klook mientras se carga la reserva, y se redirige sola a Klook.
 * La pestaña original queda en glosx con un aviso discreto para reabrir. Si el navegador bloquea la
 * pestaña nueva, la misma transición se muestra en esta pestaña y después se navega a Klook.
 */
(function () {
  'use strict';

  var MARK = '/affiliate/klook-train';
  var HOLD_MS = 1800;      // duración de la animación antes de redirigir
  var TOAST_MS = 6500;

  var T = {
    en: { title: 'Syncing your itinerary with Klook…', body: 'Loading your trip details securely for booking.', done: 'Klook opened in a new tab. Your route is already loaded.', fidelity: 'Our AI already did the planning: you won’t need to type your route again.', again: 'Open Klook again', close: 'Close', label: 'Booking transition' },
    es: { title: 'Sincronizando tu itinerario con Klook…', body: 'Cargando tus datos de viaje de forma segura para la reserva.', done: 'Klook se abrió en una pestaña nueva. Tu ruta ya va cargada.', fidelity: 'Nuestra IA ya hizo el trabajo previo: no tendrás que escribir tu ruta de nuevo.', again: 'Abrir Klook de nuevo', close: 'Cerrar', label: 'Transición a la reserva' },
    fr: { title: 'Synchronisation de votre itinéraire avec Klook…', body: 'Chargement sécurisé de vos données de voyage pour la réservation.', done: 'Klook s’est ouvert dans un nouvel onglet. Votre trajet est déjà chargé.', fidelity: 'Notre IA a déjà fait le travail : vous n’aurez pas à ressaisir votre trajet.', again: 'Rouvrir Klook', close: 'Fermer', label: 'Transition vers la réservation' },
    de: { title: 'Deine Route wird mit Klook synchronisiert…', body: 'Deine Reisedaten werden sicher für die Buchung geladen.', done: 'Klook wurde in einem neuen Tab geöffnet. Deine Route ist bereits geladen.', fidelity: 'Unsere KI hat die Planung schon erledigt: Du musst deine Route nicht erneut eingeben.', again: 'Klook erneut öffnen', close: 'Schließen', label: 'Übergang zur Buchung' },
    it: { title: 'Sincronizzazione del tuo itinerario con Klook…', body: 'Caricamento sicuro dei dati di viaggio per la prenotazione.', done: 'Klook si è aperto in una nuova scheda. Il tuo percorso è già caricato.', fidelity: 'La nostra IA ha già fatto il lavoro: non dovrai riscrivere il tuo percorso.', again: 'Riapri Klook', close: 'Chiudi', label: 'Passaggio alla prenotazione' },
    pt: { title: 'A sincronizar o teu itinerário com a Klook…', body: 'A carregar os teus dados de viagem em segurança para a reserva.', done: 'A Klook abriu num novo separador. O teu percurso já vai carregado.', fidelity: 'A nossa IA já fez o trabalho prévio: não precisas de escrever o teu percurso outra vez.', again: 'Abrir a Klook de novo', close: 'Fechar', label: 'Transição para a reserva' },
    ja: { title: 'Klookと旅程を同期しています…', body: '予約のために旅行情報を安全に読み込んでいます。', done: 'Klookを新しいタブで開きました。経路はすでに入力済みです。', fidelity: 'AIが下準備を済ませました。経路を入力し直す必要はありません。', again: 'Klookをもう一度開く', close: '閉じる', label: '予約サイトへの移動' }
  };

  // Tarjeta de transición (la misma en la pestaña nueva y en el respaldo de esta pestaña)
  var CARD_CSS = [
    '.klb-card{width:min(440px,100%);box-sizing:border-box;background:rgba(255,255,255,.84);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#2A2118;border:1px solid rgba(255,91,0,.22);border-radius:16px;padding:24px 24px 22px;box-shadow:0 18px 48px rgba(20,21,26,.22);font-family:"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;animation:klbIn .55s cubic-bezier(.2,.7,.2,1) both}',
    '.klb-brand{display:flex;align-items:center;gap:10px;margin:0 0 14px;font-size:22px;font-weight:700;letter-spacing:-.02em;color:#2A2118}',
    '.klb-brand img{width:36px;height:36px;border-radius:10px;background:#fff;box-shadow:0 0 0 1px rgba(255,91,0,.25);padding:5px}',
    '.klb-route{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:20px;font-weight:600;letter-spacing:-.01em;margin:0 0 16px}',
    '.klb-route svg{width:18px;height:18px;flex:none;stroke:#FF5B00;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.klb-title{font-size:15px;font-weight:600;margin:0 0 4px}',
    '.klb-body{font-size:14px;line-height:1.5;color:#6B5B4D;margin:0 0 16px}',
    '.klb-track{display:flex;align-items:center;gap:12px;margin:0 0 16px}',
    '.klb-node{flex:none;width:38px;height:38px;display:flex;align-items:center;justify-content:center}',
    '.klb-node.is-glosx{background:#C10016;color:#fff;border-radius:10px;font-weight:700;font-size:19px;animation:klbPulse 1.4s ease-in-out infinite}',
    '.klb-node.is-klook{width:42px;height:42px;background:#fff;border:2px solid #FF5B00;border-radius:50%;animation:klbPulseOrange 1.4s ease-in-out infinite}',
    '.klb-node.is-klook img{width:24px;height:24px;border-radius:5px}',
    '.klb-bar{flex:1;height:5px;border-radius:5px;background:rgba(255,91,0,.14);overflow:hidden}',
    '.klb-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#C10016,#FF5B00);border-radius:5px;animation:klbFill 1.7s cubic-bezier(.3,.6,.3,1) forwards}',
    '.klb-fid{font-size:13px;line-height:1.5;color:#2A2118;background:#FFF1E8;border-radius:8px;padding:10px 12px;margin:0}',
    '@keyframes klbIn{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}',
    '@keyframes klbFill{from{width:6%}to{width:100%}}',
    '@keyframes klbPulse{0%,100%{box-shadow:0 0 0 0 rgba(193,0,22,.35)}50%{box-shadow:0 0 0 8px rgba(193,0,22,0)}}',
    '@keyframes klbPulseOrange{0%,100%{box-shadow:0 0 0 0 rgba(255,91,0,.45)}50%{box-shadow:0 0 0 9px rgba(255,91,0,0)}}',
    '@media (prefers-reduced-motion:reduce){.klb-card,.klb-node.is-glosx,.klb-node.is-klook{animation:none}.klb-bar i{animation:none;width:100%}}'
  ].join('');

  // Fondo: el naranja de Klook desde el primer fotograma, para generar confianza
  var BG_CSS = [
    '.bg1,.bg2{position:absolute;inset:0}',
    '.bg1{background:linear-gradient(160deg,#FF8A3D 0%,#FF5B00 100%)}',
    '.bg2{background:radial-gradient(60% 50% at 50% 38%,rgba(255,255,255,.28) 0%,rgba(255,255,255,0) 70%);opacity:0;animation:klbGlow 1.8s ease-out forwards}',
    '@keyframes klbGlow{0%{opacity:0}100%{opacity:1}}',
    '@media (prefers-reduced-motion:reduce){.bg2{animation:none;opacity:1}}'
  ].join('');

  var PAGE_CSS = '*{box-sizing:border-box}html,body{height:100%;margin:0}' +
    'body{position:relative;display:flex;align-items:center;justify-content:center;padding:16px;overflow:hidden}.klb-card{position:relative}';

  var toast, toastTimer;

  function lang() {
    var l = String(document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return T[l] ? l : 'en';
  }

  var EN_CITY = {akita:'Akita',aomori:'Aomori',asahikawa:'Asahikawa',asakusa:'Asakusa',atami:'Atami',beppu:'Beppu',chitose:'Chitose',fukuchiyama:'Fukuchiyama',fukui:'Fukui',fukuoka:'Fukuoka',fukushima:'Fukushima',fukuyama:'Fukuyama',gero:'Gero',gifu:'Gifu',hachinohe:'Hachinohe',hakodate:'Hakodate',hakone:'Hakone',hamamatsu:'Hamamatsu',hidafurukawa:'Hida Furukawa',himeji:'Himeji',hirosaki:'Hirosaki',hiroshima:'Hiroshima',hita:'Hita',huistenbosch:'Huis Ten Bosch',ichinoseki:'Ichinoseki',ito:'Ito',joetsumyoko:'Joetsu Myoko',kagaonsen:'Kaga Onsen',kagoshima:'Kagoshima',kanazawa:'Kanazawa',kansaiairport:'Kansai Airport',karuizawa:'Karuizawa',kawaguchiko:'Kawaguchiko',kiitanabe:'Kii Tanabe',kinosaki:'Kinosaki',kinugawaonsen:'Kinugawa Onsen',kobe:'Kobe',kofu:'Kofu',kokura:'Kokura',komatsu:'Komatsu',koriyama:'Koriyama',kumamoto:'Kumamoto',kurashiki:'Kurashiki',kurume:'Kurume',kushiro:'Kushiro',kyoto:'Kyoto',maibara:'Maibara',matsue:'Matsue',matsumoto:'Matsumoto',mishima:'Mishima',mito:'Mito',morioka:'Morioka',murakami:'Murakami',nagano:'Nagano',nagaoka:'Nagaoka',nagoya:'Nagoya',nakatsu:'Nakatsu',nanao:'Nanao',naritaairport:'Narita Airport',nasushiobara:'Nasushiobara',newchitoseairport:'New Chitose Airport',niigata:'Niigata',nikko:'Nikko',noboribetsu:'Noboribetsu',obihiro:'Obihiro',odawara:'Odawara',oita:'Oita',okayama:'Okayama',onomichi:'Onomichi',osaka:'Osaka',otaru:'Otaru',otsuki:'Otsuki',saga:'Saga',sapporo:'Sapporo',sendai:'Sendai',shinagawa:'Shinagawa',shinfuji:'Shin Fuji',shinhakodatehokuto:'Shin Hakodate Hokuto',shinhanamaki:'Shin Hanamaki',shinjuku:'Shinjuku',shinsapporo:'Shin Sapporo',shinyamaguchi:'Shin Yamaguchi',shinyokohama:'Shin Yokohama',shirahama:'Shirahama',shizuoka:'Shizuoka',takasaki:'Takasaki',takayama:'Takayama',takeoonsen:'Takeo Onsen',tennoji:'Tennoji',tokyo:'Tokyo',tomakomai:'Tomakomai',toyama:'Toyama',toyohashi:'Toyohashi',toyooka:'Toyooka',tsuruga:'Tsuruga',ueda:'Ueda',utsunomiya:'Utsunomiya',wakayama:'Wakayama',wakkanai:'Wakkanai',yamagata:'Yamagata',yokohama:'Yokohama',yonago:'Yonago',yufuin:'Yufuin'};
  var JA_CITY = {akita:'秋田',aomori:'青森',asahikawa:'旭川',asakusa:'浅草',atami:'熱海',beppu:'別府',chitose:'千歳',fukuchiyama:'福知山',fukui:'福井',fukuoka:'福岡',fukushima:'福島',fukuyama:'福山',gero:'下呂',gifu:'岐阜',hachinohe:'八戸',hakodate:'函館',hakone:'箱根',hamamatsu:'浜松',hidafurukawa:'飛騨古川',himeji:'姫路',hirosaki:'弘前',hiroshima:'広島',hita:'日田',huistenbosch:'ハウステンボス',ichinoseki:'一ノ関',ito:'伊東',joetsumyoko:'上越妙高',kagaonsen:'加賀温泉',kagoshima:'鹿児島',kanazawa:'金沢',kansaiairport:'関西空港',karuizawa:'軽井沢',kawaguchiko:'河口湖',kiitanabe:'紀伊田辺',kinosaki:'城崎温泉',kinugawaonsen:'鬼怒川温泉',kobe:'神戸',kofu:'甲府',kokura:'小倉',komatsu:'小松',koriyama:'郡山',kumamoto:'熊本',kurashiki:'倉敷',kurume:'久留米',kushiro:'釧路',kyoto:'京都',maibara:'米原',matsue:'松江',matsumoto:'松本',mishima:'三島',mito:'水戸',morioka:'盛岡',murakami:'村上',nagano:'長野',nagaoka:'長岡',nagoya:'名古屋',nakatsu:'中津',nanao:'七尾',naritaairport:'成田空港',nasushiobara:'那須塩原',newchitoseairport:'新千歳空港',niigata:'新潟',nikko:'日光',noboribetsu:'登別',obihiro:'帯広',odawara:'小田原',oita:'大分',okayama:'岡山',onomichi:'尾道',osaka:'大阪',otaru:'小樽',otsuki:'大月',saga:'佐賀',sapporo:'札幌',sendai:'仙台',shinagawa:'品川',shinfuji:'新富士',shinhakodatehokuto:'新函館北斗',shinhanamaki:'新花巻',shinjuku:'新宿',shinsapporo:'新札幌',shinyamaguchi:'新山口',shinyokohama:'新横浜',shirahama:'白浜',shizuoka:'静岡',takasaki:'高崎',takayama:'高山',takeoonsen:'武雄温泉',tennoji:'天王寺',tokyo:'東京',tomakomai:'苫小牧',toyama:'富山',toyohashi:'豊橋',toyooka:'豊岡',tsuruga:'敦賀',ueda:'上田',utsunomiya:'宇都宮',wakayama:'和歌山',wakkanai:'稚内',yamagata:'山形',yokohama:'横浜',yonago:'米子',yufuin:'由布院'};
  function cityName(slug) {
    if (lang() === 'ja' && JA_CITY[String(slug || '').toLowerCase().replace(/[^a-z]/g, '')]) return JA_CITY[String(slug).toLowerCase().replace(/[^a-z]/g, '')];
    var list = window._GLOSX_CITIES || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].slug === slug && list[i].display) return String(list[i].display).split(' / ')[0];
    }
    var k = String(slug || '').toLowerCase().replace(/[^a-z]/g, '');
    if (EN_CITY[k]) return EN_CITY[k];
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
    return '<div class="klb-card" role="status" aria-live="polite">' +
      '<div class="klb-brand"><img src="https://www.google.com/s2/favicons?sz=128&domain=klook.com" alt="" width="36" height="36"><span>Klook</span></div>' +
      '<p class="klb-route"><span>' + esc(r.from) + '</span>' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '<span>' + esc(r.to) + '</span></p>' +
      '<p class="klb-title">' + esc(tx.title) + '</p>' +
      '<p class="klb-body">' + esc(tx.body) + '</p>' +
      '<div class="klb-track" aria-hidden="true">' +
        '<span class="klb-node is-glosx">W</span>' +
        '<div class="klb-bar"><i></i></div>' +
        '<span class="klb-node is-klook"><img src="https://www.google.com/s2/favicons?sz=128&domain=klook.com" alt="" width="24" height="24"></span>' +
      '</div>' +
      '<p class="klb-fid">' + esc(tx.fidelity) + '</p>' +
    '</div>';
  }

  // Documento completo que se escribe en la pestaña nueva; se redirige solo a Klook.
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
      if (typeof gtag === 'function') gtag('event', 'klook_bridge_open', { from: q.get('from'), to: q.get('to') });
    } catch (e) {}
  }

  // ---- aviso discreto en la pestaña original ----
  function hideToast() {
    clearTimeout(toastTimer);
    if (toast) toast.classList.remove('is-open');
  }

  function showToast(url, tx) {
    if (!document.getElementById('klb-style')) {
      var st = document.createElement('style');
      st.id = 'klb-style';
      st.textContent = '.klb-toast{position:fixed;left:50%;bottom:20px;z-index:2147483000;transform:translate(-50%,16px);opacity:0;pointer-events:none;transition:opacity .35s ease,transform .35s ease;display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center;max-width:min(520px,calc(100vw - 24px));background:linear-gradient(135deg,#FFF6EF 0%,#FFE9DA 100%);color:#2A2118;border:1px solid rgba(255,91,0,.55);border-radius:14px;padding:12px 16px;box-shadow:0 12px 32px rgba(20,21,26,.2);font:500 14px/1.4 "IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}' +
        '.klb-toast.is-open{opacity:1;transform:translate(-50%,0);pointer-events:auto}' +
        '.klb-toast a{font-weight:600;color:#2A2118;text-decoration:underline;white-space:nowrap}' +
        '.klb-toast button{font:inherit;font-weight:600;border:1px solid rgba(20,21,26,.14);background:#fff;color:#2A2118;border-radius:8px;padding:6px 12px;cursor:pointer}' +
        '.klb-toast a:focus-visible,.klb-toast button:focus-visible{outline:2px solid #14151a;outline-offset:2px}' +
        '@media (prefers-reduced-motion:reduce){.klb-toast{transition:none}}';
      document.head.appendChild(st);
    }
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'klb-toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<span>' + esc(tx.done) + '</span>' +
      '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" data-klb="1">' + esc(tx.again) + ' ↗</a>' +
      '<button type="button" id="klbToastClose">' + esc(tx.close) + '</button>';
    toast.querySelector('#klbToastClose').addEventListener('click', hideToast);
    // forzar un fotograma antes de abrir para que la transición CSS se vea
    requestAnimationFrame(function () { toast.classList.add('is-open'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, TOAST_MS);
  }

  // ---- respaldo: la misma transición en esta pestaña y después se navega ----
  function sameTab(url, r, tx) {
    if (!document.getElementById('klb-style-card')) {
      var st = document.createElement('style');
      st.id = 'klb-style-card';
      st.textContent = '.klb-overlay{position:fixed;inset:0;z-index:2147483001;display:flex;align-items:center;justify-content:center;padding:16px;overflow:hidden}' + BG_CSS + CARD_CSS;
      document.head.appendChild(st);
    }
    var overlay = document.createElement('div');
    overlay.className = 'klb-overlay';
    overlay.innerHTML = '<div class="bg1"></div><div class="bg2"></div>' + cardHTML(r, tx);
    overlay.querySelector('.klb-card').style.position = 'relative';
    document.body.appendChild(overlay);
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(function () { location.assign(url); }, reduce ? 500 : HOLD_MS);
  }

  var nativeOpen = window.open;

  // Abre la pestaña de transición dentro del gesto del usuario (sin bloqueo de ventanas emergentes).
  function openWithTransition(url) {
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

  function isKlook(u) { return typeof u === 'string' && u.indexOf(MARK) > -1; }

  window.open = function (u) {
    if (isKlook(u)) return openWithTransition(u);
    return nativeOpen.apply(window, arguments);
  };

  // Enlaces <a href=".../affiliate/klook-train...">: se controla la apertura para animarla.
  // Con tecla modificadora o clic central se deja el comportamiento normal del navegador.
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || !isKlook(a.getAttribute('href')) || a.getAttribute('data-klb')) return;
    e.preventDefault();
    openWithTransition(a.href);
  }, true);
})();
