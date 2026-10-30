/* STREAMING_CHUNK:Initializing Modern Barcode & SKU Generator Plugin... */
(function() {
    console.log("🔤 POS Modern Barcode & SKU Generator Plugin Initialized!");

    /* STREAMING_CHUNK:Building Refined Minimalist UI... */
    function openBarcodeModal() {
        if(document.getElementById('skmBarcodeModal')) {
            document.getElementById('skmBarcodeModal').style.display = 'flex';
            window.generateNewBarcode();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmBarcodeModal';
        // Glassmorphism Backdrop & Standard Font
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        /* STREAMING_CHUNK:Injecting Clean CSS and Layout... */
        modal.innerHTML = `
            <style>
                .skm-bar-box { background: var(--bg-card, #ffffff); color: var(--text-main, #1e293b); padding: 25px; border-radius: 20px; width: 100%; max-width: 420px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.2); border: 1px solid var(--border, #e2e8f0); display: flex; flex-direction: column; gap: 14px; box-sizing: border-box; }
                .skm-bar-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border, #f1f5f9); padding-bottom: 12px; margin-bottom: 2px; }
                .skm-bar-input { font-size: 14px; padding: 10px 12px; border-radius: 10px; border: 1.5px solid #cbd5e1; width: 100%; transition: all 0.2s ease; background: var(--store-bg, #f8fafc); outline: none; color: var(--text-main, #1e293b); font-family: inherit; box-sizing: border-box; font-weight: bold; }
                .skm-bar-input:focus { border-color: #38bdf8; background: #ffffff; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1); }
                .skm-bar-card { background: #f8fafc; border: 1.5px dashed #38bdf8; border-radius: 16px; padding: 18px; text-align: center; }
                .skm-btn-action { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; width: 100%; transition: 0.2s; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25); font-family: inherit; }
                .skm-btn-action:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(14, 165, 233, 0.35); }
                .skm-btn-copy { background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; flex: 1; transition: 0.2s; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25); font-family: inherit; }
                .skm-btn-copy:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(16, 185, 129, 0.35); }
                .skm-btn-close { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; flex: 1; transition: 0.2s; text-align: center; font-family: inherit; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
            </style>
            
            <div class="skm-bar-box">
                <div class="skm-bar-header">
                    <h3 style="margin:0; font-size:16px; display: flex; align-items: center; gap: 8px; color: #0ea5e9; font-weight: 800;">
                        <span>🔤</span> បង្កើត Barcode / SKU
                    </h3>
                    <button onclick="document.getElementById('skmBarcodeModal').style.display='none'" style="background: #fef2f2; border: 1px solid #fca5a5; color: #ef4444; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">✕</button>
                </div>
                
                <div>
                    <label style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">បុព្វបទកូដ (Prefix)</label>
                    <input type="text" id="skmBarPrefix" class="skm-bar-input" value="SKM">
                </div>

                <button class="skm-btn-action" onclick="window.generateNewBarcode()">✨ បង្កើតលេខកូដថ្មី</button>

                <div class="skm-bar-card">
                    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">លេខកូដបង្កើតបាន</div>
                    <div id="skmGeneratedBarResult" style="font-size: 24px; font-weight: 900; color: #0284c7; font-family: monospace; letter-spacing: 1px;">SKM-882910</div>
                </div>

                <div style="display:flex; gap:10px; margin-top: 2px;">
                    <button class="skm-btn-close" onclick="document.getElementById('skmBarcodeModal').style.display='none'">បិទ</button>
                    <button class="skm-btn-copy" onclick="window.copyGeneratedBarcode()">📋 ចម្លង (Copy)</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        window.generateNewBarcode();
    }

    /* STREAMING_CHUNK:Implementing Generator Logic... */
    window.generateNewBarcode = function() {
        const prefixInput = document.getElementById('skmBarPrefix');
        const resultBox = document.getElementById('skmGeneratedBarResult');
        if(!prefixInput || !resultBox) return;

        const prefix = prefixInput.value.trim() || 'SKM';
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        resultBox.innerText = `${prefix}-${randomNum}`;
    };

    /* STREAMING_CHUNK:Implementing Copy to Clipboard... */
    window.copyGeneratedBarcode = function() {
        const code = document.getElementById('skmGeneratedBarResult').innerText;
        navigator.clipboard.writeText(code).then(() => {
            if(typeof window.showToast === 'function') {
                window.showToast('✅ បានចម្លងលេខកូដចូល Clipboard!');
            } else {
                alert('បានចម្លងលេខកូដ: ' + code);
            }
        });
    };

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🔤', 'បង្កើត Barcode/SKU រហ័ស', openBarcodeModal);
            clearInterval(initInt);
        }
    }, 500);
})();