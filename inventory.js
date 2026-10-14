/**
 * inventory.js - គ្រប់គ្រងស្តុកទំនិញ ការបែងចែកទំព័រ (Pagination) និងការនាំចូល/នាំចេញ Excel (CSV)
 */

window.currentInventoryView = 'grid';

// អថេរសម្រាប់កំណត់ការបែងចែកទំព័រ (Pagination)
window.invCurrentPage = 1;
window.invItemsPerPage = 20; // លំនាំដើមបង្ហាញ ២០ ក្នុងមួយទំព័រ

function notifyInventoryUser(msg, title = 'ជូនដំណឹង', isError = false) {
    if (typeof window.ksMsg === 'function') {
        window.ksMsg(msg, title);
    } else if (typeof window.showToast === 'function') {
        window.showToast(msg, isError);
    } else {
        console.log(`[${title}] ${msg}`);
    }
}

window.changeItemsPerPage = function(val) {
    window.invItemsPerPage = val === 'all' ? 'all' : parseInt(val);
    window.invCurrentPage = 1; // ត្រឡប់ទៅទំព័រទី១វិញពេលប្តូរចំនួន
    window.renderInventory();
};

window.changeInvPage = function(page) {
    window.invCurrentPage = page;
    window.renderInventory();
    // អូសត្រឡប់ទៅលើវិញស្វ័យប្រវត្តិពេលប្តូរទំព័រ
    const container = document.getElementById('mainScroller');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
};

window.setInventoryView = function(mode, skipRender = false) { 
    window.currentInventoryView = mode; 
    localStorage.setItem(window.getBranchKey('inv_view_mode'), mode); 
    const btnGrid = document.getElementById('btnGridView'); 
    const btnList = document.getElementById('btnListView'); 
    if (!btnGrid || !btnList) return;
    if (mode === 'grid') { 
        btnGrid.style.background = 'var(--primary)'; btnGrid.style.color = '#fff'; 
        btnList.style.background = 'transparent'; btnList.style.color = 'var(--text-main)'; 
    } else { 
        btnList.style.background = 'var(--primary)'; btnList.style.color = '#fff'; 
        btnGrid.style.background = 'transparent'; btnGrid.style.color = 'var(--text-main)'; 
    } 
    if (!skipRender) window.renderInventory(); 
};

