/**
 * finance.js - គ្រប់គ្រងវិក្កយបត្រ ការចំណាយ និងការទូទាត់ប្រាក់ (Invoices, Expenses & Settle Debt)
 */

// ========================================================
// 🌟 ផ្នែកទី ១៖ គ្រប់គ្រងវិក្កយបត្រ (Invoices & Debt)
// ========================================================

// 🌟 ១. បង្ហាញបញ្ជីវិក្កយបត្រ & ការកុម្ម៉ង់ (Render Invoices Table)
window.renderUnpaid = function() {
    const tableBody = document.getElementById('unpaidTable') || document.querySelector('#mainUnpaidTable tbody');
    if (!tableBody) return;

    let invoices = window.invoices || [];
    if (invoices.length === 0) {
        try {
            invoices = JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
            window.invoices = invoices;
        } catch(e) { invoices = []; }
    }

    invoices.sort((a, b) => {
        let timeA = a.timestamp || new Date(a.date || a.createdAt || 0).getTime();
        let timeB = b.timestamp || new Date(b.date || b.createdAt || 0).getTime();
        return timeB - timeA;
    });

    const searchVal = (document.getElementById('searchUnpaid')?.value || '').toLowerCase().trim();
    const dateFrom = document.getElementById('invoiceDateFrom')?.value;
    const dateTo = document.getElementById('invoiceDateTo')?.value;

    tableBody.innerHTML = '';
    let totalPaid = 0;
    let totalUnpaid = 0;

    invoices.forEach((inv, index) => {
        if (!inv) return;
        
        const invId = String(inv.id || inv.invoiceNo || `ORD-${index}`);
        const custName = inv.customerName || inv.customer || 'អតិថិជនទូទៅ';
        const custPhone = inv.customerPhone || inv.phone || '';
        const dateStr = inv.date || inv.createdAt || 'N/A';
        const seller = inv.seller || inv.cashier || 'N/A';
        const status = (inv.status || 'unpaid').toLowerCase();
        
        const totalAmount = parseFloat(inv.totalAmount || inv.total || 0);
        let paidAmount = parseFloat(inv.paidUsd || inv.paidAmount || 0);
        if (status === 'paid') paidAmount = totalAmount;
        const remainingAmount = Math.max(0, totalAmount - paidAmount);

        if (searchVal) {
            const combinedText = `${invId} ${custName} ${custPhone} ${seller}`.toLowerCase();
            if (!combinedText.includes(searchVal)) return;
        }

        if (dateFrom) {
            const dFrom = new Date(dateFrom).getTime();
            const dCurrent = new Date(dateStr.split(' ')[0]).getTime();
            if (!isNaN(dCurrent) && dCurrent < dFrom) return;
        }

        if (dateTo) {
            const dTo = new Date(dateTo).getTime();
            const dCurrent = new Date(dateStr.split(' ')[0]).getTime();
            if (!isNaN(dCurrent) && dCurrent > dTo) return;
        }

        if (status === 'paid') {
            totalPaid += totalAmount;
        } else {
            totalPaid += paidAmount;
            totalUnpaid += remainingAmount;
        }

        let itemsSummary = '';
        if (Array.isArray(inv.items)) {
            itemsSummary = inv.items.map(it => `${it.name || it.title} (x${it.qty || it.cartQty || 1})`).join(', ');
        } else {
            itemsSummary = inv.itemsSummary || 'ទំនិញចម្រុះ';
        }

        let statusBadge = '';
        if (status === 'paid') {
            statusBadge = '<span class="badge" style="background:rgba(16,185,129,0.15); color:#10b981; padding:4px 8px; border-radius:12px; font-weight:bold;">ទូទាត់រួច</span>';
        } else if (status === 'ready') {
            statusBadge = '<span class="badge" style="background:rgba(56,189,248,0.15); color:#0284c7; padding:4px 8px; border-radius:12px; font-weight:bold;">រួចរាល់</span>';
        } else if (status === 'preorder') {
            statusBadge = '<span class="badge" style="background:rgba(139,92,246,0.15); color:#8b5cf6; padding:4px 8px; border-radius:12px; font-weight:bold;">កក់មុន</span>';
        } else {
            statusBadge = '<span class="badge" style="background:rgba(245,158,11,0.15); color:#f59e0b; padding:4px 8px; border-radius:12px; font-weight:bold;">រង់ចាំទូទាត់</span>';
        }

        let actionButtons = `
            <div style="display: flex; gap: 4px; justify-content: center; align-items: center; flex-wrap: wrap;">
                <button class="btn btn-outline" style="padding: 4px 7px; font-size: 11px;" onclick="window.viewInvoiceDetails('${invId}')" title="មើលលម្អិត">👁️ មើល</button>
                <button class="btn btn-warning" style="padding: 4px 7px; font-size: 11px;" onclick="window.openInvoiceEditModal('${invId}')" title="កែប្រែវិក្កយបត្រ ឬការកុម្ម៉ង់">✏️ កែប្រែ</button>
        `;

        if (status !== 'paid') {
            actionButtons += `
                <button class="btn btn-success" style="padding: 4px 7px; font-size: 11px;" onclick="window.openDebtPaymentModal('${invId}')" title="ទូទាត់ប្រាក់">💸 ទូទាត់</button>
            `;
            if (status !== 'ready') {
                actionButtons += `
                    <button class="btn btn-primary" style="padding: 4px 7px; font-size: 11px; background:#0284c7; color: #fff; border: none;" onclick="window.notifyCustomerOrderDone('${invId}')" title="ប្រាប់ភ្ញៀវថារួចរាល់">📢 រួចរាល់</button>
                `;
            }
        }

        actionButtons += `
                <button class="btn btn-danger" style="padding: 4px 7px; font-size: 11px; background:#ef4444; color: #fff; border: none;" onclick="window.deleteInvoiceRecord('${invId}')" title="លុបចោល">🗑️ លុប</button>
            </div>
        `;

        const row = document.createElement('tr');
        row.setAttribute('data-paid', paidAmount);
        row.setAttribute('data-unpaid', remainingAmount);
        row.innerHTML = `
            <td style="font-family: monospace; font-weight: bold; color: var(--primary);">${invId}</td>
            <td style="font-size: 12px;">${dateStr}</td>
            <td><b>${custName}</b><br><small style="color:var(--text-muted);">${custPhone}</small></td>
            <td style="font-size: 12px; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemsSummary}">${itemsSummary}</td>
            <td>
                <b>$${totalAmount.toFixed(2)}</b>
                ${remainingAmount > 0 && status !== 'paid' ? `<br><small style="color:var(--danger);">ខ្វះ៖ $${remainingAmount.toFixed(2)}</small>` : ''}
            </td>
            <td>${statusBadge}</td>
            <td><small>${seller}</small></td>
            <td style="text-align: center;">${actionButtons}</td>
        `;
        tableBody.appendChild(row);
    });

    const paidEl = document.getElementById('summaryInvoicePaid');
    const unpaidEl = document.getElementById('summaryInvoiceUnpaid');
    if (paidEl) paidEl.innerText = `$${totalPaid.toFixed(2)}`;
    if (unpaidEl) unpaidEl.innerText = `$${totalUnpaid.toFixed(2)}`;
};

