#!/usr/bin/env node
/**
 * Avisa a Google Search Console que sitemap.xml de glosx.app cambió,
 * forzando una redescarga. Es el método que sí tiene efecto verificable
 * para páginas normales (a diferencia de la Indexing API).
 *
 * Mismo flujo JWT que scripts/notify-google-index.js y que
 * lagarlab/scripts/notify-sitemap-google.mjs.
 *
 * Uso: node scripts/notify-sitemap-google.js
 *
 * Clave: ~/.config/glosx/indexing-service-account.json
 *        (o GLOSX_INDEXING_KEY)
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const KEY_PATH = process.env.GLOSX_INDEXING_KEY || path.join(os.homedir(), '.config/glosx/indexing-service-account.json');
const SCOPE = 'https://www.googleapis.com/auth/webmasters';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SITE_URL = 'https://glosx.app/';
const SITEMAP_URL = 'https://glosx.app/sitemap.xml';

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

function sitemapEndpoint() {
  return `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`;
}

async function main() {
  if (!fs.existsSync(KEY_PATH)) {
    console.error(`No se encontró la clave de la cuenta de servicio en ${KEY_PATH}`);
    process.exit(1);
  }
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  console.log(`Pidiendo access token (scope webmasters) para ${key.client_email}...`);
  const token = await getAccessToken(key);

  console.log(`Resubmitiendo ${SITEMAP_URL} en ${SITE_URL}...`);
  const submitRes = await httpsRequest('PUT', sitemapEndpoint(), { Authorization: `Bearer ${token}` });
  if (submitRes.status !== 200 && submitRes.status !== 204) {
    console.error(`FAIL submit -> ${submitRes.status} ${JSON.stringify(submitRes.body)}`);
    process.exit(1);
  }
  console.log('OK: Google recibió el aviso de resubmit.');

  const statusRes = await httpsRequest('GET', sitemapEndpoint(), { Authorization: `Bearer ${token}` });
  if (statusRes.status === 200) {
    const { lastSubmitted, lastDownloaded, isPending, warnings, errors } = statusRes.body;
    console.log('\nEstado del sitemap:');
    console.log(`  lastSubmitted:  ${lastSubmitted}`);
    console.log(`  lastDownloaded: ${lastDownloaded || '(todavía no)'}`);
    console.log(`  isPending:      ${isPending}`);
    console.log(`  warnings:       ${warnings ?? 0}`);
    console.log(`  errors:         ${errors ?? 0}`);
  } else {
    console.log(`No se pudo leer el estado (${statusRes.status}), pero el submit sí se hizo.`);
  }
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
