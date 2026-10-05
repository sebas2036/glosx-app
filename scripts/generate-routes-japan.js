#!/usr/bin/env node
/**
 * Páginas de ruta de Japón (/rutas/<slug>/ + es/fr/it), con texto propio por ruta.
 * Reutiliza la cabecera, estilos, nav y pie de scripts/route-template.html.
 * Duraciones y trenes: datos de Klook (consulta 05-oct-2026, salida 20-oct). Sin precios.
 * Uso: node scripts/generate-routes-japan.js [slug]
 */
const fs = require('fs');
const path = require('path');

const LANGS = ['en', 'es', 'fr', 'it'];
const SUFFIX = { en: '/', es: '/es/', fr: '/fr/', it: '/it/' };
const LANG_LABELS = { en: 'EN', es: 'ES', fr: 'FR', it: 'IT' };
const LANG_NAMES = { en: 'English', es: 'Español', fr: 'Français', it: 'Italiano' };
const BC = {
  en: { home: 'Home', routes: 'Routes' }, es: { home: 'Inicio', routes: 'Rutas' },
  fr: { home: 'Accueil', routes: 'Itinéraires' }, it: { home: 'Home', routes: 'Percorsi' }
};
const UI = {
  en: { back: 'All routes', badge: 'Route guide · Japan', meta: 'By WoW Train · Updated October 2026 · 4 min read', btn: 'Book Ticket',
    cta: (a, b) => `Check times and book <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> on Klook`,
    sub: 'Live schedule for your date · fares change daily', facts: 'Key facts', choose: 'Which train to take', tips: 'Tips before you go',
    faq: 'Frequently asked questions', more: 'More train routes in Japan', ready: 'Ready to go? See today\'s times and fares and book your seat on Klook.', note: 'Opens in a new tab', cmp: 'Compare times and fares:', check: 'Check schedules' },
  es: { back: 'Todas las rutas', badge: 'Guía de ruta · Japón', meta: 'Por WoW Train · Actualizado octubre 2026 · 4 min de lectura', btn: 'Reservar',
    cta: (a, b) => `Consulta horarios y reserva <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> en Klook`,
    sub: 'Horario en vivo para tu fecha · las tarifas cambian a diario', facts: 'Datos clave', choose: 'Qué tren elegir', tips: 'Consejos antes de viajar',
    faq: 'Preguntas frecuentes', more: 'Más rutas de tren en Japón', ready: '¿Listo para viajar? Consulta los horarios y tarifas de hoy y reserva tu asiento en Klook.', note: 'Se abre en una pestaña nueva', cmp: 'Compara horarios y tarifas:', check: 'Ver horarios' },
  fr: { back: 'Tous les itinéraires', badge: 'Guide d\'itinéraire · Japon', meta: 'Par WoW Train · Mis à jour en octobre 2026 · 4 min de lecture', btn: 'Réserver',
    cta: (a, b) => `Consultez les horaires et réservez <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> sur Klook`,
    sub: 'Horaires en direct pour votre date · les tarifs changent chaque jour', facts: 'L\'essentiel', choose: 'Quel train choisir', tips: 'Conseils avant de partir',
    faq: 'Questions fréquentes', more: 'Plus d\'itinéraires de train au Japon', ready: 'Prêt à partir ? Consultez les horaires et tarifs du jour et réservez votre place sur Klook.', note: 'S\'ouvre dans un nouvel onglet', cmp: 'Comparez horaires et tarifs :', check: 'Voir les horaires' },
  it: { back: 'Tutti i percorsi', badge: 'Guida al percorso · Giappone', meta: 'Di WoW Train · Aggiornato a ottobre 2026 · 4 min di lettura', btn: 'Prenota',
    cta: (a, b) => `Controlla gli orari e prenota <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> su Klook`,
    sub: 'Orari in tempo reale per la tua data · le tariffe cambiano ogni giorno', facts: 'Dati essenziali', choose: 'Quale treno scegliere', tips: 'Consigli prima di partire',
    faq: 'Domande frequenti', more: 'Altri percorsi in treno in Giappone', ready: 'Pronto a partire? Guarda gli orari e le tariffe di oggi e prenota il tuo posto su Klook.', note: 'Si apre in una nuova scheda', cmp: 'Confronta orari e tariffe:', check: 'Vedi gli orari' }
};

