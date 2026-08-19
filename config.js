// config.js
window.SUPABASE_URL = 'https://uynmpjykedjjjyxczsja.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bm1wanlrZWRqamp5eGN6c2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MDc1NjIsImV4cCI6MjEwMjE4MzU2Mn0.vw8UpBoEWvbQwl2J5alfTB0nvv7EizB8EpwEsp4ugCg';
window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

window.urlParams = new URLSearchParams(window.location.search);
window.SHOP_BRANCH_ID = window.urlParams.get('branch') || 'branch_1';
window.getBranchKey = (key) => `ks2_${window.SHOP_BRANCH_ID}_${key}`;

// ១. ទាញយកទិន្នន័យពី LocalStorage ភ្លាមៗតាំងពីដើមទី (Synchronous Load)
const getLocalData = (key, defaultVal) => {
    try {
        const val = localStorage.getItem(window.getBranchKey(key));
        return val ? JSON.parse(val) : defaultVal;
    } catch(e) {
        return defaultVal;
    }
};

window.inventory = getLocalData('inv_pro', []); 
window.historyLog = getLocalData('hist_pro', []); 
window.invoices = getLocalData('invoices_pro', []); 
window.cart = []; 
window.customers = getLocalData('customers_pro', []); 
window.expenses = getLocalData('expenses_pro', []);
window.shopName = localStorage.getItem(window.getBranchKey('shop_name')) || 'SKM INTEGRATE'; 
window.shopLogo = localStorage.getItem(window.getBranchKey('shop_logo')) || ''; 
window.shopQR = localStorage.getItem(window.getBranchKey('shop_qr')) || ''; 
window.shopPhone = localStorage.getItem(window.getBranchKey('shop_phone')) || ''; 
window.shopAddress = localStorage.getItem(window.getBranchKey('shop_address')) || ''; 
window.shopTelegram = localStorage.getItem(window.getBranchKey('shop_telegram')) || ''; 
window.telegramBotToken = localStorage.getItem(window.getBranchKey('telegram_bot_token')) || ''; 
window.telegramChatId = localStorage.getItem(window.getBranchKey('telegram_chat_id')) || ''; 

window.sysSettings = getLocalData('sys_settings', { 
    cust: true, 
    unpaid: true, 
    logs: true, 
    cost: true, 
    discount: true, 
    showSeller: true, 
    tax: false, 
    taxRate: 10, 
    condition: false, 
    conditionList: 'MISB, Loose, New, Used', 
    preorder: false, 
    deliveryFee: 1.5, 
    expiry: true,
    storePin: '1234' 
});

window.lastInvoiceCount = window.invoices.length;
window.SECRET_SALT = "KOUSUKE_ERP_PRO_V1_";

window.updateShopInfo = function(name, logo, qr, phone, address, telegram, botToken, chatId) {
    if(name !== undefined) window.shopName = name;
    if(logo !== undefined) window.shopLogo = logo;
    if(qr !== undefined) window.shopQR = qr;
    if(phone !== undefined) window.shopPhone = phone;
    if(address !== undefined) window.shopAddress = address;
    if(telegram !== undefined) window.shopTelegram = telegram;
    if(botToken !== undefined) window.telegramBotToken = botToken;
    if(chatId !== undefined) window.telegramChatId = chatId;
};

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

