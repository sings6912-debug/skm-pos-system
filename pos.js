/**
 * pos.js - គ្រប់គ្រងប្រព័ន្ធលក់ កន្ត្រកទំនិញ ការស្កេនបាកូដ និងការបោះពុម្ពវិក្កយបត្រ (Point of Sale)
 */

window.currentPOSView = 'grid';
window.currentPosCategory = 'all';
window.cartFinalUsd = 0;
window.cartFinalRiel = 0;
window.cartRate = 4000;

// អនុគមន៍ជំនួយសម្រាប់បង្ហាញសារជូនដំណឹងដោយសុវត្ថិភាព
function notifyPosUser(msg, title = 'ជូនដំណឹង', isError = false) {
    if (typeof window.ksMsg === 'function') {
        window.ksMsg(msg, title);
    } else if (typeof window.showToast === 'function') {
        window.showToast(msg, isError);
    } else {
        console.log(`[${title}] ${msg}`);
    }
}

window.setPosCategory = function(cat) { 
    window.currentPosCategory = cat; 
    window.updateCategories(); 
    window.renderPOSProducts(); 
};

window.updateCategories = function() {
    let activeItems = (window.inventory || []).filter(p => p !== null && typeof p === 'object');
    
    const cats = [...new Set(activeItems.filter(p => p.category).map(p => String(p.category).trim()))].filter(Boolean);
    
    const filter = document.getElementById('filterCategory'); 
    if(filter) {
        const currentFilterVal = filter.value || 'all';
        filter.innerHTML = '<option value="all">គ្រប់ប្រភេទ</option>' + cats.map(c => `<option value="${c.replace(/"/g, '&quot;')}">${c}</option>`).join('');
        if (cats.includes(currentFilterVal) || currentFilterVal === 'all') {
            filter.value = currentFilterVal;
        }
    }
    
    const catList = document.getElementById('catList');
    if(catList) catList.innerHTML = cats.map(c => `<option value="${c.replace(/"/g, '&quot;')}">${c}</option>`).join('');
    
    const units = [...new Set(activeItems.filter(p => p.unit).map(p => String(p.unit).trim()))].filter(Boolean);
    const unitList = document.getElementById('unitList');
    if(unitList) unitList.innerHTML = units.map(u => `<option value="${u.replace(/"/g, '&quot;')}">${u}</option>`).join('');
    
    const posTabs = document.getElementById('posCategoryTabs');
    if(posTabs) { 
        let activeCat = window.currentPosCategory ? window.currentPosCategory : 'all'; 
        
        const lang = localStorage.getItem('app_lang') || 'km';
        const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
        const allLabel = d.allCategoryTab || 'ទាំងអស់ (All)';
        
        let allCount = activeItems.length;
        let tabsHtml = `<button class="pos-tab ${activeCat === 'all' ? 'active' : ''}" onclick="window.setPosCategory('all')">${allLabel} (${allCount})</button>`; 
        
        cats.forEach(c => { 
            let catCount = activeItems.filter(p => String(p.category).trim() === c).length;
            let safeCatJs = c.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            tabsHtml += `<button class="pos-tab ${activeCat === c ? 'active' : ''}" onclick="window.setPosCategory('${safeCatJs}')">${c} (${catCount})</button>`; 
        }); 
        posTabs.innerHTML = tabsHtml; 
        
        if(typeof window.initPosTabScroll === 'function') {
            window.initPosTabScroll();
        }
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
        if (posCat !== 'all') availableItems = availableItems.filter(p => p && String(p.category).trim() === posCat);

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

                let condStr = p.condition ? String(p.condition).trim() : '';
                let conditionBadge = (window.sysSettings && window.sysSettings.condition && condStr && condStr !== '-') ? `<div class="badge-cat" style="background: #38bdf8; color: #fff; top: 8px; right: 8px; padding: 3px 6px; font-size: 10px; border-radius: 4px;">${condStr}</div>` : '';
                
                // ការពារកុំឱ្យចេញ Invalid Date ពេលទំនិញគ្មានថ្ងៃផុតកំណត់
                let expiryBadge = '';
                if (window.sysSettings && window.sysSettings.expiry && p.expiry) {
                    const expDateObj = new Date(p.expiry);
                    if (!isNaN(expDateObj.getTime())) {
                        expiryBadge = `<div style="font-size:10px; color:var(--warning); margin-top:2px;">📅 ផុតកំណត់: ${expDateObj.toLocaleDateString('km-KH')}</div>`;
                    }
                }

                let cItem = (window.cart || []).find(c => c && c.id === p.id); 
                let qtyInCart = cItem ? cItem.cartQty : 0;
                let btnHtml = qtyInCart > 0 ? `<div class="pos-add-btn added">${qtyInCart}</div>` : `<div class="pos-add-btn empty">+</div>`;
                
                let pUsdVal = parseFloat(p.price) || 0;
                let pRielVal = parseFloat(p.riel) || 0;
                let mainPriceStr = pUsdVal > 0 ? window.fMoney(pUsdVal) : (pRielVal > 0 ? `${pRielVal.toLocaleString()} ៛` : '$0.00');
                let rielHtml = (pUsdVal > 0 && pRielVal > 0) ? `<span style="font-size:var(--fs-11); color:var(--text-muted); font-weight:normal;">| ${pRielVal.toLocaleString()} ៛</span>` : '';
                let itemOpacity = pQty <= 0 ? 'opacity: 0.6; filter: grayscale(50%);' : '';
                
                finalHtml += `<div class="pos-item" style="${itemOpacity}" onclick="window.addToCart('${p.id}')"><div class="pos-item-img-container">${stockBadge}${conditionBadge}<img src="${p.image||'https://placehold.co/200?text=No+Img'}" alt="Product" onerror="this.src='https://placehold.co/200?text=No+Img'">${btnHtml}</div><div class="pos-item-details"><div class="pos-item-price">${mainPriceStr} ${rielHtml}</div><div class="pos-item-name" title="${String(p.name || '').replace(/"/g, '&quot;')}">${p.name}</div>${expiryBadge}</div></div>`; 
            });
            container.innerHTML = finalHtml + `</div>`;
        } else {
            let tableHTML = `<div class="table-responsive" style="height: 100%;"><table id="mainPOSTable" style="font-size: var(--fs-13); width: 100%;"><thead><tr class="header-row"><th style="width: 60px; text-align:center;">រូបភាព</th><th onclick="if(window.sortTable) window.sortTable('mainPOSTable', 1)">ឈ្មោះទំនិញ <span>⬍</span></th><th style="width: 120px; text-align:right;" onclick="if(window.sortTable) window.sortTable('mainPOSTable', 2, 'number')">តម្លៃលក់ <span>⬍</span></th><th style="width: 90px; text-align:center;">សកម្មភាព</th></tr><tr class="filter-row"><th></th><th><input type="text" class="col-filter" onkeyup="if(window.filterTable) window.filterTable('mainPOSTable')" placeholder="ស្វែងរកឈ្មោះ..."></th><th><input type="text" class="col-filter" onkeyup="if(window.filterTable) window.filterTable('mainPOSTable')" placeholder="ស្វែងរកតម្លៃ..."></th><th></th></tr></thead><tbody>`;
            
            availableItems.forEach(p => {
                if(!p) return;
                let pQty = parseFloat(p.qty) || 0;
                let stockText = pQty <= 0 ? `<span style="color:var(--danger); font-weight:bold;">អស់ស្តុក</span>` : `<span style="color:${pQty<=5?'var(--warning)':'var(--success)'}">${pQty}</span> ${p.unit||''}`;
                
                let pUsdVal = parseFloat(p.price) || 0;
                let pRielVal = parseFloat(p.riel) || 0;
                let mainPriceStr = pUsdVal > 0 ? window.fMoney(pUsdVal) : (pRielVal > 0 ? `${pRielVal.toLocaleString()} ៛` : '$0.00');
                let rielHtml = (pUsdVal > 0 && pRielVal > 0) ? `<br><span style="font-size:var(--fs-11); color:var(--text-muted);">${pRielVal.toLocaleString()} ៛</span>` : '';
                let itemOpacity = pQty <= 0 ? 'opacity: 0.6;' : '';
                let condStr = p.condition ? String(p.condition).trim() : '';
                let conditionBadge = (window.sysSettings && window.sysSettings.condition && condStr && condStr !== '-') ? `<span style="font-size:10px; background:#38bdf8; color:#fff; padding:2px 4px; border-radius:4px; margin-left:4px;">${condStr}</span>` : '';
                
                let expiryDisplay = '';
                if (window.sysSettings && window.sysSettings.expiry && p.expiry) {
                    const expDateObj = new Date(p.expiry);
                    if (!isNaN(expDateObj.getTime())) {
                        expiryDisplay = `<br><span style="color:var(--warning); font-size:10px;">📅 ផុតកំណត់: ${expDateObj.toLocaleDateString('km-KH')}</span>`;
                    }
                }

                tableHTML += `<tr data-id="${p.id}" style="${itemOpacity}"><td style="text-align:center; padding: 5px;"><img src="${p.image||'https://placehold.co/100?text=Img'}" style="width:45px; height:45px; object-fit:cover; border-radius:6px; border:1px solid var(--border);" onerror="this.src='https://placehold.co/100?text=Img'"></td><td data-sort="${String(p.name).replace(/"/g, '&quot;')}" style="padding: 5px 10px;"><div style="font-weight:bold; color:var(--text-main); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name} ${conditionBadge}</div><div style="font-size:var(--fs-11); color:var(--text-muted);">ស្តុក: ${stockText} ${expiryDisplay}</div></td><td data-sort="${pUsdVal || (pRielVal / (window.cartRate || 4000))}" style="text-align:right; font-weight:bold; color:var(--success); padding: 5px 10px;">${mainPriceStr}${rielHtml}</td><td style="text-align:center; padding: 5px;"><button class="btn btn-primary" style="padding: 6px 12px; font-size:var(--fs-12);" onclick="window.addToCart('${p.id}')">➕ បន្ថែម</button></td></tr>`;
            });
            container.innerHTML = tableHTML + `</tbody></table></div>`;
        }
    } catch(err) { 
        container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--danger);">Error POS: ${err.message}</div>`; 
    }
};