const ROUTES = [
  {
    slug: 'tokyo-kyoto', photo: 23345456, fromKey: 'tokyo', toKey: 'kyoto',
    from: { en: 'Tokyo', es: 'Tokio', fr: 'Tokyo', it: 'Tokyo' },
    to: { en: 'Kyoto', es: 'Kioto', fr: 'Kyoto', it: 'Kyoto' },
    seo: {
      en: { title: 'Tokyo to Kyoto by Train: 2h07 on the Nozomi Shinkansen', description: 'Tokyo to Kyoto by Shinkansen in about 2h07. Which train to pick (Nozomi, Hikari, Kodama), the seat for Mount Fuji views and how to book.' },
      es: { title: 'Tren de Tokio a Kioto: 2 h 07 en Shinkansen Nozomi', description: 'De Tokio a Kioto en Shinkansen en unas 2 h 07. Qué tren elegir (Nozomi, Hikari, Kodama), el asiento para ver el Fuji y cómo reservar.' },
      fr: { title: 'Train Tokyo Kyoto : 2 h 07 en Shinkansen Nozomi', description: 'De Tokyo à Kyoto en Shinkansen en environ 2 h 07. Quel train choisir (Nozomi, Hikari, Kodama), la place pour voir le mont Fuji et comment réserver.' },
      it: { title: 'Treno Tokyo Kyoto: 2h07 in Shinkansen Nozomi', description: 'Da Tokyo a Kyoto in Shinkansen in circa 2h07. Quale treno scegliere (Nozomi, Hikari, Kodama), il posto per vedere il Fuji e come prenotare.' }
    },
    lead: {
      en: 'The Tokaido Shinkansen links Tokyo and Kyoto in about 2 hours 7 minutes on the fastest service, the Nozomi. It is the classic first leg of a trip through Japan, and trains leave every few minutes.',
      es: 'El Shinkansen Tokaido une Tokio y Kioto en unas 2 horas y 7 minutos en el servicio más rápido, el Nozomi. Es el primer tramo clásico de un viaje por Japón, y hay salidas cada pocos minutos.',
      fr: 'Le Shinkansen Tokaido relie Tokyo et Kyoto en environ 2 h 07 avec le service le plus rapide, le Nozomi. C\'est le premier trajet classique d\'un voyage au Japon, avec un départ toutes les quelques minutes.',
      it: 'Lo Shinkansen Tokaido collega Tokyo e Kyoto in circa 2 ore e 7 minuti con il servizio più veloce, il Nozomi. È la prima tratta classica di un viaggio in Giappone, con partenze ogni pochi minuti.'
    },
    facts: {
      en: ['Fastest journey: about 2h07 (Nozomi).', 'Other trains: Hikari in roughly 2h40, Kodama in close to 4 hours.', 'Stations: Tokyo Station to Kyoto Station, about 510 km.', 'Direct, with no change of train.'],
      es: ['Trayecto más rápido: unas 2 h 07 (Nozomi).', 'Otros trenes: Hikari en aproximadamente 2 h 40 y Kodama en casi 4 horas.', 'Estaciones: de la estación de Tokio a la estación de Kioto, unos 510 km.', 'Directo, sin cambio de tren.'],
      fr: ['Trajet le plus rapide : environ 2 h 07 (Nozomi).', 'Autres trains : Hikari en 2 h 40 environ, Kodama en près de 4 heures.', 'Gares : de Tokyo Station à Kyoto Station, environ 510 km.', 'Direct, sans changement.'],
      it: ['Viaggio più veloce: circa 2h07 (Nozomi).', 'Altri treni: Hikari in circa 2h40, Kodama in quasi 4 ore.', 'Stazioni: da Tokyo Station a Kyoto Station, circa 510 km.', 'Diretto, senza cambi.']
    },
    choose: {
      en: 'The Nozomi is the fastest and the one most people take. The Hikari is slightly slower and makes a few more stops. The Kodama stops at every station and only makes sense if you are getting off at a small town along the way. Note that the Japan Rail Pass does not cover the Nozomi: with the pass you ride the Hikari or the Kodama.',
      es: 'El Nozomi es el más rápido y el que usa la mayoría. El Hikari es algo más lento y hace unas paradas más. El Kodama para en todas las estaciones y solo tiene sentido si bajas en un pueblo intermedio. Ten en cuenta que el Japan Rail Pass no cubre el Nozomi: con el pase se viaja en Hikari o Kodama.',
      fr: 'Le Nozomi est le plus rapide et celui que prend la plupart des voyageurs. Le Hikari est un peu plus lent, avec quelques arrêts de plus. Le Kodama s\'arrête dans toutes les gares et n\'a d\'intérêt que si vous descendez dans une petite ville en chemin. Le Japan Rail Pass ne couvre pas le Nozomi : avec le pass, on prend le Hikari ou le Kodama.',
      it: 'Il Nozomi è il più veloce e quello scelto dalla maggior parte dei viaggiatori. L\'Hikari è un po\' più lento e ha qualche fermata in più. Il Kodama ferma in tutte le stazioni e ha senso solo se scendi in una cittadina lungo il percorso. Il Japan Rail Pass non copre il Nozomi: con il pass si viaggia in Hikari o Kodama.'
    },
    tips: {
      en: ['For views of Mount Fuji, ask for a window seat on the right-hand side heading to Kyoto (seat E) and look out about 40 minutes after leaving Tokyo, weather permitting.', 'Suitcases with a total size between 160 and 250 cm need a reserved seat with oversized baggage space, so book that in advance.', 'Reserved seats are the safe choice in busy periods such as Golden Week, the summer holidays and the cherry blossom season.'],
      es: ['Para ver el monte Fuji, pide un asiento de ventanilla del lado derecho en el sentido a Kioto (asiento E) y mira por la ventana unos 40 minutos después de salir de Tokio, si el tiempo lo permite.', 'Las maletas de entre 160 y 250 cm de tamaño total necesitan un asiento reservado con espacio para equipaje voluminoso, así que resérvalo con antelación.', 'El asiento reservado es la opción segura en épocas de mucha demanda, como la Golden Week, las vacaciones de verano y la temporada de los cerezos en flor.'],
      fr: ['Pour voir le mont Fuji, demandez une place côté fenêtre à droite dans le sens de Kyoto (siège E) et regardez dehors environ 40 minutes après le départ de Tokyo, si la météo le permet.', 'Les valises dont la somme des dimensions est comprise entre 160 et 250 cm exigent une place réservée avec espace pour bagage volumineux ; réservez-la à l\'avance.', 'La place réservée est le choix prudent en période de forte affluence : Golden Week, vacances d\'été et saison des cerisiers en fleurs.'],
      it: ['Per vedere il monte Fuji, chiedi un posto finestrino sul lato destro in direzione Kyoto (posto E) e guarda fuori circa 40 minuti dopo la partenza da Tokyo, se il tempo lo permette.', 'I bagagli con dimensioni totali tra 160 e 250 cm richiedono un posto prenotato con spazio per bagagli voluminosi, quindi prenotalo in anticipo.', 'Il posto prenotato è la scelta sicura nei periodi di grande affluenza, come la Golden Week, le vacanze estive e la stagione dei ciliegi in fiore.']
    },
    faqs: {
      en: [['How long does the Tokyo to Kyoto Shinkansen take?', 'The fastest train, the Nozomi, takes about 2 hours 7 minutes. The Hikari takes roughly 2 hours 40 minutes and the Kodama close to 4 hours.'],
        ['Is there a direct train from Tokyo to Kyoto?', 'Yes. The Tokaido Shinkansen runs directly from Tokyo Station to Kyoto Station with no change.'],
        ['Does the Japan Rail Pass cover the Tokyo to Kyoto train?', 'It covers the Hikari and the Kodama, but not the Nozomi, which is the fastest service.']],
      es: [['¿Cuánto tarda el Shinkansen de Tokio a Kioto?', 'El tren más rápido, el Nozomi, tarda unas 2 horas y 7 minutos. El Hikari tarda aproximadamente 2 horas y 40 minutos y el Kodama casi 4 horas.'],
        ['¿Hay tren directo de Tokio a Kioto?', 'Sí. El Shinkansen Tokaido va directo de la estación de Tokio a la estación de Kioto, sin cambios.'],
        ['¿El Japan Rail Pass cubre el tren de Tokio a Kioto?', 'Cubre el Hikari y el Kodama, pero no el Nozomi, que es el servicio más rápido.']],
      fr: [['Combien de temps dure le Shinkansen de Tokyo à Kyoto ?', 'Le train le plus rapide, le Nozomi, met environ 2 h 07. Le Hikari met environ 2 h 40 et le Kodama près de 4 heures.'],
        ['Y a-t-il un train direct de Tokyo à Kyoto ?', 'Oui. Le Shinkansen Tokaido relie directement Tokyo Station à Kyoto Station, sans changement.'],
        ['Le Japan Rail Pass couvre-t-il le train Tokyo Kyoto ?', 'Il couvre le Hikari et le Kodama, mais pas le Nozomi, qui est le service le plus rapide.']],
      it: [['Quanto dura lo Shinkansen da Tokyo a Kyoto?', 'Il treno più veloce, il Nozomi, impiega circa 2 ore e 7 minuti. L\'Hikari circa 2 ore e 40 minuti e il Kodama quasi 4 ore.'],
        ['C\'è un treno diretto da Tokyo a Kyoto?', 'Sì. Lo Shinkansen Tokaido va direttamente da Tokyo Station a Kyoto Station, senza cambi.'],
        ['Il Japan Rail Pass copre il treno Tokyo Kyoto?', 'Copre l\'Hikari e il Kodama, ma non il Nozomi, che è il servizio più veloce.']]
    }
  },
  {
    slug: 'tokyo-osaka', photo: 27666787, fromKey: 'tokyo', toKey: 'osaka',
    from: { en: 'Tokyo', es: 'Tokio', fr: 'Tokyo', it: 'Tokyo' },
    to: { en: 'Osaka', es: 'Osaka', fr: 'Osaka', it: 'Osaka' },
    seo: {
      en: { title: 'Tokyo to Osaka by Train: 2h21 on the Nozomi Shinkansen', description: 'Tokyo to Osaka by Shinkansen in about 2h21. Why you arrive at Shin-Osaka, which train to choose and how to book your seat.' },
      es: { title: 'Tren de Tokio a Osaka: 2 h 21 en Shinkansen Nozomi', description: 'De Tokio a Osaka en Shinkansen en unas 2 h 21. Por qué llegas a Shin-Osaka, qué tren elegir y cómo reservar tu asiento.' },
      fr: { title: 'Train Tokyo Osaka : 2 h 21 en Shinkansen Nozomi', description: 'De Tokyo à Osaka en Shinkansen en environ 2 h 21. Pourquoi on arrive à Shin-Osaka, quel train choisir et comment réserver.' },
      it: { title: 'Treno Tokyo Osaka: 2h21 in Shinkansen Nozomi', description: 'Da Tokyo a Osaka in Shinkansen in circa 2h21. Perché si arriva a Shin-Osaka, quale treno scegliere e come prenotare il posto.' }
    },
    lead: {
      en: 'The Tokyo to Osaka Shinkansen takes about 2 hours 21 minutes on the Nozomi, the fastest service. It is the same Tokaido line that goes through Kyoto, so it also works as a base for seeing both cities.',
      es: 'El Shinkansen de Tokio a Osaka tarda unas 2 horas y 21 minutos en el Nozomi, el servicio más rápido. Es la misma línea Tokaido que pasa por Kioto, así que sirve también como base para conocer las dos ciudades.',
      fr: 'Le Shinkansen de Tokyo à Osaka met environ 2 h 21 avec le Nozomi, le service le plus rapide. C\'est la même ligne Tokaido qui passe par Kyoto, ce qui permet aussi de visiter les deux villes.',
      it: 'Lo Shinkansen da Tokyo a Osaka impiega circa 2 ore e 21 minuti con il Nozomi, il servizio più veloce. È la stessa linea Tokaido che passa per Kyoto, quindi è anche una base per visitare entrambe le città.'
    },
    facts: {
      en: ['Fastest journey: about 2h21 (Nozomi).', 'Other trains: Hikari and Kodama, slower because they stop more often.', 'The Tokaido Shinkansen ends at Shin-Osaka, not at Osaka Station.', 'Direct, with a train every few minutes.'],
      es: ['Trayecto más rápido: unas 2 h 21 (Nozomi).', 'Otros trenes: Hikari y Kodama, más lentos porque paran más.', 'El Shinkansen Tokaido termina en Shin-Osaka, no en la estación de Osaka.', 'Directo, con un tren cada pocos minutos.'],
      fr: ['Trajet le plus rapide : environ 2 h 21 (Nozomi).', 'Autres trains : Hikari et Kodama, plus lents car ils s\'arrêtent plus souvent.', 'Le Shinkansen Tokaido termine à Shin-Osaka, pas à la gare d\'Osaka.', 'Direct, avec un train toutes les quelques minutes.'],
      it: ['Viaggio più veloce: circa 2h21 (Nozomi).', 'Altri treni: Hikari e Kodama, più lenti perché fermano più spesso.', 'Lo Shinkansen Tokaido termina a Shin-Osaka, non alla stazione di Osaka.', 'Diretto, con un treno ogni pochi minuti.']
    },
    choose: {
      en: 'Take the Nozomi if you want the shortest trip. The Hikari adds a little time and the Kodama stops everywhere, so it is rarely worth it for this route. If you hold a Japan Rail Pass, remember it does not cover the Nozomi.',
      es: 'Toma el Nozomi si quieres el viaje más corto. El Hikari suma algo de tiempo y el Kodama para en todas partes, así que rara vez compensa en esta ruta. Si tienes el Japan Rail Pass, recuerda que no cubre el Nozomi.',
      fr: 'Prenez le Nozomi pour le trajet le plus court. Le Hikari ajoute un peu de temps et le Kodama s\'arrête partout, il est donc rarement utile sur cet itinéraire. Avec un Japan Rail Pass, rappelez-vous qu\'il ne couvre pas le Nozomi.',
      it: 'Prendi il Nozomi per il viaggio più breve. L\'Hikari aggiunge un po\' di tempo e il Kodama ferma ovunque, quindi su questa tratta raramente conviene. Se hai il Japan Rail Pass, ricorda che non copre il Nozomi.'
    },
    tips: {
      en: ['You arrive at Shin-Osaka. To reach Osaka Station, take the JR Kyoto Line for one stop, about 4 minutes.', 'Hotels in the Umeda area are next to Osaka Station; hotels in Namba need a further subway ride.', 'On the way out of Tokyo, a window seat on the right-hand side (seat E) gives you a chance to see Mount Fuji.'],
      es: ['Llegas a Shin-Osaka. Para ir a la estación de Osaka, toma la línea JR Kioto una parada, unos 4 minutos.', 'Los hoteles de la zona de Umeda están junto a la estación de Osaka; los de Namba requieren un trayecto más en metro.', 'Al salir de Tokio, un asiento de ventanilla del lado derecho (asiento E) te da opciones de ver el monte Fuji.'],
      fr: ['Vous arrivez à Shin-Osaka. Pour rejoindre la gare d\'Osaka, prenez la ligne JR Kyoto sur un arrêt, environ 4 minutes.', 'Les hôtels du quartier d\'Umeda sont à côté de la gare d\'Osaka ; ceux de Namba demandent un trajet de métro de plus.', 'En sortant de Tokyo, une place côté fenêtre à droite (siège E) vous donne une chance d\'apercevoir le mont Fuji.'],
      it: ['Arrivi a Shin-Osaka. Per raggiungere la stazione di Osaka, prendi la linea JR Kyoto per una fermata, circa 4 minuti.', 'Gli hotel della zona di Umeda sono accanto alla stazione di Osaka; quelli di Namba richiedono un altro tratto di metropolitana.', 'Uscendo da Tokyo, un posto finestrino sul lato destro (posto E) ti dà la possibilità di vedere il monte Fuji.']
    },
    faqs: {
      en: [['How long is the train from Tokyo to Osaka?', 'The Nozomi Shinkansen takes about 2 hours 21 minutes. The Hikari and the Kodama take longer.'],
        ['Which station do I arrive at in Osaka?', 'The Tokaido Shinkansen arrives at Shin-Osaka. From there, Osaka Station is one stop away on the JR Kyoto Line.'],
        ['Is there a direct train from Tokyo to Osaka?', 'Yes, the Shinkansen runs directly with no change and leaves every few minutes.']],
      es: [['¿Cuánto dura el tren de Tokio a Osaka?', 'El Shinkansen Nozomi tarda unas 2 horas y 21 minutos. El Hikari y el Kodama tardan más.'],
        ['¿A qué estación llego en Osaka?', 'El Shinkansen Tokaido llega a Shin-Osaka. Desde allí, la estación de Osaka queda a una parada en la línea JR Kioto.'],
        ['¿Hay tren directo de Tokio a Osaka?', 'Sí, el Shinkansen va directo, sin cambios, y sale cada pocos minutos.']],
      fr: [['Combien de temps dure le train de Tokyo à Osaka ?', 'Le Shinkansen Nozomi met environ 2 h 21. Le Hikari et le Kodama sont plus longs.'],
        ['À quelle gare arrive-t-on à Osaka ?', 'Le Shinkansen Tokaido arrive à Shin-Osaka. De là, la gare d\'Osaka est à un arrêt sur la ligne JR Kyoto.'],
        ['Y a-t-il un train direct de Tokyo à Osaka ?', 'Oui, le Shinkansen est direct, sans changement, avec un départ toutes les quelques minutes.']],
      it: [['Quanto dura il treno da Tokyo a Osaka?', 'Lo Shinkansen Nozomi impiega circa 2 ore e 21 minuti. L\'Hikari e il Kodama sono più lenti.'],
        ['A quale stazione arrivo a Osaka?', 'Lo Shinkansen Tokaido arriva a Shin-Osaka. Da lì, la stazione di Osaka è a una fermata sulla linea JR Kyoto.'],
        ['C\'è un treno diretto da Tokyo a Osaka?', 'Sì, lo Shinkansen è diretto, senza cambi, con una partenza ogni pochi minuti.']]
    }
  },
  {
    slug: 'osaka-kyoto', photo: 31385483, fromKey: 'osaka', toKey: 'kyoto',
    from: { en: 'Osaka', es: 'Osaka', fr: 'Osaka', it: 'Osaka' },
    to: { en: 'Kyoto', es: 'Kioto', fr: 'Kyoto', it: 'Kyoto' },
    seo: {
      en: { title: 'Osaka to Kyoto by Train: 13 min by Shinkansen', description: 'Osaka to Kyoto in 13 minutes by Shinkansen from Shin-Osaka, or about 30 minutes on the JR rapid train. Which one to take and how to book.' },
      es: { title: 'Tren de Osaka a Kioto: 13 min en Shinkansen', description: 'De Osaka a Kioto en 13 minutos en Shinkansen desde Shin-Osaka, o unos 30 minutos en el tren rápido JR. Cuál elegir y cómo reservar.' },
      fr: { title: 'Train Osaka Kyoto : 13 min en Shinkansen', description: 'D\'Osaka à Kyoto en 13 minutes en Shinkansen depuis Shin-Osaka, ou environ 30 minutes en train rapide JR. Lequel choisir et comment réserver.' },
      it: { title: 'Treno Osaka Kyoto: 13 min in Shinkansen', description: 'Da Osaka a Kyoto in 13 minuti in Shinkansen da Shin-Osaka, o circa 30 minuti sul treno rapido JR. Quale scegliere e come prenotare.' }
    },
    lead: {
      en: 'Osaka and Kyoto are so close that many travellers stay in one and visit the other as a day trip. The Shinkansen from Shin-Osaka takes 13 minutes, and the JR rapid train from Osaka Station takes about 30.',
      es: 'Osaka y Kioto están tan cerca que muchos viajeros se alojan en una y visitan la otra en el día. El Shinkansen desde Shin-Osaka tarda 13 minutos, y el tren rápido JR desde la estación de Osaka, unos 30.',
      fr: 'Osaka et Kyoto sont si proches que beaucoup de voyageurs logent dans l\'une et visitent l\'autre dans la journée. Le Shinkansen depuis Shin-Osaka met 13 minutes, et le train rapide JR depuis la gare d\'Osaka environ 30.',
      it: 'Osaka e Kyoto sono così vicine che molti viaggiatori alloggiano in una e visitano l\'altra in giornata. Lo Shinkansen da Shin-Osaka impiega 13 minuti, il treno rapido JR dalla stazione di Osaka circa 30.'
    },
    facts: {
      en: ['Shinkansen: 13 minutes from Shin-Osaka to Kyoto Station.', 'JR rapid train (Special Rapid Service): about 30 minutes from Osaka Station.', 'Direct on both options, with frequent departures.', 'The Shinkansen needs its own ticket; the rapid train is cheaper and needs no seat reservation.'],
      es: ['Shinkansen: 13 minutos de Shin-Osaka a la estación de Kioto.', 'Tren rápido JR (Special Rapid Service): unos 30 minutos desde la estación de Osaka.', 'Directo en ambas opciones, con salidas frecuentes.', 'El Shinkansen requiere su propio billete; el tren rápido es más barato y no necesita reserva de asiento.'],
      fr: ['Shinkansen : 13 minutes de Shin-Osaka à Kyoto Station.', 'Train rapide JR (Special Rapid Service) : environ 30 minutes depuis la gare d\'Osaka.', 'Direct dans les deux cas, avec des départs fréquents.', 'Le Shinkansen demande son propre billet ; le train rapide est moins cher et sans réservation de place.'],
      it: ['Shinkansen: 13 minuti da Shin-Osaka a Kyoto Station.', 'Treno rapido JR (Special Rapid Service): circa 30 minuti dalla stazione di Osaka.', 'Diretto in entrambi i casi, con partenze frequenti.', 'Lo Shinkansen richiede un biglietto a parte; il treno rapido costa meno e non richiede prenotazione del posto.']
    },
    choose: {
      en: 'If your hotel is near Osaka Station and you are not in a hurry, the JR rapid train is the simple option: it is cheaper and you can just turn up. The Shinkansen only makes sense if you start from Shin-Osaka, for example when connecting from another Shinkansen, because the time saved is small once you add the trip to that station.',
      es: 'Si tu hotel está cerca de la estación de Osaka y no tienes prisa, el tren rápido JR es la opción sencilla: es más barato y basta con presentarse. El Shinkansen solo compensa si sales de Shin-Osaka, por ejemplo al enlazar con otro Shinkansen, porque el tiempo que ganas es poco si hay que ir hasta esa estación.',
      fr: 'Si votre hôtel est près de la gare d\'Osaka et que vous n\'êtes pas pressé, le train rapide JR est l\'option simple : il est moins cher et on peut simplement se présenter. Le Shinkansen n\'a d\'intérêt que si vous partez de Shin-Osaka, par exemple en correspondance avec un autre Shinkansen, car le gain de temps est faible une fois ajouté le trajet jusqu\'à cette gare.',
      it: 'Se il tuo hotel è vicino alla stazione di Osaka e non hai fretta, il treno rapido JR è la scelta semplice: costa meno e basta presentarsi. Lo Shinkansen conviene solo se parti da Shin-Osaka, ad esempio in coincidenza con un altro Shinkansen, perché il tempo risparmiato è poco se devi raggiungere quella stazione.'
    },
    tips: {
      en: ['Kyoto Station is not in the old town. From there, buses and the subway take you to the main sights.', 'For a day trip, leave Osaka early: the most popular temples are quieter in the morning.', 'There are also private railway lines between the two cities, which stop closer to the centres but are separate from the JR network.'],
      es: ['La estación de Kioto no está en el casco antiguo. Desde allí, autobuses y metro te llevan a los principales lugares de interés.', 'Si vas por el día, sal temprano de Osaka: los templos más visitados están más tranquilos por la mañana.', 'También hay líneas ferroviarias privadas entre las dos ciudades, que paran más cerca de los centros pero son independientes de la red JR.'],
      fr: ['La gare de Kyoto n\'est pas dans la vieille ville. De là, bus et métro mènent aux principaux sites.', 'Pour une excursion à la journée, partez tôt d\'Osaka : les temples les plus visités sont plus calmes le matin.', 'Il existe aussi des lignes ferroviaires privées entre les deux villes, qui s\'arrêtent plus près des centres mais sont indépendantes du réseau JR.'],
      it: ['La stazione di Kyoto non è nel centro storico. Da lì, autobus e metropolitana portano ai luoghi principali.', 'Per una gita in giornata, parti presto da Osaka: i templi più visitati sono più tranquilli la mattina.', 'Esistono anche linee ferroviarie private tra le due città, che fermano più vicino ai centri ma sono indipendenti dalla rete JR.']
    },
    faqs: {
      en: [['How long does it take to get from Osaka to Kyoto by train?', 'The Shinkansen takes 13 minutes from Shin-Osaka. The JR rapid train from Osaka Station takes about 30 minutes.'],
        ['Is it worth taking the Shinkansen from Osaka to Kyoto?', 'Only if you start at Shin-Osaka. From Osaka Station the JR rapid train is usually simpler and cheaper.'],
        ['Can I visit Kyoto as a day trip from Osaka?', 'Yes. With trains this short and frequent, it is one of the most common day trips in Japan.']],
      es: [['¿Cuánto se tarda de Osaka a Kioto en tren?', 'El Shinkansen tarda 13 minutos desde Shin-Osaka. El tren rápido JR desde la estación de Osaka tarda unos 30 minutos.'],
        ['¿Vale la pena tomar el Shinkansen de Osaka a Kioto?', 'Solo si sales de Shin-Osaka. Desde la estación de Osaka, el tren rápido JR suele ser más sencillo y barato.'],
        ['¿Puedo visitar Kioto en el día desde Osaka?', 'Sí. Con trenes tan cortos y frecuentes, es una de las excursiones de un día más habituales de Japón.']],
      fr: [['Combien de temps faut-il pour aller d\'Osaka à Kyoto en train ?', 'Le Shinkansen met 13 minutes depuis Shin-Osaka. Le train rapide JR depuis la gare d\'Osaka met environ 30 minutes.'],
        ['Vaut-il la peine de prendre le Shinkansen d\'Osaka à Kyoto ?', 'Seulement si vous partez de Shin-Osaka. Depuis la gare d\'Osaka, le train rapide JR est souvent plus simple et moins cher.'],
        ['Peut-on visiter Kyoto dans la journée depuis Osaka ?', 'Oui. Avec des trains aussi courts et fréquents, c\'est l\'une des excursions à la journée les plus courantes au Japon.']],
      it: [['Quanto ci vuole da Osaka a Kyoto in treno?', 'Lo Shinkansen impiega 13 minuti da Shin-Osaka. Il treno rapido JR dalla stazione di Osaka circa 30 minuti.'],
        ['Conviene prendere lo Shinkansen da Osaka a Kyoto?', 'Solo se parti da Shin-Osaka. Dalla stazione di Osaka il treno rapido JR è di solito più semplice ed economico.'],
        ['Posso visitare Kyoto in giornata da Osaka?', 'Sì. Con treni così brevi e frequenti, è una delle gite in giornata più comuni in Giappone.']]
    }
  },
  {
    slug: 'kyoto-hiroshima', photo: 7204890, fromKey: 'kyoto', toKey: 'hiroshima',
    from: { en: 'Kyoto', es: 'Kioto', fr: 'Kyoto', it: 'Kyoto' },
    to: { en: 'Hiroshima', es: 'Hiroshima', fr: 'Hiroshima', it: 'Hiroshima' },
    seo: {
      en: { title: 'Kyoto to Hiroshima by Train: 1h36 by Shinkansen', description: 'Kyoto to Hiroshima by Shinkansen in about 1h36 with no change. Which train to pick, how to reach Miyajima and how to book.' },
      es: { title: 'Tren de Kioto a Hiroshima: 1 h 36 en Shinkansen', description: 'De Kioto a Hiroshima en Shinkansen en unas 1 h 36 sin cambios. Qué tren elegir, cómo llegar a Miyajima y cómo reservar.' },
      fr: { title: 'Train Kyoto Hiroshima : 1 h 36 en Shinkansen', description: 'De Kyoto à Hiroshima en Shinkansen en environ 1 h 36 sans changement. Quel train choisir, comment rejoindre Miyajima et comment réserver.' },
      it: { title: 'Treno Kyoto Hiroshima: 1h36 in Shinkansen', description: 'Da Kyoto a Hiroshima in Shinkansen in circa 1h36 senza cambi. Quale treno scegliere, come raggiungere Miyajima e come prenotare.' }
    },
    lead: {
      en: 'The Shinkansen from Kyoto to Hiroshima takes about 1 hour 36 minutes on the fastest service. Trains continue from the Tokaido line onto the Sanyo line, so you do not change at Shin-Osaka.',
      es: 'El Shinkansen de Kioto a Hiroshima tarda unas 1 hora y 36 minutos en el servicio más rápido. Los trenes pasan de la línea Tokaido a la línea Sanyo, así que no hay que cambiar en Shin-Osaka.',
      fr: 'Le Shinkansen de Kyoto à Hiroshima met environ 1 h 36 avec le service le plus rapide. Les trains passent de la ligne Tokaido à la ligne Sanyo, sans changement à Shin-Osaka.',
      it: 'Lo Shinkansen da Kyoto a Hiroshima impiega circa 1 ora e 36 minuti con il servizio più veloce. I treni passano dalla linea Tokaido alla linea Sanyo, quindi non si cambia a Shin-Osaka.'
    },
    facts: {
      en: ['Fastest journey: about 1h36 (Nozomi); the Hikari is a little slower.', 'Stations: Kyoto Station to Hiroshima Station.', 'Direct, with no change of train.', 'Several departures every hour during the day.'],
      es: ['Trayecto más rápido: unas 1 h 36 (Nozomi); el Hikari es algo más lento.', 'Estaciones: de la estación de Kioto a la estación de Hiroshima.', 'Directo, sin cambio de tren.', 'Varias salidas cada hora durante el día.'],
      fr: ['Trajet le plus rapide : environ 1 h 36 (Nozomi) ; le Hikari est un peu plus lent.', 'Gares : de Kyoto Station à Hiroshima Station.', 'Direct, sans changement.', 'Plusieurs départs par heure en journée.'],
      it: ['Viaggio più veloce: circa 1h36 (Nozomi); l\'Hikari è un po\' più lento.', 'Stazioni: da Kyoto Station a Hiroshima Station.', 'Diretto, senza cambi.', 'Diverse partenze ogni ora durante il giorno.']
    },
    choose: {
      en: 'The Nozomi is the fastest; the Hikari takes a little longer and is the one covered by the Japan Rail Pass. The difference between the two is small on this route, so choose by departure time rather than by train name.',
      es: 'El Nozomi es el más rápido; el Hikari tarda algo más y es el que cubre el Japan Rail Pass. La diferencia entre ambos es pequeña en esta ruta, así que elige por la hora de salida más que por el nombre del tren.',
      fr: 'Le Nozomi est le plus rapide ; le Hikari est un peu plus long et c\'est celui que couvre le Japan Rail Pass. L\'écart est faible sur cet itinéraire : choisissez selon l\'heure de départ plutôt que le nom du train.',
      it: 'Il Nozomi è il più veloce; l\'Hikari impiega un po\' di più ed è quello coperto dal Japan Rail Pass. La differenza è piccola su questa tratta, quindi scegli in base all\'orario di partenza più che al nome del treno.'
    },
    tips: {
      en: ['For Miyajima, take the JR Sanyo Line from Hiroshima to Miyajimaguchi (about 30 minutes) and then the ferry across (about 10 minutes).', 'The Peace Memorial Park is reachable from Hiroshima Station by streetcar.', 'If you are carrying large luggage, reserve a seat with oversized baggage space ahead of time.'],
      es: ['Para ir a Miyajima, toma la línea JR Sanyo de Hiroshima a Miyajimaguchi (unos 30 minutos) y luego el ferri (unos 10 minutos).', 'Al Parque de la Paz se llega desde la estación de Hiroshima en tranvía.', 'Si llevas equipaje grande, reserva con antelación un asiento con espacio para maletas voluminosas.'],
      fr: ['Pour Miyajima, prenez la ligne JR Sanyo de Hiroshima à Miyajimaguchi (environ 30 minutes), puis le ferry (environ 10 minutes).', 'On rejoint le parc du Mémorial de la Paix depuis la gare d\'Hiroshima en tramway.', 'Avec de gros bagages, réservez à l\'avance une place avec espace pour bagage volumineux.'],
      it: ['Per Miyajima, prendi la linea JR Sanyo da Hiroshima a Miyajimaguchi (circa 30 minuti) e poi il traghetto (circa 10 minuti).', 'Il Parco della Pace si raggiunge dalla stazione di Hiroshima in tram.', 'Se hai bagagli grandi, prenota in anticipo un posto con spazio per bagagli voluminosi.']
    },
    faqs: {
      en: [['How long is the train from Kyoto to Hiroshima?', 'The Nozomi Shinkansen takes about 1 hour 36 minutes. The Hikari takes a little longer.'],
        ['Do I have to change trains between Kyoto and Hiroshima?', 'No. The Shinkansen runs directly from Kyoto to Hiroshima.'],
        ['How do I get to Miyajima from Hiroshima?', 'Take the JR Sanyo Line to Miyajimaguchi, then the ferry to the island.']],
      es: [['¿Cuánto dura el tren de Kioto a Hiroshima?', 'El Shinkansen Nozomi tarda unas 1 hora y 36 minutos. El Hikari tarda algo más.'],
        ['¿Hay que cambiar de tren entre Kioto y Hiroshima?', 'No. El Shinkansen va directo de Kioto a Hiroshima.'],
        ['¿Cómo llego a Miyajima desde Hiroshima?', 'Toma la línea JR Sanyo hasta Miyajimaguchi y luego el ferri a la isla.']],
      fr: [['Combien de temps dure le train de Kyoto à Hiroshima ?', 'Le Shinkansen Nozomi met environ 1 h 36. Le Hikari est un peu plus long.'],
        ['Faut-il changer de train entre Kyoto et Hiroshima ?', 'Non. Le Shinkansen est direct de Kyoto à Hiroshima.'],
        ['Comment aller à Miyajima depuis Hiroshima ?', 'Prenez la ligne JR Sanyo jusqu\'à Miyajimaguchi, puis le ferry vers l\'île.']],
      it: [['Quanto dura il treno da Kyoto a Hiroshima?', 'Lo Shinkansen Nozomi impiega circa 1 ora e 36 minuti. L\'Hikari un po\' di più.'],
        ['Devo cambiare treno tra Kyoto e Hiroshima?', 'No. Lo Shinkansen va direttamente da Kyoto a Hiroshima.'],
        ['Come arrivo a Miyajima da Hiroshima?', 'Prendi la linea JR Sanyo fino a Miyajimaguchi, poi il traghetto per l\'isola.']]
    }
  },
  {
    slug: 'narita-tokyo', photo: 23344538, fromKey: 'narita', toKey: 'tokyo',
    from: { en: 'Narita Airport', es: 'Aeropuerto de Narita', fr: 'Aéroport de Narita', it: 'Aeroporto di Narita' },
    to: { en: 'Tokyo', es: 'Tokio', fr: 'Tokyo', it: 'Tokyo' },
    seo: {
      en: { title: 'Narita Airport to Tokyo by Train: Narita Express, 53 min', description: 'Narita Airport to Tokyo Station on the Narita Express in about 53 minutes. Stops, reserved seats, luggage and how to book.' },
      es: { title: 'Del aeropuerto de Narita a Tokio en tren: Narita Express, 53 min', description: 'Del aeropuerto de Narita a la estación de Tokio en el Narita Express en unos 53 minutos. Paradas, asientos reservados, equipaje y cómo reservar.' },
      fr: { title: 'De l\'aéroport de Narita à Tokyo en train : Narita Express, 53 min', description: 'De l\'aéroport de Narita à Tokyo Station en Narita Express en environ 53 minutes. Arrêts, places réservées, bagages et comment réserver.' },
      it: { title: 'Dall\'aeroporto di Narita a Tokyo in treno: Narita Express, 53 min', description: 'Dall\'aeroporto di Narita a Tokyo Station con il Narita Express in circa 53 minuti. Fermate, posti prenotati, bagagli e come prenotare.' }
    },
    lead: {
      en: 'The Narita Express is the JR train that connects Narita Airport with central Tokyo. It reaches Tokyo Station in about 53 minutes, and it also continues to Shinagawa, Shibuya, Shinjuku and Yokohama without a change.',
      es: 'El Narita Express es el tren de JR que conecta el aeropuerto de Narita con el centro de Tokio. Llega a la estación de Tokio en unos 53 minutos y además continúa a Shinagawa, Shibuya, Shinjuku y Yokohama sin cambio.',
      fr: 'Le Narita Express est le train JR qui relie l\'aéroport de Narita au centre de Tokyo. Il atteint Tokyo Station en environ 53 minutes et poursuit vers Shinagawa, Shibuya, Shinjuku et Yokohama sans changement.',
      it: 'Il Narita Express è il treno JR che collega l\'aeroporto di Narita con il centro di Tokyo. Arriva a Tokyo Station in circa 53 minuti e prosegue per Shinagawa, Shibuya, Shinjuku e Yokohama senza cambi.'
    },
    facts: {
      en: ['To Tokyo Station: about 53 minutes.', 'Other direct destinations: Shinagawa about 62 minutes, Shinjuku about 78, Yokohama about 83.', 'All seats are reserved, and there is luggage space in the cars.', 'Departures roughly every 30 to 60 minutes; check the exact time for your date.'],
      es: ['A la estación de Tokio: unos 53 minutos.', 'Otros destinos directos: Shinagawa unos 62 minutos, Shinjuku unos 78 y Yokohama unos 83.', 'Todos los asientos son reservados y hay espacio para el equipaje en los vagones.', 'Salidas aproximadamente cada 30 a 60 minutos; consulta el horario exacto para tu fecha.'],
      fr: ['Jusqu\'à Tokyo Station : environ 53 minutes.', 'Autres destinations directes : Shinagawa environ 62 minutes, Shinjuku environ 78, Yokohama environ 83.', 'Toutes les places sont réservées et les voitures disposent d\'un espace pour les bagages.', 'Départs environ toutes les 30 à 60 minutes ; vérifiez l\'horaire exact pour votre date.'],
      it: ['Fino a Tokyo Station: circa 53 minuti.', 'Altre destinazioni dirette: Shinagawa circa 62 minuti, Shinjuku circa 78, Yokohama circa 83.', 'Tutti i posti sono prenotati e le carrozze hanno spazio per i bagagli.', 'Partenze circa ogni 30-60 minuti; controlla l\'orario esatto per la tua data.']
    },
    choose: {
      en: 'If your hotel is near Tokyo Station, Shinagawa, Shinjuku or Shibuya, the Narita Express saves you a change with luggage. If you are going to the Ueno or Asakusa area, another company\'s airport train may be closer to your hotel; this page only covers the JR service.',
      es: 'Si tu hotel está cerca de la estación de Tokio, Shinagawa, Shinjuku o Shibuya, el Narita Express te ahorra un cambio con el equipaje. Si vas a la zona de Ueno o Asakusa, el tren al aeropuerto de otra compañía puede quedarte más cerca del hotel; esta página solo cubre el servicio de JR.',
      fr: 'Si votre hôtel est près de Tokyo Station, Shinagawa, Shinjuku ou Shibuya, le Narita Express vous évite un changement avec vos bagages. Pour le quartier d\'Ueno ou d\'Asakusa, le train d\'aéroport d\'une autre compagnie peut être plus proche de l\'hôtel ; cette page ne couvre que le service JR.',
      it: 'Se il tuo hotel è vicino a Tokyo Station, Shinagawa, Shinjuku o Shibuya, il Narita Express ti evita un cambio con i bagagli. Se vai verso Ueno o Asakusa, il treno dell\'aeroporto di un\'altra compagnia può essere più vicino all\'hotel; questa pagina copre solo il servizio JR.'
    },
    tips: {
      en: ['Narita has more than one airport station (Terminal 1 and Terminals 2 and 3). Check which one your arrival terminal uses.', 'Booking before you land avoids queues at the ticket office after a long flight.', 'In the cars, big suitcases go in the luggage area at the end of the car, so board near it.'],
      es: ['Narita tiene más de una estación (Terminal 1 y Terminales 2 y 3). Comprueba cuál corresponde a tu terminal de llegada.', 'Reservar antes de aterrizar evita las colas en la taquilla tras un vuelo largo.', 'En los vagones, las maletas grandes van en la zona de equipaje al final del vagón, así que sube cerca de ella.'],
      fr: ['Narita compte plusieurs gares d\'aéroport (Terminal 1 et Terminaux 2 et 3). Vérifiez celle de votre terminal d\'arrivée.', 'Réserver avant d\'atterrir évite la file au guichet après un long vol.', 'Dans les voitures, les grandes valises vont dans l\'espace bagages en bout de voiture : montez près de celui-ci.'],
      it: ['Narita ha più di una stazione aeroportuale (Terminal 1 e Terminal 2 e 3). Controlla quale corrisponde al tuo terminal di arrivo.', 'Prenotare prima di atterrare evita le code alla biglietteria dopo un lungo volo.', 'Nelle carrozze, le valigie grandi vanno nell\'area bagagli a fine carrozza, quindi sali vicino a essa.']
    },
    faqs: {
      en: [['How long is the train from Narita Airport to Tokyo?', 'The Narita Express takes about 53 minutes to Tokyo Station, about 62 to Shinagawa and about 78 to Shinjuku.'],
        ['Do I need a reservation on the Narita Express?', 'Yes, all seats on the Narita Express are reserved.'],
        ['Is there a direct train from Narita Airport to Shinjuku?', 'Yes. The Narita Express runs directly to Shinjuku in about 78 minutes.']],
      es: [['¿Cuánto dura el tren del aeropuerto de Narita a Tokio?', 'El Narita Express tarda unos 53 minutos hasta la estación de Tokio, unos 62 hasta Shinagawa y unos 78 hasta Shinjuku.'],
        ['¿Hace falta reserva en el Narita Express?', 'Sí, todos los asientos del Narita Express son reservados.'],
        ['¿Hay tren directo del aeropuerto de Narita a Shinjuku?', 'Sí. El Narita Express va directo a Shinjuku en unos 78 minutos.']],
      fr: [['Combien de temps dure le train de l\'aéroport de Narita à Tokyo ?', 'Le Narita Express met environ 53 minutes jusqu\'à Tokyo Station, environ 62 jusqu\'à Shinagawa et environ 78 jusqu\'à Shinjuku.'],
        ['Faut-il réserver pour le Narita Express ?', 'Oui, toutes les places du Narita Express sont réservées.'],
        ['Y a-t-il un train direct de l\'aéroport de Narita à Shinjuku ?', 'Oui. Le Narita Express va directement à Shinjuku en environ 78 minutes.']],
      it: [['Quanto dura il treno dall\'aeroporto di Narita a Tokyo?', 'Il Narita Express impiega circa 53 minuti fino a Tokyo Station, circa 62 fino a Shinagawa e circa 78 fino a Shinjuku.'],
        ['Serve la prenotazione sul Narita Express?', 'Sì, tutti i posti del Narita Express sono prenotati.'],
        ['C\'è un treno diretto dall\'aeroporto di Narita a Shinjuku?', 'Sì. Il Narita Express va direttamente a Shinjuku in circa 78 minuti.']]
    }
  }
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (slug, lang) => `https://glosx.app/rutas/${slug}${SUFFIX[lang]}`;
const bookUrl = r => `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=${r.fromKey}&to=${r.toKey}`;

function langSwitch(slug, current) {
  const opts = LANGS.map(l => `<a class="lang-option${l === current ? ' active' : ''}" href="/rutas/${slug}${SUFFIX[l]}">${LANG_NAMES[l]}</a>`).join('');
  return `<div class="lang-wrapper"><button type="button" class="lang-btn" aria-label="Language" onclick="event.stopPropagation();this.nextElementSibling.classList.toggle('open');"><span>${LANG_LABELS[current]}</span><span style="font-size:10px;opacity:0.6">▾</span></button><div class="lang-dropdown">${opts}</div></div>`;
}

function schema(r, lang) {
  const seo = r.seo[lang];
  const graph = [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: BC[lang].home, item: 'https://glosx.app/' },
      { '@type': 'ListItem', position: 2, name: BC[lang].routes, item: 'https://glosx.app/explore/' },
      { '@type': 'ListItem', position: 3, name: `${r.from[lang]} → ${r.to[lang]}`, item: url(r.slug, lang) }] },
    { '@type': 'FAQPage', mainEntity: r.faqs[lang].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@type': 'Article', headline: seo.title, description: seo.description, image: 'https://glosx.app/hero-bg.jpg',
      datePublished: '2026-10-05', dateModified: '2026-10-05',
      author: { '@type': 'Organization', name: 'WoW Train', url: 'https://glosx.app/' },
      publisher: { '@type': 'Organization', name: 'WoW Train', logo: { '@type': 'ImageObject', url: 'https://glosx.app/logo.png' } },
      mainEntityOfPage: url(r.slug, lang), inLanguage: lang }
  ];
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