window.renderInventory = function() {
    const container = document.getElementById('productGridContainer'); 
    const pageContainer = document.getElementById('inventoryPagination');
    if (!container) return;
    try {
        const searchInputEl = document.getElementById('searchInput'); 
        const search = searchInputEl ? searchInputEl.value.toLowerCase().trim() : ''; 
        const filterCatEl = document.getElementById('filterCategory'); 
        const cat = filterCatEl ? filterCatEl.value : 'all'; 
        const filterStatusEl = document.getElementById('filterStatus'); 
        const status = filterStatusEl ? filterStatusEl.value : 'all'; 
        const sortInventoryEl = document.getElementById('sortInventory'); 
        const sort = sortInventoryEl ? sortInventoryEl.value : 'newest';
        
        let oldFilters = []; 
        let activeFilterIndex = -1;
        if (window.currentInventoryView === 'list' && document.getElementById('mainInventoryTable')) { 
            document.querySelectorAll('#mainInventoryTable thead .col-filter').forEach((inp, idx) => { 
                oldFilters.push(inp.value); 
                if (document.activeElement === inp) activeFilterIndex = idx; 
            }); 
        }
        
        let invList = Array.isArray(window.inventory) ? window.inventory : [];
        let filtered = invList.filter(p => {
            if (!p || typeof p !== 'object') return false;
            if (!search) return true;
            return (p.name ? String(p.name).toLowerCase() : '').includes(search) || 
                   (p.customId ? String(p.customId).toLowerCase() : '').includes(search) || 
                   (p.desc ? String(p.desc).toLowerCase() : '').includes(search) || 
                   (p.id ? String(p.id).toLowerCase() : '').includes(search);
        });
        
        if (cat !== 'all') filtered = filtered.filter(p => p && p.category === cat); 
        if (status === 'in_stock') filtered = filtered.filter(p => p && (parseFloat(p.qty) || 0) > 0); 
        else if (status === 'out_stock') filtered = filtered.filter(p => p && (parseFloat(p.qty) || 0) <= 0);
        
        if (sort === 'qty_asc') {
            filtered.sort((a, b) => (parseFloat(a?.qty) || 0) - (parseFloat(b?.qty) || 0)); 
        } else if (sort === 'qty_desc') {
            filtered.sort((a, b) => (parseFloat(b?.qty) || 0) - (parseFloat(a?.qty) || 0)); 
        } else {
            filtered.sort((a, b) => String(b?.id || '').localeCompare(String(a?.id || '')));
        }
        
        if (filtered.length === 0) { 
            const lang = localStorage.getItem('app_lang') || 'km';
            const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
            container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); background:var(--bg-card); border-radius:12px; border:1px solid var(--border);">${d.noInvData || 'មិនមានទិន្នន័យ'}</div>`; 
            if (pageContainer) pageContainer.innerHTML = '';
            return; 
        }

        // ការគណនា Pagination
        let totalItems = filtered.length;
        let totalPages = 1;
        let displayItems = filtered;

        if (window.invItemsPerPage !== 'all') {
            totalPages = Math.ceil(totalItems / window.invItemsPerPage) || 1;
            if (window.invCurrentPage > totalPages) window.invCurrentPage = totalPages;
            if (window.invCurrentPage < 1) window.invCurrentPage = 1;

            let startIndex = (window.invCurrentPage - 1) * window.invItemsPerPage;
            let endIndex = startIndex + window.invItemsPerPage;
            displayItems = filtered.slice(startIndex, endIndex);
        }

        const showCost = (window.sysSettings && window.sysSettings.cost !== false) && window.currentRole === 'admin'; 
        const enableEdit = window.currentRole === 'admin';
        const showExpiry = window.sysSettings && window.sysSettings.expiry !== false;
        const showCondition = window.sysSettings && window.sysSettings.condition === true;
        const currentRate = parseFloat(document.getElementById('globalExchangeRate')?.value) || window.cartRate || 4000;
        
        if (window.currentInventoryView === 'grid') {
            let finalHtml = `<div class="product-grid">`;
            displayItems.forEach(p => {
                if (!p) return;
                const safeId = String(p.id || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                const pQty = parseFloat(p.qty) || 0; 
                const sCol = pQty <= 0 ? 'var(--danger)' : (pQty <= 5 ? 'var(--warning)' : 'var(--success)'); 
                const img = p.image ? p.image : 'https://placehold.co/400x300/1e293b/475569?text=No+Image'; 
                const actionBtns = enableEdit ? `<div class="card-actions"><button class="btn btn-outline" onclick="window.editProduct('${safeId}')">✏️ កែប្រែ</button><button class="btn btn-danger" onclick="window.deleteProduct('${safeId}')">🗑️</button></div>` : ''; 
                
                const pUsd = parseFloat(p.price) || 0;
                const pRiel = parseFloat(p.riel) || 0; 
                const displayUsd = pUsd > 0 ? window.fMoney(pUsd) : (pRiel > 0 ? window.fMoney(pRiel / currentRate) : '$0.00');
                const rielStr = pRiel > 0 ? `<span style="font-size:var(--fs-11); color:var(--text-muted);">| ${pRiel.toLocaleString()} ៛</span>` : '';
                
                const conditionBadge = (showCondition && p.condition) ? `<span style="font-size:11px; background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px; margin-left:5px;">${p.condition}</span>` : '';
                const expiryBadge = (showExpiry && p.expiry) ? `<div style="font-size:11px; color:var(--warning); margin-top:2px;">📅 ផុតកំណត់: ${new Date(p.expiry).toLocaleDateString('km-KH')}</div>` : '';

                finalHtml += `<div class="product-card"><div class="media-container">${p.category ? `<div class="badge-cat">${p.category}</div>` : ''}<img src="${img}" alt="Product" onerror="this.src='https://placehold.co/400x300/1e293b/475569?text=No+Image'"></div><div class="product-info"><div class="p-title">${p.name} ${conditionBadge}</div><div style="font-size: var(--fs-11); color: var(--primary); margin-bottom: 4px; font-family: monospace;">Barcode: ${p.customId || p.id}</div><div style="font-size: var(--fs-12); color: var(--text-muted); margin-bottom: 8px; line-height: 1.3; flex-grow: 1;">${p.desc || 'មិនមានការពណ៌នា'}</div><div class="p-finances"><div style="display:${showCost ? 'block' : 'none'}">ដើម: <span class="p-cost">${window.fMoney(p.cost)}</span></div><div>លក់: <span class="p-price">${displayUsd} ${rielStr} <small style="color:var(--text-muted); font-size:var(--fs-11);">/ ${p.unit || 'ឯកតា'}</small></span></div></div>${expiryBadge}<div class="qty-control" style="border-color:${sCol}"><button class="qty-btn" onclick="window.updateQty('${safeId}', -1)">-</button><span class="qty-val" style="color:${sCol}">${pQty} <small style="font-size:var(--fs-11);">${p.unit || 'ឯកតា'}</small></span><button class="qty-btn" onclick="window.updateQty('${safeId}', 1)">+</button></div>${actionBtns}</div></div>`;
            });
            finalHtml += `</div>`; 
            container.innerHTML = finalHtml;
        } else {
            let tableHTML = `<div class="table-responsive"><table id="mainInventoryTable"><thead><tr class="header-row"><th style="width: 60px;">រូបភាព</th><th onclick="if(window.sortTable) window.sortTable('mainInventoryTable', 1)">ឈ្មោះទំនិញ / Barcode <span>⬍</span></th><th onclick="if(window.sortTable) window.sortTable('mainInventoryTable', 2)">ប្រភេទ <span>⬍</span></th><th onclick="if(window.sortTable) window.sortTable('mainInventoryTable', 3, 'number')">តម្លៃលក់ <span>⬍</span></th><th style="text-align:center;" onclick="if(window.sortTable) window.sortTable('mainInventoryTable', 4, 'number')">ស្តុកនៅសល់ <span>⬍</span></th>${showExpiry ? '<th>កាលបរិច្ឆេទផុតកំណត់</th>' : ''}${enableEdit ? '<th style="text-align:center;">សកម្មភាព</th>' : ''}</tr><tr class="filter-row"><th></th><th><input type="text" class="col-filter" onkeyup="if(window.filterTable) window.filterTable('mainInventoryTable')" placeholder="ស្វែងរក..."></th><th><input type="text" class="col-filter" onkeyup="if(window.filterTable) window.filterTable('mainInventoryTable')" placeholder="ស្វែងរក..."></th><th><input type="text" class="col-filter" onkeyup="if(window.filterTable) window.filterTable('mainInventoryTable')" placeholder="ស្វែងរក..."></th><th><input type="text" class="col-filter" onkeyup="if(window.filterTable) window.filterTable('mainInventoryTable')" placeholder="ស្វែងរក..."></th>${showExpiry ? '<th></th>' : ''}${enableEdit ? '<th></th>' : ''}</tr></thead><tbody>`;
            displayItems.forEach(p => { 
                if (!p) return;
                const safeId = String(p.id || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                const pQty = parseFloat(p.qty) || 0; 
                const sCol = pQty <= 0 ? 'var(--danger)' : (pQty <= 5 ? 'var(--warning)' : 'var(--success)'); 
                const img = p.image ? p.image : 'https://placehold.co/100x100/1e293b/475569?text=IMG'; 
                const actCol = enableEdit ? `<td style="text-align:center;"><div style="display: flex; gap: 5px; justify-content:center;"><button class="btn btn-outline" style="padding:6px 10px;" onclick="window.editProduct('${safeId}')">✏️</button><button class="btn-danger" style="border:none; padding:6px 10px; border-radius:6px; cursor:pointer;" onclick="window.deleteProduct('${safeId}')">🗑️</button></div></td>` : ''; 
                
                const pUsd = parseFloat(p.price) || 0;
                const pRiel = parseFloat(p.riel) || 0; 
                const effectiveUsd = pUsd > 0 ? pUsd : (pRiel > 0 ? (pRiel / currentRate) : 0);
                const rielHtml = pRiel > 0 ? `<br><span style="font-size:var(--fs-11); color:var(--text-muted);">${pRiel.toLocaleString()} ៛</span>` : '';
                const safeName = p.name ? String(p.name).replace(/"/g, '&quot;') : '';
                const conditionBadge = (showCondition && p.condition) ? `<span style="font-size:11px; background:rgba(128,128,128,0.1); padding:2px 4px; border-radius:4px; margin-left:4px;">${p.condition}</span>` : '';
                let expiryTD = '';
                if (showExpiry) {
                    expiryTD = `<td>${p.expiry ? new Date(p.expiry).toLocaleDateString('km-KH') : '<span style="color:var(--text-muted); font-size:11px;">មិនមាន</span>'}</td>`;
                }
                
                tableHTML += `<tr data-id="${safeName}"><td><img src="${img}" onerror="this.src='https://placehold.co/100x100/1e293b/475569?text=IMG'" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border:1px solid var(--border);"></td><td data-sort="${safeName}"><div style="font-weight: bold; font-size:var(--fs-15); color:var(--text-main); margin-bottom: 2px;">${p.name} ${conditionBadge}</div><div style="font-size:var(--fs-11); color:var(--primary); font-family:monospace;">Barcode: ${p.customId || p.id}</div></td><td data-sort="${p.category || '-'}"><span class="badge-cat" style="position:static; display:inline-block; font-size:var(--fs-11); padding:4px 8px;">${p.category || '-'}</span></td><td data-sort="${effectiveUsd}"><div class="p-price" style="font-size:var(--fs-15);">${window.fMoney(effectiveUsd)} ${rielHtml}</div><div class="p-cost" style="font-size:var(--fs-11); margin-top:2px; display:${showCost ? 'block' : 'none'}">ដើម: ${window.fMoney(p.cost)}</div></td><td data-sort="${pQty}" style="text-align:center;"><div class="qty-control" style="border-color:${sCol}; margin: 0 auto; padding: 2px 5px;"><button class="qty-btn" onclick="window.updateQty('${safeId}', -1)" style="width:20px; height:20px; font-size:var(--fs-16);">-</button><span class="qty-val" style="color:${sCol}; min-width:25px;">${pQty}</span><button class="qty-btn" onclick="window.updateQty('${safeId}', 1)" style="width:20px; height:20px; font-size:var(--fs-16);">+</button></div><div style="font-size:var(--fs-11); color:var(--text-muted); margin-top:3px;">${p.unit || 'ឯកតា'}</div></td>${expiryTD}${actCol}</tr>`; 
            });
            tableHTML += `</tbody></table></div>`; 
            container.innerHTML = tableHTML;
            let newFilters = document.querySelectorAll('#mainInventoryTable thead .col-filter'); 
            newFilters.forEach((inp, idx) => { 
                if (oldFilters[idx]) inp.value = oldFilters[idx]; 
                if (idx === activeFilterIndex) setTimeout(() => inp.focus(), 10); 
            }); 
            if (typeof window.filterTable === 'function') setTimeout(() => window.filterTable('mainInventoryTable'), 50);
        }

        // Render ប៊ូតុង Pagination ខាងក្រោមតារាង
        if (pageContainer) {
            if (window.invItemsPerPage === 'all' || totalItems <= window.invItemsPerPage) {
                pageContainer.innerHTML = '';
            } else {
                let pageHtml = `<button class="btn btn-outline" ${window.invCurrentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : `onclick="window.changeInvPage(${window.invCurrentPage - 1})"`}>◀ មុន</button>`;
                pageHtml += `<span style="font-weight:bold; font-size:var(--fs-14);">ទំព័រ ${window.invCurrentPage} នៃ ${totalPages} <small style="color:var(--text-muted); font-weight:normal;">(សរុប ${totalItems} មុខ)</small></span>`;
                pageHtml += `<button class="btn btn-outline" ${window.invCurrentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : `onclick="window.changeInvPage(${window.invCurrentPage + 1})"`}>បន្ទាប់ ▶</button>`;
                pageContainer.innerHTML = pageHtml;
            }
        }
    } catch (err) { 
        container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--danger);">Error Inventory: ${err.message}</div>`; 
    }
};

window.updateQty = function(id, change) { 
    const item = (window.inventory || []).find(p => p && String(p.id) === String(id)); 
    if (item) { 
        let old = parseInt(item.qty) || 0; 
        item.qty = Math.max(0, old + change); 
        let diff = item.qty - old; 
        if (diff !== 0) { 
            if (typeof window.logAction === 'function') {
                window.logAction(diff > 0 ? 'add' : 'update', item.name, Math.abs(diff), diff > 0 ? 'បន្ថែមស្តុក' : 'ដកស្តុកចេញ', window.activeUser); 
            }
            if (typeof window.saveData === 'function') window.saveData(window.userAccounts); 
            window.renderInventory();
            if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
            if (typeof window.renderDashboard === 'function') window.renderDashboard();
        } 
    } 
};

window.generateProductBarcode = function() { 
    const el = document.getElementById('pCustomId');
    if (el) el.value = 'SKM' + Math.floor(100000 + Math.random() * 900000); 
};

window.openProductModal = function() { 
    if (window.currentRole !== 'admin') {
        return notifyInventoryUser('គ្មានសិទ្ធិ!', 'បរាជ័យ', true);
    } 
    document.getElementById('pId').value = ''; 
    document.getElementById('pName').value = ''; 
    document.getElementById('pCategory').value = ''; 
    document.getElementById('pCost').value = ''; 
    document.getElementById('pPrice').value = ''; 
    document.getElementById('pUnit').value = ''; 
    document.getElementById('pQty').value = '0'; 
    document.getElementById('pDesc').value = ''; 
    document.getElementById('pImage').value = ''; 
    document.getElementById('pCustomId').value = 'SKM' + Math.floor(100000 + Math.random() * 900000);
    if (document.getElementById('pRiel')) document.getElementById('pRiel').value = ''; 
    window.updateImagePreview(''); 
    document.getElementById('modalTitle').innerText = 'បន្ថែមទំនិញថ្មី'; 
    
    const condContainer = document.getElementById('pConditionContainer');
    const condSelect = document.getElementById('pCondition');
    if (window.sysSettings && window.sysSettings.condition) {
        if (condContainer) condContainer.style.display = 'block';
        let opts = `<option value="">-- ជ្រើសរើស --</option>`;
        let cList = (window.sysSettings.conditionList || '').split(',');
        cList.forEach(c => {
            if (c.trim()) opts += `<option value="${c.trim()}">${c.trim()}</option>`;
        });
        if (condSelect) { condSelect.innerHTML = opts; condSelect.value = ''; }
    } else {
        if (condContainer) condContainer.style.display = 'none';
        if (condSelect) condSelect.value = '';
    }

    const expiryContainer = document.getElementById('pExpiryContainer');
    if (window.sysSettings && window.sysSettings.expiry !== false) {
        if (expiryContainer) expiryContainer.style.display = 'block';
        if (document.getElementById('pExpiry')) document.getElementById('pExpiry').value = '';
    } else {
        if (expiryContainer) expiryContainer.style.display = 'none';
        if (document.getElementById('pExpiry')) document.getElementById('pExpiry').value = '';
    }

    document.getElementById('productModal').style.display = 'flex'; 
};

window.closeModal = function() { 
    document.getElementById('productModal').style.display = 'none'; 
};

window.updateImagePreview = function(src) { 
    const previewBox = document.getElementById('imagePreviewBox'); 
    if (!previewBox) return;
    if (src && src.trim() !== '') { 
        previewBox.src = src; 
        previewBox.style.display = 'block'; 
    } else { 
        previewBox.src = ''; 
        previewBox.style.display = 'none'; 
    } 
};

window.handleImage = function(e) { 
    const file = e.target.files[0]; 
    if (!file) return; 
    const reader = new FileReader(); 
    reader.onload = (ev) => { 
        const img = new Image(); 
        img.onload = () => { 
            const canvas = document.createElement('canvas'); 
            const max = 400; 
            let w = img.width, h = img.height; 
            if (w > h) { if (w > max) { h *= max / w; w = max; } } 
            else { if (h > max) { w *= max / h; h = max; } } 
            canvas.width = w; canvas.height = h; 
            const ctx = canvas.getContext('2d'); 
            ctx.fillStyle = '#ffffff'; 
            ctx.fillRect(0, 0, w, h); 
            ctx.drawImage(img, 0, 0, w, h); 
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.6); 
            document.getElementById('pImage').value = compressedUrl; 
            window.updateImagePreview(compressedUrl); 
        }; 
        img.src = ev.target.result; 
    }; 
    reader.readAsDataURL(file); 
};

