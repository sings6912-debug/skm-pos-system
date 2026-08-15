// នេះគឺជា Service Worker ស្តង់ដាររបស់ PWABuilder
const CACHE_NAME = "pwabuilder-offline-v1";
const FILES_TO_CACHE = ["/", "/index.html", "/style.css", "/script.js"]; // កែឈ្មោះ File ផ្សេងៗទៀតប្រសិនបើមាន

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.claimClients();
});

self.addEventListener("fetch", (evt) => {
  if (evt.request.mode !== "navigate") {
    return;
  }
  evt.respondWith(
    fetch(evt.request).catch(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match("index.html");
      });
    })
  );
});