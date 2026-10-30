/**
 * auth.js - គ្រប់គ្រងការចូលប្រព័ន្ធ សុវត្ថិភាព និងគណនីបុគ្គលិក (Multi-Device Auto-Sync Edition)
 * ធានាថារាល់ឧបករណ៍ទាំងអស់ (ទូរស័ព្ទ/កុំព្យូទ័រ) ស្គាល់គណនីដូចគ្នា និង Login បាន ១០០%
 */

// 🌟 អនុគមន៍សុវត្ថិភាពសម្រាប់ទាញយក Branch Key
function getSafeBranchKey(key) {
    if (typeof window.getBranchKey === 'function') {
        return window.getBranchKey(key);
    }
    const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    return `ks2_${branchId}_${key}`;
}
if (typeof window.getBranchKey !== 'function') {
    window.getBranchKey = getSafeBranchKey;
}

// ទាញយកគណនីពី LocalStorage
function loadLocalUsers() {
    try {
        const raw = localStorage.getItem(getSafeBranchKey('auth_users_pro'));
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch(e) {}
    return [ 
        { id: 'U_ADMIN', username: 'admin', password: '123', pin: '0000', role: 'admin', fullName: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ' } 
    ];
}

window.userAccounts = loadLocalUsers();
window.activeUser = JSON.parse(localStorage.getItem(getSafeBranchKey('active_user_obj'))) || null; 
window.currentRole = window.activeUser ? window.activeUser.role : 'guest';

// 🌟 មុខងាររុញគណនីទាំងអស់ទៅកាន់ Supabase Cloud
async function syncUsersToCloud() {
    const key = getSafeBranchKey('auth_users_pro');
    localStorage.setItem(key, JSON.stringify(window.userAccounts));

    if (window.supabaseClient && navigator.onLine) {
        try {
            const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
            const { data } = await window.supabaseClient
                .from('branch_store')
                .select('data_json')
                .eq('branch_id', branchId)
                .maybeSingle();

            let payload = (data && data.data_json) ? data.data_json : {};
            payload[key] = window.userAccounts;

            await window.supabaseClient.from('branch_store').upsert({
                branch_id: branchId,
                data_json: payload,
                updated_at: new Date().toISOString()
            });
            console.log('☁️ គណនីបុគ្គលិកត្រូវបាន Sync ទៅ Cloud រួចរាល់!');
        } catch (err) {
            console.warn('⚠️ កំហុសពេល Sync គណនីទៅ Cloud:', err);
        }
    }
}

// 🌟 មុខងារទាញយកគណនីពី Cloud មកដាក់ក្នុងឧបករណ៍ផ្សេងៗ
window.syncUsersFromCloud = async function() {
    if (!window.supabaseClient || !navigator.onLine) return;
    try {
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        const key = getSafeBranchKey('auth_users_pro');
        const { data, error } = await window.supabaseClient
            .from('branch_store')
            .select('data_json')
            .eq('branch_id', branchId)
            .maybeSingle();

        if (!error && data && data.data_json && data.data_json[key]) {
            let cloudUsers = data.data_json[key];
            if (typeof cloudUsers === 'string') {
                try { cloudUsers = JSON.parse(cloudUsers); } catch(e) {}
            }
            if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
                window.userAccounts = cloudUsers;
                localStorage.setItem(key, JSON.stringify(window.userAccounts));
                if (typeof window.renderUsersList === 'function') window.renderUsersList();
                console.log('✅ បានទាញយកគណនីពី Cloud មកឧបករណ៍នេះជោគជ័យ!');
            }
        }
    } catch (err) {
        console.warn('⚠️ មិនអាចទាញយកគណនីពី Cloud:', err);
    }
};

function notifyAuthUser(msg, title = 'ជូនដំណឹង', isError = false) {
    if (typeof window.ksMsg === 'function') {
        window.ksMsg(msg, title);
    } else if (typeof window.showToast === 'function') {
        window.showToast(msg, isError);
    } else {
        alert(msg);
    }
}

window.checkAuthentication = function(applyPermissionsCallback) {
    // Sync គណនីពី Cloud ជានិច្ចពេលឆែក Auth
    if (typeof window.syncUsersFromCloud === 'function') {
        window.syncUsersFromCloud();
    }

    const authPassed = sessionStorage.getItem('ks2_auth_passed');
    if (authPassed !== 'true') {
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        if (window.location.protocol !== 'blob:' && window.location.protocol !== 'data:' && window.location.protocol !== 'file:') {
            window.location.href = `welcome.html?branch=${encodeURIComponent(branchId)}`;
            return;
        }
    }

    const authScreen = document.getElementById('authScreen');
    const loginForm = document.getElementById('loginForm');
    const forgotPassForm = document.getElementById('forgotPassForm');

    if (!window.activeUser) { 
        if (authScreen) authScreen.style.display = 'flex'; 
        if (loginForm) loginForm.style.display = 'block'; 
        if (forgotPassForm) forgotPassForm.style.display = 'none'; 
        window.currentRole = 'guest';
    } else { 
        if (authScreen) authScreen.style.display = 'none'; 
        let sName = window.activeUser.fullName ? window.activeUser.fullName : window.activeUser.username; 
        if (document.getElementById('currentUserDisplay')) {
            document.getElementById('currentUserDisplay').innerHTML = `<span>👤</span> ${sName}`; 
        }
        const posSeller = document.getElementById('posCurrentSellerDisplay'); 
        if (posSeller) posSeller.innerText = sName; 
        
        let roleIcon = window.activeUser.role === 'admin' ? '👑 Admin' : 
                       (window.activeUser.role === 'manager' ? '💼 Manager' : 
                       (window.activeUser.role === 'sales' ? '🛒 Sales' : '📦 Warehouse')); 
                       
        if (document.getElementById('sidebarUserRoleDisplay')) {
            document.getElementById('sidebarUserRoleDisplay').innerText = roleIcon; 
        }
        window.currentRole = window.activeUser.role; 
    }

    if (typeof applyPermissionsCallback === 'function') {
        applyPermissionsCallback();
    } else if (typeof window.applyPermissions === 'function') {
        window.applyPermissions();
    }
};

window.handleLogin = async function() {
    const uInput = document.getElementById('loginUsername');
    const pInput = document.getElementById('loginPassword');
    if (!uInput || !pInput) return;

    // ទាញយកគណនីពី Cloud មកបង្ហើយមុន Login ការពារឧបករណ៍ទើបបើកថ្មី
    if (typeof window.syncUsersFromCloud === 'function') {
        await window.syncUsersFromCloud();
    }
    window.userAccounts = loadLocalUsers();

    const u = uInput.value.trim(); 
    const p = pInput.value.trim(); 
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

    if (!u || !p) {
        return notifyAuthUser("សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ និងលេខកូដសម្ងាត់!", d.confirmNoticeTitle || "ជូនដំណឹង", true);
    }

    const foundUser = (window.userAccounts || []).find(
        x => x && String(x.username).toLowerCase() === u.toLowerCase() && String(x.password) === p
    );
    
    if (foundUser) { 
        window.activeUser = foundUser; 
        window.currentRole = foundUser.role; 
        localStorage.setItem(getSafeBranchKey('active_user_obj'), JSON.stringify(window.activeUser)); 
        
        uInput.value = ''; 
        pInput.value = ''; 
        
        window.checkAuthentication(); 
        
        if (foundUser.role === 'sales') {
            if (typeof window.switchTab === 'function') window.switchTab('pos', '🛒 ប្រព័ន្ធលក់ (Point of Sale)', document.getElementById('nav-pos'));
        } else if (foundUser.role === 'warehouse') {
            if (typeof window.switchTab === 'function') window.switchTab('inventory', '📦 គ្រប់គ្រងស្តុក (Inventory)', document.getElementById('nav-inventory'));
        } else {
            if (typeof window.switchTab === 'function') window.switchTab('dashboard', '📊 ផ្ទាំងព័ត៌មានទូទៅ (Dashboard)', document.getElementById('nav-dashboard'));
        }

        if (typeof window.renderAll === 'function') window.renderAll();

        notifyAuthUser(
            `សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ, ${foundUser.fullName ? foundUser.fullName : foundUser.username}!`,
            d.successTitle || "ចូលប្រព័ន្ធជោគជ័យ"
        ); 
    } else {
        notifyAuthUser(d.errInvalidPin || "ឈ្មោះ ឬ លេខកូដសម្ងាត់មិនត្រឹមត្រូវទេ!", d.confirmNoticeTitle || "បរាជ័យ", true);
    }
};

window.handleLogout = function() { 
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
    
    const executeLogout = () => {
        window.activeUser = null; 
        window.currentRole = 'guest';
        localStorage.removeItem(getSafeBranchKey('active_user_obj')); 
        sessionStorage.removeItem('ks2_auth_passed');

        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        if (window.location.protocol !== 'blob:' && window.location.protocol !== 'data:' && window.location.protocol !== 'file:') {
            window.location.href = `welcome.html?branch=${encodeURIComponent(branchId)}`;
        } else {
            window.checkAuthentication();
        }
    };

    if (typeof window.ksMsg === 'function') {
        window.ksMsg(d.logoutConfirm || "តើអ្នកពិតជាចង់ចាកចេញពីប្រព័ន្ធមែនទេ?", d.logoutTitle || "បញ្ជាក់ការចាកចេញ", true, executeLogout); 
    } else {
        executeLogout();
    }
};

window.toggleForgotPass = function(show) { 
    const loginForm = document.getElementById('loginForm');
    const forgotForm = document.getElementById('forgotPassForm');
    if (loginForm) loginForm.style.display = show ? 'none' : 'block'; 
    if (forgotForm) forgotForm.style.display = show ? 'block' : 'none'; 
};

window.handleResetPassword = async function() { 
    const u = document.getElementById('resetUsername')?.value.trim() || ''; 
    const pin = document.getElementById('resetPin')?.value.trim() || ''; 
    const newP = document.getElementById('newResetPassword')?.value.trim() || ''; 
    const userIndex = (window.userAccounts || []).findIndex(x => x && String(x.username).toLowerCase() === u.toLowerCase()); 
    
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

    if (!u || !pin) {
        return notifyAuthUser("សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ និងលេខ PIN សម្ងាត់!", d.confirmNoticeTitle || "ជូនដំណឹង", true);
    }

    if (userIndex !== -1 && String(window.userAccounts[userIndex].pin).trim() === pin) { 
        if (!newP) {
            return notifyAuthUser("សូមបញ្ចូលលេខកូដសម្ងាត់ថ្មី!", d.confirmNoticeTitle || "ជូនដំណឹង", true);
        }
        window.userAccounts[userIndex].password = newP; 
        await syncUsersToCloud();

        document.getElementById('resetUsername').value = '';
        document.getElementById('resetPin').value = '';
        document.getElementById('newResetPassword').value = '';

        notifyAuthUser("លេខកូដសម្ងាត់ត្រូវបានប្តូរជោគជ័យ! សូមចូលប្រព័ន្ធម្តងទៀត។", d.successTitle || "ជោគជ័យ"); 
        window.toggleForgotPass(false); 
    } else {
        notifyAuthUser(d.errInvalidPin || "ឈ្មោះ ឬ លេខ PIN សម្ងាត់មិនត្រឹមត្រូវទេ!", d.confirmNoticeTitle || "បរាជ័យ", true);
    }
};

window.handleChangePassword = async function() { 
    const oldP = document.getElementById('chgOldPassword')?.value || ''; 
    const newP = document.getElementById('chgNewPassword')?.value || ''; 
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};

    if (!oldP || !newP) {
        return notifyAuthUser("សូមបំពេញលេខកូដចាស់ និងលេខកូដថ្មីឱ្យបានត្រឹមត្រូវ!", d.confirmNoticeTitle || "ជូនដំណឹង", true);
    }
    if (!window.activeUser) return;

    const userIndex = (window.userAccounts || []).findIndex(x => x && x.username === window.activeUser.username); 
    if (userIndex !== -1 && String(window.userAccounts[userIndex].password) === oldP) { 
        window.userAccounts[userIndex].password = newP; 
        window.activeUser.password = newP;
        localStorage.setItem(getSafeBranchKey('active_user_obj'), JSON.stringify(window.activeUser));
        await syncUsersToCloud();

        document.getElementById('chgOldPassword').value = ''; 
        document.getElementById('chgNewPassword').value = ''; 
        notifyAuthUser("លេខកូដសម្ងាត់របស់អ្នកត្រូវបានផ្លាស់ប្តូរជោគជ័យ!", d.successTitle || "ជោគជ័យ"); 
    } else {
        notifyAuthUser("លេខកូដចាស់មិនត្រឹមត្រូវទេ!", d.confirmNoticeTitle || "បរាជ័យ", true);
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

window.openUserModal = function() { 
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
    document.getElementById('editUserId').value = ''; 
    const titleEl = document.getElementById('userModalTitle');
    if (titleEl) titleEl.innerText = d.modalNewUserTitle || '👤 បង្កើតគណនីបុគ្គលិកថ្មី'; 
    document.getElementById('nuFullName').value = ''; 
    document.getElementById('nuUsername').value = ''; 
    document.getElementById('nuPassword').value = ''; 
    document.getElementById('nuPin').value = ''; 
    document.getElementById('nuRole').value = 'sales'; 
    document.getElementById('adminConfirmPassword').value = ''; 
    document.getElementById('nuUsername').disabled = false; 
    document.getElementById('userManageModal').style.display = 'flex'; 
};

window.editUserAccount = function(id) { 
    const lang = localStorage.getItem('app_lang') || 'km';
    const d = window.sysI18n ? window.sysI18n[lang] || window.sysI18n.km : {};
    const u = (window.userAccounts || []).find(x => x && x.id === id); 
    if (!u) return; 
    document.getElementById('editUserId').value = u.id; 
    const titleEl = document.getElementById('userModalTitle');
    if (titleEl) titleEl.innerText = d.modalEditUserTitle || '✏️ កែប្រែគណនីបុគ្គលិក'; 
    document.getElementById('nuFullName').value = u.fullName || ''; 
    document.getElementById('nuUsername').value = u.username; 
    document.getElementById('nuPassword').value = u.password; 
    document.getElementById('nuPin').value = u.pin || ''; 
    document.getElementById('nuRole').value = u.role; 
    document.getElementById('adminConfirmPassword').value = ''; 
    document.getElementById('nuUsername').disabled = (u.username === 'admin'); 
    document.getElementById('userManageModal').style.display = 'flex'; 
};

window.closeUserModal = function() { 
    document.getElementById('userManageModal').style.display = 'none'; 
};

// 🌟 មុខងារ Save គណនី (ផ្ទៀងផ្ទាត់លេខកូដ Admin ត្រឹមត្រូវ និងរុញទៅ Cloud ភ្លាមៗ)
window.saveNewUser = async function() {
    const editId = document.getElementById('editUserId').value; 
    const fname = document.getElementById('nuFullName').value.trim(); 
    const uname = document.getElementById('nuUsername').value.trim(); 
    const pass = document.getElementById('nuPassword').value.trim(); 
    const pin = document.getElementById('nuPin').value.trim() || '0000'; 
    let role = document.getElementById('nuRole').value; 
    const adminPass = document.getElementById('adminConfirmPassword').value.trim(); 

    if (!uname || !pass || !role || !adminPass) {
        return notifyAuthUser('សូមបំពេញព័ត៌មានដែលចាំបាច់ និងបញ្ជាក់លេខកូដ Admin របស់អ្នក!', 'ជូនដំណឹង', true);
    }

    // ពិនិត្យកូដ Admin ដោយមិនខ្វល់ថា Session បច្ចុប្បន្នជា guest ឬអត់
    const isAdminValid = (window.userAccounts || []).some(
        x => x && (x.role === 'admin' || x.username === 'admin') && String(x.password) === adminPass
    );

    if (!isAdminValid) {
        return notifyAuthUser('លេខកូដសម្ងាត់ Admin មិនត្រឹមត្រូវទេ! ប្រតិបត្តិការត្រូវបានបដិសេធ។', 'បរាជ័យ', true);
    }
    
    const usernameConflict = (window.userAccounts || []).find(
        x => x && String(x.username).toLowerCase() === uname.toLowerCase() && x.id !== editId
    );
    if (usernameConflict) {
        return notifyAuthUser('ឈ្មោះ Login នេះមានអ្នកប្រើប្រាស់រួចហើយ សូមជ្រើសរើសឈ្មោះផ្សេង។', 'បរាជ័យ', true);
    }

    const currentStorePin = (window.sysSettings && window.sysSettings.storePin) ? String(window.sysSettings.storePin).trim() : '1234';
    if (uname.toLowerCase() === 'admin' && pin === currentStorePin) {
        return notifyAuthUser("❌ លេខ PIN របស់ Admin មិនអាចដូចលេខកូដសម្ងាត់ហាង (Store PIN) បានទេ!", "PIN ជាន់គ្នា", true);
    }

    if (editId) { 
        const existingUser = (window.userAccounts || []).find(x => x && x.id === editId); 
        if (!existingUser) return;
        if (existingUser.username === 'admin' && role !== 'admin') {
            return notifyAuthUser('គណនី admin ដើម មិនអាចដកសិទ្ធិជា admin វិញបានទេ!', 'បម្រាម', true); 
        }
        existingUser.fullName = fname; 
        existingUser.username = uname; 
        existingUser.password = pass; 
        existingUser.pin = pin; 
        existingUser.role = role; 
        if (window.activeUser && existingUser.id === window.activeUser.id) { 
            window.activeUser = existingUser; 
            localStorage.setItem(getSafeBranchKey('active_user_obj'), JSON.stringify(window.activeUser)); 
        } 
        notifyAuthUser('គណនីត្រូវបានកែប្រែដោយជោគជ័យ!', 'ជោគជ័យ'); 
    } else { 
        window.userAccounts.push({ 
            id: 'U_' + Date.now(), 
            username: uname, 
            password: pass, 
            role: role, 
            pin: pin, 
            fullName: fname 
        }); 
        notifyAuthUser(`គណនី ${uname} ត្រូវបានបង្កើតដោយជោគជ័យ!`, 'ជោគជ័យ'); 
    }

    // រុញទិន្នន័យឡើង Supabase ភ្លាម
    await syncUsersToCloud();

    window.closeUserModal(); 
    window.renderUsersList();
};

window.deleteUserAccount = async function(id) { 
    const u = (window.userAccounts || []).find(x => x && x.id === id); 
    if (!u) return; 
    if (u.username === 'admin') {
        return notifyAuthUser("មិនអាចលុបគណនី Admin ដើមបានទេ!", "បម្រាម", true); 
    }
    if (window.activeUser && u.id === window.activeUser.id) {
        return notifyAuthUser("មិនអាចលុបគណនីដែលកំពុងប្រើប្រាស់បានទេ!", "បម្រាម", true); 
    }

    const executeDeleteUser = async () => {
        window.userAccounts = (window.userAccounts || []).filter(x => x && x.id !== id); 
        await syncUsersToCloud();
        window.renderUsersList(); 
        notifyAuthUser("គណនីត្រូវបានលុបដោយជោគជ័យ!", "ជោគជ័យ"); 
    };

    if (typeof window.ksMsg === 'function') {
        window.ksMsg(`តើអ្នកពិតជាចង់លុបគណនីបុគ្គលិកឈ្មោះ "${u.fullName || u.username}" មែនទេ?`, "បញ្ជាក់ការលុបគណនី", true, executeDeleteUser); 
    } else {
        await executeDeleteUser();
    }
};

// 🌟 ដំណើរការទាញយកគណនីពី Cloud ភ្លាមៗពេលបើក Page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof window.syncUsersFromCloud === 'function') window.syncUsersFromCloud();
    });
} else {
    if (typeof window.syncUsersFromCloud === 'function') window.syncUsersFromCloud();
}