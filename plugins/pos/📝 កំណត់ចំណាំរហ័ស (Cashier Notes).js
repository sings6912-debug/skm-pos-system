(function() {
    console.log("📝 POS Scratchpad Plugin Initialized!");

    function openScratchpad() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let savedNote = localStorage.getItem(`ks2_${branchId}_scratchpad`) || '';

        let modal = document.getElementById('skmScratchModal');
        
        // ប្រសិនបើធ្លាប់បើកហើយ គ្រាន់តែបង្ហាញវាវិញ ហើយទាញទិន្នន័យចុងក្រោយមកដាក់
        if(modal) {
            modal.style.display = 'flex';
            const textArea = document.getElementById('skmScratchText');
            textArea.value = savedNote;
            setTimeout(() => textArea.focus(), 100);
            return;
        }

        // បង្កើត Modal ថ្មី
        modal = document.createElement('div');
        modal.id = 'skmScratchModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.6); z-index: 100000; display: flex; 
            justify-content: center; align-items: center; 
            backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;
        `;
        
        // ប្រើរចនាបថ UI ពណ៌ស ទំនើប ស្រឡះភ្នែក (ដូច Opening Float)
        modal.innerHTML = `
            <div id="skmScratchContent" style="background: #ffffff; color: #333333; padding: 25px; border-radius: 16px; width: 420px; display:flex; flex-direction:column; border: 1px solid #e2e8f0; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
                    <h3 style="color:#f97316; margin:0; font-size:16px; display: flex; align-items: center; gap: 8px;">
                        📝 កំណត់ចំណាំរហ័ស (Cashier Notes)
                    </h3>
                    <button onclick="document.getElementById('skmScratchModal').style.display='none'" style="background:#ef4444; border:none; color:#fff; width:26px; height:26px; border-radius:50%; cursor:pointer; font-weight:bold; display: flex; justify-content: center; align-items: center; font-size: 12px;">✕</button>
                </div>
                
                <!-- មិនដាក់ទិន្នន័យត្រង់នេះផ្ទាល់ទេ ដើម្បីការពារ XSS Security -->
                <textarea id="skmScratchText" placeholder="សរសេរចំណាំ ឬការងារត្រូវធ្វើទីនេះ..." style="width:100%; height:160px; resize:none; padding:12px; background:#f8fafc; color:#333; border:1px solid #cbd5e1; border-radius:8px; outline:none; font-family:'Battambang', sans-serif; box-sizing:border-box; font-size:14px; line-height: 1.6;"></textarea>

                <div style="margin-top: 15px; display:flex; gap:10px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                    <button style="flex:1; padding: 10px; border-radius: 8px; cursor: pointer; background: white; border: 1px solid #cbd5e1; color: #475569; font-family: 'Battambang'; font-size: 14px;" onclick="document.getElementById('skmScratchModal').style.display='none'">បិទ</button>
                    <button style="flex:1; padding: 10px; border-radius: 8px; cursor: pointer; background: #f97316; border: none; color: white; font-family: 'Battambang'; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.2);" onclick="window.saveScratchpad()">💾 រក្សាទុក</button>
                </div>
            </div>
        `;
        
        // មុខងារចុចលើផ្ទៃខាងក្រៅ (Background) ដើម្បីបិទ Modal
        modal.addEventListener('mousedown', function(event) {
            const content = document.getElementById('skmScratchContent');
            if (event.target === modal && !content.contains(event.target)) {
                modal.style.display = 'none';
            }
        });

        document.body.appendChild(modal);
        
        // បញ្ចូលទិន្នន័យដោយសុវត្ថិភាព តាមរយៈ .value 
        const textArea = document.getElementById('skmScratchText');
        textArea.value = savedNote;
        
        // Auto-focus ឱ្យកន្ត្រក Mouse លោតចូលប្រអប់ស្រាប់
        setTimeout(() => textArea.focus(), 100);
    }

    // មុខងាររក្សាទុក
    window.saveScratchpad = function() {
        const val = document.getElementById('skmScratchText').value;
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        
        localStorage.setItem(`ks2_${branchId}_scratchpad`, val);
        document.getElementById('skmScratchModal').style.display = 'none';
        
        if(typeof window.showToast === 'function') {
            window.showToast('បានរក្សាទុកកំណត់ចំណាំរហ័ស!');
        }
    };

    // រង់ចាំភ្ជាប់ជាមួយ Smart Toolbox ត្រឹមតែ ២០ ដង (១០ វិនាទី)
    let attempts = 0;
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📝', 'កំណត់ចំណាំរហ័ស', openScratchpad);
            clearInterval(initInt);
            console.log("✅ Scratchpad successfully registered to Toolbox!");
        }
        attempts++;
        if (attempts > 20) {
            clearInterval(initInt);
            console.warn("⚠️ Scratchpad failed to register: Smart Toolbox not found.");
        }
    }, 500);

})();