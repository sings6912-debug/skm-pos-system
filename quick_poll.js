(function() {
    console.log("📊 Menu Quick Poll Plugin Initialized!");

    function openQuickPollModal() {
        if(document.getElementById('skmPollModal')) {
            document.getElementById('skmPollModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmPollModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">📊</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #10b981;">ការស្ទង់មតិរហ័ស (Quick Poll)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">តើលោកអ្នកពេញចិត្តនឹងសេវាកម្ម និងមុខម្ហូប/ទំនិញក្នុងហាងយើងខ្ញុំកម្រិតណា?</p>
                
                <div id="pollOptionsBox" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
                    <button onclick="window.votePoll('⭐⭐⭐⭐⭐ ពេញចិត្តខ្លាំងណាស់')" style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">⭐⭐⭐⭐⭐ ពេញចិត្តខ្លាំងណាស់</button>
                    <button onclick="window.votePoll('⭐⭐⭐⭐ ល្អប្រសើរ')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">⭐⭐⭐⭐ ល្អប្រសើរ</button>
                    <button onclick="window.votePoll('⭐⭐⭐ ធម្មតា')" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">⭐⭐⭐ ធម្មតា / គួរកែទម្រង់</button>
                </div>

                <div id="pollResultMsg" style="font-size: 11px; color: #10b981; margin-bottom: 15px; display: none;"></div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981;" onclick="document.getElementById('skmPollModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.votePoll = function(choice) {
        localStorage.setItem('skm_user_poll_voted', choice);
        const msg = document.getElementById('pollResultMsg');
        if (msg) {
            msg.style.display = 'block';
            msg.innerText = `✅ អរគុណសម្រាប់ការបោះឆ្នោត: "${choice}"!`;
        }
        if (typeof showToast === 'function') showToast('អរគុណសម្រាប់ការចូលរួមស្ទង់មតិ!');
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📊', 'ការស្ទង់មតិរហ័ស (Quick Poll)', openQuickPollModal);
            clearInterval(initInt);
        }
    }, 500);
})();