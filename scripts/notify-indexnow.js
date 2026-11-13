#!/usr/bin/env node
// Avisa a IndexNow (Bing, Yandex, Seznam, Naver...) de URLs nuevas o cambiadas.
// Uso: node scripts/notify-indexnow.js            -> todas las URLs del sitemap
//      node scripts/notify-indexnow.js --file x.txt -> una URL por línea
// La clave es pública por diseño (se publica en https://glosx.app/<clave>.txt).
const fs = require('fs');
const path = require('path');
const KEY = '011aa372f14103f2943a470f94dd15c4';
const HOST = 'glosx.app';
const root = path.join(__dirname, '..');

function fromSitemap() {
  const files = fs.readdirSync(root).filter(f => /^sitemap.*\.xml$/.test(f));
  const urls = new Set();
  for (const f of files) {
    const xml = fs.readFileSync(path.join(root, f), 'utf8');
    for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) if (m[1].includes(HOST) && !m[1].endsWith('.xml')) urls.add(m[1]);
  }
  return [...urls];
}

async function main() {
  const i = process.argv.indexOf('--file');
  const urls = i > -1
    ? fs.readFileSync(process.argv[i + 1], 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    : fromSitemap();
  let ok = 0;
  for (let k = 0; k < urls.length; k += 10000) {
    const urlList = urls.slice(k, k + 10000);
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
    });
    console.log(`Lote ${k / 10000 + 1}: ${urlList.length} URLs -> HTTP ${res.status} ${res.status === 200 || res.status === 202 ? 'OK' : await res.text()}`);
    if (res.status === 200 || res.status === 202) ok += urlList.length;
  }
  console.log(`Listo: ${ok} de ${urls.length} URLs avisadas a IndexNow.`);
}
main().catch(e => { console.error(e); process.exit(1); });
