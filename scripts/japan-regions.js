/**
 * Región de cada ciudad de las rutas de Japón (por clave de ciudad, la misma de generate-routes-japan.js).
 * Una ruta se agrupa por la región de su ciudad de salida. Lo usa generate-rutas-hub.js para el índice /xx/rutas/.
 */
const REGIONS = [
  { key: 'hokkaido', name: { en: 'Hokkaido', es: 'Hokkaido', fr: 'Hokkaidō', it: 'Hokkaido', ja: '北海道' },
    cities: 'asahikawa chitose hakodate kushiro newchitoseairport noboribetsu obihiro otaru sapporo shinhakodatehokuto shinsapporo tomakomai wakkanai' },
  { key: 'tohoku', name: { en: 'Tohoku', es: 'Tohoku', fr: 'Tōhoku', it: 'Tohoku', ja: '東北' },
    cities: 'akita aomori fukushima hachinohe hirosaki ichinoseki koriyama morioka sendai shinhanamaki yamagata' },
  { key: 'kanto', name: { en: 'Tokyo and Kanto', es: 'Tokio y Kanto', fr: 'Tokyo et Kantō', it: 'Tokyo e Kanto', ja: '東京・関東' },
    cities: 'asakusa mito narita naritaairport nikko kinugawaonsen nasushiobara shinagawa shinjuku shinyokohama takasaki tokyo utsunomiya yokohama odawara hakone kawaguchiko otsuki' },
  { key: 'chubu', name: { en: 'Chubu (Nagoya, Alps, Hokuriku)', es: 'Chubu (Nagoya, Alpes, Hokuriku)', fr: 'Chūbu (Nagoya, Alpes, Hokuriku)', it: 'Chubu (Nagoya, Alpi, Hokuriku)', ja: '中部・北陸・甲信越' },
    cities: 'atami ito mishima shinfuji shizuoka hamamatsu toyohashi nagoya gifu gero takayama hidafurukawa matsumoto nagano ueda karuizawa kofu niigata nagaoka joetsumyoko murakami toyama kanazawa kagaonsen komatsu nanao fukui tsuruga' },
  { key: 'kansai', name: { en: 'Kansai (Osaka, Kyoto)', es: 'Kansai (Osaka, Kioto)', fr: 'Kansai (Osaka, Kyoto)', it: 'Kansai (Osaka, Kyoto)', ja: '関西' },
    cities: 'kyoto osaka tennoji kansaiairport kobe himeji wakayama kiitanabe shirahama kinosaki toyooka fukuchiyama maibara' },
  { key: 'chugoku', name: { en: 'Chugoku (Hiroshima, Okayama)', es: 'Chugoku (Hiroshima, Okayama)', fr: 'Chūgoku (Hiroshima, Okayama)', it: 'Chugoku (Hiroshima, Okayama)', ja: '中国地方' },
    cities: 'okayama kurashiki hiroshima fukuyama onomichi shinyamaguchi yonago matsue' },
  { key: 'kyushu', name: { en: 'Kyushu', es: 'Kyushu', fr: 'Kyūshū', it: 'Kyushu', ja: '九州' },
    cities: 'fukuoka kokura kumamoto kagoshima beppu oita yufuin hita kurume nakatsu saga takeoonsen huistenbosch' }
].map(r => Object.assign(r, { cities: new Set(r.cities.split(' ')) }));

const regionOf = cityKey => REGIONS.find(r => r.cities.has(cityKey)) || null;

module.exports = { REGIONS, regionOf };
