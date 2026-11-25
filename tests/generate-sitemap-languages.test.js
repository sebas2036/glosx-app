const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..');
const LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'];
const HREFLANG = { zh: 'zh-Hans' };
const suffix = (lang) => lang === 'en' ? '/' : `/${lang}/`;

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'glosx-sitemap-test-'));
  fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(root, 'rutas', 'sample'), { recursive: true });
  fs.copyFileSync(
    path.join(REPO_ROOT, 'scripts', 'generate-sitemap.js'),
    path.join(root, 'scripts', 'generate-sitemap.js')
  );

  for (const lang of LANGS) {
    const routeDir = lang === 'en'
      ? path.join(root, 'rutas', 'sample')
      : path.join(root, 'rutas', 'sample', lang);
    const hoyDir = lang === 'en'
      ? path.join(root, 'hoy')
      : path.join(root, lang, 'hoy');
    const hubDir = lang === 'en'
      ? path.join(root, 'rutas')
      : path.join(root, lang, 'rutas');
    fs.mkdirSync(routeDir, { recursive: true });
    fs.mkdirSync(hoyDir, { recursive: true });
    fs.mkdirSync(hubDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), `<html lang="${lang}"><title>Sample route</title></html>`);
    fs.writeFileSync(path.join(hoyDir, 'index.html'), `<html lang="${lang}"><title>Today</title></html>`);
    fs.writeFileSync(path.join(hubDir, 'index.html'), `<html lang="${lang}"><title>Routes</title></html>`);
  }

  fs.writeFileSync(
    path.join(root, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
      'xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
      '<url><loc>https://glosx.app/</loc><lastmod>2026-11-20</lastmod></url>' +
      '</urlset>'
  );
  return root;
}

function urlBlocks(xml) {
  return [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)].map((match) => match[0]);
}

function urlsFor(blocks, prefix) {
  return blocks
    .map((block) => block.match(/<loc>([^<]+)<\/loc>/)?.[1])
    .filter((url) => url && url.startsWith(prefix));
}

test('sitemap regeneration retains every existing route locale and hreflang', (t) => {
  const root = makeFixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const result = spawnSync('node', ['scripts/generate-sitemap.js'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const blocks = urlBlocks(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8'));
  const routePrefix = 'https://glosx.app/rutas/sample';
  assert.deepEqual(
    urlsFor(blocks, routePrefix).sort(),
    LANGS.map((lang) => `https://glosx.app/rutas/sample${suffix(lang)}`).sort()
  );

  const routeBlock = blocks.find((block) => block.includes('<loc>https://glosx.app/rutas/sample/</loc>'));
  const advertisedLangs = [...routeBlock.matchAll(/hreflang="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(
    advertisedLangs.filter((lang) => lang !== 'x-default').sort(),
    LANGS.map((lang) => HREFLANG[lang] || lang).sort()
  );
});

test('sitemap regeneration retains every existing localized Hoy page', (t) => {
  const root = makeFixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const result = spawnSync('node', ['scripts/generate-sitemap.js'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const blocks = urlBlocks(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8'));
  const hoyUrls = blocks
    .map((block) => block.match(/<loc>([^<]+)<\/loc>/)?.[1])
    .filter((url) => url && /(?:^|\/)hoy\/$/.test(new URL(url).pathname));
  assert.deepEqual(
    hoyUrls.sort(),
    LANGS.map((lang) => `https://glosx.app${suffix(lang)}hoy/`).sort()
  );

  const hoyBlock = blocks.find((block) => block.includes('<loc>https://glosx.app/hoy/</loc>'));
  const advertisedLangs = [...hoyBlock.matchAll(/hreflang="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(
    advertisedLangs.filter((lang) => lang !== 'x-default').sort(),
    LANGS.map((lang) => HREFLANG[lang] || lang).sort()
  );
});

test('sitemap regeneration retains every existing localized route index', (t) => {
  const root = makeFixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const result = spawnSync('node', ['scripts/generate-sitemap.js'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const blocks = urlBlocks(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8'));
  const hubUrls = blocks
    .map((block) => block.match(/<loc>([^<]+)<\/loc>/)?.[1])
    .filter((url) => url && /(?:^|\/)rutas\/$/.test(new URL(url).pathname));
  assert.deepEqual(
    hubUrls.sort(),
    LANGS.map((lang) => `https://glosx.app${suffix(lang)}rutas/`).sort()
  );

  const hubBlock = blocks.find((block) => block.includes('<loc>https://glosx.app/rutas/</loc>'));
  const advertisedLangs = [...hubBlock.matchAll(/hreflang="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(
    advertisedLangs.filter((lang) => lang !== 'x-default').sort(),
    LANGS.map((lang) => HREFLANG[lang] || lang).sort()
  );
});
