# SKM POS — កម្មវិធីលើកុំព្យូទ័រ (PC Desktop App for Windows / macOS)

ថត `skm_pc_app/` នេះប្រែក្លាយ **SKM POS** ទៅជាកម្មវិធីកុំព្យូទ័រពេញលេញ (ដូច App POS ជំនាញៗ) ដែលមានបង្កប់ស្រាប់នូវ៖
- 🖨️ **Silent Printing លើម៉ាស៊ីនព្រីន USB / Windows ផ្ទាល់** (ស្គាល់អក្សរខ្មែរ, Logo, Bakong KHQR ១០០% ដោយមិនលោតផ្ទាំង Print Dialog)
- 🍳 **Silent Multi-Printer LAN IP (Port 9100)** បាញ់ទៅផ្ទះបាយ/បារ/Cashier ព្រមគ្នា និងបើកថតលុយអូតូ
- 🖥️ **បើកអេក្រង់ទី ២ (`display.html`) ពេញអេក្រង់លើ Monitor ទី ២** ស្វ័យប្រវត្តិ (`Ctrl + D`)
- 👨‍🍳 **បើកអេក្រង់ផ្ទះបាយ (`kds.html`)** ក្នុងផ្ទាំងដាច់ដោយឡែក (`Ctrl + K`)

---

## ជម្រើសទី ១៖ បើកប្រើភ្លាមៗក្នុង ៣ វិនាទី (មិនបាច់ `npm install` ទេ!)
1. ដំឡើង **Node.js LTS** (https://nodejs.org) តែម្តងគត់។
2. ចុច ២ ដងលើ **`LAUNCH_INSTANT_PC_APP.bat`**។
3. កម្មវិធីនឹងបើកជាផ្ទាំង PC App ពេញអេក្រង់ គ្មានរបារ URL ហើយបើក Silent Printing (`--kiosk-printing`) និង LAN Print Bridge ស្វ័យប្រវត្តិ!

## ជម្រើសទី ២៖ បើកជា Electron Desktop App ពេញលេញ (មាន Menu Bar + រើស USB Printer តាមឈ្មោះ)
1. ចុច ២ ដងលើ **`RUN_PC_APP.bat`** (លើកដំបូងវានឹងទាញយក Electron ស្វ័យប្រវត្តិប្រហែល ១–២ នាទី)។
2. ចូល **Admin Settings → Tab 8.2** ➔ ជ្រើសរើស **🖥️ PC Desktop App Silent (USB & Windows Printer)** ហើយចុច **🔍 ស្វែងរកម៉ាស៊ីនព្រីនលើ PC** ដើម្បីរើសម៉ាស៊ីនព្រីន Cashier / ផ្ទះបាយ / បារ ដោយផ្ទាល់!

## ជម្រើសទី ៣៖ បង្កើតឯកសារដំឡើង Windows `.exe` យកទៅដំឡើងឱ្យហាងភ្ញៀវ (Setup.exe & Portable.exe)
1. ចុច ២ ដងលើ **`BUILD_WINDOWS_EXE.bat`**។
2. រង់ចាំ ២–៣ នាទី អ្នកនឹងទទួលបានឯកសារ៖
   - `skm_pc_app/dist/SKM POS Setup 31.0.0.exe` (សម្រាប់ដំឡើងលើកុំព្យូទ័រភ្ញៀវ មាន Icon លើ Desktop ស្វ័យប្រវត្តិ)
   - `skm_pc_app/dist/SKM POS 31.0.0.exe` (Portable ចុចបើកដើរភ្លាម មិនបាច់ដំឡើង)
   *(ពេល Build ចេញ `.exe` ហើយ កុំព្យូទ័រភ្ញៀវមិនចាំបាច់ដំឡើង Node.js ទៀតទេ!)*
