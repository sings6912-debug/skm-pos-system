(function() {
    console.log("💊 Menu Pharmacy Dosage & Usage Guide Plugin Initialized!");

    function openDosageModal() {
        if(document.getElementById('skmDosageModal')) {
            document.getElementById('skmDosageModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmDosageModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">💊</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">ណែនាំកម្រិតប្រើប្រាស់ថ្នាំ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">គន្លឹះ និងកម្រិតប្រើប្រាស់ឱសថទូទៅតាមវេជ្ជបញ្ជា៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(16,185,129,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #10b981; display: block; margin-bottom: 2px;">🌅 ថ្នាំញ៉ាំពេលព្រឹក (Before/After Meal)</b>
                        <span style="color: var(--text-muted);">ភាគច្រើនញ៉ាំមុនបាយ ៣០នាទី ជាមួយទឹកស្អាត ១កែវពេញ។</span>
                    </div>
                    <div style="background: rgba(56,189,248,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #38bdf8; display: block; margin-bottom: 2px;">🌙 ថ្នាំញ៉ាំពេលល្ងាច / មុនចូលគេង</b>
                        <span style="color: var(--text-muted);">សម្រាប់ថ្នាំបំបាត់ការឈឺចាប់ ឬថ្នាំងងុយគេង តាមវេជ្ជបញ្ជាគ្រូពេទ្យ។</span>
                    </div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px; text-align: left;">
                    ⚠️ ចាំបាច់ត្រូវអានស្លាកសញ្ញា ឬសឹក្សាជាមួយឱសថការីមុនពេលប្រើប្រាស់។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmDosageModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💊', 'ណែនាំកម្រិតប្រើប្រាស់ថ្នាំ (Dosage)', openDosageModal);
            clearInterval(initInt);
        }
    }, 500);
})();