#!/usr/bin/env node
/**
 * Bing Webmaster API para glosx.app. La clave se lee de ~/.config/glosx/bing-api-key (o env BING_API_KEY),
 * solo se envía a ssl.bing.com y nunca se imprime.
 * Uso:
 *   node scripts/bing-webmaster.js stats          tráfico por día (clics e impresiones)
 *   node scripts/bing-webmaster.js queries [n]    consultas con más impresiones
 *   node scripts/bing-webmaster.js pages [n]      páginas con más impresiones
 *   node scripts/bing-webmaster.js crawl          rastreo (páginas rastreadas, errores, en índice)
 *   node scripts/bing-webmaster.js quota          cupo diario de envío de URLs
 *   node scripts/bing-webmaster.js settings       ajustes de rastreo (solo lectura)
 *   node scripts/bing-webmaster.js submit --file lista.txt   envía URLs (una por línea), respetando el cupo
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const SITE = 'https://glosx.app/';
const BASE = 'https://ssl.bing.com/webmaster/api.svc/json/';
const keyFile = path.join(os.homedir(), '.config/glosx/bing-api-key');
const KEY = (process.env.BING_API_KEY || (fs.existsSync(keyFile) ? fs.readFileSync(keyFile, 'utf8') : '')).trim();
if (!KEY) { console.error('Falta la clave en ~/.config/glosx/bing-api-key'); process.exit(1); }

const hide = s => String(s).split(KEY).join('***');
async function call(method, params = {}, body) {
  const qs = new URLSearchParams({ apikey: KEY, siteUrl: SITE, ...params });
  const res = await fetch(BASE + method + '?' + qs, body
    ? { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) }
    : {});
  const txt = await res.text();
  if (!res.ok) throw new Error(`${method} -> HTTP ${res.status}: ${hide(txt).slice(0, 300)}`);
  const j = txt ? JSON.parse(txt) : {};
  return j.d !== undefined ? j.d : j;
}
// Bing devuelve fechas como "/Date(1731456000000-0800)/"
const day = v => { const m = /\/Date\((\d+)/.exec(v || ''); return m ? new Date(+m[1]).toISOString().slice(0, 10) : v; };
const pad = (s, n) => String(s).padEnd(n).slice(0, n);

(async () => {
  const [cmd = 'stats', arg, arg2] = process.argv.slice(2);
  if (cmd === 'stats') {
    const rows = (await call('GetRankAndTrafficStats')) || [];
    let c = 0, i = 0;
    rows.sort((a, b) => day(a.Date).localeCompare(day(b.Date))).forEach(r => { c += r.Clicks; i += r.Impressions; console.log(day(r.Date), 'clics', String(r.Clicks).padStart(4), ' impresiones', String(r.Impressions).padStart(6)); });
    console.log(`TOTAL (${rows.length} días): ${c} clics, ${i} impresiones`);
  } else if (cmd === 'queries' || cmd === 'pages') {
    const n = +arg || 25;
    const rows = (await call(cmd === 'queries' ? 'GetQueryStats' : 'GetPageStats')) || [];
    const agg = {};
    rows.forEach(r => { const k = r.Query; const a = agg[k] || (agg[k] = { c: 0, i: 0, p: 0, w: 0 }); a.c += r.Clicks; a.i += r.Impressions; a.p += (r.AvgImpressionPosition || 0) * r.Impressions; a.w += r.Impressions; });
    Object.entries(agg).sort((a, b) => b[1].i - a[1].i).slice(0, n).forEach(([k, a]) =>
      console.log(pad(k, 70), 'impr', String(a.i).padStart(5), ' clics', String(a.c).padStart(3), ' pos', a.w ? (a.p / a.w).toFixed(1) : '-'));
    console.log(`(${Object.keys(agg).length} ${cmd === 'queries' ? 'consultas' : 'páginas'} en total)`);
  } else if (cmd === 'crawl') {
    const rows = (await call('GetCrawlStats')) || [];
    rows.sort((a, b) => day(a.Date).localeCompare(day(b.Date))).slice(-14).forEach(r =>
      console.log(day(r.Date), 'rastreadas', String(r.CrawledPages).padStart(5), ' errores', String(r.CrawlErrors).padStart(4), ' en índice', String(r.InIndex).padStart(6), ' bloqueadas robots', r.BlockedByRobotsTxt));
  } else if (cmd === 'settings') {
    const r = await call('GetCrawlSettings');
    console.log(JSON.stringify(r, null, 1).slice(0, 1500));
  } else if (cmd === 'quota') {
    const q = await call('GetUrlSubmissionQuota');
    console.log('Cupo diario restante:', q.DailyQuota, '· mensual:', q.MonthlyQuota);
  } else if (cmd === 'submit') {
    if (arg !== '--file' || !arg2) { console.error('Uso: submit --file lista.txt'); process.exit(1); }
    const urls = fs.readFileSync(arg2, 'utf8').split('\n').map(s => s.trim()).filter(u => u.startsWith(SITE));
    const q = await call('GetUrlSubmissionQuota');
    const send = urls.slice(0, q.DailyQuota);
    for (let k = 0; k < send.length; k += 500) await call('SubmitUrlBatch', {}, { siteUrl: SITE, urlList: send.slice(k, k + 500) });
    console.log(`Enviadas ${send.length} de ${urls.length} (cupo diario era ${q.DailyQuota}).`);
    // la cola queda solo con lo que falta enviar (las aceptadas salen del archivo)
    if (send.length) { fs.writeFileSync(arg2, urls.slice(send.length).join('\n') + (urls.length > send.length ? '\n' : '')); console.log(`Cola actualizada: quedan ${urls.length - send.length} en ${arg2}`); }
  } else if (cmd === 'prune') {
    // Consulta GetUrlInfo (solo lectura) por cada URL y saca de la lista las que Bing ya rastreó (LastCrawledDate + HTTP 200).
    if (arg !== '--file' || !arg2) { console.error('Uso: prune --file lista.txt [--dry] [--limit N]'); process.exit(1); }
    const dry = process.argv.includes('--dry');
    const li = process.argv.indexOf('--limit'); const lim = li > 0 ? +process.argv[li + 1] : Infinity;
    const urls = fs.readFileSync(arg2, 'utf8').split('\n').map(s => s.trim()).filter(u => u.startsWith(SITE));
    const todo = urls.slice(0, lim), known = new Set(); let errs = 0, k = 0;
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const worker = async () => { while (k < todo.length) { const u = todo[k++]; let ok = false;
      for (let t = 0; t < 6 && !ok; t++) { try {
        const r = await call('GetUrlInfo', { url: u }); ok = true;
        if (r && r.LastCrawledDate && day(r.LastCrawledDate) > '2000') known.add(u);
      } catch (e) { await sleep(2000 * (t + 1)); } }
      if (!ok) errs++;
      await sleep(400); if (k % 100 === 0) console.log(`... ${k}/${todo.length} (ya rastreadas: ${known.size})`); } };
    await Promise.all(Array.from({ length: 2 }, worker));
    console.log(`Revisadas ${todo.length}: ya rastreadas por Bing ${known.size}, sin rastrear ${todo.length - known.size - errs}, errores ${errs}.`);
    if (!dry) { fs.writeFileSync(arg2, urls.filter(u => !known.has(u)).join('\n') + '\n'); console.log(`Lista actualizada: quedan ${urls.length - known.size} en ${arg2}`); }
  } else {
    console.error('Comando desconocido:', cmd); process.exit(1);
  }
})().catch(e => { console.error(hide(e.message)); process.exit(1); });
