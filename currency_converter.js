(function() {
    console.log("💱 Menu Currency Converter Plugin Initialized!");

    function openCurrencyModal() {
        if(document.getElementById('skmCurrModal')) {
            document.getElementById('skmCurrModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmCurrModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">💱</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ប្តូររូបិយប័ណ្ណបង្ហាញតម្លៃ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើសរូបិយប័ណ្ណដើម្បីបង្ហាញតម្លៃទំនិញ៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
                    <button onclick="window.setMenuCurrency('USD', '$')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">💵 ដុល្លារអាមេរិក (USD - $)</button>
                    <button onclick="window.setMenuCurrency('KHR', '៛')" style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">៛ រៀលកម្ពុជា (KHR - ៛)</button>
                    <button onclick="window.setMenuCurrency('THB', '฿')" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">฿ បាតថៃ (THB - ฿)</button>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px;">
                    💡 អត្រាប្តូរប្រាក់ស្វ័យប្រវត្តិ៖ 1$ = 4,000៛ | 1$ = 35฿
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmCurrModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.setMenuCurrency = function(currCode, symbol) {
        localStorage.setItem('skm_display_currency', currCode);
        localStorage.setItem('skm_currency_symbol', symbol);
        document.getElementById('skmCurrModal').style.display = 'none';
        
        if (typeof renderMenu === 'function') renderMenu();
        if (typeof showToast === 'function') showToast(`បានប្តូររូបិយប័ណ្ណទៅជា: ${currCode}`);
        else alert(`បានប្តូររូបិយប័ណ្ណទៅជា: ${currCode}`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💱', 'ប្តូររូបិយប័ណ្ណ (Currency)', openCurrencyModal);
            clearInterval(initInt);
        }
    }, 500);
})();