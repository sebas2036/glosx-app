/** Contenido ampliado de las rutas (español). Mismos campos que route-deep-content*.js; los nombres de ciudad en inglés
 *  de los títulos se traducen después con scripts/localize-cities.js. */
module.exports = {
  ui: {
    stations: 'Estaciones: dónde sales y dónde llegas',
    times: (f, t) => `${f} a ${t}: horarios y frecuencia de los trenes`,
    tickets: 'Billetes y tarifas: cuánto pagas de verdad',
    th: ['Billete', 'Qué significa', 'Nivel orientativo'],
    note: 'Las tarifas son orientativas y cambian según la fecha, la hora y la antelación con la que reserves. La búsqueda en directo muestra el precio exacto de tu viaje.',
    when: 'Mejor momento para viajar',
    arrival: (t) => `Qué hacer al llegar a ${t}`,
    alt: (f, t) => `Otras formas de ir de ${f} a ${t}`,
    related: 'Rutas relacionadas', moreLondon: 'Más trenes desde Londres'
  },
  deep: {
    'london-liverpool': {
      stations: [
        '<strong>London Euston</strong> es la terminal londinense de la West Coast Main Line. Enlaza con las líneas Northern y Victoria del metro, y King\'s Cross St Pancras queda a unos 15–20 minutos a pie.',
        '<strong>Liverpool Lime Street</strong> está en pleno centro, frente al St George\'s Hall, con los trenes de Merseyrail por debajo. El paseo marítimo y el Albert Dock quedan a unos 20–25 minutos a pie, o a un trayecto corto en autobús o taxi.'
      ],
      times: 'Los servicios más rápidos tardan aproximadamente 2 h 10 min–2 h 30 min y circulan cada hora o con más frecuencia durante el día, con trenes extra en las horas punta. No todos los trenes paran en las mismas estaciones: entre las paradas intermedias habituales están Milton Keynes Central, Crewe o Runcorn y Liverpool South Parkway, así que el tren con menos paradas suele ser el más rápido. Revisa siempre la salida que elijas, porque la duración varía unos minutos entre servicios.',
      ticketsIntro: 'Avanti West Coast opera los trenes directos, así que lo que pagas depende del tipo de billete y no de elegir operador:',
      tickets: [
        ['Advance (anticipado)', 'Un tren concreto, normalmente sin cambios', 'El más barato. Los billetes sencillos orientativos suelen estar entre £20 y £40 si reservas pronto, y se agotan primero.'],
        ['Off-Peak (valle)', 'Cualquier tren fuera de hora punta ese día', 'Precio intermedio; buena opción si evitas la hora punta de la mañana.'],
        ['Anytime (flexible)', 'Cualquier tren, a cualquier hora', 'El más flexible y el más caro; un billete sencillo puede superar las £100.']
      ],
      ticketTips: [
        'Una <strong>Railcard</strong> (16–25, 26–30, Two Together, Senior, Family &amp; Friends) suele descontar alrededor de un tercio en la mayoría de las tarifas, incluidos muchos billetes Advance.',
        'Reserva en cuanto salgan a la venta las tarifas de tu fecha. Los billetes Advance más baratos son limitados y suben de precio a medida que se llena el tren.',
        'Compara la misma salida de la mañana en distintos días: pasar el viaje de un viernes a un martes suele ahorrar más que cualquier otro truco.'
      ],
      when: 'Evita las tardes de viernes, las noches de domingo y los días de partido en Anfield o Goodison, cuando los trenes y las tarifas están en su punto más alto. Las salidas a media mañana fuera de las vacaciones escolares suelen ser más baratas y tranquilas. Si necesitas trabajar a bordo, pide un asiento con mesa; la línea tiene enchufes y wifi en la mayoría de los trenes.',
      arrivalIntro: 'Ida y vuelta suman más de cuatro horas y media de tren, así que la excursión de un día es posible pero justa; pasar una noche es mucho más cómodo. Lugares de interés a poca distancia de Lime Street:',
      arrival: [
        '<strong>Albert Dock y Pier Head</strong> — los muelles restaurados, los Tres Graces frente al río, museos y The Beatles Story.',
        '<strong>La catedral anglicana y la catedral metropolitana</strong> — dos catedrales muy distintas, a poca distancia una de otra.',
        '<strong>El Cavern Quarter</strong> — Mathew Street y los locales de música ligados a la historia de los Beatles.',
        '<strong>Baltic Triangle y Georgian Quarter</strong> — cafés independientes, arte urbano y algunas de las calles más agradables de la ciudad.'
      ],
      alt: [
        '<strong>Autocar</strong> — los servicios desde London Victoria tardan entre cinco y seis horas; son más baratos pero mucho más lentos.',
        '<strong>Coche</strong> — unas cuatro a cinco horas según el tráfico de la M1 y la M6, más el aparcamiento en el centro.',
        '<strong>Avión</strong> — poco práctico para este par una vez sumados los traslados y la seguridad del aeropuerto; el tren va de centro a centro.'
      ]
    },
    'london-oxford': {
      stations: [
        '<strong>London Paddington</strong> (Great Western Railway) y <strong>London Marylebone</strong> (Chiltern Railways) son los dos puntos de salida principales. Paddington está en las líneas Bakerloo, Circle, District, Hammersmith &amp; City y Elizabeth.',
        '<strong>La estación de Oxford</strong> está en el borde oeste del centro, a unos 10–15 minutos a pie de los lugares principales, con autobuses y taxis frecuentes en la salida.'
      ],
      times: 'Los trenes de GWR desde Paddington son la opción más rápida: tardan aproximadamente una hora en un servicio rápido y salen varias veces por hora. Los de Chiltern desde Marylebone tardan algo más (aproximadamente una hora y cuarto), pero paran en High Wycombe y en Bicester Village, útil si vas al centro comercial. Algunos servicios son trenes con más paradas y más lentos, así que revisa la duración de la salida que elijas.',
      ticketsIntro: 'Es una ruta corta y muy frecuente, por eso la mayoría de los viajeros compra billetes Off-Peak o Anytime en lugar de tarifas Advance:',
      tickets: [
        ['Advance (anticipado)', 'Un tren concreto', 'Disponibilidad limitada en una ruta corta; comprueba si hay alguno para tu fecha.'],
        ['Off-Peak (valle)', 'Trenes fuera de hora punta ese día', 'La opción habitual para excursiones de un día; buena relación calidad-precio fuera de la hora punta de la mañana.'],
        ['Anytime (flexible)', 'Cualquier tren', 'Flexible, pero bastante más caro que el Off-Peak.']
      ],
      ticketTips: [
        'Vale la pena mirar una <strong>Railcard</strong> incluso para un solo viaje, porque se aplica a la mayoría de las tarifas Off-Peak.',
        'Un billete de ida y vuelta en el día puede salir mejor que dos sencillos; compara ambos al buscar.',
        'Chiltern desde Marylebone suele ser algo más barato que GWR desde Paddington; compáralos en la misma fecha.'
      ],
      when: 'Las mañanas de lunes a viernes hacia Oxford están llenas de viajeros habituales, y los fines de semana de verano y la época de graduaciones la ciudad se llena. Ir entre semana fuera de los picos del curso da colleges más tranquilos y mesas más fáciles a la hora de comer.',
      arrivalIntro: 'Un día en Oxford es fácil desde Londres. A poca distancia a pie de la estación:',
      arrival: [
        '<strong>La Bodleian Library y la Radcliffe Camera</strong> — el corazón histórico de la universidad; algunos interiores solo se visitan con visita guiada.',
        '<strong>Christ Church</strong> y los demás colleges — los horarios cambian durante el curso y en época de exámenes, así que confírmalos antes de ir.',
        '<strong>El Ashmolean Museum</strong> — arte y arqueología, de entrada gratuita.',
        '<strong>Paseo en punt por el Cherwell o el Támesis</strong> — la forma clásica de ver los colleges desde el agua cuando hace buen tiempo.'
      ],
      alt: [
        '<strong>Autocar exprés</strong> — servicios como el Oxford Tube y el X90 salen de London Victoria y otras paradas; más lentos que el tren, normalmente bastante más de una hora y media.',
        '<strong>Coche</strong> — aproximadamente una hora y media según el tráfico, más un aparcamiento limitado y caro en el centro; es mejor usar un park and ride.'
      ]
    },
    'london-cambridge': {
      stations: [
        '<strong>London King\'s Cross</strong> (el más rápido) y <strong>London Liverpool Street</strong> son las dos estaciones principales de salida. King\'s Cross tiene servicios de Great Northern y Thameslink; Liverpool Street, de Greater Anglia.',
        '<strong>La estación de Cambridge</strong> está a unos 2 km del centro. Calcula unos 20–25 minutos a pie, o toma un autobús, un taxi o una bici desde la estación.'
      ],
      times: 'Los trenes más rápidos de Great Northern desde King\'s Cross tardan algo menos de una hora. Los de Thameslink son más lentos, con más paradas, y los de Greater Anglia desde Liverpool Street suelen tardar alrededor de una hora y cuarto. Hay varios trenes por hora durante el día, así que casi nunca tienes que organizarte en torno a una única salida.',
      ticketsIntro: 'Aquí no hay un único "mejor" operador; la tarifa depende de la estación y de la hora del día:',
      tickets: [
        ['Advance (anticipado)', 'Un tren concreto', 'A veces disponible y el más barato; no se ofrece en todos los servicios.'],
        ['Off-Peak (valle)', 'Trenes fuera de hora punta ese día', 'La opción típica para excursiones de un día; evita las horas punta de los viajeros diarios.'],
        ['Anytime (flexible)', 'Cualquier tren', 'Flexible y el más caro.']
      ],
      ticketTips: [
        'Compara <strong>King\'s Cross</strong> y <strong>Liverpool Street</strong> en el mismo día; uno suele salir más barato según la hora.',
        'Una <strong>Railcard</strong> reduce la mayoría de las tarifas Off-Peak en alrededor de un tercio.',
        'Si te alojas cerca de Tottenham Hale o de Stansted, la línea de Greater Anglia puede resultar más cómoda que entrar primero al centro de Londres.'
      ],
      when: 'Las mañanas de entrada y las tardes de salida, de lunes a viernes, están llenas de viajeros diarios. Cambridge está más tranquila fuera del curso y más concurrida los fines de semana de verano y en la época de graduaciones, así que reserva con antelación lo más popular (punting, King\'s College Chapel).',
      arrivalIntro: 'Cambridge es compacta y fácil de recorrer a pie o en bici. Lugares de interés:',
      arrival: [
        '<strong>King\'s College Chapel</strong> — uno de los grandes edificios góticos de Inglaterra; el horario de visitas cambia durante el curso.',
        '<strong>The Backs y el río Cam</strong> — césped y puentes detrás de los colleges, que se ven mejor desde un punt o a pie.',
        '<strong>El Fitzwilliam Museum</strong> — de entrada gratuita, con arte y antigüedades.',
        '<strong>La Market Square y Trinity Street</strong> — buenos sitios para comer antes de volver.'
      ],
      alt: [
        '<strong>Autocar</strong> — los servicios desde Londres llegan a Cambridge en aproximadamente dos horas y cuestan menos, pero dependen del tráfico.',
        '<strong>Coche</strong> — una hora y media aproximadamente; Cambridge tiene poco aparcamiento en el centro y los park and ride de las afueras son la opción más fácil.'
      ]
    },
    'london-york': {
      stations: [
        '<strong>London King\'s Cross</strong> es el punto de salida de los trenes de LNER. Tiene enlaces con el metro (líneas Piccadilly, Northern, Victoria, Circle, Metropolitan y Hammersmith &amp; City) y está junto a St Pancras International.',
        '<strong>La estación de York</strong> está junto a la muralla medieval. La catedral (York Minster) queda a unos 10–15 minutos a pie, y The Shambles a un paseo parecido. El National Railway Museum está justo al lado de la estación.'
      ],
      times: 'Los trenes más rápidos de LNER tardan alrededor de 1 h 50 min–2 h, y suele haber unos dos por hora durante el día, así que normalmente puedes viajar a la hora que te convenga. Algunos servicios son más lentos porque paran en más estaciones. Otros operadores de acceso abierto también sirven York en la East Coast Main Line, así que compara las salidas en lugar de dar por hecho un único operador.',
      ticketsIntro: 'La forma más barata de viajar es casi siempre reservar un billete Advance para un tren concreto:',
      tickets: [
        ['Advance (anticipado)', 'Un tren concreto', 'El más barato. Los billetes sencillos orientativos suelen estar entre £20 y £40 si reservas pronto.'],
        ['Off-Peak (valle)', 'Trenes fuera de hora punta ese día', 'Precio intermedio; una opción sensata para excursiones de un día fuera de la hora punta de la mañana.'],
        ['Anytime (flexible)', 'Cualquier tren', 'El más flexible y el más caro; puede superar con creces las £100 por trayecto.']
      ],
      ticketTips: [
        'Reserva en cuanto salgan las tarifas de tu fecha; los billetes Advance más baratos se agotan y luego suben.',
        'Una <strong>Railcard</strong> suele descontar alrededor de un tercio, y también muchas tarifas Advance.',
        'Revisa las reservas de asiento en los trenes llenos de viernes y domingo si viajas con equipaje.'
      ],
      when: 'Las tardes de viernes y las noches de domingo son las más caras y concurridas. Una salida entre semana fuera de las vacaciones escolares suele ser más barata y tranquila. York se llena los fines de semana y en la temporada de mercadillos de Navidad.',
      arrivalIntro: 'York es lo bastante pequeña para una excursión de un día desde Londres, aunque pasar una noche la hace mucho más relajada. Lugares de interés:',
      arrival: [
        '<strong>York Minster</strong> — una de las catedrales góticas más grandes del norte de Europa.',
        '<strong>The Shambles y la muralla</strong> — calles medievales y un circuito de muralla que se recorre a pie.',
        '<strong>El National Railway Museum</strong> — de entrada gratuita y cómodo si llegas en tren.',
        '<strong>Jorvik Viking Centre y la ribera</strong> — bueno para familias y para un paseo tranquilo por la tarde.'
      ],
      alt: [
        '<strong>Autocar</strong> — los servicios tardan entre cinco y seis horas; son más baratos pero mucho más lentos que el tren.',
        '<strong>Coche</strong> — entre cuatro y cinco horas según el tráfico de la A1(M); el aparcamiento en York es limitado, así que conviene un park and ride.'
      ]
    },
    'london-edinburgh': {
      stations: [
        '<strong>London King\'s Cross</strong> es el punto de salida de LNER y de los operadores de acceso abierto de la East Coast Main Line. El Caledonian Sleeper sale de Euston.',
        '<strong>Edinburgh Waverley</strong> está en el centro de la ciudad, bajo la Ciudad Vieja. La Royal Mile y el castillo quedan a unos 10–15 minutos a pie, cuesta arriba desde la estación.'
      ],
      times: 'Los trenes diurnos más rápidos tardan aproximadamente 4 h 20 min–4 h 30 min, con servicios que suelen salir al menos cada hora. El trayecto bordea la costa del Mar del Norte en el tramo norte, con Berwick-upon-Tweed y el Royal Border Bridge, de lo mejor del viaje. Si quieres llegar por la mañana, el Caledonian Sleeper desde Euston te deja en Edimburgo de madrugada, en aproximadamente siete u ocho horas, con asientos y camarotes.',
      ticketsIntro: 'Tanto LNER como el operador de acceso abierto Lumo ofrecen trenes directos a Edimburgo, así que conviene compararlos en la misma fecha:',
      tickets: [
        ['Advance (LNER)', 'Un tren concreto', 'La tarifa LNER más barata; los billetes sencillos orientativos suelen empezar alrededor de £30–£60 si reservas con mucha antelación.'],
        ['Lumo', 'Un tren concreto', 'Operador económico; sus tarifas pueden superar en precio a LNER en algunas fechas, con menos salidas y normas distintas de equipaje y asiento.'],
        ['Off-Peak / Anytime', 'Billetes flexibles', 'Bastante más caros; un Anytime sencillo puede superar las £150.']
      ],
      ticketTips: [
        'Reserva en cuanto abran las tarifas de tu fecha. Las tarifas Advance de los trenes de viernes y domingo se agotan primero.',
        'Una <strong>Railcard</strong> (incluidas Two Together y Senior) descuenta alrededor de un tercio en muchas tarifas.',
        'Compara la misma salida en LNER y Lumo; el operador más barato cambia según la fecha.'
      ],
      when: 'La temporada de festivales en agosto, Hogmanay y los fines de semana de rugby son los más caros. Fuera de esos periodos, una salida entre semana por la mañana suele ser la más barata. Siéntate en el lado derecho hacia el norte para ver la costa cerca de Berwick.',
      arrivalIntro: 'En una primera visita reserva al menos un fin de semana. A poca distancia a pie de Waverley:',
      arrival: [
        '<strong>El castillo de Edimburgo y la Royal Mile</strong> — la columna histórica de la Ciudad Vieja.',
        '<strong>Arthur\'s Seat y Holyrood Park</strong> — una subida corta con vistas amplias de la ciudad.',
        '<strong>Calton Hill y Princes Street Gardens</strong> — miradores fáciles cerca de la estación.',
        '<strong>Los museos de la Royal Mile y el National Museum of Scotland</strong> — buenas opciones si llueve; el National Museum es de entrada gratuita.'
      ],
      alt: [
        '<strong>Avión</strong> — el vuelo Londres–Edimburgo dura menos de 1 h 30 min en el aire, pero el check-in, la seguridad y los traslados reducen la ventaja; compara de puerta a puerta.',
        '<strong>Autocar</strong> — los servicios tardan entre nueve y diez horas; mucho más baratos, pero mucho más lentos.',
        '<strong>Coche</strong> — entre siete y ocho horas sin paradas, y un trayecto caro y cansado para la mayoría de los visitantes.'
      ]
    },
    'london-amsterdam': {
      stations: [
        '<strong>London St Pancras International</strong> es la terminal del Eurostar. Está junto a King\'s Cross y enlaza con seis líneas del metro. Los controles de frontera y de seguridad se hacen antes de subir.',
        '<strong>Amsterdam Centraal</strong> está en el centro de la ciudad, a un paseo corto de Damrak y de los canales principales; desde la estación salen tranvías y metro.'
      ],
      times: 'El Eurostar directo tarda aproximadamente 3 h 50 min–4 h 15 min, con paradas en Bruselas y Róterdam. Como los controles de pasaporte y seguridad se hacen en St Pancras, hay que llegar con tiempo; la recomendación habitual de Eurostar es presentarse unos 90 minutos antes de la salida. Es uno de los trayectos más largos del Eurostar, así que merece la pena reservar asiento junto a la ventanilla y con enchufe.',
      ticketsIntro: 'Eurostar vende los billetes más baratos de un tren concreto en cuanto se abre la venta. Los tipos de tarifa principales son:',
      tickets: [
        ['Standard (el más barato)', 'Un tren concreto, cambios limitados', 'Los billetes sencillos orientativos suelen empezar alrededor de £50–£80 si reservas con meses de antelación.'],
        ['Standard Premier / Plus', 'Más flexibilidad y extras', 'Precio intermedio; permite cambios, con sala VIP o comida en las categorías superiores.'],
        ['Business Premier', 'Totalmente flexible', 'El más caro; incluye acceso a la sala VIP y comida a bordo.']
      ],
      ticketTips: [
        'Los billetes salen a la venta con muchos meses de antelación, y los asientos más baratos de los días de más demanda se agotan primero.',
        'El Eurostar incluye una franquicia de equipaje de dos maletas grandes más equipaje de mano, así que es más cómodo que volar con maleta facturada.',
        'Mira en la página de reserva si hay tarifas para jóvenes o para grupos, que pueden bajar el precio en algunas salidas.'
      ],
      when: 'Las tardes de viernes, las de domingo y las vacaciones escolares son las más caras y concurridas. Una salida entre semana por la mañana, fuera de los periodos de vacaciones, suele ser más barata y tranquila. Deja tiempo extra en St Pancras los días de mucha afluencia, porque la cola de control fronterizo puede ser larga.',
      arrivalIntro: 'Ámsterdam es lo bastante pequeña para moverse a pie o en bici entre los lugares principales. Lugares de interés desde Centraal:',
      arrival: [
        '<strong>El anillo de canales</strong> — el Grachtengordel del siglo XVII, a un paseo de la estación.',
        '<strong>El Rijksmuseum, el Museo Van Gogh y la Casa de Ana Frank</strong> — reserva entradas con hora, sobre todo la Casa de Ana Frank.',
        '<strong>El Jordaan</strong> — callejuelas, cafés y tiendas independientes junto a los canales del oeste.',
        '<strong>Excursiones en tren</strong> — Haarlem, Delft y Utrecht quedan a menos de una hora de Ámsterdam en tren regular.'
      ],
      alt: [
        '<strong>Avión</strong> — aproximadamente 1 h 20 min en el aire desde los aeropuertos de Londres, pero el tiempo de puerta a puerta, con el traslado al aeropuerto, la seguridad y el traslado a Ámsterdam, suele superar con claridad el del tren.',
        '<strong>Ferri y tren</strong> — un ferri nocturno de Harwich a Hoek van Holland y después un tren a Ámsterdam es mucho más lento, pero una alternativa clásica y más barata.',
        '<strong>Autocar</strong> — los servicios cruzan el Eurotúnel o van en ferri y tardan unas diez horas o más.'
      ]
    },
    'london-brussels': {
      stations: [
        '<strong>London St Pancras International</strong> es la terminal del Eurostar, con enlaces de metro, Thameslink y ferrocarril nacional. Los controles de frontera y seguridad se hacen antes de subir.',
        '<strong>Brussels-Midi (Brussel-Zuid)</strong> es la estación del Eurostar. La Grand-Place queda a unos 25 minutos a pie o a un trayecto corto en metro o tranvía hacia el centro.'
      ],
      times: 'El Eurostar a Bruselas tarda aproximadamente dos horas, con varias salidas a lo largo del día. Es una de las formas más rápidas de ir entre dos capitales de Europa, y el tren llega al centro de la ciudad y no a un aeropuerto alejado. Como en otras rutas del Eurostar, llega con tiempo para los controles fronterizos; la recomendación habitual de Eurostar es presentarse unos 90 minutos antes de la salida.',
      ticketsIntro: 'Eurostar usa precios dinámicos: cuanto antes reserves, más baja es la tarifa:',
      tickets: [
        ['Standard (el más barato)', 'Un tren concreto, cambios limitados', 'Los billetes sencillos orientativos suelen empezar alrededor de £40–£60 si reservas con mucha antelación.'],
        ['Standard Premier / Plus', 'Más flexibilidad y extras', 'Precio intermedio, con cambios y extras según la categoría.'],
        ['Business Premier', 'Totalmente flexible', 'El más caro; incluye acceso a la sala VIP y comida.']
      ],
      ticketTips: [
        'Reserva en cuanto salgan a la venta los billetes de tu fecha; los asientos más baratos son los primeros en agotarse.',
        'Compara los billetes a "Bruselas (cualquier estación)" con los billetes hacia otros destinos belgas, que a veces salen mejor de precio.',
        'Las tarifas para jóvenes y algunas ofertas para grupos pueden bajar el precio; consulta las opciones en la página de reserva.'
      ],
      when: 'Los viernes, los domingos y las vacaciones escolares son los más concurridos y caros. Las mañanas entre semana ofrecen mejor precio. Las escapadas de fin de semana a Bruselas son muy populares, así que reserva pronto las fechas más demandadas.',
      arrivalIntro: 'Bruselas es compacta y fácil de recorrer a pie. Lugares de interés:',
      arrival: [
        '<strong>La Grand-Place</strong> — la plaza de los gremios del siglo XVII, en el centro del casco antiguo.',
        '<strong>El Palacio Real, el Parc de Bruxelles y el Museo Magritte</strong> — se combinan fácilmente en media jornada.',
        '<strong>Murales de cómic</strong> — la tradición del cómic de la ciudad se ve en las paredes de todo el centro.',
        '<strong>Excursiones en tren</strong> — Brujas, Gante y Amberes quedan a menos de una hora de Bruselas.'
      ],
      alt: [
        '<strong>Avión</strong> — unos 1 h 10 min en el aire, pero el traslado al aeropuerto y la seguridad hacen que el total se acerque al del tren, y el tren llega al centro.',
        '<strong>Autocar</strong> — los servicios por el Eurotúnel o en ferri tardan unas siete horas o más.'
      ]
    },
    'geneva-paris': {
      stations: [
        '<strong>Geneva Cornavin</strong> es la estación principal, en el centro, a unos 10–15 minutos a pie del lago y de la Ciudad Vieja. Salen tranvías y autobuses desde la puerta.',
        '<strong>Paris Gare de Lyon</strong> tiene las líneas 1 y 14 del metro y las RER A y D, así que llegas a casi todo el centro de París con, como mucho, un trasbordo.'
      ],
      times: 'El TGV Lyria directo tarda aproximadamente tres horas, con unas pocas salidas al día y no cada media hora, así que conviene elegir primero la salida y después buscar la tarifa. Existen opciones más lentas con cambio en Lyon o Bellegarde, pero el tren directo casi siempre es la mejor elección.',
      ticketsIntro: 'El servicio directo se vende en una gama de tarifas; las más baratas corresponden a un tren concreto y se agotan primero:',
      tickets: [
        ['Saver (anticipado)', 'Un tren concreto', 'El más barato. Los billetes sencillos orientativos suelen empezar alrededor de 30–60 € si reservas con antelación.'],
        ['Standard', 'Menos restricciones', 'Precio intermedio, con cierta flexibilidad para cambiar.'],
        ['Flexible / First', 'Totalmente flexible o primera clase', 'El más caro; útil si tus planes pueden cambiar.']
      ],
      ticketTips: [
        'Reserva en cuanto se abra la venta de tu fecha, y revisa tanto TGV Lyria como las opciones solo de SNCF.',
        'Suiza está fuera de la UE, así que lleva el pasaporte o el DNI aunque normalmente no haya colas en la frontera.',
        'Reserva asiento en el tren directo; la reserva de asiento está incluida en el precio del billete.'
      ],
      when: 'Las tardes de viernes, las noches de domingo y las vacaciones escolares son las más concurridas. Una salida entre semana por la mañana suele ser la más barata y cómoda. Como solo hay unos pocos trenes directos al día, un tren agotado puede dejarte con un enlace mucho más lento.',
      arrivalIntro: 'Ginebra es un buen punto de partida para el lago y los Alpes; París está en el otro extremo de la línea. Lugares de interés en Ginebra:',
      arrival: [
        '<strong>El Jet d\'Eau y el paseo del lago</strong> — a un paseo fácil de Cornavin.',
        '<strong>La Ciudad Vieja y la catedral de San Pedro</strong> — calles empedradas y una torre con vistas de la ciudad.',
        '<strong>El Palais des Nations y el barrio de los museos</strong> — buenos para media jornada a cubierto.',
        '<strong>Excursiones en tren</strong> — Lausana, Montreux y Annecy se alcanzan desde Ginebra.'
      ],
      alt: [
        '<strong>Avión</strong> — unos 1 h 20 min en el aire, pero suma traslados y seguridad; el tren suele ser competitivo de puerta a puerta.',
        '<strong>Autocar</strong> — una opción larga, nocturna o diurna, de unas ocho a nueve horas, más barata que el tren.',
        '<strong>Coche</strong> — unas cinco horas, más la viñeta de autopista suiza y los peajes franceses.'
      ]
    },
    'paris-zurich': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> es la estación de salida del TGV Lyria; enlaza con las líneas 1 y 14 del metro y las RER A y D.',
        '<strong>Zürich HB</strong> es la estación central, a un paseo corto del lago y de la Ciudad Vieja, con tranvías y S-Bahn por debajo.'
      ],
      times: 'El TGV Lyria directo tarda aproximadamente cuatro horas, normalmente con parada en Basilea, y sale unas pocas veces al día. No hay una opción más rápida, así que la hora de salida importa más que el precio cuando planificas un día de viaje. Llegar por la tarde te deja tiempo para una velada junto al lago.',
      ticketsIntro: 'Las tarifas dependen de lo pronto que reserves y de cuál de los pocos trenes diarios elijas:',
      tickets: [
        ['Saver (anticipado)', 'Un tren concreto', 'El más barato. Los billetes sencillos orientativos suelen empezar alrededor de 40–70 € si reservas con antelación.'],
        ['Standard', 'Menos restricciones', 'Precio intermedio; cierta flexibilidad para cambiar.'],
        ['Flexible / First', 'Totalmente flexible o primera clase', 'El más caro; útil si los planes pueden cambiar.']
      ],
      ticketTips: [
        'Reserva pronto para las fechas de más demanda; los asientos más baratos de unos pocos trenes diarios se agotan primero.',
        'Suiza está fuera de la UE, así que lleva el pasaporte o el DNI.',
        'Compara con un cambio en Basilea, que puede salir más barato pero tarda más y arriesga perder la conexión.'
      ],
      when: 'Los viernes, los domingos y las vacaciones escolares son los más concurridos. Las mañanas entre semana suelen ofrecer mejor precio. Comprueba qué días circulan el primer y el último tren directo, porque los servicios varían.',
      arrivalIntro: 'Zúrich es una ciudad compacta y muy caminable, a orillas de un lago. Lugares de interés desde la estación:',
      arrival: [
        '<strong>La Altstadt y la Bahnhofstrasse</strong> — la Ciudad Vieja y la principal calle comercial de la ciudad.',
        '<strong>El lago de Zúrich</strong> — paseos, barcos y zonas para bañarse en verano.',
        '<strong>El Uetliberg</strong> — a un trayecto corto en tren desde la estación, con la mejor vista de la ciudad.',
        '<strong>Excursiones</strong> — Lucerna, Basilea y las cataratas del Rin quedan a una hora o poco más en tren.'
      ],
      alt: [
        '<strong>Avión</strong> — unos 1 h 20 min en el aire, pero con los traslados y la seguridad el tren es competitivo.',
        '<strong>Autocar</strong> — una opción nocturna o de día largo, más barata pero mucho más lenta.',
        '<strong>Coche</strong> — unas siete horas, con la viñeta de autopista suiza y los peajes franceses.'
      ]
    },
    'brussels-paris': {
      stations: [
        '<strong>Brussels-Midi (Brussel-Zuid)</strong> es la estación internacional. Tiene enlaces de metro y tranvía con el centro; la Grand-Place queda a un trayecto corto o a unos 25 minutos a pie.',
        '<strong>Paris Gare du Nord</strong> enlaza con las líneas 4 y 5 del metro y las RER B y D, así que se llega fácilmente a casi todo París.'
      ],
      times: 'El Eurostar tarda aproximadamente 1 h 20 min–1 h 30 min y sale con frecuencia durante el día. Ambas ciudades están en el espacio Schengen, así que no hay control de pasaportes, pero sí controles de billete y de seguridad antes de subir; lo habitual es presentarse unos 30 minutos antes de la salida.',
      ticketsIntro: 'Eurostar usa precios dinámicos, así que quien reserva primero consigue los precios más bajos:',
      tickets: [
        ['Standard (el más barato)', 'Un tren concreto, cambios limitados', 'Los billetes sencillos orientativos suelen empezar alrededor de 30–50 € si reservas con antelación.'],
        ['Standard Premier / Plus', 'Más flexibilidad y extras', 'Precio intermedio, según la categoría.'],
        ['Business Premier', 'Totalmente flexible', 'El más caro; incluye sala VIP y comida.']
      ],
      ticketTips: [
        'Reserva en cuanto se abra la venta; los asientos más baratos son los primeros en agotarse en las fechas de más demanda.',
        'Compara con un cambio en Lille u otras opciones regionales; el tren directo casi siempre es el más rápido y sencillo.',
        'Las tarifas para jóvenes y algunas para grupos pueden bajar el precio; consulta las opciones en la página de reserva.'
      ],
      when: 'Los viernes, los domingos y los festivos son los más concurridos. Los trenes de mediodía entre semana suelen ser más tranquilos. Si enlazas con un vuelo u otro tren, deja un margen razonable para los controles de seguridad.',
      arrivalIntro: 'París no necesita presentación, pero unas notas si llegas a Gare du Nord:',
      arrival: [
        '<strong>Montmartre y el Sacré-Cœur</strong> — a un paseo corto o un trayecto de metro de la estación.',
        '<strong>El Canal Saint-Martin</strong> — un paseo agradable y de aire local, cerca de Gare du Nord.',
        '<strong>El Louvre y el Sena</strong> — fáciles en la línea 4 del metro o en la RER B.',
        '<strong>Excursiones en tren</strong> — Versalles, Chantilly y Ruan son viables desde París.'
      ],
      alt: [
        '<strong>Autocar</strong> — los servicios tardan unas cuatro horas y son más baratos pero más lentos, y dependen del tráfico.',
        '<strong>Coche</strong> — unas tres horas según el tráfico, más peajes y el aparcamiento en París.',
        '<strong>Avión</strong> — poco práctico para este par; el tren es más rápido de puerta a puerta.'
      ]
    },
    'brussels-bruges': {
      stations: [
        '<strong>Brussels Midi, Central o Nord</strong> — los trenes intercity a Brujas paran en las tres estaciones principales de Bruselas, así que elige la más cercana a tu hotel.',
        '<strong>La estación de Brujas</strong> está a unos 1,5 km del Markt, a unos 20–25 minutos a pie, con autobuses y taxis en la salida.'
      ],
      times: 'Los trenes intercity tardan entre 50 minutos y una hora y salen aproximadamente cada media hora durante el día, así que puedes presentarte y viajar sin organizarte en torno a una única salida. Algunos servicios son trenes con más paradas y más lentos, así que revisa la duración del tren que elijas.',
      ticketsIntro: 'El ferrocarril nacional belga (SNCB) tiene tarifas fijas y sencillas en esta línea:',
      tickets: [
        ['Billete sencillo estándar', 'Cualquier tren ese día', 'Normalmente menos de 20 € por trayecto.'],
        ['Ida y vuelta / excursión', 'Ida y vuelta', 'A menudo más barato que dos sencillos; consulta las opciones.'],
        ['Tarifas de fin de semana o reducidas', 'Descuentos de viernes a domingo', 'SNCB ofrece descuentos de fin de semana en muchas rutas; consúltalos en la página de reserva.']
      ],
      ticketTips: [
        'En esta ruta no se gana mucho reservando con meses de antelación; las tarifas son sobre todo fijas, así que puedes comprar en el día.',
        'Valida o escanea el billete como indica la app antes de subir.',
        'Si vas a hacer una excursión de un día, compra la ida y vuelta y sal temprano para adelantarte a los grupos de autocares.'
      ],
      when: 'Brujas se llena en verano y los fines de semana, sobre todo entre media mañana y media tarde. Llegar temprano por la mañana o quedarte hasta el atardecer es la mejor forma de disfrutar de los canales con menos gente.',
      arrivalIntro: 'Brujas es compacta y se recorre mejor a pie. Lugares de interés:',
      arrival: [
        '<strong>El Markt y el Belfort</strong> — la plaza medieval del mercado y su campanario del siglo XIII.',
        '<strong>Los canales y el Beaterio</strong> — rincones tranquilos lejos de las calles principales.',
        '<strong>La plaza Burg y la Basílica de la Santa Sangre</strong> — el antiguo centro cívico.',
        '<strong>Paseo en barco o a pie por los canales</strong> — una forma clásica de ver el casco antiguo en una hora.'
      ],
      alt: [
        '<strong>Autocar</strong> — existen servicios, pero tardan más que el tren.',
        '<strong>Coche</strong> — una hora aproximadamente, pero el aparcamiento en Brujas es limitado y caro; aparca fuera del centro.'
      ]
    },
    'nice-monaco': {
      stations: [
        '<strong>Nice-Ville</strong> es la estación principal, a un trayecto corto en tranvía o a unos 15–20 minutos a pie del Paseo de los Ingleses.',
        '<strong>Monaco-Monte-Carlo</strong> es una estación subterránea; ascensores y escaleras mecánicas suben a la zona del casino de Montecarlo y al puerto.'
      ],
      times: 'El TER costero tarda aproximadamente 20–25 minutos y circula con frecuencia, normalmente cada 15–30 minutos durante el día, así que puedes presentarte y viajar. Por el camino para en pequeñas estaciones costeras como Villefranche-sur-Mer, Beaulieu-sur-Mer y Èze-sur-Mer, y las vistas del Mediterráneo están entre las mejores de la Riviera francesa.',
      ticketsIntro: 'Es una línea regional con tarifas fijas y sencillas, no con precios anticipados:',
      tickets: [
        ['Billete sencillo', 'Cualquier TER ese día', 'Normalmente unos pocos euros por trayecto.'],
        ['Ida y vuelta', 'Ida y vuelta', 'A menudo el mismo precio que dos sencillos.'],
        ['Pase de día / billete regional', 'Viajes locales ilimitados', 'Merece la pena si vas a hacer varias paradas en la costa.']
      ],
      ticketTips: [
        'No se gana nada reservando con antelación: compra en la máquina o en la app y viaja.',
        'De Niza a Mónaco, siéntate en el lado derecho para tener las mejores vistas del mar.',
        'Para en Villefranche-sur-Mer o en Èze a la vuelta para un pequeño desvío por la costa.'
      ],
      when: 'Las mañanas y las últimas horas de la tarde en verano están llenas de excursionistas. Una salida a primera hora te da trenes más tranquilos y paseos más frescos en Mónaco. Deja tiempo extra los fines de semana del Gran Premio y de grandes eventos.',
      arrivalIntro: 'Mónaco es lo bastante pequeño para recorrerlo a pie en un día. Lugares de interés:',
      arrival: [
        '<strong>El Palacio del Príncipe y el Peñón</strong> — el casco antiguo de Mónaco-Ville, con vistas al puerto.',
        '<strong>El Casino de Montecarlo y la Place du Casino</strong> — la plaza más conocida y sus jardines.',
        '<strong>El Museo Oceanográfico</strong> — un acuario y museo en el acantilado sobre el mar.',
        '<strong>Port Hercule</strong> — el puerto principal, un buen sitio para comer.'
      ],
      alt: [
        '<strong>Autobús</strong> — hay un autobús costero entre Niza y Mónaco, más lento que el tren pero muy barato.',
        '<strong>Coche</strong> — entre 30 y 45 minutos, pero el tráfico y el aparcamiento en Mónaco lo hacen una mala opción.',
        '<strong>A pie o en bici</strong> — el camino de la costa es espectacular pero largo, mejor reservarlo para otro día.'
      ]
    },
    'munich-berlin': {
      stations: [
        '<strong>München Hauptbahnhof</strong> es la estación principal, con S-Bahn, U-Bahn y el casco antiguo de la ciudad a un paseo corto.',
        '<strong>Berlin Hauptbahnhof</strong> es una estación moderna de cristal al norte del centro. S-Bahn y U-Bahn llevan a los principales distritos; la Puerta de Brandeburgo queda a unos 20 minutos a pie.'
      ],
      times: 'Los ICE más rápidos tardan aproximadamente cuatro horas, y los "Sprinter" más rápidos paran en muy pocas estaciones. Suele haber al menos un tren cada hora durante el día, así que puedes elegir la salida que te venga bien. Los ICE más lentos, con más paradas, añaden algo de tiempo, así que revisa la duración del tren que elijas.',
      ticketsIntro: 'Deutsche Bahn vende una gama de tarifas para el mismo tren, desde tarifas económicas hasta billetes totalmente flexibles:',
      tickets: [
        ['Sparpreis (económica)', 'Un tren concreto, cambios limitados', 'El más barato. Los billetes sencillos orientativos suelen empezar entre 20 y 50 € si reservas pronto.'],
        ['Flexpreis', 'Cualquier tren ese día', 'Medio-alto; la tarifa flexible estándar, que puede superar con creces los 100 €.'],
        ['Super Sparpreis', 'El más barato, condiciones estrictas', 'Disponibilidad limitada y precios más bajos; se agota primero.']
      ],
      ticketTips: [
        'Reserva en cuanto se abra la venta de tu fecha; las tarifas Sparpreis más baratas son limitadas y suben a medida que se llena el tren.',
        'Una <strong>BahnCard 25 o 50</strong> se amortiza rápido si haces varios viajes largos por Alemania.',
        'Reserva asiento en un tren concurrido; las reservas son baratas y valen la pena los viernes y domingos.'
      ],
      when: 'Las noches de viernes, las tardes de domingo y las vacaciones escolares son las más concurridas. Los trenes entre semana a media mañana suelen ser más baratos y tranquilos. Si buscas silencio, elige el coche silencioso, que el tren indica.',
      arrivalIntro: 'Berlín es grande; usa el S-Bahn y el U-Bahn para moverte entre distritos. Lugares de interés:',
      arrival: [
        '<strong>La Puerta de Brandeburgo y el Reichstag</strong> — se llega a pie desde la estación principal; reserva la cúpula del Reichstag por internet.',
        '<strong>La Isla de los Museos</strong> — una isla Patrimonio de la Humanidad de la Unesco con varios museos importantes.',
        '<strong>La East Side Gallery y Kreuzberg</strong> — el tramo conservado del Muro y un barrio animado para comer.',
        '<strong>Charlottenburg y el oeste</strong> — palacio, bulevares y zonas más tranquilas.'
      ],
      alt: [
        '<strong>Avión</strong> — aproximadamente 1 hora en el aire, pero con los traslados y la seguridad el tren es competitivo y llega al centro.',
        '<strong>Autocar</strong> — una opción nocturna o de día largo, a menudo mucho más barata pero de unas siete a nueve horas.',
        '<strong>Coche</strong> — unas seis horas según el tráfico, más combustible y aparcamiento.'
      ]
    },
    'rome-venice': {
      stations: [
        '<strong>Roma Termini</strong> es la estación principal de Roma, con las líneas A y B del metro y autobuses. De aquí salen los servicios de Frecciarossa y de Italo.',
        '<strong>Venezia Santa Lucia</strong> está junto al Gran Canal. Desde la estación se sigue a pie o en vaporetto (autobús acuático); algunos trenes paran en cambio en Venezia Mestre, en tierra firme, así que comprueba qué estación indica tu billete.'
      ],
      times: 'Los trenes de alta velocidad Frecciarossa e Italo tardan aproximadamente de 3 h 45 min a 4 h, con salidas más o menos cada hora o con más frecuencia durante el día, y algunas opciones regionales más lentas que tardan mucho más. Los trenes suelen parar en Florencia y a veces en Bolonia, lo que hace de esta una buena ruta para partir el viaje.',
      ticketsIntro: 'Frecciarossa (Trenitalia) e Italo compiten en esta ruta, lo que mantiene razonables las tarifas anticipadas:',
      tickets: [
        ['Super Economy / Economy', 'Un tren concreto, cambios limitados', 'El más barato. Los billetes sencillos orientativos suelen empezar entre 30 y 50 € si reservas con antelación.'],
        ['Base', 'Más flexibilidad para cambiar', 'Precio intermedio.'],
        ['Flex / Prima', 'Totalmente flexible o primera clase', 'El más caro; útil si los planes pueden cambiar.']
      ],
      ticketTips: [
        'Compara Frecciarossa e Italo en la misma fecha; el operador más barato cambia de un día a otro.',
        'Reserva en cuanto se abra la venta de tu fecha; las tarifas más bajas se agotan primero.',
        'La reserva de asiento está incluida en el precio del billete en los trenes de alta velocidad; no hace falta comprar otra aparte.'
      ],
      when: 'Las tardes de viernes, las noches de domingo y las vacaciones de Semana Santa y de verano son las más concurridas y caras. Las mañanas entre semana suelen ofrecer mejor precio. Deja tiempo extra en Venecia, porque los vaporettos van lentos y llenos en temporada alta.',
      arrivalIntro: 'Venecia premia perderse. Desde la estación, merece la pena caminar al menos parte del trayecto. Lugares de interés:',
      arrival: [
        '<strong>El Gran Canal</strong> — toma el vaporetto de la línea 1 para recorrer todo el canal despacio y a buen precio.',
        '<strong>La plaza de San Marcos y la basílica</strong> — ve temprano para evitar las multitudes.',
        '<strong>Rialto y el barrio de Cannaregio</strong> — calles más tranquilas, bares locales y el antiguo Gueto judío.',
        '<strong>Burano y Murano</strong> — excursiones a las islas en vaporetto desde Fondamente Nove.'
      ],
      alt: [
        '<strong>Avión</strong> — unos 1 h 15 min en el aire, pero el aeropuerto Marco Polo está en tierra firme y el traslado a Venecia suma tiempo.',
        '<strong>Tren nocturno</strong> — a veces disponible entre Roma y el norte; consulta el horario en directo.',
        '<strong>Coche</strong> — unas cinco a seis horas, pero no se permiten coches en la propia Venecia.'
      ]
    },
    'paris-lyon': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> tiene las líneas 1 y 14 del metro y las RER A y D. Algunos trenes económicos Ouigo salen en cambio de otras estaciones del área de París, así que comprueba la estación de salida de tu billete.',
        '<strong>Lyon Part-Dieu</strong> es la estación principal del distrito de negocios y tiene enlaces de metro y tranvía con el centro. Algunos trenes también paran en <strong>Lyon Perrache</strong>, más cerca de la Presqu\'île y de la confluencia de los ríos.'
      ],
      times: 'Los TGV más rápidos tardan aproximadamente dos horas, y hay salidas a lo largo del día a intervalos cortos, así que rara vez tienes que organizarte en torno a un único tren. Los servicios económicos Ouigo tardan prácticamente lo mismo, pero usan otras estaciones y tienen normas de equipaje más estrictas.',
      ticketsIntro: 'En esta línea circulan tanto el TGV INOUI de SNCF como el Ouigo económico, así que conviene compararlos:',
      tickets: [
        ['Ouigo (económico)', 'Un tren concreto, normas de equipaje estrictas', 'El más barato. Los billetes sencillos orientativos suelen empezar alrededor de 10–25 € si reservas pronto.'],
        ['TGV INOUI Prem\'s / anticipado', 'Un tren concreto', 'Precio intermedio; los billetes sencillos orientativos suelen empezar alrededor de 25–60 € si reservas con antelación.'],
        ['TGV INOUI flexible', 'Cualquier tren, con cambios', 'El más caro; útil si tus planes pueden cambiar.']
      ],
      ticketTips: [
        'Compara Ouigo y TGV INOUI el mismo día; Ouigo no siempre es el más barato una vez sumados equipaje y asiento.',
        'Una <strong>tarjeta de jóvenes o de mayores</strong> de SNCF puede reducir muchas tarifas en torno a un 30 %.',
        'Reserva en cuanto se abra la venta de tu fecha; los asientos más baratos se agotan primero.'
      ],
      when: 'Los viernes, los domingos y las vacaciones escolares son los más concurridos. Entre semana a media mañana suele ser lo más barato y tranquilo. Deja tiempo en Gare de Lyon, que es grande y tiene varias salas de trenes.',
      arrivalIntro: 'Lyon es compacta y un placer para recorrer a pie. Lugares de interés:',
      arrival: [
        '<strong>Vieux Lyon y las traboules</strong> — el casco antiguo renacentista y sus pasajes ocultos.',
        '<strong>La basílica de Fourvière</strong> — se sube en funicular desde Vieux Lyon, con la mejor vista de la ciudad.',
        '<strong>Les Halles de Lyon Paul Bocuse</strong> — el mercado cubierto, bueno para comer.',
        '<strong>La Presqu\'île y la Croix-Rousse</strong> — calles comerciales, plazas y el antiguo barrio de los tejedores de seda.'
      ],
      alt: [
        '<strong>Autocar</strong> — los servicios tardan entre cinco y seis horas y son más baratos pero mucho más lentos.',
        '<strong>Coche</strong> — unas cuatro horas y media a cinco, más peajes y aparcamiento en la ciudad.',
        '<strong>Avión</strong> — poco práctico para este par; el tren es más rápido de puerta a puerta.'
      ]
    },
    'paris-bordeaux': {
      stations: [
        '<strong>Paris Montparnasse</strong> es la estación de salida de la línea de alta velocidad atlántica, con las líneas 4, 6, 12 y 13 del metro.',
        '<strong>Bordeaux Saint-Jean</strong> está a unos 3 km al sur del centro. El tranvía la conecta con la Place de la Bourse y el casco antiguo en unos 15–20 minutos.'
      ],
      times: 'Desde que abrió la línea de alta velocidad a Burdeos en 2017, los TGV más rápidos tardan algo más de dos horas. Hay salidas frecuentes durante el día, desde primera hora hasta la noche, así que una excursión de un día en cualquier sentido es realista, aunque pasar una noche en Burdeos es mucho más relajado.',
      ticketsIntro: 'El TGV INOUI de SNCF y el Ouigo económico sirven Burdeos, y los precios pueden variar mucho según la fecha:',
      tickets: [
        ['Ouigo (económico)', 'Un tren concreto, normas de equipaje estrictas', 'El más barato. Los billetes sencillos orientativos suelen empezar alrededor de 15–30 € si reservas pronto.'],
        ['TGV INOUI anticipado', 'Un tren concreto', 'Precio intermedio; los billetes sencillos orientativos suelen empezar alrededor de 30–70 € si reservas con antelación.'],
        ['TGV INOUI flexible', 'Cualquier tren, con cambios', 'El más caro.']
      ],
      ticketTips: [
        'Reserva lo antes posible; los trenes de viernes y domingo son los primeros en agotar las tarifas bajas.',
        'Una <strong>tarjeta de jóvenes o de mayores</strong> de SNCF puede reducir muchas tarifas en torno a un 30 %.',
        'Compara Ouigo y TGV INOUI el mismo día.'
      ],
      when: 'Los viernes, los domingos y las vacaciones de verano son los más concurridos y caros. Los trenes entre semana a media mañana suelen ser los más baratos. Burdeos también está muy solicitada en las semanas de vendimia, así que reserva el alojamiento pronto.',
      arrivalIntro: 'Burdeos es una ciudad elegante y muy caminable. Lugares de interés:',
      arrival: [
        '<strong>La Place de la Bourse y el Miroir d\'eau</strong> — la plaza del siglo XVIII y el espejo de agua en los muelles.',
        '<strong>La Cité du Vin</strong> — un museo dedicado al mundo del vino, junto al río.',
        '<strong>El barrio de Chartrons</strong> — anticuarios, cafés y comerciantes de vino.',
        '<strong>Saint-Émilion</strong> — un pueblo medieval del vino, a unos 35 minutos en tren desde Burdeos.'
      ],
      alt: [
        '<strong>Autocar</strong> — los servicios tardan unas siete horas, mucho más que el tren.',
        '<strong>Coche</strong> — unas cinco horas y media más peajes.',
        '<strong>Avión</strong> — aproximadamente una hora en el aire, pero con los traslados y la seguridad el tren es competitivo.'
      ]
    },
    'paris-nice': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> es la estación de salida hacia el sur de Francia, con las líneas 1 y 14 del metro y las RER A y D.',
        '<strong>Nice-Ville</strong> es la estación principal, a un trayecto corto en tranvía o a unos 15–20 minutos a pie del Paseo de los Ingleses y de la Ciudad Vieja.'
      ],
      times: 'El TGV directo tarda aproximadamente 5 h 30 min–6 h, con solo unos pocos trenes directos al día, así que conviene elegir primero la salida. La línea pasa por Lyon, Marsella y la Costa Azul, lo que hace pintoresca la segunda mitad del trayecto. También ha circulado un tren nocturno en esta ruta en algunas fechas, así que consulta el horario en directo.',
      ticketsIntro: 'Las tarifas dependen de lo pronto que reserves y de cuál de los pocos trenes directos elijas:',
      tickets: [
        ['Anticipado (TGV INOUI Prem\'s)', 'Un tren concreto', 'El más barato. Los billetes sencillos orientativos suelen empezar alrededor de 30–70 € si reservas pronto.'],
        ['TGV INOUI estándar', 'Cierta flexibilidad para cambiar', 'Precio intermedio.'],
        ['TGV INOUI flexible / primera', 'Totalmente flexible o primera clase', 'El más caro.']
      ],
      ticketTips: [
        'Reserva pronto para el verano; la Costa Azul está más concurrida de junio a septiembre.',
        'Una <strong>tarjeta de jóvenes o de mayores</strong> de SNCF puede reducir muchas tarifas en torno a un 30 %.',
        'Compara el tren directo con un cambio en Lyon o Marsella; el directo casi siempre es más sencillo.'
      ],
      when: 'Los viernes, los domingos y las vacaciones escolares son los más caros. Julio y agosto son los meses más concurridos. Las salidas entre semana por la mañana suelen ofrecer mejor precio.',
      arrivalIntro: 'Niza es una ciudad compacta; uno o dos días son un buen comienzo. Lugares de interés:',
      arrival: [
        '<strong>El Paseo de los Ingleses</strong> — el bulevar frente al mar a lo largo de la bahía.',
        '<strong>Vieux Nice y el mercado del Cours Saleya</strong> — callejuelas, puestos de comida y el mercado de flores.',
        '<strong>La colina del Castillo</strong> — una subida corta con vistas a la bahía y al puerto.',
        '<strong>Excursiones en tren por la costa</strong> — Mónaco, Antibes y Cannes están en la misma línea.'
      ],
      alt: [
        '<strong>Avión</strong> — unos 1 h 30 min en el aire, y el aeropuerto de Niza está a un trayecto corto en tranvía del centro, así que es competitivo en tiempo.',
        '<strong>Autocar</strong> — una opción nocturna o de día muy largo, de unas doce horas, mucho más barata.',
        '<strong>Coche</strong> — entre ocho y nueve horas más peajes.'
      ]
    },
    'paris-barcelona': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> es la estación de salida, con las líneas 1 y 14 del metro y las RER A y D.',
        '<strong>Barcelona Sants</strong> es la estación principal, con las líneas L3 y L5 del metro y la red de Rodalies; el centro queda a un trayecto corto en metro.'
      ],
      times: 'El tren directo de alta velocidad tarda aproximadamente 6 h 30 min–7 h, con un pequeño número de salidas directas al día. Recorre el sur de Francia y cruza los Pirineos sin cambio, normalmente con paradas como Girona y Figueres en el lado español. Como hay tan pocos trenes directos, planifica en torno a la salida y no al precio.',
      ticketsIntro: 'Los billetes directos se venden con una tarifa única de alta velocidad, y los más baratos corresponden a un tren concreto:',
      tickets: [
        ['Anticipado', 'Un tren concreto', 'El más barato. Los billetes sencillos orientativos suelen empezar alrededor de 35–80 € si reservas pronto.'],
        ['Estándar', 'Cierta flexibilidad para cambiar', 'Precio intermedio.'],
        ['Flexible / primera', 'Totalmente flexible o primera clase', 'El más caro.']
      ],
      ticketTips: [
        'Reserva pronto para el verano y los fines de semana de vacaciones; los trenes directos se agotan.',
        'Compara el tren directo con un cambio en Lyon, Montpellier o Perpiñán, que puede salir más barato pero tarda más.',
        'La línea cruza la frontera sin controles dentro del espacio Schengen, pero lleva tu documento de identidad.'
      ],
      when: 'Los viernes, los domingos, las vacaciones escolares y el verano son los más concurridos. Las salidas entre semana por la mañana suelen ofrecer mejor precio.',
      arrivalIntro: 'Barcelona es grande y animada, con las zonas mejores bastante juntas. Lugares de interés:',
      arrival: [
        '<strong>La Sagrada Familia y el Eixample de Gaudí</strong> — reserva las entradas con antelación; las colas son largas.',
        '<strong>El Barrio Gótico y La Rambla</strong> — el centro histórico; mantén cerca los objetos de valor.',
        '<strong>El Park Güell y el barrio de Gràcia</strong> — una mezcla de Gaudí y calles de ambiente de pueblo.',
        '<strong>La playa y la Barceloneta</strong> — a un trayecto corto en metro del centro.'
      ],
      alt: [
        '<strong>Avión</strong> — unos 1 h 45 min en el aire, pero los traslados y la seguridad reducen la ventaja sobre el tren.',
        '<strong>Autocar</strong> — los servicios tardan unas catorce horas o más.',
        '<strong>Coche</strong> — entre ocho y nueve horas más peajes.'
      ]
    },
    'basel-paris': {
      stations: [
        '<strong>Basel SBB</strong> es la estación suiza, con la Ciudad Vieja y el Rin a unos 15 minutos a pie; los tranvías salen frente a la estación. El lado francés de la estación, Basel SNCF, forma parte del mismo complejo.',
        '<strong>Paris Gare de l\'Est</strong> es la terminal parisina para el este de Francia y Suiza, con las líneas 4, 5 y 7 del metro y enlaces RER cerca.'
      ],
      times: 'El TGV directo tarda aproximadamente tres horas y sale varias veces al día por la línea que pasa por Mulhouse, así que normalmente puedes elegir una salida que te venga bien. Suiza está fuera de la UE, así que lleva el pasaporte o el DNI.',
      ticketsIntro: 'TGV INOUI y TGV Lyria sirven Basilea, y las tarifas varían según el tren y lo pronto que reserves:',
      tickets: [
        ['Anticipado', 'Un tren concreto', 'El más barato. Los billetes sencillos orientativos suelen empezar alrededor de 25–60 € si reservas pronto.'],
        ['Estándar', 'Cierta flexibilidad para cambiar', 'Precio intermedio.'],
        ['Flexible / primera', 'Totalmente flexible o primera clase', 'El más caro.']
      ],
      ticketTips: [
        'Reserva en cuanto se abra la venta de tu fecha; las tarifas más baratas se agotan primero.',
        'Una <strong>tarjeta de jóvenes o de mayores</strong> de SNCF puede reducir muchas tarifas en torno a un 30 %.',
        'Compara el tren directo con un cambio en Estrasburgo o Mulhouse; el directo suele ser más sencillo.'
      ],
      when: 'Los viernes, los domingos y las vacaciones escolares son los más concurridos. Las salidas entre semana por la mañana suelen ofrecer mejor precio. Basilea también se llena durante sus grandes ferias, así que reserva pronto.',
      arrivalIntro: 'Basilea es compacta y fácil de ver a pie. Lugares de interés:',
      arrival: [
        '<strong>La Ciudad Vieja y el Münster</strong> — la catedral y las calles estrechas de alrededor.',
        '<strong>El paseo del Rin</strong> — los vecinos se bañan en el río en verano.',
        '<strong>Los museos</strong> — Basilea tiene una gran colección de museos de arte, entre ellos el Kunstmuseum.',
        '<strong>Excursiones en tren</strong> — Lucerna, Berna y Zúrich quedan a una o dos horas.'
      ],
      alt: [
        '<strong>Avión</strong> — existe un vuelo corto, pero los traslados lo hacen poco competitivo para este par.',
        '<strong>Autocar</strong> — los servicios tardan unas ocho horas y son más baratos pero más lentos.',
        '<strong>Coche</strong> — unas cinco horas, más peajes y la viñeta de autopista suiza.'
      ]
    },
    'frankfurt-paris': {
      stations: [
        '<strong>Frankfurt Hauptbahnhof</strong> es un gran nudo con S-Bahn, U-Bahn y conexiones de larga distancia; el centro queda a un paseo corto.',
        '<strong>Paris Gare de l\'Est</strong> sirve al este de Francia y a Alemania, con las líneas 4, 5 y 7 del metro cerca.'
      ],
      times: 'El tren directo tarda aproximadamente cuatro horas, y unos pocos servicios directos ICE y TGV circulan cada día por Saarbrücken o Estrasburgo, así que elige primero la salida. Existen opciones más lentas con cambio, pero suelen ser menos cómodas.',
      ticketsIntro: 'Deutsche Bahn y SNCF venden billetes en esta línea, con tarifas económicas para un tren concreto:',
      tickets: [
        ['Saver (Sparpreis Europa / Prem\'s)', 'Un tren concreto', 'El más barato. Los billetes sencillos orientativos suelen empezar alrededor de 30–60 € si reservas pronto.'],
        ['Estándar', 'Cierta flexibilidad para cambiar', 'Precio intermedio.'],
        ['Flexible', 'Cualquier tren, con cambios', 'El más caro.']
      ],
      ticketTips: [
        'Compara el mismo tren vendido por Deutsche Bahn y por SNCF; el precio puede diferir entre ambos.',
        'Una <strong>BahnCard</strong> o una <strong>tarjeta de descuento de SNCF</strong> puede reducir muchas tarifas.',
        'Reserva asiento en un tren concurrido; las reservas están incluidas en muchas tarifas económicas.'
      ],
      when: 'Los viernes, los domingos y las vacaciones escolares son los más concurridos. Los trenes entre semana a media mañana suelen ser los más baratos.',
      arrivalIntro: 'Fráncfort es una ciudad de negocios compacta con una ribera animada. Lugares de interés:',
      arrival: [
        '<strong>El Römerberg y el casco antiguo</strong> — una plaza medieval reconstruida.',
        '<strong>El Museumsufer</strong> — un tramo del río Meno bordeado de museos, entre ellos el Städel.',
        '<strong>Sachsenhausen</strong> — un barrio conocido por sus tabernas de sidra.',
        '<strong>Excursiones en tren</strong> — Heidelberg, Maguncia y Wiesbaden quedan a menos de una hora.'
      ],
      alt: [
        '<strong>Avión</strong> — unos 1 h 20 min en el aire, pero los traslados y la seguridad reducen la ventaja sobre el tren.',
        '<strong>Autocar</strong> — los servicios tardan unas ocho a nueve horas y son más baratos pero más lentos.',
        '<strong>Coche</strong> — unas seis horas según el tráfico.'
      ]
    }
  }
};
