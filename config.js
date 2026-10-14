/**
 * config.js - កំណត់អថេរគោល ភ្ជាប់ Database (Supabase) និងទាញទិន្នន័យដំបូងពីម៉ាស៊ីន (LocalStorage)
 */

window.SUPABASE_URL = 'https://uynmpjykedjjjyxczsja.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bm1wanlrZWRqamp5eGN6c2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MDc1NjIsImV4cCI6MjEwMjE4MzU2Mn0.vw8UpBoEWvbQwl2J5alfTB0nvv7EizB8EpwEsp4ugCg';

// ការពារកុំឱ្យគាំងប្រព័ន្ធនៅពេលដាច់អ៊ីនធឺណិត (Offline Safe Initialization)
window.supabaseClient = null;
try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    }
} catch (err) {
    console.warn("Supabase initialization skipped (Offline Mode):", err);
}

window.urlParams = new URLSearchParams(window.location.search);
window.SHOP_BRANCH_ID = window.urlParams.get('branch') || 'branch_1';
window.getBranchKey = (key) => `ks2_${window.SHOP_BRANCH_ID}_${key}`;

// ១. ទាញយកទិន្នន័យពី LocalStorage ភ្លាមៗតាំងពីដើមទី (Synchronous Load)
const getLocalData = (key, defaultVal) => {
    try {
        const val = localStorage.getItem(window.getBranchKey(key));
        return val ? JSON.parse(val) : defaultVal;
    } catch (e) {
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

const defaultSysSettings = { 
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
    storePin: '1234',
    enableSound: true,
    receiptFooter: 'សូមអរគុណ! សូមអញ្ជើញមកម្តងទៀត។'
};

window.sysSettings = Object.assign({}, defaultSysSettings, getLocalData('sys_settings', {}));
window.lastInvoiceCount = Array.isArray(window.invoices) ? window.invoices.length : 0;
window.SECRET_SALT = "KOUSUKE_ERP_PRO_V1_";

window.updateShopInfo = function(name, logo, qr, phone, address, telegram, botToken, chatId) {
    if (name !== undefined) window.shopName = name;
    if (logo !== undefined) window.shopLogo = logo;
    if (qr !== undefined) window.shopQR = qr;
    if (phone !== undefined) window.shopPhone = phone;
    if (address !== undefined) window.shopAddress = address;
    if (telegram !== undefined) window.shopTelegram = telegram;
    if (botToken !== undefined) window.telegramBotToken = botToken;
    if (chatId !== undefined) window.telegramChatId = chatId;
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
    if (!toast) return;
    toast.style.background = isError ? 'var(--danger)' : 'var(--success)'; 
    toast.innerHTML = msg; 
    toast.style.display = 'block'; 
    toast.style.opacity = '1'; 
    setTimeout(() => { 
        toast.style.opacity = '0'; 
        setTimeout(() => toast.style.display = 'none', 300); 
    }, 2000);
};

// ប្រើប្រាស់ AudioContext រួមគ្នាតែមួយ ដើម្បីការពារបញ្ហាគាំងសំឡេងពេលចុចប៊ូតុងច្រើនដង
window.getSharedAudioContext = function() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!window._sharedAudioCtx || window._sharedAudioCtx.state === 'closed') {
        window._sharedAudioCtx = new AudioContext();
    }
    if (window._sharedAudioCtx.state === 'suspended') {
        window._sharedAudioCtx.resume().catch(() => {});
    }
    return window._sharedAudioCtx;
};

window.playBeep = function() { 
    if (window.sysSettings && window.sysSettings.enableSound === false) return;
    try { 
        const ctx = window.getSharedAudioContext(); 
        if (!ctx) return; 
        const osc = ctx.createOscillator(); 
        const gain = ctx.createGain(); 
        osc.connect(gain); 
        gain.connect(ctx.destination); 
        osc.type = 'sine'; 
        osc.frequency.setValueAtTime(850, ctx.currentTime); 
        gain.gain.setValueAtTime(0.05, ctx.currentTime); 
        osc.start(); 
        osc.stop(ctx.currentTime + 0.1); 
    } catch (e) {} 
};

window.playOrderSound = function() {
    if (window.sysSettings && window.sysSettings.enableSound === false) return;
    try {
        const ctx = window.getSharedAudioContext();
        if (!ctx) return;
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
    } catch (e) {} 
};

window.ksMsg = function(text, title = 'ជូនដំណឹង', isConfirm = false, onConfirm = null) { 
    const titleEl = document.getElementById('ksMsgTitle');
    const textEl = document.getElementById('ksMsgText');
    const actionContainer = document.getElementById('ksMsgActions');
    const msgBox = document.getElementById('ksMsgBox');
    if (!titleEl || !textEl || !actionContainer || !msgBox) return;

    titleEl.innerText = title; 
    textEl.innerHTML = text; 
    actionContainer.innerHTML = '';
    
    let primaryBtn = null;
    if (isConfirm) { 
        const cancelBtn = document.createElement('button'); 
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-outline'; 
        cancelBtn.innerText = 'បោះបង់'; 
        cancelBtn.onclick = () => { msgBox.style.display = 'none'; }; 
        actionContainer.appendChild(cancelBtn); 

        const okBtn = document.createElement('button'); 
        okBtn.type = 'button';
        okBtn.className = 'btn btn-primary'; 
        okBtn.innerText = 'យល់ព្រម'; 
        okBtn.onclick = () => { 
            msgBox.style.display = 'none'; 
            if (typeof onConfirm === 'function') onConfirm(); 
        }; 
        actionContainer.appendChild(okBtn); 
        primaryBtn = okBtn;
    } else {
        const okBtn = document.createElement('button'); 
        okBtn.type = 'button';
        okBtn.className = 'btn btn-primary'; 
        okBtn.innerText = 'យល់ព្រម'; 
        okBtn.onclick = () => { 
            msgBox.style.display = 'none'; 
            if (typeof onConfirm === 'function') onConfirm(); 
        }; 
        actionContainer.appendChild(okBtn); 
        primaryBtn = okBtn;
    }
    window.ksMsgOpenedAt = Date.now();
    msgBox.style.display = 'flex';
    setTimeout(() => {
        if (primaryBtn && msgBox.style.display !== 'none') primaryBtn.focus();
    }, 60);
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
    if (!window.sysSettings || !window.sysSettings.logs) return; 
    let executor = activeUserRef ? (activeUserRef.fullName ? activeUserRef.fullName : activeUserRef.username) : 'system'; 
    if (!window.historyLog) window.historyLog = [];
    window.historyLog.unshift({ id: Date.now(), date: window.fDate(), type, itemName, qty, note: `${note} (${executor})` }); 
    if (window.historyLog.length > 500) window.historyLog.pop(); 
};