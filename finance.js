// finance.js
window.currentDebtInvoiceId = null;
window.viewingInvoiceId = null;
window.editingInvoice = null;
window.originalInvoiceState = null;

window.renderUnpaid = function() {
    const searchEl = document.getElementById('searchUnpaid'); 
    const search = searchEl ? searchEl.value.toLowerCase() : ''; 
    let filterEl = document.getElementById('filterInvoiceStatus'); 
    const statusFilter = filterEl ? filterEl.value : 'all'; 
    const dateFrom = document.getElementById('invoiceDateFrom'); 
    const dateTo = document.getElementById('invoiceDateTo'); 
    const fromTime = (dateFrom && dateFrom.value) ? new Date(dateFrom.value).getTime() : 0; 
    const toTime = (dateTo && dateTo.value) ? new Date(dateTo.value).getTime() : Infinity;
    
    let filteredList = window.invoices.filter(inv => String(inv.customer).toLowerCase().includes(search) || (inv.phone && String(inv.phone).includes(search)) || String(inv.id).toLowerCase().includes(search)); 
    if (statusFilter !== 'all') filteredList = filteredList.filter(inv => inv.status === statusFilter);
    filteredList = filteredList.filter(inv => { let invTime = inv.timestamp || 0; return invTime >= fromTime && invTime <= toTime; });
    filteredList.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    if (window.currentRole !== 'admin' && window.activeUser) { 
        let sellerNameToCheck = window.activeUser.fullName ? window.activeUser.fullName : window.activeUser.username; 
        filteredList = filteredList.filter(inv => inv.seller === sellerNameToCheck); 
    }
    const isAdmin = window.currentRole === 'admin'; 
    let sumPaid = 0; let sumUnpaid = 0; let finalHtml = '';
    
    filteredList.forEach(inv => {
        let invPaid = inv.paidUsd || 0; 
        let remaining = inv.totalAmount - invPaid; if (remaining < 0) remaining = 0;
        if(inv.status === 'paid') sumPaid += inv.totalAmount; 
        else if(inv.status === 'unpaid' || inv.status === 'preorder') { sumPaid += invPaid; sumUnpaid += remaining; }
        
        let itemsSummary = inv.items.map(i => `${i.name} (x${i.cartQty})`).join(', '); 
        if(itemsSummary.length > 35) itemsSummary = itemsSummary.substring(0, 35) + '...';
        
        let statusBadge = '';
        if (inv.status === 'paid') statusBadge = '<span class="badge badge-paid">ទូទាត់រួច</span>';
        else if (inv.status === 'preorder') statusBadge = '<span class="badge" style="background:#8b5cf6; color:white;">កក់ប្រាក់</span>';
        else statusBadge = '<span class="badge badge-unpaid">រង់ចាំទូទាត់</span>';

        let actionBtns = `<button class="btn btn-outline" style="padding: 6px; font-size: var(--fs-12); color: var(--primary); border-color: var(--primary);" onclick="window.viewInvoice('${inv.id}')" title="មើលលម្អិត និងព្រីន">👁️ មើល</button>`;
        if (inv.status === 'unpaid' || inv.status === 'preorder') {
            actionBtns += `${isAdmin ? `<button class="btn btn-outline" style="padding: 6px; font-size: var(--fs-12); color: var(--warning); border-color: var(--warning);" onclick="window.openInvoiceEdit('${inv.id}')">✏️ កែប្រែ</button>` : ''}<button class="btn btn-success" style="padding: 6px 12px; font-size: var(--fs-12);" onclick="window.settlePayment('${inv.id}')">💸 ទូទាត់ប្រាក់</button>`;
        }
        if (isAdmin) actionBtns += `<button class="btn-danger" style="border:none; padding: 6px 8px; font-size: var(--fs-12); border-radius: 4px; cursor:pointer;" onclick="window.deleteInvoice('${inv.id}')" title="លុបវិក្កយបត្រនេះចោល">🗑️ លុប</button>`; 
        
        let totalDisplay = (inv.status === 'unpaid' || inv.status === 'preorder') ? `<div style="font-size:var(--fs-12); color:var(--text-muted);">សរុប: ${window.fMoney(inv.totalAmount)}</div>${invPaid > 0 ? `<div style="font-size:var(--fs-12); color:var(--success);">បានទូទាត់: ${window.fMoney(invPaid)}</div>` : ''}<div style="font-size:var(--fs-14); font-weight:bold; color:var(--danger); margin-top:2px;">ខ្វះ: ${window.fMoney(remaining)}</div>` : `<div style="font-weight:bold; color:var(--success);">${window.fMoney(inv.totalAmount)}</div>${inv.totalRiel > 0 ? `<div style="font-size: var(--fs-11); color: var(--text-muted);">${inv.totalRiel.toLocaleString()} ៛</div>` : ''}`;
        
        finalHtml += `<tr data-paid="${invPaid}" data-unpaid="${remaining}"><td data-sort="${inv.id}" style="font-size:var(--fs-12); font-family:monospace; color:var(--text-muted);">${inv.id}</td><td data-sort="${inv.timestamp||0}" style="font-size:var(--fs-12);">${inv.date}</td><td data-sort="${inv.customer}" style="font-weight:bold; color:var(--text-main);">${inv.customer}<br><span style="font-size:var(--fs-11); font-weight:normal; color:var(--text-muted);">${inv.phone||''}</span></td><td data-sort="${itemsSummary}" style="font-size:var(--fs-12);" title="${inv.items.map(i => i.name).join(', ')}">${itemsSummary}</td><td data-sort="${inv.totalAmount}">${totalDisplay}</td><td data-sort="${inv.status}">${statusBadge}</td>${isAdmin ? `<td data-sort="${inv.seller||''}" style="color:var(--primary); font-size:var(--fs-12); font-weight:bold;">${inv.seller||'N/A'}</td>` : ''}<td style="text-align: center;"><div style="display: inline-flex; gap: 5px; justify-content: center;">${actionBtns}</div></td></tr>`;
    });
    
    const unpaidTableEl = document.getElementById('unpaidTable');
    if(unpaidTableEl) unpaidTableEl.innerHTML = finalHtml || `<tr><td colspan="${isAdmin ? 8 : 7}" style="text-align:center;">មិនមានទិន្នន័យទេ</td></tr>`;
    
    const sPaidEl = document.getElementById('summaryInvoicePaid'); if(sPaidEl) sPaidEl.innerText = window.fMoney(sumPaid); 
    const sUnpaidEl = document.getElementById('summaryInvoiceUnpaid'); if(sUnpaidEl) sUnpaidEl.innerText = window.fMoney(sumUnpaid); 
    if(typeof window.filterTable === 'function') setTimeout(() => window.filterTable('mainUnpaidTable'), 50);
};

