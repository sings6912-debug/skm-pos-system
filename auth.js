// auth.js
window.userAccounts = JSON.parse(localStorage.getItem(window.getBranchKey('auth_users_pro'))) || [ { id: 'U_ADMIN', username: 'admin', password: '123', pin: '0000', role: 'admin', fullName: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ' } ];
window.activeUser = JSON.parse(localStorage.getItem(window.getBranchKey('active_user_obj'))) || null; 
window.currentRole = window.activeUser ? window.activeUser.role : 'admin';

window.checkAuthentication = function(applyPermissionsCallback) {
    if (!window.activeUser) { 
        document.getElementById('authScreen').style.display = 'flex'; 
        document.getElementById('loginForm').style.display = 'block'; 
        document.getElementById('forgotPassForm').style.display = 'none'; 
    } else { 
        document.getElementById('authScreen').style.display = 'none'; 
        let sName = window.activeUser.fullName ? window.activeUser.fullName : window.activeUser.username; 
        document.getElementById('currentUserDisplay').innerHTML = `<span>👤</span> ${sName}`; 
        const posSeller = document.getElementById('posCurrentSellerDisplay'); 
        if(posSeller) posSeller.innerText = sName; 
        let roleIcon = window.activeUser.role === 'admin' ? '👑 Admin' : (window.activeUser.role === 'sales' ? '🛒 Sales' : '📦 Warehouse'); 
        document.getElementById('sidebarUserRoleDisplay').innerText = roleIcon; 
        window.currentRole = window.activeUser.role; 
        if(typeof applyPermissionsCallback === 'function') applyPermissionsCallback(); 
    }
};

window.handleLogin = function(checkAuthCallback, switchTabCallback) {
    const u = document.getElementById('loginUsername').value.trim(); 
    const p = document.getElementById('loginPassword').value.trim(); 
    const foundUser = window.userAccounts.find(x => String(x.username).toLowerCase() === u.toLowerCase() && String(x.password) === p);
    if (foundUser) { 
        window.activeUser = foundUser; 
        window.currentRole = foundUser.role; 
        localStorage.setItem(window.getBranchKey('active_user_obj'), JSON.stringify(window.activeUser)); 
        document.getElementById('loginUsername').value = ''; 
        document.getElementById('loginPassword').value = ''; 
        if(checkAuthCallback) checkAuthCallback(); 
        if(switchTabCallback) switchTabCallback('pos', '🛒 ប្រព័ន្ធលក់ (Point of Sale)', document.getElementById('nav-pos')); 
        window.ksMsg(`សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ, ${foundUser.fullName ? foundUser.fullName : foundUser.username}!`, "ចូលប្រព័ន្ធជោគជ័យ"); 
    } else {
        window.ksMsg("ឈ្មោះ ឬ លេខកូដសម្ងាត់មិនត្រឹមត្រូវទេ!", "បរាជ័យ");
    }
};

window.handleLogout = function(checkAuthCallback) { 
    window.ksMsg("តើអ្នកពិតជាចង់ចាកចេញពីប្រព័ន្ធមែនទេ?", "បញ្ជាក់ការចាកចេញ", true, () => { 
        window.activeUser = null; 
        localStorage.removeItem(window.getBranchKey('active_user_obj')); 
        if(checkAuthCallback) checkAuthCallback(); 
    }); 
};

window.toggleForgotPass = function(show) { 
    document.getElementById('loginForm').style.display = show ? 'none' : 'block'; 
    document.getElementById('forgotPassForm').style.display = show ? 'block' : 'none'; 
};

window.handleResetPassword = function() { 
    const u = document.getElementById('resetUsername').value.trim(); 
    const pin = document.getElementById('resetPin').value.trim(); 
    const newP = document.getElementById('newResetPassword').value.trim(); 
    const userIndex = window.userAccounts.findIndex(x => String(x.username).toLowerCase() === u.toLowerCase()); 
    if (userIndex !== -1 && String(window.userAccounts[userIndex].pin) === pin) { 
        if (!newP) return window.ksMsg("សូមបញ្ចូលលេខកូដថ្មី!"); 
        window.userAccounts[userIndex].password = newP; 
        localStorage.setItem(window.getBranchKey('auth_users_pro'), JSON.stringify(window.userAccounts)); 
        window.ksMsg("លេខកូដសម្ងាត់ត្រូវបានប្តូរជោគជ័យ! សូមចូលប្រព័ន្ធម្តងទៀត។", "ជោគជ័យ"); 
        window.toggleForgotPass(false); 
    } else {
        window.ksMsg("ឈ្មោះ ឬ លេខ PIN សម្ងាត់មិនត្រឹមត្រូវទេ!", "បរាជ័យ");
    }
};

window.handleChangePassword = function() { 
    const oldP = document.getElementById('chgOldPassword').value; 
    const newP = document.getElementById('chgNewPassword').value; 
    if (!oldP || !newP) return window.ksMsg("សូមបំពេញចន្លោះអោយបានត្រឹមត្រូវ!"); 
    const userIndex = window.userAccounts.findIndex(x => x.username === window.activeUser.username); 
    if (userIndex !== -1 && String(window.userAccounts[userIndex].password) === oldP) { 
        window.userAccounts[userIndex].password = newP; 
        localStorage.setItem(window.getBranchKey('auth_users_pro'), JSON.stringify(window.userAccounts)); 
        document.getElementById('chgOldPassword').value = ''; 
        document.getElementById('chgNewPassword').value = ''; 
        window.ksMsg("លេខកូដសម្ងាត់របស់អ្នកត្រូវបានផ្លាស់ប្តូរជោគជ័យ!", "ជោគជ័យ"); 
    } else {
        window.ksMsg("លេខកូដចាស់មិនត្រឹមត្រូវទេ!", "បរាជ័យ");
    }
};

window.renderUsersList = function() {
    if (!window.activeUser || window.activeUser.role !== 'admin') return; 
    const tbody = document.getElementById('userListTableBody');
    if(!tbody) return;
    tbody.innerHTML = window.userAccounts.map(u => { 
        let badge = u.role === 'admin' ? '<span class="badge badge-admin">👑 Admin</span>' : (u.role === 'sales' ? '<span class="badge badge-sales">🛒 Sales</span>' : '<span class="badge badge-warehouse">📦 Warehouse</span>'); 
        let deleteBtn = `<button class="btn-danger" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="window.deleteUserAccount('${u.id}')">🗑️ លុប</button>`; 
        let editBtn = `<button class="btn-outline" style="border:none; padding:4px 8px; border-radius:4px; cursor:pointer; color:var(--warning);" onclick="window.editUserAccount('${u.id}')">✏️ កែប្រែ</button>`; 
        if (u.username === 'admin') deleteBtn = `<span style="color:var(--text-muted); font-size:var(--fs-11);">មិនអាចលុប</span>`; 
        return `<tr><td data-sort="${u.fullName||''}"><span style="font-weight:bold;">${u.fullName||'-'}</span></td><td data-sort="${u.username}"><span style="color:var(--primary);">${u.username}</span></td><td data-sort="${u.role}">${badge}</td><td data-sort="${u.pin||''}"><span style="background:rgba(128,128,128,0.1); padding:2px 5px; border-radius:4px; font-family:monospace; letter-spacing:2px;">${u.pin||'មិនមាន'}</span></td><td style="text-align: center;"><div style="display: inline-flex; gap: 5px; justify-content: center;">${editBtn}${deleteBtn}</div></td></tr>`; 
    }).join('');
    if(typeof window.filterTable === 'function') window.filterTable('mainUserTable');
};

window.openUserModal = function() { 
    document.getElementById('editUserId').value = ''; 
    document.getElementById('userModalTitle').innerText = '👤 បង្កើតគណនីបុគ្គលិកថ្មី'; 
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
    const u = window.userAccounts.find(x => x.id === id); 
    if(!u) return; 
    document.getElementById('editUserId').value = u.id; 
    document.getElementById('userModalTitle').innerText = '✏️ កែប្រែគណនីបុគ្គលិក'; 
    document.getElementById('nuFullName').value = u.fullName||''; 
    document.getElementById('nuUsername').value = u.username; 
    document.getElementById('nuPassword').value = u.password; 
    document.getElementById('nuPin').value = u.pin||''; 
    document.getElementById('nuRole').value = u.role; 
    document.getElementById('adminConfirmPassword').value = ''; 
    document.getElementById('nuUsername').disabled = (u.username === 'admin'); 
    document.getElementById('userManageModal').style.display = 'flex'; 
};

window.closeUserModal = function() { 
    document.getElementById('userManageModal').style.display = 'none'; 
};

window.saveNewUser = function() {
    const editId = document.getElementById('editUserId').value; 
    const fname = document.getElementById('nuFullName').value.trim(); 
    const uname = document.getElementById('nuUsername').value.trim(); 
    const pass = document.getElementById('nuPassword').value.trim(); 
    const pin = document.getElementById('nuPin').value.trim(); 
    let role = document.getElementById('nuRole').value; 
    const adminPass = document.getElementById('adminConfirmPassword').value; 
    if (!uname || !pass || !role || !adminPass) return window.ksMsg('សូមបំពេញព័ត៌មានដែលចាំបាច់ និងបញ្ជាក់លេខកូដ Admin របស់អ្នក!'); 
    const myAccount = window.userAccounts.find(x => x.username === window.activeUser.username); 
    if (myAccount.password !== adminPass) return window.ksMsg('លេខកូដ Admin របស់អ្នកមិនត្រឹមត្រូវទេ! ប្រតិបត្តិការត្រូវបានបដិសេធ។', 'បរាជ័យ');
    
    if (editId) { 
        const existingUser = window.userAccounts.find(x => x.id === editId); 
        if(existingUser.username === 'admin' && role !== 'admin') return window.ksMsg('គណនី admin ដើម មិនអាចដកសិទ្ធិជា admin វិញបានទេ!', 'បម្រាម'); 
        const conflict = window.userAccounts.find(x => String(x.username).toLowerCase() === uname.toLowerCase() && x.id !== editId); 
        if(conflict) return window.ksMsg('ឈ្មោះ Login នេះមានអ្នកប្រើប្រាស់រួចហើយ សូមរើសឈ្មោះផ្សេង។', 'បរាជ័យ'); 
        existingUser.fullName = fname; 
        existingUser.username = uname; 
        existingUser.password = pass; 
        existingUser.pin = pin||'0000'; 
        existingUser.role = role; 
        if(existingUser.id === window.activeUser.id) { 
            window.activeUser = existingUser; 
            localStorage.setItem(window.getBranchKey('active_user_obj'), JSON.stringify(window.activeUser)); 
        } 
        window.ksMsg('គណនីត្រូវបានកែប្រែដោយជោគជ័យ!', 'ជោគជ័យ'); 
    } else { 
        if (window.userAccounts.find(x => String(x.username).toLowerCase() === uname.toLowerCase())) return window.ksMsg('ឈ្មោះ Login នេះមានអ្នកប្រើប្រាស់រួចហើយ សូមរើសឈ្មោះផ្សេង។', 'បរាជ័យ'); 
        window.userAccounts.push({ id: 'U_' + Date.now(), username: uname, password: pass, role: role, pin: pin||'0000', fullName: fname }); 
        window.ksMsg(`គណនី ${uname} ត្រូវបានបង្កើតដោយជោគជ័យ!`, 'ជោគជ័យ'); 
    }
    localStorage.setItem(window.getBranchKey('auth_users_pro'), JSON.stringify(window.userAccounts)); 
    window.closeUserModal(); 
    window.renderUsersList();
};

window.deleteUserAccount = function(id) { 
    const u = window.userAccounts.find(x => x.id === id); 
    if (!u) return; 
    if (u.username === 'admin') return window.ksMsg("មិនអាចលុបគណនី Admin ដើមได้ទេ!"); 
    if (u.id === window.activeUser.id) return window.ksMsg("មិនអាចលុបគណនីកំពុងប្រើប្រាស់បានទេ!"); 
    window.ksMsg(`តើអ្នកពិតជាចង់លុបគណនីបុគ្គលិកឈ្មោះ "${u.fullName||u.username}" មែនទេ?`, "បញ្ជាក់การលុបគណនី", true, () => { 
        window.userAccounts = window.userAccounts.filter(x => x.id !== id); 
        localStorage.setItem(window.getBranchKey('auth_users_pro'), JSON.stringify(window.userAccounts)); 
        window.renderUsersList(); 
        window.ksMsg("គណនីត្រូវបានលុបដោយជោគជ័យ!"); 
    }); 
};