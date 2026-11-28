#!/usr/bin/env python3
"""
Hub de EE. UU. en 8 idiomas: /usa-trains/ y /<lang>/usa-trains/. Armazon: china-trains/index.html (mismo diseno de hubs).
Rutas y datos: scripts/data/us-routes.json (GTFS oficial). Tabla por corredor con el tren mas rapido y trenes diarios.
Uso: python3 scripts/generate-us-hub.py   (idempotente)
"""
import json, os, re, sys, html

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from us_cities import CITY  # noqa: E402

DATA = json.load(open(os.path.join(ROOT, 'scripts/data/us-routes.json'), encoding='utf8'))['routes']
SHELL = open(os.path.join(ROOT, 'china-trains/index.html'), encoding='utf8').read()
LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh']
HL = {'en': 'en', 'es': 'es', 'fr': 'fr', 'de': 'de', 'it': 'it', 'pt': 'pt', 'ja': 'ja', 'zh': 'zh-Hans'}
url = lambda l: 'https://glosx.app/' + ('' if l == 'en' else l + '/') + 'usa-trains/'
NE = {'MA', 'RI', 'CT', 'NY', 'NJ', 'PA', 'DE', 'MD', 'DC', 'VT', 'ME', 'QC'}
MW = {'IL', 'WI', 'MI', 'MO', 'MN', 'IN', 'OH'}
ORDER = ['ne', 'fl', 'ca', 'mw', 'tx', 'so', 'ld']


def corridor(r):
    st = {r['state_a'], r['state_b']}
    if r['fastest_min'] > 10 * 60: return 'ld'
    if st <= {'FL'}: return 'fl'
    if st <= {'CA'}: return 'ca'
    if st <= MW: return 'mw'
    if st & {'TX', 'OK', 'NM', 'AZ', 'CO', 'UT'}: return 'tx'
    if st <= NE: return 'ne'
    return 'so'


def cname(c, l): return CITY.get(c, {}).get(l, c)


def dur(m, l):
    h, mi = divmod(m, 60)
    if l == 'ja': return f'{h}時間{mi:02d}分' if h else f'{mi}分'
    if l == 'zh': return f'{h}小时{mi:02d}分钟' if h else f'{mi}分钟'
    return f'{h} h {mi:02d} min' if h else f'{mi} min'