// 🌟 ២. មុខងារប្រាប់ភ្ញៀវថាកម្ម៉ង់រួចរាល់
window.notifyCustomerOrderDone = async function(invId) {
    let invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const invIndex = invoices.findIndex(i => String(i.id || i.invoiceNo) === String(invId));

    if (invIndex === -1) {
        alert("❌ រកមិនឃើញវិក្កយបត្រនេះទេ!");
        return;
    }

    const inv = invoices[invIndex];
    inv.status = 'ready'; 
    invoices[invIndex] = inv;
    
    window.invoices = invoices;
    localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(invoices));

    const shopName = window.shopName || localStorage.getItem(window.getBranchKey('shop_name')) || 'ហាងរបស់យើង';
    const message = `🎉 សួស្តី ${inv.customerName || inv.customer || 'អតិថិជន'}!\n\nការកុម្ម៉ង់លេខ [${invId}] របស់អ្នកនៅហាង "${shopName}" ត្រូវបានរៀបចំរួចរាល់ហើយ! 🛍️\n\n💵 សរុបទឹកប្រាក់៖ $${parseFloat(inv.totalAmount || inv.total || 0).toFixed(2)}\nសូមអញ្ជើញមកទទួលទំនិញ ឬរង់ចាំការដឹកជញ្ជូន។ អរគុណច្រើន! 🙏`;

    try {
        const sysSettings = window.sysSettings || JSON.parse(localStorage.getItem(window.getBranchKey('sys_settings'))) || {};
        const botToken = sysSettings.botToken || window.telegramBotToken || '';
        const chatId = inv.telegramChatId || window.telegramChatId || sysSettings.chatId || '';

        if (botToken && chatId) {
            fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: message })
            });
        }
    } catch(e) { console.warn("Telegram error:", e); }

    setTimeout(() => { if (typeof window.saveData === 'function') window.saveData(window.userAccounts); }, 100);

    if (typeof window.showToast === 'function') window.showToast(`✅ ការកុម្ម៉ង់ ${invId} បានរៀបចំរួចរាល់!`);
    else alert(`✅ ការកុម្ម៉ង់ ${invId} បានរៀបចំរួចរាល់!`);

    window.renderUnpaid();
};

