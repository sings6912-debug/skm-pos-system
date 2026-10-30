(function() {
    console.log("🔍 Menu Quick Price Check Plugin Initialized!");

    function openPriceCheckModal() {
        if(document.getElementById('skmPriceCheckModal')) {
            document.getElementById('skmPriceCheckModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmPriceCheckModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🔍</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ពិនិត្យតម្លៃទំនិញរហ័ស</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">វាយឈ្មោះ ឬលេខកូដទំនិញដើម្បីពិនិត្យតម្លៃ៖</p>
                
                <input type="text" id="priceCheckInput" placeholder="ឈ្មោះ ឬលេខកូដ..." style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 12px; outline: none; margin-bottom: 12px; font-family:'Battambang';" oninput="window.executePriceCheck()">

                <div id="priceCheckResultBox" style="background: rgba(56,189,248,0.08); border: 1px solid var(--border-color); padding: 15px; border-radius: 14px; margin-bottom: 15px; text-align: center; display: none;">
                    <img id="pcImg" src="https://placehold.co/60" style="width: 60px; height: 60px; object-fit: contain; border-radius: 8px; background: #fff; margin-bottom: 6px;">
                    <div id="pcName" style="font-size: 13px; font-weight: 900; color: var(--text-dark); margin-bottom: 4px;">---</div>
                    <div id="pcPrice" style="font-size: 15px; font-weight: 900; color: #10b981;">$0.00</div>
                    <div id="pcStock" style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">ស្តុក: ---</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmPriceCheckModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.executePriceCheck = function() {
        const query = document.getElementById('priceCheckInput').value.trim().toLowerCase();
        const resBox = document.getElementById('priceCheckResultBox');
        if (!query) {
            resBox.style.display = 'none';
            return;
        }

        let inv = window.inventory || [];
        let match = inv.find(p => String(p.name).toLowerCase().includes(query) || String(p.id).toLowerCase().includes(query) || (p.customId && String(p.customId).toLowerCase().includes(query)));

        if (!match) {
            resBox.style.display = 'block';
            document.getElementById('pcName').innerText = 'រកមិនឃើញទំនិញនេះទេ';
            document.getElementById('pcPrice').innerText = '---';
            document.getElementById('pcStock').innerText = '---';
            document.getElementById('pcImg').src = 'https://placehold.co/60';
            return;
        }

        resBox.style.display = 'block';
        document.getElementById('pcName').innerText = match.name;
        document.getElementById('pcPrice').innerText = `$${parseFloat(match.price || 0).toFixed(2)}`;
        document.getElementById('pcStock').innerText = `ស្តុកនៅសល់: ${match.qty} ឯកតា`;
        document.getElementById('pcImg').src = match.image || 'https://placehold.co/60';
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔍', 'ពិនិត្យតម្លៃទំនិញរហ័ស (Price Check)', openPriceCheckModal);
            clearInterval(initInt);
        }
    }, 500);
})();