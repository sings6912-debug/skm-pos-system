(function() {
    console.log("👀 Menu Recently Viewed Plugin Initialized!");

    const style = document.createElement('style');
    style.innerHTML = `
        .skm-recent-container {
            margin: 15px 20px 5px 20px; display: none; flex-direction: column; gap: 8px;
        }
        .skm-recent-title { font-size: 13px; font-weight: 900; color: var(--text-dark, #fff); display: flex; align-items: center; gap: 6px; }
        .skm-recent-scroll { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; padding-bottom: 5px; }
        .skm-recent-scroll::-webkit-scrollbar { display: none; }
        .skm-recent-card {
            background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155);
            border-radius: 12px; padding: 8px; width: 90px; flex-shrink: 0; cursor: pointer; text-align: center;
        }
        .skm-recent-card img { width: 60px; height: 60px; object-fit: contain; border-radius: 8px; background: #fff; margin-bottom: 4px; }
        .skm-recent-card .name { font-size: 10px; font-weight: 800; color: var(--text-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    `;
    document.head.appendChild(style);

    function trackProductViews() {
        document.addEventListener('click', function(e) {
            const card = e.target.closest('.p-card');
            if (!card) return;
            
            const titleEl = card.querySelector('.p-title');
            if (!titleEl) return;
            const prodName = titleEl.innerText;

            let viewed = JSON.parse(localStorage.getItem('skm_recent_viewed') || '[]');
            viewed = viewed.filter(x => x.name !== prodName);
            
            const imgEl = card.querySelector('img');
            const imgUrl = imgEl ? imgEl.src : '';

            viewed.unshift({ name: prodName, image: imgUrl });
            if (viewed.length > 8) viewed.pop();

            localStorage.setItem('skm_recent_viewed', JSON.stringify(viewed));
            renderRecentWidget();
        });
    }

    function renderRecentWidget() {
        let viewed = JSON.parse(localStorage.getItem('skm_recent_viewed') || '[]');
        let container = document.getElementById('skmRecentWidget');

        if (viewed.length === 0) {
            if (container) container.style.display = 'none';
            return;
        }

        const catScroll = document.getElementById('catTabs');
        if (!catScroll) return;

        if (!container) {
            container = document.createElement('div');
            container.id = 'skmRecentWidget';
            container.className = 'skm-recent-container';
            catScroll.parentNode.insertBefore(container, catScroll);
        }

        container.style.display = 'flex';
        container.innerHTML = `
            <div class="skm-recent-title"><i class="fa-solid fa-clock-rotate-left" style="color:var(--brand-cyan);"></i> ទំនិញទើបបានមើល (Recently Viewed)</div>
            <div class="skm-recent-scroll">
                ${viewed.map(v => `
                    <div class="skm-recent-card" onclick="window.openProductByName('${v.name}')">
                        <img src="${v.image}" onerror="this.src='https://placehold.co/60'">
                        <div class="name">${v.name}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    window.openProductByName = function(name) {
        if (typeof inventory !== 'undefined') {
            const p = inventory.find(x => x.name === name);
            if (p && typeof openDet === 'function') {
                openDet(p.id);
                return;
            }
        }
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = name;
            if (typeof renderMenu === 'function') renderMenu();
            window.scrollTo({top: 300, behavior: 'smooth'});
        }
    };

    const initInterval = setInterval(() => {
        if (document.getElementById('catTabs')) {
            trackProductViews();
            renderRecentWidget();
            clearInterval(initInterval);
        }
    }, 500);
})();