// 🌟 ៣. បើកផ្ទាំងទូទាត់ប្រាក់ជំពាក់
window.currentPayingInvoiceId = null;

window.openDebtPaymentModal = function(invId) {
    const invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const inv = invoices.find(i => String(i.id || i.invoiceNo) === String(invId));

    if (!inv) return alert("❌ រកមិនឃើញវិក្កយបត្រនេះទេ!");

    window.currentPayingInvoiceId = invId;
    const modal = document.getElementById('debtPaymentModal');
    if (!modal) return alert("❌ រកមិនឃើញផ្ទាំង Modal ទូទាត់ប្រាក់!");

    const total = parseFloat(inv.totalAmount || inv.total || 0);
    const paid = parseFloat(inv.paidUsd || inv.paidAmount || (inv.status === 'paid' ? total : 0));
    const remaining = Math.max(0, total - paid);

    document.getElementById('debtTotalDisplay').innerText = `$${total.toFixed(2)}`;
    document.getElementById('debtPaidDisplay').innerText = `$${paid.toFixed(2)}`;
    document.getElementById('debtRemainingDisplay').innerText = `$${remaining.toFixed(2)}`;
    document.getElementById('debtPayUsd').value = remaining.toFixed(2);
    document.getElementById('debtPayRiel').value = '';

    window.calculateDebtChange();
    modal.style.display = 'flex';
};

window.calculateDebtChange = function() {
    const invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const inv = invoices.find(i => String(i.id || i.invoiceNo) === String(window.currentPayingInvoiceId));
    if (!inv) return;

    const total = parseFloat(inv.totalAmount || inv.total || 0);
    const paid = parseFloat(inv.paidUsd || inv.paidAmount || 0);
    const remaining = Math.max(0, total - paid);

    const payUsd = parseFloat(document.getElementById('debtPayUsd')?.value) || 0;
    const payRiel = parseFloat(document.getElementById('debtPayRiel')?.value) || 0;
    const rate = parseFloat(document.getElementById('globalExchangeRate')?.value) || inv.rate || window.cartRate || 4000;

    const totalPaidNow = payUsd + (payRiel / rate);
    const changeUsd = totalPaidNow - remaining;

    const changeDisplay = document.getElementById('debtChangeDisplay');
    if (changeDisplay) {
        if (changeUsd >= 0) {
            changeDisplay.style.color = 'var(--primary)';
            changeDisplay.innerText = `$${changeUsd.toFixed(2)} | ${(changeUsd * rate).toLocaleString()} ៛`;
        } else {
            changeDisplay.style.color = 'var(--danger)';
            changeDisplay.innerText = `នៅខ្វះ $${Math.abs(changeUsd).toFixed(2)}`;
        }
    }
};

window.processDebtPayment = async function() {
    if (!window.currentPayingInvoiceId) return;

    let invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const invIndex = invoices.findIndex(i => String(i.id || i.invoiceNo) === String(window.currentPayingInvoiceId));

    if (invIndex === -1) return;

    const inv = invoices[invIndex];
    const total = parseFloat(inv.totalAmount || inv.total || 0);
    const prevPaid = parseFloat(inv.paidUsd || inv.paidAmount || 0);
    
    const payUsdText = document.getElementById('debtPayUsd')?.value;
    const payRielText = document.getElementById('debtPayRiel')?.value;
    let payUsd = parseFloat(payUsdText) || 0;
    let payRiel = parseFloat(payRielText) || 0;
    const rate = parseFloat(document.getElementById('globalExchangeRate')?.value) || inv.rate || window.cartRate || 4000;

    if (!payUsdText && !payRielText) payUsd = Math.max(0, total - prevPaid);

    const totalPaidNow = payUsd + (payRiel / rate);
    if (totalPaidNow <= 0) return alert("⚠️ សូមបញ្ចូលចំនួនប្រាក់ដែលត្រូវទូទាត់!");

    const newPaid = prevPaid + totalPaidNow;
    inv.paidUsd = newPaid >= total ? total : newPaid;
    inv.paidAmount = inv.paidUsd;
    inv.remainingAmount = Math.max(0, total - inv.paidUsd);

    if (inv.paidUsd >= (total - 0.01)) inv.status = 'paid';

    invoices[invIndex] = inv;
    window.invoices = invoices;
    localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(invoices));

    if (typeof window.logAction === 'function') {
        window.logAction('update', inv.customer || inv.customerName, 0, `បានទូទាត់ប្រាក់ ${totalPaidNow.toFixed(2)}$ សម្រាប់វិក្កយបត្រ ${inv.id}`, window.activeUser);
    }

    setTimeout(() => { if (typeof window.saveData === 'function') window.saveData(window.userAccounts); }, 100);

    document.getElementById('debtPaymentModal').style.display = 'none';
    if(typeof window.ksMsg === 'function') window.ksMsg("✅ បានកត់ត្រាការទូទាត់ប្រាក់ជោគជ័យ!", "ជោគជ័យ");
    else alert("✅ បានកត់ត្រាការទូទាត់ប្រាក់ជោគជ័យ!");
    
    window.renderUnpaid();
    if(typeof window.renderCustomers === 'function') window.renderCustomers();
};

