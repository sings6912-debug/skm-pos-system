// ⚡ BAKONG DYNAMIC KHQR GENERATOR (EMVCo Standard + CRC16-CCITT)
window.generateBakongKHQR = function(bakongId, merchantName, amount, currency = 'USD') {
    const cleanId = String(bakongId || '').trim();
    if (!cleanId) return '';
    const tlv = (tag, val) => {
        const s = String(val);
        return tag + String(s.length).padStart(2, '0') + s;
    };
    const isKhr = String(currency).toUpperCase() === 'KHR';
    const currCode = isKhr ? '116' : '840';
    const numAmt = parseFloat(amount) || 0;
    const amtStr = numAmt > 0 ? (isKhr ? String(Math.round(numAmt)) : numAmt.toFixed(2)) : '';
    const safeName = String(merchantName || 'SKM SHOP').replace(/[^\x20-\x7E]/g, '').trim().slice(0, 25) || 'SKM SHOP';

    let payload = '';
    payload += tlv('00', '01');
    payload += tlv('01', amtStr ? '12' : '11');
    payload += tlv('29', tlv('00', cleanId));
    payload += tlv('52', '5999');
    payload += tlv('53', currCode);
    if (amtStr) payload += tlv('54', amtStr);
    payload += tlv('58', 'KH');
    payload += tlv('59', safeName);
    payload += tlv('60', 'Phnom Penh');
    payload += '6304';

    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
        crc ^= (payload.charCodeAt(i) << 8);
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
            crc &= 0xFFFF;
        }
    }
    return payload + crc.toString(16).toUpperCase().padStart(4, '0');
};
window.getBakongQrImageUrl = function(bakongId, merchantName, amount, currency = 'USD') {
    const khqr = window.generateBakongKHQR(bakongId, merchantName, amount, currency);
    if (!khqr) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(khqr)}`;
};

/**
 * pos.js - គ្រប់គ្រងប្រព័ន្ធលក់ កន្ត្រកទំនិញ ការស្កេនបាកូដ ការព្រីនបំបែក (Routing) និងសុវត្ថិភាពទិន្នន័យ (Enterprise Point of Sale)
 */

window.currentPOSView = 'grid';
window.currentPosCategory = 'all';
window.cartFinalUsd = 0;
window.cartFinalRiel = 0;
window.cartRate = 4000;

function getPosI18n() {
    const lang = localStorage.getItem('app_lang') || 'km';
    return (window.sysI18n && (window.sysI18n[lang] || window.sysI18n.km)) || {};
}

window.saveExchangeRate = function(val) {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) return;
    window.cartRate = num;
    if (!window.sysSettings) window.sysSettings = {};
    window.sysSettings.exchangeRate = num;
    if (typeof window.getBranchKey === 'function') {
        localStorage.setItem(window.getBranchKey('exchange_rate'), String(num));
        localStorage.setItem(window.getBranchKey('sys_settings'), JSON.stringify(window.sysSettings));
    }
    if (typeof window.renderCart === 'function') window.renderCart();
    if (typeof window.saveData === 'function') window.saveData(window.userAccounts);
};

// 🛡️ សុវត្ថិភាព XSS: ការពារការបន្លំកូដអាក្រក់តាមរយៈឈ្មោះទំនិញ ឬឈ្មោះអតិថិជន
window.escapeHTML = function(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag]));
};

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
    const cats = [...new Set(activeItems.filter(p => p.category).map(p => p.category))];
    
    const filter = document.getElementById('filterCategory'); 
    if(filter) filter.innerHTML = '<option value="all">គ្រប់ប្រភេទ</option>' + cats.map(c => `<option value="${window.escapeHTML(c)}">${window.escapeHTML(c)}</option>`).join('');
    
    const catList = document.getElementById('catList');
    if(catList) catList.innerHTML = cats.map(c => `<option value="${window.escapeHTML(c)}">${window.escapeHTML(c)}</option>`).join('');
    
    const units = [...new Set(activeItems.filter(p => p.unit).map(p => p.unit))];
    const unitList = document.getElementById('unitList');
    if(unitList) unitList.innerHTML = units.map(u => `<option value="${window.escapeHTML(u)}">${window.escapeHTML(u)}</option>`).join('');
    
    const posTabs = document.getElementById('posCategoryTabs');
    if(posTabs) { 
        let activeCat = window.currentPosCategory ? window.currentPosCategory : 'all'; 
        const lang = localStorage.getItem('app_lang') || 'km';
        const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
        const allLabel = d.allCategoryTab || 'ទាំងអស់ (All)';
        
        let allCount = activeItems.length;
        let tabsHtml = `<button class="pos-tab ${activeCat === 'all' ? 'active' : ''}" onclick="window.setPosCategory('all')">${allLabel} (${allCount})</button>`; 
        
        cats.forEach(c => { 
            let catCount = activeItems.filter(p => p.category === c).length;
            tabsHtml += `<button class="pos-tab ${activeCat === c ? 'active' : ''}" onclick="window.setPosCategory('${window.escapeHTML(c)}')">${window.escapeHTML(c)} (${catCount})</button>`; 
        }); 
        posTabs.innerHTML = tabsHtml; 
        
        if(typeof window.initPosTabScroll === 'function') window.initPosTabScroll();
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
    const d = getPosI18n();
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
            container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px; background: rgba(0,0,0,0.05); border-radius: 8px;">${d.noPosItems || 'មិនមានទំនិញទេ'}</div>`; 
            return; 
        }
        
        if (window.currentPOSView === 'grid') {
            let finalHtml = `<div class="pos-products">`;
            availableItems.forEach(p => { 
                if(!p) return;
                let pQty = parseFloat(p.qty) || 0; 
                let stockBadge = '';
                if (pQty <= 0) stockBadge = `<div class="badge-cat" style="background: var(--danger); color: #fff; top: 8px; right: auto; left: 8px; padding: 3px 6px; font-size: 11px; border-radius: 4px;">${d.lblOutStock || '❌ អស់ស្តុក'}</div>`;
                else stockBadge = `<div class="badge-cat" style="background: ${pQty<=5?'var(--warning)':'var(--primary)'}; color: ${pQty<=5?'#000':'#fff'}; top: 8px; right: auto; left: 8px; padding: 3px 6px; font-size: 11px; border-radius: 4px;">${d.lblStockLeft || '📦 សល់:'} ${pQty}</div>`;

                let safeCondition = window.escapeHTML(p.condition);
                let conditionBadge = (window.sysSettings && window.sysSettings.condition && p.condition) ? `<div class="badge-cat" style="background: #38bdf8; color: #fff; top: 8px; right: 8px; padding: 3px 6px; font-size: 10px; border-radius: 4px;">${safeCondition}</div>` : '';
                let expiryBadge = (window.sysSettings && window.sysSettings.expiry && p.expiry) ? `<div style="font-size:10px; color:var(--warning); margin-top:2px;">📅 ផុតកំណត់: ${new Date(p.expiry).toLocaleDateString('km-KH')}</div>` : '';

                let cItem = (window.cart || []).find(c => c && c.id === p.id); 
                let qtyInCart = cItem ? cItem.cartQty : 0;
                let btnHtml = qtyInCart > 0 ? `<div class="pos-add-btn added">${qtyInCart}</div>` : `<div class="pos-add-btn empty">+</div>`;
                let rielHtml = (parseFloat(p.riel)||0) > 0 ? `<span style="font-size:var(--fs-11); color:var(--text-muted); font-weight:normal;">| ${parseFloat(p.riel).toLocaleString()} ៛</span>` : '';
                let itemOpacity = pQty <= 0 ? 'opacity: 0.6; filter: grayscale(50%);' : '';
                
                let safeName = window.escapeHTML(p.name);
                finalHtml += `<div class="pos-item" style="${itemOpacity}" onclick="window.addToCart('${p.id}')"><div class="pos-item-img-container">${stockBadge}${conditionBadge}<img src="${p.image||window.SKM_IMG_FALLBACK||'https://placehold.co/200?text=No+Img'}" alt="Product" loading="lazy" onerror="this.onerror=null;this.src=window.SKM_IMG_FALLBACK||'https://placehold.co/200?text=No+Img';">${btnHtml}</div><div class="pos-item-details"><div class="pos-item-price">${window.fMoney(p.price)} ${rielHtml}</div><div class="pos-item-name" title="${safeName}">${safeName}</div>${expiryBadge}</div></div>`; 
            });
            container.innerHTML = finalHtml + `</div>`;
        } else {
            let tableHTML = `<div class="table-responsive" style="height: 100%;"><table id="mainPOSTable" style="font-size: var(--fs-13); width: 100%;"><thead><tr class="header-row"><th style="width: 60px; text-align:center;">${d.thImg || 'រូបភាព'}</th><th onclick="if(window.sortTable) window.sortTable('mainPOSTable', 1)">${d.thProdName || 'ឈ្មោះទំនិញ'} <span>⬍</span></th><th style="width: 120px; text-align:right;" onclick="if(window.sortTable) window.sortTable('mainPOSTable', 2, 'number')">${d.thPrice || 'តម្លៃលក់'} <span>⬍</span></th><th style="width: 90px; text-align:center;">${d.thAction || 'សកម្មភាព'}</th></tr><tr class="filter-row"><th></th><th><input type="text" class="col-filter" onkeyup="if(window.filterTable) window.filterTable('mainPOSTable')" placeholder="ស្វែងរកឈ្មោះ..."></th><th><input type="text" class="col-filter" onkeyup="if(window.filterTable) window.filterTable('mainPOSTable')" placeholder="ស្វែងរកតម្លៃ..."></th><th></th></tr></thead><tbody>`;
            
            availableItems.forEach(p => {
                if(!p) return;
                let pQty = parseFloat(p.qty) || 0;
                let stockText = pQty <= 0 ? `<span style="color:var(--danger); font-weight:bold;">អស់ស្តុក</span>` : `<span style="color:${pQty<=5?'var(--warning)':'var(--success)'}">${pQty}</span> ${window.escapeHTML(p.unit)||''}`;
                let rielHtml = (parseFloat(p.riel)||0) > 0 ? `<br><span style="font-size:var(--fs-11); color:var(--text-muted);">${parseFloat(p.riel).toLocaleString()} ៛</span>` : '';
                let itemOpacity = pQty <= 0 ? 'opacity: 0.6;' : '';
                let safeCondition = window.escapeHTML(p.condition);
                let conditionBadge = (window.sysSettings && window.sysSettings.condition && p.condition) ? `<span style="font-size:10px; background:#38bdf8; color:#fff; padding:2px 4px; border-radius:4px; margin-left:4px;">${safeCondition}</span>` : '';
                let expiryDisplay = (window.sysSettings && window.sysSettings.expiry && p.expiry) ? `<br><span style="color:var(--warning); font-size:10px;">📅 ផុតកំណត់: ${new Date(p.expiry).toLocaleDateString('km-KH')}</span>` : '';
                let safeName = window.escapeHTML(p.name);

                tableHTML += `<tr data-id="${p.id}" style="${itemOpacity}"><td style="text-align:center; padding: 5px;"><img src="${p.image||window.SKM_IMG_FALLBACK||'https://placehold.co/100?text=Img'}" loading="lazy" onerror="this.onerror=null;this.src=window.SKM_IMG_FALLBACK||'https://placehold.co/100?text=Img';" style="width:45px; height:45px; object-fit:cover; border-radius:6px; border:1px solid var(--border);"></td><td data-sort="${String(p.name).replace(/"/g, '&quot;')}" style="padding: 5px 10px;"><div style="font-weight:bold; color:var(--text-main); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${safeName} ${conditionBadge}</div><div style="font-size:var(--fs-11); color:var(--text-muted);">ស្តុក: ${stockText} ${expiryDisplay}</div></td><td data-sort="${p.price}" style="text-align:right; font-weight:bold; color:var(--success); padding: 5px 10px;">${window.fMoney(p.price)}${rielHtml}</td><td style="text-align:center; padding: 5px;"><button class="btn btn-primary" style="padding: 6px 12px; font-size:var(--fs-12);" onclick="window.addToCart('${p.id}')">${d.btnAddShort || '➕ បន្ថែម'}</button></td></tr>`;
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
                notifyPosUser(`ស្តុកមានត្រឹមតែ ${stockQty} ${window.escapeHTML(p.unit)||'ឯកតា'} ប៉ុណ្ណោះ!`); 
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
            window.ksMsg(`ទំនិញ "${window.escapeHTML(p.name)}" អស់ពីស្តុកហើយ! តើអ្នកចង់កត់ត្រាវាជាការកុម្ម៉ង់ទុកមុន (Pre-order) មែនទេ?`, 'បញ្ជាក់ Pre-order', true, executeAddToCart);
        } else {
            executeAddToCart();
        }
        return;
    } else if (stockQty <= 0) {
        return notifyPosUser('ទំនិញនេះអស់ពីស្តុកហើយ!');
    }

    executeAddToCart();
};

