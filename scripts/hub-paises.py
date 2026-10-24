#!/usr/bin/env python3
"""
Cabecera del índice de rutas (/rutas/ y /{es,fr,it,ja}/rutas/): descripción + dos grupos de chips con etiqueta,
"Puntos de partida" (Londres, París, Eurostar) y "Horarios por país" (páginas de datos abiertos de cada país).
Reemplaza lo que haya entre </h1> y </header> y añade los estilos .hub-* una sola vez. Idempotente.
Uso: python3 scripts/hub-paises.py   (después de node scripts/generate-rutas-hub.js, que regenera es/fr/it/ja)
"""
import os, re

ROOT = os.path.join(os.path.dirname(__file__), '..')
# (clave, ruta por idioma); España solo existe en español
COUNTRIES = [
    ('es', {'en': '/horarios-trenes-espana/', 'es': '/horarios-trenes-espana/', 'fr': '/horarios-trenes-espana/', 'it': '/horarios-trenes-espana/', 'ja': '/horarios-trenes-espana/'}),
    ('ch', {'en': '/swiss-trains/', 'es': '/es/trenes-suiza/', 'fr': '/fr/trains-suisse/', 'it': '/it/treni-svizzera/', 'ja': '/ja/swiss-trains/'}),
    ('at', {'en': '/austria-trains/', 'es': '/es/trenes-austria/', 'fr': '/fr/trains-autriche/', 'it': '/it/treni-austria/', 'ja': '/ja/austria-trains/'}),
    ('no', {'en': '/norway-trains/', 'es': '/es/trenes-noruega/', 'fr': '/fr/trains-norvege/', 'it': '/it/treni-norvegia/', 'ja': '/ja/norway-trains/'}),
    ('se', {'en': '/sweden-trains/', 'es': '/es/trenes-suecia/', 'fr': '/fr/trains-suede/', 'it': '/it/treni-svezia/', 'ja': '/ja/sweden-trains/'}),
    ('fi', {'en': '/finland-trains/', 'es': '/es/trenes-finlandia/', 'fr': '/fr/trains-finlande/', 'it': '/it/treni-finlandia/', 'ja': '/ja/finland-trains/'}),
]
T = {
    'en': dict(f='rutas/index.html', intro='Every route guide on WoW Train: schedules, prices, stations and when to book. Each route is available in English, Spanish, French, Italian and Japanese.',
               start='Popular starting points', times='Train times by country', note='open timetable data: first and last train, trains per day',
               hubs=['Trains from London', 'Trains from Paris', 'UK to Europe by Eurostar'], hubnote='', esnote=' (in Spanish)',
               c={'es': 'Spain', 'ch': 'Switzerland', 'at': 'Austria', 'no': 'Norway', 'se': 'Sweden', 'fi': 'Finland'}),
    'es': dict(f='es/rutas/index.html', intro='Todas las guías de rutas de WoW Train: horarios, precios, estaciones y cuándo reservar. Cada ruta está disponible en inglés, español, francés, italiano y japonés.',
               start='Puntos de partida populares', times='Horarios por país', note='datos abiertos: primer y último tren, trenes al día',
               hubs=['Trenes desde Londres', 'Trenes desde París', 'Reino Unido a Europa en Eurostar'], hubnote=' (en inglés)', esnote='',
               c={'es': 'España', 'ch': 'Suiza', 'at': 'Austria', 'no': 'Noruega', 'se': 'Suecia', 'fi': 'Finlandia'}),
    'fr': dict(f='fr/rutas/index.html', intro='Tous les guides d’itinéraires de WoW Train : horaires, prix, gares et quand réserver. Chaque itinéraire est disponible en anglais, espagnol, français, italien et japonais.',
               start='Points de départ populaires', times='Horaires par pays', note='données ouvertes : premier et dernier train, trains par jour',
               hubs=['Trains depuis Londres', 'Trains depuis Paris', 'Du Royaume-Uni à l’Europe en Eurostar'], hubnote=' (en anglais)', esnote=' (en espagnol)',
               c={'es': 'Espagne', 'ch': 'Suisse', 'at': 'Autriche', 'no': 'Norvège', 'se': 'Suède', 'fi': 'Finlande'}),
    'it': dict(f='it/rutas/index.html', intro='Tutte le guide ai percorsi di WoW Train: orari, prezzi, stazioni e quando prenotare. Ogni percorso è disponibile in inglese, spagnolo, francese, italiano e giapponese.',
               start='Punti di partenza popolari', times='Orari per paese', note='dati aperti: primo e ultimo treno, treni al giorno',
               hubs=['Treni da Londra', 'Treni da Parigi', 'Dal Regno Unito all’Europa con Eurostar'], hubnote=' (in inglese)', esnote=' (in spagnolo)',
               c={'es': 'Spagna', 'ch': 'Svizzera', 'at': 'Austria', 'no': 'Norvegia', 'se': 'Svezia', 'fi': 'Finlandia'}),
    'ja': dict(f='ja/rutas/index.html', intro='WoW Trainの全ルートガイド：時刻、料金、駅、予約のタイミング。各ルートは英語・スペイン語・フランス語・イタリア語・日本語で読めます。',
               start='人気の出発地', times='国別の列車時刻', note='オープンデータ：始発・終電・1日の本数',
               hubs=['ロンドン発の列車', 'パリ発の列車', 'ユーロスターで英国からヨーロッパへ'], hubnote='（英語）', esnote='（スペイン語）',
               c={'es': 'スペイン', 'ch': 'スイス', 'at': 'オーストリア', 'no': 'ノルウェー', 'se': 'スウェーデン', 'fi': 'フィンランド'}),
}
HUBS = ['/trains-from-london/', '/trains-from-paris/', '/trains-from-uk-to-europe/']
CSS = ('    .hub { max-width:760px; margin:22px auto 0; display:grid; gap:16px; }\n'
       '    .hub-group h2 { font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--muted); margin:0 0 8px; font-weight:700; }\n'
       '    .hub-group h2 span { text-transform:none; letter-spacing:0; font-weight:400; }\n'
       '    .hub-chips { list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; justify-content:center; gap:8px; }\n'
       '    .hub-chips a { display:inline-block; padding:7px 14px; border:1px solid rgba(20,21,26,.16); border-radius:999px; background:#fff; color:var(--text); text-decoration:none; font-size:14px; }\n'
       '    .hub-chips a:hover { border-color:#C10016; color:#C10016; }\n'
       '    .hub-chips small { color:var(--muted); font-size:12px; }\n')