window.saveProduct = function() { 
    const id = document.getElementById('pId').value; 
    const customIdInput = document.getElementById('pCustomId').value.trim();
    const expiryVal = document.getElementById('pExpiry') ? document.getElementById('pExpiry').value : '';

    const data = { 
        id: id ? id : 'P_' + Date.now(), 
        customId: customIdInput ? customIdInput : ('SKM' + Math.floor(100000 + Math.random() * 900000)),
        name: document.getElementById('pName').value.trim(), 
        category: document.getElementById('pCategory').value.trim(), 
        cost: parseFloat(document.getElementById('pCost').value) || 0, 
        price: parseFloat(document.getElementById('pPrice').value) || 0, 
        riel: parseFloat(document.getElementById('pRiel')?.value) || 0, 
        unit: document.getElementById('pUnit').value.trim(), 
        qty: parseInt(document.getElementById('pQty').value) || 0, 
        desc: document.getElementById('pDesc').value, 
        image: document.getElementById('pImage').value,
        condition: document.getElementById('pCondition') ? document.getElementById('pCondition').value || '' : '',
        expiry: (window.sysSettings && window.sysSettings.expiry !== false) ? expiryVal : ''
    }; 
    if (!data.name || (data.price <= 0 && data.riel <= 0)) {
        return notifyInventoryUser("សូមបញ្ចូលឈ្មោះ និងតម្លៃលក់ (យ៉ាងហោចណាស់ ដុល្លារ ឬ រៀល)!", "ជូនដំណឹង", true); 
    }
    if (!window.inventory) window.inventory = [];
    if (id) { 
        const idx = window.inventory.findIndex(p => p && String(p.id) === String(id)); 
        if (idx !== -1) window.inventory[idx] = { ...window.inventory[idx], ...data }; 
        if (typeof window.logAction === 'function') window.logAction('update', data.name, 0, 'កែប្រែព័ត៌មាន', window.activeUser); 
    } else { 
        window.inventory.push(data); 
        if (typeof window.logAction === 'function') window.logAction('add', data.name, data.qty, 'នាំចូលថ្មី', window.activeUser); 
    } 
    window.closeModal(); 
    if (typeof window.updateCategories === 'function') window.updateCategories();
    if (typeof window.saveData === 'function') window.saveData(window.userAccounts); 
    window.renderInventory();
    if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
    if (typeof window.renderDashboard === 'function') window.renderDashboard();
};

