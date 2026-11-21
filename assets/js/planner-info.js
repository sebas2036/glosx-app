/*
 * Rellena la tarjeta compacta del planificador cuando el par de ciudades es conocido (sin llamar a la IA):
 * duración y precio orientativos por medio de transporte (tren, bus, vuelo, ferry) y acceso a la guía de la ruta.
 * Datos: assets/data/pair-data.json (catálogo de productos de Omio; duración aproximada, no la del tren
 * más rápido). Reusa los estilos .rp-* de route-premium.css.
 */
(function () {
  'use strict';

  var L10N = {
    en: { opts: 'Travel options', train: 'Train', bus: 'Bus', flight: 'Flight', ferry: 'Ferry', h: ' h ', m: ' min', note: 'Approximate typical journey times and low-fare prices based on Omio data. Final prices depend on date, operator and how early you book.', guide: 'See the full route guide' },
    es: { opts: 'Opciones de viaje', train: 'Tren', bus: 'Autobús', flight: 'Avión', ferry: 'Ferri', h: ' h ', m: ' min', note: 'Duraciones y precios orientativos según datos de Omio. El precio final depende de la fecha, el operador y la antelación de la compra.', guide: 'Ver la guía completa de la ruta' },
    fr: { opts: 'Options de voyage', train: 'Train', bus: 'Bus', flight: 'Avion', ferry: 'Ferry', h: ' h ', m: ' min', note: 'Durées et prix indicatifs d’après les données d’Omio. Le prix final dépend de la date, de l’opérateur et de l’avance de réservation.', guide: 'Voir le guide complet de la ligne' },
    it: { opts: 'Come viaggiare', train: 'Treno', bus: 'Autobus', flight: 'Aereo', ferry: 'Traghetto', h: ' h ', m: ' min', note: 'Durate e prezzi indicativi secondo i dati di Omio. Il prezzo finale dipende da data, operatore e anticipo di prenotazione.', guide: 'Vedi la guida completa del percorso' },
    de: { opts: 'Reiseoptionen', train: 'Zug', bus: 'Bus', flight: 'Flug', ferry: 'Fähre', h: ' Std. ', m: ' Min.', note: 'Ungefähre Fahrzeiten und Preise nach Omio-Daten. Der endgültige Preis hängt von Datum, Betreiber und Buchungszeitpunkt ab.', guide: 'Den ganzen Streckenführer ansehen' },
    pt: { opts: 'Opções de viagem', train: 'Comboio', bus: 'Autocarro', flight: 'Voo', ferry: 'Ferry', h: ' h ', m: ' min', note: 'Durações e preços indicativos segundo dados da Omio. O preço final depende da data, do operador e da antecedência da compra.', guide: 'Ver o guia completo da rota' },
    ja: { opts: '移動手段', train: '電車', bus: 'バス', flight: '飛行機', ferry: 'フェリー', h: '時間', m: '分', note: 'Omioのデータに基づくおおよその所要時間と料金の目安です。最終料金は日付、運行会社、予約時期によって変わります。', guide: 'ルートガイドを見る' },
    zh: { opts: '出行方式', train: '火车', bus: '巴士', flight: '飞机', ferry: '轮渡', h: '小时', m: '分', note: '根据 Omio 数据得出的大致行程时间和低价参考。最终价格取决于日期、运营商和预订时间。', guide: '查看完整线路指南' }
  };
  var ICON = {
    train: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l2-4M15 21l-2-4"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/></svg>',
    bus: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="15" rx="2.5"/><path d="M4 11h16M7 21v-3M17 21v-3"/><circle cx="8" cy="14.5" r=".6"/><circle cx="16" cy="14.5" r=".6"/></svg>',
    flight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12l18-8-5 17-4-7-9-2z"/><path d="M12 14l9-10"/></svg>',
    ferry: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15l2 4c1.5.8 3 .8 4.5 0 1.5.8 3 .8 4.5 0 1.5.8 3 .8 4.5 0l2-4-3-5H7z"/><path d="M12 3v7M9 6h6"/></svg>'
  };
  var MODES = ['train', 'bus', 'flight', 'ferry'];
  var data = null, loading = null;

  function lang() {
    var l = String(document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return L10N[l] ? l : 'en';
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function fmt(min, t) {
    var h = Math.floor(min / 60), m = min % 60;
    if (!h) return '≈ ' + m + t.m;
    if (!m) return '≈ ' + h + t.h.trim();
    return '≈ ' + h + t.h + String(m).padStart(t.m === '分' ? 1 : 2, '0') + t.m;
  }
  function fmtPrice(v, l) {
    return (l === 'en' || l === 'ja') ? '≈ €' + v : '≈ ' + v + ' €';
  }
  function load() {
    if (data) return Promise.resolve(data);
    if (!loading) loading = fetch('/assets/data/pair-data.json').then(function (r) { return r.json(); }).then(function (d) { data = d; return d; }).catch(function () { return null; });
    return loading;
  }
  function norm(slug) { return String(slug || '').toLowerCase().replace(/-(hbf|central|station|centrale|termini|ost|west)$/, ''); }
  function cityId(d, slug) { return d.c[slug] || d.c[norm(slug)]; }


  // Tarjeta "Guía de la ruta": foto de portada + qué trae la guía + primer tren y trenes directos al día cuando hay datos.
  // Datos: assets/data/route-cards.json (i = foto 400 px; f/r = [primer tren, trenes directos laborable] en el sentido del slug o al revés).
  var GC = {
    en: { eye: 'Route guide', sub: '{r}: timetable, stations, hotel and tips', meta: 'First train {f} · {n} direct trains a day' },
    es: { eye: 'Guía de la ruta', sub: '{r}: horarios, estaciones, hotel y consejos', meta: 'Primer tren {f} · {n} trenes directos al día' },
    fr: { eye: 'Guide du trajet', sub: '{r} : horaires, gares, hôtel et conseils', meta: 'Premier train {f} · {n} trains directs par jour' },
    it: { eye: 'Guida al percorso', sub: '{r}: orari, stazioni, hotel e consigli', meta: 'Primo treno {f} · {n} treni diretti al giorno' },
    de: { eye: 'Streckenführer', sub: '{r}: Fahrplan, Bahnhöfe, Hotel und Tipps', meta: 'Erster Zug {f} · {n} Direktzüge pro Tag' },
    pt: { eye: 'Guia da rota', sub: '{r}: horários, estações, hotel e dicas', meta: 'Primeiro comboio {f} · {n} comboios diretos por dia' },
    ja: { eye: 'ルートガイド', sub: '{r}：時刻表・駅・ホテル・旅のコツ', meta: '始発 {f}・直通 1日{n}本' },
    zh: { eye: '线路指南', sub: '{r}：时刻、车站、酒店和建议', meta: '首班 {f} · 每天 {n} 班直达' }
  };
  var cards = null;
  function loadCards() {
    if (!cards) cards = fetch('/assets/data/route-cards.json').then(function (r) { return r.json(); }).catch(function () { return {}; });
    return cards;
  }
  window.glosxGuideCard = function (href, route, fromSlug) {
    var l = lang(), t = GC[l] || GC.en;
    var m = String(href).match(/\/rutas\/([^\/]+)\//), slug = m ? m[1] : '';
    var a = document.createElement('a');
    a.className = 'pi-gcard';
    a.href = href;
    a.innerHTML = '<span class="pi-gcard-img" aria-hidden="true"></span><span class="pi-gcard-body"><span class="pi-gcard-eye">' + esc(t.eye) + '</span>' +
      '<span class="pi-gcard-title">' + esc(t.sub.replace('{r}', route)) + '</span><span class="pi-gcard-meta" hidden></span></span>' +
      '<span class="pi-gcard-arrow" aria-hidden="true">→</span>';
    a.addEventListener('click', function () { try { if (window.gtag) gtag('event', 'route_guide_card', { route: slug, lang: l }); } catch (e) {} });
    loadCards().then(function (d) {
      var c = d && d[slug];
      if (!c) return;
      if (c.i) {
        var img = new Image();
        img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.src = c.i;
        a.querySelector('.pi-gcard-img').appendChild(img);
      }
      var fwd = !fromSlug || slug.indexOf(String(fromSlug).toLowerCase().replace(/[^a-z]/g, '').slice(0, 4)) === 0;
      var h = fwd ? c.f : c.r;
      if (h) { var me = a.querySelector('.pi-gcard-meta'); me.textContent = t.meta.replace('{f}', h[0]).replace('{n}', h[1]); me.hidden = false; }
    });
    return a;
  };

  // Todas las páginas de ruta que existen (la lista de la portada solo trae las destacadas). Se regenera con scripts/update-guide-pages.py
  var ALL_GUIDES = new Set([/*GUIDES*/"alicante-madrid","amsterdam-berlin","amsterdam-bruges","amsterdam-brussels","amsterdam-cologne","aomori-hachinohe","aomori-hirosaki","aomori-shin-hakodate-hokuto","asakusa-kinugawa-onsen","asakusa-nikko","atami-ito","atami-mishima","atami-shizuoka","barcelona-girona","barcelona-lyon","barcelona-seville","barcelona-valencia","basel-lauterbrunnen","basel-paris","beijing-chengde","beijing-chengdu","beijing-chongqing","beijing-dalian","beijing-datong","beijing-guangzhou","beijing-guilin","beijing-hangzhou","beijing-harbin","beijing-hohhot","beijing-jinan","beijing-nanjing","beijing-qingdao","beijing-qinhuangdao","beijing-qufu","beijing-shanghai","beijing-shenyang","beijing-shijiazhuang","beijing-taian","beijing-taiyuan","beijing-tianjin","beijing-wuhan","beijing-xian","beijing-zhengzhou","beppu-kokura","beppu-oita","beppu-yufuin","berlin-hamburg","berlin-prague","bern-paris","bordeaux-lourdes","brno-vienna","brussels-bruges","brussels-paris","budapest-ljubljana","changsha-guilin","changsha-zhangjiajie","chengdu-chongqing","chengdu-guiyang","chengdu-kunming","chengdu-leshan","chongqing-guiyang","chongqing-kunming","chongqing-wuhan","cologne-brussels","copenhagen-prague","copenhagen-stockholm","dortmund-munich","florence-pisa","florence-siena","florence-venice","frankfurt-berlin","frankfurt-cologne","frankfurt-munich","frankfurt-paris","fukuoka-beppu","fukuoka-hita","fukuoka-huis-ten-bosch","fukuoka-kagoshima","fukuoka-kokura","fukuoka-kumamoto","fukuoka-kurume","fukuoka-nakatsu","fukuoka-oita","fukuoka-saga","fukuoka-shin-yamaguchi","fukuoka-takeo-onsen","fukuoka-yufuin","geneva-paris","geneva-zermatt","girona-figueres","graz-vienna","guangzhou-changsha","guangzhou-chongqing","guangzhou-guilin","guangzhou-hong-kong","guangzhou-kunming","guangzhou-nanning","guangzhou-shenzhen","guangzhou-wuhan","guangzhou-xiamen","guangzhou-zhuhai","guilin-kunming","guiyang-guilin","haikou-sanya","hakodate-noboribetsu","hakodate-sapporo","hakodate-shin-hakodate-hokuto","hangzhou-changsha","hangzhou-fuzhou","hangzhou-huangshan","hangzhou-ningbo","hangzhou-shaoxing","hangzhou-wenzhou","hangzhou-xiamen","harbin-changchun","hefei-huangshan","hiroshima-fukuoka","hiroshima-fukuyama","hiroshima-himeji","hiroshima-kokura","hiroshima-kumamoto","hiroshima-okayama","hiroshima-onomichi","hiroshima-shin-yamaguchi","huangshan-jingdezhen","innsbruck-vienna","interlaken-lauterbrunnen","interlaken-lucerne","jinan-qingdao","kanazawa-fukui","kanazawa-kaga-onsen","kanazawa-komatsu","kanazawa-nagano","kanazawa-nanao","kanazawa-toyama","kanazawa-tsuruga","kanazawa-ueda","kansai-airport-kyoto","kansai-airport-osaka","kansai-airport-tennoji","koblenz-mainz","kunming-dali","kunming-guiyang","kunming-lijiang","kyoto-fukuchiyama","kyoto-gifu","kyoto-himeji","kyoto-hiroshima","kyoto-kinosaki","kyoto-maibara","kyoto-nagoya","kyoto-okayama","kyoto-tsuruga","kyoto-wakayama","lanzhou-jiayuguan","lanzhou-xining","lanzhou-zhangye","lisbon-faro","lisbon-porto","ljubljana-graz","ljubljana-munich","ljubljana-salzburg","ljubljana-vienna","london-amsterdam","london-brussels","london-cambridge","london-edinburgh","london-liverpool","london-manchester","london-oxford","london-paris","london-york","lucerne-bern","lucerne-zermatt","lyon-marseille","lyon-turin","madrid-barcelona","madrid-cordoba","madrid-granada","madrid-malaga","madrid-salamanca","madrid-segovia","madrid-seville","madrid-toledo","madrid-valencia","madrid-zaragoza","malaga-barcelona","marseille-miramas","marseille-nice","milan-florence","milan-naples","milan-rome","milan-zurich","mishima-shin-fuji","mishima-shizuoka","montreux-interlaken","morioka-akita","morioka-aomori","morioka-hachinohe","morioka-shin-hanamaki","munich-berlin","munich-paris","munich-prague","munich-salzburg","munich-venice","munich-vienna","nagano-karuizawa","nagano-matsumoto","nagano-toyama","nagano-ueda","nagoya-gifu","nagoya-hamamatsu","nagoya-himeji","nagoya-hiroshima","nagoya-maibara","nagoya-matsumoto","nagoya-nagano","nagoya-okayama","nagoya-shizuoka","nagoya-takayama","nagoya-toyama","nagoya-toyohashi","nanchang-jingdezhen","nanchang-jiujiang","nanjing-hangzhou","nanjing-hefei","nanjing-suzhou","nanjing-wuhan","nanjing-yangzhou","nanning-beihai","nanning-guilin","naples-rome","naples-salerno","naples-sorrento","narita-airport-shinagawa","narita-airport-yokohama","narita-tokyo","nice-monaco","niigata-akita","niigata-joetsu-myoko","niigata-murakami","niigata-nagaoka","odawara-atami","odawara-shizuoka","okayama-fukuoka","okayama-fukuyama","okayama-himeji","okayama-kurashiki","okayama-matsue","okayama-yonago","osaka-fukuchiyama","osaka-fukuoka","osaka-fukuyama","osaka-hamamatsu","osaka-himeji","osaka-hiroshima","osaka-kagoshima","osaka-kii-tanabe","osaka-kinosaki","osaka-kobe","osaka-kokura","osaka-kumamoto","osaka-kyoto","osaka-maibara","osaka-nagoya","osaka-odawara","osaka-okayama","osaka-shin-fuji","osaka-shin-yamaguchi","osaka-shirahama","osaka-shizuoka","osaka-toyohashi","osaka-toyooka","osaka-tsuruga","osaka-wakayama","oslo-bergen","oslo-gothenburg","oslo-trondheim","paris-amsterdam","paris-barcelona","paris-berlin","paris-bordeaux","paris-bruges","paris-london","paris-lourdes","paris-lucerne","paris-lyon","paris-marseille","paris-milan","paris-nice","paris-rome","paris-toulouse","paris-venice","paris-zurich","prague-brno","prague-budapest","prague-vienna","qingdao-weihai","qingdao-yantai","rome-florence","rome-naples","rome-venice","santiago-madrid","sapporo-asahikawa","sapporo-chitose","sapporo-kushiro","sapporo-new-chitose-airport","sapporo-noboribetsu","sapporo-obihiro","sapporo-otaru","sapporo-shin-sapporo","sapporo-tomakomai","sapporo-wakkanai","sendai-akita","sendai-aomori","sendai-fukushima","sendai-hachinohe","sendai-ichinoseki","sendai-koriyama","sendai-morioka","seville-cordoba","shanghai-changsha","shanghai-changzhou","shanghai-chengdu","shanghai-guangzhou","shanghai-hangzhou","shanghai-hefei","shanghai-huangshan","shanghai-nanchang","shanghai-nanjing","shanghai-ningbo","shanghai-qingdao","shanghai-shenzhen","shanghai-suzhou","shanghai-wuhan","shanghai-wuxi","shanghai-xiamen","shanghai-xian","shenyang-dalian","shenzhen-changsha","shenzhen-guilin","shenzhen-hong-kong","shenzhen-wuhan","shenzhen-xiamen","shin-yokohama-atami","shin-yokohama-kyoto","shin-yokohama-mishima","shin-yokohama-nagoya","shin-yokohama-odawara","shin-yokohama-osaka","shinjuku-hakone","shinjuku-kawaguchiko","shinjuku-kofu","shinjuku-matsumoto","shinjuku-narita-airport","shinjuku-odawara","shinjuku-otsuki","stmoritz-zermatt","stockholm-oslo","strasbourg-paris","suzhou-hangzhou","takayama-gero","takayama-gifu","takayama-hida-furukawa","takayama-toyama","tende-nice","tokyo-akita","tokyo-aomori","tokyo-atami","tokyo-fukuoka","tokyo-fukushima","tokyo-fukuyama","tokyo-hachinohe","tokyo-hamamatsu","tokyo-himeji","tokyo-hiroshima","tokyo-ichinoseki","tokyo-ito","tokyo-kanazawa","tokyo-karuizawa","tokyo-kobe","tokyo-kokura","tokyo-kyoto","tokyo-maibara","tokyo-matsumoto","tokyo-mishima","tokyo-mito","tokyo-morioka","tokyo-nagano","tokyo-nagaoka","tokyo-nagoya","tokyo-niigata","tokyo-odawara","tokyo-okayama","tokyo-osaka","tokyo-sendai","tokyo-shin-fuji","tokyo-shin-hakodate-hokuto","tokyo-shin-yamaguchi","tokyo-shin-yokohama","tokyo-shizuoka","tokyo-takasaki","tokyo-toyama","tokyo-toyohashi","tokyo-ueda","tokyo-utsunomiya","tokyo-yamagata","tokyo-yokohama","toulouse-lourdes","turin-milan","utsunomiya-fukushima","utsunomiya-nasu-shiobara","venice-milan","vienna-budapest","vienna-krems","vienna-prague","vienna-salzburg","wuhan-changsha","wuhan-xian","wuhan-yichang","xiamen-fuzhou","xiamen-quanzhou","xian-chengdu","xian-chongqing","xian-lanzhou","xian-luoyang","xian-taiyuan","xian-yinchuan","zaragoza-barcelona","zhengzhou-kaifeng","zhengzhou-luoyang","zhengzhou-wuhan","zhengzhou-xian","zurich-geneva","zurich-lucerne","zurich-milan","zurich-munich"/*END*/]);
  function guideUrl(a, b) {
    var pages = window.GLOSX_ROUTE_PAGES;
    var cand = [norm(a) + '-' + norm(b), a + '-' + b, norm(b) + '-' + norm(a), b + '-' + a], hit = null;
    for (var i = 0; i < cand.length && !hit; i++) if (ALL_GUIDES.has(cand[i]) || (pages && pages.has(cand[i]))) hit = cand[i];
    if (!hit) return null;
    var l = lang();
    return '/rutas/' + hit + '/' + (l === 'en' ? '' : l + '/');
  }

  // "Cómo llegar a la estación": enlace a Google Maps SIN origen, así Maps usa el GPS del dispositivo y guía en transporte público o a pie.
  // Con nombre de estación (tramos de la IA) va a esa estación; en la tarjeta simple solo se conoce la ciudad de salida.
  var GO = {
    en: { st: 'Directions to {s}', ci: 'Directions to the station in {c}', tip: 'Opens Google Maps from your current location', ey: 'Getting to the station', tx: 'From wherever you are now, on foot or by public transport.', nt: 'Use it once you are in the departure city.' },
    es: { st: 'Cómo llegar a {s}', ci: 'Cómo llegar a la estación de {c}', tip: 'Abre Google Maps desde tu ubicación actual', ey: 'Llegar a la estación', tx: 'Desde donde estás ahora, a pie o en transporte público.', nt: 'Úsalo cuando ya estés en la ciudad de salida.' },
    fr: { st: 'Itinéraire vers {s}', ci: 'Itinéraire vers la gare de {c}', tip: 'Ouvre Google Maps depuis votre position actuelle', ey: 'Rejoindre la gare', tx: 'Depuis votre position actuelle, à pied ou en transport en commun.', nt: 'À utiliser une fois sur place, dans la ville de départ.' },
    de: { st: 'Route zu {s}', ci: 'Route zum Bahnhof {c}', tip: 'Öffnet Google Maps ab deinem aktuellen Standort', ey: 'Zum Bahnhof kommen', tx: 'Von deinem aktuellen Standort, zu Fuß oder mit öffentlichen Verkehrsmitteln.', nt: 'Nutze es, sobald du in der Abfahrtsstadt bist.' },
    it: { st: 'Indicazioni per {s}', ci: 'Indicazioni per la stazione di {c}', tip: 'Apre Google Maps dalla tua posizione attuale', ey: 'Raggiungere la stazione', tx: 'Da dove ti trovi ora, a piedi o con i mezzi pubblici.', nt: 'Usalo quando sei già nella città di partenza.' },
    pt: { st: 'Como chegar a {s}', ci: 'Como chegar à estação de {c}', tip: 'Abre o Google Maps a partir da sua localização atual', ey: 'Chegar à estação', tx: 'A partir da sua localização atual, a pé ou de transporte público.', nt: 'Use quando já estiver na cidade de partida.' },
    ja: { st: '{s}への行き方', ci: '{c}駅への行き方', tip: '現在地からGoogleマップを開きます', ey: '駅までの行き方', tx: '現在地から、徒歩または公共交通機関で。', nt: '出発地の街に着いてからご利用ください。' },
    zh: { st: '前往{s}的路线', ci: '前往{c}火车站的路线', tip: '从您当前位置打开谷歌地图', ey: '前往车站', tx: '从您当前位置出发，步行或乘坐公共交通。', nt: '到达出发城市后再使用。' }
  };
  var EST = {en: 'Estimated price', es: 'Precio estimado', fr: 'Prix estimé', de: 'Geschätzter Preis', it: 'Prezzo stimato', pt: 'Preço estimado', ja: '目安価格', zh: '预估价格'};
  var PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>';
  function goLang() {
    var l = String(document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return GO[l] ? l : 'en';
  }
  function goUrl(station, city) {
    var q = station ? (city && station.toLowerCase().indexOf(String(city).toLowerCase()) < 0 ? station + ', ' + city : station) : city + ' train station';
    return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(q) + '&travelmode=transit';
  }
  function goLink(station, city, source, inline) {
    var t = GO[goLang()];
    var a = document.createElement('a');
    a.className = 'pi-go' + (inline ? ' pi-go-inline' : '');
    a.href = goUrl(station, city);
    a.target = '_blank'; a.rel = 'noopener';
    a.title = t.tip;
    a.innerHTML = PIN + '<span>' + esc(station ? t.st.replace('{s}', station) : t.ci.replace('{c}', city)) + '</span>';
    a.addEventListener('click', function () {
      try { if (window.gtag) gtag('event', 'station_directions', { source: source, kind: station ? 'station' : 'city', lang: goLang() }); } catch (e) {}
    });
    return a;
  }
  function addGoAi(el) {
    el.setAttribute('data-go', '1');
    var first = el.firstChild, station = first && first.nodeType === 3 ? first.textContent.trim() : '';
    if (!station) return;
    var seg = el.closest('.ai-segment'), rt = seg && seg.querySelector('.ai-segment-route');
    var city = rt ? (rt.textContent.split('→')[0] || '').trim() : '';
    el.insertAdjacentElement('afterend', goLink(station, city, 'planner_ai', true));
  }

  // Panel propio, independiente del botón de Omio: guía desde el GPS del dispositivo hasta la estación de salida.
  function stationPanel(city, source, station) {
    var t = GO[goLang()];
    var d = document.createElement('div');
    d.className = 'pi-station';
    d.innerHTML = '<div class="pi-station-eye">' + esc(t.ey) + '</div><p class="pi-station-text">' + esc(t.tx) + '</p>';
    d.appendChild(goLink(station || '', city, source));
    var n = document.createElement('p'); n.className = 'pi-station-note'; n.textContent = t.nt; d.appendChild(n);
    return d;
  }
  // Tarjetas de la IA (un solo tramo): "Cómo llegar a la estación" como tarjeta completa (con mapa), igual que en las demás,
  // usando el nombre exacto de la estación que trae la IA, en lugar de la pastilla chica.
  function useStationCard(seg, box) {
    var st = seg.querySelector('.ai-segment-stations');
    var first = st && st.firstChild, station = first && first.nodeType === 3 ? first.textContent.trim() : '';
    if (!station) return false;
    var rt = seg.querySelector('.ai-segment-route'), city = rt ? (rt.textContent.split('\u2192')[0] || '').trim() : '';
    st.setAttribute('data-go', '1');
    seg.querySelectorAll('a.pi-go-inline').forEach(function (a) { a.remove(); });
    var panel = stationPanel(city, 'planner_ai', station);
    if (box) box.appendChild(panel); else seg.insertBefore(panel, seg.querySelector('a.ai-segment-buy') || null);
    seg.setAttribute('data-gp', '1');
    return true;
  }
  function addStationPanel(seg) {
    if (seg.getAttribute('data-gp')) return;
    seg.setAttribute('data-gp', '1');
    var rt = seg.querySelector('.ai-segment-route'), city = rt ? (rt.textContent.split('→')[0] || '').trim() : '';
    if (!city) return;
    var panel = stationPanel(city, 'planner_region'), pi = seg.querySelector('.pi');
    if (pi) pi.appendChild(panel);                       // misma columna lateral que en Europa
    else seg.insertBefore(panel, seg.querySelector('a.ai-segment-buy') || null);
  }

  function fill(seg, d) {
    if (seg.getAttribute('data-pi')) return;
    var desc = seg.querySelector('.ai-segment-desc'), time = seg.querySelector('.ai-segment-time'), body = seg.querySelector('.ai-segment-body');
    // Tarjetas compactas vacías: se arman completas. Tarjetas de la IA (traen su propio texto o duración): si el resultado es de UN solo tramo
    // también reciben las opciones de viaje, la guía de la ruta con foto, las etiquetas y "Qué hacer", para que una ruta conocida se vea igual
    // la escriba quien la escriba. En recorridos de varios tramos no se agrega nada (quedarían demasiado cargados).
    if (!body) return;
    var isAi = !!((desc && desc.textContent.trim()) || (time && time.textContent.trim()));
    var multi = false;
    if (isAi) {
      var holder = seg.closest('.ai-segments');
      if (!holder) return;
      multi = holder.querySelectorAll('.ai-segment').length !== 1;   // varios tramos: solo la guía de la ruta (si existe) + la tarjeta de estación, sin opciones ni etiquetas
    }
    var buy = seg.querySelector('a.ai-segment-buy[href*="europe-train"]');
    if (!buy) return;
    var q;
    try { q = new URL(buy.href).searchParams; } catch (e) { return; }
    var a = q.get('from'), b = q.get('to');
    seg.setAttribute('data-pi', '1');
    var t = L10N[lang()];
    var o = d && cityId(d, a), de = d && cityId(d, b), raw = o && de && (d.p[o + '_' + de] || d.p[de + '_' + o]);
    var parts = raw ? raw.split('|') : [];
    var vals = parts[0] ? parts[0].split(',').map(Number) : [];
    var prices = parts[1] ? parts[1].split(',').map(Number) : [];
    var present = MODES.filter(function (k, i) { return vals[i] > 0; });
    var html = '';
    if (present.length && !multi) {
      var max = Math.max.apply(null, present.map(function (k) { return vals[MODES.indexOf(k)]; }));
      html += '<div class="rp-eyebrow pi-eyebrow">' + esc(t.opts) + '</div><div class="rp-modes pi-modes">' + present.map(function (k) {
        var v = vals[MODES.indexOf(k)], pct = Math.max(8, Math.round(v / max * 100));
        return '<div class="rp-row' + (k === 'train' ? ' is-train' : '') + '"><span class="rp-ico">' + ICON[k] + '</span>' +
          '<div><div class="rp-label">' + esc(t[k]) + '</div><div class="rp-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div></div>' +
          '<span class="rp-meta"><span class="rp-time">' + fmt(v, t) + '</span>' +
          (prices[MODES.indexOf(k)] > 0 ? '<span class="rp-price" data-est="' + esc(EST[goLang()]) + '">' + fmtPrice(prices[MODES.indexOf(k)], lang()) + '</span>' : '') + '</span></div>';
      }).join('') + '</div><p class="rp-note pi-note">' + esc(t.note) + '</p>';
      if (vals[0] > 0 && time && !isAi) time.textContent = fmt(vals[0], t);
    }
    var g = guideUrl(a, b);
    if (!html && !g) return;
    var box = document.createElement('div');
    box.className = 'pi';
    box.innerHTML = html;
    if (g) {
      var rt = seg.querySelector('.ai-segment-route');
      box.appendChild(window.glosxGuideCard(g, rt ? rt.textContent.trim() : '', a));
    }
    var dep0 = seg.querySelector('.ai-segment-route');
    var depCity = dep0 ? (dep0.textContent.split('→')[0] || '').trim() : '';
    if (isAi) { if (!useStationCard(seg, box)) seg.setAttribute('data-gp', '1'); }
    else if (depCity) { seg.setAttribute('data-gp', '1'); box.appendChild(stationPanel(depCity, 'planner_simple')); }
    var res = seg.closest('.ai-results');
    if (!multi && res && !res.querySelector('.pi-exp')) {   // una sola vez por resultado, con la ciudad de destino
      var rte = seg.querySelector('.ai-segment-route'), dn = rte ? (rte.textContent.split('→')[1] || '').trim() : '';
      box.appendChild(expLine(norm(b), dn));
    }
    seg.insertBefore(box, buy);   // bloque propio del grid (el cuerpo de la tarjeta compacta está oculto por el tema)
    if (!multi) decorateHeader(seg, box);
  }

  // Cabecera del resultado con más información: el viaje dibujado (origen ┄ duración ┄ destino) y una fila de datos reales
  // (primer tren, trenes por día y precio desde) tomados de lo que ya muestra la tarjeta. Si un dato no existe, no se muestra.
  var FROMP = {
    en: function (p) { return 'from ' + p; }, es: function (p) { return 'desde ' + p; }, fr: function (p) { return 'dès ' + p; },
    de: function (p) { return 'ab ' + p; }, it: function (p) { return 'da ' + p; }, pt: function (p) { return 'desde ' + p; },
    ja: function (p) { return p + '〜'; }, zh: function (p) { return p + ' 起'; }
  };
  // El viaje dibujado en la cabecera: origen ○┄┄ duración ┄┄● destino. Los textos originales siguen en el HTML (lectores de pantalla)
  // y se mantienen sincronizados si otro script los cambia (idioma, duración).
  function drawTrip(hd) {
    if (!hd || hd.querySelector('.rt-visual')) return;
    var rt = hd.querySelector('.ai-segment-route'), tm = hd.querySelector('.ai-segment-time');
    if (!rt || rt.textContent.split('\u2192').length !== 2) return;
    var v = document.createElement('span'); v.className = 'rt-visual'; v.setAttribute('aria-hidden', 'true');
    var o = document.createElement('span'); o.className = 'rt-o';
    var tr = document.createElement('span'); tr.className = 'rt-track';
    var d1 = document.createElement('i'); d1.className = 'rt-dot';
    var du = document.createElement('span'); du.className = 'rt-dur';
    var d2 = document.createElement('i'); d2.className = 'rt-dot';
    var de = document.createElement('span'); de.className = 'rt-d';
    tr.appendChild(d1); tr.appendChild(du); tr.appendChild(d2);
    v.appendChild(o); v.appendChild(tr); v.appendChild(de);
    // Solo se escribe si el texto cambió, y el observador se desconecta solo si algo lo dispara en bucle (otro script reescribiendo la duración).
    function put(el, val) { if (el.textContent !== val) el.textContent = val; }
    var calls = 0, t0 = Date.now(), mo = null;
    function sync() {
      if (Date.now() - t0 > 1000) { t0 = Date.now(); calls = 0; }
      if (++calls > 40) { if (mo) mo.disconnect(); return; }
      var parts = rt.textContent.split('\u2192');
      if (parts.length === 2) { put(o, parts[0].trim()); put(de, parts[1].trim()); }
      var t = tm ? tm.textContent.trim() : '';
      put(du, t); if (du.hidden !== !t) du.hidden = !t;
    }
    sync();
    hd.appendChild(v);
    if (window.MutationObserver) {
      mo = new MutationObserver(sync);
      [rt, tm].forEach(function (n) { if (n) mo.observe(n, { childList: true, characterData: true, subtree: true }); });
    }
  }
  function decorateHeader(seg, box) {
    var hd = seg.querySelector('.ai-segment-header');
    if (!hd || hd.querySelector('.rt-facts')) return;
    drawTrip(hd);
    function facts() {
      var old = hd.querySelector('.rt-facts'); if (old) old.remove();
      var chips = [];
      var meta = box.querySelector('.pi-gcard-meta');
      if (meta) meta.textContent.split(' \u00b7 ').forEach(function (t) { t = t.trim(); if (t) chips.push([t, false]); });
      var pr = box.querySelector('.rp-row.is-train .rp-price');
      if (pr && pr.textContent.trim()) chips.push([(FROMP[goLang()] || FROMP.en)(pr.textContent.trim()), true]);
      if (!chips.length) return;
      var f = document.createElement('div'); f.className = 'rt-facts';
      chips.forEach(function (c) { var s = document.createElement('span'); s.className = 'rt-chip' + (c[1] ? ' is-price' : ''); s.textContent = c[0]; f.appendChild(s); });
      hd.appendChild(f);
    }
    facts();
    // el dato del primer tren / trenes por día llega después de dibujar la tarjeta de guía: se vuelve a armar una vez
    var gm = box.querySelector('.pi-gcard-meta');
    if (gm && !gm.textContent.trim() && window.MutationObserver) {
      var mo = new MutationObserver(function () { if (gm.textContent.trim()) { mo.disconnect(); facts(); } });
      mo.observe(gm, { childList: true, characterData: true, subtree: true });
    }
  }

  // "Qué hacer al llegar": una línea con Klook (tours) y GetYourGuide (actividades), con afiliación vía backend; sin agrandar la tarjeta
  var EXL = {
    en: ['What to do in {c}:', 'Tours on Klook', 'Activities on GetYourGuide'],
    es: ['Qué hacer en {c}:', 'Tours en Klook', 'Actividades en GetYourGuide'],
    fr: ['Que faire à {c} :', 'Activités sur Klook', 'Activités sur GetYourGuide'],
    it: ['Cosa fare a {c}:', 'Tour su Klook', 'Attività su GetYourGuide'],
    de: ['Was es in {c} zu tun gibt:', 'Touren auf Klook', 'Aktivitäten auf GetYourGuide'],
    pt: ['O que fazer em {c}:', 'Tours na Klook', 'Atividades no GetYourGuide'],
    zh: ['在{c}可以做什么：', '在 Klook 上找旅游团', '在 GetYourGuide 上找活动'],
    ja: ['{c}での楽しみ方：', 'Klookでツアーを探す', 'GetYourGuideでアクティビティを探す']
  };
  window.glosxExpLine = function (slug, name) { return expLine(slug, name); };   // lo usa japan.js en el resultado de Japón
  function expLine(slug, name) {
    var l = lang(), t = EXL[l] || EXL.en;
    var base = typeof PROXY_BASE === 'string' ? PROXY_BASE : 'https://voxa-production-dc15.up.railway.app/affiliate';
    var p = document.createElement('p');
    p.className = 'pi-exp';
    p.innerHTML = '<span class="pi-exp-lab">' + esc(t[0].replace('{c}', name || slug)) + '</span> <a href="' + base + '/klook-experiences?lang=' + l + '&city=' + encodeURIComponent(slug) + '" target="_blank" rel="sponsored noopener" data-k="klook">' + esc(t[1]) + '</a> · <a href="' + base + '/getyourguide?city=' + encodeURIComponent(slug.replace(/-/g, ' ')) + '" target="_blank" rel="sponsored noopener" data-k="getyourguide">' + esc(t[2]) + '</a>';
    p.addEventListener('click', function (e) { var x = e.target.closest && e.target.closest('a'); if (!x) return; try { if (window.gtag) gtag('event', 'ui_click', { source: 'planner_exp_' + x.getAttribute('data-k') }); } catch (er) {} });
    return p;
  }

  // Tarjetas sin datos propios (rutas que alguien inventa y no están precargadas): igual llevan "Cómo llegar a la estación" y "Qué hacer en <destino>"
  // (Klook y GetYourGuide, con tu afiliación vía backend). Una sola línea por resultado, con el destino del último tramo.
  function addExp(seg) {
    var res = seg.closest('.ai-results');
    if (!res || res.querySelector('.pi-exp')) return;
    var all = res.querySelectorAll('.ai-segment');
    if (all[all.length - 1] !== seg) return;
    var rt = seg.querySelector('.ai-segment-route'), dn = rt ? (rt.textContent.split('\u2192')[1] || '').trim() : '';
    var buy = seg.querySelector('a.ai-segment-buy'), slug = '';
    try { slug = new URL(buy.href).searchParams.get('to') || ''; } catch (e) {}
    if (!slug) slug = dn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]+/g, '-').replace(/^-+|-+$/g, '');
    if (!slug) return;
    seg.appendChild(expLine(norm(slug), dn));
  }
  var finT = null;
  function finishCards() {
    finT = null;
    document.querySelectorAll('.ai-results').forEach(function (res) {
      var segs = res.querySelectorAll('.ai-segment');
      if (!segs.length) return;
      segs.forEach(function (seg) {
        if (seg.querySelector('.pi-station')) return;
        if (seg.querySelector('.ai-segment-stations') && useStationCard(seg, null)) return;
        if (!seg.querySelector('a.pi-go')) addStationPanel(seg);
      });
      addExp(segs[segs.length - 1]);
    });
  }

  function scan() {
    if (!finT) finT = setTimeout(finishCards, 2200);
    document.querySelectorAll('.ai-segment:not([data-rt])').forEach(function (seg) { var h = seg.querySelector('.ai-segment-header'); if (!h) return; seg.setAttribute('data-rt', '1'); drawTrip(h); });   // todas las tarjetas: viaje dibujado (incluye las de la IA)
    document.querySelectorAll('.ai-segment-stations:not([data-go])').forEach(addGoAi);
    document.querySelectorAll('.ai-segment:not([data-gp])').forEach(function (seg) {
      if (seg.querySelector('.ai-segment-stations') || seg.querySelector('a.ai-segment-buy[href*="europe-train"]')) return;   // IA: enlace en línea; Europa: lo arma fill()
      var body = seg.querySelector('.ai-segment-body'), desc = seg.querySelector('.ai-segment-desc');
      if (body && desc && desc.textContent.trim()) return;   // tarjeta con texto de la IA
      if (!seg.querySelector('a.ai-segment-buy[href*="klook"]') || seg.getAttribute('data-gpw')) return;
      seg.setAttribute('data-gpw', '1');
      setTimeout(function () { addStationPanel(seg); }, 1200);   // espera al bloque de opciones (.pi); si no llega, va igual
    });
    var segs = document.querySelectorAll('.ai-segment:not([data-pi])');
    if (!segs.length) return;
    load().then(function (d) { segs.forEach(function (s) { fill(s, d); }); });
  }

  // Limitado (no 'debounce'): si otra pieza de la página modifica el DOM sin parar, el escaneo igual corre cada ~80 ms.
  var pending = false;
  new MutationObserver(function () { if (pending) return; pending = true; setTimeout(function () { pending = false; scan(); }, 80); })
    .observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
