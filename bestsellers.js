(function() {
    console.log("🔥 Menu Bestsellers & Trending Plugin Initialized!");

    function openBestsellersModal() {
        if(document.getElementById('skmBestModal')) {
            document.getElementById('skmBestModal').style.display = 'flex';
            loadBestsellersList();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmBestModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">🔥</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">មុខទំនិញលក់ដាច់ខ្លាំង (Bestsellers)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">មុខម្ហូប និងទំនិញដែលអតិថិជននិយមម្មង់ច្រើនជាងគេ៖</p>
                
                <div id="skmBestsellersContent" style="max-height: 240px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px; text-align: left;">
                    <!-- Injected via JS -->
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b;" onclick="document.getElementById('skmBestModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        loadBestsellersList();
    }

    function loadBestsellersList() {
        const list = document.getElementById('skmBestsellersContent');
        if (!list) return;

        let inv = window.inventory || [];
        let bests = inv.slice(0, 5);

        if (bests.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">មិនទាន់មានទំនិញក្នុងស្តុកទេ</div>';
            return;
        }

        list.innerHTML = bests.map(p => `
            <div style="background: rgba(245,158,11,0.08); padding: 10px; border-radius: 10px; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${p.image || 'https://placehold.co/40'}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #fff;">
                    <div>
                        <b style="color: var(--text-dark); display: block; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</b>
                        <span style="color: #10b981; font-weight: 900;">$${parseFloat(p.price || 0).toFixed(2)}</span>
                    </div>
                </div>
                <button onclick="window.openProductByName('${p.name}'); document.getElementById('skmBestModal').style.display='none';" style="background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">មើល</button>
            </div>
        `).join('');
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔥', 'មុខទំនិញលក់ដាច់ខ្លាំង (Bestsellers)', openBestsellersModal);
            clearInterval(initInt);
        }
    }, 500);
})();