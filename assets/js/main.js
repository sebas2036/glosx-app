
    // ── Config ─────────────────────────────────────────────────────────────
    const PROXY_BASE = 'https://voxa-production-dc15.up.railway.app/affiliate';

    // ── FAQ toggle ─────────────────────────────────────────────────────────
    function toggleFaq(el) { el.classList.toggle('open'); }

    // ── Glassmorphism Calendar ─────────────────────────────────────────────
    let calDate = new Date();
    let calSelected = new Date();

    const MONTH_NAMES = {
      en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      es: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
      fr: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
      de: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
      it: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
      pt: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    };
    const DAY_NAMES = {
      en: ['Mo','Tu','We','Th','Fr','Sa','Su'],
      es: ['Lu','Ma','Mi','Ju','Vi','Sá','Do'],
      fr: ['Lu','Ma','Me','Je','Ve','Sa','Di'],
      de: ['Mo','Di','Mi','Do','Fr','Sa','So'],
      it: ['Lu','Ma','Me','Gi','Ve','Sa','Do'],
      pt: ['Se','Te','Qu','Qu','Se','Sá','Do'],
    };

    function renderCal() {
      const lang = document.documentElement.lang || 'en';
      const months = MONTH_NAMES[lang] || MONTH_NAMES.en;
      const days   = DAY_NAMES[lang]   || DAY_NAMES.en;
      const today  = new Date(); today.setHours(0,0,0,0);
      const y = calDate.getFullYear(), m = calDate.getMonth();
      const first = new Date(y, m, 1).getDay(); // 0=Sun
      const startOffset = (first === 0) ? 6 : first - 1; // Monday start
      const daysInMonth = new Date(y, m+1, 0).getDate();

      let html = `
        <div class="cal-header">
          <button class="cal-nav" onclick="calPrev(event)">‹</button>
          <div class="cal-title">${months[m]} ${y}</div>
          <button class="cal-nav" onclick="calNext(event)">›</button>
        </div>
        <div class="cal-weekdays">${days.map(d=>`<span>${d}</span>`).join('')}</div>
        <div class="cal-days">`;

      // Empty cells before first day
      for (let i = 0; i < startOffset; i++) {
        const prevDay = new Date(y, m, 0 - (startOffset - i - 1));
        html += `<div class="cal-day other-month">${prevDay.getDate()}</div>`;
      }
      // Days of month
      for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(y, m, d); dt.setHours(0,0,0,0);
        const isToday    = dt.getTime() === today.getTime();
        const isSelected = calSelected && dt.getTime() === calSelected.getTime();
        const isPast     = dt < today;
        let cls = 'cal-day';
        if (isSelected) cls += ' selected';
        else if (isToday) cls += ' today';
        if (isPast) cls += ' disabled';
        const onclick = isPast ? '' : `onclick="calSelect(${y},${m},${d},event)"`;
        html += `<div class="${cls}" ${onclick}>${d}</div>`;
      }
      html += `</div>`;

      let popup = document.getElementById('calPopup');
      if (!popup) {
        popup = document.createElement('div');
        popup.id = 'calPopup';
        popup.className = 'cal-popup';
        document.body.appendChild(popup);
      }
      popup.innerHTML = html;
    }

    function positionCal() {
      const popup = document.getElementById('calPopup');
      const field = document.querySelector('[onclick*="toggleCal"]');
      if (!popup || !field) return;
      const r = field.getBoundingClientRect();
      const w = 300;
      let left = r.left + window.scrollX + r.width / 2 - w / 2;
      left = Math.max(12, Math.min(left, document.documentElement.clientWidth - w - 12));
      popup.style.left = left + 'px';
      popup.style.top = (r.bottom + window.scrollY + 12) + 'px';
    }

    function toggleCal(e) {
      e.stopPropagation();
      const popup = document.getElementById('calPopup') || (() => { renderCal(); return document.getElementById('calPopup'); })();
      renderCal();
      popup.classList.toggle('open');
      if (popup.classList.contains('open')) positionCal();
    }

    // Reposicionar el calendario si está abierto al hacer scroll/resize
    window.addEventListener('scroll', () => {
      const p = document.getElementById('calPopup');
      if (p && p.classList.contains('open')) positionCal();
    }, { passive: true });
    window.addEventListener('resize', () => {
      const p = document.getElementById('calPopup');
      if (p && p.classList.contains('open')) positionCal();
    });

    function calPrev(e) {
      e.stopPropagation();
      calDate = new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1);
      renderCal();
    }
    function calNext(e) {
      e.stopPropagation();
      calDate = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1);
      renderCal();
    }
    function calSelect(y, m, d, e) {
      e.stopPropagation();
      calSelected = new Date(y, m, d);
      const pad = n => String(n).padStart(2,'0');
      const val = `${y}-${pad(m+1)}-${pad(d)}`;
      document.getElementById('date').value = val;
      const lang = document.documentElement.lang || 'en';
      const months = MONTH_NAMES[lang] || MONTH_NAMES.en;
      document.getElementById('dateDisplay').textContent = `${d} ${months[m]} ${y}`;
      document.getElementById('calPopup').classList.remove('open');
    }

    // Cerrar al clickear fuera
    document.addEventListener('click', () => {
      const p = document.getElementById('calPopup');
      if (p) p.classList.remove('open');
      // Ocultar miniaturas de chips abiertas en touch
      document.querySelectorAll('.country-chip.show-photo').forEach(c => c.classList.remove('show-photo'));
    });

    // Chips de países: tap revela/oculta la miniatura (touch). En desktop el
    // hover sigue funcionando; esto le da función al toque en móvil.
    document.querySelectorAll('.country-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasOpen = chip.classList.contains('show-photo');
        document.querySelectorAll('.country-chip.show-photo').forEach(c => c.classList.remove('show-photo'));
        if (!wasOpen) chip.classList.add('show-photo');
      });
    });

    // ── i18n — Multilenguaje ───────────────────────────────────────────────
    const TRANSLATIONS = {
      en: {
        nav_scenic: 'Scenic Trains', nav_discover: 'Discover together', nav_essentials: 'Travel Essentials', nav_features: 'Features', nav_download: 'Get started', nav_routes: 'Routes',
        partners_see_all: 'See all essentials →',
        hero_badge: 'AI-Powered European Rail Planner',
        hero_h1: 'AI European Train Route Planner',
        hero_title1: 'Describe your trip.', hero_title2: 'We plan the trains.',
        hero_subtitle: 'Tell us where you want to go — our AI builds the full itinerary, connects you to buy tickets, and finds hotels along the way.',
        hero_ai_cta: 'Plan my trip with AI →', hero_search_link: 'Already know your route? Search direct →',
        search_from: 'From', search_to: 'To', search_date: 'Date', search_btn: 'Search Tickets & Schedules →',
        stat_world: 'Europe & beyond', stat_free_val: 'Free', stat_free: 'No cost, forever', stat_realtime_val: 'Real-time', stat_realtime: 'Live departures 24/7', stat_noreg_val: 'No sign-up', stat_noreg: 'Open and search, no account',
        scenic_label: 'Iconic European routes', scenic_title1: 'Scenic train', scenic_title2: 'experiences.',
        scenic_lead: 'The most spectacular train journeys in Europe — book directly from here.',
        scenic_more: 'See more routes', scenic_less: 'See less',
        partners_label: 'Everything for your trip', partners_title1: 'Travel essentials', partners_title2: 'for Europe.',
        partners_lead: 'Curated services that complement your train journey.',
        vip_label: 'Trusted partners', vip_booking: 'Hotels & stays →', vip_tripadvisor: 'Experiences & reviews →', vip_klook_hotels: 'Choose your city →',
        disc_label: 'Community', disc_title1: "Let's discover", disc_title2: 'together.', disc_lead: "Towns and corners of Europe you'd only ever find by train — shared by travelers, for travelers.", disc_cta_title: 'Know a place only the train reveals? ', disc_cta_text: 'Share the route, the town, the hidden stop — and help other travelers discover it too.', disc_cta_btn: 'Share your discovery →',
        p_klook_title: 'City Passes', p_klook_desc: 'Madrid, Barcelona, Paris, Rome, London, Berlin — unlimited transit and skip-the-line entry to top attractions.', p_klook_cta: 'Browse passes →',
        p_kiwi_title: 'Airport Transfers', p_kiwi_desc: 'Private taxi from any major European airport straight to your hotel or station. Fixed price, no surprises.', p_kiwi_cta: 'Book transfer →',
        p_yesim_title: 'eSIM Europe', p_yesim_desc: 'Stay connected across 30+ European countries from €4.90. Activate instantly on your phone — no SIM swap.', p_yesim_cta: 'Activate eSIM →',
        p_tiqets_title: 'Attraction Tickets', p_tiqets_desc: 'Skip-the-line entry to Sagrada Familia, Colosseum, Louvre, Eiffel Tower and 6,000+ attractions across Europe.', p_tiqets_cta: 'Browse tickets →',
        p_storage_title: 'Luggage Storage', p_storage_desc: 'Safe luggage storage in 1,000+ locations across European cities. Drop your bags from €5 and explore freely.', p_storage_cta: 'Find storage →',
        p_car_title: 'Car Rental', p_car_cta: 'Rent a car →', p_insurance_title: 'Travel Insurance', p_insurance_cta: 'Get covered →',
        features_label: 'Why WoW Train', features_title1: 'Built for travelers', features_title2: 'who move fast.',
        features_lead: 'No subscriptions, no paywalls. Just real-time data and smart tools.',
        f1_title: 'Real-time departures', f1_desc: 'Live delays, platform changes and cancellations from official railway data.',
        f2_title: 'Europe & beyond, one app', f2_desc: 'Spain, France, Germany, Switzerland, Italy and more — all in a single interface.',
        f3_title: 'Journey search', f3_desc: 'Find trains between any two stations across Europe with real prices and schedules.',
        f4_title: 'Zero Consulting Fees', f4_desc: 'Design complex multi-country European routes 100% free. No travel agent required.',
        f5_title: 'Smart alerts', f5_desc: 'Get notified when your train is approaching or when there are delays on your route.',
        f6_title: 'Unified Ecosystem', f6_desc: 'Train routes, eSIM and travel essentials — everything for your trip in one place.',
        dl_title: 'Start your journey now.',
        dl_subtitle: 'Search trains, browse scenic routes and book through verified partners — all from your browser, no app needed.',
        dl_web: 'Search trains now', dl_scenic: 'Explore scenic routes',
        ai_route_meta_train: '✦ Train from {from} to {to}',
        faq_label: 'Frequently asked questions', faq_title1: 'Everything you', faq_title2: 'need to know.',
        faq1_q: 'What is WoW Train?', faq1_a: 'An independent and free platform to design scenic train itineraries across Europe. No account, no subscription — just explore, plan and book through certified partners.',
        faq2_q: 'How do I book a ticket?', faq2_a: 'We connect you directly and transparently to official operators like Trainline. Search your route, click "Check schedules →" and complete the booking on the partner\'s secure platform.',
        faq3_q: 'How do I share my experience?', faq3_a: 'Use the interactive review form: write your WoW moment (max 140 characters), choose a star rating and hit Publish. Your review goes live in the cloud in real time.',
        faq4_q: 'Do you charge any fees?', faq4_a: '100% free for the user. WoW Train receives support from official partners without any extra cost to you. Transparent, independent and always on your side.',
        faq5_q: 'Is my data private?', faq5_a: 'WoW Train does not collect, store or share personal data on external servers. No accounts, no tracking, no ads. Only anonymous analytics via Google Analytics to improve the experience.',
        footer_about: 'About', footer_privacy: 'Privacy Policy', footer_cookies: 'Cookie Policy', footer_imprint: 'Legal Notice', footer_support: 'Support', footer_terms: 'Terms of Use', footer_contact: 'Contact',
        cookie_text: 'We use essential cookies for site functionality and anonymous analytics to improve your experience.', cookie_accept: 'Accept', cookie_decline: 'Decline',
        footer_copy: '© 2026 GLOSX — All rights reserved.',
        footer_disclaimer: 'WoW Train is an independent travel platform. Bookings are processed through certified partners under their own terms; we are not a party to those transactions. We may receive a commission from qualifying purchases at no extra cost to you.',
        scenic_book: 'Book now', preview_label: 'See it in action', preview_title1: 'Designed for', preview_title2: 'real travelers.', preview_lead: 'GPS detection, real-time schedules, scenic routes and a built-in translator — all in your pocket.', ss_home: 'Choose your country', ss_board: 'Departure board', ss_live: 'Live departures',
        stats_prose: 'From <strong>104 real routes</strong> in <strong>16 countries</strong> to your next trip — free, no signup.', stat_live: 'Browsing now',
        trust_data: 'Real-time data from official railways',
        trust_b1: 'Official GTFS data', trust_b2: 'Live every 90 seconds', trust_b3: 'No sign-up needed', trust_b4: 'Verified schedules & rates',
        nav_adventure: 'Plan your Adventure',
        adv_label: 'Plan your adventure', adv_title1: 'Build your own', adv_title2: 'adventure.',
        adv_lead: 'Pick a journey archetype and we\'ll trace the logical chain of real trains that carries you city to city — every connection, a scene.',
        route_classic: 'Classic Route (France–Italy)', route_alpine: 'Alpine Route (Switzerland–Austria)', route_imperial: 'Imperial Route (Central Europe)',
        tl_empty: 'Tap a route to unfold its timeline.', wt_close_aria: 'Close route',
        disc_cta_title: 'Know a place only the train reveals?',
        reviews_label: 'Wagon Stories', reviews_title1: 'Voices from', reviews_title2: 'the journey.',
        reviews_lead: 'What they really remember isn\'t the destination — it\'s the moment the train changed everything.',
        wt_momento: 'WoW Moment:',
        rv1_route: 'Paris ➔ Milan · Classic Route', rv1_body: 'Pure comfort. I crossed the Alps with a hot coffee and my laptop open — arrived in Milan rested, not wrecked like after a flight.',
        rv2_route: 'Zurich ➔ Vienna · Alpine Route', rv2_body: 'Zero stress. One ticket, connections that just lined up, and none of the endless security lines. I sat down and simply enjoyed it.',
        rv3_route: 'Prague ➔ Budapest · Imperial Route', rv3_body: 'The scenery. The Danube appeared around a bend at sunset and the whole carriage went silent. No airplane window gives you that.',
        rv_ph_name: 'Name, Country', rv_ph_route: 'Your train route', rv_ph_body: 'Your WoW train moment...', rv_publish: 'Publish', rv_ok: 'Published!', rv_error_empty: 'Fill in your name and comment.', rv_chars_label: 'characters remaining',
        ai_label: 'AI Route Planner', ai_title1: 'Describe your', ai_title2: 'dream journey.',
        ai_subtitle: 'From simple city-to-city to complex multi-day adventures — our AI plans the perfect train route.',
        ai_generate: 'Generate Itinerary', ai_reset: '↺ Create another route', ai_restore: 'View my last route →', ai_buy_ticket: 'Buy ticket →', ai_view_options: 'View options →',
        ai_input_ph: "e.g., 'Madrid to Paris scenic route' or '5 days through Swiss Alps'", ai_suggest_label: '✦ Inspire yourself:',
        ai_plan_btn: 'Build my complete trip', ai_plan_title: 'My travel plan', ai_plan_sub: 'Full route generated by WoW Train',
        ai_plan_trains: 'Trains', ai_plan_hotels: 'Hotels per stop', ai_plan_copy: 'Copy itinerary', ai_plan_copied: 'Copied', ai_plan_note: 'Links open in a new tab — come back here anytime.',
        ai_hotel_link: 'Find hotels →', ai_hotel_price: 'See current price →', ai_kiwi_cta: 'Transfer on arrival to', ai_stop_label: 'STOP',
        popular_routes_label: '★ Popular routes · book instantly',
      },
      es: {
        nav_scenic: 'Trenes panorámicos', nav_discover: 'Descubramos juntos', nav_essentials: 'Esenciales de viaje', nav_features: 'Características', nav_download: 'Empezar', nav_routes: 'Rutas',
        partners_see_all: 'Ver todos los esenciales →',
        hero_badge: 'Planificador IA de trenes europeos',
        hero_h1: 'Planificador IA de trenes por Europa',
        hero_title1: 'Describí tu viaje.', hero_title2: 'Nosotros planificamos.',
        hero_subtitle: 'Contanos a dónde querés ir — nuestra IA arma el itinerario completo, te conecta para comprar los billetes y encuentra hoteles en cada parada.',
        hero_ai_cta: 'Planificá mi viaje con IA →', hero_search_link: '¿Ya sabés tu ruta? Buscá directo →',
        search_from: 'Desde', search_to: 'Hasta', search_date: 'Fecha', search_btn: 'Buscar pasajes y horarios →',
        stat_world: 'Europa y el mundo', stat_free_val: 'Gratis', stat_free: 'Sin costo, para siempre', stat_realtime_val: 'Tiempo real', stat_realtime: 'Salidas en vivo 24/7', stat_noreg_val: 'Sin registro', stat_noreg: 'Abrí y buscá, sin cuenta',
        scenic_label: 'Rutas europeas icónicas', scenic_title1: 'Experiencias en', scenic_title2: 'tren panorámico.',
        scenic_lead: 'Los viajes en tren más espectaculares de Europa — reservá directo desde aquí.',
        scenic_more: 'Ver más rutas', scenic_less: 'Ver menos',
        partners_label: 'Todo para tu viaje', partners_title1: 'Esenciales de viaje', partners_title2: 'para Europa.',
        partners_lead: 'Servicios seleccionados que complementan tu viaje en tren.',
        vip_label: 'Partners de confianza', vip_booking: 'Hoteles y alojamiento →', vip_tripadvisor: 'Experiencias y reseñas →', vip_klook_hotels: 'Elegí tu ciudad →',
        disc_label: 'Comunidad', disc_title1: 'Descubramos', disc_title2: 'juntos.', disc_lead: 'Pueblos y rincones de Europa que solo encontrás en tren — compartidos por viajeros, para viajeros.', disc_cta_title: '¿Conocés un lugar que solo revela el tren? ', disc_cta_text: 'Compartí la ruta, el pueblo, la parada secreta — y ayudá a otros viajeros a descubrirlo.', disc_cta_btn: 'Compartí tu descubrimiento →',
        p_klook_title: 'Pases de ciudad', p_klook_desc: 'Madrid, Barcelona, París, Roma, Londres, Berlín — transporte ilimitado y entrada sin filas a las principales atracciones.', p_klook_cta: 'Ver pases →',
        p_kiwi_title: 'Traslados aeropuerto', p_kiwi_desc: 'Taxi privado desde cualquier aeropuerto europeo hasta tu hotel o estación. Precio fijo, sin sorpresas.', p_kiwi_cta: 'Reservar traslado →',
        p_yesim_title: 'eSIM Europa', p_yesim_desc: 'Conectate en más de 30 países europeos desde €4.90. Activación instantánea en tu teléfono — sin cambiar la SIM.', p_yesim_cta: 'Activar eSIM →',
        p_tiqets_title: 'Entradas a atracciones', p_tiqets_desc: 'Entrada sin filas a Sagrada Familia, Coliseo, Louvre, Torre Eiffel y más de 6.000 atracciones en Europa.', p_tiqets_cta: 'Ver entradas →',
        p_storage_title: 'Guardar equipaje', p_storage_desc: 'Custodia segura de equipaje en más de 1.000 puntos en ciudades europeas. Dejá tus valijas desde €5 y explorá libremente.', p_storage_cta: 'Buscar custodia →',
        p_car_title: 'Alquiler de autos', p_car_cta: 'Alquilar auto →', p_insurance_title: 'Seguro de viaje', p_insurance_cta: 'Asegurate →',
        features_label: 'Por qué WoW Train', features_title1: 'Hecho para viajeros', features_title2: 'que se mueven rápido.',
        features_lead: 'Sin suscripciones, sin paywalls. Solo datos en tiempo real y herramientas inteligentes.',
        f1_title: 'Salidas en tiempo real', f1_desc: 'Retrasos en vivo, cambios de andén y cancelaciones desde datos oficiales de los ferrocarriles.',
        f2_title: 'Tu tren, tu mundo', f2_desc: 'España, Francia, Alemania, Suiza, Italia y más — todo en una sola interfaz.',
        f3_title: 'Búsqueda de viaje', f3_desc: 'Encontrá trenes entre cualquier par de estaciones de Europa con precios y horarios reales.',
        f4_title: 'Sin costos de consultoría', f4_desc: 'Diseñá rutas complejas por Europa con múltiples países 100% gratis. Sin agencia de viajes.',
        f5_title: 'Alertas inteligentes', f5_desc: 'Recibí avisos cuando tu tren está por llegar o hay retrasos en tu ruta.',
        f6_title: 'Ecosistema unificado', f6_desc: 'Rutas de tren, eSIM y esenciales de viaje — todo para tu viaje en un solo lugar.',
        dl_title: 'Empezá tu viaje ahora.',
        dl_subtitle: 'Buscá trenes, explorá rutas panorámicas y reservá con partners verificados — todo desde tu navegador, sin instalar nada.',
        dl_web: 'Buscar trenes ahora', dl_scenic: 'Explorar rutas panorámicas',
        ai_route_meta_train: '✦ Tren de {from} a {to}',
        faq_label: 'Preguntas frecuentes', faq_title1: 'Todo lo que', faq_title2: 'necesitás saber.',
        faq1_q: '¿Qué es WoW Train?', faq1_a: 'Una plataforma independiente y gratuita para diseñar itinerarios escénicos en tren por Europa. Sin cuenta, sin suscripción — explorá, planificá y reservá a través de socios certificados.',
        faq2_q: '¿Cómo reservo un pasaje?', faq2_a: 'Te conectamos de forma directa y transparente con operadores oficiales como Trainline. Buscá tu ruta, hacé clic en "Ver horarios →" y completá la reserva en la plataforma segura del socio.',
        faq3_q: '¿Cómo publico mi experiencia?', faq3_a: 'Usá el formulario interactivo: escribí tu momento WoW (máx. 140 caracteres), elegí tu puntuación con estrellas y presioná Publicar. Tu reseña se publica en la nube en tiempo real.',
        faq4_q: '¿Cobran comisiones?', faq4_a: '100% gratis para el usuario. WoW Train recibe soporte de socios oficiales sin costo adicional para vos. Transparente, independiente y siempre de tu lado.',
        faq5_q: '¿Son privados mis datos?', faq5_a: 'WoW Train no recopila, almacena ni comparte datos personales en servidores externos. Sin cuentas, sin rastreo, sin publicidad.',
        footer_about: 'Sobre nosotros', footer_privacy: 'Política de privacidad', footer_cookies: 'Política de cookies', footer_imprint: 'Aviso legal', footer_support: 'Soporte', footer_terms: 'Términos de uso', footer_contact: 'Contacto',
        cookie_text: 'Usamos cookies esenciales para el funcionamiento del sitio y analíticas anónimas para mejorar tu experiencia.', cookie_accept: 'Aceptar', cookie_decline: 'Rechazar',
        footer_copy: '© 2026 GLOSX — Todos los derechos reservados.',
        footer_disclaimer: 'WoW Train es una plataforma de viajes independiente. Las reservas se procesan bajo los términos del socio correspondiente; no somos parte de esa transacción. Podemos recibir una comisión por compras cualificadas sin costo adicional para usted.',
        scenic_book: 'Reservar', preview_label: 'Velo en acción', preview_title1: 'Diseñada para', preview_title2: 'viajeros de verdad.', preview_lead: 'Detección por GPS, horarios en tiempo real, rutas escénicas y un traductor integrado — todo en tu bolsillo.', ss_home: 'Elegí tu país', ss_board: 'Tablero de salidas', ss_live: 'Salidas en vivo',
        stats_prose: 'De <strong>104 rutas reales</strong> en <strong>16 países</strong> a tu próximo viaje — gratis, sin registro.', stat_live: 'Navegando ahora',
        trust_data: 'Datos en tiempo real de ferroviarias oficiales',
        trust_b1: 'Datos GTFS oficiales', trust_b2: 'En vivo cada 90 segundos', trust_b3: 'Sin registro', trust_b4: 'Horarios y tarifas verificados',
        nav_adventure: 'Planificá tu aventura',
        adv_label: 'Arma tu aventura', adv_title1: 'Arma tu propia', adv_title2: 'aventura.',
        adv_lead: 'Elegí un arquetipo de viaje y trazamos la cadena lógica de trenes reales que te lleva de ciudad en ciudad — cada conexión, una escena.',
        route_classic: 'Ruta Clásica (Francia–Italia)', route_alpine: 'Ruta Alpina (Suiza–Austria)', route_imperial: 'Ruta Imperial (Europa Central)',
        tl_empty: 'Tocá una ruta para desplegar su línea de tiempo.', wt_close_aria: 'Cerrar ruta',
        disc_cta_title: '¿Conocés un lugar que solo revela el tren?',
        reviews_label: 'Historias del Vagón', reviews_title1: 'Voces del', reviews_title2: 'trayecto.',
        reviews_lead: 'Lo que recuerdan no es el destino — es el momento en que el tren lo cambió todo.',
        wt_momento: 'Momento WoW:',
        rv1_route: 'París ➔ Milán · Ruta Clásica', rv1_body: 'Puro confort. Crucé los Alpes con un café caliente y la laptop abierta — llegué a Milán descansada, no destruida como después de un vuelo.',
        rv2_route: 'Zúrich ➔ Viena · Ruta Alpina', rv2_body: 'Sin estrés. Un solo billete, conexiones que encajaron solas, sin las interminables colas de seguridad. Me senté y simplemente lo disfruté.',
        rv3_route: 'Praga ➔ Budapest · Ruta Imperial', rv3_body: 'El paisaje. El Danubio apareció en un recodo al atardecer y todo el vagón quedó en silencio. Ninguna ventanilla de avión te da eso.',
        rv_ph_name: 'Nombre, País', rv_ph_route: 'Tu ruta de tren', rv_ph_body: 'Tu momento WoW en el tren...', rv_publish: 'Publicar', rv_ok: '¡Publicado!', rv_error_empty: 'Completá tu nombre y comentario.', rv_chars_label: 'caracteres restantes',
        ai_label: 'Planificador IA', ai_title1: 'Describí tu', ai_title2: 'viaje soñado.',
        ai_subtitle: 'Desde rutas simples ciudad a ciudad hasta aventuras complejas de varios días — nuestra IA planifica la ruta perfecta en tren.',
        ai_generate: 'Generar Itinerario', ai_reset: '↺ Crear otra ruta', ai_restore: 'Ver mi última ruta →', ai_buy_ticket: 'Comprar billete →', ai_view_options: 'Ver opciones →',
        ai_input_ph: "ej., 'Ruta Madrid a París con vistas' o '5 días por los Alpes suizos'", ai_suggest_label: '✦ Inspírate:',
        ai_plan_btn: 'Armar mi viaje completo', ai_plan_title: 'Mi plan de viaje', ai_plan_sub: 'Ruta completa generada por WoW Train',
        ai_plan_trains: 'Trenes', ai_plan_hotels: 'Hoteles por parada', ai_plan_copy: 'Copiar itinerario', ai_plan_copied: 'Copiado', ai_plan_note: 'Los links se abren en una pestaña nueva — volvé cuando quieras.',
        ai_hotel_link: 'Ver hoteles →', ai_hotel_price: 'Ver precio actual →', ai_kiwi_cta: 'Transfer al llegar a', ai_stop_label: 'PARADA',
        popular_routes_label: '★ Rutas populares · reservá al instante',
      },
      fr: {
        nav_scenic: 'Trains panoramiques', nav_discover: 'Découvrons ensemble', nav_essentials: 'Essentiels du voyage', nav_features: 'Fonctionnalités', nav_download: 'Commencer', nav_routes: 'Itinéraires',
        partners_see_all: 'Voir tous les essentiels →',
        hero_badge: 'Planificateur IA de trains européens',
        hero_h1: 'Planificateur IA de trains en Europe',
        hero_title1: 'Décris ton voyage.', hero_title2: 'On planifie les trains.',
        hero_subtitle: 'Dis-nous où tu veux aller — notre IA construit l\'itinéraire complet, te connecte pour acheter les billets et trouve des hôtels à chaque étape.',
        hero_ai_cta: 'Planifier mon voyage avec l\'IA →', hero_search_link: 'Tu connais déjà ton trajet ? Cherche directement →',
        search_from: 'Départ', search_to: 'Arrivée', search_date: 'Date', search_btn: 'Billets et horaires →',
        stat_world: 'Europe et au-delà', stat_free_val: 'Gratuit', stat_free: 'Sans frais, pour toujours', stat_realtime_val: 'Temps réel', stat_realtime: 'Départs en direct 24/7', stat_noreg_val: 'Sans inscription', stat_noreg: 'Ouvrez et cherchez, sans compte',
        scenic_label: 'Itinéraires européens emblématiques', scenic_title1: 'Expériences en', scenic_title2: 'train panoramique.',
        scenic_lead: 'Les plus beaux voyages en train d\'Europe — réservez directement ici.',
        scenic_more: 'Voir plus d\'itinéraires', scenic_less: 'Voir moins',
        partners_label: 'Tout pour votre voyage', partners_title1: 'Essentiels du voyage', partners_title2: 'pour l\'Europe.',
        partners_lead: 'Services soigneusement choisis qui complètent votre voyage en train.',
        vip_label: 'Partenaires de confiance', vip_booking: 'Hôtels & séjours →', vip_tripadvisor: 'Expériences & avis →', vip_klook_hotels: 'Choisissez votre ville →',
        disc_label: 'Communauté', disc_title1: 'Découvrons', disc_title2: 'ensemble.', disc_lead: "Des villages et des recoins d'Europe que l'on ne trouve qu'en train — partagés par les voyageurs, pour les voyageurs.", disc_cta_title: 'Vous connaissez un lieu que seul le train révèle ? ', disc_cta_text: "Partagez l'itinéraire, le village, l'arrêt caché — et aidez d'autres voyageurs à le découvrir.", disc_cta_btn: 'Partagez votre découverte →',
        p_klook_title: 'Pass ville', p_klook_desc: 'Madrid, Barcelone, Paris, Rome, Londres, Berlin — transport illimité et accès coupe-file aux principales attractions.', p_klook_cta: 'Voir les pass →',
        p_kiwi_title: 'Transferts aéroport', p_kiwi_desc: 'Taxi privé depuis n\'importe quel grand aéroport européen jusqu\'à votre hôtel ou gare. Prix fixe, aucune surprise.', p_kiwi_cta: 'Réserver transfert →',
        p_yesim_title: 'eSIM Europe', p_yesim_desc: 'Restez connecté dans plus de 30 pays européens dès €4.90. Activation instantanée sur votre téléphone — sans changer de SIM.', p_yesim_cta: 'Activer eSIM →',
        p_tiqets_title: 'Billets d\'attractions', p_tiqets_desc: 'Accès coupe-file à la Sagrada Familia, Colisée, Louvre, Tour Eiffel et 6 000+ attractions en Europe.', p_tiqets_cta: 'Voir les billets →',
        p_storage_title: 'Consigne à bagages', p_storage_desc: 'Consigne sécurisée dans plus de 1 000 points dans les villes européennes. Déposez vos bagages dès €5 et explorez librement.', p_storage_cta: 'Trouver consigne →',
        p_car_title: 'Location de voiture', p_car_cta: 'Louer une voiture →', p_insurance_title: 'Assurance voyage', p_insurance_cta: 'Assurez-vous →',
        features_label: 'Pourquoi WoW Train', features_title1: 'Conçu pour les voyageurs', features_title2: 'qui bougent vite.',
        features_lead: 'Pas d\'abonnement, pas de paywall. Juste des données en temps réel et des outils intelligents.',
        f1_title: 'Départs en temps réel', f1_desc: 'Retards en direct, changements de voie et annulations à partir des données ferroviaires officielles.',
        f2_title: 'Ton train, ton monde', f2_desc: 'Espagne, France, Allemagne, Suisse, Italie et plus — tout dans une seule interface.',
        f3_title: 'Recherche de trajet', f3_desc: 'Trouvez des trains entre n\'importe quelles deux gares d\'Europe avec prix et horaires réels.',
        f4_title: 'Consultation 100% gratuite', f4_desc: 'Concevez des itinéraires européens complexes gratuitement. Aucun agent de voyage requis.',
        f5_title: 'Alertes intelligentes', f5_desc: 'Soyez averti quand votre train approche ou s\'il y a des retards sur votre route.',
        f6_title: 'Écosystème unifié', f6_desc: 'Trajets en train, eSIM et essentiels de voyage — tout pour votre voyage au même endroit.',
        dl_title: 'Commencez votre voyage maintenant.',
        dl_subtitle: 'Cherchez des trains, parcourez les itinéraires panoramiques et réservez auprès de partenaires vérifiés — directement depuis votre navigateur.',
        dl_web: 'Rechercher des trains', dl_scenic: 'Explorer les itinéraires',
        ai_route_meta_train: '✦ Train de {from} à {to}',
        faq_label: 'Questions fréquentes', faq_title1: 'Tout ce que', faq_title2: 'vous devez savoir.',
        faq1_q: 'Qu\'est-ce que WoW Train ?', faq1_a: 'Une plateforme indépendante et gratuite pour concevoir des itinéraires pittoresques en train à travers l\'Europe. Sans compte, sans abonnement — explorez, planifiez et réservez via des partenaires certifiés.',
        faq2_q: 'Comment réserver un billet ?', faq2_a: 'Nous vous connectons directement et de manière transparente avec des opérateurs officiels comme Trainline. Cherchez votre trajet, cliquez sur "Voir les horaires →" et finalisez la réservation.',
        faq3_q: 'Comment publier mon expérience ?', faq3_a: 'Utilisez le formulaire interactif : rédigez votre moment WoW (max. 140 caractères), choisissez une note en étoiles et cliquez sur Publier. Votre avis est mis en ligne en temps réel.',
        faq4_q: 'Prélevez-vous des commissions ?', faq4_a: '100% gratuit pour l\'utilisateur. WoW Train reçoit le soutien de partenaires officiels sans frais supplémentaires pour vous. Transparent, indépendant et toujours à vos côtés.',
        faq5_q: 'Mes données sont-elles privées?', faq5_a: 'WoW Train ne collecte, ne stocke ni ne partage de données personnelles. Pas de comptes, pas de tracking, pas de publicité.',
        footer_about: 'À propos', footer_privacy: 'Politique de confidentialité', footer_cookies: 'Politique des cookies', footer_imprint: 'Mentions légales', footer_support: 'Support', footer_terms: 'Conditions d\'utilisation', footer_contact: 'Contact',
        cookie_text: 'Nous utilisons des cookies essentiels et des analyses anonymes pour améliorer votre expérience.', cookie_accept: 'Accepter', cookie_decline: 'Refuser',
        footer_copy: '© 2026 GLOSX — Tous droits réservés.',
        footer_disclaimer: 'WoW Train est une plateforme de voyage indépendante. Les réservations sont traitées selon les conditions du partenaire concerné ; nous ne sommes pas partie à cette transaction. Nous pouvons percevoir une commission sur les achats qualifiés sans frais supplémentaires pour vous.',
        scenic_book: 'Réserver', preview_label: 'Voyez-le en action', preview_title1: 'Conçue pour', preview_title2: 'les vrais voyageurs.', preview_lead: 'Détection GPS, horaires en temps réel, itinéraires panoramiques et un traducteur intégré — le tout dans votre poche.', ss_home: 'Choisissez votre pays', ss_board: 'Tableau des départs', ss_live: 'Départs en direct',
        stats_prose: 'De <strong>104 itinéraires réels</strong> dans <strong>16 pays</strong> vers votre prochain voyage — gratuit, sans inscription.', stat_live: 'En ligne maintenant',
        trust_data: 'Données en temps réel des chemins de fer officiels',
        trust_b1: 'Données GTFS officielles', trust_b2: 'En direct toutes les 90 s', trust_b3: 'Sans inscription', trust_b4: 'Horaires et tarifs vérifiés',
        nav_adventure: 'Planifiez votre aventure',
        adv_label: 'Planifiez votre aventure', adv_title1: 'Créez votre propre', adv_title2: 'aventure.',
        adv_lead: 'Choisissez un archétype de voyage et nous traçons la chaîne logique de vrais trains qui vous emmènent de ville en ville — chaque correspondance, une scène.',
        route_classic: 'Route Classique (France–Italie)', route_alpine: 'Route Alpine (Suisse–Autriche)', route_imperial: 'Route Impériale (Europe Centrale)',
        tl_empty: 'Appuyez sur un itinéraire pour déplier sa ligne de temps.', wt_close_aria: 'Fermer l\'itinéraire',
        disc_cta_title: 'Vous connaissez un lieu que seul le train révèle ?',
        reviews_label: 'Histoires du Wagon', reviews_title1: 'Voix du', reviews_title2: 'voyage.',
        reviews_lead: 'Ce qu\'ils retiennent vraiment n\'est pas la destination — c\'est le moment où le train a tout changé.',
        wt_momento: 'Moment WoW :',
        rv1_route: 'Paris ➔ Milan · Route Classique', rv1_body: 'Pur confort. J\'ai traversé les Alpes avec un café chaud et mon ordinateur ouvert — arrivée à Milan reposée, pas épuisée comme après un vol.',
        rv2_route: 'Zurich ➔ Vienne · Route Alpine', rv2_body: 'Zéro stress. Un seul billet, des correspondances qui s\'enchaînaient, sans les interminables files de sécurité. Je me suis assis et j\'ai simplement profité.',
        rv3_route: 'Prague ➔ Budapest · Route Impériale', rv3_body: 'Le paysage. Le Danube est apparu au détour d\'un virage au coucher du soleil et tout le wagon s\'est tu. Aucun hublot d\'avion ne vous offre ça.',
        rv_ph_name: 'Prénom, Pays', rv_ph_route: 'Votre itinéraire en train', rv_ph_body: 'Votre moment WoW en train...', rv_publish: 'Publier', rv_ok: 'Publié !', rv_error_empty: 'Indiquez votre prénom et votre commentaire.', rv_chars_label: 'caractères restants',
        ai_label: 'Planificateur IA', ai_title1: 'Décrivez votre', ai_title2: 'voyage de rêve.',
        ai_subtitle: 'De simples trajets ville à ville aux aventures complexes de plusieurs jours — notre IA planifie l\'itinéraire ferroviaire parfait.',
        ai_generate: 'Générer l\'itinéraire', ai_reset: '↺ Créer une autre route', ai_restore: 'Voir mon dernier itinéraire →', ai_buy_ticket: 'Acheter un billet →', ai_view_options: 'Voir les options →',
        ai_input_ph: "ex. : 'Paris à Rome avec vue' ou '5 jours dans les Alpes suisses'", ai_suggest_label: '✦ Inspirez-vous :',
        ai_plan_btn: 'Créer mon voyage complet', ai_plan_title: 'Mon plan de voyage', ai_plan_sub: 'Itinéraire complet généré par WoW Train',
        ai_plan_trains: 'Trains', ai_plan_hotels: 'Hôtels par étape', ai_plan_copy: 'Copier l\'itinéraire', ai_plan_copied: 'Copié', ai_plan_note: 'Les liens s\'ouvrent dans un nouvel onglet — revenez quand vous voulez.',
        ai_hotel_link: 'Voir les hôtels →', ai_hotel_price: 'Voir le prix actuel →', ai_kiwi_cta: 'Transfer à l\'arrivée à', ai_stop_label: 'ARRÊT',
        popular_routes_label: '★ Itinéraires populaires · réservez instantanément',
      },
      de: {
        nav_scenic: 'Panoramazüge', nav_discover: 'Gemeinsam entdecken', nav_essentials: 'Reiseessentials', nav_features: 'Funktionen', nav_download: 'Loslegen', nav_routes: 'Routen',
        partners_see_all: 'Alle Essentials ansehen →',
        hero_badge: 'KI-gestützter Europazug-Planer',
        hero_h1: 'KI-Reiseplaner für Züge in Europa',
        hero_title1: 'Beschreib deine Reise.', hero_title2: 'Wir planen die Züge.',
        hero_subtitle: 'Sag uns, wohin du möchtest — unsere KI erstellt den kompletten Reiseplan, verbindet dich für Tickets und findet Hotels auf dem Weg.',
        hero_ai_cta: 'Reise mit KI planen →', hero_search_link: 'Route bereits bekannt? Direkt suchen →',
        search_from: 'Von', search_to: 'Nach', search_date: 'Datum', search_btn: 'Tickets & Fahrpläne suchen →',
        stat_world: 'Europa und die Welt', stat_free_val: 'Kostenlos', stat_free: 'Keine Kosten, für immer', stat_realtime_val: 'Echtzeit', stat_realtime: 'Live-Abfahrten 24/7', stat_noreg_val: 'Ohne Anmeldung', stat_noreg: 'Öffnen und suchen, kein Konto',
        scenic_label: 'Ikonische europäische Routen', scenic_title1: 'Panoramazug-', scenic_title2: 'Erlebnisse.',
        scenic_lead: 'Die spektakulärsten Zugreisen Europas — direkt von hier buchen.',
        scenic_more: 'Mehr Strecken anzeigen', scenic_less: 'Weniger anzeigen',
        partners_label: 'Alles für Ihre Reise', partners_title1: 'Reiseessentials', partners_title2: 'für Europa.',
        partners_lead: 'Kuratierte Dienste, die Ihre Zugreise ergänzen.',
        vip_label: 'Vertrauenspartner', vip_booking: 'Hotels & Unterkünfte →', vip_tripadvisor: 'Erlebnisse & Bewertungen →', vip_klook_hotels: 'Stadt auswählen →',
        disc_label: 'Community', disc_title1: 'Entdecken wir', disc_title2: 'gemeinsam.', disc_lead: 'Orte und Winkel Europas, die man nur mit dem Zug findet — geteilt von Reisenden, für Reisende.', disc_cta_title: 'Kennst du einen Ort, den nur der Zug zeigt? ', disc_cta_text: 'Teile die Strecke, den Ort, den versteckten Halt — und hilf anderen Reisenden, ihn zu entdecken.', disc_cta_btn: 'Teile deine Entdeckung →',
        p_klook_title: 'City Pässe', p_klook_desc: 'Madrid, Barcelona, Paris, Rom, London, Berlin — unbegrenzter Nahverkehr und Skip-the-Line-Eintritt zu Top-Sehenswürdigkeiten.', p_klook_cta: 'Pässe ansehen →',
        p_kiwi_title: 'Flughafentransfer', p_kiwi_desc: 'Privattaxi von jedem großen europäischen Flughafen direkt zu Ihrem Hotel oder Bahnhof. Festpreis, keine Überraschungen.', p_kiwi_cta: 'Transfer buchen →',
        p_yesim_title: 'eSIM Europa', p_yesim_desc: 'Bleiben Sie in 30+ europäischen Ländern verbunden ab €4.90. Sofortige Aktivierung auf Ihrem Telefon — kein SIM-Wechsel.', p_yesim_cta: 'eSIM aktivieren →',
        p_tiqets_title: 'Attraktionstickets', p_tiqets_desc: 'Skip-the-Line-Eintritt zur Sagrada Familia, Kolosseum, Louvre, Eiffelturm und 6.000+ Attraktionen in Europa.', p_tiqets_cta: 'Tickets ansehen →',
        p_storage_title: 'Gepäckaufbewahrung', p_storage_desc: 'Sichere Gepäckaufbewahrung an 1.000+ Standorten in europäischen Städten. Geben Sie Ihr Gepäck ab €5 ab und erkunden Sie frei.', p_storage_cta: 'Aufbewahrung finden →',
        p_car_title: 'Mietwagen', p_car_cta: 'Auto mieten →', p_insurance_title: 'Reiseversicherung', p_insurance_cta: 'Absichern →',
        features_label: 'Warum WoW Train', features_title1: 'Gemacht für Reisende,', features_title2: 'die sich schnell bewegen.',
        features_lead: 'Keine Abonnements, keine Paywalls. Nur Echtzeitdaten und intelligente Tools.',
        f1_title: 'Echtzeit-Abfahrten', f1_desc: 'Live-Verspätungen, Gleisänderungen und Stornierungen aus offiziellen Bahndaten.',
        f2_title: 'Dein Zug, deine Welt', f2_desc: 'Spanien, Frankreich, Deutschland, Schweiz, Italien und mehr — alles in einer Oberfläche.',
        f3_title: 'Reisesuche', f3_desc: 'Finden Sie Züge zwischen beliebigen Bahnhöfen in Europa mit echten Preisen und Fahrplänen.',
        f4_title: 'Kostenlose Routenplanung', f4_desc: 'Entwerfen Sie komplexe europäische Mehrländer-Routen 100% kostenlos. Kein Reisebüro nötig.',
        f5_title: 'Intelligente Warnungen', f5_desc: 'Werden Sie benachrichtigt, wenn Ihr Zug naht oder es Verspätungen auf Ihrer Route gibt.',
        f6_title: 'Einheitliches Ökosystem', f6_desc: 'Zugstrecken, eSIM und Reise-Essentials — alles für Ihre Reise an einem Ort.',
        dl_title: 'Starten Sie Ihre Reise jetzt.',
        dl_subtitle: 'Züge suchen, Panoramastrecken entdecken und über verifizierte Partner buchen — direkt im Browser, ohne App.',
        dl_web: 'Züge jetzt suchen', dl_scenic: 'Panoramastrecken entdecken',
        ai_route_meta_train: '✦ Zug von {from} nach {to}',
        faq_label: 'Häufige Fragen', faq_title1: 'Alles was Sie', faq_title2: 'wissen müssen.',
        faq1_q: 'Was ist WoW Train?', faq1_a: 'Eine unabhängige und kostenlose Plattform zur Gestaltung szenischer Zugreisen in Europa. Kein Konto, kein Abonnement — erkunden, planen und buchen Sie über zertifizierte Partner.',
        faq2_q: 'Wie buche ich ein Ticket?', faq2_a: 'Wir verbinden Sie direkt und transparent mit offiziellen Betreibern wie Trainline. Suchen Sie Ihre Strecke, klicken Sie auf "Fahrpläne anzeigen →" und schließen Sie die Buchung ab.',
        faq3_q: 'Wie teile ich meine Erfahrung?', faq3_a: 'Nutzen Sie das interaktive Formular: Schreiben Sie Ihren WoW-Moment (max. 140 Zeichen), wählen Sie eine Sternebewertung und klicken Sie auf Veröffentlichen. Ihre Bewertung geht sofort online.',
        faq4_q: 'Erheben Sie Gebühren?', faq4_a: '100% kostenlos für den Nutzer. WoW Train erhält Unterstützung von offiziellen Partnern ohne zusätzliche Kosten für Sie. Transparent, unabhängig und immer auf Ihrer Seite.',
        faq5_q: 'Sind meine Daten privat?', faq5_a: 'WoW Train erfasst, speichert oder teilt keine persönlichen Daten. Keine Konten, kein Tracking, keine Werbung.',
        footer_about: 'Über uns', footer_privacy: 'Datenschutz', footer_cookies: 'Cookie-Richtlinie', footer_imprint: 'Impressum', footer_support: 'Support', footer_terms: 'Nutzungsbedingungen', footer_contact: 'Kontakt',
        cookie_text: 'Wir verwenden essenzielle Cookies und anonyme Analysen, um Ihr Erlebnis zu verbessern.', cookie_accept: 'Akzeptieren', cookie_decline: 'Ablehnen',
        footer_copy: '© 2026 GLOSX — Alle Rechte vorbehalten.',
        footer_disclaimer: 'WoW Train ist eine unabhängige Reiseplattform. Buchungen werden gemäß den Bedingungen des jeweiligen Partners abgewickelt; wir sind nicht Teil dieser Transaktion. Wir können eine Provision aus qualifizierenden Käufen ohne zusätzliche Kosten für Sie erhalten.',
        scenic_book: 'Buchen', preview_label: 'In Aktion erleben', preview_title1: 'Gemacht für', preview_title2: 'echte Reisende.', preview_lead: 'GPS-Erkennung, Echtzeit-Fahrpläne, Panoramastrecken und integrierter Übersetzer — alles in deiner Tasche.', ss_home: 'Wähle dein Land', ss_board: 'Abfahrtstafel', ss_live: 'Live-Abfahrten',
        stats_prose: 'Von <strong>104 echten Routen</strong> in <strong>16 Ländern</strong> zu deiner nächsten Reise — kostenlos, ohne Anmeldung.', stat_live: 'Jetzt aktiv',
        trust_data: 'Echtzeitdaten offizieller Bahnen',
        trust_b1: 'Offizielle GTFS-Daten', trust_b2: 'Live alle 90 Sekunden', trust_b3: 'Keine Anmeldung nötig', trust_b4: 'Geprüfte Fahrpläne & Tarife',
        nav_adventure: 'Dein Abenteuer planen',
        adv_label: 'Plan dein Abenteuer', adv_title1: 'Bau dein eigenes', adv_title2: 'Abenteuer.',
        adv_lead: 'Wähle einen Reisetyp und wir zeichnen die logische Kette echter Züge, die dich von Stadt zu Stadt bringt — jede Verbindung, eine Szene.',
        route_classic: 'Klassische Route (Frankreich–Italien)', route_alpine: 'Alpine Route (Schweiz–Österreich)', route_imperial: 'Imperiale Route (Mitteleuropa)',
        tl_empty: 'Tippe auf eine Route, um ihre Zeitleiste zu öffnen.', wt_close_aria: 'Route schließen',
        disc_cta_title: 'Kennst du einen Ort, den nur der Zug zeigt?',
        reviews_label: 'Geschichten aus dem Zug', reviews_title1: 'Stimmen von', reviews_title2: 'der Reise.',
        reviews_lead: 'Was sie wirklich in Erinnerung behalten, ist nicht das Ziel — es ist der Moment, als der Zug alles veränderte.',
        wt_momento: 'WoW-Moment:',
        rv1_route: 'Paris ➔ Mailand · Klassische Route', rv1_body: 'Purer Komfort. Ich überquerte die Alpen mit einem heißen Kaffee und geöffnetem Laptop — kam in Mailand ausgeruht an, nicht kaputt wie nach einem Flug.',
        rv2_route: 'Zürich ➔ Wien · Alpine Route', rv2_body: 'Null Stress. Ein Ticket, Anschlüsse, die einfach passten, keine endlosen Sicherheitsschlangen. Ich setzte mich hin und genoss es einfach.',
        rv3_route: 'Prag ➔ Budapest · Imperiale Route', rv3_body: 'Die Landschaft. Die Donau erschien bei Sonnenuntergang um eine Biegung und das ganze Abteil wurde still. Kein Flugzeugfenster gibt dir das.',
        rv_ph_name: 'Name, Land', rv_ph_route: 'Deine Bahnstrecke', rv_ph_body: 'Dein WoW-Moment im Zug...', rv_publish: 'Veröffentlichen', rv_ok: 'Veröffentlicht!', rv_error_empty: 'Bitte Name und Kommentar ausfüllen.', rv_chars_label: 'Zeichen verbleibend',
        ai_label: 'KI-Route-Planer', ai_title1: 'Beschreibe deinen', ai_title2: 'Traumreise.',
        ai_subtitle: 'Von einfachen Stadt-zu-Stadt-Verbindungen bis zu komplexen Mehrtagesabenteuern — unsere KI plant die perfekte Zugroute.',
        ai_generate: 'Reiseplan erstellen', ai_reset: '↺ Eine andere Route erstellen', ai_restore: 'Letzte Route anzeigen →', ai_buy_ticket: 'Ticket kaufen →', ai_view_options: 'Optionen ansehen →',
        ai_input_ph: "z.B. 'Paris nach Rom mit Aussicht' oder '5 Tage durch die Schweizer Alpen'", ai_suggest_label: '✦ Lass dich inspirieren:',
        ai_plan_btn: 'Meine komplette Reise planen', ai_plan_title: 'Mein Reiseplan', ai_plan_sub: 'Vollständige Route von WoW Train',
        ai_plan_trains: 'Züge', ai_plan_hotels: 'Hotels pro Halt', ai_plan_copy: 'Reiseplan kopieren', ai_plan_copied: 'Kopiert', ai_plan_note: 'Links öffnen sich in einem neuen Tab — komm jederzeit zurück.',
        ai_hotel_link: 'Hotels anzeigen →', ai_hotel_price: 'Aktuellen Preis ansehen →', ai_kiwi_cta: 'Transfer bei Ankunft in', ai_stop_label: 'HALT',
        popular_routes_label: '★ Beliebte Routen · sofort buchbar',
      },
      it: {
        nav_scenic: 'Treni panoramici', nav_discover: 'Scopriamo insieme', nav_essentials: 'Essenziali di viaggio', nav_features: 'Caratteristiche', nav_download: 'Inizia', nav_routes: 'Itinerari',
        partners_see_all: 'Vedi tutti gli essenziali →',
        hero_badge: 'Pianificatore IA di treni europei',
        hero_h1: 'Pianificatore IA di treni in Europa',
        hero_title1: 'Descrivi il tuo viaggio.', hero_title2: 'Pensiamo noi ai treni.',
        hero_subtitle: 'Dicci dove vuoi andare — la nostra IA costruisce l\'itinerario completo, ti collega per acquistare i biglietti e trova hotel ad ogni tappa.',
        hero_ai_cta: 'Pianifica il mio viaggio con l\'IA →', hero_search_link: 'Conosci già il tuo percorso? Cerca direttamente →',
        search_from: 'Da', search_to: 'A', search_date: 'Data', search_btn: 'Cerca biglietti e orari →',
        stat_world: 'Europa e oltre', stat_free_val: 'Gratis', stat_free: 'Senza costi, per sempre', stat_realtime_val: 'Tempo reale', stat_realtime: 'Partenze in diretta 24/7', stat_noreg_val: 'Senza registrazione', stat_noreg: 'Apri e cerca, senza account',
        scenic_label: 'Percorsi europei iconici', scenic_title1: 'Esperienze in', scenic_title2: 'treno panoramico.',
        scenic_lead: 'I viaggi in treno più spettacolari d\'Europa — prenota direttamente da qui.',
        scenic_more: 'Vedi altri percorsi', scenic_less: 'Vedi meno',
        partners_label: 'Tutto per il tuo viaggio', partners_title1: 'Essenziali di viaggio', partners_title2: 'per l\'Europa.',
        partners_lead: 'Servizi selezionati che completano il tuo viaggio in treno.',
        vip_label: 'Partner di fiducia', vip_booking: 'Hotel e soggiorni →', vip_tripadvisor: 'Esperienze e recensioni →', vip_klook_hotels: 'Scegli la tua città →',
        disc_label: 'Community', disc_title1: 'Scopriamo', disc_title2: 'insieme.', disc_lead: "Borghi e angoli d'Europa che trovi solo in treno — condivisi dai viaggiatori, per i viaggiatori.", disc_cta_title: 'Conosci un posto che solo il treno svela? ', disc_cta_text: "Condividi il percorso, il borgo, la fermata nascosta — e aiuta altri viaggiatori a scoprirlo.", disc_cta_btn: 'Condividi la tua scoperta →',
        p_klook_title: 'City Pass', p_klook_desc: 'Madrid, Barcellona, Parigi, Roma, Londra, Berlino — trasporto illimitato e ingresso prioritario alle principali attrazioni.', p_klook_cta: 'Vedi i pass →',
        p_kiwi_title: 'Transfer aeroporto', p_kiwi_desc: 'Taxi privato da qualsiasi grande aeroporto europeo direttamente al tuo hotel o stazione. Prezzo fisso, nessuna sorpresa.', p_kiwi_cta: 'Prenota transfer →',
        p_yesim_title: 'eSIM Europa', p_yesim_desc: 'Resta connesso in 30+ paesi europei da €4.90. Attivazione istantanea sul tuo telefono — nessun cambio SIM.', p_yesim_cta: 'Attiva eSIM →',
        p_tiqets_title: 'Biglietti attrazioni', p_tiqets_desc: 'Ingresso prioritario a Sagrada Familia, Colosseo, Louvre, Torre Eiffel e 6.000+ attrazioni in Europa.', p_tiqets_cta: 'Vedi biglietti →',
        p_storage_title: 'Deposito bagagli', p_storage_desc: 'Deposito sicuro in 1.000+ punti nelle città europee. Lascia i tuoi bagagli da €5 ed esplora liberamente.', p_storage_cta: 'Trova deposito →',
        p_car_title: 'Noleggio auto', p_car_cta: 'Noleggia auto →', p_insurance_title: 'Assicurazione viaggio', p_insurance_cta: 'Assicurati →',
        features_label: 'Perché WoW Train', features_title1: 'Pensato per chi viaggia', features_title2: 'velocemente.',
        features_lead: 'Niente abbonamenti, niente paywall. Solo dati in tempo reale e strumenti intelligenti.',
        f1_title: 'Partenze in tempo reale', f1_desc: 'Ritardi in diretta, cambi di binario e cancellazioni dai dati ferroviari ufficiali.',
        f2_title: 'Il tuo treno, il tuo mondo', f2_desc: 'Spagna, Francia, Germania, Svizzera, Italia e altri — tutto in un\'unica interfaccia.',
        f3_title: 'Ricerca viaggio', f3_desc: 'Trova treni tra qualsiasi coppia di stazioni in Europa con prezzi e orari reali.',
        f4_title: 'Consulenza gratuita', f4_desc: 'Progetta itinerari europei complessi 100% gratis. Nessuna agenzia di viaggi richiesta.',
        f5_title: 'Avvisi intelligenti', f5_desc: 'Ricevi notifiche quando il tuo treno si avvicina o ci sono ritardi sul tuo percorso.',
        f6_title: 'Ecosistema unificato', f6_desc: 'Percorsi in treno, eSIM ed essenziali di viaggio — tutto per il tuo viaggio in un unico posto.',
        dl_title: 'Inizia il tuo viaggio ora.',
        dl_subtitle: 'Cerca treni, esplora percorsi panoramici e prenota con partner verificati — direttamente dal browser, senza app.',
        dl_web: 'Cerca treni ora', dl_scenic: 'Esplora percorsi panoramici',
        ai_route_meta_train: '✦ Treno da {from} a {to}',
        faq_label: 'Domande frequenti', faq_title1: 'Tutto quello che', faq_title2: 'devi sapere.',
        faq1_q: 'Cos\'è WoW Train?', faq1_a: 'Una piattaforma indipendente e gratuita per progettare itinerari ferroviari panoramici in Europa. Nessun account, nessun abbonamento — esplora, pianifica e prenota tramite partner certificati.',
        faq2_q: 'Come prenoto un biglietto?', faq2_a: 'Ti colleghiamo direttamente e in modo trasparente con operatori ufficiali come Trainline. Cerca il tuo percorso, clicca su "Vedi orari →" e completa la prenotazione sulla piattaforma del partner.',
        faq3_q: 'Come pubblico la mia esperienza?', faq3_a: 'Usa il modulo interattivo: scrivi il tuo momento WoW (max 140 caratteri), scegli una valutazione a stelle e premi Pubblica. La tua recensione va in diretta in tempo reale.',
        faq4_q: 'Addebitate commissioni?', faq4_a: '100% gratuito per l\'utente. WoW Train riceve il supporto di partner ufficiali senza alcun costo aggiuntivo per te. Trasparente, indipendente e sempre dalla tua parte.',
        faq5_q: 'I miei dati sono privati?', faq5_a: 'WoW Train non raccoglie, memorizza né condivide dati personali. Nessun account, nessun tracking, nessuna pubblicità.',
        footer_about: 'Chi siamo', footer_privacy: 'Informativa privacy', footer_cookies: 'Politica dei cookie', footer_imprint: 'Note legali', footer_support: 'Supporto', footer_terms: 'Termini d\'uso', footer_contact: 'Contatto',
        cookie_text: 'Utilizziamo cookie essenziali e analisi anonime per migliorare la tua esperienza.', cookie_accept: 'Accetta', cookie_decline: 'Rifiuta',
        footer_copy: '© 2026 GLOSX — Tutti i diritti riservati.',
        footer_disclaimer: 'WoW Train è una piattaforma di viaggio indipendente. Le prenotazioni vengono elaborate secondo i termini del partner corrispondente; non siamo parte di tale transazione. Potremmo ricevere una commissione sugli acquisti qualificati senza costi aggiuntivi per te.',
        scenic_book: 'Prenota', preview_label: 'Guardalo in azione', preview_title1: 'Progettata per', preview_title2: 'veri viaggiatori.', preview_lead: 'Rilevamento GPS, orari in tempo reale, percorsi panoramici e traduttore integrato — tutto in tasca.', ss_home: 'Scegli il tuo paese', ss_board: 'Tabellone partenze', ss_live: 'Partenze in tempo reale',
        stats_prose: 'Da <strong>104 percorsi reali</strong> in <strong>16 paesi</strong> al tuo prossimo viaggio — gratis, senza registrazione.', stat_live: 'Online ora',
        trust_data: 'Dati in tempo reale dalle ferrovie ufficiali',
        trust_b1: 'Dati GTFS ufficiali', trust_b2: 'In diretta ogni 90 secondi', trust_b3: 'Nessuna registrazione', trust_b4: 'Orari e tariffe verificati',
        nav_adventure: 'Pianifica la tua avventura',
        adv_label: 'Pianifica la tua avventura', adv_title1: 'Costruisci la tua', adv_title2: 'avventura.',
        adv_lead: 'Scegli un archetipo di viaggio e tracceremo la catena logica di treni reali che ti porta di città in città — ogni connessione, una scena.',
        route_classic: 'Percorso Classico (Francia–Italia)', route_alpine: 'Percorso Alpino (Svizzera–Austria)', route_imperial: 'Percorso Imperiale (Europa Centrale)',
        tl_empty: 'Tocca un percorso per aprire la sua linea del tempo.', wt_close_aria: 'Chiudi percorso',
        disc_cta_title: 'Conosci un posto che solo il treno svela?',
        reviews_label: 'Storie del Vagone', reviews_title1: 'Voci del', reviews_title2: 'viaggio.',
        reviews_lead: 'Quello che ricordano davvero non è la destinazione — è il momento in cui il treno ha cambiato tutto.',
        wt_momento: 'Momento WoW:',
        rv1_route: 'Parigi ➔ Milano · Percorso Classico', rv1_body: 'Puro comfort. Ho attraversato le Alpi con un caffè caldo e il laptop aperto — arrivata a Milano riposata, non distrutta come dopo un volo.',
        rv2_route: 'Zurigo ➔ Vienna · Percorso Alpino', rv2_body: 'Zero stress. Un biglietto, coincidenze perfette, nessuna fila di sicurezza infinita. Mi sono seduto e ho semplicemente goduto.',
        rv3_route: 'Praga ➔ Budapest · Percorso Imperiale', rv3_body: 'Il paesaggio. Il Danubio è apparso attorno a una curva al tramonto e tutto il vagone è rimasto in silenzio. Nessun oblò d\'aereo ti dà questo.',
        rv_ph_name: 'Nome, Paese', rv_ph_route: 'Il tuo percorso in treno', rv_ph_body: 'Il tuo momento WoW in treno...', rv_publish: 'Pubblica', rv_ok: 'Pubblicato!', rv_error_empty: 'Inserisci nome e commento.', rv_chars_label: 'caratteri rimanenti',
        ai_label: 'Pianificatore IA', ai_title1: 'Descrivi il tuo', ai_title2: 'viaggio dei sogni.',
        ai_subtitle: 'Da semplici collegamenti città a città ad avventure complesse di più giorni — la nostra IA pianifica il perfetto itinerario ferroviario.',
        ai_generate: 'Genera itinerario', ai_reset: '↺ Crea un\'altra route', ai_restore: 'Vedi il mio ultimo percorso →', ai_buy_ticket: 'Acquista biglietto →', ai_view_options: 'Vedi le opzioni →',
        ai_input_ph: "es. 'Parigi a Roma con panorama' o '5 giorni tra le Alpi svizzere'", ai_suggest_label: '✦ Lasciati ispirare:',
        ai_plan_btn: 'Crea il mio viaggio completo', ai_plan_title: 'Il mio piano di viaggio', ai_plan_sub: 'Itinerario completo generato da WoW Train',
        ai_plan_trains: 'Treni', ai_plan_hotels: 'Hotel per tappa', ai_plan_copy: 'Copia itinerario', ai_plan_copied: 'Copiato', ai_plan_note: 'I link si aprono in una nuova scheda — torna quando vuoi.',
        ai_hotel_link: 'Vedi hotel →', ai_hotel_price: 'Vedi prezzo attuale →', ai_kiwi_cta: 'Transfer all\'arrivo a', ai_stop_label: 'TAPPA',
        popular_routes_label: '★ Percorsi popolari · prenota subito',
      },
      pt: {
        nav_scenic: 'Comboios panorâmicos', nav_discover: 'Descubramos juntos', nav_essentials: 'Essenciais de viagem', nav_features: 'Funcionalidades', nav_download: 'Começar', nav_routes: 'Rotas',
        partners_see_all: 'Ver todos os essenciais →',
        hero_badge: 'Planificador IA de comboios europeus',
        hero_h1: 'Planejador IA de trens na Europa',
        hero_title1: 'Descreve a tua viagem.', hero_title2: 'Nós planeamos os comboios.',
        hero_subtitle: 'Diz-nos onde queres ir — a nossa IA constrói o itinerário completo, liga-te para comprar os bilhetes e encontra hotéis ao longo do caminho.',
        hero_ai_cta: 'Planear a minha viagem com IA →', hero_search_link: 'Já conheces o teu percurso? Pesquisa direto →',
        search_from: 'De', search_to: 'Para', search_date: 'Data', search_btn: 'Bilhetes e horários →',
        stat_world: 'Europa e além', stat_free_val: 'Grátis', stat_free: 'Sem custo, para sempre', stat_realtime_val: 'Tempo real', stat_realtime: 'Partidas ao vivo 24/7', stat_noreg_val: 'Sem registo', stat_noreg: 'Abra e pesquise, sem conta',
        scenic_label: 'Rotas europeias icónicas', scenic_title1: 'Experiências em', scenic_title2: 'comboio panorâmico.',
        scenic_lead: 'As viagens de comboio mais espetaculares da Europa — reserve diretamente aqui.',
        scenic_more: 'Ver mais rotas', scenic_less: 'Ver menos',
        partners_label: 'Tudo para a sua viagem', partners_title1: 'Essenciais de viagem', partners_title2: 'para a Europa.',
        partners_lead: 'Serviços selecionados que complementam a sua viagem de comboio.',
        vip_label: 'Parceiros de confiança', vip_booking: 'Hotéis e estadias →', vip_tripadvisor: 'Experiências e avaliações →', vip_klook_hotels: 'Escolha sua cidade →',
        disc_label: 'Comunidade', disc_title1: 'Descubramos', disc_title2: 'juntos.', disc_lead: 'Vilas e recantos da Europa que só se encontram de comboio — partilhados por viajantes, para viajantes.', disc_cta_title: 'Conhece um lugar que só o comboio revela? ', disc_cta_text: 'Partilha a rota, a vila, a paragem escondida — e ajuda outros viajantes a descobri-la.', disc_cta_btn: 'Partilha a tua descoberta →',
        p_klook_title: 'City Pass', p_klook_desc: 'Madrid, Barcelona, Paris, Roma, Londres, Berlim — transporte ilimitado e entrada prioritária nas principais atrações.', p_klook_cta: 'Ver passes →',
        p_kiwi_title: 'Transfer aeroporto', p_kiwi_desc: 'Táxi privado a partir de qualquer grande aeroporto europeu até ao seu hotel ou estação. Preço fixo, sem surpresas.', p_kiwi_cta: 'Reservar transfer →',
        p_yesim_title: 'eSIM Europa', p_yesim_desc: 'Mantenha-se ligado em mais de 30 países europeus desde €4.90. Ativação instantânea no seu telefone — sem trocar de SIM.', p_yesim_cta: 'Ativar eSIM →',
        p_tiqets_title: 'Bilhetes para atrações', p_tiqets_desc: 'Entrada prioritária na Sagrada Família, Coliseu, Louvre, Torre Eiffel e mais de 6.000 atrações na Europa.', p_tiqets_cta: 'Ver bilhetes →',
        p_storage_title: 'Guardar bagagem', p_storage_desc: 'Custódia segura de bagagem em mais de 1.000 locais nas cidades europeias. Deixe as suas malas desde €5 e explore livremente.', p_storage_cta: 'Encontrar depósito →',
        p_car_title: 'Aluguel de carro', p_car_cta: 'Alugar carro →', p_insurance_title: 'Seguro de viagem', p_insurance_cta: 'Proteja-se →',
        features_label: 'Porquê WoW Train', features_title1: 'Feito para viajantes', features_title2: 'que se movem depressa.',
        features_lead: 'Sem subscrições, sem paywalls. Apenas dados em tempo real e ferramentas inteligentes.',
        f1_title: 'Partidas em tempo real', f1_desc: 'Atrasos ao vivo, mudanças de plataforma e cancelamentos a partir de dados ferroviários oficiais.',
        f2_title: 'O teu comboio, o teu mundo', f2_desc: 'Espanha, França, Alemanha, Suíça, Itália e mais — tudo numa única interface.',
        f3_title: 'Pesquisa de viagem', f3_desc: 'Encontre comboios entre quaisquer duas estações da Europa com preços e horários reais.',
        f4_title: 'Sem taxas de consultoria', f4_desc: 'Planifique rotas europeias complexas 100% grátis. Sem agência de viagens necessária.',
        f5_title: 'Alertas inteligentes', f5_desc: 'Receba notificações quando o seu comboio se aproxima ou quando há atrasos na sua rota.',
        f6_title: 'Ecossistema unificado', f6_desc: 'Rotas de comboio, eSIM e essenciais de viagem — tudo para a sua viagem num só lugar.',
        dl_title: 'Comece a sua viagem agora.',
        dl_subtitle: 'Pesquise comboios, explore rotas panorâmicas e reserve com parceiros verificados — diretamente do navegador, sem app.',
        dl_web: 'Pesquisar comboios', dl_scenic: 'Explorar rotas panorâmicas',
        ai_route_meta_train: '✦ Comboio de {from} para {to}',
        faq_label: 'Perguntas frequentes', faq_title1: 'Tudo o que', faq_title2: 'precisa de saber.',
        faq1_q: 'O que é o WoW Train?', faq1_a: 'Uma plataforma independente e gratuita para desenhar itinerários ferroviários cénicos pela Europa. Sem conta, sem subscrição — explore, planeie e reserve através de parceiros certificados.',
        faq2_q: 'Como reservo um bilhete?', faq2_a: 'Ligamo-lo diretamente e de forma transparente a operadores oficiais como a Trainline. Pesquise a sua rota, clique em "Ver horários →" e complete a reserva na plataforma do parceiro.',
        faq3_q: 'Como partilho a minha experiência?', faq3_a: 'Use o formulário interativo: escreva o seu momento WoW (máx. 140 caracteres), escolha uma classificação por estrelas e clique em Publicar. A sua avaliação fica disponível em tempo real.',
        faq4_q: 'Cobram comissões?', faq4_a: '100% gratuito para o utilizador. O WoW Train recebe apoio de parceiros oficiais sem custos adicionais para si. Transparente, independente e sempre do seu lado.',
        faq5_q: 'Os meus dados são privados?', faq5_a: 'O WoW Train não recolhe, armazena nem partilha dados pessoais. Sem contas, sem rastreamento, sem publicidade.',
        footer_about: 'Sobre nós', footer_privacy: 'Política de privacidade', footer_cookies: 'Política de cookies', footer_imprint: 'Aviso legal', footer_support: 'Suporte', footer_terms: 'Termos de utilização', footer_contact: 'Contacto',
        cookie_text: 'Utilizamos cookies essenciais e análises anónimas para melhorar a sua experiência.', cookie_accept: 'Aceitar', cookie_decline: 'Recusar',
        footer_copy: '© 2026 GLOSX — Todos os direitos reservados.',
        footer_disclaimer: 'WoW Train é uma plataforma de viagens independente. As reservas são processadas segundo os termos do parceiro correspondente; não somos parte dessa transação. Podemos receber uma comissão por compras qualificadas sem custo adicional para si.',
        scenic_book: 'Reservar', preview_label: 'Veja em ação', preview_title1: 'Projetada para', preview_title2: 'viajantes a sério.', preview_lead: 'Deteção por GPS, horários em tempo real, rotas cénicas e tradutor integrado — tudo no seu bolso.', ss_home: 'Escolha o seu país', ss_board: 'Painel de partidas', ss_live: 'Partidas ao vivo',
        stats_prose: 'De <strong>104 rotas reais</strong> em <strong>16 países</strong> para a sua próxima viagem — grátis, sem cadastro.', stat_live: 'A navegar agora',
        trust_data: 'Dados em tempo real de ferrovias oficiais',
        trust_b1: 'Dados GTFS oficiais', trust_b2: 'Ao vivo a cada 90 segundos', trust_b3: 'Sem registo', trust_b4: 'Horários e tarifas verificados',
        nav_adventure: 'Planeia a tua aventura',
        adv_label: 'Planeia a tua aventura', adv_title1: 'Constrói a tua', adv_title2: 'aventura.',
        adv_lead: 'Escolhe um arquétipo de viagem e traçamos a cadeia lógica de comboios reais que te leva de cidade em cidade — cada ligação, uma cena.',
        route_classic: 'Rota Clássica (França–Itália)', route_alpine: 'Rota Alpina (Suíça–Áustria)', route_imperial: 'Rota Imperial (Europa Central)',
        tl_empty: 'Toca numa rota para abrir a sua linha do tempo.', wt_close_aria: 'Fechar rota',
        disc_cta_title: 'Conheces um lugar que só o comboio revela?',
        reviews_label: 'Histórias do Vagão', reviews_title1: 'Vozes da', reviews_title2: 'viagem.',
        reviews_lead: 'O que realmente recordam não é o destino — é o momento em que o comboio mudou tudo.',
        wt_momento: 'Momento WoW:',
        rv1_route: 'Paris ➔ Milão · Rota Clássica', rv1_body: 'Puro conforto. Atravessei os Alpes com um café quente e o portátil aberto — cheguei a Milão descansada, não destruída como depois de um voo.',
        rv2_route: 'Zurique ➔ Viena · Rota Alpina', rv2_body: 'Zero stress. Um bilhete, ligações que encaixaram, sem as intermináveis filas de segurança. Sentei-me e simplesmente desfrutei.',
        rv3_route: 'Praga ➔ Budapeste · Rota Imperial', rv3_body: 'A paisagem. O Danúbio apareceu numa curva ao pôr do sol e todo o vagão ficou em silêncio. Nenhuma janela de avião te dá isso.',
        rv_ph_name: 'Nome, País', rv_ph_route: 'O teu percurso de comboio', rv_ph_body: 'O teu momento WoW no comboio...', rv_publish: 'Publicar', rv_ok: 'Publicado!', rv_error_empty: 'Preenche o nome e o comentário.', rv_chars_label: 'caracteres restantes',
        ai_label: 'Planeador IA', ai_title1: 'Descreve a tua', ai_title2: 'viagem dos sonhos.',
        ai_subtitle: 'De simples ligações cidade a cidade a aventuras complexas de vários dias — a nossa IA planeia a perfeita rota ferroviária.',
        ai_generate: 'Gerar itinerário', ai_reset: '↺ Criar outra rota', ai_restore: 'Ver minha última rota →', ai_buy_ticket: 'Comprar bilhete →', ai_view_options: 'Ver opções →',
        ai_input_ph: "ex. 'Paris a Roma com vista' ou '5 dias pelos Alpes suíços'", ai_suggest_label: '✦ Inspire-se:',
        ai_plan_btn: 'Montar minha viagem completa', ai_plan_title: 'Meu plano de viagem', ai_plan_sub: 'Rota completa gerada pelo WoW Train',
        ai_plan_trains: 'Trens', ai_plan_hotels: 'Hotéis por parada', ai_plan_copy: 'Copiar itinerário', ai_plan_copied: 'Copiado', ai_plan_note: 'Os links abrem em uma nova aba — volte quando quiser.',
        ai_hotel_link: 'Ver hotéis →', ai_hotel_price: 'Ver preço atual →', ai_kiwi_cta: 'Transfer ao chegar em', ai_stop_label: 'PARAGEM',
        popular_routes_label: '★ Rotas populares · reserve na hora',
      },
    };

    const LANG_META = {
      en: { flag: '', code: 'EN' }, es: { flag: '', code: 'ES' },
      fr: { flag: '', code: 'FR' }, de: { flag: '', code: 'DE' },
      it: { flag: '', code: 'IT' }, pt: { flag: '', code: 'PT' },
    };

    function detectLang() {
      // 1. Solo si el usuario eligió EXPLÍCITAMENTE con el selector
      if (localStorage.getItem('glosx_lang_manual') === '1') {
        const saved = localStorage.getItem('glosx_lang');
        if (saved && TRANSLATIONS[saved]) return saved;
      }
      // 2. URL query param (?lang=es) — links explícitos / SEO
      const param = new URLSearchParams(location.search).get('lang');
      if (param && TRANSLATIONS[param]) return param;
      // 3. Inglés por defecto SIEMPRE (no auto-detectar idioma del navegador)
      return 'en';
    }

    function applyLang(lang) {
      const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
      document.documentElement.lang = lang;
      // Canonical self-referencing por idioma, alineado con los hreflang de arriba
      // (antes quedaba fijo en "/" para todas las variantes, contradiciendo el hreflang)
      const canonicalLink = document.getElementById('canonicalLink');
      if (canonicalLink) {
        canonicalLink.href = lang === 'en' ? 'https://glosx.app/' : `https://glosx.app/?lang=${lang}`;
      }
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) el.textContent = dict[key];
      });
      // Frase de la barra de stats — usa innerHTML porque trae <strong> embebido
      const statsProse = document.getElementById('statsProse');
      if (statsProse && dict.stats_prose) statsProse.innerHTML = dict.stats_prose;
      // Traducción de atributos (aria-label/title) para controles sin texto visible
      document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        if (dict[key] !== undefined) { el.setAttribute('aria-label', dict[key]); el.setAttribute('title', dict[key]); }
      });
      // Placeholders de inputs/textareas
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
      });
      // Actualizar selector
      const meta = LANG_META[lang] || LANG_META.en;
      document.getElementById('langCode').textContent = meta.code;
      document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
      });
      try {
        if (typeof renderScenic === 'function' && document.getElementById('scenicGrid')) {
          renderScenic();
          if (typeof positionScenicDescs === 'function') positionScenicDescs();
        }
      } catch (e) { /* SCENIC_TRAINS aún no definido en primer applyLang */ }
      // Re-renderiza la timeline de rutas abierta en el nuevo idioma
      if (typeof window.wtRefreshTimeline === 'function') window.wtRefreshTimeline();
    }

    function setLang(lang) {
      localStorage.setItem('glosx_lang', lang);
      localStorage.setItem('glosx_lang_manual', '1'); // el usuario eligió explícitamente
      applyLang(lang);
      document.getElementById('langDropdown').classList.remove('open');
    }

    function toggleLang(e) {
      e.stopPropagation();
      document.getElementById('langDropdown').classList.toggle('open');
    }

    function togglePartners(e) {
      e.preventDefault(); e.stopPropagation();
      document.getElementById('partnersDropdown').classList.toggle('open');
    }
    document.addEventListener('click', function(){ var d=document.getElementById('partnersDropdown'); if(d) d.classList.remove('open'); });

    // Menú móvil (hamburguesa)
    function toggleMenu(e) {
      e.stopPropagation();
      const links = document.getElementById('navLinks');
      const open = links.classList.toggle('show');
      document.getElementById('navToggle').setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    // Cerrar el menú al tocar un enlace de navegación
    document.querySelectorAll('#navLinks a').forEach(a => {
      a.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('show');
        document.getElementById('navToggle').setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar dropdown al clickear afuera
    document.addEventListener('click', () => {
      document.getElementById('langDropdown').classList.remove('open');
    });

    // Aplicar idioma inicial
    applyLang(detectLang());

    // ── Default date (today) — calendar (buscador clásico eliminado, se guarda null-safe) ──
    (function() {
      const today = new Date();
      const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
      const pad = n => String(n).padStart(2,'0');
      calSelected = today; calDate = new Date(y, m, 1);
      const dateEl = document.getElementById('date');
      const dateDisplayEl = document.getElementById('dateDisplay');
      if (dateEl) dateEl.value = `${y}-${pad(m+1)}-${pad(d)}`;
      if (dateDisplayEl) {
        const lang = document.documentElement.lang || 'en';
        const months = MONTH_NAMES[lang] || MONTH_NAMES.en;
        dateDisplayEl.textContent = `${d} ${months[m]} ${y}`;
      }
    })();

    (function() {
      window.GLOSX_ROUTE_PAGES = new Set(["amsterdam-berlin","amsterdam-brussels","barcelona-girona","barcelona-lyon","barcelona-valencia","basel-paris","berlin-hamburg","berlin-prague","bordeaux-lourdes","brno-vienna","brussels-bruges","brussels-paris","copenhagen-stockholm","dortmund-munich","florence-pisa","florence-venice","frankfurt-cologne","frankfurt-munich","geneva-paris","geneva-zermatt","girona-figueres","interlaken-lauterbrunnen","lisbon-porto","london-brussels","london-cambridge","london-edinburgh","london-manchester","london-oxford","london-paris","london-york","lyon-turin","madrid-barcelona","madrid-malaga","madrid-seville","madrid-valencia","madrid-zaragoza","milan-florence","milan-rome","milan-zurich","montreux-interlaken","munich-berlin","munich-prague","munich-venice","munich-vienna","naples-salerno","naples-sorrento","nice-monaco","oslo-bergen","paris-amsterdam","paris-barcelona","paris-berlin","paris-bordeaux","paris-london","paris-lourdes","paris-lucerne","paris-lyon","paris-milan","paris-nice","paris-rome","paris-toulouse","paris-zurich","prague-brno","prague-budapest","prague-vienna","rome-florence","rome-naples","rome-venice","stockholm-oslo","toulouse-lourdes","turin-milan","venice-milan","vienna-budapest","vienna-prague","vienna-salzburg","zaragoza-barcelona","zurich-lucerne","zurich-milan"]);
      window.glosxBookTarget = function(a, b) {
        function sl(x){ return (x||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''); }
        return 'https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=' + encodeURIComponent(sl(a)) + '&to=' + encodeURIComponent(sl(b));
      };
      function buildSearchUrl(from, to, lang, date) {
        var tl = {
          es: ['https://www.thetrainline.com/es/horarios-trenes/', '-a-'],
          fr: ['https://www.thetrainline.com/fr/horaires-trains/', '-a-'],
          de: ['https://www.thetrainline.com/de/zugverbindungen/', '-nach-'],
          it: ['https://www.thetrainline.com/it/orari-treni/',     '-a-'],
          pt: ['https://www.thetrainline.com/pt/horarios-comboios/','-a-']
        };
        var r = tl[lang] || ['https://www.thetrainline.com/train-times/', '-to-'];
        var url = r[0] + from + r[1] + to;
        if (date) url += '?outboundDate=' + encodeURIComponent(date);
        return url;
      }

      window.searchTrains = function(e) {
        e.preventDefault();
        var originEl = document.getElementById('origin');
        var destEl   = document.getElementById('dest');
        var dateVal  = document.getElementById('date').value;
        function resolveSlug(el) {
          if (el.getAttribute('data-slug')) return el.getAttribute('data-slug');
          var q = el.value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
          var cities = window._GLOSX_CITIES || [];
          for (var i = 0; i < cities.length; i++) {
            var c = cities[i];
            for (var j = 0; j < c.keywords.length; j++) {
              var kw = c.keywords[j].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
              if (kw === q || kw.indexOf(q) === 0 || q.indexOf(kw) === 0) return c.slug;
            }
          }
          return el.value.trim().toLowerCase().replace(/\s+/g, '-');
        }
        var fromSlug = resolveSlug(originEl);
        var toSlug   = resolveSlug(destEl);
        if (!fromSlug || !toSlug) return false;
        var lang = document.documentElement.lang || 'en';
        try { gtag('event','search_klook',{ from:fromSlug, to:toSlug }); } catch(_){}
        window.open(window.glosxBookTarget(fromSlug, toSlug), '_blank');
        return false;
      };
    })();

    // ── Prefill del buscador por URL (?from= / ?to=) — usado por páginas /destinos/ y /rutas/ ──
    (function() {
      try {
        var p = new URLSearchParams(window.location.search);
        var from = p.get('from'); var to = p.get('to');
        if (!from && !to) return;
        var originEl = document.getElementById('origin');
        var destEl   = document.getElementById('dest');
        if (from && originEl) originEl.value = from;
        if (to && destEl) destEl.value = to;
        var form = document.getElementById('trainSearch');
        if (form) {
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // foco en el campo que falta completar (origen si vino destino, y viceversa)
          var focusEl = (to && !from) ? originEl : destEl;
          if (focusEl) setTimeout(function(){ focusEl.focus(); }, 600);
        }
      } catch (e) {}
    })();

    // ── Partner products → redirige al proxy correspondiente ───────────────
    // Partners con widget embebido (panel desplegable). El resto va al proxy.
    const WIDGET_PANELS = { kiwitaxi: 'pw-kiwitaxi' };

    function goKlookMenu(e) {
      e.preventDefault();
      document.getElementById('partnersDropdown')?.classList.remove('open');
      document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const card = document.querySelector('.klook-city-picker');
      if (card) {
        card.classList.add('vip-card-pulse');
        setTimeout(() => card.classList.remove('vip-card-pulse'), 1800);
      }
      return false;
    }

    function goPartner(type, e) {
      e.preventDefault();
      // Si el partner tiene widget embebido, abrir el panel en vez del proxy
      const panelId = WIDGET_PANELS[type];
      if (panelId) { openWidget(panelId); return false; }
      const url = `${PROXY_BASE}/${type}`;
      window.open(url, '_blank');
      return false;
    }

    // ── Klook Hotels: menu de ciudad agrupado por pais (45 ciudades con link de afiliado) ──
    const KLOOK_HOTEL_CITIES_BY_COUNTRY = {
      'Austria': ['Graz', 'Innsbruck', 'Salzburg', 'Vienna'],
      'Belgium': ['Bruges', 'Brussels'],
      'Czech Republic': ['Brno', 'Prague'],
      'Denmark': ['Copenhagen'],
      'France': ['Bordeaux', 'Lourdes', 'Lyon', 'Nice', 'Paris', 'Tende', 'Toulouse'],
      'Germany': ['Berlin', 'Cologne', 'Dortmund', 'Frankfurt', 'Hamburg', 'Mainz', 'Munich'],
      'Hungary': ['Budapest'],
      'Italy': ['Florence', 'Milan', 'Naples', 'Pisa', 'Positano', 'Rome', 'Salerno', 'Sorrento', 'Turin', 'Venice'],
      'Monaco': ['Monaco'],
      'Netherlands': ['Amsterdam'],
      'Spain': ['Barcelona', 'Figueres', 'Girona', 'Madrid', 'Seville', 'Valencia', 'Zaragoza'],
      'Sweden': ['Stockholm'],
      'Switzerland': ['Basel', 'Bern', 'Geneva', 'Interlaken', 'Jungfraujoch', 'Lauterbrunnen', 'Lucerne', 'Sargans', 'Zermatt', 'Zurich'],
      'United Kingdom': ['Cambridge', 'Edinburgh', 'Liverpool', 'London', 'Manchester', 'Oxford', 'York'],
    };
    (function () {
      const menu = document.getElementById('klookCityMenu');
      if (!menu) return;
      menu.innerHTML = Object.entries(KLOOK_HOTEL_CITIES_BY_COUNTRY).map(([country, cities]) => `
        <div class="klook-city-group-label">${country}</div>
        ${cities.map(city => `<button type="button" class="klook-city-item" onclick="goKlookHotelCity('${city}')">${city}</button>`).join('')}
      `).join('');
    })();
    function toggleKlookCityMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      const menu = document.getElementById('klookCityMenu');
      const willOpen = !menu.classList.contains('open');
      document.querySelectorAll('.klook-city-menu.open').forEach(m => m.classList.remove('open'));
      if (willOpen) menu.classList.add('open');
    }
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.klook-city-picker')) {
        document.querySelectorAll('.klook-city-menu.open').forEach(m => m.classList.remove('open'));
      }
    });
    function goKlookHotelCity(city) {
      if (!city) return;
      window.open(`${PROXY_BASE}/klook-hotel?city=${encodeURIComponent(city)}`, '_blank');
      document.getElementById('klookCityMenu')?.classList.remove('open');
    }

    function openWidget(panelId) {
      document.querySelectorAll('.pw-panel').forEach(p => p.classList.remove('show'));
      const panel = document.getElementById(panelId);
      if (!panel) return;
      panel.classList.add('show');
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function closeWidget() {
      document.querySelectorAll('.pw-panel').forEach(p => p.classList.remove('show'));
    }

    // ── Scenic trains data + render ────────────────────────────────────────
    const SCENIC_TRAINS = [
      { name: 'Glacier Express', from: 'zermatt', to: 'st-moritz', tourUrl: 'https://tp.media/r?marker=734304&trs=534570&p=4110&u=https%3A%2F%2Fwww.klook.com%2Factivity%2F101898-glacier-express-panoramic-train-private-day-tour%2F&campaign_id=137', photo: 'https://images.unsplash.com/photo-1716118069021-2b21d392489b?w=1000&q=80', route: 'Zermatt → St. Moritz · 7h 45min', origin: 'Zermatt', dest: 'St. Moritz', g1: '#C0392B', g2: '#922B21',
        desc: { en: '291 bridges and 91 tunnels through glaciers and snow-capped Swiss Alps.', es: '291 puentes y 91 túneles entre glaciares y cumbres nevadas de los Alpes suizos.', fr: '291 ponts et 91 tunnels entre glaciers et cimes enneigées des Alpes suisses.', de: '291 Brücken und 91 Tunnel zwischen Gletschern und schneebedeckten Schweizer Alpen.', it: '291 ponti e 91 gallerie tra ghiacciai e cime innevate delle Alpi svizzere.', pt: '291 pontes e 91 túneis entre glaciares e picos nevados dos Alpes suíços.' } },
      { name: 'Bernina Express', from: 'chur', to: 'tirano', tourUrl: 'https://tp.media/r?marker=734304&trs=534570&p=4110&u=https%3A%2F%2Fwww.klook.com%2Factivity%2F50302-bernina-trenino-svizzera-alpi%2F&campaign_id=137', photo: 'https://images.unsplash.com/photo-1553670590-f58a6135f69e?w=1000&q=80', route: 'Chur → Tirano · 4h 0min', origin: 'Chur', dest: 'Tirano', g1: '#1A5276', g2: '#154360',
        desc: { en: 'UNESCO heritage. Europe\'s highest mountain pass by train.', es: 'Patrimonio UNESCO. El paso de montaña más alto de Europa en tren.', fr: 'Patrimoine UNESCO. Le col le plus haut d\'Europe en train.', de: 'UNESCO-Welterbe. Europas höchster Bergpass mit dem Zug.', it: 'Patrimonio UNESCO. Il valico più alto d\'Europa in treno.', pt: 'Patrimônio UNESCO. A passagem de montanha mais alta da Europa de comboio.' } },
      { name: 'GoldenPass Express', from: 'montreux', to: 'interlaken-ost', photo: '/scenic/goldenpass.jpg', route: 'Montreux → Interlaken · 3h 19min', origin: 'Montreux', dest: 'Interlaken Ost', g1: '#B7950B', g2: '#9A7D0A',
        desc: { en: 'From Lake Geneva to the Bernese Oberland in panoramic cars with extra-wide windows.', es: 'Del Lago Lemán al Oberland bernés en vagones panorámicos con ventanas extra anchas.', fr: 'Du Léman à l\'Oberland bernois en voitures panoramiques aux fenêtres extra larges.', de: 'Vom Genfersee ins Berner Oberland in Panoramawagen mit extra breiten Fenstern.', it: 'Dal Lago Lemano all\'Oberland bernese in carrozze panoramiche con finestre extra larghe.', pt: 'Do Lago Léman ao Oberland bernês em vagões panorâmicos com janelas extra largas.' } },
      { name: 'TGV Lyria', from: 'paris', to: 'geneva', photo: '/scenic/tgv-lyria.jpg', route: 'Paris → Geneva · 3h 5min', origin: 'Paris Gare de Lyon', dest: 'Genève', g1: '#C0392B', g2: '#922B21',
        desc: { en: 'French-Swiss high-speed with Alpine views before reaching the lake.', es: 'Alta velocidad franco-suiza con vistas de los Alpes antes de llegar al lago.', fr: 'Grande vitesse franco-suisse avec vue sur les Alpes avant le lac.', de: 'Französisch-schweizerischer Hochgeschwindigkeitszug mit Alpenblick.', it: 'Alta velocità franco-svizzera con vista sulle Alpi prima del lago.', pt: 'Alta velocidade franco-suíça com vistas dos Alpes antes do lago.' } },
      { name: 'Train des Merveilles', from: 'nice', to: 'tende', photo: '/scenic/train-des-merveilles.jpg', route: 'Nice → Tende · 2h 10min', origin: 'Nice Ville', dest: 'Tende', g1: '#2471A3', g2: '#1A5276',
        desc: { en: 'From the Mediterranean to Alpine valleys with 5,000-year-old rock carvings.', es: 'Del Mediterráneo a los valles alpinos con grabados rupestres de 5.000 años.', fr: 'De la Méditerranée aux vallées alpines avec des gravures rupestres de 5 000 ans.', de: 'Vom Mittelmeer zu den Alpentälern mit 5.000 Jahre alten Felsgravuren.', it: 'Dal Mediterraneo alle valli alpine con incisioni rupestri di 5.000 anni.', pt: 'Do Mediterrâneo aos vales alpinos com gravuras rupestres de 5.000 anos.' } },
      { name: 'Cinque Terre Express', from: 'la-spezia', to: 'levanto', photo: '/scenic/cinque-terre.jpg', route: 'La Spezia → Levanto · 30min', origin: 'La Spezia Centrale', dest: 'Levanto', g1: '#1E8449', g2: '#196F3D',
        desc: { en: 'Five colorful villages clinging to the cliffs. The easiest way to visit them all.', es: 'Cinco aldeas de colores pegadas al acantilado. La forma más cómoda de recorrerlas.', fr: 'Cinq villages colorés accrochés à la falaise. La façon la plus simple de tous les visiter.', de: 'Fünf bunte Dörfer an der Steilküste. Der einfachste Weg, sie alle zu besuchen.', it: 'Cinque borghi colorati a strapiombo sul mare. Il modo più comodo per visitarli.', pt: 'Cinco aldeias coloridas sobre a falésia. A forma mais cómoda de as visitar.' } },
      { name: 'Frecciarossa', from: 'rome', to: 'venice', photo: '/scenic/frecciarossa.jpg', route: 'Rome → Venice · 3h 45min', origin: 'Roma Termini', dest: 'Venezia S. Lucia', g1: '#C0392B', g2: '#7B241C',
        desc: { en: 'Italy\'s most iconic train. Rome to Venice at 300 km/h.', es: 'El tren más icónico de Italia. Roma a Venecia a 300 km/h.', fr: 'Le train le plus emblématique d\'Italie. Rome-Venise à 300 km/h.', de: 'Italiens berühmtester Zug. Rom nach Venedig mit 300 km/h.', it: 'Il treno più iconico d\'Italia. Roma-Venezia a 300 km/h.', pt: 'O comboio mais icónico de Itália. Roma a Veneza a 300 km/h.' } },
      { name: 'Rhine Valley', from: 'cologne', to: 'mainz', photo: '/scenic/rhine-valley.jpg', route: 'Köln → Mainz · 1h 55min', origin: 'Köln Hbf', dest: 'Mainz Hbf', g1: '#922B21', g2: '#7B241C',
        desc: { en: 'Medieval castles, terraced vineyards and the legendary Lorelei rock.', es: 'Castillos medievales, viñedos en terrazas y el legendario peñasco de Loreley.', fr: 'Châteaux médiévaux, vignobles en terrasses et le légendaire rocher de la Lorelei.', de: 'Mittelalterliche Burgen, Weinterrassen und der legendäre Loreley-Felsen.', it: 'Castelli medievali, vigneti terrazzati e la leggendaria rupe di Loreley.', pt: 'Castelos medievais, vinhas em terraços e o lendário penhasco de Loreley.' } },
      { name: 'Bavaria Alps', from: 'munich', to: 'salzburg', photo: '/scenic/bavaria-alps.jpg', route: 'München → Salzburg · 1h 30min', origin: 'München Hbf', dest: 'Salzburg Hbf', g1: '#1A5276', g2: '#154360',
        desc: { en: 'From Bavaria\'s capital to Mozart\'s city along the Alps. Turquoise lakes and snowy peaks.', es: 'De la capital bávara a Mozart bordeando los Alpes. Lagos turquesa y cumbres nevadas.', fr: 'De la capitale bavaroise à Mozart en longeant les Alpes. Lacs turquoise et sommets enneigés.', de: 'Von der bayerischen Hauptstadt nach Mozart entlang der Alpen. Türkisfarbene Seen und schneebedeckte Gipfel.', it: 'Dalla capitale bavarese alla città di Mozart lungo le Alpi. Laghi turchesi e cime innevate.', pt: 'Da capital bávara a Mozart ao longo dos Alpes. Lagos turquesa e picos nevados.' } },
      { name: 'Arlberg Express', from: 'innsbruck', to: 'bregenz', photo: '/scenic/arlberg-express.jpg', route: 'Innsbruck → Bregenz · 2h 15min', origin: 'Innsbruck Hbf', dest: 'Bregenz', g1: '#1E8449', g2: '#196F3D',
        desc: { en: 'Crosses the Arlberg Pass, one of the most dramatic in the Austrian Alps, from the heart of Tyrol to Lake Constance.', es: 'Atraviesa el paso de Arlberg, uno de los más imponentes de los Alpes austríacos, desde el corazón del Tirol hasta el Lago de Constanza.', fr: 'Traverse le col de l\'Arlberg, l\'un des plus impressionnants des Alpes autrichiennes, du cœur du Tyrol au lac de Constance.', de: 'Durchquert den Arlbergpass, einen der eindrucksvollsten der österreichischen Alpen, vom Herzen Tirols bis zum Bodensee.', it: 'Attraversa il passo dell\'Arlberg, uno dei più imponenti delle Alpi austriache, dal cuore del Tirolo al Lago di Costanza.', pt: 'Atravessa o passo de Arlberg, um dos mais imponentes dos Alpes austríacos, do coração do Tirol até o Lago de Constança.' } },
      { name: 'Semmering Express', from: 'vienna', to: 'graz', photo: '/scenic/semmering.jpg', route: 'Vienna → Graz · 2h 39min', origin: 'Wien Hbf', dest: 'Graz Hbf', g1: '#B7950B', g2: '#9A7D0A',
        desc: { en: 'The world\'s oldest mountain railway. UNESCO heritage since the 19th century.', es: 'El ferrocarril de montaña más antiguo del mundo. Patrimonio UNESCO desde el siglo XIX.', fr: 'Le plus ancien chemin de fer de montagne au monde. Patrimoine UNESCO depuis le XIXe siècle.', de: 'Die älteste Gebirgsbahn der Welt. UNESCO-Welterbe seit dem 19. Jahrhundert.', it: 'La più antica ferrovia di montagna del mondo. Patrimonio UNESCO dal XIX secolo.', pt: 'A ferrovia de montanha mais antiga do mundo. Patrimônio UNESCO desde o século XIX.' } },
      { name: 'Douro Valley', from: 'porto', to: 'pocinho', tourUrl: 'https://tp.media/r?marker=734304&trs=534570&p=4110&u=https%3A%2F%2Fwww.klook.com%2Factivity%2F113775-douro-valley-small-group-day-tour-lunch%2F&campaign_id=137', photo: '/scenic/douro-valley.jpg', route: 'Porto → Pocinho · 3h 30min', origin: 'Porto Campanhã', dest: 'Pocinho', g1: '#784212', g2: '#6E2C00',
        desc: { en: 'Port wine vineyards on schist terraces. One of the world\'s most beautiful train rides.', es: 'Viñedos del Oporto en terrazas de esquisto. Uno de los trayectos más bellos del mundo.', fr: 'Vignobles de Porto en terrasses de schiste. L\'un des plus beaux trajets au monde.', de: 'Portwein-Weinberge auf Schieferterrassen. Eine der schönsten Bahnstrecken der Welt.', it: 'Vigneti del Porto su terrazze di scisto. Uno dei viaggi in treno più belli del mondo.', pt: 'Vinhas do Porto em socalcos de xisto. Uma das viagens de comboio mais belas do mundo.' } },
      { name: 'Intercity Direct', from: 'amsterdam', to: 'brussels', photo: '/scenic/intercity-direct.jpg', route: 'Amsterdam → Brussels · 1h 51min', origin: 'Amsterdam Centraal', dest: 'Brussel-Zuid', g1: '#E67E22', g2: '#CA6F1E',
        desc: { en: 'From Amsterdam\'s canals to the Grand Place through polders and Belgian countryside.', es: 'De los canales de Ámsterdam al Grand Place atravesando pólderes y campiña belga.', fr: 'Des canaux d\'Amsterdam à la Grand-Place à travers les polders et la campagne belge.', de: 'Von Amsterdams Grachten zum Grand Place durch Polder und belgische Landschaft.', it: 'Dai canali di Amsterdam alla Grand Place tra polder e campagna belga.', pt: 'Dos canais de Amesterdão à Grand Place atravessando pôlderes e o campo belga.' } },
      { name: 'Thalys', from: 'brussels', to: 'paris', photo: '/scenic/thalys.jpg', route: 'Brussels → Paris · 1h 22min', origin: 'Brussel-Zuid', dest: 'Paris Gare du Nord', g1: '#C0392B', g2: '#7B241C',
        desc: { en: 'Europe\'s most famous red train. Brussels to Paris in under 90 minutes at 300 km/h.', es: 'El tren rojo más famoso de Europa. Bruselas a París en menos de hora y media a 300 km/h.', fr: 'Le train rouge le plus célèbre d\'Europe. Bruxelles-Paris en moins d\'1h30 à 300 km/h.', de: 'Europas berühmtester roter Zug. Brüssel nach Paris in unter 90 Minuten mit 300 km/h.', it: 'Il treno rosso più famoso d\'Europa. Bruxelles-Parigi in meno di 90 minuti a 300 km/h.', pt: 'O comboio vermelho mais famoso da Europa. Bruxelas a Paris em menos de 90 minutos a 300 km/h.' } },
    ];

    let scenicExpanded = false;
    let scenicFeatured = 0;

    // Panel destacado: muestra la ruta seleccionada (foto si existe, si no gradiente)
    function featureScenic(i) {
      const t = SCENIC_TRAINS[i];
      if (!t) return;
      scenicFeatured = i;
      const lang = document.documentElement.lang || 'en';
      const desc = (t.desc && t.desc[lang]) || (t.desc && t.desc.en) || '';
      const book = (TRANSLATIONS[lang] || TRANSLATIONS.en).scenic_book || 'Book now';
      const fe = document.getElementById('scenicFeature');
      if (!fe) return;
      fe.style.background = t.photo
        ? `url('${t.photo}') center/cover no-repeat`
        : `linear-gradient(135deg, ${t.g1}, ${t.g2})`;
      fe.innerHTML = `
        <div class="sf-content">
          <span class="sf-badge">Featured route</span>
          <div class="sf-name">${t.name}</div>
          <div class="sf-route">${t.route}</div>
          <div class="sf-desc">${desc}</div>
          <button class="sf-btn" onclick="goScenic('${t.from}','${t.to}', event, ${t.tourUrl ? `'${t.tourUrl}'` : 'null'})">${book} →</button>
        </div>`;
      const c = fe.querySelector('.sf-content');
      if (c) { c.style.opacity = '0'; requestAnimationFrame(() => { c.style.opacity = '1'; }); }
      // resaltar la tarjeta activa
      document.querySelectorAll('.scenic-wrapper').forEach((w, idx) =>
        w.classList.toggle('scenic-active', idx === i));
    }

    function renderScenic() {
      const grid = document.getElementById('scenicGrid');
      const lang = document.documentElement.lang || 'en';
      const list = scenicExpanded ? SCENIC_TRAINS : SCENIC_TRAINS.slice(0, 6);
      grid.innerHTML = list.map((t, i) => {
        const desc = (t.desc && t.desc[lang]) || (t.desc && t.desc.en) || '';
        return `
        <div class="scenic-wrapper${i === scenicFeatured ? ' scenic-active' : ''}">
          <a href="#" class="scenic-card" onclick="featureScenic(${i}); return false;">
            <div class="scenic-icon" style="background: linear-gradient(135deg, ${t.g1}, ${t.g2});"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15l0-8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8"/><path d="M4 15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/><circle cx="8.5" cy="19.5" r="1.5"/><circle cx="15.5" cy="19.5" r="1.5"/><path d="M7 11h10"/><path d="M12 4v7"/></svg></div>
            <div class="scenic-body">
              <div class="scenic-name">${t.name}</div>
              <div class="scenic-route">${t.route}</div>
            </div>
            <div class="scenic-cta" onclick="event.stopPropagation(); goScenic('${t.from}','${t.to}', event, ${t.tourUrl ? `'${t.tourUrl}'` : 'null'})" data-i18n="scenic_book">${(TRANSLATIONS[lang] || TRANSLATIONS.en).scenic_book || 'Book now'}</div>
          </a>
          <div class="scenic-desc">${desc}</div>
        </div>`;
      }).join('');
      if (scenicFeatured >= list.length) scenicFeatured = 0;
      featureScenic(scenicFeatured);
    }
    function toggleScenic() {
      scenicExpanded = !scenicExpanded;
      renderScenic();
      const btn = document.getElementById('scenicToggle');
      btn.setAttribute('data-i18n', scenicExpanded ? 'scenic_less' : 'scenic_more');
      applyLang(document.documentElement.lang || 'en');
      positionScenicDescs();
    }
    renderScenic();

    function positionScenicDescs() {
      const grid = document.getElementById('scenicGrid');
      if (!grid) return;
      const gridCenter = grid.getBoundingClientRect().left + grid.offsetWidth / 2;
      grid.querySelectorAll('.scenic-wrapper').forEach(wrapper => {
        const wrapperCenter = wrapper.getBoundingClientRect().left + wrapper.offsetWidth / 2;
        wrapper.classList.toggle('desc-left', wrapperCenter < gridCenter);
      });
    }
    requestAnimationFrame(positionScenicDescs);
    window.addEventListener('resize', positionScenicDescs);

    function goScenic(from, to, e, tourUrl) {
      e.preventDefault();
      try { gtag('event','scenic_route',{ from:from, to:to, isTour: !!tourUrl }); } catch(_){}
      window.open(tourUrl || window.glosxBookTarget(from, to), '_blank');
      return false;
    }

  


(function () {

  const ROUTES = {
    classic: {
      title: {
        en: "Classic Route · France–Italy",
        es: "Ruta Clásica · Francia–Italia",
        fr: "Route Classique · France–Italie",
        de: "Klassische Route · Frankreich–Italien",
        it: "Percorso Classico · Francia–Italia",
        pt: "Rota Clássica · França–Itália"
      },
      meta: {
        en: "Paris → Lyon → Turin → Milan · high-speed, ~7–8 h",
        es: "Paris → Lyon → Turín → Milán · alta velocidad, ~7–8 h",
        fr: "Paris → Lyon → Turin → Milan · grande vitesse, ~7–8 h",
        de: "Paris → Lyon → Turin → Mailand · Hochgeschwindigkeit, ~7–8 Std.",
        it: "Parigi → Lione → Torino → Milano · alta velocità, ~7–8 h",
        pt: "Paris → Lyon → Turim → Milão · alta velocidade, ~7–8 h"
      },
      from: "paris", to: "milan",
      stops: [
        {
          slug: "paris", station: "Paris (Gare de Lyon)", train: "TGV INOUI",
          desc_en: "You set off under the iron vault of Gare de Lyon. The TGV hurls you south at 300 km/h as the city dissolves into vineyards.",
          desc_es: "Partes bajo la bóveda de hierro de la Gare de Lyon. El TGV te lanza hacia el sur a 300 km/h mientras la ciudad se disuelve en viñedos.",
          desc_fr: "Vous partez sous la voûte de fer de la Gare de Lyon. Le TGV vous propulse vers le sud à 300 km/h tandis que la ville se fond dans les vignes.",
          desc_de: "Sie starten unter dem Eisengewölbe des Gare de Lyon. Der TGV schleudert Sie mit 300 km/h gen Süden, während die Stadt in Weinbergen verblasst.",
          desc_it: "Parti sotto la volta di ferro della Gare de Lyon. Il TGV ti lancia a sud a 300 km/h mentre la città svanisce tra i vigneti.",
          desc_pt: "Partes sob a abóbada de ferro da Gare de Lyon. O TGV lança-te para sul a 300 km/h enquanto a cidade se dissolve em vinhedos."
        },
        {
          slug: "lyon", station: "Lyon (Part-Dieu)", train: "TGV → Frecciarossa link",
          desc_en: "France's gastronomic capital. You switch onto the alpine corridor — ahead lie the Fréjus tunnel and the Italian border.",
          desc_es: "La capital gastronómica de Francia. Tomás el corredor alpino — por delante el túnel de Fréjus y la frontera italiana.",
          desc_fr: "La capitale gastronomique de France. Vous prenez le corridor alpin — devant vous, le tunnel du Fréjus et la frontière italienne.",
          desc_de: "Frankreichs gastronomische Hauptstadt. Sie wechseln auf den Alpenkorridor — vor Ihnen liegen der Fréjus-Tunnel und die italienische Grenze.",
          desc_it: "La capitale gastronomica della Francia. Si prende il corridoio alpino — avanti il tunnel del Fréjus e il confine italiano.",
          desc_pt: "A capital gastronómica de França. Trocas para o corredor alpino — à frente o túnel do Fréjus e a fronteira italiana."
        },
        {
          slug: "turin", station: "Turin (Porta Susa)", train: "Frecciarossa",
          desc_en: "First Italian breath. Baroque arcades, the Alps at your back, and Trenitalia's red bullet to carry you the final leg.",
          desc_es: "Primer aire italiano. Arcadas barrocas, los Alpes a tu espalda, y la bala roja de Trenitalia para el último tramo.",
          desc_fr: "Premier souffle italien. Arcades baroques, les Alpes dans votre dos, et le TGV rouge de Trenitalia pour la dernière étape.",
          desc_de: "Erster italienischer Atemzug. Barocke Arkaden, die Alpen im Rücken, und Trenitalia's roter Bullet für den letzten Abschnitt.",
          desc_it: "Primo respiro italiano. Portici barocchi, le Alpi alle spalle, e il Frecciarossa per l'ultima tappa.",
          desc_pt: "Primeiro fôlego italiano. Arcadas barrocas, os Alpes às costas, e o bala vermelho da Trenitalia para o trecho final."
        },
        {
          slug: "milan", station: "Milan (Centrale)", train: "Arrival",
          desc_en: "You step out into Milan's cathedral-station. Fashion, the Duomo and a victory espresso: your Classic Route is complete.",
          desc_es: "Salís a la estación-catedral de Milán. Moda, el Duomo y un espresso de victoria: tu Ruta Clásica está completa.",
          desc_fr: "Vous sortez dans la gare-cathédrale de Milan. Mode, le Dôme et un espresso de victoire : votre Route Classique est accomplie.",
          desc_de: "Sie treten in Mailands Kathedralenbahnhof hinaus. Mode, der Dom und ein Sieges-Espresso: Ihre Klassische Route ist vollbracht.",
          desc_it: "Esci nella stazione-cattedrale di Milano. Moda, il Duomo e un espresso della vittoria: il tuo Percorso Classico è completo.",
          desc_pt: "Sais para a estação-catedral de Milão. Moda, o Duomo e um espresso da vitória: a tua Rota Clássica está completa."
        }
      ]
    },
    alpine: {
      title: {
        en: "Alpine Route · Switzerland–Austria",
        es: "Ruta Alpina · Suiza–Austria",
        fr: "Route Alpine · Suisse–Autriche",
        de: "Alpine Route · Schweiz–Österreich",
        it: "Percorso Alpino · Svizzera–Austria",
        pt: "Rota Alpina · Suíça–Áustria"
      },
      meta: {
        en: "Zurich → Sargans → Innsbruck → Vienna · Railjet ÖBB/SBB",
        es: "Zúrich → Sargans → Innsbruck → Viena · Railjet ÖBB/SBB",
        fr: "Zurich → Sargans → Innsbruck → Vienne · Railjet ÖBB/SBB",
        de: "Zürich → Sargans → Innsbruck → Wien · Railjet ÖBB/SBB",
        it: "Zurigo → Sargans → Innsbruck → Vienna · Railjet ÖBB/SBB",
        pt: "Zurique → Sargans → Innsbruck → Viena · Railjet ÖBB/SBB"
      },
      from: "zurich", to: "vienna",
      stops: [
        {
          slug: "zurich", station: "Zurich (HB)", train: "Railjet / EC",
          desc_en: "The most punctual station on earth waves you off. The train skirts postcard lakes before burrowing into the heart of the Alps.",
          desc_es: "La estación más puntual de la tierra te despide. El tren bordea lagos de postal antes de adentrarse en el corazón de los Alpes.",
          desc_fr: "La gare la plus ponctuelle du monde vous dit au revoir. Le train longe des lacs de carte postale avant de plonger au cœur des Alpes.",
          desc_de: "Der pünktlichste Bahnhof der Welt verabschiedet Sie. Der Zug umfährt malerische Seen, bevor er ins Herz der Alpen taucht.",
          desc_it: "La stazione più puntuale della terra ti saluta. Il treno costeggia laghi da cartolina prima di inoltrarsi nel cuore delle Alpi.",
          desc_pt: "A estação mais pontual do mundo despede-se de ti. O comboio contorna lagos de postal antes de mergulhar no coração dos Alpes."
        },
        {
          slug: "sargans", station: "Sargans", train: "EuroCity",
          desc_en: "Alpine gateway between Switzerland and the Rhine valley. Snow peaks rise on both sides of the window, almost close enough to touch.",
          desc_es: "Puerta alpina entre Suiza y el valle del Rin. Cimas nevadas se alzan a ambos lados de la ventanilla, casi al alcance de la mano.",
          desc_fr: "Porte alpine entre la Suisse et la vallée du Rhin. Des sommets enneigés s'élèvent des deux côtés de la fenêtre, presque à portée de main.",
          desc_de: "Alpentor zwischen der Schweiz und dem Rheintal. Schneebedeckte Gipfel erheben sich auf beiden Seiten des Fensters, fast zum Greifen nah.",
          desc_it: "Porta alpina tra la Svizzera e la valle del Reno. Vette innevate si alzano su entrambi i lati del finestrino, quasi a portata di mano.",
          desc_pt: "Porta alpina entre a Suíça e o vale do Reno. Picos nevados erguem-se em ambos os lados da janela, quase ao alcance da mão."
        },
        {
          slug: "innsbruck", station: "Innsbruck (Hbf)", train: "Railjet ÖBB",
          desc_en: "Tyrol at its purest — the Olympic city cradled by mountains. Here Austria's imperial train takes over toward the east.",
          desc_es: "El Tirol en estado puro — la ciudad olímpica entre montañas. Aquí el tren imperial austriaco toma el relevo hacia el este.",
          desc_fr: "Le Tyrol dans toute sa splendeur — la ville olympique entre les montagnes. Ici, le train impérial autrichien prend le relais vers l'est.",
          desc_de: "Tirol in seiner reinsten Form — die Olympiastadt eingebettet in Berge. Hier übernimmt Österreichs kaiserlicher Zug nach Osten.",
          desc_it: "Il Tirolo nella sua essenza — la città olimpica abbracciata dalle montagne. Qui il treno imperiale austriaco prende il comando verso est.",
          desc_pt: "O Tirol na sua forma mais pura — a cidade olímpica embalada pelas montanhas. Aqui o comboio imperial austríaco assume o caminho para leste."
        },
        {
          slug: "vienna", station: "Vienna (Hbf)", train: "Arrival",
          desc_en: "You reach the capital of waltzes after crossing Europe's spine. A well-earned Viennese coffee: alpine mission accomplished.",
          desc_es: "Llegás a la capital de los valses tras cruzar la espina de Europa. Un merecido café vienés: misión alpina cumplida.",
          desc_fr: "Vous arrivez à la capitale des valses après avoir traversé l'épine de l'Europe. Un café viennois bien mérité : mission alpine accomplie.",
          desc_de: "Sie erreichen die Walzerstadt nach dem Überqueren von Europas Rückgrat. Ein wohlverdienter Wiener Kaffee: Alpenmission erfüllt.",
          desc_it: "Arrivi alla capitale dei valzer dopo aver attraversato la spina dorsale d'Europa. Un meritato caffè viennese: missione alpina compiuta.",
          desc_pt: "Chegas à capital das valsas após cruzar a espinha dorsal da Europa. Um bem-merecido café vienense: missão alpina cumprida."
        }
      ]
    },
    imperial: {
      title: {
        en: "Imperial Route · Central Europe",
        es: "Ruta Imperial · Europa Central",
        fr: "Route Impériale · Europe Centrale",
        de: "Imperiale Route · Mitteleuropa",
        it: "Percorso Imperiale · Europa Centrale",
        pt: "Rota Imperial · Europa Central"
      },
      meta: {
        en: "Prague → Brno → Vienna → Budapest · Railjet / EuroCity",
        es: "Praga → Brno → Viena → Budapest · Railjet / EuroCity",
        fr: "Prague → Brno → Vienne → Budapest · Railjet / EuroCity",
        de: "Prag → Brno → Wien → Budapest · Railjet / EuroCity",
        it: "Praga → Brno → Vienna → Budapest · Railjet / EuroCity",
        pt: "Praga → Brno → Viena → Budapeste · Railjet / EuroCity"
      },
      from: "prague", to: "budapest",
      stops: [
        {
          slug: "prague", station: "Prague (hl. n.)", train: "Railjet",
          desc_en: "The city of a hundred spires falls behind. The Railjet sweeps into Moravia past castles and golden fields.",
          desc_es: "La ciudad de las cien torres queda atrás. El Railjet se adentra en Moravia entre castillos y campos dorados.",
          desc_fr: "La ville aux cent clochers reste derrière. Le Railjet s'élance en Moravie entre châteaux et champs dorés.",
          desc_de: "Die Stadt der hundert Türme bleibt zurück. Der Railjet fährt durch Mähren an Burgen und goldenen Feldern vorbei.",
          desc_it: "La città delle cento guglie rimane indietro. Il Railjet si lancia in Moravia tra castelli e campi dorati.",
          desc_pt: "A cidade das cem torres fica para trás. O Railjet avança pela Morávia entre castelos e campos dourados."
        },
        {
          slug: "brno", station: "Brno (hl. n.)", train: "EuroCity",
          desc_en: "Moravian heart and a historic rail hub of the Empire. A brief stop before crossing into Austrian lands.",
          desc_es: "Corazón de Moravia y nudo ferroviario histórico del Imperio. Una breve parada antes de cruzar a tierras austriacas.",
          desc_fr: "Cœur de la Moravie et carrefour ferroviaire historique de l'Empire. Un bref arrêt avant de passer en terres autrichiennes.",
          desc_de: "Mährisches Herz und historischer Eisenbahnknotenpunkt des Reiches. Ein kurzer Halt, bevor es nach Österreich geht.",
          desc_it: "Cuore della Moravia e storico nodo ferroviario dell'Impero. Una breve sosta prima di entrare in terra austriaca.",
          desc_pt: "Coração da Morávia e histórico nó ferroviário do Império. Uma breve paragem antes de cruzar para terras austríacas."
        },
        {
          slug: "vienna", station: "Vienna (Hbf)", train: "Railjet ÖBB",
          desc_en: "The old Habsburg capital — palaces, opera and monumental platforms. From here, the final hop toward the Danube.",
          desc_es: "La antigua capital habsburga — palacios, ópera y andenes monumentales. Desde aquí, el último salto hacia el Danubio.",
          desc_fr: "L'ancienne capitale des Habsbourg — palais, opéra et quais monumentaux. D'ici, le dernier saut vers le Danube.",
          desc_de: "Die alte Habsburger Hauptstadt — Paläste, Oper und monumentale Bahnsteige. Von hier der letzte Sprung zur Donau.",
          desc_it: "L'antica capitale asburgica — palazzi, opera e banchine monumentali. Da qui, l'ultimo salto verso il Danubio.",
          desc_pt: "A antiga capital habsburga — palácios, ópera e plataformas monumentais. Daqui, o último salto em direção ao Danúbio."
        },
        {
          slug: "budapest", station: "Budapest (Keleti)", train: "Arrival",
          desc_en: "Keleti station, a 19th-century jewel, welcomes you. Buda and Pest split by the river: the imperial finale of your adventure.",
          desc_es: "La estación Keleti, joya del siglo XIX, te recibe. Buda y Pest separadas por el río: el final imperial de tu aventura.",
          desc_fr: "La gare Keleti, joyau du XIXe siècle, vous accueille. Buda et Pest séparées par le fleuve : le final impérial de votre aventure.",
          desc_de: "Der Keleti-Bahnhof, ein Juwel des 19. Jahrhunderts, empfängt Sie. Buda und Pest durch den Fluss getrennt: das imperiale Finale Ihres Abenteuers.",
          desc_it: "La stazione Keleti, gioiello del XIX secolo, ti dà il benvenuto. Buda e Pest separate dal fiume: il finale imperiale della tua avventura.",
          desc_pt: "A estação Keleti, joia do século XIX, dá-te as boas-vindas. Buda e Pest separadas pelo rio: o final imperial da tua aventura."
        }
      ]
    }
  };

  // Clave de ruta actualmente visible (para re-renderizar al cambiar idioma)
  let _activeRouteKey = null;

  const buttons  = document.querySelectorAll(".wt-route-btn");
  const timeline = document.getElementById("wt-timeline");
  const wrapEl   = document.getElementById("wt-wrap");
  const head     = document.getElementById("wt-timeline-head");
  const titleEl  = document.getElementById("wt-route-title");
  const metaEl   = document.getElementById("wt-route-meta");
  const ctaSlot  = document.getElementById("wt-cta-slot");
  const closeBtn = document.getElementById("wt-close");

  function closeTimeline() {
    _activeRouteKey = null;
    buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
    timeline.innerHTML = "";
    ctaSlot.innerHTML = "";
    closeBtn.hidden = true;
    wrapEl.hidden = true;
  }
  if (closeBtn) closeBtn.addEventListener("click", closeTimeline);

  function render(key) {
    const route = ROUTES[key];
    if (!route) return;
    _activeRouteKey = key;
    const lang = document.documentElement.lang || 'en';
    const safeLang = route.title[lang] ? lang : 'en';
    wrapEl.hidden = false;
    titleEl.textContent = route.title[safeLang];
    metaEl.textContent  = route.meta[safeLang];
    timeline.innerHTML = "";
    const buyLabel = ((TRANSLATIONS[safeLang] || TRANSLATIONS.en).ai_buy_ticket) || 'Buy ticket →';
    route.stops.forEach((stop, i) => {
      const desc = stop['desc_' + safeLang] || stop.desc_en;
      const next = route.stops[i + 1];
      const li = document.createElement("li");
      li.className = "wt-stop";
      li.style.animationDelay = (i * 0.12) + "s";
      li.innerHTML =
        '<span class="wt-stop-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="13" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="M8 19l-2 3"/><path d="M18 22l-2-3"/><circle cx="7.5" cy="14.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="16.5" cy="14.5" r="1.4" fill="currentColor" stroke="none"/></svg></span>' +
        '<p class="wt-stop-station">' + stop.station + '</p>' +
        '<span class="wt-stop-train">&#8594; ' + stop.train + '</span>' +
        '<p class="wt-stop-desc">' + desc + '</p>' +
        (next && stop.slug && next.slug
          ? '<button type="button" class="wt-stop-buy" onclick="window.open(window.glosxBookTarget(\'' + stop.slug + '\',\'' + next.slug + '\'),\'_blank\')">' + buyLabel + '</button>'
          : '');
      timeline.appendChild(li);
    });
    // CTA: solo descarga del itinerario en PDF — la compra de billetes ahora es por tramo, ver cada parada.
    var _pdfText = (lang==='es')?'Descargar itinerario (PDF)':(lang==='fr')?"Télécharger l'itinéraire (PDF)":(lang==='de')?'Reiseplan herunterladen (PDF)':(lang==='it')?'Scarica itinerario (PDF)':(lang==='pt')?'Baixar itinerário (PDF)':'Download itinerary (PDF)';
    var _dlIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
    ctaSlot.innerHTML =
      '<div class="wt-cta-row">' +
      '<button type="button" class="wt-pdf-btn" onclick="downloadItinerary(\'' + key + '\')">' + _dlIcon + '<span>' + _pdfText + '</span></button>' +
      '</div>';
    closeBtn.hidden = false;
  }

  // Exponer para que applyLang() re-renderice la ruta activa al cambiar idioma
  window.wtRefreshTimeline = function () {
    if (_activeRouteKey) render(_activeRouteKey);
  };

  // Generar y descargar el itinerario en PDF (marca + mapa + recorrido + link)
  window.downloadItinerary = async function (key) {
    var route = ROUTES[key];
    if (!route || !window.jspdf) return;
    var btn = document.querySelector('.wt-pdf-btn');
    if (btn) btn.disabled = true;
    try {
      var lang = document.documentElement.lang || 'en';
      var L = route.title[lang] ? lang : 'en';
      var jsPDF = window.jspdf.jsPDF;
      var doc = new jsPDF({ unit: 'pt', format: 'a4' });
      var P = 40, W = 595.28, CW = W - P * 2, y;
      doc.setFillColor(124, 58, 237); doc.rect(0, 0, W, 6, 'F');
      doc.setFont('helvetica', 'bold'); doc.setTextColor(124, 58, 237); doc.setFontSize(20);
      doc.text('WoW Train', P, 48);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(130, 130, 150); doc.setFontSize(10);
      doc.text('glosx.app', W - P, 48, { align: 'right' });
      doc.setFont('helvetica', 'bold'); doc.setTextColor(25, 25, 35); doc.setFontSize(16);
      doc.text(route.title[L], P, 82);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(110, 110, 130); doc.setFontSize(10);
      doc.text(route.meta[L], P, 98);
      var img = await new Promise(function (res, rej) {
        var im = new Image(); im.onload = function () { res(im); }; im.onerror = rej;
        im.src = '/assets/img/map-' + key + '.jpg';
      });
      var ratio = img.naturalHeight / img.naturalWidth;
      var mw = CW, mh = CW * ratio;
      if (mh > 340) { mh = 340; mw = mh / ratio; }
      var mx = P + (CW - mw) / 2;
      doc.addImage(img, 'JPEG', mx, 112, mw, mh);
      y = 112 + mh + 26;
      for (var i = 0; i < route.stops.length; i++) {
        var s = route.stops[i];
        if (y > 770) { doc.addPage(); y = 56; }
        doc.setFont('helvetica', 'bold'); doc.setTextColor(124, 58, 237); doc.setFontSize(12);
        doc.text((i + 1) + '.  ' + s.station + '   ·   ' + s.train, P, y); y += 16;
        doc.setFont('helvetica', 'normal'); doc.setTextColor(55, 55, 70); doc.setFontSize(10);
        var desc = s['desc_' + L] || s.desc_en;
        var lines = doc.splitTextToSize(desc, CW);
        doc.text(lines, P, y); y += lines.length * 13 + 14;
      }
      if (y > 760) { doc.addPage(); y = 56; }
      doc.setDrawColor(220, 220, 228); doc.line(P, y, W - P, y); y += 18;
      doc.setFont('helvetica', 'bold'); doc.setTextColor(124, 58, 237); doc.setFontSize(11);
      doc.text('Plan & book your route at glosx.app', P, y);
      doc.save('WoW-Train-' + key + '.pdf');
    } catch (e) { console.error('PDF error', e); }
    finally { if (btn) btn.disabled = false; }
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      render(btn.dataset.route);
    });
  });

  // Auto-renderizar la primera ruta al cargar para evitar la caja vacía
  const firstBtn = document.querySelector('.wt-route-btn[data-route="classic"]');
  if (firstBtn) firstBtn.setAttribute("aria-pressed", "true");
  render("classic");
})();



