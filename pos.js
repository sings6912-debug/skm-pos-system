// pos.js
window.currentPOSView = 'grid';
window.currentPosCategory = 'all';
window.cartFinalUsd = 0;
window.cartFinalRiel = 0;
window.cartRate = 4000;

window.setPosCategory = function(cat) { 
    window.currentPosCategory = cat; 
    window.updateCategories(); 
    window.renderPOSProducts(); 
};

window.updateCategories = function() {
    const cats = [...new Set((window.inventory || []).filter(p => p && p.category).map(p => p.category))];
    const filter = document.getElementById('filterCategory'); 
    if(filter) filter.innerHTML = '<option value="all">គ្រប់ប្រភេទ</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
    
    const catList = document.getElementById('catList');
    if(catList) catList.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
    
    const units = [...new Set((window.inventory || []).filter(p => p && p.unit).map(p => p.unit))];
    const unitList = document.getElementById('unitList');
    if(unitList) unitList.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
    
    const posTabs = document.getElementById('posCategoryTabs');
    if(posTabs) { 
        let activeCat = window.currentPosCategory ? window.currentPosCategory : 'all'; 
        let tabsHtml = `<button class="pos-tab ${activeCat === 'all' ? 'active' : ''}" onclick="window.setPosCategory('all')">ទាំងអស់ (All)</button>`; 
        cats.forEach(c => { 
            tabsHtml += `<button class="pos-tab ${activeCat === c ? 'active' : ''}" onclick="window.setPosCategory('${c}')">${c}</button>`; 
        }); 
        posTabs.innerHTML = tabsHtml; 
    }
};

window.setPOSView = function(mode, skipRender = false) {
    window.currentPOSView = mode; 
    localStorage.setItem(window.getBranchKey('pos_view_mode'), mode); 
    const btnGrid = document.getElementById('btnPOSGridView'); 
    const btnList = document.getElementById('btnPOSListView');
    if(!btnGrid || !btnList) return;
    if (mode === 'grid') { 
        btnGrid.style.background = 'var(--primary)'; btnGrid.style.color = '#fff'; 
        btnList.style.background = 'transparent'; btnList.style.color = 'var(--text-main)'; 
    } else { 
        btnList.style.background = 'var(--primary)'; btnList.style.color = '#fff'; 
        btnGrid.style.background = 'transparent'; btnGrid.style.color = 'var(--text-main)'; 
    } 
    if (!skipRender) window.renderPOSProducts();
};

