# Registro de Cambios y Handoffs

---
## Registro de cambios y estado operativo — 2026-11-26 (16:45 ART)

### 1. Tramoya (`tramoyaai.com` / `~/Projects/tramoya`)
- **TikTok Direct Post & Privacidad Pública:** Confirmados `TIKTOK_PUBLICAR_ACTIVO=1` y `TIKTOK_STATS_ACTIVO=1` en Railway; configurada variable `TIKTOK_PRIVACIDAD=PUBLIC_TO_EVERYONE`.
- **Código actualizado (`commit 3d5b2f0`):** `templates/armar.html` y `oauth_redes.py` dejan seleccionado por defecto `Publicar directo` (`modo: directo`) y `PUBLIC_TO_EVERYONE` (en lugar de borrador / `SELF_ONLY`).
- **LagarLab (`Marca 29` — `lagarlab.com`):** Creada y conectada la cuenta `@lagarlab` en TikTok (avatar tricolor en `~/Desktop/lagarlab-avatar-tiktok.png`). Actualizados en producción los **10 turnos pendientes** desde `2026-11-26 18:00` en adelante para publicar en las 5 redes (`instagram`, `facebook`, `youtube`, `tiktok`, `threads`).
- **Meta Developers (`App ID 1802528010971058`):** Verificación de empresa aprobada; permisos de Instagram, Facebook Páginas y Ads aprobados/renovados. Pendiente únicamente el cierre de revisión de `Acceder a la API de Threads` (enviada el `2026-11-21`, >330 llamadas registradas) para activar el botón **Publicar (Live)**.
- **Pinterest (`@glosx0072`):** App actualmente en *Trial access* (pendiente solicitar *Standard Access* en `://pinterest.com`).

### 2. Glosx (`glosx.app` / `~/Projects/glosx-app`)
- **Auditoría SEO cruzada (repo vs producción):** Informe completo guardado en `~/.hermes/shared/glosx_auditoria_seo_completa.md`.
- **Datos estructurados (`index.html`):** Inyectados bloques JSON-LD `FAQPage` (4 preguntas reales de la home) y `BreadcrumbList` antes de `</head>`, enviados a `origin/main` (`chore(seo): add FAQPage and BreadcrumbList JSON-LD to home`).
- **Google Search Console:** Verificados **546 elementos válidos** en *Rutas de exploración*.

### Catálogo aislado de EE. UU. (`_staging_eeuu/`) — 2026-11-26 (20:36 ART)
- **Dataset generado y validado:** **736 rutas verificadas** de Estados Unidos sin duplicados (`California: 240`, `Northeast Corridor & Regionales: 182`, `Midwest Hub: 156`, `Noroeste: 90`, `Florida: 56`, `Panorámicos: 12`).
- **Afiliación validada contra `voxa` (`affiliate.ts`):** Las rutas Amtrak/Brightline (`partner: "omio"`) apuntan a `/affiliate/europe-train?from=...&to=...` (`OMIO_DIRECT_LINK` + `omioPosTerm` con atribución Impact), y los 12 trenes turísticos privados quedan separados con `partner: "experiencias"`.
- **Aislamiento total:** Todo reside en `_staging_eeuu/` fuera de producción (`0` archivos públicos modificados), listo para auditoría e integración por Claude Code (`_staging_eeuu/AUDITORIA_EEUU_OMIO.md`).
