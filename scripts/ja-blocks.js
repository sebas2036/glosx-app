#!/usr/bin/env node
/**
 * Traducción por bloques para blog y guías: extrae los bloques de texto visibles (entre </nav> y <footer>) de la
 * página en inglés y reconstruye /ja/<archivo> sustituyéndolos por orden con los de un spec JSON en japonés
 * (scripts/ja-pages/blog/<archivo>.json: { title, description, keywords?, h1, faq?, blocks:[...] }).
 * Las etiquetas "Ciudad → Ciudad" de enlaces a rutas se convierten solas y no cuentan como bloques.
 * Uso:
 *   node scripts/ja-blocks.js dump <archivo.html>     numera los bloques a traducir
 *   node scripts/ja-blocks.js build [archivo.html]    genera las páginas ja de los specs que existan
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SPECS = path.join(__dirname, 'ja-pages', 'blog');
const { JA_CITY } = require('./localize-ja.js');

const TAGS = 'p|li|h[1-6]|td|th|blockquote|figcaption|dt|dd|summary|span|div|a|strong|button|label';
const BLOCKISH = /<(p|li|h[1-6]|td|th|blockquote|div|ul|ol|table|section|article|figure|tr|summary|dt|dd)\b/i;
const NAMES = Object.assign({}, JA_CITY, { Malaga: 'マラガ', 'Paris night train': 'パリ行き夜行列車' });

// textos que se repiten en todo el blog: se traducen solos
const COMMON = {
  'Book Ticket &#8599;': '予約する &#8599;', 'Your train. Your world.': 'あなたの列車で、あなたの世界へ。',
  'Plan with AI →': 'AIで旅程を作る →', 'Related route guides': '関連するルートガイド',
  'More European train routes →': 'ヨーロッパのほかの鉄道ルートを見る →', 'Route guide': 'ルートガイド', 'Travel guide': '旅行ガイド',
  'Search trains →': '列車を検索する →', 'Check schedules →': '時刻を確認する →', 'Book now →': '今すぐ予約する →',
  'Related articles': '関連記事', 'Compare times &amp; prices': '時刻と料金を比較する', 'Read more →': '続きを読む →', 'Frequently asked questions': 'よくある質問', 'FAQ': 'よくある質問'
};
const cityJa = (n) => NAMES[n.trim()] || n.trim();
function autoBlock(inner) {
  const t = inner.replace(/\s+/g, ' ').trim();
  if (COMMON[t]) return COMMON[t];
  let m = t.match(/^Book <span class="klook-cta-city">([^<]+)<\/span> (?:→|&rarr;) <span class="klook-cta-city">([^<]+)<\/span> on Omio$/);
  if (m) return `<span class="klook-cta-city">${cityJa(m[1])}</span> → <span class="klook-cta-city">${cityJa(m[2])}</span> をOmioで予約`;
  m = t.match(/^Return: ([^→<]+?) (?:→|&rarr;) ([^<]+?) on Omio$/);
  if (m) return `帰りの便：${cityJa(m[1])} → ${cityJa(m[2])}（Omioで予約）`;
  m = t.match(/^Book ([^→<]+?) (?:→|&rarr;) ([^<]+?) on Omio$/);
  if (m) return `${cityJa(m[1])} → ${cityJa(m[2])} をOmioで予約`;
  m = t.match(/^All operators · advance fares from €(\d+)$/);
  if (m) return `全運行会社を比較 · 早割運賃は€${m[1]}から`;
  m = t.match(/^By WoW Train · Updated ([A-Za-z]+) (\d{4}) · (\d+) min read$/);
  if (m) { const mo = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 }[m[1]]; if (mo) return `WoW Train · ${m[2]}年${mo}月更新 · 読了目安${m[3]}分`; }
  return null;
}

function region(html) {
  const a = html.indexOf('</nav>') + 6;
  let b = html.indexOf('<footer>');
  if (a < 6 || b < 0) throw new Error('estructura inesperada (sin </nav> o <footer>)');
  return { a, b, text: html.slice(a, b) };
}
const routeLabel = (inner) => {
  const m = inner.match(/^\s*<a href="\/rutas\/([a-z0-9-]+)\/">([^<]+?) (?:→|&rarr;) ([^<]+?)<\/a>\s*$/);
  return m && NAMES[m[2]] && NAMES[m[3]] ? { slug: m[1], a: NAMES[m[2]], b: NAMES[m[3]] } : null;
};
function findClose(text, from, tag) {
  const re = new RegExp('<(/?)' + tag + '\\b[^>]*>', 'gi'); re.lastIndex = from;
  let depth = 1, m;
  while ((m = re.exec(text))) {
    if (m[1]) { depth--; if (!depth) return m.index; } else if (!/\/>$/.test(m[0])) depth++;
  }
  return -1;
}
const CONTAINER = /<(p|li|h[1-6]|td|th|blockquote|div|ul|ol|table|section|article|figure|tr|summary|dt|dd|img|button|span|a)\b[^>]*>/gi;
function isLeaf(inner) {
  // hoja: sin bloques, sin <img>/<button>, y solo con <span class="klook-cta-city"> o <a>/<span> en línea sin clase
  let m; CONTAINER.lastIndex = 0;
  while ((m = CONTAINER.exec(inner))) {
    const t = m[1].toLowerCase(), tag = m[0];
    if (t === 'a' && !/class=/.test(tag)) continue;
    if (t === 'span' && (/klook-cta-city/.test(tag) || !/class=/.test(tag))) continue;
    return false;
  }
  return true;
}
function blocks(text) {
  const out = [];
  const open = new RegExp('<(' + TAGS + ')\\b([^>]*)>', 'gi');
  let m, lastEnd = -1;
  while ((m = open.exec(text))) {
    const tag = m[1].toLowerCase(), attrs = m[2];
    if (/\/$/.test(attrs.trim())) continue;
    const start = m.index + m[0].length;
    if (start < lastEnd) continue;                                  // dentro de un bloque ya tomado
    const endIdx = findClose(text, start, tag);
    if (endIdx < 0) continue;
    const inner = text.slice(start, endIdx);
    if (!isLeaf(inner)) continue;                                   // contenedor: se visitan sus hijos
    const plain = inner.replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').trim();
    if (!/[A-Za-z]{2,}/.test(plain)) continue;
    if (['span', 'div', 'strong', 'button', 'label'].includes(tag) && !/class=|style=/.test(attrs)) continue;
    if (tag === 'a' && !/class=|href=/.test(attrs)) continue;
    out.push({ start, end: endIdx, inner, auto: null, tag });
    lastEnd = endIdx;
  }
  return out;
}
// bloques manuales = los que no son etiquetas de ruta
const isAuto = (b) => (b.tag === 'li' && routeLabel(b.inner)) || autoBlock(b.inner) !== null;
function manual(text) {
  return blocks(text).filter(b => !isAuto(b));
}
function dump(file) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const r = region(html);
  manual(r.text).forEach((b, i) => console.log('[' + i + '] ' + b.inner.replace(/\s+/g, ' ').trim()));
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let o; try { o = JSON.parse(m[1]); } catch (e) { continue; }
    (Array.isArray(o) ? o : [o]).forEach(x => { if (x['@type'] === 'FAQPage') console.log('--- FAQ JSON-LD (' + x.mainEntity.length + ' preguntas; usa los mismos textos en "faq") ---'); });
  }
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function jaUrlOf(file) { return 'https://glosx.app/ja/' + file; }

function build(file) {
  const specPath = path.join(SPECS, file.replace('.html', '.json'));
  if (!fs.existsSync(specPath)) return false;
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const r = region(src);
  const bl = blocks(r.text), man = bl.filter(b => !isAuto(b));
  if (man.length !== spec.blocks.length) throw new Error(`${file}: ${man.length} bloques en inglés, ${spec.blocks.length} traducidos`);
  const plainOf = (x) => String(x).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  if (spec.faqBlocks) spec.faq = spec.faqBlocks.map(([q, a]) => [plainOf(spec.blocks[q]), plainOf(spec.blocks[a])]);
  let k = 0, out = '', pos = 0;
  for (const b of bl) {
    out += r.text.slice(pos, b.start);
    if (b.tag === 'li' && routeLabel(b.inner)) {
      const rl = routeLabel(b.inner);
      out += `<a href="/rutas/${rl.slug}/ja/">${rl.a} → ${rl.b}</a>`;
    } else if (autoBlock(b.inner) !== null) out += autoBlock(b.inner);
    else out += spec.blocks[k++];
    pos = b.end;
  }
  out += r.text.slice(pos);
  let h = src.slice(0, r.a) + out + src.slice(r.b);
  // enlaces a guías de ruta en japonés
  h = h.replace(/href="\/rutas\/([a-z0-9-]+)\/"/g, (m, slug) => fs.existsSync(path.join(ROOT, 'rutas', slug, 'ja', 'index.html')) ? `href="/rutas/${slug}/ja/"` : m);
  // cabecera
  h = h.replace('<html lang="en">', '<html lang="ja">');
  h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(spec.title)}</title>`);
  const setMeta = (re, v) => { h = h.replace(re, (m, a, b) => a + esc(v) + b); };
  setMeta(/(<meta name="description" content=")[^"]*(")/, spec.description);
  if (spec.keywords) setMeta(/(<meta name="keywords" content=")[^"]*(")/, spec.keywords);
  setMeta(/(<meta property="og:title" content=")[^"]*(")/, spec.ogTitle || spec.title);
  setMeta(/(<meta property="og:description" content=")[^"]*(")/, spec.description);
  setMeta(/(<meta name="twitter:title" content=")[^"]*(")/, spec.ogTitle || spec.title);
  setMeta(/(<meta name="twitter:description" content=")[^"]*(")/, spec.description);
  const url = jaUrlOf(file);
  h = h.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  h = h.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  // hreflang: se conservan los existentes y se suma ja
  const have = [...src.matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)" \/>/g)].map(m => [m[1], m[2]]);
  const map = new Map(have); map.set('ja', url); if (!map.has('en')) map.set('en', 'https://glosx.app/' + file);
  const order = [...map.keys()].filter(x => x !== 'x-default').concat(map.has('x-default') ? ['x-default'] : []);
  h = h.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>/g, '');
  h = h.replace(/(<link rel="canonical" href="[^"]*" \/>)/, `$1\n` + order.map(l => `  <link rel="alternate" hreflang="${l}" href="${map.get(l)}" />`).join('\n'));
  // nav: selector de idioma con ja activo y enlace al blog en japonés
  h = h.replace(/<span>EN<\/span>/, '<span>JA</span>');
  const rel = file;
  const opts = [['en', 'English', '/' + rel], ['es', 'Español', '/es/' + rel], ['fr', 'Français', '/fr/' + rel], ['it', 'Italiano', '/it/' + rel], ['ja', '日本語', '/ja/' + rel]]
    .filter(([l]) => l === 'ja' || l === 'en' || fs.existsSync(path.join(ROOT, l, file)))
    .map(([l, n, href]) => `<a class="lang-option${l === 'ja' ? ' active' : ''}" href="${href}">${n}</a>`).join('');
  h = h.replace(/<div class="lang-dropdown">[\s\S]*?<\/div><\/div>/, `<div class="lang-dropdown">${opts}</div></div>`);
  h = h.replace(/(<a href=")\/blog\.html(" class="nav-back">)[^<]*(<\/a>)/, `$1/ja/blog.html$2← 記事一覧$3`);
  h = h.replace(/(<nav>\s*<a href=")\/(" class="nav-logo)/, '$1/ja/$2');
  h = h.replace(/<a href="\/" class="nav-back">← Back home<\/a>/, '<a href="/ja/" class="nav-back">← ホームへ戻る</a>');
  // pie
  h = h.replace(/<footer>[\s\S]*?<\/footer>/, `<footer>\n  <p><a href="/ja/">WoW Train</a> · <a href="/ja/blog.html">ブログ</a> · <a href="/ja/explore/">ルート一覧</a> · <a href="/ja/about.html">このサイトについて</a></p>\n  <p style="margin-top:10px;">© 2026 GLOSX. All rights reserved.</p>\n</footer>`);
  // datos estructurados
  h = h.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (m, body) => {
    let j; try { j = JSON.parse(body); } catch (e) { return m; }
    const fix = (o) => {
      if (o['@type'] === 'BreadcrumbList') {
        o.itemListElement.forEach((it, i) => {
          if (i === 0) { it.name = 'ホーム'; it.item = 'https://glosx.app/ja/'; }
          else if (i === 1) { it.name = 'ブログ'; it.item = 'https://glosx.app/ja/blog.html'; }
          else { it.name = spec.h1 || spec.title; it.item = url; }
        });
      } else if (o['@type'] === 'Article' || o['@type'] === 'BlogPosting') {
        o.headline = spec.h1 || spec.title; o.description = spec.description; o.mainEntityOfPage = url; o.inLanguage = 'ja';
      } else if (o['@type'] === 'FAQPage' && spec.faq) {
        o.mainEntity = spec.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }));
      }
      return o;
    };
    j = Array.isArray(j) ? j.map(fix) : (j['@graph'] ? Object.assign(j, { '@graph': j['@graph'].map(fix) }) : fix(j));
    return '<script type="application/ld+json">\n' + JSON.stringify(j) + '\n</script>';
  });
  fs.mkdirSync(path.join(ROOT, 'ja'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'ja', file), h);
  // hreflang ja en las demás versiones
  for (const l of ['', 'es', 'fr', 'it']) {
    const p = path.join(ROOT, l, file);
    if (!fs.existsSync(p)) continue;
    let x = fs.readFileSync(p, 'utf8');
    if (x.includes('hreflang="ja"')) continue;
    if (/hreflang="x-default"/.test(x)) x = x.replace(/(\s*)<link rel="alternate" hreflang="x-default"/, `$1<link rel="alternate" hreflang="ja" href="${url}" />$1<link rel="alternate" hreflang="x-default"`);
    else x = x.replace(/(<link rel="canonical" href="[^"]*" \/>)/, `$1\n  <link rel="alternate" hreflang="ja" href="${url}" />`);
    fs.writeFileSync(p, x);
  }
  return true;
}
if (require.main === module) {
  const [cmd, f] = process.argv.slice(2);
  if (cmd === 'dump') dump(f);
  else if (cmd === 'build') {
    const files = f ? [f] : fs.existsSync(SPECS) ? fs.readdirSync(SPECS).filter(n => n.endsWith('.json')).map(n => n.replace('.json', '.html')) : [];
    let n = 0; for (const x of files) if (build(x)) n++;
    require('./localize-ja').run();
    console.log('Blog/guías en japonés generadas:', n);
  }
}
module.exports = { build, dump };
