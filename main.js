// main.js

// ==========================================
// 0. EARLY SETTINGS LOAD
// ==========================================
const LOCAL_POS_THEME_KEYS = ['posLuxuryTheme', 'customBrandTheme', 'seasonalEffect', 'seasonalExpiry'];

window.getLocalPosTheme = function() {
    try {
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        const raw = localStorage.getItem(`ks2_${branchId}_local_pos_theme`);
        return raw ? (JSON.parse(raw) || {}) : {};
    } catch(e) {
        return {};
    }
};

window.saveLocalPosTheme = function(themePatch) {
    try {
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        const merged = Object.assign({}, window.getLocalPosTheme(), themePatch || {});
        localStorage.setItem(`ks2_${branchId}_local_pos_theme`, JSON.stringify(merged));
        if (!window.sysSettings) window.sysSettings = {};
        LOCAL_POS_THEME_KEYS.forEach(k => {
            if (merged[k] !== undefined) window.sysSettings[k] = merged[k];
        });
    } catch(e) {}
};

window.stripLocalThemeForCloud = function(settingsObj) {
    const clean = Object.assign({}, settingsObj || {});
    LOCAL_POS_THEME_KEYS.forEach(k => delete clean[k]);
    return clean;
};

try {
    const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    const sysKey = `ks2_${branchId}_sys_settings`;
    const loadedSys = JSON.parse(localStorage.getItem(sysKey));
    const localTheme = window.getLocalPosTheme();
    if (loadedSys) window.sysSettings = Object.assign({}, window.sysSettings || {}, loadedSys, localTheme);
    else if (Object.keys(localTheme).length > 0) window.sysSettings = Object.assign({}, window.sysSettings || {}, localTheme);
} catch(e) {
    console.warn("Early sysSettings load skipped.");
}

// ==========================================
// 👑 ALL-IN-ONE LUXURY THEME LOADER FOR POS (Root File: all_luxury_themes.js)
// ==========================================
window.SKM_LEGACY_THEME_MAP = {
    obsidian: '08_obsidian_michelin',
    ivory: '15_pearl_patisserie',
    emerald: '13_parisian_bistro',
    sapphire: '40_sapphire_cyber',
    rose_champagne: '16_rose_macaron',
    royal_espresso: '01_royal_espresso'
};

window.ensureThemeBundleLoaded = function(cb) {
    if (typeof window.applyLuxuryThemeById === 'function' && typeof window.applyCustomBrandTheme === 'function') {
        if (typeof cb === 'function') cb();
        return;
    }
    let sc = document.getElementById('skm-all-luxury-themes-script');
    if (sc) {
        if (typeof cb === 'function') sc.addEventListener('load', cb, { once: true });
        return;
    }
    sc = document.createElement('script');
    sc.id = 'skm-all-luxury-themes-script';
    sc.src = './all_luxury_themes.js';
    sc.async = true;
    if (typeof cb === 'function') sc.onload = cb;
    sc.onerror = () => console.warn('[SKM Theme] Missing ./all_luxury_themes.js in root folder.');
    document.head.appendChild(sc);
};
window.ensureThemeExtrasLoaded = window.ensureThemeBundleLoaded;

window.applyPosLuxuryTheme = function(themeId, isFromShowroom) {
    try {
        const qp = new URLSearchParams(window.location.search);
        if (!isFromShowroom && (qp.get('showroom') || qp.get('preview_theme')) && themeId !== undefined && window.__SKM_SHOWROOM_ACTIVE__) {
            return;
        }
    } catch(e) {}
    const localTheme = typeof window.getLocalPosTheme === 'function' ? window.getLocalPosTheme() : {};
    const rawId = themeId !== undefined ? themeId : (localTheme.posLuxuryTheme || 'default');
    const id = window.SKM_LEGACY_THEME_MAP[rawId] || rawId;
    const existingStyle = document.getElementById('skm-pos-luxury-theme-style');

    // Local Seasonal Overlay (only if set locally on this POS device)
    const eff = localTheme.seasonalEffect || 'none';
    if (eff && eff !== 'none') {
        window.ensureThemeBundleLoaded(() => {
            if (typeof window.applySeasonalOverlay === 'function') {
                window.applySeasonalOverlay(eff, localTheme.seasonalExpiry || '');
            }
        });
    } else if (typeof window.applySeasonalOverlay === 'function') {
        window.applySeasonalOverlay('none', '');
    }

    window.__SKM_WANTED_POS_THEME__ = id || 'default';
    if (!id || id === 'default') {
        if (existingStyle) existingStyle.remove();
        document.documentElement.removeAttribute('data-pos-lux-theme');
        return;
    }

    // Custom Brand-from-Logo Theme (Local)
    const brandObj = localTheme.customBrandTheme || (window.sysSettings && window.sysSettings.customBrandTheme);
    if (id === 'custom_brand' && brandObj) {
        window.ensureThemeBundleLoaded(() => {
            if (window.__SKM_WANTED_POS_THEME__ === 'custom_brand' && typeof window.applyCustomBrandTheme === 'function') {
                window.applyCustomBrandTheme(brandObj, 'pos');
            }
        });
        return;
    }

    // Instant apply from root bundle ./all_luxury_themes.js
    window.ensureThemeBundleLoaded(() => {
        if (window.__SKM_WANTED_POS_THEME__ === id && typeof window.applyLuxuryThemeById === 'function') {
            window.applyLuxuryThemeById(id, 'pos');
        }
    });
};

// Auto-load Showroom engine if URL contains ?showroom=1 or ?preview_theme=...
(function() {
    try {
        const qp = new URLSearchParams(window.location.search);
        if (qp.get('showroom') || qp.get('preview_theme') || qp.get('preview_season')) {
            window.ensureThemeBundleLoaded();
        }
    } catch(e) {}
})();

try { window.applyPosLuxuryTheme(); } catch(e) {}


// ជំនួយការសម្រាប់ផ្ទៀងផ្ទាត់ថាតើកូដបន្ថែម (Custom JS) ត្រូវបានបើក (On) ឬបិទ (Off)
window.isCustomScriptEnabled = function(scriptObj) {
    if (!scriptObj || typeof scriptObj !== 'object') return false;
    if (scriptObj.active === false || scriptObj.isActive === false) return false;
    return Boolean(scriptObj.active || scriptObj.isActive);
};

window.normalizeCustomScriptsList = function(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(s => s && typeof s === 'object').map((s, idx) => {
        const enabled = window.isCustomScriptEnabled(s);
        return {
            ...s,
            id: s.id || ('pos_script_' + idx),
            active: enabled,
            isActive: enabled
        };
    });
};