window.exportInvoicesCSV = function() {
    if(window.invoices.length === 0) return window.ksMsg('គ្មានទិន្នន័យដើម្បីទាញយកទេ!');
    const isAdmin = window.currentRole === 'admin'; 
    let csv = '\uFEFFលេខវិក្កយបត្រ,កាលបរិច្ឆេទ,អតិថិជន,លេខទូរស័ព្ទ,ទំនិញ(សង្ខេប),ថ្លៃដើមសរុប($),ប្រាក់ចំណូលសរុប($),ប្រាក់ចំណេញ($),ស្ថានភាព'; 
    if(isAdmin) csv += ',អ្នកលក់'; csv += '\n';

    window.invoices.forEach(inv => {
        let id = `"${inv.id}"`; 
        let date = `"${inv.date}"`; 
        let cust = `"${inv.customer ? String(inv.customer).replace(/"/g, '""') : ''}"`; 
        let phone = `"${inv.phone ? String(inv.phone).replace(/"/g, '""') : ''}"`; 
        let itemsStr = ''; let totalCogs = 0;
        if(inv.items) { 
            itemsStr = inv.items.map(i => `${i.name}(x${i.cartQty})`).join('; '); 
            inv.items.forEach(item => { totalCogs += ((parseFloat(item.cost) || 0) * (parseInt(item.cartQty) || 0)); }); 
        }
        let items = `"${itemsStr.replace(/"/g, '""')}"`; 
        let revenue = parseFloat(inv.totalAmount) || 0; 
        let profit = revenue - totalCogs; 
        let status = `"${inv.status === 'paid' ? 'ទូទាត់រួច' : (inv.status === 'preorder' ? 'កក់ប្រាក់' : 'រង់ចាំទូទាត់')}"`; 
        csv += `${id},${date},${cust},${phone},${items},${totalCogs.toFixed(2)},${revenue.toFixed(2)},${profit.toFixed(2)},${status}`; 
        if(isAdmin) csv += `,"${inv.seller ? String(inv.seller).replace(/"/g, '""') : ''}"`; 
        csv += '\n';
    });
    const a = document.createElement('a'); 
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); 
    a.download = `Invoices_Profit_Report_${Date.now()}.csv`; 
    a.click();
};

window.settlePayment = function(invoiceId) {
    const inv = window.invoices.find(i => i.id === invoiceId); if(!inv) return;
    window.currentDebtInvoiceId = invoiceId; 
    let paid = inv.paidUsd || 0; 
    let remaining = inv.totalAmount - paid; if(remaining < 0) remaining = 0;
    document.getElementById('debtTotalDisplay').innerText = window.fMoney(inv.totalAmount); 
    document.getElementById('debtPaidDisplay').innerText = window.fMoney(paid); 
    document.getElementById('debtRemainingDisplay').innerText = window.fMoney(remaining); 
    document.getElementById('debtPayUsd').value = ''; 
    document.getElementById('debtPayRiel').value = ''; 
    document.getElementById('debtChangeDisplay').innerText = '$0.00 | 0 ៛'; 
    document.getElementById('debtPaymentModal').style.display = 'flex'; 
    setTimeout(() => document.getElementById('debtPayUsd').focus(), 100);
};

window.calculateDebtChange = function() {
    if(!window.currentDebtInvoiceId) return; 
    const inv = window.invoices.find(i => i.id === window.currentDebtInvoiceId);
    let rate = inv.rate || window.cartRate || 4000; 
    let paid = inv.paidUsd || 0; 
    let remainingUsd = inv.totalAmount - paid; if(remainingUsd < 0) remainingUsd = 0;
    let payUsd = parseFloat(document.getElementById('debtPayUsd').value) || 0; 
    let payRiel = parseFloat(document.getElementById('debtPayRiel').value) || 0;
    let changeRiel = ((payUsd * rate) + payRiel) - (remainingUsd * rate); if (changeRiel < 0) changeRiel = 0;
    document.getElementById('debtChangeDisplay').innerText = `${window.fMoney(changeRiel / rate)} | ${Math.round(changeRiel).toLocaleString()} ៛`;
};

