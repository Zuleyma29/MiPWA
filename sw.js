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

// 4. FETCH -> aquí agregamos la excepción para login.html
self.addEventListener("fetch", event => {
    const requestUrl = new URL(event.request.url);

    // Si la URL termina con login.html
    if (requestUrl.pathname.endsWith('/login.html')) {
        event.respondWith(
            // Intentar ir a la red siempre
            fetch(event.request).catch(() => caches.match("offline.html"))
        );
        return; // Importante para que no pase a la siguiente parte
    }

    // Comportamiento normal para todo lo demás
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