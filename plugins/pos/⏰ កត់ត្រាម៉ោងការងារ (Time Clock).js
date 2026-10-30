/* STREAMING_CHUNK:Initializing POS Staff Time Clock with Break Time Pro... */
(function() {
    console.log("⏰ POS Staff Time Clock with Break Time Pro Initialized!");

    // 🌟 បង្កប់ CSS ផ្ទាល់ខ្លួនសម្រាប់ Modal ឱ្យមានសោភ័ណភាពស្អាតទំនើប
    if (!document.getElementById('skm-timeclock-style')) {
        const style = document.createElement('style');
        style.id = 'skm-timeclock-style';
        style.innerHTML = `
            .skm-tc-bg {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
                z-index: 100000; display: flex; justify-content: center; align-items: center;
                font-family: 'Battambang', sans-serif; opacity: 0; transition: opacity 0.3s ease;
                pointer-events: none;
            }
            .skm-tc-bg.skm-show {
                opacity: 1; pointer-events: auto;
            }
            .skm-tc-content {
                background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b);
                max-width: 480px; width: 92%; padding: 25px; border-radius: 28px;
                max-height: 88vh; display: flex; flex-direction: column;
                box-shadow: 0 25px 60px -15px rgba(0,0,0,0.3);
                transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid var(--border-color, #e2e8f0);
            }
            .skm-tc-bg.skm-show .skm-tc-content {
                transform: translateY(0) scale(1);
            }
            .skm-tc-log-card {
                background: var(--store-bg, #f8fafc); padding: 12px 14px; border-radius: 14px;
                border: 1px solid var(--border-color, #e2e8f0); display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 8px; transition: 0.2s;
            }
        `;
        document.head.appendChild(style);
    }

    /* STREAMING_CHUNK:Opening Time Clock Modal with Break Time... */
    function openTimeClockModal() {
        let modal = document.getElementById('skmTimeClockModal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('skm-show'), 10);
            loadTimeClockLogs();
            autoDetectActiveStaff();
            return;
        }

        modal = document.createElement('div');
        modal.className = 'skm-tc-bg';
        modal.id = 'skmTimeClockModal';
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('skm-show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };

        modal.innerHTML = `
            <div class="skm-tc-content" onclick="event.stopPropagation()">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border-color, #e2e8f0); padding-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width: 40px; height: 40px; background: rgba(2, 132, 199, 0.12); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                            ⏰
                        </div>
                        <div>
                            <h3 style="color:var(--text-dark, #1e293b); margin:0; font-size:16px; font-weight:900;">កត់ត្រាម៉ោងការងារបុគ្គលិក</h3>
                            <div style="font-size:11px; color:var(--text-muted, #64748b); font-weight:700;">Staff Time Clock & Break</div>
                        </div>
                    </div>
                    <div onclick="document.getElementById('skmTimeClockModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmTimeClockModal').style.display='none', 300);" style="color: var(--text-muted, #9ca3af); font-size: 16px; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; background: var(--store-bg, #f1f5f9); display: flex; align-items: center; justify-content: center; font-weight: bold;">✕</div>
                </div>
                
                <div style="margin-bottom:15px; background: rgba(2, 132, 199, 0.05); padding: 14px; border-radius: 16px; border: 1px dashed rgba(2, 132, 199, 0.3);">
                    <label style="font-size:11px; display:block; margin-bottom:4px; font-weight:800; color:var(--text-muted, #64748b); text-transform: uppercase;">👤 ឈ្មោះបុគ្គលិកបច្ចុប្បន្ន (Auto-detected):</label>
                    <div id="skmDetectedStaffDisplay" style="font-size: 16px; font-weight: 900; color: #0284c7; display: flex; align-items: center; gap: 8px;">
                        👑 <span id="skmStaffNameText">កំពុងស្វែងរក...</span>
                    </div>
                </div>

                <!-- Action Buttons Grid (2x2 for Punch In, Break Start, Break End, Punch Out) -->
                <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:10px; margin-bottom:18px;">
                    <button style="background:#10b981; color:white; border:none; border-radius:14px; padding:12px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); font-family:'Battambang'; font-size:12px; display:flex; align-items:center; justify-content:center; gap:6px;" onclick="window.recordPunch('ចូលធ្វើការ (Punch In)')">📥 ចូលធ្វើការ</button>
                    
                    <button style="background:#f59e0b; color:white; border:none; border-radius:14px; padding:12px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); font-family:'Battambang'; font-size:12px; display:flex; align-items:center; justify-content:center; gap:6px;" onclick="window.recordPunch('សម្រាក (Start Break)')">☕ ចាប់ផ្តើមសម្រាក</button>
                    
                    <button style="background:#3b82f6; color:white; border:none; border-radius:14px; padding:12px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); font-family:'Battambang'; font-size:12px; display:flex; align-items:center; justify-content:center; gap:6px;" onclick="window.recordPunch('ចូលធ្វើការវិញ (End Break)')">🟢 ចូលធ្វើការវិញ</button>
                    
                    <button style="background:#ef4444; color:white; border:none; border-radius:14px; padding:12px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); font-family:'Battambang'; font-size:12px; display:flex; align-items:center; justify-content:center; gap:6px;" onclick="window.recordPunch('ចេញពីការងារ (Punch Out)')">📤 ចេញពីការងារ</button>
                </div>

                <div style="font-size:12px; font-weight:900; color:var(--text-muted, #64748b); margin-bottom:8px;">ប្រវត្តិម៉ោងការងារថ្ងៃនេះ៖</div>
                <div id="skmTimeClockList" style="flex:1; overflow-y:auto; max-height:30vh; padding-right:5px; display:flex; flex-direction:column; gap:6px;"></div>

                <div style="display:flex; justify-content:flex-end; border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 15px; margin-top: 10px;">
                    <button style="border:1px solid var(--border-color, #e2e8f0); color:var(--text-dark, #1e293b); border-radius:12px; padding:10px 20px; font-weight:bold; cursor:pointer; background:transparent; font-family:'Battambang'; font-size:13px;" onclick="document.getElementById('skmTimeClockModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmTimeClockModal').style.display='none', 300);">បិទ</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('skm-show'), 10);
        
        autoDetectActiveStaff();
        loadTimeClockLogs();
    }

    /* STREAMING_CHUNK:Auto-detecting active staff name from POS DOM & storage... */
    function autoDetectActiveStaff() {
        let staffName = "អ្នកគ្រប់គ្រងប្រព័ន្ធ";

        const profileElements = document.querySelectorAll('[class*="user"], [class*="profile"], [class*="admin"], span, div');
        for (let el of profileElements) {
            let txt = el.innerText ? el.innerText.trim() : '';
            if (txt.includes('អ្នកគ្រប់គ្រង') || txt.includes('Admin') || txt.includes('Staff') || txt.includes('Cashier')) {
                if (txt.length < 30 && !txt.includes('កត់ត្រា') && !txt.includes('Time Clock')) {
                    staffName = txt;
                    break;
                }
            }
        }

        if (localStorage.getItem('pos_active_user')) {
            staffName = localStorage.getItem('pos_active_user');
        } else if (localStorage.getItem('current_user')) {
            staffName = localStorage.getItem('current_user');
        }

        const nameSpan = document.getElementById('skmStaffNameText');
        if (nameSpan) {
            nameSpan.innerText = staffName;
        }
        window.currentDetectedStaff = staffName;
    }

    window.recordPunch = function(actionType) {
        const staff = window.currentDetectedStaff || 'អ្នកគ្រប់គ្រងប្រព័ន្ធ';
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        let logs = JSON.parse(localStorage.getItem(`ks2_${branchId}_time_clock`) || '[]');
        
        logs.unshift({
            id: 'TC-' + Date.now(),
            staffName: staff,
            action: actionType,
            time: new Date().toLocaleString('km-KH', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: 'numeric', month: 'short', year: 'numeric' })
        });

        localStorage.setItem(`ks2_${branchId}_time_clock`, JSON.stringify(logs));
        loadTimeClockLogs();
        if(typeof window.showToast === 'function') window.showToast(`✅ បានកត់ត្រា ${actionType} សម្រាប់ "${staff}" ជោគជ័យ!`);
    };

    function loadTimeClockLogs() {
        const list = document.getElementById('skmTimeClockList');
        if(!list) return;

        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        let logs = JSON.parse(localStorage.getItem(`ks2_${branchId}_time_clock`) || '[]');

        if(logs.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted, #64748b); font-size:12px; font-weight:800;">គ្មានទិន្នន័យម៉ោងការងារទេថ្ងៃនេះ</div>';
            return;
        }

        list.innerHTML = logs.map(l => {
            let badgeBg = 'rgba(16, 185, 129, 0.1)';
            let badgeColor = '#10b981';
            if (l.action.includes('Out')) { badgeBg = 'rgba(239, 68, 68, 0.1)'; badgeColor = '#ef4444'; }
            else if (l.action.includes('សម្រាក')) { badgeBg = 'rgba(245, 158, 11, 0.1)'; badgeColor = '#f59e0b'; }
            else if (l.action.includes('វិញ')) { badgeBg = 'rgba(59, 130, 246, 0.1)'; badgeColor = '#3b82f6'; }

            return `
                <div class="skm-tc-log-card">
                    <div>
                        <div style="font-weight:900; color:var(--text-dark, #1e293b); font-size:13px; margin-bottom:2px;">👤 ${l.staffName}</div>
                        <div style="font-size:11px; color:var(--text-muted, #64748b);">⏱️ ${l.time}</div>
                    </div>
                    <div>
                        <span style="font-size:11px; font-weight:900; padding:4px 10px; border-radius:10px; background:${badgeBg}; color:${badgeColor};">
                            ${l.action}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    }

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('⏰', 'កត់ត្រាម៉ោងការងារ (Time Clock)', openTimeClockModal);
            clearInterval(initInt);
        }
    }, 300);
})();