// ==========================================
// 0.5 INITIALIZE LOCAL DATA PRE-FETCH
// ==========================================
try {
    const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    window.inventory = JSON.parse(localStorage.getItem(`ks2_${branchId}_inv_pro`)) || [];
    window.invoices = JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices_pro`)) || [];
    window.historyLog = JSON.parse(localStorage.getItem(`ks2_${branchId}_hist_pro`)) || [];
    window.expenses = JSON.parse(localStorage.getItem(`ks2_${branchId}_expenses_pro`)) || [];
    window.customers = JSON.parse(localStorage.getItem(`ks2_${branchId}_customers_pro`)) || [];
    
    let rawPosScripts = JSON.parse(localStorage.getItem(`ks2_${branchId}_pos_scripts`));
    if ((!rawPosScripts || !Array.isArray(rawPosScripts)) && window.sysSettings && Array.isArray(window.sysSettings.customPosScripts)) {
        rawPosScripts = window.sysSettings.customPosScripts;
    }
    if (Array.isArray(rawPosScripts)) {
        window.customPosScripts = window.normalizeCustomScriptsList(rawPosScripts);
        localStorage.setItem(`ks2_${branchId}_pos_scripts`, JSON.stringify(window.customPosScripts));
    } else {
        window.customPosScripts = [];
    }
} catch(e) {
    console.warn("Error loading data from LocalStorage:", e);
    window.inventory = []; window.invoices = []; window.historyLog = []; window.expenses = []; window.customers = []; window.customPosScripts = [];
}

// ការពារកុំឱ្យកូដបន្ថែមដំណើរការជាន់គ្នា ២ ដង (Duplicate Injection Guard)
window._injectedPosScriptCodes = window._injectedPosScriptCodes || new Set();
(function setupDuplicateScriptGuard() {
    if (window._posScriptGuardInstalled || !document.body) return;
    window._posScriptGuardInstalled = true;
    const origAppendChild = document.body.appendChild.bind(document.body);
    document.body.appendChild = function(node) {
        if (node && node.tagName === 'SCRIPT' && !node.id && node.textContent) {
            if (window._injectedPosScriptCodes.has(node.textContent.trim())) {
                return node;
            }
        }
        return origAppendChild(node);
    };
})();

window.injectPosScripts = function() {
    if (!window.customPosScripts || !Array.isArray(window.customPosScripts)) return;
    window.customPosScripts = window.normalizeCustomScriptsList(window.customPosScripts);

    window.customPosScripts.forEach(scriptObj => {
        if (!scriptObj) return;
        const isEnabled = window.isCustomScriptEnabled(scriptObj);
        const existingScript = document.getElementById(scriptObj.id);

        if (!isEnabled) {
            if (existingScript) existingScript.remove();
            return;
        }

        if (isEnabled && scriptObj.code) {
            try {
                const trimmedCode = String(scriptObj.code).trim();
                if (existingScript && window._injectedPosScriptCodes.has(trimmedCode)) return;
                if (existingScript) existingScript.remove();

                window._injectedPosScriptCodes.add(trimmedCode);
                const scriptEl = document.createElement('script');
                scriptEl.textContent = scriptObj.code;
                scriptEl.id = scriptObj.id;
                document.body.appendChild(scriptEl);
                console.log(`✨ POS Custom JS loaded: ${scriptObj.name}`);
            } catch (err) {
                console.error(`Error loading POS script ${scriptObj.name}:`, err);
            }
        }
    });
};
window.injectPosScripts();

// ==========================================
// 0.6 BUNDLED POS PLUGINS TOGGLE SYNC (Root-Hosted all_pos_plugins.js)
// ==========================================
function ensureRootPosPluginsLoaded() {
    if (typeof window.skmApplyActivePlugins === 'function') {
        window.skmApplyActivePlugins(window.sysSettings?.activePlugins || null);
        return;
    }
    if (document.getElementById('skm-root-pos-plugins')) return;
    const sc = document.createElement('script');
    sc.id = 'skm-root-pos-plugins';
    sc.src = './all_pos_plugins.js';
    sc.async = true;
    sc.onload = function() {
        if (typeof window.skmApplyActivePlugins === 'function') {
            window.skmApplyActivePlugins(window.sysSettings?.activePlugins || null);
        }
    };
    document.head.appendChild(sc);
}
function injectMenuScripts() {
    if (typeof window.skmApplyActivePlugins === 'function') {
        window.skmApplyActivePlugins(window.sysSettings?.activePlugins || null);
    }
}
injectMenuScripts();
// Runs after all deferred scripts in index.html; auto-loads ./all_pos_plugins.js from root if missing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(ensureRootPosPluginsLoaded, 120));
} else {
    setTimeout(ensureRootPosPluginsLoaded, 120);
}

// ==========================================
// 1. BIND UTILS & CONFIGS TO WINDOW
// ==========================================
if (typeof window.fDate !== 'function') {
    window.fDate = function() { 
        const d = new Date(); 
        return d.toLocaleDateString('km-KH') + ' ' + d.toLocaleTimeString('km-KH'); 
    };
}

if (typeof window.fMoney !== 'function') {
    window.fMoney = function(num) { 
        return '$' + parseFloat(num || 0).toFixed(2); 
    };
}

if (typeof window.showToast !== 'function') {
    window.showToast = function(msg, isError = false) {
        const toast = document.getElementById('toastNotification'); 
        if(!toast) return;
        toast.style.background = isError ? 'var(--danger)' : 'var(--success)'; 
        toast.innerHTML = msg; 
        toast.style.display = 'block'; 
        toast.style.opacity = '1'; 
        setTimeout(() => { 
            toast.style.opacity = '0'; 
            setTimeout(() => toast.style.display = 'none', 300); 
        }, 2000);
    };
}

if (typeof window.playBeep !== 'function') {
    window.playBeep = function() { 
        if(window.sysSettings && window.sysSettings.enableSound === false) return;
        try { 
            const ctx = typeof window.getSharedAudioContext === 'function' ? window.getSharedAudioContext() : null; 
            if(!ctx) return; 
            const osc = ctx.createOscillator(); 
            const gain = ctx.createGain(); 
            osc.connect(gain); 
            gain.connect(ctx.destination); 
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(850, ctx.currentTime); 
            gain.gain.setValueAtTime(0.05, ctx.currentTime); 
            osc.start(); 
            osc.stop(ctx.currentTime + 0.1); 
        } catch(e) {} 
    };
}

if (typeof window.playOrderSound !== 'function') {
    window.playOrderSound = function() {
        if(window.sysSettings && window.sysSettings.enableSound === false) return;
        try {
            const ctx = typeof window.getSharedAudioContext === 'function' ? window.getSharedAudioContext() : null;
            if(!ctx) return;
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(800, ctx.currentTime);
                    gain.gain.setValueAtTime(0.1, ctx.currentTime);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.2);
                }, i * 300);
            }
        } catch(e) {} 
    };
}

window.generateInvoiceId = function() {
    const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    let d = new Date(); 
    let todayStr = String(d.getFullYear()).slice(-2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    let prefix = `INV-${todayStr}-`;
    
    let maxSeq = 0;
    if (window.invoices && window.invoices.length > 0) {
        window.invoices.forEach(inv => {
            let id = inv.id || inv.invoiceNo || '';
            if (id.startsWith(prefix)) {
                let parts = id.split('-');
                if (parts.length >= 3) {
                    let seq = parseInt(parts[2]);
                    if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
                }
            }
        });
    }

    let counters = JSON.parse(localStorage.getItem(`ks2_${branchId}_invoice_counter`)) || { lastDate: '', seq: 0 };
    if (counters.lastDate === todayStr && counters.seq > maxSeq) {
        maxSeq = counters.seq;
    }
    
    let nextSeq = maxSeq + 1;
    counters.lastDate = todayStr;
    counters.seq = nextSeq;
    localStorage.setItem(`ks2_${branchId}_invoice_counter`, JSON.stringify(counters)); 
    
    let hh = String(d.getHours()).padStart(2, '0');
    let mm = String(d.getMinutes()).padStart(2, '0');
    let ss = String(d.getSeconds()).padStart(2, '0');
    
    return `${prefix}${String(nextSeq).padStart(3, '0')}-${hh}${mm}${ss}`;
};

// 🌟 ENTERPRISE: Activity Logs Sync To Dedicated Cloud Table
window.logAction = async function(type, itemName, qty, note, activeUserRef) { 
    if(!window.sysSettings || !window.sysSettings.logs) return; 
    let executor = activeUserRef ? (activeUserRef.fullName ? activeUserRef.fullName : activeUserRef.username) : 'system'; 
    let dateStr = typeof window.fDate === 'function' ? window.fDate() : new Date().toLocaleString('km-KH');
    if (!window.historyLog) window.historyLog = [];
    
    let logId = Date.now();
    let logNote = `${note} (${executor})`;

    window.historyLog.unshift({ id: logId, date: dateStr, type, itemName, qty, note: logNote }); 
    if(window.historyLog.length > 500) window.historyLog.pop(); 
    
    const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    localStorage.setItem(`ks2_${branchId}_hist_pro`, JSON.stringify(window.historyLog));
    
    if (window.supabaseClient && navigator.onLine) {
        try {
            window.supabaseClient.from('pos_history_logs').insert([{
                id: logId,
                branch_id: branchId,
                type: type,
                item_name: itemName,
                qty: qty,
                note: logNote,
                date: dateStr
            }]).then();
        } catch (err) {}
    }
};

// ==========================================
// 2. 🌐 FULL 3-LANGUAGE SYSTEM DICTIONARY
// ==========================================
window.sysI18n = {
    km: {
        navDash: '📊 ផ្ទាំងធំ',
        navInv: '📦 គ្រប់គ្រងស្តុក',
        navPos: '🛒 ប្រព័ន្ធលក់ (POS)',
        navCust: '👥 អតិថិជន',
        navUnpaid: '📝 វិក្កយបត្រ & ទូទាត់',
        navExp: '📉 ការចំណាយ',
        navHist: '📜 ប្រតិបត្តិការ',
        navSet: '⚙️ ការកំណត់',
        navAbout: 'ℹ️ អំពីប្រព័ន្ធ',
        navLogout: '🚪 ចាកចេញ (Logout)',
        pageDash: '📊 ផ្ទាំងព័ត៌មានទូទៅ (Dashboard)',
        pageInv: '📦 គ្រប់គ្រងស្តុក (Inventory)',
        pagePos: '🛒 ប្រព័ន្ធលក់ (Point of Sale)',
        pageCust: '👥 គ្រប់គ្រងអតិថិជន (Customers)',
        pageUnpaid: '📝 វិក្កយបត្រ & ទូទាត់ (Invoices)',
        pageExp: '📉 ការចំណាយ (Expenses)',
        pageHist: '📜 ប្រវត្តិប្រតិបត្តិការ (Activity Logs)',
        pageSet: '⚙️ ការកំណត់ប្រព័ន្ធ (Settings)',
        pageAbout: 'ℹ️ អំពីប្រព័ន្ធ (About & Version)',
        sidebarSub: 'ប្រព័ន្ធគ្រប់គ្រង ERP & POS',
        currAccTitle: 'គណនីបច្ចុប្បន្ន',
        adminUserText: '👤 អ្នកគ្រប់គ្រងប្រព័ន្ធ',
        syncing: 'កំពុង Sync...',
        syncedOk: 'ទិន្នន័យទាន់សម័យ',
        syncFail: 'Sync បរាជ័យ',

        dashBtnPos: '🛒 លក់ (POS)',
        dashBtnInv: '📦 ស្តុកទំនិញ',
        dashBtnUnpaid: '📝 វិក្កយបត្រ',
        dashBtnExp: '📉 ចំណាយ',
        dashBtnCust: '👥 អតិថិជន',
        lblDashDate: '📅 ជ្រើសរើសកាលបរិច្ឆេទបង្ហាញ៖ ',
        lblDashTo: 'ដល់',
        btnDashShowAll: 'បង្ហាញទាំងអស់',
        lblDashItems: 'មុខទំនិញសរុប (Items)',
        lblDashQty: 'ស្តុកសរុប (Total Qty)',
        lblDashRev: 'ចំណូលលក់បាន (Revenue)',
        lblDashExp: 'ចំណាយសរុប (Expenses)',
        lblDashPending: 'ប្រាក់រង់ចាំទូទាត់ (Pending)',
        lblDashProfit: 'ប្រាក់ចំណេញសុទ្ធ (Net Profit)',
        dashLowStockTitle: 'ជិតអស់ពីស្តុក (Low Stock Alert)',
        dashTopSellTitle: '🏆 ទំនិញលក់ដាច់ជាងគេ (Top Selling Items)',
        dashExpiryAlertTitle: '🚨 ថ្នាំ/ទំនិញជិតផុតកំណត់ (Expired / Near Expiry Alert)',
        btnToggleSection: '🔽 បិទ/បើក',
        btnViewItem: 'មើល',
        thRank: 'ចំណាត់ថ្នាក់',
        thProdName: 'ឈ្មោះទំនិញ',
        thSoldQty: 'ចំនួនលក់បាន',
        thTotalRev: 'ចំណូលសរុប',
        rank1: '🥇 លេខ ១',
        rank2: '🥈 លេខ ២',
        rank3: '🥉 លេខ ៣',
        rankN: 'លេខ ',
        noLowStock: 'មិនមានទំនិញជិតអស់ទេ',
        noTopSell: 'មិនទាន់មានទិន្នន័យលក់ទេ',
        thLowName: 'ឈ្មោះទំនិញ',
        thLowCat: 'ប្រភេទ',
        thLowQty: 'ស្តុកនៅសល់',
        thLowAction: 'សកម្មភាព',
        statusExpired: '❌ ផុតកំណត់ហើយ',
        statusNearExpiry: '⚠️ សល់ ',
        daysUnit: ' ថ្ងៃទៀត',

        searchInvPlh: '🔍 ស្វែងរកទូទៅ (លេខកូដ, ឈ្មោះ)...',
        allCats: 'គ្រប់ប្រភេទ',
        allStatus: 'គ្រប់ស្ថានភាពស្តុក',
        inStock: '✅ នៅមានស្តុក (>0)',
        outStock: '❌ អស់ស្តុក (0)',
        btnAddProd: '➕ បន្ថែមទំនិញ',
        btnImportCsv: '📥 Import Excel (CSV)',
        btnExportCsv: '📤 Export Excel (CSV)',
        thImg: 'រូបភាព',
        thNameCode: 'ឈ្មោះទំនិញ / Barcode',
        thCategory: 'ប្រភេទ',
        thPrice: 'តម្លៃលក់',
        thStock: 'ស្តុកនៅសល់',
        thAction: 'សកម្មភាព',
        tblSearchPlh: 'ស្វែងរក...',
        btnEdit: '✏️ កែប្រែ',
        btnDelete: '🗑️ លុប',
        unitBox: 'ប្រអប់ / Box',
        noInvData: 'មិនមានទិន្នន័យ',

        searchPosPlh: '🔍 ស្វែងរក ឬ ស្កេនបាកូដ រួចចុច Enter...',
        allCategoryTab: 'ទាំងអស់ (All)',
        cartHeader: '🛒 កន្ត្រកទំនិញ',
        cartEmpty: 'កន្ត្រកទទេ',
        cartClear: '🗑️ បោះបង់',
        lblSeller: 'អ្នកលក់ (Seller):',
        lblRate: 'អត្រាប្តូរប្រាក់ (Rate):',
        lblTotalQty: 'សរុបចំនួន (Qty):',
        lblDiscount: 'បញ្ចុះតម្លៃ:',
        lblTax: 'ពន្ធអាករ:',
        lblGrandTotal: 'សរុបទឹកប្រាក់:',
        custNamePlh: 'ឈ្មោះអតិថិជន (ចាំបាច់បើមិនទាន់ទូទាត់)',
        custPhonePlh: 'លេខទូរស័ព្ទ (ជាជម្រើស)',
        btnPreorder: '📝 កក់ប្រាក់',
        btnUnpaid: '📝 រង់ចាំទូទាត់',
        btnPaid: '💰 ទូទាត់រួច',
        cartToggleTxt: 'ផ្ទាំងគិតលុយ (Checkout)',
        cartTogglePrefix: 'បង្រួម/ពង្រីក ផ្ទាំងគិតលុយ',
        itemsCountSuffix: 'មុខ',

        searchUnpaidPlh: '🔍 ស្វែងរកទូទៅ...',
        btnExportInv: '📥 ទាញយក (Excel)',
        thInvCode: 'លេខវិក្កយបត្រ',
        thInvDate: 'កាលបរិច្ឆេទ',
        thInvCust: 'ឈ្មោះអតិថិជន',
        thInvItems: 'ទំនិញ',
        thInvTotal: 'សរុប',
        thInvStatus: 'ស្ថានភាព',
        thInvSeller: 'អ្នកលក់',
        lblSumPaid: 'សរុបទូទាត់រួចក្នុងតារាង: ',
        lblSumUnpaid: 'សរុបរង់ចាំទូទាត់ក្នុងតារាង: ',

        searchExpPlh: '🔍 ស្វែងរកការចំណាយ...',
        btnAddExp: '➕ កត់ត្រាចំណាយថ្មី',
        thExpDate: 'កាលបរិច្ឆេទ',
        thExpCat: 'ចំណាត់ថ្នាក់ (Category)',
        thExpAmount: 'ទឹកប្រាក់ចំណាយ',
        thExpNote: 'បរិយាយ / ចំណាំ',
        lblSumExp: 'សរុបប្រាក់ចំណាយទាំងអស់ក្នុងតារាង: ',

        searchCustPlh: '🔍 ស្វែងរកទូទៅ...',
        btnAddCust: '➕ បន្ថែមអតិថិជន',
        btnExportJson: '📤 Export JSON',
        btnImportJson: '📥 Import JSON',
        thCustName: 'ឈ្មោះអតិថិជន',
        thCustPhone: 'លេខទូរស័ព្ទ',
        thCustPaid: 'សរុបទិញ (Paid)',
        thCustUnpaid: 'រង់ចាំទូទាត់ (Unpaid)',
        noCustData: 'មិនមានអតិថិជនទេ',

        searchHistPlh: '🔍 ស្វែងរកទូទៅ...',
        btnClearHist: '🗑️ លុបប្រវត្តិទាំងអស់',
        thHistDate: 'កាលបរិច្ឆេទ',
        thHistAction: 'សកម្មភាព',
        thHistTarget: 'ឈ្មោះទំនិញ/អតិថិជន',
        thHistCat: 'ប្រភេទ',
        thHistQty: 'ចំនួន',
        thHistNote: 'ចំណាំ',
        noHistData: 'មិនមានប្រវត្តិទិន្នន័យតាមការស្វែងរកទេ',
        logSale: 'លក់ចេញ',
        logAdd: 'នាំចូលថ្មី/បន្ថែម',
        logUpdate: 'កែប្រែទិន្នន័យ',

        setAppearanceTitle: '🎨 ការកំណត់រូបរាង និងពណ៌ (Appearance & Colors)',
        setThemeModeLabel: 'ពណ៌ផ្ទៃខាងក្រោយ (Theme Mode):',
        btnThemeDark: '🌙 ងងឹត (Dark)',
        btnThemeLight: '☀️ ភ្លឺ (Light)',
        setAccentLabel: 'ពណ៌គោល (Accent Color):',
        setCustomColorLabel: 'ជ្រើសរើសពណ៌ផ្សេង:',
        setSpecialFeaturesTitle: '📦 មុខងារទំនិញ និងការលក់ពិសេស',
        setConditionLabel: 'ស្ថានភាពទំនិញ (Item Condition): សម្រាប់បញ្ជាក់ពីគុណភាព Figure (ឧ. MISB, Loose)។',
        setConditionHint: '(សរសេរស្ថានភាពដោយខណ្ឌដោយសញ្ញាក្បៀស ",")',
        setExpiryLabel: 'កាលបរិច្ឆេទផុតកំណត់ (Expiry Date): បើកមុខងារកត់ត្រាថ្ងៃផុតកំណត់ និងប្រព័ន្ធផ្ដល់ដំណឹង (Alert)។',
        setPreorderLabel: 'ប្រព័ន្ធកក់ប្រាក់ (Pre-order): អនុញ្ញាតឲ្យកត់ត្រាការកក់ប្រាក់សម្រាប់ទំនិញមិនទាន់ចូលស្តុក។',
        setDeliveryFeeLabel: 'ថ្លៃសេវាដឹកជញ្ជូនទូទៅ (Default Delivery Fee):',
        setUserMgmtTitle: '👥 គ្រប់គ្រងគណនីបុគ្គលិក (User Management)',
        setUserMgmtSub: 'បង្កើត លុប ឬកែប្រែគណនី និងកំណត់សិទ្ធិ (Role) ឱ្យបុគ្គលិកប្រើប្រាស់។',
        btnAddNewUser: '➕ បង្កើតគណនីថ្មី',
        thUserFullName: 'ឈ្មោះពេញ',
        thUserLogin: 'ឈ្មោះ Login',
        thUserRole: 'សិទ្ធិប្រើប្រាស់',
        thUserPin: 'លេខ PIN',
        allRolesFilter: 'ទាំងអស់',
        cantDeleteAdmin: 'មិនអាចលុប',
        setSysTitle: '⚙️ ការកំណត់ប្រព័ន្ធ (System Settings)',
        setSysSub: 'កំណត់មុខងារ (Modules) ណាខ្លះដែលអ្នកចង់បង្ហាញ ឬលាក់។',
        setStorePinLabel: '🔐 លេខកូដសម្ងាត់ហាង (Store PIN - ៤ ខ្ទង់)៖',
        setTickerNewsLabel: '📢 អក្សររត់ជូនដំណឹងលើ Welcome Screen (News Ticker)៖',
        setCustLabel: 'អតិថិជន (Customers): អនុញ្ញាតឲ្យកត់ត្រា និងគ្រប់គ្រងទិន្នន័យអតិថិជន។',
        setUnpaidLabel: 'រង់ចាំទូទាត់ (Unpaid Invoices): អនុញ្ញាតឲ្យរក្សាទុកវិក្កយបត្រមិនទាន់ទូទាត់។',
        setLogsLabel: 'ប្រវត្តិប្រតិបត្តិការ (Logs): កត់ត្រារាល់សកម្មភាព។',
        setCostLabel: 'តម្លៃដើម (Cost Price): អនុញ្ញាតឲ្យវាយបញ្ចូលតម្លៃដើម។',
        setDiscountLabel: 'ការបញ្ចុះតម្លៃ (Discount): បង្ហាញប្រអប់បញ្ចុះតម្លៃ។',
        setShowSellerLabel: 'បង្ហាញឈ្មោះអ្នកលក់ (Show Seller): បង្ហាញឈ្មោះបុគ្គលិកនៅលើផ្ទាំង POS។',
        setTaxLabel: 'ពន្ធអាករ (TAX/VAT): គិតពន្ធលើការលក់ ចំនួន',
        setChgPassTitle: '🔐 ផ្លាស់ប្តូរលេខកូដសម្ងាត់គណនីរបស់អ្នក',
        lblOldPass: 'លេខកូដចាស់ (Old Password):',
        lblNewPass: 'លេខកូដថ្មី (New Password):',
        btnChgPass: '🔄 ផ្លាស់ប្តូរលេខកូដ',

        modalNewUserTitle: '👤 បង្កើតគណនីបុគ្គលិកថ្មី',
        modalEditUserTitle: '👤 កែប្រែគណនីបុគ្គលិក',
        lblNuFullName: 'ឈ្មោះពេញ (Full Name):',
        plhNuFullName: 'ឧ. កញ្ញា ស្រីនាថ',
        lblNuUsername: 'ឈ្មោះ Login (Username):',
        plhNuUsername: 'ឧ. staff01',
        lblNuPass: 'លេខកូដសម្ងាត់ (Password):',
        lblNuPin: 'លេខ PIN សម្រាប់សង្គ្រោះគណនី (Recovery PIN):',
        lblNuRole: 'សិទ្ធិប្រើប្រាស់ (Role):',
        optRoleSales: '🛒 ផ្នែកលក់ (Sales) - អាចចូលបានតែ POS ប៉ុណ្ណោះ',
        optRoleWarehouse: '📦 ផ្នែកឃ្លាំង (Warehouse) - អាចចូលមើលនិងបន្ថែមស្តុក',
        optRoleManager: '💼 មេការ (Manager) - អាចចូលលក់ មើលស្តុក និងរបាយការណ៍',
        optRoleAdmin: '👑 អ្នកគ្រប់គ្រង (Admin) - មានសិទ្ធិពេញលេញ',
        lblAdminConfirm: '🔒 បញ្ជាក់លេខកូដ Admin របស់អ្នក:',
        plhAdminConfirm: 'បញ្ចូលលេខកូដ Admin ដើម្បីយល់ព្រម',
        btnSaveUser: 'រក្សាទុកគណនី',

        modalNewProductTitle: '➕ ទំនិញថ្មី',
        modalEditProductTitle: '✏️ កែប្រែទំនិញ',
        lblPName: 'ឈ្មោះទំនិញ *',
        lblPCat: 'ប្រភេទ (Category)',
        lblPCost: 'តម្លៃដើម (Cost) $',
        lblPPrice: 'តម្លៃលក់ (Price) $',
        lblPRiel: 'តម្លៃលក់ (Riel ៛)',
        lblPBarcode: 'លេខកូដ / Barcode',
        btnAutoBarcode: '✨ បង្កើតកូដស្វ័យប្រវត្តិ',
        plhBarcode: 'ស្កេន ឬ ដាក់លេខកូដ...',
        lblPUnit: 'ខ្នាត/ឯកតា (Unit)',
        plhPUnit: 'ឧ. កេះ, បេ',
        lblPCondition: 'ស្ថានភាពទំនិញ (Condition)',
        optConditionSelect: '-- ជ្រើសរើស --',
        lblPExpiry: 'ថ្ងៃផុតកំណត់ (Expiry Date) *',
        lblPQty: 'ចំនួនស្តុក (Qty)',
        lblPDesc: 'ការពណ៌នា',
        lblPImage: 'រូបភាព (URL ឬ ចុចអាប់ឡូត)',
        plhPImage: 'URL រូបភាព...',
        btnSelectImg: '📸 ជ្រើសរើស',

        checkoutModalTitle: '💵 ទូទាត់ប្រាក់ (Checkout)',
        lblGrandTotalCheckout: 'សរុបប្រាក់ត្រូវបង់ (Grand Total):',
        lblReceivedUsd: 'ប្រាក់ទទួល ($):',
        lblReceivedRiel: 'ប្រាក់ទទួល (៛):',
        lblChangeCheckout: 'ប្រាក់អាប់ (Change):',
        btnConfirmCheckout: '✅ បញ្ជាក់ការទូទាត់',

        modalShopTitle: '✏️ ប្តូរឈ្មោះហាង និង Logo',
        lblShopName: 'ឈ្មោះហាង:',
        plhShopName: 'វាយឈ្មោះហាងនៅទីនេះ...',
        lblShopPhone: 'លេខទូរស័ព្ទហាង:',
        lblShopPhonePlh: 'ឧ. 012 345 678',
        lblShopAddress: 'អាសយដ្ឋានហាង:',
        lblShopAddressPlh: 'ឧ. ផ្ទះលេខ ១, ផ្លូវ ០០...',
        lblShopLogo: 'ឡូហ្គោហាង:',
        lblShopQr: 'QR ទូទាត់ប្រាក់:',
        btnUploadLogo: '📸 ឡូហ្គោ',
        btnUploadQr: '📷 QR Code',
        lblTelegramTitle: '🤖 ការកំណត់ Telegram អតិថិជន:',
        plhTelegramUser: 'Telegram Username (ឧ. Jheng6912)',
        plhTelegramToken: 'Bot Token សម្រាប់ការលោតសារ',
        plhTelegramChatId: 'Chat ID សម្រាប់ទទួលសារ',
        btnCancel: 'បោះបង់',
        btnSave: 'រក្សាទុក',
        btnConfirmOk: 'យល់ព្រម',
        confirmDeleteTitle: 'បញ្ជាក់ការលុប',
        confirmNoticeTitle: 'ជូនដំណឹង',
        confirmClearCart: 'តើអ្នកពិតជាចង់លុបទំនិញទាំងអស់ចេញពីកន្ត្រកមែនទេ?',
        msgEmptyCart: 'គ្មានទំនិញក្នុងកន្ត្រកទេ!',
        msgRequireCust: 'សូមបញ្ចូលឈ្មោះអតិថិជនសិន!',
        custHistTitle: '🛍️ ប្រវត្តិទិញរបស់: ',
        custHistEmpty: 'អតិថិជននេះមិនទាន់មានប្រវត្តិទិញទេ',
        btnClose: 'បិទ',
        logoutTitle: 'បញ្ជាក់ការចាកចេញ',
        logoutConfirm: 'តើអ្នកពិតជាចង់ចាកចេញពីប្រព័ន្ធមែនទេ?',
        errInvalidPin: 'ឈ្មោះ ឬ លេខ PIN សម្ងាត់មិនត្រឹមត្រូវទេ!',
        errNoPermission: 'គ្មានសិទ្ធិ',
        errAdminOnlyLogo: 'មានតែគណនី Admin ប៉ុណ្ណោះដែលអាចប្តូរឈ្មោះ និង Logo បាន!',
        successTitle: 'ជោគជ័យ',
        msgShopSaved: 'ព័ត៌មានហាងត្រូវបានរក្សាទុកដោយជោគជ័យ! សូម Refresh ទំព័រ (F5) ដើម្បីឱ្យវាដំណើរការពេញលេញ។',
        msgSaveProductRequired: 'សូមបញ្ចូលឈ្មោះ និងតម្លៃលក់ (យ៉ាងហោចណាស់ ដុល្លារ ឬ រៀល)!',
        
        modalEditCustomerTitle: '✏️ កែប្រែព័ត៌មានអតិថិជន',
        modalNewCustomerTitle: '➕ អតិថិជនថ្មី',
        msgCustomerSaved: 'ព័ត៌មានអតិថិជនត្រូវបានរក្សាទុក!',
        confirmDeleteCustomer: 'តើអ្នកពិតជាចង់លុបអតិថិជននេះមែនទេ?',
        lblSumPaidTable: 'សរុបទូទាត់រួចក្នុងតារាង: ',
        lblSumUnpaidTable: 'សរុបរង់ចាំទូទាត់ក្នុងតារាង: ',
        lblSumExpenseTable: 'សរុបប្រាក់ចំណាយទាំងអស់ក្នុងតារាង: ',
        dashBtnHist: '📜 ប្រតិបត្តិការ',
        setEnableSoundLabel: '<strong style="color:var(--text-main);">🔊 បន្លឺសំឡេង (Enable Sound):</strong> បើកសំឡេង "ទីត!" ពេលស្កេន ឬចុចទំនិញចូលកន្ត្រក។',
        setReceiptFooterLabel: '📝 សារខាងក្រោមវិក្កយបត្រ (Receipt Footer Text)៖',
        setReceiptSizeLabel: '🖨️ ទំហំក្រដាសវិក្កយបត្រ (ព្រីន & ទាញយករូប)៖',
        setQuickToolsTitle: '🛠️ ឧបករណ៍ជំនួយពិសេស & ម៉ឺនុយឌីជីថល (Quick Tools) 🔒',
        btnUnlock: '🔓 ដោះសោ',
        lblCostShort: 'ដើម:',
        lblSellShort: 'លក់:',
        noDesc: 'មិនមានការពណ៌នា',
        thExpiry: 'កាលបរិច្ឆេទផុតកំណត់',
        noPosItems: 'មិនមានទំនិញទេ',
        lblOutStock: '❌ អស់ស្តុក',
        lblStockLeft: '📦 សល់:',
        btnAddShort: '➕ បន្ថែម',
        noInvRecords: 'មិនមានទិន្នន័យវិក្កយបត្រទេ',
        noExpRecords: 'មិនមានទិន្នន័យចំណាយទេ',
        stPaid: 'ទូទាត់រួច',
        stReady: 'រួចរាល់',
        stPreorder: 'កក់មុន',
        stUnpaid: 'រង់ចាំទូទាត់',
        btnViewShort: '👁️ មើល',
        btnPayShort: '💸 ទូទាត់',
        btnReadyShort: '📢 រួចរាល់',
        btnMarkDone: '✅ ធ្វើរួច',
        btnUndoDone: '❌ ដកចេញ',
        btnPrevPage: '◀ មុន',
        btnNextPage: 'បន្ទាប់ ▶',
        lblPage: 'ទំព័រ',
        lblOf: 'នៃ',
        lblTotalCount: 'សរុប',
        btnZReport: '🖨️ បោះពុម្ពរបាយការណ៍បិទបញ្ជី (Z-Report)',
        lblAboutLicense: '🔑 ព័ត៌មានសិទ្ធិប្រើប្រាស់ (License Status)',
        lblAboutBackup: '💾 គ្រប់គ្រងទិន្នន័យ (Backup & Restore All)',
        btnBackupAll: '💾 Backup ទិន្នន័យទាំងអស់',
        btnRestoreAll: '📂 Restore បញ្ចូលទិន្នន័យវិញ',
        confirmClearHistory: 'តើអ្នកពិតជាចង់លុបប្រវត្តិប្រតិបត្តិការទាំងអស់មែនទេ?'
    },
    en: {
        navDash: '📊 Dashboard',
        navInv: '📦 Inventory',
        navPos: '🛒 Point of Sale',
        navCust: '👥 Customers',
        navUnpaid: '📝 Invoices & Paid',
        navExp: '📉 Expenses',
        navHist: '📜 Activity Logs',
        navSet: '⚙️ Settings',
        navAbout: 'ℹ️ About System',
        navLogout: '🚪 Logout',
        pageDash: '📊 Dashboard Overview',
        pageInv: '📦 Inventory Management',
        pagePos: '🛒 Point of Sale (POS)',
        pageCust: '👥 Customer Management',
        pageUnpaid: '📝 Invoices & Payments',
        pageExp: '📉 Expense Tracker',
        pageHist: '📜 Activity Logs',
        pageSet: '⚙️ System Settings',
        pageAbout: 'ℹ️ About & Version Info',
        sidebarSub: 'ERP & POS System',
        currAccTitle: 'Current Account',
        adminUserText: '👤 Administrator',
        syncing: 'Syncing...',
        syncedOk: 'Up to date',
        syncFail: 'Sync Failed',

        dashBtnPos: '🛒 POS Sales',
        dashBtnInv: '📦 Stock',
        dashBtnUnpaid: '📝 Invoices',
        dashBtnExp: '📉 Expenses',
        dashBtnCust: '👥 Customers',
        lblDashDate: '📅 Select Date Range: ',
        lblDashTo: 'to',
        btnDashShowAll: 'Show All',
        lblDashItems: 'Total Items',
        lblDashQty: 'Total Qty in Stock',
        lblDashRev: 'Total Revenue',
        lblDashExp: 'Total Expenses',
        lblDashPending: 'Pending Payment',
        lblDashProfit: 'Net Profit',
        dashLowStockTitle: 'Low Stock Alert',
        dashTopSellTitle: '🏆 Top Selling Items',
        dashExpiryAlertTitle: '🚨 Expired / Near Expiry Alert',
        btnToggleSection: '🔽 Toggle',
        btnViewItem: 'View',
        thRank: 'Rank',
        thProdName: 'Product Name',
        thSoldQty: 'Sold Qty',
        thTotalRev: 'Total Revenue',
        rank1: '🥇 1st',
        rank2: '🥈 2nd',
        rank3: '🥉 3rd',
        rankN: 'No. ',
        noLowStock: 'No low stock items',
        noTopSell: 'No sales data yet',
        thLowName: 'Product Name',
        thLowCat: 'Category',
        thLowQty: 'Stock Left',
        thLowAction: 'Action',
        statusExpired: '❌ Expired',
        statusNearExpiry: '⚠️ ',
        daysUnit: ' days left',

        searchInvPlh: '🔍 Search product name, SKU...',
        allCats: 'All Categories',
        allStatus: 'All Stock Status',
        inStock: '✅ In Stock (>0)',
        outStock: '❌ Out of Stock (0)',
        btnAddProd: '➕ Add Product',
        btnImportCsv: '📥 Import Excel (CSV)',
        btnExportCsv: '📤 Export Excel (CSV)',
        thImg: 'Image',
        thNameCode: 'Product Name / Barcode',
        thCategory: 'Category',
        thPrice: 'Price',
        thStock: 'Stock',
        thAction: 'Actions',
        tblSearchPlh: 'Search...',
        btnEdit: '✏️ Edit',
        btnDelete: '🗑️ Delete',
        unitBox: 'Box',
        noInvData: 'No data available',

        searchPosPlh: '🔍 Search product or scan barcode...',
        allCategoryTab: 'All',
        cartHeader: '🛒 Shopping Cart',
        cartEmpty: 'No items in cart',
        cartClear: '🗑️ Clear',
        lblSeller: 'Seller:',
        lblRate: 'Exchange Rate:',
        lblTotalQty: 'Total Qty:',
        lblDiscount: 'Discount:',
        lblTax: 'Tax (VAT):',
        lblGrandTotal: 'Grand Total:',
        custNamePlh: 'Customer Name (Required for Unpaid)',
        custPhonePlh: 'Phone Number (Optional)',
        btnPreorder: '📝 Pre-order',
        btnUnpaid: '📝 Unpaid',
        btnPaid: '💰 Paid Now',
        cartToggleTxt: 'Checkout Panel',
        cartTogglePrefix: 'Toggle Checkout Panel',
        itemsCountSuffix: 'items',

        searchUnpaidPlh: '🔍 Search invoices...',
        btnExportInv: '📥 Export (Excel)',
        thInvCode: 'Invoice ID',
        thInvDate: 'Date',
        thInvCust: 'Customer Name',
        thInvItems: 'Items',
        thInvTotal: 'Total',
        thInvStatus: 'Status',
        thInvSeller: 'Seller',
        lblSumPaid: 'Total Paid in Table: ',
        lblSumUnpaid: 'Total Unpaid in Table: ',

        searchExpPlh: '🔍 Search expenses...',
        btnAddExp: '➕ Record New Expense',
        thExpDate: 'Date',
        thExpCat: 'Category',
        thExpAmount: 'Amount',
        thExpNote: 'Description / Note',
        lblSumExp: 'Total Expenses in Table: ',

        searchCustPlh: '🔍 Search customers...',
        btnAddCust: '➕ Add Customer',
        btnExportJson: '📤 Export JSON',
        btnImportJson: '📥 Import JSON',
        thCustName: 'Customer Name',
        thCustPhone: 'Phone Number',
        thCustPaid: 'Total Purchases (Paid)',
        thCustUnpaid: 'Pending (Unpaid)',
        noCustData: 'No customers found',

        searchHistPlh: '🔍 Search activity logs...',
        btnClearHist: '🗑️ Clear All Logs',
        thHistDate: 'Date',
        thHistAction: 'Action',
        thHistTarget: 'Item / Customer Name',
        thHistCat: 'Category',
        thHistQty: 'Qty',
        thHistNote: 'Note',
        noHistData: 'No history records found',
        logSale: 'Sale Order',
        logAdd: 'New/Added Stock',
        logUpdate: 'Update Data',

        setAppearanceTitle: '🎨 Appearance & Theme Colors',
        setThemeModeLabel: 'Theme Mode:',
        btnThemeDark: '🌙 Dark Mode',
        btnThemeLight: '☀️ Light Mode',
        setAccentLabel: 'Accent Color:',
        setCustomColorLabel: 'Custom Color:',
        setSpecialFeaturesTitle: '📦 Special Product & Sales Features',
        setConditionLabel: 'Item Condition: Enable condition tracking (e.g. MISB, Loose).',
        setConditionHint: '(Separate conditions with commas ",")',
        setExpiryLabel: 'Expiry Date: Enable expiration tracking and alert warnings.',
        setPreorderLabel: 'Pre-order System: Allow recording advance deposits for incoming items.',
        setDeliveryFeeLabel: 'Default Delivery Fee:',
        setUserMgmtTitle: '👥 Staff & User Management',
        setUserMgmtSub: 'Create, edit, or manage roles and permissions for staff accounts.',
        btnAddNewUser: '➕ Add New User',
        thUserFullName: 'Full Name',
        thUserLogin: 'Login Username',
        thUserRole: 'Role',
        thUserPin: 'PIN Code',
        allRolesFilter: 'All Roles',
        cantDeleteAdmin: 'Cannot Delete',
        setSysTitle: '⚙️ System Settings',
        setSysSub: 'Toggle display for specific application modules and functions.',
        setStorePinLabel: '🔐 Store PIN (4 Digits):',
        setTickerNewsLabel: '📢 Bottom Marquee Notice (News Ticker):',
        setCustLabel: 'Customers: Enable customer records and profile management.',
        setUnpaidLabel: 'Unpaid Invoices: Allow storing pending credit invoices.',
        setLogsLabel: 'Activity Logs: Record all inventory and sales operations.',
        setCostLabel: 'Cost Price: Enable entering original product cost.',
        setDiscountLabel: 'Discount: Display discount options on checkout.',
        setShowSellerLabel: 'Show Seller: Display staff seller name on POS screen.',
        setTaxLabel: 'Tax (TAX/VAT): Apply sales tax rate of',
        setChgPassTitle: '🔐 Change Your Account Password',
        lblOldPass: 'Old Password:',
        lblNewPass: 'New Password:',
        btnChgPass: '🔄 Update Password',

        modalNewUserTitle: '👤 Create New Staff Account',
        modalEditUserTitle: '👤 Edit Staff Account',
        lblNuFullName: 'Full Name:',
        plhNuFullName: 'e.g. Seryneath Tang',
        lblNuUsername: 'Login Username:',
        plhNuUsername: 'e.g. staff01',
        lblNuPass: 'Password:',
        lblNuPin: 'Recovery PIN Code:',
        lblNuRole: 'Role:',
        optRoleSales: '🛒 Sales - POS Access Only',
        optRoleWarehouse: '📦 Warehouse - Inventory Access',
        optRoleManager: '💼 Manager - POS, Inventory & Reports',
        optRoleAdmin: '👑 Administrator - Full Access',
        lblAdminConfirm: '🔒 Confirm Your Admin Password:',
        plhAdminConfirm: 'Enter Admin password to confirm',
        btnSaveUser: 'Save Account',

        modalNewProductTitle: '➕ New Product',
        modalEditProductTitle: '✏️ Edit Product',
        lblPName: 'Product Name *',
        lblPCat: 'Category',
        lblPCost: 'Cost Price ($)',
        lblPPrice: 'Selling Price ($)',
        lblPRiel: 'Price (Riel ៛)',
        lblPBarcode: 'Barcode / SKU',
        btnAutoBarcode: '✨ Auto Barcode',
        plhBarcode: 'Scan or enter barcode...',
        lblPUnit: 'Unit',
        plhPUnit: 'e.g. Box, Pcs',
        lblPCondition: 'Item Condition',
        optConditionSelect: '-- Select --',
        lblPExpiry: 'Expiry Date *',
        lblPQty: 'Stock Quantity (Qty)',
        lblPDesc: 'Description',
        lblPImage: 'Product Image (URL or Upload)',
        plhPImage: 'Image URL...',
        btnSelectImg: '📸 Select',

        checkoutModalTitle: '💵 Checkout Payment',
        lblGrandTotalCheckout: 'Grand Total to Pay:',
        lblReceivedUsd: 'Received ($):',
        lblReceivedRiel: 'Received (៛):',
        lblChangeCheckout: 'Change:',
        btnConfirmCheckout: '✅ Confirm Payment',

        modalShopTitle: '✏️ Edit Shop Profile & Logo',
        lblShopName: 'Shop Name:',
        plhShopName: 'Enter shop name...',
        lblShopPhone: 'Shop Phone:',
        lblShopPhonePlh: 'e.g. 012 345 678',
        lblShopAddress: 'Shop Address:',
        lblShopAddressPlh: 'e.g. Street 00, Phnom Penh...',
        lblShopLogo: 'Shop Logo:',
        lblShopQr: 'Payment QR Code:',
        btnUploadLogo: '📸 Logo',
        btnUploadQr: '📷 QR Code',
        lblTelegramTitle: '🤖 Customer Telegram Settings:',
        plhTelegramUser: 'Telegram Username (e.g. Jheng6912)',
        plhTelegramToken: 'Bot Token for notifications',
        plhTelegramChatId: 'Chat ID to receive alerts',
        btnCancel: 'Cancel',
        btnSave: 'Save',
        btnConfirmOk: 'Confirm',
        confirmDeleteTitle: 'Confirm Action',
        confirmNoticeTitle: 'Notice',
        confirmClearCart: 'Are you sure you want to clear all items in the cart?',
        msgEmptyCart: 'The cart is currently empty!',
        msgRequireCust: 'Please enter customer name first!',
        custHistTitle: '🛍️ Purchase History of: ',
        custHistEmpty: 'This customer has no purchase history yet',
        btnClose: 'Close',
        logoutTitle: 'Confirm Logout',
        logoutConfirm: 'Are you sure you want to log out from the system?',
        errInvalidPin: 'Invalid Username or PIN Code!',
        errNoPermission: 'Access Denied',
        errAdminOnlyLogo: 'Only Admin account can change shop name and logo!',
        successTitle: 'Success',
        msgShopSaved: 'Shop info saved successfully! Please refresh the page (F5) to apply changes fully.',
        msgSaveProductRequired: 'Please enter product name and selling price (at least Dollar or Riel)!',

        modalEditCustomerTitle: '✏️ Edit Customer Info',
        modalNewCustomerTitle: '➕ New Customer',
        msgCustomerSaved: 'Customer information saved successfully!',
        confirmDeleteCustomer: 'Are you sure you want to delete this customer?',
        lblSumPaidTable: 'Total Paid in Table: ',
        lblSumUnpaidTable: 'Total Unpaid in Table: ',
        lblSumExpenseTable: 'Total Expenses in Table: ',
        dashBtnHist: '📜 Logs',
        setEnableSoundLabel: '<strong style="color:var(--text-main);">🔊 Enable Sound:</strong> Play beep sound on scan or adding items.',
        setReceiptFooterLabel: '📝 Receipt Footer Text:',
        setReceiptSizeLabel: '🖨️ Receipt Paper Size (Print & PNG):',
        setQuickToolsTitle: '🛠️ Quick Tools & Digital Menu 🔒',
        btnUnlock: '🔓 Unlock',
        lblCostShort: 'Cost:',
        lblSellShort: 'Price:',
        noDesc: 'No description',
        thExpiry: 'Expiry Date',
        noPosItems: 'No products found',
        lblOutStock: '❌ Out of Stock',
        lblStockLeft: '📦 Left:',
        btnAddShort: '➕ Add',
        noInvRecords: 'No invoices found',
        noExpRecords: 'No expense records found',
        stPaid: 'Paid',
        stReady: 'Ready',
        stPreorder: 'Pre-order',
        stUnpaid: 'Unpaid',
        btnViewShort: '👁️ View',
        btnPayShort: '💸 Pay',
        btnReadyShort: '📢 Ready',
        btnMarkDone: '✅ Done',
        btnUndoDone: '❌ Undo',
        btnPrevPage: '◀ Prev',
        btnNextPage: 'Next ▶',
        lblPage: 'Page',
        lblOf: 'of',
        lblTotalCount: 'Total',
        btnZReport: '🖨️ Print Z-Report',
        lblAboutLicense: '🔑 License Status',
        lblAboutBackup: '💾 Data Management (Backup & Restore All)',
        btnBackupAll: '💾 Backup All Data',
        btnRestoreAll: '📂 Restore Backup',
        confirmClearHistory: 'Are you sure you want to clear all activity logs?'
    },
    zh: {
        navDash: '📊 控制面板',
        navInv: '📦 库存管理',
        navPos: '🛒 收银前台',
        navCust: '👥 客户管理',
        navUnpaid: '📝 账单与结算',
        navExp: '📉 支出管理',
        navHist: '📜 操作记录',
        navSet: '⚙️ 系统设置',
        navAbout: 'ℹ️ 关于系统',
        navLogout: '🚪 退出登录',
        pageDash: '📊 综合控制台 (Dashboard)',
        pageInv: '📦 仓库库存管理 (Inventory)',
        pagePos: '🛒 收银前台系统 (POS)',
        pageCust: '👥 客户资料管理 (Customers)',
        pageUnpaid: '📝 账单明细与收款 (Invoices)',
        pageExp: '📉 财务支出记录 (Expenses)',
        pageHist: '📜 系统操作日志 (Logs)',
        pageSet: '⚙️ 系统通用设置 (Settings)',
        pageAbout: 'ℹ️ 关于系统与版本 (About)',
        sidebarSub: '智能 ERP & POS 管理系统',
        currAccTitle: '当前登录账户',
        adminUserText: '👤 系统管理员',
        syncing: '正在同步...',
        syncedOk: '数据已同步',
        syncFail: '同步失败',

        dashBtnPos: '🛒 前台收银',
        dashBtnInv: '📦 商品库存',
        dashBtnUnpaid: '📝 账单列表',
        dashBtnExp: '📉 财务支出',
        dashBtnCust: '👥 客户档案',
        lblDashDate: '📅 筛选数据展示日期范围：',
        lblDashTo: '至',
        btnDashShowAll: '显示全部',
        lblDashItems: '商品种类总数',
        lblDashQty: '库存总数量',
        lblDashRev: '营业收入总计',
        lblDashExp: '各项支出总计',
        lblDashPending: '待收账款总计',
        lblDashProfit: '净利润总计',
        dashLowStockTitle: '库存紧张预警 (Low Stock Alert)',
        dashTopSellTitle: '🏆 热销商品排行 (Top Selling Items)',
        dashExpiryAlertTitle: '🚨 临期/过期商品预警 (Expiry Alert)',
        btnToggleSection: '🔽 展开/收起',
        btnViewItem: '查看',
        thRank: '排名',
        thProdName: '商品名称',
        thSoldQty: '销量',
        thTotalRev: '销售额',
        rank1: '🥇 第一名',
        rank2: '🥈 第二名',
        rank3: '🥉 第三名',
        rankN: '第 ',
        noLowStock: '暂无库存紧张商品',
        noTopSell: '暂无销售数据',
        thLowName: '商品名称',
        thLowCat: '分类',
        thLowQty: '剩余库存',
        thLowAction: '操作',
        statusExpired: '❌ 已过期',
        statusNearExpiry: '⚠️ 剩余 ',
        daysUnit: ' 天',

        searchInvPlh: '🔍 搜索商品名称、条形码...',
        allCats: '全部分类',
        allStatus: '全部库存状态',
        inStock: '✅ 现货 (>0)',
        outStock: '❌ 缺货 (0)',
        btnAddProd: '➕ 添加商品',
        btnImportCsv: '📥 导入表格 (CSV)',
        btnExportCsv: '📤 导出表格 (CSV)',
        thImg: '图片',
        thNameCode: '商品名称 / 条形码',
        thCategory: '类别',
        thPrice: '售价',
        thStock: '剩余库存',
        thAction: '操作',
        tblSearchPlh: '搜索...',
        btnEdit: '✏️ 编辑',
        btnDelete: '🗑️ 删除',
        unitBox: '盒 / Box',
        noInvData: '暂无相关数据',

        searchPosPlh: '🔍 搜索商品或扫描条形码...',
        allCategoryTab: '全部 (All)',
        cartHeader: '🛒 购物车',
        cartEmpty: '购物车暂无商品',
        cartClear: '🗑️ 清空',
        lblSeller: '收银员:',
        lblRate: '当前汇率:',
        lblTotalQty: '商品总件数:',
        lblDiscount: '折扣优惠:',
        lblTax: '税费 (VAT):',
        lblGrandTotal: '应付总金额:',
        custNamePlh: '客户姓名 (挂账必填)',
        custPhonePlh: '联系电话 (选填)',
        btnPreorder: '📝 预定订金',
        btnUnpaid: '📝 挂账待付',
        btnPaid: '💰 立即结账',
        cartToggleTxt: '结账面板',
        cartTogglePrefix: '收起/展开 结账面板',
        itemsCountSuffix: '件商品',

        searchUnpaidPlh: '🔍 搜索账单...',
        btnExportInv: '📥 导出表格 (Excel)',
        thInvCode: '账单编号',
        thInvDate: '日期时间',
        thInvCust: '客户姓名',
        thInvItems: '购买商品',
        thInvTotal: '总计金额',
        thInvStatus: '结款状态',
        thInvSeller: '收银员',
        lblSumPaid: '表格已结款总计: ',
        lblSumUnpaid: '表格待收账款总计: ',

        searchExpPlh: '🔍 搜索支出记录...',
        btnAddExp: '➕ 记一笔新支出',
        thExpDate: '支出日期',
        thExpCat: '支出分类 (Category)',
        thExpAmount: '支出金额',
        thExpNote: '详情描述 / 备注',
        lblSumExp: '表格支出金额总计: ',

        searchCustPlh: '🔍 搜索客户姓名或电话...',
        btnAddCust: '➕ 添加新客户',
        btnExportJson: '📤 导出 JSON',
        btnImportJson: '📥 导入 JSON',
        thCustName: '客户姓名',
        thCustPhone: '联系电话',
        thCustPaid: '累计消费 (已付)',
        thCustUnpaid: '挂账欠款 (待付)',
        noCustData: '暂无客户数据',

        searchHistPlh: '🔍 搜索操作记录...',
        btnClearHist: '🗑️ 清空所有记录',
        thHistDate: '日期时间',
        thHistAction: '操作类型',
        thHistTarget: '商品 / 客户名称',
        thHistCat: '分类',
        thHistQty: '变动数量',
        thHistNote: '备注说明',
        noHistData: '未查询到相关操作记录',
        logSale: '销售出库',
        logAdd: '采购入库/新增',
        logUpdate: '修改数据',

        setAppearanceTitle: '🎨 外观与主题配色 (Appearance & Colors)',
        setThemeModeLabel: '主题模式 (Theme Mode):',
        btnThemeDark: '🌙 暗黑模式 (Dark)',
        btnThemeLight: '☀️ 明亮模式 (Light)',
        setAccentLabel: '主题强调色 (Accent Color):',
        setCustomColorLabel: '自定义颜色:',
        setSpecialFeaturesTitle: '📦 商品与销售特殊功能',
        setConditionLabel: '商品成色状态 (Item Condition): 标识手办品质 (如 MISB、散货 Loose)。',
        setConditionHint: '(多个成色请用逗号 "," 隔开)',
        setExpiryLabel: '保质期/过期日期 (Expiry Date): 启用过期与临期预警通知功能。',
        setPreorderLabel: '定金预定系统 (Pre-order): 支持未入库商品的预定与订金登记。',
        setDeliveryFeeLabel: '默认配送费金额 (Default Delivery Fee):',
        setUserMgmtTitle: '👥 员工账户管理 (User Management)',
        setUserMgmtSub: '添加、修改或分配员工的操作权限 (Role)。',
        btnAddNewUser: '➕ 创建新账户',
        thUserFullName: '真实姓名',
        thUserLogin: '登录账号',
        thUserRole: '操作权限',
        thUserPin: '安全 PIN 码',
        allRolesFilter: '全部权限',
        cantDeleteAdmin: '不可删除',
        setSysTitle: '⚙️ 系统模块设置 (System Settings)',
        setSysSub: '开启或隐藏系统中的特定业务功能模块。',
        setStorePinLabel: '🔐 店铺进门密码 (Store PIN 4位数)：',
        setTickerNewsLabel: '📢 底部滚动通知内容 (News Ticker)：',
        setCustLabel: '客户档案 (Customers): 启用客户资料管理。',
        setUnpaidLabel: '挂账账单 (Unpaid Invoices): 支持赊账待付订单。',
        setLogsLabel: '操作日志 (Logs): 记录各项进出库操作。',
        setCostLabel: '成本进价 (Cost Price): 允许输入商品成本。',
        setDiscountLabel: '折扣优惠 (Discount): 在收银台显示打折选项。',
        setShowSellerLabel: '显示收银员 (Show Seller): 收银台显示员工姓名。',
        setTaxLabel: '增值税税率 (TAX/VAT): 收银税率为',
        setChgPassTitle: '🔐 修改当前登录账户密码',
        lblOldPass: '原密码 (Old Password):',
        lblNewPass: '新密码 (New Password):',
        btnChgPass: '🔄 确认修改密码',

        modalNewUserTitle: '👤 创建新员工账户',
        modalEditUserTitle: '👤 编辑员工账户资料',
        lblNuFullName: '真实姓名 (Full Name):',
        plhNuFullName: '例如: 张三',
        lblNuUsername: '登录用户名 (Username):',
        plhNuUsername: '例如: staff01',
        lblNuPass: '登录密码 (Password):',
        lblNuPin: '安全恢复 PIN 码 (Recovery PIN):',
        lblNuRole: '分配操作权限 (Role):',
        optRoleSales: '🛒 销售员 (Sales) - 仅限收银前台',
        optRoleWarehouse: '📦 仓库员 (Warehouse) - 库存管理',
        optRoleManager: '💼 门店店长 (Manager) - 收银, 库存, 报表',
        optRoleAdmin: '👑 管理员 (Admin) - 完整最高权限',
        lblAdminConfirm: '🔒 请输入管理员密码确认：',
        plhAdminConfirm: '输入管理员密码以确认操作',
        btnSaveUser: '保存账户信息',

        modalNewProductTitle: '➕ 添加新商品',
        modalEditProductTitle: '✏️ 编辑商品信息',
        lblPName: '商品名称 *',
        lblPCat: '商品分类 (Category)',
        lblPCost: '成本进价 ($)',
        lblPPrice: '销售价格 ($)',
        lblPRiel: '瑞尔售价 (Riel ៛)',
        lblPBarcode: '商品条码 / SKU',
        btnAutoBarcode: '✨ 自动生成条码',
        plhBarcode: '扫描或输入条形码...',
        lblPUnit: '计量单位 (Unit)',
        plhPUnit: '例如: 盒, 件, 箱',
        lblPCondition: '商品成色 (Condition)',
        optConditionSelect: '-- 请选择 --',
        lblPExpiry: '保质/过期日期 *',
        lblPQty: '库存数量 (Qty)',
        lblPDesc: '商品详情描述',
        lblPImage: '商品图片 (链接或上传)',
        plhPImage: '图片 URL 链接...',
        btnSelectImg: '📸 选择本地图片',

        checkoutModalTitle: '💵 结账收款 (Checkout)',
        lblGrandTotalCheckout: '应收总额 (Grand Total):',
        lblReceivedUsd: '实收美金 ($):',
        lblReceivedRiel: '实收瑞尔 (៛):',
        lblChangeCheckout: '找零金额 (Change):',
        btnConfirmCheckout: '✅ 确认收款完成',

        modalShopTitle: '✏️ 修改店铺名称与标志',
        lblShopName: '店铺名称:',
        plhShopName: '在此输入店铺名称...',
        lblShopPhone: '联系电话:',
        lblShopPhonePlh: '例如: 012 345 678',
        lblShopAddress: '店铺地址:',
        lblShopAddressPlh: '例如: 00路，金边市...',
        lblShopLogo: '店铺Logo:',
        lblShopQr: '收款二维码 (QR):',
        btnUploadLogo: '📸 上传Logo',
        btnUploadQr: '📷 上传收款码',
        lblTelegramTitle: '🤖 客户 Telegram 通知设置:',
        plhTelegramUser: 'Telegram 用户名 (例如: Jheng6912)',
        plhTelegramToken: '用于发送通知的 Bot Token',
        plhTelegramChatId: '用于接收通知的 Chat ID',
        btnCancel: '取消',
        btnSave: '保存更改',
        btnConfirmOk: '确定',
        confirmDeleteTitle: '确认操作',
        confirmNoticeTitle: '系统提示',
        confirmClearCart: '您确定要清空购物车中的所有商品吗？',
        msgEmptyCart: '购物车为空，请先添加商品！',
        msgRequireCust: '请先输入客户姓名！',
        custHistTitle: '🛍️ 购买历史: ',
        custHistEmpty: '该客户暂无购买历史记录',
        btnClose: '关闭',
        logoutTitle: '确认退出',
        logoutConfirm: '您确定要退出登录吗？',
        errInvalidPin: '用户名或安全 PIN 码错误！',
        errNoPermission: '权限不足',
        errAdminOnlyLogo: '只有管理员账户才能修改店名和Logo！',
        successTitle: '成功',
        msgShopSaved: '店铺信息保存成功！请刷新页面 (F5) 以全面生效。',
        msgSaveProductRequired: '请输入商品名称和售价（美元或瑞尔至少填一项）！',

        modalEditCustomerTitle: '✏️ 编辑客户资料',
        modalNewCustomerTitle: '➕ 添加新客户',
        msgCustomerSaved: '客户信息保存成功！',
        confirmDeleteCustomer: '您确定要删除该客户吗？',
        lblSumPaidTable: '表格已结款总计: ',
        lblSumUnpaidTable: '表格待收账款总计: ',
        lblSumExpenseTable: '表格支出金额总计: ',
        dashBtnHist: '📜 操作记录',
        setEnableSoundLabel: '<strong style="color:var(--text-main);">🔊 启用提示音 (Enable Sound):</strong> 扫码或添加商品时播放提示音。',
        setReceiptFooterLabel: '📝 小票底部致谢语 (Receipt Footer):',
        setReceiptSizeLabel: '🖨️ 小票纸张尺寸 (打印与导出图片):',
        setQuickToolsTitle: '🛠️ 快捷工具与电子菜单 (Quick Tools) 🔒',
        btnUnlock: '🔓 解锁',
        lblCostShort: '成本:',
        lblSellShort: '售价:',
        noDesc: '暂无描述',
        thExpiry: '过期日期',
        noPosItems: '暂无商品',
        lblOutStock: '❌ 缺货',
        lblStockLeft: '📦 余:',
        btnAddShort: '➕ 添加',
        noInvRecords: '暂无账单记录',
        noExpRecords: '暂无支出记录',
        stPaid: '已结款',
        stReady: '已备好',
        stPreorder: '预定',
        stUnpaid: '待付款',
        btnViewShort: '👁️ 查看',
        btnPayShort: '💸 收款',
        btnReadyShort: '📢 备好',
        btnMarkDone: '✅ 完成',
        btnUndoDone: '❌ 撤销',
        btnPrevPage: '◀ 上一页',
        btnNextPage: '下一页 ▶',
        lblPage: '第',
        lblOf: '/',
        lblTotalCount: '共',
        btnZReport: '🖨️ 打印日结报表 (Z-Report)',
        lblAboutLicense: '🔑 授权状态信息 (License Status)',
        lblAboutBackup: '💾 数据备份与恢复 (Backup & Restore)',
        btnBackupAll: '💾 备份全部数据',
        btnRestoreAll: '📂 恢复备份数据',
        confirmClearHistory: '您确定要清空所有操作记录吗？'
    }
};

window.changeAppLanguage = function(lang) {
    localStorage.setItem('app_lang', lang);
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

    const setHtml = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };

    setHtml('nav-dashboard', `<i>📊</i> ${d.navDash ? d.navDash.replace('📊 ', '') : 'ផ្ទាំងធំ'}`);
    setHtml('nav-inventory', `<i>📦</i> ${d.navInv ? d.navInv.replace('📦 ', '') : 'គ្រប់គ្រងស្តុក'}`);
    setHtml('nav-pos', `<i>🛒</i> ${d.navPos ? d.navPos.replace('🛒 ', '') : 'ប្រព័ន្ធលក់ (POS)'}`);
    setHtml('nav-customers', `<i>👥</i> ${d.navCust ? d.navCust.replace('👥 ', '') : 'អតិថិជន'}`);
    setHtml('nav-unpaid', `<i>📝</i> ${d.navUnpaid ? d.navUnpaid.replace('📝 ', '') : 'វិក្កយបត្រ & ទូទាត់'}`);
    setHtml('nav-expenses', `<i>📉</i> ${d.navExp ? d.navExp.replace('📉 ', '') : 'ការចំណាយ'}`);
    setHtml('nav-history', `<i>📜</i> ${d.navHist ? d.navHist.replace('📜 ', '') : 'ប្រតិបត្តិការ'}`);
    setHtml('nav-settings', `<i>⚙️</i> ${d.navSet ? d.navSet.replace('⚙️ ', '') : 'ការកំណត់'}`);
    setHtml('nav-about', `<i>ℹ️</i> ${d.navAbout ? d.navAbout.replace('ℹ️ ', '') : 'អំពីប្រព័ន្ធ'}`);
    setHtml('nav-logout', `<i>🚪</i> ${d.navLogout ? d.navLogout.replace('🚪 ', '') : 'ចាកចេញ (Logout)'}`);

    const subTextEl = document.querySelector('.sidebar .sub-text');
    if (subTextEl) subTextEl.innerText = d.sidebarSub || 'ប្រព័ន្ធគ្រប់គ្រង ERP & POS';

    const userAccTitleEl = document.querySelector('.sidebar div[style*="font-size: var(--fs-12)"]');
    if (userAccTitleEl) userAccTitleEl.innerText = d.currAccTitle || 'គណនីបច្ចុប្បន្ន';

    const userDisplayEl = document.getElementById('currentUserDisplay');
    if (userDisplayEl && !window.activeUser) userDisplayEl.innerHTML = d.adminUserText || '👤 អ្នកគ្រប់គ្រងប្រព័ន្ធ';

    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        const tabId = activeTab.id.replace('tab-', '');
        const titleMap = {
            dashboard: d.pageDash || '📊 ផ្ទាំងព័ត៌មានទូទៅ (Dashboard)',
            inventory: d.pageInv || '📦 គ្រប់គ្រងស្តុក (Inventory)',
            pos: d.pagePos || '🛒 ប្រព័ន្ធលក់ (Point of Sale)',
            customers: d.pageCust || '👥 គ្រប់គ្រងអតិថិជន (Customers)',
            unpaid: d.pageUnpaid || '📝 វិក្កយបត្រ & ទូទាត់ (Invoices)',
            expenses: d.pageExp || '📉 ការចំណាយ (Expenses)',
            history: d.pageHist || '📜 ប្រវត្តិប្រតិបត្តិការ (Activity Logs)',
            settings: d.pageSet || '⚙️ ការកំណត់ប្រព័ន្ធ (Settings)',
            about: d.pageAbout || 'ℹ️ អំពីប្រព័ន្ធ (About & Version)'
        };
        if (titleMap[tabId] && document.getElementById('pageTitle')) document.getElementById('pageTitle').innerText = titleMap[tabId];
    }

    setHtml('grid-btn-pos', `<i style="font-size: 30px; margin-bottom: 5px;">🛒</i>${d.dashBtnPos ? d.dashBtnPos.replace('🛒 ', '') : 'លក់ (POS)'}`);
    setHtml('grid-btn-inv', `<i style="font-size: 30px; margin-bottom: 5px;">📦</i>${d.dashBtnInv ? d.dashBtnInv.replace('📦 ', '') : 'ស្តុកទំនិញ'}`);
    setHtml('grid-btn-unpaid', `<i style="font-size: 30px; margin-bottom: 5px;">📝</i>${d.dashBtnUnpaid ? d.dashBtnUnpaid.replace('📝 ', '') : 'វិក្កយបត្រ'}`);
    setHtml('grid-btn-exp', `<i style="font-size: 30px; margin-bottom: 5px;">📉</i>${d.dashBtnExp ? d.dashBtnExp.replace('📉 ', '') : 'ចំណាយ'}`);
    setHtml('grid-btn-cust', `<i style="font-size: 30px; margin-bottom: 5px;">👥</i>${d.dashBtnCust ? d.dashBtnCust.replace('👥 ', '') : 'អតិថិជន'}`);
    setHtml('grid-btn-hist', `<i style="font-size: 30px; margin-bottom: 5px;">📜</i>${d.dashBtnHist ? d.dashBtnHist.replace('📜 ', '') : 'ប្រតិបត្តិការ'}`);

    setText('lblDashItems', d.lblDashItems || 'មុខទំនិញសរុប (Items)');
    setText('lblDashQty', d.lblDashQty || 'ស្តុកសរុប (Total Qty)');
    setText('lblDashRev', d.lblDashRev || 'ចំណូលលក់បាន (Revenue)');
    setText('lblDashExp', d.lblDashExp || 'ចំណាយសរុប (Expenses)');
    setText('lblDashPending', d.lblDashPending || 'ប្រាក់រង់ចាំទូទាត់ (Pending)');
    setText('lblDashProfit', d.lblDashProfit || 'ប្រាក់ចំណេញសុទ្ធ (Net Profit)');

    const dashToolbar = document.querySelector('#tab-dashboard .toolbar');
    if (dashToolbar) {
        const spans = dashToolbar.querySelectorAll('span');
        if (spans.length >= 2) {
            spans[0].innerText = d.lblDashDate || '📅 ជ្រើសរើសកាលបរិច្ឆេទបង្ហាញ៖ ';
            spans[1].innerText = d.lblDashTo || 'ដល់';
        }
        const btnShowAll = dashToolbar.querySelector('button');
        if (btnShowAll) btnShowAll.innerText = d.btnDashShowAll || 'បង្ហាញទាំងអស់';
    }

    const expiryH3 = document.querySelector('#expiryAlertSection h3');
    if (expiryH3) expiryH3.innerText = d.dashExpiryAlertTitle || '🚨 ថ្នាំជិតផុតកំណត់ (Expired / Near Expiry Alert)';

    const lowStockH3 = document.querySelector('#tab-dashboard h3[style*="color: var(--primary)"]');
    if (lowStockH3) lowStockH3.innerText = d.dashLowStockTitle || 'ជិតអស់ពីស្តុក (Low Stock Alert)';

    const topSellH3 = document.querySelector('#tab-dashboard h3[style*="color: var(--success)"]');
    if (topSellH3) topSellH3.innerText = d.dashTopSellTitle || '🏆 ទំនិញលក់ដាច់ជាងគេ (Top Selling Items)';

    document.querySelectorAll('#tab-dashboard .btn-outline').forEach(b => {
        if (b.innerText.includes('បិទ/បើក') || b.innerText.includes('Toggle') || b.innerText.includes('展开')) {
            b.innerText = d.btnToggleSection || '🔽 បិទ/បើក';
        }
    });

    const topSellThead = document.querySelector('#topSellingTable')?.parentElement?.querySelectorAll('thead th');
    if (topSellThead && topSellThead.length >= 4) {
        topSellThead[0].innerText = d.thRank || 'ចំណាត់ថ្នាក់';
        topSellThead[1].innerText = d.thProdName || 'ឈ្មោះទំនិញ';
        topSellThead[2].innerText = d.thSoldQty || 'ចំនួនលក់បាន';
        topSellThead[3].innerText = d.thTotalRev || 'ចំណូលសរុប';
    }

    const lowStockThead = document.querySelector('#lowStockTable')?.parentElement?.querySelectorAll('thead th');
    if (lowStockThead && lowStockThead.length >= 4) {
        lowStockThead[0].innerText = d.thLowName || 'ឈ្មោះទំនិញ';
        lowStockThead[1].innerText = d.thLowCat || 'ប្រភេទ';
        lowStockThead[2].innerText = d.thLowQty || 'ស្តុកនៅសល់';
        lowStockThead[3].innerText = d.thLowAction || 'សកម្មភាព';
    }

    if (document.getElementById('searchInput')) document.getElementById('searchInput').placeholder = d.searchInvPlh || '🔍 ស្វែងរកទូទៅ...';
    if (document.getElementById('btnAddNewProduct')) document.getElementById('btnAddNewProduct').innerText = d.btnAddProd || '➕ បន្ថែមទំនិញ';

    const excelBtns = document.querySelectorAll('#inventoryExcelAction button');
    if (excelBtns.length >= 2) {
        excelBtns[0].innerText = d.btnImportCsv || '📥 Import Excel (CSV)';
        excelBtns[1].innerText = d.btnExportCsv || '📤 Export Excel (CSV)';
    }

    const filterStatus = document.getElementById('filterStatus');
    if (filterStatus && filterStatus.options.length >= 3) {
        filterStatus.options[0].text = d.allStatus || 'គ្រប់ស្ថានភាពស្តុក';
        filterStatus.options[1].text = d.inStock || '✅ នៅមានស្តុក (>0)';
        filterStatus.options[2].text = d.outStock || '❌ អស់ស្តុក (0)';
    }

    const filterCat = document.getElementById('filterCategory');
    if (filterCat && filterCat.options.length > 0) {
        filterCat.options[0].text = d.allCats || 'គ្រប់ប្រភេទ';
    }

    setText('lblCartHeaderTitle', d.cartHeader || '🛒 កន្ត្រកទំនិញ');
    setText('btnClearCartBtn', d.cartClear || '🗑️ បោះបង់');
    setText('lblSellerText', d.lblSeller || 'អ្នកលក់ (Seller):');
    setText('lblRateText', d.lblRate || 'អត្រាប្តូរប្រាក់ (Rate):');
    setText('lblQtyText', d.lblTotalQty || 'សរុបចំនួន (Qty):');
    setText('lblDiscountText', d.lblDiscount || 'បញ្ចុះតម្លៃ:');
    setText('lblTaxText', d.lblTax || 'ពន្ធអាករ:');
    setText('lblTotalText', d.lblGrandTotal || 'សរុបទឹកប្រាក់:');

    if (document.getElementById('posSearch')) document.getElementById('posSearch').placeholder = d.searchPosPlh || '🔍 ស្វែងរក ឬ ស្កេនបាកូដ...';
    if (document.getElementById('posCustomerName')) document.getElementById('posCustomerName').placeholder = d.custNamePlh || 'ឈ្មោះអតិថិជន...';
    if (document.getElementById('posCustomerPhone')) document.getElementById('posCustomerPhone').placeholder = d.custPhonePlh || 'លេខទូរស័ព្ទ...';
    if (document.getElementById('btnCheckoutPreorder')) document.getElementById('btnCheckoutPreorder').innerText = d.btnPreorder || '📝 កក់ប្រាក់';
    if (document.getElementById('btnCheckoutUnpaid')) document.getElementById('btnCheckoutUnpaid').innerText = d.btnUnpaid || '📝 រង់ចាំទូទាត់';
    if (document.getElementById('btnCheckoutPaid')) document.getElementById('btnCheckoutPaid').innerText = d.btnPaid || '💰 ទូទាត់រួច';

    if (document.getElementById('searchUnpaid')) document.getElementById('searchUnpaid').placeholder = d.searchUnpaidPlh || '🔍 ស្វែងរកទូទៅ...';
    if (document.getElementById('searchExpense')) document.getElementById('searchExpense').placeholder = d.searchExpPlh || '🔍 ស្វែងរកការចំណាយ...';
    if (document.getElementById('searchCustomer')) document.getElementById('searchCustomer').placeholder = d.searchCustPlh || '🔍 ស្វែងរកទូទៅ...';
    if (document.getElementById('historySearch')) document.getElementById('historySearch').placeholder = d.searchHistPlh || '🔍 ស្វែងរកទូទៅ...';

    const btnExportInvEl = document.querySelector('#tab-unpaid .toolbar button');
    if (btnExportInvEl) btnExportInvEl.innerText = d.btnExportInv || '📥 ទាញយក (Excel)';

    const btnAddExpEl = document.querySelector('#tab-expenses .toolbar button');
    if (btnAddExpEl) btnAddExpEl.innerText = d.btnAddExp || '➕ កត់ត្រាចំណាយថ្មី';

    const custToolbarBtns = document.querySelectorAll('#tab-customers .toolbar button');
    if (custToolbarBtns.length >= 3) {
        custToolbarBtns[0].innerText = d.btnExportJson || '📤 Export JSON';
        custToolbarBtns[1].innerText = d.btnImportJson || '📥 Import JSON';
        custToolbarBtns[2].innerText = d.btnAddCust || '➕ បន្ថែមអតិថិជន';
    }

    const btnClearHistEl = document.querySelector('#tab-history .toolbar button');
    if (btnClearHistEl) btnClearHistEl.innerText = d.btnClearHist || '🗑️ លុបប្រវត្តិទាំងអស់';

    const settingsCards = document.querySelectorAll('#tab-settings > div > div');
    if (settingsCards.length >= 5) {
        const h2Theme = settingsCards[0].querySelector('h2');
        if (h2Theme) h2Theme.innerText = d.setAppearanceTitle || '🎨 ការកំណត់រូបរាង និងពណ៌';
        const lblThemeMode = settingsCards[0].querySelector('label');
        if (lblThemeMode) lblThemeMode.innerText = d.setThemeModeLabel || 'ពណ៌ផ្ទៃខាងក្រោយ (Theme Mode):';
        setText('themeModeDarkBtn', d.btnThemeDark || '🌙 ងងឹត (Dark)');
        setText('themeModeLightBtn', d.btnThemeLight || '☀️ ភ្លឺ (Light)');
        const lblAccent = settingsCards[0].querySelectorAll('label')[1];
        if (lblAccent) lblAccent.innerText = d.setAccentLabel || 'ពណ៌គោល (Accent Color):';
        const lblCustomCol = settingsCards[0].querySelector('label[for="customColorPicker"]');
        if (lblCustomCol) lblCustomCol.innerText = d.setCustomColorLabel || 'ជ្រើសរើសពណ៌ផ្សេង:';

        const h2Features = settingsCards[1].querySelector('h2');
        if (h2Features) h2Features.innerText = d.setSpecialFeaturesTitle || '📦 មុខងារទំនិញ និងការលក់ពិសេស';
        const featLabels = settingsCards[1].querySelectorAll('label span');
        if (featLabels.length >= 3) {
            featLabels[0].innerHTML = d.setConditionLabel || '<strong style="color:var(--text-main);">ស្ថានភាពទំនិញ (Item Condition):</strong>';
            featLabels[1].innerHTML = d.setExpiryLabel || '<strong style="color:var(--text-main);">កាលបរិច្ឆេទផុតកំណត់ (Expiry Date):</strong>';
            featLabels[2].innerHTML = d.setPreorderLabel || '<strong style="color:var(--text-main);">ប្រព័ន្ធកក់ប្រាក់ (Pre-order):</strong>';
        }
        const condHint = document.querySelector('#conditionListContainer > div');
        if (condHint) condHint.innerText = d.setConditionHint || '(សរសេរស្ថានភាពដោយខណ្ឌដោយសញ្ញាក្បៀស ",")';

        const delivSpan = settingsCards[1].querySelector('div span strong');
        if (delivSpan) delivSpan.innerText = d.setDeliveryFeeLabel || 'ថ្លៃសេវាដឹកជញ្ជូនទូទៅ (Default Delivery Fee):';

        const h2User = settingsCards[2].querySelector('h2');
        if (h2User) h2User.innerText = d.setUserMgmtTitle || '👥 គ្រប់គ្រងគណនីបុគ្គលិក (User Management)';
        const pUser = settingsCards[2].querySelector('p');
        if (pUser) pUser.innerText = d.setUserMgmtSub || 'បង្កើត លុប ឬកែប្រែគណនី និងកំណត់សិទ្ធិ (Role) អោយបុគ្គលិកប្រើប្រាស់។';
        const btnUser = settingsCards[2].querySelector('button');
        if (btnUser) btnUser.innerText = d.btnAddNewUser || '➕ បង្កើតគណនីថ្មី';

        const h2Sys = settingsCards[3].querySelector('h2');
        if (h2Sys) h2Sys.innerText = d.setSysTitle || '⚙️ ការកំណត់ប្រព័ន្ធ (System Settings)';
        const pSys = settingsCards[3].querySelector('p');
        if (pSys) pSys.innerText = d.setSysSub || 'កំណត់មុខងារ (Modules) ណាខ្លះដែលអ្នកចង់បង្ហាញ ឬលាក់។';
        const pinLblEl = document.getElementById('lblSetStorePin');
        if (pinLblEl) pinLblEl.innerHTML = `<strong style="color:var(--text-main);">${d.setStorePinLabel || '🔐 លេខកូដសម្ងាត់ហាង (Store PIN - ៤ ខ្ទង់)៖'}</strong>`;
        const tickLblEl = document.getElementById('lblSetTickerNews');
        if (tickLblEl) tickLblEl.innerHTML = `<strong style="color:var(--text-main);">${d.setTickerNewsLabel || '📢 អក្សររត់ជូនដំណឹងលើ Welcome Screen (News Ticker)៖'}</strong>`;
        const sndLblEl = document.getElementById('lblSetEnableSound');
        if (sndLblEl) sndLblEl.innerHTML = d.setEnableSoundLabel || '<strong style="color:var(--text-main);">🔊 បន្លឺសំឡេង (Enable Sound):</strong>';
        const ftrLblEl = document.getElementById('lblSetReceiptFooter');
        if (ftrLblEl) ftrLblEl.innerHTML = `<strong style="color:var(--text-main);">${d.setReceiptFooterLabel || '📝 សារខាងក្រោមវិក្កយបត្រ (Receipt Footer Text)៖'}</strong>`;
        const szLblEl = document.getElementById('lblSetReceiptSize');
        if (szLblEl) szLblEl.innerHTML = `<strong style="color:var(--text-main);">${d.setReceiptSizeLabel || '🖨️ ទំហំក្រដាសវិក្កយបត្រ (ព្រីន & ទាញយករូប)៖'}</strong>`;
        if (settingsCards.length >= 6) {
            const h2Qt = settingsCards[5].querySelector('h2');
            if (h2Qt) h2Qt.innerText = d.setQuickToolsTitle || '🛠️ ឧបករណ៍ជំនួយពិសេស (Quick Tools) 🔒';
            const btnQt = settingsCards[5].querySelector('button');
            if (btnQt) btnQt.innerText = d.btnUnlock || '🔓 ដោះសោ';
        }
        const sysLabels = settingsCards[3].querySelectorAll('label span');
        if (sysLabels.length >= 6) {
            sysLabels[0].innerHTML = d.setCustLabel || '<strong style="color:var(--text-main);">អតិថិជន (Customers):</strong>';
            sysLabels[1].innerHTML = d.setUnpaidLabel || '<strong style="color:var(--text-main);">រង់ចាំទូទាត់ (Unpaid Invoices):</strong>';
            sysLabels[2].innerHTML = d.setLogsLabel || '<strong style="color:var(--text-main);">ប្រវត្តិប្រតិបត្តិការ (Logs):</strong>';
            sysLabels[3].innerHTML = d.setCostLabel || '<strong style="color:var(--text-main);">តម្លៃដើម (Cost Price):</strong>';
            sysLabels[4].innerHTML = d.setDiscountLabel || '<strong style="color:var(--text-main);">ការបញ្ចុះតម្លៃ (Discount):</strong>';
            sysLabels[5].innerHTML = d.setShowSellerLabel || '<strong style="color:var(--text-main);">បង្ហាញឈ្មោះអ្នកលក់ (Show Seller):</strong>';
        }
        const taxSpan = settingsCards[3].querySelector('div span strong');
        if (taxSpan) taxSpan.innerText = d.setTaxLabel || 'ពន្ធអាករ (TAX/VAT): គិតពន្ធលើការលក់ ចំនួន';

        const h2Pass = settingsCards[4].querySelector('h2');
        if (h2Pass) h2Pass.innerText = d.setChgPassTitle || '🔐 ផ្លាស់ប្តូរលេខកូដសម្ងាត់គណនីរបស់អ្នក';
        const passLabels = settingsCards[4].querySelectorAll('label');
        if (passLabels.length >= 2) {
            passLabels[0].innerText = d.lblOldPass || 'លេខកូដចាស់ (Old Password):';
            passLabels[1].innerText = d.lblNewPass || 'លេខកូដថ្មី (New Password):';
        }
        const btnPass = settingsCards[4].querySelector('button');
        if (btnPass) btnPass.innerText = d.btnChgPass || '🔄 ផ្លាស់ប្តូរលេខកូដ';
    }

    const updateTableHeaders = (tableId, headers) => {
        const ths = document.querySelectorAll(`#${tableId} thead .header-row th`);
        if (ths && ths.length === headers.length) {
            headers.forEach((h, idx) => {
                const hasSort = ths[idx].querySelector('span');
                ths[idx].innerHTML = hasSort ? `${h} <span>⬍</span>` : h;
            });
        }
        document.querySelectorAll(`#${tableId} .col-filter`).forEach(inp => {
            inp.placeholder = d.tblSearchPlh || 'ស្វែងរក...';
        });
    };

    updateTableHeaders('mainUnpaidTable', [d.thInvCode||'លេខវិក្កយបត្រ', d.thInvDate||'កាលបរិច្ឆេទ', d.thInvCust||'ឈ្មោះអតិថិជន', d.thInvItems||'ទំនិញ', d.thInvTotal||'សរុប', d.thInvStatus||'ស្ថានភាព', d.thInvSeller||'អ្នកលក់', d.thAction||'សកម្មភាព']);
    updateTableHeaders('mainExpenseTable', [d.thExpDate||'កាលបរិច្ឆេទ', d.thExpCat||'ចំណាត់ថ្នាក់', d.thExpAmount||'ទឹកប្រាក់', d.thExpNote||'ចំណាំ', d.thAction||'សកម្មភាព']);
    updateTableHeaders('mainCustomerTable', [d.thCustName||'អតិថិជន', d.thCustPhone||'លេខទូរស័ព្ទ', d.thCustPaid||'សរុបទិញ', d.thCustUnpaid||'ជំពាក់', d.thAction||'សកម្មភាព']);
    updateTableHeaders('mainHistoryTable', [d.thHistDate||'កាលបរិច្ឆេទ', d.thHistAction||'សកម្មភាព', d.thHistTarget||'ទំនិញ/អតិថិជន', d.thHistCat||'ប្រភេទ', d.thHistQty||'ចំនួន', d.thHistNote||'ចំណាំ']);
    updateTableHeaders('mainUserTable', [d.thUserFullName||'ឈ្មោះពេញ', d.thUserLogin||'ឈ្មោះ Login', d.thUserRole||'សិទ្ធិប្រើប្រាស់', d.thUserPin||'លេខ PIN', d.thAction||'សកម្មភាព']);

    const userRoleFilter = document.querySelector('#mainUserTable select.col-filter');
    if (userRoleFilter && userRoleFilter.options.length > 0) {
        userRoleFilter.options[0].text = d.allRolesFilter || 'ទាំងអស់';
    }

    const zRepBtn = document.querySelector('#tab-dashboard button[onclick*="printZReport"]');
    if (zRepBtn) zRepBtn.innerText = d.btnZReport || '🖨️ បោះពុម្ពរបាយការណ៍បិទបញ្ជី (Z-Report)';

    const expThead = document.querySelectorAll('#expiryAlertSection thead th');
    if (expThead.length >= 5) {
        expThead[0].innerText = d.thProdName || 'ឈ្មោះទំនិញ';
        expThead[1].innerText = d.thCategory || 'ប្រភេទ';
        expThead[2].innerText = d.thExpiry || 'ថ្ងៃផុតកំណត់';
        expThead[3].innerText = d.thInvStatus || 'ស្ថានភាព';
        expThead[4].innerText = d.thAction || 'សកម្មភាព';
    }

    const aboutH2s = document.querySelectorAll('#tab-about h2');
    if (aboutH2s.length >= 2) {
        aboutH2s[0].innerText = d.lblAboutLicense || '🔑 ព័ត៌មានសិទ្ធិប្រើប្រាស់ (License Status)';
        aboutH2s[1].innerText = d.lblAboutBackup || '💾 គ្រប់គ្រងទិន្នន័យ (Backup & Restore All)';
    }
    const bkpBtn = document.querySelector('#tab-about button[onclick*="triggerAppBackup"]');
    if (bkpBtn) bkpBtn.innerText = d.btnBackupAll || '💾 Backup ទិន្នន័យទាំងអស់';
    const rstBtn = document.querySelector('#tab-about button[onclick*="triggerAppRestore"]');
    if (rstBtn) rstBtn.innerText = d.btnRestoreAll || '📂 Restore បញ្ចូលទិន្នន័យវិញ';

    // Translate key modal headings & buttons
    const chkH2 = document.querySelector('#checkoutModal h2');
    if (chkH2) chkH2.innerHTML = d.checkoutModalTitle || '💵 ទូទាត់ប្រាក់ (Checkout)';
    const chkBtn = document.querySelector('#checkoutModal button[onclick*="processCheckoutPaid"]');
    if (chkBtn) chkBtn.innerText = d.btnConfirmCheckout || '✅ បញ្ជាក់ការទូទាត់';
    const shopH2 = document.querySelector('#shopNameModal h2');
    if (shopH2) shopH2.innerText = d.modalShopTitle || '✏️ ប្តូរឈ្មោះហាង និង Logo';
    const prodSaveBtn = document.querySelector('#productModal .modal-footer .btn-primary');
    if (prodSaveBtn) prodSaveBtn.innerText = d.btnSave || 'រក្សាទុក';
    const prodCancelBtn = document.querySelector('#productModal .modal-footer .btn-outline');
    if (prodCancelBtn) prodCancelBtn.innerText = d.btnCancel || 'បោះបង់';
    const custSaveBtn = document.querySelector('#customerModal .modal-footer .btn-primary');
    if (custSaveBtn) custSaveBtn.innerText = d.btnSave || 'រក្សាទុក';
    const custCancelBtn = document.querySelector('#customerModal .modal-footer .btn-outline');
    if (custCancelBtn) custCancelBtn.innerText = d.btnCancel || 'បោះបង់';
    const shopSaveBtn = document.querySelector('#shopNameModal .modal-footer .btn-primary');
    if (shopSaveBtn) shopSaveBtn.innerText = d.btnSave || 'រក្សាទុក';
    const shopCancelBtn = document.querySelector('#shopNameModal .modal-footer .btn-outline');
    if (shopCancelBtn) shopCancelBtn.innerText = d.btnCancel || 'បោះបង់';

    if (document.getElementById('globalLangSelect')) {
        document.getElementById('globalLangSelect').value = lang;
    }

    if (typeof window.renderCart === 'function') window.renderCart();
    if (typeof window.renderInventory === 'function') window.renderInventory();
    if (typeof window.renderDashboard === 'function') window.renderDashboard();
    if (typeof window.renderUsersList === 'function') window.renderUsersList();
    if (typeof window.renderCustomers === 'function') window.renderCustomers();
    if (typeof window.renderUnpaid === 'function') window.renderUnpaid();
    if (typeof window.renderExpenses === 'function') window.renderExpenses();
    if (typeof window.renderHistory === 'function') window.renderHistory();
    if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
    if (typeof window.displayLicenseInfo === 'function') window.displayLicenseInfo();
    if (typeof window.setSyncStatus === 'function') window.setSyncStatus('synced');
};

