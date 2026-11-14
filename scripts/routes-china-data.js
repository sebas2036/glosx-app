/**
 * Rutas de China (fase 5, 14-nov-2026). Duración más rápida, trenes del día, primera y última salida
 * y estaciones: búsqueda real en Klook (rails-35, Mainland China) para el 27-nov-2026, consultada el
 * 13-nov-2026 (scripts/china-klook.json). Sin precios. Texto propio por ruta: highlight + tip.
 */
const DATA = require('./china-klook.json').routes;

const CITY = {
  beijing: { en: 'Beijing', es: 'Pekín', fr: 'Pékin', it: 'Pechino', ja: '北京' },
  shanghai: { en: 'Shanghai', es: 'Shanghái', fr: 'Shanghai', it: 'Shanghai', ja: '上海' },
  hangzhou: { en: 'Hangzhou', es: 'Hangzhou', fr: 'Hangzhou', it: 'Hangzhou', ja: '杭州' },
  suzhou: { en: 'Suzhou', es: 'Suzhou', fr: 'Suzhou', it: 'Suzhou', ja: '蘇州' },
  nanjing: { en: 'Nanjing', es: 'Nankín', fr: 'Nankin', it: 'Nanchino', ja: '南京' },
  xian: { en: "Xi'an", es: "Xi'an", fr: "Xi'an", it: "Xi'an", ja: '西安' },
  tianjin: { en: 'Tianjin', es: 'Tianjin', fr: 'Tianjin', it: 'Tianjin', ja: '天津' },
  guangzhou: { en: 'Guangzhou', es: 'Cantón', fr: 'Canton', it: 'Canton', ja: '広州' },
  shenzhen: { en: 'Shenzhen', es: 'Shenzhen', fr: 'Shenzhen', it: 'Shenzhen', ja: '深圳' },
  hongkong: { en: 'Hong Kong', es: 'Hong Kong', fr: 'Hong Kong', it: 'Hong Kong', ja: '香港' },
  chengdu: { en: 'Chengdu', es: 'Chengdu', fr: 'Chengdu', it: 'Chengdu', ja: '成都' },
  chongqing: { en: 'Chongqing', es: 'Chongqing', fr: 'Chongqing', it: 'Chongqing', ja: '重慶' },
  guilin: { en: 'Guilin', es: 'Guilin', fr: 'Guilin', it: 'Guilin', ja: '桂林' },
  huangshan: { en: 'Huangshan', es: 'Huangshan', fr: 'Huangshan', it: 'Huangshan', ja: '黄山' }
};
// nombres de estación en japonés (en los demás idiomas se usa el nombre oficial en inglés)
const STATION_JA = {
  'Beijing South': '北京南駅', 'Shanghai Hongqiao': '上海虹橋駅', 'Hangzhou East': '杭州東駅', 'Suzhou North': '蘇州北駅',
  'Nanjing South': '南京南駅', 'Beijing West': '北京西駅', "Xi'an North": '西安北駅', 'Tianjin': '天津駅',
  'Guangzhou South': '広州南駅', 'Shenzhen North': '深圳北駅', 'Shenzhen North / Futian': '深圳北駅・福田駅',
  'Hong Kong West Kowloon': '香港西九龍駅', 'Chengdu East': '成都東駅', 'Chongqing West': '重慶西駅',
  'Guilin West': '桂林西駅', 'Hangzhou West': '杭州西駅', 'Huangshan North': '黄山北駅'
};

// [slug, from, to, foto Pexels]
const LIST = [
  ['beijing-shanghai', 'beijing', 'shanghai', 32062049],
  ['shanghai-hangzhou', 'shanghai', 'hangzhou', 7532194],
  ['shanghai-suzhou', 'shanghai', 'suzhou', 36466099],
  ['shanghai-nanjing', 'shanghai', 'nanjing', 20827663],
  ['beijing-xian', 'beijing', 'xian', 28678711],
  ['beijing-tianjin', 'beijing', 'tianjin', 23931765],
  ['guangzhou-shenzhen', 'guangzhou', 'shenzhen', 39886345],
  ['shenzhen-hong-kong', 'shenzhen', 'hongkong', 26970225],
  ['guangzhou-hong-kong', 'guangzhou', 'hongkong', 35886110],
  ['chengdu-chongqing', 'chengdu', 'chongqing', 32599840],
  ['xian-chengdu', 'xian', 'chengdu', 35557996],
  ['guangzhou-guilin', 'guangzhou', 'guilin', 36535024],
  ['hangzhou-huangshan', 'hangzhou', 'huangshan', 31582902]
];
const KEY = { 'shenzhen-hong-kong': 'shenzhen-hongkong', 'guangzhou-hong-kong': 'guangzhou-hongkong' };

