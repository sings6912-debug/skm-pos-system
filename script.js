// ==========================================================================
// 1. SUPABASE & MULTI-BRANCH CONFIGURATION
// ==========================================================================
const SUPABASE_URL = 'https://uynmpjykedjjjyxczsja.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bm1wanlrZWRqamp5eGN6c2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MDc1NjIsImV4cCI6MjEwMjE4MzU2Mn0.vw8UpBoEWvbQwl2J5alfTB0nvv7EizB8EpwEsp4ugCg';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const urlParams = new URLSearchParams(window.location.search);
const SHOP_BRANCH_ID = urlParams.get('branch') || 'branch_1';
const getBranchKey = (key) => `ks2_${SHOP_BRANCH_ID}_${key}`;

// ==========================================================================
// 2. THEME & ACCENT COLOR SETTINGS
// ==========================================================================
window.darkenHex = function(hex, percent) {
    let r = parseInt(hex.substring(1,3),16); let g = parseInt(hex.substring(3,5),16); let b = parseInt(hex.substring(5,7),16);
    r = parseInt(r * (100 - percent) / 100); g = parseInt(g * (100 - percent) / 100); b = parseInt(b * (100 - percent) / 100);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};
window.handleCustomColor = function(hexColor) { let hoverColor = window.darkenHex(hexColor, 20); window.setAccentColor(hexColor, hoverColor); };
window.setAccentColor = function(primary, hover) {
    document.documentElement.style.setProperty('--primary', primary); document.documentElement.style.setProperty('--primary-hover', hover);
    let colorData = { primary: primary, hover: hover }; localStorage.setItem(getBranchKey('accent_color'), JSON.stringify(colorData));
    document.querySelectorAll('.color-swatch').forEach(el => { if(el.getAttribute('data-color') === primary) el.classList.add('active'); else el.classList.remove('active'); });
    const picker = document.getElementById('customColorPicker'); if(picker) picker.value = primary;
};
window.setThemeMode = function(mode) {
    if(mode === 'light') document.documentElement.classList.add('light-theme'); else document.documentElement.classList.remove('light-theme');
    localStorage.setItem(getBranchKey('theme'), mode); window.updateThemeUI(mode);
};
window.updateThemeUI = function(mode) {
    const darkBtn = document.getElementById('themeModeDarkBtn'); const lightBtn = document.getElementById('themeModeLightBtn'); if(!darkBtn || !lightBtn) return;
    if(mode === 'light') { lightBtn.classList.add('active'); darkBtn.classList.remove('active'); } else { darkBtn.classList.add('active'); lightBtn.classList.remove('active'); }
};
window.loadThemeSettings = function() {
    let mode = localStorage.getItem(getBranchKey('theme')) || 'dark'; window.setThemeMode(mode);
    let savedAccent = localStorage.getItem(getBranchKey('accent_color'));
    if(savedAccent) { try { let color = JSON.parse(savedAccent); window.setAccentColor(color.primary, color.hover); } catch(e){} } else { window.setAccentColor('#10b981', '#059669'); }
};
window.toggleTheme = function() { const isLight = document.documentElement.classList.contains('light-theme'); window.setThemeMode(isLight ? 'dark' : 'light'); };

// ==========================================================================
// 3. UTILITY FUNCTIONS & BARCODE SCANNER
// ==========================================================================
window.showToast = function(msg, isError = false) {
    const toast = document.getElementById('toastNotification'); toast.style.background = isError ? 'var(--danger)' : 'var(--success)'; toast.innerHTML = msg; toast.style.display = 'block'; toast.style.opacity = '1'; 
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.style.display = 'none', 300); }, 2000);
};

window.handleBarcodeScan = function(e) {
    if (e.key === 'Enter') {
        let searchVal = document.getElementById('posSearch').value.trim().toLowerCase(); if (!searchVal) return;
        let item = inventory.find(p => {
            if (!p) return false;
            let customIdMatch = p.customId ? String(p.customId).toLowerCase() === searchVal : false;
            let idMatch = p.id ? String(p.id).toLowerCase() === searchVal : false;
            let nameMatch = p.name ? String(p.name).toLowerCase() === searchVal : false;
            return customIdMatch || idMatch || nameMatch;
        });
        if (item) { window.addToCart(item.id); document.getElementById('posSearch').value = ''; window.renderPOSProducts(); window.showToast(`✅ បន្ថែម <b>${item.name}</b> ចូលកន្ត្រកជោគជ័យ!`); } 
        else { window.showToast(`❌ រកមិនឃើញទំនិញ: ${searchVal}`, true); document.getElementById('posSearch').select(); }
    }
};

let sortDirections = {};
window.sortTable = function(tableId, colIndex, type = 'string') {
    let table = document.getElementById(tableId); if(!table) return; let tbody = table.getElementsByTagName("tbody")[0]; let rows = Array.from(tbody.rows);
    if(rows.length === 1 && rows[0].cells.length === 1) return;
    let dir = sortDirections[tableId + colIndex] === 'asc' ? 'desc' : 'asc'; sortDirections[tableId + colIndex] = dir;
    rows.sort((a, b) => {
        let valA = a.cells[colIndex].hasAttribute('data-sort') ? a.cells[colIndex].getAttribute('data-sort') : a.cells[colIndex].innerText.trim(); 
        let valB = b.cells[colIndex].hasAttribute('data-sort') ? b.cells[colIndex].getAttribute('data-sort') : b.cells[colIndex].innerText.trim();
        if (type === 'number') return dir === 'asc' ? (parseFloat(valA)||0) - (parseFloat(valB)||0) : (parseFloat(valB)||0) - (parseFloat(valA)||0); 
        else return dir === 'asc' ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });
    rows.forEach(row => tbody.appendChild(row));
};

window.filterTable = function(tableId) {
    let table = document.getElementById(tableId); if(!table) return; let tbody = table.getElementsByTagName("tbody")[0]; let tr = tbody.getElementsByTagName("tr");
    let filterRow = table.getElementsByTagName("thead")[0].querySelector(".filter-row"); if (!filterRow) return;
    let allFilters = filterRow.querySelectorAll('input.col-filter, select.col-filter'); let filters = Array.from(allFilters).map(f => f.value.toLowerCase());
    for (let i = 0; i < tr.length; i++) {
        let row = tr[i]; if(row.cells.length === 1) continue; let display = true;
        for (let j = 0; j < filters.length; j++) {
            if (filters[j]) { let td = row.cells[j]; if (td && String(td.textContent || td.innerText).toLowerCase().indexOf(filters[j]) === -1) { display = false; break; } }
        }
        row.style.display = display ? "" : "none";
    }
};

