#!/usr/bin/env python3
"""
Paginas de ruta de EE. UU. en 8 idiomas (/rutas/<slug>/ y /rutas/<slug>/<lang>/), tanda 1 (24 rutas).
Datos: scripts/data/us-routes.json (GTFS oficial de Amtrak y Brightline, ver scripts/us-routes-data.py).
Armazon (estilos, GA4, scripts de pie): la pagina inglesa de rutas/strasbourg-colmar. No toca rutas europeas.
Sin precios, sin hoteles (hasta tener datos verificados). Boton de reserva: /affiliate/europe-train (Omio via Impact).
Uso: python3 scripts/generate-us-routes.py [slug ...]   (sin argumentos: las 24). Idempotente.
"""
import json, os, re, sys, html, shutil
from urllib.parse import quote

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
DATA = json.load(open(os.path.join(ROOT, 'scripts/data/us-routes.json'), encoding='utf8'))
SHELL = open(os.path.join(ROOT, 'rutas/strasbourg-colmar/index.html'), encoding='utf8').read()
PKG_IMG = os.path.join(ROOT, 'eeuu-produccion/assets/img/ciudades')
LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh']
HL = {'en': 'en', 'es': 'es', 'fr': 'fr', 'de': 'de', 'it': 'it', 'pt': 'pt', 'ja': 'ja', 'zh': 'zh-Hans'}
LNAME = {'en': 'English', 'es': 'Español', 'fr': 'Français', 'de': 'Deutsch', 'it': 'Italiano', 'pt': 'Português', 'ja': '日本語', 'zh': '中文'}
PROXY = 'https://voxa-production-dc15.up.railway.app/affiliate/europe-train'

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from us_traveler import guide  # noqa: E402
from us_cities import CITY, IMG, OMIO, BORDER  # noqa: E402