// Una frase propia por ruta (va detrás de la duración en la entradilla)
const HIGHLIGHT = {
  'beijing-shanghai': { en: 'It is China’s busiest intercity line, linking the capital with its largest city through Tianjin, Jinan and Nanjing.', es: 'Es la línea interurbana más concurrida de China: une la capital con su ciudad más grande pasando por Tianjin, Jinan y Nankín.', fr: 'C’est la ligne interurbaine la plus fréquentée de Chine : elle relie la capitale à sa plus grande ville en passant par Tianjin, Jinan et Nankin.', it: 'È la linea intercity più trafficata della Cina: collega la capitale con la sua città più grande passando per Tianjin, Jinan e Nanchino.', ja: '中国でいちばん利用者の多い都市間路線で、首都と最大都市を天津、済南、南京経由で結びます。' },
  'shanghai-hangzhou': { en: 'Hangzhou, home of West Lake, is one of the most popular trips from Shanghai and easy to do as a day trip.', es: 'Hangzhou, la ciudad del Lago del Oeste, es una de las escapadas más populares desde Shanghái y se puede hacer en el día.', fr: 'Hangzhou, la ville du lac de l’Ouest, est l’une des escapades les plus prisées depuis Shanghai et se fait facilement dans la journée.', it: 'Hangzhou, la città del Lago dell’Ovest, è una delle gite più popolari da Shanghai e si può fare in giornata.', ja: '西湖のある杭州は、上海から人気の行き先で、日帰りでも十分に楽しめます。' },
  'shanghai-suzhou': { en: 'Suzhou, known for its classical gardens and canals, is so close that many visitors go for the day.', es: 'Suzhou, famosa por sus jardines clásicos y sus canales, está tan cerca que muchos viajeros la visitan en el día.', fr: 'Suzhou, célèbre pour ses jardins classiques et ses canaux, est si proche que beaucoup de voyageurs y vont pour la journée.', it: 'Suzhou, famosa per i giardini classici e i canali, è così vicina che molti la visitano in giornata.', ja: '古典庭園と運河で知られる蘇州はとても近く、日帰りで訪れる人が多い街です。' },
  'shanghai-nanjing': { en: 'Nanjing, a former capital of China on the Yangtze, is one of the most frequent connections from Shanghai.', es: 'Nankín, antigua capital de China a orillas del Yangtsé, es una de las conexiones más frecuentes desde Shanghái.', fr: 'Nankin, ancienne capitale de la Chine au bord du Yangtsé, est l’une des liaisons les plus fréquentes depuis Shanghai.', it: 'Nanchino, antica capitale della Cina sullo Yangtze, è uno dei collegamenti più frequenti da Shanghai.', ja: '長江沿いのかつての都・南京は、上海から特に本数の多い行き先です。' },
  'beijing-xian': { en: 'Xi’an, the old imperial capital and home of the Terracotta Army, is a classic stop after Beijing.', es: 'Xi’an, la antigua capital imperial y hogar de los Guerreros de Terracota, es una parada clásica después de Pekín.', fr: 'Xi’an, ancienne capitale impériale et ville de l’Armée de terre cuite, est une étape classique après Pékin.', it: 'Xi’an, antica capitale imperiale e sede dell’Esercito di terracotta, è una tappa classica dopo Pechino.', ja: '兵馬俑で知られる古都・西安は、北京のあとに訪れる定番の街です。' },
  'beijing-tianjin': { en: 'Tianjin, a port city with old European-style quarters, is close enough to Beijing for a day trip.', es: 'Tianjin, ciudad portuaria con barrios de estilo europeo, está lo bastante cerca de Pekín para ir y volver en el día.', fr: 'Tianjin, ville portuaire aux quartiers de style européen, est assez proche de Pékin pour un aller-retour dans la journée.', it: 'Tianjin, città portuale con quartieri in stile europeo, è abbastanza vicina a Pechino per una gita in giornata.', ja: '洋風の街並みが残る港町・天津は、北京から日帰りできる近さです。' },
  'guangzhou-shenzhen': { en: 'The two great cities of the Pearl River Delta are linked by trains throughout the day.', es: 'Las dos grandes ciudades del delta del río Perla están unidas por trenes a lo largo de todo el día.', fr: 'Les deux grandes villes du delta de la rivière des Perles sont reliées par des trains tout au long de la journée.', it: 'Le due grandi città del delta del Fiume delle Perle sono collegate da treni per tutto il giorno.', ja: '珠江デルタの二大都市は、一日中ひっきりなしに列車で結ばれています。' },
  'shenzhen-hong-kong': { en: 'The Express Rail Link takes you from Shenzhen to West Kowloon, close to the centre of Hong Kong.', es: 'El Express Rail Link te lleva de Shenzhen a West Kowloon, cerca del centro de Hong Kong.', fr: 'L’Express Rail Link vous mène de Shenzhen à West Kowloon, près du centre de Hong Kong.', it: 'L’Express Rail Link ti porta da Shenzhen a West Kowloon, vicino al centro di Hong Kong.', ja: '高速鉄道（広深港高速鉄道）で、深圳から香港中心部に近い西九龍駅まで行けます。' },
  'guangzhou-hong-kong': { en: 'The Express Rail Link runs direct from Guangzhou South to West Kowloon in Hong Kong.', es: 'El Express Rail Link va directo de Guangzhou South a West Kowloon, en Hong Kong.', fr: 'L’Express Rail Link relie directement Guangzhou South à West Kowloon, à Hong Kong.', it: 'L’Express Rail Link va diretto da Guangzhou South a West Kowloon, a Hong Kong.', ja: '広深港高速鉄道が、広州南駅から香港の西九龍駅まで直通で走ります。' },
  'chengdu-chongqing': { en: 'Two great cities of southwest China, both famous for spicy Sichuan-style food, about an hour apart.', es: 'Dos grandes ciudades del suroeste de China, famosas por su comida picante al estilo de Sichuan, a una hora de distancia.', fr: 'Deux grandes villes du sud-ouest de la Chine, réputées pour leur cuisine épicée de style sichuanais, à environ une heure l’une de l’autre.', it: 'Due grandi città della Cina sud-occidentale, famose per la cucina piccante in stile Sichuan, a circa un’ora di distanza.', ja: '辛い四川料理で知られる中国南西部の二大都市が、約1時間で結ばれています。' },
  'xian-chengdu': { en: 'The high-speed line crosses the Qinling Mountains, linking the city of the Terracotta Army with the home of the giant pandas.', es: 'La línea de alta velocidad cruza los montes Qinling y une la ciudad de los Guerreros de Terracota con la tierra de los pandas gigantes.', fr: 'La ligne à grande vitesse traverse les monts Qinling et relie la ville de l’Armée de terre cuite au pays des pandas géants.', it: 'La linea ad alta velocità attraversa i monti Qinling e collega la città dell’Esercito di terracotta con la terra dei panda giganti.', ja: '高速鉄道が秦嶺山脈を越え、兵馬俑の街とジャイアントパンダの街を結びます。' },
  'guangzhou-guilin': { en: 'Guilin is the gateway to the karst peaks of the Li River and to Yangshuo.', es: 'Guilin es la puerta a los picos kársticos del río Li y a Yangshuo.', fr: 'Guilin est la porte des pics karstiques de la rivière Li et de Yangshuo.', it: 'Guilin è la porta delle vette carsiche del fiume Li e di Yangshuo.', ja: '桂林は、漓江のカルストの峰々と陽朔への玄関口です。' },
  'hangzhou-huangshan': { en: 'Huangshan, the Yellow Mountain, is famous for its granite peaks, pines and seas of cloud.', es: 'Huangshan, la Montaña Amarilla, es famosa por sus picos de granito, sus pinos y sus mares de nubes.', fr: 'Huangshan, la Montagne Jaune, est célèbre pour ses pics de granit, ses pins et ses mers de nuages.', it: 'Huangshan, la Montagna Gialla, è famosa per le vette di granito, i pini e i mari di nuvole.', ja: '黄山は、花崗岩の峰と松、雲海で知られる名山です。' }
};

