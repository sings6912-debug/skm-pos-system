(function() {
    console.log("🛡️ Menu Allergy & Ingredient Checker Plugin Initialized!");

    function openAllergyModal() {
        if(document.getElementById('skmAllergyModal')) {
            document.getElementById('skmAllergyModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmAllergyModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🛡️</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #ef4444;">ពិនិត្យអាឡែស៊ី & គ្រឿងផ្សំ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើសប្រភេទអាហារ ឬសារធាតុដែលអ្នកអាឡែស៊ី៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
                    <button class="skm-allergy-btn" onclick="window.filterAllergy('សណ្តែកដី / Peanuts')" style="background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid #ef4444; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">🥜 អាឡែស៊ីសណ្តែកដី (Peanuts)</button>
                    <button class="skm-allergy-btn" onclick="window.filterAllergy('ផលិតផលទឹកដោះគោ / Dairy')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">🥛 អាឡែស៊ីទឹកដោះគោ (Dairy Free)</button>
                    <button class="skm-allergy-btn" onclick="window.filterAllergy('គ្លុយតែន / Gluten')" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">🌾 គ្មានជាតិគ្លុយតែន (Gluten Free)</button>
                    <button class="skm-allergy-btn" onclick="window.filterAllergy('អាហារសមុទ្រ / Seafood')" style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">🦐 អាឡែស៊ីអាហារសមុទ្រ (Seafood)</button>
                </div>

                <div id="allergyResultMsg" style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px;">
                    💡 ប្រព័ន្ធនឹងជួយកំណត់ចំណាំលើវិក្កយបត្រកុម្មង់របស់អ្នកជូនហាង។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(239,68,68,0.1); color:#ef4444;" onclick="document.getElementById('skmAllergyModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.filterAllergy = function(allergyName) {
        const noteInput = document.getElementById('cNote');
        if (!noteInput) {
            alert('សូមបើកកន្ត្រកទំនិញ (Cart) សិន ដើម្បីកត់ចំណាំអាឡែស៊ី!');
            document.getElementById('skmAllergyModal').style.display = 'none';
            return;
        }

        let currentVal = noteInput.value.trim();
        let allergyText = `[⚠️ អាឡែស៊ី: ${allergyName}]`;
        noteInput.value = currentVal ? `${currentVal}, ${allergyText}` : allergyText;
        document.getElementById('skmAllergyModal').style.display = 'none';
        
        if (typeof showToast === 'function') showToast(`បានបន្ថែមចំណាំ: ${allergyText}`);
        else alert(`បានបន្ថែមចំណាំ: ${allergyText}`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🛡️', 'ពិនិត្យអាឡែស៊ី & គ្រឿងផ្សំ (Allergy)', openAllergyModal);
            clearInterval(initInt);
        }
    }, 500);
})();