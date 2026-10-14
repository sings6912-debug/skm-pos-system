/**
 * customer.js - គ្រប់គ្រងអតិថិជន និងប្រវត្តិការទិញ (Customer Management & Purchase History)
 */

window.custCurrentPage = 1;
window.custItemsPerPage = 20; 

function notifyCustomerUser(msg, title = 'ជូនដំណឹង', isError = false) {
    if (typeof window.ksMsg === 'function') {
        window.ksMsg(msg, title);
    } else if (typeof window.showToast === 'function') {
        window.showToast(msg, isError);
    } else {
        console.log(`[${title}] ${msg}`);
    }
}

window.changeCustomerItemsPerPage = function(val) {
    window.custItemsPerPage = val === 'all' ? 'all' : parseInt(val);
    window.custCurrentPage = 1; 
    window.renderCustomers();
};

window.changeCustomerPage = function(page) {
    window.custCurrentPage = page;
    window.renderCustomers();
    const container = document.getElementById('mainScroller');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
};

window.renderCustomers = function() {
    const tableBody = document.getElementById('customerTable');
    const searchVal = document.getElementById('searchCustomer') ? document.getElementById('searchCustomer').value.toLowerCase().trim() : '';
    const pageContainer = document.getElementById('customerPagination');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    // បង្កើត Object ដើម្បីបូកសរុបចំណូលតាមឈ្មោះអតិថិជន (មិនប្រកាន់អក្សរធំ-តូច)
    const customerStats = {};
    
    let activeInvoices = window.invoices || [];
    const deletedTracker = JSON.parse(localStorage.getItem('deleted_invoices_tracker')) || [];
    if (deletedTracker.length > 0) {
        activeInvoices = activeInvoices.filter((inv, idx) => {
            let tempId = String(inv?.id || inv?.invoiceNo || `ORD-${idx}`).trim().toLowerCase();
            return !deletedTracker.includes(tempId);
        });
    }

    activeInvoices.forEach(inv => {
        if (!inv) return;
        const rawName = String(inv.customerName || inv.customer || 'អតិថិជនទូទៅ').trim();
        const normKey = rawName.toLowerCase();
        const total = parseFloat(inv.totalAmount || inv.total || 0);
        const status = String(inv.status || 'unpaid').toLowerCase();
        const paid = status === 'paid' ? total : parseFloat(inv.paidUsd || inv.paidAmount || 0);
        const unpaid = Math.max(0, total - paid);

        if (!customerStats[normKey]) {
            customerStats[normKey] = { displayName: rawName, paid: 0, unpaid: 0, phone: inv.customerPhone || inv.phone || '' };
        }
        customerStats[normKey].paid += paid;
        customerStats[normKey].unpaid += unpaid;
        if (!customerStats[normKey].phone && (inv.customerPhone || inv.phone)) {
            customerStats[normKey].phone = inv.customerPhone || inv.phone;
        }
    });

    let mergedCustomers = [...(window.customers || [])];
    
    // បូកបញ្ចូលអតិថិជនដែលមានក្នុង Invoices តែគ្មានក្នុង Customer List
    Object.keys(customerStats).forEach(normKey => {
        if (normKey === 'អតិថិជនទូទៅ' || normKey === '') return;
        const exists = mergedCustomers.find(c => c && String(c.name || '').trim().toLowerCase() === normKey);
        if (!exists) {
            mergedCustomers.push({ 
                id: 'C_' + Date.now() + Math.random(), 
                name: customerStats[normKey].displayName, 
                phone: customerStats[normKey].phone 
            });
        }
    });

    let filtered = mergedCustomers.filter(c => {
        if (!c || !c.name) return false;
        if (searchVal === '') return true;
        return String(c.name).toLowerCase().includes(searchVal) || (c.phone && String(c.phone).toLowerCase().includes(searchVal));
    });

    filtered.sort((a, b) => {
        let nameA = a.name ? String(a.name) : '';
        let nameB = b.name ? String(b.name) : '';
        return nameA.localeCompare(nameB, 'km');
    });

    if (filtered.length === 0) {
        const lang = localStorage.getItem('app_lang') || 'km';
        const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">${d.noCustData || 'មិនមានទិន្នន័យអតិថិជនទេ'}</td></tr>`;
        if (pageContainer) pageContainer.innerHTML = '';
        return;
    }

    let totalItems = filtered.length;
    let totalPages = 1;
    let displayItems = filtered;

    if (window.custItemsPerPage !== 'all') {
        totalPages = Math.ceil(totalItems / window.custItemsPerPage) || 1;
        if (window.custCurrentPage > totalPages) window.custCurrentPage = totalPages;
        if (window.custCurrentPage < 1) window.custCurrentPage = 1;

        let startIndex = (window.custCurrentPage - 1) * window.custItemsPerPage;
        let endIndex = startIndex + window.custItemsPerPage;
        displayItems = filtered.slice(startIndex, endIndex);
    }

    displayItems.forEach(c => {
        const normKey = String(c.name || '').trim().toLowerCase();
        const stats = customerStats[normKey] || { paid: 0, unpaid: 0, phone: '' };
        const displayPhone = c.phone || stats.phone || '-';
        const safeName = String(c.name).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-sort="${safeName}" style="font-weight: bold; color: var(--primary); font-size: 15px;">${c.name}</td>
            <td data-sort="${displayPhone}" style="color: var(--text-muted);">${displayPhone}</td>
            <td data-sort="${stats.paid}" style="color: var(--success); font-weight: bold;">$${stats.paid.toFixed(2)}</td>
            <td data-sort="${stats.unpaid}" style="color: ${stats.unpaid > 0 ? 'var(--danger)' : 'var(--text-main)'}; font-weight: bold;">$${stats.unpaid.toFixed(2)}</td>
            <td style="text-align: center;">
                <div style="display: flex; gap: 5px; justify-content: center;">
                    <button class="btn btn-outline" style="padding:4px 8px; font-size:11px;" onclick="window.viewCustomerHistory('${safeName}')" title="ប្រវត្តិទិញ">🛍️ ប្រវត្តិទិញ</button>
                    <button class="btn btn-warning" style="padding:4px 8px; font-size:11px;" onclick="window.editCustomer('${c.id}')" title="កែប្រែ">✏️ កែប្រែ</button>
                    <button class="btn btn-danger" style="padding:4px 8px; font-size:11px;" onclick="window.deleteCustomer('${c.id}')" title="លុបចោល">🗑️</button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
    
    if (pageContainer) {
        if (window.custItemsPerPage === 'all' || totalItems <= window.custItemsPerPage) {
            pageContainer.innerHTML = '';
        } else {
            let pageHtml = `<button class="btn btn-outline" ${window.custCurrentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : `onclick="window.changeCustomerPage(${window.custCurrentPage - 1})"`}>◀ មុន</button>`;
            pageHtml += `<span style="font-weight:bold; font-size:var(--fs-14);">ទំព័រ ${window.custCurrentPage} នៃ ${totalPages} <small style="color:var(--text-muted); font-weight:normal;">(សរុប ${totalItems} នាក់)</small></span>`;
            pageHtml += `<button class="btn btn-outline" ${window.custCurrentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : `onclick="window.changeCustomerPage(${window.custCurrentPage + 1})"`}>បន្ទាប់ ▶</button>`;
            pageContainer.innerHTML = pageHtml;
        }
    }

    if (typeof window.filterTable === 'function') setTimeout(() => window.filterTable('mainCustomerTable'), 50);
    
    const datalist = document.getElementById('customerDatalist');
    if (datalist) {
        datalist.innerHTML = mergedCustomers.map(c => c ? `<option value="${String(c.name).replace(/"/g, '&quot;')}">` : '').join('');
    }
};

window.openCustomerModal = function() {
    document.getElementById('cId').value = '';
    document.getElementById('cName').value = '';
    document.getElementById('cPhone').value = '';
    
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
    
    const titleEl = document.getElementById('customerModalTitle');
    if (titleEl) titleEl.innerText = d.modalNewCustomerTitle || '➕ អតិថិជនថ្មី';
    
    document.getElementById('customerModal').style.display = 'flex';
};

window.closeCustomerModal = function() {
    document.getElementById('customerModal').style.display = 'none';
};

window.editCustomer = function(id) {
    const c = (window.customers || []).find(i => i && String(i.id) === String(id));
    if (!c) return;
    document.getElementById('cId').value = c.id;
    document.getElementById('cName').value = c.name || '';
    document.getElementById('cPhone').value = c.phone || '';
    
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
    
    const titleEl = document.getElementById('customerModalTitle');
    if (titleEl) titleEl.innerText = d.modalEditCustomerTitle || '✏️ កែប្រែព័ត៌មានអតិថិជន';
    
    document.getElementById('customerModal').style.display = 'flex';
};

window.saveCustomer = async function() {
    const id = document.getElementById('cId').value;
    const name = document.getElementById('cName').value.trim();
    const phone = document.getElementById('cPhone').value.trim();

    if (!name) return notifyCustomerUser('សូមបញ្ចូលឈ្មោះអតិថិជន!', 'ជូនដំណឹង', true);

    if (!window.customers) window.customers = [];

    if (id) {
        const c = window.customers.find(i => i && String(i.id) === String(id));
        if (c) {
            c.name = name;
            c.phone = phone;
        } else {
            window.customers.push({ id: id, name, phone });
        }
    } else {
        const exists = window.customers.find(c => c && String(c.name).trim().toLowerCase() === name.toLowerCase());
        if (exists) {
            return notifyCustomerUser('ឈ្មោះអតិថិជននេះមានរួចហើយ!', 'ជូនដំណឹង', true);
        }
        window.customers.push({ id: 'C_' + Date.now(), name, phone });
    }

    if (typeof window.saveData === 'function') await window.saveData(window.userAccounts);
    window.closeCustomerModal();
    window.renderCustomers();
    
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
    if (typeof window.showToast === 'function') window.showToast(d.msgCustomerSaved || 'រក្សាទុកជោគជ័យ!');
};

window.deleteCustomer = function(id) {
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
    
    const executeDeleteCust = async () => {
        let deletedCust = JSON.parse(localStorage.getItem('deleted_customers_tracker')) || [];
        deletedCust.push(String(id));
        localStorage.setItem('deleted_customers_tracker', JSON.stringify(deletedCust));

        window.customers = (window.customers || []).filter(c => c && String(c.id) !== String(id));
        
        if (typeof window.saveData === 'function') await window.saveData(window.userAccounts);
        window.renderCustomers();
        if (typeof window.showToast === 'function') window.showToast('លុបអតិថិជនជោគជ័យ!');
    };

    if (typeof window.ksMsg === 'function') {
        window.ksMsg(d.confirmDeleteCustomer || 'តើអ្នកពិតជាចង់លុបអតិថិជននេះមែនទេ?', d.confirmDeleteTitle || 'បញ្ជាក់ការលុប', true, executeDeleteCust);
    } else {
        executeDeleteCust();
    }
};

window.viewCustomerHistory = function(customerName) {
    if (!customerName) return;
    
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
    
    document.getElementById('chCustName').innerText = customerName;
    const tbody = document.getElementById('customerHistoryTableBody');
    tbody.innerHTML = '';
    
    let activeInvoices = window.invoices || [];
    const deletedTracker = JSON.parse(localStorage.getItem('deleted_invoices_tracker')) || [];
    if (deletedTracker.length > 0) {
        activeInvoices = activeInvoices.filter((inv, idx) => {
            let tempId = String(inv?.id || inv?.invoiceNo || `ORD-${idx}`).trim().toLowerCase();
            return !deletedTracker.includes(tempId);
        });
    }

    const targetNorm = String(customerName).trim().toLowerCase();
    const history = activeInvoices.filter(inv => {
        if (!inv) return false;
        const invCust = String(inv.customerName || inv.customer || '').trim().toLowerCase();
        return invCust === targetNorm;
    });

    if (history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">${d.custHistEmpty || 'អតិថិជននេះមិនទាន់មានប្រវត្តិទិញទេ'}</td></tr>`;
    } else {
        history.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).forEach(inv => {
            let itemsSummary = '';
            if (Array.isArray(inv.items)) {
                itemsSummary = inv.items.map(it => `${it.name || it.title} (x${it.cartQty !== undefined ? it.cartQty : (it.qty || 1)})`).join(', ');
            } else {
                itemsSummary = inv.itemsSummary || 'ទំនិញចម្រុះ';
            }
            
            const total = parseFloat(inv.totalAmount || inv.total || 0);
            const status = String(inv.status || 'unpaid').toLowerCase();
            let statusBadge = '';
            if (status === 'paid') {
                statusBadge = '<span class="badge" style="background:rgba(16,185,129,0.15); color:#10b981; padding:4px 8px; border-radius:12px;">ទូទាត់រួច</span>';
            } else if (status === 'ready') {
                statusBadge = '<span class="badge" style="background:rgba(56,189,248,0.15); color:#0284c7; padding:4px 8px; border-radius:12px;">រួចរាល់</span>';
            } else if (status === 'preorder') {
                statusBadge = '<span class="badge" style="background:rgba(139,92,246,0.15); color:#8b5cf6; padding:4px 8px; border-radius:12px;">កក់មុន</span>';
            } else {
                statusBadge = '<span class="badge" style="background:rgba(245,158,11,0.15); color:#f59e0b; padding:4px 8px; border-radius:12px;">ជំពាក់</span>';
            }
            
            const invCode = String(inv.id || inv.invoiceNo || '').replace(/'/g, "\\'");
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${inv.date || inv.createdAt || 'N/A'}</td>
                <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemsSummary.replace(/"/g, '&quot;')}">${itemsSummary}</td>
                <td style="font-weight: bold;">$${total.toFixed(2)}</td>
                <td>${statusBadge}</td>
                <td><button class="btn btn-outline" style="padding: 4px 8px; font-size: 11px;" onclick="window.closeCustomerHistoryModal(); window.switchTab('unpaid','📝 Invoices', document.getElementById('nav-unpaid')); document.getElementById('searchUnpaid').value='${invCode}'; window.renderUnpaid();">🔍 វិក្កយបត្រ</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('customerHistoryModal').style.display = 'flex';
};

window.closeCustomerHistoryModal = function() {
    document.getElementById('customerHistoryModal').style.display = 'none';
};

window.exportCustomers = function() {
    if (!window.customers || window.customers.length === 0) {
        return notifyCustomerUser('មិនមានអតិថិជនដើម្បី Export ទេ!', 'ជូនដំណឹង', true);
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.customers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const branchId = window.SHOP_BRANCH_ID || 'branch_1';
    downloadAnchor.setAttribute("download", `customers_${branchId}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
};

window.importCustomers = async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(ev) {
        try {
            const imported = JSON.parse(ev.target.result);
            if (Array.isArray(imported)) {
                if (!window.customers) window.customers = [];
                let count = 0;
                imported.forEach(c => {
                    if (c && c.name && !window.customers.some(ec => ec && String(ec.name).trim().toLowerCase() === String(c.name).trim().toLowerCase())) {
                        window.customers.push(c);
                        count++;
                    }
                });
                if (typeof window.saveData === 'function') await window.saveData(window.userAccounts);
                window.renderCustomers();
                notifyCustomerUser(`បាន Import អតិថិជនថ្មីចំនួន ${count} នាក់!`, 'ជោគជ័យ');
            } else {
                throw new Error("ទម្រង់ឯកសារមិនត្រឹមត្រូវ!");
            }
        } catch (err) {
            notifyCustomerUser("កំហុសក្នុងការ Import: " + err.message, 'បរាជ័យ', true);
        }
        e.target.value = '';
    };
    reader.readAsText(file);
};

window.autoFillCustomerPhone = function(mode) {
    const nameInputId = mode === 'pos' ? 'posCustomerName' : 'editInvName';
    const phoneInputId = mode === 'pos' ? 'posCustomerPhone' : 'editInvPhone';
    
    const nameEl = document.getElementById(nameInputId);
    const phoneEl = document.getElementById(phoneInputId);
    
    if (!nameEl || !phoneEl) return;
    
    const cName = nameEl.value.trim();
    if (!cName) {
        phoneEl.value = '';
        return;
    }
    
    const cust = (window.customers || []).find(c => c && String(c.name).trim().toLowerCase() === cName.toLowerCase());
    if (cust && cust.phone) {
        phoneEl.value = cust.phone;
    }
};

window.setAutoRegisterCustomer = function(name, phone) {
    if (!name || name.trim() === '' || name.trim() === 'អតិថិជនទូទៅ') return;
    const cName = name.trim();
    const cPhone = phone ? phone.trim() : '';

    if (!window.customers) window.customers = [];
    const exists = window.customers.find(c => c && String(c.name).trim().toLowerCase() === cName.toLowerCase());
    
    if (!exists) {
        window.customers.push({ id: 'C_' + Date.now() + Math.random(), name: cName, phone: cPhone });
        if (typeof window.renderCustomers === 'function') window.renderCustomers();
    } else if (!exists.phone && cPhone) {
        exists.phone = cPhone;
        if (typeof window.renderCustomers === 'function') window.renderCustomers();
    }
};