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
```
eof

```javascript:កាបូបពិន្ទុ & រង្វាន់សមាជិក (Loyalty Wallet):menu_loyalty_wallet.js
(function() {
    console.log("💳 Menu Loyalty Points & Rewards Wallet Plugin Initialized!");

    function openLoyaltyWalletModal() {
        if(document.getElementById('skmLoyaltyWalletModal')) {
            document.getElementById('skmLoyaltyWalletModal').style.display = 'flex';
            updateLoyaltyDisplay();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmLoyaltyWalletModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">💳</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #10b981;">កាបូបពិន្ទុ & រង្វាន់សមាជិក</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ពិនិត្យពិន្ទុสะสม និងប្តូរយករង្វាន់ពិសេស៖</p>
                
                <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 14px; margin-bottom: 15px; text-align: center; box-shadow: 0 10px 20px rgba(16,185,129,0.3);">
                    <div style="font-size: 11px; opacity: 0.9;">ពិន្ទុសរុបរបស់អ្នក (TOTAL POINTS)</div>
                    <div id="walletPointsDisplay" style="font-size: 32px; font-weight: 900; margin: 6px 0;">0 pts</div>
                    <div style="font-size: 11px; background: rgba(255,255,255,0.2); display: inline-block; padding: 2px 10px; border-radius: 6px; font-weight: bold;">GOLD TIER MEMBER</div>
                </div>

                <div style="font-size: 12px; font-weight: bold; text-align: left; margin-bottom: 6px;">🎁 រង្វាន់អាចប្តូរបាន៖</div>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left;">
                    <div style="background: rgba(16,185,129,0.08); border: 1px dashed #10b981; padding: 10px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                        <div>
                            <b style="color: #10b981; display: block;">ប័ណ្ណបញ្ចុះតម្លៃ $2</b>
                            <span style="font-size: 10px; color: var(--text-muted);">ប្រើប្រាស់ 50 ពិន្ទុ</span>
                        </div>
                        <button onclick="window.redeemLoyaltyReward(50, 'SKM2USD')" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">ប្តូរ</button>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981;" onclick="document.getElementById('skmLoyaltyWalletModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        updateLoyaltyDisplay();
    }

    function updateLoyaltyDisplay() {
        const disp = document.getElementById('walletPointsDisplay');
        if (!disp) return;
        let pts = localStorage.getItem('skm_pts') || '0';
        disp.innerText = `${pts} pts`;
    }

    window.redeemLoyaltyReward = function(cost, promoCode) {
        let pts = parseInt(localStorage.getItem('skm_pts') || '0');
        if (pts < cost) {
            alert('ពិន្ទុរបស់អ្នកមិនទាន់គ្រប់គ្រាន់សម្រាប់ប្តូររង្វាន់នេះទេ!');
            return;
        }

        pts -= cost;
        localStorage.setItem('skm_pts', pts);
        updateLoyaltyDisplay();

        const promoInput = document.getElementById('cPromo');
        if (promoInput) promoInput.value = promoCode;

        document.getElementById('skmLoyaltyWalletModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`ប្តូររង្វាន់ជោគជ័យ! បានដាក់កូដ: ${promoCode}`);
        else alert(`ប្តូររង្វាន់ជោគជ័យ! បានដាក់កូដ: ${promoCode}`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💳', 'កាបូបពិន្ទុ & រង្វាន់សមាជិក', openLoyaltyWalletModal);
            clearInterval(initInt);
        }
    }, 500);
})();
```
eof

### របៀបដាក់បញ្ចូល៖
1. Save កូដទាំងពីរនេះជា File ឈ្មោះ **`menu_delivery_note.js`** និង **`menu_loyalty_wallet.js`**។
2. ចូលទៅកាន់ Menu Admin ប្រអប់ទី 6 (**Menu Custom JS**) រួច Upload File ទាំងពីរនេះបញ្ចូលគ្នា។
3. ចុច **Save Changes**។ ប្រសិនបើបងចង់បន្ថែមមុខងារអ្វីផ្សេងទៀត អាចพิมพ์ "ត" បន្ថែមបានគ្រប់ពេល!