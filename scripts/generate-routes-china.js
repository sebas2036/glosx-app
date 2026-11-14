#!/usr/bin/env node
/**
 * Páginas de ruta de China (/rutas/<slug>/ + es/fr/it/ja), mismo molde que las de Japón
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

const LANGS = ['en', 'es', 'fr', 'it', 'ja', 'zh'];
const HREFLANG = { en: 'en', es: 'es', fr: 'fr', it: 'it', ja: 'ja', zh: 'zh-Hans' };
const SUFFIX = { en: '/', es: '/es/', fr: '/fr/', it: '/it/', ja: '/ja/', zh: '/zh/' };
const LANG_LABELS = { en: 'EN', es: 'ES', fr: 'FR', it: 'IT', ja: 'JA', zh: '中文' };
const LANG_NAMES = { en: 'English', es: 'Español', fr: 'Français', it: 'Italiano', ja: '日本語', zh: '中文' };
const BC = { en: { home: 'Home', routes: 'Routes' }, es: { home: 'Inicio', routes: 'Rutas' }, fr: { home: 'Accueil', routes: 'Itinéraires' }, it: { home: 'Home', routes: 'Percorsi' }, ja: { home: 'ホーム', routes: 'ルート一覧' }, zh: { home: '首页', routes: '线路' } };
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
  if (!h) return `${m} min`;
  if (l === 'es' || l === 'fr') return r ? `${h} h ${rr}` : `${h} h`;
  return r ? `${h}h${rr}` : `${h}h`;
}
function long(m, l) {
  const [h, r] = hm(m);
  if (l === 'ja' || l === 'zh') return short(m, l);
  if (l === 'fr') return h ? (r ? `${h} h ${String(r).padStart(2, '0')}` : `${h} h`) : `${m} minutes`;
  const W = { en: ['hour', 'hours', 'minute', 'minutes', ' '], es: ['hora', 'horas', 'minuto', 'minutos', ' y '], it: ['ora', 'ore', 'minuto', 'minuti', ' e '] }[l];
  const hs = h ? `${h} ${h === 1 ? W[0] : W[1]}` : '', ms = r ? `${r} ${r === 1 ? W[2] : W[3]}` : '';
  return hs && ms ? hs + W[4] + ms : hs || ms;
}
const about = (m, l) => ({ en: 'about', fr: 'environ', it: 'circa', es: m >= 120 || (m >= 60 && m < 120) ? 'unas' : 'unos' }[l]);

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
      { '@type': 'ListItem', position: 1, name: BC[lang].home, item: lang === 'ja' || lang === 'zh' ? `https://glosx.app/${lang}/` : 'https://glosx.app/' },
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
function mainHtml(r, lang) {
  const u = UI[lang], from = r.from[lang], to = r.to[lang];
  const shares = x => [x.fromKey, x.toKey].some(k => k === r.fromKey || k === r.toKey);
  const others = ROUTES.filter(x => x.slug !== r.slug);
  const related = others.filter(shares).concat(others.filter(x => !shares(x))).slice(0, 6)
    .map(x => `<a href="/rutas/${x.slug}${SUFFIX[lang]}" class="related-link">${esc(x.from[lang])} &rarr; ${esc(x.to[lang])}</a>`).join('\n        ');
  const li = a => a.map(t => `<li>${esc(t)}</li>`).join('\n      ');
  const faq = r.faqs[lang].map(([q, a]) => `
      <div class="faq-item">
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
    '{{homeHref}}': lang === 'ja' ? '/ja/' : lang === 'zh' ? '/zh/' : '/', '{{routesHref}}': lang === 'en' ? '/rutas/' : `/${lang}/rutas/`,
    '{{footerLinks}}': lang === 'ja'
      ? '<a href="/blog.html">ブログ</a> · <a href="/ja/about.html">このサイトについて</a> · <a href="/privacy.html">プライバシー</a> · <a href="/terms.html">利用規約</a>'
      : '<a href="/blog.html">Blog</a> · <a href="/about.html">About</a> · <a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a>',
    '{{badge}}': u.badge, '{{mainTitle}}': esc(`${r.from[lang]} → ${r.to[lang]}`), '{{metaText}}': u.meta
  };
  let html = head + mainHtml(r, lang) + tail;
  html = html.split('{{heroImage}}').join(`https://images.pexels.com/photos/${r.photo}/pexels-photo-${r.photo}.jpeg?auto=compress&cs=tinysrgb&w=1600`);
  for (const [k, v] of Object.entries(map)) html = html.split(k).join(v);
  // hreflang de las 5 versiones (la plantilla no los trae)
  html = html.replace(/  <link rel="alternate" hreflang="ja" href="([^"]+)" \/>\n/, (m, u) => m + `  <link rel="alternate" hreflang="zh-Hans" href="${url(r.slug, 'zh')}" />\n`);
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