window.getCartItemUnitPricing = function(c) {
    const rate = window.cartRate || 4000;
    const origProd = c.isCombo ? null : (window.inventory || []).find(i => i && i.id === c.id);
    const origUsd = origProd ? (parseFloat(origProd.price) || 0) : (parseFloat(c.price) || 0);
    const pRiel = parseFloat(c.riel) || 0;
    const baseUsd = origUsd > 0 ? origUsd : (pRiel > 0 ? (pRiel / rate) : (parseFloat(c.price) || 0));
    const modExtra = parseFloat(c.modifierExtra) || 0;
    const beforeDiscUsd = baseUsd + modExtra;
    const discVal = parseFloat(c.itemDiscVal) || 0;
    let discUsd = 0;
    if (discVal > 0) {
        discUsd = (c.itemDiscType === '$')
            ? Math.min(beforeDiscUsd, discVal)
            : beforeDiscUsd * (Math.min(100, Math.max(0, discVal)) / 100);
    }
    const finalUnitUsd = Math.max(0, beforeDiscUsd - discUsd);
    return { origUsd, pRiel, baseUsd, modExtra, beforeDiscUsd, discUsd, finalUnitUsd };
};

function getComboMaxAvailableSets(cItem) {
    if (!cItem || !Array.isArray(cItem.comboItems) || cItem.comboItems.length === 0) return 9999;
    let minSets = 9999;
    cItem.comboItems.forEach(comp => {
        const p = (window.inventory || []).find(i => i && String(i.id) === String(comp.id));
        const avail = p ? (parseInt(p.qty) || 0) : 0;
        const perSet = Math.max(1, parseInt(comp.qty) || 1);
        minSets = Math.min(minSets, Math.floor(avail / perSet));
    });
    return Math.max(0, minSets);
}