window.addToCart = function(id) { 
    if (typeof window.playBeep === 'function') window.playBeep(); 
    const p = (window.inventory || []).find(i => i && i.id === id); 
    if (!p) return; 
    if (!window.cart) window.cart = [];
    const cItem = window.cart.find(c => c && c.id === id); 
    let stockQty = parseInt(p.qty) || 0;

    const executeAddToCart = () => {
        let globalRateEl = document.getElementById('globalExchangeRate'); 
        let currentRate = parseFloat(globalRateEl ? globalRateEl.value : window.cartRate) || 4000;
        let effectiveUsdPrice = parseFloat(p.price) > 0 ? parseFloat(p.price) : ((parseFloat(p.riel) || 0) / currentRate);

        if (cItem) { 
            if (cItem.cartQty < stockQty || (window.sysSettings && window.sysSettings.preorder)) { 
                cItem.cartQty++; 
                cItem.qty = cItem.cartQty;
                if (effectiveUsdPrice > 0 && !(parseFloat(cItem.price) > 0)) cItem.price = effectiveUsdPrice;
            } else { 
                notifyPosUser(`ស្តុកមានត្រឹមតែ ${stockQty} ${p.unit||'ឯកតា'} ប៉ុណ្ណោះ!`); 
            } 
        } else { 
            window.cart.push({
                ...p,
                price: effectiveUsdPrice,
                cartQty: 1,
                qty: 1
            }); 
        } 
        window.renderCart(); 
        window.renderPOSProducts();
    };
    
    if (stockQty <= 0 && window.sysSettings && window.sysSettings.preorder) {
        if (cItem) {
            executeAddToCart();
        } else if (typeof window.ksMsg === 'function') {
            window.ksMsg(`ទំនិញ "${p.name}" អស់ពីស្តុកហើយ! តើអ្នកចង់កត់ត្រាវាជាការកុម្ម៉ង់ទុកមុន (Pre-order) មែនទេ?`, 'បញ្ជាក់ Pre-order', true, executeAddToCart);
        } else {
            executeAddToCart();
        }
        return;
    } else if (stockQty <= 0) {
        return notifyPosUser('ទំនិញនេះអស់ពីស្តុកហើយ!');
    }

    executeAddToCart();
};

