(function() {
    console.log("📌 POS Noticeboard Plugin Initialized!");

    // ១. មុខងារទាញយកឈ្មោះអ្នកប្រើប្រាស់ ដ៏មានប្រសិទ្ធភាព
    function getCurrentUser() {
        let username = '';

        // វិធីទី១៖ ស្វែងរកនៅក្នុង localStorage (ជាទូទៅលឿនជាងគេ)
        const keys = ['pos_current_user', 'username', 'user_role', 'role', 'user_name', 'cashier_name'];
        for (let key of keys) {
            let val = localStorage.getItem(key);
            if (val) {
                username = val;
                break;
            }
        }

        // វិធីទី២ (ឆ្លាតវៃ)៖ ប្រសិនបើរាវក្នុង LocalStorage អត់ឃើញ, ស្កេនទាញយកផ្ទាល់ពីអេក្រង់ (ក្បែរម៉ោង)
        if (!username) {
            // ស្វែងរក Element ទាំងអស់នៅក្នុងប្រព័ន្ធ ដែលមានរូបតំណាង 👤 (User Icon) 
            const elements = document.querySelectorAll('*');
            for (let el of elements) {
                // ប្រសិនបើ Element នោះមានផ្ទុករូប 👤 ឬពាក្យពាក់ព័ន្ធ ហើយវានៅខាងលើៗ
                if (el.innerText && (el.innerText.includes('👤') || el.innerHTML.includes('fa-user'))) {
                    // ទាញយកអត្ថបទចេញពី Element នោះ (ឧទាហរណ៍៖ "👤 0" វានឹងយក "0")
                    let text = el.innerText.replace('👤', '').trim();
                    // ត្រូវប្រាកដថាវាមិនមែនជាអត្ថបទវែងៗ (ឧទាហរណ៍មានប្រវែងខ្លីល្មមជាឈ្មោះ)
                    if (text.length > 0 && text.length < 25) {
                        username = text;
                        // ប្រសិនបើវាទាញបាន "0" គឺយក "0" ហ្នឹងតែម្តង
                        break; 
                    }
                }
            }
        }

        // វិធីទី៣ (ចុងក្រោយបង្អស់)៖ បើនៅតែអត់ឃើញទៀត (ឧទាហរណ៍ UI ប្រព័ន្ធដាច់)
        if (!username) {
            const pageText = document.body.innerText;
            if (pageText.includes('អ្នកគ្រប់គ្រងប្រព័ន្ធ')) username = 'អ្នកគ្រប់គ្រងប្រព័ន្ធ';
            else if (pageText.includes('👑 Admin') || pageText.includes('Admin')) username = 'admin';
        }

        return username || 'បុគ្គលិកមិនស្គាល់ឈ្មោះ';
    }

    // ២. មុខងារឆែកមើលសិទ្ធិជា មេ (Admin/Owner)
    function isSuperAdmin(username) {
        // បញ្ចូលឈ្មោះគណនីរបស់អ្នកគ្រប់គ្រង។ បើចង់ឱ្យលេខ '0' ជាមេ សូមថែម '0' ចូលទីនេះ។
        const admins = ['admin', 'ម្ចាស់ហាង', 'owner', 'មេ', 'អ្នកគ្រប់គ្រងប្រព័ន្ធ', 'អ្នកគ្រប់គ្រង', '0']; 
        return admins.includes(username.toString().trim().toLowerCase());
    }

    const escapeHTML = (str) => {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    };

    function openNoticeboard() {
        const existingModal = document.getElementById('skmNoticeModal');
        if (existingModal) {
            existingModal.style.display = 'flex';
            loadNotices();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmNoticeModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.5); z-index: 100000; display: flex; 
            justify-content: center; align-items: center; 
            backdrop-filter: blur(2px); font-family: 'Battambang', sans-serif;
        `;
        
        modal.innerHTML = `
            <div id="skmNoticeContent" style="background: #ffffff; color: #333333; padding: 20px; border-radius: 12px; width: 450px; max-height: 85vh; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px;">
                    <h3 style="color: #f97316; margin: 0; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        📌 ក្តារខៀនប្រកាសព័ត៌មានហាង
                    </h3>
                    <button onclick="document.getElementById('skmNoticeModal').style.display='none'" style="background: #ef4444; border: none; color: #fff; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 12px; display: flex; align-items: center; justify-content: center;">✕</button>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <textarea id="skmNoticeText" placeholder="សរសេរព័ត៌មានប្រកាសសម្រាប់បុគ្គលិកវេនក្រោយ..." style="width: 100%; height: 80px; resize: none; padding: 12px; background: #f1f5f9; color: #333; border: none; border-radius: 8px; outline: none; font-family: 'Battambang'; box-sizing: border-box; font-size: 13px;"></textarea>
                    <button style="width: 100%; margin-top: 10px; background: #f97316; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; font-family: 'Battambang';" onclick="window.saveNotice()">➕ បន្ថែមសេចក្តីប្រកាស</button>
                </div>

                <div style="font-size: 13px; font-weight: bold; color: #64748b; margin-bottom: 8px;">សេចក្តីប្រកាសសកម្ម៖</div>
                <div id="skmNoticeList" style="flex: 1; overflow-y: auto; max-height: 35vh; padding-right: 5px;"></div>

                <div style="margin-top: 15px; text-align: right; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                    <button style="padding: 6px 16px; border-radius: 6px; cursor: pointer; background: white; border: 1px solid #cbd5e1; color: #475569; font-family: 'Battambang';" onclick="document.getElementById('skmNoticeModal').style.display='none'">បិទ</button>
                </div>
            </div>
        `;

        modal.addEventListener('mousedown', function(event) {
            const content = document.getElementById('skmNoticeContent');
            if (event.target === modal && !content.contains(event.target)) {
                modal.style.display = 'none';
            }
        });

        document.body.appendChild(modal);
        loadNotices();
    }

    window.saveNotice = function() {
        const textArea = document.getElementById('skmNoticeText');
        const text = textArea.value.trim();
        if (!text) { 
            alert('សូមសរសេរខ្លឹមសារសេចក្តីប្រកាស!'); 
            return; 
        }

        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let notices = JSON.parse(localStorage.getItem(`ks2_${branchId}_notices`) || '[]');
        
        const currentUser = getCurrentUser();

        notices.unshift({
            id: 'NOTI-' + Date.now(),
            content: text,
            author: currentUser,
            time: new Date().toLocaleString('km-KH')
        });

        localStorage.setItem(`ks2_${branchId}_notices`, JSON.stringify(notices));
        textArea.value = '';
        loadNotices();
        
        if (typeof window.showToast === 'function') {
            window.showToast('បានបន្ថែមសេចក្តីប្រកាស!');
        }
    };

    function loadNotices() {
        const list = document.getElementById('skmNoticeList');
        if (!list) return;

        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let notices = JSON.parse(localStorage.getItem(`ks2_${branchId}_notices`) || '[]');

        if (notices.length === 0) {
            list.innerHTML = '<div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 13px;">គ្មានសេចក្តីប្រកាសទេ</div>';
            return;
        }

        const currentUser = getCurrentUser();
        const isAdmin = isSuperAdmin(currentUser);

        list.innerHTML = notices.map((n, idx) => {
            const isAuthor = (n.author === currentUser);
            
            // ប្រសិនបើជា Admin គឺលុបបានទាំងអស់។ បើបុគ្គលិកធម្មតា លុបបានតែសារខ្លួនឯងទេ។
            const canDelete = isAdmin || isAuthor; 

            const deleteButtonHTML = canDelete 
                ? `<button style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;" onclick="window.removeNotice(${idx}, '${n.id || ''}')">លុប</button>`
                : ``;

            return `
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1; padding-right: 10px;">
                    <div style="font-weight: bold; color: #334155; font-size: 13px; white-space: pre-wrap; word-break: break-word; line-height: 1.5;">${escapeHTML(n.content)}</div>
                    <div style="font-size: 11px; color: #64748b; margin-top: 6px; display: flex; gap: 10px;">
                        <span>👤 ${escapeHTML(n.author || 'មិនស្គាល់')}</span>
                        <span>⏱ ${escapeHTML(n.time)}</span>
                    </div>
                </div>
                <div>
                    ${deleteButtonHTML}
                </div>
            </div>
            `;
        }).join('');
    }

    window.removeNotice = function(idx, noticeId) {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let notices = JSON.parse(localStorage.getItem(`ks2_${branchId}_notices`) || '[]');
        
        let noticeIndex = idx;
        
        if (noticeId) {
             const foundIndex = notices.findIndex(n => n.id === noticeId);
             if(foundIndex !== -1) noticeIndex = foundIndex;
        }

        if (noticeIndex < 0 || noticeIndex >= notices.length) return;

        const noticeToDelete = notices[noticeIndex];
        const currentUser = getCurrentUser();
        const isAdmin = isSuperAdmin(currentUser);
        const isAuthor = (noticeToDelete.author === currentUser);
        
        if (!isAdmin && !isAuthor) {
            alert("សុំទោស! មានតែ អ្នកគ្រប់គ្រង ឬម្ចាស់សារផ្ទាល់ទេ ទើបមានសិទ្ធិលុបបាន។");
            return;
        }

        if (!confirm("តើអ្នកពិតជាចង់លុបសេចក្តីប្រកាសនេះមែនទេ?")) return;
        
        notices.splice(noticeIndex, 1);
        localStorage.setItem(`ks2_${branchId}_notices`, JSON.stringify(notices));
        loadNotices();
    };

    let attempts = 0;
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📌', 'ប្រកាសព័ត៌មាន', openNoticeboard);
            clearInterval(initInt);
            console.log("✅ Noticeboard successfully registered to Toolbox!");
        }
        
        attempts++;
        if (attempts > 20) {
            clearInterval(initInt);
            console.warn("⚠️ Noticeboard failed to register: Smart Toolbox not found.");
        }
    }, 500);

})();