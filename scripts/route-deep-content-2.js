/** Contenido ampliado, segunda tanda (rutas del cluster París/Benelux/Suiza/Alemania/Italia). Misma estructura que route-deep-content.js. */
module.exports = {
  stationLines: {
    'geneva-paris': 'Geneva Cornavin → Paris Gare de Lyon', 'paris-zurich': 'Paris Gare de Lyon → Zürich HB',
    'brussels-paris': 'Brussels-Midi → Paris Gare du Nord', 'brussels-bruges': 'Brussels (Midi, Central or Nord) → Bruges',
    'nice-monaco': 'Nice-Ville → Monaco-Monte-Carlo', 'munich-berlin': 'München Hbf → Berlin Hbf', 'rome-venice': 'Roma Termini → Venezia Santa Lucia'
  },
  deep: {
    'geneva-paris': {
      stations: [
        '<strong>Geneva Cornavin</strong> is the main station, in the city centre, roughly a 10–15 minute walk from the lake and the Old Town. Trams and buses leave from outside.',
        '<strong>Paris Gare de Lyon</strong> is served by Metro lines 1 and 14 and RER A and D, so you can reach most of central Paris without changing more than once.'
      ],
      times: 'The direct TGV Lyria takes roughly three hours, with a handful of departures a day rather than every half hour, so it is worth choosing your departure first and then looking for the fare. Slower options with a change in Lyon or Bellegarde exist, but the direct train is almost always the better choice.',
      ticketsIntro: 'The direct service is sold at a range of fares; the cheapest are for a specific train and sell out first:',
      tickets: [
        ['Saver (Advance)', 'One specific train', 'Cheapest. Indicative single fares often start around €30–€60 when booked ahead.'],
        ['Standard', 'Fewer restrictions', 'Mid-range, with some flexibility to change.'],
        ['Flexible / First', 'Fully flexible or first class', 'The most expensive; useful if your plans may move.']
      ],
      ticketTips: [
        'Book as soon as tickets open for your date, and check both TGV Lyria and any SNCF-only options.',
        'Switzerland is outside the EU, so carry your passport or ID card even though there are normally no queues at the border.',
        'Reserve a seat on the direct train; seat reservations are included in the ticket price.'
      ],
      when: 'Friday afternoons, Sunday evenings and school holidays are the busiest. A midweek morning departure is typically the cheapest and easiest. Because there are only a few direct trains a day, a sold-out train can leave you with a much slower connection.',
      arrivalIntro: 'Geneva is a good launching point for the lake and the Alps; Paris is the other end of the line. Highlights in Geneva:',
      arrival: [
        '<strong>The Jet d\'Eau and the lakefront</strong> — an easy walk from Cornavin.',
        '<strong>The Old Town and St Pierre Cathedral</strong> — cobbled streets and a tower with city views.',
        '<strong>Palais des Nations and the museums quarter</strong> — good for a half-day indoors.',
        '<strong>Day trips by train</strong> — Lausanne, Montreux and Annecy are all reachable from Geneva.'
      ],
      alt: [
        '<strong>Flying</strong> — roughly 1h 20m in the air, but add airport transfers and security; the train is usually competitive door to door.',
        '<strong>Coach</strong> — a long overnight or day option, roughly eight to nine hours, and cheaper than the train.',
        '<strong>Car</strong> — about five hours, plus Swiss motorway vignette and French tolls.'
      ]
    },
    'paris-zurich': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> is the departure point for TGV Lyria; it connects to Metro lines 1 and 14 and RER A and D.',
        '<strong>Zürich HB</strong> is the central station, a short walk from the lake and the Old Town, with trams and S-Bahn connections beneath.'
      ],
      times: 'The direct TGV Lyria takes roughly four hours, usually calling at Basel along the way, and runs a few times a day. Faster is not on offer, so the departure time matters more than the price when you plan a day of travel. Arriving in the afternoon leaves time for an evening by the lake.',
      ticketsIntro: 'Fares depend on how early you book and which of the few daily trains you choose:',
      tickets: [
        ['Saver (Advance)', 'One specific train', 'Cheapest. Indicative single fares often start around €40–€70 when booked ahead.'],
        ['Standard', 'Fewer restrictions', 'Mid-range; some flexibility to change.'],
        ['Flexible / First', 'Fully flexible or first class', 'The most expensive; useful if plans may change.']
      ],
      ticketTips: [
        'Book early for peak dates; the cheapest seats on a handful of daily trains sell out first.',
        'Switzerland is outside the EU, so carry a passport or ID card.',
        'Compare with a change in Basel, which can be cheaper but takes longer and risks a missed connection.'
      ],
      when: 'Fridays, Sundays and school holidays are the busiest. Midweek mornings are typically best value. Check the exact days the earliest and latest direct trains run, since services vary.',
      arrivalIntro: 'Zürich is a compact, walkable city on a lake. Highlights from the station:',
      arrival: [
        '<strong>The Altstadt and Bahnhofstrasse</strong> — the Old Town and the city\'s main shopping street.',
        '<strong>Lake Zürich</strong> — promenades, boat services and summer swimming spots.',
        '<strong>Uetliberg</strong> — a short train ride from the station for the city\'s best view.',
        '<strong>Day trips</strong> — Lucerne, Basel and the Rhine Falls are all within an hour or so by train.'
      ],
      alt: [
        '<strong>Flying</strong> — about 1h 20m in the air, but with airport transfers and security the train is competitive.',
        '<strong>Coach</strong> — an overnight or long-day option, cheaper but far slower.',
        '<strong>Car</strong> — roughly seven hours, with Swiss motorway vignette and French tolls.'
      ]
    },
    'brussels-paris': {
      stations: [
        '<strong>Brussels-Midi (Brussel-Zuid)</strong> is the international station. It has metro and tram links into the centre; the Grand-Place is a short ride or about a 25-minute walk.',
        '<strong>Paris Gare du Nord</strong> connects to Metro lines 4 and 5 and RER B and D, so it is easy to reach most of Paris.'
      ],
      times: 'The Eurostar takes roughly 1h 20m–1h 30m and runs at frequent intervals during the day. Both cities are in the Schengen area, so there are no passport checks, but there are ticket and security checks before boarding; arriving around 30 minutes before departure is the usual guidance.',
      ticketsIntro: 'Eurostar uses dynamic pricing, so the earliest bookers get the lowest prices:',
      tickets: [
        ['Standard (cheapest)', 'One specific train, limited changes', 'Indicative single fares often start around €30–€50 when booked ahead.'],
        ['Standard Premier / Plus', 'More flexibility and extras', 'Mid-range, depending on tier.'],
        ['Business Premier', 'Fully flexible', 'The most expensive; includes lounge access and food.']
      ],
      ticketTips: [
        'Book as soon as tickets open; the cheapest seats go first on busy dates.',
        'Compare with a change in Lille or other regional options; the direct train is almost always the fastest and simplest.',
        'Youth and some group fares can reduce the price; check the options on the booking page.'
      ],
      when: 'Fridays, Sundays and holidays are the busiest. Midweek midday trains are usually quieter. If you are connecting from a flight or another train, allow a sensible buffer for the security checks.',
      arrivalIntro: 'Paris needs no introduction, but a few notes if you are arriving at Gare du Nord:',
      arrival: [
        '<strong>Montmartre and Sacré-Cœur</strong> — a short walk or Metro ride from the station.',
        '<strong>Canal Saint-Martin</strong> — a pleasant, local-feeling walk close to Gare du Nord.',
        '<strong>The Louvre and the Seine</strong> — easy by Metro line 4 or RER B.',
        '<strong>Day trips by train</strong> — Versailles, Chantilly and Rouen are all feasible from Paris.'
      ],
      alt: [
        '<strong>Coach</strong> — services take roughly four hours and are cheaper but slower, and subject to road traffic.',
        '<strong>Car</strong> — about three hours depending on traffic, plus tolls and parking costs in Paris.',
        '<strong>Flying</strong> — not practical for this pair; the train is faster door to door.'
      ]
    },
    'brussels-bruges': {
      stations: [
        '<strong>Brussels Midi, Central or Nord</strong> — the intercity trains to Bruges call at all three main Brussels stations, so choose the one nearest your hotel.',
        '<strong>Bruges station</strong> is about 1.5 km from the Markt, roughly a 20–25 minute walk, with buses and taxis outside.'
      ],
      times: 'Intercity trains take roughly 50 minutes to an hour and run about every half hour through the day, so you can turn up and go without planning around one departure. A few services are slower stopping trains, so check the journey time shown for the train you choose.',
      ticketsIntro: 'The Belgian national railway (SNCB) has simple, fixed fares for this line:',
      tickets: [
        ['Standard single', 'Any train on the day', 'Usually under €20 each way.'],
        ['Return / day trip', 'Outbound and return', 'Often cheaper than two singles; check the options.'],
        ['Weekend or reduced fares', 'Fri–Sun discounts', 'SNCB runs weekend discounts on many routes; check the booking page.']
      ],
      ticketTips: [
        'There is no big saving from booking months ahead on this route; fares are mostly fixed, so you can buy on the day.',
        'Validate or scan your ticket as shown on the app before boarding.',
        'If you plan a day trip, buy a return and set off early to beat the coach groups.'
      ],
      when: 'Bruges is crowded in summer and on weekends, especially between late morning and mid-afternoon. Arriving early in the morning or staying until evening is the best way to enjoy the canals with fewer people.',
      arrivalIntro: 'Bruges is compact and best explored on foot. Highlights:',
      arrival: [
        '<strong>The Markt and the Belfry</strong> — the medieval market square and its 13th-century bell tower.',
        '<strong>The canals and the Beguinage</strong> — peaceful corners away from the main streets.',
        '<strong>Burg square and the Basilica of the Holy Blood</strong> — the old civic centre.',
        '<strong>Boat tour or a walk along the canals</strong> — a classic way to see the old town in an hour.'
      ],
      alt: [
        '<strong>Coach</strong> — services exist but take longer than the train.',
        '<strong>Car</strong> — about an hour, but parking in Bruges is limited and expensive; park outside the centre.'
      ]
    },
    'nice-monaco': {
      stations: [
        '<strong>Nice-Ville</strong> is the main station, a short tram ride or about a 15–20 minute walk from the Promenade des Anglais.',
        '<strong>Monaco-Monte-Carlo</strong> is an underground station; lifts and escalators take you up to the Monte-Carlo casino area and the port.'
      ],
      times: 'The coastal TER takes roughly 20–25 minutes and runs frequently, typically every 15–30 minutes through the day, so you can turn up and go. It stops at small coastal stations such as Villefranche-sur-Mer, Beaulieu-sur-Mer and Èze-sur-Mer on the way, and the views of the Mediterranean are some of the best on the French Riviera.',
      ticketsIntro: 'This is a regional line with simple fixed fares rather than advance prices:',
      tickets: [
        ['Single ticket', 'Any TER on the day', 'Usually a few euros each way.'],
        ['Return', 'Outbound and return', 'Often the same price as two singles.'],
        ['Day pass / regional ticket', 'Unlimited local travel', 'Worth checking if you plan several coastal stops.']
      ],
      ticketTips: [
        'There is nothing to be gained by booking early: just buy at the machine or on the app and go.',
        'On the way from Nice to Monaco, sit on the right-hand side for the best sea views.',
        'Stop in Villefranche-sur-Mer or Èze on the way back for a quick coastal detour.'
      ],
      when: 'Mornings and late afternoons in summer are busy with day-trippers. Early morning departures give you quieter trains and cooler walks in Monaco. Allow extra time on Grand Prix and major event weekends.',
      arrivalIntro: 'Monaco is small enough to cover on foot in a day. Highlights:',
      arrival: [
        '<strong>The Prince\'s Palace and the Rock</strong> — the old town of Monaco-Ville, with views over the harbour.',
        '<strong>Monte-Carlo Casino and the Place du Casino</strong> — the best-known square and its gardens.',
        '<strong>The Oceanographic Museum</strong> — an aquarium and museum on the cliff above the sea.',
        '<strong>Port Hercule</strong> — the main harbour, a good place for lunch.'
      ],
      alt: [
        '<strong>Bus</strong> — a coastal bus runs between Nice and Monaco, slower than the train but very cheap.',
        '<strong>Car</strong> — about 30–45 minutes, but traffic and parking in Monaco make it a poor choice.',
        '<strong>Walking or cycling</strong> — the coast path is dramatic but long, and best kept for a separate day.'
      ]
    },
    'munich-berlin': {
      stations: [
        '<strong>München Hauptbahnhof</strong> is the main station, with S-Bahn, U-Bahn and the city\'s Old Town a short walk away.',
        '<strong>Berlin Hauptbahnhof</strong> is a modern glass station north of the centre. S-Bahn and U-Bahn services take you to the main districts; the Brandenburg Gate is roughly a 20-minute walk.'
      ],
      times: 'The fastest ICE services take roughly four hours, with the quickest "Sprinter" trains calling at very few stations. Trains typically run at least once an hour through the day, so you can pick the departure that suits you. Slower ICE services with more stops add a little time, so check the journey time of the train you choose.',
      ticketsIntro: 'Deutsche Bahn sells a range of fares for the same train, from cheap saver fares to fully flexible tickets:',
      tickets: [
        ['Sparpreis (saver)', 'One specific train, limited changes', 'Cheapest. Indicative single fares often start in the €20s–€50s when booked early.'],
        ['Flexpreis', 'Any train on the day', 'Mid to high; the standard flexible fare, which can be well above €100.'],
        ['Super Sparpreis', 'Cheapest, strict conditions', 'Limited availability and lower prices; sells out first.']
      ],
      ticketTips: [
        'Book as soon as tickets open for your date; the cheapest saver fares are limited and rise as the train fills.',
        'A <strong>BahnCard 25 or 50</strong> pays for itself quickly if you take several long trips in Germany.',
        'Reserve a seat on a busy train; reservations are cheap and worth it on Fridays and Sundays.'
      ],
      when: 'Friday evenings, Sunday afternoons and school holidays are the busiest. Weekday mid-morning trains are typically cheaper and quieter. If you want quiet, look for the quiet coach, which the train indicates.',
      arrivalIntro: 'Berlin is large; use the S-Bahn and U-Bahn to move between districts. Highlights:',
      arrival: [
        '<strong>The Brandenburg Gate and Reichstag</strong> — reachable on foot from the main station; book the Reichstag dome online.',
        '<strong>Museum Island</strong> — a UNESCO-listed island with several major museums.',
        '<strong>East Side Gallery and Kreuzberg</strong> — the surviving stretch of the Wall and a lively food neighbourhood.',
        '<strong>Charlottenburg and the West</strong> — palace, boulevards and quieter areas.'
      ],
      alt: [
        '<strong>Flying</strong> — roughly 1 hour in the air, but with airport transfers and security the train is competitive and arrives in the centre.',
        '<strong>Coach</strong> — a night or long day option, often far cheaper but about seven to nine hours.',
        '<strong>Car</strong> — roughly six hours depending on traffic, plus fuel and parking.'
      ]
    },
    'rome-venice': {
      stations: [
        '<strong>Roma Termini</strong> is Rome\'s main station, with Metro lines A and B and buses. Both Frecciarossa and Italo services leave from here.',
        '<strong>Venezia Santa Lucia</strong> sits on the Grand Canal. From the station you walk or take a vaporetto (water bus); some trains instead stop at Venezia Mestre on the mainland, so check which station your ticket says.'
      ],
      times: 'High-speed Frecciarossa and Italo trains take roughly 3h 45m–4h, with departures about once an hour or better through the day, and some slower regional options that take much longer. Trains normally stop at Florence and sometimes Bologna, which makes this a good route for breaking the trip.',
      ticketsIntro: 'Frecciarossa (Trenitalia) and Italo compete on this route, which keeps advance fares reasonable:',
      tickets: [
        ['Super Economy / Economy', 'One specific train, limited changes', 'Cheapest. Indicative single fares often start in the €30s–€50s when booked ahead.'],
        ['Base', 'More flexibility to change', 'Mid-range.'],
        ['Flex / Prima', 'Fully flexible or first class', 'The most expensive; useful if plans may change.']
      ],
      ticketTips: [
        'Compare Frecciarossa and Italo on the same date; the cheaper operator changes day by day.',
        'Book as soon as tickets open for your date; the lowest fares go first.',
        'Seat reservations are included in the ticket price on high-speed trains; there is no need to buy a separate one.'
      ],
      when: 'Friday afternoons, Sunday evenings and Easter and summer holidays are the busiest and most expensive. Midweek mornings are typically the best value. Allow extra time in Venice, because vaporetti are slow and crowded in peak season.',
      arrivalIntro: 'Venice rewards getting lost. From the station, it is worth walking at least part of the way. Highlights:',
      arrival: [
        '<strong>The Grand Canal</strong> — take the Line 1 vaporetto for a slow, cheap ride down the whole canal.',
        '<strong>Piazza San Marco and the Basilica</strong> — go early to beat the crowds.',
        '<strong>Rialto and the Cannaregio district</strong> — quieter streets, local bars and the old Jewish Ghetto.',
        '<strong>Burano and Murano</strong> — island day trips by vaporetto from the Fondamente Nove.'
      ],
      alt: [
        '<strong>Flying</strong> — about 1h 15m in the air, but Marco Polo Airport is on the mainland and the transfer into Venice adds time.',
        '<strong>Night train</strong> — occasionally available between Rome and the north, check the live timetable.',
        '<strong>Car</strong> — roughly five to six hours, but cars are not allowed in Venice itself.'
      ]
    }
  }
};
