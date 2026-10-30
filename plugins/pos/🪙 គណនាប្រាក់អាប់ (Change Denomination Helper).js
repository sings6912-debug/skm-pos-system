/* STREAMING_CHUNK:Initializing Smart Change Helper Plugin... */
(function() {
    console.log("🪙 POS Smart Change Helper Plugin Initialized!");

    /* STREAMING_CHUNK:Defining Modal UI and Structure... */
    function openChangeHelperModal() {
        if(document.getElementById('skmChangeHelperModal')) {
            document.getElementById('skmChangeHelperModal').style.display = 'flex';
            
            // ព្យាយាមទាញយកអត្រាដូរប្រាក់ពីប្រព័ន្ធដើម (បើមាន)
            const globalRateEl = document.getElementById('globalExchangeRate');
            if(globalRateEl && document.getElementById('skmChgRate')) {
                document.getElementById('skmChgRate').value = globalRateEl.value;
            }
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmChangeHelperModal';
        // ផ្ទៃខាងក្រោយពណ៌ខ្មៅព្រាល (Glassmorphism)
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); font-family: 'Battambang', 'Nunito', sans-serif;`;
        
        /* STREAMING_CHUNK:Injecting Minimalist CSS and Layout... */
        modal.innerHTML = `
            <style>
                .skm-chg-box { background: var(--bg-card, #ffffff); padding: 30px; border-radius: 24px; width: 420px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); color: var(--text-main, #1e293b); border: 1px solid var(--border, #e2e8f0); }
                .skm-chg-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border, #cbd5e1); padding-bottom: 15px; margin-bottom: 20px; }
                .skm-chg-title { font-size: 18px; font-weight: bold; color: #10b981; margin: 0; display:flex; align-items:center; gap:8px;}
                .skm-chg-row { display: flex; gap: 15px; margin-bottom: 15px; }
                .skm-chg-group { flex: 1; }
                .skm-chg-label { font-size: 13px; font-weight: bold; color: var(--text-muted, #64748b); margin-bottom: 6px; display: block; }
                .skm-chg-input { width: 100%; padding: 12px 15px; border-radius: 12px; border: 2px solid #e2e8f0; font-size: 16px; font-weight: bold; outline: none; transition: 0.3s; background: var(--store-bg, #f8fafc); color: var(--text-main, #0f172a); font-family: 'Nunito', sans-serif; }
                .skm-chg-input:focus { border-color: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); background: #ffffff; }
                .skm-chg-result-box { background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); padding: 20px; border-radius: 16px; text-align: center; margin-top: 20px; transition: 0.3s; }
                .skm-chg-total { font-size: 32px; font-weight: 900; color: #10b981; margin-bottom: 5px; font-family: 'Nunito', sans-serif; }
                .skm-chg-mix { font-size: 14px; font-weight: bold; color: #0ea5e9; padding: 6px 12px; background: #ffffff; border-radius: 20px; display: inline-block; border: 1px dashed #bae6fd; }
                .skm-btn-close { background: var(--store-bg, #f1f5f9); color: var(--text-main, #475569); border: 1px solid var(--border, #cbd5e1); padding: 14px; border-radius: 12px; font-size: 15px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 20px; transition: 0.2s; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
            </style>
            
            <div class="skm-chg-box">
                <div class="skm-chg-header">
                    <h3 class="skm-chg-title"><span style="font-size: 24px;">🪙</span> គណនាប្រាក់អាប់</h3>
                    <button onclick="document.getElementById('skmChangeHelperModal').style.display='none'" style="background: rgba(239, 68, 68, 0.1); border: none; color: #ef4444; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 16px; transition: 0.2s;">✕</button>
                </div>

                <div class="skm-chg-row">
                    <div class="skm-chg-group" style="flex: 2;">
                        <label class="skm-chg-label">សរុបត្រូវបង់ (Total $)</label>
                        <input type="number" id="skmChgTotal" class="skm-chg-input" placeholder="0.00" oninput="window.calcSmartChange()">
                    </div>
                    <div class="skm-chg-group" style="flex: 1;">
                        <label class="skm-chg-label">អត្រាដូរប្រាក់ (Rate)</label>
                        <input type="number" id="skmChgRate" class="skm-chg-input" value="4000" oninput="window.calcSmartChange()" style="color: #f59e0b;">
                    </div>
                </div>

                <div class="skm-chg-row">
                    <div class="skm-chg-group">
                        <label class="skm-chg-label">ប្រាក់ទទួល ($)</label>
                        <input type="number" id="skmChgRecvUsd" class="skm-chg-input" placeholder="0.00" oninput="window.calcSmartChange()" style="border-color: #bae6fd;">
                    </div>
                    <div class="skm-chg-group">
                        <label class="skm-chg-label">ប្រាក់ទទួល (៛)</label>
                        <input type="number" id="skmChgRecvRiel" class="skm-chg-input" placeholder="0" oninput="window.calcSmartChange()" style="border-color: #bae6fd;">
                    </div>
                </div>

                <div id="skmChgResultBox" class="skm-chg-result-box">
                    <div class="skm-chg-label" id="skmChgStatusText" style="color:#10b981; margin-bottom:8px;">ប្រាក់ត្រូវអាប់សរុប៖</div>
                    <div id="skmChgTotalDisp" class="skm-chg-total">$0.00</div>
                    <div id="skmChgMixDisp" class="skm-chg-mix">អាប់លាយគ្នា: $0 និង 0 ៛</div>
                </div>

                <button class="skm-btn-close" onclick="document.getElementById('skmChangeHelperModal').style.display='none'">បិទផ្ទាំង</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // ចុចខាងក្រៅដើម្បីបិទ
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        // ព្យាយាមទាញយកអត្រាដូរប្រាក់ពីប្រព័ន្ធដើម
        const globalRateEl = document.getElementById('globalExchangeRate');
        if(globalRateEl) {
            document.getElementById('skmChgRate').value = globalRateEl.value;
        }
    }

    /* STREAMING_CHUNK:Implementing Smart Dual-Currency Calculation... */
    window.calcSmartChange = function() {
        let total = parseFloat(document.getElementById('skmChgTotal').value) || 0;
        let rate = parseFloat(document.getElementById('skmChgRate').value) || 4000;
        let recvUsd = parseFloat(document.getElementById('skmChgRecvUsd').value) || 0;
        let recvRiel = parseFloat(document.getElementById('skmChgRecvRiel').value) || 0;

        let resBox = document.getElementById('skmChgResultBox');
        let statusText = document.getElementById('skmChgStatusText');
        let totalDisp = document.getElementById('skmChgTotalDisp');
        let mixDisp = document.getElementById('skmChgMixDisp');

        // បម្លែងលុយទទួលសរុបទៅជាដុល្លារ
        let totalRecvUsd = recvUsd + (recvRiel / rate);
        let changeUsd = totalRecvUsd - total;

        // ករណីមិនទាន់វាយបញ្ជូល
        if (total === 0 && recvUsd === 0 && recvRiel === 0) {
            resBox.style.background = 'rgba(16, 185, 129, 0.05)';
            resBox.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            statusText.innerText = 'ប្រាក់ត្រូវអាប់សរុប៖';
            statusText.style.color = '#10b981';
            totalDisp.innerText = '$0.00';
            totalDisp.style.color = '#10b981';
            mixDisp.innerText = 'អាប់លាយគ្នា: $0 និង 0 ៛';
            mixDisp.style.color = '#0ea5e9';
            mixDisp.style.borderColor = '#bae6fd';
            return;
        }

        if (changeUsd < 0) {
            // ករណីខ្វះលុយ
            let shortUsd = Math.abs(changeUsd);
            let shortRiel = Math.round(shortUsd * rate);
            
            resBox.style.background = 'rgba(239, 68, 68, 0.05)';
            resBox.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            statusText.innerText = 'ខ្វះប្រាក់ចំនួន៖';
            statusText.style.color = '#ef4444';
            totalDisp.innerText = `-$${shortUsd.toFixed(2)}`;
            totalDisp.style.color = '#ef4444';
            mixDisp.innerText = `ជាលុយរៀល: ${shortRiel.toLocaleString('en-US')} ៛`;
            mixDisp.style.color = '#ef4444';
            mixDisp.style.borderColor = '#fca5a5';
        } else {
            // ករណីអាប់លុយធម្មតា
            resBox.style.background = 'rgba(16, 185, 129, 0.05)';
            resBox.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            statusText.innerText = 'ប្រាក់ត្រូវអាប់សរុប៖';
            statusText.style.color = '#10b981';
            totalDisp.innerText = `$${changeUsd.toFixed(2)}`;
            totalDisp.style.color = '#10b981';

            // បំបែកជាលុយដុល្លារគត់ និង លុយរៀលសេស
            changeUsd = Math.round(changeUsd * 100) / 100; // កែបញ្ហាទសភាគ (Precision Fix)
            let wholeUsd = Math.floor(changeUsd);
            let fractionUsd = changeUsd - wholeUsd;
            let rielChange = Math.round(fractionUsd * rate);

            // ធ្វើឱ្យលុយរៀលគត់ត្រឹម 100 ៛ (ឧទាហរណ៍ 1199 ទៅជា 1200)
            rielChange = Math.round(rielChange / 100) * 100;

            // បើកាត់កងរួច លុយរៀលឡើងដល់អត្រាដូរប្រាក់ (ឧទាហរណ៍ 4000) អោយបូកចូលដុល្លារវិញ
            if (rielChange >= rate) {
                let addUsd = Math.floor(rielChange / rate);
                wholeUsd += addUsd;
                rielChange = rielChange % rate;
            }

            mixDisp.innerText = `អាប់ជូន: $${wholeUsd} និង ${rielChange.toLocaleString('en-US')} ៛`;
            mixDisp.style.color = '#0ea5e9';
            mixDisp.style.borderColor = '#bae6fd';
        }
    };

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🪙', 'គណនាប្រាក់អាប់រហ័ស', openChangeHelperModal);
            clearInterval(initInt);
        }
    }, 500);
})();