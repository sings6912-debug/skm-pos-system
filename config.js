// config.js
window.SUPABASE_URL = 'https://uynmpjykedjjjyxczsja.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bm1wanlrZWRqamp5eGN6c2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MDc1NjIsImV4cCI6MjEwMjE4MzU2Mn0.vw8UpBoEWvbQwl2J5alfTB0nvv7EizB8EpwEsp4ugCg';
window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

window.urlParams = new URLSearchParams(window.location.search);
window.SHOP_BRANCH_ID = window.urlParams.get('branch') || 'branch_1';
window.getBranchKey = (key) => `ks2_${window.SHOP_BRANCH_ID}_${key}`;

window.inventory = []; 
window.historyLog = []; 
window.invoices = []; 
window.cart = []; 
window.customers = []; 
window.expenses = [];
window.shopName = 'SKM INTEGRATE'; 
window.shopLogo = ''; 
window.shopQR = ''; 
window.shopPhone = ''; 
window.shopAddress = ''; 
window.shopTelegram = ''; 
window.telegramBotToken = ''; 
window.telegramChatId = ''; 
window.sysSettings = { cust: true, unpaid: true, logs: true, cost: true, discount: true, showSeller: true, tax: false, taxRate: 10, condition: false, conditionList: 'MISB, Loose, New, Used', preorder: false, deliveryFee: 1.5, expiry: true };
window.lastInvoiceCount = 0;
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
    if(!window.sysSettings.logs) return; 
    let executor = activeUserRef ? (activeUserRef.fullName ? activeUserRef.fullName : activeUserRef.username) : 'system'; 
    window.historyLog.unshift({ id: Date.now(), date: window.fDate(), type, itemName, qty, note: `${note} (${executor})` }); 
    if(window.historyLog.length > 500) window.historyLog.pop(); 
};

window.loadDataFromSupabase = async function(userAccountsRef) {
    try {
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
            
            if(d.sysSettings) Object.assign(window.sysSettings, d.sysSettings);
            if(d.userAccounts && userAccountsRef) {
                userAccountsRef.splice(0, userAccountsRef.length, ...d.userAccounts);
            }
        }
    } catch(e) {}
};

window.saveData = async function(userAccountsRef, renderAllCallback) {
    window.lastInvoiceCount = window.invoices.length;
    let cleanInventory = window.inventory.filter(item => item !== null && typeof item === 'object');
    
    let packageData = {
        inventory: cleanInventory, historyLog: window.historyLog, invoices: window.invoices, expenses: window.expenses,
        shopName: window.shopName, shopLogo: window.shopLogo, shopQR: window.shopQR, customers: window.customers, sysSettings: window.sysSettings, 
        userAccounts: userAccountsRef,
        shopPhone: window.shopPhone, shopAddress: window.shopAddress, shopTelegram: window.shopTelegram, 
        telegramBotToken: window.telegramBotToken, telegramChatId: window.telegramChatId
    };

    localStorage.setItem(window.getBranchKey('inv_pro'), JSON.stringify(cleanInventory));
    localStorage.setItem(window.getBranchKey('hist_pro'), JSON.stringify(window.historyLog));
    localStorage.setItem(window.getBranchKey('invoices_pro'), JSON.stringify(window.invoices));
    localStorage.setItem(window.getBranchKey('expenses_pro'), JSON.stringify(window.expenses));
    localStorage.setItem(window.getBranchKey('shop_name'), window.shopName);
    localStorage.setItem(window.getBranchKey('shop_logo'), window.shopLogo);
    localStorage.setItem(window.getBranchKey('shop_qr'), window.shopQR);
    localStorage.setItem(window.getBranchKey('customers_pro'), JSON.stringify(window.customers));
    localStorage.setItem(window.getBranchKey('sys_settings'), JSON.stringify(window.sysSettings));
    localStorage.setItem(window.getBranchKey('shop_phone'), window.shopPhone);
    localStorage.setItem(window.getBranchKey('shop_address'), window.shopAddress);
    localStorage.setItem(window.getBranchKey('shop_telegram'), window.shopTelegram);
    localStorage.setItem(window.getBranchKey('telegram_bot_token'), window.telegramBotToken);
    localStorage.setItem(window.getBranchKey('telegram_chat_id'), window.telegramChatId);

    try {
        await window.supabaseClient
            .from('branch_store')
            .upsert({ 
                branch_id: window.SHOP_BRANCH_ID, 
                data_json: packageData,
                updated_at: new Date()
            }, { onConflict: 'branch_id' });
    } catch(e) {}

    if(typeof renderAllCallback === 'function') renderAllCallback();
};