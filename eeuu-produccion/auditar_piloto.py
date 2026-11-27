import os

def auditar_archivos():
    preview_dir = "/Users/sebastianjasinsky/Projects/glosx-app/_staging_eeuu/preview"
    europeos = ["Spain", "España", "Renfe", "Atocha", "Sants", "Chamartín", "Ouigo", "Iryo", "Avlo", "Zaragoza", "Lleida", "Sagrada Familia", "Barceloneta", "European", "€"]
    
    for root, _, files in os.walk(preview_dir):
        for file in files:
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
                for e in europeos:
                    if e in content:
                        print(f"ERROR: Termino {e} encontrado en {path}")

auditar_archivos()
