// main.js

// ==========================================
// 1. BIND UTILS & CONFIGS TO WINDOW
// ==========================================
window.fDate = window.fDate;
window.fMoney = window.fMoney;
window.showToast = window.showToast;
window.playBeep = window.playBeep;
window.playOrderSound = window.playOrderSound;
window.ksMsg = window.ksMsg;

// ==========================================
// 2. LIVE SYNC STATUS INDICATOR (ផ្លាកសញ្ញា SYNC មើលឃើញច្បាស់ ១០០%)
// ==========================================
window.setSyncStatus = function(status, text) {
    let badge = document.getElementById('globalSyncBadge');
    if (!badge) {
        const header = document.getElementById('topHeaderBar') || document.querySelector('header');
        if (header) {
            badge = document.createElement('div');
            badge.id = 'globalSyncBadge';
            badge.style.cssText = 'display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-left: 10px; transition: all 0.3s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.15); backdrop-filter: blur(4px);';
            header.appendChild(badge);
        }
    }
    if (!badge) return;

    if (status === 'syncing') {
        badge.style.background = 'rgba(0, 0, 0, 0.35)';
        badge.style.color = '#fde047';
        badge.style.border = '1px solid #eab308';
        badge.innerHTML = '🟡 កំពុង Sync...';
    } else if (status === 'synced') {
        badge.style.background = 'rgba(0, 0, 0, 0.3)';
        badge.style.color = '#ffffff';
        badge.style.border = '1px solid rgba(255, 255, 255, 0.4)';
        badge.innerHTML = `🟢 ${text || 'ទិន្នន័យទាន់សម័យ'}`;
    } else if (status === 'error') {
        badge.style.background = 'rgba(220, 38, 38, 0.85)';
        badge.style.color = '#ffffff';
        badge.style.border = '1px solid #f87171';
        badge.innerHTML = `🔴 ${text || 'Sync បរាជ័យ'}`;
    }
};

// ==========================================
// 3. MASTER REAL-TIME DATA SAVE & SYNC
// ==========================================
window.saveData = async function(users) {
    window.setSyncStatus('syncing');

    if (users) {
        window.userAccounts = users;
        localStorage.setItem(window.getBranchKey('auth_users_pro'), JSON.stringify(users));
    }

    const cleanInventory = (window.inventory || []).filter(item => item !== null && typeof item === 'object');
    
    // ១. រក្សាទុកក្នុង LocalStorage ភ្លាមៗ (ធានាថា Refresh ក៏មិនបាត់)
    localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(cleanInventory));
    localStorage.setItem(window.getBranchKey('hist_pro'), JSON.stringify(window.historyLog || []));
    localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(window.invoices || []));
    localStorage.setItem(window.getBranchKey('expenses_pro'), JSON.stringify(window.expenses || []));
    localStorage.setItem(window.getBranchKey('customers_pro'), JSON.stringify(window.customers || []));
    localStorage.setItem(window.getBranchKey('sys_settings'), JSON.stringify(window.sysSettings || {}));

    const fullPayload = {
        inventory: cleanInventory,
        historyLog: window.historyLog || [],
        invoices: window.invoices || [],
        expenses: window.expenses || [],
        shopName: window.shopName || '',
        shopLogo: window.shopLogo || '',
        shopQR: window.shopQR || '',
        shopPhone: window.shopPhone || '',
        shopAddress: window.shopAddress || '',
        customers: window.customers || [],
        sysSettings: window.sysSettings || {},
        userAccounts: window.userAccounts || users || [],
        invoiceCounter: JSON.parse(localStorage.getItem(window.getBranchKey('invoice_counter'))) || 1
    };

    // ២. ផ្ញើទៅកាន់ Supabase Cloud
    if (!window.supabaseClient || !navigator.onLine) {
        window.setSyncStatus('error', 'រក្សាទុកតែក្នុងម៉ាស៊ីន (Offline)');
        return;
    }

    try {
        const { error } = await window.supabaseClient
            .from('branch_store')
            .upsert({
                branch_id: window.SHOP_BRANCH_ID,
                data_json: fullPayload,
                updated_at: new Date().toISOString()
            }, { onConflict: 'branch_id' });

        if (error) throw error;
        
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
        window.setSyncStatus('synced', `Synced: ${timeStr}`);
    } catch (err) {
        console.error("❌ Supabase Sync Error:", err);
        window.setSyncStatus('error', 'Sync បរាជ័យ');
    }
};

// ==========================================
// 4. BIND AUTH & USER MANAGEMENT
// ==========================================
const _origLogin = window.handleLogin;
const _origLogout = window.handleLogout;
const _origChangePassword = window.handleChangePassword;
const _origResetPassword = window.handleResetPassword;
const _origSaveNewUser = window.saveNewUser;
const _origDeleteUser = window.deleteUserAccount;

window.handleLogin = () => {
    if (typeof _origLogin === 'function') {
        _origLogin(window.checkAuthentication, window.switchTab);
    }
    
    const applyAuthImmediate = () => {
        if (typeof window.checkAuthentication === 'function') {
            window.checkAuthentication(window.applyPermissions);
        }
        if (typeof window.applyPermissions === 'function') {
            window.applyPermissions();
        }
        if (window.currentRole === 'sales') {
            window.switchTab('pos', '🛒 ប្រព័ន្ធលក់ (POS)', document.getElementById('nav-pos'));
        } else if (window.currentRole === 'warehouse') {
            window.switchTab('inventory', '📦 គ្រប់គ្រងស្តុក (Inventory)', document.getElementById('nav-inventory'));
        }
        window.renderAll();
    };

    setTimeout(applyAuthImmediate, 30);
    setTimeout(applyAuthImmediate, 120);
};