function mainHtml(r, lang) {
  const u = UI[lang];
  const from = r.from[lang], to = r.to[lang];
  const related = ROUTES.filter(x => x.slug !== r.slug)
    .map(x => `<a href="/rutas/${x.slug}${SUFFIX[lang]}" class="related-link">${x.from[lang]} &rarr; ${x.to[lang]}</a>`).join('\n        ');
  const li = a => a.map(t => `<li>${esc(t)}</li>`).join('\n      ');
  const faq = r.faqs[lang].map(([q, a]) => `
      <div class="faq-item">
        <h3 class="faq-q">${esc(q)}</h3>
        <p class="faq-a">${esc(a)}</p>
      </div>`).join('');
  return `<main>
    <p class="lead">${esc(r.lead[lang])}</p>

    <a href="${bookUrl(r)}" class="klook-cta" target="_blank" rel="noopener sponsored"
       onclick="gtag('event','klook_click',{source:'cta_block',route:'${r.slug}'});">
      <img class="klook-cta-logo" src="https://www.google.com/s2/favicons?sz=64&domain=klook.com" alt="Klook" loading="lazy">
      <div class="klook-cta-text">
        <span class="klook-cta-title">${u.cta(esc(from), esc(to))}</span>
        <span class="klook-cta-sub">${u.sub}</span>
      </div>
      <span class="klook-cta-btn">${u.btn} &#8599;</span>
    </a>

    <h2>${u.facts}</h2>
    <ul>
      ${li(r.facts[lang])}
    </ul>

    <h2>${u.choose}</h2>
    <p>${esc(r.choose[lang])}</p>

    <h2>${u.tips}</h2>
    <ul>
      ${li(r.tips[lang])}
    </ul>

    <section class="faq">
      <h2>${u.faq}</h2>${faq}
    </section>

    <hr/>
    <p>${u.ready}</p>
    <p class="tl-secondary" style="text-align:center;margin:10px 0 8px;font-size:14px;color:#55565f;">
      ${u.cmp} <a href="${bookUrl(r)}" target="_blank" rel="noopener sponsored" onclick="trackTrainline('route_${r.slug}_${lang}')">${u.check}</a>
    </p>
    <p class="tl-note" style="text-align:center;margin:0 0 8px;font-size:12px;color:#6b6b85;">${u.note}</p>

    <div class="related-routes">
      <h2>${u.more}</h2>
      <div class="related-grid">
        ${related}
      </div>
    </div>
  </main>`;
}

