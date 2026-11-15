"""
Alemán, portugués y chino para las páginas de horarios por país (generate-<pais>-trains.py).
Cada generador llama a extend(globals(), '<pais>') después de definir T y antes del bucle de salida.
Los nombres de ciudad de las guías salen del h1 de rutas/<slug>/<lang>/ (mismo nombre que en la página de la ruta).
"""
import os, re, datetime, html

SLUG = {
    'de': {'austria': 'zuege-oesterreich', 'finland': 'zuege-finnland', 'norway': 'zuege-norwegen', 'sweden': 'zuege-schweden', 'swiss': 'zuege-schweiz'},
    'pt': {'austria': 'comboios-austria', 'finland': 'comboios-finlandia', 'norway': 'comboios-noruega', 'sweden': 'comboios-suecia', 'swiss': 'comboios-suica'},
    'zh': {'austria': 'austria-trains', 'finland': 'finland-trains', 'norway': 'norway-trains', 'sweden': 'sweden-trains', 'swiss': 'swiss-trains'},
}
CNAME = {
    'de': {'austria': 'Österreich', 'finland': 'Finnland', 'norway': 'Norwegen', 'sweden': 'Schweden', 'swiss': 'der Schweiz'},
    'pt': {'austria': 'Áustria', 'finland': 'Finlândia', 'norway': 'Noruega', 'sweden': 'Suécia', 'swiss': 'Suíça'},
    'zh': {'austria': '奥地利', 'finland': '芬兰', 'norway': '挪威', 'sweden': '瑞典', 'swiss': '瑞士'},
}
SRCN = {'austria': ('ÖBB Open Data', 'CC BY 4.0'), 'finland': ('Digitraffic / Fintraffic', 'CC BY 4.0'), 'norway': ('Entur', 'NLOD'),
        'sweden': ('Trafiklab / Samtrafiken', 'CC0'), 'swiss': ('opentransportdata.swiss (SBB)', '')}

COMMON = {
 'de': dict(back='&larr; Alle Strecken', cols=['Strecke', 'Erster Zug', 'Letzter Zug', 'Werktag', 'Samstag', 'Sonntag', 'Schnellste'],
   csv='Daten als CSV herunterladen', csvnote='(eine Zeile pro Verbindung, Richtung und Tagesart).', how='So wurde gerechnet', cite='So zitierst du diese Daten'),
 'pt': dict(back='&larr; Todas as rotas', cols=['Trajeto', 'Primeiro comboio', 'Último comboio', 'Dia útil', 'Sábado', 'Domingo', 'Mais rápido'],
   csv='Descarregar os dados em CSV', csvnote='(uma linha por ligação, sentido e tipo de dia).', how='Como foi calculado', cite='Como citar estes dados'),
 'zh': dict(back='&larr; 全部线路', cols=['区间', '首班车', '末班车', '工作日', '周六', '周日', '最快'],
   csv='下载 CSV 数据', csvnote='（每个区间、方向和日期类型一行）。', how='计算方法', cite='如何引用这些数据'),
}