window.editProduct = function(id) { 
    if (window.currentRole !== 'admin') {
        return notifyInventoryUser('គ្មានសិទ្ធិ!', 'បរាជ័យ', true);
    }
    const p = (window.inventory || []).find(i => i && String(i.id) === String(id)); 
    if (!p) return; 
    document.getElementById('pId').value = p.id; 
    document.getElementById('pCustomId').value = p.customId || p.id; 
    document.getElementById('pName').value = p.name; 
    document.getElementById('pCategory').value = p.category || ''; 
    document.getElementById('pCost').value = p.cost; 
    document.getElementById('pPrice').value = p.price || ''; 
    if (document.getElementById('pRiel')) document.getElementById('pRiel').value = p.riel || ''; 
    document.getElementById('pUnit').value = p.unit || ''; 
    document.getElementById('pQty').value = p.qty; 
    document.getElementById('pDesc').value = p.desc || ''; 
    document.getElementById('pImage').value = p.image || ''; 
    window.updateImagePreview(p.image || ''); 
    
    const condContainer = document.getElementById('pConditionContainer');
    const condSelect = document.getElementById('pCondition');
    if (window.sysSettings && window.sysSettings.condition) {
        if (condContainer) condContainer.style.display = 'block';
        let opts = `<option value="">-- ជ្រើសរើស --</option>`;
        let cList = (window.sysSettings.conditionList || '').split(',');
        cList.forEach(c => {
            if (c.trim()) opts += `<option value="${c.trim()}">${c.trim()}</option>`;
        });
        if (condSelect) { condSelect.innerHTML = opts; condSelect.value = p.condition || ''; }
    } else {
        if (condContainer) condContainer.style.display = 'none';
        if (condSelect) condSelect.value = '';
    }

    const expiryContainer = document.getElementById('pExpiryContainer');
    if (window.sysSettings && window.sysSettings.expiry !== false) {
        if (expiryContainer) expiryContainer.style.display = 'block';
        if (document.getElementById('pExpiry')) document.getElementById('pExpiry').value = p.expiry || '';
    } else {
        if (expiryContainer) expiryContainer.style.display = 'none';
        if (document.getElementById('pExpiry')) document.getElementById('pExpiry').value = '';
    }

    document.getElementById('modalTitle').innerText = 'កែប្រែទំនិញ'; 
    document.getElementById('productModal').style.display = 'flex'; 
};

