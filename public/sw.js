const CACHE_NAME = "episode-tracker-cache-v1";
const ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
  "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
];

// Install Event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(err => console.log("Caching assets failed: ", err));
    })
  );
});

// Activate Event
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch Event
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isCdn = url.hostname.includes("fonts.googleapis.com") ||
                url.hostname.includes("fonts.gstatic.com") ||
                url.hostname.includes("cdn.jsdelivr.net");

  if (isSameOrigin || isCdn) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(e.request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }

            // Cache same-origin assets (except TVmaze or dev proxy paths) and CDNs
            if ((isSameOrigin && !url.pathname.includes("/api/")) || isCdn) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(e.request, responseToCache);
              });
            }

            return response;
          })
          .catch(() => {
            // Offline fallback
          });
      })
    );
  }
});
