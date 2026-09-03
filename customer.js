// customer.js
window.updateCustomerDatalist = function() { 
    const dlist = document.getElementById('customerDatalist'); 
    if(dlist) { 
        let opts = ''; 
        (window.customers || []).forEach(c => { 
            if(c && c.name) opts += `<option value="${c.name}">${c.phone || ''}</option>`; 
        }); 
        dlist.innerHTML = opts; 
    } 
};

window.autoFillCustomerPhone = function(mode) { 
    let nameInput, phoneInput; 
    if(mode === 'pos') { 
        nameInput = document.getElementById('posCustomerName'); 
        phoneInput = document.getElementById('posCustomerPhone'); 
    } else { 
        nameInput = document.getElementById('editInvName'); 
        phoneInput = document.getElementById('editInvPhone'); 
    } 
    if (!nameInput || !phoneInput) return;
    const found = (window.customers || []).find(c => c && String(c.name).toLowerCase() === nameInput.value.trim().toLowerCase()); 
    if(found && !phoneInput.value) phoneInput.value = found.phone ? found.phone : ''; 
};

window.setAutoRegisterCustomer = function(name, phone) { 
    if(!name || name === 'អតិថិជនទូទៅ') return; 
    if(!window.customers) window.customers = [];
    const existing = window.customers.find(c => c && String(c.name).toLowerCase() === String(name).toLowerCase()); 
    if(!existing) {
        window.customers.push({ id: 'C_' + Date.now(), name: name.trim(), phone: phone ? phone.trim() : '' }); 
    } else if (!existing.phone && phone) {
        existing.phone = phone.trim(); 
    }
    if (typeof window.saveData === 'function') window.saveData(window.userAccounts);
    window.updateCustomerDatalist();
};

window.renderCustomers = function() {
    const tbody = document.getElementById('customerTable');
    if(!tbody) return; 

    // 🌟 កាត់អតិថិជនខ្មោចចោលចេញពីអេក្រង់ (ការពារ Cloud ទាញមកវិញ)
    let deletedCusts = JSON.parse(localStorage.getItem('deleted_customers_tracker')) || [];
    window.customers = (window.customers || []).filter(c => !deletedCusts.includes(String(c.id)));

    const search = document.getElementById('searchCustomer');
    const term = search ? search.value.toLowerCase().trim() : ''; 
    const custStats = {};

    (window.invoices || []).forEach(inv => { 
        if(!inv || !inv.customer) return;
        if(!custStats[inv.customer]) custStats[inv.customer] = { paid: 0, unpaid: 0 }; 
        let invPaid = parseFloat(inv.paidUsd) || 0;
        let totalAmt = parseFloat(inv.totalAmount) || 0;
        if(inv.status === 'paid') {
            custStats[inv.customer].paid += totalAmt; 
        } else if(inv.status === 'unpaid' || inv.status === 'preorder') { 
            custStats[inv.customer].paid += invPaid; 
            custStats[inv.customer].unpaid += Math.max(0, totalAmt - invPaid); 
        }
    });

    const filtered = (window.customers || []).filter(c => {
        if(!c || !c.name) return false;
        return c.name.toLowerCase().includes(term) || (c.phone && String(c.phone).includes(term));
    }); 

    let fHtml = '';
    filtered.forEach(c => {
        const paid = custStats[c.name] ? custStats[c.name].paid : 0; 
        const unpaid = custStats[c.name] ? custStats[c.name].unpaid : 0; 
        fHtml += `<tr>
            <td data-sort="${c.name}" style="font-weight:bold; color:var(--text-main);">${c.name}</td>
            <td data-sort="${c.phone||'-'}">${c.phone||'-'}</td>
            <td data-sort="${paid}" style="color:var(--success); font-weight:bold;">${window.fMoney(paid)}</td>
            <td data-sort="${unpaid}" style="color:${unpaid>0?'var(--danger)':'var(--text-muted)'}; font-weight:bold;">${window.fMoney(unpaid)}</td>
            <td style="text-align: center;">
                <div style="display: inline-flex; gap: 5px; justify-content: center;">
                    <button class="btn btn-outline" style="padding:4px 8px; font-size:var(--fs-12); color: var(--primary); border-color: var(--primary);" onclick="window.viewCustomerHistory('${c.name}')">🛍️ ប្រវត្តិទិញ</button>
                    <button class="btn btn-outline" style="padding:4px 8px; font-size:var(--fs-12);" onclick="window.editCustomer('${c.id}')">✏️ កែប្រែ</button>
                    <button class="btn-danger" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="window.deleteCustomer('${c.id}')">🗑️</button>
                </div>
            </td>
        </tr>`;
    });
    
    tbody.innerHTML = fHtml || '<tr><td colspan="5" style="text-align:center; padding: 25px; color: var(--text-muted);">មិនទាន់មានទិន្នន័យអតិថិជនទេ</td></tr>';
};

