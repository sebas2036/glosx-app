#!/usr/bin/env node
/**
 * Reel 9:16 desde Pexels Videos (no Ken Burns de fotos).
 * Overlay: pregunta de la ruleta, par, glosx.app/hoy/, crédito Pexels.
 *
 * Uso: node scripts/promo/generate-video-reel.js <slug> "<from>" "<to>"
 * Sale a scripts/promo/campañas/<fecha>/reel_<slug>.mp4 (gitignored).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const PEXELS_KEY_PATH = path.join(os.homedir(), '.config/glosx/pexels-api-key');
const FONT = '/System/Library/Fonts/Supplemental/Arial Black.ttf';
const W = 1080;
const H = 1920;
const SECS = 10;

function httpsGetJson(url, headers) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const get = url.startsWith('http://') ? http.get : https.get;
    get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadFile(res.headers.location, destPath).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        return reject(new Error('download HTTP ' + res.statusCode));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

function pickFile(files) {
  const mp4 = (files || []).filter((f) => (f.file_type || '').includes('mp4') || (f.link || '').includes('.mp4'));
  if (!mp4.length) return null;
  const ranked = mp4.slice().sort((a, b) => {
    const aw = a.width || 0;
    const bw = b.width || 0;
    const ascore = Math.abs(aw - 1080) + (aw < 720 ? 4000 : 0);
    const bscore = Math.abs(bw - 1080) + (bw < 720 ? 4000 : 0);
    return ascore - bscore;
  });
  return ranked[0];
}

async function findVideo(key, queries) {
  for (const q of queries) {
    const url = 'https://api.pexels.com/videos/search?query=' + encodeURIComponent(q) + '&per_page=8&orientation=portrait';
    const { status, body } = await httpsGetJson(url, { Authorization: key });
    if (status !== 200) continue;
    const vids = body.videos || [];
    const skip = /subway|metro|underground|bucharest|tube|tram/i;
    const usable = vids.filter((v) => (v.duration || 0) >= 8 && !skip.test(v.url || '') && !skip.test((v.url || '') + ' ' + (v.video_files && v.video_files[0] && v.video_files[0].link || '')));
    const pool = usable.length ? usable : vids.filter((v) => !skip.test(v.url || ''));
    for (const v of pool) {
      const file = pickFile(v.video_files);
      if (file && file.link) {
        return {
          id: v.id,
          duration: v.duration,
          photographer: (v.user && v.user.name) || 'Pexels',
          pexelsUrl: v.url,
          file,
        };
      }
    }
  }
  return null;
}

function buildOverlay(outPng, from, to, credit) {
  const tmp = path.dirname(outPng);
  const title = tmp + '/t.png';
  const pair = tmp + '/p.png';
  const cta = tmp + '/c.png';
  const cred = tmp + '/k.png';
  const scrim = tmp + '/scrim.png';
  execSync(`magick -background none -font "${FONT}" -fill white -stroke black -strokewidth 3 -size 980x120 -gravity center caption:"¿Hoy nos vamos a…?" "${title}"`);
  execSync(`magick -background none -font "${FONT}" -fill "#ffe8a3" -stroke black -strokewidth 3 -size 980x110 -gravity center caption:"${from}  →  ${to}" "${pair}"`);
  execSync(`magick -background none -font "${FONT}" -fill "#C10016" -stroke white -strokewidth 2 -size 980x80 -gravity center caption:"glosx.app/hoy/" "${cta}"`);
  execSync(`magick -background none -font "${FONT}" -fill "#dddddd" -size 980x50 -gravity center caption:"Video: ${credit} / Pexels" "${cred}"`);
  execSync(`magick -size ${W}x620 gradient:none-'#000000E6' "${scrim}"`);
  execSync(`magick -size ${W}x${H} xc:none "${scrim}" -gravity South -geometry +0+0 -composite "${title}" -gravity South -geometry +0+430 -composite "${pair}" -gravity South -geometry +0+300 -composite "${cta}" -gravity South -geometry +0+210 -composite "${cred}" -gravity South -geometry +0+40 -composite "${outPng}"`);
}

async function main() {
  const [slug, from, to] = process.argv.slice(2);
  if (!slug || !from || !to) {
    console.error('Uso: node scripts/promo/generate-video-reel.js <slug> "<from>" "<to>"');
    process.exit(1);
  }
  if (!fs.existsSync(PEXELS_KEY_PATH)) {
    throw new Error('Falta ~/.config/glosx/pexels-api-key');
  }
  const key = fs.readFileSync(PEXELS_KEY_PATH, 'utf8').trim();
  const day = new Date().toISOString().slice(0, 10);
  const outDir = path.join(__dirname, 'campañas', day);
  const work = path.join(outDir, 'work-' + slug);
  fs.mkdirSync(work, { recursive: true });

  const queries = [
    'high speed train europe',
    'spain high speed train',
    'train countryside europe',
    from + ' train europe',
    to + ' train europe',
  ];
  console.log('Buscando video Pexels para ' + from + ' → ' + to + '...');
  const hit = await findVideo(key, queries);
  if (!hit) throw new Error('Pexels no devolvió un MP4 usable');
  console.log('Clip id ' + hit.id + ' · ' + hit.duration + 's · ' + hit.photographer);

  const src = path.join(work, 'src.mp4');
  await downloadFile(hit.file.link, src);
  const overlay = path.join(work, 'overlay.png');
  buildOverlay(overlay, from, to, hit.photographer.replace(/"/g, ''));

  const outMp4 = path.join(outDir, 'reel_' + slug + '.mp4');
  execSync(
    `ffmpeg -y -loglevel error -i "${src}" -i "${overlay}" -t ${SECS} ` +
    `-filter_complex "[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1[bg];[bg][1:v]overlay=0:0" ` +
    `-c:v libx264 -pix_fmt yuv420p -an "${outMp4}"`,
    { stdio: 'inherit' }
  );
  const meta = {
    slug, from, to,
    url: 'https://glosx.app/hoy/',
    route: 'https://glosx.app/rutas/' + slug + '/',
    pexelsId: hit.id,
    photographer: hit.photographer,
    pexelsUrl: hit.pexelsUrl,
    file: outMp4,
  };
  fs.writeFileSync(path.join(outDir, 'reel_' + slug + '.json'), JSON.stringify(meta, null, 2));
  console.log('Listo: ' + outMp4);
}

main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
