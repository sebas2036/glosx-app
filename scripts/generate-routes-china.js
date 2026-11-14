#!/usr/bin/env node
/**
 * Páginas de ruta de China (/rutas/<slug>/ + es/fr/de/it/pt/ja/zh), mismo molde que las de Japón
 * (cabecera, estilos, nav y pie de scripts/route-template.html). Datos reales de Klook
 * (scripts/china-klook.json, consulta 13-nov-2026 para el 27-nov-2026). Sin precios.
 * Además (idempotente): bloque "China" en los índices /rutas/ de los 5 idiomas y URLs en sitemap.xml.
 * Volver a correrlo después de scripts/generate-rutas-hub.js (ese script reescribe los índices es/fr/it/ja).
 * Uso: node scripts/generate-routes-china.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { DATA, CITY, STATION_JA, STATION_ZH, LIST, KEY, HIGHLIGHT, TIP } = require('./routes-china-data');

const LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'];
const HREFLANG = { en: 'en', es: 'es', fr: 'fr', de: 'de', it: 'it', pt: 'pt', ja: 'ja', zh: 'zh-Hans' };
const SUFFIX = { en: '/', es: '/es/', fr: '/fr/', de: '/de/', it: '/it/', pt: '/pt/', ja: '/ja/', zh: '/zh/' };
const LANG_LABELS = { en: 'EN', es: 'ES', fr: 'FR', de: 'DE', it: 'IT', pt: 'PT', ja: 'JA', zh: '中文' };
const LANG_NAMES = { en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano', pt: 'Português', ja: '日本語', zh: '中文' };
const BC = { en: { home: 'Home', routes: 'Routes' }, es: { home: 'Inicio', routes: 'Rutas' }, fr: { home: 'Accueil', routes: 'Itinéraires' }, it: { home: 'Home', routes: 'Percorsi' }, de: { home: 'Startseite', routes: 'Strecken' }, pt: { home: 'Início', routes: 'Rotas' }, ja: { home: 'ホーム', routes: 'ルート一覧' }, zh: { home: '首页', routes: '线路' } };
const UI = {
  en: { back: 'All routes', badge: 'Route guide · China', meta: 'By WoW Train · Updated November 2026 · 3 min read', btn: 'Book Ticket',
    cta: (a, b) => `Check times and book <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> on Klook`,
    sub: 'Live schedule for your date · fares change daily', facts: 'Key facts', choose: 'Which train to take', tips: 'Tips before you go',
    faq: 'Frequently asked questions', more: 'More train routes in China', ready: 'Ready to go? See the times and fares for your date and book your seat on Klook.', note: 'Opens in a new tab', cmp: 'Compare times and fares:', check: 'Check schedules' },
  es: { back: 'Todas las rutas', badge: 'Guía de ruta · China', meta: 'Por WoW Train · Actualizado noviembre 2026 · 3 min de lectura', btn: 'Reservar',
    cta: (a, b) => `Consulta horarios y reserva <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> en Klook`,
    sub: 'Horario en vivo para tu fecha · las tarifas cambian a diario', facts: 'Datos clave', choose: 'Qué tren elegir', tips: 'Consejos antes de viajar',
    faq: 'Preguntas frecuentes', more: 'Más rutas de tren en China', ready: '¿Listo para viajar? Consulta los horarios y tarifas de tu fecha y reserva tu asiento en Klook.', note: 'Se abre en una pestaña nueva', cmp: 'Compara horarios y tarifas:', check: 'Ver horarios' },
  fr: { back: 'Tous les itinéraires', badge: 'Guide d\'itinéraire · Chine', meta: 'Par WoW Train · Mis à jour en novembre 2026 · 3 min de lecture', btn: 'Réserver',
    cta: (a, b) => `Consultez les horaires et réservez <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> sur Klook`,
    sub: 'Horaires en direct pour votre date · les tarifs changent chaque jour', facts: 'L\'essentiel', choose: 'Quel train choisir', tips: 'Conseils avant de partir',
    faq: 'Questions fréquentes', more: 'Plus d\'itinéraires de train en Chine', ready: 'Prêt à partir ? Consultez les horaires et tarifs de votre date et réservez votre place sur Klook.', note: 'S\'ouvre dans un nouvel onglet', cmp: 'Comparez horaires et tarifs :', check: 'Voir les horaires' },
  it: { back: 'Tutti i percorsi', badge: 'Guida al percorso · Cina', meta: 'Di WoW Train · Aggiornato a novembre 2026 · 3 min di lettura', btn: 'Prenota',
    cta: (a, b) => `Controlla gli orari e prenota <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> su Klook`,
    sub: 'Orari in tempo reale per la tua data · le tariffe cambiano ogni giorno', facts: 'Dati essenziali', choose: 'Quale treno scegliere', tips: 'Consigli prima di partire',
    faq: 'Domande frequenti', more: 'Altri percorsi in treno in Cina', ready: 'Pronto a partire? Guarda gli orari e le tariffe per la tua data e prenota il tuo posto su Klook.', note: 'Si apre in una nuova scheda', cmp: 'Confronta orari e tariffe:', check: 'Vedi gli orari' },
  de: { back: 'Alle Strecken', badge: 'Streckenführer · China', meta: 'Von WoW Train · Aktualisiert im November 2026 · 3 Min. Lesezeit', btn: 'Ticket buchen',
    cta: (a, b) => `Fahrzeiten prüfen und <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> auf Klook buchen`,
    sub: 'Live-Fahrplan für dein Datum · Preise ändern sich täglich', facts: 'Das Wichtigste', choose: 'Welchen Zug nehmen', tips: 'Tipps vor der Reise',
    faq: 'Häufige Fragen', more: 'Weitere Zugstrecken in China', ready: 'Bereit zur Abfahrt? Sieh dir Fahrzeiten und Preise für dein Datum an und buche deinen Platz auf Klook.', note: 'Öffnet sich in einem neuen Tab', cmp: 'Fahrzeiten und Preise vergleichen:', check: 'Fahrpläne ansehen' },
  pt: { back: 'Todas as rotas', badge: 'Guia de rota · China', meta: 'Por WoW Train · Atualizado em novembro de 2026 · 3 min de leitura', btn: 'Reservar',
    cta: (a, b) => `Consulte os horários e reserve <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> na Klook`,
    sub: 'Horário em tempo real para a sua data · os preços mudam todos os dias', facts: 'Dados essenciais', choose: 'Que comboio escolher', tips: 'Conselhos antes de partir',
    faq: 'Perguntas frequentes', more: 'Mais rotas de comboio na China', ready: 'Pronto para partir? Veja os horários e os preços para a sua data e reserve o seu lugar na Klook.', note: 'Abre num novo separador', cmp: 'Compare horários e preços:', check: 'Ver horários' },
  ja: { back: 'ルート一覧', badge: 'ルートガイド · 中国', meta: 'WoW Train · 2026年11月更新 · 読了目安3分', btn: '予約する',
    cta: (a, b) => `<span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> の時刻を確認してKlookで予約`,
    sub: '出発日の最新時刻を表示 · 運賃は日々変動します', facts: '基本情報', choose: 'どの列車を選ぶ？', tips: '出発前のチェックポイント',
    faq: 'よくある質問', more: '中国のほかの鉄道ルート', ready: 'さっそく出発しませんか？ ご希望日の時刻と運賃を確認して、Klookで座席を予約できます。', note: '新しいタブで開きます', cmp: '時刻と運賃を比較：', check: '時刻を確認する' },
  zh: { back: '全部线路', badge: '线路指南 · 中国', meta: 'WoW Train · 2026 年 11 月更新 · 阅读约 3 分钟', btn: '订票',
    cta: (a, b) => `查看 <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> 的时刻并在 Klook 预订`,
    sub: '显示所选日期的实时时刻 · 票价每天变化', facts: '基本信息', choose: '选哪趟车', tips: '出发前须知',
    faq: '常见问题', more: '中国更多火车线路', ready: '准备出发了吗？在 Klook 查看你所选日期的时刻和票价并预订座位。', note: '在新标签页中打开', cmp: '比较时刻和票价：', check: '查看时刻' }
};

// ── duraciones ──
const hm = m => [Math.floor(m / 60), m % 60];
function short(m, l) {
  const [h, r] = hm(m), rr = String(r).padStart(2, '0');
  if (l === 'ja') return h ? `${h}時間${r ? r + '分' : ''}` : `${m}分`;
  if (l === 'zh') return h ? `${h}小时${r ? r + '分' : ''}` : `${m}分钟`;
  if (l === 'de') return h ? (r ? `${h} Std. ${r} Min.` : `${h} Std.`) : `${m} Min.`;
  if (!h) return `${m} min`;
  if (l === 'es' || l === 'fr') return r ? `${h} h ${rr}` : `${h} h`;
  return r ? `${h}h${rr}` : `${h}h`;
}
function long(m, l) {
  const [h, r] = hm(m);
  if (l === 'ja' || l === 'zh') return short(m, l);
  if (l === 'fr') return h ? (r ? `${h} h ${String(r).padStart(2, '0')}` : `${h} h`) : `${m} minutes`;
  const W = { en: ['hour', 'hours', 'minute', 'minutes', ' '], es: ['hora', 'horas', 'minuto', 'minutos', ' y '], it: ['ora', 'ore', 'minuto', 'minuti', ' e '], de: ['Stunde', 'Stunden', 'Minute', 'Minuten', ' und '], pt: ['hora', 'horas', 'minuto', 'minutos', ' e '] }[l];
  const hs = h ? `${h} ${h === 1 ? W[0] : W[1]}` : '', ms = r ? `${r} ${r === 1 ? W[2] : W[3]}` : '';
  return hs && ms ? hs + W[4] + ms : hs || ms;
}
const about = (m, l) => ({ en: 'about', fr: 'environ', it: 'circa', de: 'etwa', pt: 'cerca de', es: m >= 120 || (m >= 60 && m < 120) ? 'unas' : 'unos' }[l]);


// 4 preguntas más por ruta (se muestran con "ver más", data-more="1", como en Japón)
function extraFaqs(l, A, B, st, many) {
  const X = {
    en: [[`Which stations does the train from ${A} to ${B} use?`, `Most trains run ${st}. Big Chinese cities often have several stations, so check the ones on your ticket.`],
      [`How do I book the train from ${A} to ${B} from abroad?`, 'Search the route on Klook, choose your train and seat class, enter the passenger’s passport details and pay with a foreign card. The ticket is linked to that passport.'],
      ['Which seat class should I choose?', 'Second class is the standard choice and is comfortable for most trips. First class has wider seats and more legroom, and on the fastest trains business class has seats that recline almost flat.'],
      [`How far in advance should I book the train from ${A} to ${B}?`, (many ? 'There are many trains on this route, so a few days ahead is usually enough, except around Chinese New Year and the October Golden Week.' : 'There are fewer trains on this route, so book as early as you can, especially around Chinese New Year and the October Golden Week.') + ' Klook can take your booking before sales open and buys the ticket as soon as they do.']],
    es: [[`¿De qué estaciones sale y a cuáles llega el tren de ${A} a ${B}?`, `La mayoría de los trenes van ${st}. Las grandes ciudades chinas suelen tener varias estaciones, así que revisa las de tu billete.`],
      [`¿Cómo reservo el tren de ${A} a ${B} desde el extranjero?`, 'Busca la ruta en Klook, elige el tren y la clase, escribe los datos del pasaporte del viajero y paga con una tarjeta extranjera. El billete queda vinculado a ese pasaporte.'],
      ['¿Qué clase de asiento conviene elegir?', 'La segunda clase es la opción habitual y resulta cómoda para la mayoría de los viajes. La primera clase tiene asientos más anchos y más espacio, y en los trenes más rápidos la clase business tiene asientos que se reclinan casi por completo.'],
      [`¿Con cuánta antelación conviene reservar el tren de ${A} a ${B}?`, (many ? 'En esta ruta hay muchos trenes, así que suele bastar con unos días de antelación, salvo en el Año Nuevo chino y la Semana Dorada de octubre.' : 'En esta ruta hay menos trenes, así que reserva lo antes posible, sobre todo en el Año Nuevo chino y la Semana Dorada de octubre.') + ' Klook puede tomar tu reserva antes de que abra la venta y compra el billete en cuanto se abre.']],
    fr: [[`De quelles gares part et arrive le train de ${A} à ${B} ?`, `La plupart des trains relient ${st}. Les grandes villes chinoises ont souvent plusieurs gares : vérifiez celles de votre billet.`],
      [`Comment réserver le train de ${A} à ${B} depuis l’étranger ?`, 'Cherchez le trajet sur Klook, choisissez le train et la classe, saisissez les données du passeport du voyageur et payez avec une carte étrangère. Le billet est lié à ce passeport.'],
      ['Quelle classe choisir ?', 'La deuxième classe est le choix habituel et reste confortable pour la plupart des trajets. La première classe offre des sièges plus larges et plus d’espace, et dans les trains les plus rapides la classe affaires propose des sièges presque entièrement inclinables.'],
      [`Combien de temps à l’avance réserver le train de ${A} à ${B} ?`, (many ? 'Les trains sont nombreux sur ce trajet : quelques jours à l’avance suffisent en général, sauf autour du Nouvel An chinois et de la Semaine d’or d’octobre.' : 'Les trains sont moins nombreux sur ce trajet : réservez le plus tôt possible, surtout autour du Nouvel An chinois et de la Semaine d’or d’octobre.') + ' Klook peut prendre votre réservation avant l’ouverture des ventes et achète le billet dès qu’elles ouvrent.']],
    it: [[`Da quali stazioni parte e arriva il treno da ${A} a ${B}?`, `La maggior parte dei treni collega ${st}. Le grandi città cinesi hanno spesso più stazioni, quindi controlla quelle sul biglietto.`],
      [`Come prenoto il treno da ${A} a ${B} dall’estero?`, 'Cerca la tratta su Klook, scegli il treno e la classe, inserisci i dati del passaporto del viaggiatore e paga con una carta straniera. Il biglietto resta collegato a quel passaporto.'],
      ['Quale classe conviene scegliere?', 'La seconda classe è la scelta abituale ed è comoda per la maggior parte dei viaggi. La prima classe ha sedili più larghi e più spazio, e sui treni più veloci la business class ha sedili che si reclinano quasi del tutto.'],
      [`Con quanto anticipo conviene prenotare il treno da ${A} a ${B}?`, (many ? 'Su questa tratta i treni sono molti, quindi di solito bastano pochi giorni di anticipo, tranne intorno al Capodanno cinese e alla Settimana d’oro di ottobre.' : 'Su questa tratta i treni sono meno frequenti, quindi prenota il prima possibile, soprattutto intorno al Capodanno cinese e alla Settimana d’oro di ottobre.') + ' Klook può prendere la prenotazione prima dell’apertura delle vendite e acquista il biglietto appena aprono.']],
    de: [[`Welche Bahnhöfe nutzt der Zug von ${A} nach ${B}?`, `Die meisten Züge fahren ${st}. Große chinesische Städte haben oft mehrere Bahnhöfe, also prüfe die auf deinem Ticket.`],
      [`Wie buche ich den Zug von ${A} nach ${B} aus dem Ausland?`, 'Suche die Strecke auf Klook, wähle Zug und Wagenklasse, gib die Passdaten des Fahrgasts ein und bezahle mit einer ausländischen Karte. Das Ticket ist an diesen Reisepass gebunden.'],
      ['Welche Wagenklasse soll ich wählen?', 'Die zweite Klasse ist die übliche Wahl und für die meisten Fahrten bequem. Die erste Klasse hat breitere Sitze und mehr Beinfreiheit, und in den schnellsten Zügen hat die Business Class Sitze, die sich fast flach zurücklehnen lassen.'],
      [`Wie früh sollte ich den Zug von ${A} nach ${B} buchen?`, (many ? 'Auf dieser Strecke fahren viele Züge, daher reichen meist ein paar Tage Vorlauf, außer rund um das chinesische Neujahr und die Goldene Woche im Oktober.' : 'Auf dieser Strecke fahren weniger Züge, also buche so früh wie möglich, besonders rund um das chinesische Neujahr und die Goldene Woche im Oktober.') + ' Klook nimmt deine Buchung schon vor Verkaufsstart an und kauft das Ticket, sobald der Verkauf beginnt.']],
    pt: [[`De que estações parte e a que estações chega o comboio de ${A} para ${B}?`, `A maioria dos comboios circula ${st}. As grandes cidades chinesas têm muitas vezes várias estações, por isso confirme as do seu bilhete.`],
      [`Como reservo o comboio de ${A} para ${B} a partir do estrangeiro?`, 'Procure o trajeto na Klook, escolha o comboio e a classe, introduza os dados do passaporte do passageiro e pague com um cartão estrangeiro. O bilhete fica associado a esse passaporte.'],
      ['Que classe devo escolher?', 'A segunda classe é a escolha habitual e é confortável para a maioria das viagens. A primeira classe tem lugares mais largos e mais espaço para as pernas e, nos comboios mais rápidos, a classe executiva tem lugares que reclinam quase na horizontal.'],
      [`Com quanta antecedência devo reservar o comboio de ${A} para ${B}?`, (many ? 'Há muitos comboios nesta rota, por isso costumam bastar alguns dias de antecedência, exceto à volta do Ano Novo Chinês e da Semana Dourada de outubro.' : 'Há menos comboios nesta rota, por isso reserve o mais cedo possível, sobretudo à volta do Ano Novo Chinês e da Semana Dourada de outubro.') + ' A Klook pode aceitar a sua reserva antes da abertura das vendas e compra o bilhete assim que abrem.']],
    ja: [[`${A}から${B}への列車はどの駅を使う？`, `多くの列車は${st}を結びます。中国の大都市には駅が複数あることが多いので、切符の駅を確認してください。`],
      [`海外から${A}〜${B}の列車を予約するには？`, 'Klookで区間を検索し、列車と座席クラスを選んで、乗客のパスポート情報を入力し、海外のカードで支払います。きっぷはそのパスポートにひも付けられます。'],
      ['どの座席クラスを選べばいい？', '二等座が一般的で、ほとんどの区間で快適に過ごせます。一等座は座席が広くゆったりしており、最速列車の商務座はほぼ水平まで倒せるシートです。'],
      [`${A}〜${B}の列車はどのくらい前に予約すべき？`, (many ? '本数が多い区間なので、春節や10月の国慶節の連休を除けば数日前の予約で十分なことが多いです。' : '本数が少ない区間なので、特に春節や10月の国慶節の連休はできるだけ早めに予約しましょう。') + 'Klookでは発売開始前に予約を受け付け、発売と同時にきっぷを手配してくれます。']],
    zh: [[`从${A}到${B}的火车在哪些车站上下车？`, `多数列车往返于${st}。中国大城市往往有好几个火车站，请看清车票上的车站。`],
      [`在国外怎样预订${A}到${B}的火车票？`, '在 Klook 搜索线路，选好车次和席别，填写乘客的护照信息，用境外银行卡付款。车票会绑定这本护照。'],
      ['选哪种席别比较好？', '二等座是最常见的选择，大多数行程都很舒适。一等座座位更宽、空间更大；最快的车次还有商务座，座椅几乎可以放平。'],
      [`${A}到${B}的火车票要提前多久订？`, (many ? '这条线路车次很多，除春节和十一黄金周外，一般提前几天预订就够了。' : '这条线路车次较少，尤其在春节和十一黄金周期间，请尽早预订。') + 'Klook 可以在开售前接受预订，开售后立即为你购票。']]
  };
  return X[l];
}

// 3 preguntas generales más (equipaje, comida, enchufes y wifi), para llegar a 10 como Japón
const MORE_FAQS = {
  en: [['Can I take a suitcase on the train?', 'Yes. There are luggage racks above the seats and space for larger suitcases at the end of each carriage. Bags go through an X-ray scanner at the station entrance.'],
    ['Is there food on Chinese high-speed trains?', 'Most high-speed trains have a dining car or a trolley selling meals, snacks and drinks, and every train has hot water for tea or instant noodles.'],
    ['Are there power sockets and Wi-Fi on board?', 'Most high-speed trains have power sockets at the seats. Wi-Fi is not available on every train, so a local SIM or an eSIM is the easiest way to stay online.']],
  es: [['¿Puedo llevar maleta en el tren?', 'Sí. Hay portaequipajes sobre los asientos y espacio para maletas grandes al final de cada vagón. El equipaje pasa por un escáner en la entrada de la estación.'],
    ['¿Hay comida en los trenes de alta velocidad de China?', 'La mayoría de los trenes de alta velocidad tienen vagón restaurante o un carrito con comidas, snacks y bebidas, y todos tienen agua caliente para té o fideos instantáneos.'],
    ['¿Hay enchufes y wifi a bordo?', 'La mayoría de los trenes de alta velocidad tienen enchufes en los asientos. El wifi no está en todos los trenes, así que una SIM local o una eSIM es la forma más fácil de tener internet.']],
  fr: [['Peut-on prendre une valise dans le train ?', 'Oui. Il y a des porte-bagages au-dessus des sièges et de la place pour les grandes valises au bout de chaque voiture. Les bagages passent au scanner à l’entrée de la gare.'],
    ['Peut-on manger dans les trains à grande vitesse chinois ?', 'La plupart des trains à grande vitesse ont une voiture-restaurant ou un chariot avec repas, en-cas et boissons, et tous ont de l’eau chaude pour le thé ou les nouilles instantanées.'],
    ['Y a-t-il des prises et le Wi-Fi à bord ?', 'La plupart des trains à grande vitesse ont des prises aux sièges. Le Wi-Fi n’est pas disponible dans tous les trains : une SIM locale ou une eSIM est le moyen le plus simple de rester connecté.']],
  it: [['Posso portare una valigia in treno?', 'Sì. Ci sono portabagagli sopra i sedili e spazio per le valigie grandi in fondo a ogni carrozza. I bagagli passano allo scanner all’ingresso della stazione.'],
    ['C’è da mangiare sui treni ad alta velocità cinesi?', 'La maggior parte dei treni ad alta velocità ha una carrozza ristorante o un carrello con pasti, snack e bevande, e tutti hanno acqua calda per il tè o i noodles istantanei.'],
    ['Ci sono prese di corrente e Wi-Fi a bordo?', 'La maggior parte dei treni ad alta velocità ha prese ai sedili. Il Wi-Fi non c’è su tutti i treni, quindi una SIM locale o una eSIM è il modo più semplice per restare online.']],
  de: [['Kann ich einen Koffer mit in den Zug nehmen?', 'Ja. Über den Sitzen gibt es Gepäckablagen und am Ende jedes Wagens Platz für größere Koffer. Das Gepäck wird am Bahnhofseingang durchleuchtet.'],
    ['Gibt es in Chinas Schnellzügen etwas zu essen?', 'Die meisten Schnellzüge haben einen Speisewagen oder einen Wagen mit Mahlzeiten, Snacks und Getränken, und in jedem Zug gibt es heißes Wasser für Tee oder Instantnudeln.'],
    ['Gibt es Steckdosen und WLAN an Bord?', 'Die meisten Schnellzüge haben Steckdosen an den Sitzen. WLAN gibt es nicht in jedem Zug, daher ist eine lokale SIM-Karte oder eine eSIM der einfachste Weg, online zu bleiben.']],
  pt: [['Posso levar mala no comboio?', 'Sim. Há porta-bagagens por cima dos lugares e espaço para malas grandes no fim de cada carruagem. A bagagem passa por um scanner à entrada da estação.'],
    ['Há comida nos comboios de alta velocidade da China?', 'A maioria dos comboios de alta velocidade tem carruagem-restaurante ou um carrinho com refeições, snacks e bebidas, e todos têm água quente para chá ou massa instantânea.'],
    ['Há tomadas e Wi-Fi a bordo?', 'A maioria dos comboios de alta velocidade tem tomadas nos lugares. O Wi-Fi não está disponível em todos os comboios, por isso um cartão SIM local ou um eSIM é a forma mais simples de ter internet.']],
  ja: [['スーツケースを持って乗れる？', 'はい。座席の上に荷物棚があり、各車両の端には大きなスーツケースを置くスペースがあります。荷物は駅の入口でX線検査を通ります。'],
    ['中国の高速鉄道で食事はできる？', 'ほとんどの高速列車には食堂車や車内販売があり、食事・軽食・飲み物を買えます。どの列車にもお茶やカップ麺用のお湯があります。'],
    ['車内に電源やWi-Fiはある？', 'ほとんどの高速列車は座席に電源があります。Wi-Fiはすべての列車にあるわけではないので、現地SIMやeSIMを用意しておくと便利です。']],
  zh: [['可以带行李箱上车吗？', '可以。座位上方有行李架，每节车厢的一端还有放大件行李的地方。进站时行李要过安检机。'],
    ['中国高铁上有吃的吗？', '大多数高铁有餐车或推车售卖餐食、零食和饮料，每趟车都有开水，可以泡茶或泡面。'],
    ['车上有充电插座和 Wi-Fi 吗？', '大多数高铁座位旁有电源插座。并非每趟车都有 Wi-Fi，用当地 SIM 卡或 eSIM 上网最方便。']]
};
function build([slug, a, b, photo]) {
  const d = DATA[KEY[slug] || slug];
  if (!d) throw new Error('Sin datos de Klook: ' + slug);
  const r = { slug, photo, fromKey: a, toKey: b, from: {}, to: {}, seo: {}, lead: {}, facts: {}, choose: {}, tips: {}, faqs: {} };
  const n = d.trains, m = d.fastest_min, f1 = d.first, f2 = d.last;
  for (const l of LANGS) {
    const A = CITY[a][l], B = CITY[b][l], S = short(m, l), L = long(m, l), ab = about(m, l);
    const SM = l === 'ja' ? STATION_JA : l === 'zh' ? STATION_ZH : null;
    const st = SM ? d.main.split(' → ').map(x => SM[x] || x).join(' → ') : d.main;
    r.from[l] = A; r.to[l] = B;
    const hl = HIGHLIGHT[slug][l], tip = TIP[slug][l];
    const many = n >= 100;
    if (l === 'en') {
      r.seo.en = { title: `${A} to ${B} by Train: ${S} on High-Speed Rail`, description: `${A} to ${B} by high-speed train in about ${S}. ${n} direct trains on the day we checked, first and last departures, stations and how to book.` };
      r.lead.en = `The fastest direct train from ${A} to ${B} takes about ${L}. ${hl}`;
      r.facts.en = [`Fastest journey: about ${S}.`, `Direct trains on the day we checked (27 November 2026): ${n}.`, `First and last departure that day: ${f1} and ${f2}.`, `Main stations: ${st}.`];
      r.choose.en = `On the day we checked, Klook listed ${n} direct trains between ${A} and ${B}. The fastest takes about ${S}; others stop more often and take longer, so compare journey times before you book. ` + (many ? 'With this many trains, you can usually find a seat close to the time you want.' : 'There are fewer trains on this route, so book a few days ahead in busy periods such as Chinese New Year and the October Golden Week.');
      r.tips.en = [tip, 'Train tickets in mainland China are issued in the passenger’s name: you need your passport to book and to board.', 'Allow 30 to 45 minutes before departure for the security check and the ticket and ID check at the station.'];
      r.faqs.en = [[`How long is the train from ${A} to ${B}?`, `The fastest direct train takes about ${L}. Journey times vary from train to train, so check the one you book.`],
        [`How many trains run between ${A} and ${B}?`, `On the day we checked (27 November 2026), Klook listed ${n} direct trains, the first at ${f1} and the last at ${f2}.`],
        ['Do I need my passport to take the train in China?', 'Yes. Tickets are issued in the passenger’s name and are checked against your passport at the station.']];
    } else if (l === 'es') {
      r.seo.es = { title: `Tren de ${A} a ${B}: ${S} en alta velocidad`, description: `De ${A} a ${B} en tren de alta velocidad en ${ab} ${S}. ${n} trenes directos el día consultado, primera y última salida, estaciones y cómo reservar.` };
      r.lead.es = `El tren directo más rápido de ${A} a ${B} tarda ${ab} ${L}. ${hl}`;
      r.facts.es = [`Trayecto más rápido: ${ab} ${S}.`, `Trenes directos el día consultado (27 de noviembre de 2026): ${n}.`, `Primera y última salida ese día: ${f1} y ${f2}.`, `Estaciones principales: ${st}.`];
      r.choose.es = `El día que consultamos, Klook mostraba ${n} trenes directos entre ${A} y ${B}. El más rápido tarda ${ab} ${S}; los demás paran más y tardan más, así que compara los tiempos antes de reservar. ` + (many ? 'Con tantos trenes, normalmente encuentras asiento cerca de la hora que quieres.' : 'En esta ruta hay menos trenes, así que reserva con unos días de antelación en épocas de mucha demanda, como el Año Nuevo chino y la Semana Dorada de octubre.');
      r.tips.es = [tip, 'En China continental los billetes de tren son nominales: necesitas el pasaporte para reservar y para subir al tren.', 'Llega entre 30 y 45 minutos antes de la salida para pasar el control de seguridad y el control de billete y documento en la estación.'];
      r.faqs.es = [[`¿Cuánto dura el tren de ${A} a ${B}?`, `El tren directo más rápido tarda ${ab} ${L}. La duración cambia según el tren, así que revisa la del que reserves.`],
        [`¿Cuántos trenes hay entre ${A} y ${B}?`, `El día que consultamos (27 de noviembre de 2026), Klook mostraba ${n} trenes directos: el primero a las ${f1} y el último a las ${f2}.`],
        ['¿Necesito el pasaporte para viajar en tren en China?', 'Sí. Los billetes son nominales y en la estación se comprueban con tu pasaporte.']];
    } else if (l === 'fr') {
      r.seo.fr = { title: `Train ${A} ${B} : ${S} en grande vitesse`, description: `De ${A} à ${B} en train à grande vitesse en environ ${S}. ${n} trains directs le jour consulté, premier et dernier départ, gares et réservation.` };
      r.lead.fr = `Le train direct le plus rapide de ${A} à ${B} met environ ${L}. ${hl}`;
      r.facts.fr = [`Trajet le plus rapide : environ ${S}.`, `Trains directs le jour consulté (27 novembre 2026) : ${n}.`, `Premier et dernier départ ce jour-là : ${f1} et ${f2}.`, `Gares principales : ${st}.`];
      r.choose.fr = `Le jour de notre recherche, Klook affichait ${n} trains directs entre ${A} et ${B}. Le plus rapide met environ ${S} ; les autres s’arrêtent plus souvent et sont plus longs, alors comparez les durées avant de réserver. ` + (many ? 'Avec autant de trains, on trouve en général une place proche de l’heure souhaitée.' : 'Les trains sont moins nombreux sur cet itinéraire : réservez quelques jours à l’avance en période chargée, comme le Nouvel An chinois et la Semaine d’or d’octobre.');
      r.tips.fr = [tip, 'En Chine continentale, les billets de train sont nominatifs : il faut votre passeport pour réserver et pour monter à bord.', 'Prévoyez 30 à 45 minutes avant le départ pour le contrôle de sécurité et le contrôle du billet et de l’identité en gare.'];
      r.faqs.fr = [[`Combien de temps dure le train de ${A} à ${B} ?`, `Le train direct le plus rapide met environ ${L}. La durée varie selon le train : vérifiez celle du train que vous réservez.`],
        [`Combien de trains circulent entre ${A} et ${B} ?`, `Le jour de notre recherche (27 novembre 2026), Klook affichait ${n} trains directs, le premier à ${f1} et le dernier à ${f2}.`],
        ['Faut-il un passeport pour prendre le train en Chine ?', 'Oui. Les billets sont nominatifs et sont contrôlés avec votre passeport en gare.']];
    } else if (l === 'it') {
      r.seo.it = { title: `Treno ${A} ${B}: ${S} in alta velocità`, description: `Da ${A} a ${B} in treno ad alta velocità in circa ${S}. ${n} treni diretti nel giorno consultato, prima e ultima partenza, stazioni e prenotazione.` };
      r.lead.it = `Il treno diretto più veloce da ${A} a ${B} impiega circa ${L}. ${hl}`;
      r.facts.it = [`Viaggio più veloce: circa ${S}.`, `Treni diretti nel giorno consultato (27 novembre 2026): ${n}.`, `Prima e ultima partenza quel giorno: ${f1} e ${f2}.`, `Stazioni principali: ${st}.`];
      r.choose.it = `Nel giorno che abbiamo consultato, Klook mostrava ${n} treni diretti tra ${A} e ${B}. Il più veloce impiega circa ${S}; gli altri fermano più spesso e impiegano di più, quindi confronta i tempi prima di prenotare. ` + (many ? 'Con così tanti treni, di solito trovi posto vicino all’orario che preferisci.' : 'Su questa tratta i treni sono meno frequenti: prenota qualche giorno prima nei periodi di punta, come il Capodanno cinese e la Settimana d’oro di ottobre.');
      r.tips.it = [tip, 'Nella Cina continentale i biglietti del treno sono nominativi: serve il passaporto per prenotare e per salire a bordo.', 'Arriva 30-45 minuti prima della partenza per il controllo di sicurezza e il controllo di biglietto e documento in stazione.'];
      r.faqs.it = [[`Quanto dura il treno da ${A} a ${B}?`, `Il treno diretto più veloce impiega circa ${L}. La durata cambia da treno a treno, quindi controlla quella del treno che prenoti.`],
        [`Quanti treni ci sono tra ${A} e ${B}?`, `Nel giorno che abbiamo consultato (27 novembre 2026), Klook mostrava ${n} treni diretti, il primo alle ${f1} e l’ultimo alle ${f2}.`],
        ['Serve il passaporto per prendere il treno in Cina?', 'Sì. I biglietti sono nominativi e in stazione vengono controllati con il passaporto.']];
    } else if (l === 'de') {
      r.seo.de = { title: `Zug von ${A} nach ${B}: ${S} mit dem Schnellzug`, description: `Mit dem Schnellzug von ${A} nach ${B} in etwa ${S}. ${n} Direktzüge am geprüften Tag, erste und letzte Abfahrt, Bahnhöfe und Buchung.` };
      r.lead.de = `Der schnellste Direktzug von ${A} nach ${B} braucht etwa ${L}. ${hl}`;
      r.facts.de = [`Schnellste Fahrt: etwa ${S}.`, `Direktzüge am geprüften Tag (27. November 2026): ${n}.`, `Erste und letzte Abfahrt an diesem Tag: ${f1} und ${f2}.`, `Wichtigste Bahnhöfe: ${st}.`];
      r.choose.de = `An dem Tag, den wir geprüft haben, zeigte Klook ${n} Direktzüge zwischen ${A} und ${B}. Der schnellste braucht etwa ${S}; andere halten öfter und brauchen länger, also vergleiche die Fahrzeiten vor der Buchung. ` + (many ? 'Bei so vielen Zügen findest du meist einen Platz nahe deiner Wunschzeit.' : 'Auf dieser Strecke fahren weniger Züge, also buche in Stoßzeiten wie dem chinesischen Neujahr und der Goldenen Woche im Oktober ein paar Tage im Voraus.');
      r.tips.de = [tip, 'Zugtickets in Festlandchina sind personalisiert: Du brauchst deinen Reisepass zum Buchen und zum Einsteigen.', 'Plane 30 bis 45 Minuten vor der Abfahrt für die Sicherheitskontrolle und die Ticket- und Ausweiskontrolle im Bahnhof ein.'];
      r.faqs.de = [[`Wie lange dauert die Zugfahrt von ${A} nach ${B}?`, `Der schnellste Direktzug braucht etwa ${L}. Die Fahrzeit ist je nach Zug unterschiedlich, also prüfe die deines Zuges.`],
        [`Wie viele Züge fahren zwischen ${A} und ${B}?`, `An dem Tag, den wir geprüft haben (27. November 2026), zeigte Klook ${n} Direktzüge, den ersten um ${f1} und den letzten um ${f2}.`],
        ['Brauche ich in China einen Reisepass für die Zugfahrt?', 'Ja. Die Tickets sind auf den Namen des Fahrgasts ausgestellt und werden im Bahnhof mit deinem Reisepass abgeglichen.']];
    } else if (l === 'pt') {
      r.seo.pt = { title: `Comboio de ${A} para ${B}: ${S} em alta velocidade`, description: `De ${A} para ${B} em comboio de alta velocidade em cerca de ${S}. ${n} comboios diretos no dia consultado, primeira e última partida, estações e reserva.` };
      r.lead.pt = `O comboio direto mais rápido de ${A} para ${B} demora cerca de ${L}. ${hl}`;
      r.facts.pt = [`Viagem mais rápida: cerca de ${S}.`, `Comboios diretos no dia consultado (27 de novembro de 2026): ${n}.`, `Primeira e última partida nesse dia: ${f1} e ${f2}.`, `Estações principais: ${st}.`];
      r.choose.pt = `No dia que consultámos, a Klook mostrava ${n} comboios diretos entre ${A} e ${B}. O mais rápido demora cerca de ${S}; os outros param mais vezes e demoram mais, por isso compare os tempos de viagem antes de reservar. ` + (many ? 'Com tantos comboios, normalmente encontra lugar perto da hora que pretende.' : 'Há menos comboios nesta rota, por isso reserve com alguns dias de antecedência em épocas de muita procura, como o Ano Novo Chinês e a Semana Dourada de outubro.');
      r.tips.pt = [tip, 'Na China continental, os bilhetes de comboio são nominativos: precisa do passaporte para reservar e para embarcar.', 'Chegue 30 a 45 minutos antes da partida para o controlo de segurança e a verificação do bilhete e do documento na estação.'];
      r.faqs.pt = [[`Quanto tempo demora o comboio de ${A} para ${B}?`, `O comboio direto mais rápido demora cerca de ${L}. A duração varia de comboio para comboio, por isso confirme a do comboio que reservar.`],
        [`Quantos comboios há entre ${A} e ${B}?`, `No dia que consultámos (27 de novembro de 2026), a Klook mostrava ${n} comboios diretos, o primeiro às ${f1} e o último às ${f2}.`],
        ['Preciso do passaporte para andar de comboio na China?', 'Sim. Os bilhetes são nominativos e são verificados com o seu passaporte na estação.']];
    } else if (l === 'zh') {
      r.seo.zh = { title: `${A}到${B}火车：最快${S}，每天${n}班`, description: `乘高铁从${A}到${B}，最快约${S}。查询当天有${n}班直达列车，附首末班时间、车站和 Klook 订票方法。` };
      r.lead.zh = `从${A}到${B}的直达列车最快约${L}。${hl}`;
      r.facts.zh = [`最快行程：约${S}`, `查询当天（2026 年 11 月 27 日）的直达列车：${n} 班`, `当天首班和末班：${f1} 和 ${f2}`, `主要车站：${st}`];
      r.choose.zh = `我们查询的那天，Klook 上显示${A}和${B}之间有 ${n} 班直达列车。最快约${S}；其他车次停站更多、用时更长，订票前请比较一下时长。` + (many ? '车次很多，一般都能找到接近你想要时间的座位。' : '这条线路车次不多，春节和十一黄金周等高峰期请提前几天预订。');
      r.tips.zh = [tip, '中国内地火车票实行实名制：购票和乘车都需要护照。', '车站有安检和验票、验证件，请在发车前 30 到 45 分钟到达。'];
      r.faqs.zh = [[`从${A}到${B}坐火车要多久？`, `直达列车最快约${L}。不同车次用时不同，请查看你所订车次的时长。`],
        [`${A}和${B}之间每天有多少班火车？`, `我们查询的那天（2026 年 11 月 27 日），Klook 上显示有 ${n} 班直达列车，首班 ${f1}，末班 ${f2}。`],
        ['在中国坐火车需要护照吗？', '需要。车票实行实名制，在车站会核对你的护照。']];
    } else {
      r.seo.ja = { title: `${A}から${B}への列車｜最速${S}・1日${n}本`, description: `${A}から${B}まで高速鉄道で最速約${S}。調査日の直通列車${n}本、始発と最終の時刻、発着駅、Klookでの予約方法をまとめました。` };
      r.lead.ja = `${A}から${B}までの直通列車は、最速で約${L}です。${hl}`;
      r.facts.ja = [`最速の所要時間：約${S}`, `調査日（2026年11月27日）の直通列車：${n}本`, `その日の始発と最終：${f1}・${f2}`, `主な発着駅：${st}`];
      r.choose.ja = `調査日には、Klookで${A}〜${B}間の直通列車が${n}本表示されていました。最速は約${S}で、ほかの列車は停車駅が多く時間がかかるため、予約前に所要時間を比べましょう。` + (many ? '本数が多いので、希望の時間に近い列車を見つけやすい区間です。' : '本数は多くないので、春節や10月の国慶節の連休など混雑期は数日前までに予約しておくと安心です。');
      r.tips.ja = [tip, '中国本土の列車のきっぷは実名制です。予約にも乗車にもパスポートが必要です。', '駅では保安検査ときっぷ・身分証の確認があるため、出発の30〜45分前には着いておきましょう。'];
      r.faqs.ja = [[`${A}から${B}まで列車で何時間？`, `直通列車の最速は約${L}です。列車によって所要時間が異なるので、予約する列車の時間を確認してください。`],
        [`${A}〜${B}間の列車は1日何本？`, `調査日（2026年11月27日）には、Klookで直通列車が${n}本表示され、始発は${f1}、最終は${f2}でした。`],
        ['中国で列車に乗るのにパスポートは必要？', 'はい。きっぷは実名制で、駅でパスポートと照合されます。']];
    }
  }
  for (const l of LANGS) {
    const SM = l === 'ja' ? STATION_JA : l === 'zh' ? STATION_ZH : null;
    const [o, t] = d.main.split(' → ').map(x => (SM && SM[x]) || x);
    const st = { en: `from ${o} to ${t}`, es: `de ${o} a ${t}`, fr: `${o} et ${t}`, it: `${o} e ${t}`, de: `von ${o} nach ${t}`, pt: `entre ${o} e ${t}`, ja: `${o}と${t}`, zh: `${o}和${t}之间` }[l];
    r.faqs[l].push(...extraFaqs(l, CITY[a][l], CITY[b][l], st, n >= 100));
    r.faqs[l].push(...MORE_FAQS[l]);
  }
  return r;
}
const ROUTES = LIST.map(build);

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (slug, lang) => `https://glosx.app/rutas/${slug}${SUFFIX[lang]}`;
const bookUrl = r => `https://voxa-production-dc15.up.railway.app/affiliate/klook-china-train?from=${r.fromKey}&to=${r.toKey}`;

function langSwitch(slug, current) {
  const opts = LANGS.map(l => `<a class="lang-option${l === current ? ' active' : ''}" href="/rutas/${slug}${SUFFIX[l]}">${LANG_NAMES[l]}</a>`).join('');
  return `<div class="lang-wrapper"><button type="button" class="lang-btn" aria-label="Language" onclick="event.stopPropagation();this.nextElementSibling.classList.toggle('open');"><span>${LANG_LABELS[current]}</span><span style="font-size:10px;opacity:0.6">▾</span></button><div class="lang-dropdown">${opts}</div></div>`;
}
function schema(r, lang) {
  const seo = r.seo[lang];
  const graph = [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: BC[lang].home, item: lang === 'en' ? 'https://glosx.app/' : `https://glosx.app/${lang}/` },
      { '@type': 'ListItem', position: 2, name: BC[lang].routes, item: lang === 'en' ? 'https://glosx.app/rutas/' : `https://glosx.app/${lang}/rutas/` },
      { '@type': 'ListItem', position: 3, name: `${r.from[lang]} → ${r.to[lang]}`, item: url(r.slug, lang) }] },
    { '@type': 'FAQPage', mainEntity: r.faqs[lang].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@type': 'Article', headline: seo.title, description: seo.description, image: `https://images.pexels.com/photos/${r.photo}/pexels-photo-${r.photo}.jpeg?auto=compress&cs=tinysrgb&w=1200`,
      datePublished: '2026-11-14', dateModified: '2026-11-14',
      author: { '@type': 'Organization', name: 'WoW Train', url: 'https://glosx.app/' },
      publisher: { '@type': 'Organization', name: 'WoW Train', logo: { '@type': 'ImageObject', url: 'https://glosx.app/logo.png' } },
      mainEntityOfPage: url(r.slug, lang), inLanguage: lang }
  ];
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

// ── tarjeta "Dónde alojarte" (mismo molde que las rutas de Japón): hoteles en la ciudad de destino,
// Klook (city_id verificados en el backend) + comparar en Booking ──
const HOTEL = {
  en: { h: 'Where to stay', t: c => `Hotels in ${c}`, c: 'China', btn: 'See current price →', bk: 'Compare on Booking.com →' },
  es: { h: 'Dónde alojarte', t: c => `Hoteles en ${c}`, c: 'China', btn: 'Ver precio actual →', bk: 'Comparar en Booking.com →' },
  fr: { h: 'Où dormir', t: c => `Hôtels à ${c}`, c: 'Chine', btn: 'Voir le prix actuel →', bk: 'Comparer sur Booking.com →' },
  it: { h: 'Dove dormire', t: c => `Hotel a ${c}`, c: 'Cina', btn: 'Vedi il prezzo attuale →', bk: 'Confronta su Booking.com →' },
  de: { h: 'Wo übernachten', t: c => `Hotels in ${c}`, c: 'China', btn: 'Aktuellen Preis ansehen →', bk: 'Auf Booking.com vergleichen →' },
  pt: { h: 'Onde ficar', t: c => `Hotéis em ${c}`, c: 'China', btn: 'Ver preço atual →', bk: 'Comparar no Booking.com →' },
  ja: { h: 'おすすめの宿泊先', t: c => `${c}のホテル`, c: '中国', btn: '現在の料金を見る →', bk: 'Booking.comで比較 →' },
  zh: { h: '住宿推荐', t: c => `${c}酒店`, c: '中国', btn: '查看当前价格 →', bk: '在 Booking.com 比较 →' }
};
const API = 'https://voxa-production-dc15.up.railway.app/affiliate';
function hotelHtml(r, lang) {
  const H = HOTEL[lang], city = r.to[lang], en = encodeURIComponent(CITY[r.toKey].en.replace("'", '’'));
  const sep = lang === 'ja' || lang === 'zh' ? '・' : ', ';
  return `
    <h2>${H.h}</h2>
    <div class="hotel-card">
      <div class="hotel-card-header">
        <img class="hotel-card-image" src="https://images.pexels.com/photos/${r.photo}/pexels-photo-${r.photo}.jpeg?auto=compress&cs=tinysrgb&w=330" alt="${esc(H.t(city))}" loading="lazy">
        <div class="hotel-card-info">
          <div class="hotel-card-name">${esc(H.t(city))}</div>
          <div class="hotel-card-location">${esc(city)}${sep}${H.c}</div>
        </div>
      </div>
      <div class="hotel-card-actions">
        <a href="${API}/klook-hotel?city=${en}" class="cta-btn" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('hotel_${r.slug}_${lang}')">${H.btn}</a>
        <br>
        <a href="${API}/booking-hotel?city=${en}" class="economic-link" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('hotel_booking_${r.slug}_${lang}')">${H.bk}</a>
      </div>
    </div>
`;
}
function mainHtml(r, lang) {
  const u = UI[lang], from = r.from[lang], to = r.to[lang];
  const shares = x => [x.fromKey, x.toKey].some(k => k === r.fromKey || k === r.toKey);
  const others = ROUTES.filter(x => x.slug !== r.slug);
  const related = others.filter(shares).concat(others.filter(x => !shares(x))).slice(0, 6)
    .map(x => `<a href="/rutas/${x.slug}${SUFFIX[lang]}" class="related-link">${esc(x.from[lang])} &rarr; ${esc(x.to[lang])}</a>`).join('\n        ');
  const li = a => a.map(t => `<li>${esc(t)}</li>`).join('\n      ');
  const faq = r.faqs[lang].map(([q, a], i) => `
      <div class="faq-item"${i >= 3 ? ' data-more="1"' : ''}>
        <h3 class="faq-q">${esc(q)}</h3>
        <p class="faq-a">${esc(a)}</p>
      </div>`).join('');
  return `<main>
    <p class="lead">${esc(r.lead[lang])}</p>

    <a href="${bookUrl(r)}" class="klook-cta" target="_blank" rel="noopener sponsored"
       onclick="gtag('event','klook_click',{source:'cta_block',route:'${r.slug}'});">
      <img class="klook-cta-logo" src="https://www.google.com/s2/favicons?sz=64&domain=klook.com" alt="Klook" loading="lazy">
      <div class="klook-cta-text">
        <span class="klook-cta-title">${u.cta(esc(from), esc(to))}</span>
        <span class="klook-cta-sub">${u.sub}</span>
      </div>
      <span class="klook-cta-btn">${u.btn} &#8599;</span>
    </a>

    <h2>${u.facts}</h2>
    <ul>
      ${li(r.facts[lang])}
    </ul>

    <h2>${u.choose}</h2>
    <p>${esc(r.choose[lang])}</p>

    <h2>${u.tips}</h2>
    <ul>
      ${li(r.tips[lang])}
    </ul>

${hotelHtml(r, lang)}
    <section class="faq">
      <h2>${u.faq}</h2>${faq}
    </section>

    <hr/>
    <p>${u.ready}</p>
    <p class="tl-secondary" style="text-align:center;margin:10px 0 8px;font-size:14px;color:#55565f;">
      ${u.cmp} <a href="${bookUrl(r)}" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('route_${r.slug}_${lang}')">${u.check}</a>
    </p>
    <p class="tl-note" style="text-align:center;margin:0 0 8px;font-size:12px;color:#6b6b85;">${u.note}</p>

    <div class="related-routes">
      <h2>${u.more}</h2>
      <div class="related-grid">
        ${related}
      </div>
    </div>
  </main>`;
}

const template = fs.readFileSync(path.join(__dirname, 'route-template.html'), 'utf8');
const head = template.slice(0, template.indexOf('<main>'));
const tail = template.slice(template.indexOf('</main>') + '</main>'.length);
function render(r, lang) {
  const seo = r.seo[lang], u = UI[lang];
  const map = {
    '{{lang}}': lang, '{{routeSlug}}': r.slug, '{{canonical}}': url(r.slug, lang),
    '{{title}}': esc(seo.title), '{{description}}': esc(seo.description),
    '{{ogTitle}}': esc(seo.title), '{{ogDescription}}': esc(seo.description),
    '{{twitterTitle}}': esc(seo.title), '{{twitterDescription}}': esc(seo.description),
    '{{videoCss}}': '', '{{schema}}': schema(r, lang), '{{langSwitch}}': langSwitch(r.slug, lang), '{{backText}}': u.back,
    '{{homeHref}}': lang === 'en' ? '/' : `/${lang}/`, '{{routesHref}}': lang === 'en' ? '/rutas/' : `/${lang}/rutas/`,
    '{{footerLinks}}': lang === 'ja'
      ? '<a href="/blog.html">ブログ</a> · <a href="/ja/about.html">このサイトについて</a> · <a href="/privacy.html">プライバシー</a> · <a href="/terms.html">利用規約</a>'
      : '<a href="/blog.html">Blog</a> · <a href="/about.html">About</a> · <a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a>',
    '{{badge}}': u.badge, '{{mainTitle}}': esc(`${r.from[lang]} → ${r.to[lang]}`), '{{metaText}}': u.meta
  };
  let html = head + mainHtml(r, lang) + tail;
  html = html.split('{{heroImage}}').join(`https://images.pexels.com/photos/${r.photo}/pexels-photo-${r.photo}.jpeg?auto=compress&cs=tinysrgb&w=1600`);
  for (const [k, v] of Object.entries(map)) html = html.split(k).join(v);
  // hreflang de las 5 versiones (la plantilla no los trae)
  html = html.replace(/  <link rel="alternate" hreflang="ja" href="([^"]+)" \/>\n/, (m, u) => m + ['de', 'pt', 'zh'].map(l => `  <link rel="alternate" hreflang="${HREFLANG[l]}" href="${url(r.slug, l)}" />\n`).join(''));
  if (lang === 'zh') html = html.replace('<html lang="zh"', '<html lang="zh-Hans"');
  return html;
}

ROUTES.forEach(r => {
  LANGS.forEach(lang => {
    const dir = lang === 'en' ? path.join(ROOT, 'rutas', r.slug) : path.join(ROOT, 'rutas', r.slug, lang);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), render(r, lang));
  });
});
console.log('Generadas', ROUTES.length, 'rutas de China ×', LANGS.length, 'idiomas');

// ── Índices /rutas/: bloque China (idempotente, entre marcas) ──
const HUB = {
  en: { file: 'rutas/index.html', h2: `China route guides &middot; ${ROUTES.length} routes` },
  es: { file: 'es/rutas/index.html', h2: `Guías de rutas de China · ${ROUTES.length} rutas` },
  fr: { file: 'fr/rutas/index.html', h2: `Guides d’itinéraires en Chine · ${ROUTES.length} itinéraires` },
  de: { file: 'de/rutas/index.html', h2: `Streckenführer für China · ${ROUTES.length} Strecken` },
  pt: { file: 'pt/rutas/index.html', h2: `Guias de rotas na China · ${ROUTES.length} rotas` },
  it: { file: 'it/rutas/index.html', h2: `Guide ai percorsi in Cina · ${ROUTES.length} percorsi` },
  ja: { file: 'ja/rutas/index.html', h2: `中国のルートガイド・${ROUTES.length}路線` },
  zh: { file: 'zh/rutas/index.html', h2: `中国线路指南 · ${ROUTES.length} 条` }
};
for (const l of LANGS) {
  const p = path.join(ROOT, HUB[l].file);
  if (!fs.existsSync(p)) continue;
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace(/\n?\s*<!-- china-guides:start -->[\s\S]*?<!-- china-guides:end -->/, '');
  const items = ROUTES.map(r => `      <li><a href="/rutas/${r.slug}${SUFFIX[l]}">${esc(r.from[l])} &rarr; ${esc(r.to[l])}</a></li>`).join('\n');
  const block = `\n    <!-- china-guides:start -->\n    <h2 id="china">${HUB[l].h2}</h2>\n    <ul class="routes-index-list">\n${items}\n    </ul>\n    <!-- china-guides:end -->`;
  const i = s.indexOf('class="routes-index"');
  const j = s.indexOf('</section>', i);
  if (i < 0 || j < 0) { console.error('Sin sección routes-index en', HUB[l].file); continue; }
  const k = s.lastIndexOf('\n', j);
  s = s.slice(0, k) + block + s.slice(k);
  fs.writeFileSync(p, s);
}
console.log('Índices /rutas/ actualizados');

// ── sitemap.xml (idempotente) ──
const sm = path.join(ROOT, 'sitemap.xml');
let xml = fs.readFileSync(sm, 'utf8');
const today = new Date().toISOString().slice(0, 10);
let added = 0;
const chinaLocs = new Set(ROUTES.flatMap(r => LANGS.map(l => url(r.slug, l))));
xml = xml.replace(/  <url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>\n/g, (b, loc) => chinaLocs.has(loc) ? '' : b);
for (const r of ROUTES) {
  const alts = LANGS.map(l => `      <xhtml:link rel="alternate" hreflang="${HREFLANG[l]}" href="${url(r.slug, l)}" />`).join('\n') + `\n      <xhtml:link rel="alternate" hreflang="x-default" href="${url(r.slug, 'en')}" />`;
  for (const l of LANGS) {
    if (xml.includes(`<loc>${url(r.slug, l)}</loc>`)) continue;
    xml = xml.replace('</urlset>', `  <url>\n    <loc>${url(r.slug, l)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${l === 'en' ? '0.8' : '0.7'}</priority>\n${alts}\n  </url>\n</urlset>`);
    added++;
  }
}
fs.writeFileSync(sm, xml);
console.log('Sitemap: +' + added + ' URLs');
// lista para avisar a Google / IndexNow
fs.writeFileSync(path.join(__dirname, 'china-urls.txt'), ROUTES.flatMap(r => LANGS.map(l => url(r.slug, l))).join('\n') + '\n');
