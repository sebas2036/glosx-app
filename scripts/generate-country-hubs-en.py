#!/usr/bin/env python3
"""
Hubs de pais en ingles (solo raiz): germany-trains, spain-trains, italy-trains, france-trains, benelux-trains.
Mismo diseno que swiss-trains (cabecera, estilos y pie se copian de swiss-trains/index.html). Cada hub: como funciona la red
(operadoras, tipos de tren), tabla de rutas con duracion y enlace (sin precios) y FAQ con datos estructurados.
Las rutas salen de scripts/generate-routes.js (duracion y operador son los de cada pagina de ruta).
EXCLUDE: rutas en prueba de titulos hasta el 20-dic-2026 (se agregan despues): frankfurt-cologne, barcelona-valencia.
Uso: python3 scripts/generate-country-hubs-en.py   (desde la raiz del repo). Idempotente.
"""
import re, json, os, html

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
EXCLUDE = {'frankfurt-cologne', 'barcelona-valencia'}
IMPR = json.load(open(os.path.join(ROOT, 'scripts/data/hub-order-en.json'), encoding='utf8')) if os.path.exists(os.path.join(ROOT, 'scripts/data/hub-order-en.json')) else {}
TODAY = '2026-11-22'

# ---- rutas (generate-routes.js) ----
g = open(os.path.join(ROOT, 'scripts/generate-routes.js'), encoding='utf8').read()
i = g.index('const routes = ['); j = g.index('\n];\n', i)
ROUTES = []
for m in re.finditer(r"\{\s*slug:\s*'([^']+)',\s*from:\s*'([^']+)',\s*to:\s*'([^']+)',\s*country:\s*'([^']+)',\s*duration:\s*'([^']+)',\s*operator:\s*'([^']+)'", g[i:j]):
    if os.path.exists(os.path.join(ROOT, 'rutas', m.group(1), 'index.html')):
        ROUTES.append(dict(slug=m.group(1), a=m.group(2), b=m.group(3), country=m.group(4), dur=m.group(5), op=m.group(6)))

def dur(s):
    h = re.search(r'(\d+)\s*h', s); mi = re.search(r'(\d+)\s*m', s)
    h = int(h.group(1)) if h else 0; mi = int(mi.group(1)) if mi else 0
    if h and mi: return f'{h} h {mi:02d} min'
    return f'{h} h' if h else f'{mi} min'

TOK = {  # el campo country de cada ruta ("Spain", "France-Italy", ...) decide a que hubs pertenece
    'germany-trains': {'Germany'}, 'spain-trains': {'Spain'}, 'italy-trains': {'Italy'}, 'france-trains': {'France'},
    'benelux-trains': {'Netherlands', 'Belgium', 'Luxembourg'},
}

def pick(hub, limit=20):
    out = []
    for r in ROUTES:
        if r['slug'] in EXCLUDE: continue
        toks = set(r['country'].split('-'))
        if toks & TOK[hub]:
            domestic = toks <= TOK[hub]
            out.append((0 if domestic else 1, -IMPR.get(r['slug'], 0), r['slug'], r))
    out.sort(key=lambda x: x[:3])
    return [x[3] for x in out[:limit]]

