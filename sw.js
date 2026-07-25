const CACHE_VERSION = 'v2';
const CACHE_NAME = `glosx-static-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/assets/css/main.min.css',
  '/assets/js/main.min.js',
  '/logo.png',
  '/apple-touch-icon.png',
  '/hero-bg.webp',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML/navigation: network-first, so content updates show immediately.
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: stale-while-revalidate — sirve la version cacheada al
  // instante, pero siempre pide una fresca en paralelo y la guarda para la
  // proxima carga. Con cache-first puro (como estaba antes) un CSS/JS
  // cacheado una vez quedaba pegado para siempre, sin importar cuantos
  // deploys nuevos hubiera en el servidor.
  if (/\.(css|js|png|jpg|jpeg|webp|svg|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request)
            .then((response) => {
              cache.put(request, response.clone());
              return response;
            })
            .catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
  }
});
