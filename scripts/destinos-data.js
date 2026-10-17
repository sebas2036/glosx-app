/** Datos de las páginas de destino nuevas (/destinos/<slug>/ y /destinos/<slug>/es/). Hechos estables; lo que cambia se presenta como orientativo. */
const PX = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
module.exports = [
  {
    slug: 'bruges', photo: 5612487, from: 'brussels', to: 'bruges', routes: ['brussels-bruges', 'amsterdam-bruges', 'paris-bruges'],
    en: {
      badge: 'Medieval canal city · Belgium', h1: 'How to Get to Bruges by Train', meta: 'By WoW Train · Updated October 2026 · 4 min read',
      title: 'How to Get to Bruges by Train: Brussels, Amsterdam, Paris | WoW Train · glosx.app',
      desc: 'How to reach Bruges by train: the fastest connections from Brussels, Amsterdam and Paris, the walk from the station, the best time to visit and how to avoid the crowds.',
      keywords: 'Bruges by train, Brussels to Bruges train, Amsterdam to Bruges train, Paris to Bruges train, Bruges day trip, Bruges station to centre',
      lead: 'A medieval city of canals, cobbled lanes and a market square that looks like a postcard. Bruges is small, flat and very easy to reach by train, which is why it is one of the most popular day trips in Belgium, and also why the centre fills up by late morning.',
      secret: '<strong>The tip worth knowing:</strong> the station is outside the old town, about 1.5 km from the Markt. The walk takes roughly 20–25 minutes, and it is a good way to arrive, but buses and taxis wait outside if you have luggage.',
      cta: 'View timetables and tickets →', ctaFoot: 'Prefer to compare every rail operator? Check schedules & book →',
      sections: [
        ['What is the fastest way to get to Bruges?', '<p>Most routes run through <strong>Brussels</strong>. From Brussels, direct intercity trains reach Bruges in roughly <strong>50 minutes to an hour</strong> and run about every half hour, so there is no need to plan around one departure. From <strong>Amsterdam</strong> the journey takes roughly <strong>2h 40m–3h</strong> with a change, usually in Brussels or Antwerp. From <strong>Paris</strong>, take the Eurostar to Brussels-Midi (about 1h 20m–1h 30m) and change to a Bruges train, for roughly three and a half hours in total. From <strong>London</strong>, the Eurostar to Brussels takes about two hours, plus the connection.</p>'],
        ['How to get from the station to the centre?', '<ul><li><strong>On foot:</strong> roughly 20–25 minutes to the Markt, through the quiet streets near the Minnewater park.</li><li><strong>By bus:</strong> local buses run from outside the station to the centre; check the live timetable for the line.</li><li><strong>By taxi or bike:</strong> a short ride; bikes can be rented in the station area.</li></ul>'],
        ['When is the best time to go?', '<ul><li><strong>Early morning or evening.</strong> Day-trippers arrive between late morning and mid-afternoon, so arriving early or staying until evening gives you the canals with far fewer people.</li><li><strong>Weekdays outside July and August</strong> are the quietest, and you can often find weekend discounts on the national railway for Friday to Sunday travel.</li><li><strong>Fares are mostly fixed</strong> on this line, so you can buy on the day; there is no big saving from booking months ahead.</li></ul>'],
        ['What to see in a day?', '<ul><li><strong>The Markt and the Belfry</strong> — the market square and its 13th-century bell tower.</li><li><strong>The canals and the Begijnhof</strong> — quiet corners away from the main streets.</li><li><strong>Burg square and the Basilica of the Holy Blood</strong> — the old civic centre.</li><li><strong>A boat tour or a walk along the canals</strong> — the classic way to see the old town in about an hour.</li></ul>']
      ],
      closing: 'You have seen it. Now go. The easiest way in is from <strong>Brussels</strong>: book your train there and the rest is a short walk. Every operator, one secure checkout.',
      related: 'Related routes'
    },
    es: {
      badge: 'Ciudad medieval de canales · Bélgica', h1: 'Cómo llegar a Brujas en tren', meta: 'Por WoW Train · Actualizado octubre 2026 · 4 min de lectura',
      title: 'Cómo llegar a Brujas en tren: desde Bruselas, Ámsterdam y París | WoW Train · glosx.app',
      desc: 'Cómo llegar a Brujas en tren: las conexiones más rápidas desde Bruselas, Ámsterdam y París, el paseo desde la estación, el mejor momento para visitarla y cómo evitar las multitudes.',
      keywords: 'Brujas en tren, tren Bruselas Brujas, tren Ámsterdam Brujas, tren París Brujas, excursión a Brujas, estación de Brujas al centro',
      lead: 'Una ciudad medieval de canales, calles empedradas y una plaza del mercado que parece una postal. Brujas es pequeña, llana y muy fácil de alcanzar en tren, por eso es una de las excursiones de un día más populares de Bélgica, y también por eso el centro se llena a media mañana.',
      secret: '<strong>El dato que conviene saber:</strong> la estación está fuera del casco antiguo, a unos 1,5 km del Markt. El paseo dura unos 20–25 minutos y es una buena forma de llegar, pero si llevas equipaje hay autobuses y taxis a la salida.',
      cta: 'Ver horarios y billetes →', ctaFoot: '¿Prefieres comparar todos los operadores? Consultar horarios y reservar →',
      sections: [
        ['¿Cuál es la forma más rápida de llegar a Brujas?', '<p>La mayoría de los trayectos pasan por <strong>Bruselas</strong>. Desde Bruselas, los trenes intercity directos llegan a Brujas en unos <strong>50 minutos a una hora</strong> y salen más o menos cada media hora, así que no hace falta organizarse en torno a una sola salida. Desde <strong>Ámsterdam</strong> el viaje dura unas <strong>2 h 40 min–3 h</strong> con un cambio, normalmente en Bruselas o Amberes. Desde <strong>París</strong>, toma el Eurostar hasta Bruselas-Midi (aproximadamente 1 h 20 min–1 h 30 min) y cambia a un tren a Brujas, unas tres horas y media en total. Desde <strong>Londres</strong>, el Eurostar a Bruselas tarda unas dos horas, más la conexión.</p>'],
        ['¿Cómo ir de la estación al centro?', '<ul><li><strong>A pie:</strong> unos 20–25 minutos hasta el Markt, por las calles tranquilas cerca del parque Minnewater.</li><li><strong>En autobús:</strong> hay autobuses locales desde la salida de la estación hasta el centro; consulta el horario en directo de la línea.</li><li><strong>En taxi o en bici:</strong> un trayecto corto; se pueden alquilar bicis en la zona de la estación.</li></ul>'],
        ['¿Cuál es el mejor momento para ir?', '<ul><li><strong>A primera hora o al atardecer.</strong> Los excursionistas llegan entre media mañana y media tarde, así que llegar pronto o quedarte hasta la tarde te da los canales con mucha menos gente.</li><li><strong>Entre semana, fuera de julio y agosto,</strong> es lo más tranquilo, y a menudo hay descuentos de fin de semana en el ferrocarril nacional para viajar de viernes a domingo.</li><li><strong>Las tarifas son casi fijas</strong> en esta línea, así que puedes comprar en el día; no se ahorra mucho reservando con meses de antelación.</li></ul>'],
        ['¿Qué ver en un día?', '<ul><li><strong>El Markt y el Belfort</strong> — la plaza del mercado y su campanario del siglo XIII.</li><li><strong>Los canales y el Beaterio (Begijnhof)</strong> — rincones tranquilos lejos de las calles principales.</li><li><strong>La plaza Burg y la Basílica de la Santa Sangre</strong> — el antiguo centro cívico.</li><li><strong>Un paseo en barco o a pie por los canales</strong> — la forma clásica de ver el casco antiguo en una hora.</li></ul>']
      ],
      closing: 'Ya la has visto. Ahora ve. La forma más fácil de llegar es desde <strong>Bruselas</strong>: reserva allí tu tren y el resto es un paseo corto. Todos los operadores, un solo pago seguro.',
      related: 'Rutas relacionadas'
    }
  },
  {
    slug: 'salzburg', photo: 37861319, from: 'vienna', to: 'salzburg', routes: ['vienna-salzburg', 'munich-salzburg'],
    en: {
      badge: 'Mozart\'s city · Austria', h1: 'How to Get to Salzburg by Train', meta: 'By WoW Train · Updated October 2026 · 4 min read',
      title: 'How to Get to Salzburg by Train: from Vienna and Munich | WoW Train · glosx.app',
      desc: 'How to reach Salzburg by train from Vienna and Munich: journey times, the walk from the station to the old town, the best time to visit and what to see in a day.',
      keywords: 'Salzburg by train, Vienna to Salzburg train, Munich to Salzburg train, Salzburg station to old town, Salzburg day trip, Salzburg Hauptbahnhof',
      lead: 'Baroque domes under a fortress, Mozart\'s birthplace, and the Alps on the horizon. Salzburg sits on the main line between Vienna and Munich, which makes it one of the easiest and most rewarding stops on a rail trip through Central Europe.',
      secret: '<strong>The tip worth knowing:</strong> Salzburg Hauptbahnhof is in the new town, on the north bank of the river. The old town and the fortress are on the other side, roughly 1.5 km away. Walk through the Mirabell Gardens on the way for the classic view of the fortress.',
      cta: 'View timetables and tickets →', ctaFoot: 'Prefer to compare every rail operator? Check schedules & book →',
      sections: [
        ['What is the fastest way to get to Salzburg?', '<p>From <strong>Munich</strong>, direct trains take roughly <strong>1h 30m–1h 45m</strong> and run about hourly through the day. From <strong>Vienna</strong>, the ÖBB Railjet takes roughly <strong>2h 30m–2h 45m</strong>, also with frequent departures. Both services arrive at Salzburg Hauptbahnhof, so you do not need to change. From <strong>Prague</strong>, Budapest or Venice, plan one change in Vienna, Munich or Villach.</p>'],
        ['How to get from the station to the old town?', '<ul><li><strong>On foot:</strong> roughly 15–25 minutes to the old town, via the Mirabell Gardens and across the river.</li><li><strong>By bus:</strong> local buses run from the station to the old town; check the live timetable.</li><li><strong>By taxi:</strong> a short ride if you are carrying luggage.</li></ul>'],
        ['When is the best time to go?', '<ul><li><strong>Early morning.</strong> The old town is calmest before the tour groups arrive, and the fortress opens early.</li><li><strong>Late spring and early autumn</strong> have comfortable weather and fewer crowds than July and August.</li><li><strong>December</strong> brings the Christmas markets, which are beautiful but busy; book accommodation early.</li></ul>'],
        ['What to see in a day?', '<ul><li><strong>Hohensalzburg Fortress</strong> — a funicular or a steep walk up to one of the largest medieval castles in Europe.</li><li><strong>Getreidegasse and Mozart\'s Birthplace</strong> — the main shopping lane and the house where Mozart was born.</li><li><strong>Salzburg Cathedral and Residenzplatz</strong> — the baroque heart of the old town.</li><li><strong>Mirabell Gardens</strong> — formal gardens close to the station, also a Sound of Music location.</li></ul><p>For a second day, <a href="/destinos/hallstatt/">Hallstatt</a> is a classic day trip by train and ferry.</p>']
      ],
      closing: 'You have seen it. Now go. Salzburg is on the main Vienna–Munich line: book your train and you are in the old town within half an hour of arriving. Every operator, one secure checkout.',
      related: 'Related routes'
    },
    es: {
      badge: 'La ciudad de Mozart · Austria', h1: 'Cómo llegar a Salzburgo en tren', meta: 'Por WoW Train · Actualizado octubre 2026 · 4 min de lectura',
      title: 'Cómo llegar a Salzburgo en tren: desde Viena y Múnich | WoW Train · glosx.app',
      desc: 'Cómo llegar a Salzburgo en tren desde Viena y Múnich: duración del trayecto, el paseo de la estación al casco antiguo, el mejor momento para visitarla y qué ver en un día.',
      keywords: 'Salzburgo en tren, tren Viena Salzburgo, tren Múnich Salzburgo, estación de Salzburgo al casco antiguo, excursión a Salzburgo',
      lead: 'Cúpulas barrocas bajo una fortaleza, la casa natal de Mozart y los Alpes en el horizonte. Salzburgo está en la línea principal entre Viena y Múnich, lo que la convierte en una de las paradas más fáciles y gratificantes de un viaje en tren por Europa central.',
      secret: '<strong>El dato que conviene saber:</strong> la Hauptbahnhof de Salzburgo está en la ciudad nueva, en la orilla norte del río. El casco antiguo y la fortaleza están al otro lado, a unos 1,5 km. Pasa por los jardines de Mirabell en el camino para ver la vista clásica de la fortaleza.',
      cta: 'Ver horarios y billetes →', ctaFoot: '¿Prefieres comparar todos los operadores? Consultar horarios y reservar →',
      sections: [
        ['¿Cuál es la forma más rápida de llegar a Salzburgo?', '<p>Desde <strong>Múnich</strong>, los trenes directos tardan aproximadamente <strong>1 h 30 min–1 h 45 min</strong> y salen más o menos cada hora durante el día. Desde <strong>Viena</strong>, el Railjet de ÖBB tarda aproximadamente <strong>2 h 30 min–2 h 45 min</strong>, también con salidas frecuentes. Ambos servicios llegan a la Hauptbahnhof de Salzburgo, así que no hace falta cambiar. Desde <strong>Praga</strong>, Budapest o Venecia, cuenta con un cambio en Viena, Múnich o Villach.</p>'],
        ['¿Cómo ir de la estación al casco antiguo?', '<ul><li><strong>A pie:</strong> unos 15–25 minutos hasta el casco antiguo, por los jardines de Mirabell y cruzando el río.</li><li><strong>En autobús:</strong> hay autobuses locales de la estación al casco antiguo; consulta el horario en directo.</li><li><strong>En taxi:</strong> un trayecto corto si llevas equipaje.</li></ul>'],
        ['¿Cuál es el mejor momento para ir?', '<ul><li><strong>A primera hora.</strong> El casco antiguo está más tranquilo antes de que lleguen los grupos, y la fortaleza abre pronto.</li><li><strong>Finales de primavera y principios de otoño</strong> tienen un tiempo agradable y menos gente que julio y agosto.</li><li><strong>Diciembre</strong> trae los mercados de Navidad, preciosos pero concurridos; reserva el alojamiento con tiempo.</li></ul>'],
        ['¿Qué ver en un día?', '<ul><li><strong>La fortaleza de Hohensalzburg</strong> — se sube en funicular o por una cuesta empinada a uno de los mayores castillos medievales de Europa.</li><li><strong>Getreidegasse y la casa natal de Mozart</strong> — la principal calle comercial y la casa donde nació Mozart.</li><li><strong>La catedral de Salzburgo y la Residenzplatz</strong> — el corazón barroco del casco antiguo.</li><li><strong>Los jardines de Mirabell</strong> — jardines formales cerca de la estación, también escenario de Sonrisas y lágrimas.</li></ul><p>Para un segundo día, <a href="/destinos/hallstatt/es/">Hallstatt</a> es una excursión clásica en tren y ferry.</p>']
      ],
      closing: 'Ya la has visto. Ahora ve. Salzburgo está en la línea principal Viena–Múnich: reserva tu tren y en media hora desde que llegas estás en el casco antiguo. Todos los operadores, un solo pago seguro.',
      related: 'Rutas relacionadas'
    }
  },
  {
    slug: 'zermatt', photo: 19244970, from: 'geneva', to: 'zermatt', routes: ['geneva-zermatt', 'lucerne-zermatt', 'stmoritz-zermatt'],
    en: {
      badge: 'Car-free Alpine village · Switzerland', h1: 'How to Get to Zermatt by Train', meta: 'By WoW Train · Updated October 2026 · 4 min read',
      title: 'How to Get to Zermatt by Train: from Zürich, Geneva and Lucerne | WoW Train · glosx.app',
      desc: 'How to reach Zermatt by train from Zürich, Geneva and Lucerne: the change at Visp, journey times, the Gornergrat railway and the best time to visit the Matterhorn.',
      keywords: 'Zermatt by train, Zurich to Zermatt train, Geneva to Zermatt train, Visp to Zermatt, Gornergrat railway, Matterhorn by train, Zermatt car free',
      lead: 'A car-free village below the Matterhorn. There is no road you can drive into Zermatt, so the train is not an alternative: it is the way in. The last stretch, up the valley on the Matterhorn Gotthard Bahn, is a scenic ride in its own right.',
      secret: '<strong>The tip worth knowing:</strong> most journeys involve one change at <strong>Visp</strong>, in the Rhône valley. From there the narrow-gauge train climbs to Zermatt in roughly 1h 10m–1h 20m. Cars have to stop at Täsch, so you do not need to bring one.',
      cta: 'View timetables and tickets →', ctaFoot: 'Prefer to compare every rail operator? Check schedules & book →',
      sections: [
        ['What is the route to Zermatt?', '<p>Take a train to <strong>Visp</strong>, then change to the <strong>Matterhorn Gotthard Bahn</strong> to Zermatt. From <strong>Zürich</strong> the whole journey takes roughly <strong>3h 30m–3h 45m</strong>; from <strong>Geneva</strong> roughly <strong>3h 15m–3h 30m</strong>; from <strong>Lucerne</strong> about <strong>four hours</strong> via Bern. Trains from Visp to Zermatt run about every half hour, and the connections are timed, so a single change is usually painless.</p>'],
        ['How to make the connection?', '<ul><li><strong>1.</strong> Board a long-distance train toward Brig and get off at <strong>Visp</strong>.</li><li><strong>2.</strong> Change to the Matterhorn Gotthard Bahn on the platform provided; the connection is usually short.</li><li><strong>3.</strong> Ride up the valley to <strong>Zermatt</strong>; the station is in the village centre.</li></ul>'],
        ['When is the best time to go?', '<ul><li><strong>July to September</strong> is the main hiking season, with the best chance of clear Matterhorn views.</li><li><strong>December to April</strong> is the ski season; book trains and rooms early around holidays.</li><li><strong>Mornings</strong> are usually clearer; the mountain is often in cloud by afternoon.</li></ul>'],
        ['What to do once you are there?', '<ul><li><strong>The Gornergrat railway</strong> — a cogwheel train of roughly 30–35 minutes to a viewpoint opposite the Matterhorn.</li><li><strong>Matterhorn Glacier Paradise</strong> — a cable car to one of the highest viewpoints in Europe.</li><li><strong>The Riffelsee</strong> — the lake where the Matterhorn reflects in the water, reached on foot from the Gornergrat line.</li><li><strong>The Glacier Express</strong> — leaves from Zermatt for St. Moritz, a famously slow and scenic ride of about eight hours.</li></ul>']
      ],
      closing: 'You have seen it. Now go. The key is the change at <strong>Visp</strong>: book your train there and the rest is up the valley. Every operator, one secure checkout.',
      related: 'Related routes'
    },
    es: {
      badge: 'Pueblo alpino sin coches · Suiza', h1: 'Cómo llegar a Zermatt en tren', meta: 'Por WoW Train · Actualizado octubre 2026 · 4 min de lectura',
      title: 'Cómo llegar a Zermatt en tren: desde Zúrich, Ginebra y Lucerna | WoW Train · glosx.app',
      desc: 'Cómo llegar a Zermatt en tren desde Zúrich, Ginebra y Lucerna: el cambio en Visp, la duración del viaje, el tren de Gornergrat y el mejor momento para ver el Cervino.',
      keywords: 'Zermatt en tren, tren Zúrich Zermatt, tren Ginebra Zermatt, Visp Zermatt, tren de Gornergrat, Cervino en tren, Zermatt sin coches',
      lead: 'Un pueblo sin coches bajo el Cervino. No hay carretera por la que se pueda llegar en coche a Zermatt, así que el tren no es una alternativa: es el camino. El último tramo, valle arriba en el Matterhorn Gotthard Bahn, es un viaje pintoresco por derecho propio.',
      secret: '<strong>El dato que conviene saber:</strong> casi todos los viajes incluyen un cambio en <strong>Visp</strong>, en el valle del Ródano. Desde allí, el tren de vía estrecha sube a Zermatt en aproximadamente 1 h 10 min–1 h 20 min. Los coches deben quedarse en Täsch, así que no hace falta llevar uno.',
      cta: 'Ver horarios y billetes →', ctaFoot: '¿Prefieres comparar todos los operadores? Consultar horarios y reservar →',
      sections: [
        ['¿Cuál es la ruta a Zermatt?', '<p>Toma un tren hasta <strong>Visp</strong> y cambia al <strong>Matterhorn Gotthard Bahn</strong> hasta Zermatt. Desde <strong>Zúrich</strong> el viaje completo dura aproximadamente <strong>3 h 30 min–3 h 45 min</strong>; desde <strong>Ginebra</strong> aproximadamente <strong>3 h 15 min–3 h 30 min</strong>; desde <strong>Lucerna</strong> unas <strong>cuatro horas</strong> pasando por Berna. Los trenes de Visp a Zermatt salen más o menos cada media hora y las conexiones están coordinadas, así que un único cambio suele ser sencillo.</p>'],
        ['¿Cómo hacer la conexión?', '<ul><li><strong>1.</strong> Sube a un tren de larga distancia en dirección a Brig y bájate en <strong>Visp</strong>.</li><li><strong>2.</strong> Cambia al Matterhorn Gotthard Bahn en el andén indicado; la conexión suele ser corta.</li><li><strong>3.</strong> Sube por el valle hasta <strong>Zermatt</strong>; la estación está en el centro del pueblo.</li></ul>'],
        ['¿Cuál es el mejor momento para ir?', '<ul><li><strong>De julio a septiembre</strong> es la temporada principal de senderismo, con más probabilidad de ver el Cervino despejado.</li><li><strong>De diciembre a abril</strong> es la temporada de esquí; reserva trenes y habitaciones con tiempo en torno a las vacaciones.</li><li><strong>Las mañanas</strong> suelen estar más despejadas; la montaña suele estar entre nubes por la tarde.</li></ul>'],
        ['¿Qué hacer una vez allí?', '<ul><li><strong>El tren de Gornergrat</strong> — un tren de cremallera de unos 30–35 minutos hasta un mirador frente al Cervino.</li><li><strong>Matterhorn Glacier Paradise</strong> — un teleférico hasta uno de los miradores más altos de Europa.</li><li><strong>El lago Riffelsee</strong> — el lago donde se refleja el Cervino, al que se llega a pie desde la línea de Gornergrat.</li><li><strong>El Glacier Express</strong> — sale de Zermatt hacia St. Moritz, un viaje famoso por lento y pintoresco, de unas ocho horas.</li></ul>']
      ],
      closing: 'Ya lo has visto. Ahora ve. La clave es el cambio en <strong>Visp</strong>: reserva allí tu tren y el resto es valle arriba. Todos los operadores, un solo pago seguro.',
      related: 'Rutas relacionadas'
    }
  },
  {
    slug: 'lucerne', photo: 18429608, from: 'zurich', to: 'lucerne', routes: ['zurich-lucerne', 'paris-lucerne', 'lucerne-bern', 'lucerne-zermatt'],
    en: {
      badge: 'Lake and mountains · Switzerland', h1: 'How to Get to Lucerne by Train', meta: 'By WoW Train · Updated October 2026 · 4 min read',
      title: 'How to Get to Lucerne by Train: from Zürich, Basel and Bern | WoW Train · glosx.app',
      desc: 'How to reach Lucerne by train from Zürich, Basel and Bern: journey times, the station by the lake, the best time to visit and the classic Pilatus and Rigi day trips.',
      keywords: 'Lucerne by train, Zurich to Lucerne train, Basel to Lucerne train, Bern to Lucerne train, Lucerne station, Pilatus by train, Rigi from Lucerne',
      lead: 'A covered wooden bridge, an old town on a lake and mountains on every side. Lucerne is one of the easiest places in Switzerland to reach by train, and the station is right by the water, so you arrive in the middle of it.',
      secret: '<strong>The tip worth knowing:</strong> Lucerne station is next to the lake, and the Chapel Bridge is only a few minutes\' walk away. For the best first view, walk straight out of the station and onto the lakeside promenade.',
      cta: 'View timetables and tickets →', ctaFoot: 'Prefer to compare every rail operator? Check schedules & book →',
      sections: [
        ['What is the fastest way to get to Lucerne?', '<p>From <strong>Zürich</strong>, direct trains take roughly <strong>45–50 minutes</strong> and run about every half hour. From <strong>Basel</strong> and <strong>Bern</strong> the journey takes roughly an hour to an hour and a quarter, with direct trains on most departures. From <strong>Interlaken</strong>, the scenic Luzern–Interlaken Express takes roughly two hours over the Brünig line. From <strong>Paris</strong>, take the TGV to Basel and change to a Lucerne train for roughly five to six hours in total.</p>'],
        ['How to get around once you arrive?', '<ul><li><strong>On foot:</strong> the old town, the Chapel Bridge and the lakefront are all within a few minutes of the station.</li><li><strong>By lake boat:</strong> steamers and boats leave from the pier beside the station.</li><li><strong>By train:</strong> the mountain excursions start from nearby stations and piers.</li></ul>'],
        ['When is the best time to go?', '<ul><li><strong>Late spring to early autumn</strong> for lake cruises and mountain views.</li><li><strong>Early morning</strong> for a quiet Chapel Bridge before the tour groups arrive.</li><li><strong>Check the weather</strong> before a mountain day: Pilatus and Rigi are best on clear days.</li></ul>'],
        ['What to see and do?', '<ul><li><strong>The Chapel Bridge and the Water Tower</strong> — the symbol of Lucerne, a covered wooden bridge across the river.</li><li><strong>The Old Town and the Lion Monument</strong> — frescoed houses and a carving cut into a cliff face.</li><li><strong>Mount Pilatus</strong> — a cogwheel railway and cable car, which can be combined with a boat on the lake.</li><li><strong>Mount Rigi</strong> — reached by a lake boat and a cogwheel train for panoramic views.</li></ul>']
      ],
      closing: 'You have seen it. Now go. Lucerne is a short ride from Zürich, and the lake and the old town are a few minutes from the platform. Every operator, one secure checkout.',
      related: 'Related routes'
    },
    es: {
      badge: 'Lago y montañas · Suiza', h1: 'Cómo llegar a Lucerna en tren', meta: 'Por WoW Train · Actualizado octubre 2026 · 4 min de lectura',
      title: 'Cómo llegar a Lucerna en tren: desde Zúrich, Basilea y Berna | WoW Train · glosx.app',
      desc: 'Cómo llegar a Lucerna en tren desde Zúrich, Basilea y Berna: duración del viaje, la estación junto al lago, el mejor momento para visitarla y las excursiones clásicas al Pilatus y al Rigi.',
      keywords: 'Lucerna en tren, tren Zúrich Lucerna, tren Basilea Lucerna, tren Berna Lucerna, estación de Lucerna, Pilatus en tren, Rigi desde Lucerna',
      lead: 'Un puente cubierto de madera, un casco antiguo junto a un lago y montañas por todas partes. Lucerna es uno de los lugares más fáciles de Suiza para llegar en tren, y la estación está junto al agua, así que llegas justo al centro de todo.',
      secret: '<strong>El dato que conviene saber:</strong> la estación de Lucerna está junto al lago y el Puente de la Capilla queda a solo unos minutos a pie. Para la mejor primera vista, sal de la estación y ve directo al paseo junto al lago.',
      cta: 'Ver horarios y billetes →', ctaFoot: '¿Prefieres comparar todos los operadores? Consultar horarios y reservar →',
      sections: [
        ['¿Cuál es la forma más rápida de llegar a Lucerna?', '<p>Desde <strong>Zúrich</strong>, los trenes directos tardan aproximadamente <strong>45–50 minutos</strong> y salen más o menos cada media hora. Desde <strong>Basilea</strong> y <strong>Berna</strong> el viaje dura aproximadamente entre una hora y una hora y cuarto, con trenes directos en la mayoría de las salidas. Desde <strong>Interlaken</strong>, el pintoresco Luzern–Interlaken Express tarda aproximadamente dos horas por la línea de Brünig. Desde <strong>París</strong>, toma el TGV hasta Basilea y cambia a un tren a Lucerna, unas cinco a seis horas en total.</p>'],
        ['¿Cómo moverse al llegar?', '<ul><li><strong>A pie:</strong> el casco antiguo, el Puente de la Capilla y la orilla del lago están a pocos minutos de la estación.</li><li><strong>En barco por el lago:</strong> los vapores y barcos salen del embarcadero junto a la estación.</li><li><strong>En tren:</strong> las excursiones de montaña parten de estaciones y embarcaderos cercanos.</li></ul>'],
        ['¿Cuál es el mejor momento para ir?', '<ul><li><strong>De finales de primavera a principios de otoño</strong> para los cruceros por el lago y las vistas de montaña.</li><li><strong>A primera hora</strong> para tener el Puente de la Capilla tranquilo antes de que lleguen los grupos.</li><li><strong>Mira el tiempo</strong> antes de un día de montaña: el Pilatus y el Rigi se disfrutan mejor con cielo despejado.</li></ul>'],
        ['¿Qué ver y hacer?', '<ul><li><strong>El Puente de la Capilla y la Torre del Agua</strong> — el símbolo de Lucerna, un puente cubierto de madera sobre el río.</li><li><strong>El casco antiguo y el Monumento al León</strong> — casas con frescos y un relieve tallado en la roca.</li><li><strong>El monte Pilatus</strong> — un tren de cremallera y un teleférico, que se pueden combinar con un barco por el lago.</li><li><strong>El monte Rigi</strong> — se llega en barco por el lago y en tren de cremallera, con vistas panorámicas.</li></ul>']
      ],
      closing: 'Ya la has visto. Ahora ve. Lucerna está a un trayecto corto de Zúrich, y el lago y el casco antiguo quedan a unos minutos del andén. Todos los operadores, un solo pago seguro.',
      related: 'Rutas relacionadas'
    }
  }
];
