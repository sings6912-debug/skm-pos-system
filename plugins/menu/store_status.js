(function() {
    console.log("🕒 Menu Store Status & Operating Hours Plugin Initialized!");

    function openStoreStatusModal() {
        if(document.getElementById('skmStatusModal')) {
            document.getElementById('skmStatusModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmStatusModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🕒</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #10b981;">ស្ថានភាពហាង & ម៉ោងបើក</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ពិនិត្យម៉ោងបម្រើការងាររបស់ហាងយើងខ្ញុំ៖</p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 15px; border-radius: 14px; margin-bottom: 15px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 8px;">
                    <div>🟢 <b>ស្ថានភាពបច្ចុប្បន្ន:</b> <span style="color:#10b981; font-weight:bold;">កំពុងបើកដំណើរការ (OPEN)</span></div>
                    <div>🕒 <b>ម៉ោងបើកហាង:</b> 08:00 ព្រឹក - 09:00 យប់</div>
                    <div>📅 <b>ថ្ងៃធ្វើការ:</b> បើកបំរើការរាល់ថ្ងៃ (ច័ន្ទ - អាទិត្យ)</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981;" onclick="document.getElementById('skmStatusModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🕒', 'ស្ថានភាពហាង & ម៉ោងបើក (Status)', openStoreStatusModal);
            clearInterval(initInt);
        }
    }, 500);
})();