window.renderPOSProducts = function() {
    const container = document.getElementById('posProductGridContainer'); 
    if(!container) return;
    try {
        const searchInputEl = document.getElementById('posSearch'); 
        const search = searchInputEl ? searchInputEl.value.toLowerCase().trim() : ''; 
        const posCat = window.currentPosCategory ? window.currentPosCategory : 'all';
        let availableItems = (window.inventory || []).filter(p => p !== null && typeof p === 'object');
        
        if (search) availableItems = availableItems.filter(p => {
            if(!p) return false;
            return (p.name?String(p.name).toLowerCase():'').includes(search) || (p.customId?String(p.customId).toLowerCase():'').includes(search) || (p.desc?String(p.desc).toLowerCase():'').includes(search) || (p.id?String(p.id).toLowerCase():'').includes(search);
        });
        if (posCat !== 'all') availableItems = availableItems.filter(p => p && p.category === posCat);

        availableItems.sort((a, b) => {
            let outA = (parseFloat(a.qty)||0) <= 0 ? 1 : 0; 
            let outB = (parseFloat(b.qty)||0) <= 0 ? 1 : 0;
            if (outA !== outB) return outA - outB; 
            return String(b.id || '').localeCompare(String(a.id || '')); 
        });

        if (availableItems.length === 0) { 
            container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 40px; background: rgba(0,0,0,0.05); border-radius: 8px;">មិនមានទំនិញទេ</div>'; 
            return; 
        }
        
        if (window.currentPOSView === 'grid') {
            let finalHtml = `<div class="pos-products">`;
            availableItems.forEach(p => { 
                if(!p) return;
                let pQty = parseFloat(p.qty) || 0; 
                let stockBadge = '';
                if (pQty <= 0) stockBadge = `<div class="badge-cat" style="background: var(--danger); color: #fff; top: 8px; right: auto; left: 8px; padding: 3px 6px; font-size: 11px; border-radius: 4px;">❌ អស់ស្តុក</div>`;
                else stockBadge = `<div class="badge-cat" style="background: ${pQty<=5?'var(--warning)':'var(--primary)'}; color: ${pQty<=5?'#000':'#fff'}; top: 8px; right: auto; left: 8px; padding: 3px 6px; font-size: 11px; border-radius: 4px;">📦 សល់: ${pQty}</div>`;

                let conditionBadge = (window.sysSettings.condition && p.condition) ? `<div class="badge-cat" style="background: #38bdf8; color: #fff; top: 8px; right: 8px; padding: 3px 6px; font-size: 10px; border-radius: 4px;">${p.condition}</div>` : '';
                let expiryBadge = (window.sysSettings.expiry && p.expiry) ? `<div style="font-size:10px; color:var(--warning); margin-top:2px;">📅 ផុតកំណត់: ${new Date(p.expiry).toLocaleDateString('km-KH')}</div>` : '';

                let cItem = (window.cart || []).find(c => c && c.id === p.id); 
                let qtyInCart = cItem ? cItem.cartQty : 0;
                let btnHtml = qtyInCart > 0 ? `<div class="pos-add-btn added">${qtyInCart}</div>` : `<div class="pos-add-btn empty">+</div>`;
                let rielHtml = (parseFloat(p.riel)||0) > 0 ? `<span style="font-size:var(--fs-11); color:var(--text-muted); font-weight:normal;">| ${parseFloat(p.riel).toLocaleString()} ៛</span>` : '';
                let itemOpacity = pQty <= 0 ? 'opacity: 0.6; filter: grayscale(50%);' : '';
                
                finalHtml += `<div class="pos-item" style="${itemOpacity}" onclick="window.addToCart('${p.id}')"><div class="pos-item-img-container">${stockBadge}${conditionBadge}<img src="${p.image||'https://placehold.co/200?text=No+Img'}" alt="Product">${btnHtml}</div><div class="pos-item-details"><div class="pos-item-price">${window.fMoney(p.price)} ${rielHtml}</div><div class="pos-item-name" title="${p.name}">${p.name}</div>${expiryBadge}</div></div>`; 
            });
            container.innerHTML = finalHtml + `</div>`;
        } else {
            let tableHTML = `<div class="table-responsive" style="height: 100%;"><table id="mainPOSTable" style="font-size: var(--fs-13); width: 100%;"><thead><tr class="header-row"><th style="width: 60px; text-align:center;">រូបភាព</th><th onclick="if(window.sortTable) window.sortTable('mainPOSTable', 1)">ឈ្មោះទំនិញ <span>⬍</span></th><th style="width: 120px; text-align:right;" onclick="if(window.sortTable) window.sortTable('mainPOSTable', 2, 'number')">តម្លៃលក់ <span>⬍</span></th><th style="width: 90px; text-align:center;">សកម្មភាព</th></tr><tr class="filter-row"><th></th><th><input type="text" class="col-filter" onkeyup="if(window.filterTable) window.filterTable('mainPOSTable')" placeholder="ស្វែងរកឈ្មោះ..."></th><th><input type="text" class="col-filter" onkeyup="if(window.filterTable) window.filterTable('mainPOSTable')" placeholder="ស្វែងរកតម្លៃ..."></th><th></th></tr></thead><tbody>`;
            
            availableItems.forEach(p => {
                if(!p) return;
                let pQty = parseFloat(p.qty) || 0;
                let stockText = pQty <= 0 ? `<span style="color:var(--danger); font-weight:bold;">អស់ស្តុក</span>` : `<span style="color:${pQty<=5?'var(--warning)':'var(--success)'}">${pQty}</span> ${p.unit||''}`;
                let rielHtml = (parseFloat(p.riel)||0) > 0 ? `<br><span style="font-size:var(--fs-11); color:var(--text-muted);">${parseFloat(p.riel).toLocaleString()} ៛</span>` : '';
                let itemOpacity = pQty <= 0 ? 'opacity: 0.6;' : '';
                let conditionBadge = (window.sysSettings.condition && p.condition) ? `<span style="font-size:10px; background:#38bdf8; color:#fff; padding:2px 4px; border-radius:4px; margin-left:4px;">${p.condition}</span>` : '';
                let expiryDisplay = (window.sysSettings.expiry && p.expiry) ? `<br><span style="color:var(--warning); font-size:10px;">📅 ផុតកំណត់: ${new Date(p.expiry).toLocaleDateString('km-KH')}</span>` : '';

                tableHTML += `<tr data-id="${p.id}" style="${itemOpacity}"><td style="text-align:center; padding: 5px;"><img src="${p.image||'https://placehold.co/100?text=Img'}" style="width:45px; height:45px; object-fit:cover; border-radius:6px; border:1px solid var(--border);"></td><td data-sort="${String(p.name).replace(/"/g, '&quot;')}" style="padding: 5px 10px;"><div style="font-weight:bold; color:var(--text-main); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name} ${conditionBadge}</div><div style="font-size:var(--fs-11); color:var(--text-muted);">ស្តុក: ${stockText} ${expiryDisplay}</div></td><td data-sort="${p.price}" style="text-align:right; font-weight:bold; color:var(--success); padding: 5px 10px;">${window.fMoney(p.price)}${rielHtml}</td><td style="text-align:center; padding: 5px;"><button class="btn btn-primary" style="padding: 6px 12px; font-size:var(--fs-12);" onclick="window.addToCart('${p.id}')">➕ បន្ថែម</button></td></tr>`;
            });
            container.innerHTML = tableHTML + `</tbody></table></div>`;
        }
    } catch(err) { 
        container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--danger);">Error POS: ${err.message}</div>`; 
    }
};

