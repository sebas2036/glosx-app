/**
 * Páginas de ruta de Japón generadas con datos reales de Klook (duración más rápida, trenes y si hay Shinkansen;
 * consulta 05-oct-2026, salida 20-oct) más datos por ciudad (scripts/japan-cities-meta.js).
 * Cubre los pares verificados que todavía no tienen página escrita a mano (scripts/generate-routes-japan.js
 * y scripts/routes-japan-lote2.js). Mismo formato de objeto de ruta que esos archivos.
 */
const data = require('./japan-pairs-data.json');
const META = require('./japan-cities-meta.js');

const LANGS = ['en', 'es', 'fr', 'it'];
const DISPLAY = {};
data.cities.forEach(c => { DISPLAY[c.slug] = c.display; });

const NAME_LOC = {
  es: { tokyo: 'Tokio', kyoto: 'Kioto', naritaairport: 'Aeropuerto de Narita', kansaiairport: 'Aeropuerto de Kansai', newchitoseairport: 'Aeropuerto de New Chitose' },
  fr: { naritaairport: 'Aéroport de Narita', kansaiairport: 'Aéroport du Kansai', newchitoseairport: 'Aéroport de New Chitose' },
  it: { naritaairport: 'Aeroporto di Narita', kansaiairport: 'Aeroporto del Kansai', newchitoseairport: 'Aeroporto di New Chitose' },
  en: {}
};
const nm = (slug, l) => (NAME_LOC[l] && NAME_LOC[l][slug]) || DISPLAY[slug];
const isAirport = slug => /airport$/.test(slug);

const SLUG_FIX = { naritaairport: 'narita-airport', kansaiairport: 'kansai-airport', newchitoseairport: 'new-chitose-airport', hidafurukawa: 'hida-furukawa', huistenbosch: 'huis-ten-bosch', joetsumyoko: 'joetsu-myoko', kagaonsen: 'kaga-onsen', kiitanabe: 'kii-tanabe', kinugawaonsen: 'kinugawa-onsen', nasushiobara: 'nasu-shiobara', shinfuji: 'shin-fuji', shinhakodatehokuto: 'shin-hakodate-hokuto', shinhanamaki: 'shin-hanamaki', shinsapporo: 'shin-sapporo', shinyamaguchi: 'shin-yamaguchi', shinyokohama: 'shin-yokohama', takeoonsen: 'takeo-onsen' };
const pageSlug = (a, b) => (SLUG_FIX[a] || a) + '-' + (SLUG_FIX[b] || b);

// pares que ya tienen página propia (sin importar el sentido)
const DONE = [['tokyo', 'kyoto'], ['tokyo', 'osaka'], ['osaka', 'kyoto'], ['kyoto', 'hiroshima'], ['naritaairport', 'tokyo'], ['tokyo', 'nagoya'], ['tokyo', 'kanazawa'], ['kansaiairport', 'kyoto'], ['tokyo', 'hiroshima'], ['tokyo', 'fukuoka'], ['nagoya', 'takayama'], ['sapporo', 'otaru'], ['tokyo', 'sendai'], ['shinjuku', 'hakone'], ['fukuoka', 'yufuin']];
const isDone = (a, b) => DONE.some(p => (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a));

const PRIVATE = { Tobu: ['Revaty Aizu', 'Revaty Kinu', 'Revaty Kegon', 'SPACIA X', 'Kegon'], Odakyu: ['Romancecar'] };
const operatorOf = t => { for (const k of Object.keys(PRIVATE)) if (PRIVATE[k].includes(t)) return k; return null; };

const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const pick = (slug, arr) => arr[hash(slug) % arr.length];

const PHOTOS = {
  shinkansen: [23345456, 27666787, 38364303, 29058311],
  castle: [38601506, 31040540], onsen: [39396773, 31133221], snow: [16500575, 35505746], garden: [29393691],
  historic: [2641279, 31385483, 11905693], coast: [32882810, 29241259], port: [39396660, 29241259],
  airport: [23344538], mountain: [31133221, 31418958], city: [39396660, 34052447], hub: [23344538, 23345456],
  gateway: [4059410, 31385483], themepark: [39396773], default: [2641279]
};
const photoFor = (r, s, b, shin) => {
  if (shin) return pick(r, PHOTOS.shinkansen);
  const t = META[b][1];
  if (META[b][0] === 'Hokkaido' && ['port', 'city', 'coast', 'onsen'].includes(t)) return pick(r, PHOTOS.snow);
  return pick(r, PHOTOS[t] || PHOTOS.default);
};

