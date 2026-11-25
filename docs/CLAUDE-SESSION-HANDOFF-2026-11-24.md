# Master Session Handoff & Safety Guide — November 24, 2026

This document serves as the authoritative master record of all changes completed during the session on November 24, 2026, and provides strict safety rules for Claude Code to prevent regressions.

---

## 1. Changes Already Merged into `main` (DO NOT OVERWRITE OR REVERT)

- **Multilingual Sitemaps (8 Languages)**:
  - Generated sitemaps covering `en`, `es`, `fr`, `de`, `it`, `pt`, `ja`, and `zh`.
  - 3,992 URLs successfully submitted to Google Search Console (including all 118 China route guides).
- **`llms.txt` (Root)**:
  - Updated to strict `llmstxt.org` standard.
  - Includes official Open Transport Data Switzerland showcase link (`data.opentransportdata.swiss/en/showcase/wow-train`), WebMCP AI catalog reference, and full routing guides for Europe, Japan, and China across 8 languages.
- **Documentation (`docs/`)**:
  - `docs/BACKLINK-OUTREACH-PACK.md`: Outreach email templates, iframe embed snippets, and tourism board resources.
  - `docs/SEO-CHINA-VS-JAPAN-AUDIT.md`: Comparative SEO audit for China vs. Japan rail corridors.
  - `docs/SEO-LANDING-PAGES-HANDOFF.md`: Blueprint for promoting `/#japan` and `/#china` hash views into standalone indexable pages (`/japan/` and `/china/`).

---

## 2. Open Branch: `feat/webmcp-itinerary-planner`

- **Components Included**:
  - `assets/js/webmcp.js`: Client-side WebMCP implementation and AI agent tool handlers.
  - `.well-known/ai-catalog.json`: Standard AI metadata descriptor.
  - `tests/webmcp-planner.test.js`: Test suite for WebMCP functionality.
  - `docs/WEBMCP-HANDOFF.md`: Integration details for the Railway backend proxy (`https://voxa-production-dc15.up.railway.app/affiliate`).
  - `index.html`: Contains `<script src="assets/js/webmcp.js" defer></script>`.
- **CRITICAL SAFETY RULE FOR CLAUDE**:
  - `assets/js/main.js` must remain 100% untouched.
  - Do not overwrite `assets/js/webmcp.js` or break core functions (`generateAIRoute()`, `goKlookMenu()`, `goPartner()`).

---

## 3. Next Steps for Claude Code (Priority Order)

1. **Review & Merge `feat/webmcp-itinerary-planner`**:
   - Verify tests and merge into `main`.
   - Replicate the `<script src="assets/js/webmcp.js" defer></script>` inclusion across localized homepage variants (`/es/`, `/fr/`, `/de/`, `/it/`, `/pt/`, `/ja/`, `/zh/`) if applicable.
2. **Execute SEO Landing Pages (`docs/SEO-LANDING-PAGES-HANDOFF.md`)**:
   - Create `/japan/index.html` and `/china/index.html`.
   - Invert the `<h1>` to target country-specific high-speed rail search intent without altering visual design.
   - Update `sitemap.xml`.