const template = fs.readFileSync(path.join(__dirname, 'route-template.html'), 'utf8');
const head = template.slice(0, template.indexOf('<main>'));
const tail = template.slice(template.indexOf('</main>') + '</main>'.length);

function render(r, lang) {
  const seo = r.seo[lang], u = UI[lang];
  const map = {
    '{{lang}}': lang, '{{routeSlug}}': r.slug, '{{canonical}}': url(r.slug, lang),
    '{{title}}': esc(seo.title), '{{description}}': esc(seo.description),
    '{{ogTitle}}': esc(seo.title), '{{ogDescription}}': esc(seo.description),
    '{{twitterTitle}}': esc(seo.title), '{{twitterDescription}}': esc(seo.description),
    '{{videoCss}}': '', '{{schema}}': schema(r, lang), '{{langSwitch}}': langSwitch(r.slug, lang), '{{backText}}': u.back,
    '{{badge}}': u.badge, '{{mainTitle}}': esc(`${r.from[lang]} → ${r.to[lang]}`), '{{metaText}}': u.meta
  };
  let html = head + mainHtml(r, lang) + tail;
  const hero = `https://images.pexels.com/photos/${r.photo}/pexels-photo-${r.photo}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
  html = html.split('{{heroImage}}').join(hero);
  for (const [k, v] of Object.entries(map)) html = html.split(k).join(v);
  return html;
}

const only = process.argv[2];
const list = only ? ROUTES.filter(r => r.slug === only) : ROUTES;
if (!list.length) { console.error('Slug desconocido:', only); process.exit(1); }
list.forEach(r => {
  LANGS.forEach(lang => {
    const dir = lang === 'en' ? path.join(__dirname, '../rutas', r.slug) : path.join(__dirname, '../rutas', r.slug, lang);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), render(r, lang));
  });
  console.log('Generada', r.slug, '(EN/ES/FR/IT)');
});