window.updateCartQty = function(id, change) { 
    if(change > 0 && typeof window.playBeep === 'function') window.playBeep(); 
    const cItem = (window.cart || []).find(c => c && c.id === id); 
    if (!cItem) return;
    const p = cItem.isCombo ? null : (window.inventory || []).find(i => i && i.id === id); 
    if (!cItem.isCombo && !p) return;
    let stockQty = cItem.isCombo ? getComboMaxAvailableSets(cItem) : (parseInt(p.qty) || 0); 
    cItem.cartQty += change; 
    
    if(cItem.cartQty > stockQty && !(window.sysSettings && window.sysSettings.preorder)) { 
        cItem.cartQty = stockQty; 
        notifyPosUser(`ស្តុកមានត្រឹមតែ ${stockQty} ${window.escapeHTML(cItem.isCombo ? 'ឈុត' : (p.unit||'ឯកតា'))} ប៉ុណ្ណោះ!`); 
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
        if (!cItem) return;
        const p = cItem.isCombo ? null : (window.inventory || []).find(i => i && i.id === id); 
        if(!cItem.isCombo && !p) return;
        let stockQty = cItem.isCombo ? getComboMaxAvailableSets(cItem) : (parseInt(p.qty) || 0);
        
        if(newQty > stockQty && !(window.sysSettings && window.sysSettings.preorder)) { 
            cItem.cartQty = stockQty; 
            notifyPosUser(`ស្តុកមានត្រឹមតែ ${stockQty} ${window.escapeHTML(cItem.isCombo ? 'ឈុត' : (p.unit||'ឯកតា'))} ប៉ុណ្ណោះ!`); 
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
    const d = getPosI18n();
    let tQty = 0, tUsdOnly = 0, tRielOnly = 0; 
    let globalRateEl = document.getElementById('globalExchangeRate'); 
    window.cartRate = parseFloat(globalRateEl ? globalRateEl.value : 4000) || 4000;
    
    if(!window.cart || window.cart.length === 0) {
        cHTML.innerHTML = `<div style="text-align: center; color: var(--text-muted); margin-top: 50px; font-size: var(--fs-14);">${d.cartEmpty || 'កន្ត្រកទទេ'}</div>`; 
    } else {
        let finalCartHtml = '';
        const pfAdv = (window.sysSettings && window.sysSettings.proFeatures) ? window.sysSettings.proFeatures : {};
        window.cart.forEach(c => {
            if(!c) return; 
            tQty += c.cartQty; 
            const pr = window.getCartItemUnitPricing(c);
            c.price = pr.finalUnitUsd;
            c.qty = c.cartQty;

            if (pr.discUsd > 0 || pr.modExtra > 0 || c.isCombo) {
                tUsdOnly += pr.finalUnitUsd * c.cartQty;
            } else if (pr.origUsd > 0) {
                tUsdOnly += pr.origUsd * c.cartQty;
            } else if (pr.pRiel > 0) {
                tRielOnly += pr.pRiel * c.cartQty;
            } else {
                tUsdOnly += pr.finalUnitUsd * c.cartQty;
            }

            let priceDisplay = (pr.discUsd > 0)
                ? `<s style="color:var(--text-muted); font-size:10px; margin-right:3px;">${window.fMoney(pr.beforeDiscUsd)}</s>${window.fMoney(pr.finalUnitUsd)}`
                : ((pr.origUsd > 0 || pr.modExtra > 0 || c.isCombo) ? window.fMoney(pr.finalUnitUsd) : (pr.pRiel > 0 ? pr.pRiel.toLocaleString()+' ៛' : window.fMoney(pr.finalUnitUsd)));
            let totalDisplay = (pr.origUsd > 0 || pr.discUsd > 0 || pr.modExtra > 0 || c.isCombo)
                ? window.fMoney(pr.finalUnitUsd * c.cartQty)
                : (pr.pRiel > 0 ? (pr.pRiel * c.cartQty).toLocaleString()+' ៛' : window.fMoney(pr.finalUnitUsd * c.cartQty));
            
            let safeName = window.escapeHTML(c.name);
            let safeUnit = window.escapeHTML(c.unit) || 'ឯកតា';
            let advItemBtns = '';
            if (pfAdv.itemDiscounts) {
                const discActive = pr.discUsd > 0;
                advItemBtns += `<button type="button" onclick="window.openItemDiscountModal && window.openItemDiscountModal('${c.id}')" title="បញ្ចុះតម្លៃមុខទំនិញនេះ" style="border:1px solid ${discActive ? 'var(--warning)' : 'var(--border)'}; background:${discActive ? 'rgba(245,158,11,0.18)' : 'transparent'}; color:${discActive ? 'var(--warning)' : 'var(--text-muted)'}; border-radius:5px; padding:1px 5px; font-size:10px; cursor:pointer; margin-left:4px;">🏷️${discActive ? (c.itemDiscType==='$' ? '-$'+c.itemDiscVal : '-'+c.itemDiscVal+'%') : ''}</button>`;
            }
            if (pfAdv.posModifiers && !c.isCombo) {
                advItemBtns += `<button type="button" onclick="window.openPosModifierModal && window.openPosModifierModal('${c.id}')" title="ជម្រើស Size/ស្ករ/ទឹកកក & ក្តារចុចលេខ" style="border:1px solid var(--border); background:transparent; color:var(--primary); border-radius:5px; padding:1px 5px; font-size:10px; cursor:pointer; margin-left:3px;">⚙️</button>`;
            }
            if (pfAdv.serialImei && !c.isCombo) {
                const hasSn = Boolean(c.serialNo);
                advItemBtns += `<button type="button" onclick="window.openCartImeiModal && window.openCartImeiModal('${c.id}')" title="បញ្ចូល / ស្កេន Serial ឬ IMEI" style="border:1px solid ${hasSn ? 'var(--success)' : 'var(--border)'}; background:${hasSn ? 'rgba(16,185,129,0.16)' : 'transparent'}; color:${hasSn ? 'var(--success)' : 'var(--text-muted)'}; border-radius:5px; padding:1px 5px; font-size:10px; cursor:pointer; margin-left:3px;">🔢${hasSn ? '✓' : 'IMEI'}</button>`;
            }

            finalCartHtml += `<div class="cart-item"><img src="${c.image||window.SKM_IMG_FALLBACK||'https://placehold.co/100?text=Img'}" loading="lazy" onerror="this.onerror=null;this.src=window.SKM_IMG_FALLBACK||'https://placehold.co/100?text=Img';" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; margin-right: 10px; border: 1px solid var(--border);"><div style="flex:1;"><div style="font-weight:bold; font-size:var(--fs-14); margin-bottom:2px; line-height: 1.2; color: var(--text-main);">${safeName}</div><div style="color:var(--success); font-size:var(--fs-12); display:flex; align-items:center; flex-wrap:wrap; gap:2px;">${priceDisplay} <small style="color:var(--text-muted);">/ ${safeUnit}</small>${advItemBtns}</div></div><div style="display:flex; align-items:center; gap:4px; background:var(--bg-dark); padding:2px; border-radius:6px; border:1px solid var(--border);"><button class="qty-btn" onclick="window.updateCartQty('${c.id}', -1)" style="width:20px; height:20px; font-size:var(--fs-14);"> - </button><input type="number" class="cart-qty-input" value="${c.cartQty}" onchange="window.setCartQtyManually('${c.id}', this.value)" style="width: 35px; height:22px; text-align: center; background: transparent; border: none; font-weight: bold; color: var(--text-main); outline:none; font-size: var(--fs-13);"><button class="qty-btn" onclick="window.updateCartQty('${c.id}', 1)" style="width:20px; height:20px; font-size:var(--fs-14);"> + </button></div><div style="width:70px; text-align:right; font-weight:bold; font-size:var(--fs-14); margin-left: 10px; color: var(--text-main);">${totalDisplay}</div></div>`;
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
    const deliveryFeeNow = (window.sysSettings?.proFeatures?.orderModes && window.currentPosOrderMode === 'delivery' && window.cart && window.cart.length > 0)
        ? (parseFloat(window.currentDeliveryFeeUsd) || 0) : 0;
    window.cartFinalUsd = subTotalAfterDiscount + taxAmountUsd + deliveryFeeNow; 
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
    const actionText = isCollapsed ? (d.cartToggleTxt || 'បើកផ្ទាំងគិតលុយ (Checkout)') : (d.cartTogglePrefix || 'បង្រួម/ពង្រីក ផ្ទាំងគិតលុយ');
    const mobileInfo = document.getElementById('mobileCartTotalInfo');
    if(mobileInfo) mobileInfo.innerText = `${arrow} ${actionText} - ${tQty} ${d.itemsCountSuffix || 'មុខ'} (${window.fMoney(window.cartFinalUsd)}) ${arrow}`;
    if (typeof window.broadcastToCustomerDisplay === 'function') {
        window.broadcastToCustomerDisplay('cart_update', {
            items: window.cart || [],
            totalUsd: window.cartFinalUsd || 0,
            totalRiel: window.cartFinalRiel || 0,
            rate: window.cartRate || 4000,
            discountUsd: discountAmountUsd || 0,
            taxUsd: taxAmountUsd || 0
        });
    }
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
    const d = getPosI18n();
    const tQty = (window.cart || []).reduce((acc, item) => acc + item.cartQty, 0);
    if (window.innerWidth <= 768) { 
        document.getElementById('mobileCartContainer').classList.toggle('open'); 
    } else {
        if (body.classList.contains('collapsed')) { 
            body.classList.remove('collapsed'); 
            btn.innerHTML = `<span id="mobileCartTotalInfo">▼ ${d.cartTogglePrefix || 'បង្រួម/ពង្រីក ផ្ទាំងគិតលុយ'} - ${tQty} ${d.itemsCountSuffix || 'មុខ'} (${window.fMoney(window.cartFinalUsd)}) ▼</span>`; 
        } else { 
            body.classList.add('collapsed'); 
            btn.innerHTML = `<span id="mobileCartTotalInfo">▲ ${d.cartToggleTxt || 'បើកផ្ទាំងគិតលុយ (Checkout)'} - ${tQty} ${d.itemsCountSuffix || 'មុខ'} (${window.fMoney(window.cartFinalUsd)}) ▲</span>`; 
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
    const sysBakongId = (window.sysSettings && window.sysSettings.bakongId) ? String(window.sysSettings.bakongId).trim() : '';
    const sysBakongName = (window.sysSettings && window.sysSettings.bakongName) ? window.sysSettings.bakongName : (window.shopName || 'SKM SHOP');
    if (sysBakongId && navigator.onLine && window.cartFinalUsd > 0 && qrContainer && qrImage) {
        qrImage.src = window.getBakongQrImageUrl(sysBakongId, sysBakongName, window.cartFinalUsd, 'USD');
        qrImage.title = `Dynamic Bakong KHQR: $${window.cartFinalUsd.toFixed(2)}`;
        qrContainer.style.display = 'block';
    } else if (window.shopQR && qrContainer && qrImage) {
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
    const recvUsdText = (document.getElementById('checkoutReceivedUsd')?.value || '').trim(); 
    const recvRielText = (document.getElementById('checkoutReceivedRiel')?.value || '').trim(); 
    let recvUsd = parseFloat(recvUsdText) || 0;
    let recvRiel = parseFloat(recvRielText) || 0;

    if (!recvUsdText && !recvRielText) {
        recvUsd = window.cartFinalUsd;
        recvRiel = 0;
    }

    const totalKhr = Math.round(window.cartFinalRiel || 0); 
    const recvKhr = Math.round((recvUsd * (window.cartRate || 4000)) + recvRiel); 

    // 🛡️ ទប់ស្កាត់ការកាត់ Paid នៅពេលប្រាក់ទទួលតិចជាងតម្លៃសរុប (អនុគ្រោះគម្លាត 100៛ សម្រាប់ការបង្គត់)
    if (totalKhr > 0 && (recvKhr + 100) < totalKhr) {
        const shortKhr = totalKhr - recvKhr;
        const shortUsd = (shortKhr / (window.cartRate || 4000)).toFixed(2);
        return notifyPosUser(
            `⚠️ ប្រាក់ទទួលមិនគ្រប់គ្រាន់ទេ! នៅខ្វះ $${shortUsd} (${shortKhr.toLocaleString()} ៛)`,
            'ប្រាក់ទទួលមិនគ្រប់',
            true
        );
    }

    let changeKhr = recvKhr - totalKhr; 
    if (changeKhr < 0) changeKhr = 0; 
    let changeUsd = changeKhr / (window.cartRate || 4000); 
    
    document.getElementById('checkoutModal').style.display = 'none'; 
    window.checkout('paid', recvUsd, recvRiel, changeUsd, changeKhr); 
};

window.openPreorderModal = function() { 
    if(!window.cart || window.cart.length === 0) return notifyPosUser('គ្មានទំនិញក្នុងកន្ត្រកទេ!'); 
    
    const custNameInput = document.getElementById('posCustomerName').value.trim();
    if(!custNameInput) return notifyPosUser('សូមបញ្ចូលឈ្មោះអតិថិជនសិន មុននឹងចុចកក់ប្រាក់!');

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

window.getActiveReceiptConfig = function() {
    const defaults = {
        '80mm': { mode: '80mm', paperMm: 80, bodyMm: 76, padMm: 4, downloadWidthPx: 380, downloadScale: 2, fontPx: 12, titlePx: 16, logoPx: 100, qrPx: 170 },
        '58mm': { mode: '58mm', paperMm: 57, bodyMm: 54, padMm: 2, downloadWidthPx: 260, downloadScale: 2, fontPx: 10, titlePx: 13, logoPx: 65, qrPx: 125 },
        'A4':   { mode: 'A4', paperMm: 210, bodyMm: 190, padMm: 10, downloadWidthPx: 720, downloadScale: 2, fontPx: 14, titlePx: 20, logoPx: 120, qrPx: 190 }
    };
    const sys = window.sysSettings || {};
    const sizeKey = sys.receiptSize || '80mm';
    if (sys.customReceiptConfig && typeof sys.customReceiptConfig === 'object') {
        if (sizeKey === 'custom' || sys.customReceiptConfig.mode === sizeKey) {
            return Object.assign({}, defaults['80mm'], sys.customReceiptConfig);
        }
    }
    if (sizeKey.startsWith('preset_') && Array.isArray(sys.customPrinterPresets)) {
        const found = sys.customPrinterPresets.find(p => p && p.id === sizeKey);
        if (found) return Object.assign({}, defaults['80mm'], found);
    }
    return defaults[sizeKey] || defaults['80mm'];
};

window.executePrint = function(htmlContent, customTitle = 'Print Receipt') {
    const cfg = window.getActiveReceiptConfig();
    const isLarge = cfg.paperMm >= 150 || cfg.mode === 'A4';
    const winFeatures = isLarge ? 'width=850,height=900' : 'width=380,height=650';
    const pageCss = cfg.mode === 'A4'
        ? `@page { size: A4 portrait; margin: ${cfg.padMm}mm; }`
        : `@page { size: ${cfg.paperMm}mm auto; margin: 0; }`;

    // 🖨️ Popup-Free Hidden Iframe Print Engine (មិនជាប់ Popup Block របស់ Browser)
    let oldFrame = document.getElementById('skmHiddenPrintFrame');
    if (oldFrame) oldFrame.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'skmHiddenPrintFrame';
    iframe.style.cssText = 'position:fixed; right:0; bottom:0; width:0; height:0; border:0; visibility:hidden;';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<html><head><title>${customTitle}</title>`);
    doc.write('<link rel="stylesheet" href="print.css" type="text/css">');
    doc.write(`<style>
        ${pageCss}
        body { margin: 0; padding: 0; background: #fff; color: #000; font-family: 'Kantumruy Pro', 'Battambang', sans-serif; }
        #receipt-container { width: ${cfg.bodyMm}mm; max-width: 100%; margin: 0 auto; padding: ${cfg.padMm}mm; font-size: ${cfg.fontPx}px; line-height: 1.4; box-sizing: border-box; }
        #receipt-container h2 { font-size: ${cfg.titlePx}px !important; }
        #receipt-container img.receipt-logo { width: ${cfg.logoPx}px !important; height: ${cfg.logoPx}px !important; }
        #receipt-container img.receipt-qr { width: ${cfg.qrPx}px !important; height: ${cfg.qrPx}px !important; }
        .skm-page-break { page-break-after: always; break-after: page; height: 1px; margin: 10px 0; border-top: 1px dashed #ccc; }
    </style>`);
    doc.write('</head><body><div id="receipt-container">' + htmlContent + '</div></body></html>');
    doc.close();

    setTimeout(() => {
        try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        } catch(e) {
            window.print();
        }
    }, 350);
};

// 🖨️ Multi-Printer Feature: បាញ់បញ្ជាទៅម៉ាស៊ីនព្រីនផ្ទះបាយ / បារ / ផ្នែករៀបចំ
window.buildKitchenTicketsHTML = function(order, printerJobs) {
    const sys = window.sysSettings || {};
    const deptPrinters = sys.deptPrinters || [];
    let allTickets = '';
    for (const [printerId, items] of Object.entries(printerJobs)) {
        if (printerId === 'cashier' || printerId === 'none') continue;
        const printerInfo = deptPrinters.find(p => p.id === printerId);
        if (!printerInfo) continue;
        allTickets += `<div class="skm-page-break"></div><div style="text-align:center; font-family:'Kantumruy Pro', sans-serif;">`;
        allTickets += `<h2 style="border: 2px solid #000; padding: 4px; display:inline-block; margin-bottom:5px;">${printerInfo.name}</h2>`;
        allTickets += `<h3>តុ/ភ្ញៀវ: ${window.escapeHTML(order.customerName)}</h3>`;
        allTickets += `<p style="font-size:12px;">លេខបញ្ជា: ${order.id} | ${order.date}</p>`;
        if(order.note) allTickets += `<p style="font-size:12px; font-style:italic;">ចំណាំ: ${window.escapeHTML(order.note)}</p>`;
        allTickets += `<hr style="border-top:1px dashed #000;"><table style="width:100%; text-align:left; font-size:14px; font-weight:bold; margin-top: 10px;">`;
        items.forEach(item => {
            allTickets += `<tr><td style="padding:6px 0; border-bottom: 1px solid #ccc;"><span style="font-size: 16px;">[ ${item.cartQty} ]</span> x ${window.escapeHTML(item.name)}</td></tr>`;
        });
        allTickets += `</table><hr style="border-top:1px dashed #000; margin-top:10px;"><p style="font-size: 10px;">បោះពុម្ពម៉ោង: ${new Date().toLocaleTimeString('km-KH')}</p></div>`;
    }
    return allTickets;
};

window.routeOrderToPrinters = function(order, printerJobs) {
    const sys = window.sysSettings || {};
    const deptPrinters = sys.deptPrinters || [];

    for (const [printerId, items] of Object.entries(printerJobs)) {
        if (printerId === 'cashier' || printerId === 'none') continue; 

        const printerInfo = deptPrinters.find(p => p.id === printerId);
        if (!printerInfo) continue;

        let ticketHTML = `<div style="text-align:center; font-family:'Kantumruy Pro', sans-serif;">`;
        ticketHTML += `<h2 style="border: 2px solid #000; padding: 4px; display:inline-block; margin-bottom:5px;">${printerInfo.name}</h2>`;
        ticketHTML += `<h3>តុ: ${window.escapeHTML(order.customerName)}</h3>`;
        ticketHTML += `<p style="font-size:12px;">លេខបញ្ជា: ${order.id} | ${order.date}</p>`;
        if(order.note) ticketHTML += `<p style="font-size:12px; font-style:italic;">ចំណាំ: ${window.escapeHTML(order.note)}</p>`;
        ticketHTML += `<hr style="border-top:1px dashed #000;"><table style="width:100%; text-align:left; font-size:14px; font-weight:bold; margin-top: 10px;">`;
        
        items.forEach(item => {
            ticketHTML += `<tr><td style="padding:6px 0; border-bottom: 1px solid #ccc;"><span style="font-size: 16px;">[ ${item.cartQty} ]</span> x ${window.escapeHTML(item.name)}</td></tr>`;
        });
        
        ticketHTML += `</table><hr style="border-top:1px dashed #000; margin-top:10px;"><p style="font-size: 10px;">បោះពុម្ពម៉ោង: ${new Date().toLocaleTimeString('km-KH')}</p></div>`;

        window.executePrint(ticketHTML, `Ticket - ${printerInfo.name}`);
    }
};

window.checkout = function(status, rUsd = 0, rRiel = 0, cUsd = 0, cRiel = 0) {
    if(!window.cart || window.cart.length === 0) return notifyPosUser('គ្មានទំនិញក្នុងកន្ត្រកទេ!');
    
    const custNameInput = window.escapeHTML(document.getElementById('posCustomerName').value.trim()); 
    const custPhoneInput = window.escapeHTML(document.getElementById('posCustomerPhone').value.trim());
    const tableSelectEl = document.getElementById('posTableSelect');
    const selectedTable = (tableSelectEl && tableSelectEl.value) ? window.escapeHTML(tableSelectEl.value.trim()) : '';

    if((status === 'unpaid' || status === 'preorder') && !custNameInput) return notifyPosUser('សូមបញ្ចូលឈ្មោះអតិថិជនសិន!');
    
    let discountValue = parseFloat(document.getElementById('posDiscount') ? document.getElementById('posDiscount').value : 0) || 0; 
    let discountType = document.getElementById('posDiscountType') ? document.getElementById('posDiscountType').value : '%'; 
    let appliedTaxRate = (window.sysSettings && window.sysSettings.tax) ? (parseFloat(window.sysSettings.taxRate) || 0) : 0;
    
    let docType = status === 'paid' ? 'បង្កាន់ដៃទទួលប្រាក់ / Receipt' : (status === 'preorder' ? 'បង្កាន់ដៃកក់ប្រាក់ / Pre-order Receipt' : 'វិក្កយបត្រ / Invoice'); 
    let currentSellerName = window.activeUser ? window.escapeHTML(window.activeUser.fullName || window.activeUser.username) : 'System'; 
    let newInvId = window.generateInvoiceId(); 
    let timestampNow = Date.now(); 

    let receiptHTML = `<div style="text-align:center; margin-bottom: 8px;">`; 
    const rCfg = window.getActiveReceiptConfig();
    if(window.shopLogo) {
        let shape = window.sysSettings?.logoShape || 'circle';
        let scale = window.sysSettings?.logoScale || 1;
        let radius = shape === 'circle' ? '50%' : '8px';
        let fit = shape === 'circle' ? 'cover' : 'contain';
        receiptHTML += `<img class="receipt-logo" src="${window.shopLogo}" style="width: ${rCfg.logoPx}px; height: ${rCfg.logoPx}px; object-fit: ${fit}; border-radius: ${radius}; margin-bottom: 5px; transform: scale(${scale});">`; 
    }
    receiptHTML += `<h2 style="margin:0; font-size:16px;">${window.escapeHTML(window.shopName)}</h2>`; 
    if(window.shopPhone) receiptHTML += `<p style="margin:2px 0; font-size:12px;">Tel: ${window.escapeHTML(window.shopPhone)}</p>`; 
    if(window.shopAddress) receiptHTML += `<p style="margin:2px 0; font-size:12px;">${window.escapeHTML(window.shopAddress)}</p>`; 
    receiptHTML += `<div class="print-dashed-line"></div><p style="margin:4px 0; font-size:14px; font-weight:bold;">${docType}</p><p style="margin:2px 0; font-size:11px; text-align:left;">កាលបរិច្ឆេទ: ${window.fDate()}</p><p style="margin:2px 0; font-size:11px; text-align:left;">លេខវិក្កយបត្រ: ${newInvId}</p><p style="margin:2px 0; font-size:11px; text-align:left;">អ្នកលក់: ${currentSellerName}</p>`;
    if(custNameInput) receiptHTML += `<p style="margin:2px 0; font-size:11px; text-align:left;">អតិថិជន: <b>${custNameInput}</b> ${custPhoneInput?`(${custPhoneInput})`:''}</p>`;
    if(selectedTable && selectedTable !== custNameInput) receiptHTML += `<p style="margin:2px 0; font-size:11px; text-align:left; font-weight:bold;">តុ: ${selectedTable}</p>`;
    receiptHTML += `<div class="print-dashed-line"></div></div><table style="width:100%; text-align:left; font-size: 12px; table-layout: fixed;"><thead><tr><th style="width: 50%; border-bottom: 1px solid #000; padding-bottom: 4px;">ទំនិញ</th><th style="width: 20%; text-align:center; border-bottom: 1px solid #000; padding-bottom: 4px;">ចំនួន</th><th style="width: 30%; text-align:right; border-bottom: 1px solid #000; padding-bottom: 4px;">សរុប</th></tr></thead><tbody>`;

    const normalizedCartItems = [];
    const printerRouting = (window.sysSettings && window.sysSettings.categoryRouting) ? window.sysSettings.categoryRouting : {};
    let printerJobs = {}; 

    const stockDeductionsList = [];
    window.cart.forEach((c, index) => {
        if(!c) return; 
        const idx = c.isCombo ? -1 : (window.inventory || []).findIndex(p => p && p.id === c.id);
        const pr = window.getCartItemUnitPricing(c);
        let effectiveUsd = pr.finalUnitUsd;

        // ⚡ Low-Storage: កាត់ image ចេញពី order_data ដើម្បីកុំឱ្យពេញ localStorage & ស៊ី Supabase Egress
        const { image: _stripImg, ...cleanCartItem } = c;
        normalizedCartItems.push({
            ...cleanCartItem,
            price: effectiveUsd,
            cartQty: c.cartQty,
            qty: c.cartQty
        });

        let cat = c.category || 'Unknown';
        let routeId = printerRouting[cat] || 'none';
        if (routeId !== 'none' && window.sysSettings.toggleMultiPrinter) {
            if (!printerJobs[routeId]) printerJobs[routeId] = [];
            printerJobs[routeId].push(c);
        }

        if (c.isCombo && Array.isArray(c.comboItems)) {
            if (status !== 'preorder') {
                c.comboItems.forEach(comp => {
                    const cIdx = (window.inventory || []).findIndex(p => p && String(p.id) === String(comp.id));
                    const dQty = (parseInt(comp.qty) || 1) * (parseInt(c.cartQty) || 1);
                    if (cIdx !== -1) {
                        window.inventory[cIdx].qty = Math.max(0, (parseFloat(window.inventory[cIdx].qty) || 0) - dQty);
                        stockDeductionsList.push({ id: window.inventory[cIdx].id, qty: dQty });
                    }
                });
            }
            if (typeof window.logAction === 'function') window.logAction('sale', c.name, c.cartQty, 'លក់ឈុត Combo (កាត់ស្តុកគ្រឿងផ្សំអូតូ)', window.activeUser);
        } else if(idx !== -1) {
            if (status !== 'preorder') {
                window.inventory[idx].qty = Math.max(0, (parseFloat(window.inventory[idx].qty) || 0) - c.cartQty);
                stockDeductionsList.push({ id: c.id, qty: parseInt(c.cartQty) || 1 });
            }
            if (typeof window.logAction === 'function') window.logAction('sale', c.name, c.cartQty, status === 'paid' ? 'លក់ចេញ (ទូទាត់រួច)' : (status === 'preorder' ? `កក់ប្រាក់ (Pre-order ដោយ ${custNameInput})` : `លក់ចេញ (រង់ចាំទូទាត់ ដោយ ${custNameInput})`), window.activeUser);
        }

        let lineStr = '', uPriceStr = '';
        if(pr.origUsd > 0 || pr.discUsd > 0 || pr.modExtra > 0 || c.isCombo) { lineStr = window.fMoney(effectiveUsd * c.cartQty); uPriceStr = window.fMoney(effectiveUsd); } 
        else if(pr.pRiel > 0) { lineStr = (pr.pRiel * c.cartQty).toLocaleString() + '៛'; uPriceStr = pr.pRiel.toLocaleString() + '៛'; } 
        else { lineStr = window.fMoney(effectiveUsd * c.cartQty); uPriceStr = window.fMoney(effectiveUsd); } 
        
        let safeItemName = window.escapeHTML(c.name);
        let safeItemUnit = window.escapeHTML(c.unit) || '';
        const snHtml = c.serialNo ? `<div style="font-size:10px; font-family:monospace; color:#333; margin-top:1px;">S/N: ${window.escapeHTML(c.serialNo)}</div>` : '';
        receiptHTML += `<tr><td colspan="3" style="padding-top: 4px; font-weight:bold; font-size: 12px;">${index + 1}. ${safeItemName}${snHtml}</td></tr><tr><td style="padding-bottom: 4px; font-size: 11px;">${uPriceStr}</td><td style="text-align:center; padding-bottom: 4px; font-size: 11px;">${c.cartQty} ${safeItemUnit}</td><td style="text-align:right; font-weight:bold; padding-bottom: 4px;">${lineStr}</td></tr>`;
    });
    receiptHTML += `</tbody></table><div class="print-dashed-line"></div>`;

    let paidUsdAmount = 0;
    if (status === 'paid') paidUsdAmount = window.cartFinalUsd;
    else if (status === 'preorder') paidUsdAmount = rUsd + (rRiel / window.cartRate);

    const finalCustomerName = custNameInput || selectedTable || 'អតិថិជនទូទៅ';
    const orderModeEnabled = !!(window.sysSettings?.proFeatures?.orderModes);
    const orderModeLabel = orderModeEnabled
        ? (window.currentPosOrderMode === 'takeaway' ? '[🛍️ Takeaway]' : (window.currentPosOrderMode === 'delivery' ? '[🛵 Delivery]' : '[🍽️ Dine-In]'))
        : '';
    const deliveryFeeApplied = (orderModeEnabled && window.currentPosOrderMode === 'delivery') ? (parseFloat(window.currentDeliveryFeeUsd) || 0) : 0;
    const noteParts = [];
    if (orderModeLabel) noteParts.push(orderModeLabel);
    if (selectedTable && selectedTable !== finalCustomerName) noteParts.push(`[${selectedTable}]`);
    if (deliveryFeeApplied > 0) noteParts.push(`[Delivery Fee: $${deliveryFeeApplied.toFixed(2)}]`);
    const invoiceNote = noteParts.join(' ');

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
    localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(window.invoices));
    if (window.inventory) localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
    
    if(custNameInput && custNameInput !== selectedTable && typeof window.setAutoRegisterCustomer === 'function') {
        window.setAutoRegisterCustomer(custNameInput, custPhoneInput);
    }

    receiptHTML += `<table style="width:100%; font-size: 12px; margin-top: 5px;">`;
    if (discountValue > 0) receiptHTML += `<tr><td>បញ្ចុះតម្លៃ:</td><td style="text-align:right;">${discountType === '%' ? `${discountValue}%` : window.fMoney(discountValue)}</td></tr>`;
    if (appliedTaxRate > 0) receiptHTML += `<tr><td>VAT (${appliedTaxRate}%):</td><td style="text-align:right;">បូកបញ្ចូល</td></tr>`;
    if (deliveryFeeApplied > 0) receiptHTML += `<tr><td>ថ្លៃដឹកជញ្ជូន (Delivery):</td><td style="text-align:right;">+${window.fMoney(deliveryFeeApplied)}</td></tr>`;
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

    let footerText = (window.sysSettings && window.sysSettings.receiptFooter) ? window.escapeHTML(window.sysSettings.receiptFooter).replace(/\n/g, '<br>') : 'សូមអរគុណ! សូមអញ្ជើញមកម្តងទៀត។';
    
    const rcptBakongId = (window.sysSettings && window.sysSettings.bakongId) ? String(window.sysSettings.bakongId).trim() : '';
    const rcptBakongName = (window.sysSettings && window.sysSettings.bakongName) ? window.sysSettings.bakongName : (window.shopName || 'SKM SHOP');
    const rcptQrUrl = (rcptBakongId && navigator.onLine && window.cartFinalUsd > 0 && typeof window.getBakongQrImageUrl === 'function')
        ? window.getBakongQrImageUrl(rcptBakongId, rcptBakongName, window.cartFinalUsd, 'USD')
        : window.shopQR;
    if (rcptQrUrl) receiptHTML += `<div style="text-align:center; margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px;"><p style="font-size:12px; margin-bottom:5px; font-weight:bold;">${rcptBakongId && navigator.onLine && window.cartFinalUsd > 0 ? 'ស្កេន Bakong KHQR (លោតលុយអូតូ)' : 'ស្កេនទូទាត់ប្រាក់ (Scan to Pay)'}</p><img class="receipt-qr" src="${rcptQrUrl}" style="width: ${rCfg.qrPx}px; height: ${rCfg.qrPx}px; object-fit: contain;"></div>`;
    receiptHTML += `<p style="text-align:center; font-size:10px; margin-top: 10px;">(Rate: 1$ = ${window.cartRate}៛)</p><p style="text-align:center; font-size:12px; margin-top: 5px; font-weight:bold;">${footerText}</p>`; 
    
    if (typeof window.broadcastToCustomerDisplay === 'function') {
        window.broadcastToCustomerDisplay('checkout_done', {
            items: [],
            totalUsd: window.cartFinalUsd || 0,
            totalRiel: window.cartFinalRiel || 0,
            rate: window.cartRate || 4000,
            changeUsd: cUsd || 0,
            changeRiel: cRiel || 0
        });
    }
    // Clear Input
    window.cart = []; 
    const cNameInputEl = document.getElementById('posCustomerName'); 
    if(cNameInputEl) { cNameInputEl.value = ''; cNameInputEl.style.borderLeft = '1px solid var(--border)'; }
    const cPhoneInputEl = document.getElementById('posCustomerPhone'); if(cPhoneInputEl) cPhoneInputEl.value = ''; 
    if(tableSelectEl) tableSelectEl.value = '';
    const posDiscEl = document.getElementById('posDiscount'); if (posDiscEl) posDiscEl.value = ''; 
    const mobileContainer = document.getElementById('mobileCartContainer'); if(mobileContainer) mobileContainer.classList.remove('open'); 
    
    const dateFromInput = document.getElementById('invoiceDateFrom');
    const dateToInput = document.getElementById('invoiceDateTo');
    if (dateFromInput) dateFromInput.value = '';
    if (dateToInput) dateToInput.value = '';

    window.renderCart(); 
    window.renderPOSProducts(); 
    if(typeof window.renderUnpaid === 'function') window.renderUnpaid();
    if(typeof window.renderCustomers === 'function') window.renderCustomers();
    if(typeof window.renderDashboard === 'function') window.renderDashboard();
    if(typeof window.refreshFloorPlanStatus === 'function') window.refreshFloorPlanStatus();
    
    let combinedPrintHTML = receiptHTML;
    if (window.sysSettings && window.sysSettings.toggleMultiPrinter && Object.keys(printerJobs).length > 0) {
        const extraTickets = window.buildKitchenTicketsHTML ? window.buildKitchenTicketsHTML(newInvoice, printerJobs) : '';
        if (extraTickets) combinedPrintHTML += extraTickets;
    }
    if (typeof window.dispatchSilentOrBrowserPrint === 'function') {
        window.dispatchSilentOrBrowserPrint(newInvoice, printerJobs, combinedPrintHTML, `Receipt - ${newInvId}`);
    } else {
        window.executePrint(combinedPrintHTML, `Receipt - ${newInvId}`);
    }

    setTimeout(async () => {
        if (window.supabaseClient && navigator.onLine) {
            try {
                const { error: orderError } = await window.supabaseClient
                    .from('pos_orders')
                    .insert([{
                        id: newInvId,
                        branch_id: window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1',
                        customer_name: newInvoice.customerName,
                        customer_phone: newInvoice.customerPhone,
                        total_amount: newInvoice.totalAmount,
                        paid_amount: newInvoice.paidUsd || 0,
                        status: newInvoice.status,
                        seller: newInvoice.seller,
                        order_data: newInvoice.items,
                        note: newInvoice.note,
                        timestamp: newInvoice.timestamp
                    }]);

                if (orderError) throw orderError;
                console.log("✅ វិក្កយបត្រត្រូវបានរក្សាទុកចូល pos_orders");

                if (status !== 'preorder') {
                    const bId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
                    for (let sd of stockDeductionsList) {
                        const deductQty = parseInt(sd.qty) || 1;
                        const { error: stockError } = await window.supabaseClient.rpc('deduct_stock_safely', {
                            p_product_id: sd.id,
                            p_branch_id: bId,
                            deduct_qty: deductQty
                        });
                        if (stockError) {
                            console.warn("RPC deduct_stock_safely fallback -> direct update:", stockError);
                            const localProd = (window.inventory || []).find(p => p && String(p.id) === String(sd.id));
                            if (localProd) {
                                await window.supabaseClient.from('pos_products')
                                    .update({ qty: Math.max(0, parseFloat(localProd.qty) || 0), updated_at: new Date().toISOString() })
                                    .eq('id', String(localProd.id))
                                    .eq('branch_id', bId);
                            }
                        }
                    }
                }
                
                if (typeof window.touchCloudSync === 'function') window.touchCloudSync();
                else if (typeof window.saveData === 'function') window.saveData(window.userAccounts);

            } catch (err) {
                console.error("Supabase Save Error:", err);
                if (typeof window.touchCloudSync === 'function') window.touchCloudSync();
                else if (typeof window.saveData === 'function') window.saveData(window.userAccounts);
            }
        } else {
            if (typeof window.touchCloudSync === 'function') window.touchCloudSync();
            else if (typeof window.saveData === 'function') window.saveData(window.userAccounts); 
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

// ==========================================
// ធ្វើបច្ចុប្បន្នភាពការកំណត់ស្វ័យប្រវត្តិ ពេលឆ្លាស់ Tab គ្នា (Auto-Refresh Settings)
// ==========================================
window.addEventListener('visibilitychange', function() {
    if (!document.hidden && typeof window.getBranchKey === 'function') {
        const freshSettings = localStorage.getItem(window.getBranchKey('sys_settings'));
        if (freshSettings) {
            window.sysSettings = JSON.parse(freshSettings);
            let shape = window.sysSettings.logoShape || 'circle';
            let radius = (shape === 'circle') ? '50%' : '12px';
            ['sidebarLogo', 'shopLogoPreview', 'viewInvoiceLogo'].forEach(id => {
                let el = document.getElementById(id);
                if (el) { el.style.borderRadius = radius; el.style.objectFit = (shape === 'circle') ? 'cover' : 'contain'; }
            });
        }
    }
});

// =========================================================================
// 🖨️ SILENT PRINT BRIDGE (PC LAN IP:9100) + ANDROID RAWBT / APK BRIDGE
// =========================================================================
window.buildPlainReceiptText = function(order, titleHeader = '') {
    const line = '--------------------------------';
    const out = [];
    if (titleHeader) {
        out.push(`*** ${titleHeader} ***`);
    } else {
        out.push(String(window.shopName || 'SKM INTEGRATE'));
        if (window.shopPhone) out.push(`Tel: ${window.shopPhone}`);
        if (window.shopAddress) out.push(String(window.shopAddress));
    }
    out.push(line);
    out.push(`INV: ${order.id || ''}`);
    out.push(`Date: ${order.date || ''}`);
    out.push(`Customer: ${order.customerName || 'Walk-in'}`);
    if (order.seller) out.push(`Staff: ${order.seller}`);
    if (order.note) out.push(`Note: ${order.note}`);
    out.push(line);
    (order.items || []).forEach((it, idx) => {
        const qty = it.cartQty || it.qty || 1;
        const price = Number(it.price || 0);
        out.push(`${idx + 1}. ${it.name}`);
        if (it.serialNo) out.push(`   S/N: ${it.serialNo}`);
        out.push(`   ${qty} x $${price.toFixed(2)} = $${(qty * price).toFixed(2)}`);
    });
    out.push(line);
    if (!titleHeader) {
        out.push(`TOTAL: $${Number(order.totalAmount || 0).toFixed(2)}`);
        if (order.totalRiel) out.push(`TOTAL KHR: ${Number(order.totalRiel).toLocaleString()} KHR`);
        if (order.status === 'paid' && (order.receivedUsd > 0 || order.receivedRiel > 0)) {
            out.push(`PAID: $${Number(order.receivedUsd || 0).toFixed(2)} | ${Number(order.receivedRiel || 0).toLocaleString()} KHR`);
            out.push(`CHANGE: $${Number(order.changeUsd || 0).toFixed(2)} | ${Math.round(order.changeRiel || 0).toLocaleString()} KHR`);
        }
        out.push(line);
        out.push((window.sysSettings && window.sysSettings.receiptFooter) || 'Thank you! Please come again.');
    }
    out.push('\n\n');
    return out.join('\n');
};

window.dispatchSilentOrBrowserPrint = async function(order, printerJobs, fallbackHTML, docTitle) {
    const sys = window.sysSettings || {};
    const mode = sys.silentPrintMode || 'browser';
    const rCfg = window.getActiveReceiptConfig ? window.getActiveReceiptConfig() : { paperMm: 80 };

    // 0. Native PC Desktop App (Electron SKMDesktopBridge — Parallel Fast Silent USB/Windows + LAN IP Printing)
    if (window.SKMDesktopBridge && window.SKMDesktopBridge.isDesktopApp && (mode === 'desktop_silent' || mode === 'bridge')) {
        try {
            const deptPrinters = sys.deptPrinters || [];
            const ipJobs = [];
            const usbTasks = [];
            let hasCashierUsb = false;

            // A. Cashier Print
            const cashierIp = (sys.cashierPrinterIp || '').trim();
            if (mode === 'bridge' && cashierIp) {
                ipJobs.push({
                    targetName: 'Cashier',
                    ip: cashierIp,
                    port: parseInt(sys.cashierPrinterPort) || 9100,
                    openDrawer: Boolean(sys.toggleOpenCashDrawer && order.status === 'paid'),
                    cutPaper: true,
                    text: window.buildPlainReceiptText(order, '')
                });
            } else {
                hasCashierUsb = true;
                const cashierOnlyHtml = fallbackHTML.split('<div class="skm-page-break"></div>')[0] || fallbackHTML;
                usbTasks.push(window.SKMDesktopBridge.printSilentHtml({
                    html: cashierOnlyHtml,
                    deviceName: (sys.cashierWinPrinter || '').trim(),
                    paperMm: rCfg.paperMm || 80,
                    title: docTitle || 'SKM Receipt'
                }));
            }

            // B. Multi-Printer Kitchen / Bar Routing (Fire ALL printers in parallel!)
            if (sys.toggleMultiPrinter && printerJobs && typeof printerJobs === 'object') {
                for (const [pid, items] of Object.entries(printerJobs)) {
                    if (pid === 'cashier' || pid === 'none') continue;
                    const pInfo = deptPrinters.find(p => p.id === pid);
                    if (!pInfo) continue;

                    if (pInfo.type === 'network' && pInfo.ip) {
                        ipJobs.push({
                            targetName: pInfo.name,
                            ip: String(pInfo.ip).trim(),
                            port: parseInt(pInfo.port) || 9100,
                            openDrawer: false,
                            cutPaper: true,
                            text: window.buildPlainReceiptText({ ...order, items }, pInfo.name)
                        });
                    } else {
                        const ticketHtml = window.buildKitchenTicketsHTML
                            ? window.buildKitchenTicketsHTML(order, { [pid]: items }).replace('<div class="skm-page-break"></div>', '')
                            : '';
                        if (ticketHtml) {
                            usbTasks.push(window.SKMDesktopBridge.printSilentHtml({
                                html: ticketHtml,
                                deviceName: (pInfo.winPrinter || '').trim(),
                                paperMm: rCfg.paperMm || 80,
                                title: `Ticket - ${pInfo.name}`
                            }));
                        }
                    }
                }
            }

            const allTasks = [...usbTasks];
            if (ipJobs.length > 0 && typeof window.SKMDesktopBridge.printRawIp === 'function') {
                allTasks.push(window.SKMDesktopBridge.printRawIp({ jobs: ipJobs }));
            }

            const results = await Promise.all(allTasks);
            if (hasCashierUsb && (!results[0] || !results[0].ok)) {
                console.warn('Desktop silent print failed, fallback to iframe:', results[0]?.error);
                window.executePrint(fallbackHTML, docTitle);
                return;
            }
            if (typeof window.showToast === 'function') {
                window.showToast('⚡ PC App បានបាញ់ព្រីនព្រមគ្នាជោគជ័យ!');
            }
            return;
        } catch (err) {
            console.warn('SKMDesktopBridge print error -> fallback:', err);
        }
    }

    // 1. Native Android APK WebView Bridge (if running inside custom Android APK)
    if (typeof window.SKMAndroidBridge !== 'undefined' && typeof window.SKMAndroidBridge.printHtml === 'function') {
        try {
            window.SKMAndroidBridge.printHtml(fallbackHTML, docTitle || 'Receipt');
            return;
        } catch (e) { console.warn('SKMAndroidBridge error:', e); }
    }

    // 2. Android App / RawBT Silent Thermal Printer Mode
    if (mode === 'rawbt') {
        try {
            let fullTxt = window.buildPlainReceiptText(order, '');
            if (sys.toggleMultiPrinter && printerJobs) {
                const deptPrinters = sys.deptPrinters || [];
                Object.entries(printerJobs).forEach(([pid, items]) => {
                    if (pid === 'cashier' || pid === 'none') return;
                    const pInfo = deptPrinters.find(p => p.id === pid);
                    if (pInfo) {
                        fullTxt += '\n================================\n';
                        fullTxt += window.buildPlainReceiptText({ ...order, items }, pInfo.name);
                    }
                });
            }
            const utf8B64 = btoa(unescape(encodeURIComponent(fullTxt)));
            window.location.href = `intent:base64,${utf8B64}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;`;
            if (typeof window.showToast === 'function') window.showToast('🖨️ បញ្ជូនទៅម៉ាស៊ីនព្រីន Android (RawBT)!');
            return;
        } catch (err) {
            console.warn('RawBT fallback to browser print:', err);
            window.executePrint(fallbackHTML, docTitle);
            return;
        }
    }

    // 3. PC Local Print Bridge (Silent Direct LAN IP Port 9100 + Multi-Printer Kitchen/Bar Routing)
    if (mode === 'bridge') {
        const bridgeUrl = (sys.printBridgeUrl || 'http://127.0.0.1:9191').replace(/\/+$/, '');
        const jobs = [];
        const cashierIp = (sys.cashierPrinterIp || '').trim();
        const cashierPort = parseInt(sys.cashierPrinterPort) || 9100;

        if (cashierIp) {
            jobs.push({
                targetName: 'Cashier',
                ip: cashierIp,
                port: cashierPort,
                paperWidth: sys.receiptSize === '58mm' ? 58 : 80,
                openDrawer: Boolean(sys.toggleOpenCashDrawer && order.status === 'paid'),
                cutPaper: true,
                text: window.buildPlainReceiptText(order, ''),
                order
            });
        }

        if (sys.toggleMultiPrinter && printerJobs && typeof printerJobs === 'object') {
            const deptPrinters = sys.deptPrinters || [];
            Object.entries(printerJobs).forEach(([pid, items]) => {
                if (pid === 'cashier' || pid === 'none') return;
                const pInfo = deptPrinters.find(p => p.id === pid);
                if (pInfo && pInfo.type === 'network' && pInfo.ip) {
                    jobs.push({
                        targetName: pInfo.name,
                        ip: String(pInfo.ip).trim(),
                        port: parseInt(pInfo.port) || 9100,
                        paperWidth: parseInt(pInfo.paperWidth) || 80,
                        openDrawer: false,
                        cutPaper: true,
                        text: window.buildPlainReceiptText({ ...order, items }, pInfo.name),
                        order: { ...order, items }
                    });
                }
            });
        }

        if (jobs.length > 0) {
            try {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 3200);
                const resp = await fetch(`${bridgeUrl}/print-batch`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobs }),
                    signal: controller.signal
                });
                clearTimeout(timer);
                if (resp.ok) {
                    const json = await resp.json();
                    if (json && json.ok) {
                        if (typeof window.showToast === 'function') {
                            window.showToast(`🖨️ ព្រីនស្វ័យប្រវត្តិជោគជ័យ (${jobs.length} ម៉ាស៊ីន)!`);
                        }
                        if (!cashierIp) {
                            window.executePrint(fallbackHTML, docTitle);
                        }
                        return;
                    }
                }
            } catch (err) {
                console.warn('SKM Print Bridge unreachable -> falling back to browser iframe print:', err);
                if (typeof window.showToast === 'function') {
                    window.showToast('⚠️ មិនអាចភ្ជាប់ Print Bridge បាន — ប្តូរទៅព្រីនតាម Browser ជំនួស!', true);
                }
            }
        }
    }

    window.executePrint(fallbackHTML, docTitle);
};