for lang, t in T.items():
    p = os.path.join(ROOT, t['f'])
    s = open(p, encoding='utf8').read()
    chips = lambda items: '<ul class="hub-chips">' + ''.join('<li><a href="%s">%s</a></li>' % x for x in items) + '</ul>'
    starts = [(HUBS[i], t['hubs'][i] + ('<small>%s</small>' % t['hubnote'] if t['hubnote'] else '')) for i in range(3)]
    countries = [(paths[lang], t['c'][k] + ('<small>%s</small>' % t['esnote'] if k == 'es' and t['esnote'] else '')) for k, paths in COUNTRIES]
    block = ('\n    <p>%s</p>\n    <div class="hub">\n'
             '      <div class="hub-group"><h2>%s</h2>%s</div>\n'
             '      <div class="hub-group"><h2>%s <span>· %s</span></h2>%s</div>\n'
             '    </div>\n  ') % (t['intro'], t['start'], chips(starts), t['times'], t['note'], chips(countries))
    s, n = re.subn(r'(<header>\s*<h1>.*?</h1>).*?(</header>)', lambda m: m.group(1) + block + m.group(2), s, count=1, flags=re.S)
    assert n == 1, p
    if '.hub-chips' not in s:
        s = s.replace('</style>', CSS + '  </style>', 1)
    open(p, 'w', encoding='utf8').write(s)
    print(lang, p)
