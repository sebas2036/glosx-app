#!/usr/bin/env node
/**
 * Regenera la sección de rutas del sitemap.xml en los 8 idiomas publicados
 * (EN/ES/FR/DE/IT/PT/JA/ZH) con hreflang, conservando el resto de URLs.
 *
 * Fuente de verdad = los directorios en /rutas/ que tienen index.html.
 * Uso: node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, '../sitemap.xml');
const rutasDir = path.join(__dirname, '../rutas');
const TODAY = new Date().toISOString().slice(0, 10);
const LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'];
const HREFLANG = { zh: 'zh-Hans' };
const hreflang = l => HREFLANG[l] || l;
const suffix = l => ({ en: '/', es: '/es/', fr: '/fr/', de: '/de/', it: '/it/', pt: '/pt/', ja: '/ja/', zh: '/zh/' }[l]);

// 1. Slugs de ruta existentes (dir con index.html en la raíz del slug)
// Se saltan las carpetas que son solo una redireccion (noindex / meta refresh): no deben ir al sitemap.
const isStub = s => /noindex|http-equiv="refresh"/i.test(fs.readFileSync(path.join(rutasDir, s, 'index.html'), 'utf8'));
const slugs = fs.readdirSync(rutasDir)
  .filter(s => fs.existsSync(path.join(rutasDir, s, 'index.html')) && !isStub(s))
  .sort();
// Solo se listan los idiomas cuya pagina existe de verdad (evita URLs 404 en el sitemap).
const langExists = (slug, l) => fs.existsSync(path.join(rutasDir, slug, l === 'en' ? '' : l, 'index.html'));

// 2. Bloques <url> de una ruta: uno por idioma disponible, con hreflang recíprocos + x-default.
function routeBlocks(slug) {
  const present = LANGS.filter(l => langExists(slug, l));
  const alternates = present
    .map(l => `      <xhtml:link rel="alternate" hreflang="${hreflang(l)}" href="https://glosx.app/rutas/${slug}${suffix(l)}" />`)
    .join('\n') +
    `\n      <xhtml:link rel="alternate" hreflang="x-default" href="https://glosx.app/rutas/${slug}/" />`;
  return present.map(l => `  <url>
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

const hubLangs = LANGS.filter(l =>
  fs.existsSync(path.join(__dirname, '..', l === 'en' ? '' : l, 'rutas', 'index.html'))
);
const hubAlts = hubLangs
  .map(l => `      <xhtml:link rel="alternate" hreflang="${hreflang(l)}" href="https://glosx.app${suffix(l)}rutas/" />`)
  .join('\n') +
  `\n      <xhtml:link rel="alternate" hreflang="x-default" href="https://glosx.app/rutas/" />`;
const hubBlocks = hubLangs.map(l => `  <url>
    <loc>https://glosx.app${suffix(l)}rutas/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
${hubAlts}
  </url>`).join('\n');
const hoyLangs = LANGS.filter(l =>
  fs.existsSync(path.join(__dirname, '..', l === 'en' ? '' : l, 'hoy', 'index.html'))
);
const hoyAlts = hoyLangs
  .map(l => `      <xhtml:link rel="alternate" hreflang="${hreflang(l)}" href="https://glosx.app${suffix(l)}hoy/" />`)
  .join('\n') +
  `\n      <xhtml:link rel="alternate" hreflang="x-default" href="https://glosx.app/hoy/" />`;
const hoyBlocks = hoyLangs.map(l => `  <url>
    <loc>https://glosx.app${suffix(l)}hoy/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
${hoyAlts}
  </url>`).join('\n');
const withoutHub = nonRoute.filter(b => !b.includes('https://glosx.app/rutas/</loc>') && !b.includes('/hoy/'));
const HOME_JA = `    <xhtml:link rel="alternate" hreflang="ja" href="https://glosx.app/ja/" />`;
function withJaHome(b) {
  const isHome = /<loc>https:\/\/glosx\.app\/(?:es\/|fr\/|it\/|ja\/)?<\/loc>/.test(b);
  if (!isHome || b.includes('hreflang="ja"')) return b;
  return b.replace('    <xhtml:link rel="alternate" hreflang="x-default" href="https://glosx.app/" />', HOME_JA + '\n    <xhtml:link rel="alternate" hreflang="x-default" href="https://glosx.app/" />');
}
const jaHomeBlock = `  <url>
    <loc>https://glosx.app/ja/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://glosx.app/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://glosx.app/es/" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://glosx.app/fr/" />
    <xhtml:link rel="alternate" hreflang="it" href="https://glosx.app/it/" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://glosx.app/ja/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://glosx.app/" />
  </url>`;
const withFreshHome = withoutHub.map(b => {
  b = withJaHome(b);
  if (b.includes('<loc>https://glosx.app/</loc>')) {
    return b.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${TODAY}</lastmod>`);
  }
  return b;
});
if (!withFreshHome.some(b => b.includes('<loc>https://glosx.app/ja/</loc>'))) {
  const itIdx = withFreshHome.findIndex(b => b.includes('<loc>https://glosx.app/it/</loc>'));
  if (itIdx >= 0) withFreshHome.splice(itIdx + 1, 0, jaHomeBlock);
  else withFreshHome.unshift(jaHomeBlock);
}
const nonRouteFinal = [hubBlocks, hoyBlocks, ...withFreshHome];

// 4. Armar el nuevo sitemap (xhtml declarado una vez en el urlset)
const header = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
const routeSection = slugs.map(routeBlocks).join('\n');
const out = header + '\n' + nonRouteFinal.join('\n') + '\n' + routeSection + '\n</urlset>\n';
const countLocs = xml => (xml.match(/<loc>/g) || []).length;
const nonRouteUrlCount = countLocs(nonRouteFinal.join('\n'));
const routeUrlCount = countLocs(routeSection);
fs.writeFileSync(sitemapPath, out);

console.log(`Sitemap regenerado: ${nonRouteUrlCount} URLs no-ruta + ${routeUrlCount} rutas = ${nonRouteUrlCount + routeUrlCount} URLs`);