window.updateCartQty = function(id, change) { 
    if(change > 0 && typeof window.playBeep === 'function') window.playBeep(); 
    const cItem = (window.cart || []).find(c => c && c.id === id); 
    const p = (window.inventory || []).find(i => i && i.id === id); 
    if (!p || !cItem) return;
    let stockQty = parseInt(p.qty) || 0; 
    cItem.cartQty += change; 
    
    if(cItem.cartQty > stockQty && !(window.sysSettings && window.sysSettings.preorder)) { 
        cItem.cartQty = stockQty; 
        notifyPosUser(`ស្តុកមានត្រឹមតែ ${stockQty} ${p.unit||'ឯកតា'} ប៉ុណ្ណោះ!`); 
    } 
    
    cItem.qty = cItem.cartQty;

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
            notifyPosUser(`ស្តុកមានត្រឹមតែ ${stockQty} ${p.unit||'ឯកតា'} ប៉ុណ្ណោះ!`); 
        } else {
            cItem.cartQty = newQty;
        }
        cItem.qty = cItem.cartQty;
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
        cHTML.innerHTML = `<div style="text-align: center; color: var(--text-muted); margin-top: 30px; font-size: var(--fs-14);">កន្ត្រកទទេ</div>`; 
    } else {
        let finalCartHtml = '';
        window.cart.forEach(c => {
            if(!c) return; 
            tQty += c.cartQty; 
            let origProd = (window.inventory || []).find(i => i && i.id === c.id);
            let origUsd = origProd ? (parseFloat(origProd.price) || 0) : (parseFloat(c.price) || 0);
            let pRiel = parseFloat(c.riel) || 0;
            let pUsd = origUsd > 0 ? origUsd : (pRiel > 0 ? (pRiel / window.cartRate) : (parseFloat(c.price) || 0));
            c.price = pUsd;
            c.qty = c.cartQty;

            if (origUsd > 0) tUsdOnly += origUsd * c.cartQty; 
            else if (pRiel > 0) tRielOnly += pRiel * c.cartQty;
            else tUsdOnly += pUsd * c.cartQty;

            let priceDisplay = origUsd > 0 ? window.fMoney(origUsd) : (pRiel > 0 ? pRiel.toLocaleString()+' ៛' : window.fMoney(pUsd)); 
            let totalDisplay = origUsd > 0 ? window.fMoney(origUsd * c.cartQty) : (pRiel > 0 ? (pRiel * c.cartQty).toLocaleString()+' ៛' : window.fMoney(pUsd * c.cartQty));
            finalCartHtml += `<div class="cart-item"><img src="${c.image||'https://placehold.co/100?text=Img'}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; margin-right: 10px; border: 1px solid var(--border);" onerror="this.src='https://placehold.co/100?text=Img'"><div style="flex:1; min-width:0;"><div style="font-weight:bold; font-size:var(--fs-13); margin-bottom:2px; line-height: 1.2; color: var(--text-main); word-break:break-word;">${c.name}</div><div style="color:var(--success); font-size:var(--fs-12);">${priceDisplay} <small style="color:var(--text-muted);">/ ${c.unit||'ឯកតា'}</small></div></div><div style="display:flex; align-items:center; gap:4px; background:var(--bg-dark); padding:2px; border-radius:6px; border:1px solid var(--border); flex-shrink:0;"><button class="qty-btn" onclick="window.updateCartQty('${c.id}', -1)" style="width:20px; height:20px; font-size:var(--fs-14);"> - </button><input type="number" class="cart-qty-input" value="${c.cartQty}" onchange="window.setCartQtyManually('${c.id}', this.value)" style="width: 32px; height:22px; text-align: center; background: transparent; border: none; font-weight: bold; color: var(--text-main); outline:none; font-size: var(--fs-13);"><button class="qty-btn" onclick="window.updateCartQty('${c.id}', 1)" style="width:20px; height:20px; font-size:var(--fs-14);"> + </button></div><div style="min-width:60px; text-align:right; font-weight:bold; font-size:var(--fs-13); margin-left: 8px; color: var(--text-main); flex-shrink:0;">${totalDisplay}</div></div>`;
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
    if (cartDiscEl) {
        if (discountType === '%' && discountValue > 0) {
            cartDiscEl.innerText = `-${window.fMoney(discountAmountUsd)} (${discountValue}%)`;
        } else {
            cartDiscEl.innerText = '-' + window.fMoney(discountAmountUsd);
        }
    } 
    
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
    const actionText = isCollapsed ? 'បើកផ្ទាំងគិតលុយ' : 'បង្រួម/ពង្រីក ផ្ទាំងគិតលុយ';
    const mobileInfo = document.getElementById('mobileCartTotalInfo');
    if(mobileInfo) mobileInfo.innerText = `${arrow} ${actionText} - ${tQty} មុខ (${window.fMoney(window.cartFinalUsd)}) ${arrow}`;
};

window.clearCart = function() { 
    if(!window.cart || window.cart.length === 0) return; 
    if (typeof window.ksMsg === 'function') {
        window.ksMsg('តើអ្នកពិតជាចង់លុបទំនិញទាំងអស់ចេញពីកន្ត្រកមែនទេ?', 'បញ្ជាក់ការលុប', true, () => { 
            window.cart = []; 
            window.renderCart(); 
            window.renderPOSProducts(); 
        }); 
    } else {
        window.cart = []; 
        window.renderCart(); 
        window.renderPOSProducts(); 
    }
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
            btn.innerHTML = `<span id="mobileCartTotalInfo">▲ បើកផ្ទាំងគិតលុយ - ${tQty} មុខ (${window.fMoney(window.cartFinalUsd)}) ▲</span>`; 
        }
    }
};

