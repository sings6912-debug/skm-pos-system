(function() {
    console.log("⚖️ Menu Product Comparison Plugin Initialized!");

    function openCompareModal() {
        if(document.getElementById('skmCompareModal')) {
            document.getElementById('skmCompareModal').style.display = 'flex';
            loadCompareDropdowns();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmCompareModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 420px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">⚖️</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ប្រៀបធៀបទំនិញ (Comparison)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ជ្រើសរើសទំនិញ២មុខដើម្បីប្រៀបធៀបតម្លៃ និងលក្ខណៈ៖</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div>
                        <label style="font-size:11px; display:block; margin-bottom:4px; color:var(--text-muted);">ទំនិញទី ១:</label>
                        <select id="compItem1" class="skm-comp-select" onchange="window.updateComparisonView()" style="width:100%; background:var(--store-bg, #0f172a); color:var(--text-dark, #fff); border:1px solid var(--border-color); padding:8px; border-radius:8px; font-size:11px; outline:none;">
                            <option value="">-- រើស --</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:11px; display:block; margin-bottom:4px; color:var(--text-muted);">ទំនិញទី ២:</label>
                        <select id="compItem2" class="skm-comp-select" onchange="window.updateComparisonView()" style="width:100%; background:var(--store-bg, #0f172a); color:var(--text-dark, #fff); border:1px solid var(--border-color); padding:8px; border-radius:8px; font-size:11px; outline:none;">
                            <option value="">-- រើស --</option>
                        </select>
                    </div>
                </div>

                <div id="compareResultContainer" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; background: rgba(56,189,248,0.06); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color); text-align: center; font-size: 12px;">
                    <div style="color:var(--text-muted);">សូមជ្រើសរើសទំនិញទាំងពីរខាងលើ</div>
                    <div style="color:var(--text-muted);">ដើម្បីធ្វើការប្រៀបធៀប</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmCompareModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        loadCompareDropdowns();
    }

    function loadCompareDropdowns() {
        const s1 = document.getElementById('compItem1');
        const s2 = document.getElementById('compItem2');
        if (!s1 || !s2) return;

        let inv = window.inventory || [];
        let optionsHtml = '<option value="">-- រើស --</option>' + inv.map(p => `<option value="${p.id}">${p.name} ($${parseFloat(p.price||0).toFixed(2)})</option>`).join('');
        
        s1.innerHTML = optionsHtml;
        s2.innerHTML = optionsHtml;
    }

    window.updateComparisonView = function() {
        const id1 = document.getElementById('compItem1').value;
        const id2 = document.getElementById('compItem2').value;
        const container = document.getElementById('compareResultContainer');
        if (!container) return;

        let inv = window.inventory || [];
        let p1 = inv.find(x => String(x.id) === String(id1));
        let p2 = inv.find(x => String(x.id) === String(id2));

        if (!p1 && !p2) {
            container.innerHTML = '<div style="grid-column: span 2; color:var(--text-muted);">សូមជ្រើសរើសទំនិញទាំងពីរខាងលើ</div>';
            return;
        }

        container.innerHTML = `
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                <img src="${p1 ? (p1.image || 'https://placehold.co/60') : 'https://placehold.co/60'}" style="width:50px; height:50px; object-fit:contain; border-radius:6px; background:#fff; margin-bottom:4px;">
                <b style="display:block; color:var(--text-dark); font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p1 ? p1.name : '---'}</b>
                <span style="color:#10b981; font-weight:900; font-size:13px;">${p1 ? '$'+parseFloat(p1.price||0).toFixed(2) : '---'}</span>
                <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">ស្តុក: ${p1 ? p1.qty : '---'}</div>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                <img src="${p2 ? (p2.image || 'https://placehold.co/60') : 'https://placehold.co/60'}" style="width:50px; height:50px; object-fit:contain; border-radius:6px; background:#fff; margin-bottom:4px;">
                <b style="display:block; color:var(--text-dark); font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p2 ? p2.name : '---'}</b>
                <span style="color:#10b981; font-weight:900; font-size:13px;">${p2 ? '$'+parseFloat(p2.price||0).toFixed(2) : '---'}</span>
                <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">ស្តុក: ${p2 ? p2.qty : '---'}</div>
            </div>
        `;
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('⚖️', 'ប្រៀបធៀបទំនិញ (Compare)', openCompareModal);
            clearInterval(initInt);
        }
    }, 500);
})();