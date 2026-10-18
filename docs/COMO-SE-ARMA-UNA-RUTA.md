# Cómo se arma una ruta nueva (guía rápida)

Cada ruta = 5 páginas (`en`, `es`, `fr`, `it`, `ja`) en `rutas/<slug>/`. Todo sale de `scripts/generate-routes.js`.
Hacerlo en este orden evita repetir trabajo. **Una ruta lista tiene: foto, mapa, hotel, horarios, enlaces con afiliación, sitemap, índice y chip.**

## 0. Elegir la ruta
- Ranking de popularidad de Omio: `~/.config/glosx/impact-rank.js` (guarda `impact-rank-<catalogo>.json`; `Numeric1` bajo = más pedida; es global, igual en todos los mercados).
- Confirmar en Omio (pestaña Trenes) que hay tren directo. El catálogo mezcla tren, bus y vuelo.
- Cruzar con `ls rutas/` para no repetir. Los slugs van "ciudadA-ciudadB" en inglés, minúsculas.

## 1. Entrada en `scripts/generate-routes.js` (array `routes`)
```js
{ slug:'madrid-segovia', from:'Madrid', to:'Segovia', country:'Spain', duration:'27 min', operator:'Renfe AVE / Avant',
  price:'', badge:'Route guide · Spain',
  customSEO:{ en:{ title:'…', description:'…' } },
  localInsight:{ en:'…', es:'…', fr:'…', it:'…' } }
```
- `price:''` = sin precio (el generador omite el apartado y las preguntas que lo citan). No inventar tarifas.
- `duration` corta: `'27 min'`; larga: `'2h 30m'`.
- `localInsight`: un párrafo propio por ruta, solo datos comprobables (nada de superlativos sin fuente).
- Nombres de ciudad localizados: añadir el slug a `NEW_ROUTE_SLUGS` y las ciudades a `CITY_LOCAL` (es/fr/it). Japonés: `CITY_JA` (se completa junto a `JA_CITY`).

## 2. Piezas que cada ruta necesita (si falta una, la página sale pobre)
| Pieza | Dónde se define | Si falta |
|---|---|---|
| Foto de portada | `HERO_PHOTOS['<destino en minúscula>']` (URL de Pexels, `?auto=compress&cs=tinysrgb&w=1600`) | sale el mapamundi genérico |
| Hotel | `REAL_HOTELS['<destino>']` (`name`, `loc`, `image`; hoteles reales, fotos de Wikimedia Commons) | se omite el bloque |
| Mapa "Opciones de viaje" | `assets/data/route-data.json`, clave = slug: `{"a":[lat,lng],"b":[lat,lng],"m":{"train":min,"bus":min},"p":{…}}` | no aparece la tarjeta |
| Horarios (primer/último tren, trenes al día) | `assets/data/horarios-rutas.json` (+ copia completa fuera del repo) y `node scripts/inject-horarios-faq.js` | sin esas 3 preguntas |
- Mapa: `p` (precios) es opcional. Sin precios la nota pasa sola a "Duraciones orientativas…" (`noteT` en `assets/js/route-premium.js`).
- Los datos de horarios salen de `scripts/horarios-gtfs.py` (GTFS abierto; Renfe CC BY 4.0). Para pocas rutas, copiar el script a un temporal, fijar `ROUTES` y `ALIAS`, y fusionar el JSON. Cuidado con trenes regionales (MD) que distorsionan la mediana: filtrar por `short_names`.

## 3. Generar (SOLO esas rutas)
```bash
for sl in slug1 slug2; do node scripts/generate-routes.js $sl; ONLY_LANG=ja node scripts/generate-routes.js $sl; done
```
- En **zsh** no usar una variable con la lista (`$S`): no se separa y falla en silencio. Escribir los slugs en el `for`.
- `generate-routes.js <slug>` y `inject-horarios-faq.js` **tocan cientos de archivos ajenos**. Después hay que revertirlos:
  `git status --short | grep -v "^??" | awk '{print $2}' | grep -v "<archivos propios>" | xargs git checkout --`
- Limpiar `<p></p>` vacíos de las páginas nuevas (queda uno cuando no hay precio).
- Si la plantilla `route-template.html` cambia el `?v=` de un script, subirlo también en las páginas nuevas.

## 4. Afiliación (todo pasa por el backend `voxa`, nunca enlaces directos)
- Billete: `/affiliate/europe-train?from=<ciudad>&to=<ciudad>` → Omio vía Impact, con etiqueta `web_<from>_<to>` (se ve en el informe `partner_performance_by_subid`).
- Hotel: botón principal `/affiliate/klook-hotel?city=` (Klook; si no hay ciudad en Klook cae a Booking) y segundo botón `/affiliate/booking-hotel?city=` (Booking, marker TravelPayouts). Ambos con `trackPartnerClick('hotel_…')` para medir el experimento.
- Traslado: `/affiliate/kiwitaxi`.
- Probar con `curl -I` que cada ruta redirige a `omio.sjv.io` / `tp.media` (con el marker) y a la ciudad correcta. Ojo con nombres compuestos: `santiago de compostela`, no `santiago`.

## 5. Publicar
1. **Sitemap**: añadir a mano 5 `<url>` por ruta (con `hreflang` en/es/fr/it/ja + `x-default`). **No** usar `generate-sitemap.js` (borra las entradas ja).
2. **Índices** `rutas/index.html`, `es/`, `fr/`, `it/`, `ja/rutas/index.html`: una línea `<li>` por ruta (el buscador de `assets/js/rutas-search.js` las lee solo).
3. **Chips de "Rutas por país"** en las 5 portadas (y `hoy/`): un `<a>` por ruta en el bloque del país; añadir el slug a `GLOSX_ROUTE_PAGES` en `assets/js/main.js` **y** `main.min.js`, y subir `?v=` de `main.min.js` en los 10 HTML (el sitio carga siempre la `.min`).
4. Commit **sin** `Co-Authored-By: Claude` (regla de glosx), `git pull --rebase --autostash`, `git push`.
5. Poner las URLs nuevas al frente de `~/.config/glosx/indexing-cola.txt` y mandar ~195/día con `node scripts/notify-google-index.js --file …` (cuota 200/día; se reinicia ~04:00 hora Argentina; probar con el lote, no con 1 URL).

## 6. Comprobar antes de dar por buena la ruta
- 5 páginas con: foto real, mapa, hotel, 3 preguntas de horarios, botones afiliados, sin `{{`/`undefined` visibles, sin enlaces internos rotos.
- Un vistazo en el navegador local (`python3 -m http.server 8765`) y la caché del navegador puede enseñar el JSON viejo: recargar con `cache:'reload'`.

## Errores que ya costaron tiempo
- Loop de zsh con variable → no genera nada y no avisa.
- Regenerar todo → 150+ archivos modificados por deriva.
- Falta de `HERO_PHOTOS` / `REAL_HOTELS` / `route-data.json` → página sin foto, hotel o mapa.
- Precios del catálogo de Omio no son fiables (mezclan tren, bus y vuelo): no mostrarlos.
