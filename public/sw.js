const CACHE = "eterni-v7-3";

const ROOT_ASSETS = [
  "/",
  "/index.html",
  "/styles.css?v=7.3",
  "/script.js?v=7.3",
  "/manifest.webmanifest",
  "/logo-eterni.png",
  "/guadalupe-omar.webp",
  "/guadalupe-omar-mobile.webp",
  "/cuentos-para-sanar.webp",
  "/la-mujer-del-faro.webp",
  "/taller-la-mujer-del-faro.webp",
  "/webinar-cuentos-para-sanar.webp",
  "/curso-legado.webp",
  "/comunidad-ixchel.webp",
  "/logo-ixchel.png",
  "/podcast-la-voz-del-faro.webp",
  "/podcast-cuentos-para-sanar.webp",
  "/academia-eterni.webp",
  "/guadalupe.webp",
  "/omar.webp"
];

const WEBINAR_ASSETS = [
  "/webinar-la-mujer-del-faro/",
  "/webinar-la-mujer-del-faro/index.html",
  "/webinar-la-mujer-del-faro/styles.css",
  "/webinar-la-mujer-del-faro/script.js"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      for (const asset of [...ROOT_ASSETS, ...WEBINAR_ASSETS]) {
        try {
          await cache.add(asset);
        } catch (_) {
          // The webinar folder can be deployed separately; do not fail install.
        }
      }
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  const requestUrl = new URL(event.request.url);
  // El CRM privado no se almacena ni se sirve desde caché del sitio público.
  if (/(?:^|\/)(?:panel|academia-guadalupe)(?:\/|$)/.test(requestUrl.pathname)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        if (
          requestUrl.pathname === "/webinar-la-mujer-del-faro" ||
          requestUrl.pathname.startsWith("/webinar-la-mujer-del-faro/")
        ) {
          return (
            (await caches.match("/webinar-la-mujer-del-faro/index.html")) ||
            Response.error()
          );
        }

        if (requestUrl.pathname === "/" || requestUrl.pathname === "/index.html") {
          return (await caches.match("/index.html")) || Response.error();
        }

        return (
          (await caches.match(event.request)) ||
          (await caches.match("/404.html")) ||
          Response.error()
        );
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
