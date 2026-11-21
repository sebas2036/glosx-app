#!/usr/bin/env python3
# Regenera la lista completa de paginas de ruta que usa el planificador para mostrar la "Guia de la ruta" (assets/js/planner-info.js).
# Correr tras agregar rutas nuevas en /rutas/ y subir el ?v= de planner-info.js en los 8 index.html.
import os, re
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
langs = {'es', 'fr', 'it', 'de', 'pt', 'ja', 'zh'}
slugs = sorted(d for d in os.listdir(os.path.join(root, 'rutas')) if os.path.isdir(os.path.join(root, 'rutas', d)) and d not in langs and os.path.exists(os.path.join(root, 'rutas', d, 'index.html')))
p = os.path.join(root, 'assets/js/planner-info.js')
s = open(p, encoding='utf-8').read()
new = '/*GUIDES*/' + ','.join('"%s"' % x for x in slugs) + '/*END*/'
s2 = re.sub(r'/\*GUIDES\*/.*?/\*END\*/', lambda m: new, s, flags=re.S)
open(p, 'w', encoding='utf-8').write(s2)
print(len(slugs), 'paginas')