window.processDebtPayment = function() {
    if(!window.currentDebtInvoiceId) return; 
    const inv = window.invoices.find(i => i.id === window.currentDebtInvoiceId); if(!inv) return;
    let rate = inv.rate || window.cartRate || 4000; 
    let payUsdText = document.getElementById('debtPayUsd').value;
    let payRielText = document.getElementById('debtPayRiel').value;
    let payUsd = parseFloat(payUsdText) || 0; 
    let payRiel = parseFloat(payRielText) || 0;
    let remainingUsd = inv.totalAmount - (inv.paidUsd || 0);

    if (!payUsdText && !payRielText) {
        payUsd = remainingUsd;
        payRiel = 0;
    }

    let paymentInUsd = payUsd + (payRiel / rate); 
    if (paymentInUsd <= 0) return window.ksMsg('សូមបញ្ចូលចំនួនប្រាក់ដែលត្រូវទូទាត់!');

    inv.paidUsd = (inv.paidUsd || 0) + paymentInUsd;
    if (inv.paidUsd >= inv.totalAmount - 0.01) { 
        inv.status = 'paid'; 
        inv.paidUsd = inv.totalAmount; 
        window.logAction('update', inv.customer, 0, `បានទូទាត់ប្រាក់គ្រប់ចំនួន ${window.fMoney(paymentInUsd)} សម្រាប់វិក្កយបត្រ ${inv.id}`, window.activeUser); 
    } else { 
        window.logAction('update', inv.customer, 0, `បានទូទាត់ប្រាក់ ${window.fMoney(paymentInUsd)} (នៅខ្វះ ${window.fMoney(inv.totalAmount - inv.paidUsd)}) សម្រាប់វិក្កយបត្រ ${inv.id}`, window.activeUser); 
    }
    
    document.getElementById('debtPaymentModal').style.display = 'none'; 
    window.saveData(window.userAccounts); 
    window.ksMsg('ការទូទាត់ត្រូវបានកត់ត្រាចូលបញ្ជីជោគជ័យ!', 'ជោគជ័យ');
    window.renderUnpaid();
};

window.openExpenseModal = function() { 
    if(window.currentRole !== 'admin') return window.ksMsg('មានតែ Admin ប៉ុណ្ណោះដែលអាចកត់ត្រាចំណាយបាន!'); 
    document.getElementById('expAmount').value = ''; 
    document.getElementById('expNote').value = ''; 
    document.getElementById('expenseModal').style.display = 'flex'; 
    setTimeout(() => document.getElementById('expAmount').focus(), 100); 
};

window.closeExpenseModal = function() { 
    document.getElementById('expenseModal').style.display = 'none'; 
};

window.saveExpense = function() {
    const category = document.getElementById('expCategory').value; 
    const amount = parseFloat(document.getElementById('expAmount').value) || 0; 
    const note = document.getElementById('expNote').value.trim();
    if(amount <= 0) return window.ksMsg('សូមបញ្ចូលទឹកប្រាក់ចំណាយឱ្យបានត្រឹមត្រូវ!');
    let executor = window.activeUser ? (window.activeUser.fullName ? window.activeUser.fullName : window.activeUser.username) : 'Admin';
    window.expenses.unshift({ id: 'EXP_' + Date.now(), timestamp: Date.now(), date: window.fDate(), category: category, amount: amount, note: note, seller: executor });
    window.logAction('add', category, amount, `កត់ត្រាចំណាយ: ${window.fMoney(amount)} (${note||'គ្មានចំណាំ'})`, window.activeUser); 
    window.saveData(window.userAccounts); 
    window.closeExpenseModal(); 
    window.ksMsg('ការចំណាយត្រូវបានកត់ត្រាជោគជ័យ!', 'ជោគជ័យ');
    window.renderExpenses();
};

window.renderExpenses = function() {
    const tbody = document.getElementById('expenseTableBody'); if(!tbody) return;
    const searchEl = document.getElementById('searchExpense');
    const search = searchEl ? searchEl.value.toLowerCase() : ''; 
    let totalExp = 0; let finalHtml = '';
    
    window.expenses.filter(e => String(e.category).toLowerCase().includes(search) || (e.note && String(e.note).toLowerCase().includes(search))).forEach(e => {
        totalExp += e.amount; 
        let deleteBtn = window.currentRole === 'admin' ? `<button class="btn-danger" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="window.deleteExpense('${e.id}')">🗑️ លុប</button>` : '';
        finalHtml += `<tr><td style="font-size:var(--fs-12); color:var(--text-muted);">${e.date}</td><td><span class="badge badge-unpaid">${e.category}</span></td><td style="font-weight:bold; color:var(--danger);">${window.fMoney(e.amount)}</td><td style="font-size:var(--fs-12);">${e.note||'-'}</td><td style="text-align: center;">${deleteBtn}</td></tr>`;
    });
    tbody.innerHTML = finalHtml || '<tr><td colspan="5" style="text-align:center;">មិនទាន់មានទិន្នន័យចំណាយទេ</td></tr>'; 
    const sumExpEl = document.getElementById('summaryTotalExpense');
    if(sumExpEl) sumExpEl.innerText = window.fMoney(totalExp);
    if(typeof window.filterTable === 'function') window.filterTable('mainExpenseTable');
};