window.ksMsgOpenedAt = 0;

window.ksMsg = function(msg, title, isConfirm = false, onConfirm = null) {
    const box = document.getElementById('ksMsgBox');
    if (!box) {
        if (typeof window.showToast === 'function') window.showToast(msg);
        if (!isConfirm && typeof onConfirm === 'function') onConfirm();
        return;
    }

    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

    let finalTitle = title || d.confirmNoticeTitle || 'ជូនដំណឹង';
    let finalMsg = msg;

    if (title === 'បញ្ជាក់ការលុប' || title === 'Confirm Action' || title === '确认操作') finalTitle = d.confirmDeleteTitle || 'បញ្ជាក់ការលុប';
    if (title === 'ជូនដំណឹង' || title === 'Notice' || title === '系统提示') finalTitle = d.confirmNoticeTitle || 'ជូនដំណឹង';
    if (title === 'ជោគជ័យ' || title === 'Success' || title === '成功') finalTitle = d.successTitle || 'ជោគជ័យ';
    if (title === 'គ្មានសិទ្ធិ' || title === 'Access Denied' || title === '权限不足') finalTitle = d.errNoPermission || 'គ្មានសិទ្ធិ';

    document.getElementById('ksMsgTitle').innerText = finalTitle;
    document.getElementById('ksMsgText').innerHTML = finalMsg;

    const actContainer = document.getElementById('ksMsgActions');
    actContainer.innerHTML = '';

    let primaryBtn = null;

    if (isConfirm) {
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-outline';
        cancelBtn.innerText = d.btnCancel || 'បោះបង់';
        cancelBtn.onclick = () => { box.style.display = 'none'; };
        actContainer.appendChild(cancelBtn);

        const okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'btn btn-success';
        okBtn.innerText = d.btnConfirmOk || 'យល់ព្រម';
        okBtn.onclick = () => {
            box.style.display = 'none';
            if (typeof onConfirm === 'function') onConfirm();
        };
        actContainer.appendChild(okBtn);
        primaryBtn = okBtn;
    } else {
        const okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'btn btn-primary';
        okBtn.innerText = d.btnConfirmOk || 'យល់ព្រម';
        okBtn.onclick = () => {
            box.style.display = 'none';
            if (typeof onConfirm === 'function') onConfirm();
        };
        actContainer.appendChild(okBtn);
        primaryBtn = okBtn;
    }

    window.ksMsgOpenedAt = Date.now();
    box.style.display = 'flex';

    setTimeout(() => {
        if (primaryBtn && box.style.display !== 'none') {
            primaryBtn.focus();
        }
    }, 60);
};