window.generateInvoiceId = function() {
    let counters = JSON.parse(localStorage.getItem(getBranchKey('invoice_counter'))) || { lastDate: '', seq: 0 };
    let d = new Date(); let todayStr = String(d.getFullYear()).slice(-2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    if (counters.lastDate === todayStr) counters.seq += 1; else { counters.lastDate = todayStr; counters.seq = 1; }
    localStorage.setItem(getBranchKey('invoice_counter'), JSON.stringify(counters)); return `INV-${todayStr}-${String(counters.seq).padStart(3, '0')}`;
};

// ==========================================================================
// 4. AUTHENTICATION & USER MANAGEMENT
// ==========================================================================
let userAccounts = JSON.parse(localStorage.getItem(getBranchKey('auth_users_pro'))) || [ { id: 'U_ADMIN', username: 'admin', password: '123', pin: '0000', role: 'admin', fullName: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ' } ];
let activeUser = JSON.parse(localStorage.getItem(getBranchKey('active_user_obj'))) || null; let currentRole = activeUser ? activeUser.role : 'admin';

window.checkAuthentication = function() {
    if (!activeUser) { document.getElementById('authScreen').style.display = 'flex'; document.getElementById('loginForm').style.display = 'block'; document.getElementById('forgotPassForm').style.display = 'none'; } 
    else { document.getElementById('authScreen').style.display = 'none'; let sName = activeUser.fullName ? activeUser.fullName : activeUser.username; document.getElementById('currentUserDisplay').innerHTML = `<span>👤</span> ${sName}`; const posSeller = document.getElementById('posCurrentSellerDisplay'); if(posSeller) posSeller.innerText = sName; let roleIcon = activeUser.role === 'admin' ? '👑 Admin' : (activeUser.role === 'sales' ? '🛒 Sales' : '📦 Warehouse'); document.getElementById('sidebarUserRoleDisplay').innerText = roleIcon; currentRole = activeUser.role; window.applyPermissions(); }
};

window.handleLogin = function() {
    const u = document.getElementById('loginUsername').value.trim(); const p = document.getElementById('loginPassword').value.trim(); const foundUser = userAccounts.find(x => String(x.username).toLowerCase() === u.toLowerCase() && String(x.password) === p);
    if (foundUser) { activeUser = foundUser; currentRole = foundUser.role; localStorage.setItem(getBranchKey('active_user_obj'), JSON.stringify(activeUser)); document.getElementById('loginUsername').value = ''; document.getElementById('loginPassword').value = ''; window.checkAuthentication(); window.switchTab('pos', '🛒 ប្រព័ន្ធលក់ (Point of Sale)', document.getElementById('nav-pos')); window.ksMsg(`សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ, ${foundUser.fullName ? foundUser.fullName : foundUser.username}!`, "ចូលប្រព័ន្ធជោគជ័យ"); } 
    else window.ksMsg("ឈ្មោះ ឬ លេខកូដសម្ងាត់មិនត្រឹមត្រូវទេ!", "បរាជ័យ");
};

window.handleLogout = function() { window.ksMsg("តើអ្នកពិតជាចង់ចាកចេញពីប្រព័ន្ធមែនទេ?", "បញ្ជាក់ការចាកចេញ", true, () => { activeUser = null; localStorage.removeItem(getBranchKey('active_user_obj')); window.checkAuthentication(); }); };
window.toggleForgotPass = function(show) { document.getElementById('loginForm').style.display = show ? 'none' : 'block'; document.getElementById('forgotPassForm').style.display = show ? 'block' : 'none'; };
window.handleResetPassword = function() { const u = document.getElementById('resetUsername').value.trim(); const pin = document.getElementById('resetPin').value.trim(); const newP = document.getElementById('newResetPassword').value.trim(); const userIndex = userAccounts.findIndex(x => String(x.username).toLowerCase() === u.toLowerCase()); if (userIndex !== -1 && String(userAccounts[userIndex].pin) === pin) { if (!newP) return window.ksMsg("សូមបញ្ចូលលេខកូដថ្មី!"); userAccounts[userIndex].password = newP; localStorage.setItem(getBranchKey('auth_users_pro'), JSON.stringify(userAccounts)); window.ksMsg("លេខកូដសម្ងាត់ត្រូវបានប្តូរជោគជ័យ! សូមចូលប្រព័ន្ធម្តងទៀត។", "ជោគជ័យ"); window.toggleForgotPass(false); } else window.ksMsg("ឈ្មោះ ឬ លេខ PIN សម្ងាត់មិនត្រឹមត្រូវទេ!", "បរាជ័យ"); };
window.handleChangePassword = function() { const oldP = document.getElementById('chgOldPassword').value; const newP = document.getElementById('chgNewPassword').value; if (!oldP || !newP) return window.ksMsg("សូមបំពេញចន្លោះអោយបានត្រឹមត្រូវ!"); const userIndex = userAccounts.findIndex(x => x.username === activeUser.username); if (userIndex !== -1 && String(userAccounts[userIndex].password) === oldP) { userAccounts[userIndex].password = newP; localStorage.setItem(getBranchKey('auth_users_pro'), JSON.stringify(userAccounts)); document.getElementById('chgOldPassword').value = ''; document.getElementById('chgNewPassword').value = ''; window.ksMsg("លេខកូដសម្ងាត់របស់អ្នកត្រូវបានផ្លាស់ប្តូរជោគជ័យ!", "ជោគជ័យ"); } else window.ksMsg("លេខកូដចាស់មិនត្រឹមត្រូវទេ!", "បរាជ័យ"); };

window.renderUsersList = function() {
    if (!activeUser || activeUser.role !== 'admin') return; const tbody = document.getElementById('userListTableBody');
    tbody.innerHTML = userAccounts.map(u => { let badge = u.role === 'admin' ? '<span class="badge badge-admin">👑 Admin</span>' : (u.role === 'sales' ? '<span class="badge badge-sales">🛒 Sales</span>' : '<span class="badge badge-warehouse">📦 Warehouse</span>'); let deleteBtn = `<button class="btn-danger" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="window.deleteUserAccount('${u.id}')">🗑️ លុប</button>`; let editBtn = `<button class="btn-outline" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer; color:var(--warning);" onclick="window.editUserAccount('${u.id}')">✏️ កែប្រែ</button>`; if (u.username === 'admin') deleteBtn = `<span style="color:var(--text-muted); font-size:var(--fs-11);">មិនអាចលុប</span>`; return `<tr><td data-sort="${u.fullName||''}"><span style="font-weight:bold;">${u.fullName||'-'}</span></td><td data-sort="${u.username}"><span style="color:var(--primary);">${u.username}</span></td><td data-sort="${u.role}">${badge}</td><td data-sort="${u.pin||''}"><span style="background:rgba(128,128,128,0.1); padding:2px 5px; border-radius:4px; font-family:monospace; letter-spacing:2px;">${u.pin||'មិនមាន'}</span></td><td style="text-align: center;"><div style="display: inline-flex; gap: 5px; justify-content: center;">${editBtn} ${deleteBtn}</div></td></tr>`; }).join('');
    window.filterTable('mainUserTable');
};

window.openUserModal = function() { document.getElementById('editUserId').value = ''; document.getElementById('userModalTitle').innerText = '👤 បង្កើតគណនីបុគ្គលិកថ្មី'; document.getElementById('nuFullName').value = ''; document.getElementById('nuUsername').value = ''; document.getElementById('nuPassword').value = ''; document.getElementById('nuPin').value = ''; document.getElementById('nuRole').value = 'sales'; document.getElementById('adminConfirmPassword').value = ''; document.getElementById('nuUsername').disabled = false; document.getElementById('userManageModal').style.display = 'flex'; };
window.editUserAccount = function(id) { const u = userAccounts.find(x => x.id === id); if(!u) return; document.getElementById('editUserId').value = u.id; document.getElementById('userModalTitle').innerText = '✏️ កែប្រែគណនីបុគ្គលិក'; document.getElementById('nuFullName').value = u.fullName||''; document.getElementById('nuUsername').value = u.username; document.getElementById('nuPassword').value = u.password; document.getElementById('nuPin').value = u.pin||''; document.getElementById('nuRole').value = u.role; document.getElementById('adminConfirmPassword').value = ''; document.getElementById('nuUsername').disabled = (u.username === 'admin'); document.getElementById('userManageModal').style.display = 'flex'; };
window.closeUserModal = function() { document.getElementById('userManageModal').style.display = 'none'; };
window.saveNewUser = function() {
    const editId = document.getElementById('editUserId').value; const fname = document.getElementById('nuFullName').value.trim(); const uname = document.getElementById('nuUsername').value.trim(); const pass = document.getElementById('nuPassword').value.trim(); const pin = document.getElementById('nuPin').value.trim(); let role = document.getElementById('nuRole').value; const adminPass = document.getElementById('adminConfirmPassword').value; if (!uname || !pass || !role || !adminPass) return window.ksMsg('សូមបំពេញព័ត៌មានដែលចាំបាច់ និងបញ្ជាក់លេខកូដ Admin របស់អ្នក!'); const myAccount = userAccounts.find(x => x.username === activeUser.username); if (myAccount.password !== adminPass) return window.ksMsg('លេខកូដ Admin របស់អ្នកមិនត្រឹមត្រូវទេ! ប្រតិបត្តិការត្រូវបានបដិសេធ។', 'បរាជ័យ');
    if (editId) { const existingUser = userAccounts.find(x => x.id === editId); if(existingUser.username === 'admin' && role !== 'admin') return window.ksMsg('គណនី admin ដើម មិនអាចដកសិទ្ធិជា admin វិញបានទេ!', 'បម្រាម'); const conflict = userAccounts.find(x => String(x.username).toLowerCase() === uname.toLowerCase() && x.id !== editId); if(conflict) return window.ksMsg('ឈ្មោះ Login នេះមានអ្នកប្រើប្រាស់រួចហើយ សូមរើសឈ្មោះផ្សេង។', 'បរាជ័យ'); existingUser.fullName = fname; existingUser.username = uname; existingUser.password = pass; existingUser.pin = pin||'0000'; existingUser.role = role; if(existingUser.id === activeUser.id) { activeUser = existingUser; localStorage.setItem(getBranchKey('active_user_obj'), JSON.stringify(activeUser)); } window.ksMsg('គណនីត្រូវបានកែប្រែដោយជោគជ័យ!', 'ជោគជ័យ'); } 
    else { if (userAccounts.find(x => String(x.username).toLowerCase() === uname.toLowerCase())) return window.ksMsg('ឈ្មោះ Login នេះមានអ្នកប្រើប្រាស់រួចហើយ សូមរើសឈ្មោះផ្សេង។', 'បរាជ័យ'); userAccounts.push({ id: 'U_' + Date.now(), username: uname, password: pass, role: role, pin: pin||'0000', fullName: fname }); window.ksMsg(`គណនី ${uname} ត្រូវបានបង្កើតដោយជោគជ័យ!`, 'ជោគជ័យ'); }
    localStorage.setItem(getBranchKey('auth_users_pro'), JSON.stringify(userAccounts)); window.closeUserModal(); window.renderUsersList();
};
window.deleteUserAccount = function(id) { const u = userAccounts.find(x => x.id === id); if (!u) return; if (u.username === 'admin') return window.ksMsg("មិនអាចលុបគណនី Admin ដើមបានទេ!"); if (u.id === activeUser.id) return window.ksMsg("មិនអាចលុបគណនីកំពុងប្រើប្រាស់បានទេ!"); window.ksMsg(`តើអ្នកពិតជាចង់លុបគណនីបុគ្គលិកឈ្មោះ "${u.fullName||u.username}" មែនទេ?`, "បញ្ជាក់ការលុបគណនី", true, () => { userAccounts = userAccounts.filter(x => x.id !== id); localStorage.setItem(getBranchKey('auth_users_pro'), JSON.stringify(userAccounts)); window.renderUsersList(); window.ksMsg("គណនីត្រូវបានលុបដោយជោគជ័យ!"); }); };

// ==========================================================================
// 5. GLOBAL APP VARIABLES & SUPABASE SYNC FUNCTIONS
// ==========================================================================
let inventory = []; let historyLog = []; let invoices = []; let cart = []; let customers = []; let expenses = [];
let shopName = 'SKM INTEGRATE'; let shopLogo = ''; let shopQR = ''; let shopPhone = ''; let shopAddress = ''; 
let sysSettings = { cust: true, unpaid: true, logs: true, cost: true, discount: true, showSeller: true, tax: false, taxRate: 10 };
let editingInvoice = null; let originalInvoiceState = null; let viewingInvoiceId = null; let currentInventoryView = 'grid'; let currentPOSView = 'grid'; window.currentPosCategory = 'all';
window.cartFinalUsd = 0; window.cartFinalRiel = 0; window.cartRate = 4000;
const SECRET_SALT = "KOUSUKE_ERP_PRO_V1_";

window.fDate = () => { const d = new Date(); return d.toLocaleDateString('km-KH') + ' ' + d.toLocaleTimeString('km-KH'); }; window.fMoney = (num) => '$' + parseFloat(num || 0).toFixed(2);
window.playBeep = function() { try { const AudioContext = window.AudioContext || window.webkitAudioContext; if(!AudioContext) return; const ctx = new AudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sine'; osc.frequency.setValueAtTime(850, ctx.currentTime); gain.gain.setValueAtTime(0.05, ctx.currentTime); osc.start(); osc.stop(ctx.currentTime + 0.1); } catch(e) {} };

window.ksMsg = function(text, title = 'ជូនដំណឹង', isConfirm = false, onConfirm = null) {
    document.getElementById('ksMsgTitle').innerText = title; document.getElementById('ksMsgText').innerText = text; const actionContainer = document.getElementById('ksMsgActions'); actionContainer.innerHTML = '';
    const closeBtn = document.createElement('button'); closeBtn.className = 'btn btn-outline'; closeBtn.innerText = isConfirm ? 'បោះបង់' : 'យល់ព្រម'; closeBtn.onclick = () => document.getElementById('ksMsgBox').style.display = 'none'; actionContainer.appendChild(closeBtn);
    if(isConfirm) { const okBtn = document.createElement('button'); okBtn.className = 'btn btn-primary'; okBtn.innerText = 'យល់ព្រម'; okBtn.onclick = () => { document.getElementById('ksMsgBox').style.display = 'none'; if(onConfirm) onConfirm(); }; actionContainer.appendChild(okBtn); } 
    document.getElementById('ksMsgBox').style.display = 'flex';
};

window.switchTab = function(tabId, title, elem) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active')); if(elem) elem.classList.add('active'); document.getElementById('pageTitle').innerText = title;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active')); document.getElementById('tab-' + tabId).classList.add('active');
    
    // បង្ហាញ Header ជាប់ជានិច្ច មិនបាច់លាក់
    const header = document.getElementById('topHeaderBar');
    if(header) header.classList.remove('hidden-header');

    if(window.innerWidth <= 768) { document.getElementById('appSidebar').classList.remove('active-mobile'); document.querySelector('.sidebar-overlay').classList.remove('active'); } 
    window.renderAll();
};

// ទាញយកទិន្នន័យពី Supabase (មានប្រព័ន្ធការពារទាញពី LocalStorage បើ Supabase គ្មានទិន្នន័យ)
window.loadDataFromSupabase = async function() {
    try {
        let { data, error } = await supabaseClient
            .from('branch_store')
            .select('data_json')
            .eq('branch_id', SHOP_BRANCH_ID)
            .single();

        if (data && data.data_json) {
            let d = data.data_json;
            inventory = d.inventory || [];
            historyLog = d.historyLog || [];
            invoices = d.invoices || [];
            expenses = d.expenses || [];
            customers = d.customers || [];
            shopName = d.shopName || 'SKM INTEGRATE';
            shopLogo = d.shopLogo || '';
            shopQR = d.shopQR || '';
            shopPhone = d.shopPhone || '';
            shopAddress = d.shopAddress || '';
            if(d.sysSettings) sysSettings = {...sysSettings, ...d.sysSettings};
            if(d.userAccounts) userAccounts = d.userAccounts;
        } else {
            let rawInv = JSON.parse(localStorage.getItem(getBranchKey('inv_pro')));
            if (rawInv && Array.isArray(rawInv) && rawInv.length > 0) {
                inventory = rawInv.filter(item => item !== null && typeof item === 'object');
                historyLog = JSON.parse(localStorage.getItem(getBranchKey('hist_pro'))) || []; 
                invoices = JSON.parse(localStorage.getItem(getBranchKey('invoices_pro'))) || []; 
                expenses = JSON.parse(localStorage.getItem(getBranchKey('expenses_pro'))) || [];
                shopName = localStorage.getItem(getBranchKey('shop_name')) || 'SKM INTEGRATE'; 
                shopLogo = localStorage.getItem(getBranchKey('shop_logo')) || ''; 
                shopQR = localStorage.getItem(getBranchKey('shop_qr')) || ''; 
                customers = JSON.parse(localStorage.getItem(getBranchKey('customers_pro'))) || []; 
                shopPhone = localStorage.getItem(getBranchKey('shop_phone')) || ''; 
                shopAddress = localStorage.getItem(getBranchKey('shop_address')) || '';
                
                await window.saveData();
            }
        }
    } catch(e) {
        console.error("Error loading from Supabase, fallback to localStorage:", e);
        let rawInv = JSON.parse(localStorage.getItem(getBranchKey('inv_pro')));
        inventory = (!rawInv || !Array.isArray(rawInv)) ? [] : rawInv.filter(item => item !== null && typeof item === 'object');
        historyLog = JSON.parse(localStorage.getItem(getBranchKey('hist_pro'))) || []; 
        invoices = JSON.parse(localStorage.getItem(getBranchKey('invoices_pro'))) || []; 
        expenses = JSON.parse(localStorage.getItem(getBranchKey('expenses_pro'))) || [];
        shopName = localStorage.getItem(getBranchKey('shop_name')) || 'SKM INTEGRATE'; 
        shopLogo = localStorage.getItem(getBranchKey('shop_logo')) || ''; 
        shopQR = localStorage.getItem(getBranchKey('shop_qr')) || ''; 
        customers = JSON.parse(localStorage.getItem(getBranchKey('customers_pro'))) || []; 
        shopPhone = localStorage.getItem(getBranchKey('shop_phone')) || ''; 
        shopAddress = localStorage.getItem(getBranchKey('shop_address')) || '';
    }
};

window.onload = async () => {
    window.loadThemeSettings(); window.checkLicense(); window.checkAuthentication(); setInterval(() => document.getElementById('currentDate').innerText = window.fDate(), 1000);
    
    // ទាញទិន្នន័យពី Supabase
    await window.loadDataFromSupabase();

    try { 
        currentInventoryView = localStorage.getItem(getBranchKey('inv_view_mode')) || 'grid'; 
        currentPOSView = localStorage.getItem(getBranchKey('pos_view_mode')) || 'grid'; 
    } catch(e) {}
    
    document.getElementById('displayShopName').innerHTML = `${shopName} <i id="editShopIcon" style="font-size:var(--fs-12); color:var(--text-muted); font-style: normal;">✏️</i>`; 
    if(shopLogo) { document.getElementById('sidebarLogo').src = shopLogo; document.getElementById('sidebarLogo').style.display = 'block'; } 
    
    window.loadSettingsToUI(); window.applyPermissions(); window.updateCategories(); window.setInventoryView(currentInventoryView, true); window.setPOSView(currentPOSView, true); window.renderAll();
    
    // បង្ហាញ Header ជាប់ជានិច្ច មិនលាក់ខ្លួនពេលអូស (Scroll)
    const header = document.getElementById('topHeaderBar');
    if (header) {
        header.classList.remove('hidden-header');
    }
};

window.saveData = async function() {
    inventory = inventory.filter(item => item !== null && typeof item === 'object');
    
    let packageData = {
        inventory, historyLog, invoices, expenses,
        shopName, shopLogo, shopQR, customers, sysSettings, userAccounts,
        shopPhone, shopAddress
    };

    // 1. រក្សាទុកក្នុង LocalStorage ជា Backup
    localStorage.setItem(getBranchKey('inv_pro'), JSON.stringify(inventory));
    localStorage.setItem(getBranchKey('hist_pro'), JSON.stringify(historyLog));
    localStorage.setItem(getBranchKey('invoices_pro'), JSON.stringify(invoices));
    localStorage.setItem(getBranchKey('expenses_pro'), JSON.stringify(expenses));
    localStorage.setItem(getBranchKey('shop_name'), shopName);
    localStorage.setItem(getBranchKey('shop_logo'), shopLogo);
    localStorage.setItem(getBranchKey('shop_qr'), shopQR);
    localStorage.setItem(getBranchKey('customers_pro'), JSON.stringify(customers));
    localStorage.setItem(getBranchKey('sys_settings'), JSON.stringify(sysSettings));
    localStorage.setItem(getBranchKey('shop_phone'), shopPhone);
    localStorage.setItem(getBranchKey('shop_address'), shopAddress);

    // 2. រក្សាទុកឡើងទៅ Supabase Database
    try {
        await supabaseClient
            .from('branch_store')
            .upsert({ 
                branch_id: SHOP_BRANCH_ID, 
                data_json: packageData,
                updated_at: new Date()
            }, { onConflict: 'branch_id' });
    } catch(e) {
        console.error("Error saving to Supabase:", e);
    }

    window.updateCategories(); 
    window.applyPermissions(); 
    window.renderAll();
};

// ==========================================================================
// 6. LOGGING & PERMISSIONS
// ==========================================================================
window.logAction = function(type, itemName, qty, note) { if(!sysSettings.logs) return; let executor = activeUser ? (activeUser.fullName ? activeUser.fullName : activeUser.username) : 'system'; historyLog.unshift({ id: Date.now(), date: window.fDate(), type, itemName, qty, note: `${note} (${executor})` }); if(historyLog.length > 500) historyLog.pop(); };

window.applyPermissions = function() {
    let sDash=true, sInv=true, sPOS=true, sCust=sysSettings.cust, sUnpaid=sysSettings.unpaid, sHist=sysSettings.logs, sSet=true, sAbout=true;
    if(currentRole === 'sales') { sInv = false; sHist = false; sSet = false; sAbout = false; } else if (currentRole === 'warehouse') { sPOS = false; sCust = false; sUnpaid = false; sSet = false; sAbout = false; sHist = false; }
    
    document.getElementById('nav-dashboard').style.display = sDash ? 'flex' : 'none'; document.getElementById('nav-inventory').style.display = sInv ? 'flex' : 'none'; document.getElementById('nav-pos').style.display = sPOS ? 'flex' : 'none'; document.getElementById('nav-customers').style.display = sCust ? 'flex' : 'none'; document.getElementById('nav-unpaid').style.display = sUnpaid ? 'flex' : 'none'; document.getElementById('nav-expenses').style.display = sUnpaid ? 'flex' : 'none'; document.getElementById('nav-history').style.display = sHist ? 'flex' : 'none'; document.getElementById('nav-settings').style.display = sSet ? 'flex' : 'none'; document.getElementById('nav-about').style.display = sAbout ? 'flex' : 'none';
    if(document.getElementById('grid-btn-pos')) document.getElementById('grid-btn-pos').style.display = sPOS ? 'flex' : 'none'; if(document.getElementById('grid-btn-inv')) document.getElementById('grid-btn-inv').style.display = sInv ? 'flex' : 'none'; if(document.getElementById('grid-btn-unpaid')) document.getElementById('grid-btn-unpaid').style.display = sUnpaid ? 'flex' : 'none'; if(document.getElementById('grid-btn-exp')) document.getElementById('grid-btn-exp').style.display = sUnpaid ? 'flex' : 'none'; if(document.getElementById('grid-btn-cust')) document.getElementById('grid-btn-cust').style.display = sCust ? 'flex' : 'none'; if(document.getElementById('grid-btn-hist')) document.getElementById('grid-btn-hist').style.display = sHist ? 'flex' : 'none';
    const editIcon = document.getElementById('editShopIcon'); if(editIcon) editIcon.style.display = currentRole === 'admin' ? 'inline' : 'none';
    const showCost = sysSettings.cost && currentRole === 'admin'; if(document.getElementById('costPriceContainer')) document.getElementById('costPriceContainer').style.display = showCost ? 'block' : 'none'; document.querySelectorAll('.p-cost').forEach(el => el.style.display = showCost ? 'inline' : 'none');
    if(document.getElementById('posDiscountContainer')) document.getElementById('posDiscountContainer').style.display = sysSettings.discount ? 'flex' : 'none';
    if(document.getElementById('posTaxContainer')) { document.getElementById('posTaxContainer').style.display = sysSettings.tax ? 'flex' : 'none'; if(document.getElementById('cartTaxRateDisplay')) document.getElementById('cartTaxRateDisplay').innerText = sysSettings.taxRate ? sysSettings.taxRate : 0; }
    if(document.getElementById('posSellerRowContainer')) document.getElementById('posSellerRowContainer').style.display = sysSettings.showSeller !== false ? 'flex' : 'none'; if(document.getElementById('posCustomerInputContainer')) document.getElementById('posCustomerInputContainer').style.display = sysSettings.cust ? 'block' : 'none'; if(document.getElementById('btnCheckoutUnpaid')) document.getElementById('btnCheckoutUnpaid').style.display = sysSettings.unpaid ? 'block' : 'none'; if(document.getElementById('btnAddNewProduct')) document.getElementById('btnAddNewProduct').style.display = currentRole === 'admin' ? 'block' : 'none'; if(document.getElementById('inventoryExcelAction')) document.getElementById('inventoryExcelAction').style.display = currentRole === 'admin' ? 'flex' : 'none'; if(document.getElementById('adminUserManagementBlock')) document.getElementById('adminUserManagementBlock').style.display = currentRole === 'admin' ? 'block' : 'none';
    if (currentRole === 'admin') window.renderUsersList(); window.renderUnpaid(); window.renderExpenses();
};

window.loadSettingsToUI = function() { document.getElementById('setCust').checked = sysSettings.cust; document.getElementById('setUnpaid').checked = sysSettings.unpaid; document.getElementById('setLogs').checked = sysSettings.logs; document.getElementById('setCost').checked = sysSettings.cost; document.getElementById('setDiscount').checked = sysSettings.discount; if(document.getElementById('setShowSeller')) document.getElementById('setShowSeller').checked = sysSettings.showSeller !== false; if(document.getElementById('setTax')) document.getElementById('setTax').checked = sysSettings.tax; if(document.getElementById('setTaxRate')) document.getElementById('setTaxRate').value = sysSettings.taxRate ? sysSettings.taxRate : 10; };
window.saveSysSettings = function() { if(currentRole !== 'admin') return window.ksMsg("គ្មានសិទ្ធិកែប្រែការកំណត់ទេ!", "សិទ្ធិមិនគ្រប់គ្រាន់"); sysSettings.cust = document.getElementById('setCust').checked; sysSettings.unpaid = document.getElementById('setUnpaid').checked; sysSettings.logs = document.getElementById('setLogs').checked; sysSettings.cost = document.getElementById('setCost').checked; sysSettings.discount = document.getElementById('setDiscount').checked; if(document.getElementById('setShowSeller')) sysSettings.showSeller = document.getElementById('setShowSeller').checked; if(document.getElementById('setTax')) sysSettings.tax = document.getElementById('setTax').checked; if(document.getElementById('setTaxRate')) sysSettings.taxRate = parseFloat(document.getElementById('setTaxRate').value) || 0; window.saveData(); window.ksMsg("ការកំណត់ត្រូវបានរក្សាទុក!", "ជោគជ័យ"); };
window.toggleDesktopSidebar = function() { const sidebar = document.getElementById('appSidebar'); if(window.innerWidth > 768) { sidebar.classList.toggle('collapsed'); } else { sidebar.classList.toggle('active-mobile'); document.querySelector('.sidebar-overlay').classList.toggle('active'); } };
window.checkLicense = function() { const savedKey = localStorage.getItem(getBranchKey('license_key')); let isValid = false; if(savedKey) { try { const decoded = atob(savedKey); if(decoded.startsWith(SECRET_SALT)) { const expiry = parseInt(decoded.replace(SECRET_SALT, '')); if(expiry > Date.now()) isValid = true; } } catch(e) {} } const lockScreen = document.getElementById('licenseLockScreen'); const sidebar = document.getElementById('appSidebar'); if(!isValid) { lockScreen.style.display = 'flex'; sidebar.style.pointerEvents = 'none'; } else { lockScreen.style.display = 'none'; sidebar.style.pointerEvents = 'auto'; } };
window.verifyAndSaveLicense = function() { const inputKey = document.getElementById('licenseInputBox').value.trim(); if(!inputKey) return window.ksMsg('សូមបញ្ចូលលេខកូដ (License Key)!'); try { const decoded = atob(inputKey); if(decoded.startsWith(SECRET_SALT)) { const expiry = parseInt(decoded.replace(SECRET_SALT, '')); if(expiry > Date.now()) { localStorage.setItem(getBranchKey('license_key'), inputKey); window.ksMsg('✅ សិទ្ធិប្រើប្រាស់ត្រូវបានបើកដោយជោគជ័យ!', 'ជោគជ័យ', false, () => { location.reload(); }); return; } else return window.ksMsg('❌ លេខកូដនេះបានផុតកំណត់បាត់ទៅហើយ!', 'បរាជ័យ'); } } catch(e) {} window.ksMsg('❌ លេខកូដមិនត្រឹមត្រូវទេ!', 'បរាជ័យ'); };
window.verifyAndSaveLicenseFromAbout = function() { const inputKey = document.getElementById('aboutLicenseInput').value.trim(); if(!inputKey) return window.ksMsg('សូមបញ្ចូលលេខកូដ (License Key)!'); try { const decoded = atob(inputKey); if(decoded.startsWith(SECRET_SALT)) { const expiry = parseInt(decoded.replace(SECRET_SALT, '')); if(expiry > Date.now()) { localStorage.setItem(getBranchKey('license_key'), inputKey); window.ksMsg('✅ សិទ្ធិប្រើប្រាស់ត្រូវបានធ្វើបច្ចុប្បន្នភាពជោគជ័យ!', 'ជោគជ័យ', false, () => { location.reload(); }); return; } else return window.ksMsg('❌ លេខកូដនេះបានផុតកំណត់បាត់ទៅហើយ!', 'បរាជ័យ'); } } catch(e) {} window.ksMsg('❌ លេខកូដមិនត្រឹមត្រូវទេ!', 'បរាជ័យ'); };
window.displayLicenseInfo = function() { const savedKey = localStorage.getItem(getBranchKey('license_key')); const infoDisplay = document.getElementById('licenseInfoDisplay'); if(!infoDisplay) return; if(!savedKey) { infoDisplay.innerHTML = '<span style="color: var(--danger);">មិនទាន់បានបញ្ចូលកូដទេ</span>'; return; } try { const decoded = atob(savedKey); if(decoded.startsWith(SECRET_SALT)) { const expiry = parseInt(decoded.replace(SECRET_SALT, '')); const expireDate = new Date(expiry); const diffDays = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24)); let statusHtml = ''; if(diffDays > 10) statusHtml = `<span style="color: var(--success); font-weight: bold; background: rgba(16, 185, 129, 0.1); padding: 5px 10px; border-radius: 6px;">✅ ដំណើរការធម្មតា (សល់ ${diffDays} ថ្ងៃ)</span>`; else if (diffDays > 0) statusHtml = `<span style="color: var(--warning); font-weight: bold; background: rgba(245, 158, 11, 0.1); padding: 5px 10px; border-radius: 6px;">⚠️ ជិតផុតកំណត់ (សល់ ${diffDays} ថ្ងៃ)</span>`; else statusHtml = `<span style="color: var(--danger); font-weight: bold; background: rgba(225, 29, 72, 0.1); padding: 5px 10px; border-radius: 6px;">❌ ផុតកំណត់ហើយ!</span>`; infoDisplay.innerHTML = `<div style="margin-bottom: 10px;"><strong>ស្ថានភាព៖</strong> ${statusHtml}</div><div><strong>ថ្ងៃផុតកំណត់៖</strong> <span style="color: var(--text-main); font-weight: bold;">${expireDate.toLocaleDateString('km-KH')} ម៉ោង ${expireDate.toLocaleTimeString('km-KH')}</span></div>`; return; } } catch(e) {} infoDisplay.innerHTML = '<span style="color: var(--danger);">លេខកូដមិនត្រឹមត្រូវទេ</span>'; };

