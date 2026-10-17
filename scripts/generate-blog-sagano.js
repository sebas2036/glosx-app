#!/usr/bin/env node
/**
 * Artículo de blog "Sagano Romantic Train (Kioto)" en EN/ES/FR/IT/JA.
 * Molde: blog-tren-arraigo-pueblos.html de cada idioma. Datos verificados el 17-oct-2026 en la web oficial del operador
 * (estaciones, tarifa única por tramo, reservas online, billetes del día) y fuentes secundarias (25 min, ¥880/¥440, a confirmar).
 * Lo no verificado (calendario anual, tarifa exacta) se remite a la web oficial. Sin horarios inventados.
 * Uso: node scripts/generate-blog-sagano.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SLUG = 'blog-sagano-romantic-train.html';
const SHELL = 'blog-tren-arraigo-pueblos.html';
const LANGS = ['en', 'es', 'fr', 'it', 'ja'];
const PREFIX = { en: '', es: 'es/', fr: 'fr/', it: 'it/', ja: 'ja/' };
const LANG_NAMES = { en: 'English', es: 'Español', fr: 'Français', it: 'Italiano', ja: '日本語' };
const PHOTO = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const HERO = 31206699;
const GRID = [29479214, 18008217, 10274639];
const DATE = '2026-10-17';
const API = 'https://voxa-production-dc15.up.railway.app/affiliate';
const REL = [['tokyo-kyoto', 'Tokyo', 'Kyoto'], ['osaka-kyoto', 'Osaka', 'Kyoto'], ['kyoto-hiroshima', 'Kyoto', 'Hiroshima']];
const RELNAMES = {
  es: { Tokyo: 'Tokio', Kyoto: 'Kioto' }, fr: {}, it: {}, en: {}, ja: { Tokyo: '東京', Kyoto: '京都', Osaka: '大阪', Hiroshima: '広島' }
};

const HOTEL = ['klook-hotel?city=Kyoto', 'kyoto-hotels'];
const THINGS = ['klook-experiences?lang={lang}', 'kyoto-experiences'];
const C = {
  en: {
    title: 'Sagano Romantic Train in Kyoto: Journey Time, Prices and the Best Season to Ride',
    desc: 'The Sagano Romantic Train follows the Hozu River gorge near Kyoto in about 25 minutes. Stations, prices, how to reserve a seat and the best season to ride.',
    kw: 'Sagano Romantic Train, Kyoto scenic train, Arashiyama train, Hozu River gorge, Torokko Saga Kameoka, Kyoto in autumn',
    tag: 'Japan', meta: 'By WoW Train · October 2026 · 5 min read', back: 'All articles', bc: ['Home', 'Blog'],
    alt: ['The Sagano Romantic Train running through a bamboo grove near Kyoto.', 'Autumn leaves and a riverboat in Arashiyama.', 'The Arashiyama Bamboo Grove.'],
    lead: 'The Sagano Romantic Train is a short, slow scenic ride through the Hozu River gorge on the edge of Kyoto. It is not a way to get anywhere fast: it is a 25-minute excursion that fits into a morning in Arashiyama. This guide covers where it runs, how long it takes, what it costs, when to go and how to get a seat.',
    blocks: [
      ['h2', 'What it is and where it runs'],
      ['p', 'The line runs between <strong>Torokko Saga</strong> and <strong>Torokko Kameoka</strong>, with two stops in between: Torokko Arashiyama and Torokko Hozukyo. The carriages follow the Hozu River gorge, and the operator says the views are worth seeing in all four seasons.'],
      ['h2', 'How long it takes'],
      ['p', 'The ride between Saga and Kameoka takes about <strong>25 minutes</strong>, so it is easy to add to a day in Arashiyama. The train is slow on purpose: you pay for the view, not the speed.'],
      ['h2', 'Prices'],
      ['p', 'The operator charges <strong>one fare no matter how far you ride</strong>. Adults are 12 and over, and children from 6 to 12 pay the child fare. Kyoto tourist listings show about ¥880 for adults and ¥440 for children one way, but confirm the current price on the operator\'s site before you go, because fares can change. Infants under 1 ride free; a very young child who takes a seat needs a child ticket.'],
      ['h2', 'Best season to ride'],
      ['p', 'The gorge changes with every season. <strong>Spring</strong>, with cherry blossoms, and <strong>autumn</strong>, with red leaves, are the most popular times and also the busiest: weekends and holidays in those weeks sell out early. Autumn colour in Kyoto usually peaks around late November and cherry blossoms around late March to early April, but it shifts every year, so check the forecast. For fewer crowds, choose a weekday or an early departure.'],
      ['h2', 'How to reserve a seat'],
      ['ul', ['Reserve online on the operator\'s site: choose the date, direction and number of passengers (up to 8), then pick your car and seat. You need to register an account.', 'Pay by credit card. The ticket arrives by email and you show a QR code at the gate.', 'Same-day tickets are sold at the station counters on a first-come basis (not at Torokko Hozukyo), and a limited number of standing tickets are sold once the seats run out.']],
      ['h2', 'Check the calendar before you go'],
      ['p', 'The train does not run every day of the year. The operator publishes a yearly calendar and timetable, including the closed days, so check them for your dates. We do not list departure times here because they change with the season.'],
      ['h2', 'Make a day of it'],
      ['ul', ['The Arashiyama Bamboo Grove is nearby and is the classic pairing with the train.', 'Plan your return: many visitors ride one way on the Romantic Train and come back by the JR line or on a Hozu River boat ride (check the boat\'s operating dates).', 'Kyoto is connected to Osaka and Tokyo by Shinkansen, so the train fits easily into a bigger itinerary.']],
      ['cta', 'Stay in Kyoto · Hotels on Klook', 'Search by dates and compare', ...HOTEL],
      ['cta', 'Things to do in Kyoto · Tours and tickets on Klook', 'Experiences, day trips and activities', ...THINGS]
    ],
    ctaTitle: 'Your train. Your world.', ctaText: 'Choose Japan and look up any pair of cities: real journey time, train type and booking.', ctaBtn: 'Try Japan mode →',
    relTitle: 'Related route guides', relMore: 'More train routes in Japan →'
  },
  es: {
    title: 'Sagano Romantic Train en Kioto: duración, precios y la mejor época para subir',
    desc: 'El Sagano Romantic Train recorre el desfiladero del río Hozu cerca de Kioto en unos 25 minutos. Estaciones, precios, cómo reservar asiento y la mejor época del año.',
    kw: 'Sagano Romantic Train, tren panorámico Kioto, tren Arashiyama, desfiladero del Hozu, Torokko Saga Kameoka, Kioto en otoño',
    tag: 'Japón', meta: 'Por WoW Train · Octubre 2026 · 5 min de lectura', back: 'Todos los artículos', bc: ['Inicio', 'Blog'],
    alt: ['El Sagano Romantic Train atravesando un bosque de bambú cerca de Kioto.', 'Hojas de otoño y una barca en Arashiyama.', 'El bosque de bambú de Arashiyama.'],
    lead: 'El Sagano Romantic Train es un paseo corto y lento por el desfiladero del río Hozu, en las afueras de Kioto. No sirve para llegar rápido a ningún sitio: es una excursión de 25 minutos que encaja en una mañana en Arashiyama. Esta guía explica dónde circula, cuánto dura, cuánto cuesta, cuándo ir y cómo conseguir asiento.',
    blocks: [
      ['h2', 'Qué es y por dónde circula'],
      ['p', 'La línea une <strong>Torokko Saga</strong> y <strong>Torokko Kameoka</strong>, con dos paradas intermedias: Torokko Arashiyama y Torokko Hozukyo. Los vagones siguen el desfiladero del río Hozu, y el operador asegura que las vistas merecen la pena en las cuatro estaciones del año.'],
      ['h2', 'Cuánto dura'],
      ['p', 'El trayecto entre Saga y Kameoka dura unos <strong>25 minutos</strong>, así que es fácil sumarlo a un día en Arashiyama. El tren va lento a propósito: pagas por la vista, no por la velocidad.'],
      ['h2', 'Precios'],
      ['p', 'El operador cobra <strong>una sola tarifa sin importar cuánto recorras</strong>. Los adultos son los mayores de 12 años y los niños de 6 a 12 pagan tarifa infantil. Los listados turísticos de Kioto indican unos ¥880 para adultos y ¥440 para niños por trayecto, pero confirma el precio actual en la web del operador antes de ir, porque las tarifas pueden cambiar. Los bebés menores de 1 año viajan gratis; un niño muy pequeño que ocupe asiento necesita billete infantil.'],
      ['h2', 'La mejor época para subir'],
      ['p', 'El desfiladero cambia con cada estación. La <strong>primavera</strong>, con los cerezos en flor, y el <strong>otoño</strong>, con las hojas rojas, son las épocas más populares y también las más llenas: los fines de semana y festivos de esas semanas se agotan pronto. El color del otoño en Kioto suele alcanzar su punto máximo hacia finales de noviembre, y los cerezos entre finales de marzo y principios de abril, pero cambia cada año, así que mira la previsión. Si quieres menos gente, elige un día laborable o una salida temprano.'],
      ['h2', 'Cómo reservar asiento'],
      ['ul', ['Reserva en línea en la web del operador: elige la fecha, el sentido y el número de pasajeros (hasta 8) y después tu vagón y tu asiento. Necesitas registrar una cuenta.', 'Paga con tarjeta de crédito. El billete llega por correo y enseñas un código QR en la puerta.', 'Los billetes del mismo día se venden en las taquillas de las estaciones por orden de llegada (no en Torokko Hozukyo), y se vende un número limitado de billetes de pie cuando se agotan los asientos.']],
      ['h2', 'Mira el calendario antes de ir'],
      ['p', 'El tren no circula todos los días del año. El operador publica un calendario y un horario anuales, con los días de cierre, así que revísalos para tus fechas. Aquí no ponemos horas de salida porque cambian según la temporada.'],
      ['h2', 'Haz un día completo'],
      ['ul', ['El bosque de bambú de Arashiyama está cerca y es la pareja clásica del tren.', 'Planea la vuelta: muchos visitantes suben en un sentido en el Romantic Train y regresan por la línea JR o en un paseo en barca por el río Hozu (consulta las fechas de funcionamiento de la barca).', 'Kioto está conectada con Osaka y Tokio por Shinkansen, así que el tren encaja fácilmente en un itinerario más largo.']],
      ['cta', 'Alójate en Kioto · Hoteles en Klook', 'Busca por fechas y compara', ...HOTEL],
      ['cta', 'Qué hacer en Kioto · Tours y entradas en Klook', 'Experiencias, excursiones y actividades', ...THINGS]
    ],
    ctaTitle: 'Tu tren. Tu mundo.', ctaText: 'Elige Japón y consulta cualquier par de ciudades: duración real, tipo de tren y reserva.', ctaBtn: 'Prueba el modo Japón →',
    relTitle: 'Guías de rutas relacionadas', relMore: 'Más rutas de tren en Japón →'
  },
  fr: {
    title: 'Sagano Romantic Train à Kyoto : durée, prix et meilleure saison pour le prendre',
    desc: 'Le Sagano Romantic Train longe les gorges de la rivière Hozu près de Kyoto en 25 minutes environ. Gares, prix, comment réserver une place et meilleure saison.',
    kw: 'Sagano Romantic Train, train panoramique Kyoto, train Arashiyama, gorges de la Hozu, Torokko Saga Kameoka, Kyoto en automne',
    tag: 'Japon', meta: 'Par WoW Train · Octobre 2026 · 5 min de lecture', back: 'Tous les articles', bc: ['Accueil', 'Blog'],
    alt: ['Le Sagano Romantic Train traversant une bambouseraie près de Kyoto.', 'Feuilles d\'automne et bateau à Arashiyama.', 'La forêt de bambous d\'Arashiyama.'],
    lead: 'Le Sagano Romantic Train est une courte balade lente dans les gorges de la rivière Hozu, en périphérie de Kyoto. Il ne sert pas à aller vite quelque part : c\'est une excursion de 25 minutes qui s\'intègre à une matinée à Arashiyama. Ce guide explique où il circule, combien de temps il met, combien il coûte, quand y aller et comment obtenir une place.',
    blocks: [
      ['h2', 'Ce que c\'est et où il circule'],
      ['p', 'La ligne relie <strong>Torokko Saga</strong> et <strong>Torokko Kameoka</strong>, avec deux arrêts intermédiaires : Torokko Arashiyama et Torokko Hozukyo. Les voitures suivent les gorges de la Hozu, et l\'exploitant affirme que le paysage vaut le détour en toute saison.'],
      ['h2', 'Combien de temps dure le trajet'],
      ['p', 'Le trajet entre Saga et Kameoka dure environ <strong>25 minutes</strong> : il s\'ajoute facilement à une journée à Arashiyama. Le train est lent exprès : on paie pour la vue, pas pour la vitesse.'],
      ['h2', 'Prix'],
      ['p', 'L\'exploitant applique <strong>un tarif unique, quelle que soit la distance parcourue</strong>. Sont adultes les personnes de 12 ans et plus ; les enfants de 6 à 12 ans paient le tarif enfant. Les fiches touristiques de Kyoto indiquent environ ¥880 pour un adulte et ¥440 pour un enfant par trajet, mais confirmez le prix actuel sur le site de l\'exploitant avant de partir, car les tarifs peuvent changer. Les bébés de moins d\'un an voyagent gratuitement ; un très jeune enfant qui occupe un siège a besoin d\'un billet enfant.'],
      ['h2', 'Meilleure saison'],
      ['p', 'Les gorges changent à chaque saison. Le <strong>printemps</strong>, avec les cerisiers en fleurs, et l\'<strong>automne</strong>, avec les feuilles rouges, sont les périodes les plus prisées et aussi les plus chargées : les week-ends et jours fériés de ces semaines sont vite complets. Les couleurs d\'automne à Kyoto atteignent en général leur apogée vers la fin novembre, et les cerisiers entre fin mars et début avril, mais cela varie chaque année ; consultez les prévisions. Pour éviter la foule, choisissez un jour de semaine ou un départ tôt le matin.'],
      ['h2', 'Comment réserver une place'],
      ['ul', ['Réservez en ligne sur le site de l\'exploitant : choisissez la date, le sens et le nombre de passagers (jusqu\'à 8), puis votre voiture et votre siège. Il faut créer un compte.', 'Payez par carte bancaire. Le billet arrive par e-mail et vous présentez un code QR au portique.', 'Les billets du jour se vendent aux guichets des gares dans l\'ordre d\'arrivée (pas à Torokko Hozukyo), et un nombre limité de billets debout est vendu quand les places assises sont épuisées.']],
      ['h2', 'Consultez le calendrier avant de partir'],
      ['p', 'Le train ne circule pas tous les jours de l\'année. L\'exploitant publie un calendrier et un horaire annuels, avec les jours de fermeture : vérifiez-les pour vos dates. Nous n\'indiquons pas d\'horaires de départ ici, car ils changent selon la saison.'],
      ['h2', 'Faites-en une journée complète'],
      ['ul', ['La forêt de bambous d\'Arashiyama est toute proche et forme l\'association classique avec le train.', 'Prévoyez le retour : beaucoup de visiteurs prennent le Romantic Train dans un sens et reviennent par la ligne JR ou lors d\'une descente en bateau sur la Hozu (vérifiez les dates d\'exploitation du bateau).', 'Kyoto est reliée à Osaka et à Tokyo en Shinkansen : le train s\'intègre facilement dans un itinéraire plus large.']],
      ['cta', 'Dormir à Kyoto · Hôtels sur Klook', 'Cherchez par dates et comparez', ...HOTEL],
      ['cta', 'Que faire à Kyoto · Visites et billets sur Klook', 'Expériences, excursions et activités', ...THINGS]
    ],
    ctaTitle: 'Votre train. Votre monde.', ctaText: 'Choisissez le Japon et consultez n\'importe quelle paire de villes : durée réelle, type de train et réservation.', ctaBtn: 'Essayer le mode Japon →',
    relTitle: 'Guides d\'itinéraires associés', relMore: 'Plus d\'itinéraires de train au Japon →'
  },
  it: {
    title: 'Sagano Romantic Train a Kyoto: durata, prezzi e la stagione migliore per salire',
    desc: 'Il Sagano Romantic Train costeggia la gola del fiume Hozu vicino a Kyoto in circa 25 minuti. Stazioni, prezzi, come prenotare un posto e la stagione migliore.',
    kw: 'Sagano Romantic Train, treno panoramico Kyoto, treno Arashiyama, gola del fiume Hozu, Torokko Saga Kameoka, Kyoto in autunno',
    tag: 'Giappone', meta: 'Di WoW Train · Ottobre 2026 · 5 min di lettura', back: 'Tutti gli articoli', bc: ['Home', 'Blog'],
    alt: ['Il Sagano Romantic Train che attraversa un bosco di bambù vicino a Kyoto.', 'Foglie d\'autunno e una barca ad Arashiyama.', 'Il bosco di bambù di Arashiyama.'],
    lead: 'Il Sagano Romantic Train è una breve e lenta corsa panoramica nella gola del fiume Hozu, alla periferia di Kyoto. Non serve ad arrivare in fretta da nessuna parte: è un\'escursione di 25 minuti che si inserisce in una mattinata ad Arashiyama. Questa guida spiega dove passa, quanto dura, quanto costa, quando andare e come ottenere un posto.',
    blocks: [
      ['h2', 'Che cos\'è e dove passa'],
      ['p', 'La linea collega <strong>Torokko Saga</strong> e <strong>Torokko Kameoka</strong>, con due fermate intermedie: Torokko Arashiyama e Torokko Hozukyo. Le carrozze seguono la gola del fiume Hozu, e il gestore sostiene che il paesaggio valga in tutte e quattro le stagioni.'],
      ['h2', 'Quanto dura'],
      ['p', 'Il tragitto tra Saga e Kameoka dura circa <strong>25 minuti</strong>, quindi si aggiunge facilmente a una giornata ad Arashiyama. Il treno è lento di proposito: si paga per il panorama, non per la velocità.'],
      ['h2', 'Prezzi'],
      ['p', 'Il gestore applica <strong>una tariffa unica, qualunque sia la distanza percorsa</strong>. Gli adulti sono i maggiori di 12 anni e i bambini da 6 a 12 anni pagano la tariffa ridotta. Le schede turistiche di Kyoto indicano circa ¥880 per gli adulti e ¥440 per i bambini a tratta, ma conferma il prezzo attuale sul sito del gestore prima di partire, perché le tariffe possono cambiare. I neonati sotto 1 anno viaggiano gratis; un bambino molto piccolo che occupa un posto ha bisogno del biglietto ridotto.'],
      ['h2', 'La stagione migliore'],
      ['p', 'La gola cambia a ogni stagione. La <strong>primavera</strong>, con i ciliegi in fiore, e l\'<strong>autunno</strong>, con le foglie rosse, sono i periodi più amati e anche i più affollati: i fine settimana e i festivi di quelle settimane si esauriscono presto. I colori dell\'autunno a Kyoto di solito raggiungono il picco verso fine novembre e i ciliegi tra fine marzo e inizio aprile, ma cambia ogni anno, quindi controlla le previsioni. Per meno folla, scegli un giorno feriale o una partenza al mattino presto.'],
      ['h2', 'Come prenotare un posto'],
      ['ul', ['Prenota online sul sito del gestore: scegli la data, il senso di marcia e il numero di passeggeri (fino a 8), poi la carrozza e il posto. Serve registrare un account.', 'Paga con carta di credito. Il biglietto arriva via e-mail e mostri un codice QR al varco.', 'I biglietti del giorno si vendono agli sportelli delle stazioni in ordine di arrivo (non a Torokko Hozukyo), e un numero limitato di biglietti in piedi viene venduto quando i posti a sedere finiscono.']],
      ['h2', 'Controlla il calendario prima di partire'],
      ['p', 'Il treno non circola tutti i giorni dell\'anno. Il gestore pubblica un calendario e un orario annuali, con i giorni di chiusura: controllali per le tue date. Qui non indichiamo gli orari di partenza perché cambiano con la stagione.'],
      ['h2', 'Trasforma la corsa in una giornata'],
      ['ul', ['Il bosco di bambù di Arashiyama è vicino ed è l\'abbinamento classico con il treno.', 'Pianifica il ritorno: molti visitatori salgono in un senso sul Romantic Train e tornano con la linea JR o con una discesa in barca sul fiume Hozu (controlla le date di esercizio della barca).', 'Kyoto è collegata a Osaka e Tokyo con lo Shinkansen, quindi il treno si inserisce facilmente in un itinerario più ampio.']],
      ['cta', 'Dormire a Kyoto · Hotel su Klook', 'Cerca per date e confronta', ...HOTEL],
      ['cta', 'Cosa fare a Kyoto · Tour e biglietti su Klook', 'Esperienze, gite e attività', ...THINGS]
    ],
    ctaTitle: 'Il tuo treno. Il tuo mondo.', ctaText: 'Scegli il Giappone e consulta qualsiasi coppia di città: durata reale, tipo di treno e prenotazione.', ctaBtn: 'Prova la modalità Giappone →',
    relTitle: 'Guide ai percorsi correlati', relMore: 'Altri percorsi in treno in Giappone →'
  },
  ja: {
    title: '京都の嵯峨野トロッコ列車：所要時間・料金・乗るのにいちばんいい季節',
    desc: '嵯峨野トロッコ列車は京都近郊の保津川渓谷を約25分で走ります。駅、料金、座席の予約方法、いちばんいい季節をまとめました。',
    kw: '嵯峨野トロッコ列車, 京都 観光列車, 嵐山 電車, 保津川渓谷, トロッコ嵯峨 トロッコ亀岡, 京都 紅葉',
    tag: '日本', meta: 'WoW Train · 2026年10月 · 読了5分', back: 'すべての記事', bc: ['ホーム', 'ブログ'],
    alt: ['京都近郊の竹林を走る嵯峨野トロッコ列車。', '嵐山の紅葉と川船。', '嵐山の竹林。'],
    lead: '嵯峨野トロッコ列車は、京都の郊外にある保津川渓谷をゆっくり走る短い観光列車です。どこかへ速く行くための乗り物ではなく、嵐山で過ごす午前中に組み込める約25分の小旅行です。このガイドでは、走る区間、所要時間、料金、行く時期、座席の取り方を紹介します。',
    blocks: [
      ['h2', 'どんな列車で、どこを走るか'],
      ['p', 'トロッコ嵯峨とトロッコ亀岡を結び、途中にトロッコ嵐山とトロッコ保津峡の2駅があります。車両は保津川渓谷に沿って走り、運行会社は四季それぞれに見どころがあるとしています。'],
      ['h2', '所要時間'],
      ['p', '嵯峨から亀岡までは約<strong>25分</strong>で、嵐山での1日に無理なく加えられます。列車は意図的にゆっくり走ります。払うのは速さではなく景色のためです。'],
      ['h2', '料金'],
      ['p', '運行会社は<strong>乗る距離に関係なく均一料金</strong>です。12歳以上が大人、6歳から12歳が子ども料金です。京都の観光情報では片道で大人約880円、子ども約440円とされていますが、運賃は変わることがあるので、出発前に運行会社の公式サイトで最新の料金を確認してください。1歳未満の乳児は無料で、座席を使う幼児は子ども用の乗車券が必要です。'],
      ['h2', 'いちばんいい季節'],
      ['p', '渓谷は季節ごとに表情を変えます。桜の<strong>春</strong>と紅葉の<strong>秋</strong>がいちばん人気で、混み合う時期でもあります。その時期の週末や祝日は早く満席になります。京都の紅葉は例年11月下旬ごろ、桜は3月下旬から4月上旬ごろがピークですが、毎年ずれるので予報を確認してください。混雑を避けるなら、平日か早めの便がおすすめです。'],
      ['h2', '座席の予約方法'],
      ['ul', ['運行会社の公式サイトでオンライン予約します。日付、方向、人数（最大8名）を選び、車両と座席を選びます。アカウント登録が必要です。', '支払いはクレジットカードです。乗車券はメールで届き、改札でQRコードを見せます。', '当日券は駅の窓口で先着順に販売されます（トロッコ保津峡を除く）。座席が売り切れた後は、立席券が限られた枚数で販売されます。']],
      ['h2', '出発前にカレンダーを確認'],
      ['p', 'この列車は1年中毎日走るわけではありません。運行会社が休業日を含む年間カレンダーと時刻表を公表しているので、ご自分の日程で確認してください。時刻は季節で変わるため、ここでは出発時刻を載せていません。'],
      ['h2', '1日をたっぷり楽しむ'],
      ['ul', ['嵐山の竹林はすぐ近くで、トロッコ列車との定番の組み合わせです。', '帰り道を計画しましょう。多くの人は片道をトロッコ列車で、帰りはJR線か保津川下りの舟で戻ります（舟の運航日は確認してください）。', '京都は新幹線で大阪や東京とつながっているので、大きな旅程にも組み込みやすい列車です。']],
      ['cta', '京都に泊まる · Klookでホテル', '日付で検索して比較', ...HOTEL],
      ['cta', '京都でやること · Klookでツアー・チケット', '体験、日帰りツアー、アクティビティ', ...THINGS]
    ],
    ctaTitle: 'あなたの列車。あなたの世界。', ctaText: '日本を選んで、都市のペアを検索しましょう。実際の所要時間、列車の種類、予約まで確認できます。', ctaBtn: '日本モードを試す →',
    relTitle: '関連する路線ガイド', relMore: '日本の鉄道路線をもっと見る →'
  }
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const urlOf = l => `https://glosx.app/${PREFIX[l]}${SLUG}`;

function langSwitch(cur) {
  const opts = LANGS.map(l => `<a class="lang-option${l === cur ? ' active' : ''}" href="/${PREFIX[l]}${SLUG}">${LANG_NAMES[l]}</a>`).join('');
  return `<div class="lang-wrapper"><button type="button" class="lang-btn" aria-label="Language" onclick="event.stopPropagation();this.nextElementSibling.classList.toggle('open');"><span>${cur.toUpperCase()}</span><span style="font-size:10px;opacity:0.6">▾</span></button><div class="lang-dropdown">${opts}</div></div>`;
}

function body(l) {
  const c = C[l];
  const blocks = c.blocks.map(b => {
    if (b[0] === 'h2') return `    <h2>${b[1]}</h2>`;
    if (b[0] === 'p') return `    <p>\n      ${b[1]}\n    </p>`;
    if (b[0] === 'ul') return `    <ul>\n${b[1].map(x => `      <li>${x}</li>`).join('\n')}\n    </ul>`;
    if (b[0] === 'cta') return `    <a href="${API}/${b[3].replace('{lang}', l)}" class="klook-cta" target="_blank" rel="noopener sponsored" onclick="gtag('event','klook_click',{source:'blog_sagano_${l}',route:'${b[4]}'});">
      <img class="klook-logo" src="https://www.google.com/s2/favicons?sz=64&domain=klook.com" alt="Klook" loading="lazy" style="width:36px;height:36px;border-radius:8px;flex-shrink:0;">
      <span class="klook-cta-text">
        <span class="klook-cta-title">${b[1]}</span>
        <span class="klook-cta-sub">${b[2]}</span>
      </span>
      <span class="klook-cta-arrow">→</span>
    </a>`;
  }).join('\n\n');
  const rel = REL.map(([s, a, b]) => {
    const n = RELNAMES[l];
    return `      <li><a href="/rutas/${s}/${l === 'en' ? '' : l + '/'}">${n[a] || a} → ${n[b] || b}</a></li>`;
  }).join('\n');
  const pre = l === 'en' ? '' : `/${l}`;
  return `<body>
  <nav>
    ${require('./apply-logo').MARKUP('/')}
    <div class="nav-right">
      ${langSwitch(l)}
      <a href="${pre}/blog.html" class="nav-back">← ${c.back}</a>
    </div>
  </nav>

  <div class="blog-hero" style="background-image:url('${PHOTO(HERO, 1400)}')">
    <div class="hero-content">
      <span class="badge">${c.tag}</span>
      <h1>${c.title}</h1>
      <p class="meta">${c.meta}</p>
    </div>
  </div>

  <main>
    <p class="lead">
      ${c.lead}
    </p>

    <div class="photo-grid">
${GRID.map((id, i) => `      <img src="${PHOTO(id, 500)}" alt="${esc(c.alt[i])}" loading="lazy" />`).join('\n')}
    </div>

${blocks}

    <hr/>

    <div class="cta">
      <h3>${c.ctaTitle}</h3>
      <p>${c.ctaText}</p>
      <a href="${pre}/#japan" class="cta-btn">${c.ctaBtn}</a>
    </div>
  </main>

    <section class="related-routes" aria-label="${esc(c.relTitle)}">
      <h2>${c.relTitle}</h2>
      <ul>
${rel}
      </ul>
      <p><a href="/rutas/">${c.relMore}</a></p>
    </section>

  `;
}

function build(l) {
  const c = C[l];
  const shell = fs.readFileSync(path.join(ROOT, PREFIX[l], SHELL), 'utf8');
  const lines = shell.split('\n');
  const li = n => lines.findIndex(x => x.includes(n));
  // cabecera: línea 1..5 (doctype, html, head, charset, viewport) + metas propias + resto (analítica, estilos) sin los JSON-LD del molde
  const headTop = lines.slice(0, 5).join('\n');
  const afterMeta = lines.slice(li('<link rel="icon"'), li('<body>')).join('\n')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.bc[0], item: `https://glosx.app/${PREFIX[l]}` },
      { '@type': 'ListItem', position: 2, name: c.bc[1], item: `https://glosx.app/${PREFIX[l]}blog.html` },
      { '@type': 'ListItem', position: 3, name: c.title, item: urlOf(l) }] },
    { '@context': 'https://schema.org', '@type': 'Article', headline: c.title, description: c.desc, image: PHOTO(HERO, 1400),
      author: { '@type': 'Organization', name: 'WoW Train' }, publisher: { '@type': 'Organization', name: 'GLOSX', alternateName: 'WoW Train' },
      datePublished: DATE, dateModified: DATE, inLanguage: l, mainEntityOfPage: urlOf(l) }
  ].map(o => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  const metas = `  <title>${esc(c.title)} — WoW Train</title>
  <meta name="description" content="${esc(c.desc)}" />
  <meta name="keywords" content="${esc(c.kw)}" />
  <link rel="canonical" href="${urlOf(l)}" />
${LANGS.map(x => `  <link rel="alternate" hreflang="${x}" href="${urlOf(x)}" />`).join('\n')}
  <link rel="alternate" hreflang="x-default" href="${urlOf('en')}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(c.title)}" />
  <meta property="og:description" content="${esc(c.desc)}" />
  <meta property="og:url" content="${urlOf(l)}" />
  <meta property="og:image" content="${PHOTO(HERO, 1400)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(c.title)}" />
  <meta name="twitter:description" content="${esc(c.desc)}" />
  <meta name="twitter:image" content="${PHOTO(HERO, 1400)}" />
${ld}
`;
  const footer = shell.slice(shell.indexOf('<footer>'));
  const out = headTop + '\n' + metas + '\n  ' + afterMeta.trim() + '\n' + body(l) + footer;
  fs.writeFileSync(path.join(ROOT, PREFIX[l], SLUG), out);
  console.log('Generado', PREFIX[l] + SLUG);
}

LANGS.forEach(build);

// Marca: une WoW Train con glosx.app en títulos y datos estructurados (idempotente)
require('./apply-brand-title').run();
require('./apply-brand-schema').run();