H = {
 'germany-trains': dict(
   name='Germany', title='Trains in Germany: ICE and Regional Routes · glosx.app',
   desc='How train travel works in Germany: Deutsche Bahn, ICE, IC and regional trains, plus {n} popular routes with typical journey times and a guide to each one.',
   sub='How the German rail network works, the main train types and {n} popular routes with typical journey times, each with its own route guide.',
   network=[
     '<strong>Deutsche Bahn (DB)</strong> runs most long-distance trains and the national ticket system. Regional trains are run by DB Regio and other regional operators, and <strong>FlixTrain</strong> operates a few long-distance lines in competition.',
     'Most city-to-city journeys use the <strong>ICE</strong> high-speed network (up to 300 km/h on the fastest lines) or <strong>IC/EC</strong> intercity trains. Regional trains (RE, RB) and city railways (S-Bahn) are slower and stop more often.',
     'DB sells <strong>Sparpreis</strong> fares (cheaper, tied to a specific train) and <strong>Flexpreis</strong> fares (valid on any train that day). Regional trains are also covered by the monthly Deutschland-Ticket.'],
   types=[('ICE', 'High-speed long-distance trains between the big cities.'),
          ('IC / EC', 'Intercity and EuroCity trains on slower main lines and to neighbouring countries.'),
          ('RE / RB', 'Regional express and regional trains: slower, many stops, the cheapest way for short trips.'),
          ('S-Bahn', 'Suburban railways inside the big city regions (Berlin, Munich, Frankfurt, Hamburg, Cologne).')],
   stations='The main stations are <strong>Berlin Hbf</strong>, <strong>M&uuml;nchen Hbf</strong>, <strong>Frankfurt (Main) Hbf</strong>, <strong>K&ouml;ln Hbf</strong> and <strong>Hamburg Hbf</strong> (Hbf stands for Hauptbahnhof, the central station). Frankfurt Airport has its own long-distance station.',
   faq=[('Do I need to reserve a seat on German trains?', 'Not for travel, but a seat reservation is optional on ICE and IC trains and worth adding at busy times. A Sparpreis ticket is valid only on the train you booked.'),
        ('What is the fastest way between German cities?', 'The ICE. On the main lines it is faster than driving between large cities such as Frankfurt, Cologne and Berlin.'),
        ('Where can I buy German train tickets?', 'On the Deutsche Bahn site and app, at station machines and counters, or through booking platforms such as Omio, which also sell tickets for trains in other countries.')],
   more=[('/trains-from-germany-to-italy/', 'Trains from Germany to Italy'), ('/swiss-trains/', 'Trains in Switzerland'), ('/austria-trains/', 'Trains in Austria'), ('/benelux-trains/', 'Trains in Belgium and the Netherlands')],
   extra=''),
 'spain-trains': dict(
   name='Spain', title='Trains in Spain: AVE, Ouigo and Iryo Routes · glosx.app',
   desc='How train travel works in Spain: Renfe AVE, Avlo, Alvia, Ouigo and Iryo, plus {n} popular routes with typical journey times and a guide to each one.',
   sub='How the Spanish rail network works, the main train types and {n} popular routes with typical journey times, each with its own route guide.',
   network=[
     '<strong>Renfe</strong> is the national operator and runs the AVE high-speed trains, the cheaper <strong>Avlo</strong>, and the Alvia, Euromed, Intercity and Media Distancia services. <strong>Ouigo</strong> and <strong>Iryo</strong> compete on the busiest high-speed lines, including Madrid&ndash;Barcelona, Madrid&ndash;Valencia and Madrid&ndash;Andalusia.',
     'High-speed and long-distance tickets are for a <strong>specific train and seat</strong>, so you book a departure, not just a route. Fares usually rise as the date gets closer.',
     'Madrid and Barcelona are the main hubs. Most high-speed lines leave from Madrid; the Barcelona&ndash;Madrid, Barcelona&ndash;Valencia and Madrid&ndash;Valencia lines are among the busiest.'],
   types=[('AVE', 'Renfe high-speed trains, the fastest option between the big cities.'),
          ('Avlo, Ouigo, Iryo', 'Lower-fare high-speed services; Ouigo and Iryo are private operators that compete with Renfe.'),
          ('Alvia / Euromed', 'Fast long-distance trains that use both high-speed and conventional lines.'),
          ('Media Distancia / Cercan&iacute;as', 'Regional and commuter trains for shorter trips.')],
   stations='In Madrid, high-speed trains leave from <strong>Atocha</strong> or <strong>Chamart&iacute;n</strong>; in Barcelona from <strong>Sants</strong>; in Valencia the high-speed station is <strong>Joaqu&iacute;n Sorolla</strong>; in Seville <strong>Santa Justa</strong>. Check the departure station on your ticket, because big cities have more than one.',
   faq=[('Do I need to book Spanish high-speed trains in advance?', 'Yes, you need a ticket for a specific train. Booking early usually gives lower fares, especially on routes shared by Renfe, Ouigo and Iryo.'),
        ('Is there a security check at Spanish train stations?', 'High-speed and long-distance trains from the main stations have a baggage check, so arrive a few minutes earlier than for a regional train.'),
        ('Where can I see open timetable data for Spain?', 'Our page on <a href="/en/horarios-trenes-espana/">train times in Spain from open Renfe data</a> lists first and last trains and daily departures for Renfe high-speed and long-distance trips.')],
   more=[('/en/horarios-trenes-espana/', 'Train times in Spain from open Renfe data'), ('/trains-from-france-to-spain/', 'Trains from France to Spain'), ('/france-trains/', 'Trains in France'), ('/italy-trains/', 'Trains in Italy')],
   extra=''),
 'italy-trains': dict(
   name='Italy', title='Trains in Italy: Frecciarossa and Italo Routes · glosx.app',
   desc='How train travel works in Italy: Trenitalia Frecciarossa, Italo and regional trains, plus {n} popular routes with typical journey times and a guide to each one.',
   sub='How the Italian rail network works, the main train types and {n} popular routes with typical journey times, each with its own route guide.',
   network=[
     '<strong>Trenitalia</strong> runs the Frecciarossa, Frecciargento and Frecciabianca fast trains, the Intercity trains and the regional trains. <strong>Italo</strong> is a private operator that competes on the main high-speed line between Turin, Milan, Bologna, Florence, Rome and Naples.',
     'Fast trains have <strong>assigned seats</strong>, so you buy a specific departure. Regional trains (<em>Regionale</em>) have no seat reservation, and a regional paper ticket must be <strong>validated at the machine before boarding</strong>.',
     'Most visitors use the north&ndash;south spine: Milan, Bologna, Florence, Rome and Naples, linked by frequent high-speed trains.'],
   types=[('Frecciarossa', 'Trenitalia high-speed trains on the main lines, the fastest option between big cities.'),
          ('Italo', 'Private high-speed trains on the same corridor, with their own fares and stations in some cities.'),
          ('Frecciargento / Frecciabianca', 'Fast trains that mix high-speed and conventional lines.'),
          ('Intercity / Regionale', 'Slower trains for shorter trips and smaller towns, with the lowest fares.')],
   stations='The main stations are <strong>Roma Termini</strong>, <strong>Milano Centrale</strong>, <strong>Firenze Santa Maria Novella</strong>, <strong>Venezia Santa Lucia</strong> and <strong>Napoli Centrale</strong>. Some cities have a second station, so check the name on your ticket.',
   faq=[('Do I need to reserve Italian high-speed trains?', 'Yes. Frecciarossa and Italo tickets are for a specific train and seat. Regional trains do not need a reservation.'),
        ('Do I have to validate my train ticket in Italy?', 'Paper regional tickets must be validated at the station machine before you board. Tickets bought for a specific fast train, and e-tickets, do not need it.'),
        ('Which Italian cities are best connected by train?', 'Milan, Bologna, Florence, Rome and Naples sit on the main high-speed line and have the most frequent departures.')],
   more=[('/trains-from-france-to-italy/', 'Trains from France to Italy'), ('/trains-from-germany-to-italy/', 'Trains from Germany to Italy'), ('/swiss-trains/', 'Trains in Switzerland'), ('/spain-trains/', 'Trains in Spain')],
   extra=''),
 'france-trains': dict(
   name='France', title='Trains in France: TGV, OUIGO and TER Routes · glosx.app',
   desc='How train travel works in France: SNCF TGV INOUI, OUIGO, Intercit&eacute;s and TER, plus {n} popular routes with typical journey times and a guide to each one.',
   sub='How the French rail network works, the main train types and {n} popular routes with typical journey times, each with its own route guide.',
   network=[
     '<strong>SNCF Voyageurs</strong> runs most trains: the <strong>TGV INOUI</strong> high-speed trains, the low-cost <strong>OUIGO</strong>, the <strong>Intercit&eacute;s</strong> long-distance trains and the regional <strong>TER</strong> network. International services such as Eurostar, TGV Lyria (to Switzerland) and the Paris&ndash;Milan trains share the same stations.',
     'Most high-speed lines start in Paris, so a trip between two provincial cities may go through Paris or use one of the cross-country TGV lines. High-speed tickets are for a <strong>specific train and seat</strong>.',
     'Paris has several main stations, each serving different regions, so always check which one your train leaves from.'],
   types=[('TGV INOUI', 'The SNCF high-speed trains between Paris, Lyon, Marseille, Bordeaux, Strasbourg and other cities.'),
          ('OUIGO', 'SNCF low-cost high-speed service with fewer extras and stricter baggage rules.'),
          ('Intercit&eacute;s', 'Long-distance trains on conventional lines, including some night and mountain routes.'),
          ('TER', 'Regional express trains run by each region, for shorter trips and smaller towns.')],
   stations='In Paris, <strong>Gare du Nord</strong> serves Eurostar, Brussels and Amsterdam; <strong>Gare de Lyon</strong> serves Lyon, the south-east, Switzerland and Italy; <strong>Gare de l&rsquo;Est</strong> serves Strasbourg and Germany; <strong>Montparnasse</strong> serves Bordeaux and the west. Lyon has <strong>Part-Dieu</strong> and Perrache, and Nice has <strong>Nice-Ville</strong>.',
   faq=[('Do I need to book TGV trains in advance?', 'Yes, TGV INOUI and OUIGO tickets are for a specific train and seat. Fares usually rise as the date gets closer.'),
        ('Which Paris station do I need?', 'It depends on where you are going. Gare du Nord for the UK, Belgium and the Netherlands; Gare de Lyon for Lyon, the south-east, Switzerland and Italy; Gare de l&rsquo;Est for Strasbourg and Germany; Montparnasse for Bordeaux and the west.'),
        ('What is the difference between TGV INOUI and OUIGO?', 'Both are SNCF high-speed trains. OUIGO is the low-cost version, with lower fares, fewer services on board and extra charges for some luggage.')],
   more=[('/trains-from-paris/', 'Trains from Paris'), ('/trains-from-france-to-spain/', 'Trains from France to Spain'), ('/trains-from-france-to-italy/', 'Trains from France to Italy'), ('/swiss-trains/', 'Trains in Switzerland')],
   extra=''),
 'benelux-trains': dict(
   name='Belgium and the Netherlands', title='Trains in Belgium and the Netherlands: Routes · glosx.app',
   desc='How train travel works in Belgium and the Netherlands: Eurostar, NS and SNCB trains, plus {n} popular routes with typical journey times and a guide to each one.',
   sub='How rail works in Belgium and the Netherlands, the main train types and {n} popular routes with typical journey times, each with its own route guide.',
   network=[
     '<strong>NS</strong> runs the Dutch network and <strong>SNCB/NMBS</strong> the Belgian one. International high-speed trains between Brussels, Amsterdam, Paris and London are run by <strong>Eurostar</strong> (the former Thalys trains are now part of Eurostar), and <strong>ICE</strong> trains link Amsterdam with Germany.',
     'Local and intercity trains in both countries run frequently and do not need a seat reservation. International high-speed trains between countries are booked for a <strong>specific train</strong>.',
     'The area is compact: Brussels to Amsterdam is a few hours by high-speed train, and Brussels to Bruges is a short intercity ride.'],
   types=[('Eurostar', 'International high-speed trains between Brussels, Amsterdam, Paris and London.'),
          ('ICE', 'German high-speed trains that connect the Netherlands with Germany.'),
          ('Intercity (NS / SNCB)', 'Frequent domestic trains between the main cities, no reservation needed.'),
          ('Sprinter / local', 'Slower stopping trains for short trips.')],
   stations='In Brussels most international trains use <strong>Brussels-Midi / Brussels-Zuid</strong>; in Amsterdam the main station is <strong>Amsterdam Centraal</strong>; Bruges has its own station in the city centre.',
   faq=[('Do I need to book trains between Brussels and Amsterdam?', 'The international high-speed trains are booked for a specific train, so reserve ahead. Intercity trains within each country do not need a reservation.'),
        ('Which station do I use in Brussels?', 'Most international trains, including Eurostar, use Brussels-Midi (also written Brussels-Zuid). Domestic trains also stop at Brussels-Central and Brussels-North.'),
        ('Is the train a good way to see Bruges?', 'Yes. Bruges is a short train ride from Brussels and the station is a walk from the historic centre.')],
   more=[('/trains-from-london/', 'Trains from London'), ('/trains-from-paris/', 'Trains from Paris'), ('/germany-trains/', 'Trains in Germany'), ('/france-trains/', 'Trains in France')],
   extra=''),
}

