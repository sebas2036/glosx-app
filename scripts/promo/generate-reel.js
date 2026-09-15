#!/usr/bin/env node
/**
 * Genera un reel 9:16 para una ruta usando make_reel.sh (ffmpeg + ImageMagick).
 * Baja fotos reales del destino desde Pexels (o reusa las que ya están en
 * caché en meta_automation/assets/rutas_photos/<slug>/), arma 3 escenas y
 * quema "glosx.app" como subtítulo en cada una.
 *
 * No necesita ninguna credencial nueva — reusa ~/.config/glosx/pexels-api-key
 * (la misma que ya usa el sitio para las fotos de las rutas).
 *
 * Uso: node scripts/promo/generate-reel.js <slug> "<from>" "<to>"
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

const REEL_ENGINE_DIR = path.join(os.homedir(), 'meta_automation');
const PHOTOS_CACHE = path.join(REEL_ENGINE_DIR, 'assets/rutas_photos');
const PEXELS_KEY_PATH = path.join(os.homedir(), '.config/glosx/pexels-api-key');

function httpsGetJson(url, headers) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

async function getPhotosForCity(slug, city) {
  const cacheDir = path.join(PHOTOS_CACHE, slug);
  if (fs.existsSync(cacheDir)) {
    const cached = fs.readdirSync(cacheDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
    if (cached.length >= 2) return cached.map(f => path.join(cacheDir, f));
  }

  // No hay cache: buscar en Pexels y bajar 3 fotos nuevas
  if (!fs.existsSync(PEXELS_KEY_PATH)) {
    throw new Error(`No hay fotos en cache para "${slug}" y no se encontró la key de Pexels en ${PEXELS_KEY_PATH}`);
  }
  const key = fs.readFileSync(PEXELS_KEY_PATH, 'utf8').trim();
  const query = encodeURIComponent(`${city} europe travel`);
  const json = await httpsGetJson(`https://api.pexels.com/v1/search?query=${query}&per_page=3&orientation=portrait`, { Authorization: key });
  const photos = json.photos || [];
  if (photos.length === 0) throw new Error(`Pexels no devolvió fotos para "${city}"`);

  fs.mkdirSync(cacheDir, { recursive: true });
  const paths = [];
  for (let i = 0; i < photos.length; i++) {
    const dest = path.join(cacheDir, `0${i + 1}.jpg`);
    await downloadFile(photos[i].src.large2x || photos[i].src.large, dest);
    paths.push(dest);
  }
  return paths;
}

async function main() {
  const [slug, from, to] = process.argv.slice(2);
  if (!slug || !from || !to) {
    console.error('Uso: node scripts/promo/generate-reel.js <slug> "<from>" "<to>"');
    process.exit(1);
  }

  console.log(`Buscando fotos para ${from} → ${to}...`);
  const originPhotos = await getPhotosForCity(`${slug}-from`, from);
  const destPhotos = await getPhotosForCity(slug, to);
  const photos = [...originPhotos.slice(0, 1), ...destPhotos.slice(0, 2)];

  const scenes = [
    `${photos[0]}|${from} to ${to}|by train`,
    `${photos[1] || photos[0]}|Routes, prices, hotels|glosx.app`,
    `${photos[2] || photos[0]}|Plan it free|glosx.app`
  ];

  const outname = `reel_${slug}_${Date.now()}`;
  console.log(`Generando reel (${outname})...`);
  execSync(`OUTNAME="${outname}" bash make_reel.sh ${scenes.map(s => `"${s.replace(/"/g, '\\"')}"`).join(' ')}`, {
    cwd: REEL_ENGINE_DIR,
    stdio: 'inherit'
  });

  const outPath = path.join(REEL_ENGINE_DIR, 'assets/editados', `${outname}.mp4`);
  console.log(`\nListo: ${outPath}`);
  return outPath;
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
