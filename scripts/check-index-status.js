#!/usr/bin/env node
/**
 * Consulta el estado REAL de indexación de cada URL vía la URL Inspection API
 * de Search Console (distinta de la Indexing API - esta es de solo lectura,
 * es la misma que usa la herramienta "Inspección de URLs" en la web de GSC).
 *
 * Uso:
 *   node scripts/check-index-status.js https://glosx.app/rutas/paris-barcelona/
 *   node scripts/check-index-status.js --sitemap sitemap.xml
 *   node scripts/check-index-status.js --sitemap sitemap.xml --only-not-indexed
 *
 * Misma clave de cuenta de servicio que notify-google-index.js.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const KEY_PATH = process.env.GLOSX_INDEXING_KEY || path.join(os.homedir(), '.config/glosx/indexing-service-account.json');
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const INSPECT_URL = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
const SITE_URL = 'https://glosx.app/';

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function httpsPostJson(url, bodyObj, headers) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bodyObj);
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }, headers || {}),
    }, (res) => {
      let chunks = '';
      res.on('data', (c) => (chunks += c));
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(chunks); } catch (e) { parsed = chunks; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function getAccessToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = { iss: key.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(key.private_key).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const jwt = `${unsigned}.${signature}`;

  const res = await new Promise((resolve, reject) => {
    const params = new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }).toString();
    const u = new URL(TOKEN_URL);
    const req = https.request({
      hostname: u.hostname, path: u.pathname, method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(params) },
    }, (r) => {
      let chunks = '';
      r.on('data', (c) => (chunks += c));
      r.on('end', () => resolve({ status: r.statusCode, body: JSON.parse(chunks) }));
    });
    req.on('error', reject);
    req.write(params);
    req.end();
  });
  if (res.status !== 200 || !res.body.access_token) throw new Error(`No se pudo obtener el access token: ${JSON.stringify(res.body)}`);
  return res.body.access_token;
}

function extractUrlsFromSitemap(xml) {
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1]);
}

async function inspectUrl(token, url) {
  const res = await httpsPostJson(INSPECT_URL, { inspectionUrl: url, siteUrl: SITE_URL }, { Authorization: `Bearer ${token}` });
  return res;
}

async function main() {
  const args = process.argv.slice(2);
  let urls = [];
  const onlyNotIndexed = args.includes('--only-not-indexed');

  if (args[0] === '--sitemap' || args.includes('--sitemap')) {
    const idx = args.indexOf('--sitemap');
    const filePath = args[idx + 1];
    const xml = fs.readFileSync(filePath, 'utf8');
    urls = extractUrlsFromSitemap(xml);
  } else {
    urls = args.filter((a) => a.startsWith('http'));
  }

  if (urls.length === 0) {
    console.error('Uso: node scripts/check-index-status.js <url1> <url2> ...  |  --sitemap sitemap.xml [--only-not-indexed]');
    process.exit(1);
  }

  if (!fs.existsSync(KEY_PATH)) {
    console.error(`No se encontro la clave de la cuenta de servicio en ${KEY_PATH}`);
    process.exit(1);
  }
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const token = await getAccessToken(key);

  console.log(`Consultando ${urls.length} URLs (esto puede tardar, ~1 por segundo por límite de cuota)...\n`);

  let indexed = 0, notIndexed = 0, errors = 0;
  const notIndexedList = [];

  for (const url of urls) {
    const res = await inspectUrl(token, url);
    if (res.status !== 200) {
      errors++;
      console.log(`ERROR ${url} -> ${res.status} ${JSON.stringify(res.body).slice(0, 200)}`);
      continue;
    }
    const result = res.body.inspectionResult;
    const verdict = result?.indexStatusResult?.verdict || 'UNKNOWN';
    const coverageState = result?.indexStatusResult?.coverageState || '';
    const lastCrawl = result?.indexStatusResult?.lastCrawlTime || 'nunca';
    const isIndexed = verdict === 'PASS';

    if (isIndexed) {
      indexed++;
      if (!onlyNotIndexed) console.log(`OK       ${url}  (${coverageState})`);
    } else {
      notIndexed++;
      notIndexedList.push({ url, coverageState, lastCrawl });
      console.log(`NO INDEX ${url}  ->  ${coverageState}  (último rastreo: ${lastCrawl})`);
    }
    // Pausa breve para no golpear el limite de cuota (600 req/min pero mejor ir tranquilo)
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n=== Resumen ===`);
  console.log(`Indexadas: ${indexed}`);
  console.log(`NO indexadas: ${notIndexed}`);
  console.log(`Errores: ${errors}`);
  console.log(`Total: ${urls.length}`);

  if (notIndexedList.length > 0) {
    console.log(`\n=== URLs sin indexar (para re-notificar o revisar) ===`);
    notIndexedList.forEach((n) => console.log(n.url));
  }
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