T = {
 'en': dict(title='Trains in the United States: Amtrak and Brightline Routes · glosx.app', h1='Trains in the United States', back='← All routes',
   desc='How train travel works in the United States: Amtrak corridors, Brightline in Florida and long-distance trains, plus {n} routes with timetable data from the official GTFS feeds.',
   sub='How rail travel works in the US, which corridors have frequent trains and {n} routes with the fastest journey time and trains per day, each with its own guide.',
   net=['<strong>Amtrak</strong> is the national passenger railroad. Its busiest line is the <strong>Northeast Corridor</strong> between Boston, New York, Philadelphia and Washington, served by <strong>Acela</strong> and <strong>Northeast Regional</strong> trains.',
        'Outside the Northeast, frequent trains run on state-supported corridors such as the Pacific Surfliner (San Diego–Los Angeles), the Capitol Corridor (Sacramento–Bay Area), Gold Runner (Bay Area/Sacramento–Bakersfield) and the lines from Chicago to Milwaukee, St. Louis and Detroit. In Florida, the private operator <strong>Brightline</strong> links Miami, Fort Lauderdale, West Palm Beach and Orlando.',
        'Long-distance trains such as the California Zephyr, the Lake Shore Limited or the City of New Orleans usually run once a day and carry sleeping cars.'],
   book='How to book', bookp='Tickets are sold for a specific train, and fares usually rise as the date gets closer. You can book on the operator\'s website or compare times and fares on Omio from each route guide.',
   routes='Train routes by corridor', cols=('Route', 'Fastest train', 'Trains a day', 'Operator'),
   note='Data from the official GTFS feeds of Amtrak, Brightline and Amtrak Gold Runner, checked on 27 November 2026 for a weekday in the week of 8 to 13 December 2026. Trains a day = direct trains on that weekday from the first city to the second.',
   co=dict(ne='Northeast Corridor and New York State', fl='Florida', ca='California', mw='Chicago and the Midwest', tx='Texas and the Southwest', so='The South and Virginia', ld='Long-distance trains'),
   faq='Frequently asked questions',
   faqs=[('Do I need to book Amtrak trains in advance?', 'Most Amtrak trains need a ticket for a specific train, and fares usually rise as the date gets closer, so booking ahead tends to cost less.'),
         ('What is the fastest train in the United States?', 'Acela, on the Northeast Corridor between Boston, New York, Philadelphia and Washington.'),
         ('Is there a train between Miami and Orlando?', 'Yes. Brightline runs direct trains between Miami and Orlando, with stops in Fort Lauderdale and West Palm Beach.'),
         ('Which station do trains use in New York?', 'Amtrak trains in New York use Penn Station, including Moynihan Train Hall.')],
   more='More train guides', all='All route guides'),
 'es': dict(title='Trenes en Estados Unidos: rutas de Amtrak y Brightline · glosx.app', h1='Trenes en Estados Unidos', back='← Todas las rutas',
   desc='Cómo funciona el tren en Estados Unidos: corredores de Amtrak, Brightline en Florida y trenes de larga distancia, con {n} rutas y horarios del GTFS oficial.',
   sub='Cómo funciona el tren en EE. UU., qué corredores tienen trenes frecuentes y {n} rutas con el tren más rápido y los trenes por día, cada una con su guía.',
   net=['<strong>Amtrak</strong> es la empresa nacional de trenes de pasajeros. Su línea más concurrida es el <strong>Corredor del Noreste</strong> entre Boston, Nueva York, Filadelfia y Washington, con trenes <strong>Acela</strong> y <strong>Northeast Regional</strong>.',
        'Fuera del Noreste hay trenes frecuentes en corredores financiados por los estados, como el Pacific Surfliner (San Diego–Los Ángeles), el Capitol Corridor (Sacramento–bahía de San Francisco), el Gold Runner (bahía/Sacramento–Bakersfield) y las líneas de Chicago a Milwaukee, San Luis y Detroit. En Florida, la empresa privada <strong>Brightline</strong> une Miami, Fort Lauderdale, West Palm Beach y Orlando.',
        'Los trenes de larga distancia, como el California Zephyr, el Lake Shore Limited o el City of New Orleans, suelen circular una vez al día y llevan coches cama.'],
   book='Cómo reservar', bookp='Los billetes se venden para un tren concreto y el precio suele subir a medida que se acerca la fecha. Puedes reservar en la web del operador o comparar horarios y precios en Omio desde la guía de cada ruta.',
   routes='Rutas de tren por corredor', cols=('Ruta', 'Tren más rápido', 'Trenes al día', 'Operador'),
   note='Datos de los GTFS oficiales de Amtrak, Brightline y Amtrak Gold Runner, consultados el 27 de noviembre de 2026 para un día laborable de la semana del 8 al 13 de diciembre de 2026. Trenes al día = trenes directos ese día de la primera ciudad a la segunda.',
   co=dict(ne='Corredor del Noreste y estado de Nueva York', fl='Florida', ca='California', mw='Chicago y el Medio Oeste', tx='Texas y el Suroeste', so='El Sur y Virginia', ld='Trenes de larga distancia'),
   faq='Preguntas frecuentes',
   faqs=[('¿Hay que reservar los trenes de Amtrak con antelación?', 'La mayoría de los trenes de Amtrak requieren billete para un tren concreto y el precio suele subir a medida que se acerca la fecha, así que reservar antes suele salir más barato.'),
         ('¿Cuál es el tren más rápido de Estados Unidos?', 'El Acela, en el Corredor del Noreste entre Boston, Nueva York, Filadelfia y Washington.'),
         ('¿Hay tren entre Miami y Orlando?', 'Sí. Brightline tiene trenes directos entre Miami y Orlando, con paradas en Fort Lauderdale y West Palm Beach.'),
         ('¿Qué estación usan los trenes en Nueva York?', 'Los trenes de Amtrak en Nueva York usan Penn Station, incluido el Moynihan Train Hall.')],
   more='Más guías de tren', all='Todas las guías de rutas'),
 'fr': dict(title='Trains aux États-Unis : lignes Amtrak et Brightline · glosx.app', h1='Trains aux États-Unis', back='← Tous les itinéraires',
   desc='Comment voyager en train aux États-Unis : corridors Amtrak, Brightline en Floride et trains grandes lignes, avec {n} itinéraires et les horaires du GTFS officiel.',
   sub='Comment fonctionne le train aux États-Unis, quels corridors ont des trains fréquents et {n} itinéraires avec le train le plus rapide et le nombre de trains par jour, chacun avec son guide.',
   net=['<strong>Amtrak</strong> est la compagnie ferroviaire nationale de voyageurs. Sa ligne la plus fréquentée est le <strong>Northeast Corridor</strong> entre Boston, New York, Philadelphie et Washington, desservi par les trains <strong>Acela</strong> et <strong>Northeast Regional</strong>.',
        'Hors du Nord-Est, des trains fréquents circulent sur des corridors financés par les États, comme le Pacific Surfliner (San Diego–Los Angeles), le Capitol Corridor (Sacramento–baie de San Francisco), le Gold Runner (baie/Sacramento–Bakersfield) et les lignes de Chicago vers Milwaukee, Saint-Louis et Detroit. En Floride, l\'opérateur privé <strong>Brightline</strong> relie Miami, Fort Lauderdale, West Palm Beach et Orlando.',
        'Les trains grandes lignes, comme le California Zephyr, le Lake Shore Limited ou le City of New Orleans, circulent en général une fois par jour avec des voitures-lits.'],
   book='Comment réserver', bookp='Les billets sont vendus pour un train précis et les tarifs augmentent en général à l\'approche de la date. Vous pouvez réserver sur le site de l\'opérateur ou comparer horaires et tarifs sur Omio depuis le guide de chaque itinéraire.',
   routes='Itinéraires en train par corridor', cols=('Itinéraire', 'Train le plus rapide', 'Trains par jour', 'Opérateur'),
   note='Données des flux GTFS officiels d\'Amtrak, de Brightline et d\'Amtrak Gold Runner, consultées le 27 novembre 2026 pour un jour de semaine de la semaine du 8 au 13 décembre 2026. Trains par jour = trains directs ce jour-là de la première ville à la seconde.',
   co=dict(ne='Northeast Corridor et État de New York', fl='Floride', ca='Californie', mw='Chicago et le Midwest', tx='Texas et le Sud-Ouest', so='Le Sud et la Virginie', ld='Trains grandes lignes'),
   faq='Questions fréquentes',
   faqs=[('Faut-il réserver les trains Amtrak à l\'avance ?', 'La plupart des trains Amtrak demandent un billet pour un train précis, et les tarifs augmentent en général à l\'approche de la date : réserver tôt coûte souvent moins cher.'),
         ('Quel est le train le plus rapide des États-Unis ?', 'L\'Acela, sur le Northeast Corridor entre Boston, New York, Philadelphie et Washington.'),
         ('Y a-t-il un train entre Miami et Orlando ?', 'Oui. Brightline propose des trains directs entre Miami et Orlando, avec arrêts à Fort Lauderdale et West Palm Beach.'),
         ('Quelle gare les trains utilisent-ils à New York ?', 'Les trains Amtrak à New York utilisent Penn Station, y compris le Moynihan Train Hall.')],
   more='Autres guides du train', all='Tous les guides d\'itinéraires'),
 'de': dict(title='Zugreisen in den USA: Amtrak- und Brightline-Strecken · glosx.app', h1='Zugreisen in den USA', back='← Alle Strecken',
   desc='So funktioniert Bahnfahren in den USA: Amtrak-Korridore, Brightline in Florida und Fernzüge, mit {n} Strecken und Fahrplandaten aus dem offiziellen GTFS.',
   sub='Wie Bahnfahren in den USA funktioniert, welche Korridore häufige Züge haben und {n} Strecken mit dem schnellsten Zug und den Zügen pro Tag, jede mit eigenem Streckenführer.',
   net=['<strong>Amtrak</strong> ist die nationale Personenbahn. Ihre meistbefahrene Linie ist der <strong>Northeast Corridor</strong> zwischen Boston, New York, Philadelphia und Washington mit <strong>Acela</strong>- und <strong>Northeast Regional</strong>-Zügen.',
        'Außerhalb des Nordostens fahren häufige Züge auf von den Bundesstaaten finanzierten Korridoren, etwa dem Pacific Surfliner (San Diego–Los Angeles), dem Capitol Corridor (Sacramento–Bucht von San Francisco), dem Gold Runner (Bucht/Sacramento–Bakersfield) und den Linien von Chicago nach Milwaukee, St. Louis und Detroit. In Florida verbindet der private Betreiber <strong>Brightline</strong> Miami, Fort Lauderdale, West Palm Beach und Orlando.',
        'Fernzüge wie der California Zephyr, der Lake Shore Limited oder der City of New Orleans fahren meist einmal täglich und führen Schlafwagen.'],
   book='So buchst du', bookp='Tickets gelten für einen bestimmten Zug, und die Preise steigen meist, je näher das Datum rückt. Du kannst auf der Website des Betreibers buchen oder in jedem Streckenführer Fahrzeiten und Preise auf Omio vergleichen.',
   routes='Zugstrecken nach Korridor', cols=('Strecke', 'Schnellster Zug', 'Züge pro Tag', 'Betreiber'),
   note='Daten aus den offiziellen GTFS-Feeds von Amtrak, Brightline und Amtrak Gold Runner, geprüft am 27. November 2026 für einen Werktag der Woche vom 8. bis 13. Dezember 2026. Züge pro Tag = Direktzüge an diesem Tag von der ersten zur zweiten Stadt.',
   co=dict(ne='Northeast Corridor und Bundesstaat New York', fl='Florida', ca='Kalifornien', mw='Chicago und der Mittlere Westen', tx='Texas und der Südwesten', so='Der Süden und Virginia', ld='Fernzüge'),
   faq='Häufige Fragen',
   faqs=[('Muss ich Amtrak-Züge im Voraus buchen?', 'Für die meisten Amtrak-Züge brauchst du ein Ticket für einen bestimmten Zug, und die Preise steigen meist mit näher rückendem Datum. Früh buchen ist daher oft günstiger.'),
         ('Welcher ist der schnellste Zug der USA?', 'Der Acela auf dem Northeast Corridor zwischen Boston, New York, Philadelphia und Washington.'),
         ('Gibt es einen Zug zwischen Miami und Orlando?', 'Ja. Brightline fährt direkt zwischen Miami und Orlando, mit Halten in Fort Lauderdale und West Palm Beach.'),
         ('Welchen Bahnhof nutzen die Züge in New York?', 'Amtrak-Züge in New York nutzen die Penn Station, einschließlich der Moynihan Train Hall.')],
   more='Weitere Bahnführer', all='Alle Streckenführer'),
 'it': dict(title='Treni negli Stati Uniti: linee Amtrak e Brightline · glosx.app', h1='Treni negli Stati Uniti', back='← Tutti i percorsi',
   desc='Come funziona il treno negli Stati Uniti: corridoi Amtrak, Brightline in Florida e treni a lunga percorrenza, con {n} percorsi e orari dal GTFS ufficiale.',
   sub='Come funziona il treno negli USA, quali corridoi hanno treni frequenti e {n} percorsi con il treno più veloce e i treni al giorno, ognuno con la sua guida.',
   net=['<strong>Amtrak</strong> è la compagnia ferroviaria nazionale per passeggeri. La sua linea più trafficata è il <strong>Northeast Corridor</strong> tra Boston, New York, Filadelfia e Washington, servito dai treni <strong>Acela</strong> e <strong>Northeast Regional</strong>.',
        'Fuori dal Nordest ci sono treni frequenti su corridoi finanziati dagli stati, come il Pacific Surfliner (San Diego–Los Angeles), il Capitol Corridor (Sacramento–baia di San Francisco), il Gold Runner (baia/Sacramento–Bakersfield) e le linee da Chicago verso Milwaukee, St. Louis e Detroit. In Florida l\'operatore privato <strong>Brightline</strong> collega Miami, Fort Lauderdale, West Palm Beach e Orlando.',
        'I treni a lunga percorrenza, come il California Zephyr, il Lake Shore Limited o il City of New Orleans, di solito circolano una volta al giorno e hanno vagoni letto.'],
   book='Come prenotare', bookp='I biglietti si vendono per un treno preciso e le tariffe di solito salgono con l\'avvicinarsi della data. Puoi prenotare sul sito dell\'operatore o confrontare orari e prezzi su Omio dalla guida di ogni percorso.',
   routes='Percorsi in treno per corridoio', cols=('Percorso', 'Treno più veloce', 'Treni al giorno', 'Operatore'),
   note='Dati dai feed GTFS ufficiali di Amtrak, Brightline e Amtrak Gold Runner, verificati il 27 novembre 2026 per un giorno feriale della settimana dall\'8 al 13 dicembre 2026. Treni al giorno = treni diretti quel giorno dalla prima alla seconda città.',
   co=dict(ne='Northeast Corridor e Stato di New York', fl='Florida', ca='California', mw='Chicago e il Midwest', tx='Texas e il Sud-Ovest', so='Il Sud e la Virginia', ld='Treni a lunga percorrenza'),
   faq='Domande frequenti',
   faqs=[('Bisogna prenotare i treni Amtrak in anticipo?', 'La maggior parte dei treni Amtrak richiede un biglietto per un treno preciso e le tariffe di solito salgono con l\'avvicinarsi della data, quindi prenotare prima spesso costa meno.'),
         ('Qual è il treno più veloce degli Stati Uniti?', 'L\'Acela, sul Northeast Corridor tra Boston, New York, Filadelfia e Washington.'),
         ('C\'è un treno tra Miami e Orlando?', 'Sì. Brightline ha treni diretti tra Miami e Orlando, con fermate a Fort Lauderdale e West Palm Beach.'),
         ('Quale stazione usano i treni a New York?', 'I treni Amtrak a New York usano Penn Station, compresa la Moynihan Train Hall.')],
   more='Altre guide sul treno', all='Tutte le guide dei percorsi'),
 'pt': dict(title='Comboios nos Estados Unidos: rotas da Amtrak e da Brightline · glosx.app', h1='Comboios nos Estados Unidos', back='← Todas as rotas',
   desc='Como funciona o comboio nos Estados Unidos: corredores da Amtrak, Brightline na Florida e comboios de longo curso, com {n} rotas e horários do GTFS oficial.',
   sub='Como funciona o comboio nos EUA, que corredores têm comboios frequentes e {n} rotas com o comboio mais rápido e os comboios por dia, cada uma com o seu guia.',
   net=['A <strong>Amtrak</strong> é a empresa nacional de comboios de passageiros. A sua linha mais movimentada é o <strong>Northeast Corridor</strong> entre Boston, Nova Iorque, Filadélfia e Washington, servido pelos comboios <strong>Acela</strong> e <strong>Northeast Regional</strong>.',
        'Fora do Nordeste há comboios frequentes em corredores financiados pelos estados, como o Pacific Surfliner (San Diego–Los Angeles), o Capitol Corridor (Sacramento–baía de São Francisco), o Gold Runner (baía/Sacramento–Bakersfield) e as linhas de Chicago para Milwaukee, St. Louis e Detroit. Na Florida, o operador privado <strong>Brightline</strong> liga Miami, Fort Lauderdale, West Palm Beach e Orlando.',
        'Os comboios de longo curso, como o California Zephyr, o Lake Shore Limited ou o City of New Orleans, circulam em geral uma vez por dia e têm carruagens-cama.'],
   book='Como reservar', bookp='Os bilhetes são vendidos para um comboio específico e o preço costuma subir à medida que a data se aproxima. Pode reservar no site do operador ou comparar horários e preços na Omio a partir do guia de cada rota.',
   routes='Rotas de comboio por corredor', cols=('Rota', 'Comboio mais rápido', 'Comboios por dia', 'Operador'),
   note='Dados dos feeds GTFS oficiais da Amtrak, da Brightline e da Amtrak Gold Runner, consultados a 27 de novembro de 2026 para um dia útil da semana de 8 a 13 de dezembro de 2026. Comboios por dia = comboios diretos nesse dia da primeira para a segunda cidade.',
   co=dict(ne='Northeast Corridor e estado de Nova Iorque', fl='Florida', ca='Califórnia', mw='Chicago e o Midwest', tx='Texas e o Sudoeste', so='O Sul e a Virgínia', ld='Comboios de longo curso'),
   faq='Perguntas frequentes',
   faqs=[('É preciso reservar os comboios da Amtrak com antecedência?', 'A maioria dos comboios da Amtrak exige bilhete para um comboio específico e o preço costuma subir à medida que a data se aproxima, por isso reservar cedo sai, em geral, mais barato.'),
         ('Qual é o comboio mais rápido dos Estados Unidos?', 'O Acela, no Northeast Corridor entre Boston, Nova Iorque, Filadélfia e Washington.'),
         ('Há comboio entre Miami e Orlando?', 'Sim. A Brightline tem comboios diretos entre Miami e Orlando, com paragens em Fort Lauderdale e West Palm Beach.'),
         ('Que estação usam os comboios em Nova Iorque?', 'Os comboios da Amtrak em Nova Iorque usam a Penn Station, incluindo o Moynihan Train Hall.')],
   more='Mais guias de comboio', all='Todos os guias de rotas'),
 'ja': dict(title='アメリカの鉄道：アムトラックとブライトラインの路線 · glosx.app', h1='アメリカの鉄道', back='← すべてのルート',
   desc='アメリカの鉄道旅行ガイド：アムトラックの主要回廊、フロリダのブライトライン、長距離列車。公式GTFSの時刻データで{n}ルートを紹介。',
   sub='アメリカの鉄道のしくみ、本数の多い回廊、そして最速の所要時間と1日の本数がわかる{n}ルート（それぞれにガイドあり）。',
   net=['<strong>アムトラック（Amtrak）</strong>はアメリカの全国旅客鉄道です。最も利用者が多いのはボストン、ニューヨーク、フィラデルフィア、ワシントンを結ぶ<strong>北東回廊（Northeast Corridor）</strong>で、<strong>アセラ（Acela）</strong>と<strong>ノースイースト・リージョナル</strong>が走ります。',
        '北東部以外では、州が支援する回廊で列車が頻繁に走ります。パシフィック・サーフライナー（サンディエゴ〜ロサンゼルス）、キャピトル・コリドー（サクラメント〜サンフランシスコ湾岸）、ゴールド・ランナー（湾岸/サクラメント〜ベーカーズフィールド）、シカゴからミルウォーキー、セントルイス、デトロイトへの路線などです。フロリダでは民間の<strong>ブライトライン（Brightline）</strong>がマイアミ、フォートローダーデール、ウェストパームビーチ、オーランドを結びます。',
        'カリフォルニア・ゼファー、レイクショア・リミテッド、シティ・オブ・ニューオーリンズなどの長距離列車は、通常1日1本で寝台車を連結しています。'],
   book='予約方法', bookp='きっぷは特定の列車ごとに販売され、運賃は出発日が近づくにつれて上がることが多いです。運行会社のサイトで予約するか、各ルートガイドからOmioで時刻と運賃を比較できます。',
   routes='回廊別の鉄道ルート', cols=('ルート', '最速の列車', '1日の本数', '運行会社'),
   note='アムトラック、ブライトライン、アムトラック・ゴールド・ランナーの公式GTFSより、2026年11月27日に2026年12月8日〜13日の週の平日について確認。1日の本数＝その平日に最初の都市から2番目の都市へ向かう直通列車の本数。',
   co=dict(ne='北東回廊とニューヨーク州', fl='フロリダ', ca='カリフォルニア', mw='シカゴと中西部', tx='テキサスと南西部', so='南部とバージニア', ld='長距離列車'),
   faq='よくある質問',
   faqs=[('アムトラックは事前予約が必要ですか？', 'ほとんどのアムトラック列車は特定の列車のきっぷが必要で、運賃は出発日が近づくと上がることが多いため、早めの予約が割安になりやすいです。'),
         ('アメリカで最も速い列車は？', 'ボストン、ニューヨーク、フィラデルフィア、ワシントンを結ぶ北東回廊のアセラです。'),
         ('マイアミとオーランドの間に列車はありますか？', 'はい。ブライトラインがマイアミとオーランドを直通で結び、フォートローダーデールとウェストパームビーチに停車します。'),
         ('ニューヨークではどの駅を使いますか？', 'ニューヨークのアムトラック列車は、モイニハン・トレイン・ホールを含むペン駅（Penn Station）を使います。')],
   more='その他の鉄道ガイド', all='すべてのルートガイド'),
 'zh': dict(title='美国火车：Amtrak 和 Brightline 线路 · glosx.app', h1='美国火车', back='← 全部线路',
   desc='美国火车出行指南：Amtrak 主要走廊、佛罗里达的 Brightline 和长途列车，收录 {n} 条线路，时刻数据来自官方 GTFS。',
   sub='美国铁路如何运作、哪些走廊班次密集，以及 {n} 条线路的最快用时和每日班次，每条线路都有独立指南。',
   net=['<strong>Amtrak</strong> 是美国全国性的客运铁路公司。最繁忙的线路是连接波士顿、纽约、费城和华盛顿的<strong>东北走廊（Northeast Corridor）</strong>，运行 <strong>Acela</strong> 和 <strong>Northeast Regional</strong> 列车。',
        '东北部以外，由各州资助的走廊上也有频密班次，例如 Pacific Surfliner（圣迭戈—洛杉矶）、Capitol Corridor（萨克拉门托—旧金山湾区）、Gold Runner（湾区/萨克拉门托—贝克斯菲尔德），以及从芝加哥开往密尔沃基、圣路易斯和底特律的线路。在佛罗里达，私营运营商 <strong>Brightline</strong> 连接迈阿密、劳德代尔堡、西棕榈滩和奥兰多。',
        'California Zephyr、Lake Shore Limited、City of New Orleans 等长途列车通常每天一班，并设有卧铺车厢。'],
   book='如何订票', bookp='车票按具体车次出售，票价通常随出发日期临近而上涨。你可以在运营商官网预订，或在各线路指南中通过 Omio 比较时刻和票价。',
   routes='按走廊划分的火车线路', cols=('线路', '最快列车', '每日班次', '运营商'),
   note='数据来自 Amtrak、Brightline 和 Amtrak Gold Runner 的官方 GTFS，于 2026 年 11 月 27 日核对，取 2026 年 12 月 8 日至 13 日这一周的一个工作日。每日班次＝当天从第一个城市开往第二个城市的直达列车数。',
   co=dict(ne='东北走廊与纽约州', fl='佛罗里达', ca='加利福尼亚', mw='芝加哥与中西部', tx='得克萨斯与西南部', so='南部与弗吉尼亚', ld='长途列车'),
   faq='常见问题',
   faqs=[('Amtrak 需要提前订票吗？', '大多数 Amtrak 列车需要购买指定车次的车票，票价通常随出发日期临近而上涨，因此提前预订往往更便宜。'),
         ('美国最快的火车是哪一趟？', '是行驶在东北走廊（波士顿、纽约、费城、华盛顿之间）的 Acela。'),
         ('迈阿密和奥兰多之间有火车吗？', '有。Brightline 开行迈阿密至奥兰多的直达列车，途经劳德代尔堡和西棕榈滩。'),
         ('火车在纽约使用哪个车站？', 'Amtrak 列车在纽约使用宾夕法尼亚车站（Penn Station），包括 Moynihan Train Hall。')],
   more='更多火车指南', all='全部线路指南'),
}


