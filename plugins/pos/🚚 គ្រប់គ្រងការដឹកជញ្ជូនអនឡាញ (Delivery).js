(function() {
    console.log("🚚 POS Delivery Tracker Plugin Initialized!");

    // ១. មុខងារសុវត្ថិភាពការពារ XSS
    const escapeHTML = (str) => {
        if (!str) return '';
        return str.toString().replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    };

    // ២. មុខងារទាញយកឈ្មោះអ្នកប្រើប្រាស់
    function getCurrentUser() {
        let username = '';
        const keys = ['pos_current_user', 'username', 'user_role', 'role', 'user_name'];
        for (let key of keys) {
            let val = localStorage.getItem(key);
            if (val) { username = val; break; }
        }
        if (!username) {
            const elements = document.querySelectorAll('*');
            for (let el of elements) {
                if (el.innerText && (el.innerText.includes('👤') || el.innerHTML.includes('fa-user'))) {
                    let text = el.innerText.replace('👤', '').trim();
                    if (text.length > 0 && text.length < 25) { username = text; break; }
                }
            }
        }
        if (!username) {
            const pageText = document.body.innerText;
            if (pageText.includes('អ្នកគ្រប់គ្រងប្រព័ន្ធ')) username = 'អ្នកគ្រប់គ្រងប្រព័ន្ធ';
            else if (pageText.includes('👑 Admin') || pageText.includes('Admin')) username = 'admin';
        }
        return username || 'មិនស្គាល់ឈ្មោះ';
    }

    // ៣. មុខងារបើកផ្ទាំងគ្រប់គ្រង
    function openDeliveryModal() {
        if(document.getElementById('skmDeliveryModal')) {
            document.getElementById('skmDeliveryModal').style.display = 'flex';
            loadDeliveryList();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmDeliveryModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.6); z-index: 100000; display: flex; 
            justify-content: center; align-items: center; 
            backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;
        `;
        
        modal.innerHTML = `
            <div id="skmDeliveryContent" style="background: #ffffff; color: #333333; padding: 25px; border-radius: 16px; width: 500px; max-height: 85vh; display:flex; flex-direction:column; border: 1px solid #e2e8f0; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
                    <h3 style="color:#0284c7; margin:0; font-size:16px; display: flex; align-items: center; gap: 8px;">
                        🚚 គ្រប់គ្រងការដឹកជញ្ជូនអនឡាញ
                    </h3>
                    <button onclick="document.getElementById('skmDeliveryModal').style.display='none'" style="background:#ef4444; border:none; color:#fff; width:26px; height:26px; border-radius:50%; cursor:pointer; font-weight:bold; display: flex; justify-content: center; align-items: center; font-size: 12px;">✕</button>
                </div>
                
                <!-- ផ្នែកបញ្ចូលព័ត៌មាន (រចនាបែបថ្មី ពណ៌ស ស្អាត) -->
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <input type="text" id="skmDelivCust" placeholder="ឈ្មោះអតិថិជន..." style="flex:1; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; background: #f8fafc; font-family: 'Battambang'; outline: none;">
                    <input type="text" id="skmDelivPhone" placeholder="លេខទូរស័ព្ទ..." style="flex:1; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; background: #f8fafc; font-family: 'Battambang'; outline: none;">
                </div>
                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <input type="text" id="skmDelivCompany" placeholder="ក្រុមហ៊ុនដឹក (ឧ: J&T, វីរៈប៊ុនថាំ)..." style="flex:1; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; background: #f8fafc; font-family: 'Battambang'; outline: none;">
                    <button style="padding: 10px 15px; border-radius: 8px; cursor: pointer; background: #0284c7; border: none; color: white; font-family: 'Battambang'; font-weight: bold; box-shadow: 0 4px 6px rgba(2, 132, 199, 0.2);" onclick="window.saveDeliveryOrder()">➕ បន្ថែម</button>
                </div>

                <div style="font-size:13px; font-weight:bold; color:#64748b; margin-bottom:8px;">បញ្ជីរង់ចាំដឹកជញ្ជូនថ្ងៃនេះ៖</div>
                <div id="skmDeliveryList" style="flex:1; overflow-y:auto; max-height:40vh; padding-right:5px;"></div>

                <div style="margin-top: 15px; text-align: right; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                    <button style="padding: 8px 20px; border-radius: 8px; cursor: pointer; background: white; border: 1px solid #cbd5e1; color: #475569; font-family: 'Battambang';" onclick="document.getElementById('skmDeliveryModal').style.display='none'">បិទ</button>
                </div>
            </div>
        `;

        // អនុញ្ញាតឱ្យចុចផ្ទៃខាងក្រៅ (Background) ដើម្បីបិទ
        modal.addEventListener('mousedown', function(event) {
            const content = document.getElementById('skmDeliveryContent');
            if (event.target === modal && !content.contains(event.target)) {
                modal.style.display = 'none';
            }
        });

        document.body.appendChild(modal);
        loadDeliveryList();
        
        // Auto-focus ប្រអប់ឈ្មោះអតិថិជន
        setTimeout(() => document.getElementById('skmDelivCust').focus(), 100);
    }

    // ៤. មុខងាររក្សាទុក
    window.saveDeliveryOrder = function() {
        const cust = document.getElementById('skmDelivCust').value.trim();
        const phone = document.getElementById('skmDelivPhone').value.trim();
        const comp = document.getElementById('skmDelivCompany').value.trim();

        if(!cust) { alert('សូមបញ្ចូលឈ្មោះអតិថិជន!'); return; }

        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let deliveries = JSON.parse(localStorage.getItem(`ks2_${branchId}_deliveries`) || '[]');
        
        const currentUser = getCurrentUser();

        deliveries.unshift({
            id: 'DEL-' + Date.now().toString().slice(-4),
            customer: cust,
            phone: phone || 'អត់មានលេខ',
            company: comp || 'ដឹកជញ្ជូនទូទៅ',
            status: 'កំពុងរៀបចំ',
            author: currentUser, // កត់ត្រាអ្នកបញ្ចូល
            date: new Date().toLocaleString('km-KH')
        });

        localStorage.setItem(`ks2_${branchId}_deliveries`, JSON.stringify(deliveries));
        document.getElementById('skmDelivCust').value = '';
        document.getElementById('skmDelivPhone').value = '';
        document.getElementById('skmDelivCompany').value = '';
        
        loadDeliveryList();
        document.getElementById('skmDelivCust').focus(); // Focus វិញងាយវាយអ្នកបន្ទាប់
        
        if(typeof window.showToast === 'function') {
            window.showToast('បានកត់ត្រាការដឹកជញ្ជូន!');
        }
    };

    // ៥. មុខងារបង្ហាញទិន្នន័យ
    function loadDeliveryList() {
        const list = document.getElementById('skmDeliveryList');
        if(!list) return;

        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let deliveries = JSON.parse(localStorage.getItem(`ks2_${branchId}_deliveries`) || '[]');

        if(deliveries.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:20px; color:#94a3b8; font-size:13px;">គ្មានទិន្នន័យដឹកជញ្ជូនទេ</div>';
            return;
        }

        list.innerHTML = deliveries.map((d, idx) => `
            <div style="background:#f8fafc; padding:12px; border-radius:8px; margin-bottom:10px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                <div style="flex: 1; padding-right: 10px;">
                    <div style="font-weight:bold; color:#334155; font-size:14px; margin-bottom:4px;">
                        📦 ${escapeHTML(d.customer)} <span style="color:#0ea5e9; font-size:13px;">(${escapeHTML(d.phone)})</span>
                    </div>
                    <div style="font-size:11px; color:#64748b; display:flex; gap:10px; flex-wrap:wrap;">
                        <span style="background:#e0f2fe; padding:2px 6px; border-radius:4px; color:#0284c7;">🚚 ${escapeHTML(d.company)}</span>
                        <span>👤 ${escapeHTML(d.author || 'មិនស្គាល់')}</span>
                        <span>⏱️ ${escapeHTML(d.date)}</span>
                    </div>
                </div>
                <div>
                    <button style="background:#ef4444; color:white; border:none; padding:6px 12px; border-radius:6px; font-size:11px; cursor:pointer;" onclick="window.removeDelivery(${idx})">លុប</button>
                </div>
            </div>
        `).join('');
    }

    // ៦. មុខងារលុប (មានប្រអប់បញ្ជាក់)
    window.removeDelivery = function(idx) {
        if(!confirm("តើអ្នកពិតជាចង់លុបទិន្នន័យដឹកជញ្ជូននេះមែនទេ?")) return;

        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let deliveries = JSON.parse(localStorage.getItem(`ks2_${branchId}_deliveries`) || '[]');
        deliveries.splice(idx, 1);
        localStorage.setItem(`ks2_${branchId}_deliveries`, JSON.stringify(deliveries));
        loadDeliveryList();
    };

    // ៧. រង់ចាំភ្ជាប់ (ការពារ Infinite Loop)
    let attempts = 0;
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🚚', 'គ្រប់គ្រងដឹកជញ្ជូន', openDeliveryModal);
            clearInterval(initInt);
            console.log("✅ Delivery Tracker successfully registered!");
        }
        attempts++;
        if (attempts > 20) {
            clearInterval(initInt);
            console.warn("⚠️ Delivery Tracker failed to register: Smart Toolbox not found.");
        }
    }, 500);
})();