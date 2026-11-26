# របៀបប្រើ SKM POS ជា App លើ Android / iOS / Windows

SKM POS v31 Pro ដំណើរការបានទាំង **Web** និង **App** ដោយមាន ៣ វិធីងាយស្រួល៖

## វិធីទី ១៖ ដំឡើងជា App ភ្លាមៗក្នុង ១ ចុច (PWA Standalone — ឥតគិតថ្លៃ ប្រើបានទាំង Android, iPhone, PC)
- បើកវេបសាយ SKM POS លើ Chrome (Android/PC) ឬ Safari (iPhone)។
- ចុចប៊ូតុង **📲 ដំឡើង App** លើរបារខាងលើ (អាចបិទ/បើកប៊ូតុងនេះក្នុង **Admin Settings -> Tab 9.4**)។
- App នឹងលោតលើអេក្រង់ដើមដូច App ពិតប្រាកដ ពេញអេក្រង់ គ្មានរបារ URL និងដើរបានពេលដាច់អ៊ីនធឺណិត។

## វិធីទី ២៖ បំលែងជាឯកសារ `.apk` ក្នុង ២ នាទី (ដោយមិនបាច់សរសេរកូដ)
1. Upload កូដក្នុង ZIP នេះទៅលើ **GitHub Pages** (ឬ Hosting HTTPS របស់អ្នក)។
2. ចូលវេបសាយ **https://www.pwabuilder.com**។
3. ដាក់តំណភ្ជាប់វេបសាយ SKM POS របស់អ្នក -> ចុច **Start** -> ចុច **Package for Stores** -> ជ្រើសរើស **Android** -> ទាញយកឯកសារ **APK** ដំឡើងលើទូរស័ព្ទ/Tablet ភ្លាម!

## វិធីទី ៣៖ Build APK ផ្ទាល់ដោយប្រើ Capacitor & Android Studio
1. ចូលក្នុងថត `skm_android_app/` ហើយរត់ពាក្យបញ្ជា៖
   ```bash
   npm install
   npx cap add android
   npx cap sync android
   npx cap open android
   ```
2. ក្នុង Android Studio ចុច **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**។

## 🖨️ សម្រាប់ Silent Print លើ Android App (Bluetooth / LAN Thermal Printer)
1. ដំឡើង App **RawBT Print Service** ពី Google Play Store ហើយភ្ជាប់ម៉ាស៊ីនព្រីន Bluetooth ឬ Wi-Fi/LAN របស់អ្នក។
2. ចូល **Admin Settings -> Tab 8.2** ហើយជ្រើសរើស **📱 Android App / RawBT**។
3. ពេលគិតលុយលើទូរស័ព្ទ/Tablet វិក្កយបត្រនឹងបាញ់ព្រីនភ្លាមៗដោយស្វ័យប្រវត្តិ!