window.openShopNameModal = function() { 
    if(currentRole !== 'admin') return window.ksMsg('មានតែគណនី Admin ប៉ុណ្ណោះដែលអាចប្តូរឈ្មោះ និង Logo បានកំរិតខ្ពស់!', 'គ្មានសិទ្ធិ'); 
    document.getElementById('newShopNameInput').value = shopName; document.getElementById('newShopPhoneInput').value = shopPhone; document.getElementById('newShopAddressInput').value = shopAddress; 
    const preview = document.getElementById('shopLogoPreview'); if(shopLogo) { preview.src = shopLogo; preview.style.display = 'block'; } else preview.style.display = 'none'; 
    const qrPreview = document.getElementById('shopQRPreview'); if(shopQR) { qrPreview.src = shopQR; qrPreview.style.display = 'block'; } else qrPreview.style.display = 'none'; 
    document.getElementById('shopNameModal').style.display = 'flex'; 
};
window.closeShopNameModal = function() { document.getElementById('shopNameModal').style.display = 'none'; };
window.handleShopLogo = function(e) { const file = e.target.files[0]; if(!file) return; const reader = new FileReader(); reader.onload = (e) => { const img = new Image(); img.onload = () => { const canvas = document.createElement('canvas'); const max = 200; let w = img.width, h = img.height; if(w>h) { if(w>max) { h*=max/w; w=max; } } else { if(h>max) { w*=max/h; h=max; } } canvas.width=w; canvas.height=h; canvas.getContext('2d').drawImage(img,0,0,w,h); shopLogo = canvas.toDataURL('image/jpeg', 0.8); document.getElementById('shopLogoPreview').src = shopLogo; document.getElementById('shopLogoPreview').style.display = 'block'; }; img.src = e.target.result; }; reader.readAsDataURL(file); };
window.handleShopQR = function(e) { const file = e.target.files[0]; if(!file) return; const reader = new FileReader(); reader.onload = (e) => { const img = new Image(); img.onload = () => { const canvas = document.createElement('canvas'); const max = 300; let w = img.width, h = img.height; if(w>h) { if(w>max) { h*=max/w; w=max; } } else { if(h>max) { w*=max/h; h=max; } } canvas.width=w; canvas.height=h; canvas.getContext('2d').drawImage(img,0,0,w,h); shopQR = canvas.toDataURL('image/jpeg', 0.8); document.getElementById('shopQRPreview').src = shopQR; document.getElementById('shopQRPreview').style.display = 'block'; }; img.src = e.target.result; }; reader.readAsDataURL(file); };
window.saveShopName = function() { const newName = document.getElementById('newShopNameInput').value.trim(); shopPhone = document.getElementById('newShopPhoneInput').value.trim(); shopAddress = document.getElementById('newShopAddressInput').value.trim(); if(newName !== "") { shopName = newName; document.getElementById('displayShopName').innerHTML = `${shopName} <i id="editShopIcon" style="font-size:var(--fs-12); color:var(--text-muted); font-style: normal;">✏️</i>`; if(shopLogo) { document.getElementById('sidebarLogo').src = shopLogo; document.getElementById('sidebarLogo').style.display = 'block'; } window.saveData(); window.closeShopNameModal(); window.ksMsg("ព័ត៌មានហាងត្រូវបានរក្សាទុកដោយជោគជ័យ!", "ជោគជ័យ"); } else window.ksMsg("សូមបញ្ចូលឈ្មោះហាងសិន!"); };

// ==========================================================================
// 7. RENDER FUNCTIONS (DASHBOARD, INVENTORY, POS, ETC.)
// ==========================================================================
window.renderAll = function() { window.renderDashboard(); window.renderInventory(); window.renderPOSProducts(); window.renderUnpaid(); window.renderExpenses(); window.renderHistory(); window.renderCustomers(); window.updateCustomerDatalist(); window.populateEditInvoiceSelect(); window.displayLicenseInfo(); };
window.resetDashboardDate = function() { document.getElementById('dashDateFrom').value = ''; document.getElementById('dashDateTo').value = ''; window.renderDashboard(); };

window.renderDashboard = function() {
    try {
        let tItems = inventory.length; let tQty = 0, estRev = 0, lowItems = []; 
        inventory.forEach(p => { 
            if(!p) return; let q = parseInt(p.qty) || 0; tQty += q; let priceVal = parseFloat(p.price) || 0; estRev += (priceVal * q); 
            if(q <= 5) lowItems.push(p); 
        });
        const dateFrom = document.getElementById('dashDateFrom'); const dateTo = document.getElementById('dashDateTo'); 
        const fromTime = (dateFrom && dateFrom.value) ? new Date(dateFrom.value).setHours(0,0,0,0) : 0; 
        const toTime = (dateTo && dateTo.value) ? new Date(dateTo.value).setHours(23,59,59,999) : Infinity;
        let totalSalesRevenue = 0, totalUnpaid = 0, totalExpenses = 0, totalCOGS = 0, salesMap = {};
        
        invoices.forEach(inv => { 
            let invTime = inv.timestamp || parseInt(String(inv.id).split('_')[1]) || 0; 
            if (invTime >= fromTime && invTime <= toTime) { 
                if(inv.status === 'paid') totalSalesRevenue += (parseFloat(inv.totalAmount) || 0); 
                if(inv.status === 'unpaid') { let invPaid = parseFloat(inv.paidUsd) || 0; let remaining = (parseFloat(inv.totalAmount) || 0) - invPaid; if(remaining > 0) totalUnpaid += remaining; totalSalesRevenue += invPaid; }
                if(inv.items) inv.items.forEach(item => { 
                    if(!item) return; let pId = item.id ? String(item.id) : 'unknown';
                    if(!salesMap[pId]) salesMap[pId] = { name: item.name, qty: 0, revenue: 0 }; 
                    let qty = parseInt(item.cartQty) || 0; let price = parseFloat(item.price) || 0; let cost = parseFloat(item.cost) || 0;
                    salesMap[pId].qty += qty; salesMap[pId].revenue += (price * qty); totalCOGS += (cost * qty);
                }); 
            } 
        });
        expenses.forEach(exp => { let expTime = exp.timestamp || 0; if(expTime >= fromTime && expTime <= toTime) totalExpenses += (parseFloat(exp.amount) || 0); });

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
        
        let topSellers = Object.values(salesMap).sort((a, b) => b.qty - a.qty).slice(0, 5); 
        const topBody = document.getElementById('topSellingTable');
        if (topBody) { topBody.innerHTML = topSellers.length === 0 ? '<tr><td colspan="4" style="text-align:center;">មិនទាន់មានទិន្នន័យលក់ទេ</td></tr>' : topSellers.map((item, index) => `<tr><td style="font-weight:bold; color:var(--primary);">${index === 0 ? '🥇 លេខ ១' : index === 1 ? '🥈 លេខ ២' : index === 2 ? '🥉 លេខ ៣' : 'លេខ ' + (index + 1)}</td><td>${item.name}</td><td style="font-weight:bold;">${item.qty}</td><td style="color:var(--success); font-weight:bold;">${window.fMoney(item.revenue)}</td></tr>`).join(''); }
    } catch(e) { console.error("Dashboard Error:", e); }
};

window.setPosCategory = function(cat) { window.currentPosCategory = cat; window.updateCategories(); window.renderPOSProducts(); };
window.updateCategories = function() {
    const cats = [...new Set(inventory.filter(p => p && p.category).map(p => p.category))];
    const filter = document.getElementById('filterCategory'); if(filter) filter.innerHTML = '<option value="all">គ្រប់ប្រភេទ</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
    document.getElementById('catList').innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
    const posTabs = document.getElementById('posCategoryTabs');
    if(posTabs) { let activeCat = window.currentPosCategory ? window.currentPosCategory : 'all'; let tabsHtml = `<button class="pos-tab ${activeCat === 'all' ? 'active' : ''}" onclick="window.setPosCategory('all')">ទាំងអស់ (All)</button>`; cats.forEach(c => { tabsHtml += `<button class="pos-tab ${activeCat === c ? 'active' : ''}" onclick="window.setPosCategory('${c}')">${c}</button>`; }); posTabs.innerHTML = tabsHtml; }
};

window.setInventoryView = function(mode, skipRender = false) { currentInventoryView = mode; localStorage.setItem(getBranchKey('inv_view_mode'), mode); const btnGrid = document.getElementById('btnGridView'); const btnList = document.getElementById('btnListView'); if (mode === 'grid') { btnGrid.style.background = 'var(--primary)'; btnGrid.style.color = '#fff'; btnList.style.background = 'transparent'; btnList.style.color = 'var(--text-main)'; } else { btnList.style.background = 'var(--primary)'; btnList.style.color = '#fff'; btnGrid.style.background = 'transparent'; btnGrid.style.color = 'var(--text-main)'; } if (!skipRender) window.renderInventory(); };