window.addToCart = function(id) { 
    window.playBeep(); 
    const p = (window.inventory || []).find(i => i && i.id === id); 
    if (!p) return; 
    if (!window.cart) window.cart = [];
    const cItem = window.cart.find(c => c && c.id === id); 
    let stockQty = parseInt(p.qty) || 0;
    
    if (stockQty <= 0 && window.sysSettings && window.sysSettings.preorder) {
        if (!confirm(`ទំនិញ "${p.name}" អស់ពីស្តុកហើយ! តើអ្នកចង់កត់ត្រាវាជាការកុម្ម៉ង់ទុកមុន (Pre-order) មែនទេ?`)) return;
    } else if (stockQty <= 0) {
        return window.ksMsg('ទំនិញនេះអស់ពីស្តុកហើយ!');
    }

    if(cItem) { 
        if(cItem.cartQty < stockQty || (window.sysSettings && window.sysSettings.preorder)) { 
            cItem.cartQty++; 
        } else { 
            window.ksMsg(`ស្តុកមានត្រឹមតែ ${stockQty} ${p.unit||'ឯកតា'} ប៉ុណ្ណោះ!`); 
        } 
    } else { 
        window.cart.push({...p, cartQty: 1}); 
    } 
    window.renderCart(); 
    window.renderPOSProducts();
};

window.updateCartQty = function(id, change) { 
    if(change > 0) window.playBeep(); 
    const cItem = (window.cart || []).find(c => c && c.id === id); 
    const p = (window.inventory || []).find(i => i && i.id === id); 
    if (!p || !cItem) return;
    let stockQty = parseInt(p.qty) || 0; 
    cItem.cartQty += change; 
    
    if(cItem.cartQty > stockQty && !(window.sysSettings && window.sysSettings.preorder)) { 
        cItem.cartQty = stockQty; 
        window.ksMsg(`ស្តុកមានត្រឹមតែ ${stockQty} ${p.unit||'ឯកតា'} ប៉ុណ្ណោះ!`); 
    } 
    
    if(cItem.cartQty <= 0) {
        window.cart = window.cart.filter(c => c && c.id !== id);
    }
    
    window.renderCart(); 
    window.renderPOSProducts();
};

window.setCartQtyManually = function(id, val) {
    let newQty = parseInt(val);
    if (isNaN(newQty) || newQty <= 0) { 
        window.cart = (window.cart || []).filter(c => c && c.id !== id);
    } else {
        const cItem = (window.cart || []).find(c => c && c.id === id); 
        const p = (window.inventory || []).find(i => i && i.id === id); 
        if(!p || !cItem) return;
        let stockQty = parseInt(p.qty) || 0;
        
        if(newQty > stockQty && !(window.sysSettings && window.sysSettings.preorder)) { 
            cItem.cartQty = stockQty; 
            window.ksMsg(`ស្តុកមានត្រឹមតែ ${stockQty} ${p.unit||'ឯកតា'} ប៉ុណ្ណោះ!`); 
        } else {
            cItem.cartQty = newQty;
        }
    }
    window.renderCart(); 
    window.renderPOSProducts();
};

