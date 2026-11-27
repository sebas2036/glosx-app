import json
import os

# Configuración de Estados Unidos Omio
# El endpoint debe apuntar a la lógica de Omio, no Klook.
# Estructura corregida detectada de /assets/js/omio-bridge.js
BASE_URL = "https://voxa-production-dc15.up.railway.app/affiliate/europe-train"

def get_url(from_city, to_city):
    return f"{BASE_URL}?from={from_city}&to={to_city}"

rutas = [
    # Northeast Corridor
    {"origen": "boston", "destino": "new-york", "operador": "Amtrak", "url": get_url("boston", "new-york"), "partner": "omio"},
    {"origen": "new-york", "destino": "washington-dc", "operador": "Amtrak", "url": get_url("new-york", "washington-dc"), "partner": "omio"},
    # Florida
    {"origen": "miami", "destino": "orlando", "operador": "Brightline", "url": get_url("miami", "orlando"), "partner": "omio"},
    # California
    {"origen": "los-angeles", "destino": "san-diego", "operador": "Amtrak", "url": get_url("los-angeles", "san-diego"), "partner": "omio"},
    # Noroeste
    {"origen": "seattle", "destino": "portland", "operador": "Amtrak", "url": get_url("seattle", "portland"), "partner": "omio"},
    # Panorámicos / Privados
    {"origen": "durango", "destino": "silverton", "operador": "Durango & Silverton", "url": "#", "partner": "experiencias"},
    {"origen": "williams", "destino": "grand-canyon", "operador": "Grand Canyon Railway", "url": "#", "partner": "experiencias"}
]

# (Extendiendo a 225 en producción real, aquí ejemplificado)
print(json.dumps(rutas, indent=2))
