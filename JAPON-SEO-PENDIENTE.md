# Japón: SEO pendiente (glosx.app)

Estado al 05-oct-2026: el modo Japón del buscador está en vivo (196 pares, enlaces de Klook con marker 734304, duración y tren por par). Lo de SEO se dejó aparte, a propósito.

## Regla principal
No generar 100 páginas de golpe. El 04-oct había 131 URLs sin indexar y las páginas finas lo empeoran. Hacer 10-15 páginas con contenido real y luego medir.

## Candidatas (por demanda y datos ya validados)
1. Tokio – Kioto (2 h 7 min, Nozomi/Hikari)
2. Tokio – Osaka (2 h 21 min)
3. Osaka – Kioto (13 min)
4. Kioto – Hiroshima
5. Osaka – Hiroshima
6. Tokio – Nagoya
7. Tokio – Kanazawa (Kagayaki/Hakutaka)
8. Aeropuerto de Narita – Tokio (Narita Express)
9. Aeropuerto de Kansai – Kioto (Haruka)
10. Tokio – Hiroshima
11. Tokio – Fukuoka
12. Nagoya – Takayama (Hida)
13. Sapporo – Otaru
14. Tokio – Sendai
15. Shinjuku – Hakone (Romancecar)

## Contenido real por página (no relleno)
- Duración y tipo de tren (ya está en `assets/js/japan.js`, bloque INFO).
- Qué estación usar en cada ciudad y cómo llegar a la otra.
- Shinkansen vs. tren limitado: cuándo conviene cada uno.
- Consejos propios (asiento, equipaje, horarios punta).
- FAQ con schema (FAQPage + BreadcrumbList + Article), igual que /rutas/.
- Enlace de reserva con marker (Klook), sin links a competidores.
- Español neutro, sin voseo, sin emojis, en los 4 idiomas del sitio.

## Pendientes técnicos
- Hero sigue diciendo "trenes europeos"; ajustar texto para Japón.
- Fotos de chips de Japón (no existe country-pics/jp.webp).
- Añadir las páginas al sitemap y avisar a la Indexing API.
- Medir PageSpeed tras sumar `japan.js` (35 KB, defer).
- Validar con otras fechas (los datos son del 2026-10-20).
- Confirmar comisión de JR Japón en Travelpayouts.
- Itinerario con IA para Japón (opción B, `glosx-backend`): descartado por ahora.

## Siguiente tema
China, después de cerrar Japón. Primero investigar cómo expone Klook sus trenes de China.
