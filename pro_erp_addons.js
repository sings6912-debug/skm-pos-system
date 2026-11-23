/**
 * pro_erp_addons.js — Modular Enterprise Pro Features for SKM POS (index.html)
 * Strictly gated by Admin Settings (admin_settings.html -> Tab 9: sysSettings.proFeatures)
 * Modules:
 *  1. Customer Display Broadcaster (display.html)
 *  2. KDS & Queue Launcher (kds.html)
 *  3. Multi-Branch Master Launcher (master_branches.html)
 *  4. Suppliers & Purchase Orders (Stock-In + Payables)
 *  5. Stock Audit / Stock-Take (Barcode & Variance Calculation + CSV)
 *  6. Split Bill in POS (Split Equally + Split by Items Partial Checkout)
 *  7. Auto Telegram Z-Report Sender
 *  8. Product Tags Manager (🔥 លក់ដាច់ / 🆕 ថ្មី / 🌶️ ហឹរ / 🌱 បួស)
 *  9. Customer Payment Slip Viewer inside Invoice Modal
 */
(function() {
    if (window.__SKM_PRO_ERP_LOADED__) return;
    window.__SKM_PRO_ERP_LOADED__ = true;

    const getBranch = () => window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    const getPF = () => (window.sysSettings && window.sysSettings.proFeatures) ? window.sysSettings.proFeatures : {};
    const esc = (s) => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const toast = (msg, err = false) => {
        if (typeof window.showToast === 'function') window.showToast(msg, err);
        else if (typeof window.ksMsg === 'function') window.ksMsg(msg, err ? 'បរាជ័យ' : 'ជូនដំណឹង');
    };

    // =========================================================
    // 1. CUSTOMER DISPLAY BROADCASTER (0 Supabase Egress)
    // =========================================================
    let displayChannel = null;
    window.broadcastToCustomerDisplay = function(type, payload) {
        const pf = getPF();
        if (!pf.customerDisplay) return;
        const br = getBranch();
        const data = Object.assign({ type: type || 'cart_update', ts: Date.now() }, payload || {});
        try {
            localStorage.setItem(`skm_pos_display_state_${br}`, JSON.stringify(data));
            if (typeof BroadcastChannel !== 'undefined') {
                if (!displayChannel) displayChannel = new BroadcastChannel(`skm_pos_display_${br}`);
                displayChannel.postMessage(data);
            }
        } catch(e) {}
    };

    // =========================================================
    // 2. AUTO TELEGRAM Z-REPORT
    // =========================================================
    window.sendZReportToTelegram = async function(silent = false) {
        const pf = getPF();
        if (!pf.telegramZReport) {
            if (!silent) toast('⚠️ មុខងារ Telegram Z-Report ត្រូវបានបិទដោយ Admin Settings!', true);
            return;
        }
        const sys = window.sysSettings || {};
        const token = (sys.orderTelegramBotToken || sys.telegramBotToken || window.telegramBotToken || '').trim();
        const chatId = (sys.orderTelegramChatId || sys.telegramChatId || window.telegramChatId || '').trim();
        if (!token || !chatId) {
            if (!silent) toast('⚠️ សូមកំណត់ Telegram Bot Token និង Chat ID ជាមុនសិន!', true);
            return;
        }
        if (!navigator.onLine) {
            if (!silent) toast('⚠️ គ្មានអ៊ីនធឺណិត មិនអាចផ្ញើទៅ Telegram បានទេ!', true);
            return;
        }

        const dateFrom = document.getElementById('dashDateFrom');
        const dateTo = document.getElementById('dashDateTo');
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
        const fromTime = (dateFrom && dateFrom.value) ? new Date(dateFrom.value).getTime() : startOfDay;
        const toTime = (dateTo && dateTo.value) ? new Date(dateTo.value).getTime() : endOfDay;

        let rev = 0, unpaid = 0, exp = 0, disc = 0, count = 0;
        (window.invoices || []).forEach(inv => {
            if (!inv) return;
            const ts = inv.timestamp || new Date(inv.date || 0).getTime() || 0;
            if (ts >= fromTime && ts <= toTime) {
                count++;
                const tot = parseFloat(inv.totalAmount || inv.total || 0);
                const st = String(inv.status || 'unpaid').toLowerCase();
                if (st === 'paid') rev += tot;
                else {
                    const paid = parseFloat(inv.paidUsd || inv.paidAmount || 0);
                    rev += paid;
                    unpaid += Math.max(0, tot - paid);
                }
                disc += parseFloat(inv.discount || 0);
            }
        });
        (window.expenses || []).forEach(e => {
            if (!e) return;
            const ts = e.timestamp || new Date(e.date || 0).getTime() || 0;
            if (ts >= fromTime && ts <= toTime) exp += parseFloat(e.amount || 0);
        });
        const lowItems = (window.inventory || []).filter(p => p && (parseInt(p.qty) || 0) <= 5);
        const lowSummary = lowItems.slice(0, 6).map(p => `• ${esc(p.name)} (សល់ ${p.qty})`).join('\n');
        const net = rev - exp;
        const seller = window.activeUser ? (window.activeUser.fullName || window.activeUser.username) : 'Admin';
        const shop = window.shopName || 'SKM POS';

        const msg = `📊 <b>របាយការណ៍បិទថ្ងៃ (Z-Report)</b>\n🏪 ហាង: <b>${esc(shop)}</b> (${esc(getBranch())})\n👤 បុគ្គលិក: ${esc(seller)}\n🕒 ម៉ោងផ្ញើ: ${new Date().toLocaleString('km-KH')}\n━━━━━━━━━━━━━━━\n🧾 វិក្កយបត្រសរុប: <b>${count}</b>\n💰 ចំណូលទទួលបាន: <b>$${rev.toFixed(2)}</b>\n🏷️ បញ្ចុះតម្លៃសរុប: $${disc.toFixed(2)}\n⏳ រង់ចាំទូទាត់ (Pending): <b>$${unpaid.toFixed(2)}</b>\n📉 ចំណាយសរុប: <b>-$${exp.toFixed(2)}</b>\n━━━━━━━━━━━━━━━\n✅ <b>សាច់ប្រាក់សុទ្ធ (Net): $${net.toFixed(2)}</b>` +
            (lowItems.length ? `\n\n⚠️ <b>ទំនិញជិតអស់ស្តុក (${lowItems.length} មុខ):</b>\n${lowSummary}` : '');

        try {
            const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' })
            });
            const j = await res.json();
            if (j.ok) toast('🤖 បានផ្ញើរបាយការណ៍ Z-Report ទៅ Telegram ម្ចាស់ហាងជោគជ័យ!');
            else if (!silent) toast('❌ Telegram Error: ' + (j.description || 'Failed'), true);
        } catch(e) {
            if (!silent) toast('❌ បរាជ័យផ្ញើទៅ Telegram: ' + e.message, true);
        }
    };

    // =========================================================
    // 3. SUPPLIERS & PURCHASE ORDERS MODAL
    // =========================================================
    function getSuppliersData() {
        if (!window.sysSettings) window.sysSettings = {};
        if (!window.sysSettings.suppliersData) {
            window.sysSettings.suppliersData = { suppliers: [], orders: [] };
        }
        return window.sysSettings.suppliersData;
    }

    async function saveSuppliersData() {
        localStorage.setItem(window.getBranchKey('sys_settings'), JSON.stringify(window.sysSettings));
        if (typeof window.saveData === 'function') await window.saveData(window.userAccounts);
    }

    window.openSuppliersModal = function() {
        let modal = document.getElementById('skmSuppliersModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmSuppliersModal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = '10020';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            modal.innerHTML = `
                <div class="modal" style="max-width: 820px; width: 96%;">
                    <div class="modal-header">
                        <h2 style="font-size:18px;">🚚 គ្រប់គ្រងអ្នកផ្គត់ផ្គង់ & ការនាំចូលស្តុក (Suppliers & PO)</h2>
                        <button class="btn-outline" style="border:none; font-size:20px; padding:0;" onclick="document.getElementById('skmSuppliersModal').style.display='none'">✕</button>
                    </div>
                    <div class="modal-body" style="max-height:76vh; overflow-y:auto;">
                        <div style="display:flex; gap:8px; margin-bottom:16px;">
                            <button type="button" id="supTabBtn1" class="btn btn-primary" onclick="window.switchSupplierTab(1)">👥 បញ្ជីអ្នកផ្គត់ផ្គង់</button>
                            <button type="button" id="supTabBtn2" class="btn btn-outline" onclick="window.switchSupplierTab(2)">📦 បង្កើតវិក្កយបត្រនាំចូល (PO)</button>
                        </div>
                        <div id="supTabPane1">
                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:8px; margin-bottom:12px;">
                                <input id="supNameInp" class="form-control" placeholder="ឈ្មោះអ្នកផ្គត់ផ្គង់ / ក្រុមហ៊ុន *">
                                <input id="supPhoneInp" class="form-control" placeholder="លេខទូរស័ព្ទ">
                                <input id="supNoteInp" class="form-control" placeholder="ទំនិញផ្គត់ផ្គង់ / ចំណាំ">
                                <button type="button" class="btn btn-success" onclick="window.addNewSupplier()">➕ បន្ថែមអ្នកផ្គត់ផ្គង់</button>
                            </div>
                            <div class="table-responsive">
                                <table style="font-size:13px;">
                                    <thead><tr><th>ឈ្មោះអ្នកផ្គត់ផ្គង់</th><th>ទូរស័ព្ទ</th><th>ជំពាក់នៅសល់ ($)</th><th>ចំណាំ</th><th>សកម្មភាព</th></tr></thead>
                                    <tbody id="supListBody"></tbody>
                                </table>
                            </div>
                        </div>
                        <div id="supTabPane2" style="display:none;">
                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:10px; background:rgba(0,0,0,0.06); padding:14px; border-radius:12px; margin-bottom:16px;">
                                <div><label style="font-size:12px;">អ្នកផ្គត់ផ្គង់:</label><select id="poSupplierSel" class="form-control" style="width:100%;"></select></div>
                                <div><label style="font-size:12px;">ទំនិញនាំចូល:</label><select id="poProductSel" class="form-control" style="width:100%;"></select></div>
                                <div><label style="font-size:12px;">ចំនួននាំចូល (Qty):</label><input type="number" id="poQtyInp" class="form-control" value="10" min="1" style="width:100%;"></div>
                                <div><label style="font-size:12px;">ថ្លៃដើម/ឯកតា ($):</label><input type="number" id="poCostInp" class="form-control" step="0.01" placeholder="0.00" style="width:100%;"></div>
                                <div><label style="font-size:12px;">បានបង់ប្រាក់ ($):</label><input type="number" id="poPaidInp" class="form-control" step="0.01" placeholder="បង់ពេញ = ទុកទទេ" style="width:100%;"></div>
                                <div style="display:flex; align-items:end;"><button type="button" class="btn btn-success" style="width:100%;" onclick="window.submitPurchaseOrder()">✅ នាំចូលស្តុក</button></div>
                            </div>
                            <h4 style="font-size:14px; margin-bottom:8px;">📜 ប្រវត្តិនាំចូលស្តុកចុងក្រោយ (PO History)</h4>
                            <div class="table-responsive">
                                <table style="font-size:12.5px;">
                                    <thead><tr><th>ថ្ងៃទី</th><th>អ្នកផ្គត់ផ្គង់</th><th>ទំនិញ</th><th>ចំនួន</th><th>សរុប ($)</th><th>បានបង់ ($)</th></tr></thead>
                                    <tbody id="poHistoryBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }
        window.renderSuppliersUI();
        modal.style.display = 'flex';
    };

    window.switchSupplierTab = function(n) {
        document.getElementById('supTabPane1').style.display = n === 1 ? 'block' : 'none';
        document.getElementById('supTabPane2').style.display = n === 2 ? 'block' : 'none';
        document.getElementById('supTabBtn1').className = n === 1 ? 'btn btn-primary' : 'btn btn-outline';
        document.getElementById('supTabBtn2').className = n === 2 ? 'btn btn-primary' : 'btn btn-outline';
        if (n === 2) window.renderSuppliersUI();
    };

    window.renderSuppliersUI = function() {
        const data = getSuppliersData();
        const tbody = document.getElementById('supListBody');
        if (tbody) {
            tbody.innerHTML = data.suppliers.length === 0
                ? '<tr><td colspan="5" style="text-align:center; padding:18px; color:var(--text-muted);">មិនទាន់មានអ្នកផ្គត់ផ្គង់ទេ</td></tr>'
                : data.suppliers.map((s, idx) => `
                    <tr>
                        <td><b>${esc(s.name)}</b></td>
                        <td>${esc(s.phone || '-')}</td>
                        <td style="font-weight:900; color:${(s.debt||0) > 0 ? 'var(--danger)' : 'var(--success)'};">$${Number(s.debt || 0).toFixed(2)}</td>
                        <td>${esc(s.note || '-')}</td>
                        <td style="display:flex; gap:5px;">
                            ${(s.debt||0) > 0 ? `<button class="btn btn-success" style="padding:4px 8px; font-size:11px;" onclick="window.paySupplierDebt(${idx})">💸 សងប្រាក់</button>` : ''}
                            <button class="btn btn-danger" style="padding:4px 8px; font-size:11px;" onclick="window.deleteSupplier(${idx})">🗑️</button>
                        </td>
                    </tr>`).join('');
        }
        const supSel = document.getElementById('poSupplierSel');
        if (supSel) {
            supSel.innerHTML = data.suppliers.map(s => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('') || '<option value="">-- សូមបន្ថែមអ្នកផ្គត់ផ្គង់សិន --</option>';
        }
        const prodSel = document.getElementById('poProductSel');
        if (prodSel) {
            prodSel.innerHTML = (window.inventory || []).filter(Boolean).map(p => `<option value="${esc(p.id)}" data-cost="${p.cost||0}">${esc(p.name)} (សល់: ${p.qty})</option>`).join('');
        }
        const poBody = document.getElementById('poHistoryBody');
        if (poBody) {
            poBody.innerHTML = (data.orders || []).slice(0, 30).map(o => `
                <tr>
                    <td>${esc(o.date)}</td>
                    <td><b>${esc(o.supplierName)}</b></td>
                    <td>${esc(o.productName)}</td>
                    <td>+${o.qty}</td>
                    <td>$${Number(o.total).toFixed(2)}</td>
                    <td style="color:var(--success);">$${Number(o.paid).toFixed(2)}</td>
                </tr>`).join('') || '<tr><td colspan="6" style="text-align:center; padding:14px; color:var(--text-muted);">មិនទាន់មានប្រវត្តិនាំចូលទេ</td></tr>';
        }
    };

    window.addNewSupplier = async function() {
        const name = document.getElementById('supNameInp').value.trim();
        if (!name) return toast('សូមបញ្ចូលឈ្មោះអ្នកផ្គត់ផ្គង់!', true);
        const data = getSuppliersData();
        data.suppliers.unshift({
            id: 'SUP_' + Date.now(),
            name,
            phone: document.getElementById('supPhoneInp').value.trim(),
            note: document.getElementById('supNoteInp').value.trim(),
            debt: 0
        });
        document.getElementById('supNameInp').value = '';
        document.getElementById('supPhoneInp').value = '';
        document.getElementById('supNoteInp').value = '';
        window.renderSuppliersUI();
        await saveSuppliersData();
        toast('✅ បានបន្ថែមអ្នកផ្គត់ផ្គង់ជោគជ័យ!');
    };

    window.paySupplierDebt = async function(idx) {
        const data = getSuppliersData();
        const s = data.suppliers[idx];
        if (!s) return;
        const amtStr = prompt(`បញ្ចូលចំនួនប្រាក់ ($) ដែលត្រូវសងឱ្យ "${s.name}" (ជំពាក់បច្ចុប្បន្ន $${Number(s.debt).toFixed(2)}):`, Number(s.debt).toFixed(2));
        if (amtStr === null) return;
        const amt = parseFloat(amtStr) || 0;
        if (amt <= 0) return;
        s.debt = Math.max(0, Number(s.debt || 0) - amt);
        window.renderSuppliersUI();
        await saveSuppliersData();
        toast(`✅ បានកត់ត្រាសងប្រាក់ $${amt.toFixed(2)} ជោគជ័យ!`);
    };

    window.deleteSupplier = async function(idx) {
        const data = getSuppliersData();
        data.suppliers.splice(idx, 1);
        window.renderSuppliersUI();
        await saveSuppliersData();
        toast('🗑️ បានលុបអ្នកផ្គត់ផ្គង់!');
    };

    window.submitPurchaseOrder = async function() {
        const data = getSuppliersData();
        const supId = document.getElementById('poSupplierSel').value;
        const prodId = document.getElementById('poProductSel').value;
        const qty = parseInt(document.getElementById('poQtyInp').value) || 0;
        const cost = parseFloat(document.getElementById('poCostInp').value) || 0;
        const paidRaw = document.getElementById('poPaidInp').value;

        if (!supId || !prodId || qty <= 0) return toast('⚠️ សូមជ្រើសរើសអ្នកផ្គត់ផ្គង់ ទំនិញ និងចំនួននាំចូល!', true);
        const sup = data.suppliers.find(s => s.id === supId);
        const prod = (window.inventory || []).find(p => p && String(p.id) === String(prodId));
        if (!sup || !prod) return toast('❌ រកមិនឃើញទិន្នន័យ!', true);

        const total = qty * cost;
        const paid = paidRaw === '' ? total : Math.max(0, parseFloat(paidRaw) || 0);
        const addedDebt = Math.max(0, total - paid);

        prod.qty = (parseInt(prod.qty) || 0) + qty;
        if (cost > 0) prod.cost = cost;
        sup.debt = Number(sup.debt || 0) + addedDebt;

        data.orders.unshift({
            id: 'PO-' + Date.now(),
            date: new Date().toLocaleDateString('km-KH'),
            supplierId: sup.id,
            supplierName: sup.name,
            productId: prod.id,
            productName: prod.name,
            qty, cost, total, paid
        });

        localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
        if (window.supabaseClient && navigator.onLine) {
            try {
                await window.supabaseClient.from('pos_products')
                    .update({ qty: prod.qty, cost: prod.cost, updated_at: new Date().toISOString() })
                    .eq('id', String(prod.id)).eq('branch_id', getBranch());
            } catch(e) {}
        }
        if (typeof window.logAction === 'function') {
            window.logAction('add', prod.name, qty, `នាំចូលពីអ្នកផ្គត់ផ្គង់ ${sup.name} ($${total.toFixed(2)})`, window.activeUser);
        }
        await saveSuppliersData();
        window.renderSuppliersUI();
        if (typeof window.renderInventory === 'function') window.renderInventory();
        if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
        toast(`✅ នាំចូល "${prod.name}" +${qty} ជោគជ័យ!`);
    };

    // =========================================================
    // 4. STOCK AUDIT / STOCK-TAKE MODAL
    // =========================================================
    let auditCounts = {};
    window.openStockAuditModal = function() {
        auditCounts = {};
        let modal = document.getElementById('skmStockAuditModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmStockAuditModal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = '10021';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            modal.innerHTML = `
                <div class="modal" style="max-width: 860px; width: 96%;">
                    <div class="modal-header">
                        <h2 style="font-size:18px;">📋 រាប់ស្តុកផ្ទៀងផ្ទាត់ (Stock Audit / Stock-Take)</h2>
                        <button class="btn-outline" style="border:none; font-size:20px; padding:0;" onclick="document.getElementById('skmStockAuditModal').style.display='none'">✕</button>
                    </div>
                    <div class="modal-body" style="max-height:72vh; overflow-y:auto;">
                        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:14px;">
                            <input type="text" id="auditScanInp" class="form-control" style="flex:1; min-width:220px;" placeholder="🔍 ស្កេនបាកូដ (Enter ដើម្បីបូក +1) ឬ ស្វែងរកឈ្មោះទំនិញ..." oninput="window.renderAuditTable()" onkeydown="window.handleAuditScan(event)">
                            <button type="button" class="btn btn-outline" onclick="window.exportAuditCSV()">📤 Export របាយការណ៍ CSV</button>
                        </div>
                        <div id="auditSummaryBar" style="display:flex; gap:14px; flex-wrap:wrap; padding:10px 14px; background:rgba(0,0,0,0.06); border-radius:10px; margin-bottom:12px; font-size:13px; font-weight:800;"></div>
                        <div class="table-responsive">
                            <table style="font-size:13px;">
                                <thead><tr><th>ទំនិញ / Barcode</th><th style="text-align:center;">ស្តុកក្នុងប្រព័ន្ធ</th><th style="text-align:center;">រាប់ជាក់ស្តែង</th><th style="text-align:center;">លើស / ខ្វះ</th><th style="text-align:right;">តម្លៃខុសគ្នា ($)</th></tr></thead>
                                <tbody id="auditTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer" style="justify-content:space-between;">
                        <button class="btn btn-outline" onclick="document.getElementById('skmStockAuditModal').style.display='none'">បិទ</button>
                        <button class="btn btn-success" onclick="window.applyStockAuditAdjustments()">💾 កែស្តុកតាមការរាប់ជាក់ស្តែង (Apply)</button>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }
        window.renderAuditTable();
        modal.style.display = 'flex';
        setTimeout(() => document.getElementById('auditScanInp')?.focus(), 80);
    };

    window.handleAuditScan = function(e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const q = (e.target.value || '').trim().toLowerCase();
        if (!q) return;
        const found = (window.inventory || []).find(p => p && (String(p.customId||'').toLowerCase() === q || String(p.id||'').toLowerCase() === q));
        if (found) {
            auditCounts[found.id] = (auditCounts[found.id] !== undefined ? auditCounts[found.id] : 0) + 1;
            e.target.value = '';
            if (typeof window.playBeep === 'function') window.playBeep();
            window.renderAuditTable();
            toast(`✅ រាប់ "${found.name}": ${auditCounts[found.id]}`);
        }
    };

    window.setAuditCount = function(pid, val) {
        if (val === '' || val === null) delete auditCounts[pid];
        else auditCounts[pid] = Math.max(0, parseInt(val) || 0);
        window.renderAuditTable();
    };

    window.renderAuditTable = function() {
        const q = (document.getElementById('auditScanInp')?.value || '').toLowerCase().trim();
        const list = (window.inventory || []).filter(p => p && (!q || String(p.name).toLowerCase().includes(q) || String(p.customId||'').toLowerCase().includes(q)));
        let totalMissing = 0, totalSurplus = 0, totalDiffUsd = 0, countedItems = 0;

        const tbody = document.getElementById('auditTableBody');
        if (!tbody) return;
        tbody.innerHTML = list.map(p => {
            const sysQty = parseInt(p.qty) || 0;
            const hasVal = auditCounts[p.id] !== undefined;
            const actQty = hasVal ? auditCounts[p.id] : '';
            const diff = hasVal ? (auditCounts[p.id] - sysQty) : 0;
            const cost = parseFloat(p.cost || p.price || 0);
            const diffUsd = diff * cost;
            if (hasVal) {
                countedItems++;
                if (diff < 0) totalMissing += Math.abs(diff);
                if (diff > 0) totalSurplus += diff;
                totalDiffUsd += diffUsd;
            }
            const badge = !hasVal ? '<span style="color:var(--text-muted);">-</span>'
                : (diff === 0 ? '<span style="color:var(--success); font-weight:800;">✓ ត្រូវគ្នា</span>'
                : (diff > 0 ? `<span style="color:#38bdf8; font-weight:900;">+${diff} (លើស)</span>` : `<span style="color:var(--danger); font-weight:900;">${diff} (ខ្វះ)</span>`));

            return `<tr>
                <td><b>${esc(p.name)}</b><br><small style="color:var(--text-muted);">${esc(p.customId || p.id)}</small></td>
                <td style="text-align:center; font-weight:800;">${sysQty}</td>
                <td style="text-align:center;"><input type="number" min="0" value="${actQty}" placeholder="${sysQty}" class="form-control" style="width:82px; text-align:center; margin:auto; height:34px;" onchange="window.setAuditCount('${esc(p.id)}', this.value)"></td>
                <td style="text-align:center;">${badge}</td>
                <td style="text-align:right; font-weight:800; color:${diffUsd < 0 ? 'var(--danger)' : (diffUsd > 0 ? '#38bdf8' : 'var(--text-muted)')};">${hasVal ? (diffUsd >= 0 ? '+' : '') + '$' + diffUsd.toFixed(2) : '-'}</td>
            </tr>`;
        }).join('');

        const bar = document.getElementById('auditSummaryBar');
        if (bar) {
            bar.innerHTML = `
                <span>📦 បានរាប់: ${countedItems} មុខ</span>
                <span style="color:var(--danger);">❌ ខ្វះសរុប: -${totalMissing}</span>
                <span style="color:#38bdf8;">➕ លើសសរុប: +${totalSurplus}</span>
                <span style="color:${totalDiffUsd < 0 ? 'var(--danger)' : 'var(--success)'};">💰 តម្លៃខុសគ្នា: ${totalDiffUsd >= 0 ? '+' : ''}$${totalDiffUsd.toFixed(2)}</span>`;
        }
    };

    window.applyStockAuditAdjustments = async function() {
        const keys = Object.keys(auditCounts);
        if (keys.length === 0) return toast('⚠️ មិនទាន់មានទំនិញណាដែលបានបញ្ចូលលេខរាប់ទេ!', true);
        let changed = 0;
        const br = getBranch();
        for (const pid of keys) {
            const p = (window.inventory || []).find(i => i && String(i.id) === String(pid));
            if (!p) continue;
            const oldQ = parseInt(p.qty) || 0;
            const newQ = parseInt(auditCounts[pid]) || 0;
            if (oldQ !== newQ) {
                p.qty = newQ;
                changed++;
                if (typeof window.logAction === 'function') {
                    window.logAction('update', p.name, newQ - oldQ, `រាប់ស្តុក Audit (${oldQ} ➔ ${newQ})`, window.activeUser);
                }
                if (window.supabaseClient && navigator.onLine) {
                    try {
                        await window.supabaseClient.from('pos_products')
                            .update({ qty: newQ, updated_at: new Date().toISOString() })
                            .eq('id', String(p.id)).eq('branch_id', br);
                    } catch(e) {}
                }
            }
        }
        localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
        if (typeof window.touchCloudSync === 'function') await window.touchCloudSync();
        if (typeof window.renderInventory === 'function') window.renderInventory();
        if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
        document.getElementById('skmStockAuditModal').style.display = 'none';
        toast(`✅ បានកែស្តុកតាមការរាប់ជាក់ស្តែងចំនួន ${changed} មុខជោគជ័យ!`);
    };

    window.exportAuditCSV = function() {
        let csv = '\uFEFF"លេខកូដ","ឈ្មោះទំនិញ","ស្តុកប្រព័ន្ធ","រាប់ជាក់ស្តែង","ខុសគ្នា","តម្លៃខុសគ្នា($)"\n';
        (window.inventory || []).forEach(p => {
            if (!p || auditCounts[p.id] === undefined) return;
            const sysQ = parseInt(p.qty) || 0;
            const actQ = auditCounts[p.id];
            const diff = actQ - sysQ;
            const diffUsd = diff * parseFloat(p.cost || p.price || 0);
            csv += `"${p.customId||p.id}","${String(p.name).replace(/"/g,'""')}",${sysQ},${actQ},${diff},${diffUsd.toFixed(2)}\n`;
        });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
        a.download = `StockAudit_${getBranch()}_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
    };

    // =========================================================
    // 5. SPLIT BILL MODAL IN POS (Equally OR By Items Partial Checkout)
    // =========================================================
    window.openPosSplitBillModal = function() {
        if (!window.cart || window.cart.length === 0) return toast('⚠️ កន្ត្រកទទេ! សូមដាក់ទំនិញជាមុនសិន។', true);
        let modal = document.getElementById('skmPosSplitBillModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmPosSplitBillModal';
            modal.className = 'modal-overlay';
            modal.style.zIndex = '10022';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            modal.innerHTML = `
                <div class="modal" style="max-width: 560px; width: 95%;">
                    <div class="modal-header">
                        <h2 style="font-size:18px;">🧾 បំបែកវិក្កយបត្រ (Split Bill)</h2>
                        <button class="btn-outline" style="border:none; font-size:20px; padding:0;" onclick="document.getElementById('skmPosSplitBillModal').style.display='none'">✕</button>
                    </div>
                    <div class="modal-body">
                        <div style="display:flex; gap:8px; margin-bottom:14px;">
                            <button type="button" id="sbModeEqBtn" class="btn btn-primary" style="flex:1;" onclick="window.switchSplitBillMode('eq')">👥 ចែកស្មើតាមមនុស្ស</button>
                            <button type="button" id="sbModeItemBtn" class="btn btn-outline" style="flex:1;" onclick="window.switchSplitBillMode('item')">🛍️ បំបែកតាមមុខទំនិញ</button>
                        </div>
                        <div id="sbPaneEq">
                            <label style="font-size:13px; display:block; margin-bottom:6px;">ចំនួនមនុស្សចែកលុយគ្នា (People):</label>
                            <input type="number" id="sbPeopleInp" class="form-control" min="2" max="50" value="2" style="width:100%; font-size:18px; text-align:center; font-weight:900;" oninput="window.calcPosSplitEq()">
                            <div id="sbEqResult" style="margin-top:16px; padding:18px; border-radius:14px; background:rgba(16,185,129,0.1); border:1px dashed var(--success); text-align:center;"></div>
                        </div>
                        <div id="sbPaneItem" style="display:none;">
                            <p style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">ជ្រើសរើសមុខទំនិញដែលភ្ញៀវម្នាក់ចង់គិតលុយដាច់ដោយឡែកមុន (ទំនិញនៅសល់នឹងបន្តនៅក្នុងកន្ត្រក)៖</p>
                            <div id="sbItemList" style="max-height:240px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;"></div>
                            <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center; font-weight:900; font-size:16px; border-top:1px dashed var(--border); padding-top:12px;">
                                <span>សរុបវិក្កយបត្របំបែកនេះ៖</span>
                                <span id="sbItemTotal" style="color:var(--success);">$0.00</span>
                            </div>
                            <button type="button" class="btn btn-success" style="width:100%; margin-top:12px; padding:12px;" onclick="window.checkoutSplitItemsNow()">💰 គិតលុយមុខទំនិញដែលបានរើសនេះ</button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }
        window.switchSplitBillMode('eq');
        window.calcPosSplitEq();
        window.renderPosSplitItems();
        modal.style.display = 'flex';
    };

    window.switchSplitBillMode = function(m) {
        document.getElementById('sbPaneEq').style.display = m === 'eq' ? 'block' : 'none';
        document.getElementById('sbPaneItem').style.display = m === 'item' ? 'block' : 'none';
        document.getElementById('sbModeEqBtn').className = m === 'eq' ? 'btn btn-primary' : 'btn btn-outline';
        document.getElementById('sbModeItemBtn').className = m === 'item' ? 'btn btn-primary' : 'btn btn-outline';
    };

    window.calcPosSplitEq = function() {
        const n = Math.max(2, parseInt(document.getElementById('sbPeopleInp')?.value) || 2);
        const tot = Number(window.cartFinalUsd || 0);
        const rate = Number(window.cartRate || 4000);
        const perUsd = tot / n;
        const perKhr = Math.round(perUsd * rate);
        const box = document.getElementById('sbEqResult');
        if (box) {
            box.innerHTML = `<div style="font-size:13px; color:var(--text-muted);">សរុប $${tot.toFixed(2)} ÷ ${n} នាក់</div>
                <div style="font-size:32px; font-weight:900; color:var(--success); margin-top:4px;">$${perUsd.toFixed(2)} / ម្នាក់</div>
                <div style="font-size:18px; font-weight:800; color:var(--warning);">${perKhr.toLocaleString()} ៛ / ម្នាក់</div>`;
        }
    };

    window.renderPosSplitItems = function() {
        const box = document.getElementById('sbItemList');
        if (!box) return;
        box.innerHTML = (window.cart || []).map((c, idx) => `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px 12px; background:rgba(0,0,0,0.06); border-radius:10px;">
                <label style="display:flex; align-items:center; gap:8px; flex:1; cursor:pointer; font-size:13.5px; font-weight:700;">
                    <input type="checkbox" class="sb-item-chk" data-idx="${idx}" onchange="window.calcPosSplitItems()" style="width:18px; height:18px;">
                    <span>${esc(c.name)} ($${Number(c.price||0).toFixed(2)})</span>
                </label>
                <input type="number" class="form-control sb-item-qty" data-idx="${idx}" min="1" max="${c.cartQty}" value="${c.cartQty}" style="width:66px; height:32px; text-align:center;" oninput="window.calcPosSplitItems()">
            </div>`).join('');
        window.calcPosSplitItems();
    };

    window.calcPosSplitItems = function() {
        let sum = 0;
        document.querySelectorAll('.sb-item-chk:checked').forEach(chk => {
            const idx = parseInt(chk.getAttribute('data-idx'));
            const item = window.cart[idx];
            const qInp = document.querySelector(`.sb-item-qty[data-idx="${idx}"]`);
            const q = Math.min(item.cartQty, Math.max(1, parseInt(qInp?.value) || 1));
            sum += Number(item.price || 0) * q;
        });
        const el = document.getElementById('sbItemTotal');
        if (el) el.innerText = `$${sum.toFixed(2)} (${Math.round(sum * (window.cartRate || 4000)).toLocaleString()} ៛)`;
    };

    window.checkoutSplitItemsNow = function() {
        const selected = [];
        const remaining = [];
        const checkedMap = {};
        document.querySelectorAll('.sb-item-chk:checked').forEach(chk => {
            const idx = parseInt(chk.getAttribute('data-idx'));
            const qInp = document.querySelector(`.sb-item-qty[data-idx="${idx}"]`);
            checkedMap[idx] = Math.max(1, parseInt(qInp?.value) || 1);
        });
        if (Object.keys(checkedMap).length === 0) return toast('⚠️ សូមធីកជ្រើសរើសទំនិញយ៉ាងហោចណាស់ ១ មុខ!', true);

        (window.cart || []).forEach((item, idx) => {
            if (checkedMap[idx]) {
                const take = Math.min(item.cartQty, checkedMap[idx]);
                selected.push({ ...item, cartQty: take, qty: take });
                const left = item.cartQty - take;
                if (left > 0) remaining.push({ ...item, cartQty: left, qty: left });
            } else {
                remaining.push(item);
            }
        });

        // Swap cart to selected items, run standard checkout('paid'), then restore remaining items!
        window.cart = selected;
        window.renderCart();
        document.getElementById('skmPosSplitBillModal').style.display = 'none';
        if (typeof window.checkout === 'function') {
            window.checkout('paid', window.cartFinalUsd, 0, 0, 0);
        }
        setTimeout(() => {
            window.cart = remaining;
            window.renderCart();
            window.renderPOSProducts();
            if (remaining.length > 0) toast(`✅ គិតលុយផ្នែកបំបែករួចរាល់! នៅសល់ ${remaining.length} មុខក្នុងកន្ត្រក។`);
        }, 250);
    };

    // =========================================================
    // 6. PRODUCT TAGS EDITOR IN #productModal
    // =========================================================
    const TAG_OPTIONS = [
        { id: 'best', label: '🔥 លក់ដាច់ (Best Seller)' },
        { id: 'new',  label: '🆕 ថ្មី (New)' },
        { id: 'spicy', label: '🌶️ ហឹរ (Spicy)' },
        { id: 'veg',  label: '🌱 បួស (Vegetarian)' }
    ];

    function syncProductTagsUIInModal() {
        const pf = getPF();
        const existing = document.getElementById('skmProductTagsRow');
        if (!pf.productTags) {
            if (existing) existing.style.display = 'none';
            return;
        }
        if (existing) { existing.style.display = 'block'; return; }
        const descEl = document.getElementById('pDesc');
        if (!descEl || !descEl.parentElement) return;
        const wrap = document.createElement('div');
        wrap.id = 'skmProductTagsRow';
        wrap.style.cssText = 'margin-top:12px; padding:10px 12px; border-radius:10px; background:rgba(56,189,248,0.06); border:1px dashed var(--border);';
        wrap.innerHTML = `<label style="display:block; font-size:13px; font-weight:800; margin-bottom:8px;">🏷️ ស្លាកលក្ខណៈទំនិញ (Product Tags សម្រាប់បង្ហាញលើ Menu):</label>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
                ${TAG_OPTIONS.map(t => `<label style="display:inline-flex; align-items:center; gap:5px; font-size:12px; cursor:pointer; background:var(--bg-card); padding:5px 10px; border-radius:999px; border:1px solid var(--border);"><input type="checkbox" class="skm-prod-tag-chk" value="${t.id}"> ${t.label}</label>`).join('')}
            </div>`;
        descEl.parentElement.after(wrap);
    }

    function hookProductModalForTags() {
        if (typeof window.openProductModal === 'function' && !window.openProductModal.__skmTagHooked) {
            const origOpen = window.openProductModal;
            window.openProductModal = function() {
                origOpen.apply(this, arguments);
                syncProductTagsUIInModal();
                document.querySelectorAll('.skm-prod-tag-chk').forEach(c => c.checked = false);
            };
            window.openProductModal.__skmTagHooked = true;
        }
        if (typeof window.editProduct === 'function' && !window.editProduct.__skmTagHooked) {
            const origEdit = window.editProduct;
            window.editProduct = function(id) {
                origEdit.apply(this, arguments);
                syncProductTagsUIInModal();
                const map = (window.sysSettings && window.sysSettings.productTagsMap) || {};
                const tags = Array.isArray(map[id]) ? map[id] : [];
                document.querySelectorAll('.skm-prod-tag-chk').forEach(c => c.checked = tags.includes(c.value));
            };
            window.editProduct.__skmTagHooked = true;
        }
        if (typeof window.saveProduct === 'function' && !window.saveProduct.__skmTagHooked) {
            const origSave = window.saveProduct;
            window.saveProduct = async function() {
                const pf = getPF();
                const selectedTags = pf.productTags
                    ? Array.from(document.querySelectorAll('.skm-prod-tag-chk:checked')).map(c => c.value)
                    : null;
                const prevLen = (window.inventory || []).length;
                const editingId = document.getElementById('pId')?.value || '';
                const res = await origSave.apply(this, arguments);
                if (selectedTags !== null) {
                    const targetProd = editingId
                        ? (window.inventory || []).find(p => p && p.id === editingId)
                        : ((window.inventory || []).length > prevLen ? window.inventory[window.inventory.length - 1] : null);
                    if (targetProd) {
                        if (!window.sysSettings) window.sysSettings = {};
                        if (!window.sysSettings.productTagsMap) window.sysSettings.productTagsMap = {};
                        if (selectedTags.length > 0) window.sysSettings.productTagsMap[targetProd.id] = selectedTags;
                        else delete window.sysSettings.productTagsMap[targetProd.id];
                        localStorage.setItem(window.getBranchKey('sys_settings'), JSON.stringify(window.sysSettings));
                        if (typeof window.saveData === 'function') window.saveData(window.userAccounts);
                    }
                }
                return res;
            };
            window.saveProduct.__skmTagHooked = true;
        }
    }

    // =========================================================
    // 7. PAYMENT SLIP & GPS LINK VIEWER IN INVOICE MODAL
    // =========================================================
    function hookInvoiceModalForSlips() {
        if (typeof window.viewInvoiceDetails === 'function' && !window.viewInvoiceDetails.__skmSlipHooked) {
            const origView = window.viewInvoiceDetails;
            window.viewInvoiceDetails = function(invId) {
                origView.apply(this, arguments);
                const invoices = window.invoices || [];
                const targetId = String(invId).trim().toLowerCase();
                const inv = invoices.find((i, idx) => String(i?.id || i?.invoiceNo || `ORD-${idx}`).trim().toLowerCase() === targetId);
                const box = document.getElementById('invoiceViewContent');
                if (!inv || !box) return;
                const note = String(inv.note || '');
                const slipMatch = note.match(/\[SLIP_URL:([^\]]+)\]/);
                const slipSrc = inv.paymentSlip || (slipMatch ? slipMatch[1] : '');
                if (slipSrc) {
                    const wrap = document.createElement('div');
                    wrap.style.cssText = 'margin-top:10px; padding:10px; background:#f0fdf4; border:1px dashed #10b981; border-radius:10px; text-align:center;';
                    wrap.innerHTML = `<div style="font-size:12px; font-weight:800; color:#059669; margin-bottom:6px;">📸 រូបវិក្កយបត្របង់ប្រាក់ពីភ្ញៀវ (Payment Slip)</div>
                        <img src="${esc(slipSrc)}" style="max-height:160px; max-width:100%; border-radius:8px; cursor:zoom-in; border:1px solid #cbd5e1;" onclick="if(typeof window.openImageZoom==='function') window.openImageZoom(this.src)">`;
                    box.appendChild(wrap);
                }
                const gpsMatch = note.match(/(https:\/\/maps\.google\.com\/\?q=[^\s\]]+)/);
                if (gpsMatch) {
                    const gpsDiv = document.createElement('div');
                    gpsDiv.style.cssText = 'margin-top:8px; text-align:left;';
                    gpsDiv.innerHTML = `<a href="${esc(gpsMatch[1])}" target="_blank" style="display:inline-flex; align-items:center; gap:5px; padding:6px 12px; background:#0284c7; color:#fff; border-radius:8px; font-size:12px; font-weight:800; text-decoration:none;">📍 បើកមើលទីតាំងដឹកជញ្ជូនលើ Google Maps ↗</a>`;
                    box.appendChild(gpsDiv);
                }
            };
            window.viewInvoiceDetails.__skmSlipHooked = true;
        }
    }

    // =========================================================
    // 8. HOOK printZReport FOR AUTO TELEGRAM Z-REPORT
    // =========================================================
    function hookZReport() {
        if (typeof window.printZReport === 'function' && !window.printZReport.__skmTgHooked) {
            const origZ = window.printZReport;
            window.printZReport = function() {
                origZ.apply(this, arguments);
                const pf = getPF();
                if (pf.telegramZReport) window.sendZReportToTelegram(true);
            };
            window.printZReport.__skmTgHooked = true;
        }
    }

    // =========================================================
    // 9. DYNAMICALLY MOUNT ENABLED PRO BUTTONS (ZERO BLOAT WHEN OFF)
    // =========================================================
    window.syncProErpButtons = function() {
        const pf = getPF();
        const br = encodeURIComponent(getBranch());

        // A. Dashboard Toolbar Pro Buttons (Multi-Branch, Telegram Z-Report, Suppliers, KDS)
        const dashBar = document.querySelector('#tab-dashboard .toolbar');
        if (dashBar) {
            let proDash = document.getElementById('skmProDashGroup');
            if (!proDash) {
                proDash = document.createElement('div');
                proDash.id = 'skmProDashGroup';
                proDash.style.cssText = 'display:flex; gap:8px; flex-wrap:wrap; align-items:center;';
                dashBar.appendChild(proDash);
            }
            let h = '';
            if (pf.telegramZReport) h += `<button type="button" class="btn btn-outline" style="border-color:#0ea5e9; color:#0ea5e9; font-size:12px;" onclick="window.sendZReportToTelegram(false)">🤖 ផ្ញើ Z-Report Telegram</button>`;
            if (pf.multiBranch) h += `<button type="button" class="btn btn-outline" style="border-color:#10b981; color:#10b981; font-size:12px;" onclick="window.open('master_branches.html?branch=${br}', '_blank')">🏢 សរុបឆ្លងសាខា</button>`;
            if (pf.kds) h += `<button type="button" class="btn btn-outline" style="border-color:#f59e0b; color:#f59e0b; font-size:12px;" onclick="window.open('kds.html?branch=${br}', '_blank')">👨‍🍳 KDS ផ្ទះបាយ</button>`;
            if (pf.customerDisplay) h += `<button type="button" class="btn btn-outline" style="border-color:#8b5cf6; color:#8b5cf6; font-size:12px;" onclick="window.open('display.html?branch=${br}', '_blank')">🖥️ អេក្រង់ភ្ញៀវ</button>`;
            proDash.innerHTML = h;
            proDash.style.display = h ? 'flex' : 'none';
        }

        // B. Inventory Action Group Pro Buttons (Suppliers & Stock Audit)
        const invGrp = document.getElementById('inventoryActionButtonsGroup');
        if (invGrp) {
            let proInv = document.getElementById('skmProInvGroup');
            if (!proInv) {
                proInv = document.createElement('div');
                proInv.id = 'skmProInvGroup';
                proInv.style.cssText = 'display:inline-flex; gap:8px; flex-wrap:wrap; align-items:center;';
                invGrp.prepend(proInv);
            }
            let h = '';
            if (pf.suppliers) h += `<button type="button" class="btn btn-outline" style="border-color:#10b981; color:#10b981;" onclick="window.openSuppliersModal()">🚚 អ្នកផ្គត់ផ្គង់ & PO</button>`;
            if (pf.stockAudit) h += `<button type="button" class="btn btn-outline" style="border-color:#f59e0b; color:#f59e0b;" onclick="window.openStockAuditModal()">📋 រាប់ស្តុក (Audit)</button>`;
            proInv.innerHTML = h;
            proInv.style.display = h ? 'inline-flex' : 'none';
        }

        // C. POS Cart Split Bill & Screen Buttons
        const checkoutBtns = document.querySelector('.pos-checkout-btns');
        if (checkoutBtns) {
            let proPosBar = document.getElementById('skmProPosCartBar');
            if (!proPosBar) {
                proPosBar = document.createElement('div');
                proPosBar.id = 'skmProPosCartBar';
                proPosBar.style.cssText = 'display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;';
                checkoutBtns.before(proPosBar);
            }
            let h = '';
            if (pf.splitBill) h += `<button type="button" class="btn btn-outline" style="flex:1; padding:6px 8px; font-size:12px; border-color:#38bdf8; color:#38bdf8;" onclick="window.openPosSplitBillModal()">🧾 បំបែកវិក្កយបត្រ</button>`;
            if (pf.customerDisplay) h += `<button type="button" class="btn btn-outline" style="padding:6px 10px; font-size:12px;" onclick="window.open('display.html?branch=${br}', '_blank')" title="បើកអេក្រង់ទី ២">🖥️</button>`;
            if (pf.kds) h += `<button type="button" class="btn btn-outline" style="padding:6px 10px; font-size:12px;" onclick="window.open('kds.html?branch=${br}', '_blank')" title="បើកអេក្រង់ផ្ទះបាយ KDS">👨‍🍳</button>`;
            proPosBar.innerHTML = h;
            proPosBar.style.display = h ? 'flex' : 'none';
        }

        syncProductTagsUIInModal();
    };

    function bootProAddons() {
        hookProductModalForTags();
        hookInvoiceModalForSlips();
        hookZReport();
        window.syncProErpButtons();
        // Re-sync after Cloud Sync completes
        if (typeof window.loadSettingsToUI === 'function' && !window.loadSettingsToUI.__skmProHooked) {
            const orig = window.loadSettingsToUI;
            window.loadSettingsToUI = function() {
                orig.apply(this, arguments);
                window.syncProErpButtons();
            };
            window.loadSettingsToUI.__skmProHooked = true;
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(bootProAddons, 220));
    else setTimeout(bootProAddons, 220);
})();
