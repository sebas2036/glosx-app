/**
 * Contenido ampliado (inglés) para las rutas con más impresiones en Search Console (plan de posición, 17-oct-2026).
 * Cada ruta lleva: estaciones reales, trenes y frecuencia, tipos de billete, cuándo viajar, qué hacer al llegar,
 * alternativas y enlaces a rutas hermanas. Solo hechos estables y verificables; lo que cambia (horarios exactos,
 * tarifas) se presenta como orientativo y se remite a la búsqueda en vivo.
 * Uso: generate-routes.js llama a render(slug, lang); devuelve '' si no hay contenido para esa ruta/idioma.
 */
const SIBLINGS_LONDON = [
  ['london-liverpool', 'London to Liverpool'], ['london-oxford', 'London to Oxford'], ['london-cambridge', 'London to Cambridge'],
  ['london-york', 'London to York'], ['london-edinburgh', 'London to Edinburgh'], ['london-amsterdam', 'London to Amsterdam'],
  ['london-brussels', 'London to Brussels'], ['london-manchester', 'London to Manchester'], ['london-paris', 'London to Paris']
];

const DEEP = {
  'london-liverpool': {
    stations: [
      '<strong>London Euston</strong> is the London terminus for the West Coast Main Line. It connects with the Northern and Victoria lines of the Underground, and King\'s Cross St Pancras is roughly a 15–20 minute walk away.',
      '<strong>Liverpool Lime Street</strong> sits in the city centre, opposite St George\'s Hall, with Merseyrail services underneath. The waterfront and Albert Dock are about a 20–25 minute walk, or a short bus or taxi ride.'
    ],
    times: 'The fastest services take roughly 2h 10m–2h 30m, running at around hourly intervals or better through the day, with extra trains in the peaks. Not every train calls at the same stations: common intermediate calls include Milton Keynes Central, Crewe or Runcorn and Liverpool South Parkway, so a train with fewer stops is usually the quickest. Always check the departure you pick, because journey times vary by a few minutes between services.',
    ticketsIntro: 'Avanti West Coast runs the direct trains, so the fare you pay depends on the ticket type rather than on choosing an operator:',
    tickets: [
      ['Advance', 'One specific train, no changes (usually)', 'Cheapest. Indicative single fares are often in the £20s–£40s when booked early, and they sell out first.'],
      ['Off-Peak', 'Any off-peak train on the day', 'Mid-range; good value if you can avoid the morning peak.'],
      ['Anytime', 'Any train, any time', 'Most flexible and the most expensive; single fares can exceed £100.']
    ],
    ticketTips: [
      'A <strong>Railcard</strong> (16–25, 26–30, Two Together, Senior, Family &amp; Friends) usually takes about a third off most fares, including many Advance tickets.',
      'Book as soon as the fares are released for your date. The cheapest Advance tickets are limited and rise in price as the train fills.',
      'Compare the same morning departure on different days: moving a trip from Friday to Tuesday often saves more than any other trick.'
    ],
    when: 'Avoid Friday afternoons, Sunday evenings and match days at Anfield or Goodison, when trains and fares are at their busiest. Mid-morning departures outside school holidays are typically both cheaper and quieter. If you need to work on board, ask for a seat at a table; the line has plug sockets and Wi-Fi on most trains.',
    arrivalIntro: 'A return trip takes over four and a half hours on the train, so a day trip is possible but tight. An overnight stay is much more comfortable. Highlights within easy reach of Lime Street:',
    arrival: [
      '<strong>Albert Dock and Pier Head</strong> — the restored dockland, the Three Graces on the waterfront, museums and the Beatles Story.',
      '<strong>Liverpool Cathedral and the Metropolitan Cathedral</strong> — two very different cathedrals a short walk from each other.',
      '<strong>The Cavern Quarter</strong> — Mathew Street and the music venues linked to the city\'s Beatles history.',
      '<strong>Baltic Triangle and Georgian Quarter</strong> — independent cafés, street art and some of the city\'s most pleasant streets.'
    ],
    alt: [
      '<strong>Coach</strong> — services from London Victoria take around five to six hours, and are cheaper but much slower.',
      '<strong>Car</strong> — roughly four to five hours depending on traffic on the M1 and M6, plus city-centre parking costs.',
      '<strong>Flying</strong> — not practical for this pair once airport transfers and security are added; the train is city centre to city centre.'
    ]
  },
  'london-oxford': {
    stations: [
      '<strong>London Paddington</strong> (Great Western Railway) and <strong>London Marylebone</strong> (Chiltern Railways) are the two main departure points. Paddington is on the Bakerloo, Circle, District, Hammersmith &amp; City and Elizabeth lines.',
      '<strong>Oxford station</strong> is on the western edge of the centre. It is roughly a 10–15 minute walk to the main sights, with frequent buses and taxis outside.'
    ],
    times: 'GWR trains from Paddington are the faster option, taking roughly an hour on a fast service and running several times an hour. Chiltern trains from Marylebone take a little longer (roughly an hour and a quarter) but call at High Wycombe and Bicester Village, which is useful if you are heading for the shopping outlet. A few services are slower stopping trains, so check the journey time shown for the departure you choose.',
    ticketsIntro: 'This is a short, very frequent route, so most passengers buy Off-Peak or Anytime tickets rather than Advance fares:',
    tickets: [
      ['Advance', 'One specific train', 'Limited availability on a short route; check if one is offered for your date.'],
      ['Off-Peak', 'Off-peak trains on the day', 'The usual choice for day trips; good value outside the morning peak.'],
      ['Anytime', 'Any train', 'Flexible, but costs noticeably more than Off-Peak.']
    ],
    ticketTips: [
      'A <strong>Railcard</strong> is worth checking even for one trip, because it applies to most Off-Peak fares.',
      'A day return can be better value than two singles; compare both when you search.',
      'Chiltern from Marylebone is often a little cheaper than GWR from Paddington; compare them on the same date.'
    ],
    when: 'Weekday mornings into Oxford are busy with commuters, and summer weekends and graduation season are crowded in the city. Visiting on a weekday outside term-time peaks gives quieter colleges and easier tables at lunch.',
    arrivalIntro: 'A day in Oxford is easy from London. Within walking distance of the station:',
    arrival: [
      '<strong>The Bodleian Library and Radcliffe Camera</strong> — the university\'s historic heart; some interiors are open only on guided tours.',
      '<strong>Christ Church</strong> and the other colleges — opening hours vary during term and exam periods, so check before you go.',
      '<strong>The Ashmolean Museum</strong> — art and archaeology, free to enter.',
      '<strong>Punting on the Cherwell or the Thames</strong> — the classic way to see the colleges from the water in good weather.'
    ],
    alt: [
      '<strong>Express coach</strong> — services such as the Oxford Tube and X90 run from London Victoria and other stops; slower than the train, usually well over an hour and a half.',
      '<strong>Car</strong> — about an hour and a half depending on traffic, plus limited and expensive parking in the centre; park-and-ride is better.'
    ]
  },
  'london-cambridge': {
    stations: [
      '<strong>London King\'s Cross</strong> (fastest) and <strong>London Liverpool Street</strong> are the two main departure stations. King\'s Cross has Great Northern and Thameslink services; Liverpool Street is served by Greater Anglia.',
      '<strong>Cambridge station</strong> is about 2 km (1.5 miles) from the centre. Allow roughly 20–25 minutes on foot, or take a bus, a taxi or a bike from the station.'
    ],
    times: 'The fastest Great Northern trains from King\'s Cross take a little under an hour. Thameslink services are slower, with more stops, and Greater Anglia trains from Liverpool Street usually take around an hour and a quarter. Trains run several times an hour through the day, so you rarely need to plan around a single departure.',
    ticketsIntro: 'There is no single "best" operator here; the fare depends on the station and the time of day:',
    tickets: [
      ['Advance', 'One specific train', 'Occasionally available and cheapest; not offered on every service.'],
      ['Off-Peak', 'Off-peak trains on the day', 'Typical choice for day trips; avoid the commuter peaks.'],
      ['Anytime', 'Any train', 'Flexible and the most expensive.']
    ],
    ticketTips: [
      'Compare <strong>King\'s Cross</strong> and <strong>Liverpool Street</strong> on the same day; one is often cheaper depending on the time.',
      'A <strong>Railcard</strong> reduces most Off-Peak fares by around a third.',
      'If you are staying near Tottenham Hale or Stansted, the Greater Anglia line can be more convenient than going into central London first.'
    ],
    when: 'Weekday mornings in and evenings out are busy with commuters. Cambridge is quietest outside term time and busiest on summer weekends and during graduation season, so book popular activities (punting, King\'s College Chapel) ahead.',
    arrivalIntro: 'Cambridge is compact and easy to explore on foot or by bike. Highlights:',
    arrival: [
      '<strong>King\'s College Chapel</strong> — one of the great Gothic buildings in England; visiting hours change during term.',
      '<strong>The Backs and the River Cam</strong> — lawns and bridges behind the colleges, best seen from a punt or on foot.',
      '<strong>The Fitzwilliam Museum</strong> — free to enter, with art and antiquities.',
      '<strong>The Market Square and Trinity Street</strong> — good places for lunch before you head back.'
    ],
    alt: [
      '<strong>Coach</strong> — services from London run to Cambridge in roughly two hours and cost less, but are subject to road traffic.',
      '<strong>Car</strong> — about an hour and a half; Cambridge has limited central parking, and park-and-ride sites on the edge are the easier option.'
    ]
  },
  'london-york': {
    stations: [
      '<strong>London King\'s Cross</strong> is the departure point for LNER trains. It has Underground connections (Piccadilly, Northern, Victoria, Circle, Metropolitan and Hammersmith &amp; City lines) and sits next door to St Pancras International.',
      '<strong>York station</strong> is next to the medieval city walls. York Minster is roughly a 10–15 minute walk, and the Shambles about the same. The National Railway Museum is right beside the station.'
    ],
    times: 'The fastest LNER trains take around 1h 50m–2h, and there are typically around two a hour through the day, so you can usually travel at the time that suits you. Some services are slower because they call at more stations. Other open-access operators also serve York on the East Coast Main Line, so compare departures rather than assuming one operator.',
    ticketsIntro: 'The cheapest way to travel is nearly always to book an Advance ticket for a specific train:',
    tickets: [
      ['Advance', 'One specific train', 'Cheapest. Indicative single fares are often in the £20s–£40s when booked early.'],
      ['Off-Peak', 'Off-peak trains on the day', 'Mid-range; a sensible option for day trips outside the morning peak.'],
      ['Anytime', 'Any train', 'Most flexible and the most expensive; can reach well over £100 one way.']
    ],
    ticketTips: [
      'Book as soon as fares are released for your date; the lowest Advance tickets sell out and then rise.',
      'A <strong>Railcard</strong> normally takes about a third off, and many Advance fares as well.',
      'Check seat reservations on busy Friday and Sunday trains if you are travelling with luggage.'
    ],
    when: 'Friday afternoons and Sunday evenings are the most expensive and crowded. A midweek departure outside school holidays is typically both cheaper and quieter. York is busiest at weekends and in the Christmas market season.',
    arrivalIntro: 'York is small enough for a full day trip from London, though an overnight stay makes it far more relaxed. Highlights:',
    arrival: [
      '<strong>York Minster</strong> — one of the largest Gothic cathedrals in northern Europe.',
      '<strong>The Shambles and the city walls</strong> — medieval streets and a walkable wall circuit.',
      '<strong>The National Railway Museum</strong> — free to enter and handy if you are arriving by rail.',
      '<strong>Jorvik Viking Centre and the riverside</strong> — good for families and for an easy afternoon walk.'
    ],
    alt: [
      '<strong>Coach</strong> — services take roughly five to six hours and are cheaper but much slower than the train.',
      '<strong>Car</strong> — about four to five hours depending on traffic on the A1(M); parking in York is limited, so park-and-ride is better.'
    ]
  },
  'london-edinburgh': {
    stations: [
      '<strong>London King\'s Cross</strong> is the departure point for LNER and for open-access operators on the East Coast Main Line. The Caledonian Sleeper leaves from Euston instead.',
      '<strong>Edinburgh Waverley</strong> sits in the middle of the city, below the Old Town. The Royal Mile and the castle are within about a 10–15 minute walk, uphill from the station.'
    ],
    times: 'The fastest day trains take roughly 4h 20m–4h 30m, with services typically running at least hourly. The ride runs along the North Sea coast in the north, past Berwick-upon-Tweed and the Royal Border Bridge, which is one of the best stretches of the journey. If you want to arrive in the morning, the Caledonian Sleeper from Euston gets you to Edinburgh overnight, in roughly seven to eight hours, with seats and cabins.',
    ticketsIntro: 'Both LNER and the open-access operator Lumo run direct trains to Edinburgh, so it is worth comparing them on the same date:',
    tickets: [
      ['Advance (LNER)', 'One specific train', 'Cheapest LNER fare; indicative single fares often start around £30–£60 when booked well ahead.'],
      ['Lumo', 'One specific train', 'Budget operator; fares can undercut LNER on some dates, with fewer departures and different luggage and seat rules.'],
      ['Off-Peak / Anytime', 'Flexible tickets', 'Considerably more expensive; Anytime singles can exceed £150.']
    ],
    ticketTips: [
      'Book as soon as the fares open for your date. Advance fares for Friday and Sunday trains sell out first.',
      'A <strong>Railcard</strong> (including Two Together and Senior) takes about a third off many fares.',
      'Compare the same departure on LNER and Lumo; the cheaper operator changes by date.'
    ],
    when: 'Festival season in August, Hogmanay and rugby weekends are the most expensive. Outside those periods, a midweek morning departure is usually cheapest. Sit on the right-hand side going north to see the coast near Berwick.',
    arrivalIntro: 'For a first visit allow at least a weekend. Within walking distance of Waverley:',
    arrival: [
      '<strong>Edinburgh Castle and the Royal Mile</strong> — the historic spine of the Old Town.',
      '<strong>Arthur\'s Seat and Holyrood Park</strong> — a short climb with wide views over the city.',
      '<strong>Calton Hill and Princes Street Gardens</strong> — easy viewpoints close to the station.',
      '<strong>The Royal Mile museums and the National Museum of Scotland</strong> — good wet-weather options; the National Museum is free to enter.'
    ],
    alt: [
      '<strong>Flying</strong> — a London–Edinburgh flight is under about 1h 30m in the air, but check-in, security and transfers close the gap; compare door-to-door.',
      '<strong>Coach</strong> — services take roughly nine to ten hours; much cheaper but much slower.',
      '<strong>Car</strong> — roughly seven to eight hours without stops, and an expensive and tiring drive for most visitors.'
    ]
  },
  'london-amsterdam': {
    stations: [
      '<strong>London St Pancras International</strong> is the Eurostar terminal. It sits next to King\'s Cross and connects to six Underground lines. Border and security checks are completed before you board.',
      '<strong>Amsterdam Centraal</strong> is in the city centre, a short walk from Damrak and the main canals; trams and the metro leave from the station.'
    ],
    times: 'The direct Eurostar takes roughly 3h 50m–4h 15m, with stops in Brussels and Rotterdam. Because passport and security checks happen at St Pancras, you need to arrive in good time. Eurostar\'s usual guidance is to arrive around 90 minutes before departure. This is one of the longest Eurostar journeys, so a seat by the window and a power socket are worth reserving.',
    ticketsIntro: 'Eurostar sells its cheapest tickets for a specific train as soon as it opens for booking. The main fare types are:',
    tickets: [
      ['Standard (cheapest)', 'One specific train, limited changes', 'Indicative single fares often start around £50–£80 when booked months ahead.'],
      ['Standard Premier / Plus', 'More flexibility and extras', 'Mid-range; changes allowed, with lounge access or meals on higher tiers.'],
      ['Business Premier', 'Fully flexible', 'The most expensive; includes lounge access and onboard food.']
    ],
    ticketTips: [
      'Tickets are released many months ahead, and the cheapest seats on peak days sell out first.',
      'Eurostar is sold with a luggage allowance of two large bags plus hand luggage, so it is easier than flying with a checked bag.',
      'Check the booking page for youth or group fares, which can lower the price on some departures.'
    ],
    when: 'Friday evening, Sunday afternoon and school holidays are the most expensive and busiest. A weekday morning departure outside the holiday periods is typically both cheaper and quieter. Allow extra time at St Pancras on busy days because the border queue can be long.',
    arrivalIntro: 'Amsterdam is small enough that most visitors can walk or cycle between the main sights. Highlights from Centraal:',
    arrival: [
      '<strong>The canal ring</strong> — the 17th-century Grachtengordel, an easy walk from the station.',
      '<strong>The Rijksmuseum, Van Gogh Museum and Anne Frank House</strong> — book timed tickets ahead, especially the Anne Frank House.',
      '<strong>The Jordaan</strong> — small streets, cafés and independent shops close to the western canals.',
      '<strong>Day trips by train</strong> — Haarlem, Delft and Utrecht are all under an hour from Amsterdam by regular train.'
    ],
    alt: [
      '<strong>Flying</strong> — roughly 1h 20m in the air from London airports, but the door-to-door time including the airport journey, security and the transfer into Amsterdam is usually well above the train time.',
      '<strong>Ferry plus train</strong> — an overnight ferry from Harwich to the Hook of Holland, then a train into Amsterdam, is far slower but a classic cheaper option.',
      '<strong>Coach</strong> — services run through the Channel Tunnel or by ferry and take roughly ten hours or more.'
    ]
  },
  'london-brussels': {
    stations: [
      '<strong>London St Pancras International</strong> is the Eurostar terminal, with Underground, Thameslink and national rail connections. Border and security checks happen before boarding.',
      '<strong>Brussels-Midi (Brussel-Zuid)</strong> is the Eurostar station. The Grand-Place is about a 25-minute walk or a short metro or tram ride into the centre.'
    ],
    times: 'The Eurostar to Brussels takes roughly two hours, with several departures through the day. It is one of the quickest ways between two capitals in Europe, and the train arrives in the middle of the city rather than at an outlying airport. As with other Eurostar routes, arrive in good time for the border checks; around 90 minutes before departure is Eurostar\'s usual guidance.',
    ticketsIntro: 'Eurostar uses dynamic pricing: the earlier you book, the lower the fare:',
    tickets: [
      ['Standard (cheapest)', 'One specific train, limited changes', 'Indicative single fares often start around £40–£60 when booked well ahead.'],
      ['Standard Premier / Plus', 'More flexibility and extras', 'Mid-range, with changes and extras depending on the tier.'],
      ['Business Premier', 'Fully flexible', 'The most expensive; includes lounge access and food.']
    ],
    ticketTips: [
      'Book as soon as the tickets are released for your date; the cheapest seats go first.',
      'Compare tickets to "Brussels (any station)" with tickets onward to other Belgian destinations, which can be better value.',
      'Youth fares and some group deals can reduce the price; check the options on the booking page.'
    ],
    when: 'Fridays, Sundays and school holidays are the busiest and most expensive. Midweek mornings are the best value. Weekend breaks to Brussels are very popular, so book popular dates early.',
    arrivalIntro: 'Brussels is compact and easy to explore on foot. Highlights:',
    arrival: [
      '<strong>The Grand-Place</strong> — the 17th-century guildhall square at the centre of the old town.',
      '<strong>The Royal Palace, Parc de Bruxelles and the Magritte Museum</strong> — easily combined in a half-day.',
      '<strong>Comic-strip murals</strong> — the city\'s comic-art tradition is on display on walls across the centre.',
      '<strong>Day trips by train</strong> — Bruges, Ghent and Antwerp are all within an hour of Brussels.'
    ],
    alt: [
      '<strong>Flying</strong> — roughly 1h 10m in the air, but the airport journey and security make the total close to the train time, and the train arrives in the centre.',
      '<strong>Coach</strong> — services via the Channel Tunnel or ferry take roughly seven hours or more.'
    ]
  }
};