T = {
 'en': dict(badge='Route guide · United States', meta='By WoW Train · Timetable checked November 2026 · 3 min read', back='← All routes',
    title='{a} to {b} by Train: {dur}, {n} Trains a Day', title1='{a} to {b} by Train: {dur} on the {svc}',
    desc='The fastest direct {op} train from {a} to {b} takes {dur}. {n} direct trains on weekdays, first at {f}, last at {l}. Stations and how to book.',
    h1='{a} to {b} by Train', lead='The fastest direct {op} train from {a} to {b} takes {dur}. On weekdays there are {n} direct trains, the first leaving at {f} and the last at {l}.',
    lead1='The direct {op} train from {a} to {b} takes {dur}. It runs once a day, leaving at {f}.',
    cta='Book {a} → {b} on Omio', ctasub='{op} · {dur} · times and fares for your date', btn='Book Ticket',
    facts='Key facts', f_fast='Fastest direct train: {dur}.', f_n='Direct trains from {a} to {b}: {w} on weekdays, {s} on Saturdays, {u} on Sundays.',
    f_nb='From {b} to {a}: {w} on weekdays, {s} on Saturdays, {u} on Sundays.', f_fl='First and last weekday departure from {a}: {f} and {l} (local time).',
    f_st='Stations: {sa} → {sb}.', f_svc='Trains on this route: {svc}.',
    tips='Before you go', tip1='{op} sells a ticket for a specific train, and fares usually rise as the date gets closer, so booking a few days ahead tends to cost less.',
    tip2='Check the departure station on your ticket: big US cities can have more than one.',
    src='Timetable from the official {op} GTFS feed, checked on 27 November 2026 for the week of 8 to 13 December 2026. Schedules change by season and on holidays, so check your date before you travel.',
    faq='Frequently asked questions',
    q1='How long is the train from {a} to {b}?', a1='The fastest direct train takes {dur}. Journey times vary from train to train, so check the one you book.',
    q2='How many trains a day run from {a} to {b}?', a2='In the {op} timetable there are {w} direct trains from {a} to {b} on weekdays, {s} on Saturdays and {u} on Sundays. In the other direction: {bw}, {bs} and {bu}.',
    q3='What time is the first and last train from {a} to {b}?', a3='On weekdays the first direct train leaves {a} at {f} and the last at {l} (local time). From {b}, the first leaves at {bf} and the last at {bl}.',
    q4='Which stations does the train use?', a4='Direct trains run from {sa} to {sb}.',
    ready='Ready to go? Compare times and fares for your date and book your seat on Omio.', cmp='Prefer to compare every option?', check='Check schedules & book →', note='Opens in a new tab — come back here anytime.',
    more='More train routes in the United States', home='Home', routes='Routes'),
 'es': dict(badge='Guía de ruta · Estados Unidos', meta='Por WoW Train · Horario consultado en noviembre de 2026 · 3 min de lectura', back='← Todas las rutas',
    title='Tren de {a} a {b}: {dur}, {n} trenes al día', title1='Tren de {a} a {b}: {dur} en el {svc}',
    desc='El tren directo más rápido de {op} de {a} a {b} tarda {dur}. {n} trenes directos de lunes a viernes, el primero a las {f} y el último a las {l}. Estaciones y cómo reservar.',
    h1='Tren de {a} a {b}', lead='El tren directo más rápido de {op} de {a} a {b} tarda {dur}. De lunes a viernes hay {n} trenes directos: el primero sale a las {f} y el último a las {l}.',
    lead1='El tren directo de {op} de {a} a {b} tarda {dur}. Circula una vez al día y sale a las {f}.',
    cta='Reserva {a} → {b} en Omio', ctasub='{op} · {dur} · horarios y precios para tu fecha', btn='Reservar',
    facts='Datos clave', f_fast='Tren directo más rápido: {dur}.', f_n='Trenes directos de {a} a {b}: {w} de lunes a viernes, {s} los sábados y {u} los domingos.',
    f_nb='De {b} a {a}: {w} de lunes a viernes, {s} los sábados y {u} los domingos.', f_fl='Primera y última salida de {a} de lunes a viernes: {f} y {l} (hora local).',
    f_st='Estaciones: {sa} → {sb}.', f_svc='Trenes de esta ruta: {svc}.',
    tips='Antes de viajar', tip1='{op} vende el billete para un tren concreto y el precio suele subir a medida que se acerca la fecha, así que reservar con unos días de antelación suele salir más barato.',
    tip2='Revisa la estación de salida en tu billete: las grandes ciudades de EE. UU. pueden tener más de una.',
    src='Horario del GTFS oficial de {op}, consultado el 27 de noviembre de 2026 para la semana del 8 al 13 de diciembre de 2026. Los horarios cambian por temporada y en festivos, así que confirma tu fecha antes de viajar.',
    faq='Preguntas frecuentes',
    q1='¿Cuánto tarda el tren de {a} a {b}?', a1='El tren directo más rápido tarda {dur}. La duración cambia de un tren a otro, así que revisa la del que reserves.',
    q2='¿Cuántos trenes al día hay de {a} a {b}?', a2='En el horario de {op} hay {w} trenes directos de {a} a {b} de lunes a viernes, {s} los sábados y {u} los domingos. En sentido contrario: {bw}, {bs} y {bu}.',
    q3='¿A qué hora sale el primer y el último tren de {a} a {b}?', a3='De lunes a viernes el primer tren directo sale de {a} a las {f} y el último a las {l} (hora local). Desde {b}, el primero sale a las {bf} y el último a las {bl}.',
    q4='¿Qué estaciones usa el tren?', a4='Los trenes directos van de {sa} a {sb}.',
    ready='¿Listo para salir? Compara horarios y precios para tu fecha y reserva tu asiento en Omio.', cmp='¿Prefieres comparar todas las opciones?', check='Ver horarios y reservar →', note='Se abre en una pestaña nueva; puedes volver cuando quieras.',
    more='Más rutas de tren en Estados Unidos', home='Inicio', routes='Rutas'),
 'fr': dict(badge='Guide d\'itinéraire · États-Unis', meta='Par WoW Train · Horaires consultés en novembre 2026 · 3 min de lecture', back='← Tous les itinéraires',
    title='Train de {a} à {b} : {dur}, {n} trains par jour', title1='Train de {a} à {b} : {dur} à bord du {svc}',
    desc='Le train direct {op} le plus rapide de {a} à {b} met {dur}. {n} trains directs en semaine, le premier à {f}, le dernier à {l}. Gares et réservation.',
    h1='Train de {a} à {b}', lead='Le train direct {op} le plus rapide de {a} à {b} met {dur}. En semaine, il y a {n} trains directs : le premier part à {f} et le dernier à {l}.',
    lead1='Le train direct {op} de {a} à {b} met {dur}. Il circule une fois par jour, au départ de {f}.',
    cta='Réservez {a} → {b} sur Omio', ctasub='{op} · {dur} · horaires et tarifs pour votre date', btn='Réserver',
    facts='Points clés', f_fast='Train direct le plus rapide : {dur}.', f_n='Trains directs de {a} à {b} : {w} en semaine, {s} le samedi, {u} le dimanche.',
    f_nb='De {b} à {a} : {w} en semaine, {s} le samedi, {u} le dimanche.', f_fl='Premier et dernier départ de {a} en semaine : {f} et {l} (heure locale).',
    f_st='Gares : {sa} → {sb}.', f_svc='Trains sur cette ligne : {svc}.',
    tips='Avant de partir', tip1='{op} vend un billet pour un train précis et les tarifs augmentent en général à l\'approche de la date : réserver quelques jours à l\'avance coûte souvent moins cher.',
    tip2='Vérifiez la gare de départ sur votre billet : les grandes villes américaines peuvent en avoir plusieurs.',
    src='Horaires du flux GTFS officiel de {op}, consulté le 27 novembre 2026 pour la semaine du 8 au 13 décembre 2026. Les horaires changent selon la saison et les jours fériés : vérifiez votre date avant de partir.',
    faq='Questions fréquentes',
    q1='Combien de temps dure le trajet en train de {a} à {b} ?', a1='Le train direct le plus rapide met {dur}. La durée varie d\'un train à l\'autre : vérifiez celle du train que vous réservez.',
    q2='Combien de trains par jour de {a} à {b} ?', a2='Dans l\'horaire {op}, il y a {w} trains directs de {a} à {b} en semaine, {s} le samedi et {u} le dimanche. Dans l\'autre sens : {bw}, {bs} et {bu}.',
    q3='À quelle heure partent le premier et le dernier train de {a} à {b} ?', a3='En semaine, le premier train direct quitte {a} à {f} et le dernier à {l} (heure locale). Au départ de {b}, le premier part à {bf} et le dernier à {bl}.',
    q4='Quelles gares le train dessert-il ?', a4='Les trains directs relient {sa} à {sb}.',
    ready='Prêt à partir ? Comparez horaires et tarifs pour votre date et réservez votre place sur Omio.', cmp='Envie de comparer toutes les options ?', check='Voir les horaires et réserver →', note='S\'ouvre dans un nouvel onglet ; revenez quand vous voulez.',
    more='Autres trajets en train aux États-Unis', home='Accueil', routes='Itinéraires'),
 'de': dict(badge='Streckenführer · USA', meta='Von WoW Train · Fahrplan geprüft im November 2026 · 3 Min. Lesezeit', back='← Alle Strecken',
    title='Mit dem Zug von {a} nach {b}: {dur}, {n} Züge pro Tag', title1='Mit dem Zug von {a} nach {b}: {dur} im {svc}',
    desc='Der schnellste direkte {op}-Zug von {a} nach {b} braucht {dur}. {n} Direktzüge an Werktagen, der erste um {f}, der letzte um {l}. Bahnhöfe und Buchung.',
    h1='Mit dem Zug von {a} nach {b}', lead='Der schnellste direkte {op}-Zug von {a} nach {b} braucht {dur}. An Werktagen fahren {n} Direktzüge: der erste um {f}, der letzte um {l}.',
    lead1='Der direkte {op}-Zug von {a} nach {b} braucht {dur}. Er fährt einmal täglich um {f}.',
    cta='{a} → {b} auf Omio buchen', ctasub='{op} · {dur} · Fahrzeiten und Preise für dein Datum', btn='Ticket buchen',
    facts='Das Wichtigste', f_fast='Schnellster Direktzug: {dur}.', f_n='Direktzüge von {a} nach {b}: {w} an Werktagen, {s} samstags, {u} sonntags.',
    f_nb='Von {b} nach {a}: {w} an Werktagen, {s} samstags, {u} sonntags.', f_fl='Erste und letzte Abfahrt in {a} an Werktagen: {f} und {l} (Ortszeit).',
    f_st='Bahnhöfe: {sa} → {sb}.', f_svc='Züge auf dieser Strecke: {svc}.',
    tips='Vor der Reise', tip1='{op} verkauft Tickets für einen bestimmten Zug, und die Preise steigen meist, je näher das Datum rückt. Wer ein paar Tage vorher bucht, zahlt oft weniger.',
    tip2='Prüfe den Abfahrtsbahnhof auf deinem Ticket: Große US-Städte haben teils mehrere Bahnhöfe.',
    src='Fahrplan aus dem offiziellen GTFS-Feed von {op}, geprüft am 27. November 2026 für die Woche vom 8. bis 13. Dezember 2026. Fahrpläne ändern sich je nach Saison und an Feiertagen, prüfe also dein Datum vor der Reise.',
    faq='Häufige Fragen',
    q1='Wie lange dauert die Zugfahrt von {a} nach {b}?', a1='Der schnellste Direktzug braucht {dur}. Die Fahrzeit ist je nach Zug unterschiedlich, prüfe also die deines Zuges.',
    q2='Wie viele Züge fahren täglich von {a} nach {b}?', a2='Im Fahrplan von {op} fahren an Werktagen {w} Direktzüge von {a} nach {b}, samstags {s} und sonntags {u}. In der Gegenrichtung: {bw}, {bs} und {bu}.',
    q3='Wann fährt der erste und der letzte Zug von {a} nach {b}?', a3='An Werktagen fährt der erste Direktzug um {f} in {a} ab, der letzte um {l} (Ortszeit). Ab {b} fährt der erste um {bf}, der letzte um {bl}.',
    q4='Welche Bahnhöfe nutzt der Zug?', a4='Die Direktzüge fahren von {sa} nach {sb}.',
    ready='Bereit zur Abfahrt? Vergleiche Fahrzeiten und Preise für dein Datum und buche deinen Platz auf Omio.', cmp='Lieber alle Optionen vergleichen?', check='Fahrpläne ansehen und buchen →', note='Öffnet sich in einem neuen Tab.',
    more='Weitere Zugstrecken in den USA', home='Startseite', routes='Strecken'),
 'it': dict(badge='Guida al percorso · Stati Uniti', meta='Di WoW Train · Orario verificato a novembre 2026 · 3 min di lettura', back='← Tutti i percorsi',
    title='Treno da {a} a {b}: {dur}, {n} treni al giorno', title1='Treno da {a} a {b}: {dur} sul {svc}',
    desc='Il treno diretto {op} più veloce da {a} a {b} impiega {dur}. {n} treni diretti nei feriali, il primo alle {f}, l\'ultimo alle {l}. Stazioni e prenotazione.',
    h1='Treno da {a} a {b}', lead='Il treno diretto {op} più veloce da {a} a {b} impiega {dur}. Nei giorni feriali ci sono {n} treni diretti: il primo parte alle {f} e l\'ultimo alle {l}.',
    lead1='Il treno diretto {op} da {a} a {b} impiega {dur}. Circola una volta al giorno e parte alle {f}.',
    cta='Prenota {a} → {b} su Omio', ctasub='{op} · {dur} · orari e prezzi per la tua data', btn='Prenota',
    facts='In breve', f_fast='Treno diretto più veloce: {dur}.', f_n='Treni diretti da {a} a {b}: {w} nei feriali, {s} il sabato, {u} la domenica.',
    f_nb='Da {b} a {a}: {w} nei feriali, {s} il sabato, {u} la domenica.', f_fl='Prima e ultima partenza da {a} nei feriali: {f} e {l} (ora locale).',
    f_st='Stazioni: {sa} → {sb}.', f_svc='Treni su questa linea: {svc}.',
    tips='Prima di partire', tip1='{op} vende il biglietto per un treno preciso e le tariffe di solito salgono man mano che la data si avvicina: prenotare qualche giorno prima spesso costa meno.',
    tip2='Controlla la stazione di partenza sul biglietto: le grandi città statunitensi possono averne più di una.',
    src='Orario dal feed GTFS ufficiale di {op}, verificato il 27 novembre 2026 per la settimana dall\'8 al 13 dicembre 2026. Gli orari cambiano con la stagione e nei festivi, quindi controlla la tua data prima di partire.',
    faq='Domande frequenti',
    q1='Quanto dura il viaggio in treno da {a} a {b}?', a1='Il treno diretto più veloce impiega {dur}. La durata cambia da treno a treno, quindi controlla quella del treno che prenoti.',
    q2='Quanti treni al giorno ci sono da {a} a {b}?', a2='Nell\'orario {op} ci sono {w} treni diretti da {a} a {b} nei feriali, {s} il sabato e {u} la domenica. Nel senso opposto: {bw}, {bs} e {bu}.',
    q3='A che ora partono il primo e l\'ultimo treno da {a} a {b}?', a3='Nei feriali il primo treno diretto parte da {a} alle {f} e l\'ultimo alle {l} (ora locale). Da {b}, il primo parte alle {bf} e l\'ultimo alle {bl}.',
    q4='Quali stazioni usa il treno?', a4='I treni diretti vanno da {sa} a {sb}.',
    ready='Pronto a partire? Confronta orari e prezzi per la tua data e prenota il tuo posto su Omio.', cmp='Preferisci confrontare tutte le opzioni?', check='Vedi orari e prenota →', note='Si apre in una nuova scheda.',
    more='Altri percorsi in treno negli Stati Unidos'.replace('Unidos', 'Uniti'), home='Home', routes='Percorsi'),
 'pt': dict(badge='Guia de rota · Estados Unidos', meta='Por WoW Train · Horário consultado em novembro de 2026 · 3 min de leitura', back='← Todas as rotas',
    title='Comboio de {a} para {b}: {dur}, {n} comboios por dia', title1='Comboio de {a} para {b}: {dur} no {svc}',
    desc='O comboio direto {op} mais rápido de {a} para {b} demora {dur}. {n} comboios diretos nos dias úteis, o primeiro às {f}, o último às {l}. Estações e como reservar.',
    h1='Comboio de {a} para {b}', lead='O comboio direto {op} mais rápido de {a} para {b} demora {dur}. Nos dias úteis há {n} comboios diretos: o primeiro parte às {f} e o último às {l}.',
    lead1='O comboio direto {op} de {a} para {b} demora {dur}. Circula uma vez por dia e parte às {f}.',
    cta='Reserve {a} → {b} na Omio', ctasub='{op} · {dur} · horários e preços para a sua data', btn='Reservar',
    facts='Dados principais', f_fast='Comboio direto mais rápido: {dur}.', f_n='Comboios diretos de {a} para {b}: {w} nos dias úteis, {s} ao sábado, {u} ao domingo.',
    f_nb='De {b} para {a}: {w} nos dias úteis, {s} ao sábado, {u} ao domingo.', f_fl='Primeira e última partida de {a} nos dias úteis: {f} e {l} (hora local).',
    f_st='Estações: {sa} → {sb}.', f_svc='Comboios nesta rota: {svc}.',
    tips='Antes de viajar', tip1='A {op} vende o bilhete para um comboio específico e o preço costuma subir à medida que a data se aproxima, por isso reservar com alguns dias de antecedência sai, em geral, mais barato.',
    tip2='Confirme a estação de partida no bilhete: as grandes cidades dos EUA podem ter mais do que uma.',
    src='Horário do feed GTFS oficial da {op}, consultado a 27 de novembro de 2026 para a semana de 8 a 13 de dezembro de 2026. Os horários mudam com a época e nos feriados, por isso confirme a sua data antes de viajar.',
    faq='Perguntas frequentes',
    q1='Quanto tempo demora o comboio de {a} para {b}?', a1='O comboio direto mais rápido demora {dur}. A duração varia de comboio para comboio, por isso confirme a do que reservar.',
    q2='Quantos comboios por dia há de {a} para {b}?', a2='No horário da {op} há {w} comboios diretos de {a} para {b} nos dias úteis, {s} ao sábado e {u} ao domingo. No sentido inverso: {bw}, {bs} e {bu}.',
    q3='A que horas parte o primeiro e o último comboio de {a} para {b}?', a3='Nos dias úteis o primeiro comboio direto parte de {a} às {f} e o último às {l} (hora local). De {b}, o primeiro parte às {bf} e o último às {bl}.',
    q4='Que estações usa o comboio?', a4='Os comboios diretos vão de {sa} para {sb}.',
    ready='Pronto para partir? Compare horários e preços para a sua data e reserve o seu lugar na Omio.', cmp='Prefere comparar todas as opções?', check='Ver horários e reservar →', note='Abre num novo separador.',
    more='Mais rotas de comboio nos Estados Unidos', home='Início', routes='Rotas'),
 'ja': dict(badge='ルートガイド · アメリカ', meta='WoW Train · 2026年11月に時刻表を確認 · 約3分で読めます', back='← すべてのルート',
    title='{a}から{b}への鉄道：所要{dur}、1日{n}本', title1='{a}から{b}への鉄道：{svc}で所要{dur}',
    desc='{a}から{b}への{op}の直通列車は最速{dur}。平日は直通{n}本、始発{f}、最終{l}。駅と予約方法。',
    h1='{a}から{b}への鉄道', lead='{a}から{b}への{op}の直通列車は最速{dur}です。平日は直通列車が{n}本あり、始発は{f}、最終は{l}に出発します。',
    lead1='{a}から{b}への{op}の直通列車は所要{dur}です。1日1本で、{f}に出発します。',
    cta='Omioで{a} → {b}を予約', ctasub='{op} · {dur} · ご希望の日付の時刻と運賃', btn='チケットを予約',
    facts='基本情報', f_fast='最速の直通列車：{dur}。', f_n='{a}から{b}への直通列車：平日{w}本、土曜{s}本、日曜{u}本。',
    f_nb='{b}から{a}へ：平日{w}本、土曜{s}本、日曜{u}本。', f_fl='{a}発の平日の始発と最終：{f}と{l}（現地時間）。',
    f_st='駅：{sa} → {sb}。', f_svc='この区間の列車：{svc}。',
    tips='出発前に', tip1='{op}のきっぷは特定の列車ごとに販売され、運賃は出発日が近づくにつれて上がることが多いため、数日前の予約が割安になりやすいです。',
    tip2='きっぷに記載の出発駅を確認してください。アメリカの大都市には複数の駅がある場合があります。',
    src='時刻は{op}の公式GTFSフィードより、2026年11月27日に2026年12月8日〜13日の週について確認。時刻は季節や祝日で変わるため、出発前にご自分の日付をご確認ください。',
    faq='よくある質問',
    q1='{a}から{b}まで列車で何時間かかりますか？', a1='最速の直通列車で{dur}です。所要時間は列車によって異なるため、予約する列車でご確認ください。',
    q2='{a}から{b}への列車は1日に何本ありますか？', a2='{op}の時刻表では、{a}から{b}への直通列車は平日{w}本、土曜{s}本、日曜{u}本です。逆方向は{bw}本、{bs}本、{bu}本です。',
    q3='{a}から{b}への始発と最終は何時ですか？', a3='平日の直通列車は、{a}発の始発が{f}、最終が{l}です（現地時間）。{b}発は始発{bf}、最終{bl}です。',
    q4='列車はどの駅を利用しますか？', a4='直通列車は{sa}から{sb}まで運行しています。',
    ready='準備はできましたか？Omioでご希望の日付の時刻と運賃を比較し、座席を予約しましょう。', cmp='すべての選択肢を比較したい場合は', check='時刻表を見て予約 →', note='新しいタブで開きます。',
    more='アメリカのその他の鉄道ルート', home='ホーム', routes='ルート'),
 'zh': dict(badge='线路指南 · 美国', meta='WoW Train · 2026 年 11 月核对时刻表 · 阅读约 3 分钟', back='← 全部线路',
    title='{a}到{b}火车：最快{dur}，每天{n}班', title1='{a}到{b}火车：乘{svc}约{dur}',
    desc='{a}到{b}最快的{op}直达列车需{dur}。工作日有{n}班直达车，首班{f}，末班{l}。车站与订票方式。',
    h1='{a}到{b}火车', lead='{a}到{b}最快的{op}直达列车需{dur}。工作日共有{n}班直达车，首班{f}发车，末班{l}发车。',
    lead1='{a}到{b}的{op}直达列车需{dur}，每天一班，{f}发车。',
    cta='在 Omio 预订{a} → {b}', ctasub='{op} · {dur} · 查看你所选日期的时刻和票价', btn='订票',
    facts='要点', f_fast='最快直达列车：{dur}。', f_n='{a}到{b}直达列车：工作日{w}班，周六{s}班，周日{u}班。',
    f_nb='{b}到{a}：工作日{w}班，周六{s}班，周日{u}班。', f_fl='工作日{a}首末班发车时间：{f}和{l}（当地时间）。',
    f_st='车站：{sa} → {sb}。', f_svc='本线路列车：{svc}。',
    tips='出行前须知', tip1='{op}按具体车次售票，票价通常随出发日期临近而上涨，因此提前几天预订往往更便宜。',
    tip2='请核对车票上的出发车站：美国的大城市可能有不止一个车站。',
    src='时刻表来自{op}官方 GTFS 数据，于 2026 年 11 月 27 日核对，适用于 2026 年 12 月 8 日至 13 日这一周。时刻会因季节和节假日而变化，出发前请确认你的日期。',
    faq='常见问题',
    q1='{a}到{b}坐火车要多久？', a1='最快的直达列车需{dur}。不同车次用时不同，请以你预订的车次为准。',
    q2='{a}到{b}每天有多少班火车？', a2='按{op}时刻表，{a}到{b}的直达列车工作日{w}班，周六{s}班，周日{u}班。反方向分别为{bw}班、{bs}班和{bu}班。',
    q3='{a}到{b}的首班和末班车几点？', a3='工作日从{a}出发的首班直达车{f}发车，末班{l}发车（当地时间）。从{b}出发，首班{bf}，末班{bl}。',
    q4='列车停靠哪些车站？', a4='直达列车从{sa}开往{sb}。',
    ready='准备出发了吗？在 Omio 比较你所选日期的时刻和票价并预订座位。', cmp='想比较所有选择？', check='查看时刻并订票 →', note='在新标签页中打开。',
    more='美国更多火车线路', home='首页', routes='线路'),
}


