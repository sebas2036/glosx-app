#!/usr/bin/env node
/**
 * Rutas de Europa en alemán, portugués (europeo) y chino simplificado (/rutas/<slug>/de|pt|zh/), fase 4 de los
 * 8 idiomas (14-nov-2026). Datos de scripts/generate-routes.js (duración, operador, precio orientativo y país, los
 * mismos que muestran las otras versiones). Foto, enlace de Omio y hotel salen de la página en inglés.
 * No toca las 15 páginas zh escritas a mano por generate-routes-zh-top.js. Deja el set completo de hreflang en todas
 * las versiones de cada ruta y en el sitemap. Idempotente. Después: build-zh-hub, build-lang-hub, add-lang-options.
 * Uso: node scripts/generate-routes-europe-i18n.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const gsrc = fs.readFileSync(path.join(__dirname, 'generate-routes.js'), 'utf8');
const gi = gsrc.indexOf('const routes = ['), gj = gsrc.indexOf('\n];\n', gi);
const ROUTES = eval(gsrc.slice(gi + 15, gj + 2)).filter(r => fs.existsSync(path.join(ROOT, 'rutas', r.slug, 'index.html')));

const LANGS = ['de', 'pt', 'zh'];
const ALL = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'];
const HL = { en: 'en', es: 'es', fr: 'fr', de: 'de', it: 'it', pt: 'pt', ja: 'ja', zh: 'zh-Hans' };
const LNAME = { en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano', pt: 'Português', ja: '日本語', zh: '中文' };
const url = (slug, l) => `https://glosx.app/rutas/${slug}/${l === 'en' ? '' : l + '/'}`;
const file = (slug, l) => path.join(ROOT, 'rutas', slug, l === 'en' ? '' : l, 'index.html');

// ── ciudades: [de, pt, zh] (sin entrada = mismo nombre que en inglés; zh siempre definido) ──
const CITY = {
  Amsterdam: [, 'Amesterdão', '阿姆斯特丹'], Berlin: [, 'Berlim', '柏林'], Brussels: ['Brüssel', 'Bruxelas', '布鲁塞尔'], Barcelona: [, , '巴塞罗那'], Girona: [, , '赫罗纳'],
  Lyon: [, , '里昂'], Valencia: [, 'Valência', '瓦伦西亚'], Basel: [, 'Basileia', '巴塞尔'], Lauterbrunnen: [, , '劳特布龙嫩'], Paris: [, , '巴黎'], Hamburg: [, 'Hamburgo', '汉堡'],
  Prague: ['Prag', 'Praga', '布拉格'], Bordeaux: [, 'Bordéus', '波尔多'], Lourdes: [, , '卢尔德'], Brno: ['Brünn', , '布尔诺'], Vienna: ['Wien', 'Viena', '维也纳'], Bruges: ['Brügge', , '布鲁日'],
  Budapest: [, 'Budapeste', '布达佩斯'], Ljubljana: [, 'Liubliana', '卢布尔雅那'], Copenhagen: ['Kopenhagen', 'Copenhaga', '哥本哈根'], Stockholm: [, 'Estocolmo', '斯德哥尔摩'],
  Dortmund: [, , '多特蒙德'], Munich: ['München', 'Munique', '慕尼黑'], Florence: ['Florenz', 'Florença', '佛罗伦萨'], Pisa: [, , '比萨'], Siena: [, , '锡耶纳'], Venice: ['Venedig', 'Veneza', '威尼斯'],
  Frankfurt: [, , '法兰克福'], Cologne: ['Köln', 'Colónia', '科隆'], Geneva: ['Genf', 'Genebra', '日内瓦'], Zermatt: [, , '采尔马特'], Figueres: [, , '菲格雷斯'], Interlaken: [, , '因特拉肯'],
  Lisbon: ['Lissabon', 'Lisboa', '里斯本'], Porto: [, , '波尔图'], London: [, 'Londres', '伦敦'], Cambridge: [, , '剑桥'], Edinburgh: [, 'Edimburgo', '爱丁堡'], Liverpool: [, , '利物浦'],
  Manchester: [, , '曼彻斯特'], Oxford: [, , '牛津'], York: [, , '约克'], Turin: [, 'Turim', '都灵'], Madrid: [, , '马德里'], Malaga: ['Málaga', 'Málaga', '马拉加'], Seville: ['Sevilla', 'Sevilha', '塞维利亚'],
  Zaragoza: ['Saragossa', 'Saragoça', '萨拉戈萨'], Marseille: [, 'Marselha', '马赛'], Miramas: [, , '米拉马'], Milan: ['Mailand', 'Milão', '米兰'], Rome: ['Rom', 'Roma', '罗马'], Zurich: ['Zürich', 'Zurique', '苏黎世'],
  Montreux: [, , '蒙特勒'], Naples: ['Neapel', 'Nápoles', '那不勒斯'], Salerno: [, , '萨莱诺'], Sorrento: ['Sorrent', , '索伦托'], Nice: ['Nizza', , '尼斯'], Monaco: [, 'Mónaco', '摩纳哥'],
  Oslo: [, , '奥斯陆'], Bergen: [, , '卑尔根'], Lucerne: ['Luzern', 'Lucerna', '琉森'], Toulouse: [, , '图卢兹'], Krems: [, , '克雷姆斯'], Salzburg: [, 'Salzburgo', '萨尔茨堡'],
  Strasbourg: ['Straßburg', 'Estrasburgo', '斯特拉斯堡'], Innsbruck: [, , '因斯布鲁克'], Graz: [, , '格拉茨'], Bern: [, 'Berna', '伯尔尼'], 'St. Moritz': [, , '圣莫里茨'], Tende: [, , '唐德'],
  Faro: [, , '法鲁'], Trondheim: [, , '特隆赫姆'], Gothenburg: ['Göteborg', 'Gotemburgo', '哥德堡'], Alicante: [, , '阿利坎特'], Cordoba: ['Córdoba', 'Córdova', '科尔多瓦'], Córdoba: [, 'Córdova', '科尔多瓦'],
  Granada: [, , '格拉纳达'], Salamanca: [, , '萨拉曼卡'], Segovia: [, 'Segóvia', '塞哥维亚'], Toledo: [, , '托莱多'], Santiago: ['Santiago de Compostela', 'Santiago de Compostela', '圣地亚哥-德孔波斯特拉'],
  'Santiago de Compostela': [, , '圣地亚哥-德孔波斯特拉'], Koblenz: [, , '科布伦茨'], Mainz: [, , '美因茨'], Colmar: [, , '科尔马']
};
const IDX = { de: 0, pt: 1, zh: 2 };
function cn(name, l) {
  const c = CITY[name];
  if (!c) throw new Error('Falta ciudad: ' + name);
  const v = c[IDX[l]];
  if (l === 'zh' && !v) throw new Error('Falta nombre zh: ' + name);
  return v || name;
}
const COUNTRY = {
  Netherlands: ['den Niederlanden', 'os Países Baixos', '荷兰', 'Niederlande', 'Países Baixos'], Germany: ['Deutschland', 'a Alemanha', '德国', 'Deutschland', 'Alemanha'],
  Belgium: ['Belgien', 'a Bélgica', '比利时', 'Belgien', 'Bélgica'], Spain: ['Spanien', 'Espanha', '西班牙', 'Spanien', 'Espanha'], France: ['Frankreich', 'a França', '法国', 'Frankreich', 'França'],
  Switzerland: ['der Schweiz', 'a Suíça', '瑞士', 'Schweiz', 'Suíça'], Czech: ['Tschechien', 'a Chéquia', '捷克', 'Tschechien', 'Chéquia'], Austria: ['Österreich', 'a Áustria', '奥地利', 'Österreich', 'Áustria'],
  Hungary: ['Ungarn', 'a Hungria', '匈牙利', 'Ungarn', 'Hungria'], Slovenia: ['Slowenien', 'a Eslovénia', '斯洛文尼亚', 'Slowenien', 'Eslovénia'], Denmark: ['Dänemark', 'a Dinamarca', '丹麦', 'Dänemark', 'Dinamarca'],
  Sweden: ['Schweden', 'a Suécia', '瑞典', 'Schweden', 'Suécia'], Italy: ['Italien', 'a Itália', '意大利', 'Italien', 'Itália'], Portugal: ['Portugal', 'Portugal', '葡萄牙', 'Portugal', 'Portugal'],
  UK: ['dem Vereinigten Königreich', 'o Reino Unido', '英国', 'Vereinigtes Königreich', 'Reino Unido'], Norway: ['Norwegen', 'a Noruega', '挪威', 'Norwegen', 'Noruega']
};
// país del hotel en la página inglesa ("Lyon, France") → nombre
const HOTEL_COUNTRY = { France: 'France', Italy: 'Italy', Spain: 'Spain', Germany: 'Germany', Switzerland: 'Switzerland', Austria: 'Austria', 'United Kingdom': 'UK', UK: 'UK', Netherlands: 'Netherlands', Belgium: 'Belgium', 'Czech Republic': 'Czech', Czechia: 'Czech', Hungary: 'Hungary', Portugal: 'Portugal', Denmark: 'Denmark', Sweden: 'Sweden', Norway: 'Norway', Slovenia: 'Slovenia', Monaco: 'Monaco' };
COUNTRY.Monaco = ['Monaco', 'o Mónaco', '摩纳哥', 'Monaco', 'Mónaco'];

function minutes(d) {
  let m = d.match(/(\d+)h\s*(\d+)m/);
  if (m) return +m[1] * 60 + +m[2];
  m = d.match(/(\d+)\s*min/);
  if (m) return +m[1];
  throw new Error('Duración rara: ' + d);
}
function dur(m, l, long) {
  const h = Math.floor(m / 60), r = m % 60;
  if (l === 'zh') return h ? `${h}小时${r ? r + '分' : ''}` : `${m}分钟`;
  if (l === 'de') {
    if (!long) return h ? (r ? `${h} Std. ${r} Min.` : `${h} Std.`) : `${m} Min.`;
    const hs = h ? `${h} ${h === 1 ? 'Stunde' : 'Stunden'}` : '', ms = r ? `${r} ${r === 1 ? 'Minute' : 'Minuten'}` : '';
    return hs && ms ? hs + ' und ' + ms : hs || ms;
  }
  if (!long) return h ? (r ? `${h}h${String(r).padStart(2, '0')}` : `${h}h`) : `${m} min`;
  const hs = h ? `${h} ${h === 1 ? 'hora' : 'horas'}` : '', ms = r ? `${r} ${r === 1 ? 'minuto' : 'minutos'}` : '';
  return hs && ms ? hs + ' e ' + ms : hs || ms;
}
function price(p, l) {
  const m = (p || '').match(/€\s*(\d+)(?:\s*-\s*(\d+))?/);
  if (!m) return null;
  const v = m[2] ? `${m[1]}–${m[2]}` : m[1];
  return l === 'zh' ? `${v} 欧元` : `${v} €`;
}

// consejo propio de las 15 rutas con versión zh escrita a mano
const TOP_TIP = {
  'london-paris': ['Die Grenz- und Passkontrollen für Großbritannien und Frankreich finden vor der Abfahrt in London St Pancras statt: Sei früh am Bahnhof.', 'Os controlos de fronteira do Reino Unido e de França fazem-se antes da partida em Londres St Pancras: chegue cedo à estação.'],
  'paris-amsterdam': ['Die Strecke liegt im Schengen-Raum, meist ohne Passkontrolle, aber nimm deinen Ausweis mit.', 'A rota fica no espaço Schengen, normalmente sem controlo de passaportes, mas leve o documento de identificação.'],
  'brussels-paris': ['In Brüssel fahren die internationalen Züge ab Bruxelles-Midi (Brüssel-Süd).', 'Em Bruxelas, os comboios internacionais partem de Bruxelles-Midi (Bruxelas-Sul).'],
  'london-brussels': ['Die Grenzkontrollen finden vor der Abfahrt in London St Pancras statt: Sei früh am Bahnhof.', 'Os controlos de fronteira fazem-se antes da partida em Londres St Pancras: chegue cedo à estação.'],
  'paris-milan': ['Auf dem Alpenabschnitt gibt es wegen Bauarbeiten manchmal Umstiege: Prüfe vor der Buchung, ob dein Zug durchfährt.', 'No troço alpino há por vezes mudanças por obras: confirme antes de reservar se o seu comboio é direto.'],
  'paris-zurich': ['In der Schweiz zahlt man in Franken: Karten werden fast überall akzeptiert.', 'Na Suíça paga-se em francos: os cartões são aceites em quase todo o lado.'],
  'zurich-lucerne': ['Mit dem Swiss Travel Pass fährst du ohne zusätzliches Ticket.', 'Com o Swiss Travel Pass viaja sem bilhete adicional.'],
  'rome-venice': ['Fahr bis Venezia Santa Lucia und steig nicht in Mestre aus, das auf dem Festland liegt.', 'Vá até Venezia Santa Lucia e não saia em Mestre, que fica em terra firme.'],
  'milan-florence': ['Der Hauptbahnhof in Florenz ist Santa Maria Novella, zu Fuß nah am Dom.', 'A estação principal de Florença é Santa Maria Novella, a pé da catedral.'],
  'milan-rome': ['Trenitalia (Frecciarossa) und Italo fahren beide auf dieser Strecke: Vergleiche Zeiten und Preise.', 'A Trenitalia (Frecciarossa) e a Italo fazem ambas esta rota: compare horários e preços.'],
  'rome-naples': ['Nach Pompeji fährst du ab Neapel mit der Circumvesuviana.', 'Para Pompeia, apanhe a Circumvesuviana em Nápoles.'],
  'venice-milan': ['Steig in Venedig in Santa Lucia ein; Mestre liegt auf dem Festland.', 'Em Veneza, embarque em Santa Lucia; Mestre fica em terra firme.'],
  'munich-berlin': ['Sparpreise der DB werden günstiger, je früher du buchst, gelten aber nur für den gebuchten Zug.', 'Os bilhetes Sparpreis da DB são mais baratos quanto mais cedo reservar, mas só valem para o comboio reservado.'],
  'frankfurt-paris': ['Paris Est und Paris Nord liegen nur wenige Gehminuten auseinander.', 'Paris Est e Paris Nord ficam a poucos minutos a pé uma da outra.'],
  'rome-florence': ['Manche Züge halten in Firenze Rifredi statt Santa Maria Novella: Prüfe den Ankunftsbahnhof.', 'Alguns comboios param em Firenze Rifredi em vez de Santa Maria Novella: confirme a estação de chegada.']
};

const UI = {
  de: { back: 'Alle Strecken', badge: 'Streckenführer · Europa', meta: 'Von WoW Train · Aktualisiert im November 2026 · 4 Min. Lesezeit', btn: 'Ticket buchen',
    cta: (a, b) => `Fahrzeiten prüfen und <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> auf Omio buchen`,
    sub: 'Live-Fahrplan für dein Datum · Preise ändern sich täglich', facts: 'Das Wichtigste', choose: 'Welchen Zug nehmen', tips: 'Tipps vor der Reise',
    faq: 'Häufige Fragen', more: 'Weitere Zugstrecken in Europa', ready: 'Bereit zur Abfahrt? Vergleiche Fahrzeiten und Preise für dein Datum und buche deinen Platz auf Omio.', note: 'Öffnet sich in einem neuen Tab', cmp: 'Fahrzeiten und Preise vergleichen:', check: 'Fahrpläne ansehen',
    home: 'Startseite', routes: 'Strecken', hotel: 'Wo übernachten', sep: ', ', hbtn: 'Aktuellen Preis ansehen →', hbk: 'Auf Booking.com vergleichen →',
    footer: '<a href="/blog.html">Blog</a> · <a href="/about.html">Über uns</a> · <a href="/privacy.html">Datenschutz</a> · <a href="/terms.html">Nutzungsbedingungen</a>' },
  pt: { back: 'Todas as rotas', badge: 'Guia de rota · Europa', meta: 'Por WoW Train · Atualizado em novembro de 2026 · 4 min de leitura', btn: 'Reservar',
    cta: (a, b) => `Consulte os horários e reserve <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> na Omio`,
    sub: 'Horário em tempo real para a sua data · os preços mudam todos os dias', facts: 'Dados essenciais', choose: 'Que comboio escolher', tips: 'Conselhos antes de partir',
    faq: 'Perguntas frequentes', more: 'Mais rotas de comboio na Europa', ready: 'Pronto para partir? Compare os horários e os preços para a sua data e reserve o seu lugar na Omio.', note: 'Abre num novo separador', cmp: 'Compare horários e preços:', check: 'Ver horários',
    home: 'Início', routes: 'Rotas', hotel: 'Onde ficar', sep: ', ', hbtn: 'Ver preço atual →', hbk: 'Comparar no Booking.com →',
    footer: '<a href="/blog.html">Blog</a> · <a href="/about.html">Sobre nós</a> · <a href="/privacy.html">Privacidade</a> · <a href="/terms.html">Termos</a>' },
  zh: { back: '全部线路', badge: '线路指南 · 欧洲', meta: 'WoW Train · 2026 年 11 月更新 · 阅读约 4 分钟', btn: '订票',
    cta: (a, b) => `查看 <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> 的时刻并在 Omio 预订`,
    sub: '显示所选日期的实时时刻 · 票价每天变化', facts: '基本信息', choose: '选哪趟车', tips: '出发前须知',
    faq: '常见问题', more: '欧洲更多火车线路', ready: '准备出发了吗？在 Omio 比较你所选日期的时刻和票价并预订座位。', note: '在新标签页中打开', cmp: '比较时刻和票价：', check: '查看时刻',
    home: '首页', routes: '线路', hotel: '住宿推荐', sep: '・', hbtn: '查看当前价格 →', hbk: '在 Booking.com 比较 →',
    footer: '<a href="/blog.html">博客</a> · <a href="/about.html">关于我们</a> · <a href="/privacy.html">隐私政策</a> · <a href="/terms.html">使用条款</a>' }
};

function countries(r) { return r.country.split('-').map(c => c === 'Czech' ? 'Czech' : c).filter(c => COUNTRY[c]); }
function content(r, l) {
  const A = cn(r.from, l), B = cn(r.to, l), m = minutes(r.duration), S = dur(m, l), L = dur(m, l, true), P = price(r.price, l), op = r.operator;
  const cs = countries(r), cross = cs.length > 1;
  const has = c => cs.includes(c);
  const eurostar = /Eurostar/.test(op) && has('UK');
  const top = TOP_TIP[r.slug] && l !== 'zh' ? [TOP_TIP[r.slug][l === 'de' ? 0 : 1]] : [];
  const o = { A, B };
  if (l === 'de') {
    const cl = cross ? `Die Strecke verbindet ${COUNTRY[cs[0]][3]} und ${COUNTRY[cs[1]][3]}.` : cs[0] ? `Die Strecke verläuft innerhalb von ${COUNTRY[cs[0]][0]}.` : '';
    o.title = `Zug von ${A} nach ${B}: ${S} mit ${op}`;
    o.desc = `Mit dem Zug von ${A} nach ${B} in etwa ${S} mit ${op}${P ? ', Tickets ab etwa ' + P.split('–')[0].replace(' €', '') + ' €' : ''}. Bahnhöfe, Tipps und Buchung über Omio.`;
    o.lead = `Der Zug von ${A} nach ${B} braucht etwa ${L}, meist mit ${op}. ${cl}`;
    o.facts = [`Fahrzeit: etwa ${S}.`, `Hauptbetreiber: ${op}.`, P ? `Richtpreis: ${P} (je nach Datum und Buchungszeitpunkt).` : 'Preise je nach Datum und Buchungszeitpunkt.', cross ? `Grenzüberschreitend: ${COUNTRY[cs[0]][3]} – ${COUNTRY[cs[1]][3]}.` : `Inlandsverbindung in ${COUNTRY[cs[0]] ? COUNTRY[cs[0]][3] : r.country}.`];
    o.choose = `Die meisten Reisenden nehmen die Direktverbindung von ${op}. Die Preise ändern sich je nach Datum und Auslastung, und früh buchen ist meist günstiger. Auf Omio vergleichst du alle Verbindungen und Preise für dein Datum.`;
    const t = [...top];
    if (eurostar && !top.length) t.push('Die Grenz- und Passkontrollen finden vor der Abfahrt statt: Sei mindestens 60 Minuten vorher am Bahnhof.');
    if (has('Switzerland') && !top.length) t.push('In der Schweiz zahlt man in Franken; Karten werden fast überall akzeptiert.');
    if (has('Spain') && !cross) t.push('In spanischen Fernbahnhöfen wird das Gepäck vor dem Einsteigen durchleuchtet: Plane ein paar Minuten mehr ein.');
    if (has('Germany') && !cross && !top.length) t.push('Sparpreise der DB werden günstiger, je früher du buchst, gelten aber nur für den gebuchten Zug.');
    t.push('Dein E-Ticket genügt: Speichere es auf dem Handy oder drucke es aus und halte einen Ausweis bereit.', 'Sei 15 bis 20 Minuten vor der Abfahrt am Bahnhof, um deinen Bahnsteig in Ruhe zu finden.');
    o.tips = t.slice(0, 4);
    o.faqs = [[`Wie lange dauert die Zugfahrt von ${A} nach ${B}?`, `Etwa ${L}. Die Fahrzeit ist je nach Zug unterschiedlich, also prüfe die deines Zuges.`],
      [`Wer betreibt die Züge von ${A} nach ${B}?`, `Hauptsächlich ${op}. Auf Omio siehst du alle Verbindungen für dein Datum.`],
      [`Was kostet der Zug von ${A} nach ${B}?`, P ? `Als Richtwert ${P}. Der tatsächliche Preis hängt von Datum, Zug und Buchungszeitpunkt ab.` : 'Der Preis hängt von Datum, Zug und Buchungszeitpunkt ab; auf Omio siehst du die aktuellen Preise für dein Datum.'],
      ['Muss ich im Voraus buchen?', 'Für Schnellzüge lohnt sich frühes Buchen, weil die Preise steigen. Bei Regionalzügen sind die Preise meist fest, dort kannst du auch am selben Tag kaufen.'],
      ['Kann man im Zug essen?', 'Die meisten Fernzüge haben ein Bordrestaurant oder einen Snackwagen, und du kannst eigenes Essen und Getränke mitnehmen.'],
      ['Gibt es WLAN und Steckdosen an Bord?', 'Die meisten Schnellzüge haben Steckdosen und viele auch WLAN, dessen Qualität aber von der Strecke abhängt.'],
      ['Gibt es Kinderermäßigungen?', 'Fast alle europäischen Bahnen haben Kinderermäßigungen, Alter und Rabatt sind je nach Land verschieden. Gib auf Omio das Alter der Mitreisenden ein, dann siehst du den passenden Preis.'],
      ['Gilt der Eurail- oder Interrail-Pass?', 'Der Pass gilt auf den meisten Strecken, aber viele Schnell- und Nachtzüge verlangen eine zusätzliche Reservierung.'],
      ['Gibt es Gepäckbeschränkungen?', 'In den meisten europäischen Zügen gibt es keine strengen Gewichtsgrenzen, solange du dein Gepäck selbst tragen und verstauen kannst; wenige Züge wie der Eurostar begrenzen die Anzahl der Gepäckstücke.'],
      ['Wie buche ich auf Omio?', 'Suche die Strecke auf Omio, vergleiche Züge und Preise und bezahle mit Karte; das E-Ticket kommt per E-Mail und in die Omio-App.']];
  } else if (l === 'pt') {
    const cl = cross ? `A rota liga ${COUNTRY[cs[0]][1]} e ${COUNTRY[cs[1]][1]}.` : cs[0] ? `É uma ligação nacional em ${COUNTRY[cs[0]][4]}.` : '';
    o.title = `Comboio de ${A} para ${B}: ${S} com ${op}`;
    o.desc = `De ${A} para ${B} de comboio em cerca de ${S} com ${op}${P ? ', bilhetes a partir de cerca de ' + P.split('–')[0].replace(' €', '') + ' €' : ''}. Estações, conselhos e reserva na Omio.`;
    o.lead = `O comboio de ${A} para ${B} demora cerca de ${L}, normalmente com ${op}. ${cl}`;
    o.facts = [`Duração: cerca de ${S}.`, `Operador principal: ${op}.`, P ? `Preço indicativo: ${P} (consoante a data e a antecedência).` : 'Preços consoante a data e a antecedência da reserva.', cross ? `Internacional: ${COUNTRY[cs[0]][4]} – ${COUNTRY[cs[1]][4]}.` : `Ligação nacional em ${COUNTRY[cs[0]] ? COUNTRY[cs[0]][4] : r.country}.`];
    o.choose = `A maioria dos viajantes escolhe a ligação direta da ${op}. Os preços mudam consoante a data e a ocupação, e reservar cedo costuma ser mais barato. Na Omio compara todas as ligações e preços para a sua data.`;
    const t = [...top];
    if (eurostar && !top.length) t.push('Os controlos de fronteira fazem-se antes da partida: chegue à estação pelo menos 60 minutos antes.');
    if (has('Switzerland') && !top.length) t.push('Na Suíça paga-se em francos; os cartões são aceites em quase todo o lado.');
    if (has('Spain') && !cross) t.push('Nas estações de longo curso em Espanha, a bagagem passa por um scanner antes do embarque: conte com alguns minutos a mais.');
    if (has('Germany') && !cross && !top.length) t.push('Os bilhetes Sparpreis da DB são mais baratos quanto mais cedo reservar, mas só valem para o comboio reservado.');
    t.push('Basta o bilhete eletrónico: guarde-o no telemóvel ou imprima-o e tenha um documento de identificação à mão.', 'Chegue à estação 15 a 20 minutos antes da partida para encontrar a plataforma com calma.');
    o.tips = t.slice(0, 4);
    o.faqs = [[`Quanto tempo demora o comboio de ${A} para ${B}?`, `Cerca de ${L}. A duração varia de comboio para comboio, por isso confirme a do seu.`],
      [`Quem opera os comboios de ${A} para ${B}?`, `Principalmente a ${op}. Na Omio vê todas as ligações para a sua data.`],
      [`Quanto custa o comboio de ${A} para ${B}?`, P ? `Como referência, ${P}. O preço real depende da data, do comboio e da antecedência da reserva.` : 'O preço depende da data, do comboio e da antecedência da reserva; na Omio vê os preços atuais para a sua data.'],
      ['É preciso reservar com antecedência?', 'Nos comboios de alta velocidade compensa reservar cedo, porque os preços sobem. Nos comboios regionais os preços costumam ser fixos e pode comprar no próprio dia.'],
      ['Pode-se comer no comboio?', 'A maioria dos comboios de longo curso tem bar ou carruagem-restaurante, e pode levar a sua própria comida e bebida.'],
      ['Há Wi-Fi e tomadas a bordo?', 'A maioria dos comboios de alta velocidade tem tomadas e muitos têm Wi-Fi, mas a qualidade depende da linha.'],
      ['Há descontos para crianças?', 'Quase todas as companhias ferroviárias europeias têm descontos para crianças; a idade e o desconto variam por país. Indique a idade dos passageiros na Omio para ver o preço correspondente.'],
      ['O passe Eurail ou Interrail é válido?', 'O passe vale na maioria das linhas, mas muitos comboios de alta velocidade e noturnos exigem uma reserva paga à parte.'],
      ['Há limites de bagagem?', 'Na maioria dos comboios europeus não há limites de peso rígidos, desde que consiga levar e arrumar a bagagem sozinho; alguns, como o Eurostar, limitam o número de malas.'],
      ['Como reservo na Omio?', 'Procure a rota na Omio, compare comboios e preços e pague com cartão; o bilhete eletrónico chega por e-mail e à aplicação da Omio.']];
  } else {
    const cl = cross ? `这条线路连接${COUNTRY[cs[0]][2]}和${COUNTRY[cs[1]][2]}。` : cs[0] ? `这是${COUNTRY[cs[0]][2]}国内的线路。` : '';
    o.title = `${A}到${B}火车：约${S}（${op}）`;
    o.desc = `从${A}到${B}乘火车约${S}，主要由 ${op} 运营。${P ? '参考票价 ' + P + '，' : ''}车站、实用建议和 Omio 订票方法。`;
    o.lead = `从${A}到${B}乘火车约需${L}，主要由 ${op} 运营。${cl}`;
    o.facts = [`行程时间：约${S}`, `主要运营商：${op}`, P ? `参考票价：${P}（以所选日期的实际价格为准）` : '票价因日期和订票时间而异', cross ? `跨国线路：${COUNTRY[cs[0]][2]} – ${COUNTRY[cs[1]][2]}` : `${COUNTRY[cs[0]] ? COUNTRY[cs[0]][2] : r.country}国内线路`];
    o.choose = `大多数旅客会选择 ${op} 的直达车次。票价随日期和余票变化，越早订通常越便宜。在 Omio 可以比较当天的所有车次和票价。`;
    const t = [];
    if (eurostar) t.push('出入境检查在出发前办理，请至少提前 60 分钟到站。');
    if (has('Switzerland')) t.push('瑞士使用瑞士法郎，大多数地方可以刷卡。');
    if (has('Spain') && !cross) t.push('西班牙长途火车站上车前要过行李安检，请多预留几分钟。');
    if (has('Germany') && !cross) t.push('德铁的特价票（Sparpreis）越早买越便宜，但只能乘坐指定车次。');
    t.push('电子车票就可以上车：存在手机里或打印出来，并随身携带证件。', '请在发车前 15 到 20 分钟到站，从容找到站台。');
    o.tips = t.slice(0, 4);
    o.faqs = [[`从${A}到${B}坐火车要多久？`, `大约${L}。不同车次用时不同，请以所订车次为准。`],
      [`${A}到${B}的火车由哪家公司运营？`, `主要是 ${op}。在 Omio 可以看到所选日期的全部车次。`],
      [`${A}到${B}的火车票多少钱？`, P ? `参考价格为 ${P}，实际票价取决于日期、车次和订票时间。` : '票价取决于日期、车次和订票时间；在 Omio 可以查看所选日期的实时价格。'],
      ['需要提前订票吗？', '高速列车越早订通常越便宜；区域列车的票价一般是固定的，当天买也可以。'],
      ['车上可以吃东西吗？', '大多数长途列车有餐车或售卖车，也可以自带食物和饮料。'],
      ['车上有 Wi-Fi 和充电插座吗？', '大多数高速列车有插座，很多还有 Wi-Fi，但信号好坏取决于线路。'],
      ['儿童票怎么算？', '大多数欧洲铁路公司都有儿童优惠，年龄和折扣因国家而异。在 Omio 输入乘客年龄就能看到对应票价。'],
      ['可以用欧铁通票（Eurail）吗？', '欧铁通票可以乘坐大多数线路，但很多高速列车和夜车需要另付订座费。'],
      ['行李有限制吗？', '大多数欧洲火车对行李没有严格的重量限制，只要自己能搬上车、放在行李架上即可；欧洲之星等少数列车有件数规定。'],
      ['怎样在 Omio 订票？', '在 Omio 搜索线路，比较车次和票价，用银行卡付款，电子车票会发到你的邮箱和 Omio App。']];
  }
  return o;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const API = 'https://voxa-production-dc15.up.railway.app/affiliate';
const enPage = slug => fs.readFileSync(file(slug, 'en'), 'utf8');
function hotelHtml(r, l, B) {
  const en = enPage(r.slug), i = en.indexOf('<div class="hotel-card">');
  if (i < 0) return '';
  const blk = en.slice(i, en.indexOf('</div>\n    </div>', i));
  const img = (blk.match(/hotel-card-image" src="([^"]+)"/) || [])[1], name = (blk.match(/hotel-card-name">([^<]+)</) || [])[1];
  const locRaw = ((blk.match(/hotel-card-location">([^<]+)</) || [])[1] || '').split(',').pop().trim();
  const ck = HOTEL_COUNTRY[locRaw];
  const ctry = ck && COUNTRY[ck] ? COUNTRY[ck][{ de: 3, pt: 4, zh: 2 }[l]] : locRaw;
  const kh = (blk.match(/href="([^"]*klook-hotel[^"]*)"/) || [])[1], bk = (blk.match(/href="([^"]*booking[^"]*)"/) || [])[1];
  if (!img || !name || (!kh && !bk)) return '';
  const u = UI[l];
  return `
    <h2>${u.hotel}</h2>
    <div class="hotel-card">
      <div class="hotel-card-header">
        <img class="hotel-card-image" src="${img}" alt="${name}" loading="lazy">
        <div class="hotel-card-info">
          <div class="hotel-card-name">${name}</div>
          <div class="hotel-card-location">${esc(B)}${u.sep}${esc(ctry)}</div>
        </div>
      </div>
      <div class="hotel-card-actions">
        ${kh ? `<a href="${kh}" class="cta-btn" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('hotel_${r.slug}_${l}')">${u.hbtn}</a>` : ''}
        ${kh && bk ? '<br>' : ''}
        ${bk ? `<a href="${bk}" class="${kh ? 'economic-link' : 'cta-btn'}" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('hotel_booking_${r.slug}_${l}')">${kh ? u.hbk : u.hbtn}</a>` : ''}
      </div>
    </div>
`;
}

const template = fs.readFileSync(path.join(__dirname, 'route-template.html'), 'utf8');
const head = template.slice(0, template.indexOf('<main>'));
const tail = template.slice(template.indexOf('</main>') + '</main>'.length);

function render(r, l) {
  const o = content(r, l), u = UI[l], en = enPage(r.slug);
  const hero = (en.match(/url\('(https:\/\/(?:images\.pexels\.com|glosx\.app\/assets\/img\/hero)\/[^']+)'\)/) || [])[1] || 'https://glosx.app/hero-bg.jpg';
  const book = (en.match(/href="(https:\/\/voxa-production-dc15\.up\.railway\.app\/affiliate\/europe-train\?[^"]+)"/) || [])[1] || `${API}/europe-train?from=${r.from.toLowerCase()}&to=${r.to.toLowerCase()}`;
  const cs = countries(r);
  const shares = x => [x.from, x.to].some(c => c === r.from || c === r.to);
  const sameCountry = x => countries(x).some(c => cs.includes(c));
  const others = ROUTES.filter(x => x.slug !== r.slug);
  const rel = others.filter(shares).concat(others.filter(x => !shares(x) && sameCountry(x)), others.filter(x => !shares(x) && !sameCountry(x))).slice(0, 6);
  const related = rel.map(x => { const c = content(x, l); return `<a href="/rutas/${x.slug}/${l}/" class="related-link">${esc(c.A)} &rarr; ${esc(c.B)}</a>`; }).join('\n        ');
  const li = a => a.map(x => `<li>${esc(x)}</li>`).join('\n      ');
  const main = `<main>
    <p class="lead">${esc(o.lead)}</p>

    <a href="${book}" class="klook-cta omio-cta" target="_blank" rel="noopener sponsored"
       onclick="gtag('event','omio_click',{source:'cta_block',route:'${r.slug}',lang:'${l}'});">
      <img class="klook-cta-logo" src="https://www.google.com/s2/favicons?sz=64&domain=omio.com" alt="Omio" loading="lazy">
      <div class="klook-cta-text">
        <span class="klook-cta-title">${u.cta(esc(o.A), esc(o.B))}</span>
        <span class="klook-cta-sub">${u.sub}</span>
      </div>
      <span class="klook-cta-btn">${u.btn} &#8599;</span>
    </a>

    <h2>${u.facts}</h2>
    <ul>
      ${li(o.facts)}
    </ul>

    <h2>${u.choose}</h2>
    <p>${esc(o.choose)}</p>

    <h2>${u.tips}</h2>
    <ul>
      ${li(o.tips)}
    </ul>
${hotelHtml(r, l, o.B)}
    <section class="faq">
      <h2>${u.faq}</h2>${o.faqs.map(([q, a], i) => `
      <div class="faq-item"${i >= 3 ? ' data-more="1"' : ''}>
        <h3 class="faq-q">${esc(q)}</h3>
        <p class="faq-a">${esc(a)}</p>
      </div>`).join('')}
    </section>

    <hr/>
    <p>${u.ready}</p>
    <p class="tl-secondary" style="text-align:center;margin:10px 0 8px;font-size:14px;color:#55565f;">
      ${u.cmp} <a href="${book}" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('route_${r.slug}_${l}')">${u.check}</a>
    </p>
    <p class="tl-note" style="text-align:center;margin:0 0 8px;font-size:12px;color:#6b6b85;">${u.note}</p>

    <div class="related-routes">
      <h2>${u.more}</h2>
      <div class="related-grid">
        ${related}
      </div>
    </div>
  </main>`;
  const opts = ALL.map(x => `<a class="lang-option${x === l ? ' active' : ''}" href="/rutas/${r.slug}/${x === 'en' ? '' : x + '/'}" hreflang="${HL[x]}" lang="${HL[x]}">${LNAME[x]}</a>`).join('');
  const langSwitch = `<div class="lang-wrapper" data-lang-chip><button type="button" class="lang-btn" id="langBtn" aria-label="Language" aria-haspopup="true" aria-expanded="false"><span id="langCode">${l === 'zh' ? '中文' : l.toUpperCase()}</span><span style="font-size:10px;opacity:0.6">▾</span></button><div class="lang-dropdown" id="langDropdown">${opts}</div></div>`;
  const graph = [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: u.home, item: `https://glosx.app/${l}/` },
      { '@type': 'ListItem', position: 2, name: u.routes, item: `https://glosx.app/${l}/rutas/` },
      { '@type': 'ListItem', position: 3, name: `${o.A} → ${o.B}`, item: url(r.slug, l) }] },
    { '@type': 'FAQPage', mainEntity: o.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@type': 'Article', headline: o.title, description: o.desc, image: hero, datePublished: '2026-11-14', dateModified: '2026-11-14',
      author: { '@type': 'Organization', name: 'WoW Train', url: 'https://glosx.app/' },
      publisher: { '@type': 'Organization', name: 'WoW Train', logo: { '@type': 'ImageObject', url: 'https://glosx.app/logo.png' } },
      mainEntityOfPage: url(r.slug, l), inLanguage: HL[l] }];
  const map = {
    '{{lang}}': HL[l], '{{routeSlug}}': r.slug, '{{canonical}}': url(r.slug, l),
    '{{title}}': esc(o.title), '{{description}}': esc(o.desc), '{{ogTitle}}': esc(o.title), '{{ogDescription}}': esc(o.desc),
    '{{twitterTitle}}': esc(o.title), '{{twitterDescription}}': esc(o.desc), '{{videoCss}}': '',
    '{{schema}}': `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`,
    '{{langSwitch}}': langSwitch, '{{backText}}': u.back, '{{homeHref}}': `/${l}/`, '{{routesHref}}': `/${l}/rutas/`,
    '{{footerLinks}}': u.footer, '{{badge}}': u.badge, '{{mainTitle}}': esc(`${o.A} → ${o.B}`), '{{metaText}}': u.meta
  };
  let html = head + main + tail;
  html = html.split('{{heroImage}}').join(hero);
  for (const [kk, v] of Object.entries(map)) html = html.split(kk).join(v);
  return html;
}

// ── generar ──
const ZH_HAND = new Set(['london-paris', 'paris-amsterdam', 'brussels-paris', 'london-brussels', 'paris-milan', 'paris-zurich', 'zurich-lucerne', 'rome-venice', 'milan-florence', 'milan-rome', 'rome-naples', 'venice-milan', 'munich-berlin', 'frankfurt-paris', 'rome-florence']);
const newUrls = [];
let n = 0;
for (const r of ROUTES) for (const l of LANGS) {
  if (l === 'zh' && ZH_HAND.has(r.slug) && fs.existsSync(file(r.slug, 'zh'))) continue;
  const p = file(r.slug, l);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, render(r, l));
  newUrls.push(url(r.slug, l)); n++;
}
console.log('Rutas de Europa:', ROUTES.length, '· páginas de/pt/zh escritas:', n);

// ── hreflang completo en todas las versiones de cada ruta ──
let fixed = 0;
for (const r of ROUTES) {
  const have = ALL.filter(l => fs.existsSync(file(r.slug, l)));
  const block = have.map(l => `<link rel="alternate" hreflang="${HL[l]}" href="${url(r.slug, l)}" />`).concat(`<link rel="alternate" hreflang="x-default" href="${url(r.slug, 'en')}" />`);
  for (const l of have) {
    const p = file(r.slug, l), h0 = fs.readFileSync(p, 'utf8');
    const re = new RegExp(`[ \\t]*<link rel="alternate" hreflang="[^"]+" href="https://glosx\\.app/rutas/${r.slug}/(?:[a-z]{2}/)?" ?/>\\n`, 'g');
    const first = h0.search(re);
    if (first < 0) continue;
    const indent = (h0.slice(first).match(/^[ \t]*/) || [''])[0];
    const h = h0.slice(0, first) + block.map(x => indent + x + '\n').join('') + h0.slice(first).replace(re, '');
    if (h !== h0) { fs.writeFileSync(p, h); fixed++; }
  }
}
console.log('hreflang actualizados en', fixed, 'páginas');

