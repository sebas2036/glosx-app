#!/usr/bin/env node
/**
 * Reporte de GA4 (Data API v1beta) para glosx.app — trae tráfico + eventos clave
 * para diagnosticar el embudo de conversión (dónde se pierden las compras).
 *
 * Reutiliza la MISMA cuenta de servicio del Indexing API:
 *   ~/.config/glosx/indexing-service-account.json
 *
 * Requisitos una-sola-vez (en las webs de Google):
 *   1. Habilitar "Google Analytics Data API" en el proyecto de esa cuenta.
 *   2. En GA4 → Administrar → Gestión de acceso a la propiedad: agregar el
 *      client_email de la cuenta como Lector (Viewer).
 *   3. Conseguir el Property ID numérico (GA4 → Administrar → Config. propiedad).
 *
 * Uso:
 *   node scripts/ga4-report.js <PROPERTY_ID> [--days 28]
 *   GA4_PROPERTY_ID=123456789 node scripts/ga4-report.js
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const KEY_PATH = process.env.GLOSX_INDEXING_KEY || path.join(os.homedir(), '.config/glosx/indexing-service-account.json');
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

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
  if (res.status !== 200 || !res.body.access_token) {
    throw new Error(`No se pudo obtener el access token: ${JSON.stringify(res.body)}`);
  }
  return res.body.access_token;
}

async function runReport(token, propertyId, body) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const res = await httpsPostJson(url, body, { Authorization: `Bearer ${token}` });
  if (res.status !== 200) throw new Error(`GA4 API error ${res.status}: ${JSON.stringify(res.body)}`);
  return res.body;
}

function rowsToPairs(report) {
  if (!report.rows) return [];
  return report.rows.map(r => ({
    key: (r.dimensionValues || []).map(d => d.value).join(' / '),
    value: (r.metricValues || []).map(m => m.value).join(' · ')
  }));
}

async function main() {
  const args = process.argv.slice(2);
  const propertyId = (args[0] && !args[0].startsWith('--')) ? args[0] : process.env.GA4_PROPERTY_ID;
  const daysIdx = args.indexOf('--days');
  const days = daysIdx > -1 ? parseInt(args[daysIdx + 1], 10) : 28;
  if (!propertyId) {
    console.error('Falta el Property ID. Uso: node scripts/ga4-report.js <PROPERTY_ID> [--days 28]');
    process.exit(1);
  }
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const token = await getAccessToken(key);
  const dateRanges = [{ startDate: `${days}daysAgo`, endDate: 'today' }];

  // 1) Totales
  const totals = await runReport(token, propertyId, {
    dateRanges,
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'screenPageViews' }, { name: 'eventCount' }]
  });
  // 2) Eventos por nombre
  const byEvent = await runReport(token, propertyId, {
    dateRanges, dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }], limit: 50
  });
  // 3) Fuente de tráfico
  const bySource = await runReport(token, propertyId, {
    dateRanges, dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }], metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 15
  });

  const t = (totals.rows && totals.rows[0]) ? totals.rows[0].metricValues.map(m => m.value) : ['0', '0', '0', '0'];
  const snapshot = {
    generatedAt: new Date().toISOString(),
    propertyId, windowDays: days,
    totals: { sessions: +t[0], totalUsers: +t[1], pageViews: +t[2], eventCount: +t[3] },
    events: rowsToPairs(byEvent),
    trafficSources: rowsToPairs(bySource)
  };

  console.log('\n===== GA4 glosx.app — últimos ' + days + ' días =====');
  console.log(`Sesiones: ${snapshot.totals.sessions} · Usuarios: ${snapshot.totals.totalUsers} · Vistas: ${snapshot.totals.pageViews}`);
  console.log('\n--- Eventos (nombre: cantidad) ---');
  snapshot.events.forEach(e => console.log(`  ${e.key}: ${e.value}`));
  console.log('\n--- Fuentes de tráfico (source/medium: sesiones) ---');
  snapshot.trafficSources.forEach(s => console.log(`  ${s.key}: ${s.value}`));
  console.log('\n--- JSON snapshot (para guardar/comparar) ---');
  console.log(JSON.stringify(snapshot, null, 2));
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
