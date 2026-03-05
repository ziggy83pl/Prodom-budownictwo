// service-worker.js
const CACHE_NAME = 'prodom-cache-v10';
const urlsToCache = [
'./',
'./index.html',
'./style.css',
'./script.js',
'./manifest.json',
'./logo/icon-192.png',
'./logo/icon-512.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Wymuś natychmiastową aktywację nowego SW
event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => cache.addAll(urlsToCache))
);
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Przejmij kontrolę nad otwartymi stronami od razu
    );
});

self.addEventListener('fetch', (event) => {
    // Ignoruj żądania inne niż GET (np. POST do formularzy)
    if (event.request.method !== 'GET') {
        return;
    }

    // Strategia: Network First (Najpierw sieć, potem cache)
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Jeśli pobranie się uda, zaktualizuj cache na przyszłość
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Jeśli brak internetu, użyj cache
                return caches.match(event.request);
            })
    );
});