window.openCustomerModal = function() { 
    document.getElementById('cId').value = ''; 
    document.getElementById('cName').value = ''; 
    document.getElementById('cPhone').value = ''; 
    document.getElementById('customerModalTitle').innerText = 'អតិថិជនថ្មី'; 
    document.getElementById('customerModal').style.display = 'flex'; 
    setTimeout(() => document.getElementById('cName').focus(), 100);
};

window.closeCustomerModal = function() { 
    document.getElementById('customerModal').style.display = 'none'; 
};

window.viewCustomerHistory = function(customerName) {
    document.getElementById('chCustName').innerText = customerName; 
    const custInvoices = (window.invoices || []).filter(inv => inv && String(inv.customer).toLowerCase() === String(customerName).toLowerCase()); 
    let fHtml = ''; 
    custInvoices.forEach(inv => { 
        let itemsSummary = (inv.items || []).map(i => `${i.name} (x${i.cartQty})`).join(', '); 
        if(itemsSummary.length > 40) itemsSummary = itemsSummary.substring(0, 40) + '...'; 
        let statusBadge = inv.status === 'paid' ? '<span class="badge badge-paid">ទូទាត់រួច</span>' : (inv.status === 'preorder' ? '<span class="badge" style="background:#8b5cf6; color:white;">កក់ប្រាក់</span>' : '<span class="badge badge-unpaid">រង់ចាំទូទាត់</span>'); 
        fHtml += `<tr>
            <td style="font-size:var(--fs-12); color:var(--text-muted);">${inv.date}</td>
            <td style="font-size:var(--fs-12);" title="${(inv.items || []).map(i => i.name).join(', ')}">${itemsSummary}</td>
            <td style="font-weight:bold; color:var(--success);">${window.fMoney(inv.totalAmount)}</td>
            <td>${statusBadge}</td>
            <td><button class="btn btn-outline" style="padding: 4px 8px; font-size: var(--fs-12);" onclick="window.viewInvoice('${inv.id}')">👁️ វិក្កយបត្រ</button></td>
        </tr>`; 
    });
    document.getElementById('customerHistoryTableBody').innerHTML = fHtml || '<tr><td colspan="5" style="text-align:center; padding: 20px;">អតិថិជននេះមិនទាន់មានប្រវត្តិទិញទេ</td></tr>'; 
    document.getElementById('customerHistoryModal').style.display = 'flex';
};

window.closeCustomerHistoryModal = function() { 
    document.getElementById('customerHistoryModal').style.display = 'none'; 
};

window.saveCustomer = async function() {
    const id = document.getElementById('cId').value; 
    const name = document.getElementById('cName').value.trim(); 
    const phone = document.getElementById('cPhone').value.trim(); 
    if(!name) return window.ksMsg("សូមបញ្ចូលឈ្មោះអតិថិជន!");

    if(!window.customers) window.customers = [];

    if(id) { 
        const idx = window.customers.findIndex(c => c && c.id === id); 
        if(idx !== -1) { 
            const oldName = window.customers[idx].name; 
            if(oldName !== name) {
                (window.invoices || []).forEach(inv => { if(inv && inv.customer === oldName) inv.customer = name; }); 
            }
            window.customers[idx].name = name; 
            window.customers[idx].phone = phone; 
        } 
    } else { 
        if(window.customers.find(c => c && String(c.name).toLowerCase() === String(name).toLowerCase())) {
            return window.ksMsg("ឈ្មោះអតិថិជននេះមានរួចហើយ!"); 
        }
        window.customers.push({ id: 'C_' + Date.now(), name, phone }); 
    } 

    window.closeCustomerModal(); 
    if (typeof window.saveData === 'function') await window.saveData(window.userAccounts); 
    window.renderCustomers();
    window.updateCustomerDatalist();
    window.ksMsg("ព័ត៌មានអតិថិជនត្រូវបានរក្សាទុក!", "ជោគជ័យ");
};