window.ksMsg = function(text, title = 'ជូនដំណឹង', isConfirm = false, onConfirm = null) { 
    const titleEl = document.getElementById('ksMsgTitle');
    const textEl = document.getElementById('ksMsgText');
    const actionContainer = document.getElementById('ksMsgActions');
    const msgBox = document.getElementById('ksMsgBox');
    if(!titleEl || !textEl || !actionContainer || !msgBox) return;

    titleEl.innerText = title; 
    textEl.innerHTML = text; 
    actionContainer.innerHTML = '';
    
    const closeBtn = document.createElement('button'); 
    closeBtn.className = 'btn btn-outline'; 
    closeBtn.innerText = isConfirm ? 'បោះបង់' : 'យល់ព្រម'; 
    closeBtn.onclick = () => msgBox.style.display = 'none'; 
    actionContainer.appendChild(closeBtn); 
    
    if(isConfirm) { 
        const okBtn = document.createElement('button'); 
        okBtn.className = 'btn btn-primary'; 
        okBtn.innerText = 'យល់ព្រម'; 
        okBtn.onclick = () => { 
            msgBox.style.display = 'none'; 
            if(onConfirm) onConfirm(); 
        }; 
        actionContainer.appendChild(okBtn); 
    } 
    msgBox.style.display = 'flex';
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
    window.historyLog.unshift({ id: Date.now(), date: window.fDate(), type, itemName, qty, note: `${note} (${executor})` }); 
    if(window.historyLog.length > 500) window.historyLog.pop(); 
};

// ២. ទាញទិន្នន័យពី Supabase ដោយបញ្ចូលគ្នា (Merge) មិនឱ្យបាត់បង់ទិន្នន័យក្នុងម៉ាស៊ីន
window.loadDataFromSupabase = async function(userAccountsRef) {
    try {
        let { data, error } = await window.supabaseClient
            .from('branch_store')
            .select('data_json')
            .eq('branch_id', window.SHOP_BRANCH_ID)
            .single();

        if (data && data.data_json) {
            let d = data.data_json;

            // Merge Customers (បញ្ចូលអតិថិជនពី Cloud និង Local)
            if (Array.isArray(d.customers)) {
                d.customers.forEach(cCloud => {
                    if (cCloud && cCloud.name && !window.customers.some(cLoc => cLoc.name.toLowerCase() === cCloud.name.toLowerCase())) {
                        window.customers.push(cCloud);
                    }
                });
            }

            // Merge Invoices (បញ្ចូលវិក្កយបត្រពី Cloud និង Local)
            if (Array.isArray(d.invoices)) {
                d.invoices.forEach(invCloud => {
                    if (invCloud && invCloud.id && !window.invoices.some(invLoc => invLoc.id === invCloud.id)) {
                        window.invoices.push(invCloud);
                    }
                });
                window.invoices.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            }

            // Merge Inventory
            if (Array.isArray(d.inventory)) {
                d.inventory.forEach(pCloud => {
                    if (pCloud && pCloud.id && !window.inventory.some(pLoc => pLoc.id === pCloud.id)) {
                        window.inventory.push(pCloud);
                    }
                });
            }

            // Merge Expenses
            if (Array.isArray(d.expenses)) {
                d.expenses.forEach(eCloud => {
                    if (eCloud && eCloud.id && !window.expenses.some(eLoc => eLoc.id === eCloud.id)) {
                        window.expenses.push(eCloud);
                    }
                });
            }

            if(d.shopName) window.shopName = d.shopName;
            if(d.shopLogo) window.shopLogo = d.shopLogo;
            if(d.shopQR) window.shopQR = d.shopQR;
            if(d.shopPhone) window.shopPhone = d.shopPhone;
            if(d.shopAddress) window.shopAddress = d.shopAddress;
            if(d.shopTelegram) window.shopTelegram = d.shopTelegram;
            if(d.telegramBotToken) window.telegramBotToken = d.telegramBotToken;
            if(d.telegramChatId) window.telegramChatId = d.telegramChatId;
            
            if(d.sysSettings) Object.assign(window.sysSettings, d.sysSettings);
            if(d.userAccounts && userAccountsRef) {
                userAccountsRef.splice(0, userAccountsRef.length, ...d.userAccounts);
            }

            // រក្សាទុកទិន្នន័យដែលបាន Merge ចូល LocalStorage ភ្លាម
            localStorage.setItem(window.getBranchKey('customers_pro'), JSON.stringify(window.customers));
            localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(window.invoices));
            localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(window.inventory));
            localStorage.setItem(window.getBranchKey('expenses_pro'), JSON.stringify(window.expenses));
        }
    } catch(e) {
        console.warn("⚠️ ប្រើប្រាស់ទិន្នន័យក្នុងម៉ាស៊ីន (Offline / Local)");
    }
};