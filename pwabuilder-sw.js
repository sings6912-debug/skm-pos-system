// pwabuilder-sw.js
// ⚡ ធ្វើបច្ចុប្បន្នភាពទៅ v6 ដើម្បីបង្ខំឱ្យ Browser សម្អាត Cache ចាស់ៗចោល
const CACHE_NAME = "skm-integrate-pos-offline-v6";

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
  "./logo.png",
  "./logo1.png"
];

// ១. ដំណាក់កាល Install: ដោនឡូដ និងផ្ទុកឯកសារទាំងអស់ចូល Cache
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        FILES_TO_CACHE.map((url) => cache.add(url))
      );
    })
  );
  // បង្ខំឱ្យ Service Worker ថ្មីចូលកាន់តំណែងភ្លាមៗដោយមិនបាច់រង់ចាំបិទ Tab
  self.skipWaiting();
});

// ២. ដំណាក់កាល Activate: លុប Cache កំណែចាស់ៗចោលទាំងអស់
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("🧹 កំពុងលុប Cache ចាស់:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // គ្រប់គ្រងគ្រប់ផ្ទាំងទំព័រទាំងអស់ភ្លាមៗ
  self.clients.claim();
});

// ៣. ដំណាក់កាល Fetch: ប្រើប្រាស់យុទ្ធសាស្ត្រ Network-First (ទាញពី Server មុន បើដាច់ Network ទើបប្រើ Cache)
self.addEventListener("fetch", (evt) => {
  const reqUrl = evt.request.url;

  // មិនលូកដៃក្នុងការហៅទិន្នន័យទៅកាន់ Supabase ឬ Telegram API ឡើយ
  if (
    evt.request.method !== "GET" ||
    reqUrl.includes("supabase.co") ||
    reqUrl.includes("api.telegram.org")
  ) {
    return;
  }

  evt.respondWith(
    // 🌐 ជំហានទី ១៖ ព្យាយាមទាញយកឯកសារថ្មីពី Network ជាមុនសិន
    fetch(evt.request)
      .then((networkResponse) => {
        // ប្រសិនបើទាញយកពី Network ជោគជ័យ ត្រូវ Update ឯកសារថ្មីនេះចូលក្នុង Cache ភ្លាមៗ
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(evt.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // 📴 ជំហានទី ២៖ ប្រសិនបើដាច់អ៊ីនធឺណិត (Offline) ទើបទាញយកឯកសារពី Cache មកប្រើ
        return caches.match(evt.request, { ignoreSearch: true }).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // ប្រសិនបើរុករកទំព័រផ្សេងមិនឃើញពេល Offline ត្រូវបញ្ជូនទៅ welcome.html
          if (evt.request.mode === "navigate") {
            return caches.match("./welcome.html", { ignoreSearch: true });
          }
        });
      })
  );
});