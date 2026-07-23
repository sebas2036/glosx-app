const fs = require('fs');
const path = require('path');

// Route data configuration
const routes = [
  { slug: 'amsterdam-berlin', from: 'Amsterdam', to: 'Berlin', country: 'Netherlands-Germany', duration: '6h 30m', operator: 'DB ICE', price: '€29-45', badge: 'Route guide · Netherlands-Germany' },
  { slug: 'amsterdam-brussels', from: 'Amsterdam', to: 'Brussels', country: 'Netherlands-Belgium', duration: '2h 00m', operator: 'Thalys', price: '€25-35', badge: 'Route guide · Netherlands-Belgium' },
  { slug: 'barcelona-girona', from: 'Barcelona', to: 'Girona', country: 'Spain', duration: '1h 30m', operator: 'Renfe', price: '€10-15', badge: 'Route guide · Spain' },
  { slug: 'barcelona-lyon', from: 'Barcelona', to: 'Lyon', country: 'Spain-France', duration: '4h 30m', operator: 'TGV', price: '€35-55', badge: 'Route guide · Spain-France' },
  { slug: 'barcelona-valencia', from: 'Barcelona', to: 'Valencia', country: 'Spain', duration: '3h 00m', operator: 'Renfe AVE', price: '€20-35', badge: 'Route guide · Spain' },
  { slug: 'basel-lauterbrunnen', from: 'Basel', to: 'Lauterbrunnen', country: 'Switzerland', duration: '2h 30m', operator: 'SBB', price: '€35-50', badge: 'Route guide · Switzerland' },
  { slug: 'basel-paris', from: 'Basel', to: 'Paris', country: 'Switzerland-France', duration: '3h 00m', operator: 'TGV Lyria', price: '€40-60', badge: 'Route guide · Switzerland-France' },
  { slug: 'berlin-hamburg', from: 'Berlin', to: 'Hamburg', country: 'Germany', duration: '1h 45m', operator: 'DB ICE', price: '€25-40', badge: 'Route guide · Germany' },
  { slug: 'berlin-prague', from: 'Berlin', to: 'Prague', country: 'Germany-Czech', duration: '4h 30m', operator: 'DB ČD', price: '€30-50', badge: 'Route guide · Germany-Czech' },
  { slug: 'bordeaux-lourdes', from: 'Bordeaux', to: 'Lourdes', country: 'France', duration: '2h 30m', operator: 'SNCF Intercités', price: '€20-35', badge: 'Route guide · France' },
  { slug: 'brno-vienna', from: 'Brno', to: 'Vienna', country: 'Czech-Austria', duration: '1h 45m', operator: 'ÖBB', price: '€15-25', badge: 'Route guide · Czech-Austria' },
  { slug: 'brussels-bruges', from: 'Brussels', to: 'Bruges', country: 'Belgium', duration: '0h 50m', operator: 'SNCB', price: '€10-15', badge: 'Route guide · Belgium' },
  { slug: 'brussels-paris', from: 'Brussels', to: 'Paris', country: 'Belgium-France', duration: '1h 30m', operator: 'Thalys', price: '€35-55', badge: 'Route guide · Belgium-France' },
  { slug: 'budapest-ljubljana', from: 'Budapest', to: 'Ljubljana', country: 'Hungary-Slovenia', duration: '6h 00m', operator: 'MÁV', price: '€30-50', badge: 'Route guide · Hungary-Slovenia' },
  { slug: 'copenhagen-stockholm', from: 'Copenhagen', to: 'Stockholm', country: 'Denmark-Sweden', duration: '5h 00m', operator: 'SJ', price: '€40-60', badge: 'Route guide · Denmark-Sweden' },
  { slug: 'dortmund-munich', from: 'Dortmund', to: 'Munich', country: 'Germany', duration: '5h 30m', operator: 'DB ICE', price: '€35-55', badge: 'Route guide · Germany' },
  { slug: 'florence-pisa', from: 'Florence', to: 'Pisa', country: 'Italy', duration: '1h 00m', operator: 'Trenitalia', price: '€10-15', badge: 'Route guide · Italy' },
  { slug: 'florence-siena', from: 'Florence', to: 'Siena', country: 'Italy', duration: '1h 30m', operator: 'Trenitalia', price: '€10-15', badge: 'Route guide · Italy' },
  { slug: 'florence-venice', from: 'Florence', to: 'Venice', country: 'Italy', duration: '2h 00m', operator: 'Trenitalia', price: '€20-35', badge: 'Route guide · Italy' },
  { slug: 'frankfurt-cologne', from: 'Frankfurt', to: 'Cologne', country: 'Germany', duration: '1h 15m', operator: 'DB ICE', price: '€25-40', badge: 'Route guide · Germany' },
  { slug: 'frankfurt-munich', from: 'Frankfurt', to: 'Munich', country: 'Germany', duration: '3h 30m', operator: 'DB ICE', price: '€30-50', badge: 'Route guide · Germany' },
  { slug: 'frankfurt-paris', from: 'Frankfurt', to: 'Paris', country: 'Germany-France', duration: '4h 00m', operator: 'TGV', price: '€40-60', badge: 'Route guide · Germany-France' },
  { slug: 'geneva-paris', from: 'Geneva', to: 'Paris', country: 'Switzerland-France', duration: '3h 00m', operator: 'TGV Lyria', price: '€40-60', badge: 'Route guide · Switzerland-France' },
  { slug: 'geneva-zermatt', from: 'Geneva', to: 'Zermatt', country: 'Switzerland', duration: '3h 30m', operator: 'SBB', price: '€45-65', badge: 'Route guide · Switzerland' },
  { slug: 'girona-figueres', from: 'Girona', to: 'Figueres', country: 'Spain', duration: '0h 30m', operator: 'Renfe', price: '€5-10', badge: 'Route guide · Spain' },
  { slug: 'interlaken-lauterbrunnen', from: 'Interlaken', to: 'Lauterbrunnen', country: 'Switzerland', duration: '0h 20m', operator: 'BOB', price: '€10-15', badge: 'Route guide · Switzerland' },
  { slug: 'lisbon-porto', from: 'Lisbon', to: 'Porto', country: 'Portugal', duration: '2h 30m', operator: 'CP', price: '€15-25', badge: 'Route guide · Portugal' },
  { slug: 'london-amsterdam', from: 'London', to: 'Amsterdam', country: 'UK-Netherlands', duration: '4h 00m', operator: 'Eurostar', price: '€50-80', badge: 'Route guide · UK-Netherlands' },
  { slug: 'london-brussels', from: 'London', to: 'Brussels', country: 'UK-Belgium', duration: '2h 00m', operator: 'Eurostar', price: '€40-70', badge: 'Route guide · UK-Belgium' },
  { slug: 'london-cambridge', from: 'London', to: 'Cambridge', country: 'UK', duration: '0h 50m', operator: 'Thameslink', price: '€15-25', badge: 'Route guide · UK' },
  { slug: 'london-edinburgh', from: 'London', to: 'Edinburgh', country: 'UK', duration: '4h 30m', operator: 'LNER', price: '€30-60', badge: 'Route guide · UK' },
  { slug: 'london-liverpool', from: 'London', to: 'Liverpool', country: 'UK', duration: '2h 15m', operator: 'Avanti', price: '€20-40', badge: 'Route guide · UK' },
  { slug: 'london-manchester', from: 'London', to: 'Manchester', country: 'UK', duration: '2h 00m', operator: 'Avanti', price: '€20-40', badge: 'Route guide · UK' },
  { slug: 'london-oxford', from: 'London', to: 'Oxford', country: 'UK', duration: '1h 00m', operator: 'GWR', price: '€15-25', badge: 'Route guide · UK' },
  { slug: 'london-paris', from: 'London', to: 'Paris', country: 'UK-France', duration: '2h 30m', operator: 'Eurostar', price: '€50-80', badge: 'Route guide · UK-France' },
  { slug: 'london-york', from: 'London', to: 'York', country: 'UK', duration: '2h 00m', operator: 'LNER', price: '€20-40', badge: 'Route guide · UK' },
  { slug: 'lyon-turin', from: 'Lyon', to: 'Turin', country: 'France-Italy', duration: '4h 00m', operator: 'TGV', price: '€35-55', badge: 'Route guide · France-Italy' },
  { slug: 'madrid-barcelona', from: 'Madrid', to: 'Barcelona', country: 'Spain', duration: '2h 30m', operator: 'Renfe AVE', price: '€25-45', badge: 'Route guide · Spain' },
  { slug: 'madrid-malaga', from: 'Madrid', to: 'Malaga', country: 'Spain', duration: '2h 30m', operator: 'Renfe AVE', price: '€25-45', badge: 'Route guide · Spain' },
  { slug: 'madrid-seville', from: 'Madrid', to: 'Seville', country: 'Spain', duration: '2h 30m', operator: 'Renfe AVE', price: '€25-45', badge: 'Route guide · Spain' },
  { slug: 'madrid-valencia', from: 'Madrid', to: 'Valencia', country: 'Spain', duration: '1h 40m', operator: 'Renfe AVE', price: '€20-35', badge: 'Route guide · Spain' },
  { slug: 'madrid-zaragoza', from: 'Madrid', to: 'Zaragoza', country: 'Spain', duration: '1h 30m', operator: 'Renfe AVE', price: '€15-25', badge: 'Route guide · Spain' },
  { slug: 'marseille-miramas', from: 'Marseille', to: 'Miramas', country: 'France', duration: '0h 45m', operator: 'SNCF TER', price: '€10-15', badge: 'Route guide · France' },
  { slug: 'milan-florence', from: 'Milan', to: 'Florence', country: 'Italy', duration: '1h 45m', operator: 'Trenitalia', price: '€20-35', badge: 'Route guide · Italy' },
  { slug: 'milan-rome', from: 'Milan', to: 'Rome', country: 'Italy', duration: '3h 00m', operator: 'Trenitalia', price: '€30-50', badge: 'Route guide · Italy' },
  { slug: 'milan-zurich', from: 'Milan', to: 'Zurich', country: 'Italy-Switzerland', duration: '3h 30m', operator: 'SBB', price: '€35-55', badge: 'Route guide · Italy-Switzerland' },
  { slug: 'montreux-interlaken', from: 'Montreux', to: 'Interlaken', country: 'Switzerland', duration: '2h 00m', operator: 'SBB', price: '€25-40', badge: 'Route guide · Switzerland' },
  { slug: 'munich-berlin', from: 'Munich', to: 'Berlin', country: 'Germany', duration: '4h 00m', operator: 'DB ICE', price: '€35-55', badge: 'Route guide · Germany' },
  { slug: 'munich-prague', from: 'Munich', to: 'Prague', country: 'Germany-Czech', duration: '4h 00m', operator: 'DB ČD', price: '€30-50', badge: 'Route guide · Germany-Czech' },
  { slug: 'munich-venice', from: 'Munich', to: 'Venice', country: 'Germany-Italy', duration: '6h 00m', operator: 'ÖBB', price: '€40-60', badge: 'Route guide · Germany-Italy' },
  { slug: 'munich-vienna', from: 'Munich', to: 'Vienna', country: 'Germany-Austria', duration: '4h 30m', operator: 'Railjet', price: '€35-55', badge: 'Route guide · Germany-Austria' },
  { slug: 'naples-salerno', from: 'Naples', to: 'Salerno', country: 'Italy', duration: '0h 40m', operator: 'Trenitalia', price: '€5-10', badge: 'Route guide · Italy' },
  { slug: 'naples-sorrento', from: 'Naples', to: 'Sorrento', country: 'Italy', duration: '1h 00m', operator: 'Circumvesuviana', price: '€5-10', badge: 'Route guide · Italy' },
  { slug: 'nice-monaco', from: 'Nice', to: 'Monaco', country: 'France', duration: '0h 20m', operator: 'SNCF TER', price: '€5-10', badge: 'Route guide · France' },
  { slug: 'oslo-bergen', from: 'Oslo', to: 'Bergen', country: 'Norway', duration: '7h 00m', operator: 'Vy', price: '€50-80', badge: 'Route guide · Norway' },
  { slug: 'paris-amsterdam', from: 'Paris', to: 'Amsterdam', country: 'France-Netherlands', duration: '3h 30m', operator: 'Thalys', price: '€35-55', badge: 'Route guide · France-Netherlands' },
  { slug: 'paris-barcelona', from: 'Paris', to: 'Barcelona', country: 'France-Spain', duration: '6h 30m', operator: 'TGV', price: '€50-80', badge: 'Route guide · France-Spain' },
  { slug: 'paris-berlin', from: 'Paris', to: 'Berlin', country: 'France-Germany', duration: '8h 00m', operator: 'TGV', price: '€60-90', badge: 'Route guide · France-Germany' },
  { slug: 'paris-bordeaux', from: 'Paris', to: 'Bordeaux', country: 'France', duration: '2h 00m', operator: 'TGV', price: '€30-50', badge: 'Route guide · France' },
  { slug: 'paris-bruges', from: 'Paris', to: 'Bruges', country: 'France-Belgium', duration: '2h 30m', operator: 'TGV', price: '€35-55', badge: 'Route guide · France-Belgium' },
  { slug: 'paris-london', from: 'Paris', to: 'London', country: 'France-UK', duration: '2h 30m', operator: 'Eurostar', price: '€50-80', badge: 'Route guide · France-UK' },
  { slug: 'paris-lourdes', from: 'Paris', to: 'Lourdes', country: 'France', duration: '6h 30m', operator: 'SNCF Intercités', price: '€30-50', badge: 'Route guide · France' },
  { slug: 'paris-lucerne', from: 'Paris', to: 'Lucerne', country: 'France-Switzerland', duration: '4h 30m', operator: 'TGV Lyria', price: '€50-75', badge: 'Route guide · France-Switzerland' },
  { slug: 'paris-lyon', from: 'Paris', to: 'Lyon', country: 'France', duration: '2h 00m', operator: 'TGV', price: '€30-50', badge: 'Route guide · France' },
  { slug: 'paris-milan', from: 'Paris', to: 'Milan', country: 'France-Italy', duration: '7h 00m', operator: 'TGV', price: '€60-90', badge: 'Route guide · France-Italy' },
  { slug: 'paris-nice', from: 'Paris', to: 'Nice', country: 'France', duration: '5h 30m', operator: 'TGV', price: '€40-65', badge: 'Route guide · France' },
  { slug: 'paris-rome', from: 'Paris', to: 'Rome', country: 'France-Italy', duration: '11h 00m', operator: 'TGV', price: '€80-120', badge: 'Route guide · France-Italy' },
  { slug: 'paris-toulouse', from: 'Paris', to: 'Toulouse', country: 'France', duration: '4h 20m', operator: 'SNCF TGV', price: '€25-40', badge: 'Route guide · France' },
  { slug: 'paris-venice', from: 'Paris', to: 'Venice', country: 'France-Italy', duration: '8h 00m', operator: 'TGV', price: '€70-100', badge: 'Route guide · France-Italy' },
  { slug: 'paris-zurich', from: 'Paris', to: 'Zurich', country: 'France-Switzerland', duration: '4h 30m', operator: 'TGV Lyria', price: '€50-75', badge: 'Route guide · France-Switzerland' },
  { slug: 'prague-brno', from: 'Prague', to: 'Brno', country: 'Czech', duration: '2h 30m', operator: 'ČD', price: '€15-25', badge: 'Route guide · Czech' },
  { slug: 'prague-budapest', from: 'Prague', to: 'Budapest', country: 'Czech-Hungary', duration: '4h 30m', operator: 'ČD', price: '€25-40', badge: 'Route guide · Czech-Hungary' },
  { slug: 'prague-vienna', from: 'Prague', to: 'Vienna', country: 'Czech-Austria', duration: '4h 00m', operator: 'Railjet', price: '€25-40', badge: 'Route guide · Czech-Austria' },
  { slug: 'rome-florence', from: 'Rome', to: 'Florence', country: 'Italy', duration: '1h 30m', operator: 'Trenitalia', price: '€20-35', badge: 'Route guide · Italy' },
  { slug: 'rome-naples', from: 'Rome', to: 'Naples', country: 'Italy', duration: '1h 10m', operator: 'Trenitalia', price: '€15-25', badge: 'Route guide · Italy' },
  { slug: 'rome-venice', from: 'Rome', to: 'Venice', country: 'Italy', duration: '4h 00m', operator: 'Trenitalia', price: '€30-50', badge: 'Route guide · Italy' },
  { slug: 'stockholm-oslo', from: 'Stockholm', to: 'Oslo', country: 'Sweden-Norway', duration: '6h 00m', operator: 'SJ', price: '€40-60', badge: 'Route guide · Sweden-Norway' },
  { slug: 'toulouse-lourdes', from: 'Toulouse', to: 'Lourdes', country: 'France', duration: '2h 00m', operator: 'SNCF Intercités', price: '€15-25', badge: 'Route guide · France' },
  { slug: 'turin-milan', from: 'Turin', to: 'Milan', country: 'Italy', duration: '1h 30m', operator: 'Trenitalia', price: '€15-25', badge: 'Route guide · Italy' },
  { slug: 'venice-milan', from: 'Venice', to: 'Milan', country: 'Italy', duration: '2h 30m', operator: 'Trenitalia', price: '€20-35', badge: 'Route guide · Italy' },
  { slug: 'vienna-budapest', from: 'Vienna', to: 'Budapest', country: 'Austria-Hungary', duration: '2h 30m', operator: 'Railjet', price: '€20-35', badge: 'Route guide · Austria-Hungary' },
  { slug: 'vienna-krems', from: 'Vienna', to: 'Krems', country: 'Austria', duration: '1h 00m', operator: 'ÖBB', price: '€10-15', badge: 'Route guide · Austria' },
  { slug: 'vienna-prague', from: 'Vienna', to: 'Prague', country: 'Austria-Czech', duration: '4h 00m', operator: 'Railjet', price: '€25-40', badge: 'Route guide · Austria-Czech' },
  { slug: 'vienna-salzburg', from: 'Vienna', to: 'Salzburg', country: 'Austria', duration: '2h 30m', operator: 'Railjet', price: '€20-35', badge: 'Route guide · Austria' },
  { slug: 'zaragoza-barcelona', from: 'Zaragoza', to: 'Barcelona', country: 'Spain', duration: '1h 30m', operator: 'Renfe AVE', price: '€15-25', badge: 'Route guide · Spain' },
  { slug: 'zurich-lucerne', from: 'Zurich', to: 'Lucerne', country: 'Switzerland', duration: '0h 50m', operator: 'SBB', price: '€15-25', badge: 'Route guide · Switzerland' },
  { slug: 'zurich-milan', from: 'Zurich', to: 'Milan', country: 'Switzerland-Italy', duration: '3h 30m', operator: 'SBB', price: '€35-55', badge: 'Route guide · Switzerland-Italy' }
];

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
    backText: '← All articles',
    mainTitle: '{{from}} to {{to}} by Train',
    metaText: 'By WoW Train · Updated July 2026 · 4 min read',
    leadText: '{{operator}} links {{from}} to {{to}} in around {{duration}}, with comfortable services running through the {{country}} countryside.',
    klookTitle: 'Book your train ticket on Klook',
    klookSubtitle: 'Compare times & prices · Instant confirmation · Free cancellation on select fares',
    checkSchedulesText: 'Check schedules & book →',
    opensNewTabText: 'Opens in a new tab — come back here anytime.',
    howLongTitle: 'How long does it take?',
    howLongText: 'The fastest trains take around {{duration}}, with several departures a day. Check the live schedule for your date.',
    whoRunsTitle: 'Who runs the route?',
    whoRunsText: 'The route is run by {{operator}}. Comparing the day\'s departures in one search finds the best time and fare.',
    priceTitle: '{{from}} to {{to}} train price (2026)',
    priceText: 'Advance fares start from around {{price}}, rising as the date approaches.',
    bestFareTitle: 'How to get the best fare',
    bestFareList: [
      '<strong>Book early.</strong> The cheapest saver fares sell out first — booking ahead can be dramatically cheaper than buying on the day.',
      '<strong>Travel off-peak.</strong> Mid-morning and mid-week departures tend to be quieter and cheaper.',
      '<strong>Consider first class</strong> — on many routes the upgrade is modest and very comfortable.',
      '<strong>Compare in one place</strong> to see every departure at a glance.'
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
    transferLink: '🚕 Book private transfer in {{to}} →'
  },
  es: {
    titleTemplate: (from, to) => `Tren ${from} a ${to} (2026) | Horarios y Billetes Baratos - WoW Train`,
    descriptionTemplate: (from, to) => `Encuentra las tarifas de tren más baratas, horarios oficiales y comparaciones de operadores para ${from} a ${to}. Reserva de forma segura en tu moneda.`,
    ogTitleTemplate: (from, to) => `${from} a ${to} en Tren: Guía 2026`,
    ogDescriptionTemplate: (from, to) => `${from} → ${to} en tren — ruta, estaciones, operadores y cómo reservarlo.`,
    twitterTitleTemplate: (from, to) => `${from} a ${to} en Tren: Guía 2026`,
    twitterDescriptionTemplate: (from, to) => `${from} → ${to} en tren — ruta, estaciones, operadores y cómo reservarlo.`,
    langSwitch: '<a href="/rutas/{{routeSlug}}/" class="lang">EN</a>',
    backText: '← Todos los artículos',
    mainTitle: 'Tren de {{from}} a {{to}}',
    metaText: 'Por WoW Train · Actualizado julio 2026 · 4 min de lectura',
    leadText: '{{operator}} conecta {{from}} con {{to}} en alrededor de {{duration}}, con servicios cómodos que recorren el campo de {{country}}.',
    klookTitle: 'Reserva tu billete de tren en Klook',
    klookSubtitle: 'Compara horarios y precios · Confirmación instantánea · Cancelación gratuita en tarifas seleccionadas',
    checkSchedulesText: 'Ver horarios y reservar →',
    opensNewTabText: 'Se abre en una nueva pestaña — vuelve aquí cuando quieras.',
    howLongTitle: '¿Cuánto tiempo tarda?',
    howLongText: 'Los trenes más rápidos tardan alrededor de {{duration}}, con varias salidas al día. Consulta el horario en vivo para tu fecha.',
    whoRunsTitle: '¿Quién opera la ruta?',
    whoRunsText: 'La ruta es operada por {{operator}}. Comparando las salidas del día en una sola búsqueda encuentras el mejor horario y tarifa.',
    priceTitle: 'Precio del tren {{from}} a {{to}} (2026)',
    priceText: 'Las tarifas anticipadas comienzan desde {{price}}, aumentando a medida que se acerca la fecha.',
    bestFareTitle: 'Cómo conseguir la mejor tarifa',
    bestFareList: [
      '<strong>Reserva con antelación.</strong> Las tarifas más baratas se agotan primero — reservar con anticipación puede ser mucho más barato que comprar el mismo día.',
      '<strong>Viaja fuera de horas punta.</strong> Las salidas de media mañana y mediados de semana tienden a ser más tranquilas y baratas.',
      '<strong>Considera primera clase</strong> — en muchas rutas la actualización es modesta y muy cómoda.',
      '<strong>Compara en un solo lugar</strong> para ver cada salida de un vistazo.'
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
    transferLink: '🚕 Reservar traslado privado en {{to}} →'
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
      <a href="https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=${seg.from.toLowerCase()}&to=${seg.to.toLowerCase()}" 
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
  const hotels = [
    {
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
        <a href="https://voxa-production-dc15.up.railway.app/affiliate/klook-transfer?city=${route.to.toLowerCase()}" 
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
        <th style="padding:8px 12px;color:#a78bfa;font-weight:700;">Operator</th>
        <th style="padding:8px 12px;color:#a78bfa;font-weight:700;">From</th>
        <th style="padding:8px 12px;color:#a78bfa;font-weight:700;">Journey time</th>
        <th style="padding:8px 12px;color:#a78bfa;font-weight:700;">Frequency</th>
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
    <p style="font-size:13px;color:#8888aa;margin-bottom:16px;">Prices are indicative advance fares. Check live availability for your exact date.</p>
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

// Generate related routes
function generateRelatedRoutes(route) {
  const related = routes.slice(0, 4).filter(r => r.slug !== route.slug);
  return related.map(r => `
    <a href="/rutas/${r.slug}/" class="related-link">${r.from} to ${r.to}</a>
  `).join('');
}

// Replace template variables
function replaceTemplate(template, route, lang) {
  const langContent = content[lang];
  const replacements = {
    '{{lang}}': lang,
    '{{routeSlug}}': route.slug,
    '{{title}}': langContent.titleTemplate(route.from, route.to),
    '{{description}}': langContent.descriptionTemplate(route.from, route.to),
    '{{ogTitle}}': langContent.ogTitleTemplate(route.from, route.to),
    '{{ogDescription}}': langContent.ogDescriptionTemplate(route.from, route.to),
    '{{twitterTitle}}': langContent.twitterTitleTemplate(route.from, route.to),
    '{{twitterDescription}}': langContent.twitterDescriptionTemplate(route.from, route.to),
    '{{langSwitch}}': langContent.langSwitch.replace('{{routeSlug}}', route.slug),
    '{{backText}}': langContent.backText,
    '{{badge}}': route.badge,
    '{{mainTitle}}': langContent.mainTitle.replace('{{from}}', route.from).replace('{{to}}', route.to),
    '{{metaText}}': langContent.metaText,
    '{{leadText}}': langContent.leadText.replace('{{operator}}', route.operator).replace('{{from}}', route.from).replace('{{to}}', route.to).replace('{{duration}}', route.duration).replace('{{country}}', route.country),
    '{{heroImage}}': 'https://images.pexels.com/photos/30753262/pexels-photo-30753262.jpeg?auto=compress&cs=tinysrgb&w=1600',
    '{{klookTitle}}': langContent.klookTitle,
    '{{klookSubtitle}}': langContent.klookSubtitle,
    '{{klookTrainUrl}}': `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=${route.from.toLowerCase()}&to=${route.to.toLowerCase()}`,
    '{{trainSegments}}': generateTrainSegments(route, lang),
    '{{hotelCards}}': generateHotelCards(route, lang),
    '{{howLongTitle}}': langContent.howLongTitle,
    '{{howLongText}}': langContent.howLongText.replace('{{duration}}', route.duration),
    '{{whoRunsTitle}}': langContent.whoRunsTitle,
    '{{whoRunsText}}': langContent.whoRunsText.replace('{{operator}}', route.operator),
    '{{priceTitle}}': langContent.priceTitle.replace('{{from}}', route.from).replace('{{to}}', route.to),
    '{{priceText}}': langContent.priceText.replace('{{price}}', route.price),
    '{{priceTable}}': generatePriceTable(route, lang),
    '{{bestFareTitle}}': langContent.bestFareTitle,
    '{{bestFareList}}': langContent.bestFareList.join('\n      '),
    '{{readyText}}': langContent.readyText.replace('{{from}}', route.from).replace('{{to}}', route.to),
    '{{compareText}}': langContent.compareText,
    '{{checkSchedulesText}}': langContent.checkSchedulesText,
    '{{opensNewTabText}}': langContent.opensNewTabText,
    '{{photos}}': generatePhotos(route),
    '{{moreRoutesTitle}}': langContent.moreRoutesTitle,
    '{{relatedRoutes}}': generateRelatedRoutes(route)
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

routes.forEach(route => {
  // Generate English version
  const enContent = replaceTemplate(template, route, 'en');
  const enDir = path.join(outputDir, route.slug);
  const enFile = path.join(enDir, 'index.html');
  
  if (!fs.existsSync(enDir)) {
    fs.mkdirSync(enDir, { recursive: true });
  }
  fs.writeFileSync(enFile, enContent);
  
  // Generate Spanish version
  const esContent = replaceTemplate(template, route, 'es');
  const esDir = path.join(enDir, 'es');
  const esFile = path.join(esDir, 'index.html');
  
  if (!fs.existsSync(esDir)) {
    fs.mkdirSync(esDir, { recursive: true });
  }
  fs.writeFileSync(esFile, esContent);
  
  console.log(`Generated ${route.slug} (EN & ES)`);
});

console.log('All routes generated successfully!');
