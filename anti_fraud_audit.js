/**
 * anti_fraud_audit.js — ប្រព័ន្ធការពារការបន្លំ (Anti-Fraud Audit Log + Instant Telegram Alert)
 * បិទ/បើកបាន ១០០% ក្នុង Admin Settings -> Tab 9 (pfAntiFraudAudit, pfAntiFraudTelegram)
 * ទុកទិន្នន័យដាច់ដោយឡែកមិនឱ្យបុគ្គលិកលុបបាន និងបាញ់សារដាស់តឿនម្ចាស់ហាងភ្លាមៗតាម Telegram
 */
(function () {
    'use strict';

    function getBranch() {
        return window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    }

    function getPF() {
        return (window.sysSettings && window.sysSettings.proFeatures) ? window.sysSettings.proFeatures : {};
    }

    function getLogKey() {
        return `ks2_${getBranch()}_antifraud_logs`;
    }

    function esc(s) {
        return typeof window.escapeHTML === 'function'
            ? window.escapeHTML(String(s || ''))
            : String(s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

    function getStaffInfo() {
        const u = window.activeUser || {};
        return {
            name: u.fullName || u.username || 'System',
            role: String(u.role || window.currentRole || 'guest')
        };
    }

    window.getAntiFraudLogs = function () {
        try {
            const raw = localStorage.getItem(getLogKey());
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr : [];
        } catch (e) {
            return [];
        }
    };

    function saveAntiFraudLogs(logs) {
        try {
            const trimmed = Array.isArray(logs) ? logs.slice(0, 1000) : [];
            localStorage.setItem(getLogKey(), JSON.stringify(trimmed));
        } catch (e) {}
    }

    async function sendAntiFraudTelegram(entry) {
        const pf = getPF();
        if (!pf.antiFraudTelegram) return;
        const sys = window.sysSettings || {};
        const token = (sys.orderTelegramBotToken || sys.telegramBotToken || window.telegramBotToken || sys.serviceTelegramBotToken || '').trim();
        const chatId = (sys.antiFraudTelegramChatId || sys.orderTelegramChatId || sys.telegramChatId || window.telegramChatId || '').trim();
        if (!token || !chatId || !navigator.onLine) return;

        const iconMap = {
            delete_invoice: '🚨 លុប/Cancel វិក្កយបត្រ',
            edit_invoice: '✏️ កែប្រែវិក្កយបត្រ',
            reprint_invoice: '🖨️ ព្រីនវិក្កយបត្រឡើងវិញ',
            high_discount: '🏷️ បញ្ចុះតម្លៃលើសកម្រិត',
            cart_remove: '🗑️ ដក/លុបទំនិញពីកន្ត្រក',
            cart_clear: '🧹 លុបកន្ត្រកទាំងមូល'
        };
        const title = iconMap[entry.eventType] || '⚠️ សកម្មភាពសង្ស័យ';
        const shop = window.shopName || 'SKM POS';
        const msg = [
            `🛡️ <b>[ANTI-FRAUD ALERT] ${esc(shop)}</b>`,
            `📌 <b>សកម្មភាព៖</b> ${title}`,
            `👤 <b>បុគ្គលិក៖</b> ${esc(entry.staffName)} (${esc(entry.staffRole)})`,
            entry.amount ? `💵 <b>ទឹកប្រាក់ពាក់ព័ន្ធ៖</b> $${Number(entry.amount).toFixed(2)}` : '',
            `📝 <b>ព័ត៌មានលម្អិត៖</b> ${esc(entry.details)}`,
            `🏢 <b>សាខា៖</b> ${esc(getBranch())}`,
            `🕒 <b>ម៉ោង៖</b> ${esc(entry.date)}`
        ].filter(Boolean).join('\n');

        try {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' })
            });
        } catch (err) {
            console.warn('Anti-Fraud Telegram send error:', err);
        }
    }

    async function persistAuditCloud(entry) {
        if (!window.supabaseClient || !navigator.onLine) return;
        const br = getBranch();
        // 1. Try dedicated append-only pos_audit_logs table (if SQL was run)
        try {
            const { error } = await window.supabaseClient.from('pos_audit_logs').insert([{
                id: entry.id,
                branch_id: br,
                event_type: entry.eventType,
                severity: entry.severity,
                staff_name: entry.staffName,
                staff_role: entry.staffRole,
                amount: Number(entry.amount) || 0,
                details: entry.details,
                meta: entry.meta || {}
            }]);
            if (!error) return;
        } catch (e) {}

        // 2. Graceful fallback to existing pos_history_logs so zero setup is required
        try {
            await window.supabaseClient.from('pos_history_logs').insert([{
                id: entry.id,
                branch_id: br,
                date: entry.date,
                type: 'audit_alert',
                item_name: `[AUDIT:${entry.eventType}]`,
                qty: 0,
                note: `${entry.details} (${entry.staffName}/${entry.staffRole})`
            }]);
        } catch (e) {}
    }

    window.recordAntiFraudEvent = function (eventType, details, amount = 0, severity = 'warning', meta = {}) {
        const pf = getPF();
        if (!pf.antiFraudAudit) return;

        const staff = getStaffInfo();
        const entry = {
            id: 'AUD_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
            timestamp: Date.now(),
            date: typeof window.fDate === 'function' ? window.fDate() : new Date().toLocaleString('km-KH'),
            eventType,
            severity,
            staffName: staff.name,
            staffRole: staff.role,
            amount: Number(amount) || 0,
            details: String(details || ''),
            meta
        };

        const logs = window.getAntiFraudLogs();
        logs.unshift(entry);
        saveAntiFraudLogs(logs);
        persistAuditCloud(entry);

        // Send Telegram alert for high-risk events (or all configured audit events)
        const highRiskTypes = ['delete_invoice', 'edit_invoice', 'reprint_invoice', 'high_discount', 'cart_clear'];
        if (highRiskTypes.includes(eventType) || severity === 'critical') {
            sendAntiFraudTelegram(entry);
        }
    };

    // =========================================================
    // HOOK POS & FINANCE FUNCTIONS CLEANLY (IDEMPOTENT)
    // =========================================================
    function installAuditHooks() {
        // 1. Cart quantity reduction / item removal
        if (typeof window.updateCartQty === 'function' && !window.updateCartQty.__skmAuditHooked) {
            const origUpdate = window.updateCartQty;
            window.updateCartQty = function (id, change) {
                const pf = getPF();
                let removedInfo = null;
                if (pf.antiFraudAudit && Number(change) < 0) {
                    const item = (window.cart || []).find(c => c && c.id === id);
                    if (item) {
                        const nextQty = (parseInt(item.cartQty) || 0) + Number(change);
                        removedInfo = {
                            name: item.name,
                            prevQty: item.cartQty,
                            nextQty: Math.max(0, nextQty),
                            price: parseFloat(item.price) || 0
                        };
                    }
                }
                const res = origUpdate.apply(this, arguments);
                if (removedInfo) {
                    const actionTxt = removedInfo.nextQty <= 0
                        ? `លុប "${removedInfo.name}" ចេញពីកន្ត្រក (ពី ${removedInfo.prevQty} -> 0)`
                        : `បន្ថយចំនួន "${removedInfo.name}" ក្នុងកន្ត្រក (ពី ${removedInfo.prevQty} -> ${removedInfo.nextQty})`;
                    window.recordAntiFraudEvent('cart_remove', actionTxt, removedInfo.price * Math.abs(change), removedInfo.nextQty <= 0 ? 'warning' : 'info', removedInfo);
                }
                return res;
            };
            window.updateCartQty.__skmAuditHooked = true;
        }

        // 2. Manual cart qty reduction / removal
        if (typeof window.setCartQtyManually === 'function' && !window.setCartQtyManually.__skmAuditHooked) {
            const origSetQty = window.setCartQtyManually;
            window.setCartQtyManually = function (id, val) {
                const pf = getPF();
                let before = null;
                if (pf.antiFraudAudit) {
                    const item = (window.cart || []).find(c => c && c.id === id);
                    const nVal = parseInt(val);
                    if (item && (isNaN(nVal) || nVal < (parseInt(item.cartQty) || 0))) {
                        before = { name: item.name, prevQty: item.cartQty, newQty: isNaN(nVal) ? 0 : Math.max(0, nVal), price: parseFloat(item.price) || 0 };
                    }
                }
                const res = origSetQty.apply(this, arguments);
                if (before) {
                    window.recordAntiFraudEvent(
                        'cart_remove',
                        `បន្ថយ/លុប "${before.name}" ដោយដៃ (ពី ${before.prevQty} -> ${before.newQty})`,
                        before.price * Math.max(1, before.prevQty - before.newQty),
                        before.newQty <= 0 ? 'warning' : 'info',
                        before
                    );
                }
                return res;
            };
            window.setCartQtyManually.__skmAuditHooked = true;
        }

        // 3. Clear entire non-empty cart
        if (typeof window.clearCart === 'function' && !window.clearCart.__skmAuditHooked) {
            const origClear = window.clearCart;
            window.clearCart = function () {
                const pf = getPF();
                const snapCount = Array.isArray(window.cart) ? window.cart.length : 0;
                const snapTotal = parseFloat(window.cartFinalUsd) || 0;
                const snapItems = snapCount > 0 ? window.cart.map(c => `${c.name} x${c.cartQty}`).slice(0, 5).join(', ') : '';
                const res = origClear.apply(this, arguments);
                if (pf.antiFraudAudit && snapCount > 0 && (!window.cart || window.cart.length === 0)) {
                    window.recordAntiFraudEvent(
                        'cart_clear',
                        `លុបកន្ត្រកទាំងមូល (${snapCount} មុខ: ${snapItems})`,
                        snapTotal,
                        'critical'
                    );
                }
                return res;
            };
            window.clearCart.__skmAuditHooked = true;
        }

        // 4. High discount alert during checkout
        if (typeof window.checkout === 'function' && !window.checkout.__skmAuditHooked) {
            const origCheckout = window.checkout;
            window.checkout = function () {
                const pf = getPF();
                const discVal = parseFloat(document.getElementById('posDiscount')?.value) || 0;
                const discType = document.getElementById('posDiscountType')?.value || '%';
                const limitPct = parseFloat(window.sysSettings?.antiFraudDiscountLimit) || 15;
                const preSub = parseFloat(window.cartFinalUsd) || 0;
                const cust = document.getElementById('posCustomerName')?.value?.trim() || 'អតិថិជនទូទៅ';
                const res = origCheckout.apply(this, arguments);

                if (pf.antiFraudAudit && discVal > 0) {
                    let effectivePct = discType === '%'
                        ? discVal
                        : ((preSub + discVal) > 0 ? (discVal / (preSub + discVal)) * 100 : 0);
                    if (effectivePct >= limitPct) {
                        const latestInvId = (window.invoices && window.invoices[0]) ? (window.invoices[0].id || '') : '';
                        window.recordAntiFraudEvent(
                            'high_discount',
                            `បញ្ចុះតម្លៃខ្ពស់ ${discType === '%' ? discVal + '%' : '$' + discVal.toFixed(2)} (~${effectivePct.toFixed(1)}% >= កម្រិត ${limitPct}%) លើវិក្កយបត្រ ${latestInvId} (ភ្ញៀវ: ${cust})`,
                            preSub,
                            'critical',
                            { invoiceId: latestInvId, discVal, discType, effectivePct }
                        );
                    }
                }
                return res;
            };
            window.checkout.__skmAuditHooked = true;
        }

        // 5. Invoice deletion / voiding
        if (typeof window.deleteInvoiceRecord === 'function' && !window.deleteInvoiceRecord.__skmAuditHooked) {
            const origDel = window.deleteInvoiceRecord;
            window.deleteInvoiceRecord = function (invId) {
                const pf = getPF();
                const snapInv = (window.invoices || []).find(i => i && String(i.id || i.invoiceNo).toLowerCase() === String(invId).toLowerCase());
                const beforeCount = (window.invoices || []).length;
                const res = origDel.apply(this, arguments);

                if (pf.antiFraudAudit && snapInv) {
                    // Check after confirm modal completes
                    const checker = setInterval(() => {
                        const stillExists = (window.invoices || []).some(i => i && String(i.id || i.invoiceNo).toLowerCase() === String(invId).toLowerCase());
                        if (!stillExists && (window.invoices || []).length < beforeCount) {
                            clearInterval(checker);
                            const amt = parseFloat(snapInv.totalAmount || snapInv.total) || 0;
                            window.recordAntiFraudEvent(
                                'delete_invoice',
                                `លុបវិក្កយបត្រ ${invId} (អតិថិជន: ${snapInv.customerName || snapInv.customer || '-'}, ស្ថានភាព: ${snapInv.status || '-'})`,
                                amt,
                                'critical',
                                { invoiceId: invId }
                            );
                        }
                    }, 400);
                    setTimeout(() => clearInterval(checker), 20000);
                }
                return res;
            };
            window.deleteInvoiceRecord.__skmAuditHooked = true;
        }

        // 6. Invoice edit
        if (typeof window.saveInvoiceChanges === 'function' && !window.saveInvoiceChanges.__skmAuditHooked) {
            const origSaveInv = window.saveInvoiceChanges;
            window.saveInvoiceChanges = async function () {
                const pf = getPF();
                const invId = document.getElementById('editInvId')?.value || '';
                const beforeInv = (window.invoices || []).find(i => i && String(i.id || i.invoiceNo).toLowerCase() === String(invId).toLowerCase());
                const beforeAmt = beforeInv ? (parseFloat(beforeInv.totalAmount || beforeInv.total) || 0) : 0;
                const res = await origSaveInv.apply(this, arguments);
                if (pf.antiFraudAudit && invId) {
                    const afterInv = (window.invoices || []).find(i => i && String(i.id || i.invoiceNo).toLowerCase() === String(invId).toLowerCase());
                    const afterAmt = afterInv ? (parseFloat(afterInv.totalAmount || afterInv.total) || 0) : 0;
                    window.recordAntiFraudEvent(
                        'edit_invoice',
                        `កែប្រែវិក្កយបត្រ ${invId} (តម្លៃពី $${beforeAmt.toFixed(2)} ➔ $${afterAmt.toFixed(2)})`,
                        afterAmt,
                        'critical',
                        { invoiceId: invId, beforeAmt, afterAmt }
                    );
                }
                return res;
            };
            window.saveInvoiceChanges.__skmAuditHooked = true;
        }

        // 7. Invoice reprint
        if (typeof window.reprintInvoice === 'function' && !window.reprintInvoice.__skmAuditHooked) {
            const origReprint = window.reprintInvoice;
            window.reprintInvoice = function () {
                const pf = getPF();
                const invId = window.currentActiveInvoiceId || '';
                const inv = (window.invoices || []).find(i => i && String(i.id || i.invoiceNo).toLowerCase() === String(invId).toLowerCase());
                const res = origReprint.apply(this, arguments);
                if (pf.antiFraudAudit && invId) {
                    const amt = inv ? (parseFloat(inv.totalAmount || inv.total) || 0) : 0;
                    window.recordAntiFraudEvent(
                        'reprint_invoice',
                        `បោះពុម្ពវិក្កយបត្រឡើងវិញ ${invId} (ភ្ញៀវ: ${inv?.customerName || inv?.customer || '-'})`,
                        amt,
                        'warning',
                        { invoiceId: invId }
                    );
                }
                return res;
            };
            window.reprintInvoice.__skmAuditHooked = true;
        }
    }

    // =========================================================
    // ADMIN AUDIT VIEWER MODAL (ADMIN & MANAGER ONLY)
    // =========================================================
    function ensureAuditModal() {
        if (document.getElementById('skmAntiFraudModal')) return;
        const div = document.createElement('div');
        div.id = 'skmAntiFraudModal';
        div.className = 'modal-overlay';
        div.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.68); backdrop-filter:blur(5px); z-index:10050; justify-content:center; align-items:center; padding:16px;';
        div.innerHTML = `
            <div class="modal" style="max-width:880px; width:100%; max-height:90vh; display:flex; flex-direction:column; border-radius:18px; overflow:hidden;">
                <div style="display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid var(--border); background:rgba(239,68,68,0.08);">
                    <div>
                        <h3 style="margin:0; font-size:17px; color:var(--danger);">🛡️ របាយការណ៍ការពារការបន្លំ (Anti-Fraud Audit Log)</h3>
                        <small style="color:var(--text-muted);">កំណត់ត្រាសកម្មភាពហានិភ័យ (លុបទំនិញ, លុប/កែវិក្កយបត្រ, បញ្ចុះតម្លៃខ្ពស់, ព្រីនឡើងវិញ) — បុគ្គលិកមិនអាចលុបបានទេ</small>
                    </div>
                    <button type="button" class="btn btn-outline" style="padding:6px 12px;" onclick="document.getElementById('skmAntiFraudModal').style.display='none'">✕</button>
                </div>
                <div style="padding:14px 20px; display:flex; gap:8px; flex-wrap:wrap; align-items:center; border-bottom:1px solid var(--border);">
                    <input type="text" id="auditSearchInput" class="form-control" placeholder="🔍 ស្វែងរកបុគ្គលិក វិក្កយបត្រ ឬព័ត៌មាន..." style="flex:2; min-width:180px;" oninput="window.renderAntiFraudModal()">
                    <select id="auditTypeFilter" class="form-control" style="flex:1; min-width:150px;" onchange="window.renderAntiFraudModal()">
                        <option value="all">📋 គ្រប់សកម្មភាព</option>
                        <option value="delete_invoice">🚨 លុបវិក្កយបត្រ</option>
                        <option value="edit_invoice">✏️ កែវិក្កយបត្រ</option>
                        <option value="high_discount">🏷️ បញ្ចុះតម្លៃខ្ពស់</option>
                        <option value="reprint_invoice">🖨️ ព្រីនឡើងវិញ</option>
                        <option value="cart_clear">🧹 លុបកន្ត្រកទាំងមូល</option>
                        <option value="cart_remove">🗑️ ដកទំនិញពីកន្ត្រក</option>
                    </select>
                    <button type="button" class="btn btn-outline" style="font-size:12px;" onclick="window.exportAntiFraudCSV()">📥 Export CSV</button>
                    <button type="button" class="btn btn-outline" style="font-size:12px; border-color:#0ea5e9; color:#0ea5e9;" onclick="window.testAntiFraudTelegram()">📲 Test Telegram</button>
                </div>
                <div id="skmAntiFraudSummaryBar" style="padding:10px 20px; display:flex; gap:14px; flex-wrap:wrap; font-size:12.5px; background:rgba(0,0,0,0.03); border-bottom:1px solid var(--border);"></div>
                <div style="overflow:auto; flex:1; padding:14px 20px;">
                    <table style="width:100%; border-collapse:collapse; font-size:12.5px;">
                        <thead>
                            <tr style="border-bottom:2px solid var(--border); text-align:left;">
                                <th style="padding:8px 6px;">ម៉ោង/កាលបរិច្ឆេទ</th>
                                <th style="padding:8px 6px;">ប្រភេទ</th>
                                <th style="padding:8px 6px;">បុគ្គលិក</th>
                                <th style="padding:8px 6px;">ទឹកប្រាក់</th>
                                <th style="padding:8px 6px;">ព័ត៌មានលម្អិត</th>
                            </tr>
                        </thead>
                        <tbody id="skmAntiFraudTableBody"></tbody>
                    </table>
                </div>
            </div>
        `;
        document.body.appendChild(div);
    }

    window.openAntiFraudModal = function () {
        if (window.currentRole !== 'admin' && window.currentRole !== 'manager') {
            if (typeof window.ksMsg === 'function') window.ksMsg('❌ មានតែ Admin ឬ Manager ប៉ុណ្ណោះដែលអាចមើលរបាយការណ៍ការពារការបន្លំបាន!', 'គ្មានសិទ្ធិ');
            return;
        }
        ensureAuditModal();
        document.getElementById('skmAntiFraudModal').style.display = 'flex';
        window.renderAntiFraudModal();
    };

    window.renderAntiFraudModal = function () {
        const tbody = document.getElementById('skmAntiFraudTableBody');
        const sumBar = document.getElementById('skmAntiFraudSummaryBar');
        if (!tbody) return;

        const q = (document.getElementById('auditSearchInput')?.value || '').toLowerCase().trim();
        const fType = document.getElementById('auditTypeFilter')?.value || 'all';
        const allLogs = window.getAntiFraudLogs();
        const filtered = allLogs.filter(l => {
            if (fType !== 'all' && l.eventType !== fType) return false;
            if (q && !`${l.staffName} ${l.details} ${l.date} ${l.eventType}`.toLowerCase().includes(q)) return false;
            return true;
        });

        const critCount = allLogs.filter(l => l.severity === 'critical').length;
        const delCount = allLogs.filter(l => l.eventType === 'delete_invoice').length;
        const discCount = allLogs.filter(l => l.eventType === 'high_discount').length;
        if (sumBar) {
            sumBar.innerHTML = `
                <span>📊 សរុប៖ <b>${allLogs.length}</b> កំណត់ត្រា</span>
                <span style="color:var(--danger);">🚨 កម្រិតធ្ងន់៖ <b>${critCount}</b></span>
                <span style="color:#f59e0b;">🗑️ លុបវិក្កយបត្រ៖ <b>${delCount}</b></span>
                <span style="color:#8b5cf6;">🏷️ បញ្ចុះតម្លៃខ្ពស់៖ <b>${discCount}</b></span>
            `;
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:28px; color:var(--text-muted);">✅ មិនទាន់មានកំណត់ត្រាសកម្មភាពហានិភ័យទេ</td></tr>`;
            return;
        }

        const badgeMap = {
            delete_invoice: '<span style="background:rgba(239,68,68,0.15); color:#ef4444; padding:2px 8px; border-radius:6px; font-weight:800;">🚨 លុបវិក្កយបត្រ</span>',
            edit_invoice: '<span style="background:rgba(245,158,11,0.15); color:#d97706; padding:2px 8px; border-radius:6px; font-weight:800;">✏️ កែវិក្កយបត្រ</span>',
            high_discount: '<span style="background:rgba(139,92,246,0.15); color:#7c3aed; padding:2px 8px; border-radius:6px; font-weight:800;">🏷️ បញ្ចុះតម្លៃខ្ពស់</span>',
            reprint_invoice: '<span style="background:rgba(14,165,233,0.15); color:#0284c7; padding:2px 8px; border-radius:6px; font-weight:800;">🖨️ ព្រីនឡើងវិញ</span>',
            cart_clear: '<span style="background:rgba(239,68,68,0.15); color:#ef4444; padding:2px 8px; border-radius:6px; font-weight:800;">🧹 លុបកន្ត្រក</span>',
            cart_remove: '<span style="background:rgba(100,116,139,0.15); color:#475569; padding:2px 8px; border-radius:6px; font-weight:800;">🗑️ ដកទំនិញ</span>'
        };

        tbody.innerHTML = filtered.slice(0, 200).map(l => `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:8px 6px; white-space:nowrap; font-size:11.5px; color:var(--text-muted);">${esc(l.date)}</td>
                <td style="padding:8px 6px; white-space:nowrap;">${badgeMap[l.eventType] || esc(l.eventType)}</td>
                <td style="padding:8px 6px;"><b>${esc(l.staffName)}</b> <small style="color:var(--text-muted);">(${esc(l.staffRole)})</small></td>
                <td style="padding:8px 6px; font-weight:800; color:var(--danger);">${l.amount > 0 ? '$' + Number(l.amount).toFixed(2) : '-'}</td>
                <td style="padding:8px 6px;">${esc(l.details)}</td>
            </tr>
        `).join('');
    };

    window.exportAntiFraudCSV = function () {
        const logs = window.getAntiFraudLogs();
        if (!logs.length) return window.showToast && window.showToast('គ្មានទិន្នន័យដើម្បី Export ទេ!', true);
        let csv = '\uFEFFDate,EventType,Severity,Staff,Role,AmountUSD,Details\n';
        logs.forEach(l => {
            csv += `"${(l.date || '').replace(/"/g, '""')}","${l.eventType}","${l.severity}","${(l.staffName || '').replace(/"/g, '""')}","${l.staffRole}","${Number(l.amount || 0).toFixed(2)}","${(l.details || '').replace(/"/g, '""')}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `SKM_AntiFraud_Audit_${getBranch()}_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    window.testAntiFraudTelegram = async function () {
        const pf = getPF();
        if (!pf.antiFraudTelegram) {
            return window.showToast && window.showToast('⚠️ សូមបើក "បាញ់សារ Telegram ការពារការបន្លំ" ក្នុង Admin Settings -> Tab 9 ជាមុនសិន!', true);
        }
        await sendAntiFraudTelegram({
            eventType: 'delete_invoice',
            staffName: getStaffInfo().name,
            staffRole: getStaffInfo().role,
            amount: 25.0,
            details: 'សារសាកល្បងប្រព័ន្ធ Anti-Fraud Telegram Alert ដំណើរការ ១០០%!',
            date: typeof window.fDate === 'function' ? window.fDate() : new Date().toLocaleString('km-KH')
        });
        if (typeof window.showToast === 'function') window.showToast('✅ បានផ្ញើសារសាកល្បង Anti-Fraud ចូល Telegram!');
    };

    // =========================================================
    // INJECT TOOLBAR BUTTONS ONLY WHEN ENABLED IN ADMIN SETTINGS
    // =========================================================
    window.syncAntiFraudButtons = function () {
        const pf = getPF();
        const isAllowed = window.currentRole === 'admin' || window.currentRole === 'manager';
        const showBtn = Boolean(pf.antiFraudAudit && isAllowed);

        const dashBar = document.querySelector('#tab-dashboard .toolbar');
        if (dashBar) {
            let btn = document.getElementById('skmAntiFraudDashBtn');
            if (showBtn) {
                if (!btn) {
                    btn = document.createElement('button');
                    btn.id = 'skmAntiFraudDashBtn';
                    btn.type = 'button';
                    btn.className = 'btn btn-outline';
                    btn.style.cssText = 'border-color:#ef4444; color:#ef4444; font-size:12px;';
                    btn.onclick = window.openAntiFraudModal;
                    dashBar.appendChild(btn);
                }
                const cnt = window.getAntiFraudLogs().length;
                btn.innerHTML = `🛡️ Anti-Fraud Log (${cnt})`;
                btn.style.display = 'inline-flex';
            } else if (btn) {
                btn.style.display = 'none';
            }
        }
    };

    function bootAntiFraud() {
        installAuditHooks();
        window.syncAntiFraudButtons();
        if (typeof window.applyPermissions === 'function' && !window.applyPermissions.__skmAuditSynced) {
            const origPerm = window.applyPermissions;
            window.applyPermissions = function () {
                const r = origPerm.apply(this, arguments);
                window.syncAntiFraudButtons();
                return r;
            };
            window.applyPermissions.__skmAuditSynced = true;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(bootAntiFraud, 350));
    } else {
        setTimeout(bootAntiFraud, 350);
    }
})();
