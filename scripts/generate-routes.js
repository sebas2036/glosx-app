const fs = require('fs');
const path = require('path');

// Route data configuration
const routes = [
  { slug: 'amsterdam-berlin', from: 'Amsterdam', to: 'Berlin', country: 'Netherlands-Germany', duration: '6h 30m', operator: 'DB ICE', price: '€29-45', badge: 'Route guide · Netherlands-Germany',
    customSEO: { en: { title: 'Amsterdam to Berlin by Train: 6h30 DB ICE, from €29', description: 'Direct DB ICE from Amsterdam to Berlin in 6h30. Compare today\'s schedule and book fares from €29 — no layovers.' } },
    localInsight: {
      en: 'This was one of the first international ICE services to run seamlessly across two rail networks without changing trains, using dual-system locomotives built to handle both the Dutch and German power and signalling standards — a technical detail most passengers never notice, but the reason the ride is a single unbroken journey.',
      es: 'Este fue uno de los primeros servicios ICE internacionales en circular sin cambios de tren entre dos redes ferroviarias distintas, gracias a locomotoras de doble sistema preparadas para los estándares de energía y señalización tanto neerlandeses como alemanes — un detalle técnico que casi nadie nota, pero que explica por qué el viaje es un trayecto único sin interrupciones.',
      fr: 'Ce fut l\'un des premiers services ICE internationaux à circuler sans changement de train entre deux réseaux ferroviaires différents, grâce à des locomotives bi-système conçues pour les normes d\'alimentation et de signalisation néerlandaises et allemandes — un détail technique que presque personne ne remarque, mais qui explique pourquoi le trajet reste ininterrompu.',
      it: 'Fu uno dei primi servizi ICE internazionali a circolare senza cambio di treno tra due reti ferroviarie diverse, grazie a locomotive bi-sistema costruite per gli standard di alimentazione e segnalamento sia olandesi che tedeschi — un dettaglio tecnico che quasi nessuno nota, ma che spiega perché il viaggio è un tragitto unico e ininterrotto.'
    }
  },
  { slug: 'amsterdam-brussels', from: 'Amsterdam', to: 'Brussels', country: 'Netherlands-Belgium', duration: '2h 00m', operator: 'Thalys', price: '€25-35', badge: 'Route guide · Netherlands-Belgium',
    customSEO: { en: { title: 'Amsterdam to Brussels Train: 2h, from €25', description: 'Thalys connection from Amsterdam to Brussels in 2 hours. Check live schedules and book tickets from €25.' } },
    localInsight: {
      en: 'This was actually the last leg of the original Thalys network to get its own dedicated high-speed track: HSL 4 in the Netherlands didn\'t open until 2009, more than a decade after Thalys launched, meaning trains ran on upgraded conventional lines for years before reaching full high-speed capability on this stretch.',
      es: 'Este fue en realidad el último tramo de la red original de Thalys en conseguir su propia vía de alta velocidad dedicada: la HSL 4 en los Países Bajos no se inauguró hasta 2009, más de una década después del lanzamiento de Thalys, así que los trenes circularon durante años por vías convencionales mejoradas antes de alcanzar la alta velocidad completa en este tramo.',
      fr: 'Ce fut en réalité le dernier tronçon du réseau Thalys d\'origine à disposer de sa propre voie à grande vitesse dédiée : la HSL 4 aux Pays-Bas n\'a ouvert qu\'en 2009, plus de dix ans après le lancement de Thalys, si bien que les trains ont circulé pendant des années sur des lignes classiques améliorées avant d\'atteindre la pleine vitesse sur ce tronçon.',
      it: 'Questo fu in realtà l\'ultimo tratto della rete Thalys originale a ottenere un proprio binario ad alta velocità dedicato: la HSL 4 nei Paesi Bassi ha aperto solo nel 2009, oltre un decennio dopo il lancio di Thalys, quindi i treni hanno circolato per anni su linee convenzionali potenziate prima di raggiungere la piena velocità su questo tratto.'
    }
  },
  { slug: 'barcelona-girona', from: 'Barcelona', to: 'Girona', country: 'Spain', duration: '1h 30m', operator: 'Renfe', price: '€10-15', badge: 'Route guide · Spain',
    customSEO: { en: { title: 'Barcelona to Girona Train Guide: 1h30 on Renfe', description: 'Everything you need for the Barcelona to Girona train: 1h30 on Renfe, fares from €10, and today\'s live schedule.' } },
    localInsight: {
      en: 'This is the domestic start of the same high-speed line that continues on to Figueres, crosses into France at Perpignan and eventually reaches Paris — so a Barcelona-Girona ticket runs on exactly the same infrastructure as the long-distance Paris-Barcelona TGV, just for a much shorter distance.',
      es: 'Este es el tramo doméstico inicial de la misma línea de alta velocidad que continúa hasta Figueres, cruza a Francia por Perpignan y llega finalmente a París — así que un billete Barcelona-Girona circula por exactamente la misma infraestructura que el TGV de larga distancia Paris-Barcelona, solo que en un trayecto mucho más corto.',
      fr: 'C\'est le tronçon national initial de la même ligne à grande vitesse qui se poursuit jusqu\'à Figueres, entre en France à Perpignan et atteint finalement Paris — un billet Barcelone-Gérone circule donc exactement sur la même infrastructure que le TGV longue distance Paris-Barcelone, sur une distance bien plus courte.',
      it: 'Questo è il tratto nazionale iniziale della stessa linea ad alta velocità che prosegue fino a Figueres, entra in Francia a Perpignano e raggiunge infine Parigi — un biglietto Barcellona-Girona percorre quindi esattamente la stessa infrastruttura del TGV a lunga percorrenza Parigi-Barcellona, solo per una distanza molto più breve.'
    }
  },
  { slug: 'barcelona-lyon', from: 'Barcelona', to: 'Lyon', country: 'Spain-France', duration: '4h 30m', operator: 'TGV', price: '€35-55', badge: 'Route guide · Spain-France',
    customSEO: { en: { title: 'How to Get from Barcelona to Lyon by Train (4h30)', description: 'The Barcelona to Lyon train takes 4h30 on TGV. See today\'s departures and book tickets from €35.' } },
    localInsight: {
      en: 'Like the Paris–Barcelona TGV, this train crosses into Spain at Perpignan–Figueres, where the French and Spanish high-speed networks physically connect — one of only a couple of places in Europe where trains run through from one country\'s high-speed line straight onto another\'s without a change.',
      es: 'Al igual que el TGV Paris–Barcelona, este tren entra en España por Perpignan–Figueres, donde se conectan físicamente las redes de alta velocidad francesa y española — uno de los pocos puntos de Europa donde los trenes pasan directamente de la línea de alta velocidad de un país a la de otro sin cambiar.',
      fr: 'Comme le TGV Paris–Barcelone, ce train entre en Espagne à Perpignan–Figueres, où les réseaux à grande vitesse français et espagnol se rejoignent physiquement — l\'un des rares endroits en Europe où les trains passent directement de la ligne à grande vitesse d\'un pays à celle d\'un autre sans changement.',
      it: 'Come il TGV Parigi–Barcellona, questo treno entra in Spagna a Perpignano–Figueres, dove le reti ad alta velocità francese e spagnola si collegano fisicamente — uno dei pochi punti in Europa dove i treni passano direttamente dalla linea ad alta velocità di un paese a quella di un altro senza cambio.'
    }
  },
  { slug: 'barcelona-valencia', from: 'Barcelona', to: 'Valencia', country: 'Spain', duration: '3h 00m', operator: 'Renfe AVE', price: '€20-35', badge: 'Route guide · Spain',
    customSEO: {
      en: {
        title: 'Barcelona to Valencia train: 3 hours, from €20',
        description: 'The Barcelona to Valencia train takes 3 hours on Renfe AVE. Compare today\'s times and book from €20.',
        mainTitle: 'Barcelona to Valencia train',
        lead: 'The Barcelona to Valencia train takes about 3 hours on Renfe AVE. Ouigo also runs this corridor — compare both before you book.'
      },
      es: {
        title: 'Tren Barcelona Valencia: 3h AVE, desde 20 €',
        description: 'El tren Barcelona Valencia tarda 3 horas con Renfe AVE. Compara horarios de hoy y reserva desde 20 €.',
        mainTitle: 'Tren Barcelona Valencia',
        lead: 'El tren Barcelona Valencia tarda unas 3 horas con Renfe AVE. Ouigo también cubre el corredor: conviene comparar antes de reservar.'
      },
      fr: {
        title: 'Train Barcelone Valence : 3h AVE, dès 20 €',
        description: 'Le train Barcelone–Valence met 3 heures avec Renfe AVE. Comparez les horaires du jour et réservez dès 20 €.',
        mainTitle: 'Train Barcelone Valence',
        lead: 'Le train Barcelone–Valence met environ 3 heures avec Renfe AVE. Ouigo circule aussi sur ce corridor : comparez avant de réserver.'
      },
      it: {
        title: 'Treno Barcellona Valencia: 3h AVE, da 20 €',
        description: 'Il treno Barcellona–Valencia impiega 3 ore con Renfe AVE. Confronta gli orari di oggi e prenota da 20 €.',
        mainTitle: 'Treno Barcellona Valencia',
        lead: 'Il treno Barcellona–Valencia impiega circa 3 ore con Renfe AVE. Anche Ouigo copre il corridoio: conviene confrontare prima di prenotare.'
      }
    },
    localInsight: {
      en: 'This is one of the newer additions to Spain\'s high-speed network, and low-cost operator Ouigo also runs the corridor alongside Renfe AVE — worth comparing both, since Ouigo fares are sometimes noticeably cheaper for the same journey time.',
      es: 'Es una de las incorporaciones más recientes a la red de alta velocidad española, y el operador low-cost Ouigo también cubre el trayecto junto a Renfe AVE — conviene comparar ambos, porque a veces Ouigo sale notablemente más barato para el mismo tiempo de viaje.',
      fr: 'C\'est l\'une des lignes les plus récentes du réseau à grande vitesse espagnol, et l\'opérateur low-cost Ouigo dessert aussi ce trajet aux côtés de Renfe AVE — cela vaut la peine de comparer les deux, Ouigo étant parfois nettement moins cher pour le même temps de trajet.',
      it: 'È una delle aggiunte più recenti alla rete ad alta velocità spagnola, e l\'operatore low-cost Ouigo copre la tratta insieme a Renfe AVE — conviene confrontare entrambi, perché Ouigo a volte costa decisamente meno per lo stesso tempo di viaggio.'
    }
  },
  { slug: 'basel-lauterbrunnen', from: 'Basel', to: 'Lauterbrunnen', country: 'Switzerland', duration: '2h 30m', operator: 'SBB', price: '€35-50', badge: 'Route guide · Switzerland',
    customSEO: { en: { title: 'Basel to Lauterbrunnen by Train: 2h30 SBB, from €35', description: 'Direct SBB from Basel to Lauterbrunnen in 2h30. Compare today\'s schedule and book fares from €35 — no layovers.' } } },
  { slug: 'basel-paris', from: 'Basel', to: 'Paris', country: 'Switzerland-France', duration: '3h 00m', operator: 'TGV Lyria', price: '€40-60', badge: 'Route guide · Switzerland-France',
    customSEO: { en: { title: 'Basel to Paris Train: 3h, from €40', description: 'TGV Lyria connection from Basel to Paris in 3 hours. Check live schedules and book tickets from €40.' } } },
  { slug: 'berlin-hamburg', from: 'Berlin', to: 'Hamburg', country: 'Germany', duration: '1h 45m', operator: 'DB ICE', price: '€25-40', badge: 'Route guide · Germany',
    customSEO: { en: { title: 'Berlin to Hamburg by Train: 1h45 ICE, from €25', description: 'Direct DB ICE from Berlin to Hamburg in under 2 hours. Compare today\'s schedule and book fares from €25.' } },
    localInsight: {
      en: 'In the 1990s this corridor was seriously proposed as the route for Germany\'s first Transrapid magnetic levitation line, which would have cut the journey to under an hour — the project was ultimately cancelled over cost in 2000, and the route stayed a conventional (if fast) ICE line instead.',
      es: 'En los años 90 este corredor fue propuesto en serio como ruta para la primera línea de tren de levitación magnética Transrapid de Alemania, que habría reducido el viaje a menos de una hora — el proyecto finalmente se canceló por su costo en 2000, y la ruta siguió siendo una línea ICE convencional (aunque rápida).',
      fr: 'Dans les années 1990, ce corridor a été sérieusement envisagé comme tracé pour la première ligne à sustentation magnétique Transrapid d\'Allemagne, qui aurait réduit le trajet à moins d\'une heure — le projet a finalement été annulé pour des raisons de coût en 2000, et la ligne est restée une ligne ICE classique, quoique rapide.',
      it: 'Negli anni \'90 questo corridoio fu seriamente proposto come tracciato per la prima linea a levitazione magnetica Transrapid della Germania, che avrebbe ridotto il viaggio a meno di un\'ora — il progetto fu infine cancellato per i costi nel 2000, e la tratta rimase una linea ICE convenzionale, seppur veloce.'
    }
  },
  { slug: 'berlin-prague', from: 'Berlin', to: 'Prague', country: 'Germany-Czech', duration: '4h 30m', operator: 'DB ČD', price: '€30-50', badge: 'Route guide · Germany-Czech',
    customSEO: { en: { title: 'Berlin to Prague Train Guide: 4h30 on DB ČD', description: 'Everything you need for the Berlin to Prague train: 4h30 on DB ČD, fares from €30, and today\'s live schedule.' } },
    localInsight: {
      en: 'For much of the journey the train follows the Elbe river valley through the Elbe Sandstone Mountains (Saxon Switzerland), a landscape of dramatic sandstone cliffs on both the German and Czech sides — one of the more scenic stretches on this list, and one most travellers don\'t expect from a fairly ordinary-sounding city-to-city connection.',
      es: 'Durante buena parte del viaje, el tren sigue el valle del río Elba a través de las montañas de arenisca del Elba (la "Suiza Sajona"), un paisaje de acantilados de arenisca espectaculares tanto del lado alemán como del checo — uno de los tramos más escénicos de esta lista, algo que la mayoría no espera de una conexión entre dos ciudades que suena tan común.',
      fr: 'Sur une grande partie du trajet, le train longe la vallée de l\'Elbe à travers les montagnes de grès de l\'Elbe (la « Suisse saxonne »), un paysage de falaises de grès spectaculaires des deux côtés, allemand et tchèque — l\'un des tronçons les plus pittoresques de cette liste, une surprise pour une liaison qui semble a priori tout à fait ordinaire.',
      it: 'Per buona parte del viaggio, il treno segue la valle del fiume Elba attraverso le montagne di arenaria dell\'Elba (la "Svizzera Sassone"), un paesaggio di scogliere di arenaria spettacolari sia sul lato tedesco che su quello ceco — uno dei tratti più panoramici di questa lista, cosa che la maggior parte dei viaggiatori non si aspetta da un collegamento dal nome così ordinario.'
    }
  },
  { slug: 'bordeaux-lourdes', from: 'Bordeaux', to: 'Lourdes', country: 'France', duration: '2h 30m', operator: 'SNCF Intercités', price: '€20-35', badge: 'Route guide · France',
    customSEO: { en: { title: 'How to Get from Bordeaux to Lourdes by Train (2h30)', description: 'The Bordeaux to Lourdes train takes 2h30 on SNCF Intercités. See today\'s departures and book tickets from €20.' } },
    localInsight: {
      en: 'For much of the way, the train runs through the Landes forest, one of the largest planted forests in Europe — millions of pine trees deliberately established in the 19th century to stabilise what used to be shifting sand dunes and marshland along this stretch of the Atlantic coast.',
      es: 'Durante buena parte del trayecto, el tren atraviesa el bosque de las Landas, uno de los bosques plantados más grandes de Europa — millones de pinos plantados deliberadamente en el siglo XIX para fijar lo que antes eran dunas de arena movediza y marismas a lo largo de esta parte de la costa atlántica.',
      fr: 'Sur une grande partie du trajet, le train traverse la forêt des Landes, l\'une des plus grandes forêts plantées d\'Europe — des millions de pins installés délibérément au XIXe siècle pour fixer ce qui était autrefois des dunes de sable mouvantes et des marais le long de cette portion de la côte atlantique.',
      it: 'Per buona parte del percorso, il treno attraversa la foresta delle Landes, una delle più grandi foreste piantumate d\'Europa — milioni di pini piantati deliberatamente nel XIX secolo per fissare quelle che un tempo erano dune di sabbia mobile e paludi lungo questo tratto della costa atlantica.'
    }
  },
  { slug: 'brno-vienna', from: 'Brno', to: 'Vienna', country: 'Czech-Austria', duration: '1h 45m', operator: 'ÖBB', price: '€15-25', badge: 'Route guide · Czech-Austria',
    customSEO: { en: { title: 'Brno to Vienna by Train: 1h45 ÖBB, from €15', description: 'Direct ÖBB from Brno to Vienna in 1h45. Compare today\'s schedule and book fares from €15 — no layovers.' } },
    localInsight: {
      en: 'The short distance and frequent service on this route have turned it into a genuine cross-border commuter corridor in recent years, with a growing number of people living in Brno and working in Vienna (or the reverse) — something that would have been unthinkable before both countries joined the EU\'s open Schengen border area.',
      es: 'La corta distancia y la alta frecuencia de esta ruta la han convertido en los últimos años en un auténtico corredor de commuters transfronterizos, con cada vez más gente que vive en Brno y trabaja en Viena (o al revés) — algo impensable antes de que ambos países entraran en el espacio Schengen de fronteras abiertas de la UE.',
      fr: 'La courte distance et la fréquence élevée de cette ligne en ont fait ces dernières années un véritable corridor de navetteurs transfrontaliers, avec un nombre croissant de personnes vivant à Brno et travaillant à Vienne (ou l\'inverse) — quelque chose d\'impensable avant que les deux pays ne rejoignent l\'espace Schengen à frontières ouvertes de l\'UE.',
      it: 'La breve distanza e l\'alta frequenza di questa tratta l\'hanno trasformata negli ultimi anni in un vero corridoio di pendolari transfrontalieri, con un numero crescente di persone che vivono a Brno e lavorano a Vienna (o viceversa) — qualcosa di impensabile prima che entrambi i paesi entrassero nell\'area Schengen a frontiere aperte dell\'UE.'
    }
  },
  { slug: 'brussels-bruges', from: 'Brussels', to: 'Bruges', country: 'Belgium', duration: '0h 50m', operator: 'SNCB', price: '€10-15', badge: 'Route guide · Belgium',
    customSEO: { en: { title: 'Brussels to Bruges Train: 50 min, from €10', description: 'Direct SNCB train from Brussels to Bruges in under an hour. Check today\'s schedule and book tickets from €10.' } },
    localInsight: {
      en: 'Bruges\' entire medieval centre — canals, guild houses and belfry included — is a UNESCO World Heritage Site, and it\'s reachable from a European capital in under an hour by train, which is unusually fast for a city this historically intact. Most visitors do it as a day trip rather than an overnight stay.',
      es: 'Todo el centro medieval de Brujas — canales, casas gremiales y campanario incluidos — es Patrimonio de la Humanidad de la UNESCO, y se llega desde una capital europea en menos de una hora en tren, algo inusualmente rápido para una ciudad tan intacta históricamente. La mayoría lo hace como excursión de un día, sin quedarse a dormir.',
      fr: 'Tout le centre médiéval de Bruges — canaux, maisons de corporations et beffroi compris — est classé au patrimoine mondial de l\'UNESCO, et il est accessible depuis une capitale européenne en moins d\'une heure de train, ce qui est inhabituellement rapide pour une ville aussi bien préservée. La plupart des visiteurs y vont pour la journée sans y passer la nuit.',
      it: 'L\'intero centro medievale di Bruges — canali, case delle corporazioni e campanile inclusi — è Patrimonio dell\'Umanità UNESCO, ed è raggiungibile da una capitale europea in meno di un\'ora di treno, un tempo insolitamente breve per una città così intatta dal punto di vista storico. La maggior parte dei visitatori la fa come gita di un giorno, senza pernottare.'
    }
  },
  { slug: 'brussels-paris', from: 'Brussels', to: 'Paris', country: 'Belgium-France', duration: '1h 30m', operator: 'Thalys', price: '€35-55', badge: 'Route guide · Belgium-France',
    customSEO: { en: { title: 'Brussels to Paris Train: 1h30, from €35', description: 'Thalys connection from Brussels to Paris in 1h30. Check live schedules and book tickets from €35.' } },
    localInsight: {
      en: 'This was the original flagship route when Thalys launched in 1996, and it remains one of the busiest international rail corridors in Europe. Since the 2024 merger, tickets and branding appear under the Eurostar name, though the fast Brussels–Paris service itself hasn\'t changed.',
      es: 'Esta fue la ruta insignia original cuando Thalys se lanzó en 1996, y sigue siendo uno de los corredores ferroviarios internacionales más transitados de Europa. Desde la fusión de 2024, los billetes y la marca aparecen bajo el nombre Eurostar, aunque el servicio rápido Bruselas–París en sí no ha cambiado.',
      fr: 'C\'était la ligne phare d\'origine lors du lancement de Thalys en 1996, et elle reste l\'un des corridors ferroviaires internationaux les plus fréquentés d\'Europe. Depuis la fusion de 2024, billets et marque apparaissent sous le nom Eurostar, même si le service rapide Bruxelles–Paris lui-même n\'a pas changé.',
      it: 'Questa era la tratta di punta originale al lancio di Thalys nel 1996, e resta uno dei corridoi ferroviari internazionali più trafficati d\'Europa. Dalla fusione del 2024, biglietti e marchio appaiono sotto il nome Eurostar, anche se il servizio rapido Bruxelles–Parigi in sé non è cambiato.'
    }
  },
  { slug: 'budapest-ljubljana', from: 'Budapest', to: 'Ljubljana', country: 'Hungary-Slovenia', duration: '6h 00m', operator: 'MÁV', price: '€30-50', badge: 'Route guide · Hungary-Slovenia',
    customSEO: { en: { title: 'Budapest to Ljubljana Train Guide: 6h on MÁV', description: 'Everything you need for the Budapest to Ljubljana train: 6 hours on MÁV, fares from €30, and today\'s live schedule.' } },
    localInsight: {
      en: 'This is one of relatively few direct rail links from Central Europe toward the Adriatic, following a corridor originally built under the Austro-Hungarian Empire to connect its inland cities with the coast — the modern border crossing into Slovenia dates only to that country\'s independence in 1991.',
      es: 'Es uno de los pocos enlaces ferroviarios directos entre Europa Central y el Adriático, sobre un corredor construido originalmente bajo el Imperio austrohúngaro para conectar sus ciudades del interior con la costa — el cruce fronterizo moderno hacia Eslovenia data recién de la independencia de ese país en 1991.',
      fr: 'C\'est l\'une des rares liaisons ferroviaires directes reliant l\'Europe centrale à l\'Adriatique, suivant un corridor construit à l\'origine sous l\'Empire austro-hongrois pour relier ses villes de l\'intérieur à la côte — le passage frontalier moderne vers la Slovénie ne date que de l\'indépendance de ce pays en 1991.',
      it: 'È uno dei pochi collegamenti ferroviari diretti tra l\'Europa centrale e l\'Adriatico, lungo un corridoio costruito originariamente sotto l\'Impero austro-ungarico per collegare le sue città interne alla costa — il moderno valico di frontiera verso la Slovenia risale solo all\'indipendenza di quel paese nel 1991.'
    }
  },
  { slug: 'copenhagen-stockholm', from: 'Copenhagen', to: 'Stockholm', country: 'Denmark-Sweden', duration: '5h 00m', operator: 'SJ', price: '€40-60', badge: 'Route guide · Denmark-Sweden',
    customSEO: { en: { title: 'How to Get from Copenhagen to Stockholm by Train (5h)', description: 'The Copenhagen to Stockholm train takes 5 hours on SJ. See today\'s departures and book tickets from €40.' } },
    localInsight: {
      en: 'Leaving Copenhagen, the train crosses the Øresund Bridge — an 8km combined bridge-and-tunnel structure opened in 2000 that links Denmark and Sweden via the artificial island of Peberholm. It\'s the only fixed rail link between the two countries, and the crossing itself is one of the more memorable moments of the journey.',
      es: 'Al salir de Copenhague, el tren cruza el puente de Öresund — una estructura combinada de puente y túnel de 8 km inaugurada en 2000 que conecta Dinamarca y Suecia a través de la isla artificial de Peberholm. Es el único enlace ferroviario fijo entre ambos países, y ese cruce es uno de los momentos más memorables del viaje.',
      fr: 'En quittant Copenhague, le train traverse le pont de l\'Øresund — un ouvrage combiné pont-tunnel de 8 km ouvert en 2000 qui relie le Danemark et la Suède via l\'île artificielle de Peberholm. C\'est le seul lien ferroviaire fixe entre les deux pays, et cette traversée reste l\'un des moments les plus marquants du trajet.',
      it: 'Lasciando Copenaghen, il treno attraversa il ponte dell\'Øresund — una struttura combinata ponte-tunnel di 8 km aperta nel 2000 che collega Danimarca e Svezia tramite l\'isola artificiale di Peberholm. È l\'unico collegamento ferroviario fisso tra i due paesi, e l\'attraversamento stesso è uno dei momenti più memorabili del viaggio.'
    }
  },
  { slug: 'dortmund-munich', from: 'Dortmund', to: 'Munich', country: 'Germany', duration: '5h 30m', operator: 'DB ICE', price: '€35-55', badge: 'Route guide · Germany',
    customSEO: { en: { title: 'Dortmund to Munich by Train: 5h30 DB ICE, from €35', description: 'Direct DB ICE from Dortmund to Munich in 5h30. Compare today\'s schedule and book fares from €35 — no layovers.' } },
    localInsight: {
      en: 'Dortmund sits at the heart of the Ruhr, once Europe\'s largest coal and steel region and the engine of Germany\'s post-war industrial boom. This train ride effectively runs from that post-industrial landscape all the way to Bavaria — two very different pictures of modern Germany connected by a single ICE line.',
      es: 'Dortmund está en el corazón del Ruhr, que fue la mayor región carbonera y siderúrgica de Europa y el motor del auge industrial alemán de posguerra. Este viaje en tren va, en la práctica, desde ese paisaje postindustrial hasta Baviera — dos imágenes muy distintas de la Alemania moderna conectadas por una sola línea ICE.',
      fr: 'Dortmund se trouve au cœur de la Ruhr, autrefois la plus grande région charbonnière et sidérurgique d\'Europe et le moteur du boom industriel allemand d\'après-guerre. Ce trajet en train relie en pratique ce paysage postindustriel jusqu\'à la Bavière — deux visages très différents de l\'Allemagne moderne reliés par une seule ligne ICE.',
      it: 'Dortmund si trova nel cuore della Ruhr, un tempo la più grande regione carbonifera e siderurgica d\'Europa e il motore del boom industriale tedesco del dopoguerra. Questo viaggio in treno va di fatto da quel paesaggio postindustriale fino alla Baviera — due immagini molto diverse della Germania moderna collegate da un\'unica linea ICE.'
    }
  },
  { slug: 'florence-pisa', from: 'Florence', to: 'Pisa', country: 'Italy', duration: '1h 00m', operator: 'Trenitalia', price: '€10-15', badge: 'Route guide · Italy',
    customSEO: { en: { title: 'Florence to Pisa Train: 1h, from €10', description: 'Trenitalia connection from Florence to Pisa in 1 hour. Check live schedules and book tickets from €10.' } },
    localInsight: {
      en: 'Part of this corridor traces back to the Leopolda railway, opened in 1844 between Livorno and Pisa, one of the very first railways built anywhere on the Italian peninsula — nearly two centuries of trains have run through this stretch of Tuscany in some form.',
      es: 'Parte de este corredor se remonta al ferrocarril Leopolda, inaugurado en 1844 entre Livorno y Pisa, uno de los primerísimos ferrocarriles construidos en la península italiana — casi dos siglos de trenes han circulado en alguna forma por este tramo de la Toscana.',
      fr: 'Une partie de ce corridor remonte au chemin de fer Leopolda, ouvert en 1844 entre Livourne et Pise, l\'un des tout premiers chemins de fer construits sur la péninsule italienne — près de deux siècles de trains ont circulé sous une forme ou une autre sur ce tronçon de Toscane.',
      it: 'Parte di questo corridoio risale alla ferrovia Leopolda, aperta nel 1844 tra Livorno e Pisa, una delle primissime ferrovie costruite nella penisola italiana — quasi due secoli di treni hanno percorso in qualche forma questo tratto di Toscana.'
    }
  },
  { slug: 'florence-siena', from: 'Florence', to: 'Siena', country: 'Italy', duration: '1h 30m', operator: 'Trenitalia', price: '€10-15', badge: 'Route guide · Italy',
    customSEO: { en: { title: 'Florence to Siena Train Guide: 1h30 on Trenitalia', description: 'Everything you need for the Florence to Siena train: 1h30 on Trenitalia, fares from €10, and today\'s live schedule.' } } },
  { slug: 'florence-venice', from: 'Florence', to: 'Venice', country: 'Italy', duration: '2h 00m', operator: 'Trenitalia', price: '€20-35', badge: 'Route guide · Italy',
    customSEO: { en: { title: 'How to Get from Florence to Venice by Train (2h)', description: 'The Florence to Venice train takes 2 hours on Trenitalia. See today\'s departures and book tickets from €20.' } },
    localInsight: {
      en: 'Unlike Florence–Rome, this route isn\'t fully on Italy\'s dedicated Alta Velocità track for its whole length — part of it runs on upgraded conventional line through the Apennines and the Po Valley, which is one of the reasons journey time can vary a bit more between different train categories than on the fully high-speed corridors.',
      es: 'A diferencia de Florencia-Roma, esta ruta no va por completo sobre vía dedicada de Alta Velocità italiana en todo su recorrido — parte va por línea convencional mejorada a través de los Apeninos y el valle del Po, una de las razones por las que el tiempo de viaje varía algo más entre categorías de tren que en los corredores totalmente de alta velocidad.',
      fr: 'Contrairement à Florence-Rome, cet itinéraire ne circule pas entièrement sur la voie dédiée Alta Velocità italienne sur toute sa longueur — une partie emprunte une ligne classique modernisée à travers les Apennins et la plaine du Pô, ce qui explique en partie pourquoi le temps de trajet varie davantage selon les catégories de train que sur les corridors entièrement à grande vitesse.',
      it: 'A differenza di Firenze-Roma, questo percorso non corre interamente su binario dedicato Alta Velocità per tutta la sua lunghezza — parte percorre linea convenzionale potenziata attraverso gli Appennini e la Pianura Padana, uno dei motivi per cui il tempo di viaggio varia un po\' di più tra le diverse categorie di treno rispetto ai corridoi interamente ad alta velocità.'
    }
  },
  { slug: 'frankfurt-cologne', from: 'Frankfurt', to: 'Cologne', country: 'Germany', duration: '1h 15m', operator: 'DB ICE', price: '€25-40', badge: 'Route guide · Germany',
    customSEO: { en: { title: 'Frankfurt to Cologne by Train: 1h15 DB ICE, from €25', description: 'Direct DB ICE from Frankfurt to Cologne in 1h15. Compare today\'s schedule and book fares from €25 — no layovers.' } } },
  { slug: 'frankfurt-munich', from: 'Frankfurt', to: 'Munich', country: 'Germany', duration: '3h 30m', operator: 'DB ICE', price: '€30-50', badge: 'Route guide · Germany',
    customSEO: { en: { title: 'Frankfurt to Munich Train: 3h30 ICE, from €30', description: 'Direct DB ICE from Frankfurt to Munich in 3.5 hours, no layovers. Compare fares from €30 and book your seat today.' } },
    localInsight: {
      en: 'Part of this route runs on the new high-speed line between Wendlingen and Ulm, which opened in December 2022 as one piece of Stuttgart 21 — a famously controversial, decades-long German infrastructure megaproject that also involves rebuilding Stuttgart\'s main station underground.',
      es: 'Parte de esta ruta circula por la nueva línea de alta velocidad entre Wendlingen y Ulm, inaugurada en diciembre de 2022 como parte del proyecto Stuttgart 21 — un famoso megaproyecto de infraestructura alemán, tan polémico como de décadas de duración, que también incluye reconstruir la estación central de Stuttgart bajo tierra.',
      fr: 'Une partie de cet itinéraire emprunte la nouvelle ligne à grande vitesse entre Wendlingen et Ulm, ouverte en décembre 2022 dans le cadre du projet Stuttgart 21 — un mégaprojet d\'infrastructure allemand tristement célèbre pour sa controverse et sa durée de plusieurs décennies, qui inclut aussi la reconstruction en souterrain de la gare centrale de Stuttgart.',
      it: 'Parte di questo percorso corre sulla nuova linea ad alta velocità tra Wendlingen e Ulm, aperta nel dicembre 2022 come parte del progetto Stuttgart 21 — un megaprogetto infrastrutturale tedesco famoso per la sua controversia e per i decenni di lavori, che include anche la ricostruzione sotterranea della stazione centrale di Stoccarda.'
    }
  },
  { slug: 'frankfurt-paris', from: 'Frankfurt', to: 'Paris', country: 'Germany-France', duration: '4h 00m', operator: 'TGV', price: '€40-60', badge: 'Route guide · Germany-France',
    customSEO: { en: { title: 'Frankfurt to Paris by Train: 4h TGV, from €40', description: 'Direct TGV from Frankfurt to Paris in 4 hours, no layovers. Compare fares from €40, check today\'s schedule and book securely.' } },
    localInsight: {
      en: 'Trains on this route are jointly run by SNCF and Deutsche Bahn using rolling stock certified to operate on both the French and German high-speed networks — a technical arrangement that lets the same train run at full speed on both countries\' infrastructure rather than switching operators at the border.',
      es: 'Los trenes de esta ruta los operan conjuntamente SNCF y Deutsche Bahn, con material rodante certificado para circular tanto en la red de alta velocidad francesa como en la alemana — un acuerdo técnico que permite que el mismo tren vaya a máxima velocidad en la infraestructura de ambos países en vez de cambiar de operador en la frontera.',
      fr: 'Les trains de cette ligne sont exploités conjointement par la SNCF et la Deutsche Bahn, avec du matériel roulant certifié pour circuler à la fois sur les réseaux à grande vitesse français et allemand — un dispositif technique qui permet au même train de rouler à pleine vitesse sur les infrastructures des deux pays plutôt que de changer d\'opérateur à la frontière.',
      it: 'I treni su questa tratta sono gestiti congiuntamente da SNCF e Deutsche Bahn, con materiale rotabile certificato per circolare sia sulla rete ad alta velocità francese che su quella tedesca — un accordo tecnico che permette allo stesso treno di viaggiare a piena velocità sulle infrastrutture di entrambi i paesi invece di cambiare operatore al confine.'
    }
  },
  { slug: 'geneva-paris', from: 'Geneva', to: 'Paris', country: 'Switzerland-France', duration: '3h 00m', operator: 'TGV Lyria', price: '€40-60', badge: 'Route guide · Switzerland-France',
    customSEO: { en: { title: 'Geneva to Paris Train: 3h, from €40', description: 'TGV Lyria connection from Geneva to Paris in 3 hours. Check live schedules and book tickets from €40.' } },
    localInsight: {
      en: 'Switzerland isn\'t in the EU or its customs union, but it is part of the Schengen open-border area — which is why this international train can run without the kind of full passport checks required on, say, the Eurostar to London, even though it\'s crossing between a non-EU and an EU country.',
      es: 'Suiza no forma parte de la UE ni de su unión aduanera, pero sí del espacio Schengen de fronteras abiertas — por eso este tren internacional puede circular sin el tipo de control de pasaporte completo que sí exige, por ejemplo, el Eurostar a Londres, aunque cruce entre un país fuera de la UE y otro dentro de ella.',
      fr: 'La Suisse ne fait partie ni de l\'UE ni de son union douanière, mais elle appartient à l\'espace Schengen à frontières ouvertes — c\'est pourquoi ce train international peut circuler sans le type de contrôle de passeport complet exigé, par exemple, sur l\'Eurostar vers Londres, même s\'il franchit la frontière entre un pays hors UE et un pays de l\'UE.',
      it: 'La Svizzera non fa parte dell\'UE né della sua unione doganale, ma appartiene all\'area Schengen a frontiere aperte — per questo questo treno internazionale può circolare senza il tipo di controllo passaporti completo richiesto, ad esempio, sull\'Eurostar per Londra, pur attraversando il confine tra un paese extra-UE e uno UE.'
    }
  },
  { slug: 'geneva-zermatt', from: 'Geneva', to: 'Zermatt', country: 'Switzerland', duration: '3h 30m', operator: 'SBB', price: '€45-65', badge: 'Route guide · Switzerland',
    customSEO: { en: { title: 'Geneva to Zermatt Train Guide: 3h30 on SBB', description: 'Everything you need for the Geneva to Zermatt train: 3h30 on SBB, fares from €45, and today\'s live schedule.' } },
    localInsight: {
      en: 'Zermatt itself is car-free — private cars have been banned in the village for decades, and the only way in is by train (the last stretch on the Matterhorn Gotthard Bahn) or electric taxi from the car park in Täsch. That makes this train ride the actual entrance to the town, not just a way to get near it.',
      es: 'Zermatt es una localidad sin coches — los vehículos privados están prohibidos en el pueblo desde hace décadas, y la única forma de llegar es en tren (el último tramo por el Matterhorn Gotthard Bahn) o en taxi eléctrico desde el aparcamiento de Täsch. Por eso este tren no es solo una forma de acercarse al pueblo, sino la entrada real al mismo.',
      fr: 'Zermatt est une commune sans voitures — les véhicules privés y sont interdits depuis des décennies, et le seul moyen d\'y accéder est le train (le dernier tronçon via le Matterhorn Gotthard Bahn) ou un taxi électrique depuis le parking de Täsch. Ce train n\'est donc pas seulement un moyen de s\'approcher du village, c\'est la véritable porte d\'entrée.',
      it: 'Zermatt è un comune senza auto — i veicoli privati sono vietati nel paese da decenni, e l\'unico modo per arrivarci è in treno (l\'ultimo tratto sulla Matterhorn Gotthard Bahn) o in taxi elettrico dal parcheggio di Täsch. Questo treno non è quindi solo un modo per avvicinarsi al paese, ma il vero e proprio ingresso.'
    }
  },
  { slug: 'girona-figueres', from: 'Girona', to: 'Figueres', country: 'Spain', duration: '0h 30m', operator: 'Renfe', price: '€5-10', badge: 'Route guide · Spain',
    customSEO: { en: { title: 'How to Get from Girona to Figueres by Train (30 min)', description: 'The Girona to Figueres train takes 30 minutes on Renfe. See today\'s departures and book tickets from €5.' } } },
  { slug: 'interlaken-lauterbrunnen', from: 'Interlaken', to: 'Lauterbrunnen', country: 'Switzerland', duration: '0h 20m', operator: 'BOB', price: '€10-15', badge: 'Route guide · Switzerland',
    customSEO: { en: { title: 'Interlaken to Lauterbrunnen Train: 20 min, from €10', description: 'Scenic BOB train from Interlaken to Lauterbrunnen in just 20 minutes. Check today\'s schedule and book tickets from €10.' } },
    localInsight: {
      en: 'The valley you\'re riding into has around 72 waterfalls dropping from its sheer rock walls, one of the highest concentrations found anywhere in the Alps — the 20-minute ride ends practically at the foot of Staubbach Falls, visible right from the village.',
      es: 'El valle al que llega este tren tiene unas 72 cascadas que caen desde sus paredes de roca vertical, una de las mayores concentraciones de cascadas de todos los Alpes — el trayecto de 20 minutos termina prácticamente a los pies de la cascada de Staubbach, visible desde el mismo pueblo.',
      fr: 'La vallée dans laquelle mène ce train compte environ 72 cascades tombant de ses parois rocheuses abruptes, l\'une des plus fortes concentrations de tout les Alpes — le trajet de 20 minutes se termine pratiquement au pied de la cascade de Staubbach, visible depuis le village lui-même.',
      it: 'La valle in cui porta questo treno conta circa 72 cascate che precipitano dalle sue pareti rocciose a picco, una delle maggiori concentrazioni di tutte le Alpi — il tragitto di 20 minuti termina praticamente ai piedi della cascata di Staubbach, visibile direttamente dal paese.'
    }
  },
  { slug: 'lisbon-porto', from: 'Lisbon', to: 'Porto', country: 'Portugal', duration: '2h 30m', operator: 'CP', price: '€15-25', badge: 'Route guide · Portugal',
    customSEO: { en: { title: 'Lisbon to Porto by Train: 2h30 CP, from €15', description: 'Direct CP from Lisbon to Porto in 2h30. Compare today\'s schedule and book fares from €15 — no layovers.' } },
    localInsight: {
      en: 'The fastest services on this route are CP\'s Alfa Pendular trains, which use tilting technology to take curves at higher speed without passengers feeling it — the same basic principle used by Italy\'s Pendolino trains, and the reason this line can run fast on track that wasn\'t built as a dedicated high-speed line.',
      es: 'Los servicios más rápidos de esta ruta son los trenes Alfa Pendular de CP, que usan tecnología pendular para tomar las curvas a mayor velocidad sin que se note dentro del tren — el mismo principio que usan los Pendolino italianos, y la razón por la que esta línea puede ser rápida aunque no se construyó como línea de alta velocidad dedicada.',
      fr: 'Les services les plus rapides de cette ligne sont les trains Alfa Pendular de CP, qui utilisent une technologie pendulaire pour prendre les virages à plus grande vitesse sans que cela se ressente à bord — le même principe que les Pendolino italiens, et la raison pour laquelle cette ligne peut rouler vite sans avoir été construite comme ligne à grande vitesse dédiée.',
      it: 'I servizi più veloci su questa tratta sono i treni Alfa Pendular di CP, che usano la tecnologia pendolare per affrontare le curve a velocità maggiore senza che si avverta a bordo — lo stesso principio dei Pendolino italiani, ed è per questo che questa linea può essere veloce pur non essendo stata costruita come linea ad alta velocità dedicata.'
    }
  },
  { slug: 'london-amsterdam', from: 'London', to: 'Amsterdam', country: 'UK-Netherlands', duration: '4h 00m', operator: 'Eurostar', price: '€50-80', badge: 'Route guide · UK-Netherlands',
    customSEO: { en: { title: 'London to Amsterdam by Train: 4h Eurostar, from €50', description: 'Direct Eurostar from London to Amsterdam in 4 hours, city centre to city centre. Compare today\'s fares from €50.' } },
    localInsight: {
      en: 'This became a genuinely direct, two-way service only in 2020, once UK border control facilities were completed at Amsterdam Centraal — before that, London-bound passengers had to get off and clear border checks in Brussels partway through the journey, even though the train itself didn\'t change.',
      es: 'Este servicio se volvió realmente directo y en ambos sentidos recién en 2020, cuando se completaron las instalaciones de control fronterizo británico en Amsterdam Centraal — antes, los pasajeros con destino a Londres tenían que bajar y pasar el control fronterizo en Bruselas a mitad de camino, aunque el tren en sí no cambiara.',
      fr: 'Ce service n\'est devenu vraiment direct dans les deux sens qu\'en 2020, une fois les installations de contrôle frontalier britannique terminées à Amsterdam Centraal — avant cela, les passagers en direction de Londres devaient descendre et passer le contrôle frontalier à Bruxelles en cours de route, même si le train lui-même ne changeait pas.',
      it: 'Questo servizio è diventato realmente diretto in entrambe le direzioni solo nel 2020, quando sono state completate le strutture di controllo di frontiera britannico ad Amsterdam Centraal — prima, i passeggeri diretti a Londra dovevano scendere e passare il controllo di frontiera a Bruxelles a metà viaggio, anche se il treno stesso non cambiava.'
    }
  },
  { slug: 'london-brussels', from: 'London', to: 'Brussels', country: 'UK-Belgium', duration: '2h 00m', operator: 'Eurostar', price: '€40-70', badge: 'Route guide · UK-Belgium',
    customSEO: { en: { title: 'London to Brussels Train: 2h, from €40', description: 'Eurostar connection from London to Brussels in 2 hours. Check live schedules and book tickets from €40.' } },
    localInsight: {
      en: 'This was one of the two original Eurostar routes when cross-Channel service began in November 1994, alongside London-Paris — Brussels only became a fully independent, non-stop route somewhat later, as early Eurostar timetables sometimes ran Brussels services via Lille rather than direct.',
      es: 'Esta fue una de las dos rutas originales de Eurostar cuando el servicio a través del Canal comenzó en noviembre de 1994, junto con Londres-París — Bruselas se convirtió en ruta directa e independiente algo más tarde, ya que los primeros horarios de Eurostar a veces hacían pasar los servicios a Bruselas por Lille en vez de ir directos.',
      fr: 'C\'était l\'une des deux lignes Eurostar d\'origine lorsque le service transmanche a débuté en novembre 1994, aux côtés de Londres-Paris — Bruxelles n\'est devenue une liaison directe et indépendante que plus tard, les premiers horaires Eurostar faisant parfois transiter les services vers Bruxelles par Lille plutôt qu\'en direct.',
      it: 'Questa fu una delle due linee Eurostar originali quando il servizio attraverso la Manica iniziò nel novembre 1994, insieme a Londra-Parigi — Bruxelles divenne una tratta diretta e indipendente solo più tardi, dato che i primi orari Eurostar a volte facevano passare i servizi per Bruxelles via Lille anziché diretti.'
    }
  },
  { slug: 'london-cambridge', from: 'London', to: 'Cambridge', country: 'UK', duration: '0h 50m', operator: 'Thameslink', price: '€15-25', badge: 'Route guide · UK',
    customSEO: { en: { title: 'London to Cambridge Train Guide: 50 min on Thameslink', description: 'Everything you need for the London to Cambridge train: 50 minutes on Thameslink, fares from €15, and today\'s live schedule.' } } },
  { slug: 'london-edinburgh', from: 'London', to: 'Edinburgh', country: 'UK', duration: '4h 30m', operator: 'LNER', price: '€30-60', badge: 'Route guide · UK',
    customSEO: { en: { title: 'How to Get from London to Edinburgh by Train (4h30)', description: 'The London to Edinburgh train takes 4h30 on LNER. See today\'s departures and book tickets from €30.' } },
    localInsight: {
      en: 'This is the East Coast Main Line, the route the streamlined steam locomotive Mallard used in 1938 to set the world speed record for a steam train — 126 mph (203 km/h), a record that still stands today. Further north the line crosses the Royal Border Bridge at Berwick-upon-Tweed, with open sea views along the Northumberland coast.',
      es: 'Esta es la East Coast Main Line, la ruta que la locomotora de vapor aerodinámica Mallard usó en 1938 para batir el récord mundial de velocidad de un tren a vapor — 203 km/h, un récord que sigue vigente hoy. Más al norte, la línea cruza el Royal Border Bridge en Berwick-upon-Tweed, con vistas al mar abierto a lo largo de la costa de Northumberland.',
      fr: 'C\'est la East Coast Main Line, la ligne empruntée en 1938 par la locomotive à vapeur profilée Mallard pour établir le record du monde de vitesse pour un train à vapeur — 203 km/h, un record toujours en vigueur aujourd\'hui. Plus au nord, la ligne traverse le Royal Border Bridge à Berwick-upon-Tweed, avec vue sur la mer le long de la côte du Northumberland.',
      it: 'Questa è la East Coast Main Line, la linea percorsa nel 1938 dalla locomotiva a vapore aerodinamica Mallard per stabilire il record mondiale di velocità per un treno a vapore — 203 km/h, record tuttora imbattuto. Più a nord, la linea attraversa il Royal Border Bridge a Berwick-upon-Tweed, con vista sul mare aperto lungo la costa del Northumberland.'
    }
  },
  { slug: 'london-liverpool', from: 'London', to: 'Liverpool', country: 'UK', duration: '2h 15m', operator: 'Avanti', price: '€20-40', badge: 'Route guide · UK',
    customSEO: { en: { title: 'London to Liverpool by Train: 2h15 Avanti, from €20', description: 'Direct Avanti from London to Liverpool in 2h15. Compare today\'s schedule and book fares from €20 — no layovers.' } } },
  { slug: 'london-manchester', from: 'London', to: 'Manchester', country: 'UK', duration: '2h 00m', operator: 'Avanti', price: '€20-40', badge: 'Route guide · UK',
    customSEO: { en: { title: 'London to Manchester Train: 2h, from €20', description: 'Avanti connection from London to Manchester in 2 hours. Check live schedules and book tickets from €20.' } },
    localInsight: {
      en: 'This runs on the West Coast Main Line, one of the busiest mixed-traffic railways in Europe, electrified in stages through the 1960s and 70s — long before most of the continent\'s high-speed lines existed. A dedicated new high-speed line to relieve it (HS2) was originally planned to reach Manchester, but that northern leg was cancelled in 2023.',
      es: 'Circula por la West Coast Main Line, una de las líneas ferroviarias de tráfico mixto más transitadas de Europa, electrificada por etapas durante los años 60 y 70 — mucho antes de que existieran la mayoría de las líneas de alta velocidad del continente. Se había planeado una nueva línea de alta velocidad dedicada para aliviarla (HS2) que llegaría hasta Manchester, pero ese tramo norte se canceló en 2023.',
      fr: 'Cette ligne emprunte la West Coast Main Line, l\'une des lignes ferroviaires à trafic mixte les plus fréquentées d\'Europe, électrifiée par étapes dans les années 1960 et 1970 — bien avant l\'existence de la plupart des lignes à grande vitesse du continent. Une nouvelle ligne à grande vitesse dédiée pour la désengorger (HS2) devait initialement atteindre Manchester, mais ce tronçon nord a été annulé en 2023.',
      it: 'Percorre la West Coast Main Line, una delle linee ferroviarie a traffico misto più trafficate d\'Europa, elettrificata a tappe negli anni \'60 e \'70 — molto prima che esistessero la maggior parte delle linee ad alta velocità del continente. Una nuova linea ad alta velocità dedicata per alleggerirla (HS2) era originariamente prevista fino a Manchester, ma quel tratto settentrionale è stato cancellato nel 2023.'
    }
  },
  { slug: 'london-oxford', from: 'London', to: 'Oxford', country: 'UK', duration: '1h 00m', operator: 'GWR', price: '€15-25', badge: 'Route guide · UK',
    customSEO: { en: { title: 'London to Oxford Train Guide: 1h on GWR', description: 'Everything you need for the London to Oxford train: 1 hour on GWR, fares from €15, and today\'s live schedule.' } },
    localInsight: {
      en: 'Oxford railway station is genuinely close to the city centre — a 15-20 minute walk to most of the historic colleges — unlike many university towns where the station sits well outside the old centre. That makes this one of the rare routes where you can leave from a London terminus and be looking at Christ Church or the Bodleian within about an hour and a quarter, door to door.',
      es: 'La estación de tren de Oxford está realmente cerca del centro — a 15-20 minutos a pie de la mayoría de los colleges históricos — a diferencia de muchas ciudades universitarias donde la estación queda bastante alejada del centro antiguo. Eso hace que esta sea una de las pocas rutas donde se puede salir de una terminal de Londres y estar frente a Christ Church o la Bodleian Library en poco más de una hora, puerta a puerta.',
      fr: 'La gare d\'Oxford est vraiment proche du centre-ville — à 15-20 minutes à pied de la plupart des collèges historiques — contrairement à de nombreuses villes universitaires où la gare se trouve bien à l\'écart du vieux centre. C\'est l\'un des rares trajets où l\'on peut quitter une gare terminale de Londres et se retrouver devant Christ Church ou la Bodleian Library en un peu plus d\'une heure, porte à porte.',
      it: 'La stazione ferroviaria di Oxford è davvero vicina al centro — a 15-20 minuti a piedi dalla maggior parte dei college storici — a differenza di molte città universitarie dove la stazione si trova ben lontana dal centro antico. Questo rende questo uno dei pochi percorsi in cui si può partire da un capolinea londinese e trovarsi davanti a Christ Church o alla Bodleian Library in poco più di un\'ora, porta a porta.'
    }
  },
  { slug: 'london-paris', from: 'London', to: 'Paris', country: 'UK-France', duration: '2h 30m', operator: 'Eurostar', price: '€50-80', badge: 'Route guide · UK-France',
    customSEO: { en: { title: 'How to Get from London to Paris by Train (2h30)', description: 'The London to Paris train takes 2h30 on Eurostar. See today\'s departures and book tickets from €50.' } },
    localInsight: {
      en: 'Eurostar originally departed from London Waterloo, not St Pancras — the move to St Pancras International only happened in 2007, after a major restoration of the station\'s Victorian train shed specifically to host the faster High Speed 1 line into London, which also shaved about 20 minutes off the journey.',
      es: 'Eurostar salía originalmente de London Waterloo, no de St Pancras — la mudanza a St Pancras International recién ocurrió en 2007, tras una gran restauración de la nave ferroviaria victoriana de la estación pensada específicamente para recibir la línea más rápida High Speed 1 hacia Londres, que además recortó unos 20 minutos al viaje.',
      fr: 'Eurostar partait à l\'origine de London Waterloo, pas de St Pancras — le déménagement vers St Pancras International n\'a eu lieu qu\'en 2007, après une importante restauration de la halle ferroviaire victorienne de la gare, spécifiquement pour accueillir la ligne plus rapide High Speed 1 vers Londres, qui a aussi réduit le trajet d\'environ 20 minutes.',
      it: 'Eurostar partiva in origine da London Waterloo, non da St Pancras — il trasferimento a St Pancras International avvenne solo nel 2007, dopo un grande restauro della navata ferroviaria vittoriana della stazione, pensato appositamente per ospitare la linea più veloce High Speed 1 verso Londra, che ha anche ridotto il viaggio di circa 20 minuti.'
    }
  },
  { slug: 'london-york', from: 'London', to: 'York', country: 'UK', duration: '2h 00m', operator: 'LNER', price: '€20-40', badge: 'Route guide · UK',
    customSEO: { en: { title: 'London to York by Train: 2h LNER, from €20', description: 'Direct LNER from London to York in 2 hours. Compare today\'s schedule and book fares from €20 — no layovers.' } },
    localInsight: {
      en: 'This runs on the same East Coast Main Line as the London-Edinburgh route, and York itself has one of the most significant roles in British railway history — its National Railway Museum, right next to the station, holds one of the largest collections of historic locomotives in the world, including a Japanese bullet train given as a diplomatic gift.',
      es: 'Circula por la misma East Coast Main Line que la ruta Londres-Edimburgo, y York tiene un papel muy importante en la historia ferroviaria británica — su Museo Nacional del Ferrocarril, justo al lado de la estación, alberga una de las colecciones de locomotoras históricas más grandes del mundo, incluido un tren bala japonés recibido como regalo diplomático.',
      fr: 'Cette ligne emprunte la même East Coast Main Line que la liaison Londres-Édimbourg, et York occupe une place particulièrement importante dans l\'histoire ferroviaire britannique — son National Railway Museum, juste à côté de la gare, abrite l\'une des plus grandes collections de locomotives historiques au monde, dont un train à grande vitesse japonais offert en cadeau diplomatique.',
      it: 'Percorre la stessa East Coast Main Line della tratta Londra-Edimburgo, e York ha un ruolo particolarmente importante nella storia ferroviaria britannica — il suo National Railway Museum, proprio accanto alla stazione, ospita una delle più grandi collezioni di locomotive storiche al mondo, incluso uno shinkansen giapponese ricevuto come dono diplomatico.'
    }
  },
  { slug: 'lyon-turin', from: 'Lyon', to: 'Turin', country: 'France-Italy', duration: '4h 00m', operator: 'TGV', price: '€35-55', badge: 'Route guide · France-Italy',
    customSEO: { en: { title: 'Lyon to Turin Train: 4h, from €35', description: 'TGV connection from Lyon to Turin in 4 hours. Check live schedules and book tickets from €35.' } },
    localInsight: {
      en: 'This route crosses the Alps through the historic Fréjus rail tunnel, opened in 1871 as one of the first great Alpine tunnels — it still carries every Lyon–Turin train today. A new high-speed base tunnel is under construction nearby and will eventually cut journey times further once it opens.',
      es: 'Esta ruta cruza los Alpes por el histórico túnel ferroviario de Fréjus, inaugurado en 1871 como uno de los primeros grandes túneles alpinos — todavía hoy pasan por él todos los trenes entre Lyon y Turín. Cerca se está construyendo un nuevo túnel de alta velocidad que en el futuro reducirá aún más los tiempos de viaje.',
      fr: 'Cet itinéraire traverse les Alpes par le tunnel ferroviaire historique du Fréjus, ouvert en 1871 comme l\'un des premiers grands tunnels alpins — tous les trains Lyon–Turin l\'empruntent encore aujourd\'hui. Un nouveau tunnel de base à grande vitesse est en construction à proximité et réduira encore les temps de trajet une fois ouvert.',
      it: 'Questo percorso attraversa le Alpi tramite lo storico traforo ferroviario del Fréjus, aperto nel 1871 come uno dei primi grandi trafori alpini — ancora oggi lo percorrono tutti i treni Lione–Torino. Nelle vicinanze è in costruzione un nuovo tunnel di base ad alta velocità che in futuro ridurrà ulteriormente i tempi di viaggio.'
    }
  },
  { slug: 'madrid-barcelona', from: 'Madrid', to: 'Barcelona', country: 'Spain', duration: '2h 30m', operator: 'Renfe AVE', price: '€25-45', badge: 'Route guide · Spain',
    customSEO: { en: { title: 'Madrid to Barcelona Train Guide: 2h30 on Renfe AVE', description: 'Everything you need for the Madrid to Barcelona train: 2h30 on Renfe AVE, fares from €25, and today\'s live schedule.' } },
    localInsight: {
      en: 'This corridor was the first in Spain to see full open-access competition: Renfe AVE now shares the tracks with rivals Ouigo and iryo, so the same journey can carry three very different price points depending on the operator — worth checking all three before booking.',
      es: 'Este corredor fue el primero en España con competencia real entre operadores: Renfe AVE comparte las vías con Ouigo e iryo, así que el mismo trayecto puede tener tres precios muy distintos según el operador — conviene revisar los tres antes de reservar.',
      fr: 'Cette ligne a été la première en Espagne à connaître une concurrence complète en accès libre : Renfe AVE partage désormais les voies avec Ouigo et iryo, donc le même trajet peut avoir trois tarifs très différents selon l\'opérateur — mieux vaut comparer les trois avant de réserver.',
      it: 'Questa tratta è stata la prima in Spagna ad avere piena concorrenza tra operatori: Renfe AVE condivide i binari con i rivali Ouigo e iryo, quindi lo stesso viaggio può avere tre prezzi molto diversi a seconda dell\'operatore — conviene controllare tutti e tre prima di prenotare.'
    }
  },
  { slug: 'madrid-malaga', from: 'Madrid', to: 'Malaga', country: 'Spain', duration: '2h 30m', operator: 'Renfe AVE', price: '€25-45', badge: 'Route guide · Spain',
    customSEO: { en: { title: 'How to Get from Madrid to Malaga by Train (2h30)', description: 'The Madrid to Malaga train takes 2h30 on Renfe AVE. See today\'s departures and book tickets from €25.' } },
    localInsight: {
      en: 'This line crosses through the Sierra Morena mountains via a series of tunnels and viaducts built specifically for high-speed running — engineering that let AVE trains reach the Costa del Sol without following the older, much slower conventional route that used to wind through the hills.',
      es: 'Esta línea atraviesa Sierra Morena por una serie de túneles y viaductos construidos específicamente para la alta velocidad — una ingeniería que permitió a los trenes AVE llegar hasta la Costa del Sol sin seguir la antigua ruta convencional, mucho más lenta, que serpenteaba por las sierras.',
      fr: 'Cette ligne traverse la Sierra Morena par une série de tunnels et de viaducs construits spécifiquement pour la grande vitesse — une ingénierie qui a permis aux trains AVE d\'atteindre la Costa del Sol sans suivre l\'ancienne ligne classique, bien plus lente, qui serpentait auparavant à travers les collines.',
      it: 'Questa linea attraversa la Sierra Morena tramite una serie di gallerie e viadotti costruiti appositamente per l\'alta velocità — un\'ingegneria che ha permesso ai treni AVE di raggiungere la Costa del Sol senza seguire il vecchio percorso convenzionale, molto più lento, che un tempo serpeggiava tra le colline.'
    }
  },
  { slug: 'madrid-seville', from: 'Madrid', to: 'Seville', country: 'Spain', duration: '2h 30m', operator: 'Renfe AVE', price: '€25-45', badge: 'Route guide · Spain',
    customSEO: { en: { title: 'Madrid to Seville by Train: 2h30 Renfe AVE, from €25', description: 'Direct Renfe AVE from Madrid to Seville in 2h30. Compare today\'s schedule and book fares from €25 — no layovers.' } },
    localInsight: {
      en: 'This is where Spanish high-speed rail began: the line opened in 1992 for Expo Seville, making it Spain\'s first AVE route and one of the earliest true high-speed lines outside France, Germany and Japan.',
      es: 'Aquí nació la alta velocidad en España: la línea se inauguró en 1992 para la Expo de Sevilla, siendo la primera ruta AVE del país y una de las primeras líneas de alta velocidad del mundo fuera de Francia, Alemania y Japón.',
      fr: 'C\'est ici qu\'est née la grande vitesse espagnole : la ligne a ouvert en 1992 pour l\'Exposition universelle de Séville, devenant la toute première ligne AVE du pays et l\'une des premières lignes à grande vitesse au monde hors France, Allemagne et Japon.',
      it: 'È qui che è nata l\'alta velocità spagnola: la linea aprì nel 1992 per l\'Expo di Siviglia, diventando la prima tratta AVE del paese e una delle prime linee ad alta velocità al mondo fuori da Francia, Germania e Giappone.'
    }
  },
  { slug: 'madrid-valencia', from: 'Madrid', to: 'Valencia', country: 'Spain', duration: '1h 40m', operator: 'Renfe AVE', price: '€20-35', badge: 'Route guide · Spain',
    customSEO: { en: { title: 'Madrid to Valencia Train: 1h40, from €20', description: 'Renfe AVE connection from Madrid to Valencia in 1h40. Check live schedules and book tickets from €20.' } },
    localInsight: {
      en: 'Most of this line crosses the flat plains of La Mancha, which means very few curves and long stretches where the train can hold close to its top speed — one of the reasons it covers the roughly 300km gap in well under two hours, among the fastest average speeds on the Spanish AVE network.',
      es: 'La mayor parte de esta línea cruza las llanuras de La Mancha, lo que se traduce en muy pocas curvas y largos tramos donde el tren puede mantener casi su velocidad máxima — una de las razones por las que cubre los cerca de 300 km en bastante menos de dos horas, una de las velocidades medias más altas de toda la red AVE española.',
      fr: 'La majeure partie de cette ligne traverse les plaines plates de La Manche, ce qui signifie très peu de virages et de longs tronçons où le train peut maintenir près de sa vitesse maximale — l\'une des raisons pour lesquelles elle couvre les quelque 300 km en bien moins de deux heures, l\'une des vitesses moyennes les plus élevées du réseau AVE espagnol.',
      it: 'La maggior parte di questa linea attraversa le pianure de La Mancha, il che significa pochissime curve e lunghi tratti in cui il treno può mantenere quasi la sua velocità massima — uno dei motivi per cui copre i circa 300 km in ben meno di due ore, una delle velocità medie più alte dell\'intera rete AVE spagnola.'
    }
  },
  { slug: 'madrid-zaragoza', from: 'Madrid', to: 'Zaragoza', country: 'Spain', duration: '1h 30m', operator: 'Renfe AVE', price: '€15-25', badge: 'Route guide · Spain',
    customSEO: { en: { title: 'Madrid to Zaragoza Train: 1h30 AVE, from €15', description: 'High-speed Renfe AVE from Madrid to Zaragoza in 1.5 hours. Compare live schedules and book tickets from €15.' } } },
  { slug: 'marseille-miramas', from: 'Marseille', to: 'Miramas', country: 'France', duration: '0h 45m', operator: 'SNCF TER', price: '€10-15', badge: 'Route guide · France',
    customSEO: { en: { title: 'Marseille to Miramas Train Guide: 45 min on SNCF TER', description: 'Everything you need for the Marseille to Miramas train: 45 minutes on SNCF TER, fares from €10, and today\'s live schedule.' } },
    localInsight: {
      en: 'Part of this ride skirts the Étang de Berre, one of the largest saltwater lagoons in France — a striking contrast of industrial refineries on one shore and quiet fishing villages on the other, all visible from the train within the same short journey.',
      es: 'Parte de este trayecto bordea el Étang de Berre, una de las lagunas de agua salada más grandes de Francia — un contraste llamativo entre refinerías industriales en una orilla y tranquilos pueblos de pescadores en la otra, todo visible desde el tren en un mismo trayecto corto.',
      fr: 'Une partie de ce trajet longe l\'étang de Berre, l\'un des plus grands étangs d\'eau salée de France — un contraste saisissant entre les raffineries industrielles d\'une rive et les paisibles villages de pêcheurs de l\'autre, le tout visible depuis le train sur un même court trajet.',
      it: 'Parte di questo tragitto costeggia l\'Étang de Berre, una delle più grandi lagune di acqua salata della Francia — un contrasto sorprendente tra raffinerie industriali su una sponda e tranquilli villaggi di pescatori sull\'altra, tutto visibile dal treno in un unico breve tragitto.'
    }
  },
  { slug: 'milan-florence', from: 'Milan', to: 'Florence', country: 'Italy', duration: '1h 45m', operator: 'Trenitalia', price: '€20-35', badge: 'Route guide · Italy',
    customSEO: { en: { title: 'How to Get from Milan to Florence by Train (1h45)', description: 'The Milan to Florence train takes 1h45 on Trenitalia. See today\'s departures and book tickets from €20.' } } },
  { slug: 'milan-rome', from: 'Milan', to: 'Rome', country: 'Italy', duration: '3h 00m', operator: 'Trenitalia', price: '€30-50', badge: 'Route guide · Italy',
    customSEO: { en: { title: 'Milan to Rome by Train: 3h Trenitalia, from €30', description: 'Direct high-speed Trenitalia from Milan to Rome in 3 hours. Compare today\'s schedule and book fares from €30 — no layovers.' } },
    localInsight: {
      en: 'This corridor is where Italo (NTV) launched in 2011 as the first open-access competitor to run its own high-speed trains on a state-owned network anywhere in Europe — breaking Trenitalia\'s monopoly years before similar competition arrived in Spain or elsewhere. The two operators still go head to head on this exact line today.',
      es: 'En este corredor Italo (NTV) se lanzó en 2011 como el primer competidor de acceso abierto en operar sus propios trenes de alta velocidad en una red estatal en toda Europa — rompiendo el monopolio de Trenitalia años antes de que llegara una competencia similar a España o a otros países. Los dos operadores todavía compiten cara a cara en esta misma línea hoy.',
      fr: 'C\'est sur ce corridor qu\'Italo (NTV) a été lancé en 2011 comme premier concurrent en accès libre à exploiter ses propres trains à grande vitesse sur un réseau public, une première en Europe — mettant fin au monopole de Trenitalia des années avant qu\'une concurrence similaire n\'arrive en Espagne ou ailleurs. Les deux opérateurs s\'affrontent toujours directement sur cette même ligne aujourd\'hui.',
      it: 'È su questa tratta che Italo (NTV) ha debuttato nel 2011 come primo concorrente ad accesso libero a gestire propri treni ad alta velocità su una rete statale in tutta Europa — rompendo il monopolio di Trenitalia anni prima che una concorrenza simile arrivasse in Spagna o altrove. I due operatori si sfidano ancora oggi direttamente su questa stessa linea.'
    }
  },
  { slug: 'milan-zurich', from: 'Milan', to: 'Zurich', country: 'Italy-Switzerland', duration: '3h 30m', operator: 'SBB', price: '€35-55', badge: 'Route guide · Italy-Switzerland',
    customSEO: { en: { title: 'Milan to Zurich Train: 3h30 scenic SBB, from €35', description: 'Direct SBB train from Milan to Zurich through the Alps in 3.5 hours. Compare today\'s schedule and book fares from €35.' } },
    localInsight: {
      en: 'Most of these trains now pass through the Gotthard Base Tunnel, opened in 2016 at 57km the longest railway tunnel in the world, which cut roughly an hour off the old route over the Gotthard Pass. The historic mountain line — with its spiral tunnels climbing the pass — still exists and is used by some regional and scenic services.',
      es: 'La mayoría de estos trenes pasan hoy por el túnel de base del Gotardo, inaugurado en 2016 y con 57 km el túnel ferroviario más largo del mundo, que recortó cerca de una hora respecto a la antigua ruta por el paso del Gotardo. La histórica línea de montaña — con sus túneles en espiral que suben el paso — sigue existiendo y la usan algunos servicios regionales y panorámicos.',
      fr: 'La plupart de ces trains passent désormais par le tunnel de base du Saint-Gothard, ouvert en 2016 et long de 57 km, le plus long tunnel ferroviaire du monde, qui a réduit d\'environ une heure l\'ancien trajet par le col du Saint-Gothard. La ligne de montagne historique — avec ses tunnels en spirale qui grimpent le col — existe toujours et est utilisée par certains trains régionaux et panoramiques.',
      it: 'La maggior parte di questi treni passa ora dal tunnel di base del Gottardo, aperto nel 2016 e lungo 57 km, il tunnel ferroviario più lungo al mondo, che ha tagliato circa un\'ora rispetto al vecchio percorso sul passo del Gottardo. La storica linea di montagna — con le sue gallerie elicoidali che salgono al passo — esiste ancora ed è usata da alcuni servizi regionali e panoramici.'
    }
  },
  { slug: 'montreux-interlaken', from: 'Montreux', to: 'Interlaken', country: 'Switzerland', duration: '2h 00m', operator: 'SBB', price: '€25-40', badge: 'Route guide · Switzerland',
    customSEO: { en: { title: 'Montreux to Interlaken by Train: 2h SBB, from €25', description: 'Direct SBB from Montreux to Interlaken in 2 hours. Compare today\'s schedule and book fares from €25 — no layovers.' } } },
  { slug: 'munich-berlin', from: 'Munich', to: 'Berlin', country: 'Germany', duration: '4h 00m', operator: 'DB ICE', price: '€35-55', badge: 'Route guide · Germany',
    customSEO: { en: { title: 'Munich to Berlin by Train: 4h ICE, from €35', description: 'Direct DB ICE high-speed train from Munich to Berlin in 4 hours. Check today\'s schedule and book tickets from €35.' } },
    localInsight: {
      en: 'The journey time dropped from around 6 hours to roughly 4 in December 2017, when new high-speed sections through Thuringia opened as part of one of Germany\'s largest rail projects — including several long tunnels cut through the hills between Nuremberg and Erfurt that let trains run at up to 300 km/h on a stretch that used to be slow, winding track.',
      es: 'El tiempo de viaje bajó de unas 6 horas a alrededor de 4 en diciembre de 2017, cuando se inauguraron nuevos tramos de alta velocidad por Turingia como parte de uno de los mayores proyectos ferroviarios de Alemania — con varios túneles largos excavados en las colinas entre Núremberg y Erfurt que permiten a los trenes circular hasta a 300 km/h en un tramo que antes era una vía lenta y sinuosa.',
      fr: 'Le temps de trajet est passé d\'environ 6 heures à environ 4 heures en décembre 2017, avec l\'ouverture de nouvelles sections à grande vitesse en Thuringe, dans le cadre de l\'un des plus grands projets ferroviaires allemands — avec plusieurs longs tunnels creusés dans les collines entre Nuremberg et Erfurt permettant aux trains de rouler jusqu\'à 300 km/h sur un tronçon autrefois lent et sinueux.',
      it: 'Il tempo di viaggio è sceso da circa 6 ore a circa 4 nel dicembre 2017, quando sono state aperte nuove tratte ad alta velocità in Turingia come parte di uno dei più grandi progetti ferroviari tedeschi — con diverse lunghe gallerie scavate tra le colline fra Norimberga ed Erfurt che permettono ai treni di viaggiare fino a 300 km/h su un tratto un tempo lento e tortuoso.'
    }
  },
  { slug: 'munich-prague', from: 'Munich', to: 'Prague', country: 'Germany-Czech', duration: '4h 00m', operator: 'DB ČD', price: '€30-50', badge: 'Route guide · Germany-Czech',
    customSEO: { en: { title: 'Munich to Prague Train: 4h, from €30', description: 'DB ČD connection from Munich to Prague in 4 hours. Check live schedules and book tickets from €30.' } },
    localInsight: {
      en: 'Journey times on this route dropped noticeably after track upgrades in the 2010s cut out some of the slower sections through Bavaria and Bohemia — before then, the Munich-Prague trip regularly took close to 6 hours rather than the roughly 4 it takes today.',
      es: 'Los tiempos de viaje en esta ruta bajaron de forma notable tras mejoras en la vía en la década de 2010 que eliminaron algunos de los tramos más lentos por Baviera y Bohemia — antes, el trayecto Múnich-Praga solía tardar cerca de 6 horas en vez de las 4 que toma hoy.',
      fr: 'Les temps de trajet sur cette ligne ont nettement baissé après des travaux de modernisation de la voie dans les années 2010, qui ont supprimé certains des tronçons les plus lents à travers la Bavière et la Bohême — auparavant, le trajet Munich-Prague prenait régulièrement près de 6 heures contre environ 4 aujourd\'hui.',
      it: 'I tempi di viaggio su questa tratta sono diminuiti sensibilmente dopo i lavori di ammodernamento dei binari negli anni 2010, che hanno eliminato alcuni dei tratti più lenti attraverso Baviera e Boemia — prima, il viaggio Monaco-Praga richiedeva regolarmente quasi 6 ore contro le circa 4 di oggi.'
    }
  },
  { slug: 'munich-venice', from: 'Munich', to: 'Venice', country: 'Germany-Italy', duration: '6h 00m', operator: 'ÖBB', price: '€40-60', badge: 'Route guide · Germany-Italy',
    customSEO: { en: { title: 'Munich to Venice by Train: 6h scenic route, from €40', description: 'Direct ÖBB train from Munich to Venice through the Alps in 6 hours. Compare today\'s schedule and book fares from €40.' } },
    localInsight: {
      en: 'The train climbs to the Brenner Pass, at about 1,370m one of the lowest and oldest crossings of the main Alpine chain — used by traders and travellers for centuries before the railway existed. A new Brenner Base Tunnel is being built underneath to shorten this leg in the years ahead.',
      es: 'El tren sube hasta el paso del Brenner, que a unos 1.370 m es uno de los cruces más bajos y antiguos de la cadena principal de los Alpes — usado por comerciantes y viajeros durante siglos antes de que existiera el ferrocarril. Debajo se está construyendo un nuevo túnel de base del Brenner que en los próximos años acortará este tramo.',
      fr: 'Le train monte jusqu\'au col du Brenner, qui à environ 1 370 m est l\'un des passages les plus bas et les plus anciens de la chaîne alpine principale — emprunté par les marchands et les voyageurs pendant des siècles avant l\'existence du chemin de fer. Un nouveau tunnel de base du Brenner est en construction en dessous et raccourcira ce trajet dans les années à venir.',
      it: 'Il treno sale fino al Passo del Brennero, che a circa 1.370 m è uno dei valichi più bassi e antichi della catena alpina principale — usato da mercanti e viaggiatori per secoli prima che esistesse la ferrovia. Sotto è in costruzione un nuovo tunnel di base del Brennero che nei prossimi anni accorcerà questo tratto.'
    }
  },
  { slug: 'munich-vienna', from: 'Munich', to: 'Vienna', country: 'Germany-Austria', duration: '4h 30m', operator: 'Railjet', price: '€35-55', badge: 'Route guide · Germany-Austria',
    customSEO: { en: { title: 'Munich to Vienna Train Guide: 4h30 on Railjet', description: 'Everything you need for the Munich to Vienna train: 4h30 on Railjet, fares from €35, and today\'s live schedule.' } },
    localInsight: {
      en: 'This is one of the busiest daytime international corridors in central Europe, run jointly by ÖBB and Deutsche Bahn with Railjet trains that also continue on to Budapest for some services — meaning the same physical train can connect three national capitals across a single day\'s schedule.',
      es: 'Es uno de los corredores internacionales diurnos más transitados de Europa central, operado conjuntamente por ÖBB y Deutsche Bahn con trenes Railjet que en algunos servicios continúan hasta Budapest — es decir, el mismo tren físico puede conectar tres capitales nacionales en un solo horario del día.',
      fr: 'C\'est l\'un des corridors internationaux diurnes les plus fréquentés d\'Europe centrale, exploité conjointement par ÖBB et la Deutsche Bahn avec des trains Railjet qui, pour certains services, continuent jusqu\'à Budapest — le même train physique peut donc relier trois capitales nationales dans une seule grille horaire de la journée.',
      it: 'È uno dei corridoi internazionali diurni più trafficati dell\'Europa centrale, gestito congiuntamente da ÖBB e Deutsche Bahn con treni Railjet che per alcuni servizi proseguono fino a Budapest — lo stesso treno fisico può quindi collegare tre capitali nazionali in un unico orario giornaliero.'
    }
  },
  { slug: 'naples-salerno', from: 'Naples', to: 'Salerno', country: 'Italy', duration: '0h 40m', operator: 'Trenitalia', price: '€5-10', badge: 'Route guide · Italy',
    customSEO: { en: { title: 'Naples to Salerno Train: 40 min, from €5', description: 'Quick Trenitalia connection from Naples to Salerno in about 40 minutes. Check live times and book tickets from €5.' } },
    localInsight: {
      en: 'Salerno is often overlooked, but it works as a quieter rail gateway to the Amalfi Coast — buses to Amalfi and Positano leave right from outside the station, with noticeably shorter queues than the equivalent connections from the more crowded Sorrento side.',
      es: 'Salerno suele pasarse por alto, pero funciona como una puerta de entrada ferroviaria más tranquila a la Costa Amalfitana — los autobuses a Amalfi y Positano salen justo desde fuera de la estación, con colas notablemente más cortas que las conexiones equivalentes desde el lado más abarrotado de Sorrento.',
      fr: 'Salerne est souvent négligée, mais elle fonctionne comme une porte d\'entrée ferroviaire plus tranquille vers la côte amalfitaine — les bus pour Amalfi et Positano partent juste devant la gare, avec des files d\'attente nettement plus courtes que les liaisons équivalentes depuis le côté plus bondé de Sorrente.',
      it: 'Salerno è spesso trascurata, ma funziona come una porta d\'accesso ferroviaria più tranquilla alla Costiera Amalfitana — gli autobus per Amalfi e Positano partono proprio davanti alla stazione, con code decisamente più corte rispetto ai collegamenti equivalenti dal lato più affollato di Sorrento.'
    }
  },
  { slug: 'naples-sorrento', from: 'Naples', to: 'Sorrento', country: 'Italy', duration: '1h 00m', operator: 'Circumvesuviana', price: '€5-10', badge: 'Route guide · Italy',
    customSEO: { en: { title: 'How to Get from Naples to Sorrento by Train (1h)', description: 'The Naples to Sorrento train takes 1 hour on Circumvesuviana. See today\'s departures and book tickets from €5.' } },
    localInsight: {
      en: 'The Circumvesuviana line, as its name suggests, circles the base of Mount Vesuvius — meaning this ride also passes close to the ruins of Pompeii and Herculaneum, the ancient towns Vesuvius buried in AD 79, making it possible to combine Pompeii and Sorrento on the same line without a car.',
      es: 'La línea Circumvesuviana, como indica su nombre, rodea la base del Vesubio — lo que significa que este trayecto también pasa cerca de las ruinas de Pompeya y Herculano, las ciudades antiguas que el Vesubio sepultó en el año 79 d.C., permitiendo combinar Pompeya y Sorrento en la misma línea sin necesidad de auto.',
      fr: 'La ligne Circumvesuviana, comme son nom l\'indique, fait le tour de la base du Vésuve — ce qui signifie que ce trajet passe aussi près des ruines de Pompéi et d\'Herculanum, les villes antiques ensevelies par le Vésuve en l\'an 79, permettant de combiner Pompéi et Sorrente sur la même ligne sans voiture.',
      it: 'La linea Circumvesuviana, come suggerisce il nome, gira attorno alla base del Vesuvio — il che significa che questo tragitto passa anche vicino alle rovine di Pompei ed Ercolano, le antiche città sepolte dal Vesuvio nel 79 d.C., permettendo di combinare Pompei e Sorrento sulla stessa linea senza auto.'
    }
  },
  { slug: 'nice-monaco', from: 'Nice', to: 'Monaco', country: 'France', duration: '0h 20m', operator: 'SNCF TER', price: '€5-10', badge: 'Route guide · France',
    customSEO: { en: { title: 'Nice to Monaco Train: 20 min, from €5', description: 'Quick SNCF TER connection from Nice to Monaco in about 20 minutes along the coast. Check schedules and book from €5.' } },
    localInsight: {
      en: 'This short hop is part of the coastal line that hugs the Mediterranean between Nice and the Italian border, cutting through several tunnels carved into the cliffs. It\'s used as much by local commuters heading into Monaco for work as by visitors — trains run frequently and it\'s rarely worth timing it around a specific departure.',
      es: 'Este tramo corto forma parte de la línea costera que bordea el Mediterráneo entre Niza y la frontera con Italia, atravesando varios túneles excavados en los acantilados. Lo usan tanto los que viajan a diario a trabajar a Mónaco como los turistas — los trenes son frecuentes y casi nunca hace falta planificar un horario específico.',
      fr: 'Ce court trajet fait partie de la ligne côtière qui longe la Méditerranée entre Nice et la frontière italienne, traversant plusieurs tunnels creusés dans la falaise. Il est autant emprunté par les habitants qui se rendent au travail à Monaco que par les visiteurs — les trains sont fréquents et il est rarement utile de viser un horaire précis.',
      it: 'Questo breve tratto fa parte della linea costiera che costeggia il Mediterraneo tra Nizza e il confine italiano, attraversando diverse gallerie scavate nella scogliera. È usato tanto dai pendolari che vanno a lavorare a Monaco quanto dai visitatori — i treni sono frequenti ed è raro dover pianificare un orario preciso.'
    }
  },
  { slug: 'oslo-bergen', from: 'Oslo', to: 'Bergen', country: 'Norway', duration: '7h 00m', operator: 'Vy', price: '€50-80', badge: 'Route guide · Norway',
    customSEO: { en: { title: 'Oslo to Bergen by Train: 7h Vy, from €50', description: 'Direct Vy from Oslo to Bergen in 7 hours. Compare today\'s schedule and book fares from €50 — no layovers.' } },
    localInsight: {
      en: 'This is the Bergensbanen, regularly ranked among the most scenic railways in the world. It crosses the Hardangervidda mountain plateau at up to about 1,222m, passing Finse station — the highest mainline station in Northern Europe, often snowbound well into summer.',
      es: 'Esta es la Bergensbanen, considerada habitualmente una de las líneas ferroviarias más espectaculares del mundo. Cruza la meseta montañosa de Hardangervidda hasta unos 1.222 m de altitud, pasando por la estación de Finse — la estación de una línea principal más alta del norte de Europa, cubierta de nieve a menudo hasta bien entrado el verano.',
      fr: 'C\'est la Bergensbanen, régulièrement classée parmi les lignes ferroviaires les plus spectaculaires du monde. Elle traverse le plateau montagneux du Hardangervidda jusqu\'à environ 1 222 m d\'altitude, en passant par la gare de Finse — la gare de ligne principale la plus haute d\'Europe du Nord, souvent enneigée jusqu\'en plein été.',
      it: 'Questa è la Bergensbanen, regolarmente considerata una delle linee ferroviarie più spettacolari al mondo. Attraversa l\'altopiano montano di Hardangervidda fino a circa 1.222 m di altitudine, passando per la stazione di Finse — la stazione di linea principale più alta del Nord Europa, spesso innevata fino a piena estate.'
    }
  },
  { slug: 'paris-amsterdam', from: 'Paris', to: 'Amsterdam', country: 'France-Netherlands', duration: '3h 30m', operator: 'Thalys', price: '€35-55', badge: 'Route guide · France-Netherlands',
    customSEO: { en: { title: 'Paris to Amsterdam by Train: 3h30 Thalys direct', description: 'Thalys direct from Paris to Amsterdam in 3.5 hours, fares from €35. Compare today\'s train times and book your seat in minutes.' } },
    localInsight: {
      en: 'Thalys, the operator long associated with this route, merged into the Eurostar brand in 2024 as part of a wider consolidation of European high-speed rail companies — so tickets and information for this line now appear under the Eurostar name, even though the trains and route are unchanged.',
      es: 'Thalys, el operador tradicionalmente asociado a esta ruta, se fusionó con la marca Eurostar en 2024 como parte de una consolidación más amplia de las empresas europeas de alta velocidad — así que los billetes e información de esta línea ahora aparecen bajo el nombre Eurostar, aunque los trenes y la ruta siguen siendo los mismos.',
      fr: 'Thalys, l\'opérateur longtemps associé à cette ligne, a fusionné avec la marque Eurostar en 2024 dans le cadre d\'une consolidation plus large des compagnies européennes à grande vitesse — les billets et informations pour cette ligne apparaissent donc désormais sous le nom Eurostar, même si les trains et l\'itinéraire restent inchangés.',
      it: 'Thalys, l\'operatore storicamente associato a questa tratta, è confluito nel marchio Eurostar nel 2024 come parte di un più ampio consolidamento delle compagnie europee ad alta velocità — quindi biglietti e informazioni per questa linea ora appaiono sotto il nome Eurostar, anche se treni e percorso restano gli stessi.'
    }
  },
  { slug: 'paris-barcelona', from: 'Paris', to: 'Barcelona', country: 'France-Spain', duration: '6h 30m', operator: 'TGV', price: '€50-80', badge: 'Route guide · France-Spain',
    customSEO: { en: { title: 'Paris to Barcelona Train: 6h30 direct TGV, from €50', description: 'Direct high-speed TGV from Paris to Barcelona in 6.5 hours, no layovers. Compare today\'s schedule and book fares from €50.' } },
    localInsight: {
      en: 'The direct TGV crosses into Spain at Perpignan–Figueres, running on track shared between the French and Spanish high-speed networks — one of the few places in Europe where a single high-speed train physically crosses from one country\'s rail system onto another\'s without stopping.',
      es: 'El TGV directo cruza a España por Perpignan–Figueres, sobre vías compartidas entre las redes de alta velocidad francesa y española — uno de los pocos puntos de Europa donde un tren de alta velocidad pasa físicamente de la red de un país a la de otro sin detenerse.',
      fr: 'Le TGV direct entre en Espagne à Perpignan–Figueres, sur des voies partagées entre les réseaux à grande vitesse français et espagnol — l\'un des rares endroits en Europe où un train à grande vitesse passe physiquement du réseau ferroviaire d\'un pays à celui d\'un autre sans s\'arrêter.',
      it: 'Il TGV diretto entra in Spagna a Perpignano–Figueres, su binari condivisi tra le reti ad alta velocità francese e spagnola — uno dei pochi punti in Europa dove un treno ad alta velocità passa fisicamente dalla rete ferroviaria di un paese a quella di un altro senza fermarsi.'
    }
  },
  { slug: 'paris-berlin', from: 'Paris', to: 'Berlin', country: 'France-Germany', duration: '8h 00m', operator: 'TGV', price: '€60-90', badge: 'Route guide · France-Germany',
    customSEO: { en: { title: 'Paris to Berlin Train: 8h, from €60', description: 'TGV connection from Paris to Berlin in 8 hours. Check live schedules and book tickets from €60.' } },
    localInsight: {
      en: 'There\'s no single dedicated high-speed line running the whole way between the two capitals, so daytime journeys typically involve a change — commonly around Frankfurt or Mannheim — moving from the French TGV network onto German ICE track partway through. It\'s also why the recently revived Paris–Berlin night train (launched by European Sleeper in 2026) got so much attention: it finally offered a one-seat overnight option.',
      es: 'No existe una única línea de alta velocidad dedicada que recorra todo el trayecto entre ambas capitales, así que los viajes diurnos suelen incluir un cambio de tren — habitualmente por Fráncfort o Mannheim — pasando de la red TGV francesa a la vía ICE alemana a mitad de camino. Por eso el tren nocturno Paris-Berlín relanzado recientemente (por European Sleeper en 2026) llamó tanto la atención: por fin ofrecía una opción directa sin cambios durante la noche.',
      fr: 'Il n\'existe pas de ligne à grande vitesse unique et dédiée sur toute la distance entre les deux capitales, si bien que les trajets de jour impliquent généralement un changement — souvent autour de Francfort ou Mannheim — en passant du réseau TGV français à la voie ICE allemande en cours de route. C\'est aussi pourquoi le train de nuit Paris-Berlin récemment relancé (par European Sleeper en 2026) a tant fait parler de lui : il offrait enfin une option de nuit sans changement.',
      it: 'Non esiste un\'unica linea ad alta velocità dedicata per l\'intera distanza tra le due capitali, quindi i viaggi diurni comportano solitamente un cambio — di solito intorno a Francoforte o Mannheim — passando dalla rete TGV francese ai binari ICE tedeschi a metà percorso. È anche per questo che il treno notturno Parigi-Berlino recentemente rilanciato (da European Sleeper nel 2026) ha attirato tanta attenzione: offriva finalmente un\'opzione notturna senza cambi.'
    }
  },
  { slug: 'paris-bordeaux', from: 'Paris', to: 'Bordeaux', country: 'France', duration: '2h 00m', operator: 'TGV', price: '€30-50', badge: 'Route guide · France',
    customSEO: { en: { title: 'Paris to Bordeaux by Train: 2h TGV, from €30', description: 'High-speed TGV direct from Paris to Bordeaux in 2 hours. Compare today\'s schedule and book tickets from €30.' } },
    localInsight: {
      en: 'The journey time dropped from well over 3 hours to about 2 when a new high-speed line (LGV Sud Europe Atlantique) opened in 2017 — one of the last major LGV lines built in France, and financed through a public-private partnership rather than by the state alone, an unusual model for a project of this size.',
      es: 'El tiempo de viaje bajó de más de 3 horas a unas 2 cuando en 2017 se inauguró una nueva línea de alta velocidad (LGV Sud Europe Atlantique) — una de las últimas grandes líneas LGV construidas en Francia, financiada mediante una asociación público-privada en vez de solo por el Estado, un modelo poco habitual para un proyecto de este tamaño.',
      fr: 'Le temps de trajet est passé de bien plus de 3 heures à environ 2 heures lorsqu\'une nouvelle ligne à grande vitesse (LGV Sud Europe Atlantique) a ouvert en 2017 — l\'une des dernières grandes lignes LGV construites en France, financée par un partenariat public-privé plutôt que par l\'État seul, un modèle inhabituel pour un projet de cette envergure.',
      it: 'Il tempo di viaggio è sceso da oltre 3 ore a circa 2 quando nel 2017 è stata aperta una nuova linea ad alta velocità (LGV Sud Europe Atlantique) — una delle ultime grandi linee LGV costruite in Francia, finanziata tramite un partenariato pubblico-privato anziché dal solo Stato, un modello insolito per un progetto di queste dimensioni.'
    }
  },
  { slug: 'paris-bruges', from: 'Paris', to: 'Bruges', country: 'France-Belgium', duration: '2h 30m', operator: 'TGV', price: '€35-55', badge: 'Route guide · France-Belgium',
    customSEO: { en: { title: 'Paris to Bruges Train Guide: 2h30 on TGV', description: 'Everything you need for the Paris to Bruges train: 2h30 on TGV, fares from €35, and today\'s live schedule.' } },
    localInsight: {
      en: 'This route runs through Lille-Europe, one of the busiest rail interchange stations in Europe, where Eurostar, Thalys/Eurostar and domestic TGV lines all cross — built specifically in the 1990s to turn Lille into a hub rather than just a stop between Paris, London and Brussels.',
      es: 'Esta ruta pasa por Lille-Europa, una de las estaciones de intercambio ferroviario más transitadas de Europa, donde se cruzan las líneas de Eurostar, Thalys/Eurostar y el TGV nacional — construida específicamente en los años 90 para convertir a Lille en un nudo ferroviario y no solo en una parada entre París, Londres y Bruselas.',
      fr: 'Cet itinéraire passe par Lille-Europe, l\'une des gares de correspondance les plus fréquentées d\'Europe, où se croisent les lignes Eurostar, Thalys/Eurostar et TGV domestique — construite spécifiquement dans les années 1990 pour faire de Lille un véritable hub plutôt qu\'un simple arrêt entre Paris, Londres et Bruxelles.',
      it: 'Questo percorso passa per Lille-Europe, una delle stazioni di interscambio ferroviario più trafficate d\'Europa, dove si incrociano le linee Eurostar, Thalys/Eurostar e TGV nazionale — costruita appositamente negli anni \'90 per trasformare Lille in un vero hub anziché una semplice fermata tra Parigi, Londra e Bruxelles.'
    }
  },
  { slug: 'paris-london', from: 'Paris', to: 'London', country: 'France-UK', duration: '2h 30m', operator: 'Eurostar', price: '€50-80', badge: 'Route guide · France-UK',
    customSEO: { en: { title: 'How to Get from Paris to London by Train (2h30)', description: 'The Paris to London train takes 2h30 on Eurostar. See today\'s departures and book tickets from €50.' } },
    localInsight: {
      en: 'Around 38km of this journey runs under the sea through the Channel Tunnel, opened in 1994. Because it crosses a border outside the EU\'s open zone, Eurostar passengers clear UK border control before boarding at Gare du Nord — plan to arrive roughly 45–75 minutes early, more like a (much faster) airport process than a normal train departure.',
      es: 'Unos 38 km de este trayecto van por debajo del mar, a través del Túnel del Canal, inaugurado en 1994. Como cruza una frontera fuera del espacio Schengen, los pasajeros de Eurostar pasan el control fronterizo del Reino Unido antes de embarcar en la Gare du Nord — conviene llegar unos 45-75 minutos antes, algo más parecido a un aeropuerto (pero mucho más rápido) que a una salida de tren normal.',
      fr: 'Environ 38 km de ce trajet passent sous la mer par le tunnel sous la Manche, ouvert en 1994. Comme il franchit une frontière hors de l\'espace Schengen, les passagers Eurostar passent le contrôle frontalier britannique avant d\'embarquer à la Gare du Nord — prévoyez d\'arriver environ 45 à 75 minutes à l\'avance, un peu comme à l\'aéroport, mais bien plus rapide.',
      it: 'Circa 38 km di questo viaggio corrono sotto il mare attraverso il Tunnel della Manica, aperto nel 1994. Poiché attraversa un confine fuori dall\'area Schengen, i passeggeri Eurostar passano il controllo di frontiera britannico prima di imbarcarsi alla Gare du Nord — conviene arrivare circa 45-75 minuti prima, un po\' come in aeroporto, ma molto più veloce.'
    }
  },
  { slug: 'paris-lourdes', from: 'Paris', to: 'Lourdes', country: 'France', duration: '6h 30m', operator: 'SNCF Intercités', price: '€30-50', badge: 'Route guide · France',
    customSEO: { en: { title: 'Paris to Lourdes by Train: 6h30 SNCF Intercités, from €30', description: 'Direct SNCF Intercités from Paris to Lourdes in 6h30. Compare today\'s schedule and book fares from €30 — no layovers.' } } },
  { slug: 'paris-lucerne', from: 'Paris', to: 'Lucerne', country: 'France-Switzerland', duration: '4h 30m', operator: 'TGV Lyria', price: '€50-75', badge: 'Route guide · France-Switzerland',
    customSEO: { en: { title: 'Paris to Lucerne Train: 4h30, from €50', description: 'TGV Lyria connection from Paris to Lucerne in 4h30. Check live schedules and book tickets from €50.' } },
    localInsight: {
      en: 'TGV Lyria, the operator behind this route, is a joint venture between France\'s SNCF and Switzerland\'s SBB — one of the few European rail services run and branded jointly by two different national operators rather than handed off from one country\'s trains to another\'s at the border.',
      es: 'TGV Lyria, el operador de esta ruta, es una empresa conjunta entre la SNCF francesa y la SBB suiza — uno de los pocos servicios ferroviarios europeos gestionados y con marca compartida entre dos operadores nacionales distintos, en lugar de traspasarse de los trenes de un país a los de otro en la frontera.',
      fr: 'TGV Lyria, l\'opérateur de cette ligne, est une coentreprise entre la SNCF française et les CFF suisses — l\'un des rares services ferroviaires européens exploités et gérés conjointement par deux opérateurs nationaux différents, plutôt que d\'être transmis des trains d\'un pays à ceux d\'un autre à la frontière.',
      it: 'TGV Lyria, l\'operatore di questa tratta, è una joint venture tra la SNCF francese e le FFS svizzere — uno dei pochi servizi ferroviari europei gestiti e con marchio condiviso tra due operatori nazionali diversi, invece di passare dai treni di un paese a quelli di un altro al confine.'
    }
  },
  { slug: 'paris-lyon', from: 'Paris', to: 'Lyon', country: 'France', duration: '2h 00m', operator: 'TGV', price: '€30-50', badge: 'Route guide · France',
    customSEO: { en: { title: 'Paris to Lyon Train Guide: 2h on TGV', description: 'Everything you need for the Paris to Lyon train: 2 hours on TGV, fares from €30, and today\'s live schedule.' } } },
  { slug: 'paris-milan', from: 'Paris', to: 'Milan', country: 'France-Italy', duration: '7h 00m', operator: 'TGV', price: '€60-90', badge: 'Route guide · France-Italy',
    customSEO: { en: { title: 'How to Get from Paris to Milan by Train (7h)', description: 'The Paris to Milan train takes 7 hours on TGV. See today\'s departures and book tickets from €60.' } },
    localInsight: {
      en: 'This corridor was once served by the Cisalpin, one of the original named expresses of the Trans Europ Express (TEE) network launched in 1957 — a post-war system of premium international trains that pioneered the idea of fast, comfortable, first-class-only travel between major European cities without changing trains at every border.',
      es: 'Este corredor lo cubría antes el Cisalpin, uno de los trenes con nombre propio originales de la red Trans Europ Express (TEE), lanzada en 1957 — un sistema de posguerra de trenes internacionales premium que fue pionero en la idea de viajar rápido, cómodo y solo en primera clase entre las grandes ciudades europeas sin cambiar de tren en cada frontera.',
      fr: 'Ce corridor était autrefois desservi par le Cisalpin, l\'un des trains nommés d\'origine du réseau Trans Europ Express (TEE), lancé en 1957 — un système d\'après-guerre de trains internationaux haut de gamme qui a été pionnier dans l\'idée d\'un voyage rapide, confortable, en première classe uniquement, entre les grandes villes européennes sans changer de train à chaque frontière.',
      it: 'Questo corridoio era un tempo servito dal Cisalpin, uno dei treni con nome propri originali della rete Trans Europ Express (TEE), lanciata nel 1957 — un sistema del dopoguerra di treni internazionali di alto livello che ha aperto la strada all\'idea di viaggiare veloce, comodo e in sola prima classe tra le grandi città europee senza cambiare treno a ogni confine.'
    }
  },
  { slug: 'paris-nice', from: 'Paris', to: 'Nice', country: 'France', duration: '5h 30m', operator: 'TGV', price: '€40-65', badge: 'Route guide · France',
    customSEO: { en: { title: 'Paris to Nice by Train: 5h30 TGV, from €40', description: 'Direct TGV from Paris to Nice in 5h30. Compare today\'s schedule and book fares from €40 — no layovers.' } },
    localInsight: {
      en: 'This corridor carried the legendary Train Bleu, a luxury overnight service that ran from the 1920s until the 1990s connecting Paris to the Riviera for wealthy travellers heading to Nice, Cannes and Monaco. Its name lives on at the ornate restaurant inside Gare de Lyon, the same station today\'s TGV to Nice still departs from.',
      es: 'Este corredor fue la ruta del legendario Train Bleu, un tren nocturno de lujo que circuló desde los años 20 hasta los 90 conectando París con la Riviera para viajeros adinerados que iban a Niza, Cannes o Mónaco. Su nombre sigue vivo en el ornamentado restaurante dentro de la Gare de Lyon, la misma estación de la que hoy sale el TGV a Niza.',
      fr: 'Ce corridor a porté le légendaire Train Bleu, un service de nuit de luxe qui a circulé des années 1920 jusqu\'aux années 1990, reliant Paris à la Riviera pour des voyageurs fortunés en route vers Nice, Cannes ou Monaco. Son nom subsiste dans le restaurant richement décoré situé à l\'intérieur de la Gare de Lyon, la même gare d\'où part aujourd\'hui le TGV vers Nice.',
      it: 'Questo corridoio ha ospitato il leggendario Train Bleu, un treno notturno di lusso che ha circolato dagli anni \'20 fino agli anni \'90 collegando Parigi alla Riviera per viaggiatori facoltosi diretti a Nizza, Cannes o Monaco. Il suo nome sopravvive nell\'elegante ristorante all\'interno della Gare de Lyon, la stessa stazione da cui parte oggi il TGV per Nizza.'
    }
  },
  { slug: 'paris-rome', from: 'Paris', to: 'Rome', country: 'France-Italy', duration: '11h 00m', operator: 'TGV', price: '€80-120', badge: 'Route guide · France-Italy',
    customSEO: { en: { title: 'Paris to Rome Train: 11h, from €80', description: 'TGV connection from Paris to Rome in 11 hours. Check live schedules and book tickets from €80.' } } },
  { slug: 'paris-toulouse', from: 'Paris', to: 'Toulouse', country: 'France', duration: '4h 20m', operator: 'SNCF TGV', price: '€25-40', badge: 'Route guide · France',
    customSEO: { en: { title: 'Paris to Toulouse Train Guide: 4h20 on SNCF TGV', description: 'Everything you need for the Paris to Toulouse train: 4h20 on SNCF TGV, fares from €25, and today\'s live schedule.' } } },
  { slug: 'paris-venice', from: 'Paris', to: 'Venice', country: 'France-Italy', duration: '8h 00m', operator: 'TGV', price: '€70-100', badge: 'Route guide · France-Italy',
    customSEO: { en: { title: 'How to Get from Paris to Venice by Train (8h)', description: 'The Paris to Venice train takes 8 hours on TGV. See today\'s departures and book tickets from €70.' } } },
  { slug: 'paris-zurich', from: 'Paris', to: 'Zurich', country: 'France-Switzerland', duration: '4h 30m', operator: 'TGV Lyria', price: '€50-75', badge: 'Route guide · France-Switzerland',
    customSEO: { en: { title: 'Paris to Zurich by Train: 4h30 TGV Lyria, from €50', description: 'Direct TGV Lyria from Paris to Zurich in 4h30. Compare today\'s schedule and book fares from €50 — no layovers.' } } },
  { slug: 'prague-brno', from: 'Prague', to: 'Brno', country: 'Czech', duration: '2h 30m', operator: 'ČD', price: '€15-25', badge: 'Route guide · Czech',
    customSEO: { en: { title: 'Prague to Brno Train: 2h30, from €15', description: 'ČD connection from Prague to Brno in 2h30. Check live schedules and book tickets from €15.' } },
    localInsight: {
      en: 'The Czech Republic doesn\'t yet have a dedicated high-speed rail line, so this connection between the country\'s two biggest cities still runs largely on upgraded conventional track — a genuinely fast, purpose-built high-speed line between Prague and Brno has been in long-term planning for years but has yet to be built.',
      es: 'La República Checa todavía no tiene una línea de alta velocidad dedicada, así que esta conexión entre las dos ciudades más grandes del país todavía circula en gran parte por vías convencionales mejoradas — hace años que se planea a largo plazo una línea de alta velocidad de verdad entre Praga y Brno, pero todavía no se ha construido.',
      fr: 'La République tchèque ne dispose pas encore d\'une ligne à grande vitesse dédiée, si bien que cette liaison entre les deux plus grandes villes du pays circule encore en grande partie sur des voies classiques modernisées — une véritable ligne à grande vitesse entre Prague et Brno est planifiée à long terme depuis des années, mais n\'a pas encore été construite.',
      it: 'La Repubblica Ceca non dispone ancora di una linea ad alta velocità dedicata, quindi questo collegamento tra le due maggiori città del paese corre ancora in gran parte su binari convenzionali potenziati — una vera linea ad alta velocità tra Praga e Brno è in pianificazione da anni, ma non è ancora stata costruita.'
    }
  },
  { slug: 'prague-budapest', from: 'Prague', to: 'Budapest', country: 'Czech-Hungary', duration: '4h 30m', operator: 'ČD', price: '€25-40', badge: 'Route guide · Czech-Hungary',
    customSEO: { en: { title: 'Prague to Budapest Train: 4h30, from €25', description: 'Direct ČD train from Prague to Budapest in 4.5 hours, no transfers. Check today\'s schedule and book tickets from €25.' } },
    localInsight: {
      en: 'This direct service actually links three national capitals in one journey: it passes through Bratislava, Slovakia, on its way from Prague to Budapest, without requiring a change of train — a detail easy to miss but one that makes this one of the few single-train routes in Europe to touch three countries.',
      es: 'Este servicio directo en realidad conecta tres capitales nacionales en un solo viaje: pasa por Bratislava, en Eslovaquia, de camino de Praga a Budapest, sin necesidad de cambiar de tren — un detalle fácil de pasar por alto, pero que hace de esta una de las pocas rutas de un solo tren en Europa que atraviesa tres países.',
      fr: 'Ce service direct relie en réalité trois capitales nationales en un seul trajet : il passe par Bratislava, en Slovaquie, sur le chemin entre Prague et Budapest, sans changement de train — un détail facile à manquer, mais qui fait de cette ligne l\'une des rares en Europe à traverser trois pays sans correspondance.',
      it: 'Questo servizio diretto collega in realtà tre capitali nazionali in un unico viaggio: passa per Bratislava, in Slovacchia, lungo il tragitto da Praga a Budapest, senza bisogno di cambiare treno — un dettaglio facile da non notare, ma che rende questa una delle poche tratte in Europa percorribili con un solo treno attraverso tre paesi.'
    }
  },
  { slug: 'prague-vienna', from: 'Prague', to: 'Vienna', country: 'Czech-Austria', duration: '4h 00m', operator: 'Railjet', price: '€25-40', badge: 'Route guide · Czech-Austria',
    customSEO: { en: { title: 'Prague to Vienna by Train: 4h Railjet, from €25', description: 'Direct ÖBB Railjet from Prague to Vienna in 4 hours, no transfers. Compare today\'s schedule and book fares from €25.' } },
    localInsight: {
      en: 'During the Cold War, crossing this border meant long stops for passport and customs checks between Czechoslovakia and Austria. Both countries joined the EU\'s Schengen open-border area in 2007, and the border checks disappeared entirely — today the train simply rolls through without stopping.',
      es: 'Durante la Guerra Fría, cruzar esta frontera implicaba largas paradas para el control de pasaportes y aduanas entre Checoslovaquia y Austria. Ambos países se sumaron al espacio Schengen de fronteras abiertas de la UE en 2007, y esos controles desaparecieron por completo — hoy el tren simplemente pasa de largo sin detenerse.',
      fr: 'Pendant la guerre froide, franchir cette frontière impliquait de longs arrêts pour les contrôles de passeport et de douane entre la Tchécoslovaquie et l\'Autriche. Les deux pays ont rejoint l\'espace Schengen à frontières ouvertes de l\'UE en 2007, et ces contrôles ont totalement disparu — aujourd\'hui, le train traverse simplement sans s\'arrêter.',
      it: 'Durante la Guerra Fredda, attraversare questo confine significava lunghe soste per i controlli di passaporto e dogana tra Cecoslovacchia e Austria. Entrambi i paesi sono entrati nell\'area Schengen a frontiere aperte dell\'UE nel 2007, e quei controlli sono scomparsi del tutto — oggi il treno passa semplicemente senza fermarsi.'
    }
  },
  { slug: 'rome-florence', from: 'Rome', to: 'Florence', country: 'Italy', duration: '1h 30m', operator: 'Trenitalia', price: '€20-35', badge: 'Route guide · Italy',
    customSEO: { en: { title: 'Rome to Florence Train Guide: 1h30 on Trenitalia', description: 'Everything you need for the Rome to Florence train: 1h30 on Trenitalia, fares from €20, and today\'s live schedule.' } },
    localInsight: {
      en: 'This line, known as the Direttissima, began opening in the late 1970s and was one of the first purpose-built high-speed railways anywhere in Europe — years before Italy\'s modern Alta Velocità network existed. It effectively laid the groundwork for the country\'s current high-speed system.',
      es: 'Esta línea, conocida como la Direttissima, empezó a inaugurarse a fines de los años 70 y fue una de las primeras líneas ferroviarias de alta velocidad construidas expresamente para eso en toda Europa — años antes de que existiera la red moderna de Alta Velocità italiana. Sentó, en la práctica, las bases del actual sistema de alta velocidad del país.',
      fr: 'Cette ligne, appelée la Direttissima, a commencé à ouvrir à la fin des années 1970 et fut l\'une des toutes premières lignes ferroviaires construites spécifiquement pour la grande vitesse en Europe — des années avant l\'existence du réseau moderne Alta Velocità italien. Elle a en pratique posé les bases du système à grande vitesse actuel du pays.',
      it: 'Questa linea, nota come Direttissima, iniziò ad aprire alla fine degli anni \'70 e fu una delle prime ferrovie costruite appositamente per l\'alta velocità in tutta Europa — anni prima che esistesse la moderna rete Alta Velocità italiana. Ha di fatto gettato le basi dell\'attuale sistema ad alta velocità del paese.'
    }
  },
  { slug: 'rome-naples', from: 'Rome', to: 'Naples', country: 'Italy', duration: '1h 10m', operator: 'Trenitalia', price: '€15-25', badge: 'Route guide · Italy',
    customSEO: { en: { title: 'Rome to Naples Train: 1h10 high-speed, from €15', description: 'Fast Trenitalia connection from Rome to Naples in just over an hour. Check live schedules and book tickets from €15.' } },
    localInsight: {
      en: 'This was Italy\'s first true 300 km/h high-speed line, opening in December 2005 — years before the Milan–Bologna and Bologna–Florence high-speed sections were completed. It\'s the segment that effectively proved the model for the rest of the country\'s Alta Velocità network.',
      es: 'Esta fue la primera línea de alta velocidad real a 300 km/h de Italia, inaugurada en diciembre de 2005 — años antes de que se completaran los tramos de alta velocidad Milán-Bolonia y Bolonia-Florencia. Es el tramo que, en la práctica, probó el modelo para el resto de la red Alta Velocità del país.',
      fr: 'Ce fut la première véritable ligne à grande vitesse de 300 km/h en Italie, ouverte en décembre 2005 — des années avant l\'achèvement des tronçons à grande vitesse Milan-Bologne et Bologne-Florence. C\'est ce segment qui, dans les faits, a validé le modèle pour le reste du réseau Alta Velocità du pays.',
      it: 'Questa fu la prima vera linea ad alta velocità a 300 km/h in Italia, aperta nel dicembre 2005 — anni prima che fossero completate le tratte ad alta velocità Milano-Bologna e Bologna-Firenze. È il segmento che di fatto ha collaudato il modello per il resto della rete Alta Velocità del paese.'
    }
  },
  { slug: 'rome-venice', from: 'Rome', to: 'Venice', country: 'Italy', duration: '4h 00m', operator: 'Trenitalia', price: '€30-50', badge: 'Route guide · Italy',
    customSEO: { en: { title: 'Rome to Venice by Train: 4h high-speed, from €30', description: 'Direct Trenitalia high-speed train from Rome to Venice in 4 hours. See today\'s schedule and book fares from €30 in your currency.' } },
    localInsight: {
      en: 'This is one of the longest fully high-speed corridors in Italy, connecting two of the country\'s biggest tourist draws directly — but it\'s also genuinely used by business travellers, since Bologna and Padua along the way are major economic hubs in their own right, not just stops on a scenic route.',
      es: 'Es uno de los corredores de alta velocidad completos más largos de Italia, y conecta directamente dos de los mayores destinos turísticos del país — pero también lo usa mucho gente de negocios, ya que Bolonia y Padua, en el camino, son grandes centros económicos por derecho propio, no solo paradas en una ruta turística.',
      fr: 'C\'est l\'un des plus longs corridors entièrement à grande vitesse d\'Italie, reliant directement deux des plus grandes attractions touristiques du pays — mais il est aussi vraiment utilisé par les voyageurs d\'affaires, car Bologne et Padoue, sur le trajet, sont de véritables pôles économiques à part entière, pas seulement des arrêts sur une ligne touristique.',
      it: 'È uno dei corridoi interamente ad alta velocità più lunghi d\'Italia, che collega direttamente due delle maggiori attrazioni turistiche del paese — ma è anche molto usato dai viaggiatori d\'affari, dato che Bologna e Padova, lungo il percorso, sono importanti poli economici a pieno titolo, non solo fermate su un percorso panoramico.'
    }
  },
  { slug: 'stockholm-oslo', from: 'Stockholm', to: 'Oslo', country: 'Sweden-Norway', duration: '6h 00m', operator: 'SJ', price: '€40-60', badge: 'Route guide · Sweden-Norway',
    customSEO: { en: { title: 'How to Get from Stockholm to Oslo by Train (6h)', description: 'The Stockholm to Oslo train takes 6 hours on SJ. See today\'s departures and book tickets from €40.' } },
    localInsight: {
      en: 'Unlike the high-speed lines further south in Europe, this route runs almost entirely on conventional track through dense Scandinavian forest, which is the main reason the roughly 415km trip takes about 6 hours rather than 2-3 — there is no dedicated high-speed line between the two capitals, and none currently under construction.',
      es: 'A diferencia de las líneas de alta velocidad del sur de Europa, esta ruta va casi por completo sobre vía convencional a través de densos bosques escandinavos, lo que explica que el trayecto de unos 415 km tarde cerca de 6 horas en lugar de 2-3 — no existe una línea de alta velocidad dedicada entre ambas capitales, ni ninguna en construcción actualmente.',
      fr: 'Contrairement aux lignes à grande vitesse plus au sud de l\'Europe, cet itinéraire circule presque entièrement sur voie classique à travers une dense forêt scandinave, ce qui explique que les quelque 415 km prennent environ 6 heures au lieu de 2-3 — il n\'existe aucune ligne à grande vitesse dédiée entre les deux capitales, ni aucune actuellement en construction.',
      it: 'A differenza delle linee ad alta velocità più a sud in Europa, questo percorso corre quasi interamente su binari convenzionali attraverso una fitta foresta scandinava, il che spiega perché i circa 415 km richiedano circa 6 ore invece di 2-3 — non esiste una linea ad alta velocità dedicata tra le due capitali, né alcuna attualmente in costruzione.'
    }
  },
  { slug: 'toulouse-lourdes', from: 'Toulouse', to: 'Lourdes', country: 'France', duration: '2h 00m', operator: 'SNCF Intercités', price: '€15-25', badge: 'Route guide · France',
    customSEO: { en: { title: 'Toulouse to Lourdes by Train: 2h SNCF Intercités, from €15', description: 'Direct SNCF Intercités from Toulouse to Lourdes in 2 hours. Compare today\'s schedule and book fares from €15 — no layovers.' } },
    localInsight: {
      en: 'Lourdes receives around 6 million visitors a year, making it one of the most-visited Catholic pilgrimage sites in the world despite the town itself having a population of only about 13,000 — the station was built with far more capacity than a town this size would normally need, precisely because of the pilgrimage traffic.',
      es: 'Lourdes recibe cerca de 6 millones de visitantes al año, lo que la convierte en uno de los sitios de peregrinación católica más visitados del mundo, pese a que la localidad tiene apenas unos 13.000 habitantes — la estación se construyó con mucha más capacidad de la que normalmente necesitaría un pueblo de ese tamaño, justamente por el tráfico de peregrinos.',
      fr: 'Lourdes accueille environ 6 millions de visiteurs par an, ce qui en fait l\'un des sites de pèlerinage catholique les plus visités au monde, alors que la ville elle-même ne compte qu\'environ 13 000 habitants — la gare a été construite avec une capacité bien supérieure à celle qu\'une ville de cette taille nécessiterait normalement, précisément à cause du flux de pèlerins.',
      it: 'Lourdes accoglie circa 6 milioni di visitatori all\'anno, il che la rende uno dei siti di pellegrinaggio cattolico più visitati al mondo, nonostante la città stessa conti solo circa 13.000 abitanti — la stazione fu costruita con una capacità ben superiore a quella normalmente necessaria per una città di queste dimensioni, proprio a causa del flusso di pellegrini.'
    }
  },
  { slug: 'turin-milan', from: 'Turin', to: 'Milan', country: 'Italy', duration: '1h 30m', operator: 'Trenitalia', price: '€15-25', badge: 'Route guide · Italy',
    customSEO: { en: { title: 'Turin to Milan Train: 1h30, from €15', description: 'Trenitalia connection from Turin to Milan in 1h30. Check live schedules and book tickets from €15.' } } },
  { slug: 'venice-milan', from: 'Venice', to: 'Milan', country: 'Italy', duration: '2h 30m', operator: 'Trenitalia', price: '€20-35', badge: 'Route guide · Italy',
    customSEO: { en: { title: 'Venice to Milan Train Guide: 2h30 on Trenitalia', description: 'Everything you need for the Venice to Milan train: 2h30 on Trenitalia, fares from €20, and today\'s live schedule.' } },
    localInsight: {
      en: 'The final approach into Venice runs along the Ponte della Libertà, a roughly 4km causeway built in the 1840s that was originally rail-only — a road was only added alongside it in the 1930s. It remains the sole land connection to Venice\'s historic island centre, so this train ride is quite literally the bridge into the city.',
      es: 'La aproximación final a Venecia va por el Ponte della Libertà, una calzada de unos 4 km construida en la década de 1840 que originalmente era solo para ferrocarril — la carretera se añadió recién en los años 30. Sigue siendo la única conexión terrestre con el centro histórico insular de Venecia, así que este viaje en tren es literalmente el puente de entrada a la ciudad.',
      fr: 'L\'approche finale vers Venise longe le Ponte della Libertà, une chaussée d\'environ 4 km construite dans les années 1840, à l\'origine réservée au rail — une route n\'y a été ajoutée que dans les années 1930. C\'est toujours l\'unique liaison terrestre vers le centre historique insulaire de Venise, si bien que ce trajet en train est littéralement le pont d\'entrée dans la ville.',
      it: 'L\'avvicinamento finale a Venezia percorre il Ponte della Libertà, una strada rialzata di circa 4 km costruita negli anni \'40 dell\'Ottocento, originariamente solo ferroviaria — la strada venne aggiunta solo negli anni \'30. Resta l\'unico collegamento via terra con il centro storico insulare di Venezia, quindi questo viaggio in treno è letteralmente il ponte d\'ingresso alla città.'
    }
  },
  { slug: 'vienna-budapest', from: 'Vienna', to: 'Budapest', country: 'Austria-Hungary', duration: '2h 30m', operator: 'Railjet', price: '€20-35', badge: 'Route guide · Austria-Hungary',
    customSEO: { en: { title: 'Vienna to Budapest Train: 2h30 Railjet, from €20', description: 'Direct ÖBB Railjet from Vienna to Budapest in 2.5 hours, no transfers. Compare today\'s schedule and book fares from €20.' } },
    localInsight: {
      en: 'These two capitals were once the twin seats of the Austro-Hungarian Empire, and the rail line connecting them dates back to the 19th century — long before either city had a metro system. Today\'s Railjet service is a modern train on a genuinely historic corridor.',
      es: 'Estas dos capitales fueron en su momento las sedes gemelas del Imperio austrohúngaro, y la línea ferroviaria que las conecta data del siglo XIX — mucho antes de que ninguna de las dos ciudades tuviera metro. El Railjet actual es un tren moderno sobre un corredor genuinamente histórico.',
      fr: 'Ces deux capitales furent autrefois les sièges jumeaux de l\'Empire austro-hongrois, et la ligne ferroviaire qui les relie remonte au XIXe siècle — bien avant que l\'une ou l\'autre ville n\'ait de métro. Le Railjet actuel est un train moderne sur un corridor authentiquement historique.',
      it: 'Queste due capitali furono un tempo le sedi gemelle dell\'Impero austro-ungarico, e la linea ferroviaria che le collega risale al XIX secolo — molto prima che una delle due città avesse una metropolitana. Il Railjet di oggi è un treno moderno su un corridoio autenticamente storico.'
    }
  },
  { slug: 'vienna-krems', from: 'Vienna', to: 'Krems', country: 'Austria', duration: '1h 00m', operator: 'ÖBB', price: '€10-15', badge: 'Route guide · Austria',
    customSEO: { en: { title: 'How to Get from Vienna to Krems by Train (1h)', description: 'The Vienna to Krems train takes 1 hour on ÖBB. See today\'s departures and book tickets from €10.' } },
    localInsight: {
      en: 'Krems sits at the edge of the Wachau Valley, a UNESCO World Heritage cultural landscape along the Danube known for centuries-old terraced vineyards climbing steep hillsides — recognised specifically because the valley\'s architecture, urban design and agriculture have developed together in harmony over a very long time, not just for the scenery.',
      es: 'Krems está a la entrada del valle de Wachau, un paisaje cultural Patrimonio de la Humanidad de la UNESCO a orillas del Danubio, conocido por sus viñedos en terrazas centenarios que trepan por laderas empinadas — reconocido específicamente porque la arquitectura, el urbanismo y la agricultura del valle se desarrollaron juntos en armonía durante mucho tiempo, no solo por el paisaje.',
      fr: 'Krems se trouve à l\'entrée de la vallée de la Wachau, un paysage culturel classé au patrimoine mondial de l\'UNESCO le long du Danube, connu pour ses vignobles en terrasses séculaires escaladant des coteaux abrupts — reconnu précisément parce que l\'architecture, l\'urbanisme et l\'agriculture de la vallée se sont développés ensemble en harmonie sur une très longue période, pas seulement pour le paysage.',
      it: 'Krems si trova all\'ingresso della valle del Wachau, un paesaggio culturale Patrimonio dell\'Umanità UNESCO lungo il Danubio, noto per i suoi vigneti terrazzati secolari che salgono su pendii ripidi — riconosciuto proprio perché l\'architettura, l\'urbanistica e l\'agricoltura della valle si sono sviluppate insieme in armonia per moltissimo tempo, non solo per il paesaggio.'
    }
  },
  { slug: 'vienna-prague', from: 'Vienna', to: 'Prague', country: 'Austria-Czech', duration: '4h 00m', operator: 'Railjet', price: '€25-40', badge: 'Route guide · Austria-Czech',
    customSEO: { en: { title: 'Vienna to Prague by Train: 4h Railjet, from €25', description: 'ÖBB Railjet direct from Vienna to Prague in 4 hours, no layovers. Compare schedules and book comfortable tickets from €25.' } },
    localInsight: {
      en: 'This is one of ÖBB\'s flagship Railjet routes, running via Brno with panoramic first-class carriages designed for exactly this kind of cross-border corridor. Unlike some neighbouring routes, it has stayed a straightforward direct connection rather than being split up by construction works in recent years.',
      es: 'Es una de las rutas insignia de Railjet de ÖBB, que pasa por Brno con coches de primera clase panorámicos pensados justamente para este tipo de corredor transfronterizo. A diferencia de otras rutas vecinas, se ha mantenido como una conexión directa sin cortes por obras en los últimos años.',
      fr: 'C\'est l\'une des lignes phares du Railjet d\'ÖBB, passant par Brno avec des voitures de première classe panoramiques conçues précisément pour ce type de liaison transfrontalière. Contrairement à certaines lignes voisines, elle est restée une liaison directe simple, sans interruption due à des travaux ces dernières années.',
      it: 'È una delle tratte di punta del Railjet di ÖBB, che passa per Brno con carrozze di prima classe panoramiche pensate proprio per questo tipo di collegamento transfrontaliero. A differenza di alcune tratte vicine, è rimasta un collegamento diretto senza interruzioni per lavori negli ultimi anni.'
    }
  },
  { slug: 'vienna-salzburg', from: 'Vienna', to: 'Salzburg', country: 'Austria', duration: '2h 30m', operator: 'Railjet', price: '€20-35', badge: 'Route guide · Austria',
    customSEO: { en: { title: 'Vienna to Salzburg by Train: 2h30 Railjet, from €20', description: 'Direct Railjet from Vienna to Salzburg in 2h30. Compare today\'s schedule and book fares from €20 — no layovers.' } },
    localInsight: {
      en: 'This historic Westbahn corridor isn\'t served by ÖBB\'s Railjet alone: since 2011 it has also carried WESTbahn, a private open-access operator running its own trains on the same tracks — one of the earlier examples in Europe of real competition on a national flagship rail route, years before similar competition arrived in Spain or Italy\'s main lines.',
      es: 'Este histórico corredor Westbahn no lo cubre solo el Railjet de ÖBB: desde 2011 también circula WESTbahn, un operador privado de acceso abierto que opera sus propios trenes sobre las mismas vías — uno de los primeros ejemplos en Europa de competencia real en una ruta ferroviaria nacional insignia, años antes de que llegara una competencia similar a las líneas principales de España o Italia.',
      fr: 'Ce corridor historique de la Westbahn n\'est pas desservi uniquement par le Railjet d\'ÖBB : depuis 2011, WESTbahn, un opérateur privé en accès libre, y fait également circuler ses propres trains sur les mêmes voies — l\'un des premiers exemples en Europe de véritable concurrence sur une ligne ferroviaire nationale phare, des années avant qu\'une concurrence similaire n\'arrive sur les grandes lignes espagnoles ou italiennes.',
      it: 'Questo storico corridoio della Westbahn non è servito solo dal Railjet di ÖBB: dal 2011 vi circola anche WESTbahn, un operatore privato ad accesso libero che gestisce propri treni sugli stessi binari — uno dei primi esempi in Europa di vera concorrenza su una tratta ferroviaria nazionale di punta, anni prima che una concorrenza simile arrivasse sulle linee principali di Spagna o Italia.'
    }
  },
  { slug: 'zaragoza-barcelona', from: 'Zaragoza', to: 'Barcelona', country: 'Spain', duration: '1h 30m', operator: 'Renfe AVE', price: '€15-25', badge: 'Route guide · Spain',
    customSEO: { en: { title: 'Zaragoza to Barcelona Train: 1h30 AVE, from €15', description: 'High-speed Renfe AVE from Zaragoza to Barcelona in 1.5 hours. Compare live schedules and book tickets from €15.' } },
    localInsight: {
      en: 'Zaragoza-Delicias, the station this train departs from, was purpose-built for Expo 2008 and is now one of the largest and busiest interchange stations in Spain — Zaragoza sits almost exactly halfway on the Madrid-Barcelona AVE line, which is why it works so well as a quick, direct hop to either coast.',
      es: 'Zaragoza-Delicias, la estación desde la que sale este tren, se construyó específicamente para la Expo 2008 y hoy es una de las estaciones de intercambio más grandes y transitadas de España — Zaragoza está casi exactamente a mitad de camino en la línea AVE Madrid-Barcelona, por eso funciona tan bien como salto rápido y directo hacia cualquiera de las dos costas.',
      fr: 'Zaragoza-Delicias, la gare d\'où part ce train, a été construite spécifiquement pour l\'Exposition universelle de 2008 et est aujourd\'hui l\'une des plus grandes et des plus fréquentées gares de correspondance d\'Espagne — Saragosse se trouve presque exactement à mi-chemin sur la ligne AVE Madrid-Barcelone, ce qui explique pourquoi elle fonctionne si bien comme escale rapide et directe vers l\'une ou l\'autre côte.',
      it: 'Zaragoza-Delicias, la stazione da cui parte questo treno, fu costruita appositamente per l\'Expo 2008 ed è oggi una delle stazioni di interscambio più grandi e trafficate della Spagna — Saragozza si trova quasi esattamente a metà strada sulla linea AVE Madrid-Barcellona, per questo funziona così bene come tappa rapida e diretta verso l\'una o l\'altra costa.'
    }
  },
  { slug: 'zurich-lucerne', from: 'Zurich', to: 'Lucerne', country: 'Switzerland', duration: '0h 50m', operator: 'SBB', price: '€15-25', badge: 'Route guide · Switzerland',
    customSEO: { en: { title: 'Zurich to Lucerne by Train: 50 min, from €15', description: 'Direct SBB train from Zurich to Lucerne in under an hour. Compare today\'s schedule and book fares from €15.' } },
    localInsight: {
      en: 'This is one of the busiest domestic corridors in Switzerland, with trains typically every 15-30 minutes throughout the day — it\'s used at least as much by daily commuters as by visitors heading to Lake Lucerne, so there\'s rarely a reason to plan far ahead around a specific departure.',
      es: 'Es uno de los corredores domésticos más transitados de Suiza, con trenes cada 15-30 minutos durante todo el día — lo usan al menos tanto los que viajan a diario por trabajo como los visitantes que van al lago de Lucerna, así que casi nunca hace falta planificar con mucha anticipación un horario concreto.',
      fr: 'C\'est l\'un des corridors nationaux les plus fréquentés de Suisse, avec des trains toutes les 15 à 30 minutes tout au long de la journée — il est utilisé au moins autant par les navetteurs quotidiens que par les visiteurs se rendant au lac des Quatre-Cantons, donc il est rarement nécessaire de planifier longtemps à l\'avance un horaire précis.',
      it: 'È uno dei corridoi nazionali più trafficati della Svizzera, con treni ogni 15-30 minuti durante tutta la giornata — è usato almeno quanto dai pendolari quotidiani quanto dai visitatori diretti al lago dei Quattro Cantoni, quindi raramente serve pianificare con largo anticipo un orario preciso.'
    }
  },
  { slug: 'zurich-milan', from: 'Zurich', to: 'Milan', country: 'Switzerland-Italy', duration: '3h 30m', operator: 'SBB', price: '€35-55', badge: 'Route guide · Switzerland-Italy',
    customSEO: { en: { title: 'Zurich to Milan Train: 3h30, from €35', description: 'SBB connection from Zurich to Milan in 3h30. Check live schedules and book tickets from €35.' } },
    localInsight: {
      en: 'On the way south, the train stops at Bellinzona, gateway to Ticino — Switzerland\'s only Italian-speaking canton. It\'s a genuine linguistic and cultural border inside the country itself, so the announcements, food on board and general feel of the trip noticeably shift before you\'ve even crossed into Italy.',
      es: 'Camino al sur, el tren para en Bellinzona, la puerta de entrada al Tesino — el único cantón de habla italiana de Suiza. Es una frontera lingüística y cultural real dentro del propio país, así que los anuncios, la comida a bordo y el ambiente general del viaje cambian de forma notable incluso antes de cruzar a Italia.',
      fr: 'En route vers le sud, le train s\'arrête à Bellinzone, porte d\'entrée du Tessin — le seul canton italophone de Suisse. C\'est une véritable frontière linguistique et culturelle à l\'intérieur même du pays, si bien que les annonces, la restauration à bord et l\'ambiance générale du voyage changent nettement avant même d\'entrer en Italie.',
      it: 'Verso sud, il treno si ferma a Bellinzona, porta d\'accesso al Ticino — l\'unico cantone di lingua italiana della Svizzera. È un vero confine linguistico e culturale all\'interno del paese stesso, quindi gli annunci, il cibo a bordo e l\'atmosfera generale del viaggio cambiano in modo evidente ancora prima di entrare in Italia.'
    }
  },
  // Tanda nueva (17-ago-2026): pares con position_id de Klook ya verificado
  // (KLOOK_POSITION_PAIRS en backend/affiliate.ts) pero sin página /rutas/ todavía.
  { slug: 'strasbourg-paris', from: 'Strasbourg', to: 'Paris', country: 'France', duration: '1h 50m', operator: 'TGV', price: '€30-50', badge: 'Route guide · France',
    customSEO: { en: { title: 'Strasbourg to Paris Train Guide: 1h50 on TGV', description: 'Everything you need for the Strasbourg to Paris train: 1h50 on TGV, fares from €30, and today\'s live schedule.' } } },
  { slug: 'munich-paris', from: 'Munich', to: 'Paris', country: 'Germany-France', duration: '6h 00m', operator: 'TGV/ICE', price: '€60-90', badge: 'Route guide · Germany-France',
    customSEO: { en: { title: 'How to Get from Munich to Paris by Train (6h)', description: 'The Munich to Paris train takes 6 hours on TGV/ICE. See today\'s departures and book tickets from €60.' } },
    localInsight: {
      en: 'This connection got significantly faster once the LGV Est high-speed line was fully extended to Strasbourg, completing in stages up to 2016 — before that, journeys routed further south via Basel or Zurich and typically took noticeably longer than the roughly 6 hours possible today.',
      es: 'Esta conexión se volvió notablemente más rápida cuando la línea de alta velocidad LGV Est se extendió por completo hasta Estrasburgo, completándose por etapas hasta 2016 — antes, los trayectos pasaban más al sur, por Basilea o Zúrich, y solían tardar bastante más que las cerca de 6 horas que se tardan hoy.',
      fr: 'Cette liaison est devenue nettement plus rapide une fois la LGV Est entièrement prolongée jusqu\'à Strasbourg, achevée par étapes jusqu\'en 2016 — avant cela, les trajets passaient plus au sud, via Bâle ou Zurich, et duraient généralement nettement plus longtemps que les quelque 6 heures possibles aujourd\'hui.',
      it: 'Questo collegamento è diventato notevolmente più veloce quando la linea ad alta velocità LGV Est è stata completamente estesa fino a Strasburgo, completata a tappe fino al 2016 — prima, i viaggi passavano più a sud, via Basilea o Zurigo, e in genere richiedevano molto più tempo delle circa 6 ore possibili oggi.'
    }
  },
  { slug: 'cologne-brussels', from: 'Cologne', to: 'Brussels', country: 'Germany-Belgium', duration: '1h 50m', operator: 'ICE/Thalys', price: '€30-50', badge: 'Route guide · Germany-Belgium',
    customSEO: { en: { title: 'Cologne to Brussels by Train: 1h50 ICE/Thalys, from €30', description: 'Direct ICE/Thalys from Cologne to Brussels in 1h50. Compare today\'s schedule and book fares from €30 — no layovers.' } } },
  { slug: 'copenhagen-prague', from: 'Copenhagen', to: 'Prague', country: 'Denmark-Czech', duration: '~12h 00m', operator: 'EuroCity/ICE', price: '€60-100', badge: 'Route guide · Denmark-Czech',
    customSEO: { en: { title: 'Copenhagen to Prague by Train: ~12h, from €60', description: 'Overnight EuroCity/ICE connection from Copenhagen to Prague in about 12 hours. Check today\'s schedule and book fares from €60.' } } },
  { slug: 'amsterdam-bruges', from: 'Amsterdam', to: 'Bruges', country: 'Netherlands-Belgium', duration: '3h 00m', operator: 'NS/SNCB', price: '€30-45', badge: 'Route guide · Netherlands-Belgium',
    customSEO: { en: { title: 'Amsterdam to Bruges Train: 3h, from €30', description: 'NS/SNCB connection from Amsterdam to Bruges in 3 hours. Check live schedules and book tickets from €30.' } } },
  { slug: 'interlaken-lucerne', from: 'Interlaken', to: 'Lucerne', country: 'Switzerland', duration: '1h 50m', operator: 'SBB', price: '€25-35', badge: 'Route guide · Switzerland',
    customSEO: { en: { title: 'Interlaken to Lucerne Train Guide: 1h50 on SBB', description: 'Everything you need for the Interlaken to Lucerne train: 1h50 on SBB, fares from €25, and today\'s live schedule.' } } },
  { slug: 'lucerne-zermatt', from: 'Lucerne', to: 'Zermatt', country: 'Switzerland', duration: '3h 30m', operator: 'SBB/BVZ', price: '€60-80', badge: 'Route guide · Switzerland',
    customSEO: { en: { title: 'How to Get from Lucerne to Zermatt by Train (3h30)', description: 'The Lucerne to Zermatt train takes 3h30 on SBB/BVZ. See today\'s departures and book tickets from €60.' } } },
  { slug: 'innsbruck-vienna', from: 'Innsbruck', to: 'Vienna', country: 'Austria', duration: '4h 30m', operator: 'Railjet', price: '€40-60', badge: 'Route guide · Austria',
    customSEO: { en: { title: 'Innsbruck to Vienna by Train: 4h30 Railjet, from €40', description: 'Direct Railjet from Innsbruck to Vienna in 4h30. Compare today\'s schedule and book fares from €40 — no layovers.' } } },
  { slug: 'graz-vienna', from: 'Graz', to: 'Vienna', country: 'Austria', duration: '2h 40m', operator: 'Railjet', price: '€20-35', badge: 'Route guide · Austria',
    customSEO: { en: { title: 'Graz to Vienna Train: 2h40, from €20', description: 'Railjet connection from Graz to Vienna in 2h40. Check live schedules and book tickets from €20.' } } },
  { slug: 'munich-salzburg', from: 'Munich', to: 'Salzburg', country: 'Germany-Austria', duration: '1h 30m', operator: 'DB/ÖBB', price: '€20-35', badge: 'Route guide · Germany-Austria',
    customSEO: { en: { title: 'Munich to Salzburg Train Guide: 1h30 on DB/ÖBB', description: 'Everything you need for the Munich to Salzburg train: 1h30 on DB/ÖBB, fares from €20, and today\'s live schedule.' } } },
  { slug: 'bern-paris', from: 'Bern', to: 'Paris', country: 'Switzerland-France', duration: '4h 30m', operator: 'TGV Lyria', price: '€50-75', badge: 'Route guide · Switzerland-France',
    customSEO: { en: { title: 'How to Get from Bern to Paris by Train (4h30)', description: 'The Bern to Paris train takes 4h30 on TGV Lyria. See today\'s departures and book tickets from €50.' } } },
  { slug: 'stmoritz-zermatt', from: 'St. Moritz', to: 'Zermatt', country: 'Switzerland', duration: '8h 00m', operator: 'Glacier Express', price: '€150-180', badge: 'Route guide · Switzerland',
    customSEO: { en: { title: 'St. Moritz to Zermatt by Train: 8h Glacier Express, from €150', description: 'Direct Glacier Express from St. Moritz to Zermatt in 8 hours. Compare today\'s schedule and book fares from €150 — no layovers.' } } },
  { slug: 'tende-nice', from: 'Tende', to: 'Nice', country: 'France-Italy', duration: '2h 00m', operator: 'SNCF TER', price: '€10-20', badge: 'Route guide · France-Italy',
    customSEO: { en: { title: 'Tende to Nice Train: 2h, from €10', description: 'SNCF TER connection from Tende to Nice in 2 hours. Check live schedules and book tickets from €10.' } } },
  { slug: 'frankfurt-berlin', from: 'Frankfurt', to: 'Berlin', country: 'Germany', duration: '4h 00m', operator: 'ICE (DB)', price: '€40-60', badge: 'Route guide · Germany',
    customSEO: { en: { title: 'Frankfurt to Berlin Train Guide: 4h on ICE (DB)', description: 'Everything you need for the Frankfurt to Berlin train: 4 hours on ICE (DB), fares from €40, and today\'s live schedule.' } } },
  { slug: 'lucerne-bern', from: 'Lucerne', to: 'Bern', country: 'Switzerland', duration: '1h 05m', operator: 'InterCity (SBB)', price: '€20-35', badge: 'Route guide · Switzerland',
    customSEO: { en: { title: 'Lucerne to Bern Train: 1h05, from €20', description: 'InterCity (SBB) connection from Lucerne to Bern in just over an hour. Check live schedules and book tickets from €20.' } } }
];

