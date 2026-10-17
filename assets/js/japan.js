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
    var klookHotels = document.querySelector('.klook-city-picker');
    if (klookHotels) klookHotels.classList.add('eu-only');
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
    function pick(c) { chosen = c; inp.value = c; list.classList.remove('open'); }
    function matches() {
      var q = hnorm(inp.value);
      if (!q) return pop;
      var st = cities.filter(function (c) { return hnorm(c).indexOf(q) === 0; });
      var inn = cities.filter(function (c) { return hnorm(c).indexOf(q) > 0; });
      return st.concat(inn);
    }
    function paintList() {
      var m = matches().slice(0, 8);
      list.innerHTML = '';
      if (!m.length) { var e = document.createElement('div'); e.className = 'hotels-none'; e.textContent = u.none; list.appendChild(e); }
      m.forEach(function (c) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'hotels-opt'; b.textContent = c;
        b.addEventListener('mousedown', function (ev) { ev.preventDefault(); pick(c); });
        list.appendChild(b);
      });
      list.classList.add('open');
    }
    function submit() {
      var m = matches();
      var exact = cities.filter(function (c) { return hnorm(c) === hnorm(inp.value); })[0];
      var city = exact || m[0];
      if (!city || !inp.value.trim()) { inp.focus(); paintList(); return; }
      if (typeof window.goKlookHotelCity === 'function') window.goKlookHotelCity(city, ci.value && co.value && co.value > ci.value ? ci.value : '', ci.value && co.value && co.value > ci.value ? co.value : '');
    }
    inp.addEventListener('focus', paintList);
    inp.addEventListener('input', paintList);
    inp.addEventListener('blur', function () { setTimeout(function () { list.classList.remove('open'); }, 120); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); var first = list.querySelector('.hotels-opt'); if (list.classList.contains('open') && first && hnorm(inp.value) !== hnorm(first.textContent)) pick(first.textContent); else submit(); } });
    go.addEventListener('click', submit);
    pop.forEach(function (c) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'hotels-city'; b.textContent = c;
      b.addEventListener('click', function () { pick(c); (ci.value ? co : ci).focus(); });
      row.appendChild(b);
    });
    // "Todas las ciudades": lista completa agrupada por país, desplegable dentro del propio panel
    var allBtn = document.createElement('button'); allBtn.type = 'button'; allBtn.className = 'hotels-all';
    allBtn.textContent = u.all + ' (' + cities.length + ') ▾';
    var allBox = document.createElement('div'); allBox.className = 'hotels-allbox'; allBox.hidden = true;
    Array.prototype.forEach.call(src.children, function (n) {
      if (n.classList.contains('klook-city-group-label')) { var g = document.createElement('div'); g.className = 'hotels-group'; var gt = document.createElement('span'); gt.className = 'hotels-flag'; gt.textContent = n.textContent; g.appendChild(gt); allBox.appendChild(g); }
      else { var c = n.textContent.trim(), b = document.createElement('button'); b.type = 'button'; b.className = 'hotels-city'; b.textContent = c;
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
