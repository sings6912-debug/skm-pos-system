/**
 * finance.js - គ្រប់គ្រងវិក្កយបត្រ ការចំណាយ និងការទូទាត់ប្រាក់ (Invoices, Expenses & Settle Debt)
 */

// ជំនួយការសម្រាប់បង្ហាញសារជូនដំណឹងដោយសុវត្ថិភាព
function notifyFinanceUser(msg, title = 'ជូនដំណឹង', isError = false) {
    if (typeof window.ksMsg === 'function') {
        window.ksMsg(msg, title);
    } else if (typeof window.showToast === 'function') {
        window.showToast(msg, isError);
    } else {
        console.log(`[${title}] ${msg}`);
    }
}

// អថេរសម្រាប់កំណត់ការបែងចែកទំព័រ (Pagination) សម្រាប់ Invoices និង Expenses
window.invListCurrentPage = 1;
window.invListItemsPerPage = 20; 

window.expCurrentPage = 1;
window.expItemsPerPage = 20;

/* ========================================================
   🌟 ផ្នែកទី ១៖ គ្រប់គ្រងវិក្កយបត្រ (Invoices & Debt)
   ======================================================== */

window.changeInvoiceItemsPerPage = function(val) {
    window.invListItemsPerPage = val === 'all' ? 'all' : parseInt(val);
    window.invListCurrentPage = 1; 
    window.renderUnpaid();
};

window.changeInvoicePage = function(page) {
    window.invListCurrentPage = page;
    window.renderUnpaid();
    const container = document.getElementById('mainScroller');
    if(container) container.scrollTo({top: 0, behavior: 'smooth'});
};

