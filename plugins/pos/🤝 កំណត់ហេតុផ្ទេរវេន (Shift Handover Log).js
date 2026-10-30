/* STREAMING_CHUNK:Initializing Perfect Layout Shift Handover Log Plugin... */
(function() {
    console.log("🤝 POS Perfect Layout Shift Handover Log Plugin Initialized!");

    /* STREAMING_CHUNK:Building Modern Modal UI with Strict Flexbox... */
    function openHandoverModal() {
        if(document.getElementById('skmHandoverModal')) {
            document.getElementById('skmHandoverModal').style.display = 'flex';
            autoFillStaffName();
            loadHandoverLogs();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmHandoverModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        /* STREAMING_CHUNK:Injecting Fixed Flexbox CSS & Layout... */
        modal.innerHTML = `
            <style>
                .skm-ho-box { background: var(--bg-card, #ffffff); color: var(--text-main, #1e293b); padding: 25px; border-radius: 24px; width: 100%; max-width: 480px; height: 85vh; max-height: 650px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); border: 1px solid var(--border, #e2e8f0); display: flex; flex-direction: column; box-sizing: border-box; overflow: hidden; }
                .skm-ho-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border, #cbd5e1); padding-bottom: 12px; margin-bottom: 12px; flex-shrink: 0; }
                .skm-ho-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-right: 4px; box-sizing: border-box; }
                .skm-ho-input { font-size: 14px; padding: 10px 14px; border-radius: 12px; border: 2px solid #e2e8f0; width: 100%; transition: all 0.3s ease; background: var(--store-bg, #f8fafc); outline: none; color: var(--text-main, #1e293b); font-family: inherit; box-sizing: border-box; }
                .skm-ho-input:focus { border-color: #f59e0b; box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1); }
                .skm-btn-primary { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 12px; border-radius: 12px; font-size: 14px; font-weight: bold; cursor: pointer; width: 100%; transition: 0.2s; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); font-family: inherit; flex-shrink: 0; }
                .skm-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4); }
                .skm-btn-close { background: var(--store-bg, #f1f5f9); color: var(--text-main, #475569); border: 1px solid var(--border, #cbd5e1); padding: 10px; border-radius: 12px; font-size: 14px; font-weight: bold; cursor: pointer; width: 100%; transition: 0.2s; text-align: center; font-family: inherit; flex-shrink: 0; margin-top: 10px; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
                .skm-ho-item { background: var(--store-bg, #f8fafc); padding: 10px 12px; border-radius: 12px; border: 1px solid var(--border, #e2e8f0); margin-bottom: 8px; box-sizing: border-box; }
            </style>
            
            <div class="skm-ho-box">
                <div class="skm-ho-header">
                    <h3 style="margin:0; font-size:17px; display: flex; align-items: center; gap: 8px; color: #f59e0b;">
                        <span style="font-size: 20px;">🤝</span> កំណត់ហេតុផ្ទេរវេនការងារ
                    </h3>
                    <button onclick="document.getElementById('skmHandoverModal').style.display='none'" style="background: rgba(239, 68, 68, 0.1); border: none; color: #ef4444; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">✕</button>
                </div>
                
                <div class="skm-ho-body">
                    <div>
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">ឈ្មោះបុគ្គលិកបញ្ជូនវេន៖</label>
                        <input type="text" id="skmHandStaff" class="skm-ho-input" readonly style="background: #e2e8f0; color: #334155; font-weight: bold; cursor: not-allowed;" title="ទាញយកឈ្មោះពីប្រព័ន្ធដោយស្វ័យប្រវត្តិ">
                    </div>
                    
                    <div>
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">សេចក្តីជូនដំណឹង / កំណត់ហេតុផ្ទេរវេន *</label>
                        <textarea id="skmHandNote" class="skm-ho-input" placeholder="ឧ. លុយក្នុងទូរមានគ្រប់, បានបោសសម្អាតរួចរាល់..." style="height: 70px; resize:none; font-family: inherit;"></textarea>
                    </div>

                    <button class="skm-btn-primary" onclick="window.saveHandoverLog()">📝 រក្សាទុកកត់ត្រាផ្ទេរវេន</button>

                    <div style="border-top: 1px dashed var(--border, #cbd5e1); padding-top: 10px; margin-top: 5px;">
                        <div style="font-size:12px; font-weight:bold; color:var(--text-muted, #94a3b8); margin-bottom:8px;">ប្រវត្តិការផ្ទេរវេនថ្ងៃនេះ៖</div>
                        <div id="skmHandoverList" style="display: flex; flex-direction: column;"></div>
                    </div>
                </div>

                <button class="skm-btn-close" onclick="document.getElementById('skmHandoverModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        autoFillStaffName();
        loadHandoverLogs();
    }

    /* STREAMING_CHUNK:Auto-filling Staff Name... */
    function autoFillStaffName() {
        const staffInput = document.getElementById('skmHandStaff');
        if(!staffInput) return;

        let staffName = 'បុគ្គលិក';
        try {
            const headerUserDisplay = document.getElementById('currentUserDisplay');
            if (headerUserDisplay) {
                let txt = headerUserDisplay.innerText.replace('👤', '').trim();
                if (txt) staffName = txt;
            }
            if (staffName === 'បុគ្គលិក' || staffName === 'អ្នកគ្រប់គ្រងប្រព័ន្ធ') {
                const rawSession = localStorage.getItem('auth_session_user');
                if (rawSession) {
                    const sess = JSON.parse(rawSession);
                    if (sess && (sess.fullName || sess.username)) {
                        staffName = sess.fullName || sess.username;
                    }
                }
            }
        } catch(e) {}

        staffInput.value = staffName;
    }

    /* STREAMING_CHUNK:Saving Handover Log Logic... */
    window.saveHandoverLog = function() {
        const staff = document.getElementById('skmHandStaff').value.trim();
        const note = document.getElementById('skmHandNote').value.trim();

        if(!note) { alert('សូមសរសេរខ្លឹមសារកំណត់ហេតុផ្ទេរវេន!'); return; }

        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let logs = JSON.parse(localStorage.getItem(`ks2_${branchId}_handover_logs`) || '[]');

        logs.unshift({
            id: 'HO-' + Date.now(),
            staff: staff || 'បុគ្គលិក',
            note: note,
            time: new Date().toLocaleString('km-KH')
        });

        localStorage.setItem(`ks2_${branchId}_handover_logs`, JSON.stringify(logs));
        document.getElementById('skmHandNote').value = '';
        loadHandoverLogs();
        if(typeof window.showToast === 'function') window.showToast('✅ បានកត់ត្រាការផ្ទេរវេនជោគជ័យ!');
    };

    /* STREAMING_CHUNK:Loading Logs to UI... */
    function loadHandoverLogs() {
        const list = document.getElementById('skmHandoverList');
        if(!list) return;

        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let logs = JSON.parse(localStorage.getItem(`ks2_${branchId}_handover_logs`) || '[]');

        if (logs.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:15px; color:var(--text-muted, #94a3b8); font-size:13px;">គ្មានកំណត់ហេតុផ្ទេរវេនទេ</div>';
            return;
        }

        list.innerHTML = logs.slice(0, 10).map(l => `
            <div class="skm-ho-item">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                    <b style="color:var(--text-main, #1e293b); font-size:13px;">👤 ${l.staff}</b>
                    <span style="font-size:10px; color:var(--text-muted, #94a3b8);">⏱️ ${l.time}</span>
                </div>
                <div style="font-size:12px; color:var(--text-muted, #64748b); white-space:pre-wrap; margin-top:2px;">📌 ${l.note}</div>
            </div>
        `).join('');
    }

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🤝', 'កំណត់ហេតុផ្ទេរវេន (Handover)', openHandoverModal);
            clearInterval(initInt);
        }
    }, 500);
})();