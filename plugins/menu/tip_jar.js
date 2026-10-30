(function() {
    console.log("💌 Menu Digital Tip Jar & Compliment Plugin Initialized!");

    function openTipJarModal() {
        if(document.getElementById('skmTipJarModal')) {
            document.getElementById('skmTipJarModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmTipJarModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(236,72,153,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 44px; margin-bottom: 5px;">💌</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #ec4899;">ប្រអប់ធីប និងសរសើរអ្នកបំរើ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ផ្ញើទឹកចិត្ត ឬសរសើរដល់បុគ្គលិកដែលបម្រើការងារប្រចាំតុរបស់អ្នក៖</p>
                
                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">ជ្រើសរើសទឹកប្រាក់ធីប ($):</div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 12px;">
                    <button onclick="window.selectTipAmount(1)" class="tip-amt-btn" style="background: rgba(236,72,153,0.1); color: #ec4899; border: 1px solid #ec4899; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: bold; cursor: pointer;">$1.00</button>
                    <button onclick="window.selectTipAmount(2)" class="tip-amt-btn" style="background: rgba(236,72,153,0.1); color: #ec4899; border: 1px solid #ec4899; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: bold; cursor: pointer;">$2.00</button>
                    <button onclick="window.selectTipAmount(5)" class="tip-amt-btn" style="background: rgba(236,72,153,0.1); color: #ec4899; border: 1px solid #ec4899; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: bold; cursor: pointer;">$5.00</button>
                    <button onclick="window.selectTipAmount(10)" class="tip-amt-btn" style="background: rgba(236,72,153,0.1); color: #ec4899; border: 1px solid #ec4899; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: bold; cursor: pointer;">$10.00</button>
                </div>

                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">សារសរសើរ / ជូនពរ:</div>
                <textarea id="tipMessageInp" placeholder="ឧ. បុគ្គលិកបម្រើការបានល្អរាក់ទាក់ខ្លាំងណាស់..." style="width: 100%; height: 75px; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: #fff; font-family: 'Battambang'; font-size: 12px; resize: none; outline: none; margin-bottom: 15px;"></textarea>

                <button class="btn-act btn-green" style="width: 100%; background: #ec4899; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.submitTipAndCompliment()">💖 ផ្ញើធីប & សារសរសើរ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(236,72,153,0.1); color:#ec4899; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmTipJarModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        window.selectedTipVal = 2.00;
    }

    window.selectTipAmount = function(amt) {
        window.selectedTipVal = amt;
        if (typeof showToast === 'function') showToast(`បានជ្រើសរើសប្រាក់ធីប: $${amt.toFixed(2)}`);
    };

    window.submitTipAndCompliment = function() {
        const msg = document.getElementById('tipMessageInp').value.trim();
        const amt = window.selectedTipVal || 2.00;
        let savedTable = localStorage.getItem('skm_selected_table') || 'តុលេខ ១';

        let tips = JSON.parse(localStorage.getItem('skm_shop_tips_log') || '[]');
        tips.unshift({
            table: savedTable,
            amount: amt,
            message: msg || 'សរសើរការបម្រើការងារល្អ',
            time: new Date().toLocaleString('km-KH')
        });
        localStorage.setItem('skm_shop_tips_log', JSON.stringify(tips));

        document.getElementById('skmTipJarModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`❤️ អរគុណច្រើន! បានផ្ញើធីប $${amt.toFixed(2)} ជូនបុគ្គលិកជោគជ័យ!`);
        else alert(`❤️ អរគុណច្រើន! បានផ្ញើធីប $${amt.toFixed(2)} ជូនបុគ្គលិកជោគជ័យ!`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💌', 'ប្រអប់ធីប និងសរសើរអ្នកបំរើ (Tip Jar)', openTipJarModal);
            clearInterval(initInt);
        }
    }, 500);
})();