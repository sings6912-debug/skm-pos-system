(function() {
    console.log("🔀 Menu Product Sorting Bar Plugin Initialized!");

    const style = document.createElement('style');
    style.innerHTML = `
        .skm-sort-container {
            display: flex; gap: 8px; padding: 0 20px 12px 20px; align-items: center;
        }
        .skm-sort-select {
            background: var(--card-bg, #1e293b); color: var(--text-dark, #fff);
            border: 1px solid var(--border-color, #334155); padding: 6px 12px; border-radius: 12px;
            font-size: 12px; font-weight: 800; outline: none; cursor: pointer; font-family: 'Nunito', 'Battambang';
        }
    `;
    document.head.appendChild(style);

    function injectSortBar() {
        const catScroll = document.getElementById('catTabs');
        if (!catScroll || document.getElementById('skmSortBar')) return;

        const sortWrap = document.createElement('div');
        sortWrap.id = 'skmSortBar';
        sortWrap.className = 'skm-sort-container';
        sortWrap.innerHTML = `
            <span style="font-size: 12px; font-weight: 800; color: var(--text-muted);">តម្រៀបតាម (Sort):</span>
            <select class="skm-sort-select" onchange="window.sortMenuProducts(this.value)">
                <option value="default">⭐ ពេញនិយម (Default)</option>
                <option value="price_low">💵 តម្លៃពីទាប ➔ ខ្ពស់</option>
                <option value="price_high">💎 តម្លៃពីខ្ពស់ ➔ ទាប</option>
                <option value="name_az">🔤 ឈ្មោះ (A ➔ Z)</option>
            </select>
        `;

        catScroll.parentNode.insertBefore(sortWrap, catScroll.nextSibling);
    }

    window.sortMenuProducts = function(type) {
        if (!window.inventory || !Array.isArray(window.inventory)) return;

        if (type === 'price_low') {
            window.inventory.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        } else if (type === 'price_high') {
            window.inventory.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        } else if (type === 'name_az') {
            window.inventory.sort((a, b) => String(a.name).localeCompare(String(b.name)));
        } else {
            // Default sort (original order or ID)
            window.inventory.sort((a, b) => String(a.id).localeCompare(String(b.id)));
        }

        if (typeof renderMenu === 'function') renderMenu();
        if (typeof showToast === 'function') showToast('បានតម្រៀបទំនិញជោគជ័យ!');
    };

    const initInterval = setInterval(() => {
        if (document.getElementById('catTabs')) {
            injectSortBar();
            clearInterval(initInterval);
        }
    }, 500);
})();