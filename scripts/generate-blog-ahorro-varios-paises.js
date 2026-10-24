#!/usr/bin/env node
/**
 * Artículo de blog "Cómo recorrer varios países de Europa en tren gastando menos" en EN/ES/FR/IT/JA.
 * Molde: blog-tren-arraigo-pueblos.html de cada idioma (igual que generate-blog-sagano.js).
 * Datos verificados el 24-oct-2026:
 *  - Duraciones: tablas propias de datos abiertos (assets/data/horarios-austria.json de ÖBB, horarios-suiza.json de SBB), día laborable.
 *  - Ventas anticipadas en las webs oficiales: ÖBB Sparschiene hasta 6 meses (Nightjet hasta 360 días), solo en el tren reservado,
 *    plazas limitadas; SBB Supersaver hasta 6 meses (tras el cambio de horario de diciembre, cuando se publica el horario, hacia fin
 *    de junio); DB Sparpreis hasta 12 meses. Código NEW10 de Omio: 10 % en la primera reserva, hasta 80 €, vigente hasta 30-nov-2026.
 * Sin enlaces a operadores (regla del sitio): se nombran las tarifas, los enlaces van a páginas propias y a Omio (afiliado).
 * Uso: node scripts/generate-blog-ahorro-varios-paises.js   (después: añadir la tarjeta al principio de cada blog.html, sitemap e Indexing)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SLUG = 'blog-ahorrar-tren-varios-paises-europa.html';
const SHELL = 'blog-tren-arraigo-pueblos.html';
const LANGS = ['en', 'es', 'fr', 'it', 'ja'];
const PREFIX = { en: '', es: 'es/', fr: 'fr/', it: 'it/', ja: 'ja/' };
const LANG_NAMES = { en: 'English', es: 'Español', fr: 'Français', it: 'Italiano', ja: '日本語' };
const PHOTO = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const HERO = 4901982;
const GRID = [211052, 4901945, 2415934];
const DATE = '2026-10-24';
const API = 'https://voxa-production-dc15.up.railway.app/affiliate';
const OMIO_LANG = { es: 'es', fr: 'fr', it: 'it', en: 'de', ja: 'de' };   // Omio no tiene catálogo oficial en inglés ni japonés
const REL = [['vienna-salzburg', 'Vienna', 'Salzburg'], ['innsbruck-vienna', 'Innsbruck', 'Vienna'], ['zurich-lucerne', 'Zurich', 'Lucerne'], ['zurich-geneva', 'Zurich', 'Geneva']];
const RELNAMES = {
  en: {}, es: { Vienna: 'Viena', Zurich: 'Zúrich', Lucerne: 'Lucerna', Geneva: 'Ginebra' }, fr: { Vienna: 'Vienne', Zurich: 'Zurich', Lucerne: 'Lucerne', Geneva: 'Genève' },
  it: { Vienna: 'Vienna', Zurich: 'Zurigo', Lucerne: 'Lucerna', Geneva: 'Ginevra', Salzburg: 'Salisburgo' }, ja: { Vienna: 'ウィーン', Salzburg: 'ザルツブルク', Innsbruck: 'インスブルック', Zurich: 'チューリッヒ', Lucerne: 'ルツェルン', Geneva: 'ジュネーヴ' }
};
const TABLES = {
  en: ['/austria-trains/', '/swiss-trains/', '/norway-trains/', '/sweden-trains/', '/finland-trains/'],
  es: ['/es/trenes-austria/', '/es/trenes-suiza/', '/es/trenes-noruega/', '/es/trenes-suecia/', '/es/trenes-finlandia/'],
  fr: ['/fr/trains-autriche/', '/fr/trains-suisse/', '/fr/trains-norvege/', '/fr/trains-suede/', '/fr/trains-finlande/'],
  it: ['/it/treni-austria/', '/it/treni-svizzera/', '/it/treni-norvegia/', '/it/treni-svezia/', '/it/treni-finlandia/'],
  ja: ['/ja/austria-trains/', '/ja/swiss-trains/', '/ja/norway-trains/', '/ja/sweden-trains/', '/ja/finland-trains/']
};
const link = (href, txt) => `<a href="${href}">${txt}</a>`;
const post = (l, f) => `/${PREFIX[l]}${f}`;

const C = {
  en: {
    title: 'How to Travel Through Several European Countries by Train for Less',
    desc: 'Plan a multi-country train trip in Europe on a budget: order cities along the main lines, split tickets at borders, book saver fares early and use night trains. With real journey times.',
    kw: 'cheap train travel Europe, multi-country train trip, Europe by train on a budget, saver fares, split tickets Europe, backpacking Europe by train',
    tag: 'Saving money', meta: 'By WoW Train · October 2026 · 7 min read', back: 'All articles', bc: ['Home', 'Blog'],
    alt: ['Two backpackers checking their phones on a station platform.', 'A traveller with a backpack looks up a train on his phone.', 'A smiling traveller with a backpack and a phone at a station.'],
    lead: 'Crossing several countries by train does not have to be expensive. Most of the saving comes from how you plan the route, not from a magic discount: the order of the cities, where you split the tickets and how early you book. This guide uses real journey times from our open-data timetables for Austria and Switzerland.',
    blocks: [
      ['h2', '1. Put the cities in the order of the rail lines'],
      ['p', 'Draw the route along the main lines and avoid going back and forth. A classic example through the Alps: Vienna → Salzburg → Innsbruck → Zurich → Lucerne → Geneva. Every leg is a direct train, and most are short:'],
      ['ul', ['<strong>Vienna – Salzburg:</strong> fastest train 2 h 25, 43 direct trains on a weekday.', '<strong>Salzburg – Innsbruck:</strong> 2 h 00, 19 direct trains.', '<strong>Zurich – Lucerne:</strong> 41 min, 40 direct trains.', '<strong>Bern – Geneva:</strong> 1 h 51, 30 direct trains.']],
      ['p', 'Short legs with many trains are easy to change if your plans move, and they leave time to see each city. You can check first and last trains for every connection in our tables for ' + link('/austria-trains/', 'Austria') + ' and ' + link('/swiss-trains/', 'Switzerland') + '.'],
      ['h2', '2. Book saver fares as soon as sales open'],
      ['p', 'National railways sell a limited number of cheap tickets per train, and they go first. These are the advance windows the operators publish:'],
      ['ul', ['<strong>Austria (ÖBB Sparschiene):</strong> up to 6 months ahead, and up to 360 days for Nightjet night trains. Valid only on the train you book.', '<strong>Switzerland (SBB Supersaver):</strong> up to 6 months ahead. For trips after the December timetable change, they go on sale once the new timetable is published, towards the end of June.', '<strong>Germany (DB Sparpreis):</strong> up to 12 months ahead.']],
      ['p', 'Saver fares are tied to one train. If a delay makes you miss the next one, check the conditions of your ticket before you travel.'],
      ['h2', '3. Split the trip at the border when it is cheaper'],
      ['p', 'One ticket from start to finish is not always the cheapest. Sometimes two tickets, one for each country, cost less. Compare both options for the same train. The trade-off: with separate tickets, if the first train is late and you miss the second, the second operator does not have to rebook you. Leave a generous connection time, at least an hour, or keep one through ticket on tight connections.'],
      ['h2', '4. Use a night train as your hotel'],
      ['p', 'A night train covers a long distance while you sleep and saves a night of accommodation. On long legs, a couchette often costs less than a day train plus a hotel. Night trains sell out early, which is why their sales open so far ahead. Read our ' + link('/blog-night-trains-europe.html', 'guide to night trains in Europe') + '.'],
      ['h2', '5. Regional trains and buses for the gaps'],
      ['p', 'Not every leg needs a fast train. Regional trains are usually cheaper and do not need a reservation, and for some short trips they are almost as quick. Where there is no direct train, a bus can fill the gap: Omio shows trains and buses for the same route, so you can compare them side by side.'],
      ['h2', '6. Rail pass or single tickets?'],
      ['p', 'A pass pays off when you travel a lot on many days and want flexibility. For a route with a few long legs booked early, single tickets are usually cheaper. Do the numbers with our comparison: ' + link('/blog-eurail-pass-vs-point-to-point.html', 'rail pass vs single tickets') + '.'],
      ['h2', '7. One more discount for your first booking'],
      ['p', 'If you have never booked with Omio, the code <strong>NEW10</strong> gives 10% off your first booking, up to €80, until 30 November 2026.'],
      ['h2', 'Quick checklist'],
      ['ul', ['Order the cities along the main rail lines.', 'Write down when saver fares open for each leg and book on that day.', 'Compare one through ticket with two separate tickets.', 'Leave at least an hour between separate tickets.', 'Use a night train on the longest leg.', 'Check our open-data tables: ' + TABLES.en.map((h, i) => link(h, ['Austria', 'Switzerland', 'Norway', 'Sweden', 'Finland'][i])).join(', ') + '.']],
      ['cta', 'Vienna → Salzburg · Compare on Omio', 'Trains and buses, prices and times', 'vienna', 'salzburg'],
      ['cta', 'Zurich → Lucerne · Compare on Omio', 'Trains and buses, prices and times', 'zurich', 'lucerne']
    ],
    ctaTitle: 'Plan the whole route in one go.', ctaText: 'Describe your trip and WoW Train suggests the trains for every leg, with booking links.', ctaBtn: 'Plan my trip →',
    relTitle: 'Related route guides', relMore: 'More train routes in Europe →'
  },
  es: {
    title: 'Cómo recorrer varios países de Europa en tren gastando menos',
    desc: 'Arma un viaje en tren por varios países de Europa con poco presupuesto: ordena las ciudades por las líneas principales, divide los billetes en la frontera, compra tarifas de ahorro pronto y usa trenes nocturnos. Con duraciones reales.',
    kw: 'tren barato Europa, viajar en tren por varios países, Europa en tren con poco presupuesto, tarifas de ahorro, billetes divididos, mochilero Europa tren',
    tag: 'Ahorro', meta: 'Por WoW Train · Octubre 2026 · 7 min de lectura', back: 'Todos los artículos', bc: ['Inicio', 'Blog'],
    alt: ['Dos mochileras revisan el celular en el andén de una estación.', 'Un viajero con mochila busca un tren en su teléfono.', 'Una viajera sonriente con mochila y teléfono en una estación.'],
    lead: 'Cruzar varios países en tren no tiene por qué ser caro. La mayor parte del ahorro sale de cómo planeas la ruta, no de un descuento mágico: el orden de las ciudades, dónde divides los billetes y con cuánta anticipación compras. Esta guía usa duraciones reales de nuestras tablas de datos abiertos de Austria y Suiza.',
    blocks: [
      ['h2', '1. Ordena las ciudades siguiendo las líneas de tren'],
      ['p', 'Dibuja la ruta sobre las líneas principales y evita ir y volver. Un ejemplo clásico por los Alpes: Viena → Salzburgo → Innsbruck → Zúrich → Lucerna → Ginebra. Cada tramo es un tren directo y la mayoría son cortos:'],
      ['ul', ['<strong>Viena – Salzburgo:</strong> el tren más rápido tarda 2 h 25, con 43 trenes directos en un día laborable.', '<strong>Salzburgo – Innsbruck:</strong> 2 h 00, 19 trenes directos.', '<strong>Zúrich – Lucerna:</strong> 41 min, 40 trenes directos.', '<strong>Berna – Ginebra:</strong> 1 h 51, 30 trenes directos.']],
      ['p', 'Los tramos cortos con muchos trenes son fáciles de cambiar si se mueven tus planes, y te dejan tiempo para conocer cada ciudad. Puedes ver el primer y el último tren de cada conexión en nuestras tablas de ' + link('/es/trenes-austria/', 'Austria') + ' y ' + link('/es/trenes-suiza/', 'Suiza') + '.'],
      ['h2', '2. Compra las tarifas de ahorro en cuanto salen a la venta'],
      ['p', 'Los ferrocarriles nacionales venden una cantidad limitada de billetes baratos por tren, y son los primeros en agotarse. Estos son los plazos que publican los operadores:'],
      ['ul', ['<strong>Austria (ÖBB Sparschiene):</strong> hasta 6 meses antes, y hasta 360 días para los trenes nocturnos Nightjet. Solo vale en el tren que reservas.', '<strong>Suiza (SBB Supersaver):</strong> hasta 6 meses antes. Para viajes posteriores al cambio de horario de diciembre, salen a la venta cuando se publica el nuevo horario, hacia finales de junio.', '<strong>Alemania (DB Sparpreis):</strong> hasta 12 meses antes.']],
      ['p', 'Las tarifas de ahorro van atadas a un tren. Si un retraso te hace perder el siguiente, revisa las condiciones de tu billete antes de viajar.'],
      ['h2', '3. Divide el viaje en la frontera cuando sale más barato'],
      ['p', 'Un solo billete de punta a punta no siempre es lo más barato. A veces dos billetes, uno por país, cuestan menos. Compara las dos opciones para el mismo tren. La contra: con billetes separados, si el primer tren llega tarde y pierdes el segundo, el segundo operador no está obligado a cambiarte el billete. Deja un margen amplio, de al menos una hora, o usa un billete único en las conexiones justas.'],
      ['h2', '4. Usa el tren nocturno como hotel'],
      ['p', 'Un tren nocturno recorre una distancia larga mientras duermes y te ahorra una noche de alojamiento. En los tramos largos, una litera suele costar menos que un tren de día más un hotel. Los nocturnos se agotan pronto, por eso su venta abre con tanta anticipación. Lee nuestra ' + link('/es/blog-night-trains-europe.html', 'guía de trenes nocturnos en Europa') + '.'],
      ['h2', '5. Regionales y buses para los tramos sueltos'],
      ['p', 'No todos los tramos necesitan un tren rápido. Los regionales suelen ser más baratos y no piden reserva, y en algunos trayectos cortos tardan casi lo mismo. Donde no hay tren directo, un bus puede cubrir el hueco: Omio muestra trenes y buses para la misma ruta, así que puedes compararlos lado a lado.'],
      ['h2', '6. ¿Pase o billetes sueltos?'],
      ['p', 'Un pase conviene si viajas mucho, muchos días, y quieres flexibilidad. Para una ruta con pocos tramos largos comprados con tiempo, los billetes sueltos suelen salir más baratos. Haz las cuentas con nuestra comparación: ' + link('/es/blog-eurail-pass-vs-point-to-point.html', 'pase de tren o billetes sueltos') + '.'],
      ['h2', '7. Un descuento más en tu primera reserva'],
      ['p', 'Si nunca reservaste con Omio, el código <strong>NEW10</strong> te da un 10 % en tu primera reserva, hasta 80 €, hasta el 30 de noviembre de 2026.'],
      ['h2', 'Lista rápida'],
      ['ul', ['Ordena las ciudades siguiendo las líneas principales.', 'Anota cuándo salen las tarifas de ahorro de cada tramo y compra ese mismo día.', 'Compara un billete único con dos billetes separados.', 'Deja al menos una hora entre billetes separados.', 'Usa un tren nocturno en el tramo más largo.', 'Consulta nuestras tablas de datos abiertos: ' + TABLES.es.map((h, i) => link(h, ['Austria', 'Suiza', 'Noruega', 'Suecia', 'Finlandia'][i])).join(', ') + '.']],
      ['cta', 'Viena → Salzburgo · Compara en Omio', 'Trenes y buses, precios y horarios', 'vienna', 'salzburg'],
      ['cta', 'Zúrich → Lucerna · Compara en Omio', 'Trenes y buses, precios y horarios', 'zurich', 'lucerne']
    ],
    ctaTitle: 'Planea toda la ruta de una vez.', ctaText: 'Describe tu viaje y WoW Train te sugiere los trenes de cada tramo, con enlaces para reservar.', ctaBtn: 'Planear mi viaje →',
    relTitle: 'Guías de rutas relacionadas', relMore: 'Más rutas de tren en Europa →'
  },
  fr: {
    title: 'Comment traverser plusieurs pays d’Europe en train en dépensant moins',
    desc: 'Préparez un voyage en train dans plusieurs pays d’Europe avec un petit budget : ordonnez les villes selon les grandes lignes, coupez les billets à la frontière, réservez tôt les tarifs réduits et prenez le train de nuit. Avec des durées réelles.',
    kw: 'train pas cher Europe, voyage en train plusieurs pays, Europe en train petit budget, tarifs réduits, billets séparés, routard Europe train',
    tag: 'Économies', meta: 'Par WoW Train · Octobre 2026 · 7 min de lecture', back: 'Tous les articles', bc: ['Accueil', 'Blog'],
    alt: ['Deux voyageuses avec sac à dos consultent leur téléphone sur un quai de gare.', 'Un voyageur avec sac à dos cherche un train sur son téléphone.', 'Une voyageuse souriante avec sac à dos et téléphone dans une gare.'],
    lead: 'Traverser plusieurs pays en train n’a pas besoin d’être cher. L’essentiel de l’économie vient de la façon de préparer l’itinéraire, pas d’une réduction miracle : l’ordre des villes, l’endroit où l’on coupe les billets et le moment où l’on réserve. Ce guide utilise des durées réelles issues de nos tableaux de données ouvertes pour l’Autriche et la Suisse.',
    blocks: [
      ['h2', '1. Placez les villes dans l’ordre des lignes de train'],
      ['p', 'Tracez l’itinéraire le long des grandes lignes et évitez les allers-retours. Un exemple classique à travers les Alpes : Vienne → Salzbourg → Innsbruck → Zurich → Lucerne → Genève. Chaque étape est un train direct, et la plupart sont courtes :'],
      ['ul', ['<strong>Vienne – Salzbourg :</strong> train le plus rapide en 2 h 25, 43 trains directs en semaine.', '<strong>Salzbourg – Innsbruck :</strong> 2 h 00, 19 trains directs.', '<strong>Zurich – Lucerne :</strong> 41 min, 40 trains directs.', '<strong>Berne – Genève :</strong> 1 h 51, 30 trains directs.']],
      ['p', 'Les étapes courtes avec beaucoup de trains se modifient facilement si vos plans changent, et laissent du temps pour visiter chaque ville. Premier et dernier train de chaque liaison dans nos tableaux pour ' + link('/fr/trains-autriche/', 'l’Autriche') + ' et ' + link('/fr/trains-suisse/', 'la Suisse') + '.'],
      ['h2', '2. Réservez les tarifs réduits dès l’ouverture des ventes'],
      ['p', 'Les compagnies nationales vendent un nombre limité de billets bon marché par train, et ils partent en premier. Voici les délais publiés par les opérateurs :'],
      ['ul', ['<strong>Autriche (ÖBB Sparschiene) :</strong> jusqu’à 6 mois à l’avance, et jusqu’à 360 jours pour les trains de nuit Nightjet. Valable uniquement dans le train réservé.', '<strong>Suisse (billets dégriffés CFF) :</strong> jusqu’à 6 mois à l’avance. Pour les voyages après le changement d’horaire de décembre, ils sont mis en vente une fois le nouvel horaire publié, vers fin juin.', '<strong>Allemagne (DB Sparpreis) :</strong> jusqu’à 12 mois à l’avance.']],
      ['p', 'Les tarifs réduits sont liés à un train. Si un retard vous fait manquer le suivant, vérifiez les conditions de votre billet avant de partir.'],
      ['h2', '3. Coupez le trajet à la frontière quand c’est moins cher'],
      ['p', 'Un seul billet de bout en bout n’est pas toujours le moins cher. Parfois, deux billets, un par pays, coûtent moins. Comparez les deux options pour le même train. La contrepartie : avec des billets séparés, si le premier train est en retard et que vous manquez le second, le second opérateur n’est pas tenu de vous replacer. Prévoyez une correspondance large, d’au moins une heure, ou gardez un billet unique pour les correspondances serrées.'],
      ['h2', '4. Le train de nuit comme hôtel'],
      ['p', 'Un train de nuit parcourt une longue distance pendant votre sommeil et vous fait économiser une nuit d’hébergement. Sur les longues étapes, une couchette coûte souvent moins cher qu’un train de jour plus un hôtel. Les trains de nuit se remplissent vite, c’est pourquoi leurs ventes ouvrent si tôt. Lisez notre ' + link('/fr/blog-night-trains-europe.html', 'guide des trains de nuit en Europe') + '.'],
      ['h2', '5. Trains régionaux et bus pour les trous'],
      ['p', 'Toutes les étapes n’ont pas besoin d’un train rapide. Les trains régionaux sont souvent moins chers et sans réservation, et sur certains trajets courts ils sont presque aussi rapides. Là où il n’y a pas de train direct, un bus peut faire la jonction : Omio affiche trains et bus pour le même trajet, pour les comparer côte à côte.'],
      ['h2', '6. Pass ou billets simples ?'],
      ['p', 'Un pass est rentable si vous voyagez beaucoup, sur de nombreux jours, et voulez de la souplesse. Pour un itinéraire avec quelques longues étapes réservées tôt, les billets simples reviennent généralement moins cher. Faites le calcul avec notre comparatif : ' + link('/fr/blog-eurail-pass-vs-point-to-point.html', 'pass ferroviaire ou billets simples') + '.'],
      ['h2', '7. Une réduction de plus sur votre première réservation'],
      ['p', 'Si vous n’avez jamais réservé sur Omio, le code <strong>NEW10</strong> offre 10 % sur votre première réservation, jusqu’à 80 €, jusqu’au 30 novembre 2026.'],
      ['h2', 'Liste rapide'],
      ['ul', ['Ordonnez les villes le long des grandes lignes.', 'Notez l’ouverture des tarifs réduits pour chaque étape et réservez ce jour-là.', 'Comparez un billet unique et deux billets séparés.', 'Laissez au moins une heure entre deux billets séparés.', 'Prenez un train de nuit pour l’étape la plus longue.', 'Consultez nos tableaux de données ouvertes : ' + TABLES.fr.map((h, i) => link(h, ['Autriche', 'Suisse', 'Norvège', 'Suède', 'Finlande'][i])).join(', ') + '.']],
      ['cta', 'Vienne → Salzbourg · Comparer sur Omio', 'Trains et bus, prix et horaires', 'vienna', 'salzburg'],
      ['cta', 'Zurich → Lucerne · Comparer sur Omio', 'Trains et bus, prix et horaires', 'zurich', 'lucerne']
    ],
    ctaTitle: 'Préparez tout l’itinéraire d’un coup.', ctaText: 'Décrivez votre voyage et WoW Train propose les trains de chaque étape, avec les liens de réservation.', ctaBtn: 'Préparer mon voyage →',
    relTitle: 'Guides de trajets liés', relMore: 'Plus de trajets en train en Europe →'
  },
  it: {
    title: 'Come attraversare più paesi d’Europa in treno spendendo meno',
    desc: 'Organizza un viaggio in treno in più paesi d’Europa con un budget ridotto: ordina le città lungo le linee principali, dividi i biglietti al confine, prenota presto le tariffe economiche e usa i treni notturni. Con tempi di viaggio reali.',
    kw: 'treno economico Europa, viaggio in treno più paesi, Europa in treno low cost, tariffe economiche, biglietti separati, zaino in spalla Europa treno',
    tag: 'Risparmio', meta: 'Di WoW Train · Ottobre 2026 · 7 min di lettura', back: 'Tutti gli articoli', bc: ['Home', 'Blog'],
    alt: ['Due viaggiatrici con lo zaino controllano il telefono sul binario.', 'Un viaggiatore con lo zaino cerca un treno sul telefono.', 'Una viaggiatrice sorridente con zaino e telefono in stazione.'],
    lead: 'Attraversare più paesi in treno non deve per forza costare tanto. Il risparmio viene soprattutto da come pianifichi il percorso, non da uno sconto miracoloso: l’ordine delle città, dove dividi i biglietti e quanto in anticipo prenoti. Questa guida usa tempi di viaggio reali dalle nostre tabelle di dati aperti per Austria e Svizzera.',
    blocks: [
      ['h2', '1. Metti le città nell’ordine delle linee ferroviarie'],
      ['p', 'Disegna il percorso lungo le linee principali ed evita di tornare indietro. Un esempio classico attraverso le Alpi: Vienna → Salisburgo → Innsbruck → Zurigo → Lucerna → Ginevra. Ogni tappa è un treno diretto e quasi tutte sono brevi:'],
      ['ul', ['<strong>Vienna – Salisburgo:</strong> treno più veloce in 2 h 25, 43 treni diretti nei giorni feriali.', '<strong>Salisburgo – Innsbruck:</strong> 2 h 00, 19 treni diretti.', '<strong>Zurigo – Lucerna:</strong> 41 min, 40 treni diretti.', '<strong>Berna – Ginevra:</strong> 1 h 51, 30 treni diretti.']],
      ['p', 'Le tappe brevi con molti treni si cambiano facilmente se i piani cambiano, e lasciano tempo per visitare ogni città. Primo e ultimo treno di ogni collegamento nelle nostre tabelle per ' + link('/it/treni-austria/', 'Austria') + ' e ' + link('/it/treni-svizzera/', 'Svizzera') + '.'],
      ['h2', '2. Prenota le tariffe economiche appena aprono le vendite'],
      ['p', 'Le ferrovie nazionali vendono un numero limitato di biglietti economici per treno, e sono i primi a esaurirsi. Questi sono i tempi pubblicati dagli operatori:'],
      ['ul', ['<strong>Austria (ÖBB Sparschiene):</strong> fino a 6 mesi prima, e fino a 360 giorni per i treni notturni Nightjet. Valido solo sul treno prenotato.', '<strong>Svizzera (biglietti risparmio FFS):</strong> fino a 6 mesi prima. Per i viaggi dopo il cambio d’orario di dicembre, sono in vendita quando viene pubblicato il nuovo orario, verso fine giugno.', '<strong>Germania (DB Sparpreis):</strong> fino a 12 mesi prima.']],
      ['p', 'Le tariffe economiche sono legate a un treno. Se un ritardo ti fa perdere il successivo, controlla le condizioni del biglietto prima di partire.'],
      ['h2', '3. Dividi il viaggio al confine quando conviene'],
      ['p', 'Un unico biglietto da capo a capo non è sempre il più economico. A volte due biglietti, uno per paese, costano meno. Confronta le due opzioni per lo stesso treno. Il rovescio della medaglia: con biglietti separati, se il primo treno è in ritardo e perdi il secondo, il secondo operatore non è tenuto a riprenotarti. Lascia un margine ampio, di almeno un’ora, oppure usa un biglietto unico per le coincidenze strette.'],
      ['h2', '4. Il treno notturno come hotel'],
      ['p', 'Un treno notturno copre una lunga distanza mentre dormi e ti fa risparmiare una notte di alloggio. Sulle tappe lunghe, una cuccetta costa spesso meno di un treno di giorno più un hotel. I notturni si esauriscono presto, per questo le vendite aprono così in anticipo. Leggi la nostra ' + link('/it/blog-night-trains-europe.html', 'guida ai treni notturni in Europa') + '.'],
      ['h2', '5. Treni regionali e autobus per i buchi'],
      ['p', 'Non tutte le tappe richiedono un treno veloce. I regionali costano di solito meno e non richiedono prenotazione, e su alcuni tragitti brevi sono quasi altrettanto rapidi. Dove non c’è un treno diretto, un autobus può coprire il buco: Omio mostra treni e autobus per lo stesso percorso, così puoi confrontarli fianco a fianco.'],
      ['h2', '6. Pass o biglietti singoli?'],
      ['p', 'Un pass conviene se viaggi molto, per molti giorni, e vuoi flessibilità. Per un percorso con poche tappe lunghe prenotate in anticipo, i biglietti singoli di solito costano meno. Fai i conti con il nostro confronto: ' + link('/it/blog-eurail-pass-vs-point-to-point.html', 'pass ferroviario o biglietti singoli') + '.'],
      ['h2', '7. Uno sconto in più sulla prima prenotazione'],
      ['p', 'Se non hai mai prenotato con Omio, il codice <strong>NEW10</strong> ti dà il 10 % sulla prima prenotazione, fino a 80 €, fino al 30 novembre 2026.'],
      ['h2', 'Promemoria veloce'],
      ['ul', ['Ordina le città lungo le linee principali.', 'Segna quando aprono le tariffe economiche di ogni tappa e prenota quel giorno.', 'Confronta un biglietto unico con due biglietti separati.', 'Lascia almeno un’ora tra due biglietti separati.', 'Usa un treno notturno per la tappa più lunga.', 'Consulta le nostre tabelle di dati aperti: ' + TABLES.it.map((h, i) => link(h, ['Austria', 'Svizzera', 'Norvegia', 'Svezia', 'Finlandia'][i])).join(', ') + '.']],
      ['cta', 'Vienna → Salisburgo · Confronta su Omio', 'Treni e autobus, prezzi e orari', 'vienna', 'salzburg'],
      ['cta', 'Zurigo → Lucerna · Confronta su Omio', 'Treni e autobus, prezzi e orari', 'zurich', 'lucerne']
    ],
    ctaTitle: 'Pianifica tutto il percorso in una volta.', ctaText: 'Descrivi il tuo viaggio e WoW Train suggerisce i treni di ogni tappa, con i link per prenotare.', ctaBtn: 'Pianifica il mio viaggio →',
    relTitle: 'Guide ai percorsi correlate', relMore: 'Altre tratte in treno in Europa →'
  },
  ja: {
    title: 'ヨーロッパの複数の国を列車で安く旅する方法',
    desc: 'ヨーロッパ周遊の鉄道旅を予算内で計画する方法。幹線に沿って都市を並べ、国境で切符を分け、割引運賃を早めに買い、夜行列車を使う。実際の所要時間つき。',
    kw: 'ヨーロッパ 鉄道 安く, ヨーロッパ周遊 列車, ヨーロッパ 鉄道旅 節約, 早割 運賃, 分割購入 切符, バックパッカー ヨーロッパ 列車',
    tag: '節約', meta: 'WoW Train · 2026年10月 · 7分で読めます', back: 'すべての記事', bc: ['ホーム', 'ブログ'],
    alt: ['駅のホームでスマートフォンを確認する2人のバックパッカー。', 'スマートフォンで列車を調べるバックパックの旅行者。', '駅でスマートフォンを手にほほえむバックパックの旅行者。'],
    lead: '列車で複数の国をめぐる旅は、高くなるとは限りません。節約の大部分は魔法のような割引ではなく、ルートの組み方から生まれます。都市の順番、切符を分ける場所、そして買うタイミングです。このガイドでは、オーストリアとスイスのオープンデータ時刻表から得た実際の所要時間を使います。',
    blocks: [
      ['h2', '1. 都市を路線の順に並べる'],
      ['p', '幹線に沿ってルートを描き、行ったり来たりを避けましょう。アルプスを抜ける定番の例：ウィーン → ザルツブルク → インスブルック → チューリッヒ → ルツェルン → ジュネーヴ。どの区間も直通列車で、ほとんどが短時間です。'],
      ['ul', ['<strong>ウィーン – ザルツブルク：</strong>最速2時間25分、平日の直通列車43本。', '<strong>ザルツブルク – インスブルック：</strong>2時間00分、直通19本。', '<strong>チューリッヒ – ルツェルン：</strong>41分、直通40本。', '<strong>ベルン – ジュネーヴ：</strong>1時間51分、直通30本。']],
      ['p', '本数の多い短い区間は、予定が変わっても調整しやすく、各都市を観光する時間も残せます。各区間の始発・終電は' + link('/ja/austria-trains/', 'オーストリア') + 'と' + link('/ja/swiss-trains/', 'スイス') + 'の時刻表で確認できます。'],
      ['h2', '2. 割引運賃は発売日に買う'],
      ['p', '各国の鉄道会社は1本の列車ごとに安い切符を限られた数だけ販売し、それから売り切れていきます。運行会社が公表している発売時期は次のとおりです。'],
      ['ul', ['<strong>オーストリア（ÖBB Sparschiene）：</strong>最大6か月前から。夜行列車Nightjetは最大360日前から。予約した列車のみ有効。', '<strong>スイス（SBB Supersaver）：</strong>最大6か月前から。12月のダイヤ改正後の旅行分は、新しい時刻表が公表される6月末ごろに発売。', '<strong>ドイツ（DB Sparpreis）：</strong>最大12か月前から。']],
      ['p', '割引運賃は特定の列車に限られます。遅れで次の列車に乗り遅れた場合の扱いは、出発前に切符の条件を確認してください。'],
      ['h2', '3. 安くなるなら国境で切符を分ける'],
      ['p', '出発地から目的地まで1枚の切符が、いつも最安とは限りません。国ごとに2枚に分けたほうが安いこともあります。同じ列車で両方を比べましょう。注意点：別々の切符では、最初の列車が遅れて次に乗り遅れても、2社目の会社に振り替えの義務はありません。乗り換えには少なくとも1時間の余裕をとるか、接続がきつい場合は通しの切符にしましょう。'],
      ['h2', '4. 夜行列車をホテル代わりに'],
      ['p', '夜行列車は寝ている間に長距離を移動し、1泊分の宿代が浮きます。長い区間では、昼の列車とホテル代を合わせるより、クシェット（簡易寝台）のほうが安いことがよくあります。夜行列車は早く売り切れるため、発売もかなり前から始まります。' + link('/ja/blog-night-trains-europe.html', 'ヨーロッパの夜行列車ガイド') + 'もどうぞ。'],
      ['h2', '5. すき間は地域列車とバスで'],
      ['p', 'すべての区間に高速列車が必要なわけではありません。地域列車はたいてい安く予約も不要で、短い区間ならほとんど同じ速さのこともあります。直通列車がない区間はバスで補えます。Omioでは同じルートの列車とバスを並べて比べられます。'],
      ['h2', '6. パスか、区間ごとの切符か'],
      ['p', 'パスは、多くの日数でたくさん乗り、柔軟に動きたい人に向いています。早めに予約する長い区間がいくつかあるだけなら、区間ごとの切符のほうが安いことが多いです。比較記事で計算してみましょう：' + link('/ja/blog-eurail-pass-vs-point-to-point.html', '鉄道パスと区間切符の比較') + '。'],
      ['h2', '7. 初回予約のもうひとつの割引'],
      ['p', 'Omioを初めて使うなら、コード<strong>NEW10</strong>で初回予約が10％割引（上限80ユーロ、2026年11月30日まで）になります。'],
      ['h2', 'チェックリスト'],
      ['ul', ['都市を幹線に沿って並べる。', '各区間の割引運賃の発売日を控え、その日に買う。', '通しの切符と2枚の別切符を比べる。', '別切符のあいだには少なくとも1時間あける。', 'いちばん長い区間は夜行列車にする。', 'オープンデータの時刻表を確認：' + TABLES.ja.map((h, i) => link(h, ['オーストリア', 'スイス', 'ノルウェー', 'スウェーデン', 'フィンランド'][i])).join('、') + '。']],
      ['cta', 'ウィーン → ザルツブルク · Omioで比較', '列車とバス、料金と時刻', 'vienna', 'salzburg'],
      ['cta', 'チューリッヒ → ルツェルン · Omioで比較', '列車とバス、料金と時刻', 'zurich', 'lucerne']
    ],
    ctaTitle: 'ルート全体をまとめて計画。', ctaText: '旅の内容を入力すると、WoW Trainが各区間の列車と予約リンクを提案します。', ctaBtn: '旅を計画する →',
    relTitle: '関連する路線ガイド', relMore: 'ヨーロッパの鉄道路線をもっと見る →'
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
  // los botones de Omio van arriba (tras la introducción y las fotos), no al final
  const render = b => {
    if (b[0] === 'h2') return `    <h2>${b[1]}</h2>`;
    if (b[0] === 'p') return `    <p>\n      ${b[1]}\n    </p>`;
    if (b[0] === 'ul') return `    <ul>\n${b[1].map(x => `      <li>${x}</li>`).join('\n')}\n    </ul>`;
    if (b[0] === 'cta') return `    <a href="${API}/europe-train?from=${b[3]}&amp;to=${b[4]}&amp;src=blog_ahorro&amp;lang=${OMIO_LANG[l]}" class="klook-cta" target="_blank" rel="noopener sponsored" onclick="try{gtag('event','omio_click',{source:'blog_ahorro_${l}',route:'${b[3]}-${b[4]}'})}catch(e){}">
      <img class="klook-logo" src="https://www.google.com/s2/favicons?sz=64&domain=omio.com" alt="Omio" loading="lazy" style="width:36px;height:36px;border-radius:8px;flex-shrink:0;">
      <span class="klook-cta-text">
        <span class="klook-cta-title">${b[1]}</span>
        <span class="klook-cta-sub">${b[2]}</span>
      </span>
      <span class="klook-cta-arrow">→</span>
    </a>`;
  };
  const ctaBlocks = c.blocks.filter(b => b[0] === 'cta').map(render).join('\n\n');
  const blocks = c.blocks.filter(b => b[0] !== 'cta').map(render).join('\n\n');
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

${ctaBlocks}

${blocks}

    <hr/>

    <div class="cta">
      <h3>${c.ctaTitle}</h3>
      <p>${c.ctaText}</p>
      <a href="${pre}/#aiPlanner" class="cta-btn">${c.ctaBtn}</a>
    </div>
  </main>

    <section class="related-routes" aria-label="${esc(c.relTitle)}">
      <h2>${c.relTitle}</h2>
      <ul>
${rel}
      </ul>
      <p><a href="${pre}/rutas/">${c.relMore}</a></p>
    </section>

  `;
}

function build(l) {
  const c = C[l];
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

// Marca: une WoW Train con glosx.app en títulos y datos estructurados (idempotente)
// OJO: apply-brand-* recorren TODO el sitio y tocan ~110 archivos ajenos; tras correr, dejar solo los archivos de este artículo.
require('./apply-brand-title').run();
require('./apply-brand-schema').run();
