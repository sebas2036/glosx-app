#!/usr/bin/env node
/**
 * Añade al FAQ (visible + FAQPage) de las rutas con horarios abiertos verificados tres preguntas con datos reales:
 * primer tren, último tren y cuántos trenes al día. Lee assets/data/horarios-rutas.json (lo genera scripts/horarios-gtfs.py).
 * Solo se publica lo que es completo para el operador citado (Eurostar; larga distancia de Deutsche Bahn dentro de Alemania).
 * Cada respuesta cita la fuente y la licencia, y la fecha de consulta. Idempotente por pregunta.
 * Uso: node scripts/inject-horarios-faq.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
// Archivo completo (incluye lo derivado de SNCF, ODbL) fuera del repo; si no existe, el público del repo.
const FULL = path.join(require('os').homedir(), 'proyectos/glosx-horarios-datos/horarios-rutas-completo.json');
const DATA = JSON.parse(fs.readFileSync(fs.existsSync(FULL) ? FULL : path.join(ROOT, 'assets/data/horarios-rutas.json'), 'utf8'));
const PRIORITY = ['eurostar', 'db', 'renfe_ld', 'sncf', 'sbb'];
const jsrc = fs.readFileSync(path.join(ROOT, 'assets/js/japan.js'), 'utf8');
const NAMES = JSON.parse(jsrc.match(/var HOTEL_NAMES = (\{.*?\});\n  function hname/s)[1]);
const nm = (lang, c) => (NAMES[lang] && NAMES[lang][c]) || c;
const g = fs.readFileSync(path.join(__dirname, 'generate-routes.js'), 'utf8');
const ROUTE = {};
for (const m of g.matchAll(/slug: '([a-z-]+)', from: '([^']+)', to: '([^']+)'/g)) ROUTE[m[1]] = { from: m[2], to: m[3] };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const LANGS = ['en', 'es', 'fr', 'it', 'ja'];

// fuente por feed
const SRC = {
  sbb: { op: { en: 'Swiss long-distance and Regio Express', es: 'larga distancia y Regio Express de Suiza', fr: 'grandes lignes et RegioExpress suisses', it: 'lunga percorrenza e RegioExpress svizzeri', ja: 'スイスの長距離・レギオエクスプレス' },
    train: { en: 'Swiss long-distance or Regio Express train', es: 'tren de larga distancia o Regio Express del horario suizo', fr: 'train grandes lignes ou RegioExpress de l\'horaire suisse', it: 'treno a lunga percorrenza o RegioExpress dell\'orario svizzero', ja: 'スイスの長距離列車またはレギオエクスプレス' },
    of: { fr: 'des grandes lignes et RegioExpress suisses', it: 'della lunga percorrenza e dei RegioExpress svizzeri' },
    credit: { en: 'open timetable from opentransportdata.swiss (SBB)', es: 'horario abierto de opentransportdata.swiss (SBB)', fr: 'horaire ouvert de opentransportdata.swiss (SBB)', it: 'orario aperto di opentransportdata.swiss (SBB)', ja: 'opentransportdata.swiss（SBB）のオープン時刻表' } },
  sncf: { op: { en: 'SNCF Voyageurs (TGV, Intercités and TER)', es: 'SNCF Voyageurs (TGV, Intercités y TER)', fr: 'SNCF Voyageurs (TGV, Intercités et TER)', it: 'SNCF Voyageurs (TGV, Intercités e TER)', ja: 'SNCF Voyageurs（TGV・Intercités・TER）' },
    train: { en: 'SNCF Voyageurs train (TGV, Intercités or TER)', es: 'tren de SNCF Voyageurs (TGV, Intercités o TER)', fr: 'train SNCF Voyageurs (TGV, Intercités ou TER)', it: 'treno SNCF Voyageurs (TGV, Intercités o TER)', ja: 'SNCF Voyageursの列車（TGV・Intercités・TER）' },
    of: { fr: 'de SNCF Voyageurs (TGV, Intercités et TER)', it: 'di SNCF Voyageurs (TGV, Intercités e TER)' },
    credit: { en: 'SNCF Voyageurs open timetable via transport.data.gouv.fr (ODbL 1.0)', es: 'horario abierto de SNCF Voyageurs vía transport.data.gouv.fr (ODbL 1.0)', fr: 'horaire ouvert de SNCF Voyageurs via transport.data.gouv.fr (ODbL 1.0)', it: 'orario aperto di SNCF Voyageurs tramite transport.data.gouv.fr (ODbL 1.0)', ja: 'SNCF Voyageursのオープン時刻表（transport.data.gouv.fr経由、ODbL 1.0）' } },
  renfe_ld: { op: { en: 'Renfe high-speed and long-distance', es: 'alta velocidad y larga distancia de Renfe', fr: 'grande vitesse et grandes lignes de Renfe', it: 'alta velocità e lunga percorrenza di Renfe', ja: 'レンフェの高速・長距離' }, train: { en: 'Renfe high-speed or long-distance train', es: 'tren de alta velocidad o larga distancia de Renfe', fr: 'train à grande vitesse ou grandes lignes de Renfe', it: 'treno ad alta velocità o a lunga percorrenza di Renfe', ja: 'レンフェの高速・長距離列車' },
    of: { fr: 'de Renfe (grande vitesse et grandes lignes)', it: 'di Renfe (alta velocità e lunga percorrenza)' },
    credit: { en: 'Renfe open timetable (CC BY 4.0)', es: 'horario abierto de Renfe (CC BY 4.0)', fr: 'horaire ouvert de Renfe (CC BY 4.0)', it: 'orario aperto di Renfe (CC BY 4.0)', ja: 'Renfeのオープン時刻表（CC BY 4.0）' } },
  eurostar: { of: { fr: "d'Eurostar", it: 'di Eurostar' }, op: { en: 'Eurostar', es: 'Eurostar', fr: 'Eurostar', it: 'Eurostar', ja: 'ユーロスター' }, train: { en: 'Eurostar train', es: 'tren de Eurostar', fr: 'train Eurostar', it: 'treno Eurostar', ja: 'ユーロスターの列車' },
    credit: { en: 'Eurostar International Ltd open timetable (Licence Ouverte 2.0)', es: 'horario abierto de Eurostar International Ltd (Licence Ouverte 2.0)', fr: 'horaire ouvert d\'Eurostar International Ltd (Licence Ouverte 2.0)', it: 'orario aperto di Eurostar International Ltd (Licence Ouverte 2.0)', ja: 'Eurostar International Ltdのオープン時刻表（Licence Ouverte 2.0）' } },
  db: { of: { fr: 'des grandes lignes de la Deutsche Bahn', it: 'della lunga percorrenza di Deutsche Bahn' }, op: { en: 'Deutsche Bahn long-distance', es: 'larga distancia de Deutsche Bahn', fr: 'grandes lignes de la Deutsche Bahn', it: 'lunga percorrenza di Deutsche Bahn', ja: 'ドイツ鉄道の長距離' }, train: { en: 'Deutsche Bahn long-distance train', es: 'tren de larga distancia de Deutsche Bahn', fr: 'train grandes lignes de la Deutsche Bahn', it: 'treno a lunga percorrenza di Deutsche Bahn', ja: 'ドイツ鉄道の長距離列車' },
    credit: { en: 'DELFI e.V. / GTFS.de open timetable data (CC BY 4.0)', es: 'datos abiertos de horarios de DELFI e.V. / GTFS.de (CC BY 4.0)', fr: 'données horaires ouvertes de DELFI e.V. / GTFS.de (CC BY 4.0)', it: 'dati orari aperti di DELFI e.V. / GTFS.de (CC BY 4.0)', ja: 'DELFI e.V. / GTFS.deのオープン時刻表データ（CC BY 4.0）' } }
};
const DATE = { en: '17 October 2026 (week of 20 to 25 October)', es: '17 de octubre de 2026 (semana del 20 al 25 de octubre)', fr: '17 octobre 2026 (semaine du 20 au 25 octobre)', it: '17 ottobre 2026 (settimana dal 20 al 25 ottobre)', ja: '2026年10月17日（10月20日〜25日の週）' };
const NEXT = { en: 'the next day, after midnight', es: 'de la madrugada siguiente', fr: 'après minuit', it: 'dopo mezzanotte', ja: '翌日の深夜' };
const EARLY = { en: 'an early-morning service', es: 'servicio de madrugada', fr: 'service de nuit', it: 'servizio notturno', ja: '早朝の列車' };
const tm = (lang, t) => { // "03:31 (+1)" -> texto localizado; salidas antes de las 04:00 -> nota de madrugada
  if (!t) return '';
  if (t.endsWith(' (+1)')) return `${t.slice(0, 5)} (${NEXT[lang]})`;
  if (t < '04:00') return `${t} (${EARLY[lang]})`;
  return t;
};
const T = {
  en: {
    q1: (a, b) => `What time is the first direct train from ${a} to ${b}?`,
    a1: (o) => `On weekdays, the first direct ${o.train} from ${o.a} to ${o.b} leaves at ${o.wf}; in the other direction, the first from ${o.b} to ${o.a} leaves at ${o.rf}. Source: ${o.credit}, ${o.date}. Timetables change by season, so check your date before you book.`,
    q2: (a, b) => `What time is the last direct train from ${a} to ${b}?`,
    a2: (o) => `On weekdays, the last direct ${o.train} from ${o.a} to ${o.b} leaves at ${o.wl}; from ${o.b} to ${o.a}, at ${o.rl}. Source: ${o.credit}, ${o.date}.`,
    q3: (a, b) => `How many direct trains a day run from ${a} to ${b}?`,
    a3: (o) => `In the ${o.op} timetable there are ${o.wn} direct trains a day from ${o.a} to ${o.b} on weekdays, ${o.sn} on Saturdays and ${o.un} on Sundays. From ${o.b} to ${o.a}: ${o.rwn}, ${o.rsn} and ${o.run}. Source: ${o.credit}, ${o.date}.`
  },
  es: {
    q1: (a, b) => `¿A qué hora sale el primer tren directo de ${a} a ${b}?`,
    a1: (o) => `De lunes a viernes, el primer tren directo ${o.trainRest} de ${o.a} a ${o.b} sale a las ${o.wf}; en sentido contrario, el primero de ${o.b} a ${o.a} sale a las ${o.rf}. Fuente: ${o.credit}, consultado el ${o.date}. Los horarios cambian por temporada, así que confirma tu fecha antes de reservar.`,
    q2: (a, b) => `¿A qué hora sale el último tren directo de ${a} a ${b}?`,
    a2: (o) => `De lunes a viernes, el último tren directo ${o.trainRest} de ${o.a} a ${o.b} sale a las ${o.wl}; de ${o.b} a ${o.a}, a las ${o.rl}. Fuente: ${o.credit}, consultado el ${o.date}.`,
    q3: (a, b) => `¿Cuántos trenes directos al día hay de ${a} a ${b}?`,
    a3: (o) => `En el horario de ${o.op} hay ${o.wn} trenes directos al día de ${o.a} a ${o.b} de lunes a viernes, ${o.sn} los sábados y ${o.un} los domingos. De ${o.b} a ${o.a}: ${o.rwn}, ${o.rsn} y ${o.run}. Fuente: ${o.credit}, consultado el ${o.date}.`
  },
  fr: {
    q1: (a, b) => `À quelle heure part le premier train direct de ${a} à ${b} ?`,
    a1: (o) => `En semaine, le premier train direct ${o.trainRest} de ${o.a} à ${o.b} part à ${o.wf} ; dans l'autre sens, le premier de ${o.b} à ${o.a} part à ${o.rf}. Source : ${o.credit}, consulté le ${o.date}. Les horaires changent selon la saison : vérifiez votre date avant de réserver.`,
    q2: (a, b) => `À quelle heure part le dernier train direct de ${a} à ${b} ?`,
    a2: (o) => `En semaine, le dernier train direct ${o.trainRest} de ${o.a} à ${o.b} part à ${o.wl} ; de ${o.b} à ${o.a}, à ${o.rl}. Source : ${o.credit}, consulté le ${o.date}.`,
    q3: (a, b) => `Combien de trains directs y a-t-il par jour de ${a} à ${b} ?`,
    a3: (o) => `Dans l'horaire ${o.of}, il y a ${o.wn} trains directs par jour de ${o.a} à ${o.b} en semaine, ${o.sn} le samedi et ${o.un} le dimanche. De ${o.b} à ${o.a} : ${o.rwn}, ${o.rsn} et ${o.run}. Source : ${o.credit}, consulté le ${o.date}.`
  },
  it: {
    q1: (a, b) => `A che ora parte il primo treno diretto da ${a} a ${b}?`,
    a1: (o) => `Nei giorni feriali, il primo treno diretto ${o.trainRest} da ${o.a} a ${o.b} parte alle ${o.wf}; nel senso opposto, il primo da ${o.b} a ${o.a} parte alle ${o.rf}. Fonte: ${o.credit}, consultato il ${o.date}. Gli orari cambiano con la stagione, quindi controlla la tua data prima di prenotare.`,
    q2: (a, b) => `A che ora parte l'ultimo treno diretto da ${a} a ${b}?`,
    a2: (o) => `Nei giorni feriali, l'ultimo treno diretto ${o.trainRest} da ${o.a} a ${o.b} parte alle ${o.wl}; da ${o.b} a ${o.a}, alle ${o.rl}. Fonte: ${o.credit}, consultato il ${o.date}.`,
    q3: (a, b) => `Quanti treni diretti al giorno ci sono da ${a} a ${b}?`,
    a3: (o) => `Nell'orario ${o.of} ci sono ${o.wn} treni diretti al giorno da ${o.a} a ${o.b} nei feriali, ${o.sn} il sabato e ${o.un} la domenica. Da ${o.b} a ${o.a}: ${o.rwn}, ${o.rsn} e ${o.run}. Fonte: ${o.credit}, consultato il ${o.date}.`
  },
  ja: {
    q1: (a, b) => `${a}から${b}への直通列車の始発は何時ですか？`,
    a1: (o) => `平日、${o.a}から${o.b}への直通の${o.train}の始発は${o.wf}発で、逆方向の${o.b}から${o.a}への始発は${o.rf}発です。出典：${o.credit}、${o.date}に確認。時刻は季節によって変わるため、予約前にご自分の日付を確認してください。`,
    q2: (a, b) => `${a}から${b}への直通列車の終電は何時ですか？`,
    a2: (o) => `平日、${o.a}から${o.b}への直通の${o.train}の最終便は${o.wl}発で、${o.b}から${o.a}へは${o.rl}発です。出典：${o.credit}、${o.date}に確認。`,
    q3: (a, b) => `${a}から${b}まで直通列車は1日に何本ありますか？`,
    a3: (o) => `${o.op}の時刻表では、${o.a}から${o.b}まで直通列車は平日1日${o.wn}本、土曜は${o.sn}本、日曜は${o.un}本です。${o.b}から${o.a}へは${o.rwn}本、${o.rsn}本、${o.run}本です。出典：${o.credit}、${o.date}に確認。`
  }
};
const stat = { done: 0, had: 0 };
for (const [slug, r] of Object.entries(DATA.routes)) {
  const R = ROUTE[slug]; if (!R) continue;
  const src = PRIORITY.find((x) => r.sources.includes(x));
  const dirA = r.dirs[`${R.from}>${R.to}`], dirB = r.dirs[`${R.to}>${R.from}`];
  if (!dirA || !dirB) continue;
  const one = (d, k) => (d[k] || {})[src] || { n: 0, first: '', last: '' };
  for (const lang of LANGS) {
    const file = path.join(ROOT, 'rutas', slug, lang === 'en' ? '' : lang, 'index.html');
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    const a = nm(lang, R.from), b = nm(lang, R.to);
    const o = {
      a, b, train: SRC[src].train[lang], trainRest: SRC[src].train[lang].replace(/^(tren|train|treno) /, ''), op: SRC[src].op[lang], of: (SRC[src].of || {})[lang] || SRC[src].op[lang], credit: SRC[src].credit[lang], date: DATE[lang],
      wf: tm(lang, one(dirA, 'weekday').first), wl: tm(lang, one(dirA, 'weekday').last), rf: tm(lang, one(dirB, 'weekday').first), rl: tm(lang, one(dirB, 'weekday').last),
      wn: one(dirA, 'weekday').n, sn: one(dirA, 'saturday').n, un: one(dirA, 'sunday').n, rwn: one(dirB, 'weekday').n, rsn: one(dirB, 'saturday').n, run: one(dirB, 'sunday').n
    };
    const t = T[lang];
    // regenerar: se retira lo inyectado antes (bloques data-more="2" y sus preguntas del marcado, que son las que citan la fecha de consulta)
    html = html.replace(/\n      <div class="faq-item" data-more="2">[\s\S]*?<\/div>/g, '');
    html = html.replace(/<script type="application\/ld\+json">(.*?)<\/script>/s, (all, body) => {
      try { const d = JSON.parse(body); const fp = d['@graph'].find((n) => n['@type'] === 'FAQPage'); if (!fp) return all;
        fp.mainEntity = fp.mainEntity.filter((q) => !(q.acceptedAnswer && q.acceptedAnswer.text.includes(DATE[lang])));
        return '<script type="application/ld+json">' + JSON.stringify(d) + '</script>'; } catch (e) { return all; }
    });
    const items = [{ q: t.q1(a, b), a: t.a1(o) }, { q: t.q2(a, b), a: t.a2(o) }, { q: t.q3(a, b), a: t.a3(o) }];
    if (!items.length) { stat.had++; continue; }
    const i = html.indexOf('<section class="faq">'); if (i < 0) continue;
    const end = html.indexOf('</section>', i);
    const block = items.map((x) => `\n      <div class="faq-item" data-more="2">\n        <h3 class="faq-q">${esc(x.q)}</h3>\n        <p class="faq-a">${esc(x.a)}</p>\n      </div>`).join('');
    html = html.slice(0, end) + block + '\n    ' + html.slice(end);
    html = html.replace(/<script type="application\/ld\+json">(.*?)<\/script>/s, (all, body) => {
      try {
        const d = JSON.parse(body); const fp = d['@graph'].find((n) => n['@type'] === 'FAQPage'); if (!fp) return all;
        items.forEach((x) => fp.mainEntity.push({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } }));
        return '<script type="application/ld+json">' + JSON.stringify(d) + '</script>';
      } catch (e) { return all; }
    });
    fs.writeFileSync(file, html); stat.done++;
  }
}
console.log(JSON.stringify(stat));