const TAG = {
  en: { onsen: 'a hot-spring town', castle: 'a castle city', port: 'a port city', city: 'a city', hub: 'a major rail junction', airport: 'the stop for the airport', mountain: 'a mountain destination', historic: 'a historic town', gateway: 'a gateway to the region', snow: 'a snow-country town', coast: 'a coastal town', themepark: 'a theme-park destination' },
  es: { onsen: 'un pueblo de aguas termales', castle: 'una ciudad con castillo', port: 'una ciudad portuaria', city: 'una ciudad', hub: 'un importante nudo ferroviario', airport: 'la parada del aeropuerto', mountain: 'un destino de montaña', historic: 'una localidad histórica', gateway: 'una puerta de entrada a la región', snow: 'una localidad de nieve', coast: 'una localidad costera', themepark: 'un destino con parque temático' },
  fr: { onsen: 'une station thermale', castle: 'une ville de château', port: 'une ville portuaire', city: 'une ville', hub: 'un important nœud ferroviaire', airport: 'l’arrêt de l’aéroport', mountain: 'une destination de montagne', historic: 'une localité historique', gateway: 'une porte d’entrée de la région', snow: 'une localité du pays de la neige', coast: 'une localité côtière', themepark: 'une destination avec parc à thème' },
  it: { onsen: 'una località termale', castle: 'una città con castello', port: 'una città portuale', city: 'una città', hub: 'un importante nodo ferroviario', airport: 'la fermata dell’aeroporto', mountain: 'una meta di montagna', historic: 'una località storica', gateway: 'una porta d’accesso alla regione', snow: 'una località della neve', coast: 'una località costiera', themepark: 'una meta con parco a tema' }
};
const WITH = { en: 'with', es: 'con', fr: 'avec', it: 'con' };
const IN_REGION = { en: r => 'in the ' + r + ' region', es: r => 'en la región de ' + r, fr: r => 'dans la région de ' + r, it: r => 'nella regione di ' + r };

const SIGHT_LOC = {
  es: { 'the Nebuta festival': 'el festival Nebuta', 'the Peace Memorial Park': 'el Parque Conmemorativo de la Paz', 'the Kumano Kodo': 'el Kumano Kodo', 'the Bikan district': 'el barrio de Bikan' },
  fr: { 'the Nebuta festival': 'le festival Nebuta', 'the Peace Memorial Park': 'le parc du M\u00e9morial de la Paix', 'the Kumano Kodo': 'le Kumano Kodo', 'the Bikan district': 'le quartier de Bikan' },
  it: { 'the Nebuta festival': 'il festival Nebuta', 'the Peace Memorial Park': 'il Parco della Pace', 'the Kumano Kodo': 'il Kumano Kodo', 'the Bikan district': 'il quartiere di Bikan' },
  en: {}
};
function cityLine(slug, l) {
  const [region, tag, sight0] = META[slug];
  const sight = sight0 && ((SIGHT_LOC[l] && SIGHT_LOC[l][sight0]) || sight0);
  const n = nm(slug, l);
  const sightTxt = sight ? ' ' + WITH[l] + ' ' + sight : '';
  const verb = { en: 'is', es: 'es', fr: 'est', it: 'è' }[l];
  return n + ' ' + verb + ' ' + TAG[l][tag] + ' ' + IN_REGION[l](region) + sightTxt + '.';
}

function fmtShort(m, l) {
  if (m < 60) return m + ' min';
  const h = Math.floor(m / 60), r = m % 60, rr = String(r).padStart(2, '0');
  if (l === 'es' || l === 'fr') return h + ' h' + (r ? ' ' + rr : '');
  return r ? h + 'h' + rr : h + 'h';
}
function fmtLong(m, l) {
  if (m < 60) return { en: m + ' minutes', es: m + ' minutos', fr: m + ' minutes', it: m + ' minuti' }[l];
  const h = Math.floor(m / 60), r = m % 60;
  if (l === 'en') return h + (h === 1 ? ' hour' : ' hours') + (r ? ' ' + r + ' minutes' : '');
  if (l === 'es') return h + (h === 1 ? ' hora' : ' horas') + (r ? ' y ' + r + ' minutos' : '');
  if (l === 'fr') return h + ' h' + (r ? ' ' + String(r).padStart(2, '0') : '');
  return h + (h === 1 ? ' ora' : ' ore') + (r ? ' e ' + r + ' minuti' : '');
}
const listJoin = (arr, l) => arr.join(', ');