// Un consejo propio por ruta
const TIP = {
  'beijing-shanghai': { en: 'Beijing South and Shanghai Hongqiao are both on the metro, so you can reach the city centre without a taxi.', es: 'Beijing South y Shanghai Hongqiao tienen metro, así que puedes llegar al centro sin taxi.', fr: 'Beijing South et Shanghai Hongqiao sont desservies par le métro : pas besoin de taxi pour rejoindre le centre.', it: 'Beijing South e Shanghai Hongqiao sono servite dalla metropolitana, quindi puoi raggiungere il centro senza taxi.', ja: '北京南駅も上海虹橋駅も地下鉄に直結しているので、タクシーなしで市内へ出られます。' },
  'shanghai-hangzhou': { en: 'Some trains leave from Shanghai Station or arrive at other Hangzhou stations: check the station on your ticket.', es: 'Algunos trenes salen de la estación de Shanghái o llegan a otras estaciones de Hangzhou: revisa la estación en tu billete.', fr: 'Certains trains partent de la gare de Shanghai ou arrivent dans d’autres gares de Hangzhou : vérifiez la gare sur votre billet.', it: 'Alcuni treni partono dalla stazione di Shanghai o arrivano in altre stazioni di Hangzhou: controlla la stazione sul biglietto.', ja: '上海駅発や、杭州の別の駅に着く列車もあります。きっぷの駅名を確認しましょう。' },
  'shanghai-suzhou': { en: 'Suzhou has more than one station: Suzhou North is on the high-speed line, while Suzhou Station is closer to the old town.', es: 'Suzhou tiene más de una estación: Suzhou North está en la línea de alta velocidad y la estación de Suzhou queda más cerca del casco antiguo.', fr: 'Suzhou compte plusieurs gares : Suzhou North est sur la ligne à grande vitesse, tandis que la gare de Suzhou est plus proche de la vieille ville.', it: 'Suzhou ha più di una stazione: Suzhou North è sulla linea ad alta velocità, mentre la stazione di Suzhou è più vicina al centro storico.', ja: '蘇州には駅が複数あります。高速線の蘇州北駅に対し、蘇州駅のほうが旧市街に近い駅です。' },
  'shanghai-nanjing': { en: 'Most fast trains use Nanjing South, which is linked to the city centre by metro.', es: 'La mayoría de los trenes rápidos usan Nanjing South, conectada con el centro por metro.', fr: 'La plupart des trains rapides desservent Nanjing South, reliée au centre par le métro.', it: 'La maggior parte dei treni veloci usa Nanjing South, collegata al centro dalla metropolitana.', ja: '速い列車の多くは南京南駅に発着し、市中心部へは地下鉄で行けます。' },
  'beijing-xian': { en: 'From Xi’an North the metro takes you into the city; the Terracotta Army is a separate trip east of the city.', es: 'Desde Xi’an North el metro te lleva a la ciudad; los Guerreros de Terracota son una excursión aparte al este de la ciudad.', fr: 'Depuis Xi’an North, le métro vous mène en ville ; l’Armée de terre cuite est une excursion à part, à l’est de la ville.', it: 'Da Xi’an North la metropolitana porta in città; l’Esercito di terracotta è un’escursione a parte a est della città.', ja: '西安北駅からは地下鉄で市内へ。兵馬俑は市の東にあり、別に足を延ばす必要があります。' },
  'beijing-tianjin': { en: 'Tianjin Station is close to the city centre and the Haihe riverside.', es: 'La estación de Tianjin está cerca del centro y de la ribera del río Haihe.', fr: 'La gare de Tianjin est proche du centre et des berges du Haihe.', it: 'La stazione di Tianjin è vicina al centro e al lungofiume dello Haihe.', ja: '天津駅は市中心部や海河の河岸に近い便利な駅です。' },
  'guangzhou-shenzhen': { en: 'Shenzhen North is on the metro, which takes you to Futian and the rest of the city.', es: 'Shenzhen North tiene metro, que te lleva a Futian y al resto de la ciudad.', fr: 'Shenzhen North est desservie par le métro, qui mène à Futian et au reste de la ville.', it: 'Shenzhen North è servita dalla metropolitana, che porta a Futian e al resto della città.', ja: '深圳北駅は地下鉄に接続し、福田など市内各地へ移動できます。' },
  'shenzhen-hong-kong': { en: 'Border checks for mainland China and Hong Kong are both done inside West Kowloon station, so allow extra time and carry your passport.', es: 'Los controles fronterizos de China continental y de Hong Kong se hacen dentro de la estación de West Kowloon: calcula tiempo extra y lleva el pasaporte.', fr: 'Les contrôles frontaliers de la Chine continentale et de Hong Kong ont lieu dans la gare de West Kowloon : prévoyez du temps et prenez votre passeport.', it: 'I controlli di frontiera della Cina continentale e di Hong Kong si fanno nella stazione di West Kowloon: calcola tempo in più e porta il passaporto.', ja: '中国本土と香港の出入境審査はどちらも西九龍駅の構内で行われます。時間に余裕を持ち、パスポートを持参してください。' },
  'guangzhou-hong-kong': { en: 'Leave time for the joint border checks at West Kowloon, and carry your passport and any visa or entry permit you need.', es: 'Deja tiempo para los controles fronterizos conjuntos de West Kowloon y lleva el pasaporte y el visado o permiso de entrada que necesites.', fr: 'Prévoyez du temps pour les contrôles frontaliers communs de West Kowloon et prenez votre passeport ainsi que le visa ou permis d’entrée nécessaire.', it: 'Lascia tempo per i controlli di frontiera congiunti di West Kowloon e porta il passaporto e l’eventuale visto o permesso d’ingresso.', ja: '西九龍駅の出入境審査に時間を見込み、パスポートと必要なビザや入境許可証を持参しましょう。' },
  'chengdu-chongqing': { en: 'Chengdu East and Chongqing West are both connected to the metro.', es: 'Chengdu East y Chongqing West tienen conexión con el metro.', fr: 'Chengdu East et Chongqing West sont toutes deux reliées au métro.', it: 'Chengdu East e Chongqing West sono entrambe collegate alla metropolitana.', ja: '成都東駅も重慶西駅も地下鉄に接続しています。' },
  'xian-chengdu': { en: 'Much of the line runs through tunnels under the mountains, so the views come in short glimpses.', es: 'Gran parte de la línea va por túneles bajo las montañas, así que el paisaje se ve en tramos cortos.', fr: 'Une grande partie de la ligne passe en tunnel sous les montagnes : le paysage n’apparaît que par moments.', it: 'Gran parte della linea corre in galleria sotto le montagne, quindi il paesaggio si vede a tratti.', ja: '路線の多くは山を貫くトンネルなので、車窓の景色は途切れ途切れです。' },
  'guangzhou-guilin': { en: 'For Yangshuo, many travellers continue by bus from Guilin or take a train to Yangshuo station.', es: 'Para ir a Yangshuo, muchos viajeros siguen en autobús desde Guilin o toman un tren hasta la estación de Yangshuo.', fr: 'Pour Yangshuo, beaucoup de voyageurs continuent en bus depuis Guilin ou prennent un train jusqu’à la gare de Yangshuo.', it: 'Per Yangshuo, molti viaggiatori proseguono in autobus da Guilin o prendono un treno fino alla stazione di Yangshuo.', ja: '陽朔へは、桂林からバスで向かうか、列車で陽朔駅まで行く旅行者が多くいます。' },
  'hangzhou-huangshan': { en: 'Huangshan North station is a bus ride from the mountain’s scenic area, so plan that leg before you go.', es: 'La estación de Huangshan North queda a un trayecto en autobús del área escénica de la montaña: planifica ese tramo antes de ir.', fr: 'La gare de Huangshan North est à un trajet en bus du site de la montagne : prévoyez ce tronçon avant de partir.', it: 'La stazione di Huangshan North dista un tragitto in autobus dall’area panoramica della montagna: pianifica quel tratto prima di partire.', ja: '黄山北駅から山の景勝地まではバスでの移動になります。出発前にその区間も計画しておきましょう。' }
};

module.exports = { DATA, CITY, STATION_JA, LIST, KEY, HIGHLIGHT, TIP };
