#!/usr/bin/env node
/**
 * EL BOTÓN "ARMAR CAMPAÑA".
 *
 * Cada vez que lo corrés, arma una tanda de promoción para N items de la
 * cola (rutas + blog posts que menos se promocionaron) y dispara TODO lo
 * que esté conectado: genera el video, y publica un artículo con
 * "glosx.app" bien metido en el texto en Pinterest, Medium y Dev.to —
 * en vivo, sobre las ~120 rutas y posts del sitio. Vos das la orden cada
 * vez tocando el botón — no hay nada que corra solo en segundo plano ni
 * nada que dependa de que vos escribas o leas inglés.
 *
 * Uso:
 *   node scripts/promo/armar-campana.js          (tanda de 5 items por defecto)
 *   node scripts/promo/armar-campana.js 8        (tanda de 8 items)
 *
 * Lee credenciales de ~/.config/glosx/promo-bot.env (ver config.example.env
 * en esta carpeta). Los canales sin credencial cargada se saltan solos.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const PEXELS_KEY_PATH = path.join(os.homedir(), '.config/glosx/pexels-api-key');
const QUEUE_PATH = path.join(__dirname, 'content-queue.json');
const ENV_PATH = path.join(os.homedir(), '.config/glosx/promo-bot.env');
const OUT_DIR = path.join(__dirname, 'campañas');
const COOLDOWN_DAYS = 14;

const N = parseInt(process.argv[2], 10) || 5;

// --- Helper HTTP mínimo (sin dependencias externas) ---
function httpRequest(url, { method = 'GET', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;
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

async function getPexelsImageUrl(query) {
  if (!fs.existsSync(PEXELS_KEY_PATH)) return null;
  const key = fs.readFileSync(PEXELS_KEY_PATH, 'utf8').trim();
  const res = await httpRequest(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`, { headers: { Authorization: key } });
  const photo = res.body && res.body.photos && res.body.photos[0];
  return photo ? (photo.src.large2x || photo.src.large) : null;
}

// --- Carga la config sin exponerla en logs ni en ningún commit ---
function loadEnv() {
  const env = {};
  if (fs.existsSync(ENV_PATH)) {
    const raw = fs.readFileSync(ENV_PATH, 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m && m[2].trim()) env[m[1]] = m[2].trim();
    }
  }
  return env;
}

// --- Elige los N items menos promocionados de la cola, respetando un
//     "enfriamiento" mínimo: nada se repite antes de COOLDOWN_DAYS. ---
function pickBatch(queue, n) {
  const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const eligible = Object.values(queue.items).filter(item => {
    if (!item.lastPromoted) return true;
    return now - new Date(item.lastPromoted).getTime() >= cooldownMs;
  });
  eligible.sort((a, b) => {
    const at = a.lastPromoted ? new Date(a.lastPromoted).getTime() : 0;
    const bt = b.lastPromoted ? new Date(b.lastPromoted).getTime() : 0;
    return at - bt; // nunca promocionados (0) primero
  });
  if (eligible.length < n) {
    console.log(`(Solo hay ${eligible.length} items fuera del enfriamiento de ${COOLDOWN_DAYS} días — se arma con esos.)`);
  }
  return eligible.slice(0, n);
}

// --- Genera el texto de campaña para un item — caption corto (Pinterest)
//     y un articulito corto en inglés (Medium / Dev.to) con la marca
//     bien metida adentro del texto, no solo como link al final. ---
function generateCopy(item) {
  const isRoute = item.type === 'ruta';
  const caption = isRoute
    ? `${item.label} by train — full guide, live prices and booking in one search. glosx.app`
    : `New on the blog: ${item.label}. glosx.app`;
  const article = isRoute
    ? `<p>Planning to travel <strong>${item.label}</strong> by train? <strong>glosx.app</strong> put together a complete guide with journey times, operators, live prices and where to stay — everything in one page, updated automatically.</p><p>See the full ${item.label} train guide on <strong>glosx.app</strong>: <a href="${item.url}">${item.url}</a></p><p>glosx.app also has an AI trip planner that builds a full multi-city European train itinerary from a single sentence — free, no signup.</p>`
    : `<p>New on <strong>glosx.app</strong>: <strong>${item.label}</strong>.</p><p>Read the full guide: <a href="${item.url}">${item.url}</a></p>`;
  return { caption, article };
}

// --- Publicadores: cada uno se auto-salta si falta su credencial. Todos
//     devuelven una promesa — no hace falta que vos hagas nada con el
//     resultado más allá de leer el log. ---
const publishers = {
  async pinterest(env, item, copy) {
    if (!env.PINTEREST_ACCESS_TOKEN || !env.PINTEREST_BOARD_ID) {
      return null; // canal opcional, ni se menciona si no está en uso
    }
    try {
      const imageUrl = await getPexelsImageUrl(`${item.to || item.label} europe travel`);
      if (!imageUrl) return { channel: 'Pinterest', status: 'error', action: 'No se encontró foto en Pexels para este item.' };

      const res = await httpRequest('https://api.pinterest.com/v5/pins', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.PINTEREST_ACCESS_TOKEN}` },
        body: {
          link: item.url,
          title: item.label,
          description: copy.caption,
          board_id: env.PINTEREST_BOARD_ID,
          media_source: { source_type: 'image_url', url: imageUrl }
        }
      });
      if (res.status >= 200 && res.status < 300) {
        return { channel: 'Pinterest', status: 'publicado', action: res.body.id ? `pin ${res.body.id}` : 'OK' };
      }
      return { channel: 'Pinterest', status: 'error', action: JSON.stringify(res.body).slice(0, 200) };
    } catch (e) {
      return { channel: 'Pinterest', status: 'error', action: e.message };
    }
  },

  async medium(env, item, copy) {
    if (!env.MEDIUM_INTEGRATION_TOKEN) return null; // opcional, no se menciona si no está en uso
    try {
      const me = await httpRequest('https://api.medium.com/v1/me', {
        headers: { Authorization: `Bearer ${env.MEDIUM_INTEGRATION_TOKEN}`, Accept: 'application/json' }
      });
      const userId = me.body && me.body.data && me.body.data.id;
      if (!userId) return { channel: 'Medium', status: 'error', action: 'No se pudo identificar el usuario (¿token válido?).' };

      const res = await httpRequest(`https://api.medium.com/v1/users/${userId}/posts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.MEDIUM_INTEGRATION_TOKEN}` },
        body: {
          title: item.label,
          contentFormat: 'html',
          content: copy.article,
          canonicalUrl: item.url,
          publishStatus: 'public',
          tags: ['train travel', 'europe', 'travel guide']
        }
      });
      if (res.status >= 200 && res.status < 300) {
        return { channel: 'Medium', status: 'publicado', action: (res.body.data && res.body.data.url) || 'OK' };
      }
      return { channel: 'Medium', status: 'error', action: JSON.stringify(res.body).slice(0, 200) };
    } catch (e) {
      return { channel: 'Medium', status: 'error', action: e.message };
    }
  },

  async devto(env, item, copy) {
    if (!env.DEVTO_API_KEY) return null; // opcional, no se menciona si no está en uso
    try {
      const res = await httpRequest('https://dev.to/api/articles', {
        method: 'POST',
        headers: { 'api-key': env.DEVTO_API_KEY },
        body: {
          article: {
            title: item.label,
            body_markdown: copy.article.replace(/<[^>]+>/g, '').trim() + `\n\n[${item.url}](${item.url})`,
            published: true,
            canonical_url: item.url,
            tags: ['travel', 'europe', 'traintravel']
          }
        }
      });
      if (res.status >= 200 && res.status < 300) {
        return { channel: 'Dev.to', status: 'publicado', action: res.body.url || 'OK' };
      }
      return { channel: 'Dev.to', status: 'error', action: JSON.stringify(res.body).slice(0, 200) };
    } catch (e) {
      return { channel: 'Dev.to', status: 'error', action: e.message };
    }
  }
};

async function main() {
  if (!fs.existsSync(QUEUE_PATH)) {
    console.error('No existe content-queue.json — corré primero: node scripts/promo/build-content-queue.js');
    process.exit(1);
  }
  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const env = loadEnv();
  const batch = pickBatch(queue, N);
  const now = new Date().toISOString();
  const campaignId = now.slice(0, 16).replace(/[:T]/g, '-');
  const campaignDir = path.join(OUT_DIR, campaignId);
  fs.mkdirSync(campaignDir, { recursive: true });

  const report = [];
  for (const item of batch) {
    const copy = generateCopy(item);

    // Video: si es una ruta, genera un reel con glosx.app quemado.
    let videoResult = null;
    if (item.type === 'ruta' && item.from && item.to) {
      try {
        console.log(`   🎬 Generando reel para ${item.label}...`);
        const outputPath = execSync(
          `node "${path.join(__dirname, 'generate-reel.js')}" "${item.id}" "${item.from}" "${item.to}"`,
          { encoding: 'utf8' }
        );
        const match = outputPath.match(/Listo: (.+\.mp4)/);
        videoResult = { channel: 'Reel (video)', status: match ? 'generado' : 'error', action: match ? match[1].trim() : 'ver log' };
      } catch (e) {
        videoResult = { channel: 'Reel (video)', status: 'error', action: e.message.split('\n')[0] };
      }
    }

    console.log(`   📌 Publicando ${item.label}...`);
    const results = (await Promise.all(Object.values(publishers).map(fn => fn(env, item, copy)))).filter(Boolean);

    // Guarda el caption igual, por si algún día hace falta revisarlo — no
    // requiere que nadie lo pegue a mano en ningún lado.
    const fileName = `${item.type}-${item.id}.txt`;
    fs.writeFileSync(path.join(campaignDir, fileName), `URL: ${item.url}\n\nCaption usado: ${copy.caption}\n`);

    item.lastPromoted = now;
    item.timesPromoted = (item.timesPromoted || 0) + 1;
    report.push({ item: item.label, canales: videoResult ? [videoResult, ...results] : results });
  }

  queue.log = queue.log || [];
  queue.log.push({ campaignId, at: now, itemIds: batch.map(i => i.id) });
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));

  console.log(`\n=== Campaña ${campaignId} armada: ${batch.length} items ===\n`);
  for (const r of report) {
    console.log(`• ${r.item}`);
    for (const c of r.canales) {
      console.log(`   - ${c.channel}: ${c.status}${c.action ? ' — ' + c.action : ''}`);
    }
  }
  console.log(`\nGuardado en: ${campaignDir}`);
}

main();
