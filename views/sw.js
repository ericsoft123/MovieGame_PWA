
  const cacheName = 'pwa-conf-v1';
const staticAssets = [
  './',
  './js/app.js',
  './js/main.js',
  './js/socket.io.js',
  './css/style.min.css',
  './img/icons/favicon.png',
  './audio/loose.mp3',
  './audio/win.mp3',
  './audio/gameover.mp3',
];
self.addEventListener('install', async event => {
    const cache = await caches.open(cacheName); 
    await cache.addAll(staticAssets); 
  });


  self.addEventListener('fetch', event => {
    const req = event.request;
  
    if (/.*(json)$/.test(req.url)) {
      event.respondWith(networkFirst(req));
    } else {
      event.respondWith(cacheFirst(req));
    }
  });

  async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try { 
      const fresh = await fetch(req);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (e) { 
      const cachedResponse = await cache.match(req);
      return cachedResponse;
    }
  }

  async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(req);
    return cachedResponse || networkFirst(req);
  }