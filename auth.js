/**
 * auth.js - គ្រប់គ្រងការចូលប្រព័ន្ធ សុវត្ថិភាព និងគណនីបុគ្គលិក (Multi-Device Auto-Sync & Security Hardened Edition)
 * ធានាថារាល់ឧបករណ៍ទាំងអស់ (ទូរស័ព្ទ/កុំព្យូទ័រ/App) ស្គាល់គណនីដូចគ្នា មានការ Hash ពាក្យសម្ងាត់ SHA-256
 * និងការពារការចូលផ្ទាំង Admin Settings ដោយគ្មានសិទ្ធិ
 */

function getSafeBranchKey(key) {
    if (typeof window.getBranchKey === 'function' && window.getBranchKey !== getSafeBranchKey) {
        return window.getBranchKey(key);
    }
    const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    return `ks2_${branchId}_${key}`;
}
window.getBranchKey = getSafeBranchKey;

// 🔐 Pure-JS SHA-256 (ដំណើរការគ្រប់ទីកន្លែងទាំង HTTPS, HTTP LAN IP, Offline & Android WebView)
window.skmSha256 = function(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    const lengthProperty = 'length';
    let i, j, result = '';
    const words = [];
    const asciiBitLength = ascii[lengthProperty] * 8;
    let hash = window.skmSha256._h = window.skmSha256._h || [];
    const k = window.skmSha256._k = window.skmSha256._k || [];
    let primeCounter = k[lengthProperty];
    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
            hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }
    hash = hash.slice(0);
    // UTF-8 encode so Khmer characters hash identically across browsers
    const utf8 = unescape(encodeURIComponent(String(ascii)));
    const bitLen = utf8.length * 8;
    let padded = utf8 + '\x80';
    while (padded.length % 64 - 56) padded += '\x00';
    for (i = 0; i < padded.length; i++) {
        j = padded.charCodeAt(i);
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words.length] = ((bitLen / maxWord) | 0);
    words[words.length] = (bitLen | 0);
    for (j = 0; j < words.length;) {
        const w = words.slice(j, j += 16);
        const oldHash = hash;
        hash = hash.slice(0, 8);
        for (i = 0; i < 64; i++) {
            const w15 = w[i - 15], w2 = w[i - 2];
            const a = hash[0], e = hash[4];
            const temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                + ((e & hash[5]) ^ ((~e) & hash[6]))
                + k[i]
                + (w[i] = (i < 16) ? w[i] : (
                    w[i - 16]
                    + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                    + w[i - 7]
                    + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                ) | 0);
            const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
            hash = [(temp1 + temp2) | 0].concat(hash);
            hash[4] = (hash[4] + temp1) | 0;
        }
        for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            const b = (hash[i] >> (j * 8)) & 255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};

window.skmHashPassword = function(plain) {
    const raw = String(plain || '');
    if (!raw) return '';
    if (raw.startsWith('sha256:')) return raw;
    const salt = window.SECRET_SALT || 'KOUSUKE_ERP_PRO_V1_';
    return 'sha256:' + window.skmSha256(salt + raw);
};

window.skmVerifyPassword = function(inputPlain, storedPass) {
    const inp = String(inputPlain || '');
    const stored = String(storedPass || '');
    if (!stored) return false;
    if (stored.startsWith('sha256:')) {
        return window.skmHashPassword(inp) === stored;
    }
    return stored === inp;
};

window.skmComputeAdminSig = function(userObj, branchId) {
    if (!userObj || String(userObj.role).toLowerCase() !== 'admin') return '';
    const br = branchId || window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    const salt = window.SECRET_SALT || 'KOUSUKE_ERP_PRO_V1_';
    return window.skmSha256(`ADM_SIG|${salt}|${br}|${userObj.id}|${userObj.username}|${userObj.password}`);
};