window.renderInventory = function() {
    const container = document.getElementById('productGridContainer'); if(!container) return;
    try {
        const searchInputEl = document.getElementById('searchInput'); const search = searchInputEl ? searchInputEl.value.toLowerCase() : ''; 
        const filterCatEl = document.getElementById('filterCategory'); const cat = filterCatEl ? filterCatEl.value : 'all'; 
        let filterStatusEl = document.getElementById('filterStatus'); const status = filterStatusEl ? filterStatusEl.value : 'all'; 
        let sortInventoryEl = document.getElementById('sortInventory'); const sort = sortInventoryEl ? sortInventoryEl.value : 'newest';
        
        let oldFilters = []; let activeFilterIndex = -1;
        if (currentInventoryView === 'list' && document.getElementById('mainInventoryTable')) { document.querySelectorAll('#mainInventoryTable thead .col-filter').forEach((inp, idx) => { oldFilters.push(inp.value); if (document.activeElement === inp) activeFilterIndex = idx; }); }
        
        let filtered = inventory.filter(p => {
            if(!p) return false;
            return (p.name?String(p.name).toLowerCase():'').includes(search) || (p.customId?String(p.customId).toLowerCase():'').includes(search) || (p.desc?String(p.desc).toLowerCase():'').includes(search) || (p.id?String(p.id).toLowerCase():'').includes(search);
        });
        
        if(cat !== 'all') filtered = filtered.filter(p => p && p.category === cat); 
        if(status === 'in_stock') filtered = filtered.filter(p => p && parseFloat(p.qty) > 0); 
        else if(status === 'out_stock') filtered = filtered.filter(p => p && parseFloat(p.qty) <= 0);
        
        if(sort === 'qty_asc') filtered.sort((a,b) => { if(!a) return 1; if(!b) return -1; return (parseFloat(a.qty)||0) - (parseFloat(b.qty)||0); }); 
        else if(sort === 'qty_desc') filtered.sort((a,b) => { if(!a) return 1; if(!b) return -1; return (parseFloat(b.qty)||0) - (parseFloat(a.qty)||0); }); 
        else filtered.sort((a,b) => { if(!a) return 1; if(!b) return -1; return String(b.id || '').localeCompare(String(a.id || '')); });
        
        if (filtered.length === 0) { container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted); background:var(--bg-card); border-radius:12px; border:1px solid var(--border);">មិនមានទិន្នន័យ</div>'; return; }
        const showCost = sysSettings.cost && currentRole === 'admin'; let enableEdit = currentRole === 'admin' ? true : false;
        
        if (currentInventoryView === 'grid') {
            let finalHtml = `<div class="product-grid">`;
            filtered.forEach(p => {
                if(!p) return;
                let pQty = parseFloat(p.qty) || 0; let sCol = pQty <= 0 ? 'var(--danger)' : (pQty <= 5 ? 'var(--warning)' : 'var(--success)'); 
                let img = p.image ? p.image : 'https://placehold.co/400x300/1e293b/475569?text=No+Image'; 
                let actionBtns = enableEdit ? `<div class="card-actions"><button class="btn btn-outline" onclick="window.editProduct('${p.id}')">✏️ កែប្រែ</button><button class="btn btn-danger" onclick="window.deleteProduct('${p.id}')">🗑️</button></div>` : ''; 
                let pRiel = parseFloat(p.riel) || 0; let rielStr = pRiel > 0 ? `<span style="font-size:var(--fs-11); color:var(--text-muted);">| ${pRiel.toLocaleString()} ៛</span>` : '';
                finalHtml += `<div class="product-card"><div class="media-container">${p.category?`<div class="badge-cat">${p.category}</div>`:''}<img src="${img}" alt="Product"></div><div class="product-info"><div class="p-title">${p.name}</div><div style="font-size: var(--fs-11); color: var(--primary); margin-bottom: 4px; font-family: monospace;">Barcode: ${p.customId||p.id}</div><div style="font-size: var(--fs-12); color: var(--text-muted); margin-bottom: 8px; line-height: 1.3; flex-grow: 1;">${p.desc||'មិនមានការពណ៌នា'}</div><div class="p-finances"><div style="display:${showCost ? 'block':'none'}">ដើម: <span class="p-cost">${window.fMoney(p.cost)}</span></div><div>លក់: <span class="p-price">${window.fMoney(p.price)} ${rielStr} <small style="color:var(--text-muted); font-size:var(--fs-11);">/ ${p.unit||'ឯកតា'}</small></span></div></div><div class="qty-control" style="border-color:${sCol}"><button class="qty-btn" onclick="window.updateQty('${p.id}', -1)">-</button><span class="qty-val" style="color:${sCol}">${pQty} <small style="font-size:var(--fs-11);">${p.unit||'ឯកតា'}</small></span><button class="qty-btn" onclick="window.updateQty('${p.id}', 1)">+</button></div>${actionBtns}</div></div>`;
            });
            finalHtml += `</div>`; container.innerHTML = finalHtml;
        } else {
            let tableHTML = `<div class="table-responsive"><table id="mainInventoryTable"><thead><tr><th style="width: 60px;">រូបភាព</th><th onclick="window.sortTable('mainInventoryTable', 1)">ឈ្មោះទំនិញ / Barcode ↕️</th><th onclick="window.sortTable('mainInventoryTable', 2)">ប្រភេទ ↕️</th><th onclick="window.sortTable('mainInventoryTable', 3, 'number')">តម្លៃលក់ ↕️</th><th style="text-align:center;" onclick="window.sortTable('mainInventoryTable', 4, 'number')">ស្តុកនៅសល់ ↕️</th>${enableEdit ? '<th style="text-align:center;">សកម្មភាព</th>' : ''}</tr><tr class="filter-row"><th></th><th><input type="text" class="col-filter" onkeyup="window.filterTable('mainInventoryTable')" placeholder="ស្វែងរក..."></th><th><input type="text" class="col-filter" onkeyup="window.filterTable('mainInventoryTable')" placeholder="ស្វែងរក..."></th><th><input type="text" class="col-filter" onkeyup="window.filterTable('mainInventoryTable')" placeholder="ស្វែងរក..."></th><th><input type="text" class="col-filter" onkeyup="window.filterTable('mainInventoryTable')" placeholder="ស្វែងរក..."></th>${enableEdit ? '<th></th>' : ''}</tr></thead><tbody>`;
            filtered.forEach(p => { 
                if(!p) return;
                let pQty = parseFloat(p.qty) || 0; let sCol = pQty <= 0 ? 'var(--danger)' : (pQty <= 5 ? 'var(--warning)' : 'var(--success)'); 
                let img = p.image ? p.image : 'https://placehold.co/100x100/1e293b/475569?text=IMG'; 
                let actCol = enableEdit ? `<td style="text-align:center;"><div style="display: flex; gap: 5px; justify-content:center;"><button class="btn btn-outline" style="padding:6px 10px;" onclick="window.editProduct('${p.id}')">✏️</button><button class="btn-danger" style="border:none; padding:6px 10px; border-radius:6px; cursor:pointer;" onclick="window.deleteProduct('${p.id}')">🗑️</button></div></td>` : ''; 
                let pRiel = parseFloat(p.riel) || 0; let rielHtml = pRiel > 0 ? `<br><span style="font-size:var(--fs-11); color:var(--text-muted);">${pRiel.toLocaleString()} ៛</span>` : '';
                let safeName = p.name ? String(p.name).replace(/"/g, '&quot;') : '';
                tableHTML += `<tr data-id="${p.id}"><td><img src="${img}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border:1px solid var(--border);"></td><td data-sort="${safeName}"><div style="font-weight: bold; font-size:var(--fs-15); color:var(--text-main); margin-bottom: 2px;">${p.name}</div><div style="font-size:var(--fs-11); color:var(--primary); font-family:monospace;">Barcode: ${p.customId||p.id}</div></td><td data-sort="${p.category||'-'}"><span class="badge-cat" style="position:static; display:inline-block; font-size:var(--fs-11); padding:4px 8px;">${p.category||'-'}</span></td><td data-sort="${p.price}"><div class="p-price" style="font-size:var(--fs-15);">${window.fMoney(p.price)} ${rielHtml}</div><div class="p-cost" style="font-size:var(--fs-11); margin-top:2px; display:${showCost ? 'block':'none'}">ដើម: ${window.fMoney(p.cost)}</div></td><td data-sort="${pQty}" style="text-align:center;"><div class="qty-control" style="border-color:${sCol}; margin: 0 auto; padding: 2px 5px;"><button class="qty-btn" onclick="window.updateQty('${p.id}', -1)" style="width:20px; height:20px; font-size:var(--fs-16);">-</button><span class="qty-val" style="color:${sCol}; min-width:25px;">${pQty}</span><button class="qty-btn" onclick="window.updateQty('${p.id}', 1)" style="width:20px; height:20px; font-size:var(--fs-16);">+</button></div><div style="font-size:var(--fs-11); color:var(--text-muted); margin-top:3px;">${p.unit||'ឯកតា'}</div></td>${actCol}</tr>`; 
            });
            tableHTML += `</tbody></table></div>`; container.innerHTML = tableHTML;
            let newFilters = document.querySelectorAll('#mainInventoryTable thead .col-filter'); 
            newFilters.forEach((inp, idx) => { if(oldFilters[idx]) inp.value = oldFilters[idx]; if(idx === activeFilterIndex) setTimeout(() => inp.focus(), 10); }); setTimeout(() => window.filterTable('mainInventoryTable'), 50);
        }
    } catch(err) { container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--danger);">Error Inventory: ${err.message}</div>`; }
};

window.updateQty = function(id, change) { const item = inventory.find(p => p && p.id === id); if(item) { let old = parseInt(item.qty)||0; item.qty = Math.max(0, old + change); let diff = item.qty - old; if(diff !== 0) { window.logAction(diff > 0 ? 'add' : 'update', item.name, Math.abs(diff), diff > 0 ? 'បន្ថែមស្តុក' : 'ដកស្តុកចេញ'); window.saveData(); } } };
window.generateProductBarcode = function() { document.getElementById('pCustomId').value = 'SKM' + Math.floor(100000 + Math.random() * 900000); };
window.openProductModal = function() { 
    if(currentRole !== 'admin') return window.ksMsg('គ្មានសិទ្ធិ!'); 
    document.getElementById('pId').value = ''; document.getElementById('pName').value = ''; document.getElementById('pCategory').value = ''; document.getElementById('pCost').value = ''; document.getElementById('pPrice').value = ''; document.getElementById('pUnit').value = ''; document.getElementById('pQty').value = '0'; document.getElementById('pDesc').value = ''; document.getElementById('pImage').value = ''; 
    document.getElementById('pCustomId').value = 'SKM' + Math.floor(100000 + Math.random() * 900000);
    if(document.getElementById('pRiel')) document.getElementById('pRiel').value = ''; 
    window.updateImagePreview(''); document.getElementById('modalTitle').innerText = 'បន្ថែមទំនិញថ្មី'; document.getElementById('productModal').style.display = 'flex'; 
};
window.closeModal = function() { document.getElementById('productModal').style.display = 'none'; };
window.updateImagePreview = function(src) { const previewBox = document.getElementById('imagePreviewBox'); if (src && src.trim() !== '') { previewBox.src = src; previewBox.style.display = 'block'; } else { previewBox.src = ''; previewBox.style.display = 'none'; } };
window.handleImage = function(e) { const file = e.target.files[0]; if(!file) return; const reader = new FileReader(); reader.onload = (e) => { const img = new Image(); img.onload = () => { const canvas = document.createElement('canvas'); const max = 400; let w = img.width, h = img.height; if(w>h) { if(w>max) { h*=max/w; w=max; } } else { if(h>max) { w*=max/h; h=max; } } canvas.width=w; canvas.height=h; canvas.getContext('2d').drawImage(img,0,0,w,h); const compressedUrl = canvas.toDataURL('image/jpeg', 0.6); document.getElementById('pImage').value = compressedUrl; window.updateImagePreview(compressedUrl); }; img.src = e.target.result; }; reader.readAsDataURL(file); };

window.saveProduct = function() { 
    const id = document.getElementById('pId').value; const customIdInput = document.getElementById('pCustomId').value.trim();
    const data = { 
        id: id ? id : 'P_' + Date.now(), 
        customId: customIdInput ? customIdInput : ('SKM' + Math.floor(100000 + Math.random() * 900000)),
        name: document.getElementById('pName').value.trim(), category: document.getElementById('pCategory').value.trim(), 
        cost: parseFloat(document.getElementById('pCost').value) || 0, price: parseFloat(document.getElementById('pPrice').value) || 0, riel: parseFloat(document.getElementById('pRiel').value) || 0, 
        unit: document.getElementById('pUnit').value.trim(), qty: parseInt(document.getElementById('pQty').value) || 0, 
        desc: document.getElementById('pDesc').value, image: document.getElementById('pImage').value 
    }; 
    if(!data.name || (data.price <= 0 && data.riel <= 0)) return window.ksMsg("សូមបញ្ចូលឈ្មោះ និងតម្លៃលក់ (យ៉ាងហោចណាស់ ដុល្លារ ឬ រៀល)!"); 
    if(id) { const idx = inventory.findIndex(p => p && p.id === id); if(idx !== -1) inventory[idx] = data; window.logAction('update', data.name, 0, 'កែប្រែព័ត៌មាន'); } 
    else { inventory.push(data); window.logAction('add', data.name, data.qty, 'នាំចូលថ្មី'); } 
    window.closeModal(); window.saveData(); 
};
window.editProduct = function(id) { 
    if(currentRole !== 'admin') return window.ksMsg('គ្មានសិទ្ធិ!'); 
    const p = inventory.find(i => i && i.id === id); if(!p) return; 
    document.getElementById('pId').value = p.id; document.getElementById('pCustomId').value = p.customId||p.id; document.getElementById('pName').value = p.name; document.getElementById('pCategory').value = p.category||''; document.getElementById('pCost').value = p.cost; document.getElementById('pPrice').value = p.price||''; if(document.getElementById('pRiel')) document.getElementById('pRiel').value = p.riel||''; document.getElementById('pUnit').value = p.unit||''; document.getElementById('pQty').value = p.qty; document.getElementById('pDesc').value = p.desc||''; document.getElementById('pImage').value = p.image||''; window.updateImagePreview(p.image||''); 
    document.getElementById('modalTitle').innerText = 'កែប្រែទំនិញ'; document.getElementById('productModal').style.display = 'flex'; 
};
window.deleteProduct = function(id) { 
    if(currentRole !== 'admin') return window.ksMsg('គ្មានសិទ្ធិ!'); 
    const p = inventory.find(i => i && i.id === id); if(!p) return;
    window.ksMsg(`តើអ្នកពិតជាចង់លុប ${p.name} ចេញពីប្រព័ន្ធមែនទេ?`, "បញ្ជាក់ការលុប", true, () => { inventory = inventory.filter(i => i && i.id !== id); window.logAction('update', p.name, 0, 'លុបចេញពីប្រព័ន្ធ'); window.saveData(); }); 
};

window.setPOSView = function(mode, skipRender = false) {
    currentPOSView = mode; localStorage.setItem(getBranchKey('pos_view_mode'), mode); const btnGrid = document.getElementById('btnPOSGridView'); const btnList = document.getElementById('btnPOSListView');
    if (mode === 'grid') { btnGrid.style.background = 'var(--primary)'; btnGrid.style.color = '#fff'; btnList.style.background = 'transparent'; btnList.style.color = 'var(--text-main)'; } else { btnList.style.background = 'var(--primary)'; btnList.style.color = '#fff'; btnGrid.style.background = 'transparent'; btnGrid.style.color = 'var(--text-main)'; } if (!skipRender) window.renderPOSProducts();
};

window.renderPOSProducts = function() {
    const container = document.getElementById('posProductGridContainer'); if(!container) return;
    try {
        const searchInputEl = document.getElementById('posSearch'); const search = searchInputEl ? searchInputEl.value.toLowerCase() : ''; 
        const posCat = window.currentPosCategory ? window.currentPosCategory : 'all';
        let availableItems = inventory.filter(p => p !== null && typeof p === 'object');
        
        if (search) availableItems = availableItems.filter(p => {
            if(!p) return false;
            return (p.name?String(p.name).toLowerCase():'').includes(search) || (p.customId?String(p.customId).toLowerCase():'').includes(search) || (p.desc?String(p.desc).toLowerCase():'').includes(search) || (p.id?String(p.id).toLowerCase():'').includes(search);
        });
        if (posCat !== 'all') availableItems = availableItems.filter(p => p && p.category === posCat);

        availableItems.sort((a, b) => {
            let outA = (parseFloat(a.qty)||0) <= 0 ? 1 : 0; let outB = (parseFloat(b.qty)||0) <= 0 ? 1 : 0;
            if (outA !== outB) return outA - outB; 
            return String(b.id || '').localeCompare(String(a.id || '')); 
        });

        if (availableItems.length === 0) { container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 40px; background: rgba(0,0,0,0.05); border-radius: 8px;">មិនមានទំនិញទេ</div>'; return; }
        
        if (currentPOSView === 'grid') {
            let finalHtml = `<div class="pos-products">`;
            availableItems.forEach(p => { 
                if(!p) return;
                let pQty = parseFloat(p.qty) || 0; let stockBadge = '';
                if (pQty <= 0) stockBadge = `<div class="badge-cat" style="background: var(--danger); color: #fff; top: 8px; right: auto; left: 8px; padding: 3px 6px; font-size: 11px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); border-radius: 4px;">❌ អស់ស្តុក</div>`;
                else stockBadge = `<div class="badge-cat" style="background: ${pQty<=5?'var(--warning)':'var(--primary)'}; color: ${pQty<=5?'#000':'#fff'}; top: 8px; right: auto; left: 8px; padding: 3px 6px; font-size: 11px; border-radius: 4px;">📦 សល់: ${pQty}</div>`;

                let cItem = cart.find(c => c && c.id === p.id); let qtyInCart = cItem ? cItem.cartQty : 0;
                let btnHtml = qtyInCart > 0 ? `<div class="pos-add-btn added">${qtyInCart}</div>` : `<div class="pos-add-btn empty">+</div>`;
                let rielHtml = (parseFloat(p.riel)||0) > 0 ? `<span style="font-size:var(--fs-11); color:var(--text-muted); font-weight:normal;">| ${parseFloat(p.riel).toLocaleString()} ៛</span>` : '';
                let itemOpacity = pQty <= 0 ? 'opacity: 0.6; filter: grayscale(50%);' : '';
                
                finalHtml += `<div class="pos-item" style="${itemOpacity}" onclick="window.addToCart('${p.id}')"><div class="pos-item-img-container">${stockBadge}<img src="${p.image||'https://placehold.co/200?text=No+Img'}" alt="Product">${btnHtml}</div><div class="pos-item-details"><div class="pos-item-price">${window.fMoney(p.price)} ${rielHtml}</div><div class="pos-item-name" title="${p.name}">${p.name}</div></div></div>`; 
            });
            container.innerHTML = finalHtml + `</div>`;
        } else {
            let tableHTML = `<div class="table-responsive" style="margin-right: 10px; height: 100%;"><table style="font-size: var(--fs-13);"><tbody style="display:block; max-height:100%; overflow-y:auto; width:100%;">`;
            availableItems.forEach(p => {
                if(!p) return;
                let pQty = parseFloat(p.qty) || 0;
                let stockText = pQty <= 0 ? `<span style="color:var(--danger); font-weight:bold;">អស់ស្តុក</span>` : `<span style="color:${pQty<=5?'var(--warning)':'var(--success)'}">${pQty}</span> ${p.unit||''}`;
                let rielHtml = (parseFloat(p.riel)||0) > 0 ? `<br><span style="font-size:var(--fs-11); color:var(--text-muted);">${parseFloat(p.riel).toLocaleString()} ៛</span>` : '';
                let itemOpacity = pQty <= 0 ? 'opacity: 0.6;' : '';
                tableHTML += `<tr style="display:table; width:100%; table-layout:fixed; border-bottom: 1px solid var(--border); ${itemOpacity}"><td style="width: 60px; padding: 5px;"><img src="${p.image||'https://placehold.co/100?text=Img'}" style="width:45px; height:45px; object-fit:cover; border-radius:6px;"></td><td style="padding: 5px 10px;"><div style="font-weight:bold; color:var(--text-main); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name}</div><div style="font-size:var(--fs-11); color:var(--text-muted);">ស្តុក: ${stockText}</div></td><td style="width: 100px; text-align:right; font-weight:bold; color:var(--success); padding: 5px 10px;">${window.fMoney(p.price)}${rielHtml}</td><td style="width: 80px; text-align:center; padding: 5px;"><button class="btn btn-primary" style="padding: 6px 12px; font-size:var(--fs-12);" onclick="window.addToCart('${p.id}')">➕ បន្ថែម</button></td></tr>`;
            });
            container.innerHTML = tableHTML + `</tbody></table></div>`;
        }
    } catch(err) { container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--danger);">Error POS: ${err.message}</div>`; }
};

window.addToCart = function(id) { 
    window.playBeep(); const p = inventory.find(i => i && i.id === id); if (!p) return; const cItem = cart.find(c => c && c.id === id); let stockQty = parseInt(p.qty) || 0;
    if(cItem) { if(cItem.cartQty < stockQty) { cItem.cartQty++; } else { window.ksMsg(`ស្តុកមានត្រឹមតែ ${stockQty} ${p.unit||'ឯកតា'} ប៉ុណ្ណោះ!`); } } else { if(stockQty > 0) cart.push({...p, cartQty: 1}); else window.ksMsg('ទំនិញនេះអស់ពីស្តុកហើយ!'); } 
    window.renderCart(); window.renderPOSProducts();
};
window.updateCartQty = function(id, change) { 
    if(change > 0) window.playBeep(); const cItem = cart.find(c => c && c.id === id); const p = inventory.find(i => i && i.id === id); if (!p || !cItem) return;
    let stockQty = parseInt(p.qty) || 0; cItem.cartQty += change; 
    if(cItem.cartQty > stockQty) { cItem.cartQty = stockQty; window.ksMsg(`ស្តុកមានត្រឹមតែ ${stockQty} ${p.unit||'ឯកតា'} ប៉ុណ្ណោះ!`); } 
    if(cItem.cartQty <= 0) cart = cart.filter(c => c && c.id !== id);
    window.renderCart(); window.renderPOSProducts();
};
window.setCartQtyManually = function(id, val) {
    let newQty = parseInt(val);
    if (isNaN(newQty) || newQty <= 0) { cart = cart.filter(c => c && c.id !== id); } else {
        const cItem = cart.find(c => c && c.id === id); const p = inventory.find(i => i && i.id === id); if(!p || !cItem) return;
        let stockQty = parseInt(p.qty) || 0;
        if(newQty > stockQty) { cItem.cartQty = stockQty; window.ksMsg(`ស្តុកមានត្រឹមតែ ${stockQty} ${p.unit||'ឯកតា'} ប៉ុណ្ណោះ!`); } else cItem.cartQty = newQty;
    }
    window.renderCart(); window.renderPOSProducts();
};

window.renderCart = function() {
    const cHTML = document.getElementById('cartItems'); let tQty = 0, tUsdOnly = 0, tRielOnly = 0; 
    let globalRateEl = document.getElementById('globalExchangeRate'); window.cartRate = parseFloat(globalRateEl ? globalRateEl.value : 4000) || 4000;
    
    if(cart.length === 0) cHTML.innerHTML = `<div style="text-align: center; color: var(--text-muted); margin-top: 50px; font-size: var(--fs-14);">កន្ត្រកទទេ</div>`; 
    else {
        let finalCartHtml = '';
        cart.forEach(c => {
            if(!c) return; tQty += c.cartQty; let pUsd = parseFloat(c.price) || 0; let pRiel = parseFloat(c.riel) || 0;
            if (pUsd > 0) tUsdOnly += pUsd * c.cartQty; else if (pRiel > 0) tRielOnly += pRiel * c.cartQty;
            let priceDisplay = pUsd > 0 ? window.fMoney(pUsd) : (pRiel ? pRiel.toLocaleString()+' ៛' : '$0.00'); 
            let totalDisplay = pUsd > 0 ? window.fMoney(pUsd * c.cartQty) : (pRiel ? (pRiel * c.cartQty).toLocaleString()+' ៛' : '$0.00');
            finalCartHtml += `<div class="cart-item"><img src="${c.image||'https://placehold.co/100?text=Img'}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; margin-right: 10px; border: 1px solid var(--border);"><div style="flex:1;"><div style="font-weight:bold; font-size:var(--fs-14); margin-bottom:2px; line-height: 1.2; color: var(--text-main);">${c.name}</div><div style="color:var(--success); font-size:var(--fs-12);">${priceDisplay} <small style="color:var(--text-muted);">/ ${c.unit||'ឯកតា'}</small></div></div><div style="display:flex; align-items:center; gap:4px; background:var(--bg-dark); padding:2px; border-radius:6px; border:1px solid var(--border);"><button class="qty-btn" onclick="window.updateCartQty('${c.id}', -1)" style="width:20px; height:20px; font-size:var(--fs-14);"> - </button><input type="number" class="cart-qty-input" value="${c.cartQty}" onchange="window.setCartQtyManually('${c.id}', this.value)" style="width: 35px; height:22px; text-align: center; background: transparent; border: none; font-weight: bold; color: var(--text-main); outline:none; font-size: var(--fs-13);"><button class="qty-btn" onclick="window.updateCartQty('${c.id}', 1)" style="width:20px; height:20px; font-size:var(--fs-14);"> + </button></div><div style="width:70px; text-align:right; font-weight:bold; font-size:var(--fs-14); margin-left: 10px; color: var(--text-main);">${totalDisplay}</div></div>`;
        });
        cHTML.innerHTML = finalCartHtml;
    }
    
    let posDiscEl = document.getElementById('posDiscount'); let discountValue = parseFloat(posDiscEl ? posDiscEl.value : 0) || 0; 
    let posDiscTypeEl = document.getElementById('posDiscountType'); let discountType = posDiscTypeEl ? posDiscTypeEl.value : '%';
    
    let totalBaseUsd = tUsdOnly + (tRielOnly / window.cartRate); let discountAmountUsd = 0;
    if (discountType === '%') { if(discountValue > 100) discountValue = 100; if(discountValue < 0) discountValue = 0; discountAmountUsd = totalBaseUsd * (discountValue / 100); } else { if(discountValue < 0) discountValue = 0; discountAmountUsd = discountValue; if(discountAmountUsd > totalBaseUsd) discountAmountUsd = totalBaseUsd; }
    let subTotalAfterDiscount = totalBaseUsd - discountAmountUsd; let taxAmountUsd = 0; if (sysSettings.tax) { let taxRate = parseFloat(sysSettings.taxRate) || 0; taxAmountUsd = subTotalAfterDiscount * (taxRate / 100); }
    window.cartFinalUsd = subTotalAfterDiscount + taxAmountUsd; window.cartFinalRiel = window.cartFinalUsd * window.cartRate;
    document.getElementById('cartTotalQty').innerText = tQty; 
    
    if(document.getElementById('cartDiscountAmount')) document.getElementById('cartDiscountAmount').innerText = '-' + window.fMoney(discountAmountUsd); 
    if(document.getElementById('cartTaxAmount')) document.getElementById('cartTaxAmount').innerText = '+' + window.fMoney(taxAmountUsd);
    
    document.getElementById('cartTotalAmount').innerText = window.fMoney(window.cartFinalUsd); 
    if(window.cartFinalRiel > 0) document.getElementById('cartTotalAmountRiel').innerText = Math.round(window.cartFinalRiel).toLocaleString() + ' ៛'; else document.getElementById('cartTotalAmountRiel').innerText = '';
    
    const body = document.getElementById('cartSummaryBody'); const isCollapsed = body.classList.contains('collapsed'); const arrow = isCollapsed ? '▲' : '▼'; const actionText = isCollapsed ? 'បើកផ្ទាំងគិតលុយ (Checkout)' : 'បង្រួម/ពង្រីក ផ្ទាំងគិតលុយ';
    document.getElementById('mobileCartTotalInfo').innerText = `${arrow} ${actionText} - ${tQty} មុខ (${window.fMoney(window.cartFinalUsd)}) ${arrow}`;
};

window.clearCart = function() { if(cart.length === 0) return; window.ksMsg('តើអ្នកពិតជាចង់លុបទំនិញទាំងអស់ចេញពីកន្ត្រកមែនទេ?', 'បញ្ជាក់ការលុប', true, () => { cart = []; window.renderCart(); window.renderPOSProducts(); }); };
window.toggleCartSummary = function() { 
    const body = document.getElementById('cartSummaryBody'); const btn = document.getElementById('toggleCartBtn'); const tQty = cart.reduce((acc, item) => acc + item.cartQty, 0);
    if (window.innerWidth <= 768) { document.getElementById('mobileCartContainer').classList.toggle('open'); } else {
        if (body.classList.contains('collapsed')) { body.classList.remove('collapsed'); btn.innerHTML = `<span id="mobileCartTotalInfo">▼ បង្រួម/ពង្រីក ផ្ទាំងគិតលុយ - ${tQty} មុខ (${window.fMoney(window.cartFinalUsd)}) ▼</span>`; } 
        else { body.classList.add('collapsed'); btn.innerHTML = `<span id="mobileCartTotalInfo">▲ បើកផ្ទាំងគិតលុយ (Checkout) - ${tQty} មុខ (${window.fMoney(window.cartFinalUsd)}) ▲</span>`; }
    }
};

window.openCheckoutModal = function() { 
    if(cart.length === 0) return window.ksMsg('គ្មានទំនិញក្នុងកន្ត្រកទេ!'); 
    let displayHtml = `${window.fMoney(window.cartFinalUsd)}`; 
    if(window.cartFinalRiel > 0) displayHtml += ` <br><span style="font-size: 18px; color: var(--text-muted);">${Math.round(window.cartFinalRiel).toLocaleString()} ៛</span>`; 
    
    document.getElementById('checkoutTotalDisplay').innerHTML = displayHtml; 
    document.getElementById('checkoutReceivedUsd').value = ''; 
    document.getElementById('checkoutReceivedRiel').value = ''; 
    document.getElementById('checkoutChangeDisplay').innerText = '$0.00 | 0 ៛'; 
    document.getElementById('checkoutModal').style.display = 'flex'; 
    
    if (window.innerWidth <= 768) {
        document.getElementById('mobileCartContainer').classList.remove('open');
    }

    if (window.cartFinalUsd > 0) setTimeout(() => document.getElementById('checkoutReceivedUsd').focus(), 100); 
    else setTimeout(() => document.getElementById('checkoutReceivedRiel').focus(), 100); 
};
window.calculateChange = function() { let rate = window.cartRate; let recvUsd = parseFloat(document.getElementById('checkoutReceivedUsd').value) || 0; let recvRiel = parseFloat(document.getElementById('checkoutReceivedRiel').value) || 0; let totalKhr = Math.round(window.cartFinalRiel); let recvKhr = (recvUsd * rate) + recvRiel; let changeKhr = recvKhr - totalKhr; if (changeKhr < 0) changeKhr = 0; let changeUsd = changeKhr / rate; document.getElementById('checkoutChangeDisplay').innerText = `${window.fMoney(changeUsd)} | ${Math.round(changeKhr).toLocaleString()} ៛`; };
window.processCheckoutPaid = function() { let rate = window.cartRate; let recvUsd = parseFloat(document.getElementById('checkoutReceivedUsd').value) || 0; let recvRiel = parseFloat(document.getElementById('checkoutReceivedRiel').value) || 0; let totalKhr = Math.round(window.cartFinalRiel); let recvKhr = (recvUsd * rate) + recvRiel; let changeKhr = recvKhr - totalKhr; if (changeKhr < 0) changeKhr = 0; let changeUsd = changeKhr / rate; document.getElementById('checkoutModal').style.display = 'none'; window.checkout('paid', recvUsd, recvRiel, changeUsd, changeKhr); };

window.checkout = function(status, rUsd = 0, rRiel = 0, cUsd = 0, cRiel = 0) {
    if(cart.length === 0) return window.ksMsg('គ្មានទំនិញក្នុងកន្ត្រកទេ!');
    const custNameInput = document.getElementById('posCustomerName').value.trim(); const custPhoneInput = document.getElementById('posCustomerPhone').value.trim();
    if(status === 'unpaid' && !custNameInput) return window.ksMsg('សុំបញ្ចូលឈ្មោះអតិថិជនសិន មុននឹងចុចរង់ចាំទូទាត់!');
    
    let discountValue = parseFloat(document.getElementById('posDiscount') ? document.getElementById('posDiscount').value : 0) || 0; 
    let discountType = document.getElementById('posDiscountType') ? document.getElementById('posDiscountType').value : '%'; 
    let appliedTaxRate = sysSettings.tax ? (parseFloat(sysSettings.taxRate) || 0) : 0;
    let docType = status === 'paid' ? 'បង្កាន់ដៃទទួលប្រាក់ / Receipt' : 'វិក្កយបត្រ / Invoice'; 
    let currentSellerName = activeUser ? (activeUser.fullName ? activeUser.fullName : activeUser.username) : 'System'; 
    let newInvId = window.generateInvoiceId(); let timestampNow = Date.now(); 

    let receiptHTML = `<div style="text-align:center; margin-bottom: 8px;">`; 
    if(shopLogo) receiptHTML += `<img src="${shopLogo}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 50%; margin-bottom: 5px; filter: grayscale(100%);">`; 
    receiptHTML += `<h2 style="margin:0; font-size:16px;">${shopName}</h2>`; 
    if(shopPhone) receiptHTML += `<p style="margin:2px 0; font-size:12px;">Tel: ${shopPhone}</p>`; 
    if(shopAddress) receiptHTML += `<p style="margin:2px 0; font-size:12px;">${shopAddress}</p>`; 
    receiptHTML += `<div class="print-dashed-line"></div><p style="margin:4px 0; font-size:14px; font-weight:bold;">${docType}</p><p style="margin:2px 0; font-size:11px; text-align:left;">កាលបរិច្ឆេទ: ${window.fDate()}</p><p style="margin:2px 0; font-size:11px; text-align:left;">លេខវិក្កយបត្រ: ${newInvId}</p><p style="margin:2px 0; font-size:11px; text-align:left;">អ្នកលក់: ${currentSellerName}</p>`;
    if(custNameInput) receiptHTML += `<p style="margin:2px 0; font-size:11px; text-align:left;">អតិថិជន: <b>${custNameInput}</b> ${custPhoneInput?`(${custPhoneInput})`:''}</p>`;
    receiptHTML += `<div class="print-dashed-line"></div></div><table style="width:100%; text-align:left; font-size: 12px; table-layout: fixed;"><thead><tr><th style="width: 50%; border-bottom: 1px solid #000; padding-bottom: 4px;">ទំនិញ</th><th style="width: 20%; text-align:center; border-bottom: 1px solid #000; padding-bottom: 4px;">ចំនួន</th><th style="width: 30%; text-align:right; border-bottom: 1px solid #000; padding-bottom: 4px;">សរុប</th></tr></thead><tbody>`;

    cart.forEach(c => {
        if(!c) return; const idx = inventory.findIndex(p => p && p.id === c.id);
        if(idx !== -1) {
            inventory[idx].qty -= c.cartQty; 
            window.logAction('sale', c.name, c.cartQty, status === 'paid' ? 'លក់ចេញ (ទូទាត់រួច)' : `លក់ចេញ (រង់ចាំទូទាត់ ដោយ ${custNameInput})`);
            let lineStr = '', uPriceStr = '';
            if(c.price > 0) { lineStr = window.fMoney(c.price * c.cartQty); uPriceStr = window.fMoney(c.price); } else if(c.riel > 0) { lineStr = ((c.riel||0) * c.cartQty).toLocaleString() + '៛'; uPriceStr = c.riel.toLocaleString() + '៛'; } else { lineStr = '$0.00'; uPriceStr = '$0.00'; } 
            receiptHTML += `<tr><td colspan="3" style="padding-top: 4px; font-weight:bold; font-size: 12px;">${c.name}</td></tr><tr><td style="padding-bottom: 4px; font-size: 11px;">${uPriceStr}</td><td style="text-align:center; padding-bottom: 4px; font-size: 11px;">${c.cartQty} ${c.unit||''}</td><td style="text-align:right; font-weight:bold; padding-bottom: 4px;">${lineStr}</td></tr>`;
        }
    });
    receiptHTML += `</tbody></table><div class="print-dashed-line"></div>`;

    const newInvoice = { id: newInvId, timestamp: timestampNow, date: window.fDate(), customer: custNameInput || 'អតិថិជនទូទៅ', phone: custPhoneInput, items: [...cart], rate: window.cartRate, totalAmount: window.cartFinalUsd, totalRiel: Math.round(window.cartFinalRiel), discount: discountValue, discountType: discountType, taxRate: appliedTaxRate, receivedUsd: rUsd, receivedRiel: rRiel, changeUsd: cUsd, changeRiel: cRiel, status: status, seller: currentSellerName, paidUsd: (status === 'paid' ? window.cartFinalUsd : 0) }; 
    invoices.push(newInvoice); if(custNameInput) window.autoRegisterCustomer(custNameInput, custPhoneInput);

    receiptHTML += `<table style="width:100%; font-size: 12px; margin-top: 5px;">`;
    if (discountValue > 0) receiptHTML += `<tr><td>បញ្ចុះតម្លៃ:</td><td style="text-align:right;">${discountType === '%' ? `${discountValue}%` : window.fMoney(discountValue)}</td></tr>`;
    if (appliedTaxRate > 0) receiptHTML += `<tr><td>VAT (${appliedTaxRate}%):</td><td style="text-align:right;">បូកបញ្ចូល</td></tr>`;
    receiptHTML += `<tr><td style="font-weight:bold; font-size:14px; padding-top:4px;">សរុបប្រាក់:</td><td style="text-align:right; font-weight:bold; font-size:14px; padding-top:4px;">${window.fMoney(window.cartFinalUsd)}</td></tr>`;
    if(window.cartFinalRiel > 0) receiptHTML += `<tr><td></td><td style="text-align:right; font-weight:bold; font-size:14px;">${Math.round(window.cartFinalRiel).toLocaleString()} ៛</td></tr>`;
    
    if(status === 'paid' && (rUsd > 0 || rRiel > 0)) { 
        let rStr = []; if(rUsd > 0) rStr.push(window.fMoney(rUsd)); if(rRiel > 0) rStr.push(rRiel.toLocaleString() + '៛'); 
        receiptHTML += `<tr><td style="padding-top:4px; font-size:11px;">ប្រាក់ទទួល:</td><td style="text-align:right; padding-top:4px; font-size:11px;">${rStr.join(' | ')}</td></tr>`; 
        let cStr = []; if(cUsd > 0 || cRiel > 0) { cStr.push(window.fMoney(cUsd)); cStr.push(Math.round(cRiel).toLocaleString() + '៛'); } else cStr.push('$0.00'); 
        receiptHTML += `<tr><td style="font-size:11px;">ប្រាក់អាប់:</td><td style="text-align:right; font-size:11px;">${cStr.join(' | ')}</td></tr>`; 
    }
    receiptHTML += `</table>`;

    if (shopQR) receiptHTML += `<div style="text-align:center; margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px;"><p style="font-size:12px; margin-bottom:5px; font-weight:bold;">ស្កេនទូទាត់ប្រាក់ (Scan to Pay)</p><img src="${shopQR}" style="width: 120px; height: 120px; object-fit: contain; filter: grayscale(100%);"></div>`;
    receiptHTML += `<p style="text-align:center; font-size:10px; margin-top: 10px;">(Rate: 1$ = ${window.cartRate}៛)</p><p style="text-align:center; font-size:12px; margin-top: 5px; font-weight:bold;">សូមអរគុណ! សូមអញ្ជើញមកម្តងទៀត។</p>`;
    
    window.saveData(); cart = []; document.getElementById('posCustomerName').value = ''; document.getElementById('posCustomerPhone').value = ''; if (document.getElementById('posDiscount')) document.getElementById('posDiscount').value = ''; document.getElementById('mobileCartContainer').classList.remove('open'); window.renderCart(); window.renderPOSProducts(); window.executePrint(receiptHTML);
};

window.executePrint = function(htmlContent) { const printArea = document.getElementById('printReceiptArea'); printArea.innerHTML = htmlContent; printArea.style.display = 'block'; window.print(); printArea.style.display = 'none'; };

window.currentDebtInvoiceId = null;

window.settlePayment = function(invoiceId) {
    const inv = invoices.find(i => i.id === invoiceId); if(!inv) return;
    window.currentDebtInvoiceId = invoiceId; let paid = inv.paidUsd || 0; let remaining = inv.totalAmount - paid; if(remaining < 0) remaining = 0;
    document.getElementById('debtTotalDisplay').innerText = window.fMoney(inv.totalAmount); document.getElementById('debtPaidDisplay').innerText = window.fMoney(paid); document.getElementById('debtRemainingDisplay').innerText = window.fMoney(remaining); document.getElementById('debtPayUsd').value = ''; document.getElementById('debtPayRiel').value = ''; document.getElementById('debtChangeDisplay').innerText = '$0.00 | 0 ៛'; document.getElementById('debtPaymentModal').style.display = 'flex'; setTimeout(() => document.getElementById('debtPayUsd').focus(), 100);
};
window.calculateDebtChange = function() {
    if(!window.currentDebtInvoiceId) return; const inv = invoices.find(i => i.id === window.currentDebtInvoiceId);
    let rate = inv.rate || window.cartRate || 4000; let paid = inv.paidUsd || 0; let remainingUsd = inv.totalAmount - paid; if(remainingUsd < 0) remainingUsd = 0;
    let payUsd = parseFloat(document.getElementById('debtPayUsd').value) || 0; let payRiel = parseFloat(document.getElementById('debtPayRiel').value) || 0;
    let changeRiel = ((payUsd * rate) + payRiel) - (remainingUsd * rate); if (changeRiel < 0) changeRiel = 0;
    document.getElementById('debtChangeDisplay').innerText = `${window.fMoney(changeRiel / rate)} | ${Math.round(changeRiel).toLocaleString()} ៛`;
};
window.processDebtPayment = function() {
    if(!window.currentDebtInvoiceId) return; const inv = invoices.find(i => i.id === window.currentDebtInvoiceId); if(!inv) return;
    let rate = inv.rate || window.cartRate || 4000; let payUsd = parseFloat(document.getElementById('debtPayUsd').value) || 0; let payRiel = parseFloat(document.getElementById('debtPayRiel').value) || 0;
    let paymentInUsd = payUsd + (payRiel / rate); if (paymentInUsd <= 0) return window.ksMsg('សូមបញ្ចូលចំនួនប្រាក់ដែលត្រូវសង!');
    inv.paidUsd = (inv.paidUsd || 0) + paymentInUsd;
    if (inv.paidUsd >= inv.totalAmount - 0.01) { inv.status = 'paid'; inv.paidUsd = inv.totalAmount; window.logAction('update', inv.customer, 0, `បានទូទាត់ប្រាក់គ្រប់ចំនួន ${window.fMoney(paymentInUsd)} សម្រាប់វិក្កយបត្រ ${inv.id}`); } 
    else { window.logAction('update', inv.customer, 0, `បានសងប្រាក់ជំពាក់ ${window.fMoney(paymentInUsd)} (នៅខ្វះ ${window.fMoney(inv.totalAmount - inv.paidUsd)}) សម្រាប់វិក្កយបត្រ ${inv.id}`); }
    document.getElementById('debtPaymentModal').style.display = 'none'; window.saveData(); window.ksMsg('ប្រាក់សងត្រូវបានកត់ត្រាចូលបញ្ជីជោគជ័យ!', 'ជោគជ័យ');
};

window.openExpenseModal = function() { if(currentRole !== 'admin') return window.ksMsg('មានតែ Admin ប៉ុណ្ណោះដែលអាចកត់ត្រាចំណាយបាន!'); document.getElementById('expAmount').value = ''; document.getElementById('expNote').value = ''; document.getElementById('expenseModal').style.display = 'flex'; setTimeout(() => document.getElementById('expAmount').focus(), 100); };
window.closeExpenseModal = function() { document.getElementById('expenseModal').style.display = 'none'; };
window.saveExpense = function() {
    const category = document.getElementById('expCategory').value; const amount = parseFloat(document.getElementById('expAmount').value) || 0; const note = document.getElementById('expNote').value.trim();
    if(amount <= 0) return window.ksMsg('សូមបញ្ចូលទឹកប្រាក់ចំណាយឱ្យបានត្រឹមត្រូវ!');
    let executor = activeUser ? (activeUser.fullName ? activeUser.fullName : activeUser.username) : 'Admin';
    expenses.unshift({ id: 'EXP_' + Date.now(), timestamp: Date.now(), date: window.fDate(), category: category, amount: amount, note: note, seller: executor });
    window.logAction('add', category, amount, `កត់ត្រាចំណាយ: ${window.fMoney(amount)} (${note||'គ្មានចំណាំ'})`); window.saveData(); window.closeExpenseModal(); window.ksMsg('ការចំណាយត្រូវបានកត់ត្រាជោគជ័យ!', 'ជោគជ័យ');
};
window.renderExpenses = function() {
    const tbody = document.getElementById('expenseTableBody'); if(!tbody) return;
    const search = document.getElementById('searchExpense').value.toLowerCase(); let totalExp = 0; let finalHtml = '';
    expenses.filter(e => String(e.category).toLowerCase().includes(search) || (e.note && String(e.note).toLowerCase().includes(search))).forEach(e => {
        totalExp += e.amount; let deleteBtn = currentRole === 'admin' ? `<button class="btn-danger" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="window.deleteExpense('${e.id}')">🗑️ លុប</button>` : '';
        finalHtml += `<tr><td style="font-size:var(--fs-12); color:var(--text-muted);">${e.date}</td><td><span class="badge badge-unpaid">${e.category}</span></td><td style="font-weight:bold; color:var(--danger);">${window.fMoney(e.amount)}</td><td style="font-size:var(--fs-12);">${e.note||'-'}</td><td style="text-align: center;">${deleteBtn}</td></tr>`;
    });
    tbody.innerHTML = finalHtml || '<tr><td colspan="5" style="text-align:center;">មិនទាន់មានទិន្នន័យចំណាយទេ</td></tr>'; document.getElementById('summaryTotalExpense').innerText = window.fMoney(totalExp);
};
window.deleteExpense = function(id) { if(currentRole !== 'admin') return; window.ksMsg('តើអ្នកពិតជាចង់លុបការចំណាយនេះមែនទេ?', 'បញ្ជាក់ការលុប', true, () => { expenses = expenses.filter(e => e.id !== id); window.saveData(); window.renderExpenses(); window.ksMsg('ការចំណាយត្រូវបានលុប!'); }); };

window.renderUnpaid = function() {
    const search = document.getElementById('searchUnpaid').value.toLowerCase(); let filterEl = document.getElementById('filterInvoiceStatus'); const statusFilter = filterEl ? filterEl.value : 'all'; 
    const dateFrom = document.getElementById('invoiceDateFrom'); const dateTo = document.getElementById('invoiceDateTo'); const fromTime = (dateFrom && dateFrom.value) ? new Date(dateFrom.value).setHours(0,0,0,0) : 0; const toTime = (dateTo && dateTo.value) ? new Date(dateTo.value).setHours(23,59,59,999) : Infinity;
    let filteredList = invoices.filter(inv => String(inv.customer).toLowerCase().includes(search) || (inv.phone && String(inv.phone).includes(search)) || String(inv.id).toLowerCase().includes(search)); 
    if (statusFilter !== 'all') filteredList = filteredList.filter(inv => inv.status === statusFilter);
    filteredList = filteredList.filter(inv => { let invTime = inv.timestamp || 0; return invTime >= fromTime && invTime <= toTime; });
    if (currentRole !== 'admin' && activeUser) { let sellerNameToCheck = activeUser.fullName ? activeUser.fullName : activeUser.username; filteredList = filteredList.filter(inv => inv.seller === sellerNameToCheck); }
    const isAdmin = currentRole === 'admin'; let sumPaid = 0; let sumUnpaid = 0; let finalHtml = '';
    
    filteredList.forEach(inv => {
        let invPaid = inv.paidUsd || 0; let remaining = inv.totalAmount - invPaid; if (remaining < 0) remaining = 0;
        if(inv.status === 'paid') sumPaid += inv.totalAmount; else if(inv.status === 'unpaid') { sumPaid += invPaid; sumUnpaid += remaining; }
        let itemsSummary = inv.items.map(i => `${i.name} (x${i.cartQty})`).join(', '); if(itemsSummary.length > 35) itemsSummary = itemsSummary.substring(0, 35) + '...';
        let statusBadge = inv.status === 'paid' ? '<span class="badge badge-paid">ទូទាត់រួច</span>' : '<span class="badge badge-unpaid">រង់ចាំទូទាត់</span>';
        let actionBtns = `<button class="btn btn-outline" style="padding: 6px; font-size: var(--fs-12); color: var(--primary); border-color: var(--primary);" onclick="window.viewInvoice('${inv.id}')" title="មើលលម្អិត និងព្រីន">👁️ មើល</button>`;
        if (inv.status === 'unpaid') actionBtns += `${isAdmin ? `<button class="btn btn-outline" style="padding: 6px; font-size: var(--fs-12); color: var(--warning); border-color: var(--warning);" onclick="window.openInvoiceEdit('${inv.id}')">✏️ កែប្រែ</button>` : ''}<button class="btn btn-success" style="padding: 6px 12px; font-size: var(--fs-12);" onclick="window.settlePayment('${inv.id}')">💸 សងប្រាក់</button>`; 
        let totalDisplay = inv.status === 'unpaid' ? `<div style="font-size:var(--fs-12); color:var(--text-muted);">សរុប: ${window.fMoney(inv.totalAmount)}</div>${invPaid > 0 ? `<div style="font-size:var(--fs-12); color:var(--success);">បានសង: ${window.fMoney(invPaid)}</div>` : ''}<div style="font-size:var(--fs-14); font-weight:bold; color:var(--danger); margin-top:2px;">ខ្វះ: ${window.fMoney(remaining)}</div>` : `<div style="font-weight:bold; color:var(--success);">${window.fMoney(inv.totalAmount)}</div>${inv.totalRiel > 0 ? `<div style="font-size: var(--fs-11); color: var(--text-muted);">${inv.totalRiel.toLocaleString()} ៛</div>` : ''}`;
        finalHtml += `<tr><td data-sort="${inv.id}" style="font-size:var(--fs-12); font-family:monospace; color:var(--text-muted);">${inv.id}</td><td data-sort="${inv.timestamp||0}" style="font-size:var(--fs-12);">${inv.date}</td><td data-sort="${inv.customer}" style="font-weight:bold; color:var(--text-main);">${inv.customer}<br><span style="font-size:var(--fs-11); font-weight:normal; color:var(--text-muted);">${inv.phone||''}</span></td><td data-sort="${itemsSummary}" style="font-size:var(--fs-12);" title="${inv.items.map(i => i.name).join(', ')}">${itemsSummary}</td><td data-sort="${inv.totalAmount}">${totalDisplay}</td><td data-sort="${inv.status}">${statusBadge}</td>${isAdmin ? `<td data-sort="${inv.seller||''}" style="color:var(--primary); font-size:var(--fs-12); font-weight:bold;">${inv.seller||'N/A'}</td>` : ''}<td style="text-align: center;"><div style="display: inline-flex; gap: 5px; justify-content: center;">${actionBtns}</div></td></tr>`;
    });
    
    document.getElementById('unpaidTable').innerHTML = finalHtml || `<tr><td colspan="${isAdmin ? 8 : 7}" style="text-align:center;">មិនមានទិន្នន័យទេ</td></tr>`;
    document.getElementById('summaryInvoicePaid').innerText = window.fMoney(sumPaid); document.getElementById('summaryInvoiceUnpaid').innerText = window.fMoney(sumUnpaid); setTimeout(() => window.filterTable('mainUnpaidTable'), 50);
};

window.exportInvoicesCSV = function() {
    if(invoices.length === 0) return window.ksMsg('គ្មានទិន្នន័យដើម្បីទាញយកទេ!');
    const isAdmin = currentRole === 'admin'; 
    let csv = '\uFEFFលេខវិក្កយបត្រ,កាលបរិច្ឆេទ,អតិថិជន,លេខទូរស័ព្ទ,ទំនិញ(សង្ខេប),ថ្លៃដើមសរុប($),ប្រាក់ចំណូលសរុប($),ប្រាក់ចំណេញ($),ស្ថានភាព'; 
    if(isAdmin) csv += ',អ្នកលក់'; csv += '\n';

    invoices.forEach(inv => {
        let id = `"${inv.id}"`; let date = `"${inv.date}"`; let cust = `"${inv.customer ? String(inv.customer).replace(/"/g, '""') : ''}"`; let phone = `"${inv.phone ? String(inv.phone).replace(/"/g, '""') : ''}"`; 
        let itemsStr = ''; let totalCogs = 0;
        if(inv.items) { itemsStr = inv.items.map(i => `${i.name}(x${i.cartQty})`).join('; '); inv.items.forEach(item => { totalCogs += ((parseFloat(item.cost) || 0) * (parseInt(item.cartQty) || 0)); }); }
        let items = `"${itemsStr.replace(/"/g, '""')}"`; let revenue = parseFloat(inv.totalAmount) || 0; let profit = revenue - totalCogs; let status = `"${inv.status === 'paid' ? 'ទូទាត់រួច' : 'រង់ចាំទូទាត់'}"`; 
        csv += `${id},${date},${cust},${phone},${items},${totalCogs.toFixed(2)},${revenue.toFixed(2)},${profit.toFixed(2)},${status}`; 
        if(isAdmin) csv += `,"${inv.seller ? String(inv.seller).replace(/"/g, '""') : ''}"`; csv += '\n';
    });
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = `Invoices_Profit_Report_${Date.now()}.csv`; a.click();
};

window.updateCustomerDatalist = function() { const dlist = document.getElementById('customerDatalist'); if(dlist) { let opts = ''; customers.forEach(c => { opts += `<option value="${c.name}">${c.phone||''}</option>`; }); dlist.innerHTML = opts; } };
window.autoFillCustomerPhone = function(mode) { let nameInput, phoneInput; if(mode === 'pos') { nameInput = document.getElementById('posCustomerName'); phoneInput = document.getElementById('posCustomerPhone'); } else { nameInput = document.getElementById('editInvName'); phoneInput = document.getElementById('editInvPhone'); } const found = customers.find(c => String(c.name).toLowerCase() === nameInput.value.trim().toLowerCase()); if(found && !phoneInput.value) phoneInput.value = found.phone ? found.phone : ''; };
window.autoRegisterCustomer = function(name, phone) { if(!name) return; const existing = customers.find(c => String(c.name).toLowerCase() === String(name).toLowerCase()); if(!existing) customers.push({ id: 'C_' + Date.now(), name: name, phone: phone ? phone : '' }); else if (!existing.phone && phone) existing.phone = phone; };

window.renderCustomers = function() {
    const search = document.getElementById('searchCustomer'); if(!search) return; const term = search.value.toLowerCase(); const custStats = {};
    invoices.forEach(inv => { 
        if(!custStats[inv.customer]) custStats[inv.customer] = { paid: 0, unpaid: 0 }; 
        let invPaid = inv.paidUsd || 0;
        if(inv.status === 'paid') custStats[inv.customer].paid += inv.totalAmount; else if(inv.status === 'unpaid') { custStats[inv.customer].paid += invPaid; custStats[inv.customer].unpaid += (inv.totalAmount - invPaid); }
    });
    const filtered = customers.filter(c => String(c.name).toLowerCase().includes(term) || (c.phone && String(c.phone).includes(term))); const tbody = document.getElementById('customerTable');
    if(tbody) { 
        let fHtml = '';
        filtered.forEach(c => {
            const paid = custStats[c.name] ? custStats[c.name].paid : 0; const unpaid = custStats[c.name] ? custStats[c.name].unpaid : 0; 
            fHtml += `<tr><td data-sort="${c.name}" style="font-weight:bold; color:var(--text-main);">${c.name}</td><td data-sort="${c.phone||'-'}">${c.phone||'-'}</td><td data-sort="${paid}" style="color:var(--success); font-weight:bold;">${window.fMoney(paid)}</td><td data-sort="${unpaid}" style="color:${unpaid>0?'var(--danger)':'var(--text-muted)'}; font-weight:bold;">${window.fMoney(unpaid)}</td><td style="text-align: center;"><div style="display: inline-flex; gap: 5px; justify-content: center;"><button class="btn btn-outline" style="padding:4px 8px; font-size:var(--fs-12); color: var(--primary); border-color: var(--primary);" onclick="window.viewCustomerHistory('${c.name}')">🛍️ ប្រវត្តិទិញ</button><button class="btn btn-outline" style="padding:4px 8px; font-size:var(--fs-12);" onclick="window.editCustomer('${c.id}')">✏️ កែប្រែ</button><button class="btn-danger" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="window.deleteCustomer('${c.id}')">🗑️</button></td></tr>`;
        });
        tbody.innerHTML = fHtml || '<tr><td colspan="5" style="text-align:center;">មិនមានអតិថិជនទេ</td></tr>';
    }
    setTimeout(() => window.filterTable('mainCustomerTable'), 50);
};

window.openCustomerModal = function() { document.getElementById('cId').value = ''; document.getElementById('cName').value = ''; document.getElementById('cPhone').value = ''; document.getElementById('customerModalTitle').innerText = 'អតិថិជនថ្មី'; document.getElementById('customerModal').style.display = 'flex'; };
window.closeCustomerModal = function() { document.getElementById('customerModal').style.display = 'none'; };
window.viewCustomerHistory = function(customerName) {
    document.getElementById('chCustName').innerText = customerName; const custInvoices = invoices.filter(inv => String(inv.customer).toLowerCase() === String(customerName).toLowerCase()); 
    let fHtml = ''; custInvoices.forEach(inv => { let itemsSummary = inv.items.map(i => `${i.name} (x${i.cartQty})`).join(', '); if(itemsSummary.length > 40) itemsSummary = itemsSummary.substring(0, 40) + '...'; let statusBadge = inv.status === 'paid' ? '<span class="badge badge-paid">ទូទាត់រួច</span>' : '<span class="badge badge-unpaid">ជំពាក់</span>'; fHtml += `<tr><td style="font-size:var(--fs-12); color:var(--text-muted);">${inv.date}</td><td style="font-size:var(--fs-12);" title="${inv.items.map(i => i.name).join(', ')}">${itemsSummary}</td><td style="font-weight:bold; color:var(--success);">${window.fMoney(inv.totalAmount)}</td><td>${statusBadge}</td><td><button class="btn btn-outline" style="padding: 4px 8px; font-size: var(--fs-12);" onclick="window.viewInvoice('${inv.id}')">👁️ វិក្កយបត្រ</button></td></tr>`; });
    document.getElementById('customerHistoryTableBody').innerHTML = fHtml || '<tr><td colspan="5" style="text-align:center;">អតិថិជននេះមិនទាន់មានប្រវត្តិទិញទេ</td></tr>'; document.getElementById('customerHistoryModal').style.display = 'flex';
};
window.closeCustomerHistoryModal = function() { document.getElementById('customerHistoryModal').style.display = 'none'; };
window.saveCustomer = function() {
    const id = document.getElementById('cId').value; const name = document.getElementById('cName').value.trim(); const phone = document.getElementById('cPhone').value.trim(); if(!name) return window.ksMsg("សូមបញ្ចូលឈ្មោះអតិថិជន!");
    if(id) { const idx = customers.findIndex(c => c.id === id); if(idx !== -1) { const oldName = customers[idx].name; if(oldName !== name) invoices.forEach(inv => { if(inv.customer === oldName) inv.customer = name; }); customers[idx].name = name; customers[idx].phone = phone; } } else { if(customers.find(c => String(c.name).toLowerCase() === String(name).toLowerCase())) return window.ksMsg("ឈ្មោះអតិថិជននេះមានរួចហើយ!"); customers.push({ id: 'C_' + Date.now(), name, phone }); } window.closeCustomerModal(); window.saveData(); window.ksMsg("ព័ត៌មានអតិថិជនត្រូវបានរក្សាទុក!", "ជោគជ័យ");
};
window.editCustomer = function(id) { const c = customers.find(x => x.id === id); if(!c) return; document.getElementById('cId').value = c.id; document.getElementById('cName').value = c.name; document.getElementById('cPhone').value = c.phone || ''; document.getElementById('customerModalTitle').innerText = 'កែប្រែព័ត៌មានអតិថិជន'; document.getElementById('customerModal').style.display = 'flex'; };
window.deleteCustomer = function(id) { window.ksMsg('តើអ្នកពិតជាចង់លុបអតិថិជននេះមែនទេ?', 'បញ្ជាក់ការលុប', true, () => { customers = customers.filter(c => c.id !== id); window.saveData(); window.renderCustomers(); }); };

window.viewInvoice = function(id) {
    const inv = invoices.find(i => i.id === id); if(!inv) return; viewingInvoiceId = id; document.getElementById('viewShopName').innerText = shopName; 
    const contactDisplay = document.getElementById('viewShopContact'); if (shopPhone || shopAddress) { contactDisplay.innerHTML = `${shopPhone ? `Tel: ${shopPhone}<br>` : ''}${shopAddress ? `${shopAddress}` : ''}`; contactDisplay.style.display = 'block'; } else contactDisplay.style.display = 'none';
    const logoImg = document.getElementById('viewInvoiceLogo'); if(shopLogo) { logoImg.src = shopLogo; logoImg.style.display = 'block'; logoImg.style.filter = 'grayscale(100%)'; } else logoImg.style.display = 'none';
    document.getElementById('viewInvoiceType').innerText = inv.status === 'paid' ? 'បង្កាន់ដៃទទួលប្រាក់ / Receipt' : 'វិក្កយបត្រ / Invoice'; 
    document.getElementById('viewInvoiceDate').innerHTML = `កាលបរិច្ឆេទ: ${inv.date}<br>អ្នកលក់: ${inv.seller||'N/A'}`; document.getElementById('viewInvoiceIdDisplay').innerText = `លេខវិក្កយបត្រ: ${inv.id}`;
    
    let content = `<div style="margin-bottom: 8px; border-bottom: 1px dashed #000; padding-bottom: 8px;">`;
    if(inv.customer && inv.customer !== 'អតិថិជនទូទៅ') content += `<p style="margin:2px 0; font-size: var(--fs-12); color:#000; text-align:left;">អតិថិជន: <b>${inv.customer}</b> ${inv.phone?`(${inv.phone})`:''}</p>`;
    content += `</div><table style="width: 100%; text-align: left; border-collapse: collapse; font-size: var(--fs-13); color:#000; table-layout: fixed;"><thead><tr><th style="padding-bottom: 4px; color:#000; width: 50%; border-bottom: 1px solid #000;">ទំនិញ</th><th style="padding-bottom: 4px; text-align:center; color:#000; width: 20%; border-bottom: 1px solid #000;">ចំនួន</th><th style="padding-bottom: 4px; text-align:right; color:#000; width: 30%; border-bottom: 1px solid #000;">សរុប</th></tr></thead><tbody>`;
    inv.items.forEach(item => { 
        let lineStr = '', uPriceStr = ''; 
        if(item.price > 0) { lineStr = window.fMoney(item.price * item.cartQty); uPriceStr = window.fMoney(item.price); } else if(item.riel > 0) { lineStr = ((item.riel||0) * item.cartQty).toLocaleString() + ' ៛'; uPriceStr = item.riel.toLocaleString() + ' ៛'; } else { lineStr = '$0.00'; uPriceStr = '$0.00'; } 
        content += `<tr><td colspan="3" style="padding-top: 6px; color:#000; font-weight:bold; font-size: var(--fs-13);">${item.name}</td></tr><tr><td style="padding-bottom: 6px; color:#000; font-size: var(--fs-12);">${uPriceStr}</td><td style="text-align:center; padding-bottom: 6px; color:#000; font-size: var(--fs-12);">${item.cartQty} ${item.unit||''}</td><td style="text-align:right; color:#000; font-weight:bold; padding-bottom: 6px;">${lineStr}</td></tr>`; 
    });
    content += `</tbody></table><div style="border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px;"><table style="width:100%; font-size: var(--fs-13); color:#000; margin-top: 5px;">`;
    if (inv.discount > 0) content += `<tr><td>បញ្ចុះតម្លៃ:</td><td style="text-align:right;">${(inv.discountType||'%') === '%' ? `${inv.discount}%` : window.fMoney(inv.discount)}</td></tr>`;
    if (inv.taxRate && inv.taxRate > 0) content += `<tr><td>VAT (${inv.taxRate}%):</td><td style="text-align:right;">បូកបញ្ចូល</td></tr>`;
    content += `<tr><td style="font-weight:bold; font-size:var(--fs-16); padding-top:6px;">សរុបប្រាក់:</td><td style="text-align:right; font-weight:bold; font-size:var(--fs-16); padding-top:6px;">${window.fMoney(inv.totalAmount)}</td></tr>`; 
    if(inv.totalRiel > 0) content += `<tr><td></td><td style="text-align:right; font-weight:bold; font-size:var(--fs-16);">${inv.totalRiel.toLocaleString()} ៛</td></tr>`;
    if(inv.status === 'paid' && (inv.receivedUsd > 0 || inv.receivedRiel > 0)) { 
        let rStr = []; if(inv.receivedUsd > 0) rStr.push(window.fMoney(inv.receivedUsd)); if(inv.receivedRiel > 0) rStr.push(inv.receivedRiel.toLocaleString() + ' ៛'); 
        content += `<tr><td style="padding-top:6px; font-size:var(--fs-12);">ប្រាក់ទទួល:</td><td style="text-align:right; padding-top:6px; font-size:var(--fs-12);">${rStr.join(' | ')}</td></tr>`; 
        let cStr = []; if(inv.changeUsd > 0 || inv.changeRiel > 0) { cStr.push(window.fMoney(inv.changeUsd)); cStr.push(Math.round(inv.changeRiel).toLocaleString() + ' ៛'); } else cStr.push('$0.00'); 
        content += `<tr><td style="font-size:var(--fs-12);">ប្រាក់អាប់:</td><td style="text-align:right; font-size:var(--fs-12);">${cStr.join(' | ')}</td></tr>`; 
    }
    content += `</table>`;
    if (shopQR) content += `<div style="text-align:center; margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px;"><p style="font-size:12px; margin-bottom:5px; font-weight:bold; color:#000;">ស្កេនទូទាត់ប្រាក់ (Scan to Pay)</p><img src="${shopQR}" style="width: 120px; height: 120px; object-fit: contain; filter: grayscale(100%);"></div>`;
    content += `<div style="text-align: center; font-size: var(--fs-11); color:#555; margin-top: 10px;">(Rate: 1$ = ${inv.rate||4000}៛)</div></div><div style="text-align:center; font-size:var(--fs-12); color:#000; margin-top: 15px; font-weight:bold;">សូមអរគុណ! សូមអញ្ជើញមកម្តងទៀត។</div>`;
    document.getElementById('invoiceViewContent').innerHTML = content; document.getElementById('invoiceViewModal').style.display = 'flex';
};

window.closeInvoiceViewModal = function() { document.getElementById('invoiceViewModal').style.display = 'none'; viewingInvoiceId = null; };

window.reprintInvoice = function() {
    if(!viewingInvoiceId) return; const inv = invoices.find(i => i.id === viewingInvoiceId); 
    let receiptHTML = `<div style="text-align:center; margin-bottom: 8px;">`; 
    if(shopLogo) receiptHTML += `<img src="${shopLogo}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 50%; margin-bottom: 5px; filter: grayscale(100%);">`; 
    receiptHTML += `<h2 style="margin:0; font-size:16px;">${shopName}</h2>`; 
    if(shopPhone) receiptHTML += `<p style="margin:2px 0; font-size:12px;">Tel: ${shopPhone}</p>`; 
    if(shopAddress) receiptHTML += `<p style="margin:2px 0; font-size:12px;">${shopAddress}</p>`; 
    receiptHTML += `<div class="print-dashed-line"></div><p style="margin:4px 0; font-size:14px; font-weight:bold;">${inv.status === 'paid' ? 'បង្កាន់ដៃចម្លង / Receipt Copy' : 'វិក្កយបត្រចម្លង / Invoice Copy'}</p><p style="margin:2px 0; font-size:11px; text-align:left;">កាលបរិច្ឆេទ: ${inv.date}</p><p style="margin:2px 0; font-size:11px; text-align:left;">លេខវិក្កយបត្រ: ${inv.id}</p><p style="margin:2px 0; font-size:11px; text-align:left;">អ្នកលក់: ${inv.seller||'N/A'}</p>`;
    if(inv.customer && inv.customer !== 'អតិថិជនទូទៅ') receiptHTML += `<p style="margin:2px 0; font-size:11px; text-align:left;">អតិថិជន: <b>${inv.customer}</b> ${inv.phone?`(${inv.phone})`:''}</p>`;
    receiptHTML += `<div class="print-dashed-line"></div></div><table style="width:100%; text-align:left; font-size: 12px; table-layout: fixed;"><thead><tr><th style="width: 50%; border-bottom: 1px solid #000; padding-bottom: 4px;">ទំនិញ</th><th style="width: 20%; text-align:center; border-bottom: 1px solid #000; padding-bottom: 4px;">ចំនួន</th><th style="width: 30%; text-align:right; border-bottom: 1px solid #000; padding-bottom: 4px;">សរុប</th></tr></thead><tbody>`;
    inv.items.forEach(c => { 
        let lineStr = '', uPriceStr = ''; 
        if(c.price > 0) { lineStr = window.fMoney(c.price * c.cartQty); uPriceStr = window.fMoney(c.price); } else if(c.riel > 0) { lineStr = ((c.riel||0) * c.cartQty).toLocaleString() + ' ៛'; uPriceStr = c.riel.toLocaleString() + ' ៛'; } else { lineStr = '$0.00'; uPriceStr = '$0.00'; } 
        receiptHTML += `<tr><td colspan="3" style="padding-top: 4px; font-weight:bold; font-size: 12px;">${c.name}</td></tr><tr><td style="padding-bottom: 4px; font-size: 11px;">${uPriceStr}</td><td style="text-align:center; padding-bottom: 4px; font-size: 11px;">${c.cartQty} ${c.unit||''}</td><td style="text-align:right; font-weight:bold; padding-bottom: 4px;">${lineStr}</td></tr>`; 
    });
    receiptHTML += `</tbody></table><div class="print-dashed-line"></div><table style="width:100%; font-size: 12px; margin-top: 5px;">`;
    if (inv.discount > 0) receiptHTML += `<tr><td>បញ្ចុះតម្លៃ:</td><td style="text-align:right;">${(inv.discountType||'%') === '%' ? `${inv.discount}%` : window.fMoney(inv.discount)}</td></tr>`;
    if (inv.taxRate && inv.taxRate > 0) receiptHTML += `<tr><td>VAT (${inv.taxRate}%):</td><td style="text-align:right;">បូកបញ្ចូល</td></tr>`;
    receiptHTML += `<tr><td style="font-weight:bold; font-size:14px; padding-top:4px;">សរុបប្រាក់:</td><td style="text-align:right; font-weight:bold; font-size:14px; padding-top:4px;">${window.fMoney(inv.totalAmount)}</td></tr>`; 
    if(inv.totalRiel > 0) receiptHTML += `<tr><td></td><td style="text-align:right; font-weight:bold; font-size:14px;">${inv.totalRiel.toLocaleString()} ៛</td></tr>`;
    if(inv.status === 'paid' && (inv.receivedUsd > 0 || inv.receivedRiel > 0)) { 
        let rStr = []; if(inv.receivedUsd > 0) rStr.push(window.fMoney(inv.receivedUsd)); if(inv.receivedRiel > 0) rStr.push(inv.receivedRiel.toLocaleString() + ' ៛'); 
        receiptHTML += `<tr><td style="padding-top:4px; font-size:11px;">ប្រាក់ទទួល:</td><td style="text-align:right; padding-top:4px; font-size:11px;">${rStr.join(' | ')}</td></tr>`; 
        let cStr = []; if(inv.changeUsd > 0 || inv.changeRiel > 0) { cStr.push(window.fMoney(inv.changeUsd)); cStr.push(Math.round(inv.changeRiel).toLocaleString() + ' ៛'); } else cStr.push('$0.00'); 
        receiptHTML += `<tr><td style="font-size:11px;">ប្រាក់អាប់:</td><td style="text-align:right; font-size:11px;">${cStr.join(' | ')}</td></tr>`; 
    } 
    receiptHTML += `</table>`;
    if (shopQR) receiptHTML += `<div style="text-align:center; margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px;"><p style="font-size:12px; margin-bottom:5px; font-weight:bold;">ស្កេនទូទាត់ប្រាក់ (Scan to Pay)</p><img src="${shopQR}" style="width: 120px; height: 120px; object-fit: contain; filter: grayscale(100%);"></div>`;
    receiptHTML += `<p style="text-align:center; font-size:10px; margin-top: 10px;">(Rate: 1$ = ${inv.rate||4000}៛)</p><p style="text-align:center; font-size:12px; margin-top: 5px; font-weight:bold;">សូមអរគុណ! សូមអញ្ជើញមកម្តងទៀត។</p>`; 
    window.executePrint(receiptHTML);
};

window.downloadInvoicePNG = function() { html2canvas(document.getElementById('invoiceCaptureArea'), { backgroundColor: '#ffffff', scale: 2, useCORS: true }).then(canvas => { const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = `Invoice_${viewingInvoiceId||Date.now()}.png`; a.click(); }).catch(() => window.ksMsg("មានបញ្ហាក្នុងការបង្កើតរូបភាព។")); };

window.openInvoiceEdit = function(id) { if (currentRole !== 'admin') return window.ksMsg('មានតែ Admin ប៉ុណ្ណោះដែលអាចកែប្រែវិក្កយបត្របាន!', 'គ្មានសិទ្ធិ'); const inv = invoices.find(i => i.id === id); if(!inv) return; originalInvoiceState = JSON.parse(JSON.stringify(inv)); editingInvoice = JSON.parse(JSON.stringify(inv)); document.getElementById('editInvId').value = editingInvoice.id; document.getElementById('editInvName').value = editingInvoice.customer; document.getElementById('editInvPhone').value = editingInvoice.phone||''; window.renderEditInvoiceItems(); document.getElementById('invoiceEditModal').style.display = 'flex'; };
window.closeInvoiceEditModal = function() { document.getElementById('invoiceEditModal').style.display = 'none'; editingInvoice = null; originalInvoiceState = null; };
window.renderEditInvoiceItems = function() {
    const tbody = document.getElementById('editInvItemsList'); let total = 0; let totalRiel = 0; let fHtml = '';
    editingInvoice.items.forEach((item, index) => { 
        let lineTotal = item.price * item.cartQty; total += lineTotal; let lineTotalRiel = (item.riel||0) * item.cartQty; totalRiel += lineTotalRiel; 
        let pStr = item.price > 0 ? window.fMoney(item.price) : (item.riel ? Number(item.riel).toLocaleString()+'៛' : '$0.00'); 
        let tStr = item.price > 0 ? window.fMoney(lineTotal) : (item.riel ? Number(lineTotalRiel).toLocaleString()+'៛' : '$0.00'); 
        fHtml += `<tr><td style="padding: 10px 0;">${item.name} <br><span style="color:var(--text-muted); font-size:var(--fs-11);">${pStr}/${item.unit||'ឯកតា'}</span></td><td style="text-align: center;"><div style="display:flex; justify-content:center; align-items:center; gap:5px; background:var(--bg-dark); padding:2px; border-radius:6px; border:1px solid var(--border); width:max-content; margin:auto;"><button class="qty-btn" onclick="window.updateEditInvQty(${index}, -1)" style="width:20px; height:20px; font-size:var(--fs-12);"> - </button><span style="font-size:var(--fs-13); font-weight:bold; width:20px; text-align:center;">${item.cartQty}</span><button class="qty-btn" onclick="window.updateEditInvQty(${index}, 1)" style="width:20px; height:20px; font-size:var(--fs-12);"> + </button></div></td><td style="text-align: right; color:var(--text-muted);">${pStr}</td><td style="text-align: right; font-weight:bold; color:var(--success);">${tStr}</td><td style="text-align: center;"><button class="btn-danger" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="window.removeEditInvItem(${index})">🗑️</button></td></tr>`; 
    });
    tbody.innerHTML = fHtml || '<tr><td colspan="5" style="text-align:center; padding: 20px;">មិនមានទំនិញទេ</td></tr>';
    editingInvoice.totalAmount = total; editingInvoice.totalRiel = totalRiel; document.getElementById('editInvTotalPreview').innerHTML = `${window.fMoney(total)} ${totalRiel > 0 ? `<br><span style="font-size:14px; color:var(--text-muted);">${Number(totalRiel).toLocaleString()} ៛</span>` : ''}`;
};
window.updateEditInvQty = function(index, change) { const item = editingInvoice.items[index]; const realItem = inventory.find(i => i.id === item.id); const origItem = originalInvoiceState.items.find(i => i.id === item.id); const maxAllowed = realItem ? (realItem.qty + (origItem?origItem.cartQty:0)) : (origItem?origItem.cartQty:0); if(change > 0 && item.cartQty >= maxAllowed) return window.ksMsg('ស្តុកមិនគ្រប់គ្រាន់ទេ!'); item.cartQty += change; if(item.cartQty <= 0) editingInvoice.items.splice(index, 1); window.renderEditInvoiceItems(); };
window.removeEditInvItem = function(index) { editingInvoice.items.splice(index, 1); window.renderEditInvoiceItems(); };
window.addItemToEditingInvoice = function() { const select = document.getElementById('editInvAddItemSelect'); const itemId = select.value; if(!itemId) return; const realItem = inventory.find(i => i.id === itemId); if(!realItem || realItem.qty <= 0) return window.ksMsg('ទំនិញនេះអស់ពីស្តុកហើយ!'); const existIdx = editingInvoice.items.findIndex(i => i.id === itemId); if(existIdx !== -1) window.updateEditInvQty(existIdx, 1); else { editingInvoice.items.push({...realItem, cartQty: 1}); window.renderEditInvoiceItems(); } select.value = ''; };
window.saveInvoiceChanges = function() { 
    const newName = document.getElementById('editInvName').value.trim(); const newPhone = document.getElementById('editInvPhone').value.trim(); if(!newName) return window.ksMsg("សូមបញ្ចូលឈ្មោះអតិថិជន!"); if(editingInvoice.items.length === 0) return window.ksMsg("វិក្កយបត្រត្រូវតែមានទំនិញយ៉ាងហោចណាស់១!"); 
    const origMap = {}; originalInvoiceState.items.forEach(i => origMap[i.id] = i.cartQty); const newMap = {}; editingInvoice.items.forEach(i => newMap[i.id] = i.cartQty); 
    new Set([...Object.keys(origMap), ...Object.keys(newMap)]).forEach(itemId => { const diff = (newMap[itemId]||0) - (origMap[itemId]||0); if(diff !== 0) { const invItem = inventory.find(p => p.id === itemId); if(invItem) { invItem.qty -= diff; window.logAction('update', invItem.name, Math.abs(diff), diff > 0 ? `បន្ថែមទៅវិក្កយបត្រជំពាក់ ${newName}` : `ដកចេញពីវិក្កយបត្រជំពាក់ ${newName}`); } } }); 
    const targetInvoice = invoices.find(i => i.id === editingInvoice.id); if(targetInvoice) { targetInvoice.customer = newName; targetInvoice.phone = newPhone; targetInvoice.items = [...editingInvoice.items]; targetInvoice.totalAmount = editingInvoice.totalAmount; targetInvoice.totalRiel = editingInvoice.totalRiel; window.logAction('update', newName, 'កែប្រែទិន្នន័យវិក្កយបត្រ'); } 
    window.autoRegisterCustomer(newName, newPhone); window.saveData(); window.closeInvoiceEditModal(); window.ksMsg("វិក្កយបត្រត្រូវបានកែប្រែជោគជ័យ!", "ជោគជ័យ"); window.renderUnpaid(); 
};
window.populateEditInvoiceSelect = function() { const select = document.getElementById('editInvAddItemSelect'); if(!select) return; let opts = '<option value="">-- ជ្រើសរើសទំនិញបន្ថែម --</option>'; inventory.forEach(p => { if(p.qty > 0) opts += `<option value="${p.id}">${p.name} (${window.fMoney(p.price)} | ស្តុក: ${p.qty} ${p.unit||''})</option>`; }); select.innerHTML = opts; };

window.renderHistory = function() {
    const searchVal = document.getElementById('historySearch') ? document.getElementById('historySearch').value.toLowerCase() : ''; 
    const dateFrom = document.getElementById('historyDateFrom'); const dateTo = document.getElementById('historyDateTo'); 
    const fromTime = (dateFrom && dateFrom.value) ? new Date(dateFrom.value).setHours(0,0,0,0) : 0; const toTime = (dateTo && dateTo.value) ? new Date(dateTo.value).setHours(23,59,59,999) : Infinity; 
    let fHtml = '';
    historyLog.filter(h => (String(h.itemName).toLowerCase().includes(searchVal) || (h.note && String(h.note).toLowerCase().includes(searchVal))) && (h.id >= fromTime && h.id <= toTime)).forEach(h => { 
        let tName = h.type === 'sale' ? 'លក់ចេញ' : (h.type === 'add' ? 'នាំចូលថ្មី/បន្ថែម' : 'កែប្រែទិន្នន័យ'); 
        let bClass = h.type === 'sale' ? 'badge-sale' : (h.type === 'add' ? 'badge-add' : 'badge-update'); 
        let catStr = '-', unitStr = ''; const pItem = inventory.find(i => i.name === h.itemName); if(pItem) { catStr = pItem.category||'-'; unitStr = pItem.unit ? ' '+pItem.unit : ''; }
        let qtyDisplay = h.qty === 0 ? '0' : `${h.qty > 0 ? '+' : (h.type === 'sale'?'-':'')}${Math.abs(h.qty)}${unitStr}`; 
        fHtml += `<tr><td data-sort="${h.id}" style="font-size:var(--fs-12); color:var(--text-muted);">${h.date}</td><td data-sort="${tName}"><span class="badge ${bClass}">${tName}</span></td><td data-sort="${h.itemName}" style="font-weight:bold; color:var(--text-main);">${h.itemName}</td><td data-sort="${catStr}" style="font-size:var(--fs-12); color:var(--text-muted);">${catStr}</td><td data-sort="${h.qty}" style="font-weight:bold; color:${h.type === 'sale' ? 'var(--warning)' : (h.qty > 0 ? 'var(--success)' : 'var(--text-main)')};">${qtyDisplay}</td><td data-sort="${h.note||''}" style="font-size:var(--fs-12);">${h.note||''}</td></tr>`; 
    });
    document.getElementById('historyTable').innerHTML = fHtml || '<tr><td colspan="6" style="text-align:center;">មិនមានប្រវត្តិទិន្នន័យតាមការស្វែងរកទេ</td></tr>'; setTimeout(() => window.filterTable('mainHistoryTable'), 50);
};
window.clearHistory = function() { window.ksMsg('តើអ្នកពិតជាចង់លុបប្រវត្តិប្រតិបត្តិការទាំងអស់មែនទេ?', 'បញ្ជាក់ការលុប', true, () => { historyLog = []; window.saveData(); }); };

window.exportCSV = function() {
    let csv = '\uFEFFID,ឈ្មោះទំនិញ,ប្រភេទ,តម្លៃដើម,តម្លៃលក់(USD),តម្លៃលក់(រៀល),ខ្នាត,ស្តុកសរុប,ការពណ៌នា\n';
    let targetInv = inventory;
    if (currentInventoryView === 'list' && document.getElementById("mainInventoryTable")) {
         let rows = Array.from(document.getElementById("mainInventoryTable").getElementsByTagName("tbody")[0].rows).filter(row => row.style.display !== 'none');
         if(rows.length === 0 || (rows.length === 1 && rows[0].cells.length === 1)) return window.ksMsg('គ្មានទិន្នន័យដើម្បីទាញយកទេ!');
         targetInv = rows.map(r => inventory.find(i => i.id === r.getAttribute('data-id'))).filter(i => i);
    }
    if(!targetInv.length) return window.ksMsg('គ្មានទិន្នន័យដើម្បីទាញយកទេ!'); 
    targetInv.forEach(p => { csv += `${p.id},"${String(p.name||'').replace(/"/g, '""')}","${p.category||''}",${p.cost||0},${p.price||0},${p.riel||0},"${String(p.unit||'').replace(/"/g, '""')}",${p.qty||0},"${String(p.desc||'').replace(/"/g, '""').replace(/\n/g, ' ')}"\n`; });
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = `Inventory_Report_${Date.now()}.csv`; a.click();
};

window.importCSV = function(e) {
    const file = e.target.files[0]; if (!file) return; const r = new FileReader();
    r.onload = (ev) => {
        const lines = ev.target.result.split('\n'); let count = 0;
        for(let i=1; i<lines.length; i++) {
            const row = lines[i].trim().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); if(row.length >= 8) {
                const id = row[0].replace(/(^"|"$)/g, '').trim(); const name = row[1].replace(/(^"|"$)/g, '').trim(); if(!name) continue; 
                const existing = inventory.find(p => p.id === id || p.name === name);
                let d = { name: name, category: row[2].replace(/(^"|"$)/g, '').trim(), cost: parseFloat(row[3])||0, price: parseFloat(row[4])||0, riel: parseFloat(row[5])||0, unit: row[6]?row[6].replace(/(^"|"$)/g, '').trim():'', qty: parseInt(row[7])||0, desc: row[8]?row[8].replace(/(^"|"$)/g, '').trim():'' };
                if(existing) { Object.assign(existing, d); } else { d.id = id || 'P_'+Date.now()+count; d.customId = d.id; d.image = ''; inventory.push(d); } count++;
            }
        } window.saveData(); window.ksMsg(`បាននាំចូលទិន្នន័យពី Excel ចំនួន ${count} មុខ!`, 'ជោគជ័យ');
    }; r.readAsText(file); e.target.value = '';
};

window.exportData = function() { 
    const dataToBackup = { inventory, historyLog, invoices, expenses, shopName, shopLogo, shopQR, shopPhone, shopAddress, customers, sysSettings, userAccounts, invoiceCounter: JSON.parse(localStorage.getItem(getBranchKey('invoice_counter'))) }; 
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(dataToBackup)], { type: "application/json" })); a.download = `SKM_INTEGRATE_${SHOP_BRANCH_ID}_Backup.json`; a.click(); 
};

