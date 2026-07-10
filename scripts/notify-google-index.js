#!/usr/bin/env node
/**
 * Avisa a Google (Indexing API) que una o más URLs de glosx.app son nuevas o se actualizaron,
 * para acelerar el descubrimiento en vez de esperar el crawl normal del sitemap.
 *
 * Uso:
 *   node scripts/notify-google-index.js https://glosx.app/rutas/naples-sorrento/ https://glosx.app/rutas/naples-sorrento/es/
 *   node scripts/notify-google-index.js --file urls.txt   (una URL por línea)
 *
 * Requiere la clave de la cuenta de servicio en:
 *   ~/.config/glosx/indexing-service-account.json
 * (o ruta pasada por la env var GLOSX_INDEXING_KEY)
 *
 * Nota: la Indexing API de Google está documentada oficialmente solo para paginas
 * JobPosting o BroadcastEvent. Usarla para paginas normales es un uso no oficial mas
 * la Search Console del sitio ya autorizo a esta cuenta de servicio como Propietario,
 * asi que funciona, pero no esta 100% garantizado por Google a largo plazo.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const KEY_PATH = process.env.GLOSX_INDEXING_KEY || path.join(os.homedir(), '.config/glosx/indexing-service-account.json');
const SCOPE = 'https://www.googleapis.com/auth/indexing';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const PUBLISH_URL = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

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
  const claim = {
    iss: key.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(key.private_key).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const jwt = `${unsigned}.${signature}`;

  const res = await new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }).toString();
    const u = new URL(TOKEN_URL);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname,
      method: 'POST',
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

async function notifyUrl(token, url, type) {
  const res = await httpsPostJson(PUBLISH_URL, { url, type: type || 'URL_UPDATED' }, {
    Authorization: `Bearer ${token}`,
  });
  return res;
}

async function main() {
  const args = process.argv.slice(2);
  let urls = [];

  if (args[0] === '--file') {
    const filePath = args[1];
    urls = fs.readFileSync(filePath, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
  } else {
    urls = args.filter((a) => a.startsWith('http'));
  }

  if (urls.length === 0) {
    console.error('Uso: node scripts/notify-google-index.js <url1> <url2> ...  |  --file urls.txt');
    process.exit(1);
  }

  if (!fs.existsSync(KEY_PATH)) {
    console.error(`No se encontro la clave de la cuenta de servicio en ${KEY_PATH}`);
    process.exit(1);
  }
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));

  console.log(`Pidiendo access token para ${key.client_email}...`);
  const token = await getAccessToken(key);

  let ok = 0, fail = 0;
  for (const url of urls) {
    const res = await notifyUrl(token, url, 'URL_UPDATED');
    if (res.status === 200) {
      ok++;
      console.log(`OK   ${url}`);
    } else {
      fail++;
      console.log(`FAIL ${url} -> ${res.status} ${JSON.stringify(res.body)}`);
    }
  }
  console.log(`\nListo: ${ok} indexadas, ${fail} con error, de ${urls.length} totales.`);
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