(function setupGlobalKsMsgKeyboardSupport() {
    window.addEventListener('keydown', function(e) {
        const box = document.getElementById('ksMsgBox');
        if (!box) return;
        const isVisible = box.style.display !== 'none' && window.getComputedStyle(box).display !== 'none';

        if (isVisible) {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                if (Date.now() - (window.ksMsgOpenedAt || 0) < 120) return;

                const buttons = box.querySelectorAll('#ksMsgActions button');
                if (buttons.length > 0) {
                    buttons[buttons.length - 1].click();
                } else {
                    box.style.display = 'none';
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                const buttons = box.querySelectorAll('#ksMsgActions button');
                if (buttons.length > 0) {
                    buttons[0].click();
                } else {
                    box.style.display = 'none';
                }
            }
            return;
        }

        const authScreen = document.getElementById('authScreen');
        if (authScreen && window.getComputedStyle(authScreen).display !== 'none') {
            if (e.key === 'Enter') {
                const activeEl = document.activeElement;
                if (activeEl && (activeEl.id === 'loginUsername' || activeEl.id === 'loginPassword')) {
                    e.preventDefault();
                    window.ksMsgOpenedAt = Date.now();
                    if (typeof window.handleLogin === 'function') window.handleLogin();
                } else if (activeEl && (activeEl.id === 'resetUsername' || activeEl.id === 'resetPin' || activeEl.id === 'newResetPassword')) {
                    e.preventDefault();
                    window.ksMsgOpenedAt = Date.now();
                    if (typeof window.handleResetPassword === 'function') window.handleResetPassword();
                }
            }
        }
    }, true);

    const attachObserver = () => {
        const box = document.getElementById('ksMsgBox');
        if (!box) return;
        const observer = new MutationObserver(() => {
            if (box.style.display !== 'none' && window.getComputedStyle(box).display !== 'none') {
                window.ksMsgOpenedAt = Date.now();
                setTimeout(() => {
                    const buttons = box.querySelectorAll('#ksMsgActions button');
                    if (buttons.length > 0) {
                        buttons[buttons.length - 1].focus();
                    }
                }, 60);
            }
        });
        observer.observe(box, { attributes: true, attributeFilter: ['style'] });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachObserver);
    } else {
        attachObserver();
    }
})();

