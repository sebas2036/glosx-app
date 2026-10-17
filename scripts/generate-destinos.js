#!/usr/bin/env node
/** Genera /destinos/<slug>/ y /destinos/<slug>/es/ desde scripts/destinos-data.js usando el CSS/nav de hallstatt como plantilla. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const DATA = require('./destinos-data.js');
const tpl = fs.readFileSync(path.join(ROOT, 'destinos/hallstatt/index.html'), 'utf8');
const css = tpl.match(/<style>[\s\S]*?<\/style>/)[0];
const nav = tpl.match(/<a href="\/" class="nav-logo[\s\S]*?<\/a>/)[0];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const PX = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const L = {
  en: { lang: 'en', code: 'EN', back: '← Discover', about: 'About', priv: 'Privacy', terms: 'Terms', note: 'Opens in a new tab — come back here anytime.', alt: (n) => `${n} by train` },
  es: { lang: 'es', code: 'ES', back: '← Descubre', about: 'Acerca de', priv: 'Privacidad', terms: 'Términos', note: 'Se abre en una pestaña nueva: vuelve aquí cuando quieras.', alt: (n) => `${n} en tren` }
};
function page(d, lg) {
  const t = d[lg], l = L[lg], base = `https://glosx.app/destinos/${d.slug}/`, url = lg === 'en' ? base : base + 'es/';
  const href = `https://voxa-production-dc15.up.railway.app/affiliate/europe-train?from=${d.from}&to=${d.to}`;
  const src = `dest_${d.slug}_${lg}`;
  const img = PX(d.photo, 1200);
  const lab = (r) => { const x = r.replace('stmoritz', 'st.moritz').split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' → ').replace('St.moritz', 'St. Moritz'); return lg === 'es' ? require('./localize-cities.js').localize(x, 'es') : x; };
  const rel = d.routes.map(r => `<li><a href="/rutas/${r}/${lg === 'es' ? 'es/' : ''}">${lab(r)}</a></li>`).join('');
  const dd = `<a class="lang-option${lg === 'en' ? ' active' : ''}" href="${base}">English</a><a class="lang-option${lg === 'es' ? ' active' : ''}" href="${base}es/">Español</a>`;
  const ld = (o) => `<script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n  </script>`;
  const org = { '@type': 'Organization', name: 'GLOSX', alternateName: 'WoW Train', '@id': 'https://glosx.app/#organization', url: 'https://glosx.app/' };
  return `<!DOCTYPE html>
<html lang="${lg}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.title}</title>
  <meta name="description" content="${esc(t.desc)}" />
  <meta name="keywords" content="${esc(t.keywords)}" />
  <link rel="canonical" href="${url}" />
  <link rel="alternate" hreflang="en" href="${base}" />
  <link rel="alternate" hreflang="es" href="${base}es/" />
  <link rel="alternate" hreflang="x-default" href="${base}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(t.h1)}" />
  <meta property="og:description" content="${esc(t.desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${img}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(t.h1)}" />
  <meta name="twitter:description" content="${esc(t.desc)}" />
  <meta name="twitter:image" content="${img}" />

  <link rel="icon" type="image/png" href="/logo.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XPTSM1EJQJ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    try {
      if (/^(localhost|127\\.0\\.0\\.1)$/.test(location.hostname)) gtag('set', 'traffic_type', 'internal');
    } catch (e) {}
    gtag('js', new Date());
    gtag('config', 'G-XPTSM1EJQJ');
    window.trackPartnerClick = function (src) {
      try {
        var dest = (window.event && window.event.currentTarget && window.event.currentTarget.href) || undefined;
        gtag('event', 'klook_click', { source: src || 'unknown', destination: dest });
      } catch (e) {}
    };
  </script>

  ${ld({ '@context': 'https://schema.org', '@type': 'Article', headline: t.h1, description: t.desc, image: img, inLanguage: lg, author: Object.assign({}, org, { name: 'WoW Train' }), publisher: org, datePublished: '2026-10-17', dateModified: '2026-10-17', mainEntityOfPage: url })}

  ${css}
  <link rel="stylesheet" href="/assets/css/omio-handoff.css?v=8">
</head>
<body>
  <nav>
    ${nav}
    <div class="nav-right">
      <div class="lang-wrapper"><button type="button" class="lang-btn" aria-label="Language" onclick="event.stopPropagation();this.nextElementSibling.classList.toggle('open');"><span>${l.code}</span><span style="font-size:10px;opacity:0.6">▾</span></button><div class="lang-dropdown">${dd}</div></div>
      <a href="/#discover" class="nav-back">${l.back}</a>
    </div>
  </nav>

  <main>
    <span class="badge">${t.badge}</span>
    <h1>${t.h1}</h1>
    <p class="meta">${t.meta}</p>

    <div class="hero">
      <div class="hero-media">
        <div class="video-wrap">
          <img src="${PX(d.photo, 700)}" alt="${esc(t.h1)}" style="display:block;width:100%;aspect-ratio:3/4;object-fit:cover" />
        </div>
        <a href="${href}" class="cta-btn-inline" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('${src}')">${t.cta}</a>
      </div>
      <div class="hero-text">
        <p class="lead">${t.lead}</p>
        <div class="secret">${t.secret}</div>
      </div>
    </div>

${t.sections.map(([h, b]) => `    <h2>${h}</h2>\n    ${b}`).join('\n\n')}

    <hr/>

    <p>${t.closing}</p>
    <p class="tl-secondary" style="text-align:center;margin:10px 0 8px;font-size:14px;color:#55565f;">
      ${t.ctaFoot.replace(/\s*&\s*|\s*&amp;\s*/g, ' &amp; ').replace(/^(.*?\?)\s*(.*?)(→?)$/, (m, a, b) => `${a} <a href="${href}" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('${src}')">${b.replace(/\s*→\s*$/, '').trim()} →</a>`)}
    </p>
    <p class="tl-note" style="text-align:center;margin:0 0 8px;font-size:12px;color:#55565f;">${l.note}</p>
    <h2>${t.related}</h2>
    <ul>${rel}</ul>
  </main>

  <footer>
    <p>© 2026 GLOSX — WoW Train</p>
    <p style="margin-top:8px;">
      <a href="/blog.html">Blog</a> ·
      <a href="/about.html">${l.about}</a> ·
      <a href="/privacy.html">${l.priv}</a> ·
      <a href="/terms.html">${l.terms}</a>
    </p>
  </footer>
