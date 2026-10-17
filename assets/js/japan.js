/*
 * Modo Japón del buscador de glosx.app.
 * Cambia las dos fuentes de datos que ya usan el buscador, la ruleta y el resultado
 * instantáneo (window._GLOSX_CITIES y window.GLOSX_ROUTE_PAGES) por las de Japón, y
 * reemplaza las rutas populares. La reserva sigue el camino de siempre
 * (/affiliate/klook-train), que ya resuelve los pares de Japón en Klook con el
 * marker de afiliado. Los pares y las estaciones salen del backend, verificados
 * contra el buscador real de Klook (05-oct-2026).
 */
(function () {
  'use strict';

  var CITIES = [{"display":"Akita","slug":"akita","keywords":["akita"]},{"display":"Aomori","slug":"aomori","keywords":["aomori","shin aomori"]},{"display":"Asahikawa","slug":"asahikawa","keywords":["asahikawa"]},{"display":"Asakusa","slug":"asakusa","keywords":["asakusa"]},{"display":"Atami","slug":"atami","keywords":["atami"]},{"display":"Beppu","slug":"beppu","keywords":["beppu"]},{"display":"Chitose","slug":"chitose","keywords":["chitose"]},{"display":"Fukuchiyama","slug":"fukuchiyama","keywords":["fukuchiyama"]},{"display":"Fukui","slug":"fukui","keywords":["fukui"]},{"display":"Fukuoka","slug":"fukuoka","keywords":["fukuoka","hakata"]},{"display":"Fukushima","slug":"fukushima","keywords":["fukushima"]},{"display":"Fukuyama","slug":"fukuyama","keywords":["fukuyama"]},{"display":"Gero","slug":"gero","keywords":["gero"]},{"display":"Gifu","slug":"gifu","keywords":["gifu"]},{"display":"Hachinohe","slug":"hachinohe","keywords":["hachinohe"]},{"display":"Hakodate","slug":"hakodate","keywords":["hakodate"]},{"display":"Hakone","slug":"hakone","keywords":["hakone"]},{"display":"Hamamatsu","slug":"hamamatsu","keywords":["hamamatsu"]},{"display":"Hida Furukawa","slug":"hidafurukawa","keywords":["hida furukawa"]},{"display":"Himeji","slug":"himeji","keywords":["himeji"]},{"display":"Hirosaki","slug":"hirosaki","keywords":["hirosaki"]},{"display":"Hiroshima","slug":"hiroshima","keywords":["hiroshima","hiroxima"]},{"display":"Hita","slug":"hita","keywords":["hita"]},{"display":"Huis Ten Bosch","slug":"huistenbosch","keywords":["huis ten bosch"]},{"display":"Ichinoseki","slug":"ichinoseki","keywords":["ichinoseki"]},{"display":"Ito","slug":"ito","keywords":["ito"]},{"display":"Joetsu Myoko","slug":"joetsumyoko","keywords":["joetsu myoko"]},{"display":"Kaga Onsen","slug":"kagaonsen","keywords":["kaga onsen"]},{"display":"Kagoshima","slug":"kagoshima","keywords":["kagoshima"]},{"display":"Kanazawa","slug":"kanazawa","keywords":["kanazawa"]},{"display":"Kansai Airport","slug":"kansaiairport","keywords":["kansai airport","kansai"]},{"display":"Karuizawa","slug":"karuizawa","keywords":["karuizawa"]},{"display":"Kawaguchiko","slug":"kawaguchiko","keywords":["kawaguchiko","fujikawaguchiko","kawaguchi"]},{"display":"Kii Tanabe","slug":"kiitanabe","keywords":["kii tanabe"]},{"display":"Kinosaki","slug":"kinosaki","keywords":["kinosaki"]},{"display":"Kinugawa Onsen","slug":"kinugawaonsen","keywords":["kinugawa onsen"]},{"display":"Kobe","slug":"kobe","keywords":["kobe","shin kobe"]},{"display":"Kofu","slug":"kofu","keywords":["kofu"]},{"display":"Kokura","slug":"kokura","keywords":["kokura"]},{"display":"Komatsu","slug":"komatsu","keywords":["komatsu"]},{"display":"Koriyama","slug":"koriyama","keywords":["koriyama"]},{"display":"Kumamoto","slug":"kumamoto","keywords":["kumamoto"]},{"display":"Kurashiki","slug":"kurashiki","keywords":["kurashiki"]},{"display":"Kurume","slug":"kurume","keywords":["kurume"]},{"display":"Kushiro","slug":"kushiro","keywords":["kushiro"]},{"display":"Kyoto","slug":"kyoto","keywords":["kyoto","kioto","quioto"]},{"display":"Maibara","slug":"maibara","keywords":["maibara"]},{"display":"Matsue","slug":"matsue","keywords":["matsue"]},{"display":"Matsumoto","slug":"matsumoto","keywords":["matsumoto"]},{"display":"Mishima","slug":"mishima","keywords":["mishima"]},{"display":"Mito","slug":"mito","keywords":["mito"]},{"display":"Morioka","slug":"morioka","keywords":["morioka"]},{"display":"Murakami","slug":"murakami","keywords":["murakami"]},{"display":"Nagano","slug":"nagano","keywords":["nagano"]},{"display":"Nagaoka","slug":"nagaoka","keywords":["nagaoka"]},{"display":"Nagoya","slug":"nagoya","keywords":["nagoya","nagoia"]},{"display":"Nakatsu","slug":"nakatsu","keywords":["nakatsu"]},{"display":"Nanao","slug":"nanao","keywords":["nanao"]},{"display":"Narita Airport","slug":"naritaairport","keywords":["narita airport","narita"]},{"display":"Nasushiobara","slug":"nasushiobara","keywords":["nasushiobara"]},{"display":"New Chitose Airport","slug":"newchitoseairport","keywords":["new chitose airport","new chitose"]},{"display":"Niigata","slug":"niigata","keywords":["niigata"]},{"display":"Nikko","slug":"nikko","keywords":["nikko","tobu nikko"]},{"display":"Noboribetsu","slug":"noboribetsu","keywords":["noboribetsu"]},{"display":"Obihiro","slug":"obihiro","keywords":["obihiro"]},{"display":"Odawara","slug":"odawara","keywords":["odawara"]},{"display":"Oita","slug":"oita","keywords":["oita"]},{"display":"Okayama","slug":"okayama","keywords":["okayama"]},{"display":"Onomichi","slug":"onomichi","keywords":["onomichi"]},{"display":"Osaka","slug":"osaka","keywords":["osaka","osaca","shin osaka","shinosaka"]},{"display":"Otaru","slug":"otaru","keywords":["otaru"]},{"display":"Otsuki","slug":"otsuki","keywords":["otsuki"]},{"display":"Saga","slug":"saga","keywords":["saga"]},{"display":"Sapporo","slug":"sapporo","keywords":["sapporo","saporo"]},{"display":"Sendai","slug":"sendai","keywords":["sendai"]},{"display":"Shinagawa","slug":"shinagawa","keywords":["shinagawa"]},{"display":"Shin Fuji","slug":"shinfuji","keywords":["shin fuji"]},{"display":"Shin Hakodate Hokuto","slug":"shinhakodatehokuto","keywords":["shin hakodate hokuto"]},{"display":"Shin Hanamaki","slug":"shinhanamaki","keywords":["shin hanamaki"]},{"display":"Shinjuku","slug":"shinjuku","keywords":["shinjuku"]},{"display":"Shin Sapporo","slug":"shinsapporo","keywords":["shin sapporo"]},{"display":"Shin Yamaguchi","slug":"shinyamaguchi","keywords":["shin yamaguchi"]},{"display":"Shin Yokohama","slug":"shinyokohama","keywords":["shin yokohama"]},{"display":"Shirahama","slug":"shirahama","keywords":["shirahama"]},{"display":"Shizuoka","slug":"shizuoka","keywords":["shizuoka"]},{"display":"Takasaki","slug":"takasaki","keywords":["takasaki"]},{"display":"Takayama","slug":"takayama","keywords":["takayama"]},{"display":"Takeo Onsen","slug":"takeoonsen","keywords":["takeo onsen"]},{"display":"Tennoji","slug":"tennoji","keywords":["tennoji"]},{"display":"Tokyo","slug":"tokyo","keywords":["tokyo","tokio","toquio","tokyo station"]},{"display":"Tomakomai","slug":"tomakomai","keywords":["tomakomai"]},{"display":"Toyama","slug":"toyama","keywords":["toyama"]},{"display":"Toyohashi","slug":"toyohashi","keywords":["toyohashi"]},{"display":"Toyooka","slug":"toyooka","keywords":["toyooka"]},{"display":"Tsuruga","slug":"tsuruga","keywords":["tsuruga"]},{"display":"Ueda","slug":"ueda","keywords":["ueda"]},{"display":"Utsunomiya","slug":"utsunomiya","keywords":["utsunomiya"]},{"display":"Wakayama","slug":"wakayama","keywords":["wakayama"]},{"display":"Wakkanai","slug":"wakkanai","keywords":["wakkanai"]},{"display":"Yamagata","slug":"yamagata","keywords":["yamagata"]},{"display":"Yokohama","slug":"yokohama","keywords":["yokohama"]},{"display":"Yonago","slug":"yonago","keywords":["yonago"]},{"display":"Yufuin","slug":"yufuin","keywords":["yufuin"]}];
  var ROUTES = [["aomori","hachinohe"],["aomori","hirosaki"],["aomori","shinhakodatehokuto"],["asakusa","kinugawaonsen"],["asakusa","nikko"],["atami","ito"],["atami","mishima"],["atami","shizuoka"],["beppu","kokura"],["beppu","oita"],["beppu","yufuin"],["fukuoka","beppu"],["fukuoka","hita"],["fukuoka","huistenbosch"],["fukuoka","kagoshima"],["fukuoka","kokura"],["fukuoka","kumamoto"],["fukuoka","kurume"],["fukuoka","nakatsu"],["fukuoka","oita"],["fukuoka","saga"],["fukuoka","shinyamaguchi"],["fukuoka","takeoonsen"],["fukuoka","yufuin"],["hakodate","noboribetsu"],["hakodate","sapporo"],["hakodate","shinhakodatehokuto"],["hiroshima","fukuoka"],["hiroshima","fukuyama"],["hiroshima","himeji"],["hiroshima","kokura"],["hiroshima","kumamoto"],["hiroshima","okayama"],["hiroshima","onomichi"],["hiroshima","shinyamaguchi"],["kanazawa","fukui"],["kanazawa","kagaonsen"],["kanazawa","komatsu"],["kanazawa","nagano"],["kanazawa","nanao"],["kanazawa","toyama"],["kanazawa","tsuruga"],["kanazawa","ueda"],["kansaiairport","kyoto"],["kansaiairport","osaka"],["kansaiairport","tennoji"],["kyoto","fukuchiyama"],["kyoto","gifu"],["kyoto","himeji"],["kyoto","hiroshima"],["kyoto","kinosaki"],["kyoto","maibara"],["kyoto","nagoya"],["kyoto","okayama"],["kyoto","tsuruga"],["kyoto","wakayama"],["mishima","shinfuji"],["mishima","shizuoka"],["morioka","akita"],["morioka","aomori"],["morioka","hachinohe"],["morioka","shinhanamaki"],["nagano","karuizawa"],["nagano","matsumoto"],["nagano","toyama"],["nagano","ueda"],["nagoya","gifu"],["nagoya","hamamatsu"],["nagoya","himeji"],["nagoya","hiroshima"],["nagoya","maibara"],["nagoya","matsumoto"],["nagoya","nagano"],["nagoya","okayama"],["nagoya","shizuoka"],["nagoya","takayama"],["nagoya","toyama"],["nagoya","toyohashi"],["naritaairport","shinagawa"],["naritaairport","tokyo"],["naritaairport","yokohama"],["niigata","akita"],["niigata","joetsumyoko"],["niigata","murakami"],["niigata","nagaoka"],["odawara","atami"],["odawara","shizuoka"],["okayama","fukuoka"],["okayama","fukuyama"],["okayama","himeji"],["okayama","kurashiki"],["okayama","matsue"],["okayama","yonago"],["osaka","fukuchiyama"],["osaka","fukuoka"],["osaka","fukuyama"],["osaka","hamamatsu"],["osaka","himeji"],["osaka","hiroshima"],["osaka","kagoshima"],["osaka","kiitanabe"],["osaka","kinosaki"],["osaka","kobe"],["osaka","kokura"],["osaka","kumamoto"],["osaka","kyoto"],["osaka","maibara"],["osaka","nagoya"],["osaka","odawara"],["osaka","okayama"],["osaka","shinfuji"],["osaka","shinyamaguchi"],["osaka","shirahama"],["osaka","shizuoka"],["osaka","toyohashi"],["osaka","toyooka"],["osaka","tsuruga"],["osaka","wakayama"],["sapporo","asahikawa"],["sapporo","chitose"],["sapporo","kushiro"],["sapporo","newchitoseairport"],["sapporo","noboribetsu"],["sapporo","obihiro"],["sapporo","otaru"],["sapporo","shinsapporo"],["sapporo","tomakomai"],["sapporo","wakkanai"],["sendai","akita"],["sendai","aomori"],["sendai","fukushima"],["sendai","hachinohe"],["sendai","ichinoseki"],["sendai","koriyama"],["sendai","morioka"],["shinjuku","hakone"],["shinjuku","kawaguchiko"],["shinjuku","kofu"],["shinjuku","matsumoto"],["shinjuku","naritaairport"],["shinjuku","odawara"],["shinjuku","otsuki"],["shinyokohama","atami"],["shinyokohama","kyoto"],["shinyokohama","mishima"],["shinyokohama","nagoya"],["shinyokohama","odawara"],["shinyokohama","osaka"],["takayama","gero"],["takayama","gifu"],["takayama","hidafurukawa"],["takayama","toyama"],["tokyo","akita"],["tokyo","aomori"],["tokyo","atami"],["tokyo","fukuoka"],["tokyo","fukushima"],["tokyo","fukuyama"],["tokyo","hachinohe"],["tokyo","hamamatsu"],["tokyo","himeji"],["tokyo","hiroshima"],["tokyo","ichinoseki"],["tokyo","ito"],["tokyo","kanazawa"],["tokyo","karuizawa"],["tokyo","kobe"],["tokyo","kokura"],["tokyo","kyoto"],["tokyo","maibara"],["tokyo","matsumoto"],["tokyo","mishima"],["tokyo","mito"],["tokyo","morioka"],["tokyo","nagano"],["tokyo","nagaoka"],["tokyo","nagoya"],["tokyo","niigata"],["tokyo","odawara"],["tokyo","okayama"],["tokyo","osaka"],["tokyo","sendai"],["tokyo","shinfuji"],["tokyo","shinhakodatehokuto"],["tokyo","shinyamaguchi"],["tokyo","shinyokohama"],["tokyo","shizuoka"],["tokyo","takasaki"],["tokyo","toyama"],["tokyo","toyohashi"],["tokyo","ueda"],["tokyo","utsunomiya"],["tokyo","yamagata"],["tokyo","yokohama"],["utsunomiya","fukushima"],["utsunomiya","nasushiobara"]];

  var I18N = {
    en: { hotels: 'Hotels', europe: 'Europe', japan: 'Japan', aria: 'Region', leg: 'We have no verified direct train between {a} and {b}. Try another order or pick a popular route.', two: 'Enter two or more cities, in the order you will travel.', ph: 'Example: Tokyo to Kyoto', nopair: 'Pick one of the popular routes, or try another pair of Japanese cities.' },
    es: { hotels: 'Hoteles', europe: 'Europa', japan: 'Japón', aria: 'Región', leg: 'No tenemos un tren directo verificado entre {a} y {b}. Prueba otro orden o elige una ruta popular.', two: 'Escribe dos o más ciudades, en el orden del viaje.', ph: 'Ejemplo: Tokio a Kioto', nopair: 'Elige una de las rutas populares o prueba otro par de ciudades japonesas.' },
    fr: { hotels: 'Hôtels', europe: 'Europe', japan: 'Japon', aria: 'Région', leg: 'Nous n’avons pas de train direct vérifié entre {a} et {b}. Essayez un autre ordre ou choisissez une route populaire.', two: 'Indiquez deux villes ou plus, dans l’ordre du voyage.', ph: 'Exemple : Tokyo à Kyoto', nopair: 'Choisissez l’une des routes populaires ou essayez une autre paire de villes japonaises.' },
    it: { hotels: 'Hotel', europe: 'Europa', japan: 'Giappone', aria: 'Regione', leg: 'Non abbiamo un treno diretto verificato tra {a} e {b}. Prova un altro ordine o scegli un percorso popolare.', two: 'Scrivi due o più città, nell’ordine del viaggio.', ph: 'Esempio: Tokyo a Kyoto', nopair: 'Scegli uno dei percorsi popolari o prova un’altra coppia di città giapponesi.' },
    de: { hotels: 'Hotels', europe: 'Europa', japan: 'Japan', aria: 'Region', leg: 'Zwischen {a} und {b} haben wir keine geprüfte Direktverbindung. Probiere eine andere Reihenfolge oder wähle eine beliebte Strecke.', two: 'Gib zwei oder mehr Städte ein, in der Reihenfolge der Reise.', ph: 'Beispiel: Tokio nach Kyoto', nopair: 'Wähle eine der beliebten Strecken oder probiere ein anderes Städtepaar in Japan.' },
    pt: { hotels: 'Hotéis', europe: 'Europa', japan: 'Japão', aria: 'Região', leg: 'Não temos um trem direto verificado entre {a} e {b}. Tente outra ordem ou escolha uma rota popular.', two: 'Digite duas ou mais cidades, na ordem da viagem.', ph: 'Exemplo: Tóquio a Quioto', nopair: 'Escolha uma das rotas populares ou tente outro par de cidades japonesas.' },
    ja: { hotels: 'ホテル', europe: 'ヨーロッパ', japan: '日本', aria: '地域', leg: '{a} と {b} のあいだに、確認済みの直通列車はありません。順番を変えるか、人気の路線を選んでください。', two: '行く順に、2つ以上の都市を入力してください。', ph: '例：東京から京都', nopair: '人気の路線を選ぶか、別の日本の都市の組み合わせを試してください。' }
  };

  var GROUPS = [
    { id: 'shinkansen', names: { en: 'Shinkansen', es: 'Shinkansen', fr: 'Shinkansen', it: 'Shinkansen', de: 'Shinkansen', pt: 'Shinkansen', ja: '新幹線' },
      pairs: [['tokyo', 'kyoto'], ['tokyo', 'osaka'], ['tokyo', 'nagoya'], ['nagoya', 'kyoto'], ['osaka', 'hiroshima'], ['tokyo', 'hiroshima'], ['tokyo', 'fukuoka']] },
    { id: 'kanto', names: { en: 'Tokyo & Kanto', es: 'Tokio y Kanto', fr: 'Tokyo et Kanto', it: 'Tokyo e Kanto', de: 'Tokio & Kanto', pt: 'Tóquio e Kanto', ja: '東京・関東' },
      pairs: [['naritaairport', 'tokyo'], ['tokyo', 'yokohama'], ['shinjuku', 'hakone'], ['shinjuku', 'kawaguchiko'], ['asakusa', 'nikko'], ['tokyo', 'karuizawa'], ['tokyo', 'odawara']] },
    { id: 'kansai', names: { en: 'Kansai', es: 'Kansai', fr: 'Kansai', it: 'Kansai', de: 'Kansai', pt: 'Kansai', ja: '関西' },
      pairs: [['osaka', 'kyoto'], ['kansaiairport', 'kyoto'], ['kansaiairport', 'osaka'], ['osaka', 'kobe'], ['kyoto', 'himeji'], ['osaka', 'himeji'], ['kyoto', 'kinosaki']] },
    { id: 'chubu', names: { en: 'Chubu & Hokuriku', es: 'Chubu y Hokuriku', fr: 'Chubu et Hokuriku', it: 'Chubu e Hokuriku', de: 'Chubu & Hokuriku', pt: 'Chubu e Hokuriku', ja: '中部・北陸' },
      pairs: [['tokyo', 'kanazawa'], ['nagoya', 'takayama'], ['nagoya', 'matsumoto'], ['nagoya', 'nagano'], ['kanazawa', 'toyama'], ['takayama', 'toyama'], ['shinjuku', 'matsumoto']] },
    { id: 'west', names: { en: 'West Japan & Kyushu', es: 'Oeste de Japón y Kyushu', fr: 'Ouest du Japon et Kyushu', it: 'Giappone occidentale e Kyushu', de: 'Westjapan & Kyushu', pt: 'Oeste do Japão e Kyushu', ja: '西日本・九州' },
      pairs: [['hiroshima', 'okayama'], ['hiroshima', 'fukuoka'], ['fukuoka', 'kumamoto'], ['fukuoka', 'kagoshima'], ['fukuoka', 'yufuin'], ['okayama', 'matsue'], ['osaka', 'kagoshima']] },
    { id: 'north', names: { en: 'Tohoku & Hokkaido', es: 'Tohoku y Hokkaido', fr: 'Tohoku et Hokkaido', it: 'Tohoku e Hokkaido', de: 'Tohoku & Hokkaido', pt: 'Tohoku e Hokkaido', ja: '東北・北海道' },
      pairs: [['tokyo', 'sendai'], ['tokyo', 'aomori'], ['sendai', 'morioka'], ['hakodate', 'sapporo'], ['sapporo', 'otaru'], ['sapporo', 'newchitoseairport'], ['tokyo', 'akita']] }
  ];

  var switchEl = document.getElementById('regionSwitch');
  var countriesEl = document.getElementById('countries');
  var inputEl = document.getElementById('aiInput');
  if (!switchEl || !countriesEl || !inputEl || !window._GLOSX_CITIES) return;

  var region = 'europe';
  var europeCities = null;
  var europePages = null;
  var europePlaceholder = inputEl.getAttribute('placeholder') || '';
  var japanChipsEl = null;
  var japanPages = new Set();
  ROUTES.forEach(function (r) { japanPages.add(r[0] + '-' + r[1]); japanPages.add(r[1] + '-' + r[0]); });
  var displayBySlug = {};
  CITIES.forEach(function (c) { displayBySlug[c.slug] = c.display; });
  // Nombres en el idioma de la página. VAL_LOC: los que el buscador y el backend reconocen (alias de Klook);
  // LABEL_LOC agrega los aeropuertos, que solo se traducen en lo que se ve (no en los valores de búsqueda).
  var JA_NAME = { akita:'秋田', aomori:'青森', asahikawa:'旭川', asakusa:'浅草', atami:'熱海', beppu:'別府', chitose:'千歳', fukuchiyama:'福知山', fukui:'福井', fukuoka:'福岡', fukushima:'福島', fukuyama:'福山', gero:'下呂', gifu:'岐阜', hachinohe:'八戸', hakodate:'函館', hakone:'箱根', hamamatsu:'浜松', hidafurukawa:'飛騨古川', himeji:'姫路', hirosaki:'弘前', hiroshima:'広島', hita:'日田', huistenbosch:'ハウステンボス', ichinoseki:'一ノ関', ito:'伊東', joetsumyoko:'上越妙高', kagaonsen:'加賀温泉', kagoshima:'鹿児島', kanazawa:'金沢', kansaiairport:'関西空港', karuizawa:'軽井沢', kawaguchiko:'河口湖', kiitanabe:'紀伊田辺', kinosaki:'城崎', kinugawaonsen:'鬼怒川温泉', kobe:'神戸', kofu:'甲府', kokura:'小倉', komatsu:'小松', koriyama:'郡山', kumamoto:'熊本', kurashiki:'倉敷', kurume:'久留米', kushiro:'釧路', kyoto:'京都', maibara:'米原', matsue:'松江', matsumoto:'松本', mishima:'三島', mito:'水戸', morioka:'盛岡', murakami:'村上', nagano:'長野', nagaoka:'長岡', nagoya:'名古屋', nakatsu:'中津', nanao:'七尾', naritaairport:'成田空港', nasushiobara:'那須塩原', newchitoseairport:'新千歳空港', niigata:'新潟', nikko:'日光', noboribetsu:'登別', obihiro:'帯広', odawara:'小田原', oita:'大分', okayama:'岡山', onomichi:'尾道', osaka:'大阪', otaru:'小樽', otsuki:'大月', saga:'佐賀', sapporo:'札幌', sendai:'仙台', shinagawa:'品川', shinfuji:'新富士', shinhakodatehokuto:'新函館北斗', shinhanamaki:'新花巻', shinjuku:'新宿', shinsapporo:'新札幌', shinyamaguchi:'新山口', shinyokohama:'新横浜', shirahama:'白浜', shizuoka:'静岡', takasaki:'高崎', takayama:'高山', takeoonsen:'武雄温泉', tennoji:'天王寺', tokyo:'東京', tomakomai:'苫小牧', toyama:'富山', toyohashi:'豊橋', toyooka:'豊岡', tsuruga:'敦賀', ueda:'上田', utsunomiya:'宇都宮', wakayama:'和歌山', wakkanai:'稚内', yamagata:'山形', yokohama:'横浜', yonago:'米子', yufuin:'由布院' };
  CITIES.forEach(function (c) { if (JA_NAME[c.slug] && c.keywords.indexOf(JA_NAME[c.slug]) === -1) c.keywords.push(JA_NAME[c.slug]); });
  var VAL_LOC = { es: { tokyo: 'Tokio', kyoto: 'Kioto' }, de: { tokyo: 'Tokio' }, pt: { tokyo: 'T\u00f3quio', kyoto: 'Quioto' }, ja: JA_NAME };
  var AIRPORT_LOC = {
    es: { naritaairport: 'Aeropuerto de Narita', kansaiairport: 'Aeropuerto de Kansai', newchitoseairport: 'Aeropuerto de New Chitose' },
    fr: { naritaairport: 'A\u00e9roport de Narita', kansaiairport: 'A\u00e9roport du Kansai', newchitoseairport: 'A\u00e9roport de New Chitose' },
    it: { naritaairport: 'Aeroporto di Narita', kansaiairport: 'Aeroporto del Kansai', newchitoseairport: 'Aeroporto di New Chitose' },
    de: { naritaairport: 'Flughafen Narita', kansaiairport: 'Flughafen Kansai', newchitoseairport: 'Flughafen New Chitose' },
    pt: { naritaairport: 'Aeroporto de Narita', kansaiairport: 'Aeroporto de Kansai', newchitoseairport: 'Aeroporto de New Chitose' },
    ja: { naritaairport: '成田空港', kansaiairport: '関西空港', newchitoseairport: '新千歳空港' }
  };
  function valueOf(slug) { var m = VAL_LOC[lang()]; return (m && m[slug]) || displayBySlug[slug] || slug; }
  function labelOf(slug) { var m = AIRPORT_LOC[lang()]; return (m && m[slug]) || valueOf(slug); }

  function lang() {
    var l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return I18N[l] ? l : 'en';
  }
  function t(key) { return I18N[lang()][key]; }
  function track(r) {
    try { if (typeof gtag === 'function') gtag('event', 'ui_click', { source: 'region_switch', region: r }); } catch (e) {}
  }

  function setCities(list) {
    var arr = window._GLOSX_CITIES;
    arr.length = 0;
    list.forEach(function (c) { arr.push(c); });
  }

  function buildChips() {
    if (!japanChipsEl) {
      japanChipsEl = document.createElement('div');
      japanChipsEl.className = 'countries';
      japanChipsEl.id = 'countriesJapan';
      japanChipsEl.style.padding = '0 24px 0';
      countriesEl.parentNode.insertBefore(japanChipsEl, countriesEl.nextSibling);
      document.addEventListener('click', function () {
        japanChipsEl.querySelectorAll('.country-chip.show-photo').forEach(function (c) { c.classList.remove('show-photo'); });
      });
    }
    var l = lang();
    japanChipsEl.innerHTML = '';
    GROUPS.forEach(function (g) {
      var chip = document.createElement('span');
      chip.className = 'country-chip';
      var label = document.createElement('span');
      label.textContent = g.names[l] || g.names.en;
      var popup = document.createElement('span');
      popup.className = 'country-popup';
      var routes = document.createElement('span');
      routes.className = 'country-routes';
      g.pairs.forEach(function (p) {
        var a = document.createElement('a');
        var from = valueOf(p[0]), to = valueOf(p[1]);
        a.href = '#';
        a.textContent = labelOf(p[0]) + ' → ' + labelOf(p[1]);
        a.addEventListener('click', function (e) {
          if (typeof window.planRouteFromChip === 'function') window.planRouteFromChip(e, from, to);
        });
        routes.appendChild(a);
      });
      popup.appendChild(routes);
      chip.appendChild(label);
      chip.appendChild(popup);
      chip.addEventListener('click', function (e) {
        e.stopPropagation();
        var wasOpen = chip.classList.contains('show-photo');
        japanChipsEl.querySelectorAll('.country-chip.show-photo').forEach(function (c) { c.classList.remove('show-photo'); });
        if (!wasOpen) chip.classList.add('show-photo');
      });
      japanChipsEl.appendChild(chip);
    });
  }

  var CONN = { en: 'to', es: 'a', fr: '\u00e0', it: 'a', de: 'nach', pt: 'a', ja: 'から' };
  var QUICK = [['tokyo', 'kyoto'], ['tokyo', 'osaka'], ['osaka', 'kyoto'], ['tokyo', 'hiroshima'], ['nagoya', 'kyoto']];
  var europeSuggestEl = document.querySelector('.ai-suggestions');
  var japanSuggestEl = null;

  function applyQuick(from, to) {
    inputEl.value = from + ' ' + (CONN[lang()] || 'to') + ' ' + to;
    var aurora = document.getElementById('aiInputAurora');
    if (aurora) aurora.classList.add('active');
    if (typeof window.previewFromInput === 'function') window.previewFromInput();
  }

  function buildSuggestions() {
    if (!europeSuggestEl) return;
    if (!japanSuggestEl) {
      japanSuggestEl = document.createElement('div');
      japanSuggestEl.className = 'ai-suggestions';
      japanSuggestEl.id = 'aiSuggestionsJapan';
      europeSuggestEl.parentNode.insertBefore(japanSuggestEl, europeSuggestEl.nextSibling);
    }
    japanSuggestEl.innerHTML = '';
    var label = europeSuggestEl.querySelector('.ai-suggestions-label');
    if (label) japanSuggestEl.appendChild(label.cloneNode(true));
    QUICK.forEach(function (p) {
      var from = valueOf(p[0]), to = valueOf(p[1]);
      var chip = document.createElement('span');
      chip.className = 'ai-suggestion';
      chip.setAttribute('role', 'button');
      chip.setAttribute('tabindex', '0');
      chip.textContent = labelOf(p[0]) + ' \u2192 ' + labelOf(p[1]);
      chip.addEventListener('click', function () { applyQuick(from, to); });
      chip.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); applyQuick(from, to); }
      });
      japanSuggestEl.appendChild(chip);
    });
  }

  function paintSwitch() {
    switchEl.setAttribute('aria-label', t('aria'));
    document.querySelectorAll('[data-hotels-brand]').forEach(function (el) { el.textContent = t('hotels'); });
    switchEl.querySelectorAll('.region-btn').forEach(function (b) {
      var r = b.getAttribute('data-region');
      if (!r) { b.textContent = t('hotels'); return; }
      b.textContent = t(r);
      var on = r === region;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function paintMode() {
    paintSwitch();
    if (region === 'japan') {
      inputEl.setAttribute('placeholder', t('ph'));
      buildChips();
      buildSuggestions();
      countriesEl.style.display = 'none';
      japanChipsEl.style.display = '';
      if (europeSuggestEl) europeSuggestEl.style.display = 'none';
      if (japanSuggestEl) japanSuggestEl.style.display = '';
      paintHome();
    } else {
      if (europePlaceholder) inputEl.setAttribute('placeholder', europePlaceholder);
      countriesEl.style.display = '';
      if (japanChipsEl) japanChipsEl.style.display = 'none';
      if (europeSuggestEl) europeSuggestEl.style.display = '';
      if (japanSuggestEl) japanSuggestEl.style.display = 'none';
    }
    syncRestoreBtn();
  }

  // "Ver mi última ruta": cada región recuerda la suya. La de Europa la guarda el sitio (ruta del
  // planificador IA); la de Japón se guarda acá, para no mostrar una ruta de Europa dentro de Japón.
  var JP_KEY = 'glosx_japan_last_route';
  function readJapanLast() {
    try {
      var o = JSON.parse(localStorage.getItem(JP_KEY) || 'null');
      if (o && Array.isArray(o.legs) && o.legs.length && Date.now() - o.ts < 24 * 3600 * 1000) return o;
    } catch (e) {}
    return null;
  }
  function saveJapanLast(legs) {
    try { localStorage.setItem(JP_KEY, JSON.stringify({ legs: legs, ts: Date.now() })); } catch (e) {}
    syncRestoreBtn();
  }
  function syncRestoreBtn() {
    var btn = document.getElementById('aiRestoreBtn');
    if (!btn) return;
    if (region === 'japan') { btn.style.display = readJapanLast() ? 'block' : 'none'; return; }
    var show = false;
    try {
      var ts = parseInt(localStorage.getItem('ai_last_route_timestamp'), 10);
      show = !!ts && (Date.now() - ts) / 3600000 < 24;
    } catch (e) {}
    btn.style.display = show ? 'block' : 'none';
  }
  document.addEventListener('click', function (e) {
    if (region !== 'japan' || !e.target.closest || !e.target.closest('#aiRestoreBtn')) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    var last = readJapanLast();
    if (!last || typeof window.glosxShowRoute !== 'function') return;
    var legs = last.legs.map(function (p) { return [valueOf(p[0]), valueOf(p[1])]; });
    window.glosxShowRoute(legs[0][0], legs[legs.length - 1][1], legs);
  }, true);

  function resetBoard(from, to) {
    var f = document.getElementById('rouletteFrom');
    var tEl = document.getElementById('rouletteTo');
    var book = document.getElementById('discoverCtaBook');
    var planner = document.querySelector('.ai-planner');
    if (f) f.textContent = from;
    if (tEl) tEl.textContent = to;
    if (book) book.hidden = true;
    if (planner) planner.classList.remove('is-roulette-done');
    var board = document.getElementById('pairRoulette');
    if (board) board.classList.remove('is-win', 'is-spinning', 'is-brake');
  }

  // Texto de ayuda del buscador (hero_subtitle): en idiomas donde nombra a Omio, en Japón nombra a Klook
  var subEl = document.querySelector('[data-i18n="hero_subtitle"]');
  var subBusy = false;
  function syncSubtitle() {
    if (!subEl || subBusy) return;
    subBusy = true;
    var txt = subEl.textContent;
    if (region === 'japan' && /Omio/.test(txt)) { subEl.setAttribute('data-eu-text', txt); subEl.textContent = txt.replace(/Omio/g, 'Klook'); }
    else if (region !== 'japan' && subEl.hasAttribute('data-eu-text')) { subEl.textContent = subEl.getAttribute('data-eu-text'); subEl.removeAttribute('data-eu-text'); }
    if (subObs) subObs.takeRecords();
    subBusy = false;
  }
  var subObs = subEl ? new MutationObserver(syncSubtitle) : null;
  if (subObs) subObs.observe(subEl, { childList: true, characterData: true, subtree: true });

  function setRegion(r, silent) {
    if (r === region) return;
    if (!europeCities) {
      europeCities = window._GLOSX_CITIES.slice();
      europePages = window.GLOSX_ROUTE_PAGES ? new Set(window.GLOSX_ROUTE_PAGES) : new Set();
    }
    region = r;
    document.body.setAttribute('data-region', r);
    inputEl.value = '';
    var aurora = document.getElementById('aiInputAurora');
    if (aurora) aurora.classList.remove('active');
    var err = document.getElementById('aiPlannerError');
    if (err) err.remove();
    if (r === 'japan') {
      setCities(CITIES);
      window.GLOSX_ROUTE_PAGES = japanPages;
      var res = document.getElementById('aiResults');
      if (res) res.style.display = 'none';
      resetBoard(valueOf('tokyo'), valueOf('kyoto'));
    } else {
      setCities(europeCities);
      window.GLOSX_ROUTE_PAGES = europePages;
      resetBoard('Madrid', 'Barcelona');
      if (typeof window.resetAIPlanner === 'function') window.resetAIPlanner();
    }
    paintMode();
    syncSubtitle();
    if (!silent) {
      track(r);
      // la dirección refleja la región elegida, así el cambio de idioma la conserva
      try { history.replaceState(null, '', location.pathname + location.search + (r === 'japan' ? '#japan' : '')); } catch (e) {}
    }
  }

  // Lectura flexible de lo que escribe la persona: acepta "Tokio a Kioto", "Tokio Kioto",
  // "Tokio - Kioto", "Tokio -> Kioto", "Tokio, Kioto", "Tokio y Kioto"... Busca los nombres
  // de ciudades dentro del texto (el más largo primero, así "Shin Osaka" gana a "Osaka").
  function fold(x) {
    return String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/から/g, ' ')
      .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  var kwIndex = null;
  function getKwIndex() {
    if (kwIndex) return kwIndex;
    var list = [];
    CITIES.forEach(function (c) {
      var seen = {};
      [c.display, c.slug].concat(c.keywords || []).forEach(function (k) {
        var f = fold(k);
        if (f && !seen[f]) { seen[f] = 1; list.push([f, c.slug]); }
      });
    });
    list.sort(function (a, b) { return b[0].length - a[0].length; });
    kwIndex = list;
    return list;
  }
  function findCities(text) {
    var t = ' ' + fold(text) + ' ';
    var found = [];
    getKwIndex().forEach(function (p) {
      var needle = ' ' + p[0] + ' ';
      var idx = t.indexOf(needle);
      while (idx !== -1) {
        var s0 = idx + 1, e0 = idx + needle.length - 1;
        var clash = found.some(function (f) { return s0 < f.e && e0 > f.s; });
        if (!clash) found.push({ s: s0, e: e0, slug: p[1] });
        idx = t.indexOf(needle, idx + 1);
      }
    });
    found.sort(function (a, b) { return a.s - b.s; });
    var order = [];
    found.forEach(function (f) { if (order.indexOf(f.slug) === -1) order.push(f.slug); });
    return order;
  }

  function showMsg(key, vars) {
    var wrap = document.getElementById('aiInputWrapper');
    if (!wrap) return;
    var old = document.getElementById('aiPlannerError');
    if (old) old.remove();
    var p = document.createElement('p');
    p.id = 'aiPlannerError';
    p.style.cssText = 'color:#C10016;font-size:15px;margin-top:16px;text-align:center;font-weight:600;';
    var txt = t(key);
    if (vars) Object.keys(vars).forEach(function (k) { txt = txt.replace('{' + k + '}', vars[k]); });
    p.textContent = txt;
    wrap.appendChild(p);
    setTimeout(function () { if (p.parentNode) p.remove(); }, 6000);
  }

  // En modo Japón no se le pregunta al planificador de Europa: se resuelve el par acá.
  var originalGenerate = window.generateAIRoute;
  function japanGenerate() {
    if (typeof window.previewFromInput !== 'function') return;
    var cities = findCities(inputEl.value).slice(0, 5);
    if (cities.length >= 3 && typeof window.glosxShowRoute === 'function') {
      var legs = [];
      for (var i = 0; i < cities.length - 1; i++) {
        if (!japanPages.has(cities[i] + '-' + cities[i + 1])) {
          return showMsg('leg', { a: labelOf(cities[i]), b: labelOf(cities[i + 1]) });
        }
        legs.push([valueOf(cities[i]), valueOf(cities[i + 1])]);
      }
      window.glosxShowRoute(legs[0][0], legs[legs.length - 1][1], legs);
      return;
    }
    if (window.previewFromInput()) return; // "A a B" con conector, par verificado
    if (cities.length === 2) {
      inputEl.value = valueOf(cities[0]) + ' ' + (CONN[lang()] || 'to') + ' ' + valueOf(cities[1]);
      if (window.previewFromInput()) return;
      return showMsg('nopair');
    }
    showMsg(cities.length ? 'two' : 'nopair');
  }
  window.generateAIRoute = function () {
    if (region === 'japan') return japanGenerate();
    return originalGenerate.apply(this, arguments);
  };
  inputEl.addEventListener('keydown', function (e) {
    if (region === 'japan' && e.key === 'Enter') {
      e.preventDefault();
      e.stopImmediatePropagation();
      japanGenerate();
    }
  }, true);


  // Datos reales de Klook (consulta del 05-oct-2026): duración del servicio más rápido, tipo de tren
  // y si hay Shinkansen. Todos los pares son directos. No se muestran precios: cambian.
  var INFO = {};
  'aomori-hachinohe,22,1,Hayabusa/Hayate;aomori-hirosaki,26,0,Tsugaru;aomori-shinhakodatehokuto,57,1,Hayabusa/Hayate;asakusa-kinugawaonsen,122,0,Revaty Aizu/Revaty Kinu;asakusa-nikko,107,0,Revaty Kegon/SPACIA X;atami-ito,17,0,Odoriko/Saphir Odoriko;atami-mishima,6,1,Kodama/Odoriko;atami-shizuoka,22,1,Kodama/Hikari;beppu-kokura,70,0,Sonic/Nichirin Seagaia;beppu-oita,9,0,Sonic/Yufu;beppu-yufuin,59,0,Yufu;fukuoka-beppu,111,0,Sonic/Yufu;fukuoka-hita,75,0,Yufu/Yufuin no Mori;fukuoka-huistenbosch,103,0,Huis Ten Bosch;fukuoka-kagoshima,83,1,Sakura/Mizuho;fukuoka-kokura,15,1,Nozomi/Sonic;fukuoka-kumamoto,36,1,Tsubame/Sakura;fukuoka-kurume,14,1,Tsubame/Sakura;fukuoka-nakatsu,72,0,Sonic/Nichirin Seagaia;fukuoka-oita,121,0,Sonic/Yufu;fukuoka-saga,40,0,Huis Ten Bosch;fukuoka-shinyamaguchi,34,1,Nozomi/Kodama;fukuoka-takeoonsen,60,0,Huis Ten Bosch;fukuoka-yufuin,132,0,Yufu/Yufuin no Mori;hakodate-noboribetsu,151,0,Hokuto;hakodate-sapporo,225,0,Hokuto;hakodate-shinhakodatehokuto,17,0,Hokuto;hiroshima-fukuoka,61,1,Nozomi/Kodama;hiroshima-fukuyama,22,1,Kodama/Nozomi;hiroshima-himeji,55,1,Nozomi/Kodama;hiroshima-kokura,45,1,Nozomi/Kodama;hiroshima-kumamoto,96,1,Sakura/Mizuho;hiroshima-okayama,34,1,Nozomi/Kodama;hiroshima-onomichi,28,1,Kodama/Hikari;hiroshima-shinyamaguchi,30,1,Kodama/Nozomi;kanazawa-fukui,22,1,Tsurugi/Kagayaki;kanazawa-kagaonsen,14,1,Tsurugi/Hakutaka;kanazawa-komatsu,10,1,Tsurugi/Hakutaka;kanazawa-nagano,65,1,Hakutaka/Kagayaki;kanazawa-nanao,52,0,Noto Kagaribi;kanazawa-toyama,18,1,Tsurugi/Hakutaka;kanazawa-tsuruga,39,1,Tsurugi/Kagayaki;kanazawa-ueda,100,1,Hakutaka;kansaiairport-kyoto,76,0,Haruka;kansaiairport-osaka,50,0,Haruka;kansaiairport-tennoji,32,0,Haruka;kyoto-fukuchiyama,75,0,Kinosaki/Hashidate;kyoto-gifu,85,0,Hida;kyoto-himeji,43,1,Nozomi/Hikari;kyoto-hiroshima,96,1,Nozomi/Hikari;kyoto-kinosaki,140,0,Kinosaki;kyoto-maibara,18,1,Hikari/Kodama;kyoto-nagoya,33,1,Nozomi/Hikari;kyoto-okayama,59,1,Nozomi/Hikari;kyoto-tsuruga,52,0,Thunderbird;kyoto-wakayama,96,0,Kuroshio;mishima-shinfuji,8,1,Kodama;mishima-shizuoka,16,1,Kodama/Hikari;morioka-akita,91,1,Komachi;morioka-aomori,47,1,Hayabusa/Hayate;morioka-hachinohe,27,1,Hayabusa/Hayate;morioka-shinhanamaki,11,1,Yamabiko/Hayabusa;nagano-karuizawa,22,1,Asama/Hakutaka;nagano-matsumoto,50,0,Shinano;nagano-toyama,45,1,Hakutaka/Kagayaki;nagano-ueda,11,1,Asama/Hakutaka;nagoya-gifu,19,0,Hida/Shirasagi;nagoya-hamamatsu,27,1,Kodama/Hikari;nagoya-himeji,78,1,Nozomi/Hikari;nagoya-hiroshima,131,1,Nozomi/Hikari;nagoya-maibara,23,1,Hikari/Kodama;nagoya-matsumoto,123,0,Shinano;nagoya-nagano,176,0,Shinano;nagoya-okayama,93,1,Nozomi/Hikari;nagoya-shizuoka,43,1,Kodama/Hikari;nagoya-takayama,135,0,Hida;nagoya-toyama,229,0,Hida;nagoya-toyohashi,19,1,Kodama/Hikari;naritaairport-shinagawa,62,0,Narita Express;naritaairport-tokyo,53,0,Narita Express;naritaairport-yokohama,83,0,Narita Express;niigata-akita,214,0,Inaho;niigata-joetsumyoko,119,0,Shirayuki;niigata-murakami,45,0,Inaho;niigata-nagaoka,16,1,Toki/Shirayuki;odawara-atami,7,1,Kodama/Odoriko;odawara-shizuoka,24,1,Kodama/Hikari;okayama-fukuoka,97,1,Nozomi/Kodama;okayama-fukuyama,15,1,Kodama/Nozomi;okayama-himeji,18,1,Nozomi/Kodama;okayama-kurashiki,11,0,Yakumo;okayama-matsue,154,0,Yakumo;okayama-yonago,129,0,Yakumo;osaka-fukuchiyama,98,0,Kounotori;osaka-fukuoka,144,1,Nozomi/Sakura;osaka-fukuyama,61,1,Nozomi/Sakura;osaka-hamamatsu,81,1,Hikari/Kodama;osaka-himeji,28,1,Nozomi/Hikari;osaka-hiroshima,80,1,Nozomi/Sakura;osaka-kagoshima,230,1,Sakura/Mizuho;osaka-kiitanabe,136,0,Kuroshio;osaka-kinosaki,166,0,Kounotori;osaka-kobe,12,1,Nozomi/Sakura;osaka-kokura,128,1,Nozomi/Sakura;osaka-kumamoto,178,1,Sakura/Mizuho;osaka-kyoto,13,1,Nozomi/Hikari;osaka-maibara,33,1,Hikari/Kodama;osaka-nagoya,47,1,Nozomi/Hikari;osaka-odawara,128,1,Kodama/Hikari;osaka-okayama,44,1,Nozomi/Sakura;osaka-shinfuji,149,1,Kodama;osaka-shinyamaguchi,112,1,Nozomi/Kodama;osaka-shirahama,148,0,Kuroshio;osaka-shizuoka,101,1,Hikari/Kodama;osaka-toyohashi,71,1,Kodama/Hikari;osaka-toyooka,155,0,Kounotori;osaka-tsuruga,76,0,Thunderbird;osaka-wakayama,62,0,Kuroshio;sapporo-asahikawa,85,0,Kamui;sapporo-chitose,27,0,Airport Rapid/Suzuran;sapporo-kushiro,234,0,Ozora;sapporo-newchitoseairport,33,0,Airport Rapid;sapporo-noboribetsu,70,0,Hokuto/Suzuran;sapporo-obihiro,141,0,Ozora/Tokachi;sapporo-otaru,34,0,Airport Rapid;sapporo-shinsapporo,8,0,Airport Rapid/Hokuto;sapporo-tomakomai,44,0,Hokuto/Suzuran;sapporo-wakkanai,312,0,Soya;sendai-akita,133,1,Komachi;sendai-aomori,86,1,Hayabusa;sendai-fukushima,20,1,Yamabiko;sendai-hachinohe,67,1,Hayabusa;sendai-ichinoseki,21,1,Yamabiko/Hayabusa;sendai-koriyama,35,1,Yamabiko;sendai-morioka,38,1,Hayabusa/Yamabiko;shinjuku-hakone,84,0,Romancecar;shinjuku-kawaguchiko,114,0,;shinjuku-kofu,85,0,Azusa/Kaiji;shinjuku-matsumoto,149,0,Azusa;shinjuku-naritaairport,78,0,Narita Express;shinjuku-odawara,70,0,Romancecar;shinjuku-otsuki,56,0,Kaiji/Azusa;shinyokohama-atami,18,1,Kodama/Hikari;shinyokohama-kyoto,109,1,Nozomi/Hikari;shinyokohama-mishima,24,1,Kodama/Hikari;shinyokohama-nagoya,75,1,Nozomi/Hikari;shinyokohama-odawara,14,1,Kodama/Hikari;shinyokohama-osaka,123,1,Nozomi/Hikari;takayama-gero,41,0,Hida;takayama-gifu,114,0,Hida;takayama-hidafurukawa,13,0,Hida;takayama-toyama,87,0,Hida;tokyo-akita,226,1,Komachi;tokyo-aomori,178,1,Hayabusa;tokyo-atami,36,1,Kodama/Odoriko;tokyo-fukuoka,292,1,Nozomi;tokyo-fukushima,78,1,Yamabiko/Tsubasa;tokyo-fukuyama,206,1,Nozomi;tokyo-hachinohe,164,1,Hayabusa;tokyo-hamamatsu,74,1,Kodama/Hikari;tokyo-himeji,174,1,Nozomi/Hikari;tokyo-hiroshima,227,1,Nozomi;tokyo-ichinoseki,113,1,Yamabiko/Hayabusa;tokyo-ito,96,0,Odoriko/Saphir Odoriko;tokyo-kanazawa,144,1,Kagayaki/Hakutaka;tokyo-karuizawa,60,1,Asama/Hakutaka;tokyo-kobe,156,1,Nozomi/Hikari;tokyo-kokura,275,1,Nozomi;tokyo-kyoto,127,1,Nozomi/Hikari;tokyo-maibara,130,1,Hikari/Kodama;tokyo-matsumoto,175,0,Azusa;tokyo-mishima,42,1,Kodama/Hikari;tokyo-mito,72,0,Tokiwa/Hitachi;tokyo-morioka,130,1,Hayabusa/Yamabiko;tokyo-nagano,77,1,Asama/Kagayaki;tokyo-nagaoka,88,1,Toki;tokyo-nagoya,93,1,Nozomi/Hikari;tokyo-niigata,89,1,Toki;tokyo-odawara,32,1,Kodama/Hikari;tokyo-okayama,189,1,Nozomi/Hikari;tokyo-osaka,141,1,Nozomi/Hikari;tokyo-sendai,90,1,Yamabiko/Hayabusa;tokyo-shinfuji,58,1,Kodama;tokyo-shinhakodatehokuto,237,1,Hayabusa;tokyo-shinyamaguchi,258,1,Nozomi;tokyo-shinyokohama,17,1,Nozomi/Kodama;tokyo-shizuoka,53,1,Kodama/Hikari;tokyo-takasaki,46,1,Toki/Asama;tokyo-toyama,124,1,Kagayaki/Hakutaka;tokyo-toyohashi,80,1,Kodama/Hikari;tokyo-ueda,78,1,Asama/Hakutaka;tokyo-utsunomiya,48,1,Yamabiko/Nasuno;tokyo-yamagata,142,1,Tsubasa;tokyo-yokohama,23,0,Narita Express/Odoriko;utsunomiya-fukushima,39,1,Yamabiko/Tsubasa;utsunomiya-nasushiobara,13,1,Nasuno/Yamabiko'.split(';').forEach(function (row) {
    var p = row.split(',');
    var v = { m: +p[1], s: p[2] === '1', t: p[3] ? p[3].split('/') : [] };
    var k = p[0].split('-');
    INFO[k[0] + '-' + k[1]] = v; INFO[k[1] + '-' + k[0]] = v;
  });
  var INFO_I18N = {
    en: { from: 'from {d}', direct: 'Direct' },
    es: { from: 'desde {d}', direct: 'Directo' },
    fr: { from: 'dès {d}', direct: 'Direct' },
    it: { from: 'da {d}', direct: 'Diretto' },
    de: { from: 'ab {d}', direct: 'Direkt' },
    pt: { from: 'a partir de {d}', direct: 'Direto' },
    ja: { from: '最短 {d}', direct: '直通' }
  };
  // El botón de reserva de cada tramo en modo Japón va a Klook (no a Omio): enlace directo y texto con la marca correcta
  var BUY_KLOOK = {
    en: 'View times & book on Klook →', es: 'Ver horarios y reservar en Klook →', fr: 'Voir les horaires et réserver sur Klook →',
    it: 'Vedi orari e prenota su Klook →', de: 'Fahrpläne ansehen & auf Klook buchen →', pt: 'Ver horários e reservar na Klook →',
    ja: '時刻を確認してKlookで予約 →'
  };
  // Panel "Opciones de viaje" en modo Japón (mismos estilos .pi/.rp-* que Europa). Solo hay dato verificado del
  // tren (Klook, consulta 05-oct-2026): duración del servicio más rápido y tipo de tren; no se inventa bus ni avión.
  var PI_JP = {
    en: { opts: 'Travel options', train: 'Train', note: 'Journey time of the fastest direct service, from Klook data (checked 5 Oct 2026). Seats and fares for your date are shown on Klook.', guide: 'See the full route guide' },
    es: { opts: 'Opciones de viaje', train: 'Tren', note: 'Duración del servicio directo más rápido, según datos de Klook (consulta del 5 de octubre de 2026). Los asientos y tarifas de tu fecha se muestran en Klook.', guide: 'Ver la guía completa de la ruta' },
    fr: { opts: 'Options de voyage', train: 'Train', note: 'Durée du service direct le plus rapide, d’après les données de Klook (consultation du 5 octobre 2026). Les places et tarifs de votre date s’affichent sur Klook.', guide: 'Voir le guide complet de la ligne' },
    it: { opts: 'Come viaggiare', train: 'Treno', note: 'Durata del servizio diretto più veloce, secondo i dati di Klook (consultazione del 5 ottobre 2026). Posti e tariffe per la tua data sono su Klook.', guide: 'Vedi la guida completa del percorso' },
    de: { opts: 'Reiseoptionen', train: 'Zug', note: 'Fahrzeit der schnellsten Direktverbindung laut Klook-Daten (Stand 5. Oktober 2026). Plätze und Preise für dein Datum siehst du bei Klook.', guide: 'Zur vollständigen Streckenübersicht' },
    pt: { opts: 'Opções de viagem', train: 'Comboio', note: 'Duração do serviço direto mais rápido, segundo dados da Klook (consulta de 5 de outubro de 2026). Lugares e tarifas para a tua data aparecem na Klook.', guide: 'Ver o guia completo da rota' },
    ja: { opts: '移動手段', train: '電車', note: 'Klookのデータによる、直通で最も速い列車の所要時間です（2026年10月5日確認）。ご希望日の座席と運賃はKlookでご確認ください。', guide: 'ルートガイドを見る' }
  };
  var TRAIN_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l2-4M15 21l-2-4"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/></svg>';
  // slugs reales de las guías de Japón (rutas/<slug>/) y correcciones de nombre de algunas estaciones
  var JP_GUIDES = ' aomori-hachinohe aomori-hirosaki aomori-shin-hakodate-hokuto asakusa-kinugawa-onsen asakusa-nikko atami-ito atami-mishima atami-shizuoka beppu-kokura beppu-oita beppu-yufuin fukuoka-beppu fukuoka-hita fukuoka-huis-ten-bosch fukuoka-kagoshima fukuoka-kokura fukuoka-kumamoto fukuoka-kurume fukuoka-nakatsu fukuoka-oita fukuoka-saga fukuoka-shin-yamaguchi fukuoka-takeo-onsen fukuoka-yufuin hakodate-noboribetsu hakodate-sapporo hakodate-shin-hakodate-hokuto hiroshima-fukuoka hiroshima-fukuyama hiroshima-himeji hiroshima-kokura hiroshima-kumamoto hiroshima-okayama hiroshima-onomichi hiroshima-shin-yamaguchi kanazawa-fukui kanazawa-kaga-onsen kanazawa-komatsu kanazawa-nagano kanazawa-nanao kanazawa-toyama kanazawa-tsuruga kanazawa-ueda kansai-airport-kyoto kansai-airport-osaka kansai-airport-tennoji kyoto-fukuchiyama kyoto-gifu kyoto-himeji kyoto-hiroshima kyoto-kinosaki kyoto-maibara kyoto-nagoya kyoto-okayama kyoto-tsuruga kyoto-wakayama mishima-shin-fuji mishima-shizuoka morioka-akita morioka-aomori morioka-hachinohe morioka-shin-hanamaki nagano-karuizawa nagano-matsumoto nagano-toyama nagano-ueda nagoya-gifu nagoya-hamamatsu nagoya-himeji nagoya-hiroshima nagoya-maibara nagoya-matsumoto nagoya-nagano nagoya-okayama nagoya-shizuoka nagoya-takayama nagoya-toyama nagoya-toyohashi narita-airport-shinagawa narita-airport-yokohama narita-tokyo niigata-akita niigata-joetsu-myoko niigata-murakami niigata-nagaoka odawara-atami odawara-shizuoka okayama-fukuoka okayama-fukuyama okayama-himeji okayama-kurashiki okayama-matsue okayama-yonago osaka-fukuchiyama osaka-fukuoka osaka-fukuyama osaka-hamamatsu osaka-himeji osaka-hiroshima osaka-kagoshima osaka-kii-tanabe osaka-kinosaki osaka-kobe osaka-kokura osaka-kumamoto osaka-kyoto osaka-maibara osaka-nagoya osaka-odawara osaka-okayama osaka-shin-fuji osaka-shin-yamaguchi osaka-shirahama osaka-shizuoka osaka-toyohashi osaka-toyooka osaka-tsuruga osaka-wakayama sapporo-asahikawa sapporo-chitose sapporo-kushiro sapporo-new-chitose-airport sapporo-noboribetsu sapporo-obihiro sapporo-otaru sapporo-shin-sapporo sapporo-tomakomai sapporo-wakkanai sendai-akita sendai-aomori sendai-fukushima sendai-hachinohe sendai-ichinoseki sendai-koriyama sendai-morioka shin-yokohama-atami shin-yokohama-kyoto shin-yokohama-mishima shin-yokohama-nagoya shin-yokohama-odawara shin-yokohama-osaka shinjuku-hakone shinjuku-kawaguchiko shinjuku-kofu shinjuku-matsumoto shinjuku-narita-airport shinjuku-odawara shinjuku-otsuki takayama-gero takayama-gifu takayama-hida-furukawa takayama-toyama tokyo-akita tokyo-aomori tokyo-atami tokyo-fukuoka tokyo-fukushima tokyo-fukuyama tokyo-hachinohe tokyo-hamamatsu tokyo-himeji tokyo-hiroshima tokyo-ichinoseki tokyo-ito tokyo-kanazawa tokyo-karuizawa tokyo-kobe tokyo-kokura tokyo-kyoto tokyo-maibara tokyo-matsumoto tokyo-mishima tokyo-mito tokyo-morioka tokyo-nagano tokyo-nagaoka tokyo-nagoya tokyo-niigata tokyo-odawara tokyo-okayama tokyo-osaka tokyo-sendai tokyo-shin-fuji tokyo-shin-hakodate-hokuto tokyo-shin-yamaguchi tokyo-shin-yokohama tokyo-shizuoka tokyo-takasaki tokyo-toyama tokyo-toyohashi tokyo-ueda tokyo-utsunomiya tokyo-yamagata tokyo-yokohama utsunomiya-fukushima utsunomiya-nasu-shiobara ';
  var SLUG_FIX = { naritaairport: 'narita-airport', kansaiairport: 'kansai-airport', newchitoseairport: 'new-chitose-airport', hidafurukawa: 'hida-furukawa', huistenbosch: 'huis-ten-bosch', joetsumyoko: 'joetsu-myoko', kagaonsen: 'kaga-onsen', kiitanabe: 'kii-tanabe', kinugawaonsen: 'kinugawa-onsen', nasushiobara: 'nasu-shiobara', shinfuji: 'shin-fuji', shinhakodatehokuto: 'shin-hakodate-hokuto', shinhanamaki: 'shin-hanamaki', shinsapporo: 'shin-sapporo', shinyamaguchi: 'shin-yamaguchi', shinyokohama: 'shin-yokohama', takeoonsen: 'takeo-onsen' };
  function guideHref(a, b) {
    var l = lang(), suffix = { es: 'es/', fr: 'fr/', it: 'it/', ja: 'ja/' }[l] || '';
    var fa = SLUG_FIX[a] || a, fb = SLUG_FIX[b] || b;
    var c = [fa + '-' + fb, fb + '-' + fa, a + '-' + b, b + '-' + a], i;
    for (i = 0; i < c.length; i++) if (JP_GUIDES.indexOf(' ' + c[i] + ' ') > -1) return '/rutas/' + c[i] + '/' + suffix;
    return null;
  }
  function paintPanel(seg, d, a, b, tx) {
    var key = a + '|' + b + '|' + lang();
    if (seg.getAttribute('data-pi-jp') === key) return;
    var old = seg.querySelector('.pi.pi-jp');
    if (old) old.remove();
    var buy = seg.querySelector('a.ai-segment-buy');
    if (!buy) return;
    var t = PI_JP[lang()] || PI_JP.en;
    var g = guideHref(a, b);
    var box = document.createElement('div');
    box.className = 'pi pi-jp';
    box.innerHTML = '<div class="rp-eyebrow pi-eyebrow">' + esc(t.opts) + '</div><div class="rp-modes pi-modes">' +
      '<div class="rp-row is-train"><span class="rp-ico">' + TRAIN_ICON + '</span>' +
      '<div><div class="rp-label">' + esc(t.train) + '</div><div class="rp-bar" aria-hidden="true"><i style="width:100%"></i></div></div>' +
      '<span class="rp-meta"><span class="rp-time">' + esc(tx.from.replace('{d}', fmtMin(d.m))) + '</span><span class="rp-price">' + esc(tx.direct) + '</span></span></div>' +
      '</div><p class="rp-note pi-note">' + esc(t.note) + '</p>' +
      (g ? '<a class="pi-guide" href="' + esc(g) + '">' + esc(t.guide) + ' <span aria-hidden="true">→</span></a>' : '');
    seg.insertBefore(box, buy);
    seg.setAttribute('data-pi-jp', key);
  }
  function fmtMin(m) {
    var h = Math.floor(m / 60), r = m % 60;
    return h ? (r ? h + ' h ' + r + ' min' : h + ' h') : m + ' min';
  }
  var durEl = document.getElementById('aiRouteDuration');
  var metaEl = document.getElementById('aiRouteMeta');
  var segsEl = document.getElementById('aiSegments');
  var infoBusy = false;
  var infoObs = null;
  function trainLabel(d, tx) {
    var parts = [];
    if (d.s) parts.push('Shinkansen');
    if (d.t.length) parts.push(d.t.join(', '));
    parts.push(tx.direct);
    return parts.join(' · ');
  }
  function paintInfo() {
    if (region !== 'japan' || !segsEl || infoBusy) return;
    var segs = segsEl.querySelectorAll('.ai-segment');
    if (!segs.length) return;
    var tx = INFO_I18N[lang()] || INFO_I18N.en;
    infoBusy = true;
    var total = 0, all = true, first = null, chain = [];
    Array.prototype.forEach.call(segs, function (seg) {
      var r = seg.querySelector('.ai-segment-route');
      var c = r ? findCities(r.textContent) : [];
      var d = c.length >= 2 ? INFO[c[0] + '-' + c[1]] : null;
      if (!d) { all = false; return; }
      if (!first) first = d;
      chain.push([c[0], c[1]]);
      total += d.m;
      var buy = seg.querySelector('a.ai-segment-buy');
      if (buy) {
        buy.setAttribute('href', bookUrl(c[0], c[1]));
        buy.setAttribute('data-klook', '1');
        buy.textContent = BUY_KLOOK[lang()] || BUY_KLOOK.en;
      }
      paintPanel(seg, d, c[0], c[1], tx);
      var tm = seg.querySelector('.ai-segment-time');
      if (tm) tm.textContent = tx.from.replace('{d}', fmtMin(d.m));
      var tr = seg.querySelector('.ai-segment-train');
      if (tr) tr.textContent = trainLabel(d, tx);
    });
    if (all && durEl) durEl.textContent = tx.from.replace('{d}', fmtMin(total));
    if (all && segs.length === 1 && metaEl && first) {
      metaEl.textContent = metaEl.textContent.split(' · ')[0] + ' · ' + trainLabel(first, tx);
    }
    if (infoObs) infoObs.takeRecords();
    infoBusy = false;
    if (all && chain.length) saveJapanLast(chain);
  }
  if (segsEl) {
    infoObs = new MutationObserver(paintInfo);
    infoObs.observe(segsEl, { childList: true, characterData: true, subtree: true });
  }


  // ===== Portada en modo Japón: texto del hero, operadores, trenes panorámicos y recorridos =====
  // Las piezas de Europa no se tocan: se marcan .eu-only y al lado se agregan sus versiones .jp-only;
  // el CSS muestra unas u otras según body[data-region]. Así el cambio de idioma de Europa sigue igual.
  // Todos los trenes y tramos son pares verificados en Klook (duración más rápida, consulta 05-oct-2026).
  var BOOK_API = 'https://voxa-production-dc15.up.railway.app/affiliate/klook-train';
  var HOME_I18N = {
    en: { ess: 'for Japan.', badge: 'AI rail planner for Japan', label: 'Iconic Japanese routes', lead: 'Japan’s most beautiful train journeys — book directly from here.', featured: 'Featured route', book: 'Book on Klook', buy: 'View times and book on Klook', arrival: 'Arrival', from: 'from' },
    es: { ess: 'para Jap\u00f3n.', badge: 'Planificador IA de trenes de Japón', label: 'Rutas icónicas de Japón', lead: 'Los viajes en tren más bonitos de Japón, con reserva directa desde aquí.', featured: 'Ruta destacada', book: 'Reservar en Klook', buy: 'Ver horarios y reservar en Klook', arrival: 'Llegada', from: 'desde' },
    fr: { ess: 'pour le Japon.', badge: 'Planificateur IA de trains au Japon', label: 'Itinéraires emblématiques du Japon', lead: 'Les plus beaux trajets en train du Japon, à réserver directement ici.', featured: 'Itinéraire à la une', book: 'R\u00e9server sur Klook', buy: 'Voir les horaires et r\u00e9server sur Klook', arrival: 'Arrivée', from: 'dès' },
    it: { ess: 'per il Giappone.', badge: 'Pianificatore IA di treni in Giappone', label: 'Percorsi iconici del Giappone', lead: 'I viaggi in treno più belli del Giappone, da prenotare direttamente qui.', featured: 'Percorso in evidenza', book: 'Prenota su Klook', buy: 'Vedi orari e prenota su Klook', arrival: 'Arrivo', from: 'da' },
    de: { ess: 'f\u00fcr Japan.', badge: 'KI-Zugplaner für Japan', label: 'Ikonische Strecken in Japan', lead: 'Japans schönste Zugreisen – direkt hier buchen.', featured: 'Empfohlene Strecke', book: 'Bei Klook buchen', buy: 'Zeiten ansehen und bei Klook buchen', arrival: 'Ankunft', from: 'ab' },
    pt: { ess: 'para o Jap\u00e3o.', badge: 'Planejador IA de comboios no Japão', label: 'Rotas icónicas do Japão', lead: 'As viagens de comboio mais bonitas do Japão, reserve diretamente aqui.', featured: 'Rota em destaque', book: 'Reservar na Klook', buy: 'Ver hor\u00e1rios e reservar na Klook', arrival: 'Chegada', from: 'desde' },
    ja: { ess: '日本編。', badge: '日本の列車AIプランナー', label: '日本の名路線', lead: '日本でいちばん景色のいい列車の旅。ここからそのまま予約できます。', featured: '注目の路線', book: 'Klookで予約', buy: '時刻を見てKlookで予約', arrival: '到着', from: '最短' }
  };
  function ht(k) { return (HOME_I18N[lang()] || HOME_I18N.en)[k]; }
  var CITY_LOC = { es: { Tokyo: 'Tokio', Kyoto: 'Kioto' }, pt: { Tokyo: 'Tóquio', Kyoto: 'Quioto' }, ja: { Tokyo: '東京', Kyoto: '京都', 'Fukuoka (Hakata)': '福岡（博多）', Yufuin: '由布院', 'Ito (Izu)': '伊東（伊豆）', Shinjuku: '新宿', Hakone: '箱根', Asakusa: '浅草', Nikko: '日光', Nagoya: '名古屋', Takayama: '高山' } };
  function city(n) { var m = CITY_LOC[lang()]; return (m && m[n]) || n; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function bookUrl(a, b) { return BOOK_API + '?from=' + encodeURIComponent(a) + '&to=' + encodeURIComponent(b); }

  var JP_SCENIC = [
    { name: 'Yufuin no Mori', from: 'fukuoka', to: 'yufuin', a: 'Fukuoka (Hakata)', b: 'Yufuin', photo: '/scenic/jp-yufuin.webp',
      desc: { en: 'JR Kyushu’s design train, with wooden interiors, to the hot-spring town of Yufuin.', es: 'El tren de diseño de JR Kyushu, con interiores de madera, hacia el pueblo termal de Yufuin.', fr: 'Le train design de JR Kyushu, aux intérieurs en bois, vers la ville thermale de Yufuin.', it: 'Il treno di design di JR Kyushu, con interni in legno, verso la cittadina termale di Yufuin.', de: 'Der Designzug von JR Kyushu mit Holzinterieur zum Thermalort Yufuin.', pt: 'O comboio de design da JR Kyushu, com interiores em madeira, até a vila termal de Yufuin.', ja: 'JR九州のデザイン列車。木の内装で、温泉の町・由布院へ。' } },
    { name: 'Saphir Odoriko', from: 'tokyo', to: 'ito', a: 'Tokyo', b: 'Ito (Izu)', photo: '/scenic/jp-izu.webp',
      desc: { en: 'JR East’s premium train to the Izu Peninsula, with large windows facing the Pacific.', es: 'El tren de lujo de JR East hacia la península de Izu, con grandes ventanales al Pacífico.', fr: 'Le train premium de JR East vers la péninsule d’Izu, avec de grandes baies face au Pacifique.', it: 'Il treno di lusso di JR East verso la penisola di Izu, con grandi finestrini sul Pacifico.', de: 'Der Premiumzug von JR East zur Izu-Halbinsel, mit großen Fenstern zum Pazifik.', pt: 'O comboio de luxo da JR East até à península de Izu, com grandes janelas para o Pacífico.', ja: 'JR東日本の特別列車。大きな窓から太平洋を見ながら伊豆半島へ。' } },
    { name: 'Romancecar', from: 'shinjuku', to: 'hakone', a: 'Shinjuku', b: 'Hakone', photo: '/scenic/jp-hakone.webp',
      desc: { en: 'Odakyu’s express from Shinjuku to Hakone, gateway to hot springs and Mount Fuji views.', es: 'El expreso de Odakyu desde Shinjuku a Hakone, puerta a las aguas termales y a las vistas del Fuji.', fr: 'L’express Odakyu de Shinjuku à Hakone, porte des sources chaudes et des vues sur le Fuji.', it: 'L’espresso Odakyu da Shinjuku a Hakone, porta delle terme e delle viste sul Fuji.', de: 'Der Odakyu-Express von Shinjuku nach Hakone, Tor zu heißen Quellen und Fuji-Blicken.', pt: 'O expresso da Odakyu de Shinjuku a Hakone, porta para as termas e as vistas do Fuji.', ja: '小田急の特急。新宿から箱根へ。温泉と富士山の眺めへの入口です。' } },
    { name: 'SPACIA X', from: 'asakusa', to: 'nikko', a: 'Asakusa', b: 'Nikko', photo: '/scenic/jp-nikko.webp',
      desc: { en: 'Tobu’s flagship train from Asakusa to Nikko, its shrines and mountains.', es: 'El tren insignia de Tobu desde Asakusa a Nikko, sus santuarios y montañas.', fr: 'Le train phare de Tobu d’Asakusa à Nikko, ses sanctuaires et ses montagnes.', it: 'Il treno di punta di Tobu da Asakusa a Nikko, i suoi santuari e le sue montagne.', de: 'Tobus Flaggschiffzug von Asakusa nach Nikko, zu Schreinen und Bergen.', pt: 'O comboio de referência da Tobu de Asakusa a Nikko, com os seus santuários e montanhas.', ja: '東武の看板列車。浅草から日光の社寺と山へ。' } },
    { name: 'Hida', from: 'nagoya', to: 'takayama', a: 'Nagoya', b: 'Takayama', photo: '/scenic/jp-takayama.webp',
      desc: { en: 'Limited express that climbs from Nagoya through the Hida valleys to Takayama.', es: 'Expreso limitado que sube desde Nagoya por los valles de Hida hasta Takayama.', fr: 'Express limité qui monte de Nagoya par les vallées de Hida jusqu’à Takayama.', it: 'Espresso limitato che sale da Nagoya lungo le valli di Hida fino a Takayama.', de: 'Expresszug, der von Nagoya durch die Hida-Täler nach Takayama fährt.', pt: 'Expresso limitado que sobe de Nagoya pelos vales de Hida até Takayama.', ja: '名古屋から飛騨の谷を上り、高山へ行く特急。' } },
    { name: 'Tokaido Shinkansen', from: 'tokyo', to: 'kyoto', a: 'Tokyo', b: 'Kyoto', photo: '/scenic/jp-tokaido.webp',
      desc: { en: 'The Nozomi links Tokyo and Kyoto; on clear days you can see Mount Fuji.', es: 'El Nozomi une Tokio y Kioto; en días despejados se ve el monte Fuji.', fr: 'Le Nozomi relie Tokyo et Kyoto ; par temps clair, on aperçoit le mont Fuji.', it: 'Il Nozomi collega Tokyo e Kyoto; nelle giornate limpide si vede il monte Fuji.', de: 'Der Nozomi verbindet Tokio und Kyoto; bei klarem Wetter sieht man den Fuji.', pt: 'O Nozomi liga Tóquio e Quioto; em dias limpos vê-se o monte Fuji.', ja: 'のぞみが東京と京都をつなぎます。晴れた日には富士山が見えます。' } }
  ];

  var JP_ROUTES = {
    'jp-tokaido': { stops: ['tokyo', 'odawara', 'osaka', 'kyoto'],
      title: { en: 'Classic Tokaido route', es: 'Ruta clásica Tokaido', fr: 'Route classique du Tokaido', it: 'Percorso classico del Tokaido', de: 'Klassische Tokaido-Route', pt: 'Rota clássica Tokaido', ja: '東海道の定番ルート' },
      meta: { en: 'Shinkansen · Hakone from Odawara', es: 'Shinkansen · Hakone desde Odawara', fr: 'Shinkansen · Hakone depuis Odawara', it: 'Shinkansen · Hakone da Odawara', de: 'Shinkansen · Hakone ab Odawara', pt: 'Shinkansen · Hakone a partir de Odawara', ja: '新幹線 · 小田原から箱根' } },
    'jp-alps': { stops: ['nagoya', 'takayama', 'toyama', 'kanazawa', 'nagano'],
      title: { en: 'Japanese Alps route', es: 'Ruta de los Alpes japoneses', fr: 'Route des Alpes japonaises', it: 'Percorso delle Alpi giapponesi', de: 'Route der Japanischen Alpen', pt: 'Rota dos Alpes japoneses', ja: '日本アルプスのルート' },
      meta: { en: 'Hida limited express and Hokuriku Shinkansen', es: 'Expreso Hida y Shinkansen Hokuriku', fr: 'Express Hida et Shinkansen Hokuriku', it: 'Espresso Hida e Shinkansen Hokuriku', de: 'Hida-Express und Hokuriku-Shinkansen', pt: 'Expresso Hida e Shinkansen Hokuriku', ja: '特急ひだと北陸新幹線' } },
    'jp-kyushu': { stops: ['fukuoka', 'yufuin', 'beppu', 'kokura'],
      title: { en: 'Essential Kyushu', es: 'Kyushu esencial', fr: 'Kyushu essentiel', it: 'Kyushu essenziale', de: 'Kyushu kompakt', pt: 'Kyushu essencial', ja: '九州の要点' },
      meta: { en: 'Yufu trains, hot springs and Sonic express', es: 'Trenes Yufu, aguas termales y expreso Sonic', fr: 'Trains Yufu, sources chaudes et express Sonic', it: 'Treni Yufu, terme ed espresso Sonic', de: 'Yufu-Züge, heiße Quellen und Sonic-Express', pt: 'Comboios Yufu, termas e expresso Sonic', ja: 'ゆふいんの森、温泉、特急ソニック' } }
  };
  var JP_ROUTE_ORDER = ['jp-tokaido', 'jp-alps', 'jp-kyushu'];

  // Icono de cada operador: favicon de su sitio oficial (con www; sin www el servicio devuelve un globo genérico)
  var OPERATORS = [['JR East', 'www.jreast.co.jp'], ['JR Central', 'www.jr-central.co.jp'], ['JR West', 'www.westjr.co.jp'], ['JR Kyushu', 'www.jrkyushu.co.jp'], ['JR Hokkaido', 'www.jrhokkaido.co.jp'], ['Odakyu', 'www.odakyu.jp'], ['Tobu', 'www.tobu.co.jp']];

  var homeReady = false, jpFeatured = 0, jpRouteKey = null;
  var jpEls = {};
  function twin(orig, tag, cls) {
    if (!orig) return null;
    orig.classList.add('eu-only');
    var el = document.createElement(tag || orig.tagName.toLowerCase());
    el.className = (cls != null ? cls : orig.className.replace(/\beu-only\b/, '').trim()) + ' jp-only';
    orig.parentNode.insertBefore(el, orig.nextSibling);
    return el;
  }
  function setupHome() {
    if (homeReady) return;
    homeReady = true;
    jpEls.badge = twin(document.querySelector('[data-i18n="hero_badge"]'));
    jpEls.ops = Array.prototype.map.call(document.querySelectorAll('.trust-ops'), function (o) {
      var el = twin(o, 'div', 'trust-ops');
      el.innerHTML = OPERATORS.map(function (o) { return '<span class="op-chip"><img src="https://www.google.com/s2/favicons?sz=64&amp;domain=' + o[1] + '" alt="' + o[0] + '" loading="lazy"/>' + o[0] + '</span>'; }).join('');
      return el;
    });
    jpEls.label = twin(document.querySelector('[data-i18n="scenic_label"]'));
    jpEls.essTitle = twin(document.querySelector('[data-i18n="partners_title2"]'));
    jpEls.lead = twin(document.querySelector('[data-i18n="scenic_lead"]'));
    jpEls.feature = twin(document.getElementById('scenicFeature'), 'div', 'scenic-feature');
    jpEls.grid = twin(document.getElementById('scenicGrid'), 'div', 'scenic-grid');
    var tog = document.getElementById('scenicToggle');
    if (tog && tog.parentNode) tog.parentNode.classList.add('eu-only');
    var btns = document.querySelector('.wt-route-buttons');
    jpEls.buttons = twin(btns, 'div', 'wt-route-buttons');
    if (jpEls.buttons) jpEls.buttons.setAttribute('role', 'group');
    var wrap = document.getElementById('wt-wrap');
    jpEls.wrap = twin(wrap, 'div', 'wt-timeline-wrap');
    if (jpEls.wrap) {
      jpEls.wrap.hidden = true;
      jpEls.wrap.innerHTML = '<button class="wt-close" type="button" aria-label="Close">&times;</button>' +
        '<div class="wt-timeline-head"><h3></h3><span class="wt-route-meta"></span></div><ol class="wt-timeline jp-tl"></ol>';
      jpEls.wrap.querySelector('.wt-close').addEventListener('click', function () { jpRouteKey = null; jpEls.wrap.hidden = true; paintRouteButtons(); });
    }
    // Europa abierta al pasar a Japón: se cierra para que no quede debajo
    var euClose = document.getElementById('wt-close');
    if (euClose && wrap && !wrap.hidden) euClose.click();

    if (jpEls.grid) jpEls.grid.addEventListener('click', function (e) {
      var cta = e.target.closest('.scenic-cta');
      var card = e.target.closest('.scenic-wrapper');
      if (!card) return;
      e.preventDefault();
      var i = +card.getAttribute('data-i');
      if (cta) return openBook(JP_SCENIC[i].from, JP_SCENIC[i].to, 'scenic_jp');
      featureJp(i);
      if (jpEls.feature) jpEls.feature.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    if (jpEls.feature) jpEls.feature.addEventListener('click', function (e) {
      if (!e.target.closest('.sf-btn')) return;
      var s = JP_SCENIC[jpFeatured];
      openBook(s.from, s.to, 'scenic_jp_featured');
    });
    if (jpEls.buttons) jpEls.buttons.addEventListener('click', function (e) {
      var b = e.target.closest('.wt-route-btn');
      if (!b) return;
      renderJpRoute(b.getAttribute('data-route'));
      jpEls.wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    if (jpEls.wrap) jpEls.wrap.addEventListener('click', function (e) {
      var b = e.target.closest('.wt-stop-buy');
      if (b) openBook(b.getAttribute('data-a'), b.getAttribute('data-b'), 'adventure_jp');
    });
    window.addEventListener('resize', positionJpDescs);
  }
  function openBook(a, b, src) {
    try { gtag('event', 'klook_click', { source: src, route: a + '-' + b }); } catch (e) {}
    window.open(bookUrl(a, b), '_blank', 'noopener');
  }
  function legInfo(a, b) { return INFO[a + '-' + b] || null; }
  function featureJp(i) {
    var s = JP_SCENIC[i];
    if (!s || !jpEls.feature) return;
    jpFeatured = i;
    var d = legInfo(s.from, s.to);
    jpEls.feature.style.background = "url('" + s.photo + "') center/cover no-repeat";
    jpEls.feature.innerHTML = '<div class="sf-content"><span class="sf-badge">' + esc(ht('featured')) + '</span>' +
      '<div class="sf-name">' + esc(s.name) + '</div>' +
      '<div class="sf-route">' + esc(city(s.a)) + ' → ' + esc(city(s.b)) + (d ? ' · ' + esc(ht('from')) + ' ' + fmtMin(d.m) : '') + '</div>' +
      '<div class="sf-desc">' + esc(s.desc[lang()] || s.desc.en) + '</div>' +
      '<button type="button" class="sf-btn">' + esc(ht('book')) + ' →</button></div>';
    Array.prototype.forEach.call(jpEls.grid ? jpEls.grid.children : [], function (w, idx) { w.classList.toggle('scenic-active', idx === i); });
  }
  function renderJpScenic() {
    if (!jpEls.grid) return;
    jpEls.grid.innerHTML = JP_SCENIC.map(function (s, i) {
      var d = legInfo(s.from, s.to);
      return '<div class="scenic-wrapper' + (i === jpFeatured ? ' scenic-active' : '') + '" data-i="' + i + '">' +
        '<a href="#" class="scenic-card"><div class="scenic-photo" style="background-image:url(\'' + s.photo + '\')"><span class="scenic-dur">' + (d ? fmtMin(d.m) : '') + '</span></div>' +
        '<div class="scenic-body"><div class="scenic-name">' + esc(s.name) + '</div><div class="scenic-route">' + esc(city(s.a)) + ' → ' + esc(city(s.b)) + '</div></div>' +
        '<div class="scenic-cta">' + esc(ht('book')) + '</div></a>' +
        '<div class="scenic-desc">' + esc(s.desc[lang()] || s.desc.en) + '</div></div>';
    }).join('');
    featureJp(jpFeatured);
    requestAnimationFrame(positionJpDescs);
  }
  function positionJpDescs() {
    var g = jpEls.grid;
    if (!g || region !== 'japan') return;
    var c = g.getBoundingClientRect().left + g.offsetWidth / 2;
    Array.prototype.forEach.call(g.children, function (w) {
      w.classList.toggle('desc-left', w.getBoundingClientRect().left + w.offsetWidth / 2 < c);
    });
  }
  function stopsLabel(key) {
    return JP_ROUTES[key].stops.map(function (s) { return labelOf(s); }).join(' → ');
  }
  function paintRouteButtons() {
    if (!jpEls.buttons) return;
    jpEls.buttons.innerHTML = JP_ROUTE_ORDER.map(function (k) {
      var r = JP_ROUTES[k];
      return '<button class="wt-route-btn" data-route="' + k + '" aria-pressed="' + (k === jpRouteKey ? 'true' : 'false') + '">' +
        '<span>' + esc(r.title[lang()] || r.title.en) + '</span>' +
        '<span class="wt-route-stops">' + esc(stopsLabel(k)) + '</span>' +
        '<span class="wt-route-go">' + esc({ en: 'View itinerary', es: 'Ver itinerario', fr: 'Voir l’itinéraire', it: 'Vedi itinerario', de: 'Reiseplan ansehen', pt: 'Ver itinerário', ja: '旅程を見る' }[lang()] || 'View itinerary') + '</span></button>';
    }).join('');
  }
  function renderJpRoute(key) {
    var r = JP_ROUTES[key];
    if (!r || !jpEls.wrap) return;
    jpRouteKey = key;
    var w = jpEls.wrap;
    w.hidden = false;
    w.setAttribute('data-route', key);
    w.querySelector('h3').textContent = r.title[lang()] || r.title.en;
    var total = 0;
    for (var j = 0; j < r.stops.length - 1; j++) { var dd = legInfo(r.stops[j], r.stops[j + 1]); if (dd) total += dd.m; }
    w.querySelector('.wt-route-meta').textContent = (r.meta[lang()] || r.meta.en) + ' · ' + ht('from') + ' ' + fmtMin(total);
    var tx = INFO_I18N[lang()] || INFO_I18N.en;
    w.querySelector('ol').innerHTML = r.stops.map(function (s, i) {
      var next = r.stops[i + 1];
      var d = next ? legInfo(s, next) : null;
      var chip = next ? ((d && d.t.length ? d.t.slice(0, 2).join(', ') : '') + (d ? ' · ' + fmtMin(d.m) : '')) : ht('arrival');
      return '<li class="wt-stop" style="animation-delay:' + (i * 0.12) + 's">' +
        '<span class="wt-stop-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="13" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="M8 19l-2 3"/><path d="M18 22l-2-3"/><circle cx="7.5" cy="14.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="16.5" cy="14.5" r="1.4" fill="currentColor" stroke="none"/></svg></span>' +
        '<p class="wt-stop-station">' + esc(labelOf(s)) + '</p>' +
        '<span class="wt-stop-train">' + (next ? '&#8594; ' : '') + esc(chip) + (d && d.s ? ' · Shinkansen' : '') + (next ? ' · ' + esc(tx.direct) : '') + '</span>' +
        (next ? '<button type="button" class="wt-stop-buy" data-a="' + s + '" data-b="' + next + '">' + esc(ht('buy')) + ' →</button>' : '') +
        '</li>';
    }).join('');
    paintRouteButtons();
  }
  function paintHome() {
    if (region !== 'japan') return;
    setupHome();
    if (jpEls.badge) jpEls.badge.textContent = ht('badge');
    if (jpEls.label) jpEls.label.textContent = ht('label');
    if (jpEls.lead) jpEls.lead.textContent = ht('lead');
    if (jpEls.essTitle) jpEls.essTitle.textContent = ht('ess');
    renderJpScenic();
    paintRouteButtons();
    if (jpRouteKey) renderJpRoute(jpRouteKey);
  }

  // Panel de hoteles dentro de la propia tarjeta del buscador (sin scroll): reutiliza el menú de ciudades de Klook.
  var HOTEL_UI = {
    en: { all: 'All cities', ci: 'Check-in', co: 'Check-out', ph: 'City, area or landmark', lab: 'Where to?', pop: 'Popular destinations', go: 'Search hotels', none: 'No matches — try another city' },
    es: { all: 'Todas las ciudades', ci: 'Entrada', co: 'Salida', ph: 'Ciudad o zona', lab: '¿A dónde?', pop: 'Destinos populares', go: 'Buscar hoteles', none: 'Sin resultados: prueba otra ciudad' },
    fr: { all: 'Toutes les villes', ci: 'Arrivée', co: 'Départ', ph: 'Ville ou quartier', lab: 'Où allez-vous ?', pop: 'Destinations populaires', go: 'Rechercher des hôtels', none: 'Aucun résultat : essayez une autre ville' },
    it: { all: 'Tutte le città', ci: 'Check-in', co: 'Check-out', ph: 'Città o zona', lab: 'Dove vai?', pop: 'Destinazioni popolari', go: 'Cerca hotel', none: 'Nessun risultato: prova un’altra città' },
    de: { all: 'Alle Städte', ci: 'Anreise', co: 'Abreise', ph: 'Stadt oder Gegend', lab: 'Wohin?', pop: 'Beliebte Reiseziele', go: 'Hotels suchen', none: 'Keine Treffer – andere Stadt versuchen' },
    pt: { all: 'Todas as cidades', ci: 'Entrada', co: 'Saída', ph: 'Cidade ou região', lab: 'Para onde?', pop: 'Destinos populares', go: 'Buscar hotéis', none: 'Sem resultados: tente outra cidade' },
    ja: { all: 'すべての都市', ci: 'チェックイン', co: 'チェックアウト', ph: '都市・エリア', lab: 'どこへ？', pop: '人気の目的地', go: 'ホテルを検索', none: '見つかりません。別の都市をお試しください' }
  };
  var HOTEL_POP = ['Paris', 'Rome', 'London', 'Barcelona', 'Amsterdam', 'Vienna', 'Prague', 'Berlin', 'Zurich', 'Venice', 'Madrid', 'Florence', 'Budapest', 'Munich', 'Tokyo', 'Kyoto', 'Osaka', 'Lisbon', 'Porto', 'Oslo', 'Marseille', 'Nice', 'Geneva'];
  var HOTEL_NAMES = {"es": {"Basel": "Basilea", "Berlin": "Berlín", "Bern": "Berna", "Bruges": "Brujas", "Brussels": "Bruselas", "Cologne": "Colonia", "Copenhagen": "Copenhague", "Edinburgh": "Edimburgo", "Florence": "Florencia", "Geneva": "Ginebra", "Gothenburg": "Gotemburgo", "Hamburg": "Hamburgo", "Lisbon": "Lisboa", "Ljubljana": "Liubliana", "London": "Londres", "Lucerne": "Lucerna", "Malaga": "Málaga", "Marseille": "Marsella", "Milan": "Milán", "Monaco": "Mónaco", "Munich": "Múnich", "Naples": "Nápoles", "Nice": "Niza", "Paris": "París", "Porto": "Oporto", "Prague": "Praga", "Rome": "Roma", "Salzburg": "Salzburgo", "Seville": "Sevilla", "Stockholm": "Estocolmo", "Strasbourg": "Estrasburgo", "Turin": "Turín", "Venice": "Venecia", "Vienna": "Viena", "Zurich": "Zúrich", "Frankfurt": "Fráncfort", "Bordeaux": "Burdeos", "Mainz": "Maguncia", "Tokyo": "Tokio", "Kyoto": "Kioto", "Austria": "Austria", "Belgium": "Bélgica", "Czech Republic": "República Checa", "Denmark": "Dinamarca", "France": "Francia", "Germany": "Alemania", "Hungary": "Hungría", "Norway": "Noruega", "Portugal": "Portugal", "Slovenia": "Eslovenia", "Italy": "Italia", "Netherlands": "Países Bajos", "Spain": "España", "Sweden": "Suecia", "Switzerland": "Suiza", "United Kingdom": "Reino Unido", "Japan": "Japón"}, "fr": {"Barcelona": "Barcelone", "Basel": "Bâle", "Bern": "Berne", "Brussels": "Bruxelles", "Copenhagen": "Copenhague", "Edinburgh": "Édimbourg", "Geneva": "Genève", "Gothenburg": "Göteborg", "Hamburg": "Hambourg", "Lisbon": "Lisbonne", "London": "Londres", "Milan": "Milan", "Naples": "Naples", "Prague": "Prague", "Rome": "Rome", "Salzburg": "Salzbourg", "Seville": "Séville", "Siena": "Sienne", "Valencia": "Valence", "Venice": "Venise", "Vienna": "Vienne", "Zaragoza": "Saragosse", "Girona": "Gérone", "Frankfurt": "Francfort", "Lyon": "Lyon", "Munich": "Munich", "Paris": "Paris", "Mainz": "Mayence", "Monaco": "Monaco", "Austria": "Autriche", "Belgium": "Belgique", "Czech Republic": "République tchèque", "Denmark": "Danemark", "France": "France", "Germany": "Allemagne", "Hungary": "Hongrie", "Norway": "Norvège", "Portugal": "Portugal", "Slovenia": "Slovénie", "Italy": "Italie", "Netherlands": "Pays-Bas", "Spain": "Espagne", "Sweden": "Suède", "Switzerland": "Suisse", "United Kingdom": "Royaume-Uni", "Japan": "Japon"}, "it": {"Barcelona": "Barcellona", "Basel": "Basilea", "Berlin": "Berlino", "Bern": "Berna", "Stockholm": "Stoccolma", "Brussels": "Bruxelles", "Cologne": "Colonia", "Copenhagen": "Copenaghen", "Edinburgh": "Edimburgo", "Florence": "Firenze", "Geneva": "Ginevra", "Gothenburg": "Göteborg", "Hamburg": "Amburgo", "Lisbon": "Lisbona", "Ljubljana": "Lubiana", "London": "Londra", "Lucerne": "Lucerna", "Lyon": "Lione", "Marseille": "Marsiglia", "Milan": "Milano", "Munich": "Monaco di Baviera", "Naples": "Napoli", "Nice": "Nizza", "Paris": "Parigi", "Prague": "Praga", "Rome": "Roma", "Salzburg": "Salisburgo", "Seville": "Siviglia", "Strasbourg": "Strasburgo", "Turin": "Torino", "Venice": "Venezia", "Zurich": "Zurigo", "Zaragoza": "Saragozza", "Frankfurt": "Francoforte", "Bergen": "Bergen", "Mainz": "Magonza", "Austria": "Austria", "Belgium": "Belgio", "Czech Republic": "Repubblica Ceca", "Denmark": "Danimarca", "France": "Francia", "Germany": "Germania", "Hungary": "Ungheria", "Norway": "Norvegia", "Portugal": "Portogallo", "Slovenia": "Slovenia", "Italy": "Italia", "Monaco": "Monaco", "Netherlands": "Paesi Bassi", "Spain": "Spagna", "Sweden": "Svezia", "Switzerland": "Svizzera", "United Kingdom": "Regno Unito", "Japan": "Giappone"}, "ja": {"Amsterdam": "アムステルダム", "Barcelona": "バルセロナ", "Basel": "バーゼル", "Berlin": "ベルリン", "Bern": "ベルン", "Bordeaux": "ボルドー", "Brno": "ブルノ", "Bruges": "ブルージュ", "Brussels": "ブリュッセル", "Budapest": "ブダペスト", "Cambridge": "ケンブリッジ", "Cologne": "ケルン", "Copenhagen": "コペンハーゲン", "Dortmund": "ドルトムント", "Edinburgh": "エディンバラ", "Figueres": "フィゲラス", "Florence": "フィレンツェ", "Frankfurt": "フランクフルト", "Geneva": "ジュネーブ", "Girona": "ジローナ", "Graz": "グラーツ", "Hamburg": "ハンブルク", "Innsbruck": "インスブルック", "Interlaken": "インターラーケン", "Krems": "クレムス", "Lauterbrunnen": "ラウターブルンネン", "Liverpool": "リバプール", "Ljubljana": "リュブリャナ", "London": "ロンドン", "Lourdes": "ルルド", "Lucerne": "ルツェルン", "Lyon": "リヨン", "Madrid": "マドリード", "Malaga": "マラガ", "Manchester": "マンチェスター", "Marseille": "マルセイユ", "Milan": "ミラノ", "Miramas": "ミラマス", "Monaco": "モナコ", "Montreux": "モントルー", "Munich": "ミュンヘン", "Naples": "ナポリ", "Nice": "ニース", "Oxford": "オックスフォード", "Paris": "パリ", "Pisa": "ピサ", "Positano": "ポジターノ", "Prague": "プラハ", "Rome": "ローマ", "Salerno": "サレルノ", "Salzburg": "ザルツブルク", "Seville": "セビリア", "Siena": "シエナ", "Sorrento": "ソレント", "St. Moritz": "サンモリッツ", "Stockholm": "ストックホルム", "Strasbourg": "ストラスブール", "Tende": "タンド", "Toulouse": "トゥールーズ", "Turin": "トリノ", "Valencia": "バレンシア", "Venice": "ヴェネツィア", "Vienna": "ウィーン", "York": "ヨーク", "Zaragoza": "サラゴサ", "Zermatt": "ツェルマット", "Zurich": "チューリッヒ", "Mainz": "マインツ", "Bergen": "ベルゲン", "Oslo": "オスロ", "Trondheim": "トロンハイム", "Faro": "ファロ", "Lisbon": "リスボン", "Porto": "ポルト", "Fukuoka": "福岡", "Hakone": "箱根", "Hiroshima": "広島", "Kanazawa": "金沢", "Kobe": "神戸", "Kyoto": "京都", "Nagoya": "名古屋", "Nara": "奈良", "Osaka": "大阪", "Sapporo": "札幌", "Tokyo": "東京", "Yokohama": "横浜", "Gothenburg": "ヨーテボリ", "Jungfraujoch": "ユングフラウヨッホ", "Sargans": "ザルガンス", "Spiez": "シュピーツ", "Zweisimmen": "ツヴァイジンメン", "Austria": "オーストリア", "Belgium": "ベルギー", "Czech Republic": "チェコ", "Denmark": "デンマーク", "France": "フランス", "Germany": "ドイツ", "Hungary": "ハンガリー", "Norway": "ノルウェー", "Portugal": "ポルトガル", "Slovenia": "スロベニア", "Italy": "イタリア", "Netherlands": "オランダ", "Spain": "スペイン", "Sweden": "スウェーデン", "Switzerland": "スイス", "United Kingdom": "イギリス", "Japan": "日本"}, "de": {"Austria": "Österreich", "Belgium": "Belgien", "Czech Republic": "Tschechien", "Denmark": "Dänemark", "France": "Frankreich", "Germany": "Deutschland", "Hungary": "Ungarn", "Norway": "Norwegen", "Portugal": "Portugal", "Slovenia": "Slowenien", "Italy": "Italien", "Monaco": "Monaco", "Netherlands": "Niederlande", "Spain": "Spanien", "Sweden": "Schweden", "Switzerland": "Schweiz", "United Kingdom": "Vereinigtes Königreich", "Japan": "Japan"}, "pt": {"Austria": "Áustria", "Belgium": "Bélgica", "Czech Republic": "Tchéquia", "Denmark": "Dinamarca", "France": "França", "Germany": "Alemanha", "Hungary": "Hungria", "Norway": "Noruega", "Portugal": "Portugal", "Slovenia": "Eslovênia", "Italy": "Itália", "Monaco": "Mônaco", "Netherlands": "Países Baixos", "Spain": "Espanha", "Sweden": "Suécia", "Switzerland": "Suíça", "United Kingdom": "Reino Unido", "Japan": "Japão"}};
  function hname(lg, n) { var m = HOTEL_NAMES[lg]; return (m && m[n]) || n; }
  function hnorm(x) { return String(x).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); }
  function buildHotels() {
    var card = document.querySelector('.search-card'), src = document.getElementById('klookCityMenu');
    if (!card || !src || !src.children.length) return null;
    var panel = card.querySelector('[data-panel="hotels"]');
    if (panel) return panel;
    var u = HOTEL_UI[lang()] || HOTEL_UI.en;
    var cities = [];
    Array.prototype.forEach.call(src.querySelectorAll('.klook-city-item'), function (n) { cities.push(n.textContent.trim()); });
    var pop = HOTEL_POP.filter(function (c) { return cities.indexOf(c) !== -1; });
    panel = document.createElement('div');
    panel.className = 'search-panel hotels-panel';
    panel.setAttribute('data-panel', 'hotels');
    panel.innerHTML = '<div class="hotels-bar"><label class="hotels-field"><span class="hotels-lab"></span><input type="text" class="hotels-input" autocomplete="off" /><div class="hotels-list" role="listbox"></div></label><label class="hotels-field hotels-date"><span class="hotels-lab hotels-ci-lab"></span><input type="date" class="hotels-ci" /></label><label class="hotels-field hotels-date"><span class="hotels-lab hotels-co-lab"></span><input type="date" class="hotels-co" /></label><button type="button" class="hotels-go"></button></div><div class="hotels-pop"><span class="hotels-pop-lab"></span><div class="hotels-pop-row"></div></div>';
    var lab = panel.querySelector('.hotels-lab'), inp = panel.querySelector('.hotels-input'), list = panel.querySelector('.hotels-list'),
        go = panel.querySelector('.hotels-go'), popLab = panel.querySelector('.hotels-pop-lab'), row = panel.querySelector('.hotels-pop-row');
    lab.textContent = u.lab;
    var ci = panel.querySelector('.hotels-ci'), co = panel.querySelector('.hotels-co');
    panel.querySelector('.hotels-ci-lab').textContent = u.ci; panel.querySelector('.hotels-co-lab').textContent = u.co;
    function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
    function plus(v, n) { var d = new Date(v + 'T00:00:00'); d.setDate(d.getDate() + n); return iso(d); }
    ci.min = iso(new Date()); co.min = plus(ci.min, 1);
    ci.addEventListener('change', function () {
      if (!ci.value) return;
      co.min = plus(ci.value, 1);
      if (!co.value || co.value <= ci.value) co.value = plus(ci.value, 1);
    }); inp.placeholder = u.ph; go.textContent = u.go; popLab.textContent = u.pop;
    var chosen = '';
    function pick(c) { chosen = c; inp.value = hname(lang(), c); list.classList.remove('open'); }
    function matches() {
      var q = hnorm(inp.value);
      if (!q) return pop;
      var nm = function (c) { return hnorm(c) + '|' + hnorm(hname(lang(), c)); };
      var st = cities.filter(function (c) { return nm(c).split('|').some(function (x) { return x.indexOf(q) === 0; }); });
      var inn = cities.filter(function (c) { return st.indexOf(c) === -1 && nm(c).indexOf(q) > -1; });
      return st.concat(inn);
    }
    function paintList() {
      var m = matches().slice(0, 8);
      list.innerHTML = '';
      if (!m.length) { var e = document.createElement('div'); e.className = 'hotels-none'; e.textContent = u.none; list.appendChild(e); }
      m.forEach(function (c) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'hotels-opt'; b.textContent = hname(lang(), c);
        b.addEventListener('mousedown', function (ev) { ev.preventDefault(); pick(c); });
        list.appendChild(b);
      });
      list.classList.add('open');
    }
    function submit() {
      var m = matches();
      var exact = cities.filter(function (c) { return hnorm(c) === hnorm(inp.value) || hnorm(hname(lang(), c)) === hnorm(inp.value); })[0];
      var city = exact || m[0];
      if (!city || !inp.value.trim()) { inp.focus(); paintList(); return; }
      if (typeof window.goKlookHotelCity === 'function') window.goKlookHotelCity(city, ci.value && co.value && co.value > ci.value ? ci.value : '', ci.value && co.value && co.value > ci.value ? co.value : '');
    }
    inp.addEventListener('focus', paintList);
    inp.addEventListener('input', paintList);
    inp.addEventListener('blur', function () { setTimeout(function () { list.classList.remove('open'); }, 120); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); var first = list.querySelector('.hotels-opt'); if (list.classList.contains('open') && first && hnorm(inp.value) !== hnorm(first.textContent)) { var fc = cities.filter(function (c) { return hname(lang(), c) === first.textContent; })[0]; pick(fc || first.textContent); } else submit(); } });
    go.addEventListener('click', submit);
    pop.forEach(function (c) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'hotels-city'; b.textContent = hname(lang(), c);
      b.addEventListener('click', function () { pick(c); (ci.value ? co : ci).focus(); });
      row.appendChild(b);
    });
    // "Todas las ciudades": lista completa agrupada por país, desplegable dentro del propio panel
    var allBtn = document.createElement('button'); allBtn.type = 'button'; allBtn.className = 'hotels-all';
    allBtn.textContent = u.all + ' (' + cities.length + ') ▾';
    var allBox = document.createElement('div'); allBox.className = 'hotels-allbox'; allBox.hidden = true;
    Array.prototype.forEach.call(src.children, function (n) {
      if (n.classList.contains('klook-city-group-label')) { var g = document.createElement('div'); g.className = 'hotels-group'; var gt = document.createElement('span'); gt.className = 'hotels-flag'; gt.textContent = hname(lang(), n.textContent.trim()); g.appendChild(gt); allBox.appendChild(g); }
      else { var c = n.textContent.trim(), b = document.createElement('button'); b.type = 'button'; b.className = 'hotels-city'; b.textContent = hname(lang(), c);
        b.addEventListener('click', function () { pick(c); allBox.hidden = true; allBtn.textContent = u.all + ' (' + cities.length + ') ▾'; (ci.value ? co : ci).focus(); }); allBox.appendChild(b); }
    });
    allBtn.addEventListener('click', function () { allBox.hidden = !allBox.hidden; allBtn.textContent = u.all + ' (' + cities.length + ') ' + (allBox.hidden ? '▾' : '▴'); });
    panel.querySelector('.hotels-pop').appendChild(allBtn); panel.querySelector('.hotels-pop').appendChild(allBox);
    card.appendChild(panel);
    return panel;
  }
  // Mosaico de fotos de hotel que sustituye a la foto del tren mientras está activo el chip Hoteles.
  function ensureMosaic() {
    var card = document.querySelector('.hero-title-card');
    if (!card || card.querySelector('.hotel-mosaic')) return;
    var m = document.createElement('div');
    m.className = 'hotel-mosaic'; m.setAttribute('aria-hidden', 'true');
    m.innerHTML = '<img src="https://images.pexels.com/photos/2346090/pexels-photo-2346090.jpeg?auto=compress&cs=tinysrgb&w=520" alt="" loading="lazy" decoding="async"><img src="https://images.pexels.com/photos/18328707/pexels-photo-18328707.jpeg?auto=compress&cs=tinysrgb&w=520" alt="" loading="lazy" decoding="async"><img src="https://images.pexels.com/photos/2226091/pexels-photo-2226091.jpeg?auto=compress&cs=tinysrgb&w=520" alt="" loading="lazy" decoding="async"><img src="https://images.pexels.com/photos/7034586/pexels-photo-7034586.jpeg?auto=compress&cs=tinysrgb&w=520" alt="" loading="lazy" decoding="async"><img src="https://images.pexels.com/photos/3755590/pexels-photo-3755590.jpeg?auto=compress&cs=tinysrgb&w=520" alt="" loading="lazy" decoding="async"><img src="https://images.pexels.com/photos/19966784/pexels-photo-19966784.jpeg?auto=compress&cs=tinysrgb&w=520" alt="" loading="lazy" decoding="async"><img src="https://images.pexels.com/photos/34307858/pexels-photo-34307858.jpeg?auto=compress&cs=tinysrgb&w=520" alt="" loading="lazy" decoding="async"><img src="https://images.pexels.com/photos/14464346/pexels-photo-14464346.jpeg?auto=compress&cs=tinysrgb&w=520" alt="" loading="lazy" decoding="async">';
    card.insertBefore(m, card.firstChild);
  }
  function closeHotels() {
    document.body.classList.remove('hotels-mode');
    var chip = document.querySelector('.region-hotels'); if (chip) { chip.classList.remove('on'); chip.setAttribute('aria-pressed', 'false'); }
    var hp = document.querySelector('[data-panel="hotels"]'); if (hp) hp.classList.remove('on');
    var ai = document.querySelector('.search-tab[data-tab="ai"]'); if (ai) ai.click();
  }
  function toggleHotels(chip) {
    if (document.body.classList.contains('hotels-mode')) { closeHotels(); return; }
    var hp = buildHotels(); if (!hp) return;
    var fi = hp.querySelector('.hotels-input'); if (fi) fi.value = '';
    document.querySelectorAll('.search-tab').forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
    document.querySelectorAll('.search-panel').forEach(function (x) { x.classList.toggle('on', x === hp); });
    ensureMosaic();
    document.body.classList.add('hotels-mode');
    chip.classList.add('on'); chip.setAttribute('aria-pressed', 'true');
  }
  document.addEventListener('click', function (e) {
    if (document.body.classList.contains('hotels-mode') && e.target.closest && e.target.closest('.search-tab')) {
      document.body.classList.remove('hotels-mode');
      var chip = document.querySelector('.region-hotels'); if (chip) { chip.classList.remove('on'); chip.setAttribute('aria-pressed', 'false'); }
    }
  });

  // ── Portada en modo Japón (fase 1): las secciones de abajo dejan de hablar de Europa ──────────────
  // Cada bloque tiene un gemelo .jp-only (el original pasa a .eu-only); el CSS muestra uno u otro según body[data-region].
  var JPH = {
    en: { t2: 'for Japan.', gl: 'Practical advice for traveling Japan by train: the Shinkansen, tickets and passes.', gtag: 'Japan Guide', gt: 'How to Travel Japan by Train: A First-Timer\'s Guide to the Shinkansen', gf: '/blog-japan-train-guide.html',
      f1: 'An independent and free platform to plan train trips in Japan and Europe. No account, no subscription — explore routes, see journey times and book through certified partners.',
      f2: 'We connect you to official partners. For Japan we use Klook: search your route, press the Klook button and complete the booking on their secure platform.',
      fq: 'Do I need a JR Pass?', fa: 'Often not. Since the 2023 price increase, the JR Pass only pays off on long itineraries with several long Shinkansen rides. For most trips point-to-point tickets are cheaper; compare both before you decide.',
      et: 'Explore Japanese train routes', es: 'Schedules, journey times and tips for 196 rail journeys across Japan.' },
    es: { t2: 'para Japón.', gl: 'Consejos prácticos para viajar por Japón en tren: el Shinkansen, los billetes y los pases.', gtag: 'Guía de Japón', gt: 'Cómo viajar por Japón en tren: guía del Shinkansen para tu primer viaje', gf: '/es/blog-japan-train-guide.html',
      f1: 'Una plataforma independiente y gratuita para planificar viajes en tren por Japón y Europa. Sin cuenta ni suscripción: explora rutas, mira los tiempos de viaje y reserva con socios certificados.',
      f2: 'Te conectamos con socios oficiales. Para Japón usamos Klook: busca tu ruta, pulsa el botón de Klook y completa la reserva en su plataforma segura.',
      fq: '¿Necesito un JR Pass?', fa: 'Muchas veces no. Desde la subida de precio de 2023, el JR Pass solo compensa en itinerarios largos con varios trayectos largos en Shinkansen. En la mayoría de los viajes los billetes sueltos salen más baratos; compara ambas opciones antes de decidir.',
      et: 'Explora las rutas de tren de Japón', es: 'Horarios, tiempos de viaje y consejos de 196 trayectos en tren por Japón.' },
    fr: { t2: 'pour le Japon.', gl: 'Conseils pratiques pour voyager au Japon en train : le Shinkansen, les billets et les pass.', gtag: 'Guide du Japon', gt: 'Voyager au Japon en train : guide du Shinkansen pour un premier séjour', gf: '/fr/blog-japan-train-guide.html',
      f1: 'Une plateforme indépendante et gratuite pour planifier des voyages en train au Japon et en Europe. Sans compte ni abonnement : explorez les itinéraires, consultez les durées et réservez auprès de partenaires certifiés.',
      f2: 'Nous vous mettons en relation avec des partenaires officiels. Pour le Japon, nous utilisons Klook : cherchez votre trajet, cliquez sur le bouton Klook et finalisez la réservation sur leur plateforme sécurisée.',
      fq: 'Ai-je besoin d’un JR Pass ?', fa: 'Souvent non. Depuis la hausse des prix de 2023, le JR Pass n’est rentable que sur de longs itinéraires avec plusieurs longs trajets en Shinkansen. Pour la plupart des voyages, les billets à l’unité coûtent moins cher ; comparez les deux avant de décider.',
      et: 'Explorez les itinéraires en train au Japon', es: 'Horaires, durées et conseils pour 196 trajets en train à travers le Japon.' },
    it: { t2: 'per il Giappone.', gl: 'Consigli pratici per viaggiare in Giappone in treno: lo Shinkansen, i biglietti e i pass.', gtag: 'Guida Giappone', gt: 'Come viaggiare in Giappone in treno: guida allo Shinkansen per il primo viaggio', gf: '/it/blog-japan-train-guide.html',
      f1: 'Una piattaforma indipendente e gratuita per pianificare viaggi in treno in Giappone e in Europa. Senza account né abbonamento: esplora i percorsi, guarda i tempi di viaggio e prenota con partner certificati.',
      f2: 'Ti colleghiamo a partner ufficiali. Per il Giappone usiamo Klook: cerca il tuo percorso, premi il pulsante di Klook e completa la prenotazione sulla loro piattaforma sicura.',
      fq: 'Mi serve un JR Pass?', fa: 'Spesso no. Dopo l’aumento di prezzo del 2023, il JR Pass conviene solo su itinerari lunghi con più tratte lunghe in Shinkansen. Nella maggior parte dei viaggi i biglietti singoli costano meno; confronta entrambe le opzioni prima di decidere.',
      et: 'Esplora i percorsi in treno in Giappone', es: 'Orari, tempi di viaggio e consigli per 196 tragitti in treno in tutto il Giappone.' },
    de: { t2: 'für Japan.', gl: 'Praktische Tipps für Bahnreisen in Japan: Shinkansen, Tickets und Pässe.', gtag: 'Japan-Guide', gt: 'How to Travel Japan by Train: A First-Timer\'s Guide to the Shinkansen', gf: '/blog-japan-train-guide.html',
      f1: 'Eine unabhängige, kostenlose Plattform zur Planung von Zugreisen in Japan und Europa. Ohne Konto, ohne Abo: Strecken erkunden, Fahrzeiten sehen und bei zertifizierten Partnern buchen.',
      f2: 'Wir verbinden dich mit offiziellen Partnern. Für Japan nutzen wir Klook: Strecke suchen, den Klook-Button drücken und die Buchung auf der sicheren Plattform abschließen.',
      fq: 'Brauche ich einen JR Pass?', fa: 'Oft nicht. Seit der Preiserhöhung 2023 lohnt sich der JR Pass nur bei langen Routen mit mehreren langen Shinkansen-Fahrten. Für die meisten Reisen sind Einzeltickets günstiger; vergleiche beides, bevor du dich entscheidest.',
      et: 'Zugstrecken in Japan entdecken', es: 'Fahrpläne, Fahrzeiten und Tipps für 196 Bahnreisen quer durch Japan.' },
    pt: { t2: 'para o Japão.', gl: 'Dicas práticas para viajar de trem pelo Japão: o Shinkansen, os bilhetes e os passes.', gtag: 'Guia do Japão', gt: 'How to Travel Japan by Train: A First-Timer\'s Guide to the Shinkansen', gf: '/blog-japan-train-guide.html',
      f1: 'Uma plataforma independente e gratuita para planejar viagens de trem pelo Japão e pela Europa. Sem conta nem assinatura: explore rotas, veja os tempos de viagem e reserve com parceiros certificados.',
      f2: 'Conectamos você a parceiros oficiais. Para o Japão usamos a Klook: busque sua rota, clique no botão da Klook e conclua a reserva na plataforma segura deles.',
      fq: 'Preciso de um JR Pass?', fa: 'Muitas vezes não. Desde o aumento de preço de 2023, o JR Pass só compensa em roteiros longos com vários trechos longos de Shinkansen. Na maioria das viagens, os bilhetes avulsos saem mais baratos; compare as duas opções antes de decidir.',
      et: 'Explore as rotas de trem do Japão', es: 'Horários, tempos de viagem e dicas de 196 trajetos de trem pelo Japão.' },
    ja: { t2: '日本の旅に。', gl: '日本を鉄道で旅するための実用ガイド：新幹線、きっぷ、パスのこと。', gtag: '日本ガイド', gt: '新幹線で日本を旅する：はじめての鉄道旅ガイド', gf: '/ja/blog-japan-train-guide.html',
      f1: '日本とヨーロッパの鉄道旅を計画できる、独立した無料のプラットフォームです。アカウントも登録も不要。路線を調べ、所要時間を確かめて、認定パートナーで予約できます。',
      f2: '公式パートナーにつなぎます。日本ではKlookを利用します。区間を検索してKlookのボタンを押し、予約はKlookの安全なサイトで完了します。',
      fq: 'JRパスは必要ですか？', fa: '多くの場合は不要です。2023年の値上げ以降、JRパスが得になるのは、長い新幹線に何度も乗る長期の旅程に限られます。ほとんどの旅では、区間ごとのきっぷのほうが安くなります。決める前に、両方を比べてみてください。',
      et: '日本の鉄道ルートを探す', es: '日本全国196区間の時刻、所要時間、旅のヒント。' }
  };
  var JP_PILLS = [['tokyo-kyoto', 'Tokyo', 'Kyoto'], ['tokyo-osaka', 'Tokyo', 'Osaka'], ['osaka-kyoto', 'Osaka', 'Kyoto'], ['osaka-hiroshima', 'Osaka', 'Hiroshima'], ['tokyo-nagoya', 'Tokyo', 'Nagoya'], ['shinjuku-hakone', 'Shinjuku', 'Hakone'], ['tokyo-kanazawa', 'Tokyo', 'Kanazawa'], ['osaka-fukuoka', 'Osaka', 'Fukuoka']];
  var JP_SHINJUKU = { ja: '新宿', es: 'Shinjuku', fr: 'Shinjuku', it: 'Shinjuku' };
  function twinHome(el, edit) {
    if (!el || el.getAttribute('data-jp-twin')) return null;
    var c = el.cloneNode(true);
    c.removeAttribute('id'); c.setAttribute('data-jp-twin', '1');
    c.querySelectorAll('[data-i18n]').forEach(function (n) { n.removeAttribute('data-i18n'); });
    c.removeAttribute('data-i18n');
    el.classList.add('eu-only'); c.classList.add('jp-only');
    el.parentNode.insertBefore(c, el.nextSibling);
    if (edit) edit(c);
    return c;
  }
  (function () {
    var L = JPH[lang()] || JPH.en, lg = lang();
    // Esenciales: el subtítulo y las tarjetas que no aplican a Japón
    // Booking y Tripadvisor también aplican a Japón: se dejan visibles para que la fila de partners de confianza no quede con una sola tarjeta
    // Guías: la guía japonesa sustituye a las tres europeas
    var gl = document.querySelector('[data-i18n="guides_lead"]');
    twinHome(gl, function (c) { c.textContent = L.gl; });
    var cards = document.querySelectorAll('#guides .guide-card');
    if (cards.length) {
      var first = cards[0], base = first.getAttribute('href').replace(/[^\/]*$/, '');
      var gc = first.cloneNode(true); gc.setAttribute('data-jp-twin', '1');
      gc.querySelectorAll('[data-i18n]').forEach(function (n) { n.removeAttribute('data-i18n'); });
      gc.setAttribute('href', /^\/(es|fr|it|ja)\//.test(L.gf) ? L.gf : base + 'blog-japan-train-guide.html');
      if (lg === 'es' || lg === 'fr' || lg === 'it' || lg === 'ja') gc.setAttribute('href', L.gf);
      gc.querySelector('.guide-tag').textContent = L.gtag;
      gc.querySelector('h3').textContent = L.gt;
      var im = gc.querySelector('.guide-photo'); if (im) im.setAttribute('src', '/scenic/jp-hakone.webp');
      gc.classList.add('jp-only');
      cards.forEach(function (c) { c.classList.add('eu-only'); });
      first.parentNode.insertBefore(gc, first);
    }
    // FAQ: respuestas de Japón y una pregunta nueva sobre el JR Pass
    var items = document.querySelectorAll('#faq .faq-item');
    if (items.length >= 2) {
      twinHome(items[0], function (c) { c.querySelector('.faq-a').textContent = L.f1; });
      twinHome(items[1], function (c) { c.querySelector('.faq-a').textContent = L.f2; });
      var jr = items[1].cloneNode(true); jr.removeAttribute('data-jp-twin');
      jr.querySelectorAll('[data-i18n]').forEach(function (n) { n.removeAttribute('data-i18n'); });
      jr.querySelector('.faq-q span').textContent = L.fq; jr.querySelector('.faq-a').textContent = L.fa;
      jr.classList.remove('eu-only'); jr.classList.add('jp-only');
      var lastTwin = document.querySelectorAll('#faq .faq-item.jp-only'); lastTwin = lastTwin[lastTwin.length - 1];
      lastTwin.parentNode.insertBefore(jr, lastTwin.nextSibling);
    }
    // Explorar rutas: pastillas de rutas japonesas
    var et = document.querySelector('[data-i18n="explore_routes_title"]');
    if (et) {
      var sec = et.parentNode, es = sec.querySelector('[data-i18n="explore_routes_sub"]'), pills = sec.querySelector('.explore-pills');
      twinHome(et, function (c) { c.textContent = L.et; });
      twinHome(es, function (c) { c.textContent = L.es; });
      twinHome(pills, function (c) {
        var suf = lg === 'en' || lg === 'de' || lg === 'pt' ? '/' : '/' + lg + '/';
        c.innerHTML = JP_PILLS.map(function (p) {
          var nm = function (n) { return n === 'Shinjuku' ? (JP_SHINJUKU[lg] || n) : hname(lg, n); };
          return '<a href="/rutas/' + p[0] + suf + '" class="explore-route-pill">' + nm(p[1]) + ' → ' + nm(p[2]) + '</a>';
        }).join('');
      });
    }
  })();

  // ── Descubramos juntos en modo Japón (fase 2): 6 destinos japoneses con guía de ruta ──────────────
  var JP_DISCOVER = [{"s": "shinjuku-hakone", "i": "jp-hakone", "c": {"en": "Kanagawa · Onsen & Fuji views", "es": "Kanagawa · Aguas termales y vistas al Fuji", "fr": "Kanagawa · Onsen et vue sur le Fuji", "it": "Kanagawa · Onsen e vista sul Fuji", "ja": "神奈川・温泉と富士山の眺め"}, "p": {"en": "Hakone", "es": "Hakone", "fr": "Hakone", "it": "Hakone", "ja": "箱根"}, "r": {"en": "Shinjuku → Hakone-Yumoto by Odakyu Romancecar", "es": "Shinjuku → Hakone-Yumoto en el Romancecar de Odakyu", "fr": "Shinjuku → Hakone-Yumoto en Romancecar d’Odakyu", "it": "Shinjuku → Hakone-Yumoto con il Romancecar Odakyu", "ja": "新宿 → 箱根湯本　小田急ロマンスカー"}, "m": {"en": "Best: Nov–Dec leaves · clear mornings for Mt Fuji", "es": "Mejor época: nov–dic (hojas) · mañanas despejadas para ver el Fuji", "fr": "Meilleure période : nov.–déc. · matins dégagés pour le Fuji", "it": "Periodo migliore: nov–dic · mattine limpide per il Fuji", "ja": "おすすめ：11〜12月の紅葉、富士山が見えやすい晴れた朝"}, "t": {"en": "A mountain onsen town roughly an hour and a half from Shinjuku. A loop of mountain railway, ropeway and lake cruise gives you views of Mt Fuji on clear days.", "es": "Un pueblo de montaña con onsen a más o menos una hora y media de Shinjuku. Un circuito de tren de montaña, teleférico y crucero por el lago te da vistas al Fuji los días despejados.", "fr": "Une ville thermale de montagne à environ une heure et demie de Shinjuku. Un circuit en train de montagne, téléphérique et croisière sur le lac offre une vue sur le Fuji par temps clair.", "it": "Una cittadina termale di montagna a circa un’ora e mezza da Shinjuku. Un giro con treno di montagna, funivia e crociera sul lago regala la vista del Fuji nei giorni limpidi.", "ja": "新宿から1時間半ほどの山あいの温泉地。登山電車、ロープウェイ、湖の遊覧船をめぐれば、晴れた日には富士山が望めます。"}, "v": "jp-hakone"}, {"s": "asakusa-nikko", "i": "jp-nikko", "c": {"en": "Tochigi · Shrines & waterfalls", "es": "Tochigi · Santuarios y cascadas", "fr": "Tochigi · Sanctuaires et cascades", "it": "Tochigi · Santuari e cascate", "ja": "栃木・社寺と滝"}, "p": {"en": "Nikko", "es": "Nikko", "fr": "Nikko", "it": "Nikko", "ja": "日光"}, "r": {"en": "Asakusa → Tobu-Nikko by Tobu limited express", "es": "Asakusa → Tobu-Nikko en el expreso limitado de Tobu", "fr": "Asakusa → Tobu-Nikko en express limité Tobu", "it": "Asakusa → Tobu-Nikko con il limited express Tobu", "ja": "浅草 → 東武日光　東武の特急"}, "m": {"en": "Best: late Oct–Nov autumn colours", "es": "Mejor época: fines de oct–nov (colores de otoño)", "fr": "Meilleure période : fin oct.–nov. (couleurs d’automne)", "it": "Periodo migliore: fine ott–nov (colori d’autunno)", "ja": "おすすめ：10月下旬〜11月の紅葉"}, "t": {"en": "The Toshogu shrine in a cedar forest and the Kegon Falls, around two hours from Tokyo on a limited express that leaves from Asakusa.", "es": "El santuario Toshogu en un bosque de cedros y las cataratas Kegon, a unas dos horas de Tokio en un expreso limitado que sale de Asakusa.", "fr": "Le sanctuaire Toshogu au cœur d’une forêt de cèdres et les chutes Kegon, à environ deux heures de Tokyo en express limité au départ d’Asakusa.", "it": "Il santuario Toshogu in una foresta di cedri e le cascate Kegon, a circa due ore da Tokyo con un limited express che parte da Asakusa.", "ja": "杉木立のなかの東照宮と華厳の滝。浅草から出る特急で、東京から2時間ほどです。"}, "v": "jp-nikko"}, {"s": "nagoya-takayama", "i": "jp-takayama", "c": {"en": "Gifu · Old town in the Alps", "es": "Gifu · Casco antiguo en los Alpes", "fr": "Gifu · Vieille ville dans les Alpes", "it": "Gifu · Città vecchia sulle Alpi", "ja": "岐阜・アルプスの古い町並み"}, "p": {"en": "Takayama", "es": "Takayama", "fr": "Takayama", "it": "Takayama", "ja": "高山"}, "r": {"en": "Nagoya → Takayama by JR Limited Express Hida", "es": "Nagoya → Takayama en el expreso limitado Hida de JR", "fr": "Nagoya → Takayama en express limité Hida de JR", "it": "Nagoya → Takayama con il limited express Hida di JR", "ja": "名古屋 → 高山　JR特急「ひだ」"}, "m": {"en": "Best: April & October festivals", "es": "Mejor época: festivales de abril y octubre", "fr": "Meilleure période : fêtes d’avril et d’octobre", "it": "Periodo migliore: feste di aprile e ottobre", "ja": "おすすめ：4月と10月の高山祭"}, "t": {"en": "Edo-period merchant streets and morning markets. For much of the ride the Hida line follows a river gorge through the mountains.", "es": "Calles de comerciantes de la época Edo y mercados matinales. Gran parte del trayecto, la línea Hida sigue una garganta fluvial entre montañas.", "fr": "Rues de marchands de l’époque d’Edo et marchés du matin. Pendant une bonne partie du trajet, la ligne Hida suit une gorge de rivière à travers les montagnes.", "it": "Strade di mercanti dell’epoca Edo e mercati del mattino. Per buona parte del viaggio la linea Hida segue una gola fluviale tra le montagne.", "ja": "江戸時代の商家が並ぶ通りと朝市。飛騨線は、道中の多くで川沿いの渓谷を進みます。"}, "v": "jp-takayama"}, {"s": "atami-ito", "i": "jp-izu", "c": {"en": "Shizuoka · Coastal hot springs", "es": "Shizuoka · Aguas termales junto al mar", "fr": "Shizuoka · Sources chaudes côtières", "it": "Shizuoka · Terme sulla costa", "ja": "静岡・海辺の温泉"}, "p": {"en": "Izu · Ito", "es": "Izu · Ito", "fr": "Izu · Ito", "it": "Izu · Ito", "ja": "伊豆・伊東"}, "r": {"en": "Atami → Ito on the JR Ito Line", "es": "Atami → Ito por la línea Ito de JR", "fr": "Atami → Ito sur la ligne Ito de JR", "it": "Atami → Ito sulla linea Ito di JR", "ja": "熱海 → 伊東　JR伊東線"}, "m": {"en": "Best: Feb–Mar early blossoms · sea views", "es": "Mejor época: feb–mar (floración temprana) · vistas al mar", "fr": "Meilleure période : fév.–mars (floraison précoce) · vue sur la mer", "it": "Periodo migliore: feb–mar (fioritura precoce) · vista sul mare", "ja": "おすすめ：2〜3月の早咲きの花、海の眺め"}, "t": {"en": "A short coastal line from Atami to the hot-spring town of Ito, on the Izu peninsula, with sea views along the way.", "es": "Una línea costera corta de Atami a Ito, un pueblo de aguas termales de la península de Izu, con vistas al mar durante el trayecto.", "fr": "Une courte ligne côtière d’Atami à Ito, ville thermale de la péninsule d’Izu, avec la mer en toile de fond.", "it": "Una breve linea costiera da Atami a Ito, cittadina termale della penisola di Izu, con il mare in vista lungo il percorso.", "ja": "熱海から、伊豆半島の温泉町・伊東までを結ぶ短い海沿いの路線。車窓から海が見えます。"}, "v": "jp-izu"}, {"s": "fukuoka-yufuin", "i": "jp-yufuin", "c": {"en": "Oita · Hot-spring village", "es": "Oita · Pueblo de aguas termales", "fr": "Oita · Village thermal", "it": "Oita · Villaggio termale", "ja": "大分・湯の町"}, "p": {"en": "Yufuin", "es": "Yufuin", "fr": "Yufuin", "it": "Yufuin", "ja": "由布院"}, "r": {"en": "Fukuoka (Hakata) → Yufuin by limited express", "es": "Fukuoka (Hakata) → Yufuin en expreso limitado", "fr": "Fukuoka (Hakata) → Yufuin en express limité", "it": "Fukuoka (Hakata) → Yufuin con il limited express", "ja": "福岡（博多）→ 由布院　特急"}, "m": {"en": "Best: autumn & winter mornings", "es": "Mejor época: mañanas de otoño e invierno", "fr": "Meilleure période : matins d’automne et d’hiver", "it": "Periodo migliore: mattine d’autunno e d’inverno", "ja": "おすすめ：秋から冬の朝"}, "t": {"en": "A small onsen village under Mt Yufu, reached by limited express from Fukuoka. On cold mornings mist often rises from Lake Kinrin.", "es": "Un pequeño pueblo de onsen al pie del monte Yufu, al que se llega en expreso limitado desde Fukuoka. En las mañanas frías suele subir niebla del lago Kinrin.", "fr": "Un petit village d’onsen au pied du mont Yufu, accessible en express limité depuis Fukuoka. Par les matins froids, une brume monte souvent du lac Kinrin.", "it": "Un piccolo villaggio di onsen ai piedi del monte Yufu, raggiungibile con il limited express da Fukuoka. Nelle mattine fredde sale spesso la nebbia dal lago Kinrin.", "ja": "由布岳のふもとにある小さな温泉の里。福岡から特急で行けます。寒い朝は、金鱗湖にもやが立つことがよくあります。"}, "v": "jp-yufuin"}, {"s": "tokyo-kanazawa", "i": "jp-kanazawa", "c": {"en": "Ishikawa · Gardens & old districts", "es": "Ishikawa · Jardines y barrios antiguos", "fr": "Ishikawa · Jardins et vieux quartiers", "it": "Ishikawa · Giardini e quartieri antichi", "ja": "石川・庭園と古い町並み"}, "p": {"en": "Kanazawa", "es": "Kanazawa", "fr": "Kanazawa", "it": "Kanazawa", "ja": "金沢"}, "r": {"en": "Tokyo → Kanazawa on the Hokuriku Shinkansen", "es": "Tokio → Kanazawa en el Hokuriku Shinkansen", "fr": "Tokyo → Kanazawa en Hokuriku Shinkansen", "it": "Tokyo → Kanazawa con lo Hokuriku Shinkansen", "ja": "東京 → 金沢　北陸新幹線"}, "m": {"en": "Best: November leaves · winter rope supports on the pines", "es": "Mejor época: noviembre (hojas) · en invierno, las pértigas de cuerda en los pinos", "fr": "Meilleure période : novembre (feuillages) · en hiver, les cordes sur les pins", "it": "Periodo migliore: novembre (foglie) · d’inverno, le corde sui pini", "ja": "おすすめ：11月の紅葉、冬は松の雪つり"}, "t": {"en": "Home of Kenrokuen, one of Japan's great landscape gardens, about two and a half hours from Tokyo on the Hokuriku Shinkansen.", "es": "Hogar de Kenrokuen, uno de los grandes jardines paisajísticos de Japón, a unas dos horas y media de Tokio en el Hokuriku Shinkansen.", "fr": "La ville de Kenrokuen, l’un des grands jardins paysagers du Japon, à environ deux heures et demie de Tokyo en Hokuriku Shinkansen.", "it": "La città di Kenrokuen, uno dei grandi giardini paesaggistici del Giappone, a circa due ore e mezza da Tokyo con lo Hokuriku Shinkansen.", "ja": "日本を代表する名園・兼六園のある町。北陸新幹線で、東京から2時間半ほどです。"}, "v": "jp-kanazawa"}, {"s": "osaka-hiroshima", "i": "jp-hiroshima", "c": {"en": "Hiroshima · Island shrine", "es": "Hiroshima · Santuario en una isla", "fr": "Hiroshima · Sanctuaire sur une île", "it": "Hiroshima · Santuario su un’isola", "ja": "広島・島の神社"}, "p": {"en": "Hiroshima · Miyajima", "es": "Hiroshima · Miyajima", "fr": "Hiroshima · Miyajima", "it": "Hiroshima · Miyajima", "ja": "広島・宮島"}, "r": {"en": "Osaka → Hiroshima by Sanyo Shinkansen, then local train and ferry", "es": "Osaka → Hiroshima en el Sanyo Shinkansen, luego tren local y ferry", "fr": "Osaka → Hiroshima en Sanyo Shinkansen, puis train local et ferry", "it": "Osaka → Hiroshima con lo Sanyo Shinkansen, poi treno locale e traghetto", "ja": "大阪 → 広島　山陽新幹線、そのあと在来線とフェリー"}, "m": {"en": "Best: Oct–Nov · soft light on the water", "es": "Mejor época: oct–nov · luz suave sobre el agua", "fr": "Meilleure période : oct.–nov. · lumière douce sur l’eau", "it": "Periodo migliore: ott–nov · luce morbida sull’acqua", "ja": "おすすめ：10〜11月、水面にやわらかな光"}, "t": {"en": "From Hiroshima a short local train and a ferry reach Miyajima, where the torii of Itsukushima Shrine seems to float at high tide.", "es": "Desde Hiroshima, un tren local corto y un ferry llevan a Miyajima, donde el torii del santuario de Itsukushima parece flotar con la marea alta.", "fr": "Depuis Hiroshima, un court trajet en train local puis un ferry mènent à Miyajima, où le torii du sanctuaire d’Itsukushima semble flotter à marée haute.", "it": "Da Hiroshima un breve treno locale e un traghetto portano a Miyajima, dove il torii del santuario di Itsukushima sembra galleggiare con l’alta marea.", "ja": "広島から在来線とフェリーで宮島へ。満潮のときには、厳島神社の大鳥居が海に浮かぶように見えます。"}, "v": "jp-hiroshima"}, {"s": "tokyo-kyoto", "i": "jp-tokaido", "c": {"en": "Tokyo → Kyoto", "es": "Tokio → Kioto", "fr": "Tokyo → Kyoto", "it": "Tokyo → Kyoto", "ja": "東京 → 京都"}, "p": {"en": "Tokaido Shinkansen", "es": "Tokaido Shinkansen", "fr": "Tokaido Shinkansen", "it": "Tokaido Shinkansen", "ja": "東海道新幹線"}, "r": {"en": "The classic Shinkansen ride", "es": "El Shinkansen clásico", "fr": "Le Shinkansen classique", "it": "Lo Shinkansen classico", "ja": "定番の新幹線の旅"}, "m": {"en": "About 2h15 · several departures an hour", "es": "Unas 2 h 15 min · varias salidas por hora", "fr": "Environ 2 h 15 · plusieurs départs par heure", "it": "Circa 2 h 15 · più partenze all’ora", "ja": "約2時間15分・1時間に何本も運行"}, "t": {"en": "Japan's classic ride. Heading west, sit on the right side for the best chance of seeing Mt Fuji.", "es": "El clásico de Japón. Hacia el oeste, siéntate en el lado derecho para tener más posibilidades de ver el Fuji.", "fr": "Le grand classique du Japon. Vers l’ouest, asseyez-vous du côté droit pour avoir plus de chances d’apercevoir le Fuji.", "it": "Il classico del Giappone. Verso ovest, siediti sul lato destro per avere più possibilità di vedere il Fuji.", "ja": "日本を代表する鉄道の旅。西へ向かうときは、右側の席に座ると富士山が見えやすくなります。"}, "v": "jp-tokaido"}];
  var JP_DISC_LEAD = {"en": "Towns and corners of Japan that are best reached by train — onsen villages, old towns and mountain lines.", "es": "Pueblos y rincones de Japón que se disfrutan mejor en tren: aldeas de onsen, cascos antiguos y líneas de montaña.", "fr": "Des villes et des recoins du Japon à découvrir en train : villages d’onsen, vieilles villes et lignes de montagne.", "it": "Borghi e angoli del Giappone che si raggiungono meglio in treno: villaggi di onsen, città vecchie e linee di montagna.", "ja": "電車でこそ行きたい日本の町や小さな旅先。温泉の里、古い町並み、山あいの路線。"};
  var JP_DISC_WATCH = {"en": "See the guide →", "es": "Ver la guía →", "fr": "Voir le guide →", "it": "Vedi la guida →", "ja": "ガイドを見る →"};
  (function () {
    var grid = document.querySelector('#discover .discover-grid');
    if (!grid || grid.getAttribute('data-jp-twin')) return;
    var lg = lang(), key = JP_DISCOVER[0].p[lg] ? lg : 'en', suf = (lg === 'es' || lg === 'fr' || lg === 'it' || lg === 'ja') ? '/' + lg + '/' : '/';
    var lead = document.querySelector('[data-i18n="disc_lead"]');
    twinHome(lead, function (c) { c.textContent = JP_DISC_LEAD[key]; });
    var esc = function (x) { return String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    twinHome(grid, function (c) {
      c.classList.add('jp-discover-grid');
      c.innerHTML = JP_DISCOVER.map(function (d) {
        return '<a href="/rutas/' + d.s + suf + '" class="discover-card is-featured" style="background-image:url(\'/scenic/' + d.i + '.webp\')">' +
          (d.v ? '<video class="discover-video" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" data-src="/scenic/video/' + d.v + '.mp4"></video>' : '') + '<span class="discover-pin"></span><div class="discover-country">' + esc(d.c[key]) + '</div><div class="discover-place">' + esc(d.p[key]) + '</div>' +
          '<div class="discover-route">' + esc(d.r[key]) + '</div><div class="discover-season">' + esc(d.m[key]) + '</div>' +
          '<div class="discover-tip">' + esc(d.t[key]) + '</div><span class="discover-watch">' + esc(JP_DISC_WATCH[key]) + '</span></a>';
      }).join('');
    });
    // Vídeos de las tarjetas: se cargan y reproducen solo cuando la tarjeta está a la vista (y si el usuario no pidió menos movimiento ni ahorro de datos)
    var jg = document.querySelector('.jp-discover-grid'), vids = jg ? jg.querySelectorAll('.discover-video') : [];
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saver = navigator.connection && navigator.connection.saveData;
    if (vids.length && !calm && !saver && 'IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var v = e.target;
          if (e.isIntersecting) {
            if (!v.getAttribute('src')) v.setAttribute('src', v.getAttribute('data-src'));
            var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
          } else { v.pause(); }
        });
      }, { rootMargin: '120px', threshold: 0.35 });
      vids.forEach(function (v) {
        v.addEventListener('playing', function () { v.classList.add('is-on'); });
        vio.observe(v);
      });
    }
  })();

  // ── Características en modo Japón (fase 3): textos que hablaban solo de Europa o de datos en vivo ──
  var JP_FEAT = {"en": {"lead": "No subscriptions, no paywalls. Just clear journey times and smart tools.", "f1t": "Journey times at a glance", "f1d": "The duration of the fastest direct service on each Japanese route, taken from Klook data.", "f2t": "Japan & Europe, one site", "f2d": "Shinkansen, limited expresses and local lines from Hokkaido to Kyushu — and Europe too — in a single interface.", "f3t": "Journey search", "f3d": "Find the fastest direct service between Japanese cities, with journey times and a link to book.", "f4d": "Design multi-city trips across Japan 100% free. No travel agent required."}, "es": {"lead": "Sin suscripciones ni muros de pago. Solo tiempos de viaje claros y herramientas inteligentes.", "f1t": "Tiempos de viaje de un vistazo", "f1d": "La duración del servicio directo más rápido de cada ruta japonesa, con datos de Klook.", "f2t": "Japón y Europa, un solo sitio", "f2d": "Shinkansen, expresos limitados y líneas locales de Hokkaido a Kyushu —y también Europa— en una sola interfaz.", "f3t": "Búsqueda de trayectos", "f3d": "Encuentra el servicio directo más rápido entre ciudades japonesas, con el tiempo de viaje y un enlace para reservar.", "f4d": "Diseña viajes por varias ciudades de Japón 100% gratis. Sin agente de viajes."}, "fr": {"lead": "Sans abonnement ni accès payant. Seulement des durées de trajet claires et des outils intelligents.", "f1t": "Les durées de trajet en un coup d’œil", "f1d": "La durée du service direct le plus rapide de chaque itinéraire japonais, d’après les données de Klook.", "f2t": "Japon et Europe, un seul site", "f2d": "Shinkansen, express limités et lignes locales de Hokkaido à Kyushu — et l’Europe aussi — dans une seule interface.", "f3t": "Recherche de trajets", "f3d": "Trouvez le service direct le plus rapide entre villes japonaises, avec la durée du trajet et un lien pour réserver.", "f4d": "Concevez des voyages multi-villes au Japon 100 % gratuitement. Sans agent de voyage."}, "it": {"lead": "Niente abbonamenti né paywall. Solo tempi di viaggio chiari e strumenti intelligenti.", "f1t": "Tempi di viaggio a colpo d’occhio", "f1d": "La durata del servizio diretto più rapido su ogni percorso giapponese, secondo i dati di Klook.", "f2t": "Giappone ed Europa, un solo sito", "f2d": "Shinkansen, limited express e linee locali da Hokkaido a Kyushu — e anche l’Europa — in un’unica interfaccia.", "f3t": "Ricerca dei tragitti", "f3d": "Trova il servizio diretto più rapido tra le città giapponesi, con il tempo di viaggio e un link per prenotare.", "f4d": "Progetta viaggi in più città del Giappone 100% gratis. Nessun agente di viaggio."}, "de": {"lead": "Keine Abos, keine Paywalls. Nur klare Fahrzeiten und smarte Tools.", "f1t": "Fahrzeiten auf einen Blick", "f1d": "Die Dauer der schnellsten Direktverbindung auf jeder Strecke in Japan, nach Klook-Daten.", "f2t": "Japan & Europa, eine Seite", "f2d": "Shinkansen, Limited Express und Lokalbahnen von Hokkaido bis Kyushu — und Europa — in einer Oberfläche.", "f3t": "Verbindungssuche", "f3d": "Finde die schnellste Direktverbindung zwischen japanischen Städten, mit Fahrzeit und Buchungslink.", "f4d": "Plane Reisen durch mehrere Städte Japans 100 % kostenlos. Kein Reisebüro nötig."}, "pt": {"lead": "Sem assinaturas nem acesso pago. Só tempos de viagem claros e ferramentas inteligentes.", "f1t": "Tempos de viagem num relance", "f1d": "A duração do serviço direto mais rápido de cada rota japonesa, com dados da Klook.", "f2t": "Japão e Europa, um só site", "f2d": "Shinkansen, expressos limitados e linhas locais de Hokkaido a Kyushu — e também a Europa — numa única interface.", "f3t": "Busca de trajetos", "f3d": "Encontre o serviço direto mais rápido entre cidades japonesas, com o tempo de viagem e um link para reservar.", "f4d": "Planeje viagens por várias cidades do Japão 100% grátis. Sem agente de viagens."}, "ja": {"lead": "登録も有料の壁もありません。わかりやすい所要時間と、便利な機能だけ。", "f1t": "所要時間がひと目でわかる", "f1d": "日本の各区間で、いちばん速い直通列車の所要時間をKlookのデータから表示します。", "f2t": "日本もヨーロッパも、ひとつのサイトで", "f2d": "北海道から九州まで、新幹線も特急もローカル線も。ヨーロッパも、ひとつの画面で。", "f3t": "区間検索", "f3d": "日本の都市どうしを結ぶ、いちばん速い直通列車を探せます。所要時間と予約へのリンク付き。", "f4d": "日本の複数都市をめぐる旅を、完全無料で計画できます。旅行会社は不要です。"}};
  (function () {
    var F = JP_FEAT[lang()] || JP_FEAT.en;
    var rep = function (sel, txt) { var el = document.querySelector('#features ' + sel); if (el) twinHome(el, function (c) { c.textContent = txt; }); };
    rep('[data-i18n="features_lead"]', F.lead);
    rep('[data-i18n="f1_title"]', F.f1t); rep('[data-i18n="f1_desc"]', F.f1d);
    rep('[data-i18n="f2_title"]', F.f2t); rep('[data-i18n="f2_desc"]', F.f2d);
    rep('[data-i18n="f3_title"]', F.f3t); rep('[data-i18n="f3_desc"]', F.f3d);
    rep('[data-i18n="f4_desc"]', F.f4d);
  })();

  // ── Franja de rutas (estadísticas): nombres de ciudad traducidos y versión de Japón ──────────────
  var JP_STATS = {"en": "From <strong>196 route guides</strong> across Japan to your next trip — free, no signup.", "es": "De <strong>196 guías de rutas</strong> por Japón a tu próximo viaje — gratis, sin registro.", "fr": "De <strong>196 guides d’itinéraires</strong> à travers le Japon à votre prochain voyage — gratuit, sans inscription.", "it": "Da <strong>196 guide di percorso</strong> in tutto il Giappone al tuo prossimo viaggio — gratis, senza registrazione.", "de": "Von <strong>196 Routen-Guides</strong> in ganz Japan zu deiner nächsten Reise — kostenlos, ohne Anmeldung.", "pt": "De <strong>196 guias de rotas</strong> pelo Japão para a sua próxima viagem — grátis, sem cadastro.", "ja": "日本全国の<strong>196路線ガイド</strong>から、次の旅へ。無料、登録不要。"};
  (function () {
    var lg = lang();
    var marq = document.querySelector('.stats-marquee');
    var prose = document.getElementById('statsProse');
    if (marq && lg !== 'en') {
      marq.querySelectorAll('.route-chip').forEach(function (chip) {
        var parts = chip.textContent.split('→');
        if (parts.length === 2) chip.textContent = hname(lg, parts[0].trim()) + ' → ' + hname(lg, parts[1].trim());
      });
    }
    if (prose) twinHome(prose, function (c) { c.innerHTML = JP_STATS[lg] || JP_STATS.en; });
    if (marq) {
      var nm = function (n) { return n === 'Shinjuku' ? (JP_SHINJUKU[lg] || n) : hname(lg, n); };
      var chips = JP_PILLS.map(function (p) { return '<span class="route-chip">' + nm(p[1]) + ' → ' + nm(p[2]) + '</span>'; }).join('');
      twinHome(marq, function (c) { c.innerHTML = '<div class="stats-track">' + chips + chips + '</div>'; });
    }
  })();

  // ── Esenciales en modo Japón: eSIM de Japón y Klook (tours) en lugar de Tiqets, que es de atracciones europeas ──
  var JP_ESS = {"en": ["eSIM Japan", "Tours & activities", "See activities →"], "es": ["eSIM Japón", "Tours y actividades", "Ver actividades →"], "fr": ["eSIM Japon", "Visites et activités", "Voir les activités →"], "it": ["eSIM Giappone", "Tour e attività", "Vedi le attività →"], "de": ["eSIM Japan", "Touren & Aktivitäten", "Aktivitäten ansehen →"], "pt": ["eSIM Japão", "Passeios e atividades", "Ver atividades →"], "ja": ["日本のeSIM", "ツアーとアクティビティ", "アクティビティを見る →"]};
  (function () {
    var E = JP_ESS[lang()] || JP_ESS.en;
    var yt = document.querySelector('.essentials-bar [data-i18n="p_yesim_title"]');
    twinHome(yt, function (c) { c.textContent = E[0]; });
    var tq = null;
    document.querySelectorAll('.essentials-bar .essential-item').forEach(function (a) { if (/goPartner\('tiqets'/.test(a.getAttribute('onclick') || '')) tq = a; });
    if (tq) {
      var k = tq.cloneNode(true); k.setAttribute('data-jp-twin', '1');
      k.setAttribute('onclick', "goPartner('klook', event)");
      k.querySelectorAll('[data-i18n]').forEach(function (n) { n.removeAttribute('data-i18n'); });
      k.querySelector('.essential-brand').textContent = 'Klook';
      k.querySelector('.essential-title').textContent = E[1];
      k.querySelector('.essential-cta').textContent = E[2];
      tq.classList.add('eu-only'); k.classList.add('jp-only');
      tq.parentNode.insertBefore(k, tq.nextSibling);
    }
    document.querySelectorAll('.partner-row').forEach(function (a) { if (/goPartner\('tiqets'/.test(a.getAttribute('onclick') || '')) a.classList.add('eu-only'); });
  })();

  // ── Resultado del planificador: textos que la IA devuelve en inglés ("2 hours 30 minutes", "A to B via C") ──
  (function () {
    var lg = lang(); if (lg === 'en') return;
    var H = { es: ['h', 'min', 'por'], fr: ['h', 'min', 'via'], it: ['h', 'min', 'via'], de: ['Std.', 'Min.', 'über'], pt: ['h', 'min', 'via'], ja: ['時間', '分', '経由'] }[lg];
    if (!H) return;
    var res = document.getElementById('aiResults'); if (!res || !window.MutationObserver) return;
    var rx = /(\d+)\s*(?:hours?|hrs?|h)\b(?:\s*(?:and\s*)?(\d+)\s*(?:minutes?|mins?|min))?|(\d+)\s*(?:minutes?|mins?)\b/gi;
    function fix(txt) {
      var t = txt.replace(rx, function (m, h, mm, only) {
        if (only) return lg === 'ja' ? only + H[1] : only + ' ' + H[1];
        if (lg === 'ja') return h + H[0] + (mm ? mm + H[1] : '');
        return h + ' ' + H[0] + (mm ? ' ' + mm + ' ' + H[1] : '');
      });
      t = t.replace(/\s+via\s+/g, ' ' + H[2] + ' ');
      if (/^[^→]+\sto\s[^→]+$/.test(t) && !/\d/.test(t)) t = t.replace(/\sto\s/, ' → ');
      return t;
    }
    var busy = false;
    function run() {
      if (busy) return; busy = true;
      var w = document.createTreeWalker(res, NodeFilter.SHOW_TEXT, null), n;
      while ((n = w.nextNode())) {
        var v = n.nodeValue; if (!v || v.length > 160) continue;
        if (!/\b(hours?|hrs?|minutes?|mins?)\b|\svia\s|\sto\s/i.test(v)) continue;
        var nv = fix(v); if (nv !== v) n.nodeValue = nv;
      }
      busy = false;
    }
    new MutationObserver(function () { setTimeout(run, 0); }).observe(res, { childList: true, subtree: true, characterData: true });
  })();

  // ── Planificador de IA: mensajes en el idioma de la página, tiempo máximo y aviso de rutas incompletas ──
  var PL_MSG = {"en": {"gen": "Generating…", "still": "Still working — this can take a few seconds…", "empty": "Type a destination or a trip idea to start.", "conn": "We could not connect. Please try again.", "slow": "This is taking longer than usual. Please try again, or pick one of the popular routes above.", "rate": "You have made several requests in a row. Please wait a minute and try again.", "inc": "We could not include: {x}. Try asking for that part as a separate trip."}, "es": {"gen": "Generando…", "still": "Sigue en marcha: puede tardar unos segundos…", "empty": "Escribe un destino o una idea de viaje para empezar.", "conn": "No pudimos conectar. Inténtalo de nuevo.", "slow": "Está tardando más de lo normal. Inténtalo de nuevo o elige una de las rutas populares de arriba.", "rate": "Has hecho varias consultas seguidas. Espera un minuto e inténtalo de nuevo.", "inc": "No pudimos incluir: {x}. Prueba a pedir esa parte como un viaje aparte."}, "fr": {"gen": "Génération…", "still": "Toujours en cours : cela peut prendre quelques secondes…", "empty": "Saisissez une destination ou une idée de voyage pour commencer.", "conn": "Connexion impossible. Veuillez réessayer.", "slow": "Cela prend plus de temps que d’habitude. Réessayez ou choisissez l’un des itinéraires populaires ci-dessus.", "rate": "Vous avez fait plusieurs demandes d’affilée. Attendez une minute puis réessayez.", "inc": "Nous n’avons pas pu inclure : {x}. Demandez cette partie comme un voyage séparé."}, "it": {"gen": "Generazione…", "still": "Ancora in corso: può richiedere qualche secondo…", "empty": "Scrivi una destinazione o un’idea di viaggio per iniziare.", "conn": "Impossibile connettersi. Riprova.", "slow": "Sta impiegando più del solito. Riprova o scegli uno dei percorsi popolari qui sopra.", "rate": "Hai fatto più richieste di seguito. Attendi un minuto e riprova.", "inc": "Non siamo riusciti a includere: {x}. Prova a chiedere quella parte come viaggio separato."}, "de": {"gen": "Wird erstellt…", "still": "Läuft noch – das kann ein paar Sekunden dauern…", "empty": "Gib ein Ziel oder eine Reiseidee ein, um zu starten.", "conn": "Verbindung nicht möglich. Bitte versuche es erneut.", "slow": "Das dauert länger als üblich. Versuche es erneut oder wähle eine der beliebten Strecken oben.", "rate": "Du hast mehrere Anfragen hintereinander gestellt. Warte eine Minute und versuche es erneut.", "inc": "Nicht enthalten: {x}. Frage diesen Teil als separate Reise an."}, "pt": {"gen": "Gerando…", "still": "Ainda em andamento: pode levar alguns segundos…", "empty": "Digite um destino ou uma ideia de viagem para começar.", "conn": "Não foi possível conectar. Tente novamente.", "slow": "Está demorando mais que o normal. Tente novamente ou escolha uma das rotas populares acima.", "rate": "Você fez várias consultas seguidas. Aguarde um minuto e tente novamente.", "inc": "Não conseguimos incluir: {x}. Peça essa parte como uma viagem separada."}, "ja": {"gen": "作成中…", "still": "処理中です。数秒かかることがあります…", "empty": "目的地や旅のイメージを入力してください。", "conn": "接続できませんでした。もう一度お試しください。", "slow": "通常より時間がかかっています。もう一度お試しいただくか、上の人気ルートをお選びください。", "rate": "続けて何度も検索されました。1分ほど待ってからもう一度お試しください。", "inc": "含められなかった都市：{x}。その部分は別の旅として入力してみてください。"}};
  window.glosxPlannerMsg = function (k) { var m = PL_MSG[lang()] || PL_MSG.en; return m[k] || PL_MSG.en[k] || ''; };
  (function () {
    if (!window.fetch || window.__glosxPlannerFetch) return;
    window.__glosxPlannerFetch = true;
    var orig = window.fetch.bind(window);
    var CITY_LABEL = function (c) { return String(c).replace(/\b\w/g, function (x) { return x.toUpperCase(); }); };
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      if (!/\/api\/route-planner/.test(url)) return orig(input, init);
      var ctrl = new AbortController(), timedOut = false;
      var to = setTimeout(function () { timedOut = true; ctrl.abort(); }, 70000);
      var btn = document.querySelector('.ai-generate-btn'), still = setTimeout(function () { if (btn && btn.classList.contains('loading')) btn.textContent = window.glosxPlannerMsg('still'); }, 9000);
      var o = Object.assign({}, init || {}, { signal: ctrl.signal });
      return orig(input, o).then(function (resp) {
        clearTimeout(to); clearTimeout(still);
        if (resp.status === 429) {
          return new Response(JSON.stringify({ valido: false, mensajeError: window.glosxPlannerMsg('rate') }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        resp.clone().json().then(function (d) {
          if (d && d.ciudades_faltantes && d.ciudades_faltantes.length) {
            var txt = window.glosxPlannerMsg('inc').replace('{x}', d.ciudades_faltantes.map(CITY_LABEL).join(', '));
            setTimeout(function () {
              var segs = document.getElementById('aiSegments'), old = document.querySelector('.ai-incomplete-note');
              if (old) old.remove();
              if (!segs) return;
              var p = document.createElement('p'); p.className = 'ai-incomplete-note'; p.textContent = txt;
              segs.parentNode.insertBefore(p, segs);
            }, 900);
          }
        }).catch(function () {});
        return resp;
      }).catch(function (e) {
        clearTimeout(to); clearTimeout(still);
        if (timedOut) return new Response(JSON.stringify({ valido: false, mensajeError: window.glosxPlannerMsg('slow') }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        throw e;
      });
    };
  })();

  // Franja de color de la alianza (Omio en Europa, Klook en Japón) detrás de las ventajas y los operadores:
  // sube un poco para quedar por detrás del planificador.
  (function () {
    var ben = document.querySelector('.search-benefits'), ext = document.querySelector('.search-extras');
    if (!ben || !ext || ben.parentNode !== ext.parentNode || ben.parentNode.classList.contains('trust-band')) return;
    var band = document.createElement('div'); band.className = 'trust-band';
    ben.parentNode.insertBefore(band, ben); band.appendChild(ben); band.appendChild(ext);
  })();

  switchEl.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.region-btn') : null;
    if (!b) return;
    if (b.hasAttribute('data-hotels')) { toggleHotels(b); return; }
    if (document.body.classList.contains('hotels-mode')) closeHotels();
    setRegion(b.getAttribute('data-region'));
  });

  new MutationObserver(function () { setTimeout(paintMode, 80); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  paintSwitch();
  // Enlace directo al modo Japón (por ejemplo, desde anuncios): glosx.app/#japan
  if (/^#(japan|japon|giappone|japao)$/i.test(location.hash)) setRegion('japan', true);
})();
