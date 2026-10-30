(function() {
    console.log("🎟️ Menu Coupon Wallet Plugin Initialized!");

    function openCouponWalletModal() {
        if(document.getElementById('skmCouponModal')) {
            document.getElementById('skmCouponModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmCouponModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🎟️</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #ec4899;">កាបូបប័ណ្ណបញ្ចុះតម្លៃ (Coupons)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើសកូដប្រូម៉ូសិនដើម្បីយកទៅប្រើប្រាស់៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px; text-align: left;">
                    <div style="background: rgba(236,72,153,0.08); border: 1px dashed #ec4899; padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <b style="color: #ec4899; font-size: 13px; display: block;">SKM10 (បញ្ចុះ 10%)</b>
                            <span style="font-size: 10px; color: var(--text-muted);">សម្រាប់រាល់ការកុម្មង់លើស $10</span>
                        </div>
                        <button onclick="window.applyCouponCode('SKM10')" style="background: #ec4899; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">ប្រើកូដ</button>
                    </div>
                    <div style="background: rgba(56,189,248,0.08); border: 1px dashed #38bdf8; padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <b style="color: #38bdf8; font-size: 13px; display: block;">FREESHIP (ហ្វ្រីសេវាដឹក)</b>
                            <span style="font-size: 10px; color: var(--text-muted);">ដឹកជញ្ជូនឥតគិតថ្លៃគ្រប់ទីកន្លែង</span>
                        </div>
                        <button onclick="window.applyCouponCode('FREESHIP')" style="background: #38bdf8; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">ប្រើកូដ</button>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(128,128,128,0.1);" onclick="document.getElementById('skmCouponModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.applyCouponCode = function(code) {
        const promoInput = document.getElementById('cPromo');
        if (!promoInput) {
            if (typeof showToast === 'function') showToast('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!', true);
            else alert('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!');
            document.getElementById('skmCouponModal').style.display = 'none';
            return;
        }
        promoInput.value = code;
        document.getElementById('skmCouponModal').style.display = 'none';
        if (typeof applyPromo === 'function') applyPromo();
        if (typeof showToast === 'function') showToast(`បានដាក់កូដ: ${code}!`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎟️', 'កាបូបប័ណ្ណបញ្ចុះតម្លៃ (Coupons)', openCouponWalletModal);
            clearInterval(initInt);
        }
    }, 500);
})();