# Textos propios de cada país: title, desc, h1, sub, guides, src, li (4), dl
TXT = {
 'austria': {
  'de': dict(title='Zugfahrzeiten in Österreich aus offenen ÖBB-Daten · glosx.app',
    desc='Erster Zug, letzter Zug, Direktzüge pro Tag und schnellste Fahrt für {n} Bahnverbindungen in Österreich, aus dem offenen ÖBB-Fahrplan (GTFS, CC BY 4.0). Tabelle und CSV.',
    h1='Züge in Österreich', sub='Erster und letzter Zug, Direktzüge pro Tag und die schnellste Fahrt für {n} Bahnverbindungen in Österreich, von Wien bis in die Alpen, berechnet von glosx.app aus dem offenen Fahrplan der ÖBB.',
    guides='Streckenführer für Österreich', src='Quelle: glosx.app, aus dem offenen ÖBB-Fahrplan (Datenquelle: ÖBB, CC BY 4.0).',
    li=['<strong>Quelle:</strong> der GTFS-Fahrplan (Soll-Fahrplan 2026), veröffentlicht von <a href="{src}" rel="noopener">ÖBB Open Data</a> unter der Lizenz Creative Commons Namensnennung 4.0. Er umfasst die Personenzüge der ÖBB, den City Airport Train und die Montafonerbahn.',
        '<strong>Referenzwoche:</strong> Dienstag, {wd} (Werktag), Samstag, {sa}, und Sonntag, {su}.',
        '<strong>Was zählt:</strong> Direktzüge (Railjet, Intercity, Nightjet, Regionalzüge und S-Bahn), die in dieser Richtung an beiden Bahnhöfen halten, Nachtzüge eingeschlossen. Private Betreiber wie die WESTbahn sind nicht in diesem Fahrplan, Busse sind nicht enthalten.',
        '<strong>Schnellste:</strong> der schnellste Direktzug am Werktag. Die Zeiten ändern sich mit dem Fahrplan: Prüf dein Datum vor der Reise.'],
    dl='Verbindungen in Österreich'),
  'pt': dict(title='Horários de comboios na Áustria com dados abertos da ÖBB · glosx.app',
    desc='Primeiro comboio, último comboio, comboios diretos por dia e viagem mais rápida para {n} ligações ferroviárias na Áustria, a partir do horário aberto da ÖBB (GTFS, CC BY 4.0). Tabela e CSV.',
    h1='Comboios na Áustria', sub='Primeiro e último comboio, comboios diretos por dia e a viagem mais rápida para {n} ligações na Áustria, de Viena aos Alpes, calculados pela glosx.app a partir do horário aberto publicado pela ÖBB.',
    guides='Guias de rotas na Áustria', src='Fonte: glosx.app, a partir do horário aberto da ÖBB (Datenquelle: ÖBB, CC BY 4.0).',
    li=['<strong>Fonte:</strong> o horário GTFS (Soll-Fahrplan 2026) publicado pela <a href="{src}" rel="noopener">ÖBB Open Data</a> com a licença Creative Commons Atribuição 4.0. Inclui os comboios de passageiros da ÖBB, o City Airport Train e a Montafonerbahn.',
        '<strong>Semana de referência:</strong> terça-feira {wd} (dia útil), sábado {sa} e domingo {su}.',
        '<strong>O que conta:</strong> comboios diretos (Railjet, Intercity, Nightjet, regionais e S-Bahn) que param nas duas estações nesse sentido, incluindo comboios noturnos. Operadores privados como a WESTbahn não estão neste horário, e os autocarros não estão incluídos.',
        '<strong>Mais rápido:</strong> o comboio direto mais rápido do dia útil. Os horários mudam: confirme a sua data antes de viajar.'],
    dl='Ligações na Áustria'),
  'zh': dict(title='奥地利火车时刻（ÖBB 开放数据）· glosx.app',
    desc='根据 ÖBB 开放时刻表（GTFS，CC BY 4.0），汇总奥地利 {n} 个铁路区间的首班车、末班车、每天直达车次和最快用时。附表格和 CSV。',
    h1='奥地利火车', sub='从维也纳到阿尔卑斯山，glosx.app 根据 ÖBB 发布的开放时刻表，计算了奥地利 {n} 个区间的首班车、末班车、每天直达车次和最快用时。',
    guides='奥地利线路指南', src='来源：glosx.app，基于 ÖBB 开放时刻表（Datenquelle: ÖBB，CC BY 4.0）。',
    li=['<strong>来源：</strong><a href="{src}" rel="noopener">ÖBB Open Data</a> 以知识共享署名 4.0 许可发布的 GTFS 时刻表（Soll-Fahrplan 2026）。包括 ÖBB 客运列车、City Airport Train 和蒙塔丰铁路。',
        '<strong>参考周：</strong>周二 {wd}（工作日）、周六 {sa} 和周日 {su}。',
        '<strong>统计范围：</strong>在该方向上两站都停靠的直达列车（Railjet、城际列车、Nightjet 夜车、区域列车和 S-Bahn，含夜车）。WESTbahn 等私营运营商不在该时刻表中，也不含巴士。',
        '<strong>最快：</strong>工作日最快的直达列车。时刻会随时刻表变化，出行前请确认你的日期。'],
    dl='奥地利区间'),
 },
 'finland': {
  'de': dict(title='Zugfahrzeiten in Finnland aus offenen Digitraffic-Daten · glosx.app',
    desc='Erster Zug, letzter Zug, Direktzüge pro Tag und schnellste Fahrt für {n} Bahnverbindungen in Finnland, aus dem offenen Personenverkehrsfahrplan von Digitraffic (Fintraffic, CC BY 4.0). Tabelle und CSV.',
    h1='Züge in Finnland', sub='Erster und letzter Zug, Direktzüge pro Tag und die schnellste Fahrt für {n} Bahnverbindungen in Finnland, von Helsinki bis Lappland, berechnet von glosx.app aus dem offenen Personenverkehrsfahrplan von Digitraffic.',
    guides='Streckenführer für Finnland', src='Quelle: glosx.app, aus dem offenen Personenverkehrsfahrplan von Digitraffic (Fintraffic, CC BY 4.0).',
    li=['<strong>Quelle:</strong> der GTFS-Fahrplan für den Personenverkehr, veröffentlicht von <a href="{src}" rel="noopener">Digitraffic</a>, dem offenen Verkehrsdatendienst von Fintraffic, unter der Lizenz Creative Commons Namensnennung 4.0.',
        '<strong>Referenzwoche:</strong> Dienstag, {wd} (Werktag), Samstag, {sa}, und Sonntag, {su}. Einige Saisonzüge, etwa der Nachtzug zur Skisaison nach Kolari, fahren in dieser Woche nicht.',
        '<strong>Was zählt:</strong> direkte Fern- und Regionalzüge der VR sowie Nahverkehrszüge in Helsinki, die in dieser Richtung an beiden Bahnhöfen halten, Nachtzüge eingeschlossen. Busse sind nicht enthalten.',
        '<strong>Schnellste:</strong> der schnellste Direktzug am Werktag. Die Zeiten ändern sich mit dem Fahrplan: Prüf dein Datum vor der Reise.'],
    dl='Verbindungen in Finnland'),
  'pt': dict(title='Horários de comboios na Finlândia com dados abertos da Digitraffic · glosx.app',
    desc='Primeiro comboio, último comboio, comboios diretos por dia e viagem mais rápida para {n} ligações ferroviárias na Finlândia, a partir do horário aberto de passageiros da Digitraffic (Fintraffic, CC BY 4.0). Tabela e CSV.',
    h1='Comboios na Finlândia', sub='Primeiro e último comboio, comboios diretos por dia e a viagem mais rápida para {n} ligações na Finlândia, de Helsínquia à Lapónia, calculados pela glosx.app a partir do horário aberto de passageiros publicado pela Digitraffic.',
    guides='Guias de rotas na Finlândia', src='Fonte: glosx.app, a partir do horário aberto de passageiros da Digitraffic (Fintraffic, CC BY 4.0).',
    li=['<strong>Fonte:</strong> o horário GTFS de passageiros publicado pela <a href="{src}" rel="noopener">Digitraffic</a>, o serviço de dados de tráfego abertos da Fintraffic, com a licença Creative Commons Atribuição 4.0.',
        '<strong>Semana de referência:</strong> terça-feira {wd} (dia útil), sábado {sa} e domingo {su}. Alguns comboios sazonais, como o noturno da época de esqui para Kolari, não circulam nessa semana.',
        '<strong>O que conta:</strong> comboios diretos de longo curso e regionais da VR, e comboios suburbanos de Helsínquia, que param nas duas estações nesse sentido, incluindo comboios noturnos. Os autocarros não estão incluídos.',
        '<strong>Mais rápido:</strong> o comboio direto mais rápido do dia útil. Os horários mudam: confirme a sua data antes de viajar.'],
    dl='Ligações na Finlândia'),
  'zh': dict(title='芬兰火车时刻（Digitraffic 开放数据）· glosx.app',
    desc='根据 Digitraffic（Fintraffic，CC BY 4.0）的开放客运时刻表，汇总芬兰 {n} 个铁路区间的首班车、末班车、每天直达车次和最快用时。附表格和 CSV。',
    h1='芬兰火车', sub='从赫尔辛基到拉普兰，glosx.app 根据 Digitraffic 发布的开放客运时刻表，计算了芬兰 {n} 个区间的首班车、末班车、每天直达车次和最快用时。',
    guides='芬兰线路指南', src='来源：glosx.app，基于 Digitraffic 开放客运时刻表（Fintraffic，CC BY 4.0）。',
    li=['<strong>来源：</strong>Fintraffic 旗下开放交通数据服务 <a href="{src}" rel="noopener">Digitraffic</a> 以知识共享署名 4.0 许可发布的客运 GTFS 时刻表。',
        '<strong>参考周：</strong>周二 {wd}（工作日）、周六 {sa} 和周日 {su}。部分季节性列车（如滑雪季开往科拉里的夜车）该周不运行。',
        '<strong>统计范围：</strong>在该方向上两站都停靠的 VR 直达长途和区域列车，以及赫尔辛基通勤列车，含夜车。不含巴士。',
        '<strong>最快：</strong>工作日最快的直达列车。时刻会随时刻表变化，出行前请确认你的日期。'],
    dl='芬兰区间'),
 },
 'norway': {
  'de': dict(title='Zugfahrzeiten in Norwegen aus offenen Entur-Daten · glosx.app',
    desc='Erster Zug, letzter Zug, Direktzüge pro Tag und schnellste Fahrt für {n} Bahnverbindungen in Norwegen und nach Schweden, aus dem nationalen offenen Fahrplan von Entur (NLOD). Tabelle und CSV sowie Streckenführer.',
    h1='Züge in Norwegen', sub='Erster und letzter Zug, Direktzüge pro Tag und die schnellste Fahrt für {n} Bahnverbindungen in Norwegen (und nach Göteborg und Stockholm), berechnet von glosx.app aus dem nationalen offenen Fahrplan von Entur.',
    guides='Streckenführer für Norwegen', src='Quelle: glosx.app, aus dem nationalen offenen Fahrplan von Entur (NLOD).',
    li=['<strong>Quelle:</strong> der nationale GTFS-Fahrplan, veröffentlicht von <a href="{src}" rel="noopener">Entur</a>, dem nationalen Register für den öffentlichen Verkehr in Norwegen, unter der norwegischen Lizenz für offene Behördendaten (NLOD).',
        '<strong>Referenzwoche:</strong> Dienstag, {wd} (Werktag), Samstag, {sa}, und Sonntag, {su}. Bauarbeiten ändern an anderen Tagen einige Verbindungen (Anfang November 2026 gab es zum Beispiel keine Direktzüge zwischen Oslo und Tønsberg).',
        '<strong>Was zählt:</strong> Direktzüge (Vy, SJ, SJ Nord, Go-Ahead, Flytoget und grenzüberschreitende Züge), die in dieser Richtung an beiden Bahnhöfen halten. Busse, Fähren und Ersatzbusse sind nicht enthalten.',
        '<strong>Schnellste:</strong> der schnellste Direktzug am Werktag. Die Zeiten ändern sich mit dem Fahrplan: Prüf dein Datum vor der Reise.'],
    dl='Verbindungen in Norwegen'),
  'pt': dict(title='Horários de comboios na Noruega com dados abertos da Entur · glosx.app',
    desc='Primeiro comboio, último comboio, comboios diretos por dia e viagem mais rápida para {n} ligações ferroviárias na Noruega e para a Suécia, a partir do horário aberto nacional da Entur (NLOD). Tabela e CSV, e guias de rotas.',
    h1='Comboios na Noruega', sub='Primeiro e último comboio, comboios diretos por dia e a viagem mais rápida para {n} ligações na Noruega (e para Gotemburgo e Estocolmo), calculados pela glosx.app a partir do horário aberto nacional publicado pela Entur.',
    guides='Guias de rotas na Noruega', src='Fonte: glosx.app, a partir do horário aberto nacional da Entur (NLOD).',
    li=['<strong>Fonte:</strong> o horário GTFS nacional publicado pela <a href="{src}" rel="noopener">Entur</a>, o registo nacional de transportes públicos da Noruega, com a Licença Norueguesa de Dados Abertos do Governo (NLOD).',
        '<strong>Semana de referência:</strong> terça-feira {wd} (dia útil), sábado {sa} e domingo {su}. Obras alteram alguns serviços noutras datas (por exemplo, no início de novembro de 2026 não havia comboios diretos entre Oslo e Tønsberg).',
        '<strong>O que conta:</strong> comboios diretos (Vy, SJ, SJ Nord, Go-Ahead, Flytoget e comboios transfronteiriços) que param nas duas estações nesse sentido. Autocarros, ferries e autocarros de substituição não estão incluídos.',
        '<strong>Mais rápido:</strong> o comboio direto mais rápido do dia útil. Os horários mudam: confirme a sua data antes de viajar.'],
    dl='Ligações na Noruega'),
  'zh': dict(title='挪威火车时刻（Entur 开放数据）· glosx.app',
    desc='根据 Entur 的全国开放时刻表（NLOD），汇总挪威境内及往瑞典 {n} 个铁路区间的首班车、末班车、每天直达车次和最快用时。附表格、CSV 和线路指南。',
    h1='挪威火车', sub='glosx.app 根据 Entur 发布的全国开放时刻表，计算了挪威（以及往哥德堡和斯德哥尔摩）{n} 个区间的首班车、末班车、每天直达车次和最快用时。',
    guides='挪威线路指南', src='来源：glosx.app，基于 Entur 全国开放时刻表（NLOD）。',
    li=['<strong>来源：</strong>挪威全国公共交通登记机构 <a href="{src}" rel="noopener">Entur</a> 以挪威政府开放数据许可（NLOD）发布的全国 GTFS 时刻表。',
        '<strong>参考周：</strong>周二 {wd}（工作日）、周六 {sa} 和周日 {su}。施工会改变其他日期的部分班次（例如 2026 年 11 月初，奥斯陆和滕斯贝格之间没有直达列车）。',
        '<strong>统计范围：</strong>在该方向上两站都停靠的直达列车（Vy、SJ、SJ Nord、Go-Ahead、Flytoget 和跨境列车）。不含巴士、渡轮和替代巴士。',
        '<strong>最快：</strong>工作日最快的直达列车。时刻会随时刻表变化，出行前请确认你的日期。'],
    dl='挪威区间'),
 },
 'sweden': {
  'de': dict(title='Zugfahrzeiten in Schweden aus offenen Trafiklab-Daten · glosx.app',
    desc='Erster Zug, letzter Zug, Direktzüge pro Tag und schnellste Fahrt für {n} Bahnverbindungen in Schweden und nach Kopenhagen, Oslo und Narvik, aus dem nationalen offenen Fahrplan von Trafiklab (CC0). Tabelle und CSV sowie Streckenführer.',
    h1='Züge in Schweden', sub='Erster und letzter Zug, Direktzüge pro Tag und die schnellste Fahrt für {n} Bahnverbindungen in Schweden (und nach Kopenhagen, Oslo und Narvik), berechnet von glosx.app aus dem nationalen offenen Fahrplan von Trafiklab.',
    guides='Streckenführer für Schweden', src='Quelle: glosx.app, aus dem nationalen offenen Fahrplan GTFS Sverige 2 (Trafiklab / Samtrafiken, CC0).',
    li=['<strong>Quelle:</strong> der nationale Fahrplan <a href="{src}" rel="noopener">GTFS Sverige 2</a>, veröffentlicht von Trafiklab (Samtrafiken) unter der Gemeinfreiheitserklärung CC0 1.0.',
        '<strong>Referenzwoche:</strong> Dienstag, {wd} (Werktag), Samstag, {sa}, und Sonntag, {su}, im Fahrplan 2027. Die Nachtzüge nach Kiruna, Abisko und Narvik fahren in diesem Fahrplan ab dem 13. Dezember 2026.',
        '<strong>Was zählt:</strong> Direktzüge (SJ, Snälltåget, Vy, VR, Öresundståg, Mälartåg, Norrtåg, Arlanda Express und Regionalzüge), die in dieser Richtung an beiden Bahnhöfen halten, Nachtzüge eingeschlossen. Busse und Fähren sind nicht enthalten.',
        '<strong>Schnellste:</strong> der schnellste Direktzug am Werktag. Die Zeiten ändern sich mit dem Fahrplan: Prüf dein Datum vor der Reise.'],
    dl='Verbindungen in Schweden'),
  'pt': dict(title='Horários de comboios na Suécia com dados abertos da Trafiklab · glosx.app',
    desc='Primeiro comboio, último comboio, comboios diretos por dia e viagem mais rápida para {n} ligações ferroviárias na Suécia e para Copenhaga, Oslo e Narvik, a partir do horário aberto nacional publicado pela Trafiklab (CC0). Tabela e CSV, e guias de rotas.',
    h1='Comboios na Suécia', sub='Primeiro e último comboio, comboios diretos por dia e a viagem mais rápida para {n} ligações na Suécia (e para Copenhaga, Oslo e Narvik), calculados pela glosx.app a partir do horário aberto nacional publicado pela Trafiklab.',
    guides='Guias de rotas na Suécia', src='Fonte: glosx.app, a partir do horário aberto nacional GTFS Sverige 2 (Trafiklab / Samtrafiken, CC0).',
    li=['<strong>Fonte:</strong> o horário nacional <a href="{src}" rel="noopener">GTFS Sverige 2</a>, publicado pela Trafiklab (Samtrafiken) com a dedicação ao domínio público CC0 1.0.',
        '<strong>Semana de referência:</strong> terça-feira {wd} (dia útil), sábado {sa} e domingo {su}, no horário de 2027. Os comboios noturnos para Kiruna, Abisko e Narvik circulam neste horário a partir de 13 de dezembro de 2026.',
        '<strong>O que conta:</strong> comboios diretos (SJ, Snälltåget, Vy, VR, Öresundståg, Mälartåg, Norrtåg, Arlanda Express e regionais) que param nas duas estações nesse sentido, incluindo comboios noturnos. Autocarros e ferries não estão incluídos.',
        '<strong>Mais rápido:</strong> o comboio direto mais rápido do dia útil. Os horários mudam: confirme a sua data antes de viajar.'],
    dl='Ligações na Suécia'),
  'zh': dict(title='瑞典火车时刻（Trafiklab 开放数据）· glosx.app',
    desc='根据 Trafiklab 发布的全国开放时刻表（CC0），汇总瑞典境内及往哥本哈根、奥斯陆和纳尔维克 {n} 个铁路区间的首班车、末班车、每天直达车次和最快用时。附表格、CSV 和线路指南。',
    h1='瑞典火车', sub='glosx.app 根据 Trafiklab 发布的全国开放时刻表，计算了瑞典（以及往哥本哈根、奥斯陆和纳尔维克）{n} 个区间的首班车、末班车、每天直达车次和最快用时。',
    guides='瑞典线路指南', src='来源：glosx.app，基于全国开放时刻表 GTFS Sverige 2（Trafiklab / Samtrafiken，CC0）。',
    li=['<strong>来源：</strong>Trafiklab（Samtrafiken）以 CC0 1.0 公共领域贡献发布的全国时刻表 <a href="{src}" rel="noopener">GTFS Sverige 2</a>。',
        '<strong>参考周：</strong>2027 年时刻表中的周二 {wd}（工作日）、周六 {sa} 和周日 {su}。开往基律纳、阿比斯库和纳尔维克的夜车在该时刻表中自 2026 年 12 月 13 日起运行。',
        '<strong>统计范围：</strong>在该方向上两站都停靠的直达列车（SJ、Snälltåget、Vy、VR、Öresundståg、Mälartåg、Norrtåg、Arlanda Express 和区域列车），含夜车。不含巴士和渡轮。',
        '<strong>最快：</strong>工作日最快的直达列车。时刻会随时刻表变化，出行前请确认你的日期。'],
    dl='瑞典区间'),
 },
 'swiss': {
  'de': dict(title='Zugfahrzeiten in der Schweiz aus offenen SBB-Daten · glosx.app',
    desc='Erster Zug, letzter Zug, Direktzüge pro Tag und schnellste Fahrt für {n} Schweizer Bahnverbindungen, aus dem offenen Fahrplan von opentransportdata.swiss (SBB). Tabelle und CSV sowie Streckenführer.',
    h1='Züge in der Schweiz', sub='Erster und letzter Zug, Direktzüge pro Tag und die schnellste Fahrt für {n} Schweizer Verbindungen, berechnet von glosx.app aus dem offiziellen offenen Fahrplan von opentransportdata.swiss (SBB).',
    guides='Streckenführer für die Schweiz', src='Quelle: glosx.app, aus dem offenen Fahrplan von opentransportdata.swiss (SBB).',
    li=['<strong>Quelle:</strong> der offizielle GTFS-Fahrplan von <a href="{src}" rel="noopener">opentransportdata.swiss</a>, der offenen Datenplattform für den öffentlichen Verkehr der Schweiz, Datei {file}.',
        '<strong>Referenzwoche:</strong> Dienstag, {wd} (Werktag), Samstag, {sa}, und Sonntag, {su}. Bauarbeiten ändern an anderen Tagen einige Verbindungen (Ende Oktober 2026 fuhren zum Beispiel keine Züge zwischen Visp und Zermatt).',
        '<strong>Was zählt:</strong> Direktzüge aller Kategorien (IC, IR, RE, Regional- und Bergbahnen), die in dieser Richtung an beiden Bahnhöfen halten. Busse, Trams, Schiffe und Seilbahnen sind nicht enthalten.',
        '<strong>Schnellste:</strong> der schnellste Direktzug am Werktag. Die Zeiten ändern sich mit dem Fahrplan: Prüf dein Datum vor der Reise.'],
    dl='Verbindungen in der Schweiz'),
  'pt': dict(title='Horários de comboios na Suíça com dados abertos das SBB · glosx.app',
    desc='Primeiro comboio, último comboio, comboios diretos por dia e viagem mais rápida para {n} ligações ferroviárias suíças, a partir do horário aberto da opentransportdata.swiss (SBB). Tabela e CSV, e guias de rotas.',
    h1='Comboios na Suíça', sub='Primeiro e último comboio, comboios diretos por dia e a viagem mais rápida para {n} ligações suíças, calculados pela glosx.app a partir do horário aberto oficial da opentransportdata.swiss (SBB).',
    guides='Guias de rotas na Suíça', src='Fonte: glosx.app, a partir do horário aberto da opentransportdata.swiss (SBB).',
    li=['<strong>Fonte:</strong> o horário GTFS oficial da <a href="{src}" rel="noopener">opentransportdata.swiss</a>, a plataforma de dados abertos dos transportes públicos suíços, ficheiro {file}.',
        '<strong>Semana de referência:</strong> terça-feira {wd} (dia útil), sábado {sa} e domingo {su}. Obras alteram alguns serviços noutras datas (por exemplo, no final de outubro de 2026 não havia comboios entre Visp e Zermatt).',
        '<strong>O que conta:</strong> comboios diretos de todas as categorias (IC, IR, RE, regionais e de montanha) que param nas duas estações nesse sentido. Autocarros, elétricos, barcos e teleféricos não estão incluídos.',
        '<strong>Mais rápido:</strong> o comboio direto mais rápido do dia útil. Os horários mudam: confirme a sua data antes de viajar.'],
    dl='Ligações na Suíça'),
  'zh': dict(title='瑞士火车时刻（SBB 开放数据）· glosx.app',
    desc='根据 opentransportdata.swiss（SBB）的开放时刻表，汇总瑞士 {n} 个铁路区间的首班车、末班车、每天直达车次和最快用时。附表格、CSV 和线路指南。',
    h1='瑞士火车', sub='glosx.app 根据 opentransportdata.swiss（SBB）的官方开放时刻表，计算了瑞士 {n} 个区间的首班车、末班车、每天直达车次和最快用时。',
    guides='瑞士线路指南', src='来源：glosx.app，基于 opentransportdata.swiss（SBB）开放时刻表。',
    li=['<strong>来源：</strong>瑞士公共交通开放数据平台 <a href="{src}" rel="noopener">opentransportdata.swiss</a> 的官方 GTFS 时刻表，文件 {file}。',
        '<strong>参考周：</strong>周二 {wd}（工作日）、周六 {sa} 和周日 {su}。施工会改变其他日期的部分班次（例如 2026 年 10 月底，菲斯普和采尔马特之间没有列车）。',
        '<strong>统计范围：</strong>在该方向上两站都停靠的各类直达列车（IC、IR、RE、区域列车和登山铁路）。不含巴士、有轨电车、游船和缆车。',
        '<strong>最快：</strong>工作日最快的直达列车。时刻会随时刻表变化，出行前请确认你的日期。'],
    dl='瑞士区间'),
 },
}

