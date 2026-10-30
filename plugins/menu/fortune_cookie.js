(function() {
    console.log("🥠 Menu Fortune Cookie & Daily Lucky Plugin Initialized!");

    function openFortuneModal() {
        if(document.getElementById('skmFortuneModal')) {
            document.getElementById('skmFortuneModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmFortuneModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 44px; margin-bottom: 5px; animation: fortuneBounce 2s infinite;">🥠</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">គុកឃីទស្សន៍ទាយសំណាង</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">បើកខូឃីដើម្បីស្វែងយល់ពីសំណាង និងកូដបញ្ចុះតម្លៃថ្ងៃនេះ៖</p>
                
                <div id="fortuneBox" style="background: rgba(245,158,11,0.08); border: 1px dashed #f59e0b; padding: 16px; border-radius: 16px; margin-bottom: 15px; text-align: center; min-height: 80px; display: flex; align-items: center; justify-content: center;">
                    <span id="fortuneText" style="font-size: 13px; font-weight: bold; color: var(--text-dark);">ចុចប៊ូតុងខាងក្រោមដើម្បីបំបែកខូឃី!</span>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #f59e0b; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px;" onclick="window.crackFortuneCookie()">🥠 បំបែកខូឃីទស្សន៍ទាយ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px;" onclick="document.getElementById('skmFortuneModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fortuneBounce {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.1) rotate(5deg); }
            }
        `;
        document.head.appendChild(style);
    }

    window.crackFortuneCookie = function() {
        const txt = document.getElementById('fortuneText');
        if(!txt) return;

        const fortunes = [
            "✨ សំណាងល្អកំពុងរង់ចាំអ្នកថ្ងៃនេះ! កូដបញ្ចុះតម្លៃ: FORTUNE10 (-10%)",
            "🌟 ការខិតខំប្រឹងប្រែងរបស់អ្នកនឹងទទួលបានផលផ្លែផ្កា! កូដ: LUCKY15 (-$1.50)",
            "💫 ថ្ងៃនេះជាថ្ងៃដ៏ល្អបំផុតសម្រាប់ការចាប់ផ្តើមថ្មី! កូដ: SMILE5 (-$0.50)",
            "🍀 ភាពរុងរឿង និងសុខភាពល្អនឹងមានដល់អ្នក! កូដ: FREESHIP (ហ្វ្រីសេវាដឹក)"
        ];

        let randomMsg = fortunes[Math.floor(Math.random() * fortunes.length)];
        txt.innerHTML = `<span style="color: #f59e0b; font-size: 13px; line-height: 1.4;">${randomMsg}</span>`;
        
        if (typeof showToast === 'function') showToast('🎉 បំបែកខូឃីជោគជ័យ បានទទួលកូដសំណាង!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🥠', 'គុកឃីទស្សន៍ទាយសំណាង (Fortune)', openFortuneModal);
            clearInterval(initInt);
        }
    }, 500);
})();