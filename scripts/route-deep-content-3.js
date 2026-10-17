/** Contenido ampliado, tercera tanda (cluster París/Francia/Alemania). Misma estructura que route-deep-content.js. */
const T = (a, b, c) => [a, b, c];
module.exports = {
  stationLines: {
    'paris-lyon': 'Paris Gare de Lyon → Lyon Part-Dieu', 'paris-bordeaux': 'Paris Montparnasse → Bordeaux Saint-Jean',
    'paris-nice': 'Paris Gare de Lyon → Nice-Ville', 'paris-barcelona': 'Paris Gare de Lyon → Barcelona Sants',
    'basel-paris': 'Basel SBB → Paris Gare de l\'Est', 'frankfurt-paris': 'Frankfurt Hbf → Paris Gare de l\'Est'
  },
  deep: {
    'paris-lyon': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> has Metro lines 1 and 14 and RER A and D. Some low-cost Ouigo trains leave from other Paris-area stations instead, so check the departure station on your ticket.',
        '<strong>Lyon Part-Dieu</strong> is the main station for the business district and has metro and tram connections into the centre. Some trains also call at <strong>Lyon Perrache</strong>, closer to the Presqu\'île and the confluence of the rivers.'
      ],
      times: 'The fastest TGV trains take roughly two hours, and there are departures through the day at short intervals, so you rarely need to plan around one train. Low-cost Ouigo services take about the same time but use different stations and have stricter luggage rules.',
      ticketsIntro: 'SNCF\'s TGV INOUI and the low-cost Ouigo both run on this line, so it is worth comparing them:',
      tickets: [
        ['Ouigo (low-cost)', 'One specific train, strict luggage rules', 'Cheapest. Indicative single fares often start around €10–€25 when booked early.'],
        ['TGV INOUI Prem\'s / advance', 'One specific train', 'Mid-range; indicative single fares often start around €25–€60 when booked ahead.'],
        ['TGV INOUI flexible', 'Any train, changes allowed', 'The most expensive; useful if plans may change.']
      ],
      ticketTips: [
        'Compare Ouigo and TGV INOUI on the same day; Ouigo is not always the cheapest once bags and seats are added.',
        'A <strong>youth or senior card</strong> from SNCF can reduce many fares by around 30%.',
        'Book as soon as sales open for your date; the cheapest seats go first.'
      ],
      when: 'Fridays, Sundays and school holidays are the busiest. Midweek mid-morning is typically cheapest and quietest. Allow time at Gare de Lyon, which is large and has several train halls.',
      arrivalIntro: 'Lyon is compact and a joy to explore on foot. Highlights:',
      arrival: [
        '<strong>Vieux Lyon and the traboules</strong> — the Renaissance old town and its hidden passageways.',
        '<strong>Fourvière Basilica</strong> — a funicular ride up from Vieux Lyon for the best view of the city.',
        '<strong>Les Halles de Lyon Paul Bocuse</strong> — the covered food market, good for lunch.',
        '<strong>The Presqu\'île and the Croix-Rousse</strong> — shopping streets, squares and the old silk-weavers\' district.'
      ],
      alt: [
        '<strong>Coach</strong> — services take roughly five to six hours and are cheaper but much slower.',
        '<strong>Car</strong> — about four and a half to five hours, plus tolls and city parking.',
        '<strong>Flying</strong> — not practical for this pair; the train is faster door to door.'
      ]
    },
    'paris-bordeaux': {
      stations: [
        '<strong>Paris Montparnasse</strong> is the departure station for the Atlantic high-speed line, with Metro lines 4, 6, 12 and 13.',
        '<strong>Bordeaux Saint-Jean</strong> is about 3 km south of the centre. The tram connects it with the Place de la Bourse and the old town in roughly 15–20 minutes.'
      ],
      times: 'Since the high-speed line to Bordeaux opened in 2017, the fastest TGV trains take a little over two hours. Departures are frequent through the day, from early morning to the evening, so a day trip in either direction is realistic, although a night in Bordeaux is much more relaxed.',
      ticketsIntro: 'SNCF\'s TGV INOUI and the low-cost Ouigo both serve Bordeaux, and prices can differ a lot by date:',
      tickets: [
        ['Ouigo (low-cost)', 'One specific train, strict luggage rules', 'Cheapest. Indicative single fares often start around €15–€30 when booked early.'],
        ['TGV INOUI advance', 'One specific train', 'Mid-range; indicative single fares often start around €30–€70 when booked ahead.'],
        ['TGV INOUI flexible', 'Any train, changes allowed', 'The most expensive.']
      ],
      ticketTips: [
        'Book as early as possible; Friday and Sunday trains are the first to sell out at low fares.',
        'A <strong>youth or senior card</strong> from SNCF can reduce many fares by around 30%.',
        'Compare Ouigo and TGV INOUI on the same day.'
      ],
      when: 'Fridays, Sundays and summer holidays are the busiest and priciest. Mid-morning midweek trains are usually cheapest. Bordeaux is also popular in the wine harvest weeks, so book accommodation early.',
      arrivalIntro: 'Bordeaux is a handsome, walkable city. Highlights:',
      arrival: [
        '<strong>Place de la Bourse and the Miroir d\'eau</strong> — the 18th-century square and the reflecting pool on the quays.',
        '<strong>La Cité du Vin</strong> — a museum dedicated to the world of wine, on the river.',
        '<strong>The Chartrons district</strong> — antiques, cafés and wine merchants.',
        '<strong>Saint-Émilion</strong> — a medieval wine village, about 35 minutes by train from Bordeaux.'
      ],
      alt: [
        '<strong>Coach</strong> — services take roughly seven hours, much slower than the train.',
        '<strong>Car</strong> — about five and a half hours plus tolls.',
        '<strong>Flying</strong> — about an hour in the air, but with transfers and security the train is competitive.'
      ]
    },
    'paris-nice': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> is the departure station for the south of France, with Metro lines 1 and 14 and RER A and D.',
        '<strong>Nice-Ville</strong> is the main station, a short tram ride or about a 15–20 minute walk from the Promenade des Anglais and the Old Town.'
      ],
      times: 'The direct TGV takes roughly 5h 30m–6h, with only a handful of direct trains a day, so it is worth choosing your departure first. The line runs through Lyon, Marseille and along the Côte d\'Azur, which makes the second half of the journey scenic. An overnight train has also run on this route on some dates, so check the live timetable.',
      ticketsIntro: 'Fares depend on how early you book and which of the few direct trains you choose:',
      tickets: [
        ['Advance (TGV INOUI Prem\'s)', 'One specific train', 'Cheapest. Indicative single fares often start around €30–€70 when booked early.'],
        ['TGV INOUI standard', 'Some flexibility to change', 'Mid-range.'],
        ['TGV INOUI flexible / first', 'Fully flexible or first class', 'The most expensive.']
      ],
      ticketTips: [
        'Book early for summer; the Côte d\'Azur is busiest from June to September.',
        'A <strong>youth or senior card</strong> from SNCF can reduce many fares by around 30%.',
        'Compare the direct train with one change in Lyon or Marseille; the direct is almost always simpler.'
      ],
      when: 'Fridays and Sundays and the school holidays are the most expensive. July and August are the busiest months. Midweek morning departures are typically best value.',
      arrivalIntro: 'Nice is a compact city; a day or two is a good start. Highlights:',
      arrival: [
        '<strong>The Promenade des Anglais</strong> — the seafront boulevard along the bay.',
        '<strong>Vieux Nice and the Cours Saleya market</strong> — lanes, food stalls and the flower market.',
        '<strong>Castle Hill</strong> — a short climb for views over the bay and port.',
        '<strong>Coastal day trips by train</strong> — Monaco, Antibes and Cannes are all on the same line.'
      ],
      alt: [
        '<strong>Flying</strong> — about 1h 30m in the air, and Nice airport is only a short tram ride from the centre, so it is competitive on time.',
        '<strong>Coach</strong> — an overnight or very long day option of roughly twelve hours, much cheaper.',
        '<strong>Car</strong> — roughly eight to nine hours plus tolls.'
      ]
    },
    'paris-barcelona': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> is the departure station, with Metro lines 1 and 14 and RER A and D.',
        '<strong>Barcelona Sants</strong> is the main station, with Metro lines L3 and L5 and the Rodalies network; the city centre is a short Metro ride away.'
      ],
      times: 'The direct high-speed train takes roughly 6h 30m–7h, with a small number of direct departures each day. It runs through the south of France and crosses the Pyrenees without a change, usually calling at stations such as Girona and Figueres on the Spanish side. Because there are so few direct trains, plan around the departure rather than the price.',
      ticketsIntro: 'Direct tickets are sold as a single high-speed fare, and the cheapest are for a specific train:',
      tickets: [
        ['Advance', 'One specific train', 'Cheapest. Indicative single fares often start around €35–€80 when booked early.'],
        ['Standard', 'Some flexibility to change', 'Mid-range.'],
        ['Flexible / first', 'Fully flexible or first class', 'The most expensive.']
      ],
      ticketTips: [
        'Book early for summer and holiday weekends; the direct trains sell out.',
        'Compare the direct train with a change in Lyon, Montpellier or Perpignan, which can be cheaper but takes longer.',
        'The line crosses the border without controls inside the Schengen area, but carry ID.'
      ],
      when: 'Fridays, Sundays, school holidays and summer are the busiest. Midweek morning departures are typically best value.',
      arrivalIntro: 'Barcelona is big and busy, with the best areas close together. Highlights:',
      arrival: [
        '<strong>Sagrada Família and Gaudí\'s Eixample</strong> — book tickets ahead; queues are long.',
        '<strong>The Gothic Quarter and La Rambla</strong> — the old centre; keep valuables close.',
        '<strong>Park Güell and the Gràcia district</strong> — a mix of Gaudí and local village-like streets.',
        '<strong>Beach and Barceloneta</strong> — a short Metro ride from the centre.'
      ],
      alt: [
        '<strong>Flying</strong> — roughly 1h 45m in the air, but airport transfers and security close the gap on the train.',
        '<strong>Coach</strong> — services take roughly fourteen hours or more.',
        '<strong>Car</strong> — about eight to nine hours plus tolls.'
      ]
    },
    'basel-paris': {
      stations: [
        '<strong>Basel SBB</strong> is the Swiss station, with the Old Town and the Rhine about 15 minutes\' walk away; trams run from the front of the station. The French side of the station, Basel SNCF, is part of the same complex.',
        '<strong>Paris Gare de l\'Est</strong> is the Paris terminus for eastern France and Switzerland, with Metro lines 4, 5 and 7 and RER connections nearby.'
      ],
      times: 'The direct TGV takes roughly three hours, and runs several times a day on the line through Mulhouse, so you can usually choose a departure that fits. Switzerland is outside the EU, so carry a passport or ID card.',
      ticketsIntro: 'TGV INOUI and TGV Lyria both serve Basel, and fares vary by train and how early you book:',
      tickets: [
        ['Advance', 'One specific train', 'Cheapest. Indicative single fares often start around €25–€60 when booked early.'],
        ['Standard', 'Some flexibility to change', 'Mid-range.'],
        ['Flexible / first', 'Fully flexible or first class', 'The most expensive.']
      ],
      ticketTips: [
        'Book as soon as sales open for your date; the cheapest fares go first.',
        'A <strong>youth or senior card</strong> from SNCF can reduce many fares by around 30%.',
        'Compare the direct train with a change in Strasbourg or Mulhouse; the direct is usually simpler.'
      ],
      when: 'Fridays, Sundays and school holidays are the busiest. Midweek morning departures are typically best value. Basel is also busy during its large trade fairs, so book early.',
      arrivalIntro: 'Basel is compact and easy to see on foot. Highlights:',
      arrival: [
        '<strong>The Old Town and Münster</strong> — the cathedral and the narrow streets around it.',
        '<strong>The Rhine promenade</strong> — locals swim in the river in summer.',
        '<strong>The museums</strong> — Basel has a strong collection of art museums, including the Kunstmuseum.',
        '<strong>Day trips by train</strong> — Lucerne, Bern and Zürich are all within an hour or two.'
      ],
      alt: [
        '<strong>Flying</strong> — a short flight exists but airport transfers make it uncompetitive for this pair.',
        '<strong>Coach</strong> — services take roughly eight hours and are cheaper but slower.',
        '<strong>Car</strong> — about five hours, plus tolls and Swiss motorway vignette.'
      ]
    },
    'frankfurt-paris': {
      stations: [
        '<strong>Frankfurt Hauptbahnhof</strong> is a major hub with S-Bahn, U-Bahn and long-distance connections; the city centre is a short walk away.',
        '<strong>Paris Gare de l\'Est</strong> serves eastern France and Germany, with Metro lines 4, 5 and 7 nearby.'
      ],
      times: 'The direct train takes roughly four hours, and a handful of direct ICE and TGV services run each day through Saarbrücken or Strasbourg, so choose the departure first. Slower options with a change exist but are usually less convenient.',
      ticketsIntro: 'Deutsche Bahn and SNCF both sell tickets on this line, with saver fares for a specific train:',
      tickets: [
        ['Saver (Sparpreis Europa / Prem\'s)', 'One specific train', 'Cheapest. Indicative single fares often start around €30–€60 when booked early.'],
        ['Standard', 'Some flexibility to change', 'Mid-range.'],
        ['Flexible', 'Any train, changes allowed', 'The most expensive.']
      ],
      ticketTips: [
        'Compare the same train sold by Deutsche Bahn and SNCF; the price can differ between the two.',
        'A <strong>BahnCard</strong> or <strong>SNCF discount card</strong> can reduce many fares.',
        'Reserve a seat on a busy train; reservations are included in many saver fares.'
      ],
      when: 'Fridays, Sundays and school holidays are the busiest. Midweek mid-morning trains are usually cheapest.',
      arrivalIntro: 'Frankfurt is a compact business city with a lively river front. Highlights:',
      arrival: [
        '<strong>The Römerberg and the Old Town</strong> — a reconstructed medieval square.',
        '<strong>The Museumsufer</strong> — a stretch of the Main river lined with museums, including the Städel.',
        '<strong>Sachsenhausen</strong> — a neighbourhood known for apple wine taverns.',
        '<strong>Day trips by train</strong> — Heidelberg, Mainz and Wiesbaden are all within an hour.'
      ],
      alt: [
        '<strong>Flying</strong> — about 1h 20m in the air, but transfers and security close the gap with the train.',
        '<strong>Coach</strong> — services take roughly eight to nine hours and are cheaper but slower.',
        '<strong>Car</strong> — about six hours depending on traffic.'
      ]
    }
  }
};
