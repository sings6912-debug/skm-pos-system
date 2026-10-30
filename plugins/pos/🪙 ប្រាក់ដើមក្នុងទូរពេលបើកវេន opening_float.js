(function() {
    console.log("🪙 POS Opening Float Plugin Initialized!");

    // ១. មុខងារទាញយកឈ្មោះអ្នកប្រើប្រាស់បច្ចុប្បន្ន (សម្រាប់តាមដានអ្នកបញ្ចូលលុយ)
    function getCurrentUser() {
        let username = '';
        
        // ស្វែងរកក្នុង localStorage
        const keys = ['pos_current_user', 'username', 'user_role', 'role', 'user_name'];
        for (let key of keys) {
            let val = localStorage.getItem(key);
            if (val) { username = val; break; }
        }
        
        // ស្កេនទាញយកពីអេក្រង់ផ្ទាល់ (ក្បែរម៉ោង) បើកកក្នុង localStorage អត់ឃើញ
        if (!username) {
            const elements = document.querySelectorAll('*');
            for (let el of elements) {
                if (el.innerText && (el.innerText.includes('👤') || el.innerHTML.includes('fa-user'))) {
                    let text = el.innerText.replace('👤', '').trim();
                    if (text.length > 0 && text.length < 25) { username = text; break; }
                }
            }
        }
        
        // ជម្រើសចុងក្រោយ
        if (!username) {
            const pageText = document.body.innerText;
            if (pageText.includes('អ្នកគ្រប់គ្រងប្រព័ន្ធ')) username = 'អ្នកគ្រប់គ្រងប្រព័ន្ធ';
            else if (pageText.includes('👑 Admin') || pageText.includes('Admin')) username = 'admin';
        }
        
        return username || 'មិនស្គាល់ឈ្មោះ';
    }

    // ២. មុខងារបើកផ្ទាំងបញ្ចូលប្រាក់ដើម
    function openOpeningCashModal() {
        if(document.getElementById('skmOpeningCashModal')) {
            document.getElementById('skmOpeningCashModal').style.display = 'flex';
            loadOpeningCashVal();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmOpeningCashModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.6); z-index: 100000; display: flex; 
            justify-content: center; align-items: center; 
            backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;
        `;
        
        modal.innerHTML = `
            <div id="skmOpeningCashContent" style="background: #ffffff; color: #333333; padding: 25px; border-radius: 16px; width: 400px; display:flex; flex-direction:column; border: 1px solid #e2e8f0; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                
                <!-- ផ្នែកក្បាល -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
                    <h3 style="color:#0284c7; margin:0; font-size:16px; display: flex; align-items: center; gap: 8px;">
                        🪙 ប្រាក់ដើមក្នុងទូរពេលបើកវេន
                    </h3>
                    <button onclick="document.getElementById('skmOpeningCashModal').style.display='none'" style="background:#ef4444; border:none; color:#fff; width:26px; height:26px; border-radius:50%; cursor:pointer; font-weight:bold; display: flex; justify-content: center; align-items: center; font-size: 12px;">✕</button>
                </div>
                
                <!-- ផ្នែកបញ្ចូលទិន្នន័យ -->
                <div style="font-size:13px; color:#64748b; margin-bottom:12px;">កត់ត្រាទឹកប្រាក់ដែលមានស្រាប់ក្នុងទូរមុនពេលចាប់ផ្តើមលក់ថ្ងៃនេះ៖</div>
                <div style="margin-bottom:8px;">
                    <input type="number" id="skmOpeningCashInp" placeholder="0.00" style="width:100%; box-sizing:border-box; padding: 12px; font-size:22px; text-align:center; font-weight:bold; color:#10b981; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; font-family: 'Battambang', sans-serif;">
                </div>
                
                <!-- ផ្នែកបង្ហាញព័ត៌មានអ្នកបញ្ចូល -->
                <div id="skmOpeningCashInfo" style="font-size:11px; color:#94a3b8; text-align:center; margin-bottom:15px; min-height:16px;"></div>

                <!-- ផ្នែកប៊ូតុងខាងក្រោម -->
                <div style="display:flex; gap:10px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                    <button style="flex:1; padding: 10px; border-radius: 8px; cursor: pointer; background: white; border: 1px solid #cbd5e1; color: #475569; font-family: 'Battambang'; font-size: 14px;" onclick="document.getElementById('skmOpeningCashModal').style.display='none'">បិទ</button>
                    <button style="flex:1; padding: 10px; border-radius: 8px; cursor: pointer; background: #0284c7; border: none; color: white; font-family: 'Battambang'; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(2, 132, 199, 0.2);" onclick="window.saveOpeningCash()">💾 កត់ត្រាទុក</button>
                </div>
            </div>
        `;

        // អនុញ្ញាតឱ្យចុចផ្ទៃខាងក្រៅ (Background) ដើម្បីបិទ Modal
        modal.addEventListener('mousedown', function(event) {
            const content = document.getElementById('skmOpeningCashContent');
            if (event.target === modal && !content.contains(event.target)) {
                modal.style.display = 'none';
            }
        });

        document.body.appendChild(modal);
        loadOpeningCashVal();
    }

    // ៣. មុខងារទាញយកទិន្នន័យចាស់មកបង្ហាញ
    function loadOpeningCashVal() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        const today = new Date().toLocaleDateString();
        let saved = JSON.parse(localStorage.getItem(`ks2_${branchId}_opening_cash`) || '{}');
        
        const inputField = document.getElementById('skmOpeningCashInp');
        const infoField = document.getElementById('skmOpeningCashInfo');

        if(saved.date === today && saved.amount !== undefined) {
            inputField.value = saved.amount;
            if(saved.recordedBy && saved.time) {
                infoField.innerHTML = `បញ្ចូលចុងក្រោយដោយ៖ <b>${saved.recordedBy}</b> (ម៉ោង ${saved.time})`;
            } else {
                infoField.innerHTML = '';
            }
        } else {
            inputField.value = ''; // ទុកចំហឱ្យវាយបញ្ចូលថ្មីជានិច្ច
            infoField.innerHTML = '';
        }
        
        // ដាក់ Mouse ឱ្យលោតចូលប្រអប់វាយលេខដោយស្វ័យប្រវត្តិ
        setTimeout(() => inputField.focus(), 100);
    }

    // ៤. មុខងាររក្សាទុកទឹកប្រាក់
    window.saveOpeningCash = function() {
        const inputVal = document.getElementById('skmOpeningCashInp').value;
        const amt = parseFloat(inputVal);
        
        if(inputVal === '' || isNaN(amt) || amt < 0) { 
            alert('សូមបញ្ចូលចំនួនទឹកប្រាក់ដើមឱ្យបានត្រឹមត្រូវ!'); 
            return; 
        }
        
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        const today = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString('km-KH');
        const currentUser = getCurrentUser();
        
        // រក្សាទុកទិន្នន័យរួមបញ្ចូលទាំងអ្នកបញ្ចូល និងម៉ោង
        localStorage.setItem(`ks2_${branchId}_opening_cash`, JSON.stringify({ 
            date: today, 
            amount: amt,
            recordedBy: currentUser,
            time: currentTime
        }));
        
        document.getElementById('skmOpeningCashModal').style.display = 'none';
        if(typeof window.showToast === 'function') {
            window.showToast('បានកត់ត្រាប្រាក់ដើមបើកវេនរួចរាល់!');
        } else {
            alert('បានកត់ត្រាប្រាក់ដើមបើកវេនរួចរាល់!');
        }
    };

    // ៥. រង់ចាំភ្ជាប់ជាមួយ Smart Toolbox Hub (ការពារ Infinite Loop)
    let attempts = 0;
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🪙', 'ប្រាក់ដើមបើកវេន (Opening Float)', openOpeningCashModal);
            clearInterval(initInt);
            console.log("✅ Opening Float successfully registered to Toolbox!");
        }
        attempts++;
        if (attempts > 20) { // ឈប់ស្វែងរកក្រោយ ១០ វិនាទី
            clearInterval(initInt);
            console.warn("⚠️ Opening Float failed to register: Smart Toolbox not found.");
        }
    }, 500);

})();