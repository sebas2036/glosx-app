/** Cuarta tanda (español). Mismos campos que route-deep-4.js. */
module.exports = { deep: {
  'paris-marseille': {
    stations: [
      '<strong>Paris Gare de Lyon</strong> es la estación de salida, con las líneas 1 y 14 del metro y las RER A y D. Llega con margen: es grande y tiene varios vestíbulos de trenes.',
      '<strong>Marseille Saint-Charles</strong> está en una colina sobre el centro; una escalinata monumental baja hacia la ciudad, y desde la estación salen el metro y los tranvías.'
    ],
    times: 'Omio muestra unos 18 trenes al día en esta ruta, 16 de ellos directos, con el primero alrededor de las 05:00 y el último a última hora de la noche. Los directos más rápidos tardan algo más de tres horas (el más rápido de Omio es de 3 h 3 min); los trenes con trasbordo tardan más. Además del TGV INOUI de SNCF, Omio también muestra servicios Frecciarossa en esta línea.',
    ticketsIntro: 'Los precios de esta ruta cambian mucho entre reservar con tiempo y comprar el mismo día, así que el tipo de tarifa importa:',
    tickets: [
      ['Tarifa anticipada', 'Un tren concreto, cambios limitados', 'La más barata. La tarifa más baja que muestra Omio ronda los 19 €, y es la primera en agotarse.'],
      ['Estándar / intermedia', 'Menos restricciones', 'Precio intermedio; el día que lo miramos, las tarifas de media jornada rondaban los 70–140 €.'],
      ['Flexible', 'Cualquier tren, con cambios', 'La más cara; algunos trenes del mismo día aparecían a 180 € o más.']
    ],
    ticketTips: [
      'Los datos de tarifas de Omio indican reservar con unos 91 días de antelación para conseguir los precios más bajos.',
      'El martes es el día más barato de media; el jueves es el más concurrido y el domingo el más tranquilo.',
      'Compara salidas de SNCF y de Frecciarossa el mismo día: la más barata cambia según la hora.'
    ],
    when: 'La temporada alta va de julio a septiembre y la baja de enero a marzo; septiembre es el mes más barato de media. Fuera de las vacaciones escolares, un tren a media mañana entre semana suele ser más tranquilo y barato que uno el viernes por la tarde.',
    arrivalIntro: 'Marsella es una ciudad portuaria que merece un primer día sin prisa. Lugares de interés:',
    arrival: [
      '<strong>El Vieux-Port</strong> — el puerto viejo, con el mercado de pescado por la mañana y muchas terrazas.',
      '<strong>Le Panier</strong> — el barrio más antiguo, de calles estrechas y arte urbano.',
      '<strong>Notre-Dame de la Garde</strong> — la basílica en lo alto, con la mejor vista de la ciudad y del mar.',
      '<strong>Las calanques y Cassis</strong> — calas de roca caliza y un pequeño pueblo portuario, a poca distancia en tren regional o autobús.'
    ],
    alt: [
      '<strong>Autocar</strong> — más barato pero mucho más largo, normalmente siete horas o más.',
      '<strong>Coche</strong> — unos 775 km, alrededor de siete horas sin tráfico, más peajes.',
      '<strong>Avión</strong> — unos 1 h 20 min en el aire, pero los traslados al aeropuerto y la seguridad hacen que el tren compita de puerta a puerta.'
    ]
  },
  'lyon-marseille': {
    stations: [
      '<strong>Lyon Part-Dieu</strong> es la estación principal de largo recorrido, con metro, tranvía y autobús hacia el centro. Algunos servicios regionales usan <strong>Lyon Perrache</strong>.',
      '<strong>Marseille Saint-Charles</strong> es la terminal, en una colina sobre la ciudad, con líneas de metro y una escalinata que baja hacia el centro.'
    ],
    times: 'Omio muestra unos 17 trenes al día, 15 de ellos directos. Los más rápidos tardan aproximadamente una hora y media (el más rápido de Omio es de 1 h 27 min) y la media, contando los trenes más lentos, ronda las dos horas. La línea sigue el valle del Ródano y muchos servicios paran en Avignon TGV o Valence TGV, así que conviene comprobar si un tren es directo o tiene parada.',
    ticketsIntro: 'Las tarifas son moderadas en este trayecto corto de alta velocidad, y el mismo tren puede variar mucho según el día:',
    tickets: [
      ['Tarifa anticipada', 'Un tren concreto', 'La más barata. La tarifa más baja que muestra Omio ronda los 19 €.'],
      ['Estándar', 'Menos restricciones', 'Precio intermedio, con cierta flexibilidad para cambiar.'],
      ['Flexible', 'Cualquier tren, con cambios', 'La más cara; útil si tus planes pueden cambiar.']
    ],
    ticketTips: [
      'Los datos de tarifas de Omio indican reservar con unos 91 días de antelación para conseguir los precios más bajos.',
      'El martes es el día más barato de media, el viernes el más concurrido y el domingo el más tranquilo.',
      'Los autocares son más baratos (Omio los muestra desde unos 10 €) si no te importa tardar más.'
    ],
    when: 'La temporada alta va de julio a septiembre y la baja de octubre a diciembre. Los trenes del viernes por la tarde son los primeros en agotarse, así que para un fin de semana reserva con tiempo o viaja el jueves.',
    arrivalIntro: 'Marsella es fácil de empezar a pie desde la estación. Lugares de interés:',
    arrival: [
      '<strong>El Vieux-Port y el Fort Saint-Jean</strong> — el puerto histórico y la fortaleza de su entrada.',
      '<strong>El MuCEM</strong> — el museo de las civilizaciones del Mediterráneo, con una pasarela hasta el viejo fuerte.',
      '<strong>Le Panier</strong> — el casco antiguo, ideal para comer sin prisa.',
      '<strong>Notre-Dame de la Garde</strong> — la basílica en lo alto que domina la ciudad.'
    ],
    alt: [
      '<strong>Autocar</strong> — normalmente algo menos de cuatro horas y más barato que el tren.',
      '<strong>Coche</strong> — unos 315 km por la A7, alrededor de tres horas sin tráfico, más peajes.',
      '<strong>Avión</strong> — no es práctico para este par; el tren es más rápido de puerta a puerta.'
    ]
  },
  'marseille-nice': {
    stations: [
      '<strong>Marseille Saint-Charles</strong> es la estación de salida, con líneas de metro y una escalinata que baja hacia la ciudad.',
      '<strong>Nice-Ville</strong> es la estación principal, a un corto paseo o un trayecto en tranvía del Paseo de los Ingleses y del casco antiguo.'
    ],
    times: 'Omio muestra unos 13 trenes al día, todos directos, entre las 05:30 aproximadamente y la noche. El más rápido tarda unos 2 h 22 min y la media ronda 2 h 34 min. Algunos servicios son TGV INOUI más rápidos y otros son trenes regionales TER más lentos, de la marca ZOU!, por eso los tiempos varían. La línea sigue la costa y suele parar en Toulon, Cannes y Antibes.',
    ticketsIntro: 'Las tarifas dependen de si tomas un TGV o un tren regional, así que compara los dos:',
    tickets: [
      ['TGV INOUI anticipado', 'Un tren concreto', 'Precio intermedio. La tarifa más baja que muestra Omio en esta ruta ronda los 21 €.'],
      ['TER regional (ZOU!)', 'Flexible el mismo día, más lento', 'Normalmente la forma más barata en tren y sin reserva de asiento.'],
      ['TGV INOUI flexible', 'Cualquier tren, con cambios', 'La más cara.']
    ],
    ticketTips: [
      'Los datos de tarifas de Omio indican reservar con unos 77 días de antelación para conseguir los precios más bajos.',
      'El miércoles es el día más barato de media, el lunes el más concurrido y el sábado el más tranquilo.',
      'Los autocares son la opción más barata (Omio los muestra desde unos 5 €), pero tardan más.'
    ],
    when: 'La temporada alta va de julio a septiembre, cuando los trenes de la costa se llenan, y la baja de enero a marzo. Si viajas en verano, reserva pronto el TGV y evita las tardes de viernes y domingo.',
    arrivalIntro: 'Niza es compacta y muy fácil de recorrer a pie desde la estación. Lugares de interés:',
    arrival: [
      '<strong>El Paseo de los Ingleses</strong> — el paseo marítimo, a poca distancia de la estación.',
      '<strong>Vieux Nice y el mercado del Cours Saleya</strong> — calles estrechas, puestos de comida y flores.',
      '<strong>La colina del Castillo</strong> — una breve subida con la mejor vista de la bahía.',
      '<strong>Excursiones en tren</strong> — Mónaco y Villefranche-sur-Mer están a pocos minutos.'
    ],
    alt: [
      '<strong>Autocar</strong> — la opción más barata, pero más lenta y menos cómoda que el tren costero.',
      '<strong>Coche</strong> — unos 200 km por la A8, alrededor de dos horas y media sin tráfico, más peajes y aparcamiento.',
      '<strong>Avión</strong> — no es práctico para este par; el tren es más rápido de puerta a puerta.'
    ]
  },
  'zurich-geneva': {
    stations: [
      '<strong>Zurich HB</strong> (Hauptbahnhof) es la estación más concurrida de Suiza, con tranvías y S-Bahn bajo el mismo techo y el casco antiguo a pocos minutos a pie.',
      '<strong>Geneva Cornavin</strong> es la estación principal, en el centro y a un corto paseo del lago. Algunos trenes continúan hasta el <strong>aeropuerto de Ginebra</strong>.'
    ],
    times: 'Omio muestra unos 38 servicios al día en este corredor, 8 de ellos como directos; los demás incluyen un trasbordo. El trayecto más rápido es de unos 2 h 34 min y la media, contando las opciones más lentas, ronda las 3 h 16 min. La búsqueda en directo marca qué trenes son directos, así que conviene elegir uno de ellos si quieres el viaje más sencillo.',
    ticketsIntro: 'Las tarifas suizas son altas comparadas con las de los países vecinos, así que el tipo de billete importa más de lo habitual:',
    tickets: [
      ['Tarifa saver / anticipada', 'Un tren concreto', 'La más barata. La tarifa más baja que muestra Omio ronda los 51 €.'],
      ['Estándar / punto a punto', 'Menos restricciones', 'Claramente más cara; la tarifa totalmente flexible puede costar varias veces el precio anticipado.'],
      ['Swiss Half Fare Card', 'Tarjeta de descuento', 'Reduce a la mitad muchas tarifas; compensa si haces varios viajes en Suiza.']
    ],
    ticketTips: [
      'Los datos de tarifas de Omio indican reservar con unos 77 días de antelación para conseguir los precios más bajos.',
      'El domingo es el día más barato de media (y el más tranquilo); el jueves es el más concurrido.',
      'Si vas a tomar varios trenes en Suiza, compara un Swiss Travel Pass o una Half Fare Card con los billetes sueltos.'
    ],
    when: 'La temporada alta va de julio a septiembre y la baja de enero a marzo. Los viajes de negocios hacen del jueves el día más concurrido, y los trenes del domingo por la noche de vuelta a Zúrich suelen ir llenos.',
    arrivalIntro: 'Ginebra está junto al lago y es fácil de recorrer a pie. Lugares de interés:',
    arrival: [
      '<strong>El Jet d\'Eau y la orilla del lago</strong> — un paseo fácil desde Cornavin.',
      '<strong>La Ciudad Vieja y la catedral de San Pedro</strong> — calles empedradas y una torre con vistas de la ciudad.',
      '<strong>Cruceros por el lago</strong> — en verano salen barcos de los muelles.',
      '<strong>Excursiones en tren</strong> — Lausana y Montreux están en la línea del lago.'
    ],
    alt: [
      '<strong>Avión</strong> — unos 50 minutos en el aire, pero los traslados y la seguridad hacen que el tren compita de puerta a puerta.',
      '<strong>Autocar</strong> — más barato pero más lento.',
      '<strong>Coche</strong> — unos 280 km de autopista, alrededor de tres horas, más la viñeta de autopista suiza.'
    ]
  },
  'amsterdam-cologne': {
    stations: [
      '<strong>Amsterdam Centraal</strong> es la estación principal, con tranvías, metro y ferris a su espalda y el centro histórico a poca distancia a pie.',
      '<strong>Cologne Hbf</strong> está justo al lado de la catedral, así que el primer monumento queda a tu puerta al llegar.'
    ],
    times: 'Omio muestra unos 7 servicios al día, solo 2 de ellos directos; los demás incluyen un trasbordo. El trayecto más rápido que muestra Omio es de unos 2 h 28 min y la media, contando las opciones más lentas, ronda las 3 h 22 min. La búsqueda en directo indica qué servicios son directos, así que compruébalo antes de comprar. Los ICE internacionales suelen parar en Utrecht y Arnhem en el lado neerlandés.',
    ticketsIntro: 'Deutsche Bahn opera el ICE en esta ruta, con tarifas que dependen de con cuánta antelación reserves:',
    tickets: [
      ['Sparpreis / tarifa anticipada', 'Un tren concreto', 'La más barata. La tarifa más baja que muestra Omio ronda los 20 €.'],
      ['Flexpreis', 'Cualquier tren del día', 'Claramente más cara.'],
      ['Autocar', 'Más barato, más lento', 'Omio muestra autocares desde unos 11 €.']
    ],
    ticketTips: [
      'Los datos de tarifas de Omio indican reservar con unos 28 días de antelación para conseguir los precios más bajos.',
      'El martes es el día más barato de media, el jueves el más concurrido y el sábado el más tranquilo.',
      'Los trenes directos son pocos, así que revisa la búsqueda en directo antes de elegir una combinación con trasbordo.'
    ],
    when: 'La temporada alta va de octubre a diciembre, en parte por los mercados de Navidad de Colonia, y la baja de enero a marzo. Si viajas en Adviento, reserva pronto.',
    arrivalIntro: 'Colonia es compacta y la estación está en pleno centro. Lugares de interés:',
    arrival: [
      '<strong>La catedral</strong> — sube a la torre para ver el Rin.',
      '<strong>El casco antiguo (Altstadt)</strong> — calles estrechas y cervecerías tradicionales de Kölsch.',
      '<strong>El paseo del Rin y el puente Hohenzollern</strong> — a poca distancia a pie de la estación.',
      '<strong>Los mercados de Navidad</strong> — a finales de noviembre y en diciembre, entre los mayores de Alemania.'
    ],
    alt: [
      '<strong>Autocar</strong> — la opción más barata, desde unos 11 € en Omio.',
      '<strong>Coche</strong> — unos 260 km, alrededor de dos horas y media a tres sin tráfico.',
      '<strong>Avión</strong> — no es práctico para este par; los aeropuertos y la seguridad lo hacen más lento que el tren.'
    ]
  },
  'milan-naples': {
    stations: [
      '<strong>Milano Centrale</strong> es la estación principal, con las líneas M2 y M3 del metro y un gran vestíbulo; déjate tiempo para encontrar tu andén.',
      '<strong>Napoli Centrale</strong> está en pleno centro, en la Piazza Garibaldi, con el metro y los trenes de la Circumvesuviana hacia Pompeya y Sorrento en la misma zona. Algunos trenes de alta velocidad usan <strong>Napoli Afragola</strong>, fuera de la ciudad, así que comprueba la estación de llegada.'
    ],
    times: 'Omio muestra unos 68 servicios al día, 60 de ellos directos, lo que la convierte en una de las rutas largas mejor servidas de Italia. El trayecto más rápido es de unos 4 h 17 min y la media, contando los trenes más lentos, ronda las 5 h 26 min. Los trenes suelen parar en Bolonia, Florencia y Roma. Dos compañías compiten en la ruta: Trenitalia (Frecciarossa) e Italo.',
    ticketsIntro: 'Frecciarossa e Italo venden tarifas baratas con antelación, así que compáralos el mismo día:',
    tickets: [
      ['Frecciarossa / Italo económica', 'Un tren concreto, cambios limitados', 'La más barata. La tarifa más baja que muestra Omio ronda los 19 €.'],
      ['Estándar / tarifa base', 'Menos restricciones', 'Precio intermedio, con cierta flexibilidad.'],
      ['Flexible / business', 'Cualquier tren, con cambios', 'La más cara; útil si tus planes pueden cambiar.']
    ],
    ticketTips: [
      'Los datos de tarifas de Omio indican reservar con unos 91 días de antelación para conseguir los precios más bajos.',
      'El lunes es el día más barato de media, el martes el más concurrido y el sábado el más tranquilo.',
      'Los autocares son la opción más barata, desde unos 9 € en Omio, pero tardan mucho más que el tren.'
    ],
    when: 'La temporada alta va de julio a septiembre y la baja de enero a marzo. Las tardes de viernes y las noches de domingo son las más concurridas; los trenes de media mañana entre semana suelen ser más cómodos.',
    arrivalIntro: 'Nápoles es ruidosa, densa y gratificante. Lugares de interés:',
    arrival: [
      '<strong>Via dei Tribunali y Spaccanapoli</strong> — el centro histórico, con las pizzerías clásicas.',
      '<strong>El Museo Arqueológico Nacional</strong> — muchos de los hallazgos de Pompeya y Herculano.',
      '<strong>El paseo marítimo y el Castel dell\'Ovo</strong> — un largo paseo junto al mar con vistas al Vesubio.',
      '<strong>Excursiones</strong> — Pompeya y Sorrento en la Circumvesuviana, y ferris a Capri e Isquia.'
    ],
    alt: [
      '<strong>Avión</strong> — alrededor de una hora y veinte minutos en el aire, pero los traslados al aeropuerto reducen la diferencia con el tren.',
      '<strong>Autocar</strong> — mucho más barato pero muy largo, un día entero o una noche.',
      '<strong>Coche</strong> — unos 770 km por la A1, alrededor de ocho horas sin tráfico, más peajes.'
    ]
  }
} };
