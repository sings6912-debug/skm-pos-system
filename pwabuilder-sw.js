// pwabuilder-sw.js
const CACHE_NAME = "skm-integrate-pos-offline-v4";

// បញ្ជីឯកសារទាំងអស់ក្នុងប្រព័ន្ធដែលត្រូវរក្សាទុកសម្រាប់ប្រើប្រាស់ពេលគ្មានអ៊ីនធឺណិត (Offline Mode)
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./welcome.html",
  "./menu.html",
  "./admin_settings.html",
  "./skm_ultimate_qr_generator.html",
  "./skm_pos_52_advanced_themes.html",
  "./style.css",
  "./print.css",
  "./config.js",
  "./theme.js",
  "./auth.js",
  "./inventory.js",
  "./pos.js",
  "./finance.js",
  "./customer.js",
  "./main.js",
  "./manifest.json",
  "./logo.png"
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        FILES_TO_CACHE.map((url) => cache.add(url))
      );
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
  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  // មិនលូកដៃក្នុងការហៅទិន្នន័យទៅកាន់ Supabase ឬ Telegram API ឡើយ
  const reqUrl = evt.request.url;
  if (
    evt.request.method !== "GET" ||
    reqUrl.includes("supabase.co") ||
    reqUrl.includes("api.telegram.org")
  ) {
    return;
  }

  evt.respondWith(
    // ប្រើ ignoreSearch: true ដើម្បីឱ្យទំព័រដែលមានភ្ជាប់ ?branch=... នៅតែអាចបើក Offline បានធម្មតា
    caches.match(evt.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // ទាញយកកំណែថ្មីពីអ៊ីនធឺណិតនៅខាងក្រោយ (Stale-While-Revalidate) ប្រសិនបើមានអ៊ីនធឺណិត
        fetch(evt.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(evt.request, networkResponse.clone());
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(evt.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(evt.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          if (evt.request.mode === "navigate") {
            return caches.match("./welcome.html", { ignoreSearch: true });
          }
        });
    })
  );
});