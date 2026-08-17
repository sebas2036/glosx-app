#!/usr/bin/env node
/**
 * Consulta el estado real de indexación de cada URL vía la URL Inspection API
 * de Search Console (searchconsole.googleapis.com), usando la misma cuenta de
 * servicio que ya está autorizada como Propietario en la propiedad GSC.
 *
 * Uso:
 *   node scripts/check-gsc-index-status.js --file urls.txt
 *
 * Imprime, por URL: INDEXED | NOT_INDEXED (con motivo) | ERROR
 * y al final escribe scripts/.not-indexed.txt con las URLs que faltan.
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
      family: 4,
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
      hostname: u.hostname, path: u.pathname, method: 'POST', family: 4,
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

  if (res.status !== 200 || !res.body.access_token) {
    throw new Error(`No se pudo obtener el access token: ${JSON.stringify(res.body)}`);
  }
  return res.body.access_token;
}

async function inspect(token, url) {
  const res = await httpsPostJson(INSPECT_URL, { inspectionUrl: url, siteUrl: SITE_URL }, { Authorization: `Bearer ${token}` });
  return res;
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  const args = process.argv.slice(2);
  let urls = [];
  if (args[0] === '--file') {
    urls = fs.readFileSync(args[1], 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
  } else {
    urls = args.filter((a) => a.startsWith('http'));
  }
  if (urls.length === 0) {
    console.error('Uso: node scripts/check-gsc-index-status.js --file urls.txt');
    process.exit(1);
  }
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  console.log(`Pidiendo access token (readonly) para ${key.client_email}...`);
  const token = await getAccessToken(key);

  const notIndexed = [];
  let indexed = 0, errors = 0;
  for (const url of urls) {
    try {
      const res = await inspect(token, url);
      if (res.status !== 200) {
        console.log(`ERROR ${url} -> ${res.status} ${JSON.stringify(res.body).slice(0, 200)}`);
        errors++;
        continue;
      }
      const verdict = res.body.inspectionResult?.indexStatusResult?.verdict;
      const coverageState = res.body.inspectionResult?.indexStatusResult?.coverageState;
      if (verdict === 'PASS') {
        indexed++;
        console.log(`OK       ${url}`);
      } else {
        notIndexed.push(url);
        console.log(`FALTA    ${url} -> ${verdict} / ${coverageState}`);
      }
    } catch (e) {
      errors++;
      console.log(`ERROR ${url} -> ${e.message}`);
    }
    await sleep(300);
  }

  fs.writeFileSync(path.join(__dirname, '.not-indexed.txt'), notIndexed.join('\n') + '\n');
  console.log(`\nIndexadas: ${indexed} | Sin indexar: ${notIndexed.length} | Errores: ${errors} | Total: ${urls.length}`);
  console.log(`Lista de faltantes guardada en scripts/.not-indexed.txt`);
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