CITE = {'de': 'Fahrplandaten: {s}{lic}, aufbereitet von <strong>glosx.app</strong>, <a href="{{url}}">{{url}}</a>.',
        'pt': 'Dados de horários: {s}{lic}, tratados pela <strong>glosx.app</strong>, <a href="{{url}}">{{url}}</a>.',
        'zh': '时刻表数据：{s}{lic}，由 <strong>glosx.app</strong> 处理，<a href="{{url}}">{{url}}</a>。'}
SHOW = {'de': ('glosx.app veröffentlicht auch Zugfahrzeiten in {links} und ist in den <a href="{{sc}}" rel="noopener">Showcases von opentransportdata.swiss (SBB)</a> vertreten.', ' und '),
        'pt': ('A glosx.app também publica horários de comboios em {links}, e está entre os <a href="{{sc}}" rel="noopener">showcases da opentransportdata.swiss (SBB)</a>.', ' e '),
        'zh': ('glosx.app 还发布了{links}的火车时刻，并入选 <a href="{{sc}}" rel="noopener">opentransportdata.swiss（SBB）的展示案例</a>。', '、')}
LAP = {
 'de': ('Was du in Lappland unternehmen kannst', 'Viele Reisende fahren mit dem Zug nach Rovaniemi, um Polarlichter zu sehen und das Weihnachtsmanndorf zu besuchen. Die Polarlichtsaison dauert von Ende August bis Anfang April.', [('tours', 'Touren in Lappland', 'Polarlicht-, Husky- und Rentiertouren ab Rovaniemi'), ('santa', 'Weihnachtsmanndorf', 'Geführter Besuch ab dem Zentrum von Rovaniemi'), ('daytrips', 'Tagesausflüge in Lappland', 'Ausflüge und Aktivitäten für einen Tag')], 'Auf Klook ansehen'),
 'pt': ('O que fazer na Lapónia', 'Muitos viajantes apanham o comboio para Rovaniemi para ver a aurora boreal e visitar a Aldeia do Pai Natal. A época das auroras vai do final de agosto ao início de abril.', [('tours', 'Passeios na Lapónia', 'Aurora boreal, huskies e renas a partir de Rovaniemi'), ('santa', 'Aldeia do Pai Natal', 'Visita guiada a partir do centro de Rovaniemi'), ('daytrips', 'Excursões de um dia na Lapónia', 'Excursões e atividades para um dia')], 'Ver na Klook'),
 'zh': ('在拉普兰可以做什么', '很多旅行者坐火车去罗瓦涅米看北极光、参观圣诞老人村。极光季从 8 月底持续到 4 月初。', [('tours', '拉普兰游览', '从罗瓦涅米出发的极光、哈士奇和驯鹿之旅'), ('santa', '圣诞老人村', '从罗瓦涅米市中心出发的导览'), ('daytrips', '拉普兰一日游', '一天的游览和活动')], '在 Klook 查看'),
}

