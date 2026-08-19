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
// 2. BIND AUTH TO WINDOW
// ==========================================
window.handleLogin = () => window.handleLogin(window.checkAuthentication, window.switchTab);
window.handleLogout = () => window.handleLogout(window.checkAuthentication);
window.toggleForgotPass = window.toggleForgotPass;
window.handleResetPassword = window.handleResetPassword;
window.handleChangePassword = window.handleChangePassword;
window.openUserModal = window.openUserModal;
window.editUserAccount = window.editUserAccount;
window.closeUserModal = window.closeUserModal;
window.saveNewUser = window.saveNewUser;
window.deleteUserAccount = window.deleteUserAccount;

// ==========================================
// 3. BIND THEME TO WINDOW
// ==========================================
window.toggleTheme = window.toggleTheme;
window.handleCustomColor = window.handleCustomColor;

// ==========================================
// 4. BIND INVENTORY TO WINDOW
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

// ==========================================
// 5. BIND POS TO WINDOW
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

// ==========================================
// 6. BIND FINANCE TO WINDOW
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
window.viewInvoice = window.viewInvoice;
window.closeInvoiceViewModal = window.closeInvoiceViewModal;
window.reprintInvoice = window.reprintInvoice;
window.downloadInvoicePNG = window.downloadInvoicePNG;
window.openInvoiceEdit = window.openInvoiceEdit;
window.closeInvoiceEditModal = window.closeInvoiceEditModal;
window.updateEditInvQty = window.updateEditInvQty;
window.removeEditInvItem = window.removeEditInvItem;
window.addItemToEditingInvoice = window.addItemToEditingInvoice;
window.saveInvoiceChanges = window.saveInvoiceChanges;
window.deleteInvoice = window.deleteInvoice;

// ==========================================
// 7. BIND CUSTOMER TO WINDOW
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
// 8. GLOBAL UI & APP FLOW METHODS
// ==========================================
window.switchTab = function(tabId, title, elem) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active')); 
    if(elem) elem.classList.add('active'); 
    document.getElementById('pageTitle').innerText = title;
    
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active')); 
    document.getElementById('tab-' + tabId).classList.add('active');
    
    const header = document.getElementById('topHeaderBar');
    if(header) header.classList.remove('hidden-header');

    if(window.innerWidth <= 768) { 
        document.getElementById('appSidebar').classList.remove('active-mobile'); 
        document.querySelector('.sidebar-overlay').classList.remove('active'); 
    } 
    window.renderAll();
};

