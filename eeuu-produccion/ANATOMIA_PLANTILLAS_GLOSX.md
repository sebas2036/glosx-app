# ANATOMÍA DE PLANTILLAS Y ARQUITECTURA VISUAL (GLOSX)

## 1. Estructura del DOM (Plantilla de Ruta)
El diseño sigue una arquitectura **Mobile-first** con los siguientes bloques:
- **`NAV`**: Fijo, con logo `WoW Train` y selector de idiomas.
- **`.route-hero`**: Área de cabecera con `background-image` dinámico, `<h1>` (título de ruta) y `.badge` (categoría).
- **`MAIN`**: Contenedor central (`max-width: 760px`).
- **Bloques de contenido**: `.lead` (resumen), tarjetas CTA (`.klook-cta` o `.omio-cta`), listas de beneficios (`<ul>`), secciones `.faq`.
- **`FOOTER`**: Links de navegación institucional y `.glx-social`.

## 2. Estilos CSS (Base)
- **Variables CSS**: `--bg: #fafaf8; --surface: #ffffff; --primary: #C10016; --text: #14151a; --muted: #55565f;`
- **Tipografía**: `Figtree`, con fallbacks de sistema.
- **Componentes clave**:
  - `.klook-cta`: Estilo degradado (degradado Naranja para Japón, Índigo/Coral para Omio).
  - `.cta-btn`: Botón redondeado de alta conversión.

## 3. Scripts y Lógica
- **`omio-bridge.js`**: Gestiona la transición visual entre glosx y Omio.
- **`lang-chip.js`**: Selector interactivo de idiomas (multilingüe).
- **`route-embed.js`**: Integración de contenido dinámico en rutas.
- **GA4/Auditoría**: Script en cierre de `<body>` que registra clics (`ui_click`) y el origen de la visita (`sessionStorage.getItem('glosx_src')`).

## 4. Bloques `<head>` (SEO)
- **Metadatos**: `canonical`, `hreflang` para 8 idiomas (`en`, `es`, `fr`, `de`, `it`, `pt`, `ja`, `zh`).
- **OpenGraph/Twitter**: Dinámicos según la ruta.
- **Schema**: `BreadcrumbList` y `FAQPage` (JSON-LD) al final del bloque `<head>`.

## 5. Scripts de generación existentes
- No se han encontrado scripts de automatización masiva (`/scripts/` o similares) en este recorrido. La estructura actual es mayoritariamente estática, optimizada para SEO. Se recomienda usar la plantilla de `/rutas/tokyo-morioka/de/index.html` como base para generar las 736 rutas de EE. UU.
