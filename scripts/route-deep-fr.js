/** Contenu approfondi des itinéraires (français). Mêmes champs que route-deep-content*.js. */
module.exports = {
  ui: {
    stations: 'Gares : d’où vous partez et où vous arrivez',
    times: (f, t) => `${f} – ${t} : horaires et fréquence des trains`,
    tickets: 'Billets et tarifs : ce que vous payez vraiment',
    th: ['Billet', 'Ce que cela signifie', 'Niveau indicatif'],
    note: 'Les tarifs sont indicatifs et varient selon la date, l’heure et l’avance de réservation. La recherche en direct affiche le prix exact de votre trajet.',
    when: 'Meilleur moment pour voyager',
    arrival: (t) => `Que faire en arrivant à ${t}`,
    alt: (f, t) => `Autres façons d’aller de ${f} à ${t}`,
    related: 'Itinéraires liés', moreLondon: 'Plus de trains au départ de Londres'
  },
  deep: {
    'london-liverpool': {
      stations: [
        '<strong>London Euston</strong> est le terminus londonien de la West Coast Main Line. Elle est reliée aux lignes Northern et Victoria du métro, et King’s Cross St Pancras se trouve à environ 15–20 minutes à pied.',
        '<strong>Liverpool Lime Street</strong> se trouve en plein centre, face au St George’s Hall, avec les trains Merseyrail en dessous. Le front de mer et l’Albert Dock sont à environ 20–25 minutes à pied, ou à un court trajet en bus ou en taxi.'
      ],
      times: 'Les services les plus rapides mettent environ 2 h 10 min–2 h 30 min, avec un départ toutes les heures ou plus souvent dans la journée, et des trains supplémentaires aux heures de pointe. Tous les trains ne s’arrêtent pas aux mêmes gares : parmi les arrêts intermédiaires courants figurent Milton Keynes Central, Crewe ou Runcorn et Liverpool South Parkway, et le train avec le moins d’arrêts est généralement le plus rapide. Vérifiez toujours le départ choisi, car la durée varie de quelques minutes d’un service à l’autre.',
      ticketsIntro: 'Avanti West Coast exploite les trains directs : ce que vous payez dépend donc du type de billet, et non du choix d’un opérateur :',
      tickets: [
        ['Advance (anticipé)', 'Un train précis, en général sans changement', 'Le moins cher. Les billets simples indicatifs se situent souvent entre 20 et 40 £ si vous réservez tôt, et ils partent en premier.'],
        ['Off-Peak (heures creuses)', 'Tout train hors pointe le jour même', 'Prix intermédiaire ; intéressant si vous évitez la pointe du matin.'],
        ['Anytime (flexible)', 'N’importe quel train, à n’importe quelle heure', 'Le plus flexible et le plus cher ; un aller simple peut dépasser 100 £.']
      ],
      ticketTips: [
        'Une <strong>Railcard</strong> (16–25 ans, 26–30 ans, Two Together, Senior, Family &amp; Friends) enlève en général environ un tiers sur la plupart des tarifs, y compris de nombreux billets Advance.',
        'Réservez dès l’ouverture des tarifs pour votre date. Les billets Advance les moins chers sont limités et augmentent à mesure que le train se remplit.',
        'Comparez le même départ du matin d’un jour à l’autre : passer d’un vendredi à un mardi fait souvent gagner plus que n’importe quelle autre astuce.'
      ],
      when: 'Évitez les vendredis après-midi, les dimanches soir et les jours de match à Anfield ou Goodison, quand les trains et les tarifs sont au plus haut. Les départs en milieu de matinée hors vacances scolaires sont généralement moins chers et plus calmes. Si vous devez travailler à bord, demandez une place à table ; la ligne offre des prises et du wifi dans la plupart des trains.',
      arrivalIntro: 'L’aller-retour représente plus de quatre heures et demie de train : une excursion d’une journée est possible mais serrée, et une nuit sur place est bien plus confortable. À faire à proximité de Lime Street :',
      arrival: [
        '<strong>L’Albert Dock et Pier Head</strong> — les docks restaurés, les Trois Grâces sur le front de mer, des musées et The Beatles Story.',
        '<strong>La cathédrale anglicane et la cathédrale métropolitaine</strong> — deux cathédrales très différentes, à quelques pas l’une de l’autre.',
        '<strong>Le Cavern Quarter</strong> — Mathew Street et les salles de concert liées à l’histoire des Beatles.',
        '<strong>Baltic Triangle et Georgian Quarter</strong> — cafés indépendants, street art et quelques-unes des plus belles rues de la ville.'
      ],
      alt: [
        '<strong>Autocar</strong> — les services au départ de London Victoria prennent environ cinq à six heures ; moins chers mais bien plus lents.',
        '<strong>Voiture</strong> — environ quatre à cinq heures selon la circulation sur la M1 et la M6, plus le stationnement en centre-ville.',
        '<strong>Avion</strong> — peu pratique pour cette paire une fois ajoutés les transferts et la sûreté aéroportuaire ; le train va de centre à centre.'
      ]
    },
    'london-oxford': {
      stations: [
        '<strong>London Paddington</strong> (Great Western Railway) et <strong>London Marylebone</strong> (Chiltern Railways) sont les deux principales gares de départ. Paddington est desservie par les lignes Bakerloo, Circle, District, Hammersmith &amp; City et Elizabeth.',
        '<strong>La gare d’Oxford</strong> se trouve à l’ouest du centre, à environ 10–15 minutes à pied des principaux sites, avec bus et taxis fréquents devant la gare.'
      ],
      times: 'Les trains GWR depuis Paddington sont les plus rapides : environ une heure pour un service direct rapide, avec plusieurs départs par heure. Les trains Chiltern depuis Marylebone prennent un peu plus (environ une heure et quart) mais s’arrêtent à High Wycombe et à Bicester Village, utile si vous allez au centre commercial. Quelques services sont des omnibus plus lents ; vérifiez donc la durée du départ choisi.',
      ticketsIntro: 'C’est un trajet court et très fréquent : la plupart des voyageurs achètent donc des billets Off-Peak ou Anytime plutôt que des tarifs Advance :',
      tickets: [
        ['Advance (anticipé)', 'Un train précis', 'Disponibilité limitée sur un trajet court ; vérifiez s’il y en a un pour votre date.'],
        ['Off-Peak (heures creuses)', 'Trains hors pointe le jour même', 'Le choix habituel pour une excursion d’une journée ; bon rapport qualité-prix hors pointe du matin.'],
        ['Anytime (flexible)', 'N’importe quel train', 'Flexible, mais nettement plus cher que l’Off-Peak.']
      ],
      ticketTips: [
        'Une <strong>Railcard</strong> vaut le coup d’œil même pour un seul voyage, car elle s’applique à la plupart des tarifs Off-Peak.',
        'Un aller-retour dans la journée peut revenir moins cher que deux allers simples ; comparez les deux lors de la recherche.',
        'Chiltern depuis Marylebone est souvent un peu moins cher que GWR depuis Paddington ; comparez-les à la même date.'
      ],
      when: 'Les matins de semaine vers Oxford sont chargés de navetteurs, et les week-ends d’été comme la période des remises de diplômes, la ville est bondée. Venir en semaine hors des pics du calendrier universitaire offre des colleges plus calmes et des tables plus faciles à l’heure du déjeuner.',
      arrivalIntro: 'Une journée à Oxford se fait facilement depuis Londres. À proximité de la gare, à pied :',
      arrival: [
        '<strong>La Bodleian Library et la Radcliffe Camera</strong> — le cœur historique de l’université ; certains intérieurs ne se visitent qu’en visite guidée.',
        '<strong>Christ Church</strong> et les autres colleges — les horaires changent pendant le trimestre et les examens, vérifiez avant d’y aller.',
        '<strong>L’Ashmolean Museum</strong> — art et archéologie, entrée gratuite.',
        '<strong>Une balade en punt sur le Cherwell ou la Tamise</strong> — la façon classique de voir les colleges depuis l’eau par beau temps.'
      ],
      alt: [
        '<strong>Autocar express</strong> — des services comme l’Oxford Tube et le X90 partent de London Victoria et d’autres arrêts ; plus lents que le train, souvent bien plus d’une heure et demie.',
        '<strong>Voiture</strong> — environ une heure et demie selon la circulation, avec un stationnement limité et cher en centre-ville ; préférez un parc relais.'
      ]
    },
    'london-cambridge': {
      stations: [
        '<strong>London King’s Cross</strong> (le plus rapide) et <strong>London Liverpool Street</strong> sont les deux principales gares de départ. King’s Cross est desservie par Great Northern et Thameslink ; Liverpool Street par Greater Anglia.',
        '<strong>La gare de Cambridge</strong> est à environ 2 km du centre. Comptez 20–25 minutes à pied, ou prenez un bus, un taxi ou un vélo depuis la gare.'
      ],
      times: 'Les trains Great Northern les plus rapides depuis King’s Cross mettent un peu moins d’une heure. Les services Thameslink sont plus lents, avec plus d’arrêts, et les trains Greater Anglia depuis Liverpool Street prennent en général environ une heure et quart. Plusieurs trains circulent par heure dans la journée : vous avez rarement besoin de vous organiser autour d’un seul départ.',
      ticketsIntro: 'Il n’y a pas de « meilleur » opérateur ici ; le tarif dépend de la gare et de l’heure de la journée :',
      tickets: [
        ['Advance (anticipé)', 'Un train précis', 'Parfois disponible et le moins cher ; pas proposé sur tous les services.'],
        ['Off-Peak (heures creuses)', 'Trains hors pointe le jour même', 'Choix typique pour une excursion d’une journée ; évitez les pointes des navetteurs.'],
        ['Anytime (flexible)', 'N’importe quel train', 'Flexible et le plus cher.']
      ],
      ticketTips: [
        'Comparez <strong>King’s Cross</strong> et <strong>Liverpool Street</strong> le même jour ; l’une des deux est souvent moins chère selon l’heure.',
        'Une <strong>Railcard</strong> réduit la plupart des tarifs Off-Peak d’environ un tiers.',
        'Si vous logez près de Tottenham Hale ou de Stansted, la ligne Greater Anglia peut être plus pratique que de passer d’abord par le centre de Londres.'
      ],
      when: 'Les matins à l’aller et les soirs au retour, en semaine, sont chargés de navetteurs. Cambridge est plus calme hors trimestre et plus fréquentée les week-ends d’été et à la période des remises de diplômes ; réservez à l’avance les activités populaires (punting, King’s College Chapel).',
      arrivalIntro: 'Cambridge est compacte et facile à parcourir à pied ou à vélo. À voir :',
      arrival: [
        '<strong>King’s College Chapel</strong> — l’un des grands édifices gothiques d’Angleterre ; les horaires de visite changent pendant le trimestre.',
        '<strong>The Backs et la rivière Cam</strong> — pelouses et ponts derrière les colleges, à voir de préférence en punt ou à pied.',
        '<strong>Le Fitzwilliam Museum</strong> — entrée gratuite, avec art et antiquités.',
        '<strong>La Market Square et Trinity Street</strong> — de bons endroits pour déjeuner avant de repartir.'
      ],
      alt: [
        '<strong>Autocar</strong> — les services depuis Londres rejoignent Cambridge en environ deux heures et coûtent moins cher, mais dépendent de la circulation.',
        '<strong>Voiture</strong> — environ une heure et demie ; Cambridge a peu de stationnement central, et les parcs relais en périphérie sont l’option la plus simple.'
      ]
    },
    'london-york': {
      stations: [
        '<strong>London King’s Cross</strong> est la gare de départ des trains LNER. Elle est reliée au métro (lignes Piccadilly, Northern, Victoria, Circle, Metropolitan et Hammersmith &amp; City) et se trouve à côté de St Pancras International.',
        '<strong>La gare de York</strong> est adossée aux remparts médiévaux. La cathédrale (York Minster) est à environ 10–15 minutes à pied, et The Shambles à peu près autant. Le National Railway Museum est juste à côté de la gare.'
      ],
      times: 'Les trains LNER les plus rapides mettent environ 1 h 50 min–2 h, avec en général environ deux départs par heure dans la journée : vous pouvez donc voyager à l’heure qui vous convient. Certains services sont plus lents car ils s’arrêtent dans davantage de gares. D’autres opérateurs en accès libre desservent aussi York sur la East Coast Main Line ; comparez donc les départs plutôt que de supposer un seul opérateur.',
      ticketsIntro: 'Le moyen le moins cher est presque toujours de réserver un billet Advance pour un train précis :',
      tickets: [
        ['Advance (anticipé)', 'Un train précis', 'Le moins cher. Les billets simples indicatifs se situent souvent entre 20 et 40 £ si vous réservez tôt.'],
        ['Off-Peak (heures creuses)', 'Trains hors pointe le jour même', 'Prix intermédiaire ; option raisonnable pour une excursion d’une journée hors pointe du matin.'],
        ['Anytime (flexible)', 'N’importe quel train', 'Le plus flexible et le plus cher ; peut dépasser largement 100 £ l’aller.']
      ],
      ticketTips: [
        'Réservez dès l’ouverture des tarifs pour votre date ; les billets Advance les moins chers partent vite puis augmentent.',
        'Une <strong>Railcard</strong> enlève normalement environ un tiers, y compris sur de nombreux tarifs Advance.',
        'Vérifiez les réservations de place sur les trains pleins du vendredi et du dimanche si vous voyagez avec des bagages.'
      ],
      when: 'Les vendredis après-midi et les dimanches soir sont les plus chers et les plus fréquentés. Un départ en semaine hors vacances scolaires est généralement moins cher et plus calme. York est la plus fréquentée les week-ends et à la saison des marchés de Noël.',
      arrivalIntro: 'York est assez petite pour une excursion d’une journée depuis Londres, même si une nuit sur place est bien plus reposante. À voir :',
      arrival: [
        '<strong>York Minster</strong> — l’une des plus grandes cathédrales gothiques d’Europe du Nord.',
        '<strong>The Shambles et les remparts</strong> — rues médiévales et un circuit de remparts à faire à pied.',
        '<strong>Le National Railway Museum</strong> — entrée gratuite, pratique si vous arrivez en train.',
        '<strong>Le Jorvik Viking Centre et les bords de rivière</strong> — idéal pour les familles et une promenade tranquille l’après-midi.'
      ],
      alt: [
        '<strong>Autocar</strong> — les services mettent environ cinq à six heures ; moins chers mais bien plus lents que le train.',
        '<strong>Voiture</strong> — environ quatre à cinq heures selon la circulation sur l’A1(M) ; le stationnement à York est limité, préférez un parc relais.'
      ]
    },
    'london-edinburgh': {
      stations: [
        '<strong>London King’s Cross</strong> est la gare de départ de LNER et des opérateurs en accès libre de la East Coast Main Line. Le Caledonian Sleeper part de Euston.',
        '<strong>Edinburgh Waverley</strong> se trouve au cœur de la ville, sous la vieille ville. Le Royal Mile et le château sont à environ 10–15 minutes à pied, en montée depuis la gare.'
      ],
      times: 'Les trains de jour les plus rapides mettent environ 4 h 20 min–4 h 30 min, avec des services au moins toutes les heures. Au nord, la voie longe la mer du Nord, passe par Berwick-upon-Tweed et le Royal Border Bridge, l’un des plus beaux tronçons du voyage. Pour arriver le matin, le Caledonian Sleeper depuis Euston vous dépose à Édimbourg de nuit, en environ sept à huit heures, avec des sièges et des cabines.',
      ticketsIntro: 'LNER et l’opérateur en accès libre Lumo assurent tous deux des trains directs vers Édimbourg : il vaut donc la peine de les comparer à la même date :',
      tickets: [
        ['Advance (LNER)', 'Un train précis', 'Le tarif LNER le moins cher ; les billets simples indicatifs commencent souvent autour de 30–60 £ si vous réservez bien à l’avance.'],
        ['Lumo', 'Un train précis', 'Opérateur économique ; ses tarifs peuvent être inférieurs à LNER à certaines dates, avec moins de départs et des règles différentes pour les bagages et les places.'],
        ['Off-Peak / Anytime', 'Billets flexibles', 'Nettement plus chers ; un Anytime simple peut dépasser 150 £.']
      ],
      ticketTips: [
        'Réservez dès l’ouverture des tarifs pour votre date. Les tarifs Advance des trains du vendredi et du dimanche partent en premier.',
        'Une <strong>Railcard</strong> (dont Two Together et Senior) enlève environ un tiers sur de nombreux tarifs.',
        'Comparez le même départ chez LNER et chez Lumo ; l’opérateur le moins cher change selon la date.'
      ],
      when: 'La saison des festivals en août, le Hogmanay et les week-ends de rugby sont les plus chers. En dehors de ces périodes, un départ en semaine le matin est généralement le moins cher. Asseyez-vous du côté droit en allant vers le nord pour voir la côte près de Berwick.',
      arrivalIntro: 'Pour une première visite, prévoyez au moins un week-end. À pied depuis Waverley :',
      arrival: [
        '<strong>Le château d’Édimbourg et le Royal Mile</strong> — l’épine dorsale historique de la vieille ville.',
        '<strong>Arthur’s Seat et Holyrood Park</strong> — une courte ascension avec une vue large sur la ville.',
        '<strong>Calton Hill et Princes Street Gardens</strong> — des points de vue faciles près de la gare.',
        '<strong>Les musées du Royal Mile et le National Museum of Scotland</strong> — de bonnes options par temps de pluie ; le National Museum est gratuit.'
      ],
      alt: [
        '<strong>Avion</strong> — le vol Londres–Édimbourg dure moins d’environ 1 h 30 en l’air, mais l’enregistrement, la sûreté et les transferts réduisent l’écart ; comparez de porte à porte.',
        '<strong>Autocar</strong> — les services mettent environ neuf à dix heures ; beaucoup moins chers mais bien plus lents.',
        '<strong>Voiture</strong> — environ sept à huit heures sans arrêt, et un trajet coûteux et fatigant pour la plupart des visiteurs.'
      ]
    },
    'london-amsterdam': {
      stations: [
        '<strong>London St Pancras International</strong> est le terminal de l’Eurostar. Il se trouve à côté de King’s Cross et relie six lignes du métro. Les contrôles aux frontières et de sûreté ont lieu avant l’embarquement.',
        '<strong>Amsterdam Centraal</strong> est en plein centre, à quelques pas de Damrak et des principaux canaux ; tramways et métro partent de la gare.'
      ],
      times: 'L’Eurostar direct met environ 3 h 50 min–4 h 15 min, avec des arrêts à Bruxelles et à Rotterdam. Comme les contrôles de passeport et de sûreté se font à St Pancras, il faut arriver à l’avance ; la consigne habituelle d’Eurostar est de se présenter environ 90 minutes avant le départ. C’est l’un des plus longs trajets Eurostar : une place côté fenêtre avec prise vaut la peine d’être réservée.',
      ticketsIntro: 'Eurostar vend ses billets les moins chers pour un train précis dès l’ouverture des réservations. Les principaux types de tarif sont :',
      tickets: [
        ['Standard (le moins cher)', 'Un train précis, changements limités', 'Les billets simples indicatifs commencent souvent autour de 50–80 £ si vous réservez des mois à l’avance.'],
        ['Standard Premier / Plus', 'Plus de flexibilité et d’extras', 'Prix intermédiaire ; changements possibles, avec accès au salon ou repas dans les catégories supérieures.'],
        ['Business Premier', 'Entièrement flexible', 'Le plus cher ; comprend l’accès au salon et la restauration à bord.']
      ],
      ticketTips: [
        'Les billets sont mis en vente plusieurs mois à l’avance, et les places les moins chères des jours de pointe partent en premier.',
        'L’Eurostar offre une franchise de deux grandes valises plus un bagage à main : c’est plus simple qu’un vol avec bagage en soute.',
        'Consultez la page de réservation pour des tarifs jeunes ou groupes, qui peuvent faire baisser le prix sur certains départs.'
      ],
      when: 'Les vendredis soir, les dimanches après-midi et les vacances scolaires sont les plus chers et les plus fréquentés. Un départ en semaine le matin, hors vacances, est généralement moins cher et plus calme. Prévoyez du temps en plus à St Pancras les jours de forte affluence, car la file du contrôle aux frontières peut être longue.',
      arrivalIntro: 'Amsterdam est assez petite pour passer d’un site à l’autre à pied ou à vélo. À voir depuis Centraal :',
      arrival: [
        '<strong>La ceinture de canaux</strong> — le Grachtengordel du XVIIe siècle, à quelques pas de la gare.',
        '<strong>Le Rijksmuseum, le musée Van Gogh et la maison d’Anne Frank</strong> — réservez des billets horodatés, surtout pour la maison d’Anne Frank.',
        '<strong>Le Jordaan</strong> — ruelles, cafés et boutiques indépendantes près des canaux de l’ouest.',
        '<strong>Excursions en train</strong> — Haarlem, Delft et Utrecht sont à moins d’une heure d’Amsterdam par train régulier.'
      ],
      alt: [
        '<strong>Avion</strong> — environ 1 h 20 en l’air depuis les aéroports de Londres, mais le temps de porte à porte, avec le trajet vers l’aéroport, la sûreté et le transfert vers Amsterdam, dépasse en général nettement celui du train.',
        '<strong>Ferry puis train</strong> — un ferry de nuit de Harwich à Hoek van Holland, puis un train vers Amsterdam, est bien plus lent mais reste une option classique et moins chère.',
        '<strong>Autocar</strong> — les services passent par le tunnel sous la Manche ou en ferry et mettent environ dix heures ou plus.'
      ]
    },
    'london-brussels': {
      stations: [
        '<strong>London St Pancras International</strong> est le terminal de l’Eurostar, avec correspondances de métro, de Thameslink et du réseau ferré national. Les contrôles aux frontières et de sûreté ont lieu avant l’embarquement.',
        '<strong>Bruxelles-Midi (Brussel-Zuid)</strong> est la gare de l’Eurostar. La Grand-Place est à environ 25 minutes à pied ou à un court trajet de métro ou de tram du centre.'
      ],
      times: 'L’Eurostar vers Bruxelles met environ deux heures, avec plusieurs départs dans la journée. C’est l’un des moyens les plus rapides de relier deux capitales européennes, et le train arrive au cœur de la ville plutôt qu’à un aéroport excentré. Comme sur les autres liaisons Eurostar, arrivez à l’avance pour les contrôles aux frontières ; la consigne habituelle d’Eurostar est d’environ 90 minutes avant le départ.',
      ticketsIntro: 'Eurostar pratique une tarification dynamique : plus vous réservez tôt, plus le tarif est bas :',
      tickets: [
        ['Standard (le moins cher)', 'Un train précis, changements limités', 'Les billets simples indicatifs commencent souvent autour de 40–60 £ si vous réservez bien à l’avance.'],
        ['Standard Premier / Plus', 'Plus de flexibilité et d’extras', 'Prix intermédiaire, avec changements et extras selon la catégorie.'],
        ['Business Premier', 'Entièrement flexible', 'Le plus cher ; comprend l’accès au salon et la restauration.']
      ],
      ticketTips: [
        'Réservez dès l’ouverture des billets pour votre date ; les places les moins chères partent en premier.',
        'Comparez les billets pour « Bruxelles (toutes gares) » avec les billets vers d’autres destinations belges, parfois plus avantageux.',
        'Les tarifs jeunes et certaines offres de groupe peuvent faire baisser le prix ; consultez les options sur la page de réservation.'
      ],
      when: 'Les vendredis, dimanches et vacances scolaires sont les plus fréquentés et les plus chers. Les matinées en semaine offrent le meilleur rapport qualité-prix. Les week-ends à Bruxelles sont très prisés : réservez tôt les dates populaires.',
      arrivalIntro: 'Bruxelles est compacte et facile à parcourir à pied. À voir :',
      arrival: [
        '<strong>La Grand-Place</strong> — la place des corporations du XVIIe siècle, au centre de la vieille ville.',
        '<strong>Le Palais royal, le parc de Bruxelles et le musée Magritte</strong> — se combinent facilement en une demi-journée.',
        '<strong>Les fresques de bande dessinée</strong> — la tradition de la BD de la ville s’affiche sur les murs du centre.',
        '<strong>Excursions en train</strong> — Bruges, Gand et Anvers sont toutes à moins d’une heure de Bruxelles.'
      ],
      alt: [
        '<strong>Avion</strong> — environ 1 h 10 en l’air, mais le trajet vers l’aéroport et la sûreté rapprochent le total de celui du train, et le train arrive au centre.',
        '<strong>Autocar</strong> — les services par le tunnel sous la Manche ou en ferry mettent environ sept heures ou plus.'
      ]
    },
    'geneva-paris': {
      stations: [
        '<strong>Genève Cornavin</strong> est la gare principale, au centre, à environ 10–15 minutes à pied du lac et de la vieille ville. Tramways et bus partent devant la gare.',
        '<strong>Paris Gare de Lyon</strong> est desservie par les lignes 1 et 14 du métro et les RER A et D : on rejoint presque tout le centre de Paris avec au plus une correspondance.'
      ],
      times: 'Le TGV Lyria direct met environ trois heures, avec quelques départs par jour et non un toutes les demi-heures : mieux vaut donc choisir d’abord le départ, puis chercher le tarif. Il existe des options plus lentes avec changement à Lyon ou à Bellegarde, mais le train direct est presque toujours le meilleur choix.',
      ticketsIntro: 'Le service direct est vendu à plusieurs tarifs ; les moins chers concernent un train précis et partent en premier :',
      tickets: [
        ['Saver (anticipé)', 'Un train précis', 'Le moins cher. Les billets simples indicatifs commencent souvent autour de 30–60 € si vous réservez à l’avance.'],
        ['Standard', 'Moins de restrictions', 'Prix intermédiaire, avec une certaine flexibilité pour changer.'],
        ['Flexible / First', 'Entièrement flexible ou première classe', 'Le plus cher ; utile si vos plans risquent de changer.']
      ],
      ticketTips: [
        'Réservez dès l’ouverture des ventes pour votre date, et vérifiez à la fois TGV Lyria et les options SNCF seules.',
        'La Suisse n’est pas dans l’UE : emportez votre passeport ou votre carte d’identité, même s’il n’y a normalement pas de file à la frontière.',
        'Réservez une place dans le train direct ; la réservation est incluse dans le prix du billet.'
      ],
      when: 'Les vendredis après-midi, dimanches soir et vacances scolaires sont les plus fréquentés. Un départ en semaine le matin est généralement le moins cher et le plus simple. Comme il n’y a que quelques trains directs par jour, un train complet peut vous laisser avec une correspondance bien plus lente.',
      arrivalIntro: 'Genève est un bon point de départ pour le lac et les Alpes ; Paris est à l’autre bout de la ligne. À voir à Genève :',
      arrival: [
        '<strong>Le Jet d’eau et les quais du lac</strong> — une promenade facile depuis Cornavin.',
        '<strong>La vieille ville et la cathédrale Saint-Pierre</strong> — rues pavées et une tour avec vue sur la ville.',
        '<strong>Le Palais des Nations et le quartier des musées</strong> — bien pour une demi-journée à l’abri.',
        '<strong>Excursions en train</strong> — Lausanne, Montreux et Annecy sont accessibles depuis Genève.'
      ],
      alt: [
        '<strong>Avion</strong> — environ 1 h 20 en l’air, mais ajoutez les transferts et la sûreté ; le train est souvent compétitif de porte à porte.',
        '<strong>Autocar</strong> — une option longue, de nuit ou de jour, d’environ huit à neuf heures, moins chère que le train.',
        '<strong>Voiture</strong> — environ cinq heures, plus la vignette autoroutière suisse et les péages français.'
      ]
    },
    'paris-zurich': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> est la gare de départ du TGV Lyria ; elle est reliée aux lignes 1 et 14 du métro et aux RER A et D.',
        '<strong>Zürich HB</strong> est la gare centrale, à quelques pas du lac et de la vieille ville, avec tramways et S-Bahn en dessous.'
      ],
      times: 'Le TGV Lyria direct met environ quatre heures, avec en général un arrêt à Bâle, et circule quelques fois par jour. Il n’y a pas d’option plus rapide : l’heure de départ compte donc plus que le prix quand vous planifiez une journée de voyage. Arriver l’après-midi laisse du temps pour une soirée au bord du lac.',
      ticketsIntro: 'Les tarifs dépendent de l’avance de réservation et du train choisi parmi les quelques départs quotidiens :',
      tickets: [
        ['Saver (anticipé)', 'Un train précis', 'Le moins cher. Les billets simples indicatifs commencent souvent autour de 40–70 € si vous réservez à l’avance.'],
        ['Standard', 'Moins de restrictions', 'Prix intermédiaire ; une certaine flexibilité pour changer.'],
        ['Flexible / First', 'Entièrement flexible ou première classe', 'Le plus cher ; utile si les plans peuvent changer.']
      ],
      ticketTips: [
        'Réservez tôt pour les dates de pointe ; les places les moins chères sur quelques trains quotidiens partent en premier.',
        'La Suisse n’est pas dans l’UE : emportez votre passeport ou votre carte d’identité.',
        'Comparez avec un changement à Bâle, parfois moins cher mais plus long et avec le risque de rater la correspondance.'
      ],
      when: 'Les vendredis, dimanches et vacances scolaires sont les plus fréquentés. Les matinées en semaine offrent en général le meilleur prix. Vérifiez les jours de circulation du premier et du dernier train direct, car les services varient.',
      arrivalIntro: 'Zurich est une ville compacte et très agréable à pied, au bord d’un lac. À voir depuis la gare :',
      arrival: [
        '<strong>L’Altstadt et la Bahnhofstrasse</strong> — la vieille ville et la principale rue commerçante.',
        '<strong>Le lac de Zurich</strong> — promenades, bateaux et lieux de baignade en été.',
        '<strong>L’Uetliberg</strong> — à un court trajet en train de la gare, pour la plus belle vue sur la ville.',
        '<strong>Excursions</strong> — Lucerne, Bâle et les chutes du Rhin sont à environ une heure en train.'
      ],
      alt: [
        '<strong>Avion</strong> — environ 1 h 20 en l’air, mais avec les transferts et la sûreté, le train est compétitif.',
        '<strong>Autocar</strong> — une option de nuit ou de longue journée, moins chère mais bien plus lente.',
        '<strong>Voiture</strong> — environ sept heures, avec la vignette autoroutière suisse et les péages français.'
      ]
    },
    'brussels-paris': {
      stations: [
        '<strong>Bruxelles-Midi (Brussel-Zuid)</strong> est la gare internationale. Elle est reliée au centre par le métro et le tram ; la Grand-Place est à un court trajet ou à environ 25 minutes à pied.',
        '<strong>Paris Gare du Nord</strong> est reliée aux lignes 4 et 5 du métro et aux RER B et D : il est facile de rejoindre presque tout Paris.'
      ],
      times: 'L’Eurostar met environ 1 h 20 min–1 h 30 min et circule fréquemment dans la journée. Les deux villes sont dans l’espace Schengen : il n’y a donc pas de contrôle des passeports, mais des contrôles de billets et de sûreté avant l’embarquement ; se présenter environ 30 minutes avant le départ est la consigne habituelle.',
      ticketsIntro: 'Eurostar pratique une tarification dynamique : les premiers à réserver obtiennent les prix les plus bas :',
      tickets: [
        ['Standard (le moins cher)', 'Un train précis, changements limités', 'Les billets simples indicatifs commencent souvent autour de 30–50 € si vous réservez à l’avance.'],
        ['Standard Premier / Plus', 'Plus de flexibilité et d’extras', 'Prix intermédiaire, selon la catégorie.'],
        ['Business Premier', 'Entièrement flexible', 'Le plus cher ; comprend le salon et la restauration.']
      ],
      ticketTips: [
        'Réservez dès l’ouverture des ventes ; les places les moins chères partent en premier les jours de forte demande.',
        'Comparez avec un changement à Lille ou d’autres options régionales ; le train direct est presque toujours le plus rapide et le plus simple.',
        'Les tarifs jeunes et certains tarifs groupes peuvent faire baisser le prix ; consultez les options sur la page de réservation.'
      ],
      when: 'Les vendredis, dimanches et jours fériés sont les plus fréquentés. Les trains de milieu de journée en semaine sont généralement plus calmes. Si vous enchaînez avec un vol ou un autre train, gardez une marge raisonnable pour les contrôles de sûreté.',
      arrivalIntro: 'Paris n’a pas besoin de présentation, mais quelques pistes si vous arrivez à la Gare du Nord :',
      arrival: [
        '<strong>Montmartre et le Sacré-Cœur</strong> — une courte promenade ou un trajet de métro depuis la gare.',
        '<strong>Le canal Saint-Martin</strong> — une balade agréable, à l’ambiance locale, près de la Gare du Nord.',
        '<strong>Le Louvre et la Seine</strong> — faciles d’accès par la ligne 4 du métro ou le RER B.',
        '<strong>Excursions en train</strong> — Versailles, Chantilly et Rouen sont tous réalisables depuis Paris.'
      ],
      alt: [
        '<strong>Autocar</strong> — les services mettent environ quatre heures ; moins chers mais plus lents, et soumis à la circulation.',
        '<strong>Voiture</strong> — environ trois heures selon la circulation, plus péages et stationnement à Paris.',
        '<strong>Avion</strong> — peu pratique pour cette paire ; le train est plus rapide de porte à porte.'
      ]
    },
    'brussels-bruges': {
      stations: [
        '<strong>Bruxelles-Midi, Central ou Nord</strong> — les trains intercity vers Bruges s’arrêtent dans les trois principales gares de Bruxelles : choisissez la plus proche de votre hôtel.',
        '<strong>La gare de Bruges</strong> est à environ 1,5 km du Markt, soit 20–25 minutes à pied, avec bus et taxis devant la gare.'
      ],
      times: 'Les trains intercity mettent environ 50 minutes à une heure et circulent à peu près toutes les demi-heures dans la journée : vous pouvez donc arriver et partir sans vous organiser autour d’un seul départ. Quelques services sont des omnibus plus lents ; vérifiez la durée du train choisi.',
      ticketsIntro: 'La société nationale des chemins de fer belges (SNCB) pratique des tarifs fixes et simples sur cette ligne :',
      tickets: [
        ['Billet simple standard', 'N’importe quel train le jour même', 'En général moins de 20 € par trajet.'],
        ['Aller-retour / excursion', 'Aller et retour', 'Souvent moins cher que deux allers simples ; consultez les options.'],
        ['Tarifs week-end ou réduits', 'Réductions du vendredi au dimanche', 'La SNCB propose des réductions de week-end sur de nombreuses liaisons ; consultez la page de réservation.']
      ],
      ticketTips: [
        'Il n’y a pas de grosse économie à réserver des mois à l’avance sur cette ligne ; les tarifs sont surtout fixes, vous pouvez donc acheter le jour même.',
        'Validez ou scannez votre billet comme indiqué sur l’appli avant d’embarquer.',
        'Pour une excursion d’une journée, achetez un aller-retour et partez tôt pour devancer les groupes d’autocars.'
      ],
      when: 'Bruges est bondée en été et le week-end, surtout entre la fin de matinée et le milieu d’après-midi. Arriver tôt le matin ou rester jusqu’au soir est la meilleure façon de profiter des canaux avec moins de monde.',
      arrivalIntro: 'Bruges est compacte et se découvre mieux à pied. À voir :',
      arrival: [
        '<strong>Le Markt et le Beffroi</strong> — la place du marché médiévale et son beffroi du XIIIe siècle.',
        '<strong>Les canaux et le Béguinage</strong> — des coins paisibles loin des rues principales.',
        '<strong>La place du Burg et la basilique du Saint-Sang</strong> — l’ancien centre civique.',
        '<strong>Promenade en bateau ou à pied le long des canaux</strong> — une façon classique de voir la vieille ville en une heure.'
      ],
      alt: [
        '<strong>Autocar</strong> — des services existent mais sont plus longs que le train.',
        '<strong>Voiture</strong> — environ une heure, mais le stationnement à Bruges est limité et cher ; garez-vous en dehors du centre.'
      ]
    },
    'nice-monaco': {
      stations: [
        '<strong>Nice-Ville</strong> est la gare principale, à un court trajet en tramway ou à environ 15–20 minutes à pied de la Promenade des Anglais.',
        '<strong>Monaco-Monte-Carlo</strong> est une gare souterraine ; ascenseurs et escaliers mécaniques mènent au quartier du casino de Monte-Carlo et au port.'
      ],
      times: 'Le TER côtier met environ 20–25 minutes et circule souvent, en général toutes les 15–30 minutes dans la journée : vous pouvez donc arriver et partir. Il s’arrête en chemin dans de petites gares côtières comme Villefranche-sur-Mer, Beaulieu-sur-Mer et Èze-sur-Mer, et les vues sur la Méditerranée comptent parmi les plus belles de la Côte d’Azur.',
      ticketsIntro: 'C’est une ligne régionale avec des tarifs fixes et simples, sans prix anticipés :',
      tickets: [
        ['Billet simple', 'N’importe quel TER le jour même', 'En général quelques euros par trajet.'],
        ['Aller-retour', 'Aller et retour', 'Souvent au même prix que deux allers simples.'],
        ['Pass journée / billet régional', 'Voyages locaux illimités', 'À envisager si vous comptez faire plusieurs arrêts sur la côte.']
      ],
      ticketTips: [
        'Il n’y a rien à gagner à réserver à l’avance : achetez au distributeur ou sur l’appli et partez.',
        'De Nice à Monaco, asseyez-vous du côté droit pour les plus belles vues sur la mer.',
        'Arrêtez-vous à Villefranche-sur-Mer ou à Èze au retour pour un petit détour côtier.'
      ],
      when: 'Les matins et les fins d’après-midi d’été sont pleins d’excursionnistes. Un départ tôt le matin offre des trains plus calmes et des promenades plus fraîches à Monaco. Prévoyez du temps en plus les week-ends du Grand Prix et de grands événements.',
      arrivalIntro: 'Monaco est assez petite pour se parcourir à pied en une journée. À voir :',
      arrival: [
        '<strong>Le Palais princier et le Rocher</strong> — la vieille ville de Monaco-Ville, avec vue sur le port.',
        '<strong>Le Casino de Monte-Carlo et la place du Casino</strong> — la place la plus célèbre et ses jardins.',
        '<strong>Le Musée océanographique</strong> — un aquarium et musée sur la falaise au-dessus de la mer.',
        '<strong>Le port Hercule</strong> — le port principal, un bon endroit pour déjeuner.'
      ],
      alt: [
        '<strong>Bus</strong> — un bus côtier relie Nice et Monaco, plus lent que le train mais très bon marché.',
        '<strong>Voiture</strong> — 30 à 45 minutes, mais la circulation et le stationnement à Monaco en font un mauvais choix.',
        '<strong>À pied ou à vélo</strong> — le sentier côtier est spectaculaire mais long, à garder pour une autre journée.'
      ]
    },
    'munich-berlin': {
      stations: [
        '<strong>München Hauptbahnhof</strong> est la gare principale, avec S-Bahn, U-Bahn et la vieille ville à quelques pas.',
        '<strong>Berlin Hauptbahnhof</strong> est une gare moderne en verre au nord du centre. S-Bahn et U-Bahn desservent les principaux quartiers ; la porte de Brandebourg est à environ 20 minutes à pied.'
      ],
      times: 'Les ICE les plus rapides mettent environ quatre heures, les « Sprinter » les plus rapides ne s’arrêtant que dans très peu de gares. Il y a généralement au moins un train par heure dans la journée : vous pouvez donc choisir le départ qui vous convient. Les ICE plus lents, avec plus d’arrêts, ajoutent un peu de temps ; vérifiez la durée du train choisi.',
      ticketsIntro: 'Deutsche Bahn vend plusieurs tarifs pour le même train, des tarifs économiques aux billets entièrement flexibles :',
      tickets: [
        ['Sparpreis (économique)', 'Un train précis, changements limités', 'Le moins cher. Les billets simples indicatifs commencent souvent entre 20 et 50 € si vous réservez tôt.'],
        ['Flexpreis', 'N’importe quel train le jour même', 'Moyen à élevé ; le tarif flexible standard, qui peut dépasser largement 100 €.'],
        ['Super Sparpreis', 'Le moins cher, conditions strictes', 'Disponibilité limitée et prix plus bas ; part en premier.']
      ],
      ticketTips: [
        'Réservez dès l’ouverture des ventes pour votre date ; les tarifs Sparpreis les moins chers sont limités et augmentent à mesure que le train se remplit.',
        'Une <strong>BahnCard 25 ou 50</strong> est vite rentabilisée si vous faites plusieurs longs trajets en Allemagne.',
        'Réservez une place dans un train chargé ; les réservations sont bon marché et utiles le vendredi et le dimanche.'
      ],
      when: 'Les vendredis soir, dimanches après-midi et vacances scolaires sont les plus fréquentés. Les trains de milieu de matinée en semaine sont généralement moins chers et plus calmes. Si vous voulez du calme, cherchez la voiture silence, signalée dans le train.',
      arrivalIntro: 'Berlin est grande ; utilisez le S-Bahn et le U-Bahn pour passer d’un quartier à l’autre. À voir :',
      arrival: [
        '<strong>La porte de Brandebourg et le Reichstag</strong> — accessibles à pied depuis la gare principale ; réservez la coupole du Reichstag en ligne.',
        '<strong>L’île aux Musées</strong> — une île classée à l’Unesco avec plusieurs grands musées.',
        '<strong>L’East Side Gallery et Kreuzberg</strong> — le tronçon conservé du Mur et un quartier animé pour manger.',
        '<strong>Charlottenburg et l’ouest</strong> — palais, boulevards et quartiers plus calmes.'
      ],
      alt: [
        '<strong>Avion</strong> — environ 1 heure en l’air, mais avec les transferts et la sûreté, le train est compétitif et arrive au centre.',
        '<strong>Autocar</strong> — une option de nuit ou de longue journée, souvent bien moins chère mais d’environ sept à neuf heures.',
        '<strong>Voiture</strong> — environ six heures selon la circulation, plus carburant et stationnement.'
      ]
    },
    'rome-venice': {
      stations: [
        '<strong>Roma Termini</strong> est la gare principale de Rome, avec les lignes A et B du métro et des bus. Les services Frecciarossa et Italo y partent.',
        '<strong>Venezia Santa Lucia</strong> est sur le Grand Canal. De la gare, on poursuit à pied ou en vaporetto (bus fluvial) ; certains trains s’arrêtent plutôt à Venezia Mestre, sur le continent : vérifiez donc quelle gare indique votre billet.'
      ],
      times: 'Les trains à grande vitesse Frecciarossa et Italo mettent environ 3 h 45 min à 4 h, avec des départs à peu près toutes les heures ou plus souvent dans la journée, et quelques options régionales plus lentes qui prennent bien plus de temps. Les trains s’arrêtent normalement à Florence et parfois à Bologne, ce qui fait de ce trajet un bon candidat pour couper le voyage.',
      ticketsIntro: 'Frecciarossa (Trenitalia) et Italo se font concurrence sur cette ligne, ce qui garde des tarifs anticipés raisonnables :',
      tickets: [
        ['Super Economy / Economy', 'Un train précis, changements limités', 'Le moins cher. Les billets simples indicatifs commencent souvent entre 30 et 50 € si vous réservez à l’avance.'],
        ['Base', 'Plus de flexibilité pour changer', 'Prix intermédiaire.'],
        ['Flex / Prima', 'Entièrement flexible ou première classe', 'Le plus cher ; utile si les plans peuvent changer.']
      ],
      ticketTips: [
        'Comparez Frecciarossa et Italo à la même date ; l’opérateur le moins cher change d’un jour à l’autre.',
        'Réservez dès l’ouverture des ventes pour votre date ; les tarifs les plus bas partent en premier.',
        'La réservation de place est incluse dans le prix du billet sur les trains à grande vitesse ; inutile d’en acheter une à part.'
      ],
      when: 'Les vendredis après-midi, dimanches soir et vacances de Pâques et d’été sont les plus fréquentés et les plus chers. Les matinées en semaine offrent en général le meilleur prix. Prévoyez du temps en plus à Venise, car les vaporetti sont lents et bondés en haute saison.',
      arrivalIntro: 'Venise récompense ceux qui se perdent. Depuis la gare, mieux vaut marcher au moins une partie du trajet. À voir :',
      arrival: [
        '<strong>Le Grand Canal</strong> — prenez le vaporetto de la ligne 1 pour une descente lente et bon marché de tout le canal.',
        '<strong>La place Saint-Marc et la basilique</strong> — allez-y tôt pour éviter la foule.',
        '<strong>Rialto et le quartier de Cannaregio</strong> — rues plus calmes, bars locaux et l’ancien ghetto juif.',
        '<strong>Burano et Murano</strong> — excursions vers les îles en vaporetto depuis les Fondamente Nove.'
      ],
      alt: [
        '<strong>Avion</strong> — environ 1 h 15 en l’air, mais l’aéroport Marco Polo est sur le continent et le transfert vers Venise ajoute du temps.',
        '<strong>Train de nuit</strong> — parfois disponible entre Rome et le nord ; consultez l’horaire en direct.',
        '<strong>Voiture</strong> — environ cinq à six heures, mais les voitures sont interdites dans Venise même.'
      ]
    },
    'paris-lyon': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> est desservie par les lignes 1 et 14 du métro et les RER A et D. Certains trains Ouigo à bas prix partent plutôt d’autres gares de la région parisienne : vérifiez donc la gare de départ de votre billet.',
        '<strong>Lyon Part-Dieu</strong> est la gare principale du quartier d’affaires, avec métro et tramway vers le centre. Certains trains desservent aussi <strong>Lyon Perrache</strong>, plus proche de la Presqu’île et du confluent des deux fleuves.'
      ],
      times: 'Les TGV les plus rapides mettent environ deux heures, avec des départs dans la journée à intervalles courts : vous avez rarement besoin de vous organiser autour d’un seul train. Les services Ouigo à bas prix mettent à peu près autant, mais utilisent d’autres gares et ont des règles de bagages plus strictes.',
      ticketsIntro: 'Le TGV INOUI de la SNCF et le Ouigo à bas prix circulent tous deux sur cette ligne : il vaut donc la peine de les comparer :',
      tickets: [
        ['Ouigo (bas prix)', 'Un train précis, règles de bagages strictes', 'Le moins cher. Les billets simples indicatifs commencent souvent autour de 10–25 € si vous réservez tôt.'],
        ['TGV INOUI Prem’s / anticipé', 'Un train précis', 'Prix intermédiaire ; les billets simples indicatifs commencent souvent autour de 25–60 € si vous réservez à l’avance.'],
        ['TGV INOUI flexible', 'N’importe quel train, changements possibles', 'Le plus cher ; utile si vos plans peuvent changer.']
      ],
      ticketTips: [
        'Comparez Ouigo et TGV INOUI le même jour ; Ouigo n’est pas toujours le moins cher une fois ajoutés bagages et place.',
        'Une <strong>carte jeune ou senior</strong> de la SNCF peut réduire de nombreux tarifs d’environ 30 %.',
        'Réservez dès l’ouverture des ventes pour votre date ; les places les moins chères partent en premier.'
      ],
      when: 'Les vendredis, dimanches et vacances scolaires sont les plus fréquentés. En semaine en milieu de matinée, c’est en général le moins cher et le plus calme. Prévoyez du temps à la Gare de Lyon, grande et dotée de plusieurs halls.',
      arrivalIntro: 'Lyon est compacte et un plaisir à parcourir à pied. À voir :',
      arrival: [
        '<strong>Le Vieux Lyon et les traboules</strong> — la vieille ville Renaissance et ses passages cachés.',
        '<strong>La basilique de Fourvière</strong> — on y monte en funiculaire depuis le Vieux Lyon, pour la plus belle vue de la ville.',
        '<strong>Les Halles de Lyon Paul Bocuse</strong> — le marché couvert, bien pour déjeuner.',
        '<strong>La Presqu’île et la Croix-Rousse</strong> — rues commerçantes, places et l’ancien quartier des canuts.'
      ],
      alt: [
        '<strong>Autocar</strong> — les services mettent environ cinq à six heures et sont moins chers mais bien plus lents.',
        '<strong>Voiture</strong> — environ quatre heures et demie à cinq heures, plus péages et stationnement en ville.',
        '<strong>Avion</strong> — peu pratique pour cette paire ; le train est plus rapide de porte à porte.'
      ]
    },
    'paris-bordeaux': {
      stations: [
        '<strong>Paris Montparnasse</strong> est la gare de départ de la ligne à grande vitesse atlantique, avec les lignes 4, 6, 12 et 13 du métro.',
        '<strong>Bordeaux Saint-Jean</strong> est à environ 3 km au sud du centre. Le tramway la relie à la place de la Bourse et à la vieille ville en 15–20 minutes environ.'
      ],
      times: 'Depuis l’ouverture de la ligne à grande vitesse vers Bordeaux en 2017, les TGV les plus rapides mettent un peu plus de deux heures. Les départs sont fréquents dans la journée, du petit matin au soir : une excursion d’une journée dans un sens ou l’autre est donc réaliste, même si passer une nuit à Bordeaux est bien plus reposant.',
      ticketsIntro: 'Le TGV INOUI de la SNCF et le Ouigo à bas prix desservent Bordeaux, et les prix peuvent beaucoup varier selon la date :',
      tickets: [
        ['Ouigo (bas prix)', 'Un train précis, règles de bagages strictes', 'Le moins cher. Les billets simples indicatifs commencent souvent autour de 15–30 € si vous réservez tôt.'],
        ['TGV INOUI anticipé', 'Un train précis', 'Prix intermédiaire ; les billets simples indicatifs commencent souvent autour de 30–70 € si vous réservez à l’avance.'],
        ['TGV INOUI flexible', 'N’importe quel train, changements possibles', 'Le plus cher.']
      ],
      ticketTips: [
        'Réservez le plus tôt possible ; les trains du vendredi et du dimanche sont les premiers à épuiser les tarifs bas.',
        'Une <strong>carte jeune ou senior</strong> de la SNCF peut réduire de nombreux tarifs d’environ 30 %.',
        'Comparez Ouigo et TGV INOUI le même jour.'
      ],
      when: 'Les vendredis, dimanches et vacances d’été sont les plus fréquentés et les plus chers. Les trains de milieu de matinée en semaine sont généralement les moins chers. Bordeaux est aussi très prisée pendant les semaines de vendanges : réservez tôt votre hébergement.',
      arrivalIntro: 'Bordeaux est une belle ville, très agréable à pied. À voir :',
      arrival: [
        '<strong>La place de la Bourse et le Miroir d’eau</strong> — la place du XVIIIe siècle et le miroir d’eau sur les quais.',
        '<strong>La Cité du Vin</strong> — un musée consacré au monde du vin, au bord du fleuve.',
        '<strong>Le quartier des Chartrons</strong> — antiquaires, cafés et négociants en vin.',
        '<strong>Saint-Émilion</strong> — un village viticole médiéval, à environ 35 minutes en train de Bordeaux.'
      ],
      alt: [
        '<strong>Autocar</strong> — les services mettent environ sept heures, bien plus que le train.',
        '<strong>Voiture</strong> — environ cinq heures et demie plus péages.',
        '<strong>Avion</strong> — environ une heure en l’air, mais avec les transferts et la sûreté, le train est compétitif.'
      ]
    },
    'paris-nice': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> est la gare de départ vers le sud de la France, avec les lignes 1 et 14 du métro et les RER A et D.',
        '<strong>Nice-Ville</strong> est la gare principale, à un court trajet en tramway ou à environ 15–20 minutes à pied de la Promenade des Anglais et de la vieille ville.'
      ],
      times: 'Le TGV direct met environ 5 h 30 min–6 h, avec seulement quelques trains directs par jour : mieux vaut donc choisir d’abord le départ. La ligne passe par Lyon, Marseille et longe la Côte d’Azur, ce qui rend la seconde moitié du trajet pittoresque. Un train de nuit a aussi circulé sur cette ligne à certaines dates ; consultez l’horaire en direct.',
      ticketsIntro: 'Les tarifs dépendent de l’avance de réservation et du train choisi parmi les quelques directs :',
      tickets: [
        ['Anticipé (TGV INOUI Prem’s)', 'Un train précis', 'Le moins cher. Les billets simples indicatifs commencent souvent autour de 30–70 € si vous réservez tôt.'],
        ['TGV INOUI standard', 'Une certaine flexibilité pour changer', 'Prix intermédiaire.'],
        ['TGV INOUI flexible / première', 'Entièrement flexible ou première classe', 'Le plus cher.']
      ],
      ticketTips: [
        'Réservez tôt pour l’été ; la Côte d’Azur est la plus fréquentée de juin à septembre.',
        'Une <strong>carte jeune ou senior</strong> de la SNCF peut réduire de nombreux tarifs d’environ 30 %.',
        'Comparez le train direct avec un changement à Lyon ou à Marseille ; le direct est presque toujours plus simple.'
      ],
      when: 'Les vendredis, dimanches et vacances scolaires sont les plus chers. Juillet et août sont les mois les plus fréquentés. Les départs en semaine le matin offrent en général le meilleur prix.',
      arrivalIntro: 'Nice est une ville compacte ; un ou deux jours sont un bon début. À voir :',
      arrival: [
        '<strong>La Promenade des Anglais</strong> — le boulevard en bord de mer le long de la baie.',
        '<strong>Le Vieux-Nice et le marché du cours Saleya</strong> — ruelles, étals de nourriture et marché aux fleurs.',
        '<strong>La colline du Château</strong> — une courte montée pour une vue sur la baie et le port.',
        '<strong>Excursions côtières en train</strong> — Monaco, Antibes et Cannes sont sur la même ligne.'
      ],
      alt: [
        '<strong>Avion</strong> — environ 1 h 30 en l’air, et l’aéroport de Nice est à un court trajet de tramway du centre : l’avion est donc compétitif en temps.',
        '<strong>Autocar</strong> — une option de nuit ou de très longue journée, d’environ douze heures, bien moins chère.',
        '<strong>Voiture</strong> — environ huit à neuf heures plus péages.'
      ]
    },
    'paris-barcelona': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> est la gare de départ, avec les lignes 1 et 14 du métro et les RER A et D.',
        '<strong>Barcelona Sants</strong> est la gare principale, avec les lignes L3 et L5 du métro et le réseau Rodalies ; le centre est à un court trajet de métro.'
      ],
      times: 'Le train direct à grande vitesse met environ 6 h 30 min–7 h, avec un petit nombre de départs directs par jour. Il traverse le sud de la France et franchit les Pyrénées sans changement, avec en général des arrêts comme Gérone et Figueres côté espagnol. Comme les trains directs sont peu nombreux, planifiez autour du départ plutôt que du prix.',
      ticketsIntro: 'Les billets directs sont vendus au tarif unique de la grande vitesse, et les moins chers concernent un train précis :',
      tickets: [
        ['Anticipé', 'Un train précis', 'Le moins cher. Les billets simples indicatifs commencent souvent autour de 35–80 € si vous réservez tôt.'],
        ['Standard', 'Une certaine flexibilité pour changer', 'Prix intermédiaire.'],
        ['Flexible / première', 'Entièrement flexible ou première classe', 'Le plus cher.']
      ],
      ticketTips: [
        'Réservez tôt pour l’été et les week-ends de vacances ; les trains directs se remplissent.',
        'Comparez le train direct avec un changement à Lyon, Montpellier ou Perpignan, parfois moins cher mais plus long.',
        'La ligne passe la frontière sans contrôle dans l’espace Schengen, mais emportez une pièce d’identité.'
      ],
      when: 'Les vendredis, dimanches, vacances scolaires et l’été sont les plus fréquentés. Les départs en semaine le matin offrent en général le meilleur prix.',
      arrivalIntro: 'Barcelone est grande et animée, avec les meilleurs quartiers assez proches. À voir :',
      arrival: [
        '<strong>La Sagrada Família et l’Eixample de Gaudí</strong> — réservez vos billets à l’avance ; les files sont longues.',
        '<strong>Le quartier gothique et La Rambla</strong> — le centre historique ; gardez vos objets de valeur près de vous.',
        '<strong>Le parc Güell et le quartier de Gràcia</strong> — un mélange de Gaudí et de rues à l’ambiance de village.',
        '<strong>La plage et la Barceloneta</strong> — à un court trajet de métro du centre.'
      ],
      alt: [
        '<strong>Avion</strong> — environ 1 h 45 en l’air, mais les transferts et la sûreté réduisent l’avantage sur le train.',
        '<strong>Autocar</strong> — les services mettent environ quatorze heures ou plus.',
        '<strong>Voiture</strong> — environ huit à neuf heures plus péages.'
      ]
    },
    'basel-paris': {
      stations: [
        '<strong>Basel SBB</strong> est la gare suisse, avec la vieille ville et le Rhin à environ 15 minutes à pied ; les tramways partent devant la gare. Le côté français de la gare, Basel SNCF, fait partie du même complexe.',
        '<strong>Paris Gare de l’Est</strong> est le terminus parisien pour l’est de la France et la Suisse, avec les lignes 4, 5 et 7 du métro et des correspondances RER à proximité.'
      ],
      times: 'Le TGV direct met environ trois heures et circule plusieurs fois par jour par la ligne passant par Mulhouse : vous pouvez donc généralement choisir un départ qui vous convient. La Suisse n’est pas dans l’UE : emportez votre passeport ou votre carte d’identité.',
      ticketsIntro: 'TGV INOUI et TGV Lyria desservent Bâle, et les tarifs varient selon le train et l’avance de réservation :',
      tickets: [
        ['Anticipé', 'Un train précis', 'Le moins cher. Les billets simples indicatifs commencent souvent autour de 25–60 € si vous réservez tôt.'],
        ['Standard', 'Une certaine flexibilité pour changer', 'Prix intermédiaire.'],
        ['Flexible / première', 'Entièrement flexible ou première classe', 'Le plus cher.']
      ],
      ticketTips: [
        'Réservez dès l’ouverture des ventes pour votre date ; les tarifs les moins chers partent en premier.',
        'Une <strong>carte jeune ou senior</strong> de la SNCF peut réduire de nombreux tarifs d’environ 30 %.',
        'Comparez le train direct avec un changement à Strasbourg ou à Mulhouse ; le direct est généralement plus simple.'
      ],
      when: 'Les vendredis, dimanches et vacances scolaires sont les plus fréquentés. Les départs en semaine le matin offrent en général le meilleur prix. Bâle est aussi bondée pendant ses grandes foires : réservez tôt.',
      arrivalIntro: 'Bâle est compacte et facile à parcourir à pied. À voir :',
      arrival: [
        '<strong>La vieille ville et le Münster</strong> — la cathédrale et les rues étroites alentour.',
        '<strong>La promenade du Rhin</strong> — les habitants se baignent dans le fleuve en été.',
        '<strong>Les musées</strong> — Bâle possède de riches collections de musées d’art, dont le Kunstmuseum.',
        '<strong>Excursions en train</strong> — Lucerne, Berne et Zurich sont toutes à une ou deux heures.'
      ],
      alt: [
        '<strong>Avion</strong> — un vol court existe, mais les transferts le rendent peu compétitif pour cette paire.',
        '<strong>Autocar</strong> — les services mettent environ huit heures ; moins chers mais plus lents.',
        '<strong>Voiture</strong> — environ cinq heures, plus péages et vignette autoroutière suisse.'
      ]
    },
    'frankfurt-paris': {
      stations: [
        '<strong>Frankfurt Hauptbahnhof</strong> est un grand nœud ferroviaire avec S-Bahn, U-Bahn et liaisons longue distance ; le centre est à quelques pas.',
        '<strong>Paris Gare de l’Est</strong> dessert l’est de la France et l’Allemagne, avec les lignes 4, 5 et 7 du métro à proximité.'
      ],
      times: 'Le train direct met environ quatre heures, et quelques services directs ICE et TGV circulent chaque jour par Sarrebruck ou Strasbourg : choisissez donc d’abord le départ. Des options plus lentes avec changement existent, mais sont généralement moins pratiques.',
      ticketsIntro: 'Deutsche Bahn et la SNCF vendent tous deux des billets sur cette ligne, avec des tarifs économiques pour un train précis :',
      tickets: [
        ['Saver (Sparpreis Europa / Prem’s)', 'Un train précis', 'Le moins cher. Les billets simples indicatifs commencent souvent autour de 30–60 € si vous réservez tôt.'],
        ['Standard', 'Une certaine flexibilité pour changer', 'Prix intermédiaire.'],
        ['Flexible', 'N’importe quel train, changements possibles', 'Le plus cher.']
      ],
      ticketTips: [
        'Comparez le même train vendu par Deutsche Bahn et par la SNCF ; le prix peut différer entre les deux.',
        'Une <strong>BahnCard</strong> ou une <strong>carte de réduction SNCF</strong> peut réduire de nombreux tarifs.',
        'Réservez une place dans un train chargé ; les réservations sont incluses dans de nombreux tarifs économiques.'
      ],
      when: 'Les vendredis, dimanches et vacances scolaires sont les plus fréquentés. Les trains de milieu de matinée en semaine sont généralement les moins chers.',
      arrivalIntro: 'Francfort est une ville d’affaires compacte au bord d’un fleuve animé. À voir :',
      arrival: [
        '<strong>Le Römerberg et la vieille ville</strong> — une place médiévale reconstruite.',
        '<strong>Le Museumsufer</strong> — un tronçon du Main bordé de musées, dont le Städel.',
        '<strong>Sachsenhausen</strong> — un quartier connu pour ses tavernes de cidre.',
        '<strong>Excursions en train</strong> — Heidelberg, Mayence et Wiesbaden sont toutes à moins d’une heure.'
      ],
      alt: [
        '<strong>Avion</strong> — environ 1 h 20 en l’air, mais les transferts et la sûreté réduisent l’avantage sur le train.',
        '<strong>Autocar</strong> — les services mettent environ huit à neuf heures ; moins chers mais plus lents.',
        '<strong>Voiture</strong> — environ six heures selon la circulation.'
      ]
    }
  }
};
