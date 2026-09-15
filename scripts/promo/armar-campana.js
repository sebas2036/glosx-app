#!/usr/bin/env node
/**
 * EL BOTÓN "ARMAR CAMPAÑA".
 *
 * Cada vez que lo corrés, arma una tanda de promoción para N items de la
 * cola (rutas + blog posts que menos se promocionaron) y la reparte entre
 * todos los canales conectados. Vos das la orden cada vez corriendo esto —
 * no hay nada que se dispare solo en segundo plano.
 *
 * Uso:
 *   node scripts/promo/armar-campana.js          (tanda de 5 items por defecto)
 *   node scripts/promo/armar-campana.js 8        (tanda de 8 items)
 *
 * Lee credenciales de ~/.config/glosx/promo-bot.env (ver config.example.env
 * en esta carpeta para saber qué campos completar). Los canales sin
 * credencial cargada se saltan automáticamente y quedan en el paquete
 * "para pegar a mano".
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const QUEUE_PATH = path.join(__dirname, 'content-queue.json');
const ENV_PATH = path.join(os.homedir(), '.config/glosx/promo-bot.env');
const OUT_DIR = path.join(__dirname, 'campañas');

const N = parseInt(process.argv[2], 10) || 5;

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
const COOLDOWN_DAYS = 14;

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

// --- Genera el texto de campaña para un item (caption social + variante larga) ---
function generateCopy(item) {
  const isRoute = item.type === 'ruta';
  const caption = isRoute
    ? `${item.label} by train — full guide, live prices and booking in one search. ${item.url}`
    : `New on the blog: ${item.label}. ${item.url}`;
  const longform = isRoute
    ? `Planning ${item.label}? We put together everything you need — journey time, operators, prices and where to stay — in one page. Check it out: ${item.url}`
    : `${item.label} — full read on WoW Train: ${item.url}`;
  return { caption, longform };
}

// --- Publicadores por canal. Cada uno decide solo si está configurado. ---
const publishers = {
  metricool(env, item, copy) {
    if (!env.METRICOOL_USER_TOKEN || !env.METRICOOL_BLOG_ID) {
      return { channel: 'Metricool (IG/FB/TikTok/Pinterest)', status: 'sin configurar', action: 'Cargá METRICOOL_USER_TOKEN y METRICOOL_BLOG_ID en ~/.config/glosx/promo-bot.env' };
    }
    // TODO: una vez confirmado el endpoint real de la API de Metricool para tu plan,
    // acá va el fetch() que publica `copy.caption` en las redes conectadas.
    // Por ahora, dejamos el paquete listo para conectar sin arriesgar un request roto.
    return { channel: 'Metricool (IG/FB/TikTok/Pinterest)', status: 'pendiente de conectar', action: 'Token cargado — falta confirmar el endpoint exacto de tu plan antes de disparar en vivo.' };
  },
  pinterestDirecto(env, item, copy) {
    if (!env.PINTEREST_ACCESS_TOKEN || !env.PINTEREST_BOARD_ID) {
      return null; // canal opcional, ni se menciona si no está en uso
    }
    return { channel: 'Pinterest directo', status: 'pendiente de conectar', action: 'Token cargado — falta el fetch() final contra la API de Pinterest.' };
  }
};

function main() {
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
    const results = Object.values(publishers)
      .map(fn => fn(env, item, copy))
      .filter(Boolean);

    // Guarda el paquete de texto siempre — así lo automático Y lo manual
    // quedan en el mismo lugar, listos para usar.
    const fileName = `${item.type}-${item.id}.txt`;
    fs.writeFileSync(
      path.join(campaignDir, fileName),
      `URL: ${item.url}\n\n--- Caption corto (redes) ---\n${copy.caption}\n\n--- Texto largo (Quora / Reddit / foros) ---\n${copy.longform}\n`
    );

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

    item.lastPromoted = now;
    item.timesPromoted = (item.timesPromoted || 0) + 1;
    report.push({ item: item.label, canales: videoResult ? [videoResult, ...results] : results });
  }

  queue.items = queue.items; // ya mutado por referencia
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
  console.log(`\nTextos listos en: ${campaignDir}`);
  console.log(`(Los canales "pendiente de conectar" ya tienen el token cargado — solo falta confirmar juntos el endpoint antes de que disparen en vivo.)`);
}

main();