window.applyPermissions = function() {
    let sDash=true, sInv=true, sPOS=true, sCust=window.sysSettings.cust, sUnpaid=window.sysSettings.unpaid, sHist=window.sysSettings.logs, sSet=true, sAbout=true, sExp=true;
    if(window.currentRole === 'sales') { 
        sInv = false; sHist = false; sSet = false; sAbout = false; sExp = false; 
    } else if (window.currentRole === 'warehouse') { 
        sPOS = false; sCust = false; sUnpaid = false; sSet = false; sAbout = false; sHist = false; sExp = false; 
    }
    
    if(document.getElementById('nav-dashboard')) document.getElementById('nav-dashboard').style.display = sDash ? 'flex' : 'none'; 
    if(document.getElementById('nav-inventory')) document.getElementById('nav-inventory').style.display = sInv ? 'flex' : 'none'; 
    if(document.getElementById('nav-pos')) document.getElementById('nav-pos').style.display = sPOS ? 'flex' : 'none'; 
    if(document.getElementById('nav-customers')) document.getElementById('nav-customers').style.display = sCust ? 'flex' : 'none'; 
    if(document.getElementById('nav-unpaid')) document.getElementById('nav-unpaid').style.display = sUnpaid ? 'flex' : 'none'; 
    if(document.getElementById('nav-expenses')) document.getElementById('nav-expenses').style.display = sExp ? 'flex' : 'none'; 
    if(document.getElementById('nav-history')) document.getElementById('nav-history').style.display = sHist ? 'flex' : 'none'; 
    if(document.getElementById('nav-settings')) document.getElementById('nav-settings').style.display = sSet ? 'flex' : 'none'; 
    if(document.getElementById('nav-about')) document.getElementById('nav-about').style.display = sAbout ? 'flex' : 'none';
    
    if(document.getElementById('grid-btn-pos')) document.getElementById('grid-btn-pos').style.display = sPOS ? 'flex' : 'none'; 
    if(document.getElementById('grid-btn-inv')) document.getElementById('grid-btn-inv').style.display = sInv ? 'flex' : 'none'; 
    if(document.getElementById('grid-btn-unpaid')) document.getElementById('grid-btn-unpaid').style.display = sUnpaid ? 'flex' : 'none'; 
    if(document.getElementById('grid-btn-exp')) document.getElementById('grid-btn-exp').style.display = sExp ? 'flex' : 'none'; 
    if(document.getElementById('grid-btn-cust')) document.getElementById('grid-btn-cust').style.display = sCust ? 'flex' : 'none'; 
    if(document.getElementById('grid-btn-hist')) document.getElementById('grid-btn-hist').style.display = sHist ? 'flex' : 'none';
    
    const editIcon = document.getElementById('editShopIcon'); 
    if(editIcon) editIcon.style.display = window.currentRole === 'admin' ? 'inline' : 'none';
    
    const showCost = window.sysSettings.cost && window.currentRole === 'admin'; 
    if(document.getElementById('costPriceContainer')) document.getElementById('costPriceContainer').style.display = showCost ? 'block' : 'none'; 
    document.querySelectorAll('.p-cost').forEach(el => el.style.display = showCost ? 'inline' : 'none');
    
    if(document.getElementById('posDiscountContainer')) document.getElementById('posDiscountContainer').style.display = window.sysSettings.discount ? 'flex' : 'none';
    if(document.getElementById('posTaxContainer')) { 
        document.getElementById('posTaxContainer').style.display = window.sysSettings.tax ? 'flex' : 'none'; 
        if(document.getElementById('cartTaxRateDisplay')) document.getElementById('cartTaxRateDisplay').innerText = window.sysSettings.taxRate ? window.sysSettings.taxRate : 0; 
    }
    
    if(document.getElementById('posSellerRowContainer')) document.getElementById('posSellerRowContainer').style.display = window.sysSettings.showSeller !== false ? 'flex' : 'none'; 
    if(document.getElementById('posCustomerInputContainer')) document.getElementById('posCustomerInputContainer').style.display = window.sysSettings.cust ? 'block' : 'none'; 
    if(document.getElementById('btnCheckoutUnpaid')) document.getElementById('btnCheckoutUnpaid').style.display = window.sysSettings.unpaid ? 'block' : 'none'; 
    if(document.getElementById('btnCheckoutPreorder')) document.getElementById('btnCheckoutPreorder').style.display = window.sysSettings.preorder ? 'block' : 'none'; 
    if(document.getElementById('btnAddNewProduct')) document.getElementById('btnAddNewProduct').style.display = window.currentRole === 'admin' ? 'block' : 'none'; 
    if(document.getElementById('inventoryExcelAction')) document.getElementById('inventoryExcelAction').style.display = window.currentRole === 'admin' ? 'flex' : 'none'; 
    if(document.getElementById('adminUserManagementBlock')) document.getElementById('adminUserManagementBlock').style.display = window.currentRole === 'admin' ? 'block' : 'none';
    
    if(document.getElementById('pExpiryContainer')) document.getElementById('pExpiryContainer').style.display = window.sysSettings.expiry ? 'block' : 'none';

    if (window.currentRole === 'admin') {
        if(window.renderUsersList) window.renderUsersList();
        if(window.renderUnpaid) window.renderUnpaid();
        if(window.renderExpenses) window.renderExpenses();
    }
};

window.loadSettingsToUI = function() { 
    document.getElementById('setCust').checked = window.sysSettings.cust; 
    document.getElementById('setUnpaid').checked = window.sysSettings.unpaid; 
    document.getElementById('setLogs').checked = window.sysSettings.logs; 
    document.getElementById('setCost').checked = window.sysSettings.cost; 
    document.getElementById('setDiscount').checked = window.sysSettings.discount; 
    if(document.getElementById('setShowSeller')) document.getElementById('setShowSeller').checked = window.sysSettings.showSeller !== false; 
    if(document.getElementById('setTax')) document.getElementById('setTax').checked = window.sysSettings.tax; 
    if(document.getElementById('setTaxRate')) document.getElementById('setTaxRate').value = window.sysSettings.taxRate ? window.sysSettings.taxRate : 10; 
    
    document.getElementById('setCondition').checked = window.sysSettings.condition || false;
    document.getElementById('conditionListContainer').style.display = window.sysSettings.condition ? 'block' : 'none';
    document.getElementById('setConditionList').value = window.sysSettings.conditionList || 'MISB, Loose, New, Used';
    document.getElementById('setPreorder').checked = window.sysSettings.preorder || false;
    document.getElementById('setDeliveryFee').value = window.sysSettings.deliveryFee !== undefined ? window.sysSettings.deliveryFee : 1.5;

    if(document.getElementById('setExpiry')) document.getElementById('setExpiry').checked = window.sysSettings.expiry !== false;
};

