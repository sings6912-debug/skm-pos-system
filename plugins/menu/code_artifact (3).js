(function() {
    console.log("🐱 Menu Virtual Mascot & Promo Greeter Plugin Initialized!");

    function openMascotModal() {
        if(document.getElementById('skmMascotModal')) {
            document.getElementById('skmMascotModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmMascotModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 50px; margin-bottom: 5px; animation: mascotBounce 1.5s infinite;">🐱</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">សួស្តី! ខ្ញុំជាម៉ាស្កូតប្រចាំហាង</h3>
                <p id="mascotSpeechText" style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; background: rgba(245,158,11,0.08); padding: 12px; border-radius: 12px; border: 1px dashed #f59e0b; text-align: left;">
                    "សូមអរគុណដែលបានអញ្ជើញមកកាន់ហាងយើងខ្ញុំ! ថ្ងៃនេះខ្ញុំមានកូដបញ្ចុះតម្លៃពិសេសជូនអ្នកណា!"
                </p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px solid #10b981; padding: 12px; border-radius: 12px; margin-bottom: 15px; font-size: 12px;">
                    🎁 កូដពិសេសរបស់អ្នក: <b style="color: #10b981; font-size: 15px;">MASCOT5</b> (បញ្ចុះ $5)
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #f59e0b; margin-bottom: 10px;" onclick="window.applyMascotPromoCode()">🎟️ យកកូដបញ្ចុះតម្លៃនេះ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmMascotModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.applyMascotPromoCode = function() {
        const promoInput = document.getElementById('cPromo');
        if (!promoInput) {
            if (typeof showToast === 'function') showToast('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!', true);
            else alert('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!');
            document.getElementById('skmMascotModal').style.display = 'none';
            return;
        }
        promoInput.value = 'MASCOT5';
        document.getElementById('skmMascotModal').style.display = 'none';
        if (typeof applyPromo === 'function') applyPromo();
        if (typeof showToast === 'function') showToast('បានដាក់កូដ MASCOT5 ជោគជ័យ!');
    };

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes mascotBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
    `;
    document.head.appendChild(style);

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🐱', 'ម៉ាស្កូតហាង & កូដពិសេស', openMascotModal);
            clearInterval(initInt);
        }
    }, 500);
})();