HUBL = {'en': 'Part of our <a href="{u}">United States train guide</a> &rarr;', 'es': 'Parte de nuestra <a href="{u}">guía de trenes en Estados Unidos</a> &rarr;',
        'fr': 'Fait partie de notre <a href="{u}">guide du train aux États-Unis</a> &rarr;', 'de': 'Teil unseres <a href="{u}">Bahnführers für die USA</a> &rarr;',
        'it': 'Fa parte della nostra <a href="{u}">guida ai treni negli Stati Uniti</a> &rarr;', 'pt': 'Faz parte do nosso <a href="{u}">guia de comboios nos Estados Unidos</a> &rarr;',
        'ja': '<a href="{u}">アメリカの鉄道ガイド</a>の一部です &rarr;', 'zh': '属于我们的<a href="{u}">美国火车指南</a> &rarr;'}


BTIP = {  # rutas a Canada
    'en': 'This train crosses the US–Canada border: bring your passport and allow time for the border check.',
    'es': 'Este tren cruza la frontera entre Estados Unidos y Canadá: lleva tu pasaporte y cuenta con el tiempo del control fronterizo.',
    'fr': 'Ce train franchit la frontière entre les États-Unis et le Canada : prenez votre passeport et prévoyez le temps du contrôle frontalier.',
    'de': 'Dieser Zug überquert die Grenze zwischen den USA und Kanada: Nimm deinen Reisepass mit und plane Zeit für die Grenzkontrolle ein.',
    'it': 'Questo treno attraversa il confine tra Stati Uniti e Canada: porta il passaporto e calcola il tempo del controllo di frontiera.',
    'pt': 'Este comboio atravessa a fronteira entre os Estados Unidos e o Canadá: leve o passaporte e conte com o tempo do controlo fronteiriço.',
    'ja': 'この列車はアメリカとカナダの国境を越えます。パスポートを持参し、国境審査の時間を見込んでください。',
    'zh': '本次列车跨越美加边境：请携带护照，并为边境检查预留时间。',
}


