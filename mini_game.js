(function() {
    console.log("🎯 Menu Mini Game & Entertainment Plugin Initialized!");

    function openMiniGameModal() {
        if(document.getElementById('skmGameModal')) {
            document.getElementById('skmGameModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmGameModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🎯</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #10b981;">ល្បែងកម្សាន្តរង់ចាំម្ហូប (Lucky Dice)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">បោះគ្រាប់ឡុកឡាក់សាកល្បងសំណាងរវាងពេលរង់ចាំម្ហូប៖</p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 20px; border-radius: 14px; margin-bottom: 15px;">
                    <div id="diceDisplay" style="font-size: 44px; margin-bottom: 8px;">🎲</div>
                    <div id="diceResultText" style="font-size: 14px; font-weight: 900; color: #10b981;">ចុចប៊ូតុងខាងក្រោមដើម្បីបោះ!</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #10b981; margin-bottom: 10px;" onclick="window.rollTheLuckyDice()">🎲 បោះគ្រាប់ឡុកឡាក់ (Roll)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmGameModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.rollTheLuckyDice = function() {
        const diceEl = document.getElementById('diceDisplay');
        const textEl = document.getElementById('diceResultText');
        
        diceEl.innerHTML = '🎯';
        textEl.innerText = 'កំពុងបោះគ្រាប់ឡុកឡាក់...';

        setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
            diceEl.innerHTML = faces[roll - 1];
            
            if (roll >= 5) {
                textEl.innerHTML = `<span style="color:#22c55e;">🎉 អបអរសាទរ! លេខ ${roll} (ឈ្នះកូដ SKM10)</span>`;
                if (typeof showToast === 'function') showToast('អបអរសាទរ! អ្នកទទួលបានសំណាងធំ!');
            } else {
                textEl.innerHTML = `<span style="color:#f59e0b;">😊 លេខ ${roll}! សាកល្បងម្តងទៀត!</span>`;
            }
        }, 600);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎯', 'ល្បែងកម្សាន្តរង់ចាំម្ហូប (Mini Game)', openMiniGameModal);
            clearInterval(initInt);
        }
    }, 500);
})();