window.deleteProduct = function(id) { 
    if (window.currentRole !== 'admin') {
        return notifyInventoryUser('គ្មានសិទ្ធិ!', 'បរាជ័យ', true);
    }
    const p = (window.inventory || []).find(i => i && String(i.id) === String(id)); 
    if (!p) return;
    
    const executeDeleteProd = async () => {
        let deletedProds = JSON.parse(localStorage.getItem('deleted_products_tracker')) || [];
        if (!deletedProds.includes(String(id))) {
            deletedProds.push(String(id));
            localStorage.setItem('deleted_products_tracker', JSON.stringify(deletedProds));
        }

        const idx = window.inventory.findIndex(i => i && String(i.id) === String(id));
        if (idx !== -1) window.inventory.splice(idx, 1);
        
        if (typeof window.logAction === 'function') window.logAction('update', p.name, 0, 'លុបចេញពីប្រព័ន្ធ', window.activeUser); 
        if (typeof window.updateCategories === 'function') window.updateCategories();
        if (typeof window.saveData === 'function') await window.saveData(window.userAccounts); 
        window.renderInventory();
        if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
        if (typeof window.renderDashboard === 'function') window.renderDashboard();
        notifyInventoryUser('លុបជោគជ័យ!', 'ជោគជ័យ');
    };

    if (typeof window.ksMsg === 'function') {
        window.ksMsg(`តើអ្នកពិតជាចង់លុប ${p.name} ចេញពីប្រព័ន្ធមែនទេ?`, "បញ្ជាក់ការលុប", true, executeDeleteProd);
    } else {
        executeDeleteProd();
    }
};

