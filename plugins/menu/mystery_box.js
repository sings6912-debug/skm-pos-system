(function() {
    console.log("🎁 Menu Mystery Box Plugin Initialized!");

    function openMysteryBoxModal() {
        if(document.getElementById('skmMysteryModal')) {
            document.getElementById('skmMysteryModal').style.display = 'flex';
            resetBoxes();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmMysteryModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 44px; margin-bottom: 5px;">🎁</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">ប្រអប់រង្វាន់អាថ៌កំបាំង (Mystery Box)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ជ្រើសរើសប្រអប់ ១ ក្នុងចំណោម ៣ ដើម្បីបើកយករង្វាន់អាថ៌កំបាំង៖</p>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px;" id="mysteryBoxGrid">
                    <button onclick="window.openMysteryBox(0)" class="m-box-btn" style="background: rgba(245,158,11,0.1); border: 1px solid #f59e0b; padding: 15px 10px; border-radius: 12px; font-size: 28px; cursor: pointer; transition: 0.2s;">📦</button>
                    <button onclick="window.openMysteryBox(1)" class="m-box-btn" style="background: rgba(245,158,11,0.1); border: 1px solid #f59e0b; padding: 15px 10px; border-radius: 12px; font-size: 28px; cursor: pointer; transition: 0.2s;">📦</button>
                    <button onclick="window.openMysteryBox(2)" class="m-box-btn" style="background: rgba(245,158,11,0.1); border: 1px solid #f59e0b; padding: 15px 10px; border-radius: 12px; font-size: 28px; cursor: pointer; transition: 0.2s;">📦</button>
                </div>

                <div id="mysteryResultBox" style="background: rgba(245,158,11,0.08); border: 1px dashed #f59e0b; padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: center; display: none;">
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">🎉 លទ្ធផលរង្វាន់របស់អ្នក:</div>
                    <div id="mysteryRewardText" style="font-size: 15px; font-weight: 900; color: #f59e0b;">---</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmMysteryModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function resetBoxes() {
        const resBox = document.getElementById('mysteryResultBox');
        if (resBox) resBox.style.display = 'none';
        document.querySelectorAll('.m-box-btn').forEach(btn => {
            btn.disabled = false;
            btn.innerText = '📦';
            btn.style.background = 'rgba(245,158,11,0.1)';
            btn.style.borderColor = '#f59e0b';
            btn.style.opacity = '1';
        });
    }

    window.openMysteryBox = function(idx) {
        const rewards = [
            { code: 'MYSTERY10', desc: 'ប័ណ្ណបញ្ចុះតម្លៃ 10%' },
            { code: 'MYSTERY5', desc: 'បញ្ចុះតម្លៃ $5.00' },
            { code: 'FREESHIP', desc: 'សេវាដឹកជញ្ជូនឥតគិតថ្លៃ' }
        ];
        
        const chosen = rewards[Math.floor(Math.random() * rewards.length)];
        const resBox = document.getElementById('mysteryResultBox');
        const rewText = document.getElementById('mysteryRewardText');

        document.querySelectorAll('.m-box-btn').forEach((btn, i) => {
            btn.disabled = true;
            if (i === idx) {
                btn.innerText = '✨';
                btn.style.background = 'rgba(16,185,129,0.2)';
                btn.style.borderColor = '#10b981';
            } else {
                btn.innerText = '🎁';
                btn.style.opacity = '0.5';
            }
        });

        if (resBox && rewText) {
            resBox.style.display = 'block';
            rewText.innerHTML = `អបអរសាទរ! បានទទួលកូដ: <span style="color: #10b981;">${chosen.code}</span> (${chosen.desc})`;
            
            const promoInput = document.getElementById('cPromo');
            if (promoInput) promoInput.value = chosen.code;
            if (typeof showToast === 'function') showToast(`🎉 បើកប្រអប់រង្វាន់ជោគជ័យ បានកូដ: ${chosen.code}!`);
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎁', 'ប្រអប់រង្វាន់អាថ៌កំបាំង (Mystery Box)', openMysteryBoxModal);
            clearInterval(initInt);
        }
    }, 500);
})();