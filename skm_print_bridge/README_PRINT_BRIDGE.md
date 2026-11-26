# SKM POS Silent Print Bridge (LAN IP Port 9100)

កម្មវិធីខ្នាតតូចនេះជួយឱ្យ **SKM POS** បោះពុម្ពវិក្កយបត្រ និងបញ្ជាផ្ទះបាយ/បារ ទៅកាន់ម៉ាស៊ីនព្រីន LAN IP (Port 9100) ដោយស្វ័យប្រវត្តិ មិនបាច់លោតផ្ទាំង Print Dialog របស់ Browser ឡើយ (មិនចាំបាច់ `npm install` ទេ)។

## របៀបប្រើលើកុំព្យូទ័រ (Windows / Mac)
1. ដំឡើង **Node.js** (https://nodejs.org — យកកំណែ LTS)។
2. ចុច ២ ដងលើឯកសារ `START_BRIDGE.bat` (ឬវាយ `node server.js` ក្នុង Terminal)។
3. ចូល **Admin Settings -> Tab 8 (ខ្នាតម៉ាស៊ីនព្រីន)**៖
   - ប្តូរ **Print Engine Mode** ទៅជា **⚡ PC Local Print Bridge**។
   - បញ្ចូល IP ម៉ាស៊ីនព្រីន Cashier (ឧ. `192.168.1.200`) និង IP ម៉ាស៊ីនព្រីនផ្ទះបាយ/បារ ក្នុងផ្នែក 8.2។
   - ចុច **🧪 សាកល្បងភ្ជាប់ Print Bridge** ដើម្បីផ្ទៀងផ្ទាត់។
4. ពេលបុគ្គលិកចុចទូទាត់លុយ ប្រព័ន្ធនឹងបាញ់វិក្កយបត្រទៅ Cashier និងបញ្ជាម្ហូបទៅផ្ទះបាយ/បារព្រមគ្នាភ្លាមៗ!
