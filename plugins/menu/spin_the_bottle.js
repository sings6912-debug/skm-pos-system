(function() {
    console.log("🍾 Menu Spin the Bottle Plugin Initialized!");

    function openBottleSpinModal() {
        if(document.getElementById('skmBottleModal')) {
            document.getElementById('skmBottleModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmBottleModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(236,72,153,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 38px; margin-bottom: 5px;">🍾</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #ec4899;">ល្បែងបង្វិលដបឈ្នះរង្វាន់</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">បង្វិលដបដើម្បីសាកល្បងសំណាង និងឈ្នះរង្វាន់ពិសេស៖</p>
                
                <div style="background: rgba(236,72,153,0.08); border: 1px dashed #ec4899; padding: 20px; border-radius: 16px; margin-bottom: 15px; text-align: center;">
                    <div id="bottleIcon" style="font-size: 48px; margin-bottom: 8px; transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);">🍾</div>
                    <div id="bottleResultText" style="font-size: 14px; font-weight: 900; color: #ec4899;">ចុចប៊ូតុងខាងក្រោមដើម្បីបង្វិល!</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #ec4899; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.spinTheBottleGame()">🍾 បង្វិលដប (Spin)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(236,72,153,0.1); color:#ec4899; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmBottleModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.spinTheBottleGame = function() {
        const bottle = document.getElementById('bottleIcon');
        const text = document.getElementById('bottleResultText');
        if (!bottle) return;

        bottle.style.transform = `rotate(${Math.floor(720 + Math.random() * 1080)}deg)`;
        text.innerText = 'កំពុងបង្វិលដបសំណាង...';

        setTimeout(() => {
            const rewards = [
                '🎉 អបអរសាទរ! បានទទួលកូដ BOTTLE10 (-10%)',
                '🌟 ឈ្នះកូដបញ្ចុះតម្លៃ $2.00!',
                '💫 ឈ្នះសេវាដឹកជញ្ជូនឥតគិតថ្លៃ!',
                '🍀 ទទួលបានពិន្ទុបន្ថែម ២០ ភិន្ទុ!'
            ];
            let randReward = rewards[Math.floor(Math.random() * rewards.length)];
            text.innerHTML = `<span style="color: #10b981; font-size: 13px;">${randReward}</span>`;
            if (typeof showToast === 'function') showToast('🎉 បង្វិលដបឈ្នះរង្វាន់ជោគជ័យ!');
        }, 1000);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🍾', 'ល្បែងបង្វិលដបឈ្នះរង្វាន់ (Spin)', openBottleSpinModal);
            clearInterval(initInt);
        }
    }, 500);
})();