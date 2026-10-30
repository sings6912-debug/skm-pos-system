(function() {
    console.log("🧮 Menu Bill Splitter & Tip Calculator Plugin Initialized!");

    function openBillSplitterModal() {
        if(document.getElementById('skmSplitterModal')) {
            document.getElementById('skmSplitterModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmSplitterModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">🧮</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">គណនាចែកប្រាក់គ្នាទូទាត់</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">គណនាប្រាក់ត្រូវបង់ក្នុងមនុស្សម្នាក់ៗ (Bill Splitter):</p>
                
                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">ទឹកប្រាក់សរុប ($):</div>
                <input type="number" id="splitTotalInput" placeholder="25.00" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 14px; outline: none; margin-bottom: 12px;" oninput="window.calcSplitResult()">

                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">ចំនួនអ្នកញ៉ាំ / ចែកគ្នា (People):</div>
                <input type="number" id="splitPeopleInput" value="2" min="1" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 14px; outline: none; margin-bottom: 15px;" oninput="window.calcSplitResult()">

                <div style="background: rgba(56,189,248,0.08); border: 1px solid var(--border-color); padding: 15px; border-radius: 12px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted);">ប្រាក់ត្រូវបង់ក្នុងមនុស្សម្នាក់:</div>
                    <div id="splitResultDisplay" style="font-size: 22px; font-weight: 900; color: #38bdf8; margin-top: 5px;">$0.00</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmSplitterModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.calcSplitResult = function() {
        const tot = parseFloat(document.getElementById('splitTotalInput').value) || 0;
        const ppl = parseInt(document.getElementById('splitPeopleInput').value) || 1;
        const disp = document.getElementById('splitResultDisplay');
        if (disp) {
            let each = tot / Math.max(1, ppl);
            disp.innerText = `$${each.toFixed(2)}`;
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🧮', 'គណនាចែកប្រាក់គ្នាទូទាត់ (Split Bill)', openBillSplitterModal);
            clearInterval(initInt);
        }
    }, 500);
})();