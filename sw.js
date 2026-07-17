// Cache-Version hochgezählt (v1 -> v2): beim Aktivieren wird der alte Cache
// geleert, damit keine veraltete index.html hängen bleibt.
const CACHE_NAME = 'peakpath-cache-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Die Seite selbst (HTML-Navigation): zuerst aus dem Netz. So sieht man nach
  // einem Update sofort die neueste Version, statt eine Version hinterherzuhängen.
  // Nur wenn offline, aus dem Cache – die App bleibt also offline nutzbar.
  const istSeitenaufruf = event.request.mode === 'navigate' || event.request.destination === 'document';
  if (istSeitenaufruf) {
    // cache:'no-store' umgeht den HTTP-Cache des Browsers. Ohne das würde fetch()
    // eine vom Browser zwischengespeicherte alte Seite liefern – und man hinge trotz
    // "Netz zuerst" weiter eine Version hinterher.
    event.respondWith(
      fetch(event.request.url, { cache: 'no-store' })
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(event.request).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  // Übrige Dateien (Icons, Manifest): sofort aus dem Cache, im Hintergrund
  // aktualisieren. Ändern sich selten, müssen nicht auf das Netz warten.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