ONE = {  # rutas con un solo tren al dia: salida unica en vez de "primera y ultima"
    'en': ('Daily departure from {a}: {f} (local time); from {b}: {bf}.', 'The train leaves {a} once a day at {f} (local time). From {b}, it leaves at {bf}.'),
    'es': ('Salida diaria desde {a}: {f} (hora local); desde {b}: {bf}.', 'El tren sale de {a} una vez al día, a las {f} (hora local). Desde {b} sale a las {bf}.'),
    'fr': ('Départ quotidien de {a} : {f} (heure locale) ; de {b} : {bf}.', 'Le train quitte {a} une fois par jour, à {f} (heure locale). Au départ de {b}, il part à {bf}.'),
    'de': ('Tägliche Abfahrt in {a}: {f} (Ortszeit); in {b}: {bf}.', 'Der Zug fährt einmal täglich um {f} (Ortszeit) in {a} ab. Ab {b} fährt er um {bf}.'),
    'it': ('Partenza giornaliera da {a}: {f} (ora locale); da {b}: {bf}.', 'Il treno parte da {a} una volta al giorno, alle {f} (ora locale). Da {b} parte alle {bf}.'),
    'pt': ('Partida diária de {a}: {f} (hora local); de {b}: {bf}.', 'O comboio parte de {a} uma vez por dia, às {f} (hora local). De {b} parte às {bf}.'),
    'ja': ('{a}発は毎日{f}（現地時間）、{b}発は{bf}です。', '列車は{a}を1日1本、{f}（現地時間）に出発します。{b}発は{bf}です。'),
    'zh': ('{a}每天{f}发车（当地时间），{b}每天{bf}发车。', '列车每天从{a}发车一班，时间为{f}（当地时间）。从{b}出发为{bf}。'),
}


