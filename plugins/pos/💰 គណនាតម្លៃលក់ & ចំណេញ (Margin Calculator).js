/* STREAMING_CHUNK:Initializing Precise Dual-Currency Margin Calculator Plugin... */
(function() {
    console.log("💰 POS Precise Dual-Currency Margin Calculator Plugin Initialized!");

    let isSyncing = false;

    /* STREAMING_CHUNK:Building Refined Minimalist UI with Precise Inputs... */
    function openProfitModal() {
        if(document.getElementById('skmProfitModal')) {
            document.getElementById('skmProfitModal').style.display = 'flex';
            syncExchangeRate();
            window.calcProfitFromUsd();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmProfitModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        /* STREAMING_CHUNK:Injecting Clean CSS and Layout... */
        modal.innerHTML = `
            <style>
                .skm-prof-input::-webkit-inner-spin-button, 
                .skm-prof-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                .skm-prof-input { -moz-appearance: textfield; }

                .skm-prof-box { background: var(--bg-card, #ffffff); color: var(--text-main, #1e293b); padding: 25px; border-radius: 20px; width: 100%; max-width: 440px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.2); border: 1px solid var(--border, #e2e8f0); display: flex; flex-direction: column; gap: 12px; box-sizing: border-box; }
                .skm-prof-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border, #f1f5f9); padding-bottom: 12px; margin-bottom: 2px; }
                .skm-prof-input { font-size: 14px; padding: 10px 12px; border-radius: 10px; border: 1.5px solid #cbd5e1; width: 100%; transition: all 0.2s ease; background: var(--store-bg, #f8fafc); outline: none; color: var(--text-main, #1e293b); font-family: 'Nunito', 'Battambang', sans-serif; box-sizing: border-box; font-weight: bold; }
                .skm-prof-input:focus { border-color: #10b981; background: #ffffff; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }
                .skm-prof-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; text-align: center; }
                .skm-btn-close { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; width: 100%; transition: 0.2s; text-align: center; font-family: inherit; margin-top: 4px; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
            </style>
            
            <div class="skm-prof-box">
                <div class="skm-prof-header">
                    <h3 style="margin:0; font-size:16px; display: flex; align-items: center; gap: 8px; color: #10b981; font-weight: 800;">
                        <span>💰</span> គណនាតម្លៃលក់ & ចំណេញ
                    </h3>
                    <button onclick="document.getElementById('skmProfitModal').style.display='none'" style="background: #fef2f2; border: 1px solid #fca5a5; color: #ef4444; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">✕</button>
                </div>
                
                <!-- តម្លៃដើម USD និង KHR -->
                <div style="display: flex; gap: 10px;">
                    <div style="flex: 1;">
                        <label style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">តម្លៃដើម ($ USD) *</label>
                        <input type="number" id="skmProfCostUsd" class="skm-prof-input" placeholder="0.00" oninput="window.calcProfitFromUsd()" step="any">
                    </div>
                    <div style="flex: 1;">
                        <label style="font-size: 11px; font-weight: 700; color: #0284c7; display: block; margin-bottom: 4px;">តម្លៃដើម (៛ KHR) *</label>
                        <input type="number" id="skmProfCostRiel" class="skm-prof-input" placeholder="0" oninput="window.calcProfitFromRiel()" style="color: #0284c7;">
                    </div>
                </div>

                <div style="display: flex; gap: 10px;">
                    <div style="flex: 1;">
                        <label style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">ភាគរយចង់បាន (%) *</label>
                        <input type="number" id="skmProfMargin" class="skm-prof-input" value="30" oninput="window.calcProfitFromUsd()" step="any">
                    </div>
                    <div style="flex: 1;">
                        <label style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">អត្រាដូរប្រាក់ (Rate)</label>
                        <input type="number" id="skmProfRate" class="skm-prof-input" value="4000" oninput="window.calcProfitFromUsd()" style="color: #d97706; font-weight: bold;">
                    </div>
                </div>

                <div class="skm-prof-card">
                    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">តម្លៃលក់ណែនាំ (Suggested Price)</div>
                    <div id="skmProfSellPrice" style="font-size: 24px; font-weight: 900; color: #10b981; line-height: 1.2;">$0.00</div>
                    <div id="skmProfSellRiel" style="font-size: 13px; font-weight: 700; color: #059669; margin-top: 1px;">0 ៛</div>
                    
                    <div style="border-top: 1px dashed #cbd5e1; margin: 10px 0; padding-top: 8px;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; letter-spacing: 0.5px;">ប្រាក់ចំណេញសុទ្ធ (Net Profit)</div>
                        <div id="skmProfProfitAmt" style="font-size: 15px; font-weight: 800; color: #0284c7; margin-top: 1px;">$0.00</div>
                        <div id="skmProfProfitRiel" style="font-size: 11px; font-weight: 700; color: #0369a1;">0 ៛</div>
                    </div>
                </div>

                <button class="skm-btn-close" onclick="document.getElementById('skmProfitModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        syncExchangeRate();
        window.calcProfitFromUsd();
    }

    /* STREAMING_CHUNK:Syncing Global Rate... */
    function syncExchangeRate() {
        const rateInp = document.getElementById('skmProfRate');
        if(!rateInp) return;
        const globalRate = document.getElementById('globalExchangeRate');
        if(globalRate && globalRate.value) {
            rateInp.value = globalRate.value;
        }
    }

    /* STREAMING_CHUNK:Implementing Precise Two-Way Calculation... */
    window.calcProfitFromUsd = function() {
        if (isSyncing) return;
        isSyncing = true;

        const costUsd = parseFloat(document.getElementById('skmProfCostUsd').value) || 0;
        const rate = parseFloat(document.getElementById('skmProfRate').value) || 4000;
        
        // គណនារៀលដោយរក្សាភាពជាក់លាក់ (មិនកាត់ទសភាគមុនពេលគណនា)
        let costRiel = Math.round(costUsd * rate);
        document.getElementById('skmProfCostRiel').value = costUsd > 0 ? costRiel : '';

        executeCalculation(costUsd, rate);
        isSyncing = false;
    };

    window.calcProfitFromRiel = function() {
        if (isSyncing) return;
        isSyncing = true;

        const costRiel = parseFloat(document.getElementById('skmProfCostRiel').value) || 0;
        const rate = parseFloat(document.getElementById('skmProfRate').value) || 4000;
        
        // គណនាដុល្លារដោយរក្សាទសភាគខ្ពស់ (High Precision)
        let costUsd = rate > 0 ? costRiel / rate : 0;
        document.getElementById('skmProfCostUsd').value = costRiel > 0 ? costUsd : '';

        executeCalculation(costUsd, rate);
        isSyncing = false;
    };

    function executeCalculation(costUsd, rate) {
        const margin = parseFloat(document.getElementById('skmProfMargin').value) || 0;
        
        const sellDisp = document.getElementById('skmProfSellPrice');
        const sellRielDisp = document.getElementById('skmProfSellRiel');
        const profDisp = document.getElementById('skmProfProfitAmt');
        const profRielDisp = document.getElementById('skmProfProfitRiel');

        if(costUsd <= 0) {
            sellDisp.innerText = '$0.00';
            sellRielDisp.innerText = '0 ៛';
            profDisp.innerText = '$0.00';
            profRielDisp.innerText = '0 ៛';
            return;
        }

        // គណនាប្រាក់ចំណេញ និងតម្លៃលក់
        let profitUsd = costUsd * (margin / 100);
        let sellUsd = costUsd + profitUsd;

        let sellRielVal = Math.round(sellUsd * rate);
        let profitRielVal = Math.round(profitUsd * rate);

        sellDisp.innerText = `$${sellUsd.toFixed(2)}`;
        sellRielDisp.innerText = `${sellRielVal.toLocaleString('en-US')} ៛`;

        profDisp.innerText = `$${profitUsd.toFixed(2)} (${margin}%)`;
        profRielDisp.innerText = `${profitRielVal.toLocaleString('en-US')} ៛`;
    }

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('💰', 'គណនាតម្លៃលក់ & ចំណេញ (Margin)', openProfitModal);
            clearInterval(initInt);
        }
    }, 500);
})();