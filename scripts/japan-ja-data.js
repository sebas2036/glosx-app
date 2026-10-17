/** Datos en japonés para las rutas de Japón: ciudades, trenes, regiones, atractivos y operadores. */
const CITY = {
  akita: '秋田', aomori: '青森', asahikawa: '旭川', asakusa: '浅草', atami: '熱海', beppu: '別府', chitose: '千歳',
  fukuchiyama: '福知山', fukui: '福井', fukuoka: '福岡', fukushima: '福島', fukuyama: '福山', gero: '下呂', gifu: '岐阜',
  hachinohe: '八戸', hakodate: '函館', hakone: '箱根', hamamatsu: '浜松', hidafurukawa: '飛騨古川', himeji: '姫路',
  hirosaki: '弘前', hiroshima: '広島', hita: '日田', huistenbosch: 'ハウステンボス', ichinoseki: '一ノ関', ito: '伊東',
  joetsumyoko: '上越妙高', kagaonsen: '加賀温泉', kagoshima: '鹿児島', kanazawa: '金沢', kansaiairport: '関西空港',
  karuizawa: '軽井沢', kawaguchiko: '河口湖', kiitanabe: '紀伊田辺', kinosaki: '城崎温泉', kinugawaonsen: '鬼怒川温泉',
  kobe: '神戸', kofu: '甲府', kokura: '小倉', komatsu: '小松', koriyama: '郡山', kumamoto: '熊本', kurashiki: '倉敷',
  kurume: '久留米', kushiro: '釧路', kyoto: '京都', maibara: '米原', matsue: '松江', matsumoto: '松本', mishima: '三島',
  mito: '水戸', morioka: '盛岡', murakami: '村上', nagano: '長野', nagaoka: '長岡', nagoya: '名古屋', nakatsu: '中津',
  nanao: '七尾', naritaairport: '成田空港', nasushiobara: '那須塩原', newchitoseairport: '新千歳空港', niigata: '新潟',
  nikko: '日光', noboribetsu: '登別', obihiro: '帯広', odawara: '小田原', oita: '大分', okayama: '岡山', onomichi: '尾道',
  osaka: '大阪', otaru: '小樽', otsuki: '大月', saga: '佐賀', sapporo: '札幌', sendai: '仙台', shinagawa: '品川',
  shinfuji: '新富士', shinhakodatehokuto: '新函館北斗', shinhanamaki: '新花巻', shinjuku: '新宿', shinsapporo: '新札幌',
  shinyamaguchi: '新山口', shinyokohama: '新横浜', shirahama: '白浜', shizuoka: '静岡', takasaki: '高崎', takayama: '高山',
  takeoonsen: '武雄温泉', tennoji: '天王寺', tokyo: '東京', tomakomai: '苫小牧', toyama: '富山', toyohashi: '豊橋',
  toyooka: '豊岡', tsuruga: '敦賀', ueda: '上田', utsunomiya: '宇都宮', wakayama: '和歌山', wakkanai: '稚内',
  yamagata: '山形', yokohama: '横浜', yonago: '米子', yufuin: '由布院'
};
const TRAIN = {
  Hayabusa: 'はやぶさ', Hayate: 'はやて', Tsugaru: 'つがる', 'Revaty Aizu': 'リバティ会津', 'Revaty Kinu': 'リバティきぬ',
  'Revaty Kegon': 'リバティけごん', 'SPACIA X': 'スペーシアX', Odoriko: '踊り子', 'Saphir Odoriko': 'サフィール踊り子',
  Kodama: 'こだま', Hikari: 'ひかり', Sonic: 'ソニック', 'Nichirin Seagaia': 'にちりんシーガイア', Yufu: 'ゆふ',
  'Yufuin no Mori': 'ゆふいんの森', 'Huis Ten Bosch': 'ハウステンボス', Sakura: 'さくら', Mizuho: 'みずほ', Nozomi: 'のぞみ',
  Tsubame: 'つばめ', Hokuto: '北斗', Tsurugi: 'つるぎ', Kagayaki: 'かがやき', Hakutaka: 'はくたか', 'Noto Kagaribi': 'のとかがり火',
  Haruka: 'はるか', Kinosaki: 'きのさき', Hashidate: 'はしだて', Hida: 'ひだ', Thunderbird: 'サンダーバード', Kuroshio: 'くろしお',
  Komachi: 'こまち', Yamabiko: 'やまびこ', Asama: 'あさま', Shinano: 'しなの', Shirasagi: 'しらさぎ', 'Narita Express': '成田エクスプレス',
  Inaho: 'いなほ', Shirayuki: 'しらゆき', Toki: 'とき', Yakumo: 'やくも', Kounotori: 'こうのとり', Kamui: 'カムイ',
  'Airport Rapid': '快速エアポート', Suzuran: 'すずらん', Ozora: 'おおぞら', Tokachi: 'とかち', Soya: '宗谷', Romancecar: 'ロマンスカー',
  Azusa: 'あずさ', Kaiji: 'かいじ', Tsubasa: 'つばさ', Tokiwa: 'ときわ', Hitachi: 'ひたち', Nasuno: 'なすの'
};
const REGION = { Tohoku: '東北地方', Hokkaido: '北海道', Kanto: '関東地方', Chubu: '中部地方', Kyushu: '九州', Kansai: '関西地方', Hokuriku: '北陸地方', Chugoku: '中国地方' };
const SIGHT = {
  'the Nebuta festival': 'ねぶた祭', 'Asahiyama Zoo': '旭山動物園', 'Sensō-ji': '浅草寺', 'Eihei-ji': '永平寺', 'Lake Ashi': '芦ノ湖',
  'Himeji Castle': '姫路城', 'the Peace Memorial Park': '平和記念公園', Sakurajima: '桜島', 'Kenroku-en': '兼六園', 'Mount Fuji': '富士山',
  'the Kumano Kodo': '熊野古道', 'Kumamoto Castle': '熊本城', 'the Bikan district': '美観地区', 'Matsue Castle': '松江城',
  'Matsumoto Castle': '松本城', Kairakuen: '偕楽園', 'Zenkō-ji': '善光寺', 'Nagoya Castle': '名古屋城', 'Tōshō-gū': '東照宮',
  Korakuen: '後楽園', 'Matsushima Bay': '松島', 'Wakayama Castle': '和歌山城'
};
const TAG = {
  onsen: '温泉地', castle: '城下町', port: '港町', city: '都市', hub: '主要な鉄道の結節点', airport: '空港の最寄り駅', mountain: '山あいのリゾート',
  historic: '歴史ある町', gateway: '地域の玄関口', snow: '雪国の町', coast: '海辺の町', themepark: 'テーマパークのある町'
};
const OPERATOR = { Tobu: '東武鉄道', Odakyu: '小田急電鉄' };
module.exports = { CITY, TRAIN, REGION, SIGHT, TAG, OPERATOR };