window.setSyncStatus = function(status, text) {
    let badge = document.getElementById('globalSyncBadge');
    if (!badge) {
        const header = document.getElementById('topHeaderBar') || document.querySelector('header');
        if (header) {
            badge = document.createElement('div');
            badge.id = 'globalSyncBadge';
            badge.style.cssText = 'display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-left: 10px; transition: all 0.3s ease; box-shadow: 0 2px 6px rgba(0,0,0,0.25); backdrop-filter: blur(6px);';
            header.appendChild(badge);
        }
    }
    if (!badge) return;

    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

    if (status === 'syncing') {
        badge.style.background = 'rgba(15, 23, 42, 0.7)';
        badge.style.color = '#fde047';
        badge.style.border = '1px solid #eab308';
        badge.innerHTML = `🟡 ${d.syncing || 'កំពុង Sync...'}`;
    } else if (status === 'synced') {
        badge.style.background = 'rgba(15, 23, 42, 0.65)';
        badge.style.color = '#ffffff';
        badge.style.border = '1px solid rgba(255, 255, 255, 0.35)';
        badge.innerHTML = `🟢 ${text || d.syncedOk || 'ទិន្នន័យទាន់សម័យ'}`;
    } else if (status === 'error') {
        badge.style.background = 'rgba(220, 38, 38, 0.9)';
        badge.style.color = '#ffffff';
        badge.style.border = '1px solid #f87171';
        badge.innerHTML = `🔴 ${text || d.syncFail || 'Sync បរាជ័យ'}`;
    }
};

// ==========================================
// 6. MASTER REAL-TIME DATA SAVE & SYNC (Unified Sync to DB)
// ==========================================
// ⚡ Ultra-Low-Egress Sync Trigger (~60 bytes): Updates branch_store.updated_at after table writes
window.touchCloudSync = async function(renderAllCallback) {
    const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    if (window.inventory) localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
    if (window.invoices) localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(window.invoices));
    if (window.expenses) localStorage.setItem(window.getBranchKey('expenses_pro'), JSON.stringify(window.expenses));
    if (window.customers) localStorage.setItem(window.getBranchKey('customers_pro'), JSON.stringify(window.customers));

    if (window.supabaseClient && navigator.onLine) {
        try {
            const nowIso = new Date().toISOString();
            localStorage.setItem(`ks2_${branchId}_last_update`, new Date(nowIso).getTime().toString());
            await window.supabaseClient
                .from('branch_store')
                .update({ updated_at: nowIso })
                .eq('branch_id', branchId);
        } catch(e) {
            console.warn("touchCloudSync warning:", e);
        }
    }
    if (typeof renderAllCallback === 'function') renderAllCallback();
};

window._isCloudSyncing = false;

window.manualCloudSync = async function(isAuto = false) {
    if (!window.supabaseClient || !navigator.onLine) {
        if (!isAuto) window.setSyncStatus('error', 'គ្មានអ៊ីនធឺណិត (Offline)');
        return;
    }
    // ផ្អាក Auto-Sync ពេលបិទ/លាក់ Tab ដើម្បីសន្សំ Supabase Egress
    if (isAuto && document.hidden) return;
    if (window._isCloudSyncing) return;
    window._isCloudSyncing = true;

    if (!isAuto) window.setSyncStatus('syncing');

    try {
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        let hasChanges = false;
        let localLastUpdate = parseInt(localStorage.getItem(`ks2_${branchId}_last_update`)) || 0;

        // ⚡ Step 1 (Low-Egress Pre-check ~50 bytes): ឆែកតែ updated_at មុនទាញទិន្នន័យធំ
        if (isAuto && localLastUpdate > 0) {
            let { data: metaRow, error: metaErr } = await window.supabaseClient
                .from('branch_store')
                .select('updated_at')
                .eq('branch_id', branchId)
                .maybeSingle();

            if (!metaErr) {
                let cloudMetaTs = metaRow && metaRow.updated_at ? new Date(metaRow.updated_at).getTime() : 0;
                if (!cloudMetaTs || cloudMetaTs === localLastUpdate) {
                    return; // គ្មានការកែប្រែថ្មីទេ -> មិនបាច់ទាញអ្វីទៀតឡើយ!
                }
            }
        }

        // ⚡ Step 2: ទាញតែ Column ថ្មីដែលស្អាត (មិនទាញ data_json ធំៗបើមាន shop_info/sys_settings រួច)
        let { data: storeData } = await window.supabaseClient
            .from('branch_store')
            .select('shop_info, sys_settings, user_accounts, active_plugins, updated_at')
            .eq('branch_id', branchId)
            .maybeSingle();

        let dJson = {};
        if (storeData && !storeData.shop_info && !storeData.sys_settings) {
            let { data: legacyRow } = await window.supabaseClient
                .from('branch_store')
                .select('data_json')
                .eq('branch_id', branchId)
                .maybeSingle();
            if (legacyRow && legacyRow.data_json) dJson = legacyRow.data_json;
        }

        let cloudLastUpdate = storeData && storeData.updated_at ? new Date(storeData.updated_at).getTime() : 0;

        if (!isAuto || (cloudLastUpdate > 0 && cloudLastUpdate !== localLastUpdate) || localLastUpdate === 0) {
            if (storeData) {
                const sInfo = Object.assign({}, {
                    shopName: dJson.shopName,
                    shopLogo: dJson.shopLogo,
                    shopQR: dJson.shopQR,
                    shopPhone: dJson.shopPhone,
                    shopAddress: dJson.shopAddress,
                    shopTelegram: dJson.shopTelegram,
                    telegramBotToken: dJson.telegramBotToken,
                    telegramChatId: dJson.telegramChatId
                }, storeData.shop_info || {});

                window.shopName = sInfo.shopName || window.shopName || '';
                window.shopLogo = sInfo.shopLogo || window.shopLogo || '';
                window.shopQR = sInfo.shopQR || window.shopQR || '';
                window.shopPhone = sInfo.shopPhone || window.shopPhone || '';
                window.shopAddress = sInfo.shopAddress || window.shopAddress || '';
                window.shopTelegram = sInfo.shopTelegram || window.shopTelegram || '';
                
                const localPosTheme = typeof window.getLocalPosTheme === 'function' ? window.getLocalPosTheme() : {};
                const cloudSysClean = typeof window.stripLocalThemeForCloud === 'function'
                    ? window.stripLocalThemeForCloud(Object.assign({}, dJson.sysSettings || {}, storeData.sys_settings || {}))
                    : Object.assign({}, dJson.sysSettings || {}, storeData.sys_settings || {});
                window.sysSettings = Object.assign({}, cloudSysClean, localPosTheme);
                if (storeData.active_plugins && (Array.isArray(storeData.active_plugins.pos) || Array.isArray(storeData.active_plugins.menu))) {
                    window.sysSettings.activePlugins = storeData.active_plugins;
                }
                if (window.sysSettings.activePlugins && typeof window.skmApplyActivePlugins === 'function') {
                    window.skmApplyActivePlugins(window.sysSettings.activePlugins);
                }
                if (storeData.user_accounts && Array.isArray(storeData.user_accounts) && storeData.user_accounts.length > 0) {
                    window.userAccounts = storeData.user_accounts;
                } else if (dJson.userAccounts && Array.isArray(dJson.userAccounts)) {
                    window.userAccounts = dJson.userAccounts;
                }

                // Sync កូដបន្ថែម POS Custom JS ពី Cloud មកកាន់ម៉ាស៊ីន
                const cloudPosScripts = window.sysSettings.customPosScripts || dJson.customPosScripts;
                if (Array.isArray(cloudPosScripts)) {
                    window.customPosScripts = window.normalizeCustomScriptsList(cloudPosScripts);
                    window.sysSettings.customPosScripts = window.customPosScripts;
                    localStorage.setItem(`ks2_${branchId}_pos_scripts`, JSON.stringify(window.customPosScripts));
                    if (typeof window.injectPosScripts === 'function') window.injectPosScripts();
                }

                window.telegramBotToken = sInfo.telegramBotToken || window.sysSettings.telegramBotToken || window.telegramBotToken || '';
                window.telegramChatId = sInfo.telegramChatId || window.sysSettings.telegramChatId || window.telegramChatId || '';
                
                localStorage.setItem(`ks2_${branchId}_sys_settings`, JSON.stringify(window.sysSettings));
                localStorage.setItem(`ks2_${branchId}_auth_users_pro`, JSON.stringify(window.userAccounts || []));
                localStorage.setItem(window.getBranchKey('shop_name'), window.shopName);
                localStorage.setItem(window.getBranchKey('shop_logo'), window.shopLogo);
                localStorage.setItem(window.getBranchKey('shop_qr'), window.shopQR);
                localStorage.setItem(window.getBranchKey('shop_phone'), window.shopPhone);
                localStorage.setItem(window.getBranchKey('shop_address'), window.shopAddress);
                localStorage.setItem(window.getBranchKey('shop_telegram'), window.shopTelegram);
                localStorage.setItem(window.getBranchKey('telegram_bot_token'), window.telegramBotToken);
                localStorage.setItem(window.getBranchKey('telegram_chat_id'), window.telegramChatId);

                const dispName = document.getElementById('displayShopName');
                if(dispName) dispName.innerHTML = `${window.shopName || 'SKM INTEGRATE'} <i id="editShopIcon" style="font-size:var(--fs-12); color:var(--text-muted); font-style: normal;">✏️</i>`; 
                if(typeof window.applySidebarLogoSettings === 'function') window.applySidebarLogoSettings();
                if(typeof window.loadTableSettingsForPOS === 'function') window.loadTableSettingsForPOS();
                // POS Theme is strictly local per device (not overwritten by Cloud Sync)
                if(typeof window.loadSettingsToUI === 'function') window.loadSettingsToUI();
                if(typeof window.applyPermissions === 'function') window.applyPermissions();
                if(typeof window.renderUsersList === 'function') window.renderUsersList();
                
                hasChanges = true;
            }

            // 1. Fetch Customers (គាំទ្រការលុបសល់ ០ ជួរលើ Cloud)
            let { data: custData, error: custErr } = await window.supabaseClient.from('pos_customers').select('*').eq('branch_id', branchId);
            if (!custErr && Array.isArray(custData)) {
                let deletedCust = JSON.parse(localStorage.getItem('deleted_customers_tracker')) || [];
                let mappedCust = custData.map(c => ({ id: c.id, name: c.name, phone: c.phone }));
                window.customers = mappedCust.filter(c => !deletedCust.includes(String(c.id)));
                localStorage.setItem(window.getBranchKey('customers_pro'), JSON.stringify(window.customers));
                hasChanges = true;
            }

            // 2. Fetch Expenses (គាំទ្រការលុបសល់ ០ ជួរលើ Cloud)
            let { data: expData, error: expErr } = await window.supabaseClient.from('pos_expenses').select('*').eq('branch_id', branchId);
            if (!expErr && Array.isArray(expData)) {
                let deletedExp = JSON.parse(localStorage.getItem('deleted_expenses_tracker')) || [];
                let mappedExp = expData.map(e => ({ id: e.id, category: e.category, amount: e.amount, note: e.note, timestamp: e.timestamp, date: e.date }));
                window.expenses = mappedExp.filter(e => !deletedExp.includes(String(e.id)));
                localStorage.setItem(window.getBranchKey('expenses_pro'), JSON.stringify(window.expenses));
                hasChanges = true;
            }

            // 3. Fetch Logs (គាំទ្រការសម្អាតសល់ ០ ជួរលើ Cloud)
            let { data: logData, error: logErr } = await window.supabaseClient.from('pos_history_logs').select('*').eq('branch_id', branchId).order('id', { ascending: false }).limit(isAuto ? 100 : 500);
            if (!logErr && Array.isArray(logData)) {
                window.historyLog = logData.map(l => ({ id: l.id, type: l.type, itemName: l.item_name, qty: l.qty, note: l.note, date: l.date }));
                localStorage.setItem(`ks2_${branchId}_hist_pro`, JSON.stringify(window.historyLog));
                hasChanges = true;
            }
            
            // 4. Fetch Products (គាំទ្រការលុបសល់ ០ ជួរលើ Cloud)
            let { data: productsData, error: prodErr } = await window.supabaseClient.from('pos_products').select('*').eq('branch_id', branchId);
            if (!prodErr && Array.isArray(productsData)) {
                let deletedProd = JSON.parse(localStorage.getItem('deleted_products_tracker')) || [];
                let formattedProducts = productsData.map(p => ({
                    id: p.id, 
                    customId: p.custom_id || p.id, 
                    name: p.name, 
                    category: p.category, 
                    cost: p.cost, 
                    price: p.price, 
                    riel: p.riel, 
                    qty: p.qty, 
                    unit: p.unit, 
                    condition: p.condition, 
                    expiry: p.expiry, 
                    image: p.image, 
                    desc: p.description || p.desc || '',
                    description: p.description || p.desc || ''
                }));
                window.inventory = formattedProducts.filter(p => !deletedProd.includes(String(p.id)));
                localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
                hasChanges = true;
            }

            // 5. Fetch Orders (គាំទ្រការលុបសល់ ០ ជួរលើ Cloud ដោយគ្មានទិន្នន័យខ្មោច)
            let { data: ordersData, error: ordersErr } = await window.supabaseClient.from('pos_orders').select('*').eq('branch_id', branchId).order('timestamp', { ascending: false }).limit(isAuto ? 250 : 1000);
            if (!ordersErr && Array.isArray(ordersData)) {
                let deletedInv = JSON.parse(localStorage.getItem('deleted_invoices_tracker')) || [];
                let formattedOrders = ordersData.map(o => ({
                    id: o.id, invoiceNo: o.id, customerName: o.customer_name, customerPhone: o.customer_phone, totalAmount: o.total_amount, total: o.total_amount, paidUsd: o.paid_amount, paidAmount: o.paid_amount, status: o.status, seller: o.seller, items: o.order_data, note: o.note, timestamp: o.timestamp, date: new Date(o.timestamp).toLocaleString('km-KH')
                }));
                
                let cloudIds = formattedOrders.map(o => String(o.id).trim().toLowerCase());
                let nowTime = Date.now();
                
                if (!window.invoices) window.invoices = [];
                
                window.invoices = window.invoices.filter(localInv => {
                    let localId = String(localInv.id || localInv.invoiceNo).trim().toLowerCase();
                    let isVeryNew = isAuto && (nowTime - (localInv.timestamp || 0)) < 15000; 
                    return cloudIds.includes(localId) || isVeryNew;
                });
                
                formattedOrders.forEach(cInv => {
                    let tempId = String(cInv.id).trim().toLowerCase();
                    if (!deletedInv.includes(tempId)) {
                        let localInv = window.invoices.find(lInv => String(lInv.id || lInv.invoiceNo).trim().toLowerCase() === tempId);
                        if (!localInv) {
                            window.invoices.push(cInv);
                        } else {
                            Object.assign(localInv, cInv);
                        }
                    }
                });

                window.invoices = window.invoices.filter(i => !deletedInv.includes(String(i.id || i.invoiceNo).trim().toLowerCase()));
                window.invoices.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(window.invoices));
                hasChanges = true;
            }
            
            localStorage.setItem(`ks2_${branchId}_last_update`, cloudLastUpdate.toString());
        }

        if (!isAuto) {
            const now = new Date();
            window.setSyncStatus('synced', `Synced: ${now.toLocaleTimeString()}`);
            if (typeof window.showToast === 'function') window.showToast("✅ ទាញយកទិន្នន័យពី Cloud ជោគជ័យ!");
        }

        if (hasChanges || !isAuto) {
            if (typeof window.renderInventory === 'function') window.renderInventory();
            if (typeof window.renderUnpaid === 'function') window.renderUnpaid();
            if (typeof window.renderDashboard === 'function') window.renderDashboard();
            if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
            if (typeof window.renderHistory === 'function') window.renderHistory();
            if (typeof window.renderCustomers === 'function') window.renderCustomers();
            if (typeof window.renderExpenses === 'function') window.renderExpenses();
        }

    } catch(e) {
        console.error("Manual Sync Error:", e);
        if (!isAuto) window.setSyncStatus('error', 'Sync បរាជ័យ');
    } finally {
        window._isCloudSyncing = false;
    }
};

window.saveData = async function(userAccountsRef, renderAllCallback) {
    if (userAccountsRef) {
        window.userAccounts = userAccountsRef;
        localStorage.setItem(window.getBranchKey('auth_users_pro'), JSON.stringify(userAccountsRef));
    }
    
    if (window.inventory) localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
    if (window.invoices) localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(window.invoices));
    if (window.expenses) localStorage.setItem(window.getBranchKey('expenses_pro'), JSON.stringify(window.expenses));
    if (window.customers) localStorage.setItem(window.getBranchKey('customers_pro'), JSON.stringify(window.customers));

    if (!window.sysSettings) window.sysSettings = {};
    if (window.customPosScripts && Array.isArray(window.customPosScripts)) {
        window.customPosScripts = window.normalizeCustomScriptsList(window.customPosScripts);
        window.sysSettings.customPosScripts = window.customPosScripts;
    }

    try {
        if(window.supabaseClient && navigator.onLine) {
            const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
            
            const shopInfoPayload = {
                shopName: window.shopName || '',
                shopLogo: window.shopLogo || '',
                shopQR: window.shopQR || '',
                shopPhone: window.shopPhone || '',
                shopAddress: window.shopAddress || '',
                shopTelegram: window.shopTelegram || '',
                telegramBotToken: window.telegramBotToken || window.sysSettings?.telegramBotToken || '',
                telegramChatId: window.telegramChatId || window.sysSettings?.telegramChatId || '',
                bakongName: window.sysSettings?.bakongName || '',
                bakongId: window.sysSettings?.bakongId || ''
            };

            // មិន Sync POS Theme (posLuxuryTheme/customBrandTheme/seasonal) ទៅ Cloud ឡើយ
            const sysSettingsPayload = typeof window.stripLocalThemeForCloud === 'function'
                ? window.stripLocalThemeForCloud(window.sysSettings || {})
                : (window.sysSettings || {});
            const userAccountsPayload = userAccountsRef || window.userAccounts || [];
            
            const hasValidActivePlugins = window.sysSettings && window.sysSettings.activePlugins &&
                (Array.isArray(window.sysSettings.activePlugins.pos) || Array.isArray(window.sysSettings.activePlugins.menu));

            const nowIso = new Date().toISOString();
            localStorage.setItem(`ks2_${branchId}_last_update`, new Date(nowIso).getTime().toString());

            // ⚡ Low-Egress: រក្សាទុកតែ Column ស្អាតៗ (មិនចម្លង Base64 Logo/QR/sysSettings ស្ទួនចូល data_json ទេ)
            const branchStoreUpsert = { 
                branch_id: branchId, 
                shop_info: shopInfoPayload,
                sys_settings: sysSettingsPayload,
                user_accounts: userAccountsPayload,
                updated_at: nowIso
            };
            if (hasValidActivePlugins) {
                branchStoreUpsert.active_plugins = window.sysSettings.activePlugins;
            }
            await window.supabaseClient.from('branch_store').upsert(branchStoreUpsert, { onConflict: 'branch_id' });
        }
    } catch(e) { console.warn("Cloud Sync config saving failed:", e); }

    localStorage.setItem(window.getBranchKey('sys_settings'), JSON.stringify(window.sysSettings || {}));
    if (window.customPosScripts) {
        localStorage.setItem(window.getBranchKey('pos_scripts'), JSON.stringify(window.customPosScripts));
    }
    
    localStorage.setItem(window.getBranchKey('shop_name'), window.shopName || '');
    localStorage.setItem(window.getBranchKey('shop_logo'), window.shopLogo || '');
    localStorage.setItem(window.getBranchKey('shop_qr'), window.shopQR || '');
    localStorage.setItem(window.getBranchKey('shop_phone'), window.shopPhone || '');
    localStorage.setItem(window.getBranchKey('shop_address'), window.shopAddress || '');
    localStorage.setItem(window.getBranchKey('shop_telegram'), window.shopTelegram || '');
    localStorage.setItem(window.getBranchKey('telegram_bot_token'), window.telegramBotToken || '');
    localStorage.setItem(window.getBranchKey('telegram_chat_id'), window.telegramChatId || '');
 
    if(typeof renderAllCallback === 'function') renderAllCallback();
};

window.loadDataFromSupabase = async function(userAccountsRef) {
    if (!window.supabaseClient || !navigator.onLine) return;

    try {
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        
        let { data, error } = await window.supabaseClient
            .from('branch_store')
            .select('shop_info, sys_settings, user_accounts, active_plugins, updated_at')
            .eq('branch_id', branchId)
            .maybeSingle();

        if (error) {
            console.error("Error loading branch data:", error);
            return;
        }

        if (data) {
            let dJson = {};
            if (!data.shop_info && !data.sys_settings) {
                let { data: leg } = await window.supabaseClient.from('branch_store').select('data_json').eq('branch_id', branchId).maybeSingle();
                if (leg && leg.data_json) dJson = leg.data_json;
            }
            const sInfo = Object.assign({}, {
                shopName: dJson.shopName,
                shopLogo: dJson.shopLogo,
                shopQR: dJson.shopQR,
                shopPhone: dJson.shopPhone,
                shopAddress: dJson.shopAddress,
                shopTelegram: dJson.shopTelegram,
                telegramBotToken: dJson.telegramBotToken,
                telegramChatId: dJson.telegramChatId
            }, data.shop_info || {});

            window.shopName = sInfo.shopName || window.shopName || '';
            window.shopLogo = sInfo.shopLogo || window.shopLogo || '';
            window.shopQR = sInfo.shopQR || window.shopQR || '';
            window.shopPhone = sInfo.shopPhone || window.shopPhone || '';
            window.shopAddress = sInfo.shopAddress || window.shopAddress || '';
            window.shopTelegram = sInfo.shopTelegram || window.shopTelegram || '';

            const localPosTheme = typeof window.getLocalPosTheme === 'function' ? window.getLocalPosTheme() : {};
            const cloudSysClean = typeof window.stripLocalThemeForCloud === 'function'
                ? window.stripLocalThemeForCloud(Object.assign({}, dJson.sysSettings || {}, data.sys_settings || {}))
                : Object.assign({}, dJson.sysSettings || {}, data.sys_settings || {});
            window.sysSettings = Object.assign({}, cloudSysClean, localPosTheme);
            if (data.user_accounts && Array.isArray(data.user_accounts) && data.user_accounts.length > 0) {
                window.userAccounts = data.user_accounts;
            } else if (dJson.userAccounts && Array.isArray(dJson.userAccounts)) {
                window.userAccounts = dJson.userAccounts;
            }
            const resolvedPlugins = (data.active_plugins && (Array.isArray(data.active_plugins.pos) || Array.isArray(data.active_plugins.menu)))
                ? data.active_plugins
                : (window.sysSettings.activePlugins && (Array.isArray(window.sysSettings.activePlugins.pos) || Array.isArray(window.sysSettings.activePlugins.menu))
                    ? window.sysSettings.activePlugins
                    : null);
            if (resolvedPlugins) {
                window.activePlugins = resolvedPlugins;
                window.sysSettings.activePlugins = resolvedPlugins;
                if (typeof window.skmApplyActivePlugins === 'function') window.skmApplyActivePlugins(resolvedPlugins);
            }

            const cloudPosScripts = window.sysSettings.customPosScripts || dJson.customPosScripts;
            if (Array.isArray(cloudPosScripts)) {
                window.customPosScripts = window.normalizeCustomScriptsList(cloudPosScripts);
                window.sysSettings.customPosScripts = window.customPosScripts;
                localStorage.setItem(`ks2_${branchId}_pos_scripts`, JSON.stringify(window.customPosScripts));
                if (typeof window.injectPosScripts === 'function') window.injectPosScripts();
            }

            window.telegramBotToken = sInfo.telegramBotToken || window.sysSettings.telegramBotToken || '';
            window.telegramChatId = sInfo.telegramChatId || window.sysSettings.telegramChatId || '';

            localStorage.setItem(`ks2_${branchId}_sys_settings`, JSON.stringify(window.sysSettings));
            localStorage.setItem(`ks2_${branchId}_auth_users_pro`, JSON.stringify(window.userAccounts || []));
            localStorage.setItem(window.getBranchKey('shop_name'), window.shopName);
            localStorage.setItem(window.getBranchKey('shop_logo'), window.shopLogo);
            localStorage.setItem(window.getBranchKey('shop_qr'), window.shopQR);
            localStorage.setItem(window.getBranchKey('shop_phone'), window.shopPhone);
            localStorage.setItem(window.getBranchKey('shop_address'), window.shopAddress);
            localStorage.setItem(window.getBranchKey('shop_telegram'), window.shopTelegram);
            localStorage.setItem(window.getBranchKey('telegram_bot_token'), window.telegramBotToken);
            localStorage.setItem(window.getBranchKey('telegram_chat_id'), window.telegramChatId);

            // POS Theme stays local per device
            if (typeof window.applySidebarLogoSettings === 'function') window.applySidebarLogoSettings();
            if (typeof window.loadTableSettingsForPOS === 'function') window.loadTableSettingsForPOS();

            console.log("✅ Successfully loaded and mapped normalized data from Supabase!");
        }
    } catch (err) {
        console.error("Fetch exception:", err);
    }
};

