
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
        more_countries: 'More countries', footer_blog: 'Blog', footer_about: 'About', footer_privacy: 'Privacy Policy', footer_cookies: 'Cookie Policy', footer_imprint: 'Legal Notice', footer_support: 'Support', footer_terms: 'Terms of Use', footer_contact: 'Contact',
        modal_copy_btn: 'Copy itinerary',
        cookie_text: 'We use essential cookies for site functionality and anonymous analytics to improve your experience.', cookie_accept: 'Accept', cookie_decline: 'Decline', explore_show_all: 'Show all routes', explore_show_fewer: 'Show fewer routes',
        footer_copy: '© 2026 GLOSX — All rights reserved.',
        footer_disclaimer: 'WoW Train is an independent travel platform. Bookings are processed through certified partners such as Klook under their own terms; we are not a party to those transactions. We may receive a commission from qualifying purchases at no extra cost to you.',
        scenic_book: 'Book now', preview_label: 'See it in action', preview_title1: 'Designed for', preview_title2: 'real travelers.', preview_lead: 'GPS detection, real-time schedules, scenic routes and a built-in translator — all in your pocket.', ss_home: 'Choose your country', ss_board: 'Departure board', ss_live: 'Live departures',
        stats_prose: 'From <strong>190 real routes</strong> in <strong>16 countries</strong> to your next trip — free, no signup.', stat_live: 'Browsing now',
        trust_data: 'Real-time data from official railways',
        trust_b1: 'Official GTFS data', trust_b2: 'Live every 90 seconds', trust_b3: 'No sign-up needed', trust_b4: 'Verified schedules & rates', trust_klook: 'Bookings processed officially by Klook',
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
        ai_generate: 'Generate Itinerary', ai_reset: '↺ Create another route', ai_restore: 'View my last route →', ai_buy_ticket: 'View times & book ticket →', ai_view_options: 'View options →',
        ai_input_ph: "e.g., 'Madrid to Paris scenic route' or '5 days through Swiss Alps'", ai_suggest_label: '✦ Inspire yourself:',
        ai_plan_hotels: 'Featured stay per stop', ai_hotel_budget_alt: 'See budget options in {city} →', ai_plan_copy: 'Copy itinerary', ai_plan_copied: 'Copied', ai_hotel_link: 'Find hotels →', ai_hotel_price: 'See current price →', ai_kiwi_cta: 'Book a private transfer in', ai_stop_label: 'STOP', ai_budget_label: 'Estimated Trip Budget', ai_budget_trains: 'Trains (this route)', ai_budget_daily: 'Hostel + food, per day', ai_budget_disclaimer: 'Estimates only, based on public budget-travel averages — actual prices vary by provider, season and booking date. Always confirm final pricing before purchasing.', ai_high_demand: "We're experiencing high demand right now — please try again in a bit, or pick one of the popular routes above.", ai_trust_note: 'Secure booking via our official Klook partnership', ai_multileg_note: 'This trip has {n} legs — book each one separately, just like any multi-country train journey.', ai_tramo_modal_title: 'WoW Train', ai_tramo_modal_body: "We're looking up schedules for this leg. Pick the train you like in the Klook tab that just opened, then come back here to move on.", ai_tramo_modal_btn: "I picked this one → next leg", ai_tramo_final_title: '🎉 Itinerary complete!', ai_tramo_final_body: 'All your legs are set up in the other tab. Check your Klook cart and go to secure checkout to get your tickets. Have a great trip!', ai_tramo_final_btn: 'Close', discover_1_country: 'Austria · Hidden gem', discover_1_route: 'Train to Hallstatt + lake ferry', discover_1_season: 'Best: May–Sep · ~3h 30 from Salzburg', discover_1_tip: 'A fairytale village on a glassy alpine lake. The train drops you on the far shore and a little ferry glides you across — arriving by car never feels this magical.', discover_2_country: 'Slovenia · Hidden gem', discover_2_route: 'Via Ljubljana · Bohinj Railway', discover_2_season: 'Best: Jun–Sep · island church & castle', discover_2_tip: 'An island church on an emerald lake under a clifftop castle. Two stations, one secret — pick the right one and the train drops you by the water.', discover_3_country: 'Switzerland · Hidden gem', discover_3_route: 'Via Interlaken · Berner Oberland Bahn', discover_3_season: 'Best: Jun–Oct · 72 waterfalls flowing', discover_3_tip: 'A valley of 72 waterfalls beneath sheer cliffs. No direct line — change at Interlaken onto a mountain railway that\'s half the magic.', discover_4_country: 'France · Hidden gem', discover_4_route: 'Direct TGV from Paris (~2h20)', discover_4_season: 'Best: Dec markets & spring flowers', discover_4_tip: 'The "Little Venice" of Alsace — half-timbered houses and flower-lined canals, a short walk from a direct TGV station.', discover_5_country: 'Germany → Italy', discover_5_route: 'EuroCity over the Brenner Pass', discover_5_season: '~7h · Alps, Tyrol & the Adige valley', discover_5_tip: 'One of Europe\'s most scenic rides — from Bavaria over the Alps, down through vineyards to the edge of the Venetian lagoon.', discover_6_country: 'France → Italy', discover_6_route: 'TGV / Frecciarossa · Fréjus tunnel', discover_6_season: 'Crossing the Alps · France to Piedmont', discover_6_tip: 'From Lyon\'s riverside to baroque Turin, threading the Maurienne valley and the historic Alpine tunnel into Italy.', discover_7_country: 'France → Spain', discover_7_route: 'Direct TGV high-speed', discover_7_season: '~6h 30 · city centre to city centre', discover_7_tip: 'One train from Paris through the south of France and the Pyrenees, straight into the heart of Barcelona.', discover_8_country: 'France → Netherlands', discover_8_route: 'Eurostar direct · via Brussels', discover_8_season: '~3h 20 · several departures a day', discover_8_tip: 'From the cafés of Paris to the canals of Amsterdam in a single high-speed hop — easily beating the plane door to door.', discover_watch: '▶ Video + guide', rv4_route: 'La Spezia → Vernazza · Cinque Terre', rv4_body: 'Five villages in one afternoon, hopping on and off the little coastal train. By car it would\'ve been a parking nightmare.', rv5_route: 'Interlaken → Lauterbrunnen · Alps', rv5_body: 'The train hugged the mountainside and a valley of waterfalls opened up below. I actually gasped out loud.', rv6_route: 'Madrid → Barcelona · AVE', rv6_body: 'From the centre of Madrid to the heart of Barcelona in 2h30, faster than flying once you count the airport. Game changer.', rv7_route: 'Vienna → Venice · Night train', rv7_body: 'Fell asleep in Vienna, woke up to the lagoon in Venice. Saved a hotel night and arrived with the whole day ahead.', rv8_route: 'Porto → Pocinho · Douro Valley', rv8_body: 'The line follows the river through terraced vineyards. One of the most beautiful train rides I\'ve ever taken, and barely any tourists.', explore_routes_title: 'Explore European train routes', explore_routes_sub: 'Schedules, prices and tips for 100 popular rail journeys across Europe.', ios_install_title: 'Install WoW Train', ios_install_text: 'Tap the Share icon, then "Add to Home Screen".', ios_install_dismiss: 'Dismiss', pwa_install_title: 'Install WoW Train', pwa_install_text: 'Add it to your home screen for quick access, no app-store download needed.', pwa_install_cta: 'Install',
        popular_routes_label: '★ Popular routes · book instantly',
      },
      es: {
        nav_scenic: 'Trenes panorámicos', nav_discover: 'Descubramos juntos', nav_essentials: 'Esenciales de viaje', nav_features: 'Características', nav_download: 'Empezar', nav_routes: 'Rutas',
        partners_see_all: 'Ver todos los esenciales →',
        hero_badge: 'Planificador IA de trenes europeos',
        hero_h1: 'Planificador IA de trenes por Europa',
        hero_title1: 'Describe tu viaje.', hero_title2: 'Nosotros planificamos.',
        hero_subtitle: 'Cuéntanos a dónde quieres ir — nuestra IA arma el itinerario completo, te conecta para comprar los billetes vía Klook y encuentra hoteles en cada parada.',
        hero_ai_cta: 'Planifica mi viaje con IA →', hero_search_link: '¿Ya sabes tu ruta? Busca directo →',
        search_from: 'Desde', search_to: 'Hasta', search_date: 'Fecha', search_btn: 'Buscar pasajes y horarios →',
        stat_world: 'Europa y el mundo', stat_free_val: 'Gratis', stat_free: 'Sin costo, para siempre', stat_realtime_val: 'Tiempo real', stat_realtime: 'Salidas en vivo 24/7', stat_noreg_val: 'Sin registro', stat_noreg: 'Abre y busca, sin cuenta',
        scenic_label: 'Rutas europeas icónicas', scenic_title1: 'Experiencias en', scenic_title2: 'tren panorámico.',
        scenic_lead: 'Los viajes en tren más espectaculares de Europa — reserva directo desde aquí.',
        scenic_more: 'Ver más rutas', scenic_less: 'Ver menos',
        partners_label: 'Todo para tu viaje', partners_title1: 'Esenciales de viaje', partners_title2: 'para Europa.',
        partners_lead: 'Servicios seleccionados que complementan tu viaje en tren.',
        vip_label: 'Partners de confianza', vip_booking: 'Hoteles y alojamiento →', vip_tripadvisor: 'Experiencias y reseñas →', vip_klook_hotels: 'Elige tu ciudad →',
        disc_label: 'Comunidad', disc_title1: 'Descubramos', disc_title2: 'juntos.', disc_lead: 'Pueblos y rincones de Europa que solo encuentras en tren — compartidos por viajeros, para viajeros.', disc_cta_title: '¿Conoces un lugar que solo revela el tren? ', disc_cta_text: 'Comparte la ruta, el pueblo, la parada secreta — y ayuda a otros viajeros a descubrirlo.', disc_cta_btn: 'Comparte tu descubrimiento →',
        p_klook_title: 'Pases de ciudad', p_klook_desc: 'Madrid, Barcelona, París, Roma, Londres, Berlín — transporte ilimitado y entrada sin filas a las principales atracciones.', p_klook_cta: 'Ver pases →',
        p_kiwi_title: 'Traslados aeropuerto', p_kiwi_desc: 'Taxi privado desde cualquier aeropuerto europeo hasta tu hotel o estación. Precio fijo, sin sorpresas.', p_kiwi_cta: 'Reservar traslado →',
        p_yesim_title: 'eSIM Europa', p_yesim_desc: 'Conéctate en más de 30 países europeos desde €4.90. Activación instantánea en tu teléfono — sin cambiar la SIM.', p_yesim_cta: 'Activar eSIM →',
        p_tiqets_title: 'Entradas a atracciones', p_tiqets_desc: 'Entrada sin filas a Sagrada Familia, Coliseo, Louvre, Torre Eiffel y más de 6.000 atracciones en Europa.', p_tiqets_cta: 'Ver entradas →',
        p_storage_title: 'Guardar equipaje', p_storage_desc: 'Custodia segura de equipaje en más de 1.000 puntos en ciudades europeas. Deja tus maletas desde €5 y explora libremente.', p_storage_cta: 'Buscar custodia →',
        p_car_title: 'Alquiler de autos', p_car_cta: 'Alquilar auto →', p_insurance_title: 'Seguro de viaje', p_insurance_cta: 'Asegúrate →',
        features_label: 'Por qué WoW Train', features_title1: 'Hecho para viajeros', features_title2: 'que se mueven rápido.',
        features_lead: 'Sin suscripciones, sin paywalls. Solo datos en tiempo real y herramientas inteligentes.',
        f1_title: 'Salidas en tiempo real', f1_desc: 'Retrasos en vivo, cambios de andén y cancelaciones desde datos oficiales de los ferrocarriles.',
        f2_title: 'Tu tren, tu mundo', f2_desc: 'España, Francia, Alemania, Suiza, Italia y más — todo en una sola interfaz.',
        f3_title: 'Búsqueda de viaje', f3_desc: 'Encuentra trenes entre cualquier par de estaciones de Europa con precios y horarios reales.',
        f4_title: 'Sin costos de consultoría', f4_desc: 'Diseña rutas complejas por Europa con múltiples países, 100% gratis. Ganamos una comisión de Klook cuando reservas a través nuestro, sin costo adicional para ti.',
        f5_title: 'Alertas inteligentes', f5_desc: 'Recibe avisos cuando tu tren está por llegar o hay retrasos en tu ruta.',
        f6_title: 'Ecosistema unificado', f6_desc: 'Rutas de tren, eSIM y esenciales de viaje — todo para tu viaje en un solo lugar.',
        dl_title: 'Empieza tu viaje ahora.',
        dl_subtitle: 'Busca trenes, explora rutas panorámicas y reserva con partners verificados — todo desde tu navegador, sin instalar nada.',
        dl_web: 'Buscar trenes ahora', dl_scenic: 'Explorar rutas panorámicas',
        ai_route_meta_train: '✦ Tren de {from} a {to}',
        faq_label: 'Preguntas frecuentes', faq_title1: 'Todo lo que', faq_title2: 'necesitas saber.',
        faq1_q: '¿Qué es WoW Train?', faq1_a: 'Una plataforma independiente y gratuita para diseñar itinerarios escénicos en tren por Europa. Sin cuenta, sin suscripción — explora, planifica y reserva a través de socios certificados.',
        faq2_q: '¿Cómo reservo un pasaje?', faq2_a: 'Te conectamos de forma directa y transparente con socios oficiales como Klook. Busca tu ruta, haz clic en "Ver horarios →" y completa la reserva en la plataforma segura de Klook.',
        faq3_q: '¿Cómo publico mi experiencia?', faq3_a: 'Usa el formulario interactivo: escribe tu momento WoW (máx. 140 caracteres), elige tu puntuación con estrellas y presiona Publicar. Tu reseña se publica en la nube en tiempo real.',
        faq4_q: '¿Cobran comisiones?', faq4_a: '100% gratis para el usuario. WoW Train recibe una comisión de socios oficiales como Klook cuando reservas, sin costo adicional para ti. Transparente, independiente y siempre de tu lado.',
        faq5_q: '¿Son privados mis datos?', faq5_a: 'WoW Train no recopila, almacena ni comparte datos personales en servidores externos. Sin cuentas, sin rastreo, sin publicidad.',
        more_countries: 'Más países', footer_blog: 'Blog', footer_about: 'Sobre nosotros', footer_privacy: 'Política de privacidad', footer_cookies: 'Política de cookies', footer_imprint: 'Aviso legal', footer_support: 'Soporte', footer_terms: 'Términos de uso', footer_contact: 'Contacto',
        modal_copy_btn: 'Copiar itinerario',
        cookie_text: 'Usamos cookies esenciales para el funcionamiento del sitio y analíticas anónimas para mejorar tu experiencia.', cookie_accept: 'Aceptar', cookie_decline: 'Rechazar', explore_show_all: 'Ver todas las rutas', explore_show_fewer: 'Ver menos rutas',
        footer_copy: '© 2026 GLOSX — Todos los derechos reservados.',
        footer_disclaimer: 'WoW Train es una plataforma de viajes independiente. Las reservas se procesan bajo los términos del socio correspondiente (como Klook); no somos parte de esa transacción. Podemos recibir una comisión por compras cualificadas sin costo adicional para usted.',
        scenic_book: 'Reservar en Klook', preview_label: 'Velo en acción', preview_title1: 'Diseñada para', preview_title2: 'viajeros de verdad.', preview_lead: 'Detección por GPS, horarios en tiempo real, rutas escénicas y un traductor integrado — todo en tu bolsillo.', ss_home: 'Elige tu país', ss_board: 'Tablero de salidas', ss_live: 'Salidas en vivo',
        stats_prose: 'De <strong>190 rutas reales</strong> en <strong>16 países</strong> a tu próximo viaje — gratis, sin registro.', stat_live: 'Navegando ahora',
        trust_data: 'Datos en tiempo real de ferroviarias oficiales',
        trust_b1: 'Datos GTFS oficiales', trust_b2: 'En vivo cada 90 segundos', trust_b3: 'Sin registro', trust_b4: 'Horarios y tarifas verificados', trust_klook: 'Reservas procesadas oficialmente por Klook',
        nav_adventure: 'Planifica tu aventura',
        adv_label: 'Arma tu aventura', adv_title1: 'Arma tu propia', adv_title2: 'aventura.',
        adv_lead: 'Elige un arquetipo de viaje y trazamos la cadena lógica de trenes reales que te lleva de ciudad en ciudad — cada conexión, una escena.',
        route_classic: 'Ruta Clásica (Francia–Italia)', route_alpine: 'Ruta Alpina (Suiza–Austria)', route_imperial: 'Ruta Imperial (Europa Central)',
        tl_empty: 'Toca una ruta para desplegar su línea de tiempo.', wt_close_aria: 'Cerrar ruta',
        disc_cta_title: '¿Conoces un lugar que solo revela el tren?',
        reviews_label: 'Historias del Vagón', reviews_title1: 'Voces del', reviews_title2: 'trayecto.',
        reviews_lead: 'Lo que recuerdan no es el destino — es el momento en que el tren lo cambió todo.',
        wt_momento: 'Momento WoW:',
        rv1_route: 'París ➔ Milán · Ruta Clásica', rv1_body: 'Puro confort. Crucé los Alpes con un café caliente y la laptop abierta — llegué a Milán descansada, no destruida como después de un vuelo.',
        rv2_route: 'Zúrich ➔ Viena · Ruta Alpina', rv2_body: 'Sin estrés. Un solo billete, conexiones que encajaron solas, sin las interminables colas de seguridad. Me senté y simplemente lo disfruté.',
        rv3_route: 'Praga ➔ Budapest · Ruta Imperial', rv3_body: 'El paisaje. El Danubio apareció en un recodo al atardecer y todo el vagón quedó en silencio. Ninguna ventanilla de avión te da eso.',
        rv_ph_name: 'Nombre, País', rv_ph_route: 'Tu ruta de tren', rv_ph_body: 'Tu momento WoW en el tren...', rv_publish: 'Publicar', rv_ok: '¡Publicado!', rv_error_empty: 'Completa tu nombre y comentario.', rv_chars_label: 'caracteres restantes',
        ai_label: 'Planificador IA', ai_title1: 'Describe tu', ai_title2: 'viaje soñado.',
        ai_subtitle: 'Desde rutas simples ciudad a ciudad hasta aventuras complejas de varios días — nuestra IA planifica la ruta perfecta en tren.',
        ai_generate: 'Generar Itinerario', ai_reset: '↺ Crear otra ruta', ai_restore: 'Ver mi última ruta →', ai_buy_ticket: 'Ver horarios y reservar en Klook →', ai_view_options: 'Ver opciones →',
        ai_input_ph: "ej., 'Ruta Madrid a París con vistas' o '5 días por los Alpes suizos'", ai_suggest_label: '✦ Inspírate:',
        ai_plan_hotels: 'Hotel destacado por parada', ai_hotel_budget_alt: 'Ver opciones económicas en {city} →', ai_plan_copy: 'Copiar itinerario', ai_plan_copied: 'Copiado', ai_hotel_link: 'Ver hoteles →', ai_hotel_price: 'Ver precio actual →', ai_kiwi_cta: 'Reservar traslado privado en', ai_stop_label: 'PARADA', ai_budget_label: 'Presupuesto estimado del viaje', ai_budget_trains: 'Trenes (esta ruta)', ai_budget_daily: 'Hostel + comida, por día', ai_budget_disclaimer: 'Solo estimaciones, basadas en promedios públicos de viaje con presupuesto — los precios reales varían según el proveedor, la temporada y la fecha de reserva. Confirma siempre el precio final antes de comprar.', ai_high_demand: 'Estamos con mucha demanda ahora mismo — prueba de nuevo en un rato, o elige una de las rutas populares de arriba.', ai_trust_note: 'Reserva segura a través de nuestra alianza oficial con Klook', ai_multileg_note: 'Este viaje tiene {n} tramos — reserva cada uno por separado, como en cualquier viaje en tren por varios países.', ai_tramo_modal_title: 'WoW Train', ai_tramo_modal_body: 'Estamos buscando los horarios de este tramo. Elegí el tren que más te guste en la pestaña de Klook que se acaba de abrir y volvé acá para seguir con el próximo.', ai_tramo_modal_btn: 'Ya lo elegí → siguiente tramo', ai_tramo_final_title: '🎉 ¡Itinerario Completo Organizado con Éxito!', ai_tramo_final_body: 'Ya tienes todas tus paradas listas en la otra pestaña. Puedes revisar tus trenes en el carrito de Klook y proceder al pago seguro para recibir tus tickets. ¡Buen viaje!', ai_tramo_final_btn: 'Cerrar', discover_1_country: 'Austria · Joya escondida', discover_1_route: 'Tren a Hallstatt + ferry en el lago', discover_1_season: 'Mejor época: mayo–sep · ~3h 30 desde Salzburgo', discover_1_tip: 'Un pueblo de cuento sobre un lago alpino cristalino. El tren te deja en la otra orilla y un pequeño ferry te cruza — llegar en auto nunca se siente tan mágico.', discover_2_country: 'Eslovenia · Joya escondida', discover_2_route: 'Vía Liubliana · Ferrocarril de Bohinj', discover_2_season: 'Mejor época: jun–sep · iglesia en la isla y castillo', discover_2_tip: 'Una iglesia en una isla sobre un lago color esmeralda, bajo un castillo en el acantilado. Dos estaciones, un secreto: elige la correcta y el tren te deja junto al agua.', discover_3_country: 'Suiza · Joya escondida', discover_3_route: 'Vía Interlaken · Berner Oberland Bahn', discover_3_season: 'Mejor época: jun–oct · 72 cascadas activas', discover_3_tip: 'Un valle de 72 cascadas bajo paredes de roca vertical. No hay línea directa — haz combinación en Interlaken con un tren de montaña que es la mitad de la magia.', discover_4_country: 'Francia · Joya escondida', discover_4_route: 'TGV directo desde París (~2h 20)', discover_4_season: 'Mejor época: mercados de diciembre y flores de primavera', discover_4_tip: 'La "Pequeña Venecia" de Alsacia — casas con entramado de madera y canales floridos, a pocos pasos de una estación TGV directa.', discover_5_country: 'Alemania → Italia', discover_5_route: 'EuroCity por el paso del Brennero', discover_5_season: '~7h · Alpes, Tirol y el valle del Adigio', discover_5_tip: 'Uno de los recorridos más panorámicos de Europa — desde Baviera, cruzando los Alpes, bajando entre viñedos hasta el borde de la laguna veneciana.', discover_6_country: 'Francia → Italia', discover_6_route: 'TGV / Frecciarossa · túnel de Fréjus', discover_6_season: 'Cruzando los Alpes · de Francia al Piamonte', discover_6_tip: 'Desde la costa del río en Lyon hasta la barroca Turín, atravesando el valle de Maurienne y el histórico túnel alpino hacia Italia.', discover_7_country: 'Francia → España', discover_7_route: 'TGV directo de alta velocidad', discover_7_season: '~6h 30 · centro a centro', discover_7_tip: 'Un solo tren desde París, cruzando el sur de Francia y los Pirineos, directo al corazón de Barcelona.', discover_8_country: 'Francia → Países Bajos', discover_8_route: 'Eurostar directo · vía Bruselas', discover_8_season: '~3h 20 · varias salidas por día', discover_8_tip: 'De los cafés de París a los canales de Ámsterdam en un solo salto de alta velocidad — le gana fácil al avión puerta a puerta.', discover_watch: '▶ Video + guía', rv4_route: 'La Spezia → Vernazza · Cinque Terre', rv4_body: 'Cinco pueblos en una sola tarde, subiendo y bajando del trencito costero. En auto hubiera sido una pesadilla para estacionar.', rv5_route: 'Interlaken → Lauterbrunnen · Alpes', rv5_body: 'El tren se pegaba a la montaña y abajo se abría un valle lleno de cascadas. Se me escapó un grito de verdad.', rv6_route: 'Madrid → Barcelona · AVE', rv6_body: 'Del centro de Madrid al corazón de Barcelona en 2h30, más rápido que volar si cuentas el tiempo del aeropuerto. Un cambio total.', rv7_route: 'Viena → Venecia · Tren nocturno', rv7_body: 'Me dormí en Viena y me desperté frente a la laguna de Venecia. Me ahorré una noche de hotel y llegué con todo el día por delante.', rv8_route: 'Oporto → Pocinho · Valle del Duero', rv8_body: 'La línea sigue el río entre viñedos en terrazas. Uno de los viajes en tren más lindos que hice, y casi sin turistas.', explore_routes_title: 'Explora rutas de tren por Europa', explore_routes_sub: 'Horarios, precios y consejos para 100 rutas populares en tren por Europa.', ios_install_title: 'Instala WoW Train', ios_install_text: 'Toca el ícono de Compartir y luego "Añadir a inicio".', ios_install_dismiss: 'Cerrar', pwa_install_title: 'Instala WoW Train', pwa_install_text: 'Agregala a tu pantalla de inicio para acceso rápido, sin pasar por la tienda de apps.', pwa_install_cta: 'Instalar',
        popular_routes_label: '★ Rutas populares · reserva al instante',
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
        more_countries: 'Plus de pays', footer_blog: 'Blog', footer_about: 'À propos', footer_privacy: 'Politique de confidentialité', footer_cookies: 'Politique des cookies', footer_imprint: 'Mentions légales', footer_support: 'Support', footer_terms: 'Conditions d\'utilisation', footer_contact: 'Contact',
        modal_copy_btn: 'Copier l\'itinéraire',
        cookie_text: 'Nous utilisons des cookies essentiels et des analyses anonymes pour améliorer votre expérience.', cookie_accept: 'Accepter', cookie_decline: 'Refuser', explore_show_all: 'Voir tous les trajets', explore_show_fewer: 'Voir moins de trajets',
        footer_copy: '© 2026 GLOSX — Tous droits réservés.',
        footer_disclaimer: 'WoW Train est une plateforme de voyage indépendante. Les réservations sont traitées selon les conditions du partenaire concerné ; nous ne sommes pas partie à cette transaction. Nous pouvons percevoir une commission sur les achats qualifiés sans frais supplémentaires pour vous.',
        scenic_book: 'Réserver', preview_label: 'Voyez-le en action', preview_title1: 'Conçue pour', preview_title2: 'les vrais voyageurs.', preview_lead: 'Détection GPS, horaires en temps réel, itinéraires panoramiques et un traducteur intégré — le tout dans votre poche.', ss_home: 'Choisissez votre pays', ss_board: 'Tableau des départs', ss_live: 'Départs en direct',
        stats_prose: 'De <strong>190 itinéraires réels</strong> dans <strong>16 pays</strong> vers votre prochain voyage — gratuit, sans inscription.', stat_live: 'En ligne maintenant',
        trust_data: 'Données en temps réel des chemins de fer officiels',
        trust_b1: 'Données GTFS officielles', trust_b2: 'En direct toutes les 90 s', trust_b3: 'Sans inscription', trust_b4: 'Horaires et tarifs vérifiés', trust_klook: 'Réservations traitées officiellement par Klook',
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
        ai_generate: 'Générer l\'itinéraire', ai_reset: '↺ Créer une autre route', ai_restore: 'Voir mon dernier itinéraire →', ai_buy_ticket: 'Voir les horaires et réserver →', ai_view_options: 'Voir les options →',
        ai_input_ph: "ex. : 'Paris à Rome avec vue' ou '5 jours dans les Alpes suisses'", ai_suggest_label: '✦ Inspirez-vous :',
        ai_plan_hotels: 'Hébergement recommandé par étape', ai_hotel_budget_alt: 'Voir les options économiques à {city} →', ai_plan_copy: 'Copier l\'itinéraire', ai_plan_copied: 'Copié', ai_hotel_link: 'Voir les hôtels →', ai_hotel_price: 'Voir le prix actuel →', ai_kiwi_cta: 'Réserver un transfert privé à', ai_stop_label: 'ARRÊT', ai_budget_label: 'Budget de voyage estimé', ai_budget_trains: 'Trains (cet itinéraire)', ai_budget_daily: 'Auberge + repas, par jour', ai_budget_disclaimer: 'Estimations uniquement, basées sur des moyennes publiques de voyage à petit budget — les prix réels varient selon le fournisseur, la saison et la date de réservation. Confirmez toujours le prix final avant d\'acheter.', ai_high_demand: 'Nous connaissons une forte demande en ce moment — réessayez un peu plus tard, ou choisissez l\'un des itinéraires populaires ci-dessus.', ai_trust_note: 'Réservation sécurisée via notre partenariat officiel avec Klook', ai_multileg_note: 'Ce voyage comporte {n} étapes — réservez chacune séparément, comme pour tout trajet en train à travers plusieurs pays.', ai_tramo_modal_title: 'WoW Train', ai_tramo_modal_body: "Nous recherchons les horaires de cette étape. Choisissez votre train dans l'onglet Klook qui vient de s'ouvrir, puis revenez ici pour passer à la suivante.", ai_tramo_modal_btn: "Choisi → étape suivante", ai_tramo_final_title: '🎉 Itinéraire complet !', ai_tramo_final_body: "Toutes vos étapes sont prêtes dans l'autre onglet. Consultez votre panier Klook et passez au paiement sécurisé pour recevoir vos billets. Bon voyage !", ai_tramo_final_btn: 'Fermer', discover_1_country: 'Autriche · Pépite cachée', discover_1_route: 'Train jusqu\'à Hallstatt + ferry sur le lac', discover_1_season: 'Idéal : mai–sept · ~3h 30 depuis Salzbourg', discover_1_tip: 'Un village de conte de fées sur un lac alpin cristallin. Le train vous dépose sur l\'autre rive et un petit ferry vous fait traverser — jamais une arrivée en voiture n\'aura cette magie.', discover_2_country: 'Slovénie · Pépite cachée', discover_2_route: 'Via Ljubljana · Ligne de Bohinj', discover_2_season: 'Idéal : juin–sept · église insulaire & château', discover_2_tip: 'Une église sur une île au cœur d\'un lac émeraude, dominée par un château perché. Deux gares, un secret : choisissez la bonne et le train vous dépose au bord de l\'eau.', discover_3_country: 'Suisse · Pépite cachée', discover_3_route: 'Via Interlaken · Berner Oberland Bahn', discover_3_season: 'Idéal : juin–oct · 72 cascades en activité', discover_3_tip: 'Une vallée de 72 cascades sous des falaises abruptes. Aucune ligne directe — changez à Interlaken pour un petit train de montagne qui fait déjà la moitié de la magie.', discover_4_country: 'France · Pépite cachée', discover_4_route: 'TGV direct depuis Paris (~2h20)', discover_4_season: 'Idéal : marchés de décembre & fleurs de printemps', discover_4_tip: 'La « Petite Venise » d\'Alsace — maisons à colombages et canaux fleuris, à deux pas d\'une gare TGV directe.', discover_5_country: 'Allemagne → Italie', discover_5_route: 'EuroCity via le col du Brenner', discover_5_season: '~7h · Alpes, Tyrol & vallée de l\'Adige', discover_5_tip: 'L\'un des trajets les plus panoramiques d\'Europe — depuis la Bavière, à travers les Alpes, puis parmi les vignes jusqu\'aux abords de la lagune de Venise.', discover_6_country: 'France → Italie', discover_6_route: 'TGV / Frecciarossa · tunnel du Fréjus', discover_6_season: 'Traversée des Alpes · de la France au Piémont', discover_6_tip: 'Des rives de Lyon jusqu\'à la baroque Turin, en traversant la vallée de la Maurienne et le tunnel alpin historique menant à l\'Italie.', discover_7_country: 'France → Espagne', discover_7_route: 'TGV direct à grande vitesse', discover_7_season: '~6h30 · centre-ville à centre-ville', discover_7_tip: 'Un seul train depuis Paris, à travers le sud de la France et les Pyrénées, jusqu\'au cœur de Barcelone.', discover_8_country: 'France → Pays-Bas', discover_8_route: 'Eurostar direct · via Bruxelles', discover_8_season: '~3h20 · plusieurs départs par jour', discover_8_tip: 'Des cafés de Paris aux canaux d\'Amsterdam en un seul bond à grande vitesse — plus rapide que l\'avion de porte à porte.', discover_watch: '▶ Vidéo + guide', rv4_route: 'La Spezia → Vernazza · Cinque Terre', rv4_body: 'Cinq villages en une seule après-midi, en montant et descendant du petit train côtier. En voiture, ça aurait été un cauchemar pour se garer.', rv5_route: 'Interlaken → Lauterbrunnen · Alpes', rv5_body: 'Le train longeait la montagne et une vallée de cascades s\'est ouverte en contrebas. J\'ai vraiment eu le souffle coupé.', rv6_route: 'Madrid → Barcelone · AVE', rv6_body: 'Du centre de Madrid au cœur de Barcelone en 2h30, plus rapide que l\'avion une fois qu\'on compte l\'aéroport. Ça change tout.', rv7_route: 'Vienne → Venise · Train de nuit', rv7_body: 'Je me suis endormi à Vienne et réveillé devant la lagune de Venise. J\'ai économisé une nuit d\'hôtel et suis arrivé avec toute la journée devant moi.', rv8_route: 'Porto → Pocinho · Vallée du Douro', rv8_body: 'La ligne longe le fleuve à travers des vignobles en terrasses. L\'un des plus beaux trajets en train que j\'aie faits, et presque aucun touriste.', explore_routes_title: 'Explorez les itinéraires de train en Europe', explore_routes_sub: 'Horaires, prix et conseils pour 100 trajets en train populaires en Europe.', ios_install_title: 'Installer WoW Train', ios_install_text: 'Appuyez sur Partager, puis « Sur l\'écran d\'accueil ».', ios_install_dismiss: 'Fermer', pwa_install_title: 'Installer WoW Train', pwa_install_text: 'Ajoutez-la à votre écran d\'accueil pour un accès rapide, sans passer par le store.', pwa_install_cta: 'Installer',
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
        more_countries: 'Weitere Länder', footer_blog: 'Blog', footer_about: 'Über uns', footer_privacy: 'Datenschutz', footer_cookies: 'Cookie-Richtlinie', footer_imprint: 'Impressum', footer_support: 'Support', footer_terms: 'Nutzungsbedingungen', footer_contact: 'Kontakt',
        modal_copy_btn: 'Reiseplan kopieren',
        cookie_text: 'Wir verwenden essenzielle Cookies und anonyme Analysen, um Ihr Erlebnis zu verbessern.', cookie_accept: 'Akzeptieren', cookie_decline: 'Ablehnen', explore_show_all: 'Alle Routen anzeigen', explore_show_fewer: 'Weniger Routen anzeigen',
        footer_copy: '© 2026 GLOSX — Alle Rechte vorbehalten.',
        footer_disclaimer: 'WoW Train ist eine unabhängige Reiseplattform. Buchungen werden gemäß den Bedingungen des jeweiligen Partners abgewickelt; wir sind nicht Teil dieser Transaktion. Wir können eine Provision aus qualifizierenden Käufen ohne zusätzliche Kosten für Sie erhalten.',
        scenic_book: 'Buchen', preview_label: 'In Aktion erleben', preview_title1: 'Gemacht für', preview_title2: 'echte Reisende.', preview_lead: 'GPS-Erkennung, Echtzeit-Fahrpläne, Panoramastrecken und integrierter Übersetzer — alles in deiner Tasche.', ss_home: 'Wähle dein Land', ss_board: 'Abfahrtstafel', ss_live: 'Live-Abfahrten',
        stats_prose: 'Von <strong>190 echten Routen</strong> in <strong>16 Ländern</strong> zu deiner nächsten Reise — kostenlos, ohne Anmeldung.', stat_live: 'Jetzt aktiv',
        trust_data: 'Echtzeitdaten offizieller Bahnen',
        trust_b1: 'Offizielle GTFS-Daten', trust_b2: 'Live alle 90 Sekunden', trust_b3: 'Keine Anmeldung nötig', trust_b4: 'Geprüfte Fahrpläne & Tarife', trust_klook: 'Buchungen offiziell über Klook abgewickelt',
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
        ai_generate: 'Reiseplan erstellen', ai_reset: '↺ Eine andere Route erstellen', ai_restore: 'Letzte Route anzeigen →', ai_buy_ticket: 'Fahrpläne ansehen & Ticket buchen →', ai_view_options: 'Optionen ansehen →',
        ai_input_ph: "z.B. 'Paris nach Rom mit Aussicht' oder '5 Tage durch die Schweizer Alpen'", ai_suggest_label: '✦ Lass dich inspirieren:',
        ai_plan_hotels: 'Empfohlene Unterkunft pro Halt', ai_hotel_budget_alt: 'Günstige Optionen in {city} ansehen →', ai_plan_copy: 'Reiseplan kopieren', ai_plan_copied: 'Kopiert', ai_hotel_link: 'Hotels anzeigen →', ai_hotel_price: 'Aktuellen Preis ansehen →', ai_kiwi_cta: 'Privaten Transfer buchen in', ai_stop_label: 'HALT', ai_budget_label: 'Geschätztes Reisebudget', ai_budget_trains: 'Züge (diese Route)', ai_budget_daily: 'Hostel + Essen, pro Tag', ai_budget_disclaimer: 'Nur Schätzungen basierend auf öffentlichen Budget-Reise-Durchschnittswerten — die tatsächlichen Preise variieren je nach Anbieter, Saison und Buchungsdatum. Bestätigen Sie immer den Endpreis vor dem Kauf.', ai_high_demand: 'Wir haben gerade sehr hohe Nachfrage — versuchen Sie es später noch einmal oder wählen Sie eine der beliebten Routen oben.', ai_trust_note: 'Sichere Buchung über unsere offizielle Klook-Partnerschaft', ai_multileg_note: 'Diese Reise hat {n} Etappen — buche jede einzeln, wie bei jeder Zugreise durch mehrere Länder.', ai_tramo_modal_title: 'WoW Train', ai_tramo_modal_body: 'Wir suchen die Fahrpläne für diese Etappe. Wähle deinen Zug im gerade geöffneten Klook-Tab und komm dann hierher zurück für die nächste Etappe.', ai_tramo_modal_btn: 'Ausgewählt → nächste Etappe', ai_tramo_final_title: '🎉 Reiseplan vollständig!', ai_tramo_final_body: 'Alle Etappen sind im anderen Tab bereit. Prüfe deinen Klook-Warenkorb und gehe zur sicheren Kasse, um deine Tickets zu erhalten. Gute Reise!', ai_tramo_final_btn: 'Schließen', discover_1_country: 'Österreich · Geheimtipp', discover_1_route: 'Zug nach Hallstatt + Fähre über den See', discover_1_season: 'Beste Zeit: Mai–Sep · ~3 Std. 30 ab Salzburg', discover_1_tip: 'Ein Märchendorf an einem glasklaren Alpensee. Der Zug setzt dich am gegenüberliegenden Ufer ab, eine kleine Fähre bringt dich hinüber — mit dem Auto anzukommen fühlt sich nie so magisch an.', discover_2_country: 'Slowenien · Geheimtipp', discover_2_route: 'Über Ljubljana · Bohinjbahn', discover_2_season: 'Beste Zeit: Jun–Sep · Inselkirche & Schloss', discover_2_tip: 'Eine Inselkirche auf einem smaragdgrünen See unter einer Burg auf dem Felsen. Zwei Bahnhöfe, ein Geheimnis — wähle den richtigen und der Zug setzt dich direkt am Wasser ab.', discover_3_country: 'Schweiz · Geheimtipp', discover_3_route: 'Über Interlaken · Berner Oberland Bahn', discover_3_season: 'Beste Zeit: Jun–Okt · 72 aktive Wasserfälle', discover_3_tip: 'Ein Tal mit 72 Wasserfällen unter senkrechten Felswänden. Keine direkte Linie — steig in Interlaken auf eine Bergbahn um, die schon die halbe Magie ausmacht.', discover_4_country: 'Frankreich · Geheimtipp', discover_4_route: 'Direkter TGV ab Paris (~2 Std. 20)', discover_4_season: 'Beste Zeit: Weihnachtsmärkte & Frühlingsblüten', discover_4_tip: 'Das „Klein-Venedig" des Elsass — Fachwerkhäuser und blumengesäumte Kanäle, nur wenige Schritte vom direkten TGV-Bahnhof entfernt.', discover_5_country: 'Deutschland → Italien', discover_5_route: 'EuroCity über den Brennerpass', discover_5_season: '~7 Std. · Alpen, Tirol & Etschtal', discover_5_tip: 'Eine der schönsten Bahnstrecken Europas — von Bayern über die Alpen, durch Weinberge bis an den Rand der venezianischen Lagune.', discover_6_country: 'Frankreich → Italien', discover_6_route: 'TGV / Frecciarossa · Fréjus-Tunnel', discover_6_season: 'Alpenüberquerung · von Frankreich nach Piemont', discover_6_tip: 'Von den Ufern Lyons bis ins barocke Turin, durch das Maurienne-Tal und den historischen Alpentunnel nach Italien.', discover_7_country: 'Frankreich → Spanien', discover_7_route: 'Direkter Hochgeschwindigkeits-TGV', discover_7_season: '~6 Std. 30 · Stadtzentrum zu Stadtzentrum', discover_7_tip: 'Ein einziger Zug ab Paris, durch Südfrankreich und die Pyrenäen, direkt ins Herz von Barcelona.', discover_8_country: 'Frankreich → Niederlande', discover_8_route: 'Direkter Eurostar · über Brüssel', discover_8_season: '~3 Std. 20 · mehrere Abfahrten täglich', discover_8_tip: 'Von den Cafés von Paris zu den Grachten Amsterdams in einem einzigen Hochgeschwindigkeitssprung — von Tür zu Tür schneller als das Flugzeug.', discover_watch: '▶ Video + Guide', rv4_route: 'La Spezia → Vernazza · Cinque Terre', rv4_body: 'Fünf Dörfer an einem Nachmittag, rein und raus aus dem kleinen Küstenzug. Mit dem Auto wäre die Parkplatzsuche der reinste Albtraum gewesen.', rv5_route: 'Interlaken → Lauterbrunnen · Alpen', rv5_body: 'Der Zug schmiegte sich an den Berghang, und darunter öffnete sich ein Tal voller Wasserfälle. Mir ist tatsächlich der Mund offen stehen geblieben.', rv6_route: 'Madrid → Barcelona · AVE', rv6_body: 'Vom Zentrum Madrids ins Herz Barcelonas in 2 Std. 30 — schneller als fliegen, wenn man den Flughafen mitrechnet. Ein echter Gamechanger.', rv7_route: 'Wien → Venedig · Nachtzug', rv7_body: 'Bin in Wien eingeschlafen und in Venedig an der Lagune aufgewacht. Eine Hotelnacht gespart und mit dem ganzen Tag vor mir angekommen.', rv8_route: 'Porto → Pocinho · Douro-Tal', rv8_body: 'Die Strecke folgt dem Fluss durch terrassierte Weinberge. Eine der schönsten Zugfahrten, die ich je gemacht habe, und kaum Touristen.', explore_routes_title: 'Europäische Zugstrecken entdecken', explore_routes_sub: 'Fahrpläne, Preise und Tipps für 100 beliebte Zugstrecken in ganz Europa.', ios_install_title: 'WoW Train installieren', ios_install_text: 'Tippe auf Teilen, dann auf „Zum Home-Bildschirm".', ios_install_dismiss: 'Schließen', pwa_install_title: 'WoW Train installieren', pwa_install_text: 'Zum Home-Bildschirm hinzufügen für schnellen Zugriff, ganz ohne App Store.', pwa_install_cta: 'Installieren',
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
        more_countries: 'Altri paesi', footer_blog: 'Blog', footer_about: 'Chi siamo', footer_privacy: 'Informativa privacy', footer_cookies: 'Politica dei cookie', footer_imprint: 'Note legali', footer_support: 'Supporto', footer_terms: 'Termini d\'uso', footer_contact: 'Contatto',
        modal_copy_btn: 'Copia itinerario',
        cookie_text: 'Utilizziamo cookie essenziali e analisi anonime per migliorare la tua esperienza.', cookie_accept: 'Accetta', cookie_decline: 'Rifiuta', explore_show_all: 'Vedi tutte le tratte', explore_show_fewer: 'Vedi meno tratte',
        footer_copy: '© 2026 GLOSX — Tutti i diritti riservati.',
        footer_disclaimer: 'WoW Train è una piattaforma di viaggio indipendente. Le prenotazioni vengono elaborate secondo i termini del partner corrispondente; non siamo parte di tale transazione. Potremmo ricevere una commissione sugli acquisti qualificati senza costi aggiuntivi per te.',
        scenic_book: 'Prenota', preview_label: 'Guardalo in azione', preview_title1: 'Progettata per', preview_title2: 'veri viaggiatori.', preview_lead: 'Rilevamento GPS, orari in tempo reale, percorsi panoramici e traduttore integrato — tutto in tasca.', ss_home: 'Scegli il tuo paese', ss_board: 'Tabellone partenze', ss_live: 'Partenze in tempo reale',
        stats_prose: 'Da <strong>190 percorsi reali</strong> in <strong>16 paesi</strong> al tuo prossimo viaggio — gratis, senza registrazione.', stat_live: 'Online ora',
        trust_data: 'Dati in tempo reale dalle ferrovie ufficiali',
        trust_b1: 'Dati GTFS ufficiali', trust_b2: 'In diretta ogni 90 secondi', trust_b3: 'Nessuna registrazione', trust_b4: 'Orari e tariffe verificati', trust_klook: 'Prenotazioni gestite ufficialmente da Klook',
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
        ai_generate: 'Genera itinerario', ai_reset: '↺ Crea un\'altra route', ai_restore: 'Vedi il mio ultimo percorso →', ai_buy_ticket: 'Vedi orari e prenota il biglietto →', ai_view_options: 'Vedi le opzioni →',
        ai_input_ph: "es. 'Parigi a Roma con panorama' o '5 giorni tra le Alpi svizzere'", ai_suggest_label: '✦ Lasciati ispirare:',
        ai_plan_hotels: 'Hotel in evidenza per tappa', ai_hotel_budget_alt: 'Vedi opzioni economiche a {city} →', ai_plan_copy: 'Copia itinerario', ai_plan_copied: 'Copiato', ai_hotel_link: 'Vedi hotel →', ai_hotel_price: 'Vedi prezzo attuale →', ai_kiwi_cta: 'Prenota un transfer privato a', ai_stop_label: 'TAPPA', ai_budget_label: 'Budget di viaggio stimato', ai_budget_trains: 'Treni (questo percorso)', ai_budget_daily: 'Ostello + cibo, al giorno', ai_budget_disclaimer: 'Solo stime, basate su medie pubbliche di viaggio economico — i prezzi reali variano in base al fornitore, alla stagione e alla data di prenotazione. Conferma sempre il prezzo finale prima di acquistare.', ai_high_demand: 'Stiamo riscontrando molta richiesta in questo momento — riprova tra poco, oppure scegli una delle rotte popolari qui sopra.', ai_trust_note: 'Prenotazione sicura tramite la nostra partnership ufficiale con Klook', ai_multileg_note: 'Questo viaggio ha {n} tappe — prenota ognuna separatamente, come in qualsiasi viaggio in treno tra più paesi.', ai_tramo_modal_title: 'WoW Train', ai_tramo_modal_body: 'Stiamo cercando gli orari per questa tappa. Scegli il treno che preferisci nella scheda Klook appena aperta, poi torna qui per passare alla prossima.', ai_tramo_modal_btn: 'Scelto → tappa successiva', ai_tramo_final_title: '🎉 Itinerario completato!', ai_tramo_final_body: 'Tutte le tue tappe sono pronte nell\'altra scheda. Controlla il tuo carrello Klook e procedi al pagamento sicuro per ricevere i biglietti. Buon viaggio!', ai_tramo_final_btn: 'Chiudi', discover_1_country: 'Austria · Gioiello nascosto', discover_1_route: 'Treno per Hallstatt + traghetto sul lago', discover_1_season: 'Periodo ideale: mag–set · ~3h 30 da Salisburgo', discover_1_tip: 'Un borgo da favola su un lago alpino cristallino. Il treno ti lascia sulla sponda opposta e un piccolo traghetto ti porta dall\'altra parte — arrivare in auto non regala mai questa magia.', discover_2_country: 'Slovenia · Gioiello nascosto', discover_2_route: 'Via Lubiana · Ferrovia di Bohinj', discover_2_season: 'Periodo ideale: giu–set · chiesetta sull\'isola e castello', discover_2_tip: 'Una chiesetta su un\'isola in un lago color smeraldo, sotto un castello a picco sulla roccia. Due stazioni, un segreto: scegli quella giusta e il treno ti lascia proprio sull\'acqua.', discover_3_country: 'Svizzera · Gioiello nascosto', discover_3_route: 'Via Interlaken · Berner Oberland Bahn', discover_3_season: 'Periodo ideale: giu–ott · 72 cascate attive', discover_3_tip: 'Una valle di 72 cascate sotto pareti di roccia verticali. Nessuna linea diretta — cambia a Interlaken su un trenino di montagna che è già metà della magia.', discover_4_country: 'Francia · Gioiello nascosto', discover_4_route: 'TGV diretto da Parigi (~2h20)', discover_4_season: 'Periodo ideale: mercatini di dicembre e fiori di primavera', discover_4_tip: 'La "Piccola Venezia" dell\'Alsazia — case a graticcio e canali fioriti, a pochi passi da una stazione TGV diretta.', discover_5_country: 'Germania → Italia', discover_5_route: 'EuroCity attraverso il passo del Brennero', discover_5_season: '~7h · Alpi, Tirolo e valle dell\'Adige', discover_5_tip: 'Uno dei percorsi più panoramici d\'Europa — dalla Baviera, attraverso le Alpi, tra i vigneti fino al bordo della laguna veneziana.', discover_6_country: 'Francia → Italia', discover_6_route: 'TGV / Frecciarossa · traforo del Fréjus', discover_6_season: 'Attraversando le Alpi · dalla Francia al Piemonte', discover_6_tip: 'Dalle rive di Lione alla barocca Torino, attraversando la Valle della Maurienne e lo storico traforo alpino verso l\'Italia.', discover_7_country: 'Francia → Spagna', discover_7_route: 'TGV diretto ad alta velocità', discover_7_season: '~6h30 · centro città a centro città', discover_7_tip: 'Un unico treno da Parigi, attraverso il sud della Francia e i Pirenei, dritto nel cuore di Barcellona.', discover_8_country: 'Francia → Paesi Bassi', discover_8_route: 'Eurostar diretto · via Bruxelles', discover_8_season: '~3h20 · diverse partenze al giorno', discover_8_tip: 'Dai caffè di Parigi ai canali di Amsterdam in un unico balzo ad alta velocità — batte facilmente l\'aereo porta a porta.', discover_watch: '▶ Video + guida', rv4_route: 'La Spezia → Vernazza · Cinque Terre', rv4_body: 'Cinque borghi in un solo pomeriggio, salendo e scendendo dal trenino costiero. In auto sarebbe stato un incubo per parcheggiare.', rv5_route: 'Interlaken → Lauterbrunnen · Alpi', rv5_body: 'Il treno costeggiava la montagna e sotto si apriva una valle piena di cascate. Mi è davvero scappato un urlo.', rv6_route: 'Madrid → Barcellona · AVE', rv6_body: 'Dal centro di Madrid al cuore di Barcellona in 2h30, più veloce dell\'aereo se conti l\'aeroporto. Cambia tutto.', rv7_route: 'Vienna → Venezia · Treno notturno', rv7_body: 'Mi sono addormentato a Vienna e svegliato davanti alla laguna di Venezia. Ho risparmiato una notte in hotel e sono arrivato con tutta la giornata davanti.', rv8_route: 'Porto → Pocinho · Valle del Douro', rv8_body: 'La linea segue il fiume tra vigneti terrazzati. Uno dei viaggi in treno più belli che abbia mai fatto, e quasi nessun turista.', explore_routes_title: 'Esplora le rotte in treno in Europa', explore_routes_sub: 'Orari, prezzi e consigli per 100 percorsi in treno popolari in tutta Europa.', ios_install_title: 'Installa WoW Train', ios_install_text: 'Tocca Condividi, poi "Aggiungi alla schermata Home".', ios_install_dismiss: 'Chiudi', pwa_install_title: 'Installa WoW Train', pwa_install_text: 'Aggiungila alla schermata Home per un accesso rapido, senza passare dallo store.', pwa_install_cta: 'Installa',
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
        more_countries: 'Mais países', footer_blog: 'Blog', footer_about: 'Sobre nós', footer_privacy: 'Política de privacidade', footer_cookies: 'Política de cookies', footer_imprint: 'Aviso legal', footer_support: 'Suporte', footer_terms: 'Termos de utilização', footer_contact: 'Contacto',
        modal_copy_btn: 'Copiar itinerário',
        cookie_text: 'Utilizamos cookies essenciais e análises anónimas para melhorar a sua experiência.', cookie_accept: 'Aceitar', cookie_decline: 'Recusar', explore_show_all: 'Ver todas as rotas', explore_show_fewer: 'Ver menos rotas',
        footer_copy: '© 2026 GLOSX — Todos os direitos reservados.',
        footer_disclaimer: 'WoW Train é uma plataforma de viagens independente. As reservas são processadas segundo os termos do parceiro correspondente; não somos parte dessa transação. Podemos receber uma comissão por compras qualificadas sem custo adicional para si.',
        scenic_book: 'Reservar en Klook', preview_label: 'Veja em ação', preview_title1: 'Projetada para', preview_title2: 'viajantes a sério.', preview_lead: 'Deteção por GPS, horários em tempo real, rotas cénicas e tradutor integrado — tudo no seu bolso.', ss_home: 'Escolha o seu país', ss_board: 'Painel de partidas', ss_live: 'Partidas ao vivo',
        stats_prose: 'De <strong>190 rotas reais</strong> em <strong>16 países</strong> para a sua próxima viagem — grátis, sem cadastro.', stat_live: 'A navegar agora',
        trust_data: 'Dados em tempo real de ferrovias oficiais',
        trust_b1: 'Dados GTFS oficiais', trust_b2: 'Ao vivo a cada 90 segundos', trust_b3: 'Sem registo', trust_b4: 'Horários e tarifas verificados', trust_klook: 'Reservas processadas oficialmente pela Klook',
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
        ai_generate: 'Gerar itinerário', ai_reset: '↺ Criar outra rota', ai_restore: 'Ver minha última rota →', ai_buy_ticket: 'Ver horários e reservar bilhete →', ai_view_options: 'Ver opções →',
        ai_input_ph: "ex. 'Paris a Roma com vista' ou '5 dias pelos Alpes suíços'", ai_suggest_label: '✦ Inspire-se:',
        ai_plan_hotels: 'Hotel em destaque por parada', ai_hotel_budget_alt: 'Ver opções econômicas em {city} →', ai_plan_copy: 'Copiar itinerário', ai_plan_copied: 'Copiado', ai_hotel_link: 'Ver hotéis →', ai_hotel_price: 'Ver preço atual →', ai_kiwi_cta: 'Reservar traslado privado em', ai_stop_label: 'PARAGEM', ai_budget_label: 'Orçamento estimado da viagem', ai_budget_trains: 'Trens (esta rota)', ai_budget_daily: 'Hostel + comida, por dia', ai_budget_disclaimer: 'Apenas estimativas, baseadas em médias públicas de viagens econômicas — os preços reais variam de acordo com o fornecedor, a temporada e a data de reserva. Confirme sempre o preço final antes de comprar.', ai_high_demand: 'Estamos com muita demanda agora — tente novamente em instantes, ou escolha uma das rotas populares acima.', ai_trust_note: 'Reserva segura através da nossa parceria oficial com a Klook', ai_multileg_note: 'Esta viagem tem {n} trechos — reserve cada um separadamente, como em qualquer viagem de trem por vários países.', ai_tramo_modal_title: 'WoW Train', ai_tramo_modal_body: 'Estamos procurando os horários deste trecho. Escolha o trem que preferir na aba do Klook que acabou de abrir e volte aqui para seguir para o próximo.', ai_tramo_modal_btn: 'Escolhi → próximo trecho', ai_tramo_final_title: '🎉 Itinerário completo!', ai_tramo_final_body: 'Todos os seus trechos estão prontos na outra aba. Confira seu carrinho no Klook e siga para o pagamento seguro para receber seus tickets. Boa viagem!', ai_tramo_final_btn: 'Fechar', discover_1_country: 'Áustria · Joia escondida', discover_1_route: 'Trem até Hallstatt + balsa no lago', discover_1_season: 'Melhor época: mai–set · ~3h30 de Salzburgo', discover_1_tip: 'Uma vila de conto de fadas em um lago alpino cristalino. O trem te deixa na margem oposta e uma pequena balsa faz a travessia — chegar de carro nunca é tão mágico.', discover_2_country: 'Eslovênia · Joia escondida', discover_2_route: 'Via Liubliana · Ferrovia de Bohinj', discover_2_season: 'Melhor época: jun–set · igreja na ilha e castelo', discover_2_tip: 'Uma igreja em uma ilha num lago esmeralda, sob um castelo no penhasco. Duas estações, um segredo: escolha a certa e o trem te deixa à beira da água.', discover_3_country: 'Suíça · Joia escondida', discover_3_route: 'Via Interlaken · Berner Oberland Bahn', discover_3_season: 'Melhor época: jun–out · 72 cachoeiras ativas', discover_3_tip: 'Um vale com 72 cachoeiras sob paredões verticais. Sem linha direta — faça baldeação em Interlaken para um trenzinho de montanha que já é metade da magia.', discover_4_country: 'França · Joia escondida', discover_4_route: 'TGV direto desde Paris (~2h20)', discover_4_season: 'Melhor época: mercados de dezembro e flores de primavera', discover_4_tip: 'A "Pequena Veneza" da Alsácia — casas de enxaimel e canais floridos, a poucos passos de uma estação TGV direta.', discover_5_country: 'Alemanha → Itália', discover_5_route: 'EuroCity pelo passo do Brenner', discover_5_season: '~7h · Alpes, Tirol e vale do Adige', discover_5_tip: 'Um dos trajetos mais panorâmicos da Europa — da Baviera, cruzando os Alpes, descendo entre vinhedos até a beira da lagoa de Veneza.', discover_6_country: 'França → Itália', discover_6_route: 'TGV / Frecciarossa · túnel de Fréjus', discover_6_season: 'Cruzando os Alpes · da França ao Piemonte', discover_6_tip: 'Da beira do rio em Lyon até a barroca Turim, atravessando o vale de Maurienne e o histórico túnel alpino rumo à Itália.', discover_7_country: 'França → Espanha', discover_7_route: 'TGV direto de alta velocidade', discover_7_season: '~6h30 · centro a centro', discover_7_tip: 'Um único trem desde Paris, cruzando o sul da França e os Pirineus, direto ao coração de Barcelona.', discover_8_country: 'França → Países Baixos', discover_8_route: 'Eurostar direto · via Bruxelas', discover_8_season: '~3h20 · várias partidas por dia', discover_8_tip: 'Dos cafés de Paris aos canais de Amsterdã em um único salto de alta velocidade — supera facilmente o avião porta a porta.', discover_watch: '▶ Vídeo + guia', rv4_route: 'La Spezia → Vernazza · Cinque Terre', rv4_body: 'Cinco vilarejos em uma única tarde, entrando e saindo do trenzinho costeiro. De carro teria sido um pesadelo para estacionar.', rv5_route: 'Interlaken → Lauterbrunnen · Alpes', rv5_body: 'O trem seguia rente à montanha e um vale cheio de cachoeiras se abriu logo abaixo. Eu literalmente dei um grito.', rv6_route: 'Madrid → Barcelona · AVE', rv6_body: 'Do centro de Madrid ao coração de Barcelona em 2h30, mais rápido que voar se contar o tempo de aeroporto. Mudou tudo.', rv7_route: 'Viena → Veneza · Trem noturno', rv7_body: 'Adormeci em Viena e acordei com a lagoa de Veneza à vista. Economizei uma noite de hotel e cheguei com o dia todo pela frente.', rv8_route: 'Porto → Pocinho · Vale do Douro', rv8_body: 'A linha segue o rio por entre vinhedos em terraços. Uma das viagens de trem mais bonitas que já fiz, e quase sem turistas.', explore_routes_title: 'Explore rotas de trem pela Europa', explore_routes_sub: 'Horários, preços e dicas para 100 trajetos de trem populares pela Europa.', ios_install_title: 'Instalar o WoW Train', ios_install_text: 'Toque em Compartilhar e depois em "Adicionar à Tela de Início".', ios_install_dismiss: 'Fechar', pwa_install_title: 'Instalar WoW Train', pwa_install_text: 'Adicione à tela de início para acesso rápido, sem passar pela loja de apps.', pwa_install_cta: 'Instalar',
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
      // 3. Idioma del navegador/dispositivo (ej. "es-AR" -> "es"). No afecta a
      //    Googlebot, que renderiza con navigator.language = en-US; el canonical
      //    self-referencing y el hreflang x-default siguen intactos para SEO.
      const browserLangs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
      for (const bl of browserLangs) {
        const code = (bl || '').split('-')[0].toLowerCase();
        if (TRANSLATIONS[code]) return code;
      }
      // 4. Inglés por defecto si el idioma del navegador no está soportado
      return 'en';
    }

    function applyLang(lang) {
      const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
      document.documentElement.lang = lang;
      // El canonical NO se toca acá: ya viene correcto desde el servidor
      // (/, /es/, /fr/, /it/ cada uno con el suyo). Reescribirlo con JS a
      // "?lang=X" generaba URLs fantasma que Search Console marcaba como
      // error de redireccion, y pisaba el canonical real en las paginas
      // /es/ /fr/ /it/ server-rendered.
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
    document.querySelectorAll('#navLinks a:not(.nav-partners-btn)').forEach(a => {
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
      window.GLOSX_ROUTE_PAGES = new Set(["amsterdam-berlin","amsterdam-brussels","barcelona-girona","barcelona-lyon","barcelona-valencia","basel-paris","berlin-hamburg","berlin-prague","bordeaux-lourdes","brno-vienna","brussels-bruges","brussels-paris","copenhagen-stockholm","dortmund-munich","florence-pisa","florence-venice","frankfurt-cologne","frankfurt-munich","frankfurt-paris","geneva-paris","geneva-zermatt","girona-figueres","interlaken-lauterbrunnen","lisbon-porto","london-amsterdam","london-brussels","london-cambridge","london-edinburgh","london-liverpool","london-manchester","london-oxford","london-paris","london-york","lyon-turin","madrid-barcelona","madrid-malaga","madrid-seville","madrid-valencia","madrid-zaragoza","milan-florence","milan-rome","milan-zurich","montreux-interlaken","munich-berlin","munich-prague","munich-venice","munich-vienna","naples-salerno","naples-sorrento","nice-monaco","oslo-bergen","paris-amsterdam","paris-barcelona","paris-berlin","paris-bordeaux","paris-bruges","paris-london","paris-lourdes","paris-lucerne","paris-lyon","paris-milan","paris-nice","paris-rome","paris-toulouse","paris-zurich","prague-brno","prague-budapest","prague-vienna","rome-florence","rome-naples","rome-venice","stockholm-oslo","toulouse-lourdes","turin-milan","venice-milan","vienna-budapest","vienna-krems","vienna-prague","vienna-salzburg","zaragoza-barcelona","zurich-lucerne","zurich-milan"]);
      window.glosxBookTarget = function(a, b) {
        function sl(x){ return (x||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''); }
        return 'https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=' + encodeURIComponent(sl(a)) + '&to=' + encodeURIComponent(sl(b));
      };
      // Modal de transicion entre tramos: la pestana de Klook se abre normal (target=_blank,
      // por eso DataDome no la bloquea), este modal es propio, solo guia visualmente al
      // usuario para que reserve tramo por tramo. No confirma reserva real, solo progreso visual.
      window.__glosxTramoActivo = null;
      window.mostrarModalTramo = function(index, origen, destino) {
        window.__glosxTramoActivo = index;
        var t = (TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en);
        // Restaurar el modal al estado normal (por si quedo en el mensaje final de una ruta previa)
        var titleEl = document.getElementById('glosxTramoModalTitle');
        var bodyEl = document.getElementById('glosxTramoModalBody');
        var btnEl = document.getElementById('glosxTramoModalBtn');
        if (titleEl) titleEl.textContent = t.ai_tramo_modal_title || 'WoW Train';
        if (bodyEl) bodyEl.textContent = t.ai_tramo_modal_body || "We're looking up schedules for this leg. Pick the train you like in the Klook tab that just opened, then come back here to move on.";
        if (btnEl) { btnEl.textContent = t.ai_tramo_modal_btn || 'I picked this one \u2192 next leg'; btnEl.onclick = window.confirmarTramoModal; }
        var el = document.getElementById('glosxTramoModalRoute');
        if (el) el.textContent = origen + ' \u2192 ' + destino;
        var modal = document.getElementById('glosxTramoModal');
        if (modal) modal.style.display = 'flex';
      };
      window.confirmarTramoModal = function() {
        if (window.__glosxTramoActivo !== null) {
          var card = document.getElementById('ai-segment-' + window.__glosxTramoActivo);
          if (card) card.classList.add('ai-segment-done');
        }
        window.__glosxTramoActivo = null;
        var modal = document.getElementById('glosxTramoModal');
        var allSegments = document.querySelectorAll('.ai-segment');
        var doneSegments = document.querySelectorAll('.ai-segment.ai-segment-done');
        if (allSegments.length && doneSegments.length === allSegments.length) {
          // Todos los tramos confirmados: mostrar mensaje final en vez de cerrar
          var t = (TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en);
          var titleEl = document.getElementById('glosxTramoModalTitle');
          var bodyEl = document.getElementById('glosxTramoModalBody');
          var routeEl = document.getElementById('glosxTramoModalRoute');
          var btnEl = document.getElementById('glosxTramoModalBtn');
          if (titleEl) titleEl.textContent = t.ai_tramo_final_title || 'Itinerary complete!';
          if (bodyEl) bodyEl.textContent = t.ai_tramo_final_body || 'All your legs are set. Check your Klook cart and go to secure checkout to get your tickets. Have a great trip!';
          if (routeEl) routeEl.textContent = '';
          if (btnEl) {
            btnEl.textContent = t.ai_tramo_final_btn || 'Close';
            btnEl.onclick = function() { modal.style.display = 'none'; };
          }
        } else if (modal) {
          modal.style.display = 'none';
        }
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

    // ── Prefill del planner AI por URL (?from= / ?to=) — usado por CTAs del blog ──
    function runAIPrefillFromUrl() {
      try {
        var p = new URLSearchParams(window.location.search);
        var from = p.get('from'); var to = p.get('to');
        if (!from && !to) return;
        var text = (from && to) ? (from + ' to ' + to) : (from || to);
        setAISuggestion(text);
        var wrapper = document.getElementById('aiInputWrapper');
        if (wrapper) {
          wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(function(){ document.getElementById('aiInput')?.focus(); }, 600);
        }
      } catch (e) {}
    }
    runAIPrefillFromUrl();
    // Red de seguridad: si algo bloqueó la ejecución sincrónica de arriba
    // (script cargado antes de tiempo, DOM aún no listo, etc.), reintentar
    // apenas el DOM esté completamente parseado.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runAIPrefillFromUrl);
    }

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
      'Austria': ['Graz', 'Innsbruck', 'Krems', 'Salzburg', 'Vienna'],
      'Belgium': ['Bruges', 'Brussels'],
      'Czech Republic': ['Brno', 'Prague'],
      'Denmark': ['Copenhagen'],
      'France': ['Bordeaux', 'Lourdes', 'Lyon', 'Marseille', 'Miramas', 'Nice', 'Paris', 'Strasbourg', 'Tende', 'Toulouse'],
      'Germany': ['Berlin', 'Cologne', 'Dortmund', 'Frankfurt', 'Hamburg', 'Mainz', 'Munich'],
      'Hungary': ['Budapest'],
      'Slovenia': ['Ljubljana'],
      'Italy': ['Florence', 'Milan', 'Naples', 'Pisa', 'Positano', 'Rome', 'Salerno', 'Siena', 'Sorrento', 'Turin', 'Venice'],
      'Monaco': ['Monaco'],
      'Netherlands': ['Amsterdam'],
      'Spain': ['Barcelona', 'Figueres', 'Girona', 'Madrid', 'Malaga', 'Seville', 'Valencia', 'Zaragoza'],
      'Sweden': ['Stockholm'],
      'Switzerland': ['Basel', 'Bern', 'Geneva', 'Interlaken', 'Jungfraujoch', 'Lauterbrunnen', 'Lucerne', 'Montreux', 'Sargans', 'Spiez', 'St. Moritz', 'Zermatt', 'Zurich', 'Zweisimmen'],
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
      // Cargar el script del widget recién ahora, no en la carga inicial de la página
      const widgetSrc = panel.getAttribute('data-widget-src');
      if (widgetSrc) {
        const s = document.createElement('script');
        s.src = widgetSrc;
        s.async = true;
        s.charset = 'utf-8';
        panel.appendChild(s);
        panel.removeAttribute('data-widget-src');
      }
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
    wrapEl.setAttribute('data-route', key);
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

  // jsPDF se carga on-demand (antes se pedia siempre en el <head>, en cada
  // visita, aunque casi nadie usa "Descargar PDF" -- competia por ancho de
  // banda con el hero justo cuando mas importa, en el LCP).
  function loadJsPDF() {
    if (window.jspdf) return Promise.resolve();
    if (window._jspdfLoading) return window._jspdfLoading;
    window._jspdfLoading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return window._jspdfLoading;
  }

  // Generar y descargar el itinerario en PDF (marca + mapa + recorrido + link)
  window.downloadItinerary = async function (key) {
    var route = ROUTES[key];
    if (!route) return;
    var btn = document.querySelector('.wt-pdf-btn');
    if (btn) btn.disabled = true;
    try {
      await loadJsPDF();
    } catch (e) {
      if (btn) btn.disabled = false;
      return;
    }
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

  // ── Scroll-spy: resalta el enlace de la seccion visible ──
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('#navLinks a[href^="#"]'))
    .filter(function (a) { return !a.classList.contains('nav-cta') && !a.closest('.partners-dropdown'); });
  var spySections = spyLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);
  if (spySections.length && 'IntersectionObserver' in window) {
    var visible = {};
    function setActive(id) {
      spyLinks.forEach(function (a) {
        a.classList.toggle('nav-active', a.getAttribute('href') === '#' + id);
      });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible[e.target.id] = true; else delete visible[e.target.id];
      });
      var current = null, minTop = Infinity;
      Object.keys(visible).forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        var top = el.getBoundingClientRect().top;
        if (top < minTop) { minTop = top; current = id; }
      });
      if (current) setActive(current); else setActive('');
    }, { rootMargin: '-42% 0px -53% 0px', threshold: 0 });
    spySections.forEach(function (el) { io.observe(el); });
  }
})();

