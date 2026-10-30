(function() {
    console.log("🎯 POS Sales Goal Plugin (Standalone Tool) Initialized!");

    // --- ១. មុខងារគ្រប់គ្រងទិន្នន័យ (Storage) ---
    const branchId = window.SHOP_BRANCH_ID || 'branch_1';
    const storageKey = `skm_${branchId}_sales_goal_config`;
    
    function getGoalSettings() {
        try {
            return JSON.parse(localStorage.getItem(storageKey)) || { enabled: true, target: 500 };
        } catch(e) {
            return { enabled: true, target: 500 };
        }
    }

    function saveGoalSettings(settings) {
        localStorage.setItem(storageKey, JSON.stringify(settings));
    }

    // --- ២. រចនាប័ទ្ម (Styles) ---
    const style = document.createElement('style');
    style.innerHTML = `
        .skm-goal-card {
            background: var(--bg-card); 
            border: 2px solid var(--primary);
            border-radius: 12px; padding: 12px 15px; margin-bottom: 15px; 
            font-family: 'Battambang', sans-serif;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
            position: relative;
        }
        .skm-progress-bar-bg {
            width: 100%; height: 10px; background: var(--border); 
            border-radius: 8px; overflow: hidden; margin-top: 10px; 
        }
        .skm-progress-bar-fill {
            height: 100%; 
            background: var(--primary); 
            width: 0%; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); 
            border-radius: 8px;
        }
        .skm-goal-setting-btn {
            position: absolute; top: 12px; right: 12px; cursor: pointer; color: var(--text-muted);
            transition: 0.2s; font-size: 14px;
        }
        .skm-goal-setting-btn:hover { color: var(--primary); transform: rotate(90deg); }
    `;
    document.head.appendChild(style);

    // --- ៣. មុខងារបញ្ចូលផ្ទាំងទៅក្នុងកន្ត្រក ---
    function injectGoalWidget() {
        const settings = getGoalSettings();
        const cartSummary = document.getElementById('cartSummaryBody');
        let widget = document.getElementById('skmGoalWidget');

        if (!settings.enabled) {
            if (widget) widget.style.display = 'none';
            return;
        }

        if (!cartSummary) return;

        if (!widget) {
            widget = document.createElement('div');
            widget.id = 'skmGoalWidget';
            widget.className = 'skm-goal-card';
            // ⚡ FIX: ថែម white-space: nowrap និង flex-shrink: 0 ការពារអក្សរធ្លាក់ជួរ
            widget.innerHTML = `
                <i class="fa-solid fa-gear skm-goal-setting-btn" onclick="window.openGoalSettingsModal()" title="ការកំណត់គោលដៅ"></i>
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; font-weight:bold; padding-right: 18px; gap: 8px;">
                    <span style="color:var(--text-main); display:flex; align-items:center; gap:6px; white-space: nowrap; flex-shrink: 0;">
                        <span style="font-size:16px;">🎯</span> គោលដៅថ្ងៃនេះ
                    </span>
                    <span id="skmGoalText" style="font-family:'Arial'; font-size:13px; font-weight:900; white-space: nowrap; text-align: right;"></span>
                </div>
                <div class="skm-progress-bar-bg">
                    <div class="skm-progress-bar-fill" id="skmGoalFill"></div>
                </div>
                <div id="skmGoalMessage" style="font-size:12px; margin-top:8px; text-align:right; font-weight:600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></div>
            `;
            cartSummary.insertBefore(widget, cartSummary.firstChild);
        } else {
            widget.style.display = 'block'; 
        }

        window.updateGoalProgress();
    }

    // --- ៤. មុខងារធ្វើបច្ចុប្បន្នភាពតួលេខលក់ ---
    window.updateGoalProgress = function() {
        const settings = getGoalSettings();
        if (!settings.enabled) return;

        const fill = document.getElementById('skmGoalFill');
        const text = document.getElementById('skmGoalText');
        const widget = document.getElementById('skmGoalWidget');
        const msg = document.getElementById('skmGoalMessage');
        
        if (!fill || !text || !widget || !msg) return;

        let todaySales = 0;
        const targetGoal = parseFloat(settings.target) || 500;
        const today = new Date();
        
        if (window.invoices && Array.isArray(window.invoices)) {
            window.invoices.forEach(inv => {
                const invDate = new Date(inv.timestamp || Date.now());
                if (inv.status === 'paid' && 
                    invDate.getDate() === today.getDate() && 
                    invDate.getMonth() === today.getMonth() && 
                    invDate.getFullYear() === today.getFullYear()) {
                    
                    todaySales += parseFloat(inv.totalAmount || 0);
                }
            });
        }

        let percent = targetGoal > 0 ? (todaySales / targetGoal) * 100 : 100;
        let displayPercent = percent > 100 ? 100 : percent;

        fill.style.width = displayPercent + '%';
        text.innerHTML = `<span style="color:var(--text-main);">$${todaySales.toFixed(2)}</span> / <span style="color:var(--primary);">$${targetGoal.toFixed(2)}</span> <span style="color:var(--text-muted); font-size:11px;">(${percent.toFixed(0)}%)</span>`;

        if (percent >= 100) {
            widget.style.borderColor = 'var(--success)';
            fill.style.background = 'var(--success)';
            msg.innerHTML = '<span style="color:var(--success);">🎉 អបអរសាទរ! សម្រេចគោលដៅហើយ! 🏆</span>';
        } else {
            widget.style.borderColor = 'var(--primary)';
            fill.style.background = 'var(--primary)';
            msg.innerHTML = `<span style="color:var(--text-muted);">ខ្វះ <strong style="color:var(--danger);">$${(targetGoal - todaySales).toFixed(2)}</strong> ទៀតដល់គោលដៅ! 💪</span>`;
        }
    };

    // --- ៥. ផ្ទាំងកំណត់គោលដៅ (Settings Modal) ---
    window.closeGoalSettingsModal = function() {
        const modal = document.getElementById('skmGoalSettingsModal');
        if(modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.style.display = 'none', 200);
        }
    };

    window.saveGoalSettingsModal = function() {
        const enabled = document.getElementById('skmGoalToggle').checked;
        const target = parseFloat(document.getElementById('skmGoalTargetInput').value) || 500;
        
        saveGoalSettings({ enabled, target });
        
        if (!enabled) {
            const widget = document.getElementById('skmGoalWidget');
            if (widget) widget.style.display = 'none';
        } else {
            injectGoalWidget();
            window.updateGoalProgress();
        }
        
        window.closeGoalSettingsModal();
        if (typeof window.showToast === 'function') window.showToast('✅ រក្សាទុកការកំណត់គោលដៅជោគជ័យ!');
    };

    window.openGoalSettingsModal = function() {
        if(typeof window.skmCloseAllModals === 'function') window.skmCloseAllModals();

        let modal = document.getElementById('skmGoalSettingsModal');
        const settings = getGoalSettings();

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmGoalSettingsModal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                opacity: 0; transition: opacity 0.2s ease; backdrop-filter: blur(3px);
            `;
            
            modal.innerHTML = `
                <div style="background: var(--bg-card, #fff); width: 95%; max-width: 380px; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 40px rgba(0,0,0,0.3); overflow: hidden; font-family: 'Battambang';">
                    <div style="padding: 15px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.05);">
                        <h3 style="margin:0; font-size: 16px; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                            <span style="color:var(--primary); font-size: 18px;">🎯</span> ការកំណត់គោលដៅលក់
                        </h3>
                        <button onclick="window.closeGoalSettingsModal()" style="background:var(--bg-alt, rgba(128,128,128,0.1)); border:none; color:var(--text-main); width:30px; height:30px; border-radius:50%; font-size:14px; cursor:pointer; font-weight:bold; transition: 0.2s;">✕</button>
                    </div>
                    <div style="padding: 20px;">
                        <label style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; margin-bottom: 20px; font-weight: bold; color:var(--text-main); font-size: 14px; background: rgba(128,128,128,0.05); padding: 12px; border-radius: 10px; border: 1px dashed var(--border);">
                            <span><i class="fa-solid fa-eye"></i> បង្ហាញផ្ទាំងគោលដៅ (Show)</span>
                            <input type="checkbox" id="skmGoalToggle" style="width:20px; height:20px; accent-color: var(--primary); cursor:pointer;">
                        </label>
                        
                        <div style="margin-bottom: 10px;">
                            <label style="display:block; font-size: 13px; color: var(--text-muted); margin-bottom: 8px; font-weight: 600;">ទឹកប្រាក់គោលដៅប្រចាំថ្ងៃ ($):</label>
                            <input type="number" id="skmGoalTargetInput" style="width: 100%; height: 48px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-input, transparent); color: var(--text-main); font-size: 20px; font-weight: bold; outline: none; text-align: center; font-family: 'Arial'; transition: 0.2s;" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">
                        </div>
                    </div>
                    <div style="padding: 15px 20px; border-top: 1px solid var(--border); display: flex; gap: 10px; background: rgba(0,0,0,0.02);">
                        <button onclick="window.closeGoalSettingsModal()" style="flex:1; padding: 12px; border-radius: 10px; border: 1px solid var(--border); background: transparent; color: var(--text-main); cursor: pointer; font-weight: bold; font-family: 'Battambang'; transition: 0.2s;">បោះបង់</button>
                        <button onclick="window.saveGoalSettingsModal()" style="flex:1; padding: 12px; border-radius: 10px; border: none; background: var(--primary); color: #fff; cursor: pointer; font-weight: bold; font-family: 'Battambang'; transition: 0.2s;">រក្សាទុក</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.closeGoalSettingsModal(); });
        }

        document.getElementById('skmGoalToggle').checked = settings.enabled;
        document.getElementById('skmGoalTargetInput').value = settings.target;

        modal.style.display = 'flex';
        setTimeout(() => { modal.style.opacity = '1'; }, 10);
    };

    // --- ៦. ដំណើរការប្រព័ន្ធ (Init) ---
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🎯', 'កំណត់គោលដៅ (Goal)', window.openGoalSettingsModal);
            clearInterval(initInt);
        }
        
        if (document.getElementById('cartSummaryBody')) {
            injectGoalWidget();
        }
    }, 1000);

    setInterval(() => {
        if (document.getElementById('skmGoalWidget') && document.getElementById('skmGoalWidget').style.display !== 'none') {
            window.updateGoalProgress();
        }
    }, 2000);

})();