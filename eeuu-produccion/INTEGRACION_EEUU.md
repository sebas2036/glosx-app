# INSTRUCCIONES PARA CLAUDE CODE: Integración del Catálogo de EE. UU.

Este archivo guía la integración del paquete maestro `eeuu-produccion/` al sitio en producción.

## 1. Alcance: Solo EE. UU.
Por ahora, **solo integramos Estados Unidos**. Ignorar la carpeta `china-produccion-new/` por completo en esta fase.

## 2. Checklist de Integración (EE. UU.)
1. **Generación Masiva:** Crear las ~5,888 páginas (736 rutas × 8 idiomas) usando `eeuu-produccion/plantilla_eeuu.html` + `eeuu-produccion/rutas_eeuu.json` + `eeuu-produccion/i18n_eeuu.json`.
2. **Estructura de Carpetas:** Las rutas deben vivir en `/rutas/{slug}/{lang}/index.html` (o raíz para EN).
3. **Assets:** Mover las fotos de `eeuu-produccion/assets/img/ciudades/` a `/assets/img/ciudades/` en producción.
4. **Indexación:**
   - Actualizar los sitemaps.
   - Asegurar que la estructura de `hreflang` sea correcta para los 8 idiomas.
   - Enlazar las nuevas rutas desde el hub `/usa-trains/` y la sección `#scenic` de la home.

## 3. Lógica de Afiliación (EE. UU. - Omio)
Usar estrictamente este endpoint:
`https://voxa-production-dc15.up.railway.app/affiliate/europe-train?from={origen}&to={destino}`
*(Se usa `europe-train` como endpoint genérico para el backend de Omio).*

## 4. Reglas de Seguridad
- **Cero residuos:** Eliminar toda mención a términos europeos (España, Renfe, €, etc.) en los archivos generados.
- **Validación:** Ejecutar `eeuu-produccion/validar_urls_omio.py` antes de considerar la tarea terminada.
- **Sin Push:** La integración debe quedar local y lista para auditoría final antes de cualquier comando `git push`.