window.importData = function(e) {
    const file = e.target.files[0]; if (!file) return; const r = new FileReader();
    r.onload = (ev) => {
        try {
            const data = JSON.parse(ev.target.result);
            if(data.inventory) { 
                inventory = data.inventory||[]; historyLog = data.historyLog||[]; invoices = data.invoices||[]; customers = data.customers||[]; expenses = data.expenses||[];
                if(data.shopName) shopName = data.shopName; if(data.shopLogo) shopLogo = data.shopLogo; if(data.shopQR) shopQR = data.shopQR; if(data.shopPhone) shopPhone = data.shopPhone; if(data.shopAddress) shopAddress = data.shopAddress;
                if(data.sysSettings) sysSettings = data.sysSettings; if(data.userAccounts) userAccounts = data.userAccounts; 
                if(data.invoiceCounter) localStorage.setItem(getBranchKey('invoice_counter'), JSON.stringify(data.invoiceCounter));
            } else if(Array.isArray(data)) inventory = data;
            window.saveData(); localStorage.setItem(getBranchKey('auth_users_pro'), JSON.stringify(userAccounts)); document.getElementById('displayShopName').innerHTML = `${shopName} <i id="editShopIcon" style="font-size:var(--fs-12); color:var(--text-muted); font-style: normal;">✏️</i>`; if(shopLogo) { document.getElementById('sidebarLogo').src = shopLogo; document.getElementById('sidebarLogo').style.display = 'block'; }
            window.loadSettingsToUI(); window.applyPermissions(); window.ksMsg('ទិន្នន័យទាំងអស់ត្រូវបាន Restore ជោគជ័យ!', 'ជោគជ័យ');
        } catch(err) { window.ksMsg('ឯកសារមិនត្រឹមត្រូវតាមទម្រង់ទេ!', 'បរាជ័យ'); } e.target.value = '';
    }; r.readAsText(file);
};

