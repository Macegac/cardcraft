/* Cardcraft service worker.
   The app shell is tiny and fully static, so: cache it on install, serve it from
   cache, and refresh it in the background. Card data lives in IndexedDB and is
   never touched here. OpenRouter calls always go to the network. */
const VERSION = 'gcs-v5';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())   // a missing optional file must not block install
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if(e.data === 'skip-waiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;

  const url = new URL(req.url);
  // Never cache the model list or completions — and never let a stale key response linger.
  if(url.hostname.endsWith('openrouter.ai')) return;

  // Navigations: serve the cached shell instantly, refresh it behind the scenes.
  if(req.mode === 'navigate'){
    e.respondWith(
      caches.match('./index.html').then(hit => {
        const net = fetch(req).then(res => {
          if(res && res.ok) caches.open(VERSION).then(c => c.put('./index.html', res.clone()));
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // Same-origin assets: cache-first, fill on miss.
  if(url.origin === location.origin){
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if(res && res.ok && res.type === 'basic'){
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
        }
        return res;
      }))
    );
    return;
  }

  // Cross-origin (Google Fonts): cache opportunistically so offline keeps the typeface.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => hit))
  );
});
