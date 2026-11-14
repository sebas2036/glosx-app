#!/usr/bin/env node
/**
 * Dos artículos más del blog de China (14-nov-2026), en en/es/fr/it/ja/zh, con el mismo molde que
 * blog-china-train-guide.html (generate-blog-china.js): metas, hreflang, schema, cuerpo y rutas relacionadas.
 *  - blog-china-day-trips-by-train.html: excursiones de un día en tren
 *  - blog-china-scenic-train-rides.html: los viajes en tren más bonitos
 * Cada destino usa la duración y los trenes reales de Klook (scripts/china-klook.json) y la frase propia
 * de su página de ruta (HIGHLIGHT de routes-china-*.js). Agrega la tarjeta en blog.html (en/es/fr/it/ja)
 * y las URLs al sitemap. Idempotente. Uso: node scripts/generate-blog-china-extra.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LANGS = ['en', 'es', 'fr', 'it', 'ja', 'zh'];
const HL = { en: 'en', es: 'es', fr: 'fr', it: 'it', ja: 'ja', zh: 'zh-Hans' };
const NAMES = { en: 'English', es: 'Español', fr: 'Français', it: 'Italiano', ja: '日本語', zh: '中文' };
const CODE = { en: 'EN', es: 'ES', fr: 'FR', it: 'IT', ja: 'JA', zh: '中文' };
const { DATA, CITY, LIST, KEY, HIGHLIGHT } = require('./routes-china-data');
const R = Object.fromEntries(LIST.map(([slug, a, b, photo]) => [slug, { a, b, photo, d: DATA[KEY[slug] || slug] }]));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const API = 'https://voxa-production-dc15.up.railway.app/affiliate/klook-china-train';
const px = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

function dur(m, l) {
  const h = Math.floor(m / 60), r = m % 60;
  if (l === 'ja') return h ? `${h}時間${r ? r + '分' : ''}` : `${m}分`;
  if (l === 'zh') return h ? `${h}小时${r ? r + '分' : ''}` : `${m}分钟`;
  if (!h) return `${m} min`;
  if (l === 'es' || l === 'fr') return r ? `${h} h ${String(r).padStart(2, '0')}` : `${h} h`;
  return r ? `${h}h${String(r).padStart(2, '0')}` : `${h}h`;
}
// "desde 1 h 15 · 213 trenes al día"
const STAT = {
  en: (t, n) => `from ${t} · ${n} trains on the day we checked`, es: (t, n) => `desde ${t} · ${n} trenes el día consultado`,
  fr: (t, n) => `dès ${t} · ${n} trains le jour consulté`, it: (t, n) => `da ${t} · ${n} treni nel giorno consultato`,
  ja: (t, n) => `最速${t}・調査日${n}本`, zh: (t, n) => `最快${t}·查询当天${n}班`
};
const COMMON = {
  en: { back: '← All articles', home: 'Home', blog: 'Blog', meta: 'By WoW Train · November 2026 · 6 min read', rel: 'Related route guides', more: 'More train routes in China →', foot: ['All routes', 'About'], copy: '© 2026 GLOSX. All rights reserved.', box: ['Your train. Your world.', 'Choose China and look up any pair of cities: real duration, trains per day and booking.', 'Try China mode →'], cta: (a, b) => [`${a} → ${b} · Check times and book on Klook`, 'High-speed train · live schedule for your date on Klook'], data: 'Journey times and trains per day: Klook search for 27 November 2026. Times change with the day and the train, so check the live schedule when you book.' },
  es: { back: '← Todos los artículos', home: 'Inicio', blog: 'Blog', meta: 'Por WoW Train · Noviembre 2026 · 6 min de lectura', rel: 'Guías de ruta relacionadas', more: 'Más rutas de tren en China →', foot: ['Todas las rutas', 'Quiénes somos'], copy: '© 2026 GLOSX. Todos los derechos reservados.', box: ['Tu tren. Tu mundo.', 'Elige China y consulta cualquier par de ciudades: duración real, trenes por día y reserva.', 'Probar el modo China →'], cta: (a, b) => [`${a} → ${b} · Consulta horarios y reserva en Klook`, 'Tren de alta velocidad · horario en vivo de tu fecha en Klook'], data: 'Duraciones y trenes por día: búsqueda en Klook para el 27 de noviembre de 2026. Los tiempos cambian según el día y el tren, así que revisa el horario en vivo al reservar.' },
  fr: { back: '← Tous les articles', home: 'Accueil', blog: 'Blog', meta: 'Par WoW Train · Novembre 2026 · 6 min de lecture', rel: 'Guides d\'itinéraires associés', more: 'Plus d\'itinéraires en train en Chine →', foot: ['Tous les itinéraires', 'À propos'], copy: '© 2026 GLOSX. Tous droits réservés.', box: ['Votre train. Votre monde.', 'Choisissez la Chine et cherchez n\'importe quelle paire de villes : durée réelle, trains par jour et réservation.', 'Essayer le mode Chine →'], cta: (a, b) => [`${a} → ${b} · Horaires et réservation sur Klook`, 'Train à grande vitesse · horaires en direct pour votre date sur Klook'], data: 'Durées et trains par jour : recherche Klook pour le 27 novembre 2026. Les durées varient selon le jour et le train : vérifiez les horaires en direct au moment de réserver.' },
  it: { back: '← Tutti gli articoli', home: 'Home', blog: 'Blog', meta: 'Di WoW Train · Novembre 2026 · 6 min di lettura', rel: 'Guide ai percorsi correlate', more: 'Altri percorsi in treno in Cina →', foot: ['Tutti i percorsi', 'Chi siamo'], copy: '© 2026 GLOSX. Tutti i diritti riservati.', box: ['Il tuo treno. Il tuo mondo.', 'Scegli la Cina e cerca qualsiasi coppia di città: durata reale, treni al giorno e prenotazione.', 'Prova la modalità Cina →'], cta: (a, b) => [`${a} → ${b} · Orari e prenotazione su Klook`, 'Treno ad alta velocità · orari in tempo reale per la tua data su Klook'], data: 'Durate e treni al giorno: ricerca su Klook per il 27 novembre 2026. I tempi cambiano in base al giorno e al treno, quindi controlla gli orari in tempo reale quando prenoti.' },
  ja: { back: '← 記事一覧', home: 'ホーム', blog: 'ブログ', meta: 'WoW Train · 2026年11月 · 読了6分', rel: '関連するルートガイド', more: '中国のほかの鉄道ルート →', foot: ['すべてのルート', 'このサイトについて'], copy: '© 2026 GLOSX. All rights reserved.', box: ['あなたの列車。あなたの世界。', '中国を選んで、好きな都市の組み合わせを検索：実際の所要時間、1日の本数、予約。', '中国モードを試す →'], cta: (a, b) => [`${a} → ${b} · 時刻を見てKlookで予約`, '高速鉄道 · ご希望日の最新の時刻をKlookで'], data: '所要時間と本数：2026年11月27日分のKlookの検索結果。所要時間は日や列車によって変わるので、予約時に最新の時刻を確認してください。' },
  zh: { back: '← 全部文章', home: '首页', blog: '博客', meta: 'WoW Train · 2026 年 11 月 · 阅读约 6 分钟', rel: '相关线路指南', more: '中国更多火车线路 →', foot: ['全部线路', '关于我们'], copy: '© 2026 GLOSX。保留所有权利。', box: ['你的列车，你的世界。', '选择“中国”，查询任意两座城市：真实时长、每天车次和预订。', '试试中国模式 →'], cta: (a, b) => [`${a} → ${b} · 在 Klook 查看时刻并预订`, '高铁 · 在 Klook 查看你所选日期的实时时刻'], data: '时长和每天车次：Klook 上 2026 年 11 月 27 日的查询结果。时长会因日期和车次而变化，订票时请查看实时时刻。' }
};

const POSTS = [
  {
    file: 'blog-china-day-trips-by-train.html', hero: 34432366, photos: [36767695, 7494607, 38512878], book: 'shanghai-suzhou',
    sections: [['shanghai-suzhou', 'shanghai-hangzhou', 'shanghai-wuxi', 'shanghai-nanjing', 'hangzhou-shaoxing'], ['beijing-tianjin', 'beijing-jinan', 'beijing-taian', 'beijing-datong'], ['xian-luoyang', 'chengdu-leshan', 'chengdu-chongqing', 'guangzhou-shenzhen', 'guangzhou-zhuhai', 'zhengzhou-kaifeng']],
    related: ['shanghai-suzhou', 'shanghai-hangzhou', 'beijing-tianjin', 'xian-luoyang', 'chengdu-leshan'],
    T: {
      en: { title: 'China Day Trips by Train: 15 Easy Escapes from Shanghai, Beijing and More', desc: 'Day trips by high-speed train from Shanghai, Beijing, Xi\'an, Chengdu and Guangzhou, with real journey times and trains per day from Klook, and tips to go and come back the same day.', badge: 'China', lead: 'China’s high-speed trains put gardens, water towns, sacred mountains and ancient capitals within easy reach of the big cities. These are the best day trips by train, each with the fastest journey time and the number of trains we found on Klook.', h: ['From Shanghai', 'From Beijing', 'From Xi’an, Chengdu, Guangzhou and Zhengzhou', 'Tips for a day trip by train'], tips: ['Book the return train at the same time as the outward one, especially on weekends.', 'Big cities have several stations: check the one on each ticket, and allow time to cross the city.', 'Arrive 30 to 45 minutes before departure for the security check, and carry your passport: tickets are in your name.', 'Leave yourself a margin on the way back: if you miss your train, the next one may be full.'] },
      es: { title: 'Excursiones de un día en tren por China: 15 escapadas fáciles desde Shanghái, Pekín y más', desc: 'Excursiones de un día en tren de alta velocidad desde Shanghái, Pekín, Xi\'an, Chengdu y Cantón, con tiempos y trenes reales de Klook y consejos para ir y volver en el día.', badge: 'China', lead: 'Los trenes de alta velocidad de China dejan jardines, pueblos de agua, montañas sagradas y antiguas capitales al alcance de las grandes ciudades. Estas son las mejores excursiones de un día en tren, cada una con el tiempo del tren más rápido y la cantidad de trenes que encontramos en Klook.', h: ['Desde Shanghái', 'Desde Pekín', 'Desde Xi’an, Chengdu, Cantón y Zhengzhou', 'Consejos para ir y volver en el día'], tips: ['Reserva el tren de vuelta junto con el de ida, sobre todo los fines de semana.', 'Las grandes ciudades tienen varias estaciones: revisa la de cada billete y calcula tiempo para cruzar la ciudad.', 'Llega entre 30 y 45 minutos antes para el control de seguridad y lleva el pasaporte: los billetes son nominales.', 'Deja margen a la vuelta: si pierdes el tren, el siguiente puede estar lleno.'] },
      fr: { title: 'Excursions d’une journée en train en Chine : 15 escapades faciles depuis Shanghai, Pékin et ailleurs', desc: 'Excursions d\'une journée en train à grande vitesse depuis Shanghai, Pékin, Xi\'an, Chengdu et Canton, avec durées et nombre de trains réels sur Klook, et conseils pour faire l\'aller-retour dans la journée.', badge: 'Chine', lead: 'Les trains à grande vitesse chinois mettent jardins, villes d’eau, montagnes sacrées et anciennes capitales à portée des grandes villes. Voici les meilleures excursions d’une journée en train, chacune avec la durée du train le plus rapide et le nombre de trains trouvés sur Klook.', h: ['Depuis Shanghai', 'Depuis Pékin', 'Depuis Xi’an, Chengdu, Canton et Zhengzhou', 'Conseils pour un aller-retour dans la journée'], tips: ['Réservez le train du retour en même temps que l’aller, surtout le week-end.', 'Les grandes villes ont plusieurs gares : vérifiez celle de chaque billet et prévoyez le temps de traverser la ville.', 'Arrivez 30 à 45 minutes avant le départ pour le contrôle de sécurité et prenez votre passeport : les billets sont nominatifs.', 'Gardez une marge au retour : si vous manquez votre train, le suivant peut être complet.'] },
      it: { title: 'Gite di un giorno in treno in Cina: 15 fughe facili da Shanghai, Pechino e altre città', desc: 'Gite di un giorno in treno ad alta velocità da Shanghai, Pechino, Xi\'an, Chengdu e Canton, con tempi e treni reali su Klook e consigli per andare e tornare in giornata.', badge: 'Cina', lead: 'I treni ad alta velocità cinesi mettono giardini, città d’acqua, montagne sacre e antiche capitali a portata delle grandi città. Ecco le migliori gite di un giorno in treno, ciascuna con il tempo del treno più veloce e il numero di treni trovati su Klook.', h: ['Da Shanghai', 'Da Pechino', 'Da Xi’an, Chengdu, Canton e Zhengzhou', 'Consigli per andare e tornare in giornata'], tips: ['Prenota il treno di ritorno insieme a quello di andata, soprattutto nel fine settimana.', 'Le grandi città hanno più stazioni: controlla quella di ogni biglietto e calcola il tempo per attraversare la città.', 'Arriva 30-45 minuti prima per il controllo di sicurezza e porta il passaporto: i biglietti sono nominativi.', 'Tieni un margine al ritorno: se perdi il treno, il successivo potrebbe essere pieno.'] },
      ja: { title: '中国の鉄道で行く日帰り旅：上海・北京などから気軽に行ける15の行き先', desc: '上海・北京・西安・成都・広州から高速鉄道で行く日帰り旅。Klookの実際の所要時間と本数、日帰りで往復するためのコツ。', badge: '中国', lead: '中国の高速鉄道なら、庭園、水郷、聖なる山、古都に大都市から気軽に行けます。日帰りにぴったりの行き先を、最速列車の所要時間とKlookで見つかった本数とともに紹介します。', h: ['上海から', '北京から', '西安・成都・広州・鄭州から', '日帰り旅のコツ'], tips: ['特に週末は、行きと一緒に帰りの列車も予約しておきましょう。', '大都市には駅が複数あります。それぞれのきっぷの駅を確認し、市内の移動時間も見込んでおきましょう。', '保安検査があるので出発の30〜45分前には駅へ。きっぷは実名制なのでパスポートを忘れずに。', '帰りは時間に余裕を。乗り遅れると次の列車が満席のこともあります。'] },
      zh: { title: '坐火车一日游中国：从上海、北京等地出发的 15 个轻松去处', desc: '从上海、北京、西安、成都和广州出发的高铁一日游，附 Klook 上的真实时长和车次，以及当天往返的小贴士。', badge: '中国', lead: '有了高铁，园林、水乡、名山和古都都离大城市不远。下面是最适合坐火车一日游的去处，每个都附有最快车次的时长和我们在 Klook 上查到的车次数量。', h: ['从上海出发', '从北京出发', '从西安、成都、广州和郑州出发', '当天往返的小贴士'], tips: ['尤其是周末，去程和回程最好一起订。', '大城市往往有好几个火车站：看清每张车票上的车站，并预留穿越市区的时间。', '车站有安检，请提前 30 到 45 分钟到达；车票实行实名制，记得带护照。', '回程留足时间：错过一班车，下一班可能已经满座。'] }
    }
  },
  {
    file: 'blog-china-scenic-train-rides.html', hero: 9383499, photos: [24246270, 34630868, 31582901], book: 'guangzhou-guilin',
    sections: [['guangzhou-guilin', 'hangzhou-huangshan', 'changsha-zhangjiajie', 'guiyang-guilin'], ['lanzhou-zhangye', 'lanzhou-xining', 'kunming-lijiang', 'kunming-dali'], ['xian-chengdu', 'chengdu-guiyang', 'chongqing-kunming', 'wuhan-yichang'], ['haikou-sanya', 'shenyang-dalian', 'hangzhou-wenzhou', 'qingdao-yantai']],
    related: ['guangzhou-guilin', 'lanzhou-zhangye', 'kunming-lijiang', 'hangzhou-huangshan', 'haikou-sanya'],
    T: {
      en: { title: 'The Most Scenic Train Rides in China: Karst Peaks, Rainbow Mountains and the Tibetan Plateau', desc: 'The most beautiful train journeys in China, from Guilin’s karst peaks and the Yellow Mountain to Zhangye’s rainbow mountains, Qinghai Lake and the Hainan coast, with real journey times from Klook.', badge: 'China', lead: 'High-speed lines in China run through some extraordinary landscapes: limestone peaks, rice terraces, deserts, snowy plateaus and tropical coasts. These are the most scenic train rides, each with the fastest journey time and the number of trains we found on Klook.', h: ['Karst peaks and sacred mountains', 'The far west: rainbow mountains and the plateau', 'Through the mountains', 'Coasts and islands', 'How to enjoy the view'], tips: ['In second class, seats A and F are by the window (A, B, C on one side, D and F on the other).', 'Many mountain lines run through long tunnels, so the views come in bursts: keep your camera ready.', 'Book scenic routes early in spring and autumn, and around Chinese New Year and the October Golden Week.', 'Some places, like Zhangye and Huangshan, are a bus or taxi ride from the station: plan that leg before you go.'] },
      es: { title: 'Los viajes en tren más bonitos de China: picos kársticos, montañas de colores y la meseta tibetana', desc: 'Los viajes en tren más bonitos de China, de los picos kársticos de Guilin y la Montaña Amarilla a las montañas de colores de Zhangye, el lago Qinghai y la costa de Hainan, con tiempos reales de Klook.', badge: 'China', lead: 'Las líneas de alta velocidad de China atraviesan paisajes extraordinarios: picos de piedra caliza, terrazas de arroz, desiertos, mesetas nevadas y costas tropicales. Estos son los viajes en tren más bonitos, cada uno con el tiempo del tren más rápido y la cantidad de trenes que encontramos en Klook.', h: ['Picos kársticos y montañas sagradas', 'El lejano oeste: montañas de colores y la meseta', 'Entre montañas', 'Costas e islas', 'Cómo disfrutar del paisaje'], tips: ['En segunda clase, los asientos A y F van junto a la ventana (A, B y C de un lado; D y F del otro).', 'Muchas líneas de montaña pasan por túneles largos, así que el paisaje aparece a ratos: ten la cámara a mano.', 'Reserva pronto las rutas panorámicas en primavera y otoño, y en el Año Nuevo chino y la Semana Dorada de octubre.', 'Algunos lugares, como Zhangye y Huangshan, quedan a un trayecto en autobús o taxi de la estación: planifica ese tramo antes de ir.'] },
      fr: { title: 'Les plus beaux trajets en train en Chine : pics karstiques, montagnes arc-en-ciel et plateau tibétain', desc: 'Les plus beaux voyages en train en Chine, des pics karstiques de Guilin et de la Montagne Jaune aux montagnes arc-en-ciel de Zhangye, au lac Qinghai et à la côte de Hainan, avec durées réelles sur Klook.', badge: 'Chine', lead: 'Les lignes à grande vitesse chinoises traversent des paysages extraordinaires : pics calcaires, rizières en terrasses, déserts, plateaux enneigés et côtes tropicales. Voici les plus beaux trajets en train, chacun avec la durée du train le plus rapide et le nombre de trains trouvés sur Klook.', h: ['Pics karstiques et montagnes sacrées', 'Le Grand Ouest : montagnes arc-en-ciel et plateau', 'À travers les montagnes', 'Côtes et îles', 'Profiter du paysage'], tips: ['En deuxième classe, les sièges A et F sont côté fenêtre (A, B et C d’un côté, D et F de l’autre).', 'Beaucoup de lignes de montagne passent par de longs tunnels : le paysage apparaît par moments, gardez l’appareil à portée de main.', 'Réservez tôt les trajets panoramiques au printemps et en automne, ainsi qu’au Nouvel An chinois et pendant la Semaine d’or d’octobre.', 'Certains sites, comme Zhangye et Huangshan, sont à un trajet en bus ou en taxi de la gare : prévoyez cette étape avant de partir.'] },
      it: { title: 'I viaggi in treno più belli della Cina: vette carsiche, montagne arcobaleno e l’altopiano tibetano', desc: 'I viaggi in treno più belli della Cina, dalle vette carsiche di Guilin e dalla Montagna Gialla alle montagne arcobaleno di Zhangye, al lago Qinghai e alla costa di Hainan, con tempi reali su Klook.', badge: 'Cina', lead: 'Le linee ad alta velocità cinesi attraversano paesaggi straordinari: vette calcaree, risaie a terrazza, deserti, altopiani innevati e coste tropicali. Ecco i viaggi in treno più belli, ciascuno con il tempo del treno più veloce e il numero di treni trovati su Klook.', h: ['Vette carsiche e montagne sacre', 'Il lontano ovest: montagne arcobaleno e altopiano', 'Tra le montagne', 'Coste e isole', 'Come godersi il paesaggio'], tips: ['In seconda classe, i posti A e F sono al finestrino (A, B e C da un lato, D e F dall’altro).', 'Molte linee di montagna passano in lunghe gallerie, quindi il paesaggio arriva a tratti: tieni la macchina fotografica pronta.', 'Prenota presto le tratte panoramiche in primavera e autunno, e intorno al Capodanno cinese e alla Settimana d’oro di ottobre.', 'Alcuni luoghi, come Zhangye e Huangshan, sono a un tragitto in autobus o taxi dalla stazione: pianifica quel tratto prima di partire.'] },
      ja: { title: '中国の絶景鉄道旅：カルストの峰、虹色の山、チベット高原へ', desc: '桂林のカルストや黄山から、張掖の虹色の山、青海湖、海南島の海岸まで。中国でいちばん景色のよい鉄道旅を、Klookの実際の所要時間とともに紹介します。', badge: '中国', lead: '中国の高速鉄道は、石灰岩の峰、棚田、砂漠、雪の高原、南国の海岸といった驚くような風景の中を走ります。景色のよい鉄道旅を、最速列車の所要時間とKlookで見つかった本数とともに紹介します。', h: ['カルストの峰と名山', '西の果て：虹色の山と高原', '山を越える路線', '海岸と島', '車窓を楽しむコツ'], tips: ['二等座ではA席とF席が窓側です（片側がA・B・C、反対側がD・F）。', '山岳路線は長いトンネルが多く、景色は途切れ途切れ。カメラはすぐ出せるようにしておきましょう。', '景色のよい路線は春と秋、そして春節や10月の国慶節の連休は早めに予約を。', '張掖や黄山などは駅からバスかタクシーでの移動が必要です。出発前に計画しておきましょう。'] },
      zh: { title: '中国最美的火车之旅：喀斯特山峰、七彩丹霞和青藏高原', desc: '从桂林山水、黄山到张掖七彩丹霞、青海湖和海南海岸，盘点中国最美的火车旅程，附 Klook 上的真实时长。', badge: '中国', lead: '中国的高铁穿行在非凡的风景之中：石灰岩山峰、梯田、沙漠、雪域高原和热带海岸。下面是最美的火车之旅，每条都附有最快车次的时长和我们在 Klook 上查到的车次数量。', h: ['喀斯特山峰与名山', '大西北：七彩丹霞与高原', '穿越群山', '海岸与海岛', '怎样欣赏沿途风景'], tips: ['二等座的 A 座和 F 座靠窗（一侧是 A、B、C，另一侧是 D、F）。', '很多山区线路隧道很长，风景时有时无，相机要随时准备好。', '风景线路在春秋两季以及春节和十一黄金周期间要尽早预订。', '张掖、黄山等地从车站还要坐大巴或打车，出发前先规划好。'] }
    }
  }
];

const url = (f, l) => `https://glosx.app/${l === 'en' ? '' : l + '/'}${f}`;
const rel = (f, l) => `/${l === 'en' ? '' : l + '/'}${f}`;

function body(P, l) {
  const t = P.T[l], c = COMMON[l], sfx = l === 'en' ? '' : l + '/';
  const sep = l === 'ja' || l === 'zh' ? '→' : ' → ';
  const name = s => `${CITY[R[s].a][l]}${sep}${CITY[R[s].b][l]}`;
  const item = s => { const x = R[s]; return `      <li><a href="/rutas/${s}/${sfx}"><strong>${esc(name(s))}</strong></a> · ${esc(STAT[l](dur(x.d.fastest_min, l), x.d.trains))}. ${esc(HIGHLIGHT[s][l])}</li>`; };
  const bk = R[P.book], ctaTxt = c.cta(CITY[bk.a][l], CITY[bk.b][l]);
  const cta = (src, top) => `    <a href="${API}?from=${bk.a}&to=${bk.b}" class="klook-cta"${top ? ' data-cta-extra="top"' : ''} target="_blank" rel="noopener sponsored" onclick="gtag('event','klook_click',{source:'${src}',route:'${P.book}'});">
      <img class="klook-logo" src="https://www.google.com/s2/favicons?sz=64&domain=klook.com" alt="Klook" loading="lazy" style="width:36px;height:36px;border-radius:8px;flex-shrink:0;" width="36" height="36">
      <span class="klook-cta-text">
        <span class="klook-cta-title">${esc(ctaTxt[0])}</span>
        <span class="klook-cta-sub">${esc(ctaTxt[1])}</span>
      </span>
      <span class="klook-cta-arrow">→</span>
    </a>`;
  const key = P.file.replace('blog-', '').replace('.html', '');
  const secs = P.sections.map((list, i) => `    <h2>${esc(t.h[i])}</h2>\n    <ul>\n${list.map(item).join('\n')}\n    </ul>`).join('\n\n');
  return `  <div class="blog-hero" style="background-image:url('${px(P.hero, 1400)}')">
    <div class="hero-content">
      <span class="badge">${esc(t.badge)}</span>
      <h1>${esc(t.title)}</h1>
      <p class="meta">${esc(c.meta)}</p>
    </div>
  </div>

  <main>
    <p class="lead">
      ${esc(t.lead)}
    </p>

    <div class="photo-grid">
${P.photos.map(id => `      <img src="${px(id, 500)}" alt="${esc(t.title)}" loading="lazy" />`).join('\n')}
    </div>

${cta(key + '_' + l + '_top', true)}

${secs}

    <p><em>${esc(c.data)}</em></p>

    <h2>${esc(t.h[t.h.length - 1])}</h2>
    <ul>
${t.tips.map(x => `      <li>${esc(x)}</li>`).join('\n')}
    </ul>

${cta(key + '_' + l, false)}

    <hr/>

    <div class="cta">
      <h3>${esc(c.box[0])}</h3>
      <p>${esc(c.box[1])}</p>
      <a href="/${l === 'en' ? '' : l + '/'}#china" class="cta-btn">${esc(c.box[2])}</a>
    </div>
  </main>

    <section class="related-routes" aria-label="${esc(c.rel)}">
      <h2>${esc(c.rel)}</h2>
      <ul>
${P.related.map(s => `      <li><a href="/rutas/${s}/${sfx}">${esc(name(s))}</a></li>`).join('\n')}
      </ul>
      <p><a href="/${l === 'en' ? '' : l + '/'}rutas/#china">${esc(c.more)}</a></p>
    </section>`;
}

function page(P, l) {
  const t = P.T[l], c = COMMON[l], hero = px(P.hero, 1400);
  let h = fs.readFileSync(path.join(ROOT, l === 'en' || l === 'zh' ? '' : l, 'blog-japan-train-guide.html'), 'utf8');
  h = h.replace(/<html lang="[^"]*">/, `<html lang="${HL[l]}">`);
  h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(t.title)} — WoW Train · glosx.app</title>`);
  const setMeta = (re, v) => { h = h.replace(re, (m, a, b) => a + esc(v) + b); };
  setMeta(/(<meta name="description" content=")[^"]*(")/, t.desc);
  h = h.replace(/\s*<meta name="keywords" content="[^"]*" \/>/, '');
  setMeta(/(<meta property="og:title" content=")[^"]*(")/, t.title);
  setMeta(/(<meta property="og:description" content=")[^"]*(")/, t.desc);
  setMeta(/(<meta name="twitter:title" content=")[^"]*(")/, t.title);
  setMeta(/(<meta name="twitter:description" content=")[^"]*(")/, t.desc);
  h = h.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${hero}$2`).replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${hero}$2`);
  h = h.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url(P.file, l)}$2`).replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url(P.file, l)}$2`);
  h = h.replace(/(\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>)+/, '\n' + LANGS.map(x => `  <link rel="alternate" hreflang="${HL[x]}" href="${url(P.file, x)}" />`).join('\n') + `\n  <link rel="alternate" hreflang="x-default" href="${url(P.file, 'en')}" />`);
  const home = l === 'en' ? 'https://glosx.app/' : `https://glosx.app/${l}/`;
  const ld1 = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: c.home, item: home }, { '@type': 'ListItem', position: 2, name: c.blog, item: l === 'zh' ? 'https://glosx.app/blog.html' : home + 'blog.html' }, { '@type': 'ListItem', position: 3, name: t.title, item: url(P.file, l) }] };
  const ld2 = { '@context': 'https://schema.org', '@type': 'Article', headline: t.title, description: t.desc, image: hero, datePublished: '2026-11-14', dateModified: '2026-11-14', inLanguage: HL[l], author: { '@type': 'Organization', name: 'WoW Train', url: 'https://glosx.app/' }, publisher: { '@type': 'Organization', name: 'WoW Train', logo: { '@type': 'ImageObject', url: 'https://glosx.app/logo.png' } }, mainEntityOfPage: url(P.file, l) };
  h = h.replace(/<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema.org","@type":"BreadcrumbList"[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(ld1)}</script>`);
  h = h.replace(/<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema.org","@type":"Article"[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(ld2)}</script>`);
  const opts = LANGS.map(x => `<a class="lang-option${x === l ? ' active' : ''}" href="${rel(P.file, x)}" hreflang="${HL[x]}" lang="${HL[x]}">${NAMES[x]}</a>`).join('');
  h = h.replace(/<span id="langCode">[^<]*<\/span>/, `<span id="langCode">${CODE[l]}</span>`).replace(/(<div class="lang-dropdown" id="langDropdown">)[\s\S]*?(<\/div><\/div>)/, `$1${opts}$2`);
  const a = h.indexOf('<div class="blog-hero"'), b = h.indexOf('</section>', h.indexOf('class="related-routes"')) + '</section>'.length;
  h = h.slice(0, h.lastIndexOf('\n', a) + 1) + body(P, l) + h.slice(b);
  if (l === 'zh') {
    h = h.replace('href="/" class="nav-logo', 'href="/zh/" class="nav-logo').replace('>← All articles<', '>' + c.back + '<');
    h = h.replace(/<footer>[\s\S]*?<\/footer>/, `<footer>\n  <p><a href="/zh/">WoW Train</a> · <a href="/blog.html">${c.blog}</a> · <a href="/zh/rutas/">${c.foot[0]}</a> · <a href="/about.html">${c.foot[1]}</a></p>\n  <p style="margin-top:10px;">${c.copy}</p>\n</footer>`);
  }
  return h;
}

const urls = [];
for (const P of POSTS) {
  for (const s of [...P.sections.flat(), ...P.related, P.book]) if (!R[s]) throw new Error('Ruta inexistente: ' + s);
  for (const l of LANGS) {
    const out = path.join(ROOT, l === 'en' ? '' : l, P.file);
    fs.writeFileSync(out, page(P, l));
    urls.push(url(P.file, l));
  }
  // tarjeta al principio de cada blog.html (posts nuevos siempre arriba)
  for (const l of ['en', 'es', 'fr', 'it', 'ja']) {
    const p = path.join(ROOT, l === 'en' ? '' : l, 'blog.html');
    let s = fs.readFileSync(p, 'utf8');
    if (s.includes(`href="${rel(P.file, l)}"`)) continue;
    const t = P.T[l];
    const card = `\n    <a href="${rel(P.file, l)}" class="post">
      <img class="post-img" src="${px(P.hero, 640).replace(/&/g, '&amp;')}" alt="${esc(t.title)}" loading="lazy" width="640" height="400" />
      <div class="post-body">
        <span class="post-tag">${esc(t.badge)}</span>
        <div class="post-title">${esc(t.title)}</div>
        <div class="post-desc">${esc(t.desc)}</div>
        <div class="post-meta">${esc(COMMON[l].meta.split(' · ').slice(1).join(' · '))}</div>
      </div>
    </a>\n`;
    s = s.replace(/(<main class="blog-grid">\n)/, `$1${card}`);
    fs.writeFileSync(p, s);
  }
}
const sm = path.join(ROOT, 'sitemap.xml');
let x = fs.readFileSync(sm, 'utf8'), n = 0;
for (const P of POSTS) {
  const alts = LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${HL[l]}" href="${url(P.file, l)}"/>`).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${url(P.file, 'en')}"/>`;
  for (const l of LANGS) {
    if (x.includes(`<loc>${url(P.file, l)}</loc>`)) continue;
    x = x.replace('</urlset>', `  <url>\n    <loc>${url(P.file, l)}</loc>\n${alts}\n    <lastmod>2026-11-14</lastmod>\n  </url>\n</urlset>`);
    n++;
  }
}
fs.writeFileSync(sm, x);
fs.writeFileSync(path.join(__dirname, 'blog-china-extra-urls.txt'), urls.join('\n') + '\n');
console.log(`2 artículos × ${LANGS.length} idiomas · sitemap +${n}`);
