#!/usr/bin/env node
/**
 * Regenera la sección de rutas del sitemap.xml en los 4 idiomas (EN/ES/FR/IT)
 * con hreflang, conservando el resto de URLs (home, blog, guías, legales).
 *
 * Fuente de verdad = los directorios en /rutas/ que tienen index.html.
 * Uso: node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, '../sitemap.xml');
const rutasDir = path.join(__dirname, '../rutas');
const TODAY = new Date().toISOString().slice(0, 10);
const LANGS = ['en', 'es', 'fr', 'it'];
const suffix = l => ({ en: '/', es: '/es/', fr: '/fr/', it: '/it/' }[l]);

// 1. Slugs de ruta existentes (dir con index.html en la raíz del slug)
const slugs = fs.readdirSync(rutasDir)
  .filter(s => fs.existsSync(path.join(rutasDir, s, 'index.html')))
  .sort();

// 2. Bloques <url> de una ruta: uno por idioma, cada uno con hreflang de los 4 + x-default
function routeBlocks(slug) {
  const alternates = LANGS
    .map(l => `      <xhtml:link rel="alternate" hreflang="${l}" href="https://glosx.app/rutas/${slug}${suffix(l)}" />`)
    .join('\n') +
    `\n      <xhtml:link rel="alternate" hreflang="x-default" href="https://glosx.app/rutas/${slug}/" />`;
  return LANGS.map(l => `  <url>
    <loc>https://glosx.app/rutas/${slug}${suffix(l)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${l === 'en' ? '0.8' : '0.7'}</priority>
${alternates}
  </url>`).join('\n');
}

// 3. Del sitemap actual, conservar los <url> que NO son de /rutas/
const xml = fs.readFileSync(sitemapPath, 'utf8');
const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
const nonRoute = urlBlocks.filter(b => !b.includes('/rutas/'));

// 4. Armar el nuevo sitemap (xhtml declarado una vez en el urlset)
const header = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
const routeSection = slugs.map(routeBlocks).join('\n');
const out = header + '\n' + nonRoute.join('\n') + '\n' + routeSection + '\n</urlset>\n';
fs.writeFileSync(sitemapPath, out);

console.log(`Sitemap regenerado: ${nonRoute.length} URLs no-ruta + ${slugs.length} rutas × 4 idiomas (${slugs.length * 4}) = ${nonRoute.length + slugs.length * 4} URLs`);