<script>
(function(){
  document.addEventListener('click', function(){
    document.querySelectorAll('.lang-dropdown.open').forEach(function(d){ d.classList.remove('open'); });
  });
})();
</script>
  <script src="/assets/js/omio-bridge.js?v=9" defer></script>
  <script src="/assets/js/klook-bridge.js?v=1" defer></script>
</body>
</html>
`;
}
const entries = [];
for (const d of DATA) for (const lg of ['en', 'es']) {
  const dir = path.join(ROOT, 'destinos', d.slug, lg === 'es' ? 'es' : '');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(d, lg));
}
// sitemap
let sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
for (const d of DATA) {
  const b = `https://glosx.app/destinos/${d.slug}/`;
  if (sm.includes(`<loc>${b}</loc>`)) continue;
  const mk = (u) => `<url>\n    <loc>${u}</loc>\n    <lastmod>2026-10-17</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n    <xhtml:link xmlns:xhtml="http://www.w3.org/1999/xhtml" rel="alternate" hreflang="en" href="${b}" />\n    <xhtml:link xmlns:xhtml="http://www.w3.org/1999/xhtml" rel="alternate" hreflang="es" href="${b}es/" />\n  </url>\n`;
  sm = sm.replace('</urlset>', mk(b) + mk(b + 'es/') + '</urlset>');
}
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sm);
// voseo en destinos existentes
for (const f of ['hallstatt', 'lake-bled', 'colmar', 'lauterbrunnen']) {
  const p = path.join(ROOT, 'destinos', f, 'es/index.html');
  if (fs.existsSync(p)) { const s = fs.readFileSync(p, 'utf8'); const o = s.replace('← Descubrí', '← Descubre'); if (o !== s) fs.writeFileSync(p, o); }
}
console.log('destinos generados:', DATA.map(d => d.slug).join(', '));
