/* STREAMING_CHUNK:Initializing POS Daily Shift Checklist Pro Edition... */
(function() {
    console.log("☑️ POS Daily Shift Checklist Pro Initialized!");

    // 🌟 បង្កប់ CSS ផ្ទាល់ខ្លួនដើម្បីធានាថា Modal លេចចេញមកស្អាត និងទំនើប ១០០%
    if (!document.getElementById('skm-checklist-style')) {
        const style = document.createElement('style');
        style.id = 'skm-checklist-style';
        style.innerHTML = `
            .skm-chk-bg {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
                z-index: 100000; display: flex; justify-content: center; align-items: center;
                font-family: 'Battambang', sans-serif; opacity: 0; transition: opacity 0.3s ease;
                pointer-events: none;
            }
            .skm-chk-bg.skm-show {
                opacity: 1; pointer-events: auto;
            }
            .skm-chk-content {
                background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b);
                max-width: 480px; width: 92%; padding: 25px; border-radius: 28px;
                max-height: 88vh; display: flex; flex-direction: column;
                box-shadow: 0 25px 60px -15px rgba(0,0,0,0.3);
                transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid var(--border-color, #e2e8f0);
            }
            .skm-chk-bg.skm-show .skm-chk-content {
                transform: translateY(0) scale(1);
            }
            .skm-chk-item-label {
                background: var(--store-bg, #f8fafc); padding: 14px 16px; border-radius: 16px;
                border: 1px solid var(--border-color, #e2e8f0); display: flex; align-items: center;
                gap: 14px; cursor: pointer; font-size: 13px; transition: all 0.25s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            }
            .skm-chk-item-label:hover {
                border-color: #10b981; background: rgba(16, 185, 129, 0.04);
                transform: translateY(-1px); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
            }
            .skm-chk-progress-bar {
                height: 8px; width: 100%; background: #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 15px;
            }
            .skm-chk-progress-fill {
                height: 100%; background: linear-gradient(135deg, #10b981, #059669); width: 0%; transition: width 0.4s ease; border-radius: 10px;
            }
        `;
        document.head.appendChild(style);
    }

    /* STREAMING_CHUNK:Opening Checklist Modal... */
    function openChecklistModal() {
        let modal = document.getElementById('skmChecklistModal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('skm-show'), 10);
            buildChecklistTasks();
            return;
        }

        modal = document.createElement('div');
        modal.className = 'skm-chk-bg';
        modal.id = 'skmChecklistModal';
        
        // ចុចក្រៅប្រអប់ដើម្បីបិទ
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('skm-show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };

        modal.innerHTML = `
            <div class="skm-chk-content" onclick="event.stopPropagation()">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border-color, #e2e8f0); padding-bottom:15px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width: 44px; height: 44px; background: rgba(16, 185, 129, 0.12); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px;">
                            📋
                        </div>
                        <div>
                            <h3 style="color:var(--text-dark, #1e293b); margin:0; font-size:17px; font-weight:900;">កិច្ចការប្រចាំវេន</h3>
                            <div style="font-size:11px; color:var(--text-muted, #64748b); font-weight:700;" id="skmChkDateDisplay">ថ្ងៃនេះ: ...</div>
                        </div>
                    </div>
                    <div onclick="document.getElementById('skmChecklistModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmChecklistModal').style.display='none', 300);" style="color: var(--text-muted, #9ca3af); font-size: 16px; cursor: pointer; width: 34px; height: 34px; border-radius: 50%; background: var(--store-bg, #f1f5f9); display: flex; align-items: center; justify-content: center; font-weight: bold;">✕</div>
                </div>
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div style="font-size:12px; color:var(--text-muted, #64748b); font-weight:800;">ស្ថានភាពបំពេញការងារ៖</div>
                    <div id="skmChkProgressText" style="font-size:12px; font-weight:900; color:#10b981;">0/6 (0%)</div>
                </div>
                
                <div class="skm-chk-progress-bar">
                    <div class="skm-chk-progress-fill" id="skmChkProgressFill"></div>
                </div>

                <div id="skmChecklistContainer" style="flex:1; overflow-y:auto; max-height:42vh; padding-right:5px; margin-bottom:20px; display:flex; flex-direction:column; gap:10px;">
                    <!-- Tasks inject here -->
                </div>

                <div style="display:flex; gap:12px; border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 18px;">
                    <button style="flex:1; border:1px solid var(--border-color, #e2e8f0); color:var(--text-dark, #1e293b); border-radius:14px; padding:13px; font-weight:bold; cursor:pointer; background:transparent; font-family:'Battambang';" onclick="document.getElementById('skmChecklistModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmChecklistModal').style.display='none', 300);">បិទ</button>
                    <button style="flex:1; background:linear-gradient(135deg, #10b981, #059669); color:white; border:none; border-radius:14px; padding:13px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35); font-family:'Battambang';" onclick="window.resetChecklist()">🔄 សម្អាតការធីក</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('skm-show'), 10);
        
        buildChecklistTasks();
    }

    const defaultTasks = [
        "បើកទូ និងរៀបចំប្រាក់ដើមបើកវេន (Opening Float)",
        "សម្អាតតុគិតលុយ និងបរិវេណជុំវិញហាង",
        "ពិនិត្យស្តុកទំនិញដែលដាក់តាំងបង្ហាញ",
        "តេស្តប្រព័ន្ធម៉ាស៊ីនបោះពុម្ពវិក្កយបត្រ (Printer Test)",
        "កត់ត្រាសេចក្តីប្រកាសលើក្ដារខៀនវេនថ្មី",
        "បិទភ្លើង និងចាក់សោរទូរពេលបិទវេន (Closing)"
    ];

    /* STREAMING_CHUNK:Building tasks and Khmer Date format... */
    function buildChecklistTasks() {
        const container = document.getElementById('skmChecklistContainer');
        if(!container) return;

        let branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        
        // 🌟 កែទម្រង់ថ្ងៃខែឆ្នាំជាភាសាខ្មែរ
        let todayStr = new Date().toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
        const dateDisp = document.getElementById('skmChkDateDisplay');
        if(dateDisp) dateDisp.innerText = todayStr;

        let rawDateKey = new Date().toLocaleDateString();
        let saved = JSON.parse(localStorage.getItem(`ks2_${branchId}_checklist_${rawDateKey}`) || '{}');

        let completedCount = 0;
        defaultTasks.forEach((_, idx) => {
            if(saved[idx]) completedCount++;
        });

        let percent = Math.round((completedCount / defaultTasks.length) * 100);
        const fillBar = document.getElementById('skmChkProgressFill');
        const txtBar = document.getElementById('skmChkProgressText');
        if(fillBar) fillBar.style.width = `${percent}%`;
        if(txtBar) txtBar.innerText = `${completedCount}/${defaultTasks.length} (${percent}%)`;

        container.innerHTML = defaultTasks.map((task, idx) => `
            <label class="skm-chk-item-label">
                <input type="checkbox" class="skm-check-item" data-idx="${idx}" ${saved[idx] ? 'checked' : ''} onchange="window.saveChecklistState()" style="width:22px; height:22px; accent-color:#10b981; cursor:pointer; border-radius:6px;">
                <span style="color:var(--text-dark, #1e293b); font-weight:800; font-size:13px; ${saved[idx] ? 'text-decoration:line-through; opacity:0.45;' : ''}">${task}</span>
            </label>
        `).join('');
    }

    window.saveChecklistState = function() {
        let branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        let rawDateKey = new Date().toLocaleDateString();
        let state = {};
        
        document.querySelectorAll('.skm-check-item').forEach(chk => {
            state[chk.getAttribute('data-idx')] = chk.checked;
        });

        localStorage.setItem(`ks2_${branchId}_checklist_${rawDateKey}`, JSON.stringify(state));
        buildChecklistTasks();
    };

    window.resetChecklist = function() {
        let branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        let rawDateKey = new Date().toLocaleDateString();
        localStorage.removeItem(`ks2_${branchId}_checklist_${rawDateKey}`);
        buildChecklistTasks();
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('☑️', 'បញ្ជីកិច្ចការប្រចាំថ្ងៃ (Checklist)', openChecklistModal);
            clearInterval(initInt);
        }
    }, 300);
})();