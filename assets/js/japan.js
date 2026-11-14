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
    en: { china: 'China', hotels: 'Hotels', europe: 'Europe', japan: 'Japan', aria: 'Region', leg: 'We have no verified direct train between {a} and {b}. Try another order or pick a popular route.', two: 'Enter two or more cities, in the order you will travel.', ph: 'Train from Tokyo to Kyoto', nopair: 'Pick one of the popular routes, or try another pair of Japanese cities.' },
    es: { china: 'China', hotels: 'Hoteles', europe: 'Europa', japan: 'Japón', aria: 'Región', leg: 'No tenemos un tren directo verificado entre {a} y {b}. Prueba otro orden o elige una ruta popular.', two: 'Escribe dos o más ciudades, en el orden del viaje.', ph: 'Tren de Tokio a Kioto', nopair: 'Elige una de las rutas populares o prueba otro par de ciudades japonesas.' },
    fr: { china: 'Chine', hotels: 'Hôtels', europe: 'Europe', japan: 'Japon', aria: 'Région', leg: 'Nous n’avons pas de train direct vérifié entre {a} et {b}. Essayez un autre ordre ou choisissez une route populaire.', two: 'Indiquez deux villes ou plus, dans l’ordre du voyage.', ph: 'Train de Tokyo à Kyoto', nopair: 'Choisissez l’une des routes populaires ou essayez une autre paire de villes japonaises.' },
    it: { china: 'Cina', hotels: 'Hotel', europe: 'Europa', japan: 'Giappone', aria: 'Regione', leg: 'Non abbiamo un treno diretto verificato tra {a} e {b}. Prova un altro ordine o scegli un percorso popolare.', two: 'Scrivi due o più città, nell’ordine del viaggio.', ph: 'Treno da Tokyo a Kyoto', nopair: 'Scegli uno dei percorsi popolari o prova un’altra coppia di città giapponesi.' },
    de: { china: 'China', hotels: 'Hotels', europe: 'Europa', japan: 'Japan', aria: 'Region', leg: 'Zwischen {a} und {b} haben wir keine geprüfte Direktverbindung. Probiere eine andere Reihenfolge oder wähle eine beliebte Strecke.', two: 'Gib zwei oder mehr Städte ein, in der Reihenfolge der Reise.', ph: 'Zug von Tokio nach Kyoto', nopair: 'Wähle eine der beliebten Strecken oder probiere ein anderes Städtepaar in Japan.' },
    pt: { china: 'China', hotels: 'Hotéis', europe: 'Europa', japan: 'Japão', aria: 'Região', leg: 'Não temos um trem direto verificado entre {a} e {b}. Tente outra ordem ou escolha uma rota popular.', two: 'Digite duas ou mais cidades, na ordem da viagem.', ph: 'Comboio de Tóquio a Quioto', nopair: 'Escolha uma das rotas populares ou tente outro par de cidades japonesas.' },
    ja: { china: '中国', hotels: 'ホテル', europe: 'ヨーロッパ', japan: '日本', aria: '地域', leg: '{a} と {b} のあいだに、確認済みの直通列車はありません。順番を変えるか、人気の路線を選んでください。', two: '行く順に、2つ以上の都市を入力してください。', ph: '例：東京から京都への列車', nopair: '人気の路線を選ぶか、別の日本の都市の組み合わせを試してください。' },
    zh: { china: '中国', hotels: '酒店', europe: '欧洲', japan: '日本', aria: '地区', leg: '{a} 和 {b} 之间没有经过核实的直达列车。请换个顺序，或选择一条热门线路。', two: '按出行顺序输入两个或更多城市。', ph: '例如：从东京到京都的火车', nopair: '请选择一条热门线路，或换一组日本城市试试。' }
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
  function t(key) { if (region === 'china' && CN_TXT[lang()] && CN_TXT[lang()][key] != null) return CN_TXT[lang()][key]; return I18N[lang()][key]; }
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

  var CONN = { en: 'to', es: 'a', fr: '\u00e0', it: 'a', de: 'nach', pt: 'a', ja: 'から', zh: '到' };
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
    if (region !== 'europe') {
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
  function lastKey() { return 'glosx_' + region + '_last_route'; }
  function readJapanLast() {
    try {
      var o = JSON.parse(localStorage.getItem(lastKey()) || 'null');
      if (o && Array.isArray(o.legs) && o.legs.length && Date.now() - o.ts < 24 * 3600 * 1000) return o;
    } catch (e) {}
    return null;
  }
  function saveJapanLast(legs) {
    try { localStorage.setItem(lastKey(), JSON.stringify({ legs: legs, ts: Date.now() })); } catch (e) {}
    syncRestoreBtn();
  }
  function syncRestoreBtn() {
    var btn = document.getElementById('aiRestoreBtn');
    if (!btn) return;
    if (region !== 'europe') { btn.style.display = readJapanLast() ? 'block' : 'none'; return; }
    var show = false;
    try {
      var ts = parseInt(localStorage.getItem('ai_last_route_timestamp'), 10);
      show = !!ts && (Date.now() - ts) / 3600000 < 24;
    } catch (e) {}
    btn.style.display = show ? 'block' : 'none';
  }
  document.addEventListener('click', function (e) {
    if (region === 'europe' || !e.target.closest || !e.target.closest('#aiRestoreBtn')) return;
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
    if (region !== 'europe' && /Omio/.test(txt)) { subEl.setAttribute('data-eu-text', txt); subEl.textContent = txt.replace(/Omio/g, 'Klook'); }
    else if (region === 'europe' && subEl.hasAttribute('data-eu-text')) { subEl.textContent = subEl.getAttribute('data-eu-text'); subEl.removeAttribute('data-eu-text'); }
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
    // China usa el mismo estilo Klook que Japón: data-region="japan" + data-klook="china"
    document.body.setAttribute('data-region', r === 'europe' ? 'europe' : 'japan');
    if (r === 'china') document.body.setAttribute('data-klook', 'china'); else document.body.removeAttribute('data-klook');
    if (r !== 'europe') useData(r);
    inputEl.value = '';
    var aurora = document.getElementById('aiInputAurora');
    if (aurora) aurora.classList.remove('active');
    var err = document.getElementById('aiPlannerError');
    if (err) err.remove();
    if (r !== 'europe') {
      setCities(CITIES);
      window.GLOSX_ROUTE_PAGES = japanPages;
      var res = document.getElementById('aiResults');
      if (res) res.style.display = 'none';
      resetBoard(valueOf(QUICK[0][0]), valueOf(QUICK[0][1]));
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
      try { history.replaceState(null, '', location.pathname + location.search + (r === 'europe' ? '' : '#' + r)); } catch (e) {}
    }
  }

  // Lectura flexible de lo que escribe la persona: acepta "Tokio a Kioto", "Tokio Kioto",
  // "Tokio - Kioto", "Tokio -> Kioto", "Tokio, Kioto", "Tokio y Kioto"... Busca los nombres
  // de ciudades dentro del texto (el más largo primero, así "Shin Osaka" gana a "Osaka").
  function fold(x) {
    return String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/から|到|至/g, ' ')
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
    if (region !== 'europe') return japanGenerate();
    return originalGenerate.apply(this, arguments);
  };
  inputEl.addEventListener('keydown', function (e) {
    if (region !== 'europe' && e.key === 'Enter') {
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
  var SLUG_FIX = { naritaairport: 'narita-airport', kansaiairport: 'kansai-airport', newchitoseairport: 'new-chitose-airport', hidafurukawa: 'hida-furukawa', huistenbosch: 'huis-ten-bosch', joetsumyoko: 'joetsu-myoko', kagaonsen: 'kaga-onsen', kiitanabe: 'kii-tanabe', kinugawaonsen: 'kinugawa-onsen', nasushiobara: 'nasu-shiobara', shinfuji: 'shin-fuji', shinhakodatehokuto: 'shin-hakodate-hokuto', shinhanamaki: 'shin-hanamaki', shinsapporo: 'shin-sapporo', shinyamaguchi: 'shin-yamaguchi', shinyokohama: 'shin-yokohama', takeoonsen: 'takeo-onsen', hongkong: 'hong-kong' };
  function guideHref(a, b) {
    var l = lang(), suffix = { es: 'es/', fr: 'fr/', it: 'it/', ja: 'ja/' }[l] || '';
    var fa = SLUG_FIX[a] || a, fb = SLUG_FIX[b] || b;
    var c = [fa + '-' + fb, fb + '-' + fa, a + '-' + b, b + '-' + a], i;
    for (i = 0; i < c.length; i++) if (JP_GUIDES.indexOf(' ' + c[i] + ' ') > -1) return '/rutas/' + c[i] + '/' + (l === 'zh' ? (ZH_PAGES.indexOf(' ' + c[i] + ' ') > -1 ? 'zh/' : '') : suffix);
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
      '</div><p class="rp-note pi-note">' + esc(region === 'china' ? cx('note') : t.note) + '</p>';
    if (g) {
      var rt = seg.querySelector('.ai-segment-route');
      if (window.glosxGuideCard) box.appendChild(window.glosxGuideCard(g, rt ? rt.textContent.trim() : '', a));
      else box.insertAdjacentHTML('beforeend', '<a class="pi-guide" href="' + esc(g) + '">' + esc(t.guide) + ' <span aria-hidden="true">→</span></a>');
    }
    // "Qué hacer en {destino}" (Klook + GetYourGuide de la ciudad elegida), una vez por resultado
    var res = seg.closest('.ai-results');
    if (window.glosxExpLine && res && !res.querySelector('.pi-exp')) {
      var rte = seg.querySelector('.ai-segment-route'), dn = rte ? (rte.textContent.split('→')[1] || '').trim() : '';
      box.appendChild(window.glosxExpLine(String(b).toLowerCase(), dn));
    }
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
    if (d.s) parts.push(hsName());
    if (d.t.length) parts.push(d.t.join(', '));
    if (d.n) parts.push(cx('perday').replace('{n}', d.n));
    parts.push(tx.direct);
    return parts.join(' · ');
  }
  function paintInfo() {
    if (region === 'europe' || !segsEl || infoBusy) return;
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
  function ht(k) { if (region === 'china') { var c = cx(k); if (c != null) return c; } return (HOME_I18N[lang()] || HOME_I18N.en)[k]; }
  var CITY_LOC = { es: { Tokyo: 'Tokio', Kyoto: 'Kioto' }, pt: { Tokyo: 'Tóquio', Kyoto: 'Quioto' }, ja: { Tokyo: '東京', Kyoto: '京都', 'Fukuoka (Hakata)': '福岡（博多）', Yufuin: '由布院', 'Ito (Izu)': '伊東（伊豆）', Shinjuku: '新宿', Hakone: '箱根', Asakusa: '浅草', Nikko: '日光', Nagoya: '名古屋', Takayama: '高山' } };
  function city(n) {
    var m = CITY_LOC[lang()]; if (m && m[n]) return m[n];
    for (var k in displayBySlug) if (displayBySlug[k] === n) return labelOf(k);
    return n;
  }
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
      if (e.target.closest('.scenic-guide')) return;
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
      '<div class="sf-name">' + esc(scName(s)) + '</div>' +
      '<div class="sf-route">' + esc(city(s.a)) + ' → ' + esc(city(s.b)) + (d ? ' · ' + esc(ht('from')) + ' ' + fmtMin(d.m) : '') + '</div>' +
      '<div class="sf-desc">' + esc(s.desc[lang()] || s.desc.en) + '</div>' +
      '<button type="button" class="sf-btn">' + esc(ht('book')) + ' →</button>' + jpGuide(s, 'scenic-guide') + '</div>';
    Array.prototype.forEach.call(jpEls.grid ? jpEls.grid.children : [], function (w, idx) { w.classList.toggle('scenic-active', idx === i); });
  }
  function scName(sc) { return typeof sc.name === 'object' ? (sc.name[lang()] || sc.name.en) : sc.name; }
  function jpGuide(sc, cls) {
    var l = lang(), pre = { es: 'es/', fr: 'fr/', it: 'it/', ja: 'ja/' }[l] || '';
    if (l === 'zh') pre = ZH_PAGES.indexOf(' ' + (SLUG_FIX[sc.from] || sc.from) + '-' + (SLUG_FIX[sc.to] || sc.to) + ' ') > -1 ? 'zh/' : '';
    var gs = (SLUG_FIX[sc.from] || sc.from) + '-' + (SLUG_FIX[sc.to] || sc.to);
    if (JP_GUIDES.indexOf(' ' + gs + ' ') === -1) return '';
    var label = { en: 'See guide', es: 'Ver guía', fr: 'Voir le guide', it: 'Vedi la guida', ja: 'ガイドを見る', de: 'Zum Guide', pt: 'Ver guia', zh: '查看指南' }[l] || 'See guide';
    return '<a class="' + cls + '" href="/rutas/' + gs + '/' + pre + '">' + esc(label) + ' →</a>';
  }
  function renderJpScenic() {
    if (!jpEls.grid) return;
    jpEls.grid.innerHTML = JP_SCENIC.map(function (s, i) {
      var d = legInfo(s.from, s.to);
      return '<div class="scenic-wrapper' + (i === jpFeatured ? ' scenic-active' : '') + '" data-i="' + i + '">' +
        '<div class="scenic-card" role="button" tabindex="0"><div class="scenic-photo" style="background-image:url(\'' + s.photo + '\')"><span class="scenic-dur">' + (d ? fmtMin(d.m) : '') + '</span></div>' +
        '<div class="scenic-body"><div class="scenic-name">' + esc(scName(s)) + '</div><div class="scenic-route">' + esc(city(s.a)) + ' → ' + esc(city(s.b)) + '</div></div>' +
        '<div class="scenic-actions"><div class="scenic-cta">' + esc(ht('book')) + '</div>' + jpGuide(s, 'scenic-guide') + '</div></div>' +
        '<div class="scenic-desc">' + esc(s.desc[lang()] || s.desc.en) + '</div></div>';
    }).join('');
    featureJp(jpFeatured);
    requestAnimationFrame(positionJpDescs);
  }
  function positionJpDescs() {
    var g = jpEls.grid;
    if (!g || region === 'europe') return;
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
        '<span class="wt-route-go">' + esc({ en: 'View itinerary', es: 'Ver itinerario', fr: 'Voir l’itinéraire', it: 'Vedi itinerario', de: 'Reiseplan ansehen', pt: 'Ver itinerário', ja: '旅程を見る', zh: '查看行程' }[lang()] || 'View itinerary') + '</span></button>';
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
      var chip = next ? [d && d.t.length ? d.t.slice(0, 2).join(', ') : '', d ? fmtMin(d.m) : ''].filter(Boolean).join(' · ') : ht('arrival');
      return '<li class="wt-stop" style="animation-delay:' + (i * 0.12) + 's">' +
        '<span class="wt-stop-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="13" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="M8 19l-2 3"/><path d="M18 22l-2-3"/><circle cx="7.5" cy="14.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="16.5" cy="14.5" r="1.4" fill="currentColor" stroke="none"/></svg></span>' +
        '<p class="wt-stop-station">' + esc(labelOf(s)) + '</p>' +
        '<span class="wt-stop-train">' + (next ? '&#8594; ' : '') + esc(chip) + (d && d.s ? ' · ' + esc(hsName()) : '') + (next ? ' · ' + esc(tx.direct) : '') + '</span>' +
        (next ? '<button type="button" class="wt-stop-buy" data-a="' + s + '" data-b="' + next + '">' + esc(ht('buy')) + ' →</button>' : '') +
        '</li>';
    }).join('');
    paintRouteButtons();
  }
  function paintHome() {
    if (region === 'europe') return;
    setupHome();
    if (jpEls.badge) jpEls.badge.textContent = ht('badge');
    if (jpEls.label) jpEls.label.textContent = ht('label');
    if (jpEls.lead) jpEls.lead.textContent = ht('lead');
    if (jpEls.essTitle) jpEls.essTitle.textContent = ht('ess');
    if (essEsim) essEsim.textContent = region === 'china' ? (CN_ESIM[lang()] || CN_ESIM.en) : essEsimJp;
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
  var HOTEL_BTN = {
    en: { kl: 'Search on Klook', bk: 'Search on Booking' }, es: { kl: 'Buscar en Klook', bk: 'Buscar en Booking' },
    fr: { kl: 'Chercher sur Klook', bk: 'Chercher sur Booking' }, it: { kl: 'Cerca su Klook', bk: 'Cerca su Booking' },
    de: { kl: 'Auf Klook suchen', bk: 'Auf Booking suchen' }, pt: { kl: 'Buscar no Klook', bk: 'Buscar no Booking' },
    ja: { kl: 'Klookで探す', bk: 'Bookingで探す' }
  };
  // Oferta de Booking (comunicado de Travelpayouts, 5-oct-2026): al menos 15 % en alojamientos participantes; reservas hasta el 7-ene-2027
  var BK_DEAL = {
    en: { tag: 'Booking.com deal', t: 'Last-minute deals: at least 15% off on participating stays. Book by 7 Jan 2027.', go: 'See deals' },
    es: { tag: 'Oferta Booking', t: 'Ofertas de última hora: al menos un 15 % de descuento en alojamientos participantes. Reserva hasta el 7 de enero de 2027.', go: 'Ver ofertas' },
    fr: { tag: 'Offre Booking', t: 'Offres de dernière minute : au moins 15 % de réduction dans les hébergements participants. Réservez jusqu\'au 7 janvier 2027.', go: 'Voir les offres' },
    it: { tag: 'Offerta Booking', t: 'Offerte last minute: almeno il 15 % di sconto nelle strutture aderenti. Prenota entro il 7 gennaio 2027.', go: 'Vedi le offerte' },
    de: { tag: 'Booking-Angebot', t: 'Last-Minute-Angebote: mindestens 15 % Rabatt bei teilnehmenden Unterkünften. Buchbar bis 7. Januar 2027.', go: 'Angebote ansehen' },
    pt: { tag: 'Oferta Booking', t: 'Ofertas de última hora: pelo menos 15 % de desconto em alojamentos participantes. Reserve até 7 de janeiro de 2027.', go: 'Ver ofertas' },
    ja: { tag: 'Booking.com特典', t: '直前割：対象の宿泊施設で15%以上オフ。2027年1月7日までの予約が対象です。', go: '特典を見る' }
  };
  // destinos populares de hoteles en modo Japón (Klook solo cubre estas 12 ciudades japonesas)
  var HOTEL_POP_JP = ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Kanazawa', 'Nara', 'Hakone', 'Sapporo', 'Fukuoka', 'Nagoya', 'Kobe', 'Yokohama'];
  // destinos populares de hoteles en modo China (city_id de Klook verificados 14-nov-2026)
  var HOTEL_POP_CN = ['Beijing', 'Shanghai', 'Hong Kong', 'Xi’an', 'Chengdu', 'Guilin', 'Hangzhou', 'Guangzhou', 'Shenzhen', 'Suzhou', 'Chongqing', 'Nanjing'];
  var HOTEL_POP = ['Paris', 'Rome', 'London', 'Barcelona', 'Amsterdam', 'Vienna', 'Prague', 'Berlin', 'Zurich', 'Venice', 'Madrid', 'Florence', 'Budapest', 'Munich', 'Tokyo', 'Kyoto', 'Osaka', 'Lisbon', 'Porto', 'Oslo', 'Marseille', 'Nice', 'Geneva'];
  var HOTEL_NAMES = {"es": {"Basel": "Basilea", "Berlin": "Berlín", "Bern": "Berna", "Bruges": "Brujas", "Brussels": "Bruselas", "Cologne": "Colonia", "Copenhagen": "Copenhague", "Edinburgh": "Edimburgo", "Florence": "Florencia", "Geneva": "Ginebra", "Gothenburg": "Gotemburgo", "Hamburg": "Hamburgo", "Lisbon": "Lisboa", "Ljubljana": "Liubliana", "London": "Londres", "Lucerne": "Lucerna", "Malaga": "Málaga", "Marseille": "Marsella", "Milan": "Milán", "Monaco": "Mónaco", "Munich": "Múnich", "Naples": "Nápoles", "Nice": "Niza", "Paris": "París", "Porto": "Oporto", "Prague": "Praga", "Rome": "Roma", "Salzburg": "Salzburgo", "Seville": "Sevilla", "Stockholm": "Estocolmo", "Strasbourg": "Estrasburgo", "Turin": "Turín", "Venice": "Venecia", "Vienna": "Viena", "Zurich": "Zúrich", "Frankfurt": "Fráncfort", "Bordeaux": "Burdeos", "Mainz": "Maguncia", "Tokyo": "Tokio", "Kyoto": "Kioto", "Austria": "Austria", "Belgium": "Bélgica", "Czech Republic": "República Checa", "Denmark": "Dinamarca", "France": "Francia", "Germany": "Alemania", "Hungary": "Hungría", "Norway": "Noruega", "Portugal": "Portugal", "Slovenia": "Eslovenia", "Italy": "Italia", "Netherlands": "Países Bajos", "Spain": "España", "Sweden": "Suecia", "Switzerland": "Suiza", "United Kingdom": "Reino Unido", "Japan": "Japón"}, "fr": {"Barcelona": "Barcelone", "Basel": "Bâle", "Bern": "Berne", "Brussels": "Bruxelles", "Copenhagen": "Copenhague", "Edinburgh": "Édimbourg", "Geneva": "Genève", "Gothenburg": "Göteborg", "Hamburg": "Hambourg", "Lisbon": "Lisbonne", "London": "Londres", "Milan": "Milan", "Naples": "Naples", "Prague": "Prague", "Rome": "Rome", "Salzburg": "Salzbourg", "Seville": "Séville", "Siena": "Sienne", "Valencia": "Valence", "Venice": "Venise", "Vienna": "Vienne", "Zaragoza": "Saragosse", "Girona": "Gérone", "Frankfurt": "Francfort", "Lyon": "Lyon", "Munich": "Munich", "Paris": "Paris", "Mainz": "Mayence", "Monaco": "Monaco", "Austria": "Autriche", "Belgium": "Belgique", "Czech Republic": "République tchèque", "Denmark": "Danemark", "France": "France", "Germany": "Allemagne", "Hungary": "Hongrie", "Norway": "Norvège", "Portugal": "Portugal", "Slovenia": "Slovénie", "Italy": "Italie", "Netherlands": "Pays-Bas", "Spain": "Espagne", "Sweden": "Suède", "Switzerland": "Suisse", "United Kingdom": "Royaume-Uni", "Japan": "Japon"}, "it": {"Barcelona": "Barcellona", "Basel": "Basilea", "Berlin": "Berlino", "Bern": "Berna", "Stockholm": "Stoccolma", "Brussels": "Bruxelles", "Cologne": "Colonia", "Copenhagen": "Copenaghen", "Edinburgh": "Edimburgo", "Florence": "Firenze", "Geneva": "Ginevra", "Gothenburg": "Göteborg", "Hamburg": "Amburgo", "Lisbon": "Lisbona", "Ljubljana": "Lubiana", "London": "Londra", "Lucerne": "Lucerna", "Lyon": "Lione", "Marseille": "Marsiglia", "Milan": "Milano", "Munich": "Monaco di Baviera", "Naples": "Napoli", "Nice": "Nizza", "Paris": "Parigi", "Prague": "Praga", "Rome": "Roma", "Salzburg": "Salisburgo", "Seville": "Siviglia", "Strasbourg": "Strasburgo", "Turin": "Torino", "Venice": "Venezia", "Zurich": "Zurigo", "Zaragoza": "Saragozza", "Frankfurt": "Francoforte", "Bergen": "Bergen", "Mainz": "Magonza", "Austria": "Austria", "Belgium": "Belgio", "Czech Republic": "Repubblica Ceca", "Denmark": "Danimarca", "France": "Francia", "Germany": "Germania", "Hungary": "Ungheria", "Norway": "Norvegia", "Portugal": "Portogallo", "Slovenia": "Slovenia", "Italy": "Italia", "Monaco": "Monaco", "Netherlands": "Paesi Bassi", "Spain": "Spagna", "Sweden": "Svezia", "Switzerland": "Svizzera", "United Kingdom": "Regno Unito", "Japan": "Giappone"}, "ja": {"Amsterdam": "アムステルダム", "Barcelona": "バルセロナ", "Basel": "バーゼル", "Berlin": "ベルリン", "Bern": "ベルン", "Bordeaux": "ボルドー", "Brno": "ブルノ", "Bruges": "ブルージュ", "Brussels": "ブリュッセル", "Budapest": "ブダペスト", "Cambridge": "ケンブリッジ", "Cologne": "ケルン", "Copenhagen": "コペンハーゲン", "Dortmund": "ドルトムント", "Edinburgh": "エディンバラ", "Figueres": "フィゲラス", "Florence": "フィレンツェ", "Frankfurt": "フランクフルト", "Geneva": "ジュネーブ", "Girona": "ジローナ", "Graz": "グラーツ", "Hamburg": "ハンブルク", "Innsbruck": "インスブルック", "Interlaken": "インターラーケン", "Krems": "クレムス", "Lauterbrunnen": "ラウターブルンネン", "Liverpool": "リバプール", "Ljubljana": "リュブリャナ", "London": "ロンドン", "Lourdes": "ルルド", "Lucerne": "ルツェルン", "Lyon": "リヨン", "Madrid": "マドリード", "Malaga": "マラガ", "Manchester": "マンチェスター", "Marseille": "マルセイユ", "Milan": "ミラノ", "Miramas": "ミラマス", "Monaco": "モナコ", "Montreux": "モントルー", "Munich": "ミュンヘン", "Naples": "ナポリ", "Nice": "ニース", "Oxford": "オックスフォード", "Paris": "パリ", "Pisa": "ピサ", "Positano": "ポジターノ", "Prague": "プラハ", "Rome": "ローマ", "Salerno": "サレルノ", "Salzburg": "ザルツブルク", "Seville": "セビリア", "Siena": "シエナ", "Sorrento": "ソレント", "St. Moritz": "サンモリッツ", "Stockholm": "ストックホルム", "Strasbourg": "ストラスブール", "Tende": "タンド", "Toulouse": "トゥールーズ", "Turin": "トリノ", "Valencia": "バレンシア", "Venice": "ヴェネツィア", "Vienna": "ウィーン", "York": "ヨーク", "Zaragoza": "サラゴサ", "Zermatt": "ツェルマット", "Zurich": "チューリッヒ", "Mainz": "マインツ", "Bergen": "ベルゲン", "Oslo": "オスロ", "Trondheim": "トロンハイム", "Faro": "ファロ", "Lisbon": "リスボン", "Porto": "ポルト", "Fukuoka": "福岡", "Hakone": "箱根", "Hiroshima": "広島", "Kanazawa": "金沢", "Kobe": "神戸", "Kyoto": "京都", "Nagoya": "名古屋", "Nara": "奈良", "Osaka": "大阪", "Sapporo": "札幌", "Tokyo": "東京", "Yokohama": "横浜", "Gothenburg": "ヨーテボリ", "Jungfraujoch": "ユングフラウヨッホ", "Sargans": "ザルガンス", "Spiez": "シュピーツ", "Zweisimmen": "ツヴァイジンメン", "Austria": "オーストリア", "Belgium": "ベルギー", "Czech Republic": "チェコ", "Denmark": "デンマーク", "France": "フランス", "Germany": "ドイツ", "Hungary": "ハンガリー", "Norway": "ノルウェー", "Portugal": "ポルトガル", "Slovenia": "スロベニア", "Italy": "イタリア", "Netherlands": "オランダ", "Spain": "スペイン", "Sweden": "スウェーデン", "Switzerland": "スイス", "United Kingdom": "イギリス", "Japan": "日本"}, "de": {"Austria": "Österreich", "Belgium": "Belgien", "Czech Republic": "Tschechien", "Denmark": "Dänemark", "France": "Frankreich", "Germany": "Deutschland", "Hungary": "Ungarn", "Norway": "Norwegen", "Portugal": "Portugal", "Slovenia": "Slowenien", "Italy": "Italien", "Monaco": "Monaco", "Netherlands": "Niederlande", "Spain": "Spanien", "Sweden": "Schweden", "Switzerland": "Schweiz", "United Kingdom": "Vereinigtes Königreich", "Japan": "Japan"}, "pt": {"Austria": "Áustria", "Belgium": "Bélgica", "Czech Republic": "Tchéquia", "Denmark": "Dinamarca", "France": "França", "Germany": "Alemanha", "Hungary": "Hungria", "Norway": "Noruega", "Portugal": "Portugal", "Slovenia": "Eslovênia", "Italy": "Itália", "Monaco": "Mônaco", "Netherlands": "Países Baixos", "Spain": "Espanha", "Sweden": "Suécia", "Switzerland": "Suíça", "United Kingdom": "Reino Unido", "Japan": "Japão"}};
  function hname(lg, n) { var m = HOTEL_NAMES[lg]; return (m && m[n]) || n; }
  function hnorm(x) { return String(x).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); }
  function buildHotels() {
    var card = document.querySelector('.search-card'), src = document.getElementById('klookCityMenu');
    if (!card || !src || !src.children.length) return null;
    var panel = card.querySelector('[data-panel="hotels"]');
    if (panel) return panel;
    // Klook usa Poppins en su sitio: se carga solo al abrir Hoteles o Experiencias, para no pesar en la portada
    if (!document.getElementById('poppinsFont')) { var pl = document.createElement('link'); pl.id = 'poppinsFont'; pl.rel = 'stylesheet'; pl.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap'; document.head.appendChild(pl); }
    var u = HOTEL_UI[lang()] || HOTEL_UI.en;
    var cities = [];
    Array.prototype.forEach.call(src.querySelectorAll('.klook-city-item'), function (n) { cities.push(n.textContent.trim()); });
    var popEu = HOTEL_POP.filter(function (c) { return cities.indexOf(c) !== -1 && HOTEL_POP_JP.indexOf(c) === -1 && HOTEL_POP_CN.indexOf(c) === -1; });
    var popJp = HOTEL_POP_JP.filter(function (c) { return cities.indexOf(c) !== -1; });
    var popCn = HOTEL_POP_CN.filter(function (c) { return cities.indexOf(c) !== -1; });
    var isJp = function () { return region === 'japan'; };
    panel = document.createElement('div');
    panel.className = 'search-panel hotels-panel';
    panel.setAttribute('data-panel', 'hotels');
    panel.innerHTML = '<div class="hotels-bar"><label class="hotels-field"><span class="hotels-lab"></span><input type="text" class="hotels-input" autocomplete="off" /><div class="hotels-list" role="listbox"></div></label><label class="hotels-field hotels-date"><span class="hotels-lab hotels-ci-lab"></span><input type="date" class="hotels-ci" /></label><label class="hotels-field hotels-date"><span class="hotels-lab hotels-co-lab"></span><input type="date" class="hotels-co" /></label><button type="button" class="hotels-go hotels-go-kl"><span class="go-eu"></span><span class="go-jp"></span></button><button type="button" class="hotels-go hotels-go-bk"></button></div><a href="#" class="hotels-promo"><span class="hotels-promo-tag"></span><span class="hotels-promo-text"></span><span class="hotels-promo-go"></span></a><div class="hotels-pop"><span class="hotels-pop-lab"></span><div class="hotels-pop-row"></div></div>';
    var lab = panel.querySelector('.hotels-lab'), inp = panel.querySelector('.hotels-input'), list = panel.querySelector('.hotels-list'),
        go = panel.querySelector('.hotels-go-kl'), bk = panel.querySelector('.hotels-go-bk'), popLab = panel.querySelector('.hotels-pop-lab'), row = panel.querySelector('.hotels-pop-row');
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
    }); inp.placeholder = u.ph; var bt = HOTEL_BTN[lang()] || HOTEL_BTN.en; go.querySelector('.go-eu').textContent = bt.kl; go.querySelector('.go-jp').textContent = u.go; bk.textContent = bt.bk; popLab.textContent = u.pop;
    var promo = panel.querySelector('.hotels-promo'), pd = BK_DEAL[lang()] || BK_DEAL.en;
    if (new Date() > new Date('2027-01-08T00:00:00')) promo.hidden = true;   // la oferta termina el 7-ene-2027
    promo.querySelector('.hotels-promo-tag').textContent = pd.tag; promo.querySelector('.hotels-promo-text').textContent = pd.t; promo.querySelector('.hotels-promo-go').textContent = pd.go + ' →';
    promo.addEventListener('click', function (e) {
      e.preventDefault();
      var base = typeof PROXY_BASE === 'string' ? PROXY_BASE : 'https://voxa-production-dc15.up.railway.app/affiliate';
      window.open(base + '/booking-deals', '_blank');
      try { if (typeof gtag === 'function') gtag('event', 'ui_click', { source: 'hotels_booking_deal' }); } catch (er) {}
    });
    var chosen = '';
    function pick(c) { chosen = c; inp.value = hname(lang(), c); list.classList.remove('open'); }
    function matches() {
      var q = hnorm(inp.value);
      if (!q) return region === 'china' ? popCn : isJp() ? popJp : popEu;
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
    function submit(kind) {
      var m = matches();
      var exact = cities.filter(function (c) { return hnorm(c) === hnorm(inp.value) || hnorm(hname(lang(), c)) === hnorm(inp.value); })[0];
      var city = exact || m[0];
      if (!city || !inp.value.trim()) { inp.focus(); paintList(); return; }
      var d1 = ci.value && co.value && co.value > ci.value ? ci.value : '', d2 = d1 ? co.value : '';
      if (kind === 'bk') {
        var base = typeof PROXY_BASE === 'string' ? PROXY_BASE : 'https://voxa-production-dc15.up.railway.app/affiliate';
        window.open(base + '/booking-hotel?city=' + encodeURIComponent(city) + (d1 ? '&checkin=' + encodeURIComponent(d1) + '&checkout=' + encodeURIComponent(d2) : ''), '_blank');
        try { if (typeof gtag === 'function') gtag('event', 'ui_click', { source: 'hotels_booking', city: city }); } catch (e) {}
        return;
      }
      if (typeof window.goKlookHotelCity === 'function') window.goKlookHotelCity(city, d1, d2);
      try { if (typeof gtag === 'function') gtag('event', 'ui_click', { source: 'hotels_klook', city: city }); } catch (e) {}
    }
    inp.addEventListener('focus', paintList);
    inp.addEventListener('input', paintList);
    inp.addEventListener('blur', function () { setTimeout(function () { list.classList.remove('open'); }, 120); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); var first = list.querySelector('.hotels-opt'); if (list.classList.contains('open') && first && hnorm(inp.value) !== hnorm(first.textContent)) { var fc = cities.filter(function (c) { return hname(lang(), c) === first.textContent; })[0]; pick(fc || first.textContent); } else submit(); } });
    go.addEventListener('click', function () { submit('kl'); });
    bk.addEventListener('click', function () { submit('bk'); });
    popEu.concat(popJp, popCn).forEach(function (c) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'hotels-city ' + (popJp.indexOf(c) !== -1 ? 'hc-jp' : popCn.indexOf(c) !== -1 ? 'hc-cn' : 'hc-eu'); b.textContent = hname(lang(), c);
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
      et: '日本の鉄道ルートを探す', es: '日本全国196区間の時刻、所要時間、旅のヒント。' },
    zh: { t2: '日本篇。', gl: '乘火车游日本的实用指南：新干线、车票和通票。', gtag: '日本指南', gt: 'How to Travel Japan by Train: A First-Timer\'s Guide to the Shinkansen', gf: '/blog-japan-train-guide.html',
      f1: '一个独立、免费的平台，用来规划日本、欧洲和中国的火车旅行。无需账户，无需订阅：查看线路和行程时长，再通过认证合作伙伴预订。',
      f2: '我们把你连接到官方合作伙伴。日本使用 Klook：搜索线路，点击 Klook 按钮，在其安全平台完成预订。',
      fq: '我需要 JR Pass 吗？', fa: '很多时候不需要。2023 年涨价后，JR Pass 只在多次乘坐长途新干线的长行程中才划算。大多数旅行买单程票更便宜，决定前请两种都比较一下。',
      et: '探索日本火车线路', es: '日本各地 196 段火车行程的时刻、时长和实用建议。' }
  };
  var JP_PILLS = [['tokyo-kyoto', 'Tokyo', 'Kyoto'], ['tokyo-osaka', 'Tokyo', 'Osaka'], ['osaka-kyoto', 'Osaka', 'Kyoto'], ['osaka-hiroshima', 'Osaka', 'Hiroshima'], ['tokyo-nagoya', 'Tokyo', 'Nagoya'], ['shinjuku-hakone', 'Shinjuku', 'Hakone'], ['tokyo-kanazawa', 'Tokyo', 'Kanazawa'], ['osaka-fukuoka', 'Osaka', 'Fukuoka']];
  var JP_SHINJUKU = { ja: '新宿', es: 'Shinjuku', fr: 'Shinjuku', it: 'Shinjuku' };
  function twinHome(el, edit) {
    if (!el || el.getAttribute('data-jp-twin')) return null;
    var c = el.cloneNode(true);
    c.removeAttribute('id'); c.setAttribute('data-jp-twin', '1');
    c.querySelectorAll('[data-i18n]').forEach(function (n) { n.removeAttribute('data-i18n'); });
    c.removeAttribute('data-i18n');
    el.classList.add('eu-static'); c.classList.add('jp-static');
    el.parentNode.insertBefore(c, el.nextSibling);
    if (edit) edit(c);
    return c;
  }
  (function () {
    var L = JPH[lang()] || JPH.en, lg = lang();
    // Esenciales: el subtítulo y las tarjetas que no aplican a Japón
    // Booking y GetYourGuide también aplican a Japón: se dejan visibles para que la fila de partners de confianza no quede con una sola tarjeta
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
      gc.classList.add('jp-static');
      cards.forEach(function (c) { c.classList.add('eu-static'); });
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
      jr.classList.remove('eu-static'); jr.classList.add('jp-static');
      var lastTwin = document.querySelectorAll('#faq .faq-item.jp-static'); lastTwin = lastTwin[lastTwin.length - 1];
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

  // ── Descubramos juntos en modo China (14-nov-2026): 8 destinos chinos con guía de ruta ──────────────
  // [ruta, foto, { idioma: [región, lugar, tren, época/tiempo, texto] }]. Tiempos: Klook (consulta 13-nov-2026).
  var CN_DISCOVER = [
    ['shanghai-hangzhou', 'cn-hangzhou', {
      en: ['Zhejiang · Lakes & tea hills', 'Hangzhou', 'Shanghai → Hangzhou by high-speed train', 'From about 45 min · hundreds of trains a day', 'West Lake, its causeways and pagodas, and the Longjing tea villages in the hills around it — an easy day trip from Shanghai.'],
      es: ['Zhejiang · Lagos y colinas de té', 'Hangzhou', 'Shanghái → Hangzhou en tren de alta velocidad', 'Desde unos 45 min · cientos de trenes al día', 'El Lago del Oeste, sus diques y pagodas, y las aldeas de té Longjing en las colinas: una escapada fácil desde Shanghái.'],
      fr: ['Zhejiang · Lacs et collines de thé', 'Hangzhou', 'Shanghai → Hangzhou en train à grande vitesse', 'Dès 45 min environ · des centaines de trains par jour', 'Le lac de l’Ouest, ses digues et ses pagodes, et les villages de thé Longjing sur les collines : une escapade facile depuis Shanghai.'],
      it: ['Zhejiang · Laghi e colline del tè', 'Hangzhou', 'Shanghai → Hangzhou in treno ad alta velocità', 'Da circa 45 min · centinaia di treni al giorno', 'Il Lago dell’Ovest, i suoi argini e le pagode, e i villaggi del tè Longjing sulle colline: una gita facile da Shanghai.'],
      ja: ['浙江・湖と茶畑の丘', '杭州', '上海 → 杭州　高速鉄道', '最速約45分・1日数百本', '西湖の堤や塔、そして丘に広がる龍井茶の村。上海から気軽に日帰りできます。'],
      zh: ['浙江 · 湖光与茶山', '杭州', '上海 → 杭州　高铁', '最快约 45 分钟 · 每天几百班', '西湖的长堤和宝塔，还有周围山间的龙井茶村——从上海出发一日游很轻松。'] }],
    ['shanghai-suzhou', 'cn-suzhou', {
      en: ['Jiangsu · Gardens & canals', 'Suzhou', 'Shanghai → Suzhou by high-speed train', 'From about 21 min', 'Classical gardens and canal streets lined with old houses, close enough to Shanghai for half a day.'],
      es: ['Jiangsu · Jardines y canales', 'Suzhou', 'Shanghái → Suzhou en tren de alta velocidad', 'Desde unos 21 min', 'Jardines clásicos y calles junto a canales con casas antiguas, tan cerca de Shanghái que basta medio día.'],
      fr: ['Jiangsu · Jardins et canaux', 'Suzhou', 'Shanghai → Suzhou en train à grande vitesse', 'Dès 21 min environ', 'Jardins classiques et ruelles au bord des canaux bordées de vieilles maisons, assez proches de Shanghai pour une demi-journée.'],
      it: ['Jiangsu · Giardini e canali', 'Suzhou', 'Shanghai → Suzhou in treno ad alta velocità', 'Da circa 21 min', 'Giardini classici e vie lungo i canali con case antiche, così vicine a Shanghai che basta mezza giornata.'],
      ja: ['江蘇・庭園と運河', '蘇州', '上海 → 蘇州　高速鉄道', '最速約21分', '古典庭園と、古い家並みが続く運河沿いの路地。上海から半日でも訪ねられる近さです。'],
      zh: ['江苏 · 园林与水乡', '苏州', '上海 → 苏州　高铁', '最快约 21 分钟', '古典园林和临河的老街，离上海很近，半天就能逛一逛。'] }],
    ['hangzhou-huangshan', 'cn-huangshan', {
      en: ['Anhui · Granite peaks', 'Huangshan', 'Hangzhou → Huangshan North by high-speed train', 'From about 1 h 13 min · then a bus to the mountain', 'The Yellow Mountain: granite peaks, twisted pines and, on many mornings, a sea of cloud below the summits.'],
      es: ['Anhui · Picos de granito', 'Huangshan', 'Hangzhou → Huangshan North en tren de alta velocidad', 'Desde 1 h 13 min · luego autobús a la montaña', 'La Montaña Amarilla: picos de granito, pinos retorcidos y, muchas mañanas, un mar de nubes bajo las cumbres.'],
      fr: ['Anhui · Pics de granit', 'Huangshan', 'Hangzhou → Huangshan North en train à grande vitesse', 'Dès 1 h 13 · puis bus jusqu’à la montagne', 'La Montagne Jaune : pics de granit, pins tordus et, bien des matins, une mer de nuages sous les sommets.'],
      it: ['Anhui · Vette di granito', 'Huangshan', 'Hangzhou → Huangshan North in treno ad alta velocità', 'Da 1h13 · poi autobus fino alla montagna', 'La Montagna Gialla: vette di granito, pini contorti e, molte mattine, un mare di nuvole sotto le cime.'],
      ja: ['安徽・花崗岩の峰', '黄山', '杭州 → 黄山北　高速鉄道', '最速約1時間13分・山まではバス', '花崗岩の峰とねじれた松、そして朝には山頂の下に広がる雲海。'],
      zh: ['安徽 · 花岗岩奇峰', '黄山', '杭州 → 黄山北　高铁', '最快约 1 小时 13 分 · 再坐巴士上山', '花岗岩奇峰、虬曲的松树，很多清晨山顶下还会出现云海。'] }],
    ['guangzhou-guilin', 'cn-guilin', {
      en: ['Guangxi · Karst & rivers', 'Guilin · Li River', 'Guangzhou → Guilin by high-speed train', 'From about 2 h 04 min', 'Gateway to the karst peaks of the Li River; many travellers continue to Yangshuo by boat, bus or train.'],
      es: ['Guangxi · Karst y ríos', 'Guilin · río Li', 'Cantón → Guilin en tren de alta velocidad', 'Desde unas 2 h 04', 'La puerta a los picos kársticos del río Li; muchos viajeros siguen a Yangshuo en barco, autobús o tren.'],
      fr: ['Guangxi · Karst et rivières', 'Guilin · rivière Li', 'Canton → Guilin en train à grande vitesse', 'Dès 2 h 04 environ', 'La porte des pics karstiques de la rivière Li ; beaucoup de voyageurs continuent vers Yangshuo en bateau, bus ou train.'],
      it: ['Guangxi · Carsismo e fiumi', 'Guilin · fiume Li', 'Canton → Guilin in treno ad alta velocità', 'Da circa 2h04', 'La porta delle vette carsiche del fiume Li; molti proseguono verso Yangshuo in barca, autobus o treno.'],
      ja: ['広西・カルストと川', '桂林・漓江', '広州 → 桂林　高速鉄道', '最速約2時間4分', '漓江のカルストの峰々への玄関口。船やバス、列車で陽朔へ向かう人も多くいます。'],
      zh: ['广西 · 喀斯特山水', '桂林 · 漓江', '广州 → 桂林　高铁', '最快约 2 小时 4 分', '漓江喀斯特山峰的门户；很多游客会再坐船、巴士或火车去阳朔。'] }],
    ['beijing-xian', 'cn-xian', {
      en: ['Shaanxi · Ancient capital', 'Xi’an', 'Beijing → Xi’an by high-speed train', 'From about 4 h 10 min', 'The old city wall you can cycle on top of, and the Terracotta Army a separate trip east of the city.'],
      es: ['Shaanxi · Antigua capital', 'Xi’an', 'Pekín → Xi’an en tren de alta velocidad', 'Desde unas 4 h 10', 'La muralla antigua, que se puede recorrer en bici por arriba, y los Guerreros de Terracota en una excursión al este de la ciudad.'],
      fr: ['Shaanxi · Ancienne capitale', 'Xi’an', 'Pékin → Xi’an en train à grande vitesse', 'Dès 4 h 10 environ', 'Les vieux remparts, que l’on parcourt à vélo, et l’Armée de terre cuite dans une excursion à l’est de la ville.'],
      it: ['Shaanxi · Antica capitale', 'Xi’an', 'Pechino → Xi’an in treno ad alta velocità', 'Da circa 4h10', 'Le antiche mura, da percorrere in bici, e l’Esercito di terracotta con un’escursione a est della città.'],
      ja: ['陝西・古都', '西安', '北京 → 西安　高速鉄道', '最速約4時間10分', '上を自転車で走れる古い城壁と、市の東にある兵馬俑。'],
      zh: ['陕西 · 千年古都', '西安', '北京 → 西安　高铁', '最快约 4 小时 10 分', '可以在城墙上骑自行车，兵马俑则在城东，需要另外安排。'] }],
    ['chengdu-chongqing', 'cn-chongqing', {
      en: ['Chongqing · Mountain city', 'Chongqing', 'Chengdu → Chongqing by high-speed train', 'From about 1 h 06 min', 'A city built on hills where the Jialing meets the Yangtze, famous for its night views and hotpot.'],
      es: ['Chongqing · Ciudad de montaña', 'Chongqing', 'Chengdu → Chongqing en tren de alta velocidad', 'Desde 1 h 06', 'Una ciudad sobre colinas donde el Jialing se une al Yangtsé, famosa por sus vistas nocturnas y su olla caliente.'],
      fr: ['Chongqing · Ville-montagne', 'Chongqing', 'Chengdu → Chongqing en train à grande vitesse', 'Dès 1 h 06', 'Une ville bâtie sur des collines, au confluent du Jialing et du Yangtsé, célèbre pour ses vues nocturnes et sa fondue.'],
      it: ['Chongqing · Città di montagna', 'Chongqing', 'Chengdu → Chongqing in treno ad alta velocità', 'Da 1h06', 'Una città sulle colline dove il Jialing incontra lo Yangtze, famosa per le viste notturne e l’hotpot.'],
      ja: ['重慶・山の都市', '重慶', '成都 → 重慶　高速鉄道', '最速約1時間6分', '嘉陵江と長江が合流する丘の上の街。夜景と火鍋で知られます。'],
      zh: ['重庆 · 山城', '重庆', '成都 → 重庆　高铁', '最快约 1 小时 6 分', '建在山上的城市，嘉陵江在这里汇入长江，以夜景和火锅闻名。'] }],
    ['shenzhen-hong-kong', 'cn-hongkong', {
      en: ['Hong Kong · Harbour city', 'Hong Kong', 'Shenzhen → Hong Kong West Kowloon', 'From about 14 min · border checks in the station', 'Victoria Harbour, the Peak and ferries across the bay, a short high-speed ride from Shenzhen.'],
      es: ['Hong Kong · Ciudad puerto', 'Hong Kong', 'Shenzhen → Hong Kong West Kowloon', 'Desde unos 14 min · controles fronterizos en la estación', 'La bahía Victoria, el Peak y los ferris que la cruzan, a un tramo corto de alta velocidad desde Shenzhen.'],
      fr: ['Hong Kong · Ville portuaire', 'Hong Kong', 'Shenzhen → Hong Kong West Kowloon', 'Dès 14 min environ · contrôles frontaliers en gare', 'Le port Victoria, le Peak et les ferries qui traversent la baie, à un court trajet à grande vitesse de Shenzhen.'],
      it: ['Hong Kong · Città porto', 'Hong Kong', 'Shenzhen → Hong Kong West Kowloon', 'Da circa 14 min · controlli di frontiera in stazione', 'Il porto Victoria, il Peak e i traghetti nella baia, a un breve tragitto ad alta velocità da Shenzhen.'],
      ja: ['香港・港の街', '香港', '深圳 → 香港西九龍', '最速約14分・出入境審査は駅構内', 'ヴィクトリア・ハーバー、ピーク、湾を渡るフェリー。深圳から高速鉄道ですぐです。'],
      zh: ['香港 · 海港城市', '香港', '深圳 → 香港西九龙', '最快约 14 分钟 · 站内办理出入境', '维多利亚港、太平山顶和穿梭海湾的渡轮，从深圳坐高铁很快就到。'] }],
    ['beijing-shanghai', 'cn-beijing', {
      en: ['Beijing → Shanghai', 'Fuxing high-speed', 'China’s classic high-speed ride', 'From about 4 h 18 min', 'The busiest intercity line in China, linking the capital with its largest city at up to 350 km/h.'],
      es: ['Pekín → Shanghái', 'Fuxing de alta velocidad', 'El clásico de la alta velocidad china', 'Desde unas 4 h 18', 'La línea interurbana más concurrida de China: une la capital con su ciudad más grande a hasta 350 km/h.'],
      fr: ['Pékin → Shanghai', 'Fuxing à grande vitesse', 'Le grand classique de la grande vitesse chinoise', 'Dès 4 h 18 environ', 'La ligne interurbaine la plus fréquentée de Chine, entre la capitale et sa plus grande ville, jusqu’à 350 km/h.'],
      it: ['Pechino → Shanghai', 'Fuxing ad alta velocità', 'Il classico dell’alta velocità cinese', 'Da circa 4h18', 'La linea intercity più trafficata della Cina: collega la capitale con la città più grande fino a 350 km/h.'],
      ja: ['北京 → 上海', '復興号', '中国高速鉄道の定番', '最速約4時間18分', '中国でいちばん利用者の多い都市間路線。首都と最大都市を最高時速350kmで結びます。'],
      zh: ['北京 → 上海', '复兴号高铁', '中国高铁的经典线路', '最快约 4 小时 18 分', '中国最繁忙的城际线路，以最高 350 公里的时速连接首都和最大城市。'] }]
  ];
  var CN_DISC_LEAD = { en: 'Cities and landscapes of China that are best reached by high-speed train — lakes, gardens, mountains and harbours.', es: 'Ciudades y paisajes de China que se disfrutan mejor en tren de alta velocidad: lagos, jardines, montañas y puertos.', fr: 'Des villes et des paysages de Chine à rejoindre en train à grande vitesse : lacs, jardins, montagnes et ports.', it: 'Città e paesaggi della Cina da raggiungere in treno ad alta velocità: laghi, giardini, montagne e porti.', ja: '高速鉄道で行きたい中国の街と風景。湖、庭園、山、そして港。', zh: '最适合坐高铁去的中国城市和风景：湖泊、园林、名山和海港。' };
  JP_DISC_WATCH.zh = '查看指南 →'; JP_DISC_LEAD.zh = '最适合坐火车去的日本小镇和角落：温泉村、老街和山间铁路。';
  (function () {
    var grid = document.querySelector('#discover .discover-grid');
    if (!grid || grid.getAttribute('data-jp-twin')) return;
    var lg = lang(), key = CN_DISCOVER[0][2][lg] ? lg : 'en';
    var suf = { es: 'es/', fr: 'fr/', it: 'it/', ja: 'ja/', zh: 'zh/' }[lg] || '';
    var e = function (x) { return String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var lead = document.querySelector('[data-i18n="disc_lead"]');
    var lc = twinHome(lead, function (c) { c.textContent = CN_DISC_LEAD[key]; });
    if (lc) lc.classList.replace('jp-static', 'cn-static'), lc.classList.remove('eu-static');
    var gc = twinHome(grid, function (c) {
      c.classList.add('jp-discover-grid', 'cn-discover-grid');
      c.innerHTML = CN_DISCOVER.map(function (d) {
        var t = d[2][key];
        return '<a href="/rutas/' + d[0] + '/' + suf + '" class="discover-card is-featured" style="background-image:url(\'/scenic/' + d[1] + '.webp\')"><span class="discover-pin"></span>' +
          '<div class="discover-country">' + e(t[0]) + '</div><div class="discover-place">' + e(t[1]) + '</div><div class="discover-route">' + e(t[2]) + '</div>' +
          '<div class="discover-season">' + e(t[3]) + '</div><div class="discover-tip">' + e(t[4]) + '</div><span class="discover-watch">' + e(JP_DISC_WATCH[key] || JP_DISC_WATCH.en) + '</span></a>';
      }).join('');
    });
    if (gc) gc.classList.replace('jp-static', 'cn-static'), gc.classList.remove('eu-static');
  })();

  // ── Guías en modo China: la guía del blog de China en lugar de las tres europeas ──
  var CN_GUIDE = {
    en: ['China Guide', 'How to Travel China by Train: A First-Timer\'s Guide to High-Speed Rail', 'Practical advice for travelling China by train: high-speed trains, tickets, passports and stations.'],
    es: ['Guía de China', 'Cómo viajar por China en tren: guía de la alta velocidad para tu primer viaje', 'Consejos prácticos para viajar por China en tren: alta velocidad, billetes, pasaporte y estaciones.'],
    fr: ['Guide de la Chine', 'Voyager en Chine en train : guide de la grande vitesse pour un premier séjour', 'Conseils pratiques pour voyager en Chine en train : grande vitesse, billets, passeport et gares.'],
    it: ['Guida Cina', 'Come viaggiare in Cina in treno: guida all\'alta velocità per il primo viaggio', 'Consigli pratici per viaggiare in Cina in treno: alta velocità, biglietti, passaporto e stazioni.'],
    ja: ['中国ガイド', '中国を鉄道で旅する：はじめての高速鉄道ガイド', '中国を鉄道で旅するための実用ガイド：高速鉄道、きっぷ、パスポート、駅のこと。'],
    zh: ['中国指南', '坐火车游中国：第一次坐高铁就看这篇', '坐火车游中国的实用指南：高铁、车票、护照和车站。']
  };
  (function () {
    var lg = lang(), G = CN_GUIDE[lg] || CN_GUIDE.en, pre = { es: '/es/', fr: '/fr/', it: '/it/', ja: '/ja/', zh: '/zh/' }[lg] || '/';
    var gl = document.querySelector('[data-i18n="guides_lead"]');
    var lc = twinHome(gl, function (c) { c.textContent = G[2]; });
    if (lc) lc.classList.replace('jp-static', 'cn-static'), lc.classList.remove('eu-static');
    var first = document.querySelector('#guides .guide-card');
    if (!first) return;
    var gc = first.cloneNode(true);
    gc.removeAttribute('data-jp-twin');
    gc.querySelectorAll('[data-i18n]').forEach(function (n) { n.removeAttribute('data-i18n'); });
    gc.setAttribute('href', pre + 'blog-china-train-guide.html');
    var tg = gc.querySelector('.guide-tag'); if (tg) tg.textContent = G[0];
    var h3 = gc.querySelector('h3'); if (h3) h3.textContent = G[1];
    var im = gc.querySelector('.guide-photo'); if (im) im.setAttribute('src', '/scenic/cn-beijing.webp');
    gc.classList.remove('eu-static', 'jp-static'); gc.classList.add('cn-static');
    first.parentNode.insertBefore(gc, first);
  })();

  // ── Características en modo Japón (fase 3): textos que hablaban solo de Europa o de datos en vivo ──
  var JP_FEAT = {"en": {"lead": "No subscriptions, no paywalls. Just clear journey times and smart tools.", "f1t": "Journey times at a glance", "f1d": "The duration of the fastest direct service on each Japanese route, taken from Klook data.", "f2t": "Japan & Europe, one site", "f2d": "Shinkansen, limited expresses and local lines from Hokkaido to Kyushu — and Europe too — in a single interface.", "f3t": "Journey search", "f3d": "Find the fastest direct service between Japanese cities, with journey times and a link to book.", "f4d": "Design multi-city trips across Japan 100% free. No travel agent required."}, "es": {"lead": "Sin suscripciones ni muros de pago. Solo tiempos de viaje claros y herramientas inteligentes.", "f1t": "Tiempos de viaje de un vistazo", "f1d": "La duración del servicio directo más rápido de cada ruta japonesa, con datos de Klook.", "f2t": "Japón y Europa, un solo sitio", "f2d": "Shinkansen, expresos limitados y líneas locales de Hokkaido a Kyushu —y también Europa— en una sola interfaz.", "f3t": "Búsqueda de trayectos", "f3d": "Encuentra el servicio directo más rápido entre ciudades japonesas, con el tiempo de viaje y un enlace para reservar.", "f4d": "Diseña viajes por varias ciudades de Japón 100% gratis. Sin agente de viajes."}, "fr": {"lead": "Sans abonnement ni accès payant. Seulement des durées de trajet claires et des outils intelligents.", "f1t": "Les durées de trajet en un coup d’œil", "f1d": "La durée du service direct le plus rapide de chaque itinéraire japonais, d’après les données de Klook.", "f2t": "Japon et Europe, un seul site", "f2d": "Shinkansen, express limités et lignes locales de Hokkaido à Kyushu — et l’Europe aussi — dans une seule interface.", "f3t": "Recherche de trajets", "f3d": "Trouvez le service direct le plus rapide entre villes japonaises, avec la durée du trajet et un lien pour réserver.", "f4d": "Concevez des voyages multi-villes au Japon 100 % gratuitement. Sans agent de voyage."}, "it": {"lead": "Niente abbonamenti né paywall. Solo tempi di viaggio chiari e strumenti intelligenti.", "f1t": "Tempi di viaggio a colpo d’occhio", "f1d": "La durata del servizio diretto più rapido su ogni percorso giapponese, secondo i dati di Klook.", "f2t": "Giappone ed Europa, un solo sito", "f2d": "Shinkansen, limited express e linee locali da Hokkaido a Kyushu — e anche l’Europa — in un’unica interfaccia.", "f3t": "Ricerca dei tragitti", "f3d": "Trova il servizio diretto più rapido tra le città giapponesi, con il tempo di viaggio e un link per prenotare.", "f4d": "Progetta viaggi in più città del Giappone 100% gratis. Nessun agente di viaggio."}, "de": {"lead": "Keine Abos, keine Paywalls. Nur klare Fahrzeiten und smarte Tools.", "f1t": "Fahrzeiten auf einen Blick", "f1d": "Die Dauer der schnellsten Direktverbindung auf jeder Strecke in Japan, nach Klook-Daten.", "f2t": "Japan & Europa, eine Seite", "f2d": "Shinkansen, Limited Express und Lokalbahnen von Hokkaido bis Kyushu — und Europa — in einer Oberfläche.", "f3t": "Verbindungssuche", "f3d": "Finde die schnellste Direktverbindung zwischen japanischen Städten, mit Fahrzeit und Buchungslink.", "f4d": "Plane Reisen durch mehrere Städte Japans 100 % kostenlos. Kein Reisebüro nötig."}, "pt": {"lead": "Sem assinaturas nem acesso pago. Só tempos de viagem claros e ferramentas inteligentes.", "f1t": "Tempos de viagem num relance", "f1d": "A duração do serviço direto mais rápido de cada rota japonesa, com dados da Klook.", "f2t": "Japão e Europa, um só site", "f2d": "Shinkansen, expressos limitados e linhas locais de Hokkaido a Kyushu — e também a Europa — numa única interface.", "f3t": "Busca de trajetos", "f3d": "Encontre o serviço direto mais rápido entre cidades japonesas, com o tempo de viagem e um link para reservar.", "f4d": "Planeje viagens por várias cidades do Japão 100% grátis. Sem agente de viagens."}, "ja": {"lead": "登録も有料の壁もありません。わかりやすい所要時間と、便利な機能だけ。", "f1t": "所要時間がひと目でわかる", "f1d": "日本の各区間で、いちばん速い直通列車の所要時間をKlookのデータから表示します。", "f2t": "日本もヨーロッパも、ひとつのサイトで", "f2d": "北海道から九州まで、新幹線も特急もローカル線も。ヨーロッパも、ひとつの画面で。", "f3t": "区間検索", "f3d": "日本の都市どうしを結ぶ、いちばん速い直通列車を探せます。所要時間と予約へのリンク付き。", "f4d": "日本の複数都市をめぐる旅を、完全無料で計画できます。旅行会社は不要です。"}, "zh": {"lead":"没有订阅，没有付费墙。只有清楚的行程时长和好用的工具。","f1t":"行程时长一目了然","f1d":"根据 Klook 数据，显示每条日本线路最快直达列车的时长。","f2t":"日本和欧洲，一个网站","f2d":"从北海道到九州的新干线、特急和地方线路——还有欧洲——都在一个界面里。","f3t":"线路搜索","f3d":"查找日本城市之间最快的直达列车，附行程时长和预订链接。","f4d":"免费规划日本多城市行程，无需旅行社。"}};
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
  var JP_STATS = {"en": "Book trains across Japan with Klook: <strong>198 connections</strong> between <strong>105 stations</strong>, search already loaded — free, no signup.", "es": "Reserva trenes por todo Japón con Klook: <strong>198 conexiones</strong> entre <strong>105 estaciones</strong>, con la búsqueda ya cargada — gratis, sin registro.", "fr": "Réservez vos trains au Japon avec Klook : <strong>198 liaisons</strong> entre <strong>105 gares</strong>, recherche déjà remplie — gratuit, sans inscription.", "it": "Prenota i treni in tutto il Giappone con Klook: <strong>198 collegamenti</strong> tra <strong>105 stazioni</strong>, con la ricerca già compilata — gratis, senza registrazione.", "de": "Buche Züge in ganz Japan mit Klook: <strong>198 Verbindungen</strong> zwischen <strong>105 Bahnhöfen</strong>, Suche bereits ausgefüllt — kostenlos, ohne Anmeldung.", "pt": "Reserve comboios em todo o Japão com a Klook: <strong>198 ligações</strong> entre <strong>105 estações</strong>, com a pesquisa já preenchida — grátis, sem cadastro.", "ja": "Klookで日本全国の列車を予約：<strong>105駅</strong>・<strong>198区間</strong>は検索条件が入力済み。無料、登録不要。", "zh": "用 Klook 预订日本各地的火车：<strong>105 个车站</strong>之间的 <strong>198 条线路</strong>已填好搜索条件——免费，无需注册。"};
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
  var essEsim = null, essEsimJp = '';
  var CN_ESIM = { en: 'eSIM China', es: 'eSIM China', fr: 'eSIM Chine', it: 'eSIM Cina', de: 'eSIM China', pt: 'eSIM China', ja: '中国のeSIM', zh: '中国 eSIM' };
  var JP_ESS = {"en": ["eSIM Japan", "Tours & activities", "See activities →"], "es": ["eSIM Japón", "Tours y actividades", "Ver actividades →"], "fr": ["eSIM Japon", "Visites et activités", "Voir les activités →"], "it": ["eSIM Giappone", "Tour e attività", "Vedi le attività →"], "de": ["eSIM Japan", "Touren & Aktivitäten", "Aktivitäten ansehen →"], "pt": ["eSIM Japão", "Passeios e atividades", "Ver atividades →"], "ja": ["日本のeSIM", "ツアーとアクティビティ", "アクティビティを見る →"], "zh": ["日本 eSIM","旅游团与活动","查看活动 →"]};
  (function () {
    var E = JP_ESS[lang()] || JP_ESS.en;
    var yt = document.querySelector('.essentials-bar [data-i18n="p_yesim_title"]');
    // eSIM y tours valen para Japón y China: estas dos piezas se muestran en ambas regiones (jp-only) y cambian de texto
    essEsim = twinHome(yt, function (c) { c.textContent = E[0]; }); essEsimJp = E[0];
    if (essEsim) { essEsim.classList.replace('jp-static', 'jp-only'); yt.classList.replace('eu-static', 'eu-only'); }
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

  // ── Pestaña "Planificador IA": reinicia el buscador (limpia el texto, el resultado y el panel de hoteles) y vuelve al estado inicial ──
  (function () {
    document.addEventListener('click', function (e) {
      var tab = e.target.closest ? e.target.closest('.search-tab[data-tab="ai"]') : null;
      if (!tab) return;
      var hp = document.querySelector('[data-panel="hotels"]');
      document.body.classList.remove('hotels-mode');
      var chip = document.querySelector('.region-hotels'); if (chip) { chip.classList.remove('on'); chip.setAttribute('aria-pressed', 'false'); }
      if (hp) hp.classList.remove('on');
      document.querySelectorAll('.search-panel').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-panel') === 'ai'); });
      document.querySelectorAll('.search-tab').forEach(function (t) { var on = t === tab; t.classList.toggle('on', on); t.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      var err = document.getElementById('aiPlannerError'); if (err) err.remove();
      var note = document.querySelector('.ai-incomplete-note'); if (note) note.remove();
      try { if (typeof window.resetAIPlanner === 'function') window.resetAIPlanner(); } catch (er) {}
      var inp = document.getElementById('aiInput'); if (inp) inp.value = '';
      var aur = document.getElementById('aiInputAurora'); if (aur) aur.classList.remove('active');
      // respuesta visible al toque: pulso breve en la pestaña y el buscador vuelve a quedar a la vista
      tab.classList.remove('is-tapped'); void tab.offsetWidth; tab.classList.add('is-tapped');
      setTimeout(function () { tab.classList.remove('is-tapped'); }, 420);
      var shell = document.querySelector('.search-shell');
      if (shell) { var r = shell.getBoundingClientRect(); if (r.top < 60 || r.top > window.innerHeight * 0.6) shell.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      if (inp && window.matchMedia && !window.matchMedia('(pointer: coarse)').matches) setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (er) {} }, 250);
    }, true);
  })();

  // Franja de color de la alianza (Omio en Europa, Klook en Japón) detrás de las ventajas y los operadores:
  // sube un poco para quedar por detrás del planificador.
  (function () {
    var ben = document.querySelector('.search-benefits'), ext = document.querySelector('.search-extras');
    if (!ben || !ext || ben.parentNode !== ext.parentNode || ben.parentNode.classList.contains('trust-band')) return;
    var band = document.createElement('div'); band.className = 'trust-band';
    ben.parentNode.insertBefore(band, ben); band.appendChild(ben); band.appendChild(ext);
  })();

  // ══ Modo China (fase 4, 14-nov-2026): mismo motor Klook que Japón, con sus propios datos ══════════════
  // Rutas, duración del tren más rápido y trenes por día: búsqueda real en Klook (rails-35, Mainland China),
  // consultada el 13-nov-2026 (scripts/china-klook.json). La reserva va a /affiliate/klook-china-train.
  var CN_JA = { beijing: '北京', shanghai: '上海', hangzhou: '杭州', suzhou: '蘇州', nanjing: '南京', xian: '西安', tianjin: '天津', guangzhou: '広州', shenzhen: '深圳', hongkong: '香港', chengdu: '成都', chongqing: '重慶', guilin: '桂林', huangshan: '黄山', qingdao: '青島', harbin: 'ハルビン', luoyang: '洛陽', kunming: '昆明', dali: '大理', lijiang: '麗江', changsha: '長沙', zhangjiajie: '張家界', wuhan: '武漢', xiamen: '厦門', leshan: '楽山' };
  var CN_DATA = {
    cities: [
      { display: 'Beijing', slug: 'beijing', keywords: ['beijing', 'pekin', 'pekín', 'pékin', 'peking', 'pechino', 'pequim', '北京'] },
      { display: 'Shanghai', slug: 'shanghai', keywords: ['shanghai', 'shanghái', 'xangai', '上海'] },
      { display: 'Hangzhou', slug: 'hangzhou', keywords: ['hangzhou', '杭州'] },
      { display: 'Suzhou', slug: 'suzhou', keywords: ['suzhou', '苏州', '蘇州'] },
      { display: 'Nanjing', slug: 'nanjing', keywords: ['nanjing', 'nankin', 'nankín', 'nanchino', 'nanking', 'nanquim', '南京'] },
      { display: "Xi'an", slug: 'xian', keywords: ["xi'an", 'xian', 'xi an', '西安'] },
      { display: 'Tianjin', slug: 'tianjin', keywords: ['tianjin', 'tianjín', '天津'] },
      { display: 'Guangzhou', slug: 'guangzhou', keywords: ['guangzhou', 'canton', 'cantón', 'kanton', 'cantão', '广州', '広州'] },
      { display: 'Shenzhen', slug: 'shenzhen', keywords: ['shenzhen', '深圳'] },
      { display: 'Hong Kong', slug: 'hongkong', keywords: ['hong kong', 'hongkong', '香港'] },
      { display: 'Chengdu', slug: 'chengdu', keywords: ['chengdu', 'chengdú', '成都'] },
      { display: 'Chongqing', slug: 'chongqing', keywords: ['chongqing', 'chongquing', '重庆', '重慶'] },
      { display: 'Guilin', slug: 'guilin', keywords: ['guilin', '桂林'] },
      { display: 'Huangshan', slug: 'huangshan', keywords: ['huangshan', '黄山'] },
      { display: 'Qingdao', slug: 'qingdao', keywords: ['qingdao', '青岛', '青島'] },
      { display: 'Harbin', slug: 'harbin', keywords: ['harbin', '哈尔滨', 'ハルビン'] },
      { display: 'Luoyang', slug: 'luoyang', keywords: ['luoyang', '洛阳', '洛陽'] },
      { display: 'Kunming', slug: 'kunming', keywords: ['kunming', '昆明'] },
      { display: 'Dali', slug: 'dali', keywords: ['dali', '大理'] },
      { display: 'Lijiang', slug: 'lijiang', keywords: ['lijiang', '丽江', '麗江'] },
      { display: 'Changsha', slug: 'changsha', keywords: ['changsha', '长沙', '長沙'] },
      { display: 'Zhangjiajie', slug: 'zhangjiajie', keywords: ['zhangjiajie', '张家界', '張家界'] },
      { display: 'Wuhan', slug: 'wuhan', keywords: ['wuhan', '武汉', '武漢'] },
      { display: 'Xiamen', slug: 'xiamen', keywords: ['xiamen', 'amoy', '厦门', '厦門'] },
      { display: 'Leshan', slug: 'leshan', keywords: ['leshan', '乐山', '楽山'] }
    ],
    routes: [['beijing', 'shanghai'], ['shanghai', 'hangzhou'], ['shanghai', 'suzhou'], ['shanghai', 'nanjing'], ['beijing', 'xian'], ['beijing', 'tianjin'], ['guangzhou', 'shenzhen'], ['shenzhen', 'hongkong'], ['guangzhou', 'hongkong'], ['chengdu', 'chongqing'], ['xian', 'chengdu'], ['guangzhou', 'guilin'], ['hangzhou', 'huangshan'], ['beijing', 'hangzhou'], ['beijing', 'nanjing'], ['nanjing', 'hangzhou'], ['suzhou', 'hangzhou'], ['shanghai', 'huangshan'], ['beijing', 'qingdao'], ['beijing', 'harbin'], ['xian', 'luoyang'], ['kunming', 'dali'], ['kunming', 'lijiang'], ['changsha', 'zhangjiajie'], ['guangzhou', 'changsha'], ['shanghai', 'wuhan'], ['guangzhou', 'xiamen'], ['shenzhen', 'xiamen'], ['chengdu', 'leshan'], ['shenzhen', 'guilin'], ['beijing', 'wuhan'], ['hangzhou', 'xiamen'], ['wuhan', 'changsha']],
    // duración (min) del tren más rápido, alta velocidad, -, trenes en el día consultado
    info: 'beijing-shanghai,258,1,,45;shanghai-hangzhou,45,1,,357;shanghai-suzhou,21,1,,619;shanghai-nanjing,59,1,,323;beijing-xian,250,1,,26;beijing-tianjin,30,1,,317;guangzhou-shenzhen,29,1,,517;shenzhen-hongkong,14,1,,156;guangzhou-hongkong,47,1,,70;chengdu-chongqing,66,1,,144;xian-chengdu,185,1,,72;guangzhou-guilin,124,1,,69;hangzhou-huangshan,73,1,,55;beijing-hangzhou,257,1,,25;beijing-nanjing,194,1,,66;nanjing-hangzhou,61,1,,110;suzhou-hangzhou,61,1,,102;shanghai-huangshan,119,1,,63;beijing-qingdao,187,1,,23;beijing-harbin,273,1,,20;xian-luoyang,75,1,,102;kunming-dali,115,1,,92;kunming-lijiang,209,1,,12;changsha-zhangjiajie,105,1,,41;guangzhou-changsha,117,1,,154;shanghai-wuhan,212,1,,50;guangzhou-xiamen,181,1,,31;shenzhen-xiamen,157,1,,55;chengdu-leshan,64,1,,8;shenzhen-guilin,159,1,,14;beijing-wuhan,228,1,,42;hangzhou-xiamen,255,1,,43;wuhan-changsha,71,1,,137',
    groups: [
      { id: 'north', names: { en: 'Beijing & the north', es: 'Pekín y el norte', fr: 'Pékin et le nord', it: 'Pechino e il nord', de: 'Peking & der Norden', pt: 'Pequim e o norte', ja: '北京・華北' },
        pairs: [['beijing', 'shanghai'], ['beijing', 'xian'], ['beijing', 'tianjin'], ['beijing', 'hangzhou'], ['beijing', 'nanjing'], ['beijing', 'qingdao'], ['beijing', 'harbin']] },
      { id: 'east', names: { en: 'Shanghai & Yangtze Delta', es: 'Shanghái y el delta del Yangtsé', fr: 'Shanghai et delta du Yangtsé', it: 'Shanghai e delta dello Yangtze', de: 'Shanghai & Jangtse-Delta', pt: 'Xangai e delta do Yangtzé', ja: '上海・長江デルタ' },
        pairs: [['shanghai', 'hangzhou'], ['shanghai', 'suzhou'], ['shanghai', 'nanjing'], ['hangzhou', 'huangshan'], ['shanghai', 'huangshan'], ['nanjing', 'hangzhou'], ['suzhou', 'hangzhou']] },
      { id: 'south', names: { en: 'South China & Hong Kong', es: 'Sur de China y Hong Kong', fr: 'Chine du Sud et Hong Kong', it: 'Cina meridionale e Hong Kong', de: 'Südchina & Hongkong', pt: 'Sul da China e Hong Kong', ja: '華南・香港' },
        pairs: [['guangzhou', 'shenzhen'], ['shenzhen', 'hongkong'], ['guangzhou', 'hongkong'], ['guangzhou', 'guilin'], ['shenzhen', 'guilin'], ['guangzhou', 'xiamen'], ['shenzhen', 'xiamen'], ['hangzhou', 'xiamen']] },
      { id: 'west', names: { en: 'Western China', es: 'Oeste de China', fr: 'Ouest de la Chine', it: 'Cina occidentale', de: 'Westchina', pt: 'Oeste da China', ja: '中国西部' },
        pairs: [['beijing', 'xian'], ['xian', 'chengdu'], ['chengdu', 'chongqing'], ['chengdu', 'leshan'], ['xian', 'luoyang'], ['kunming', 'dali'], ['kunming', 'lijiang']] },
      { id: 'central', names: { en: 'Central China', es: 'Centro de China', fr: 'Chine centrale', it: 'Cina centrale', de: 'Zentralchina', pt: 'China central', ja: '華中', zh: '华中' },
        pairs: [['beijing', 'wuhan'], ['shanghai', 'wuhan'], ['wuhan', 'changsha'], ['guangzhou', 'changsha'], ['changsha', 'zhangjiajie']] }
    ],
    quick: [['beijing', 'shanghai'], ['shanghai', 'hangzhou'], ['guangzhou', 'shenzhen'], ['shenzhen', 'hongkong'], ['beijing', 'xian']],
    valLoc: {
      es: { beijing: 'Pekín', shanghai: 'Shanghái', guangzhou: 'Cantón', nanjing: 'Nankín' },
      fr: { beijing: 'Pékin', guangzhou: 'Canton', nanjing: 'Nankin' },
      it: { beijing: 'Pechino', guangzhou: 'Canton', nanjing: 'Nanchino' },
      de: { beijing: 'Peking', guangzhou: 'Kanton', nanjing: 'Nanking' },
      pt: { beijing: 'Pequim', shanghai: 'Xangai', guangzhou: 'Cantão', nanjing: 'Nanquim' },
      ja: CN_JA
    },
    scenic: [
      { name: { en: 'Fuxing high-speed', es: 'Fuxing de alta velocidad', fr: 'Fuxing à grande vitesse', it: 'Fuxing ad alta velocità', de: 'Fuxing-Schnellzug', pt: 'Fuxing de alta velocidade', ja: '復興号' }, from: 'beijing', to: 'shanghai', a: 'Beijing', b: 'Shanghai', photo: '/scenic/cn-beijing.webp',
        desc: { en: 'Fuxing trains link China’s two great cities at up to 350 km/h, in a little over four hours.', es: 'Los trenes Fuxing unen las dos grandes ciudades de China a hasta 350 km/h, en algo más de cuatro horas.', fr: 'Les trains Fuxing relient les deux grandes villes de Chine jusqu’à 350 km/h, en un peu plus de quatre heures.', it: 'I treni Fuxing collegano le due grandi città della Cina fino a 350 km/h, in poco più di quattro ore.', de: 'Fuxing-Züge verbinden Chinas zwei große Städte mit bis zu 350 km/h in gut vier Stunden.', pt: 'Os comboios Fuxing ligam as duas grandes cidades da China a até 350 km/h, em pouco mais de quatro horas.', ja: '復興号が中国の二大都市を最高時速350kmで結びます。所要は4時間余り。' } },
      { name: { en: 'To West Lake', es: 'Hacia el Lago del Oeste', fr: 'Vers le lac de l’Ouest', it: 'Verso il Lago dell’Ovest', de: 'Zum Westsee', pt: 'Rumo ao Lago do Oeste', ja: '西湖へ' }, from: 'shanghai', to: 'hangzhou', a: 'Shanghai', b: 'Hangzhou', photo: '/scenic/cn-hangzhou.webp',
        desc: { en: 'Under an hour from Shanghai to Hangzhou and its West Lake, with hundreds of trains a day.', es: 'Menos de una hora de Shanghái a Hangzhou y su Lago del Oeste, con cientos de trenes al día.', fr: 'Moins d’une heure de Shanghai à Hangzhou et son lac de l’Ouest, avec des centaines de trains par jour.', it: 'Meno di un’ora da Shanghai a Hangzhou e al suo Lago dell’Ovest, con centinaia di treni al giorno.', de: 'Unter einer Stunde von Shanghai nach Hangzhou und zum Westsee, mit Hunderten Zügen am Tag.', pt: 'Menos de uma hora de Xangai a Hangzhou e ao seu Lago do Oeste, com centenas de comboios por dia.', ja: '上海から杭州と西湖まで1時間足らず。1日に数百本の列車が走ります。' } },
      { name: { en: 'Yellow Mountain line', es: 'Línea de la Montaña Amarilla', fr: 'Ligne de la Montagne Jaune', it: 'Linea della Montagna Gialla', de: 'Strecke zum Gelben Berg', pt: 'Linha da Montanha Amarela', ja: '黄山への路線' }, from: 'hangzhou', to: 'huangshan', a: 'Hangzhou', b: 'Huangshan', photo: '/scenic/cn-huangshan.webp',
        desc: { en: 'The high-speed line to the Yellow Mountain, with its granite peaks and pines, in just over an hour.', es: 'La línea de alta velocidad a la Montaña Amarilla, con sus picos de granito y pinos, en algo más de una hora.', fr: 'La ligne à grande vitesse vers la Montagne Jaune, ses pics de granit et ses pins, en un peu plus d’une heure.', it: 'La linea ad alta velocità verso la Montagna Gialla, con le sue vette di granito e i pini, in poco più di un’ora.', de: 'Die Schnellfahrstrecke zum Gelben Berg mit Granitgipfeln und Kiefern, in gut einer Stunde.', pt: 'A linha de alta velocidade até à Montanha Amarela, com os seus picos de granito e pinheiros, em pouco mais de uma hora.', ja: '花崗岩の峰と松で知られる黄山へ、高速鉄道で1時間ほど。' } },
      { name: { en: 'Into karst country', es: 'Hacia el país del karst', fr: 'Au pays du karst', it: 'Nella terra del carsismo', de: 'Ins Karstland', pt: 'Rumo à terra do carste', ja: 'カルストの郷へ' }, from: 'guangzhou', to: 'guilin', a: 'Guangzhou', b: 'Guilin', photo: '/scenic/cn-guilin.webp',
        desc: { en: 'High-speed line from Guangzhou to Guilin, gateway to the karst peaks of the Li River.', es: 'Línea de alta velocidad de Cantón a Guilin, puerta a los picos kársticos del río Li.', fr: 'Ligne à grande vitesse de Canton à Guilin, porte des pics karstiques de la rivière Li.', it: 'Linea ad alta velocità da Canton a Guilin, porta delle vette carsiche del fiume Li.', de: 'Schnellfahrstrecke von Kanton nach Guilin, Tor zu den Karstbergen am Li-Fluss.', pt: 'Linha de alta velocidade de Cantão a Guilin, porta para os picos cársticos do rio Li.', ja: '広州から桂林へ。漓江のカルスト地形への入口となる高速鉄道です。' } },
      { name: { en: 'Hong Kong XRL', es: 'Hong Kong XRL', fr: 'Hong Kong XRL', it: 'Hong Kong XRL', de: 'Hong Kong XRL', pt: 'Hong Kong XRL', ja: '広深港高速鉄道' }, from: 'shenzhen', to: 'hongkong', a: 'Shenzhen', b: 'Hong Kong', photo: '/scenic/cn-hongkong.webp',
        desc: { en: 'In about 15 minutes from Shenzhen to West Kowloon station, in the heart of Hong Kong.', es: 'En unos 15 minutos de Shenzhen a la estación de West Kowloon, en pleno Hong Kong.', fr: 'En une quinzaine de minutes de Shenzhen à la gare de West Kowloon, au cœur de Hong Kong.', it: 'In circa 15 minuti da Shenzhen alla stazione di West Kowloon, nel cuore di Hong Kong.', de: 'In rund 15 Minuten von Shenzhen zum Bahnhof West Kowloon mitten in Hongkong.', pt: 'Em cerca de 15 minutos de Shenzhen à estação de West Kowloon, no coração de Hong Kong.', ja: '深圳から香港中心部の西九龍駅まで約15分。' } },
      { name: { en: 'Sichuan to Chongqing', es: 'De Sichuan a Chongqing', fr: 'Du Sichuan à Chongqing', it: 'Dal Sichuan a Chongqing', de: 'Von Sichuan nach Chongqing', pt: 'De Sichuan a Chongqing', ja: '成渝高速鉄道' }, from: 'chengdu', to: 'chongqing', a: 'Chengdu', b: 'Chongqing', photo: '/scenic/cn-chongqing.webp',
        desc: { en: 'About an hour between Sichuan’s capital and Chongqing, the mountain city on the Yangtze.', es: 'Alrededor de una hora entre la capital de Sichuan y Chongqing, la ciudad de montaña a orillas del Yangtsé.', fr: 'Environ une heure entre la capitale du Sichuan et Chongqing, la ville-montagne au bord du Yangtsé.', it: 'Circa un’ora tra la capitale del Sichuan e Chongqing, la città di montagna sullo Yangtze.', de: 'Rund eine Stunde zwischen Sichuans Hauptstadt und Chongqing, der Bergstadt am Jangtse.', pt: 'Cerca de uma hora entre a capital de Sichuan e Chongqing, a cidade das montanhas junto ao Yangtzé.', ja: '四川省の省都・成都と、長江沿いの山の街・重慶を約1時間で。' } }
    ],
    adventures: {
      'cn-classic': { stops: ['beijing', 'xian', 'chengdu', 'chongqing'],
        title: { en: 'Imperial China & Sichuan', es: 'China imperial y Sichuan', fr: 'Chine impériale et Sichuan', it: 'Cina imperiale e Sichuan', de: 'Kaiserliches China & Sichuan', pt: 'China imperial e Sichuan', ja: '古都と四川のルート' },
        meta: { en: 'Terracotta Army in Xi’an · pandas in Chengdu', es: 'Guerreros de terracota en Xi’an · pandas en Chengdu', fr: 'Armée de terre cuite à Xi’an · pandas à Chengdu', it: 'Esercito di terracotta a Xi’an · panda a Chengdu', de: 'Terrakotta-Armee in Xi’an · Pandas in Chengdu', pt: 'Guerreiros de terracota em Xi’an · pandas em Chengdu', ja: '西安の兵馬俑・成都のパンダ' } },
      'cn-east': { stops: ['beijing', 'shanghai', 'hangzhou', 'huangshan'],
        title: { en: 'Beijing to the Yellow Mountain', es: 'De Pekín a la Montaña Amarilla', fr: 'De Pékin à la Montagne Jaune', it: 'Da Pechino alla Montagna Gialla', de: 'Von Peking zum Gelben Berg', pt: 'De Pequim à Montanha Amarela', ja: '北京から黄山へ' },
        meta: { en: 'High-speed rail · West Lake and Huangshan', es: 'Alta velocidad · Lago del Oeste y Huangshan', fr: 'Grande vitesse · lac de l’Ouest et Huangshan', it: 'Alta velocità · Lago dell’Ovest e Huangshan', de: 'Hochgeschwindigkeit · Westsee und Huangshan', pt: 'Alta velocidade · Lago do Oeste e Huangshan', ja: '高速鉄道・西湖と黄山' } },
      'cn-south': { stops: ['guilin', 'guangzhou', 'shenzhen', 'hongkong'],
        title: { en: 'Guilin to Hong Kong', es: 'De Guilin a Hong Kong', fr: 'De Guilin à Hong Kong', it: 'Da Guilin a Hong Kong', de: 'Von Guilin nach Hongkong', pt: 'De Guilin a Hong Kong', ja: '桂林から香港へ' },
        meta: { en: 'Karst peaks, Pearl River Delta and Hong Kong', es: 'Picos kársticos, delta del río Perla y Hong Kong', fr: 'Pics karstiques, delta de la rivière des Perles et Hong Kong', it: 'Vette carsiche, delta del Fiume delle Perle e Hong Kong', de: 'Karstberge, Perlflussdelta und Hongkong', pt: 'Picos cársticos, delta do rio das Pérolas e Hong Kong', ja: 'カルストの峰、珠江デルタ、香港' } }
    },
    adventureOrder: ['cn-classic', 'cn-east', 'cn-south'],
    operators: [['China Railway', 'www.12306.cn'], ['MTR', 'www.mtr.com.hk']]
  };
  var CN_TXT = {
    en: { ph: 'Train from Beijing to Shanghai', nopair: 'Pick one of the popular routes, or try another pair of Chinese cities.', ess: 'for China.', badge: 'AI rail planner for China', label: 'Iconic Chinese routes', lead: 'China’s great high-speed rail journeys — book directly from here.', hs: 'High-speed', perday: '{n} trains a day', note: 'Journey time of the fastest direct train and number of trains in a day, from Klook data (checked 13 Nov 2026). Seats and fares for your date are shown on Klook.' },
    es: { ph: 'Tren de Pekín a Shanghái', nopair: 'Elige una de las rutas populares o prueba otro par de ciudades chinas.', ess: 'para China.', badge: 'Planificador IA de trenes de China', label: 'Rutas icónicas de China', lead: 'Los grandes viajes en tren de alta velocidad de China, con reserva directa desde aquí.', hs: 'Alta velocidad', perday: '{n} trenes al día', note: 'Duración del tren directo más rápido y cantidad de trenes en un día, según datos de Klook (consulta del 13 de noviembre de 2026). Los asientos y tarifas de tu fecha se muestran en Klook.' },
    fr: { ph: 'Train de Pékin à Shanghai', nopair: 'Choisissez l’une des routes populaires ou essayez une autre paire de villes chinoises.', ess: 'pour la Chine.', badge: 'Planificateur IA de trains en Chine', label: 'Itinéraires emblématiques de Chine', lead: 'Les grands trajets à grande vitesse de Chine, à réserver directement ici.', hs: 'Grande vitesse', perday: '{n} trains par jour', note: 'Durée du train direct le plus rapide et nombre de trains sur une journée, d’après les données de Klook (consultation du 13 novembre 2026). Les places et tarifs de votre date s’affichent sur Klook.' },
    it: { ph: 'Treno da Pechino a Shanghai', nopair: 'Scegli uno dei percorsi popolari o prova un’altra coppia di città cinesi.', ess: 'per la Cina.', badge: 'Pianificatore IA di treni in Cina', label: 'Percorsi iconici della Cina', lead: 'I grandi viaggi in treno ad alta velocità della Cina, da prenotare direttamente qui.', hs: 'Alta velocità', perday: '{n} treni al giorno', note: 'Durata del treno diretto più veloce e numero di treni in un giorno, secondo i dati di Klook (consultazione del 13 novembre 2026). Posti e tariffe per la tua data sono su Klook.' },
    de: { ph: 'Zug von Peking nach Shanghai', nopair: 'Wähle eine der beliebten Strecken oder probiere ein anderes Städtepaar in China.', ess: 'für China.', badge: 'KI-Zugplaner für China', label: 'Ikonische Strecken in China', lead: 'Chinas große Hochgeschwindigkeitsreisen – direkt hier buchen.', hs: 'Hochgeschwindigkeit', perday: '{n} Züge am Tag', note: 'Fahrzeit des schnellsten Direktzugs und Zahl der Züge an einem Tag laut Klook-Daten (Stand 13. November 2026). Plätze und Preise für dein Datum siehst du bei Klook.' },
    pt: { ph: 'Comboio de Pequim a Xangai', nopair: 'Escolha uma das rotas populares ou tente outro par de cidades chinesas.', ess: 'para a China.', badge: 'Planejador IA de comboios na China', label: 'Rotas icónicas da China', lead: 'As grandes viagens de alta velocidade da China, reserve diretamente aqui.', hs: 'Alta velocidade', perday: '{n} comboios por dia', note: 'Duração do comboio direto mais rápido e número de comboios num dia, segundo dados da Klook (consulta de 13 de novembro de 2026). Lugares e tarifas para a tua data aparecem na Klook.' },
    ja: { ph: '例：北京から上海への列車', nopair: '人気の路線を選ぶか、別の中国の都市の組み合わせを試してください。', ess: '中国編。', badge: '中国の列車AIプランナー', label: '中国の名路線', lead: '中国の高速鉄道の旅。ここからそのまま予約できます。', hs: '高速鉄道', perday: '1日{n}本', note: 'Klookのデータによる、直通で最も速い列車の所要時間と1日の本数です（2026年11月13日確認）。ご希望日の座席と運賃はKlookでご確認ください。' }
  };
  function cx(k) { var m = CN_TXT[lang()] || CN_TXT.en; return m[k] != null ? m[k] : CN_TXT.en[k]; }
  function hsName() { return region === 'china' ? cx('hs') : (lang() === 'zh' ? '新干线' : 'Shinkansen'); }
  function parseInfo(str) {
    var out = {};
    str.split(';').forEach(function (row) {
      var p = row.split(',');
      var v = { m: +p[1], s: p[2] === '1', t: p[3] ? p[3].split('/') : [], n: p[4] ? +p[4] : 0 };
      var k = p[0].split('-');
      out[k[0] + '-' + k[1]] = v; out[k[1] + '-' + k[0]] = v;
    });
    return out;
  }
  // Datos de Japón tal como quedaron arriba, para volver a ellos al cambiar de China a Japón
  var JP_DATA = { cities: CITIES, routes: ROUTES, groups: GROUPS, quick: QUICK, valLoc: VAL_LOC, airports: AIRPORT_LOC, info: INFO, api: BOOK_API, scenic: JP_SCENIC, adventures: JP_ROUTES, adventureOrder: JP_ROUTE_ORDER, operators: OPERATORS, guides: JP_GUIDES };
  var CN_READY = { cities: CN_DATA.cities, routes: CN_DATA.routes, groups: CN_DATA.groups, quick: CN_DATA.quick, valLoc: CN_DATA.valLoc, airports: {}, info: parseInfo(CN_DATA.info),
    api: 'https://voxa-production-dc15.up.railway.app/affiliate/klook-china-train', scenic: CN_DATA.scenic, adventures: CN_DATA.adventures, adventureOrder: CN_DATA.adventureOrder, operators: CN_DATA.operators,
    guides: ' beijing-shanghai shanghai-hangzhou shanghai-suzhou shanghai-nanjing beijing-xian beijing-tianjin guangzhou-shenzhen shenzhen-hong-kong guangzhou-hong-kong chengdu-chongqing xian-chengdu guangzhou-guilin hangzhou-huangshan beijing-hangzhou beijing-nanjing nanjing-hangzhou suzhou-hangzhou shanghai-huangshan beijing-qingdao beijing-harbin xian-luoyang kunming-dali kunming-lijiang changsha-zhangjiajie guangzhou-changsha shanghai-wuhan guangzhou-xiamen shenzhen-xiamen chengdu-leshan shenzhen-guilin beijing-wuhan hangzhou-xiamen wuhan-changsha ' };
  var dataFor = null;
  function useData(r) {
    if (dataFor === r) return;
    var d = r === 'china' ? CN_READY : JP_DATA;
    dataFor = r;
    CITIES = d.cities; ROUTES = d.routes; GROUPS = d.groups; QUICK = d.quick; VAL_LOC = d.valLoc; AIRPORT_LOC = d.airports;
    INFO = d.info; BOOK_API = d.api; JP_SCENIC = d.scenic; JP_ROUTES = d.adventures; JP_ROUTE_ORDER = d.adventureOrder; JP_GUIDES = d.guides;
    japanPages = new Set();
    ROUTES.forEach(function (x) { japanPages.add(x[0] + '-' + x[1]); japanPages.add(x[1] + '-' + x[0]); });
    displayBySlug = {};
    CITIES.forEach(function (c) { displayBySlug[c.slug] = c.display; });
    kwIndex = null;
    jpFeatured = 0; jpRouteKey = null;
    if (jpEls.wrap) jpEls.wrap.hidden = true;
    // los operadores se pintan una vez al crear la portada: se vuelven a pintar con los de la región
    OPERATORS = d.operators;
    (jpEls.ops || []).forEach(function (el) {
      el.innerHTML = OPERATORS.map(function (o) { return '<span class="op-chip"><img src="https://www.google.com/s2/favicons?sz=64&amp;domain=' + o[1] + '" alt="' + o[0] + '" loading="lazy"/>' + o[0] + '</span>'; }).join('');
    });
  }
  // ══ Chino simplificado (fase 6, 14-nov-2026): textos del buscador y de los modos Japón y China ══════════
  var ZH_PAGES = ' beijing-shanghai shanghai-hangzhou shanghai-suzhou shanghai-nanjing beijing-xian beijing-tianjin guangzhou-shenzhen shenzhen-hong-kong guangzhou-hong-kong chengdu-chongqing xian-chengdu guangzhou-guilin hangzhou-huangshan beijing-hangzhou beijing-nanjing nanjing-hangzhou suzhou-hangzhou shanghai-huangshan beijing-qingdao beijing-harbin xian-luoyang kunming-dali kunming-lijiang changsha-zhangjiajie guangzhou-changsha shanghai-wuhan guangzhou-xiamen shenzhen-xiamen chengdu-leshan shenzhen-guilin beijing-wuhan hangzhou-xiamen wuhan-changsha tokyo-kyoto tokyo-osaka osaka-kyoto kyoto-hiroshima narita-tokyo tokyo-nagoya osaka-hiroshima shinjuku-hakone tokyo-kanazawa osaka-fukuoka hiroshima-fukuoka nagoya-takayama kansai-airport-kyoto kansai-airport-osaka tokyo-sendai ';
  INFO_I18N.zh = { from: '最快 {d}', direct: '直达' };
  BUY_KLOOK.zh = '查看时刻并在 Klook 预订 →';
  PI_JP.zh = { opts: '出行方式', train: '火车', note: '根据 Klook 数据（2026 年 10 月 5 日查询），这是最快直达列车的行程时长。你所选日期的座位和票价请在 Klook 查看。', guide: '查看完整线路指南' };
  HOME_I18N.zh = { ess: '日本篇。', badge: '日本火车 AI 规划', label: '日本经典线路', lead: '日本最美的火车之旅——可直接在这里预订。', featured: '推荐线路', book: '在 Klook 预订', buy: '查看时刻并在 Klook 预订', arrival: '到达', from: '最快' };
  HOTEL_UI.zh = { all: '全部城市', ci: '入住', co: '退房', ph: '城市或区域', lab: '去哪里？', pop: '热门目的地', go: '搜索酒店', none: '没有结果，请换个城市试试' };
  HOTEL_BTN.zh = { kl: '在 Klook 搜索', bk: '在 Booking 搜索' };
  BK_DEAL.zh = { tag: 'Booking.com 优惠', t: '临时出行优惠：参与活动的住宿至少 85 折。2027 年 1 月 7 日前预订。', go: '查看优惠' };
  PL_MSG.zh = { gen: '正在生成…', still: '仍在处理，可能需要几秒钟…', empty: '输入一个目的地或旅行想法即可开始。', conn: '无法连接，请重试。', slow: '比平时花的时间更长。请重试，或选择上方的热门线路。', rate: '你连续查询了好几次。请等一分钟再试。', inc: '无法包含：{x}。请把这一部分作为单独的行程来查询。' };
  CN_TXT.zh = { ph: '例如：从北京到上海的火车', nopair: '请选择一条热门线路，或换一组中国城市试试。', ess: '中国篇。', badge: '中国火车 AI 规划', label: '中国经典线路', lead: '中国的高铁之旅——可直接在这里预订。', hs: '高铁', perday: '每天 {n} 班', note: '根据 Klook 数据（2026 年 11 月 13 日查询），这是最快直达列车的时长和当天的车次数量。你所选日期的座位和票价请在 Klook 查看。' };
  // nombres de ciudad en chino (lo que se escribe en el buscador también se reconoce)
  CN_DATA.valLoc.zh = { beijing: '北京', shanghai: '上海', hangzhou: '杭州', suzhou: '苏州', nanjing: '南京', xian: '西安', tianjin: '天津', guangzhou: '广州', shenzhen: '深圳', hongkong: '香港', chengdu: '成都', chongqing: '重庆', guilin: '桂林', huangshan: '黄山', qingdao: '青岛', harbin: '哈尔滨', luoyang: '洛阳', kunming: '昆明', dali: '大理', lijiang: '丽江', changsha: '长沙', zhangjiajie: '张家界', wuhan: '武汉', xiamen: '厦门', leshan: '乐山' };
  var JP_ZH = { tokyo: '东京', kyoto: '京都', osaka: '大阪', nagoya: '名古屋', hiroshima: '广岛', fukuoka: '福冈', sapporo: '札幌', sendai: '仙台', kanazawa: '金泽', yokohama: '横滨', kobe: '神户', okayama: '冈山', himeji: '姬路', nara: '奈良', hakone: '箱根', nikko: '日光', takayama: '高山', matsumoto: '松本', nagano: '长野', toyama: '富山', kagoshima: '鹿儿岛', kumamoto: '熊本', beppu: '别府', yufuin: '由布院', hakodate: '函馆', otaru: '小樽', aomori: '青森', akita: '秋田', morioka: '盛冈', niigata: '新潟', shinjuku: '新宿', asakusa: '浅草', karuizawa: '轻井泽', kawaguchiko: '河口湖', atami: '热海', ito: '伊东', odawara: '小田原', kinosaki: '城崎', naritaairport: '成田机场', kansaiairport: '关西机场', newchitoseairport: '新千岁机场', shizuoka: '静冈', kokura: '小仓', nagasaki: '长崎' };
  VAL_LOC.zh = JP_ZH;
  AIRPORT_LOC.zh = { naritaairport: '成田机场', kansaiairport: '关西机场', newchitoseairport: '新千岁机场' };
  CITIES.forEach(function (c) { if (JP_ZH[c.slug] && c.keywords.indexOf(JP_ZH[c.slug]) === -1) c.keywords.push(JP_ZH[c.slug]); });
  CITY_LOC.zh = { Tokyo: '东京', Kyoto: '京都', 'Fukuoka (Hakata)': '福冈（博多）', Yufuin: '由布院', 'Ito (Izu)': '伊东（伊豆）', Shinjuku: '新宿', Hakone: '箱根', Asakusa: '浅草', Nikko: '日光', Nagoya: '名古屋', Takayama: '高山' };
  // grupos, panorámicos y aventuras
  var ZH_GROUPS = { shinkansen: '新干线', kanto: '东京和关东', kansai: '关西', chubu: '中部和北陆', west: '日本西部和九州', north: '东北和北海道' };
  GROUPS.forEach(function (g) { if (ZH_GROUPS[g.id]) g.names.zh = ZH_GROUPS[g.id]; });
  var ZH_CN_GROUPS = { north: '北京和华北', east: '上海和长三角', south: '华南和香港', west: '中国西部', central: '华中' };
  CN_DATA.groups.forEach(function (g) { g.names.zh = ZH_CN_GROUPS[g.id]; });
  var ZH_JP_SCENIC = ['JR 九州的设计列车，木质内饰，开往温泉小镇由布院。', 'JR 东日本的豪华列车，大窗面朝太平洋，开往伊豆半岛。', '小田急的特急列车，从新宿开往箱根——温泉和富士山美景的门户。', '东武的旗舰列车，从浅草开往日光的神社和群山。', '从名古屋沿飞驒溪谷一路爬升到高山的特急列车。', '“希望号”连接东京和京都；天气晴朗时能看到富士山。'];
  JP_SCENIC.forEach(function (sc, i) { if (ZH_JP_SCENIC[i]) sc.desc.zh = ZH_JP_SCENIC[i]; });
  var ZH_CN_SCENIC = [['复兴号高铁', '复兴号以最高 350 公里的时速连接中国两大城市，四个多小时就到。'], ['前往西湖', '从上海到杭州和西湖不到一小时，每天有几百班列车。'], ['黄山线', '高铁开往以花岗岩奇峰和松树闻名的黄山，一个多小时即可到达。'], ['走进喀斯特', '从广州到桂林的高铁，通往漓江喀斯特山峰的门户。'], ['香港高铁', '从深圳到香港中心的西九龙站，大约 15 分钟。'], ['从四川到重庆', '四川省会和长江边的山城重庆，大约一小时车程。']];
  CN_DATA.scenic.forEach(function (sc, i) { sc.name.zh = ZH_CN_SCENIC[i][0]; sc.desc.zh = ZH_CN_SCENIC[i][1]; });
  var ZH_ADV = { 'jp-tokaido': ['东海道经典线路', '新干线 · 从小田原去箱根'], 'jp-alps': ['日本阿尔卑斯线路', '飞驒特急和北陆新干线'], 'jp-kyushu': ['九州精华', '由布院之森、温泉和音速号特急'],
    'cn-classic': ['古都与四川', '西安兵马俑 · 成都大熊猫'], 'cn-east': ['从北京到黄山', '高铁 · 西湖和黄山'], 'cn-south': ['从桂林到香港', '喀斯特山峰、珠三角和香港'] };
  [JP_ROUTES, CN_DATA.adventures].forEach(function (set) { Object.keys(set).forEach(function (k) { if (ZH_ADV[k]) { set[k].title.zh = ZH_ADV[k][0]; set[k].meta.zh = ZH_ADV[k][1]; } }); });
  CN_ESIM.zh = '中国 eSIM';
  // nombres de las ciudades chinas (y de China) en el panel de hoteles y en los resultados
  (function () {
    var CN = { es: { Beijing: 'Pekín', Shanghai: 'Shanghái', Guangzhou: 'Cantón', Nanjing: 'Nankín', China: 'China' }, fr: { Beijing: 'Pékin', Guangzhou: 'Canton', Nanjing: 'Nankin', China: 'Chine' }, it: { Beijing: 'Pechino', Guangzhou: 'Canton', Nanjing: 'Nanchino', China: 'Cina' }, de: { Beijing: 'Peking', Guangzhou: 'Kanton', Nanjing: 'Nanking', 'Hong Kong': 'Hongkong', China: 'China' }, pt: { Beijing: 'Pequim', Shanghai: 'Xangai', Guangzhou: 'Cantão', Nanjing: 'Nanquim', China: 'China' },
      ja: { Beijing: '北京', Shanghai: '上海', Hangzhou: '杭州', Suzhou: '蘇州', Nanjing: '南京', 'Xi’an': '西安', Tianjin: '天津', Guangzhou: '広州', Shenzhen: '深圳', 'Hong Kong': '香港', Chengdu: '成都', Chongqing: '重慶', Guilin: '桂林', Huangshan: '黄山', Qingdao: '青島', Harbin: 'ハルビン', Luoyang: '洛陽', Kunming: '昆明', Dali: '大理', Lijiang: '麗江', Changsha: '長沙', Zhangjiajie: '張家界', Wuhan: '武漢', Xiamen: '厦門', Leshan: '楽山', China: '中国' },
      zh: { Beijing: '北京', Shanghai: '上海', Hangzhou: '杭州', Suzhou: '苏州', Nanjing: '南京', 'Xi’an': '西安', Tianjin: '天津', Guangzhou: '广州', Shenzhen: '深圳', 'Hong Kong': '香港', Chengdu: '成都', Chongqing: '重庆', Guilin: '桂林', Huangshan: '黄山', Qingdao: '青岛', Harbin: '哈尔滨', Luoyang: '洛阳', Kunming: '昆明', Dali: '大理', Lijiang: '丽江', Changsha: '长沙', Zhangjiajie: '张家界', Wuhan: '武汉', Xiamen: '厦门', Leshan: '乐山', China: '中国', Japan: '日本', Tokyo: '东京', Kyoto: '京都', Osaka: '大阪', Hiroshima: '广岛', Fukuoka: '福冈', Sapporo: '札幌', Nagoya: '名古屋', Kobe: '神户', Nara: '奈良', Hakone: '箱根', Kanazawa: '金泽', Yokohama: '横滨',
        Paris: '巴黎', London: '伦敦', Rome: '罗马', Barcelona: '巴塞罗那', Amsterdam: '阿姆斯特丹', Vienna: '维也纳', Prague: '布拉格', Berlin: '柏林', Zurich: '苏黎世', Venice: '威尼斯', Madrid: '马德里', Florence: '佛罗伦萨', Budapest: '布达佩斯', Munich: '慕尼黑', Lisbon: '里斯本', Porto: '波尔图', Milan: '米兰', Naples: '那不勒斯', Brussels: '布鲁塞尔', Geneva: '日内瓦', Lucerne: '琉森', Interlaken: '因特拉肯', Salzburg: '萨尔茨堡', Nice: '尼斯', Lyon: '里昂', Marseille: '马赛', Frankfurt: '法兰克福', Cologne: '科隆', Hamburg: '汉堡', Copenhagen: '哥本哈根', Stockholm: '斯德哥尔摩', Oslo: '奥斯陆', Edinburgh: '爱丁堡',
        Austria: '奥地利', Belgium: '比利时', 'Czech Republic': '捷克', Denmark: '丹麦', France: '法国', Germany: '德国', Hungary: '匈牙利', Norway: '挪威', Portugal: '葡萄牙', Slovenia: '斯洛文尼亚', Italy: '意大利', Monaco: '摩纳哥', Netherlands: '荷兰', Spain: '西班牙', Sweden: '瑞典', Switzerland: '瑞士', 'United Kingdom': '英国' } };
    Object.keys(CN).forEach(function (lg) { HOTEL_NAMES[lg] = HOTEL_NAMES[lg] || {}; Object.keys(CN[lg]).forEach(function (k) { if (!HOTEL_NAMES[lg][k]) HOTEL_NAMES[lg][k] = CN[lg][k]; }); });
  })();
  // ── Modo China: secciones de abajo que seguían hablando de Europa (FAQ, características, franja, explorar) ──
  var CNH = {
    en: { f1: 'An independent and free platform to plan train trips in China, Japan and Europe. No account, no subscription — explore routes, see journey times and book through certified partners.', f2: 'We connect you to official partners. For China we use Klook: search your route, press the Klook button and complete the booking on their secure platform, in English and with a foreign card.', fq: 'Do I need my passport for trains in China?', fa: 'Yes. Train tickets in mainland China are issued in the passenger’s name: you book with your passport number and show the same passport at the station.',
      lead: 'No subscriptions, no paywalls. Just real journey times and smart tools.', f1t: 'Journey times at a glance', f1d: 'The fastest direct train and the number of trains in a day on each Chinese route, from Klook data.', f2t: 'China, Japan & Europe, one site', f2d: 'China’s high-speed network, Japan’s Shinkansen and Europe’s railways in a single interface.', f3t: 'Journey search', f3d: 'Find the fastest direct train between Chinese cities, with journey time and a link to book.', f4d: 'Plan multi-city trips across China 100% free. No travel agent required.',
      et: 'Explore China’s train routes', es: 'Journey times, stations and tips for 33 high-speed routes across China.', stats: 'Book trains across China with Klook: <strong>33 routes</strong> between <strong>25 cities</strong>, with the search already loaded — free, no signup.' },
    es: { f1: 'Una plataforma independiente y gratuita para planificar viajes en tren por China, Japón y Europa. Sin cuenta ni suscripción: explora rutas, mira los tiempos de viaje y reserva con socios certificados.', f2: 'Te conectamos con socios oficiales. Para China usamos Klook: busca tu ruta, pulsa el botón de Klook y completa la reserva en su plataforma segura, en inglés y con una tarjeta extranjera.', fq: '¿Necesito el pasaporte para los trenes en China?', fa: 'Sí. En China continental los billetes de tren son nominales: reservas con el número de pasaporte y muestras ese mismo pasaporte en la estación.',
      lead: 'Sin suscripciones ni muros de pago. Solo tiempos de viaje reales y herramientas inteligentes.', f1t: 'Tiempos de viaje de un vistazo', f1d: 'El tren directo más rápido y la cantidad de trenes en un día de cada ruta china, con datos de Klook.', f2t: 'China, Japón y Europa, un solo sitio', f2d: 'La alta velocidad china, el Shinkansen japonés y los trenes de Europa en una sola interfaz.', f3t: 'Búsqueda de trayectos', f3d: 'Encuentra el tren directo más rápido entre ciudades chinas, con el tiempo de viaje y un enlace para reservar.', f4d: 'Diseña viajes por varias ciudades de China 100% gratis. Sin agente de viajes.',
      et: 'Explora las rutas de tren de China', es: 'Tiempos de viaje, estaciones y consejos de 33 rutas de alta velocidad por China.', stats: 'Reserva trenes por toda China con Klook: <strong>33 rutas</strong> entre <strong>25 ciudades</strong>, con la búsqueda ya cargada — gratis, sin registro.' },
    fr: { f1: 'Une plateforme indépendante et gratuite pour planifier des voyages en train en Chine, au Japon et en Europe. Sans compte ni abonnement : explorez les itinéraires, consultez les durées et réservez auprès de partenaires certifiés.', f2: 'Nous vous mettons en relation avec des partenaires officiels. Pour la Chine, nous utilisons Klook : cherchez votre trajet, cliquez sur le bouton Klook et réservez sur leur plateforme sécurisée, en anglais et avec une carte étrangère.', fq: 'Faut-il un passeport pour les trains en Chine ?', fa: 'Oui. En Chine continentale, les billets de train sont nominatifs : vous réservez avec votre numéro de passeport et présentez ce même passeport en gare.',
      lead: 'Sans abonnement ni accès payant. Seulement des durées réelles et des outils intelligents.', f1t: 'Les durées en un coup d’œil', f1d: 'Le train direct le plus rapide et le nombre de trains sur une journée pour chaque itinéraire chinois, d’après les données de Klook.', f2t: 'Chine, Japon et Europe, un seul site', f2d: 'La grande vitesse chinoise, le Shinkansen japonais et les trains d’Europe dans une seule interface.', f3t: 'Recherche de trajets', f3d: 'Trouvez le train direct le plus rapide entre villes chinoises, avec la durée et un lien pour réserver.', f4d: 'Concevez des voyages multi-villes en Chine 100 % gratuitement. Sans agent de voyage.',
      et: 'Explorez les itinéraires en train en Chine', es: 'Durées, gares et conseils pour 33 itinéraires à grande vitesse en Chine.', stats: 'Réservez vos trains en Chine avec Klook : <strong>33 itinéraires</strong> entre <strong>25 villes</strong>, recherche déjà remplie — gratuit, sans inscription.' },
    it: { f1: 'Una piattaforma indipendente e gratuita per pianificare viaggi in treno in Cina, Giappone ed Europa. Senza account né abbonamento: esplora i percorsi, guarda i tempi di viaggio e prenota con partner certificati.', f2: 'Ti colleghiamo a partner ufficiali. Per la Cina usiamo Klook: cerca il tuo percorso, premi il pulsante di Klook e completa la prenotazione sulla loro piattaforma sicura, in inglese e con una carta straniera.', fq: 'Serve il passaporto per i treni in Cina?', fa: 'Sì. Nella Cina continentale i biglietti del treno sono nominativi: prenoti con il numero di passaporto e mostri lo stesso passaporto in stazione.',
      lead: 'Niente abbonamenti né paywall. Solo tempi di viaggio reali e strumenti intelligenti.', f1t: 'Tempi di viaggio a colpo d’occhio', f1d: 'Il treno diretto più veloce e il numero di treni in un giorno su ogni percorso cinese, secondo i dati di Klook.', f2t: 'Cina, Giappone ed Europa, un solo sito', f2d: 'L’alta velocità cinese, lo Shinkansen giapponese e i treni d’Europa in un’unica interfaccia.', f3t: 'Ricerca dei tragitti', f3d: 'Trova il treno diretto più veloce tra le città cinesi, con il tempo di viaggio e un link per prenotare.', f4d: 'Progetta viaggi in più città della Cina 100% gratis. Nessun agente di viaggio.',
      et: 'Esplora i percorsi in treno in Cina', es: 'Tempi di viaggio, stazioni e consigli per 33 percorsi ad alta velocità in Cina.', stats: 'Prenota i treni in tutta la Cina con Klook: <strong>33 percorsi</strong> tra <strong>25 città</strong>, con la ricerca già compilata — gratis, senza registrazione.' },
    ja: { f1: '中国・日本・ヨーロッパの鉄道旅を計画できる、独立した無料のプラットフォームです。アカウントも登録も不要。路線を調べ、所要時間を確かめて、認定パートナーで予約できます。', f2: '公式パートナーにつなぎます。中国ではKlookを利用します。区間を検索してKlookのボタンを押し、外国のカードで安全に予約できます。', fq: '中国の列車にパスポートは必要？', fa: 'はい。中国本土の列車のきっぷは実名制で、パスポート番号で予約し、駅で同じパスポートを提示します。',
      lead: '登録も有料の壁もありません。実際の所要時間と、便利な機能だけ。', f1t: '所要時間がひと目でわかる', f1d: '中国の各区間で最も速い直通列車と1日の本数を、Klookのデータから表示します。', f2t: '中国も日本もヨーロッパも、ひとつのサイトで', f2d: '中国の高速鉄道、日本の新幹線、ヨーロッパの鉄道を、ひとつの画面で。', f3t: '区間検索', f3d: '中国の都市を結ぶ最速の直通列車を、所要時間と予約リンク付きで探せます。', f4d: '中国の複数都市をめぐる旅を、完全無料で計画できます。',
      et: '中国の鉄道ルートを探す', es: '中国の高速鉄道33区間の所要時間、駅、旅のヒント。', stats: 'Klookで中国の列車を予約：<strong>25都市</strong>・<strong>33区間</strong>は検索条件が入力済み。無料、登録不要。' },
    zh: { f1: '一个独立、免费的平台，用来规划中国、日本和欧洲的火车旅行。无需账户，无需订阅：查看线路和行程时长，再通过认证合作伙伴预订。', f2: '我们把你连接到官方合作伙伴。中国使用 Klook：搜索线路，点击 Klook 按钮，用境外银行卡在其安全平台完成预订。', fq: '在中国坐火车需要护照吗？', fa: '需要。中国内地火车票实行实名制：用护照号码购票，进站时出示同一本护照。',
      lead: '没有订阅，没有付费墙。只有真实的行程时长和好用的工具。', f1t: '行程时长一目了然', f1d: '根据 Klook 数据，显示每条中国线路最快的直达列车和当天的车次数量。', f2t: '中国、日本和欧洲，一个网站', f2d: '中国高铁、日本新干线和欧洲铁路，都在一个界面里。', f3t: '线路搜索', f3d: '查找中国城市之间最快的直达列车，附行程时长和预订链接。', f4d: '免费规划中国多城市行程，无需旅行社。',
      et: '探索中国火车线路', es: '中国 33 条高铁线路的时长、车站和实用建议。', stats: '用 Klook 预订中国各地的火车：<strong>25 座城市</strong>之间的 <strong>33 条线路</strong>已填好搜索条件——免费，无需注册。' }
  };
  var CN_PILLS = [['beijing-shanghai', 'beijing', 'shanghai'], ['shanghai-hangzhou', 'shanghai', 'hangzhou'], ['beijing-xian', 'beijing', 'xian'], ['guangzhou-guilin', 'guangzhou', 'guilin'], ['shenzhen-hong-kong', 'shenzhen', 'hongkong'], ['chengdu-chongqing', 'chengdu', 'chongqing'], ['shanghai-suzhou', 'shanghai', 'suzhou'], ['hangzhou-huangshan', 'hangzhou', 'huangshan']];
  (function () {
    var lg = lang(), H = CNH[lg] || CNH.en;
    var nm = function (slug) { var m = CN_DATA.valLoc[lg]; var c = CN_DATA.cities.filter(function (x) { return x.slug === slug; })[0]; return (m && m[slug]) || (c ? c.display : slug); };
    var cn = function (orig, edit) { var c = twinHome(orig, edit); if (c) { orig.classList.add('cn-has'); c.classList.replace('jp-static', 'cn-static'); c.classList.remove('eu-static'); } return c; };
    // FAQ: respuestas de China y la pregunta del pasaporte
    var items = document.querySelectorAll('#faq .faq-item.eu-static');
    if (items.length >= 2) {
      cn(items[0], function (c) { c.querySelector('.faq-a').textContent = H.f1; });
      var c2 = cn(items[1], function (c) { c.querySelector('.faq-a').textContent = H.f2; });
      if (c2) {
        var q = c2.cloneNode(true);
        q.querySelector('.faq-q span').textContent = H.fq; q.querySelector('.faq-a').textContent = H.fa;
        c2.parentNode.insertBefore(q, c2.nextSibling);
      }
    }
    // Características
    var rep = function (sel, txt) { var el = document.querySelector('#features ' + sel + '.eu-static'); if (el) cn(el, function (c) { c.textContent = txt; }); };
    rep('[data-i18n="features_lead"]', H.lead);
    rep('[data-i18n="f1_title"]', H.f1t); rep('[data-i18n="f1_desc"]', H.f1d);
    rep('[data-i18n="f2_title"]', H.f2t); rep('[data-i18n="f2_desc"]', H.f2d);
    rep('[data-i18n="f3_title"]', H.f3t); rep('[data-i18n="f3_desc"]', H.f3d);
    rep('[data-i18n="f4_desc"]', H.f4d);
    // Explorar rutas
    var suf = { es: 'es/', fr: 'fr/', it: 'it/', ja: 'ja/', zh: 'zh/' }[lg] || '';
    var et = document.querySelector('[data-i18n="explore_routes_title"].eu-static'), es = document.querySelector('[data-i18n="explore_routes_sub"].eu-static'), pills = document.querySelector('.explore-pills.eu-static');
    if (et) cn(et, function (c) { c.textContent = H.et; });
    if (es) cn(es, function (c) { c.textContent = H.es; });
    if (pills) cn(pills, function (c) { c.innerHTML = CN_PILLS.map(function (p) { return '<a href="/rutas/' + p[0] + '/' + suf + '" class="explore-route-pill">' + nm(p[1]) + ' → ' + nm(p[2]) + '</a>'; }).join(''); });
    // Franja de rutas y frase de estadísticas
    var prose = document.getElementById('statsProse');
    if (prose) cn(prose, function (c) { c.innerHTML = H.stats; });
    var marq = document.querySelector('.stats-marquee.eu-static');
    if (marq) cn(marq, function (c) { var chips = CN_PILLS.map(function (p) { return '<span class="route-chip">' + nm(p[1]) + ' → ' + nm(p[2]) + '</span>'; }).join(''); c.innerHTML = '<div class="stats-track">' + chips + chips + '</div>'; });
  })();

  useData('japan');

  switchEl.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.region-btn') : null;
    if (!b) return;
    if (b.hasAttribute('data-hotels')) { toggleHotels(b); return; }
    if (document.body.classList.contains('hotels-mode')) closeHotels();
    setRegion(b.getAttribute('data-region'));
  });

  new MutationObserver(function () { setTimeout(paintMode, 80); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  // Europa: chip "Japón" entre los países (antes de "Más países") que abre el modo Japón
  (function () {
    var more = countriesEl.lastElementChild;
    var jp = document.createElement('span');
    jp.className = 'country-chip country-chip-japan';
    jp.setAttribute('role', 'button');
    jp.tabIndex = 0;
    jp.textContent = (HOTEL_NAMES[lang()] || {}).Japan || 'Japan';
    var go = function (e) { e.stopPropagation(); setRegion('japan'); };
    jp.addEventListener('click', go);
    jp.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); } });
    countriesEl.insertBefore(jp, more);
    var cn = document.createElement('span');
    cn.className = 'country-chip country-chip-japan country-chip-china';
    cn.setAttribute('role', 'button');
    cn.tabIndex = 0;
    cn.textContent = I18N[lang()].china;
    var goCn = function (e) { e.stopPropagation(); setRegion('china'); };
    cn.addEventListener('click', goCn);
    cn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goCn(e); } });
    countriesEl.insertBefore(cn, more);
  })();

  // Resultado del planificador: la IA y la biblioteca devuelven las ciudades en inglés ("Rome", "Seville");
  // se muestran en el idioma de la página. Solo texto visible: los datos y los enlaces siguen en inglés.
  (function () {
    var res = document.getElementById('aiResults');
    if (!res || !window.MutationObserver) return;
    var busy = false;
    function localize() {
      if (busy) return;
      var names = HOTEL_NAMES[lang()];
      if (!names) return;
      var keys = Object.keys(names).filter(function (k) { return names[k] !== k && /^[A-Z]/.test(k); })
        .sort(function (a, b) { return b.length - a.length; });
      if (!keys.length) return;
      var esc = keys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
      var re = new RegExp('(?<![\\p{L}])(' + esc.join('|') + ')(?![\\p{L}])', 'gu');
      busy = true;
      var w = document.createTreeWalker(res, NodeFilter.SHOW_TEXT, null), n, todo = [];
      while ((n = w.nextNode())) { if (re.test(n.nodeValue)) todo.push(n); re.lastIndex = 0; }
      todo.forEach(function (node) { node.nodeValue = node.nodeValue.replace(re, function (m) { return names[m] || m; }); });
      setTimeout(function () { busy = false; }, 0);
    }
    new MutationObserver(function () { setTimeout(localize, 0); }).observe(res, { childList: true, subtree: true, characterData: true });
  })();

  // Pestaña "Experiencias" (junto a Ruleta de destinos): GetYourGuide + tours y actividades de Klook, ambos por el proxy de afiliados.
  var EXP = {
    en: { tab: 'Experiences', t: 'Tours and experiences', s: 'Find things to do at your destination before you book.', kl: 'Klook', kld: 'Tours, tickets and activities with instant confirmation', tr: 'GetYourGuide', trd: 'Tours, day trips and skip-the-line tickets', go: 'Explore' },
    es: { tab: 'Experiencias', t: 'Tours y experiencias', s: 'Descubre qué hacer en tu destino antes de reservar.', kl: 'Klook', kld: 'Tours, entradas y actividades con confirmación inmediata', tr: 'GetYourGuide', trd: 'Tours, excursiones y entradas sin colas', go: 'Explorar' },
    fr: { tab: 'Expériences', t: 'Visites et expériences', s: 'Découvrez quoi faire à destination avant de réserver.', kl: 'Klook', kld: 'Visites, billets et activités avec confirmation immédiate', tr: 'GetYourGuide', trd: 'Visites, excursions et billets coupe-file', go: 'Explorer' },
    it: { tab: 'Esperienze', t: 'Tour ed esperienze', s: 'Scopri cosa fare a destinazione prima di prenotare.', kl: 'Klook', kld: 'Tour, biglietti e attività con conferma immediata', tr: 'GetYourGuide', trd: 'Tour, escursioni e biglietti salta la fila', go: 'Esplora' },
    de: { tab: 'Erlebnisse', t: 'Touren und Erlebnisse', s: 'Entdecke vor der Buchung, was du am Ziel unternehmen kannst.', kl: 'Klook', kld: 'Touren, Tickets und Aktivitäten mit sofortiger Bestätigung', tr: 'GetYourGuide', trd: 'Touren, Tagesausflüge und Tickets ohne Anstehen', go: 'Entdecken' },
    pt: { tab: 'Experiências', t: 'Passeios e experiências', s: 'Descubra o que fazer no destino antes de reservar.', kl: 'Klook', kld: 'Passeios, ingressos e atividades com confirmação imediata', tr: 'GetYourGuide', trd: 'Passeios, excursões e ingressos sem fila', go: 'Explorar' },
    ja: { tab: '体験', t: 'ツアーと体験', s: '予約の前に、目的地での楽しみ方を探しましょう。', kl: 'Klook', kld: 'ツアー・チケット・アクティビティを即時確認で', tr: 'GetYourGuide', trd: 'ツアー、日帰り旅行、優先入場チケット', go: '見る' },
    zh: { tab: '体验', t: '旅游团与体验', s: '预订前，先看看目的地有什么好玩的。', kl: 'Klook', kld: '旅游团、门票和活动，即时确认', tr: 'GetYourGuide', trd: '旅游团、一日游和免排队门票', go: '探索' }
  };
  function buildExperiences() {
    var tabs = document.querySelector('.search-tabs'), card = document.querySelector('.search-card');
    if (!tabs || !card || tabs.querySelector('[data-tab="experiences"]')) return;
    var tab = document.createElement('button');
    tab.type = 'button'; tab.className = 'search-tab'; tab.setAttribute('aria-pressed', 'false'); tab.setAttribute('data-tab', 'experiences');
    tabs.appendChild(tab);
    var panel = document.createElement('div');
    panel.className = 'search-panel exp-panel'; panel.setAttribute('data-panel', 'experiences');
    panel.innerHTML = '<div class="exp-head"><h3 class="exp-title"></h3><p class="exp-sub"></p></div><div class="exp-grid">' +
      '<a href="#" class="exp-card exp-klook" data-exp="klook"><img class="exp-logo" src="https://www.google.com/s2/favicons?sz=64&domain=klook.com" alt="" width="32" height="32"><span class="exp-name"></span><span class="exp-desc"></span><span class="exp-go"></span></a>' +
      '<a href="#" class="exp-card exp-gyg" data-exp="getyourguide"><img class="exp-logo" src="https://www.google.com/s2/favicons?sz=64&domain=getyourguide.com" alt="" width="32" height="32"><span class="exp-name"></span><span class="exp-desc"></span><span class="exp-go"></span></a></div>';
    card.appendChild(panel);
    function paint() {
      var u = EXP[lang()] || EXP.en;
      tab.textContent = u.tab;
      panel.querySelector('.exp-title').textContent = u.t; panel.querySelector('.exp-sub').textContent = u.s;
      var k = panel.querySelector('.exp-klook'), t = panel.querySelector('.exp-gyg');
      k.querySelector('.exp-name').textContent = u.kl; k.querySelector('.exp-desc').textContent = u.kld; k.querySelector('.exp-go').textContent = u.go + ' →';
      t.querySelector('.exp-name').textContent = u.tr; t.querySelector('.exp-desc').textContent = u.trd; t.querySelector('.exp-go').textContent = u.go + ' →';
    }
    paint();
    new MutationObserver(function () { setTimeout(paint, 80); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    function show() {
      if (document.body.classList.contains('hotels-mode')) {
        document.body.classList.remove('hotels-mode');
        var chip = document.querySelector('.region-hotels'); if (chip) { chip.classList.remove('on'); chip.setAttribute('aria-pressed', 'false'); }
      }
      document.querySelectorAll('.search-tab').forEach(function (x) { var on = x === tab; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      document.querySelectorAll('.search-panel').forEach(function (x) { x.classList.toggle('on', x === panel); });
    }
    tab.addEventListener('click', show);
    // al elegir otra pestaña, esta se apaga (el script de pestañas de la portada no la conoce)
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('.search-tab');
      if (t && t !== tab) { tab.classList.remove('on'); tab.setAttribute('aria-pressed', 'false'); panel.classList.remove('on'); }
    });
    panel.addEventListener('click', function (e) {
      var c = e.target.closest && e.target.closest('.exp-card'); if (!c) return;
      e.preventDefault();
      var base = typeof PROXY_BASE === 'string' ? PROXY_BASE : 'https://voxa-production-dc15.up.railway.app/affiliate';
      var kind = c.getAttribute('data-exp');
      window.open(base + '/' + (kind === 'klook' ? 'klook-experiences?lang=' + lang() : kind), '_blank');
      try { if (typeof gtag === 'function') gtag('event', 'ui_click', { source: 'experiences_' + c.getAttribute('data-exp') }); } catch (er) {}
    });
  }
  buildExperiences();
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-tab="experiences"]') && !document.getElementById('poppinsFont')) { var pl = document.createElement('link'); pl.id = 'poppinsFont'; pl.rel = 'stylesheet'; pl.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap'; document.head.appendChild(pl); } });

  paintSwitch();
  // Enlace directo al modo Japón (por ejemplo, desde anuncios): glosx.app/#japan
  if (/^#(japan|japon|giappone|japao)$/i.test(location.hash)) setRegion('japan', true);
  else if (/^#(china|chine|cina)$/i.test(location.hash)) setRegion('china', true);
})();
