#!/usr/bin/env node
/**
 * Un disparo: Dev.to + Pinterest para la ruleta /hoy/.
 * Salta el canal si falta la key. Nunca imprime secretos.
 *
 *   node scripts/promo/publicar-fase2.js
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');

const ENV_PATH = path.join(os.homedir(), '.config/glosx/promo-bot.env');
const PEXELS_KEY_PATH = path.join(os.homedir(), '.config/glosx/pexels-api-key');
const MD_PATH = path.join(__dirname, 'campañas/2026-09-19/devto-hoy.md');
const HOY = 'https://glosx.app/hoy/';
const ROUTE = 'https://glosx.app/rutas/madrid-barcelona/';

function loadEnv() {
  const env = {};
  if (!fs.existsSync(ENV_PATH)) return env;
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim().replace(/^["']|["']$/g, '');
    if (v) env[m[1]] = v;
  }
  return env;
}

function httpRequest(url, { method = 'GET', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: u.hostname, path: u.pathname + u.search, method,
      headers: data ? { ...headers, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : headers
    }, (res) => {
      let chunks = '';
      res.on('data', (c) => (chunks += c));
      res.on('end', () => {
        let parsed; try { parsed = JSON.parse(chunks); } catch (e) { parsed = chunks; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function parseMarkdown(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { title: 'WoW Train destination roulette', tags: ['travel'], body: raw.trim(), canonical: HOY };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    fm[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return {
    title: fm.title || 'WoW Train',
    tags: (fm.tags || 'travel').split(',').map((t) => t.trim()).filter(Boolean),
    canonical: fm.canonical_url || HOY,
    body: m[2].trim(),
  };
}

async function pexelsImage() {
  if (!fs.existsSync(PEXELS_KEY_PATH)) return null;
  const key = fs.readFileSync(PEXELS_KEY_PATH, 'utf8').trim();
  const res = await httpRequest(
    'https://api.pexels.com/v1/search?query=' + encodeURIComponent('high speed train europe') + '&per_page=1&orientation=portrait',
    { headers: { Authorization: key } }
  );
  const photo = res.body && res.body.photos && res.body.photos[0];
  return photo ? (photo.src.large2x || photo.src.large) : null;
}

async function publishDevto(env, article) {
  if (!env.DEVTO_API_KEY) return { channel: 'Dev.to', status: 'salteado', action: 'DEVTO_API_KEY vacío en promo-bot.env' };
  const res = await httpRequest('https://dev.to/api/articles', {
    method: 'POST',
    headers: { 'api-key': env.DEVTO_API_KEY },
    body: {
      article: {
        title: article.title,
        body_markdown: article.body,
        published: true,
        canonical_url: article.canonical,
        tags: article.tags.slice(0, 4)
      }
    }
  });
  if (res.status >= 200 && res.status < 300) {
    return { channel: 'Dev.to', status: 'publicado', action: res.body.url || 'OK' };
  }
  return { channel: 'Dev.to', status: 'error', action: JSON.stringify(res.body).slice(0, 220) };
}

async function publishPinterest(env) {
  if (!env.PINTEREST_ACCESS_TOKEN || !env.PINTEREST_BOARD_ID) {
    return { channel: 'Pinterest', status: 'salteado', action: 'Falta token o board id (no es lo mismo que verificar el dominio)' };
  }
  const imageUrl = await pexelsImage();
  if (!imageUrl) return { channel: 'Pinterest', status: 'error', action: 'Sin foto Pexels' };
  const res = await httpRequest('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.PINTEREST_ACCESS_TOKEN },
    body: {
      link: HOY,
      title: 'Madrid → Barcelona by train',
      description: 'Destination roulette: a real European city pair, itinerary included. glosx.app/hoy/ · also ' + ROUTE,
      board_id: env.PINTEREST_BOARD_ID,
      media_source: { source_type: 'image_url', url: imageUrl }
    }
  });
  if (res.status >= 200 && res.status < 300) {
    return { channel: 'Pinterest', status: 'publicado', action: res.body.id ? 'pin ' + res.body.id : 'OK' };
  }
  return { channel: 'Pinterest', status: 'error', action: JSON.stringify(res.body).slice(0, 220) };
}

async function main() {
  const env = loadEnv();
  const article = parseMarkdown(fs.readFileSync(MD_PATH, 'utf8'));
  const report = [];
  report.push(await publishDevto(env, article));
  report.push(await publishPinterest(env));
  const reel = path.join(__dirname, 'campañas/2026-09-19/reel_madrid-barcelona.mp4');
  report.push({
    channel: 'Reel local',
    status: fs.existsSync(reel) ? 'listo' : 'falta',
    action: fs.existsSync(reel) ? reel : 'correr generate-video-reel.js'
  });
  console.log('=== Fase 2 /hoy/ ===');
  for (const r of report) {
    console.log('- ' + r.channel + ': ' + r.status + (r.action ? ' — ' + r.action : ''));
  }
}

main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
