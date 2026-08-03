#!/usr/bin/env node
/**
 * Genera versiones server-rendered de la home (/es/, /fr/, /it/) a partir de
 * index.html, usando las traducciones reales que ya existen en
 * assets/js/main.js (objeto TRANSLATIONS) — no se inventa texto nuevo.
 *
 * Por que hace falta: index.html solo declara <html lang="en"> y no tiene
 * hreflang alternates reales. El cambio de idioma en pantalla es 100%
 * client-side (JS reescribe el texto via data-i18n despues de cargar), asi
 * que Google solo puede indexar la version en ingles de la home, aunque el
 * 74% del trafico del sitio pase por esta pagina. Este script arma copias
 * HTML donde el texto YA esta en el idioma correcto en el marcado que recibe
 * el crawler, sin depender de JS.
 *
 * Uso: node scripts/generate-home-i18n.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC_HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const MAIN_JS = fs.readFileSync(path.join(ROOT, 'assets/js/main.js'), 'utf8');

// --- extraer el objeto TRANSLATIONS de main.js sin ejecutar el resto del archivo ---
function extractTranslations(src) {
  const startIdx = src.indexOf('const TRANSLATIONS = {');
  const braceStart = src.indexOf('{', startIdx);
  let depth = 0, i = braceStart;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) break; }
  }
  const objText = src.slice(braceStart, i + 1);
  // eslint-disable-next-line no-eval
  return eval('(' + objText + ')');
}
const TRANSLATIONS = extractTranslations(MAIN_JS);

const LANGS = {
  es: {
    title: "WoW Train — Planificador de trenes por Europa con IA gratis | glosx.app",
    description: "Planificador de trenes con IA gratis para Europa. Describe tu viaje y obtene un itinerario completo con conexiones, hoteles y billetes — España, Francia, Italia y más.",
    keywords: "planificador de trenes europa, viajar en tren por europa, itinerario tren ia, comprar billetes de tren europa",
    ogTitle: "WoW Train — Planificador de trenes por Europa con IA",
    ogDesc: "Describe tu viaje y obtene un itinerario ferroviario completo por Europa en segundos — conexiones, hoteles y billetes.",
  },
  fr: {
    title: "WoW Train — Planificateur de trajets en train en Europe par IA gratuit | glosx.app",
    description: "Planificateur de trajets en train gratuit basé sur l'IA pour l'Europe. Décrivez votre voyage et obtenez un itinéraire complet avec correspondances, hôtels et billets — Espagne, France, Italie et plus.",
    keywords: "planificateur train europe, voyager en train en europe, itineraire train ia, billets de train europe",
    ogTitle: "WoW Train — Planificateur de trajets en train en Europe par IA",
    ogDesc: "Décrivez votre voyage et obtenez un itinéraire ferroviaire complet en Europe en quelques secondes — correspondances, hôtels et billets.",
  },
  it: {
    title: "WoW Train — Pianificatore di viaggi in treno in Europa con IA gratis | glosx.app",
    description: "Pianificatore di viaggi in treno gratuito con IA per l'Europa. Descrivi il tuo viaggio e ottieni un itinerario completo con coincidenze, hotel e biglietti — Spagna, Francia, Italia e altro.",
    keywords: "pianificatore treni europa, viaggiare in treno in europa, itinerario treno ia, biglietti treno europa",
    ogTitle: "WoW Train — Pianificatore di viaggi in treno in Europa con IA",
    ogDesc: "Descrivi il tuo viaggio e ottieni un itinerario ferroviario completo in Europa in pochi secondi — coincidenze, hotel e biglietti.",
  },
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function translateHtml(html, lang) {
  const dict = TRANSLATIONS[lang] || {};
  let out = html;

  // 1) data-i18n en elementos SIN markup anidado: <tag ... data-i18n="key" ...>texto</tag>
  out = out.replace(
    /(<([a-zA-Z0-9]+)([^>]*)\bdata-i18n="([a-zA-Z0-9_]+)"([^>]*)>)([^<]*)(<\/\2>)/g,
    (full, openTag, tagName, pre, key, post, _oldText, closeTag) => {
      const val = dict[key];
      if (val === undefined) return full;
      return openTag + esc(val) + closeTag;
    }
  );

  // 2) casos especiales con markup anidado dentro del texto (link o span extra):
  //    se reemplaza solo el texto inicial, se conserva el tag anidado tal cual.
  const nestedCases = {
    cookie_text: /(data-i18n="cookie_text">)([^<]*)/,
    nav_essentials: /(data-i18n="nav_essentials">)([^<]*)/,
  };
  for (const [key, re] of Object.entries(nestedCases)) {
    const val = dict[key];
    if (val !== undefined) out = out.replace(re, (full, p1) => p1 + esc(val));
  }

  // 3) data-i18n-placeholder="key" -> placeholder="valor"
  out = out.replace(
    /(<[a-zA-Z0-9]+[^>]*\bdata-i18n-placeholder="([a-zA-Z0-9_]+)"[^>]*\bplaceholder=")[^"]*(")/g,
    (full, pre, key, post) => {
      const val = dict[key];
      return val === undefined ? full : pre + esc(val) + post;
    }
  );

  // 4) data-i18n-aria-label="key" -> aria-label="valor"
  out = out.replace(
    /(<[a-zA-Z0-9]+[^>]*\bdata-i18n-aria-label="([a-zA-Z0-9_]+)"[^>]*\baria-label=")[^"]*(")/g,
    (full, pre, key, post) => {
      const val = dict[key];
      return val === undefined ? full : pre + esc(val) + post;
    }
  );

  return out;
}

function buildPage(lang) {
  let html = translateHtml(SRC_HTML, lang);
  const meta = LANGS[lang];

  // <html lang="...">
  html = html.replace(/<html lang="en">/, `<html lang="${lang}">`);

  // Title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);

  // Meta description
  html = html.replace(
    /(<meta name="description" content=")[^"]*(")/,
    `$1${esc(meta.description)}$2`
  );

  // Meta keywords (si existe)
  html = html.replace(
    /(<meta name="keywords" content=")[^"]*(")/,
    `$1${esc(meta.keywords)}$2`
  );

  // og:title / og:description
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(meta.ogTitle)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(meta.ogDesc)}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(meta.ogTitle)}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(meta.ogDesc)}$2`);

  // og:url / twitter:image url references a canonical — dejamos como esta salvo url explicita
  html = html.replace(/(<meta property="og:url" content=")https:\/\/glosx\.app\/(")/, `$1https://glosx.app/${lang}/$2`);

  // Canonical -> apunta a esta version
  html = html.replace(
    /<link rel="canonical" href="https:\/\/glosx\.app\/" id="canonicalLink" \/>/,
    `<link rel="canonical" href="https://glosx.app/${lang}/" id="canonicalLink" />`
  );

  // hreflang: reemplazar el bloque existente (solo x-default) por el set completo
  const hreflangBlock = [
    `<link rel="alternate" hreflang="en" href="https://glosx.app/" />`,
    `<link rel="alternate" hreflang="es" href="https://glosx.app/es/" />`,
    `<link rel="alternate" hreflang="fr" href="https://glosx.app/fr/" />`,
    `<link rel="alternate" hreflang="it" href="https://glosx.app/it/" />`,
    `<link rel="alternate" hreflang="x-default" href="https://glosx.app/" />`,
  ].join('\n  ');
  html = html.replace(
    /<link rel="alternate" hreflang="x-default" href="https:\/\/glosx\.app\/" \/>/,
    hreflangBlock
  );

  // Bloquear el auto-switch de idioma por JS: esta URL ya decidio el idioma.
  // Se inyecta justo antes de </head> para que corra antes que main.min.js.
  const lockScript = `<script>try{localStorage.setItem('glosx_lang','${lang}');localStorage.setItem('glosx_lang_manual','1');}catch(e){}</script>\n</head>`;
  html = html.replace('</head>', lockScript);

  return html;
}

for (const lang of Object.keys(LANGS)) {
  const dir = path.join(ROOT, lang);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(dir, 'index.html');
  fs.writeFileSync(outPath, buildPage(lang));
  console.log(`OK  ${lang}/index.html generado (${fs.statSync(outPath).size} bytes)`);
}

// También agregar hreflang completo a la home en inglés (hoy solo tiene x-default)
let en = SRC_HTML;
const hreflangBlockEn = [
  `<link rel="alternate" hreflang="en" href="https://glosx.app/" />`,
  `<link rel="alternate" hreflang="es" href="https://glosx.app/es/" />`,
  `<link rel="alternate" hreflang="fr" href="https://glosx.app/fr/" />`,
  `<link rel="alternate" hreflang="it" href="https://glosx.app/it/" />`,
  `<link rel="alternate" hreflang="x-default" href="https://glosx.app/" />`,
].join('\n  ');
en = en.replace(
  /<link rel="alternate" hreflang="x-default" href="https:\/\/glosx\.app\/" \/>/,
  hreflangBlockEn
);
fs.writeFileSync(path.join(ROOT, 'index.html'), en);
console.log('OK  index.html actualizado con hreflang completo');
