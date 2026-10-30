(function() {
    console.log("🌟 Menu Daily Motivation & Affirmation Plugin Initialized!");

    function openMotivationModal() {
        if(document.getElementById('skmMotivationModal')) {
            document.getElementById('skmMotivationModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmMotivationModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(168,85,247,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">🌟</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #a855f7;">កាតលើកទឹកចិត្តប្រចាំថ្ងៃ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ពាក្យពេចន៍លើកទឹកចិត្ត និងថាមពលវិជ្ជមានថ្ងៃនេះ៖</p>
                
                <div style="background: rgba(168,85,247,0.08); border: 1px dashed #a855f7; padding: 18px; border-radius: 16px; margin-bottom: 15px; text-align: center; min-height: 90px; display: flex; align-items: center; justify-content: center;">
                    <span id="motivationQuoteText" style="font-size: 13px; font-weight: bold; color: var(--text-dark, #fff); line-height: 1.5;">"ជោគជ័យកើតចេញពីការតស៊ូព្យាយាមបន្តិចម្តងៗរាល់ថ្ងៃ!"</span>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #a855f7; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.getRandomMotivationQuote()">✨ ប្តូរពាក្យពេចន៍ថ្មី</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(168,85,247,0.1); color:#a855f7; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmMotivationModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.getRandomMotivationQuote = function() {
        const quotes = [
            "✨ ជោគជ័យកើតចេញពីការតស៊ូព្យាយាមបន្តិចម្តងៗរាល់ថ្ងៃ!",
            "🌟 រាល់ថ្ងៃគឺជាឱកាសថ្មីដើម្បីធ្វើរឿងអស្ចារ្យសម្រាប់ខ្លួនឯង!",
            "💫 ភាពវិជ្ជមានក្នុងចិត្តនាំមកនូវភាពរុងរឿងក្នុងជីវិត!",
            "🍀 មិនថាមានរឿងអ្វីកើតឡើងទេ ញញឹមស្វាគមន៍ថ្ងៃថ្មីទាំងអស់គ្នា!",
            "🚀 ការខិតខំប្រឹងប្រែងរបស់អ្នកថ្ងៃនេះ គឺជាអនាគតដ៏ល្អថ្ងៃស្អែក!"
        ];
        let rand = quotes[Math.floor(Math.random() * quotes.length)];
        const txt = document.getElementById('motivationQuoteText');
        if (txt) txt.innerText = rand;
        if (typeof showToast === 'function') showToast('🌟 បានទទួលថាមពលវិជ្ជមានថ្មី!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🌟', 'កាតលើកទឹកចិត្តប្រចាំថ្ងៃ (Motivation)', openMotivationModal);
            clearInterval(initInt);
        }
    }, 500);
})();