window.exportCustomers = function() { if(!customers.length) return window.ksMsg('គ្មានទិន្នន័យអតិថិជនដើម្បី Export ទេ!'); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(customers, null, 2)], { type: "application/json" })); a.download = `Customers_Backup_${Date.now()}.json`; a.click(); };
window.importCustomers = function(e) { const file = e.target.files[0]; if (!file) return; const r = new FileReader(); r.onload = (ev) => { try { const data = JSON.parse(ev.target.result); if(Array.isArray(data)) { let cCount = 0; data.forEach(newCust => { if(!customers.find(c => String(c.name).toLowerCase() === String(newCust.name).toLowerCase())) { customers.push({ id: newCust.id||'C_'+Date.now()+Math.random(), name: newCust.name, phone: newCust.phone||'' }); cCount++; } }); window.saveData(); window.ksMsg(`បាននាំចូលអតិថិជនថ្មីចំនួន ${cCount} នាក់!`, 'ជោគជ័យ'); } else window.ksMsg('ទម្រង់ឯកសារមិនត្រឹមត្រូវទេ!', 'បរាជ័យ'); } catch(err) { window.ksMsg('មិនអាចអានឯកសារបានទេ!', 'បរាជ័យ'); } e.target.value = ''; }; r.readAsText(file); };

window.toggleLowStockSection = function() {
    const container = document.getElementById('lowStockCardContainer');
    if (!container) return;
    if (container.style.display === 'none') {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
};