#!/usr/bin/env node
/**
 * Top de páginas por impresiones/clics/CTR de Search Console (solo lectura),
 * forzando una redescarga. Es el método que sí tiene efecto verificable
 * para páginas normales (a diferencia de la Indexing API).
 *
 * Mismo flujo JWT que scripts/notify-google-index.js y que
 * lagarlab/scripts/notify-sitemap-google.mjs.
 *
 * Uso:
 *   node scripts/notify-sitemap-google.js
 *   node scripts/notify-sitemap-google.js --site sc-domain:lagarlab.com --sitemap https://lagarlab.com/sitemap.xml
 *
 * La misma cuenta de servicio cubre todas las propiedades:
 *   ~/.config/glosx/indexing-service-account.json  (o GLOSX_INDEXING_KEY)
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const KEY_PATH = process.env.GLOSX_INDEXING_KEY || path.join(os.homedir(), '.config/glosx/indexing-service-account.json');
const SCOPE = 'https://www.googleapis.com/auth/webmasters';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const SITE_URL = arg('--site', 'https://glosx.app/');
const SITEMAP_URL = arg('--sitemap', 'https://glosx.app/sitemap.xml');

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function httpsRequest(method, url, headers, bodyStr) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method,
      family: 4,
      headers: Object.assign(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}, headers || {}),
    }, (res) => {
      let chunks = '';
      res.on('data', (c) => (chunks += c));
      res.on('end', () => {
        let parsed;
        try { parsed = chunks ? JSON.parse(chunks) : {}; } catch { parsed = chunks; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
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
  const params = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  }).toString();
  const res = await httpsRequest('POST', TOKEN_URL, { 'Content-Type': 'application/x-www-form-urlencoded' }, params);
  if (res.status !== 200 || !res.body.access_token) {
    throw new Error(`No se pudo obtener el access token: ${JSON.stringify(res.body)}`);
  }
  return res.body.access_token;
}

async function main() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const token = await getAccessToken(key);
  const end = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
  const start = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;
  const r = await httpsRequest('POST', url, { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    JSON.stringify({ startDate: start, endDate: end, dimensions: ['page'], rowLimit: 5000 }));
  if (r.status !== 200) { console.error('FAIL', r.status, JSON.stringify(r.body).slice(0, 300)); process.exit(1); }
  const rows = (r.body.rows || []).map((x) => ({ page: x.keys[0], clicks: x.clicks, impressions: x.impressions, ctr: x.ctr, position: x.position }));
  fs.writeFileSync(process.argv[2] || 'gsc-pages.json', JSON.stringify(rows));
  console.log(`${rows.length} páginas con impresiones (${start} a ${end})`);
}
main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
