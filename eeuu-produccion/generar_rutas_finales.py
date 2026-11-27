import json
import os

# Configuración de Estados Unidos
BASE_URL = "https://voxa-production-dc15.up.railway.app/affiliate/europe-train"

def get_url(from_city, to_city):
    return f"{BASE_URL}?from={from_city}&to={to_city}"

# Diccionario para evitar duplicados en la lista final
rutas_map = {}

def add_route(o, d, op, p):
    key = f"{o}-{d}"
    if key not in rutas_map:
        url = get_url(o, d) if p == "omio" else "#"
        rutas_map[key] = {"origen": o, "destino": d, "operador": op, "url": url, "partner": p}

# 1. Northeast Corridor
northeast = ["boston", "providence", "new-haven", "stamford", "new-york", "newark", "philadelphia", "baltimore", "washington-dc", "richmond", "raleigh", "charlotte", "savannah", "jacksonville"]
for i in range(len(northeast)):
    for j in range(len(northeast)):
        if i != j: add_route(northeast[i], northeast[j], "Amtrak", "omio")

# 2. Florida
florida = ["miami", "aventura", "fort-lauderdale", "boca-raton", "west-palm-beach", "orlando", "tampa", "jacksonville"]
for i in range(len(florida)):
    for j in range(len(florida)):
        if i != j: add_route(florida[i], florida[j], "Brightline/Amtrak", "omio")

# 3. California
cali = ["san-diego", "oceanside", "irvine", "anaheim", "los-angeles", "burbank", "santa-barbara", "san-luis-obispo", "salinas", "san-jose", "oakland", "berkeley", "davis", "sacramento", "fresno", "bakersfield"]
for i in range(len(cali)):
    for j in range(len(cali)):
        if i != j: add_route(cali[i], cali[j], "Amtrak", "omio")

# 4. Midwest Hub
midwest = ["chicago", "milwaukee", "st-paul", "st-louis", "kansas-city", "detroit", "ann-arbor", "kalamazoo", "grand-rapids", "indianapolis", "cincinnati", "cleveland", "toledo"]
for i in range(len(midwest)):
    for j in range(len(midwest)):
        if i != j: add_route(midwest[i], midwest[j], "Amtrak", "omio")

# 5. Noroeste
noroeste = ["eugene", "salem", "portland", "vancouver-wa", "olympia", "tacoma", "seattle", "everett", "bellingham", "vancouver-bc"]
for i in range(len(noroeste)):
    for j in range(len(noroeste)):
        if i != j: add_route(noroeste[i], noroeste[j], "Amtrak", "omio")

# 6. Panorámicos y Experiencias
panoramicos = [
    ("durango", "silverton", "Durango & Silverton"), ("williams", "grand-canyon", "Grand Canyon Railway"),
    ("anchorage", "denali", "Alaska Railroad"), ("seward", "anchorage", "Alaska Railroad"),
    ("mount-washington", "summit", "Mount Washington Cog"), ("alamosa", "antonito", "Cumbres & Toltec"),
    ("georgetown", "silver-plume", "Georgetown Loop"), ("napa", "st-helena", "Napa Valley Wine Train"),
    ("bryson-city", "dillsboro", "Great Smoky Mountains"), ("cass", "bald-knob", "Cass Scenic"),
    ("conway", "bartlett", "Conway Scenic"), ("williams", "kaibab", "Verde Canyon")
]
for o, d, op in panoramicos:
    add_route(o, d, op, "experiencias")

rutas_finales = list(rutas_map.values())
with open('/Users/sebastianjasinsky/Projects/glosx-app/_staging_eeuu/rutas_eeuu.json', 'w') as f:
    json.dump(rutas_finales, f, indent=2)

print(f"Total rutas generadas: {len(rutas_finales)}")
