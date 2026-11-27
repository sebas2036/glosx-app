import os
import shutil

# Rutas piloto
rutas = [
    ("boston", "new-york", "Amtrak"),
    ("new-york", "washington-dc", "Amtrak"),
    ("miami", "orlando", "Brightline"),
    ("los-angeles", "san-diego", "Amtrak"),
    ("chicago", "denver", "Amtrak")
]

idiomas = ["en", "es", "fr", "de", "it", "pt", "ja", "zh"]
plantilla = "/Users/sebastianjasinsky/Projects/glosx-app/rutas/bordeaux-lourdes/index.html"

with open(plantilla, "r") as f:
    contenido = f.read()

# Crear directorio preview
base_dir = "/Users/sebastianjasinsky/Projects/glosx-app/_staging_eeuu/preview"
os.makedirs(base_dir, exist_ok=True)

# Generar 40 archivos
for o, d, op in rutas:
    ruta_dir = os.path.join(base_dir, f"{o}-{d}")
    os.makedirs(ruta_dir, exist_ok=True)
    
    for lang in idiomas:
        # Reemplazos quirúrgicos manteniendo la estructura
        nuevo_contenido = contenido.replace("Bordeaux", o.title()).replace("bordeaux", o)
        nuevo_contenido = nuevo_contenido.replace("Lourdes", d.title()).replace("lourdes", d)
        nuevo_contenido = nuevo_contenido.replace("SNCF Intercités", op)
        nuevo_contenido = nuevo_contenido.replace("klook", "omio")
        nuevo_contenido = nuevo_contenido.replace("France", "USA")
        
        # Guardar en estructura de carpetas
        lang_dir = os.path.join(ruta_dir, lang)
        os.makedirs(lang_dir, exist_ok=True)
        with open(os.path.join(lang_dir, "index.html"), "w") as f:
            f.write(nuevo_contenido)

print("40 archivos generados con estructura completa.")
