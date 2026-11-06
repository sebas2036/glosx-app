#!/usr/bin/env node
/**
 * Tres artículos de blog que recomiendan blogs de viaje reales (Europa en tren, Japón en tren, hoteles), EN/ES/FR/IT/JA.
 * Cada blog se verificó el 06-nov-2026: sitio activo y el artículo citado responde 200. Solo se describe lo que se ve en
 * su propio sitio (tema y artículo enlazado); nada inventado. Al final, la invitación a llevarse la ficha de horarios
 * ("Lleva esta ruta a tu blog", assets/js/route-embed.js) desde cualquier página de ruta. Nunca se pide un enlace.
 * Molde: blog-tren-arraigo-pueblos.html de cada idioma (como generate-blog-ahorro-varios-paises.js).
 * Uso: node scripts/generate-blog-blogueros.js   (después: tarjetas al principio de cada blog.html, blog-grid.py, sitemap, Indexing)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SHELL = 'blog-tren-arraigo-pueblos.html';
const LANGS = ['en', 'es', 'fr', 'it', 'ja'];
const PREFIX = { en: '', es: 'es/', fr: 'fr/', it: 'it/', ja: 'ja/' };
const LANG_NAMES = { en: 'English', es: 'Español', fr: 'Français', it: 'Italiano', ja: '日本語' };
const PHOTO = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const DATE = '2026-11-06';
const ext = (href, txt) => `<a href="${href}" target="_blank" rel="noopener">${txt}</a>`;
const route = (l, slug, txt) => `<a href="/rutas/${slug}/${l === 'en' ? '' : l + '/'}">${txt}</a>`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// Blogs: [nombre, sitio, artículo, título del artículo]
const B = {
  europe: [
    ['The Savvy Backpacker', 'https://thesavvybackpacker.com/', 'https://thesavvybackpacker.com/complete-guide-to-train-travel-in-europe/', 'Complete guide to train travel in Europe'],
    ['Show Me The Journey', 'https://showmethejourney.com/', 'https://showmethejourney.com/train-travel-info/', 'Train travel info'],
    ['Rail Stories', 'https://railstories.eu/en/', 'https://railstories.eu/en/', 'Rail Stories'],
    ['Along Dusty Roads', 'https://www.alongdustyroads.com/', 'https://www.alongdustyroads.com/posts/how-to-get-from-lisbon-to-sintra-train', 'How to get from Lisbon to Sintra by train'],
    ['Wanderlustingk', 'https://www.wanderlustingk.com/', 'https://www.wanderlustingk.com/travel-blog/category/travel/europe', 'Europe travel guides']
  ],
  japan: [
    ['Japan Cheapo', 'https://japancheapo.com/', 'https://japancheapo.com/shinkansen-fare-finder-2/', 'Shinkansen fare finder'],
    ['Inside Kyoto', 'https://www.insidekyoto.com/', 'https://www.insidekyoto.com/how-to-buy-shinkansen-bullet-train-tickets', 'How to buy Shinkansen tickets'],
    ['Truly Tokyo', 'https://trulytokyo.com/', 'https://trulytokyo.com/navigating-japans-trains-subways-and-stations/', "Navigating Japan's trains, subways and stations"],
    ['Boutique Japan', 'https://boutiquejapan.com/', 'https://boutiquejapan.com/train-travel-in-japan/', 'Train travel in Japan'],
    ['Deep Japan', 'https://deepjapan.org/', 'https://deepjapan.org/how-tokyo-trains-inspired-a-project-back-home/', 'How Tokyo trains inspired a project back home']
  ],
  hotels: [
    ['The Luxury Travel Expert', 'https://theluxurytravelexpert.com/', 'https://theluxurytravelexpert.com/amsterdam-best-luxury-hotels/', 'The best luxury hotels in Amsterdam'],
    ['A Luxury Travel Blog', 'https://www.aluxurytravelblog.com/', 'https://www.aluxurytravelblog.com/2026/09/30/the-hochtennbodensteig-trail-a-high-altitude-hike-in-axamer-lizum-near-innsbruck/', 'A high-altitude hike near Innsbruck'],
    ['The Hotel Trotter', 'https://www.thehoteltrotter.com/', 'https://www.thehoteltrotter.com/this-elegant-hotel-hosts-romes-most-fashionable-christmas-tree/', "Rome's most fashionable Christmas tree"],
    ['Mrs. O Around The World', 'https://mrsoaroundtheworld.com/', 'https://mrsoaroundtheworld.com/luxury-travel/europe/5-day-piedmont-itinerary-turin-langhe/', '5-day Piedmont itinerary: Turin and the Langhe'],
    ['In Your Pocket', 'https://www.inyourpocket.com/', 'https://www.inyourpocket.com/', 'City guides']
  ]
};

const POSTS = {
  europe: { slug: 'blog-blogs-viajar-tren-europa.html', hero: 7251499, src: 'blog_blogueros_eu' },
  japan: { slug: 'blog-blogs-viajar-tren-japon.html', hero: 5194487, src: 'blog_blogueros_jp' },
  hotels: { slug: 'blog-blogs-hoteles-viaje-tren.html', hero: 36386162, src: 'blog_blogueros_ht' }
};

// Textos por idioma. why[i] = por qué recomendamos el blog i (solo lo que muestra su sitio); go[i] = ruta propia relacionada.
const C = {
  en: {
    meta: 'By WoW Train · November 2026 · 6 min read', back: 'All articles', bc: ['Home', 'Blog'], read: 'Read',
    embedH: 'Writing about one of these routes? Take our times with you',
    embedP: l => `Every route page on WoW Train has a block called <strong>“Add this route to your blog”</strong>: a small card with the route summary and, where we have the official timetable, first train, last train and trains per day. One click copies the code, and it looks right in WordPress, Ghost or any editor. It is free and needs no sign-up. Try it on ${route(l, 'paris-amsterdam', 'Paris → Amsterdam')} or ${route(l, 'tokyo-kyoto', 'Tokyo → Kyoto')}, or find your route in the <a href="/rutas/">route index</a>.`,
    ctaTitle: 'Plan the whole route in one go.', ctaText: 'Describe your trip and WoW Train suggests the trains for every leg, with booking links.', ctaBtn: 'Plan my trip →',
    europe: {
      title: '5 Blogs Worth Reading Before You Travel Europe by Train', tag: 'Recommended blogs',
      desc: 'Five independent blogs that make train travel in Europe easier: practical guides, route ideas and slow-travel stories, chosen by the WoW Train team.',
      kw: 'Europe train travel blogs, best rail travel blogs, train travel Europe guide, slow travel blog Europe',
      alt: 'A young traveller with headphones working on a laptop on a train.',
      lead: 'We read a lot of travel blogs while we build WoW Train. These five are the ones we keep going back to when a reader asks how to cross Europe by rail. Each one does something different, and each one is worth your time.',
      why: [
        'One of the clearest starting points for anyone planning Europe on a budget. Their complete guide to train travel walks through tickets, passes and booking step by step, without jargon.',
        'A site built entirely around rail: train information by country, journey pages and station guides. When you want to know how a specific line works, it is a great place to look.',
        'Stories and routes from people who love trains, with a strong eye for the journey itself. A good read when you are choosing which line to ride, not only where to go.',
        'Slow travel done well, with detailed, practical posts. Their guide to getting from Lisbon to Sintra by train is a model of how to explain a short trip clearly.',
        'In-depth city guides that pay attention to how you actually get around on the ground. Their Europe section is full of ideas for linking cities without flying.'
      ],
      go: l => `Planning one of these trips? Our route guides cover ${route(l, 'lisbon-porto', 'Lisbon → Porto')}, ${route(l, 'paris-amsterdam', 'Paris → Amsterdam')} and ${route(l, 'vienna-salzburg', 'Vienna → Salzburg')}, with times from official open data.`
    },
    japan: {
      title: '5 Blogs to Read Before You Travel Japan by Train', tag: 'Recommended blogs',
      desc: 'Five independent blogs that explain Japan’s trains clearly: Shinkansen fares and tickets, getting around Tokyo and Kyoto, and why Japanese rail works so well.',
      kw: 'Japan train travel blogs, Shinkansen guide, Japan rail blog, Tokyo trains guide, Kyoto travel blog',
      alt: 'Two Shinkansen bullet trains waiting at Tokyo Station.',
      lead: 'Japan’s rail network is one of the best in the world, and also one of the most confusing on a first visit. These five blogs explain it better than anyone we know. We recommend them to our own readers all the time.',
      why: [
        'The reference for travelling Japan without overspending. Their Shinkansen fare finder lets you check what a bullet train costs between two cities before you commit to a rail pass.',
        'Written by people who know Kyoto and the Kansai region in depth. Their step-by-step guide to buying Shinkansen tickets removes most of the stress from your first booking.',
        'The most detailed independent guide to Tokyo we know. Their post on navigating Japan’s trains, subways and stations is the one to read before you land.',
        'Thoughtful guides to travelling Japan independently. Their overview of train travel in Japan explains passes, reservations and which trains to take, calmly and clearly.',
        'Local insight into everyday Japan. Their piece on how Tokyo’s trains inspired a project back home is a lovely reminder of why rail here feels different.'
      ],
      go: l => `Need times for a specific trip? See ${route(l, 'tokyo-kyoto', 'Tokyo → Kyoto')}, ${route(l, 'tokyo-osaka', 'Tokyo → Osaka')} and ${route(l, 'kyoto-himeji', 'Kyoto → Himeji')} on WoW Train.`
    },
    hotels: {
      title: '5 Hotel and Travel Blogs for Arriving by Train and Sleeping Well', tag: 'Recommended blogs',
      desc: 'Five independent hotel and travel blogs we trust for choosing where to stay in European cities you can reach by train, from Amsterdam to Rome and Turin.',
      kw: 'hotel review blogs, luxury travel blogs, best hotels Europe blog, train and hotel Europe',
      alt: 'A city skyline seen from a cosy hotel room window.',
      lead: 'Arriving by train means arriving in the centre of the city, often a few minutes from your hotel. These five blogs are the ones we read to choose where to stay, and their reviews pair perfectly with a trip by rail.',
      why: [
        'Careful, detailed hotel reviews with clear opinions. Their guide to the best luxury hotels in Amsterdam is ideal if you arrive on the train from Paris or Brussels.',
        'One of the longest-running luxury travel blogs, with writers all over the world. A recent post takes you on a high-altitude hike near Innsbruck, a city with direct trains from Vienna and Munich.',
        'Sharp, up-to-date news from the world’s best hotels. Their piece on the Rome hotel with the city’s most fashionable Christmas tree is a good excuse for a winter train trip to Rome.',
        'Elegant travel with real itineraries. Their five-day Piedmont itinerary through Turin and the Langhe works beautifully with a train arrival in Turin.',
        'Independent city guides covering many European cities, with sections on where to stay, eat and go out. Practical and always local.'
      ],
      go: l => `Arriving by train? See ${route(l, 'paris-amsterdam', 'Paris → Amsterdam')}, ${route(l, 'innsbruck-vienna', 'Innsbruck → Vienna')}, ${route(l, 'milan-rome', 'Milan → Rome')} and ${route(l, 'lyon-turin', 'Lyon → Turin')}.`
    }
  },
  es: {
    meta: 'Por WoW Train · Noviembre de 2026 · 6 min de lectura', back: 'Todos los artículos', bc: ['Inicio', 'Blog'], read: 'Leer',
    embedH: '¿Escribes sobre alguna de estas rutas? Llévate nuestros horarios',
    embedP: l => `Cada página de ruta de WoW Train tiene un bloque llamado <strong>«Lleva esta ruta a tu blog»</strong>: una ficha con el resumen de la ruta y, cuando tenemos el horario oficial, el primer tren, el último y los trenes por día. Con un clic copias el código, y se ve bien en WordPress, Ghost o cualquier editor. Es gratis y no necesitas registrarte. Pruébalo en ${route(l, 'paris-amsterdam', 'París → Ámsterdam')} o ${route(l, 'tokyo-kyoto', 'Tokio → Kioto')}, o busca tu ruta en el <a href="/es/rutas/">índice de rutas</a>.`,
    ctaTitle: 'Planifica toda la ruta de una vez.', ctaText: 'Describe tu viaje y WoW Train te sugiere los trenes de cada tramo, con enlaces para reservar.', ctaBtn: 'Planificar mi viaje →',
    europe: {
      title: '5 blogs que vale la pena leer antes de viajar por Europa en tren', tag: 'Blogs recomendados',
      desc: 'Cinco blogs independientes que hacen más fácil viajar en tren por Europa: guías prácticas, ideas de rutas e historias de viaje lento, elegidos por el equipo de WoW Train.',
      kw: 'blogs de viajes en tren Europa, mejores blogs de tren, guía viajar en tren por Europa, viaje lento Europa',
      alt: 'Un viajero joven con auriculares trabaja con su portátil en un tren.',
      lead: 'Leemos muchos blogs de viaje mientras construimos WoW Train. Estos cinco son a los que volvemos cada vez que un lector nos pregunta cómo cruzar Europa en tren. Cada uno aporta algo distinto, y todos valen la pena.',
      why: [
        'Uno de los puntos de partida más claros para planificar Europa con poco presupuesto. Su guía completa de viajes en tren explica billetes, pases y reservas paso a paso, sin tecnicismos.',
        'Un sitio dedicado por completo al tren: información por país, páginas de trayectos y guías de estaciones. Cuando quieres saber cómo funciona una línea concreta, es un gran lugar para buscar.',
        'Historias y rutas de gente que ama los trenes, con mucha atención al viaje en sí. Una buena lectura para elegir qué línea recorrer, no solo adónde ir.',
        'Viaje lento bien contado, con artículos detallados y prácticos. Su guía para ir de Lisboa a Sintra en tren es un ejemplo de cómo explicar un trayecto corto con claridad.',
        'Guías de ciudad muy completas que prestan atención a cómo moverse de verdad. Su sección de Europa está llena de ideas para unir ciudades sin volar.'
      ],
      go: l => `¿Planificas alguno de estos viajes? Nuestras guías cubren ${route(l, 'lisbon-porto', 'Lisboa → Oporto')}, ${route(l, 'paris-amsterdam', 'París → Ámsterdam')} y ${route(l, 'vienna-salzburg', 'Viena → Salzburgo')}, con horarios de datos abiertos oficiales.`
    },
    japan: {
      title: '5 blogs que leer antes de recorrer Japón en tren', tag: 'Blogs recomendados',
      desc: 'Cinco blogs independientes que explican con claridad los trenes de Japón: precios y billetes del Shinkansen, cómo moverse por Tokio y Kioto, y por qué el tren japonés funciona tan bien.',
      kw: 'blogs viajar en tren Japón, guía Shinkansen, blog tren Japón, trenes de Tokio, blog de viaje Kioto',
      alt: 'Dos trenes bala Shinkansen esperando en la estación de Tokio.',
      lead: 'La red de trenes de Japón es de las mejores del mundo y, en el primer viaje, también de las más confusas. Estos cinco blogs la explican mejor que nadie que conozcamos. Se los recomendamos a nuestros lectores todo el tiempo.',
      why: [
        'La referencia para recorrer Japón sin gastar de más. Su buscador de tarifas del Shinkansen te deja ver cuánto cuesta el tren bala entre dos ciudades antes de decidir si te conviene un pase.',
        'Escrito por gente que conoce a fondo Kioto y la región de Kansai. Su guía paso a paso para comprar billetes del Shinkansen quita casi todo el estrés de la primera reserva.',
        'La guía independiente de Tokio más detallada que conocemos. Su artículo sobre cómo moverse por los trenes, el metro y las estaciones de Japón es el que conviene leer antes de aterrizar.',
        'Guías cuidadas para viajar por Japón por tu cuenta. Su resumen sobre viajar en tren en Japón explica pases, reservas y qué trenes tomar, con calma y claridad.',
        'Una mirada local al Japón de todos los días. Su texto sobre cómo los trenes de Tokio inspiraron un proyecto en otro país recuerda por qué el tren allí se siente distinto.'
      ],
      go: l => `¿Necesitas horarios de un trayecto concreto? Mira ${route(l, 'tokyo-kyoto', 'Tokio → Kioto')}, ${route(l, 'tokyo-osaka', 'Tokio → Osaka')} y ${route(l, 'kyoto-himeji', 'Kioto → Himeji')} en WoW Train.`
    },
    hotels: {
      title: '5 blogs de hoteles y viajes para llegar en tren y dormir bien', tag: 'Blogs recomendados',
      desc: 'Cinco blogs independientes de hoteles y viajes en los que confiamos para elegir dónde dormir en ciudades europeas a las que se llega en tren, de Ámsterdam a Roma y Turín.',
      kw: 'blogs de hoteles, blogs de viajes de lujo, mejores hoteles Europa, tren y hotel Europa',
      alt: 'El perfil de una ciudad visto desde la ventana de una habitación de hotel acogedora.',
      lead: 'Llegar en tren es llegar al centro de la ciudad, muchas veces a pocos minutos del hotel. Estos cinco blogs son los que leemos para elegir dónde dormir, y sus reseñas combinan perfecto con un viaje en tren.',
      why: [
        'Reseñas de hoteles cuidadas y detalladas, con opiniones claras. Su guía de los mejores hoteles de lujo de Ámsterdam es ideal si llegas en tren desde París o Bruselas.',
        'Uno de los blogs de viajes de lujo con más trayectoria, con autores en todo el mundo. Un artículo reciente propone una caminata de alta montaña cerca de Innsbruck, ciudad con trenes directos desde Viena y Múnich.',
        'Noticias actuales y bien contadas de los mejores hoteles del mundo. Su nota sobre el hotel de Roma con el árbol de Navidad más elegante de la ciudad es una buena excusa para un viaje en tren a Roma en invierno.',
        'Viajes elegantes con itinerarios reales. Su itinerario de cinco días por el Piamonte, entre Turín y las Langhe, encaja perfecto con una llegada en tren a Turín.',
        'Guías de ciudad independientes de muchas ciudades europeas, con secciones sobre dónde dormir, comer y salir. Prácticas y siempre con mirada local.'
      ],
      go: l => `¿Llegas en tren? Mira ${route(l, 'paris-amsterdam', 'París → Ámsterdam')}, ${route(l, 'innsbruck-vienna', 'Innsbruck → Viena')}, ${route(l, 'milan-rome', 'Milán → Roma')} y ${route(l, 'lyon-turin', 'Lyon → Turín')}.`
    }
  },
  fr: {
    meta: 'Par WoW Train · Novembre 2026 · 6 min de lecture', back: 'Tous les articles', bc: ['Accueil', 'Blog'], read: 'Lire',
    embedH: 'Vous écrivez sur l’un de ces itinéraires ? Emportez nos horaires',
    embedP: l => `Chaque page d’itinéraire de WoW Train propose un bloc <strong>« Ajoutez cet itinéraire à votre blog »</strong> : une fiche avec le résumé du trajet et, quand nous avons l’horaire officiel, le premier train, le dernier et le nombre de trains par jour. Un clic copie le code, qui s’affiche bien dans WordPress, Ghost ou tout autre éditeur. C’est gratuit et sans inscription. Essayez-le sur ${route(l, 'paris-amsterdam', 'Paris → Amsterdam')} ou ${route(l, 'tokyo-kyoto', 'Tokyo → Kyoto')}, ou cherchez votre trajet dans l’<a href="/fr/rutas/">index des itinéraires</a>.`,
    ctaTitle: 'Planifiez tout l’itinéraire en une fois.', ctaText: 'Décrivez votre voyage et WoW Train propose les trains de chaque étape, avec les liens de réservation.', ctaBtn: 'Planifier mon voyage →',
    europe: {
      title: '5 blogs à lire avant de voyager en train en Europe', tag: 'Blogs recommandés',
      desc: 'Cinq blogs indépendants qui facilitent le voyage en train en Europe : guides pratiques, idées d’itinéraires et récits de voyage lent, choisis par l’équipe de WoW Train.',
      kw: 'blogs voyage en train Europe, meilleurs blogs ferroviaires, guide train Europe, voyage lent Europe',
      alt: 'Un jeune voyageur avec un casque travaille sur son ordinateur dans un train.',
      lead: 'Nous lisons beaucoup de blogs de voyage en construisant WoW Train. Ces cinq-là sont ceux vers lesquels nous revenons chaque fois qu’un lecteur nous demande comment traverser l’Europe en train. Chacun apporte quelque chose de différent, et tous valent le détour.',
      why: [
        'L’un des points de départ les plus clairs pour préparer l’Europe avec un petit budget. Leur guide complet du voyage en train explique billets, pass et réservations étape par étape, sans jargon.',
        'Un site entièrement consacré au train : informations par pays, pages de trajets et guides des gares. Quand vous voulez comprendre une ligne précise, c’est une excellente adresse.',
        'Des récits et des itinéraires de passionnés de train, très attentifs au voyage lui-même. Une bonne lecture pour choisir quelle ligne emprunter, pas seulement où aller.',
        'Le voyage lent bien raconté, avec des articles détaillés et pratiques. Leur guide pour aller de Lisbonne à Sintra en train montre comment expliquer clairement un court trajet.',
        'Des guides de villes très complets, attentifs à la façon de se déplacer sur place. Leur rubrique Europe regorge d’idées pour relier les villes sans prendre l’avion.'
      ],
      go: l => `Vous préparez l’un de ces voyages ? Nos guides couvrent ${route(l, 'lisbon-porto', 'Lisbonne → Porto')}, ${route(l, 'paris-amsterdam', 'Paris → Amsterdam')} et ${route(l, 'vienna-salzburg', 'Vienne → Salzbourg')}, avec des horaires issus de données ouvertes officielles.`
    },
    japan: {
      title: '5 blogs à lire avant de parcourir le Japon en train', tag: 'Blogs recommandés',
      desc: 'Cinq blogs indépendants qui expliquent clairement les trains japonais : tarifs et billets du Shinkansen, se déplacer à Tokyo et Kyoto, et pourquoi le rail japonais fonctionne si bien.',
      kw: 'blogs voyage train Japon, guide Shinkansen, blog train Japon, trains de Tokyo, blog voyage Kyoto',
      alt: 'Deux Shinkansen attendent en gare de Tokyo.',
      lead: 'Le réseau ferroviaire japonais est l’un des meilleurs du monde, et aussi l’un des plus déroutants lors d’un premier voyage. Ces cinq blogs l’expliquent mieux que quiconque. Nous les recommandons sans cesse à nos lecteurs.',
      why: [
        'La référence pour voyager au Japon sans trop dépenser. Leur calculateur de tarifs Shinkansen indique le prix du train à grande vitesse entre deux villes avant de choisir un pass.',
        'Écrit par des connaisseurs de Kyoto et du Kansai. Leur guide pas à pas pour acheter des billets de Shinkansen enlève presque tout le stress de la première réservation.',
        'Le guide indépendant de Tokyo le plus détaillé que nous connaissions. Leur article sur les trains, le métro et les gares du Japon est celui à lire avant d’atterrir.',
        'Des guides soignés pour voyager au Japon en indépendant. Leur panorama du voyage en train au Japon explique pass, réservations et trains à prendre, avec calme et clarté.',
        'Un regard local sur le Japon du quotidien. Leur texte sur la façon dont les trains de Tokyo ont inspiré un projet ailleurs rappelle pourquoi le train y est si particulier.'
      ],
      go: l => `Besoin d’horaires pour un trajet précis ? Voyez ${route(l, 'tokyo-kyoto', 'Tokyo → Kyoto')}, ${route(l, 'tokyo-osaka', 'Tokyo → Osaka')} et ${route(l, 'kyoto-himeji', 'Kyoto → Himeji')} sur WoW Train.`
    },
    hotels: {
      title: '5 blogs d’hôtels et de voyage pour arriver en train et bien dormir', tag: 'Blogs recommandés',
      desc: 'Cinq blogs indépendants d’hôtels et de voyage auxquels nous faisons confiance pour choisir où dormir dans les villes européennes accessibles en train, d’Amsterdam à Rome et Turin.',
      kw: 'blogs d’hôtels, blogs voyage de luxe, meilleurs hôtels Europe, train et hôtel Europe',
      alt: 'La silhouette d’une ville vue depuis la fenêtre d’une chambre d’hôtel.',
      lead: 'Arriver en train, c’est arriver au cœur de la ville, souvent à quelques minutes de l’hôtel. Ces cinq blogs sont ceux que nous lisons pour choisir où dormir, et leurs avis se marient parfaitement avec un voyage en train.',
      why: [
        'Des critiques d’hôtels soignées et détaillées, avec des avis tranchés. Leur sélection des meilleurs hôtels de luxe d’Amsterdam est idéale si vous arrivez en train de Paris ou de Bruxelles.',
        'L’un des plus anciens blogs de voyage de luxe, avec des auteurs dans le monde entier. Un article récent propose une randonnée en altitude près d’Innsbruck, reliée en direct à Vienne et Munich.',
        'L’actualité des plus beaux hôtels du monde, vive et à jour. Leur article sur l’hôtel romain au sapin de Noël le plus élégant de la ville est un bon prétexte pour un voyage d’hiver à Rome en train.',
        'Le voyage élégant avec de vrais itinéraires. Leur itinéraire de cinq jours dans le Piémont, entre Turin et les Langhe, s’accorde parfaitement avec une arrivée en train à Turin.',
        'Des guides urbains indépendants pour de nombreuses villes européennes, avec des rubriques où dormir, manger et sortir. Pratiques et toujours locaux.'
      ],
      go: l => `Vous arrivez en train ? Voyez ${route(l, 'paris-amsterdam', 'Paris → Amsterdam')}, ${route(l, 'innsbruck-vienna', 'Innsbruck → Vienne')}, ${route(l, 'milan-rome', 'Milan → Rome')} et ${route(l, 'lyon-turin', 'Lyon → Turin')}.`
    }
  },
  it: {
    meta: 'Di WoW Train · Novembre 2026 · 6 min di lettura', back: 'Tutti gli articoli', bc: ['Home', 'Blog'], read: 'Leggi',
    embedH: 'Scrivi di uno di questi percorsi? Porta con te i nostri orari',
    embedP: l => `Ogni pagina di percorso di WoW Train ha un blocco chiamato <strong>«Porta questo percorso sul tuo blog»</strong>: una scheda con il riassunto del tragitto e, quando abbiamo l’orario ufficiale, primo treno, ultimo treno e treni al giorno. Con un clic copi il codice, che si vede bene in WordPress, Ghost o qualsiasi editor. È gratis e non serve registrarsi. Provalo su ${route(l, 'paris-amsterdam', 'Parigi → Amsterdam')} o ${route(l, 'tokyo-kyoto', 'Tokyo → Kyoto')}, oppure cerca il tuo percorso nell’<a href="/it/rutas/">indice dei percorsi</a>.`,
    ctaTitle: 'Pianifica tutto il percorso in una volta.', ctaText: 'Descrivi il tuo viaggio e WoW Train suggerisce i treni di ogni tratta, con i link per prenotare.', ctaBtn: 'Pianifica il mio viaggio →',
    europe: {
      title: '5 blog da leggere prima di viaggiare in treno in Europa', tag: 'Blog consigliati',
      desc: 'Cinque blog indipendenti che rendono più facile viaggiare in treno in Europa: guide pratiche, idee di itinerari e racconti di viaggio lento, scelti dal team di WoW Train.',
      kw: 'blog viaggi in treno Europa, migliori blog ferroviari, guida treno Europa, viaggio lento Europa',
      alt: 'Un giovane viaggiatore con le cuffie lavora al portatile su un treno.',
      lead: 'Leggiamo molti blog di viaggio mentre costruiamo WoW Train. Questi cinque sono quelli a cui torniamo ogni volta che un lettore ci chiede come attraversare l’Europa in treno. Ognuno offre qualcosa di diverso, e tutti meritano una lettura.',
      why: [
        'Uno dei punti di partenza più chiari per organizzare l’Europa con un budget ridotto. La loro guida completa ai viaggi in treno spiega biglietti, pass e prenotazioni passo dopo passo, senza gergo.',
        'Un sito dedicato interamente al treno: informazioni per paese, pagine dei tragitti e guide alle stazioni. Quando vuoi capire come funziona una linea precisa, è un ottimo punto di riferimento.',
        'Storie e percorsi di appassionati di treni, con grande attenzione al viaggio in sé. Una buona lettura per scegliere quale linea percorrere, non solo dove andare.',
        'Il viaggio lento raccontato bene, con articoli dettagliati e pratici. La loro guida per andare da Lisbona a Sintra in treno è un esempio di come spiegare con chiarezza un tragitto breve.',
        'Guide di città molto complete, attente a come ci si muove davvero. La loro sezione Europa è piena di idee per collegare le città senza volare.'
      ],
      go: l => `Stai pianificando uno di questi viaggi? Le nostre guide coprono ${route(l, 'lisbon-porto', 'Lisbona → Porto')}, ${route(l, 'paris-amsterdam', 'Parigi → Amsterdam')} e ${route(l, 'vienna-salzburg', 'Vienna → Salisburgo')}, con orari da dati aperti ufficiali.`
    },
    japan: {
      title: '5 blog da leggere prima di girare il Giappone in treno', tag: 'Blog consigliati',
      desc: 'Cinque blog indipendenti che spiegano con chiarezza i treni giapponesi: tariffe e biglietti dello Shinkansen, come muoversi a Tokyo e Kyoto, e perché la ferrovia giapponese funziona così bene.',
      kw: 'blog viaggi treno Giappone, guida Shinkansen, blog treni Giappone, treni di Tokyo, blog viaggio Kyoto',
      alt: 'Due treni Shinkansen in attesa alla stazione di Tokyo.',
      lead: 'La rete ferroviaria giapponese è tra le migliori al mondo e, al primo viaggio, anche tra le più disorientanti. Questi cinque blog la spiegano meglio di chiunque conosciamo. Li consigliamo continuamente ai nostri lettori.',
      why: [
        'Il riferimento per viaggiare in Giappone senza spendere troppo. Il loro calcolatore delle tariffe Shinkansen mostra quanto costa il treno proiettile tra due città prima di scegliere un pass.',
        'Scritto da chi conosce a fondo Kyoto e il Kansai. La loro guida passo passo per comprare i biglietti dello Shinkansen toglie quasi tutto lo stress della prima prenotazione.',
        'La guida indipendente di Tokyo più dettagliata che conosciamo. Il loro articolo su treni, metropolitana e stazioni del Giappone è quello da leggere prima di atterrare.',
        'Guide curate per viaggiare in Giappone in autonomia. La loro panoramica sul viaggio in treno in Giappone spiega pass, prenotazioni e quali treni prendere, con calma e chiarezza.',
        'Uno sguardo locale sul Giappone di tutti i giorni. Il loro testo su come i treni di Tokyo hanno ispirato un progetto altrove ricorda perché il treno lì sembra diverso.'
      ],
      go: l => `Ti servono gli orari di un tragitto preciso? Guarda ${route(l, 'tokyo-kyoto', 'Tokyo → Kyoto')}, ${route(l, 'tokyo-osaka', 'Tokyo → Osaka')} e ${route(l, 'kyoto-himeji', 'Kyoto → Himeji')} su WoW Train.`
    },
    hotels: {
      title: '5 blog di hotel e viaggi per arrivare in treno e dormire bene', tag: 'Blog consigliati',
      desc: 'Cinque blog indipendenti di hotel e viaggi di cui ci fidiamo per scegliere dove dormire nelle città europee raggiungibili in treno, da Amsterdam a Roma e Torino.',
      kw: 'blog di hotel, blog viaggi di lusso, migliori hotel Europa, treno e hotel Europa',
      alt: 'Lo skyline di una città visto dalla finestra di una camera d’albergo.',
      lead: 'Arrivare in treno significa arrivare in centro, spesso a pochi minuti dall’hotel. Questi cinque blog sono quelli che leggiamo per scegliere dove dormire, e le loro recensioni si abbinano perfettamente a un viaggio in treno.',
      why: [
        'Recensioni di hotel curate e dettagliate, con opinioni chiare. La loro guida ai migliori hotel di lusso di Amsterdam è ideale se arrivi in treno da Parigi o Bruxelles.',
        'Uno dei blog di viaggi di lusso più longevi, con autori in tutto il mondo. Un articolo recente propone un’escursione d’alta quota vicino a Innsbruck, collegata direttamente a Vienna e Monaco.',
        'Notizie attuali e ben raccontate dai migliori hotel del mondo. Il loro pezzo sull’hotel romano con l’albero di Natale più elegante della città è un’ottima scusa per un viaggio invernale a Roma in treno.',
        'Viaggi eleganti con itinerari reali. Il loro itinerario di cinque giorni in Piemonte, tra Torino e le Langhe, si sposa benissimo con un arrivo in treno a Torino.',
        'Guide indipendenti di molte città europee, con sezioni su dove dormire, mangiare e uscire. Pratiche e sempre locali.'
      ],
      go: l => `Arrivi in treno? Guarda ${route(l, 'paris-amsterdam', 'Parigi → Amsterdam')}, ${route(l, 'innsbruck-vienna', 'Innsbruck → Vienna')}, ${route(l, 'milan-rome', 'Milano → Roma')} e ${route(l, 'lyon-turin', 'Lione → Torino')}.`
    }
  },
  ja: {
    meta: 'WoW Train · 2026年11月 · 6分で読めます', back: '記事一覧', bc: ['ホーム', 'ブログ'], read: '読む',
    embedH: 'これらのルートについて書いていますか？時刻情報をお持ち帰りください',
    embedP: l => `WoW Trainの各ルートページには<strong>「このルートをあなたのブログに」</strong>というブロックがあります。ルートの概要に加え、公式時刻表があるルートでは始発・終電・1日の本数を載せたカードです。ワンクリックでコードをコピーでき、WordPressやGhostなどどのエディタでもきれいに表示されます。無料で、登録も不要です。${route(l, 'tokyo-kyoto', '東京 → 京都')}や${route(l, 'paris-amsterdam', 'パリ → アムステルダム')}で試すか、<a href="/ja/rutas/">ルート一覧</a>からお探しください。`,
    ctaTitle: 'ルート全体をまとめて計画。', ctaText: '旅の内容を入力すると、WoW Trainが各区間の列車と予約リンクを提案します。', ctaBtn: '旅を計画する →',
    europe: {
      title: 'ヨーロッパを列車で旅する前に読みたいブログ5選', tag: 'おすすめブログ',
      desc: 'ヨーロッパの鉄道旅を楽にしてくれる5つの独立系ブログ。実用的なガイド、ルートのアイデア、スローな旅の記録をWoW Trainチームが選びました。',
      kw: 'ヨーロッパ 鉄道旅 ブログ, ヨーロッパ 列車 ガイド, 鉄道旅行 ブログ おすすめ',
      alt: '列車の中でヘッドホンをつけてノートパソコンを使う若い旅行者。',
      lead: 'WoW Trainを作りながら、私たちはたくさんの旅ブログを読んでいます。読者から「ヨーロッパを列車で横断するには？」と聞かれるたびに読み返すのが、この5つです。それぞれに違う魅力があり、どれも読む価値があります。',
      why: [
        '少ない予算でヨーロッパ旅行を計画する人にとって、最もわかりやすい出発点のひとつ。鉄道旅の完全ガイドでは、切符、パス、予約を専門用語なしで一歩ずつ説明しています。',
        '鉄道に特化したサイトで、国別の情報、路線ごとのページ、駅のガイドがそろっています。特定の路線の仕組みを知りたいときに頼れる場所です。',
        '列車好きによる旅の物語とルート紹介で、移動そのものを大切にしています。行き先だけでなく、どの路線に乗るかを選ぶときに役立ちます。',
        'スローな旅を丁寧に伝える、詳しく実用的な記事がそろっています。リスボンからシントラへ列車で行くガイドは、短い移動をわかりやすく説明するお手本です。',
        '現地での移動まで気を配った、充実した都市ガイド。ヨーロッパのセクションには、飛行機を使わずに都市をつなぐアイデアがたくさんあります。'
      ],
      go: l => `これらの旅を計画中ですか？${route(l, 'lisbon-porto', 'リスボン → ポルト')}、${route(l, 'paris-amsterdam', 'パリ → アムステルダム')}、${route(l, 'vienna-salzburg', 'ウィーン → ザルツブルク')}のルートガイドでは、公式オープンデータの時刻を紹介しています。`
    },
    japan: {
      title: '日本を列車で旅する前に読みたいブログ5選', tag: 'おすすめブログ',
      desc: '日本の鉄道をわかりやすく解説する5つの独立系ブログ。新幹線の料金と切符、東京・京都での移動、日本の鉄道がなぜこれほど優れているのかを紹介します。',
      kw: '日本 鉄道旅 ブログ, 新幹線 ガイド, 東京 電車 乗り方, 京都 旅行 ブログ',
      alt: '東京駅で発車を待つ2本の新幹線。',
      lead: '日本の鉄道網は世界でも屈指の便利さですが、初めての旅ではいちばん戸惑う部分でもあります。この5つのブログは、私たちが知る限りもっともわかりやすく解説しています。読者にもいつもおすすめしています。',
      why: [
        '日本をお得に旅するための定番サイト。新幹線の運賃検索ツールで、パスを買う前に2都市間の料金を確認できます。',
        '京都と関西を深く知る人たちによるブログ。新幹線の切符の買い方を一歩ずつ説明したガイドで、初めての予約の不安がほとんどなくなります。',
        '私たちが知る限り最も詳しい東京の独立系ガイド。日本の電車・地下鉄・駅の使い方をまとめた記事は、到着前にぜひ読んでおきたい一本です。',
        '個人で日本を旅する人のための丁寧なガイド。日本の鉄道旅の概要では、パス、予約、乗るべき列車を落ち着いてわかりやすく説明しています。',
        '日常の日本を伝えるローカルな視点。東京の電車が海外のプロジェクトのヒントになった話は、日本の鉄道がなぜ特別に感じられるのかを思い出させてくれます。'
      ],
      go: l => `特定の区間の時刻が知りたいですか？WoW Trainの${route(l, 'tokyo-kyoto', '東京 → 京都')}、${route(l, 'tokyo-osaka', '東京 → 大阪')}、${route(l, 'kyoto-himeji', '京都 → 姫路')}をご覧ください。`
    },
    hotels: {
      title: '列車で着いてぐっすり眠るためのホテル・旅ブログ5選', tag: 'おすすめブログ',
      desc: 'アムステルダムからローマ、トリノまで、列車で行けるヨーロッパの都市で泊まる場所を選ぶときに私たちが信頼している5つの独立系ホテル・旅ブログ。',
      kw: 'ホテル レビュー ブログ, ラグジュアリー 旅行 ブログ, ヨーロッパ ホテル, 列車とホテル',
      alt: '居心地のよいホテルの窓から見える街並み。',
      lead: '列車で着くということは、街の中心に着くということ。ホテルまで数分ということもよくあります。この5つのブログは、私たちが泊まる場所を選ぶときに読んでいるもので、そのレビューは鉄道旅と相性抜群です。',
      why: [
        '丁寧で詳しいホテルレビューと、はっきりした意見が魅力。アムステルダムの高級ホテルガイドは、パリやブリュッセルから列車で到着する旅に最適です。',
        '世界中に書き手を持つ、歴史あるラグジュアリー旅ブログ。最近の記事では、ウィーンやミュンヘンから直通列車で行けるインスブルック近郊の高山ハイキングを紹介しています。',
        '世界の一流ホテルの最新ニュースを、鋭くわかりやすく伝えます。ローマで最もおしゃれなクリスマスツリーを飾るホテルの記事は、冬にローマへ列車で出かけるいいきっかけになります。',
        '実際の旅程にもとづいたエレガントな旅。トリノとランゲを巡るピエモンテ5日間の旅程は、列車でトリノに着く旅にぴったりです。',
        'ヨーロッパの多くの都市を網羅する独立系の都市ガイド。泊まる、食べる、出かける場所のセクションがあり、実用的で地元目線です。'
      ],
      go: l => `列車で到着しますか？${route(l, 'paris-amsterdam', 'パリ → アムステルダム')}、${route(l, 'innsbruck-vienna', 'インスブルック → ウィーン')}、${route(l, 'milan-rome', 'ミラノ → ローマ')}、${route(l, 'lyon-turin', 'リヨン → トリノ')}をご覧ください。`
    }
  }
};

const urlOf = (key, l) => `https://glosx.app/${PREFIX[l]}${POSTS[key].slug}`;

function langSwitch(key, cur) {
  const opts = LANGS.map(l => `<a class="lang-option${l === cur ? ' active' : ''}" href="/${PREFIX[l]}${POSTS[key].slug}">${LANG_NAMES[l]}</a>`).join('');
  return `<div class="lang-wrapper"><button type="button" class="lang-btn" aria-label="Language" onclick="event.stopPropagation();this.nextElementSibling.classList.toggle('open');"><span>${cur.toUpperCase()}</span><span style="font-size:10px;opacity:0.6">▾</span></button><div class="lang-dropdown">${opts}</div></div>`;
}

function body(key, l) {
  const c = C[l], p = c[key], pre = l === 'en' ? '' : `/${l}`;
  const blogs = B[key].map((b, i) => `    <h2>${i + 1}. ${ext(b[1], b[0])}</h2>
    <p>
      ${p.why[i]}
    </p>
    <p>${c.read}: ${ext(b[2], b[3])}</p>`).join('\n\n');
  return `<body>
  <nav>
    ${require('./apply-logo').MARKUP('/')}
    <div class="nav-right">
      ${langSwitch(key, l)}
      <a href="${pre}/blog.html" class="nav-back">← ${c.back}</a>
    </div>
  </nav>

  <div class="blog-hero" style="background-image:url('${PHOTO(POSTS[key].hero, 1400)}')">
    <div class="hero-content">
      <span class="badge">${p.tag}</span>
      <h1>${p.title}</h1>
      <p class="meta">${c.meta}</p>
    </div>
  </div>

  <main>
    <p class="lead">
      ${p.lead}
    </p>

${blogs}

    <p>
      ${p.go(l)}
    </p>

    <h2>${c.embedH}</h2>
    <p>
      ${c.embedP(l)}
    </p>

    <hr/>

    <div class="cta">
      <h3>${c.ctaTitle}</h3>
      <p>${c.ctaText}</p>
      <a href="${pre}/#aiPlanner" class="cta-btn">${c.ctaBtn}</a>
    </div>
  </main>

  `;
}

function build(key, l) {
  const c = C[l], p = c[key], hero = PHOTO(POSTS[key].hero, 1400);
  const shell = fs.readFileSync(path.join(ROOT, PREFIX[l], SHELL), 'utf8');
  const lines = shell.split('\n');
  const li = n => lines.findIndex(x => x.includes(n));
  const headTop = lines.slice(0, 5).join('\n');
  const afterMeta = lines.slice(li('<link rel="icon"'), li('<body>')).join('\n')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.bc[0], item: `https://glosx.app/${PREFIX[l]}` },
      { '@type': 'ListItem', position: 2, name: c.bc[1], item: `https://glosx.app/${PREFIX[l]}blog.html` },
      { '@type': 'ListItem', position: 3, name: p.title, item: urlOf(key, l) }] },
    { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.desc, image: hero,
      author: { '@type': 'Organization', name: 'WoW Train' }, publisher: { '@type': 'Organization', name: 'GLOSX', alternateName: 'WoW Train' },
      datePublished: DATE, dateModified: DATE, inLanguage: l, mainEntityOfPage: urlOf(key, l),
      mentions: B[key].map(b => ({ '@type': 'WebSite', name: b[0], url: b[1] })) }
  ].map(o => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  const metas = `  <title>${esc(p.title)} — WoW Train</title>
  <meta name="description" content="${esc(p.desc)}" />
  <meta name="keywords" content="${esc(p.kw)}" />
  <link rel="canonical" href="${urlOf(key, l)}" />
${LANGS.map(x => `  <link rel="alternate" hreflang="${x}" href="${urlOf(key, x)}" />`).join('\n')}
  <link rel="alternate" hreflang="x-default" href="${urlOf(key, 'en')}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(p.title)}" />
  <meta property="og:description" content="${esc(p.desc)}" />
  <meta property="og:url" content="${urlOf(key, l)}" />
  <meta property="og:image" content="${hero}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(p.title)}" />
  <meta name="twitter:description" content="${esc(p.desc)}" />
  <meta name="twitter:image" content="${hero}" />
${ld}
`;
  const footer = shell.slice(shell.indexOf('<footer>'));
  const out = headTop + '\n' + metas + '\n  ' + afterMeta.trim() + '\n' + body(key, l) + footer;
  fs.writeFileSync(path.join(ROOT, PREFIX[l], POSTS[key].slug), out);
  console.log('Generado', PREFIX[l] + POSTS[key].slug);
}

Object.keys(POSTS).forEach(k => LANGS.forEach(l => build(k, l)));
module.exports = { C, POSTS, PREFIX, PHOTO };
