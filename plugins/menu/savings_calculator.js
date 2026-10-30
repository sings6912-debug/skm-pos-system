(function() {
    console.log("💰 Menu Savings & Cash Back Goal Calculator Plugin Initialized modularly!");

    function openSavingsModal() {
        if(document.getElementById('skmSavingsModal')) {
            document.getElementById('skmSavingsModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmSavingsModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">💰</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">គណនាសន្សំប្រាក់ & កម្រិតសន្សំ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">គណនាប្រាក់ដែលអ្នកសន្សំបានពីការកុម្មង់ជាមួយប្រេនយើងខ្ញុំ៖</p>
                
                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">ចំនួនដងដែលទិញក្នុងមួយខែ:</div>
                <input type="number" id="savingsVisits" value="4" min="1" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: #fff; font-size: 12px; outline: none; margin-bottom: 12px; font-family:'Battambang';" oninput="window.calcSavingsResult()">

                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted);">ប្រាក់សន្សំបានប៉ាន់ស្មានក្នុងមួយឆ្នាំ:</div>
                    <div id="savingsResultDisplay" style="font-size: 26px; font-weight: 900; color: #10b981; margin-top: 5px;">$48.00</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 12px; cursor: pointer;" onclick="document.getElementById('skmSavingsModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        window.calcSavingsResult();
    }

    window.calcSavingsResult = function() {
        const vis = parseInt(document.getElementById('savingsVisits').value) || 4;
        const disp = document.getElementById('savingsResultDisplay');
        if (!disp) return;

        let yearlySavings = vis * 1 * 12;
        disp.innerText = `$${yearlySavings.toFixed(2)}`;
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💰', 'គណនាសន្សំប្រាក់ (Savings Calculator)', openSavingsModal);
            clearInterval(initInt);
        }
    }, 500);
})();