function build(row) {
  const { a, b, m, s, t } = row;
  const slug = pageSlug(a, b);
  const T1 = t[0] || null;
  const hasNozomi = t.some(x => x === 'Nozomi' || x === 'Mizuho');
  const op = t.map(operatorOf).find(Boolean) || null;
  const names = {}; LANGS.forEach(l => { names[l] = { from: nm(a, l), to: nm(b, l) }; });
  const airportInvolved = isAirport(a) || isAirport(b);

  const from = {}, to = {};
  LANGS.forEach(l => { from[l] = names[l].from; to[l] = names[l].to; });

  const unas = m < 60 ? 'unos' : Math.floor(m / 60) === 1 ? '' : 'unas';
  const svcEn = T1 ? (s ? 'the ' + T1 + ' Shinkansen' : 'the ' + T1 + ' service') : null;
  const seo = {}, lead = {}, facts = {}, choose = {}, tips = {}, faqs = {};

  // títulos y descripciones
  const ds = l => fmtShort(m, l);
  seo.en = { title: `${from.en} to ${to.en} by Train: ${ds('en')}${T1 ? ' on the ' + T1 + (s ? ' Shinkansen' : '') : ''}`, description: `${from.en} to ${to.en} by train in about ${ds('en')}${T1 ? ' on the ' + T1 : ''}. Direct service, stations and how to book on Klook.` };
  seo.es = { title: `Tren de ${from.es} a ${to.es}: ${ds('es')}${T1 ? ' en el ' + (s ? 'Shinkansen ' : 'expreso ') + T1 : ''}`, description: `De ${from.es} a ${to.es} en tren en ${unas} ${ds('es')}${T1 ? ' con el ' + T1 : ''}. Servicio directo, estaciones y cómo reservar en Klook.` };
  seo.fr = { title: `Train ${from.fr} ${to.fr} : ${ds('fr')}${T1 ? ' en ' + (s ? 'Shinkansen ' : 'express ') + T1 : ''}`, description: `De ${from.fr} à ${to.fr} en train en environ ${ds('fr')}${T1 ? ' avec le ' + T1 : ''}. Service direct, gares et comment réserver sur Klook.` };
  seo.it = { title: `Treno ${from.it} ${to.it}: ${ds('it')}${T1 ? ' con ' + (s ? 'lo Shinkansen ' : 'l’espresso ') + T1 : ''}`, description: `Da ${from.it} a ${to.it} in treno in circa ${ds('it')}${T1 ? ' con ' + T1 : ''}. Servizio diretto, stazioni e come prenotare su Klook.` };

  // entradilla
  const lg = l => fmtLong(m, l);
  lead.en = `The fastest train from ${from.en} to ${to.en} takes about ${lg('en')}${T1 ? ', on ' + svcEn : ''}. It is a direct service, with no change of train. ${cityLine(b, 'en')}`;
  lead.es = `El tren más rápido de ${from.es} a ${to.es} tarda ${unas ? unas + ' ' : ''}${lg('es')}${T1 ? ', con el ' + (s ? 'Shinkansen ' : 'servicio ') + T1 : ''}. Es un servicio directo, sin cambio de tren. ${cityLine(b, 'es')}`;
  lead.fr = `Le train le plus rapide de ${from.fr} à ${to.fr} met environ ${lg('fr')}${T1 ? ', avec le ' + (s ? 'Shinkansen ' : 'service ') + T1 : ''}. C’est un service direct, sans changement. ${cityLine(b, 'fr')}`;
  lead.it = `Il treno più veloce da ${from.it} a ${to.it} impiega circa ${lg('it')}${T1 ? ', con ' + (s ? 'lo Shinkansen ' : 'il servizio ') + T1 : ''}. È un servizio diretto, senza cambi. ${cityLine(b, 'it')}`;

  // datos clave
  const st = (slg, l) => isAirport(slg) ? nm(slg, l) : null;
  const stationsEn = `Stations: ${isAirport(a) ? from.en : from.en + ' Station'} to ${isAirport(b) ? to.en : to.en + ' Station'}.`;
  const stationsEs = `Estaciones: de ${isAirport(a) ? 'la terminal de ' + from.es.replace(/^Aeropuerto de /, '') : 'la estación de ' + from.es} a ${isAirport(b) ? 'la terminal de ' + to.es.replace(/^Aeropuerto de /, '') : 'la estación de ' + to.es}.`;
  const stationsFr = `Gares : de ${isAirport(a) ? 'l’aéroport' : 'la gare de ' + from.fr} à ${isAirport(b) ? 'l’aéroport' : 'la gare de ' + to.fr}.`;
  const stationsIt = `Stazioni: dalla ${isAirport(a) ? 'stazione dell’aeroporto' : 'stazione di ' + from.it} alla ${isAirport(b) ? 'stazione dell’aeroporto' : 'stazione di ' + to.it}.`;
  const trainsTxt = t.length ? listJoin(t) : '';
  facts.en = [`Fastest journey: about ${ds('en')}${T1 ? ' (' + T1 + ')' : ''}.`, t.length ? `Services on this route: ${trainsTxt}.` : 'Frequent services during the day.', stationsEn, 'Direct, with no change of train.'];
  facts.es = [`Trayecto más rápido: ${unas} ${ds('es')}${T1 ? ' (' + T1 + ')' : ''}.`, t.length ? `Servicios en esta ruta: ${trainsTxt}.` : 'Servicios frecuentes durante el día.', stationsEs, 'Directo, sin cambio de tren.'];
  facts.fr = [`Trajet le plus rapide : environ ${ds('fr')}${T1 ? ' (' + T1 + ')' : ''}.`, t.length ? `Services sur cet itinéraire : ${trainsTxt}.` : 'Services fréquents dans la journée.', stationsFr, 'Direct, sans changement.'];
  facts.it = [`Viaggio più veloce: circa ${ds('it')}${T1 ? ' (' + T1 + ')' : ''}.`, t.length ? `Servizi su questa tratta: ${trainsTxt}.` : 'Servizi frequenti durante il giorno.', stationsIt, 'Diretto, senza cambi.'];

  // qué tren elegir
  if (hasNozomi) {
    choose.en = `The ${T1} is the fastest option on this route. Note that the Japan Rail Pass does not cover the Nozomi or the Mizuho; if you travel with the pass, use the other Shinkansen on the line, which take a little longer.`;
    choose.es = `El ${T1} es la opción más rápida de esta ruta. Ten en cuenta que el Japan Rail Pass no cubre el Nozomi ni el Mizuho; si viajas con el pase, usa los otros Shinkansen de la línea, que tardan algo más.`;
    choose.fr = `Le ${T1} est l’option la plus rapide sur cet itinéraire. Le Japan Rail Pass ne couvre ni le Nozomi ni le Mizuho ; avec le pass, prenez les autres Shinkansen de la ligne, un peu plus lents.`;
    choose.it = `Il ${T1} è l’opzione più veloce su questa tratta. Il Japan Rail Pass non copre il Nozomi né il Mizuho; con il pass usa gli altri Shinkansen della linea, un po’ più lenti.`;
  } else if (op) {
    choose.en = `This route is run by ${op}, a private railway, so the Japan Rail Pass does not cover it. It is a direct, comfortable service; check the seat reservation rules for your date when you book.`;
    choose.es = `Esta ruta la opera ${op}, una compañía ferroviaria privada, así que el Japan Rail Pass no la cubre. Es un servicio directo y cómodo; comprueba las normas de reserva de asiento para tu fecha al reservar.`;
    choose.fr = `Cet itinéraire est exploité par ${op}, une compagnie privée : le Japan Rail Pass ne le couvre pas. C’est un service direct et confortable ; vérifiez les règles de réservation de place pour votre date.`;
    choose.it = `Questa tratta è gestita da ${op}, una compagnia ferroviaria privata, quindi il Japan Rail Pass non la copre. È un servizio diretto e comodo; controlla le regole di prenotazione del posto per la tua data.`;
  } else if (s) {
    choose.en = `Take the ${T1 || 'Shinkansen'} for the shortest trip${t[1] ? '; the ' + t[1] + ' is an alternative' : ''}. Shinkansen are JR trains, which the Japan Rail Pass generally covers (except the Nozomi and the Mizuho); check the conditions of your pass.`;
    choose.es = `Toma el ${T1 || 'Shinkansen'} para el viaje más corto${t[1] ? '; el ' + t[1] + ' es una alternativa' : ''}. Los Shinkansen son trenes JR, que el Japan Rail Pass suele cubrir (salvo el Nozomi y el Mizuho); comprueba las condiciones de tu pase.`;
    choose.fr = `Prenez le ${T1 || 'Shinkansen'} pour le trajet le plus court${t[1] ? ' ; le ' + t[1] + ' est une alternative' : ''}. Les Shinkansen sont des trains JR, généralement couverts par le Japan Rail Pass (sauf le Nozomi et le Mizuho) ; vérifiez les conditions de votre pass.`;
    choose.it = `Prendi il ${T1 || 'Shinkansen'} per il viaggio più breve${t[1] ? '; il ' + t[1] + ' è un’alternativa' : ''}. Gli Shinkansen sono treni JR, di norma coperti dal Japan Rail Pass (tranne il Nozomi e il Mizuho); controlla le condizioni del tuo pass.`;
  } else {
    choose.en = `${T1 ? 'The ' + T1 + ' is the fastest direct service' : 'A direct service runs on this route'}${t[1] ? ', and the ' + t[1] + ' is an alternative' : ''}. These are JR trains, which the Japan Rail Pass generally covers; check the conditions of your pass and the seat rules for your date.`;
    choose.es = `${T1 ? 'El ' + T1 + ' es el servicio directo más rápido' : 'Hay un servicio directo en esta ruta'}${t[1] ? ', y el ' + t[1] + ' es una alternativa' : ''}. Son trenes JR, que el Japan Rail Pass suele cubrir; comprueba las condiciones de tu pase y las normas de asiento para tu fecha.`;
    choose.fr = `${T1 ? 'Le ' + T1 + ' est le service direct le plus rapide' : 'Un service direct circule sur cet itinéraire'}${t[1] ? ', et le ' + t[1] + ' est une alternative' : ''}. Ce sont des trains JR, généralement couverts par le Japan Rail Pass ; vérifiez les conditions de votre pass et les règles de place pour votre date.`;
    choose.it = `${T1 ? 'Il ' + T1 + ' è il servizio diretto più veloce' : 'Su questa tratta c’è un servizio diretto'}${t[1] ? ', e il ' + t[1] + ' è un’alternativa' : ''}. Sono treni JR, di norma coperti dal Japan Rail Pass; controlla le condizioni del tuo pass e le regole sui posti per la tua data.`;
  }

  // consejos
  const luggage = {
    en: 'Suitcases with a total size between 160 and 250 cm need a reserved seat with oversized baggage space.',
    es: 'Las maletas de entre 160 y 250 cm de tamaño total necesitan un asiento reservado con espacio para equipaje voluminoso.',
    fr: 'Les valises dont la somme des dimensions est comprise entre 160 et 250 cm exigent une place réservée avec espace pour bagage volumineux.',
    it: 'I bagagli con dimensioni totali tra 160 e 250 cm richiedono un posto prenotato con spazio per bagagli voluminosi.'
  };
  const airportTip = {
    en: 'Booking before you land saves time at the ticket counters after the flight.',
    es: 'Reservar antes de aterrizar te ahorra tiempo en las taquillas tras el vuelo.',
    fr: 'Réserver avant d’atterrir fait gagner du temps aux guichets après le vol.',
    it: 'Prenotare prima di atterrare fa risparmiare tempo alle biglietterie dopo il volo.'
  };
  const busyTip = {
    en: 'In busy periods (Golden Week, the summer holidays, the cherry blossom season) a reserved seat is the safe choice.',
    es: 'En épocas de mucha demanda (Golden Week, vacaciones de verano, temporada de los cerezos en flor) el asiento reservado es la opción segura.',
    fr: 'En période de forte affluence (Golden Week, vacances d’été, saison des cerisiers en fleurs), la place réservée est le choix prudent.',
    it: 'Nei periodi di grande affluenza (Golden Week, vacanze estive, stagione dei ciliegi in fiore) il posto prenotato è la scelta sicura.'
  };
  const schedTip = {
    en: 'Check the live schedule for your date: departure times and services vary by day of the week and season.',
    es: 'Consulta el horario en vivo para tu fecha: las salidas y los servicios var\u00edan seg\u00fan el d\u00eda de la semana y la temporada.',
    fr: 'Consultez l\u2019horaire en direct pour votre date : les d\u00e9parts et les services varient selon le jour de la semaine et la saison.',
    it: 'Controlla l\u2019orario in tempo reale per la tua data: le partenze e i servizi variano secondo il giorno della settimana e la stagione.'
  };
  LANGS.forEach(l => {
    const third = s ? luggage[l] : airportInvolved ? airportTip[l] : busyTip[l];
    tips[l] = [cityLine(a, l), third, schedTip[l]];
  });

  // preguntas frecuentes
  const jr = {
    en: hasNozomi ? 'It covers the other Shinkansen on the line, but not the Nozomi or the Mizuho.' : op ? `No. The route is run by ${op}, a private railway.` : 'Generally yes: these are JR trains, which the pass covers (except the Nozomi and the Mizuho). Check the conditions of your pass.',
    es: hasNozomi ? 'Cubre los otros Shinkansen de la línea, pero no el Nozomi ni el Mizuho.' : op ? `No. La ruta la opera ${op}, una compañía privada.` : 'Por lo general sí: son trenes JR, que el pase cubre (salvo el Nozomi y el Mizuho). Comprueba las condiciones de tu pase.',
    fr: hasNozomi ? 'Il couvre les autres Shinkansen de la ligne, mais pas le Nozomi ni le Mizuho.' : op ? `Non. L’itinéraire est exploité par ${op}, une compagnie privée.` : 'En général oui : ce sont des trains JR, que le pass couvre (sauf le Nozomi et le Mizuho). Vérifiez les conditions de votre pass.',
    it: hasNozomi ? 'Copre gli altri Shinkansen della linea, ma non il Nozomi né il Mizuho.' : op ? `No. La tratta è gestita da ${op}, una compagnia privata.` : 'Di norma sì: sono treni JR, che il pass copre (tranne il Nozomi e il Mizuho). Controlla le condizioni del tuo pass.'
  };
  faqs.en = [[`How long is the train from ${from.en} to ${to.en}?`, `The fastest direct train takes about ${lg('en')}${T1 ? ' (' + T1 + ')' : ''}.`], [`Is there a direct train from ${from.en} to ${to.en}?`, 'Yes, there are direct services with no change of train.'], [`Does the Japan Rail Pass cover ${from.en} to ${to.en}?`, jr.en]];
  faqs.es = [[`¿Cuánto dura el tren de ${from.es} a ${to.es}?`, `El tren directo más rápido tarda ${unas ? unas + ' ' : ''}${lg('es')}${T1 ? ' (' + T1 + ')' : ''}.`], [`¿Hay tren directo de ${from.es} a ${to.es}?`, 'Sí, hay servicios directos, sin cambio de tren.'], [`¿El Japan Rail Pass cubre de ${from.es} a ${to.es}?`, jr.es]];
  faqs.fr = [[`Combien de temps dure le train de ${from.fr} à ${to.fr} ?`, `Le train direct le plus rapide met environ ${lg('fr')}${T1 ? ' (' + T1 + ')' : ''}.`], [`Y a-t-il un train direct de ${from.fr} à ${to.fr} ?`, 'Oui, des services directs circulent, sans changement.'], [`Le Japan Rail Pass couvre-t-il ${from.fr} ${to.fr} ?`, jr.fr]];
  faqs.it = [[`Quanto dura il treno da ${from.it} a ${to.it}?`, `Il treno diretto più veloce impiega circa ${lg('it')}${T1 ? ' (' + T1 + ')' : ''}.`], [`C’è un treno diretto da ${from.it} a ${to.it}?`, 'Sì, ci sono servizi diretti, senza cambi.'], [`Il Japan Rail Pass copre ${from.it} ${to.it}?`, jr.it]];

  return { slug, photo: photoFor(slug, a, b, s), fromKey: a, toKey: b, published: '2026-10-10', from, to, seo, lead, facts, choose, tips, faqs };
}

module.exports = data.rows.filter(r => !isDone(r.a, r.b)).map(build);
