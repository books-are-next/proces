/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-3792b27';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./index.html","./manifest.json","./favicon.png","./proces_003.html","./proces_005.html","./proces_006.html","./proces_007.html","./proces_004.html","./proces_008.html","./proces_009.html","./proces_010.html","./proces_012.html","./proces_013.html","./proces_014.html","./proces_011.html","./proces_015.html","./proces_016.html","./proces_017.html","./proces_018.html","./proces_019.html","./proces_020.html","./proces_021.html","./proces_022.html","./proces_023.html","./proces_024.html","./proces_025.html","./proces_026.html","./scripts/bundle.js","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
