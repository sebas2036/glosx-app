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

  var CITIES = [{"display":"Akita","slug":"akita","keywords":["akita"]},{"display":"Aomori","slug":"aomori","keywords":["aomori","shin aomori"]},{"display":"Asahikawa","slug":"asahikawa","keywords":["asahikawa"]},{"display":"Asakusa","slug":"asakusa","keywords":["asakusa"]},{"display":"Atami","slug":"atami","keywords":["atami"]},{"display":"Beppu","slug":"beppu","keywords":["beppu"]},{"display":"Chitose","slug":"chitose","keywords":["chitose"]},{"display":"Fukuchiyama","slug":"fukuchiyama","keywords":["fukuchiyama"]},{"display":"Fukui","slug":"fukui","keywords":["fukui"]},{"display":"Fukuoka","slug":"fukuoka","keywords":["fukuoka","hakata"]},{"display":"Fukushima","slug":"fukushima","keywords":["fukushima"]},{"display":"Fukuyama","slug":"fukuyama","keywords":["fukuyama"]},{"display":"Gero","slug":"gero","keywords":["gero"]},{"display":"Gifu","slug":"gifu","keywords":["gifu"]},{"display":"Hachinohe","slug":"hachinohe","keywords":["hachinohe"]},{"display":"Hakodate","slug":"hakodate","keywords":["hakodate"]},{"display":"Hakone","slug":"hakone","keywords":["hakone"]},{"display":"Hamamatsu","slug":"hamamatsu","keywords":["hamamatsu"]},{"display":"Hida Furukawa","slug":"hidafurukawa","keywords":["hida furukawa"]},{"display":"Himeji","slug":"himeji","keywords":["himeji"]},{"display":"Hirosaki","slug":"hirosaki","keywords":["hirosaki"]},{"display":"Hiroshima","slug":"hiroshima","keywords":["hiroshima","hiroxima"]},{"display":"Hita","slug":"hita","keywords":["hita"]},{"display":"Huis Ten Bosch","slug":"huistenbosch","keywords":["huis ten bosch"]},{"display":"Ichinoseki","slug":"ichinoseki","keywords":["ichinoseki"]},{"display":"Ito","slug":"ito","keywords":["ito"]},{"display":"Joetsu Myoko","slug":"joetsumyoko","keywords":["joetsu myoko"]},{"display":"Kaga Onsen","slug":"kagaonsen","keywords":["kaga onsen"]},{"display":"Kagoshima","slug":"kagoshima","keywords":["kagoshima"]},{"display":"Kanazawa","slug":"kanazawa","keywords":["kanazawa"]},{"display":"Kansai Airport","slug":"kansaiairport","keywords":["kansai airport"]},{"display":"Karuizawa","slug":"karuizawa","keywords":["karuizawa"]},{"display":"Kawaguchiko","slug":"kawaguchiko","keywords":["kawaguchiko","fujikawaguchiko","kawaguchi"]},{"display":"Kii Tanabe","slug":"kiitanabe","keywords":["kii tanabe"]},{"display":"Kinosaki","slug":"kinosaki","keywords":["kinosaki"]},{"display":"Kinugawa Onsen","slug":"kinugawaonsen","keywords":["kinugawa onsen"]},{"display":"Kobe","slug":"kobe","keywords":["kobe","shin kobe"]},{"display":"Kofu","slug":"kofu","keywords":["kofu"]},{"display":"Kokura","slug":"kokura","keywords":["kokura"]},{"display":"Komatsu","slug":"komatsu","keywords":["komatsu"]},{"display":"Koriyama","slug":"koriyama","keywords":["koriyama"]},{"display":"Kumamoto","slug":"kumamoto","keywords":["kumamoto"]},{"display":"Kurashiki","slug":"kurashiki","keywords":["kurashiki"]},{"display":"Kurume","slug":"kurume","keywords":["kurume"]},{"display":"Kushiro","slug":"kushiro","keywords":["kushiro"]},{"display":"Kyoto","slug":"kyoto","keywords":["kyoto","kioto","quioto"]},{"display":"Maibara","slug":"maibara","keywords":["maibara"]},{"display":"Matsue","slug":"matsue","keywords":["matsue"]},{"display":"Matsumoto","slug":"matsumoto","keywords":["matsumoto"]},{"display":"Mishima","slug":"mishima","keywords":["mishima"]},{"display":"Mito","slug":"mito","keywords":["mito"]},{"display":"Morioka","slug":"morioka","keywords":["morioka"]},{"display":"Murakami","slug":"murakami","keywords":["murakami"]},{"display":"Nagano","slug":"nagano","keywords":["nagano"]},{"display":"Nagaoka","slug":"nagaoka","keywords":["nagaoka"]},{"display":"Nagoya","slug":"nagoya","keywords":["nagoya","nagoia"]},{"display":"Nakatsu","slug":"nakatsu","keywords":["nakatsu"]},{"display":"Nanao","slug":"nanao","keywords":["nanao"]},{"display":"Narita Airport","slug":"naritaairport","keywords":["narita airport","narita"]},{"display":"Nasushiobara","slug":"nasushiobara","keywords":["nasushiobara"]},{"display":"New Chitose Airport","slug":"newchitoseairport","keywords":["new chitose airport"]},{"display":"Niigata","slug":"niigata","keywords":["niigata"]},{"display":"Nikko","slug":"nikko","keywords":["nikko","tobu nikko"]},{"display":"Noboribetsu","slug":"noboribetsu","keywords":["noboribetsu"]},{"display":"Obihiro","slug":"obihiro","keywords":["obihiro"]},{"display":"Odawara","slug":"odawara","keywords":["odawara"]},{"display":"Oita","slug":"oita","keywords":["oita"]},{"display":"Okayama","slug":"okayama","keywords":["okayama"]},{"display":"Onomichi","slug":"onomichi","keywords":["onomichi"]},{"display":"Osaka","slug":"osaka","keywords":["osaka","osaca","shin osaka","shinosaka"]},{"display":"Otaru","slug":"otaru","keywords":["otaru"]},{"display":"Otsuki","slug":"otsuki","keywords":["otsuki"]},{"display":"Saga","slug":"saga","keywords":["saga"]},{"display":"Sapporo","slug":"sapporo","keywords":["sapporo","saporo"]},{"display":"Sendai","slug":"sendai","keywords":["sendai"]},{"display":"Shinagawa","slug":"shinagawa","keywords":["shinagawa"]},{"display":"Shin Fuji","slug":"shinfuji","keywords":["shin fuji"]},{"display":"Shin Hakodate Hokuto","slug":"shinhakodatehokuto","keywords":["shin hakodate hokuto"]},{"display":"Shin Hanamaki","slug":"shinhanamaki","keywords":["shin hanamaki"]},{"display":"Shinjuku","slug":"shinjuku","keywords":["shinjuku"]},{"display":"Shin Sapporo","slug":"shinsapporo","keywords":["shin sapporo"]},{"display":"Shin Yamaguchi","slug":"shinyamaguchi","keywords":["shin yamaguchi"]},{"display":"Shin Yokohama","slug":"shinyokohama","keywords":["shin yokohama"]},{"display":"Shirahama","slug":"shirahama","keywords":["shirahama"]},{"display":"Shizuoka","slug":"shizuoka","keywords":["shizuoka"]},{"display":"Takasaki","slug":"takasaki","keywords":["takasaki"]},{"display":"Takayama","slug":"takayama","keywords":["takayama"]},{"display":"Takeo Onsen","slug":"takeoonsen","keywords":["takeo onsen"]},{"display":"Tennoji","slug":"tennoji","keywords":["tennoji"]},{"display":"Tokyo","slug":"tokyo","keywords":["tokyo","tokio","toquio","tokyo station"]},{"display":"Tomakomai","slug":"tomakomai","keywords":["tomakomai"]},{"display":"Toyama","slug":"toyama","keywords":["toyama"]},{"display":"Toyohashi","slug":"toyohashi","keywords":["toyohashi"]},{"display":"Toyooka","slug":"toyooka","keywords":["toyooka"]},{"display":"Tsuruga","slug":"tsuruga","keywords":["tsuruga"]},{"display":"Ueda","slug":"ueda","keywords":["ueda"]},{"display":"Utsunomiya","slug":"utsunomiya","keywords":["utsunomiya"]},{"display":"Wakayama","slug":"wakayama","keywords":["wakayama"]},{"display":"Wakkanai","slug":"wakkanai","keywords":["wakkanai"]},{"display":"Yamagata","slug":"yamagata","keywords":["yamagata"]},{"display":"Yokohama","slug":"yokohama","keywords":["yokohama"]},{"display":"Yonago","slug":"yonago","keywords":["yonago"]},{"display":"Yufuin","slug":"yufuin","keywords":["yufuin"]}];
  var ROUTES = [["aomori","hachinohe"],["aomori","hirosaki"],["aomori","shinhakodatehokuto"],["asakusa","kinugawaonsen"],["asakusa","nikko"],["atami","ito"],["atami","mishima"],["atami","shizuoka"],["beppu","kokura"],["beppu","oita"],["beppu","yufuin"],["fukuoka","beppu"],["fukuoka","hita"],["fukuoka","huistenbosch"],["fukuoka","kagoshima"],["fukuoka","kokura"],["fukuoka","kumamoto"],["fukuoka","kurume"],["fukuoka","nakatsu"],["fukuoka","oita"],["fukuoka","saga"],["fukuoka","shinyamaguchi"],["fukuoka","takeoonsen"],["fukuoka","yufuin"],["hakodate","noboribetsu"],["hakodate","sapporo"],["hakodate","shinhakodatehokuto"],["hiroshima","fukuoka"],["hiroshima","fukuyama"],["hiroshima","himeji"],["hiroshima","kokura"],["hiroshima","kumamoto"],["hiroshima","okayama"],["hiroshima","onomichi"],["hiroshima","shinyamaguchi"],["kanazawa","fukui"],["kanazawa","kagaonsen"],["kanazawa","komatsu"],["kanazawa","nagano"],["kanazawa","nanao"],["kanazawa","toyama"],["kanazawa","tsuruga"],["kanazawa","ueda"],["kansaiairport","kyoto"],["kansaiairport","osaka"],["kansaiairport","tennoji"],["kyoto","fukuchiyama"],["kyoto","gifu"],["kyoto","himeji"],["kyoto","hiroshima"],["kyoto","kinosaki"],["kyoto","maibara"],["kyoto","nagoya"],["kyoto","okayama"],["kyoto","tsuruga"],["kyoto","wakayama"],["mishima","shinfuji"],["mishima","shizuoka"],["morioka","akita"],["morioka","aomori"],["morioka","hachinohe"],["morioka","shinhanamaki"],["nagano","karuizawa"],["nagano","matsumoto"],["nagano","toyama"],["nagano","ueda"],["nagoya","gifu"],["nagoya","hamamatsu"],["nagoya","himeji"],["nagoya","hiroshima"],["nagoya","maibara"],["nagoya","matsumoto"],["nagoya","nagano"],["nagoya","okayama"],["nagoya","shizuoka"],["nagoya","takayama"],["nagoya","toyama"],["nagoya","toyohashi"],["naritaairport","shinagawa"],["naritaairport","tokyo"],["naritaairport","yokohama"],["niigata","akita"],["niigata","joetsumyoko"],["niigata","murakami"],["niigata","nagaoka"],["odawara","atami"],["odawara","shizuoka"],["okayama","fukuoka"],["okayama","fukuyama"],["okayama","himeji"],["okayama","kurashiki"],["okayama","matsue"],["okayama","yonago"],["osaka","fukuchiyama"],["osaka","fukuoka"],["osaka","fukuyama"],["osaka","hamamatsu"],["osaka","himeji"],["osaka","hiroshima"],["osaka","kagoshima"],["osaka","kiitanabe"],["osaka","kinosaki"],["osaka","kobe"],["osaka","kokura"],["osaka","kumamoto"],["osaka","kyoto"],["osaka","maibara"],["osaka","nagoya"],["osaka","odawara"],["osaka","okayama"],["osaka","shinfuji"],["osaka","shinyamaguchi"],["osaka","shirahama"],["osaka","shizuoka"],["osaka","toyohashi"],["osaka","toyooka"],["osaka","tsuruga"],["osaka","wakayama"],["sapporo","asahikawa"],["sapporo","chitose"],["sapporo","kushiro"],["sapporo","newchitoseairport"],["sapporo","noboribetsu"],["sapporo","obihiro"],["sapporo","otaru"],["sapporo","shinsapporo"],["sapporo","tomakomai"],["sapporo","wakkanai"],["sendai","akita"],["sendai","aomori"],["sendai","fukushima"],["sendai","hachinohe"],["sendai","ichinoseki"],["sendai","koriyama"],["sendai","morioka"],["shinjuku","hakone"],["shinjuku","kawaguchiko"],["shinjuku","kofu"],["shinjuku","matsumoto"],["shinjuku","naritaairport"],["shinjuku","odawara"],["shinjuku","otsuki"],["shinyokohama","atami"],["shinyokohama","kyoto"],["shinyokohama","mishima"],["shinyokohama","nagoya"],["shinyokohama","odawara"],["shinyokohama","osaka"],["takayama","gero"],["takayama","gifu"],["takayama","hidafurukawa"],["takayama","toyama"],["tokyo","akita"],["tokyo","aomori"],["tokyo","atami"],["tokyo","fukuoka"],["tokyo","fukushima"],["tokyo","fukuyama"],["tokyo","hachinohe"],["tokyo","hamamatsu"],["tokyo","himeji"],["tokyo","hiroshima"],["tokyo","ichinoseki"],["tokyo","ito"],["tokyo","kanazawa"],["tokyo","karuizawa"],["tokyo","kobe"],["tokyo","kokura"],["tokyo","kyoto"],["tokyo","maibara"],["tokyo","matsumoto"],["tokyo","mishima"],["tokyo","mito"],["tokyo","morioka"],["tokyo","nagano"],["tokyo","nagaoka"],["tokyo","nagoya"],["tokyo","niigata"],["tokyo","odawara"],["tokyo","okayama"],["tokyo","osaka"],["tokyo","sendai"],["tokyo","shinfuji"],["tokyo","shinhakodatehokuto"],["tokyo","shinyamaguchi"],["tokyo","shinyokohama"],["tokyo","shizuoka"],["tokyo","takasaki"],["tokyo","toyama"],["tokyo","toyohashi"],["tokyo","ueda"],["tokyo","utsunomiya"],["tokyo","yamagata"],["tokyo","yokohama"],["utsunomiya","fukushima"],["utsunomiya","nasushiobara"]];

  var I18N = {
    en: { europe: 'Europe', japan: 'Japan', aria: 'Region', two: 'Enter two cities: where you start and where you end.', ph: 'Example: Tokyo to Kyoto', nopair: 'Pick one of the popular routes, or try another pair of Japanese cities.' },
    es: { europe: 'Europa', japan: 'Japón', aria: 'Región', two: 'Escribe dos ciudades: origen y destino.', ph: 'Ejemplo: Tokio a Kioto', nopair: 'Elige una de las rutas populares o prueba otro par de ciudades japonesas.' },
    fr: { europe: 'Europe', japan: 'Japon', aria: 'Région', two: 'Indiquez deux villes : départ et arrivée.', ph: 'Exemple : Tokyo à Kyoto', nopair: 'Choisissez l’une des routes populaires ou essayez une autre paire de villes japonaises.' },
    it: { europe: 'Europa', japan: 'Giappone', aria: 'Regione', two: 'Scrivi due città: partenza e arrivo.', ph: 'Esempio: Tokyo a Kyoto', nopair: 'Scegli uno dei percorsi popolari o prova un’altra coppia di città giapponesi.' },
    de: { europe: 'Europa', japan: 'Japan', aria: 'Region', two: 'Gib zwei Städte ein: Start und Ziel.', ph: 'Beispiel: Tokio nach Kyoto', nopair: 'Wähle eine der beliebten Strecken oder probiere ein anderes Städtepaar in Japan.' },
    pt: { europe: 'Europa', japan: 'Japão', aria: 'Região', two: 'Digite duas cidades: origem e destino.', ph: 'Exemplo: Tóquio a Quioto', nopair: 'Escolha uma das rotas populares ou tente outro par de cidades japonesas.' }
  };

  var GROUPS = [
    { id: 'shinkansen', names: { en: 'Shinkansen', es: 'Shinkansen', fr: 'Shinkansen', it: 'Shinkansen', de: 'Shinkansen', pt: 'Shinkansen' },
      pairs: [['tokyo', 'kyoto'], ['tokyo', 'osaka'], ['tokyo', 'nagoya'], ['nagoya', 'kyoto'], ['osaka', 'hiroshima'], ['tokyo', 'hiroshima'], ['tokyo', 'fukuoka']] },
    { id: 'kanto', names: { en: 'Tokyo & Kanto', es: 'Tokio y Kanto', fr: 'Tokyo et Kanto', it: 'Tokyo e Kanto', de: 'Tokio & Kanto', pt: 'Tóquio e Kanto' },
      pairs: [['naritaairport', 'tokyo'], ['tokyo', 'yokohama'], ['shinjuku', 'hakone'], ['shinjuku', 'kawaguchiko'], ['asakusa', 'nikko'], ['tokyo', 'karuizawa'], ['tokyo', 'odawara']] },
    { id: 'kansai', names: { en: 'Kansai', es: 'Kansai', fr: 'Kansai', it: 'Kansai', de: 'Kansai', pt: 'Kansai' },
      pairs: [['osaka', 'kyoto'], ['kansaiairport', 'kyoto'], ['kansaiairport', 'osaka'], ['osaka', 'kobe'], ['kyoto', 'himeji'], ['osaka', 'himeji'], ['kyoto', 'kinosaki']] },
    { id: 'chubu', names: { en: 'Chubu & Hokuriku', es: 'Chubu y Hokuriku', fr: 'Chubu et Hokuriku', it: 'Chubu e Hokuriku', de: 'Chubu & Hokuriku', pt: 'Chubu e Hokuriku' },
      pairs: [['tokyo', 'kanazawa'], ['nagoya', 'takayama'], ['nagoya', 'matsumoto'], ['nagoya', 'nagano'], ['kanazawa', 'toyama'], ['takayama', 'toyama'], ['shinjuku', 'matsumoto']] },
    { id: 'west', names: { en: 'West Japan & Kyushu', es: 'Oeste de Japón y Kyushu', fr: 'Ouest du Japon et Kyushu', it: 'Giappone occidentale e Kyushu', de: 'Westjapan & Kyushu', pt: 'Oeste do Japão e Kyushu' },
      pairs: [['hiroshima', 'okayama'], ['hiroshima', 'fukuoka'], ['fukuoka', 'kumamoto'], ['fukuoka', 'kagoshima'], ['fukuoka', 'yufuin'], ['okayama', 'matsue'], ['osaka', 'kagoshima']] },
    { id: 'north', names: { en: 'Tohoku & Hokkaido', es: 'Tohoku y Hokkaido', fr: 'Tohoku et Hokkaido', it: 'Tohoku e Hokkaido', de: 'Tohoku & Hokkaido', pt: 'Tohoku e Hokkaido' },
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
        var from = displayBySlug[p[0]], to = displayBySlug[p[1]];
        a.href = '#';
        a.textContent = from + ' → ' + to;
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

  var CONN = { en: 'to', es: 'a', fr: '\u00e0', it: 'a', de: 'nach', pt: 'a' };
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
      var from = displayBySlug[p[0]], to = displayBySlug[p[1]];
      var chip = document.createElement('span');
      chip.className = 'ai-suggestion';
      chip.setAttribute('role', 'button');
      chip.setAttribute('tabindex', '0');
      chip.textContent = from + ' \u2192 ' + to;
      chip.addEventListener('click', function () { applyQuick(from, to); });
      chip.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); applyQuick(from, to); }
      });
      japanSuggestEl.appendChild(chip);
    });
  }

  function paintSwitch() {
    switchEl.setAttribute('aria-label', t('aria'));
    switchEl.querySelectorAll('.region-btn').forEach(function (b) {
      var r = b.getAttribute('data-region');
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
    } else {
      if (europePlaceholder) inputEl.setAttribute('placeholder', europePlaceholder);
      countriesEl.style.display = '';
      if (japanChipsEl) japanChipsEl.style.display = 'none';
      if (europeSuggestEl) europeSuggestEl.style.display = '';
      if (japanSuggestEl) japanSuggestEl.style.display = 'none';
    }
  }

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
      resetBoard(displayBySlug.tokyo, displayBySlug.kyoto);
    } else {
      setCities(europeCities);
      window.GLOSX_ROUTE_PAGES = europePages;
      resetBoard('Madrid', 'Barcelona');
      if (typeof window.resetAIPlanner === 'function') window.resetAIPlanner();
    }
    paintMode();
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
    return String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
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

  function showMsg(key) {
    var wrap = document.getElementById('aiInputWrapper');
    if (!wrap) return;
    var old = document.getElementById('aiPlannerError');
    if (old) old.remove();
    var p = document.createElement('p');
    p.id = 'aiPlannerError';
    p.style.cssText = 'color:#C10016;font-size:15px;margin-top:16px;text-align:center;font-weight:600;';
    p.textContent = t(key);
    wrap.appendChild(p);
    setTimeout(function () { if (p.parentNode) p.remove(); }, 6000);
  }

  // En modo Japón no se le pregunta al planificador de Europa: se resuelve el par acá.
  var originalGenerate = window.generateAIRoute;
  function japanGenerate() {
    if (typeof window.previewFromInput !== 'function') return;
    if (window.previewFromInput()) return; // "A a B" con conector, par verificado
    var cities = findCities(inputEl.value);
    if (cities.length === 2) {
      inputEl.value = displayBySlug[cities[0]] + ' ' + (CONN[lang()] || 'to') + ' ' + displayBySlug[cities[1]];
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
    pt: { from: 'a partir de {d}', direct: 'Direto' }
  };
  function fmtMin(m) {
    var h = Math.floor(m / 60), r = m % 60;
    return h ? (r ? h + ' h ' + r + ' min' : h + ' h') : m + ' min';
  }
  var titleEl = document.getElementById('aiRouteTitle');
  var durEl = document.getElementById('aiRouteDuration');
  var metaEl = document.getElementById('aiRouteMeta');
  var infoBusy = false;
  var infoObs = null;
  function paintInfo() {
    if (region !== 'japan' || !titleEl || !durEl || !metaEl || infoBusy) return;
    var c = findCities(titleEl.textContent + ' ' + metaEl.textContent);
    var d = c.length >= 2 ? INFO[c[0] + '-' + c[1]] : null;
    if (!d) return;
    var tx = INFO_I18N[lang()] || INFO_I18N.en;
    infoBusy = true;
    durEl.textContent = tx.from.replace('{d}', fmtMin(d.m));
    var base = metaEl.textContent.split(' · ')[0];
    var parts = [base];
    if (d.s) parts.push('Shinkansen');
    if (d.t.length) parts.push(d.t.join(', '));
    parts.push(tx.direct);
    metaEl.textContent = parts.join(' · ');
    infoObs.takeRecords();
    infoBusy = false;
  }
  if (titleEl && durEl && metaEl) {
    infoObs = new MutationObserver(paintInfo);
    [titleEl, durEl, metaEl].forEach(function (el) { infoObs.observe(el, { childList: true, characterData: true, subtree: true }); });
  }

  switchEl.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.region-btn') : null;
    if (b) setRegion(b.getAttribute('data-region'));
  });

  new MutationObserver(function () { setTimeout(paintMode, 80); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  paintSwitch();
  // Enlace directo al modo Japón (por ejemplo, desde anuncios): glosx.app/#japan
  if (/^#(japan|japon|giappone|japao)$/i.test(location.hash)) setRegion('japan', true);
})();