window.handleLogout = () => {
    if (typeof _origLogout === 'function') {
        _origLogout(window.checkAuthentication);
    }
    setTimeout(() => {
        if (typeof window.checkAuthentication === 'function') {
            window.checkAuthentication(window.applyPermissions);
        }
        if (typeof window.applyPermissions === 'function') {
            window.applyPermissions();
        }
        window.renderAll();
    }, 50);
};

window.handleChangePassword = async function() {
    if (typeof _origChangePassword === 'function') {
        _origChangePassword();
        await window.saveData(window.userAccounts);
    }
};

window.handleResetPassword = async function() {
    if (typeof _origResetPassword === 'function') {
        _origResetPassword();
        await window.saveData(window.userAccounts);
    }
};

window.saveNewUser = async function() {
    if (typeof _origSaveNewUser === 'function') {
        _origSaveNewUser();
        await window.saveData(window.userAccounts);
    }
};

window.deleteUserAccount = async function(index) {
    if (typeof _origDeleteUser === 'function') {
        _origDeleteUser(index);
        await window.saveData(window.userAccounts);
    }
};

window.toggleForgotPass = window.toggleForgotPass;
window.openUserModal = window.openUserModal;
window.editUserAccount = window.editUserAccount;
window.closeUserModal = window.closeUserModal;

// ==========================================
// 5. BIND THEME TO WINDOW
// ==========================================
window.toggleTheme = window.toggleTheme;
window.handleCustomColor = window.handleCustomColor;

// ==========================================
// 6. BIND INVENTORY TO WINDOW
// ==========================================
window.renderInventory = window.renderInventory;
window.updateQty = window.updateQty;
window.generateProductBarcode = window.generateProductBarcode;
window.openProductModal = window.openProductModal;
window.closeModal = window.closeModal;
window.updateImagePreview = window.updateImagePreview;
window.handleImage = window.handleImage;
window.saveProduct = window.saveProduct;
window.editProduct = window.editProduct;
window.deleteProduct = window.deleteProduct;
window.setInventoryView = window.setInventoryView;
window.exportCSV = window.exportCSV;

// ==========================================
// 7. BIND POS TO WINDOW
// ==========================================
window.setPosCategory = window.setPosCategory;
window.setPOSView = window.setPOSView;
window.renderPOSProducts = window.renderPOSProducts;
window.addToCart = window.addToCart;
window.updateCartQty = window.updateCartQty;
window.setCartQtyManually = window.setCartQtyManually;
window.renderCart = window.renderCart;
window.clearCart = window.clearCart;
window.toggleCartSummary = window.toggleCartSummary;
window.openCheckoutModal = window.openCheckoutModal;
window.calculateChange = window.calculateChange;
window.processCheckoutPaid = window.processCheckoutPaid;
window.openPreorderModal = window.openPreorderModal;
window.calculatePreorderRemaining = window.calculatePreorderRemaining;
window.processPreorder = window.processPreorder;
window.handleBarcodeScan = window.handleBarcodeScan;

// ==========================================
// 8. BIND FINANCE TO WINDOW
// ==========================================
window.renderUnpaid = window.renderUnpaid;
window.exportInvoicesCSV = window.exportInvoicesCSV;
window.settlePayment = window.settlePayment;
window.calculateDebtChange = window.calculateDebtChange;
window.processDebtPayment = window.processDebtPayment;
window.openExpenseModal = window.openExpenseModal;
window.closeExpenseModal = window.closeExpenseModal;
window.saveExpense = window.saveExpense;
window.renderExpenses = window.renderExpenses;
window.deleteExpense = window.deleteExpense;
window.viewInvoice = window.viewInvoiceDetails || window.viewInvoice;
window.closeInvoiceViewModal = window.closeInvoiceViewModal;
window.reprintInvoice = window.reprintInvoice;
window.downloadInvoicePNG = window.downloadInvoicePNG;
window.openInvoiceEdit = window.openInvoiceEditModal || window.openInvoiceEdit;
window.closeInvoiceEditModal = window.closeInvoiceEditModal;
window.updateEditInvQty = window.updateEditInvoiceItemQty || window.updateEditInvQty;
window.removeEditInvItem = window.removeEditInvoiceItem || window.removeEditInvItem;
window.addItemToEditingInvoice = window.addItemToEditingInvoice;
window.saveInvoiceChanges = window.saveInvoiceChanges;
window.deleteInvoice = window.deleteInvoiceRecord || window.deleteInvoice;

// ==========================================
// 9. BIND CUSTOMER TO WINDOW
// ==========================================
window.updateCustomerDatalist = window.updateCustomerDatalist;
window.autoFillCustomerPhone = window.autoFillCustomerPhone;
window.renderCustomers = window.renderCustomers;
window.openCustomerModal = window.openCustomerModal;
window.closeCustomerModal = window.closeCustomerModal;
window.viewCustomerHistory = window.viewCustomerHistory;
window.closeCustomerHistoryModal = window.closeCustomerHistoryModal;
window.saveCustomer = window.saveCustomer;
window.editCustomer = window.editCustomer;
window.deleteCustomer = window.deleteCustomer;
window.exportCustomers = window.exportCustomers;
window.importCustomers = window.importCustomers;

// ==========================================
// 10. GLOBAL UI & APP FLOW METHODS
// ==========================================
window.switchTab = function(tabId, title, elem) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active')); 
    if(elem) elem.classList.add('active'); 
    document.getElementById('pageTitle').innerText = title;
    
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active')); 
    if(document.getElementById('tab-' + tabId)) {
        document.getElementById('tab-' + tabId).classList.add('active');
    }
    
    const header = document.getElementById('topHeaderBar');
    if(header) header.classList.remove('hidden-header');

    if(window.innerWidth <= 768) { 
        const sidebar = document.getElementById('appSidebar');
        if(sidebar) sidebar.classList.remove('active-mobile'); 
        const overlay = document.querySelector('.sidebar-overlay');
        if(overlay) overlay.classList.remove('active'); 
    } 
    
    if (tabId === 'about' && typeof window.displayLicenseInfo === 'function') {
        window.displayLicenseInfo();
    }
    
    window.renderAll();
};

