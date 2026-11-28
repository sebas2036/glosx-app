#!/usr/bin/env python3
"""
Fotos de portada para ciudades de EE. UU. sin foto en eeuu-produccion/assets/img/ciudades (Pexels, licencia Pexels).
La clave se lee en runtime de ~/.config/glosx/pexels-api-key y solo se manda a api.pexels.com (via curl).
Guarda assets/img/ciudades/<slug>.jpg (1200 px de ancho) y scripts/data/us-photos-credits.json (fotografo y URL).
Uso: python3 -I scripts/us-fetch-photos.py
"""
import json, os, subprocess, urllib.parse

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
KEYF = os.path.expanduser('~/.config/glosx/pexels-api-key')
OUT = os.path.join(ROOT, 'assets/img/ciudades')
Q = {
    'albany': 'Albany New York capitol', 'albuquerque': 'Albuquerque New Mexico', 'alexandria': 'Alexandria Virginia old town',
    'atlanta': 'Atlanta skyline', 'austin': 'Austin Texas skyline', 'bloomington-normal': 'Normal Illinois',
    'bridgeport': 'Bridgeport Connecticut', 'buffalo': 'Buffalo New York', 'champaign': 'Champaign Illinois',
    'charleston': 'Charleston South Carolina', 'charlottesville': 'Charlottesville Virginia', 'dallas': 'Dallas skyline',
    'emeryville': 'Emeryville California', 'flagstaff': 'Flagstaff Arizona', 'fort-worth': 'Fort Worth Texas',
    'fredericksburg': 'Fredericksburg Virginia', 'fresno': 'Fresno California', 'fullerton': 'Fullerton California',
    'harrisburg': 'Harrisburg Pennsylvania capitol', 'kalamazoo': 'Kalamazoo Michigan', 'lancaster': 'Lancaster Pennsylvania',
    'lynchburg': 'Lynchburg Virginia', 'martinez': 'Martinez California', 'memphis': 'Memphis Tennessee',
    'montreal': 'Montreal skyline', 'new-london': 'New London Connecticut', 'new-orleans': 'New Orleans French Quarter',
    'niagara-falls': 'Niagara Falls', 'oxnard': 'Oxnard California beach', 'pittsburgh': 'Pittsburgh skyline',
    'poughkeepsie': 'Poughkeepsie Walkway over the Hudson', 'raleigh': 'Raleigh North Carolina skyline', 'rochester': 'Rochester New York',
    'salt-lake-city': 'Salt Lake City', 'san-antonio': 'San Antonio River Walk', 'santa-ana': 'Santa Ana California',
    'springfield-il': 'Springfield Illinois capitol', 'springfield-ma': 'Springfield Massachusetts', 'st-louis': 'Gateway Arch St. Louis',
    'syracuse': 'Syracuse New York', 'trenton': 'Trenton New Jersey city', 'ventura': 'Ventura California pier',
    'portland-maine': 'Portland Maine lighthouse', 'oklahoma-city': 'Oklahoma City skyline', 'grand-rapids': 'Grand Rapids Michigan',
    'hartford': 'Hartford Connecticut', 'norfolk': 'Norfolk Virginia',
    'west-palm-beach': 'West Palm Beach Florida', 'williamsburg': 'Colonial Williamsburg', 'wilmington': 'Wilmington Delaware',
}

TOK = {  # palabras que tiene que nombrar la descripcion de la foto
    'alexandria': ['alexandria'], 'bloomington-normal': ['normal, il', 'bloomington'], 'buffalo': ['buffalo'], 'champaign': ['champaign', 'urbana'],
    'emeryville': ['emeryville'], 'fredericksburg': ['fredericksburg'], 'fullerton': ['fullerton, ca', 'fullerton, california'],
    'harrisburg': ['harrisburg'], 'kalamazoo': ['kalamazoo'], 'lynchburg': ['lynchburg'], 'martinez': ['martinez'],
    'rochester': ['rochester, ny', 'rochester, new york'], 'santa-ana': ['santa ana'], 'springfield-il': ['springfield, il', 'illinois state capitol'],
    'springfield-ma': ['springfield, ma', 'springfield, massachusetts'], 'st-louis': ['gateway arch', 'st. louis', 'st louis'],
    'trenton': ['trenton'], 'west-palm-beach': ['west palm beach'], 'wilmington': ['wilmington, de', 'wilmington, delaware', 'wilmington riverfront'],
    'portland-maine': ['portland, maine', 'portland, me', 'portland head', 'maine'], 'oklahoma-city': ['oklahoma city'], 'grand-rapids': ['grand rapids'],
    'hartford': ['hartford'], 'norfolk': ['norfolk'],
    'new-orleans': ['new orleans'], 'niagara-falls': ['niagara'], 'salt-lake-city': ['salt lake'], 'san-antonio': ['san antonio', 'riverwalk', 'river walk'],
    'williamsburg': ['williamsburg'], 'poughkeepsie': ['poughkeepsie', 'mid-hudson', 'walkway over the hudson'], 'charlottesville': ['charlottesville', 'monticello'],
}

def main():
    key = open(KEYF).read().strip()
    credits = {}
    cp = os.path.join(ROOT, 'scripts/data/us-photos-credits.json')
    if os.path.exists(cp): credits = json.load(open(cp))
    for slug, q in Q.items():
        dst = os.path.join(OUT, slug + '.jpg')
        if os.path.exists(dst): continue
        url = 'https://api.pexels.com/v1/search?' + urllib.parse.urlencode({'query': q, 'per_page': 15, 'orientation': 'landscape'})
        r = subprocess.run(['curl', '-s', '-m', '30', '-H', 'Authorization: ' + key, url], capture_output=True, text=True)
        try: photos = json.loads(r.stdout).get('photos', [])
        except Exception: photos = []
        if not photos: print('SIN RESULTADO', slug); continue
        tok = TOK.get(slug, [slug.replace('-', ' ')])
        good = [x for x in photos if any(t in (x.get('alt') or '').lower() for t in tok)]
        if not good: print('SIN FOTO CONFIABLE', slug, '|', [(x.get('alt') or '')[:50] for x in photos[:3]]); continue
        p = good[0]
        img = p['src']['original'] + '?auto=compress&cs=tinysrgb&w=1200'
        subprocess.run(['curl', '-sL', '-m', '60', '-o', dst, img], check=False)
        credits[slug] = {'query': q, 'id': p['id'], 'photographer': p['photographer'], 'url': p['url'], 'alt': p.get('alt', '')}
        print(slug, '->', p['id'], p.get('alt', '')[:70])
    json.dump(credits, open(cp, 'w'), ensure_ascii=False, indent=1)

if __name__ == '__main__':
    main()
