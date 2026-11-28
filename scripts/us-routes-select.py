#!/usr/bin/env python3
"""
Seleccion de rutas de EE. UU. (objetivo >= 250) desde el GTFS oficial (Amtrak + Brightline + Gold Runner).
Solo pares con tren directo en los dos sentidos, datos sin recortes y entre ciudades de la lista (una estacion por ciudad).
Orden: peso de las dos ciudades x trenes al dia (minimo de los dos sentidos). Noroeste del Pacifico fuera (feed roto).
Uso: python3 -I scripts/us-routes-select.py [N]  ->  scripts/data/us-routes-selection.json
"""
import json, os, sys, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from us_gtfs_lib import load, pairs  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
GT = '/Volumes/X9 Pro/gtfs-data'
N = int(sys.argv[1]) if len(sys.argv) > 1 else 400
DAY = '20261208'

# codigo -> (ciudad, slug de ciudad, estado, peso 1-3, estacion para mostrar)
C = {
 'BOS': ('Boston', 'boston', 'MA', 3, 'Boston South Station'), 'PVD': ('Providence', 'providence', 'RI', 2, 'Providence Station'),
 'NLC': ('New London', 'new-london', 'CT', 1, 'New London Union Station'), 'NHV': ('New Haven', 'new-haven', 'CT', 2, 'New Haven Union Station'),
 'BRP': ('Bridgeport', 'bridgeport', 'CT', 1, 'Bridgeport Station'), 'STM': ('Stamford', 'stamford', 'CT', 2, 'Stamford Station'),
 'NYP': ('New York', 'new-york', 'NY', 3, 'New York Penn Station (Moynihan Train Hall)'), 'NWK': ('Newark', 'newark', 'NJ', 2, 'Newark Penn Station'),
 'TRE': ('Trenton', 'trenton', 'NJ', 1, 'Trenton Transit Center'), 'PHL': ('Philadelphia', 'philadelphia', 'PA', 3, 'Philadelphia 30th Street Station'),
 'WIL': ('Wilmington', 'wilmington', 'DE', 1, 'Wilmington Station'), 'BAL': ('Baltimore', 'baltimore', 'MD', 2, 'Baltimore Penn Station'),
 'WAS': ('Washington', 'washington', 'DC', 3, 'Washington Union Station'), 'ALX': ('Alexandria', 'alexandria', 'VA', 1, 'Alexandria Station'),
 'HAR': ('Harrisburg', 'harrisburg', 'PA', 1, 'Harrisburg Transportation Center'), 'LNC': ('Lancaster', 'lancaster', 'PA', 1, 'Lancaster Station'),
 'PGH': ('Pittsburgh', 'pittsburgh', 'PA', 2, 'Pittsburgh Union Station'), 'ALB': ('Albany', 'albany', 'NY', 2, 'Albany-Rensselaer Station'),
 'POU': ('Poughkeepsie', 'poughkeepsie', 'NY', 1, 'Poughkeepsie Station'), 'SYR': ('Syracuse', 'syracuse', 'NY', 1, 'Syracuse Regional Transportation Center'),
 'ROC': ('Rochester', 'rochester', 'NY', 1, 'Rochester Station'), 'BUF': ('Buffalo', 'buffalo', 'NY', 2, 'Buffalo-Depew Station'),
 'NFL': ('Niagara Falls', 'niagara-falls', 'NY', 2, 'Niagara Falls Station'), 'HFD': ('Hartford', 'hartford', 'CT', 1, 'Hartford Union Station'),
 'SPG': ('Springfield, Massachusetts', 'springfield-ma', 'MA', 1, 'Springfield Union Station'), 'ESX': ('Burlington', 'burlington', 'VT', 1, 'Essex Junction-Burlington Station'),
 'POR': ('Portland, Maine', 'portland-maine', 'ME', 2, 'Portland Transportation Center'), 'MTR': ('Montreal', 'montreal', 'QC', 2, 'Montreal Central Station'),
 'RVR': ('Richmond', 'richmond', 'VA', 2, 'Richmond Staples Mill Road Station'), 'NFK': ('Norfolk', 'norfolk', 'VA', 1, 'Norfolk Station'),
 'WBG': ('Williamsburg', 'williamsburg', 'VA', 2, 'Williamsburg Transportation Center'), 'NPN': ('Newport News', 'newport-news', 'VA', 1, 'Newport News Station'),
 'CVS': ('Charlottesville', 'charlottesville', 'VA', 1, 'Charlottesville Union Station'), 'LYH': ('Lynchburg', 'lynchburg', 'VA', 1, 'Lynchburg Kemper Street Station'),
 'RNK': ('Roanoke', 'roanoke', 'VA', 1, 'Roanoke Station'), 'FBG': ('Fredericksburg', 'fredericksburg', 'VA', 1, 'Fredericksburg Station'),
 'RGH': ('Raleigh', 'raleigh', 'NC', 2, 'Raleigh Union Station'), 'CLT': ('Charlotte', 'charlotte', 'NC', 2, 'Charlotte Station'),
 'GRO': ('Greensboro', 'greensboro', 'NC', 1, 'Greensboro J. Douglas Galyon Depot'), 'DNC': ('Durham', 'durham', 'NC', 1, 'Durham Station'),
 'SAV': ('Savannah', 'savannah', 'GA', 2, 'Savannah Station'), 'CHS': ('Charleston', 'charleston', 'SC', 2, 'North Charleston Station'),
 'JAX': ('Jacksonville', 'jacksonville', 'FL', 2, 'Jacksonville Station'), 'TPA': ('Tampa', 'tampa', 'FL', 2, 'Tampa Union Station'),
 'ORL': ('Orlando', 'orlando', 'FL', 3, 'Orlando Amtrak Station'), 'MIA': ('Miami', 'miami', 'FL', 3, 'Miami Amtrak Station (Hialeah)'),
 'ATL': ('Atlanta', 'atlanta', 'GA', 3, 'Atlanta Peachtree Station'), 'BHM': ('Birmingham', 'birmingham', 'AL', 1, 'Birmingham Station'),
 'NOL': ('New Orleans', 'new-orleans', 'LA', 3, 'New Orleans Union Passenger Terminal'), 'MEM': ('Memphis', 'memphis', 'TN', 2, 'Memphis Central Station'),
 'CHI': ('Chicago', 'chicago', 'IL', 3, 'Chicago Union Station'), 'MKE': ('Milwaukee', 'milwaukee', 'WI', 2, 'Milwaukee Intermodal Station'),
 'STL': ('St. Louis', 'st-louis', 'MO', 2, 'St. Louis Gateway Station'), 'KCY': ('Kansas City', 'kansas-city', 'MO', 2, 'Kansas City Union Station'),
 'SPI': ('Springfield, Illinois', 'springfield-il', 'IL', 1, 'Springfield Station'), 'BNL': ('Bloomington-Normal', 'bloomington-normal', 'IL', 1, 'Uptown Normal Station'),
 'CHM': ('Champaign', 'champaign', 'IL', 1, 'Champaign-Urbana Illinois Terminal'), 'GRR': ('Grand Rapids', 'grand-rapids', 'MI', 1, 'Grand Rapids Station'),
 'DET': ('Detroit', 'detroit', 'MI', 2, 'Detroit Station'), 'ARB': ('Ann Arbor', 'ann-arbor', 'MI', 1, 'Ann Arbor Station'),
 'KAL': ('Kalamazoo', 'kalamazoo', 'MI', 1, 'Kalamazoo Transportation Center'), 'IND': ('Indianapolis', 'indianapolis', 'IN', 2, 'Indianapolis Union Station'),
 'CIN': ('Cincinnati', 'cincinnati', 'OH', 2, 'Cincinnati Union Terminal'), 'MSP': ('St. Paul', 'st-paul', 'MN', 2, 'St. Paul Union Depot'),
 'DAL': ('Dallas', 'dallas', 'TX', 3, 'Dallas Union Station'), 'FTW': ('Fort Worth', 'fort-worth', 'TX', 2, 'Fort Worth Central Station'),
 'SAS': ('San Antonio', 'san-antonio', 'TX', 2, 'San Antonio Station'), 'AUS': ('Austin', 'austin', 'TX', 2, 'Austin Station'),
 'OKC': ('Oklahoma City', 'oklahoma-city', 'OK', 1, 'Oklahoma City Santa Fe Depot'), 'DEN': ('Denver', 'denver', 'CO', 3, 'Denver Union Station'),
 'SLC': ('Salt Lake City', 'salt-lake-city', 'UT', 2, 'Salt Lake City Intermodal Hub'), 'ABQ': ('Albuquerque', 'albuquerque', 'NM', 2, 'Albuquerque Alvarado Transportation Center'),
 'FLG': ('Flagstaff', 'flagstaff', 'AZ', 2, 'Flagstaff Station'), 'LAX': ('Los Angeles', 'los-angeles', 'CA', 3, 'Los Angeles Union Station'),
 'SAN': ('San Diego', 'san-diego', 'CA', 3, 'San Diego Santa Fe Depot'), 'SNA': ('Santa Ana', 'santa-ana', 'CA', 1, 'Santa Ana Regional Transportation Center'),
 'ANA': ('Anaheim', 'anaheim', 'CA', 2, 'Anaheim ARTIC'), 'FUL': ('Fullerton', 'fullerton', 'CA', 1, 'Fullerton Station'),
 'OSD': ('Oceanside', 'oceanside', 'CA', 1, 'Oceanside Transit Center'), 'SBA': ('Santa Barbara', 'santa-barbara', 'CA', 2, 'Santa Barbara Station'),
 'SLO': ('San Luis Obispo', 'san-luis-obispo', 'CA', 1, 'San Luis Obispo Station'), 'VEC': ('Ventura', 'ventura', 'CA', 1, 'Ventura Station'),
 'OXN': ('Oxnard', 'oxnard', 'CA', 1, 'Oxnard Transportation Center'), 'SJC': ('San Jose', 'san-jose', 'CA', 2, 'San Jose Diridon Station'),
 'SAC': ('Sacramento', 'sacramento', 'CA', 2, 'Sacramento Valley Station'), 'EMY': ('Emeryville', 'emeryville', 'CA', 2, 'Emeryville Station'),
 'OKJ': ('Oakland', 'oakland', 'CA', 2, 'Oakland Jack London Square Station'), 'MTZ': ('Martinez', 'martinez', 'CA', 1, 'Martinez Station'),
 'DAV': ('Davis', 'davis', 'CA', 1, 'Davis Station'),
 'BON': ('Boston', 'boston', 'MA', 3, 'Boston North Station'),
 'BL:EKW': ('Miami', 'miami', 'FL', 3, 'MiamiCentral'), 'BL:AVE': ('Aventura', 'aventura', 'FL', 1, 'Brightline Aventura'),
 'BL:FBT': ('Fort Lauderdale', 'fort-lauderdale', 'FL', 2, 'Brightline Fort Lauderdale'), 'BL:RRN': ('Boca Raton', 'boca-raton', 'FL', 1, 'Brightline Boca Raton'),
 'BL:WPT': ('West Palm Beach', 'west-palm-beach', 'FL', 2, 'Brightline West Palm Beach'), 'BL:MCO': ('Orlando', 'orlando', 'FL', 3, 'Brightline Orlando (Orlando International Airport)'),
 'GR:2535913': ('Fresno', 'fresno', 'CA', 2, 'Fresno Station'), 'GR:2584555': ('Bakersfield', 'bakersfield', 'CA', 2, 'Bakersfield Station'),
 'GR:2535897': ('Stockton', 'stockton', 'CA', 1, 'Stockton Robert J. Cabral Station'), 'GR:2535910': ('Modesto', 'modesto', 'CA', 1, 'Modesto Station'),
 'GR:2535911': ('Merced', 'merced', 'CA', 1, 'Merced Station'), 'GR:2535901': ('Sacramento', 'sacramento', 'CA', 2, 'Sacramento Valley Station'),
 'GR:2584562': ('Oakland', 'oakland', 'CA', 2, 'Oakland Jack London Square Station'), 'GR:2584561': ('Emeryville', 'emeryville', 'CA', 2, 'Emeryville Station'),
 'GR:2584559': ('Martinez', 'martinez', 'CA', 1, 'Martinez Station'),
}
OPER = {'': 'Amtrak', 'BL:': 'Brightline', 'GR:': 'Amtrak Gold Runner'}
PRIOR = ['new-york', 'chicago', 'los-angeles', 'washington', 'boston', 'philadelphia', 'san-diego', 'miami', 'orlando', 'atlanta',
         'dallas', 'new-orleans', 'denver', 'sacramento', 'oakland', 'san-jose', 'emeryville', 'baltimore', 'newark', 'pittsburgh', 'st-louis',
         'milwaukee', 'detroit', 'st-paul', 'kansas-city', 'richmond', 'raleigh', 'charlotte', 'tampa', 'jacksonville', 'savannah', 'charleston',
         'fort-lauderdale', 'west-palm-beach', 'santa-barbara', 'anaheim', 'fresno', 'bakersfield', 'albany', 'buffalo', 'providence']
