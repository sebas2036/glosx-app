#!/usr/bin/env node
/**
 * Genera /hoy/ y /es|fr|it/hoy/ a partir del planner de index.html
 * y las claves hoy_* de TRANSLATIONS. No toca el <title> de la home.
 *
 * Uso: node scripts/generate-hoy.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const MAIN_JS = fs.readFileSync(path.join(ROOT, 'assets/js/main.js'), 'utf8');

function extractTranslations(src) {
  const startIdx = src.indexOf('const TRANSLATIONS = {');
  const braceStart = src.indexOf('{', startIdx);
  let depth = 0, i = braceStart;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) break; }
  }
  return eval('(' + src.slice(braceStart, i + 1) + ')');
}
const TRANSLATIONS = extractTranslations(MAIN_JS);

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function translateHtml(html, lang) {
  const dict = TRANSLATIONS[lang] || {};
  return html.replace(
    /(<([a-zA-Z0-9]+)([^>]*)\bdata-i18n="([a-zA-Z0-9_]+)"([^>]*)>)([^<]*)(<\/\2>)/g,
    (full, openTag, tagName, pre, key, post, _old, closeTag) => {
      const val = dict[key];
      if (val === undefined) return full;
      return openTag + esc(val).replace(/&quot;/g, '"') + closeTag;
    }
  );
}

const plannerMatch = INDEX.match(/<section class="ai-planner"[\s\S]*?<\/section>/);
if (!plannerMatch) throw new Error('No se encontró .ai-planner en index.html');
const planner = plannerMatch[0]
  .replace(/<p class="hoy-seo-link">[\s\S]*?<\/p>/, '')
  .replace('<div class="discover-cta">', '<div class="discover-cta" id="hoy">');

const META = {
  en: {
    title: 'Today we\'re going to… — European train destination roulette | WoW Train',
    description: 'Spin a real European city pair. WoW Train builds the rail itinerary and sends you to Klook for times and tickets. Free, no account.',
    path: '/hoy/',
    home: '/',
    ogLocale: 'en_US',
  },
  es: {
    title: 'Hoy nos vamos a… — ruleta de destinos en tren por Europa | WoW Train',
    description: 'Gira un par real de ciudades europeas. WoW Train arma el itinerario de tren y te lleva a Klook para horarios y billetes. Gratis, sin cuenta.',
    path: '/es/hoy/',
    home: '/es/',
    ogLocale: 'es_ES',
  },
  fr: {
    title: 'Aujourd\'hui on part à… — roulette de destinations en train | WoW Train',
    description: 'Lancez un vrai trajet entre deux villes d\'Europe. WoW Train construit l\'itinéraire et vous envoie sur Klook pour horaires et billets. Gratuit, sans compte.',
    path: '/fr/hoy/',
    home: '/fr/',
    ogLocale: 'fr_FR',
  },
  it: {
    title: 'Oggi partiamo per… — ruota delle destinazioni in treno | WoW Train',
    description: 'Gira una coppia vera di città europee. WoW Train monta l\'itinerario e ti porta su Klook per orari e biglietti. Gratis, senza account.',
    path: '/it/hoy/',
    home: '/it/',
    ogLocale: 'it_IT',
  },
};

function page(lang) {
  const meta = META[lang];
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const faqJson = [1, 2, 3].map((n) => ({
    '@type': 'Question',
    name: t['hoy_faq' + n + '_q'],
    acceptedAnswer: { '@type': 'Answer', text: t['hoy_faq' + n + '_a'] },
  }));
  const jsV = (INDEX.match(/main\.min\.js\?v=(\d+)/) || [])[1] || '26';
  let html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/assets/css/main.min.css" />
  <title>${esc(meta.title)}</title>
  <meta name="description" content="${esc(meta.description)}" />
  <link rel="canonical" href="https://glosx.app${meta.path}" />
  <link rel="alternate" hreflang="en" href="https://glosx.app/hoy/" />
  <link rel="alternate" hreflang="es" href="https://glosx.app/es/hoy/" />
  <link rel="alternate" hreflang="fr" href="https://glosx.app/fr/hoy/" />
  <link rel="alternate" hreflang="it" href="https://glosx.app/it/hoy/" />
  <link rel="alternate" hreflang="x-default" href="https://glosx.app/hoy/" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="${meta.ogLocale}" />
  <meta property="og:title" content="${esc(meta.title)}" />
  <meta property="og:description" content="${esc(meta.description)}" />
  <meta property="og:url" content="https://glosx.app${meta.path}" />
  <meta property="og:image" content="https://glosx.app/og-image.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(meta.title)}" />
  <meta name="twitter:description" content="${esc(meta.description)}" />
  <meta name="twitter:image" content="https://glosx.app/og-image.jpg" />
  <link rel="icon" type="image/png" href="/logo.png" />
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"WebPage","name":${JSON.stringify(t.hoy_h1)},"description":${JSON.stringify(meta.description)},"url":"https://glosx.app${meta.path}","isPartOf":{"@type":"WebSite","name":"WoW Train","url":"https://glosx.app/"}}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":${JSON.stringify(faqJson)}}
  </script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XPTSM1EJQJ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    try { if (/^(localhost|127\\.0\\.0\\.1)$/.test(location.hostname)) gtag('set', 'traffic_type', 'internal'); } catch (e) {}
    gtag('js', new Date());
    gtag('config', 'G-XPTSM1EJQJ');
  </script>
  <script>try{localStorage.setItem('glosx_lang','${lang === 'en' ? 'en' : lang}');localStorage.setItem('glosx_lang_manual','1');}catch(e){}</script>
</head>
<body>
  <nav>
    <a href="${meta.home}" class="nav-logo" style="font-size:24px;display:inline-flex;align-items:baseline;gap:0;font-weight:800;letter-spacing:-0.3px;"><span style="color:#14151a;">Wo</span><span style="color:#C10016;font-style:italic;font-weight:900;margin:0 -0.04em;">W</span><span style="color:#14151a;margin-left:0.28em;">Train</span></a>
    <div class="nav-links" id="navLinks" style="display:flex;gap:18px;align-items:center;">
      <a href="${meta.home}" data-i18n="hoy_home">${esc(t.hoy_home)}</a>
      <a href="/rutas/" data-i18n="hoy_more">${esc(t.hoy_more)}</a>
      <div class="lang-wrapper">
        <button class="lang-btn" id="langBtn" onclick="toggleLang(event)" aria-label="Language"><span id="langCode">${lang.toUpperCase()}</span></button>
        <div class="lang-dropdown" id="langDropdown">
          <div class="lang-option" data-lang="en" onclick="setLang('en')"><span>English</span></div>
          <div class="lang-option" data-lang="es" onclick="setLang('es')"><span>Español</span></div>
          <div class="lang-option" data-lang="fr" onclick="setLang('fr')"><span>Français</span></div>
          <div class="lang-option" data-lang="it" onclick="setLang('it')"><span>Italiano</span></div>
        </div>
      </div>
    </div>
  </nav>
  <main class="section" style="padding:100px 24px 40px;max-width:820px;margin:0 auto;">
    <h1 data-i18n="hoy_h1">${esc(t.hoy_h1)}</h1>
    <p data-i18n="hoy_lead" style="font-size:18px;line-height:1.5;margin:12px 0 16px;">${esc(t.hoy_lead)}</p>
    <p data-i18n="hoy_body" style="color:#55565f;line-height:1.6;margin-bottom:28px;">${esc(t.hoy_body)}</p>
  </main>
  ${planner}
  <section class="section" style="max-width:820px;margin:0 auto;padding:24px 24px 64px;">
    <h2 data-i18n="hoy_more">${esc(t.hoy_more)}</h2>
    <p style="margin:12px 0 20px;"><a href="/rutas/madrid-barcelona/">Madrid → Barcelona</a> · <a href="/rutas/paris-london/">Paris → London</a> · <a href="/rutas/paris-barcelona/">Paris → Barcelona</a> · <a href="/rutas/munich-venice/">Munich → Venice</a> · <a href="/rutas/rome-venice/">Rome → Venice</a></p>
    <details style="margin:10px 0;"><summary data-i18n="hoy_faq1_q">${esc(t.hoy_faq1_q)}</summary><p data-i18n="hoy_faq1_a" style="margin-top:8px;color:#55565f;">${esc(t.hoy_faq1_a)}</p></details>
    <details style="margin:10px 0;"><summary data-i18n="hoy_faq2_q">${esc(t.hoy_faq2_q)}</summary><p data-i18n="hoy_faq2_a" style="margin-top:8px;color:#55565f;">${esc(t.hoy_faq2_a)}</p></details>
    <details style="margin:10px 0;"><summary data-i18n="hoy_faq3_q">${esc(t.hoy_faq3_q)}</summary><p data-i18n="hoy_faq3_a" style="margin-top:8px;color:#55565f;">${esc(t.hoy_faq3_a)}</p></details>
    <p style="margin-top:28px;"><a href="${meta.home}" data-i18n="hoy_home">${esc(t.hoy_home)}</a></p>
  </section>
  <script src="/assets/js/main.min.js?v=${jsV}" defer></script>
</body>
</html>
`;
  if (lang !== 'en') html = translateHtml(html, lang);
  return html;
}

for (const lang of Object.keys(META)) {
  const dir = lang === 'en' ? path.join(ROOT, 'hoy') : path.join(ROOT, lang, 'hoy');
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, 'index.html');
  fs.writeFileSync(out, page(lang));
  console.log('OK ', path.relative(ROOT, out), fs.statSync(out).size, 'bytes');
}
