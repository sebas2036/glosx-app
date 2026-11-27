import json
import os

def validar():
    file_path = '/Users/sebastianjasinsky/Projects/glosx-app/_staging_eeuu/rutas_eeuu.json'
    if not os.path.exists(file_path):
        print("Archivo no encontrado")
        return

    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # 1. Chequeo de duplicados
    keys = []
    for r in data:
        keys.append(f"{r['origen']}-{r['destino']}")
    
    if len(keys) != len(set(keys)):
        print("DUPLICADOS DETECTADOS")
    else:
        print("Sin duplicados")

    # 2. Chequeo de URLs Omio
    for r in data:
        if r['partner'] == 'omio' and 'europe-train' not in r['url']:
            print(f"Error URL Omio: {r['origen']} -> {r['destino']}")
        if r['partner'] == 'experiencias' and r['url'] != '#':
            print(f"Error Partner: {r['origen']} -> {r['destino']}")

    print(f"Total rutas validadas: {len(data)}")

if __name__ == "__main__":
    validar()