SEG = {  # etiquetas del tramo (el mapa de route-premium.js se engancha debajo de .train-segment)
    'en': ('Duration: {d}', 'Operator: {o}', 'Station: {s}', 'View schedules and book ticket →'),
    'es': ('Duración: {d}', 'Operador: {o}', 'Estación: {s}', 'Ver horarios y reservar billete →'),
    'fr': ('Durée : {d}', 'Opérateur : {o}', 'Gare : {s}', 'Voir les horaires et réserver →'),
    'de': ('Fahrzeit: {d}', 'Betreiber: {o}', 'Bahnhof: {s}', 'Fahrpläne ansehen und buchen →'),
    'it': ('Durata: {d}', 'Operatore: {o}', 'Stazione: {s}', 'Vedi orari e prenota →'),
    'pt': ('Duração: {d}', 'Operador: {o}', 'Estação: {s}', 'Ver horários e reservar →'),
    'ja': ('所要時間：{d}', '運行会社：{o}', '駅：{s}', '時刻表を見て予約 →'),
    'zh': ('用时：{d}', '运营商：{o}', '车站：{s}', '查看时刻并订票 →'),
}

A2ONE = {'en': 'In the {op} timetable there is one direct train a day from {a} to {b}, every day of the week, and one in the other direction.',
         'es': 'En el horario de {op} hay un tren directo al día de {a} a {b}, todos los días de la semana, y otro en sentido contrario.',
         'fr': "Dans l'horaire {op}, il y a un train direct par jour de {a} à {b}, tous les jours de la semaine, et un dans l'autre sens.",
         'de': 'Im Fahrplan von {op} fährt jeden Tag ein Direktzug von {a} nach {b} und einer in der Gegenrichtung.',
         'it': "Nell'orario {op} c'è un treno diretto al giorno da {a} a {b}, tutti i giorni della settimana, e uno nel senso opposto.",
         'pt': 'No horário da {op} há um comboio direto por dia de {a} para {b}, todos os dias da semana, e outro no sentido inverso.'}