window.exportCSV = function() {
    if (!window.inventory || window.inventory.length === 0) {
        return notifyInventoryUser('គ្មានទិន្នន័យទំនិញដើម្បី Export ទេ!', 'ជូនដំណឹង', true);
    }
    const showCost = window.sysSettings && window.sysSettings.cost !== false && window.currentRole === 'admin';
    let csv = '\uFEFF"លេខកូដ","ឈ្មោះទំនិញ","ប្រភេទ","តម្លៃដើម($)","តម្លៃលក់($)","តម្លៃរៀល(៛)","ខ្នាត","ស្តុក","ស្ថានភាព","ផុតកំណត់","ការពណ៌នា"\n';
    
    window.inventory.forEach(p => {
        if (!p) return;
        let id = `"${String(p.customId || p.id || '').replace(/"/g, '""')}"`;
        let name = `"${String(p.name || '').replace(/"/g, '""')}"`;
        let cat = `"${String(p.category || '').replace(/"/g, '""')}"`;
        let cost = showCost ? (parseFloat(p.cost) || 0) : 0;
        let price = parseFloat(p.price) || 0;
        let riel = parseFloat(p.riel) || 0;
        let unit = `"${String(p.unit || '').replace(/"/g, '""')}"`;
        let qty = parseInt(p.qty) || 0;
        let condition = `"${String(p.condition || '').replace(/"/g, '""')}"`;
        let expiry = `"${p.expiry || ''}"`;
        let desc = `"${String(p.desc || '').replace(/"/g, '""')}"`;
        
        csv += `${id},${name},${cat},${cost},${price},${riel},${unit},${qty},${condition},${expiry},${desc}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Inventory_Report_${Date.now()}.csv`;
    link.click();
};