/* ── Supabase review form ─────────────────────────────────────────────────────
   Table required (run once in Supabase SQL editor):
   CREATE TABLE reviews (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     name text NOT NULL,
     route text,
     body text NOT NULL,
     created_at timestamptz DEFAULT now()
   );
   ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Anyone can insert" ON reviews FOR INSERT WITH CHECK (true);
   CREATE POLICY "Anyone can read"   ON reviews FOR SELECT USING (true);
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  var SB_URL = 'https://pbmcwxzibvbqluokiavt.supabase.co';
  var SB_KEY = 'sb_publishable_fWCkvguGNMHuIFjiSPt5oA__J4fp9fK';

  var nameEl    = document.getElementById('wt-r-name');
  var routeEl   = document.getElementById('wt-r-route');
  var bodyEl    = document.getElementById('wt-r-body');
  var charsEl   = document.getElementById('wt-r-chars');
  var submitBtn = document.getElementById('wt-r-submit');
  var statusEl  = document.getElementById('wt-r-status');
  var starsEl   = document.getElementById('wt-r-stars');
  var grid      = document.querySelector('.wt-reviews-grid');
  var _rating   = 0;

  if (!bodyEl || !grid) return;

  bodyEl.addEventListener('input', function () {
    charsEl.textContent = bodyEl.value.length;
  });

  // ── Star picker ────────────────────────────────────────────────────────────
  function renderStars(hoverVal) {
    var active = hoverVal !== undefined ? hoverVal : _rating;
    starsEl.querySelectorAll('.wt-star-btn').forEach(function (b) {
      b.classList.toggle('lit', parseInt(b.dataset.val, 10) <= active);
    });
  }
  if (starsEl) {
    starsEl.querySelectorAll('.wt-star-btn').forEach(function (btn) {
      btn.addEventListener('mouseenter', function () { renderStars(parseInt(btn.dataset.val, 10)); });
      btn.addEventListener('mouseleave', function () { renderStars(); });
      btn.addEventListener('click', function () {
        _rating = parseInt(btn.dataset.val, 10);
        renderStars();
      });
    });
  }

  function getInitials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join('').slice(0, 2);
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function starsHtml(n) {
    var s = ''; for (var i = 1; i <= 5; i++) s += i <= n ? '★' : '☆'; return s;
  }

  function insertCard(data) {
    var initials = getInitials(data.name || '?');
    var lang = document.documentElement.lang || 'en';
    var momento = (window.TRANSLATIONS && TRANSLATIONS[lang] && TRANSLATIONS[lang].wt_momento) || 'WoW Moment:';
    var art = document.createElement('article');
    art.className = 'wt-review-card';
    art.innerHTML =
      '<div class="wt-review-head">' +
        '<div class="wt-avatar">' + escHtml(initials) + '</div>' +
        '<div>' +
          '<p class="wt-review-name">' + escHtml(data.name) + '</p>' +
          (data.route ? '<p class="wt-review-route">' + escHtml(data.route) + '</p>' : '') +
        '</div>' +
      '</div>' +
      '<span class="wt-momento">' + escHtml(momento) + '</span>' +
      '<p class="wt-review-body">' + escHtml(data.body) + '</p>' +
      '<div class="wt-stars">' + starsHtml(data.rating || 5) + '</div>';
    grid.prepend(art);
  }

  submitBtn.addEventListener('click', async function () {
    var lang   = document.documentElement.lang || 'en';
    var dict   = (window.TRANSLATIONS && TRANSLATIONS[lang]) || {};
    var name   = nameEl.value.trim();
    var route  = routeEl.value.trim();
    var body   = bodyEl.value.trim();

    if (!name || !body) {
      statusEl.style.color = '#f87171';
      statusEl.textContent = dict.rv_error_empty || 'Fill in your name and comment.';
      return;
    }

    submitBtn.disabled = true;
    statusEl.style.color = 'var(--muted)';
    statusEl.textContent = '...';

    try {
      var res = await fetch(SB_URL + '/rest/v1/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SB_KEY,
          'Authorization': 'Bearer ' + SB_KEY,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ name: name, route: route || null, body: body, rating: _rating || null })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var rows = await res.json();
      insertCard(rows[0] || { name: name, route: route, body: body, rating: _rating });
      trimGrid();
      nameEl.value = ''; routeEl.value = ''; bodyEl.value = '';
      charsEl.textContent = '0';
      _rating = 0; renderStars();
      statusEl.style.color = '#22c55e';
      statusEl.textContent = dict.rv_ok || 'Published!';
      setTimeout(function () { statusEl.textContent = ''; }, 3000);
    } catch (e) {
      statusEl.style.color = '#f87171';
      statusEl.textContent = 'Error: ' + e.message;
    } finally {
      submitBtn.disabled = false;
    }
  });

  // ── Tope de tarjetas y carga de las últimas reseñas reales ─────────────────
  var MAX_CARDS = 15;
  function trimGrid() {
    var cards = grid.querySelectorAll('.wt-review-card');
    for (var i = cards.length - 1; i >= MAX_CARDS; i--) cards[i].remove();
  }

  (async function loadReviews() {
    try {
      var res = await fetch(SB_URL + '/rest/v1/reviews?select=*&order=created_at.desc&limit=' + MAX_CARDS, {
        headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY }
      });
      if (!res.ok) return;
      var rows = await res.json();
      rows.reverse().forEach(insertCard);
      trimGrid();
    } catch (e) {}
  })();

  // ── Arrastrar para deslizar el carrusel con el mouse (en celular el swipe es nativo) ──
  (function () {
    var down = false, startX = 0, startScroll = 0, moved = 0;
    grid.addEventListener('mousedown', function (e) {
      down = true; moved = 0; startX = e.pageX; startScroll = grid.scrollLeft;
      grid.classList.add('dragging');
    });
    window.addEventListener('mouseup', function () { down = false; grid.classList.remove('dragging'); });
    grid.addEventListener('mouseleave', function () { down = false; grid.classList.remove('dragging'); });
    grid.addEventListener('mousemove', function (e) {
      if (!down) return;
      e.preventDefault();
      var dx = e.pageX - startX; moved = Math.abs(dx);
      grid.scrollLeft = startScroll - dx;
    });
    grid.addEventListener('click', function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  })();
})();



(function () {
  var el = document.getElementById('wt-live-users');
  if (!el) return;
  var current = 307;
  var floor = 270;
  setInterval(function () {
    var delta = Math.floor(Math.random() * 8) - 3; // -3 to +4
    current = Math.max(floor, current + delta);
    el.textContent = current;
  }, 4000);
})();



(function () {
  var nav = document.querySelector('nav');
  if (!nav) return;
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();



(function () {
  var CITIES = window._GLOSX_CITIES = [
    // España
    { display: 'Madrid',                                slug: 'madrid',          keywords: ['madrid'] },
    { display: 'Barcelona',                             slug: 'barcelona',       keywords: ['barcelona'] },
    { display: 'Sevilla / Seville',                     slug: 'seville',         keywords: ['seville','sevilla'] },
    { display: 'Valencia',                              slug: 'valencia',        keywords: ['valencia'] },
    { display: 'Bilbao',                                slug: 'bilbao',          keywords: ['bilbao'] },
    { display: 'Málaga / Malaga',                       slug: 'malaga',          keywords: ['malaga','málaga'] },
    { display: 'Zaragoza',                              slug: 'zaragoza',        keywords: ['zaragoza'] },
    { display: 'San Sebastián / Donostia',              slug: 'san-sebastian',   keywords: ['san sebastian','donostia','san sebastián'] },
    { display: 'Granada',                               slug: 'granada',         keywords: ['granada'] },
    { display: 'Alicante',                              slug: 'alicante',        keywords: ['alicante'] },
    { display: 'Córdoba / Cordoba',                     slug: 'cordoba',         keywords: ['cordoba','córdoba'] },
    { display: 'Valladolid',                            slug: 'valladolid',      keywords: ['valladolid'] },
    // Francia
    { display: 'París / Paris',                         slug: 'paris',           keywords: ['paris','parís'] },
    { display: 'Lyon',                                  slug: 'lyon',            keywords: ['lyon'] },
    { display: 'Marsella / Marseille',                  slug: 'marseille',       keywords: ['marseille','marsella'] },
    { display: 'Niza / Nice',                           slug: 'nice',            keywords: ['nice','niza'] },
    { display: 'Burdeos / Bordeaux',                    slug: 'bordeaux',        keywords: ['bordeaux','burdeos'] },
    { display: 'Lille',                                 slug: 'lille',           keywords: ['lille'] },
    { display: 'Estrasburgo / Strasbourg',              slug: 'strasbourg',      keywords: ['strasbourg','estrasburgo'] },
    { display: 'Toulouse',                              slug: 'toulouse',        keywords: ['toulouse'] },
    { display: 'Nantes',                                slug: 'nantes',          keywords: ['nantes'] },
    { display: 'Montpellier',                           slug: 'montpellier',     keywords: ['montpellier'] },
    { display: 'Rennes',                                slug: 'rennes',          keywords: ['rennes'] },
    { display: 'Aviñón / Avignon',                      slug: 'avignon',         keywords: ['avignon','aviñon','avignon'] },
    // Reino Unido
    { display: 'Londres / London',                      slug: 'london',          keywords: ['london','londres'] },
    { display: 'Edimburgo / Edinburgh',                 slug: 'edinburgh',       keywords: ['edinburgh','edimburgo'] },
    { display: 'Manchester',                            slug: 'manchester',      keywords: ['manchester'] },
    { display: 'Birmingham',                            slug: 'birmingham',      keywords: ['birmingham'] },
    { display: 'Glasgow',                               slug: 'glasgow',         keywords: ['glasgow'] },
    { display: 'Bristol',                               slug: 'bristol',         keywords: ['bristol'] },
    { display: 'Liverpool',                             slug: 'liverpool',       keywords: ['liverpool'] },
    { display: 'York',                                  slug: 'york',            keywords: ['york'] },
    // Italia
    { display: 'Roma / Rome',                           slug: 'rome',            keywords: ['rome','roma'] },
    { display: 'Milán / Milano / Milan',                slug: 'milan',           keywords: ['milan','milán','milano'] },
    { display: 'Venecia / Venezia / Venice',            slug: 'venice',          keywords: ['venice','venecia','venezia'] },
    { display: 'Florencia / Firenze / Florence',        slug: 'florence',        keywords: ['florence','florencia','firenze'] },
    { display: 'Turín / Torino / Turin',                slug: 'turin',           keywords: ['turin','turín','torino'] },
    { display: 'Bolzano / Bozen (Dolomitas)',           slug: 'bolzano',         keywords: ['bolzano','bozen','dolomitas','dolomites','dolomiti'] },
    { display: 'Trento / Trient',                       slug: 'trento',          keywords: ['trento','trient'] },
    { display: 'Amalfi / Salerno (Costa Amalfitana)',   slug: 'salerno',         keywords: ['salerno','amalfi','costa amalfitana','amalfi coast'] },
    { display: 'Nápoles / Napoli / Naples',             slug: 'naples',          keywords: ['naples','nápoles','napoli'] },
    { display: 'Bolonia / Bologna',                     slug: 'bologna',         keywords: ['bologna','bolonia'] },
    { display: 'Génova / Genova / Genoa',               slug: 'genoa',           keywords: ['genoa','génova','genova'] },
    { display: 'Palermo',                               slug: 'palermo',         keywords: ['palermo'] },
    { display: 'Verona',                                slug: 'verona',          keywords: ['verona'] },
    { display: 'Pisa',                                  slug: 'pisa',            keywords: ['pisa'] },
    { display: 'Bari',                                  slug: 'bari',            keywords: ['bari'] },
    { display: 'Cinque Terre / La Spezia',              slug: 'la-spezia',       keywords: ['cinque terre','la spezia','spezia'] },
    // Alemania
    { display: 'Berlín / Berlin',                       slug: 'berlin',          keywords: ['berlin','berlín'] },
    { display: 'Múnich / München / Munich',             slug: 'munich',          keywords: ['munich','múnich','munchen','münchen'] },
    { display: 'Hamburgo / Hamburg',                    slug: 'hamburg',         keywords: ['hamburg','hamburgo'] },
    { display: 'Frankfurt',                             slug: 'frankfurt',       keywords: ['frankfurt'] },
    { display: 'Colonia / Köln / Cologne',              slug: 'cologne',         keywords: ['cologne','colonia','koln','köln'] },
    { display: 'Düsseldorf / Dusseldorf',               slug: 'dusseldorf',      keywords: ['dusseldorf','düsseldorf'] },
    { display: 'Stuttgart',                             slug: 'stuttgart',       keywords: ['stuttgart'] },
    { display: 'Dresden',                               slug: 'dresden',         keywords: ['dresden'] },
    { display: 'Leipzig',                               slug: 'leipzig',         keywords: ['leipzig'] },
    { display: 'Nuremberg / Nürnberg',                  slug: 'nuremberg',       keywords: ['nuremberg','nürnberg','nurnberg'] },
    { display: 'Bremen',                                slug: 'bremen',          keywords: ['bremen'] },
    { display: 'Hannover / Hanover',                    slug: 'hannover',        keywords: ['hannover','hanover'] },
    // Bélgica / Países Bajos
    { display: 'Ámsterdam / Amsterdam',                 slug: 'amsterdam',       keywords: ['amsterdam','ámsterdam'] },
    { display: 'Bruselas / Bruxelles / Brussels',       slug: 'brussels',        keywords: ['brussels','bruselas','bruxelles'] },
    { display: 'Brujas / Brugge / Bruges',              slug: 'bruges',          keywords: ['bruges','brujas','brugge'] },
    { display: 'Gante / Gent / Ghent',                  slug: 'ghent',           keywords: ['ghent','gante','gent'] },
    { display: 'Rotterdam',                             slug: 'rotterdam',       keywords: ['rotterdam'] },
    { display: 'La Haya / Den Haag / The Hague',        slug: 'the-hague',       keywords: ['the hague','la haya','den haag','hague'] },
    { display: 'Utrecht',                               slug: 'utrecht',         keywords: ['utrecht'] },
    { display: 'Amberes / Antwerpen / Antwerp',         slug: 'antwerp',         keywords: ['antwerp','amberes','antwerpen'] },
    // Suiza / Austria
    { display: 'Zúrich / Zürich / Zurich',              slug: 'zurich',          keywords: ['zurich','zúrich','zürich','zuerich'] },
    { display: 'Ginebra / Genève / Geneva',             slug: 'geneva',          keywords: ['geneva','ginebra','geneve','genève'] },
    { display: 'Basilea / Bâle / Basel',                slug: 'basel',           keywords: ['basel','basilea','bale','bâle'] },
    { display: 'Berna / Bern',                          slug: 'bern',            keywords: ['bern','berna'] },
    { display: 'Lucerna / Luzern / Lucerne',            slug: 'lucerne',         keywords: ['lucerne','lucerna','luzern'] },
    { display: 'Interlaken (Alpes Suizos)',             slug: 'interlaken',      keywords: ['interlaken','alpes suizos','swiss alps','alpes suisses','schweizer alpen','alpi svizzere'] },
    { display: 'Zermatt (Matterhorn)',                  slug: 'zermatt',         keywords: ['zermatt','matterhorn'] },
    { display: 'Grindelwald',                           slug: 'grindelwald',     keywords: ['grindelwald'] },
    { display: 'Montreux',                              slug: 'montreux',        keywords: ['montreux'] },
    { display: 'Lugano',                                slug: 'lugano',          keywords: ['lugano'] },
    { display: 'Viena / Wien / Vienna',                 slug: 'vienna',          keywords: ['vienna','viena','wien'] },
    { display: 'Salzburgo / Salzburg',                  slug: 'salzburg-hbf',    keywords: ['salzburg','salzburgo'] },
    { display: 'Innsbruck (Alpes Austriacos)',           slug: 'innsbruck',       keywords: ['innsbruck','alpes austriacos','austrian alps','alpes autrichiens'] },
    { display: 'Graz',                                  slug: 'graz',            keywords: ['graz'] },
    // República Checa / Hungría / Polonia / Eslovaquia
    { display: 'Praga / Praha / Prague',                slug: 'prague',          keywords: ['prague','praga','praha'] },
    { display: 'Budapest',                              slug: 'budapest',        keywords: ['budapest'] },
    { display: 'Varsovia / Warszawa / Warsaw',          slug: 'warsaw',          keywords: ['warsaw','varsovia','warszawa'] },
    { display: 'Cracovia / Kraków / Krakow',            slug: 'krakow',          keywords: ['krakow','cracovia','krakow','kraków'] },
    { display: 'Bratislava',                            slug: 'bratislava',      keywords: ['bratislava'] },
    { display: 'Brno',                                  slug: 'brno',            keywords: ['brno'] },
    { display: 'Gdansk / Danzig',                       slug: 'gdansk',          keywords: ['gdansk','danzig'] },
    { display: 'Wroclaw / Breslavia',                   slug: 'wroclaw',         keywords: ['wroclaw','breslavia','wrocław'] },
    // Portugal
    { display: 'Lisboa / Lisbon',                       slug: 'lisbon',          keywords: ['lisbon','lisboa'] },
    { display: 'Oporto / Porto',                        slug: 'porto',           keywords: ['porto','oporto'] },
    { display: 'Coimbra',                               slug: 'coimbra',         keywords: ['coimbra'] },
    { display: 'Faro',                                  slug: 'faro',            keywords: ['faro'] },
    // Escandinavia
    { display: 'Copenhague / Copenhagen',               slug: 'copenhagen',      keywords: ['copenhagen','copenhague','kobenhavn','københavn'] },
    { display: 'Estocolmo / Stockholm',                 slug: 'stockholm-central', keywords: ['stockholm','estocolmo'] },
    { display: 'Gotemburgo / Gothenburg',               slug: 'gothenburg',      keywords: ['gothenburg','gotemburgo','goteborg','göteborg'] },
    { display: 'Malmö / Malmo',                         slug: 'malmo',           keywords: ['malmo','malmö'] },
    { display: 'Helsinki',                              slug: 'helsinki',        keywords: ['helsinki'] },
    // Países Bálticos / Europa del Este
    { display: 'Varsovia / Warszawa / Warsaw',          slug: 'warsaw',          keywords: ['warszawa'] },
    { display: 'Bucarest / București / Bucharest',      slug: 'bucharest',       keywords: ['bucharest','bucarest','bucuresti'] },
    { display: 'Zagreb',                                slug: 'zagreb',          keywords: ['zagreb'] },
    { display: 'Liubliana / Ljubljana',                 slug: 'ljubljana',       keywords: ['ljubljana','liubliana'] },
    { display: 'Belgrado / Beograd / Belgrade',         slug: 'belgrade',        keywords: ['belgrade','belgrado','beograd'] },
    { display: 'Sofía / Sofia',                         slug: 'sofia',           keywords: ['sofia','sofía'] },
    { display: 'Atenas / Athens',                       slug: 'athens',          keywords: ['athens','atenas'] },
    { display: 'Vilna / Vilnius',                       slug: 'vilnius',         keywords: ['vilnius','vilna'] },
    { display: 'Riga',                                  slug: 'riga',            keywords: ['riga'] },
    { display: 'Tallin / Tallinn',                      slug: 'tallinn',         keywords: ['tallinn','tallin'] },
    // Luxemburgo / Mónaco
    { display: 'Luxemburgo / Luxembourg',               slug: 'luxembourg',      keywords: ['luxembourg','luxemburgo'] },
    { display: 'Mónaco / Monaco',                       slug: 'monaco',          keywords: ['monaco','mónaco'] },
    // Irlanda
    { display: 'Dublín / Dublin',                       slug: 'dublin',          keywords: ['dublin','dublín'] },
    { display: 'Cork',                                  slug: 'cork',            keywords: ['cork'] },
    // Grecia
    { display: 'Atenas / Athens',                       slug: 'athens',          keywords: ['athens','atenas'] },
    { display: 'Tesalónica / Thessaloniki',             slug: 'thessaloniki',    keywords: ['thessaloniki','tesalonica','salonica'] },
    // Croacia / Eslovenia / Serbia
    { display: 'Dubrovnik',                             slug: 'dubrovnik',       keywords: ['dubrovnik'] },
    { display: 'Split',                                 slug: 'split',           keywords: ['split'] },
    // Regiones y rutas temáticas — España
    { display: 'Costa Brava (Girona)',                  slug: 'girona',          keywords: ['costa brava','girona'] },
    { display: 'Costa del Sol (Málaga)',                slug: 'malaga',          keywords: ['costa del sol'] },
    { display: 'País Vasco / Basque Country',           slug: 'bilbao',          keywords: ['pais vasco','basque country','euskadi','pays basque'] },
    { display: 'Galicia (Santiago de Compostela)',      slug: 'santiago-de-compostela', keywords: ['galicia','santiago','compostela','santiago de compostela'] },
    { display: 'Andalucía (Sevilla)',                   slug: 'seville',         keywords: ['andalucia','andalucía','andalusia'] },
    { display: 'Camino de Santiago (Burgos)',           slug: 'burgos',          keywords: ['camino de santiago','camino santiago','burgos'] },
    { display: 'Cantabria (Santander)',                 slug: 'santander',       keywords: ['cantabria','santander'] },
    { display: 'Asturias (Oviedo)',                     slug: 'oviedo',          keywords: ['asturias','oviedo'] },
    { display: 'Toledo',                                slug: 'toledo',          keywords: ['toledo'] },
    { display: 'Salamanca',                             slug: 'salamanca',       keywords: ['salamanca'] },
    { display: 'Segovia',                               slug: 'segovia',         keywords: ['segovia'] },
    { display: 'Cádiz',                                 slug: 'cadiz',           keywords: ['cadiz','cádiz'] },
    // Regiones y rutas temáticas — Francia
    { display: 'Costa Azul / Côte d\'Azur (Niza)',     slug: 'nice',            keywords: ['costa azul','cote d azur','côte d azur','riviera francesa','french riviera'] },
    { display: 'Normandía (Ruán / Rouen)',              slug: 'rouen',           keywords: ['normandia','normandie','normandy','rouen','ruan','ruán'] },
    { display: 'Bretaña (Rennes)',                      slug: 'rennes',          keywords: ['bretaña','bretagne','brittany'] },
    { display: 'Provenza (Aviñón)',                     slug: 'avignon',         keywords: ['provenza','provence','provença'] },
    { display: 'Alsacia (Estrasburgo)',                 slug: 'strasbourg',      keywords: ['alsacia','alsace','alsazia'] },
    { display: 'Valle del Loira (Tours)',               slug: 'tours',           keywords: ['valle del loira','loire valley','val de loire','tours'] },
    { display: 'Burdeos / Bordeaux (Viñedos)',         slug: 'bordeaux',        keywords: ['viñedos','wine region','bordeaux wine'] },
    { display: 'Perpiñán / Perpignan',                 slug: 'perpignan',       keywords: ['perpignan','perpiñan'] },
    // Regiones y rutas temáticas — Italia
    { display: 'Toscana (Florencia)',                   slug: 'florence',        keywords: ['toscana','tuscany','toscane'] },
    { display: 'Cinque Terre / La Spezia',              slug: 'la-spezia',       keywords: ['cinque terre','la spezia','spezia','cinco tierras'] },
    { display: 'Costa Amalfitana (Salerno)',            slug: 'salerno',         keywords: ['costa amalfitana','amalfi coast','amalfi'] },
    { display: 'Lago de Como (Como)',                   slug: 'como',            keywords: ['lago de como','lake como','lac de come','como'] },
    { display: 'Lago de Garda (Desenzano)',             slug: 'desenzano-del-garda', keywords: ['lago de garda','lake garda','lago garda','desenzano'] },
    { display: 'Sicilia (Palermo)',                     slug: 'palermo',         keywords: ['sicilia','sicily','sicile'] },
    { display: 'Puglia / Apulia (Bari)',                slug: 'bari',            keywords: ['puglia','apulia','apulia','lecce'] },
    { display: 'Umbría (Perugia)',                      slug: 'perugia',         keywords: ['umbria','umbría','perugia'] },
    { display: 'Bolzano / Bozen (Dolomitas)',           slug: 'bolzano',         keywords: ['bolzano','bozen','dolomitas','dolomites','dolomiti'] },
    { display: 'Trento / Trient',                       slug: 'trento',          keywords: ['trento','trient'] },
    { display: 'Salerno',                               slug: 'salerno',         keywords: ['salerno'] },
    { display: 'Lecce',                                 slug: 'lecce',           keywords: ['lecce'] },
    { display: 'Siena',                                 slug: 'siena',           keywords: ['siena'] },
    { display: 'Ferrara',                               slug: 'ferrara',         keywords: ['ferrara'] },
    { display: 'Padua / Padova',                       slug: 'padova',          keywords: ['padova','padua'] },
    // Regiones y rutas temáticas — Suiza / Austria
    { display: 'Interlaken (Alpes Suizos)',             slug: 'interlaken',      keywords: ['interlaken','alpes suizos','swiss alps','alpes suisses','schweizer alpen','alpi svizzere'] },
    { display: 'Zermatt (Matterhorn)',                  slug: 'zermatt',         keywords: ['zermatt','matterhorn'] },
    { display: 'Grindelwald',                           slug: 'grindelwald',     keywords: ['grindelwald'] },
    { display: 'Montreux',                              slug: 'montreux',        keywords: ['montreux'] },
    { display: 'Lugano',                                slug: 'lugano',          keywords: ['lugano'] },
    { display: 'Lausana / Lausanne',                    slug: 'lausanne',        keywords: ['lausanne','lausana'] },
    { display: 'St. Moritz / Sankt Moritz',             slug: 'st-moritz',       keywords: ['st moritz','saint moritz','sankt moritz'] },
    { display: 'Chur (Graubünden)',                     slug: 'chur',            keywords: ['chur','graubunden','graubünden','grigioni'] },
    { display: 'Innsbruck (Alpes Austriacos)',          slug: 'innsbruck',       keywords: ['alpes austriacos','austrian alps','alpes autrichiens','tirol','tyrol'] },
    { display: 'Hallstatt (Salzkammergut)',             slug: 'attnang-puchheim', keywords: ['hallstatt','salzkammergut'] },
    // Regiones y rutas temáticas — Alemania
    { display: 'Selva Negra (Friburgo)',                slug: 'freiburg',        keywords: ['selva negra','black forest','foret noire','schwarzwald','freiburg','friburgo'] },
    { display: 'Ruta Romántica (Augsburgo)',            slug: 'augsburg',        keywords: ['ruta romantica','romantic road','romantische strasse','augsburg','augsburgo'] },
    { display: 'Baviera (Múnich)',                      slug: 'munich',          keywords: ['baviera','bavaria','bavière','bayern'] },
    { display: 'Renania (Colonia)',                     slug: 'cologne',         keywords: ['renania','rhineland','rheinland','rhin','rhein'] },
    { display: 'Valle del Rin (Coblenza)',              slug: 'koblenz',         keywords: ['valle del rin','rhine valley','rhine river','rin','rhein valley','koblenz','coblenza'] },
    { display: 'Rostock (Mar Báltico)',                 slug: 'rostock',         keywords: ['rostock','mar baltico','baltic sea'] },
    { display: 'Heidelberg',                            slug: 'heidelberg',      keywords: ['heidelberg'] },
    { display: 'Lübeck',                                slug: 'lubeck',          keywords: ['lubeck','lübeck'] },
    // Regiones y rutas temáticas — Países Bajos / Bélgica
    { display: 'Tulipanes Holanda (Leiden)',            slug: 'leiden',          keywords: ['tulipanes','tulips','holanda','leiden','keukenhof'] },
    { display: 'Lieja / Liège',                         slug: 'liege',           keywords: ['liege','lieja','liège'] },
    { display: 'Namur',                                 slug: 'namur',           keywords: ['namur'] },
    // Regiones y rutas temáticas — Europa del Este
    { display: 'Moravia (Brno)',                        slug: 'brno',            keywords: ['moravia','morava'] },
    { display: 'Bohemia (Praga)',                       slug: 'prague',          keywords: ['bohemia','bohème','böhmen'] },
    { display: 'Cracovia (Małopolska)',                 slug: 'krakow',          keywords: ['malopolska','pequeña polonia','little poland'] },
    { display: 'Tatras (Zakopane)',                     slug: 'zakopane',        keywords: ['tatras','zakopane','tatra'] },
    { display: 'Transilvania (Cluj)',                   slug: 'cluj-napoca',     keywords: ['transilvania','transylvania','transylvanie','cluj','cluj napoca'] },
    // Escandinavia regional
    { display: 'Fiordos Noruegos (Bergen)',             slug: 'bergen',          keywords: ['fiordos','fjords','fjord','bergen','noruega','norway'] },
    { display: 'Laponia Sueca (Kiruna)',                slug: 'kiruna',          keywords: ['laponia','lapland','kiruna','lappland'] },
    { display: 'Archipiélago Estocolmo (Estocolmo)',   slug: 'stockholm-central', keywords: ['archipielago','archipelago','skargard','skärgård'] },
    { display: 'Malmö (Puente de Øresund)',            slug: 'malmo',           keywords: ['malmö','malmo','oresund','øresund','puente oresund'] },
    // Ruta del tren panorámico
    { display: 'Bernina Express (Chur→Tirano)',        slug: 'chur',            keywords: ['bernina','bernina express','tirano'] },
    { display: 'Glacier Express (Zermatt→St.Moritz)',  slug: 'zermatt',         keywords: ['glacier express','glaciar express'] },
    { display: 'Flåm (Tren panorámico Noruega)',       slug: 'myrdal',          keywords: ['flam','flåm','flamsbana','flamsbanen'] },
    { display: 'Orient Express (Venecia→Estambul)',    slug: 'venice',          keywords: ['orient express','oriente express'] }
  ];

  function norm(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function filterCities(q) {
    var nq = norm(q);
    return CITIES.filter(function (c) {
      return c.keywords.some(function (k) { return norm(k).indexOf(nq) === 0; });
    }).slice(0, 6);
  }

  function attachTypeahead(inputEl) {
    var wrap = inputEl.closest('.search-field');
    if (!wrap) return;
    var dd = document.createElement('div');
    dd.className = 'ac-dropdown';
    wrap.appendChild(dd);

    inputEl.addEventListener('input', function () {
      var q = inputEl.value.trim();
      inputEl.removeAttribute('data-slug');
      if (q.length < 2) { dd.style.display = 'none'; return; }
      var matches = filterCities(q);
      if (!matches.length) { dd.style.display = 'none'; return; }
      dd.innerHTML = matches.map(function (c) {
        return '<div class="ac-item" data-slug="' + c.slug + '">' + c.display + '</div>';
      }).join('');
      dd.style.display = 'block';
    });

    dd.addEventListener('mousedown', function (e) {
      var item = e.target.closest('.ac-item');
      if (!item) return;
      e.preventDefault();
      inputEl.value = item.textContent;
      inputEl.setAttribute('data-slug', item.dataset.slug);
      dd.style.display = 'none';
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) dd.style.display = 'none';
    });

    inputEl.addEventListener('keydown', function (e) {
      if (dd.style.display === 'none') return;
      var items = dd.querySelectorAll('.ac-item');
      var active = dd.querySelector('.ac-active');
      var idx = active ? Array.from(items).indexOf(active) : -1;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (active) active.classList.remove('ac-active');
        items[Math.min(idx + 1, items.length - 1)].classList.add('ac-active');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (active) active.classList.remove('ac-active');
        if (idx > 0) items[idx - 1].classList.add('ac-active');
      } else if (e.key === 'Enter') {
        var sel = dd.querySelector('.ac-active');
        if (sel) {
          e.preventDefault();
          inputEl.value = sel.textContent;
          inputEl.setAttribute('data-slug', sel.dataset.slug);
          dd.style.display = 'none';
        }
      } else if (e.key === 'Escape') {
        dd.style.display = 'none';
      }
    });
  }

  if (document.getElementById('origin')) attachTypeahead(document.getElementById('origin'));
  if (document.getElementById('dest'))   attachTypeahead(document.getElementById('dest'));

  // === AI Route Planner ===
  
  // CONFIGURACIÓN DE API - CAMBIAR ESTA URL CUANDO TENGAS EL BACKEND
  const AI_API_URL = 'https://glosx-backend-production.up.railway.app/api/route-planner';
  
  // Datos de ejemplo (mock) para demostración
  const MOCK_ROUTE_DATA = {
    "resumen": {
      "origen_fin_o_concepto": "Madrid to Paris scenic route through Spanish and French countryside",
      "duracion_estimada_total": "10-12 hours total journey time"
    },
    "paradas_principales": ["Madrid", "Barcelona", "Perpignan", "Lyon", "Paris"],
    "tramos": [
      {
        "orden": 1,
        "origen": "Madrid Atocha",
        "destino": "Barcelona Sants",
        "tiempo_trayecto": "2h 30m",
        "tipo_tren_sugerido": "AVE",
        "breve_descripcion_conexion": "High-speed AVE train connects Madrid to Barcelona in just 2.5 hours. Comfortable seating with WiFi and power outlets."
      },
      {
        "orden": 2,
        "origen": "Barcelona Sants",
        "destino": "Perpignan",
        "tiempo_trayecto": "1h 45m",
        "tipo_tren_sugerido": "TGV",
        "breve_descripcion_conexion": "Cross-border TGV from Barcelona to France. Scenic route through Pyrenees mountains. Requires seat reservation."
      },
      {
        "orden": 3,
        "origen": "Perpignan",
        "destino": "Lyon Part-Dieu",
        "tiempo_trayecto": "2h 15m",
        "tipo_tren_sugerido": "TGV",
        "breve_descripcion_conexion": "TGV continues north through French countryside. Lyon is a major hub with excellent connections."
      },
      {
        "orden": 4,
        "origen": "Lyon Part-Dieu",
        "destino": "Paris Gare de Lyon",
        "tiempo_trayecto": "2h 00m",
        "tipo_tren_sugerido": "TGV",
        "breve_descripcion_conexion": "Final high-speed segment to Paris. Arrives at Gare de Lyon in the heart of the city."
      }
    ]
  };

  // Función para establecer sugerencia
  function setAISuggestion(text) {
    document.getElementById('aiInput').value = text;
    document.getElementById('aiInputAurora').classList.toggle('active', text.trim().length > 0);
  }

  // Click en una ruta popular del popup de país: carga la ruta en el planner AI del hero (no navega a /rutas/)
  function planRouteFromChip(e, from, to) {
    e.preventDefault();
    document.querySelectorAll('.country-chip.show-photo').forEach(c => c.classList.remove('show-photo'));
    setAISuggestion(from + ' to ' + to);
    document.getElementById('aiInputWrapper').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Invierte origen/destino en el input del planner AI ("Madrid to Paris" -> "Paris to Madrid").
  // El conector varía según idioma (to/a/à/nach), así que se prueban todos.
  function invertAIRoute() {
    const value = document.getElementById('aiInput').value;
    const connectors = ['to', 'à', 'nach', 'a'];
    for (const conn of connectors) {
      const match = value.match(new RegExp('^(.+?)\\s' + conn + '\\s(.+)$', 'i'));
      if (match) {
        setAISuggestion(match[2].trim() + ' ' + conn + ' ' + match[1].trim());
        return;
      }
    }
  }

  // Función principal para generar ruta
  async function generateAIRoute() {
    const input = document.getElementById('aiInput').value.trim();
    const btn = document.querySelector('.ai-generate-btn');
    const inputAurora = document.getElementById('aiInputAurora');

    if (!input) {
      showAIPlannerError('Escribí un destino o idea de viaje para comenzar.');
      return;
    }

    inputAurora.classList.add('active');
    btn.disabled = true;
    btn.classList.add('loading');
    btn.textContent = 'Generating...';

    try {
      let routeData;
      if (AI_API_URL !== 'YOUR_API_ENDPOINT_HERE') {
        routeData = await callAIAPI(input);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        routeData = MOCK_ROUTE_DATA;
      }
      if (routeData.error && !routeData.valido) {
        showAIPlannerError(routeData.error);
      } else if (routeData.valido === false) {
        showAIPlannerError(routeData.mensajeError || 'Contame a dónde querés viajar por Europa.');
      } else {
        displayAIRoute(routeData);
        saveRouteToCache(input, routeData);
      }
    } catch (error) {
      console.error('Error generating route:', error);
      showAIPlannerError('Hubo un problema de conexión. Intentá de nuevo.');
    } finally {
      btn.disabled = false;
      btn.classList.remove('loading');
      btn.textContent = 'Generate Itinerary';
    }
  }

  // Función para llamar a la API (genérica)
  async function callAIAPI(prompt) {
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt, lang: document.documentElement.lang || 'en' })
    });

    return await response.json();
  }

  // Función para validar que el input contiene nombres de lugares
  function containsPlaceNames(text) {
    // Lista básica de ciudades europeas comunes
    const cities = ['madrid', 'barcelona', 'paris', 'london', 'rome', 'berlin', 'amsterdam', 'vienna', 'prague', 'milan', 'florence', 'venice', 'munich', 'zurich', 'geneva', 'lisbon', 'porto', 'brussels', 'lyon', 'nice', 'seville', 'valencia', 'bilbao', 'naples', 'turin', 'bologna', 'copenhagen', 'stockholm', 'oslo', 'helsinki', 'budapest', 'warsaw', 'krakow', 'dublin', 'edinburgh', 'glasgow', 'manchester', 'athens', 'thessaloniki', 'sofia', 'bucharest', 'zagreb', 'split', 'ljubljana', 'bratislava', 'vilnius', 'riga', 'tallinn', 'reykjavik', 'reykjavik', 'luxembourg', 'monaco', 'andorra', 'san marino', 'vatican', 'malta', 'cyprus', 'iceland', 'norway', 'sweden', 'finland', 'denmark', 'netherlands', 'belgium', 'germany', 'france', 'spain', 'portugal', 'italy', 'switzerland', 'austria', 'czech', 'poland', 'hungary', 'slovakia', 'slovenia', 'croatia', 'bosnia', 'serbia', 'montenegro', 'albania', 'greece', 'bulgaria', 'romania', 'ukraine', 'belarus', 'lithuania', 'latvia', 'estonia', 'russia', 'turkey', 'georgia', 'armenia', 'azerbaijan', 'kazakhstan', 'uzbekistan', 'kyrgyzstan', 'tajikistan', 'turkmenistan', 'afghanistan', 'pakistan', 'india', 'china', 'japan', 'korea', 'vietnam', 'thailand', 'cambodia', 'laos', 'myanmar', 'bangladesh', 'nepal', 'bhutan', 'sri lanka', 'maldives', 'indonesia', 'malaysia', 'singapore', 'philippines', 'brunei', 'east timor', 'papua new guinea', 'australia', 'new zealand', 'fiji', 'solomon islands', 'vanuatu', 'samoa', 'tonga', 'tuvalu', 'kiribati', 'marshall islands', 'micronesia', 'palau', 'nauru', 'canada', 'united states', 'mexico', 'guatemala', 'belize', 'honduras', 'el salvador', 'nicaragua', 'costa rica', 'panama', 'colombia', 'venezuela', 'guyana', 'suriname', 'french guiana', 'ecuador', 'peru', 'bolivia', 'paraguay', 'uruguay', 'argentina', 'chile', 'brazil', 'alps', 'pyrenees', 'carpathians', 'scandinavia', 'baltic', 'iberia', 'british isles', 'balkans', 'adriatic', 'mediterranean', 'rhine', 'danube', 'rhone', 'seine', 'thames', 'po', 'tagus', 'ebro', 'guadalquivir', 'douro', 'garonne', 'loire', 'meuse', 'scheldt', 'elbe', 'oder', 'vistula', 'dnieper', 'don', 'volga', 'ural', 'dniester', 'sava', 'mura', 'drava', 'tisa', 'tisza', 'prut', 'siret', 'olt', 'jiu', 'argesh', 'ialomita', 'siret', 'mures', 'somes', 'crisuri', 'timis', 'baraolt', 'prit', 'cerna', 'nera', 'cara', 'bega', 'tisa', 'danube', 'sava', 'drina', 'lim', 'drina', 'kolubara', 'mora', 'great morava', 'south morava', 'west morava', 'ibar', 'timok', 'pek', 'mlava', 'resava', 'ravanica', 'vit', 'osam', 'yantra', 'kamchiya', 'tundzha', 'maritsa', 'struma', 'nestos', 'vardar', 'crna', 'bregalnica', 'drin', 'buna', 'vjosa', 'semeni', 'shkumbin', 'mat', 'ishm', 'erzen', 'shkumbin', 'drin', 'buna', 'vjosa', 'semeni', 'shkumbin', 'mat', 'ishm', 'erzen', 'neretva', 'trebisnjica', 'bregava', 'krivaja', 'bosna', 'usora', 'spreca', 'tinja', 'drina', 'sana', 'una', 'vrbanja', 'ukrina', 'janja', 'tinja', 'drina', 'lim', 'piva', 'tara', 'cehotina', 'bijela', 'komarnica', 'moraca', 'zeta', 'cijevna', 'rmnica', 'grnjar', 'lje'];
    
    const lowerText = text.toLowerCase();
    return cities.some(city => lowerText.includes(city));
  }

  // Hoteles curados: nombre + foto real (no precio, eso lo muestra Klook al hacer clic
  // para que nunca quede un numero viejo congelado en el sitio). Clave = ciudad en minuscula,
  // sin acentos ni sufijo de estacion (ej. "interlaken" matchea "Interlaken Ost").
  const CURATED_HOTELS = {
    interlaken: {
      name: 'Grand Hotel Beau-Rivage',
      loc: 'Interlaken, Switzerland',
      stars: 5,
      photo: 'https://i0.wp.com/www.grandbeaurivage.ch/wp-content/uploads/2026/03/terrasse.jpg?resize=1300%2C975&ssl=1',
      url: 'https://tp.media/r?marker=734304&trs=534570&p=4110&u=https%3A%2F%2Fwww.klook.com%2Fhotels%2Fdetail%2F116421-grand-hotel-beau-rivage-interlaken%2F%3Fcheck_in%3D2026-09-01%26check_out%3D2026-09-07%26room_num%3D1%26adult_num%3D2%26child_num%3D0%26age%3D%26page_source%3Dhotel_list_page%26lowest_amount%3D745.41%26source_price_token%3DeyJjdXJyZW5jeSI6IlVTRCIsImhvdGVsSWQiOjExNjQyMSwibGlzdGluZ1BhZ2VOb0RhdGVTZWFyY2giOjEsImxpc3RpbmdUcmFjZUlkIjoiNWVmZTMyZWYiLCJwcmljZSI6NzQ1LjQxLCJwcmljZVR5cGUiOiJSRUFMX1RJTUUiLCJyYXRlSWQiOiIyMDI2MDkwMXwyMDI2MDkwN3xXfDIxOHw3NDQ1fEpTVS5TVHxCQVIxIE5GUiB8QkJ8fDF%252BMn4wfHxOIiwic291cmNlIjoxLCJzdXBwbGllckFjY291bnRJZCI6IjUwMSIsInN1cHBsaWVySWQiOjV9%26price_select%3Dtaxes%257C1&campaign_id=137',
    },
    vienna: {
      name: 'Hotel Sacher Wien',
      loc: 'Vienna, Austria',
      stars: 5,
      photo: 'https://www.sacher.com/en/wp-content/uploads/sites/4/fly-images/10561/hotel-sacher-architektur-wien-80-scaled-1920x9999.jpg.webp',
      url: `${PROXY_BASE}/klook-hotel?city=vienna`,
    },
    cologne: {
      name: 'Excelsior Hotel Ernst am Dom',
      loc: 'Cologne, Germany',
      stars: 5,
      photo: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/8a/f4/2769ee5759ee0ccbc46ddba428c8aa267f5245551d00699bdde306970fa8.jpeg',
      url: `${PROXY_BASE}/klook-hotel?city=cologne`,
    },
    venice: {
      name: 'Hotel Danieli',
      loc: 'Venice, Italy',
      stars: 5,
      photo: 'https://www.danielihotelinvenice.com/pub/media/72/lux72ex.123582_md.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=venice`,
    },
    amsterdam: {
      name: "De L'Europe Amsterdam",
      loc: 'Amsterdam, Netherlands',
      stars: 5,
      photo: 'https://www.deleurope.com/wp-content/uploads/2024/02/homepage-hero-1.webp',
      url: `${PROXY_BASE}/klook-hotel?city=amsterdam`,
    },
    rome: {
      name: 'Hotel Hassler Roma',
      loc: 'Rome, Italy',
      stars: 5,
      photo: 'https://www.hotelhasslerroma.com/wp-content/uploads/2025/08/fec52ec67f951787b17109931fbf07f7a69f716b.webp',
      url: `${PROXY_BASE}/klook-hotel?city=rome`,
    },
    prague: {
      name: 'Hotel Paris Prague',
      loc: 'Prague, Czech Republic',
      stars: 5,
      photo: 'https://www.hotel-paris.cz/files-sbbasic/ba_parisprague_cz/hotel-paris-prague-02.jpg?w=1200&h=627',
      url: `${PROXY_BASE}/klook-hotel?city=prague`,
    },
    barcelona: {
      name: 'Hotel Casa Fuster',
      loc: 'Barcelona, Spain',
      stars: 5,
      photo: 'https://static-resources-elementor.mirai.com/wp-content/uploads/sites/343/casa-fuster_header-historia_section.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=barcelona`,
    },
    madrid: {
      name: 'NH Madrid Ventas',
      loc: 'Madrid, Spain',
      stars: 4,
      photo: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/17/0c/8a26fbabb166525ac12af3b20272702fffc61ce49f8c9e123d944b1fbb71.jpeg',
      url: `${PROXY_BASE}/klook-hotel?city=madrid`,
    },
    london: {
      name: 'The Savoy',
      loc: 'London, United Kingdom',
      stars: 5,
      photo: 'https://cdn.prod.website-files.com/68f4d1c2a6858f0bfbded01c/6905fd1604f6b402518f81d0_Savoy-SEO-Image.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=london`,
    },
    munich: {
      name: 'Hotel Bayerischer Hof',
      loc: 'Munich, Germany',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Hotel_Bayerischer_Hof_0437.jpg/330px-Hotel_Bayerischer_Hof_0437.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=munich`,
    },
    zurich: {
      name: 'Baur au Lac',
      loc: 'Zurich, Switzerland',
      stars: 5,
      photo: 'https://www.bauraulac.ch/upload/rm/ba/ll/bal-lakeside-corner-suite-lounge-area-4.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=zurich`,
    },
    budapest: {
      name: 'Four Seasons Hotel Gresham Palace',
      loc: 'Budapest, Hungary',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Gresham_Palace_-_Stierch_01.jpg/250px-Gresham_Palace_-_Stierch_01.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=budapest`,
    },
    paris: {
      name: 'Ritz Paris',
      loc: 'Paris, France',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/H%C3%B4tel_Ritz.jpg/330px-H%C3%B4tel_Ritz.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=paris`,
    },
    florence: {
      name: 'Helvetia & Bristol Firenze',
      loc: 'Florence, Italy',
      stars: 5,
      photo: 'https://x3jh6o6w.cdn.imgeng.in/assets/uploads/Starhotels-Collezione/Helvetia_Bristol/GALLERY/helvetia-bristol-fi-facciata1.jpg?imgeng=/w_1200/h_630/m_cropbox',
      url: `${PROXY_BASE}/klook-hotel?city=florence`,
    },
    bern: {
      name: 'Hotel Schweizerhof Bern & Spa',
      loc: 'Bern, Switzerland',
      stars: 5,
      photo: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/48/cd/21dc67795d5607ddc91b6a593813f0d82bcb1576521f666bf35bb246d430.jpeg',
      url: 'https://tp.media/r?marker=734304&trs=534570&p=4110&u=https%3A%2F%2Fwww.klook.com%2Fen-US%2Fhotels%2Fsearchresult%2F%3Froom_num%3D1%26adult_num%3D2%26child_num%3D0%26age%3D%26longitude%3D-68.8830147447381%26latitude%3D-32.870728800831166%26stype%3Dcity%26svalue%3D67101%26override%3DBern-Mittelland%2C%2520Canton%2520of%2520Bern%2C%2520Switzerland%26title%3DBern-Mittelland%26city_id%3D67101%26latlng%3D%26check_in%3D%26check_out%3D%26sort_selected%3D%26currency%3DUSD&campaign_id=137',
    },
    basel: {
      name: 'Hotel Euler Basel',
      loc: 'Basel, Switzerland',
      stars: 4,
      photo: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/hotelier-images/5a/56/eb9461e9ec3f5dccc8952c3227f72f362b2b6ad600103983efdf25d88d44.jpeg',
      url: 'https://tp.media/r?marker=734304&trs=534570&p=4110&u=https%3A%2F%2Fwww.klook.com%2Fen-US%2Fhotels%2Fsearchresult%2F%3Froom_num%3D1%26adult_num%3D2%26child_num%3D0%26age%3D%26longitude%3D-68.8830147447381%26latitude%3D-32.870728800831166%26stype%3Dcity%26svalue%3D23494%26override%3DBasel%2C%2520Basel-City%2C%2520Switzerland%26title%3DBasel%26city_id%3D23494%26latlng%26check_in%3D%26check_out%3D%26sort_selected%3D%26currency%3DUSD&campaign_id=137',
    },
    dortmund: {
      name: 'NH Dortmund',
      loc: 'Dortmund, Germany',
      stars: 4,
      photo: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/b7/06/ba9b3f38bffb697aca7938c913f971a10ad78a56983004d9f0eb9fa23942.jpeg',
      url: 'https://tp.media/r?marker=734304&trs=534570&p=4110&u=https%3A%2F%2Fwww.klook.com%2Fen-US%2Fhotels%2Fsearchresult%2F%3Froom_num%3D1%26adult_num%3D2%26child_num%3D0%26age%3D%26longitude%3D-68.8830147447381%26latitude%3D-32.870728800831166%26stype%3Dgoogle_poi%26svalue%3DChIJEXrwv2AXuUcRUIdUMYHyJwQ%26override%3DDortmund%26title%3DDortmund%26city_id%26latlng%3D51.513587%2C7.465298%26check_in%3D%26check_out%3D%26sort_selected%3D%26currency%3DUSD&campaign_id=137',
    },
    hamburg: {
      name: 'Hotel Atlantic Kempinski Hamburg',
      loc: 'Hamburg, Germany',
      stars: 5,
      photo: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/5c/c5/0722e0bfde503c4d712760adf4ee25a3f20628a73e6660371bdd2feac2be.jpeg',
      url: 'https://tp.media/r?marker=734304&trs=534570&p=4110&u=https%3A%2F%2Fwww.klook.com%2Fen-US%2Fhotels%2Fsearchresult%2F%3Froom_num%3D1%26adult_num%3D2%26child_num%3D0%26age%3D%26longitude%3D-68.8830147447381%26latitude%3D-32.870728800831166%26stype%3Dcity%26svalue%3D353%26override%3DHamburg%2C%2520Germany%26title%3DHamburg%26city_id%3D353%26latlng%26check_in%3D%26check_out%3D%26sort_selected%3D%26currency%3DUSD&campaign_id=137',
    },
    copenhagen: {
      name: "Hotel d'Angleterre",
      loc: 'Copenhagen, Denmark',
      stars: 5,
      photo: 'https://www.dangleterre.com/uploads/media/1200x630/00/370-_DSF2441_SAM_WS2_aRGB_High-1600px.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=copenhagen`,
    },
    stockholm: {
      name: 'Grand Hôtel Stockholm',
      loc: 'Stockholm, Sweden',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Grand_Hotel_June_2018_01.jpg/330px-Grand_Hotel_June_2018_01.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=stockholm`,
    },
    edinburgh: {
      name: 'The Balmoral',
      loc: 'Edinburgh, United Kingdom',
      stars: 5,
      photo: 'https://www.roccofortehotels.com/media/d54dutp2/2-rfh-the-balmoral-facade-0474-jg-sep-18.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=edinburgh`,
    },
    brussels: {
      name: 'Hotel Amigo',
      loc: 'Brussels, Belgium',
      stars: 5,
      photo: 'https://www.roccofortehotels.com/media/caro2u4r/3b-rfh-hotel-amigo-blaton-suite-j1113_rfa_230-th-nov-19-lr.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=brussels`,
    },
    milan: {
      name: 'Hotel Principe di Savoia',
      loc: 'Milan, Italy',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/3693MilanoHotelPrincipeSavoia.JPG/330px-3693MilanoHotelPrincipeSavoia.JPG',
      url: `${PROXY_BASE}/klook-hotel?city=milan`,
    },
    nice: {
      name: 'Hôtel Negresco',
      loc: 'Nice, France',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Nice_H%C3%B4tel_Negresco_Ext%C3%A9rieur_07.jpg/330px-Nice_H%C3%B4tel_Negresco_Ext%C3%A9rieur_07.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=nice`,
    },
    seville: {
      name: 'Hotel Alfonso XIII',
      loc: 'Seville, Spain',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Hotel_Alfonso_XIII%2C_Sevilla%2C_Espa%C3%B1a%2C_2015-12-06%2C_DD_80.JPG/330px-Hotel_Alfonso_XIII%2C_Sevilla%2C_Espa%C3%B1a%2C_2015-12-06%2C_DD_80.JPG',
      url: `${PROXY_BASE}/klook-hotel?city=seville`,
    },
    salzburg: {
      name: 'Hotel Goldener Hirsch',
      loc: 'Salzburg, Austria',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Hotel_Goldener_Hirsch_Salzburg.jpg/250px-Hotel_Goldener_Hirsch_Salzburg.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=salzburg`,
    },
    lucerne: {
      name: 'Hotel Schweizerhof Luzern',
      loc: 'Lucerne, Switzerland',
      stars: 5,
      photo: 'https://www.schweizerhof-luzern.ch/bilder/seo/_800xAUTO_crop_center-center_none/socialMediaFallbackImage.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=lucerne`,
    },
    geneva: {
      name: 'Hôtel Beau-Rivage Genève',
      loc: 'Geneva, Switzerland',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Facade_of_Beau-Rivage_-_Geneva_-_Switzerland_%2816439266897%29.jpg/250px-Facade_of_Beau-Rivage_-_Geneva_-_Switzerland_%2816439266897%29.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=geneva`,
    },
    innsbruck: {
      name: 'Hotel Grauer Bär',
      loc: 'Innsbruck, Austria',
      stars: 4,
      photo: 'https://www.grauer-baer.at/wp-content/uploads/2024/01/hotel-grauer-baer-innsbruck-boutiquehotel-1.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=innsbruck`,
    },
    naples: {
      name: 'Grand Hotel Vesuvio',
      loc: 'Naples, Italy',
      stars: 5,
      photo: 'https://d1vp8nomjxwyf1.cloudfront.net/wp-content/uploads/sites/165/2016/07/01100414/gallery_35-620x700.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=naples`,
    },
    turin: {
      name: 'Turin Palace Hotel',
      loc: 'Turin, Italy',
      stars: 4,
      photo: 'https://www.turinpalacehotel.com/wp-content/uploads/2025/02/dscf2986-hdr.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=turin`,
    },
    monaco: {
      name: 'Hôtel de Paris Monte-Carlo',
      loc: 'Monaco',
      stars: 5,
      photo: 'https://asset.montecarlosbm.com/styles/hero_image_desktop/s3/media/orphea/hotel-de-paris-monte-carlo-facade-de-jour-2024-013_1.jpg.jpeg',
      url: `${PROXY_BASE}/klook-hotel?city=monaco`,
    },
    lyon: {
      name: 'Villa Florentine',
      loc: 'Lyon, France',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Villa_Florentine_%40_Lyon_%2836389389615%29.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=lyon`,
    },
    manchester: {
      name: 'The Midland Hotel',
      loc: 'Manchester, United Kingdom',
      stars: 4,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Midland_Hotel_west%2C_Manchester.jpg/330px-Midland_Hotel_west%2C_Manchester.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=manchester`,
    },
    oxford: {
      name: 'Old Bank Hotel',
      loc: 'Oxford, United Kingdom',
      stars: 5,
      photo: 'https://www.oldbankhotel.co.uk/wp-content/uploads/2023/10/0009-2018-Old-Bank-Hotel-Oxford-High-Res-Old-Bank-Hotel-Quod-Facade-Web-Hero.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=oxford`,
    },
    york: {
      name: 'The Grand, York',
      loc: 'York, United Kingdom',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/The_Grand_Hotel_%26_Spa%2C_York.jpg/330px-The_Grand_Hotel_%26_Spa%2C_York.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=york`,
    },
    valencia: {
      name: 'Hotel Boutique Balandret',
      loc: 'Valencia, Spain',
      stars: 4,
      photo: 'https://balandret.com/wp-content/uploads/2022/03/Hotel-en-Playa-Valencia.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=valencia`,
    },
    bordeaux: {
      name: 'InterContinental Bordeaux – Le Grand Hôtel',
      loc: 'Bordeaux, France',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Fa%C3%A7ade_Grand_H%C3%B4tel_de_Bordeaux.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=bordeaux`,
    },
    graz: {
      name: 'Schlossberg Hotel',
      loc: 'Graz, Austria',
      stars: 4,
      photo: 'https://backend.schlossberghotel.at/wp-content/uploads/2023/11/KurtBauer_Schlossberghotel_FIN-4672-scaled.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=graz`,
    },
    sargans: {
      name: 'Hotel Post Sargans',
      loc: 'Sargans, Switzerland',
      stars: 3,
      photo: 'https://static.wixstatic.com/media/6f78ae_b5faa03b72bf47b8ad119ed8d06cc9d5~mv2.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=sargans`,
    },
    tende: {
      name: 'Hôtel du Centre',
      loc: 'Tende, France',
      stars: 3,
      photo: 'https://hotel-du-centre-tende.fr/og-image.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=tende`,
    },
    bruges: {
      name: 'Hotel Heritage',
      loc: 'Bruges, Belgium',
      stars: 5,
      photo: 'https://www.hotel-heritage.com/wp-content/uploads/elementor/thumbs/289A0021-res7vp7qbz0q15g3rbg8tyy91gvwawbd8f3n5fvlnu.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=bruges`,
    },
    berlin: {
      name: 'Hotel Adlon Kempinski',
      loc: 'Berlin, Germany',
      stars: 5,
      photo: 'https://storage.kempinski.com/cdn-cgi/image/w=1920,f=auto,fit=scale-down/ki-cms-prod/images/7/2/3/5/2625327-1-eng-GB/885bd49e79c3-89887320_4K.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=berlin`,
    },
    brno: {
      name: 'Grandhotel Brno',
      loc: 'Brno, Czech Republic',
      stars: 4,
      photo: 'https://grandhotelbrno.cz/wp-content/uploads/bitmap-15.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=brno`,
    },
    zermatt: {
      name: 'Mont Cervin Palace',
      loc: 'Zermatt, Switzerland',
      stars: 5,
      photo: 'https://www.montcervinpalace.ch/wp-content/uploads/2023/11/winter_mcp-exterior-6-1.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=zermatt`,
    },
    liverpool: {
      name: '30 James Street',
      loc: 'Liverpool, United Kingdom',
      stars: 4,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Albion_House%2C_Liverpool_4.jpg/330px-Albion_House%2C_Liverpool_4.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=liverpool`,
    },
    frankfurt: {
      name: 'Steigenberger Icon Frankfurter Hof',
      loc: 'Frankfurt, Germany',
      stars: 5,
      photo: 'https://assets.hrewards.com/assets/jpg.large_44521_SHR_Frankfurter_Hof_exterior_7_close_36918af2dc.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=frankfurt`,
    },
    lauterbrunnen: {
      name: 'Braunbär Hotel & Spa',
      loc: 'Wengen, Lauterbrunnen valley, Switzerland',
      stars: 4,
      photo: 'https://cdn.prod.website-files.com/65b186476e59e33563a59cdf/65c53f1bae14910723ebbfa5_65bcd2b113e6815013ee49f0_hotel-braunbaer-wengen.webp',
      url: `${PROXY_BASE}/klook-hotel?city=lauterbrunnen`,
    },
    sorrento: {
      name: 'Grand Hotel Excelsior Vittoria',
      loc: 'Sorrento, Italy',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Excelsior_Vittoria_hotel%2C_Sorrento.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=sorrento`,
    },
    positano: {
      name: 'Le Sirenuse',
      loc: 'Positano, Amalfi Coast, Italy',
      stars: 5,
      photo: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/hotelier-images/26/fa/35042564145e028306fddaeea2292caa8eac784057b628241af7dcf0d513.jpeg',
      url: `${PROXY_BASE}/klook-hotel?city=positano`,
    },
    zaragoza: {
      name: 'Hotel Reina Petronila',
      loc: 'Zaragoza, Spain',
      stars: 5,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Zaragoza_-_Complejo_Aragonia_-_Hotel_Reina_Petronila_1.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=zaragoza`,
    },
    girona: {
      name: 'Hotel Peninsular',
      loc: 'Girona, Spain',
      stars: 3,
      photo: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/hotelier-images/78/af/d0bb670163cca63359cc85c6da098a5779c27c3547402d3118965311a49b.jpeg',
      url: `${PROXY_BASE}/klook-hotel?city=girona`,
    },
    figueres: {
      name: 'Hotel Empordà',
      loc: 'Figueres, Spain',
      stars: 3,
      photo: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/19/c1/c1332927fb38208c45a7d20689b523813cf9ee9542530d8559dbc5912cda.jpeg',
      url: `${PROXY_BASE}/klook-hotel?city=figueres`,
    },
    salerno: {
      name: 'Hotel Plaza',
      loc: 'Salerno, Italy',
      stars: 3,
      photo: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/hotelier-images/65/77/702e7322aeb415a8ce6155f06a2c511da6d0bc1a9cd348bf0f9722598cd5.jpeg',
      url: `${PROXY_BASE}/klook-hotel?city=salerno`,
    },
    toulouse: {
      name: "Hôtel d'Orsay",
      loc: 'Toulouse, France',
      stars: 3,
      photo: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/5f/e6/0389a4600856b2b9f3d1eb3c02d842aff368c5c17be9d60f8d6c0d77ac02.jpeg',
      url: `${PROXY_BASE}/klook-hotel?city=toulouse`,
    },
    lourdes: {
      name: 'Hôtel Roissy',
      loc: 'Lourdes, France',
      stars: 4,
      photo: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/1b/35/904b7435487e16addcf95a1bac9ae9d4e512a058735be3628ceddb6f3808.jpeg',
      url: `${PROXY_BASE}/klook-hotel?city=lourdes`,
    },
    jungfraujoch: {
      name: 'Sphinx Observatory – Top of Europe',
      loc: 'Jungfraujoch, Switzerland',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Jungfraujoch_Aerial_View_-_Flickr_-_kuhnmi.jpg/500px-Jungfraujoch_Aerial_View_-_Flickr_-_kuhnmi.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=jungfraujoch`,
    },
  };
  function findCuratedHotel(city) {
    const key = (city || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
    const match = Object.keys(CURATED_HOTELS).find(k => key.startsWith(k));
    return match ? CURATED_HOTELS[match] : null;
  }

  // Función para mostrar la ruta generada
  let _currentTripData = null;

  const TRIP_TL_ICON_TRAIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="13" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="M8 19l-2 3"/><path d="M18 22l-2-3"/><circle cx="7.5" cy="14.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="16.5" cy="14.5" r="1.4" fill="currentColor" stroke="none"/></svg>';
  const TRIP_TL_ICON_HOTEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M2 22h20"/><path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/><path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/><path d="M10 22v-4h4v4"/></svg>';

  function tripTimelineWrap(items) {
    return items.map((item, i) => `
      <div class="trip-tl-item">
        <div class="trip-tl-rail">
          ${item.type === 'title' ? '' : `<div class="trip-tl-icon trip-tl-icon-${item.type}">${item.type === 'train' ? TRIP_TL_ICON_TRAIN : TRIP_TL_ICON_HOTEL}</div>`}
          ${i < items.length - 1 ? '<div class="trip-tl-line"></div>' : ''}
        </div>
        <div class="trip-tl-content">${item.html}</div>
      </div>`
    ).join('');
  }

  window.openTripPlan = function openTripPlan() {
    if (!_currentTripData) return;
    const data = _currentTripData;
    const dict = TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en;
    const content = document.getElementById('tripPlanContent');
    const tlItems = [];

    tlItems.push({ type: 'title', html: `<div class="trip-section-title" style="margin-top:0">${dict.ai_plan_trains || 'Trains'}</div>` });
    data.tramos.forEach(s => {
      const op = s.operador_tren || s.tipo_tren_sugerido || '';
      const stations = (s.estacion_salida && s.estacion_llegada)
        ? `${s.estacion_salida} → ${s.estacion_llegada}`
        : `${s.origen} → ${s.destino}`;
      const noTrain = /ferry|autob[uú]s|bus|no aplica|no hay estaci[oó]n/i.test(
        [op, s.tipo_tren_sugerido, stations, s.origen, s.destino].join(' ')
      );
      const ticketUrl = noTrain
        ? `https://www.google.com/maps/dir/${encodeURIComponent(s.origen)}/${encodeURIComponent(s.destino)}`
        : window.glosxBookTarget(s.origen, s.destino);
      const btnLabel = noTrain ? (dict.ai_view_options || 'Ver opciones →') : (dict.ai_buy_ticket || 'Buy ticket →');
      tlItems.push({ type: 'train', html: `<div class="trip-segment-row" style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div>
          <strong>${s.origen} → ${s.destino}</strong>
          <span>${stations} · ${s.tiempo_trayecto} · ${op}</span>
        </div>
        <a href="${ticketUrl}" target="_blank" rel="noopener noreferrer" class="trip-ticket-btn">${btnLabel}</a>
      </div>` });
    });

    tlItems.push({ type: 'title', html: `<div class="trip-section-title">${dict.ai_plan_hotels || 'Hotels per stop'}</div>` });
    getRouteStops(data).forEach(ciudad => {
      const curated = findCuratedHotel(ciudad);
      if (curated) {
        tlItems.push({ type: 'hotel', html: `<a href="${curated.url}" target="_blank" rel="noopener noreferrer sponsored" class="trip-hotel-row has-photo">
          <img class="trip-hotel-photo" src="${curated.photo}" alt="${curated.name}" loading="lazy" onerror="this.remove()" />
          <div class="trip-hotel-info">
            <span class="trip-hotel-name">${curated.name}</span>
            <span class="trip-hotel-stars">${'★'.repeat(curated.stars || 0)}</span>
            <span class="trip-hotel-loc">${curated.loc}</span>
          </div>
          <span class="trip-hotel-cta">${dict.ai_hotel_price || 'See current price →'}</span>
        </a>` });
        return;
      }
      const url = `${PROXY_BASE}/klook-hotel?city=${encodeURIComponent(ciudad)}`;
      tlItems.push({ type: 'hotel', html: `<a href="${url}" target="_blank" rel="noopener noreferrer sponsored" class="trip-hotel-row">
        <span class="trip-hotel-city">${ciudad}</span>
        <span class="trip-hotel-cta">${dict.ai_hotel_link || 'Find hotels →'}</span>
      </a>` });
    });

    const html = `<div class="trip-timeline">${tripTimelineWrap(tlItems)}</div>`;

    document.getElementById('tripCopyBtn').textContent = dict.ai_plan_copy || 'Copy itinerary';
    document.getElementById('tripPlanModal').querySelector('h3').textContent = dict.ai_plan_title || 'My travel plan';
    document.getElementById('tripPlanModal').querySelector('p').textContent = dict.ai_plan_sub || 'Full route generated by WoW Train';
    document.getElementById('tripPlanNote').textContent = dict.ai_plan_note || 'Links open in a new tab — come back here anytime.';
    content.innerHTML = html;
    document.getElementById('tripPlanModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  window.closeTripPlan = function closeTripPlan() {
    document.getElementById('tripPlanModal').style.display = 'none';
    document.body.style.overflow = '';
  }

  window.copyTripPlan = function copyTripPlan() {
    if (!_currentTripData) return;
    const data = _currentTripData;
    let text = `PLAN DE VIAJE - ${data.resumen.origen_fin_o_concepto}\n`;
    text += `Duración total: ${data.resumen.duracion_estimada_total}\n\n`;
    text += `TRENES:\n`;
    data.tramos.forEach(s => {
      text += `• ${s.origen} → ${s.destino} (${s.tiempo_trayecto}) - ${s.operador_tren || s.tipo_tren_sugerido || ''}\n`;
      if (s.estacion_salida) text += `  ${s.estacion_salida} → ${s.estacion_llegada}\n`;
    });
    text += `\nHOTELES:\n`;
    getRouteStops(data).forEach(c => {
      text += `• ${c}: https://www.booking.com/search.html?ss=${encodeURIComponent(c)}\n`;
    });
    const dict = TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('tripCopyBtn');
      btn.textContent = dict.ai_plan_copied || 'Copied';
      setTimeout(() => { btn.textContent = dict.ai_plan_copy || 'Copy itinerary'; }, 2000);
    });
  }

  // Ordenar tramos encadenando origen→destino (Gemini a veces los devuelve en orden incorrecto)
  function sortTramos(tramos) {
    if (tramos.length <= 1) return tramos;
    const sorted = [];
    const used = new Array(tramos.length).fill(false);
    const destSet = new Set(tramos.map(t => (t.destino || '').toLowerCase()));
    let start = tramos.findIndex(t => !destSet.has((t.origen || '').toLowerCase()));
    if (start === -1) start = 0;
    sorted.push(tramos[start]);
    used[start] = true;
    while (sorted.length < tramos.length) {
      const last = sorted[sorted.length - 1];
      const next = tramos.findIndex((t, i) => !used[i] && (t.origen || '').toLowerCase() === (last.destino || '').toLowerCase());
      if (next === -1) { tramos.forEach((t, i) => { if (!used[i]) { sorted.push(t); used[i] = true; } }); break; }
      sorted.push(tramos[next]);
      used[next] = true;
    }
    return sorted;
  }

  // Paradas reales derivadas de los tramos (origen del primero + destino de cada uno,
  // sin duplicados). paradas_principales a veces no coincide con los tramos generados
  // (ej. incluye una ciudad que no aparece en ningun tramo) y rompia "Hotels per stop".
  function getRouteStops(data) {
    if (!data.tramos || !data.tramos.length) return data.paradas_principales || [];
    const stops = [data.tramos[0].origen];
    data.tramos.forEach(t => { if (t.destino && !stops.some(s => s.toLowerCase() === t.destino.toLowerCase())) stops.push(t.destino); });
    return stops.filter(Boolean);
  }

  function displayAIRoute(data) {
    // Ordenar tramos al inicio para que todo lo que sigue use el orden correcto
    data.tramos = sortTramos(data.tramos);
    _currentTripData = data;
    const inputWrapper = document.getElementById('aiInputWrapper');
    const results = document.getElementById('aiResults');

    // Ocultar input, mostrar resultados
    inputWrapper.style.display = 'none';
    results.style.display = 'block';

    // Llenar datos
    document.getElementById('aiRouteTitle').textContent = data.resumen.origen_fin_o_concepto;
    document.getElementById('aiRouteDuration').textContent = data.resumen.duracion_estimada_total;
    const operadoresUnicos = [...new Set(data.tramos.map(t => (t.operador_tren || t.tipo_tren_sugerido || '').split('·')[0].trim()))].filter(Boolean).join(' · ');
    // Origen y destino reales desde los tramos (más fiable que paradas_principales)
    const origen = data.tramos[0]?.origen || data.paradas_principales[0] || '';
    const destino = data.tramos[data.tramos.length - 1]?.destino || data.paradas_principales[data.paradas_principales.length - 1] || '';
    const metaTpl = (TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en).ai_route_meta_train || '✦ Train from {from} to {to}';
    document.getElementById('aiRouteMeta').textContent =
      `${metaTpl.replace('{from}', origen).replace('{to}', destino)} · ${operadoresUnicos}`;

    // Klook (Trusted Partners) apunta a los hoteles de la ciudad destino de esta ruta
    const vipKlook = document.getElementById('aiVipKlook');
    if (vipKlook && destino) {
      vipKlook.href = `${PROXY_BASE}/klook-hotel?city=${encodeURIComponent(destino)}`;
      vipKlook.target = '_blank';
      vipKlook.rel = 'noopener noreferrer sponsored';
      vipKlook.removeAttribute('onclick');
      const sub = document.getElementById('aiVipKlookSub');
      if (sub) sub.textContent = `Hotels in ${destino}`;
    }

    // Mostrar paradas numeradas (derivadas de los tramos, no de paradas_principales)
    const routeStops = getRouteStops(data);
    const stopsContainer = document.getElementById('aiStops');
    stopsContainer.innerHTML = routeStops.map((stop, i) =>
      `<div class="ai-stop"><span class="ai-stop-num">${(TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en).ai_stop_label || 'STOP'} ${i + 1}</span>${stop}<a class="ai-stop-hotel" href="#" onclick="event.preventDefault(); openTripPlan();">${(TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en).ai_hotel_link || 'Find hotels →'}</a></div>`
    ).join('');

    const CITY_IMG_API = 'https://glosx-backend-production.up.railway.app/api/city-image/';
    const cityImageCache = {};

    async function getCityImage(city) {
      const key = city.toLowerCase();
      if (cityImageCache[key] !== undefined) return cityImageCache[key];
      try {
        const r = await fetch(CITY_IMG_API + encodeURIComponent(city));
        const d = await r.json();
        cityImageCache[key] = d.url || null;
        return cityImageCache[key];
      } catch { return null; }
    }

    function trainClass(name) {
      const n = (name || '').toLowerCase();
      if (/ave|tgv|ice|eurostar|thalys|frecciarossa|italo|alvia|avlo|ouigo|high.?speed|alta.?vel/.test(n)) return 'train-high';
      if (/eurocity|ec\b|intercity.?int|international|nacht|night|sleeper|railjet/.test(n)) return 'train-intl';
      return 'train-reg';
    }

    // Mostrar tramos con grid adaptativo sin scroll
    const segmentsContainer = document.getElementById('aiSegments');
    segmentsContainer.innerHTML = '';
    const n = data.tramos.length;
    segmentsContainer.className = 'ai-segments' + (n === 1 ? '' : n === 2 ? ' cols-2' : n === 3 ? ' cols-3' : ' cols-2x2');
    const SPEED_TERMS = {
      en: { 'Alta Velocidad': 'High Speed', 'Alta velocidad': 'High Speed', 'Larga Distancia': 'Long Distance', 'Regional': 'Regional', 'Internacional': 'International', 'Interurbano': 'Intercity' },
      fr: { 'Alta Velocidad': 'Grande Vitesse', 'Alta velocidad': 'Grande Vitesse', 'Larga Distancia': 'Longue Distance', 'Regional': 'Régional', 'Internacional': 'International', 'Interurbano': 'Intercité' },
      de: { 'Alta Velocidad': 'Hochgeschwindigkeit', 'Alta velocidad': 'Hochgeschwindigkeit', 'Larga Distancia': 'Fernverkehr', 'Regional': 'Regional', 'Internacional': 'International', 'Interurbano': 'Intercity' },
      it: { 'Alta Velocidad': 'Alta Velocità', 'Alta velocidad': 'Alta Velocità', 'Larga Distancia': 'Lunga Percorrenza', 'Regional': 'Regionale', 'Internacional': 'Internazionale', 'Interurbano': 'Interurbano' },
      pt: { 'Alta Velocidad': 'Alta Velocidade', 'Alta velocidad': 'Alta Velocidade', 'Larga Distancia': 'Longa Distância', 'Regional': 'Regional', 'Internacional': 'Internacional', 'Interurbano': 'Inter-regional' },
    };
    function translateOperator(op) {
      const lang = document.documentElement.lang || 'en';
      const map = SPEED_TERMS[lang];
      if (!map) return op;
      let result = op;
      Object.entries(map).forEach(([es, tr]) => { result = result.replace(es, tr); });
      return result;
    }

    data.tramos.forEach(async (segment, index) => {
      const operador = translateOperator(segment.operador_tren || segment.tipo_tren_sugerido || '');
      const cls = trainClass(operador);
      const imgUrl = await getCityImage(segment.destino);
      const altTag = segment.imagen_alt_tag || segment.destino;
      const isLast = index === data.tramos.length - 1;
      const imgHTML = imgUrl
        ? `<div class="ai-segment-img-wrap"><img src="${imgUrl}" alt="${altTag}" class="ai-segment-img" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`
        : '';
      const stationsHTML = (segment.estacion_salida && segment.estacion_llegada)
        ? `<div class="ai-segment-stations">${segment.estacion_salida}<span>→</span>${segment.estacion_llegada}</div>`
        : '';
      const kiwiLabel = (TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en).ai_kiwi_cta || 'Transfer on arrival to';
      const kiwiHTML = isLast
        ? `<a href="#" class="ai-kiwi-cta" onclick="goPartner('kiwitaxi',event)">${kiwiLabel} ${segment.destino} →</a>`
        : '';
      setTimeout(() => {
        const segmentHTML = `
          <div class="ai-segment" style="animation: aiFadeIn 0.5s ease">
            <div class="ai-segment-header">
              <span class="ai-segment-route">${segment.origen} → ${segment.destino}</span>
              <span class="ai-segment-time">${segment.tiempo_trayecto}</span>
            </div>
            ${stationsHTML}
            <div class="ai-segment-train ${cls}">${operador}</div>
            <div class="ai-segment-body">
              <div class="ai-segment-desc">${segment.descripcion_contextual || segment.breve_descripcion_conexion || ''}</div>
              ${imgHTML}
            </div>
            ${kiwiHTML}
          </div>`;
        segmentsContainer.innerHTML += segmentHTML;
      }, index * 300);
    });

    // Dibujar línea SVG con animación de dibujado
    drawRouteLine(routeStops.length);
    const path = document.querySelector('.route-path');
    path.style.animation = 'none';
    path.getBoundingClientRect();
    path.style.animation = 'routeDraw 1.4s cubic-bezier(0.4,0,0.2,1) forwards';
  }

  // Función para dibujar la línea de ruta
  function drawRouteLine(numStops) {
    const svg = document.querySelector('.route-svg');
    const path = document.querySelector('.route-path');
    const width = 1000;
    const height = 200;
    const padding = 50;
    const availableWidth = width - (padding * 2);

    // Calcular puntos de la curva
    const points = [];
    for (let i = 0; i < numStops; i++) {
      const x = numStops === 1 ? padding : padding + (availableWidth / (numStops - 1)) * i;
      const y = height / 2 + (numStops > 2 && i > 0 && i < numStops - 1 ? Math.sin(i) * 30 : 0);
      points.push({ x, y });
    }

    // Trazar path
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) d += ` L ${points[i].x} ${points[i].y}`;
    path.setAttribute('d', d);

    // Limpiar dots anteriores y redibujar
    svg.querySelectorAll('.route-dot').forEach(el => el.remove());
    points.forEach(({ x, y }) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'route-dot');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '8');
      svg.appendChild(circle);
    });
  }

  // Función para resetear el planner
  window.focusAIPlanner = function() {
    const input = document.getElementById('aiInput');
    if (!input) return;
    const rect = input.getBoundingClientRect();
    const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;
    if (!inView) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => input.focus(), 500);
    } else {
      input.focus();
    }
  }

  function resetAIPlanner() {
    const inputWrapper = document.getElementById('aiInputWrapper');
    const results = document.getElementById('aiResults');
    const input = document.getElementById('aiInput');
    
    results.style.display = 'none';
    inputWrapper.style.display = 'block';
    input.value = '';
    
    // Mostrar botón de restaurar si hay caché
    checkRouteCache();
  }

  // Función para guardar ruta en caché
  function saveRouteToCache(input, data) {
    try {
      localStorage.setItem('ai_last_route_input', input);
      localStorage.setItem('ai_last_route_data', JSON.stringify(data));
      localStorage.setItem('ai_last_route_timestamp', Date.now().toString());
    } catch (e) {
      console.error('Error saving to cache:', e);
    }
  }

  // Función para restaurar última ruta
  function restoreLastRoute() {
    try {
      const data = localStorage.getItem('ai_last_route_data');
      if (data) {
        displayAIRoute(JSON.parse(data));
      }
    } catch (e) {
      console.error('Error restoring from cache:', e);
    }
  }

  // Función para verificar caché
  function checkRouteCache() {
    try {
      const timestamp = localStorage.getItem('ai_last_route_timestamp');
      const restoreBtn = document.getElementById('aiRestoreBtn');
      
      if (timestamp) {
        const hoursSince = (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60);
        if (hoursSince < 24) {
          restoreBtn.style.display = 'block';
          return;
        }
      }
      restoreBtn.style.display = 'none';
    } catch (e) {
      console.error('Error checking cache:', e);
    }
  }

  // Inicializar verificación de caché al cargar
  document.addEventListener('DOMContentLoaded', checkRouteCache);

  function showAIPlannerError(msg) {
    const existing = document.getElementById('aiPlannerError');
    if (existing) existing.remove();
    const el = document.createElement('p');
    el.id = 'aiPlannerError';
    el.style.cssText = 'color:#a78bfa;font-size:15px;margin-top:16px;text-align:center;';
    el.textContent = msg;
    document.getElementById('aiInputWrapper').appendChild(el);
    setTimeout(() => el.remove(), 6000);
  }

  // Exponer funciones al scope global (llamadas desde onclick en el HTML)
  window.generateAIRoute = generateAIRoute;
  window.resetAIPlanner = resetAIPlanner;
  window.restoreLastRoute = restoreLastRoute;
  window.setAISuggestion = setAISuggestion;
  window.planRouteFromChip = planRouteFromChip;
  window.invertAIRoute = invertAIRoute;

})();
