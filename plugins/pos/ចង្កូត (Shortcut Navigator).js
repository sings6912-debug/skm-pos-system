(function() {
    // ⚡ ការពារមិនឱ្យកូដនេះរត់ជាន់គ្នា ២ដង (Anti-Duplicate Guard)
    if (window.skmShortcutsLoaded) return;
    window.skmShortcutsLoaded = true;

    console.log("⌨️ POS Ultra-Premium Keyboard Shortcuts Initialized!");

    // ១. បញ្ចូលរចនាប័ទ្ម (VVIP Glassmorphism Toast)
    const style = document.createElement('style');
    style.innerHTML = `
        .skm-shortcut-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.95));
            backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
            color: #fff;
            padding: 12px 20px;
            border-radius: 16px;
            font-size: 14px;
            font-family: 'Battambang', 'Nunito', sans-serif;
            z-index: 999999;
            border: 1px solid rgba(56, 189, 248, 0.3);
            pointer-events: none;
            box-shadow: 0 15px 35px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.2);
            animation: skmToastSlide 2.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            display: flex; align-items: center; gap: 12px;
        }
        .skm-shortcut-key {
            background: rgba(56, 189, 248, 0.15);
            color: #38bdf8;
            padding: 4px 10px;
            border-radius: 8px;
            font-weight: 900;
            border: 1px solid rgba(56, 189, 248, 0.4);
            font-family: 'Arial';
            letter-spacing: 1px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }
        @keyframes skmToastSlide {
            0% { opacity: 0; transform: translateX(80px) scale(0.9); }
            15% { opacity: 1; transform: translateX(0) scale(1); }
            85% { opacity: 1; transform: translateX(0) scale(1); }
            100% { opacity: 0; transform: translateY(-20px) scale(0.9); }
        }
    `;
    document.head.appendChild(style);

    // ២. មុខងារលោតសារ
    function showShortcutToast(key, msg, icon = '⌨️') {
        const existing = document.getElementById('skmShortcutToast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.id = 'skmShortcutToast';
        toast.className = 'skm-shortcut-toast';
        toast.innerHTML = `<span style="font-size:20px;">${icon}</span> <span style="flex:1;">${msg}</span> <span class="skm-shortcut-key">${key}</span>`;
        document.body.appendChild(toast);
        
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 2500);
    }

    // ៣. មុខងារបញ្ជា Keyboard
    function clickElement(id, key, msg, icon) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.click();
            showShortcutToast(key, msg, icon);
        }
    }

    document.addEventListener('keydown', function(e) {
        // កុំឱ្យដើរ ពេលកំពុងវាយអក្សរក្នុងប្រអប់
        const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
        
        if (isInput) {
            if (e.key === 'Escape') {
                document.activeElement.blur();
                showShortcutToast('ESC', 'ឈប់វាយអក្សរ (Unfocused)', '🚫');
            }
            return;
        }

        let actionTaken = false;

        // ប៊ូតុងរុករកទូទៅ (Global Sidebar Navigation)
        switch(e.key) {
            case 'F1': e.preventDefault(); clickElement('nav-dashboard', 'F1', 'ផ្ទាំងគ្រប់គ្រងទូទៅ', '📊'); actionTaken = true; break;
            case 'F2': e.preventDefault(); clickElement('nav-inventory', 'F2', 'គ្រប់គ្រងស្តុកទំនិញ', '📦'); actionTaken = true; break;
            case 'F3': e.preventDefault(); clickElement('nav-pos', 'F3', 'ប្រព័ន្ធលក់ (POS)', '🛒'); actionTaken = true; break;
            case 'F4': e.preventDefault(); clickElement('nav-customers', 'F4', 'ប្រវត្តិអតិថិជន', '👥'); actionTaken = true; break;
            case 'F5': e.preventDefault(); clickElement('nav-unpaid', 'F5', 'វិក្កយបត្រ & ការជំពាក់', '🧾'); actionTaken = true; break;
            case 'F6': e.preventDefault(); clickElement('nav-expenses', 'F6', 'កត់ត្រាចំណាយ', '💸'); actionTaken = true; break;
            case 'F7': e.preventDefault(); clickElement('nav-history', 'F7', 'របាយការណ៍សកម្មភាព', '📜'); actionTaken = true; break;
            case 'F8': e.preventDefault(); clickElement('nav-settings', 'F8', 'ការកំណត់ប្រព័ន្ធ', '⚙️'); actionTaken = true; break;
        }

        // ប៊ូតុងបញ្ជាពិសេស ពេលកំពុងនៅផ្ទាំង POS លក់
        const posTabActive = document.getElementById('tab-pos') && document.getElementById('tab-pos').classList.contains('active');
        if (posTabActive && !actionTaken) {
            
            // ស្វែងរកទំនិញ
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                const searchInput = document.getElementById('posSearch');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                    showShortcutToast('Ctrl+F', 'ស្វែងរកទំនិញ', '🔍');
                }
            }
            // ទូទាត់ប្រាក់
            else if (e.key === 'F9' || ((e.ctrlKey || e.metaKey) && e.key === 'Enter')) {
                e.preventDefault();
                if (typeof window.openCheckoutModal === 'function') {
                    window.openCheckoutModal();
                    showShortcutToast(e.key === 'F9' ? 'F9' : 'Ctrl+Enter', 'បញ្ជាក់ការទូទាត់ប្រាក់', '💰');
                } else {
                    clickElement('btnCheckoutPaid', e.key === 'F9' ? 'F9' : 'Ctrl+Enter', 'បញ្ជាក់ការទូទាត់ប្រាក់', '💰');
                }
            }
            // លុបកន្ត្រកចោល
            else if (e.key === 'F12') {
                e.preventDefault();
                if (typeof window.clearCart === 'function') {
                    window.clearCart();
                    showShortcutToast('F12', 'លុបកន្ត្រកចោលទាំងអស់', '🗑️');
                }
            }
        }
    });
})();