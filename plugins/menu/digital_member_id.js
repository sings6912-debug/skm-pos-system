(function() {
    console.log("🪪 Menu Digital Member ID Card Plugin Initialized!");

    function openDigitalIdModal() {
        if(document.getElementById('skmDigitalIdModal')) {
            document.getElementById('skmDigitalIdModal').style.display = 'flex';
            updateDigitalIdDetails();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmDigitalIdModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 38px; margin-bottom: 5px;">🪪</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">កាតសមាជិកឌីជីថល (Digital ID)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">បង្ហាញកាតនេះពេលទូទាត់ប្រាក់ដើម្បីรับសិទ្ធិពិសេស៖</p>
                
                <div style="background: linear-gradient(135deg, #0284c7, #06b6d4); color: white; padding: 20px; border-radius: 16px; margin-bottom: 15px; text-align: left; box-shadow: 0 10px 25px rgba(6,182,212,0.4); position: relative; overflow: hidden;">
                    <div style="font-size: 10px; opacity: 0.8; letter-spacing: 1px;">DIGITAL VIP MEMBER CARD</div>
                    <div id="digCardName" style="font-size: 16px; font-weight: 900; margin: 10px 0 4px 0;">អតិថិជនកិត្តិយស</div>
                    <div id="digCardId" style="font-size: 11px; font-family: monospace; opacity: 0.9; margin-bottom: 15px;">ID: SKM-VIP-88921</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                        <span>ពិន្ទុ: <b id="digCardPoints">0 pts</b></span>
                        <span style="background: rgba(255,255,255,0.25); padding: 2px 8px; border-radius: 6px; font-weight: bold;">PLATINUM</span>
                    </div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(56,189,248,0.06); padding: 10px; border-radius: 10px; border: 1px solid var(--border-color);">
                    💡 កាតនេះត្រូវបានភ្ជាប់ដោយស្វ័យប្រវត្តិជាមួយប្រព័ន្ធគិតលុយ (POS) របស់ហាង។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmDigitalIdModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        updateDigitalIdDetails();
    }

    function updateDigitalIdDetails() {
        const nameEl = document.getElementById('digCardName');
        const ptsEl = document.getElementById('digCardPoints');
        if (!nameEl) return;

        let vipData = JSON.parse(localStorage.getItem('skm_vip_member_data') || 'null');
        if (vipData && vipData.name) {
            nameEl.innerText = vipData.name;
        } else {
            nameEl.innerText = 'អតិថិជនទូទៅ (Guest)';
        }

        let pts = localStorage.getItem('skm_pts') || '0';
        if (ptsEl) ptsEl.innerText = `${pts} pts`;
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🪪', 'កាតសមាជិកឌីជីថល (Digital ID)', openDigitalIdModal);
            clearInterval(initInt);
        }
    }, 500);
})();