window.saveSysSettings = function() { 
    if(window.currentRole !== 'admin') return window.ksMsg("គ្មានសិទ្ធិកែប្រែការកំណត់ទេ!", "សិទ្ធិមិនគ្រប់គ្រាន់"); 
    
    window.sysSettings.cust = document.getElementById('setCust').checked; 
    window.sysSettings.unpaid = document.getElementById('setUnpaid').checked; 
    window.sysSettings.logs = document.getElementById('setLogs').checked; 
    window.sysSettings.cost = document.getElementById('setCost').checked; 
    window.sysSettings.discount = document.getElementById('setDiscount').checked; 
    if(document.getElementById('setShowSeller')) window.sysSettings.showSeller = document.getElementById('setShowSeller').checked; 
    if(document.getElementById('setTax')) window.sysSettings.tax = document.getElementById('setTax').checked; 
    if(document.getElementById('setTaxRate')) window.sysSettings.taxRate = parseFloat(document.getElementById('setTaxRate').value) || 0; 
    
    window.sysSettings.condition = document.getElementById('setCondition').checked;
    window.sysSettings.conditionList = document.getElementById('setConditionList').value || 'MISB, Loose, New, Used';
    window.sysSettings.preorder = document.getElementById('setPreorder').checked;
    window.sysSettings.deliveryFee = parseFloat(document.getElementById('setDeliveryFee').value) || 0;

    if(document.getElementById('setExpiry')) window.sysSettings.expiry = document.getElementById('setExpiry').checked;

    document.getElementById('conditionListContainer').style.display = window.sysSettings.condition ? 'block' : 'none';
    
    if(window.updateCategories) window.updateCategories(); 
    window.applyPermissions(); 
    window.saveData(window.userAccounts); 
    window.ksMsg("ការកំណត់ត្រូវបានរក្សាទុក!", "ជោគជ័យ"); 
};

window.toggleDesktopSidebar = function() { 
    const sidebar = document.getElementById('appSidebar'); 
    if(window.innerWidth > 768) { 
        sidebar.classList.toggle('collapsed'); 
    } else { 
        sidebar.classList.toggle('active-mobile'); 
        document.querySelector('.sidebar-overlay').classList.toggle('active'); 
    } 
};

// ==========================================
// 9. ADVANCED DATABASE LICENSE SYSTEM
// ==========================================
window.checkLicense = async function() { 
    const lockScreen = document.getElementById('licenseLockScreen'); 
    const sidebar = document.getElementById('appSidebar'); 
    const savedKey = localStorage.getItem(window.getBranchKey('license_key')); 

    if (!savedKey) { 
        lockScreen.style.display = 'flex'; 
        sidebar.style.pointerEvents = 'none'; 
        return false; 
    } 

    try { 
        let { data, error } = await window.supabaseClient
            .from('branch_licenses')
            .select('*')
            .eq('branch_id', window.SHOP_BRANCH_ID)
            .eq('license_key', savedKey)
            .eq('is_active', true)
            .single();

        if (error || !data) { 
            lockScreen.style.display = 'flex'; 
            sidebar.style.pointerEvents = 'none'; 
            return false; 
        } 

        const expiry = new Date(data.expires_at).getTime();
        if (expiry <= Date.now()) { 
            lockScreen.style.display = 'flex'; 
            sidebar.style.pointerEvents = 'none'; 
            window.ksMsg('❌ សិទ្ធិប្រើប្រាស់ប្រព័ន្ធ (License) របស់សាខានេះបានផុតកំណត់ហើយ!', 'ផុតកំណត់'); 
            return false; 
        } 

        lockScreen.style.display = 'none'; 
        sidebar.style.pointerEvents = 'auto'; 
        window.activeLicenseData = data; 
        return true;

    } catch (e) { 
        lockScreen.style.display = 'flex'; 
        sidebar.style.pointerEvents = 'none'; 
        return false; 
    } 
};