window.openCheckoutModal = function() { 
    if(!window.cart || window.cart.length === 0) return notifyPosUser('គ្មានទំនិញក្នុងកន្ត្រកទេ!'); 
    let displayHtml = `${window.fMoney(window.cartFinalUsd)}`; 
    if(window.cartFinalRiel > 0) displayHtml += ` <br><span style="font-size: 18px; color: var(--text-muted);">${Math.round(window.cartFinalRiel).toLocaleString()} ៛</span>`; 
    
    document.getElementById('checkoutTotalDisplay').innerHTML = displayHtml; 

    const qrContainer = document.getElementById('checkoutQrContainer');
    const qrImage = document.getElementById('checkoutQrImage');
    if (window.shopQR && qrContainer && qrImage) {
        qrImage.src = window.shopQR;
        qrContainer.style.display = 'block';
    } else if (qrContainer) {
        qrContainer.style.display = 'none';
    }
    
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
    if(!window.cart || window.cart.length === 0) return notifyPosUser('គ្មានទំនិញក្នុងកន្ត្រកទេ!'); 
    
    const custNameInput = document.getElementById('posCustomerName').value.trim();
    if(!custNameInput) return notifyPosUser('សុំបញ្ចូលឈ្មោះអតិថិជនសិន មុននឹងចុចកក់ប្រាក់!');

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

// ==========================================
// 🖨️ SMART MULTI-STATION & CATEGORY PRINT ENGINE
// ==========================================
window.getReceiptSizeConfig = function(overrideSize) {
    const sys = window.sysSettings || {};
    const size = String(overrideSize || sys.receiptSize || '80mm').toLowerCase();

    if (size.startsWith('preset_')) {
        const idx = parseInt(size.replace('preset_', ''));
        const preset = (sys.customPrinterPresets || [])[idx];
        if (preset) {
            const pW = parseFloat(preset.paperWidthMm) || 80;
            const pH = preset.paperHeightMm || 'auto';
            const cW = parseFloat(preset.contentWidthMm) || (pW - 6);
            return {
                size: size,
                pageCssWidth: pH !== 'auto' ? `${pW}mm ${pH}mm` : `${pW}mm auto`,
                bodyCssWidth: `${cW}mm`,
                paddingMm: parseFloat(preset.paddingMm) || 0,
                previewMaxWidth: `${preset.downloadWidthPx || 380}px`,
                fontSize: `${preset.fontSizePx || 12}px`,
                logoSize: preset.showLogo === false ? '0px' : `${preset.logoSizePx || 75}px`,
                qrSize: preset.showQr === false ? '0px' : `${preset.qrSizePx || 160}px`,
                downloadScale: parseInt(preset.downloadScale) || 2,
                boldText: !!preset.boldText
            };
        }
    }

    if (size === 'custom') {
        const pW = parseFloat(sys.customPaperWidthMm) || 80;
        const pH = sys.customPaperHeightMm || 'auto';
        const cW = parseFloat(sys.customContentWidthMm) || (pW - 6);
        return {
            size: 'custom',
            pageCssWidth: pH !== 'auto' ? `${pW}mm ${pH}mm` : `${pW}mm auto`,
            bodyCssWidth: `${cW}mm`,
            paddingMm: parseFloat(sys.customPaddingMm) || 0,
            previewMaxWidth: `${sys.customDownloadWidthPx || 380}px`,
            fontSize: `${sys.customFontSizePx || 12}px`,
            logoSize: sys.showReceiptLogo === false ? '0px' : `${sys.customLogoSizePx !== undefined ? sys.customLogoSizePx : 75}px`,
            qrSize: sys.showReceiptQr === false ? '0px' : `${sys.customQrSizePx !== undefined ? sys.customQrSizePx : 160}px`,
            downloadScale: parseInt(sys.customDownloadScale) || 2,
            boldText: !!sys.boldReceiptText
        };
    }

    if (size === '58mm' || size === '57x40mm') {
        return {
            size: '58mm',
            pageCssWidth: '58mm auto',
            bodyCssWidth: '50mm',
            paddingMm: parseFloat(sys.customPaddingMm) || 1.5,
            previewMaxWidth: '270px',
            fontSize: '11px',
            logoSize: sys.showReceiptLogo === false ? '0px' : '55px',
            qrSize: sys.showReceiptQr === false ? '0px' : '125px',
            downloadScale: parseInt(sys.customDownloadScale) || 2,
            boldText: !!sys.boldReceiptText
        };
    }

    if (size === 'a4') {
        return {
            size: 'a4',
            pageCssWidth: 'A4 portrait',
            bodyCssWidth: '190mm',
            paddingMm: parseFloat(sys.customPaddingMm) || 5,
            previewMaxWidth: '780px',
            fontSize: '14px',
            logoSize: sys.showReceiptLogo === false ? '0px' : '100px',
            qrSize: sys.showReceiptQr === false ? '0px' : '180px',
            downloadScale: parseInt(sys.customDownloadScale) || 2,
            boldText: !!sys.boldReceiptText
        };
    }

    return {
        size: '80mm',
        pageCssWidth: '80mm auto',
        bodyCssWidth: '72mm',
        paddingMm: parseFloat(sys.customPaddingMm) || 2,
        previewMaxWidth: '380px',
        fontSize: '12px',
        logoSize: sys.showReceiptLogo === false ? '0px' : '75px',
        qrSize: sys.showReceiptQr === false ? '0px' : '160px',
        downloadScale: parseInt(sys.customDownloadScale) || 2,
        boldText: !!sys.boldReceiptText
    };
};

// មុខងារបង្កើតតារាងទំនិញស្មើគ្នា និងបែងចែកតាមផ្នែក (Equal Column & Category Grouping Builder)
window.buildReceiptItemsTableHTML = function(items, rate, cfg) {
    const sys = window.sysSettings || {};
    const groupByCat = !!sys.printGroupByCategory;
    const fs = cfg ? cfg.fontSize : '12px';

    let html = `<table style="width:100%; border-collapse:collapse; font-size:${fs}; table-layout:fixed; box-sizing:border-box;">
        <thead>
            <tr style="border-bottom:1.5px solid #000;">
                <th style="width:52%; text-align:left; padding:4px 0;">ទំនិញ</th>
                <th style="width:18%; text-align:center; padding:4px 0;">ចំនួន</th>
                <th style="width:30%; text-align:right; padding:4px 0;">សរុប</th>
            </tr>
        </thead>
        <tbody>`;

    const renderRow = (item, idx) => {
        let p = parseFloat(item.price) > 0 ? parseFloat(item.price) : ((parseFloat(item.riel) || 0) / (rate || 4000));
        let q = parseInt(item.cartQty !== undefined ? item.cartQty : (item.qty || 1));
        let lineTotal = p * q;
        return `
            <tr style="border-bottom:1px dotted #999;">
                <td style="padding:4px 2px 4px 0; text-align:left; word-wrap:break-word; vertical-align:top;">
                    <div style="font-weight:bold;">${idx}. ${item.name || item.title}</div>
                    <div style="font-size:0.9em; color:#333;">$${p.toFixed(2)} ${item.unit ? '/ ' + item.unit : ''}</div>
                </td>
                <td style="padding:4px 0; text-align:center; font-weight:bold; vertical-align:top;">${q}</td>
                <td style="padding:4px 0; text-align:right; font-weight:bold; vertical-align:top;">$${lineTotal.toFixed(2)}</td>
            </tr>`;
    };

    if (groupByCat) {
        const categories = [...new Set((items || []).map(it => (it && it.category && String(it.category).trim()) ? String(it.category).trim() : 'ទូទៅ'))];
        let globalIdx = 1;
        categories.forEach(cat => {
            html += `<tr><td colspan="3" style="padding:6px 4px 3px 4px; font-weight:900; background:#f1f5f9; border-top:1px dashed #000; border-bottom:1px dashed #000; text-align:left;">🏷️ ផ្នែក៖ ${cat}</td></tr>`;
            (items || []).filter(it => ((it && it.category && String(it.category).trim()) ? String(it.category).trim() : 'ទូទៅ') === cat).forEach(it => {
                html += renderRow(it, globalIdx++);
            });
        });
    } else {
        (items || []).forEach((it, i) => {
            if (!it) return;
            html += renderRow(it, i + 1);
        });
    }

    html += `</tbody></table>`;
    return html;
};

// មុខងារបង្កើតសន្លឹកបំបែកតាមផ្នែក ឬតាមកន្លែងព្រីន (Split Category / Print Station Tickets)
window.buildStationTicketsHTML = function(invoiceObj, cfg) {
    const sys = window.sysSettings || {};
    const splitByCat = !!sys.printSplitByCategory;
    const activeStations = Array.isArray(sys.printStations) ? sys.printStations.filter(s => s && s.enabled !== false) : [];
    const items = invoiceObj.items || [];
    if (items.length === 0 || (!splitByCat && activeStations.length === 0)) return '';

    let ticketsHtml = '';
    const renderStationSlip = (stationTitle, stationItems, copies = 1) => {
        if (!stationItems || stationItems.length === 0) return '';
        let slip = '';
        for (let c = 0; c < copies; c++) {
            slip += `
                <div style="page-break-before: always; break-before: page; padding-top: 8px; margin-top: 12px; border-top: 2px dashed #000;">
                    <div style="text-align:center; border-bottom:1.5px solid #000; padding-bottom:6px; margin-bottom:6px;">
                        <div style="font-size:1.15em; font-weight:900;">🖨️ ${stationTitle}</div>
                        <div style="font-size:0.95em; font-weight:bold; margin-top:2px;">អតិថិជន/តុ៖ ${invoiceObj.customerName || invoiceObj.customer || 'ទូទៅ'}</div>
                        <div style="font-size:0.85em;">លេខ៖ ${invoiceObj.id || invoiceObj.invoiceNo} | ម៉ោង៖ ${new Date().toLocaleTimeString('km-KH')}</div>
                        ${invoiceObj.note ? `<div style="font-size:0.9em; font-weight:bold; margin-top:2px;">📝 ${invoiceObj.note}</div>` : ''}
                    </div>
                    <table style="width:100%; border-collapse:collapse; table-layout:fixed;">
                        <thead>
                            <tr style="border-bottom:1px solid #000;">
                                <th style="width:72%; text-align:left; padding:4px 0;">មុខទំនិញ</th>
                                <th style="width:28%; text-align:right; padding:4px 0;">ចំនួន</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stationItems.map((it, idx) => {
                                const q = parseInt(it.cartQty !== undefined ? it.cartQty : (it.qty || 1));
                                return `<tr style="border-bottom:1px dotted #888;">
                                    <td style="padding:5px 0; font-weight:bold; text-align:left;">${idx + 1}.${it.name || it.title}</td>
                                    <td style="padding:5px 0; font-weight:900; text-align:right; font-size:1.1em;">x${q}${it.unit || ''}</td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>`;
        }
        return slip;
    };

    if (activeStations.length > 0) {
        activeStations.forEach(st => {
            const matchedItems = (st.categories && st.categories.length > 0)
                ? items.filter(it => st.categories.some(cat => String(cat).trim().toLowerCase() === String(it.category || '').trim().toLowerCase()))
                : items;
            ticketsHtml += renderStationSlip(st.name, matchedItems, parseInt(st.copies) || 1);
        });
    } else if (splitByCat) {
        const categories = [...new Set(items.map(it => (it && it.category && String(it.category).trim()) ? String(it.category).trim() : 'ទូទៅ'))];
        categories.forEach(cat => {
            const catItems = items.filter(it => ((it && it.category && String(it.category).trim()) ? String(it.category).trim() : 'ទូទៅ') === cat);
            ticketsHtml += renderStationSlip(`ផ្នែក៖ ${cat}`, catItems, 1);
        });
    }

    return ticketsHtml;
};

window.executePrint = function(htmlContent) {
    const cfg = window.getReceiptSizeConfig();
    const printWindow = window.open('', '', 'width=450,height=650');
    if(!printWindow) {
        const area = document.getElementById('printReceiptArea');
        if (area) {
            area.style.maxWidth = cfg.bodyCssWidth;
            area.style.fontSize = cfg.fontSize;
            area.innerHTML = htmlContent;
            window.print();
        }
        return;
    }
    printWindow.document.write('<html><head><title>Print Receipt</title>');
    printWindow.document.write(`<style>
        @page { size: ${cfg.pageCssWidth}; margin: 0; }
        * { box-sizing: border-box; }
        body {
            width: ${cfg.bodyCssWidth};
            margin: 0 auto;
            padding: ${cfg.paddingMm}mm;
            font-family: 'Kantumruy Pro', 'Battambang', sans-serif;
            font-size: ${cfg.fontSize};
            font-weight: ${cfg.boldText ? '700' : '400'};
            color: #000;
            background: #fff;
        }
        table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        th, td { vertical-align: top; word-wrap: break-word; }
        .print-dashed-line { border-bottom: 1px dashed #000; margin: 6px 0; }
    </style>`);
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

window.checkout = function(status, rUsd = 0, rRiel = 0, cUsd = 0, cRiel = 0) {
    if(!window.cart || window.cart.length === 0) return notifyPosUser('គ្មានទំនិញក្នុងកន្ត្រកទេ!');
    const custNameInput = document.getElementById('posCustomerName').value.trim(); 
    const custPhoneInput = document.getElementById('posCustomerPhone').value.trim();
    const tableSelectEl = document.getElementById('posTableSelect');
    const selectedTable = (tableSelectEl && tableSelectEl.value) ? tableSelectEl.value.trim() : '';

    if((status === 'unpaid' || status === 'preorder') && !custNameInput) return notifyPosUser('សុំបញ្ចូលឈ្មោះអតិថិជនសិន!');
    
    let discountValue = parseFloat(document.getElementById('posDiscount') ? document.getElementById('posDiscount').value : 0) || 0; 
    let discountType = document.getElementById('posDiscountType') ? document.getElementById('posDiscountType').value : '%'; 
    let appliedTaxRate = (window.sysSettings && window.sysSettings.tax) ? (parseFloat(window.sysSettings.taxRate) || 0) : 0;
    
    let docType = status === 'paid' ? 'បង្កាន់ដៃទទួលប្រាក់ / Receipt' : (status === 'preorder' ? 'បង្កាន់ដៃកក់ប្រាក់ / Pre-order Receipt' : 'វិក្កយបត្រ / Invoice'); 
    let currentSellerName = window.activeUser ? (window.activeUser.fullName ? window.activeUser.fullName : window.activeUser.username) : 'System'; 
    let newInvId = window.generateInvoiceId(); 
    let timestampNow = Date.now(); 
    const cfg = window.getReceiptSizeConfig();

    const normalizedCartItems = [];
    window.cart.forEach(c => {
        if(!c) return; 
        const idx = (window.inventory || []).findIndex(p => p && p.id === c.id);
        let origUsd = (idx !== -1 && parseFloat(window.inventory[idx].price) > 0) ? parseFloat(window.inventory[idx].price) : (parseFloat(c.price) || 0);
        let pRiel = parseFloat(c.riel) || 0;
        let effectiveUsd = origUsd > 0 ? origUsd : (pRiel > 0 ? (pRiel / window.cartRate) : 0);

        normalizedCartItems.push({
            ...c,
            price: effectiveUsd,
            cartQty: c.cartQty,
            qty: c.cartQty
        });

        if(idx !== -1) {
            if (status !== 'preorder') {
                window.inventory[idx].qty = Math.max(0, (parseFloat(window.inventory[idx].qty) || 0) - c.cartQty); 
            }
            if (typeof window.logAction === 'function') window.logAction('sale', c.name, c.cartQty, status === 'paid' ? 'លក់ចេញ (ទូទាត់រួច)' : (status === 'preorder' ? `កក់ប្រាក់ (Pre-order ដោយ ${custNameInput})` : `លក់ចេញ (រង់ចាំទូទាត់ ដោយ ${custNameInput})`), window.activeUser);
        }
    });

    let paidUsdAmount = 0;
    if (status === 'paid') paidUsdAmount = window.cartFinalUsd;
    else if (status === 'preorder') paidUsdAmount = rUsd + (rRiel / window.cartRate);

    const finalCustomerName = custNameInput || selectedTable || 'អតិថិជនទូទៅ';
    const invoiceNote = (selectedTable && selectedTable !== finalCustomerName) ? `[${selectedTable}]` : '';

    const newInvoice = { 
        id: newInvId, 
        invoiceNo: newInvId,
        timestamp: timestampNow, 
        date: window.fDate(), 
        customer: finalCustomerName, 
        customerName: finalCustomerName,
        phone: custPhoneInput, 
        customerPhone: custPhoneInput,
        note: invoiceNote,
        items: normalizedCartItems, 
        rate: window.cartRate, 
        totalAmount: window.cartFinalUsd, 
        total: window.cartFinalUsd,
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
        paidUsd: paidUsdAmount,
        paidAmount: paidUsdAmount
    }; 
    
    if(!window.invoices) window.invoices = [];
    window.invoices.unshift(newInvoice); 
    
    if(custNameInput && custNameInput !== selectedTable && typeof window.setAutoRegisterCustomer === 'function') {
        window.setAutoRegisterCustomer(custNameInput, custPhoneInput);
    }

    let receiptHTML = `<div style="text-align:center; margin-bottom: 8px;">`; 
    if(window.shopLogo && cfg.logoSize !== '0px') {
        receiptHTML += `<img src="${window.shopLogo}" style="width: ${cfg.logoSize}; height: ${cfg.logoSize}; object-fit: cover; border-radius: 50%; margin-bottom: 5px; filter: grayscale(100%);">`; 
    }
    receiptHTML += `<h2 style="margin:0; font-size:1.25em;">${window.shopName}</h2>`; 
    if(window.shopPhone) receiptHTML += `<p style="margin:2px 0; font-size:0.95em;">Tel: ${window.shopPhone}</p>`; 
    if(window.shopAddress) receiptHTML += `<p style="margin:2px 0; font-size:0.95em;">${window.shopAddress}</p>`; 
    receiptHTML += `<div class="print-dashed-line"></div><p style="margin:4px 0; font-size:1.1em; font-weight:bold;">${docType}</p><p style="margin:2px 0; font-size:0.9em; text-align:left;">កាលបរិច្ឆេទ: ${newInvoice.date}</p><p style="margin:2px 0; font-size:0.9em; text-align:left;">លេខវិក្កយបត្រ: ${newInvId}</p><p style="margin:2px 0; font-size:0.9em; text-align:left;">អ្នកលក់: ${currentSellerName}</p>`;
    if(finalCustomerName) receiptHTML += `<p style="margin:2px 0; font-size:0.9em; text-align:left;">អតិថិជន/តុ: <b>${finalCustomerName}</b> ${custPhoneInput?`(${custPhoneInput})`:''}</p>`;
    if(selectedTable && selectedTable !== finalCustomerName) receiptHTML += `<p style="margin:2px 0; font-size:0.9em; text-align:left; font-weight:bold;">តុ: ${selectedTable}</p>`;
    receiptHTML += `<div class="print-dashed-line"></div></div>`;

    // បង្កើតតារាងទំនិញស្មើគ្នា និងគាំទ្រការរៀបតាមផ្នែក (Group by Category)
    receiptHTML += window.buildReceiptItemsTableHTML(normalizedCartItems, window.cartRate, cfg);
    receiptHTML += `<div class="print-dashed-line"></div>`;

    receiptHTML += `<table style="width:100%; font-size: ${cfg.fontSize}; margin-top: 5px; table-layout: fixed;">`;
    if (discountValue > 0) receiptHTML += `<tr><td style="text-align:left;">បញ្ចុះតម្លៃ:</td><td style="text-align:right;">-${discountType === '%' ? `${discountValue}%` : window.fMoney(discountValue)}</td></tr>`;
    if (appliedTaxRate > 0) receiptHTML += `<tr><td style="text-align:left;">VAT (${appliedTaxRate}%):</td><td style="text-align:right;">បូកបញ្ចូល</td></tr>`;
    receiptHTML += `<tr><td style="font-weight:bold; font-size:1.15em; padding-top:4px; text-align:left;">សរុបប្រាក់:</td><td style="text-align:right; font-weight:bold; font-size:1.15em; padding-top:4px;">${window.fMoney(window.cartFinalUsd)}</td></tr>`;
    if(window.cartFinalRiel > 0) receiptHTML += `<tr><td></td><td style="text-align:right; font-weight:bold; font-size:1.1em;">${Math.round(window.cartFinalRiel).toLocaleString()} ៛</td></tr>`;
    
    if(status === 'paid' && (rUsd > 0 || rRiel > 0)) { 
        let rStr = []; if(rUsd > 0) rStr.push(window.fMoney(rUsd)); if(rRiel > 0) rStr.push(rRiel.toLocaleString() + '៛'); 
        receiptHTML += `<tr><td style="padding-top:6px; text-align:left;">ប្រាក់ទទួល:</td><td style="text-align:right; padding-top:6px;">${rStr.join(' | ')}</td></tr>`; 
        let cStr = []; if(cUsd > 0 || cRiel > 0) { cStr.push(window.fMoney(cUsd)); cStr.push(Math.round(cRiel).toLocaleString() + ' ៛'); } else cStr.push('$0.00'); 
        receiptHTML += `<tr><td style="text-align:left;">ប្រាក់អាប់:</td><td style="text-align:right;">${cStr.join(' | ')}</td></tr>`; 
    } else if (status === 'preorder') {
        let rStr = []; if(rUsd > 0) rStr.push(window.fMoney(rUsd)); if(rRiel > 0) rStr.push(rRiel.toLocaleString() + '៛');
        if (rStr.length > 0) {
            receiptHTML += `<tr><td style="padding-top:4px; text-align:left;">ប្រាក់កក់មុន:</td><td style="text-align:right; padding-top:4px;">${rStr.join(' | ')}</td></tr>`;
            let remainingUsd = Math.max(0, window.cartFinalUsd - (rUsd + (rRiel/window.cartRate)));
            receiptHTML += `<tr><td style="font-weight:bold; text-align:left;">ប្រាក់នៅខ្វះ:</td><td style="text-align:right; font-weight:bold;">${window.fMoney(remainingUsd)}</td></tr>`;
        }
    }
    receiptHTML += `</table>`;

    let footerText = (window.sysSettings && window.sysSettings.receiptFooter) ? String(window.sysSettings.receiptFooter).replace(/\n/g, '<br>') : 'សូមអរគុណ! សូមអញ្ជើញមកម្តងទៀត។';
    
    if (window.shopQR && cfg.qrSize !== '0px') {
        receiptHTML += `<div style="text-align:center; margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px;"><p style="font-size:0.95em; margin-bottom:5px; font-weight:bold;">ស្កេនទូទាត់ប្រាក់ (Scan to Pay)</p><img src="${window.shopQR}" style="width: ${cfg.qrSize}; height: ${cfg.qrSize}; object-fit: contain; filter: grayscale(100%);"></div>`;
    }
    receiptHTML += `<p style="text-align:center; font-size:0.85em; margin-top: 10px;">(Rate: 1$ = ${window.cartRate}៛)</p><p style="text-align:center; font-size:0.95em; margin-top: 5px; font-weight:bold;">${footerText}</p>`; 

    // បន្ថែមសន្លឹកបំបែកតាមផ្នែក ឬតាមកន្លែងព្រីន (បើបានបើកក្នុងលេខ ៨)
    receiptHTML += window.buildStationTicketsHTML(newInvoice, cfg);
    
    window.cart = []; 
    
    const cNameInputEl = document.getElementById('posCustomerName'); 
    if(cNameInputEl) {
        cNameInputEl.value = ''; 
        cNameInputEl.style.borderLeft = '1px solid var(--border)';
    }
    const cPhoneInputEl = document.getElementById('posCustomerPhone'); if(cPhoneInputEl) cPhoneInputEl.value = ''; 
    if(tableSelectEl) tableSelectEl.value = '';
    const posDiscEl = document.getElementById('posDiscount'); if (posDiscEl) posDiscEl.value = ''; 
    const mobileContainer = document.getElementById('mobileCartContainer'); if(mobileContainer) mobileContainer.classList.remove('open'); 
    
    localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(window.invoices));
    if (window.inventory) localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
    
    const dateFromInput = document.getElementById('invoiceDateFrom');
    const dateToInput = document.getElementById('invoiceDateTo');
    if (dateFromInput) dateFromInput.value = '';
    if (dateToInput) dateToInput.value = '';

    window.renderCart(); 
    window.renderPOSProducts(); 
    if(typeof window.renderUnpaid === 'function') window.renderUnpaid();
    if(typeof window.renderCustomers === 'function') window.renderCustomers();
    if(typeof window.renderDashboard === 'function') window.renderDashboard();
    
    window.executePrint(receiptHTML);

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
            notifyPosUser('រកមិនឃើញទំនិញដែលមានបាកូដនេះទេ!', 'មិនមានទំនិញ', true);
        }
    }
};

// ==========================================
// DRAG TO SCROLL FOR POS CATEGORY TABS
// ==========================================
let isPosTabScrollInitialized = false;

window.initPosTabScroll = function() {
    const slider = document.getElementById('posCategoryTabs');
    if (!slider || isPosTabScrollInitialized) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        if (Math.abs(walk) > 5) isDragging = true;
        slider.scrollLeft = scrollLeft - walk;
    });

    slider.addEventListener('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true); 

    slider.style.cursor = 'grab';
    isPosTabScrollInitialized = true;
};