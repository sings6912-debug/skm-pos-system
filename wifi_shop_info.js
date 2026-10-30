(function() {
    console.log("ℹ️ Menu Shop Info & WiFi Plugin Initialized!");

    function openShopInfoModal() {
        if(document.getElementById('skmShopInfoModal')) {
            document.getElementById('skmShopInfoModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmShopInfoModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">🏪</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: var(--brand-cyan, #06b6d4);">ព័ត៌មានហាង & WiFi</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 20px;">ព័ត៌មានសំខាន់ៗអំពីទីតាំង និងសេវាកម្មក្នុងហាង៖</p>
                
                <div style="background: rgba(128,128,128,0.08); border: 1px solid var(--border-color); padding: 12px; border-radius: 12px; margin-bottom: 15px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 8px;">
                    <div>📶 <b>WiFi Name:</b> SKM_Guest_WiFi</div>
                    <div>🔑 <b>Password:</b> skm123456</div>
                    <div>🕒 <b>ម៉ោងបើកហាង:</b> 08:00 AM - 09:00 PM</div>
                    <div>📍 <b>ទីតាំង:</b> ផ្ទះលេខ ១២៣, ផ្លូវ មុខហាង</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(6,182,212,0.1); color:var(--brand-cyan);" onclick="document.getElementById('skmShopInfoModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('ℹ️', 'ព័ត៌មានហាង & លេខសម្ងាត់ WiFi', openShopInfoModal);
            clearInterval(initInt);
        }
    }, 500);
})();