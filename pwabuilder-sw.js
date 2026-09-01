const CACHE_NAME = "pwabuilder-offline-v2";

// ដាក់បញ្ចូលរាល់ Files សំខាន់ៗទាំងអស់ដែលត្រូវប្រើពេលអត់អ៊ីនធឺណិត (ឈ្មោះដើមត្រឹមត្រូវ)
const FILES_TO_CACHE = [
  "/", 
  "/index.html", 
  "/welcome.html", 
  "/menu.html", 
  "/style.css", 
  "/print.css", 
  "/config.js", 
  "/theme.js", 
  "/auth.js", 
  "/inventory.js", 
  "/pos.js", 
  "/finance.js", 
  "/customer.js", 
  "/main.js", 
  "/manifest.json"
]; 

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
  evt.respondWith(
    caches.match(evt.request).then((cachedResponse) => {
      // បើមានក្នុង Cache គឺយកចេញមកប្រើ
      if (cachedResponse) {
        return cachedResponse;
      }
      // បើគ្មានក្នុង Cache ទើបទៅទាញពី Network
      return fetch(evt.request).catch(() => {
        // បើ Offline ហើយរក file អត់ឃើញ ឱ្យវាបង្ហាញ welcome.html ទំព័រ ជំនួសសម្រាប់ Navigation
        if (evt.request.mode === 'navigate') {
          return caches.match("/welcome.html");
        }
      });
    })
  );
});