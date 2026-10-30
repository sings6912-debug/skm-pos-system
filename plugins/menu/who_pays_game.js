(function() {
    console.log("🎮 Menu Who Pays Game & Table Battle Plugin Initialized!");

    function openWhoPaysModal() {
        if(document.getElementById('skmWhoPaysModal')) {
            document.getElementById('skmWhoPaysModal').style.display = 'flex';
            document.getElementById('whoPaysResultBox').style.display = 'none';
            document.getElementById('whoPaysNameInput').value = '';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmWhoPaysModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 44px; margin-bottom: 5px;">🎮</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">ល្បែងអ្នកណាចេញលុយ? (Who Pays?)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">បញ្ចូលឈ្មោះអ្នកញ៉ាំទាំងអស់គ្នា (ខណ្ឌដោយសញ្ញាក្បៀស ",") ដើម្បីចាក់ស្รុះរើសអ្នកចេញលុយថ្ងៃនេះ៖</p>
                
                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">ឈ្មោះអ្នកចូលរួម៖</div>
                <input type="text" id="whoPaysNameInput" placeholder="ឧ. Dara, Vanna, Srey Nich, Borey" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: #fff; font-size: 12px; outline: none; margin-bottom: 15px; font-family:'Battambang';">

                <div id="whoPaysResultBox" style="background: rgba(56,189,248,0.08); border: 1px dashed #38bdf8; padding: 16px; border-radius: 16px; margin-bottom: 15px; text-align: center; display: none;">
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">🎉 លទ្ធផលអ្នកត្រូវចេញប្រាក់វិក្កយបត្រថ្ងៃនេះ:</div>
                    <div id="whoPaysWinnerName" style="font-size: 20px; font-weight: 900; color: #38bdf8;">---</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #38bdf8; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.runWhoPaysBattle()">🎲 ចាក់ស្รុះរើសអ្នកចេញលុយ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmWhoPaysModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.runWhoPaysBattle = function() {
        const inp = document.getElementById('whoPaysNameInput').value.trim();
        const box = document.getElementById('whoPaysResultBox');
        const winnerEl = document.getElementById('whoPaysWinnerName');

        if (!inp) {
            alert('សូមបញ្ចូលឈ្មោះអ្នកចូលរួមយ៉ាងហោចណាស់ ២ នាក់!');
            return;
        }

        let names = inp.split(',').map(n => n.trim()).filter(Boolean);
        if (names.length < 2) {
            alert('សូមបញ្ចូលឈ្មោះយ៉ាងហោចណាស់ ២ នាក់ ដោយខណ្ឌដោយសញ្ញាក្បៀស (,)!');
            return;
        }

        box.style.display = 'block';
        winnerEl.innerText = '🎲 កំពុងចាក់ស្รុះរើស...';

        let count = 0;
        const interval = setInterval(() => {
            let randName = names[Math.floor(Math.random() * names.length)];
            winnerEl.innerText = randName;
            count++;

            if (count > 12) {
                clearInterval(interval);
                let finalWinner = names[Math.floor(Math.random() * names.length)];
                winnerEl.innerHTML = `🏆 <span style="color: #10b981; font-size: 22px;">${finalWinner}</span> ត្រូវចេញលុយថ្ងៃនេះ!`;
                if (typeof showToast === 'function') showToast(`🎉 ${finalWinner} ត្រូវចេញប្រាក់វិក្កយបត្រ!`);
            }
        }, 100);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎮', 'ល្បែងអ្នកណាចេញលុយ (Who Pays?)', openWhoPaysModal);
            clearInterval(initInt);
        }
    }, 500);
})();