window.renderCart = function() {
    const cHTML = document.getElementById('cartItems'); 
    if(!cHTML) return;
    let tQty = 0, tUsdOnly = 0, tRielOnly = 0; 
    let globalRateEl = document.getElementById('globalExchangeRate'); 
    window.cartRate = parseFloat(globalRateEl ? globalRateEl.value : 4000) || 4000;
    
    if(!window.cart || window.cart.length === 0) {
        cHTML.innerHTML = `<div style="text-align: center; color: var(--text-muted); margin-top: 50px; font-size: var(--fs-14);">កន្ត្រកទទេ</div>`; 
    } else {
        let finalCartHtml = '';
        window.cart.forEach(c => {
            if(!c) return; 
            tQty += c.cartQty; 
            let pUsd = parseFloat(c.price) || 0; 
            let pRiel = parseFloat(c.riel) || 0;
            if (pUsd > 0) tUsdOnly += pUsd * c.cartQty; else if (pRiel > 0) tRielOnly += pRiel * c.cartQty;
            let priceDisplay = pUsd > 0 ? window.fMoney(pUsd) : (pRiel ? pRiel.toLocaleString()+' ៛' : '$0.00'); 
            let totalDisplay = pUsd > 0 ? window.fMoney(pUsd * c.cartQty) : (pRiel ? (pRiel * c.cartQty).toLocaleString()+' ៛' : '$0.00');
            finalCartHtml += `<div class="cart-item"><img src="${c.image||'https://placehold.co/100?text=Img'}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; margin-right: 10px; border: 1px solid var(--border);"><div style="flex:1;"><div style="font-weight:bold; font-size:var(--fs-14); margin-bottom:2px; line-height: 1.2; color: var(--text-main);">${c.name}</div><div style="color:var(--success); font-size:var(--fs-12);">${priceDisplay} <small style="color:var(--text-muted);">/ ${c.unit||'ឯកតា'}</small></div></div><div style="display:flex; align-items:center; gap:4px; background:var(--bg-dark); padding:2px; border-radius:6px; border:1px solid var(--border);"><button class="qty-btn" onclick="window.updateCartQty('${c.id}', -1)" style="width:20px; height:20px; font-size:var(--fs-14);"> - </button><input type="number" class="cart-qty-input" value="${c.cartQty}" onchange="window.setCartQtyManually('${c.id}', this.value)" style="width: 35px; height:22px; text-align: center; background: transparent; border: none; font-weight: bold; color: var(--text-main); outline:none; font-size: var(--fs-13);"><button class="qty-btn" onclick="window.updateCartQty('${c.id}', 1)" style="width:20px; height:20px; font-size:var(--fs-14);"> + </button></div><div style="width:70px; text-align:right; font-weight:bold; font-size:var(--fs-14); margin-left: 10px; color: var(--text-main);">${totalDisplay}</div></div>`;
        });
        cHTML.innerHTML = finalCartHtml;
    }
    
    let posDiscEl = document.getElementById('posDiscount'); 
    let discountValue = parseFloat(posDiscEl ? posDiscEl.value : 0) || 0; 
    let posDiscTypeEl = document.getElementById('posDiscountType'); 
    let discountType = posDiscTypeEl ? posDiscTypeEl.value : '%';
    
    let totalBaseUsd = tUsdOnly + (tRielOnly / window.cartRate); 
    let discountAmountUsd = 0;
    if (discountType === '%') { 
        if(discountValue > 100) discountValue = 100; 
        if(discountValue < 0) discountValue = 0; 
        discountAmountUsd = totalBaseUsd * (discountValue / 100); 
    } else { 
        if(discountValue < 0) discountValue = 0; 
        discountAmountUsd = discountValue; 
        if(discountAmountUsd > totalBaseUsd) discountAmountUsd = totalBaseUsd; 
    }
    let subTotalAfterDiscount = totalBaseUsd - discountAmountUsd; 
    let taxAmountUsd = 0; 
    if (window.sysSettings && window.sysSettings.tax) { 
        let taxRate = parseFloat(window.sysSettings.taxRate) || 0; 
        taxAmountUsd = subTotalAfterDiscount * (taxRate / 100); 
    }
    window.cartFinalUsd = subTotalAfterDiscount + taxAmountUsd; 
    window.cartFinalRiel = window.cartFinalUsd * window.cartRate;
    
    const cartTotalQtyEl = document.getElementById('cartTotalQty');
    if (cartTotalQtyEl) cartTotalQtyEl.innerText = tQty; 
    
    const cartDiscEl = document.getElementById('cartDiscountAmount');
    if(cartDiscEl) cartDiscEl.innerText = '-' + window.fMoney(discountAmountUsd); 
    
    const cartTaxEl = document.getElementById('cartTaxAmount');
    if(cartTaxEl) cartTaxEl.innerText = '+' + window.fMoney(taxAmountUsd);
    
    const cartTotEl = document.getElementById('cartTotalAmount');
    if (cartTotEl) cartTotEl.innerText = window.fMoney(window.cartFinalUsd); 
    
    const cartRielEl = document.getElementById('cartTotalAmountRiel');
    if(cartRielEl) {
        if(window.cartFinalRiel > 0) cartRielEl.innerText = Math.round(window.cartFinalRiel).toLocaleString() + ' ៛'; 
        else cartRielEl.innerText = '';
    }
    
    const body = document.getElementById('cartSummaryBody'); 
    if(!body) return;
    const isCollapsed = body.classList.contains('collapsed'); 
    const arrow = isCollapsed ? '▲' : '▼'; 
    const actionText = isCollapsed ? 'បើកផ្ទាំងគិតលុយ (Checkout)' : 'បង្រួម/ពង្រីក ផ្ទាំងគិតលុយ';
    const mobileInfo = document.getElementById('mobileCartTotalInfo');
    if(mobileInfo) mobileInfo.innerText = `${arrow} ${actionText} - ${tQty} មុខ (${window.fMoney(window.cartFinalUsd)}) ${arrow}`;
};

window.clearCart = function() { 
    if(!window.cart || window.cart.length === 0) return; 
    window.ksMsg('តើអ្នកពិតជាចង់លុបទំនិញទាំងអស់ចេញពីកន្ត្រកមែនទេ?', 'បញ្ជាក់ការលុប', true, () => { 
        window.cart = []; 
        window.renderCart(); 
        window.renderPOSProducts(); 
    }); 
};

