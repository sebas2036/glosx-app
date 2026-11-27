import os
import shutil

# Rutas piloto
rutas = [
    ("boston", "new-york"),
    ("new-york", "washington-dc"),
    ("miami", "orlando"),
    ("los-angeles", "san-diego"),
    ("chicago", "denver")
]

idiomas = ["en", "es", "fr", "de", "it", "pt", "ja", "zh"]
plantilla = "/Users/sebastianjasinsky/Projects/glosx-app/rutas/madrid-barcelona/index.html"

with open(plantilla, "r") as f:
    contenido = f.read()

# Crear directorio preview
base_dir = "/Users/sebastianjasinsky/Projects/glosx-app/_staging_eeuu/preview"
os.makedirs(base_dir, exist_ok=True)

# Generar 40 archivos
for o, d in rutas:
    ruta_dir = os.path.join(base_dir, f"{o}-{d}")
    os.makedirs(ruta_dir, exist_ok=True)
    
    for lang in idiomas:
        # Adaptación simplificada de contenido (reemplazo de strings)
        nuevo_contenido = contenido.replace("Madrid", o.title()).replace("madrid", o).replace("Barcelona", d.title()).replace("barcelona", d).replace("klook", "omio").replace("Renfe AVE", "Amtrak/Brightline")
        
        # Guardar en estructura de carpetas
        lang_dir = os.path.join(ruta_dir, lang)
        os.makedirs(lang_dir, exist_ok=True)
        with open(os.path.join(lang_dir, "index.html"), "w") as f:
            f.write(nuevo_contenido)

print("40 archivos generados.")