window.verifyAndSaveLicense = async function() { 
    const inputKey = document.getElementById('licenseInputBox').value.trim(); 
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
    const inputKey = document.getElementById('aboutLicenseInput').value.trim(); 
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
        window.ksMsg('✅ សិទ្ធិប្រើប្រាស់ត្រូវបានធ្វើបច្ចុប្បន្នភាពជោគជ័យ!', 'ជោគជ័យ', false, () => { 
            location.reload(); 
        }); 

    } catch(e) { 
        window.ksMsg('❌ មិនអាចភ្ជាប់ទៅកាន់ Server ដើម្បីផ្ទៀងផ្ទាត់ License បានទេ!', 'បរាជ័យ'); 
    } 
};

window.displayLicenseInfo = function() { 
    const infoDisplay = document.getElementById('licenseInfoDisplay'); 
    if(!infoDisplay) return; 

    if(!window.activeLicenseData) { 
        infoDisplay.innerHTML = '<span style="color: var(--danger);">មិនទាន់បានបញ្ចូលកូដ ឬកូដមិនត្រឹមត្រូវ</span>'; 
        return; 
    } 

    try { 
        const expiry = new Date(window.activeLicenseData.expires_at).getTime(); 
        const expireDate = new Date(expiry); 
        const diffDays = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24)); 
        let statusHtml = ''; 

        if(diffDays > 10) statusHtml = `<span style="color: var(--success); font-weight: bold; background: rgba(16, 185, 129, 0.1); padding: 5px 10px; border-radius: 6px;">✅ ដំណើរការធម្មតា (សល់ ${diffDays} ថ្ងៃ)</span>`; 
        else if (diffDays > 0) statusHtml = `<span style="color: var(--warning); font-weight: bold; background: rgba(245, 158, 11, 0.1); padding: 5px 10px; border-radius: 6px;">⚠️ ជិតផុតកំណត់ (សល់ ${diffDays} ថ្ងៃ)</span>`; 
        else statusHtml = `<span style="color: var(--danger); font-weight: bold; background: rgba(225, 29, 72, 0.1); padding: 5px 10px; border-radius: 6px;">❌ ផុតកំណត់ហើយ!</span>`; 

        infoDisplay.innerHTML = `<div style="margin-bottom: 10px;"><strong>ស្ថានភាព៖</strong> ${statusHtml}</div><div><strong>ថ្ងៃផុតកំណត់៖</strong> <span style="color: var(--text-main); font-weight: bold;">${expireDate.toLocaleDateString('km-KH')} ម៉ោង ${expireDate.toLocaleTimeString('km-KH')}</span></div>`; 
    } catch(e) { 
        infoDisplay.innerHTML = '<span style="color: var(--danger);">លេខកូដមិនត្រឹមត្រូវទេ</span>'; 
    } 
};

// ==========================================
// 10. SHOP SETTINGS & ASSETS
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

window.saveShopName = function() { 
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
        
        document.getElementById('displayShopName').innerHTML = `${window.shopName} <i id="editShopIcon" style="font-size:var(--fs-12); color:var(--text-muted); font-style: normal;">✏️</i>`; 
        if(window.shopLogo) { 
            document.getElementById('sidebarLogo').src = window.shopLogo; 
            document.getElementById('sidebarLogo').style.display = 'block'; 
        } 
        window.saveData(window.userAccounts); 
        window.closeShopNameModal(); 
        window.ksMsg("ព័ត៌មានហាងត្រូវបានរក្សាទុកដោយជោគជ័យ! សូម Refresh ទំព័រ (F5) ដើម្បីឱ្យវាដំណើរការពេញលេញ។", "ជោគជ័យ"); 
    } else {
        window.ksMsg("សូមបញ្ចូលឈ្មោះហាងសិន!"); 
    }
};

