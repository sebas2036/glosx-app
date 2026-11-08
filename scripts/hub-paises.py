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
# Mosaico: 12 rutas con su foto de portada (Pexels, la misma del hero de cada ruta); nombres tomados del propio índice
MOSAIC = [('paris-amsterdam', 4237160), ('lucerne-zermatt', 19244970), ('oslo-bergen', 6291547), ('tokyo-kyoto', 23345456),
          ('milan-rome', 27541217), ('barcelona-lyon', 8430273), ('london-edinburgh', 35769512), ('vienna-salzburg', 37861319),
          ('kyoto-himeji', 27666787), ('lisbon-porto', 10959393), ('munich-berlin', 37120347), ('nice-monaco', 11956743)]
BLOG = {'en': ('For bloggers', 'Writing about one of these routes? Every route has a card with its times that you can add to your post. Open the route and look for <strong>Add this route to your blog</strong>.'),
        'es': ('Para blogueros', '¿Escribes sobre alguna de estas rutas? Cada ruta tiene una ficha con sus horarios para llevarte a tu artículo. Abre la ruta y busca <strong>Lleva esta ruta a tu blog</strong>.'),
        'fr': ('Pour les blogueurs', 'Vous écrivez sur l’un de ces trajets ? Chaque itinéraire a une fiche avec ses horaires à ajouter à votre article. Ouvrez l’itinéraire et cherchez <strong>Ajoutez cet itinéraire à votre blog</strong>.'),
        'it': ('Per i blogger', 'Scrivi di uno di questi percorsi? Ogni percorso ha una scheda con i suoi orari da aggiungere al tuo articolo. Apri il percorso e cerca <strong>Porta questo percorso sul tuo blog</strong>.'),
        'ja': ('ブロガーの方へ', 'これらのルートについて書いていますか？各ルートには時刻入りのカードがあり、記事に掲載できます。ルートを開いて<strong>「このルートをあなたのブログに」</strong>をご覧ください。')}
PX = lambda i, w: 'https://images.pexels.com/photos/%d/pexels-photo-%d.jpeg?auto=compress&cs=tinysrgb&w=%d' % (i, i, w)
CSS = ('    .hub { max-width:760px; margin:22px auto 0; display:grid; gap:16px; }\n'
       '    .hub-group h2 { font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--muted); margin:0 0 8px; font-weight:700; }\n'
       '    .hub-group h2 span { text-transform:none; letter-spacing:0; font-weight:400; }\n'
       '    .hub-chips { list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; justify-content:center; gap:8px; }\n'
       '    .hub-chips a { display:inline-block; padding:7px 14px; border:1px solid rgba(20,21,26,.16); border-radius:999px; background:#fff; color:var(--text); text-decoration:none; font-size:14px; }\n'
       '    .hub-chips a:hover { border-color:#C10016; color:#C10016; }\n'
       '    .hub-chips small { color:var(--muted); font-size:12px; }\n'
       '    .hub-mosaic { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:6px; width:100%; max-width:none; margin:0; padding:6px; box-sizing:border-box; }\n'
       '    .hub-tile { position:relative; display:block; aspect-ratio:1/1; border-radius:12px; overflow:hidden; background:#e9e4dc; }\n'
       '    .hub-tile img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s ease; }\n'
       '    .hub-tile:hover img { transform:scale(1.06); }\n'
       '    .hub-tile span { position:absolute; left:0; right:0; bottom:0; padding:28px 14px 12px; font-size:clamp(13px,1.25vw,19px); font-weight:700; color:#fff; text-align:left; background:linear-gradient(transparent,rgba(0,0,0,.65)); }\n'
       '    .hub-blog { margin:4px auto 0; max-width:640px; font-size:14px; color:var(--muted); padding:10px 14px; border:1px solid rgba(20,21,26,.12); border-radius:12px; background:#fff; }\n'
       '    .hub-blog b { color:#C10016; }\n'
       '    @media (max-width:760px) { .hub-mosaic { grid-template-columns:repeat(3,minmax(0,1fr)); } .hub-tile:nth-child(n+7) { display:none; } }\n'
       '    @media (prefers-reduced-motion:reduce) { .hub-tile img { transition:none; } }\n')

for lang, t in T.items():
    p = os.path.join(ROOT, t['f'])
    s = open(p, encoding='utf8').read()
    chips = lambda items: '<ul class="hub-chips">' + ''.join('<li><a href="%s">%s</a></li>' % x for x in items) + '</ul>'
    starts = [(HUBS[i], t['hubs'][i] + ('<small>%s</small>' % t['hubnote'] if t['hubnote'] else '')) for i in range(3)]
    countries = [(paths[lang], t['c'][k] + ('<small>%s</small>' % t['esnote'] if k == 'es' and t['esnote'] else '')) for k, paths in COUNTRIES]
    pref = '' if lang == 'en' else lang + '/'
    tiles = ''
    for slug, pid in MOSAIC:
        m = re.search(r'<a href="/rutas/%s/%s">([^<]+)</a>' % (slug, pref), s)
        if not m: continue
        tiles += '<a class="hub-tile" href="/rutas/%s/%s"><img src="%s" alt="" loading="lazy" width="400" height="300"><span>%s</span></a>' % (slug, pref, PX(pid, 400), m.group(1))
    bh, bp = BLOG[lang]
    extra = ('') + ('      <p class="hub-blog"><b>%s</b> · %s</p>\n' % (bh, bp))
    block = ('\n    <p>%s</p>\n    <div class="hub">\n'
             '      <div class="hub-group"><h2>%s</h2>%s</div>\n'
             '      <div class="hub-group"><h2>%s <span>· %s</span></h2>%s</div>\n'
             '%s    </div>\n  ') % (t['intro'], t['start'], chips(starts), t['times'], t['note'], chips(countries), extra)
    s, n = re.subn(r'(<header>\s*<h1>.*?</h1>).*?(</header>)', lambda m: m.group(1) + block + m.group(2), s, count=1, flags=re.S)
    assert n == 1, p
    # mosaico: banda a todo el ancho arriba de todo (debajo del menú, antes del <header> con el título)
    s = re.sub(r'  <div class="hub-mosaic">.*?</div>\n', '', s, flags=re.S)
    s = s.replace('  <header>', '  <div class="hub-mosaic">%s</div>\n  <header>' % tiles.replace('width="400" height="300"', 'width="600" height="600"').replace('w=400', 'w=600'), 1)
    s = re.sub(r'    \.hub \{[\s\S]*?(?=  </style>)', '', s, count=1)
    s = s.replace('</style>', CSS + '  </style>', 1)
    open(p, 'w', encoding='utf8').write(s)
    print(lang, p)
