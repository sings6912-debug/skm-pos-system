(function() {
    console.log("❤️ Menu Favorites Quick Access Plugin Initialized!");

    function openFavoritesModal() {
        if(document.getElementById('skmFavModal')) {
            document.getElementById('skmFavModal').style.display = 'flex';
            loadFavoritesList();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmFavModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">❤️</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #ef4444;">មុខម្ហូបដែលអ្នកចូលចិត្ត (Favorites)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">បញ្ជីមុខម្ហូបដែលអ្នកបានដាក់សញ្ញាបេះដូង៖</p>
                
                <div id="skmFavoritesListContent" style="max-height: 240px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px; text-align: left;">
                    <!-- Injected via JS -->
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(239,68,68,0.1); color:#ef4444;" onclick="document.getElementById('skmFavModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        loadFavoritesList();
    }

    function loadFavoritesList() {
        const list = document.getElementById('skmFavoritesListContent');
        if (!list) return;

        let wishlist = JSON.parse(localStorage.getItem('skm_wl') || '[]');

        if (wishlist.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">មិនទាន់មានមុខម្ហូបដែលចូលចិត្តទេ</div>';
            return;
        }

        list.innerHTML = wishlist.map(p => `
            <div style="background: rgba(128,128,128,0.08); padding: 10px; border-radius: 10px; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${p.image || 'https://placehold.co/40'}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #fff;">
                    <div>
                        <b style="color: var(--text-dark); display: block; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</b>
                        <span style="color: #10b981; font-weight: 900;">$${parseFloat(p.price || 0).toFixed(2)}</span>
                    </div>
                </div>
                <button onclick="window.openProductByName('${p.name}'); document.getElementById('skmFavModal').style.display='none';" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">មើល</button>
            </div>
        `).join('');
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('❤️', 'មុខម្ហូបដែលចូលចិត្ត (Favorites)', openFavoritesModal);
            clearInterval(initInt);
        }
    }, 500);
})();