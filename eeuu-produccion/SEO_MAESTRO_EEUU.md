# Plan Maestro SEO — Expansión Estados Unidos (`eeuu-produccion/`)

Este documento define las reglas SEO obligatorias para que **Claude Code** integre las **736 rutas verificadas** y las **82 Guías de Ciudad** de Estados Unidos en los **8 idiomas (`en, es, fr, de, it, pt, ja, zh`)** sin páginas huérfanas, sin errores 404 y con máximo posicionamiento orgánico.

## 1. Arquitectura Piramidal Hub & Spoke (0 Huérfanas · Máximo 3 Clics)
- **Nivel 0 (Raíz):** `index.html`, `/explore/` y `/rutas/` enlazan directo al hub `usa-trains/` (en los 8 idiomas).
- **Nivel 1 (Hub `usa-trains/` + 6 Corredores y Trenes Panorámicos):**
  1. *Northeast Corridor & Regionales:* Boston ↔ New York ↔ Philadelphia ↔ Baltimore ↔ Washington DC (*Amtrak Acela / Northeast Regional*).
  2. *California:* San Diego ↔ Los Angeles ↔ Santa Barbara ↔ San Jose ↔ San Francisco/Emeryville ↔ Sacramento (*Pacific Surfliner / San Joaquins*).
  3. *Florida:* Miami ↔ Fort Lauderdale ↔ West Palm Beach ↔ Orlando ↔ Tampa (*Brightline / Silver Service*).
  4. *Midwest Hub:* Chicago ↔ Milwaukee ↔ St. Louis ↔ Detroit ↔ Minneapolis/St. Paul ↔ Kansas City.
  5. *Pacific Northwest:* Eugene ↔ Portland ↔ Tacoma ↔ Seattle ↔ Vancouver.
  6. *12 Trenes Panorámicos Icónicos:* California Zephyr, Coast Starlight, Empire Builder, Southwest Chief, Alaska Railroad Denali Star, Durango & Silverton, Grand Canyon Railway.
- **Nivel 2 (82 Hubs de Ciudad `/ciudades/{slug}/` × 8 idiomas):** cada ciudad lista todas sus salidas y llegadas en tren, estación principal real (*New York Penn Station*, *Boston South Station*, *Chicago Union Station*, *MiamiCentral*, *Los Angeles Union Station*), hotel recomendado, aeropuerto cercano y 4 atracciones.
- **Nivel 3 (736 Páginas de Ruta `/rutas/{origen}-{destino}/` × 8 idiomas):** cada ruta enlaza hacia arriba (`usa-trains/` + ciudad de origen + ciudad de destino) y hacia los lados (10 píldoras a rutas vecinas del mismo corredor). Mínimo 3 enlaces internos entrantes por página.

## 2. Intención de Búsqueda Real, Moneda `$ USD` y Guías Pilar
- **Títulos y H1 orientados a búsqueda real:**
  - **EN:** `{Origin} to {Destination} Train: {Operator} Times, Prices & Tickets (2026)`
  - **ES:** `Tren de {Origen} a {Destino}: Horarios, Precios y Billetes {Operador}`
  - (y equivalentes idiomáticos en `fr`, `de`, `it`, `pt`, `ja`, `zh`).
- **3 Guías Pilar de Fricción del Viajero en EE. UU. (× 8 idiomas, enlazadas desde `usa-trains/` y cada ruta):**
  1. *Amtrak vs Avión en EE. UU. (Northeast Corridor, California y Midwest): tiempos puerta a puerta y tarifas.*
  2. *Guía de clases, equipaje y estaciones en Amtrak y Brightline Florida (Coach, Business, Acela First, Roomette).*
  3. *Mejores trenes panorámicos de Estados Unidos (California Zephyr, Coast Starlight, Empire Builder y Denali Star): mejores tramos y reservas.*

## 3. Afiliación Dual (`Omio` vs `Experiencias`) y Limpieza Total
- Rutas Amtrak/Brightline (`partner: "omio"`) → `https://railway.app` (`OMIO_DIRECT_LINK` + atribución Impact).
- Los 12 trenes turísticos privados (`partner: "experiencias"`) → bloque de reserva de excursiones/experiencias.
- Precios 100 % en **`$ USD`** y coordenadas GPS exactas de EE. UU. (0 menciones a `€`, `Renfe`, `SNCF`, `Klook` o ciudades europeas).

## 4. Auditoría Técnica (`0` 404, `hreflang`), GEO (`llms.txt`) y Sitemaps
- Validar localmente antes del `git push` que **el 100 % de `href`, `src` de `.webp` (con fallback por corredor para las 31 ciudades sin foto propia), `canonical` y los 8 `hreflang` (+ `x-default`)** devuelvan HTTP `200`.
- Inyectar Schema JSON-LD válido (`BreadcrumbList`, `FAQPage` con las 15 preguntas visibles y `Dataset` / `Place`).
- Actualizar `llms.txt` y `llms-full.txt`, mantener el widget **«Lleva esta ruta a tu blog»** (`For bloggers`), generar `sitemap-us.xml` y `sitemap-cities.xml` bajo `sitemap-index.xml` y enviar por tandas a Google Search Console y Bing Webmaster Tools.
