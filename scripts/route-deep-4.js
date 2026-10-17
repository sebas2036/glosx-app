/** Contenido ampliado, cuarta tanda (Francia mediterránea, Suiza, Países Bajos–Alemania, Italia). Cifras de Omio (oct-2026); lo demás, orientativo. */
module.exports = {
  stationLines: {
    'paris-marseille': 'Paris Gare de Lyon → Marseille Saint-Charles', 'lyon-marseille': 'Lyon Part-Dieu → Marseille Saint-Charles',
    'marseille-nice': 'Marseille Saint-Charles → Nice-Ville', 'zurich-geneva': 'Zurich HB → Geneva Cornavin',
    'amsterdam-cologne': 'Amsterdam Centraal → Cologne Hbf', 'milan-naples': 'Milano Centrale → Napoli Centrale'
  },
  deep: {
    'paris-marseille': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> is the departure station, with Metro lines 1 and 14 and RER A and D. Arrive with time to spare: it is large and has several train halls.',
        '<strong>Marseille Saint-Charles</strong> sits on a hill above the centre; a monumental staircase leads down towards the city, and the metro and trams run from the station.'
      ],
      times: 'Omio lists about 18 trains a day on this route, 16 of them direct, with the first around 05:00 and the last in the late evening. The fastest direct trains take a little over three hours (Omio\'s fastest is 3 h 3 min); trains with a change take longer. Besides SNCF\'s TGV INOUI, Omio also shows Frecciarossa services on this line.',
      ticketsIntro: 'Prices on this route swing widely between booking early and buying on the day, so the fare type matters:',
      tickets: [
        ['Advance fare', 'One specific train, limited changes', 'The cheapest. Omio\'s lowest listed fare is about €19, and it goes first.'],
        ['Standard / mid-range', 'Fewer restrictions', 'Mid-range; on the day we looked, mid-day fares were roughly €70–€140.'],
        ['Flexible', 'Any train, changes allowed', 'The most expensive; some same-day trains were listed at €180 or more.']
      ],
      ticketTips: [
        'Omio\'s fare data points to booking about 91 days ahead for the lowest prices.',
        'Tuesday is the cheapest day to travel on average; Thursday is the busiest and Sunday the quietest.',
        'Compare SNCF and Frecciarossa departures on the same day: the cheaper one changes by hour.'
      ],
      when: 'High season is July to September and low season January to March; September is the cheapest month on average. Outside school holidays, a mid-morning midweek train is usually calmer and cheaper than a Friday evening.',
      arrivalIntro: 'Marseille is a port city that rewards a slow first day. Highlights:',
      arrival: [
        '<strong>The Vieux-Port</strong> — the old harbour, with the fish market in the morning and plenty of terraces.',
        '<strong>Le Panier</strong> — the oldest neighbourhood, with narrow streets and street art.',
        '<strong>Notre-Dame de la Garde</strong> — the hilltop basilica with the best view over the city and the sea.',
        '<strong>The Calanques and Cassis</strong> — limestone inlets and a small harbour town, reachable on a short regional train or bus ride.'
      ],
      alt: [
        '<strong>Coach</strong> — cheaper but much longer, usually seven hours or more.',
        '<strong>Car</strong> — roughly 775 km, about seven hours without traffic, plus tolls.',
        '<strong>Flying</strong> — around 1 h 20 min in the air, but airport transfers and security make the train competitive door to door.'
      ]
    },
    'lyon-marseille': {
      stations: [
        '<strong>Lyon Part-Dieu</strong> is the main station for long-distance trains, with metro, tram and bus connections into the centre. Some regional services use <strong>Lyon Perrache</strong> instead.',
        '<strong>Marseille Saint-Charles</strong> is the terminus, on a hill above the city, with metro lines and a staircase down towards the centre.'
      ],
      times: 'Omio lists about 17 trains a day, 15 of them direct. The fastest take roughly an hour and a half (Omio\'s fastest is 1 h 27 min) and the average, counting slower trains, is around two hours. The line follows the Rhône valley, and many services call at Avignon TGV or Valence TGV, so check whether a train is direct or has a stop.',
      ticketsIntro: 'Fares are moderate on this short high-speed run, and the same train can vary a lot by day:',
      tickets: [
        ['Advance fare', 'One specific train', 'The cheapest. Omio\'s lowest listed fare is about €19.'],
        ['Standard', 'Fewer restrictions', 'Mid-range, with some flexibility to change.'],
        ['Flexible', 'Any train, changes allowed', 'The most expensive; useful if plans may change.']
      ],
      ticketTips: [
        'Omio\'s fare data points to booking about 91 days ahead for the lowest prices.',
        'Tuesday is the cheapest day on average, Friday the busiest and Sunday the quietest.',
        'Coaches are cheaper (Omio lists them from about €10) if you do not mind a longer journey.'
      ],
      when: 'High season is July to September and low season October to December. The Friday evening trains are the first to sell out, so for a weekend trip book early or travel on Thursday.',
      arrivalIntro: 'Marseille is easy to start on foot from the station. Highlights:',
      arrival: [
        '<strong>The Vieux-Port and the Fort Saint-Jean</strong> — the historic harbour and the fortress at its mouth.',
        '<strong>The MuCEM</strong> — the museum of Mediterranean civilisations, with a footbridge to the old fort.',
        '<strong>Le Panier</strong> — the old quarter, good for an unhurried lunch.',
        '<strong>Notre-Dame de la Garde</strong> — the hilltop basilica overlooking the city.'
      ],
      alt: [
        '<strong>Coach</strong> — usually a little under four hours and cheaper than the train.',
        '<strong>Car</strong> — about 315 km down the A7, roughly three hours without traffic, plus tolls.',
        '<strong>Flying</strong> — not practical for this pair; the train is faster door to door.'
      ]
    },
    'marseille-nice': {
      stations: [
        '<strong>Marseille Saint-Charles</strong> is the departure station, with metro lines and a staircase down towards the city.',
        '<strong>Nice-Ville</strong> is the main station, a short walk or a tram ride from the Promenade des Anglais and the old town.'
      ],
      times: 'Omio lists about 13 trains a day, all of them direct, between roughly 05:30 and the evening. The fastest takes about 2 h 22 min and the average is around 2 h 34 min. Some services are faster TGV INOUI trains and others are slower regional TER trains run under the ZOU! brand, which is why journey times vary. The line follows the coast and usually calls at Toulon, Cannes and Antibes.',
      ticketsIntro: 'Fares depend on whether you take a TGV or a regional train, so compare both:',
      tickets: [
        ['TGV INOUI advance', 'One specific train', 'Mid-range. Omio\'s lowest listed fare on this route is about €21.'],
        ['Regional TER (ZOU!)', 'Flexible on the day, slower', 'Usually the cheapest way by rail and no seat reservation needed.'],
        ['TGV INOUI flexible', 'Any train, changes allowed', 'The most expensive.']
      ],
      ticketTips: [
        'Omio\'s fare data points to booking about 77 days ahead for the lowest prices.',
        'Wednesday is the cheapest day on average, Monday the busiest and Saturday the quietest.',
        'Coaches are the cheapest option (Omio lists them from about €5) but take longer.'
      ],
      when: 'High season is July to September, when the coast trains fill up, and low season January to March. If you travel in summer, book the TGV early and avoid Friday and Sunday afternoons.',
      arrivalIntro: 'Nice is compact and very walkable from the station. Highlights:',
      arrival: [
        '<strong>The Promenade des Anglais</strong> — the seafront walk, a short distance from the station.',
        '<strong>Vieux Nice and the Cours Saleya market</strong> — narrow streets, food stalls and flowers.',
        '<strong>Castle Hill</strong> — a short climb for the best view over the bay.',
        '<strong>Day trips by train</strong> — Monaco and Villefranche-sur-Mer are a few minutes away.'
      ],
      alt: [
        '<strong>Coach</strong> — the cheapest option, but slower and less comfortable than the coastal train.',
        '<strong>Car</strong> — about 200 km on the A8, roughly two and a half hours without traffic, plus tolls and parking.',
        '<strong>Flying</strong> — not practical for this pair; the train is faster door to door.'
      ]
    },
    'zurich-geneva': {
      stations: [
        '<strong>Zurich HB</strong> (Hauptbahnhof) is Switzerland\'s busiest station, with trams and S-Bahn under one roof and the old town a few minutes\' walk away.',
        '<strong>Geneva Cornavin</strong> is the main station in the centre, a short walk from the lake. Some trains continue to <strong>Geneva Airport</strong>.'
      ],
      times: 'Omio lists about 38 services a day on this corridor, 8 of them listed as direct; the others involve a change. The fastest journey is about 2 h 34 min and the average, counting slower options, is around 3 h 16 min. The live search marks which trains are direct, so it is worth choosing one of those if you want the simplest trip.',
      ticketsIntro: 'Swiss fares are high compared with neighbouring countries, so the type of ticket matters more than usual:',
      tickets: [
        ['Saver / advance fare', 'One specific train', 'The cheapest. Omio\'s lowest listed fare is about €51.'],
        ['Standard / point-to-point', 'Fewer restrictions', 'Noticeably more; the full flexible fare can be several times the advance price.'],
        ['Swiss Half Fare Card', 'Discount card', 'Halves many fares; it pays off if you make several trips in Switzerland.']
      ],
      ticketTips: [
        'Omio\'s fare data points to booking about 77 days ahead for the lowest prices.',
        'Sunday is the cheapest day on average (and the quietest); Thursday is the busiest.',
        'If you will take several trains in Switzerland, compare a Swiss Travel Pass or a Half Fare Card with single tickets.'
      ],
      when: 'High season is July to September and low season January to March. Business travel makes Thursday the busiest day, and Sunday evening trains back to Zurich are often full.',
      arrivalIntro: 'Geneva sits on the lake and is easy to explore on foot. Highlights:',
      arrival: [
        '<strong>The Jet d\'Eau and the lakefront</strong> — an easy walk from Cornavin.',
        '<strong>The old town and St Peter\'s Cathedral</strong> — cobbled streets and a tower with views over the city.',
        '<strong>Lake cruises</strong> — boats leave from the quays in summer.',
        '<strong>Day trips by train</strong> — Lausanne and Montreux are on the lake line.'
      ],
      alt: [
        '<strong>Flying</strong> — around 50 minutes in the air, but transfers and security make the train competitive door to door.',
        '<strong>Coach</strong> — cheaper but slower.',
        '<strong>Car</strong> — roughly 280 km on the motorway, around three hours, plus the Swiss motorway sticker.'
      ]
    },
    'amsterdam-cologne': {
      stations: [
        '<strong>Amsterdam Centraal</strong> is the main station, with trams, metro and ferries behind it and the old centre a short walk away.',
        '<strong>Cologne Hbf</strong> is right next to the cathedral, so the first landmark is on your doorstep when you arrive.'
      ],
      times: 'Omio lists about 7 services a day, only 2 of them direct; the others involve a change. The fastest journey Omio lists is about 2 h 28 min and the average, counting slower options, is around 3 h 22 min. The live search shows which services are direct, so check it before you buy. International ICE trains usually call at Utrecht and Arnhem on the Dutch side.',
      ticketsIntro: 'Deutsche Bahn runs the ICE on this route, with fares that depend on how early you book:',
      tickets: [
        ['Sparpreis / advance fare', 'One specific train', 'The cheapest. Omio\'s lowest listed fare is about €20.'],
        ['Flexpreis', 'Any train on the day', 'Noticeably more expensive.'],
        ['Coach', 'Cheaper, slower', 'Omio lists coaches from about €11.']
      ],
      ticketTips: [
        'Omio\'s fare data points to booking about 28 days ahead for the lowest prices.',
        'Tuesday is the cheapest day on average, Thursday the busiest and Saturday the quietest.',
        'Direct trains are few, so check the live search before choosing a combination with a change.'
      ],
      when: 'High season runs from October to December, partly because of the Christmas markets in Cologne, and low season from January to March. If you travel in Advent, book early.',
      arrivalIntro: 'Cologne is compact and the station is in the middle of it. Highlights:',
      arrival: [
        '<strong>The cathedral</strong> — climb the tower for the view over the Rhine.',
        '<strong>The Old Town (Altstadt)</strong> — narrow streets and traditional Kölsch beer halls.',
        '<strong>The Rhine promenade and the Hohenzollern Bridge</strong> — a short walk from the station.',
        '<strong>The Christmas markets</strong> — in late November and December, among the biggest in Germany.'
      ],
      alt: [
        '<strong>Coach</strong> — the cheapest option, from about €11 on Omio.',
        '<strong>Car</strong> — about 260 km, roughly two and a half to three hours without traffic.',
        '<strong>Flying</strong> — not practical for this pair; airports and security make it slower than the train.'
      ]
    },
    'milan-naples': {
      stations: [
        '<strong>Milano Centrale</strong> is the main station, with metro lines M2 and M3 and a large concourse; give yourself time to find your platform.',
        '<strong>Napoli Centrale</strong> sits in the middle of the city on Piazza Garibaldi, with the metro and the Circumvesuviana trains to Pompeii and Sorrento from the same area. Some high-speed trains use <strong>Napoli Afragola</strong>, outside the city, so check the arrival station.'
      ],
      times: 'Omio lists about 68 services a day, 60 of them direct, which makes this one of the best-served long routes in Italy. The fastest journey is about 4 h 17 min and the average, counting slower trains, around 5 h 26 min. Trains usually call at Bologna, Florence and Rome on the way. Two companies compete on the route: Trenitalia (Frecciarossa) and Italo.',
      ticketsIntro: 'Frecciarossa and Italo both sell cheap early fares, so compare them on the same day:',
      tickets: [
        ['Frecciarossa / Italo economy', 'One specific train, limited changes', 'The cheapest. Omio\'s lowest listed fare is about €19.'],
        ['Standard / base fare', 'Fewer restrictions', 'Mid-range, with some flexibility.'],
        ['Flexible / business', 'Any train, changes allowed', 'The most expensive; useful if your plans may change.']
      ],
      ticketTips: [
        'Omio\'s fare data points to booking about 91 days ahead for the lowest prices.',
        'Monday is the cheapest day on average, Tuesday the busiest and Saturday the quietest.',
        'Coaches are the cheapest option, from about €9 on Omio, but take far longer than the train.'
      ],
      when: 'High season is July to September and low season January to March. Friday afternoons and Sunday evenings are the busiest; midweek mid-morning trains are usually easier.',
      arrivalIntro: 'Naples is loud, dense and rewarding. Highlights:',
      arrival: [
        '<strong>Via dei Tribunali and Spaccanapoli</strong> — the historic centre, with the classic pizzerias.',
        '<strong>The National Archaeological Museum</strong> — many of the finds from Pompeii and Herculaneum.',
        '<strong>The waterfront and Castel dell\'Ovo</strong> — a long seafront walk with views of Vesuvius.',
        '<strong>Day trips</strong> — Pompeii and Sorrento by Circumvesuviana, and ferries to Capri and Ischia.'
      ],
      alt: [
        '<strong>Flying</strong> — about an hour and twenty minutes in the air, but airport transfers narrow the gap with the train.',
        '<strong>Coach</strong> — much cheaper but very long, a full day or a night.',
        '<strong>Car</strong> — about 770 km on the A1, roughly eight hours without traffic, plus tolls.'
      ]
    }
  }
};
