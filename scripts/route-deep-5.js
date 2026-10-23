/** Contenido ampliado, quinta tanda (rutas EN con más impresiones en Search Console, 23-oct-2026). Misma estructura que route-deep-content.js.
 *  Duraciones de bus y avión: catálogo de Omio (assets/data/route-data.json). Tarifas: orientativas, la búsqueda en vivo manda. */
module.exports = {
  stationLines: {
    'barcelona-valencia': 'Barcelona Sants → València Joaquín Sorolla or València Nord',
    'paris-amsterdam': 'Paris Gare du Nord → Amsterdam Centraal',
    'vienna-prague': 'Wien Hauptbahnhof → Praha hlavní nádraží',
    'prague-budapest': 'Praha hlavní nádraží → Budapest-Keleti',
    'paris-milan': 'Paris Gare de Lyon → Milano Centrale',
    'munich-venice': 'München Hbf → Venezia Santa Lucia',
    'stockholm-oslo': 'Stockholm Central → Oslo S',
    'madrid-valencia': 'Madrid Puerta de Atocha or Chamartín → València Joaquín Sorolla',
    'berlin-prague': 'Berlin Hbf → Praha hlavní nádraží',
    'milan-zurich': 'Milano Centrale → Zürich HB',
    'lyon-turin': 'Lyon Part-Dieu → Torino Porta Susa'
  },
  deep: {
    'barcelona-valencia': {
      stations: [
        '<strong>Barcelona Sants</strong> is the city\'s main long-distance station, with metro lines L3 and L5 and Rodalies commuter trains. Plaça d\'Espanya is about a 15-minute walk.',
        '<strong>València Joaquín Sorolla</strong> handles most fast trains on this route; a free shuttle and a short walk link it with <strong>València Nord</strong>, next to the bullring and a few minutes from the old town. Some slower services arrive directly at Nord, so check which station is on your ticket.'
      ],
      times: 'The coastal line is not a dedicated high-speed line for its whole length, so journeys take roughly 2h 45m–3h 30m depending on the train and its stops (commonly Tarragona, Castellón). Renfe runs the direct services, mainly Euromed and Intercity, with departures spread from early morning to the evening.',
      ticketsIntro: 'Renfe sells several fare levels on the same train, so the ticket type matters more than the train you pick:',
      tickets: [
        ['Básico', 'One train, no changes or refunds', 'Cheapest; indicative single fares are often in the €20s–€40s when booked early.'],
        ['Elige', 'Choose your conditions (changes, seat)', 'Mid-range; a good balance if plans may move.'],
        ['Prémium', 'Most flexible, extra services', 'The most expensive level.']
      ],
      ticketTips: [
        'Renfe releases fares in batches; booking a few weeks ahead usually gives the widest choice of cheap seats.',
        'Fridays and Sunday afternoons fill first, especially in summer and during Valencia\'s Fallas festival in March.',
        'Sit on the left heading south for sea views on stretches between Tarragona and Castellón.'
      ],
      when: 'Mid-week departures outside July, August and the Fallas week (around 15–19 March) are typically cheaper and quieter. Allow extra time if your ticket shows València Nord rather than Joaquín Sorolla.',
      arrivalIntro: 'Valencia is easy to explore on foot and by metro. Highlights within easy reach of the stations:',
      arrival: [
        '<strong>Ciutat Vella</strong> — the cathedral and Micalet tower, La Lonja (a UNESCO World Heritage Site) and the Central Market.',
        '<strong>City of Arts and Sciences</strong> — the modern complex at the end of the Turia Gardens, the former riverbed turned park.',
        '<strong>Ruzafa</strong> — the neighbourhood for cafés and restaurants, a short walk from València Nord.',
        '<strong>Malvarrosa and Las Arenas beaches</strong> — reachable by tram or bus in about 20–30 minutes.'
      ],
      alt: [
        '<strong>Coach</strong> — Omio lists coaches at around 3h 30m, usually cheaper but less comfortable.',
        '<strong>Car</strong> — about three and a half hours along the AP-7 and A-7, plus tolls and parking.',
        '<strong>Flying</strong> — rarely worth it: with airport transfers and security the train is faster door to door.'
      ]
    },
    'paris-amsterdam': {
      stations: [
        '<strong>Paris Gare du Nord</strong> has metro lines 4 and 5 and RER B, D and E. Eurostar trains to Brussels and Amsterdam leave from the main hall; arrive 30 minutes early to find your platform.',
        '<strong>Amsterdam Centraal</strong> is on the edge of the historic centre. Trams, metro and ferries across the IJ leave from in front of and behind the station; Dam Square is about a 10-minute walk.'
      ],
      times: 'The former Thalys trains, now branded Eurostar, run direct in roughly 3h 20m–3h 30m, calling at Brussels-Midi and usually at Antwerp, Rotterdam and Schiphol Airport. There are several departures a day; Omio\'s catalogue puts the typical trip at about 3h 15m.',
      ticketsIntro: 'Eurostar sells three classes on this route; the price gap is usually smallest when booked early:',
      tickets: [
        ['Eurostar Standard', 'Second class, a fixed train', 'Cheapest; indicative single fares often start in the €35–€60 range when booked early.'],
        ['Eurostar Plus', 'First class with a light meal on board', 'Mid-range; worth comparing when Standard is already expensive.'],
        ['Eurostar Premier', 'Flexible first class, lounge access', 'The most expensive; for flexibility or business travel.']
      ],
      ticketTips: [
        'Sales open months ahead and the cheapest fares go first, especially for Friday and Sunday trains.',
        'If you are heading to Schiphol for a flight, the same train stops at the airport, so there is no need to go into Amsterdam first.',
        'Rotterdam and Antwerp are on the line: a stop-over can cost little extra if you book them as separate legs.'
      ],
      when: 'Mid-week mid-morning trains are typically the cheapest and quietest. Spring weekends (tulip season, King\'s Day on 27 April) and December fill early.',
      arrivalIntro: 'Amsterdam\'s centre is compact and best seen on foot or by bike. Highlights:',
      arrival: [
        '<strong>The canal ring</strong> — the 17th-century canals (a UNESCO World Heritage Site), best seen from the Jordaan and the Nine Streets.',
        '<strong>Museumplein</strong> — the Rijksmuseum, Van Gogh Museum and Stedelijk, about 20 minutes by tram from Centraal.',
        '<strong>Anne Frank House</strong> — tickets are sold online only and often weeks ahead.',
        '<strong>Amsterdam Noord</strong> — the free ferry from behind Centraal reaches the EYE Film Museum and A\'DAM Lookout in minutes.'
      ],
      alt: [
        '<strong>Coach</strong> — Omio lists coaches at roughly six and a half hours or more.',
        '<strong>Flying</strong> — about 1h 10m in the air, but with transfers to CDG and Schiphol and security the train is usually faster door to door.',
        '<strong>Car</strong> — around five hours, plus city parking, which is expensive in Amsterdam.'
      ]
    },
    'vienna-prague': {
      stations: [
        '<strong>Wien Hauptbahnhof</strong> is Vienna\'s main station, on metro line U1 and several tram lines; Stephansplatz is about 10 minutes away by U1.',
        '<strong>Praha hlavní nádraží</strong> is on metro line C and a 10–15 minute walk from Wenceslas Square and the Old Town.'
      ],
      times: 'Railjet trains run roughly every two hours via Břeclav and Brno, taking about 4 hours. ÖBB and České dráhy (ČD) operate the service jointly, and private operator RegioJet also runs on parts of the corridor, so it is worth comparing all departures for your date. Omio\'s catalogue puts the typical trip at about 4h 15m.',
      ticketsIntro: 'The same Railjet train can be booked through ÖBB or ČD, often at different prices:',
      tickets: [
        ['Sparschiene / Akční jízdenka', 'Saver fare on one train', 'Cheapest; indicative single fares are often in the €15–€30 range when booked early.'],
        ['Standard', 'Flexible on the chosen day', 'Mid-range; no need to catch a specific train.'],
        ['First / Business class', 'Larger seats; Business includes at-seat service', 'Most comfortable; check for upgrade offers on board.']
      ],
      ticketTips: [
        'Compare the ÖBB and ČD websites: the same train is sometimes cheaper on one of them.',
        'Saver fares are tied to one train, so leave a margin if you are connecting from a flight.',
        'Brno is a worthwhile stop-over: the trip can be split into two shorter legs.'
      ],
      when: 'Friday afternoons, Sunday evenings and the Christmas market season (late November–December) are busiest. Mid-week trains are typically cheaper.',
      arrivalIntro: 'Prague\'s historic centre is walkable from the main station. Highlights:',
      arrival: [
        '<strong>Old Town Square</strong> — the Astronomical Clock, Týn Church and the old streets around it.',
        '<strong>Charles Bridge</strong> — best early in the morning, before the crowds.',
        '<strong>Prague Castle and Malá Strana</strong> — the castle complex, St Vitus Cathedral and the baroque streets below.',
        '<strong>Vyšehrad</strong> — the quieter fortress above the Vltava, with views of the city.'
      ],
      alt: [
        '<strong>Coach</strong> — Omio lists coaches at around 3h 40m, often the cheapest option.',
        '<strong>Flying</strong> — about 50 minutes in the air, but rarely faster door to door once airports are included.',
        '<strong>Car</strong> — about three and a half to four hours; a motorway vignette is needed in both countries.'
      ]
    },
    'prague-budapest': {
      stations: [
        '<strong>Praha hlavní nádraží</strong> is Prague\'s main station, on metro line C and within walking distance of Wenceslas Square.',
        '<strong>Budapest-Keleti</strong> is on metro lines M2 and M4; the centre of Pest is about 10 minutes away by metro.'
      ],
      times: 'Direct EuroCity trains run via Brno, Břeclav and Bratislava and take roughly 6h 30m–7h; Omio\'s catalogue puts the typical trip at about 6h 50m. There are several direct departures a day, plus an overnight train for those who prefer to sleep on board.',
      ticketsIntro: 'The trip crosses three countries, but a single through ticket covers the whole journey:',
      tickets: [
        ['Saver / promotional fare', 'One specific train', 'Cheapest; indicative single fares are often in the €20–€40 range when booked early.'],
        ['Standard fare', 'More flexible on the day', 'Mid-range.'],
        ['Night train (couchette or sleeper)', 'Overnight, with a bed', 'Costs more than a seat but saves a night\'s accommodation.']
      ],
      ticketTips: [
        'Book the overnight train early: sleeper and couchette berths are limited.',
        'Bratislava is on the line, so a stop-over in Slovakia\'s capital is easy to add.',
        'Bring snacks; not every departure has a full restaurant car.'
      ],
      when: 'Summer weekends and the Christmas market season are busiest. On a long daytime trip, a morning departure lets you arrive in Budapest before dark.',
      arrivalIntro: 'Budapest splits into hilly Buda and flat Pest. Highlights:',
      arrival: [
        '<strong>Parliament and the Danube embankment</strong> — the Parliament building and the Shoes on the Danube Bank memorial.',
        '<strong>Buda Castle and the Fisherman\'s Bastion</strong> — views over the river from Castle Hill.',
        '<strong>Thermal baths</strong> — Széchenyi in City Park and Gellért are the best known.',
        '<strong>The Jewish Quarter</strong> — the Dohány Street Synagogue and the area\'s cafés and ruin bars.'
      ],
      alt: [
        '<strong>Coach</strong> — Omio lists coaches at around six hours, usually cheaper.',
        '<strong>Flying</strong> — about 1h 10m in the air; with transfers it can be faster than the train, but it rarely costs less.',
        '<strong>Car</strong> — about five and a half hours, with motorway vignettes in three countries.'
      ]
    },
    'paris-milan': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> has metro lines 1 and 14 and RER A and D. It is a large station, so allow time to reach the right hall.',
        '<strong>Milano Centrale</strong> is on metro lines M2 and M3; the Duomo is about 10 minutes away by M3.'
      ],
      times: 'Direct trains run over the Alps via Lyon, Chambéry, Modane and Turin, taking roughly 7 hours. The line through the Fréjus tunnel was closed after a landslide in August 2023, and direct Paris–Milan trains returned on 1 April 2025. SNCF (TGV INOUI) and Trenitalia (Frecciarossa) both run the route, with a handful of departures a day.',
      ticketsIntro: 'Two operators run direct trains, so compare both on the same day:',
      tickets: [
        ['TGV INOUI (SNCF)', 'Second or first class, one train', 'Indicative single fares often start around €30–€60 when booked early.'],
        ['Frecciarossa (Trenitalia)', 'Standard, Premium or Business', 'Similar range; Trenitalia regularly runs promotional fares.'],
        ['Flexible tickets', 'Changes allowed', 'The most expensive; useful if your plans may move.']
      ],
      ticketTips: [
        'Direct trains are few, so the best departures sell out first; book as soon as your dates are fixed.',
        'Sit on the right heading towards Italy for the best views of the Alpine valleys after Chambéry.',
        'Turin is on the line: an overnight stop breaks the trip in two.'
      ],
      when: 'The daytime crossing of the Alps is the highlight of this trip, so a morning train is the best choice. Fridays, Sundays and the Milan fashion and design weeks are busiest.',
      arrivalIntro: 'Milan\'s main sights are close together and well served by metro. Highlights:',
      arrival: [
        '<strong>The Duomo and its rooftop terraces</strong> — with the Galleria Vittorio Emanuele II next door.',
        '<strong>The Last Supper</strong> — Leonardo\'s fresco at Santa Maria delle Grazie; tickets must be booked well ahead.',
        '<strong>Brera</strong> — the art gallery and the neighbourhood\'s streets and cafés.',
        '<strong>The Navigli</strong> — the canals, busiest at aperitivo time.'
      ],
      alt: [
        '<strong>Flying</strong> — about 1h 25m in the air; with transfers it is faster than the train but loses the Alpine scenery.',
        '<strong>Coach</strong> — Omio lists coaches at over 11 hours.',
        '<strong>Car</strong> — around eight to nine hours via the Fréjus or Mont Blanc tunnel, with tunnel and motorway tolls.'
      ]
    },
    'munich-venice': {
      stations: [
        '<strong>München Hauptbahnhof</strong> is the city\'s main station, with S-Bahn, U-Bahn and trams; Marienplatz is two S-Bahn stops away.',
        '<strong>Venezia Santa Lucia</strong> sits on the Grand Canal. Vaporetto water buses leave from right outside; there are no cars in the historic centre. Make sure your ticket is to Santa Lucia, not Venezia Mestre on the mainland.'
      ],
      times: 'Direct EuroCity trains, run by ÖBB with DB, cross the Brenner Pass via Innsbruck, Bolzano and Verona, taking roughly 6h 30m–7h; Omio\'s catalogue puts the typical trip at about 6h 50m. There are only a few direct departures a day; other journeys change in Verona or Innsbruck.',
      ticketsIntro: 'Through tickets are sold by ÖBB, DB and Trenitalia:',
      tickets: [
        ['Sparschiene / Super Sparpreis', 'Saver fare on one train', 'Cheapest; indicative single fares are often in the €30–€60 range when booked early.'],
        ['Standard fare', 'More flexible', 'Mid-range.'],
        ['First class', 'More space and quieter carriages', 'Worth considering on a seven-hour daytime trip.']
      ],
      ticketTips: [
        'Compare ÖBB and DB for the same train: prices can differ.',
        'Sit on the right heading south for the best views over the Brenner and down the Adige valley.',
        'Innsbruck, Bolzano and Verona are all on the line and make good stop-overs.'
      ],
      when: 'Take a morning train to cross the Alps in daylight. Summer weekends and the Venice Carnival (February) are busiest, and Venice has a day-tripper access fee on certain dates, so check before you travel.',
      arrivalIntro: 'In Venice you walk or take the vaporetto. Highlights:',
      arrival: [
        '<strong>The Grand Canal</strong> — vaporetto line 1 from the station is a slow, scenic ride to St Mark\'s.',
        '<strong>St Mark\'s Square</strong> — the Basilica, the Campanile and the Doge\'s Palace.',
        '<strong>Rialto</strong> — the bridge and the morning fish and produce markets.',
        '<strong>Murano and Burano</strong> — glass-making and colourful houses, reachable by vaporetto.'
      ],
      alt: [
        '<strong>Coach</strong> — Omio lists coaches at around 6h 50m, similar to the train.',
        '<strong>Flying</strong> — about an hour in the air to Venice Marco Polo, then a bus or boat into the city.',
        '<strong>Car</strong> — about six hours, plus Austrian vignette, Brenner toll and parking at Piazzale Roma or Tronchetto.'
      ]
    },
    'stockholm-oslo': {
      stations: [
        '<strong>Stockholm Central</strong> is next to T-Centralen, the hub of the metro; Gamla stan is one metro stop or a 10-minute walk away.',
        '<strong>Oslo S</strong> (Oslo Central Station) is at the east end of Karl Johans gate, a short walk from the Opera House and the waterfront.'
      ],
      times: 'Direct trains run via Karlstad and take roughly 5–6 hours; Omio\'s catalogue puts the typical trip at about 5h 25m. There are only a few direct departures a day, so plan around the timetable. Engineering works sometimes replace part of the trip with buses, so check your booking.',
      ticketsIntro: 'SJ runs the direct trains; fares depend on how early you book and how flexible the ticket is:',
      tickets: [
        ['Non-refundable', 'One specific train', 'Cheapest; indicative single fares often start around €30–€60 when booked early.'],
        ['Rebookable', 'Changes allowed', 'Mid-range.'],
        ['First class', 'More space, quieter carriage', 'Often a modest extra on long daytime trips.']
      ],
      ticketTips: [
        'With few direct trains a day, book early for Friday and Sunday travel.',
        'Prices are shown in Swedish crowns on SJ; the live search converts them for you.',
        'Karlstad, on Lake Vänern, is a good place to break the journey.'
      ],
      when: 'Summer brings long days and the best views of the lakes and forests along the way. In winter, allow for possible delays in snow.',
      arrivalIntro: 'Central Oslo is compact and walkable from Oslo S. Highlights:',
      arrival: [
        '<strong>The Opera House</strong> — walk up its sloping roof for views over the fjord.',
        '<strong>Aker Brygge and Akershus Fortress</strong> — the waterfront and the medieval fortress.',
        '<strong>Bygdøy</strong> — museums including the Fram and Kon-Tiki, reachable by ferry in summer or by bus.',
        '<strong>Vigeland Park</strong> — the sculpture park inside Frogner Park.'
      ],
      alt: [
        '<strong>Flying</strong> — about an hour in the air; with airport transfers, total time is similar to the train.',
        '<strong>Coach</strong> — Omio lists coaches at around seven hours or more.',
        '<strong>Car</strong> — about six to seven hours along the E18.'
      ]
    },
    'madrid-valencia': {
      stations: [
        '<strong>Madrid Puerta de Atocha</strong> and <strong>Madrid Chamartín</strong> both have high-speed trains to Valencia; which one you use depends on the operator and train, so check the station on your ticket.',
        '<strong>València Joaquín Sorolla</strong> is the high-speed station, linked by a short walk or shuttle with València Nord and the city centre.'
      ],
      times: 'High-speed trains take roughly 1h 40m–2h; Omio\'s catalogue puts the typical trip at about 1h 55m. There are many departures through the day, and three operators run on the line: Renfe (AVE and low-cost Avlo), Iryo and Ouigo.',
      ticketsIntro: 'With three operators on the same line, comparing them is the easiest way to save:',
      tickets: [
        ['Ouigo / Avlo (low-cost)', 'One train, paid extras for bags and seats', 'Often the cheapest; indicative fares can start around €10–€25.'],
        ['Iryo / Renfe AVE standard', 'One train, more included', 'Mid-range; indicative fares often in the €20s–€50s.'],
        ['Flexible / premium classes', 'Changes allowed, more space', 'The most expensive.']
      ],
      ticketTips: [
        'Compare all three operators for the same time slot; the cheapest changes by day.',
        'Add the cost of luggage on low-cost fares before deciding.',
        'Check the Madrid departure station before you leave: Atocha and Chamartín are on opposite sides of the city.'
      ],
      when: 'Friday afternoons and Sunday evenings are busiest. Mid-week mid-morning trains are typically the cheapest. Book early for the Fallas festival in March.',
      arrivalIntro: 'Valencia is compact and has good metro and tram links. Highlights:',
      arrival: [
        '<strong>Ciutat Vella</strong> — the cathedral, La Lonja (a UNESCO World Heritage Site) and the Central Market.',
        '<strong>Turia Gardens</strong> — the former riverbed turned into a 9 km park.',
        '<strong>City of Arts and Sciences</strong> — the modern complex at the end of the Turia Gardens.',
        '<strong>Malvarrosa beach</strong> — reachable by tram, with paella restaurants along the seafront.'
      ],
      alt: [
        '<strong>Coach</strong> — Omio lists coaches at around 3h 10m, cheaper but slower.',
        '<strong>Car</strong> — about three and a half hours on the A-3.',
        '<strong>Flying</strong> — not practical for this distance; the train is faster door to door.'
      ]
    },
    'berlin-prague': {
      stations: [
        '<strong>Berlin Hauptbahnhof</strong> is the main station, with S-Bahn and U-Bahn connections; trains to Prague also call at Berlin Südkreuz.',
        '<strong>Praha hlavní nádraží</strong> is on metro line C, a short walk from Wenceslas Square and the Old Town.'
      ],
      times: 'EuroCity trains run by DB and ČD leave about every two hours via Dresden and take roughly 4h–4h 30m. Omio\'s catalogue puts the typical trip at about 3h 45m.',
      ticketsIntro: 'The same train can be booked through DB or ČD:',
      tickets: [
        ['Super Sparpreis / Sparpreis', 'Saver fare on one train', 'Cheapest; indicative single fares often start around €20–€40 when booked early.'],
        ['Flexpreis', 'Any train on the day', 'More expensive but flexible.'],
        ['First class', 'More space, quieter carriage', 'Often a modest extra when booked early.']
      ],
      ticketTips: [
        'Compare DB and ČD: the same train is sometimes cheaper on one of them.',
        'Sit on the left heading south for the best views of the Elbe valley through Saxon Switzerland.',
        'Dresden is on the line and makes an easy stop-over.'
      ],
      when: 'The scenic Elbe valley stretch is best in daylight. Fridays, Sundays and the Christmas market season are busiest.',
      arrivalIntro: 'Prague\'s historic centre is walkable from the main station. Highlights:',
      arrival: [
        '<strong>Old Town Square</strong> — the Astronomical Clock and Týn Church.',
        '<strong>Charles Bridge</strong> — the 14th-century bridge, best early in the morning.',
        '<strong>Prague Castle and Malá Strana</strong> — St Vitus Cathedral and the baroque streets below.',
        '<strong>Letná Park</strong> — views over the river and the city\'s bridges.'
      ],
      alt: [
        '<strong>Coach</strong> — Omio lists coaches at around four hours, usually cheaper.',
        '<strong>Car</strong> — about three and a half to four hours; a Czech motorway vignette is needed.',
        '<strong>Flying</strong> — rarely worth it on this distance once airport time is included.'
      ]
    },
    'milan-zurich': {
      stations: [
        '<strong>Milano Centrale</strong> is on metro lines M2 and M3; the Duomo is about 10 minutes away by M3.',
        '<strong>Zürich HB</strong> is at the top of the Bahnhofstrasse, a short walk from the Old Town and the lake.'
      ],
      times: 'EuroCity trains run by SBB and Trenitalia take roughly 3h 20m via Lugano and the Gotthard Base Tunnel, with departures about every one to two hours. Omio\'s catalogue puts the typical trip at about 3h 15m.',
      ticketsIntro: 'Tickets for the same train are sold by SBB and Trenitalia:',
      tickets: [
        ['Saver Day Pass / Supersaver', 'One specific train', 'Cheapest; indicative single fares often start around €20–€45 when booked early.'],
        ['Standard fare', 'More flexible', 'Mid-range.'],
        ['First class', 'More space and quieter carriages', 'Often worth it for the views.']
      ],
      ticketTips: [
        'Saver fares appear a few months ahead and sell out; book early for weekends.',
        'Switzerland uses Swiss francs; the live search shows the price in your currency.',
        'Lugano and the Ticino lakes are on the way and make an easy stop-over.'
      ],
      when: 'Travel in daylight to see Lake Lugano and the Ticino valleys. Weekends and Swiss holidays are busiest.',
      arrivalIntro: 'Zurich\'s centre is compact and easy to walk. Highlights:',
      arrival: [
        '<strong>Altstadt</strong> — the Old Town on both banks of the Limmat, with the Grossmünster and Fraumünster.',
        '<strong>Lake Zurich</strong> — the lakeside promenades and boat trips in summer.',
        '<strong>Kunsthaus Zürich</strong> — one of Switzerland\'s major art museums.',
        '<strong>Uetliberg</strong> — the city\'s hill, reachable by train in about 20 minutes, with views of the Alps on clear days.'
      ],
      alt: [
        '<strong>Coach</strong> — Omio lists coaches at around three hours, sometimes cheaper.',
        '<strong>Flying</strong> — about 55 minutes in the air, but slower door to door than the train.',
        '<strong>Car</strong> — around three and a half hours; a Swiss motorway vignette is required.'
      ]
    },
    'lyon-turin': {
      stations: [
        '<strong>Lyon Part-Dieu</strong> is the main station for the business district, with metro and tram links into the centre.',
        '<strong>Torino Porta Susa</strong> is the main station for high-speed trains, on metro line 1, within walking distance of the centre. Some trains continue to Milan.'
      ],
      times: 'Direct trains on the Paris–Milan line cross the Alps via Chambéry and the Fréjus tunnel and take roughly 4 hours. The line was closed after a landslide in August 2023 and direct services returned on 1 April 2025. There are only a handful of direct departures a day, run by SNCF (TGV INOUI) and Trenitalia (Frecciarossa).',
      ticketsIntro: 'Two operators run direct trains, so compare both:',
      tickets: [
        ['TGV INOUI (SNCF)', 'One specific train', 'Indicative single fares often start around €25–€50 when booked early.'],
        ['Frecciarossa (Trenitalia)', 'Standard, Premium or Business', 'Similar range, with regular promotional fares.'],
        ['Flexible tickets', 'Changes allowed', 'The most expensive.']
      ],
      ticketTips: [
        'With few direct trains, book early and plan around the timetable.',
        'Sit on the right heading to Italy for views of the Maurienne valley.',
        'Chambéry, on the line, is a good stop for the Savoie lakes.'
      ],
      when: 'Take a daytime train to see the Alps. Ski season weekends (December–April) and summer Fridays are busiest.',
      arrivalIntro: 'Turin is an elegant, arcaded city that is easy to walk. Highlights:',
      arrival: [
        '<strong>The Egyptian Museum</strong> — one of the largest collections of Egyptian antiquities outside Cairo.',
        '<strong>Mole Antonelliana</strong> — home of the National Cinema Museum, with a lift to a panoramic terrace.',
        '<strong>Piazza Castello and the Royal Palace</strong> — the historic heart of the city.',
        '<strong>Via Po and the riverside</strong> — arcades, cafés and the Valentino Park.'
      ],
      alt: [
        '<strong>Coach</strong> — Omio lists coaches at around 3h 50m, similar to the train.',
        '<strong>Car</strong> — about three and a half to four hours via the Fréjus tunnel, with tunnel and motorway tolls.',
        '<strong>Flying</strong> — not practical; there are no convenient direct flights for this pair.'
      ]
    }
  }
};