window.editCustomer = function(id) { 
    const c = (window.customers || []).find(x => x && x.id === id); 
    if(!c) return; 
    document.getElementById('cId').value = c.id; 
    document.getElementById('cName').value = c.name; 
    document.getElementById('cPhone').value = c.phone || ''; 
    document.getElementById('customerModalTitle').innerText = 'កែប្រែព័ត៌មានអតិថិជន'; 
    document.getElementById('customerModal').style.display = 'flex'; 
};

window.deleteCustomer = function(id) { 
    if(typeof window.ksMsg === 'function') {
        window.ksMsg('តើអ្នកពិតជាចង់លុបអតិថិជននេះមែនទេ?', 'បញ្ជាក់ការលុប', true, async () => { 
            // ⚡ ១. កត់ត្រា ID ចូលបញ្ជីខ្មៅ (Blacklist) ការពារ Cloud ទាញមកវិញ
            let deletedCusts = JSON.parse(localStorage.getItem('deleted_customers_tracker')) || [];
            deletedCusts.push(String(id));
            localStorage.setItem('deleted_customers_tracker', JSON.stringify(deletedCusts));

            // ⚡ ២. លុបចេញពីអេក្រង់ និង Local Storage
            window.customers = window.customers.filter(c => String(c.id) !== String(id));
            localStorage.setItem(window.getBranchKey('customers_pro'), JSON.stringify(window.customers));

            // ⚡ ៣. Save ទៅ Cloud និង Refresh
            if (typeof window.saveData === 'function') await window.saveData(window.userAccounts); 
            window.renderCustomers(); 
            window.updateCustomerDatalist();

            window.ksMsg('លុបជោគជ័យ!', 'ជោគជ័យ');
        }); 
    } else {
        if(confirm('តើអ្នកពិតជាចង់លុបអតិថិជននេះមែនទេ?')) {
            let deletedCusts = JSON.parse(localStorage.getItem('deleted_customers_tracker')) || [];
            deletedCusts.push(String(id));
            localStorage.setItem('deleted_customers_tracker', JSON.stringify(deletedCusts));

            window.customers = window.customers.filter(c => String(c.id) !== String(id));
            localStorage.setItem(window.getBranchKey('customers_pro'), JSON.stringify(window.customers));

            if (typeof window.saveData === 'function') window.saveData(window.userAccounts); 
            window.renderCustomers(); 
            window.updateCustomerDatalist();
        }
    }
};

window.exportCustomers = function() { 
    if(!window.customers || !window.customers.length) return window.ksMsg('គ្មានទិន្នន័យអតិថិជនដើម្បី Export ទេ!'); 
    const a = document.createElement("a"); 
    a.href = URL.createObjectURL(new Blob([JSON.stringify(window.customers, null, 2)], { type: "application/json" })); 
    a.download = `Customers_Backup_${Date.now()}.json`; 
    a.click(); 
};

window.importCustomers = function(e) { 
    const file = e.target.files[0]; if (!file) return; 
    const r = new FileReader(); 
    r.onload = async (ev) => { 
        try { 
            const data = JSON.parse(ev.target.result); 
            if(Array.isArray(data)) { 
                let cCount = 0; 
                data.forEach(newCust => { 
                    if(newCust && newCust.name && !window.customers.find(c => String(c.name).toLowerCase() === String(newCust.name).toLowerCase())) { 
                        window.customers.push({ id: newCust.id || 'C_' + Date.now() + Math.random(), name: newCust.name, phone: newCust.phone || '' }); 
                        cCount++; 
                    } 
                }); 
                if (typeof window.saveData === 'function') await window.saveData(window.userAccounts); 
                window.ksMsg(`បាននាំចូលអតិថិជនថ្មីចំនួន ${cCount} នាក់!`, 'ជោគជ័យ'); 
                window.renderCustomers();
                window.updateCustomerDatalist();
            } else {
                window.ksMsg('ទម្រង់ឯកសារមិនត្រឹមត្រូវទេ!', 'បរាជ័យ'); 
            }
        } catch(err) { 
            window.ksMsg('មិនអាចអានឯកសារបានទេ!', 'បរាជ័យ'); 
        } 
        e.target.value = ''; 
    }; 
    r.readAsText(file); 
};