# Handoff: WebMCP Itinerary Planner Integration (`feat/webmcp-itinerary-planner`)

Este documento detalla la implementación del soporte para **WebMCP (Model Context Protocol in the Browser)** en **Glosx App** (`glosx-app`), permitiendo que asistentes de IA locales y agentes de navegador interactúen directamente con el planificador de itinerarios de trenes de la plataforma.

---

## 1. Resumen de Archivos Creados y Modificados

### Archivos Creados (Nuevos):
1. **`assets/js/webmcp.js`**: Implementa la definición de la herramienta `plan_train_itinerary`, con soporte para:
   - Detección segura de `navigator.modelContext`.
   - Compatibilidad robusta usando `navigator.modelContext.registerTool` con fallback automático a `navigator.modelContext.register`.
   - Conexión vía `fetch` POST al proxy backend en Railway (`https://voxa-production-dc15.up.railway.app/affiliate`), enviando los campos esperados (`prompt`, `trip_description`, `region`, `lang`, `language`) y parseando la respuesta estructurada con enlaces de afiliado a Omio, Klook y hoteles.
   - Entorno dual (compatible con ejecución en navegador y entorno de testing en Node.js).
2. **`usar .well-known/ai-catalog.json`**: Declaración estándar de metadatos de capacidades de IA expuestas por el sitio, especificando esquemas de entrada y salida (`input_schema` y `output_schema`) para la herramienta `plan_train_itinerary`.
3. **`tests/webmcp-planner.test.js`**: Suite de pruebas unitarias/integración en Node.js que valida:
   - Comportamiento seguro cuando `navigator.modelContext` no existe (no rompe la ejecución).
   - Registro exitoso usando tanto `.register` (fallback) como `registerTool`.
   - Invocación correcta con casos de prueba (`Madrid to Barcelona`, `Zurich to Milan`) simulando respuestas de la API de Railway.
4. **`docs/WEBMCP-HANDOFF.md`** (este documento): Handoff técnico detallado para continuidad con Claude Code y otros ingenieros.

### Archivos Intactos:
- **`assets/js/main.js`**: Se mantuvo **estrictamente intacto** según las directivas del proyecto. Toda la lógica de WebMCP se encapsuló de forma modular en `assets/js/webmcp.js` y se carga de manera asíncrona/defer en `index.html`.

---

## 2. Cómo Funciona el Flujo de WebMCP con Railway y Omio/Klook

1. **Invocación por el Agente / Modelo**:
   - El agente o navegador compatible con WebMCP detecta la herramienta `plan_train_itinerary` (registrada en `navigator.modelContext`).
   - Al recibir una solicitud del usuario (ej. *"Plan a 5-day train trip from Zurich to Milan"*), invoca la herramienta pasando `trip_description`, `region` (Europe, Japan, China) y opcionalmente `language`.

2. **Llamada al Backend Proxy en Railway**:
   - `webmcp.js` realiza un `POST` a `https://voxa-production-dc15.up.railway.app/affiliate` con cabecera `X-WebMCP-Invocation: true` y el payload unificado de parámetros.

3. **Respuesta Estructurada y Enlaces de Afiliado**:
   - El backend procesa la solicitud de itinerario asistido por IA y devuelve los segmentos de tren detallados (origen, destino, operador, horas de salida/llegada) junto con los enlaces de afiliado directos a **Omio** (comparador multiproveedor), **Klook** (tramos específicos de tren) y **Klook Hotels** / plataformas de alojamiento.

---

## 3. Estado de Pruebas y Validación

La suite de pruebas automatizadas se ejecuta con Node.js y pasa al 100%:
```bash
node tests/webmcp-planner.test.js
```
**Resultado verificado:**
- ✓ Manejo correcto sin errores cuando `navigator.modelContext` está ausente.
- ✓ Registro exitoso mediante `registerTool` y fallback a `register`.
- ✓ Validación de esquemas de parámetros requeridos (`trip_description`, `region`).
- ✓ Invocación exitosa con mocks de respuesta para rutas europeas clave.

---

## 4. Pendientes, Siguientes Pasos y Expansión

1. **Pruebas en Entorno de Navegador Real**:
   - Probar la integración en navegadores con soporte experimental de WebMCP o extensiones de agente de navegador.
2. **Expansión Multilingüe**:
   - Ampliar las descripciones de la herramienta en `ai-catalog.json` y `webmcp.js` para soportar descripciones de prompts en español (`es`), francés (`fr`), alemán (`de`), italiano (`it`) y japonés (`ja`).
3. **Monitoreo y Analítica**:
   - Añadir telemetría (Google Analytics / `gtag`) para registrar eventos de invocación exitosa de WebMCP bajo el evento `webmcp_invocation`.
