# Handoff: Converting `/#japan` and `/#china` into Real Indexable Landing Pages (`/japan/` and `/china/`)

This document provides step-by-step instructions for Claude Code to promote the existing `#japan` and `#china` hash-based views into fully indexable standalone landing pages (`/japan/` and `/china/`) while preserving 100% of the visual design and responsive styling.

## Objectives
1. **Create standalone directories & files**:
   - `/japan/index.html`
   - `/china/index.html`
2. **Preserve visual design**:
   - Reuse existing CSS frameworks, components, and layout structures from `index.html`.
   - Ensure mobile-first responsiveness remains intact.
3. **Invert / Optimize `<h1>` headers**:
   - Ensure the primary `<h1>` tag on each page specifically targets the country/region (e.g., "High-Speed Rail Travel in Japan: Routes, Passes & Itineraries" for `/japan/`, and "China High-Speed Train Travel: Beijing, Shanghai & Beyond" for `/china/`), improving SEO relevance without altering the visual presentation.
4. **Internal Linking & Sitemap**:
   - Update `sitemap.xml` to include `/japan/` and `/china/`.
   - Ensure cross-links between the homepage, Europe, Japan, and China sections are active and correct.

## Implementation Steps for Claude Code
1. **Analyze existing templates**: Check how other section pages or root files are structured and rendered.
2. **Draft `/japan/index.html`**:
   - Set up appropriate meta tags (title, description, canonical, Open Graph).
   - Invert the `<h1>` to highlight Japan rail travel.
   - Embed the region-specific planner view or pre-selected Japan mode.
3. **Draft `/china/index.html`**:
   - Set up corresponding meta tags, canonicals, and localized Chinese rail guides.
   - Invert the `<h1>` to highlight China high-speed rail.
4. **Verification**:
   - Run local checks or test builds to ensure zero broken links or styling regressions.