window.renderAll = function() { 
    window.renderDashboard(); 
    window.renderInventory(); 
    window.renderPOSProducts(); 
    window.renderUnpaid(); 
    window.renderExpenses(); 
    window.renderHistory(); 
    window.renderCustomers(); 
    window.updateCustomerDatalist(); 
    window.populateEditInvoiceSelect(); 
    window.displayLicenseInfo(); 
};

window.resetDashboardDate = function() { 
    document.getElementById('dashDateFrom').value = ''; 
    document.getElementById('dashDateTo').value = ''; 
    window.renderDashboard(); 
};

// ==========================================
// 11. DASHBOARD & REPORTING
// ==========================================
window.renderDashboard = function() {
    try {
        let tItems = window.inventory.length; let tQty = 0, estRev = 0, lowItems = []; 
        window.inventory.forEach(p => { 
            if(!p) return; 
            let q = parseInt(p.qty) || 0; tQty += q; let priceVal = parseFloat(p.price) || 0; estRev += (priceVal * q); 
            if(q <= 5) lowItems.push(p); 
        });
        
        const dateFrom = document.getElementById('dashDateFrom'); const dateTo = document.getElementById('dashDateTo'); 
        const fromTime = (dateFrom && dateFrom.value) ? new Date(dateFrom.value).getTime() : 0; 
        const toTime = (dateTo && dateTo.value) ? new Date(dateTo.value).getTime() : Infinity;
        let totalSalesRevenue = 0, totalUnpaid = 0, totalExpenses = 0, totalCOGS = 0, salesMap = {};
        
        window.invoices.forEach(inv => { 
            let invTime = inv.timestamp || parseInt(String(inv.id).split('_')[1]) || 0; 
            if (invTime >= fromTime && invTime <= toTime) { 
                if(inv.status === 'paid') totalSalesRevenue += (parseFloat(inv.totalAmount) || 0); 
                if(inv.status === 'unpaid' || inv.status === 'preorder') { 
                    let invPaid = parseFloat(inv.paidUsd) || 0; 
                    let remaining = (parseFloat(inv.totalAmount) || 0) - invPaid; 
                    if(remaining > 0) totalUnpaid += remaining; 
                    totalSalesRevenue += invPaid; 
                }
                if(inv.items) inv.items.forEach(item => { 
                    if(!item) return; let pId = item.id ? String(item.id) : 'unknown';
                    if(!salesMap[pId]) salesMap[pId] = { name: item.name, qty: 0, revenue: 0 }; 
                    let qty = parseInt(item.cartQty) || 0; let price = parseFloat(item.price) || 0; let cost = parseFloat(item.cost) || 0;
                    salesMap[pId].qty += qty; salesMap[pId].revenue += (price * qty); totalCOGS += (cost * qty);
                }); 
            } 
        });
        window.expenses.forEach(exp => { let expTime = exp.timestamp || 0; if(expTime >= fromTime && expTime <= toTime) totalExpenses += (parseFloat(exp.amount) || 0); });

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
        if(tbody) { tbody.innerHTML = lowItems.length === 0 ? '<tr><td colspan="4" style="text-align:center;">មិនមានទំនិញជិតអស់ទេ</td></tr>' : lowItems.map(p => { let catStr = p.category ? p.category : '-'; let nameStr = p.name ? String(p.name).replace(/'/g, "\\'") : ''; return `<tr><td>${p.name}</td><td>${catStr}</td><td style="color:${p.qty<=0?'var(--danger)':'var(--warning)'}; font-weight:bold;">${p.qty}</td><td><button class="btn btn-outline" style="padding:4px 8px; font-size:var(--fs-12);" onclick="window.switchTab('inventory','📦 គ្រប់គ្រងស្តុក (Inventory)', document.getElementById('nav-inventory')); document.getElementById('searchInput').value='${nameStr}'; window.renderInventory();">មើល</button></td></tr>`; }).join(''); }
        
        // Expiry Section Display Logic
        const expirySection = document.getElementById('expiryAlertSection');
        const expiryTable = document.getElementById('expiryAlertTable');
        if (window.sysSettings.expiry && expirySection && expiryTable) {
            let expiryHTML = '';
            const today = new Date();
            today.setHours(0,0,0,0);
            window.inventory.forEach(p => {
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
            expiryTable.innerHTML = expiryHTML || '<tr><td colspan="5" style="text-align:center;">✅ គ្មានថ្នាំពេទ្យណាជិតផុតកំណត់ ឬហួសដឺឡេទេ។</td></tr>';
            expirySection.style.display = 'block';
        } else if (expirySection) {
            expirySection.style.display = 'none';
        }

        let topSellers = Object.values(salesMap).sort((a, b) => b.qty - a.qty).slice(0, 5); 
        const topBody = document.getElementById('topSellingTable');
        if (topBody) { topBody.innerHTML = topSellers.length === 0 ? '<tr><td colspan="4" style="text-align:center;">មិនទាន់មានទិន្នន័យលក់ទេ</td></tr>' : topSellers.map((item, index) => `<tr><td style="font-weight:bold; color:var(--primary);">${index === 0 ? '🥇 លេខ ១' : index === 1 ? '🥈 លេខ ២' : index === 2 ? '🥉 លេខ ៣' : 'លេខ ' + (index + 1)}</td><td>${item.name}</td><td style="font-weight:bold;">${item.qty}</td><td style="color:var(--success); font-weight:bold;">${window.fMoney(item.revenue)}</td></tr>`).join(''); }
    } catch(e) { console.error("Dashboard Error:", e); }
};

window.renderHistory = function() {
    const searchVal = document.getElementById('historySearch') ? document.getElementById('historySearch').value.toLowerCase() : ''; 
    const dateFrom = document.getElementById('historyDateFrom'); 
    const dateTo = document.getElementById('historyDateTo'); 
    const fromTime = (dateFrom && dateFrom.value) ? new Date(dateFrom.value).getTime() : 0; 
    const toTime = (dateTo && dateTo.value) ? new Date(dateTo.value).getTime() : Infinity; 
    let fHtml = '';
    
    window.historyLog.filter(h => (String(h.itemName).toLowerCase().includes(searchVal) || (h.note && String(h.note).toLowerCase().includes(searchVal))) && (h.id >= fromTime && h.id <= toTime)).forEach(h => { 
        let tName = h.type === 'sale' ? 'លក់ចេញ' : (h.type === 'add' ? 'នាំចូលថ្មី/បន្ថែម' : 'កែប្រែទិន្នន័យ'); 
        let bClass = h.type === 'sale' ? 'badge-sale' : (h.type === 'add' ? 'badge-add' : 'badge-update'); 
        let catStr = '-', unitStr = ''; 
        const pItem = window.inventory.find(i => i.name === h.itemName); 
        if(pItem) { catStr = pItem.category||'-'; unitStr = pItem.unit ? ' '+pItem.unit : ''; }
        
        let qtyDisplay = h.qty === 0 ? '0' : `${h.qty > 0 ? '+' : (h.type === 'sale'?'-':'')}${Math.abs(h.qty)}${unitStr}`; 
        fHtml += `<tr><td data-sort="${h.id}" style="font-size:var(--fs-12); color:var(--text-muted);">${h.date}</td><td data-sort="${tName}"><span class="badge ${bClass}">${tName}</span></td><td data-sort="${h.itemName}" style="font-weight:bold; color:var(--text-main);">${h.itemName}</td><td data-sort="${catStr}" style="font-size:var(--fs-12); color:var(--text-muted);">${catStr}</td><td data-sort="${h.qty}" style="font-weight:bold; color:${h.type === 'sale' ? 'var(--warning)' : (h.qty > 0 ? 'var(--success)' : 'var(--text-main)')};">${qtyDisplay}</td><td data-sort="${h.note||''}" style="font-size:var(--fs-12);">${h.note||''}</td></tr>`; 
    });
    
    document.getElementById('historyTable').innerHTML = fHtml || '<tr><td colspan="6" style="text-align:center;">មិនមានប្រវត្តិទិន្នន័យតាមការស្វែងរកទេ</td></tr>'; 
    if(typeof window.filterTable === 'function') setTimeout(() => window.filterTable('mainHistoryTable'), 50);
};

window.clearHistory = function() { 
    window.ksMsg('តើអ្នកពិតជាចង់លុបប្រវត្តិប្រតិបត្តិការទាំងអស់មែនទេ?', 'បញ្ជាក់ការលុប', true, () => { 
        window.historyLog.length = 0; 
        window.saveData(window.userAccounts); 
        window.renderHistory();
    }); 
};

// ==========================================
// 12. EXPORT & IMPORT UTILITIES
// ==========================================
window.importCSV = function(e) {
    const file = e.target.files[0]; if (!file) return; 
    const r = new FileReader();
    r.onload = (ev) => {
        const lines = ev.target.result.split('\n'); let count = 0;
        for(let i=1; i<lines.length; i++) {
            const row = lines[i].trim().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
            if(row.length >= 8) {
                const id = row[0].replace(/(^"|"$)/g, '').trim(); 
                const name = row[1].replace(/(^"|"$)/g, '').trim(); 
                if(!name) continue; 
                
                const existing = window.inventory.find(p => p.id === id || p.name === name);
                
                let conditionVal = '';
                let expiryVal = '';
                let descVal = '';
                if (row.length > 10) {
                    conditionVal = row[8].replace(/(^"|"$)/g, '').trim();
                    expiryVal = row[9].replace(/(^"|"$)/g, '').trim();
                    descVal = row[10] ? row[10].replace(/(^"|"$)/g, '').trim() : '';
                } else if (row.length > 9) {
                    conditionVal = row[8].replace(/(^"|"$)/g, '').trim();
                    descVal = row[9] ? row[9].replace(/(^"|"$)/g, '').trim() : '';
                } else if (row.length === 9) {
                    descVal = row[8] ? row[8].replace(/(^"|"$)/g, '').trim() : '';
                }

                let d = { 
                    name: name, 
                    category: row[2].replace(/(^"|"$)/g, '').trim(), 
                    cost: parseFloat(row[3])||0, 
                    price: parseFloat(row[4])||0, 
                    riel: parseFloat(row[5])||0, 
                    unit: row[6]?row[6].replace(/(^"|"$)/g, '').trim():'', 
                    qty: parseInt(row[7])||0, 
                    condition: conditionVal,
                    expiry: expiryVal,
                    desc: descVal
                };
                if(existing) { 
                    Object.assign(existing, d); 
                } else { 
                    d.id = id || 'P_'+Date.now()+count; 
                    d.customId = d.id; 
                    d.image = ''; 
                    window.inventory.push(d); 
                } 
                count++;
            }
        } 
        window.saveData(window.userAccounts); 
        window.ksMsg(`បាននាំចូលទិន្នន័យពី Excel ចំនួន ${count} មុខ!`, 'ជោគជ័យ');
        window.renderInventory();
    }; 
    r.readAsText(file); 
    e.target.value = '';
};

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
        customers: window.customers, 
        sysSettings: window.sysSettings, 
        userAccounts: window.userAccounts, 
        invoiceCounter: JSON.parse(localStorage.getItem(window.getBranchKey('invoice_counter'))) 
    }; 
    const a = document.createElement("a"); 
    a.href = URL.createObjectURL(new Blob([JSON.stringify(dataToBackup)], { type: "application/json" })); 
    a.download = `SKM_INTEGRATE_${window.SHOP_BRANCH_ID}_Backup.json`; 
    a.click(); 
};

window.importData = function(e) {
    const file = e.target.files[0]; if (!file) return; 
    const r = new FileReader();
    r.onload = (ev) => {
        try {
            const data = JSON.parse(ev.target.result);
            if(data.inventory) { 
                window.inventory.splice(0, window.inventory.length, ...(data.inventory||[])); 
                window.historyLog.splice(0, window.historyLog.length, ...(data.historyLog||[])); 
                window.invoices.splice(0, window.invoices.length, ...(data.invoices||[])); 
                window.customers.splice(0, window.customers.length, ...(data.customers||[])); 
                window.expenses.splice(0, window.expenses.length, ...(data.expenses||[]));
                
                if(data.shopName) globalThis.shopName = data.shopName; 
                if(data.shopLogo) globalThis.shopLogo = data.shopLogo; 
                if(data.shopQR) globalThis.shopQR = data.shopQR; 
                if(data.shopPhone) globalThis.shopPhone = data.shopPhone; 
                if(data.shopAddress) globalThis.shopAddress = data.shopAddress;
                
                if(data.sysSettings) Object.assign(window.sysSettings, data.sysSettings); 
                if(data.userAccounts) window.userAccounts.splice(0, window.userAccounts.length, ...data.userAccounts); 
                
                if(data.invoiceCounter) localStorage.setItem(window.getBranchKey('invoice_counter'), JSON.stringify(data.invoiceCounter));
            } else if(Array.isArray(data)) {
                window.inventory.splice(0, window.inventory.length, ...data);
            }
            
            window.saveData(window.userAccounts); 
            localStorage.setItem(window.getBranchKey('auth_users_pro'), JSON.stringify(window.userAccounts)); 
            
            document.getElementById('displayShopName').innerHTML = `${window.shopName} <i id="editShopIcon" style="font-size:var(--fs-12); color:var(--text-muted); font-style: normal;">✏️</i>`; 
            if(window.shopLogo) { 
                document.getElementById('sidebarLogo').src = window.shopLogo; 
                document.getElementById('sidebarLogo').style.display = 'block'; 
            }
            window.loadSettingsToUI(); 
            window.applyPermissions(); 
            window.ksMsg('ទិន្នន័យទាំងអស់ត្រូវបាន Restore ជោគជ័យ!', 'ជោគជ័យ');
        } catch(err) { 
            window.ksMsg('ឯកសារមិនត្រឹមត្រូវតាមទម្រង់ទេ!', 'បរាជ័យ'); 
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

// ==========================================
// 13. APP ENTRY POINT (INITIALIZATION)
// ==========================================
window.onload = async () => {
    window.loadThemeSettings(); 
    window.checkAuthentication(window.applyPermissions); 
    
    // ១. ផ្ទៀងផ្ទាត់ License ជាមួយ Supabase ជាមុនសិន
    const isLicenseValid = await window.checkLicense();

    // ២. ប្រសិនបើ License មិនត្រឹមត្រូវ ឬផុតកំណត់ ត្រូវបញ្ឈប់ត្រឹមនេះ (មិនទាញទិន្នន័យទេ)
    if (!isLicenseValid) {
        return; 
    }

    // ៣. លុះត្រាតែ License ត្រឹមត្រូវ ទើបអនុញ្ញាតឱ្យទាញទិន្នន័យស្តុកមកប្រើ
    await window.loadDataFromSupabase(window.userAccounts);

    setInterval(() => {
        const dateEl = document.getElementById('currentDate');
        if(dateEl) dateEl.innerText = window.fDate();
    }, 1000);

    try { 
        window.currentInventoryView = localStorage.getItem(window.getBranchKey('inv_view_mode')) || 'grid'; 
        window.currentPOSView = localStorage.getItem(window.getBranchKey('pos_view_mode')) || 'grid'; 
    } catch(e) {}
    
    document.getElementById('displayShopName').innerHTML = `${window.shopName} <i id="editShopIcon" style="font-size:var(--fs-12); color:var(--text-muted); font-style: normal;">✏️</i>`; 
    if(window.shopLogo) { 
        document.getElementById('sidebarLogo').src = window.shopLogo; 
        document.getElementById('sidebarLogo').style.display = 'block'; 
    } 
    
    window.loadSettingsToUI(); 
    window.applyPermissions(); 
    window.updateCategories(); 
    window.setInventoryView(window.currentInventoryView, true); 
    window.setPOSView(window.currentPOSView, true); 
    window.renderAll(); 
    
    const header = document.getElementById('topHeaderBar'); 
    if (header) { header.classList.remove('hidden-header'); } 
    window.lastInvoiceCount = window.invoices.length; 
    
    // Auto Real-time Update Sync Listener
    setInterval(async () => {
        try {
            let { data } = await window.supabaseClient.from('branch_store').select('data_json').eq('branch_id', window.SHOP_BRANCH_ID).single();
            if (data && data.data_json && data.data_json.invoices) {
                let newCount = data.data_json.invoices.length;
                if (newCount > window.lastInvoiceCount) {
                    window.playOrderSound();
                    window.ksMsg('មានការកុម្ម៉ង់ថ្មីចូលពីអតិថិជន! សូមពិនិត្យមើលវិក្កយបត្រ។', '🔔 កុម្ម៉ង់ថ្មី');
                    window.invoices.splice(0, window.invoices.length, ...data.data_json.invoices);
                    if(data.data_json.inventory) window.inventory.splice(0, window.inventory.length, ...data.data_json.inventory);
                    window.lastInvoiceCount = newCount;
                    window.renderUnpaid();
                    window.renderInventory();
                }
            }
        } catch(e) {}
    }, 10000);
};