// 🌟 ៤. បើកផ្ទាំងកែប្រែវិក្កយបត្រ (Edit Invoice Modal)
window.currentEditingInvoice = null;

window.openInvoiceEditModal = function(invId) {
    let invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const inv = invoices.find(i => String(i.id || i.invoiceNo) === String(invId));

    if (!inv) return alert("❌ រកមិនឃើញវិក្កយបត្រនេះទេ!");

    window.currentEditingInvoice = JSON.parse(JSON.stringify(inv));

    const modal = document.getElementById('invoiceEditModal');
    if (!modal) return alert("❌ រកមិនឃើញផ្ទាំង Modal កែប្រែ!");

    document.getElementById('editInvId').value = invId;
    document.getElementById('editInvName').value = inv.customer || inv.customerName || '';
    document.getElementById('editInvPhone').value = inv.phone || inv.customerPhone || '';

    const addSelect = document.getElementById('editInvAddItemSelect');
    if (addSelect) {
        let products = window.inventory || JSON.parse(localStorage.getItem(window.getBranchKey('inv_pro'))) || [];
        addSelect.innerHTML = '<option value="">-- ជ្រើសរើសទំនិញបន្ថែម --</option>';
        products.forEach(p => {
            if (p && p.qty > 0) addSelect.innerHTML += `<option value="${p.id}">${p.name} ($${parseFloat(p.price || 0).toFixed(2)} | ស្តុក: ${p.qty})</option>`;
        });
    }

    window.renderEditingInvoiceItems();
    modal.style.display = 'flex';
};

