(function() {
    console.log("🎁 Menu E-Gift Card Plugin Initialized!");

    function openEGiftModal() {
        if(document.getElementById('skmGiftCardModal')) {
            document.getElementById('skmGiftCardModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmGiftCardModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">🎁</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">កាតអំណោយឌីជីថល (E-Gift Card)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">បង្កើតកាតអំណោយសម្រាប់មិត្តភក្តិ ឬមនុស្សពិសេស៖</p>
                
                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">ឈ្មោះអ្នកទទួល (Recipient Name):</div>
                <input type="text" id="giftRecipient" placeholder="ឧ. នរៈ..." style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: #fff; font-size: 12px; outline: none; margin-bottom: 10px; font-family:'Battambang';">

                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">ទឹកប្រាក់កាតអំណោយ ($):</div>
                <select id="giftAmount" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: #fff; font-size: 12px; outline: none; margin-bottom: 10px; font-family:'Battambang';">
                    <option value="5">🎁 កាតអំណោយ $5.00</option>
                    <option value="10" selected>🎁 កាតអំណោយ $10.00</option>
                    <option value="20">🎁 កាតអំណោយ $20.00</option>
                    <option value="50">🎁 កាតអំណោយ $50.00</option>
                </select>

                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">សារជូនពរ (Message):</div>
                <input type="text" id="giftMessage" placeholder="ឧ. រីករាយថ្ងៃខួបកំណើត!" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: #fff; font-size: 12px; outline: none; margin-bottom: 15px; font-family:'Battambang';">

                <button class="btn-act btn-green" style="width: 100%; background: #f59e0b; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.generateGiftCardCode()">✨ បង្កើតកូដកាតអំណោយ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmGiftCardModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.generateGiftCardCode = function() {
        const recip = document.getElementById('giftRecipient').value.trim();
        const amt = document.getElementById('giftAmount').value;
        const msg = document.getElementById('giftMessage').value.trim();

        if(!recip) { alert('សូមបញ្ចូលឈ្មោះអ្នកទទួលសិន!'); return; }

        let cardCode = 'GIFT-' + amt + '-' + Math.floor(1000 + Math.random() * 9000);
        
        const promoInput = document.getElementById('cPromo');
        if (promoInput) promoInput.value = cardCode;

        document.getElementById('skmGiftCardModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`បង្កើតកាតអំណោយ $${amt} ជោគជ័យ! កូដ: ${cardCode}`);
        else alert(`បង្កើតកាតអំណោយជោគជ័យ! កូដ: ${cardCode}`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎁', 'កាតអំណោយឌីជីថល (E-Gift Card)', openEGiftModal);
            clearInterval(initInt);
        }
    }, 500);
})();