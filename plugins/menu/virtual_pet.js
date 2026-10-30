(function() {
    console.log("🐾 Menu Virtual Pet & Mascot Companion Plugin Initialized!");

    function openVirtualPetModal() {
        if(document.getElementById('skmPetModal')) {
            document.getElementById('skmPetModal').style.display = 'flex';
            updatePetStats();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmPetModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 50px; margin-bottom: 5px; animation: petBounce 1.5s infinite;" id="petAvatar">🐶</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">សត្វចិញ្ចឹមកំសាន្តប្រចាំហាង</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ចិញ្ចឹម និងលេងជាមួយសត្វចិញ្ចឹមកំសាន្តដើម្បីទទួលបានកូដពិសេស៖</p>
                
                <div style="background: rgba(245,158,11,0.08); border: 1px dashed #f59e0b; padding: 15px; border-radius: 16px; margin-bottom: 15px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 6px;">
                    <div>❤️ <b>កម្រិតក្ដីស្រលាញ់ (Love):</b> <span id="petLoveScore" style="color: #10b981; font-weight: bold;">80%</span></div>
                    <div>🍖 <b>កម្រិតឆ្អែត (Hunger):</b> <span id="petHungerScore" style="color: #f59e0b; font-weight: bold;">90%</span></div>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <button onclick="window.feedVirtualPet()" style="flex: 1; background: #f59e0b; color: white; border: none; padding: 10px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">🍖 បញ្ចុកអាហារ</button>
                    <button onclick="window.playVirtualPet()" style="flex: 1; background: #38bdf8; color: white; border: none; padding: 10px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">🎾 លេងជាមួយគ្នា</button>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmPetModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes petBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
        `;
        document.head.appendChild(style);
    }

    window.feedVirtualPet = function() {
        let love = parseInt(localStorage.getItem('skm_pet_love') || '80');
        love = Math.min(100, love + 10);
        localStorage.setItem('skm_pet_love', love);
        updatePetStats();
        if (typeof showToast === 'function') showToast('🍖 បានបញ្ចុកអាហារដល់សត្វចិញ្ចឹមរួចរាល់!');
    };

    window.playVirtualPet = function() {
        let love = parseInt(localStorage.getItem('skm_pet_love') || '80');
        love = Math.min(100, love + 15);
        localStorage.setItem('skm_pet_love', love);
        updatePetStats();
        if (typeof showToast === 'function') showToast('🎾 លេងជាមួយសត្វចិញ្ចឹមយ៉ាងសប្បាយរីករាយ!');
    };

    function updatePetStats() {
        const loveEl = document.getElementById('petLoveScore');
        if (loveEl) {
            let love = localStorage.getItem('skm_pet_love') || '80';
            loveEl.innerText = love + '%';
        }
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🐾', 'សត្វចិញ្ចឹមកំសាន្ត (Virtual Pet)', openVirtualPetModal);
            clearInterval(initInt);
        }
    }, 500);
})();