window.renderEditingInvoiceItems = function() {
    const listBody = document.getElementById('editInvItemsList');
    const totalPreview = document.getElementById('editInvTotalPreview');
    if (!listBody || !window.currentEditingInvoice) return;

    listBody.innerHTML = '';
    let grandTotal = 0;
    const items = window.currentEditingInvoice.items || [];

    if (items.length === 0) listBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">មិនមានទំនិញទេ</td></tr>';

    items.forEach((it, idx) => {
        const price = parseFloat(it.price || 0);
        const qty = parseInt(it.cartQty || it.qty || it.quantity || 1);
        const subtotal = price * qty;
        grandTotal += subtotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><b>${it.name || it.title}</b><br><small style="color:#888;">$${price.toFixed(2)}</small></td>
            <td style="text-align: center;">
                <input type="number" min="1" value="${qty}" class="form-control" style="width: 70px; text-align: center; margin: auto;" onchange="window.updateEditInvoiceItemQty(${idx}, this.value)">
            </td>
            <td style="text-align: right;">$${price.toFixed(2)}</td>
            <td style="text-align: right; font-weight: bold; color: var(--success);">$${subtotal.toFixed(2)}</td>
            <td style="text-align: center;"><button class="btn btn-danger" style="padding: 4px 8px; font-size: 12px; border-radius:4px;" onclick="window.removeEditInvoiceItem(${idx})">🗑️</button></td>
        `;
        listBody.appendChild(tr);
    });

    window.currentEditingInvoice.totalAmount = grandTotal;
    window.currentEditingInvoice.total = grandTotal;
    if (totalPreview) totalPreview.innerText = `$${grandTotal.toFixed(2)}`;
};

window.updateEditInvoiceItemQty = function(idx, newQty) {
    if (!window.currentEditingInvoice || !window.currentEditingInvoice.items[idx]) return;
    const val = parseInt(newQty) || 1;
    
    if (window.inventory) {
        const item = window.currentEditingInvoice.items[idx];
        const realItem = window.inventory.find(i => i.id === item.id);
        if (realItem && val > realItem.qty) {
            alert('⚠️ ស្តុកមិនគ្រប់គ្រាន់ទេ!');
            window.renderEditingInvoiceItems();
            return;
        }
    }

    window.currentEditingInvoice.items[idx].cartQty = val > 0 ? val : 1;
    window.currentEditingInvoice.items[idx].qty = val > 0 ? val : 1;
    window.renderEditingInvoiceItems();
};

window.removeEditInvoiceItem = function(idx) {
    if (!window.currentEditingInvoice) return;
    window.currentEditingInvoice.items.splice(idx, 1);
    window.renderEditingInvoiceItems();
};

window.addItemToEditingInvoice = function() {
    const select = document.getElementById('editInvAddItemSelect');
    if (!select || !select.value) return;

    let products = window.inventory || JSON.parse(localStorage.getItem(window.getBranchKey('inv_pro'))) || [];
    const p = products.find(prod => String(prod.id) === String(select.value));
    if (!p || p.qty <= 0) return alert("⚠️ ទំនិញនេះអស់ពីស្តុកហើយ!");

    if (!window.currentEditingInvoice.items) window.currentEditingInvoice.items = [];
    
    const existing = window.currentEditingInvoice.items.find(i => String(i.id) === String(p.id));
    if (existing) {
        existing.cartQty = (parseInt(existing.cartQty || existing.qty) || 1) + 1;
        existing.qty = existing.cartQty;
    } else {
        window.currentEditingInvoice.items.push({ ...p, cartQty: 1, qty: 1 });
    }

    select.value = '';
    window.renderEditingInvoiceItems();
};

window.closeInvoiceEditModal = function() {
    const modal = document.getElementById('invoiceEditModal');
    if (modal) modal.style.display = 'none';
    window.currentEditingInvoice = null;
};

window.saveInvoiceChanges = async function() {
    if (!window.currentEditingInvoice) return;
    if (window.currentEditingInvoice.items.length === 0) return alert("⚠️ វិក្កយបត្រត្រូវតែមានទំនិញយ៉ាងហោចណាស់១!");

    let invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const invId = document.getElementById('editInvId').value;
    const invIndex = invoices.findIndex(i => String(i.id || i.invoiceNo) === String(invId));

    if (invIndex === -1) return alert("❌ រកមិនឃើញវិក្កយបត្រដើម!");

    const newName = document.getElementById('editInvName').value.trim() || 'អតិថិជនទូទៅ';
    const newPhone = document.getElementById('editInvPhone').value.trim() || '';

    window.currentEditingInvoice.customer = newName;
    window.currentEditingInvoice.customerName = newName;
    window.currentEditingInvoice.phone = newPhone;
    window.currentEditingInvoice.customerPhone = newPhone;

    invoices[invIndex] = window.currentEditingInvoice;
    window.invoices = invoices;

    localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(invoices));

    if (typeof window.setAutoRegisterCustomer === 'function') window.setAutoRegisterCustomer(newName, newPhone);
    setTimeout(() => { if (typeof window.saveData === 'function') window.saveData(window.userAccounts); }, 100);

    if(typeof window.ksMsg === 'function') window.ksMsg("✅ វិក្កយបត្រត្រូវបានកែប្រែជោគជ័យ!", "ជោគជ័យ");
    else alert("✅ វិក្កយបត្រត្រូវបានកែប្រែជោគជ័យ!");
    
    window.closeInvoiceEditModal();
    window.renderUnpaid();
};

window.deleteInvoiceRecord = async function(invId) {
    if (!confirm(`⚠️ តើអ្នកពិតជាចង់លុបវិក្កយបត្រ [${invId}] និងបង្វិលទំនិញចូលស្តុកវិញមែនទេ?`)) return;

    let invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const invIndex = invoices.findIndex(i => String(i.id || i.invoiceNo) === String(invId));
    
    if (invIndex !== -1) {
        const inv = invoices[invIndex];
        if (inv.items && Array.isArray(inv.items) && window.inventory) {
            inv.items.forEach(item => {
                const realItem = window.inventory.find(p => p.id === item.id);
                if (realItem) realItem.qty += (item.cartQty || item.qty || 1);
            });
        }
        
        invoices.splice(invIndex, 1);
        window.invoices = invoices;
        localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(invoices));

        setTimeout(() => { if (typeof window.saveData === 'function') window.saveData(window.userAccounts); }, 100);

        if(typeof window.ksMsg === 'function') window.ksMsg("✅ បានលុបវិក្កយបត្ររួចរាល់!", "ជោគជ័យ");
        else alert("✅ បានលុបវិក្កយបត្ររួចរាល់!");
        
        window.renderUnpaid();
        if(typeof window.renderInventory === 'function') window.renderInventory();
    }
};

window.viewInvoiceDetails = function(invId) {
    const invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const inv = invoices.find(i => String(i.id || i.invoiceNo) === String(invId));

    if (!inv) return alert("❌ រកមិនឃើញវិក្កយបត្រនេះទេ!");

    const modal = document.getElementById('invoiceViewModal');
    const captureArea = document.getElementById('invoiceViewContent');
    if (!modal || !captureArea) return alert("❌ រកមិនឃើញផ្ទាំង Modal មើលវិក្កយបត្រ!");

    document.getElementById('viewShopName').innerText = window.shopName || localStorage.getItem(window.getBranchKey('shop_name')) || 'SKM INTEGRATE';
    document.getElementById('viewInvoiceDate').innerText = `កាលបរិច្ឆេទ៖ ${inv.date || inv.createdAt || 'N/A'}`;
    document.getElementById('viewInvoiceIdDisplay').innerText = `លេខវិក្កយបត្រ៖ ${invId}`;
    
    let shopContact = document.getElementById('viewShopContact');
    if(shopContact && (window.shopPhone || window.shopAddress)) {
        shopContact.innerHTML = `${window.shopPhone ? `Tel: ${window.shopPhone}<br>` : ''}${window.shopAddress ? window.shopAddress : ''}`;
    }

    let itemsHtml = `<table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;"><thead><tr style="border-bottom: 1px dashed #000;"><th style="text-align: left; padding: 4px 0;">ទំនិញ</th><th style="text-align: center; padding: 4px 0;">ចំនួន</th><th style="text-align: right; padding: 4px 0;">តម្លៃ</th><th style="text-align: right; padding: 4px 0;">សរុប</th></tr></thead><tbody>`;

    (inv.items || []).forEach(it => {
        const p = parseFloat(it.price || 0);
        const q = parseInt(it.cartQty || it.qty || it.quantity || 1);
        itemsHtml += `<tr style="border-bottom: 1px dotted #ccc;"><td style="padding: 4px 0;">${it.name || it.title}</td><td style="text-align: center; padding: 4px 0;">${q}</td><td style="text-align: right; padding: 4px 0;">$${p.toFixed(2)}</td><td style="text-align: right; padding: 4px 0;">$${(p * q).toFixed(2)}</td></tr>`;
    });

    const total = parseFloat(inv.totalAmount || inv.total || 0);
    const paid = parseFloat(inv.paidUsd || inv.paidAmount || 0);
    const remaining = Math.max(0, total - paid);

    itemsHtml += `</tbody></table><div style="border-top: 1px dashed #000; margin-top: 10px; padding-top: 8px; text-align: right;"><div style="font-size: 16px; font-weight: bold;">សរុបប្រាក់៖ $${total.toFixed(2)}</div>`;
    
    if (inv.status !== 'paid' && paid > 0) {
        itemsHtml += `<div style="font-size: 13px; margin-top: 4px;">បានទូទាត់៖ $${paid.toFixed(2)}</div><div style="font-size: 13px; font-weight: bold; color: red;">នៅខ្វះ៖ $${remaining.toFixed(2)}</div>`;
    }

    itemsHtml += `<div style="font-size: 12px; color: #555; margin-top: 8px; text-align: left;">អតិថិជន៖ ${inv.customerName || inv.customer || 'ទូទៅ'} (${inv.customerPhone || inv.phone || '-'})</div><div style="font-size: 12px; color: #555; text-align: left;">អ្នកលក់៖ ${inv.seller || inv.cashier || 'N/A'}</div></div>`;

    captureArea.innerHTML = itemsHtml;
    modal.style.display = 'flex';
};

window.closeInvoiceViewModal = function() {
    const modal = document.getElementById('invoiceViewModal');
    if (modal) modal.style.display = 'none';
};

window.exportInvoicesCSV = function() {
    const invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    if (invoices.length === 0) return alert("⚠️ គ្មានទិន្នន័យវិក្កយបត្រសម្រាប់ Export ទេ!");

    let csvContent = "\uFEFFលេខវិក្កយបត្រ,កាលបរិច្ឆេទ,អតិថិជន,លេខទូរស័ព្ទ,សរុបទឹកប្រាក់,ស្ថានភាព,អ្នកលក់\n";
    invoices.forEach(inv => {
        const id = inv.id || inv.invoiceNo || '';
        const d = inv.date || inv.createdAt || '';
        const c = `"${(inv.customerName || inv.customer || '').replace(/"/g, '""')}"`;
        const p = `"${(inv.customerPhone || inv.phone || '').replace(/"/g, '""')}"`;
        const tot = parseFloat(inv.totalAmount || inv.total || 0).toFixed(2);
        const st = inv.status || 'unpaid';
        const s = `"${(inv.seller || inv.cashier || '').replace(/"/g, '""')}"`;
        csvContent += `${id},${d},${c},${p},${tot},${st},${s}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const branchId = window.SHOP_BRANCH_ID || 'branch_1';
    link.download = `invoices_${branchId}_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
};

// ========================================================
// 🌟 ផ្នែកទី ២៖ គ្រប់គ្រងការចំណាយ (Expense Management)
// ========================================================

window.openExpenseModal = function() {
    document.getElementById('expId').value = '';
    document.getElementById('expCategory').value = 'ទិញសម្ភារៈ/ស្តុក';
    document.getElementById('expAmount').value = '';
    document.getElementById('expNote').value = '';
    
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const dateInput = document.getElementById('expDate');
    if(dateInput) dateInput.value = now.toISOString().slice(0, 16);
    
    document.getElementById('expenseModal').style.display = 'flex';
};

window.closeExpenseModal = function() {
    document.getElementById('expenseModal').style.display = 'none';
};

// 🌟 មុខងារថ្មី៖ បើកផ្ទាំងកែប្រែចំណាយ
window.editExpense = function(id) {
    let expenses = window.expenses || JSON.parse(localStorage.getItem(window.getBranchKey('expenses_pro'))) || [];
    const exp = expenses.find(e => String(e.id) === String(id));
    
    if (!exp) return alert("❌ រកមិនឃើញទិន្នន័យចំណាយនេះទេ!");

    document.getElementById('expId').value = exp.id;
    document.getElementById('expCategory').value = exp.category || 'ទិញសម្ភារៈ/ស្តុក';
    document.getElementById('expAmount').value = exp.amount || '';
    document.getElementById('expNote').value = exp.note || '';
    
    const dateInput = document.getElementById('expDate');
    if(dateInput && exp.timestamp) {
        const d = new Date(exp.timestamp);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        dateInput.value = d.toISOString().slice(0, 16);
    }
    
    document.getElementById('expenseModal').style.display = 'flex';
};

// 🌟 មុខងាររក្សាទុកទិន្នន័យចំណាយ (ទាំងការបង្កើតថ្មី និងកែប្រែចាស់)
window.saveExpense = async function() {
    const id = document.getElementById('expId').value;
    const cat = document.getElementById('expCategory').value;
    const amount = parseFloat(document.getElementById('expAmount').value);
    const note = document.getElementById('expNote').value.trim();
    const dateVal = document.getElementById('expDate') ? document.getElementById('expDate').value : '';

    if (!amount || amount <= 0) {
        if(typeof window.ksMsg === 'function') window.ksMsg('សូមបញ្ចូលទឹកប្រាក់ចំណាយអោយបានត្រឹមត្រូវ!', 'បរាជ័យ');
        else alert('សូមបញ្ចូលទឹកប្រាក់ចំណាយអោយបានត្រឹមត្រូវ!');
        return;
    }

    let finalDate = '';
    let timestamp = 0;
    if (dateVal) {
        const d = new Date(dateVal);
        finalDate = d.toLocaleDateString('km-KH') + ' ' + d.toLocaleTimeString('km-KH');
        timestamp = d.getTime();
    } else {
        finalDate = typeof window.fDate === 'function' ? window.fDate() : new Date().toLocaleString('km-KH');
        timestamp = Date.now();
    }

    if (!window.expenses) window.expenses = [];

    if (id) {
        const index = window.expenses.findIndex(e => String(e.id) === String(id));
        if (index !== -1) {
            window.expenses[index] = { ...window.expenses[index], category: cat, amount, note, date: finalDate, timestamp };
        }
    } else {
        window.expenses.unshift({
            id: 'EXP-' + Date.now(),
            date: finalDate,
            timestamp: timestamp,
            category: cat,
            amount: amount,
            note: note
        });
    }

    if (typeof window.saveData === 'function') {
        await window.saveData(window.userAccounts);
    }
    
    if (typeof window.ksMsg === 'function') {
        window.ksMsg(id ? 'បានកែប្រែចំណាយជោគជ័យ!' : 'កត់ត្រាចំណាយបានជោគជ័យ!', 'ជោគជ័យ');
    }
    
    window.closeExpenseModal();
    window.renderExpenses();
    if(typeof window.renderDashboard === 'function') window.renderDashboard();
};

// 🌟 មុខងារបង្ហាញទិន្នន័យចូលតារាង រួមទាំងការ Filter Date
window.renderExpenses = function() {
    const searchVal = document.getElementById('searchExpense') ? document.getElementById('searchExpense').value.toLowerCase() : '';
    const dateFrom = document.getElementById('expenseDateFrom')?.value;
    const dateTo = document.getElementById('expenseDateTo')?.value;
    
    const tbody = document.getElementById('expenseTableBody') || document.querySelector('#mainExpenseTable tbody');
    if (!tbody) return;

    let totalExp = 0;
    let filtered = (window.expenses || []).filter(e => {
        let textMatch = (e.category && e.category.toLowerCase().includes(searchVal)) || 
               (e.note && e.note.toLowerCase().includes(searchVal)) ||
               (e.date && e.date.toLowerCase().includes(searchVal));
               
        if (!textMatch) return false;

        let eTime = e.timestamp || new Date(e.date || 0).getTime();
        
        if (dateFrom) {
            const dFrom = new Date(dateFrom).getTime();
            if (eTime < dFrom) return false;
        }
        if (dateTo) {
            const dTo = new Date(dateTo).getTime();
            if (eTime > dTo) return false;
        }
        return true;
    });

    filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">មិនមានទិន្នន័យចំណាយទេ</td></tr>`;
        const sumDisplay = document.querySelector('td[style*="color: var(--danger)"] b') || document.getElementById('sumExpenseDisplay') || document.getElementById('summaryTotalExpense');
        if (sumDisplay) sumDisplay.innerText = '$0.00';
        return;
    }

    tbody.innerHTML = filtered.map(e => {
        let amt = parseFloat(e.amount || 0);
        totalExp += amt;
        return `
        <tr>
            <td style="font-size: 13px; color: var(--text-muted);" data-sort="${e.timestamp || 0}">${e.date}</td>
            <td data-sort="${e.category}"><span class="badge" style="background:rgba(239,68,68,0.1); color:var(--danger); border: 1px solid rgba(239,68,68,0.3); padding:4px 8px; border-radius:6px;">${e.category}</span></td>
            <td data-sort="${amt}" style="color:var(--danger); font-weight:900; font-size:15px;">$${amt.toFixed(2)}</td>
            <td data-sort="${e.note || ''}" style="font-size: 13px;">${e.note || '-'}</td>
            <td style="text-align: center;">
                <div style="display: flex; gap: 5px; justify-content: center;">
                    <button class="btn-warning" style="padding:4px 8px; border:none; border-radius:6px; cursor:pointer;" onclick="window.editExpense('${e.id}')" title="កែប្រែ">✏️</button>
                    <button class="btn-danger" style="padding:4px 8px; border:none; border-radius:6px; cursor:pointer;" onclick="window.deleteExpense('${e.id}')" title="លុបចោល">🗑️</button>
                </div>
            </td>
        </tr>
        `;
    }).join('');

    const sumDisplay = document.querySelector('td[style*="color: var(--danger)"] b') || document.getElementById('sumExpenseDisplay') || document.getElementById('summaryTotalExpense');
    if (sumDisplay) sumDisplay.innerText = '$' + totalExp.toFixed(2);
    
    if(typeof window.filterTable === 'function') setTimeout(() => window.filterTable('mainExpenseTable'), 50);
};

window.deleteExpense = function(id) {
    if(typeof window.ksMsg === 'function') {
        window.ksMsg('តើអ្នកពិតជាចង់លុបកំណត់ត្រាចំណាយនេះមែនទេ?', 'បញ្ជាក់ការលុប', true, async () => {
            window.expenses = window.expenses.filter(e => e.id !== id);
            if (typeof window.saveData === 'function') await window.saveData(window.userAccounts);
            window.renderExpenses();
            if(typeof window.renderDashboard === 'function') window.renderDashboard();
            window.ksMsg('លុបជោគជ័យ!', 'ជោគជ័យ');
        });
    } else {
        if(confirm('តើអ្នកពិតជាចង់លុបកំណត់ត្រាចំណាយនេះមែនទេ?')) {
            window.expenses = window.expenses.filter(e => e.id !== id);
            if (typeof window.saveData === 'function') window.saveData(window.userAccounts);
            window.renderExpenses();
            if(typeof window.renderDashboard === 'function') window.renderDashboard();
        }
    }
};

if(document.getElementById('searchExpense')) {
    document.getElementById('searchExpense').addEventListener('input', window.renderExpenses);
}