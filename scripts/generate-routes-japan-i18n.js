#!/usr/bin/env node
/**
 * Rutas de Japón en alemán, portugués (europeo) y chino simplificado (/rutas/<slug>/de|pt|zh/), fase 3 de los
 * 8 idiomas (14-nov-2026). Mismos datos que las otras versiones: duración más rápida, trenes y Shinkansen de
 * scripts/japan-pairs-data.json (Klook, oct-2026) y datos por ciudad de scripts/japan-cities-meta.js.
 * El hotel sale de la página en inglés (mismo hotel y mismo enlace con marker). No toca las 15 páginas zh
 * escritas a mano por generate-routes-zh-top.js. Además deja el set completo de hreflang en todas las versiones
 * de cada ruta y en el sitemap. Idempotente. Después: build-zh-hub, build-lang-hub, add-lang-options.
 * Uso: node scripts/generate-routes-japan-i18n.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DATA = require('./japan-pairs-data.json');
const META = require('./japan-cities-meta.js');

// ── las 196 rutas de Japón (mismo orden y slugs que generate-routes-japan.js) ──
const jsrc = fs.readFileSync(path.join(__dirname, 'generate-routes-japan.js'), 'utf8');
const hand = eval('[' + jsrc.match(/const ROUTES = \[([\s\S]*?)\n\];\n/)[1] + '\n]');
const ROUTES = hand.concat(require('./routes-japan-lote2'), require('./routes-japan-auto'));
const RELATED = fs.existsSync(path.join(__dirname, 'japan-related.json')) ? require('./japan-related.json') : {};
const KEYFIX = { narita: 'naritaairport', kansai: 'kansaiairport', newchitose: 'newchitoseairport' };
const k = x => KEYFIX[x] || x;
function row(r) {
  const a = k(r.fromKey), b = k(r.toKey);
  return DATA.rows.find(x => (x.a === a && x.b === b) || (x.a === b && x.b === a));
}
const DISPLAY = {}; DATA.cities.forEach(c => { DISPLAY[c.slug] = c.display; });
const isAirport = s => /airport$/.test(s);

const LANGS = ['de', 'pt', 'zh'];
const ALL = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'];
const HL = { en: 'en', es: 'es', fr: 'fr', de: 'de', it: 'it', pt: 'pt', ja: 'ja', zh: 'zh-Hans' };
const LNAME = { en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano', pt: 'Português', ja: '日本語', zh: '中文' };
const url = (slug, l) => `https://glosx.app/rutas/${slug}/${l === 'en' ? '' : l + '/'}`;
const file = (slug, l) => path.join(ROOT, 'rutas', slug, l === 'en' ? '' : l, 'index.html');

// ── nombres ──
const NAME = {
  de: { tokyo: 'Tokio', naritaairport: 'Flughafen Narita', kansaiairport: 'Flughafen Kansai', newchitoseairport: 'Flughafen New Chitose' },
  pt: { tokyo: 'Tóquio', kyoto: 'Quioto', naritaairport: 'Aeroporto de Narita', kansaiairport: 'Aeroporto de Kansai', newchitoseairport: 'Aeroporto de New Chitose' },
  zh: { aomori: '青森', hachinohe: '八户', hirosaki: '弘前', shinhakodatehokuto: '新函馆北斗', asakusa: '浅草', kinugawaonsen: '鬼怒川温泉', nikko: '日光', atami: '热海', ito: '伊东', mishima: '三岛', shizuoka: '静冈', beppu: '别府', kokura: '小仓', oita: '大分', yufuin: '由布院', fukuoka: '福冈', hita: '日田', huistenbosch: '豪斯登堡', kagoshima: '鹿儿岛', kumamoto: '熊本', kurume: '久留米', nakatsu: '中津', saga: '佐贺', shinyamaguchi: '新山口', takeoonsen: '武雄温泉', hakodate: '函馆', noboribetsu: '登别', sapporo: '札幌', hiroshima: '广岛', fukuyama: '福山', himeji: '姬路', okayama: '冈山', onomichi: '尾道', kanazawa: '金泽', fukui: '福井', kagaonsen: '加贺温泉', komatsu: '小松', nagano: '长野', nanao: '七尾', toyama: '富山', tsuruga: '敦贺', ueda: '上田', kansaiairport: '关西机场', kyoto: '京都', osaka: '大阪', tennoji: '天王寺', fukuchiyama: '福知山', gifu: '岐阜', kinosaki: '城崎温泉', maibara: '米原', nagoya: '名古屋', wakayama: '和歌山', shinfuji: '新富士', morioka: '盛冈', akita: '秋田', shinhanamaki: '新花卷', karuizawa: '轻井泽', matsumoto: '松本', hamamatsu: '滨松', takayama: '高山', toyohashi: '丰桥', naritaairport: '成田机场', shinagawa: '品川', tokyo: '东京', yokohama: '横滨', niigata: '新潟', joetsumyoko: '上越妙高', murakami: '村上', nagaoka: '长冈', odawara: '小田原', kurashiki: '仓敷', matsue: '松江', yonago: '米子', kiitanabe: '纪伊田边', kobe: '神户', shirahama: '白滨', toyooka: '丰冈', asahikawa: '旭川', chitose: '千岁', kushiro: '钏路', newchitoseairport: '新千岁机场', obihiro: '带广', otaru: '小樽', shinsapporo: '新札幌', tomakomai: '苫小牧', wakkanai: '稚内', sendai: '仙台', fukushima: '福岛', ichinoseki: '一关', koriyama: '郡山', shinjuku: '新宿', hakone: '箱根', kawaguchiko: '河口湖', kofu: '甲府', otsuki: '大月', shinyokohama: '新横滨', gero: '下吕', hidafurukawa: '飞驒古川', mito: '水户', takasaki: '高崎', utsunomiya: '宇都宫', yamagata: '山形', nasushiobara: '那须盐原' }
};
const nm = (key, l) => (NAME[l] && NAME[l][key]) || DISPLAY[key];
const TRAIN_ZH = { Nozomi: '希望号', Hikari: '光号', Kodama: '回声号', Hayabusa: '隼号', Hayate: '疾风号', Komachi: '小町号', Yamabiko: '山彦号', Tsubasa: '翼号', Toki: '朱鹭号', Kagayaki: '光辉号', Hakutaka: '白鹰号', Asama: '浅间号', Tsurugi: '剑号', Sakura: '樱花号', Mizuho: '瑞穗号', Tsubame: '燕子号', Nasuno: '那须野号', Haruka: '遥号', 'Narita Express': '成田特快', Romancecar: '浪漫特快', Thunderbird: '雷鸟号', Hida: '飞驒号', Shinano: '信浓号', Azusa: '梓号', Kaiji: '甲斐路号', Odoriko: '踊子号', 'Saphir Odoriko': '蓝宝石踊子号', Sonic: '音速号', Kamui: '神威号', Suzuran: '铃兰号', Ozora: '大空号', Tokachi: '十胜号', Soya: '宗谷号', Hokuto: '北斗号', Yakumo: '八云号', Kuroshio: '黑潮号', Kounotori: '鹳号', Hashidate: '桥立号', Kinosaki: '城崎号', Shirasagi: '白鹭号', Inaho: '稻穗号', Shirayuki: '白雪号', Hitachi: '常陆号', Tokiwa: '常磐号', Tsugaru: '津轻号', Yufu: '由布号', 'Yufuin no Mori': '由布院之森号', 'Huis Ten Bosch': '豪斯登堡号', 'Nichirin Seagaia': '日轮海洋号', 'Noto Kagaribi': '能登篝火号', 'Airport Rapid': '机场快速', 'Revaty Aizu': 'Revaty 会津号', 'Revaty Kinu': 'Revaty 鬼怒号', 'Revaty Kegon': 'Revaty 华严号', 'SPACIA X': 'SPACIA X', Kegon: '华严号' };
const tz = x => TRAIN_ZH[x] || x;
const PRIVATE = { Tobu: ['Revaty Aizu', 'Revaty Kinu', 'Revaty Kegon', 'SPACIA X', 'Kegon'], Odakyu: ['Romancecar'] };
const OP_ZH = { Tobu: '东武铁道', Odakyu: '小田急电铁' };
const operatorOf = t => Object.keys(PRIVATE).find(o => PRIVATE[o].includes(t)) || null;

// ── frase por ciudad ──
const REGION = {
  de: r => 'in der Region ' + r, pt: r => 'na região de ' + r,
  zh: r => ({ Tohoku: '东北地区', Hokkaido: '北海道', Kanto: '关东地区', Chubu: '中部地区', Kyushu: '九州', Chugoku: '日本中国地区', Kansai: '关西地区', Hokuriku: '北陆地区' }[r] || r)
};
const TAG = {
  de: { onsen: 'ein Thermalbadeort', castle: 'eine Burgstadt', port: 'eine Hafenstadt', city: 'eine Stadt', hub: 'ein wichtiger Bahnknoten', airport: 'der Halt für den Flughafen', mountain: 'ein Ziel in den Bergen', historic: 'ein historischer Ort', gateway: 'ein Tor zur Region', snow: 'ein Ort im Schneeland', coast: 'ein Küstenort', themepark: 'ein Ziel mit Freizeitpark' },
  pt: { onsen: 'uma estância termal', castle: 'uma cidade com castelo', port: 'uma cidade portuária', city: 'uma cidade', hub: 'um importante nó ferroviário', airport: 'a paragem do aeroporto', mountain: 'um destino de montanha', historic: 'uma localidade histórica', gateway: 'uma porta de entrada para a região', snow: 'uma localidade da região da neve', coast: 'uma localidade costeira', themepark: 'um destino com parque temático' },
  zh: { onsen: '温泉小镇', castle: '有城堡的城市', port: '港口城市', city: '城市', hub: '重要的铁路枢纽', airport: '机场门户', mountain: '山区目的地', historic: '历史小城', gateway: '通往该地区的门户', snow: '雪国小镇', coast: '海滨小镇', themepark: '主题乐园所在地' }
};
const SIGHT = {
  'the Nebuta festival': ['dem Nebuta-Fest', 'o festival Nebuta', '睡魔祭'], 'Sensō-ji': ['dem Tempel Sensō-ji', 'o templo Sensō-ji', '浅草寺'],
  'Tōshō-gū': ['dem Schrein Tōshō-gū', 'o santuário Tōshō-gū', '东照宫'], Sakurajima: ['dem Vulkan Sakurajima', 'o vulcão Sakurajima', '樱岛'],
  'Kumamoto Castle': ['der Burg Kumamoto', 'o Castelo de Kumamoto', '熊本城'], 'the Peace Memorial Park': ['dem Friedenspark', 'o Parque Memorial da Paz', '和平纪念公园'],
  'Himeji Castle': ['der Burg Himeji', 'o Castelo de Himeji', '姬路城'], Korakuen: ['dem Garten Korakuen', 'o jardim Korakuen', '后乐园'],
  'Kenroku-en': ['dem Garten Kenroku-en', 'o jardim Kenroku-en', '兼六园'], 'Eihei-ji': ['dem Tempel Eihei-ji', 'o templo Eihei-ji', '永平寺'],
  'Zenkō-ji': ['dem Tempel Zenkō-ji', 'o templo Zenkō-ji', '善光寺'], 'Nagoya Castle': ['der Burg Nagoya', 'o Castelo de Nagoya', '名古屋城'],
  'Wakayama Castle': ['der Burg Wakayama', 'o Castelo de Wakayama', '和歌山城'], 'Mount Fuji': ['dem Fuji', 'o monte Fuji', '富士山'],
  'Matsumoto Castle': ['der Burg Matsumoto', 'o Castelo de Matsumoto', '松本城'], 'the Bikan district': ['dem Bikan-Viertel', 'o bairro de Bikan', '美观地区'],
  'Matsue Castle': ['der Burg Matsue', 'o Castelo de Matsue', '松江城'], 'the Kumano Kodo': ['dem Kumano Kodo', 'o Kumano Kodo', '熊野古道'],
  'Asahiyama Zoo': ['dem Asahiyama-Zoo', 'o Jardim Zoológico de Asahiyama', '旭山动物园'], 'Matsushima Bay': ['der Bucht von Matsushima', 'a baía de Matsushima', '松岛湾'],
  'Lake Ashi': ['dem Ashi-See', 'o lago Ashi', '芦之湖'], Kairakuen: ['dem Garten Kairakuen', 'o jardim Kairakuen', '偕乐园']
};
function cityLine(key, l) {
  const [region, tag, sight0] = META[key];
  const s = sight0 && SIGHT[sight0] ? SIGHT[sight0][{ de: 0, pt: 1, zh: 2 }[l]] : null;
  if (sight0 && !s) throw new Error('Falta traducción del lugar: ' + sight0);
  const n = nm(key, l);
  if (l === 'zh') return `${n}是${REGION.zh(region)}的${TAG.zh[tag]}${s ? '，以' + s + '闻名' : ''}。`;
  if (l === 'de') return `${n} ist ${TAG.de[tag]} ${REGION.de(region)}${s ? ' mit ' + s : ''}.`;
  return `${n} é ${TAG.pt[tag]} ${REGION.pt(region)}${s ? ', com ' + s : ''}.`;
}

// ── duraciones ──
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

// consejo propio de las 15 rutas más visitadas (las mismas que tienen versión zh escrita a mano)
const TOP_TIP = {
  'tokyo-kyoto': ['Auf dem Weg nach Kyoto siehst du bei gutem Wetter vom Fensterplatz rechts (Platz E) den Fuji.', 'A caminho de Quioto, com bom tempo, vê-se o monte Fuji do lugar à janela do lado direito (lugar E).'],
  'tokyo-osaka': ['Der Tokaido-Shinkansen endet in Shin-Osaka; zum Bahnhof Osaka ist es eine Station mit der JR-Kyoto-Linie.', 'O Shinkansen Tokaido termina em Shin-Osaka; a estação de Osaka fica a uma paragem na linha JR Kyoto.'],
  'osaka-kyoto': ['Ab dem Bahnhof Osaka fährt der JR Special Rapid in etwa 30 Minuten nach Kyoto, günstiger und ohne Reservierung.', 'Da estação de Osaka, o JR Special Rapid chega a Quioto em cerca de 30 minutos, mais barato e sem reserva.'],
  'kyoto-hiroshima': ['Nach Miyajima: mit der JR-Sanyo-Linie bis Miyajimaguchi (etwa 30 Minuten), dann mit der Fähre (etwa 10 Minuten).', 'Para Miyajima: linha JR Sanyo até Miyajimaguchi (cerca de 30 minutos) e depois o ferry (cerca de 10 minutos).'],
  'narita-tokyo': ['Der Narita Express fährt ohne Umsteigen weiter nach Shinagawa, Shinjuku und Yokohama; alle Plätze sind reserviert.', 'O Narita Express continua sem mudança para Shinagawa, Shinjuku e Yokohama; todos os lugares são reservados.'],
  'tokyo-nagoya': ['Nagoya ist der Umsteigepunkt nach Takayama, Shirakawa-go und Ise.', 'Nagoya é o ponto de ligação para Takayama, Shirakawa-go e Ise.'],
  'osaka-hiroshima': ['Den Friedenspark erreichst du vom Bahnhof Hiroshima mit der Straßenbahn.', 'Chega-se ao Parque Memorial da Paz a partir da estação de Hiroshima de elétrico.'],
  'shinjuku-hakone': ['Der Hakone Free Pass deckt die Odakyu-Linie und den Nahverkehr in Hakone ab, für den Romancecar zahlst du aber einen Zuschlag.', 'O Hakone Free Pass cobre a linha Odakyu e os transportes de Hakone, mas o Romancecar tem um suplemento.'],
  'tokyo-kanazawa': ['Im Kagayaki sind alle Plätze reserviert: Buche in der Hauptsaison früh.', 'No Kagayaki todos os lugares são reservados: reserve cedo na época alta.'],
  'osaka-fukuoka': ['Der Shinkansen-Bahnhof in Fukuoka heißt Hakata und liegt nah am Zentrum und am Flughafen.', 'A estação do Shinkansen em Fukuoka chama-se Hakata e fica perto do centro e do aeroporto.'],
  'hiroshima-fukuoka': ['Für weitere Ziele in Kyushu steigst du in Hakata in den Kyushu-Shinkansen um.', 'Para outros destinos em Kyushu, mude em Hakata para o Shinkansen de Kyushu.'],
  'nagoya-takayama': ['Der Hida fährt durch das Tal des Hida-Flusses: Wähle für die Aussicht einen Fensterplatz.', 'O Hida percorre o vale do rio Hida: escolha um lugar à janela para a paisagem.'],
  'kansai-airport-kyoto': ['Im Haruka gibt es Platz für Gepäck; in der Hauptsaison lohnt sich ein reservierter Platz.', 'O Haruka tem espaço para bagagem; na época alta compensa reservar lugar.'],
  'kansai-airport-osaka': ['Der Haruka hält unterwegs in Tennoji und fährt dann nach Shin-Osaka.', 'O Haruka para em Tennoji pelo caminho e segue depois para Shin-Osaka.'],
  'tokyo-sendai': ['Im Hayabusa sind alle Plätze reserviert: Buche im Voraus.', 'No Hayabusa todos os lugares são reservados: reserve com antecedência.']
};

const UI = {
  de: { back: 'Alle Strecken', badge: 'Streckenführer · Japan', meta: 'Von WoW Train · Aktualisiert im November 2026 · 4 Min. Lesezeit', btn: 'Ticket buchen',
    cta: (a, b) => `Fahrzeiten prüfen und <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> auf Klook buchen`,
    sub: 'Live-Fahrplan für dein Datum · Preise ändern sich täglich', facts: 'Das Wichtigste', choose: 'Welchen Zug nehmen', tips: 'Tipps vor der Reise',
    faq: 'Häufige Fragen', more: 'Weitere Zugstrecken in Japan', ready: 'Bereit zur Abfahrt? Sieh dir Fahrzeiten und Preise für dein Datum an und buche deinen Platz auf Klook.', note: 'Öffnet sich in einem neuen Tab', cmp: 'Fahrzeiten und Preise vergleichen:', check: 'Fahrpläne ansehen',
    home: 'Startseite', routes: 'Strecken', hotel: 'Wo übernachten', country: 'Japan', sep: ', ', hbtn: 'Aktuellen Preis ansehen →', hbk: 'Auf Booking.com vergleichen →',
    footer: '<a href="/blog.html">Blog</a> · <a href="/about.html">Über uns</a> · <a href="/privacy.html">Datenschutz</a> · <a href="/terms.html">Nutzungsbedingungen</a>' },
  pt: { back: 'Todas as rotas', badge: 'Guia de rota · Japão', meta: 'Por WoW Train · Atualizado em novembro de 2026 · 4 min de leitura', btn: 'Reservar',
    cta: (a, b) => `Consulte os horários e reserve <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> na Klook`,
    sub: 'Horário em tempo real para a sua data · os preços mudam todos os dias', facts: 'Dados essenciais', choose: 'Que comboio escolher', tips: 'Conselhos antes de partir',
    faq: 'Perguntas frequentes', more: 'Mais rotas de comboio no Japão', ready: 'Pronto para partir? Veja os horários e os preços para a sua data e reserve o seu lugar na Klook.', note: 'Abre num novo separador', cmp: 'Compare horários e preços:', check: 'Ver horários',
    home: 'Início', routes: 'Rotas', hotel: 'Onde ficar', country: 'Japão', sep: ', ', hbtn: 'Ver preço atual →', hbk: 'Comparar no Booking.com →',
    footer: '<a href="/blog.html">Blog</a> · <a href="/about.html">Sobre nós</a> · <a href="/privacy.html">Privacidade</a> · <a href="/terms.html">Termos</a>' },
  zh: { back: '全部线路', badge: '线路指南 · 日本', meta: 'WoW Train · 2026 年 11 月更新 · 阅读约 4 分钟', btn: '订票',
    cta: (a, b) => `查看 <span class="klook-cta-city">${a}</span> &rarr; <span class="klook-cta-city">${b}</span> 的时刻并在 Klook 预订`,
    sub: '显示所选日期的实时时刻 · 票价每天变化', facts: '基本信息', choose: '选哪趟车', tips: '出发前须知',
    faq: '常见问题', more: '日本更多火车线路', ready: '准备出发了吗？在 Klook 查看你所选日期的时刻和票价并预订座位。', note: '在新标签页中打开', cmp: '比较时刻和票价：', check: '查看时刻',
    home: '首页', routes: '线路', hotel: '住宿推荐', country: '日本', sep: '・', hbtn: '查看当前价格 →', hbk: '在 Booking.com 比较 →',
    footer: '<a href="/blog.html">博客</a> · <a href="/about.html">关于我们</a> · <a href="/privacy.html">隐私政策</a> · <a href="/terms.html">使用条款</a>' }
};

function content(r, l) {
  const d = row(r);
  if (!d) throw new Error('Sin datos de Klook: ' + r.slug);
  const a = k(r.fromKey), b = k(r.toKey), m = d.m, s = d.s, t = d.t, T1 = t[0] || null;
  const A = nm(a, l), B = nm(b, l), S = dur(m, l), L = dur(m, l, true);
  const nozomi = t.some(x => x === 'Nozomi' || x === 'Mizuho'), op = t.map(operatorOf).find(Boolean) || null;
  const airport = isAirport(a) || isAirport(b);
  const tip0 = TOP_TIP[r.slug] && l !== 'zh' ? [TOP_TIP[r.slug][l === 'de' ? 0 : 1]] : [];
  const o = { A, B };
  if (l === 'de') {
    const von = (isAirport(a) ? 'vom ' : 'von ') + A, nach = (isAirport(b) ? 'zum ' : 'nach ') + B;
    const st = x => isAirport(x) ? nm(x, 'de') : 'Bahnhof ' + nm(x, 'de');
    const svc = T1 ? ' mit dem ' + (s ? 'Shinkansen ' : '') + T1 : '';
    o.title = `Zug ${von} ${nach}: ${S}${svc}`;
    o.desc = `Mit dem Zug ${von} ${nach} in etwa ${S}${T1 ? ' mit dem ' + T1 : ''}. Direktverbindung, Bahnhöfe und Buchung bei Klook.`;
    o.lead = `Der schnellste Zug ${von} ${nach} braucht etwa ${L}${svc ? ',' + svc : ''}. Es ist eine Direktverbindung ohne Umsteigen. ${cityLine(b, l)}`;
    o.facts = [`Schnellste Fahrt: etwa ${S}${T1 ? ' (' + T1 + ')' : ''}.`, t.length ? `Züge auf dieser Strecke: ${t.join(', ')}.` : 'Häufige Verbindungen tagsüber.', `Bahnhöfe: ${st(a)} → ${st(b)}.`, 'Direkt, ohne Umsteigen.'];
    o.choose = nozomi ? `Der ${T1} ist die schnellste Option auf dieser Strecke. Der Japan Rail Pass gilt nicht für den Nozomi und den Mizuho; mit dem Pass nimmst du die anderen Shinkansen der Linie, die etwas länger brauchen.`
      : op ? `Diese Strecke wird von ${op} betrieben, einer privaten Bahngesellschaft, daher gilt der Japan Rail Pass hier nicht. Es ist eine bequeme Direktverbindung; prüfe bei der Buchung die Reservierungsregeln für dein Datum.`
      : s ? `Nimm den ${T1 || 'Shinkansen'} für die kürzeste Fahrt${t[1] ? '; der ' + t[1] + ' ist eine Alternative' : ''}. Shinkansen sind JR-Züge, für die der Japan Rail Pass in der Regel gilt (außer Nozomi und Mizuho); prüfe die Bedingungen deines Passes.`
      : `${T1 ? 'Der ' + T1 + ' ist die schnellste Direktverbindung' : 'Auf dieser Strecke gibt es eine Direktverbindung'}${t[1] ? ', und der ' + t[1] + ' ist eine Alternative' : ''}. Es sind JR-Züge, für die der Japan Rail Pass in der Regel gilt; prüfe die Bedingungen deines Passes und die Platzregeln für dein Datum.`;
    const third = s ? 'Koffer mit einer Gesamtgröße zwischen 160 und 250 cm brauchen einen reservierten Platz mit Stauraum für Übergepäck.'
      : airport ? 'Wenn du vor der Landung buchst, sparst du nach dem Flug Zeit am Schalter.'
      : 'In Stoßzeiten (Golden Week, Sommerferien, Kirschblütenzeit) ist ein reservierter Platz die sichere Wahl.';
    o.tips = [...tip0, cityLine(a, l), third, 'Prüfe den Live-Fahrplan für dein Datum: Abfahrtszeiten und Züge ändern sich je nach Wochentag und Saison.'];
    const jr = nozomi ? 'Er gilt für die anderen Shinkansen der Linie, aber nicht für den Nozomi und den Mizuho.' : op ? `Nein. Die Strecke wird von ${op} betrieben, einer privaten Bahngesellschaft.` : 'In der Regel ja: Es sind JR-Züge, für die der Pass gilt (außer Nozomi und Mizuho). Prüfe die Bedingungen deines Passes.';
    o.faqs = [[`Wie lange dauert die Zugfahrt ${von} ${nach}?`, `Der schnellste Direktzug braucht etwa ${L}${T1 ? ' (' + T1 + ')' : ''}.`], [`Gibt es einen Direktzug ${von} ${nach}?`, 'Ja, es gibt Direktverbindungen ohne Umsteigen.'], [`Gilt der Japan Rail Pass auf der Strecke ${von} ${nach}?`, jr],
      [`Wie komme ich mit dem Zug ${von} ${nach}?`, 'Die Angaben auf dieser Seite zeigen dir den Zug und die wichtigsten Halte. Prüfe vor der Reise die Fahrzeiten und die Verfügbarkeit für dein Datum auf Klook.'],
      [`Kann man ${von} ${nach} mit dem Zug fahren?`, 'Ja, diese Strecke wird mit dem Zug bedient. Manche Verbindungen können einen Umstieg haben, also prüfe vor der Buchung die Details deines Zuges.'],
      [`Wann fahren die Züge ${von} ${nach}?`, 'Die Abfahrtszeiten ändern sich je nach Tag und Saison. Suche dein Datum, um die verfügbaren Abfahrten und die Fahrzeit jedes Zuges zu sehen.'],
      ['Von welchem Bahnhof fahre ich ab und wo komme ich an?', 'Das hängt vom Zug ab. Große japanische Städte haben oft mehrere Bahnhöfe, also prüfe vor der Fahrt die Abfahrts- und Ankunftsbahnhöfe auf deinem Ticket.'],
      [`Muss ich im Zug ${von} ${nach} einen Platz reservieren?`, 'Manche Züge haben nur reservierte Plätze, andere auch Wagen ohne Reservierung. Prüfe die Platzregeln deines Zuges, vor allem an verkehrsreichen Reisetagen.'],
      [`Kann ich den Zug ${von} ${nach} online mit dem Handy buchen?`, 'Wo Tickets online angeboten werden, kannst du sie über Klook mit dem Handy buchen. Züge, die nicht online verkauft werden, kannst du am Bahnhof kaufen; prüfe die Möglichkeiten für dein Datum.'],
      ['Wie früh sollte ich am Bahnhof sein?', 'Züge in Japan fahren pünktlich ab, also plane genug Zeit ein, um deinen Bahnsteig zu finden. Große Bahnhöfe wie Tokio oder Osaka sind weitläufig, dort brauchst du mehr Zeit.']];
  } else if (l === 'pt') {
    const de = (isAirport(a) ? 'do ' : 'de ') + A, para = 'para ' + (isAirport(b) ? 'o ' : '') + B;
    const st = x => isAirport(x) ? nm(x, 'pt') : 'Estação de ' + nm(x, 'pt');
    const svc = T1 ? ' com o ' + (s ? 'Shinkansen ' : '') + T1 : '';
    o.title = `Comboio ${de} ${para}: ${S}${T1 ? (s ? ' no Shinkansen ' : ' no ') + T1 : ''}`;
    o.desc = `${de.charAt(0).toUpperCase() + de.slice(1)} ${para} de comboio em cerca de ${S}${T1 ? ' com o ' + T1 : ''}. Serviço direto, estações e como reservar na Klook.`;
    o.lead = `O comboio mais rápido ${de} ${para} demora cerca de ${L}${svc ? ',' + svc : ''}. É um serviço direto, sem mudança de comboio. ${cityLine(b, l)}`;
    o.facts = [`Viagem mais rápida: cerca de ${S}${T1 ? ' (' + T1 + ')' : ''}.`, t.length ? `Serviços nesta rota: ${t.join(', ')}.` : 'Serviços frequentes durante o dia.', `Estações: ${st(a)} → ${st(b)}.`, 'Direto, sem mudança de comboio.'];
    o.choose = nozomi ? `O ${T1} é a opção mais rápida nesta rota. O Japan Rail Pass não cobre o Nozomi nem o Mizuho; se viajar com o passe, use os outros Shinkansen da linha, que demoram um pouco mais.`
      : op ? `Esta rota é operada pela ${op}, uma companhia ferroviária privada, por isso o Japan Rail Pass não a cobre. É um serviço direto e confortável; confirme as regras de reserva de lugar para a sua data ao reservar.`
      : s ? `Apanhe o ${T1 || 'Shinkansen'} para a viagem mais curta${t[1] ? '; o ' + t[1] + ' é uma alternativa' : ''}. Os Shinkansen são comboios JR, que o Japan Rail Pass normalmente cobre (exceto o Nozomi e o Mizuho); confirme as condições do seu passe.`
      : `${T1 ? 'O ' + T1 + ' é o serviço direto mais rápido' : 'Há um serviço direto nesta rota'}${t[1] ? ', e o ' + t[1] + ' é uma alternativa' : ''}. São comboios JR, que o Japan Rail Pass normalmente cobre; confirme as condições do seu passe e as regras de lugar para a sua data.`;
    const third = s ? 'As malas com dimensão total entre 160 e 250 cm precisam de um lugar reservado com espaço para bagagem volumosa.'
      : airport ? 'Reservar antes de aterrar poupa tempo nas bilheteiras depois do voo.'
      : 'Em épocas de muita procura (Golden Week, férias de verão, época das cerejeiras em flor), o lugar reservado é a opção segura.';
    o.tips = [...tip0, cityLine(a, l), third, 'Consulte o horário em tempo real para a sua data: as partidas e os serviços variam consoante o dia da semana e a época do ano.'];
    const jr = nozomi ? 'Cobre os outros Shinkansen da linha, mas não o Nozomi nem o Mizuho.' : op ? `Não. A rota é operada pela ${op}, uma companhia privada.` : 'Em geral, sim: são comboios JR, que o passe cobre (exceto o Nozomi e o Mizuho). Confirme as condições do seu passe.';
    o.faqs = [[`Quanto tempo demora o comboio ${de} ${para}?`, `O comboio direto mais rápido demora cerca de ${L}${T1 ? ' (' + T1 + ')' : ''}.`], [`Há comboio direto ${de} ${para}?`, 'Sim, há serviços diretos, sem mudança de comboio.'], [`O Japan Rail Pass cobre a viagem ${de} ${para}?`, jr],
      [`Como ir ${de} ${para} de comboio?`, 'Os dados desta página mostram o serviço e as principais paragens. Antes de viajar, confirme os horários e a disponibilidade para a sua data na Klook.'],
      [`É possível ir ${de} ${para} de comboio?`, 'Sim, esta rota é servida por comboio. Algumas viagens podem incluir uma mudança, por isso confirme os detalhes do serviço escolhido antes de reservar.'],
      [`A que horas há comboios ${de} ${para}?`, 'Os horários variam consoante o dia e a época. Pesquise a sua data para ver as partidas disponíveis e a duração de cada serviço.'],
      ['De que estação parto e a que estação chego?', 'Depende do serviço. As grandes cidades japonesas podem ter várias estações, por isso confirme as estações de partida e de chegada indicadas no seu bilhete antes de ir.'],
      [`Preciso de reservar lugar no comboio ${de} ${para}?`, 'Alguns serviços só têm lugares reservados e outros têm carruagens sem reserva. Confirme as regras de lugar do serviço escolhido, sobretudo em dias de muito movimento.'],
      [`Posso reservar o comboio ${de} ${para} online pelo telemóvel?`, 'Quando os bilhetes são vendidos online, pode reservá-los pelo telemóvel através da Klook. Para os serviços que não se vendem online, pode comprar na estação; veja as opções para a sua data.'],
      ['Com quanta antecedência devo chegar à estação?', 'Os comboios no Japão partem à hora certa, por isso chegue com tempo suficiente para encontrar a plataforma. Estações grandes como Tóquio ou Osaka são enormes, por isso conte com mais tempo.']];
  } else {
    const kind = s ? '新干线' : '特急', T = T1 ? tz(T1) : null, tt = t.map(tz);
    const st = x => isAirport(x) ? nm(x, 'zh') : nm(x, 'zh') + '站';
    const opz = op ? OP_ZH[op] : null;
    o.title = `${A}到${B}火车：${kind}${T || ''}最快${S}`;
    o.desc = `从${A}到${B}乘${kind}最快约${S}，直达不用换车。车次、车站、实用建议和 Klook 订票方法。`;
    o.lead = `从${A}到${B}的最快列车约${L}${T ? '，乘' + (s ? '新干线' : '') + T : ''}。直达，不用换车。${cityLine(b, l)}`;
    o.facts = [`最快行程：约${S}${T ? '（' + T + '）' : ''}`, t.length ? `这条线路的列车：${tt.join('、')}` : '白天车次很多', `车站：${st(a)} → ${st(b)}`, '直达，不用换车。'];
    o.choose = nozomi ? `${T}是这条线路最快的选择。注意 JR Pass（日本铁路通票）不能乘坐希望号和瑞穗号；持通票出行时，请选择同一线路的其他新干线，用时稍长。`
      : op ? `这条线路由私铁${opz}运营，JR Pass 不能使用。直达，乘坐舒适；订票时请确认所选日期的座位规定。`
      : s ? `想最快到达就坐${T || '新干线'}${t[1] ? '，也可以选' + tt[1] : ''}。新干线属于 JR，JR Pass 一般可以使用（希望号和瑞穗号除外），请确认你的通票条件。`
      : `${T ? T + '是最快的直达列车' : '这条线路有直达列车'}${t[1] ? '，也可以选' + tt[1] : ''}。这些是 JR 列车，JR Pass 一般可以使用；请确认你的通票条件和所选日期的座位规定。`;
    const third = s ? '三边之和 160–250 厘米的大件行李，需要预订带大件行李空间的座位。' : airport ? '落地前先订好票，下飞机后不用在售票处排队。' : '黄金周、暑假和樱花季等高峰期，建议预订对号座。';
    o.tips = [cityLine(a, l), third, '请查看所选日期的实时时刻：发车时间和车次会因星期和季节而变化。'];
    const jr = nozomi ? '可以乘坐同一线路的其他新干线，但希望号和瑞穗号除外。' : op ? `不可以。这条线路由私铁${opz}运营。` : '一般可以：这些是 JR 列车，在通票范围内（希望号和瑞穗号除外）。请确认你的通票条件。';
    o.faqs = [[`从${A}到${B}坐火车要多久？`, `最快的直达列车约${L}${T ? '（' + T + '）' : ''}。`], [`${A}到${B}有直达火车吗？`, '有，直达列车不用换车。'], [`JR Pass 可以坐${A}到${B}吗？`, jr],
      [`怎样坐火车从${A}到${B}？`, '本页列出了车次和主要车站。出发前请在 Klook 查看所选日期的时刻和余票。'],
      [`${A}到${B}可以坐火车吗？`, '可以，这条线路有火车。部分行程可能需要换车，订票前请看清所选车次的详情。'],
      [`${A}到${B}的火车几点发车？`, '发车时间因日期和季节而不同。搜索你的出行日期，就能看到当天的车次和每趟车的用时。'],
      ['从哪个车站出发、到哪个车站？', '取决于车次。日本的大城市往往有好几个车站，出发前请确认车票上的出发站和到达站。'],
      [`${A}到${B}的火车需要订座吗？`, '有的车次全车对号入座，有的设有自由席车厢。请确认所选车次的座位规定，出行高峰日尤其要注意。'],
      [`可以用手机在网上订${A}到${B}的火车票吗？`, '网上有售的车票，可以通过 Klook 用手机预订。不在网上销售的车次，可以在车站购买；请查看所选日期的购票方式。'],
      ['应该提前多久到车站？', '日本的列车准点发车，请留出足够时间找到站台。东京、大阪等大车站很大，要多预留一些时间。']];
  }
  return o;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const API = 'https://voxa-production-dc15.up.railway.app/affiliate';
function hotelHtml(r, l, B) {
  const p = file(r.slug, 'en');
  if (!fs.existsSync(p)) return '';
  const en = fs.readFileSync(p, 'utf8'), i = en.indexOf('<div class="hotel-card">');
  if (i < 0) return '';
  const blk = en.slice(i, en.indexOf('</div>\n    </div>', i));
  const img = (blk.match(/hotel-card-image" src="([^"]+)"/) || [])[1], name = (blk.match(/hotel-card-name">([^<]+)</) || [])[1];
  const city = (blk.match(/klook-hotel\?city=([^"&\s]+)/) || [])[1];
  if (!img || !name || !city) return '';
  const u = UI[l];
  return `
    <h2>${u.hotel}</h2>
    <div class="hotel-card">
      <div class="hotel-card-header">
        <img class="hotel-card-image" src="${img}" alt="${name}" loading="lazy">
        <div class="hotel-card-info">
          <div class="hotel-card-name">${name}</div>
          <div class="hotel-card-location">${esc(B)}${u.sep}${u.country}</div>
        </div>
      </div>
      <div class="hotel-card-actions">
        <a href="${API}/klook-hotel?city=${city}" class="cta-btn" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('hotel_${r.slug}_${l}')">${u.hbtn}</a>
        <br>
        <a href="${API}/booking-hotel?city=${city}" class="economic-link" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('hotel_booking_${r.slug}_${l}')">${u.hbk}</a>
      </div>
    </div>
`;
}

const template = fs.readFileSync(path.join(__dirname, 'route-template.html'), 'utf8').replace('<script src="/assets/js/omio-bridge.js?v=12" defer></script>', '<script src="/assets/js/lang-chip.js?v=1" defer></script>');
const head = template.slice(0, template.indexOf('<main>'));
const tail = template.slice(template.indexOf('</main>') + '</main>'.length);
const BY_SLUG = Object.fromEntries(ROUTES.map(r => [r.slug, r]));

function render(r, l) {
  const o = content(r, l), u = UI[l];
  const planned = RELATED[r.slug] && RELATED[r.slug].map(s => BY_SLUG[s]).filter(Boolean);
  const shares = x => [x.fromKey, x.toKey].some(q => q === r.fromKey || q === r.toKey);
  const others = ROUTES.filter(x => x.slug !== r.slug);
  const relList = (planned && planned.length ? planned : others.filter(shares).concat(others.filter(x => !shares(x))).slice(0, 6));
  const related = relList.map(x => { const c = content(x, l); return `<a href="/rutas/${x.slug}/${l}/" class="related-link">${esc(c.A)} &rarr; ${esc(c.B)}</a>`; }).join('\n        ');
  const book = `${API}/klook-train?from=${r.fromKey}&to=${r.toKey}`;
  const li = a => a.map(x => `<li>${esc(x)}</li>`).join('\n      ');
  const main = `<main>
    <p class="lead">${esc(o.lead)}</p>

    <a href="${book}" class="klook-cta" target="_blank" rel="noopener sponsored"
       onclick="gtag('event','klook_click',{source:'cta_block',route:'${r.slug}',lang:'${l}'});">
      <img class="klook-cta-logo" src="https://www.google.com/s2/favicons?sz=64&domain=klook.com" alt="Klook" loading="lazy">
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
  const hero = `https://images.pexels.com/photos/${r.photo}/pexels-photo-${r.photo}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
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
const ZH_HAND = new Set(['tokyo-kyoto', 'tokyo-osaka', 'osaka-kyoto', 'kyoto-hiroshima', 'narita-tokyo', 'tokyo-nagoya', 'osaka-hiroshima', 'shinjuku-hakone', 'tokyo-kanazawa', 'osaka-fukuoka', 'hiroshima-fukuoka', 'nagoya-takayama', 'kansai-airport-kyoto', 'kansai-airport-osaka', 'tokyo-sendai']);
const newUrls = [];
let n = 0;
for (const r of ROUTES) {
  for (const l of LANGS) {
    if (l === 'zh' && ZH_HAND.has(r.slug)) continue;
    const p = file(r.slug, l);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, render(r, l));
    newUrls.push(url(r.slug, l)); n++;
  }
}
console.log('Rutas de Japón:', ROUTES.length, '· páginas de/pt/zh escritas:', n);

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

// ── sitemap: cada versión de cada ruta con sus alternativas completas ──
const sm = path.join(ROOT, 'sitemap.xml');
let x = fs.readFileSync(sm, 'utf8');
const today = new Date().toISOString().slice(0, 10);
const jpLocs = new Set(ROUTES.flatMap(r => ALL.map(l => url(r.slug, l))));
const keep = {};
x = x.replace(/  <url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>\n/g, (b, loc) => {
  if (!jpLocs.has(loc)) return b;
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
fs.writeFileSync(path.join(__dirname, 'japan-i18n-urls.txt'), newUrls.join('\n') + '\n');
console.log('Sitemap: rutas de Japón reescritas con hreflang de 8 idiomas');
