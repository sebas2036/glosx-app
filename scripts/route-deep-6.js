/** Contenido ampliado, sexta tanda (rutas en posición 13–20 en Search Console, 23-oct-2026). Misma estructura que route-deep-content.js.
 *  Duraciones de bus y avión: catálogo de Omio (route-data.json); Madrid–Barcelona: horario abierto de Renfe (horarios-rutas.json). */
module.exports = {
  stationLines: {
    'madrid-barcelona': 'Madrid Puerta de Atocha → Barcelona Sants',
    'brno-vienna': 'Brno hlavní nádraží → Wien Hauptbahnhof',
    'munich-salzburg': 'München Hbf → Salzburg Hbf',
    'zaragoza-barcelona': 'Zaragoza Delicias → Barcelona Sants',
    'vienna-krems': 'Wien Franz-Josefs-Bahnhof → Krems an der Donau',
    'dortmund-munich': 'Dortmund Hbf → München Hbf',
    'lucerne-zermatt': 'Luzern → Zermatt (change in Visp)'
  },
  deep: {
    'madrid-barcelona': {
      stations: [
        '<strong>Madrid Puerta de Atocha</strong> is the main departure station, on Cercanías and metro line 1; some services use <strong>Madrid Chamartín</strong> instead, so check your ticket.',
        '<strong>Barcelona Sants</strong> is on metro lines L3 and L5; Plaça de Catalunya is about 10 minutes away by metro.'
      ],
      times: 'Renfe\'s open timetable shows 31 direct trains from Madrid to Barcelona on a weekday, the first at 06:16 and the last at 20:30. The fastest non-stop trains take about 2h 30m; services stopping at Zaragoza, Lleida or Camp de Tarragona take closer to 3h 15m. Ouigo and Iryo also run on the line, so there are more departures than Renfe\'s alone.',
      ticketsIntro: 'Four brands compete on this line, which keeps prices lower than they used to be:',
      tickets: [
        ['Ouigo / Avlo (low-cost)', 'One train; bags and seat choice cost extra', 'Often the cheapest; indicative fares can start around €10–€30.'],
        ['Iryo / Renfe AVE standard', 'One train, more included', 'Mid-range; indicative fares often in the €25–€70 range.'],
        ['Flexible / premium classes', 'Changes allowed, more space and service', 'The most expensive.']
      ],
      ticketTips: [
        'Compare all operators for the same time slot; the cheapest changes by day and hour.',
        'Add luggage costs to low-cost fares before choosing.',
        'Non-stop trains save around 30–45 minutes; filter by duration if time matters.'
      ],
      when: 'Monday mornings, Friday afternoons and Sunday evenings are busiest with business and weekend travellers. Midday trains mid-week are typically the cheapest.',
      arrivalIntro: 'Barcelona is easy to explore by metro and on foot. Highlights:',
      arrival: [
        '<strong>Sagrada Família</strong> — Gaudí\'s basilica; book a timed ticket in advance.',
        '<strong>Barri Gòtic and El Born</strong> — the medieval streets, the cathedral and the Picasso Museum.',
        '<strong>Passeig de Gràcia</strong> — Casa Batlló and Casa Milà (La Pedrera).',
        '<strong>Montjuïc and Barceloneta</strong> — gardens and museums on the hill, and the city beach.'
      ],
      alt: [
        '<strong>Flying</strong> — about 1h 15m in the air, but with airport transfers and security the train is usually faster door to door.',
        '<strong>Coach</strong> — Omio lists coaches at around 5h 40m or more, usually cheaper.',
        '<strong>Car</strong> — about six hours via Zaragoza.'
      ]
    },
    'brno-vienna': {
      stations: [
        '<strong>Brno hlavní nádraží</strong> is Brno\'s main station, a short walk from the old town and Freedom Square.',
        '<strong>Wien Hauptbahnhof</strong> is on metro line U1 and several tram lines; Stephansplatz is about 10 minutes away by U1.'
      ],
      times: 'Railjet trains run by ČD and ÖBB connect the two cities roughly every two hours in about 1h 30m, via Břeclav. Private operator RegioJet also runs on the corridor, and regional trains with a change in Břeclav fill some gaps.',
      ticketsIntro: 'The same Railjet can be booked through ČD or ÖBB:',
      tickets: [
        ['Saver fare', 'One specific train', 'Cheapest; indicative single fares are often around €10–€20 when booked early.'],
        ['Standard fare', 'Flexible on the chosen day', 'Mid-range.'],
        ['First / Business class', 'More space; Business includes at-seat service', 'A small extra on a short trip.']
      ],
      ticketTips: [
        'Compare ČD, ÖBB and RegioJet for your time slot.',
        'On a short trip like this, a flexible ticket often costs little more than a saver fare.',
        'Brno is also on the Vienna–Prague line, so it works well as a stop on a longer trip.'
      ],
      when: 'Friday afternoons and Sunday evenings are busiest. The Christmas market season in Vienna (late November–December) fills trains early.',
      arrivalIntro: 'Vienna\'s centre is compact and well served by metro and tram. Highlights:',
      arrival: [
        '<strong>St Stephen\'s Cathedral and the Innere Stadt</strong> — the historic centre inside the Ringstrasse.',
        '<strong>The Hofburg</strong> — the former imperial palace, with the Sisi Museum and the Spanish Riding School.',
        '<strong>Schönbrunn Palace</strong> — the summer palace and gardens, reachable by U4.',
        '<strong>MuseumsQuartier and the Naschmarkt</strong> — museums, cafés and the city\'s best-known market.'
      ],
      alt: [
        '<strong>Coach</strong> — Omio lists coaches at around 1h 40m, often cheap.',
        '<strong>Car</strong> — about one and a half to two hours; motorway vignettes are needed in both countries.',
        '<strong>Flying</strong> — not practical for this distance.'
      ]
    },
    'munich-salzburg': {
      stations: [
        '<strong>München Hauptbahnhof</strong> is the main station, with S-Bahn, U-Bahn and trams; Marienplatz is two S-Bahn stops away.',
        '<strong>Salzburg Hauptbahnhof</strong> is about 20 minutes on foot or a short bus ride from the old town on the other side of the Salzach.'
      ],
      times: 'ÖBB Railjet and other long-distance trains take about 1h 30m. Regional trains run by Bayerische Regiobahn (Meridian) take a little under two hours and run frequently through the day. Omio\'s catalogue puts the typical trip at about 1h 40m.',
      ticketsIntro: 'Two very different ways to pay on this short cross-border trip:',
      tickets: [
        ['Long-distance saver fare (DB / ÖBB)', 'One specific Railjet or EC', 'Indicative single fares often start around €15–€30 when booked early.'],
        ['Bayern-Ticket', 'A day ticket for regional trains, valid to Salzburg Hbf', 'Good value for groups, as each extra person adds only a small amount.'],
        ['Flexible long-distance ticket', 'Any train on the day', 'The most expensive option.']
      ],
      ticketTips: [
        'The Bayern-Ticket is valid on regional trains only, not on Railjet or ICE, and on weekdays only from 09:00.',
        'Regional trains take a little longer but do not need a reservation.',
        'Salzburg is a common stop between Munich and Vienna, so it combines well with onward trips.'
      ],
      when: 'The Salzburg Festival (late July–August), Christmas markets and summer weekends are busiest. Morning trains are best for a day trip.',
      arrivalIntro: 'Salzburg\'s old town is compact and walkable. Highlights:',
      arrival: [
        '<strong>The Altstadt</strong> — the old town (a UNESCO World Heritage Site) with the cathedral and Residenzplatz.',
        '<strong>Getreidegasse and Mozart\'s birthplace</strong> — the narrow shopping street and the house where Mozart was born.',
        '<strong>Hohensalzburg Fortress</strong> — reachable by funicular, with views over the city and the Alps.',
        '<strong>Mirabell Palace and Gardens</strong> — on the new-town side, close to the station.'
      ],
      alt: [
        '<strong>Coach</strong> — Omio lists coaches at around 1h 20m.',
        '<strong>Car</strong> — about one and a half hours on the A8; an Austrian motorway vignette is needed after the border.',
        '<strong>Flying</strong> — not practical for this distance.'
      ]
    },
    'zaragoza-barcelona': {
      stations: [
        '<strong>Zaragoza Delicias</strong> is the city\'s high-speed station, west of the centre; buses and Cercanías link it with the Plaza del Pilar area.',
        '<strong>Barcelona Sants</strong> is on metro lines L3 and L5; Plaça de Catalunya is about 10 minutes away by metro.'
      ],
      times: 'High-speed trains on the Madrid–Barcelona line call at Zaragoza and take roughly 1h 20m–1h 40m to Barcelona Sants, with frequent departures through the day. Omio\'s catalogue puts the typical trip at about 1h 40m.',
      ticketsIntro: 'Several operators on the Madrid–Barcelona line stop at Zaragoza, so it is worth comparing them:',
      tickets: [
        ['Ouigo / Avlo (low-cost)', 'One train; bags and seat choice cost extra', 'Often the cheapest; indicative fares can start around €10–€20.'],
        ['Iryo / Renfe AVE standard', 'One train, more included', 'Mid-range.'],
        ['Flexible / premium classes', 'Changes allowed, more space', 'The most expensive.']
      ],
      ticketTips: [
        'Not every Madrid–Barcelona train stops at Zaragoza; check that yours does.',
        'Compare operators for the same hour; the cheapest changes by day.',
        'Some trains continue to Girona and Figueres, useful for the Costa Brava.'
      ],
      when: 'Friday afternoons and Sunday evenings are busiest. Book ahead for the Fiestas del Pilar in Zaragoza (around 12 October) and for summer weekends.',
      arrivalIntro: 'Barcelona is easy to explore by metro and on foot. Highlights:',
      arrival: [
        '<strong>Sagrada Família</strong> — Gaudí\'s basilica; book a timed ticket in advance.',
        '<strong>Barri Gòtic and El Born</strong> — the medieval streets and the Picasso Museum.',
        '<strong>Passeig de Gràcia</strong> — Casa Batlló and Casa Milà.',
        '<strong>Park Güell</strong> — Gaudí\'s hillside park; entry to the monumental area needs a timed ticket.'
      ],
      alt: [
        '<strong>Coach</strong> — Omio lists coaches at around 2h 50m, usually cheaper.',
        '<strong>Car</strong> — about three hours on the AP-2.',
        '<strong>Flying</strong> — not practical for this distance.'
      ]
    },
    'vienna-krems': {
      stations: [
        '<strong>Wien Franz-Josefs-Bahnhof</strong> is the usual departure station, in the 9th district on tram lines D and 5; some trains also stop at Spittelau or Heiligenstadt, which are on the U-Bahn.',
        '<strong>Krems an der Donau</strong> station is a short walk from the old town and the Steiner Tor gate.'
      ],
      times: 'Regional express trains take about an hour, with regular departures through the day. Some journeys run via Tulln with a different departure station in Vienna, so check your connection.',
      ticketsIntro: 'This is a regional trip, so tickets are simple:',
      tickets: [
        ['Single or return ticket', 'Valid on regional trains on the day', 'Fixed fare; no reservation needed.'],
        ['Day or group offers', 'For regional trains in Lower Austria', 'Worth checking for families and groups.'],
        ['Klimaticket', 'Austria\'s annual travel pass', 'Covers this route if you already have one.']
      ],
      ticketTips: [
        'No reservation is needed; buy a ticket before boarding.',
        'Combine the train with a Danube boat between Krems and Melk in season for a classic Wachau day trip.',
        'Bikes are common in summer: check bike rules and spaces on regional trains.'
      ],
      when: 'The Wachau is at its best from spring to autumn: apricot blossom in April, wine harvest in September and October. Boats on the Danube run mainly from spring to autumn.',
      arrivalIntro: 'Krems is the gateway to the Wachau valley (a UNESCO World Heritage Site). Highlights:',
      arrival: [
        '<strong>Krems old town and Stein</strong> — the Steiner Tor and the lanes of the historic centre.',
        '<strong>Kunstmeile Krems</strong> — museums and galleries including the Landesgalerie Niederösterreich.',
        '<strong>Dürnstein</strong> — the village and castle ruins, a short trip up the valley.',
        '<strong>Göttweig Abbey</strong> — the Benedictine abbey on the hill across the Danube.'
      ],
      alt: [
        '<strong>Car</strong> — about an hour from central Vienna.',
        '<strong>Danube boat</strong> — boats run in season along the Wachau, though not from central Vienna to Krems directly.',
        '<strong>Bike</strong> — the Danube cycle path runs through the valley.'
      ]
    },
    'dortmund-munich': {
      stations: [
        '<strong>Dortmund Hauptbahnhof</strong> is in the city centre, with S-Bahn, U-Bahn and regional connections across the Ruhr.',
        '<strong>München Hauptbahnhof</strong> is in central Munich; Marienplatz is two S-Bahn stops away.'
      ],
      times: 'Direct ICE trains take roughly 5h 30m–6h, depending on whether they run via Cologne and Frankfurt or via Hanover and Würzburg. Omio\'s catalogue puts the typical trip at about 5h 40m. There are also frequent connections with one change.',
      ticketsIntro: 'Deutsche Bahn fares depend on how early you book and how flexible you need to be:',
      tickets: [
        ['Super Sparpreis / Sparpreis', 'One specific train', 'Cheapest; indicative single fares often start around €20–€50 when booked early.'],
        ['Flexpreis', 'Any train on the day', 'The most expensive, but fully flexible.'],
        ['First class', 'More space, quieter carriage', 'Often a modest extra on Sparpreis fares.']
      ],
      ticketTips: [
        'A BahnCard 25 or 50 reduces most fares if you travel in Germany often.',
        'Seat reservations are optional but useful on Fridays and Sundays.',
        'Saver fares are tied to a train; if it is delayed, the train-binding is lifted.'
      ],
      when: 'Fridays, Sundays and Oktoberfest (late September–early October) are the busiest. Mid-week departures are typically cheaper.',
      arrivalIntro: 'Munich\'s centre is compact and well served by S-Bahn and U-Bahn. Highlights:',
      arrival: [
        '<strong>Marienplatz</strong> — the New Town Hall and its Glockenspiel, in the heart of the old town.',
        '<strong>Viktualienmarkt</strong> — the open-air food market a few steps away.',
        '<strong>The Residenz</strong> — the former royal palace of the Bavarian rulers.',
        '<strong>Englischer Garten</strong> — one of Europe\'s largest city parks, with the Eisbach surfers.'
      ],
      alt: [
        '<strong>Flying</strong> — about 1h 05m in the air, but with airport transfers total time is similar to the train.',
        '<strong>Coach</strong> — Omio lists coaches at around 8h 45m or more.',
        '<strong>Car</strong> — about six hours or more, depending on traffic.'
      ]
    },
    'lucerne-zermatt': {
      stations: [
        '<strong>Luzern</strong> station is on the lakeshore, a short walk from the Chapel Bridge and the old town.',
        '<strong>Zermatt</strong> is car-free: the station is at the top of the main street, and electric taxis and hotel shuttles wait outside.'
      ],
      times: 'There is no direct train: the usual route changes in Visp (often also in Bern), then takes the Matterhorn Gotthard Bahn up the valley. The trip takes roughly 3h 20m–3h 30m; Omio\'s catalogue puts it at about 3h 20m.',
      ticketsIntro: 'Swiss fares are high, so discounts and passes matter:',
      tickets: [
        ['Saver Day Pass / Supersaver', 'Discounted tickets on SBB', 'Can cut the price considerably when bought early.'],
        ['Half Fare Card', 'Half price on most Swiss trains for a month or a year', 'Good value if you take several trains in Switzerland.'],
        ['Swiss Travel Pass', 'Unlimited travel on most trains, buses and boats', 'Covers this route, including the line to Zermatt.']
      ],
      ticketTips: [
        'Leave a margin at Visp: the connection to Zermatt is timed, but the next train is usually within the hour.',
        'If you drive, park in Täsch and take the shuttle train to Zermatt.',
        'Sit on the right heading up to Zermatt for views into the Mattertal valley.'
      ],
      when: 'Winter (ski season) and July–August are busiest. In clear weather, arrive early to see the Matterhorn before clouds build up in the afternoon.',
      arrivalIntro: 'Zermatt is built around views of the Matterhorn. Highlights:',
      arrival: [
        '<strong>Gornergrat Railway</strong> — the cog railway to a viewpoint facing the Matterhorn and the Gorner Glacier.',
        '<strong>Matterhorn Glacier Paradise</strong> — cable cars to Europe\'s highest viewing platform reachable by cable car.',
        '<strong>Hinterdorf</strong> — the old part of the village, with its wooden barns.',
        '<strong>Five Lakes Walk (5-Seenweg)</strong> — a summer hike with reflections of the Matterhorn.'
      ],
      alt: [
        '<strong>Car</strong> — about three hours to Täsch, then the shuttle train; cars cannot drive into Zermatt.',
        '<strong>Glacier Express</strong> — the scenic train links Zermatt with St. Moritz, not with Lucerne, but can be combined on a longer trip.',
        '<strong>Coach</strong> — not a practical option for this route.'
      ]
    }
  }
};
