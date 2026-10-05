#!/usr/bin/env node
/**
 * Artículo de blog "Cómo viajar por Japón en tren" en EN/ES/FR/IT.
 * Usa como molde (cabecera, estilos, nav, pie) el artículo blog-tren-arraigo-pueblos.html de cada idioma.
 * Tiempos de trayecto: Klook (consulta 05-oct-2026). Sin precios.
 * Uso: node scripts/generate-blog-japan.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SLUG = 'blog-japan-train-guide.html';
const SHELL = 'blog-tren-arraigo-pueblos.html';
const LANGS = ['en', 'es', 'fr', 'it'];
const PREFIX = { en: '', es: 'es/', fr: 'fr/', it: 'it/' };
const LANG_NAMES = { en: 'English', es: 'Español', fr: 'Français', it: 'Italiano' };
const PHOTO = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const HERO = 15275312;
const GRID = [23345454, 1673978, 21821256];
const DATE = '2026-10-05';
const BOOK = 'https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=tokyo&to=kyoto';
const REL = [['tokyo-kyoto', 'Tokyo', 'Kyoto'], ['tokyo-osaka', 'Tokyo', 'Osaka'], ['osaka-kyoto', 'Osaka', 'Kyoto'], ['kyoto-hiroshima', 'Kyoto', 'Hiroshima'], ['narita-tokyo', 'Narita Airport', 'Tokyo']];
const RELNAMES = {
  es: { Tokyo: 'Tokio', Kyoto: 'Kioto', 'Narita Airport': 'Aeropuerto de Narita' },
  fr: {}, it: { 'Narita Airport': 'Aeroporto di Narita' }, en: {}
};

const C = {
  en: {
    title: 'How to Travel Japan by Train: A First-Timer\'s Guide to the Shinkansen',
    desc: 'Nozomi, Hikari or Kodama? Real journey times between Tokyo, Kyoto, Osaka and Hiroshima, the Japan Rail Pass question, luggage rules and a 10-day route by train.',
    kw: 'Japan by train, Shinkansen guide, Nozomi Hikari Kodama, Japan Rail Pass, Tokyo Kyoto train, Japan train itinerary',
    tag: 'Japan', meta: 'By WoW Train · October 2026 · 7 min read', back: 'All articles', bc: ['Home', 'Blog'],
    alt: ['Inside a Shinkansen bullet train.', 'Kiyomizu-dera temple in Kyoto.', 'Osaka Castle.'],
    lead: 'Japan has one of the best rail networks in the world, and for a first trip it is also the easiest way to get around. This guide explains the trains you will actually meet, how long the main journeys take, and how to plan a route without wasting days in stations.',
    blocks: [
      ['h2', 'The trains you need to know'],
      ['p', 'The Shinkansen is the high-speed network that connects the big cities. On the main line between Tokyo and Osaka there are three types of train, and the difference matters:'],
      ['ul', ['<strong>Nozomi:</strong> the fastest, with the fewest stops. It is the one most travellers take.', '<strong>Hikari:</strong> slightly slower, with a few more stops.', '<strong>Kodama:</strong> stops at every station. Useful only for small towns along the line.']],
      ['p', 'Away from the Shinkansen, limited express trains cover the regional lines. Two worth knowing: the Narita Express from the airport to central Tokyo, and the Hida from Nagoya to Takayama in the Japanese Alps.'],
      ['h2', 'How long the main journeys take'],
      ['p', 'These are the shortest journey times we found for each route, on the fastest direct train:'],
      ['ul', ['Tokyo – Kyoto: 2h07', 'Tokyo – Osaka: 2h21', 'Osaka – Kyoto: 13 minutes (from Shin-Osaka)', 'Osaka – Hiroshima: 1h20', 'Kyoto – Hiroshima: 1h36', 'Tokyo – Hiroshima: 3h47', 'Tokyo – Fukuoka: 4h52', 'Tokyo – Kanazawa: 2h24', 'Tokyo – Sendai: 1h30', 'Narita Airport – Tokyo Station: 53 minutes']],
      ['p', 'Times change with the day and the train, so check the live schedule for your date when you book.'],
      ['h2', 'The Japan Rail Pass: do the sums first'],
      ['p', 'The pass covers most Shinkansen, such as the Hikari, the Kodama and the Sakura, but not the Nozomi or the Mizuho, the fastest services. The price of the pass has changed in recent years, so do not assume it pays for itself: add up the individual tickets on your own route and compare. On a trip that stays between Tokyo, Kyoto and Osaka, single tickets are often the better deal.'],
      ['h2', 'Reserved seats, luggage and the Fuji seat'],
      ['ul', ['Reserved seats are the safe choice in busy periods such as Golden Week, the summer holidays and the cherry blossom season.', 'Suitcases with a total size between 160 and 250 cm need a reserved seat with oversized baggage space.', 'Going from Tokyo to Kyoto or Osaka, a window seat on the right-hand side (seat E) gives you a chance to see Mount Fuji, weather permitting.', 'In Osaka, the Shinkansen stops at Shin-Osaka, not at Osaka Station. One stop on the JR Kyoto Line connects the two.']],
      ['h2', 'A 10-day route by train'],
      ['ul', ['Days 1 to 4: Tokyo. Arrive by the Narita Express (53 minutes to Tokyo Station).', 'Days 5 to 7: Kyoto, 2h07 from Tokyo on the Nozomi.', 'Day 8: Osaka, only 13 minutes from Kyoto by Shinkansen.', 'Day 9: Hiroshima and Miyajima, 1h20 from Osaka.', 'Day 10: back to Tokyo, 3h47 by Shinkansen.']],
      ['cta', 'Tokyo → Kyoto', 'Nozomi Shinkansen · about 2h07 · live schedule on Klook'],
      ['h2', 'Where to start'],
      ['p', 'Pick your two or three main cities, check the real journey time between them and book the long legs first. With <strong>WoW Train</strong> you can look up the time and the train type for almost 200 pairs of Japanese cities in a few seconds.']
    ],
    ctaTitle: 'Your train. Your world.', ctaText: 'Choose Japan and look up any pair of cities: real duration, train type and booking.', ctaBtn: 'Try Japan mode →',
    book: 'Check times and book on Klook', relTitle: 'Related route guides', relMore: 'More train routes in Japan →'
  },
  es: {
    title: 'Cómo viajar por Japón en tren: guía del Shinkansen para tu primer viaje',
    desc: '¿Nozomi, Hikari o Kodama? Tiempos reales entre Tokio, Kioto, Osaka y Hiroshima, el Japan Rail Pass, reglas de equipaje y una ruta de 10 días en tren.',
    kw: 'Japón en tren, guía Shinkansen, Nozomi Hikari Kodama, Japan Rail Pass, tren Tokio Kioto, itinerario Japón en tren',
    tag: 'Japón', meta: 'Por WoW Train · Octubre 2026 · 7 min de lectura', back: 'Todos los artículos', bc: ['Inicio', 'Blog'],
    alt: ['Interior de un tren bala Shinkansen.', 'El templo Kiyomizu-dera en Kioto.', 'El castillo de Osaka.'],
    lead: 'Japón tiene una de las mejores redes ferroviarias del mundo y, en un primer viaje, también es la forma más fácil de moverse. Esta guía explica los trenes que de verdad vas a encontrar, cuánto tardan los trayectos principales y cómo armar una ruta sin perder días en estaciones.',
    blocks: [
      ['h2', 'Los trenes que debes conocer'],
      ['p', 'El Shinkansen es la red de alta velocidad que une las grandes ciudades. En la línea principal entre Tokio y Osaka hay tres tipos de tren, y la diferencia importa:'],
      ['ul', ['<strong>Nozomi:</strong> el más rápido, con menos paradas. Es el que toma la mayoría de los viajeros.', '<strong>Hikari:</strong> algo más lento, con unas paradas más.', '<strong>Kodama:</strong> para en todas las estaciones. Solo sirve para pueblos pequeños de la línea.']],
      ['p', 'Fuera del Shinkansen, los expresos limitados cubren las líneas regionales. Dos que conviene conocer: el Narita Express, del aeropuerto al centro de Tokio, y el Hida, de Nagoya a Takayama, en los Alpes japoneses.'],
      ['h2', 'Cuánto tardan los trayectos principales'],
      ['p', 'Estos son los tiempos más cortos que encontramos para cada ruta, en el tren directo más rápido:'],
      ['ul', ['Tokio – Kioto: 2 h 07', 'Tokio – Osaka: 2 h 21', 'Osaka – Kioto: 13 minutos (desde Shin-Osaka)', 'Osaka – Hiroshima: 1 h 20', 'Kioto – Hiroshima: 1 h 36', 'Tokio – Hiroshima: 3 h 47', 'Tokio – Fukuoka: 4 h 52', 'Tokio – Kanazawa: 2 h 24', 'Tokio – Sendai: 1 h 30', 'Aeropuerto de Narita – estación de Tokio: 53 minutos']],
      ['p', 'Los tiempos cambian según el día y el tren, así que consulta el horario en vivo para tu fecha al reservar.'],
      ['h2', 'El Japan Rail Pass: haz las cuentas antes'],
      ['p', 'El pase cubre la mayoría de los Shinkansen, como el Hikari, el Kodama y el Sakura, pero no el Nozomi ni el Mizuho, que son los servicios más rápidos. El precio del pase ha cambiado en los últimos años, así que no des por hecho que se amortiza: suma los billetes sueltos de tu ruta y compara. En un viaje que se queda entre Tokio, Kioto y Osaka, los billetes individuales suelen salir mejor.'],
      ['h2', 'Asientos reservados, equipaje y el asiento del Fuji'],
      ['ul', ['El asiento reservado es la opción segura en épocas de mucha demanda, como la Golden Week, las vacaciones de verano y la temporada de los cerezos en flor.', 'Las maletas de entre 160 y 250 cm de tamaño total necesitan un asiento reservado con espacio para equipaje voluminoso.', 'De Tokio a Kioto o a Osaka, un asiento de ventanilla del lado derecho (asiento E) te da opciones de ver el monte Fuji, si el tiempo lo permite.', 'En Osaka, el Shinkansen para en Shin-Osaka, no en la estación de Osaka. Una parada de la línea JR Kioto une las dos.']],
      ['h2', 'Una ruta de 10 días en tren'],
      ['ul', ['Días 1 a 4: Tokio. Llega en el Narita Express (53 minutos hasta la estación de Tokio).', 'Días 5 a 7: Kioto, a 2 h 07 de Tokio en el Nozomi.', 'Día 8: Osaka, a solo 13 minutos de Kioto en Shinkansen.', 'Día 9: Hiroshima y Miyajima, a 1 h 20 de Osaka.', 'Día 10: de vuelta a Tokio, 3 h 47 en Shinkansen.']],
      ['cta', 'Tokio → Kioto', 'Shinkansen Nozomi · unas 2 h 07 · horario en vivo en Klook'],
      ['h2', 'Por dónde empezar'],
      ['p', 'Elige tus dos o tres ciudades principales, comprueba el tiempo real entre ellas y reserva primero los tramos largos. Con <strong>WoW Train</strong> puedes consultar en segundos el tiempo y el tipo de tren de casi 200 pares de ciudades japonesas.']
    ],
    ctaTitle: 'Tu tren. Tu mundo.', ctaText: 'Elige Japón y consulta cualquier par de ciudades: duración real, tipo de tren y reserva.', ctaBtn: 'Probar el modo Japón →',
    book: 'Consulta horarios y reserva en Klook', relTitle: 'Guías de rutas relacionadas', relMore: 'Más rutas en tren por Japón →'
  },
  fr: {
    title: 'Voyager au Japon en train : guide du Shinkansen pour un premier séjour',
    desc: 'Nozomi, Hikari ou Kodama ? Durées réelles entre Tokyo, Kyoto, Osaka et Hiroshima, la question du Japan Rail Pass, règles pour les bagages et un itinéraire de 10 jours en train.',
    kw: 'Japon en train, guide Shinkansen, Nozomi Hikari Kodama, Japan Rail Pass, train Tokyo Kyoto, itinéraire Japon en train',
    tag: 'Japon', meta: 'Par WoW Train · Octobre 2026 · 7 min de lecture', back: 'Tous les articles', bc: ['Accueil', 'Blog'],
    alt: ['Intérieur d\'un train à grande vitesse Shinkansen.', 'Le temple Kiyomizu-dera à Kyoto.', 'Le château d\'Osaka.'],
    lead: 'Le Japon possède l\'un des meilleurs réseaux ferroviaires du monde et, pour un premier voyage, c\'est aussi le moyen le plus simple de se déplacer. Ce guide explique les trains que vous allez vraiment croiser, la durée des principaux trajets et comment bâtir un itinéraire sans perdre de journées en gare.',
    blocks: [
      ['h2', 'Les trains à connaître'],
      ['p', 'Le Shinkansen est le réseau à grande vitesse qui relie les grandes villes. Sur la ligne principale entre Tokyo et Osaka, il existe trois types de train, et la différence compte :'],
      ['ul', ['<strong>Nozomi :</strong> le plus rapide, avec le moins d\'arrêts. C\'est celui que prend la plupart des voyageurs.', '<strong>Hikari :</strong> un peu plus lent, avec quelques arrêts de plus.', '<strong>Kodama :</strong> s\'arrête dans toutes les gares. Utile seulement pour les petites villes de la ligne.']],
      ['p', 'En dehors du Shinkansen, des express limités desservent les lignes régionales. Deux à connaître : le Narita Express, de l\'aéroport au centre de Tokyo, et le Hida, de Nagoya à Takayama, dans les Alpes japonaises.'],
      ['h2', 'Durée des principaux trajets'],
      ['p', 'Voici les durées les plus courtes trouvées pour chaque liaison, sur le train direct le plus rapide :'],
      ['ul', ['Tokyo – Kyoto : 2 h 07', 'Tokyo – Osaka : 2 h 21', 'Osaka – Kyoto : 13 minutes (depuis Shin-Osaka)', 'Osaka – Hiroshima : 1 h 20', 'Kyoto – Hiroshima : 1 h 36', 'Tokyo – Hiroshima : 3 h 47', 'Tokyo – Fukuoka : 4 h 52', 'Tokyo – Kanazawa : 2 h 24', 'Tokyo – Sendai : 1 h 30', 'Aéroport de Narita – gare de Tokyo : 53 minutes']],
      ['p', 'Les horaires varient selon le jour et le train : consultez l\'horaire en direct pour votre date au moment de réserver.'],
      ['h2', 'Le Japan Rail Pass : faites le calcul d\'abord'],
      ['p', 'Le pass couvre la plupart des Shinkansen, comme le Hikari, le Kodama et le Sakura, mais pas le Nozomi ni le Mizuho, les services les plus rapides. Son prix a évolué ces dernières années : ne partez pas du principe qu\'il est rentable. Additionnez les billets à l\'unité de votre itinéraire et comparez. Pour un séjour entre Tokyo, Kyoto et Osaka, les billets individuels sont souvent plus avantageux.'],
      ['h2', 'Places réservées, bagages et la place du Fuji'],
      ['ul', ['La place réservée est le choix prudent en période de forte affluence : Golden Week, vacances d\'été et saison des cerisiers en fleurs.', 'Les valises dont la somme des dimensions est comprise entre 160 et 250 cm exigent une place réservée avec espace pour bagage volumineux.', 'De Tokyo vers Kyoto ou Osaka, une place côté fenêtre à droite (siège E) vous donne une chance d\'apercevoir le mont Fuji, si la météo le permet.', 'À Osaka, le Shinkansen s\'arrête à Shin-Osaka, pas à la gare d\'Osaka. Un arrêt sur la ligne JR Kyoto relie les deux.']],
      ['h2', 'Un itinéraire de 10 jours en train'],
      ['ul', ['Jours 1 à 4 : Tokyo. Arrivée par le Narita Express (53 minutes jusqu\'à Tokyo Station).', 'Jours 5 à 7 : Kyoto, à 2 h 07 de Tokyo en Nozomi.', 'Jour 8 : Osaka, à 13 minutes seulement de Kyoto en Shinkansen.', 'Jour 9 : Hiroshima et Miyajima, à 1 h 20 d\'Osaka.', 'Jour 10 : retour à Tokyo, 3 h 47 en Shinkansen.']],
      ['cta', 'Tokyo → Kyoto', 'Shinkansen Nozomi · environ 2 h 07 · horaires en direct sur Klook'],
      ['h2', 'Par où commencer'],
      ['p', 'Choisissez vos deux ou trois villes principales, vérifiez la durée réelle entre elles et réservez d\'abord les longs trajets. Avec <strong>WoW Train</strong>, vous consultez en quelques secondes la durée et le type de train de près de 200 paires de villes japonaises.']
    ],
    ctaTitle: 'Votre train. Votre monde.', ctaText: 'Choisissez le Japon et consultez n\'importe quelle paire de villes : durée réelle, type de train et réservation.', ctaBtn: 'Essayer le mode Japon →',
    book: 'Consultez les horaires et réservez sur Klook', relTitle: 'Guides d\'itinéraires associés', relMore: 'Plus d\'itinéraires de train au Japon →'
  },
  it: {
    title: 'Come viaggiare in Giappone in treno: guida allo Shinkansen per il primo viaggio',
    desc: 'Nozomi, Hikari o Kodama? Tempi reali tra Tokyo, Kyoto, Osaka e Hiroshima, il Japan Rail Pass, regole sui bagagli e un itinerario di 10 giorni in treno.',
    kw: 'Giappone in treno, guida Shinkansen, Nozomi Hikari Kodama, Japan Rail Pass, treno Tokyo Kyoto, itinerario Giappone in treno',
    tag: 'Giappone', meta: 'Di WoW Train · Ottobre 2026 · 7 min di lettura', back: 'Tutti gli articoli', bc: ['Home', 'Blog'],
    alt: ['L\'interno di un treno ad alta velocità Shinkansen.', 'Il tempio Kiyomizu-dera a Kyoto.', 'Il castello di Osaka.'],
    lead: 'Il Giappone ha una delle migliori reti ferroviarie del mondo e, per un primo viaggio, è anche il modo più facile di spostarsi. Questa guida spiega i treni che incontrerai davvero, quanto durano i tragitti principali e come costruire un itinerario senza perdere giornate in stazione.',
    blocks: [
      ['h2', 'I treni da conoscere'],
      ['p', 'Lo Shinkansen è la rete ad alta velocità che collega le grandi città. Sulla linea principale tra Tokyo e Osaka ci sono tre tipi di treno, e la differenza conta:'],
      ['ul', ['<strong>Nozomi:</strong> il più veloce, con meno fermate. È quello scelto dalla maggior parte dei viaggiatori.', '<strong>Hikari:</strong> un po\' più lento, con qualche fermata in più.', '<strong>Kodama:</strong> ferma in tutte le stazioni. Serve solo per le cittadine lungo la linea.']],
      ['p', 'Fuori dallo Shinkansen, gli espressi limitati coprono le linee regionali. Due da conoscere: il Narita Express, dall\'aeroporto al centro di Tokyo, e l\'Hida, da Nagoya a Takayama, nelle Alpi giapponesi.'],
      ['h2', 'Quanto durano i tragitti principali'],
      ['p', 'Questi sono i tempi più brevi trovati per ogni tratta, sul treno diretto più veloce:'],
      ['ul', ['Tokyo – Kyoto: 2h07', 'Tokyo – Osaka: 2h21', 'Osaka – Kyoto: 13 minuti (da Shin-Osaka)', 'Osaka – Hiroshima: 1h20', 'Kyoto – Hiroshima: 1h36', 'Tokyo – Hiroshima: 3h47', 'Tokyo – Fukuoka: 4h52', 'Tokyo – Kanazawa: 2h24', 'Tokyo – Sendai: 1h30', 'Aeroporto di Narita – stazione di Tokyo: 53 minuti']],
      ['p', 'I tempi cambiano secondo il giorno e il treno: controlla l\'orario in tempo reale per la tua data al momento di prenotare.'],
      ['h2', 'Il Japan Rail Pass: fai prima i conti'],
      ['p', 'Il pass copre la maggior parte degli Shinkansen, come l\'Hikari, il Kodama e il Sakura, ma non il Nozomi né il Mizuho, i servizi più veloci. Il prezzo del pass è cambiato negli ultimi anni, quindi non dare per scontato che convenga: somma i biglietti singoli del tuo itinerario e confronta. In un viaggio tra Tokyo, Kyoto e Osaka, i biglietti singoli spesso convengono di più.'],
      ['h2', 'Posti prenotati, bagagli e il posto del Fuji'],
      ['ul', ['Il posto prenotato è la scelta sicura nei periodi di grande affluenza, come la Golden Week, le vacanze estive e la stagione dei ciliegi in fiore.', 'I bagagli con dimensioni totali tra 160 e 250 cm richiedono un posto prenotato con spazio per bagagli voluminosi.', 'Da Tokyo verso Kyoto o Osaka, un posto finestrino sul lato destro (posto E) ti dà la possibilità di vedere il monte Fuji, se il tempo lo permette.', 'A Osaka, lo Shinkansen ferma a Shin-Osaka, non alla stazione di Osaka. Una fermata sulla linea JR Kyoto collega le due.']],
      ['h2', 'Un itinerario di 10 giorni in treno'],
      ['ul', ['Giorni 1-4: Tokyo. Arrivo con il Narita Express (53 minuti fino a Tokyo Station).', 'Giorni 5-7: Kyoto, a 2h07 da Tokyo con il Nozomi.', 'Giorno 8: Osaka, a soli 13 minuti da Kyoto in Shinkansen.', 'Giorno 9: Hiroshima e Miyajima, a 1h20 da Osaka.', 'Giorno 10: ritorno a Tokyo, 3h47 in Shinkansen.']],
      ['cta', 'Tokyo → Kyoto', 'Shinkansen Nozomi · circa 2h07 · orari in tempo reale su Klook'],
      ['h2', 'Da dove cominciare'],
      ['p', 'Scegli le tue due o tre città principali, controlla il tempo reale tra di esse e prenota prima le tratte lunghe. Con <strong>WoW Train</strong> puoi consultare in pochi secondi durata e tipo di treno di quasi 200 coppie di città giapponesi.']
    ],
    ctaTitle: 'Il tuo treno. Il tuo mondo.', ctaText: 'Scegli il Giappone e consulta qualsiasi coppia di città: durata reale, tipo di treno e prenotazione.', ctaBtn: 'Prova la modalità Giappone →',
    book: 'Controlla gli orari e prenota su Klook', relTitle: 'Guide ai percorsi correlati', relMore: 'Altri percorsi in treno in Giappone →'
  }
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const urlOf = l => `https://glosx.app/${PREFIX[l]}${SLUG}`;

function langSwitch(cur) {
  const opts = LANGS.map(l => `<a class="lang-option${l === cur ? ' active' : ''}" href="/${PREFIX[l]}${SLUG}">${LANG_NAMES[l]}</a>`).join('');
  return `<div class="lang-wrapper"><button type="button" class="lang-btn" aria-label="Language" onclick="event.stopPropagation();this.nextElementSibling.classList.toggle('open');"><span>${cur.toUpperCase()}</span><span style="font-size:10px;opacity:0.6">▾</span></button><div class="lang-dropdown">${opts}</div></div>`;
}

function body(l) {
  const c = C[l];
  const blocks = c.blocks.map(b => {
    if (b[0] === 'h2') return `    <h2>${b[1]}</h2>`;
    if (b[0] === 'p') return `    <p>\n      ${b[1]}\n    </p>`;
    if (b[0] === 'ul') return `    <ul>\n${b[1].map(x => `      <li>${x}</li>`).join('\n')}\n    </ul>`;
    if (b[0] === 'cta') return `    <a href="${BOOK}" class="klook-cta" target="_blank" rel="noopener sponsored" onclick="gtag('event','klook_click',{source:'blog_japan_${l}',route:'tokyo-kyoto'});">
      <img class="klook-logo" src="https://www.google.com/s2/favicons?sz=64&domain=klook.com" alt="Klook" loading="lazy" style="width:36px;height:36px;border-radius:8px;flex-shrink:0;">
      <span class="klook-cta-text">
        <span class="klook-cta-title">${b[1]} · ${c.book}</span>
        <span class="klook-cta-sub">${b[2]}</span>
      </span>
      <span class="klook-cta-arrow">→</span>
    </a>`;
  }).join('\n\n');
  const rel = REL.map(([s, a, b]) => {
    const n = RELNAMES[l];
    return `      <li><a href="/rutas/${s}/${l === 'en' ? '' : l + '/'}">${n[a] || a} → ${n[b] || b}</a></li>`;
  }).join('\n');
  const pre = l === 'en' ? '' : `/${l}`;
  return `<body>
  <nav>
    ${require('./apply-logo').MARKUP('/')}
    <div class="nav-right">
      ${langSwitch(l)}
      <a href="${pre}/blog.html" class="nav-back">← ${c.back}</a>
    </div>
  </nav>

  <div class="blog-hero" style="background-image:url('${PHOTO(HERO, 1400)}')">
    <div class="hero-content">
      <span class="badge">${c.tag}</span>
      <h1>${c.title}</h1>
      <p class="meta">${c.meta}</p>
    </div>
  </div>

  <main>
    <p class="lead">
      ${c.lead}
    </p>

    <div class="photo-grid">
${GRID.map((id, i) => `      <img src="${PHOTO(id, 500)}" alt="${esc(c.alt[i])}" loading="lazy" />`).join('\n')}
    </div>

${blocks}

    <hr/>

    <div class="cta">
      <h3>${c.ctaTitle}</h3>
      <p>${c.ctaText}</p>
      <a href="${pre}/#japan" class="cta-btn">${c.ctaBtn}</a>
    </div>
  </main>

    <section class="related-routes" aria-label="${esc(c.relTitle)}">
      <h2>${c.relTitle}</h2>
      <ul>
${rel}
      </ul>
      <p><a href="/rutas/">${c.relMore}</a></p>
    </section>

  `;
}

function build(l) {
  const c = C[l];
  const shell = fs.readFileSync(path.join(ROOT, PREFIX[l], SHELL), 'utf8');
  const lines = shell.split('\n');
  const li = n => lines.findIndex(x => x.includes(n));
  // cabecera: línea 1..5 (doctype, html, head, charset, viewport) + metas propias + resto (analítica, estilos) sin los JSON-LD del molde
  const headTop = lines.slice(0, 5).join('\n');
  const afterMeta = lines.slice(li('<link rel="icon"'), li('<body>')).join('\n')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.bc[0], item: `https://glosx.app/${PREFIX[l]}` },
      { '@type': 'ListItem', position: 2, name: c.bc[1], item: `https://glosx.app/${PREFIX[l]}blog.html` },
      { '@type': 'ListItem', position: 3, name: c.title, item: urlOf(l) }] },
    { '@context': 'https://schema.org', '@type': 'Article', headline: c.title, description: c.desc, image: PHOTO(HERO, 1400),
      author: { '@type': 'Organization', name: 'WoW Train' }, publisher: { '@type': 'Organization', name: 'GLOSX', alternateName: 'WoW Train' },
      datePublished: DATE, dateModified: DATE, inLanguage: l, mainEntityOfPage: urlOf(l) }
  ].map(o => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  const metas = `  <title>${esc(c.title)} — WoW Train</title>
  <meta name="description" content="${esc(c.desc)}" />
  <meta name="keywords" content="${esc(c.kw)}" />
  <link rel="canonical" href="${urlOf(l)}" />
${LANGS.map(x => `  <link rel="alternate" hreflang="${x}" href="${urlOf(x)}" />`).join('\n')}
  <link rel="alternate" hreflang="x-default" href="${urlOf('en')}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(c.title)}" />
  <meta property="og:description" content="${esc(c.desc)}" />
  <meta property="og:url" content="${urlOf(l)}" />
  <meta property="og:image" content="${PHOTO(HERO, 1400)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(c.title)}" />
  <meta name="twitter:description" content="${esc(c.desc)}" />
  <meta name="twitter:image" content="${PHOTO(HERO, 1400)}" />
${ld}
`;
  const footer = shell.slice(shell.indexOf('<footer>'));
  const out = headTop + '\n' + metas + '\n  ' + afterMeta.trim() + '\n' + body(l) + footer;
  fs.writeFileSync(path.join(ROOT, PREFIX[l], SLUG), out);
  console.log('Generado', PREFIX[l] + SLUG);
}

LANGS.forEach(build);