def build(l):
    t = T[l]; e = html.escape
    n = len(DATA)
    groups = {k: [] for k in ORDER}
    for s, r in sorted(DATA.items(), key=lambda kv: -kv[1]['score']):
        groups[corridor(r)].append((s, r))
    suf = '' if l == 'en' else l + '/'
    tables = ''
    items = []
    for k in ORDER:
        if not groups[k]: continue
        rows = ''.join(f'<tr><td><a href="/rutas/{s}/{suf}">{e(cname(r["from"], l))} &rarr; {e(cname(r["to"], l))}</a></td>'
                       f'<td>{dur(r["fastest_min"], l)}</td><td>{r["dirs"]["ab"]["weekday"]["n"]}</td><td>{e(r["operator"])}</td></tr>'
                       for s, r in groups[k])
        items += [(s, r) for s, r in groups[k]]
        tables += f'''
    <h3 id="{k}">{e(t["co"][k])}</h3>
    <div class="tw"><table>
      <thead><tr>{''.join(f'<th>{e(c)}</th>' for c in t["cols"])}</tr></thead>
      <tbody>{rows}</tbody>
    </table></div>'''
    toc = '<ul class="gl">' + ''.join(f'<li><a href="#{k}">{e(t["co"][k])}</a></li>' for k in ORDER if groups[k]) + '</ul>'
    idx = '/rutas/' if l == 'en' else f'/{l}/rutas/'
    main = f'''<main class="hx">
    <h2>{e(t["h1"])}</h2>
    {''.join(f'<p>{p}</p>' for p in t["net"])}
    <h2>{e(t["book"])}</h2>
    <p>{e(t["bookp"])}</p>
    <h2 id="routes">{e(t["routes"])}</h2>
    {toc}{tables}
    <p style="font-size:13px;color:#6b6c75;margin-top:8px">{e(t["note"])}</p>
    <h2>{e(t["faq"])}</h2>
    {''.join(f'<h3>{e(q)}</h3><p>{e(a)}</p>' for q, a in t["faqs"])}
    <h2>{e(t["more"])}</h2>
    <ul class="gl"><li><a href="{idx}">{e(t["all"])}</a></li></ul>
  </main>'''
    title = t['title']; desc = t['desc'].format(n=n); u = url(l)
    ld = [
        {'@context': 'https://schema.org', '@type': 'CollectionPage', 'name': title.replace(' · glosx.app', ''), 'description': desc, 'url': u, 'inLanguage': HL[l],
         'isPartOf': {'@type': 'WebSite', 'name': 'WoW Train', 'url': 'https://glosx.app/'}, 'dateModified': '2026-11-27',
         'mainEntity': {'@type': 'ItemList', 'numberOfItems': n, 'itemListElement': [
             {'@type': 'ListItem', 'position': i + 1, 'name': f'{cname(r["from"], l)} → {cname(r["to"], l)}', 'url': f'https://glosx.app/rutas/{s}/{suf}'} for i, (s, r) in enumerate(items)]}},
        {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'WoW Train', 'item': 'https://glosx.app/'},
            {'@type': 'ListItem', 'position': 2, 'name': t['all'], 'item': 'https://glosx.app' + idx},
            {'@type': 'ListItem', 'position': 3, 'name': t['h1'], 'item': u}]},
        {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in t['faqs']]},
    ]
    s = SHELL
    s = s.replace('<html lang="en">', f'<html lang="{HL[l]}">', 1)
    s = re.sub(r'<title>.*?</title>', lambda m: f'<title>{e(title)}</title>', s, count=1, flags=re.S)
    s = re.sub(r'<meta name="description" content="[^"]*" />', lambda m: f'<meta name="description" content="{e(desc)}" />', s, count=1)
    s = re.sub(r'<link rel="canonical" href="[^"]*" />', f'<link rel="canonical" href="{u}" />', s, count=1)
    s = re.sub(r'\n  <link rel="alternate" hreflang="[^"]*" href="[^"]*" />', '', s)
    alts = ''.join(f'\n  <link rel="alternate" hreflang="{HL[x]}" href="{url(x)}" />' for x in LANGS) + f'\n  <link rel="alternate" hreflang="x-default" href="{url("en")}" />'
    s = s.replace(f'<link rel="canonical" href="{u}" />', f'<link rel="canonical" href="{u}" />' + alts, 1)
    for k, v in (('og:title', title), ('og:description', desc), ('og:url', u)):
        s = re.sub(rf'<meta property="{k}" content="[^"]*" />', lambda m, k=k, v=v: f'<meta property="{k}" content="{e(v)}" />', s, count=1)
    for k, v in (('twitter:title', title), ('twitter:description', desc)):
        s = re.sub(rf'<meta name="{k}" content="[^"]*" />', lambda m, k=k, v=v: f'<meta name="{k}" content="{e(v)}" />', s, count=1)
    blocks = list(re.finditer(r'<script type="application/ld\+json">.*?</script>\n?', s, flags=re.S))
    if blocks:
        first, last = blocks[0].start(), blocks[-1].end()
        s = s[:first] + ''.join('<script type="application/ld+json">' + json.dumps(x, ensure_ascii=False) + '</script>\n' for x in ld) + s[last:]
    s = re.sub(r'<a href="/rutas/" style="font-weight:600;text-decoration:none;color:inherit">[^<]*</a>',
               f'<a href="{idx}" style="font-weight:600;text-decoration:none;color:inherit">{e(t["back"])}</a>', s, count=1)
    s = re.sub(r'<header>.*?</header>', lambda m: f'<header>\n    <h1>{e(t["h1"])} <span style="color:#C10016">&middot; glosx.app</span></h1>\n    <p>{e(t["sub"].format(n=n))}</p>\n  </header>', s, count=1, flags=re.S)
    s = re.sub(r'<main class="hx">.*?</main>', lambda m: main, s, count=1, flags=re.S)
    return s


if __name__ == '__main__':
    for l in LANGS:
        d = os.path.join(ROOT, '' if l == 'en' else l, 'usa-trains')
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w', encoding='utf8').write(build(l).replace('EE. UU.', 'EE.\u00a0UU.'))
    cnt = {}
    for r in DATA.values(): cnt[corridor(r)] = cnt.get(corridor(r), 0) + 1
    print('usa-trains: 8 idiomas,', len(DATA), 'rutas | por corredor:', cnt)
