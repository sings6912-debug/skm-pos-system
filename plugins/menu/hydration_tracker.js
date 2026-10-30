(function() {
    console.log("💧 Menu Hydration & Water Intake Tracker Plugin Initialized!");

    function openHydrationModal() {
        if(document.getElementById('skmHydrationModal')) {
            document.getElementById('skmHydrationModal').style.display = 'flex';
            updateWaterDisplay();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmHydrationModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 44px; margin-bottom: 5px;">💧</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">តាមដានការផឹកទឹកប្រចាំថ្ងៃ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">គោលដៅសុខភាព: ផឹកទឹកឱ្យបាន ៨ កែវក្នុងមួយថ្ងៃ៖</p>
                
                <div style="background: rgba(56,189,248,0.08); border: 1px solid var(--border-color); padding: 16px; border-radius: 16px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted);">ចំនួនទឹកបានផឹកថ្ងៃនេះ:</div>
                    <div id="waterCountDisplay" style="font-size: 32px; font-weight: 900; color: #38bdf8; margin: 6px 0;">0 / 8 កែវ</div>
                    <div style="font-size: 11px; color: #10b981;" id="waterStatusText">ព្យាយាមផឹកទឹកបន្ថែមដើម្បីសុខភាពល្អ!</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #38bdf8; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px;" onclick="window.addWaterGlass()">🥤 ផឹកទឹក ១ កែវ (+1)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 10px;" onclick="document.getElementById('skmHydrationModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        updateWaterDisplay();
    }

    window.updateWaterDisplay = function() {
        const disp = document.getElementById('waterCountDisplay');
        const stat = document.getElementById('waterStatusText');
        if(!disp) return;

        let glasses = parseInt(localStorage.getItem('skm_water_glasses') || '0');
        disp.innerText = `${glasses} / 8 កែវ`;

        if (glasses >= 8) {
            stat.innerHTML = '🎉 អស្ចារ្យណាស់! អ្នកសម្រេចគោលដៅផឹកទឹកថ្ងៃនេះរួចរាល់!';
        } else {
            stat.innerHTML = `ខ្វះ ${8 - glasses} កែវទៀតដើម្បីសម្រេចគោលដៅ!`;
        }
    };

    window.addWaterGlass = function() {
        let glasses = parseInt(localStorage.getItem('skm_water_glasses') || '0');
        glasses++;
        localStorage.setItem('skm_water_glasses', glasses);
        updateWaterDisplay();
        if (typeof showToast === 'function') showToast('🥤 បានកត់ត្រាការផឹកទឹក ១ កែវ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💧', 'តាមដានការផឹកទឹក (Hydration)', openHydrationModal);
            clearInterval(initInt);
        }
    }, 500);
})();