(function() {
    console.log("📍 Menu Delivery Address & Landmark Notes Plugin Initialized!");

    function openDeliveryNoteModal() {
        if(document.getElementById('skmDelivNoteModal')) {
            document.getElementById('skmDelivNoteModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmDelivNoteModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">📍</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">កត់ចំណាំទីតាំងដឹកជញ្ជូន</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">បំពេញព័ត៌មានទីតាំងលម្អិតដើម្បីងាយស្រួលដល់អ្នកដឹកជញ្ជូន៖</p>
                
                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">ផ្ទះលេខ / ផ្លូវ / បុរី:</div>
                <input type="text" id="delivStreet" placeholder="ឧ. ផ្ទះលេខ 12, ផ្លូវ 271..." style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 12px; outline: none; margin-bottom: 10px; font-family:'Battambang';">

                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">អគារ / ជាន់ / បន្ទប់ (បើមាន):</div>
                <input type="text" id="delivBuilding" placeholder="ឧ. អាគារ A, ជាន់ទី 2, បន្ទប់ 204" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 12px; outline: none; margin-bottom: 10px; font-family:'Battambang';">

                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">ទីកន្លែងសម្គាល់ជិតផ្ទះ:</div>
                <input type="text" id="delivLandmark" placeholder="ឧ. ជិតផ្សារទួលទំពូង, ផ្ទះពណ៌ខៀវ..." style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 12px; outline: none; margin-bottom: 15px; font-family:'Battambang';">

                <button class="btn-act btn-green" style="width: 100%; background: #38bdf8; margin-bottom: 10px;" onclick="window.submitDeliveryNote()">📥 រក្សាទុកចំណាំទីតាំង</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmDelivNoteModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.submitDeliveryNote = function() {
        const street = document.getElementById('delivStreet').value.trim();
        const bld = document.getElementById('delivBuilding').value.trim();
        const mark = document.getElementById('delivLandmark').value.trim();

        if(!street) {
            alert('សូមបំពេញទីតាំងផ្ទះលេខ និងផ្លូវសិន!');
            return;
        }

        let noteStr = `[ទីតាំងដឹក: ${street}${bld ? ', ' + bld : ''}${mark ? ' (កន្លែងសម្គាល់: ' + mark + ')' : ''}]`;
        
        const noteInput = document.getElementById('cNote');
        if (noteInput) {
            let currentVal = noteInput.value.replace(/\[ទីតាំងដឹក:.*?\]/g, '').trim();
            noteInput.value = currentVal ? `${currentVal}, ${noteStr}` : noteStr;
        }

        localStorage.setItem('skm_saved_delivery_address', noteStr);
        document.getElementById('skmDelivNoteModal').style.display = 'none';

        if (typeof showToast === 'function') showToast('បានរក្សាទុកចំណាំទីតាំងដឹកជញ្ជូនជោគជ័យ!');
        else alert('បានរក្សាទុកចំណាំទីតាំងដឹកជញ្ជូនជោគជ័យ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📍', 'កត់ចំណាំទីតាំងដឹកជញ្ជូន (Delivery)', openDeliveryNoteModal);
            clearInterval(initInt);
        }
    }, 500);
})();