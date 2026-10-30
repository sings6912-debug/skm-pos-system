/* STREAMING_CHUNK:Initializing General Store Location Manager Plugin */
(function() {
    console.log("📍 General Store Location Manager Initialized!");

    const branchId = new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    let currentLocation = new URLSearchParams(window.location.search).get('table') || localStorage.getItem(`ks2_${branchId}_table_no`) || '';

    // 1. Inject General Store Styling (Neutral / Clean Theme)
    const style = document.createElement('style');
    style.innerHTML = `
        .skm-table-modal-bg {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(5px);
            z-index: 99999; display: flex; justify-content: center; align-items: center;
            font-family: 'Nunito', 'Battambang', sans-serif; padding: 20px;
            opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
        }
        .skm-table-modal-bg.show {
            opacity: 1; pointer-events: auto;
        }
        .skm-table-modal-box {
            background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b); max-width: 380px; width: 100%;
            padding: 25px; border-radius: 24px; border: 1px solid var(--border-color, #e5e7eb);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); text-align: center;
            transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .skm-table-modal-bg.show .skm-table-modal-box {
            transform: translateY(0) scale(1);
        }
        .skm-table-input {
            width: 100%; padding: 14px; border-radius: 14px; border: 1px solid var(--border-color, #e5e7eb);
            background: var(--store-bg, #f3f4f6); color: var(--text-dark, #1e293b); font-size: 18px; font-weight: bold;
            text-align: center; outline: none; margin: 15px 0; font-family: 'Nunito', 'Battambang', sans-serif;
        }
        .skm-table-input:focus { border-color: var(--brand-cyan, #06b6d4); }
        .skm-table-btn {
            background: var(--brand-cyan, #06b6d4); color: white; border: none;
            width: 100%; padding: 14px; border-radius: 14px; font-size: 15px; font-weight: 900;
            cursor: pointer; font-family: 'Nunito', 'Battambang', sans-serif; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
        }
        .skm-table-grid {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 15px;
        }
        .skm-table-pill {
            background: var(--store-bg, #f3f4f6); border: 1px solid var(--border-color, #e5e7eb); color: var(--text-dark, #1e293b);
            padding: 10px 0; border-radius: 10px; font-weight: bold; font-size: 14px;
            cursor: pointer; transition: 0.2s;
        }
        .skm-table-pill:hover, .skm-table-pill.active {
            background: var(--brand-cyan, #06b6d4); color: white; border-color: var(--brand-cyan, #06b6d4);
        }
    `;
    document.head.appendChild(style);

    // 2. Inject Modal HTML
    const modal = document.createElement('div');
    modal.className = 'skm-table-modal-bg';
    modal.id = 'skmStoreLocationModal';
    modal.innerHTML = `
        <div class="skm-table-modal-box" onclick="event.stopPropagation()">
            <div style="font-size: 36px; margin-bottom: 10px;">📍</div>
            <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 6px;">សូមជ្រើសរើស ឬវាយបញ្ចូលលេខតុ / លេខទីតាំង</h3>
            <p style="font-size: 12px; color: var(--text-muted, #64748b); margin-bottom: 15px;">กรุณาระบุโต๊ะ/ตำแหน่งก่อนสั่งซื้อ (Table / Location)</p>
            
            <div class="skm-table-grid" id="skmTableGrid">
                <div class="skm-table-pill" onclick="selectQuickLocation('1')">តុ 1</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('2')">តុ 2</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('3')">តុ 3</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('4')">តុ 4</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('5')">តុ 5</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('6')">តុ 6</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('7')">តុ 7</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('8')">តុ 8</div>
            </div>

            <input type="text" id="skmCustomTableInput" class="input-st skm-table-input" placeholder="លេខតុ ឬ ទីតាំង (ឧ. 9 ឬ VIP)...">
            <button class="skm-table-btn" onclick="saveStoreLocation()">បញ្ជាក់ទីតាំង (Confirm)</button>
        </div>
    `;
    document.body.appendChild(modal);

    window.openStoreLocationModal = function() {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        if (currentLocation) {
            document.getElementById('skmCustomTableInput').value = currentLocation;
        }
    };

    window.closeStoreLocationModal = function() {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    };

    window.selectQuickLocation = function(locNum) {
        document.getElementById('skmCustomTableInput').value = locNum;
        saveStoreLocation();
    };

    window.saveStoreLocation = function() {
        const val = document.getElementById('skmCustomTableInput').value.trim();
        if (!val) {
            if (typeof showToast === 'function') showToast('សូមបញ្ចូលលេខតុ ឬទីតាំងសិន!', true);
            else alert('សូមបញ្ចូលលេខតុ ឬទីតាំងសិន!');
            return;
        }

        currentLocation = val;
        localStorage.setItem(`ks2_${branchId}_table_no`, val);

        // Update UI Badge
        const tbBadge = document.getElementById('tableBadgeDisplay');
        if (tbBadge) {
            tbBadge.innerText = `តុលេខ ${val}`;
            tbBadge.style.display = 'inline-block';
        }

        // Update Customer Name Input in Cart
        const cNameInput = document.getElementById('cName');
        if (cNameInput) {
            cNameInput.value = `តុលេខ ${val}`;
            cNameInput.style.display = 'none';
        }

        closeStoreLocationModal();
        if (typeof showToast === 'function') showToast(`បានកំណត់ទីតាំង ${val} ជោគជ័យ! ✅`);
    };

    // 3. Register Tool in Toolbox Hub automatically
    const initToolboxInterval = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📍', 'កំណត់/ប្តូរទីតាំង (Table)', openStoreLocationModal);
            clearInterval(initToolboxInterval);
        }
    }, 300);

    // 4. Auto prompt on load if location is missing
    setTimeout(() => {
        if (!currentLocation) {
            openStoreLocationModal();
        } else {
            const tbBadge = document.getElementById('tableBadgeDisplay');
            if (tbBadge) {
                tbBadge.innerText = `តុលេខ ${currentLocation}`;
                tbBadge.style.display = 'inline-block';
            }
            const cNameInput = document.getElementById('cName');
            if (cNameInput) {
                cNameInput.value = `តុលេខ ${currentLocation}`;
                cNameInput.style.display = 'none';
            }
        }
    }, 800);
})();