rank = lambda c: PRIOR.index(c) if c in PRIOR else 999
pre = lambda c: 'BL:' if c.startswith('BL:') else 'GR:' if c.startswith('GR:') else ''

if __name__ == '__main__':
    A = load(f'{GT}/amtrak/amtrak_gtfs.zip'); B = load(f'{GT}/brightline/bl_gtfs.zip'); S = load(f'{GT}/sanjoaquins/sanjoaquins.zip')
    P = pairs(A, DAY, 'Amtrak') + pairs(B, DAY, 'Brightline', 'BL:') + pairs(S, DAY, 'Gold Runner', 'GR:')
    d = {(p['from_id'], p['to_id']): p for p in P if not p['suspect']}
    best = {}  # par de ciudades -> mejor par de estaciones
    for (a, b), p in d.items():
        if a not in C or b not in C or pre(a) != pre(b): continue
        q = d.get((b, a))
        if not q: continue
        ca, cb = C[a][1], C[b][1]
        if ca == cb: continue
        n = min(p['trains'], q['trains']); m = min(p['fastest_min'], q['fastest_min'])
        w = C[a][3] * C[b][3]
        if n == 1 and m > 30 * 60 and not (w >= 6 and m <= 56 * 60): continue  # mas de 30 h: solo los grandes trenes entre ciudades grandes
        if n >= 2 and m > 14 * 60 and not (w >= 6 and m <= 56 * 60): continue
        key = tuple(sorted((ca, cb)))
        if w == 1: continue  # dos ciudades chicas: fuera
        score = round(10 * w ** 1.5 * min(n, 20) ** 0.5)
        # Miami/Fort Lauderdale/West Palm/Orlando entre si: Brightline (mas trenes) gana a Amtrak por puntaje
        if key not in best or score > best[key][0]:
            # orden de la pagina: la ciudad de mas peso primero; empate, la del codigo de origen
            x, y = (a, b) if (C[a][3], -rank(C[a][1])) >= (C[b][3], -rank(C[b][1])) else (b, a)
            best[key] = (score, x, y, n, m)
    prev = set(json.load(open(os.path.join(ROOT, 'scripts/data/us-routes.json')))['routes'])  # slugs ya armados
    # Corredores que faltaban (28-nov-2026): se agregan a mano a las ya armadas, sin relleno de pares cortos.
    # Noroeste (Cascades, Coast Starlight al norte de Sacramento) sigue fuera: el GTFS trae saltos falsos sin referencia limpia.
    WANT = {frozenset(x.split('|')) for x in (
        'boston|portland-maine', 'chicago|los-angeles', 'new-york|new-orleans', 'philadelphia|new-orleans', 'chicago|san-antonio',
        'chicago|emeryville', 'denver|emeryville', 'salt-lake-city|emeryville', 'chicago|salt-lake-city', 'washington|miami', 'washington|orlando',
        'chicago|miami', 'chicago|orlando', 'fort-worth|oklahoma-city', 'chicago|grand-rapids', 'san-antonio|austin', 'austin|fort-worth',
        'san-antonio|fort-worth', 'flagstaff|albuquerque', 'kansas-city|albuquerque', 'new-york|hartford', 'new-haven|hartford',
        'new-haven|springfield-ma', 'albany|montreal', 'san-diego|san-luis-obispo', 'new-york|norfolk', 'washington|norfolk', 'new-york|savannah')}
    sel = sorted((v for k, v in best.items() if '-'.join(k) in prev or f'{k[1]}-{k[0]}' in prev or frozenset(k) in WANT), key=lambda t: -t[0])
    missing = [sorted(x) for x in WANT if tuple(sorted(x)) not in best]
    print('pedidos sin datos:', missing)
    out = []
    for score, x, y, n, m in sel:
        if f'{C[y][1]}-{C[x][1]}' in prev: x, y = y, x
        out.append({'slug': f'{C[x][1]}-{C[y][1]}', 'a': x, 'b': y, 'ca': C[x][1], 'cb': C[y][1], 'from': C[x][0], 'to': C[y][0], 'state_a': C[x][2], 'state_b': C[y][2],
                    'from_station': C[x][4], 'to_station': C[y][4], 'operator': OPER[pre(x)], 'trains': n, 'fastest_min': m, 'score': score})
    json.dump(out, open(os.path.join(ROOT, 'scripts/data/us-routes-selection.json'), 'w'), ensure_ascii=False, indent=1)
    exists = [o['slug'] for o in out if os.path.exists(os.path.join(ROOT, 'rutas', o['slug'], 'index.html')) and not os.path.exists(os.path.join(ROOT, 'rutas', o['slug'], 'de'))]
    print('candidatos:', len(best), '| elegidos:', len(out), '| choque con slugs europeos:', exists)
    for o in out:
        print(f"{o['score']:4d} {o['slug']}: {o['trains']}/dia, {o['fastest_min']//60}h{o['fastest_min']%60:02d}, {o['operator']}")