// ==========================================
// 13. GLOBAL UI & APP FLOW METHODS
// ==========================================
window.switchTab = function(tabId, title, elem) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active')); 
    if(elem) elem.classList.add('active'); 

    localStorage.setItem('skm_last_active_tab', tabId);

    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
    const titleMap = {
        dashboard: d.pageDash || '📊 ផ្ទាំងព័ត៌មានទូទៅ (Dashboard)',
        inventory: d.pageInv || '📦 គ្រប់គ្រងស្តុក (Inventory)',
        pos: d.pagePos || '🛒 ប្រព័ន្ធលក់ (Point of Sale)',
        customers: d.pageCust || '👥 គ្រប់គ្រងអតិថិជន (Customers)',
        unpaid: d.pageUnpaid || '📝 វិក្កយបត្រ & ទូទាត់ (Invoices)',
        expenses: d.pageExp || '📉 ការចំណាយ (Expenses)',
        history: d.pageHist || '📜 ប្រវត្តិប្រតិបត្តិការ (Activity Logs)',
        settings: d.pageSet || '⚙️ ការកំណត់ប្រព័ន្ធ (Settings)',
        about: d.pageAbout || 'ℹ️ អំពីប្រព័ន្ធ (About & Version)'
    };
    if(document.getElementById('pageTitle')) document.getElementById('pageTitle').innerText = titleMap[tabId] || title;
    
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active')); 
    if(document.getElementById('tab-' + tabId)) document.getElementById('tab-' + tabId).classList.add('active');
    
    const header = document.getElementById('topHeaderBar');
    if(header) header.classList.remove('hidden-header');

    if(window.innerWidth <= 768) { 
        if(document.getElementById('appSidebar')) document.getElementById('appSidebar').classList.remove('active-mobile'); 
        const overlay = document.querySelector('.sidebar-overlay');
        if(overlay) overlay.classList.remove('active'); 
    } 
    
    if (tabId === 'dashboard' && typeof window.renderDashboard === 'function') window.renderDashboard();
    if (tabId === 'inventory' && typeof window.renderInventory === 'function') window.renderInventory();
    if (tabId === 'pos' && typeof window.renderPOSProducts === 'function') {
        if (typeof window.loadTableSettingsForPOS === 'function') window.loadTableSettingsForPOS();
        window.renderPOSProducts();
    }
    if (tabId === 'customers' && typeof window.renderCustomers === 'function') window.renderCustomers();
    if (tabId === 'unpaid' && typeof window.renderUnpaid === 'function') window.renderUnpaid();
    if (tabId === 'expenses' && typeof window.renderExpenses === 'function') window.renderExpenses();
    if (tabId === 'history' && typeof window.renderHistory === 'function') window.renderHistory();
    if (tabId === 'about' && typeof window.displayLicenseInfo === 'function') window.displayLicenseInfo();
};

window.applyPermissions = function() {
    try {
        if (window.activeUser && window.activeUser.role) {
            window.currentRole = String(window.activeUser.role).toLowerCase().trim();
        } else {
            const rawSession = localStorage.getItem(window.getBranchKey('active_user_obj')) 
                            || localStorage.getItem(window.getBranchKey('auth_session_user')) 
                            || localStorage.getItem('auth_session_user');
            if (rawSession) {
                const sess = JSON.parse(rawSession);
                if (sess && sess.role) {
                    window.currentRole = String(sess.role).toLowerCase().trim();
                }
            }
        }
    } catch(e) {}

    if (!window.currentRole) window.currentRole = 'admin';

    const isAdmin = (window.currentRole === 'admin');
    const isManager = (window.currentRole === 'manager');
    const isSales = (window.currentRole === 'sales');
    const isWarehouse = (window.currentRole === 'warehouse');
    const isGuest = (window.currentRole === 'guest'); 

    let sDash = !isGuest && true;
    let sInv = !isGuest && (isAdmin || isManager || isWarehouse);
    let sPOS = !isGuest && (isAdmin || isManager || isSales);
    let sCust = !isGuest && (isAdmin || isManager || (isSales && (window.sysSettings?.cust !== false)));
    let sUnpaid = !isGuest && (isAdmin || isManager || (isSales && (window.sysSettings?.unpaid !== false)));
    let sExp = !isGuest && (isAdmin || isManager);
    let sHist = !isGuest && (isAdmin || isManager);
    let sSet = !isGuest && isAdmin;
    let sAbout = !isGuest && isAdmin;

    const setFlex = (id, show) => {
        const el = document.getElementById(id);
        if (el) el.style.setProperty('display', show ? 'flex' : 'none', 'important');
    };
    const setBlock = (id, show) => {
        const el = document.getElementById(id);
        if (el) el.style.setProperty('display', show ? 'block' : 'none', 'important');
    };

    setFlex('nav-dashboard', sDash);
    setFlex('nav-inventory', sInv);
    setFlex('nav-pos', sPOS);
    setFlex('nav-customers', sCust);
    setFlex('nav-unpaid', sUnpaid);
    setFlex('nav-expenses', sExp);
    setFlex('nav-history', sHist);
    setFlex('nav-settings', sSet);
    setFlex('nav-about', sAbout);

    setFlex('grid-btn-pos', sPOS);
    setFlex('grid-btn-inv', sInv);
    setFlex('grid-btn-unpaid', sUnpaid);
    setFlex('grid-btn-exp', sExp);
    setFlex('grid-btn-cust', sCust);
    setFlex('grid-btn-hist', sHist);

    const editIcon = document.getElementById('editShopIcon');
    if (editIcon) editIcon.style.display = isAdmin ? 'inline' : 'none';

    const showCost = (window.sysSettings?.cost !== false) && (isAdmin || isManager);
    setBlock('costPriceContainer', showCost);
    document.querySelectorAll('.p-cost').forEach(el => el.style.display = showCost ? 'inline' : 'none');

    setBlock('btnAddNewProduct', isAdmin || isManager);
    setFlex('inventoryExcelAction', isAdmin || isManager);
    setBlock('adminUserManagementBlock', isAdmin);

    setFlex('posDiscountContainer', window.sysSettings?.discount !== false);
    if (document.getElementById('posTaxContainer')) {
        const showTax = window.sysSettings?.tax === true;
        document.getElementById('posTaxContainer').style.display = showTax ? 'flex' : 'none';
        if (document.getElementById('cartTaxRateDisplay')) {
            document.getElementById('cartTaxRateDisplay').innerText = window.sysSettings?.taxRate || 0;
        }
    }

    setFlex('posSellerRowContainer', window.sysSettings?.showSeller !== false);
    setBlock('posCustomerInputContainer', window.sysSettings?.cust !== false);
    setBlock('btnCheckoutUnpaid', window.sysSettings?.unpaid !== false);
    setBlock('btnCheckoutPreorder', window.sysSettings?.preorder === true);
    setBlock('pExpiryContainer', window.sysSettings?.expiry !== false);

    if (isAdmin || isManager) {
        if (typeof window.renderUsersList === 'function') window.renderUsersList();
        if (typeof window.renderUnpaid === 'function') window.renderUnpaid();
        if (typeof window.renderExpenses === 'function') window.renderExpenses();
    }
};

window.renderUsersList = function() {
    if (!window.activeUser || (window.activeUser.role !== 'admin' && window.activeUser.role !== 'manager')) return; 
    const tbody = document.getElementById('userListTableBody');
    if (!tbody) return;
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

    tbody.innerHTML = (window.userAccounts || []).map(u => { 
        if (!u) return '';
        let badge = u.role === 'admin' ? '<span class="badge badge-admin">👑 Admin</span>' : 
                    (u.role === 'manager' ? '<span class="badge" style="background:rgba(139,92,246,0.15); color:#8b5cf6; border:1px solid rgba(139,92,246,0.3);">💼 Manager</span>' :
                    (u.role === 'sales' ? '<span class="badge badge-sales">🛒 Sales</span>' : '<span class="badge badge-warehouse">📦 Warehouse</span>')); 
                    
        let deleteBtn = `<button class="btn-danger" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="window.deleteUserAccount('${u.id}')">${d.btnDelete || '🗑️ លុប'}</button>`; 
        let editBtn = `<button class="btn-outline" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer; color:var(--warning);" onclick="window.editUserAccount('${u.id}')">${d.btnEdit || '✏️ កែប្រែ'}</button>`; 
        if (u.username === 'admin') deleteBtn = `<span style="color:var(--text-muted); font-size:var(--fs-11);">${d.cantDeleteAdmin || 'មិនអាចលុប'}</span>`; 
        return `<tr><td data-sort="${u.fullName||''}"><span style="font-weight:bold;">${u.fullName||'-'}</span></td><td data-sort="${u.username}"><span style="color:var(--primary);">${u.username}</span></td><td data-sort="${u.role}">${badge}</td><td data-sort="${u.pin||''}"><span style="background:rgba(128,128,128,0.1); padding:2px 5px; border-radius:4px; font-family:monospace; letter-spacing:2px;">${u.pin||'0000'}</span></td><td style="text-align: center;"><div style="display: inline-flex; gap: 5px; justify-content: center;">${editBtn}${deleteBtn}</div></td></tr>`; 
    }).join('');
    if (typeof window.filterTable === 'function') window.filterTable('mainUserTable');
};

window.loadSettingsToUI = function() { 
    if(!window.sysSettings) return;
    const savedRate = parseFloat(window.sysSettings.exchangeRate || localStorage.getItem(window.getBranchKey('exchange_rate')) || 4000) || 4000;
    const rateEl = document.getElementById('globalExchangeRate');
    if (rateEl) rateEl.value = savedRate;
    window.cartRate = savedRate;
    if(document.getElementById('setCust')) document.getElementById('setCust').checked = window.sysSettings.cust; 
    if(document.getElementById('setUnpaid')) document.getElementById('setUnpaid').checked = window.sysSettings.unpaid; 
    if(document.getElementById('setLogs')) document.getElementById('setLogs').checked = window.sysSettings.logs; 
    if(document.getElementById('setCost')) document.getElementById('setCost').checked = window.sysSettings.cost; 
    if(document.getElementById('setDiscount')) document.getElementById('setDiscount').checked = window.sysSettings.discount; 
    if(document.getElementById('setShowSeller')) document.getElementById('setShowSeller').checked = window.sysSettings.showSeller !== false; 
    if(document.getElementById('setTax')) document.getElementById('setTax').checked = window.sysSettings.tax; 
    if(document.getElementById('setTaxRate')) document.getElementById('setTaxRate').value = window.sysSettings.taxRate ? window.sysSettings.taxRate : 10; 
    
    if(document.getElementById('setEnableSound')) document.getElementById('setEnableSound').checked = window.sysSettings.enableSound !== false; 
    if(document.getElementById('setReceiptFooter')) document.getElementById('setReceiptFooter').value = window.sysSettings.receiptFooter || 'សូមអរគុណ! សូមអញ្ជើញមកម្តងទៀត។';
    
    if(document.getElementById('setCondition')) document.getElementById('setCondition').checked = window.sysSettings.condition || false;
    if(document.getElementById('conditionListContainer')) document.getElementById('conditionListContainer').style.display = window.sysSettings.condition ? 'block' : 'none';
    if(document.getElementById('setConditionList')) document.getElementById('setConditionList').value = window.sysSettings.conditionList || 'MISB, Loose, New, Used';
    if(document.getElementById('setPreorder')) document.getElementById('setPreorder').checked = window.sysSettings.preorder || false;
    if(document.getElementById('setDeliveryFee')) document.getElementById('setDeliveryFee').value = window.sysSettings.deliveryFee !== undefined ? window.sysSettings.deliveryFee : 1.5;

    if(document.getElementById('setExpiry')) document.getElementById('setExpiry').checked = window.sysSettings.expiry !== false;

    if(document.getElementById('setStorePin')) {
        document.getElementById('setStorePin').value = window.sysSettings.storePin || '1234';
    }
    
    if(document.getElementById('setTickerText')) {
        document.getElementById('setTickerText').value = window.sysSettings.tickerNews || window.sysSettings.tickerText || '';
    }
    
    const receiptSel = document.getElementById('setReceiptSize');
    if (receiptSel) {
        receiptSel.querySelectorAll('option[data-custom-preset="true"]').forEach(o => o.remove());
        if (Array.isArray(window.sysSettings.customPrinterPresets)) {
            window.sysSettings.customPrinterPresets.forEach(p => {
                if (p && p.id && p.name) {
                    const opt = document.createElement('option');
                    opt.value = p.id;
                    opt.setAttribute('data-custom-preset', 'true');
                    opt.textContent = `🖨️ ${p.name} (${p.paperMm}mm)`;
                    receiptSel.appendChild(opt);
                }
            });
        }
        if (window.sysSettings.receiptSize === 'custom' && ![...receiptSel.options].some(o => o.value === 'custom')) {
            const cOpt = document.createElement('option');
            cOpt.value = 'custom';
            cOpt.setAttribute('data-custom-preset', 'true');
            cOpt.textContent = '⚙️ ខ្នាតសេរេផ្ទាល់ខ្លួន (Custom)';
            receiptSel.appendChild(cOpt);
        }
        receiptSel.value = window.sysSettings.receiptSize || '80mm';
    }
};

window.saveSysSettings = async function() { 
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

    if(window.currentRole !== 'admin') {
        if(typeof window.ksMsg==='function') return window.ksMsg(d.errNoPermission || 'គ្មានសិទ្ធិ', d.errNoPermission || 'គ្មានសិទ្ធិ'); 
        else if(typeof window.showToast==='function') return window.showToast(d.errNoPermission || 'គ្មានសិទ្ធិ', true);
        return;
    }
    
    if (!window.sysSettings) window.sysSettings = {};
    let currentSavedPin = window.sysSettings.storePin || '1234';
    let pinInputEl = document.getElementById('setStorePin');
    let newStorePin = pinInputEl ? pinInputEl.value.trim() : currentSavedPin;
    if (!newStorePin || newStorePin === '') {
        newStorePin = currentSavedPin; 
    }

    const adminAccount = window.userAccounts ? window.userAccounts.find(x => x.username === 'admin') : null;
    if (adminAccount && String(adminAccount.pin).trim() === newStorePin && newStorePin !== '1234') {
        if(typeof window.ksMsg==='function') return window.ksMsg("❌ លេខកូដហាង (Store PIN) មិនអាចដូចលេខ PIN របស់ Admin បានទេ! សូមជ្រើសរើសលេខផ្សេង។", "បម្រាមសុវត្ថិភាព");
        else if(typeof window.showToast==='function') return window.showToast("❌ លេខកូដហាង (Store PIN) មិនអាចដូចលេខ PIN របស់ Admin បានទេ!", true);
        return;
    }

    window.sysSettings.storePin = newStorePin;
    
    try {
        localStorage.setItem(window.getBranchKey('store_pin'), newStorePin);
        localStorage.setItem('store_pin', newStorePin);
    } catch(e){}

    if(document.getElementById('setTickerText')) {
        const tickerVal = document.getElementById('setTickerText').value.trim();
        window.sysSettings.tickerNews = tickerVal;
        window.sysSettings.tickerText = tickerVal;
        if (tickerVal) window.sysSettings.toggleTicker = true;
    }

    if(document.getElementById('setCust')) window.sysSettings.cust = document.getElementById('setCust').checked; 
    if(document.getElementById('setUnpaid')) window.sysSettings.unpaid = document.getElementById('setUnpaid').checked; 
    if(document.getElementById('setLogs')) window.sysSettings.logs = document.getElementById('setLogs').checked; 
    if(document.getElementById('setCost')) window.sysSettings.cost = document.getElementById('setCost').checked; 
    if(document.getElementById('setDiscount')) window.sysSettings.discount = document.getElementById('setDiscount').checked; 
    if(document.getElementById('setShowSeller')) window.sysSettings.showSeller = document.getElementById('setShowSeller').checked; 
    if(document.getElementById('setTax')) window.sysSettings.tax = document.getElementById('setTax').checked; 
    if(document.getElementById('setTaxRate')) window.sysSettings.taxRate = parseFloat(document.getElementById('setTaxRate').value) || 0; 
    
    if(document.getElementById('setEnableSound')) window.sysSettings.enableSound = document.getElementById('setEnableSound').checked;
    if(document.getElementById('setReceiptFooter')) window.sysSettings.receiptFooter = document.getElementById('setReceiptFooter').value.trim();
    
    if(document.getElementById('setReceiptSize')) {
        const selSize = document.getElementById('setReceiptSize').value || '80mm';
        window.sysSettings.receiptSize = selSize;
        const defaultPresets = {
            '80mm': { mode: '80mm', paperMm: 80, bodyMm: 76, padMm: 4, downloadWidthPx: 380, downloadScale: 2, fontPx: 12, titlePx: 16, logoPx: 100, qrPx: 170 },
            '58mm': { mode: '58mm', paperMm: 57, bodyMm: 54, padMm: 2, downloadWidthPx: 260, downloadScale: 2, fontPx: 10, titlePx: 13, logoPx: 65, qrPx: 125 },
            'A4':   { mode: 'A4', paperMm: 210, bodyMm: 190, padMm: 10, downloadWidthPx: 720, downloadScale: 2, fontPx: 14, titlePx: 20, logoPx: 120, qrPx: 190 }
        };
        if (defaultPresets[selSize]) {
            window.sysSettings.customReceiptConfig = defaultPresets[selSize];
        } else if (selSize.startsWith('preset_') && Array.isArray(window.sysSettings.customPrinterPresets)) {
            const foundPreset = window.sysSettings.customPrinterPresets.find(p => p && p.id === selSize);
            if (foundPreset) window.sysSettings.customReceiptConfig = { ...foundPreset, mode: selSize };
        }
    }

    if(document.getElementById('setCondition')) window.sysSettings.condition = document.getElementById('setCondition').checked;
    if(document.getElementById('setConditionList')) window.sysSettings.conditionList = document.getElementById('setConditionList').value || 'MISB, Loose, New, Used';
    if(document.getElementById('setPreorder')) window.sysSettings.preorder = document.getElementById('setPreorder').checked;
    if(document.getElementById('setDeliveryFee')) window.sysSettings.deliveryFee = parseFloat(document.getElementById('setDeliveryFee').value) || 0;

    if(document.getElementById('setExpiry')) window.sysSettings.expiry = document.getElementById('setExpiry').checked;

    if(document.getElementById('conditionListContainer')) document.getElementById('conditionListContainer').style.display = window.sysSettings.condition ? 'block' : 'none';
    
    if(typeof window.updateCategories === 'function') window.updateCategories(); 
    if(typeof window.applyPermissions === 'function') window.applyPermissions(); 
    if(typeof window.renderDashboard === 'function') window.renderDashboard();
    if(typeof window.saveData === 'function') await window.saveData(window.userAccounts); 
    if(typeof window.ksMsg==='function') window.ksMsg(d.msgShopSaved || "ការកំណត់ និងសេចក្តីជូនដំណឹងត្រូវបានរក្សាទុក!", d.successTitle || "ជោគជ័យ"); 
};

window.toggleDesktopSidebar = function() { 
    const sidebar = document.getElementById('appSidebar'); 
    if(!sidebar) return;
    if(window.innerWidth > 768) { 
        sidebar.classList.toggle('collapsed'); 
    } else { 
        sidebar.classList.toggle('active-mobile'); 
        const overlay = document.querySelector('.sidebar-overlay');
        if(overlay) overlay.classList.toggle('active'); 
    } 
};

// ==========================================
// 14. DATABASE LICENSE SYSTEM & DISPLAY
// ==========================================
window.checkLicense = async function() { 
    const lockScreen = document.getElementById('licenseLockScreen'); 
    const sidebar = document.getElementById('appSidebar'); 

    try { 
        let { data, error } = await window.supabaseClient
            .from('branch_licenses')
            .select('*')
            .eq('branch_id', window.SHOP_BRANCH_ID)
            .eq('is_active', true)
            .maybeSingle();

        if (error || !data) { 
            if (lockScreen) lockScreen.style.display = 'flex'; 
            if (sidebar) sidebar.style.pointerEvents = 'none'; 
            return false; 
        } 

        const expiry = new Date(data.expires_at).getTime();
        if (expiry <= Date.now()) { 
            if (lockScreen) lockScreen.style.display = 'flex'; 
            if (sidebar) sidebar.style.pointerEvents = 'none'; 
            if(typeof window.ksMsg==='function') window.ksMsg('❌ សិទ្ធិប្រើប្រាស់ប្រព័ន្ធ (License) របស់សាខានេះបានផុតកំណត់ហើយ!', 'ផុតកំណត់'); 
            return false; 
        } 

        localStorage.setItem(window.getBranchKey('license_key'), data.license_key);
        if (lockScreen) lockScreen.style.display = 'none'; 
        if (sidebar) sidebar.style.pointerEvents = 'auto'; 
        window.activeLicenseData = data; 
        return true;

    } catch (e) { 
        const savedKey = localStorage.getItem(window.getBranchKey('license_key'));
        if (savedKey) {
            if (lockScreen) lockScreen.style.display = 'none'; 
            if (sidebar) sidebar.style.pointerEvents = 'auto'; 
            return true;
        }
        if (lockScreen) lockScreen.style.display = 'flex'; 
        if (sidebar) sidebar.style.pointerEvents = 'none'; 
        return false; 
    } 
};

window.verifyAndSaveLicense = async function() { 
    const inputEl = document.getElementById('licenseInputBox') || document.querySelector('#licenseLockScreen input');
    const inputKey = inputEl ? inputEl.value.trim() : '';
    const lockScreen = document.getElementById('licenseLockScreen'); 
    const sidebar = document.getElementById('appSidebar'); 
    const btnUnlock = document.querySelector('#licenseLockScreen button');

    if(!inputKey) {
        if(typeof window.ksMsg==='function') return window.ksMsg('សូមបញ្ចូលលេខកូដ (License Key)!'); 
        else if(typeof window.showToast==='function') return window.showToast('សូមបញ្ចូលលេខកូដ (License Key)!', true);
        return;
    }

    if (btnUnlock) {
        btnUnlock.innerText = '⏳ កំពុងផ្ទៀងផ្ទាត់...';
        btnUnlock.disabled = true;
    }

    try { 
        let { data, error } = await window.supabaseClient
            .from('branch_licenses')
            .select('*')
            .eq('branch_id', window.SHOP_BRANCH_ID)
            .eq('license_key', inputKey)
            .eq('is_active', true)
            .maybeSingle();

        if (error || !data) { 
            if (btnUnlock) { btnUnlock.innerText = '🔓 បើកដំណើរការ'; btnUnlock.disabled = false; }
            if(typeof window.ksMsg==='function') return window.ksMsg('❌ លេខកូដ License មិនត្រឹមត្រូវ ឬមិនទាន់ត្រូវបានបើកសិទ្ធិ!', 'បរាជ័យ'); 
            return;
        }

        const expiry = new Date(data.expires_at).getTime();
        if (expiry <= Date.now()) { 
            if (btnUnlock) { btnUnlock.innerText = '🔓 បើកដំណើរការ'; btnUnlock.disabled = false; }
            if(typeof window.ksMsg==='function') return window.ksMsg('❌ លេខកូដ License នេះបានផុតកំណត់ហើយ!', 'បរាជ័យ'); 
            return;
        }

        localStorage.setItem(window.getBranchKey('license_key'), inputKey); 
        window.activeLicenseData = data; 

        if (lockScreen) lockScreen.style.display = 'none'; 
        if (sidebar) sidebar.style.pointerEvents = 'auto'; 

        if(typeof window.loadDataFromSupabase==='function') await window.loadDataFromSupabase(window.userAccounts);
        if(typeof window.loadSettingsToUI==='function') window.loadSettingsToUI(); 
        if(typeof window.applyPermissions==='function') window.applyPermissions(); 
        if(typeof window.updateCategories==='function') window.updateCategories();
        if(typeof window.renderDashboard==='function') window.renderDashboard(); 

        if(typeof window.showToast==='function') window.showToast("✅ សិទ្ធិប្រើប្រាស់ត្រូវបានបើកដំណើរការជោគជ័យ!");

    } catch(e) { 
        if (btnUnlock) { btnUnlock.innerText = '🔓 បើកដំណើរការ'; btnUnlock.disabled = false; }
        if(typeof window.ksMsg==='function') window.ksMsg('❌ មិនអាចភ្ជាប់ទៅកាន់ Server ដើម្បីផ្ទៀងផ្ទាត់ License បានទេ!', 'បរាជ័យ'); 
    } 
};

window.verifyAndSaveLicenseFromAbout = async function() { 
    const inputEl = document.querySelector('#tab-about input');
    const inputKey = inputEl ? inputEl.value.trim() : ''; 
    if(!inputKey) {
        if(typeof window.ksMsg==='function') return window.ksMsg('សូមបញ្ចូលលេខកូដ (License Key)!'); 
        return;
    }

    try { 
        let { data, error } = await window.supabaseClient
            .from('branch_licenses')
            .select('*')
            .eq('branch_id', window.SHOP_BRANCH_ID)
            .eq('license_key', inputKey)
            .eq('is_active', true)
            .maybeSingle();

        if (error || !data) { 
            if(typeof window.ksMsg==='function') return window.ksMsg('❌ លេខកូដ License មិនត្រឹមត្រូវ ឬមិនទាន់ត្រូវបានបើកសិទ្ធិ!', 'បរាជ័យ'); 
            return;
        }

        const expiry = new Date(data.expires_at).getTime();
        if (expiry <= Date.now()) { 
            if(typeof window.ksMsg==='function') return window.ksMsg('❌ លេខកូដ License នេះបានផុតកំណត់ហើយ!', 'បរាជ័យ'); 
            return;
        }

        localStorage.setItem(window.getBranchKey('license_key'), inputKey); 
        if (inputEl) inputEl.value = '';
        const lang = localStorage.getItem('app_lang') || 'km';
        const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
        if(typeof window.ksMsg==='function') {
            window.ksMsg('✅ សិទ្ធិប្រើប្រាស់ត្រូវបានធ្វើបច្ចុប្បន្នភាពជោគជ័យ!', d.successTitle || 'ជោគជ័យ', false, () => { 
                location.reload(); 
            }); 
        } else {
            location.reload();
        }

    } catch(e) { 
        if(typeof window.ksMsg==='function') window.ksMsg('❌ មិនអាចភ្ជាប់ទៅកាន់ Server ដើម្បីផ្ទៀងផ្ទាត់ License បានទេ!', 'បរាជ័យ'); 
    } 
};