function isStrictHashEnabled() {
    try {
        return Boolean(window.sysSettings && window.sysSettings.proFeatures && window.sysSettings.proFeatures.strictAdminAuth);
    } catch (e) { return false; }
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
window.activeUser = JSON.parse(localStorage.getItem(getSafeBranchKey('active_user_obj')) || sessionStorage.getItem(getSafeBranchKey('active_user_obj')) || 'null'); 
window.currentRole = window.activeUser ? window.activeUser.role : 'guest';

// 🌟 មុខងាររុញគណនីបុគ្គលិកទៅកាន់ Column user_accounts ក្នុង Supabase ដោយផ្ទាល់
async function syncUsersToCloud() {
    const key = getSafeBranchKey('auth_users_pro');
    localStorage.setItem(key, JSON.stringify(window.userAccounts));

    if (window.supabaseClient && navigator.onLine) {
        try {
            const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
            await window.supabaseClient.from('branch_store').upsert({
                branch_id: branchId,
                user_accounts: window.userAccounts,
                updated_at: new Date().toISOString()
            }, { onConflict: 'branch_id' });
            console.log('☁️ គណនីបុគ្គលិកត្រូវបាន Sync ទៅ Column user_accounts ក្នុង Cloud រួចរាល់!');
        } catch (err) {
            console.warn('⚠️ កំហុសពេល Sync គណនីទៅ Cloud:', err);
        }
    }
}

// 🌟 មុខងារទាញយកគណនីពី Column user_accounts ក្នុង Cloud មកដាក់ក្នុងឧបករណ៍
window.syncUsersFromCloud = async function() {
    if (!window.supabaseClient || !navigator.onLine) return;
    try {
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        const key = getSafeBranchKey('auth_users_pro');
        const { data, error } = await window.supabaseClient
            .from('branch_store')
            .select('user_accounts')
            .eq('branch_id', branchId)
            .maybeSingle();

        if (!error && data && data.user_accounts) {
            let cloudUsers = data.user_accounts;
            if (typeof cloudUsers === 'string') {
                try { cloudUsers = JSON.parse(cloudUsers); } catch(e) {}
            }
            if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
                window.userAccounts = cloudUsers;
                localStorage.setItem(key, JSON.stringify(window.userAccounts));
                if (typeof window.renderUsersList === 'function') window.renderUsersList();
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
    if (typeof window.syncUsersFromCloud === 'function') {
        window.syncUsersFromCloud();
    }

    const isDesktopApp = Boolean(window.SKMDesktopBridge && window.SKMDesktopBridge.isDesktopApp);
    const authPassed = sessionStorage.getItem('ks2_auth_passed');
    if ((window.activeUser || isDesktopApp) && authPassed !== 'true') {
        sessionStorage.setItem('ks2_auth_passed', 'true');
    } else if (authPassed !== 'true') {
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
        const remUser = localStorage.getItem(getSafeBranchKey('remembered_username'));
        const uInp = document.getElementById('loginUsername');
        const remChk = document.getElementById('rememberMe');
        if (remUser && uInp && !uInp.value) uInp.value = remUser;
        if (remChk) remChk.checked = Boolean(remUser);
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

        // Refresh admin session signature if active user is verified admin
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        if (String(window.activeUser.role).toLowerCase() === 'admin') {
            const matched = (window.userAccounts || []).find(
                u => u && u.id === window.activeUser.id && String(u.role).toLowerCase() === 'admin' && String(u.password) === String(window.activeUser.password)
            );
            if (matched) {
                sessionStorage.setItem(`skm_admin_sig_${branchId}`, window.skmComputeAdminSig(matched, branchId));
            }
        } else {
            sessionStorage.removeItem(`skm_admin_sig_${branchId}`);
        }
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
        x => x && String(x.username).toLowerCase() === u.toLowerCase() && window.skmVerifyPassword(p, x.password)
    );
    
    if (foundUser) { 
        // Auto-upgrade plaintext password to SHA-256 hash when Strict Auth is enabled
        if (isStrictHashEnabled() && !String(foundUser.password).startsWith('sha256:')) {
            foundUser.password = window.skmHashPassword(p);
            await syncUsersToCloud();
        }

        window.activeUser = foundUser; 
        window.currentRole = foundUser.role; 
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        if (String(foundUser.role).toLowerCase() === 'admin') {
            sessionStorage.setItem(`skm_admin_sig_${branchId}`, window.skmComputeAdminSig(foundUser, branchId));
        } else {
            sessionStorage.removeItem(`skm_admin_sig_${branchId}`);
        }

        const rememberChecked = document.getElementById('rememberMe')?.checked;
        if (rememberChecked) {
            localStorage.setItem(getSafeBranchKey('active_user_obj'), JSON.stringify(window.activeUser));
            localStorage.setItem(getSafeBranchKey('remembered_username'), foundUser.username);
            sessionStorage.removeItem(getSafeBranchKey('active_user_obj'));
        } else {
            sessionStorage.setItem(getSafeBranchKey('active_user_obj'), JSON.stringify(window.activeUser));
            localStorage.removeItem(getSafeBranchKey('active_user_obj'));
            localStorage.removeItem(getSafeBranchKey('remembered_username'));
        } 
        
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
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        window.activeUser = null; 
        window.currentRole = 'guest';
        localStorage.removeItem(getSafeBranchKey('active_user_obj')); 
        sessionStorage.removeItem(getSafeBranchKey('active_user_obj')); 
        sessionStorage.removeItem('ks2_auth_passed');
        sessionStorage.removeItem(`skm_admin_sig_${branchId}`);

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
        window.userAccounts[userIndex].password = isStrictHashEnabled() ? window.skmHashPassword(newP) : newP; 
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
    if (userIndex !== -1 && window.skmVerifyPassword(oldP, window.userAccounts[userIndex].password)) { 
        const storedNew = isStrictHashEnabled() ? window.skmHashPassword(newP) : newP;
        window.userAccounts[userIndex].password = storedNew; 
        window.activeUser.password = storedNew;
        if (localStorage.getItem(getSafeBranchKey('active_user_obj'))) {
            localStorage.setItem(getSafeBranchKey('active_user_obj'), JSON.stringify(window.activeUser));
        } else {
            sessionStorage.setItem(getSafeBranchKey('active_user_obj'), JSON.stringify(window.activeUser));
        }
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        if (String(window.activeUser.role).toLowerCase() === 'admin') {
            sessionStorage.setItem(`skm_admin_sig_${branchId}`, window.skmComputeAdminSig(window.activeUser, branchId));
        }
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
        const hashBadge = String(u.password || '').startsWith('sha256:')
            ? ' <span title="ពាក្យសម្ងាត់ត្រូវបានបំលែងកូដសុវត្ថិភាព SHA-256" style="font-size:10px; color:#10b981;">🔐</span>'
            : '';
        let deleteBtn = `<button class="btn-danger" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="window.deleteUserAccount('${u.id}')">${d.btnDelete || '🗑️ លុប'}</button>`; 
        let editBtn = `<button class="btn-outline" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer; color:var(--warning);" onclick="window.editUserAccount('${u.id}')">${d.btnEdit || '✏️ កែប្រែ'}</button>`; 
        if (u.username === 'admin') deleteBtn = `<span style="color:var(--text-muted); font-size:var(--fs-11);">${d.cantDeleteAdmin || 'មិនអាចលុប'}</span>`; 
        return `<tr><td data-sort="${u.fullName||''}"><span style="font-weight:bold;">${u.fullName||'-'}</span>${hashBadge}</td><td data-sort="${u.username}"><span style="color:var(--primary);">${u.username}</span></td><td data-sort="${u.role}">${badge}</td><td data-sort="${u.pin||''}"><span style="background:rgba(128,128,128,0.1); padding:2px 5px; border-radius:4px; font-family:monospace; letter-spacing:2px;">${u.pin||'0000'}</span></td><td style="text-align: center;"><div style="display: inline-flex; gap: 5px; justify-content: center;">${editBtn}${deleteBtn}</div></td></tr>`; 
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
    const passEl = document.getElementById('nuPassword');
    passEl.value = '';
    passEl.placeholder = 'លេខកូដសម្ងាត់...';
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
    const passEl = document.getElementById('nuPassword');
    if (String(u.password || '').startsWith('sha256:')) {
        passEl.value = '';
        passEl.placeholder = '🔐 ទុកទទេបើមិនចង់ប្តូរលេខសម្ងាត់';
    } else {
        passEl.value = u.password || '';
        passEl.placeholder = 'លេខកូដសម្ងាត់...';
    }
    document.getElementById('nuPin').value = u.pin || ''; 
    document.getElementById('nuRole').value = u.role; 
    document.getElementById('adminConfirmPassword').value = ''; 
    document.getElementById('nuUsername').disabled = (u.username === 'admin'); 
    document.getElementById('userManageModal').style.display = 'flex'; 
};

window.closeUserModal = function() { 
    document.getElementById('userManageModal').style.display = 'none'; 
};

window.saveNewUser = async function() {
    const editId = document.getElementById('editUserId').value; 
    const fname = document.getElementById('nuFullName').value.trim(); 
    const uname = document.getElementById('nuUsername').value.trim(); 
    const pass = document.getElementById('nuPassword').value.trim(); 
    const pin = document.getElementById('nuPin').value.trim() || '0000'; 
    let role = document.getElementById('nuRole').value; 
    const adminPass = document.getElementById('adminConfirmPassword').value.trim(); 

    if (!uname || (!editId && !pass) || !role || !adminPass) {
        return notifyAuthUser('សូមបំពេញព័ត៌មានដែលចាំបាច់ និងបញ្ជាក់លេខកូដ Admin របស់អ្នក!', 'ជូនដំណឹង', true);
    }

    if (typeof window.syncUsersFromCloud === 'function') {
        await window.syncUsersFromCloud();
    }
    window.userAccounts = loadLocalUsers();

    const isAdminValid = (window.userAccounts || []).some(
        x => x && (x.role === 'admin' || x.username === 'admin') && window.skmVerifyPassword(adminPass, x.password)
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

    const shouldHash = isStrictHashEnabled();

    if (editId) { 
        const existingUser = (window.userAccounts || []).find(x => x && x.id === editId); 
        if (!existingUser) return;
        if (existingUser.username === 'admin' && role !== 'admin') {
            return notifyAuthUser('គណនី admin ដើម មិនអាចដកសិទ្ធិជា admin វិញបានទេ!', 'បម្រាម', true); 
        }
        existingUser.fullName = fname; 
        existingUser.username = uname; 
        if (pass) {
            existingUser.password = shouldHash ? window.skmHashPassword(pass) : pass;
        }
        existingUser.pin = pin; 
        existingUser.role = role; 
        if (window.activeUser && existingUser.id === window.activeUser.id) { 
            window.activeUser = existingUser; 
            if (localStorage.getItem(getSafeBranchKey('active_user_obj'))) {
                localStorage.setItem(getSafeBranchKey('active_user_obj'), JSON.stringify(window.activeUser)); 
            } else {
                sessionStorage.setItem(getSafeBranchKey('active_user_obj'), JSON.stringify(window.activeUser));
            }
            const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
            if (String(existingUser.role).toLowerCase() === 'admin') {
                sessionStorage.setItem(`skm_admin_sig_${branchId}`, window.skmComputeAdminSig(existingUser, branchId));
            }
        } 
        notifyAuthUser('គណនីត្រូវបានកែប្រែដោយជោគជ័យ!', 'ជោគជ័យ'); 
    } else { 
        window.userAccounts.push({ 
            id: 'U_' + Date.now(), 
            username: uname, 
            password: shouldHash ? window.skmHashPassword(pass) : pass, 
            role: role, 
            pin: pin, 
            fullName: fname 
        }); 
        notifyAuthUser(`គណនី ${uname} ត្រូវបានបង្កើតដោយជោគជ័យ!`, 'ជោគជ័យ'); 
    }

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof window.syncUsersFromCloud === 'function') window.syncUsersFromCloud();
    });
} else {
    if (typeof window.syncUsersFromCloud === 'function') window.syncUsersFromCloud();
}
