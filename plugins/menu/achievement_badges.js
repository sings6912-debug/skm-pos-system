(function() {
    console.log("🏅 Menu Loyalty Achievement Badges Plugin Initialized!");

    function openBadgesModal() {
        if(document.getElementById('skmBadgesModal')) {
            document.getElementById('skmBadgesModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmBadgesModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">🏅</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">ពានរង្វាន់ & មដាល់សមិទ្ធផល</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">មដាល់ដែលអ្នកទទួលបានពីការកុម្មង់ប្រចាំហាង៖</p>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px; text-align: left;">
                    <div style="background: rgba(245,158,11,0.08); border: 1px solid #f59e0b; padding: 12px; border-radius: 14px; text-align: center;">
                        <div style="font-size: 28px; margin-bottom: 4px;">☕</div>
                        <b style="color: #f59e0b; font-size: 12px; display: block;">Coffee Master</b>
                        <span style="font-size: 10px; color: #10b981; font-weight: bold;">[ដោះសោររួច]</span>
                    </div>
                    <div style="background: rgba(128,128,128,0.06); border: 1px solid var(--border-color); padding: 12px; border-radius: 14px; text-align: center; opacity: 0.6;">
                        <div style="font-size: 28px; margin-bottom: 4px;">🍜</div>
                        <b style="color: var(--text-dark); font-size: 12px; display: block;">Spicy King</b>
                        <span style="font-size: 10px; color: var(--text-muted);">[បន្តកុម្មង់ ៥ ដង]</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmBadgesModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🏅', 'ពានរង្វាន់ & សមិទ្ធផល (Badges)', openBadgesModal);
            clearInterval(initInt);
        }
    }, 500);
})();