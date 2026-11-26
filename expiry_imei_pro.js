/**
 * expiry_imei_pro.js — ប្រព័ន្ធដាស់តឿនថ្ងៃផុតកំណត់, លេខឡូត៍ (Lot/Batch) និង Serial / IMEI Tracking
 * បិទ/បើកដាច់ដោយឡែក ១០០% ក្នុង Admin Settings -> Tab 9 (pfExpiryAlerts & pfSerialImei)
 * មិនធ្វើឱ្យរញ៉េរញ៉ៃដល់ហាងដែលមិនត្រូវការមុខងារទាំងនេះឡើយ!
 */
(function () {
    'use strict';

    function getBranch() {
        return window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    }

    function getPF() {
        return (window.sysSettings && window.sysSettings.proFeatures) ? window.sysSettings.proFeatures : {};
    }

    function esc(s) {
        return typeof window.escapeHTML === 'function'
            ? window.escapeHTML(String(s || ''))
            : String(s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

    function persistSysMaps() {
        try {
            localStorage.setItem(window.getBranchKey('sys_settings'), JSON.stringify(window.sysSettings || {}));
            if (typeof window.touchCloudSync === 'function') window.touchCloudSync();
            else if (typeof window.saveData === 'function') window.saveData(window.userAccounts);
        } catch (e) {}
    }

    function getLotMap() {
        if (!window.sysSettings) window.sysSettings = {};
        if (!window.sysSettings.productLotMap || typeof window.sysSettings.productLotMap !== 'object') {
            window.sysSettings.productLotMap = {};
        }
        return window.sysSettings.productLotMap;
    }

    function getImeiPoolMap() {
        if (!window.sysSettings) window.sysSettings = {};
        if (!window.sysSettings.productImeiPoolMap || typeof window.sysSettings.productImeiPoolMap !== 'object') {
            window.sysSettings.productImeiPoolMap = {};
        }
        return window.sysSettings.productImeiPoolMap;
    }

    // =========================================================
    // PART A: EXPIRY ALERT ENGINE & LOT/BATCH MANAGER
    // =========================================================
    window.getExpiryReport = function () {
        const warnDays = parseInt(window.sysSettings?.expiryWarnDays) || 30;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const lotMap = getLotMap();
        const expired = [], expiringSoon = [], safe = [];

        (window.inventory || []).forEach(p => {
            if (!p || !p.expiry) return;
            const d = new Date(p.expiry);
            if (isNaN(d.getTime())) return;
            d.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const row = {
                id: p.id,
                customId: p.customId || p.id,
                name: p.name,
                category: p.category || '-',
                qty: parseInt(p.qty) || 0,
                unit: p.unit || 'ឯកតា',
                expiry: p.expiry,
                lotNo: lotMap[p.id] || p.lotNo || '',
                diffDays
            };
            if (diffDays < 0) expired.push(row);
            else if (diffDays <= warnDays) expiringSoon.push(row);
            else safe.push(row);
        });

        expired.sort((a, b) => a.diffDays - b.diffDays);
        expiringSoon.sort((a, b) => a.diffDays - b.diffDays);
        safe.sort((a, b) => a.diffDays - b.diffDays);
        return { expired, expiringSoon, safe, warnDays };
    };

    function ensureExpiryModal() {
        if (document.getElementById('skmExpiryAlertModal')) return;
        const div = document.createElement('div');
        div.id = 'skmExpiryAlertModal';
        div.className = 'modal-overlay';
        div.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.68); backdrop-filter:blur(5px); z-index:10055; justify-content:center; align-items:center; padding:16px;';
        div.innerHTML = `
            <div class="modal" style="max-width:860px; width:100%; max-height:90vh; display:flex; flex-direction:column; border-radius:18px; overflow:hidden;">
                <div style="display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid var(--border); background:rgba(245,158,11,0.1);">
                    <div>
                        <h3 style="margin:0; font-size:17px; color:#d97706;">📅 តាមដានថ្ងៃផុតកំណត់ & លេខឡូត៍ (Expiry & Lot Manager)</h3>
                        <small id="skmExpiryModalSub" style="color:var(--text-muted);">ត្រួតពិនិត្យទំនិញផុតកំណត់ និងជិតផុតកំណត់</small>
                    </div>
                    <button type="button" class="btn btn-outline" style="padding:6px 12px;" onclick="document.getElementById('skmExpiryAlertModal').style.display='none'">✕</button>
                </div>
                <div style="padding:12px 20px; display:flex; gap:8px; flex-wrap:wrap; align-items:center; border-bottom:1px solid var(--border);">
                    <button type="button" class="btn btn-outline" id="expTabExpired" onclick="window.renderExpiryModal('expired')" style="font-size:12px; border-color:#ef4444; color:#ef4444;">🔴 ផុតកំណត់ហើយ</button>
                    <button type="button" class="btn btn-outline" id="expTabSoon" onclick="window.renderExpiryModal('soon')" style="font-size:12px; border-color:#f59e0b; color:#d97706;">🟠 ជិតផុតកំណត់</button>
                    <button type="button" class="btn btn-outline" id="expTabSafe" onclick="window.renderExpiryModal('safe')" style="font-size:12px; border-color:#10b981; color:#10b981;">🟢 សុវត្ថិភាព</button>
                    <div style="margin-left:auto; display:flex; gap:6px; flex-wrap:wrap;">
                        <button type="button" class="btn btn-outline" style="font-size:12px;" onclick="window.exportExpiryCSV()">📥 CSV</button>
                        <button type="button" class="btn btn-primary" style="font-size:12px;" onclick="window.sendExpiryReportTelegram()">📲 ផ្ញើចូល Telegram</button>
                    </div>
                </div>
                <div style="overflow:auto; flex:1; padding:14px 20px;">
                    <table style="width:100%; border-collapse:collapse; font-size:13px;">
                        <thead>
                            <tr style="border-bottom:2px solid var(--border); text-align:left;">
                                <th style="padding:8px 6px;">ទំនិញ</th>
                                <th style="padding:8px 6px;">Lot / Batch</th>
                                <th style="padding:8px 6px;">ស្តុក</th>
                                <th style="padding:8px 6px;">ថ្ងៃផុតកំណត់</th>
                                <th style="padding:8px 6px;">ស្ថានភាព</th>
                                <th style="padding:8px 6px; text-align:center;">កែប្រែ</th>
                            </tr>
                        </thead>
                        <tbody id="skmExpiryTableBody"></tbody>
                    </table>
                </div>
            </div>
        `;
        document.body.appendChild(div);
    }

    let currentExpTab = 'all_alert';
    window.openExpiryAlertModal = function () {
        ensureExpiryModal();
        document.getElementById('skmExpiryAlertModal').style.display = 'flex';
        const rep = window.getExpiryReport();
        window.renderExpiryModal(rep.expired.length > 0 ? 'expired' : 'soon');
    };

    window.renderExpiryModal = function (tab) {
        currentExpTab = tab || 'soon';
        const rep = window.getExpiryReport();
        const sub = document.getElementById('skmExpiryModalSub');
        if (sub) sub.innerText = `កម្រិតដាស់តឿនមុនថ្ងៃផុតកំណត់៖ ${rep.warnDays} ថ្ងៃ (អាចកែក្នុង Admin Settings -> Tab 9)`;

        const tExp = document.getElementById('expTabExpired');
        const tSoon = document.getElementById('expTabSoon');
        const tSafe = document.getElementById('expTabSafe');
        if (tExp) tExp.innerText = `🔴 ផុតកំណត់ហើយ (${rep.expired.length})`;
        if (tSoon) tSoon.innerText = `🟠 ជិតផុតកំណត់ ≤${rep.warnDays}ថ្ងៃ (${rep.expiringSoon.length})`;
        if (tSafe) tSafe.innerText = `🟢 សុវត្ថិភាព (${rep.safe.length})`;

        const list = currentExpTab === 'expired' ? rep.expired : (currentExpTab === 'safe' ? rep.safe : rep.expiringSoon);
        const tbody = document.getElementById('skmExpiryTableBody');
        if (!tbody) return;

        if (!list.length) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:26px; color:var(--text-muted);">✅ មិនមានទំនិញក្នុងក្រុមនេះទេ</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(r => {
            const badge = r.diffDays < 0
                ? `<span style="background:rgba(239,68,68,0.15); color:#ef4444; padding:2px 8px; border-radius:6px; font-weight:800;">ផុត ${Math.abs(r.diffDays)} ថ្ងៃហើយ</span>`
                : (r.diffDays <= rep.warnDays
                    ? `<span style="background:rgba(245,158,11,0.18); color:#d97706; padding:2px 8px; border-radius:6px; font-weight:800;">នៅសល់ ${r.diffDays} ថ្ងៃ</span>`
                    : `<span style="background:rgba(16,185,129,0.15); color:#059669; padding:2px 8px; border-radius:6px; font-weight:800;">នៅសល់ ${r.diffDays} ថ្ងៃ</span>`);
            return `
                <tr style="border-bottom:1px solid var(--border);">
                    <td style="padding:8px 6px;"><b>${esc(r.name)}</b><br><small style="color:var(--text-muted);">${esc(r.customId)} • ${esc(r.category)}</small></td>
                    <td style="padding:8px 6px; font-family:monospace;">${r.lotNo ? esc(r.lotNo) : '<span style="color:var(--text-muted);">-</span>'}</td>
                    <td style="padding:8px 6px; font-weight:800;">${r.qty} ${esc(r.unit)}</td>
                    <td style="padding:8px 6px;">${esc(r.expiry)}</td>
                    <td style="padding:8px 6px;">${badge}</td>
                    <td style="padding:8px 6px; text-align:center;">
                        <button type="button" class="btn btn-outline" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('skmExpiryAlertModal').style.display='none'; window.editProduct && window.editProduct('${r.id}');">✏️ កែ</button>
                    </td>
                </tr>
            `;
        }).join('');
    };

    window.exportExpiryCSV = function () {
        const rep = window.getExpiryReport();
        const all = [...rep.expired, ...rep.expiringSoon, ...rep.safe];
        if (!all.length) return window.showToast && window.showToast('មិនមានទំនិញដែលមានថ្ងៃផុតកំណត់ទេ!', true);
        let csv = '\uFEFFCode,Name,Category,LotBatch,Qty,ExpiryDate,DaysLeft\n';
        all.forEach(r => {
            csv += `"${r.customId}","${(r.name || '').replace(/"/g, '""')}","${(r.category || '').replace(/"/g, '""')}","${(r.lotNo || '').replace(/"/g, '""')}",${r.qty},"${r.expiry}",${r.diffDays}\n`;
        });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
        a.download = `SKM_Expiry_Lot_${getBranch()}_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    window.sendExpiryReportTelegram = async function () {
        const sys = window.sysSettings || {};
        const token = (sys.orderTelegramBotToken || sys.telegramBotToken || window.telegramBotToken || '').trim();
        const chatId = (sys.orderTelegramChatId || sys.telegramChatId || window.telegramChatId || '').trim();
        if (!token || !chatId) return window.showToast && window.showToast('⚠️ សូមកំណត់ Telegram Bot ក្នុង Admin Settings -> Tab 5 សិន!', true);

        const rep = window.getExpiryReport();
        const lines = [
            `📅 <b>[EXPIRY ALERT] ${esc(window.shopName || 'SKM POS')}</b>`,
            `🔴 ផុតកំណត់ហើយ៖ <b>${rep.expired.length}</b> មុខ`,
            `🟠 ជិតផុតកំណត់ (≤${rep.warnDays} ថ្ងៃ)៖ <b>${rep.expiringSoon.length}</b> មុខ`,
            ''
        ];
        rep.expired.slice(0, 10).forEach(r => lines.push(`🔴 ${esc(r.name)} ${r.lotNo ? `[Lot: ${esc(r.lotNo)}]` : ''} — ផុត ${Math.abs(r.diffDays)} ថ្ងៃ (${r.qty} ${esc(r.unit)})`));
        rep.expiringSoon.slice(0, 10).forEach(r => lines.push(`🟠 ${esc(r.name)} ${r.lotNo ? `[Lot: ${esc(r.lotNo)}]` : ''} — នៅសល់ ${r.diffDays} ថ្ងៃ (${r.qty} ${esc(r.unit)})`));
        try {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'HTML' })
            });
            window.showToast && window.showToast('✅ បានផ្ញើរបាយការណ៍ផុតកំណត់ចូល Telegram ជោគជ័យ!');
        } catch (err) {
            window.showToast && window.showToast('❌ បរាជ័យផ្ញើ Telegram: ' + err.message, true);
        }
    };

    // =========================================================
    // PART B: SERIAL / IMEI MODAL FOR POS CART & WARRANTY LOOKUP
    // =========================================================
    function ensureCartImeiModal() {
        if (document.getElementById('skmCartImeiModal')) return;
        const div = document.createElement('div');
        div.id = 'skmCartImeiModal';
        div.className = 'modal-overlay';
        div.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.68); backdrop-filter:blur(5px); z-index:10060; justify-content:center; align-items:center; padding:16px;';
        div.innerHTML = `
            <div class="modal" style="max-width:480px; width:100%; border-radius:16px; padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="margin:0; font-size:16px;">🔢 បញ្ចូល / ស្កេន Serial ឬ IMEI</h3>
                    <button type="button" class="btn btn-outline" style="padding:4px 10px;" onclick="document.getElementById('skmCartImeiModal').style.display='none'">✕</button>
                </div>
                <div id="skmCartImeiItemInfo" style="font-size:13px; font-weight:800; color:var(--primary); margin-bottom:10px;"></div>
                <input type="hidden" id="skmCartImeiItemId">
                <div id="skmCartImeiPoolBox" style="margin-bottom:10px; display:none;">
                    <label style="font-size:12px; font-weight:bold; display:block; margin-bottom:4px;">📦 ជ្រើសរើសពីស្តុក Serial/IMEI ដែលមានស្រាប់៖</label>
                    <div id="skmCartImeiPoolPills" style="display:flex; flex-wrap:wrap; gap:6px; max-height:110px; overflow:auto; padding:6px; background:rgba(0,0,0,0.04); border-radius:8px;"></div>
                </div>
                <label style="font-size:12px; font-weight:bold; display:block; margin-bottom:4px;">វាយ ឬ ស្កេនបាកូដ Serial / IMEI (បំបែកដោយសញ្ញាក្បៀស "," ឬចុះបន្ទាត់)៖</label>
                <textarea id="skmCartImeiTextarea" class="form-control" rows="3" placeholder="ឧ. 356938035643809, SN-2026-001" style="width:100%; font-family:monospace;"></textarea>
                <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:14px;">
                    <button type="button" class="btn btn-outline" onclick="document.getElementById('skmCartImeiModal').style.display='none'">បោះបង់</button>
                    <button type="button" class="btn btn-primary" onclick="window.saveCartItemSerial()">💾 រក្សាទុកជាប់កន្ត្រក</button>
                </div>
            </div>
        `;
        document.body.appendChild(div);
    }

    window.openCartImeiModal = function (itemId) {
        ensureCartImeiModal();
        const item = (window.cart || []).find(c => c && String(c.id) === String(itemId));
        if (!item) return;
        document.getElementById('skmCartImeiItemId').value = item.id;
        document.getElementById('skmCartImeiItemInfo').innerText = `${item.name} (ចំនួនក្នុងកន្ត្រក: ${item.cartQty})`;
        document.getElementById('skmCartImeiTextarea').value = item.serialNo || '';

        const pool = getImeiPoolMap()[item.id] || [];
        const poolBox = document.getElementById('skmCartImeiPoolBox');
        const pills = document.getElementById('skmCartImeiPoolPills');
        if (Array.isArray(pool) && pool.length > 0) {
            poolBox.style.display = 'block';
            pills.innerHTML = pool.map(sn => {
                const safeSn = esc(sn).replace(/'/g, '&#39;');
                return `<button type="button" class="btn btn-outline" style="padding:3px 8px; font-size:11px; font-family:monospace;" onclick="window.appendSerialToCartInput('${safeSn}')">+ ${esc(sn)}</button>`;
            }).join('');
        } else {
            poolBox.style.display = 'none';
        }
        document.getElementById('skmCartImeiModal').style.display = 'flex';
        setTimeout(() => document.getElementById('skmCartImeiTextarea').focus(), 80);
    };

    window.appendSerialToCartInput = function (sn) {
        const ta = document.getElementById('skmCartImeiTextarea');
        if (!ta) return;
        const cur = ta.value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        if (!cur.includes(sn)) cur.push(sn);
        ta.value = cur.join(', ');
    };

    window.saveCartItemSerial = function () {
        const id = document.getElementById('skmCartImeiItemId').value;
        const raw = document.getElementById('skmCartImeiTextarea').value || '';
        const cleaned = raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean).join(', ');
        const item = (window.cart || []).find(c => c && String(c.id) === String(id));
        if (item) {
            item.serialNo = cleaned;
            const lot = getLotMap()[item.id];
            if (lot) item.lotNo = lot;
        }
        document.getElementById('skmCartImeiModal').style.display = 'none';
        if (typeof window.renderCart === 'function') window.renderCart();
        if (typeof window.showToast === 'function') window.showToast('✅ បានភ្ជាប់លេខ Serial / IMEI ជាប់ទំនិញរួចរាល់!');
    };

    function ensureImeiSearchModal() {
        if (document.getElementById('skmImeiLookupModal')) return;
        const div = document.createElement('div');
        div.id = 'skmImeiLookupModal';
        div.className = 'modal-overlay';
        div.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.68); backdrop-filter:blur(5px); z-index:10060; justify-content:center; align-items:center; padding:16px;';
        div.innerHTML = `
            <div class="modal" style="max-width:740px; width:100%; max-height:86vh; display:flex; flex-direction:column; border-radius:18px; overflow:hidden;">
                <div style="display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid var(--border);">
                    <h3 style="margin:0; font-size:16px;">🔢 ស្វែងរក Serial / IMEI & ធានា (Warranty Lookup)</h3>
                    <button type="button" class="btn btn-outline" style="padding:5px 10px;" onclick="document.getElementById('skmImeiLookupModal').style.display='none'">✕</button>
                </div>
                <div style="padding:14px 20px; border-bottom:1px solid var(--border);">
                    <input type="text" id="skmImeiLookupInput" class="form-control" placeholder="🔍 វាយ ឬ ស្កេនលេខ IMEI / Serial Number..." style="width:100%; font-family:monospace;" oninput="window.runImeiLookup()">
                </div>
                <div id="skmImeiLookupResults" style="padding:14px 20px; overflow:auto; flex:1; font-size:13px;"></div>
            </div>
        `;
        document.body.appendChild(div);
    }

    window.openImeiLookupModal = function () {
        ensureImeiSearchModal();
        document.getElementById('skmImeiLookupModal').style.display = 'flex';
        window.runImeiLookup();
        setTimeout(() => document.getElementById('skmImeiLookupInput').focus(), 80);
    };

    window.runImeiLookup = function () {
        const resEl = document.getElementById('skmImeiLookupResults');
        if (!resEl) return;
        const q = (document.getElementById('skmImeiLookupInput')?.value || '').toLowerCase().trim();
        let html = '';

        // 1. Search sold invoices
        const soldMatches = [];
        (window.invoices || []).forEach(inv => {
            if (!inv || !Array.isArray(inv.items)) return;
            inv.items.forEach(it => {
                if (!it || !it.serialNo) return;
                if (!q || String(it.serialNo).toLowerCase().includes(q) || String(it.name || '').toLowerCase().includes(q)) {
                    soldMatches.push({
                        serialNo: it.serialNo,
                        itemName: it.name,
                        invoiceId: inv.id || inv.invoiceNo,
                        date: inv.date || '',
                        customer: inv.customerName || inv.customer || 'អតិថិជនទូទៅ',
                        phone: inv.customerPhone || inv.phone || '-'
                    });
                }
            });
        });

        // 2. Search available stock IMEI pool
        const stockMatches = [];
        const poolMap = getImeiPoolMap();
        Object.keys(poolMap).forEach(pid => {
            const p = (window.inventory || []).find(x => x && String(x.id) === String(pid));
            const list = Array.isArray(poolMap[pid]) ? poolMap[pid] : [];
            list.forEach(sn => {
                if (!q || String(sn).toLowerCase().includes(q) || (p && String(p.name).toLowerCase().includes(q))) {
                    stockMatches.push({ serialNo: sn, itemName: p ? p.name : pid, customId: p ? p.customId : pid });
                }
            });
        });

        html += `<h4 style="margin:0 0 8px 0; color:var(--primary);">🧾 ប្រវត្តិលក់ចេញហើយ (${soldMatches.length})</h4>`;
        if (!soldMatches.length) {
            html += `<p style="color:var(--text-muted); margin-bottom:14px;">មិនមានលទ្ធផលក្នុងវិក្កយបត្រលក់ទេ។</p>`;
        } else {
            html += soldMatches.slice(0, 50).map(m => `
                <div style="padding:10px 12px; border:1px solid var(--border); border-radius:10px; margin-bottom:8px; display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
                    <div>
                        <div style="font-family:monospace; font-weight:900; color:var(--primary);">🔢 ${esc(m.serialNo)}</div>
                        <div><b>${esc(m.itemName)}</b> • វិក្កយបត្រ <code>${esc(m.invoiceId)}</code></div>
                        <small style="color:var(--text-muted);">👤 ${esc(m.customer)} (${esc(m.phone)}) • 🕒 ${esc(m.date)}</small>
                    </div>
                    <button type="button" class="btn btn-outline" style="height:32px; font-size:11px;" onclick="document.getElementById('skmImeiLookupModal').style.display='none'; window.viewInvoiceDetails && window.viewInvoiceDetails('${esc(m.invoiceId)}');">👁️ មើលវិក្កយបត្រ</button>
                </div>
            `).join('');
        }

        html += `<h4 style="margin:14px 0 8px 0; color:var(--success);">📦 នៅសល់ក្នុងស្តុក (${stockMatches.length})</h4>`;
        if (!stockMatches.length) {
            html += `<p style="color:var(--text-muted);">មិនមានលេខ Serial/IMEI ក្នុងស្តុកទេ។</p>`;
        } else {
            html += `<div style="display:flex; flex-wrap:wrap; gap:6px;">` + stockMatches.slice(0, 60).map(m =>
                `<span style="background:rgba(16,185,129,0.12); color:#059669; border:1px solid rgba(16,185,129,0.3); padding:4px 10px; border-radius:8px; font-size:12px;"><code>${esc(m.serialNo)}</code> — ${esc(m.itemName)}</span>`
            ).join('') + `</div>`;
        }
        resEl.innerHTML = html;
    };

    // =========================================================
    // INJECT LOT & SERIAL INPUTS INTO PRODUCT MODAL DYNAMICALLY
    // =========================================================
    function syncProductModalExtraFields() {
        const pf = getPF();
        const expiryContainer = document.getElementById('pExpiryContainer');
        if (!expiryContainer) return;

        // If pfExpiryAlerts is enabled, make sure expiry date box is visible too
        if (pf.expiryAlerts) expiryContainer.style.display = 'block';

        let box = document.getElementById('skmLotImeiFieldsBox');
        if (!box) {
            box = document.createElement('div');
            box.id = 'skmLotImeiFieldsBox';
            box.style.cssText = 'margin-top:12px; display:none; gap:10px; flex-direction:column; padding:12px; border-radius:10px; border:1px dashed var(--border); background:rgba(0,0,0,0.02);';
            box.innerHTML = `
                <div id="skmLotFieldWrap" style="display:none;">
                    <label style="font-size:12px; font-weight:bold; display:block; margin-bottom:4px;">🏷️ លេខឡូត៍ / Batch No. (Lot Number):</label>
                    <input type="text" id="pLotNo" class="form-control" placeholder="ឧ. LOT-2026-A1" style="width:100%;">
                </div>
                <div id="skmImeiPoolFieldWrap" style="display:none;">
                    <label style="font-size:12px; font-weight:bold; display:block; margin-bottom:4px;">🔢 បញ្ជីលេខ Serial / IMEI ក្នុងស្តុក (១ បន្ទាត់ = ១ គ្រឿង):</label>
                    <textarea id="pImeiPool" class="form-control" rows="2" placeholder="356938035643809&#10;356938035643810" style="width:100%; font-family:monospace; font-size:12px;"></textarea>
                </div>
            `;
            expiryContainer.parentElement.after(box);
        }

        const lotWrap = document.getElementById('skmLotFieldWrap');
        const imeiWrap = document.getElementById('skmImeiPoolFieldWrap');
        if (lotWrap) lotWrap.style.display = pf.expiryAlerts ? 'block' : 'none';
        if (imeiWrap) imeiWrap.style.display = pf.serialImei ? 'block' : 'none';
        box.style.display = (pf.expiryAlerts || pf.serialImei) ? 'flex' : 'none';
    }

    function installInventoryAndPosHooks() {
        if (typeof window.openProductModal === 'function' && !window.openProductModal.__skmExpImeiHooked) {
            const origOpen = window.openProductModal;
            window.openProductModal = function () {
                origOpen.apply(this, arguments);
                syncProductModalExtraFields();
                const lotEl = document.getElementById('pLotNo');
                const imeiEl = document.getElementById('pImeiPool');
                if (lotEl) lotEl.value = '';
                if (imeiEl) imeiEl.value = '';
            };
            window.openProductModal.__skmExpImeiHooked = true;
        }

        if (typeof window.editProduct === 'function' && !window.editProduct.__skmExpImeiHooked) {
            const origEdit = window.editProduct;
            window.editProduct = function (id) {
                origEdit.apply(this, arguments);
                syncProductModalExtraFields();
                const lotEl = document.getElementById('pLotNo');
                const imeiEl = document.getElementById('pImeiPool');
                if (lotEl) lotEl.value = getLotMap()[id] || '';
                if (imeiEl) {
                    const arr = getImeiPoolMap()[id] || [];
                    imeiEl.value = Array.isArray(arr) ? arr.join('\n') : '';
                }
            };
            window.editProduct.__skmExpImeiHooked = true;
        }

        if (typeof window.saveProduct === 'function' && !window.saveProduct.__skmExpImeiHooked) {
            const origSave = window.saveProduct;
            window.saveProduct = async function () {
                const pf = getPF();
                const lotVal = document.getElementById('pLotNo')?.value?.trim() || '';
                const imeiRaw = document.getElementById('pImeiPool')?.value || '';
                const imeiArr = imeiRaw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
                const prevLen = (window.inventory || []).length;
                const editingId = document.getElementById('pId')?.value || '';
                const res = await origSave.apply(this, arguments);

                if (pf.expiryAlerts || pf.serialImei) {
                    const target = editingId
                        ? (window.inventory || []).find(p => p && p.id === editingId)
                        : ((window.inventory || []).length > prevLen ? window.inventory[window.inventory.length - 1] : null);
                    if (target) {
                        if (pf.expiryAlerts) {
                            const lm = getLotMap();
                            if (lotVal) lm[target.id] = lotVal;
                            else delete lm[target.id];
                        }
                        if (pf.serialImei) {
                            const im = getImeiPoolMap();
                            if (imeiArr.length > 0) im[target.id] = imeiArr;
                            else delete im[target.id];
                        }
                        persistSysMaps();
                        window.syncExpiryImeiButtons();
                    }
                }
                return res;
            };
            window.saveProduct.__skmExpImeiHooked = true;
        }

        // Remove sold Serial/IMEI from product pool on checkout
        if (typeof window.checkout === 'function' && !window.checkout.__skmImeiCheckoutHooked) {
            const origCk = window.checkout;
            window.checkout = function () {
                const pf = getPF();
                const usedSerials = [];
                if (pf.serialImei && Array.isArray(window.cart)) {
                    window.cart.forEach(c => {
                        if (c && c.serialNo) {
                            usedSerials.push({
                                id: c.id,
                                list: String(c.serialNo).split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
                            });
                        }
                    });
                }
                const res = origCk.apply(this, arguments);
                if (usedSerials.length > 0) {
                    const poolMap = getImeiPoolMap();
                    let changed = false;
                    usedSerials.forEach(u => {
                        if (Array.isArray(poolMap[u.id])) {
                            const usedSet = new Set(u.list.map(x => x.toLowerCase()));
                            poolMap[u.id] = poolMap[u.id].filter(sn => !usedSet.has(String(sn).toLowerCase()));
                            changed = true;
                        }
                    });
                    if (changed) persistSysMaps();
                }
                return res;
            };
            window.checkout.__skmImeiCheckoutHooked = true;
        }

        // Show Serial/IMEI in invoice viewer modal
        if (typeof window.viewInvoiceDetails === 'function' && !window.viewInvoiceDetails.__skmImeiViewHooked) {
            const origView = window.viewInvoiceDetails;
            window.viewInvoiceDetails = function (invId) {
                const r = origView.apply(this, arguments);
                const pf = getPF();
                if (!pf.serialImei) return r;
                const inv = (window.invoices || []).find(i => i && String(i.id || i.invoiceNo).toLowerCase() === String(invId).toLowerCase());
                const serialLines = (inv && Array.isArray(inv.items))
                    ? inv.items.filter(it => it && it.serialNo).map(it => `${esc(it.name)}: <code>${esc(it.serialNo)}</code>`)
                    : [];
                const targetBox = document.getElementById('viewInvoiceContent') || document.getElementById('invoiceViewModal');
                if (targetBox) {
                    const old = document.getElementById('skmViewInvoiceSerialBox');
                    if (old) old.remove();
                    if (serialLines.length > 0) {
                        const snDiv = document.createElement('div');
                        snDiv.id = 'skmViewInvoiceSerialBox';
                        snDiv.style.cssText = 'margin-top:10px; padding:10px 12px; border-radius:10px; background:rgba(6,182,212,0.08); border:1px dashed var(--primary); font-size:12px;';
                        snDiv.innerHTML = `<div style="font-weight:900; color:var(--primary); margin-bottom:4px;">🔢 Serial / IMEI ជាប់វិក្កយបត្រ៖</div>` + serialLines.join('<br>');
                        targetBox.appendChild(snDiv);
                    }
                }
                return r;
            };
            window.viewInvoiceDetails.__skmImeiViewHooked = true;
        }
    }

    // =========================================================
    // TOOLBAR BUTTONS (ZERO CLUTTER WHEN OFF IN ADMIN SETTINGS)
    // =========================================================
    window.syncExpiryImeiButtons = function () {
        const pf = getPF();
        const rep = pf.expiryAlerts ? window.getExpiryReport() : { expired: [], expiringSoon: [] };
        const alertCount = rep.expired.length + rep.expiringSoon.length;

        // 1. Dashboard Toolbar
        const dashBar = document.querySelector('#tab-dashboard .toolbar');
        if (dashBar) {
            let expBtn = document.getElementById('skmExpiryDashBtn');
            if (pf.expiryAlerts) {
                if (!expBtn) {
                    expBtn = document.createElement('button');
                    expBtn.id = 'skmExpiryDashBtn';
                    expBtn.type = 'button';
                    expBtn.className = 'btn btn-outline';
                    expBtn.onclick = window.openExpiryAlertModal;
                    dashBar.appendChild(expBtn);
                }
                const urgentColor = rep.expired.length > 0 ? '#ef4444' : '#f59e0b';
                expBtn.style.cssText = `border-color:${urgentColor}; color:${urgentColor}; font-size:12px; font-weight:800;`;
                expBtn.innerHTML = `📅 ផុតកំណត់ (${alertCount})`;
                expBtn.style.display = 'inline-flex';
            } else if (expBtn) {
                expBtn.style.display = 'none';
            }
        }

        // 2. Inventory Toolbar
        const invGrp = document.getElementById('inventoryActionButtonsGroup');
        if (invGrp) {
            let wrap = document.getElementById('skmExpiryImeiInvWrap');
            if (pf.expiryAlerts || pf.serialImei) {
                if (!wrap) {
                    wrap = document.createElement('div');
                    wrap.id = 'skmExpiryImeiInvWrap';
                    wrap.style.cssText = 'display:inline-flex; gap:8px; flex-wrap:wrap; align-items:center;';
                    invGrp.prepend(wrap);
                }
                let h = '';
                if (pf.expiryAlerts) {
                    const col = rep.expired.length > 0 ? '#ef4444' : '#f59e0b';
                    h += `<button type="button" class="btn btn-outline" style="border-color:${col}; color:${col};" onclick="window.openExpiryAlertModal()">📅 ថ្ងៃផុតកំណត់ (${alertCount})</button>`;
                }
                if (pf.serialImei) {
                    h += `<button type="button" class="btn btn-outline" style="border-color:#06b6d4; color:#06b6d4;" onclick="window.openImeiLookupModal()">🔢 ស្វែងរក IMEI</button>`;
                }
                wrap.innerHTML = h;
                wrap.style.display = h ? 'inline-flex' : 'none';
            } else if (wrap) {
                wrap.style.display = 'none';
            }
        }
    };

    function bootExpiryImei() {
        installInventoryAndPosHooks();
        window.syncExpiryImeiButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(bootExpiryImei, 400));
    } else {
        setTimeout(bootExpiryImei, 400);
    }
})();
