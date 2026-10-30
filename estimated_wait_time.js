(function() {
    console.log("⏱️ Menu Estimated Wait Time Plugin Initialized!");

    function openWaitTimeModal() {
        if(document.getElementById('skmWaitModal')) {
            document.getElementById('skmWaitModal').style.display = 'flex';
            calcWaitTime();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmWaitModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">⏱️</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ប៉ាន់ស្មានពេលវេលារង់ចាំ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ពេលវេលារង់ចាំរៀបចំទំនិញក្នុងកន្ត្រករបស់អ្នក៖</p>
                
                <div style="background: rgba(56,189,248,0.08); border: 1px solid var(--border-color); padding: 20px; border-radius: 14px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted);">រយៈពេលរង់ចាំប៉ាន់ស្មាន:</div>
                    <div id="waitTimeDisplay" style="font-size: 26px; font-weight: 900; color: #38bdf8; margin-top: 6px;">10 - 15 នាទី</div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px; text-align: left;">
                    💡 ពេលវេលានេះផ្អែកលើចំនួនទំនិញសរុបក្នុងកន្ត្រក និងស្ថានភាពអតិថិជនបច្ចុប្បន្នក្នុងហាង។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmWaitModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        calcWaitTime();
    }

    function calcWaitTime() {
        const display = document.getElementById('waitTimeDisplay');
        if (!display) return;

        let totalItems = 0;
        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
            cart.forEach(item => {
                totalItems += parseInt(item.qty || 1);
            });
        }

        let mins = 5 + (totalItems * 3);
        display.innerText = `${mins} - ${mins + 5} នាទី`;
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('⏱️', 'ប៉ាន់ស្មានពេលវេលារង់ចាំ (Wait Time)', openWaitTimeModal);
            clearInterval(initInt);
        }
    }, 500);
})();