def _fdate(s, l):
    d = datetime.date.fromisoformat(s)
    if l in ('es', 'fr', 'it', 'pt'): return d.strftime('%d/%m/%Y')
    if l == 'de': return d.strftime('%d.%m.%Y')
    if l in ('ja', 'zh'): return f'{d.year}年{d.month}月{d.day}日'
    return d.strftime('%-d %B %Y')

def extend(g, country):
    root = g['ROOT']
    T = g['T']
    others = [c for c in ('swiss', 'austria', 'norway', 'sweden', 'finland') if c != country]
    for l in ('de', 'pt', 'zh'):
        x = dict(TXT[country][l]); x.update(COMMON[l])
        x.update(dir=f'{l}/{SLUG[l][country]}', tpl=f'{l}/rutas/index.html', home=f'/{l}/', all_routes=f'/{l}/rutas/', suffix=f'{l}/')
        s, lic = SRCN[country]
        x['citetxt'] = CITE[l].format(s=s, lic=f' ({lic})' if lic else '')
        links = [f'<a href="/{l}/{SLUG[l][c]}/">{CNAME[l][c]}</a>' for c in others]
        sep = SHOW[l][1]
        joined = (', '.join(links[:-1]) + sep + links[-1]) if l != 'zh' else sep.join(links)
        x['showcase'] = SHOW[l][0].format(links=joined)
        T[l] = x
    for l in ('de', 'pt', 'zh'):
        g['BOOK'][l] = {'de': ('Buchen', 'Auf Omio buchen'), 'pt': ('Reservar', 'Reservar na Omio'), 'zh': ('预订', '在 Omio 预订')}[l]
        g['CAT_LANG'][l] = 'de'   # Omio solo tiene catálogo es/fr/it/de: de para alemán, y la página oficial en alemán para pt/zh (igual que en/ja)
        names = g['NAMES'].setdefault(l, {})
        for slug in g.get('GUIDES') or g.get('SWISS_GUIDES') or []:
            p = os.path.join(root, 'rutas', slug, l, 'index.html')
            if not os.path.exists(p): continue
            m = re.search(r'<h1[^>]*>([^<]*)', open(p, encoding='utf8').read())
            if not m: continue
            parts = [html.unescape(v).strip() for v in m.group(1).split('→')]
            words = slug.split('-')
            if len(parts) == len(words):
                for w, v in zip(words, parts): names.setdefault(w, v)
    g['fdate'] = _fdate
    if 'LAP' in g:
        g['LAP'].update(LAP)
        orig = g['lap_html']
        g['lap_html'] = lambda lang, _o=orig: _o(lang) if lang in ('en', 'es', 'fr', 'it', 'ja') else _o(lang).replace('&amp;lang=%s"' % lang, '&amp;lang=en"')
