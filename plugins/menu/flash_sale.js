(function() {
    console.log("⏳ Menu Flash Deal Countdown Plugin Initialized!");

    function openFlashDealModal() {
        if(document.getElementById('skmFlashModal')) {
            document.getElementById('skmFlashModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmFlashModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">⏳</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #ef4444;">Flash Sale រាប់ថយក្រោយ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ប្រូម៉ូសិនពិសេសនឹងបញ្ចប់ក្នុងពេលឆាប់ៗ៖</p>
                
                <div style="background: rgba(239,68,68,0.08); border: 1px dashed #ef4444; padding: 15px; border-radius: 14px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">ពេលវេលានៅសល់:</div>
                    <div id="flashTimerDisplay" style="font-size: 24px; font-weight: 900; color: #ef4444; font-family: monospace;">02:45:30</div>
                </div>

                <div style="background: rgba(16,185,129,0.08); border: 1px solid #10b981; padding: 12px; border-radius: 12px; margin-bottom: 15px; text-align: center; font-size: 12px;">
                    🔥 កូដបញ្ចុះតម្លៃពិសេស: <b style="color: #10b981; font-size: 14px;">FLASH20</b> (បញ្ចុះ 20%)
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #ef4444; margin-bottom: 10px;" onclick="window.applyFlashDealCode()">🎟️ យកកូដ Flash Sale</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmFlashModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.applyFlashDealCode = function() {
        const promoInput = document.getElementById('cPromo');
        if (!promoInput) {
            if (typeof showToast === 'function') showToast('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!', true);
            else alert('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!');
            document.getElementById('skmFlashModal').style.display = 'none';
            return;
        }
        promoInput.value = 'FLASH20';
        document.getElementById('skmFlashModal').style.display = 'none';
        if (typeof applyPromo === 'function') applyPromo();
        if (typeof showToast === 'function') showToast('បានដាក់កូដ Flash Sale ជោគជ័យ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('⏳', 'Flash Sale រាប់ថយក្រោយ', openFlashDealModal);
            clearInterval(initInt);
        }
    }, 500);
})();