window.displayLicenseInfo = async function() { 
    const aboutTab = document.getElementById('tab-about');
    if (!aboutTab) return;

    const lang = localStorage.getItem('app_lang') || 'km';
    const labels = {
        km: { branch: '🏢 សាខា (Branch)៖', active: '✅ កំពុងដំណើរការ', days: 'ថ្ងៃ', expire: '⏳ ផុតកំណត់នៅថ្ងៃ៖' },
        en: { branch: '🏢 Branch:', active: '✅ Active', days: 'days left', expire: '⏳ Expires on:' },
        zh: { branch: '🏢 分店 (Branch):', active: '✅ 正常运行', days: '天后到期', expire: '⏳ 到期时间：' }
    };
    const t = labels[lang] || labels.km;

    let targetCard = Array.from(aboutTab.querySelectorAll('div')).find(el => el.innerText && (el.innerText.includes('License Status') || el.innerText.includes('ព័ត៌មានសិទ្ធិប្រើប្រាស់') || el.innerText.includes('授权信息')));
    if (!targetCard) targetCard = aboutTab.querySelector('.card') || aboutTab;

    let infoBox = document.getElementById('customLicenseStatusBox');
    if (!infoBox) {
        infoBox = document.createElement('div');
        infoBox.id = 'customLicenseStatusBox';
        targetCard.prepend(infoBox);
    }

    try {
        let license = window.activeLicenseData;
        if (!license || !license.expires_at) {
            let { data } = await window.supabaseClient
                .from('branch_licenses')
                .select('*')
                .eq('branch_id', window.SHOP_BRANCH_ID)
                .maybeSingle();
            if (data) {
                license = data;
                window.activeLicenseData = data;
            }
        }

        if (license && license.expires_at) {
            const expiry = new Date(license.expires_at).getTime(); 
            const expireDate = new Date(expiry); 
            const diffDays = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24)); 
            let statusBadge = `<span style="display: inline-flex; align-items: center; gap: 4px; color: #059669; font-weight: bold; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 13px;">${t.active} (${diffDays} ${t.days})</span>`; 

            infoBox.innerHTML = `
                <div style="background: rgba(0,0,0,0.15); border: 1px solid var(--border); padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); color: var(--text-main);">
                    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border); padding-bottom: 12px; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                        <div style="font-size: 15px; font-weight: bold; color: var(--text-main);">
                            ${t.branch} <span style="color: #38bdf8; font-weight: 900; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); padding: 3px 8px; border-radius: 6px;">${license.branch_id || window.SHOP_BRANCH_ID}</span>
                        </div>
                        <div>${statusBadge}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                        <div style="font-size: 14px; font-weight: bold; color: var(--text-muted);">
                            ${t.expire}
                        </div>
                        <div style="font-size: 14px; font-weight: 800; color: #b45309; background: #fef3c7; border: 1px solid #fde68a; padding: 6px 14px; border-radius: 8px; box-shadow: 0 2px 5px rgba(245, 158, 11, 0.1);">
                            📅 ${expireDate.toLocaleDateString(lang === 'km' ? 'km-KH' : (lang === 'zh' ? 'zh-CN' : 'en-US'), { year: 'numeric', month: 'long', day: 'numeric' })} ${expireDate.toLocaleTimeString()}
                        </div>
                    </div>
                </div>`;
            return;
        }
    } catch(e) {}
};

// ==========================================
// 15. SHOP SETTINGS & ASSETS
// ==========================================
window.openShopNameModal = function() { 
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
    if(window.currentRole !== 'admin') {
        if(typeof window.ksMsg==='function') return window.ksMsg(d.errAdminOnlyLogo || 'មានតែ Admin ប៉ុណ្ណោះដែលអាចប្តូរឈ្មោះបាន!', d.errNoPermission || 'គ្មានសិទ្ធិ'); 
        return;
    }
    document.getElementById('newShopNameInput').value = window.shopName || ''; 
    document.getElementById('newShopPhoneInput').value = window.shopPhone || ''; 
    document.getElementById('newShopAddressInput').value = window.shopAddress || ''; 
    document.getElementById('newShopTelegramInput').value = window.shopTelegram || ''; 
    document.getElementById('newBotTokenInput').value = window.telegramBotToken || window.sysSettings?.telegramBotToken || ''; 
    document.getElementById('newChatIdInput').value = window.telegramChatId || window.sysSettings?.telegramChatId || ''; 
    
    const preview = document.getElementById('shopLogoPreview'); 
    if(window.shopLogo) { preview.src = window.shopLogo; preview.style.display = 'block'; } else preview.style.display = 'none'; 
    
    const qrPreview = document.getElementById('shopQRPreview'); 
    if(window.shopQR) { qrPreview.src = window.shopQR; qrPreview.style.display = 'block'; } else qrPreview.style.display = 'none'; 
    
    if(document.getElementById('newBakongIdInput') && window.sysSettings) {
        document.getElementById('newBakongIdInput').value = window.sysSettings.bakongId || '';
        document.getElementById('newBakongNameInput').value = window.sysSettings.bakongName || '';
    }
    
    if(typeof window.changeAppLanguage==='function') window.changeAppLanguage(lang);
    document.getElementById('shopNameModal').style.display = 'flex'; 
};

window.closeShopNameModal = function() { 
    document.getElementById('shopNameModal').style.display = 'none'; 
};

window.handleShopLogo = function(e) { 
    const file = e.target.files[0]; if(!file) return; 
    const reader = new FileReader(); 
    reader.onload = (ev) => { 
        const img = new Image(); 
        img.onload = () => { 
            const canvas = document.createElement('canvas'); const max = 200; let w = img.width, h = img.height; 
            if(w>h) { if(w>max) { h*=max/w; w=max; } } else { if(h>max) { w*=max/h; h=max; } } 
            canvas.width = w; canvas.height = h; 
            const ctx = canvas.getContext('2d'); 
            ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); 
            ctx.drawImage(img, 0, 0, w, h); 
            globalThis.shopLogo = canvas.toDataURL('image/jpeg', 0.8); 
            document.getElementById('shopLogoPreview').src = globalThis.shopLogo; 
            document.getElementById('shopLogoPreview').style.display = 'block'; 
        }; 
        img.src = ev.target.result; 
    }; 
    reader.readAsDataURL(file); 
};

window.handleShopQR = function(e) { 
    const file = e.target.files[0]; if(!file) return; 
    const reader = new FileReader(); 
    reader.onload = (ev) => { 
        const img = new Image(); 
        img.onload = () => { 
            const canvas = document.createElement('canvas'); const max = 300; let w = img.width, h = img.height; 
            if(w>h) { if(w>max) { h*=max/w; w=max; } } else { if(h>max) { w*=max/h; h=max; } } 
            canvas.width = w; canvas.height = h; 
            const ctx = canvas.getContext('2d'); 
            ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); 
            ctx.drawImage(img, 0, 0, w, h); 
            globalThis.shopQR = canvas.toDataURL('image/jpeg', 0.8); 
            document.getElementById('shopQRPreview').src = globalThis.shopQR; 
            document.getElementById('shopQRPreview').style.display = 'block'; 
        }; 
        img.src = ev.target.result; 
    }; 
    reader.readAsDataURL(file); 
};

window.saveShopName = async function() { 
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

    const newName = document.getElementById('newShopNameInput').value.trim(); 
    const newPhone = document.getElementById('newShopPhoneInput').value.trim(); 
    const newAddress = document.getElementById('newShopAddressInput').value.trim(); 
    const newTelegram = document.getElementById('newShopTelegramInput').value.trim(); 
    const newBotToken = document.getElementById('newBotTokenInput').value.trim(); 
    const newChatId = document.getElementById('newChatIdInput').value.trim(); 
    
    let bakongId = '';
    let bakongName = '';
    if (document.getElementById('newBakongIdInput')) {
        bakongId = document.getElementById('newBakongIdInput').value.trim();
        bakongName = document.getElementById('newBakongNameInput').value.trim().toUpperCase();
    }
    
    if(newName !== "") { 
        window.shopName = newName;
        if(globalThis.shopLogo !== undefined) window.shopLogo = globalThis.shopLogo;
        if(globalThis.shopQR !== undefined) window.shopQR = globalThis.shopQR;
        window.shopPhone = newPhone;
        window.shopAddress = newAddress;
        window.shopTelegram = newTelegram;
        window.telegramBotToken = newBotToken;
        window.telegramChatId = newChatId;

        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        localStorage.setItem(`ks2_${branchId}_shop_phone`, newPhone);
        localStorage.setItem(`ks2_${branchId}_shop_address`, newAddress);

        if(typeof window.updateShopInfo === 'function') {
            window.updateShopInfo(
                newName, 
                window.shopLogo, 
                window.shopQR, 
                newPhone, 
                newAddress, 
                newTelegram, 
                newBotToken, 
                newChatId
            );
        }

        if (!window.sysSettings) window.sysSettings = {};
        if (window.shopQR && !window.sysSettings.menuQR) window.sysSettings.menuQR = window.shopQR;
        window.sysSettings.telegramBotToken = newBotToken;
        window.sysSettings.orderTelegramBotToken = newBotToken;
        window.sysSettings.telegramChatId = newChatId;
        window.sysSettings.orderTelegramChatId = newChatId;
        
        if (bakongId) window.sysSettings.bakongId = bakongId;
        if (bakongName) window.sysSettings.bakongName = bakongName;
        
        const dispName = document.getElementById('displayShopName');
        if(dispName) dispName.innerHTML = `${window.shopName} <i id="editShopIcon" style="font-size:var(--fs-12); color:var(--text-muted); font-style: normal;">✏️</i>`; 
        
        const sideLogo = document.getElementById('sidebarLogo');
        if(window.shopLogo && sideLogo) { 
            sideLogo.src = window.shopLogo; 
            sideLogo.style.display = 'block'; 
        } 
        if(typeof window.saveData==='function') await window.saveData(window.userAccounts); 
        window.closeShopNameModal(); 
        if(typeof window.ksMsg==='function') window.ksMsg(d.msgShopSaved || 'រក្សាទុកជោគជ័យ', d.successTitle || 'ជោគជ័យ'); 
    } else {
        if(typeof window.ksMsg==='function') window.ksMsg("សូមបញ្ចូលឈ្មោះហាងសិន!"); 
    }
};

window.renderAll = function() { 
    // Handled dynamically per active tab via switchTab
};

window.resetDashboardDate = function() { 
    document.getElementById('dashDateFrom').value = ''; 
    document.getElementById('dashDateTo').value = ''; 
    if(typeof window.renderDashboard==='function') window.renderDashboard(); 
};

// ==========================================
// 16. DASHBOARD & REPORTING
// ==========================================
window.renderDashboard = function() {
    try {
        let tItems = (window.inventory || []).length;
        let tQty = 0, estRev = 0, lowItems = [], expItems = []; 
        const nowMs = Date.now();

        (window.inventory || []).forEach(p => { 
            if(!p) return; 
            let q = parseInt(p.qty) || 0;
            tQty += q;
            let priceVal = parseFloat(p.price) || 0;
            estRev += (priceVal * q); 
            if(q <= 5) lowItems.push(p); 

            if (window.sysSettings && window.sysSettings.expiry !== false && p.expiry) {
                const expDateObj = new Date(p.expiry);
                if (!isNaN(expDateObj.getTime())) {
                    const expEndMs = new Date(p.expiry + 'T23:59:59').getTime();
                    const diffDays = Math.ceil((expEndMs - nowMs) / (1000 * 60 * 60 * 24));
                    if (diffDays <= 30) {
                        expItems.push({ ...p, diffDays });
                    }
                }
            }
        });
        
        const dateFrom = document.getElementById('dashDateFrom');
        const dateTo = document.getElementById('dashDateTo'); 
        const fromTime = (dateFrom && dateFrom.value) ? new Date(dateFrom.value).getTime() : 0; 
        const toTime = (dateTo && dateTo.value) ? new Date(dateTo.value).getTime() : Infinity;
        let totalSalesRevenue = 0, totalUnpaid = 0, totalExpenses = 0, totalCOGS = 0, salesMap = {};
        
        (window.invoices || []).forEach(inv => { 
            if (!inv) return;
            let invTime = inv.timestamp || parseInt(String(inv.id).split('_')[1]) || new Date(inv.date || 0).getTime() || 0; 
            if (invTime >= fromTime && invTime <= toTime) { 
                const st = String(inv.status || 'unpaid').toLowerCase();
                const totAmt = parseFloat(inv.totalAmount || inv.total || 0);
                if(st === 'paid') {
                    totalSalesRevenue += totAmt; 
                } else { 
                    let invPaid = parseFloat(inv.paidUsd || inv.paidAmount || 0); 
                    let remaining = totAmt - invPaid; 
                    if(remaining > 0) totalUnpaid += remaining; 
                    totalSalesRevenue += invPaid; 
                }
                if(inv.items && Array.isArray(inv.items)) {
                    inv.items.forEach(item => { 
                        if(!item) return;
                        let pId = item.id ? String(item.id) : (item.name || 'unknown');
                        if(!salesMap[pId]) salesMap[pId] = { name: item.name || item.title || 'ទំនិញ', qty: 0, revenue: 0 }; 
                        let qty = parseInt(item.cartQty !== undefined ? item.cartQty : item.qty) || 0;
                        let price = parseFloat(item.price) || 0;
                        
                        let realProd = (window.inventory || []).find(p => p && (String(p.id) === String(item.id) || p.name === item.name));
                        let cost = parseFloat(item.cost) || (realProd ? parseFloat(realProd.cost) || 0 : 0);

                        salesMap[pId].qty += qty;
                        salesMap[pId].revenue += (price * qty);
                        totalCOGS += (cost * qty);
                    }); 
                }
            } 
        });

        (window.expenses || []).forEach(exp => {
            if (!exp) return;
            let expTime = exp.timestamp || new Date(exp.date || 0).getTime() || 0;
            if(expTime >= fromTime && expTime <= toTime) totalExpenses += (parseFloat(exp.amount) || 0);
        });

        let netProfit = totalSalesRevenue - totalCOGS - totalExpenses;
        
        if(document.getElementById('dashTotalItems')) document.getElementById('dashTotalItems').innerText = tItems; 
        if(document.getElementById('dashTotalQty')) document.getElementById('dashTotalQty').innerText = tQty; 
        if(document.getElementById('dashEstRevenue')) document.getElementById('dashEstRevenue').innerText = typeof window.fMoney==='function'?window.fMoney(estRev):`$${estRev}`; 
        if(document.getElementById('dashTotalRevenue')) document.getElementById('dashTotalRevenue').innerText = typeof window.fMoney==='function'?window.fMoney(totalSalesRevenue):`$${totalSalesRevenue}`; 
        if(document.getElementById('dashTotalExpenses')) document.getElementById('dashTotalExpenses').innerText = typeof window.fMoney==='function'?window.fMoney(totalExpenses):`$${totalExpenses}`;
        if(document.getElementById('dashTotalUnpaid')) document.getElementById('dashTotalUnpaid').innerText = typeof window.fMoney==='function'?window.fMoney(totalUnpaid):`$${totalUnpaid}`;
        let netProfitEl = document.getElementById('dashNetProfit');
        if(netProfitEl) {
            netProfitEl.innerText = typeof window.fMoney==='function'?window.fMoney(netProfit):`$${netProfit}`;
            netProfitEl.style.color = netProfit >= 0 ? 'var(--success)' : 'var(--danger)';
        }
        
        const lang = localStorage.getItem('app_lang') || 'km';
        const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

        const expSection = document.getElementById('expiryAlertSection');
        const expTbody = document.getElementById('expiryAlertTable');
        if (expSection && expTbody) {
            if (window.sysSettings && window.sysSettings.expiry !== false && expItems.length > 0) {
                expItems.sort((a, b) => a.diffDays - b.diffDays);
                expSection.style.display = 'block';
                expTbody.innerHTML = expItems.map(p => {
                    let catStr = p.category ? p.category : '-';
                    let nameStr = p.name ? String(p.name).replace(/'/g, "\\'") : '';
                    let expDateFormatted = new Date(p.expiry).toLocaleDateString(lang === 'km' ? 'km-KH' : (lang === 'zh' ? 'zh-CN' : 'en-US'));
                    let statusBadge = p.diffDays < 0 
                        ? `<span class="badge" style="background:rgba(225,29,72,0.15); color:var(--danger); border:1px solid var(--danger);">${d.statusExpired || '❌ ផុតកំណត់ហើយ'} (${Math.abs(p.diffDays)}${d.daysUnit || ' ថ្ងៃ'})</span>`
                        : `<span class="badge" style="background:rgba(245,158,11,0.15); color:var(--warning); border:1px solid var(--warning);">${d.statusNearExpiry || '⚠️ សល់ '}${p.diffDays}${d.daysUnit || ' ថ្ងៃទៀត'}</span>`;
                    return `<tr>
                        <td style="font-weight:bold;">${p.name}</td>
                        <td>${catStr}</td>
                        <td style="font-weight:bold; color:${p.diffDays < 0 ? 'var(--danger)' : 'var(--warning)'};">${expDateFormatted}</td>
                        <td>${statusBadge}</td>
                        <td><button class="btn btn-outline" style="padding:4px 8px; font-size:var(--fs-12);" onclick="window.switchTab('inventory','📦 Inventory', document.getElementById('nav-inventory')); document.getElementById('searchInput').value='${nameStr}'; window.renderInventory();">${d.btnViewItem || 'មើល'}</button></td>
                    </tr>`;
                }).join('');
            } else {
                expSection.style.display = 'none';
                expTbody.innerHTML = '';
            }
        }

        const tbody = document.getElementById('lowStockTable'); 
        if(tbody) { 
            tbody.innerHTML = lowItems.length === 0 ? `<tr><td colspan="4" style="text-align:center;">${d.noLowStock || 'មិនមានទំនិញជិតអស់ទេ'}</td></tr>` : lowItems.map(p => { 
                let catStr = p.category ? p.category : '-'; 
                let nameStr = p.name ? String(p.name).replace(/'/g, "\\'") : ''; 
                return `<tr><td>${p.name}</td><td>${catStr}</td><td style="color:${p.qty<=0?'var(--danger)':'var(--warning)'}; font-weight:bold;">${p.qty}</td><td><button class="btn btn-outline" style="padding:4px 8px; font-size:var(--fs-12);" onclick="window.switchTab('inventory','📦 Inventory', document.getElementById('nav-inventory')); document.getElementById('searchInput').value='${nameStr}'; window.renderInventory();">${d.btnViewItem || 'មើល'}</button></td></tr>`; 
            }).join(''); 
        }
        
        let topSellers = Object.values(salesMap).sort((a, b) => b.qty - a.qty).slice(0, 5); 
        const topBody = document.getElementById('topSellingTable');

        if (topBody) { 
            topBody.innerHTML = topSellers.length === 0 ? `<tr><td colspan="4" style="text-align:center;">${d.noTopSell || 'មិនទាន់មានទិន្នន័យលក់ទេ'}</td></tr>` : topSellers.map((item, index) => {
                let rankLabel = index === 0 ? (d.rank1||'🥇 1st') : index === 1 ? (d.rank2||'🥈 2nd') : index === 2 ? (d.rank3||'🥉 3rd') : ((d.rankN||'No. ') + (index + 1));
                return `<tr><td style="font-weight:bold; color:var(--primary);">${rankLabel}</td><td>${item.name}</td><td style="font-weight:bold;">${item.qty}</td><td style="color:var(--success); font-weight:bold;">${typeof window.fMoney==='function'?window.fMoney(item.revenue):`$${item.revenue}`}</td></tr>`;
            }).join(''); 
        }
    } catch(e) {
        console.error("Dashboard render error:", e);
    }
};

// ==========================================
// 16.5 HISTORY LOG WITH PAGINATION
// ==========================================
window.histCurrentPage = 1;
window.histItemsPerPage = 20;

window.changeHistoryItemsPerPage = function(val) {
    window.histItemsPerPage = val === 'all' ? 'all' : parseInt(val);
    window.histCurrentPage = 1; 
    window.renderHistory();
};

window.changeHistoryPage = function(page) {
    window.histCurrentPage = page;
    window.renderHistory();
    const container = document.getElementById('mainScroller');
    if(container) container.scrollTo({top: 0, behavior: 'smooth'});
};

window.renderHistory = function() {
    const searchVal = document.getElementById('historySearch') ? document.getElementById('historySearch').value.toLowerCase() : ''; 
    const dateFrom = document.getElementById('historyDateFrom'); 
    const dateTo = document.getElementById('historyDateTo'); 
    const pageContainer = document.getElementById('historyPagination');
    const fromTime = (dateFrom && dateFrom.value) ? new Date(dateFrom.value).getTime() : 0; 
    const toTime = (dateTo && dateTo.value) ? new Date(dateTo.value).getTime() : Infinity; 
    
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

    let filtered = (window.historyLog || []).filter(h => 
        (String(h.itemName).toLowerCase().includes(searchVal) || (h.note && String(h.note).toLowerCase().includes(searchVal))) && 
        (h.id >= fromTime && h.id <= toTime)
    );

    const hTable = document.getElementById('historyTable');
    if (!hTable) return;

    if (filtered.length === 0) {
        hTable.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">${d.noHistData || 'មិនមានទិន្នន័យទេ'}</td></tr>`;
        if (pageContainer) pageContainer.innerHTML = '';
        return;
    }

    let totalItems = filtered.length;
    let totalPages = 1;
    let displayItems = filtered;

    if (window.histItemsPerPage !== 'all') {
        totalPages = Math.ceil(totalItems / window.histItemsPerPage) || 1;
        if (window.histCurrentPage > totalPages) window.histCurrentPage = totalPages;
        if (window.histCurrentPage < 1) window.histCurrentPage = 1;

        let startIndex = (window.histCurrentPage - 1) * window.histItemsPerPage;
        let endIndex = startIndex + window.histItemsPerPage;
        displayItems = filtered.slice(startIndex, endIndex);
    }

    let fHtml = '';
    displayItems.forEach(h => { 
        let tName = h.type === 'sale' ? (d.logSale||'លក់ចេញ') : (h.type === 'add' ? (d.logAdd||'នាំចូលថ្មី') : (d.logUpdate||'កែប្រែទិន្នន័យ')); 
        let bClass = h.type === 'sale' ? 'badge-sale' : (h.type === 'add' ? 'badge-add' : 'badge-update'); 
        let catStr = '-', unitStr = ''; 
        const pItem = (window.inventory || []).find(i => i && i.name === h.itemName); 
        if(pItem) { catStr = pItem.category||'-'; unitStr = pItem.unit ? ' ' + pItem.unit : ''; }
        
        let qtyDisplay = h.qty === 0 ? '0' : `${h.qty > 0 ? '+' : (h.type === 'sale'?'-':'')}${Math.abs(h.qty)}${unitStr}`; 
        fHtml += `<tr><td data-sort="${h.id}" style="font-size:var(--fs-12); color:var(--text-muted);">${h.date}</td><td data-sort="${tName}"><span class="badge ${bClass}">${tName}</span></td><td data-sort="${h.itemName}" style="font-weight:bold; color:var(--text-main);">${h.itemName}</td><td data-sort="${catStr}" style="font-size:var(--fs-12); color:var(--text-muted);">${catStr}</td><td data-sort="${h.qty}" style="font-weight:bold; color:${h.type === 'sale' ? 'var(--warning)' : (h.qty > 0 ? 'var(--success)' : 'var(--text-main)')};">${qtyDisplay}</td><td data-sort="${h.note||''}" style="font-size:var(--fs-12);">${h.note||''}</td></tr>`; 
    });
    
    hTable.innerHTML = fHtml;
    
    if (pageContainer) {
        if (window.histItemsPerPage === 'all' || totalItems <= window.histItemsPerPage) {
            pageContainer.innerHTML = '';
        } else {
            let pageHtml = `<button class="btn btn-outline" ${window.histCurrentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : `onclick="window.changeHistoryPage(${window.histCurrentPage - 1})"`}>◀ មុន</button>`;
            pageHtml += `<span style="font-weight:bold; font-size:var(--fs-14);">ទំព័រ ${window.histCurrentPage} នៃ ${totalPages} <small style="color:var(--text-muted); font-weight:normal;">(សរុប ${totalItems} កំណត់ត្រា)</small></span>`;
            pageHtml += `<button class="btn btn-outline" ${window.histCurrentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : `onclick="window.changeHistoryPage(${window.histCurrentPage + 1})"`}>បន្ទាប់ ▶</button>`;
            pageContainer.innerHTML = pageHtml;
        }
    }

    if(typeof window.filterTable === 'function') setTimeout(() => window.filterTable('mainHistoryTable'), 50);
};

window.clearHistory = function() { 
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
    if(typeof window.ksMsg==='function') {
        window.ksMsg(d.confirmClearHistory || 'តើអ្នកពិតជាចង់លុបប្រវត្តិប្រតិបត្តិការទាំងអស់មែនទេ?', d.confirmDeleteTitle || 'បញ្ជាក់ការលុប', true, async () => { 
            window.historyLog.length = 0; 
            localStorage.setItem('history_cleared_time', Date.now());
            if(typeof window.saveData==='function') await window.saveData(window.userAccounts); 
            
            if (window.supabaseClient && navigator.onLine) {
                try {
                    const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
                    await window.supabaseClient.from('pos_history_logs').delete().eq('branch_id', branchId);
                } catch(e) {}
            }
            window.renderHistory();
        }); 
    }
};

// ==========================================
// 17. EXPORT & IMPORT UTILITIES (JSON BACKUP)
// ==========================================
window.exportData = function() { 
    const dataToBackup = { 
        inventory: window.inventory, 
        historyLog: window.historyLog, 
        invoices: window.invoices, 
        expenses: window.expenses, 
        shopName: window.shopName, 
        shopLogo: window.shopLogo, 
        shopQR: window.shopQR, 
        shopPhone: window.shopPhone, 
        shopAddress: window.shopAddress, 
        shopTelegram: window.shopTelegram,
        telegramBotToken: window.telegramBotToken,
        telegramChatId: window.telegramChatId,
        customers: window.customers, 
        sysSettings: window.sysSettings, 
        userAccounts: window.userAccounts, 
        customPosScripts: window.customPosScripts || [],
        invoiceCounter: JSON.parse(localStorage.getItem(window.getBranchKey('invoice_counter'))) 
    }; 
    const a = document.createElement("a"); 
    a.href = URL.createObjectURL(new Blob([JSON.stringify(dataToBackup, null, 2)], { type: "application/json" })); 
    a.download = `SKM_INTEGRATE_${window.SHOP_BRANCH_ID}_Backup.json`; 
    a.click(); 
};

window.importData = function(e) {
    const file = e.target.files[0]; if (!file) return; 
    const r = new FileReader();
    r.onload = async (ev) => {
        try {
            const data = JSON.parse(ev.target.result);
            if(data.inventory) { 
                window.inventory.splice(0, window.inventory.length, ...(data.inventory||[])); 
                window.historyLog.splice(0, window.historyLog.length, ...(data.historyLog||[])); 
                window.invoices.splice(0, window.invoices.length, ...(data.invoices||[])); 
                window.customers.splice(0, window.customers.length, ...(data.customers||[])); 
                window.expenses.splice(0, window.expenses.length, ...(data.expenses||[]));
                
                if(data.shopName) window.shopName = data.shopName; 
                if(data.shopLogo) window.shopLogo = data.shopLogo; 
                if(data.shopQR) window.shopQR = data.shopQR; 
                if(data.shopPhone) window.shopPhone = data.shopPhone; 
                if(data.shopAddress) window.shopAddress = data.shopAddress;
                if(data.shopTelegram) window.shopTelegram = data.shopTelegram;
                if(data.telegramBotToken) window.telegramBotToken = data.telegramBotToken;
                if(data.telegramChatId) window.telegramChatId = data.telegramChatId;
                
                if(data.sysSettings) Object.assign(window.sysSettings, data.sysSettings); 
                if(data.userAccounts) window.userAccounts.splice(0, window.userAccounts.length, ...data.userAccounts); 
                if(data.customPosScripts) window.customPosScripts = data.customPosScripts;
                
                if(data.invoiceCounter) localStorage.setItem(window.getBranchKey('invoice_counter'), JSON.stringify(data.invoiceCounter));
            } else if(Array.isArray(data)) {
                window.inventory.splice(0, window.inventory.length, ...data);
            }
            
            if (window.supabaseClient && navigator.onLine) {
                try {
                    const bId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
                    const nowIso = new Date().toISOString();
                    if (Array.isArray(window.inventory) && window.inventory.length > 0) {
                        const prodRows = window.inventory.filter(Boolean).map(p => ({
                            id: String(p.id), branch_id: bId, name: p.name || '', category: p.category || '',
                            cost: parseFloat(p.cost) || 0, price: parseFloat(p.price) || 0, riel: parseFloat(p.riel) || 0,
                            qty: parseInt(p.qty) || 0, unit: p.unit || '', condition: p.condition || '',
                            expiry: p.expiry || '', image: p.image || '', description: p.description || p.desc || '',
                            custom_id: p.customId || p.id, updated_at: nowIso
                        }));
                        for (let k = 0; k < prodRows.length; k += 100) {
                            await window.supabaseClient.from('pos_products').upsert(prodRows.slice(k, k + 100), { onConflict: 'id' });
                        }
                    }
                    if (Array.isArray(window.invoices) && window.invoices.length > 0) {
                        const ordRows = window.invoices.filter(Boolean).map(o => ({
                            id: String(o.id || o.invoiceNo), branch_id: bId, customer_name: o.customerName || o.customer || 'អតិថិជនទូទៅ',
                            customer_phone: o.customerPhone || o.phone || '', total_amount: parseFloat(o.totalAmount || o.total || 0),
                            paid_amount: parseFloat(o.paidUsd || o.paidAmount || 0), status: o.status || 'unpaid',
                            seller: o.seller || '', order_data: o.items || [], note: o.note || '', timestamp: o.timestamp || Date.now()
                        }));
                        for (let k = 0; k < ordRows.length; k += 100) {
                            await window.supabaseClient.from('pos_orders').upsert(ordRows.slice(k, k + 100), { onConflict: 'id' });
                        }
                    }
                    if (Array.isArray(window.customers) && window.customers.length > 0) {
                        const custRows = window.customers.filter(Boolean).map(c => ({
                            id: String(c.id), branch_id: bId, name: c.name || '', phone: c.phone || ''
                        }));
                        for (let k = 0; k < custRows.length; k += 100) {
                            await window.supabaseClient.from('pos_customers').upsert(custRows.slice(k, k + 100), { onConflict: 'id' });
                        }
                    }
                    if (Array.isArray(window.expenses) && window.expenses.length > 0) {
                        const expRows = window.expenses.filter(Boolean).map(ex => ({
                            id: String(ex.id), branch_id: bId, category: ex.category || 'ចំណាយផ្សេងៗ',
                            amount: parseFloat(ex.amount) || 0, note: ex.note || '', timestamp: ex.timestamp || Date.now(), date: ex.date || ''
                        }));
                        for (let k = 0; k < expRows.length; k += 100) {
                            await window.supabaseClient.from('pos_expenses').upsert(expRows.slice(k, k + 100), { onConflict: 'id' });
                        }
                    }
                } catch(syncErr) {
                    console.warn("Restore Cloud table sync warning:", syncErr);
                }
            }
            if(typeof window.saveData==='function') await window.saveData(window.userAccounts); 
            localStorage.setItem(window.getBranchKey('auth_users_pro'), JSON.stringify(window.userAccounts)); 
            
            const dShopName = document.getElementById('displayShopName');
            if(dShopName) dShopName.innerHTML = `${window.shopName} <i id="editShopIcon" style="font-size:var(--fs-12); color:var(--text-muted); font-style: normal;">✏️</i>`; 
            
            const sLogo = document.getElementById('sidebarLogo');
            if(window.shopLogo && sLogo) { 
                sLogo.src = window.shopLogo; 
                sLogo.style.display = 'block'; 
            }
            
            if(typeof window.loadSettingsToUI==='function') window.loadSettingsToUI(); 
            if(typeof window.applyPermissions==='function') window.applyPermissions(); 
            if(typeof window.renderDashboard==='function') window.renderDashboard();
            if(typeof window.ksMsg==='function') window.ksMsg('ទិន្នន័យទាំងអស់ត្រូវបាន Restore ជោគជ័យ!', 'ជោគជ័យ');
        } catch(err) { 
            if(typeof window.ksMsg==='function') window.ksMsg('ឯកសារមិនត្រឹមត្រូវតាមទម្រង់ទេ!', 'បរាជ័យ'); 
        } 
        e.target.value = '';
    }; 
    r.readAsText(file);
};

window.toggleLowStockSection = function() {
    const container = document.getElementById('lowStockCardContainer');
    if (!container) return;
    if (container.style.display === 'none') {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
};

window.runSmartDatabaseMaintenance = function() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const lastBackup = localStorage.getItem('skm_last_auto_backup_date');
        
        if (lastBackup !== today) {
            const backupData = {
                inventory: window.inventory || [],
                invoices: window.invoices || [],
                customers: window.customers || [],
                expenses: window.expenses || [],
                historyLog: window.historyLog || [],
                date: today
            };
            localStorage.setItem(`skm_auto_backup_${today}`, JSON.stringify(backupData));
            localStorage.setItem('skm_last_auto_backup_date', today);
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('skm_auto_backup_')) {
                    const bDateStr = key.replace('skm_auto_backup_', '');
                    const bDate = new Date(bDateStr);
                    const now = new Date();
                    const diffDays = Math.ceil((now - bDate) / (1000 * 60 * 60 * 24));
                    if (diffDays > 7) localStorage.removeItem(key);
                }
            }
            console.log("✅ Daily Auto-Backup Completed.");
        }

        if (window.invoices && window.invoices.length > 3000) {
            if (window.currentRole === 'admin') {
                setTimeout(() => {
                    const lang = localStorage.getItem('app_lang') || 'km';
                    const msg = lang === 'en' ? "⚠️ Database is getting large (>3000 invoices). Please go to Settings > Backup & Restore to Archive old data and speed up the system." : "⚠️ ទិន្នន័យវិក្កយបត្រកើនឡើងដល់ជាង ៣០០០ កំណត់ត្រាហើយ! សូមចូលទៅកាន់ផ្ទាំង Settings > Backup & Restore ដើម្បី Archive (សម្អាត) ទិន្នន័យចាស់ៗចេញ ដើម្បីឱ្យប្រព័ន្ធដើរលឿន។";
                    if(typeof window.ksMsg === 'function') window.ksMsg(msg, "ប្រព័ន្ធជូនដំណឹង (Database Alert)");
                }, 5000);
            }
        }
    } catch (e) {
        console.warn("Auto Maintenance Error:", e);
    }
};