A2MIX = {'en': 'Direct trains from {a} to {b} in the {op} timetable: {w} on weekdays, {s} on Saturdays and {u} on Sundays. In the other direction: {bw}, {bs} and {bu}.',
         'es': 'Trenes directos de {a} a {b} en el horario de {op}: {w} de lunes a viernes, {s} los sábados y {u} los domingos. En sentido contrario: {bw}, {bs} y {bu}.',
         'fr': "Trains directs de {a} à {b} dans l'horaire {op} : {w} en semaine, {s} le samedi et {u} le dimanche. Dans l'autre sens : {bw}, {bs} et {bu}.",
         'de': 'Direktzüge von {a} nach {b} im Fahrplan von {op}: werktags {w}, samstags {s} und sonntags {u}. In der Gegenrichtung: {bw}, {bs} und {bu}.',
         'it': "Treni diretti da {a} a {b} nell'orario {op}: {w} nei feriali, {s} il sabato e {u} la domenica. Nel senso opposto: {bw}, {bs} e {bu}.",
         'pt': 'Comboios diretos de {a} para {b} no horário da {op}: {w} nos dias úteis, {s} ao sábado e {u} ao domingo. No sentido inverso: {bw}, {bs} e {bu}.'}

DESC1 = {'en': 'The fastest direct {op} train from {a} to {b} takes {dur}. One direct train a day, leaving at {f}. Stations and how to book.',
         'es': 'El tren directo más rápido de {op} de {a} a {b} tarda {dur}. Un tren directo al día, que sale a las {f}. Estaciones y cómo reservar.',
         'fr': 'Le train direct {op} le plus rapide de {a} à {b} met {dur}. Un train direct par jour, au départ à {f}. Gares et réservation.',
         'de': 'Der schnellste direkte {op}-Zug von {a} nach {b} braucht {dur}. Ein Direktzug pro Tag, Abfahrt um {f}. Bahnhöfe und Buchung.',
         'it': 'Il treno diretto {op} più veloce da {a} a {b} impiega {dur}. Un treno diretto al giorno, in partenza alle {f}. Stazioni e prenotazione.',
         'pt': 'O comboio direto mais rápido da {op} de {a} para {b} demora {dur}. Um comboio direto por dia, com partida às {f}. Estações e como reservar.'}

# Grandes trenes: foto del recorrido en vez de la de la ciudad (assets/img/adventure, creditos en scripts/data/us-photos-credits.json)
ROUTE_IMG = {**{x: 'ld-zephyr.webp' for x in ('chicago-denver', 'denver-emeryville', 'chicago-emeryville', 'denver-salt-lake-city', 'chicago-salt-lake-city', 'emeryville-salt-lake-city')},
             # Southwest Chief: vista desde la ventanilla de un tren de pasajeros sobre el desierto (no fotos de trenes de carga)
             **{x: 'ld-window.webp' for x in ('chicago-los-angeles', 'chicago-albuquerque', 'flagstaff-albuquerque', 'kansas-city-albuquerque', 'los-angeles-flagstaff', 'los-angeles-albuquerque')}}


def photo(cslug):
    f = IMG.get(cslug, cslug)
    if os.path.exists(os.path.join(ROOT, 'assets/img/ciudades', f + '.jpg')): return f + '.jpg'
    if os.path.exists(os.path.join(PKG_IMG, f + '.webp')): return f + '.webp'
    return None


def cname(c, l): return CITY.get(c, {}).get(l, c)


def dur(m, l):
    h, mi = divmod(m, 60)
    if l == 'ja': return f'{h}時間{mi:02d}分' if h else f'{mi}分'
    if l == 'zh': return f'{h}小时{mi:02d}分钟' if h else f'{mi}分钟'
    return (f'{h} h {mi:02d} min' if h else f'{mi} min')


