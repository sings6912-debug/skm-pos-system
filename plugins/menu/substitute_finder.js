(function() {
    console.log("🔄 Menu Substitute & Alternative Finder Plugin Initialized!");

    function openSubstituteModal() {
        if(document.getElementById('skmSubModal')) {
            document.getElementById('skmSubModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmSubModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🔄</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">ស្វែងរកទំនិញ ឬថ្នាំជំនួស</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">វាយឈ្មោះទំនិញ ឬថ្នាំដែលអស់ស្តុក ដើម្បីរកមុខទំនិញស្រដៀងគ្នា៖</p>
                
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <input type="text" id="subQueryInput" placeholder="ឧ. ប៉ារ៉າເຊតាមុល ឬកាហ្វេ..." style="flex: 1; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 12px; color: #fff; font-size: 12px; outline: none; font-family: 'Battambang';" onkeydown="if(event.key==='Enter') window.findSubstituteItems()">
                    <button onclick="window.findSubstituteItems()" style="background: linear-gradient(135deg, #38bdf8, #2563eb); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">ស្វែងរក</button>
                </div>

                <div id="subResultContainer" style="max-height: 220px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 6px; text-align: left; font-size: 12px;">
                    <div style="text-align:center; padding:20px; color:var(--text-muted);">សូមវាយឈ្មោះទំនិញខាងលើដើម្បីស្វែងរកជំនួស</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 12px; cursor: pointer;" onclick="document.getElementById('skmSubModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.findSubstituteItems = function() {
        const inp = document.getElementById('subQueryInput');
        const container = document.getElementById('subResultContainer');
        const query = inp.value.trim().toLowerCase();

        if (!query) {
            container.innerHTML = '<div style="text-align:center; color:#ef4444; padding:15px;">សូមវាយឈ្មោះទំនិញសិន!</div>';
            return;
        }

        let inv = window.inventory || [];
        // Find alternative items in inventory
        let matching = inv.filter(p => String(p.name).toLowerCase().includes(query) || String(p.category).toLowerCase().includes(query));

        if (matching.length === 0 && inv.length > 0) {
            // Fallback to random similar items
            matching = inv.slice(0, 3);
        }

        if (matching.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:15px;">រកមិនឃើញទំនិញជំនួសក្នុងស្តុកទេ</div>';
            return;
        }

        container.innerHTML = matching.map(p => `
            <div style="background: rgba(56,189,248,0.06); border: 1px solid var(--border-color); padding: 10px 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${p.image || 'https://placehold.co/40'}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 8px; background: #fff;">
                    <div>
                        <b style="color: #38bdf8; display: block; font-size: 12px; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</b>
                        <span style="font-size: 11px; color: var(--text-dark); font-weight: 900;">$${parseFloat(p.price || 0).toFixed(2)} (ស្តុក: ${p.qty})</span>
                    </div>
                </div>
                <button onclick="window.openProductByName('${p.name}'); document.getElementById('skmSubModal').style.display='none';" style="background: #38bdf8; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">រើស</button>
            </div>
        `).join('');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔄', 'ស្វែងរកទំនិញ/ថ្នាំជំនួស (Substitute)', openSubstituteModal);
            clearInterval(initInt);
        }
    }, 500);
})();