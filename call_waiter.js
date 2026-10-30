(function() {
    console.log("🛎️ Menu Call Waiter & Service Bell Plugin Initialized!");

    function openCallWaiterModal() {
        if(document.getElementById('skmWaiterModal')) {
            document.getElementById('skmWaiterModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmWaiterModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        let savedTable = localStorage.getItem('skm_selected_table') || 'តុលេខ ១';

        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">🛎️</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #ec4899;">ហៅបុគ្គលិក / សេវាកម្ម</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ទីតាំង: <b style="color:#38bdf8;">${savedTable}</b></p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
                    <button class="skm-waiter-btn" onclick="window.sendWaiterRequest('💧 សុំទឹកកក / ទឹកផឹក')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.2s; text-align: left; display:flex; align-items:center; gap:10px;">💧 សុំទឹកកក / ទឹកផឹកបន្ថែម</button>
                    <button class="skm-waiter-btn" onclick="window.sendWaiterRequest('🧾 សុំគិតលុយ (Request Bill)')" style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.2s; text-align: left; display:flex; align-items:center; gap:10px;">🧾 សុំគិតលុយ (Request Bill)</button>
                    <button class="skm-waiter-btn" onclick="window.sendWaiterRequest('🧹 សម្អាតតុ (Clean Table)')" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.2s; text-align: left; display:flex; align-items:center; gap:10px;">🧹 សម្អាតតុអាហារ / เก็บโต๊ะ</button>
                    <button class="skm-waiter-btn" onclick="window.sendWaiterRequest('🙋 ហៅបុគ្គលិកមកជួយ (Call Staff)')" style="background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid #ef4444; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.2s; text-align: left; display:flex; align-items:center; gap:10px;">🙋 ហៅបុគ្គលិកមកជួយផ្ទាល់</button>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(128,128,128,0.1);" onclick="document.getElementById('skmWaiterModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.sendWaiterRequest = function(reqType) {
        let savedTable = localStorage.getItem('skm_selected_table') || 'តុលេខ ១';
        let requests = JSON.parse(localStorage.getItem('skm_waiter_requests') || '[]');
        
        requests.unshift({
            type: reqType,
            table: savedTable,
            time: new Date().toLocaleTimeString('km-KH'),
            status: 'pending'
        });
        
        localStorage.setItem('skm_waiter_requests', JSON.stringify(requests));
        document.getElementById('skmWaiterModal').style.display = 'none';
        
        if (typeof showToast === 'function') showToast(`បានផ្ញើសំណើ "${reqType}" ទៅកាន់បុគ្គលិកហើយ!`);
        else alert(`បានផ្ញើសំណើ "${reqType}" ទៅកាន់បុគ្គលិកហើយ!`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🛎️', 'ហៅបុគ្គលិក / សុំសេវាកម្ម', openCallWaiterModal);
            clearInterval(initInt);
        }
    }, 500);
})();