def tm(t, l):
    if not t: return ''
    if l == 'en':
        h, m = map(int, t.split(':'))
        return f"{(h % 12) or 12}:{m:02d} {'am' if h < 12 else 'pm'}"
    return t


def svc_label(r):
    s = [{'Mainline': 'Brightline'}.get(x, x) for x in r['services']]
    return ', '.join(s)


def page_url(slug, l): return f'https://glosx.app/rutas/{slug}/' + ('' if l == 'en' else l + '/')


def build(slug, r, l):
    t = T[l]; e = html.escape
    a, b = cname(r['from'], l), cname(r['to'], l)
    ab, ba = r['dirs']['ab'], r['dirs']['ba']
    W = ab['weekday']; D = dur(r['fastest_min'], l)
    one = W['n'] == 1
    op = r['operator']
    svc = svc_label(r)
    main_svc = svc.split(', ')[0]
    f = dict(a=a, b=b, op=op, dur=D, n=W['n'], f=tm(W.get('first'), l), l=tm(W.get('last'), l),
             w=W['n'], s=ab['saturday']['n'], u=ab['sunday']['n'], bw=ba['weekday']['n'], bs=ba['saturday']['n'], bu=ba['sunday']['n'],
             bf=tm(ba['weekday'].get('first'), l), bl=tm(ba['weekday'].get('last'), l), sa=r['from_station'], sb=r['to_station'], svc=svc)
    fmt = lambda k: t[k].format(**f)
    title = (t['title1'].format(**{**f, 'svc': main_svc}) if one else fmt('title'))
    desc = DESC1[l].format(**f) if one and l in DESC1 else fmt('desc')
    url = page_url(slug, l)
    img_slug = photo(r['cb']) or photo(r['ca'])
    rel = f'adventure/{ROUTE_IMG[slug]}' if slug in ROUTE_IMG else (f'ciudades/{img_slug}' if img_slug else None)
    img = f'https://glosx.app/assets/img/{rel}' if rel else 'https://glosx.app/hero-bg.jpg'
    faqs = [(fmt('q1'), fmt('a1')), (fmt('q2'), fmt('a2')), (fmt('q3'), fmt('a3')), (fmt('q4'), fmt('a4'))]
    if one:
        faqs[2] = (fmt('q3'), ONE[l][1].format(**f))
    if l in A2ONE and {f['w'], f['s'], f['u'], f['bw'], f['bs'], f['bu']} == {1}:  # un tren al dia todos los dias: sin "1 trenes"
        faqs[1] = (fmt('q2'), A2ONE[l].format(**f))
    elif l in A2MIX and 1 in {f['w'], f['s'], f['u'], f['bw'], f['bs'], f['bu']}:  # alguna cifra es 1: la cifra va despues del sustantivo
        faqs[1] = (fmt('q2'), A2MIX[l].format(**f))
    tg_html, tg_faqs = guide(r, f, l)  # guia del viajero (por ahora es/en)
    faqs = faqs + tg_faqs
    ld = {'@context': 'https://schema.org', '@graph': [
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': t['home'], 'item': 'https://glosx.app/'},
            {'@type': 'ListItem', 'position': 2, 'name': t['routes'], 'item': 'https://glosx.app/rutas/'},
            {'@type': 'ListItem', 'position': 3, 'name': fmt('h1'), 'item': url}]},
        {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': x}} for q, x in faqs]},
        {'@type': 'TrainTrip', 'name': fmt('h1'), 'provider': {'@type': 'Organization', 'name': op},
         'departureStation': {'@type': 'TrainStation', 'name': r['from_station']}, 'arrivalStation': {'@type': 'TrainStation', 'name': r['to_station']}},
    ]}
    s = SHELL
    s = s.replace('<html lang="en">', f'<html lang="{HL[l]}">', 1)
    s = re.sub(r'<title>.*?</title>', lambda m: f'<title>{e(title)}</title>', s, count=1, flags=re.S)
    s = re.sub(r'<meta name="description" content="[^"]*" />', lambda m: f'<meta name="description" content="{e(desc)}" />', s, count=1)
    s = re.sub(r'<link rel="canonical" href="[^"]*" />', f'<link rel="canonical" href="{url}" />', s, count=1)
    s = re.sub(r'\n  <link rel="alternate" hreflang="[^"]*" href="[^"]*" />', '', s)
    alts = ''.join(f'\n  <link rel="alternate" hreflang="{HL[x]}" href="{page_url(slug, x)}" />' for x in LANGS) + f'\n  <link rel="alternate" hreflang="x-default" href="{page_url(slug, "en")}" />'
    s = s.replace(f'<link rel="canonical" href="{url}" />', f'<link rel="canonical" href="{url}" />' + alts, 1)
    for k, v in (('og:title', title), ('og:description', desc), ('og:url', url), ('og:image', img)):
        s = re.sub(rf'<meta property="{k}" content="[^"]*" />', lambda m, k=k, v=v: f'<meta property="{k}" content="{e(v)}" />', s, count=1)
    for k, v in (('twitter:title', title), ('twitter:description', desc), ('twitter:image', img)):
        s = re.sub(rf'<meta name="{k}" content="[^"]*" />', lambda m, k=k, v=v: f'<meta name="{k}" content="{e(v)}" />', s, count=1)
    s = re.sub(r'<script type="application/ld\+json">.*?</script>', lambda m: '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>', s, count=1, flags=re.S)
    s = s.replace("url('https://glosx.app/assets/img/hero/colmar.jpg')", (f"url('/assets/img/{rel}')" if rel else "url('/hero-bg.jpg')"))
    # nav: selector de idioma con los 8 y vuelta al indice
    opts = ''.join(f'<a class="lang-option{" active" if x == l else ""}" href="/rutas/{slug}/{"" if x == "en" else x + "/"}">{LNAME[x]}</a>' for x in LANGS)
    s = re.sub(r'<span>EN</span>', f'<span>{l.upper()}</span>', s, count=1)
    s = re.sub(r'<div class="lang-dropdown">.*?</div></div>', f'<div class="lang-dropdown">{opts}</div></div>', s, count=1, flags=re.S)
    idx = '/rutas/' if l == 'en' else f'/{l}/rutas/'
    s = re.sub(r'<a href="/rutas/" class="nav-back">[^<]*</a>', f'<a href="{idx}" class="nav-back">{e(t["back"])}</a>', s, count=1)
    hero = f'''<div class="hero-content">
      <span class="badge">{e(t["badge"])}</span>
      <h1>{e(fmt("h1"))}</h1>
      <p class="meta">{e(t["meta"])}</p>
    </div>'''
    s = re.sub(r'<div class="hero-content">.*?</div>\n  </div>', lambda m: hero + '\n  </div>', s, count=1, flags=re.S)
    link = f'{PROXY}?from={quote(OMIO.get(r["from"], r["from"].lower()))}&amp;to={quote(OMIO.get(r["to"], r["to"].lower()))}'
    facts = [fmt('f_fast'), fmt('f_n'), t['f_nb'].format(**{**f, 'w': f['bw'], 's': f['bs'], 'u': f['bu']}), (ONE[l][0].format(**f) if one else fmt('f_fl')), fmt('f_st'), fmt('f_svc')]
    related = sorted((x for x, rr in DATA['routes'].items() if x != slug and {rr['ca'], rr['cb']} & {r['ca'], r['cb']}),
                     key=lambda x: -DATA['routes'][x]['score'])[:6]
    rel = ''.join(f'\n        <a href="/rutas/{x}/{"" if l == "en" else l + "/"}" class="related-link">{e(cname(DATA["routes"][x]["from"], l))} &rarr; {e(cname(DATA["routes"][x]["to"], l))}</a>' for x in related)
    border = f'<li>{e(BTIP[l])}</li>' if {r['ca'], r['cb']} & BORDER else ''
    faq_html = ''.join(f'\n      <div class="faq-item">\n        <h3 class="faq-q">{e(q)}</h3>\n        <p class="faq-a">{e(x)}</p>\n      </div>' for q, x in faqs)
    main = f'''<main>
    <p class="lead">{e(fmt("lead1") if one else fmt("lead"))}</p>

    <a href="{link}" class="klook-cta" target="_blank" rel="noopener sponsored"
       onclick="gtag('event','klook_click',{{source:'cta_block',route:'{slug}'}});">
      <img class="klook-cta-logo" src="https://www.google.com/s2/favicons?sz=64&domain=omio.com" alt="Omio" loading="lazy" width="40" height="40">
      <div class="klook-cta-text">
        <span class="klook-cta-title">{e(fmt("cta"))}</span>
        <span class="klook-cta-sub">{e(fmt("ctasub"))}</span>
      </div>
      <span class="klook-cta-btn">{e(t["btn"])} &#8599;</span>
    </a>
    <div class="omo" hidden></div>

    <div class="train-segment">
      <div class="train-segment-header">
        <span class="train-segment-title">{e(a)} → {e(b)}</span>
        <span class="train-segment-duration">{e(SEG[l][0].format(d=D))}</span>
      </div>
      <div class="train-segment-details">
        <div class="train-segment-detail"><strong>{e(SEG[l][1].format(o=op))}</strong></div>
        <div class="train-segment-detail"><strong>{e(SEG[l][2].format(s=r["from_station"]))}</strong></div>
      </div>
      <a href="{link}" class="cta-btn" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('route_{slug}_{l}')">{e(SEG[l][3])}</a>
    </div>

    <h2>{e(t["facts"])}</h2>
    <ul>{''.join(f'<li>{e(x)}</li>' for x in facts)}</ul>

    <h2>{e(t["tips"])}</h2>
    <ul><li>{e(fmt("tip1"))}</li><li>{e(t["tip2"])}</li>{border}</ul>
    <p style="font-size:13px;color:#55565f;">{e(fmt("src"))}</p>
    {tg_html}

    <section class="faq">
      <h2>{e(t["faq"])}</h2>{faq_html}
    </section>

    <hr/>
    <p>{e(t["ready"])}</p>
    <p class="tl-secondary" style="text-align:center;margin:10px 0 8px;font-size:14px;color:#55565f;">
      {e(t["cmp"])} <a href="{link}" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('route_{slug}_{l}')">{e(t["check"])}</a>
    </p>
    <p class="tl-note" style="text-align:center;margin:0 0 8px;font-size:12px;color:#6b6b85;">{e(t["note"])}</p>

    <p class="hub-link" style="font-size:14px;margin:8px 0 24px;">{HUBL[l].format(u="/usa-trains/" if l == "en" else f"/{l}/usa-trains/")}</p>
    <div class="related-routes">
      <h2>{e(t["more"])}</h2>
      <div class="related-grid">{rel}
      </div>
    </div>
  </main>'''
    s = re.sub(r'<main>.*?</main>', lambda m: main, s, count=1, flags=re.S)
    return s, img_slug


