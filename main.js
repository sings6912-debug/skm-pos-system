// main.js

// ==========================================
// 1. BIND UTILS & CONFIGS TO WINDOW
// ==========================================
window.fDate = function() { 
    const d = new Date(); 
    return d.toLocaleDateString('km-KH') + ' ' + d.toLocaleTimeString('km-KH'); 
}; 

window.fMoney = function(num) { 
    return '$' + parseFloat(num || 0).toFixed(2); 
};

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

window.playBeep = function() { 
    try { 
        const AudioContext = window.AudioContext || window.webkitAudioContext; 
        if(!AudioContext) return; 
        const ctx = new AudioContext(); 
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

window.playOrderSound = function() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if(!AudioContext) return;
        const ctx = new AudioContext();
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

window.generateInvoiceId = function() {
    let counters = JSON.parse(localStorage.getItem(window.getBranchKey('invoice_counter'))) || { lastDate: '', seq: 0 };
    let d = new Date(); 
    let todayStr = String(d.getFullYear()).slice(-2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    if (counters.lastDate === todayStr) counters.seq += 1; else { counters.lastDate = todayStr; counters.seq = 1; }
    localStorage.setItem(window.getBranchKey('invoice_counter'), JSON.stringify(counters)); 
    return `INV-${todayStr}-${String(counters.seq).padStart(3, '0')}`;
};

window.logAction = function(type, itemName, qty, note, activeUserRef) { 
    if(!window.sysSettings || !window.sysSettings.logs) return; 
    let executor = activeUserRef ? (activeUserRef.fullName ? activeUserRef.fullName : activeUserRef.username) : 'system'; 
    let dateStr = typeof window.fDate==='function' ? window.fDate() : new Date().toLocaleString();
    window.historyLog.unshift({ id: Date.now(), date: dateStr, type, itemName, qty, note: `${note} (${executor})` }); 
    if(window.historyLog.length > 500) window.historyLog.pop(); 
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
        dashExpiryAlertTitle: '🚨 ថ្នាំជិតផុតកំណត់ (Expired / Near Expiry Alert)',
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
        setUserMgmtSub: 'បង្កើត លុប ឬកែប្រែគណនី និងកំណត់សិទ្ធិ (Role) អោយបុគ្គលិកប្រើប្រាស់។',
        btnAddNewUser: '➕ បង្កើតគណនីថ្មី',
        thUserFullName: 'ឈ្មោះពេញ',
        thUserLogin: 'ឈ្មោះ Login',
        thUserRole: 'សិទ្ធិប្រើប្រាស់',
        thUserPin: 'លេខ PIN',
        allRolesFilter: 'ទាំងអស់',
        cantDeleteAdmin: 'មិនអាចលុប',
        setSysTitle: '⚙️ ការកំណត់ប្រព័ន្ធ (System Settings)',
        setSysSub: 'កំណត់មុខងារ (Modules) ណាខ្លះដែលអ្នកចង់បង្ហាញ ឬលាក់។',
        setStorePinLabel: '🔐 លេខសម្ងាត់ហាង (Store PIN ៤ ខ្ទង់)៖',
        setTickerNewsLabel: '📢 សេចក្តីជូនដំណឹងរត់ខាងក្រោម (News Ticker)៖',
        setCustLabel: 'អតិថិជន (Customers): 启用客户资料管理。',
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
        errAdminOnlyLogo: 'មានតែគណនី Admin ប៉ុណ្ណោះដែលអាចប្តូរឈ្មោះ និង Logo បានកំរិតខ្ពស់!',
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
        btnUploadQr: '📞 上传收款码',
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
        msgRequireCust: 'Please enter customer name first!',
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
    if (userDisplayEl) userDisplayEl.innerHTML = d.adminUserText || '👤 អ្នកគ្រប់គ្រងប្រព័ន្ធ';

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
        const formGroups = settingsCards[3].querySelectorAll('.form-group label');
        if (formGroups.length >= 2) {
            formGroups[0].innerText = d.setStorePinLabel || '🔐 លេខសម្ងាត់ហាង (Store PIN ៤ ខ្ទង់)៖';
            formGroups[1].innerText = d.setTickerNewsLabel || '📢 សេចក្តីជូនដំណឹងប្រចាំថ្ងៃ៖';
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

// ==========================================
// 4. SMART MULTI-LANGUAGE ALERT & CONFIRM DIALOG
// ==========================================
window.ksMsg = function(msg, title, isConfirm = false, onConfirm = null) {
    const box = document.getElementById('ksMsgBox');
    if (!box) return alert(msg);

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

    if (isConfirm) {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-outline';
        cancelBtn.innerText = d.btnCancel || 'បោះបង់';
        cancelBtn.onclick = () => { box.style.display = 'none'; };
        actContainer.appendChild(cancelBtn);

        const okBtn = document.createElement('button');
        okBtn.className = 'btn btn-success';
        okBtn.innerText = d.btnConfirmOk || 'យល់ព្រម';
        okBtn.onclick = () => {
            box.style.display = 'none';
            if (typeof onConfirm === 'function') onConfirm();
        };
        actContainer.appendChild(okBtn);
    } else {
        const okBtn = document.createElement('button');
        okBtn.className = 'btn btn-primary';
        okBtn.innerText = d.btnConfirmOk || 'យល់ព្រម';
        okBtn.onclick = () => {
            box.style.display = 'none';
            if (typeof onConfirm === 'function') onConfirm();
        };
        actContainer.appendChild(okBtn);
    }

    box.style.display = 'flex';
};

// ==========================================
// 5. LIVE SYNC STATUS INDICATOR
// ==========================================
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
// 6. MASTER REAL-TIME DATA SAVE & SYNC (SMART MERGE FIX)
// ==========================================
window.saveData = async function(userAccountsRef, renderAllCallback) {
    window.setSyncStatus('syncing');

    if (userAccountsRef) {
        window.userAccounts = userAccountsRef;
        localStorage.setItem(window.getBranchKey('auth_users_pro'), JSON.stringify(userAccountsRef));
    }
    
    window.lastInvoiceCount = window.invoices ? window.invoices.length : 0;

    let cleanInventory = (window.inventory || []).filter(item => item !== null && typeof item === 'object');
    
    localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(cleanInventory));
    localStorage.setItem(window.getBranchKey('hist_pro'), JSON.stringify(window.historyLog || []));
    localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(window.invoices || []));
    localStorage.setItem(window.getBranchKey('expenses_pro'), JSON.stringify(window.expenses || []));
    localStorage.setItem(window.getBranchKey('shop_name'), window.shopName || '');
    localStorage.setItem(window.getBranchKey('shop_logo'), window.shopLogo || '');
    localStorage.setItem(window.getBranchKey('shop_qr'), window.shopQR || '');
    localStorage.setItem(window.getBranchKey('customers_pro'), JSON.stringify(window.customers || []));
    localStorage.setItem(window.getBranchKey('sys_settings'), JSON.stringify(window.sysSettings || {}));

    try {
        if(window.supabaseClient && navigator.onLine) {
            // 🛑 ឆ្លាតវៃ (Smart Merge): ទាញយកពី Cloud មកផ្ទទៀងផ្ទាត់សិនមុននឹង Save ជាន់ពីលើ
            let { data } = await window.supabaseClient.from('branch_store').select('data_json').eq('branch_id', window.SHOP_BRANCH_ID).single();
            let cloudData = (data && data.data_json) ? data.data_json : {};

            // បញ្ចូលវិក្កយបត្រថ្មីពី Cloud ដែលអត់ទាន់មានក្នុងម៉ាស៊ីន (ឧ. កុម្ម៉ង់ពី Menu)
            if (cloudData.invoices) {
                cloudData.invoices.forEach(cInv => {
                    if (!window.invoices.find(lInv => String(lInv.id) === String(cInv.id))) {
                        window.invoices.push(cInv);
                    }
                });
                window.invoices.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            }

            // បញ្ចូលអតិថិជនពី Cloud
            if (cloudData.customers) {
                cloudData.customers.forEach(cC => {
                    if (!window.customers.find(lC => String(lC.name).toLowerCase() === String(cC.name).toLowerCase())) {
                        window.customers.push(cC);
                    }
                });
            }

            let packageData = {
                inventory: cleanInventory, 
                historyLog: window.historyLog, 
                invoices: window.invoices, 
                expenses: window.expenses,
                shopName: window.shopName, 
                shopLogo: window.shopLogo, 
                shopQR: window.shopQR, 
                customers: window.customers, 
                sysSettings: window.sysSettings, 
                userAccounts: window.userAccounts,
                shopPhone: window.shopPhone || '', 
                shopAddress: window.shopAddress || '', 
                shopTelegram: window.shopTelegram || '', 
                telegramBotToken: window.telegramBotToken || '', 
                telegramChatId: window.telegramChatId || '',
                invoiceCounter: JSON.parse(localStorage.getItem(window.getBranchKey('invoice_counter'))) || {seq:0, lastDate:''}
            };

            await window.supabaseClient
                .from('branch_store')
                .upsert({ 
                    branch_id: window.SHOP_BRANCH_ID, 
                    data_json: packageData,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'branch_id' });
            
            const now = new Date();
            window.setSyncStatus('synced', `Synced: ${now.toLocaleTimeString()}`);
        } else {
            window.setSyncStatus('error', 'រក្សាទុកបានតែក្នុងម៉ាស៊ីន (Offline)');
        }
    } catch(e) {
        window.setSyncStatus('error', 'Sync បរាជ័យ');
    }

    if(typeof renderAllCallback === 'function') renderAllCallback();
};

window.loadDataFromSupabase = async function(userAccountsRef) {
    try {
        if(!window.supabaseClient) return;
        let { data, error } = await window.supabaseClient
            .from('branch_store')
            .select('data_json')
            .eq('branch_id', window.SHOP_BRANCH_ID)
            .single();

        if (data && data.data_json) {
            let d = data.data_json;
            window.inventory.splice(0, window.inventory.length, ...(d.inventory || []));
            window.historyLog.splice(0, window.historyLog.length, ...(d.historyLog || []));
            window.invoices.splice(0, window.invoices.length, ...(d.invoices || []));
            window.expenses.splice(0, window.expenses.length, ...(d.expenses || []));
            window.customers.splice(0, window.customers.length, ...(d.customers || []));
            
            window.shopName = d.shopName || 'SKM INTEGRATE';
            window.shopLogo = d.shopLogo || '';
            window.shopQR = d.shopQR || '';
            window.shopPhone = d.shopPhone || '';
            window.shopAddress = d.shopAddress || '';
            window.shopTelegram = d.shopTelegram || '';
            window.telegramBotToken = d.telegramBotToken || '';
            window.telegramChatId = d.telegramChatId || '';
            
            if(d.sysSettings) {
                if(!window.sysSettings) window.sysSettings = {};
                Object.assign(window.sysSettings, d.sysSettings);
            }
            if(d.userAccounts && userAccountsRef) {
                userAccountsRef.splice(0, userAccountsRef.length, ...d.userAccounts);
            }
        }
    } catch(e) {}
};

// ==========================================
// 13. GLOBAL UI & APP FLOW METHODS
// ==========================================
window.switchTab = function(tabId, title, elem) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active')); 
    if(elem) elem.classList.add('active'); 

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
    
    if (tabId === 'about') {
        if(typeof window.displayLicenseInfo === 'function') window.displayLicenseInfo();
    }
    
    if(typeof window.renderAll === 'function') window.renderAll();
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
    const isGuest = (window.currentRole === 'guest'); // Added logic for guest preventing empty blank page issue

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

    if(document.getElementById('setStorePin')) {
        document.getElementById('setStorePin').value = window.sysSettings.storePin || '1234';
    }
    if(document.getElementById('setTickerNews')) {
        document.getElementById('setTickerNews').value = window.sysSettings.tickerNews || '📢 សេចក្តីជូនដំណឹងប្រចាំថ្ងៃ៖ សូមបុគ្គលិកទាំងអស់ពិនិត្យមើលស្តុកទំនិញឱ្យបានត្រឹមត្រូវមុនពេលប្តូរវេន! ជូនពរឱ្យការលក់ដាច់ច្រើនៗ! 🚀';
    }
};

window.saveSysSettings = async function() { 
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

    if(window.currentRole !== 'admin') {
        if(typeof window.ksMsg==='function') return window.ksMsg(d.errNoPermission || 'គ្មានសិទ្ធិ', d.errNoPermission || 'គ្មានសិទ្ធិ'); 
        else return alert('គ្មានសិទ្ធិ');
    }
    
    const newStorePin = document.getElementById('setStorePin') ? document.getElementById('setStorePin').value.trim() : '1234';
    const adminAccount = window.userAccounts ? window.userAccounts.find(x => x.username === 'admin') : null;

    if (adminAccount && String(adminAccount.pin).trim() === newStorePin) {
        if(typeof window.ksMsg==='function') return window.ksMsg("❌ លេខកូដហាង (Store PIN) មិនអាចដូចលេខ PIN របស់ Admin បានទេ! សូមជ្រើសរើសលេខផ្សេង។", "បម្រាមសុវត្ថិភាព");
        else return alert("❌ លេខកូដហាង (Store PIN) មិនអាចដូចលេខ PIN របស់ Admin បានទេ!");
    }

    if(!window.sysSettings) window.sysSettings = {};
    window.sysSettings.storePin = newStorePin || '1234';

    if(document.getElementById('setTickerNews')) {
        window.sysSettings.tickerNews = document.getElementById('setTickerNews').value.trim();
    }

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

    if(document.getElementById('conditionListContainer')) document.getElementById('conditionListContainer').style.display = window.sysSettings.condition ? 'block' : 'none';
    
    if(typeof window.updateCategories === 'function') window.updateCategories(); 
    if(typeof window.applyPermissions === 'function') window.applyPermissions(); 
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
        else return alert('សូមបញ្ចូលលេខកូដ (License Key)!');
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
            .single();

        if (error || !data) { 
            if (btnUnlock) { btnUnlock.innerText = '🔓 បើកដំណើរការ'; btnUnlock.disabled = false; }
            if(typeof window.ksMsg==='function') return window.ksMsg('❌ លេខកូដ License មិនត្រឹមត្រូវ ឬមិនទាន់ត្រូវបានបើកសិទ្ធិ!', 'បរាជ័យ'); 
            else return alert('❌ លេខកូដ License មិនត្រឹមត្រូវ ឬមិនទាន់ត្រូវបានបើកសិទ្ធិ!');
        }

        const expiry = new Date(data.expires_at).getTime();
        if (expiry <= Date.now()) { 
            if (btnUnlock) { btnUnlock.innerText = '🔓 បើកដំណើរការ'; btnUnlock.disabled = false; }
            if(typeof window.ksMsg==='function') return window.ksMsg('❌ លេខកូដ License នេះបានផុតកំណត់ហើយ!', 'បរាជ័យ'); 
            else return alert('❌ លេខកូដ License នេះបានផុតកំណត់ហើយ!');
        }

        localStorage.setItem(window.getBranchKey('license_key'), inputKey); 
        window.activeLicenseData = data; 

        if (lockScreen) lockScreen.style.display = 'none'; 
        if (sidebar) sidebar.style.pointerEvents = 'auto'; 

        if(typeof window.loadDataFromSupabase==='function') await window.loadDataFromSupabase(window.userAccounts);
        if(typeof window.loadSettingsToUI==='function') window.loadSettingsToUI(); 
        if(typeof window.applyPermissions==='function') window.applyPermissions(); 
        if(typeof window.updateCategories==='function') window.updateCategories();
        if(typeof window.renderAll==='function') window.renderAll(); 

        if(typeof window.showToast==='function') window.showToast("✅ សិទ្ធិប្រើប្រាស់ត្រូវបានបើកដំណើរការជោគជ័យ!");

    } catch(e) { 
        if (btnUnlock) { btnUnlock.innerText = '🔓 បើកដំណើរការ'; btnUnlock.disabled = false; }
        if(typeof window.ksMsg==='function') window.ksMsg('❌ មិនអាចភ្ជាប់ទៅកាន់ Server ដើម្បីផ្ទៀងផ្ទាត់ License បានទេ!', 'បរាជ័យ'); 
        else alert('❌ មិនអាចភ្ជាប់ទៅកាន់ Server ដើម្បីផ្ទៀងផ្ទាត់ License បានទេ!');
    } 
};

window.verifyAndSaveLicenseFromAbout = async function() { 
    const inputEl = document.querySelector('#tab-about input');
    const inputKey = inputEl ? inputEl.value.trim() : ''; 
    if(!inputKey) {
        if(typeof window.ksMsg==='function') return window.ksMsg('សូមបញ្ចូលលេខកូដ (License Key)!'); 
        else return alert('សូមបញ្ចូលលេខកូដ (License Key)!');
    }

    try { 
        let { data, error } = await window.supabaseClient
            .from('branch_licenses')
            .select('*')
            .eq('branch_id', window.SHOP_BRANCH_ID)
            .eq('license_key', inputKey)
            .eq('is_active', true)
            .single();

        if (error || !data) { 
            if(typeof window.ksMsg==='function') return window.ksMsg('❌ លេខកូដ License មិនត្រឹមត្រូវ ឬមិនទាន់ត្រូវបានបើកសិទ្ធិ!', 'បរាជ័យ'); 
            else return alert('❌ លេខកូដ License មិនត្រឹមត្រូវ ឬមិនទាន់ត្រូវបានបើកសិទ្ធិ!');
        }

        const expiry = new Date(data.expires_at).getTime();
        if (expiry <= Date.now()) { 
            if(typeof window.ksMsg==='function') return window.ksMsg('❌ លេខកូដ License នេះបានផុតកំណត់ហើយ!', 'បរាជ័យ'); 
            else return alert('❌ លេខកូដ License នេះបានផុតកំណត់ហើយ!');
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
            alert('✅ សិទ្ធិប្រើប្រាស់ត្រូវបានធ្វើបច្ចុប្បន្នភាពជោគជ័យ!');
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
            let statusBadge = `<span style="display: inline-flex; align-items: center; gap: 4px; color: #059669; font-weight: bold; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 13px;">${t.active} (${diffDays} ${t.days})</span>`; 

            infoBox.innerHTML = `
                <div style="background: var(--card-bg, #ffffff); border: 1.5px solid var(--border-color, #e2e8f0); padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); color: var(--text-main, #1e293b);">
                    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-color, #cbd5e1); padding-bottom: 12px; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                        <div style="font-size: 15px; font-weight: bold; color: var(--text-main, #0f172a);">
                            ${t.branch} <span style="color: #0284c7; font-weight: 900; background: rgba(2, 132, 199, 0.1); padding: 3px 8px; border-radius: 6px;">${license.branch_id || window.SHOP_BRANCH_ID}</span>
                        </div>
                        <div>${statusBadge}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                        <div style="font-size: 14px; font-weight: bold; color: var(--text-muted, #64748b);">
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
        else return alert('គ្មានសិទ្ធិ');
    }
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
    
    if(typeof window.changeAppLanguage==='function') window.changeAppLanguage(lang);
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
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

    const newName = document.getElementById('newShopNameInput').value.trim(); 
    const newPhone = document.getElementById('newShopPhoneInput').value.trim(); 
    const newAddress = document.getElementById('newShopAddressInput').value.trim(); 
    const newTelegram = document.getElementById('newShopTelegramInput').value.trim(); 
    const newBotToken = document.getElementById('newBotTokenInput').value.trim(); 
    const newChatId = document.getElementById('newChatIdInput').value.trim(); 
    
    if(newName !== "") { 
        if(typeof window.updateShopInfo === 'function') {
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
        } else {
            window.shopName = newName;
            if(globalThis.shopLogo !== undefined) window.shopLogo = globalThis.shopLogo;
            if(globalThis.shopQR !== undefined) window.shopQR = globalThis.shopQR;
        }
        
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
    if(typeof window.renderDashboard==='function') window.renderDashboard(); 
    if(typeof window.renderInventory==='function') window.renderInventory(); 
    if(typeof window.renderPOSProducts==='function') window.renderPOSProducts(); 
    if(typeof window.renderUnpaid==='function') window.renderUnpaid(); 
    if(typeof window.renderExpenses==='function') window.renderExpenses(); 
    if(typeof window.renderHistory==='function') window.renderHistory(); 
    if(typeof window.renderCustomers==='function') window.renderCustomers(); 
    if(typeof window.updateCustomerDatalist==='function') window.updateCustomerDatalist(); 
    if(typeof window.populateEditInvoiceSelect==='function') window.populateEditInvoiceSelect(); 
    if(typeof window.displayLicenseInfo==='function') window.displayLicenseInfo(); 
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
        if(document.getElementById('dashEstRevenue')) document.getElementById('dashEstRevenue').innerText = typeof window.fMoney==='function'?window.fMoney(estRev):`$${estRev}`; 
        if(document.getElementById('dashTotalRevenue')) document.getElementById('dashTotalRevenue').innerText = typeof window.fMoney==='function'?window.fMoney(totalSalesRevenue):`$${totalSalesRevenue}`; 
        if(document.getElementById('dashTotalExpenses')) document.getElementById('dashTotalExpenses').innerText = typeof window.fMoney==='function'?window.fMoney(totalExpenses):`$${totalExpenses}`;
        if(document.getElementById('dashTotalUnpaid')) document.getElementById('dashTotalUnpaid').innerText = typeof window.fMoney==='function'?window.fMoney(totalUnpaid):`$${totalUnpaid}`;
        let netProfitEl = document.getElementById('dashNetProfit');
        if(netProfitEl) { netProfitEl.innerText = typeof window.fMoney==='function'?window.fMoney(netProfit):`$${netProfit}`; netProfitEl.style.color = netProfit >= 0 ? 'var(--success)' : 'var(--danger)'; }
        
        const lang = localStorage.getItem('app_lang') || 'km';
        const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

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
    } catch(e) {}
};

window.renderHistory = function() {
    const searchVal = document.getElementById('historySearch') ? document.getElementById('historySearch').value.toLowerCase() : ''; 
    const dateFrom = document.getElementById('historyDateFrom'); 
    const dateTo = document.getElementById('historyDateTo'); 
    const fromTime = (dateFrom && dateFrom.value) ? new Date(dateFrom.value).getTime() : 0; 
    const toTime = (dateTo && dateTo.value) ? new Date(dateTo.value).getTime() : Infinity; 
    let fHtml = '';
    
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

    window.historyLog.filter(h => (String(h.itemName).toLowerCase().includes(searchVal) || (h.note && String(h.note).toLowerCase().includes(searchVal))) && (h.id >= fromTime && h.id <= toTime)).forEach(h => { 
        let tName = h.type === 'sale' ? (d.logSale||'លក់ចេញ') : (h.type === 'add' ? (d.logAdd||'នាំចូលថ្មី') : (d.logUpdate||'កែប្រែទិន្នន័យ')); 
        let bClass = h.type === 'sale' ? 'badge-sale' : (h.type === 'add' ? 'badge-add' : 'badge-update'); 
        let catStr = '-', unitStr = ''; 
        const pItem = window.inventory.find(i => i.name === h.itemName); 
        if(pItem) { catStr = pItem.category||'-'; unitStr = pItem.unit ? ' ' + pItem.unit : ''; }
        
        let qtyDisplay = h.qty === 0 ? '0' : `${h.qty > 0 ? '+' : (h.type === 'sale'?'-':'')}${Math.abs(h.qty)}${unitStr}`; 
        fHtml += `<tr><td data-sort="${h.id}" style="font-size:var(--fs-12); color:var(--text-muted);">${h.date}</td><td data-sort="${tName}"><span class="badge ${bClass}">${tName}</span></td><td data-sort="${h.itemName}" style="font-weight:bold; color:var(--text-main);">${h.itemName}</td><td data-sort="${catStr}" style="font-size:var(--fs-12); color:var(--text-muted);">${catStr}</td><td data-sort="${h.qty}" style="font-weight:bold; color:${h.type === 'sale' ? 'var(--warning)' : (h.qty > 0 ? 'var(--success)' : 'var(--text-main)')};">${qtyDisplay}</td><td data-sort="${h.note||''}" style="font-size:var(--fs-12);">${h.note||''}</td></tr>`; 
    });
    
    const hTable = document.getElementById('historyTable');
    if(hTable) hTable.innerHTML = fHtml || `<tr><td colspan="6" style="text-align:center;">${d.noHistData || 'មិនមានទិន្នន័យទេ'}</td></tr>`; 
    if(typeof window.filterTable === 'function') setTimeout(() => window.filterTable('mainHistoryTable'), 50);
};

window.clearHistory = function() { 
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
    if(typeof window.ksMsg==='function') {
        window.ksMsg(d.confirmClearHistory || 'តើអ្នកពិតជាចង់លុបប្រវត្តិប្រតិបត្តិការទាំងអស់មែនទេ?', d.confirmDeleteTitle || 'បញ្ជាក់ការលុប', true, async () => { 
            window.historyLog.length = 0; 
            if(typeof window.saveData==='function') await window.saveData(window.userAccounts); 
            window.renderHistory();
        }); 
    }
};

// ==========================================
// 17. EXPORT & IMPORT UTILITIES
// ==========================================
window.importCSV = function(e) {
    const file = e.target.files[0]; if (!file) return; 
    const r = new FileReader();
    r.onload = async (ev) => {
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
        if(typeof window.saveData==='function') await window.saveData(window.userAccounts); 
        if(typeof window.ksMsg==='function') window.ksMsg(`បាននាំចូលទិន្នន័យពី Excel ចំនួន ${count} មុខ!`, 'ជោគជ័យ');
        if(typeof window.renderInventory==='function') window.renderInventory();
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
    r.onload = async (ev) => {
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

// ==========================================
// 18. APP ENTRY POINT (Window.onload)
// ==========================================
window.onload = async () => {
    if(typeof window.loadThemeSettings==='function') window.loadThemeSettings(); 
    
    // 🌐 1. កំណត់ និងប្តូរភាសាភ្លាមៗនៅដើមទី
    const savedLang = localStorage.getItem('app_lang') || 'km';
    const langSel = document.getElementById('globalLangSelect');
    if (langSel) langSel.value = savedLang;
    if(typeof window.changeAppLanguage==='function') window.changeAppLanguage(savedLang);

    if(typeof window.checkAuthentication==='function') {
        window.checkAuthentication(); 
    }
    
    // ២. ផ្ទៀងផ្ទាត់ License ជាមួយ Supabase (Smart Cloud Check)
    if(typeof window.checkLicense==='function') {
        const isLicenseValid = await window.checkLicense();
        if (!isLicenseValid) return; 
    }

    // ៣. ទាញទិន្នន័យពី Supabase
    if(typeof window.loadDataFromSupabase==='function') {
        await window.loadDataFromSupabase(window.userAccounts);
    }

    setInterval(() => {
        const dateEl = document.getElementById('currentDate');
        if(dateEl && typeof window.fDate === 'function') dateEl.innerText = window.fDate();
    }, 1000);

    try { 
        window.currentInventoryView = localStorage.getItem(window.getBranchKey('inv_view_mode')) || 'grid'; 
        window.currentPOSView = localStorage.getItem(window.getBranchKey('pos_view_mode')) || 'grid'; 
    } catch(e) {}
    
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
    
    // 💡 ហៅមុខងារ render ទាំងអស់
    if(typeof window.renderAll === 'function') window.renderAll(); 

    const header = document.getElementById('topHeaderBar'); 
    if (header) { header.classList.remove('hidden-header'); } 
    window.lastInvoiceCount = window.invoices ? window.invoices.length : 0; 
    
    // Auto Real-time Update Sync Listener
    setInterval(async () => {
        try {
            if(!window.supabaseClient || !navigator.onLine) return;
            let { data } = await window.supabaseClient.from('branch_store').select('data_json').eq('branch_id', window.SHOP_BRANCH_ID).single();
            if (data && data.data_json && data.data_json.invoices) {
                let cloudInvoices = data.data_json.invoices;
                let hasNewOrder = false;

                cloudInvoices.forEach(cInv => {
                    if (!window.invoices.find(lInv => String(lInv.id) === String(cInv.id))) {
                        window.invoices.push(cInv);
                        hasNewOrder = true;
                    }
                });

                if (hasNewOrder) {
                    window.invoices.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                    
                    if(typeof window.playOrderSound === 'function') window.playOrderSound();
                    const lang = localStorage.getItem('app_lang') || 'km';
                    const msgText = lang === 'en' ? 'New order received from Digital Menu!' : (lang === 'zh' ? '收到新订单！' : 'មានការកុម្ម៉ង់ថ្មីចូលពីអតិថិជន (Menu)! សូមពិនិត្យមើលវិក្កយបត្រ។');
                    const msgTitle = lang === 'en' ? '🔔 New Order' : (lang === 'zh' ? '🔔 新订单' : '🔔 កុម្ម៉ង់ថ្មី');
                    if(typeof window.ksMsg === 'function') window.ksMsg(msgText, msgTitle);
                    
                    if(typeof window.renderUnpaid === 'function') window.renderUnpaid();
                }
            }
        } catch(e) {}
    }, 10000);
};