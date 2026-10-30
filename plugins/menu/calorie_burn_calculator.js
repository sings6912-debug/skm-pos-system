(function() {
    console.log("🏃 Menu Calorie Burn Calculator Plugin Initialized!");

    function openCalorieBurnModal() {
        if(document.getElementById('skmBurnModal')) {
            document.getElementById('skmBurnModal').style.display = 'flex';
            calcBurnTime();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmBurnModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 38px; margin-bottom: 5px;">🏃</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">គណនាពេលវេលាដុតកាឡូរី</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ពេលវេលាត្រូវហាត់ប្រាណដើម្បីដុតកាឡូរីក្នុងកន្ត្រក៖</p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 8px;" id="burnDetailsBox">
                    <div>🚶 <b>ដើរលឿន (Walking):</b> <span id="burnWalk" style="color: #10b981; font-weight: bold;">0 នាទី</span></div>
                    <div>🏃 <b>រត់ហាត់ប្រាណ (Jogging):</b> <span id="burnRun" style="color: #f59e0b; font-weight: bold;">0 នាទី</span></div>
                    <div>🚴 <b>ជិះកង់ (Cycling):</b> <span id="burnCycle" style="color: #38bdf8; font-weight: bold;">0 នាទី</span></div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px; text-align: left;">
                    💡 ការគណនានេះផ្អែកលើបរិមាណកាឡូរីប៉ាន់ស្មាននៃទំនិញសរុបក្នុងកន្ត្រករបស់អ្នក។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmBurnModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        calcBurnTime();
    }

    function calcBurnTime() {
        let totalItems = 0;
        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
            cart.forEach(item => {
                totalItems += parseInt(item.qty || 1);
            });
        }

        // สมมติ 1 หน่วย = 250 kcal
        let totalCals = totalItems * 250;
        if (totalCals === 0) totalCals = 250; // Default 1 item equivalent

        // Burn rates: Walk ~4 kcal/min, Run ~10 kcal/min, Cycle ~7 kcal/min
        let walkMins = Math.round(totalCals / 4);
        let runMins = Math.round(totalCals / 10);
        let cycleMins = Math.round(totalCals / 7);

        const walkEl = document.getElementById('burnWalk');
        const runEl = document.getElementById('burnRun');
        const cycleEl = document.getElementById('burnCycle');

        if (walkEl) walkEl.innerText = `${walkMins} នាទី`;
        if (runEl) runEl.innerText = `${runMins} នាទី`;
        if (cycleEl) cycleEl.innerText = `${cycleMins} នាទី`;
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🏃', 'គណនាពេលវេលាដុតកាឡូរី (Calorie Burn)', openCalorieBurnModal);
            clearInterval(initInt);
        }
    }, 500);
})();