window.applyPermissions = function() {
    try {
        const rawSession = localStorage.getItem(window.getBranchKey('auth_session_user')) || localStorage.getItem('auth_session_user');
        if (rawSession) {
            const sess = JSON.parse(rawSession);
            if (sess && sess.role) {
                window.currentRole = String(sess.role).toLowerCase().trim();
            }
        }
    } catch(e) {}

    if (!window.currentRole) window.currentRole = 'admin';

    const isAdmin = (window.currentRole === 'admin');
    const isSales = (window.currentRole === 'sales');
    const isWarehouse = (window.currentRole === 'warehouse');
    const isGuest = (window.currentRole === 'guest');

    let sDash = !isGuest && true;
    let sInv = !isGuest && (isAdmin || isWarehouse);
    let sPOS = !isGuest && (isAdmin || isSales);
    let sCust = !isGuest && (isAdmin || (isSales && (window.sysSettings?.cust !== false)));
    let sUnpaid = !isGuest && (isAdmin || (isSales && (window.sysSettings?.unpaid !== false)));
    let sExp = !isGuest && isAdmin;
    let sHist = !isGuest && isAdmin;
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

    const showCost = (window.sysSettings?.cost !== false) && isAdmin;
    setBlock('costPriceContainer', showCost);
    document.querySelectorAll('.p-cost').forEach(el => el.style.display = showCost ? 'inline' : 'none');

    setBlock('btnAddNewProduct', isAdmin);
    setFlex('inventoryExcelAction', isAdmin);
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

    if (isAdmin) {
        if (typeof window.renderUsersList === 'function') window.renderUsersList();
        if (typeof window.renderUnpaid === 'function') window.renderUnpaid();
        if (typeof window.renderExpenses === 'function') window.renderExpenses();
    }
};

window.loadSettingsToUI = function() { 
    if(!window.sysSettings) return;
    if(document.getElementById('setCust')) document.getElementById('setCust').checked = window.sysSettings.cust; 
    if(document.getElementById('setUnpaid')) document.getElementById('setUnpaid').checked = window.sysSettings.unpaid; 
    if(document.getElementById('setLogs')) document.getElementById('setLogs').checked = window.sysSettings.logs; 
    if(document.getElementById('setCost')) document.getElementById('setCost').checked = window.sysSettings.cost; 
    if(document.getElementById('setDiscount')) document.getElementById('setDiscount').checked = window.sysSettings.discount; 
    if(document.getElementById('setShowSeller')) document.getElementById('setShowSeller').checked = window.sysSettings.showSeller !== false; 
    if(document.getElementById('setTax')) document.getElementById('setTax').checked = window.sysSettings.tax; 
    if(document.getElementById('setTaxRate')) document.getElementById('setTaxRate').value = window.sysSettings.taxRate ? window.sysSettings.taxRate : 10; 
    
    if(document.getElementById('setCondition')) document.getElementById('setCondition').checked = window.sysSettings.condition || false;
    if(document.getElementById('conditionListContainer')) document.getElementById('conditionListContainer').style.display = window.sysSettings.condition ? 'block' : 'none';
    if(document.getElementById('setConditionList')) document.getElementById('setConditionList').value = window.sysSettings.conditionList || 'MISB, Loose, New, Used';
    if(document.getElementById('setPreorder')) document.getElementById('setPreorder').checked = window.sysSettings.preorder || false;
    if(document.getElementById('setDeliveryFee')) document.getElementById('setDeliveryFee').value = window.sysSettings.deliveryFee !== undefined ? window.sysSettings.deliveryFee : 1.5;

    if(document.getElementById('setExpiry')) document.getElementById('setExpiry').checked = window.sysSettings.expiry !== false;
};

