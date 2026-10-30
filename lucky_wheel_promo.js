(function() {
    console.log("🎡 Menu Lucky Wheel Coupon Plugin Initialized!");

    const style = document.createElement('style');
    style.innerHTML = `
        .skm-wheel-fab {
            position: fixed; bottom: 155px; right: 20px; width: 48px; height: 48px;
            background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; font-size: 22px;
            box-shadow: 0 4px 15px rgba(245,158,11,0.5); z-index: 840; cursor: pointer; transition: transform 0.2s;
            animation: wheelPulse 2s infinite;
        }
        @keyframes wheelPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); box-shadow: 0 0 20px rgba(245,158,11,0.8); }
            100% { transform: scale(1); }
        }
        .skm-wheel-fab:active { transform: scale(0.95); }
    `;
    document.head.appendChild(style);

    function injectWheelFab() {
        if (document.getElementById('skmWheelFab')) return;
        const fab = document.createElement('div');
        fab.id = 'skmWheelFab';
        fab.className = 'skm-wheel-fab';
        fab.innerHTML = '🎡';
        fab.title = 'កង់សំណាងឈ្នះរង្វាន់';
        fab.onclick = openLuckyWheelModal;
        document.body.appendChild(fab);
    }

    function openLuckyWheelModal() {
        if (document.getElementById('skmWheelModal')) {
            document.getElementById('skmWheelModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmWheelModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 40px; margin-bottom: 10px;">🎁</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">កង់សំណាងប្រូម៉ូសិន</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 20px;">ចុចប៊ូតុងខាងក្រោមដើម្បីបង្វិលយករង្វាន់បញ្ចុះតម្លៃពិសេស!</p>
                
                <div id="wheelResultBox" style="background: rgba(245,158,11,0.1); border: 1px dashed #f59e0b; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                    <div id="wheelResultText" style="font-size: 16px; font-weight: 900; color: #f59e0b;">រួចរាល់ដើម្បីបង្វិល!</div>
                </div>

                <button id="spinBtn" class="btn-act btn-green" style="width: 100%; background: #f59e0b; margin-bottom: 10px;" onclick="window.spinTheLuckyWheel()">🎲 បង្វិលឥឡូវនេះ (SPIN)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmWheelModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.spinTheLuckyWheel = function() {
        const btn = document.getElementById('spinBtn');
        const resText = document.getElementById('wheelResultText');
        btn.disabled = true;
        btn.innerText = '⏳ កំពុងបង្វិល...';

        let count = 0;
        const rewards = ['🎉 ឈ្នះកូដ SKM10 (បញ្ចុះ 10%)!', '🔥 ឈ្នះកូដ LUCKY5 (បញ្ចុះ $5)!', '🌟 ឈ្នះកូដ FREESHIP (ហ្វ្រីសេវាដឹក)!'];
        
        const interval = setInterval(() => {
            resText.innerText = rewards[Math.floor(Math.random() * rewards.length)];
            count++;
            if (count > 10) {
                clearInterval(interval);
                const finalReward = rewards[Math.floor(Math.random() * rewards.length)];
                resText.innerHTML = `<span style="color:#22c55e;">${finalReward}</span>`;
                btn.innerText = '✅ រួចរាល់ (Claimed)';
                if (typeof showToast === 'function') showToast('អបអរសាទរ! អ្នកទទួលបានកូដបញ្ចុះតម្លៃ!');
            }
        }, 150);
    };

    const initInt = setInterval(() => {
        if (document.body) {
            injectWheelFab();
            clearInterval(initInt);
        }
    }, 500);
})();