if __name__ == '__main__':
    slugs = sys.argv[1:] or list(DATA['routes'])
    rd_path = os.path.join(ROOT, 'assets/data/route-data.json')
    rd = json.load(open(rd_path, encoding='utf8'))
    os.makedirs(os.path.join(ROOT, 'assets/img/ciudades'), exist_ok=True)
    for slug in slugs:
        r = DATA['routes'][slug]
        for l in LANGS:
            page, img_slug = build(slug, r, l)
            d = os.path.join(ROOT, 'rutas', slug, '' if l == 'en' else l)
            os.makedirs(d, exist_ok=True)
            open(os.path.join(d, 'index.html'), 'w', encoding='utf8').write(page.replace('EE. UU.', 'EE.\u00a0UU.'))
        if img_slug and img_slug.endswith('.webp'):
            src = os.path.join(PKG_IMG, img_slug); dst = os.path.join(ROOT, 'assets/img/ciudades', img_slug)
            if not os.path.exists(dst): shutil.copy(src, dst)
        rd[slug] = {'a': [round(x, 4) for x in r['a']], 'b': [round(x, 4) for x in r['b']], 'm': {'train': r['fastest_min']}}
        print(f'{slug}: 8 idiomas, foto {img_slug}')
    json.dump(rd, open(rd_path, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