window.saveSysSettings = async function() { 
    if(window.currentRole !== 'admin') return window.ksMsg("គ្មានសិទ្ធិកែប្រែការកំណត់ទេ!", "សិទ្ធិមិនគ្រប់គ្រាន់"); 
    
    if(!window.sysSettings) window.sysSettings = {};
    if(document.getElementById('setCust')) window.sysSettings.cust = document.getElementById('setCust').checked; 
    if(document.getElementById('setUnpaid')) window.sysSettings.unpaid = document.getElementById('setUnpaid').checked; 
    if(document.getElementById('setLogs')) window.sysSettings.logs = document.getElementById('setLogs').checked; 
    if(document.getElementById('setCost')) window.sysSettings.cost = document.getElementById('setCost').checked; 
    if(document.getElementById('setDiscount')) window.sysSettings.discount = document.getElementById('setDiscount').checked; 
    if(document.getElementById('setShowSeller')) window.sysSettings.showSeller = document.getElementById('setShowSeller').checked; 
    if(document.getElementById('setTax')) window.sysSettings.tax = document.getElementById('setTax').checked; 
    if(document.getElementById('setTaxRate')) window.sysSettings.taxRate = parseFloat(document.getElementById('setTaxRate').value) || 0; 
    
    if(document.getElementById('setCondition')) window.sysSettings.condition = document.getElementById('setCondition').checked;
    if(document.getElementById('setConditionList')) window.sysSettings.conditionList = document.getElementById('setConditionList').value || 'MISB, Loose, New, Used';
    if(document.getElementById('setPreorder')) window.sysSettings.preorder = document.getElementById('setPreorder').checked;
    if(document.getElementById('setDeliveryFee')) window.sysSettings.deliveryFee = parseFloat(document.getElementById('setDeliveryFee').value) || 0;

    if(document.getElementById('setExpiry')) window.sysSettings.expiry = document.getElementById('setExpiry').checked;

    if(document.getElementById('conditionListContainer')) {
        document.getElementById('conditionListContainer').style.display = window.sysSettings.condition ? 'block' : 'none';
    }
    
    if(typeof window.updateCategories === 'function') window.updateCategories(); 
    if(typeof window.applyPermissions === 'function') window.applyPermissions(); 
    if(typeof window.saveData === 'function') await window.saveData(window.userAccounts); 
    if(typeof window.ksMsg === 'function') window.ksMsg("ការកំណត់ត្រូវបានរក្សាទុក!", "ជោគជ័យ"); 
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
// 11. DATABASE LICENSE SYSTEM
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
            .single();

        if (error || !data) { 
            if (lockScreen) lockScreen.style.display = 'flex'; 
            if (sidebar) sidebar.style.pointerEvents = 'none'; 
            return false; 
        } 

        const expiry = new Date(data.expires_at).getTime();
        if (expiry <= Date.now()) { 
            if (lockScreen) lockScreen.style.display = 'flex'; 
            if (sidebar) sidebar.style.pointerEvents = 'none'; 
            if(typeof window.ksMsg === 'function') window.ksMsg('❌ សិទ្ធិប្រើប្រាស់ប្រព័ន្ធ (License) របស់សាខានេះបានផុតកំណត់ហើយ!', 'ផុតកំណត់'); 
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
    if(!inputKey) return window.ksMsg('សូមបញ្ចូលលេខកូដ (License Key)!'); 

    try { 
        let { data, error } = await window.supabaseClient
            .from('branch_licenses')
            .select('*')
            .eq('branch_id', window.SHOP_BRANCH_ID)
            .eq('license_key', inputKey)
            .eq('is_active', true)
            .single();

        if (error || !data) { 
            return window.ksMsg('❌ លេខកូដ License មិនត្រឹមត្រូវ ឬមិនទាន់ត្រូវបានបើកសិទ្ធិ!', 'បរាជ័យ'); 
        }

        const expiry = new Date(data.expires_at).getTime();
        if (expiry <= Date.now()) { 
            return window.ksMsg('❌ លេខកូដ License នេះបានផុតកំណត់ហើយ!', 'បរាជ័យ'); 
        }

        localStorage.setItem(window.getBranchKey('license_key'), inputKey); 
        window.ksMsg('✅ សិទ្ធិប្រើប្រាស់ត្រូវបានបើកដោយជោគជ័យ!', 'ជោគជ័យ', false, () => { 
            location.reload(); 
        }); 

    } catch(e) { 
        window.ksMsg('❌ មិនអាចភ្ជាប់ទៅកាន់ Server ដើម្បីផ្ទៀងផ្ទាត់ License បានទេ!', 'បរាជ័យ'); 
    } 
};

window.verifyAndSaveLicenseFromAbout = async function() { 
    const inputEl = document.querySelector('#tab-about input');
    const inputKey = inputEl ? inputEl.value.trim() : ''; 
    if(!inputKey) return window.ksMsg('សូមបញ្ចូលលេខកូដ (License Key)!'); 

    try { 
        let { data, error } = await window.supabaseClient
            .from('branch_licenses')
            .select('*')
            .eq('branch_id', window.SHOP_BRANCH_ID)
            .eq('license_key', inputKey)
            .eq('is_active', true)
            .single();

        if (error || !data) { 
            return window.ksMsg('❌ លេខកូដ License មិនត្រឹមត្រូវ ឬមិនទាន់ត្រូវបានបើកសិទ្ធិ!', 'បរាជ័យ'); 
        }

        const expiry = new Date(data.expires_at).getTime();
        if (expiry <= Date.now()) { 
            return window.ksMsg('❌ លេខកូដ License នេះបានផុតកំណត់ហើយ!', 'បរាជ័យ'); 
        }

        localStorage.setItem(window.getBranchKey('license_key'), inputKey); 
        if (inputEl) inputEl.value = '';
        window.ksMsg('✅ សិទ្ធិប្រើប្រាស់ត្រូវបានធ្វើបច្ចុប្បន្នភាពជោគជ័យ!', 'ជោគជ័យ', false, () => { 
            location.reload(); 
        }); 

    } catch(e) { 
        window.ksMsg('❌ មិនអាចភ្ជាប់ទៅកាន់ Server ដើម្បីផ្ទៀងផ្ទាត់ License បានទេ!', 'បរាជ័យ'); 
    } 
};

window.displayLicenseInfo = async function() { 
    const aboutTab = document.getElementById('tab-about');
    if (!aboutTab) return;

    const aboutInputs = aboutTab.querySelectorAll('input');
    aboutInputs.forEach(inp => {
        inp.value = '';
        inp.type = 'password';
        inp.autocomplete = 'off';
        inp.placeholder = 'វាយបញ្ចូល License Key ថ្មីនៅទីនេះ...';
    });

    let targetCard = Array.from(aboutTab.querySelectorAll('div')).find(el => el.innerText && el.innerText.includes('License Status'));
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
                .single();
            if (data) {
                license = data;
                window.activeLicenseData = data;
            }
        }

        if (license && license.expires_at) {
            const expiry = new Date(license.expires_at).getTime(); 
            const expireDate = new Date(expiry); 
            const diffDays = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24)); 
            let statusBadge = ''; 

            if(diffDays > 10) {
                statusBadge = `<span style="display: inline-flex; align-items: center; gap: 4px; color: #059669; font-weight: bold; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 13px;">✅ កំពុងដំណើរការ (សល់ ${diffDays} ថ្ងៃ)</span>`; 
            } else if (diffDays > 0) {
                statusBadge = `<span style="display: inline-flex; align-items: center; gap: 4px; color: #d97706; font-weight: bold; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 13px;">⚠️ ជិតផុតកំណត់ (សល់ ${diffDays} ថ្ងៃ)</span>`; 
            } else {
                statusBadge = `<span style="display: inline-flex; align-items: center; gap: 4px; color: #dc2626; font-weight: bold; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 13px;">❌ ផុតកំណត់ហើយ!</span>`; 
            }

            infoBox.innerHTML = `
                <div style="background: var(--card-bg, #ffffff); border: 1.5px solid var(--border-color, #e2e8f0); padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); color: var(--text-main, #1e293b);">
                    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-color, #cbd5e1); padding-bottom: 12px; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                        <div style="font-size: 15px; font-weight: bold; color: var(--text-main, #0f172a);">
                            🏢 សាខា (Branch)៖ <span style="color: #0284c7; font-weight: 900; background: rgba(2, 132, 199, 0.1); padding: 3px 8px; border-radius: 6px;">${license.branch_id || window.SHOP_BRANCH_ID}</span>
                        </div>
                        <div>${statusBadge}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                        <div style="font-size: 14px; font-weight: bold; color: var(--text-muted, #64748b);">
                            ⏳ ផុតកំណត់នៅថ្ងៃ៖
                        </div>
                        <div style="font-size: 14px; font-weight: 800; color: #b45309; background: #fef3c7; border: 1px solid #fde68a; padding: 6px 14px; border-radius: 8px; box-shadow: 0 2px 5px rgba(245, 158, 11, 0.1);">
                            📅 ${expireDate.toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' })} ម៉ោង ${expireDate.toLocaleTimeString('km-KH')}
                        </div>
                    </div>
                </div>`;
            return;
        }
    } catch(e) {}

    infoBox.innerHTML = `
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 12px; border-radius: 8px; margin-bottom: 15px; color: #d97706; font-size: 13px;">
            ⚠️ មិនទាន់មានទិន្នន័យ License សម្រាប់សាខានេះនៅឡើយទេ។
        </div>`;
};

