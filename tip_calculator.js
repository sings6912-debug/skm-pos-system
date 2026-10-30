(function() {
    console.log("💸 Menu Tip & Service Charge Calculator Plugin Initialized!");

    function openTipCalcModal() {
        if(document.getElementById('skmTipModal')) {
            document.getElementById('skmTipModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmTipModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">💸</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #10b981;">គណនាប្រាក់ធីប & សេវាកម្ម</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">គណនាប្រាក់ធីបជូនបុគ្គលិក (Tip Calculator):</p>
                
                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">ទឹកប្រាក់វិក្កយបត្រសរុប ($):</div>
                <input type="number" id="tipTotalInput" placeholder="20.00" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 14px; outline: none; margin-bottom: 12px;" oninput="window.calcTipResult()">

                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 6px;">ភាគរយធីប (Tip Rate):</div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 15px;">
                    <button onclick="window.setTipPercent(5)" style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">5%</button>
                    <button onclick="window.setTipPercent(10)" style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">10%</button>
                    <button onclick="window.setTipPercent(15)" style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">15%</button>
                    <button onclick="window.setTipPercent(20)" style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">20%</button>
                </div>

                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 15px; border-radius: 12px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted);">ទឹកប្រាក់ធីបត្រូវជូន: <b id="tipAmountDisplay" style="color: #10b981;">$0.00</b></div>
                    <div id="tipGrandTotalDisplay" style="font-size: 20px; font-weight: 900; color: #10b981; margin-top: 5px;">សរុបទាំងអស់: $0.00</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981;" onclick="document.getElementById('skmTipModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        window.activeTipRate = 10;
    }

    window.setTipPercent = function(rate) {
        window.activeTipRate = rate;
        window.calcTipResult();
    };

    window.calcTipResult = function() {
        const tot = parseFloat(document.getElementById('tipTotalInput').value) || 0;
        const rate = window.activeTipRate || 10;
        const tipDisp = document.getElementById('tipAmountDisplay');
        const grandDisp = document.getElementById('tipGrandTotalDisplay');
        
        let tip = tot * (rate / 100);
        let grand = tot + tip;

        if (tipDisp) tipDisp.innerText = `$${tip.toFixed(2)} (${rate}%)`;
        if (grandDisp) grandDisp.innerText = `សរុបទាំងអស់: $${grand.toFixed(2)}`;
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💸', 'គណនាប្រាក់ធីប & សេវាកម្ម (Tip)', openTipCalcModal);
            clearInterval(initInt);
        }
    }, 500);
})();