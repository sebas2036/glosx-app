#!/usr/bin/env python3
"""
Hub de China en ingles (solo raiz): /china-trains/. Reusa la plantilla de scripts/generate-country-hubs-en.py (swiss-trains).
Las 113 rutas salen de assets/data/route-data.json (cn=1, minutos en m.train); nombres y estaciones, de la propia pagina de cada ruta.
Uso: python3 scripts/generate-china-hub.py   (desde la raiz del repo). Idempotente.
"""
import importlib.util, json, os, re, html

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
spec = importlib.util.spec_from_file_location('hubs', os.path.join(ROOT, 'scripts/generate-country-hubs-en.py'))
M = importlib.util.module_from_spec(spec); spec.loader.exec_module(M)

RD = json.load(open(os.path.join(ROOT, 'assets/data/route-data.json'), encoding='utf8'))
PRIORITY = ['beijing-shanghai', 'beijing-xian', 'shanghai-hangzhou', 'guangzhou-guilin', 'shenzhen-hong-kong', 'beijing-chengdu',
            'shanghai-suzhou', 'shanghai-nanjing']
routes = []
for slug, v in RD.items():
    if not v.get('cn'): continue
    p = os.path.join(ROOT, 'rutas', slug, 'index.html')
    if not os.path.exists(p): continue
    s = open(p, encoding='utf8').read()
    h1 = re.search(r'<h1>\s*([^<→]+?)\s*(?:→|&rarr;)\s*([^<]+?)\s*</h1>', s)
    st = re.search(r'Main stations:\s*([^<]+?)\.?\s*</li>', s)
    mins = v.get('m', {}).get('train')
    if not (h1 and mins): continue
    stations = html.unescape(st.group(1)).strip() if st else ''
    routes.append(dict(slug=slug, a=html.unescape(h1.group(1)), b=html.unescape(h1.group(2)), country='China',
                       dur=f'{mins // 60}h {mins % 60}m', op=stations))
routes.sort(key=lambda r: (PRIORITY.index(r['slug']) if r['slug'] in PRIORITY else 99, r['a'], r['b']))

M.ROUTES = routes
M.EXCLUDE = set()
M.TOK['china-trains'] = {'China'}
M.pick.__defaults__ = (len(routes),)   # sin tope: las 113

M.H['china-trains'] = dict(
  name='China', title='Trains in China: High-Speed Rail Routes and Times · glosx.app',
  desc='How train travel works in China: G and D high-speed trains, passport-based tickets and main stations, plus {n} routes with fastest journey times and a guide to each one.',
  sub='How the Chinese high-speed rail network works, how to book and what to expect at the station, plus {n} routes with the fastest journey times, each with its own guide.',
  network=[
    'China&rsquo;s national railway is run by <strong>China Railway</strong>, and its high-speed network is the largest in the world. Most city-to-city trips between big cities use <strong>G</strong> and <strong>D</strong> trains, which are fast, frequent and run on dedicated tracks.',
    'Tickets are for a <strong>specific train and seat</strong> and are issued in the passenger&rsquo;s name. You need your <strong>passport</strong> to book and to board, and the station checks it against your ticket.',
    'Allow 30 to 45 minutes before departure for the security check and the ticket and ID check. On long routes, and during Chinese New Year and the October Golden Week, the fastest trains sell out first, so book ahead.'],
  types=[('G trains', 'The fastest high-speed trains (gaotie), on the main long-distance lines between big cities such as Beijing, Shanghai and Guangzhou.'),
         ('D trains', 'High-speed trains (dongche) that are slightly slower than G trains and also serve shorter and regional routes.'),
         ('C trains', 'Intercity trains for short trips between nearby cities, such as the Beijing&ndash;Tianjin and Shanghai&ndash;Suzhou corridors.'),
         ('Z, T and K trains', 'Slower conventional and overnight trains, with sleeper berths, on routes without a high-speed line or when you want to travel overnight.')],
  stations='Big Chinese cities usually have <strong>several stations</strong>, so check the name on your ticket. Examples: <strong>Beijing West</strong> and <strong>Beijing South</strong>, <strong>Shanghai Hongqiao</strong>, <strong>Guangzhou South</strong>, <strong>Shenzhen North</strong>, <strong>Chengdu East</strong> and <strong>Xi&rsquo;an North</strong>. Trains to Hong Kong use <strong>West Kowloon</strong> station, where border checks apply.',
  faq=[('Do I need my passport to take a train in China?', 'Yes. Tickets are issued in the passenger&rsquo;s name and are checked against your passport at the station, so bring it to book and to board.'),
       ('Do I need to book Chinese high-speed trains in advance?', 'It is a good idea. Tickets are for a specific train and seat, and the fastest trains on busy routes sell out first, especially around Chinese New Year and the October Golden Week.'),
       ('How early should I arrive at a Chinese train station?', 'Allow 30 to 45 minutes before departure for the security check and the ticket and ID check. Big stations can be large, so allow extra time to find your platform.'),
       ('Which station will my train use?', 'It depends on the route. Cities such as Beijing, Shanghai and Guangzhou have several stations, so check the station name on your ticket. Each route guide lists the main stations for that journey.')],
  more=[('/blog-china-train-guide.html', 'China train guide'), ('/blog-china-day-trips-by-train.html', 'Day trips by train in China'), ('/blog-china-scenic-train-rides.html', 'Scenic train rides in China'), ('/trains-from-france-to-italy/', 'Trains from France to Italy')],
  extra='')
# el ultimo enlace de "more" es de relleno en el molde; se cambia por los blogs y hubs reales
M.H['china-trains']['more'] = M.H['china-trains']['more'][:3] + [('/rutas/', 'All route guides, Europe, Japan and China')]

s, rts = M.build('china-trains', M.H['china-trains'])
s = s.replace('<th>Operator</th>', '<th>Main stations</th>').replace('<th>Typical journey</th>', '<th>Fastest journey</th>')
s = s.replace('<li><a href="/rutas/">All route guides</a></li></ul>', '</ul>')
os.makedirs(os.path.join(ROOT, 'china-trains'), exist_ok=True)
open(os.path.join(ROOT, 'china-trains', 'index.html'), 'w', encoding='utf8').write(s)
print(f'china-trains: {len(rts)} rutas, {len(s)//1024} KB')