# ---- plantilla: se copia de swiss-trains ----
SW = open(os.path.join(ROOT, 'swiss-trains/index.html'), encoding='utf8').read()

def build(slug, c):
    rts = pick(slug)
    n = len(rts)
    url = f'https://glosx.app/{slug}/'
    sub = c['sub'].format(n=n)
    desc = c['desc'].format(n=n)
    desc_plain = html.unescape(re.sub(r'<[^>]+>', '', desc))
    title_plain = html.unescape(c['title'])
    s = SW
    s = re.sub(r'<title>.*?</title>', lambda m: f'<title>{html.escape(title_plain, quote=False)}</title>', s, count=1, flags=re.S)
    s = re.sub(r'<meta name="description" content="[^"]*" />', lambda m: f'<meta name="description" content="{html.escape(desc_plain)}" />', s, count=1)
    s = re.sub(r'<link rel="canonical" href="[^"]*" />', f'<link rel="canonical" href="{url}" />', s, count=1)
    s = re.sub(r'\n  <link rel="alternate" hreflang="[^"]*" href="[^"]*" />', '', s)
    s = s.replace(f'<link rel="canonical" href="{url}" />', f'<link rel="canonical" href="{url}" />\n  <link rel="alternate" hreflang="en" href="{url}" />\n  <link rel="alternate" hreflang="x-default" href="{url}" />', 1)
    s = re.sub(r'<meta property="og:title" content="[^"]*" />', lambda m: f'<meta property="og:title" content="{html.escape(title_plain)}" />\n  <meta property="og:description" content="{html.escape(desc_plain)}" />', s, count=1)
    s = re.sub(r'<meta property="og:url" content="[^"]*" />', f'<meta property="og:url" content="{url}" />', s, count=1)
    s = re.sub(r'<meta name="twitter:title" content="[^"]*" />', lambda m: f'<meta name="twitter:title" content="{html.escape(title_plain)}" />', s, count=1)
    s = re.sub(r'<meta name="twitter:description" content="[^"]*" />', lambda m: f'<meta name="twitter:description" content="{html.escape(desc_plain)}" />', s, count=1)
    # datos estructurados
    items = [{'@type': 'ListItem', 'position': k + 1, 'name': f"{r['a']} to {r['b']} by train", 'url': f"https://glosx.app/rutas/{r['slug']}/"} for k, r in enumerate(rts)]
    ld = [
      {'@context': 'https://schema.org', '@type': 'CollectionPage', 'name': title_plain.replace(' · glosx.app', ''), 'description': desc_plain, 'url': url, 'inLanguage': 'en',
       'isPartOf': {'@type': 'WebSite', 'name': 'WoW Train', 'url': 'https://glosx.app/'}, 'dateModified': TODAY,
       'mainEntity': {'@type': 'ItemList', 'numberOfItems': n, 'itemListElement': items}},
      {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://glosx.app/'},
        {'@type': 'ListItem', 'position': 2, 'name': 'Routes', 'item': 'https://glosx.app/rutas/'},
        {'@type': 'ListItem', 'position': 3, 'name': f"Trains in {c['name']}", 'item': url}]},
      {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
        {'@type': 'Question', 'name': html.unescape(q), 'acceptedAnswer': {'@type': 'Answer', 'text': html.unescape(re.sub(r'<[^>]+>', '', a))}} for q, a in c['faq']]},
    ]
    ldtxt = '\n'.join('<script type="application/ld+json">' + json.dumps(x, ensure_ascii=False) + '</script>' for x in ld)
    s = re.sub(r'<script type="application/ld\+json">.*?</script>', lambda m: ldtxt, s, count=1, flags=re.S)
    # cabecera
    s = re.sub(r'<header>.*?</header>', lambda m: f'<header>\n    <h1>Trains in {c["name"]} <span style="color:#C10016">&middot; glosx.app</span></h1>\n    <p>{sub}</p>\n  </header>', s, count=1, flags=re.S)
    # cuerpo
    rows = '\n'.join(f'<tr><td><a href="/rutas/{r["slug"]}/">{html.escape(r["a"])} &rarr; {html.escape(r["b"])}</a></td><td>{dur(r["dur"])}</td><td>{html.escape(r["op"])}</td></tr>' for r in rts)
    pars = ''.join(f'<p>{p}</p>' for p in c['network'])
    types = '<ul>' + ''.join(f'<li><strong>{a}</strong>: {b}</li>' for a, b in c['types']) + '</ul>'
    faq = ''.join(f'<h3>{q}</h3><p>{a}</p>' for q, a in c['faq'])
    more = '<ul class="gl">' + ''.join(f'<li><a href="{u}">{t}</a></li>' for u, t in c['more']) + '<li><a href="/rutas/">All route guides</a></li></ul>'
    main = f'''<main class="hx">
    <h2>How rail travel works in {c['name']}</h2>
    {pars}
    <h2>Train types explained</h2>
    {types}
    <h2>Main train stations</h2>
    <p>{c['stations']}</p>
    <h2 id="routes">Popular train routes in {c['name']}</h2>
    <div class="tw"><table>
      <thead><tr><th>Route</th><th>Typical journey</th><th>Operator</th></tr></thead>
      <tbody>
{rows}
      </tbody>
    </table></div>
    <p style="font-size:13px;color:#6b6c75;margin-top:8px">Journey times are typical for the fastest direct service and change with the timetable: check your date with the operator before you travel. Each route links to its full guide with stations, alternatives and a booking link.</p>
    <h2>Frequently asked questions</h2>
    {faq}
    <h2>More rail guides</h2>
    {more}
  </main>'''
    s = re.sub(r'<main class="hx">.*?</main>', lambda m: main, s, count=1, flags=re.S)
    return s, rts

if __name__ == '__main__':
    for slug, c in H.items():
        s, rts = build(slug, c)
        os.makedirs(os.path.join(ROOT, slug), exist_ok=True)
        open(os.path.join(ROOT, slug, 'index.html'), 'w', encoding='utf8').write(s)
        print(f'{slug}: {len(rts)} rutas, {len(s)//1024} KB')