// ── Onboarding coach-marks del boton "Empezar" (primera vez) ──
(function () {
  var COACH = {
    en: { s1: 'Step 1 · Describe', t1: 'Type your trip in plain words and the AI builds the full itinerary.', s2: 'Step 2 · Or pick a route', t2: 'Or tap a country and pick a ready-made route to book instantly.', ok: 'Got it' },
    es: { s1: 'Paso 1 · Describe', t1: 'Escribe tu viaje en lenguaje normal y la IA arma el itinerario completo.', s2: 'Paso 2 · O elige una ruta', t2: 'O toca un país y elige una ruta lista para reservar al instante.', ok: 'Entendido' },
    fr: { s1: 'Étape 1 · Décrivez', t1: "Décrivez votre voyage en langage courant et l'IA crée l'itinéraire complet.", s2: 'Étape 2 · Ou choisissez', t2: 'Ou touchez un pays et choisissez un trajet prêt à réserver.', ok: 'Compris' },
    de: { s1: 'Schritt 1 · Beschreiben', t1: 'Beschreibe deine Reise in normaler Sprache und die KI erstellt die komplette Route.', s2: 'Schritt 2 · Oder wählen', t2: 'Oder tippe auf ein Land und wähle eine fertige Route zum Buchen.', ok: 'Verstanden' },
    it: { s1: 'Passo 1 · Descrivi', t1: "Scrivi il tuo viaggio in parole semplici e l'IA crea l'itinerario completo.", s2: 'Passo 2 · O scegli', t2: 'Oppure tocca un paese e scegli un percorso pronto da prenotare.', ok: 'Ho capito' },
    pt: { s1: 'Passo 1 · Descreva', t1: 'Escreva sua viagem em linguagem simples e a IA monta o itinerário completo.', s2: 'Passo 2 · Ou escolha', t2: 'Ou toque num país e escolha uma rota pronta para reservar.', ok: 'Entendi' }
  };
  function dict() { return COACH[document.documentElement.lang] || COACH.en; }

  var active = [];
  function makeBubble(step, text, ok) {
    var b = document.createElement('div');
    b.className = 'wt-coach';
    var s = document.createElement('div'); s.className = 'wt-coach-step'; s.textContent = step;
    var t = document.createElement('div'); t.className = 'wt-coach-text'; t.textContent = text;
    var d = document.createElement('span'); d.className = 'wt-coach-dismiss'; d.textContent = ok;
    d.addEventListener('click', function (e) { e.stopPropagation(); clearCoach(); });
    b.appendChild(s); b.appendChild(t); b.appendChild(d);
    return b;
  }
  var pairs = [];
  function reposition() {
    pairs.forEach(function (p) {
      var r = p.target.getBoundingClientRect();
      p.bubble.style.top = (r.bottom + 14) + 'px';
      p.bubble.style.left = Math.round(r.left + r.width / 2) + 'px';
    });
  }
  function clearCoach() {
    active.forEach(function (el) { el.classList.remove('wt-coach-target'); });
    Array.prototype.slice.call(document.querySelectorAll('.wt-coach')).forEach(function (n) { n.remove(); });
    document.removeEventListener('keydown', onKey, true);
    document.removeEventListener('click', onOutside, true);
    window.removeEventListener('scroll', reposition, true);
    window.removeEventListener('resize', reposition);
    active = []; pairs = [];
  }
  function onKey(e) { if (e.key === 'Escape') clearCoach(); }
  function onOutside(e) { if (!e.target.closest('.wt-coach')) clearCoach(); }

  // Devuelve false la PRIMERA vez (muestra onboarding, no navega);
  // devuelve true después, dejando que el href="/explore/" navegue al hub de rutas.
  window.wtStartOnboarding = function () {
    if (localStorage.getItem('wt_onboarded') === '1') {
      return true; // ya vio el onboarding -> seguir el enlace a /explore/
    }
    localStorage.setItem('wt_onboarded', '1');

    var input = document.getElementById('aiInput');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(function () { if (input) try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }, 550);

    var d = dict();
    var inputC = document.querySelector('#aiInputWrapper .ai-input-container');
    var chips = document.getElementById('countries');
    setTimeout(function () {
      clearCoach();
      var pool = [];
      if (inputC) pool.push({ target: inputC, step: d.s1, text: d.t1 });
      if (chips) pool.push({ target: chips, step: d.s2, text: d.t2 });
      pool.forEach(function (item) {
        item.target.classList.add('wt-coach-target'); active.push(item.target);
        // El cartel va en capa body (position:fixed) para escapar de los contextos
        // de apilado anidados que antes tapaban el "Got it".
        var bubble = makeBubble(item.step, item.text, d.ok);
        bubble.style.position = 'fixed';
        bubble.style.zIndex = '95';
        document.body.appendChild(bubble);
        pairs.push({ bubble: bubble, target: item.target });
      });
      if (!pairs.length) return;
      reposition();
      window.addEventListener('scroll', reposition, true);
      window.addEventListener('resize', reposition);
      document.addEventListener('keydown', onKey, true);
      setTimeout(function () { document.addEventListener('click', onOutside, true); }, 50);
    }, 650);
    return false; // primera vez: no navegar, mostrar coach-marks
  };
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
    { display: 'Orient Express (Venecia→Estambul)',    slug: 'venice',          keywords: ['orient express','oriente express'] },
    // Pueblos y ciudades chicas — agregados para que el match de hoteles curados
    // (findCuratedHotel) funcione aunque la IA devuelva el nombre con acentos/variantes.
    { display: 'Marsella / Marseille',                  slug: 'marseille',       keywords: ['marseille','marsella'] },
    { display: 'Miramas',                               slug: 'miramas',         keywords: ['miramas'] },
    { display: 'Zweisimmen',                            slug: 'zweisimmen',      keywords: ['zweisimmen'] },
    { display: 'Spiez',                                 slug: 'spiez',           keywords: ['spiez'] },
    { display: 'Dortmund',                              slug: 'dortmund',        keywords: ['dortmund'] },
    { display: 'Oxford',                                slug: 'oxford',          keywords: ['oxford'] },
    { display: 'Sargans',                                slug: 'sargans',        keywords: ['sargans'] },
    { display: 'Tende',                                 slug: 'tende',           keywords: ['tende'] },
    { display: 'Lauterbrunnen',                         slug: 'lauterbrunnen',   keywords: ['lauterbrunnen'] },
    { display: 'Sorrento',                               slug: 'sorrento',       keywords: ['sorrento'] },
    { display: 'Positano',                               slug: 'positano',       keywords: ['positano'] },
    { display: 'Figueres',                               slug: 'figueres',       keywords: ['figueres','figueras'] },
    { display: 'Lourdes',                                slug: 'lourdes',        keywords: ['lourdes'] },
    { display: 'Jungfraujoch',                           slug: 'jungfraujoch',   keywords: ['jungfraujoch','top of europe'] }
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

    if (typeof fbq === 'function') { fbq('track', 'Lead', { content_name: 'ai_itinerary_generated' }); }
    if (typeof gtag === 'function') { gtag('event', 'generate_lead', { source: 'ai_planner' }); }

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
        const dict = (TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en);
        showAIPlannerError(dict.ai_high_demand || "We're experiencing high demand right now — please try again in a bit, or pick one of the popular routes above.");
      } else if (routeData.valido === false) {
        showAIPlannerError(routeData.mensajeError || 'Cuéntanos a dónde quieres viajar por Europa.');
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
    strasbourg: {
      name: 'Hotel Arok',
      loc: 'Strasbourg, France',
      stars: 3,
      photo: 'https://res.klook.com/klook-hotel/image/upload/fl_lossy.progressive,w_1200,h_630,c_fill,q_85/travelapi/26000000/25790000/25787600/25787598/b1df0245_z.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=strasbourg`,
    },
    stmoritz: {
      name: 'Hotel Laudinella',
      loc: 'St. Moritz, Switzerland',
      stars: 4,
      photo: 'https://i.travelapi.com/lodging/1000000/70000/69000/68976/62abfb11_z.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=stmoritz`,
    },
    ljubljana: {
      name: 'Grand Hotel Union',
      loc: 'Ljubljana, Slovenia',
      stars: 4,
      photo: 'https://media.booking-channel.com/api/hotels/2281/images/109.jpeg',
      url: `${PROXY_BASE}/klook-hotel?city=ljubljana`,
    },
    zweisimmen: {
      name: 'TOP Rinderberg Swiss Alpine Lodge',
      loc: 'Zweisimmen, Switzerland',
      stars: 4,
      photo: 'https://lucidcm.imgix.net/148247/Hotel/334/Image/yHbLWBaU02rR0ghsP0EDw_Exterior_view_1_TOP_Rinderberg_Swiss_Alpine_Lodge.jpg.jpg?h=1366&w=2048&fm=webp',
      url: `${PROXY_BASE}/klook-hotel?city=zweisimmen`,
    },
    spiez: {
      name: 'Belvédère Strandhotel',
      loc: 'Spiez, Switzerland',
      stars: 4,
      photo: 'https://cdn.prod.website-files.com/5f587732b83d08afd5efdc43/69a7177119c70216176e4376_67ed31a03599f61809ab9252_Hero_Intro_Belve%CC%81de%CC%80re.avif',
      url: `${PROXY_BASE}/klook-hotel?city=spiez`,
    },
    montreux: {
      name: 'Fairmont Le Montreux Palace',
      loc: 'Montreux, Switzerland',
      stars: 5,
      photo: 'https://m.ahstatic.com/is/image/accorhotels/acf_p_B015_22:8by10?fmt=jpg&op_usm=1.75,0.3,2,0&resMode=sharp2&iccEmbed=true&icc=sRGB&dpr=on,1.5&wid=943&hei=1178&qlt=80',
      url: `${PROXY_BASE}/klook-hotel?city=montreux`,
    },
    malaga: {
      name: 'Gran Hotel Miramar',
      loc: 'Malaga, Spain',
      stars: 5,
      photo: 'https://www.granhotelmiramarmalaga.com/wp-content/blogs.dir/1833/files/home/malaga-new.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=malaga`,
    },
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
    pisa: {
      name: 'Hotel Pisa Tower',
      loc: 'Pisa, Italy',
      stars: 3,
      photo: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/a5/fd/ae188e72b48d5360d4999fbd4b9070ec56590963d18a91196daca91fcb95.jpeg',
      url: `${PROXY_BASE}/klook-hotel?city=pisa`,
    },
    siena: {
      name: 'Grand Hotel Continental Siena',
      loc: 'Siena, Italy',
      stars: 5,
      photo: 'https://images.pexels.com/photos/38127108/pexels-photo-38127108.jpeg?auto=compress&cs=tinysrgb&w=1200',
      url: `${PROXY_BASE}/klook-hotel?city=siena`,
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
    marseille: {
      name: 'InterContinental Marseille – Hôtel Dieu',
      loc: 'Marseille, France',
      stars: 5,
      photo: 'https://marseille.intercontinental.com/wp-content/uploads/sites/5/2023/10/InterContinental-Marseille-Facade-c-Eric-Cuvillier-Perf.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=marseille`,
    },
    miramas: {
      name: 'ibis Styles Miramas - Provence',
      loc: 'Miramas, France',
      stars: 3,
      photo: 'https://www.ahstatic.com/photos/c0d8_ho_00_p_1024x768.jpg',
      url: `${PROXY_BASE}/klook-hotel?city=miramas`,
    },
  };
  // Resuelve un nombre de ciudad en cualquier idioma (ej. "Roma", "Florencia") a su
  // slug canónico en inglés (ej. "rome", "florence") usando _GLOSX_CITIES, para que
  // el match contra CURATED_HOTELS (claves siempre en inglés) funcione sin importar
  // en qué idioma haya devuelto la ciudad el planificador de IA.
  function resolveCitySlug(name) {
    const q = (name || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const cities = window._GLOSX_CITIES || [];
    for (let i = 0; i < cities.length; i++) {
      const c = cities[i];
      for (let j = 0; j < c.keywords.length; j++) {
        const kw = c.keywords[j].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        if (kw === q || kw.indexOf(q) === 0 || q.indexOf(kw) === 0) return c.slug;
      }
    }
    return null;
  }

  function findCuratedHotel(city) {
    const slug = resolveCitySlug(city);
    const key = (slug || city || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
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

  // Escapa comillas para insertar de forma segura dentro de un atributo onclick="gtag(...)"
  function escAttr(s) { return String(s).replace(/'/g, "\\'").replace(/"/g, '&quot;'); }

  // Hoteles por parada, inyectados directo en la pantalla de resultados
  // (antes vivian detras de un modal aparte — ahora es un paso menos para comprar).
  function renderHotelsInline(data) {
    const hotelsContainer = document.getElementById('aiHotels');
    if (!hotelsContainer) return;
    const dict = TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en;
    const tlItems = [];

    tlItems.push({ type: 'title', html: `<div class="trip-section-title" style="margin-top:0">${dict.ai_plan_hotels || 'Hotels per stop'}</div>` });
    getRouteStops(data).forEach(ciudadRaw => {
      const ciudad = cleanCityForKlook(ciudadRaw) || ciudadRaw;
      const curated = findCuratedHotel(ciudad);
      if (curated) {
        const budgetUrl = `${PROXY_BASE}/klook-hotel?city=${encodeURIComponent(ciudad)}`;
        const curatedTrack = `gtag('event','klook_click',{source:'ai_results_inline',type:'hotel_curated',city:'${escAttr(ciudad)}'});`;
        const budgetTrack = `gtag('event','klook_click',{source:'ai_results_inline',type:'hotel_budget',city:'${escAttr(ciudad)}'});`;
        tlItems.push({ type: 'hotel', html: `<a href="${curated.url}" target="_blank" rel="noopener noreferrer sponsored" class="trip-hotel-row has-photo" onclick="${curatedTrack}">
          <img class="trip-hotel-photo" src="${curated.photo}" alt="${curated.name}" loading="lazy" onerror="this.remove()" />
          <div class="trip-hotel-info">
            <span class="trip-hotel-name">${curated.name}</span>
            <span class="trip-hotel-stars">${'★'.repeat(curated.stars || 0)}</span>
            <span class="trip-hotel-loc">${curated.loc}</span>
          </div>
          <span class="trip-hotel-cta">${dict.ai_hotel_price || 'See current price →'}</span>
        </a>
        <a href="${budgetUrl}" target="_blank" rel="noopener noreferrer sponsored" class="trip-hotel-budget-alt" onclick="${budgetTrack}">${(dict.ai_hotel_budget_alt || 'See budget options in {city} →').replace('{city}', ciudad)}</a>
        <a href="#" onclick="goPartner('kiwitaxi',event)" class="trip-hotel-transfer-alt">${(dict.ai_kiwi_cta || 'Book a private transfer in')} ${ciudad} →</a>` });
        return;
      }
      const url = `${PROXY_BASE}/klook-hotel?city=${encodeURIComponent(ciudad)}`;
      const hotelTrack = `gtag('event','klook_click',{source:'ai_results_inline',type:'hotel',city:'${escAttr(ciudad)}'});`;
      tlItems.push({ type: 'hotel', html: `<a href="${url}" target="_blank" rel="noopener noreferrer sponsored" class="trip-hotel-row" onclick="${hotelTrack}">
        <span class="trip-hotel-city">${ciudad}</span>
        <span class="trip-hotel-cta">${dict.ai_hotel_link || 'Find hotels →'}</span>
      </a>` });
    });

    hotelsContainer.innerHTML = `<div class="trip-timeline">${tripTimelineWrap(tlItems)}</div>`;
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

  // A veces la IA mete el nombre de la estacion en el campo de ciudad (ej. "Viena
  // Hauptbahnhof" en vez de "Vienna") — eso rompe el lookup de ciudad de Klook del
  // lado del backend (klookNorm solo conoce nombres de ciudad limpios). Sacamos los
  // sufijos de estacion mas comunes en varios idiomas antes de armar el link.
  function cleanCityForKlook(name) {
    return (name || '')
      .replace(/\b(hauptbahnhof|hbf|bahnhof|central station|centraal station|central|station|gare(?:\s+du\s+nord|\s+de\s+lyon)?|estaci[oó]n(?:\s+de\s+\w+)?|stazione(?:\s+centrale)?|n[aá]dra[zž][ií]|f[oő]p[aá]lyaudvar|glavni\s+kolodvor)\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function trainClass(name) {
    const n = (name || '').toLowerCase();
    if (/ave|tgv|ice|eurostar|thalys|frecciarossa|italo|alvia|avlo|ouigo|high.?speed|alta.?vel/.test(n)) return 'train-high';
    if (/eurocity|ec\b|intercity.?international|international|nacht|night|sleeper|railjet/.test(n)) return 'train-intl';
    // "InterCity" domestico plano (ej. Avanti West Coast en UK) es un servicio rapido
    // principal, no un tren regional/de cercanias — antes caia mal a train-reg y
    // subestimaba mucho el precio (verificado contra Klook: Londres-Manchester real).
    if (/intercity/.test(n)) return 'train-high';
    return 'train-reg';
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

    // Cargar el video del CTA recién ahora (evita bajarlo en la carga inicial de la página)
    const ctaVideo = document.querySelector('.ai-cta-video-el');
    if (ctaVideo) {
      const ctaSource = ctaVideo.querySelector('source[data-src]');
      if (ctaSource) {
        ctaSource.src = ctaSource.getAttribute('data-src');
        ctaSource.removeAttribute('data-src');
        ctaVideo.load();
        ctaVideo.play().catch(() => {});
      }
    }

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

    // Mostrar paradas numeradas (derivadas de los tramos, no de paradas_principales)
    const routeStops = getRouteStops(data);
    const stopsContainer = document.getElementById('aiStops');
    stopsContainer.innerHTML = routeStops.map((stop, i) =>
      `<div class="ai-stop"><span class="ai-stop-num">${(TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en).ai_stop_label || 'STOP'} ${i + 1}</span>${stop}</div>`
    ).join('');

    // Aviso de reserva por tramo cuando el viaje tiene mas de un tramo (Klook no soporta reserva multi-tramo)
    const multiLegNote = document.getElementById('aiMultiLegNote');
    if (data.tramos.length > 1) {
      const multiLegTpl = (TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en).ai_multileg_note || 'This trip has {n} legs — book each one separately.';
      multiLegNote.textContent = multiLegTpl.replace('{n}', data.tramos.length);
      multiLegNote.style.display = 'block';
    } else {
      multiLegNote.style.display = 'none';
    }

    // Hoteles con foto por parada, directo en la pantalla (sin modal aparte)
    renderHotelsInline(data);

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
      const kiwiHTML = '';
      // Compra directa del tramo, sin pasar por el modal (misma logica que usa "Mi plan de viaje")
      const segNoTrain = /ferry|autob[uú]s|bus|no aplica|no hay estaci[oó]n/i.test(
        [operador, segment.tipo_tren_sugerido, segment.estacion_salida, segment.estacion_llegada, segment.origen, segment.destino].join(' ')
      );
      const segTicketUrl = segNoTrain
        ? `https://www.google.com/maps/dir/${encodeURIComponent(segment.origen)}/${encodeURIComponent(segment.destino)}`
        : window.glosxBookTarget(cleanCityForKlook(segment.origen) || segment.origen, cleanCityForKlook(segment.destino) || segment.destino);
      const segBtnLabel = segNoTrain
        ? ((TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en).ai_view_options || 'View options →')
        : ((TRANSLATIONS[document.documentElement.lang] || TRANSLATIONS.en).ai_buy_ticket || 'Buy ticket →');
      const segTrack = `gtag('event','klook_click',{source:'ai_segment_card',type:'${segNoTrain ? 'transit_alt' : 'train'}',route:'${escAttr(segment.origen)}-${escAttr(segment.destino)}'});`;
      const isMultiLeg = data.tramos.length > 1 && !segNoTrain;
      const legOnclick = isMultiLeg
        ? `${segTrack} mostrarModalTramo(${index}, '${escAttr(segment.origen)}', '${escAttr(segment.destino)}')`
        : segTrack;
      const buyHTML = `<a href="${segTicketUrl}" target="_blank" rel="noopener noreferrer" class="ai-segment-buy" onclick="${legOnclick}">${segBtnLabel}</a>`;
      setTimeout(() => {
        const segmentHTML = `
          <div class="ai-segment" id="ai-segment-${index}" style="animation: aiFadeIn 0.5s ease">
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
            <span class="ai-segment-check">✓</span>
            ${buyHTML}
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
        const parsed = JSON.parse(data);
        // Defensa contra respuestas viejas guardadas antes del fix del backend
        // que validaba tramos (ver glosx-backend/server.js isValidRouteData) —
        // sin esto, un dispositivo con una ruta rota guardada localmente la
        // sigue mostrando para siempre, sin boton de compra, aunque el server
        // ya este arreglado.
        if (!Array.isArray(parsed.tramos) || !parsed.tramos.length) {
          localStorage.removeItem('ai_last_route_data');
          localStorage.removeItem('ai_last_route_input');
          localStorage.removeItem('ai_last_route_timestamp');
          const restoreBtn = document.getElementById('aiRestoreBtn');
          if (restoreBtn) restoreBtn.style.display = 'none';
          return;
        }
        displayAIRoute(parsed);
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