window.toggleCartSummary = function() { 
    const body = document.getElementById('cartSummaryBody'); 
    const btn = document.getElementById('toggleCartBtn'); 
    if(!body || !btn) return;
    const tQty = (window.cart || []).reduce((acc, item) => acc + item.cartQty, 0);
    if (window.innerWidth <= 768) { 
        document.getElementById('mobileCartContainer').classList.toggle('open'); 
    } else {
        if (body.classList.contains('collapsed')) { 
            body.classList.remove('collapsed'); 
            btn.innerHTML = `<span id="mobileCartTotalInfo">▼ បង្រួម/ពង្រីក ផ្ទាំងគិតលុយ - ${tQty} មុខ (${window.fMoney(window.cartFinalUsd)}) ▼</span>`; 
        } else { 
            body.classList.add('collapsed'); 
            btn.innerHTML = `<span id="mobileCartTotalInfo">▲ បើកផ្ទាំងគិតលុយ (Checkout) - ${tQty} មុខ (${window.fMoney(window.cartFinalUsd)}) ▲</span>`; 
        }
    }
};

window.openCheckoutModal = function() { 
    if(!window.cart || window.cart.length === 0) return window.ksMsg('គ្មានទំនិញក្នុងកន្ត្រកទេ!'); 
    let displayHtml = `${window.fMoney(window.cartFinalUsd)}`; 
    if(window.cartFinalRiel > 0) displayHtml += ` <br><span style="font-size: 18px; color: var(--text-muted);">${Math.round(window.cartFinalRiel).toLocaleString()} ៛</span>`; 
    
    document.getElementById('checkoutTotalDisplay').innerHTML = displayHtml; 
    document.getElementById('checkoutReceivedUsd').value = ''; 
    document.getElementById('checkoutReceivedRiel').value = ''; 
    document.getElementById('checkoutChangeDisplay').innerText = '$0.00 | 0 ៛'; 
    document.getElementById('checkoutModal').style.display = 'flex'; 
    
    if (window.innerWidth <= 768) { document.getElementById('mobileCartContainer').classList.remove('open'); }
    if (window.cartFinalUsd > 0) setTimeout(() => document.getElementById('checkoutReceivedUsd').focus(), 100); 
    else setTimeout(() => document.getElementById('checkoutReceivedRiel').focus(), 100); 
};

window.calculateChange = function() { 
    let recvUsd = parseFloat(document.getElementById('checkoutReceivedUsd').value) || 0; 
    let recvRiel = parseFloat(document.getElementById('checkoutReceivedRiel').value) || 0; 
    let totalKhr = Math.round(window.cartFinalRiel); 
    let recvKhr = (recvUsd * window.cartRate) + recvRiel; 
    let changeKhr = recvKhr - totalKhr; 
    if (changeKhr < 0) changeKhr = 0; 
    let changeUsd = changeKhr / window.cartRate; 
    document.getElementById('checkoutChangeDisplay').innerText = `${window.fMoney(changeUsd)} | ${Math.round(changeKhr).toLocaleString()} ៛`; 
};

window.processCheckoutPaid = function() { 
    let recvUsdText = document.getElementById('checkoutReceivedUsd').value; 
    let recvRielText = document.getElementById('checkoutReceivedRiel').value; 
    let recvUsd = parseFloat(recvUsdText) || 0;
    let recvRiel = parseFloat(recvRielText) || 0;

    if (!recvUsdText && !recvRielText) {
        recvUsd = window.cartFinalUsd;
        recvRiel = 0;
    }

    let totalKhr = Math.round(window.cartFinalRiel); 
    let recvKhr = (recvUsd * window.cartRate) + recvRiel; 
    let changeKhr = recvKhr - totalKhr; 
    if (changeKhr < 0) changeKhr = 0; 
    let changeUsd = changeKhr / window.cartRate; 
    
    document.getElementById('checkoutModal').style.display = 'none'; 
    window.checkout('paid', recvUsd, recvRiel, changeUsd, changeKhr); 
};

window.openPreorderModal = function() { 
    if(!window.cart || window.cart.length === 0) return window.ksMsg('គ្មានទំនិញក្នុងកន្ត្រកទេ!'); 
    
    const custNameInput = document.getElementById('posCustomerName').value.trim();
    if(!custNameInput) return window.ksMsg('សុំបញ្ចូលឈ្មោះអតិថិជនសិន មុននឹងចុចកក់ប្រាក់!');

    let displayHtml = `${window.fMoney(window.cartFinalUsd)}`; 
    if(window.cartFinalRiel > 0) displayHtml += ` <br><span style="font-size: 18px; color: var(--text-muted);">${Math.round(window.cartFinalRiel).toLocaleString()} ៛</span>`; 
    
    document.getElementById('preorderTotalDisplay').innerHTML = displayHtml; 
    document.getElementById('preorderDepositUsd').value = ''; 
    document.getElementById('preorderDepositRiel').value = ''; 
    document.getElementById('preorderRemainingDisplay').innerText = `${window.fMoney(window.cartFinalUsd)} | ${Math.round(window.cartFinalRiel).toLocaleString()} ៛`; 
    document.getElementById('preorderModal').style.display = 'flex'; 
    
    if (window.innerWidth <= 768) { document.getElementById('mobileCartContainer').classList.remove('open'); }
    setTimeout(() => document.getElementById('preorderDepositUsd').focus(), 100);
};