// ==========================================
// 12. SHOP SETTINGS & ASSETS
// ==========================================
window.openShopNameModal = function() { 
    if(window.currentRole !== 'admin') return window.ksMsg('មានតែគណនី Admin ប៉ុណ្ណោះដែលអាចប្តូរឈ្មោះ និង Logo បានកំរិតខ្ពស់!', 'គ្មានសិទ្ធិ'); 
    document.getElementById('newShopNameInput').value = window.shopName; 
    document.getElementById('newShopPhoneInput').value = window.shopPhone; 
    document.getElementById('newShopAddressInput').value = window.shopAddress; 
    document.getElementById('newShopTelegramInput').value = window.shopTelegram; 
    document.getElementById('newBotTokenInput').value = window.telegramBotToken; 
    document.getElementById('newChatIdInput').value = window.telegramChatId; 
    
    const preview = document.getElementById('shopLogoPreview'); 
    if(window.shopLogo) { preview.src = window.shopLogo; preview.style.display = 'block'; } else preview.style.display = 'none'; 
    
    const qrPreview = document.getElementById('shopQRPreview'); 
    if(window.shopQR) { qrPreview.src = window.shopQR; qrPreview.style.display = 'block'; } else qrPreview.style.display = 'none'; 
    
    document.getElementById('shopNameModal').style.display = 'flex'; 
};

window.closeShopNameModal = function() { 
    document.getElementById('shopNameModal').style.display = 'none'; 
};

window.handleShopLogo = function(e) { 
    const file = e.target.files[0]; if(!file) return; 
    const reader = new FileReader(); 
    reader.onload = (e) => { 
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
        img.src = e.target.result; 
    }; 
    reader.readAsDataURL(file); 
};

window.handleShopQR = function(e) { 
    const file = e.target.files[0]; if(!file) return; 
    const reader = new FileReader(); 
    reader.onload = (e) => { 
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
        img.src = e.target.result; 
    }; 
    reader.readAsDataURL(file); 
};

window.saveShopName = async function() { 
    const newName = document.getElementById('newShopNameInput').value.trim(); 
    const newPhone = document.getElementById('newShopPhoneInput').value.trim(); 
    const newAddress = document.getElementById('newShopAddressInput').value.trim(); 
    const newTelegram = document.getElementById('newShopTelegramInput').value.trim(); 
    const newBotToken = document.getElementById('newBotTokenInput').value.trim(); 
    const newChatId = document.getElementById('newChatIdInput').value.trim(); 
    
    if(newName !== "") { 
        window.updateShopInfo(
            newName, 
            globalThis.shopLogo !== undefined ? globalThis.shopLogo : window.shopLogo, 
            globalThis.shopQR !== undefined ? globalThis.shopQR : window.shopQR, 
            newPhone, 
            newAddress, 
            newTelegram, 
            newBotToken, 
            newChatId
        );
        
        const dispName = document.getElementById('displayShopName');
        if(dispName) dispName.innerHTML = `${window.shopName} <i id="editShopIcon" style="font-size:var(--fs-12); color:var(--text-muted); font-style: normal;">✏️</i>`; 
        const sideLogo = document.getElementById('sidebarLogo');
        if(window.shopLogo && sideLogo) { 
            sideLogo.src = window.shopLogo; 
            sideLogo.style.display = 'block'; 
        } 
        if(typeof window.saveData === 'function') await window.saveData(window.userAccounts); 
        window.closeShopNameModal(); 
        if(typeof window.ksMsg === 'function') window.ksMsg("ព័ត៌មានហាងត្រូវបានរក្សាទុកដោយជោគជ័យ! សូម Refresh ទំព័រ (F5) ដើម្បីឱ្យវាដំណើរការពេញលេញ។", "ជោគជ័យ"); 
    } else {
        if(typeof window.ksMsg === 'function') window.ksMsg("សូមបញ្ចូលឈ្មោះហាងសិន!"); 
    }
};