// Hoteles reales curados por ciudad de destino (mismos criterios que CURATED_HOTELS
// en assets/js/main.js: hoteles reales existentes, no genericos/ficticios).
const REAL_HOTELS = {
  amsterdam: { name: "De L'Europe Amsterdam", loc: "Amsterdam, Netherlands", image: "https://www.deleurope.com/wp-content/uploads/2024/02/homepage-hero-1.webp" },
  barcelona: { name: "Hotel Casa Fuster", loc: "Barcelona, Spain", image: "https://static-resources-elementor.mirai.com/wp-content/uploads/sites/343/casa-fuster_header-historia_section.jpg" },
  bergen: { name: "Hotel Norge by Scandic", loc: "Bergen, Norway", image: "https://www.scandichotels.com/globalassets/hotels/norway/bergen/scandic-norge/scandic-norge-exterior.jpg" },
  berlin: { name: "Hotel Adlon Kempinski", loc: "Berlin, Germany", image: "https://storage.kempinski.com/cdn-cgi/image/w=1920,f=auto,fit=scale-down/ki-cms-prod/images/7/2/3/5/2625327-1-eng-GB/885bd49e79c3-89887320_4K.jpg" },
  bern: { name: "Hotel Bellevue Palace Bern", loc: "Bern, Switzerland", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Hotel_Bellevue_Palace.jpg/330px-Hotel_Bellevue_Palace.jpg" },
  bordeaux: { name: "InterContinental Bordeaux – Le Grand Hôtel", loc: "Bordeaux, France", image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Fa%C3%A7ade_Grand_H%C3%B4tel_de_Bordeaux.jpg" },
  brno: { name: "Grandhotel Brno", loc: "Brno, Czech Republic", image: "https://grandhotelbrno.cz/wp-content/uploads/bitmap-15.jpg" },
  bruges: { name: "Hotel Heritage", loc: "Bruges, Belgium", image: "https://www.hotel-heritage.com/wp-content/uploads/elementor/thumbs/289A0021-res7vp7qbz0q15g3rbg8tyy91gvwawbd8f3n5fvlnu.jpg" },
  brussels: { name: "Hotel Amigo", loc: "Brussels, Belgium", image: "https://www.roccofortehotels.com/media/caro2u4r/3b-rfh-hotel-amigo-blaton-suite-j1113_rfa_230-th-nov-19-lr.jpg" },
  budapest: { name: "Four Seasons Hotel Gresham Palace", loc: "Budapest, Hungary", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Gresham_Palace_-_Stierch_01.jpg/250px-Gresham_Palace_-_Stierch_01.jpg" },
  cambridge: { name: "The Varsity Hotel & Spa", loc: "Cambridge, United Kingdom", image: "https://www.thevarsityhotel.co.uk/wp-content/uploads/2023/05/Varsity-Hotel-Exterior.jpg" },
  cologne: { name: "Excelsior Hotel Ernst am Dom", loc: "Cologne, Germany", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/8a/f4/2769ee5759ee0ccbc46ddba428c8aa267f5245551d00699bdde306970fa8.jpeg" },
  edinburgh: { name: "The Balmoral", loc: "Edinburgh, United Kingdom", image: "https://www.roccofortehotels.com/media/d54dutp2/2-rfh-the-balmoral-facade-0474-jg-sep-18.jpg" },
  figueres: { name: "Hotel Empordà", loc: "Figueres, Spain", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/19/c1/c1332927fb38208c45a7d20689b523813cf9ee9542530d8559dbc5912cda.jpeg" },
  florence: { name: "Helvetia & Bristol Firenze", loc: "Florence, Italy", image: "https://x3jh6o6w.cdn.imgeng.in/assets/uploads/Starhotels-Collezione/Helvetia_Bristol/GALLERY/helvetia-bristol-fi-facciata1.jpg?imgeng=/w_1200/h_630/m_cropbox" },
  girona: { name: "Hotel Peninsular", loc: "Girona, Spain", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/hotelier-images/78/af/d0bb670163cca63359cc85c6da098a5779c27c3547402d3118965311a49b.jpeg" },
  hamburg: { name: "Hotel Atlantic Kempinski Hamburg", loc: "Hamburg, Germany", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/5c/c5/0722e0bfde503c4d712760adf4ee25a3f20628a73e6660371bdd2feac2be.jpeg" },
  interlaken: { name: "Grand Hotel Beau-Rivage", loc: "Interlaken, Switzerland", image: "https://i0.wp.com/www.grandbeaurivage.ch/wp-content/uploads/2026/03/terrasse.jpg?resize=1300%2C975&ssl=1" },
  krems: { name: "Steigenberger Hotel & Spa Krems", loc: "Krems, Austria", image: "https://www.steigenberger.com/-/media/steigenberger/hotels/austria/krems/steigenberger-hotel-spa-krems-exterior.jpg" },
  lauterbrunnen: { name: "Braunbär Hotel & Spa", loc: "Wengen, Lauterbrunnen valley, Switzerland", image: "https://cdn.prod.website-files.com/65b186476e59e33563a59cdf/65c53f1bae14910723ebbfa5_65bcd2b113e6815013ee49f0_hotel-braunbaer-wengen.webp" },
  liverpool: { name: "30 James Street", loc: "Liverpool, United Kingdom", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Albion_House%2C_Liverpool_4.jpg/330px-Albion_House%2C_Liverpool_4.jpg" },
  ljubljana: { name: "Grand Hotel Union", loc: "Ljubljana, Slovenia", image: "https://media.booking-channel.com/api/hotels/2281/images/109.jpeg" },
  london: { name: "The Savoy", loc: "London, United Kingdom", image: "https://cdn.prod.website-files.com/68f4d1c2a6858f0bfbded01c/6905fd1604f6b402518f81d0_Savoy-SEO-Image.jpg" },
  lourdes: { name: "Hôtel Roissy", loc: "Lourdes, France", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/1b/35/904b7435487e16addcf95a1bac9ae9d4e512a058735be3628ceddb6f3808.jpeg" },
  lucerne: { name: "Hotel Schweizerhof Luzern", loc: "Lucerne, Switzerland", image: "https://www.schweizerhof-luzern.ch/bilder/seo/_800xAUTO_crop_center-center_none/socialMediaFallbackImage.jpg" },
  lyon: { name: "Villa Florentine", loc: "Lyon, France", image: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Villa_Florentine_%40_Lyon_%2836389389615%29.jpg" },
  malaga: { name: "Gran Hotel Miramar", loc: "Malaga, Spain", image: "https://www.granhotelmiramarmalaga.com/wp-content/blogs.dir/1833/files/home/malaga-new.jpg" },
  manchester: { name: "The Midland Hotel", loc: "Manchester, United Kingdom", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Midland_Hotel_west%2C_Manchester.jpg/330px-Midland_Hotel_west%2C_Manchester.jpg" },
  milan: { name: "Hotel Principe di Savoia", loc: "Milan, Italy", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/3693MilanoHotelPrincipeSavoia.JPG/330px-3693MilanoHotelPrincipeSavoia.JPG" },
  miramas: { name: "ibis Styles Miramas - Provence", loc: "Miramas, France", image: "https://www.ahstatic.com/photos/c0d8_ho_00_p_1024x768.jpg" },
  monaco: { name: "Hôtel de Paris Monte-Carlo", loc: "Monaco", image: "https://asset.montecarlosbm.com/styles/hero_image_desktop/s3/media/orphea/hotel-de-paris-monte-carlo-facade-de-jour-2024-013_1.jpg.jpeg" },
  munich: { name: "Hotel Bayerischer Hof", loc: "Munich, Germany", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Hotel_Bayerischer_Hof_0437.jpg/330px-Hotel_Bayerischer_Hof_0437.jpg" },
  naples: { name: "Grand Hotel Vesuvio", loc: "Naples, Italy", image: "https://d1vp8nomjxwyf1.cloudfront.net/wp-content/uploads/sites/165/2016/07/01100414/gallery_35-620x700.jpg" },
  nice: { name: "Hôtel Negresco", loc: "Nice, France", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Nice_H%C3%B4tel_Negresco_Ext%C3%A9rieur_07.jpg/330px-Nice_H%C3%B4tel_Negresco_Ext%C3%A9rieur_07.jpg" },
  oslo: { name: "The Thief", loc: "Oslo, Norway", image: "https://thethief.com/wp-content/uploads/2023/01/thethief-exterior-01.jpg" },
  oxford: { name: "Old Bank Hotel", loc: "Oxford, United Kingdom", image: "https://www.oldbankhotel.co.uk/wp-content/uploads/2023/10/0009-2018-Old-Bank-Hotel-Oxford-High-Res-Old-Bank-Hotel-Quod-Facade-Web-Hero.jpg" },
  paris: { name: "Ritz Paris", loc: "Paris, France", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/H%C3%B4tel_Ritz.jpg/330px-H%C3%B4tel_Ritz.jpg" },
  pisa: { name: "Hotel Pisa Tower", loc: "Pisa, Italy", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/a5/fd/ae188e72b48d5360d4999fbd4b9070ec56590963d18a91196daca91fcb95.jpeg" },
  porto: { name: "The Yeatman", loc: "Porto, Portugal", image: "https://www.the-yeatman-hotel.com/wp-content/uploads/2023/03/the-yeatman-exterior.jpg" },
  prague: { name: "Hotel Paris Prague", loc: "Prague, Czech Republic", image: "https://www.hotel-paris.cz/files-sbbasic/ba_parisprague_cz/hotel-paris-prague-02.jpg?w=1200&h=627" },
  rome: { name: "Hotel Hassler Roma", loc: "Rome, Italy", image: "https://www.hotelhasslerroma.com/wp-content/uploads/2025/08/fec52ec67f951787b17109931fbf07f7a69f716b.webp" },
  salerno: { name: "Hotel Plaza", loc: "Salerno, Italy", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/hotelier-images/65/77/702e7322aeb415a8ce6155f06a2c511da6d0bc1a9cd348bf0f9722598cd5.jpeg" },
  salzburg: { name: "Hotel Goldener Hirsch", loc: "Salzburg, Austria", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Hotel_Goldener_Hirsch_Salzburg.jpg/250px-Hotel_Goldener_Hirsch_Salzburg.jpg" },
  seville: { name: "Hotel Alfonso XIII", loc: "Seville, Spain", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Hotel_Alfonso_XIII%2C_Sevilla%2C_Espa%C3%B1a%2C_2015-12-06%2C_DD_80.JPG/330px-Hotel_Alfonso_XIII%2C_Sevilla%2C_Espa%C3%B1a%2C_2015-12-06%2C_DD_80.JPG" },
  siena: { name: "Grand Hotel Continental Siena", loc: "Siena, Italy", image: "https://images.pexels.com/photos/38127108/pexels-photo-38127108.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  sorrento: { name: "Grand Hotel Excelsior Vittoria", loc: "Sorrento, Italy", image: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Excelsior_Vittoria_hotel%2C_Sorrento.jpg" },
  stockholm: { name: "Grand Hôtel Stockholm", loc: "Stockholm, Sweden", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Grand_Hotel_June_2018_01.jpg/330px-Grand_Hotel_June_2018_01.jpg" },
  toulouse: { name: "Hôtel d'Orsay", loc: "Toulouse, France", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/5f/e6/0389a4600856b2b9f3d1eb3c02d842aff368c5c17be9d60f8d6c0d77ac02.jpeg" },
  turin: { name: "Turin Palace Hotel", loc: "Turin, Italy", image: "https://www.turinpalacehotel.com/wp-content/uploads/2025/02/dscf2986-hdr.jpg" },
  valencia: { name: "Hotel Boutique Balandret", loc: "Valencia, Spain", image: "https://balandret.com/wp-content/uploads/2022/03/Hotel-en-Playa-Valencia.jpg" },
  venice: { name: "Hotel Danieli", loc: "Venice, Italy", image: "https://www.danielihotelinvenice.com/pub/media/72/lux72ex.123582_md.jpg" },
  vienna: { name: "Hotel Sacher Wien", loc: "Vienna, Austria", image: "https://www.sacher.com/en/wp-content/uploads/sites/4/fly-images/10561/hotel-sacher-architektur-wien-80-scaled-1920x9999.jpg.webp" },
  york: { name: "The Grand, York", loc: "York, United Kingdom", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/The_Grand_Hotel_%26_Spa%2C_York.jpg/330px-The_Grand_Hotel_%26_Spa%2C_York.jpg" },
  zaragoza: { name: "Hotel Reina Petronila", loc: "Zaragoza, Spain", image: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Zaragoza_-_Complejo_Aragonia_-_Hotel_Reina_Petronila_1.jpg" },
  zermatt: { name: "Mont Cervin Palace", loc: "Zermatt, Switzerland", image: "https://www.montcervinpalace.ch/wp-content/uploads/2023/11/winter_mcp-exterior-6-1.jpg" },
  zurich: { name: "Baur au Lac", loc: "Zurich, Switzerland", image: "https://www.bauraulac.ch/upload/rm/ba/ll/bal-lakeside-corner-suite-lounge-area-4.jpg" },
};

// Foto hero real por ciudad de destino (Pexels), evita la misma foto generica en las 174 paginas.
const HERO_PHOTOS = {
  amsterdam: 'https://images.pexels.com/photos/4237160/pexels-photo-4237160.jpeg?auto=compress&cs=tinysrgb&w=1600',
  barcelona: 'https://images.pexels.com/photos/16984552/pexels-photo-16984552.jpeg?auto=compress&cs=tinysrgb&w=1600',
  bergen: 'https://images.pexels.com/photos/6291547/pexels-photo-6291547.jpeg?auto=compress&cs=tinysrgb&w=1600',
  berlin: 'https://images.pexels.com/photos/37120347/pexels-photo-37120347.jpeg?auto=compress&cs=tinysrgb&w=1600',
  bordeaux: 'https://images.pexels.com/photos/32769595/pexels-photo-32769595.jpeg?auto=compress&cs=tinysrgb&w=1600',
  brno: 'https://images.pexels.com/photos/30356381/pexels-photo-30356381.jpeg?auto=compress&cs=tinysrgb&w=1600',
  bruges: 'https://images.pexels.com/photos/5612487/pexels-photo-5612487.jpeg?auto=compress&cs=tinysrgb&w=1600',
  brussels: 'https://images.pexels.com/photos/8290868/pexels-photo-8290868.jpeg?auto=compress&cs=tinysrgb&w=1600',
  budapest: 'https://images.pexels.com/photos/18815996/pexels-photo-18815996.jpeg?auto=compress&cs=tinysrgb&w=1600',
  cambridge: 'https://images.pexels.com/photos/36149240/pexels-photo-36149240.jpeg?auto=compress&cs=tinysrgb&w=1600',
  cologne: 'https://images.pexels.com/photos/31104284/pexels-photo-31104284.jpeg?auto=compress&cs=tinysrgb&w=1600',
  edinburgh: 'https://images.pexels.com/photos/35769512/pexels-photo-35769512.jpeg?auto=compress&cs=tinysrgb&w=1600',
  figueres: 'https://images.pexels.com/photos/33784499/pexels-photo-33784499.jpeg?auto=compress&cs=tinysrgb&w=1600',
  florence: 'https://images.pexels.com/photos/5412528/pexels-photo-5412528.jpeg?auto=compress&cs=tinysrgb&w=1600',
  girona: 'https://images.pexels.com/photos/30166261/pexels-photo-30166261.jpeg?auto=compress&cs=tinysrgb&w=1600',
  hamburg: 'https://images.pexels.com/photos/21815283/pexels-photo-21815283.jpeg?auto=compress&cs=tinysrgb&w=1600',
  interlaken: 'https://images.pexels.com/photos/37995173/pexels-photo-37995173.jpeg?auto=compress&cs=tinysrgb&w=1600',
  krems: 'https://images.pexels.com/photos/32674846/pexels-photo-32674846.jpeg?auto=compress&cs=tinysrgb&w=1600',
  lauterbrunnen: 'https://images.pexels.com/photos/5210151/pexels-photo-5210151.jpeg?auto=compress&cs=tinysrgb&w=1600',
  liverpool: 'https://images.pexels.com/photos/24553792/pexels-photo-24553792.jpeg?auto=compress&cs=tinysrgb&w=1600',
  ljubljana: 'https://images.pexels.com/photos/5565328/pexels-photo-5565328.jpeg?auto=compress&cs=tinysrgb&w=1600',
  london: 'https://images.pexels.com/photos/30029654/pexels-photo-30029654.jpeg?auto=compress&cs=tinysrgb&w=1600',
  lourdes: 'https://images.pexels.com/photos/32848378/pexels-photo-32848378.jpeg?auto=compress&cs=tinysrgb&w=1600',
  lucerne: 'https://images.pexels.com/photos/18429608/pexels-photo-18429608.jpeg?auto=compress&cs=tinysrgb&w=1600',
  lyon: 'https://images.pexels.com/photos/8430273/pexels-photo-8430273.jpeg?auto=compress&cs=tinysrgb&w=1600',
  malaga: 'https://images.pexels.com/photos/17701823/pexels-photo-17701823.jpeg?auto=compress&cs=tinysrgb&w=1600',
  manchester: 'https://images.pexels.com/photos/34760027/pexels-photo-34760027.jpeg?auto=compress&cs=tinysrgb&w=1600',
  milan: 'https://images.pexels.com/photos/15939547/pexels-photo-15939547.jpeg?auto=compress&cs=tinysrgb&w=1600',
  miramas: 'https://images.pexels.com/photos/17683122/pexels-photo-17683122.jpeg?auto=compress&cs=tinysrgb&w=1600',
  monaco: 'https://images.pexels.com/photos/11956743/pexels-photo-11956743.jpeg?auto=compress&cs=tinysrgb&w=1600',
  munich: 'https://images.pexels.com/photos/13762982/pexels-photo-13762982.jpeg?auto=compress&cs=tinysrgb&w=1600',
  naples: 'https://images.pexels.com/photos/9718900/pexels-photo-9718900.jpeg?auto=compress&cs=tinysrgb&w=1600',
  nice: 'https://images.pexels.com/photos/28602943/pexels-photo-28602943.jpeg?auto=compress&cs=tinysrgb&w=1600',
  oslo: 'https://images.pexels.com/photos/20202718/pexels-photo-20202718.jpeg?auto=compress&cs=tinysrgb&w=1600',
  oxford: 'https://images.pexels.com/photos/29889925/pexels-photo-29889925.jpeg?auto=compress&cs=tinysrgb&w=1600',
  paris: 'https://images.pexels.com/photos/31482953/pexels-photo-31482953.jpeg?auto=compress&cs=tinysrgb&w=1600',
  pisa: 'https://images.pexels.com/photos/10733379/pexels-photo-10733379.jpeg?auto=compress&cs=tinysrgb&w=1600',
  porto: 'https://images.pexels.com/photos/10959393/pexels-photo-10959393.jpeg?auto=compress&cs=tinysrgb&w=1600',
  prague: 'https://images.pexels.com/photos/16922421/pexels-photo-16922421.jpeg?auto=compress&cs=tinysrgb&w=1600',
  rome: 'https://images.pexels.com/photos/27541217/pexels-photo-27541217.jpeg?auto=compress&cs=tinysrgb&w=1600',
  salerno: 'https://images.pexels.com/photos/35873188/pexels-photo-35873188.jpeg?auto=compress&cs=tinysrgb&w=1600',
  salzburg: 'https://images.pexels.com/photos/37861319/pexels-photo-37861319.jpeg?auto=compress&cs=tinysrgb&w=1600',
  seville: 'https://images.pexels.com/photos/13350429/pexels-photo-13350429.jpeg?auto=compress&cs=tinysrgb&w=1600',
  siena: 'https://images.pexels.com/photos/15891009/pexels-photo-15891009.jpeg?auto=compress&cs=tinysrgb&w=1600',
  sorrento: 'https://images.pexels.com/photos/10229029/pexels-photo-10229029.jpeg?auto=compress&cs=tinysrgb&w=1600',
  stockholm: 'https://images.pexels.com/photos/19391718/pexels-photo-19391718.jpeg?auto=compress&cs=tinysrgb&w=1600',
  toulouse: 'https://images.pexels.com/photos/30753285/pexels-photo-30753285.jpeg?auto=compress&cs=tinysrgb&w=1600',
  turin: 'https://images.pexels.com/photos/33040847/pexels-photo-33040847.jpeg?auto=compress&cs=tinysrgb&w=1600',
  valencia: 'https://images.pexels.com/photos/24531674/pexels-photo-24531674.jpeg?auto=compress&cs=tinysrgb&w=1600',
  venice: 'https://images.pexels.com/photos/29487687/pexels-photo-29487687.jpeg?auto=compress&cs=tinysrgb&w=1600',
  vienna: 'https://images.pexels.com/photos/16292000/pexels-photo-16292000.jpeg?auto=compress&cs=tinysrgb&w=1600',
  york: 'https://images.pexels.com/photos/37885386/pexels-photo-37885386.jpeg?auto=compress&cs=tinysrgb&w=1600',
  zaragoza: 'https://images.pexels.com/photos/10430436/pexels-photo-10430436.jpeg?auto=compress&cs=tinysrgb&w=1600',
  zermatt: 'https://images.pexels.com/photos/19244970/pexels-photo-19244970.jpeg?auto=compress&cs=tinysrgb&w=1600',
  zurich: 'https://images.pexels.com/photos/34007139/pexels-photo-34007139.jpeg?auto=compress&cs=tinysrgb&w=1600',
};

// Traduccion de nombres de pais para el badge/lead en ES (evita dejar "France-Italy"
// sin traducir dentro de una frase en espanol). Los pares tipo "France-Italy" se
// dividen por guion y se traduce cada lado.
const COUNTRY_TR = {
  es: { Austria: 'Austria', Belgium: 'Bélgica', Czech: 'Chequia', Denmark: 'Dinamarca', France: 'Francia', Germany: 'Alemania', Hungary: 'Hungría', Italy: 'Italia', Netherlands: 'Países Bajos', Norway: 'Noruega', Portugal: 'Portugal', Slovenia: 'Eslovenia', Spain: 'España', Sweden: 'Suecia', Switzerland: 'Suiza', UK: 'Reino Unido' },
  fr: { Austria: 'Autriche', Belgium: 'Belgique', Czech: 'Tchéquie', Denmark: 'Danemark', France: 'France', Germany: 'Allemagne', Hungary: 'Hongrie', Italy: 'Italie', Netherlands: 'Pays-Bas', Norway: 'Norvège', Portugal: 'Portugal', Slovenia: 'Slovénie', Spain: 'Espagne', Sweden: 'Suède', Switzerland: 'Suisse', UK: 'Royaume-Uni' },
  it: { Austria: 'Austria', Belgium: 'Belgio', Czech: 'Cechia', Denmark: 'Danimarca', France: 'Francia', Germany: 'Germania', Hungary: 'Ungheria', Italy: 'Italia', Netherlands: 'Paesi Bassi', Norway: 'Norvegia', Portugal: 'Portogallo', Slovenia: 'Slovenia', Spain: 'Spagna', Sweden: 'Svezia', Switzerland: 'Svizzera', UK: 'Regno Unito' }
};
function translateCountry(country, lang) {
  const dict = COUNTRY_TR[lang];
  if (!dict) return country;
  return country.split('-').map(c => dict[c] || c).join('-');
}

// Sufijo de URL por idioma. EN es la raíz; el resto va en subcarpeta.
function langSuffix(lang) { return { en: '/', es: '/es/', fr: '/fr/', it: '/it/' }[lang] || '/'; }
// URL canónica (self-referencing) por idioma — cada página apunta a sí misma.
function canonicalUrl(slug, lang) { return `https://glosx.app/rutas/${slug}${langSuffix(lang)}`; }
// Selector de idioma en el nav: links a los OTROS 3 idiomas.
const LANG_LABELS = { en: 'EN', es: 'ES', fr: 'FR', it: 'IT' };
const LANG_NAMES = { en: 'English', es: 'Español', fr: 'Français', it: 'Italiano' };
function langSwitchLinks(slug, current) {
  const opts = ['en', 'es', 'fr', 'it'].map(l => {
    const active = l === current ? ' active' : '';
    return `<a class="lang-option${active}" href="/rutas/${slug}${langSuffix(l)}">${LANG_NAMES[l]}</a>`;
  }).join('');
  return `<div class="lang-wrapper"><button type="button" class="lang-btn" aria-label="Language" onclick="event.stopPropagation();this.nextElementSibling.classList.toggle('open');"><span>${LANG_LABELS[current]}</span><span style="font-size:10px;opacity:0.6">▾</span></button><div class="lang-dropdown">${opts}</div></div>`;
}
// Etiquetas localizadas para el breadcrumb (Home / Rutas).
const BREADCRUMB = {
  en: { home: 'Home', routes: 'Routes' }, es: { home: 'Inicio', routes: 'Rutas' },
  fr: { home: 'Accueil', routes: 'Itinéraires' }, it: { home: 'Home', routes: 'Percorsi' }
};

// Elige una de N variantes de copy de forma determinística según el slug de la ruta,
// para que el texto de "cuerpo" (lead, FAQ, tips) no sea idéntico en las ~104 páginas
// (riesgo de scaled content abuse: mismo template, solo cambia la ciudad).
function hashSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}
function pickVariant(slug, variants) {
  return variants[hashSlug(slug) % variants.length];
}

// Language-specific content
const content = {
  en: {
    titleTemplate: (from, to) => `Train from ${from} to ${to} (2026) | Schedules & Cheap Tickets - WoW Train`,
    descriptionTemplate: (from, to) => `Find the cheapest train fares, official schedules, and operator comparisons for ${from} to ${to}. Book safely in your currency.`,
    ogTitleTemplate: (from, to) => `${from} to ${to} by Train: 2026 Guide`,
    ogDescriptionTemplate: (from, to) => `${from} → ${to} by train — route, stations, operators and how to book it.`,
    twitterTitleTemplate: (from, to) => `${from} to ${to} by Train: 2026 Guide`,
    twitterDescriptionTemplate: (from, to) => `${from} → ${to} by train — route, stations, operators and how to book it.`,
    langSwitch: '<a href="/rutas/{{routeSlug}}/es/" class="lang">ES</a>',
    backText: 'All routes',
    badgeLabel: 'Route guide',
    mainTitle: '{{from}} to {{to}} by Train',
    metaText: 'By WoW Train · Updated July 2026 · 4 min read',
    leadVariants: [
      '{{operator}} links {{from}} to {{to}} in around {{duration}}, with comfortable services running through the {{country}} countryside.',
      'Travelling from {{from}} to {{to}} by rail takes roughly {{duration}} on {{operator}}, a straightforward alternative to flying between the two cities.',
      '{{operator}} covers the {{from}}–{{to}} run in about {{duration}}. It\'s one of the more relaxed ways to cross {{country}} without a car.'
    ],
    klookTitle: 'Book <span class="klook-cta-city">{{from}}</span> &rarr; <span class="klook-cta-city">{{to}}</span> on Klook',
    klookSubtitle: '{{operator}} · {{duration}} · from {{price}} · free cancellation on select fares',
    klookBtnLabel: 'Book Ticket',
    checkSchedulesText: 'Check schedules & book →',
    opensNewTabText: 'Opens in a new tab — come back here anytime.',
    howLongTitle: 'How long is the train from {{from}} to {{to}}?',
    howLongVariants: [
      'The fastest trains take around {{duration}}, with several departures a day. Check the live schedule for your date.',
      'Journey time is about {{duration}} on the quickest service. Departures run multiple times daily, so there\'s usually a slot that fits your plans.',
      'Plan for roughly {{duration}} door to door on the fastest train. Slower connections exist too, so always confirm the exact time for your travel date.'
    ],
    whoRunsTitle: 'Which trains run from {{from}} to {{to}}?',
    whoRunsVariants: [
      'The route is run by {{operator}}. Comparing the day\'s departures in one search finds the best time and fare.',
      '{{operator}} operates this route. A single search across the day\'s trains makes it easy to line up a departure with the fare you want.',
      'This connection is served by {{operator}}. Checking all of the day\'s trains at once is the fastest way to spot the cheapest seat.'
    ],
    priceTitle: '{{from}} to {{to}} train price (2026)',
    priceText: 'Advance fares start from around {{price}}, rising as the date approaches.',
    hotelSectionTitle: 'Where to stay',
    localInsightHeading: 'Worth knowing',
    bestFareTitle: 'How to get the best fare',
    bestFareVariants: [
      [
        '<strong>Book early.</strong> The cheapest saver fares sell out first — booking ahead can be dramatically cheaper than buying on the day.',
        '<strong>Travel off-peak.</strong> Mid-morning and mid-week departures tend to be quieter and cheaper.',
        '<strong>Consider first class</strong> — on many routes the upgrade is modest and very comfortable.',
        '<strong>Compare in one place</strong> to see every departure at a glance.'
      ],
      [
        '<strong>Lock in a saver fare early.</strong> The lowest price bracket is usually limited and disappears first as the date fills up.',
        '<strong>Avoid the Friday/Sunday rush.</strong> Weekday and mid-morning trains are typically both quieter and cheaper.',
        '<strong>Check first class pricing anyway</strong> — it\'s sometimes only a small step up from standard.',
        '<strong>Run one search across every operator</strong> instead of checking each site separately.'
      ],
      [
        '<strong>Buy ahead of time.</strong> Prices climb as the departure date gets closer, sometimes by a large margin.',
        '<strong>Shift your departure slightly.</strong> Leaving an hour earlier or later than peak times often drops the fare noticeably.',
        '<strong>Don\'t rule out first class</strong> on longer routes — the price gap can be smaller than expected.',
        '<strong>Compare all departures side by side</strong> rather than booking the first result you see.'
      ]
    ],
    readyText: 'Ready to go? Check live {{from}} → {{to}} times and fares and book your seat — secure checkout, mobile tickets, every operator in one search.',
    compareText: 'Prefer to compare every rail operator?',
    moreRoutesTitle: 'More European train routes',
    trainSegmentTitle: '{{from}} → {{to}}',
    trainSegmentDuration: 'Duration: {{duration}}',
    trainSegmentOperator: 'Operator: {{operator}}',
    trainSegmentStation: 'Station: {{station}}',
    bookTicketBtn: 'View schedules and book ticket →',
    hotelCardName: '{{hotelName}}',
    hotelCardLocation: '{{hotelLocation}}',
    hotelCardPrice: 'View current price →',
    economicLink: 'View economic options',
    transferLink: 'Book private transfer in {{to}} →',
    faqHeading: 'Frequently asked questions',
    faqVariants: [
      [
        { q: 'How long is the train from {{from}} to {{to}}?', a: 'The fastest trains from {{from}} to {{to}} take around {{duration}}, with several departures throughout the day.' },
        { q: 'How much does the {{from}} to {{to}} train cost?', a: 'Advance fares for the {{from}} to {{to}} train start from around {{price}} and rise as the travel date approaches, so booking early usually gets the cheapest ticket.' },
        { q: 'Which train companies operate the {{from}} to {{to}} route?', a: 'The {{from}} to {{to}} route is operated by {{operator}}. Comparing the day\'s departures in one search finds the best time and fare.' },
        { q: 'Is there a direct train from {{from}} to {{to}}?', a: '{{operator}} runs services between {{from}} and {{to}} — check the live schedule for your date to see direct trains and any connections.' },
        { q: 'When is the cheapest time to book {{from}} to {{to}} train tickets?', a: 'The cheapest {{from}} to {{to}} fares are usually released a few weeks to a few months ahead and sell out first, so booking early and travelling mid-week or off-peak gets the best price.' }
      ],
      [
        { q: 'What\'s the journey time between {{from}} and {{to}}?', a: 'Expect around {{duration}} on the fastest {{from}}–{{to}} train. Several trains run each day, so check the live timetable to pick your slot.' },
        { q: 'What\'s a typical fare on the {{from}} to {{to}} train?', a: 'Fares typically start near {{price}} when booked in advance and climb closer to departure, so an early booking is the main way to keep the cost down.' },
        { q: 'Who operates trains between {{from}} and {{to}}?', a: '{{operator}} runs this route. Looking at the full day\'s departures in one search makes it easier to match a good time with a good price.' },
        { q: 'Can you go from {{from}} to {{to}} without changing trains?', a: '{{operator}} services connect {{from}} and {{to}} — the live schedule for your specific date will show whether it\'s direct or involves a change.' },
        { q: 'How far ahead should I book {{from}} to {{to}} tickets?', a: 'The lowest fares tend to appear weeks or months before departure and go quickly, so booking early — and avoiding peak days — usually pays off.' }
      ],
      [
        { q: 'How many hours does {{from}} to {{to}} take by train?', a: 'The quickest {{from}}–{{to}} trains run about {{duration}}. There are multiple departures daily, so it\'s worth checking today\'s schedule for the exact times.' },
        { q: 'What does a {{from}} to {{to}} train ticket cost?', a: 'Ticket prices for {{from}} to {{to}} start from roughly {{price}} for advance purchase and increase the closer you get to the travel date.' },
        { q: 'What operator serves the {{from}}–{{to}} line?', a: '{{operator}} handles this connection. Comparing every departure that day in one place is the quickest way to find the best combination of time and price.' },
        { q: 'Do I need to change trains between {{from}} and {{to}}?', a: 'It depends on the day — {{operator}} runs both direct and connecting services, so check the live schedule for your travel date to confirm.' },
        { q: 'When should I book {{from}} to {{to}} tickets for the best price?', a: 'Book as early as you can: the cheapest seats are released first and disappear fast, and travelling mid-week instead of weekends usually costs less too.' }
      ]
    ]
  },
  es: {
    titleTemplate: (from, to) => `Tren ${from} a ${to} (2026) | Horarios y Billetes Baratos - WoW Train`,
    descriptionTemplate: (from, to) => `Encuentra las tarifas de tren más baratas, horarios oficiales y comparaciones de operadores para ${from} a ${to}. Reserva de forma segura en tu moneda.`,
    ogTitleTemplate: (from, to) => `${from} a ${to} en Tren: Guía 2026`,
    ogDescriptionTemplate: (from, to) => `${from} → ${to} en tren — ruta, estaciones, operadores y cómo reservarlo.`,
    twitterTitleTemplate: (from, to) => `${from} a ${to} en Tren: Guía 2026`,
    twitterDescriptionTemplate: (from, to) => `${from} → ${to} en tren — ruta, estaciones, operadores y cómo reservarlo.`,
    langSwitch: '<a href="/rutas/{{routeSlug}}/" class="lang">EN</a>',
    backText: 'Todas las rutas',
    badgeLabel: 'Guía de ruta',
    mainTitle: 'Tren de {{from}} a {{to}}',
    metaText: 'Por WoW Train · Actualizado julio 2026 · 4 min de lectura',
    leadVariants: [
      '{{operator}} conecta {{from}} con {{to}} en alrededor de {{duration}}, con servicios cómodos que recorren el campo de {{country}}.',
      'Viajar de {{from}} a {{to}} en tren toma cerca de {{duration}} con {{operator}}, una alternativa directa a volar entre las dos ciudades.',
      '{{operator}} cubre el trayecto {{from}}–{{to}} en unas {{duration}}. Es una de las formas más relajadas de cruzar {{country}} sin auto.'
    ],
    klookTitle: 'Reserva <span class="klook-cta-city">{{from}}</span> &rarr; <span class="klook-cta-city">{{to}}</span> en Klook',
    klookSubtitle: '{{operator}} · {{duration}} · desde {{price}} · cancelación gratis en tarifas seleccionadas',
    klookBtnLabel: 'Reservar',
    checkSchedulesText: 'Ver horarios y reservar →',
    opensNewTabText: 'Se abre en una nueva pestaña — vuelve aquí cuando quieras.',
    howLongTitle: '¿Cuánto dura el tren de {{from}} a {{to}}?',
    howLongVariants: [
      'Los trenes más rápidos tardan alrededor de {{duration}}, con varias salidas al día. Consulta el horario en vivo para tu fecha.',
      'El trayecto dura unas {{duration}} en el servicio más rápido. Hay salidas varias veces al día, así que suele haber un horario que se ajuste a tu plan.',
      'Calculá unas {{duration}} de punta a punta en el tren más veloz. También hay conexiones más lentas, así que conviene confirmar el horario exacto para tu fecha.'
    ],
    whoRunsTitle: '¿Qué trenes van de {{from}} a {{to}}?',
    whoRunsVariants: [
      'La ruta es operada por {{operator}}. Comparando las salidas del día en una sola búsqueda encuentras el mejor horario y tarifa.',
      '{{operator}} opera esta ruta. Una sola búsqueda con todas las salidas del día facilita encontrar el horario con la tarifa que buscas.',
      'Esta conexión la cubre {{operator}}. Revisar todos los trenes del día juntos es la forma más rápida de encontrar el asiento más barato.'
    ],
    priceTitle: 'Precio del tren {{from}} a {{to}} (2026)',
    priceText: 'Las tarifas anticipadas comienzan desde {{price}}, aumentando a medida que se acerca la fecha.',
    hotelSectionTitle: 'Dónde alojarte',
    localInsightHeading: 'Dato interesante',
    bestFareTitle: 'Cómo conseguir la mejor tarifa',
    bestFareVariants: [
      [
        '<strong>Reserva con antelación.</strong> Las tarifas más baratas se agotan primero — reservar con anticipación puede ser mucho más barato que comprar el mismo día.',
        '<strong>Viaja fuera de horas punta.</strong> Las salidas de media mañana y mediados de semana tienden a ser más tranquilas y baratas.',
        '<strong>Considera primera clase</strong> — en muchas rutas la actualización es modesta y muy cómoda.',
        '<strong>Compara en un solo lugar</strong> para ver cada salida de un vistazo.'
      ],
      [
        '<strong>Asegura una tarifa reducida temprano.</strong> El tramo de precio más bajo suele ser limitado y se agota primero a medida que se llena la fecha.',
        '<strong>Evita el pico de viernes y domingo.</strong> Los trenes de entre semana y media mañana suelen ser más tranquilos y baratos.',
        '<strong>Fíjate igual en primera clase</strong> — a veces el salto respecto a turista es mínimo.',
        '<strong>Haz una sola búsqueda que cubra todos los operadores</strong> en vez de revisar cada sitio por separado.'
      ],
      [
        '<strong>Compra con anticipación.</strong> El precio sube a medida que se acerca la fecha de salida, a veces bastante.',
        '<strong>Corre un poco tu horario.</strong> Salir una hora antes o después del pico suele bajar la tarifa de forma notable.',
        '<strong>No descartes primera clase</strong> en trayectos largos — la diferencia de precio puede ser menor de lo esperado.',
        '<strong>Compara todas las salidas juntas</strong> en vez de reservar el primer resultado que veas.'
      ]
    ],
    readyText: '¿Listo para ir? Consulta los horarios y tarifas en vivo de {{from}} → {{to}} y reserva tu asiento — pago seguro, billetes móviles, cada operador en una sola búsqueda.',
    compareText: '¿Prefieres comparar cada operador ferroviario?',
    moreRoutesTitle: 'Más rutas de tren europeas',
    trainSegmentTitle: '{{from}} → {{to}}',
    trainSegmentDuration: 'Duración: {{duration}}',
    trainSegmentOperator: 'Operador: {{operator}}',
    trainSegmentStation: 'Estación: {{station}}',
    bookTicketBtn: 'Ver horarios y reservar billete →',
    hotelCardName: '{{hotelName}}',
    hotelCardLocation: '{{hotelLocation}}',
    hotelCardPrice: 'Ver precio actual →',
    economicLink: 'Ver opciones económicas',
    transferLink: 'Reservar traslado privado en {{to}} →',
    faqHeading: 'Preguntas frecuentes',
    faqVariants: [
      [
        { q: '¿Cuánto dura el tren de {{from}} a {{to}}?', a: 'Los trenes más rápidos de {{from}} a {{to}} tardan alrededor de {{duration}}, con varias salidas a lo largo del día.' },
        { q: '¿Cuánto cuesta el tren de {{from}} a {{to}}?', a: 'Las tarifas anticipadas del tren de {{from}} a {{to}} comienzan desde {{price}} y aumentan a medida que se acerca la fecha, así que reservar con antelación suele conseguir el billete más barato.' },
        { q: '¿Qué compañías operan la ruta de {{from}} a {{to}}?', a: 'La ruta de {{from}} a {{to}} es operada por {{operator}}. Comparar las salidas del día en una sola búsqueda encuentra el mejor horario y tarifa.' },
        { q: '¿Hay tren directo de {{from}} a {{to}}?', a: '{{operator}} opera servicios entre {{from}} y {{to}} — consulta el horario en vivo para tu fecha y verás los trenes directos y las conexiones.' },
        { q: '¿Cuándo es más barato reservar los billetes de tren de {{from}} a {{to}}?', a: 'Las tarifas más baratas de {{from}} a {{to}} suelen salir con semanas o meses de antelación y se agotan primero, así que reservar temprano y viajar entre semana o fuera de horas punta consigue el mejor precio.' }
      ],
      [
        { q: '¿Cuánto tiempo se tarda de {{from}} a {{to}} en tren?', a: 'El tren más rápido entre {{from}} y {{to}} tarda alrededor de {{duration}}. Hay varias salidas cada día, así que conviene revisar el horario en vivo para elegir el tuyo.' },
        { q: '¿Cuál es el precio típico del tren {{from}} a {{to}}?', a: 'Las tarifas suelen empezar cerca de {{price}} al reservar con anticipación y suben a medida que se acerca la fecha, por lo que reservar temprano es la forma principal de pagar menos.' },
        { q: '¿Quién opera los trenes entre {{from}} y {{to}}?', a: '{{operator}} cubre esta ruta. Mirar todas las salidas del día en una sola búsqueda facilita combinar un buen horario con un buen precio.' },
        { q: '¿Se puede ir de {{from}} a {{to}} sin hacer trasbordo?', a: '{{operator}} conecta {{from}} y {{to}} — el horario en vivo para tu fecha específica mostrará si es directo o requiere un cambio.' },
        { q: '¿Con cuánta anticipación conviene reservar de {{from}} a {{to}}?', a: 'Las tarifas más bajas suelen aparecer semanas o meses antes de la salida y se agotan rápido, así que reservar temprano — y evitar los días pico — suele valer la pena.' }
      ],
      [
        { q: '¿Cuántas horas son de {{from}} a {{to}} en tren?', a: 'Los trenes más rápidos entre {{from}} y {{to}} demoran unas {{duration}}. Hay varias salidas diarias, así que conviene revisar el horario de hoy para los horarios exactos.' },
        { q: '¿Cuánto sale el pasaje de {{from}} a {{to}} en tren?', a: 'El precio del pasaje de {{from}} a {{to}} arranca desde aproximadamente {{price}} en compra anticipada y sube a medida que se acerca la fecha de viaje.' },
        { q: '¿Qué operador cubre la línea {{from}}–{{to}}?', a: '{{operator}} maneja esta conexión. Comparar todas las salidas de ese día en un mismo lugar es la forma más rápida de encontrar la mejor combinación de horario y precio.' },
        { q: '¿Hace falta hacer trasbordo entre {{from}} y {{to}}?', a: 'Depende del día — {{operator}} tiene tanto servicios directos como con conexión, así que consulta el horario en vivo para tu fecha para confirmarlo.' },
        { q: '¿Cuándo conviene reservar los billetes de {{from}} a {{to}} para pagar menos?', a: 'Reserva lo antes posible: los asientos más baratos se liberan primero y desaparecen rápido, y viajar entre semana en vez de fin de semana también suele salir más barato.' }
      ]
    ]
  },
  fr: {
    titleTemplate: (from, to) => `Train de ${from} à ${to} (2026) | Horaires et Billets Pas Chers - WoW Train`,
    descriptionTemplate: (from, to) => `Trouvez les tarifs de train les moins chers, les horaires officiels et une comparaison des opérateurs pour ${from} → ${to}. Réservation sécurisée dans votre monnaie.`,
    ogTitleTemplate: (from, to) => `${from} à ${to} en Train : Guide 2026`,
    ogDescriptionTemplate: (from, to) => `${from} → ${to} en train — itinéraire, gares, opérateurs et comment réserver.`,
    twitterTitleTemplate: (from, to) => `${from} à ${to} en Train : Guide 2026`,
    twitterDescriptionTemplate: (from, to) => `${from} → ${to} en train — itinéraire, gares, opérateurs et comment réserver.`,
    backText: 'Tous les itinéraires',
    badgeLabel: 'Guide d\'itinéraire',
    mainTitle: 'Train de {{from}} à {{to}}',
    metaText: 'Par WoW Train · Mis à jour en juillet 2026 · 4 min de lecture',
    leadVariants: [
      '{{operator}} relie {{from}} à {{to}} en environ {{duration}}, avec des services confortables qui traversent la campagne de {{country}}.',
      'Voyager de {{from}} à {{to}} en train prend environ {{duration}} avec {{operator}}, une alternative simple à l\'avion entre les deux villes.',
      '{{operator}} assure le trajet {{from}}–{{to}} en environ {{duration}}. C\'est l\'une des façons les plus tranquilles de traverser {{country}} sans voiture.'
    ],
    klookTitle: 'Réservez <span class="klook-cta-city">{{from}}</span> &rarr; <span class="klook-cta-city">{{to}}</span> sur Klook',
    klookSubtitle: '{{operator}} · {{duration}} · à partir de {{price}} · annulation gratuite sur tarifs sélectionnés',
    klookBtnLabel: 'Réserver',
    checkSchedulesText: 'Voir horaires et réserver →',
    opensNewTabText: 'S\'ouvre dans un nouvel onglet — revenez ici quand vous voulez.',
    howLongTitle: 'Combien de temps dure le train de {{from}} à {{to}} ?',
    howLongVariants: [
      'Les trains les plus rapides mettent environ {{duration}}, avec plusieurs départs par jour. Consultez les horaires en direct pour votre date.',
      'Le trajet dure environ {{duration}} sur le service le plus rapide. Il y a plusieurs départs chaque jour, il y a donc généralement un horaire qui vous convient.',
      'Comptez environ {{duration}} de bout en bout sur le train le plus rapide. Des correspondances plus lentes existent aussi, vérifiez donc l\'horaire exact pour votre date.'
    ],
    whoRunsTitle: 'Quels trains circulent de {{from}} à {{to}} ?',
    whoRunsVariants: [
      'L\'itinéraire est assuré par {{operator}}. Comparer les départs de la journée en une seule recherche vous donne le meilleur horaire et tarif.',
      '{{operator}} exploite cette ligne. Une seule recherche regroupant tous les départs du jour facilite la combinaison horaire/tarif idéale.',
      'Cette liaison est assurée par {{operator}}. Vérifier tous les trains du jour en même temps est le moyen le plus rapide de trouver le siège le moins cher.'
    ],
    priceTitle: 'Prix du train {{from}} à {{to}} (2026)',
    priceText: 'Les tarifs anticipés commencent autour de {{price}} et augmentent à l\'approche de la date.',
    hotelSectionTitle: 'Où loger',
    localInsightHeading: 'Bon à savoir',
    bestFareTitle: 'Comment obtenir le meilleur tarif',
    bestFareVariants: [
      [
        '<strong>Réservez tôt.</strong> Les tarifs les moins chers partent en premier — réserver à l\'avance peut être bien moins cher que le jour même.',
        '<strong>Voyagez en heures creuses.</strong> Les départs en milieu de matinée et en milieu de semaine sont souvent plus calmes et moins chers.',
        '<strong>Pensez à la première classe</strong> — sur de nombreux trajets le surclassement est modeste et très confortable.',
        '<strong>Comparez au même endroit</strong> pour voir tous les départs d\'un coup d\'œil.'
      ],
      [
        '<strong>Bloquez un tarif réduit tôt.</strong> La tranche de prix la plus basse est souvent limitée et disparaît en premier.',
        '<strong>Évitez la ruée du vendredi et du dimanche.</strong> Les trains en semaine et en milieu de matinée sont généralement plus calmes et moins chers.',
        '<strong>Vérifiez quand même la première classe</strong> — l\'écart avec la deuxième classe est parfois minime.',
        '<strong>Faites une seule recherche couvrant tous les opérateurs</strong> plutôt que de vérifier chaque site séparément.'
      ],
      [
        '<strong>Achetez à l\'avance.</strong> Le prix grimpe à l\'approche de la date de départ, parfois nettement.',
        '<strong>Décalez légèrement votre départ.</strong> Partir une heure avant ou après les heures de pointe fait souvent baisser le tarif.',
        '<strong>N\'excluez pas la première classe</strong> sur les longs trajets — l\'écart de prix peut être plus faible que prévu.',
        '<strong>Comparez tous les départs côte à côte</strong> plutôt que de réserver le premier résultat venu.'
      ]
    ],
    readyText: 'Prêt à partir ? Consultez les horaires et tarifs en direct de {{from}} → {{to}} et réservez votre place — paiement sécurisé, billets mobiles, tous les opérateurs en une recherche.',
    compareText: 'Vous préférez comparer tous les opérateurs ferroviaires ?',
    moreRoutesTitle: 'Plus d\'itinéraires de train en Europe',
    trainSegmentTitle: '{{from}} → {{to}}',
    trainSegmentDuration: 'Durée : {{duration}}',
    trainSegmentOperator: 'Opérateur : {{operator}}',
    trainSegmentStation: 'Gare : {{station}}',
    bookTicketBtn: 'Voir horaires et réserver →',
    hotelCardName: '{{hotelName}}',
    hotelCardLocation: '{{hotelLocation}}',
    hotelCardPrice: 'Voir le prix actuel →',
    economicLink: 'Voir les options économiques',
    transferLink: 'Réserver un transfert privé à {{to}} →',
    faqHeading: 'Questions fréquentes',
    faqVariants: [
      [
        { q: 'Combien de temps dure le train de {{from}} à {{to}} ?', a: 'Les trains les plus rapides de {{from}} à {{to}} mettent environ {{duration}}, avec plusieurs départs tout au long de la journée.' },
        { q: 'Combien coûte le train de {{from}} à {{to}} ?', a: 'Les tarifs anticipés du train {{from}} → {{to}} commencent autour de {{price}} et augmentent à l\'approche de la date, donc réserver tôt permet généralement d\'obtenir le billet le moins cher.' },
        { q: 'Quelles compagnies exploitent la ligne {{from}} → {{to}} ?', a: 'La ligne {{from}} → {{to}} est exploitée par {{operator}}. Comparer les départs du jour en une seule recherche donne le meilleur horaire et tarif.' },
        { q: 'Y a-t-il un train direct de {{from}} à {{to}} ?', a: '{{operator}} assure des services entre {{from}} et {{to}} — consultez les horaires en direct pour votre date afin de voir les trains directs et les correspondances.' },
        { q: 'Quand est-il le moins cher de réserver les billets de train {{from}} → {{to}} ?', a: 'Les tarifs les moins chers de {{from}} → {{to}} sortent généralement quelques semaines à quelques mois à l\'avance et partent en premier, donc réserver tôt et voyager en milieu de semaine ou en heures creuses donne le meilleur prix.' }
      ],
      [
        { q: 'Quel est le temps de trajet entre {{from}} et {{to}} ?', a: 'Comptez environ {{duration}} sur le train le plus rapide {{from}}–{{to}}. Plusieurs trains circulent chaque jour, vérifiez donc l\'horaire en direct pour choisir le vôtre.' },
        { q: 'Quel est le tarif habituel du train {{from}} à {{to}} ?', a: 'Les tarifs démarrent généralement autour de {{price}} en réservation anticipée et augmentent à l\'approche du départ, donc réserver tôt reste le principal moyen de payer moins cher.' },
        { q: 'Qui opère les trains entre {{from}} et {{to}} ?', a: '{{operator}} assure cette ligne. Regarder tous les départs du jour en une seule recherche facilite la combinaison d\'un bon horaire et d\'un bon prix.' },
        { q: 'Peut-on aller de {{from}} à {{to}} sans correspondance ?', a: 'Des services {{operator}} relient {{from}} et {{to}} — l\'horaire en direct pour votre date précise indiquera s\'il s\'agit d\'un trajet direct ou avec correspondance.' },
        { q: 'Combien de temps à l\'avance réserver les billets {{from}} à {{to}} ?', a: 'Les tarifs les plus bas apparaissent en général plusieurs semaines à plusieurs mois avant le départ et partent vite, donc réserver tôt — et éviter les jours de pointe — paie généralement.' }
      ],
      [
        { q: 'Combien d\'heures pour aller de {{from}} à {{to}} en train ?', a: 'Les trains les plus rapides entre {{from}} et {{to}} mettent environ {{duration}}. Il y a plusieurs départs quotidiens, vérifiez donc l\'horaire du jour pour les heures exactes.' },
        { q: 'Combien coûte un billet de train {{from}} à {{to}} ?', a: 'Le prix du billet {{from}} à {{to}} démarre autour de {{price}} en achat anticipé et augmente à mesure que la date de voyage approche.' },
        { q: 'Quel opérateur dessert la ligne {{from}}–{{to}} ?', a: '{{operator}} gère cette liaison. Comparer tous les départs de la journée au même endroit est le moyen le plus rapide de trouver la meilleure combinaison horaire/prix.' },
        { q: 'Faut-il changer de train entre {{from}} et {{to}} ?', a: 'Cela dépend du jour — {{operator}} propose des services directs et avec correspondance, vérifiez donc l\'horaire en direct pour votre date.' },
        { q: 'Quand réserver les billets {{from}} à {{to}} pour le meilleur prix ?', a: 'Réservez le plus tôt possible : les places les moins chères partent en premier, et voyager en semaine plutôt que le week-end coûte généralement moins cher aussi.' }
      ]
    ]
  },
  it: {
    titleTemplate: (from, to) => `Treno da ${from} a ${to} (2026) | Orari e Biglietti Economici - WoW Train`,
    descriptionTemplate: (from, to) => `Trova le tariffe ferroviarie più economiche, gli orari ufficiali e il confronto tra operatori per ${from} → ${to}. Prenotazione sicura nella tua valuta.`,
    ogTitleTemplate: (from, to) => `${from} a ${to} in Treno: Guida 2026`,
    ogDescriptionTemplate: (from, to) => `${from} → ${to} in treno — percorso, stazioni, operatori e come prenotare.`,
    twitterTitleTemplate: (from, to) => `${from} a ${to} in Treno: Guida 2026`,
    twitterDescriptionTemplate: (from, to) => `${from} → ${to} in treno — percorso, stazioni, operatori e come prenotare.`,
    backText: 'Tutti i percorsi',
    badgeLabel: 'Guida al percorso',
    mainTitle: 'Treno da {{from}} a {{to}}',
    metaText: 'Di WoW Train · Aggiornato a luglio 2026 · 4 min di lettura',
    leadVariants: [
      '{{operator}} collega {{from}} a {{to}} in circa {{duration}}, con servizi comodi che attraversano le campagne di {{country}}.',
      'Viaggiare da {{from}} a {{to}} in treno richiede circa {{duration}} con {{operator}}, un\'alternativa semplice al volo tra le due città.',
      '{{operator}} copre la tratta {{from}}–{{to}} in circa {{duration}}. È uno dei modi più rilassanti per attraversare {{country}} senza auto.'
    ],
    klookTitle: 'Prenota <span class="klook-cta-city">{{from}}</span> &rarr; <span class="klook-cta-city">{{to}}</span> su Klook',
    klookSubtitle: '{{operator}} · {{duration}} · da {{price}} · cancellazione gratuita su tariffe selezionate',
    klookBtnLabel: 'Prenota',
    checkSchedulesText: 'Vedi orari e prenota →',
    opensNewTabText: 'Si apre in una nuova scheda — torna qui quando vuoi.',
    howLongTitle: 'Quanto dura il treno da {{from}} a {{to}}?',
    howLongVariants: [
      'I treni più veloci impiegano circa {{duration}}, con diverse partenze al giorno. Controlla gli orari in tempo reale per la tua data.',
      'Il viaggio dura circa {{duration}} sul servizio più veloce. Ci sono più partenze al giorno, quindi di solito c\'è un orario adatto ai tuoi piani.',
      'Calcola circa {{duration}} da stazione a stazione sul treno più veloce. Esistono anche coincidenze più lente, quindi conferma sempre l\'orario esatto per la tua data.'
    ],
    whoRunsTitle: 'Quali treni collegano {{from}} a {{to}}?',
    whoRunsVariants: [
      'Il percorso è gestito da {{operator}}. Confrontare le partenze del giorno in un\'unica ricerca ti dà l\'orario e la tariffa migliori.',
      '{{operator}} gestisce questa tratta. Un\'unica ricerca su tutte le partenze del giorno rende più facile trovare orario e tariffa giusti insieme.',
      'Questo collegamento è servito da {{operator}}. Controllare tutti i treni del giorno insieme è il modo più rapido per trovare il posto più economico.'
    ],
    priceTitle: 'Prezzo del treno {{from}} a {{to}} (2026)',
    priceText: 'Le tariffe anticipate partono da circa {{price}} e aumentano con l\'avvicinarsi della data.',
    hotelSectionTitle: 'Dove alloggiare',
    localInsightHeading: 'Da sapere',
    bestFareTitle: 'Come ottenere la tariffa migliore',
    bestFareVariants: [
      [
        '<strong>Prenota in anticipo.</strong> Le tariffe più economiche si esauriscono per prime — prenotare in anticipo può essere molto più conveniente che comprare in giornata.',
        '<strong>Viaggia in orari non di punta.</strong> Le partenze a metà mattina e a metà settimana tendono a essere più tranquille ed economiche.',
        '<strong>Valuta la prima classe</strong> — su molti percorsi il supplemento è modesto e molto comodo.',
        '<strong>Confronta in un unico posto</strong> per vedere ogni partenza a colpo d\'occhio.'
      ],
      [
        '<strong>Blocca una tariffa ridotta presto.</strong> La fascia di prezzo più bassa è spesso limitata e si esaurisce per prima.',
        '<strong>Evita il picco di venerdì e domenica.</strong> I treni infrasettimanali e di metà mattina sono di solito più tranquilli ed economici.',
        '<strong>Controlla comunque la prima classe</strong> — a volte il salto rispetto alla seconda è minimo.',
        '<strong>Fai un\'unica ricerca su tutti gli operatori</strong> invece di controllare ogni sito separatamente.'
      ],
      [
        '<strong>Acquista in anticipo.</strong> Il prezzo sale con l\'avvicinarsi della data di partenza, a volte parecchio.',
        '<strong>Sposta leggermente l\'orario.</strong> Partire un\'ora prima o dopo l\'orario di punta spesso abbassa la tariffa in modo evidente.',
        '<strong>Non escludere la prima classe</strong> sui percorsi lunghi — la differenza di prezzo può essere minore del previsto.',
        '<strong>Confronta tutte le partenze insieme</strong> invece di prenotare il primo risultato che vedi.'
      ]
    ],
    readyText: 'Pronto a partire? Controlla orari e tariffe in tempo reale di {{from}} → {{to}} e prenota il tuo posto — pagamento sicuro, biglietti su mobile, ogni operatore in un\'unica ricerca.',
    compareText: 'Preferisci confrontare tutti gli operatori ferroviari?',
    moreRoutesTitle: 'Altri percorsi ferroviari in Europa',
    trainSegmentTitle: '{{from}} → {{to}}',
    trainSegmentDuration: 'Durata: {{duration}}',
    trainSegmentOperator: 'Operatore: {{operator}}',
    trainSegmentStation: 'Stazione: {{station}}',
    bookTicketBtn: 'Vedi orari e prenota biglietto →',
    hotelCardName: '{{hotelName}}',
    hotelCardLocation: '{{hotelLocation}}',
    hotelCardPrice: 'Vedi prezzo attuale →',
    economicLink: 'Vedi opzioni economiche',
    transferLink: 'Prenota un transfer privato a {{to}} →',
    faqHeading: 'Domande frequenti',
    faqVariants: [
      [
        { q: 'Quanto dura il treno da {{from}} a {{to}}?', a: 'I treni più veloci da {{from}} a {{to}} impiegano circa {{duration}}, con diverse partenze durante la giornata.' },
        { q: 'Quanto costa il treno da {{from}} a {{to}}?', a: 'Le tariffe anticipate del treno {{from}} → {{to}} partono da circa {{price}} e aumentano con l\'avvicinarsi della data, quindi prenotare in anticipo di solito permette di avere il biglietto più economico.' },
        { q: 'Quali compagnie operano la tratta {{from}} → {{to}}?', a: 'La tratta {{from}} → {{to}} è operata da {{operator}}. Confrontare le partenze del giorno in un\'unica ricerca dà l\'orario e la tariffa migliori.' },
        { q: 'C\'è un treno diretto da {{from}} a {{to}}?', a: '{{operator}} opera servizi tra {{from}} e {{to}} — controlla gli orari in tempo reale per la tua data per vedere i treni diretti e le coincidenze.' },
        { q: 'Quando conviene di più prenotare i biglietti del treno {{from}} → {{to}}?', a: 'Le tariffe più economiche di {{from}} → {{to}} escono di solito da qualche settimana a qualche mese prima e si esauriscono per prime, quindi prenotare in anticipo e viaggiare a metà settimana o in orari non di punta dà il prezzo migliore.' }
      ],
      [
        { q: 'Quanto tempo si impiega da {{from}} a {{to}} in treno?', a: 'Il treno più veloce tra {{from}} e {{to}} impiega circa {{duration}}. Ci sono più partenze ogni giorno, quindi controlla l\'orario in tempo reale per scegliere il tuo.' },
        { q: 'Qual è il prezzo tipico del treno {{from}} a {{to}}?', a: 'Le tariffe di solito partono da circa {{price}} prenotando in anticipo e salgono con l\'avvicinarsi della data, quindi prenotare presto resta il modo principale per spendere meno.' },
        { q: 'Chi gestisce i treni tra {{from}} e {{to}}?', a: '{{operator}} copre questa tratta. Guardare tutte le partenze del giorno in un\'unica ricerca rende più facile abbinare un buon orario a un buon prezzo.' },
        { q: 'Si può andare da {{from}} a {{to}} senza cambio?', a: 'I servizi {{operator}} collegano {{from}} e {{to}} — l\'orario in tempo reale per la tua data specifica mostrerà se è diretto o richiede un cambio.' },
        { q: 'Con quanto anticipo conviene prenotare da {{from}} a {{to}}?', a: 'Le tariffe più basse escono di solito settimane o mesi prima della partenza e si esauriscono in fretta, quindi prenotare presto — evitando i giorni di picco — di solito conviene.' }
      ],
      [
        { q: 'Quante ore ci vogliono da {{from}} a {{to}} in treno?', a: 'I treni più veloci tra {{from}} e {{to}} impiegano circa {{duration}}. Ci sono diverse partenze giornaliere, quindi controlla l\'orario di oggi per gli orari esatti.' },
        { q: 'Quanto costa il biglietto del treno {{from}} a {{to}}?', a: 'Il prezzo del biglietto {{from}} a {{to}} parte da circa {{price}} con acquisto anticipato e aumenta man mano che si avvicina la data del viaggio.' },
        { q: 'Quale operatore serve la linea {{from}}–{{to}}?', a: '{{operator}} gestisce questo collegamento. Confrontare tutte le partenze di quel giorno in un unico posto è il modo più rapido per trovare la combinazione migliore tra orario e prezzo.' },
        { q: 'Serve cambiare treno tra {{from}} e {{to}}?', a: 'Dipende dal giorno — {{operator}} offre sia servizi diretti che con coincidenza, quindi controlla l\'orario in tempo reale per la tua data per confermarlo.' },
        { q: 'Quando prenotare i biglietti {{from}} a {{to}} per il prezzo migliore?', a: 'Prenota il prima possibile: i posti più economici vengono rilasciati per primi e si esauriscono in fretta, e viaggiare infrasettimana invece che nel weekend di solito costa meno.' }
      ]
    ]
  }
};

// Generate train segments HTML
function generateTrainSegments(route, lang) {
  const langContent = content[lang];
  const segments = [
    {
      from: route.from,
      to: route.to,
      duration: route.duration,
      operator: route.operator,
      station: `${route.from} Station`
    }
  ];
  
  return segments.map(seg => `
    <div class="train-segment">
      <div class="train-segment-header">
        <span class="train-segment-title">${seg.from} → ${seg.to}</span>
        <span class="train-segment-duration">${langContent.trainSegmentDuration.replace('{{duration}}', seg.duration)}</span>
      </div>
      <div class="train-segment-details">
        <div class="train-segment-detail"><strong>Operator:</strong> ${seg.operator}</div>
        <div class="train-segment-detail"><strong>Station:</strong> ${seg.station}</div>
      </div>
      <a href="https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=${encodeURIComponent(seg.from.toLowerCase())}&to=${encodeURIComponent(seg.to.toLowerCase())}"
         class="cta-btn" target="_blank" rel="noopener sponsored"
         onclick="trackTrainline('route_${route.slug}_${lang}')">
        ${langContent.bookTicketBtn}
      </a>
    </div>
  `).join('');
}

// Generate hotel cards HTML
function generateHotelCards(route, lang) {
  const langContent = content[lang];
  const curated = REAL_HOTELS[route.to.toLowerCase()];
  const hotels = [
    curated
      ? { name: curated.name, location: curated.loc, image: curated.image }
      : {
          name: `${route.to} Grand Hotel`,
          location: `${route.to}, ${route.country}`,
          image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=500'
        }
  ];
  
  return hotels.map(hotel => `
    <div class="hotel-card">
      <div class="hotel-card-header">
        <img class="hotel-card-image" src="${hotel.image}" alt="${hotel.name}" loading="lazy">
        <div class="hotel-card-info">
          <div class="hotel-card-name">${hotel.name}</div>
          <div class="hotel-card-location">${hotel.location}</div>
        </div>
      </div>
      <div class="hotel-card-actions">
        <a href="https://voxa-production-dc15.up.railway.app/affiliate/klook-hotel?city=${route.to.toLowerCase()}" 
           class="cta-btn" target="_blank" rel="noopener sponsored"
           onclick="trackTrainline('hotel_${route.slug}_${lang}')">
          ${langContent.hotelCardPrice}
        </a>
        <br>
        <a href="https://voxa-production-dc15.up.railway.app/affiliate/klook-hotel?city=${route.to.toLowerCase()}" 
           class="economic-link" target="_blank" rel="noopener sponsored">
          ${langContent.economicLink}
        </a>
        <br>
        <a href="https://voxa-production-dc15.up.railway.app/affiliate/kiwitaxi"
           class="transfer-link" target="_blank" rel="noopener sponsored">
          ${langContent.transferLink.replace('{{to}}', route.to)}
        </a>
      </div>
    </div>
  `).join('');
}

// Generate price table HTML
function generatePriceTable(route, lang) {
  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0 8px;font-size:14px;">
      <thead><tr style="border-bottom:1px solid rgba(255,255,255,0.12);text-align:left;">
        <th style="padding:8px 12px;color:#C10016;font-weight:700;">Operator</th>
        <th style="padding:8px 12px;color:#C10016;font-weight:700;">From</th>
        <th style="padding:8px 12px;color:#C10016;font-weight:700;">Journey time</th>
        <th style="padding:8px 12px;color:#C10016;font-weight:700;">Frequency</th>
      </tr></thead>
      <tbody>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
          <td style="padding:8px 12px;">${route.operator}</td>
          <td style="padding:8px 12px;">${route.price}</td>
          <td style="padding:8px 12px;">${route.duration}</td>
          <td style="padding:8px 12px;">Several daily</td>
        </tr>
      </tbody>
    </table>
    <p style="font-size:13px;color:#55565f;margin-bottom:16px;">Prices are indicative advance fares. Check live availability for your exact date.</p>
  `;
}

// Generate photos HTML
function generatePhotos(route) {
  return `
    <img src="https://images.pexels.com/photos/30753243/pexels-photo-30753243.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=500" alt="Scenic view of ${route.to}" loading="lazy" />
    <img src="https://images.pexels.com/photos/30753285/pexels-photo-30753285.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=500" alt="Charming view of ${route.to}" loading="lazy" />
    <img src="https://images.pexels.com/photos/13393083/pexels-photo-13393083.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=500" alt="Historic buildings in ${route.to}" loading="lazy" />
  `;
}

// Rutas relacionadas: prioriza otras rutas que comparten un país/región con la
// actual (mismo origen, mismo destino, o algun país del par {{country}} en comun),
// en vez de mostrar siempre las mismas 4 primeras del array para las ~104 paginas.
function generateRelatedRoutes(route, lang) {
  const suffix = langSuffix(lang);
  const myCountries = route.country.split('-');
  const scored = routes
    .filter(r => r.slug !== route.slug)
    .map(r => {
      let score = 0;
      if (r.from === route.to || r.to === route.from) score += 3; // conecta con la misma ciudad
      const rCountries = r.country.split('-');
      if (rCountries.some(c => myCountries.includes(c))) score += 2; // comparte pais
      return { r, score };
    })
    .sort((a, b) => b.score - a.score || hashSlug(a.r.slug + route.slug) - hashSlug(b.r.slug + route.slug));
  const related = scored.slice(0, 4).map(s => s.r);
  return related.map(r => `
    <a href="/rutas/${r.slug}${suffix}" class="related-link">${r.from} &rarr; ${r.to}</a>
  `).join('');
}

// Reemplaza todos los tokens {{...}} de un string con los datos de la ruta.
// (usa reemplazo global, a diferencia de .replace() que solo cambia el primero)
function fillTokens(str, route, lang) {
  return str
    .replace(/\{\{from\}\}/g, route.from)
    .replace(/\{\{to\}\}/g, route.to)
    .replace(/\{\{duration\}\}/g, route.duration)
    .replace(/\{\{operator\}\}/g, route.operator)
    .replace(/\{\{price\}\}/g, route.price)
    .replace(/\{\{country\}\}/g, translateCountry(route.country, lang));
}

// Parrafo de contenido unico real (no plantilla) para las rutas de mayor
// trafico segun GA4 — dato historico/practico verificable, especifico de esa
// ruta. Devuelve '' para rutas sin localInsight (la mayoria).
function generateLocalInsight(route, lang) {
  if (!route.localInsight) return '';
  const langContent = content[lang];
  const text = route.localInsight[lang] || route.localInsight.en;
  return `
    <h2>${langContent.localInsightHeading}</h2>
    <p>${text}</p>`;
}

// FAQ visible (h3 pregunta + p respuesta, siempre en el DOM para que Google lo
// lea; sin JS ni contenido oculto). Apunta a las busquedas de cola larga.
function generateFAQ(route, lang) {
  const langContent = content[lang];
  const faq = pickVariant(route.slug + 'faq', langContent.faqVariants);
  const items = faq.map(item => `
      <div class="faq-item">
        <h3 class="faq-q">${fillTokens(item.q, route, lang)}</h3>
        <p class="faq-a">${fillTokens(item.a, route, lang)}</p>
      </div>`).join('');
  return `
    <section class="faq">
      <h2>${langContent.faqHeading}</h2>${items}
    </section>`;
}

// Datos estructurados JSON-LD: BreadcrumbList + FAQPage + Article. Le da a Google
// las preguntas para rich snippets y ayuda a entender/rankear la pagina.
function generateSchema(route, lang) {
  const langContent = content[lang];
  const url = canonicalUrl(route.slug, lang);
  const bc = BREADCRUMB[lang] || BREADCRUMB.en;
  const routeName = fillTokens(langContent.mainTitle, route, lang);
  const graph = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: bc.home, item: 'https://glosx.app/' },
        { '@type': 'ListItem', position: 2, name: bc.routes, item: 'https://glosx.app/explore/' },
        { '@type': 'ListItem', position: 3, name: routeName, item: url }
      ]
    },
    {
      '@type': 'FAQPage',
      mainEntity: pickVariant(route.slug + 'faq', langContent.faqVariants).map(item => ({
        '@type': 'Question',
        name: fillTokens(item.q, route, lang),
        acceptedAnswer: { '@type': 'Answer', text: fillTokens(item.a, route, lang) }
      }))
    },
    {
      '@type': 'Article',
      headline: (route.customSEO && route.customSEO[lang] ? route.customSEO[lang].title : langContent.ogTitleTemplate(route.from, route.to)),
      description: (route.customSEO && route.customSEO[lang] ? route.customSEO[lang].description : langContent.descriptionTemplate(route.from, route.to)),
      image: HERO_PHOTOS[route.to.toLowerCase()] || 'https://glosx.app/hero-bg.jpg',
      datePublished: '2026-07-01',
      dateModified: '2026-07-25',
      author: { '@type': 'Organization', name: 'WoW Train', url: 'https://glosx.app/' },
      publisher: { '@type': 'Organization', name: 'WoW Train', logo: { '@type': 'ImageObject', url: 'https://glosx.app/logo.png' } },
      mainEntityOfPage: url,
      inLanguage: lang
    }
  ];
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  return `<script type="application/ld+json">${json}</script>`;
}

// Replace template variables
function replaceTemplate(template, route, lang) {
  const langContent = content[lang];
  // Override de title/description para rutas con muchas impresiones y CTR bajo en Search
  // Console — el template generico es identico en las 174 rutas, asi que Google no tiene
  // motivo para destacarlas. Estas pocas rutas usan copy especifico en vez del template.
  const seo = route.customSEO && route.customSEO[lang];
  const replacements = {
    '{{lang}}': lang,
    '{{routeSlug}}': route.slug,
    '{{canonical}}': canonicalUrl(route.slug, lang),
    '{{title}}': seo ? seo.title : langContent.titleTemplate(route.from, route.to),
    '{{description}}': seo ? seo.description : langContent.descriptionTemplate(route.from, route.to),
    '{{ogTitle}}': seo ? seo.title : langContent.ogTitleTemplate(route.from, route.to),
    '{{ogDescription}}': seo ? seo.description : langContent.ogDescriptionTemplate(route.from, route.to),
    '{{twitterTitle}}': seo ? seo.title : langContent.twitterTitleTemplate(route.from, route.to),
    '{{twitterDescription}}': seo ? seo.description : langContent.twitterDescriptionTemplate(route.from, route.to),
    '{{langSwitch}}': langSwitchLinks(route.slug, lang),
    '{{backText}}': langContent.backText,
    '{{badge}}': `${langContent.badgeLabel} · ${translateCountry(route.country, lang)}`,
    '{{mainTitle}}': (seo && seo.mainTitle) ? seo.mainTitle : langContent.mainTitle.replace('{{from}}', route.from).replace('{{to}}', route.to),
    '{{metaText}}': langContent.metaText,
    '{{leadText}}': (seo && seo.lead) ? seo.lead : fillTokens(pickVariant(route.slug + 'lead', langContent.leadVariants), route, lang),
    '{{heroImage}}': HERO_PHOTOS[route.to.toLowerCase()] || '/hero-bg.webp',
    '{{klookTitle}}': fillTokens(langContent.klookTitle, route, lang),
    '{{klookSubtitle}}': fillTokens(langContent.klookSubtitle, route, lang),
    '{{klookBtnLabel}}': langContent.klookBtnLabel,
    '{{klookTrainUrl}}': `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=${encodeURIComponent(route.from.toLowerCase())}&to=${encodeURIComponent(route.to.toLowerCase())}`,
    '{{trainSegments}}': generateTrainSegments(route, lang),
    '{{hotelSectionTitle}}': langContent.hotelSectionTitle,
    '{{hotelCards}}': generateHotelCards(route, lang),
    '{{howLongTitle}}': fillTokens(langContent.howLongTitle, route, lang),
    '{{howLongText}}': fillTokens(pickVariant(route.slug + 'howlong', langContent.howLongVariants), route, lang),
    '{{whoRunsTitle}}': fillTokens(langContent.whoRunsTitle, route, lang),
    '{{whoRunsText}}': fillTokens(pickVariant(route.slug + 'whoruns', langContent.whoRunsVariants), route, lang),
    '{{localInsight}}': generateLocalInsight(route, lang),
    '{{priceTitle}}': langContent.priceTitle.replace('{{from}}', route.from).replace('{{to}}', route.to),
    '{{priceText}}': langContent.priceText.replace('{{price}}', route.price),
    '{{priceTable}}': generatePriceTable(route, lang),
    '{{bestFareTitle}}': langContent.bestFareTitle,
    '{{bestFareList}}': pickVariant(route.slug + 'bestfare', langContent.bestFareVariants).map(item => `<li>${item}</li>`).join('\n      '),
    '{{readyText}}': langContent.readyText.replace('{{from}}', route.from).replace('{{to}}', route.to),
    '{{compareText}}': langContent.compareText,
    '{{checkSchedulesText}}': langContent.checkSchedulesText,
    '{{opensNewTabText}}': langContent.opensNewTabText,
    '{{photos}}': generatePhotos(route),
    '{{moreRoutesTitle}}': langContent.moreRoutesTitle,
    '{{relatedRoutes}}': generateRelatedRoutes(route, lang),
    '{{faqSection}}': generateFAQ(route, lang),
    '{{schema}}': generateSchema(route, lang)
  };
  
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
  }
  
  return result;
}

// Read template
const templatePath = path.join(__dirname, 'route-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Generate routes
const outputDir = path.join(__dirname, '../rutas');

const LANGS = ['en', 'es', 'fr', 'it'];
const onlySlug = process.argv[2];
const routesToGenerate = onlySlug ? routes.filter((route) => route.slug === onlySlug) : routes;
if (onlySlug && routesToGenerate.length === 0) {
  console.error(`Unknown route slug: ${onlySlug}`);
  process.exit(1);
}
routesToGenerate.forEach(route => {
  // EN va en la raíz (/rutas/slug/); el resto en subcarpeta (/rutas/slug/{lang}/)
  LANGS.forEach(lang => {
    const dir = lang === 'en' ? path.join(outputDir, route.slug) : path.join(outputDir, route.slug, lang);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), replaceTemplate(template, route, lang));
  });
  console.log(`Generated ${route.slug} (EN/ES/FR/IT)`);
});

console.log('All routes generated successfully!');