// ==========================================
// 18. APP ENTRY POINT (Window.onload)
// ==========================================
window.onload = async () => {
    if(typeof window.loadThemeSettings==='function') window.loadThemeSettings();
    if(typeof window.applyPosLuxuryTheme==='function') window.applyPosLuxuryTheme();
    
    window.inventory = JSON.parse(localStorage.getItem(window.getBranchKey('inv_pro'))) || [];
    window.invoices = JSON.parse(localStorage.getItem(window.getBranchKey('invoices_pro'))) || [];
    window.expenses = JSON.parse(localStorage.getItem(window.getBranchKey('expenses_pro'))) || [];
    window.customers = JSON.parse(localStorage.getItem(window.getBranchKey('customers_pro'))) || [];

    const savedLang = localStorage.getItem('app_lang') || 'km';
    const langSel = document.getElementById('globalLangSelect');
    if (langSel) langSel.value = savedLang;
    if(typeof window.changeAppLanguage==='function') window.changeAppLanguage(savedLang);

    if(typeof window.checkAuthentication==='function') {
        window.checkAuthentication(); 
    }
    
    if(typeof window.checkLicense==='function') {
        const isLicenseValid = await window.checkLicense();
        if (!isLicenseValid) return; 
    }

    // ⚡ Low-Egress Startup: Sync តែ ១ ដងគត់ពេលបើក App (មិនទាញជាន់គ្នា ២ ដងទេ)
    if (typeof window.manualCloudSync === 'function') {
        await window.manualCloudSync(true);
    }

    setInterval(() => {
        const dateEl = document.getElementById('currentDate');
        if(dateEl && typeof window.fDate === 'function') dateEl.innerText = window.fDate();
    }, 1000);

    try { 
        window.currentInventoryView = localStorage.getItem(window.getBranchKey('inv_view_mode')) || 'grid'; 
        window.currentPOSView = localStorage.getItem(window.getBranchKey('pos_view_mode')) || 'grid'; 
    } catch(e) {}
    
    window.shopName = localStorage.getItem(window.getBranchKey('shop_name')) || '';
    window.shopLogo = localStorage.getItem(window.getBranchKey('shop_logo')) || '';
    window.shopQR = localStorage.getItem(window.getBranchKey('shop_qr')) || '';
    window.shopPhone = localStorage.getItem(window.getBranchKey('shop_phone')) || '';
    window.shopAddress = localStorage.getItem(window.getBranchKey('shop_address')) || '';
    window.shopTelegram = localStorage.getItem(window.getBranchKey('shop_telegram')) || '';
    window.telegramBotToken = localStorage.getItem(window.getBranchKey('telegram_bot_token')) || '';
    window.telegramChatId = localStorage.getItem(window.getBranchKey('telegram_chat_id')) || '';

    const dispName = document.getElementById('displayShopName');
    if(dispName) dispName.innerHTML = `${window.shopName || 'SKM INTEGRATE'} <i id="editShopIcon" style="font-size:var(--fs-12); color:var(--text-muted); font-style: normal;">✏️</i>`; 
    
    const sideLogo = document.getElementById('sidebarLogo');
    if(window.shopLogo && sideLogo) { 
        sideLogo.src = window.shopLogo; 
        sideLogo.style.display = 'block'; 
    } 
    
    if(typeof window.loadSettingsToUI==='function') window.loadSettingsToUI(); 
    if(typeof window.applyPermissions==='function') window.applyPermissions(); 
    if(typeof window.updateCategories==='function') window.updateCategories(); 
    if(typeof window.setInventoryView==='function') window.setInventoryView(window.currentInventoryView, true); 
    if(typeof window.setPOSView==='function') window.setPOSView(window.currentPOSView, true); 
    
    const savedTab = localStorage.getItem('skm_last_active_tab') || 'dashboard';
    const navElem = document.getElementById('nav-' + savedTab);
    if (typeof window.switchTab === 'function') {
        window.switchTab(savedTab, '', navElem);
    } else if(typeof window.renderDashboard === 'function') {
        window.renderDashboard();
    }

    const header = document.getElementById('topHeaderBar'); 
    if (header) { header.classList.remove('hidden-header'); } 
    window.lastInvoiceCount = window.invoices ? window.invoices.length : 0; 
    
    // ⚡ Auto-Sync រៀងរាល់ ៦០ វិនាទី (ឆែកតែ updated_at ~50 bytes និងផ្អាកពេលបិទ Tab)
    setInterval(() => {
        if (typeof window.manualCloudSync === 'function' && !document.hidden) {
            window.manualCloudSync(true);
        }
    }, 60000);

    let lastVisibilityCheck = Date.now();
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && (Date.now() - lastVisibilityCheck) > 15000) {
            lastVisibilityCheck = Date.now();
            if (typeof window.manualCloudSync === 'function') window.manualCloudSync(true);
        }
    }); 

    setTimeout(() => {
        if(typeof window.runSmartDatabaseMaintenance === 'function') {
            window.runSmartDatabaseMaintenance();
        }
    }, 5000);
};

// ==========================================
// 19. Z-REPORT PRINT (End of Day)
// ==========================================
window.printZReport = function() {
    let totalSalesRevenue = 0, totalUnpaid = 0, totalExpenses = 0, totalDiscount = 0;
    let invoiceCount = 0;
    
    const dateFrom = document.getElementById('dashDateFrom');
    const dateTo = document.getElementById('dashDateTo'); 
    
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();

    const fromTime = (dateFrom && dateFrom.value) ? new Date(dateFrom.value).getTime() : startOfDay; 
    const toTime = (dateTo && dateTo.value) ? new Date(dateTo.value).getTime() : endOfDay;
    
    let reportDateStr = (dateFrom && dateFrom.value) ? `${new Date(fromTime).toLocaleDateString('km-KH')} - ${new Date(toTime).toLocaleDateString('km-KH')}` : window.fDate().split(' ')[0];

    (window.invoices || []).forEach(inv => { 
        if (!inv) return;
        let invTime = inv.timestamp || parseInt(String(inv.id).split('_')[1]) || new Date(inv.date || 0).getTime() || 0; 
        if (invTime >= fromTime && invTime <= toTime) { 
            invoiceCount++;
            const st = String(inv.status || 'unpaid').toLowerCase();
            const totAmt = parseFloat(inv.totalAmount || inv.total || 0);
            
            if(st === 'paid') {
                totalSalesRevenue += totAmt; 
            } else { 
                let invPaid = parseFloat(inv.paidUsd || inv.paidAmount || 0); 
                let remaining = totAmt - invPaid; 
                if(remaining > 0) totalUnpaid += remaining; 
                totalSalesRevenue += invPaid; 
            }
            totalDiscount += parseFloat(inv.discount || 0);
        } 
    });

    (window.expenses || []).forEach(exp => {
        if (!exp) return;
        let expTime = exp.timestamp || new Date(exp.date || 0).getTime() || 0;
        if(expTime >= fromTime && expTime <= toTime) totalExpenses += (parseFloat(exp.amount) || 0);
    });

    let netProfit = totalSalesRevenue - totalExpenses;

    let html = `<div style="text-align:center; margin-bottom:10px;">`;
    if(window.shopLogo) html += `<img src="${window.shopLogo}" style="width:60px; height:60px; object-fit:cover; border-radius:50%; margin-bottom:5px; filter:grayscale(100%);">`;
    html += `<h2 style="margin:0; font-size:16px;">${window.shopName || 'ហាងរបស់យើង'}</h2>
            <p style="margin:2px 0; font-size:12px;">របាយការណ៍បិទបញ្ជី (Z-Report)</p>
            <p style="margin:2px 0; font-size:11px;">កាលបរិច្ឆេទ: ${reportDateStr}</p>
            <p style="margin:2px 0; font-size:11px;">អ្នកព្រីន: ${window.activeUser ? window.activeUser.fullName || window.activeUser.username : 'Admin'}</p>
            <p style="margin:2px 0; font-size:11px;">ម៉ោងព្រីន: ${new Date().toLocaleTimeString('km-KH')}</p>
            <div style="border-bottom: 1px dashed #000; margin: 8px 0;"></div></div>
            
            <table style="width:100%; font-size: 13px;">
                <tr><td style="padding:4px 0;">ចំនួនវិក្កយបត្រលក់:</td><td style="text-align:right; font-weight:bold;">${invoiceCount}</td></tr>
                <tr><td style="padding:4px 0;">សរុបប្រាក់បញ្ចុះតម្លៃ:</td><td style="text-align:right;">${window.fMoney(totalDiscount)}</td></tr>
                <tr><td style="padding:4px 0;">ប្រាក់ជំពាក់ (Pending):</td><td style="text-align:right; color:#d97706;">${window.fMoney(totalUnpaid)}</td></tr>
                <tr><td style="padding:4px 0;">ចំណាយសរុប (Expense):</td><td style="text-align:right; color:#dc2626;">-${window.fMoney(totalExpenses)}</td></tr>
                <tr><td colspan="2"><div style="border-bottom: 1px dashed #000; margin: 4px 0;"></div></td></tr>
                <tr><td style="padding:4px 0; font-weight:bold; font-size:14px;">ចំណូលលក់បាន:</td><td style="text-align:right; font-weight:bold; font-size:14px;">${window.fMoney(totalSalesRevenue)}</td></tr>
                <tr><td style="padding:4px 0; font-weight:900; font-size:16px;">សាច់ប្រាក់សុទ្ធ:</td><td style="text-align:right; font-weight:900; font-size:16px;">${window.fMoney(netProfit)}</td></tr>
            </table>
            
            <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
            <p style="text-align:center; font-size:11px; margin-top: 10px; font-weight:bold;">*** ចុងបញ្ចប់របាយការណ៍ ***</p>`;

    if (typeof window.executePrint === 'function') {
        window.executePrint(html);
    } else {
        const printWindow = window.open('', '', 'width=300,height=600');
        if(!printWindow) return;
        printWindow.document.write('<html><head><title>Print Z-Report</title><style>@media print { body { width: 80mm; font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } }</style></head><body><div id="receipt-container">');
        printWindow.document.write(html);
        printWindow.document.write('</div></body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    }
};

// ==========================================
// 20. UI/UX PATCHES & BUG FIXES (Import/Export UI & PIN Pad)
// ==========================================
(function applyGlobalFixes() {
    const styleFix = document.createElement('style');
    styleFix.innerHTML = `
        #inventoryExcelAction {
            display: inline-flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            width: auto !important;
            padding: 0 !important;
        }
        #inventoryExcelAction button {
            flex: 0 0 auto !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
            padding: 8px 14px !important;
            white-space: nowrap !important;
            position: relative !important;
            overflow: hidden !important;
            min-width: auto !important;
            border-radius: 8px !important;
        }
        @media (max-width: 640px) {
            #inventoryExcelAction { width: 100% !important; }
            #inventoryExcelAction button { flex: 1 !important; }
            #inventoryActionButtonsGroup #btnAddNewProduct { width: 100% !important; justify-content: center !important; }
        }
        #inventoryExcelAction button img,
        #inventoryExcelAction button i,
        #inventoryExcelAction button svg {
            position: static !important;
            left: auto !important;
            right: auto !important;
            top: auto !important;
            margin: 0 !important;
            transform: none !important;
            display: block !important;
        }
    `;
    document.head.appendChild(styleFix);

    const fixPinInputs = () => {
        const pinInputs = document.querySelectorAll('input[type="password"], input[id*="pin" i], input[id*="Pin" i]');
        pinInputs.forEach(input => {
            input.setAttribute('autocomplete', 'new-password');
            input.setAttribute('spellcheck', 'false');
        });
    };

    let lastClickTime = 0;
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (btn && btn.innerText) {
            let txt = btn.innerText.trim();
            if (txt.length === 1 || txt === 'X' || txt === '⌫' || txt.includes('Del')) {
                const now = Date.now();
                if (now - lastClickTime < 50) { 
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                lastClickTime = now;
            }
        }
    }, true);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixPinInputs);
    } else {
        fixPinInputs();
    }
})();

// ==========================================
// 🌟 មុខងារកាត់ស្តុកផ្ទាល់ពី Cloud (ការពារស្តុកជាន់គ្នា ១០០% - Single Atomic Path)
// ==========================================
window.realtimeCloudDeduct = async function(soldItems, invoiceId = null) {
    if (!window.supabaseClient || !navigator.onLine || !Array.isArray(soldItems)) return;
    window.__skmDeductedInvoices = window.__skmDeductedInvoices || new Set();
    if (invoiceId && window.__skmDeductedInvoices.has(invoiceId)) {
        console.log("🛡️ ទប់ស្កាត់ការកាត់ស្តុកជាន់គ្នាសម្រាប់វិក្កយបត្រ:", invoiceId);
        return;
    }
    if (invoiceId) window.__skmDeductedInvoices.add(invoiceId);

    const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    
    try {
        for (let item of soldItems) {
            let soldQty = parseInt(item.cartQty || item.qty || 1);
            const { error: rpcError } = await window.supabaseClient.rpc('deduct_stock_safely', {
                p_product_id: item.id,
                p_branch_id: branchId,
                deduct_qty: soldQty
            });

            if (rpcError) {
                let { data: cloudData } = await window.supabaseClient
                    .from('pos_products')
                    .select('qty')
                    .eq('id', item.id)
                    .eq('branch_id', branchId)
                    .maybeSingle();
                    
                if (cloudData) {
                    let currentCloudQty = parseInt(cloudData.qty) || 0;
                    let newQty = Math.max(0, currentCloudQty - soldQty);
                    await window.supabaseClient
                        .from('pos_products')
                        .update({ qty: newQty })
                        .eq('id', item.id)
                        .eq('branch_id', branchId);
                    let localItem = (window.inventory || []).find(i => String(i.id) === String(item.id));
                    if (localItem) localItem.qty = newQty;
                }
            }
        }
        
        localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
        if (typeof window.renderInventory === 'function') window.renderInventory();
        if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
        
    } catch (err) {
        console.error("Cloud Deduction Error:", err);
    }
};

window.updateReceiptDropdownOptions = function() {
    const select = document.getElementById('setReceiptSize');
    if (!select) return;

    select.innerHTML = `
        <option value="80mm">📄 ខ្នាត 80mm (ម៉ាស៊ីនព្រីនធំស្តង់ដារ)</option>
        <option value="58mm">🧾 ខ្នាត 57x40mm / 58mm (ម៉ាស៊ីនព្រីនតូច)</option>
        <option value="A4">📋 ខ្នាតក្រដាសធម្មតា A4 (វិក្កយបត្រធំ)</option>
        <option value="custom">⚙️ សរសេរទំហំខ្លួនឯងតាមចិត្ត (Custom)</option>
    `;

    if (window.sysSettings && Array.isArray(window.sysSettings.customPrinterPresets)) {
        window.sysSettings.customPrinterPresets.forEach(preset => {
            if (preset && preset.id) {
                const opt = document.createElement('option');
                opt.value = preset.id;
                opt.text = `🖨️ ${preset.name || 'Custom Preset'} (${preset.paperMm}mm | ${preset.downloadWidthPx}px)`;
                select.appendChild(opt);
            }
        });
    }

    if (window.sysSettings && window.sysSettings.receiptSize) {
        select.value = window.sysSettings.receiptSize;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(window.updateReceiptDropdownOptions, 500);
});
window.addEventListener('visibilitychange', function() {
    if (!document.hidden) setTimeout(window.updateReceiptDropdownOptions, 500);
});