window.renderAll = function() { 
    if(typeof window.renderDashboard === 'function') window.renderDashboard(); 
    if(typeof window.renderInventory === 'function') window.renderInventory(); 
    if(typeof window.renderPOSProducts === 'function') window.renderPOSProducts(); 
    if(typeof window.renderUnpaid === 'function') window.renderUnpaid(); 
    if(typeof window.renderExpenses === 'function') window.renderExpenses(); 
    if(typeof window.renderHistory === 'function') window.renderHistory(); 
    if(typeof window.renderCustomers === 'function') window.renderCustomers(); 
    if(typeof window.updateCustomerDatalist === 'function') window.updateCustomerDatalist(); 
    if(typeof window.populateEditInvoiceSelect === 'function') window.populateEditInvoiceSelect(); 
    if(typeof window.displayLicenseInfo === 'function') window.displayLicenseInfo(); 
};

window.resetDashboardDate = function() { 
    const dateFrom = document.getElementById('dashDateFrom');
    const dateTo = document.getElementById('dashDateTo');
    if(dateFrom) dateFrom.value = ''; 
    if(dateTo) dateTo.value = ''; 
    if(typeof window.renderDashboard === 'function') window.renderDashboard(); 
};

// ==========================================
// 13. DASHBOARD & REPORTING
// ==========================================
window.renderDashboard = function() {
    try {
        let tItems = (window.inventory || []).length; 
        let tQty = 0, estRev = 0, lowItems = []; 
        (window.inventory || []).forEach(p => { 
            if(!p) return; 
            let q = parseInt(p.qty) || 0; tQty += q; let priceVal = parseFloat(p.price) || 0; estRev += (priceVal * q); 
            if(q <= 5) lowItems.push(p); 
        });
        
        const dateFrom = document.getElementById('dashDateFrom'); const dateTo = document.getElementById('dashDateTo'); 
        const fromTime = (dateFrom && dateFrom.value) ? new Date(dateFrom.value).getTime() : 0; 
        const toTime = (dateTo && dateTo.value) ? new Date(dateTo.value).getTime() : Infinity;
        let totalSalesRevenue = 0, totalUnpaid = 0, totalExpenses = 0, totalCOGS = 0, salesMap = {};
        
        (window.invoices || []).forEach(inv => { 
            if(!inv) return;
            let invTime = inv.timestamp || (inv.date ? new Date(inv.date.split(' ')[0]).getTime() : 0) || 0; 
            if (fromTime === 0 && toTime === Infinity || (invTime >= fromTime && invTime <= toTime)) { 
                if(inv.status === 'paid') totalSalesRevenue += (parseFloat(inv.totalAmount) || parseFloat(inv.total) || 0); 
                if(inv.status === 'unpaid' || inv.status === 'preorder') { 
                    let invPaid = parseFloat(inv.paidUsd || inv.paidAmount || 0); 
                    let remaining = (parseFloat(inv.totalAmount || inv.total || 0)) - invPaid; 
                    if(remaining > 0) totalUnpaid += remaining; 
                    totalSalesRevenue += invPaid; 
                }
                if(inv.items) inv.items.forEach(item => { 
                    if(!item) return; let pId = item.id ? String(item.id) : 'unknown';
                    if(!salesMap[pId]) salesMap[pId] = { name: item.name || item.title, qty: 0, revenue: 0 }; 
                    let qty = parseInt(item.cartQty || item.qty || item.quantity) || 0; let price = parseFloat(item.price) || 0; let cost = parseFloat(item.cost) || 0;
                    salesMap[pId].qty += qty; salesMap[pId].revenue += (price * qty); totalCOGS += (cost * qty);
                }); 
            } 
        });
        (window.expenses || []).forEach(exp => { 
            if(!exp) return;
            let expTime = exp.timestamp || 0; 
            if(fromTime === 0 && toTime === Infinity || (expTime >= fromTime && expTime <= toTime)) {
                totalExpenses += (parseFloat(exp.amount) || 0); 
            }
        });

        let netProfit = totalSalesRevenue - totalCOGS - totalExpenses;
        
        if(document.getElementById('dashTotalItems')) document.getElementById('dashTotalItems').innerText = tItems; 
        if(document.getElementById('dashTotalQty')) document.getElementById('dashTotalQty').innerText = tQty; 
        if(document.getElementById('dashEstRevenue')) document.getElementById('dashEstRevenue').innerText = window.fMoney(estRev); 
        if(document.getElementById('dashTotalRevenue')) document.getElementById('dashTotalRevenue').innerText = window.fMoney(totalSalesRevenue); 
        if(document.getElementById('dashTotalExpenses')) document.getElementById('dashTotalExpenses').innerText = window.fMoney(totalExpenses);
        if(document.getElementById('dashTotalUnpaid')) document.getElementById('dashTotalUnpaid').innerText = window.fMoney(totalUnpaid);
        let netProfitEl = document.getElementById('dashNetProfit');
        if(netProfitEl) { netProfitEl.innerText = window.fMoney(netProfit); netProfitEl.style.color = netProfit >= 0 ? 'var(--success)' : 'var(--danger)'; }
        
        const tbody = document.getElementById('lowStockTable'); 
        if(tbody) { tbody.innerHTML = lowItems.length === 0 ? '<tr><td colspan="4" style="text-align:center; padding:15px;">មិនមានទំនិញជិតអស់ទេ</td></tr>' : lowItems.map(p => { let catStr = p.category ? p.category : '-'; let nameStr = p.name ? String(p.name).replace(/'/g, "\\'") : ''; return `<tr><td>${p.name}</td><td>${catStr}</td><td style="color:${p.qty<=0?'var(--danger)':'var(--warning)'}; font-weight:bold;">${p.qty}</td><td><button class="btn btn-outline" style="padding:4px 8px; font-size:var(--fs-12);" onclick="window.switchTab('inventory','📦 គ្រប់គ្រងស្តុក (Inventory)', document.getElementById('nav-inventory')); document.getElementById('searchInput').value='${nameStr}'; window.renderInventory();">មើល</button></td></tr>`; }).join(''); }
        
        const expirySection = document.getElementById('expiryAlertSection');
        const expiryTable = document.getElementById('expiryAlertTable');
        if (window.sysSettings && window.sysSettings.expiry && expirySection && expiryTable) {
            let expiryHTML = '';
            const today = new Date();
            today.setHours(0,0,0,0);
            (window.inventory || []).forEach(p => {
                if(!p) return;
                if (p.expiry) {
                    const expDate = new Date(p.expiry);
                    expDate.setHours(0,0,0,0);
                    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
                    if (diffDays <= 180) {
                        let statusBadge = '';
                        if (diffDays < 0) statusBadge = `<span class="badge" style="background: rgba(225, 29, 72, 0.1); color: var(--danger); font-weight:bold;">Expired ❌ (ហួស ${Math.abs(diffDays)} ថ្ងៃ)</span>`;
                        else if (diffDays === 0) statusBadge = `<span class="badge" style="background: var(--danger); color: white; font-weight:bold;">ផុតកំណត់ថ្ងៃនេះ! 🚨</span>`;
                        else statusBadge = `<span class="badge" style="background: rgba(245, 158, 11, 0.1); color: var(--warning);">ជិតផុតកំណត់ ⚠️ (សល់ ${diffDays} ថ្ងៃ)</span>`;
                        
                        let catStr = p.category ? p.category : '-';
                        let safeName = p.name ? String(p.name).replace(/'/g, "\\'") : '';
                        
                        expiryHTML += `<tr>
                            <td style="font-weight:bold; color:var(--text-main);">${p.name}</td>
                            <td><span class="badge" style="background:rgba(255,255,255,0.1);">${catStr}</span></td>
                            <td style="font-weight:bold; color: ${diffDays < 0 ? 'var(--danger)':'var(--warning)'};">${expDate.toLocaleDateString('km-KH')}</td>
                            <td>${statusBadge}</td>
                            <td><button class="btn btn-outline" style="padding:4px 8px; font-size:var(--fs-12);" onclick="window.switchTab('inventory','📦 គ្រប់គ្រងស្តុក (Inventory)', document.getElementById('nav-inventory')); document.getElementById('searchInput').value='${safeName}'; window.renderInventory();">មើល</button></td>
                        </tr>`;
                    }
                }
            });
            expiryTable.innerHTML = expiryHTML || '<tr><td colspan="5" style="text-align:center; padding:15px;">✅ គ្មានថ្នាំពេទ្យណាជិតផុតកំណត់ ឬហួសដឺឡេទេ។</td></tr>';
            expirySection.style.display = 'block';
        } else if (expirySection) {
            expirySection.style.display = 'none';
        }

        let topSellers = Object.values(salesMap).sort((a, b) => b.qty - a.qty).slice(0, 5); 
        const topBody = document.getElementById('topSellingTable');
        if (topBody) { topBody.innerHTML = topSellers.length === 0 ? '<tr><td colspan="4" style="text-align:center; padding:15px;">មិនទាន់មានទិន្នន័យលក់ទេ</td></tr>' : topSellers.map((item, index) => `<tr><td style="font-weight:bold; color:var(--primary);">${index === 0 ? '🥇 លេខ ១' : index === 1 ? '🥈 លេខ ២' : index === 2 ? '🥉 លេខ ៣' : 'លេខ ' + (index + 1)}</td><td>${item.name}</td><td style="font-weight:bold;">${item.qty}</td><td style="color:var(--success); font-weight:bold;">${window.fMoney(item.revenue)}</td></tr>`).join(''); }
    } catch(e) { console.error("Dashboard Error:", e); }
};

window.renderHistory = function() {
    const searchVal = document.getElementById('historySearch') ? document.getElementById('historySearch').value.toLowerCase() : ''; 
    const dateFrom = document.getElementById('historyDateFrom'); 
    const dateTo = document.getElementById('historyDateTo'); 
    const fromTime = (dateFrom && dateFrom.value) ? new Date(dateFrom.value).getTime() : 0; 
    const toTime = (dateTo && dateTo.value) ? new Date(dateTo.value).getTime() : Infinity; 
    let fHtml = '';
    
    (window.historyLog || []).filter(h => h && (String(h.itemName).toLowerCase().includes(searchVal) || (h.note && String(h.note).toLowerCase().includes(searchVal))) && (fromTime === 0 && toTime === Infinity || (h.id >= fromTime && h.id <= toTime))).forEach(h => { 
        let tName = h.type === 'sale' ? 'លក់ចេញ' : (h.type === 'add' ? 'នាំចូលថ្មី/បន្ថែម' : 'កែប្រែទិន្នន័យ'); 
        let bClass = h.type === 'sale' ? 'badge-sale' : (h.type === 'add' ? 'badge-add' : 'badge-update'); 
        let catStr = '-', unitStr = ''; 
        const pItem = (window.inventory || []).find(i => i && i.name === h.itemName); 
        if(pItem) { catStr = pItem.category||'-'; unitStr = pItem.unit ? ' '+pItem.unit : ''; }
        
        let qtyDisplay = h.qty === 0 ? '0' : `${h.qty > 0 ? '+' : (h.type === 'sale'?'-':'')}${Math.abs(h.qty)}${unitStr}`; 
        fHtml += `<tr><td data-sort="${h.id}" style="font-size:var(--fs-12); color:var(--text-muted);">${h.date}</td><td data-sort="${tName}"><span class="badge ${bClass}">${tName}</span></td><td data-sort="${h.itemName}" style="font-weight:bold; color:var(--text-main);">${h.itemName}</td><td data-sort="${catStr}" style="font-size:var(--fs-12); color:var(--text-muted);">${catStr}</td><td data-sort="${h.qty}" style="font-weight:bold; color:${h.type === 'sale' ? 'var(--warning)' : (h.qty > 0 ? 'var(--success)' : 'var(--text-main)')};">${qtyDisplay}</td><td data-sort="${h.note||''}" style="font-size:var(--fs-12);">${h.note||''}</td></tr>`; 
    });
    
    const hTable = document.getElementById('historyTable');
    if(hTable) hTable.innerHTML = fHtml || '<tr><td colspan="6" style="text-align:center; padding:20px;">មិនមានប្រវត្តិទិន្នន័យតាមការស្វែងរកទេ</td></tr>'; 
};

window.clearHistory = function() { 
    window.ksMsg('តើអ្នកពិតជាចង់លុបប្រវត្តិប្រតិបត្តិការទាំងអស់មែនទេ?', 'បញ្ជាក់ការលុប', true, async () => { 
        window.historyLog = []; 
        await window.saveData(window.userAccounts); 
        window.renderHistory();
    }); 
};

// ==========================================
// 15. APP ENTRY POINT
// ==========================================
window.onload = async () => {
    window.loadThemeSettings(); 
    window.checkAuthentication(window.applyPermissions); 
    
    // បង្ហាញទិន្នន័យចេញពី LocalStorage ភ្លាមៗ (UI នឹងមិនទទេពេលទាញ Cloud យឺត)
    window.loadSettingsToUI(); 
    window.applyPermissions(); 
    window.updateCategories(); 
    window.setInventoryView(window.currentInventoryView, true); 
    window.setPOSView(window.currentPOSView, true); 
    window.renderAll(); 

    // ផ្ទៀងផ្ទាត់ License និងទាញយកទិន្នន័យពី Supabase
    window.checkLicense();
    await window.loadDataFromSupabase(window.userAccounts);
    window.setSyncStatus('synced', 'ទិន្នន័យទាន់សម័យ');
    window.renderAll(); 

    setInterval(() => {
        const dateEl = document.getElementById('currentDate');
        if(dateEl) dateEl.innerText = window.fDate();
    }, 1000);

    const dispName = document.getElementById('displayShopName');
    if(dispName) dispName.innerHTML = `${window.shopName} <i id="editShopIcon" style="font-size:var(--fs-12); color:var(--text-muted); font-style: normal;">✏️</i>`; 
    if(window.shopLogo) { 
        const sideLogo = document.getElementById('sidebarLogo');
        if(sideLogo) {
            sideLogo.src = window.shopLogo; 
            sideLogo.style.display = 'block'; 
        }
    } 
    
    const header = document.getElementById('topHeaderBar'); 
    if (header) { header.classList.remove('hidden-header'); } 
    
    // Real-time Update Listener (SMART ALERT)
    setInterval(async () => {
        if (!window.supabaseClient || !navigator.onLine) return;
        try {
            let { data } = await window.supabaseClient.from('branch_store').select('data_json').eq('branch_id', window.SHOP_BRANCH_ID).single();
            if (data && data.data_json && data.data_json.invoices) {
                let cloudInvoices = data.data_json.invoices;
                let localInvoices = window.invoices || [];
                
                // ឆែកមើលថាតើមានការកុម្ម៉ង់ពីក្រៅ (Digital Menu) ចូលមកឬអត់
                let isExternalOrder = false;
                if (cloudInvoices.length > 0) {
                    let newestCloudInv = cloudInvoices[0];
                    // បើវិក្កយបត្រថ្មីបំផុតពី Cloud មិនមានក្នុងម៉ាស៊ីន Local ទេ មានន័យថាវាជាការកុម្ម៉ង់ពី Menu ភ្ញៀវ
                    if (!localInvoices.find(inv => String(inv.id) === String(newestCloudInv.id))) {
                        isExternalOrder = true;
                    }
                }

                if (isExternalOrder) {
                    if (typeof window.playOrderSound === 'function') window.playOrderSound();
                    if (typeof window.ksMsg === 'function') {
                        window.ksMsg('មានការកុម្ម៉ង់ថ្មីចូលពីអតិថិជន (Menu)! សូមពិនិត្យមើលវិក្កយបត្រ។', '🔔 កម្ម៉ង់ថ្មី');
                    }
                    
                    // ទាញទិន្នន័យថ្មីៗពី Cloud បញ្ចូលក្នុងម៉ាស៊ីន
                    window.invoices.splice(0, window.invoices.length, ...cloudInvoices);
                    if (data.data_json.inventory) window.inventory.splice(0, window.inventory.length, ...data.data_json.inventory);
                    if (data.data_json.customers) window.customers.splice(0, window.customers.length, ...data.data_json.customers);
                    
                    // រក្សាទុកចូល LocalStorage
                    localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(window.invoices));
                    localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
                    
                    // Render ផ្ទាំងឡើងវិញ
                    if(typeof window.renderUnpaid === 'function') window.renderUnpaid();
                    if(typeof window.renderInventory === 'function') window.renderInventory();
                    if(typeof window.renderCustomers === 'function') window.renderCustomers();
                }
            }
        } catch(e) {}
    }, 10000);
};