const MORE = require('./route-deep-content-2');
Object.assign(DEEP, MORE.deep);
const MORE3 = require('./route-deep-content-3');
Object.assign(DEEP, MORE3.deep);

const BASE_STYLE = 'width:100%;border-collapse:collapse;margin:12px 0 8px;font-size:14px;';
const TH = 'padding:8px 12px;color:#C10016;font-weight:700;text-align:left;';
const TD = 'padding:8px 12px;border-top:1px solid rgba(20,21,26,0.08);vertical-align:top;';

const I18N = {};
for (const l of ['es', 'fr', 'it']) { try { I18N[l] = require('./route-deep-' + l); } catch (e) { /* idioma aún sin traducir */ } }
const SUFFIX = { en: '/', es: '/es/', fr: '/fr/', it: '/it/' };

function render(slug, lang, route) {
  const en = lang === 'en';
  const d = en ? DEEP[slug] : (I18N[lang] && I18N[lang].deep[slug]);
  if (!d) return '';
  const ui = en ? {
    stations: 'Stations: where you leave and where you arrive', times: (f, t) => `${f} to ${t} train times and frequency`,
    tickets: 'Tickets and fares: what you actually pay', th: ['Ticket', 'What it means', 'Typical level'],
    note: 'Fares are indicative and change by date, time and how early you book. The live search shows the exact price for your trip.',
    when: 'Best time to travel', arrival: (t) => `What to do when you arrive in ${t}`, alt: (f, t) => `Other ways to get from ${f} to ${t}`,
    related: 'Related routes', moreLondon: 'More trains from London'
  } : I18N[lang].ui;
  const from = route.from, to = route.to;
  const li = (arr) => arr.map(t => `<li>${t}</li>`).join('\n      ');
  const rows = d.tickets.map(r => `<tr><td style="${TD}"><strong>${r[0]}</strong></td><td style="${TD}">${r[1]}</td><td style="${TD}">${r[2]}</td></tr>`).join('');
  const nice = (sl) => sl.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(en ? ' to ' : ' → ');
  const cities = slug.split('-'), suf = SUFFIX[lang];
  const link = (k, label) => `<a href="/rutas/${k}${suf}">${label}</a>`;
  let sibs = '', head = ui.related;
  if (slug.startsWith('london-')) {
    head = ui.moreLondon;
    sibs = (en ? '<a href="/trains-from-london/">All trains from London</a> · ' : '') + SIBLINGS_LONDON.filter(([s]) => s !== slug).map(([s, label]) => link(s, en ? label : label.replace(' to ', ' → '))).join(' · ');
  } else {
    const rel = Object.keys(DEEP).filter(k => k !== slug && k.split('-').some(c => cities.includes(c)));
    sibs = (en && cities.includes('paris') ? '<a href="/trains-from-paris/">All trains from Paris</a> · ' : '') + rel.map(k => link(k, nice(k))).join(' · ');
  }
  return `
    <section class="deep-guide">
    <h2>${ui.stations}</h2>
    <ul style="padding-left:22px;">
      ${li(d.stations)}
    </ul>

    <h2>${ui.times(from, to)}</h2>
    <p>${d.times}</p>

    <h2>${ui.tickets}</h2>
    <p>${d.ticketsIntro}</p>
    <div style="overflow-x:auto;"><table style="${BASE_STYLE}">
      <thead><tr><th style="${TH}">${ui.th[0]}</th><th style="${TH}">${ui.th[1]}</th><th style="${TH}">${ui.th[2]}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p style="font-size:13px;color:#55565f;">${ui.note}</p>
    <ul style="padding-left:22px;">
      ${li(d.ticketTips)}
    </ul>

    <h2>${ui.when}</h2>
    <p>${d.when}</p>

    <h2>${ui.arrival(to)}</h2>
    <p>${d.arrivalIntro}</p>
    <ul style="padding-left:22px;">
      ${li(d.arrival)}
    </ul>

    <h2>${ui.alt(from, to)}</h2>
    <ul style="padding-left:22px;">
      ${li(d.alt)}
    </ul>
    ${sibs ? `<p style="margin-top:16px;"><strong>${head}:</strong> ${sibs}</p>` : ''}
    </section>`;
}

