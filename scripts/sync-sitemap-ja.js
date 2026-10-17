#!/usr/bin/env node
/**
 * Mantiene el sitemap al día con las páginas en japonés: añade <url> para cada /rutas/<slug>/ja/ y el
 * hreflang="ja" en todas las variantes de esa ruta. Idempotente. Uso: node scripts/sync-sitemap-ja.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const f = path.join(ROOT, 'sitemap.xml');
const today = new Date().toISOString().slice(0, 10);
let s = fs.readFileSync(f, 'utf8');
const slugs = fs.readdirSync(path.join(ROOT, 'rutas')).filter(d => fs.existsSync(path.join(ROOT, 'rutas', d, 'ja', 'index.html')));
let added = 0, linked = 0;
for (const slug of slugs) {
  const base = `https://glosx.app/rutas/${slug}/`;
  const jaUrl = base + 'ja/';
  // hreflang ja en las variantes existentes
  s = s.replace(/<url>[\s\S]*?<\/url>/g, (blk) => {
    const loc = (blk.match(/<loc>([^<]+)<\/loc>/) || [])[1] || '';
    if (!(loc === base || loc === base + 'es/' || loc === base + 'fr/' || loc === base + 'it/')) return blk;
    if (blk.includes('hreflang="ja"')) return blk;
    linked++;
    return blk.replace(/(\s*)<xhtml:link rel="alternate" hreflang="x-default"/, `$1<xhtml:link rel="alternate" hreflang="ja" href="${jaUrl}" />$1<xhtml:link rel="alternate" hreflang="x-default"`);
  });
  if (!s.includes(`<loc>${jaUrl}</loc>`)) {
    const alt = ['en', 'es', 'fr', 'it', 'ja'].map(l => `      <xhtml:link rel="alternate" hreflang="${l}" href="${l === 'en' ? base : base + l + '/'}" />`).join('\n');
    const entry = `  <url>\n    <loc>${jaUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n${alt}\n      <xhtml:link rel="alternate" hreflang="x-default" href="${base}" />\n  </url>\n`;
    s = s.replace('</urlset>', entry + '</urlset>');
    added++;
  }
}
// páginas estáticas ja (/ja/*.html): legales, soporte, blog y guías
let pages = 0;
for (const file of fs.readdirSync(path.join(ROOT, 'ja')).filter(n => n.endsWith('.html') && n !== '404.html')) {
  const jaUrl = `https://glosx.app/ja/${file}`;
  const enUrl = `https://glosx.app/${file}`;
  s = s.replace(/<url>[\s\S]*?<\/url>/g, (blk) => {
    const loc = (blk.match(/<loc>([^<]+)<\/loc>/) || [])[1] || '';
    if (loc !== enUrl && loc !== `https://glosx.app/es/${file}` && loc !== `https://glosx.app/fr/${file}` && loc !== `https://glosx.app/it/${file}`) return blk;
    if (blk.includes('hreflang="ja"')) return blk;
    return /hreflang="x-default"/.test(blk)
      ? blk.replace(/(\s*)<xhtml:link rel="alternate" hreflang="x-default"/, `$1<xhtml:link rel="alternate" hreflang="ja" href="${jaUrl}" />$1<xhtml:link rel="alternate" hreflang="x-default"`)
      : blk.replace('</url>', `      <xhtml:link rel="alternate" hreflang="ja" href="${jaUrl}" />\n  </url>`);
  });
  if (!s.includes(`<loc>${jaUrl}</loc>`)) {
    const hasEn = fs.existsSync(path.join(ROOT, file));
    const alt = (hasEn ? `      <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />\n` : '') + `      <xhtml:link rel="alternate" hreflang="ja" href="${jaUrl}" />` + (hasEn ? `\n      <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />` : '');
    s = s.replace('</urlset>', `  <url>\n    <loc>${jaUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n${alt}\n  </url>\n</urlset>`);
    pages++;
  }
}
fs.writeFileSync(f, s);
console.log(`sitemap: ${pages} páginas estáticas ja + ${added} rutas ja añadidas, ${linked} variantes con hreflang ja`);
