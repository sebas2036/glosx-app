#!/usr/bin/env node
/**
 * Aplica el logo nuevo (propuesta A: la W como vía con tres estaciones) al enlace .nav-logo.
 * Uso: node scripts/apply-logo.js archivo1.html [archivo2.html ...]   |   --all
 * Es idempotente: si el enlace ya tiene el logo nuevo no lo toca.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const ICON = '<svg class="wt-logo-icon" width="30" height="30" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="10" fill="#C10016"/><polyline points="8,12 15,29 20,18 25,29 32,12" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="12" r="2.6" fill="#fff"/><circle cx="20" cy="18" r="2.6" fill="#fff"/><circle cx="32" cy="12" r="2.6" fill="#fff"/></svg>';
const A_STYLE = 'display:inline-flex;align-items:center;gap:10px;text-decoration:none;margin-right:12px;flex-shrink:0;';
const W_STYLE = 'font-size:clamp(17px,4.6vw,22px);line-height:1;letter-spacing:-.04em;color:#14151a;white-space:nowrap;';
const MARKUP = href => `<a href="${href}" class="nav-logo wt-logo" aria-label="WoW Train" style="${A_STYLE}">${ICON}<span class="wt-logo-word" style="${W_STYLE}"><b style="font-weight:700;">WoW</b> <i style="font-style:normal;font-weight:300;">Train</i></span></a>`;

function walk(dir, out) {
  for (const f of fs.readdirSync(dir)) {
    if (f === 'node_modules' || f === '.git') continue;
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}

module.exports = { MARKUP };
if (require.main !== module) return;
const args = process.argv.slice(2);
const files = args.includes('--all') ? walk(ROOT, []) : args.map(a => path.resolve(a));
const re = /<a\s+[^>]*class="nav-logo(?: wt-logo)?"[^>]*>[\s\S]*?<\/a>/g;
let changed = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  if (!/class="nav-logo/.test(src)) continue;
  const out = src.replace(re, m => {
    const href = (m.match(/href="([^"]*)"/) || [, '/'])[1];
    return MARKUP(href);
  });
  if (out !== src) { fs.writeFileSync(f, out); changed++; }
}
console.log('Archivos actualizados:', changed);