// Estaciones reales en el bloque de datos del tramo (sustituye el genérico "London Station") y metas de CTR ya definidas
const STATION_LINE = {
  'london-liverpool': 'London Euston → Liverpool Lime Street', 'london-oxford': 'London Paddington or Marylebone → Oxford',
  'london-cambridge': 'London King\'s Cross or Liverpool Street → Cambridge', 'london-york': 'London King\'s Cross → York',
  'london-edinburgh': 'London King\'s Cross → Edinburgh Waverley', 'london-amsterdam': 'London St Pancras International → Amsterdam Centraal',
  'london-brussels': 'London St Pancras International → Brussels-Midi'
};
Object.assign(STATION_LINE, MORE.stationLines, MORE3.stationLines);
const STN = { en: 'Stations', es: 'Estaciones', fr: 'Gares', it: 'Stazioni' };
function postProcess(slug, lang, html) {
  if (!STATION_LINE[slug] || !STN[lang]) return html;
  if (lang !== 'en' && !(I18N[lang] && I18N[lang].deep[slug])) return html;
  return html.replace(/<strong>(?:Station|Estación|Gare|Stazione|Stations|Estaciones|Gares|Stazioni): [^<]*<\/strong>/, '<strong>' + STN[lang] + ': ' + STATION_LINE[slug].replace(/&/g, '&amp;') + '</strong>');
}

module.exports = { render, postProcess, DEEP };