window.deleteExpense = function(id) { 
    if(window.currentRole !== 'admin') return; 
    window.ksMsg('តើអ្នកពិតជាចង់លុបការចំណាយនេះមែនទេ?', 'បញ្ជាក់ការលុប', true, () => { 
        let idx = window.expenses.findIndex(e => e.id === id);
        if(idx !== -1) window.expenses.splice(idx, 1);
        window.saveData(window.userAccounts); 
        window.renderExpenses(); 
        window.ksMsg('ការចំណាយត្រូវបានលុប!'); 
    });
};

window.viewInvoice = function(id) {
    const inv = window.invoices.find(i => i.id === id); if(!inv) return; 
    window.viewingInvoiceId = id; 
    document.getElementById('viewShopName').innerText = window.shopName; 
    const contactDisplay = document.getElementById('viewShopContact'); 
    if (window.shopPhone || window.shopAddress) { 
        contactDisplay.innerHTML = `${window.shopPhone ? `Tel: ${window.shopPhone}<br>` : ''}${window.shopAddress ? `${window.shopAddress}` : ''}`; 
        contactDisplay.style.display = 'block'; 
    } else {
        contactDisplay.style.display = 'none';
    }
    const logoImg = document.getElementById('viewInvoiceLogo'); 
    if(window.shopLogo) { 
        logoImg.src = window.shopLogo; logoImg.style.display = 'block'; logoImg.style.filter = 'grayscale(100%)'; 
    } else {
        logoImg.style.display = 'none';
    }
    
    let docType = 'វិក្កយបត្រ / Invoice';
    if (inv.status === 'paid') docType = 'បង្កាន់ដៃទទួលប្រាក់ / Receipt';
    else if (inv.status === 'preorder') docType = 'បង្កាន់ដៃកក់ប្រាក់ / Pre-order Receipt';
    document.getElementById('viewInvoiceType').innerText = docType;
    
    document.getElementById('viewInvoiceDate').innerHTML = `កាលបរិច្ឆេទ: ${inv.date}<br>អ្នកលក់: ${inv.seller||'N/A'}`; 
    document.getElementById('viewInvoiceIdDisplay').innerText = `លេខវិក្កយបត្រ: ${inv.id}`;
    
    let content = `<div style="margin-bottom: 8px; border-bottom: 1px dashed #000; padding-bottom: 8px;">`;
    if(inv.customer && inv.customer !== 'អតិថិជនទូទៅ') content += `<p style="margin:2px 0; font-size: var(--fs-12); color:#000; text-align:left;">អតិថិជន: <b>${inv.customer}</b> ${inv.phone?`(${inv.phone})`:''}</p>`;
    content += `</div><table style="width: 100%; text-align: left; border-collapse: collapse; font-size: var(--fs-13); color:#000; table-layout: fixed;"><thead><tr><th style="padding-bottom: 4px; color:#000; width: 50%; border-bottom: 1px solid #000;">ទំនិញ</th><th style="padding-bottom: 4px; text-align:center; color:#000; width: 20%; border-bottom: 1px solid #000;">ចំនួន</th><th style="padding-bottom: 4px; text-align:right; color:#000; width: 30%; border-bottom: 1px solid #000;">សរុប</th></tr></thead><tbody>`;
    
    inv.items.forEach(item => { 
        let lineStr = '', uPriceStr = ''; 
        if(item.price > 0) { lineStr = window.fMoney(item.price * item.cartQty); uPriceStr = window.fMoney(item.price); } 
        else if(item.riel > 0) { lineStr = ((item.riel||0) * item.cartQty).toLocaleString() + ' ៛'; uPriceStr = item.riel.toLocaleString() + ' ៛'; } 
        else { lineStr = '$0.00'; uPriceStr = '$0.00'; } 
        content += `<tr><td colspan="3" style="padding-top: 6px; color:#000; font-weight:bold; font-size: var(--fs-13);">${item.name}</td></tr><tr><td style="padding-bottom: 6px; color:#000; font-size: var(--fs-12);">${uPriceStr}</td><td style="text-align:center; padding-bottom: 6px; color:#000; font-size: var(--fs-12);">${item.cartQty} ${item.unit||''}</td><td style="text-align:right; color:#000; font-weight:bold; padding-bottom: 6px;">${lineStr}</td></tr>`; 
    });
    
    content += `</tbody></table><div style="border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px;"><table style="width:100%; font-size: var(--fs-13); color:#000; margin-top: 5px;">`;
    if (inv.discount > 0) content += `<tr><td>បញ្ចុះតម្លៃ:</td><td style="text-align:right;">${(inv.discountType||'%') === '%' ? `${inv.discount}%` : window.fMoney(inv.discount)}</td></tr>`;
    if (inv.taxRate && inv.taxRate > 0) content += `<tr><td>VAT (${inv.taxRate}%):</td><td style="text-align:right;">បូកបញ្ចូល</td></tr>`;
    content += `<tr><td style="font-weight:bold; font-size:var(--fs-16); padding-top:6px;">សរុបប្រាក់:</td><td style="text-align:right; font-weight:bold; font-size:var(--fs-16); padding-top:6px;">${window.fMoney(inv.totalAmount)}</td></tr>`; 
    if(inv.totalRiel > 0) content += `<tr><td></td><td style="text-align:right; font-weight:bold; font-size:var(--fs-16);">${inv.totalRiel.toLocaleString()} ៛</td></tr>`;
    
    if(inv.status === 'paid' && (inv.receivedUsd > 0 || inv.receivedRiel > 0)) { 
        let rStr = []; if(inv.receivedUsd > 0) rStr.push(window.fMoney(inv.receivedUsd)); if(inv.receivedRiel > 0) rStr.push(inv.receivedRiel.toLocaleString() + ' ៛'); 
        content += `<tr><td style="padding-top:6px; font-size:var(--fs-12);">ប្រាក់ទទួល:</td><td style="text-align:right; padding-top:6px; font-size:var(--fs-12);">${rStr.join(' | ')}</td></tr>`; 
        let cStr = []; if(inv.changeUsd > 0 || inv.changeRiel > 0) { cStr.push(window.fMoney(inv.changeUsd)); cStr.push(Math.round(inv.changeRiel).toLocaleString() + ' ៛'); } else cStr.push('$0.00'); 
        content += `<tr><td style="font-size:var(--fs-12);">ប្រាក់អាប់:</td><td style="text-align:right; font-size:var(--fs-12);">${cStr.join(' | ')}</td></tr>`; 
    } else if ((inv.status === 'preorder' || inv.status === 'unpaid') && inv.paidUsd > 0) {
        content += `<tr><td style="padding-top:6px; font-size:var(--fs-12);">ប្រាក់បានទូទាត់:</td><td style="text-align:right; padding-top:6px; font-size:var(--fs-12);">${window.fMoney(inv.paidUsd)}</td></tr>`;
        let remaining = inv.totalAmount - inv.paidUsd;
        if (remaining < 0) remaining = 0;
        content += `<tr><td style="font-size:var(--fs-12); font-weight:bold; color:var(--danger);">ប្រាក់នៅខ្វះ:</td><td style="text-align:right; font-size:var(--fs-12); font-weight:bold; color:var(--danger);">${window.fMoney(remaining)}</td></tr>`;
    }

    content += `</table>`;
    if (window.shopQR) content += `<div style="text-align:center; margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px;"><p style="font-size:12px; margin-bottom:5px; font-weight:bold; color:#000;">ស្កេនទូទាត់ប្រាក់ (Scan to Pay)</p><img src="${window.shopQR}" style="width: 180px; height: 180px; object-fit: contain; filter: grayscale(100%);"></div>`;
    content += `<div style="text-align: center; font-size: var(--fs-11); color:#555; margin-top: 10px;">(Rate: 1$ = ${inv.rate||4000}៛)</div></div><div style="text-align:center; font-size:var(--fs-12); color:#000; margin-top: 15px; font-weight:bold;">សូមអរគុណ! សូមអញ្ជើញមកម្តងទៀត។</div>`;
    
    document.getElementById('invoiceViewContent').innerHTML = content; 
    document.getElementById('invoiceViewModal').style.display = 'flex';
};

