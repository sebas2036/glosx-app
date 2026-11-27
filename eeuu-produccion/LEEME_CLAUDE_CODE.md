# Paquete Maestro EE. UU. — `eeuu-produccion/` (Listo para Claude Code)

Esta carpeta contiene todo el paquete aislado de **Estados Unidos** (736 rutas + 82 ciudades + fotos `.webp` + traducciones en 8 idiomas + plantilla limpia), **aún sin enlazar en `index.html` ni sitemaps públicos** hasta ejecutar la integración final.

## Inventario de archivos en `eeuu-produccion/`
1. **`rutas_eeuu.json`:** **736 rutas verificadas** sin duplicados (`California: 240`, `Northeast Corridor & Regionales: 182`, `Midwest Hub: 156`, `Noroeste: 90`, `Florida: 56`, `Panorámicos: 12`).
   - `partner: "omio"` → apunta a `https://railway.app` (validado contra `voxa/backend/src/routes/affiliate.ts`: `OMIO_DIRECT_LINK` + `omioPosTerm` con atribución Impact).
   - `partner: "experiencias"` → separado para los 12 trenes turísticos privados.
2. **`ciudades_eeuu.json`:** **82 ciudades únicas** extraídas de las 736 rutas con esquema dual (rutas + futuras **82 Guías de Ciudad** `/ciudades/{slug}/` en los 8 idiomas): `slug_ciudad`, `nombre`, `estado`, `estacion_principal`, `lat`, `lon`, `hotel_recomendado`, `atracciones`, `resumen_ciudad`, `mejor_epoca`, `aeropuerto_cercano` y `conexiones_ferroviarias`.
3. **`assets/img/ciudades/*.webp`:** **51 fotos `.webp`** optimizadas (`1200px`, `quality=80`) descargadas vía Pexels API.
4. **`i18n_eeuu.json` + `plantilla_eeuu.html` + `ANATOMIA_PLANTILLAS_GLOSX.md` + `AUDITORIA_EEUU_OMIO.md`:** diccionario en los **8 idiomas** (`en, es, fr, de, it, pt, ja, zh`) y molde limpio con la estética exacta de `glosx.app` (`--primary: #C10016`, `--bg: #fafaf8`, Figtree, `.omio-cta`, `omio-bridge.js`, `lang-chip.js`, JSON-LD `BreadcrumbList` + `FAQPage` + `Dataset`).

## Checklist de integración para Claude Code
1. Completar las coordenadas GPS exactas (`lat`, `lon`), códigos de aeropuerto (`aeropuerto_cercano`) y hotel real de cada una de las **82 ciudades** en `eeuu-produccion/ciudades_eeuu.json`.
2. Asignar foto `.webp` de respaldo (por corredor/estado o completando desde Pexels) a las **31 ciudades** de las 82 que aún no tienen `.webp` propio en `eeuu-produccion/assets/img/ciudades/`.
3. Generar en lote las **736 páginas de ruta × 8 idiomas (`5.888 HTML`)** + las **82 Guías de Ciudad × 8 idiomas (`656 HTML`)** usando `plantilla_eeuu.html` + `i18n_eeuu.json`, manteniendo 0 ocurrencias de términos/monedas europeas.
4. Crear el hub `usa-trains/` (8 idiomas), sumar Estados Unidos en `index.html`, `/rutas/`, `/explore/` y `#scenic` (12 trenes panorámicos), regenerar `sitemap-us.xml` + `sitemap-index.xml` y actualizar `CHANGELOG.md`.

- **Plan Maestro SEO específico de EE. UU.:** leer y aplicar obligatoriamente `eeuu-produccion/SEO_MAESTRO_EEUU.md`.
