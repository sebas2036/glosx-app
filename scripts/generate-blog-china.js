#!/usr/bin/env node
/**
 * Guía del blog "Cómo viajar por China en tren" en en/es/fr/it/ja/zh (fase 7, 14-nov-2026).
 * Usa como molde la guía de Japón de cada idioma (zh usa la inglesa) y cambia metas, hreflang, schema,
 * hero, cuerpo y rutas relacionadas. Tiempos: Klook (scripts/china-klook.json). Sin precios.
 * Además agrega la tarjeta al principio de blog.html (en/es/fr/it/ja) y las URLs al sitemap. Idempotente.
 * Uso: node scripts/generate-blog-china.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FILE = 'blog-china-train-guide.html';
const LANGS = ['en', 'es', 'fr', 'it', 'ja', 'zh'];
const HL = { en: 'en', es: 'es', fr: 'fr', it: 'it', ja: 'ja', zh: 'zh-Hans' };
const NAMES = { en: 'English', es: 'Español', fr: 'Français', it: 'Italiano', ja: '日本語', zh: '中文' };
const CODE = { en: 'EN', es: 'ES', fr: 'FR', it: 'IT', ja: 'JA', zh: '中文' };
const url = l => `https://glosx.app/${l === 'en' ? '' : l + '/'}${FILE}`;
const rel = l => `/${l === 'en' ? '' : l + '/'}${FILE}`;
const { CITY } = require('./routes-china-data');
const KL = require('./china-klook.json').routes;
const HERO = 'https://images.pexels.com/photos/40192439/pexels-photo-40192439.jpeg?auto=compress&cs=tinysrgb&w=1400';
const PHOTOS = [[7532194, 'West Lake, Hangzhou'], [36535024, 'Karst peaks along the Li River, Guilin'], [26970225, 'Hong Kong skyline']];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function dur(m, l) {
  const h = Math.floor(m / 60), r = m % 60;
  if (l === 'ja') return h ? `${h}時間${r ? r + '分' : ''}` : `${m}分`;
  if (l === 'zh') return h ? `${h}小时${r ? r + '分' : ''}` : `${m}分钟`;
  if (!h) return `${m} min`;
  if (l === 'es' || l === 'fr') return r ? `${h} h ${String(r).padStart(2, '0')}` : `${h} h`;
  return r ? `${h}h${String(r).padStart(2, '0')}` : `${h}h`;
}
const TIMES = [['beijing', 'shanghai'], ['beijing', 'xian'], ['xian', 'chengdu'], ['chengdu', 'chongqing'], ['shanghai', 'hangzhou'], ['shanghai', 'suzhou'], ['shanghai', 'nanjing'], ['hangzhou', 'huangshan'], ['beijing', 'tianjin'], ['guangzhou', 'shenzhen'], ['guangzhou', 'guilin'], ['guangzhou', 'hongkong'], ['shenzhen', 'hongkong']];
const tmin = (a, b) => KL[a + '-' + b].fastest_min;

const T = {
  en: {
    title: 'How to Travel China by Train: A First-Timer\'s Guide to High-Speed Rail', desc: 'G, D or K trains? Real journey times between Beijing, Shanghai, Xi\'an, Guilin and Hong Kong, passports and real-name tickets, station tips and a 10-day route by train.',
    badge: 'China', meta: 'By WoW Train · November 2026 · 7 min read', back: '← All articles', home: 'Home', blog: 'Blog',
    lead: 'China has the largest high-speed rail network in the world, and for most trips between big cities the train is faster and simpler than flying. This guide explains the trains you will meet, real journey times, how tickets work for foreign visitors and a first route by train.',
    cta: ['Beijing → Shanghai · Check times and book on Klook', 'High-speed train · from about 4h18 · live schedule on Klook'],
    h: ['The trains you need to know', 'How long the main journeys take', 'Tickets and passports', 'At the station', 'Hong Kong by train', 'When to book early', 'A 10-day route by train', 'Where to start'],
    trains: ['<strong>G trains:</strong> the high-speed services, up to 350 km/h on the main lines. Most journeys in this guide are G trains.', '<strong>D trains:</strong> also high-speed, usually a little slower, with more stops.', '<strong>C trains:</strong> short intercity shuttles, for example between Beijing and Tianjin.', '<strong>Z, T and K trains:</strong> conventional trains, many of them overnight with sleeper berths. Slower, but useful for long distances.'],
    classes: 'On high-speed trains there are three classes: second class (the standard seat), first class (wider seats) and business class (seats that recline almost flat).',
    timesIntro: 'The shortest journey times we found for each route, on the fastest direct train (Klook data, checked 13 November 2026):', timesNote: 'Times change with the day and the train, so check the live schedule for your date when you book.',
    tickets: ['Train tickets in mainland China are issued in the passenger\'s name. Foreign visitors book with their passport, and the same passport is checked at the station.', 'You can book in English on Klook with a foreign card; the ticket is linked to your passport number.', 'Check that the name and passport number on the booking match your passport exactly.'],
    station: ['Big cities have several stations: Beijing South and Beijing West, Shanghai Hongqiao and Shanghai Station, Hangzhou East and Hangzhou West. Check the station on your ticket.', 'There is a security check at the entrance, like at an airport. Arrive 30 to 45 minutes before departure.', 'Boarding opens a few minutes before the train arrives and the gate closes shortly before departure, so wait in the waiting hall near your gate.', 'Stations and trains have hot water for tea or instant noodles; most high-speed trains also sell food on board.'],
    hk: 'The Express Rail Link runs from Guangzhou South and Shenzhen to Hong Kong West Kowloon, near the centre. Border checks for mainland China and Hong Kong are both done inside West Kowloon station, so carry your passport and any visa or entry permit you need, and allow extra time.',
    peak: 'Trains fill up during Chinese New Year (January or February), the May Day holiday and the National Day Golden Week (1 to 7 October). In those weeks, book as soon as you know your dates.',
    route: ['Days 1 to 3: Beijing.', 'Day 4: train to Shanghai, about {bs} on the fastest train.', 'Days 5 and 6: Shanghai, with a half-day trip to Suzhou ({ss} away).', 'Days 7 and 8: Hangzhou and West Lake, {sh} from Shanghai.', 'Days 9 and 10: Huangshan, the Yellow Mountain, {hh} from Hangzhou.'],
    start: 'Pick your two or three main cities, check the real journey time between them and book the long legs first. With <strong>WoW Train</strong> you can look up the time and the number of trains for the main pairs of Chinese cities in a few seconds.',
    box: ['Your train. Your world.', 'Choose China and look up any pair of cities: real duration, trains per day and booking.', 'Try China mode →'],
    rel: 'Related route guides', more: 'More train routes in China →', foot: ['All routes', 'About'], copy: '© 2026 GLOSX. All rights reserved.'
  },
  es: {
    title: 'Cómo viajar por China en tren: guía de la alta velocidad para tu primer viaje', desc: '¿Trenes G, D o K? Tiempos reales entre Pekín, Shanghái, Xi\'an, Guilin y Hong Kong, pasaporte y billetes nominales, consejos en la estación y una ruta de 10 días en tren.',
    badge: 'China', meta: 'Por WoW Train · Noviembre 2026 · 7 min de lectura', back: '← Todos los artículos', home: 'Inicio', blog: 'Blog',
    lead: 'China tiene la red de alta velocidad más grande del mundo, y en la mayoría de los viajes entre grandes ciudades el tren es más rápido y sencillo que el avión. Esta guía explica los trenes que vas a encontrar, los tiempos reales, cómo funcionan los billetes para turistas extranjeros y una primera ruta en tren.',
    cta: ['Pekín → Shanghái · Consulta horarios y reserva en Klook', 'Tren de alta velocidad · desde unas 4 h 18 · horario en vivo en Klook'],
    h: ['Los trenes que tienes que conocer', 'Cuánto duran los trayectos principales', 'Billetes y pasaporte', 'En la estación', 'Hong Kong en tren', 'Cuándo reservar con antelación', 'Una ruta de 10 días en tren', 'Por dónde empezar'],
    trains: ['<strong>Trenes G:</strong> la alta velocidad, hasta 350 km/h en las líneas principales. Casi todos los trayectos de esta guía son trenes G.', '<strong>Trenes D:</strong> también de alta velocidad, en general algo más lentos y con más paradas.', '<strong>Trenes C:</strong> lanzaderas interurbanas cortas, por ejemplo entre Pekín y Tianjin.', '<strong>Trenes Z, T y K:</strong> trenes convencionales, muchos nocturnos con literas. Más lentos, pero útiles para distancias largas.'],
    classes: 'En los trenes de alta velocidad hay tres clases: segunda (el asiento estándar), primera (asientos más anchos) y business (asientos que se reclinan casi en horizontal).',
    timesIntro: 'Los tiempos más cortos que encontramos en cada ruta, en el tren directo más rápido (datos de Klook, consulta del 13 de noviembre de 2026):', timesNote: 'Los tiempos cambian según el día y el tren, así que revisa el horario en vivo de tu fecha al reservar.',
    tickets: ['En China continental los billetes de tren son nominales. Los turistas extranjeros reservan con el pasaporte, y en la estación se comprueba ese mismo pasaporte.', 'Puedes reservar en inglés en Klook con una tarjeta extranjera; el billete queda asociado a tu número de pasaporte.', 'Comprueba que el nombre y el número de pasaporte de la reserva coincidan exactamente con tu pasaporte.'],
    station: ['Las grandes ciudades tienen varias estaciones: Beijing South y Beijing West, Shanghai Hongqiao y la estación de Shanghái, Hangzhou East y Hangzhou West. Revisa la estación de tu billete.', 'Hay un control de seguridad en la entrada, como en un aeropuerto. Llega entre 30 y 45 minutos antes de la salida.', 'El embarque abre unos minutos antes de que llegue el tren y el acceso cierra poco antes de la salida, así que espera en la sala cerca de tu puerta.', 'En estaciones y trenes hay agua caliente para té o fideos instantáneos; la mayoría de los trenes de alta velocidad también venden comida a bordo.'],
    hk: 'El Express Rail Link va de Guangzhou South y Shenzhen a Hong Kong West Kowloon, cerca del centro. Los controles fronterizos de China continental y de Hong Kong se hacen dentro de la estación de West Kowloon, así que lleva el pasaporte y el visado o permiso de entrada que necesites, y calcula tiempo extra.',
    peak: 'Los trenes se llenan en el Año Nuevo chino (enero o febrero), el puente del 1 de mayo y la Semana Dorada del Día Nacional (del 1 al 7 de octubre). En esas semanas, reserva en cuanto tengas las fechas.',
    route: ['Días 1 a 3: Pekín.', 'Día 4: tren a Shanghái, unas {bs} en el tren más rápido.', 'Días 5 y 6: Shanghái, con media jornada en Suzhou (a {ss}).', 'Días 7 y 8: Hangzhou y el Lago del Oeste, a {sh} de Shanghái.', 'Días 9 y 10: Huangshan, la Montaña Amarilla, a {hh} de Hangzhou.'],
    start: 'Elige tus dos o tres ciudades principales, mira el tiempo real entre ellas y reserva primero los tramos largos. Con <strong>WoW Train</strong> consultas el tiempo y la cantidad de trenes entre las principales ciudades chinas en unos segundos.',
    box: ['Tu tren. Tu mundo.', 'Elige China y consulta cualquier par de ciudades: duración real, trenes por día y reserva.', 'Probar el modo China →'],
    rel: 'Guías de ruta relacionadas', more: 'Más rutas de tren en China →', foot: ['Todas las rutas', 'Quiénes somos'], copy: '© 2026 GLOSX. Todos los derechos reservados.'
  },
  fr: {
    title: 'Voyager en Chine en train : guide de la grande vitesse pour un premier séjour', desc: 'Trains G, D ou K ? Durées réelles entre Pékin, Shanghai, Xi\'an, Guilin et Hong Kong, passeport et billets nominatifs, conseils en gare et un itinéraire de 10 jours en train.',
    badge: 'Chine', meta: 'Par WoW Train · Novembre 2026 · 7 min de lecture', back: '← Tous les articles', home: 'Accueil', blog: 'Blog',
    lead: 'La Chine possède le plus grand réseau à grande vitesse du monde, et pour la plupart des trajets entre grandes villes le train est plus rapide et plus simple que l\'avion. Ce guide présente les trains que vous rencontrerez, les durées réelles, le fonctionnement des billets pour les visiteurs étrangers et un premier itinéraire en train.',
    cta: ['Pékin → Shanghai · Horaires et réservation sur Klook', 'Train à grande vitesse · dès 4 h 18 environ · horaires en direct sur Klook'],
    h: ['Les trains à connaître', 'Durée des principaux trajets', 'Billets et passeport', 'En gare', 'Hong Kong en train', 'Quand réserver tôt', 'Un itinéraire de 10 jours en train', 'Par où commencer'],
    trains: ['<strong>Trains G :</strong> la grande vitesse, jusqu\'à 350 km/h sur les lignes principales. La plupart des trajets de ce guide sont des trains G.', '<strong>Trains D :</strong> également à grande vitesse, en général un peu plus lents, avec plus d\'arrêts.', '<strong>Trains C :</strong> navettes interurbaines courtes, par exemple entre Pékin et Tianjin.', '<strong>Trains Z, T et K :</strong> trains classiques, souvent de nuit avec couchettes. Plus lents, mais utiles sur les longues distances.'],
    classes: 'Les trains à grande vitesse ont trois classes : la seconde (le siège standard), la première (sièges plus larges) et la classe affaires (sièges presque entièrement inclinables).',
    timesIntro: 'Les durées les plus courtes trouvées pour chaque trajet, sur le train direct le plus rapide (données Klook, consultation du 13 novembre 2026) :', timesNote: 'Les durées varient selon le jour et le train : vérifiez les horaires en direct pour votre date au moment de réserver.',
    tickets: ['En Chine continentale, les billets de train sont nominatifs. Les visiteurs étrangers réservent avec leur passeport, et ce même passeport est contrôlé en gare.', 'Vous pouvez réserver en anglais sur Klook avec une carte étrangère ; le billet est lié à votre numéro de passeport.', 'Vérifiez que le nom et le numéro de passeport de la réservation correspondent exactement à votre passeport.'],
    station: ['Les grandes villes ont plusieurs gares : Beijing South et Beijing West, Shanghai Hongqiao et la gare de Shanghai, Hangzhou East et Hangzhou West. Vérifiez la gare indiquée sur votre billet.', 'Un contrôle de sécurité a lieu à l\'entrée, comme à l\'aéroport. Arrivez 30 à 45 minutes avant le départ.', 'L\'embarquement ouvre quelques minutes avant l\'arrivée du train et l\'accès ferme peu avant le départ : attendez dans la salle près de votre porte.', 'Gares et trains proposent de l\'eau chaude pour le thé ou les nouilles instantanées ; la plupart des trains à grande vitesse vendent aussi de quoi manger à bord.'],
    hk: 'L\'Express Rail Link relie Guangzhou South et Shenzhen à Hong Kong West Kowloon, près du centre. Les contrôles frontaliers de la Chine continentale et de Hong Kong ont lieu dans la gare de West Kowloon : prenez votre passeport et le visa ou permis d\'entrée nécessaire, et prévoyez du temps.',
    peak: 'Les trains sont pleins pendant le Nouvel An chinois (janvier ou février), le pont du 1er mai et la Semaine d\'or de la fête nationale (du 1er au 7 octobre). Ces semaines-là, réservez dès que vous connaissez vos dates.',
    route: ['Jours 1 à 3 : Pékin.', 'Jour 4 : train pour Shanghai, environ {bs} sur le train le plus rapide.', 'Jours 5 et 6 : Shanghai, avec une demi-journée à Suzhou (à {ss}).', 'Jours 7 et 8 : Hangzhou et le lac de l\'Ouest, à {sh} de Shanghai.', 'Jours 9 et 10 : Huangshan, la Montagne Jaune, à {hh} de Hangzhou.'],
    start: 'Choisissez vos deux ou trois villes principales, regardez la durée réelle entre elles et réservez d\'abord les longs trajets. Avec <strong>WoW Train</strong>, vous trouvez la durée et le nombre de trains entre les principales villes chinoises en quelques secondes.',
    box: ['Votre train. Votre monde.', 'Choisissez la Chine et cherchez n\'importe quelle paire de villes : durée réelle, trains par jour et réservation.', 'Essayer le mode Chine →'],
    rel: 'Guides d\'itinéraires associés', more: 'Plus d\'itinéraires en train en Chine →', foot: ['Tous les itinéraires', 'À propos'], copy: '© 2026 GLOSX. Tous droits réservés.'
  },
  it: {
    title: 'Come viaggiare in Cina in treno: guida all\'alta velocità per il primo viaggio', desc: 'Treni G, D o K? Tempi reali tra Pechino, Shanghai, Xi\'an, Guilin e Hong Kong, passaporto e biglietti nominativi, consigli in stazione e un itinerario di 10 giorni in treno.',
    badge: 'Cina', meta: 'Di WoW Train · Novembre 2026 · 7 min di lettura', back: '← Tutti gli articoli', home: 'Home', blog: 'Blog',
    lead: 'La Cina ha la rete ad alta velocità più grande del mondo, e per la maggior parte dei viaggi tra grandi città il treno è più veloce e semplice dell\'aereo. Questa guida spiega i treni che incontrerai, i tempi reali, come funzionano i biglietti per i visitatori stranieri e un primo itinerario in treno.',
    cta: ['Pechino → Shanghai · Orari e prenotazione su Klook', 'Treno ad alta velocità · da circa 4h18 · orari in tempo reale su Klook'],
    h: ['I treni da conoscere', 'Quanto durano i viaggi principali', 'Biglietti e passaporto', 'In stazione', 'Hong Kong in treno', 'Quando prenotare in anticipo', 'Un itinerario di 10 giorni in treno', 'Da dove cominciare'],
    trains: ['<strong>Treni G:</strong> l\'alta velocità, fino a 350 km/h sulle linee principali. Quasi tutti i viaggi di questa guida sono treni G.', '<strong>Treni D:</strong> anch\'essi ad alta velocità, in genere un po\' più lenti e con più fermate.', '<strong>Treni C:</strong> navette intercity brevi, per esempio tra Pechino e Tianjin.', '<strong>Treni Z, T e K:</strong> treni convenzionali, molti notturni con cuccette. Più lenti, ma utili sulle lunghe distanze.'],
    classes: 'Sui treni ad alta velocità ci sono tre classi: seconda (il posto standard), prima (sedili più larghi) e business (sedili che si reclinano quasi in piano).',
    timesIntro: 'I tempi più brevi trovati per ogni tratta, sul treno diretto più veloce (dati Klook, consultazione del 13 novembre 2026):', timesNote: 'I tempi cambiano in base al giorno e al treno: controlla gli orari in tempo reale per la tua data quando prenoti.',
    tickets: ['Nella Cina continentale i biglietti del treno sono nominativi. I visitatori stranieri prenotano con il passaporto, e in stazione viene controllato lo stesso passaporto.', 'Puoi prenotare in inglese su Klook con una carta straniera; il biglietto è legato al numero del tuo passaporto.', 'Controlla che nome e numero di passaporto della prenotazione corrispondano esattamente al passaporto.'],
    station: ['Le grandi città hanno più stazioni: Beijing South e Beijing West, Shanghai Hongqiao e la stazione di Shanghai, Hangzhou East e Hangzhou West. Controlla la stazione sul biglietto.', 'All\'ingresso c\'è un controllo di sicurezza, come in aeroporto. Arriva 30-45 minuti prima della partenza.', 'L\'imbarco apre pochi minuti prima dell\'arrivo del treno e l\'accesso chiude poco prima della partenza: aspetta nella sala vicino al tuo gate.', 'Stazioni e treni hanno acqua calda per il tè o i noodles istantanei; la maggior parte dei treni ad alta velocità vende anche cibo a bordo.'],
    hk: 'L\'Express Rail Link collega Guangzhou South e Shenzhen a Hong Kong West Kowloon, vicino al centro. I controlli di frontiera della Cina continentale e di Hong Kong si fanno entrambi nella stazione di West Kowloon: porta il passaporto e l\'eventuale visto o permesso d\'ingresso, e calcola tempo in più.',
    peak: 'I treni si riempiono durante il Capodanno cinese (gennaio o febbraio), il ponte del Primo maggio e la Settimana d\'oro della festa nazionale (dal 1 al 7 ottobre). In quelle settimane prenota appena conosci le date.',
    route: ['Giorni 1-3: Pechino.', 'Giorno 4: treno per Shanghai, circa {bs} sul treno più veloce.', 'Giorni 5 e 6: Shanghai, con mezza giornata a Suzhou (a {ss}).', 'Giorni 7 e 8: Hangzhou e il Lago dell\'Ovest, a {sh} da Shanghai.', 'Giorni 9 e 10: Huangshan, la Montagna Gialla, a {hh} da Hangzhou.'],
    start: 'Scegli le due o tre città principali, guarda il tempo reale tra di esse e prenota prima le tratte lunghe. Con <strong>WoW Train</strong> trovi in pochi secondi la durata e il numero di treni tra le principali città cinesi.',
    box: ['Il tuo treno. Il tuo mondo.', 'Scegli la Cina e cerca qualsiasi coppia di città: durata reale, treni al giorno e prenotazione.', 'Prova la modalità Cina →'],
    rel: 'Guide ai percorsi correlate', more: 'Altri percorsi in treno in Cina →', foot: ['Tutti i percorsi', 'Chi siamo'], copy: '© 2026 GLOSX. Tutti i diritti riservati.'
  },
  ja: {
    title: '中国を鉄道で旅する：はじめての高速鉄道ガイド', desc: 'G・D・K、どの列車？ 北京・上海・西安・桂林・香港の実際の所要時間、パスポートと実名制のきっぷ、駅での注意点、10日間の鉄道ルート。',
    badge: '中国', meta: 'WoW Train · 2026年11月 · 読了7分', back: '← 記事一覧', home: 'ホーム', blog: 'ブログ',
    lead: '中国には世界最大の高速鉄道網があり、大都市間のほとんどの移動は飛行機より速く、手軽です。このガイドでは、乗ることになる列車の種類、実際の所要時間、外国人旅行者のきっぷのしくみ、そして最初の鉄道ルートを紹介します。',
    cta: ['北京 → 上海 · 時刻を見てKlookで予約', '高速鉄道 · 最速約4時間18分 · Klookで最新の時刻'],
    h: ['知っておきたい列車', '主な区間の所要時間', 'きっぷとパスポート', '駅で', '鉄道で香港へ', '早めに予約したい時期', '10日間の鉄道ルート', 'まずはここから'],
    trains: ['<strong>G列車：</strong>高速列車。主要路線では最高時速350km。このガイドのほとんどの区間はG列車です。', '<strong>D列車：</strong>これも高速列車ですが、一般にやや遅く、停車駅が多めです。', '<strong>C列車：</strong>北京〜天津などの短い都市間シャトル。', '<strong>Z・T・K列車：</strong>在来線の列車で、寝台付きの夜行も多くあります。遅いものの長距離に便利です。'],
    classes: '高速鉄道には3つの等級があります。二等座（標準）、一等座（座席が広め）、商務座（ほぼ水平まで倒せる座席）です。',
    timesIntro: '各区間で見つかった最短の所要時間です（最速の直通列車、Klookのデータ、2026年11月13日確認）：', timesNote: '所要時間は日や列車によって変わるので、予約時にご希望日の最新の時刻を確認してください。',
    tickets: ['中国本土の列車のきっぷは実名制です。外国人旅行者はパスポートで予約し、駅では同じパスポートを確認されます。', 'Klookなら外国のカードで、英語などで予約できます。きっぷはパスポート番号にひもづけられます。', '予約の氏名とパスポート番号が、パスポートと完全に一致しているか確認しましょう。'],
    station: ['大都市には駅が複数あります。北京南駅と北京西駅、上海虹橋駅と上海駅、杭州東駅と杭州西駅など。きっぷの駅名を確認してください。', '入口で空港のような保安検査があります。出発の30〜45分前には着いておきましょう。', '改札は列車到着の数分前に始まり、発車の少し前に締め切られます。待合室の自分の改札口の近くで待ちましょう。', '駅と車内にはお茶やカップ麺用のお湯があり、多くの高速列車では車内で食事も買えます。'],
    hk: '広深港高速鉄道は広州南駅と深圳から、香港中心部に近い西九龍駅まで走ります。中国本土と香港の出入境審査はどちらも西九龍駅の構内で行われるので、パスポートと必要なビザや入境許可証を持ち、時間に余裕を持ってください。',
    peak: '春節（1月か2月）、5月1日の連休、国慶節の大型連休（10月1日〜7日）は列車が満席になりがちです。この時期は日程が決まりしだい予約しましょう。',
    route: ['1〜3日目：北京。', '4日目：上海へ。最速の列車で約{bs}。', '5〜6日目：上海。蘇州（{ss}）へ半日で足を延ばす。', '7〜8日目：杭州と西湖。上海から{sh}。', '9〜10日目：黄山。杭州から{hh}。'],
    start: '主な都市を2〜3つ選び、その間の実際の所要時間を確かめて、長い区間から予約しましょう。<strong>WoW Train</strong>なら、中国の主要都市間の所要時間と本数が数秒でわかります。',
    box: ['あなたの列車。あなたの世界。', '中国を選んで、好きな都市の組み合わせを検索：実際の所要時間、1日の本数、予約。', '中国モードを試す →'],
    rel: '関連するルートガイド', more: '中国のほかの鉄道ルート →', foot: ['すべてのルート', 'このサイトについて'], copy: '© 2026 GLOSX. All rights reserved.'
  },
  zh: {
    title: '坐火车游中国：第一次坐高铁就看这篇', desc: 'G、D 还是 K 字头？北京、上海、西安、桂林和香港之间的真实行程时长，护照与实名制车票，车站须知，以及 10 天火车行程。',
    badge: '中国', meta: 'WoW Train · 2026 年 11 月 · 阅读约 7 分钟', back: '← 全部文章', home: '首页', blog: '博客',
    lead: '中国拥有世界上最大的高铁网络，大城市之间的大多数行程，坐火车比坐飞机更快、更省事。这篇指南介绍你会遇到的列车类型、真实的行程时长、外国游客的购票方式，以及一条适合第一次的火车线路。',
    cta: ['北京 → 上海 · 在 Klook 查看时刻并预订', '高铁 · 最快约 4 小时 18 分 · 在 Klook 查看实时时刻'],
    h: ['需要了解的列车', '主要线路要坐多久', '车票和护照', '在车站', '坐火车去香港', '什么时候要提前订', '10 天火车行程', '从哪里开始'],
    trains: ['<strong>G 字头：</strong>高铁，主要线路最高时速 350 公里。本文的大多数行程都是 G 字头列车。', '<strong>D 字头：</strong>同样是动车组，一般稍慢一些，停站更多。', '<strong>C 字头：</strong>城际短途列车，例如北京到天津。', '<strong>Z、T、K 字头：</strong>普通列车，很多是带卧铺的夜车。速度较慢，但适合长途。'],
    classes: '高铁有三种座位：二等座（标准座位）、一等座（座位更宽）和商务座（几乎可以放平）。',
    timesIntro: '各条线路最快直达列车的最短时长（Klook 数据，2026 年 11 月 13 日查询）：', timesNote: '时长会因日期和车次而变化，订票时请查看你所选日期的实时时刻。',
    tickets: ['中国内地火车票实行实名制。外国游客用护照购票，进站时也核验同一本护照。', '可以在 Klook 用境外银行卡预订，车票与护照号码绑定。', '请确认订单上的姓名和护照号码与护照完全一致。'],
    station: ['大城市往往有好几个火车站：北京南站和北京西站、上海虹桥站和上海站、杭州东站和杭州西站等。请看清车票上的车站。', '进站时有像机场一样的安检。请在发车前 30 到 45 分钟到达。', '列车到站前几分钟开始检票，发车前不久停止检票，请在候车厅自己的检票口附近等候。', '车站和车上都有开水，可以泡茶或泡面；大多数高铁上也能买到餐食。'],
    hk: '广深港高铁从广州南站和深圳开往靠近香港市中心的西九龙站。内地和香港的出入境检查都在西九龙站内办理，请带好护照及所需的签证或通行证件，并预留时间。',
    peak: '春节（一月或二月）、五一假期和国庆黄金周（10 月 1 日至 7 日）期间火车票很紧张。这几周请在确定日期后尽早预订。',
    route: ['第 1–3 天：北京。', '第 4 天：坐火车去上海，最快约{bs}。', '第 5–6 天：上海，抽半天去苏州（{ss}）。', '第 7–8 天：杭州和西湖，从上海出发{sh}。', '第 9–10 天：黄山，从杭州出发{hh}。'],
    start: '先选好两三个主要城市，查一下它们之间的真实时长，再先订长途路段。用 <strong>WoW Train</strong>，几秒钟就能查到中国主要城市之间的时长和车次数量。',
    box: ['你的列车，你的世界。', '选择“中国”，查询任意两座城市：真实时长、每天车次和预订。', '试试中国模式 →'],
    rel: '相关线路指南', more: '中国更多火车线路 →', foot: ['全部线路', '关于我们'], copy: '© 2026 GLOSX。保留所有权利。'
  }
};
const RELATED = [['beijing', 'shanghai', 'beijing-shanghai'], ['shanghai', 'hangzhou', 'shanghai-hangzhou'], ['beijing', 'xian', 'beijing-xian'], ['guangzhou', 'guilin', 'guangzhou-guilin'], ['shenzhen', 'hongkong', 'shenzhen-hong-kong']];
const BOOK = 'https://voxa-production-dc15.up.railway.app/affiliate/klook-china-train?from=beijing&to=shanghai';

function body(l) {
  const t = T[l], sfx = l === 'en' ? '' : l + '/';
  const D = (a, b) => dur(tmin(a, b), l);
  const ctaBlock = (src, top) => `    <a href="${BOOK}" class="klook-cta"${top ? ' data-cta-extra="top"' : ''} target="_blank" rel="noopener sponsored" onclick="gtag('event','klook_click',{source:'${src}',route:'beijing-shanghai'});">
      <img class="klook-logo" src="https://www.google.com/s2/favicons?sz=64&domain=klook.com" alt="Klook" loading="lazy" style="width:36px;height:36px;border-radius:8px;flex-shrink:0;" width="36" height="36">
      <span class="klook-cta-text">
        <span class="klook-cta-title">${esc(t.cta[0])}</span>
        <span class="klook-cta-sub">${esc(t.cta[1])}</span>
      </span>
      <span class="klook-cta-arrow">→</span>
    </a>`;
  const ul = items => '    <ul>\n' + items.map(x => `      <li>${x}</li>`).join('\n') + '\n    </ul>';
  const fill = s => s.replace('{bs}', D('beijing', 'shanghai')).replace('{ss}', D('shanghai', 'suzhou')).replace('{sh}', D('shanghai', 'hangzhou')).replace('{hh}', D('hangzhou', 'huangshan'));
  const sep = l === 'ja' || l === 'zh' ? '–' : ' – ';
  return `  <div class="blog-hero" style="background-image:url('${HERO}')">
    <div class="hero-content">
      <span class="badge">${esc(t.badge)}</span>
      <h1>${esc(t.title)}</h1>
      <p class="meta">${esc(t.meta)}</p>
    </div>
  </div>

  <main>
    <p class="lead">
      ${esc(t.lead)}
    </p>

    <div class="photo-grid">
${PHOTOS.map(([id, alt]) => `      <img src="https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=500" alt="${esc(alt)}" loading="lazy" />`).join('\n')}
    </div>

${ctaBlock('blog_china_' + l + '_top', true)}

    <h2>${esc(t.h[0])}</h2>
${ul(t.trains)}
    <p>${esc(t.classes)}</p>

    <h2>${esc(t.h[1])}</h2>
    <p>${esc(t.timesIntro)}</p>
${ul(TIMES.map(([a, b]) => esc(CITY[a][l] + sep + CITY[b][l]) + (l === 'ja' || l === 'zh' ? '：' : ': ') + D(a, b)))}
    <p>${esc(t.timesNote)}</p>

    <h2>${esc(t.h[2])}</h2>
${ul(t.tickets.map(esc))}

    <h2>${esc(t.h[3])}</h2>
${ul(t.station.map(esc))}

    <h2>${esc(t.h[4])}</h2>
    <p>${esc(t.hk)}</p>

    <h2>${esc(t.h[5])}</h2>
    <p>${esc(t.peak)}</p>

    <h2>${esc(t.h[6])}</h2>
${ul(t.route.map(x => esc(fill(x))))}

${ctaBlock('blog_china_' + l, false)}

    <h2>${esc(t.h[7])}</h2>
    <p>${t.start}</p>

    <hr/>

    <div class="cta">
      <h3>${esc(t.box[0])}</h3>
      <p>${esc(t.box[1])}</p>
      <a href="/${l === 'en' ? '' : l + '/'}#china" class="cta-btn">${esc(t.box[2])}</a>
    </div>
  </main>

    <section class="related-routes" aria-label="${esc(t.rel)}">
      <h2>${esc(t.rel)}</h2>
      <ul>
${RELATED.map(([a, b, s]) => `      <li><a href="/rutas/${s}/${sfx}">${esc(CITY[a][l])} → ${esc(CITY[b][l])}</a></li>`).join('\n')}
      </ul>
      <p><a href="/${l === 'en' ? '' : l + '/'}rutas/#china">${esc(t.more)}</a></p>
    </section>`;
}

function page(l) {
  const t = T[l];
  const src = fs.readFileSync(path.join(ROOT, l === 'en' || l === 'zh' ? '' : l, 'blog-japan-train-guide.html'), 'utf8');
  let h = src;
  h = h.replace(/<html lang="[^"]*">/, `<html lang="${HL[l]}">`);
  h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(t.title)} — WoW Train · glosx.app</title>`);
  const setMeta = (re, v) => { h = h.replace(re, (m, a, b) => a + esc(v) + b); };
  setMeta(/(<meta name="description" content=")[^"]*(")/, t.desc);
  h = h.replace(/\s*<meta name="keywords" content="[^"]*" \/>/, '');
  setMeta(/(<meta property="og:title" content=")[^"]*(")/, t.title);
  setMeta(/(<meta property="og:description" content=")[^"]*(")/, t.desc);
  setMeta(/(<meta name="twitter:title" content=")[^"]*(")/, t.title);
  setMeta(/(<meta name="twitter:description" content=")[^"]*(")/, t.desc);
  h = h.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${HERO}$2`).replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${HERO}$2`);
  h = h.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url(l)}$2`).replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url(l)}$2`);
  h = h.replace(/(\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>)+/, '\n' + LANGS.map(x => `  <link rel="alternate" hreflang="${HL[x]}" href="${url(x)}" />`).join('\n') + `\n  <link rel="alternate" hreflang="x-default" href="${url('en')}" />`);
  const home = l === 'en' ? 'https://glosx.app/' : `https://glosx.app/${l}/`;
  const ld1 = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: t.home, item: home }, { '@type': 'ListItem', position: 2, name: t.blog, item: l === 'zh' ? 'https://glosx.app/blog.html' : home + 'blog.html' }, { '@type': 'ListItem', position: 3, name: t.title, item: url(l) }] };
  const ld2 = { '@context': 'https://schema.org', '@type': 'Article', headline: t.title, description: t.desc, image: HERO, datePublished: '2026-11-14', dateModified: '2026-11-14', inLanguage: HL[l], author: { '@type': 'Organization', name: 'WoW Train', url: 'https://glosx.app/' }, publisher: { '@type': 'Organization', name: 'WoW Train', logo: { '@type': 'ImageObject', url: 'https://glosx.app/logo.png' } }, mainEntityOfPage: url(l) };
  h = h.replace(/<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema.org","@type":"BreadcrumbList"[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(ld1)}</script>`);
  h = h.replace(/<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema.org","@type":"Article"[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(ld2)}</script>`);
  // selector de idioma
  const opts = LANGS.map(x => `<a class="lang-option${x === l ? ' active' : ''}" href="${rel(x)}" hreflang="${HL[x]}" lang="${HL[x]}">${NAMES[x]}</a>`).join('');
  h = h.replace(/<span id="langCode">[^<]*<\/span>/, `<span id="langCode">${CODE[l]}</span>`).replace(/(<div class="lang-dropdown" id="langDropdown">)[\s\S]*?(<\/div><\/div>)/, `$1${opts}$2`);
  // cuerpo
  const a = h.indexOf('<div class="blog-hero"'), b = h.indexOf('</section>', h.indexOf('class="related-routes"')) + '</section>'.length;
  h = h.slice(0, h.lastIndexOf('\n', a) + 1) + body(l) + h.slice(b);
  if (l === 'zh') {
    h = h.replace('href="/" class="nav-logo', 'href="/zh/" class="nav-logo').replace('>← All articles<', '>' + t.back + '<');
    h = h.replace(/<footer>[\s\S]*?<\/footer>/, `<footer>\n  <p><a href="/zh/">WoW Train</a> · <a href="/blog.html">${t.blog}</a> · <a href="/zh/rutas/">${t.foot[0]}</a> · <a href="/about.html">${t.foot[1]}</a></p>\n  <p style="margin-top:10px;">${t.copy}</p>\n</footer>`);
  }
  return h;
}

for (const l of LANGS) {
  const out = path.join(ROOT, l === 'en' ? '' : l, FILE);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page(l));
}
console.log('Guía de China generada en', LANGS.length, 'idiomas');

// tarjeta al principio de cada blog.html
for (const l of ['en', 'es', 'fr', 'it', 'ja']) {
  const p = path.join(ROOT, l === 'en' ? '' : l, 'blog.html');
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes(`href="${rel(l)}"`)) continue;
  const t = T[l];
  const card = `\n    <a href="${rel(l)}" class="post">
      <img class="post-img" src="${HERO.replace('w=1400', 'w=640').replace(/&/g, '&amp;')}" alt="${esc(t.title)}" loading="lazy" width="640" height="400" />
      <div class="post-body">
        <span class="post-tag">${esc(t.badge)}</span>
        <div class="post-title">${esc(t.title)}</div>
        <div class="post-desc">${esc(t.desc)}</div>
        <div class="post-meta">${esc(t.meta.split(' · ').slice(1).join(' · '))}</div>
      </div>
    </a>\n`;
  s = s.replace(/(<main class="blog-grid">\n)/, `$1${card}`);
  fs.writeFileSync(p, s);
}
// sitemap
const sm = path.join(ROOT, 'sitemap.xml');
let x = fs.readFileSync(sm, 'utf8');
const alts = LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${HL[l]}" href="${url(l)}"/>`).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${url('en')}"/>`;
let n = 0;
for (const l of LANGS) {
  if (x.includes(`<loc>${url(l)}</loc>`)) continue;
  x = x.replace('</urlset>', `  <url>\n    <loc>${url(l)}</loc>\n${alts}\n    <lastmod>2026-11-14</lastmod>\n  </url>\n</urlset>`);
  n++;
}
fs.writeFileSync(sm, x);
fs.writeFileSync(path.join(__dirname, 'blog-china-urls.txt'), LANGS.map(url).join('\n') + '\n');
console.log('Sitemap +' + n);
