/** Quatrième lot (français). Mêmes champs que route-deep-4.js. */
module.exports = { deep: {
  'paris-marseille': {
    stations: [
      '<strong>Paris Gare de Lyon</strong> est la gare de départ, avec les lignes 1 et 14 du métro et les RER A et D. Arrivez en avance : elle est grande et compte plusieurs halls.',
      '<strong>Marseille Saint-Charles</strong> se trouve sur une colline au-dessus du centre ; un grand escalier descend vers la ville, et le métro et les tramways partent de la gare.'
    ],
    times: 'Omio indique environ 18 trains par jour sur cette liaison, dont 16 directs, le premier vers 05 h 00 et le dernier tard le soir. Les directs les plus rapides mettent un peu plus de trois heures (le plus rapide d’Omio est de 3 h 3 min) ; les trains avec correspondance sont plus longs. Outre le TGV INOUI de la SNCF, Omio affiche aussi des services Frecciarossa sur cette ligne.',
    ticketsIntro: 'Les prix varient beaucoup entre une réservation anticipée et un achat le jour même, donc le type de tarif compte :',
    tickets: [
      ['Tarif anticipé', 'Un train précis, changements limités', 'Le moins cher. Le tarif le plus bas affiché par Omio est d’environ 19 €, et il part en premier.'],
      ['Standard / intermédiaire', 'Moins de restrictions', 'Prix intermédiaire ; le jour où nous avons regardé, les tarifs en milieu de journée allaient d’environ 70 à 140 €.'],
      ['Flexible', 'N’importe quel train, modifiable', 'Le plus cher ; certains trains du jour même étaient affichés à 180 € ou plus.']
    ],
    ticketTips: [
      'Les données tarifaires d’Omio suggèrent de réserver environ 91 jours à l’avance pour obtenir les prix les plus bas.',
      'Le mardi est en moyenne le jour le moins cher ; le jeudi est le plus chargé et le dimanche le plus calme.',
      'Comparez les départs SNCF et Frecciarossa le même jour : le moins cher change selon l’heure.'
    ],
    when: 'La haute saison va de juillet à septembre et la basse saison de janvier à mars ; septembre est en moyenne le mois le moins cher. Hors vacances scolaires, un train en milieu de matinée en semaine est généralement plus calme et moins cher qu’un vendredi soir.',
    arrivalIntro: 'Marseille est une ville portuaire qui mérite une première journée sans hâte. À voir :',
    arrival: [
      '<strong>Le Vieux-Port</strong> — le port historique, avec le marché aux poissons le matin et de nombreuses terrasses.',
      '<strong>Le Panier</strong> — le plus vieux quartier, aux ruelles étroites et au street art.',
      '<strong>Notre-Dame de la Garde</strong> — la basilique sur la hauteur, avec la plus belle vue sur la ville et la mer.',
      '<strong>Les calanques et Cassis</strong> — des criques calcaires et un petit port, accessibles en TER ou en bus.'
    ],
    alt: [
      '<strong>Autocar</strong> — moins cher mais beaucoup plus long, en général sept heures ou plus.',
      '<strong>Voiture</strong> — environ 775 km, soit à peu près sept heures sans circulation, plus les péages.',
      '<strong>Avion</strong> — environ 1 h 20 en vol, mais les trajets vers l’aéroport et la sûreté rendent le train compétitif de porte à porte.'
    ]
  },
  'lyon-marseille': {
    stations: [
      '<strong>Lyon Part-Dieu</strong> est la gare principale des trains longue distance, avec métro, tramway et bus vers le centre. Certains services régionaux utilisent <strong>Lyon Perrache</strong>.',
      '<strong>Marseille Saint-Charles</strong> est le terminus, sur une colline au-dessus de la ville, avec des lignes de métro et un escalier qui descend vers le centre.'
    ],
    times: 'Omio indique environ 17 trains par jour, dont 15 directs. Les plus rapides mettent à peu près une heure et demie (le plus rapide d’Omio est de 1 h 27 min) et la moyenne, en comptant les trains plus lents, tourne autour de deux heures. La ligne suit la vallée du Rhône et beaucoup de services s’arrêtent à Avignon TGV ou Valence TGV : vérifiez si un train est direct ou avec arrêt.',
    ticketsIntro: 'Les tarifs sont modérés sur ce court trajet à grande vitesse, et le même train peut varier beaucoup selon le jour :',
    tickets: [
      ['Tarif anticipé', 'Un train précis', 'Le moins cher. Le tarif le plus bas affiché par Omio est d’environ 19 €.'],
      ['Standard', 'Moins de restrictions', 'Prix intermédiaire, avec une certaine souplesse pour changer.'],
      ['Flexible', 'N’importe quel train, modifiable', 'Le plus cher ; utile si vos plans peuvent changer.']
    ],
    ticketTips: [
      'Les données tarifaires d’Omio suggèrent de réserver environ 91 jours à l’avance pour obtenir les prix les plus bas.',
      'Le mardi est en moyenne le jour le moins cher, le vendredi le plus chargé et le dimanche le plus calme.',
      'Les autocars sont moins chers (Omio les affiche à partir d’environ 10 €) si un trajet plus long ne vous gêne pas.'
    ],
    when: 'La haute saison va de juillet à septembre et la basse saison d’octobre à décembre. Les trains du vendredi soir sont les premiers à être complets : pour un week-end, réservez tôt ou partez le jeudi.',
    arrivalIntro: 'Marseille se découvre facilement à pied depuis la gare. À voir :',
    arrival: [
      '<strong>Le Vieux-Port et le fort Saint-Jean</strong> — le port historique et la forteresse à son entrée.',
      '<strong>Le MuCEM</strong> — le musée des civilisations de l’Europe et de la Méditerranée, avec une passerelle vers l’ancien fort.',
      '<strong>Le Panier</strong> — le vieux quartier, idéal pour un déjeuner sans hâte.',
      '<strong>Notre-Dame de la Garde</strong> — la basilique qui domine la ville.'
    ],
    alt: [
      '<strong>Autocar</strong> — généralement un peu moins de quatre heures et moins cher que le train.',
      '<strong>Voiture</strong> — environ 315 km par l’A7, à peu près trois heures sans circulation, plus les péages.',
      '<strong>Avion</strong> — peu pratique pour ce trajet ; le train est plus rapide de porte à porte.'
    ]
  },
  'marseille-nice': {
    stations: [
      '<strong>Marseille Saint-Charles</strong> est la gare de départ, avec des lignes de métro et un escalier qui descend vers la ville.',
      '<strong>Nice-Ville</strong> est la gare principale, à courte distance à pied ou en tramway de la Promenade des Anglais et du Vieux-Nice.'
    ],
    times: 'Omio indique environ 13 trains par jour, tous directs, entre 05 h 30 environ et la soirée. Le plus rapide met environ 2 h 22 min et la moyenne tourne autour de 2 h 34 min. Certains services sont des TGV INOUI plus rapides, d’autres des TER plus lents de la marque ZOU!, d’où des durées variables. La ligne longe la côte et s’arrête généralement à Toulon, Cannes et Antibes.',
    ticketsIntro: 'Les tarifs dépendent du TGV ou du train régional : comparez les deux :',
    tickets: [
      ['TGV INOUI anticipé', 'Un train précis', 'Prix intermédiaire. Le tarif le plus bas affiché par Omio sur cette liaison est d’environ 21 €.'],
      ['TER régional (ZOU!)', 'Souple le jour même, plus lent', 'En général le moyen le moins cher en train, sans réservation de place.'],
      ['TGV INOUI flexible', 'N’importe quel train, modifiable', 'Le plus cher.']
    ],
    ticketTips: [
      'Les données tarifaires d’Omio suggèrent de réserver environ 77 jours à l’avance pour obtenir les prix les plus bas.',
      'Le mercredi est en moyenne le jour le moins cher, le lundi le plus chargé et le samedi le plus calme.',
      'Les autocars sont l’option la moins chère (Omio les affiche à partir d’environ 5 €), mais plus lents.'
    ],
    when: 'La haute saison va de juillet à septembre, quand les trains de la côte se remplissent, et la basse saison de janvier à mars. En été, réservez tôt le TGV et évitez les vendredis et dimanches après-midi.',
    arrivalIntro: 'Nice est compacte et très agréable à parcourir à pied depuis la gare. À voir :',
    arrival: [
      '<strong>La Promenade des Anglais</strong> — le front de mer, à courte distance de la gare.',
      '<strong>Le Vieux-Nice et le marché du cours Saleya</strong> — ruelles étroites, étals et fleurs.',
      '<strong>La colline du Château</strong> — une courte montée pour la plus belle vue sur la baie.',
      '<strong>Excursions en train</strong> — Monaco et Villefranche-sur-Mer sont à quelques minutes.'
    ],
    alt: [
      '<strong>Autocar</strong> — l’option la moins chère, mais plus lente et moins confortable que le train côtier.',
      '<strong>Voiture</strong> — environ 200 km par l’A8, à peu près deux heures et demie sans circulation, plus péages et stationnement.',
      '<strong>Avion</strong> — peu pratique pour ce trajet ; le train est plus rapide de porte à porte.'
    ]
  },
  'zurich-geneva': {
    stations: [
      '<strong>Zurich HB</strong> (Hauptbahnhof) est la gare la plus fréquentée de Suisse, avec tramways et S-Bahn sous le même toit et la vieille ville à quelques minutes à pied.',
      '<strong>Genève Cornavin</strong> est la gare principale, au centre et à courte distance à pied du lac. Certains trains continuent jusqu’à l’<strong>aéroport de Genève</strong>.'
    ],
    times: 'Omio indique environ 38 services par jour sur ce corridor, dont 8 affichés comme directs ; les autres comportent un changement. Le trajet le plus rapide est d’environ 2 h 34 min et la moyenne, en comptant les options plus lentes, tourne autour de 3 h 16 min. La recherche en direct indique quels trains sont directs : mieux vaut en choisir un pour un voyage simple.',
    ticketsIntro: 'Les tarifs suisses sont élevés par rapport aux pays voisins, donc le type de billet compte plus que d’habitude :',
    tickets: [
      ['Tarif saver / anticipé', 'Un train précis', 'Le moins cher. Le tarif le plus bas affiché par Omio est d’environ 51 €.'],
      ['Standard / point à point', 'Moins de restrictions', 'Nettement plus cher ; le tarif entièrement flexible peut coûter plusieurs fois le prix anticipé.'],
      ['Swiss Half Fare Card', 'Carte de réduction', 'Divise par deux beaucoup de tarifs ; elle est rentable si vous faites plusieurs trajets en Suisse.']
    ],
    ticketTips: [
      'Les données tarifaires d’Omio suggèrent de réserver environ 77 jours à l’avance pour obtenir les prix les plus bas.',
      'Le dimanche est en moyenne le jour le moins cher (et le plus calme) ; le jeudi est le plus chargé.',
      'Si vous prenez plusieurs trains en Suisse, comparez un Swiss Travel Pass ou une Half Fare Card avec des billets à l’unité.'
    ],
    when: 'La haute saison va de juillet à septembre et la basse saison de janvier à mars. Les déplacements professionnels font du jeudi le jour le plus chargé, et les trains du dimanche soir vers Zurich sont souvent pleins.',
    arrivalIntro: 'Genève est au bord du lac et se parcourt facilement à pied. À voir :',
    arrival: [
      '<strong>Le Jet d’Eau et les quais</strong> — une promenade facile depuis Cornavin.',
      '<strong>La vieille ville et la cathédrale Saint-Pierre</strong> — rues pavées et une tour avec vue sur la ville.',
      '<strong>Les croisières sur le lac</strong> — des bateaux partent des quais en été.',
      '<strong>Excursions en train</strong> — Lausanne et Montreux sont sur la ligne du lac.'
    ],
    alt: [
      '<strong>Avion</strong> — environ 50 minutes en vol, mais les trajets vers l’aéroport et la sûreté rendent le train compétitif de porte à porte.',
      '<strong>Autocar</strong> — moins cher mais plus lent.',
      '<strong>Voiture</strong> — environ 280 km d’autoroute, à peu près trois heures, plus la vignette autoroutière suisse.'
    ]
  },
  'amsterdam-cologne': {
    stations: [
      '<strong>Amsterdam Centraal</strong> est la gare principale, avec tramways, métro et ferries derrière elle et le centre historique à courte distance à pied.',
      '<strong>Cologne Hbf</strong> se trouve juste à côté de la cathédrale : le premier monument est à votre porte dès l’arrivée.'
    ],
    times: 'Omio indique environ 7 services par jour, dont seulement 2 directs ; les autres comportent un changement. Le trajet le plus rapide affiché par Omio est d’environ 2 h 28 min et la moyenne, en comptant les options plus lentes, tourne autour de 3 h 22 min. La recherche en direct indique quels services sont directs : vérifiez avant d’acheter. Les ICE internationaux s’arrêtent généralement à Utrecht et Arnhem côté néerlandais.',
    ticketsIntro: 'Deutsche Bahn exploite l’ICE sur cette liaison, avec des tarifs qui dépendent de l’avance de réservation :',
    tickets: [
      ['Sparpreis / tarif anticipé', 'Un train précis', 'Le moins cher. Le tarif le plus bas affiché par Omio est d’environ 20 €.'],
      ['Flexpreis', 'N’importe quel train du jour', 'Nettement plus cher.'],
      ['Autocar', 'Moins cher, plus lent', 'Omio affiche des autocars à partir d’environ 11 €.']
    ],
    ticketTips: [
      'Les données tarifaires d’Omio suggèrent de réserver environ 28 jours à l’avance pour obtenir les prix les plus bas.',
      'Le mardi est en moyenne le jour le moins cher, le jeudi le plus chargé et le samedi le plus calme.',
      'Les trains directs sont peu nombreux : consultez la recherche en direct avant de choisir une combinaison avec changement.'
    ],
    when: 'La haute saison va d’octobre à décembre, en partie à cause des marchés de Noël de Cologne, et la basse saison de janvier à mars. Si vous voyagez pendant l’Avent, réservez tôt.',
    arrivalIntro: 'Cologne est compacte et la gare est en plein centre. À voir :',
    arrival: [
      '<strong>La cathédrale</strong> — montez à la tour pour voir le Rhin.',
      '<strong>La vieille ville (Altstadt)</strong> — rues étroites et brasseries traditionnelles de Kölsch.',
      '<strong>Les quais du Rhin et le pont Hohenzollern</strong> — à courte distance à pied de la gare.',
      '<strong>Les marchés de Noël</strong> — fin novembre et en décembre, parmi les plus grands d’Allemagne.'
    ],
    alt: [
      '<strong>Autocar</strong> — l’option la moins chère, à partir d’environ 11 € sur Omio.',
      '<strong>Voiture</strong> — environ 260 km, à peu près deux heures et demie à trois heures sans circulation.',
      '<strong>Avion</strong> — peu pratique pour ce trajet ; aéroports et sûreté le rendent plus lent que le train.'
    ]
  },
  'milan-naples': {
    stations: [
      '<strong>Milano Centrale</strong> est la gare principale, avec les lignes M2 et M3 du métro et un grand hall ; prévoyez du temps pour trouver votre quai.',
      '<strong>Napoli Centrale</strong> est en plein centre, sur la Piazza Garibaldi, avec le métro et les trains de la Circumvesuviana vers Pompéi et Sorrente dans le même secteur. Certains trains à grande vitesse utilisent <strong>Napoli Afragola</strong>, hors de la ville : vérifiez la gare d’arrivée.'
    ],
    times: 'Omio indique environ 68 services par jour, dont 60 directs, ce qui en fait l’une des liaisons longues les mieux desservies d’Italie. Le trajet le plus rapide est d’environ 4 h 17 min et la moyenne, en comptant les trains plus lents, d’environ 5 h 26 min. Les trains s’arrêtent généralement à Bologne, Florence et Rome. Deux compagnies se font concurrence : Trenitalia (Frecciarossa) et Italo.',
    ticketsIntro: 'Frecciarossa et Italo proposent tous deux des tarifs anticipés bon marché : comparez-les le même jour :',
    tickets: [
      ['Frecciarossa / Italo économique', 'Un train précis, changements limités', 'Le moins cher. Le tarif le plus bas affiché par Omio est d’environ 19 €.'],
      ['Standard / tarif de base', 'Moins de restrictions', 'Prix intermédiaire, avec une certaine souplesse.'],
      ['Flexible / business', 'N’importe quel train, modifiable', 'Le plus cher ; utile si vos plans peuvent changer.']
    ],
    ticketTips: [
      'Les données tarifaires d’Omio suggèrent de réserver environ 91 jours à l’avance pour obtenir les prix les plus bas.',
      'Le lundi est en moyenne le jour le moins cher, le mardi le plus chargé et le samedi le plus calme.',
      'Les autocars sont l’option la moins chère, à partir d’environ 9 € sur Omio, mais bien plus longs que le train.'
    ],
    when: 'La haute saison va de juillet à septembre et la basse saison de janvier à mars. Les vendredis après-midi et les dimanches soir sont les plus chargés ; les trains de milieu de matinée en semaine sont plus tranquilles.',
    arrivalIntro: 'Naples est bruyante, dense et gratifiante. À voir :',
    arrival: [
      '<strong>Via dei Tribunali et Spaccanapoli</strong> — le centre historique, avec les pizzerias classiques.',
      '<strong>Le Musée archéologique national</strong> — une grande part des trouvailles de Pompéi et d’Herculanum.',
      '<strong>Le front de mer et le Castel dell’Ovo</strong> — une longue promenade au bord de l’eau avec vue sur le Vésuve.',
      '<strong>Excursions</strong> — Pompéi et Sorrente en Circumvesuviana, et ferries vers Capri et Ischia.'
    ],
    alt: [
      '<strong>Avion</strong> — environ une heure vingt en vol, mais les trajets vers l’aéroport réduisent l’écart avec le train.',
      '<strong>Autocar</strong> — beaucoup moins cher mais très long, une journée entière ou une nuit.',
      '<strong>Voiture</strong> — environ 770 km par l’A1, à peu près huit heures sans circulation, plus les péages.'
    ]
  }
} };