// ── sitemap ──
const sm = path.join(ROOT, 'sitemap.xml');
let x = fs.readFileSync(sm, 'utf8');
const today = new Date().toISOString().slice(0, 10);
const locs = new Set(ROUTES.flatMap(r => ALL.map(l => url(r.slug, l))));
const keep = {};
x = x.replace(/  <url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>\n/g, (b, loc) => {
  if (!locs.has(loc)) return b;
  keep[loc] = { lastmod: (b.match(/<lastmod>([^<]+)</) || [])[1], pr: (b.match(/<priority>([^<]+)</) || [])[1] };
  return '';
});
let entries = '';
for (const r of ROUTES) {
  const have = ALL.filter(l => fs.existsSync(file(r.slug, l)));
  const alts = have.map(l => `      <xhtml:link rel="alternate" hreflang="${HL[l]}" href="${url(r.slug, l)}" />`).join('\n') + `\n      <xhtml:link rel="alternate" hreflang="x-default" href="${url(r.slug, 'en')}" />`;
  for (const l of have) {
    const u = url(r.slug, l), kp = keep[u] || {};
    entries += `  <url>\n    <loc>${u}</loc>\n    <lastmod>${LANGS.includes(l) ? today : kp.lastmod || today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${kp.pr || (l === 'en' ? '0.8' : '0.7')}</priority>\n${alts}\n  </url>\n`;
  }
}
x = x.replace('</urlset>', entries + '</urlset>');
fs.writeFileSync(sm, x);
fs.writeFileSync(path.join(__dirname, 'europe-i18n-urls.txt'), newUrls.join('\n') + '\n');
console.log('Sitemap: rutas de Europa reescritas con hreflang de 8 idiomas');
