#!/usr/bin/env node
/**
 * ¿Quién publicó la ficha? Lee en GA4 los registros de la caja "Lleva esta ruta a tu blog" (evento embed_register:
 * link_domain = dominio del blog, pagePath = ruta o artículo de glosx.app; sin datos personales: la marca se lee del data-by publicado) y visita cada blog
 * para ver si tiene publicado un enlace a glosx.app (portada + hasta 300 páginas de su sitemap).
 *
 * Resultado: tabla en consola y registro acumulado en ~/.config/glosx/embed-registros.json
 * (publicó / se la llevó y no publicó, con la página donde está el enlace y la fecha de la primera detección).
 *
 * Usa la cuenta de servicio de GA4/Indexing (~/.config/glosx/indexing-service-account.json, rol Lector en GA4).
 * Uso: node scripts/check-embeds.js [--days 90]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const PROPERTY = process.env.GA4_PROPERTY_ID || '540424989';
const KEY_PATH = process.env.GLOSX_INDEXING_KEY || path.join(os.homedir(), '.config/glosx/indexing-service-account.json');
const STORE = path.join(os.homedir(), '.config/glosx/embed-registros.json');
const MAX_PAGES = 300;
const UA = 'Mozilla/5.0 (compatible; WoWTrainLinkCheck/1.0; +https://glosx.app)';

const b64u = s => Buffer.from(s).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

function request(url, opts, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({ hostname: u.hostname, path: u.pathname + u.search, method: opts.method || 'GET', headers: opts.headers || {}, timeout: 15000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && (opts.hops || 0) < 4) {
        res.resume();
        return resolve(request(new URL(res.headers.location, url).href, Object.assign({}, opts, { hops: (opts.hops || 0) + 1 }), body));
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => { if (data.length < 3e6) data += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: data, url }));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function token() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const now = Math.floor(Date.now() / 1000);
  const unsigned = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' })) + '.' +
    b64u(JSON.stringify({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const sig = crypto.createSign('RSA-SHA256').update(unsigned).sign(key.private_key).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const body = new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: unsigned + '.' + sig }).toString();
  const r = await request('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) } }, body);
  const j = JSON.parse(r.body);
  if (!j.access_token) throw new Error('GA4: sin access token: ' + r.body);
  return j.access_token;
}

async function registrations(days) {
  const t = await token();
  const body = JSON.stringify({
    dateRanges: [{ startDate: days + 'daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'linkDomain' }, { name: 'pagePath' }, { name: 'date' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: { filter: { fieldName: 'eventName', stringFilter: { value: 'embed_register' } } },
    limit: 1000
  });
  const r = await request(`https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY}:runReport`,
    { method: 'POST', headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, body);
  if (r.status !== 200) throw new Error('GA4 ' + r.status + ': ' + r.body.slice(0, 300));
  const rows = (JSON.parse(r.body).rows || []).map(x => {
    const v = x.dimensionValues.map(d => d.value);
    return { domain: v[0], url: '', brand: '', page: v[1], date: v[2] };
  });
  return rows.filter(x => x.domain && x.domain !== '(not set)');
}

const LINK = /<a\b[^>]*href=["']https?:\/\/(?:www\.)?glosx\.app[^"']*["'][^>]*>/i;
const BY = /class=["']wow-train-card["'][^>]*data-by=["']([^"']{1,60})["']/i;

async function pagesOf(base) {
  const out = new Set([base]);
  const origin = new URL(base).origin;
  const queue = [origin + '/sitemap.xml', origin + '/sitemap_index.xml', origin + '/wp-sitemap.xml'];
  const seen = new Set();
  while (queue.length && out.size < MAX_PAGES) {
    const sm = queue.shift();
    if (seen.has(sm)) continue;
    seen.add(sm);
    let r;
    try { r = await request(sm, { headers: { 'User-Agent': UA } }); } catch (e) { continue; }
    if (r.status !== 200) continue;
    const locs = [...r.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
    for (const l of locs) {
      if (/\.xml(\.gz)?($|\?)/i.test(l)) { if (seen.size < 40) queue.push(l); }
      else if (out.size < MAX_PAGES) out.add(l);
    }
  }
  return [...out];
}

async function findLink(base) {
  const pages = await pagesOf(base);
  // primero las páginas más nuevas suelen ir al final del sitemap
  for (const p of [pages[0]].concat(pages.slice(1).reverse())) {
    try {
      const r = await request(p, { headers: { 'User-Agent': UA } });
      if (r.status === 200 && LINK.test(r.body)) { const b = r.body.match(BY); return { page: p, brand: b ? b[1] : '' }; }
    } catch (e) { /* página caída: seguimos */ }
  }
  return null;
}

(async () => {
  const di = process.argv.indexOf('--days');
  const days = di > -1 ? parseInt(process.argv[di + 1], 10) : 90;
  const store = fs.existsSync(STORE) ? JSON.parse(fs.readFileSync(STORE, 'utf8')) : {};
  const regs = await registrations(days);
  for (const r of regs) {
    const s = store[r.domain] || (store[r.domain] = { domain: r.domain, url: r.url, brand: r.brand, items: [], published: null, firstSeen: null });
    s.url = r.url || s.url; s.brand = r.brand || s.brand;
    if (!s.items.some(i => i.page === r.page)) s.items.push({ page: r.page, date: r.date });
  }
  const domains = Object.keys(store);
  if (!domains.length) { console.log('Todavía no hay registros de embed_register en GA4 (últimos ' + days + ' días).'); return; }
  for (const d of domains) {
    const s = store[d];
    let base = s.url && /^https?:\/\//.test(s.url) ? s.url : 'https://' + d + '/';
    process.stdout.write('Revisando ' + d + '… ');
    const where = await findLink(base).catch(() => null);
    s.lastCheck = new Date().toISOString().slice(0, 10);
    if (where) { s.brand = where.brand || s.brand; s.published = where.page; s.firstSeen = s.firstSeen || s.lastCheck; console.log('PUBLICÓ → ' + where); }
    else { s.published = null; console.log('no encontrado'); }
  }
  fs.mkdirSync(path.dirname(STORE), { recursive: true });
  fs.writeFileSync(STORE, JSON.stringify(store, null, 2));
  const pub = domains.filter(d => store[d].published), no = domains.filter(d => !store[d].published);
  console.log('\nPublicaron (' + pub.length + '):');
  pub.forEach(d => console.log('  ' + d + ' · ' + store[d].brand + ' · ' + store[d].published + ' · desde ' + store[d].firstSeen));
  console.log('Se la llevaron y no publicaron (' + no.length + '):');
  no.forEach(d => console.log('  ' + d + ' · ' + store[d].brand + ' · ' + store[d].items.map(i => i.page + ' (' + i.date + ')').join(', ')));
  console.log('\nRegistro: ' + STORE);
})().catch(e => { console.error(e.message); process.exit(1); });