window.closeInvoiceViewModal = function() { 
    document.getElementById('invoiceViewModal').style.display = 'none'; 
    window.viewingInvoiceId = null; 
};

window.reprintInvoice = function() {
    if(!window.viewingInvoiceId) return; 
    const inv = window.invoices.find(i => i.id === window.viewingInvoiceId); 
    let receiptHTML = `<div style="text-align:center; margin-bottom: 8px;">`; 
    if(window.shopLogo) receiptHTML += `<img src="${window.shopLogo}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 50%; margin-bottom: 5px; filter: grayscale(100%);">`; 
    receiptHTML += `<h2 style="margin:0; font-size:16px;">${window.shopName}</h2>`; 
    if(window.shopPhone) receiptHTML += `<p style="margin:2px 0; font-size:12px;">Tel: ${window.shopPhone}</p>`; 
    if(window.shopAddress) receiptHTML += `<p style="margin:2px 0; font-size:12px;">${window.shopAddress}</p>`; 
    
    let docType = 'វិក្កយបត្រចម្លង / Invoice Copy';
    if (inv.status === 'paid') docType = 'បង្កាន់ដៃចម្លង / Receipt Copy';
    else if (inv.status === 'preorder') docType = 'បង្កាន់ដៃកក់ប្រាក់ (ចម្លង) / Pre-order Copy';

    receiptHTML += `<div class="print-dashed-line"></div><p style="margin:4px 0; font-size:14px; font-weight:bold;">${docType}</p><p style="margin:2px 0; font-size:11px; text-align:left;">កាលបរិច្ឆេទ: ${inv.date}</p><p style="margin:2px 0; font-size:11px; text-align:left;">លេខវិក្កយបត្រ: ${inv.id}</p><p style="margin:2px 0; font-size:11px; text-align:left;">អ្នកលក់: ${inv.seller||'N/A'}</p>`;
    if(inv.customer && inv.customer !== 'អតិថិជនទូទៅ') receiptHTML += `<p style="margin:2px 0; font-size:11px; text-align:left;">អតិថិជន: <b>${inv.customer}</b> ${inv.phone?`(${inv.phone})`:''}</p>`;
    receiptHTML += `<div class="print-dashed-line"></div></div><table style="width:100%; text-align:left; font-size: 12px; table-layout: fixed;"><thead><tr><th style="width: 50%; border-bottom: 1px solid #000; padding-bottom: 4px;">ទំនិញ</th><th style="width: 20%; text-align:center; border-bottom: 1px solid #000; padding-bottom: 4px;">ចំនួន</th><th style="width: 30%; text-align:right; border-bottom: 1px solid #000; padding-bottom: 4px;">សរុប</th></tr></thead><tbody>`;
    
    inv.items.forEach(c => { 
        let lineStr = '', uPriceStr = ''; 
        if(c.price > 0) { lineStr = window.fMoney(c.price * c.cartQty); uPriceStr = window.fMoney(c.price); } 
        else if(c.riel > 0) { lineStr = ((c.riel||0) * c.cartQty).toLocaleString() + ' ៛'; uPriceStr = c.riel.toLocaleString() + ' ៛'; } 
        else { lineStr = '$0.00'; uPriceStr = '$0.00'; } 
        receiptHTML += `<tr><td colspan="3" style="padding-top: 4px; font-weight:bold; font-size: 12px;">${c.name}</td></tr><tr><td style="padding-bottom: 4px; font-size: 11px;">${uPriceStr}</td><td style="text-align:center; padding-bottom: 4px; font-size: 11px;">${c.cartQty} ${c.unit||''}</td><td style="text-align:right; font-weight:bold; padding-bottom: 4px;">${lineStr}</td></tr>`; 
    });
    
    receiptHTML += `</tbody></table><div class="print-dashed-line"></div><table style="width:100%; font-size: 12px; margin-top: 5px;">`;
    if (inv.discount > 0) receiptHTML += `<tr><td>បញ្ចុះតម្លៃ:</td><td style="text-align:right;">${(inv.discountType||'%') === '%' ? `${inv.discount}%` : window.fMoney(inv.discount)}</td></tr>`;
    if (inv.taxRate && inv.taxRate > 0) receiptHTML += `<tr><td>VAT (${inv.taxRate}%):</td><td style="text-align:right;">បូកបញ្ចូល</td></tr>`;
    receiptHTML += `<tr><td style="font-weight:bold; font-size:14px; padding-top:4px;">សរុបប្រាក់:</td><td style="text-align:right; font-weight:bold; font-size:14px; padding-top:4px;">${window.fMoney(inv.totalAmount)}</td></tr>`; 
    if(inv.totalRiel > 0) receiptHTML += `<tr><td></td><td style="text-align:right; font-weight:bold; font-size:14px;">${inv.totalRiel.toLocaleString()} ៛</td></tr>`;
    
    if(inv.status === 'paid' && (inv.receivedUsd > 0 || inv.receivedRiel > 0)) { 
        let rStr = []; if(inv.receivedUsd > 0) rStr.push(window.fMoney(inv.receivedUsd)); if(inv.receivedRiel > 0) rStr.push(inv.receivedRiel.toLocaleString() + ' ៛'); 
        receiptHTML += `<tr><td style="padding-top:4px; font-size:11px;">ប្រាក់ទទួល:</td><td style="text-align:right; padding-top:4px; font-size:11px;">${rStr.join(' | ')}</td></tr>`; 
        let cStr = []; if(inv.changeUsd > 0 || inv.changeRiel > 0) { cStr.push(window.fMoney(inv.changeUsd)); cStr.push(Math.round(inv.changeRiel).toLocaleString() + ' ៛'); } else cStr.push('$0.00'); 
        receiptHTML += `<tr><td style="font-size:11px;">ប្រាក់អាប់:</td><td style="text-align:right; font-size:11px;">${cStr.join(' | ')}</td></tr>`; 
    } else if ((inv.status === 'preorder' || inv.status === 'unpaid') && inv.paidUsd > 0) {
        receiptHTML += `<tr><td style="padding-top:4px; font-size:11px;">ប្រាក់បានទូទាត់:</td><td style="text-align:right; padding-top:4px; font-size:11px;">${window.fMoney(inv.paidUsd)}</td></tr>`;
        let remaining = inv.totalAmount - inv.paidUsd;
        if (remaining < 0) remaining = 0;
        receiptHTML += `<tr><td style="font-size:11px; font-weight:bold;">ប្រាក់នៅខ្វះ:</td><td style="text-align:right; font-size:11px; font-weight:bold;">${window.fMoney(remaining)}</td></tr>`;
    }

    receiptHTML += `</table>`;
    if (window.shopQR) receiptHTML += `<div style="text-align:center; margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px;"><p style="font-size:12px; margin-bottom:5px; font-weight:bold;">ស្កេនទូទាត់ប្រាក់ (Scan to Pay)</p><img src="${window.shopQR}" style="width: 180px; height: 180px; object-fit: contain; filter: grayscale(100%);"></div>`;
    receiptHTML += `<p style="text-align:center; font-size:10px; margin-top: 10px;">(Rate: 1$ = ${inv.rate||4000}៛)</p><p style="text-align:center; font-size:12px; margin-top: 5px; font-weight:bold;">សូមអរគុណ! សូមអញ្ជើញមកម្តងទៀត។</p>`; 
    
    const printWindow = window.open('', '', 'width=300,height=600');
    if(!printWindow) return;
    printWindow.document.write('<html><head><title>Print Receipt</title>');
    printWindow.document.write('<link rel="stylesheet" href="print.css" type="text/css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div id="receipt-container">');
    printWindow.document.write(receiptHTML);
    printWindow.document.write('</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
};

window.downloadInvoicePNG = function() { 
    if(typeof html2canvas !== 'function') return window.ksMsg('បណ្ណាល័យបង្កើតរូបភាពមិនទាន់ដំណើរការទេ!');
    html2canvas(document.getElementById('invoiceCaptureArea'), { backgroundColor: '#ffffff', scale: 2, useCORS: true }).then(canvas => { 
        const a = document.createElement('a'); 
        a.href = canvas.toDataURL('image/png'); 
        a.download = `Invoice_${window.viewingInvoiceId||Date.now()}.png`; 
        a.click(); 
    }).catch(() => window.ksMsg("មានបញ្ហាក្នុងការបង្កើតរូបភាព។")); 
};

window.openInvoiceEdit = function(id) { 
    if (window.currentRole !== 'admin') return window.ksMsg('មានតែ Admin ប៉ុណ្ណោះដែលអាចកែប្រែវិក្កយបត្របាន!', 'គ្មានសិទ្ធិ'); 
    const inv = window.invoices.find(i => i.id === id); if(!inv) return; 
    window.originalInvoiceState = JSON.parse(JSON.stringify(inv)); 
    window.editingInvoice = JSON.parse(JSON.stringify(inv)); 
    document.getElementById('editInvId').value = window.editingInvoice.id; 
    document.getElementById('editInvName').value = window.editingInvoice.customer; 
    document.getElementById('editInvPhone').value = window.editingInvoice.phone||''; 
    window.renderEditInvoiceItems(); 
    document.getElementById('invoiceEditModal').style.display = 'flex'; 
};

window.closeInvoiceEditModal = function() { 
    document.getElementById('invoiceEditModal').style.display = 'none'; 
    window.editingInvoice = null; 
    window.originalInvoiceState = null; 
};

window.renderEditInvoiceItems = function() {
    const tbody = document.getElementById('editInvItemsList'); if(!tbody) return;
    let total = 0; let totalRiel = 0; let fHtml = '';
    window.editingInvoice.items.forEach((item, index) => { 
        let lineTotal = item.price * item.cartQty; total += lineTotal; 
        let lineTotalRiel = (item.riel||0) * item.cartQty; totalRiel += lineTotalRiel; 
        let pStr = item.price > 0 ? window.fMoney(item.price) : (item.riel ? Number(item.riel).toLocaleString()+'៛' : '$0.00'); 
        let tStr = item.price > 0 ? window.fMoney(lineTotal) : (item.riel ? Number(lineTotalRiel).toLocaleString()+'៛' : '$0.00'); 
        
        fHtml += `<tr><td style="padding: 10px 0;">${item.name} <br><span style="color:var(--text-muted); font-size:var(--fs-11);">${pStr}/${item.unit||'ឯកតា'}</span></td><td style="text-align: center;"><div style="display:flex; justify-content:center; align-items:center; gap:5px; background:var(--bg-dark); padding:2px; border-radius:6px; border:1px solid var(--border); width:max-content; margin:auto;"><button class="qty-btn" onclick="window.updateEditInvQty(${index}, -1)" style="width:20px; height:20px; font-size:var(--fs-12);"> - </button><span style="font-size:var(--fs-13); font-weight:bold; width:20px; text-align:center;">${item.cartQty}</span><button class="qty-btn" onclick="window.updateEditInvQty(${index}, 1)" style="width:20px; height:20px; font-size:var(--fs-12);"> + </button></div></td><td style="text-align: right; color:var(--text-muted);">${pStr}</td><td style="text-align: right; font-weight:bold; color:var(--success);">${tStr}</td><td style="text-align: center;"><button class="btn-danger" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="window.removeEditInvItem(${index})">🗑️</button></td></tr>`; 
    });
    tbody.innerHTML = fHtml || '<tr><td colspan="5" style="text-align:center; padding: 20px;">មិនមានទំនិញទេ</td></tr>';
    window.editingInvoice.totalAmount = total; 
    window.editingInvoice.totalRiel = totalRiel; 
    document.getElementById('editInvTotalPreview').innerHTML = `${window.fMoney(total)} ${totalRiel > 0 ? `<br><span style="font-size:14px; color:var(--text-muted);">${Number(totalRiel).toLocaleString()} ៛</span>` : ''}`;
};

window.updateEditInvQty = function(index, change) { 
    const item = window.editingInvoice.items[index]; 
    const realItem = window.inventory.find(i => i.id === item.id); 
    const origItem = window.originalInvoiceState.items.find(i => i.id === item.id); 
    const maxAllowed = realItem ? (realItem.qty + (origItem?origItem.cartQty:0)) : (origItem?origItem.cartQty:0); 
    if(change > 0 && item.cartQty >= maxAllowed) return window.ksMsg('ស្តុកមិនគ្រប់គ្រាន់ទេ!'); 
    item.cartQty += change; 
    if(item.cartQty <= 0) window.editingInvoice.items.splice(index, 1); 
    window.renderEditInvoiceItems(); 
};

window.removeEditInvItem = function(index) { 
    window.editingInvoice.items.splice(index, 1); 
    window.renderEditInvoiceItems(); 
};

window.addItemToEditingInvoice = function() { 
    const select = document.getElementById('editInvAddItemSelect'); 
    const itemId = select.value; if(!itemId) return; 
    const realItem = window.inventory.find(i => i.id === itemId); if(!realItem || realItem.qty <= 0) return window.ksMsg('ទំនិញនេះអស់ពីស្តុកហើយ!'); 
    const existIdx = window.editingInvoice.items.findIndex(i => i.id === itemId); 
    if(existIdx !== -1) window.updateEditInvQty(existIdx, 1); 
    else { 
        window.editingInvoice.items.push({...realItem, cartQty: 1}); 
        window.renderEditInvoiceItems(); 
    } 
    select.value = ''; 
};

window.saveInvoiceChanges = function() { 
    const newName = document.getElementById('editInvName').value.trim(); 
    const newPhone = document.getElementById('editInvPhone').value.trim(); 
    if(!newName) return window.ksMsg("សូមបញ្ចូលឈ្មោះអតិថិជន!"); 
    if(window.editingInvoice.items.length === 0) return window.ksMsg("វិក្កយបត្រត្រូវតែមានទំនិញយ៉ាងហោចណាស់១!"); 
    
    const origMap = {}; window.originalInvoiceState.items.forEach(i => origMap[i.id] = i.cartQty); 
    const newMap = {}; window.editingInvoice.items.forEach(i => newMap[i.id] = i.cartQty); 
    
    new Set([...Object.keys(origMap), ...Object.keys(newMap)]).forEach(itemId => { 
        const diff = (newMap[itemId]||0) - (origMap[itemId]||0); 
        if(diff !== 0) { 
            const invItem = window.inventory.find(p => p.id === itemId); 
            if(invItem) { 
                invItem.qty -= diff; 
                window.logAction('update', invItem.name, Math.abs(diff), diff > 0 ? `បន្ថែមទៅវិក្កយបត្ររង់ចាំទូទាត់ ${newName}` : `ដកចេញពីវិក្កយបត្ររង់ចាំទូទាត់ ${newName}`, window.activeUser); 
            } 
        } 
    }); 
    
    const targetInvoice = window.invoices.find(i => i.id === window.editingInvoice.id); 
    if(targetInvoice) { 
        targetInvoice.customer = newName; 
        targetInvoice.phone = newPhone; 
        targetInvoice.items = [...window.editingInvoice.items]; 
        targetInvoice.totalAmount = window.editingInvoice.totalAmount; 
        targetInvoice.totalRiel = window.editingInvoice.totalRiel; 
        window.logAction('update', newName, 0, 'កែប្រែទិន្នន័យវិក្កយបត្រ', window.activeUser); 
    } 
    window.setAutoRegisterCustomer ? window.setAutoRegisterCustomer(newName, newPhone) : null; 
    window.saveData(window.userAccounts); 
    window.closeInvoiceEditModal(); 
    window.ksMsg("វិក្កយបត្រត្រូវបានកែប្រែជោគជ័យ!", "ជោគជ័យ"); 
    window.renderUnpaid(); 
};

window.populateEditInvoiceSelect = function() { 
    const select = document.getElementById('editInvAddItemSelect'); if(!select) return; 
    let opts = '<option value="">-- ជ្រើសរើសទំនិញបន្ថែម --</option>'; 
    window.inventory.forEach(p => { 
        if(p.qty > 0) opts += `<option value="${p.id}">${p.name} (${window.fMoney(p.price)} | ស្តុក: ${p.qty} ${p.unit||''})</option>`; 
    }); 
    select.innerHTML = opts; 
};

window.deleteInvoice = function(id) {
    if (window.currentRole !== 'admin') return window.ksMsg('មានតែ Admin ប៉ុណ្ណោះដែលអាចលុបវិក្កយបត្របាន!', 'គ្មានសិទ្ធិ');
    const invIndex = window.invoices.findIndex(i => i && i.id === id);
    if (invIndex === -1) return;
    const inv = window.invoices[invIndex];

    window.ksMsg(`តើអ្នកពិតជាចង់លុបវិក្កយបត្រ ${inv.id} និងបង្វិលទំនិញចូលស្តុកវិញមែនទេ?`, 'បញ្ជាក់ការលុប', true, () => {
        if (inv.items && Array.isArray(inv.items)) {
            inv.items.forEach(item => {
                const realItem = window.inventory.find(p => p && p.id === item.id);
                if (realItem) {
                    realItem.qty += (item.cartQty || 0);
                    window.logAction('update', realItem.name, item.cartQty, `បង្វិលស្តុកពីការលុបវិក្កយបត្រ ${inv.id}`, window.activeUser);
                }
            });
        }
        window.invoices.splice(invIndex, 1);
        window.logAction('update', inv.customer || 'អតិថិជន', 0, `បានលុបវិក្កយបត្រ ${inv.id} ចោល`, window.activeUser);
        window.saveData(window.userAccounts);
        window.renderUnpaid();
        window.ksMsg('វិក្កយបត្រត្រូវបានលុប និងបង្វិលស្តុកចូលឃ្លាំងវិញជោគជ័យ!', 'ជោគជ័យ');
    });
};