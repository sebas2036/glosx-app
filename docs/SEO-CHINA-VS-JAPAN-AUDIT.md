# Auditoría SEO Comparativa: China vs. Japón en Glosx.app

Este documento recopila el análisis SEO comparativo profundo entre las rutas de **Japón** y **China** en la plataforma **Glosx.app (WoW Train)**, cruzando datos reales de Google Search Console (vía ClawLink), la arquitectura del código fuente y los sitemaps del repositorio, con el fin de servir como guía definitiva e implementación para Claude Code.

---

## 1. Rendimiento en Google Search Console (China vs. Japón)

### Japón (Dominio y Tracción Activa):
- **Volumen**: Más de 163 URLs indexadas y activas en GSC generando impresiones diarias y clics constantes.
- **Consultas principales**: Alta presencia en términos transaccionales e informativos bilingües/japoneses (ej. *東京から松本 あずさ*, *大阪駅から和歌山駅 くろしお*, *成田エクスプレス 東京から横浜*).
- **Posicionamiento**: La mayoría de las rutas principales de Shinkansen y expresos se sitúan en posiciones orgánicas competitivas (Top 5 a 15), con CTRs saludables en dispositivos móviles y desktop.

### China (Invisibilidad y Oportunidad Perdida):
- **Volumen**: Prácticamente **cero impresiones y clics** en GSC para rutas de tren dedicadas. Las únicas menciones provienen de posts de blog genéricos dispersos (`blog-china-train-guide.html`, `blog-china-scenic-train-rides.html`).
- **Diagnóstico**: Al no existir páginas de aterrizaje estructuradas (`/rutas/`) para los corredores de alta velocidad chinos (CRH / Fuxing), Googlebot no encuentra contenido específico para indexar frente a las búsquedas globales de alta velocidad en Asia (*Beijing to Shanghai high speed train*, *Xi'an bullet train tickets*).

---

## 2. Diagnóstico Técnico y de Contenido Comparativo (Código y Sitemaps)

### Páginas de Rutas de Japón (`/rutas/.../ja/` / es / en):
- **Estructura HTML**: Plantillas optimizadas con H1 claros, metatítulos orientados a intención de compra (*train tickets, schedules, booking*), descripciones meta atractivas y breadcrumbs.
- **Datos Estructurados (JSON-LD)**: Implementación robusta de `TrainTrip`, `Product` y `FAQPage` que facilita los rich snippets en Google.
- **Hreflang & Sitemaps**: Inclusión explícita en `sitemap.xml` y soporte multilingüe en subdirectorios (`/ja/`, `/es/`, `/fr/`, `/it/`).
- **Monetización**: Enlaces directos a `PROXY_BASE` (`https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=...&to=...`) y widgets integrados.

### Situación Actual de China en el Repositorio:
- **Carencia de Landing Pages**: No existen directorios ni archivos HTML en `/rutas/` orientados a ciudades chinas.
- **Desconexión del Embudo**: Los artículos de blog existentes sobre China actúan como callejones sin salida informativos, sin enlaces directos a la reserva de tramos ferroviarios específicos mediante el proxy de afiliación.

---

## 3. ¿Por qué Japón Tracciona Mejor que China?

1. **Arquitectura de Enlazado Interno**: Las rutas de Japón están enlazadas desde hubs principales (`/destinos/`, bloques de rutas populares en la portada y artículos relacionados).
2. **Profundidad de Contenido**: Cada ruta japonesa incluye información GTFS/horarios detallados, estaciones de salida y llegada (ej. Tokyo Station a Shin-Osaka), y alternativas de alojamiento curado.
3. **Intención de Búsqueda Capturada**: Cobertura exhaustiva tanto de líneas principales (Tokaido Shinkansen) como de líneas regionales (JR East / JR West).

---

## 4. Plan de Acción Priorizado para China

1. **Crear las 15 Páginas de Rutas Core de China**: Replicando exactamente la plantilla HTML y esquema JSON-LD de las rutas de Japón.
2. **Optimizar Títulos e H1 con Keywords de Alta Intención Global y Local**: Enfocadas en *High-Speed Train*, *Bullet Train*, *CRH/Fuxing*.
3. **Conectar el Embudo de Afiliación con Railway / Klook**: Integrar los enlaces de afiliado a través de `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=X&to=Y`.
4. **Actualizar el Sitemap**: Incluir todas las nuevas URLs en `sitemap.xml` para acelerar el rastreo e indexación por Googlebot.

---

## 5. Los 15 Corredores Ferroviarios Prioritarios de China

Para que Claude Code proceda a la creación de estas páginas replicando la estructura de Japón, se detallan los 15 corredores prioritarios con sus slugs sugeridos, títulos SEO y enlaces de afiliado Klook:

1. **Beijing a Shanghai (京沪高速铁路)**
   - **Slug sugerido**: `/rutas/beijing-shanghai/`
   - **Título SEO**: Beijing to Shanghai High-Speed Train: Schedule, Tickets & Booking | Glosx
   - **Meta Descripción**: Book high-speed train tickets from Beijing to Shanghai (Fuxing/CRH). Check schedules, durations (4.5h), and book securely via Klook.
   - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=Beijing&to=Shanghai`

2. **Beijing a Xi'an**
   - **Slug sugerido**: `/rutas/beijing-xian/`
   - **Título SEO**: Beijing to Xi'an Bullet Train: Schedule, Tickets & Price | Glosx
   - **Meta Descripción**: Plan your trip from Beijing to Xi'an by high-speed rail. Compare schedules, check Terracotta Army travel tips, and book tickets.
   - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=Beijing&to=Xian`

3. **Shanghai a Hangzhou**
   - **Slug sugerido**: `/rutas/shanghai-hangzhou/`
   - **Título SEO**: Shanghai to Hangzhou Train Tickets & Schedule | Glosx
   - **Meta Descripción**: Fast and frequent bullet trains from Shanghai to Hangzhou (West Lake). Check timetables, travel time (45 mins), and book online.
   - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=Shanghai&to=Hangzhou`

4. **Shanghai a Suzhou**
   - **Slug sugerido**: `/rutas/shanghai-suzhou/`
   - **Título SEO**: Shanghai to Suzhou Bullet Train Guide & Tickets | Glosx
   - **Meta Descripción**: Travel between Shanghai and Suzhou in just 25 minutes by high-speed train. View schedules, ticket prices, and booking links.
   - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=Shanghai&to=Suzhou`

5. **Chengdu a Chongqing**
   - **Slug sugerido**: `/rutas/chengdu-chongqing/`
   - **Título SEO**: Chengdu to Chongqing High-Speed Train & Schedule | Glosx
   - **Meta Descripción**: Connect Sichuan and Chongqing via high-speed rail. Check daily departures, journey duration (1.5h), and book tickets.
   - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=Chengdu&to=Chongqing`

6. **Guangzhou a Shenzhen**
   - **Slug sugerido**: `/rutas/guangzhou-shenzhen/`
   - **Título SEO**: Guangzhou to Shenzhen Intercity Bullet Train | Glosx
   - **Meta Descripción**: Fast intercity high-speed train service between Guangzhou and Shenzhen. Check schedules (30 mins), frequencies, and book.
   - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=Guangzhou&to=Shenzhen`

7. **Beijing a Tianjin**
   - **Slug sugerido**: `/rutas/beijing-tianjin/`
   - **Título SEO**: Beijing to Tianjin Intercity High-Speed Train | Glosx
   - **Meta Descripción**: Travel from Beijing to Tianjin in 30 minutes on China's premier intercity bullet train line. View schedules and book tickets.
   - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=Beijing&to=Tianjin`

8. **Shanghai a Nanjing**
   - **Slug sugerido**: `/rutas/shanghai-nanjing/`
   - **Título SEO**: Shanghai to Nanjing Bullet Train Schedule & Tickets | Glosx
   - **Meta Descripción**: Explore the historic route from Shanghai to Nanjing by high-speed rail. Check journey times (1h), schedules, and ticket options.
   - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=Shanghai&to=Nanjing`

9. **Xi'an a Chengdu**
   - **Slug sugerido**: `/rutas/xian-chengdu/`
   - **Título SEO**: Xi'an to Chengdu High-Speed Train Through the Mountains | Glosx
   - **Meta Descripción**: Scenic engineering marvel connecting Xi'an and Chengdu by bullet train. Check timetables, travel duration, and booking.
   - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=Xian&to=Chengdu`

10. **Beijing a Guangzhou**
    - **Slug sugerido**: `/rutas/beijing-guangzhou/`
    - **Título SEO**: Beijing to Guangzhou Long-Distance High-Speed Train | Glosx
    - **Meta Descripción**: Cross China from north to south on the Beijing-Guangzhou high-speed railway. View schedules, durations, and ticket booking.
    - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=Beijing&to=Guangzhou`

11. **Shanghai a Beijing** (Sentido inverso optimizado)
    - **Slug sugerido**: `/rutas/shanghai-beijing/`
    - **Título SEO**: Shanghai to Beijing High-Speed Train Tickets & Schedule | Glosx
    - **Meta Descripción**: Return high-speed train journey from Shanghai to Beijing. Compare departure times, seat classes, and book tickets online.
    - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=Shanghai&to=Beijing`

12. **Hong Kong a Shenzhen** (Conexión transfronteriza GZ-SZ-HK)
    - **Slug sugerido**: `/rutas/hong-kong-shenzhen/`
    - **Título SEO**: Hong Kong West Kowloon to Shenzhen Train Guide | Glosx
    - **Meta Descripción**: Fast cross-border high-speed rail connection from Hong Kong West Kowloon to Shenzhen. Check schedules (15 mins) and tickets.
    - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=HongKong&to=Shenzhen`

13. **Hong Kong a Guangzhou**
    - **Slug sugerido**: `/rutas/hong-kong-guangzhou/`
    - **Título SEO**: Hong Kong to Guangzhou Bullet Train Schedule & Booking | Glosx
    - **Meta Descripción**: Direct high-speed train travel between Hong Kong and Guangzhou South. Check travel time (48 mins), schedules, and book.
    - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=HongKong&to=Guangzhou`

14. **Hangzhou a Huangshan** (Ruta escénica turística)
    - **Slug sugerido**: `/rutas/hangzhou-huangshan/`
    - **Título SEO**: Hangzhou to Huangshan High-Speed Scenic Train | Glosx
    - **Meta Descripción**: Travel from Hangzhou to the legendary Yellow Mountains (Huangshan) by high-speed rail. Check schedules and tickets.
    - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=Hangzhou&to=Huangshan`

15. **Chengdu a Jiuzhaigou** (Conexión alpina / turística)
    - **Slug sugerido**: `/rutas/chengdu-jiuzhaigou/`
    - **Título SEO**: Chengdu to Jiuzhaigou Train & Travel Guide | Glosx
    - **Meta Descripción**: Plan your mountain escape from Chengdu toward Jiuzhaigou valley using high-speed rail and connecting transport options.
    - **Enlace Klook (Proxy)**: `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=Chengdu&to=Jiuzhaigou`
