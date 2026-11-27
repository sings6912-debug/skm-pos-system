/**
 * pos_advanced_suite.js — Modular Point-Hub-Parity Enterprise Suite for SKM POS (index.html)
 * 100% Gated by Admin Settings (admin_settings.html -> Tab 9: sysSettings.proFeatures)
 * Zero UI footprint when toggled OFF!
 *
 * Modules (7):
 *  1. floorPlan        — Visual 2D Floor Plan & Table Zones (Drag/Drop + Live Occupied Status)
 *  2. comboSets        — Combo Sets / Menu Bundles with Automatic Component Stock Deduction
 *  3. shiftManagement  — Shift Open/Close + Cash Drawer Expected vs Actual Discrepancy Log
 *  4. orderModes       — Dine-In / Takeaway / Delivery 3-Mode Bar + Auto Delivery Fee
 *  5. itemDiscounts    — Per-Item Discount (% / $) + Configurable 1-Tap Pre-set Discount Chips
 *  6. posModifiers     — POS Modifiers (Size/Sugar/Ice/Toppings/Note) & Tablet Quick Numpad
 *  7. multiWarehouse   — Multi-Warehouse Stock Locations & Internal Transfer Log (Admin/Manager)
 */
(function() {
    if (window.__SKM_POS_ADVANCED_SUITE_LOADED__) return;
    window.__SKM_POS_ADVANCED_SUITE_LOADED__ = true;

    const getBranch = () => window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    const getPF = () => (window.sysSettings && window.sysSettings.proFeatures) ? window.sysSettings.proFeatures : {};
    const isManagerOrAdmin = () => {
        const r = String(window.currentRole || window.activeUser?.role || '').toLowerCase();
        return r === 'admin' || r === 'manager';
    };
    const esc = (s) => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const toast = (msg, err = false) => {
        if (typeof window.showToast === 'function') window.showToast(msg, err);
        else if (typeof window.ksMsg === 'function') window.ksMsg(msg, err ? 'បរាជ័យ' : 'ជូនដំណឹង');
    };

    async function persistSysSettings() {
        if (!window.sysSettings) window.sysSettings = {};
        if (typeof window.getBranchKey === 'function') {
            localStorage.setItem(window.getBranchKey('sys_settings'), JSON.stringify(window.sysSettings));
        }
        if (typeof window.saveData === 'function') await window.saveData(window.userAccounts);
    }

    // =========================================================
    // 1. ORDER MODES (DINE-IN / TAKEAWAY / DELIVERY + FEE)
    // =========================================================
    window.currentPosOrderMode = 'dinein'; // 'dinein' | 'takeaway' | 'delivery'
    window.currentDeliveryFeeUsd = 0;

    window.setPosOrderMode = function(mode) {
        const pf = getPF();
        if (!pf.orderModes) return;
        window.currentPosOrderMode = mode || 'dinein';
        if (mode === 'delivery') {
            const defFee = parseFloat(window.sysSettings?.deliveryFee);
            window.currentDeliveryFeeUsd = !isNaN(defFee) ? Math.max(0, defFee) : 1.5;
        } else {
            window.currentDeliveryFeeUsd = 0;
        }
        updateOrderModeUI();
        if (typeof window.renderCart === 'function') window.renderCart();
    };

    window.setCustomDeliveryFee = function(val) {
        window.currentDeliveryFeeUsd = Math.max(0, parseFloat(val) || 0);
        if (typeof window.renderCart === 'function') window.renderCart();
    };

    function updateOrderModeUI() {
        const pf = getPF();
        const bar = document.getElementById('skmOrderModeBar');
        if (!bar) return;
        if (!pf.orderModes) {
            bar.style.display = 'none';
            window.currentDeliveryFeeUsd = 0;
            return;
        }
        bar.style.display = 'block';
        bar.querySelectorAll('.skm-om-btn').forEach(btn => {
            const active = btn.getAttribute('data-om') === window.currentPosOrderMode;
            btn.style.background = active ? 'var(--primary)' : 'var(--bg-dark)';
            btn.style.color = active ? '#fff' : 'var(--text-main)';
            btn.style.borderColor = active ? 'var(--primary)' : 'var(--border)';
        });
        const feeRow = document.getElementById('skmDeliveryFeeRow');
        const feeInp = document.getElementById('skmDeliveryFeeInp');
        if (feeRow) feeRow.style.display = window.currentPosOrderMode === 'delivery' ? 'flex' : 'none';
        if (feeInp && window.currentPosOrderMode === 'delivery') {
            feeInp.value = Number(window.currentDeliveryFeeUsd || 0).toFixed(2);
        }
    }

    // =========================================================
    // 2. PRE-SET DISCOUNT CHIPS & PER-ITEM DISCOUNT MODAL
    // =========================================================
    function parsePresetDiscounts() {
        const raw = (window.sysSettings && window.sysSettings.presetDiscountsList)
            ? String(window.sysSettings.presetDiscountsList)
            : 'Student:5%, VIP:10%, Promo:15%, Nham24:18%, Grab:22%';
        return raw.split(',').map(part => {
            const trimmed = part.trim();
            if (!trimmed) return null;
            const pieces = trimmed.split(':');
            const label = (pieces[0] || '').trim();
            const valPart = (pieces[1] || pieces[0] || '').trim();
            const isDollar = valPart.includes('$');
            const num = parseFloat(valPart.replace(/[^0-9.]/g, '')) || 0;
            if (num <= 0) return null;
            return { label: pieces.length > 1 ? label : valPart, val: num, type: isDollar ? '$' : '%' };
        }).filter(Boolean);
    }

    window.applyPresetCartDiscount = function(val, type) {
        const inp = document.getElementById('posDiscount');
        const sel = document.getElementById('posDiscountType');
        if (inp) inp.value = val;
        if (sel) sel.value = type;
        if (typeof window.renderCart === 'function') window.renderCart();
        toast(`🏷️ បានអនុវត្តបញ្ចុះតម្លៃ ${type === '$' ? '$' + val : val + '%'}!`);
    };

    window.openItemDiscountModal = function(cartId) {
        const pf = getPF();
        if (!pf.itemDiscounts) return;
        const item = (window.cart || []).find(c => c && String(c.id) === String(cartId));
        if (!item) return;

        let modal = document.getElementById('skmItemDiscModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmItemDiscModal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = '10030';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            modal.innerHTML = `
                <div class="modal" style="max-width:420px; width:94%;">
                    <div class="modal-header">
                        <h2 style="font-size:17px;">🏷️ បញ្ចុះតម្លៃចំមុខទំនិញ (Item Discount)</h2>
                        <button class="btn-outline" style="border:none; font-size:20px; padding:0;" onclick="document.getElementById('skmItemDiscModal').style.display='none'">✕</button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="skmIdiscCartId">
                        <div id="skmIdiscItemName" style="font-weight:900; font-size:15px; margin-bottom:12px; color:var(--primary);"></div>
                        <div style="display:flex; gap:8px; margin-bottom:12px;">
                            <input type="number" id="skmIdiscVal" class="form-control" min="0" step="0.01" placeholder="0" style="flex:1; font-size:18px; text-align:center; font-weight:900;">
                            <select id="skmIdiscType" class="form-control" style="width:90px; font-weight:800;">
                                <option value="%">%</option>
                                <option value="$">$</option>
                            </select>
                        </div>
                        <div id="skmIdiscQuickChips" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;"></div>
                        <div style="display:flex; gap:8px;">
                            <button type="button" class="btn btn-outline" style="flex:1;" onclick="window.saveItemDiscount(true)">⭕ លុបបញ្ចុះតម្លៃ</button>
                            <button type="button" class="btn btn-success" style="flex:1.5;" onclick="window.saveItemDiscount(false)">✅ រក្សាទុក</button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }

        document.getElementById('skmIdiscCartId').value = item.id;
        document.getElementById('skmIdiscItemName').innerText = item.name;
        document.getElementById('skmIdiscVal').value = item.itemDiscVal > 0 ? item.itemDiscVal : '';
        document.getElementById('skmIdiscType').value = item.itemDiscType || '%';

        const chips = parsePresetDiscounts();
        document.getElementById('skmIdiscQuickChips').innerHTML = chips.map(ch =>
            `<button type="button" class="btn btn-outline" style="padding:4px 10px; font-size:11.5px;" onclick="document.getElementById('skmIdiscVal').value='${ch.val}'; document.getElementById('skmIdiscType').value='${ch.type}';">${esc(ch.label)} (${ch.type === '$' ? '$' + ch.val : ch.val + '%'})</button>`
        ).join('');

        modal.style.display = 'flex';
        setTimeout(() => document.getElementById('skmIdiscVal')?.focus(), 60);
    };

    window.saveItemDiscount = function(clearIt = false) {
        const cid = document.getElementById('skmIdiscCartId').value;
        const item = (window.cart || []).find(c => c && String(c.id) === String(cid));
        if (!item) return;
        if (clearIt) {
            item.itemDiscVal = 0;
            item.itemDiscType = '%';
        } else {
            item.itemDiscVal = Math.max(0, parseFloat(document.getElementById('skmIdiscVal').value) || 0);
            item.itemDiscType = document.getElementById('skmIdiscType').value || '%';
        }
        document.getElementById('skmItemDiscModal').style.display = 'none';
        if (typeof window.renderCart === 'function') window.renderCart();
        toast(clearIt ? '⭕ បានដកការបញ្ចុះតម្លៃមុខទំនិញ!' : '✅ បានបញ្ចុះតម្លៃមុខទំនិញរួចរាល់!');
    };

    // =========================================================
    // 3. POS ITEM MODIFIERS & TABLET QUICK NUMPAD (ADMIN CONFIGURABLE)
    // =========================================================
    function parseModifierPairs(rawStr, fallbackStr) {
        const src = (rawStr && String(rawStr).trim()) ? String(rawStr) : fallbackStr;
        return src.split(',').map(part => {
            const t = part.trim();
            if (!t) return null;
            const sepIdx = t.lastIndexOf(':');
            if (sepIdx === -1) return { name: t, price: 0 };
            const name = t.slice(0, sepIdx).trim();
            const price = Math.max(0, parseFloat(t.slice(sepIdx + 1).replace(/[^0-9.]/g, '')) || 0);
            if (!name) return null;
            return { name, price };
        }).filter(Boolean);
    }

    let numpadBuffer = '';
    window.openPosModifierModal = function(cartId) {
        const pf = getPF();
        if (!pf.posModifiers) return;
        const item = (window.cart || []).find(c => c && String(c.id) === String(cartId));
        if (!item) return;

        let modal = document.getElementById('skmPosModModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmPosModModal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = '10031';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            modal.innerHTML = `
                <div class="modal" style="max-width:580px; width:96%;">
                    <div class="modal-header">
                        <h2 style="font-size:17px;">🧋 ជម្រើសថែមថយ & ក្តារចុចលេខ (Modifiers & Numpad)</h2>
                        <button class="btn-outline" style="border:none; font-size:20px; padding:0;" onclick="document.getElementById('skmPosModModal').style.display='none'">✕</button>
                    </div>
                    <div class="modal-body" style="max-height:76vh; overflow-y:auto;">
                        <input type="hidden" id="skmModCartId">
                        <div id="skmModProdTitle" style="font-weight:900; font-size:15.5px; color:var(--primary); margin-bottom:12px;"></div>

                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px;">
                            <!-- Left: Quick Numpad for Quantity -->
                            <div style="background:rgba(0,0,0,0.06); padding:12px; border-radius:12px; border:1px solid var(--border);">
                                <div style="font-size:12px; font-weight:800; color:var(--text-muted); margin-bottom:6px;">🔢 ចំនួន (Quantity Keypad):</div>
                                <input type="number" id="skmModQtyInp" class="form-control" min="1" value="1" style="width:100%; text-align:center; font-size:22px; font-weight:900; height:44px; margin-bottom:8px;">
                                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:5px;">
                                    ${[1,2,3,4,5,6,7,8,9].map(n => `<button type="button" class="btn btn-outline" style="padding:10px 0; font-size:15px; font-weight:900; justify-content:center;" onclick="window.tapModNumpad('${n}')">${n}</button>`).join('')}
                                    <button type="button" class="btn btn-outline" style="padding:10px 0; font-size:13px; color:var(--danger); justify-content:center;" onclick="window.tapModNumpad('C')">C</button>
                                    <button type="button" class="btn btn-outline" style="padding:10px 0; font-size:15px; font-weight:900; justify-content:center;" onclick="window.tapModNumpad('0')">0</button>
                                    <button type="button" class="btn btn-outline" style="padding:10px 0; font-size:13px; justify-content:center;" onclick="window.tapModNumpad('BS')">⌫</button>
                                </div>
                            </div>

                            <!-- Right: Dynamic Size / Sugar / Ice / Toppings -->
                            <div style="display:flex; flex-direction:column; gap:10px;">
                                <div>
                                    <label style="font-size:12px; font-weight:800; display:block; margin-bottom:4px;">📐 ទំហំ (Size):</label>
                                    <select id="skmModSize" class="form-control" style="width:100%;"></select>
                                </div>
                                <div>
                                    <label style="font-size:12px; font-weight:800; display:block; margin-bottom:4px;">🍬 កម្រិតស្ករ (Sugar):</label>
                                    <select id="skmModSugar" class="form-control" style="width:100%;">
                                        <option value="">ស្ករធម្មតា (100%)</option>
                                        <option value="ស្ករ 70%">ស្ករ 70%</option>
                                        <option value="ស្ករ 50%">ស្ករ 50%</option>
                                        <option value="ស្ករ 25%">ស្ករ 25%</option>
                                        <option value="អត់ស្ករ 0%">អត់ស្ករ (0%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style="font-size:12px; font-weight:800; display:block; margin-bottom:4px;">🧊 កម្រិតទឹកកក (Ice):</label>
                                    <select id="skmModIce" class="form-control" style="width:100%;">
                                        <option value="">ទឹកកកធម្មតា (Normal)</option>
                                        <option value="ទឹកកកតិច">ទឹកកកតិច (Less Ice)</option>
                                        <option value="ទឹកកកច្រើន">ទឹកកកច្រើន (More Ice)</option>
                                        <option value="អត់ទឹកកក">អត់ទឹកកក (No Ice)</option>
                                        <option value="ក្តៅ Hot">ក្តៅ (Hot)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style="font-size:12px; font-weight:800; display:block; margin-bottom:4px;">✨ បន្ថែម Topping / Add-ons:</label>
                                    <div id="skmModToppingsGrid" style="display:grid; grid-template-columns:1fr 1fr; gap:5px; font-size:11.5px;"></div>
                                </div>
                                <div>
                                    <label style="font-size:12px; font-weight:800; display:block; margin-bottom:4px;">📝 ចំណាំផ្ទះបាយ (Item Note):</label>
                                    <input type="text" id="skmModCustomNote" class="form-control" placeholder="ឧ. មិនដាក់ខ្ទឹម, មិនហឹរ..." style="width:100%;">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" style="justify-content:space-between;">
                        <button type="button" class="btn btn-outline" onclick="document.getElementById('skmPosModModal').style.display='none'">បិទ</button>
                        <button type="button" class="btn btn-success" onclick="window.applyPosItemModifiers()">✅ រក្សាទុកជម្រើស</button>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }

        // Populate Sizes & Toppings dynamically from Admin Settings (Tab 9.3)
        const sizesArr = parseModifierPairs(window.sysSettings?.modifierSizesList, 'ធម្មតា (S):0, Size M:0.50, Size L:1.00');
        const toppingsArr = parseModifierPairs(window.sysSettings?.modifierToppingsList, 'ថែមគុជ:0.50, ថែមគ្រីម:0.50, ថែមឈីស:0.75, Extra Shot:0.75');

        const sizeSel = document.getElementById('skmModSize');
        if (sizeSel) {
            sizeSel.innerHTML = sizesArr.map((s, idx) => {
                const lbl = s.price > 0 ? `${esc(s.name)} (+$${s.price.toFixed(2)})` : esc(s.name);
                const valKey = (idx === 0 && s.price === 0) ? '|0' : `${esc(s.name)}|${s.price.toFixed(2)}`;
                return `<option value="${valKey}">${lbl}</option>`;
            }).join('');
            const wantedSize = item._modSize || '|0';
            if (Array.from(sizeSel.options).some(o => o.value === wantedSize)) sizeSel.value = wantedSize;
            else if (sizeSel.options.length > 0) sizeSel.selectedIndex = 0;
        }

        const topGrid = document.getElementById('skmModToppingsGrid');
        const savedAddons = Array.isArray(item._modAddons) ? item._modAddons : [];
        if (topGrid) {
            topGrid.innerHTML = toppingsArr.map(tp => {
                const checkedAttr = savedAddons.includes(tp.name) ? 'checked' : '';
                const pTxt = tp.price > 0 ? `+$${tp.price.toFixed(2)}` : 'Free';
                return `<label style="display:flex; align-items:center; gap:4px; cursor:pointer; background:var(--bg-dark); padding:5px 7px; border-radius:8px; border:1px solid var(--border);"><input type="checkbox" class="skm-pos-mod-addon" data-name="${esc(tp.name)}" data-price="${tp.price.toFixed(2)}" ${checkedAttr}> <span>${esc(tp.name)} <small style="color:var(--success);">${pTxt}</small></span></label>`;
            }).join('');
        }

        numpadBuffer = '';
        document.getElementById('skmModCartId').value = item.id;
        document.getElementById('skmModProdTitle').innerText = item.baseName || item.name;
        document.getElementById('skmModQtyInp').value = item.cartQty || 1;
        document.getElementById('skmModSugar').value = item._modSugar || '';
        document.getElementById('skmModIce').value = item._modIce || '';
        document.getElementById('skmModCustomNote').value = item._modNote || '';
        modal.style.display = 'flex';
    };

    window.tapModNumpad = function(key) {
        const inp = document.getElementById('skmModQtyInp');
        if (!inp) return;
        if (key === 'C') { numpadBuffer = ''; inp.value = 1; return; }
        if (key === 'BS') { numpadBuffer = numpadBuffer.slice(0, -1); inp.value = numpadBuffer ? parseInt(numpadBuffer) : 1; return; }
        numpadBuffer = (numpadBuffer + key).slice(0, 4);
        inp.value = Math.max(1, parseInt(numpadBuffer) || 1);
    };

    window.applyPosItemModifiers = function() {
        const cid = document.getElementById('skmModCartId').value;
        const item = (window.cart || []).find(c => c && String(c.id) === String(cid));
        if (!item) return;

        const qty = Math.max(1, parseInt(document.getElementById('skmModQtyInp').value) || 1);
        const sizeRaw = document.getElementById('skmModSize').value || '|0';
        const [sizeLabel, sizePriceStr] = sizeRaw.split('|');
        const sugar = document.getElementById('skmModSugar').value || '';
        const ice = document.getElementById('skmModIce').value || '';
        const customNote = document.getElementById('skmModCustomNote').value.trim();

        let extra = parseFloat(sizePriceStr) || 0;
        const addonNames = [];
        document.querySelectorAll('.skm-pos-mod-addon:checked').forEach(chk => {
            addonNames.push(chk.getAttribute('data-name'));
            extra += parseFloat(chk.getAttribute('data-price')) || 0;
        });

        const baseName = item.baseName || item.name;
        item.baseName = baseName;
        item._modSize = sizeRaw;
        item._modSugar = sugar;
        item._modIce = ice;
        item._modAddons = addonNames;
        item._modNote = customNote;
        item.modifierExtra = extra;

        const parts = [sizeLabel, sugar, ice, ...addonNames.map(a => '+' + a), customNote].filter(Boolean);
        item.modifierLabel = parts.join(' | ');
        item.name = parts.length > 0 ? `${baseName} [${item.modifierLabel}]` : baseName;

        if (typeof window.setCartQtyManually === 'function') {
            window.setCartQtyManually(item.id, qty);
        } else {
            item.cartQty = qty; item.qty = qty;
            if (typeof window.renderCart === 'function') window.renderCart();
        }
        document.getElementById('skmPosModModal').style.display = 'none';
        toast('✅ បានអាប់ដេតជម្រើស & ចំនួនទំនិញ!');
    };

    // =========================================================
    // 4. VISUAL 2D FLOOR PLAN & TABLE ZONES
    // =========================================================
    let fpActiveZone = 'ជាន់ទី ១';
    let fpEditMode = false;
    let fpDraggingId = null;
    let fpDragOffset = { x: 0, y: 0 };

    function getFloorPlanData() {
        if (!window.sysSettings) window.sysSettings = {};
        if (!window.sysSettings.floorPlanData || !Array.isArray(window.sysSettings.floorPlanData.tables)) {
            window.sysSettings.floorPlanData = {
                zones: ['ជាន់ទី ១', 'បន្ទប់ VIP', 'ខាងក្រៅ'],
                tables: [
                    { id: 'TB_1', name: 'តុលេខ 1', zone: 'ជាន់ទី ១', x: 24, y: 24, shape: 'square', seats: 4 },
                    { id: 'TB_2', name: 'តុលេខ 2', zone: 'ជាន់ទី ១', x: 164, y: 24, shape: 'square', seats: 4 },
                    { id: 'TB_3', name: 'តុលេខ 3', zone: 'ជាន់ទី ១', x: 304, y: 24, shape: 'round', seats: 2 },
                    { id: 'TB_4', name: 'តុលេខ 4', zone: 'ជាន់ទី ១', x: 24, y: 150, shape: 'round', seats: 6 },
                    { id: 'TB_5', name: 'VIP 1', zone: 'បន្ទប់ VIP', x: 30, y: 30, shape: 'square', seats: 8 },
                    { id: 'TB_6', name: 'VIP 2', zone: 'បន្ទប់ VIP', x: 190, y: 30, shape: 'square', seats: 10 }
                ]
            };
        }
        return window.sysSettings.floorPlanData;
    }

    function getTableOccupiedMap() {
        const map = {};
        (window.invoices || []).forEach(inv => {
            if (!inv) return;
            const st = String(inv.status || 'unpaid').toLowerCase();
            if (st === 'paid') return;
            const cust = String(inv.customerName || inv.customer || '').trim();
            const note = String(inv.note || '');
            const tot = parseFloat(inv.totalAmount || inv.total || 0);
            const register = (key) => {
                if (!key) return;
                const k = key.toLowerCase();
                if (!map[k]) map[k] = { count: 0, total: 0, lastInvId: inv.id || inv.invoiceNo };
                map[k].count++;
                map[k].total += tot;
            };
            if (cust) register(cust);
            const m = note.match(/\[([^\]]+)\]/g);
            if (m) m.forEach(tag => register(tag.slice(1, -1)));
        });
        return map;
    }

    window.openFloorPlanModal = function() {
        const pf = getPF();
        if (!pf.floorPlan) return toast('⚠️ មុខងារប្លង់តុ 2D ត្រូវបានបិទដោយ Admin Settings!', true);
        const fp = getFloorPlanData();
        if (!fp.zones.includes(fpActiveZone)) fpActiveZone = fp.zones[0] || 'ជាន់ទី ១';
        fpEditMode = false;

        let modal = document.getElementById('skmFloorPlanModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmFloorPlanModal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = '10025';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            modal.innerHTML = `
                <div class="modal" style="max-width: 920px; width: 96%;">
                    <div class="modal-header">
                        <h2 style="font-size:18px;">🗺️ ប្លង់តុហាង 2D (Visual Floor Plan)</h2>
                        <button class="btn-outline" style="border:none; font-size:20px; padding:0;" onclick="document.getElementById('skmFloorPlanModal').style.display='none'">✕</button>
                    </div>
                    <div class="modal-body" style="max-height:78vh; overflow-y:auto;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
                            <div id="skmFpZonesBar" style="display:flex; gap:6px; flex-wrap:wrap;"></div>
                            <div id="skmFpAdminControls" style="display:flex; gap:6px; flex-wrap:wrap;"></div>
                        </div>

                        <div id="skmFpAddForm" style="display:none; background:rgba(56,189,248,0.08); border:1px dashed var(--primary); padding:12px; border-radius:12px; margin-bottom:12px; gap:8px; flex-wrap:wrap; align-items:end;">
                            <div style="flex:1.4; min-width:130px;"><label style="font-size:11.5px; display:block;">ឈ្មោះតុ:</label><input id="fpNewName" class="form-control" placeholder="ឧ. V1, តុលេខ 5" style="width:100%;"></div>
                            <div style="flex:1; min-width:110px;"><label style="font-size:11.5px; display:block;">រាងតុ:</label><select id="fpNewShape" class="form-control" style="width:100%;"><option value="square">⬜ ជ្រុង (Square)</option><option value="round">⚪ មូល (Round)</option></select></div>
                            <div style="width:90px;"><label style="font-size:11.5px; display:block;">កៅអី:</label><input id="fpNewSeats" type="number" min="1" max="30" value="4" class="form-control" style="width:100%;"></div>
                            <button type="button" class="btn btn-success" onclick="window.addFloorPlanTable()">➕ បន្ថែមតុ</button>
                            <button type="button" class="btn btn-outline" onclick="window.addFloorPlanZone()">➕ ជាន់/បន្ទប់ថ្មី</button>
                        </div>

                        <div style="display:flex; gap:14px; font-size:12px; margin-bottom:10px; color:var(--text-muted); flex-wrap:wrap;">
                            <span>🟢 <b>ទំនេរ (Available)</b> — ចុចដើម្បីជ្រើសរើសតុលក់</span>
                            <span>🟠 <b>កំពុងមានភ្ញៀវ (Occupied)</b> — មានវិក្កយបត្រមិនទាន់គិតលុយ</span>
                            <span id="skmFpEditHint" style="display:none; color:var(--warning); font-weight:800;">✋ ម៉ូដកែប្លង់៖ អូសតុដើម្បីផ្លាស់ទី • ចុច ✏️ ដើម្បីកែឈ្មោះ/រាង/កៅអី • ចុច ✕ ដើម្បីលុប</span>
                        </div>

                        <div id="skmFpCanvas" style="position:relative; width:100%; height:440px; border-radius:16px; border:1.5px dashed var(--border); background-color:rgba(15,23,42,0.55); background-image:radial-gradient(rgba(148,163,184,0.22) 1px, transparent 1px); background-size:22px 22px; overflow:auto; touch-action:none;"></div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }
        window.renderFloorPlanUI();
        modal.style.display = 'flex';
    };

    window.toggleFloorPlanEditMode = function() {
        if (!isManagerOrAdmin()) return toast('⛔ មានតែ Admin ឬ Manager ប៉ុណ្ណោះអាចកែប្លង់តុបាន!', true);
        fpEditMode = !fpEditMode;
        if (!fpEditMode) persistSysSettings();
        window.renderFloorPlanUI();
    };

    window.addFloorPlanZone = async function() {
        const z = prompt('វាយឈ្មោះជាន់ ឬតំបន់ថ្មី (ឧ. ជាន់ទី ២, បន្ទប់ KTV, សួនច្បារ):');
        if (!z || !z.trim()) return;
        const cleanZ = z.trim();
        const fp = getFloorPlanData();
        if (!fp.zones.includes(cleanZ)) fp.zones.push(cleanZ);
        fpActiveZone = cleanZ;
        window.renderFloorPlanUI();
        await persistSysSettings();
        toast(`✅ បានបន្ថែមជាន់/តំបន់ "${fpActiveZone}"!`);
    };

    window.renameActiveFloorPlanZone = async function() {
        const fp = getFloorPlanData();
        const oldZ = fpActiveZone;
        if (!oldZ) return;
        const next = prompt(`ដូរឈ្មោះជាន់/តំបន់ "${oldZ}" ទៅជា៖`, oldZ);
        if (!next || !next.trim() || next.trim() === oldZ) return;
        const newZ = next.trim();
        if (fp.zones.includes(newZ)) {
            return toast(`⚠️ ឈ្មោះជាន់ "${newZ}" មានរួចហើយ!`, true);
        }
        fp.zones = fp.zones.map(z => (z === oldZ ? newZ : z));
        (fp.tables || []).forEach(t => { if (t && t.zone === oldZ) t.zone = newZ; });
        fpActiveZone = newZ;
        window.renderFloorPlanUI();
        await persistSysSettings();
        toast(`✅ បានដូរឈ្មោះជាន់ទៅជា "${newZ}"!`);
    };

    window.deleteActiveFloorPlanZone = async function() {
        const fp = getFloorPlanData();
        const targetZ = fpActiveZone;
        if (!targetZ) return;
        if ((fp.zones || []).length <= 1) {
            return toast('⚠️ ត្រូវមានជាន់/តំបន់យ៉ាងតិច ១ ជានិច្ច មិនអាចលុបអស់បានទេ!', true);
        }
        const countInZone = (fp.tables || []).filter(t => t && t.zone === targetZ).length;
        const msg = countInZone > 0
            ? `ជាន់ "${targetZ}" មានតុចំនួន ${countInZone}។ ចុច OK ដើម្បីលុបទាំងជាន់ និងតុក្នុងជាន់នេះចោល (ឬ Cancel ដើម្បីបោះបង់)?`
            : `តើអ្នកពិតជាចង់លុបជាន់/តំបន់ "${targetZ}" មែនទេ?`;
        if (!confirm(msg)) return;

        fp.zones = fp.zones.filter(z => z !== targetZ);
        fp.tables = (fp.tables || []).filter(t => t && t.zone !== targetZ);
        fpActiveZone = fp.zones[0] || '';
        window.renderFloorPlanUI();
        await persistSysSettings();
        toast(`🗑️ បានលុបជាន់ "${targetZ}" រួចរាល់!`);
    };

    function isDuplicateTableName(fp, name, ignoreId = null) {
        const target = String(name || '').trim().toLowerCase();
        if (!target) return false;
        return (fp.tables || []).some(t =>
            t && t.id !== ignoreId && String(t.name || '').trim().toLowerCase() === target
        );
    }

    window.addFloorPlanTable = async function() {
        const name = (document.getElementById('fpNewName')?.value || '').trim();
        if (!name) return toast('⚠️ សូមបញ្ចូលឈ្មោះតុ!', true);
        const fp = getFloorPlanData();
        if (isDuplicateTableName(fp, name)) {
            return toast(`⚠️ ឈ្មោះតុ "${name}" មានរួចហើយ! សូមដាក់ឈ្មោះផ្សេងកុំឱ្យជាន់គ្នា។`, true);
        }
        const shape = document.getElementById('fpNewShape')?.value || 'square';
        const seats = parseInt(document.getElementById('fpNewSeats')?.value) || 4;
        const zoneCount = fp.tables.filter(t => t.zone === fpActiveZone).length;
        const col = zoneCount % 5;
        const row = Math.floor(zoneCount / 5);
        fp.tables.push({
            id: 'TB_' + Date.now(),
            name,
            zone: fpActiveZone,
            x: 24 + col * 140,
            y: 24 + row * 125,
            shape,
            seats
        });
        document.getElementById('fpNewName').value = '';
        window.renderFloorPlanUI();
        await persistSysSettings();
        toast(`✅ បានបន្ថែមតុ "${name}"!`);
    };

    window.openEditFloorPlanTableModal = function(tbId, ev) {
        if (ev) ev.stopPropagation();
        const fp = getFloorPlanData();
        const tb = fp.tables.find(t => t.id === tbId);
        if (!tb) return;

        let modal = document.getElementById('skmFpEditTableModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmFpEditTableModal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = '10035';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            modal.innerHTML = `
                <div class="modal" style="max-width:420px; width:94%;">
                    <div class="modal-header">
                        <h2 style="font-size:17px;">✏️ កែសម្រួលព័ត៌មានតុ (Edit Table)</h2>
                        <button class="btn-outline" style="border:none; font-size:20px; padding:0;" onclick="document.getElementById('skmFpEditTableModal').style.display='none'">✕</button>
                    </div>
                    <div class="modal-body" style="display:flex; flex-direction:column; gap:10px;">
                        <input type="hidden" id="fpEditId">
                        <div>
                            <label style="font-size:12px; font-weight:800; display:block; margin-bottom:4px;">ឈ្មោះតុ (Table Name):</label>
                            <input id="fpEditName" class="form-control" style="width:100%;" placeholder="ឧ. តុលេខ 5 ឬ VIP 1" onkeydown="if(event.key==='Enter') window.saveEditFloorPlanTable()">
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                            <div>
                                <label style="font-size:12px; font-weight:800; display:block; margin-bottom:4px;">រាងតុ (Shape):</label>
                                <select id="fpEditShape" class="form-control" style="width:100%;">
                                    <option value="square">⬜ ជ្រុង (Square)</option>
                                    <option value="round">⚪ មូល (Round)</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size:12px; font-weight:800; display:block; margin-bottom:4px;">ចំនួនកៅអី (Seats):</label>
                                <input id="fpEditSeats" type="number" min="1" max="30" class="form-control" style="width:100%;">
                            </div>
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:800; display:block; margin-bottom:4px;">ជាន់ / តំបន់ (Zone):</label>
                            <select id="fpEditZone" class="form-control" style="width:100%;"></select>
                        </div>
                        <div style="display:flex; gap:8px; margin-top:6px;">
                            <button type="button" class="btn btn-outline" style="flex:1;" onclick="document.getElementById('skmFpEditTableModal').style.display='none'">បោះបង់</button>
                            <button type="button" class="btn btn-success" style="flex:1.5;" onclick="window.saveEditFloorPlanTable()">💾 រក្សាទុក</button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }

        document.getElementById('fpEditId').value = tb.id;
        document.getElementById('fpEditName').value = tb.name || '';
        document.getElementById('fpEditShape').value = tb.shape || 'square';
        document.getElementById('fpEditSeats').value = tb.seats || 4;
        const zSel = document.getElementById('fpEditZone');
        if (zSel) {
            zSel.innerHTML = (fp.zones || ['ជាន់ទី ១']).map(z => `<option value="${esc(z)}">${esc(z)}</option>`).join('');
            zSel.value = tb.zone || fpActiveZone;
        }
        modal.style.display = 'flex';
        setTimeout(() => document.getElementById('fpEditName')?.focus(), 60);
    };

    window.saveEditFloorPlanTable = async function() {
        const fp = getFloorPlanData();
        const tbId = document.getElementById('fpEditId')?.value;
        const tb = fp.tables.find(t => t.id === tbId);
        if (!tb) return;

        const newName = (document.getElementById('fpEditName')?.value || '').trim();
        if (!newName) return toast('⚠️ សូមបញ្ចូលឈ្មោះតុ!', true);
        if (isDuplicateTableName(fp, newName, tbId)) {
            return toast(`⚠️ ឈ្មោះតុ "${newName}" មានរួចហើយ! សូមដាក់ឈ្មោះផ្សេងកុំឱ្យជាន់គ្នា។`, true);
        }

        tb.name = newName;
        tb.shape = document.getElementById('fpEditShape')?.value || 'square';
        tb.seats = Math.max(1, parseInt(document.getElementById('fpEditSeats')?.value) || 4);
        tb.zone = document.getElementById('fpEditZone')?.value || tb.zone;

        document.getElementById('skmFpEditTableModal').style.display = 'none';
        window.renderFloorPlanUI();
        await persistSysSettings();
        toast(`✅ បានកែសម្រួលតុ "${newName}" រួចរាល់!`);
    };

    window.deleteFloorPlanTable = async function(tbId, ev) {
        if (ev) ev.stopPropagation();
        const fp = getFloorPlanData();
        fp.tables = fp.tables.filter(t => t.id !== tbId);
        window.renderFloorPlanUI();
        await persistSysSettings();
        toast('🗑️ បានលុបតុចេញពីប្លង់!');
    };

    function findUnpaidInvoicesForTable(tbName) {
        const target = String(tbName || '').trim().toLowerCase();
        if (!target) return [];
        return (window.invoices || []).filter(inv => {
            if (!inv) return false;
            const st = String(inv.status || 'unpaid').toLowerCase();
            if (st === 'paid' || st === 'cancelled' || st === 'void') return false;
            const cust = String(inv.customerName || inv.customer || '').trim().toLowerCase();
            const note = String(inv.note || '').toLowerCase();
            return cust === target || note.includes(`[${target}]`) || cust.includes(target);
        });
    }

    window.loadUnpaidInvoiceItemsToCart = function(invId) {
        const inv = (window.invoices || []).find(i => i && String(i.id || i.invoiceNo) === String(invId));
        if (!inv) return toast('⚠️ រកមិនឃើញវិក្កយបត្រនេះទេ!', true);
        const rawItems = Array.isArray(inv.items) ? inv.items : (Array.isArray(inv.cart) ? inv.cart : []);
        if (!rawItems.length) return toast('⚠️ វិក្កយបត្រនេះគ្មានបញ្ជីមុខទំនិញលម្អិតទេ!', true);

        const rate = window.cartRate || 4000;
        window.cart = rawItems.map((it, idx) => {
            const q = Math.max(1, parseInt(it.cartQty || it.qty || 1));
            const pr = parseFloat(it.price || 0) || 0;
            return {
                id: it.id || ('INV_ITEM_' + idx + '_' + Date.now()),
                name: it.name || it.itemName || 'Item',
                baseName: it.baseName || it.name || it.itemName || 'Item',
                price: pr,
                riel: parseFloat(it.riel) || Math.round(pr * rate),
                cartQty: q,
                qty: q,
                unit: it.unit || '',
                category: it.category || '',
                modifierLabel: it.modifierLabel || '',
                modifierExtra: parseFloat(it.modifierExtra) || 0
            };
        });
        window.__skmLoadedUnpaidInvId = inv.id || inv.invoiceNo;
        const cName = document.getElementById('posCustomerName');
        if (cName && (inv.customerName || inv.customer)) cName.value = inv.customerName || inv.customer;
        if (typeof window.renderCart === 'function') window.renderCart();
        const banner = document.getElementById('skmTableUnpaidBanner');
        if (banner) banner.style.display = 'none';
        toast(`📥 បានទាញ ${window.cart.length} មុខទំនិញពីវិក្កយបត្រ #${inv.id || inv.invoiceNo} ចូលកន្ត្រក!`);
    };

    window.selectFloorPlanTable = function(tbName) {
        if (fpEditMode) return;
        const cName = document.getElementById('posCustomerName');
        const tSel = document.getElementById('posTableSelect');
        if (tSel) {
            let opt = Array.from(tSel.options).find(o => o.value === tbName);
            if (!opt) {
                opt = document.createElement('option');
                opt.value = tbName; opt.textContent = tbName;
                tSel.appendChild(opt);
            }
            tSel.value = tbName;
        }
        if (cName) {
            cName.value = tbName;
            cName.style.borderLeft = '4px solid var(--success)';
        }
        document.getElementById('skmFloorPlanModal').style.display = 'none';
        if (typeof window.switchTab === 'function') {
            window.switchTab('pos', '🛒 ប្រព័ន្ធលក់ (Point of Sale)', document.getElementById('nav-pos'));
        }

        const sumBody = document.getElementById('cartSummaryBody');
        if (sumBody && window.getComputedStyle(sumBody).display === 'none') {
            sumBody.style.display = 'block';
        }
        const checkoutArea = document.querySelector('.pos-checkout-btns') || document.getElementById('mobileCartContainer');
        if (checkoutArea) {
            checkoutArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            checkoutArea.style.transition = 'box-shadow 0.25s ease';
            checkoutArea.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.55)';
            setTimeout(() => { checkoutArea.style.boxShadow = ''; }, 1400);
        }

        // Check if this table has unpaid/pending invoices
        const matchedInvs = findUnpaidInvoicesForTable(tbName);
        const cartItemsEl = document.getElementById('cartItems');
        let banner = document.getElementById('skmTableUnpaidBanner');
        if (!banner && cartItemsEl) {
            banner = document.createElement('div');
            banner.id = 'skmTableUnpaidBanner';
            banner.style.cssText = 'display:none; margin:8px 10px 4px; padding:9px 11px; border-radius:10px; background:rgba(245,158,11,0.14); border:1px solid #f59e0b; font-size:12px;';
            cartItemsEl.before(banner);
        }

        if (matchedInvs.length > 0) {
            const firstInv = matchedInvs[0];
            const invCode = firstInv.id || firstInv.invoiceNo || 'INV';
            const totAmt = parseFloat(firstInv.totalAmount || firstInv.total || 0).toFixed(2);
            if (banner) {
                banner.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                    <div><b style="color:#fbbf24;">🧾 ${esc(tbName)} មានវិក្កយបត្រមិនទាន់គិតលុយ</b><div style="font-size:11px; color:var(--text-muted);">#${esc(invCode)} • សរុប <b>$${totAmt}</b></div></div>
                    <button type="button" class="btn btn-warning" style="padding:5px 10px; font-size:11.5px;" onclick="window.loadUnpaidInvoiceItemsToCart('${esc(invCode)}')">📥 ទាញមុខទំនិញចូលកន្ត្រក</button>
                </div>`;
                banner.style.display = 'block';
            }
            if (!Array.isArray(window.cart) || window.cart.length === 0) {
                window.loadUnpaidInvoiceItemsToCart(invCode);
                if (typeof window.openCheckoutModal === 'function') {
                    setTimeout(() => window.openCheckoutModal(), 220);
                }
            }
            toast(`🧾 ជ្រើសរើស "${tbName}" — រកឃើញវិក្កយបត្រមិនទាន់គិតលុយ $${totAmt}!`);
        } else {
            if (banner) banner.style.display = 'none';
            if (Array.isArray(window.cart) && window.cart.length > 0 && typeof window.openCheckoutModal === 'function') {
                setTimeout(() => window.openCheckoutModal(), 180);
                toast(`🪑 ជ្រើសរើស "${tbName}" — កំពុងបើកផ្ទាំងគិតលុយ!`);
            } else {
                toast(`🪑 បានជ្រើសរើស "${tbName}" — ត្រៀមគិតលុយ/បន្ថែមទំនិញ!`);
            }
        }
    };

    // 🔄 Move Table / Merge Unpaid Table Bills Modal
    window.openMoveMergeTableModal = function() {
        const pf = getPF();
        if (!pf.floorPlan) return toast('⚠️ មុខងារប្លង់តុ 2D ត្រូវបានបិទដោយ Admin Settings!', true);

        const unpaidList = (window.invoices || []).filter(inv => {
            if (!inv) return false;
            const st = String(inv.status || 'unpaid').toLowerCase();
            return st !== 'paid' && st !== 'cancelled' && st !== 'void';
        });

        const fpTables = getFloorPlanData().tables || [];
        const selFrom = document.getElementById('skmMmSourceInv');
        const selTo = document.getElementById('skmMmTargetTable');

        let modal = document.getElementById('skmMoveMergeModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmMoveMergeModal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = '10036';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            modal.innerHTML = `
                <div class="modal" style="max-width:460px; width:95%;">
                    <div class="modal-header">
                        <h2 style="font-size:17px;">🔄 ដូរតុ ឬ បូកបញ្ចូលតុ (Move / Merge Table)</h2>
                        <button class="btn-outline" style="border:none; font-size:20px; padding:0;" onclick="document.getElementById('skmMoveMergeModal').style.display='none'">✕</button>
                    </div>
                    <div class="modal-body" style="display:flex; flex-direction:column; gap:12px;">
                        <div>
                            <label style="font-size:12px; font-weight:800; display:block; margin-bottom:4px;">1. ជ្រើសរើសវិក្កយបត្រ / តុដើម (មិនទាន់គិតលុយ):</label>
                            <select id="skmMmSourceInv" class="form-control" style="width:100%;"></select>
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:800; display:block; margin-bottom:4px;">2. តុគោលដៅ (Target Table):</label>
                            <select id="skmMmTargetTable" class="form-control" style="width:100%;"></select>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:6px;">
                            <button type="button" class="btn btn-primary" onclick="window.executeMoveTable()">🔄 ដូរតុ (Move)</button>
                            <button type="button" class="btn btn-warning" onclick="window.executeMergeTable()">🔀 បូកបញ្ចូលតុ (Merge)</button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }

        const srcSel = document.getElementById('skmMmSourceInv');
        const dstSel = document.getElementById('skmMmTargetTable');
        if (srcSel) {
            srcSel.innerHTML = unpaidList.length
                ? unpaidList.map(inv => `<option value="${esc(inv.id || inv.invoiceNo)}">${esc(inv.customerName || inv.customer || 'ភ្ញៀវ')} — #${esc(inv.id || inv.invoiceNo)} ($${Number(inv.totalAmount || inv.total || 0).toFixed(2)})</option>`).join('')
                : '<option value="">-- គ្មានវិក្កយបត្រមិនទាន់គិតលុយទេ --</option>';
        }
        if (dstSel) {
            const curInputTbl = document.getElementById('posTableSelect')?.value || document.getElementById('posCustomerName')?.value || '';
            const names = [...new Set([...fpTables.map(t => t.name), curInputTbl, 'តុលេខ 1', 'តុលេខ 2', 'តុលេខ 3', 'តុលេខ 4', 'តុលេខ 5', 'VIP 1', 'VIP 2'].filter(Boolean))];
            dstSel.innerHTML = names.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');
        }
        modal.style.display = 'flex';
    };

    async function saveInvoicesAfterTableOp(msg) {
        if (typeof window.saveInvoices === 'function') await window.saveInvoices();
        else if (typeof window.getBranchKey === 'function') localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(window.invoices || []));
        if (typeof window.renderUnpaid === 'function') window.renderUnpaid();
        window.renderFloorPlanUI();
        document.getElementById('skmMoveMergeModal').style.display = 'none';
        toast(msg);
    }

    window.executeMoveTable = async function() {
        const invId = document.getElementById('skmMmSourceInv')?.value;
        const dstTbl = document.getElementById('skmMmTargetTable')?.value;
        if (!invId || !dstTbl) return toast('⚠️ សូមជ្រើសរើសវិក្កយបត្រ និងតុគោលដៅ!', true);
        const inv = (window.invoices || []).find(i => i && String(i.id || i.invoiceNo) === String(invId));
        if (!inv) return;
        const oldName = inv.customerName || inv.customer || '';
        inv.customerName = dstTbl;
        if (inv.customer) inv.customer = dstTbl;
        inv.note = String(inv.note || '').replace(/\[[^\]]+\]/g, '').trim() + ` [${dstTbl}] (ដូរពី ${oldName})`;
        await saveInvoicesAfterTableOp(`🔄 បានដូរវិក្កយបត្រទៅ "${dstTbl}" រួចរាល់!`);
    };

    window.executeMergeTable = async function() {
        const invId = document.getElementById('skmMmSourceInv')?.value;
        const dstTbl = document.getElementById('skmMmTargetTable')?.value;
        if (!invId || !dstTbl) return toast('⚠️ សូមជ្រើសរើសវិក្កយបត្រ និងតុគោលដៅ!', true);
        const srcInv = (window.invoices || []).find(i => i && String(i.id || i.invoiceNo) === String(invId));
        if (!srcInv) return;

        const dstList = findUnpaidInvoicesForTable(dstTbl).filter(i => (i.id || i.invoiceNo) !== (srcInv.id || srcInv.invoiceNo));
        const srcItems = Array.isArray(srcInv.items) ? srcInv.items : [];
        const srcTot = parseFloat(srcInv.totalAmount || srcInv.total || 0) || 0;

        if (dstList.length > 0) {
            const targetInv = dstList[0];
            targetInv.items = [...(Array.isArray(targetInv.items) ? targetInv.items : []), ...srcItems];
            targetInv.totalAmount = Number(((parseFloat(targetInv.totalAmount || targetInv.total || 0) || 0) + srcTot).toFixed(2));
            targetInv.total = targetInv.totalAmount;
            window.invoices = (window.invoices || []).filter(i => i !== srcInv);
            await saveInvoicesAfterTableOp(`🔀 បានបូកបញ្ចូលវិក្កយបត្រចូល "${dstTbl}" ($${targetInv.totalAmount.toFixed(2)})!`);
        } else {
            srcInv.customerName = dstTbl;
            if (srcInv.customer) srcInv.customer = dstTbl;
            await saveInvoicesAfterTableOp(`🔄 បានផ្ទេរវិក្កយបត្រទៅ "${dstTbl}"!`);
        }
    };

    window.renderFloorPlanUI = function() {
        const fp = getFloorPlanData();
        const zBar = document.getElementById('skmFpZonesBar');
        const aCtrl = document.getElementById('skmFpAdminControls');
        const addForm = document.getElementById('skmFpAddForm');
        const hint = document.getElementById('skmFpEditHint');
        const canvas = document.getElementById('skmFpCanvas');
        if (!canvas) return;

        if (zBar) {
            zBar.innerHTML = fp.zones.map(z =>
                `<button type="button" class="btn ${z === fpActiveZone ? 'btn-primary' : 'btn-outline'}" style="padding:6px 12px; font-size:12.5px;" onclick="window._setFpZone('${esc(z)}')">${esc(z)}</button>`
            ).join('');
        }
        if (aCtrl) {
            if (!isManagerOrAdmin()) {
                aCtrl.innerHTML = '';
            } else if (!fpEditMode) {
                aCtrl.innerHTML = `<button type="button" class="btn btn-outline" style="padding:6px 12px; font-size:12.5px;" onclick="window.toggleFloorPlanEditMode()">✏️ រៀបចំប្លង់ (Edit)</button>
                    <button type="button" class="btn btn-outline" style="padding:6px 12px; font-size:12.5px; border-color:#f59e0b; color:#f59e0b;" onclick="window.openMoveMergeTableModal()">🔄 ដូរ / បូកតុ</button>`;
            } else {
                aCtrl.innerHTML = `
                    <button type="button" class="btn btn-outline" style="padding:6px 10px; font-size:12px;" onclick="window.renameActiveFloorPlanZone()">✏️ ដូរឈ្មោះជាន់</button>
                    <button type="button" class="btn btn-danger" style="padding:6px 10px; font-size:12px;" onclick="window.deleteActiveFloorPlanZone()">🗑️ លុបជាន់</button>
                    <button type="button" class="btn btn-success" style="padding:6px 12px; font-size:12.5px;" onclick="window.toggleFloorPlanEditMode()">💾 រួចរាល់ (Save Layout)</button>
                `;
            }
        }
        if (addForm) addForm.style.display = fpEditMode ? 'flex' : 'none';
        if (hint) hint.style.display = fpEditMode ? 'inline' : 'none';

        const occMap = getTableOccupiedMap();
        const zoneTables = fp.tables.filter(t => t.zone === fpActiveZone);
        if (zoneTables.length === 0) {
            canvas.innerHTML = '<div style="text-align:center; padding-top:160px; color:var(--text-muted); font-size:14px;">មិនទាន់មានតុក្នុងជាន់នេះទេ។ ចុច «✏️ រៀបចំប្លង់» ដើម្បីបន្ថែមតុ!</div>';
            return;
        }

        canvas.innerHTML = zoneTables.map(t => {
            const occ = occMap[String(t.name).toLowerCase()];
            const isRound = t.shape === 'round';
            const bg = occ ? 'linear-gradient(135deg, rgba(245,158,11,0.28), rgba(239,68,68,0.25))' : 'linear-gradient(135deg, rgba(16,185,129,0.22), rgba(6,182,212,0.18))';
            const border = occ ? '#f59e0b' : '#10b981';
            return `
                <div class="skm-fp-node" data-tbid="${esc(t.id)}"
                     style="position:absolute; left:${t.x || 20}px; top:${t.y || 20}px; width:116px; height:${isRound ? '116px' : '96px'}; border-radius:${isRound ? '50%' : '16px'}; background:${bg}; border:2px solid ${border}; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:8px; cursor:${fpEditMode ? 'grab' : 'pointer'}; user-select:none; box-shadow:0 8px 20px rgba(0,0,0,0.28); transition:box-shadow 0.2s;"
                     onclick="window.selectFloorPlanTable('${esc(t.name)}')">
                    ${fpEditMode ? `<button type="button" title="កែឈ្មោះ / រាង / កៅអី" onclick="window.openEditFloorPlanTableModal('${esc(t.id)}', event)" style="position:absolute; top:-8px; left:-8px; width:24px; height:24px; border-radius:50%; border:none; background:#0ea5e9; color:#fff; font-size:11px; font-weight:900; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.35);">✏️</button><button type="button" title="លុបតុ" onclick="window.deleteFloorPlanTable('${esc(t.id)}', event)" style="position:absolute; top:-8px; right:-8px; width:24px; height:24px; border-radius:50%; border:none; background:#ef4444; color:#fff; font-size:11px; font-weight:900; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.35);">✕</button>` : ''}
                    <div style="font-weight:900; font-size:14px; color:#fff; text-shadow:0 1px 4px rgba(0,0,0,0.6);">${esc(t.name)}</div>
                    <div style="font-size:11px; color:#e2e8f0; margin-top:2px;">🪑 ${t.seats || 4} កៅអី</div>
                    ${occ
                        ? `<div style="font-size:11px; font-weight:900; color:#fde047; background:rgba(0,0,0,0.45); padding:1px 7px; border-radius:999px; margin-top:3px;">$${occ.total.toFixed(2)}</div>`
                        : `<div style="font-size:10px; font-weight:800; color:#34d399; margin-top:2px;">ទំនេរ</div>`}
                </div>`;
        }).join('');

        if (fpEditMode) {
            canvas.querySelectorAll('.skm-fp-node').forEach(node => {
                node.addEventListener('pointerdown', (e) => {
                    if (e.target.tagName === 'BUTTON') return;
                    fpDraggingId = node.getAttribute('data-tbid');
                    const rect = node.getBoundingClientRect();
                    fpDragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
                    node.setPointerCapture(e.pointerId);
                    node.style.cursor = 'grabbing';
                });
                node.addEventListener('pointermove', (e) => {
                    if (!fpDraggingId || fpDraggingId !== node.getAttribute('data-tbid')) return;
                    const cRect = canvas.getBoundingClientRect();
                    const nx = Math.max(8, Math.round((e.clientX - cRect.left + canvas.scrollLeft - fpDragOffset.x) / 10) * 10);
                    const ny = Math.max(8, Math.round((e.clientY - cRect.top + canvas.scrollTop - fpDragOffset.y) / 10) * 10);
                    node.style.left = nx + 'px';
                    node.style.top = ny + 'px';
                    const tb = fp.tables.find(t => t.id === fpDraggingId);
                    if (tb) { tb.x = nx; tb.y = ny; }
                });
                node.addEventListener('pointerup', () => {
                    if (fpDraggingId) {
                        fpDraggingId = null;
                        node.style.cursor = 'grab';
                    }
                });
            });
        }
    };

    window._setFpZone = function(z) { fpActiveZone = z; window.renderFloorPlanUI(); };
    window.refreshFloorPlanStatus = function() {
        const m = document.getElementById('skmFloorPlanModal');
        if (m && m.style.display === 'flex') window.renderFloorPlanUI();
    };

    // =========================================================
    // 5. COMBO SETS / RECIPE AUTO STOCK DEDUCTION
    // =========================================================
    let draftComboComponents = [];

    function getComboSets() {
        if (!window.sysSettings) window.sysSettings = {};
        if (!Array.isArray(window.sysSettings.comboSets)) window.sysSettings.comboSets = [];
        return window.sysSettings.comboSets;
    }

    window.openComboSetsModal = function() {
        const pf = getPF();
        if (!pf.comboSets) return toast('⚠️ មុខងារឈុត Combo ត្រូវបានបិទដោយ Admin Settings!', true);
        draftComboComponents = [];
        let modal = document.getElementById('skmComboModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmComboModal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = '10026';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            modal.innerHTML = `
                <div class="modal" style="max-width:760px; width:96%;">
                    <div class="modal-header">
                        <h2 style="font-size:18px;">🍱 ឈុតទំនិញ Combo & កាត់ស្តុកស្វ័យប្រវត្តិ (Combo Sets)</h2>
                        <button class="btn-outline" style="border:none; font-size:20px; padding:0;" onclick="document.getElementById('skmComboModal').style.display='none'">✕</button>
                    </div>
                    <div class="modal-body" style="max-height:76vh; overflow-y:auto;">
                        <div id="skmComboCreatorBox" style="background:rgba(16,185,129,0.06); border:1px dashed var(--success); border-radius:12px; padding:14px; margin-bottom:16px;">
                            <div style="font-weight:900; font-size:13.5px; color:var(--success); margin-bottom:8px;">➕ បង្កើតឈុត Combo ថ្មី (Admin / Manager):</div>
                            <div style="display:grid; grid-template-columns:2fr 1fr; gap:8px; margin-bottom:8px;">
                                <input id="comboNameInp" class="form-control" placeholder="ឈ្មោះឈុត (ឧ. Burger Set 1, កាហ្វេ + នំបុ័ង)">
                                <input id="comboPriceInp" type="number" step="0.01" class="form-control" placeholder="តម្លៃឈុត ($)">
                            </div>
                            <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
                                <select id="comboCompSel" class="form-control" style="flex:2; min-width:180px;"></select>
                                <input id="comboCompQty" type="number" min="1" value="1" class="form-control" style="width:75px; text-align:center;">
                                <button type="button" class="btn btn-outline" onclick="window.addDraftComboComp()">➕ បញ្ចូលគ្រឿងផ្សំ</button>
                            </div>
                            <div id="comboDraftList" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px;"></div>
                            <button type="button" class="btn btn-success" style="width:100%;" onclick="window.saveNewComboSet()">💾 រក្សាទុកឈុត Combo នេះ</button>
                        </div>

                        <h4 style="font-size:14px; margin-bottom:10px;">🛍️ បញ្ជីឈុត Combo (ចុច «➕ ដាក់កន្ត្រក» ដើម្បីលក់):</h4>
                        <div id="skmComboCardsGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:10px;"></div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }
        window.renderComboSetsUI();
        modal.style.display = 'flex';
    };

    window.addDraftComboComp = function() {
        const pid = document.getElementById('comboCompSel')?.value;
        const qty = Math.max(1, parseInt(document.getElementById('comboCompQty')?.value) || 1);
        const prod = (window.inventory || []).find(p => p && String(p.id) === String(pid));
        if (!prod) return;
        const ex = draftComboComponents.find(c => String(c.id) === String(prod.id));
        if (ex) ex.qty += qty;
        else draftComboComponents.push({ id: prod.id, name: prod.name, qty });
        window.renderDraftComboComps();
    };

    window.removeDraftComboComp = function(idx) { draftComboComponents.splice(idx, 1); window.renderDraftComboComps(); };

    window.renderDraftComboComps = function() {
        const box = document.getElementById('comboDraftList');
        if (!box) return;
        box.innerHTML = draftComboComponents.map((c, idx) =>
            `<span style="display:inline-flex; align-items:center; gap:6px; background:var(--bg-card); border:1px solid var(--border); padding:4px 10px; border-radius:999px; font-size:12px; font-weight:800;">
                ${esc(c.name)} ×${c.qty}
                <button type="button" style="border:none; background:none; color:var(--danger); cursor:pointer; font-weight:900;" onclick="window.removeDraftComboComp(${idx})">✕</button>
            </span>`
        ).join('') || '<span style="font-size:12px; color:var(--text-muted);">មិនទាន់បានជ្រើសរើសទំនិញផ្សំចូលឈុតទេ...</span>';
    };

    window.saveNewComboSet = async function() {
        if (!isManagerOrAdmin()) return toast('⛔ មានតែ Admin/Manager ប៉ុណ្ណោះអាចបង្កើត Combo បាន!', true);
        const name = (document.getElementById('comboNameInp')?.value || '').trim();
        const price = parseFloat(document.getElementById('comboPriceInp')?.value) || 0;
        if (!name || price <= 0) return toast('⚠️ សូមបញ្ចូលឈ្មោះឈុត និងតម្លៃលក់ ($)!', true);
        if (draftComboComponents.length === 0) return toast('⚠️ សូមបន្ថែមទំនិញផ្សំយ៉ាងហោចណាស់ ១ មុខ!', true);

        const combos = getComboSets();
        combos.unshift({
            id: 'COMBO_' + Date.now(),
            name,
            price,
            items: JSON.parse(JSON.stringify(draftComboComponents))
        });
        document.getElementById('comboNameInp').value = '';
        document.getElementById('comboPriceInp').value = '';
        draftComboComponents = [];
        window.renderComboSetsUI();
        await persistSysSettings();
        toast(`✅ បានបង្កើតឈុត "${name}" រួចរាល់!`);
    };

    window.deleteComboSet = async function(idx) {
        if (!isManagerOrAdmin()) return;
        const combos = getComboSets();
        combos.splice(idx, 1);
        window.renderComboSetsUI();
        await persistSysSettings();
        toast('🗑️ បានលុបឈុត Combo!');
    };

    window.addComboToPosCart = function(comboId) {
        const combo = getComboSets().find(c => c.id === comboId);
        if (!combo) return;
        // Verify component stock unless preorder is enabled
        if (!(window.sysSettings && window.sysSettings.preorder)) {
            for (const comp of (combo.items || [])) {
                const p = (window.inventory || []).find(i => i && String(i.id) === String(comp.id));
                const avail = p ? (parseInt(p.qty) || 0) : 0;
                if (avail < comp.qty) {
                    return toast(`⚠️ ស្តុក "${comp.name}" សល់តែ ${avail} មិនគ្រប់សម្រាប់ឈុតនេះទេ!`, true);
                }
            }
        }
        if (!window.cart) window.cart = [];
        const ex = window.cart.find(c => c && c.id === combo.id);
        if (ex) {
            ex.cartQty++; ex.qty = ex.cartQty;
        } else {
            window.cart.push({
                id: combo.id,
                name: `🍱 ${combo.name}`,
                baseName: `🍱 ${combo.name}`,
                price: combo.price,
                riel: Math.round(combo.price * (window.cartRate || 4000)),
                unit: 'ឈុត',
                category: 'Combo',
                isCombo: true,
                comboItems: combo.items,
                cartQty: 1,
                qty: 1
            });
        }
        if (typeof window.playBeep === 'function') window.playBeep();
        if (typeof window.renderCart === 'function') window.renderCart();
        document.getElementById('skmComboModal').style.display = 'none';
        toast(`✅ បានដាក់ឈុត "${combo.name}" ចូលកន្ត្រក!`);
    };

    window.renderComboSetsUI = function() {
        const creator = document.getElementById('skmComboCreatorBox');
        if (creator) creator.style.display = isManagerOrAdmin() ? 'block' : 'none';
        const sel = document.getElementById('comboCompSel');
        if (sel) {
            sel.innerHTML = (window.inventory || []).filter(Boolean).map(p =>
                `<option value="${esc(p.id)}">${esc(p.name)} (សល់: ${p.qty})</option>`
            ).join('');
        }
        window.renderDraftComboComps();
        const grid = document.getElementById('skmComboCardsGrid');
        if (!grid) return;
        const combos = getComboSets();
        if (combos.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:24px; color:var(--text-muted);">មិនទាន់មានឈុត Combo ទេ។</div>';
            return;
        }
        grid.innerHTML = combos.map((c, idx) => `
            <div style="background:var(--bg-dark); border:1px solid var(--border); border-radius:14px; padding:14px; display:flex; flex-direction:column; gap:8px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6px;">
                    <b style="font-size:14.5px; color:var(--text-main);">🍱 ${esc(c.name)}</b>
                    <b style="font-size:16px; color:var(--success);">$${Number(c.price).toFixed(2)}</b>
                </div>
                <div style="font-size:11.5px; color:var(--text-muted); line-height:1.5;">
                    ${(c.items || []).map(it => `• ${esc(it.name)} ×${it.qty}`).join('<br>')}
                </div>
                <div style="display:flex; gap:6px; margin-top:auto;">
                    <button type="button" class="btn btn-primary" style="flex:1; padding:7px; font-size:12px;" onclick="window.addComboToPosCart('${esc(c.id)}')">➕ ដាក់កន្ត្រក</button>
                    ${isManagerOrAdmin() ? `<button type="button" class="btn btn-danger" style="padding:7px 10px; font-size:12px;" onclick="window.deleteComboSet(${idx})">🗑️</button>` : ''}
                </div>
            </div>`).join('');
    };

    // =========================================================
    // 6. SHIFT MANAGEMENT & CASH DRAWER DISCREPANCY LOG
    // =========================================================
    function getShiftStore() {
        if (!window.sysSettings) window.sysSettings = {};
        if (!window.sysSettings.shiftData) {
            window.sysSettings.shiftData = { activeShift: null, history: [] };
        }
        return window.sysSettings.shiftData;
    }

    function computeShiftLiveStats(shift) {
        if (!shift) return { salesCash: 0, salesCount: 0, expenses: 0, expectedUsd: 0 };
        const startMs = shift.openedAt || 0;
        let salesCash = 0, salesCount = 0, expenses = 0;
        (window.invoices || []).forEach(inv => {
            if (!inv) return;
            const ts = inv.timestamp || 0;
            if (ts >= startMs) {
                salesCount++;
                const st = String(inv.status || 'unpaid').toLowerCase();
                if (st === 'paid') salesCash += parseFloat(inv.totalAmount || inv.total || 0);
                else salesCash += parseFloat(inv.paidUsd || inv.paidAmount || 0);
            }
        });
        (window.expenses || []).forEach(e => {
            if (!e) return;
            if ((e.timestamp || 0) >= startMs) expenses += parseFloat(e.amount || 0);
        });
        const expectedUsd = (parseFloat(shift.openingUsd) || 0) + salesCash - expenses;
        return { salesCash, salesCount, expenses, expectedUsd };
    }

    window.openShiftManagementModal = function() {
        const pf = getPF();
        if (!pf.shiftManagement) return toast('⚠️ មុខងារគ្រប់គ្រងវេនលក់ ត្រូវបានបិទដោយ Admin Settings!', true);

        let modal = document.getElementById('skmShiftModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmShiftModal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = '10027';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            modal.innerHTML = `
                <div class="modal" style="max-width:740px; width:96%;">
                    <div class="modal-header">
                        <h2 style="font-size:18px;">⏱️ គ្រប់គ្រងវេនលក់ & ផ្ទៀងផ្ទាត់ទូរប្រាក់ (Shift & Discrepancy)</h2>
                        <button class="btn-outline" style="border:none; font-size:20px; padding:0;" onclick="document.getElementById('skmShiftModal').style.display='none'">✕</button>
                    </div>
                    <div class="modal-body" style="max-height:76vh; overflow-y:auto;">
                        <div id="skmShiftActivePanel" style="margin-bottom:18px;"></div>
                        <h4 style="font-size:14px; margin-bottom:8px;">📜 ប្រវត្តិបិទវេនលក់ & លុយបាត់/លើស (Shift Discrepancy Log)</h4>
                        <div class="table-responsive">
                            <table style="font-size:12.5px;">
                                <thead><tr><th>ម៉ោងបើក - បិទ</th><th>បុគ្គលិក</th><th>ដើមគ្រា</th><th>លក់បាន</th><th>រំពឹងទុក</th><th>រាប់ជាក់ស្តែង</th><th>លើស / ខ្វះ</th></tr></thead>
                                <tbody id="skmShiftHistoryBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }
        window.renderShiftModalUI();
        modal.style.display = 'flex';
    };

    window.renderShiftModalUI = function() {
        const store = getShiftStore();
        const panel = document.getElementById('skmShiftActivePanel');
        const histBody = document.getElementById('skmShiftHistoryBody');
        const rate = window.cartRate || 4000;

        if (panel) {
            if (!store.activeShift) {
                panel.innerHTML = `
                    <div style="background:rgba(16,185,129,0.08); border:1.5px dashed var(--success); border-radius:14px; padding:18px; text-align:center;">
                        <div style="font-size:16px; font-weight:900; color:var(--success); margin-bottom:8px;">🟢 មិនទាន់បានបើកវេនលក់ទេ (No Active Shift)</div>
                        <p style="font-size:12.5px; color:var(--text-muted); margin-bottom:14px;">បញ្ចូលប្រាក់ដើមគ្រាក្នុងទូរ (Starting Cash Float) មុនចាប់ផ្តើមលក់៖</p>
                        <div style="display:flex; gap:10px; max-width:420px; margin:0 auto 14px;">
                            <div style="flex:1; text-align:left;"><label style="font-size:12px;">ប្រាក់ដើម ($):</label><input id="shOpenUsd" type="number" step="0.01" value="0" class="form-control" style="width:100%; text-align:center; font-weight:900;"></div>
                            <div style="flex:1; text-align:left;"><label style="font-size:12px;">ប្រាក់ដើម (៛):</label><input id="shOpenKhr" type="number" step="100" value="0" class="form-control" style="width:100%; text-align:center; font-weight:900;"></div>
                        </div>
                        <button type="button" class="btn btn-success" style="padding:10px 28px; font-size:14.5px;" onclick="window.startNewPosShift()">🔓 បើកវេនលក់ឥឡូវនេះ (Open Shift)</button>
                    </div>`;
            } else {
                const s = store.activeShift;
                const st = computeShiftLiveStats(s);
                panel.innerHTML = `
                    <div style="background:rgba(56,189,248,0.08); border:1.5px solid var(--primary); border-radius:14px; padding:16px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
                            <div>
                                <div style="font-size:15px; font-weight:900; color:var(--primary);">🟢 វេនកំពុងដំណើរការ — 👤 ${esc(s.cashier)}</div>
                                <div style="font-size:12px; color:var(--text-muted);">បើកម៉ោង៖ ${new Date(s.openedAt).toLocaleString('km-KH')}</div>
                            </div>
                            <span style="background:rgba(16,185,129,0.18); color:var(--success); padding:4px 12px; border-radius:999px; font-weight:900; font-size:12px;">វិក្កយបត្រក្នុងវេន៖ ${st.salesCount}</span>
                        </div>
                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(135px, 1fr)); gap:8px; margin-bottom:14px;">
                            <div style="background:var(--bg-card); padding:10px; border-radius:10px; border:1px solid var(--border);"><small style="color:var(--text-muted);">ប្រាក់ដើមគ្រា</small><div style="font-size:17px; font-weight:900;">$${Number(s.openingUsd).toFixed(2)}</div></div>
                            <div style="background:var(--bg-card); padding:10px; border-radius:10px; border:1px solid var(--border);"><small style="color:var(--text-muted);">ចំណូលលក់ក្នុងវេន</small><div style="font-size:17px; font-weight:900; color:var(--success);">+$${st.salesCash.toFixed(2)}</div></div>
                            <div style="background:var(--bg-card); padding:10px; border-radius:10px; border:1px solid var(--border);"><small style="color:var(--text-muted);">ចំណាយក្នុងវេន</small><div style="font-size:17px; font-weight:900; color:var(--danger);">-$${st.expenses.toFixed(2)}</div></div>
                            <div style="background:var(--bg-card); padding:10px; border-radius:10px; border:1px solid var(--primary);"><small style="color:var(--primary); font-weight:800;">ប្រាក់រំពឹងទុកក្នុងទូរ</small><div style="font-size:18px; font-weight:900; color:var(--primary);">$${st.expectedUsd.toFixed(2)}</div></div>
                        </div>
                        <div style="background:rgba(0,0,0,0.06); padding:12px; border-radius:12px;">
                            <div style="font-size:12.5px; font-weight:800; margin-bottom:8px;">💵 រាប់សាច់ប្រាក់ជាក់ស្តែងក្នុងទូរដើម្បីបិទវេន (Actual Counted Cash):</div>
                            <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:end;">
                                <div style="flex:1; min-width:120px;"><label style="font-size:11.5px;">រាប់ជាក់ស្តែង ($):</label><input id="shCloseUsd" type="number" step="0.01" placeholder="${st.expectedUsd.toFixed(2)}" class="form-control" style="width:100%; font-weight:900;" oninput="window.previewShiftDiff(${st.expectedUsd})"></div>
                                <div style="flex:1; min-width:120px;"><label style="font-size:11.5px;">រាប់ជាក់ស្តែង (៛):</label><input id="shCloseKhr" type="number" step="100" value="0" class="form-control" style="width:100%; font-weight:900;" oninput="window.previewShiftDiff(${st.expectedUsd})"></div>
                                <div style="flex:1.2; min-width:150px;"><label style="font-size:11.5px;">ចំណាំ (Note):</label><input id="shCloseNote" type="text" placeholder="មូលហេតុបាត់/លើស..." class="form-control" style="width:100%;"></div>
                            </div>
                            <div id="shLiveDiffPreview" style="margin:10px 0; font-size:14px; font-weight:900; text-align:center;"></div>
                            <button type="button" class="btn btn-danger" style="width:100%; padding:10px;" onclick="window.closeActivePosShift()">🔒 បញ្ជាក់បិទវេន & កត់ត្រា (Close Shift)</button>
                        </div>
                    </div>`;
            }
        }

        if (histBody) {
            histBody.innerHTML = (store.history || []).slice(0, 30).map(h => {
                const diff = Number(h.diffUsd || 0);
                const diffHtml = Math.abs(diff) < 0.01
                    ? '<span style="color:var(--success); font-weight:900;">✓ ត្រូវគ្នា ($0.00)</span>'
                    : (diff > 0
                        ? `<span style="color:#38bdf8; font-weight:900;">+$${diff.toFixed(2)} (លើស)</span>`
                        : `<span style="color:var(--danger); font-weight:900;">-$${Math.abs(diff).toFixed(2)} (ខ្វះ)</span>`);
                return `<tr>
                    <td style="font-size:11.5px;">${esc(h.openedStr)}<br>➔ ${esc(h.closedStr)}</td>
                    <td><b>${esc(h.cashier)}</b>${h.note ? `<br><small style="color:var(--text-muted);">${esc(h.note)}</small>` : ''}</td>
                    <td>$${Number(h.openingUsd).toFixed(2)}</td>
                    <td style="color:var(--success);">$${Number(h.salesCash).toFixed(2)}</td>
                    <td><b>$${Number(h.expectedUsd).toFixed(2)}</b></td>
                    <td><b>$${Number(h.actualUsd).toFixed(2)}</b></td>
                    <td>${diffHtml}</td>
                </tr>`;
            }).join('') || '<tr><td colspan="7" style="text-align:center; padding:18px; color:var(--text-muted);">មិនទាន់មានប្រវត្តិបិទវេនទេ</td></tr>';
        }
    };

    window.previewShiftDiff = function(expectedUsd) {
        const u = parseFloat(document.getElementById('shCloseUsd')?.value) || 0;
        const k = parseFloat(document.getElementById('shCloseKhr')?.value) || 0;
        const actual = u + (k / (window.cartRate || 4000));
        const diff = actual - expectedUsd;
        const el = document.getElementById('shLiveDiffPreview');
        if (!el) return;
        if (Math.abs(diff) < 0.01) {
            el.style.color = 'var(--success)';
            el.innerText = `✅ ត្រូវគ្នា ១០០%! (រាប់បាន $${actual.toFixed(2)})`;
        } else if (diff > 0) {
            el.style.color = '#38bdf8';
            el.innerText = `➕ លើសប្រាក់ +$${diff.toFixed(2)} (រាប់បាន $${actual.toFixed(2)} ទល់នឹង $${expectedUsd.toFixed(2)})`;
        } else {
            el.style.color = 'var(--danger)';
            el.innerText = `⚠️ ខ្វះប្រាក់ -$${Math.abs(diff).toFixed(2)} (រាប់បាន $${actual.toFixed(2)} ទល់នឹង $${expectedUsd.toFixed(2)})`;
        }
    };

    window.startNewPosShift = async function() {
        const u = parseFloat(document.getElementById('shOpenUsd')?.value) || 0;
        const k = parseFloat(document.getElementById('shOpenKhr')?.value) || 0;
        const openingUsd = u + (k / (window.cartRate || 4000));
        const cashier = window.activeUser ? (window.activeUser.fullName || window.activeUser.username) : 'Admin';
        const store = getShiftStore();
        store.activeShift = {
            id: 'SH_' + Date.now(),
            cashier,
            openedAt: Date.now(),
            openingUsd
        };
        window.renderShiftModalUI();
        window.syncAdvancedPosButtons();
        hookCheckoutAndStockInKitchenPrint();
        hookCancelDeleteGuardsAndAlerts();
        setTimeout(() => { hookCheckoutAndStockInKitchenPrint(); hookCancelDeleteGuardsAndAlerts(); }, 1200);
        await persistSysSettings();
        toast(`✅ បានបើកវេនលក់ដោយ ${cashier} (ដើមគ្រា $${openingUsd.toFixed(2)})!`);
    };

    window.closeActivePosShift = async function() {
        const store = getShiftStore();
        const s = store.activeShift;
        if (!s) return;
        const st = computeShiftLiveStats(s);
        const uRaw = document.getElementById('shCloseUsd')?.value;
        const u = uRaw === '' ? st.expectedUsd : (parseFloat(uRaw) || 0);
        const k = parseFloat(document.getElementById('shCloseKhr')?.value) || 0;
        const actualUsd = u + (k / (window.cartRate || 4000));
        const diffUsd = actualUsd - st.expectedUsd;
        const note = (document.getElementById('shCloseNote')?.value || '').trim();

        const record = {
            id: s.id,
            cashier: s.cashier,
            openedAt: s.openedAt,
            closedAt: Date.now(),
            openedStr: new Date(s.openedAt).toLocaleString('km-KH'),
            closedStr: new Date().toLocaleString('km-KH'),
            openingUsd: s.openingUsd,
            salesCash: st.salesCash,
            expenses: st.expenses,
            expectedUsd: st.expectedUsd,
            actualUsd,
            diffUsd,
            note
        };
        store.history.unshift(record);
        store.history = store.history.slice(0, 60);
        store.activeShift = null;

        window.renderShiftModalUI();
        window.syncAdvancedPosButtons();
        await persistSysSettings();

        // Optional Telegram alert if telegramZReport is enabled
        const pf = getPF();
        const sys = window.sysSettings || {};
        const tok = (sys.orderTelegramBotToken || sys.telegramBotToken || window.telegramBotToken || '').trim();
        const cid = (sys.orderTelegramChatId || sys.telegramChatId || window.telegramChatId || '').trim();
        if (pf.telegramZReport && tok && cid && navigator.onLine) {
            const diffTxt = Math.abs(diffUsd) < 0.01 ? '✅ ត្រូវគ្នា ($0.00)' : (diffUsd > 0 ? `➕ លើស +$${diffUsd.toFixed(2)}` : `⚠️ ខ្វះ -$${Math.abs(diffUsd).toFixed(2)}`);
            const msg = `⏱️ <b>របាយការណ៍បិទវេនលក់ (Shift Closed)</b>\n🏪 ហាង: <b>${esc(window.shopName || getBranch())}</b>\n👤 បុគ្គលិក: ${esc(record.cashier)}\n🕒 ${record.openedStr} ➔ ${record.closedStr}\n━━━━━━━━━━━━━━━\n💵 ដើមគ្រា: $${record.openingUsd.toFixed(2)}\n💰 ចំណូលក្នុងវេន: +$${record.salesCash.toFixed(2)}\n📉 ចំណាយក្នុងវេន: -$${record.expenses.toFixed(2)}\n📊 ប្រាក់រំពឹងទុក: <b>$${record.expectedUsd.toFixed(2)}</b>\n🧾 រាប់ជាក់ស្តែង: <b>$${record.actualUsd.toFixed(2)}</b>\n⚖️ <b>ផ្ទៀងផ្ទាត់៖ ${diffTxt}</b>` + (note ? `\n📝 ចំណាំ: ${esc(note)}` : '');
            fetch(`https://api.telegram.org/bot${tok}/sendMessage`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: cid, text: msg, parse_mode: 'HTML' })
            }).catch(() => {});
        }
        toast('✅ បានបិទវេនលក់ និងកត់ត្រាទូរប្រាក់រួចរាល់!');
    };

    // =========================================================
    // 7. MULTI-WAREHOUSE LOCATIONS & INTERNAL STOCK TRANSFER
    // =========================================================
    function getWarehouseData() {
        if (!window.sysSettings) window.sysSettings = {};
        const defaultListRaw = window.sysSettings.warehousesList || 'ហាងគោល (Main), ឃ្លាំង BKK, ឃ្លាំង TK';
        const configuredNames = String(defaultListRaw).split(',').map(s => s.trim()).filter(Boolean);
        if (!window.sysSettings.warehouseData) {
            window.sysSettings.warehouseData = { warehouses: configuredNames, stockMap: {}, logs: [] };
        } else if (configuredNames.length > 0) {
            configuredNames.forEach(w => {
                if (!window.sysSettings.warehouseData.warehouses.includes(w)) {
                    window.sysSettings.warehouseData.warehouses.push(w);
                }
            });
        }
        return window.sysSettings.warehouseData;
    }

    window.openMultiWarehouseModal = function() {
        const pf = getPF();
        if (!pf.multiWarehouse) return toast('⚠️ មុខងារឃ្លាំងស្តុកច្រើនទីតាំង ត្រូវបានបិទដោយ Admin Settings!', true);
        if (!isManagerOrAdmin()) return toast('⛔ មុខងារគ្រប់គ្រងឃ្លាំងសម្រាប់តែ Admin ឬ Manager ប៉ុណ្ណោះ!', true);

        let modal = document.getElementById('skmWarehouseModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmWarehouseModal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = '10028';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            modal.innerHTML = `
                <div class="modal" style="max-width:860px; width:96%;">
                    <div class="modal-header">
                        <h2 style="font-size:18px;">🏭 គ្រប់គ្រងឃ្លាំងស្តុកច្រើនទីតាំង (Multi-Warehouse)</h2>
                        <button class="btn-outline" style="border:none; font-size:20px; padding:0;" onclick="document.getElementById('skmWarehouseModal').style.display='none'">✕</button>
                    </div>
                    <div class="modal-body" style="max-height:76vh; overflow-y:auto;">
                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(145px, 1fr)); gap:8px; background:rgba(56,189,248,0.08); border:1px dashed var(--primary); padding:12px; border-radius:12px; margin-bottom:16px; align-items:end;">
                            <div><label style="font-size:11.5px;">ទំនិញ:</label><select id="whProdSel" class="form-control" style="width:100%;"></select></div>
                            <div><label style="font-size:11.5px;">សកម្មភាព:</label><select id="whActionSel" class="form-control" style="width:100%;" onchange="window.toggleWhDestField()"><option value="transfer">🔁 ផ្ទេររវាងឃ្លាំង</option><option value="in">📥 នាំចូលឃ្លាំង (+)</option><option value="out">📤 ដកចេញពីឃ្លាំង (-)</option></select></div>
                            <div><label style="font-size:11.5px;">ឃ្លាំងប្រភព:</label><select id="whFromSel" class="form-control" style="width:100%;"></select></div>
                            <div id="whToWrap"><label style="font-size:11.5px;">ទៅឃ្លាំងគោលដៅ:</label><select id="whToSel" class="form-control" style="width:100%;"></select></div>
                            <div><label style="font-size:11.5px;">ចំនួន (Qty):</label><input id="whQtyInp" type="number" min="1" value="1" class="form-control" style="width:100%;"></div>
                            <button type="button" class="btn btn-success" style="width:100%;" onclick="window.executeWarehouseAction()">✅ បញ្ជាក់</button>
                        </div>

                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
                            <h4 style="font-size:14px;">📦 បំណែងចែកស្តុកតាមឃ្លាំង (Stock by Warehouse)</h4>
                            <button type="button" class="btn btn-outline" style="padding:5px 10px; font-size:12px;" onclick="window.addNewWarehouseLoc()">➕ បន្ថែមឃ្លាំងថ្មី</button>
                        </div>
                        <div class="table-responsive" style="margin-bottom:16px;">
                            <table style="font-size:12.5px;">
                                <thead id="whTableHead"></thead>
                                <tbody id="whTableBody"></tbody>
                            </table>
                        </div>

                        <h4 style="font-size:13.5px; margin-bottom:6px;">📜 ប្រវត្តិចលនាឃ្លាំងចុងក្រោយ (Warehouse Logs)</h4>
                        <div id="whLogsBox" style="max-height:140px; overflow-y:auto; font-size:12px; display:flex; flex-direction:column; gap:5px;"></div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }
        window.renderMultiWarehouseUI();
        modal.style.display = 'flex';
    };

    window.toggleWhDestField = function() {
        const act = document.getElementById('whActionSel')?.value;
        const wrap = document.getElementById('whToWrap');
        if (wrap) wrap.style.display = act === 'transfer' ? 'block' : 'none';
    };

    window.addNewWarehouseLoc = async function() {
        const nm = prompt('បញ្ចូលឈ្មោះឃ្លាំងថ្មី (ឧ. ឃ្លាំងស្ទឹងមានជ័យ, ឃ្លាំងសាខា ២):');
        if (!nm || !nm.trim()) return;
        const wd = getWarehouseData();
        if (!wd.warehouses.includes(nm.trim())) wd.warehouses.push(nm.trim());
        window.sysSettings.warehousesList = wd.warehouses.join(', ');
        window.renderMultiWarehouseUI();
        await persistSysSettings();
        toast(`✅ បានបន្ថែមឃ្លាំង "${nm.trim()}"!`);
    };

    window.executeWarehouseAction = async function() {
        const wd = getWarehouseData();
        const pid = document.getElementById('whProdSel').value;
        const act = document.getElementById('whActionSel').value;
        const fromW = document.getElementById('whFromSel').value;
        const toW = document.getElementById('whToSel').value;
        const qty = parseInt(document.getElementById('whQtyInp').value) || 0;
        const prod = (window.inventory || []).find(p => p && String(p.id) === String(pid));
        if (!prod || qty <= 0) return toast('⚠️ សូមជ្រើសរើសទំនិញ និងចំនួន!', true);
        if (act === 'transfer' && fromW === toW) return toast('⚠️ សូមជ្រើសរើសឃ្លាំងប្រភព និងឃ្លាំងគោលដៅឱ្យខុសគ្នា!', true);

        if (!wd.stockMap[pid]) {
            wd.stockMap[pid] = {};
            wd.stockMap[pid][wd.warehouses[0]] = parseInt(prod.qty) || 0;
        }
        const m = wd.stockMap[pid];
        if (act === 'transfer') {
            const avail = parseInt(m[fromW]) || 0;
            if (avail < qty) return toast(`⚠️ ឃ្លាំង "${fromW}" សល់តែ ${avail} ប៉ុណ្ណោះ!`, true);
            m[fromW] = avail - qty;
            m[toW] = (parseInt(m[toW]) || 0) + qty;
            wd.logs.unshift(`${new Date().toLocaleString('km-KH')} — 🔁 ផ្ទេរ ${prod.name} ×${qty} (${fromW} ➔ ${toW})`);
        } else if (act === 'in') {
            m[fromW] = (parseInt(m[fromW]) || 0) + qty;
            prod.qty = (parseInt(prod.qty) || 0) + qty;
            wd.logs.unshift(`${new Date().toLocaleString('km-KH')} — 📥 នាំចូល ${prod.name} +${qty} ទៅ ${fromW}`);
        } else if (act === 'out') {
            const avail = parseInt(m[fromW]) || 0;
            if (avail < qty) return toast(`⚠️ ឃ្លាំង "${fromW}" សល់តែ ${avail} ប៉ុណ្ណោះ!`, true);
            m[fromW] = avail - qty;
            prod.qty = Math.max(0, (parseInt(prod.qty) || 0) - qty);
            wd.logs.unshift(`${new Date().toLocaleString('km-KH')} — 📤 ដកចេញ ${prod.name} -${qty} ពី ${fromW}`);
        }
        wd.logs = wd.logs.slice(0, 50);

        if (act !== 'transfer') {
            localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
            if (window.supabaseClient && navigator.onLine) {
                try {
                    await window.supabaseClient.from('pos_products')
                        .update({ qty: prod.qty, updated_at: new Date().toISOString() })
                        .eq('id', String(prod.id)).eq('branch_id', getBranch());
                } catch(e) {}
            }
            if (typeof window.renderInventory === 'function') window.renderInventory();
            if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
        }
        window.renderMultiWarehouseUI();
        await persistSysSettings();
        toast('✅ បានធ្វើបច្ចុប្បន្នភាពស្តុកឃ្លាំងជោគជ័យ!');
    };

    window.renderMultiWarehouseUI = function() {
        const wd = getWarehouseData();
        const pSel = document.getElementById('whProdSel');
        const fSel = document.getElementById('whFromSel');
        const tSel = document.getElementById('whToSel');
        if (pSel) pSel.innerHTML = (window.inventory || []).filter(Boolean).map(p => `<option value="${esc(p.id)}">${esc(p.name)} (សរុប: ${p.qty})</option>`).join('');
        const wOpts = wd.warehouses.map(w => `<option value="${esc(w)}">${esc(w)}</option>`).join('');
        if (fSel) fSel.innerHTML = wOpts;
        if (tSel) {
            tSel.innerHTML = wOpts;
            if (wd.warehouses.length > 1) tSel.value = wd.warehouses[1];
        }
        window.toggleWhDestField();

        const thead = document.getElementById('whTableHead');
        const tbody = document.getElementById('whTableBody');
        if (thead) {
            thead.innerHTML = `<tr><th>ទំនិញ</th><th style="text-align:center;">ស្តុកសរុប</th>${wd.warehouses.map(w => `<th style="text-align:center;">${esc(w)}</th>`).join('')}</tr>`;
        }
        if (tbody) {
            tbody.innerHTML = (window.inventory || []).filter(Boolean).slice(0, 60).map(p => {
                const m = wd.stockMap[p.id] || { [wd.warehouses[0]]: parseInt(p.qty) || 0 };
                return `<tr><td><b>${esc(p.name)}</b></td><td style="text-align:center; font-weight:900; color:var(--primary);">${p.qty}</td>${wd.warehouses.map(w => `<td style="text-align:center;">${parseInt(m[w]) || 0}</td>`).join('')}</tr>`;
            }).join('');
        }
        const lBox = document.getElementById('whLogsBox');
        if (lBox) {
            lBox.innerHTML = (wd.logs || []).map(l => `<div style="padding:5px 8px; background:rgba(0,0,0,0.05); border-radius:6px;">${esc(l)}</div>`).join('')
                || '<span style="color:var(--text-muted);">មិនទាន់មានចលនាឃ្លាំងទេ</span>';
        }
    };

    // =========================================================
    // 8. MOUNT ALL ADMIN-CONTROLLED UI ELEMENTS DYNAMICALLY
    // =========================================================
    window.syncAdvancedPosButtons = function() {
        const pf = getPF();

        // A. Order Modes 3-Button Bar (Dine-In / Takeaway / Delivery) inside POS Cart Header
        const cartItemsEl = document.getElementById('cartItems');
        if (cartItemsEl) {
            let omBar = document.getElementById('skmOrderModeBar');
            if (!omBar) {
                omBar = document.createElement('div');
                omBar.id = 'skmOrderModeBar';
                omBar.style.cssText = 'padding:8px 10px 4px; border-bottom:1px solid var(--border); display:none;';
                omBar.innerHTML = `
                    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:5px;">
                        <button type="button" class="btn btn-outline skm-om-btn" data-om="dinein" style="padding:5px 4px; font-size:11.5px; justify-content:center;" onclick="window.setPosOrderMode('dinein')">🍽️ ញ៉ាំនៅហាង</button>
                        <button type="button" class="btn btn-outline skm-om-btn" data-om="takeaway" style="padding:5px 4px; font-size:11.5px; justify-content:center;" onclick="window.setPosOrderMode('takeaway')">🛍️ ទិញខ្ចប់</button>
                        <button type="button" class="btn btn-outline skm-om-btn" data-om="delivery" style="padding:5px 4px; font-size:11.5px; justify-content:center;" onclick="window.setPosOrderMode('delivery')">🛵 ដឹកជញ្ជូន</button>
                    </div>
                    <div id="skmDeliveryFeeRow" style="display:none; justify-content:space-between; align-items:center; margin-top:6px; padding:4px 6px; background:rgba(245,158,11,0.1); border-radius:8px; font-size:12px;">
                        <span style="font-weight:800; color:var(--warning);">🛵 ថ្លៃដឹកជញ្ជូន ($):</span>
                        <input id="skmDeliveryFeeInp" type="number" min="0" step="0.25" class="form-control" style="width:72px; height:26px; text-align:center; padding:2px;" oninput="window.setCustomDeliveryFee(this.value)">
                    </div>`;
                cartItemsEl.before(omBar);
            }
            updateOrderModeUI();
        }

        // B. Pre-set Discount Chips Bar above Discount Row in POS Cart
        const discRow = document.getElementById('posDiscountContainer');
        if (discRow) {
            let chipBar = document.getElementById('skmPresetDiscChipsBar');
            if (!chipBar) {
                chipBar = document.createElement('div');
                chipBar.id = 'skmPresetDiscChipsBar';
                chipBar.style.cssText = 'display:none; flex-wrap:wrap; gap:5px; margin:6px 0 8px;';
                discRow.after(chipBar);
            }
            if (pf.itemDiscounts) {
                const presets = parsePresetDiscounts();
                chipBar.innerHTML = presets.map(ch =>
                    `<button type="button" class="btn btn-outline" style="padding:2px 7px; font-size:10.5px; border-radius:999px; border-color:rgba(245,158,11,0.45); color:var(--warning);" onclick="window.applyPresetCartDiscount(${ch.val}, '${ch.type}')">${esc(ch.label)} ${ch.type === '$' ? '$' + ch.val : ch.val + '%'}</button>`
                ).join('');
                chipBar.style.display = presets.length > 0 ? 'flex' : 'none';
            } else {
                chipBar.style.display = 'none';
            }
        }

        // C. POS Quick Toolbar (Floor Plan 2D, Combo Sets, Shift Management)
        const posSearchRow = document.querySelector('#tab-pos #posSearch')?.parentElement;
        if (posSearchRow) {
            let advBar = document.getElementById('skmPosAdvancedBar');
            if (!advBar) {
                advBar = document.createElement('div');
                advBar.id = 'skmPosAdvancedBar';
                advBar.style.cssText = 'display:none; gap:6px; flex-wrap:wrap; margin-bottom:8px;';
                posSearchRow.after(advBar);
            }
            const shiftActive = !!(window.sysSettings?.shiftData?.activeShift);
            let h = '';
            if (pf.floorPlan) h += `<button type="button" class="btn btn-outline" style="padding:6px 11px; font-size:12px; border-color:#10b981; color:#10b981;" onclick="window.openFloorPlanModal()">🗺️ ប្លង់តុ 2D</button>`;
            if (pf.comboSets) h += `<button type="button" class="btn btn-outline" style="padding:6px 11px; font-size:12px; border-color:#f59e0b; color:#f59e0b;" onclick="window.openComboSetsModal()">🍱 ឈុត Combo</button>`;
            if (pf.shiftManagement) h += `<button type="button" class="btn btn-outline" style="padding:6px 11px; font-size:12px; border-color:${shiftActive ? '#22c55e' : '#38bdf8'}; color:${shiftActive ? '#22c55e' : '#38bdf8'};" onclick="window.openShiftManagementModal()">${shiftActive ? '🟢 វេនកំពុងបើក' : '⏱️ បើក/បិទវេន'}</button>`;
            advBar.innerHTML = h;
            advBar.style.display = h ? 'flex' : 'none';
        }

        // D. Inventory Action Group (Multi-Warehouse & Combo Sets)
        const invGrp = document.getElementById('inventoryActionButtonsGroup');
        if (invGrp) {
            let advInv = document.getElementById('skmAdvInvGroup');
            if (!advInv) {
                advInv = document.createElement('div');
                advInv.id = 'skmAdvInvGroup';
                advInv.style.cssText = 'display:inline-flex; gap:8px; flex-wrap:wrap; align-items:center;';
                invGrp.prepend(advInv);
            }
            const canMgr = isManagerOrAdmin();
            let h = '';
            if (pf.multiWarehouse && canMgr) h += `<button type="button" class="btn btn-outline" style="border-color:#38bdf8; color:#38bdf8;" onclick="window.openMultiWarehouseModal()">🏭 ឃ្លាំងស្តុក</button>`;
            if (pf.comboSets && canMgr) h += `<button type="button" class="btn btn-outline" style="border-color:#a855f7; color:#a855f7;" onclick="window.openComboSetsModal()">🍱 ឈុត Combo</button>`;
            advInv.innerHTML = h;
            advInv.style.display = h ? 'inline-flex' : 'none';
        }

        // E. Dashboard Toolbar (Shift Management & Floor Plan shortcuts)
        const dashBar = document.querySelector('#tab-dashboard .toolbar');
        if (dashBar) {
            let advDash = document.getElementById('skmAdvDashGroup');
            if (!advDash) {
                advDash = document.createElement('div');
                advDash.id = 'skmAdvDashGroup';
                advDash.style.cssText = 'display:none; gap:8px; flex-wrap:wrap; align-items:center;';
                dashBar.appendChild(advDash);
            }
            let h = '';
            if (pf.shiftManagement) h += `<button type="button" class="btn btn-outline" style="border-color:#22c55e; color:#22c55e; font-size:12px;" onclick="window.openShiftManagementModal()">⏱️ វេនលក់ & ទូរប្រាក់</button>`;
            if (pf.multiWarehouse && isManagerOrAdmin()) h += `<button type="button" class="btn btn-outline" style="border-color:#38bdf8; color:#38bdf8; font-size:12px;" onclick="window.openMultiWarehouseModal()">🏭 ឃ្លាំងស្តុក</button>`;
            advDash.innerHTML = h;
            advDash.style.display = h ? 'flex' : 'none';
        }
    };


    // =========================================================
    // 9. AUTO-DISPATCH TO KITCHEN / DEPARTMENT PRINTER ON CHECKOUT & STOCK-IN
    // Supports:
    //  - PC Desktop App (window.SKMDesktopBridge.printRawIp / printSilentHtml)
    //  - Local Print Bridge (POST /print-batch to LAN IP:9100)
    //  - Browser Print Fallback (if no IP/Desktop bridge is configured)
    // Zero extra Supabase Egress!
    // =========================================================
    function getConfiguredKitchenTargets() {
        const sys = window.sysSettings || {};
        const targets = [];
        const depts = Array.isArray(sys.deptPrinters) ? sys.deptPrinters : [];

        depts.forEach(p => {
            if (!p || !p.name) return;
            const nm = String(p.name).toLowerCase();
            const isKitchenOrBar =
                nm.includes('kitchen') || nm.includes('ផ្ទះបាយ') ||
                nm.includes('bar') || nm.includes('បារ') || nm.includes('ភេសជ្ជៈ') ||
                p.type === 'network';
            if (isKitchenOrBar) {
                targets.push({
                    id: p.id || p.name,
                    name: p.name,
                    type: p.type || (p.ip && p.ip !== 'default' ? 'network' : 'local'),
                    ip: p.ip && p.ip !== 'default' ? String(p.ip).trim() : '',
                    port: parseInt(p.port) || 9100,
                    winPrinter: String(p.winPrinter || '').trim()
                });
            }
        });

        // Also include any printer explicitly mapped in categoryRouting
        const routing = sys.categoryRouting || {};
        Object.keys(routing).forEach(catKey => {
            const pid = routing[catKey];
            if (!pid || pid === 'none' || pid === 'cashier') return;
            const found = depts.find(d => d && (d.id === pid || d.name === pid));
            if (found && !targets.some(t => t.name === found.name)) {
                targets.push({
                    id: found.id || found.name,
                    name: found.name,
                    type: found.type || (found.ip && found.ip !== 'default' ? 'network' : 'local'),
                    ip: found.ip && found.ip !== 'default' ? String(found.ip).trim() : '',
                    port: parseInt(found.port) || 9100,
                    winPrinter: String(found.winPrinter || '').trim()
                });
            }
        });

        return targets;
    }

    function buildKitchenTicketText(title, tableLabel, modeLabel, itemsList, noteText) {
        const lines = [];
        lines.push(`*** ${title} ***`);
        lines.push(`Branch: ${getBranch()}`);
        if (tableLabel) lines.push(`Table/Ref: ${tableLabel}`);
        if (modeLabel) lines.push(`Mode: ${modeLabel}`);
        lines.push(`Time: ${new Date().toLocaleTimeString('en-GB')}`);
        lines.push('--------------------------------');
        (itemsList || []).forEach(it => {
            const q = it.cartQty || it.qty || 1;
            lines.push(`${q}x  ${it.name || it.itemName || 'Item'}`);
            if (it.modifierLabel) lines.push(`    -> ${it.modifierLabel}`);
            if (it.note) lines.push(`    * ${it.note}`);
        });
        if (noteText) {
            lines.push('--------------------------------');
            lines.push(`Note: ${noteText}`);
        }
        return lines.join('\n');
    }

    function buildKitchenTicketHtml(title, tableLabel, modeLabel, itemsList, noteText) {
        const rowsHtml = (itemsList || []).map(it => {
            const q = it.cartQty || it.qty || 1;
            const sub = [it.modifierLabel ? `(${esc(it.modifierLabel)})` : '', it.note ? `[${esc(it.note)}]` : ''].filter(Boolean).join(' ');
            return `<tr>
                <td style="padding:4px 0;font-weight:900;font-size:14px;width:44px;">${q}x</td>
                <td style="padding:4px 0;font-weight:700;font-size:13px;">${esc(it.name || it.itemName || 'Item')}${sub ? `<div style="font-size:11px;font-weight:400;">${sub}</div>` : ''}</td>
            </tr>`;
        }).join('');

        return `<div style="font-family:'Battambang','Kantumruy Pro',sans-serif;color:#000;padding:4px;">
            <div style="text-align:center;font-weight:900;font-size:16px;border-bottom:1px dashed #000;padding-bottom:4px;margin-bottom:6px;">${esc(title)}</div>
            <div style="font-size:11.5px;margin-bottom:6px;">
                ${tableLabel ? `<div><b>តុ/យោង៖</b> ${esc(tableLabel)}</div>` : ''}
                ${modeLabel ? `<div><b>ប្រភេទ៖</b> ${esc(modeLabel)}</div>` : ''}
                <div><b>ម៉ោង៖</b> ${new Date().toLocaleLocaleString ? new Date().toLocaleTimeString('km-KH') : new Date().toLocaleTimeString()}</div>
            </div>
            <table style="width:100%;border-collapse:collapse;border-top:1px dashed #000;border-bottom:1px dashed #000;margin:6px 0;">${rowsHtml}</table>
            ${noteText ? `<div style="font-size:12px;font-weight:700;margin-top:6px;">📝 ចំណាំ៖ ${esc(noteText)}</div>` : ''}
        </div>`;
    }

    const recentKitchenDispatchMap = {};
    function isDuplicateKitchenDispatch(ticketType, tableLabel, itemsList) {
        const sigItems = (itemsList || []).map(it =>
            `${String(it.id || it.name || it.itemName || '')}:${Number(it.cartQty || it.qty || 1)}:${String(it.modifierLabel || '')}`
        ).sort().join('|');
        const sig = `${ticketType}::${String(tableLabel || '').trim().toLowerCase()}::${sigItems}`;
        const now = Date.now();
        // Clean entries older than 8 seconds
        Object.keys(recentKitchenDispatchMap).forEach(k => {
            if (now - recentKitchenDispatchMap[k] > 8000) delete recentKitchenDispatchMap[k];
        });
        if (recentKitchenDispatchMap[sig] && (now - recentKitchenDispatchMap[sig]) < 5000) {
            return true;
        }
        recentKitchenDispatchMap[sig] = now;
        return false;
    }

    window.dispatchToKitchenPrinters = async function(ticketType, itemsList, opts = {}) {
        const sys = window.sysSettings || {};
        const pf = getPF();
        const shouldRoute = Boolean(sys.toggleMultiPrinter) || Boolean(pf.floorPlan) || Boolean(pf.comboSets) || ticketType === 'stock_in';
        if (!shouldRoute) return;
        if (!Array.isArray(itemsList) || itemsList.length === 0) return;
        const _preTable = opts.tableLabel || document.getElementById('posTableSelect')?.value || document.getElementById('posCustomerName')?.value || '';
        if (isDuplicateKitchenDispatch(ticketType, _preTable, itemsList)) return;

        const targets = getConfiguredKitchenTargets();
        const tableLabel = opts.tableLabel || document.getElementById('posTableSelect')?.value || document.getElementById('posCustomerName')?.value || '';
        const modeMap = { dinein: 'ញ៉ាំនៅហាង (Dine-In)', takeaway: 'ទិញខ្ចប់ (Takeaway)', delivery: 'ដឹកជញ្ជូន (Delivery)' };
        const modeLabel = opts.modeLabel || (pf.orderModes ? (modeMap[window.currentPosOrderMode] || '') : '');
        const noteText = opts.noteText || '';
        const title = ticketType === 'stock_in'
            ? 'បញ្ចូលស្តុកចុងភៅ (KITCHEN STOCK-IN)'
            : 'បញ្ជាចម្អិនចុងភៅ (KITCHEN ORDER)';

        const rawJobs = targets.filter(t => t.ip).map(t => ({
            targetName: t.name,
            ip: t.ip,
            port: t.port || 9100,
            text: buildKitchenTicketText(title, tableLabel, modeLabel, itemsList, noteText),
            cutPaper: true,
            openDrawer: false
        }));

        const bridgeUrl = String(sys.printBridgeUrl || 'http://127.0.0.1:9191').trim().replace(/\/+$/, '');
        const mode = String(sys.silentPrintMode || 'browser');
        const htmlDoc = buildKitchenTicketHtml(title, tableLabel, modeLabel, itemsList, noteText);
        const winTarget = targets.find(t => t.winPrinter)?.winPrinter || String(sys.cashierWinPrinter || '').trim();

        let dispatched = false;

        // 1. Electron PC Desktop App native IPC
        if (window.SKMDesktopBridge) {
            if (rawJobs.length > 0 && typeof window.SKMDesktopBridge.printRawIp === 'function') {
                try {
                    const r = await window.SKMDesktopBridge.printRawIp(rawJobs);
                    if (r && r.ok) dispatched = true;
                } catch (e) {}
            }
            if (!dispatched && (mode === 'desktop_silent' || targets.length > 0) && typeof window.SKMDesktopBridge.printSilentHtml === 'function') {
                try {
                    const r2 = await window.SKMDesktopBridge.printSilentHtml({
                        html: htmlDoc,
                        deviceName: winTarget,
                        paperMm: parseFloat(sys.customReceiptConfig?.paperMm) || 80,
                        title
                    });
                    if (r2 && r2.ok) dispatched = true;
                } catch (e) {}
            }
        }

        // 2. Local Print Bridge HTTP server (LAN IP:9100)
        if (!dispatched && rawJobs.length > 0 && navigator.onLine) {
            try {
                const resp = await fetch(`${bridgeUrl}/print-batch`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobs: rawJobs })
                });
                if (resp.ok) dispatched = true;
            } catch (e) {}
        }

        // 3. Fallback: open clean kitchen slip in browser print window only when explicitly enabled & no silent bridge answered
        if (!dispatched && sys.autoKitchenBrowserPrint === true) {
            const w = window.open('', '_blank', 'width=380,height=560');
            if (w) {
                w.document.write(`<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>${esc(title)}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap" rel="stylesheet">
                    <style>@page{size:80mm auto;margin:0;}body{width:76mm;margin:0 auto;padding:4mm;font-family:'Battambang',sans-serif;}</style></head><body>${htmlDoc}</body></html>`);
                w.document.close();
                setTimeout(() => { try { w.print(); w.close(); } catch (e) {} }, 350);
            }
        }
    };

    function hookCheckoutAndStockInKitchenPrint() {
        // Hook A: When checkout finishes (processCheckoutPaid)
        if (typeof window.processCheckoutPaid === 'function' && !window.processCheckoutPaid.__skmKitchenHooked) {
            const _origPay = window.processCheckoutPaid;
            window.processCheckoutPaid = async function() {
                const snapCart = Array.isArray(window.cart) ? window.cart.map(c => Object.assign({}, c)) : [];
                const tblVal = document.getElementById('posTableSelect')?.value || document.getElementById('posCustomerName')?.value || '';
                const res = await _origPay.apply(this, arguments);
                if (snapCart.length > 0) {
                    setTimeout(() => window.dispatchToKitchenPrinters('order', snapCart, { tableLabel: tblVal }), 220);
                }
                return res;
            };
            window.processCheckoutPaid.__skmKitchenHooked = true;
        }

        // Hook B: When saving/updating a product in Inventory (saveProduct) -> dispatch stock-in slip to kitchen if qty increased
        if (typeof window.saveProduct === 'function' && !window.saveProduct.__skmKitchenHooked) {
            const _origSaveP = window.saveProduct;
            window.saveProduct = async function() {
                const editId = document.getElementById('pId')?.value || '';
                const pName = document.getElementById('pName')?.value || '';
                const newQty = parseInt(document.getElementById('pQty')?.value) || 0;
                const oldProd = editId ? (window.inventory || []).find(p => p && String(p.id) === String(editId)) : null;
                const prevQty = oldProd ? (parseInt(oldProd.qty) || 0) : 0;
                const addedQty = editId ? Math.max(0, newQty - prevQty) : newQty;

                const res = await _origSaveP.apply(this, arguments);
                if (addedQty > 0 && pName) {
                    setTimeout(() => {
                        window.dispatchToKitchenPrinters('stock_in', [{ name: pName, cartQty: addedQty }], {
                            tableLabel: editId ? 'បន្ថែមស្តុក (Restock)' : 'ទំនិញថ្មី (New Stock)'
                        });
                    }, 250);
                }
                return res;
            };
            window.saveProduct.__skmKitchenHooked = true;
        }
    }


    // =========================================================
    // 10. CANCEL / DELETE ALERT TO KITCHEN + PASSWORD GATE + PER-STAFF PERMISSION
    // Zero extra Supabase Egress!
    // =========================================================
    function getStaffPermMap() {
        if (!window.sysSettings) window.sysSettings = {};
        if (!window.sysSettings.staffPermOverrides || typeof window.sysSettings.staffPermOverrides !== 'object') {
            window.sysSettings.staffPermOverrides = {};
        }
        return window.sysSettings.staffPermOverrides;
    }

    function getActiveStaffKey() {
        const u = window.activeUser || {};
        return String(u.id || u.username || '').trim().toLowerCase();
    }

    function getActiveStaffOverride() {
        const key = getActiveStaffKey();
        if (!key) return null;
        const map = getStaffPermMap();
        return map[key] || null;
    }

    window.canPerformProtectedAction = function(actionKind) {
        if (isManagerOrAdmin()) return true;
        const ov = getActiveStaffOverride();
        if (ov) {
            if (actionKind === 'delete_invoice' && typeof ov.canDeleteInvoice === 'boolean') return ov.canDeleteInvoice;
            if (actionKind === 'cancel_order' && typeof ov.canCancelOrder === 'boolean') return ov.canCancelOrder;
        }
        const pf = getPF();
        if (pf.strictAdminAuth === true) return false;
        return true;
    };

    function verifyDeletePassword(inputPw) {
        const clean = String(inputPw || '').trim();
        if (!clean) return false;
        const sys = window.sysSettings || {};
        const customDelPw = String(sys.deleteActionPassword || '').trim();
        if (customDelPw && clean === customDelPw) return true;
        if (sys.storePin && clean === String(sys.storePin).trim()) return true;

        const u = window.activeUser || {};
        const accs = Array.isArray(window.userAccounts) ? window.userAccounts : [];
        const matchSelf = accs.find(a => a && (
            (u.id && String(a.id) === String(u.id)) ||
            (u.username && String(a.username || '').toLowerCase() === String(u.username).toLowerCase())
        ));
        const candidateAcc = matchSelf || accs.find(a => a && String(a.role || '').toLowerCase() === 'admin');
        if (candidateAcc && candidateAcc.password) {
            if (typeof window.verifyPassword === 'function') {
                if (window.verifyPassword(clean, candidateAcc.password)) return true;
            }
            if (String(candidateAcc.password) === clean) return true;
        }
        return false;
    }

    window.promptPasswordThenRun = function(titleText, descText, onVerifiedCallback) {
        let modal = document.getElementById('skmProtectedPwModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmProtectedPwModal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = '10045';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            modal.innerHTML = `
                <div class="modal" style="max-width:400px; width:94%;">
                    <div class="modal-header">
                        <h2 id="skmPwModalTitle" style="font-size:17px; color:var(--danger);">🔐 ទាមទារលេខកូដសម្ងាត់</h2>
                        <button class="btn-outline" style="border:none; font-size:20px; padding:0;" onclick="document.getElementById('skmProtectedPwModal').style.display='none'">✕</button>
                    </div>
                    <div class="modal-body" style="display:flex; flex-direction:column; gap:10px;">
                        <p id="skmPwModalDesc" style="font-size:12.5px; color:var(--text-muted); margin:0;"></p>
                        <input type="password" id="skmPwModalInput" class="form-control" placeholder="បញ្ចូលលេខកូដសម្ងាត់..." style="width:100%; font-size:15px; font-weight:800;" onkeydown="if(event.key==='Enter') window.confirmProtectedPwAction()">
                        <div id="skmPwModalErr" style="display:none; color:var(--danger); font-size:12px; font-weight:800;"></div>
                        <div style="display:flex; gap:8px; margin-top:4px;">
                            <button type="button" class="btn btn-outline" style="flex:1;" onclick="document.getElementById('skmProtectedPwModal').style.display='none'">បោះបង់</button>
                            <button type="button" class="btn btn-danger" style="flex:1.5;" onclick="window.confirmProtectedPwAction()">✅ ផ្ទៀងផ្ទាត់ & បន្ត</button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }

        window.__skmPendingPwCallback = onVerifiedCallback;
        document.getElementById('skmPwModalTitle').innerText = titleText || '🔐 ទាមទារលេខកូដសម្ងាត់';
        document.getElementById('skmPwModalDesc').innerText = descText || 'សូមបញ្ចូលលេខកូដសម្ងាត់ដើម្បីបញ្ជាក់ការលុប/បោះបង់៖';
        const errEl = document.getElementById('skmPwModalErr');
        if (errEl) { errEl.style.display = 'none'; errEl.innerText = ''; }
        const inp = document.getElementById('skmPwModalInput');
        if (inp) inp.value = '';
        modal.style.display = 'flex';
        setTimeout(() => inp?.focus(), 60);
    };

    window.confirmProtectedPwAction = async function() {
        const inp = document.getElementById('skmPwModalInput');
        const errEl = document.getElementById('skmPwModalErr');
        const pw = inp ? inp.value : '';
        if (!verifyDeletePassword(pw)) {
            if (errEl) {
                errEl.innerText = '❌ លេខកូដសម្ងាត់មិនត្រឹមត្រូវទេ!';
                errEl.style.display = 'block';
            }
            return;
        }
        const cb = window.__skmPendingPwCallback;
        window.__skmPendingPwCallback = null;
        document.getElementById('skmProtectedPwModal').style.display = 'none';
        if (typeof cb === 'function') await cb();
    };

    window.notifyKitchenCancelledOrder = async function(reasonLabel, itemsList, refLabel) {
        const list = Array.isArray(itemsList) && itemsList.length > 0
            ? itemsList
            : [{ name: reasonLabel || 'បោះបង់ការកុម្ម៉ង់', cartQty: 1 }];
        const tbl = refLabel || document.getElementById('posTableSelect')?.value || document.getElementById('posCustomerName')?.value || '';
        const textTitle = `❌ CANCEL / លុបបញ្ជា (${reasonLabel || 'VOID'})`;

        // Send via existing kitchen dispatch helper
        await window.dispatchToKitchenPrinters('cancel', list, {
            tableLabel: tbl,
            noteText: `លុប/បោះបង់ដោយ៖ ${window.activeUser?.fullName || window.activeUser?.username || 'Staff'}`
        });

        // Also send direct Telegram alert to Order/Service Telegram if configured
        const sys = window.sysSettings || {};
        const tok = (sys.orderTelegramBotToken || sys.serviceTelegramBotToken || sys.telegramBotToken || window.telegramBotToken || '').trim();
        const cid = (sys.orderTelegramChatId || sys.serviceTelegramChatId || sys.telegramChatId || window.telegramChatId || '').trim();
        if (tok && cid && navigator.onLine) {
            const lines = list.map(it => `• ${it.cartQty || it.qty || 1}x ${esc(it.name || it.itemName || 'Item')}`).join('\n');
            const msg = `🚨 <b>${esc(textTitle)}</b>\n🏪 ហាង: <b>${esc(window.shopName || getBranch())}</b>\n🪑 តុ/យោង: <b>${esc(tbl || '-')}</b>\n👤 អ្នកលុប: ${esc(window.activeUser?.fullName || window.activeUser?.username || 'User')}\n\n${lines}`;
            fetch(`https://api.telegram.org/bot${tok}/sendMessage`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: cid, text: msg, parse_mode: 'HTML' })
            }).catch(() => {});
        }
    };

    function hookCancelDeleteGuardsAndAlerts() {
        // 1. Guard clearCart() with password + notify kitchen/Telegram when items were in cart
        if (typeof window.clearCart === 'function' && !window.clearCart.__skmGuardHooked) {
            const _origClear = window.clearCart;
            window.clearCart = function() {
                const items = Array.isArray(window.cart) ? window.cart.map(c => Object.assign({}, c)) : [];
                if (items.length === 0) return _origClear.apply(this, arguments);
                const tbl = document.getElementById('posTableSelect')?.value || document.getElementById('posCustomerName')?.value || '';
                window.promptPasswordThenRun(
                    '🔐 បញ្ជាក់លេខកូដដើម្បីបោះបង់កន្ត្រក',
                    `កន្ត្រកមាន ${items.length} មុខ។ បញ្ចូលលេខកូដដើម្បីបោះបង់ និងជូនដំណឹងទៅផ្ទះបាយ៖`,
                    () => {
                        _origClear.apply(window, arguments);
                        window.notifyKitchenCancelledOrder('បោះបង់កន្ត្រក (Clear Cart)', items, tbl);
                    }
                );
            };
            window.clearCart.__skmGuardHooked = true;
        }

        // 2. Guard deleteInvoice() with password + permission check + notify kitchen/Telegram
        if (typeof window.deleteInvoice === 'function' && !window.deleteInvoice.__skmGuardHooked) {
            const _origDelInv = window.deleteInvoice;
            window.deleteInvoice = function(invId) {
                if (!window.canPerformProtectedAction('delete_invoice')) {
                    return toast('⛔ គណនីនេះមិនមានសិទ្ធិលុបវិក្កយបត្រទេ! សូមសួរ Admin។', true);
                }
                const inv = (window.invoices || []).find(i => i && String(i.id || i.invoiceNo) === String(invId));
                const items = inv && Array.isArray(inv.items) ? inv.items : [];
                const tbl = inv ? (inv.customerName || inv.customer || inv.id || '') : String(invId || '');
                window.promptPasswordThenRun(
                    '🔐 បញ្ជាក់លេខកូដដើម្បីលុបវិក្កយបត្រ',
                    `វិក្កយបត្រ #${tbl} — បញ្ចូលលេខកូដដើម្បីលុប និងផ្ញើដំណឹងទៅផ្ទះបាយ៖`,
                    async () => {
                        await _origDelInv.call(window, invId);
                        window.notifyKitchenCancelledOrder(`លុបវិក្កយបត្រ #${tbl}`, items, tbl);
                    }
                );
            };
            window.deleteInvoice.__skmGuardHooked = true;
        }

        // 3. Enhance User Management Modal so Admin can set per-staff permissions & custom delete password
        if (typeof window.openUserModal === 'function' && !window.openUserModal.__skmPermHooked) {
            const _origOpenUser = window.openUserModal;
            window.openUserModal = function(userId) {
                _origOpenUser.apply(this, arguments);
                setTimeout(() => {
                    const body = document.querySelector('#userManageModal .modal-body');
                    if (!body) return;
                    let box = document.getElementById('skmStaffCustomPermBox');
                    if (!box) {
                        box = document.createElement('div');
                        box.id = 'skmStaffCustomPermBox';
                        box.style.cssText = 'margin-top:14px; padding:12px; border-radius:10px; border:1px dashed var(--primary); background:rgba(56,189,248,0.06); font-size:12.5px;';
                        box.innerHTML = `
                            <div style="font-weight:900; color:var(--primary); margin-bottom:8px;">🛡️ សិទ្ធិបន្ថែមតាមគណនីបុគ្គលិក (Admin កំណត់ដោយខ្លួនឯង)</div>
                            <label style="display:flex; align-items:center; gap:8px; margin-bottom:6px; cursor:pointer;">
                                <input type="checkbox" id="skmPermCanDelInv"> <span>អនុញ្ញាតឱ្យលុបវិក្កយបត្រ (ត្រូវមានលេខកូដ)</span>
                            </label>
                            <label style="display:flex; align-items:center; gap:8px; margin-bottom:10px; cursor:pointer;">
                                <input type="checkbox" id="skmPermCanCancelOrd"> <span>អនុញ្ញាតឱ្យបោះបង់កន្ត្រក/បញ្ជា (ត្រូវមានលេខកូដ)</span>
                            </label>
                            <div>
                                <label style="display:block; font-size:11.5px; font-weight:800; margin-bottom:4px;">🔑 លេខកូដពិសេសសម្រាប់លុប/បោះបង់ (ទទេ = ប្រើលេខកូដគណនី/ហាង):</label>
                                <input type="password" id="skmCustomDeletePw" class="form-control" placeholder="កំណត់លេខកូដលុប (បើចង់ដាក់ផ្សេង)..." style="width:100%;">
                            </div>`;
                        body.appendChild(box);
                    }
                    const editId = document.getElementById('editUserId')?.value || '';
                    const uName = (document.getElementById('nuUsername')?.value || '').trim().toLowerCase();
                    const k = String(editId || uName || '').toLowerCase();
                    const map = getStaffPermMap();
                    const curOv = (k && map[k]) ? map[k] : {};
                    document.getElementById('skmPermCanDelInv').checked = curOv.canDeleteInvoice !== false;
                    document.getElementById('skmPermCanCancelOrd').checked = curOv.canCancelOrder !== false;
                    document.getElementById('skmCustomDeletePw').value = window.sysSettings?.deleteActionPassword || '';
                }, 40);
            };
            window.openUserModal.__skmPermHooked = true;
        }

        if (typeof window.saveNewUser === 'function' && !window.saveNewUser.__skmPermHooked) {
            const _origSaveUser = window.saveNewUser;
            window.saveNewUser = async function() {
                const editId = (document.getElementById('editUserId')?.value || '').trim().toLowerCase();
                const uName = (document.getElementById('nuUsername')?.value || '').trim().toLowerCase();
                const canDel = document.getElementById('skmPermCanDelInv')?.checked !== false;
                const canCan = document.getElementById('skmPermCanCancelOrd')?.checked !== false;
                const customPw = (document.getElementById('skmCustomDeletePw')?.value || '').trim();

                const res = await _origSaveUser.apply(this, arguments);
                const key = editId || uName;
                if (key) {
                    const map = getStaffPermMap();
                    map[key] = { canDeleteInvoice: canDel, canCancelOrder: canCan };
                }
                if (!window.sysSettings) window.sysSettings = {};
                window.sysSettings.deleteActionPassword = customPw;
                await persistSysSettings();
                return res;
            };
            window.saveNewUser.__skmPermHooked = true;
        }
    }

    function bootAdvancedSuite() {
        window.syncAdvancedPosButtons();
        if (typeof window.syncProErpButtons === 'function' && !window.syncProErpButtons.__skmAdvHooked) {
            const origSync = window.syncProErpButtons;
            window.syncProErpButtons = function() {
                origSync.apply(this, arguments);
                window.syncAdvancedPosButtons();
            };
            window.syncProErpButtons.__skmAdvHooked = true;
        }
        if (typeof window.applyPermissions === 'function' && !window.applyPermissions.__skmAdvHooked) {
            const origP = window.applyPermissions;
            window.applyPermissions = function() {
                origP.apply(this, arguments);
                window.syncAdvancedPosButtons();
            };
            window.applyPermissions.__skmAdvHooked = true;
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(bootAdvancedSuite, 280));
    else setTimeout(bootAdvancedSuite, 280);
})();