window.renderUnpaid = function() {
    const tableBody = document.getElementById('unpaidTable') || document.querySelector('#mainUnpaidTable tbody');
    const pageContainer = document.getElementById('invoicePagination');
    if (!tableBody) return;

    let invoices = window.invoices || [];
    if (!Array.isArray(invoices) || invoices.length === 0) {
        try {
            const raw = localStorage.getItem(window.getBranchKey('invoices_pro'));
            invoices = raw ? JSON.parse(raw) : [];
            window.invoices = invoices;
        } catch(e) { invoices = []; }
    }

    // 🛡️ សម្អាតទិន្នន័យខូច (Null/Undefined) ការពារកុំឱ្យគាំង
    invoices = invoices.filter(inv => inv !== null && typeof inv === 'object');

    const deletedTracker = JSON.parse(localStorage.getItem('deleted_invoices_tracker')) || [];
    if (deletedTracker.length > 0) {
        invoices = invoices.filter((inv, idx) => {
            let tempId = String(inv?.id || inv?.invoiceNo || `ORD-${idx}`).trim().toLowerCase();
            return !deletedTracker.includes(tempId);
        });
        window.invoices = invoices;
    }

    invoices.sort((a, b) => {
        let timeA = a.timestamp || new Date(a.date || a.createdAt || 0).getTime() || 0;
        let timeB = b.timestamp || new Date(b.date || b.createdAt || 0).getTime() || 0;
        return timeB - timeA;
    });

    const searchVal = (document.getElementById('searchUnpaid')?.value || '').toLowerCase().trim();
    const dateFrom = document.getElementById('invoiceDateFrom')?.value;
    const dateTo = document.getElementById('invoiceDateTo')?.value;

    let totalPaid = 0;
    let totalUnpaid = 0;

    let filtered = invoices.filter((inv, index) => {
        if (!inv) return false;
        
        const invId = String(inv.id || inv.invoiceNo || `ORD-${index}`);
        const custName = inv.customerName || inv.customer || 'អតិថិជនទូទៅ';
        const custPhone = inv.customerPhone || inv.phone || '';
        const dateStr = inv.date || inv.createdAt || 'N/A';
        const seller = inv.seller || inv.cashier || 'N/A';
        
        if (searchVal) {
            const combinedText = `${invId} ${custName} ${custPhone} ${seller} ${inv.note || ''}`.toLowerCase();
            if (!combinedText.includes(searchVal)) return false;
        }

        if (dateFrom) {
            const dFrom = new Date(dateFrom).getTime();
            const dCurrent = inv.timestamp || new Date(dateStr.split(' ')[0]).getTime();
            if (!isNaN(dCurrent) && dCurrent < dFrom) return false;
        }

        if (dateTo) {
            const dTo = new Date(dateTo).getTime();
            const dCurrent = inv.timestamp || new Date(dateStr.split(' ')[0]).getTime();
            if (!isNaN(dCurrent) && dCurrent > dTo) return false;
        }

        return true;
    });

    // គណនាលុយសរុបទាំងអស់តាមអ្វីដែល Filter ឃើញ មុនកាត់ទំព័រ
    filtered.forEach(inv => {
        const status = String(inv.status || 'unpaid').toLowerCase();
        const totalAmount = parseFloat(inv.totalAmount || inv.total || 0);
        let paidAmount = parseFloat(inv.paidUsd || inv.paidAmount || 0);
        if (status === 'paid') paidAmount = totalAmount;
        const remainingAmount = Math.max(0, totalAmount - paidAmount);

        if (status === 'paid') {
            totalPaid += totalAmount;
        } else {
            totalPaid += paidAmount;
            totalUnpaid += remainingAmount;
        }
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:20px;">មិនមានទិន្នន័យវិក្កយបត្រទេ</td></tr>`;
        if(pageContainer) pageContainer.innerHTML = '';
        const paidEl = document.getElementById('summaryInvoicePaid');
        const unpaidEl = document.getElementById('summaryInvoiceUnpaid');
        if (paidEl) paidEl.innerText = `$0.00`;
        if (unpaidEl) unpaidEl.innerText = `$0.00`;
        return;
    }

    // ការគណនា Pagination
    let totalItems = filtered.length;
    let totalPages = 1;
    let displayItems = filtered;

    if (window.invListItemsPerPage !== 'all') {
        totalPages = Math.ceil(totalItems / window.invListItemsPerPage) || 1;
        if (window.invListCurrentPage > totalPages) window.invListCurrentPage = totalPages;
        if (window.invListCurrentPage < 1) window.invListCurrentPage = 1;

        let startIndex = (window.invListCurrentPage - 1) * window.invListItemsPerPage;
        let endIndex = startIndex + window.invListItemsPerPage;
        displayItems = filtered.slice(startIndex, endIndex);
    }

    tableBody.innerHTML = '';
    displayItems.forEach((inv, index) => {
        const invId = String(inv.id || inv.invoiceNo || `ORD-${index}`);
        const custName = window.escapeHTML ? window.escapeHTML(inv.customerName || inv.customer || 'អតិថិជនទូទៅ') : (inv.customerName || inv.customer || 'អតិថិជនទូទៅ');
        const custPhone = window.escapeHTML ? window.escapeHTML(inv.customerPhone || inv.phone || '') : (inv.customerPhone || inv.phone || '');
        const dateStr = inv.date || inv.createdAt || 'N/A';
        const seller = window.escapeHTML ? window.escapeHTML(inv.seller || inv.cashier || 'N/A') : (inv.seller || inv.cashier || 'N/A');
        const status = String(inv.status || 'unpaid').toLowerCase();
        
        const totalAmount = parseFloat(inv.totalAmount || inv.total || 0);
        let paidAmount = parseFloat(inv.paidUsd || inv.paidAmount || 0);
        if (status === 'paid') paidAmount = totalAmount;
        const remainingAmount = Math.max(0, totalAmount - paidAmount);

        // 🛡️ សម្អាតទិន្នន័យទំនិញក្នុងវិក្កយបត្រការពារការ Error
        let itemsSummary = '';
        if (Array.isArray(inv.items)) {
            itemsSummary = inv.items.map(it => {
                if (!it) return '';
                let name = it.name || it.title || 'ទំនិញ';
                let qty = it.cartQty !== undefined ? it.cartQty : (it.qty || 1);
                return `${name} (x${qty})`;
            }).filter(Boolean).join(', ');
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

        // 🌟 ការកំណត់សិទ្ធិបង្ហាញប៊ូតុង (Role Based Buttons)
        let actionButtons = `<div style="display: flex; gap: 4px; justify-content: center; align-items: center; flex-wrap: wrap;">`;
        
        // 👁️ មើល (Admin, Manager, Sales មើលបានទាំងអស់)
        actionButtons += `<button class="btn btn-outline" style="padding: 4px 7px; font-size: 11px;" onclick="window.viewInvoiceDetails('${invId}')" title="មើលលម្អិត">👁️ មើល</button>`;
        
        // ✏️ កែប្រែ (Admin & Manager អាចកែបានគ្រប់ពេល / Sales អាចកែបានតែពេលភ្ញៀវមិនទាន់ទូទាត់លុយ)
        if (window.currentRole === 'admin' || window.currentRole === 'manager' || status !== 'paid') {
            actionButtons += `<button class="btn btn-warning" style="padding: 4px 7px; font-size: 11px;" onclick="window.openInvoiceEditModal('${invId}')" title="កែប្រែវិក្កយបត្រ ឬការកុម្ម៉ង់">✏️ កែប្រែ</button>`;
        }

        // 💸 ទូទាត់ និង រួចរាល់ (បង្ហាញបើមិនទាន់ទូទាត់រួច)
        if (status !== 'paid') {
            actionButtons += `<button class="btn btn-success" style="padding: 4px 7px; font-size: 11px;" onclick="window.openDebtPaymentModal('${invId}')" title="ទូទាត់ប្រាក់">💸 ទូទាត់</button>`;
            if (status !== 'ready') {
                actionButtons += `<button class="btn btn-primary" style="padding: 4px 7px; font-size: 11px; background:#0284c7; color: #fff; border: none;" onclick="window.notifyCustomerOrderDone('${invId}')" title="ប្រាប់ភ្ញៀវថារួចរាល់">📢 រួចរាល់</button>`;
            }
        }

        // 🗑️ លុប (មានតែ Admin និង Manager ទេដែលឃើញប៊ូតុងនេះ)
        if (window.currentRole === 'admin' || window.currentRole === 'manager') {
            actionButtons += `<button class="btn btn-danger" style="padding: 4px 7px; font-size: 11px; background:#ef4444; color: #fff; border: none;" onclick="window.deleteInvoiceRecord('${invId}')" title="លុបចោល">🗑️ លុប</button>`;
        }

        actionButtons += `</div>`;

        const safeNote = inv.note ? (window.escapeHTML ? window.escapeHTML(inv.note) : inv.note) : '';
        const noteTag = safeNote ? `<br><small style="color:#0284c7; font-weight:bold;">📝 ${safeNote}</small>` : '';

        const row = document.createElement('tr');
        row.setAttribute('data-paid', paidAmount);
        row.setAttribute('data-unpaid', remainingAmount);
        row.innerHTML = `
            <td style="font-family: monospace; font-weight: bold; color: var(--primary);">${invId}</td>
            <td style="font-size: 12px;">${dateStr}</td>
            <td><b>${custName}</b><br><small style="color:var(--text-muted);">${custPhone}</small>${noteTag}</td>
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
    
    // Render ប៊ូតុង Pagination ខាងក្រោមតារាង
    if (pageContainer) {
        if (window.invListItemsPerPage === 'all' || totalItems <= window.invListItemsPerPage) {
            pageContainer.innerHTML = '';
        } else {
            let pageHtml = `<button class="btn btn-outline" ${window.invListCurrentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : `onclick="window.changeInvoicePage(${window.invListCurrentPage - 1})"`}>◀ មុន</button>`;
            pageHtml += `<span style="font-weight:bold; font-size:var(--fs-14);">ទំព័រ ${window.invListCurrentPage} នៃ ${totalPages} <small style="color:var(--text-muted); font-weight:normal;">(សរុប ${totalItems} វិក្កយបត្រ)</small></span>`;
            pageHtml += `<button class="btn btn-outline" ${window.invListCurrentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : `onclick="window.changeInvoicePage(${window.invListCurrentPage + 1})"`}>បន្ទាប់ ▶</button>`;
            pageContainer.innerHTML = pageHtml;
        }
    }

    const paidEl = document.getElementById('summaryInvoicePaid');
    const unpaidEl = document.getElementById('summaryInvoiceUnpaid');
    if (paidEl) paidEl.innerText = `$${totalPaid.toFixed(2)}`;
    if (unpaidEl) unpaidEl.innerText = `$${totalUnpaid.toFixed(2)}`;
    
    if(typeof window.filterTable === 'function') setTimeout(() => window.filterTable('mainUnpaidTable'), 50);
};

window.notifyCustomerOrderDone = async function(invId) {
    let invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const targetId = String(invId).trim().toLowerCase();
    const invIndex = invoices.findIndex((i, idx) => String(i?.id || i?.invoiceNo || `ORD-${idx}`).trim().toLowerCase() === targetId);

    if (invIndex === -1) {
        return notifyFinanceUser("❌ រកមិនឃើញវិក្កយបត្រនេះទេ!", "បរាជ័យ", true);
    }

    const inv = invoices[invIndex];
    inv.status = 'ready'; 
    invoices[invIndex] = inv;
    
    window.invoices = invoices;
    localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(invoices));

    const shopName = window.shopName || localStorage.getItem(window.getBranchKey('shop_name')) || 'ហាងរបស់យើង';
    const noteLine = inv.note ? `\n📝 ចំណាំ៖ ${inv.note}` : '';
    const message = `🎉 សួស្តី ${inv.customerName || inv.customer || 'អតិថិជន'}!\n\nការកុម្ម៉ង់លេខ [${invId}] របស់អ្នកនៅហាង "${shopName}" ត្រូវបានរៀបចំរួចរាល់ហើយ! 🛍️${noteLine}\n\n💵 សរុបទឹកប្រាក់៖ $${parseFloat(inv.totalAmount || inv.total || 0).toFixed(2)}\nសូមអញ្ជើញមកទទួលទំនិញ ឬរង់ចាំការដឹកជញ្ជូន។ អរគុណច្រើន! 🙏`;

    try {
        const sysSettings = window.sysSettings || JSON.parse(localStorage.getItem(window.getBranchKey('sys_settings'))) || {};
        const botToken = sysSettings.orderTelegramBotToken || sysSettings.telegramBotToken || window.telegramBotToken || sysSettings.botToken || '';
        const chatId = inv.telegramChatId || sysSettings.orderTelegramChatId || sysSettings.telegramChatId || window.telegramChatId || sysSettings.chatId || '';

        if (botToken && chatId) {
            fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: message })
            }).catch(err => console.warn("Telegram fetch warning:", err));
        }
    } catch(e) { console.warn("Telegram error:", e); }

    setTimeout(() => { if (typeof window.saveData === 'function') window.saveData(window.userAccounts); }, 100);

    if (typeof window.showToast === 'function') {
        window.showToast(`✅ ការកុម្ម៉ង់ ${invId} បានរៀបចំរួចរាល់!`);
    } else {
        notifyFinanceUser(`✅ ការកុម្ម៉ង់ ${invId} បានរៀបចំរួចរាល់!`, "ជោគជ័យ");
    }

    window.renderUnpaid();
};

window.currentPayingInvoiceId = null;

window.openDebtPaymentModal = function(invId) {
    const invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const targetId = String(invId).trim().toLowerCase();
    const inv = invoices.find((i, idx) => String(i?.id || i?.invoiceNo || `ORD-${idx}`).trim().toLowerCase() === targetId);

    if (!inv) return notifyFinanceUser("❌ រកមិនឃើញវិក្កយបត្រនេះទេ!", "បរាជ័យ", true);

    window.currentPayingInvoiceId = invId;
    const modal = document.getElementById('debtPaymentModal');
    if (!modal) return notifyFinanceUser("❌ រកមិនឃើញផ្ទាំង Modal ទូទាត់ប្រាក់!", "បរាជ័យ", true);

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
    const targetId = String(window.currentPayingInvoiceId).trim().toLowerCase();
    const inv = invoices.find((i, idx) => String(i?.id || i?.invoiceNo || `ORD-${idx}`).trim().toLowerCase() === targetId);
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
            changeDisplay.innerText = `$${changeUsd.toFixed(2)} | ${Math.round(changeUsd * rate).toLocaleString()} ៛`;
        } else {
            changeDisplay.style.color = 'var(--danger)';
            changeDisplay.innerText = `នៅខ្វះ $${Math.abs(changeUsd).toFixed(2)}`;
        }
    }
};

window.processDebtPayment = async function() {
    if (!window.currentPayingInvoiceId) return;

    let invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const targetId = String(window.currentPayingInvoiceId).trim().toLowerCase();
    const invIndex = invoices.findIndex((i, idx) => String(i?.id || i?.invoiceNo || `ORD-${idx}`).trim().toLowerCase() === targetId);

    if (invIndex === -1) return;

    const inv = invoices[invIndex];
    const wasPreorder = String(inv.status || '').toLowerCase() === 'preorder';
    const total = parseFloat(inv.totalAmount || inv.total || 0);
    const prevPaid = parseFloat(inv.paidUsd || inv.paidAmount || 0);
    
    const payUsdText = document.getElementById('debtPayUsd')?.value;
    const payRielText = document.getElementById('debtPayRiel')?.value;
    let payUsd = parseFloat(payUsdText) || 0;
    let payRiel = parseFloat(payRielText) || 0;
    const rate = parseFloat(document.getElementById('globalExchangeRate')?.value) || inv.rate || window.cartRate || 4000;

    if (!payUsdText && !payRielText) payUsd = Math.max(0, total - prevPaid);

    const totalPaidNow = payUsd + (payRiel / rate);
    if (totalPaidNow <= 0) return notifyFinanceUser("⚠️ សូមបញ្ចូលចំនួនប្រាក់ដែលត្រូវទូទាត់!", "ជូនដំណឹង", true);

    const newPaid = prevPaid + totalPaidNow;
    inv.paidUsd = newPaid >= total ? total : newPaid;
    inv.paidAmount = inv.paidUsd;
    inv.remainingAmount = Math.max(0, total - inv.paidUsd);

    if (inv.paidUsd >= (total - 0.01)) {
        inv.status = 'paid';
        if (wasPreorder && Array.isArray(inv.items) && window.inventory) {
            inv.items.forEach(item => {
                if (!item || !item.id) return;
                const realItem = window.inventory.find(p => p && String(p.id) === String(item.id));
                if (realItem) {
                    const q = parseInt(item.cartQty !== undefined ? item.cartQty : item.qty) || 1;
                    realItem.qty = Math.max(0, (parseFloat(realItem.qty) || 0) - q);
                }
            });
            localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
        }
    }

    invoices[invIndex] = inv;
    window.invoices = invoices;
    localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(invoices));

    if (typeof window.logAction === 'function') {
        window.logAction('update', inv.customer || inv.customerName, 0, `បានទូទាត់ប្រាក់ $${totalPaidNow.toFixed(2)} សម្រាប់វិក្កយបត្រ ${inv.id || inv.invoiceNo || 'ចាស់'}`, window.activeUser);
    }

    setTimeout(() => { if (typeof window.saveData === 'function') window.saveData(window.userAccounts); }, 100);

    document.getElementById('debtPaymentModal').style.display = 'none';
    notifyFinanceUser("✅ បានកត់ត្រាការទូទាត់ប្រាក់ជោគជ័យ!", "ជោគជ័យ");
    
    window.renderUnpaid();
    if(typeof window.renderCustomers === 'function') window.renderCustomers();
    if(typeof window.renderDashboard === 'function') window.renderDashboard();
};

window.currentEditingInvoice = null;
window.originalEditingInvoiceItems = [];

window.openInvoiceEditModal = function(invId) {
    let invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const targetId = String(invId).trim().toLowerCase();
    const inv = invoices.find((i, idx) => String(i?.id || i?.invoiceNo || `ORD-${idx}`).trim().toLowerCase() === targetId);

    if (!inv) return notifyFinanceUser("❌ រកមិនឃើញវិក្កយបត្រនេះទេ!", "បរាជ័យ", true);

    // 🌟 ការពារសុវត្ថិភាព ២ ជាន់ (Sales មិនអាចបើកកែវិក្កយបត្រទូទាត់រួចទេ)
    if (String(inv.status).toLowerCase() === 'paid' && window.currentRole !== 'admin' && window.currentRole !== 'manager') {
        return notifyFinanceUser("❌ អ្នកមិនមានសិទ្ធិកែប្រែវិក្កយបត្រដែលបានទូទាត់រួចទេ!", "គ្មានសិទ្ធិ", true);
    }

    window.currentEditingInvoice = JSON.parse(JSON.stringify(inv));
    window.originalEditingInvoiceItems = JSON.parse(JSON.stringify(inv.items || []));

    const modal = document.getElementById('invoiceEditModal');
    if (!modal) return notifyFinanceUser("❌ រកមិនឃើញផ្ទាំង Modal កែប្រែ!", "បរាជ័យ", true);

    document.getElementById('editInvId').value = invId;
    document.getElementById('editInvName').value = inv.customer || inv.customerName || '';
    document.getElementById('editInvPhone').value = inv.phone || inv.customerPhone || '';

    const addSelect = document.getElementById('editInvAddItemSelect');
    if (addSelect) {
        let products = window.inventory || JSON.parse(localStorage.getItem(window.getBranchKey('inv_pro'))) || [];
        addSelect.innerHTML = '<option value="">-- ជ្រើសរើសទំនិញបន្ថែម --</option>';
        const rate = parseFloat(document.getElementById('globalExchangeRate')?.value) || inv.rate || window.cartRate || 4000;
        products.forEach(p => {
            if (p && (parseFloat(p.qty) > 0 || (window.sysSettings && window.sysSettings.preorder))) {
                const unitUsd = parseFloat(p.price) > 0 ? parseFloat(p.price) : ((parseFloat(p.riel) || 0) / rate);
                addSelect.innerHTML += `<option value="${p.id}">${p.name} ($${unitUsd.toFixed(2)} | ស្តុក: ${p.qty})</option>`;
            }
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
    const rate = parseFloat(document.getElementById('globalExchangeRate')?.value) || window.currentEditingInvoice.rate || window.cartRate || 4000;

    if (items.length === 0) {
        listBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">មិនមានទំនិញទេ</td></tr>';
    }

    items.forEach((it, idx) => {
        if (!it) return;
        const price = parseFloat(it.price) > 0 ? parseFloat(it.price) : ((parseFloat(it.riel) || 0) / rate);
        it.price = price;
        const qty = parseInt(it.cartQty !== undefined ? it.cartQty : (it.qty || it.quantity || 1));
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
    window.currentEditingInvoice.totalRiel = Math.round(grandTotal * rate);
    if (totalPreview) totalPreview.innerText = `$${grandTotal.toFixed(2)}`;
};

window.updateEditInvoiceItemQty = function(idx, newQty) {
    if (!window.currentEditingInvoice || !window.currentEditingInvoice.items[idx]) return;
    const val = parseInt(newQty) || 1;
    const item = window.currentEditingInvoice.items[idx];
    const isPreorderInv = String(window.currentEditingInvoice.status || '').toLowerCase() === 'preorder';

    if (window.inventory && !isPreorderInv && !(window.sysSettings && window.sysSettings.preorder)) {
        const realItem = window.inventory.find(i => i && String(i.id) === String(item.id));
        const origQtyInInv = (window.originalEditingInvoiceItems || [])
            .filter(orig => orig && String(orig.id) === String(item.id))
            .reduce((sum, orig) => sum + (parseInt(orig.cartQty !== undefined ? orig.cartQty : orig.qty) || 1), 0);

        const maxAllowed = (realItem ? (parseFloat(realItem.qty) || 0) : 0) + origQtyInInv;
        if (realItem && val > maxAllowed) {
            notifyFinanceUser(`⚠️ ស្តុកមិនគ្រប់គ្រាន់ទេ! (អាចដាក់បានច្រើនបំផុតត្រឹម ${maxAllowed})`, 'ស្តុកមិនគ្រប់', true);
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
    const p = products.find(prod => prod && String(prod.id) === String(select.value));
    if (!p) return;

    const isPreorderInv = String(window.currentEditingInvoice.status || '').toLowerCase() === 'preorder';
    const origQtyInInv = (window.originalEditingInvoiceItems || [])
        .filter(orig => orig && String(orig.id) === String(p.id))
        .reduce((sum, orig) => sum + (parseInt(orig.cartQty !== undefined ? orig.cartQty : orig.qty) || 1), 0);
    const maxAllowed = (parseFloat(p.qty) || 0) + origQtyInInv;

    if (!window.currentEditingInvoice.items) window.currentEditingInvoice.items = [];
    const existing = window.currentEditingInvoice.items.find(i => i && String(i.id) === String(p.id));
    const currentNewQty = existing ? (parseInt(existing.cartQty !== undefined ? existing.cartQty : existing.qty) || 1) : 0;

    if (!isPreorderInv && !(window.sysSettings && window.sysSettings.preorder) && (currentNewQty + 1) > maxAllowed) {
        return notifyFinanceUser("⚠️ ទំនិញនេះអស់ពីស្តុកហើយ!", "អស់ស្តុក", true);
    }

    const rate = parseFloat(document.getElementById('globalExchangeRate')?.value) || window.currentEditingInvoice.rate || window.cartRate || 4000;
    const unitUsd = parseFloat(p.price) > 0 ? parseFloat(p.price) : ((parseFloat(p.riel) || 0) / rate);

    if (existing) {
        existing.cartQty = currentNewQty + 1;
        existing.qty = existing.cartQty;
    } else {
        window.currentEditingInvoice.items.push({ ...p, price: unitUsd, cartQty: 1, qty: 1 });
    }

    select.value = '';
    window.renderEditingInvoiceItems();
};

window.closeInvoiceEditModal = function() {
    const modal = document.getElementById('invoiceEditModal');
    if (modal) modal.style.display = 'none';
    window.currentEditingInvoice = null;
    window.originalEditingInvoiceItems = [];
};

window.saveInvoiceChanges = async function() {
    if (!window.currentEditingInvoice) return;
    if (!window.currentEditingInvoice.items || window.currentEditingInvoice.items.length === 0) {
        return notifyFinanceUser("⚠️ វិក្កយបត្រត្រូវតែមានទំនិញយ៉ាងហោចណាស់ ១ មុខ!", "ជូនដំណឹង", true);
    }

    let invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const invId = document.getElementById('editInvId').value;
    const targetId = String(invId).trim().toLowerCase();
    const invIndex = invoices.findIndex((i, idx) => String(i?.id || i?.invoiceNo || `ORD-${idx}`).trim().toLowerCase() === targetId);

    if (invIndex === -1) return notifyFinanceUser("❌ រកមិនឃើញវិក្កយបត្រដើម!", "បរាជ័យ", true);

    const origInv = invoices[invIndex];
    const isPreorder = String(origInv.status || '').toLowerCase() === 'preorder';

    if (!isPreorder && window.inventory && Array.isArray(window.inventory)) {
        const oldQtyMap = {};
        (origInv.items || []).forEach(it => {
            if (!it || !it.id) return;
            const q = parseInt(it.cartQty !== undefined ? it.cartQty : (it.qty || 1)) || 0;
            oldQtyMap[it.id] = (oldQtyMap[it.id] || 0) + q;
        });

        const newQtyMap = {};
        (window.currentEditingInvoice.items || []).forEach(it => {
            if (!it || !it.id) return;
            const q = parseInt(it.cartQty !== undefined ? it.cartQty : (it.qty || 1)) || 0;
            newQtyMap[it.id] = (newQtyMap[it.id] || 0) + q;
        });

        const allItemIds = new Set([...Object.keys(oldQtyMap), ...Object.keys(newQtyMap)]);
        allItemIds.forEach(itemId => {
            const oldQ = oldQtyMap[itemId] || 0;
            const newQ = newQtyMap[itemId] || 0;
            const diff = newQ - oldQ; 
            if (diff !== 0) {
                const realItem = window.inventory.find(p => p && String(p.id) === String(itemId));
                if (realItem) {
                    realItem.qty = Math.max(0, (parseFloat(realItem.qty) || 0) - diff);
                    if (typeof window.logAction === 'function') {
                        window.logAction(
                            'update',
                            realItem.name,
                            Math.abs(diff),
                            diff > 0 ? `កាត់ស្តុកបន្ថែមពីការកែវិក្កយបត្រ ${invId}` : `បង្វិលស្តុកពីការកែវិក្កយបត្រ ${invId}`,
                            window.activeUser
                        );
                    }
                }
            }
        });

        if (typeof window.getBranchKey === 'function') {
            localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
        }
    }

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

    notifyFinanceUser("✅ វិក្កយបត្រ និងចំនួនស្តុកត្រូវបានធ្វើបច្ចុប្បន្នភាពជោគជ័យ!", "ជោគជ័យ");
    
    window.closeInvoiceEditModal();
    window.renderUnpaid();
    if (typeof window.renderInventory === 'function') window.renderInventory();
    if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
    if (typeof window.renderDashboard === 'function') window.renderDashboard();
};

window.deleteInvoiceRecord = function(invId) {
    if (window.currentRole !== 'admin' && window.currentRole !== 'manager') {
        return notifyFinanceUser("❌ អ្នកមិនមានសិទ្ធិលុបទិន្នន័យនេះទេ!", "គ្មានសិទ្ធិ", true);
    }

    const executeDeleteInvoice = async () => {
        try {
            const targetId = String(invId).trim().toLowerCase();
            let branchKey = typeof window.getBranchKey === 'function' ? window.getBranchKey('invoices_pro') : 'invoices_pro';
            let invoices = JSON.parse(localStorage.getItem(branchKey)) || window.invoices || [];
            
            const invIndex = invoices.findIndex((i, idx) => String(i?.id || i?.invoiceNo || `ORD-${idx}`).trim().toLowerCase() === targetId);

            if (invIndex !== -1) {
                const inv = invoices[invIndex];
                const isPreorder = String(inv?.status || '').toLowerCase() === 'preorder';

                // Return Stock
                if (!isPreorder && inv && Array.isArray(inv.items) && window.inventory) {
                    inv.items.forEach(item => {
                        if (item && item.id) {
                            const realItem = window.inventory.find(p => p && String(p.id) === String(item.id));
                            const returnQty = parseInt(item.cartQty !== undefined ? item.cartQty : item.qty) || 1;
                            if (realItem) {
                                realItem.qty = (parseFloat(realItem.qty) || 0) + returnQty;
                                if (typeof window.logAction === 'function') {
                                    window.logAction('update', realItem.name, returnQty, `បង្វិលស្តុកពីការលុបវិក្កយបត្រ ${invId}`, window.activeUser);
                                }
                            }
                        }
                    });
                    if (typeof window.getBranchKey === 'function') {
                        localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
                    }
                }
            }

            // លុបពី Local Storage
            invoices = invoices.filter((i, idx) => String(i?.id || i?.invoiceNo || `ORD-${idx}`).trim().toLowerCase() !== targetId);
            window.invoices = invoices;
            localStorage.setItem(branchKey, JSON.stringify(invoices));
            
            // 🚀 បញ្ជាឱ្យលុបពី Cloud (Supabase) ភ្លាមៗ ១០០%
            if (window.supabaseClient && navigator.onLine) {
                const bId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
                
                // ១. លុបចេញពី pos_orders ផ្ទាល់
                await window.supabaseClient.from('pos_orders').delete().eq('id', invId).eq('branch_id', bId);
                
                // ២. ហៅមុខងារ Save Data ដើម្ប Update ទៅ Branch Store
                if (typeof window.saveData === 'function') {
                    await window.saveData(window.userAccounts);
                }
            }

            window.renderUnpaid();
            if (typeof window.renderInventory === 'function') window.renderInventory();
            if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
            if (typeof window.renderDashboard === 'function') window.renderDashboard();

            notifyFinanceUser("✅ បានលុបវិក្កយបត្រដោយជោគជ័យ និងបាត់ពី Cloud ទាំងស្រុង!", "ជោគជ័យ");
        } catch (error) {
            console.error("Error deleting invoice:", error);
            notifyFinanceUser("❌ មានបញ្ហាក្នុងការលុប៖ " + error.message, "បរាជ័យ", true);
        }
    };

    if (typeof window.ksMsg === 'function') {
        window.ksMsg(`⚠️ តើអ្នកពិតជាចង់លុបវិក្កយបត្រ [${invId}] មែនទេ?`, 'បញ្ជាក់ការលុប', true, executeDeleteInvoice);
    } else {
        executeDeleteInvoice();
    }
};

window.currentActiveInvoiceId = null;

window.viewInvoiceDetails = function(invId) {
    const invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const targetId = String(invId).trim().toLowerCase();
    const inv = invoices.find((i, idx) => String(i?.id || i?.invoiceNo || `ORD-${idx}`).trim().toLowerCase() === targetId);

    if (!inv) return notifyFinanceUser("❌ រកមិនឃើញវិក្កយបត្រនេះទេ!", "បរាជ័យ", true);

    window.currentActiveInvoiceId = invId;

    const modal = document.getElementById('invoiceViewModal');
    const captureArea = document.getElementById('invoiceViewContent');
    const logoImg = document.getElementById('viewInvoiceLogo');
    if (!modal || !captureArea) return notifyFinanceUser("❌ រកមិនឃើញផ្ទាំង Modal មើលវិក្កយបត្រ!", "បរាជ័យ", true);

    const currentLogo = window.shopLogo || localStorage.getItem(window.getBranchKey('shop_logo')) || '';
    if (logoImg) {
        if (currentLogo && currentLogo.trim() !== '') {
            logoImg.src = currentLogo;
            logoImg.style.display = 'block';
        } else {
            logoImg.style.display = 'none';
        }
    }

    document.getElementById('viewShopName').innerText = window.shopName || localStorage.getItem(window.getBranchKey('shop_name')) || 'SKM INTEGRATE';
    document.getElementById('viewInvoiceDate').innerText = `កាលបរិច្ឆេទ៖ ${inv.date || inv.createdAt || 'N/A'}`;
    document.getElementById('viewInvoiceIdDisplay').innerText = `លេខវិក្កយបត្រ៖ ${invId}`;
    
    let shopContact = document.getElementById('viewShopContact');
    if(shopContact && (window.shopPhone || window.shopAddress)) {
        shopContact.innerHTML = `${window.shopPhone ? `Tel: ${window.escapeHTML ? window.escapeHTML(window.shopPhone) : window.shopPhone}<br>` : ''}${window.shopAddress ? (window.escapeHTML ? window.escapeHTML(window.shopAddress) : window.shopAddress) : ''}`;
    }

    let itemsHtml = `<table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;"><thead><tr style="border-bottom: 1px dashed #000;"><th style="text-align: left; padding: 4px 0;">ទំនិញ</th><th style="text-align: center; padding: 4px 0;">ចំនួន</th><th style="text-align: right; padding: 4px 0;">តម្លៃ</th><th style="text-align: right; padding: 4px 0;">សរុប</th></tr></thead><tbody>`;

    let rawSubtotal = 0; 
    const rate = parseFloat(inv.rate) || window.cartRate || 4000;

    (inv.items || []).forEach(it => {
        if (!it) return;
        const p = parseFloat(it.price) > 0 ? parseFloat(it.price) : ((parseFloat(it.riel) || 0) / rate);
        const q = parseInt(it.cartQty !== undefined ? it.cartQty : (it.qty || it.quantity || 1));
        const safeName = window.escapeHTML ? window.escapeHTML(it.name || it.title || 'ទំនិញ') : (it.name || it.title || 'ទំនិញ');
        rawSubtotal += (p * q); 
        itemsHtml += `<tr style="border-bottom: 1px dotted #ccc;"><td style="padding: 4px 0;">${safeName}</td><td style="text-align: center; padding: 4px 0;">${q}</td><td style="text-align: right; padding: 4px 0;">$${p.toFixed(2)}</td><td style="text-align: right; padding: 4px 0;">$${(p * q).toFixed(2)}</td></tr>`;
    });

    const total = parseFloat(inv.totalAmount || inv.total || 0);
    const paid = parseFloat(inv.paidUsd || inv.paidAmount || 0);
    const remaining = Math.max(0, total - paid);

    itemsHtml += `</tbody></table><div style="border-top: 1px dashed #000; margin-top: 10px; padding-top: 8px; text-align: right;">`;

    const discVal = parseFloat(inv.discount || 0);
    if (discVal > 0) {
        itemsHtml += `<div style="font-size: 13px; margin-bottom: 4px; color: #555;">សរុបទំនិញ៖ $${rawSubtotal.toFixed(2)}</div>`;
        let discDisplay = inv.discountType === '%' ? `${discVal}%` : `$${discVal.toFixed(2)}`;
        itemsHtml += `<div style="font-size: 13px; margin-bottom: 6px; color: var(--danger);">បញ្ចុះតម្លៃ៖ -${discDisplay}</div>`;
    }

    const taxRate = parseFloat(inv.taxRate || 0);
    if (taxRate > 0) {
        itemsHtml += `<div style="font-size: 13px; margin-bottom: 4px;">ពន្ធអាករ (${taxRate}%)៖ បូកបញ្ចូល</div>`;
    }

    itemsHtml += `<div style="font-size: 16px; font-weight: bold;">សរុបប្រាក់៖ $${total.toFixed(2)}</div>`;

    if (inv.totalRiel > 0) {
        itemsHtml += `<div style="font-size: 14px; font-weight: bold; color: var(--text-muted);">${Math.round(inv.totalRiel).toLocaleString()} ៛</div>`;
    }
    
    if (inv.status !== 'paid' && paid > 0) {
        itemsHtml += `<div style="font-size: 13px; margin-top: 4px;">បានទូទាត់៖ $${paid.toFixed(2)}</div><div style="font-size: 13px; font-weight: bold; color: red;">នៅខ្វះ៖ $${remaining.toFixed(2)}</div>`;
    }

    const safeCustName = window.escapeHTML ? window.escapeHTML(inv.customerName || inv.customer || 'ទូទៅ') : (inv.customerName || inv.customer || 'ទូទៅ');
    const safeCustPhone = window.escapeHTML ? window.escapeHTML(inv.customerPhone || inv.phone || '-') : (inv.customerPhone || inv.phone || '-');
    const safeSeller = window.escapeHTML ? window.escapeHTML(inv.seller || inv.cashier || 'N/A') : (inv.seller || inv.cashier || 'N/A');

    itemsHtml += `<div style="font-size: 12px; color: #555; margin-top: 8px; text-align: left;">អតិថិជន៖ <b>${safeCustName}</b> (${safeCustPhone})</div>`;
    if (inv.note) {
        const safeNote = window.escapeHTML ? window.escapeHTML(inv.note) : inv.note;
        itemsHtml += `<div style="font-size: 12px; color: #000; background: #f1f5f9; border-left: 3px solid #0284c7; padding: 5px 8px; margin-top: 5px; text-align: left; font-weight: bold;">📝 ចំណាំ៖ ${safeNote}</div>`;
    }
    itemsHtml += `<div style="font-size: 12px; color: #555; margin-top: 4px; text-align: left;">អ្នកលក់៖ ${safeSeller}</div></div>`;

    captureArea.innerHTML = itemsHtml;
    modal.style.display = 'flex';
};

window.closeInvoiceViewModal = function() {
    const modal = document.getElementById('invoiceViewModal');
    if (modal) modal.style.display = 'none';
    window.currentActiveInvoiceId = null;
};

window.reprintInvoice = function() {
    if (!window.currentActiveInvoiceId) return notifyFinanceUser("❌ រកមិនឃើញវិក្កយបត្រសម្រាប់បោះពុម្ពទេ!", "បរាជ័យ", true);
    const invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    const targetId = String(window.currentActiveInvoiceId).trim().toLowerCase();
    const inv = invoices.find((i, idx) => String(i?.id || i?.invoiceNo || `ORD-${idx}`).trim().toLowerCase() === targetId);
    if (!inv) return;

    let receiptHTML = `<div style="text-align:center; margin-bottom: 8px;">`; 
    const currentLogo = window.shopLogo || localStorage.getItem(window.getBranchKey('shop_logo')) || '';
    if(currentLogo) {
        let savedScale = window.sysSettings?.logoScale || 1;
        let savedShape = window.sysSettings?.logoShape || 'circle';
        
        if (savedShape === 'circle') {
            receiptHTML += `<div style="width: 80px; height: 80px; margin: 0 auto 5px; overflow: hidden; border-radius: 50%;"><img src="${currentLogo}" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%); transform: scale(${savedScale});"></div>`; 
        } else {
            receiptHTML += `<div style="width: 100px; height: 80px; margin: 0 auto 5px; overflow: hidden; border-radius: 8px;"><img src="${currentLogo}" style="width: 100%; height: 100%; object-fit: contain; filter: grayscale(100%); transform: scale(${savedScale});"></div>`; 
        }
    }
    receiptHTML += `<h2 style="margin:0; font-size:16px;">${window.escapeHTML ? window.escapeHTML(window.shopName || 'SKM INTEGRATE') : (window.shopName || 'SKM INTEGRATE')}</h2>`; 
    if(window.shopPhone) receiptHTML += `<p style="margin:2px 0; font-size:12px;">Tel: ${window.escapeHTML ? window.escapeHTML(window.shopPhone) : window.shopPhone}</p>`; 
    if(window.shopAddress) receiptHTML += `<p style="margin:2px 0; font-size:12px;">${window.escapeHTML ? window.escapeHTML(window.shopAddress) : window.shopAddress}</p>`; 
    receiptHTML += `<div style="border-bottom: 1px dashed #000; margin: 5px 0;"></div>`;
    receiptHTML += `<p style="margin:4px 0; font-size:14px; font-weight:bold;">វិក្កយបត្រ / Invoice</p>`;
    receiptHTML += `<p style="margin:2px 0; font-size:11px; text-align:left;">កាលបរិច្ឆេទ: ${inv.date || inv.createdAt || 'N/A'}</p>`;
    receiptHTML += `<p style="margin:2px 0; font-size:11px; text-align:left;">លេខវិក្កយបត្រ: ${inv.id || inv.invoiceNo || window.currentActiveInvoiceId}</p>`;
    receiptHTML += `<p style="margin:2px 0; font-size:11px; text-align:left;">អតិថិជន: <b>${window.escapeHTML ? window.escapeHTML(inv.customerName || inv.customer || 'ទូទៅ') : (inv.customerName || inv.customer || 'ទូទៅ')}</b> ${inv.phone || inv.customerPhone ? '('+(window.escapeHTML ? window.escapeHTML(inv.phone || inv.customerPhone) : (inv.phone || inv.customerPhone))+')':''}</p>`;
    if (inv.note) {
        receiptHTML += `<p style="margin:2px 0; font-size:11px; text-align:left; font-weight:bold;">ចំណាំ: ${window.escapeHTML ? window.escapeHTML(inv.note) : inv.note}</p>`;
    }
    receiptHTML += `<div style="border-bottom: 1px dashed #000; margin: 5px 0;"></div></div>`;

    receiptHTML += `<table style="width:100%; text-align:left; font-size: 12px; table-layout: fixed;"><thead><tr><th style="width: 50%; border-bottom: 1px solid #000; padding-bottom: 4px;">ទំនិញ</th><th style="width: 20%; text-align:center; border-bottom: 1px solid #000; padding-bottom: 4px;">ចំនួន</th><th style="width: 30%; text-align:right; border-bottom: 1px solid #000; padding-bottom: 4px;">សរុប</th></tr></thead><tbody>`;

    const rate = parseFloat(inv.rate) || window.cartRate || 4000;
    (inv.items || []).forEach((item, index) => {
        if (!item) return;
        let p = parseFloat(item.price) > 0 ? parseFloat(item.price) : ((parseFloat(item.riel) || 0) / rate);
        let q = parseInt(item.cartQty !== undefined ? item.cartQty : (item.qty || 1));
        let lineTotal = p * q;
        let safeItemName = window.escapeHTML ? window.escapeHTML(item.name || item.title) : (item.name || item.title);
        receiptHTML += `<tr><td colspan="3" style="padding-top: 4px; font-weight:bold; font-size: 12px;">${index + 1}. ${safeItemName}</td></tr>`;
        receiptHTML += `<tr><td style="padding-bottom: 4px; font-size: 11px;">$${p.toFixed(2)}</td><td style="text-align:center; padding-bottom: 4px; font-size: 11px;">${q}</td><td style="text-align:right; font-weight:bold; padding-bottom: 4px;">$${lineTotal.toFixed(2)}</td></tr>`;
    });

    receiptHTML += `</tbody></table><div style="border-bottom: 1px dashed #000; margin: 5px 0;"></div>`;
    receiptHTML += `<table style="width:100%; font-size: 12px; margin-top: 5px;">`;
    receiptHTML += `<tr><td style="font-weight:bold; font-size:14px; padding-top:4px;">សរុបប្រាក់:</td><td style="text-align:right; font-weight:bold; font-size:14px; padding-top:4px;">$${parseFloat(inv.totalAmount || inv.total || 0).toFixed(2)}</td></tr>`;
    receiptHTML += `</table>`;
    
    let footerText = (window.sysSettings && window.sysSettings.receiptFooter) ? String(window.sysSettings.receiptFooter).replace(/\n/g, '<br>') : 'សូមអរគុណ! សូមអញ្ជើញមកម្តងទៀត។';
    if (window.escapeHTML) footerText = window.escapeHTML(footerText).replace(/\n/g, '<br>');
    receiptHTML += `<p style="text-align:center; font-size:12px; margin-top: 15px; font-weight:bold;">${footerText}</p>`;

    if (typeof window.executePrint === 'function') {
        window.executePrint(receiptHTML);
    } else {
        const printWindow = window.open('', '', 'width=380,height=650');
        if(!printWindow) return;
        printWindow.document.write('<html><head><title>Print Receipt</title>');
        printWindow.document.write('<style>@media print { body { width: 80mm; font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(receiptHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    }
};

window.downloadInvoicePNG = function() {
    const captureArea = document.getElementById('invoiceCaptureArea');
    if (!captureArea) return notifyFinanceUser("❌ រកមិនឃើញតំបន់សម្រាប់ទាញយករូបភាពទេ!", "បរាជ័យ", true);

    if (typeof html2canvas === 'undefined') {
        return notifyFinanceUser("❌ បណ្ណាល័យ html2canvas មិនទាន់បានផ្ទុកទេ!", "បរាជ័យ", true);
    }

    const cfg = typeof window.getActiveReceiptConfig === 'function'
        ? window.getActiveReceiptConfig()
        : { downloadWidthPx: 380, downloadScale: 2, fontPx: 12 };

    const origMaxWidth = captureArea.style.maxWidth;
    const origWidth = captureArea.style.width;
    captureArea.style.maxWidth = `${cfg.downloadWidthPx || 380}px`;
    captureArea.style.width = `${cfg.downloadWidthPx || 380}px`;

    html2canvas(captureArea, { scale: cfg.downloadScale || 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
        captureArea.style.maxWidth = origMaxWidth;
        captureArea.style.width = origWidth;
        const link = document.createElement('a');
        link.download = `Invoice_${window.currentActiveInvoiceId || 'Receipt'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        captureArea.style.maxWidth = origMaxWidth;
        captureArea.style.width = origWidth;
        notifyFinanceUser("❌ មានបញ្ហាក្នុងការទាញយករូបភាព: " + err.message, "បរាជ័យ", true);
    });
};

window.exportInvoicesCSV = function() {
    const invoices = window.invoices || JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    if (invoices.length === 0) return notifyFinanceUser("⚠️ គ្មានទិន្នន័យវិក្កយបត្រសម្រាប់ Export ទេ!", "ជូនដំណឹង", true);

    let csvContent = "\uFEFFលេខវិក្កយបត្រ,កាលបរិច្ឆេទ,អតិថិជន,លេខទូរស័ព្ទ,ចំណាំ,សរុបទឹកប្រាក់,ស្ថានភាព,អ្នកលក់\n";
    invoices.forEach((inv, idx) => {
        if (!inv) return;
        const id = inv.id || inv.invoiceNo || `ORD-${idx}`;
        const d = inv.date || inv.createdAt || '';
        const c = `"${(inv.customerName || inv.customer || '').replace(/"/g, '""')}"`;
        const p = `"${(inv.customerPhone || inv.phone || '').replace(/"/g, '""')}"`;
        const n = `"${(inv.note || '').replace(/"/g, '""')}"`;
        const tot = parseFloat(inv.totalAmount || inv.total || 0).toFixed(2);
        const st = inv.status || 'unpaid';
        const s = `"${(inv.seller || inv.cashier || '').replace(/"/g, '""')}"`;
        csvContent += `${id},${d},${c},${p},${n},${tot},${st},${s}\n`;
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

/* ========================================================
   🌟 ផ្នែកទី ២៖ គ្រប់គ្រងការចំណាយ (Expense Management)
   ======================================================== */

window.changeExpenseItemsPerPage = function(val) {
    window.expItemsPerPage = val === 'all' ? 'all' : parseInt(val);
    window.expCurrentPage = 1; 
    window.renderExpenses();
};

window.changeExpensePage = function(page) {
    window.expCurrentPage = page;
    window.renderExpenses();
    const container = document.getElementById('mainScroller');
    if(container) container.scrollTo({top: 0, behavior: 'smooth'});
};

function injectExpenseModalIfNeeded() {
    let modal = document.getElementById('expenseModal');
    if (!modal) {
        const modalHtml = `
        <div class="modal-overlay" id="expenseModal" style="z-index: 1005;" onclick="if(event.target === this) window.closeExpenseModal()">
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header">
                    <h2 style="font-size: var(--fs-20);">📉 កត់ត្រាចំណាយ</h2>
                    <button class="btn-outline" style="border:none; font-size: var(--fs-20); padding:0;" onclick="window.closeExpenseModal()">✕</button>
                </div>
                <div class="modal-body" style="text-align: left;">
                    <input type="hidden" id="expId">
                    <div style="margin-bottom: 15px;">
                        <label style="display:block; margin-bottom:5px; font-size: var(--fs-14);">កាលបរិច្ឆេទ (Date & Time) *</label>
                        <input type="datetime-local" id="expDate" class="form-control" style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display:block; margin-bottom:5px; font-size: var(--fs-14);">ប្រភេទចំណាយ *</label>
                        <select id="expCategory" class="form-control" style="width: 100%;">
                            <option value="ថ្លៃទឹក/ភ្លើង">⚡ ថ្លៃទឹក / ភ្លើង</option>
                            <option value="ឈ្នួលផ្ទះ/ហាង">🏠 ឈ្នួលផ្ទះ / ហាង</option>
                            <option value="ទិញសម្ភារៈ/ស្តុក">📦 ទិញសម្ភារៈ / ស្តុក</option>
                            <option value="ប្រាក់ខែបុគ្គលិក">👨‍💼 ប្រាក់ខែបុគ្គលិក</option>
                            <option value="ចំណាយផ្សេងៗ">🏷️ ចំណាយផ្សេងៗ</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display:block; margin-bottom:5px; font-size: var(--fs-14);">ទឹកប្រាក់ចំណាយ ($) *</label>
                        <input type="number" id="expAmount" class="form-control" placeholder="0.00" style="width: 100%;">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:5px; font-size: var(--fs-14);">បរិយាយ / ចំណាំ</label>
                        <textarea id="expNote" class="form-control" placeholder="សរសេរចំណាំ..." style="height: 60px; resize:none; width: 100%;"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="window.closeExpenseModal()">បោះបង់</button>
                    <button class="btn btn-primary" onclick="window.saveExpense()">រក្សាទុក</button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
}

window.openExpenseModal = function() {
    injectExpenseModalIfNeeded();
    
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
    const modal = document.getElementById('expenseModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

window.editExpense = function(id) {
    injectExpenseModalIfNeeded();
    
    let expenses = window.expenses || JSON.parse(localStorage.getItem(window.getBranchKey('expenses_pro'))) || [];
    const exp = expenses.find(e => String(e.id) === String(id));
    
    if (!exp) return notifyFinanceUser("❌ រកមិនឃើញទិន្នន័យចំណាយនេះទេ!", "បរាជ័យ", true);

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

window.saveExpense = async function() {
    const id = document.getElementById('expId').value;
    const cat = document.getElementById('expCategory').value;
    const amount = parseFloat(document.getElementById('expAmount').value);
    const note = document.getElementById('expNote').value.trim();
    const dateVal = document.getElementById('expDate') ? document.getElementById('expDate').value : '';

    if (!amount || amount <= 0) {
        return notifyFinanceUser('សូមបញ្ចូលទឹកប្រាក់ចំណាយឱ្យបានត្រឹមត្រូវ!', 'បរាជ័យ', true);
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
    
    notifyFinanceUser(id ? 'បានកែប្រែចំណាយជោគជ័យ!' : 'កត់ត្រាចំណាយបានជោគជ័យ!', 'ជោគជ័យ');
    
    window.closeExpenseModal();
    window.renderExpenses();
    if(typeof window.renderDashboard === 'function') window.renderDashboard();
};

window.renderExpenses = function() {
    const searchVal = document.getElementById('searchExpense') ? document.getElementById('searchExpense').value.toLowerCase() : '';
    const dateFrom = document.getElementById('expenseDateFrom')?.value;
    const dateTo = document.getElementById('expenseDateTo')?.value;
    const pageContainer = document.getElementById('expensePagination');
    
    const tbody = document.getElementById('expenseTableBody') || document.querySelector('#mainExpenseTable tbody');
    if (!tbody) return;

    let deletedExps = JSON.parse(localStorage.getItem('deleted_expenses_tracker')) || [];
    let validExpenses = (window.expenses || []).filter(e => !deletedExps.includes(String(e.id)));
    window.expenses = validExpenses;

    let filtered = validExpenses.filter(e => {
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

    let totalExp = 0;
    filtered.forEach(e => {
        totalExp += parseFloat(e.amount || 0);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">មិនមានទិន្នន័យចំណាយទេ</td></tr>`;
        const sumDisplay = document.querySelector('td[style*="color: var(--danger)"] b') || document.getElementById('sumExpenseDisplay') || document.getElementById('summaryTotalExpense');
        if (sumDisplay) sumDisplay.innerText = '$0.00';
        if (pageContainer) pageContainer.innerHTML = '';
        return;
    }

    let totalItems = filtered.length;
    let totalPages = 1;
    let displayItems = filtered;

    if (window.expItemsPerPage !== 'all') {
        totalPages = Math.ceil(totalItems / window.expItemsPerPage) || 1;
        if (window.expCurrentPage > totalPages) window.expCurrentPage = totalPages;
        if (window.expCurrentPage < 1) window.expCurrentPage = 1;

        let startIndex = (window.expCurrentPage - 1) * window.expItemsPerPage;
        let endIndex = startIndex + window.expItemsPerPage;
        displayItems = filtered.slice(startIndex, endIndex);
    }

    tbody.innerHTML = displayItems.map(e => {
        let amt = parseFloat(e.amount || 0);
        
        let actionButtonsHtml = '';
        // 🌟 ឆែកសិទ្ធិ: បង្ហាញប៊ូតុងកែប្រែ និងលុបចំណាយ តែ Admin និង Manager ប៉ុណ្ណោះ 🌟
        if (window.currentRole === 'admin' || window.currentRole === 'manager') {
            actionButtonsHtml = `
                <button class="btn-warning" style="padding:4px 8px; border:none; border-radius:6px; cursor:pointer;" onclick="window.editExpense('${e.id}')" title="កែប្រែ">✏️</button>
                <button class="btn-danger" style="padding:4px 8px; border:none; border-radius:6px; cursor:pointer;" onclick="window.deleteExpense('${e.id}')" title="លុបចោល">🗑️</button>
            `;
        } else {
            actionButtonsHtml = `<span style="font-size: 11px; color: var(--text-muted);">គ្មានសិទ្ធិ</span>`;
        }
        
        return `
        <tr>
            <td style="font-size: 13px; color: var(--text-muted);" data-sort="${e.timestamp || 0}">${e.date}</td>
            <td data-sort="${e.category}"><span class="badge" style="background:rgba(239,68,68,0.1); color:var(--danger); border: 1px solid rgba(239,68,68,0.3); padding:4px 8px; border-radius:6px;">${e.category}</span></td>
            <td data-sort="${amt}" style="color:var(--danger); font-weight:900; font-size:15px;">$${amt.toFixed(2)}</td>
            <td data-sort="${e.note || ''}" style="font-size: 13px;">${e.note || '-'}</td>
            <td style="text-align: center;">
                <div style="display: flex; gap: 5px; justify-content: center;">
                    ${actionButtonsHtml}
                </div>
            </td>
        </tr>
        `;
    }).join('');

    if (pageContainer) {
        if (window.expItemsPerPage === 'all' || totalItems <= window.expItemsPerPage) {
            pageContainer.innerHTML = '';
        } else {
            let pageHtml = `<button class="btn btn-outline" ${window.expCurrentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : `onclick="window.changeExpensePage(${window.expCurrentPage - 1})"`}>◀ មុន</button>`;
            pageHtml += `<span style="font-weight:bold; font-size:var(--fs-14);">ទំព័រ ${window.expCurrentPage} នៃ ${totalPages} <small style="color:var(--text-muted); font-weight:normal;">(សរុប ${totalItems} វិក្កយបត្រ)</small></span>`;
            pageHtml += `<button class="btn btn-outline" ${window.expCurrentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : `onclick="window.changeExpensePage(${window.expCurrentPage + 1})"`}>បន្ទាប់ ▶</button>`;
            pageContainer.innerHTML = pageHtml;
        }
    }

    const sumDisplay = document.querySelector('td[style*="color: var(--danger)"] b') || document.getElementById('sumExpenseDisplay') || document.getElementById('summaryTotalExpense');
    if (sumDisplay) sumDisplay.innerText = '$' + totalExp.toFixed(2);
    
    if(typeof window.filterTable === 'function') setTimeout(() => window.filterTable('mainExpenseTable'), 50);
};

window.deleteExpense = function(id) {
    // 🌟 ឆែកសិទ្ធិ: បើមិនមែន Admin ឬ Manager ទេ គឺបិទមិនអោយលុបឡើយ
    if (window.currentRole !== 'admin' && window.currentRole !== 'manager') {
        return notifyFinanceUser("❌ អ្នកមិនមានសិទ្ធិលុបទិន្នន័យនេះទេ!", "គ្មានសិទ្ធិ", true);
    }

    const executeDeleteExp = async () => {
        let deletedExps = JSON.parse(localStorage.getItem('deleted_expenses_tracker')) || [];
        deletedExps.push(String(id));
        localStorage.setItem('deleted_expenses_tracker', JSON.stringify(deletedExps));

        window.expenses = window.expenses.filter(e => String(e.id) !== String(id));
        
        if (typeof window.saveData === 'function') await window.saveData(window.userAccounts);
        window.renderExpenses();
        if(typeof window.renderDashboard === 'function') window.renderDashboard();
        
        notifyFinanceUser('លុបជោគជ័យ!', 'ជោគជ័យ');
    };

    if(typeof window.ksMsg === 'function') {
        window.ksMsg('តើអ្នកពិតជាចង់លុបកំណត់ត្រាចំណាយនេះមែនទេ?', 'បញ្ជាក់ការលុប', true, executeDeleteExp);
    } else {
        executeDeleteExp();
    }
};