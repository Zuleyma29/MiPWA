// Estructura básica  de un Service Worker


// 1. Nombre del caché y archivos a cachear
const CACHE_NAME = "mi-cache-v1";

const urlsToCache = [
    "index.html",
    "offline.html",
    "manifest.json",
    "./icons/192x192.png",
    "./icons/512x512.png"
];

// 2. INSTALLAR -> se ejecuta al instalar un Service Worker (SW)
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache=> cache.addAll(urlsToCache))
    );
});


// 3. ACTIVATE -> se ejecuta al activarse (limpia cachés viejas)
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys=>
            Promise.all(
                keys.filter(key=>key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
});

// 4.FETCH -> se ejecuta cada vez que se haga una petición al servidor
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});