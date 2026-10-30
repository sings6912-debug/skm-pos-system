(function() {
    console.log("💵 Menu Budget Finder Plugin Initialized!");

    function openBudgetModal() {
        if(document.getElementById('skmBudgetModal')) {
            document.getElementById('skmBudgetModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmBudgetModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">💵</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">ស្វែងរកទំនិញតាមថវិកា</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">បញ្ចូលទឹកប្រាក់ថវិកាដែលអ្នកចង់ចំណាយថ្ងៃនេះ៖</p>
                
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <input type="number" id="budgetInput" placeholder="ឧ. 5.00 ឬ 10.00..." style="flex: 1; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 12px; color: #fff; font-size: 13px; outline: none; font-family: 'Battambang';" onkeydown="if(event.key==='Enter') window.filterByBudget()">
                    <button onclick="window.filterByBudget()" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">ស្វែងរក</button>
                </div>

                <div id="budgetResultContainer" style="max-height: 220px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 6px; text-align: left; font-size: 12px;">
                    <div style="text-align:center; padding:20px; color:var(--text-muted);">សូមបញ្ចូលថវិកាខាងលើដើម្បីស្វែងរកទំនិញ</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmBudgetModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.filterByBudget = function() {
        const inp = document.getElementById('budgetInput');
        const container = document.getElementById('budgetResultContainer');
        const maxBudget = parseFloat(inp.value);

        if (isNaN(maxBudget) || maxBudget <= 0) {
            container.innerHTML = '<div style="text-align:center; color:#ef4444; padding:15px;">សូមបញ្ចូលទឹកប្រាក់ថវិកាឱ្យបានត្រឹមត្រូវ!</div>';
            return;
        }

        let inv = window.inventory || [];
        let matching = inv.filter(p => (parseFloat(p.price) || 0) <= maxBudget);

        if (matching.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:15px;">គ្មានទំនិញក្នុងថវិកានេះទេ (ទំនិញទាំងអស់មានតម្លៃថ្លៃជាងនេះ)</div>';
            return;
        }

        container.innerHTML = matching.map(p => `
            <div style="background: rgba(16,185,129,0.06); border: 1px solid var(--border-color); padding: 10px 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${p.image || 'https://placehold.co/40'}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 8px; background: #fff;">
                    <div>
                        <b style="color: #10b981; display: block; font-size: 12px; max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</b>
                        <span style="font-size: 11px; color: var(--text-dark); font-weight: 900;">$${parseFloat(p.price || 0).toFixed(2)}</span>
                    </div>
                </div>
                <button onclick="window.openProductByName('${p.name}'); document.getElementById('skmBudgetModal').style.display='none';" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">មើល</button>
            </div>
        `).join('');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💵', 'ស្វែងរកទំនិញតាមថវិកា (Budget Finder)', openBudgetModal);
            clearInterval(initInt);
        }
    }, 500);
})();