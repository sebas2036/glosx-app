#!/usr/bin/env node
/**
 * Servidor local para el botón "ARMAR CAMPAÑA".
 * Levanta una página en http://localhost:4747 con un botón grande.
 * Al tocarlo, corre armar-campana.js (texto + reel) y muestra el resultado
 * en la misma página. Todo corre en tu Mac, nada sale a internet salvo lo
 * que el propio armar-campana.js hace (bajar fotos de Pexels, y a futuro
 * publicar en Metricool/Pinterest si los tokens están cargados).
 *
 * Uso: node scripts/promo/server.js
 * Después abrí http://localhost:4747 en el navegador (se abre solo).
 */
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const PORT = 4747;
const PUBLIC_DIR = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf8'));
    return;
  }

  if (req.method === 'POST' && req.url.startsWith('/armar-campana')) {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const n = url.searchParams.get('n') || '5';

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' });

    const child = spawn('node', [path.join(__dirname, 'armar-campana.js'), n], { cwd: __dirname });
    child.stdout.on('data', (chunk) => res.write(chunk));
    child.stderr.on('data', (chunk) => res.write(chunk));
    child.on('close', () => res.end());
    return;
  }

  if (req.method === 'POST' && req.url === '/actualizar-cola') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    const child = spawn('node', [path.join(__dirname, 'build-content-queue.js')], { cwd: __dirname });
    let out = '';
    child.stdout.on('data', (c) => (out += c));
    child.on('close', () => res.end(out));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n🚂 Panel de promoción glosx.app corriendo en http://localhost:${PORT}\n`);
  console.log('Dejá esta ventana abierta mientras usás el botón. Cerrala para apagar el panel.\n');
  const openCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${openCmd} http://localhost:${PORT}`);
});
