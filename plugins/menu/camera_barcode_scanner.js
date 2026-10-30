(function() {
    console.log("📷 Menu Camera Barcode Scanner Plugin Initialized!");

    function openCameraScannerModal() {
        if(document.getElementById('skmScanModal')) {
            document.getElementById('skmScanModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmScanModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">📷</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">ស្វែងរកទំនិញតាមបាកូដ (Scanner)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">បញ្ចូលលេខកូដទំនិញ ឬ Barcode ដើម្បីស្វែងរកភ្លាមៗ៖</p>
                
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <input type="text" id="scanCodeInput" placeholder="ឧ. SKM-102938..." style="flex: 1; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 12px; color: #fff; font-size: 12px; outline: none; font-family: 'Battambang';" onkeydown="if(event.key==='Enter') window.executeScanLookup()">
                    <button onclick="window.executeScanLookup()" style="background: linear-gradient(135deg, #38bdf8, #2563eb); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">ស្វែងរក</button>
                </div>

                <div id="scanResultBox" style="background: rgba(56,189,248,0.08); border: 1px dashed #38bdf8; padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: center; display: none;">
                    <img id="scanResImg" src="https://placehold.co/60" style="width: 50px; height: 50px; object-fit: contain; border-radius: 8px; background: #fff; margin-bottom: 4px;">
                    <div id="scanResName" style="font-size: 13px; font-weight: 900; color: #38bdf8;">---</div>
                    <div id="scanResPrice" style="font-size: 14px; font-weight: 900; color: #10b981; margin-top: 2px;">$0.00</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 10px;" onclick="document.getElementById('skmScanModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.executeScanLookup = function() {
        const inp = document.getElementById('scanCodeInput');
        const code = inp.value.trim().toLowerCase();
        const box = document.getElementById('scanResultBox');
        if (!code) return;

        let inv = window.inventory || [];
        let match = inv.find(p => String(p.id).toLowerCase() === code || (p.customId && String(p.customId).toLowerCase() === code) || String(p.name).toLowerCase().includes(code));

        if (!match) {
            box.style.display = 'block';
            document.getElementById('scanResName').innerText = 'រកមិនឃើញទំនិញជាមួយកូដនេះទេ';
            document.getElementById('scanResPrice').innerText = '---';
            document.getElementById('scanResImg').src = 'https://placehold.co/60';
            return;
        }

        box.style.display = 'block';
        document.getElementById('scanResName').innerText = match.name;
        document.getElementById('scanResPrice').innerText = `$${parseFloat(match.price || 0).toFixed(2)}`;
        document.getElementById('scanResImg').src = match.image || 'https://placehold.co/60';

        if (typeof window.openProductByName === 'function') {
            window.openProductByName(match.name);
            document.getElementById('skmScanModal').style.display = 'none';
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📷', 'ស្វែងរកទំនិញតាមបាកូដ (Scanner)', openCameraScannerModal);
            clearInterval(initInt);
        }
    }, 500);
})();