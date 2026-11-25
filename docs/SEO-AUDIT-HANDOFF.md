# SEO audit handoff for Claude Code

## Sitemap generator fix

`/scripts/generate-sitemap.js` previously rebuilt route URLs only for EN/ES/FR/IT, despite route pages existing in EN/ES/FR/DE/IT/PT/JA/ZH. It also hardcoded only five `/hoy/` locales and only the English `/rutas/` index. A regeneration could therefore drop valid localized URLs from the sitemap.

The generator now discovers which supported locale pages exist on disk, emits all present route and hub variants, uses `zh-Hans` for `/zh/`, and derives its completion count from actual `<loc>` entries. It does not regenerate or submit the live sitemap by itself.

## Verification

```bash
node --check scripts/generate-sitemap.js
node --test tests/generate-sitemap-languages.test.js
```

All three regression tests pass. A full run against a temporary copy produced valid XML with 3,992 URLs, zero duplicates, and the same URL set as the checked-in main sitemap. Tests cover route pages, localized `/rutas/` indexes, localized `/hoy/` pages, and `zh-Hans` hreflang.

## Follow-up audit notes

- Search Console sitemap counts for language shards should be reconciled with the repository files before the next submission. Do not assume the API's `indexed=0` sitemap field means the entire site is not indexed; compare it with URL Inspection and the Search Console UI.
- `robots.txt` currently advertises both the full sitemap and sitemap index. Choose one submission strategy to avoid redundant reports.
- `/scripts/promo/public/` is reachable on the live site. Review whether it should be removed from public hosting or protected with authentication; `noindex` alone is not access control.
- The German Support page still has an English title.
- Keep Search Console exports and private performance data out of this public repository.

## Deployment state

This is a local branch change only until merged/deployed. No sitemap files were regenerated, no Search Console write actions were run, and no live site changes were made.