window.calculatePreorderRemaining = function() { 
    let depositUsd = parseFloat(document.getElementById('preorderDepositUsd').value) || 0; 
    let depositRiel = parseFloat(document.getElementById('preorderDepositRiel').value) || 0; 
    let totalKhr = Math.round(window.cartFinalRiel); 
    let depositKhr = (depositUsd * window.cartRate) + depositRiel; 
    let remainingKhr = totalKhr - depositKhr; 
    if (remainingKhr < 0) remainingKhr = 0; 
    let remainingUsd = remainingKhr / window.cartRate; 
    document.getElementById('preorderRemainingDisplay').innerText = `${window.fMoney(remainingUsd)} | ${Math.round(remainingKhr).toLocaleString()} ៛`; 
};

window.processPreorder = function() {
    let depositUsd = parseFloat(document.getElementById('preorderDepositUsd').value) || 0; 
    let depositRiel = parseFloat(document.getElementById('preorderDepositRiel').value) || 0;
    document.getElementById('preorderModal').style.display = 'none'; 
    window.checkout('preorder', depositUsd, depositRiel, 0, 0); 
};

window.executePrint = function(htmlContent) {
    const printWindow = window.open('', '', 'width=300,height=600');
    if(!printWindow) return;
    printWindow.document.write('<html><head><title>Print Receipt</title>');
    printWindow.document.write('<link rel="stylesheet" href="print.css" type="text/css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div id="receipt-container">');
    printWindow.document.write(htmlContent);
    printWindow.document.write('</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
};

// ⚡ កែប្រែ Checkout ដើម្បីដំណើរការលឿនជាងមុន និង Clear Filter ម៉ោងចោលស្វ័យប្រវត្តិ
window.checkout = function(status, rUsd = 0, rRiel = 0, cUsd = 0, cRiel = 0) {
    if(!window.cart || window.cart.length === 0) return window.ksMsg('គ្មានទំនិញក្នុងកន្ត្រកទេ!');
    const custNameInput = document.getElementById('posCustomerName').value.trim(); 
    const custPhoneInput = document.getElementById('posCustomerPhone').value.trim();
    if((status === 'unpaid' || status === 'preorder') && !custNameInput) return window.ksMsg('សុំបញ្ចូលឈ្មោះអតិថិជនសិន!');
    
    let discountValue = parseFloat(document.getElementById('posDiscount') ? document.getElementById('posDiscount').value : 0) || 0; 
    let discountType = document.getElementById('posDiscountType') ? document.getElementById('posDiscountType').value : '%'; 
    let appliedTaxRate = (window.sysSettings && window.sysSettings.tax) ? (parseFloat(window.sysSettings.taxRate) || 0) : 0;
    
    let docType = status === 'paid' ? 'បង្កាន់ដៃទទួលប្រាក់ / Receipt' : (status === 'preorder' ? 'បង្កាន់ដៃកក់ប្រាក់ / Pre-order Receipt' : 'វិក្កយបត្រ / Invoice'); 
    let currentSellerName = window.activeUser ? (window.activeUser.fullName ? window.activeUser.fullName : window.activeUser.username) : 'System'; 
    let newInvId = window.generateInvoiceId(); 
    let timestampNow = Date.now(); 

    let receiptHTML = `<div style="text-align:center; margin-bottom: 8px;">`; 
    if(window.shopLogo) receiptHTML += `<img src="${window.shopLogo}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 50%; margin-bottom: 5px; filter: grayscale(100%);">`; 
    receiptHTML += `<h2 style="margin:0; font-size:16px;">${window.shopName}</h2>`; 
    if(window.shopPhone) receiptHTML += `<p style="margin:2px 0; font-size:12px;">Tel: ${window.shopPhone}</p>`; 
    if(window.shopAddress) receiptHTML += `<p style="margin:2px 0; font-size:12px;">${window.shopAddress}</p>`; 
    receiptHTML += `<div class="print-dashed-line"></div><p style="margin:4px 0; font-size:14px; font-weight:bold;">${docType}</p><p style="margin:2px 0; font-size:11px; text-align:left;">កាលបរិច្ឆេទ: ${window.fDate()}</p><p style="margin:2px 0; font-size:11px; text-align:left;">លេខវិក្កយបត្រ: ${newInvId}</p><p style="margin:2px 0; font-size:11px; text-align:left;">អ្នកលក់: ${currentSellerName}</p>`;
    if(custNameInput) receiptHTML += `<p style="margin:2px 0; font-size:11px; text-align:left;">អតិថិជន: <b>${custNameInput}</b> ${custPhoneInput?`(${custPhoneInput})`:''}</p>`;
    receiptHTML += `<div class="print-dashed-line"></div></div><table style="width:100%; text-align:left; font-size: 12px; table-layout: fixed;"><thead><tr><th style="width: 50%; border-bottom: 1px solid #000; padding-bottom: 4px;">ទំនិញ</th><th style="width: 20%; text-align:center; border-bottom: 1px solid #000; padding-bottom: 4px;">ចំនួន</th><th style="width: 30%; text-align:right; border-bottom: 1px solid #000; padding-bottom: 4px;">សរុប</th></tr></thead><tbody>`;

    window.cart.forEach((c, index) => {
        if(!c) return; 
        const idx = (window.inventory || []).findIndex(p => p && p.id === c.id);
        if(idx !== -1) {
            if (status !== 'preorder') {
                window.inventory[idx].qty -= c.cartQty; 
            }
            if (typeof window.logAction === 'function') window.logAction('sale', c.name, c.cartQty, status === 'paid' ? 'លក់ចេញ (ទូទាត់រួច)' : (status === 'preorder' ? `កក់ប្រាក់ (Pre-order ដោយ ${custNameInput})` : `លក់ចេញ (រង់ចាំទូទាត់ ដោយ ${custNameInput})`), window.activeUser);
            let lineStr = '', uPriceStr = '';
            if(c.price > 0) { lineStr = window.fMoney(c.price * c.cartQty); uPriceStr = window.fMoney(c.price); } 
            else if(c.riel > 0) { lineStr = ((c.riel||0) * c.cartQty).toLocaleString() + '៛'; uPriceStr = c.riel.toLocaleString() + '៛'; } 
            else { lineStr = '$0.00'; uPriceStr = '$0.00'; } 
            receiptHTML += `<tr><td colspan="3" style="padding-top: 4px; font-weight:bold; font-size: 12px;">${index + 1}. ${c.name}</td></tr><tr><td style="padding-bottom: 4px; font-size: 11px;">${uPriceStr}</td><td style="text-align:center; padding-bottom: 4px; font-size: 11px;">${c.cartQty} ${c.unit||''}</td><td style="text-align:right; font-weight:bold; padding-bottom: 4px;">${lineStr}</td></tr>`;
        }
    });
    receiptHTML += `</tbody></table><div class="print-dashed-line"></div>`;

    let paidUsdAmount = 0;
    if (status === 'paid') paidUsdAmount = window.cartFinalUsd;
    else if (status === 'preorder') paidUsdAmount = rUsd + (rRiel / window.cartRate);

    const newInvoice = { 
        id: newInvId, 
        timestamp: timestampNow, 
        date: window.fDate(), 
        customer: custNameInput || 'អតិថិជនទូទៅ', 
        phone: custPhoneInput, 
        items: [...window.cart], 
        rate: window.cartRate, 
        totalAmount: window.cartFinalUsd, 
        totalRiel: Math.round(window.cartFinalRiel), 
        discount: discountValue, 
        discountType: discountType, 
        taxRate: appliedTaxRate, 
        receivedUsd: rUsd, 
        receivedRiel: rRiel, 
        changeUsd: cUsd, 
        changeRiel: cRiel, 
        status: status, 
        seller: currentSellerName, 
        paidUsd: paidUsdAmount 
    }; 
    
    if(!window.invoices) window.invoices = [];
    window.invoices.unshift(newInvoice); 
    
    if(custNameInput && typeof window.setAutoRegisterCustomer === 'function') {
        window.setAutoRegisterCustomer(custNameInput, custPhoneInput);
    }

    receiptHTML += `<table style="width:100%; font-size: 12px; margin-top: 5px;">`;
    if (discountValue > 0) receiptHTML += `<tr><td>បញ្ចុះតម្លៃ:</td><td style="text-align:right;">${discountType === '%' ? `${discountValue}%` : window.fMoney(discountValue)}</td></tr>`;
    if (appliedTaxRate > 0) receiptHTML += `<tr><td>VAT (${appliedTaxRate}%):</td><td style="text-align:right;">បូកបញ្ចូល</td></tr>`;
    receiptHTML += `<tr><td style="font-weight:bold; font-size:14px; padding-top:4px;">សរុបប្រាក់:</td><td style="text-align:right; font-weight:bold; font-size:14px; padding-top:4px;">${window.fMoney(window.cartFinalUsd)}</td></tr>`;
    if(window.cartFinalRiel > 0) receiptHTML += `<tr><td></td><td style="text-align:right; font-weight:bold; font-size:14px;">${Math.round(window.cartFinalRiel).toLocaleString()} ៛</td></tr>`;
    
    if(status === 'paid' && (rUsd > 0 || rRiel > 0)) { 
        let rStr = []; if(rUsd > 0) rStr.push(window.fMoney(rUsd)); if(rRiel > 0) rStr.push(rRiel.toLocaleString() + '៛'); 
        receiptHTML += `<tr><td style="padding-top:6px; font-size:12px;">ប្រាក់ទទួល:</td><td style="text-align:right; padding-top:6px; font-size:12px;">${rStr.join(' | ')}</td></tr>`; 
        let cStr = []; if(cUsd > 0 || cRiel > 0) { cStr.push(window.fMoney(cUsd)); cStr.push(Math.round(cRiel).toLocaleString() + ' ៛'); } else cStr.push('$0.00'); 
        receiptHTML += `<tr><td style="font-size:12px;">ប្រាក់អាប់:</td><td style="text-align:right; font-size:12px;">${cStr.join(' | ')}</td></tr>`; 
    } else if (status === 'preorder') {
        let rStr = []; if(rUsd > 0) rStr.push(window.fMoney(rUsd)); if(rRiel > 0) rStr.push(rRiel.toLocaleString() + '៛');
        if (rStr.length > 0) {
            receiptHTML += `<tr><td style="padding-top:4px; font-size:11px;">ប្រាក់កក់មុន:</td><td style="text-align:right; font-size:11px;">${rStr.join(' | ')}</td></tr>`;
            let remainingUsd = window.cartFinalUsd - (rUsd + (rRiel/window.cartRate));
            if (remainingUsd < 0) remainingUsd = 0;
            receiptHTML += `<tr><td style="font-size:11px; font-weight:bold;">ប្រាក់នៅខ្វះ:</td><td style="text-align:right; font-size:11px; font-weight:bold;">${window.fMoney(remainingUsd)}</td></tr>`;
        }
    }
    receiptHTML += `</table>`;

    if (window.shopQR) receiptHTML += `<div style="text-align:center; margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px;"><p style="font-size:12px; margin-bottom:5px; font-weight:bold;">ស្កេនទូទាត់ប្រាក់ (Scan to Pay)</p><img src="${window.shopQR}" style="width: 180px; height: 180px; object-fit: contain; filter: grayscale(100%);"></div>`;
    receiptHTML += `<p style="text-align:center; font-size:10px; margin-top: 10px;">(Rate: 1$ = ${window.cartRate}៛)</p><p style="text-align:center; font-size:12px; margin-top: 5px; font-weight:bold;">សូមអរគុណ! សូមអញ្ជើញមកម្តងទៀត។</p>`; 
    
    // Clear the cart immediately
    window.cart = []; 
    
    const cNameInputEl = document.getElementById('posCustomerName'); if(cNameInputEl) cNameInputEl.value = ''; 
    const cPhoneInputEl = document.getElementById('posCustomerPhone'); if(cPhoneInputEl) cPhoneInputEl.value = ''; 
    const posDiscEl = document.getElementById('posDiscount'); if (posDiscEl) posDiscEl.value = ''; 
    const mobileContainer = document.getElementById('mobileCartContainer'); if(mobileContainer) mobileContainer.classList.remove('open'); 
    
    // ⚡ 1. រក្សាទុក LocalStorage ជាមុនដើម្បីអោយលឿន
    localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(window.invoices));
    if (window.inventory) localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
    
    // ⚡ 2. Clear Date Range Inputs before rendering Unpaid table
    const dateFromInput = document.getElementById('invoiceDateFrom');
    const dateToInput = document.getElementById('invoiceDateTo');
    if (dateFromInput) dateFromInput.value = '';
    if (dateToInput) dateToInput.value = '';

    // Render ភ្លាមៗ (Instant Feedback)
    window.renderCart(); 
    window.renderPOSProducts(); 
    if(typeof window.renderUnpaid === 'function') window.renderUnpaid();
    if(typeof window.renderCustomers === 'function') window.renderCustomers();
    
    // Execute Print ភ្លាមៗ
    window.executePrint(receiptHTML);

    // ⚡ 3. បោះទិន្នន័យទៅ Cloud ស្ងាត់ៗ (Background Sync) ដើម្បីកុំអោយគាំង
    setTimeout(() => {
        if (typeof window.saveData === 'function') {
            window.saveData(window.userAccounts); 
        }
    }, 100);
};

window.handleBarcodeScan = function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const input = document.getElementById('posSearch');
        if (!input) return;
        const code = input.value.trim().toLowerCase();
        if (!code) return;

        const found = (window.inventory || []).find(p => p && (
            String(p.customId || '').toLowerCase() === code ||
            String(p.id || '').toLowerCase() === code ||
            String(p.name || '').toLowerCase() === code
        ));

        if (found) {
            window.addToCart(found.id);
            input.value = '';
            window.renderPOSProducts();
        } else {
            if (typeof window.ksMsg === 'function') {
                window.ksMsg('រកមិនឃើញទំនិញដែលមានបាកូដនេះទេ!', 'មិនមានទំនិញ');
            } else {
                alert('រកមិនឃើញទំនិញដែលមានបាកូដនេះទេ!');
            }
        }
    }
};