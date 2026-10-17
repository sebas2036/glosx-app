#!/usr/bin/env node
/**
 * Traduce los nombres de ciudad europeos (inglés -> es/fr/it) en las páginas de ruta, de modo que
 * "Tren Vienna a Prague" pase a "Tren Viena a Praga". Es idempotente: solo reemplaza la forma inglesa.
 *
 * Qué toca: texto visible, <title>, metas y JSON-LD. Qué NO toca: atributos (href, src, alt, data-*),
 * scripts ejecutables, y nombres oficiales de estación ("Barcelona Sants", "Milan Centrale",
 * "Gare de Lyon", "Salzburg Hbf"...), que se quedan tal cual.
 * Las rutas de Japón no se tocan (ya traen nombres propios); solo las rutas europeas de ROUTES.
 * Uso: node scripts/localize-cities.js        (también lo llama generate-routes.js al terminar)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const CITY_LOCAL = {
  es: {
    Basel: 'Basilea', Berlin: 'Berlín', Bern: 'Berna', Bruges: 'Brujas', Brussels: 'Bruselas', Cologne: 'Colonia',
    Copenhagen: 'Copenhague', Edinburgh: 'Edimburgo', Florence: 'Florencia', Geneva: 'Ginebra', Gothenburg: 'Gotemburgo',
    Hamburg: 'Hamburgo', Lisbon: 'Lisboa', Ljubljana: 'Liubliana', London: 'Londres', Lucerne: 'Lucerna', Malaga: 'Málaga',
    Marseille: 'Marsella', Milan: 'Milán', Monaco: 'Mónaco', Munich: 'Múnich', Naples: 'Nápoles', Nice: 'Niza',
    Paris: 'París', Porto: 'Oporto', Prague: 'Praga', Rome: 'Roma', Salzburg: 'Salzburgo', Seville: 'Sevilla',
    Stockholm: 'Estocolmo', Strasbourg: 'Estrasburgo', Turin: 'Turín', Venice: 'Venecia', Vienna: 'Viena',
    Zurich: 'Zúrich', Frankfurt: 'Fráncfort', Bordeaux: 'Burdeos'
  },
  fr: {
    Barcelona: 'Barcelone', Basel: 'Bâle', Bern: 'Berne', Brussels: 'Bruxelles', Copenhagen: 'Copenhague',
    Edinburgh: 'Édimbourg', Geneva: 'Genève', Gothenburg: 'Göteborg', Hamburg: 'Hambourg', Lisbon: 'Lisbonne',
    London: 'Londres', Milan: 'Milan', Naples: 'Naples', Prague: 'Prague', Rome: 'Rome', Salzburg: 'Salzbourg',
    Seville: 'Séville', Siena: 'Sienne', Valencia: 'Valence', Venice: 'Venise', Vienna: 'Vienne', Zaragoza: 'Saragosse',
    Girona: 'Gérone', Frankfurt: 'Francfort', Lyon: 'Lyon', Munich: 'Munich', Paris: 'Paris'
  },
  it: {
    Barcelona: 'Barcellona', Basel: 'Basilea', Berlin: 'Berlino', Bern: 'Berna', Stockholm: 'Stoccolma', Brussels: 'Bruxelles', Cologne: 'Colonia',
    Copenhagen: 'Copenaghen', Edinburgh: 'Edimburgo', Florence: 'Firenze', Geneva: 'Ginevra', Gothenburg: 'Göteborg',
    Hamburg: 'Amburgo', Lisbon: 'Lisbona', Ljubljana: 'Lubiana', London: 'Londra', Lucerne: 'Lucerna', Lyon: 'Lione',
    Marseille: 'Marsiglia', Milan: 'Milano', Munich: 'Monaco di Baviera', Naples: 'Napoli', Nice: 'Nizza', Paris: 'Parigi', Prague: 'Praga',
    Rome: 'Roma', Salzburg: 'Salisburgo', Seville: 'Siviglia', Strasbourg: 'Strasburgo', Turin: 'Torino', Venice: 'Venezia',
    Zurich: 'Zurigo', Zaragoza: 'Saragozza', Frankfurt: 'Francoforte', Bergen: 'Bergen'
  }
};
// no traducir cuando el nombre forma parte de un nombre oficial de estación o similar
const AFTER = '(?!\\s+(?:Sants|Hbf|HB|SBB|Centrale|Central|Termini|Santa|Atocha|Chamartín|Midi|Cornavin|Gare|Nord|Est|Stazione|Station|Hauptbahnhof|Flughafen|Airport|Porta|Principe|Garibaldi|Lingotto|Bercy|Montparnasse|Austerlitz|Saint|St\\.?)\\b)(?!-(?:Midi|Central|Nord|Zuid|Sud|Ville))';
const BEFORE = '(?<!Gare de )(?<!Gare du )(?<!Gare d\')(?<!Stazione di )(?<!Estación de )(?<!Estación )';

function europeSlugs() {
  const src = fs.readFileSync(path.join(__dirname, 'generate-routes.js'), 'utf8');
  const out = new Set();
  const re = /slug: '([a-z-]+)', from: '/g; let m;
  while ((m = re.exec(src))) out.add(m[1]);
  return out;
}

// nombres propios de hotel ("Hotel Paris Prague", "Hôtel de Paris Monte-Carlo"): se protegen enteros
const HOTEL = /(?:Grand )?H[oô]tel(?: de)?(?: [A-ZÀ-Ý][A-Za-zÀ-ÿ'’.-]*){1,5}/g;

function localize(html, lang) {
  const map = CITY_LOCAL[lang];
  const names = Object.keys(map).filter(k => map[k] !== k).sort((a, b) => b.length - a.length);
  if (!names.length) return html;
  const reStation = new RegExp('\\b(' + names.join('|') + ')\\s+Station\\b', 'g');
  const re = new RegExp(BEFORE + '\\b(' + names.join('|') + ')\\b' + AFTER, 'g');
  // se parte el documento en: scripts (se saltan salvo JSON-LD), etiquetas (se saltan) y texto
  const tokens = html.split(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<[^>]+>)/g);
  const tr = (txt) => {
    const kept = [];
    const masked = txt.replace(HOTEL, (h) => { kept.push(h); return '\u0001' + (kept.length - 1) + '\u0001'; });
    return masked.replace(reStation, (_, n) => map[n]).replace(re, (_, n) => map[n]).replace(/\u0001(\d+)\u0001/g, (_, i) => kept[Number(i)]);
  };
  return tokens.map(tok => {
    if (tok.startsWith('<script')) {
      return /application\/ld\+json/.test(tok.slice(0, 120)) ? tr(tok) : tok;
    }
    if (tok.startsWith('<style')) return tok;
    if (tok.startsWith('<')) {
      // dentro de etiquetas solo se traducen content="..." de metas (descripciones y títulos sociales)
      if (/^<meta\b/.test(tok)) return tok.replace(/(content=")([^"]*)(")/, (m0, a, v, c) => a + tr(v) + c);
      return tok;
    }
    return tr(tok);
  }).join('');
}

function run() {
  const slugs = europeSlugs();
  let changed = 0;
  for (const slug of slugs) {
    for (const lang of ['es', 'fr', 'it']) {
      const f = path.join(ROOT, 'rutas', slug, lang, 'index.html');
      if (!fs.existsSync(f)) continue;
      const src = fs.readFileSync(f, 'utf8');
      const out = localize(src, lang);
      if (out !== src) { fs.writeFileSync(f, out); changed++; }
    }
  }
  return changed;
}

module.exports = { run, localize, CITY_LOCAL };
if (require.main === module) console.log('Páginas con nombres traducidos:', run());

// Etiquetas de enlace "Ciudad → Ciudad" de portadas y /explore/ (solo el texto del enlace; los
// atributos y los parámetros del planificador siguen en inglés porque así los reconoce el motor).
function runListings() {
  let changed = 0;
  for (const lang of ['es', 'fr', 'it']) {
    for (const rel of [`${lang}/index.html`, `${lang}/explore/index.html`]) {
      const f = path.join(ROOT, rel);
      if (!fs.existsSync(f)) continue;
      const src = fs.readFileSync(f, 'utf8');
      const out = src.replace(/(>)([^<>]*?(?:→|&rarr;)[^<>]*?)(<\/a>)/g, (m, a, txt, c) => a + localize(txt, lang) + c);
      if (out !== src) { fs.writeFileSync(f, out); changed++; }
    }
  }
  return changed;
}
module.exports.runListings = runListings;
if (require.main === module) console.log('Listados con etiquetas traducidas:', runListings());
