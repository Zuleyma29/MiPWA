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

// 4. FETCH -> intercepta peticiones de la app
// Intercepta cada petición de la PWA
// Buscar primero en caché
// Si no está, busca en Internet
// En caso de falla, muestra la página offline.html
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});


// 5. PUSH -> notificaciones en segundo plano
// Manejo de notificaciones push (opcional)
self.addEventListener("push", event => {
  const data = event.data ? event.data.text() : "Notificación sin texto";
  event.waitUntil(
    self.registration.showNotification("Mi PWA", { body: data })
  );
});