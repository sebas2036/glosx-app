/*
 * Modo EE.\u00a0UU. de la portada de glosx.app (27-nov-2026).
 * Funciona como Europa (planificador con reserva por Omio): cambia las listas que ya usa el buscador
 * (window._GLOSX_CITIES y window.GLOSX_ROUTE_PAGES) por las de EE.\u00a0UU. y las devuelve al salir.
 * Las piezas de Europa no se tocan: se marcan .no-us y al lado van sus versiones .us-only
 * (CSS en home-redesign.css). Datos: GTFS oficial de Amtrak, Brightline y Gold Runner,
 * generados con scripts/generate-us-home.py (no editar a mano el bloque US_DATA).
 */
(function () {
  'use strict';

  var D = /*US_DATA*/{"cities":[{"s":"albany","en":"Albany","st":"NY","img":"/assets/img/ciudades/albany.jpg","o":"albany","n":{"ja":"オールバニ","zh":"奥尔巴尼"}},{"s":"albuquerque","en":"Albuquerque","st":"NM","img":"/assets/img/ciudades/albuquerque.jpg","o":"albuquerque","n":{"ja":"アルバカーキ","zh":"阿尔伯克基"}},{"s":"alexandria","en":"Alexandria","st":"VA","img":"/assets/img/ciudades/alexandria.jpg","o":"alexandria","n":{"ja":"アレクサンドリア","zh":"亚历山德里亚"}},{"s":"anaheim","en":"Anaheim","st":"CA","img":"/assets/img/ciudades/anaheim.webp","o":"anaheim","n":{"ja":"アナハイム","zh":"阿纳海姆"}},{"s":"ann-arbor","en":"Ann Arbor","st":"MI","img":"/assets/img/ciudades/ann-arbor.webp","o":"ann arbor","n":{"ja":"アナーバー","zh":"安娜堡"}},{"s":"atlanta","en":"Atlanta","st":"GA","img":"/assets/img/ciudades/atlanta.jpg","o":"atlanta","n":{"ja":"アトランタ","zh":"亚特兰大"}},{"s":"austin","en":"Austin","st":"TX","img":"/assets/img/ciudades/austin.jpg","o":"austin","n":{"ja":"オースティン","zh":"奥斯汀"}},{"s":"aventura","en":"Aventura","st":"FL","img":"/assets/img/ciudades/aventura.webp","o":"aventura","n":{"ja":"アベンチュラ","zh":"阿文图拉"}},{"s":"bakersfield","en":"Bakersfield","st":"CA","img":"/assets/img/ciudades/bakersfield.webp","o":"bakersfield","n":{"ja":"ベーカーズフィールド","zh":"贝克斯菲尔德"}},{"s":"baltimore","en":"Baltimore","st":"MD","img":"/assets/img/ciudades/baltimore.webp","o":"baltimore","n":{"ja":"ボルチモア","zh":"巴尔的摩"}},{"s":"bloomington-normal","en":"Bloomington-Normal","st":"IL","img":null,"o":"bloomington","n":{"ja":"ブルーミントン＝ノーマル","zh":"布卢明顿-诺默尔"}},{"s":"boca-raton","en":"Boca Raton","st":"FL","img":"/assets/img/ciudades/boca-raton.webp","o":"boca raton","n":{"ja":"ボカラトン","zh":"博卡拉顿"}},{"s":"boston","en":"Boston","st":"MA","img":"/assets/img/ciudades/boston.webp","o":"boston","n":{"ja":"ボストン","zh":"波士顿"}},{"s":"bridgeport","en":"Bridgeport","st":"CT","img":"/assets/img/ciudades/bridgeport.jpg","o":"bridgeport","n":{"ja":"ブリッジポート","zh":"布里奇波特"}},{"s":"buffalo","en":"Buffalo","st":"NY","img":"/assets/img/ciudades/buffalo.jpg","o":"buffalo","n":{"ja":"バッファロー","zh":"布法罗"}},{"s":"champaign","en":"Champaign","st":"IL","img":null,"o":"champaign","n":{"ja":"シャンペーン","zh":"香槟"}},{"s":"charleston","en":"Charleston","st":"SC","img":"/assets/img/ciudades/charleston.jpg","o":"charleston","n":{"ja":"チャールストン","zh":"查尔斯顿"}},{"s":"charlotte","en":"Charlotte","st":"NC","img":"/assets/img/ciudades/charlotte.webp","o":"charlotte","n":{"ja":"シャーロット","zh":"夏洛特"}},{"s":"charlottesville","en":"Charlottesville","st":"VA","img":"/assets/img/ciudades/charlottesville.jpg","o":"charlottesville","n":{"ja":"シャーロッツビル","zh":"夏洛茨维尔"}},{"s":"chicago","en":"Chicago","st":"IL","img":"/assets/img/ciudades/chicago.webp","o":"chicago","n":{"ja":"シカゴ","zh":"芝加哥"}},{"s":"dallas","en":"Dallas","st":"TX","img":"/assets/img/ciudades/dallas.jpg","o":"dallas","n":{"ja":"ダラス","zh":"达拉斯"}},{"s":"davis","en":"Davis","st":"CA","img":"/assets/img/ciudades/davis.webp","o":"davis","n":{"ja":"デービス","zh":"戴维斯"}},{"s":"denver","en":"Denver","st":"CO","img":"/assets/img/ciudades/denver.webp","o":"denver","n":{"ja":"デンバー","zh":"丹佛"}},{"s":"detroit","en":"Detroit","st":"MI","img":"/assets/img/ciudades/detroit.webp","o":"detroit","n":{"ja":"デトロイト","zh":"底特律"}},{"s":"emeryville","en":"Emeryville","st":"CA","img":null,"o":"emeryville","n":{"ja":"エメリービル","zh":"埃默里维尔"}},{"s":"flagstaff","en":"Flagstaff","st":"AZ","img":"/assets/img/ciudades/flagstaff.jpg","o":"flagstaff","n":{"ja":"フラッグスタッフ","zh":"弗拉格斯塔夫"}},{"s":"fort-lauderdale","en":"Fort Lauderdale","st":"FL","img":"/assets/img/ciudades/fort-lauderdale.webp","o":"fort lauderdale","n":{"ja":"フォートローダーデール","zh":"劳德代尔堡"}},{"s":"fort-worth","en":"Fort Worth","st":"TX","img":"/assets/img/ciudades/fort-worth.jpg","o":"fort worth","n":{"ja":"フォートワース","zh":"沃思堡"}},{"s":"fredericksburg","en":"Fredericksburg","st":"VA","img":null,"o":"fredericksburg","n":{"ja":"フレデリックスバーグ","zh":"弗雷德里克斯堡"}},{"s":"fresno","en":"Fresno","st":"CA","img":"/assets/img/ciudades/fresno.jpg","o":"fresno","n":{"ja":"フレズノ","zh":"弗雷斯诺"}},{"s":"fullerton","en":"Fullerton","st":"CA","img":null,"o":"fullerton","n":{"ja":"フラートン","zh":"富勒顿"}},{"s":"grand-rapids","en":"Grand Rapids","st":"MI","img":"/assets/img/ciudades/grand-rapids.jpg","o":"grand rapids","n":{"ja":"グランドラピッズ","zh":"大急流城"}},{"s":"harrisburg","en":"Harrisburg","st":"PA","img":null,"o":"harrisburg","n":{"ja":"ハリスバーグ","zh":"哈里斯堡"}},{"s":"hartford","en":"Hartford","st":"CT","img":"/assets/img/ciudades/hartford.jpg","o":"hartford","n":{"ja":"ハートフォード","zh":"哈特福德"}},{"s":"jacksonville","en":"Jacksonville","st":"FL","img":"/assets/img/ciudades/jacksonville.webp","o":"jacksonville","n":{"ja":"ジャクソンビル","zh":"杰克逊维尔"}},{"s":"kalamazoo","en":"Kalamazoo","st":"MI","img":"/assets/img/ciudades/kalamazoo.jpg","o":"kalamazoo","n":{"ja":"カラマズー","zh":"卡拉马祖"}},{"s":"kansas-city","en":"Kansas City","st":"MO","img":"/assets/img/ciudades/kansas-city.webp","o":"kansas city","n":{"ja":"カンザスシティ","zh":"堪萨斯城"}},{"s":"lancaster","en":"Lancaster","st":"PA","img":"/assets/img/ciudades/lancaster.jpg","o":"lancaster","n":{"ja":"ランカスター","zh":"兰开斯特"}},{"s":"los-angeles","en":"Los Angeles","st":"CA","img":"/assets/img/ciudades/los-angeles.webp","o":"los angeles","n":{"es":"Los Ángeles","ja":"ロサンゼルス","zh":"洛杉矶"}},{"s":"lynchburg","en":"Lynchburg","st":"VA","img":"/assets/img/ciudades/lynchburg.jpg","o":"lynchburg","n":{"ja":"リンチバーグ","zh":"林奇堡"}},{"s":"martinez","en":"Martinez","st":"CA","img":"/assets/img/ciudades/martinez.jpg","o":"martinez","n":{"ja":"マルティネス","zh":"马丁内斯"}},{"s":"memphis","en":"Memphis","st":"TN","img":"/assets/img/ciudades/memphis.jpg","o":"memphis","n":{"ja":"メンフィス","zh":"孟菲斯"}},{"s":"miami","en":"Miami","st":"FL","img":"/assets/img/ciudades/miami.webp","o":"miami","n":{"ja":"マイアミ","zh":"迈阿密"}},{"s":"milwaukee","en":"Milwaukee","st":"WI","img":"/assets/img/ciudades/milwaukee.webp","o":"milwaukee","n":{"ja":"ミルウォーキー","zh":"密尔沃基"}},{"s":"montreal","en":"Montreal","st":"QC","img":"/assets/img/ciudades/montreal.jpg","o":"montreal","n":{"fr":"Montréal","it":"Montréal","ja":"モントリオール","zh":"蒙特利尔"}},{"s":"new-haven","en":"New Haven","st":"CT","img":"/assets/img/ciudades/new-haven.webp","o":"new haven","n":{"ja":"ニューヘイブン","zh":"纽黑文"}},{"s":"new-london","en":"New London","st":"CT","img":"/assets/img/ciudades/new-london.jpg","o":"new london","n":{"ja":"ニューロンドン","zh":"新伦敦"}},{"s":"new-orleans","en":"New Orleans","st":"LA","img":"/assets/img/ciudades/new-orleans.jpg","o":"new orleans","n":{"es":"Nueva Orleans","fr":"La Nouvelle-Orléans","pt":"Nova Orleães","ja":"ニューオーリンズ","zh":"新奥尔良"}},{"s":"new-york","en":"New York","st":"NY","img":"/assets/img/ciudades/new-york.webp","o":"new york","n":{"es":"Nueva York","pt":"Nova Iorque","ja":"ニューヨーク","zh":"纽约"}},{"s":"newark","en":"Newark","st":"NJ","img":"/assets/img/ciudades/newark.webp","o":"newark","n":{"ja":"ニューアーク","zh":"纽瓦克"}},{"s":"niagara-falls","en":"Niagara Falls","st":"NY","img":"/assets/img/ciudades/niagara-falls.jpg","o":"niagara falls","n":{"ja":"ナイアガラフォールズ","zh":"尼亚加拉瀑布城"}},{"s":"norfolk","en":"Norfolk","st":"VA","img":"/assets/img/ciudades/norfolk.jpg","o":"norfolk","n":{"ja":"ノーフォーク","zh":"诺福克"}},{"s":"oakland","en":"Oakland","st":"CA","img":"/assets/img/ciudades/oakland.webp","o":"oakland","n":{"ja":"オークランド","zh":"奥克兰"}},{"s":"oceanside","en":"Oceanside","st":"CA","img":"/assets/img/ciudades/oceanside.webp","o":"oceanside","n":{"ja":"オーシャンサイド","zh":"欧申赛德"}},{"s":"oklahoma-city","en":"Oklahoma City","st":"OK","img":"/assets/img/ciudades/oklahoma-city.jpg","o":"oklahoma city","n":{"ja":"オクラホマシティ","zh":"俄克拉何马城"}},{"s":"orlando","en":"Orlando","st":"FL","img":"/assets/img/ciudades/orlando.webp","o":"orlando","n":{"ja":"オーランド","zh":"奥兰多"}},{"s":"oxnard","en":"Oxnard","st":"CA","img":"/assets/img/ciudades/oxnard.jpg","o":"oxnard","n":{"ja":"オックスナード","zh":"奥克斯纳德"}},{"s":"philadelphia","en":"Philadelphia","st":"PA","img":"/assets/img/ciudades/philadelphia.webp","o":"philadelphia","n":{"es":"Filadelfia","fr":"Philadelphie","it":"Filadelfia","pt":"Filadélfia","ja":"フィラデルフィア","zh":"费城"}},{"s":"pittsburgh","en":"Pittsburgh","st":"PA","img":"/assets/img/ciudades/pittsburgh.jpg","o":"pittsburgh","n":{"ja":"ピッツバーグ","zh":"匹兹堡"}},{"s":"portland-maine","en":"Portland, Maine","st":"ME","img":"/assets/img/ciudades/portland-maine.jpg","o":"portland","n":{"es":"Portland (Maine)","fr":"Portland (Maine)","de":"Portland (Maine)","it":"Portland (Maine)","pt":"Portland (Maine)","ja":"ポートランド（メイン州）","zh":"波特兰（缅因州）"}},{"s":"poughkeepsie","en":"Poughkeepsie","st":"NY","img":"/assets/img/ciudades/poughkeepsie.jpg","o":"poughkeepsie","n":{"ja":"ポキプシー","zh":"波基普西"}},{"s":"providence","en":"Providence","st":"RI","img":"/assets/img/ciudades/providence.webp","o":"providence","n":{"ja":"プロビデンス","zh":"普罗维登斯"}},{"s":"raleigh","en":"Raleigh","st":"NC","img":"/assets/img/ciudades/raleigh.jpg","o":"raleigh","n":{"ja":"ローリー","zh":"罗利"}},{"s":"richmond","en":"Richmond","st":"VA","img":"/assets/img/ciudades/richmond.webp","o":"richmond","n":{"ja":"リッチモンド","zh":"里士满"}},{"s":"rochester","en":"Rochester","st":"NY","img":null,"o":"rochester","n":{"ja":"ロチェスター","zh":"罗切斯特"}},{"s":"sacramento","en":"Sacramento","st":"CA","img":"/assets/img/ciudades/sacramento.webp","o":"sacramento","n":{"ja":"サクラメント","zh":"萨克拉门托"}},{"s":"salt-lake-city","en":"Salt Lake City","st":"UT","img":"/assets/img/ciudades/salt-lake-city.jpg","o":"salt lake city","n":{"ja":"ソルトレイクシティ","zh":"盐湖城"}},{"s":"san-antonio","en":"San Antonio","st":"TX","img":"/assets/img/ciudades/san-antonio.jpg","o":"san antonio","n":{"ja":"サンアントニオ","zh":"圣安东尼奥"}},{"s":"san-diego","en":"San Diego","st":"CA","img":"/assets/img/ciudades/san-diego.webp","o":"san diego","n":{"ja":"サンディエゴ","zh":"圣迭戈"}},{"s":"san-jose","en":"San Jose","st":"CA","img":"/assets/img/ciudades/san-jose.webp","o":"san jose","n":{"es":"San José","ja":"サンノゼ","zh":"圣何塞"}},{"s":"san-luis-obispo","en":"San Luis Obispo","st":"CA","img":"/assets/img/ciudades/san-luis-obispo.webp","o":"san luis obispo","n":{"ja":"サンルイスオビスポ","zh":"圣路易斯-奥比斯波"}},{"s":"santa-ana","en":"Santa Ana","st":"CA","img":null,"o":"santa ana","n":{"ja":"サンタアナ","zh":"圣安娜"}},{"s":"santa-barbara","en":"Santa Barbara","st":"CA","img":"/assets/img/ciudades/santa-barbara.webp","o":"santa barbara","n":{"es":"Santa Bárbara","ja":"サンタバーバラ","zh":"圣巴巴拉"}},{"s":"savannah","en":"Savannah","st":"GA","img":"/assets/img/ciudades/savannah.webp","o":"savannah","n":{"ja":"サバンナ","zh":"萨凡纳"}},{"s":"springfield-il","en":"Springfield, Illinois","st":"IL","img":null,"o":"springfield","n":{"es":"Springfield (Illinois)","fr":"Springfield (Illinois)","de":"Springfield (Illinois)","it":"Springfield (Illinois)","pt":"Springfield (Illinois)","ja":"スプリングフィールド（イリノイ州）","zh":"斯普林菲尔德（伊利诺伊州）"}},{"s":"springfield-ma","en":"Springfield, Massachusetts","st":"MA","img":null,"o":"springfield","n":{"es":"Springfield (Massachusetts)","fr":"Springfield (Massachusetts)","de":"Springfield (Massachusetts)","it":"Springfield (Massachusetts)","pt":"Springfield (Massachusetts)","ja":"スプリングフィールド（マサチューセッツ州）","zh":"斯普林菲尔德（马萨诸塞州）"}},{"s":"st-louis","en":"St. Louis","st":"MO","img":"/assets/img/ciudades/st-louis.jpg","o":"st. louis","n":{"es":"San Luis","fr":"Saint-Louis","ja":"セントルイス","zh":"圣路易斯"}},{"s":"st-paul","en":"St. Paul","st":"MN","img":"/assets/img/ciudades/st-paul.webp","o":"st. paul","n":{"es":"Saint Paul","fr":"Saint Paul","it":"Saint Paul","pt":"Saint Paul","ja":"セントポール","zh":"圣保罗"}},{"s":"stamford","en":"Stamford","st":"CT","img":"/assets/img/ciudades/stamford.webp","o":"stamford","n":{"ja":"スタンフォード","zh":"斯坦福德"}},{"s":"syracuse","en":"Syracuse","st":"NY","img":"/assets/img/ciudades/syracuse.jpg","o":"syracuse","n":{"ja":"シラキュース","zh":"锡拉丘兹"}},{"s":"tampa","en":"Tampa","st":"FL","img":"/assets/img/ciudades/tampa.webp","o":"tampa","n":{"ja":"タンパ","zh":"坦帕"}},{"s":"trenton","en":"Trenton","st":"NJ","img":null,"o":"trenton","n":{"ja":"トレントン","zh":"特伦顿"}},{"s":"ventura","en":"Ventura","st":"CA","img":"/assets/img/ciudades/ventura.jpg","o":"ventura","n":{"ja":"ベンチュラ","zh":"文图拉"}},{"s":"washington","en":"Washington","st":"DC","img":"/assets/img/ciudades/washington-dc.webp","o":"washington","n":{"ja":"ワシントンD.C.","zh":"华盛顿"}},{"s":"west-palm-beach","en":"West Palm Beach","st":"FL","img":"/assets/img/ciudades/west-palm-beach.jpg","o":"west palm beach","n":{"ja":"ウェストパームビーチ","zh":"西棕榈滩"}},{"s":"williamsburg","en":"Williamsburg","st":"VA","img":"/assets/img/ciudades/williamsburg.jpg","o":"williamsburg","n":{"ja":"ウィリアムズバーグ","zh":"威廉斯堡"}},{"s":"wilmington","en":"Wilmington","st":"DE","img":"/assets/img/ciudades/wilmington.jpg","o":"wilmington","n":{"ja":"ウィルミントン","zh":"威尔明顿"}}],"routes":{"new-york-philadelphia":["new-york","philadelphia",66,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[59,66,"00:11"],[58,74,"03:25"]],"new-york-washington":["new-york","washington",175,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[44,176,"04:50"],[43,175,"04:50"]],"philadelphia-washington":["philadelphia","washington",96,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[45,103,"04:45"],[44,96,"04:50"]],"new-york-boston":["new-york","boston",221,"Amtrak",["Acela","Northeast Regional"],"ne",[18,227,"05:27"],[18,221,"05:00"]],"boston-philadelphia":["boston","philadelphia",306,"Amtrak",["Acela","Northeast Regional"],"ne",[17,308,"05:00"],[17,312,"03:25"]],"washington-boston":["washington","boston",414,"Amtrak",["Acela","Northeast Regional"],"ne",[16,414,"04:50"],[15,419,"05:00"]],"los-angeles-san-diego":["los-angeles","san-diego",174,"Amtrak",["Pacific Surfliner"],"ca",[13,174,"06:10"],[13,176,"04:01"]],"miami-orlando":["miami","orlando",205,"Brightline",["Mainline"],"fl",[10,209,"05:45"],[10,210,"05:40"]],"new-york-newark":["new-york","newark",13,"Amtrak",["Acela","Carolinian","Crescent","Keystone Service"],"ne",[51,13,"00:11"],[38,17,"00:27"]],"new-york-baltimore":["new-york","baltimore",137,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[41,138,"04:50"],[40,141,"05:25"]],"philadelphia-newark":["philadelphia","newark",51,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[56,55,"03:25"],[55,51,"00:28"]],"washington-newark":["washington","newark",155,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[41,155,"04:50"],[40,160,"05:06"]],"philadelphia-baltimore":["philadelphia","baltimore",62,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[42,65,"04:45"],[41,62,"05:25"]],"washington-baltimore":["washington","baltimore",30,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[41,30,"04:50"],[42,34,"06:04"]],"new-york-stamford":["new-york","stamford",43,"Amtrak",["Acela","Northeast Regional","Vermonter"],"ne",[19,43,"05:27"],[21,48,"07:04"]],"new-york-new-haven":["new-york","new-haven",94,"Amtrak",["Acela","Northeast Regional","Vermonter"],"ne",[19,94,"05:27"],[20,94,"06:12"]],"philadelphia-stamford":["philadelphia","stamford",128,"Amtrak",["Acela","Northeast Regional","Vermonter"],"ne",[18,130,"03:25"],[20,128,"07:04"]],"philadelphia-new-haven":["philadelphia","new-haven",173,"Amtrak",["Acela","Northeast Regional","Vermonter"],"ne",[18,184,"03:25"],[20,173,"06:12"]],"new-york-providence":["new-york","providence",183,"Amtrak",["Acela","Northeast Regional"],"ne",[18,183,"05:27"],[18,186,"05:36"]],"boston-providence":["boston","providence",33,"Amtrak",["Acela","Northeast Regional"],"ne",[18,34,"05:00"],[18,42,"08:40"]],"miami-west-palm-beach":["miami","west-palm-beach",71,"Brightline",["Mainline"],"fl",[18,71,"05:45"],[18,75,"05:50"]],"miami-fort-lauderdale":["miami","fort-lauderdale",33,"Brightline",["Mainline"],"fl",[18,33,"05:45"],[18,38,"06:34"]],"washington-stamford":["washington","stamford",232,"Amtrak",["Acela","Northeast Regional","Vermonter"],"ne",[17,233,"04:50"],[18,240,"07:04"]],"washington-new-haven":["washington","new-haven",282,"Amtrak",["Acela","Northeast Regional","Vermonter"],"ne",[17,285,"05:05"],[18,287,"06:12"]],"philadelphia-providence":["philadelphia","providence",270,"Amtrak",["Acela","Northeast Regional"],"ne",[17,270,"03:25"],[17,270,"05:36"]],"boston-newark":["boston","newark",248,"Amtrak",["Acela","Northeast Regional"],"ne",[17,253,"05:00"],[16,255,"04:48"]],"boston-stamford":["boston","stamford",164,"Amtrak",["Acela","Northeast Regional"],"ne",[18,164,"05:00"],[16,177,"06:14"]],"boston-new-haven":["boston","new-haven",124,"Amtrak",["Acela","Northeast Regional"],"ne",[17,125,"05:00"],[16,130,"07:13"]],"washington-providence":["washington","providence",371,"Amtrak",["Acela","Northeast Regional"],"ne",[16,372,"04:50"],[15,382,"05:36"]],"new-york-albany":["new-york","albany",140,"Amtrak",["Adirondack","Empire Service","Ethan Allen Express","Lake Shore Limited"],"ne",[13,145,"07:15"],[13,140,"05:00"]],"boston-baltimore":["boston","baltimore",379,"Amtrak",["Acela","Northeast Regional"],"ne",[14,379,"05:00"],[13,379,"05:25"]],"los-angeles-anaheim":["los-angeles","anaheim",38,"Amtrak",["Pacific Surfliner"],"ca",[13,38,"06:10"],[13,44,"06:10"]],"san-diego-anaheim":["san-diego","anaheim",127,"Amtrak",["Pacific Surfliner"],"ca",[13,127,"04:01"],[13,135,"06:49"]],"orlando-west-palm-beach":["orlando","west-palm-beach",128,"Brightline",["Mainline"],"fl",[10,128,"05:40"],[10,132,"07:03"]],"fort-lauderdale-orlando":["fort-lauderdale","orlando",165,"Brightline",["Mainline"],"fl",[10,174,"06:20"],[10,169,"05:40"]],"washington-richmond":["washington","richmond",123,"Amtrak",["Carolinian","Floridian","Northeast Regional","Palmetto"],"so",[8,129,"07:20"],[8,140,"03:52"]],"philadelphia-richmond":["philadelphia","richmond",273,"Amtrak",["Carolinian","Northeast Regional","Palmetto","Silver Meteor"],"so",[7,281,"04:45"],[7,290,"03:52"]],"chicago-milwaukee":["chicago","milwaukee",89,"Amtrak",["Borealis","Hiawatha Service"],"mw",[7,89,"06:10"],[7,89,"06:15"]],"los-angeles-santa-barbara":["los-angeles","santa-barbara",137,"Amtrak",["Coast Starlight","Pacific Surfliner"],"ca",[7,137,"05:13"],[7,166,"06:53"]],"washington-orlando":["washington","orlando",1060,"Amtrak",["Floridian","Silver Meteor"],"ld",[2,1060,"13:48"],[2,1069,"12:36"]],"washington-miami":["washington","miami",1400,"Amtrak",["Floridian","Silver Meteor"],"ld",[2,1415,"13:48"],[2,1400,"07:05"]],"new-york-richmond":["new-york","richmond",361,"Amtrak",["Carolinian","Northeast Regional","Palmetto","Silver Meteor"],"so",[7,368,"06:03"],[6,378,"03:52"]],"baltimore-newark":["baltimore","newark",122,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[38,123,"05:25"],[37,123,"05:06"]],"fort-lauderdale-west-palm-beach":["fort-lauderdale","west-palm-beach",35,"Brightline",["Mainline"],"fl",[18,36,"06:20"],[18,35,"05:50"]],"newark-stamford":["newark","stamford",71,"Amtrak",["Acela","Northeast Regional","Vermonter"],"ne",[17,73,"04:48"],[20,72,"07:04"]],"newark-new-haven":["newark","new-haven",117,"Amtrak",["Acela","Northeast Regional","Vermonter"],"ne",[17,124,"04:48"],[20,117,"06:12"]],"stamford-new-haven":["stamford","new-haven",40,"Amtrak",["Acela","Northeast Regional","Vermonter"],"ne",[17,49,"06:14"],[20,43,"06:12"]],"chicago-st-louis":["chicago","st-louis",286,"Amtrak",["Lincoln Service","Lincoln Service Missouri River Runner","Texas Eagle"],"mw",[6,286,"07:15"],[5,295,"04:30"]],"boston-portland-maine":["boston","portland-maine",146,"Amtrak",["Downeaster"],"ne",[5,146,"08:50"],[5,155,"05:15"]],"san-diego-santa-barbara":["san-diego","santa-barbara",344,"Amtrak",["Pacific Surfliner"],"ca",[5,344,"04:01"],[6,363,"06:53"]],"sacramento-emeryville":["sacramento","emeryville",97,"Amtrak",["California Zephyr","Capitol Corridor","Coast Starlight"],"ca",[16,97,"04:20"],[17,103,"05:38"]],"sacramento-oakland":["sacramento","oakland",110,"Amtrak",["Capitol Corridor","Coast Starlight"],"ca",[16,110,"04:20"],[16,114,"05:28"]],"oakland-emeryville":["oakland","emeryville",8,"Amtrak",["Capitol Corridor","Coast Starlight"],"ca",[16,8,"05:28"],[16,8,"06:03"]],"newark-providence":["newark","providence",213,"Amtrak",["Acela","Northeast Regional"],"ne",[16,213,"04:48"],[17,215,"05:36"]],"providence-stamford":["providence","stamford",129,"Amtrak",["Acela","Northeast Regional"],"ne",[18,129,"05:36"],[16,135,"06:14"]],"providence-new-haven":["providence","new-haven",83,"Amtrak",["Acela","Northeast Regional"],"ne",[17,89,"05:36"],[16,83,"07:13"]],"baltimore-stamford":["baltimore","stamford",197,"Amtrak",["Acela","Northeast Regional","Vermonter"],"ne",[14,197,"05:25"],[17,205,"07:04"]],"baltimore-new-haven":["baltimore","new-haven",248,"Amtrak",["Acela","Northeast Regional","Vermonter"],"ne",[14,251,"05:44"],[17,250,"06:12"]],"new-york-buffalo":["new-york","buffalo",480,"Amtrak",["Empire Service","Lake Shore Limited","Maple Leaf"],"ne",[4,481,"07:15"],[4,480,"04:45"]],"baltimore-providence":["baltimore","providence",337,"Amtrak",["Acela","Northeast Regional"],"ne",[13,337,"05:25"],[14,343,"05:36"]],"new-york-orlando":["new-york","orlando",1324,"Amtrak",["Silver Meteor"],"ld",[1,1354,"14:30"],[1,1343,"12:36"]],"new-york-miami":["new-york","miami",1655,"Amtrak",["Silver Meteor"],"ld",[1,1709,"14:30"],[1,1674,"07:05"]],"philadelphia-orlando":["philadelphia","orlando",1232,"Amtrak",["Silver Meteor"],"ld",[1,1249,"16:15"],[1,1249,"12:36"]],"philadelphia-miami":["philadelphia","miami",1563,"Amtrak",["Silver Meteor"],"ld",[1,1604,"16:15"],[1,1580,"07:05"]],"chicago-washington":["chicago","washington",1050,"Amtrak",["Cardinal","Floridian"],"ld",[2,1050,"17:55"],[1,1068,"15:57"]],"new-york-chicago":["new-york","chicago",1172,"Amtrak",["Cardinal","Lake Shore Limited"],"ld",[1,1172,"15:40"],[2,1212,"17:55"]],"chicago-denver":["chicago","denver",1120,"Amtrak",["California Zephyr"],"ld",[1,1136,"14:00"],[1,1120,"18:59"]],"chicago-miami":["chicago","miami",2789,"Amtrak",["Floridian"],"ld",[1,2789,"18:40"],[1,2800,"11:05"]],"chicago-orlando":["chicago","orlando",2305,"Amtrak",["Floridian"],"ld",[1,2305,"18:40"],[1,2335,"18:50"]],"chicago-dallas":["chicago","dallas",1318,"Amtrak",["Texas Eagle"],"ld",[2,1318,"14:10"],[1,1326,"15:43"]],"chicago-los-angeles":["chicago","los-angeles",2629,"Amtrak",["Southwest Chief","Texas Eagle"],"ld",[2,2637,"13:30"],[1,2629,"16:55"]],"new-york-atlanta":["new-york","atlanta",1099,"Amtrak",["Crescent"],"ld",[1,1123,"14:00"],[1,1153,"01:59"]],"new-york-new-orleans":["new-york","new-orleans",1898,"Amtrak",["Crescent"],"ld",[1,1932,"14:00"],[1,1952,"11:40"]],"philadelphia-atlanta":["philadelphia","atlanta",999,"Amtrak",["Crescent"],"ld",[1,1025,"15:38"],[1,1033,"01:59"]],"philadelphia-new-orleans":["philadelphia","new-orleans",1798,"Amtrak",["Crescent"],"ld",[1,1834,"15:38"],[1,1832,"11:40"]],"washington-atlanta":["washington","atlanta",853,"Amtrak",["Crescent"],"ld",[1,853,"18:30"],[1,858,"01:59"]],"washington-new-orleans":["washington","new-orleans",1657,"Amtrak",["Crescent"],"ld",[1,1662,"18:30"],[1,1657,"11:40"]],"atlanta-new-orleans":["atlanta","new-orleans",770,"Amtrak",["Crescent"],"ld",[1,784,"09:08"],[1,770,"11:40"]],"chicago-new-orleans":["chicago","new-orleans",1170,"Amtrak",["City of New Orleans"],"ld",[1,1182,"20:05"],[1,1170,"13:45"]],"chicago-boston":["chicago","boston",1322,"Amtrak",["Lake Shore Limited"],"ld",[1,1322,"21:30"],[1,1342,"12:50"]],"washington-savannah":["washington","savannah",679,"Amtrak",["Floridian","Palmetto","Silver Meteor"],"ld",[3,679,"09:59"],[3,695,"01:41"]],"new-york-niagara-falls":["new-york","niagara-falls",533,"Amtrak",["Empire Service","Maple Leaf"],"ne",[3,548,"07:15"],[3,533,"03:52"]],"chicago-st-paul":["chicago","st-paul",451,"Amtrak",["Borealis","Empire Builder"],"mw",[3,451,"11:10"],[3,452,"08:50"]],"chicago-detroit":["chicago","detroit",306,"Amtrak",["Wolverine"],"mw",[3,320,"06:45"],[3,306,"06:26"]],"new-york-trenton":["new-york","trenton",49,"Amtrak",["Cardinal","Carolinian","Crescent","Keystone Service"],"ne",[33,49,"00:11"],[31,51,"06:27"]],"new-york-wilmington":["new-york","wilmington",87,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[40,90,"04:50"],[39,97,"06:33"]],"philadelphia-trenton":["philadelphia","trenton",25,"Amtrak",["Cardinal","Carolinian","Crescent","Keystone Service"],"ne",[32,25,"05:58"],[33,27,"00:22"]],"philadelphia-wilmington":["philadelphia","wilmington",17,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[41,17,"04:45"],[40,20,"06:33"]],"washington-wilmington":["washington","wilmington",74,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[40,74,"05:05"],[41,82,"05:11"]],"sacramento-san-jose":["sacramento","san-jose",183,"Amtrak",["Capitol Corridor","Coast Starlight"],"ca",[8,189,"04:20"],[8,186,"06:18"]],"san-jose-emeryville":["san-jose","emeryville",74,"Amtrak",["Capitol Corridor","Coast Starlight"],"ca",[8,74,"06:18"],[8,86,"06:03"]],"oakland-san-jose":["oakland","san-jose",64,"Amtrak",["Capitol Corridor","Coast Starlight"],"ca",[8,65,"06:13"],[8,64,"06:18"]],"washington-trenton":["washington","trenton",137,"Amtrak",["Cardinal","Carolinian","Crescent","Northeast Regional"],"ne",[19,137,"05:05"],[20,147,"00:22"]],"miami-aventura":["miami","aventura",17,"Brightline",["Mainline"],"fl",[18,17,"05:45"],[18,22,"00:09"]],"baltimore-richmond":["baltimore","richmond",200,"Amtrak",["Carolinian","Northeast Regional","Palmetto","Silver Meteor"],"so",[7,200,"06:04"],[7,217,"03:52"]],"fresno-bakersfield":["fresno","bakersfield",118,"Amtrak Gold Runner",["Gold Runner"],"ca",[7,126,"10:33"],[7,118,"04:58"]],"new-york-charleston":["new-york","charleston",807,"Amtrak",["Palmetto","Silver Meteor"],"ld",[2,807,"06:03"],[2,848,"09:15"]],"new-york-savannah":["new-york","savannah",922,"Amtrak",["Palmetto","Silver Meteor"],"ld",[2,922,"06:03"],[2,948,"07:35"]],"philadelphia-charleston":["philadelphia","charleston",720,"Amtrak",["Palmetto","Silver Meteor"],"ld",[2,720,"07:30"],[2,756,"09:15"]],"philadelphia-savannah":["philadelphia","savannah",835,"Amtrak",["Palmetto","Silver Meteor"],"ld",[2,835,"07:30"],[2,856,"07:35"]],"washington-charleston":["washington","charleston",564,"Amtrak",["Palmetto","Silver Meteor"],"so",[2,564,"09:59"],[2,591,"09:15"]],"washington-jacksonville":["washington","jacksonville",840,"Amtrak",["Floridian","Silver Meteor"],"ld",[2,840,"13:48"],[2,854,"16:11"]],"orlando-savannah":["orlando","savannah",361,"Amtrak",["Floridian","Silver Meteor"],"so",[2,361,"12:36"],[2,362,"04:03"]],"miami-savannah":["miami","savannah",692,"Amtrak",["Floridian","Silver Meteor"],"ld",[2,692,"07:05"],[2,730,"04:03"]],"orlando-jacksonville":["orlando","jacksonville",187,"Amtrak",["Floridian","Silver Meteor"],"fl",[2,195,"12:36"],[2,187,"06:58"]],"miami-jacksonville":["miami","jacksonville",526,"Amtrak",["Floridian","Silver Meteor"],"fl",[2,526,"07:05"],[2,550,"06:58"]],"philadelphia-pittsburgh":["philadelphia","pittsburgh",447,"Amtrak",["Pennsylvanian"],"ne",[2,447,"07:40"],[2,447,"07:10"]],"new-york-pittsburgh":["new-york","pittsburgh",564,"Amtrak",["Pennsylvanian"],"ne",[2,564,"05:50"],[2,565,"07:10"]],"chicago-buffalo":["chicago","buffalo",623,"Amtrak",["Lake Shore Limited"],"ld",[2,623,"21:30"],[2,633,"00:39"]],"washington-raleigh":["washington","raleigh",353,"Amtrak",["Carolinian","Floridian"],"so",[2,353,"11:08"],[2,355,"09:17"]],"chicago-kansas-city":["chicago","kansas-city",443,"Amtrak",["Lincoln Service Missouri River Runner","Southwest Chief"],"mw",[2,443,"09:50"],[2,461,"07:03"]],"new-york-charlotte":["new-york","charlotte",737,"Amtrak",["Carolinian","Crescent"],"ld",[2,750,"07:05"],[2,791,"06:15"]],"philadelphia-charlotte":["philadelphia","charlotte",637,"Amtrak",["Carolinian","Crescent"],"ld",[2,652,"08:36"],[2,671,"06:15"]],"washington-charlotte":["washington","charlotte",480,"Amtrak",["Carolinian","Crescent"],"so",[2,480,"11:08"],[2,496,"06:15"]],"boston-richmond":["boston","richmond",637,"Amtrak",["Northeast Regional"],"ld",[3,637,"06:10"],[2,658,"05:54"]],"philadelphia-williamsburg":["philadelphia","williamsburg",355,"Amtrak",["Northeast Regional"],"so",[2,374,"04:45"],[2,378,"04:24"]],"washington-williamsburg":["washington","williamsburg",210,"Amtrak",["Northeast Regional"],"so",[2,219,"07:20"],[2,232,"04:24"]],"miami-boca-raton":["miami","boca-raton",51,"Brightline",["Mainline"],"fl",[15,51,"05:45"],[15,56,"06:14"]],"newark-richmond":["newark","richmond",343,"Amtrak",["Carolinian","Northeast Regional","Palmetto","Silver Meteor"],"so",[7,352,"06:19"],[6,357,"03:52"]],"philadelphia-harrisburg":["philadelphia","harrisburg",95,"Amtrak",["Keystone Service","Pennsylvanian"],"ne",[14,102,"05:10"],[14,95,"05:00"]],"philadelphia-lancaster":["philadelphia","lancaster",63,"Amtrak",["Keystone Service","Pennsylvanian"],"ne",[14,65,"05:10"],[14,63,"05:35"]],"boston-wilmington":["boston","wilmington",327,"Amtrak",["Acela","Northeast Regional"],"ne",[14,331,"06:10"],[13,351,"06:33"]],"los-angeles-fullerton":["los-angeles","fullerton",29,"Amtrak",["Pacific Surfliner"],"ca",[13,29,"06:10"],[13,36,"06:18"]],"los-angeles-santa-ana":["los-angeles","santa-ana",50,"Amtrak",["Pacific Surfliner"],"ca",[13,50,"06:10"],[13,53,"06:01"]],"los-angeles-oceanside":["los-angeles","oceanside",114,"Amtrak",["Pacific Surfliner"],"ca",[13,114,"06:10"],[13,120,"04:57"]],"san-diego-fullerton":["san-diego","fullerton",136,"Amtrak",["Pacific Surfliner"],"ca",[13,136,"04:01"],[13,143,"06:41"]],"san-diego-santa-ana":["san-diego","santa-ana",118,"Amtrak",["Pacific Surfliner"],"ca",[13,118,"04:01"],[13,123,"07:01"]],"san-diego-oceanside":["san-diego","oceanside",54,"Amtrak",["Pacific Surfliner"],"ca",[13,54,"04:01"],[13,59,"00:05"]],"new-york-harrisburg":["new-york","harrisburg",190,"Amtrak",["Keystone Service","Pennsylvanian"],"ne",[12,196,"05:30"],[13,190,"05:00"]],"new-york-lancaster":["new-york","lancaster",158,"Amtrak",["Keystone Service","Pennsylvanian"],"ne",[12,159,"05:30"],[13,158,"05:35"]],"albany-buffalo":["albany","buffalo",297,"Amtrak",["Empire Service","Lake Shore Limited","Maple Leaf"],"ne",[5,309,"10:10"],[5,297,"04:45"]],"santa-barbara-anaheim":["santa-barbara","anaheim",212,"Amtrak",["Pacific Surfliner"],"ca",[6,224,"06:53"],[5,212,"06:10"]],"emeryville-bakersfield":["emeryville","bakersfield",357,"Amtrak Gold Runner",["Gold Runner"],"ca",[5,365,"08:20"],[5,357,"04:58"]],"oakland-bakersfield":["oakland","bakersfield",375,"Amtrak Gold Runner",["Gold Runner"],"ca",[5,377,"08:08"],[5,375,"04:58"]],"emeryville-fresno":["emeryville","fresno",232,"Amtrak Gold Runner",["Gold Runner"],"ca",[5,232,"08:20"],[5,235,"07:02"]],"oakland-fresno":["oakland","fresno",244,"Amtrak Gold Runner",["Gold Runner"],"ca",[5,244,"08:08"],[5,251,"07:02"]],"philadelphia-bridgeport":["philadelphia","bridgeport",164,"Amtrak",["Northeast Regional","Vermonter"],"ne",[13,164,"03:25"],[11,179,"06:32"]],"new-york-bridgeport":["new-york","bridgeport",72,"Amtrak",["Northeast Regional","Vermonter"],"ne",[13,72,"05:44"],[11,76,"06:32"]],"new-york-poughkeepsie":["new-york","poughkeepsie",81,"Amtrak",["Adirondack","Empire Service","Ethan Allen Express","Lake Shore Limited"],"ne",[13,81,"07:15"],[10,90,"07:51"]],"orlando-aventura":["orlando","aventura",181,"Brightline",["Mainline"],"fl",[10,186,"05:40"],[10,190,"06:04"]],"washington-alexandria":["washington","alexandria",14,"Amtrak",["Carolinian","Crescent","Floridian","Northeast Regional"],"so",[11,15,"07:20"],[9,16,"07:52"]],"washington-bridgeport":["washington","bridgeport",277,"Amtrak",["Northeast Regional","Vermonter"],"ne",[12,277,"05:05"],[9,305,"06:32"]],"philadelphia-new-london":["philadelphia","new-london",249,"Amtrak",["Northeast Regional"],"ne",[9,254,"03:25"],[9,249,"07:45"]],"new-york-new-london":["new-york","new-london",148,"Amtrak",["Northeast Regional"],"ne",[9,149,"05:44"],[9,152,"07:45"]],"boston-new-london":["boston","new-london",92,"Amtrak",["Northeast Regional"],"ne",[9,93,"06:10"],[9,100,"08:30"]],"orlando-boca-raton":["orlando","boca-raton",152,"Brightline",["Mainline"],"fl",[9,152,"05:40"],[9,157,"06:38"]],"new-york-jacksonville":["new-york","jacksonville",1109,"Amtrak",["Silver Meteor"],"ld",[1,1134,"14:30"],[1,1128,"16:11"]],"orlando-newark":["orlando","newark",1302,"Amtrak",["Silver Meteor"],"ld",[1,1321,"12:36"],[1,1331,"14:53"]],"miami-newark":["miami","newark",1633,"Amtrak",["Silver Meteor"],"ld",[1,1652,"07:05"],[1,1686,"14:53"]],"philadelphia-alexandria":["philadelphia","alexandria",158,"Amtrak",["Carolinian","Crescent","Northeast Regional","Palmetto"],"so",[10,164,"04:45"],[8,168,"07:52"]],"philadelphia-jacksonville":["philadelphia","jacksonville",1017,"Amtrak",["Silver Meteor"],"ld",[1,1029,"16:15"],[1,1034,"16:11"]],"orlando-baltimore":["orlando","baltimore",1154,"Amtrak",["Silver Meteor"],"ld",[1,1171,"12:36"],[1,1166,"17:38"]],"miami-baltimore":["miami","baltimore",1485,"Amtrak",["Silver Meteor"],"ld",[1,1502,"07:05"],[1,1521,"17:38"]],"orlando-charleston":["orlando","charleston",469,"Amtrak",["Silver Meteor"],"so",[1,469,"12:36"],[1,488,"04:56"]],"miami-charleston":["miami","charleston",800,"Amtrak",["Silver Meteor"],"ld",[1,800,"07:05"],[1,843,"04:56"]],"new-york-montreal":["new-york","montreal",665,"Amtrak",["Adirondack"],"ld",[1,721,"08:15"],[1,665,"11:10"]],"denver-emeryville":["denver","emeryville",1999,"Amtrak",["California Zephyr"],"ld",[1,2008,"08:46"],[1,1999,"08:08"]],"chicago-emeryville":["chicago","emeryville",3151,"Amtrak",["California Zephyr"],"ld",[1,3194,"14:00"],[1,3151,"08:08"]],"denver-salt-lake-city":["denver","salt-lake-city",882,"Amtrak",["California Zephyr"],"ld",[1,882,"08:46"],[1,907,"03:20"]],"chicago-salt-lake-city":["chicago","salt-lake-city",2059,"Amtrak",["California Zephyr"],"ld",[1,2068,"14:00"],[1,2059,"03:20"]],"miami-tampa":["miami","tampa",326,"Amtrak",["Floridian"],"fl",[1,326,"11:05"],[1,326,"12:43"]],"miami-raleigh":["miami","raleigh",1321,"Amtrak",["Floridian"],"ld",[1,1321,"11:05"],[1,1335,"19:54"]],"orlando-tampa":["orlando","tampa",105,"Amtrak",["Floridian"],"fl",[1,128,"10:19"],[1,105,"16:49"]],"washington-tampa":["washington","tampa",1343,"Amtrak",["Floridian"],"ld",[1,1359,"13:48"],[1,1343,"16:49"]],"orlando-raleigh":["orlando","raleigh",851,"Amtrak",["Floridian"],"ld",[1,856,"18:50"],[1,851,"19:54"]],"orlando-pittsburgh":["orlando","pittsburgh",1720,"Amtrak",["Floridian"],"ld",[1,1730,"18:50"],[1,1720,"05:25"]],"chicago-raleigh":["chicago","raleigh",1441,"Amtrak",["Floridian"],"ld",[1,1441,"18:40"],[1,1468,"09:17"]],"chicago-richmond":["chicago","richmond",1217,"Amtrak",["Floridian"],"ld",[1,1217,"18:40"],[1,1253,"12:52"]],"washington-pittsburgh":["washington","pittsburgh",463,"Amtrak",["Floridian"],"ne",[1,463,"15:57"],[1,465,"05:25"]],"chicago-pittsburgh":["chicago","pittsburgh",565,"Amtrak",["Floridian"],"so",[1,565,"18:40"],[1,586,"23:59"]],"boston-bridgeport":["boston","bridgeport",162,"Amtrak",["Northeast Regional"],"ne",[8,162,"08:12"],[10,177,"07:05"]],"dallas-san-antonio":["dallas","san-antonio",515,"Amtrak",["Texas Eagle"],"tx",[2,608,"12:38"],[1,515,"06:48"]],"chicago-san-antonio":["chicago","san-antonio",1861,"Amtrak",["Texas Eagle"],"ld",[2,1956,"14:10"],[1,1861,"06:48"]],"dallas-austin":["dallas","austin",357,"Amtrak",["Texas Eagle"],"tx",[2,389,"12:38"],[1,357,"09:26"]],"chicago-austin":["chicago","austin",1703,"Amtrak",["Texas Eagle"],"ld",[2,1737,"14:10"],[1,1703,"09:26"]],"dallas-fort-worth":["dallas","fort-worth",60,"Amtrak",["Texas Eagle"],"tx",[2,67,"12:38"],[1,60,"14:23"]],"chicago-fort-worth":["chicago","fort-worth",1406,"Amtrak",["Texas Eagle"],"ld",[2,1415,"14:10"],[1,1406,"14:23"]],"dallas-st-louis":["dallas","st-louis",947,"Amtrak",["Texas Eagle"],"ld",[1,947,"15:43"],[2,958,"20:10"]],"los-angeles-flagstaff":["los-angeles","flagstaff",636,"Amtrak",["Southwest Chief"],"ld",[1,636,"16:55"],[1,692,"20:55"]],"los-angeles-albuquerque":["los-angeles","albuquerque",1006,"Amtrak",["Southwest Chief"],"ld",[1,1006,"16:55"],[1,1033,"15:14"]],"chicago-albuquerque":["chicago","albuquerque",1554,"Amtrak",["Southwest Chief"],"ld",[1,1554,"13:30"],[1,1573,"11:31"]],"los-angeles-sacramento":["los-angeles","sacramento",838,"Amtrak",["Coast Starlight"],"ld",[1,838,"09:51"],[1,863,"06:48"]],"los-angeles-emeryville":["los-angeles","emeryville",700,"Amtrak",["Coast Starlight"],"ld",[1,700,"09:51"],[1,752,"08:39"]],"los-angeles-oakland":["los-angeles","oakland",675,"Amtrak",["Coast Starlight"],"ld",[1,675,"09:51"],[1,722,"09:09"]],"los-angeles-san-jose":["los-angeles","san-jose",595,"Amtrak",["Coast Starlight"],"ca",[1,595,"09:51"],[1,645,"10:26"]],"atlanta-newark":["atlanta","newark",1074,"Amtrak",["Crescent"],"ld",[1,1128,"01:59"],[1,1103,"14:20"]],"atlanta-baltimore":["atlanta","baltimore",924,"Amtrak",["Crescent"],"ld",[1,948,"01:59"],[1,943,"17:00"]],"new-orleans-baltimore":["new-orleans","baltimore",1723,"Amtrak",["Crescent"],"ld",[1,1747,"11:40"],[1,1752,"17:00"]],"atlanta-charlotte":["atlanta","charlotte",337,"Amtrak",["Crescent"],"so",[1,337,"01:59"],[1,348,"02:55"]],"new-orleans-charlotte":["new-orleans","charlotte",1136,"Amtrak",["Crescent"],"ld",[1,1136,"11:40"],[1,1157,"02:55"]],"boston-trenton":["boston","trenton",318,"Amtrak",["Northeast Regional"],"ne",[8,318,"06:10"],[8,334,"06:27"]],"boston-williamsburg":["boston","williamsburg",720,"Amtrak",["Northeast Regional"],"ld",[1,974,"18:45"],[1,748,"04:24"]],"new-york-williamsburg":["new-york","williamsburg",443,"Amtrak",["Northeast Regional"],"so",[2,487,"11:35"],[1,471,"04:24"]],"new-orleans-memphis":["new-orleans","memphis",520,"Amtrak",["City of New Orleans"],"so",[1,520,"13:45"],[1,532,"06:55"]],"chicago-memphis":["chicago","memphis",630,"Amtrak",["City of New Orleans"],"ld",[1,637,"20:05"],[1,630,"22:45"]],"new-york-raleigh":["new-york","raleigh",617,"Amtrak",["Carolinian"],"ld",[1,617,"07:05"],[1,622,"10:13"]],"philadelphia-raleigh":["philadelphia","raleigh",526,"Amtrak",["Carolinian"],"so",[1,526,"08:36"],[1,527,"10:13"]],"boston-buffalo":["boston","buffalo",687,"Amtrak",["Lake Shore Limited"],"ld",[1,699,"12:50"],[1,687,"09:05"]],"boston-albany":["boston","albany",305,"Amtrak",["Lake Shore Limited"],"ne",[1,320,"12:50"],[1,305,"15:27"]],"richmond-savannah":["richmond","savannah",534,"Amtrak",["Floridian","Palmetto","Silver Meteor"],"so",[3,534,"12:19"],[3,536,"01:41"]],"albany-niagara-falls":["albany","niagara-falls",350,"Amtrak",["Empire Service","Maple Leaf"],"ne",[3,378,"10:10"],[3,350,"03:52"]],"buffalo-niagara-falls":["buffalo","niagara-falls",46,"Amtrak",["Empire Service","Maple Leaf"],"ne",[3,61,"15:19"],[3,46,"03:52"]],"milwaukee-st-paul":["milwaukee","st-paul",348,"Amtrak",["Borealis","Empire Builder"],"mw",[3,352,"12:49"],[3,348,"08:50"]],"raleigh-charlotte":["raleigh","charlotte",178,"Amtrak",["Carolinian","Piedmont"],"so",[3,178,"06:15"],[3,179,"06:15"]],"new-york-alexandria":["new-york","alexandria",248,"Amtrak",["Carolinian","Crescent","Northeast Regional","Palmetto"],"so",[9,251,"06:03"],[7,257,"07:52"]],"washington-new-london":["washington","new-london",368,"Amtrak",["Northeast Regional"],"ne",[8,368,"05:05"],[7,378,"07:45"]],"los-angeles-oxnard":["los-angeles","oxnard",87,"Amtrak",["Coast Starlight","Pacific Surfliner"],"ca",[7,87,"05:13"],[6,103,"07:57"]],"los-angeles-ventura":["los-angeles","ventura",109,"Amtrak",["Pacific Surfliner"],"ca",[6,109,"05:13"],[6,122,"07:39"]],"newark-trenton":["newark","trenton",31,"Amtrak",["Cardinal","Carolinian","Crescent","Keystone Service"],"ne",[33,32,"00:28"],[31,31,"06:27"]],"newark-wilmington":["newark","wilmington",73,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[37,75,"05:06"],[37,79,"06:33"]],"baltimore-wilmington":["baltimore","wilmington",42,"Amtrak",["Acela","Cardinal","Carolinian","Crescent"],"ne",[37,42,"05:44"],[38,44,"05:11"]],"baltimore-trenton":["baltimore","trenton",96,"Amtrak",["Cardinal","Carolinian","Crescent","Northeast Regional"],"ne",[19,98,"05:44"],[20,100,"00:22"]],"west-palm-beach-aventura":["west-palm-beach","aventura",51,"Brightline",["Mainline"],"fl",[18,51,"05:50"],[18,52,"06:04"]],"fort-lauderdale-aventura":["fort-lauderdale","aventura",14,"Brightline",["Mainline"],"fl",[18,14,"06:34"],[18,14,"06:04"]],"chicago-bloomington-normal":["chicago","bloomington-normal",118,"Amtrak",["Lincoln Service","Lincoln Service Missouri River Runner","Texas Eagle"],"mw",[6,118,"07:15"],[5,139,"07:06"]],"chicago-springfield-il":["chicago","springfield-il",175,"Amtrak",["Lincoln Service","Lincoln Service Missouri River Runner","Texas Eagle"],"mw",[6,175,"07:15"],[5,194,"06:11"]],"philadelphia-fredericksburg":["philadelphia","fredericksburg",210,"Amtrak",["Carolinian","Northeast Regional","Silver Meteor"],"so",[6,218,"04:45"],[5,229,"06:53"]],"washington-fredericksburg":["washington","fredericksburg",63,"Amtrak",["Carolinian","Northeast Regional","Silver Meteor"],"so",[6,63,"07:20"],[5,81,"06:53"]],"san-diego-ventura":["san-diego","ventura",301,"Amtrak",["Pacific Surfliner"],"ca",[5,301,"04:01"],[6,320,"07:39"]],"san-diego-oxnard":["san-diego","oxnard",287,"Amtrak",["Pacific Surfliner"],"ca",[5,287,"04:01"],[6,301,"07:57"]],"st-louis-kansas-city":["st-louis","kansas-city",340,"Amtrak",["Lincoln Service Missouri River Runner","Missouri River Runner"],"mw",[2,340,"08:10"],[2,340,"08:40"]],"sacramento-davis":["sacramento","davis",13,"Amtrak",["California Zephyr","Capitol Corridor","Coast Starlight"],"ca",[16,13,"04:20"],[17,15,"07:06"]],"sacramento-martinez":["sacramento","martinez",59,"Amtrak",["California Zephyr","Capitol Corridor","Coast Starlight"],"ca",[16,59,"04:20"],[17,64,"06:17"]],"emeryville-davis":["emeryville","davis",81,"Amtrak",["California Zephyr","Capitol Corridor","Coast Starlight"],"ca",[17,85,"05:38"],[16,81,"04:36"]],"oakland-davis":["oakland","davis",94,"Amtrak",["Capitol Corridor","Coast Starlight"],"ca",[16,95,"05:28"],[16,94,"04:36"]],"emeryville-martinez":["emeryville","martinez",33,"Amtrak",["California Zephyr","Capitol Corridor","Coast Starlight"],"ca",[17,33,"05:38"],[16,35,"05:21"]],"oakland-martinez":["oakland","martinez",47,"Amtrak",["Capitol Corridor","Coast Starlight"],"ca",[16,47,"05:28"],[16,49,"05:21"]],"newark-charleston":["newark","charleston",791,"Amtrak",["Palmetto","Silver Meteor"],"ld",[2,791,"06:19"],[2,828,"09:15"]],"baltimore-charleston":["baltimore","charleston",649,"Amtrak",["Palmetto","Silver Meteor"],"ld",[2,649,"08:41"],[2,683,"09:15"]],"baltimore-savannah":["baltimore","savannah",764,"Amtrak",["Palmetto","Silver Meteor"],"ld",[2,764,"08:41"],[2,783,"07:35"]],"richmond-charleston":["richmond","charleston",419,"Amtrak",["Palmetto","Silver Meteor"],"so",[2,419,"12:19"],[2,428,"09:15"]],"richmond-jacksonville":["richmond","jacksonville",691,"Amtrak",["Floridian","Silver Meteor"],"ld",[2,695,"16:07"],[2,691,"16:11"]],"savannah-charleston":["savannah","charleston",93,"Amtrak",["Palmetto","Silver Meteor"],"so",[2,93,"07:35"],[2,107,"04:56"]],"jacksonville-savannah":["jacksonville","savannah",140,"Amtrak",["Floridian","Silver Meteor"],"so",[2,140,"16:11"],[2,149,"04:03"]],"newark-pittsburgh":["newark","pittsburgh",541,"Amtrak",["Pennsylvanian"],"ne",[2,547,"06:07"],[2,541,"07:10"]],"richmond-raleigh":["richmond","raleigh",206,"Amtrak",["Carolinian","Floridian"],"so",[2,214,"13:36"],[2,206,"09:17"]],"new-haven-wilmington":["new-haven","wilmington",195,"Amtrak",["Acela","Northeast Regional","Vermonter"],"ne",[17,195,"06:12"],[16,210,"06:33"]],"newark-charlotte":["newark","charlotte",712,"Amtrak",["Carolinian","Crescent"],"ld",[2,730,"07:24"],[2,766,"06:15"]],"baltimore-charlotte":["baltimore","charlotte",562,"Amtrak",["Carolinian","Crescent"],"so",[2,570,"09:53"],[2,586,"06:15"]],"richmond-providence":["richmond","providence",597,"Amtrak",["Northeast Regional"],"so",[2,606,"05:54"],[3,597,"06:50"]],"richmond-new-haven":["richmond","new-haven",484,"Amtrak",["Northeast Regional"],"so",[2,499,"05:54"],[4,484,"08:43"]],"richmond-stamford":["richmond","stamford",437,"Amtrak",["Northeast Regional"],"so",[2,442,"05:54"],[4,437,"09:30"]],"baltimore-williamsburg":["baltimore","williamsburg",284,"Amtrak",["Northeast Regional"],"so",[2,295,"06:04"],[2,305,"04:24"]],"richmond-williamsburg":["richmond","williamsburg",77,"Amtrak",["Northeast Regional"],"so",[2,79,"09:34"],[2,85,"04:24"]],"sacramento-fresno":["sacramento","fresno",200,"Amtrak Gold Runner",["Gold Runner"],"ca",[2,200,"07:09"],[2,206,"09:02"]],"sacramento-bakersfield":["sacramento","bakersfield",328,"Amtrak Gold Runner",["Gold Runner"],"ca",[2,331,"07:09"],[2,328,"06:58"]],"fort-lauderdale-boca-raton":["fort-lauderdale","boca-raton",16,"Brightline",["Mainline"],"fl",[15,16,"06:20"],[15,16,"06:14"]],"west-palm-beach-boca-raton":["west-palm-beach","boca-raton",22,"Brightline",["Mainline"],"fl",[15,22,"05:50"],[15,23,"06:38"]],"stamford-wilmington":["stamford","wilmington",150,"Amtrak",["Acela","Northeast Regional","Vermonter"],"ne",[17,150,"07:04"],[14,161,"08:02"]],"new-york-fredericksburg":["new-york","fredericksburg",298,"Amtrak",["Carolinian","Northeast Regional","Silver Meteor"],"so",[6,307,"07:05"],[4,317,"06:53"]],"new-york-syracuse":["new-york","syracuse",339,"Amtrak",["Empire Service","Lake Shore Limited","Maple Leaf"],"ne",[4,339,"07:15"],[4,339,"07:06"]],"new-york-rochester":["new-york","rochester",415,"Amtrak",["Empire Service","Lake Shore Limited","Maple Leaf"],"ne",[4,415,"07:15"],[4,425,"05:40"]],"chicago-kalamazoo":["chicago","kalamazoo",126,"Amtrak",["Blue Water","Wolverine"],"mw",[4,126,"06:45"],[4,136,"09:16"]],"boston-alexandria":["boston","alexandria",523,"Amtrak",["Northeast Regional"],"so",[4,523,"06:10"],[4,540,"07:52"]],"los-angeles-san-luis-obispo":["los-angeles","san-luis-obispo",301,"Amtrak",["Coast Starlight","Pacific Surfliner"],"ca",[4,301,"05:13"],[4,329,"06:11"]],"providence-wilmington":["providence","wilmington",292,"Amtrak",["Acela","Northeast Regional"],"ne",[14,294,"06:50"],[13,299,"06:33"]],"anaheim-fullerton":["anaheim","fullerton",7,"Amtrak",["Pacific Surfliner"],"ca",[13,7,"06:10"],[13,7,"06:41"]],"anaheim-santa-ana":["anaheim","santa-ana",7,"Amtrak",["Pacific Surfliner"],"ca",[13,11,"06:49"],[13,7,"06:01"]],"anaheim-oceanside":["anaheim","oceanside",71,"Amtrak",["Pacific Surfliner"],"ca",[13,75,"06:49"],[13,71,"04:57"]],"newark-harrisburg":["newark","harrisburg",171,"Amtrak",["Keystone Service","Pennsylvanian"],"ne",[12,179,"05:47"],[13,171,"05:00"]],"newark-lancaster":["newark","lancaster",139,"Amtrak",["Keystone Service","Pennsylvanian"],"ne",[12,142,"05:47"],[13,139,"05:35"]],"albany-poughkeepsie":["albany","poughkeepsie",56,"Amtrak",["Adirondack","Empire Service","Ethan Allen Express","Lake Shore Limited"],"ne",[11,56,"06:50"],[13,60,"00:48"]],"newark-bridgeport":["newark","bridgeport",102,"Amtrak",["Northeast Regional","Vermonter"],"ne",[12,102,"04:48"],[11,106,"06:32"]],"stamford-bridgeport":["stamford","bridgeport",23,"Amtrak",["Northeast Regional","Vermonter"],"ne",[12,27,"06:34"],[11,24,"06:32"]],"new-haven-bridgeport":["new-haven","bridgeport",17,"Amtrak",["Northeast Regional","Vermonter"],"ne",[11,17,"06:12"],[13,19,"07:05"]],"new-haven-trenton":["new-haven","trenton",163,"Amtrak",["Northeast Regional","Vermonter"],"ne",[11,165,"06:12"],[11,163,"06:27"]],"chicago-champaign":["chicago","champaign",151,"Amtrak",["City of New Orleans","Illini","Saluki"],"mw",[3,151,"08:15"],[3,156,"06:30"]],"washington-charlottesville":["washington","charlottesville",137,"Amtrak",["Cardinal","Crescent","Northeast Regional"],"so",[3,137,"07:30"],[4,146,"13:00"]],"philadelphia-charlottesville":["philadelphia","charlottesville",296,"Amtrak",["Cardinal","Crescent","Northeast Regional"],"so",[3,302,"04:57"],[4,296,"13:00"]],"philadelphia-lynchburg":["philadelphia","lynchburg",377,"Amtrak",["Crescent","Northeast Regional"],"so",[3,385,"04:57"],[3,377,"11:39"]],"washington-lynchburg":["washington","lynchburg",220,"Amtrak",["Crescent","Northeast Regional"],"so",[3,220,"07:30"],[3,227,"11:39"]],"chicago-ann-arbor":["chicago","ann-arbor",254,"Amtrak",["Wolverine"],"mw",[3,254,"06:45"],[3,258,"07:14"]],"new-york-springfield-ma":["new-york","springfield-ma",201,"Amtrak",["Northeast Regional","Vermonter"],"ne",[3,208,"11:33"],[3,201,"04:10"]],"new-york-hartford":["new-york","hartford",161,"Amtrak",["Northeast Regional","Vermonter"],"ne",[3,161,"11:33"],[3,164,"04:51"]],"new-haven-springfield-ma":["new-haven","springfield-ma",78,"Amtrak",["Amtrak Hartford Line","Northeast Regional","Valley Flyer","Vermonter"],"ne",[9,83,"09:42"],[9,78,"04:10"]],"new-haven-hartford":["new-haven","hartford",38,"Amtrak",["Amtrak Hartford Line","Northeast Regional","Valley Flyer","Vermonter"],"ne",[9,38,"09:42"],[9,41,"04:51"]],"albany-montreal":["albany","montreal",470,"Amtrak",["Adirondack"],"ne",[1,511,"11:45"],[1,470,"11:10"]],"emeryville-salt-lake-city":["emeryville","salt-lake-city",1067,"Amtrak",["California Zephyr"],"ld",[1,1067,"08:08"],[1,1101,"23:53"]],"san-antonio-austin":["san-antonio","austin",148,"Amtrak",["Texas Eagle"],"tx",[1,148,"06:48"],[2,204,"19:22"]],"san-antonio-fort-worth":["san-antonio","fort-worth",429,"Amtrak",["Texas Eagle"],"tx",[1,429,"06:48"],[2,498,"14:25"]],"austin-fort-worth":["austin","fort-worth",271,"Amtrak",["Texas Eagle"],"tx",[1,271,"09:26"],[2,279,"14:25"]],"flagstaff-albuquerque":["flagstaff","albuquerque",335,"Amtrak",["Southwest Chief"],"tx",[1,362,"04:39"],[1,335,"15:14"]],"kansas-city-albuquerque":["kansas-city","albuquerque",1067,"Amtrak",["Southwest Chief"],"ld",[1,1067,"21:37"],[1,1067,"11:31"]],"new-york-norfolk":["new-york","norfolk",505,"Amtrak",["Northeast Regional"],"so",[2,514,"10:35"],[2,505,"08:59"]],"washington-norfolk":["washington","norfolk",269,"Amtrak",["Northeast Regional"],"so",[2,274,"14:35"],[2,269,"08:59"]],"san-diego-san-luis-obispo":["san-diego","san-luis-obispo",516,"Amtrak",["Pacific Surfliner"],"ca",[2,516,"06:01"],[3,527,"06:11"]],"chicago-grand-rapids":["chicago","grand-rapids",244,"Amtrak",["Pere Marquette"],"mw",[1,244,"18:30"],[1,248,"06:00"]],"fort-worth-oklahoma-city":["fort-worth","oklahoma-city",242,"Amtrak",["Heartland Flyer"],"tx",[1,242,"17:25"],[1,242,"08:25"]]},"order":["new-york-philadelphia","new-york-washington","philadelphia-washington","new-york-boston","boston-philadelphia","washington-boston","los-angeles-san-diego","miami-orlando","new-york-newark","new-york-baltimore","philadelphia-newark","washington-newark","philadelphia-baltimore","washington-baltimore","new-york-stamford","new-york-new-haven","philadelphia-stamford","philadelphia-new-haven","new-york-providence","boston-providence","miami-west-palm-beach","miami-fort-lauderdale","washington-stamford","washington-new-haven","philadelphia-providence","boston-newark","boston-stamford","boston-new-haven","washington-providence","new-york-albany","boston-baltimore","los-angeles-anaheim","san-diego-anaheim","orlando-west-palm-beach","fort-lauderdale-orlando","washington-richmond","philadelphia-richmond","chicago-milwaukee","los-angeles-santa-barbara","washington-orlando","washington-miami","new-york-richmond","baltimore-newark","fort-lauderdale-west-palm-beach","newark-stamford","newark-new-haven","stamford-new-haven","chicago-st-louis","boston-portland-maine","san-diego-santa-barbara","sacramento-emeryville","sacramento-oakland","oakland-emeryville","newark-providence","providence-stamford","providence-new-haven","baltimore-stamford","baltimore-new-haven","new-york-buffalo","baltimore-providence","new-york-orlando","new-york-miami","philadelphia-orlando","philadelphia-miami","chicago-washington","new-york-chicago","chicago-denver","chicago-miami","chicago-orlando","chicago-dallas","chicago-los-angeles","new-york-atlanta","new-york-new-orleans","philadelphia-atlanta","philadelphia-new-orleans","washington-atlanta","washington-new-orleans","atlanta-new-orleans","chicago-new-orleans","chicago-boston","washington-savannah","new-york-niagara-falls","chicago-st-paul","chicago-detroit","new-york-trenton","new-york-wilmington","philadelphia-trenton","philadelphia-wilmington","washington-wilmington","sacramento-san-jose","san-jose-emeryville","oakland-san-jose","washington-trenton","miami-aventura","baltimore-richmond","fresno-bakersfield","new-york-charleston","new-york-savannah","philadelphia-charleston","philadelphia-savannah","washington-charleston","washington-jacksonville","orlando-savannah","miami-savannah","orlando-jacksonville","miami-jacksonville","philadelphia-pittsburgh","new-york-pittsburgh","chicago-buffalo","washington-raleigh","chicago-kansas-city","new-york-charlotte","philadelphia-charlotte","washington-charlotte","boston-richmond","philadelphia-williamsburg","washington-williamsburg","miami-boca-raton","newark-richmond","philadelphia-harrisburg","philadelphia-lancaster","boston-wilmington","los-angeles-fullerton","los-angeles-santa-ana","los-angeles-oceanside","san-diego-fullerton","san-diego-santa-ana","san-diego-oceanside","new-york-harrisburg","new-york-lancaster","albany-buffalo","santa-barbara-anaheim","emeryville-bakersfield","oakland-bakersfield","emeryville-fresno","oakland-fresno","philadelphia-bridgeport","new-york-bridgeport","new-york-poughkeepsie","orlando-aventura","washington-alexandria","washington-bridgeport","philadelphia-new-london","new-york-new-london","boston-new-london","orlando-boca-raton","new-york-jacksonville","orlando-newark","miami-newark","philadelphia-alexandria","philadelphia-jacksonville","orlando-baltimore","miami-baltimore","orlando-charleston","miami-charleston","new-york-montreal","denver-emeryville","chicago-emeryville","denver-salt-lake-city","chicago-salt-lake-city","miami-tampa","miami-raleigh","orlando-tampa","washington-tampa","orlando-raleigh","orlando-pittsburgh","chicago-raleigh","chicago-richmond","washington-pittsburgh","chicago-pittsburgh","boston-bridgeport","dallas-san-antonio","chicago-san-antonio","dallas-austin","chicago-austin","dallas-fort-worth","chicago-fort-worth","dallas-st-louis","los-angeles-flagstaff","los-angeles-albuquerque","chicago-albuquerque","los-angeles-sacramento","los-angeles-emeryville","los-angeles-oakland","los-angeles-san-jose","atlanta-newark","atlanta-baltimore","new-orleans-baltimore","atlanta-charlotte","new-orleans-charlotte","boston-trenton","boston-williamsburg","new-york-williamsburg","new-orleans-memphis","chicago-memphis","new-york-raleigh","philadelphia-raleigh","boston-buffalo","boston-albany","richmond-savannah","albany-niagara-falls","buffalo-niagara-falls","milwaukee-st-paul","raleigh-charlotte","new-york-alexandria","washington-new-london","los-angeles-oxnard","los-angeles-ventura","newark-trenton","newark-wilmington","baltimore-wilmington","baltimore-trenton","west-palm-beach-aventura","fort-lauderdale-aventura","chicago-bloomington-normal","chicago-springfield-il","philadelphia-fredericksburg","washington-fredericksburg","san-diego-ventura","san-diego-oxnard","st-louis-kansas-city","sacramento-davis","sacramento-martinez","emeryville-davis","oakland-davis","emeryville-martinez","oakland-martinez","newark-charleston","baltimore-charleston","baltimore-savannah","richmond-charleston","richmond-jacksonville","savannah-charleston","jacksonville-savannah","newark-pittsburgh","richmond-raleigh","new-haven-wilmington","newark-charlotte","baltimore-charlotte","richmond-providence","richmond-new-haven","richmond-stamford","baltimore-williamsburg","richmond-williamsburg","sacramento-fresno","sacramento-bakersfield","fort-lauderdale-boca-raton","west-palm-beach-boca-raton","stamford-wilmington","new-york-fredericksburg","new-york-syracuse","new-york-rochester","chicago-kalamazoo","boston-alexandria","los-angeles-san-luis-obispo","providence-wilmington","anaheim-fullerton","anaheim-santa-ana","anaheim-oceanside","newark-harrisburg","newark-lancaster","albany-poughkeepsie","newark-bridgeport","stamford-bridgeport","new-haven-bridgeport","new-haven-trenton","chicago-champaign","washington-charlottesville","philadelphia-charlottesville","philadelphia-lynchburg","washington-lynchburg","chicago-ann-arbor","new-york-springfield-ma","new-york-hartford","new-haven-springfield-ma","new-haven-hartford","albany-montreal","emeryville-salt-lake-city","san-antonio-austin","san-antonio-fort-worth","austin-fort-worth","flagstaff-albuquerque","kansas-city-albuquerque","new-york-norfolk","washington-norfolk","san-diego-san-luis-obispo","chicago-grand-rapids","fort-worth-oklahoma-city"],"corr":{"ne":{"en":"Northeast Corridor and New York State","es":"Corredor del Noreste y estado de Nueva York","fr":"Northeast Corridor et État de New York","de":"Northeast Corridor und Bundesstaat New York","it":"Northeast Corridor e Stato di New York","pt":"Northeast Corridor e estado de Nova Iorque","ja":"北東回廊とニューヨーク州","zh":"东北走廊与纽约州"},"fl":{"en":"Florida","es":"Florida","fr":"Floride","de":"Florida","it":"Florida","pt":"Florida","ja":"フロリダ","zh":"佛罗里达"},"ca":{"en":"California","es":"California","fr":"Californie","de":"Kalifornien","it":"California","pt":"Califórnia","ja":"カリフォルニア","zh":"加利福尼亚"},"mw":{"en":"Chicago and the Midwest","es":"Chicago y el Medio Oeste","fr":"Chicago et le Midwest","de":"Chicago und der Mittlere Westen","it":"Chicago e il Midwest","pt":"Chicago e o Midwest","ja":"シカゴと中西部","zh":"芝加哥与中西部"},"tx":{"en":"Texas and the Southwest","es":"Texas y el Suroeste","fr":"Texas et le Sud-Ouest","de":"Texas und der Südwesten","it":"Texas e il Sud-Ovest","pt":"Texas e o Sudoeste","ja":"テキサスと南西部","zh":"得克萨斯与西南部"},"so":{"en":"The South and Virginia","es":"El Sur y Virginia","fr":"Le Sud et la Virginie","de":"Der Süden und Virginia","it":"Il Sud e la Virginia","pt":"O Sul e a Virgínia","ja":"南部とバージニア","zh":"南部与弗吉尼亚"},"ld":{"en":"Long-distance trains","es":"Trenes de larga distancia","fr":"Trains grandes lignes","de":"Fernzüge","it":"Treni a lunga percorrenza","pt":"Comboios de longo curso","ja":"長距離列車","zh":"长途列车"}},"corrOrder":["ne","fl","ca","mw","tx","so","ld"]}/*END*/;

  var switchEl = document.getElementById('regionSwitch');
  var inputEl = document.getElementById('aiInput');
  var countriesEl = document.getElementById('countries');
  if (!D || !switchEl || !inputEl || !countriesEl || !window._GLOSX_CITIES) return;

  var PROXY = 'https://voxa-production-dc15.up.railway.app/affiliate/europe-train';
  var LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'];
  var CONN = { en: 'to', es: 'a', fr: 'à', de: 'nach', it: 'a', pt: 'a', ja: 'から', zh: '到' };

  var T = {
    en: { usa: 'USA', ph: 'Train from New York to Washington', nopair: 'Pick one of the popular routes, or try another pair of US cities.', two: 'Enter two or more cities, in the order you will travel.', leg: 'We have no direct train between {a} and {b} in our data. Try another order or pick a popular route.',
      badge: 'AI rail planner for the US', label: 'Iconic US train routes', lead: 'Coastlines, river valleys and overnight trains across the United States — check times and book from here.', featured: 'Featured route', book: 'Times on Omio', guide: 'See guide', fastest: 'fastest', perday: '{n} trains a day', one: '1 train a day', arrival: 'Arrival', view: 'View itinerary', ess: 'for the US.',
      discLead: 'Cities you can reach by train in the United States, each with its own route guide.', discRoute: '{a} → {b} by train', discMeta: 'Fastest {d} · {n}', discGo: 'See the route guide →',
      gLead: 'How Amtrak and Brightline work, corridor by corridor, before you book.', gTag: 'United States', gTitle: 'Trains in the United States: Amtrak corridors, Brightline and long-distance trains',
      et: 'Explore train routes across the US', es: 'Fastest journey times and trains per day for {r} routes, from the official Amtrak and Brightline timetables.', all: 'All {r} routes →',
      stats: 'Book trains across the United States with Omio: <strong>{r} routes</strong> between <strong>{c} cities</strong>, with timetable data from the official Amtrak and Brightline feeds — free, no signup.',
      sc: ['Long stretches of track right beside the Pacific between Ventura and Santa Barbara.', 'Up the Hudson Valley and along Lake Champlain to Montreal. One train a day; bring your passport for the border.', 'Hugs the east bank of the Hudson River for most of the way from Penn Station to Albany.', 'Overnight across Illinois, Iowa and Nebraska to Denver, where the line heads into the Rockies.', 'Overnight from Chicago through Illinois, Tennessee and Mississippi to New Orleans.', 'Florida’s private intercity train, from downtown Miami to Orlando International Airport via Fort Lauderdale and West Palm Beach.'],
      adv: [['Northeast Corridor', 'Acela and Northeast Regional · Boston to Washington'], ['Florida by Brightline', 'Miami to Orlando via Fort Lauderdale and West Palm Beach'], ['Southern California coast', 'Pacific Surfliner · San Diego to Santa Barbara']] },
    es: { usa: 'EE.\u00a0UU.', ph: 'Tren de Nueva York a Washington', nopair: 'Elige una de las rutas populares o prueba otro par de ciudades de EE.\u00a0UU.', two: 'Escribe dos o más ciudades, en el orden del viaje.', leg: 'No tenemos un tren directo entre {a} y {b} en nuestros datos. Prueba otro orden o elige una ruta popular.',
      badge: 'Planificador IA de trenes de EE.\u00a0UU.', label: 'Rutas icónicas de EE.\u00a0UU.', lead: 'Costas, valles de ríos y trenes nocturnos por Estados Unidos: mira los horarios y reserva desde aquí.', featured: 'Ruta destacada', book: 'Horarios en Omio', guide: 'Ver guía', fastest: 'el más rápido', perday: '{n} trenes al día', one: '1 tren al día', arrival: 'Llegada', view: 'Ver itinerario', ess: 'para EE.\u00a0UU.',
      discLead: 'Ciudades de Estados Unidos a las que llegas en tren, cada una con su guía de ruta.', discRoute: '{a} → {b} en tren', discMeta: 'El más rápido: {d} · {n}', discGo: 'Ver la guía de la ruta →',
      gLead: 'Cómo funcionan Amtrak y Brightline, corredor por corredor, antes de reservar.', gTag: 'Estados Unidos', gTitle: 'Trenes en Estados Unidos: corredores de Amtrak, Brightline y trenes de larga distancia',
      et: 'Explora rutas de tren por EE.\u00a0UU.', es: 'Tiempo de viaje más rápido y trenes al día de {r} rutas, con los horarios oficiales de Amtrak y Brightline.', all: 'Ver las {r} rutas →',
      stats: 'Reserva trenes por Estados Unidos con Omio: <strong>{r} rutas</strong> entre <strong>{c} ciudades</strong>, con horarios de los datos oficiales de Amtrak y Brightline — gratis, sin registro.',
      sc: ['Largos tramos de vía junto al Pacífico entre Ventura y Santa Bárbara.', 'Sube por el valle del Hudson y bordea el lago Champlain hasta Montreal. Un tren al día; lleva el pasaporte para la frontera.', 'Sigue la orilla este del río Hudson casi todo el camino desde Penn Station hasta Albany.', 'Tren nocturno por Illinois, Iowa y Nebraska hasta Denver, donde la línea entra en las Rocosas.', 'Tren nocturno de Chicago a Nueva Orleans por Illinois, Tennessee y Misisipi.', 'El tren privado de Florida, del centro de Miami al aeropuerto de Orlando, pasando por Fort Lauderdale y West Palm Beach.'],
      adv: [['Corredor del Noreste', 'Acela y Northeast Regional · de Boston a Washington'], ['Florida en Brightline', 'De Miami a Orlando, con paradas en Fort Lauderdale y West Palm Beach'], ['Costa del sur de California', 'Pacific Surfliner · de San Diego a Santa Bárbara']] },
    fr: { usa: 'États-Unis', ph: 'Train de New York à Washington', nopair: 'Choisissez l’une des routes populaires ou essayez une autre paire de villes américaines.', two: 'Indiquez deux villes ou plus, dans l’ordre du voyage.', leg: 'Nous n’avons pas de train direct entre {a} et {b} dans nos données. Essayez un autre ordre ou choisissez une route populaire.',
      badge: 'Planificateur IA de trains aux États-Unis', label: 'Itinéraires emblématiques des États-Unis', lead: 'Côtes, vallées et trains de nuit à travers les États-Unis : consultez les horaires et réservez d’ici.', featured: 'Itinéraire à la une', book: 'Horaires sur Omio', guide: 'Voir le guide', fastest: 'le plus rapide', perday: '{n} trains par jour', one: '1 train par jour', arrival: 'Arrivée', view: 'Voir l’itinéraire', ess: 'pour les États-Unis.',
      discLead: 'Des villes américaines accessibles en train, chacune avec son guide d’itinéraire.', discRoute: '{a} → {b} en train', discMeta: 'Le plus rapide : {d} · {n}', discGo: 'Voir le guide de l’itinéraire →',
      gLead: 'Comment fonctionnent Amtrak et Brightline, corridor par corridor, avant de réserver.', gTag: 'États-Unis', gTitle: 'Le train aux États-Unis : corridors Amtrak, Brightline et grandes lignes',
      et: 'Explorez les itinéraires en train aux États-Unis', es: 'Durée la plus rapide et trains par jour pour {r} itinéraires, d’après les horaires officiels d’Amtrak et de Brightline.', all: 'Voir les {r} itinéraires →',
      stats: 'Réservez vos trains aux États-Unis avec Omio : <strong>{r} itinéraires</strong> entre <strong>{c} villes</strong>, avec les horaires des données officielles d’Amtrak et de Brightline — gratuit, sans inscription.',
      sc: ['De longs tronçons au bord du Pacifique entre Ventura et Santa Barbara.', 'Remonte la vallée de l’Hudson et longe le lac Champlain jusqu’à Montréal. Un train par jour ; passeport obligatoire à la frontière.', 'Longe la rive est de l’Hudson presque tout le trajet, de Penn Station à Albany.', 'Train de nuit à travers l’Illinois, l’Iowa et le Nebraska jusqu’à Denver, où la ligne attaque les Rocheuses.', 'Train de nuit de Chicago à La Nouvelle-Orléans par l’Illinois, le Tennessee et le Mississippi.', 'Le train privé de Floride, du centre de Miami à l’aéroport d’Orlando, via Fort Lauderdale et West Palm Beach.'],
      adv: [['Corridor du Nord-Est', 'Acela et Northeast Regional · de Boston à Washington'], ['La Floride en Brightline', 'De Miami à Orlando via Fort Lauderdale et West Palm Beach'], ['Côte sud de la Californie', 'Pacific Surfliner · de San Diego à Santa Barbara']] },
    de: { usa: 'USA', ph: 'Zug von New York nach Washington', nopair: 'Wähle eine der beliebten Strecken oder probiere ein anderes Städtepaar in den USA.', two: 'Gib zwei oder mehr Städte ein, in der Reihenfolge der Reise.', leg: 'Zwischen {a} und {b} haben wir in unseren Daten keinen Direktzug. Probiere eine andere Reihenfolge oder wähle eine beliebte Strecke.',
      badge: 'KI-Zugplaner für die USA', label: 'Ikonische Zugstrecken in den USA', lead: 'Küsten, Flusstäler und Nachtzüge quer durch die USA – Fahrzeiten ansehen und direkt hier buchen.', featured: 'Empfohlene Strecke', book: 'Zeiten bei Omio', guide: 'Zum Guide', fastest: 'schnellster Zug', perday: '{n} Züge pro Tag', one: '1 Zug pro Tag', arrival: 'Ankunft', view: 'Reiseplan ansehen', ess: 'für die USA.',
      discLead: 'Städte in den USA, die du mit dem Zug erreichst – jede mit eigenem Streckenführer.', discRoute: '{a} → {b} mit dem Zug', discMeta: 'Schnellster Zug: {d} · {n}', discGo: 'Zum Streckenführer →',
      gLead: 'Wie Amtrak und Brightline funktionieren, Korridor für Korridor, bevor du buchst.', gTag: 'USA', gTitle: 'Bahnfahren in den USA: Amtrak-Korridore, Brightline und Fernzüge',
      et: 'Zugstrecken in den USA entdecken', es: 'Schnellste Fahrzeit und Züge pro Tag für {r} Strecken, nach den offiziellen Fahrplänen von Amtrak und Brightline.', all: 'Alle {r} Strecken →',
      stats: 'Züge in den USA mit Omio buchen: <strong>{r} Strecken</strong> zwischen <strong>{c} Städten</strong>, mit Fahrplandaten aus den offiziellen Daten von Amtrak und Brightline – kostenlos, ohne Anmeldung.',
      sc: ['Lange Abschnitte direkt am Pazifik zwischen Ventura und Santa Barbara.', 'Durch das Hudson-Tal und am Lake Champlain entlang nach Montreal. Ein Zug pro Tag; Reisepass für die Grenze mitnehmen.', 'Fährt fast die ganze Strecke von der Penn Station bis Albany am Ostufer des Hudson entlang.', 'Über Nacht durch Illinois, Iowa und Nebraska nach Denver, wo die Strecke in die Rocky Mountains führt.', 'Nachtzug von Chicago über Illinois, Tennessee und Mississippi nach New Orleans.', 'Floridas privater Fernzug, von der Innenstadt Miamis zum Flughafen Orlando, über Fort Lauderdale und West Palm Beach.'],
      adv: [['Northeast Corridor', 'Acela und Northeast Regional · von Boston nach Washington'], ['Florida mit Brightline', 'Von Miami nach Orlando über Fort Lauderdale und West Palm Beach'], ['Küste Südkaliforniens', 'Pacific Surfliner · von San Diego nach Santa Barbara']] },
    it: { usa: 'USA', ph: 'Treno da New York a Washington', nopair: 'Scegli uno dei percorsi popolari o prova un’altra coppia di città degli Stati Uniti.', two: 'Scrivi due o più città, nell’ordine del viaggio.', leg: 'Nei nostri dati non c’è un treno diretto tra {a} e {b}. Prova un altro ordine o scegli un percorso popolare.',
      badge: 'Pianificatore IA di treni negli Stati Uniti', label: 'Percorsi iconici degli Stati Uniti', lead: 'Coste, valli fluviali e treni notturni attraverso gli Stati Uniti: guarda gli orari e prenota da qui.', featured: 'Percorso in evidenza', book: 'Orari su Omio', guide: 'Vedi la guida', fastest: 'il più veloce', perday: '{n} treni al giorno', one: '1 treno al giorno', arrival: 'Arrivo', view: 'Vedi itinerario', ess: 'per gli Stati Uniti.',
      discLead: 'Città degli Stati Uniti che raggiungi in treno, ognuna con la sua guida del percorso.', discRoute: '{a} → {b} in treno', discMeta: 'Il più veloce: {d} · {n}', discGo: 'Vedi la guida del percorso →',
      gLead: 'Come funzionano Amtrak e Brightline, corridoio per corridoio, prima di prenotare.', gTag: 'Stati Uniti', gTitle: 'Il treno negli Stati Uniti: corridoi Amtrak, Brightline e treni a lunga percorrenza',
      et: 'Esplora i percorsi in treno negli Stati Uniti', es: 'Tempo di viaggio più veloce e treni al giorno per {r} percorsi, dagli orari ufficiali di Amtrak e Brightline.', all: 'Tutti i {r} percorsi →',
      stats: 'Prenota i treni negli Stati Uniti con Omio: <strong>{r} percorsi</strong> tra <strong>{c} città</strong>, con gli orari dai dati ufficiali di Amtrak e Brightline — gratis, senza registrazione.',
      sc: ['Lunghi tratti di binario proprio sul Pacifico tra Ventura e Santa Barbara.', 'Risale la valle dell’Hudson e costeggia il lago Champlain fino a Montréal. Un treno al giorno; serve il passaporto per il confine.', 'Segue la sponda est del fiume Hudson per quasi tutto il tragitto da Penn Station ad Albany.', 'Treno notturno attraverso Illinois, Iowa e Nebraska fino a Denver, dove la linea entra nelle Montagne Rocciose.', 'Treno notturno da Chicago a New Orleans attraverso Illinois, Tennessee e Mississippi.', 'Il treno privato della Florida, dal centro di Miami all’aeroporto di Orlando, via Fort Lauderdale e West Palm Beach.'],
      adv: [['Corridoio del Nord-Est', 'Acela e Northeast Regional · da Boston a Washington'], ['La Florida in Brightline', 'Da Miami a Orlando via Fort Lauderdale e West Palm Beach'], ['Costa della California del Sud', 'Pacific Surfliner · da San Diego a Santa Barbara']] },
    pt: { usa: 'EUA', ph: 'Comboio de Nova Iorque a Washington', nopair: 'Escolha uma das rotas populares ou tente outro par de cidades dos EUA.', two: 'Digite duas ou mais cidades, na ordem da viagem.', leg: 'Nos nossos dados não há comboio direto entre {a} e {b}. Tente outra ordem ou escolha uma rota popular.',
      badge: 'Planejador IA de comboios nos EUA', label: 'Rotas icónicas dos EUA', lead: 'Costas, vales de rios e comboios noturnos pelos Estados Unidos: veja os horários e reserve daqui.', featured: 'Rota em destaque', book: 'Horários na Omio', guide: 'Ver guia', fastest: 'o mais rápido', perday: '{n} comboios por dia', one: '1 comboio por dia', arrival: 'Chegada', view: 'Ver itinerário', ess: 'para os EUA.',
      discLead: 'Cidades dos Estados Unidos onde chega de comboio, cada uma com o seu guia de rota.', discRoute: '{a} → {b} de comboio', discMeta: 'O mais rápido: {d} · {n}', discGo: 'Ver o guia da rota →',
      gLead: 'Como funcionam a Amtrak e a Brightline, corredor a corredor, antes de reservar.', gTag: 'Estados Unidos', gTitle: 'O comboio nos Estados Unidos: corredores da Amtrak, Brightline e comboios de longo curso',
      et: 'Explore rotas de comboio nos EUA', es: 'Tempo de viagem mais rápido e comboios por dia em {r} rotas, com os horários oficiais da Amtrak e da Brightline.', all: 'Ver as {r} rotas →',
      stats: 'Reserve comboios nos Estados Unidos com a Omio: <strong>{r} rotas</strong> entre <strong>{c} cidades</strong>, com horários dos dados oficiais da Amtrak e da Brightline — grátis, sem registo.',
      sc: ['Longos troços de via junto ao Pacífico entre Ventura e Santa Barbara.', 'Sobe o vale do Hudson e contorna o lago Champlain até Montreal. Um comboio por dia; leve o passaporte para a fronteira.', 'Segue a margem leste do rio Hudson quase todo o caminho, de Penn Station a Albany.', 'Comboio noturno pelo Illinois, Iowa e Nebraska até Denver, onde a linha entra nas Montanhas Rochosas.', 'Comboio noturno de Chicago a Nova Orleães pelo Illinois, Tennessee e Mississippi.', 'O comboio privado da Florida, do centro de Miami ao aeroporto de Orlando, via Fort Lauderdale e West Palm Beach.'],
      adv: [['Corredor do Nordeste', 'Acela e Northeast Regional · de Boston a Washington'], ['A Florida de Brightline', 'De Miami a Orlando via Fort Lauderdale e West Palm Beach'], ['Costa sul da Califórnia', 'Pacific Surfliner · de San Diego a Santa Barbara']] },
    ja: { usa: 'アメリカ', ph: '例：ニューヨークからワシントンへの列車', nopair: '人気の路線を選ぶか、別のアメリカの都市の組み合わせを試してください。', two: '行く順に、2つ以上の都市を入力してください。', leg: '{a} と {b} のあいだの直通列車はデータにありません。順番を変えるか、人気の路線を選んでください。',
      badge: 'アメリカの列車AIプランナー', label: 'アメリカの名路線', lead: '海岸線、川沿いの谷、夜行列車。アメリカの鉄道旅の時刻を確かめて、ここから予約できます。', featured: '注目の路線', book: 'Omioで時刻を見る', guide: 'ガイドを見る', fastest: '最速', perday: '1日{n}本', one: '1日1本', arrival: '到着', view: '旅程を見る', ess: 'アメリカ編。',
      discLead: '列車で行けるアメリカの都市。それぞれに路線ガイドがあります。', discRoute: '{a} → {b}（列車）', discMeta: '最速 {d} · {n}', discGo: '路線ガイドを見る →',
      gLead: '予約の前に、AmtrakとBrightlineのしくみを回廊ごとに。', gTag: 'アメリカ', gTitle: 'アメリカの鉄道：Amtrakの回廊、Brightline、長距離列車',
      et: 'アメリカの鉄道ルートを探す', es: 'AmtrakとBrightlineの公式時刻表をもとに、{r}区間の最速所要時間と1日の本数。', all: '{r}区間をすべて見る →',
      stats: 'Omioでアメリカの列車を予約：<strong>{c}都市</strong>・<strong>{r}区間</strong>、AmtrakとBrightlineの公式データにもとづく時刻。無料、登録不要。',
      sc: ['ベンチュラとサンタバーバラのあいだは、太平洋のすぐそばを長く走ります。', 'ハドソン渓谷を上り、シャンプレーン湖に沿ってモントリオールへ。1日1本。国境があるのでパスポートが必要です。', 'ペン駅からオールバニまで、ほぼずっとハドソン川の東岸を走ります。', 'イリノイ、アイオワ、ネブラスカを夜通し走ってデンバーへ。ここから線路はロッキー山脈に入ります。', 'シカゴからイリノイ、テネシー、ミシシッピを夜通し走ってニューオーリンズへ。', 'フロリダの民間の都市間列車。マイアミ中心部からフォートローダーデール、ウェストパームビーチを経てオーランド国際空港へ。'],
      adv: [['北東回廊', 'アセラとノースイースト・リージョナル · ボストンからワシントンへ'], ['Brightlineでフロリダ', 'マイアミからフォートローダーデール、ウェストパームビーチ経由でオーランドへ'], ['南カリフォルニアの海岸', 'パシフィック・サーフライナー · サンディエゴからサンタバーバラへ']] },
    zh: { usa: '美国', ph: '例如：从纽约到华盛顿的火车', nopair: '请选择一条热门线路，或换一组美国城市试试。', two: '按出行顺序输入两个或更多城市。', leg: '我们的数据里 {a} 和 {b} 之间没有直达列车。请换个顺序，或选择一条热门线路。',
      badge: '美国火车 AI 规划', label: '美国经典线路', lead: '海岸线、河谷和夜行列车——查看美国火车的时刻，在这里直接预订。', featured: '推荐线路', book: '在 Omio 查看时刻', guide: '查看指南', fastest: '最快', perday: '每天 {n} 班', one: '每天 1 班', arrival: '到达', view: '查看行程', ess: '美国篇。',
      discLead: '坐火车就能到的美国城市，每座都有线路指南。', discRoute: '{a} → {b}（火车）', discMeta: '最快 {d} · {n}', discGo: '查看线路指南 →',
      gLead: '预订之前，按走廊了解 Amtrak 和 Brightline。', gTag: '美国', gTitle: '美国火车：Amtrak 走廊、Brightline 和长途列车',
      et: '探索美国火车线路', es: '根据 Amtrak 和 Brightline 的官方时刻表，显示 {r} 条线路的最快时长和每天班次。', all: '查看全部 {r} 条线路 →',
      stats: '用 Omio 预订美国各地的火车：<strong>{c} 座城市</strong>之间的 <strong>{r} 条线路</strong>，时刻来自 Amtrak 和 Brightline 的官方数据——免费，无需注册。',
      sc: ['在文图拉和圣巴巴拉之间，铁路有很长一段紧贴太平洋。', '沿哈德逊河谷北上，再沿尚普兰湖开往蒙特利尔。每天一班；过境需要护照。', '从宾州车站到奥尔巴尼，几乎一路沿着哈德逊河东岸行驶。', '夜间穿过伊利诺伊、艾奥瓦和内布拉斯加，抵达丹佛，线路从这里进入落基山脉。', '从芝加哥出发，夜间穿过伊利诺伊、田纳西和密西西比，开往新奥尔良。', '佛罗里达的私营城际列车，从迈阿密市中心经劳德代尔堡和西棕榈滩开往奥兰多国际机场。'],
      adv: [['东北走廊', 'Acela 和 Northeast Regional · 从波士顿到华盛顿'], ['乘 Brightline 游佛罗里达', '从迈阿密经劳德代尔堡和西棕榈滩到奥兰多'], ['南加州海岸', 'Pacific Surfliner · 从圣迭戈到圣巴巴拉']] }
  };

  // Trenes panorámicos y recorridos: cada tramo es un par con datos en el GTFS (tren directo)
  var SCENIC = [['Pacific Surfliner', 'los-angeles', 'santa-barbara'], ['Adirondack', 'new-york', 'montreal'], ['Empire Service', 'new-york', 'albany'],
    ['California Zephyr', 'chicago', 'emeryville', '/assets/img/adventure/ld-zephyr.webp'], ['City of New Orleans', 'chicago', 'new-orleans'], ['Brightline', 'miami', 'orlando'],
    ['Southwest Chief', 'chicago', 'los-angeles', '/assets/img/adventure/ld-window.webp'], ['Crescent', 'new-york', 'new-orleans'], ['Texas Eagle', 'chicago', 'san-antonio']];
  // Grandes trenes de costa a costa (28-nov-2026): Zephyr completo, Southwest Chief, Crescent y Texas Eagle
  var LD = {
    en: ['Two nights from Chicago to the San Francisco Bay, across the plains, the Rockies, the Utah desert and the Sierra Nevada.', 'Chicago to Los Angeles over two nights, via Kansas City, the New Mexico desert and Flagstaff.', 'Overnight from New York to New Orleans via Washington, Charlotte and Atlanta.', 'From Chicago to San Antonio through St. Louis, Little Rock, Dallas and Austin.'],
    es: ['Dos noches de Chicago a la bahía de San Francisco, cruzando las llanuras, las Rocosas, el desierto de Utah y Sierra Nevada.', 'De Chicago a Los Ángeles en dos noches, por Kansas City, el desierto de Nuevo México y Flagstaff.', 'Tren nocturno de Nueva York a Nueva Orleans por Washington, Charlotte y Atlanta.', 'De Chicago a San Antonio por San Luis, Little Rock, Dallas y Austin.'],
    fr: ['Deux nuits de Chicago à la baie de San Francisco, à travers les plaines, les Rocheuses, le désert de l’Utah et la Sierra Nevada.', 'De Chicago à Los Angeles en deux nuits, via Kansas City, le désert du Nouveau-Mexique et Flagstaff.', 'Train de nuit de New York à La Nouvelle-Orléans via Washington, Charlotte et Atlanta.', 'De Chicago à San Antonio via Saint-Louis, Little Rock, Dallas et Austin.'],
    de: ['Zwei Nächte von Chicago an die Bucht von San Francisco, über die Prärie, die Rocky Mountains, die Wüste Utahs und die Sierra Nevada.', 'In zwei Nächten von Chicago nach Los Angeles, über Kansas City, die Wüste New Mexicos und Flagstaff.', 'Nachtzug von New York nach New Orleans über Washington, Charlotte und Atlanta.', 'Von Chicago nach San Antonio über St. Louis, Little Rock, Dallas und Austin.'],
    it: ['Due notti da Chicago alla baia di San Francisco, attraverso le pianure, le Montagne Rocciose, il deserto dello Utah e la Sierra Nevada.', 'Da Chicago a Los Angeles in due notti, via Kansas City, il deserto del Nuovo Messico e Flagstaff.', 'Treno notturno da New York a New Orleans via Washington, Charlotte e Atlanta.', 'Da Chicago a San Antonio via St. Louis, Little Rock, Dallas e Austin.'],
    pt: ['Duas noites de Chicago à baía de São Francisco, pelas planícies, as Montanhas Rochosas, o deserto do Utah e a Serra Nevada.', 'De Chicago a Los Angeles em duas noites, via Kansas City, o deserto do Novo México e Flagstaff.', 'Comboio noturno de Nova Iorque a Nova Orleães via Washington, Charlotte e Atlanta.', 'De Chicago a San Antonio via St. Louis, Little Rock, Dallas e Austin.'],
    ja: ['シカゴからサンフランシスコ湾岸まで2泊。大平原、ロッキー山脈、ユタの砂漠、シエラネバダを越えます。', 'シカゴからロサンゼルスまで2泊。カンザスシティ、ニューメキシコの砂漠、フラッグスタッフを経由します。', 'ニューヨークからワシントン、シャーロット、アトランタを経てニューオーリンズへ向かう夜行列車。', 'シカゴからセントルイス、リトルロック、ダラス、オースティンを経てサンアントニオへ。'],
    zh: ['从芝加哥到旧金山湾区，两晚车程，穿越大平原、落基山脉、犹他沙漠和内华达山脉。', '从芝加哥到洛杉矶，两晚车程，途经堪萨斯城、新墨西哥沙漠和弗拉格斯塔夫。', '从纽约经华盛顿、夏洛特和亚特兰大开往新奥尔良的夜行列车。', '从芝加哥经圣路易斯、小石城、达拉斯和奥斯汀开往圣安东尼奥。']
  };
  function scDesc(i) { var a = t('sc'), x = LD[lang()] || LD.en; return [a[0], a[1], a[2], x[0], a[4], a[5], x[1], x[2], x[3]][i]; }
  function scImg(i) { var c = BY[SCENIC[i][2]]; return SCENIC[i][3] || (c && c.img) || ''; }
  var ADV = [['us-ne', ['boston', 'new-york', 'philadelphia', 'washington']], ['us-fl', ['miami', 'fort-lauderdale', 'west-palm-beach', 'orlando']], ['us-ca', ['san-diego', 'los-angeles', 'santa-barbara']]];
  var QUICK = [['new-york', 'washington'], ['new-york', 'boston'], ['los-angeles', 'san-diego'], ['miami', 'orlando'], ['chicago', 'milwaukee']];
  var DISCOVER = ['new-york', 'washington', 'boston', 'chicago', 'los-angeles', 'san-diego', 'miami', 'new-orleans'];
  // Franja de operadores (ícono = favicon del sitio oficial, con www) y su frase
  var OPS = [['Amtrak', 'www.amtrak.com'], ['Brightline', 'www.gobrightline.com'], ['Pacific Surfliner', 'www.pacificsurfliner.com'], ['Capitol Corridor', 'www.capitolcorridor.org']];
  var TRUST = { en: 'AI-planned trips on the main passenger rail lines in the United States', es: 'Viajes planificados con IA en las principales líneas de tren de Estados Unidos',
    fr: 'Voyages planifiés par IA sur les principales lignes ferroviaires des États-Unis', de: 'Mit KI geplante Reisen auf den wichtigsten Bahnstrecken der USA',
    it: 'Viaggi pianificati con l’IA sulle principali linee ferroviarie degli Stati Uniti', pt: 'Viagens planeadas com IA nas principais linhas de comboio dos Estados Unidos',
    ja: 'アメリカの主要な旅客鉄道路線で、AIが旅を計画します', zh: '在美国主要客运铁路线上用 AI 规划行程' };
  var CORR_PHOTO = { ne: 'new-york', fl: 'miami', ca: 'los-angeles', mw: 'chicago', tx: 'dallas', so: 'new-orleans', ld: 'denver' };
  var N_ROUTES = Object.keys(D.routes).length, N_CITIES = D.cities.length;

  var BY = {};
  D.cities.forEach(function (c) { BY[c.s] = c; });

  function lang() { var l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase(); return T[l] ? l : 'en'; }
  function t(k) { return (T[lang()] || T.en)[k]; }
  function nm(s) { var c = BY[s]; return c ? (c.n[lang()] || c.en) : s; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function suf() { var l = lang(); return l === 'en' ? '' : l + '/'; }
  function routeUrl(slug) { return '/rutas/' + slug + '/' + suf(); }
  function hubUrl() { return '/' + suf() + 'usa-trains/'; }
  function fmt(m) {
    var h = Math.floor(m / 60), mi = m % 60, l = lang(), mm = (mi < 10 ? '0' : '') + mi;
    if (l === 'ja') return h ? h + '時間' + mm + '分' : mi + '分';
    if (l === 'zh') return h ? h + '小时' + mm + '分钟' : mi + '分钟';
    return h ? h + ' h ' + mm + ' min' : mi + ' min';
  }
  function perDay(n) { return n === 1 ? t('one') : t('perday').replace('{n}', n); }
  function fold(x) { return String(x || '').toLowerCase().replace(/\u304b\u3089|\u307e\u3067|\u5230|\u81f3/g, ' ').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9぀-ヿ㐀-鿿]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  function track(src, extra) { try { if (typeof gtag === 'function') gtag('event', 'ui_click', Object.assign({ source: src }, extra || {})); } catch (e) {} }

  // Tramo entre dos ciudades (en cualquier sentido): trenes directos un día laborable, el más rápido y primer tren
  function legOf(a, b) {
    var r = D.routes[a + '-' + b], d = 6;
    if (!r) { r = D.routes[b + '-' + a]; d = 7; }
    if (!r) return null;
    var x = r[d];
    return { slug: D.routes[a + '-' + b] ? a + '-' + b : b + '-' + a, n: x[0], m: x[1] || r[2], first: x[2], op: r[3], svc: r[3] === 'Brightline' ? ['Brightline'] : r[4] }; // en el GTFS de Brightline el servicio se llama "Mainline"
  }

  // Lista de ciudades para el buscador (mismo formato que window._GLOSX_CITIES)
  var EXTRA = { washington: ['washington dc', 'washington d.c.'], 'st-louis': ['saint louis', 'st louis'], 'st-paul': ['saint paul', 'st paul'], montreal: ['montréal'] };
  var US_CITIES = D.cities.map(function (c) {
    var kw = [c.en.toLowerCase()];
    Object.keys(c.n).forEach(function (l) { var v = c.n[l].toLowerCase(); if (kw.indexOf(v) === -1) kw.push(v); });
    (EXTRA[c.s] || []).forEach(function (v) { if (kw.indexOf(v) === -1) kw.push(v); });
    return { display: c.en, slug: c.s, keywords: kw };
  });
  var US_PAGES = new Set(Object.keys(D.routes));

  // Índice para leer lo que escribe la persona (el nombre más largo primero)
  var IDX = [];
  US_CITIES.forEach(function (c) { [c.display, c.slug].concat(c.keywords).forEach(function (k) { var f = fold(k); if (f.length > 2) IDX.push([f, c.slug]); }); });
  IDX.sort(function (a, b) { return b[0].length - a[0].length; });
  function findCities(text) {
    var s = ' ' + fold(text) + ' ', hits = [];
    IDX.forEach(function (p) {
      var i = s.indexOf(' ' + p[0] + ' ');
      while (i !== -1) {
        var end = i + p[0].length + 1;
        if (!hits.some(function (h) { return i < h[1] && end > h[0]; })) hits.push([i, end, p[1]]);
        i = s.indexOf(' ' + p[0] + ' ', i + 1);
      }
    });
    hits.sort(function (a, b) { return a[0] - b[0]; });
    var out = [];
    hits.forEach(function (h) { if (out[out.length - 1] !== h[2]) out.push(h[2]); });
    return out;
  }
  var EU_IDX = window._GLOSX_CITIES.map(function (c) { return [c.display, c.slug].concat(c.keywords || []).map(fold); });
  function euScore(text) {
    var s = ' ' + fold(text) + ' ';
    return EU_IDX.filter(function (ks) { return ks.some(function (k) { return k.length > 2 && s.indexOf(' ' + k + ' ') !== -1; }); }).length;
  }

  var on = false, saved = null, built = false, els = {}, featured = 0, advKey = null;

  function setCities(list) { var arr = window._GLOSX_CITIES; arr.length = 0; list.forEach(function (c) { arr.push(c); }); }
  function japanRegion(r) { return typeof window.glosxJapanRegion === 'function' ? window.glosxJapanRegion(r) : 'europe'; }

  // ── Botón del selector ──
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'region-btn'; btn.setAttribute('data-region', 'usa'); btn.setAttribute('aria-pressed', 'false');
  var hotelsBtn = switchEl.querySelector('.region-hotels');
  switchEl.insertBefore(btn, hotelsBtn || null);
  function paintBtn() {
    btn.textContent = t('usa');
    btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on) switchEl.querySelectorAll('.region-btn[data-region]').forEach(function (b) { if (b !== btn) { b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); } });
  }
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (document.body.classList.contains('hotels-mode') && hotelsBtn) hotelsBtn.click();
    enter();
  });
  // Al elegir Europa, Japón o China estando en EE.\u00a0UU., primero se devuelven las listas de Europa (japan.js sigue después)
  switchEl.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.region-btn[data-region]') : null;
    if (b && b !== btn && on) exit();
  }, true);

  function enter(keepText) {
    if (on) return;
    var text = inputEl.value;
    if (japanRegion() !== 'europe') japanRegion('europe');
    saved = { cities: window._GLOSX_CITIES.slice(), pages: window.GLOSX_ROUTE_PAGES };
    on = true;
    setCities(US_CITIES);
    window.GLOSX_ROUTE_PAGES = US_PAGES;
    document.body.setAttribute('data-region', 'usa');
    var res = document.getElementById('aiResults');
    if (res) res.style.display = 'none';
    if (typeof window.resetAIPlanner === 'function') window.resetAIPlanner();
    var err = document.getElementById('aiPlannerError'); if (err) err.remove();
    inputEl.value = keepText ? text : '';
    var aurora = document.getElementById('aiInputAurora');
    if (aurora) aurora.classList.toggle('active', !!inputEl.value);
    resetBoard('new-york', 'washington');
    paint();
    track('region_switch', { region: 'usa' });
    try { history.replaceState(null, '', location.pathname + location.search + '#usa'); } catch (e) {}
  }
  function exit() {
    if (!on) return;
    on = false;
    setCities(saved.cities);
    window.GLOSX_ROUTE_PAGES = saved.pages;
    document.body.setAttribute('data-region', 'europe');
    inputEl.value = '';
    if (typeof window.resetAIPlanner === 'function') window.resetAIPlanner();
    var res = document.getElementById('aiResults');
    if (res) res.style.display = 'none';
    var f = document.getElementById('rouletteFrom'), to = document.getElementById('rouletteTo');
    if (f) f.textContent = 'Madrid';
    if (to) to.textContent = 'Barcelona';
    if (typeof window.glosxJapanRepaint === 'function') window.glosxJapanRepaint();
    paintBtn();
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }
  function resetBoard(a, b) {
    var f = document.getElementById('rouletteFrom'), to = document.getElementById('rouletteTo'), book = document.getElementById('discoverCtaBook');
    if (f) f.textContent = nm(a);
    if (to) to.textContent = nm(b);
    if (book) book.hidden = true;
    var planner = document.querySelector('.ai-planner'); if (planner) planner.classList.remove('is-roulette-done');
    var board = document.getElementById('pairRoulette'); if (board) board.classList.remove('is-win', 'is-spinning', 'is-brake');
  }

  // ── Reserva: el backend de Omio recibe el nombre de la ciudad en inglés ──
  function omioTerm(x) {
    var f = fold(x), hit = null;
    US_CITIES.forEach(function (c) { if (!hit && [c.display, c.slug.replace(/-/g, ' ')].concat(c.keywords).some(function (k) { return fold(k) === f; })) hit = BY[c.slug]; });
    return hit ? hit.o : f;
  }
  function omioUrl(a, b) { return PROXY + '?from=' + encodeURIComponent(omioTerm(a)) + '&to=' + encodeURIComponent(omioTerm(b)); }
  function openBook(a, b, src) {
    try { if (typeof gtag === 'function') gtag('event', 'omio_click', { source: src, route: a + '-' + b }); } catch (e) {}
    window.open(omioUrl(a, b), '_blank', 'noopener');
  }
  var euBook = window.glosxBookTarget;
  if (typeof euBook === 'function') window.glosxBookTarget = function (a, b) { return on ? omioUrl(a, b) : euBook.apply(this, arguments); };

  // ── Planificador: en EE.\u00a0UU. el par se resuelve con los datos propios; si en Europa se escriben ciudades de EE.\u00a0UU., se cambia solo ──
  function showMsg(key, vars) {
    var wrap = document.getElementById('aiInputWrapper');
    if (!wrap) return;
    var old = document.getElementById('aiPlannerError'); if (old) old.remove();
    var p = document.createElement('p');
    p.id = 'aiPlannerError';
    p.style.cssText = 'color:#C10016;font-size:15px;margin-top:16px;text-align:center;font-weight:600;';
    var txt = t(key);
    if (vars) Object.keys(vars).forEach(function (k) { txt = txt.replace('{' + k + '}', vars[k]); });
    p.textContent = txt;
    wrap.appendChild(p);
    setTimeout(function () { if (p.parentNode) p.remove(); }, 6000);
  }
  function usaGo() {
    var cities = findCities(inputEl.value).slice(0, 5);
    if (cities.length >= 3 && typeof window.glosxShowRoute === 'function') {
      var legs = [];
      for (var i = 0; i < cities.length - 1; i++) {
        if (!legOf(cities[i], cities[i + 1])) return showMsg('leg', { a: nm(cities[i]), b: nm(cities[i + 1]) });
        legs.push([nm(cities[i]), nm(cities[i + 1])]);
      }
      window.glosxShowRoute(legs[0][0], legs[legs.length - 1][1], legs);
      return;
    }
    if (cities.length === 2 && cities[0] !== cities[1]) {
      inputEl.value = nm(cities[0]) + ' ' + (CONN[lang()] || 'to') + ' ' + nm(cities[1]);
      if (typeof window.previewFromInput === 'function' && window.previewFromInput()) return;
    }
    showMsg(cities.length ? 'two' : 'nopair');
  }
  function wantsUsa(text) {
    if (on) return true;
    var us = findCities(text).length;
    if (!us) return false;
    if (typeof window.glosxDetectRegion === 'function' && window.glosxDetectRegion(text)) return false;
    return us > euScore(text);
  }
  function go(fallback, ctx, args) {
    var text = inputEl.value;
    if (!wantsUsa(text)) return fallback.apply(ctx, args);
    if (!on) enter(true);
    return usaGo();
  }
  var prevGenerate = window.generateAIRoute;
  window.generateAIRoute = function () { return go(prevGenerate, this, arguments); };
  // Enter: en fase de captura en el documento, antes que el de japan.js (que está en el propio campo)
  document.addEventListener('keydown', function (e) {
    if (e.target !== inputEl || e.key !== 'Enter' || e.isComposing) return;
    if (!wantsUsa(inputEl.value)) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    go(prevGenerate, inputEl, []);
  }, true);

  // ── Pares populares y corredores ("Rutas por país") ──
  var euSuggest = document.querySelector('.ai-suggestions'), usSuggest = null, usChips = null;
  function buildSuggestions() {
    if (!euSuggest) return;
    if (!usSuggest) {
      usSuggest = document.createElement('div');
      usSuggest.className = 'ai-suggestions us-only';
      usSuggest.id = 'aiSuggestionsUsa';
      euSuggest.parentNode.insertBefore(usSuggest, euSuggest.nextSibling);
      euSuggest.classList.add('no-us');
    }
    usSuggest.innerHTML = '';
    var label = euSuggest.querySelector('.ai-suggestions-label');
    if (label) usSuggest.appendChild(label.cloneNode(true));
    QUICK.forEach(function (p) {
      var chip = document.createElement('button');
      chip.type = 'button'; chip.className = 'ai-suggestion';
      chip.textContent = nm(p[0]) + ' → ' + nm(p[1]);
      chip.addEventListener('click', function () {
        inputEl.value = nm(p[0]) + ' ' + (CONN[lang()] || 'to') + ' ' + nm(p[1]);
        var aurora = document.getElementById('aiInputAurora'); if (aurora) aurora.classList.add('active');
        if (typeof window.previewFromInput === 'function') window.previewFromInput();
        track('us_popular_pair', { route: p[0] + '-' + p[1] });
      });
      usSuggest.appendChild(chip);
    });
  }
  function buildCorridors() {
    if (!usChips) {
      usChips = document.createElement('div');
      usChips.className = 'countries us-only';
      usChips.id = 'countriesUsa';
      usChips.style.padding = '0 24px 0';
      countriesEl.parentNode.insertBefore(usChips, countriesEl.nextSibling);
      countriesEl.classList.add('no-us');
      document.addEventListener('click', function () { usChips.querySelectorAll('.country-chip.show-photo').forEach(function (c) { c.classList.remove('show-photo'); }); });
    }
    var l = lang();
    usChips.innerHTML = '';
    D.corrOrder.forEach(function (k) {
      var list = D.order.filter(function (s) { return D.routes[s][5] === k; }).slice(0, 10);
      if (!list.length) return;
      var chip = document.createElement('span');
      chip.className = 'country-chip';
      var ph = BY[CORR_PHOTO[k]] && BY[CORR_PHOTO[k]].img;
      chip.innerHTML = '<span>' + esc(D.corr[k][l] || D.corr[k].en) + '</span><span class="country-popup">' +
        (ph ? '<img width="330" height="220" class="country-photo" src="' + ph + '" alt="" loading="lazy" onerror="this.remove()">' : '') + '<span class="country-routes"></span></span>';
      var box = chip.querySelector('.country-routes');
      list.forEach(function (s) {
        var r = D.routes[s], a = document.createElement('a');
        a.href = routeUrl(s);
        a.textContent = nm(r[0]) + ' → ' + nm(r[1]);
        a.addEventListener('click', function (e) { if (typeof window.planRouteFromChip === 'function') window.planRouteFromChip(e, nm(r[0]), nm(r[1])); });
        box.appendChild(a);
      });
      chip.addEventListener('click', function (e) {
        e.stopPropagation();
        var was = chip.classList.contains('show-photo');
        usChips.querySelectorAll('.country-chip.show-photo').forEach(function (c) { c.classList.remove('show-photo'); });
        if (!was) chip.classList.add('show-photo');
      });
      usChips.appendChild(chip);
    });
  }

  // ── Portada: cada pieza de Europa recibe .no-us y al lado su versión .us-only ──
  function twin(orig, tag, cls) {
    if (!orig) return null;
    orig.classList.add('no-us');
    var el = document.createElement(tag || orig.tagName.toLowerCase());
    el.className = (cls != null ? cls : orig.className.replace(/\b(no-us|eu-only|eu-static|cn-has)\b/g, '').trim()) + ' us-only';
    orig.parentNode.insertBefore(el, orig.nextSibling);
    return el;
  }
  // el original de Europa es el primero que no es una versión de Japón o China
  function euEl(sel) {
    var all = document.querySelectorAll(sel);
    for (var i = 0; i < all.length; i++) if (!/\b(jp-only|jp-static|cn-static|us-only)\b/.test(all[i].className)) return all[i];
    return null;
  }
  function build() {
    if (built) return;
    built = true;
    els.badge = twin(euEl('[data-i18n="hero_badge"]'));
    els.trust = twin(euEl('[data-i18n="trust_data"]'));
    Array.prototype.forEach.call(document.querySelectorAll('.trust-ops'), function (o) {
      if (/\b(jp-only|us-only)\b/.test(o.className)) return;
      var el = twin(o, 'div', 'trust-ops');
      el.innerHTML = OPS.map(function (x) { return '<span class="op-chip"><img src="https://www.google.com/s2/favicons?sz=64&amp;domain=' + x[1] + '" alt="' + x[0] + '" loading="lazy"/>' + x[0] + '</span>'; }).join('');
    });
    els.label = twin(euEl('[data-i18n="scenic_label"]'));
    els.lead = twin(euEl('[data-i18n="scenic_lead"]'));
    els.ess = twin(euEl('[data-i18n="partners_title2"]'));
    els.feature = twin(document.getElementById('scenicFeature'), 'div', 'scenic-feature');
    els.grid = twin(document.getElementById('scenicGrid'), 'div', 'scenic-grid');
    var tog = document.getElementById('scenicToggle'); if (tog && tog.parentNode) tog.parentNode.classList.add('no-us');
    els.buttons = twin(euEl('.wt-route-buttons'), 'div', 'wt-route-buttons');
    if (els.buttons) els.buttons.setAttribute('role', 'group');
    var wrap = document.getElementById('wt-wrap');
    els.wrap = twin(wrap, 'div', 'wt-timeline-wrap');
    if (els.wrap) {
      els.wrap.hidden = true;
      els.wrap.innerHTML = '<button class="wt-close" type="button" aria-label="Close">&times;</button><div class="wt-timeline-head"><h3></h3><span class="wt-route-meta"></span></div><ol class="wt-timeline jp-tl"></ol>';
      els.wrap.querySelector('.wt-close').addEventListener('click', function () { advKey = null; els.wrap.hidden = true; paintAdvButtons(); });
    }
    var euClose = document.getElementById('wt-close'); if (euClose && wrap && !wrap.hidden) euClose.click();
    els.discLead = twin(euEl('[data-i18n="disc_lead"]'));
    els.discGrid = twin(euEl('#discover .discover-grid'), 'div', 'discover-grid');
    els.gLead = twin(euEl('[data-i18n="guides_lead"]'));
    els.gGrid = twin(euEl('#guides .guides-grid'), 'div', 'guides-grid');
    els.et = twin(euEl('[data-i18n="explore_routes_title"]'));
    els.es = twin(euEl('[data-i18n="explore_routes_sub"]'));
    els.pills = twin(euEl('.explore-pills'));
    els.prose = twin(euEl('.stats-prose'));
    els.marq = twin(euEl('.stats-marquee'), 'div', 'stats-marquee');
    var hotelsRow = euEl('#partners .hotels-pop-row'); if (hotelsRow) hotelsRow.classList.add('no-us');

    if (els.grid) els.grid.addEventListener('click', function (e) {
      if (e.target.closest('.scenic-guide')) return;
      var card = e.target.closest('.scenic-wrapper'); if (!card) return;
      e.preventDefault();
      var i = +card.getAttribute('data-i');
      if (e.target.closest('.scenic-cta')) return openBook(SCENIC[i][1], SCENIC[i][2], 'scenic_us');
      feature(i);
      if (els.feature) els.feature.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    if (els.feature) els.feature.addEventListener('click', function (e) {
      if (!e.target.closest('.sf-btn')) return;
      openBook(SCENIC[featured][1], SCENIC[featured][2], 'scenic_us_featured');
    });
    if (els.buttons) els.buttons.addEventListener('click', function (e) {
      var b = e.target.closest('.wt-route-btn'); if (!b) return;
      renderAdv(b.getAttribute('data-route'));
      els.wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    if (els.wrap) els.wrap.addEventListener('click', function (e) {
      var b = e.target.closest('.wt-stop-buy'); if (b) openBook(b.getAttribute('data-a'), b.getAttribute('data-b'), 'adventure_us');
    });
    window.addEventListener('resize', positionDescs);
  }
  function guideLink(a, b, cls) {
    var g = legOf(a, b);
    return g ? '<a class="' + cls + '" href="' + routeUrl(g.slug) + '">' + esc(t('guide')) + ' →</a>' : '';
  }
  function feature(i) {
    var s = SCENIC[i], g = legOf(s[1], s[2]), im = scImg(i);
    if (!els.feature) return;
    featured = i;
    els.feature.style.background = im ? "url('" + im + "') center/cover no-repeat" : '';
    els.feature.innerHTML = '<div class="sf-content"><span class="sf-badge">' + esc(t('featured')) + '</span>' +
      '<div class="sf-name">' + esc(s[0]) + '</div>' +
      '<div class="sf-route">' + esc(nm(s[1])) + ' → ' + esc(nm(s[2])) + (g ? ' · ' + esc(t('fastest')) + ' ' + fmt(g.m) + ' · ' + esc(perDay(g.n)) : '') + '</div>' +
      '<div class="sf-desc">' + esc(scDesc(i)) + '</div>' +
      '<button type="button" class="sf-btn">' + esc(t('book')) + ' →</button>' + guideLink(s[1], s[2], 'scenic-guide') + '</div>';
    Array.prototype.forEach.call(els.grid ? els.grid.children : [], function (w, idx) { w.classList.toggle('scenic-active', idx === i); });
  }
  function renderScenic() {
    if (!els.grid) return;
    els.grid.innerHTML = SCENIC.map(function (s, i) {
      var g = legOf(s[1], s[2]);
      return '<div class="scenic-wrapper' + (i === featured ? ' scenic-active' : '') + '" data-i="' + i + '">' +
        '<div class="scenic-card" role="button" tabindex="0"><div class="scenic-photo" style="background-image:url(\'' + scImg(i) + '\')"><span class="scenic-dur">' + (g ? fmt(g.m) : '') + '</span></div>' +
        '<div class="scenic-body"><div class="scenic-name">' + esc(s[0]) + '</div><div class="scenic-route">' + esc(nm(s[1])) + ' → ' + esc(nm(s[2])) + '</div></div>' +
        '<div class="scenic-actions"><div class="scenic-cta">' + esc(t('book')) + '</div>' + guideLink(s[1], s[2], 'scenic-guide') + '</div></div>' +
        '<div class="scenic-desc">' + esc(scDesc(i)) + '</div></div>';
    }).join('');
    feature(featured);
    requestAnimationFrame(positionDescs);
  }
  function positionDescs() {
    var g = els.grid;
    if (!g || !on) return;
    var c = g.getBoundingClientRect().left + g.offsetWidth / 2;
    Array.prototype.forEach.call(g.children, function (w) { w.classList.toggle('desc-left', w.getBoundingClientRect().left + w.offsetWidth / 2 < c); });
  }
  function paintAdvButtons() {
    if (!els.buttons) return;
    els.buttons.innerHTML = ADV.map(function (a, i) {
      return '<button class="wt-route-btn" data-route="' + a[0] + '" aria-pressed="' + (a[0] === advKey ? 'true' : 'false') + '">' +
        '<span>' + esc(t('adv')[i][0]) + '</span><span class="wt-route-stops">' + esc(a[1].map(nm).join(' → ')) + '</span>' +
        '<span class="wt-route-go">' + esc(t('view')) + '</span></button>';
    }).join('');
  }
  function renderAdv(key) {
    var idx = ADV.map(function (a) { return a[0]; }).indexOf(key);
    if (idx < 0 || !els.wrap) return;
    advKey = key;
    var stops = ADV[idx][1], w = els.wrap, total = 0;
    w.hidden = false;
    w.setAttribute('data-route', key);
    w.querySelector('h3').textContent = t('adv')[idx][0];
    for (var j = 0; j < stops.length - 1; j++) { var dd = legOf(stops[j], stops[j + 1]); if (dd) total += dd.m; }
    w.querySelector('.wt-route-meta').textContent = t('adv')[idx][1] + ' · ' + fmt(total);
    w.querySelector('ol').innerHTML = stops.map(function (s, i) {
      var next = stops[i + 1], d = next ? legOf(s, next) : null;
      var chip = next ? [d ? d.svc.slice(0, 2).join(', ') : '', d ? fmt(d.m) : '', d ? perDay(d.n) : ''].filter(Boolean).join(' · ') : t('arrival');
      return '<li class="wt-stop" style="animation-delay:' + (i * 0.12) + 's">' +
        '<span class="wt-stop-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="13" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="M8 19l-2 3"/><path d="M18 22l-2-3"/><circle cx="7.5" cy="14.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="16.5" cy="14.5" r="1.4" fill="currentColor" stroke="none"/></svg></span>' +
        '<p class="wt-stop-station">' + esc(nm(s)) + '</p>' +
        '<span class="wt-stop-train">' + (next ? '&#8594; ' : '') + esc(chip) + '</span>' +
        (next ? '<button type="button" class="wt-stop-buy" data-a="' + s + '" data-b="' + next + '">' + esc(t('book')) + ' →</button>' : '') + '</li>';
    }).join('');
    paintAdvButtons();
  }
  function topRouteOf(city) {
    for (var i = 0; i < D.order.length; i++) { var r = D.routes[D.order[i]]; if (r[0] === city || r[1] === city) return D.order[i]; }
    return null;
  }
  function renderDiscover() {
    if (!els.discGrid) return;
    els.discGrid.innerHTML = DISCOVER.map(function (s) {
      var c = BY[s], slug = topRouteOf(s);
      if (!c || !slug) return '';
      var r = D.routes[slug], other = r[0] === s ? r[1] : r[0], g = legOf(s, other);
      return '<a href="' + routeUrl(slug) + '" class="discover-card" style="background-image:url(\'' + (c.img || '') + '\')">' +
        '<span class="discover-pin"></span><div class="discover-country">' + esc(c.st) + '</div>' +
        '<div class="discover-place">' + esc(nm(s)) + '</div>' +
        '<div class="discover-route">' + esc(t('discRoute').replace('{a}', nm(s)).replace('{b}', nm(other))) + '</div>' +
        (g ? '<div class="discover-season">' + esc(t('discMeta').replace('{d}', fmt(g.m)).replace('{n}', perDay(g.n))) + '</div>' : '') +
        '<span class="discover-watch">' + esc(t('discGo')) + '</span></a>';
    }).join('');
  }
  function renderGuides() {
    if (!els.gGrid) return;
    var by = euEl('#guides .guide-by');
    els.gGrid.innerHTML = '<a class="guide-card" href="' + hubUrl() + '"><span class="guide-tag">' + esc(t('gTag')) + '</span><h3>' + esc(t('gTitle')) + '</h3>' +
      (by ? by.outerHTML : '') + '<img class="guide-photo" src="' + (BY['new-york'] && BY['new-york'].img || '') + '" alt="" loading="lazy" width="400" height="260"></a>';
  }
  function renderExplore() {
    var top = D.order.slice(0, 18);
    if (els.pills) els.pills.innerHTML = top.map(function (s) { var r = D.routes[s]; return '<a href="' + routeUrl(s) + '" class="explore-route-pill">' + esc(nm(r[0])) + ' → ' + esc(nm(r[1])) + '</a>'; }).join('') +
      '<a href="' + hubUrl() + '" class="explore-route-pill">' + esc(t('all').replace('{r}', N_ROUTES)) + '</a>';
    if (els.marq) { var chips = top.slice(0, 10).map(function (s) { var r = D.routes[s]; return '<span class="route-chip">' + esc(nm(r[0])) + ' → ' + esc(nm(r[1])) + '</span>'; }).join(''); els.marq.innerHTML = '<div class="stats-track">' + chips + chips + '</div>'; }
  }
  function paint() {
    paintBtn();
    if (!on) return;
    build();
    inputEl.setAttribute('placeholder', t('ph'));
    buildSuggestions();
    buildCorridors();
    if (els.badge) els.badge.textContent = t('badge');
    if (els.trust) els.trust.textContent = TRUST[lang()] || TRUST.en;
    if (els.label) els.label.textContent = t('label');
    if (els.lead) els.lead.textContent = t('lead');
    if (els.ess) els.ess.textContent = t('ess');
    if (els.discLead) els.discLead.textContent = t('discLead');
    if (els.gLead) els.gLead.textContent = t('gLead');
    if (els.et) els.et.textContent = t('et');
    if (els.es) els.es.textContent = t('es').replace('{r}', N_ROUTES);
    if (els.prose) els.prose.innerHTML = t('stats').replace('{r}', N_ROUTES).replace('{c}', N_CITIES);
    renderScenic();
    paintAdvButtons();
    if (advKey) renderAdv(advKey);
    renderDiscover();
    renderGuides();
    renderExplore();
  }

  // Resultado del planificador: duración del tren directo más rápido en la línea del tramo (dato del GTFS)
  function slugOfTerm(x) { var f = fold(x), hit = null; D.cities.forEach(function (c) { if (!hit && fold(c.o) === f) hit = c.s; }); return hit; }
  var resEl = document.getElementById('aiResults');
  if (resEl && window.MutationObserver) new MutationObserver(function () {
    if (!on) return;
    // main.js puede volver a vaciar u ocultar la línea al terminar de pintar: se repone solo si difiere (sin bucle)
    resEl.querySelectorAll('.ai-segment').forEach(function (seg) {
      var buy = seg.querySelector('a.ai-segment-buy[href*="europe-train"]'), dur = seg.querySelector('.rt-dur'), q;
      if (!buy || !dur) return;
      try { q = new URL(buy.href).searchParams; } catch (e) { return; }
      var g = legOf(slugOfTerm(q.get('from')), slugOfTerm(q.get('to')));
      if (!g) return;
      var v = fmt(g.m);
      if (dur.textContent !== v) dur.textContent = v;
      if (dur.hidden) dur.hidden = false;
    });
  }).observe(resEl, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });

  // japan.js vuelve a pintar el buscador al cambiar de idioma: EE.\u00a0UU. se pinta después
  new MutationObserver(function () { setTimeout(paint, 160); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  window.glosxUsaActive = function () { return on; };

  paintBtn();
  if (/^#(usa|us|eeuu|estados-unidos|etats-unis|amerika)$/i.test(location.hash)) enter();
})();
