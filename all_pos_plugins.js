/**

 * ============================================================================

 * SKM INTEGRATE POS - ALL-IN-ONE POS PLUGINS BUNDLE (43 Toggleable Plugins)

 * File: all_pos_plugins.js (Root Folder)

 * Hosted on GitHub Pages (0 Bytes Supabase Egress/Storage)

 * ============================================================================

 */

// ============================================================================
// SKM SMART PLUGIN TOGGLE ENGINE (GitHub Hosted + Per-Branch On/Off Control)
// ============================================================================
(function() {
    if (window.__SKM_PLUGIN_CONTROLLER_READY__) return;
    window.__SKM_PLUGIN_CONTROLLER_READY__ = true;

    const DEFAULT_ENABLED = {
        menu: ["ai_gemini_ai_concierge.js", "budget_finder.js", "camera_barcode_scanner.js", "care_recipe_guide.js", "code_artifact (4).js", "delivery_notes.js", "digital_member_id.js", "quick_price_check.js", "quick_reorder.js", "scheduled_pickup.js", "store_status.js", "substitute_finder.js", "voice_search.js"],
        pos: ["គោលដៅលក់ប្រចាំថ្ងៃ (Sales Goal).js", "ចង្កូត (Shortcut Navigator).js", "ចាក់សោរអេក្រង់ (Privacy Lock).js", "បូកសរុបវិក្កយបត្រតាមឈ្មោះអតិថិជន ឬ លេខទូរស័ព្ទ (Customer Bill Summary).js", "ប៊ូតុងគិតលុយរហ័ស (Quick Cash).js", "ប៊ូតុងអណ្តែតសម្រាប់ទំនាក់ទំនង (Floating Contact Bar).js", "ផ្អាកកន្ត្រក (Hold Order).js", "ម៉ាស៊ីនគិតលេខខ្នាតតូច (Mini Calculator).js", "⏰ កត់ត្រាម៉ោងការងារ (Time Clock).js", "☑️ កិច្ចការត្រូវធ្វើប្រចាំវេន daily_checklist.js", "⚖️ ផ្ទៀងផ្ទាត់លុយក្នុងទូរ (Cash Drawer Audit).js", "⚠️ កត់ត្រាទំនិញខូចខាត (Wastage Log).js", "⚡ ទំនិញរហ័ស.js", "⭐ ពិនិត្យពិន្ទុសមាជិក loyalty_points_checker.js", "🎂 អតិថិជន VIP & ថ្ងៃកំណើត (vip_birthday_reminder.js).js", "🏆 គណនាកម្រៃជើងសារបុគ្គលិក staff_commission.js", "🏷️ គណនាលក់បញ្ចុះតម្លៃរហ័ស (discount_helper.js).js", "🏷️ បង្កើតស្លាកតម្លៃទំនិញ price_tag.js", "💬 សាររំលឹកទារប្រាក់ (Debt Reminder & SMS).js", "💰 គណនាតម្លៃលក់ & ចំណេញ (Margin Calculator).js", "💳 សង្ខេបចំណូលតាមប្រភេទបង់ប្រាក់ payment_breakdown.js", "💵 ប្រអប់រាប់សាច់ប្រាក់បិទវេន (Cash Count).js", "💼 ចរន្តសាច់ប្រាក់ (Cash InOut).js", "📈 សង្ខេបការចំណាយតាមប្រភេទ expense_summary.js", "📉 កត់ត្រាចំណាយរហ័ស.js", "📊 របាយការណ៍ម៉ោងការងារប្រចាំខែ monthly_staff_report.js", "📊 សង្ខេបការលក់ថ្ងៃនេះ.js", "📋 វិក្កយបត្រលក់ចុងក្រោយ (10 ចុងក្រោយ).js", "📌 ក្ដារខៀនប្រកាសព័ត៌មានហាង noticeboard.js", "📑 របាយការណ៍បិទវេនលក់ (Z-Report).js", "📝 កំណត់ចំណាំរហ័ស (Cashier Notes).js", "🔄 បង្វិលសងប្រាក់ (Quick Refund).js", "🔤 បង្កើត BarcodeSKU (Barcode Generator).js", "🕒 នាឡិកាមានជីវិត (Blinking Colon).js", "🚚 គ្រប់គ្រងការដឹកជញ្ជូនអនឡាញ (Delivery).js", "🛒 បញ្ជីទំនិញត្រូវបញ្ជាទិញបន្ថែម reorder_list.js", "🤝 កំណត់ហេតុផ្ទេរវេន (Shift Handover Log).js", "🪙 គណនាប្រាក់អាប់ (Change Denomination Helper).js", "🪙 ប្រាក់ដើមក្នុងទូរពេលបើកវេន opening_float.js"]
    };

    const registry = { menu: {}, pos: {} };
    const executed = { menu: new Set(), pos: new Set() };

    // Map specific DOM element IDs to plugin file keys so disabling hides them live
    const DOM_CLEANUP_MAP = {
        "ម៉ាស៊ីនគិតលេខខ្នាតតូច (Mini Calculator).js": ["skm-calc-btn"],
        "ចាក់សោរអេក្រង់ (Privacy Lock).js": ["skm-privacy-btn-trigger"],
        "ប៊ូតុងអណ្តែតសម្រាប់ទំនាក់ទំនង (Floating Contact Bar).js": ["skm-floating-bar-container"],
        "🕒 នាឡិកាមានជីវិត (Blinking Colon).js": ["skm-live-clock"],
        "គោលដៅលក់ប្រចាំថ្ងៃ (Sales Goal).js": ["skmGoalWidget"],
        "📋 វិក្កយបត្រលក់ចុងក្រោយ (10 ចុងក្រោយ).js": ["skmLastSaleBtn"],
        "⚡ ទំនិញរហ័ស.js": ["skmQuickCustomBtn"],
        "💵 ប្រអប់រាប់សាច់ប្រាក់បិទវេន (Cash Count).js": ["skmCashCountBtn"],
        "ផ្អាកកន្ត្រក (Hold Order).js": ["skm-hold-action-group"],
        "ប៊ូតុងគិតលុយរហ័ស (Quick Cash).js": ["skmQuickCashGrid"]
    };

    function getBranchId() {
        try {
            return window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        } catch(e) {
            return 'branch_1';
        }
    }

    function readActivePluginsFromStorage() {
        const br = getBranchId();
        try {
            if (window.sysSettings && window.sysSettings.activePlugins && typeof window.sysSettings.activePlugins === 'object') {
                return window.sysSettings.activePlugins;
            }
            const raw = localStorage.getItem(`ks2_${br}_sys_settings`);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.activePlugins && typeof parsed.activePlugins === 'object') {
                    return parsed.activePlugins;
                }
            }
        } catch(e) {}
        return null;
    }

    function normalizeName(s) {
        return String(s || '').trim();
    }

    window.skmApplyActivePlugins = function(activePluginsObj) {
        const cfg = activePluginsObj || readActivePluginsFromStorage() || DEFAULT_ENABLED;
        ['pos', 'menu'].forEach(scope => {
            const rawList = Array.isArray(cfg[scope]) ? cfg[scope] : DEFAULT_ENABLED[scope];
            const enabledSet = new Set(rawList.map(normalizeName));
            if (!window.__SKM_ENABLED_SETS__) window.__SKM_ENABLED_SETS__ = {};
            window.__SKM_ENABLED_SETS__[scope] = enabledSet;

            Object.keys(registry[scope]).forEach(key => {
                const normKey = normalizeName(key);
                const isOn = enabledSet.has(normKey);
                if (isOn) {
                    if (!executed[scope].has(normKey)) {
                        executed[scope].add(normKey);
                        window.__SKM_CURRENT_PLUGIN_KEY__ = normKey;
                        try {
                            registry[scope][key]();
                        } catch(err) {
                            console.error(`[SKM Plugin Error] ${key}:`, err);
                        } finally {
                            window.__SKM_CURRENT_PLUGIN_KEY__ = null;
                        }
                    }
                    // Ensure DOM elements are visible if previously hidden
                    (DOM_CLEANUP_MAP[key] || []).forEach(domId => {
                        const el = document.getElementById(domId);
                        if (el) el.style.display = '';
                    });
                } else {
                    // Hide DOM elements if plugin was turned OFF
                    (DOM_CLEANUP_MAP[key] || []).forEach(domId => {
                        const el = document.getElementById(domId);
                        if (el) el.style.display = 'none';
                    });
                }
            });
        });
        if (typeof window.__SKM_REFRESH_MENU_TOOLBOX__ === 'function') window.__SKM_REFRESH_MENU_TOOLBOX__();
        if (typeof window.__SKM_REFRESH_POS_TOOLBOX__ === 'function') window.__SKM_REFRESH_POS_TOOLBOX__();
    };

    window.skmRegisterBundledPlugin = function(scope, key, initFn) {
        if (!registry[scope]) registry[scope] = {};
        registry[scope][key] = initFn;
        const cfg = readActivePluginsFromStorage();
        if (cfg && Array.isArray(cfg[scope])) {
            const enabledSet = new Set(cfg[scope].map(normalizeName));
            if (enabledSet.has(normalizeName(key)) && !executed[scope].has(normalizeName(key))) {
                executed[scope].add(normalizeName(key));
                window.__SKM_CURRENT_PLUGIN_KEY__ = normalizeName(key);
                try { initFn(); } catch(err) { console.error(`[SKM Plugin Error] ${key}:`, err); }
                finally { window.__SKM_CURRENT_PLUGIN_KEY__ = null; }
            }
        }
    };

    // Fallback check after DOM ready in case branch has never saved activePlugins yet
    function bootCheck() {
        const cfg = readActivePluginsFromStorage();
        if (cfg) {
            window.skmApplyActivePlugins(cfg);
        } else {
            setTimeout(() => {
                window.skmApplyActivePlugins(readActivePluginsFromStorage() || DEFAULT_ENABLED);
            }, 1800);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootCheck);
    } else {
        bootCheck();
    }
})();

;
// === [CORE] smart_toolbox_hub_pro.js ===
/* STREAMING_CHUNK:Initializing Premium Smart Toolbox Hub with Text Fix... */
(function() {
    console.log("🛠️ POS Premium Smart Toolbox Pro Initialized (Fixed Text Color)!");
    if(document.getElementById('skm-toolbox')) return;

    /* STREAMING_CHUNK:Injecting Fixed CSS Styles... */
    const style = document.createElement('style');
    style.innerHTML = `
        .skm-toolbox-container { position: fixed; bottom: 25px; right: 25px; z-index: 99000; transition: opacity 0.3s ease; font-family: 'Kantumruy Pro', 'Battambang', 'Nunito', sans-serif; }
        
        /* Master FAB Button */
        .skm-master-fab { width: 62px; height: 62px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #2563eb); color: #fff; border: none; font-size: 28px; cursor: grab; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4); display: flex; justify-content: center; align-items: center; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); user-select: none; }
        .skm-master-fab:active { cursor: grabbing; transform: scale(0.9); }
        .skm-master-fab:hover:not(:active) { transform: scale(1.08) rotate(10deg); box-shadow: 0 15px 35px rgba(37, 99, 235, 0.5); }
        
        /* Popup Menu Box - Explicit White Background */
        .skm-toolbox-popup { position: absolute; bottom: 80px; right: 0; z-index: 99995; background: #ffffff !important; border: 1px solid #cbd5e1 !important; width: 330px; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); display: none; flex-direction: column; overflow: hidden; }
        .skm-toolbox-popup.show { display: flex; animation: popUpMenu 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes popUpMenu { 0% { opacity: 0; transform: translateY(30px) scale(0.85); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        
        /* Header */
        .skm-toolbox-header { padding: 18px 20px; border-bottom: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center; background: rgba(248, 250, 252, 0.9); }
        .skm-toolbox-title { font-size: 16px; font-weight: 900; color: #0284c7 !important; display: flex; align-items: center; gap: 8px; margin: 0; }
        
        /* Header Action Buttons */
        .skm-header-actions { display:flex; gap: 8px; align-items: center; }
        .skm-action-btn { width: 34px; height: 34px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; font-size: 14px; user-select: none; }
        .skm-action-btn:hover { background: #e0f2fe; color: #0ea5e9; border-color: #bae6fd; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15); }
        .skm-action-btn.skm-close-btn:hover { background: #fee2e2; color: #ef4444; border-color: #fca5a5; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.15); }
        .skm-pin-btn.active { background: #fee2e2; color: #ef4444; border-color: #fca5a5; transform: rotate(-15deg); box-shadow: 0 4px 10px rgba(239, 68, 68, 0.15); }
        
        /* Body & Scrollbar */
        .skm-toolbox-body { padding: 15px; display: flex; flex-direction: column; gap: 10px; max-height: 55vh; overflow-y: auto; background: #ffffff !important; }
        .skm-toolbox-body::-webkit-scrollbar { width: 6px; }
        .skm-toolbox-body::-webkit-scrollbar-track { background: transparent; }
        .skm-toolbox-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .skm-toolbox-body::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        /* List Items - 🌟 FIX: Explicit Dark Text Color & Clean White Background */
        .skm-tool-wrapper { position: relative; display: flex; align-items: center; width: 100%; box-sizing: border-box; }
        .skm-tool-item { flex: 1; background: #f8fafc !important; border: 1px solid #cbd5e1 !important; color: #1e293b !important; padding: 12px 16px; border-radius: 16px; cursor: pointer; text-align: left; font-size: 14px; font-weight: 800 !important; display: flex; align-items: center; gap: 12px; transition: 0.3s; font-family: 'Battambang', sans-serif !important; box-shadow: 0 2px 4px rgba(0,0,0,0.03); }
        .skm-tool-item:hover { background: #ffffff !important; border-color: #38bdf8 !important; color: #0284c7 !important; transform: translateY(-2px) translateX(2px); box-shadow: 0 6px 15px rgba(56, 189, 248, 0.15); }
        .skm-tool-icon-wrap { font-size: 20px; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; background: #ffffff !important; border: 1px solid #cbd5e1 !important; border-radius: 12px; transition: 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.04); flex-shrink: 0; }
        .skm-tool-item:hover .skm-tool-icon-wrap { background: #e0f2fe !important; border-color: #bae6fd !important; transform: scale(1.1) rotate(5deg); }
        
        /* Edit Mode Styles */
        .skm-toolbox-body.edit-mode .skm-tool-wrapper { border: 1.5px dashed #cbd5e1; border-radius: 16px; padding-right: 90px; background: #f8fafc; transition: 0.2s; }
        .skm-toolbox-body.edit-mode .skm-tool-wrapper:hover { border-color: #94a3b8; background: #f1f5f9; }
        .skm-toolbox-body.edit-mode .skm-tool-item { box-shadow: none; pointer-events: none; border: none; background: transparent !important; color: #1e293b !important; transform: none !important; }
        .skm-toolbox-body.edit-mode .skm-tool-controls { display: flex; }
        .skm-tool-controls { display: none; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); gap: 6px; }
        .skm-tool-ctrl-btn { width: 34px; height: 34px; border-radius: 10px; border: 1px solid #cbd5e1; background: #ffffff; cursor: pointer; font-size: 14px; transition: 0.2s; display: flex; align-items: center; justify-content: center; opacity: 0.6; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .skm-tool-ctrl-btn:hover { opacity: 1; border-color: #94a3b8; background: #f1f5f9; transform: translateY(-1px); }
        .skm-tool-ctrl-btn.active { opacity: 1; border-color: #f59e0b; background: #fffbeb; color: #d97706; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.2); }
        .skm-tool-wrapper.hidden-tool { opacity: 0.45; filter: grayscale(1); }
        .skm-tool-wrapper.hidden-tool .skm-tool-item { text-decoration: line-through; }
        body:not(.skm-edit-active) .skm-tool-wrapper.hidden-tool { display: none !important; }
        
        /* Mini Hidden FAB */
        .skm-mini-fab { position: fixed; right: -15px; top: 50%; transform: translateY(-50%); width: 45px; height: 60px; background: rgba(14, 165, 233, 0.9); border-radius: 14px 0 0 14px; display: none; justify-content: flex-start; align-items: center; padding-left: 8px; color: white; cursor: pointer; z-index: 99000; box-shadow: -4px 0 15px rgba(14, 165, 233, 0.4); backdrop-filter: blur(5px); transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); font-size: 22px; }
        .skm-mini-fab:hover { right: 0; background: #0284c7; padding-left: 12px; }
    `;
    document.head.appendChild(style);

    /* STREAMING_CHUNK:Building DOM Structure... */
    const container = document.createElement('div');
    container.className = 'skm-toolbox-container';
    container.id = 'skm-toolbox';
    container.innerHTML = `
        <button class="skm-master-fab" id="skmMasterFab" title="ប្រអប់ឧបករណ៍ POS">⚙️</button>
        <div class="skm-toolbox-popup" id="skmToolboxPopup">
            <div class="skm-toolbox-header">
                <h3 class="skm-toolbox-title">
                    <span style="font-size: 20px;">⚡</span> ឧបករណ៍ (Tools)
                </h3>
                <div class="skm-header-actions">
                    <div class="skm-action-btn" id="skmEditBtn" title="រៀបចំមុខងារ (Edit)" onclick="window.skmToggleEditMode(event)">🛠️</div>
                    <div class="skm-action-btn skm-pin-btn" id="skmPinBtn" title="Pin ឱ្យជាប់ (Pin)" onclick="window.skmTogglePin(event)">📌</div>
                    <div class="skm-action-btn" title="លាក់ប្រអប់ (Hide)" onclick="window.skmHideFab(event)">👁️</div>
                    <div class="skm-action-btn skm-close-btn" title="បិទ (Close)" onclick="document.getElementById('skmToolboxPopup').classList.remove('show')">✕</div>
                </div>
            </div>
            <div class="skm-toolbox-body" id="skmToolboxMenuBody"></div>
        </div>
    `;
    container.style.display = 'none';
    document.body.appendChild(container);

    const miniFab = document.createElement('div');
    miniFab.className = 'skm-mini-fab';
    miniFab.id = 'skm-mini-fab';
    miniFab.innerHTML = '⚙️️';
    miniFab.title = 'បង្ហាញប្រអប់ឧបករណ៍វិញ (Show Toolbox)';
    document.body.appendChild(miniFab);

    const fab = document.getElementById('skmMasterFab');
    const popup = document.getElementById('skmToolboxPopup');

    let isDragging = false, hasMoved = false, startX, startY, initialLeft, initialTop;
    let isPinned = localStorage.getItem('skm_toolbox_pinned') === 'true';

    if(isPinned) document.getElementById('skmPinBtn').classList.add('active');

    // Load saved position
    const savedPos = JSON.parse(localStorage.getItem('skm_fab_pos'));
    if(savedPos) {
        container.style.right = 'auto'; container.style.bottom = 'auto';
        container.style.left = savedPos.left; container.style.top = savedPos.top;
    }

    /* STREAMING_CHUNK:Implementing Drag and Drop Logic... */
    fab.addEventListener('mousedown', (e) => {
        isDragging = true; hasMoved = false;
        startX = e.clientX; startY = e.clientY;
        const rect = container.getBoundingClientRect();
        initialLeft = rect.left; initialTop = rect.top;
        
        container.style.right = 'auto'; container.style.bottom = 'auto';
        container.style.left = initialLeft + 'px'; container.style.top = initialTop + 'px';
        container.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if(!isDragging) return;
        const dx = e.clientX - startX; const dy = e.clientY - startY;
        if(Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved = true;

        let newLeft = initialLeft + dx; let newTop = initialTop + dy;
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 65));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - 65));
        
        container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';

        if (newLeft > window.innerWidth / 2) { popup.style.left = 'auto'; popup.style.right = '0'; } 
        else { popup.style.right = 'auto'; popup.style.left = '0'; }
        if (newTop > window.innerHeight / 2) { popup.style.top = 'auto'; popup.style.bottom = '75px'; } 
        else { popup.style.bottom = 'auto'; popup.style.top = '75px'; }
    });

    document.addEventListener('mouseup', () => {
        if(isDragging) {
            container.style.transition = 'opacity 0.3s ease';
            if(hasMoved) localStorage.setItem('skm_fab_pos', JSON.stringify({left: container.style.left, top: container.style.top}));
        }
        isDragging = false;
    });

    // Touch Support
    fab.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        isDragging = true; hasMoved = false;
        startX = touch.clientX; startY = touch.clientY;
        const rect = container.getBoundingClientRect();
        initialLeft = rect.left; initialTop = rect.top;
        
        container.style.right = 'auto'; container.style.bottom = 'auto';
        container.style.left = initialLeft + 'px'; container.style.top = initialTop + 'px';
        container.style.transition = 'none';
    }, {passive: true});

    document.addEventListener('touchmove', (e) => {
        if(!isDragging) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX; const dy = touch.clientY - startY;
        if(Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved = true;
        
        let newLeft = initialLeft + dx; let newTop = initialTop + dy;
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 65));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - 65));
        container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';
    }, {passive: true});

    document.addEventListener('touchend', () => {
        if(isDragging && hasMoved) localStorage.setItem('skm_fab_pos', JSON.stringify({left: container.style.left, top: container.style.top}));
        container.style.transition = 'opacity 0.3s ease';
        isDragging = false;
    });

    fab.onclick = (e) => {
        e.stopPropagation();
        if(hasMoved) return;
        popup.classList.toggle('show');
    };

    window.skmTogglePin = function(e) {
        e.stopPropagation();
        isPinned = !isPinned;
        localStorage.setItem('skm_toolbox_pinned', isPinned);
        document.getElementById('skmPinBtn').classList.toggle('active', isPinned);
    };

    let isUserMinimized = false;
    window.skmHideFab = function(e) {
        e.stopPropagation();
        isUserMinimized = true;
        popup.classList.remove('show');
        container.style.display = 'none';
        miniFab.style.display = 'flex';
    };

    miniFab.onclick = () => {
        isUserMinimized = false;
        miniFab.style.display = 'none';
        container.style.display = 'block';
    };

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && popup.classList.contains('show') && !isPinned) {
            popup.classList.remove('show');
        }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            popup.classList.remove('show');
            document.querySelectorAll('div[style*="z-index: 100000"]').forEach(m => {
                if(m.style.display !== 'none') m.style.display = 'none';
            });
        }
    });

    /* STREAMING_CHUNK:Implementing Tool Preferences & Rendering... */
    let toolPrefs = JSON.parse(localStorage.getItem('skm_tool_prefs')) || {};
    let isEditMode = false;
    let allRegisteredTools = [];

    window.skmToggleEditMode = function(e) {
        e.stopPropagation();
        isEditMode = !isEditMode;
        const body = document.getElementById('skmToolboxMenuBody');
        const editBtn = document.getElementById('skmEditBtn');
        if (isEditMode) {
            body.classList.add('edit-mode');
            document.body.classList.add('skm-edit-active');
            editBtn.style.background = '#e0f2fe';
            editBtn.style.color = '#0ea5e9';
            editBtn.style.borderColor = '#bae6fd';
        } else {
            body.classList.remove('edit-mode');
            document.body.classList.remove('skm-edit-active');
            editBtn.style.background = '';
            editBtn.style.color = '';
            editBtn.style.borderColor = '';
        }
        renderToolboxList();
    };

    window.skmToggleToolPref = function(toolText, type, e) {
        e.stopPropagation();
        if (!toolPrefs[toolText]) toolPrefs[toolText] = { hidden: false, pinned: false };
        toolPrefs[toolText][type] = !toolPrefs[toolText][type];
        localStorage.setItem('skm_tool_prefs', JSON.stringify(toolPrefs));
        renderToolboxList();
    };

    function renderToolboxList() {
        const menuBody = document.getElementById('skmToolboxMenuBody');
        if(!menuBody) return;
        menuBody.innerHTML = '';
        
        let sortedTools = [...allRegisteredTools].sort((a, b) => {
            let aPin = toolPrefs[a.text]?.pinned ? 1 : 0;
            let bPin = toolPrefs[b.text]?.pinned ? 1 : 0;
            return bPin - aPin;
        });

        const enabledPosSet = window.__SKM_ENABLED_SETS__ && window.__SKM_ENABLED_SETS__.pos;
        let visibleToolsCount = 0;
        sortedTools.forEach(tool => {
            if (tool.pluginKey && enabledPosSet && !enabledPosSet.has(tool.pluginKey)) return;
            visibleToolsCount++;
            const pref = toolPrefs[tool.text] || { hidden: false, pinned: false };
            
            const wrapper = document.createElement('div');
            wrapper.className = 'skm-tool-wrapper';
            if (pref.hidden) wrapper.classList.add('hidden-tool');

            const btn = document.createElement('button');
            btn.className = 'skm-tool-item';
            btn.innerHTML = `
                <div class="skm-tool-icon-wrap">${tool.icon}</div>
                <span style="flex:1;">${tool.text}</span>
            `;
            btn.onclick = () => {
                if (isEditMode) return;
                popup.classList.remove('show'); 
                tool.onClickFunc(); 
            };

            const controls = document.createElement('div');
            controls.className = 'skm-tool-controls';
            
            controls.innerHTML = `
                <button class="skm-tool-ctrl-btn ${pref.pinned ? 'active' : ''}" title="Pin ទាញទៅលើគេ" onclick="window.skmToggleToolPref('${tool.text}', 'pinned', event)">📌</button>
                <button class="skm-tool-ctrl-btn ${pref.hidden ? 'active' : ''}" title="លាក់ / បង្ហាញ" onclick="window.skmToggleToolPref('${tool.text}', 'hidden', event)">${pref.hidden ? '🙈' : '👁️'}</button>
            `;

            wrapper.appendChild(btn);
            wrapper.appendChild(controls);
            menuBody.appendChild(wrapper);
        });
        if (visibleToolsCount === 0) {
            container.style.display = 'none';
            miniFab.style.display = 'none';
            popup.classList.remove('show');
        } else if (!isUserMinimized) {
            container.style.display = 'block';
        }
    }

    window.__SKM_REFRESH_POS_TOOLBOX__ = renderToolboxList;
    window.registerCustomTool = function(icon, text, onClickFunc, explicitKey) {
        const pluginKey = explicitKey || window.__SKM_CURRENT_PLUGIN_KEY__ || null;
        if (allRegisteredTools.find(t => t.text === text)) return;
        allRegisteredTools.push({ icon, text, onClickFunc, pluginKey });
        renderToolboxList();
    };
})();

;
// === [1/43] កំណត់ និងជ្រើសរើសលេខតុលេខកូដទីតាំងមុនពេលកុម្មង់ (Location  Counter Selection Plugin).js ===
window.skmRegisterBundledPlugin('pos', "កំណត់ និងជ្រើសរើសលេខតុលេខកូដទីតាំងមុនពេលកុម្មង់ (Location  Counter Selection Plugin).js", function() {
/* STREAMING_CHUNK:Initializing General Store Location Manager Plugin */
(function() {
    console.log("📍 General Store Location Manager Initialized!");

    const branchId = new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    let currentLocation = new URLSearchParams(window.location.search).get('table') || localStorage.getItem(`ks2_${branchId}_table_no`) || '';

    // 1. Inject General Store Styling (Neutral / Clean Theme)
    const style = document.createElement('style');
    style.innerHTML = `
        .skm-table-modal-bg {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(5px);
            z-index: 99999; display: flex; justify-content: center; align-items: center;
            font-family: 'Nunito', 'Battambang', sans-serif; padding: 20px;
            opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
        }
        .skm-table-modal-bg.show {
            opacity: 1; pointer-events: auto;
        }
        .skm-table-modal-box {
            background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b); max-width: 380px; width: 100%;
            padding: 25px; border-radius: 24px; border: 1px solid var(--border-color, #e5e7eb);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); text-align: center;
            transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .skm-table-modal-bg.show .skm-table-modal-box {
            transform: translateY(0) scale(1);
        }
        .skm-table-input {
            width: 100%; padding: 14px; border-radius: 14px; border: 1px solid var(--border-color, #e5e7eb);
            background: var(--store-bg, #f3f4f6); color: var(--text-dark, #1e293b); font-size: 18px; font-weight: bold;
            text-align: center; outline: none; margin: 15px 0; font-family: 'Nunito', 'Battambang', sans-serif;
        }
        .skm-table-input:focus { border-color: var(--brand-cyan, #06b6d4); }
        .skm-table-btn {
            background: var(--brand-cyan, #06b6d4); color: white; border: none;
            width: 100%; padding: 14px; border-radius: 14px; font-size: 15px; font-weight: 900;
            cursor: pointer; font-family: 'Nunito', 'Battambang', sans-serif; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
        }
        .skm-table-grid {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 15px;
        }
        .skm-table-pill {
            background: var(--store-bg, #f3f4f6); border: 1px solid var(--border-color, #e5e7eb); color: var(--text-dark, #1e293b);
            padding: 10px 0; border-radius: 10px; font-weight: bold; font-size: 14px;
            cursor: pointer; transition: 0.2s;
        }
        .skm-table-pill:hover, .skm-table-pill.active {
            background: var(--brand-cyan, #06b6d4); color: white; border-color: var(--brand-cyan, #06b6d4);
        }
    `;
    document.head.appendChild(style);

    // 2. Inject Modal HTML
    const modal = document.createElement('div');
    modal.className = 'skm-table-modal-bg';
    modal.id = 'skmStoreLocationModal';
    modal.innerHTML = `
        <div class="skm-table-modal-box" onclick="event.stopPropagation()">
            <div style="font-size: 36px; margin-bottom: 10px;">📍</div>
            <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 6px;">សូមជ្រើសរើស ឬវាយបញ្ចូលលេខតុ / លេខទីតាំង</h3>
            <p style="font-size: 12px; color: var(--text-muted, #64748b); margin-bottom: 15px;">សូមបញ្ជាក់លេខតុ ឬទីតាំងមុនពេលកុម្ម៉ង់ (Table / Location)</p>
            
            <div class="skm-table-grid" id="skmTableGrid">
                <div class="skm-table-pill" onclick="selectQuickLocation('1')">តុ 1</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('2')">តុ 2</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('3')">តុ 3</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('4')">តុ 4</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('5')">តុ 5</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('6')">តុ 6</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('7')">តុ 7</div>
                <div class="skm-table-pill" onclick="selectQuickLocation('8')">តុ 8</div>
            </div>

            <input type="text" id="skmCustomTableInput" class="input-st skm-table-input" placeholder="លេខតុ ឬ ទីតាំង (ឧ. 9 ឬ VIP)...">
            <button class="skm-table-btn" onclick="saveStoreLocation()">បញ្ជាក់ទីតាំង (Confirm)</button>
        </div>
    `;
    document.body.appendChild(modal);

    window.openStoreLocationModal = function() {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        if (currentLocation) {
            document.getElementById('skmCustomTableInput').value = currentLocation;
        }
    };

    window.closeStoreLocationModal = function() {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    };

    window.selectQuickLocation = function(locNum) {
        document.getElementById('skmCustomTableInput').value = locNum;
        saveStoreLocation();
    };

    window.saveStoreLocation = function() {
        const val = document.getElementById('skmCustomTableInput').value.trim();
        if (!val) {
            if (typeof showToast === 'function') showToast('សូមបញ្ចូលលេខតុ ឬទីតាំងសិន!', true);
            else alert('សូមបញ្ចូលលេខតុ ឬទីតាំងសិន!');
            return;
        }

        currentLocation = val;
        localStorage.setItem(`ks2_${branchId}_table_no`, val);

        // Update UI Badge
        const tbBadge = document.getElementById('tableBadgeDisplay');
        if (tbBadge) {
            tbBadge.innerText = `តុលេខ ${val}`;
            tbBadge.style.display = 'inline-block';
        }

        // Update Customer Name Input in Cart
        const cNameInput = document.getElementById('cName');
        if (cNameInput) {
            cNameInput.value = `តុលេខ ${val}`;
            cNameInput.style.display = 'none';
        }

        closeStoreLocationModal();
        if (typeof showToast === 'function') showToast(`បានកំណត់ទីតាំង ${val} ជោគជ័យ! ✅`);
    };

    // 3. Register Tool in Toolbox Hub automatically
    const initToolboxInterval = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📍', 'កំណត់/ប្តូរទីតាំងតុ (Table)', openStoreLocationModal, "កំណត់ និងជ្រើសរើសលេខតុលេខកូដទីតាំងមុនពេលកុម្មង់ (Location  Counter Selection Plugin).js");
            clearInterval(initToolboxInterval);
        } else if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📍', 'កំណត់/ប្តូរទីតាំង (Table)', openStoreLocationModal);
            clearInterval(initToolboxInterval);
        }
    }, 300);

    // 4. Only update badge if location exists (no intrusive auto-popup on POS)
    setTimeout(() => {
        if (currentLocation) {
            const tbBadge = document.getElementById('tableBadgeDisplay');
            if (tbBadge) {
                tbBadge.innerText = `តុលេខ ${currentLocation}`;
                tbBadge.style.display = 'inline-block';
            }
            const cNameInput = document.getElementById('cName');
            if (cNameInput) {
                cNameInput.value = `តុលេខ ${currentLocation}`;
                cNameInput.style.display = 'none';
            }
        }
    }, 800);
})();
});

;
// === [2/43] គោលដៅលក់ប្រចាំថ្ងៃ (Sales Goal).js ===
window.skmRegisterBundledPlugin('pos', "គោលដៅលក់ប្រចាំថ្ងៃ (Sales Goal).js", function() {
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
            window.registerCustomTool('🎯', 'កំណត់គោលដៅ (Goal)', window.openGoalSettingsModal, "គោលដៅលក់ប្រចាំថ្ងៃ (Sales Goal).js");
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
    }, 5000);

})();
});

;
// === [3/43] ចង្កូត (Shortcut Navigator).js ===
window.skmRegisterBundledPlugin('pos', "ចង្កូត (Shortcut Navigator).js", function() {
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
});

;
// === [4/43] ចាក់សោរអេក្រង់ (Privacy Lock).js ===
window.skmRegisterBundledPlugin('pos', "ចាក់សោរអេក្រង់ (Privacy Lock).js", function() {
(function() {
    // ⚡ ការពារកុំឱ្យកូដដំណើរការជាន់គ្នា២ដង
    if (window.skmPrivacyLockActive) return;
    window.skmPrivacyLockActive = true;

    console.log("🔒 POS Ultra-Premium Privacy Lock (V5 Smart Setup) Initialized!");

    // ==========================================
    // ⏱ ទាញយកនាទីដែលមេធ្លាប់កំណត់ពីប្រព័ន្ធ (បើអត់មាន យក ១០ នាទី)
    // ==========================================
    let LOCK_MINUTES = parseFloat(localStorage.getItem('skm_privacy_idle_time')) || 10; 
    
    let idleTimer;
    let isLocked = false;
    let pinCode = '';

    function getValidPin() {
        let validPin = '1234'; 
        if (window.activeUser && window.activeUser.pin && window.activeUser.pin !== '0000') {
            validPin = String(window.activeUser.pin).trim();
        } else if (window.sysSettings && window.sysSettings.storePin) {
            validPin = String(window.sysSettings.storePin).trim();
        }
        return validPin;
    }

    // ១. បញ្ចូលប៊ូតុងចាក់សោ
    function injectLockBtn() {
        const headerDisplay = document.getElementById('currentUserDisplay');
        if (!headerDisplay || document.getElementById('skm-privacy-btn-trigger')) return;
        
        const lockBtn = document.createElement('button');
        lockBtn.id = 'skm-privacy-btn-trigger';
        lockBtn.innerHTML = '🔒';
        lockBtn.title = 'ចាក់សោរអេក្រង់ (Lock Screen) - ចុច Ctrl+L';
        
        lockBtn.style.cssText = `
            background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4);
            width: 36px; height: 36px; border-radius: 50%; font-size: 14px; cursor: pointer;
            margin-left: 10px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: flex; 
            justify-content: center; align-items: center; padding: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05); flex-shrink: 0;
        `;
        lockBtn.onmouseover = () => { 
            lockBtn.style.background = '#ef4444'; lockBtn.style.color = '#fff';
            lockBtn.style.transform = 'scale(1.05)'; lockBtn.style.boxShadow = '0 5px 15px rgba(239, 68, 68, 0.3)';
        };
        lockBtn.onmouseout = () => { 
            lockBtn.style.background = 'rgba(239, 68, 68, 0.15)'; lockBtn.style.color = '#ef4444';
            lockBtn.style.transform = 'scale(1)'; lockBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
        };
        
        lockBtn.addEventListener('click', lockScreen);
        headerDisplay.parentNode.insertBefore(lockBtn, headerDisplay.nextSibling);
    }

    // ២. បង្កើតផ្ទាំង Lock Screen
    function createLockModal() {
        if(document.getElementById('skm-privacy-lock-modal')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            .skm-privacy-glass {
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.98));
                backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
                border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 28px; padding: 35px 30px; 
                width: 340px; box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.2); 
                text-align: center; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-family: 'Battambang', sans-serif; position: relative;
            }
            .skm-privacy-glass.shake { animation: skmPrivacyShake 0.4s both; border-color: #ef4444; }
            @keyframes skmPrivacyShake {
                10%, 90% { transform: translate3d(-2px, 0, 0); }
                20%, 80% { transform: translate3d(4px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
                40%, 60% { transform: translate3d(6px, 0, 0); }
            }
            .skm-privacy-icon {
                width: 70px; height: 70px; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1);
                border-radius: 50%; display: flex; justify-content: center; align-items: center;
                font-size: 30px; margin: 0 auto 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            }
            .skm-privacy-dots-container {
                display: flex; justify-content: center; gap: 15px; margin-bottom: 30px; height: 20px;
            }
            .skm-privacy-dot {
                width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2);
                transition: all 0.2s ease;
            }
            .skm-privacy-dot.filled {
                background: #10b981; border-color: #10b981; box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
            }
            .skm-privacy-dot.error {
                background: #ef4444; border-color: #ef4444; box-shadow: 0 0 12px rgba(239, 68, 68, 0.6);
            }
            .skm-privacy-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; justify-items: center; }
            .skm-privacy-btn {
                background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #fff;
                width: 65px; height: 65px; border-radius: 50%; font-size: 22px; font-weight: bold; 
                cursor: pointer; transition: all 0.2s; font-family: 'Nunito', sans-serif;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: flex; justify-content: center; align-items: center;
                user-select: none;
            }
            .skm-privacy-btn:hover { background: rgba(16, 185, 129, 0.2); border-color: #10b981; transform: translateY(-2px); }
            .skm-privacy-btn:active { transform: scale(0.9); }
            .skm-privacy-btn.clear { color: #f59e0b; font-size: 20px; }
            
            /* ⚡ រចនាប័ទ្មប៊ូតុងកង់ស្ពឺ (Settings) */
            .skm-privacy-settings-btn {
                position: absolute; top: 20px; right: 20px; font-size: 22px; cursor: pointer;
                color: rgba(255,255,255,0.3); transition: all 0.3s ease; padding: 5px; border-radius: 50%;
            }
            .skm-privacy-settings-btn:hover {
                color: #fff; background: rgba(255,255,255,0.1); transform: rotate(90deg);
            }
        `;
        document.head.appendChild(style);

        const modal = document.createElement('div');
        modal.id = 'skm-privacy-lock-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); 
            backdrop-filter: blur(8px); z-index: 2000000; display: none; justify-content: center; align-items: center;
            opacity: 0; transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="skm-privacy-glass" id="skm-privacy-box">
                <!-- ⚡ ប៊ូតុងកង់ស្ពឺសម្រាប់ដូរនាទី -->
                <div class="skm-privacy-settings-btn" id="skm-privacy-btn-setup" title="កំណត់នាទី Auto-Lock">⚙️</div>
                
                <div class="skm-privacy-icon">🔒</div>
                <h3 style="color:#fff; margin-bottom:5px; font-size:16px;">អេក្រង់ត្រូវបានចាក់សោរ</h3>
                <p id="skm-privacy-msg" style="color:#94a3b8; font-size:12px; margin-bottom:25px;">សូមបញ្ចូល PIN កូដដើម្បីបើកវិញ</p>
                
                <div class="skm-privacy-dots-container" id="skm-privacy-display">
                    <div class="skm-privacy-dot"></div>
                    <div class="skm-privacy-dot"></div>
                    <div class="skm-privacy-dot"></div>
                    <div class="skm-privacy-dot"></div>
                </div>
                
                <div class="skm-privacy-grid" id="skm-pin-keypad">
                    <button class="skm-privacy-btn" data-val="1">1</button>
                    <button class="skm-privacy-btn" data-val="2">2</button>
                    <button class="skm-privacy-btn" data-val="3">3</button>
                    <button class="skm-privacy-btn" data-val="4">4</button>
                    <button class="skm-privacy-btn" data-val="5">5</button>
                    <button class="skm-privacy-btn" data-val="6">6</button>
                    <button class="skm-privacy-btn" data-val="7">7</button>
                    <button class="skm-privacy-btn" data-val="8">8</button>
                    <button class="skm-privacy-btn" data-val="9">9</button>
                    <button class="skm-privacy-btn clear" data-val="clear">⌫</button>
                    <button class="skm-privacy-btn" data-val="0">0</button>
                    <button class="skm-privacy-btn" style="visibility:hidden;"></button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // ចាប់យកការចុចលើ Numpad
        const keypad = document.getElementById('skm-pin-keypad');
        if (keypad) {
            keypad.addEventListener('click', function(e) {
                const btn = e.target.closest('.skm-privacy-btn');
                if (!btn) return;
                
                const val = btn.getAttribute('data-val');
                if (val === 'clear') {
                    clearPin();
                } else if (val !== null) {
                    enterPin(parseInt(val));
                }
            });
        }

        // ⚡ ចាប់យកការចុចលើប៊ូតុងកង់ស្ពឺ (Settings)
        const setupBtn = document.getElementById('skm-privacy-btn-setup');
        if (setupBtn) {
            setupBtn.addEventListener('click', function() {
                const currentValidPin = getValidPin();
                const pin = prompt("🔒 សូមបញ្ចូលលេខសម្ងាត់ (PIN) ដើម្បីចូលទៅការកំណត់៖");
                
                if (pin === currentValidPin) {
                    let mins = prompt(`⏱️ តើចង់ឱ្យប្រព័ន្ធចាក់សោរដោយស្វ័យប្រវត្តិ បើទុកចោលប៉ុន្មាននាទី?\n(បច្ចុប្បន្ន: ${LOCK_MINUTES} នាទី | វាយលេខ 0 ដើម្បីបិទ)`);
                    if (mins !== null && !isNaN(mins) && mins >= 0) {
                        LOCK_MINUTES = parseFloat(mins);
                        localStorage.setItem('skm_privacy_idle_time', LOCK_MINUTES); // Save ទុក
                        alert(`✅ បានកំណត់ Auto-Lock រយៈពេល ${LOCK_MINUTES} នាទី រួចរាល់!`);
                        resetIdleTimer();
                    }
                } else if (pin !== null) {
                    alert("❌ លេខសម្ងាត់មិនត្រឹមត្រូវ!");
                }
            });
        }
    }

    // ៣. ចាប់យកការចុចលើ Keyboard តែម្តងគត់
    document.addEventListener('keydown', function(e) {
        if (isLocked) {
            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault(); 
                enterPin(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                e.preventDefault(); 
                clearPin();
            }
        } else {
            // ចុច Ctrl + L ដើម្បី Lock
            if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
                e.preventDefault();
                lockScreen();
            }
        }
    });

    // ៤. មុខងារចាក់សោ និង ដោះសោ
    function lockScreen() {
        createLockModal();
        isLocked = true;
        pinCode = '';
        updatePinDisplay();
        
        const msg = document.getElementById('skm-privacy-msg');
        if(msg) {
            msg.innerText = 'សូមបញ្ចូល PIN កូដដើម្បីបើកវិញ';
            msg.style.color = '#94a3b8';
        }

        const modal = document.getElementById('skm-privacy-lock-modal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => { modal.style.opacity = '1'; }, 10);
            document.getElementById('skm-privacy-box').classList.remove('shake');
        }
    }

    function enterPin(num) {
        if (!isLocked) return;
        if (pinCode.length < 4) {
            pinCode += num;
            updatePinDisplay();
            if (pinCode.length === 4) {
                setTimeout(verifyPin, 150);
            }
        }
    }

    function clearPin() {
        if (!isLocked) return;
        pinCode = pinCode.slice(0, -1);
        updatePinDisplay();
    }

    function updatePinDisplay() {
        const modal = document.getElementById('skm-privacy-lock-modal');
        if(!modal) return;
        const dots = modal.querySelectorAll('.skm-privacy-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('error'); 
            if (index < pinCode.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    function verifyPin() {
        try {
            let validPin = getValidPin();
            const msg = document.getElementById('skm-privacy-msg');
            const dots = document.getElementById('skm-privacy-lock-modal').querySelectorAll('.skm-privacy-dot');

            if (pinCode === validPin) {
                msg.innerText = '✅ បានដោះសោរជោគជ័យ';
                msg.style.color = '#38bdf8';
                setTimeout(() => {
                    isLocked = false;
                    const modal = document.getElementById('skm-privacy-lock-modal');
                    if(modal) {
                        modal.style.opacity = '0';
                        setTimeout(() => { modal.style.display = 'none'; }, 300);
                    }
                    resetIdleTimer();
                }, 300);
            } else {
                const box = document.getElementById('skm-privacy-box');
                box.classList.add('shake');
                msg.innerText = '❌ ខុសលេខកូដហើយ!';
                msg.style.color = '#ef4444';
                
                dots.forEach(dot => dot.classList.add('error'));

                setTimeout(() => {
                    pinCode = '';
                    box.classList.remove('shake');
                    msg.innerText = 'សូមបញ្ចូល PIN កូដដើម្បីបើកវិញ';
                    msg.style.color = '#94a3b8';
                    updatePinDisplay();
                }, 800);
            }
        } catch(err) {
            pinCode = ''; 
            updatePinDisplay();
        }
    }

    // ៥. មុខងារចាក់សោរស្វ័យប្រវត្តិ (Auto-Lock)
    function resetIdleTimer() {
        if (isLocked) return;
        clearTimeout(idleTimer);
        
        // បើ LOCK_MINUTES = 0 គឺមិនបាច់ Lock ទេ
        if (LOCK_MINUTES > 0) {
            const timeoutMS = LOCK_MINUTES * 60 * 1000;
            idleTimer = setTimeout(lockScreen, timeoutMS);
        }
    }

    // តាមដានសកម្មភាពអូសទាញចុចរបស់អ្នកប្រើ
    ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
        document.addEventListener(evt, resetIdleTimer);
    });

    // ៦. ដំណើរការប្រព័ន្ធ
    const initInt = setInterval(() => {
        if (document.getElementById('currentUserDisplay')) {
            injectLockBtn();
            resetIdleTimer();
            clearInterval(initInt);
        }
    }, 1000);
})();
});

;
// === [5/43] បូកសរុបវិក្កយបត្រតាមឈ្មោះអតិថិជន ឬ លេខទូរស័ព្ទ (Customer Bill Summary).js ===
window.skmRegisterBundledPlugin('pos', "បូកសរុបវិក្កយបត្រតាមឈ្មោះអតិថិជន ឬ លេខទូរស័ព្ទ (Customer Bill Summary).js", function() {
/* STREAMING_CHUNK:Initializing POS Pending Invoices Summary Pro v20 */
(function() {
    console.log("🧾 POS Pending Invoices Summary Pro v20 Initialized!");

    if (document.getElementById('skm-pos-custbill-style')) {
        document.getElementById('skm-pos-custbill-style').remove();
    }

    const style = document.createElement('style');
    style.id = 'skm-pos-custbill-style';
    style.innerHTML = `
        .skm-pos-cb-bg {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(30, 20, 15, 0.75); backdrop-filter: blur(6px);
            z-index: 100000; display: flex; justify-content: center; align-items: center;
            font-family: 'Battambang', sans-serif; opacity: 0; transition: opacity 0.3s ease;
            pointer-events: none; padding: 20px;
        }
        .skm-pos-cb-bg.skm-show {
            opacity: 1; pointer-events: auto;
        }
        .skm-pos-cb-content {
            background: #FAF6F0; color: #4A3B32; max-width: 520px; width: 100%;
            padding: 25px; border-radius: 28px; border: 2px solid #E8D8C8;
            box-shadow: 0 25px 60px -15px rgba(74, 59, 50, 0.35);
            transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex; flex-direction: column; max-height: 90vh; overflow-y: auto;
        }
        .skm-pos-cb-bg.skm-show .skm-pos-cb-content {
            transform: translateY(0) scale(1);
        }
        .skm-inv-pill {
            background: #F3EBE1; border: 1px solid #D4B89F;
            color: #4A3B32; padding: 8px 14px; border-radius: 12px;
            font-size: 12px; font-weight: 900; cursor: pointer; transition: all 0.2s;
            display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }
        .skm-inv-pill:hover {
            background: #B85D19; color: white; border-color: #B85D19; transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(184,93,25,0.3);
        }
    `;
    document.head.appendChild(style);

    async function openCustomerBillModal() {
        let modal = document.getElementById('skmPosCustomerBillModal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('skm-show'), 10);
            document.getElementById('posCustBillResultArea').style.display = 'none';
            document.getElementById('posTargetCustomerInput').value = '';
            await renderPendingInvoicesList();
            return;
        }

        modal = document.createElement('div');
        modal.className = 'skm-pos-cb-bg';
        modal.id = 'skmPosCustomerBillModal';
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('skm-show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };
        
        modal.innerHTML = `
            <div class="skm-pos-cb-content" onclick="event.stopPropagation()">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #E8D8C8; padding-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 42px; height: 42px; background: rgba(184, 93, 25, 0.12); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                            🧾
                        </div>
                        <div>
                            <h3 style="color: #B85D19; font-weight: 900; font-size: 16px; margin: 0;">វិក្កយបត្ររង់ចាំគិតលុយ</h3>
                            <div style="font-size: 11px; color: #8C7A6B; font-weight: 700;">Pending Invoices Bill Summary</div>
                        </div>
                    </div>
                    <div onclick="document.getElementById('skmPosCustomerBillModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmPosCustomerBillModal').style.display='none', 300);" style="color: #8C7A6B; font-size: 16px; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; background: #F3EBE1; display: flex; align-items: center; justify-content: center; font-weight: bold;">✕</div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="font-size: 11px; display: block; margin-bottom: 6px; font-weight: 800; color: #8C7A6B; text-transform: uppercase;">📌 វិក្កយបត្រមិនទាន់គិតលុយ / រង់ចាំទូទាត់ (CLICK ដើម្បីមើលភ្លាមៗ):</label>
                    <div id="skmActiveInvoicesContainer" style="display: flex; gap: 8px; flex-wrap: wrap; max-height: 150px; overflow-y: auto; padding-bottom: 4px;">
                        <span style="font-size:12px; color:#8C7A6B; font-weight:bold;">⏳ កំពុងទាញយកវិក្កយបត្ររង់ចាំ...</span>
                    </div>
                </div>

                <label style="font-size: 12px; display: block; margin-bottom: 6px; font-weight: 800; color: #4A3B32;">ស្វែងរកតាម លេខវិក្កយបត្រ (INV-... / ORD-...)៖</label>
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <input type="text" id="posTargetCustomerInput" class="input-st" placeholder="ឧ. INV-260930-003..." style="margin-bottom:0; flex: 1; padding: 12px; font-size: 13px; background: #fff; border-color: #D4B89F;" onkeypress="if(event.key === 'Enter') window.calculateCustomerBill()">
                    <button onclick="window.calculateCustomerBill()" style="background: #6F4E37; color: white; border: none; padding: 10px 18px; border-radius: 12px; font-weight: bold; cursor: pointer; font-family:'Battambang'; box-shadow: 0 4px 12px rgba(111,78,55,0.3); font-size: 13px;">🔍 រកមើល</button>
                </div>

                <div id="posCustBillResultArea" style="background: #F3EBE1; border: 1px solid #D4B89F; padding: 15px; border-radius: 16px; margin-bottom: 15px; text-align: left; max-height: 220px; overflow-y: auto; display: none; font-size: 12px;">
                </div>

                <div style="display: flex; gap: 12px; border-top: 1px solid #E8D8C8; padding-top: 15px;">
                    <button style="flex: 1; border: 1px solid #E8D8C8; color: #4A3B32; border-radius: 14px; padding: 12px; font-weight: bold; cursor: pointer; background: transparent; font-family:'Battambang'; font-size: 13px;" onclick="document.getElementById('skmPosCustomerBillModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmPosCustomerBillModal').style.display='none', 300);">បិទ</button>
                    <button id="btnPosPrintCustBill" style="flex: 1; background: linear-gradient(135deg, #B85D19, #8B4513); color: white; border: none; border-radius: 14px; padding: 12px; font-weight: bold; cursor: pointer; font-family:'Battambang'; display: none; box-shadow: 0 4px 15px rgba(184,93,25,0.35); font-size: 13px;" onclick="window.printCustomerBillSummary()">🖨 បោះពុម្ពវិក្កយបត្រ</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('skm-show'), 10);
        await renderPendingInvoicesList();
    }

    async function fetchAllInvoicesSystem() {
        let allOrders = [];
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';

        // 1. Fetch from Supabase Cloud Database
        if (window.supabase) {
            try {
                const supabaseClient = window.supabaseClient || window.supabase.createClient('https://qlzyyfqjwudbapgwsugu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsenl5ZnFqd3VkYmFwZ3dzdWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwODk2MzUsImV4cCI6MjEwODY2NTYzNX0.XQxNiUn2ZhivOjbqcWj0T6W1Abtx1H3kWrzIwqJPVtQ');
                let { data } = await supabaseClient.from('branch_store').select('data_json').eq('branch_id', branchId).maybeSingle();
                if (data && data.data_json) {
                    let d = data.data_json;
                    if (d.invoices && Array.isArray(d.invoices)) allOrders = [...allOrders, ...d.invoices];
                    if (d.orders && Array.isArray(d.orders)) allOrders = [...allOrders, ...d.orders];
                }
            } catch(err) {
                console.warn("Cloud fetch warning:", err);
            }
        }

        // 2. Fetch from LocalStorage
        try {
            let localInv = JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices_pro`) || localStorage.getItem(`ks2_${branchId}_invoices`) || '[]');
            if(Array.isArray(localInv)) allOrders = [...allOrders, ...localInv];
        } catch(e) {}

        try {
            let localOrders = JSON.parse(localStorage.getItem('skm_my_orders_history') || '[]');
            if(Array.isArray(localOrders)) allOrders = [...allOrders, ...localOrders];
        } catch(e) {}

        // Filter valid invoices
        let realInvoices = allOrders.filter(o => {
            if (!o) return false;
            let oid = String(o.id || o.invoice_id || o.code || '');
            if (!oid || oid.startsWith('pjs_') || oid.startsWith('mjs_') || oid.startsWith('skm_')) return false;
            return oid.includes('INV') || oid.includes('ORD');
        });

        let uniqueMap = new Map();
        realInvoices.forEach(o => {
            let oid = String(o.id || o.invoice_id || o.code);
            uniqueMap.set(oid, { ...o, id: oid });
        });

        let results = Array.from(uniqueMap.values());
        results.sort((a, b) => b.id.localeCompare(a.id));
        return results;
    }

    async function fetchPendingInvoices() {
        let allInvoices = await fetchAllInvoicesSystem();
        
        let pending = allInvoices.filter(o => {
            let status = String(o.status || '').toLowerCase();
            let isPending = status.includes('រង់ចាំ') || status.includes('pending') || status.includes('processing') || status === '';
            let isPaid = status.includes('paid') || status.includes('completed') || status.includes('ទូទាត់រួច') || status.includes('ជោគជ័យ');
            return isPending && !isPaid;
        });

        if (pending.length === 0 && allInvoices.length > 0) {
            return allInvoices;
        }

        return pending;
    }

    async function renderPendingInvoicesList() {
        const container = document.getElementById('skmActiveInvoicesContainer');
        if(!container) return;

        container.innerHTML = '<span style="font-size:12px; color:#8C7A6B; font-weight:bold;">⏳ កំពុងទាញយកវិក្កយបត្ររង់ចាំ...</span>';
        
        let orders = await fetchPendingInvoices();

        if (orders.length === 0) {
            container.innerHTML = '<span style="font-size:11px; color:#8C7A6B; font-weight:bold;">មិនមានវិក្កយបត្ររង់ចាំគិតលុយទេក្នុងប្រព័ន្ធ</span>';
            return;
        }

        let html = '';
        orders.forEach(o => {
            if (o.id) {
                let custName = o.customer || o.name || 'អតិថិជនទូទៅ';
                let label = `${o.id} (${custName})`;
                html += `<div class="skm-inv-pill" onclick="window.selectInvoiceQuick('${o.id}')">🧾 ${label}</div>`;
            }
        });
        container.innerHTML = html;
    }

    window.selectInvoiceQuick = function(invId) {
        document.getElementById('posTargetCustomerInput').value = invId;
        window.calculateCustomerBill();
    };

    window.calculateCustomerBill = async function() {
        const inputVal = document.getElementById('posTargetCustomerInput').value.trim().toLowerCase();
        const resultArea = document.getElementById('posCustBillResultArea');
        const printBtn = document.getElementById('btnPosPrintCustBill');
        
        if (!inputVal) {
            if(typeof showToast === 'function') showToast('សូមបញ្ចូលលេខវិក្កយបត្រ ឬឈ្មោះអតិថិជនសិន!', true);
            else alert('សូមបញ្ចូលលេខវិក្កយបត្រ ឬឈ្មោះអតិថិជនសិន!');
            return;
        }

        resultArea.style.display = 'block';
        resultArea.innerHTML = '<div style="text-align:center; color:#8C7A6B; padding: 10px;">🔍 កំពុងស្វែងរកទិន្នន័យ...</div>';

        let orders = await fetchAllInvoicesSystem();

        let matchedOrders = orders.filter(o => {
            let oid = String(o.id || '').toLowerCase();
            let cust = String(o.customer || o.name || '').toLowerCase();
            return oid.includes(inputVal) || cust.includes(inputVal);
        });

        if (matchedOrders.length === 0) {
            resultArea.innerHTML = `<div style="text-align:center; color:#8C7A6B; padding: 15px; font-weight: bold;">❌ រកមិនឃើញវិក្កយបត្រ "${inputVal}" ទេ</div>`;
            printBtn.style.display = 'none';
            return;
        }

        let grandTotal = 0;
        let allItemsMap = {};

        matchedOrders.forEach(o => {
            grandTotal += parseFloat(o.totalAmount || o.total || o.total_amount || 0);
            let items = o.items || o.cart || o.products || [];
            if (Array.isArray(items)) {
                items.forEach(item => {
                    let name = item.name || item.title || 'ទំនិញ';
                    let qty = parseInt(item.qty || item.quantity || 1);
                    if (allItemsMap[name]) allItemsMap[name] += qty;
                    else allItemsMap[name] = qty;
                });
            } else if (o.name) {
                let name = o.name;
                let qty = parseInt(o.qty || 1);
                if (allItemsMap[name]) allItemsMap[name] += qty;
                else allItemsMap[name] = qty;
            }
        });

        let itemsHtml = Object.keys(allItemsMap).map(key => `<div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:700;"><span>• ${key}</span> <span>x${allItemsMap[key]}</span></div>`).join('');
        let exRate = 4000;
        let totalKhr = Math.round(grandTotal * exRate).toLocaleString();

        resultArea.innerHTML = `
            <div style="border-bottom: 1px dashed #D4B89F; padding-bottom: 8px; margin-bottom: 8px; font-weight:900; color:#4A3B32;">
                📋 បញ្ជីទំនិញសរុប (វិក្កយបត្រ: ${inputVal}):<br>
            </div>
            <div style="margin-bottom: 10px; color: #4A3B32; max-height: 120px; overflow-y: auto;">
                ${itemsHtml || '<i>(មិនមានព័ត៌មានលម្អិតមុខទំនិញ)</i>'}
            </div>
            <div style="border-top: 1px solid #D4B89F; padding-top: 8px; display: flex; justify-content: space-between; font-weight: 900; color: #B85D19; font-size: 14px;">
                <span>ទឹកប្រាក់សរុបរួម:</span>
                <span>$${grandTotal.toFixed(2)} (${totalKhr} ៛)</span>
            </div>
        `;
        printBtn.style.display = 'block';
    };

    window.printCustomerBillSummary = function() {
        const resultHtml = document.getElementById('posCustBillResultArea').innerHTML;
        const searchKey = document.getElementById('posTargetCustomerInput').value;
        const printWin = window.open('', '_blank', 'width=450,height=650');
        printWin.document.write(`
            <html>
            <head>
                <title>Bill - ${searchKey}</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Battambang', sans-serif; padding: 25px; color: #4A3B32; background: #FAF6F0; margin: 0; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    h2 { text-align: center; color: #B85D19; font-size: 18px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px dashed #B85D19; padding-bottom: 8px;}
                    p.subtitle { text-align: center; font-size: 11px; color: #64748b; margin-top: 0; margin-bottom: 15px; font-weight: bold;}
                </style>
            </head>
            <body>
                <h2>🧾 សេចក្តីសង្ខេបវិក្កយបត្រ</h2>
                <p class="subtitle">លេខវិក្កយបត្រ៖ ${searchKey} | កាលបរិច្ឆេទ៖ ${new Date().toLocaleString('km-KH')}</p>
                <div>${resultHtml}</div>
                <div style="text-align:center; font-size:10px; color:#94a3b8; margin-top:30px;">បោះពុម្ពចេញពីប្រព័ន្ធគិតលុយ POS ហាងកាហ្វេ</div>
            </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); printWin.close(); }, 500);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🧾', 'វិក្កយបត្ររង់ចាំគិតលុយ (Bill Summary)', openCustomerBillModal, "បូកសរុបវិក្កយបត្រតាមឈ្មោះអតិថិជន ឬ លេខទូរស័ព្ទ (Customer Bill Summary).js");
            clearInterval(initInt);
        }
    }, 300);
})();
});

;
// === [6/43] បូកសរុបវិក្កយបត្រប្រចាំតុ (Table Bill Summary).js ===
window.skmRegisterBundledPlugin('pos', "បូកសរុបវិក្កយបត្រប្រចាំតុ (Table Bill Summary).js", function() {
/* STREAMING_CHUNK:Initializing POS Ultra-Premium Table Bill Summary (Smart Multi-Select V3.2) */
(function() {
    console.log("🧾 POS Ultra-Premium Table Bill Summary (Smart Multi-Select V3.2) Initialized!");

    if (document.getElementById('skm-pos-tablebill-style')) {
        document.getElementById('skm-pos-tablebill-style').remove();
    }

    const style = document.createElement('style');
    style.id = 'skm-pos-tablebill-style';
    style.innerHTML = `
        .skm-pos-tb-bg {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
            z-index: 100000; display: flex; justify-content: center; align-items: center;
            font-family: 'Battambang', 'Nunito', sans-serif; opacity: 0; transition: opacity 0.3s ease;
            pointer-events: none; padding: 20px;
        }
        .skm-pos-tb-bg.skm-show { opacity: 1; pointer-events: auto; }
        
        .skm-pos-tb-content {
            background: var(--bg-card, rgba(255, 255, 255, 0.98)); color: var(--text-main, #1e293b);
            max-width: 480px; width: 100%; padding: 25px; border-radius: 24px;
            border: 1px solid var(--border, rgba(0, 0, 0, 0.08)); box-shadow: 0 25px 60px rgba(0,0,0,0.25);
            transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex; flex-direction: column; max-height: 90vh;
        }
        
        @media (prefers-color-scheme: dark) {
            .skm-pos-tb-content {
                background: var(--bg-card, rgba(15, 23, 42, 0.98)); color: var(--text-main, #f8fafc);
                border: 1px solid var(--border, rgba(255, 255, 255, 0.1)); box-shadow: 0 25px 60px rgba(0,0,0,0.6);
            }
        }

        .skm-pos-tb-bg.skm-show .skm-pos-tb-content { transform: translateY(0) scale(1); }
        
        /* ⚡ រចនាប័ទ្មប៊ូតុងតុ និងស្ថានភាព Active ពេលចុចជាប់ */
        .skm-table-pill {
            background: var(--bg-alt, rgba(56, 189, 248, 0.1)); border: 1px solid var(--border, rgba(56, 189, 248, 0.2));
            color: var(--text-main, #0284c7); padding: 8px 14px; border-radius: 12px;
            font-size: 13px; font-weight: bold; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); user-select: none;
        }
        .skm-table-pill:hover { border-color: #0284c7; transform: translateY(-2px); }
        .skm-table-pill.active {
            background: linear-gradient(135deg, #38bdf8, #0284c7); color: white; border-color: #0284c7; 
            box-shadow: 0 4px 12px rgba(56, 189, 248, 0.4); transform: translateY(-2px);
        }
        .skm-table-pill:active { transform: translateY(0) scale(0.95); box-shadow: none; }
        
        /* ⚡ រចនាប័ទ្មប៊ូតុងឈ្មោះ និងស្ថានភាព Active ពេលចុចជាប់ */
        .skm-name-pill {
            background: var(--bg-alt, rgba(16, 185, 129, 0.1)); border: 1px solid var(--border, rgba(16, 185, 129, 0.2));
            color: var(--text-main, #059669); padding: 8px 14px; border-radius: 12px;
            font-size: 13px; font-weight: bold; cursor: pointer; transition: all 0.2s;
            display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); user-select: none;
        }
        .skm-name-pill:hover { border-color: #059669; transform: translateY(-2px); }
        .skm-name-pill.active {
            background: linear-gradient(135deg, #10b981, #059669); color: white; border-color: #059669; 
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); transform: translateY(-2px);
        }
        .skm-name-pill:active { transform: translateY(0) scale(0.95); box-shadow: none; }
        
        .skm-tb-input {
            width: 100%; padding: 12px 15px; border-radius: 12px; border: 1px solid var(--border, rgba(128,128,128,0.2)); 
            background: var(--bg-input, #f8fafc); color: var(--text-main); font-size: 14px; outline: none; 
            font-family: 'Battambang'; transition: border-color 0.2s;
        }
        .skm-tb-input:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1); }
        @media (prefers-color-scheme: dark) { .skm-tb-input { background: rgba(0,0,0,0.2); } }

        .skm-tb-close {
            color: var(--text-muted); font-size: 14px; cursor: pointer; width: 32px; height: 32px; 
            border-radius: 50%; background: var(--bg-alt, rgba(128,128,128,0.1)); 
            display: flex; align-items: center; justify-content: center; font-weight: bold; transition: 0.2s;
        }
        .skm-tb-close:hover { background: #ef4444; color: white; }
        
        .skm-tb-action-btn {
            background: linear-gradient(135deg, #38bdf8, #0284c7); color: white; border: none; padding: 0 20px; 
            border-radius: 12px; font-weight: bold; cursor: pointer; font-family:'Battambang'; 
            box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3); font-size: 14px; transition: 0.2s; flex-shrink: 0;
        }
        .skm-tb-action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(56, 189, 248, 0.4); }
        .skm-tb-action-btn:active { transform: translateY(0) scale(0.95); box-shadow: none; }
        
        .skm-tb-cancel-btn {
            border: 1px solid var(--border, rgba(128,128,128,0.2)); color: var(--text-main); border-radius: 14px; 
            padding: 12px; font-weight: bold; cursor: pointer; background: transparent; font-family:'Battambang'; 
            font-size: 14px; transition: 0.2s; flex: 1;
        }
        .skm-tb-cancel-btn:hover { background: var(--bg-alt, rgba(128,128,128,0.1)); }
        
        .skm-tb-print-btn {
            background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 14px; 
            padding: 12px; font-weight: bold; cursor: pointer; font-family:'Battambang'; box-shadow: 0 4px 15px rgba(16,185,129,0.3); 
            font-size: 14px; transition: 0.2s; flex: 1;
        }
        .skm-tb-print-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16,185,129,0.4); }

        /* ⚡ CSS ដោះសោរ Scrollbar ឱ្យលាតពេញពេលព្រីន */
        @media print { 
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
            * { overflow: visible !important; max-height: none !important; }
        }
    `;
    document.head.appendChild(style);

    function getOmniOrders() {
        let allOrders = [];
        let seen = new Set();
        function addOrders(list) {
            if(!Array.isArray(list)) return;
            list.forEach(o => {
                if(o && typeof o === 'object' && (o.items || o.cart || o.totalAmount || o.total)) {
                    let uid = o.id || o.invoiceId || o.timestamp || JSON.stringify(o);
                    if(!seen.has(uid)) {
                        seen.add(uid);
                        if(o.status && (o.status.toLowerCase() === 'paid' || o.status.toLowerCase() === 'completed')) return; 
                        allOrders.push(o);
                    }
                }
            });
        }
        ['invoices', 'savedOrders', 'holdOrders', 'posOrders', 'pendingOrders'].forEach(k => {
            if(window[k]) addOrders(window[k]);
        });
        
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if(key.toLowerCase().includes('order') || key.toLowerCase().includes('invoice') || key.toLowerCase().includes('save') || key.toLowerCase().includes('hold')) {
                try {
                    let data = JSON.parse(localStorage.getItem(key));
                    if (Array.isArray(data)) addOrders(data);
                    else if (data && typeof data === 'object' && (data.items || data.cart)) addOrders([data]);
                    else if (data && typeof data === 'object') {
                        Object.values(data).forEach(v => {
                            if (v && typeof v === 'object' && (v.items || v.cart)) addOrders([v]);
                        });
                    }
                } catch(e) {}
            }
        }
        return allOrders;
    }

    function closeTableBillModal() {
        const modal = document.getElementById('skmPosTableBillModal');
        if(modal) {
            modal.classList.remove('skm-show');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    }

    function openTableBillModal() {
        let modal = document.getElementById('skmPosTableBillModal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('skm-show'), 10);
            document.getElementById('posTableBillResultArea').style.display = 'none';
            document.getElementById('posTargetTableInput').value = '';
            document.getElementById('btnPosPrintTableBill').style.display = 'none';
            renderActiveTablesList();
            return;
        }

        modal = document.createElement('div');
        modal.className = 'skm-pos-tb-bg';
        modal.id = 'skmPosTableBillModal';
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeTableBillModal();
        });
        
        modal.innerHTML = `
            <div class="skm-pos-tb-content" id="skmPosTbContent">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border, rgba(128,128,128,0.1)); padding-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 45px; height: 45px; background: rgba(56, 189, 248, 0.15); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px;">🧾</div>
                        <div>
                            <h3 style="color: var(--text-main); font-weight: 900; font-size: 16px; margin: 0; font-family:'Battambang';">បូកសរុបវិក្កយបត្រ (Multi-Select)</h3>
                            <div style="font-size: 12px; color: var(--text-muted); font-weight: 700; margin-top: 2px;">Merge Bills by Table or Customer</div>
                        </div>
                    </div>
                    <div id="skmTbCloseBtn" class="skm-tb-close">✕</div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="font-size: 12px; display: block; margin-bottom: 8px; font-weight: bold; color: var(--text-muted);">📌 ចុចជ្រើសរើស តុ ឬ ឈ្មោះភ្ញៀវ រហ័ស (ចុចបានច្រើន):</label>
                    <div id="skmActiveTablesContainer" style="display: flex; gap: 8px; flex-wrap: wrap; max-height: 120px; overflow-y: auto; padding-bottom: 5px;"></div>
                </div>

                <label style="font-size: 13px; display: block; margin-bottom: 8px; font-weight: bold; color: var(--text-main);">ឬវាយបញ្ចូលលេខ/ឈ្មោះដោយខ្លួនឯង៖</label>
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <input type="text" id="posTargetTableInput" class="skm-tb-input" placeholder="ឧទាហរណ៍៖ 3, 5 ឬ Sokheng" autocomplete="off">
                    <button id="skmTbSearchBtn" class="skm-tb-action-btn">🔍 រកមើល</button>
                </div>

                <div id="posTableBillResultArea" style="background: var(--bg-alt, rgba(128,128,128,0.05)); border: 1px solid var(--border, rgba(128,128,128,0.1)); padding: 18px; border-radius: 16px; margin-bottom: 20px; text-align: left; max-height: 220px; overflow-y: auto; display: none; font-size: 13px;"></div>

                <div style="display: flex; gap: 15px; border-top: 1px solid var(--border, rgba(128,128,128,0.1)); padding-top: 18px;">
                    <button id="skmTbCancelBtn" class="skm-tb-cancel-btn">បោះបង់</button>
                    <button id="btnPosPrintTableBill" class="skm-tb-print-btn" style="display: none;">🖨️ បោះពុម្ព</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('skmPosTbContent').addEventListener('click', e => e.stopPropagation());
        document.getElementById('skmTbCloseBtn').addEventListener('click', closeTableBillModal);
        document.getElementById('skmTbCancelBtn').addEventListener('click', closeTableBillModal);
        document.getElementById('skmTbSearchBtn').addEventListener('click', calculatePosTableBill);
        document.getElementById('btnPosPrintTableBill').addEventListener('click', printPosTableBillSummary);
        
        document.getElementById('posTargetTableInput').addEventListener('input', syncPillsState);
        document.getElementById('posTargetTableInput').addEventListener('keypress', function(e) {
            if(e.key === 'Enter') calculatePosTableBill();
        });

        // ⚡ មុខងារ Multi-Select ចុចលើឈ្មោះ/តុ ឱ្យបូកចូលគ្នាក្នុងប្រអប់
        document.getElementById('skmActiveTablesContainer').addEventListener('click', function(e) {
            let pill = e.target.closest('.skm-table-pill') || e.target.closest('.skm-name-pill');
            if (pill) {
                let clickedVal = pill.getAttribute('data-val');
                let inputField = document.getElementById('posTargetTableInput');
                let currentVal = inputField.value.trim();
                
                // បំបែកទិន្នន័យចាស់ចេញជាដុំៗ ដើម្បីផ្ទៀងផ្ទាត់
                let targets = currentVal ? currentVal.split(',').map(t => t.trim()).filter(t => t) : [];
                
                if (targets.includes(clickedVal)) {
                    // បើចុចចំអាធ្លាប់មានស្រាប់ ដកវាចេញវិញ (Toggle Off)
                    targets = targets.filter(t => t !== clickedVal);
                    pill.classList.remove('active');
                } else {
                    // បើចុចថ្មី បញ្ចូលទៅក្នុងប្រអប់ (Toggle On)
                    targets.push(clickedVal);
                    pill.classList.add('active');
                }
                
                // ភ្ជាប់ទៅវិញដោយសញ្ញាក្បៀស ឧ. "3, 5"
                inputField.value = targets.join(', ');
                
                // បើមានទិន្នន័យ ឱ្យវាបូកលុយបង្ហាញភ្លាមៗ!
                if(targets.length > 0) {
                    calculatePosTableBill();
                } else {
                    document.getElementById('posTableBillResultArea').style.display = 'none';
                    document.getElementById('btnPosPrintTableBill').style.display = 'none';
                }
            }
        });

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('skm-show'), 10);
        renderActiveTablesList();
    }

    // មុខងារនេះប្រើដើម្បីធ្វើឱ្យប៊ូតុងភ្លឺ (Active) ពេលវាយអក្សរចូល
    function syncPillsState() {
        let inputVal = document.getElementById('posTargetTableInput').value;
        let targets = inputVal.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
        
        document.querySelectorAll('.skm-table-pill, .skm-name-pill').forEach(pill => {
            let pillVal = pill.getAttribute('data-val').toLowerCase();
            if (targets.includes(pillVal)) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
    }

    function renderActiveTablesList() {
        const container = document.getElementById('skmActiveTablesContainer');
        if(!container) return;

        let orders = getOmniOrders();
        let detectedTables = new Set();
        let detectedNames = new Set();

        orders.forEach(o => {
            let tableStr = String(o.table || o.tableName || '').trim();
            let custStr = String(o.customer || o.customerName || '').trim();
            
            let match = tableStr.match(/តុ(?:លេខ)?\s*([0-9A-Za-z]+)/i);
            if (match && match[1]) detectedTables.add(match[1]);
            else if (tableStr.length > 0 && tableStr.length <= 5 && !isNaN(tableStr)) detectedTables.add(tableStr);

            if (custStr && isNaN(custStr) && custStr.toLowerCase() !== 'general' && custStr.toLowerCase() !== 'guest' && custStr.toLowerCase() !== 'walk-in') {
                detectedNames.add(custStr);
            }
        });

        if (detectedTables.size === 0 && detectedNames.size === 0) {
            for (let i = 1; i <= 6; i++) detectedTables.add(String(i));
        }

        let html = '';
        
        let sortedTables = Array.from(detectedTables).sort((a,b) => {
            let numA = parseInt(a), numB = parseInt(b);
            if(!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b);
        });
        
        sortedTables.forEach(t => {
            html += `<div class="skm-table-pill" data-val="${t}">🪑 តុ ${t}</div>`;
        });
        
        detectedNames.forEach(n => {
            html += `<div class="skm-name-pill" data-val="${n}">👤 ${n}</div>`;
        });
        
        container.innerHTML = html;
        syncPillsState(); // ពេល Render ចេញមក ឆែកមើលក្រែងលោមានអា Active
    }

    function calculatePosTableBill() {
        const inputVal = document.getElementById('posTargetTableInput').value.trim().toLowerCase();
        const resultArea = document.getElementById('posTableBillResultArea');
        const printBtn = document.getElementById('btnPosPrintTableBill');
        
        syncPillsState(); // ធ្វើឱ្យប៊ូតុងភ្លឺ

        if (!inputVal) {
            resultArea.style.display = 'none';
            printBtn.style.display = 'none';
            return;
        }

        let orders = getOmniOrders();
        let targets = inputVal.split(',').map(t => t.trim()).filter(t => t);

        let matchedOrders = orders.filter(o => {
            let searchSpace = String(o.table || o.tableName || o.customer || o.customerName || o.note || '').toLowerCase().trim();
            return targets.some(t => {
                if (searchSpace === t) return true;
                if (!isNaN(t)) {
                    let regex = new RegExp(`(?:^|\\s|តុ|table|t|#)(${t})(?:\\s|$|-)`, 'i');
                    return regex.test(searchSpace);
                } 
                else {
                    return searchSpace.includes(t);
                }
            });
        });

        resultArea.style.display = 'block';

        if (matchedOrders.length === 0) {
            resultArea.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding: 20px; font-weight: bold;">❌ មិនមានទិន្នន័យបញ្ជាទិញសម្រាប់ <span style="color:#ef4444;">${inputVal}</span> ទេ</div>`;
            printBtn.style.display = 'none';
            return;
        }

        let grandTotal = 0;
        let allItemsMap = {};

        matchedOrders.forEach(o => {
            grandTotal += parseFloat(o.totalAmount || o.total || o.total_amount || 0);
            let items = o.items || o.cart || [];
            if (Array.isArray(items)) {
                items.forEach(item => {
                    let name = item.name || 'ភេសជ្ជៈ/ម្ហូប';
                    let variant = item.cartVar || item.variant || '';
                    let key = variant ? `${name} (${variant})` : name;
                    let qty = parseInt(item.qty || 1);
                    
                    if (allItemsMap[key]) allItemsMap[key] += qty;
                    else allItemsMap[key] = qty;
                });
            }
        });

        let itemsHtml = Object.keys(allItemsMap).map(key => `<div style="display:flex; justify-content:space-between; margin-bottom:6px; font-weight:700; color:var(--text-main);"><span>• ${key}</span> <span style="background: rgba(128,128,128,0.1); padding: 2px 8px; border-radius: 6px;">x${allItemsMap[key]}</span></div>`).join('');
        
        let exRate = 4000;
        if(window.sysSettings && window.sysSettings.exchangeRate) exRate = parseFloat(window.sysSettings.exchangeRate);
        else if (localStorage.getItem('skm_exchange_rate')) exRate = parseFloat(localStorage.getItem('skm_exchange_rate'));
        let totalKhr = Math.round(grandTotal * exRate).toLocaleString();

        resultArea.innerHTML = `
            <div style="border-bottom: 1px dashed var(--border, rgba(128,128,128,0.2)); padding-bottom: 10px; margin-bottom: 12px; font-weight:900; color:var(--text-main);">
                📋 បញ្ជី Order សរុបសម្រាប់: <span style="color:#0ea5e9;">${inputVal.toUpperCase()}</span><br>
                <span style="font-size:11px; color:var(--text-muted); font-weight: normal;">ចំនួន Order រួមបញ្ចូលគ្នា: <b>${matchedOrders.length}</b> វគ្គ</span>
            </div>
            <!-- ⚡ ដោះសោរ Scrollbar ឱ្យលាតពេញពេលព្រីន -->
            <div style="margin-bottom: 15px; max-height: 140px; overflow-y: auto; padding-right: 5px;">
                ${itemsHtml || '<i>(មិនមានព័ត៌មានលម្អិតមុខទំនិញ)</i>'}
            </div>
            <div style="border-top: 1px solid var(--border, rgba(128,128,128,0.2)); padding-top: 12px; display: flex; justify-content: space-between; font-weight: 900; color: #10b981; font-size: 15px;">
                <span>ទឹកប្រាក់សរុបរួម:</span>
                <span>$${grandTotal.toFixed(2)} (${totalKhr} ៛)</span>
            </div>
        `;
        printBtn.style.display = 'block';
    }

    function printPosTableBillSummary() {
        const resultHtml = document.getElementById('posTableBillResultArea').innerHTML;
        const targetName = document.getElementById('posTargetTableInput').value.toUpperCase();
        const printWin = window.open('', '_blank', 'width=450,height=650');
        printWin.document.write(`
            <html>
            <head>
                <title>វិក្កយបត្រសរុប (Merged) - ${targetName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Battambang', sans-serif; padding: 25px; color: #000; background: #ffffff; margin: 0; }
                    
                    /* ⚡ CSS វេទមន្ត ដោះសោរ Scrollbar ឱ្យលាតពេញពេលព្រីន */
                    * { overflow: visible !important; max-height: none !important; }
                    
                    h2 { text-align: center; color: #000; font-size: 18px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px dashed #000; padding-bottom: 12px;}
                    p.subtitle { text-align: center; font-size: 12px; color: #555; margin-top: 5px; margin-bottom: 20px; font-weight: bold;}
                    .print-box { border: 1px solid #000; padding: 15px; border-radius: 8px; }
                    
                    @media print { 
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
                        * { overflow: visible !important; max-height: none !important; }
                    }
                </style>
            </head>
            <body>
                <h2>🧾 វិក្កយបត្រសរុប (Merged Bill)</h2>
                <p class="subtitle">សម្រាប់៖ ${targetName} | កាលបរិច្ឆេទ៖ ${new Date().toLocaleString('km-KH')}</p>
                <div class="print-box">${resultHtml}</div>
                <div style="text-align:center; font-size:11px; color:#555; margin-top:30px; font-weight: bold;">សូមអរគុណ! សូមអញ្ជើញមកម្តងទៀត។</div>
            </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); printWin.close(); }, 500);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🧾', 'បូកសរុបវិក្កយបត្រតុ/ភ្ញៀវ', openTableBillModal, "បូកសរុបវិក្កយបត្រប្រចាំតុ (Table Bill Summary).js");
            clearInterval(initInt);
        }
    }, 300);
})();
});

;
// === [7/43] ប៊ូតុងគិតលុយរហ័ស (Quick Cash).js ===
window.skmRegisterBundledPlugin('pos', "ប៊ូតុងគិតលុយរហ័ស (Quick Cash).js", function() {
(function() {
    // ⚡ ការពារមិនឱ្យកូដនេះរត់ជាន់គ្នា ២ដង
    if (window.skmQuickCashLoaded) return;
    window.skmQuickCashLoaded = true;

    console.log("💵 POS Ultra-Premium Quick Cash Buttons (Compact) Initialized!");

    const style = document.createElement('style');
    style.innerHTML = `
        .skm-quick-cash-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px; /* បង្រួមចន្លោះ (Gap) */
            margin-top: 10px;
            margin-bottom: 15px; /* កាត់បន្ថយគម្លាតខាងក្រោម */
            padding: 0;
        }
        .skm-qc-btn {
            background: var(--bg-alt, rgba(16, 185, 129, 0.05));
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #10b981;
            font-family: 'Arial', 'Battambang', sans-serif;
            font-weight: bold;
            font-size: 14px; /* បង្រួមទំហំអក្សរ */
            height: 36px; /* ⚡ បង្រួមកម្ពស់ប៊ូតុងឱ្យស្តើងជាងមុន */
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            user-select: none;
        }
        .skm-qc-btn:hover { 
            background: linear-gradient(135deg, #10b981, #059669); 
            color: #fff; 
            border-color: #059669;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
        }
        .skm-qc-btn:active { transform: translateY(0) scale(0.95); box-shadow: none; }
        
        .skm-qc-btn.exact {
            background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3); color: #0ea5e9; font-size: 13px;
        }
        .skm-qc-btn.exact:hover { 
            background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; border-color: #0284c7; 
            box-shadow: 0 4px 8px rgba(56, 189, 248, 0.2); 
        }
        
        .skm-qc-btn.clear {
            background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #ef4444; font-size: 13px;
        }
        .skm-qc-btn.clear:hover { 
            background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; border-color: #dc2626; 
            box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2); 
        }
    `;
    document.head.appendChild(style);

    function injectQuickCashUI() {
        const receivedInput = document.getElementById('checkoutReceivedUsd');
        const receivedRiel = document.getElementById('checkoutReceivedRiel');
        if (!receivedInput) return;

        // ការពារការបង្កើតប្រអប់ជាន់គ្នា
        if (document.getElementById('skmQuickCashGrid')) return; 

        const gridContainer = document.createElement('div');
        gridContainer.id = 'skmQuickCashGrid';
        gridContainer.className = 'skm-quick-cash-grid';
        
        // បង្កើតប៊ូតុងទឹកប្រាក់
        const amounts = [1, 5, 10, 20, 50, 100];
        amounts.forEach(amt => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'skm-qc-btn';
            btn.innerText = `$${amt}`;
            btn.addEventListener('click', () => {
                receivedInput.value = amt.toFixed(2);
                if(receivedRiel) receivedRiel.value = ''; 
                if (typeof window.calculateChange === 'function') window.calculateChange();
            });
            gridContainer.appendChild(btn);
        });

        // ប៊ូតុងប្រាក់ល្មម (Exact) - ប្រើកន្លែងស្មើនឹង ២ប៊ូតុង
        const exactBtn = document.createElement('button');
        exactBtn.type = 'button';
        exactBtn.className = 'skm-qc-btn exact';
        exactBtn.style.gridColumn = 'span 2';
        exactBtn.innerText = '💵 ល្មម (Exact)';
        exactBtn.addEventListener('click', () => {
            const totalDisplay = document.getElementById('checkoutTotalDisplay');
            if (totalDisplay) {
                let match = totalDisplay.innerText.match(/\$([0-9,]+\.[0-9]{2})/);
                if (match && match[1]) {
                    receivedInput.value = match[1].replace(/,/g, '');
                    if(receivedRiel) receivedRiel.value = '';
                    if (typeof window.calculateChange === 'function') window.calculateChange();
                }
            }
        });
        gridContainer.appendChild(exactBtn);

        // ប៊ូតុងសម្អាត (Clear) - ⚡ ពង្រីកឱ្យពេញបន្ទាត់ (Span 4) ដើម្បីកុំឱ្យសល់ចន្លោះប្រហោង
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'skm-qc-btn clear';
        clearBtn.style.gridColumn = 'span 4';
        clearBtn.innerText = '⌫ សម្អាតទិន្នន័យ (Clear)';
        clearBtn.addEventListener('click', () => {
            receivedInput.value = '';
            if(receivedRiel) receivedRiel.value = '';
            if (typeof window.calculateChange === 'function') window.calculateChange();
            receivedInput.focus();
        });
        gridContainer.appendChild(clearBtn);

        const inputFlexContainer = receivedInput.parentElement.parentElement;
        if (inputFlexContainer && inputFlexContainer.parentNode) {
            inputFlexContainer.parentNode.insertBefore(gridContainer, inputFlexContainer.nextSibling);
        }
    }

    // ត្រួតពិនិត្យរៀងរាល់ ៥០០ មីលីវិនាទី
    setInterval(() => { if (document.getElementById('checkoutReceivedUsd')) injectQuickCashUI(); }, 1200);
})();
});

;
// === [8/43] ប៊ូតុងអណ្តែតសម្រាប់ទំនាក់ទំនង (Floating Contact Bar).js ===
window.skmRegisterBundledPlugin('pos', "ប៊ូតុងអណ្តែតសម្រាប់ទំនាក់ទំនង (Floating Contact Bar).js", function() {
(function() {
    // ⚡ ការពារមិនឱ្យកូដនេះរត់ជាន់គ្នាបង្កើតប៊ូតុង ២ដង
    if (document.getElementById('skm-floating-bar-container')) return;

    console.log("💬 POS Ultra-Premium Smart Floating Contact Bar (Text Visible) Initialized!");

    // ទាញយកលេខទូរស័ព្ទហាង
    const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    let shopPhone = window.shopPhone || localStorage.getItem('ks2_' + branchId + '_shop_phone') || '';
    
    // ទាញយក Link ចេញពី Settings របស់ហាង
    let sysSettings = window.sysSettings || {};
    try {
        sysSettings = Object.assign({}, sysSettings, JSON.parse(localStorage.getItem('ks2_' + branchId + '_sys_settings')) || {});
    } catch(e) {}
    
    let rawTg = sysSettings.chatLink || sysSettings.floatingChatLink || sysSettings.floatingChat || sysSettings.telegramContact || window.shopTelegram || localStorage.getItem('ks2_' + branchId + '_shop_telegram') || '';
    let tgLink = rawTg ? (rawTg.startsWith('http') ? rawTg : 'https://t.me/' + rawTg.replace(/^@/, '')) : '';

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes skmSlideInRight {
            0% { transform: translateX(50px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        .skm-floating-bar-v3 {
            position: fixed;
            bottom: 100px; /* លើកឱ្យផុតពីប៊ូតុងកង់ស្ពឺខាងក្រោម */
            right: 20px;   /* នៅជាប់គែមខាងស្តាំ មិនបាំងកណ្តាលអេក្រង់ */
            z-index: 9998;
            display: flex;
            flex-direction: column; /* តម្រៀបលើក្រោម */
            gap: 12px;
            animation: skmSlideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .skm-fc-btn-v3 {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #fff;
            text-decoration: none;
            font-size: 13px; /* ទំហំអក្សរល្មមអានដាច់ */
            font-weight: bold;
            font-family: 'Battambang', 'Nunito', sans-serif;
            padding: 10px 16px; /* រាងទ្រវែង (Pill shape) ឃើញអក្សរច្បាស់ជានិច្ច */
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .skm-fc-btn-v3:active { transform: scale(0.95); }
        
        .skm-fc-tel-v3 { 
            background: linear-gradient(135deg, #10b981, #059669); 
        }
        .skm-fc-tel-v3:hover { box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4); transform: translateY(-2px); }
        
        .skm-fc-tg-v3 { 
            background: linear-gradient(135deg, #38bdf8, #0284c7); 
        }
        .skm-fc-tg-v3:hover { box-shadow: 0 6px 18px rgba(56, 189, 248, 0.4); transform: translateY(-2px); }
    `;
    document.head.appendChild(style);

    const barContainer = document.createElement('div');
    barContainer.id = 'skm-floating-bar-container';
    barContainer.className = 'skm-floating-bar-v3';
    
    let htmlContent = '';
    
    // បង្កើតប៊ូតុង Telegram (បង្ហាញតែពេលហាងបានដាក់ Link ឬ Username)
    if (tgLink) {
        htmlContent += `<a href="${tgLink}" target="_blank" class="skm-fc-btn-v3 skm-fc-tg-v3">
                            <i class="fa-brands fa-telegram" style="font-size: 16px;"></i> Telegram
                        </a>`;
    }

    // បង្កើតប៊ូតុងទូរស័ព្ទ (បង្ហាញតែពេលហាងបានដាក់លេខទូរស័ព្ទ)
    if (shopPhone && shopPhone.trim()) {
        let phoneHref = shopPhone.replace(/\s+/g, '');
        htmlContent += `<a href="tel:${phoneHref}" class="skm-fc-btn-v3 skm-fc-tel-v3">
                            <i class="fa-solid fa-phone" style="font-size: 14px;"></i> ខលទូរស័ព្ទ
                        </a>`;
    }

    if (!htmlContent) return;
    barContainer.innerHTML = htmlContent;
    document.body.appendChild(barContainer);
})();
});

;
// === [9/43] ផ្អាកកន្ត្រក (Hold Order).js ===
window.skmRegisterBundledPlugin('pos', "ផ្អាកកន្ត្រក (Hold Order).js", function() {
(function() {
    console.log("📌 POS Ultra-Compact Premium Hold Orders Initialized!");

    // ១. បញ្ចូលប៊ូតុង Hold/View ក្នុងកន្ត្រក ជារាងជួរដេក (Compact Inline)
    function injectHoldBtn() {
        const cartSummary = document.getElementById('cartSummaryBody');
        if (!cartSummary || document.getElementById('skm-hold-action-group')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            .skm-hold-action-group {
                display: flex; gap: 8px; margin-top: 10px; width: 100%;
            }
            .skm-btn-hold-action {
                flex: 1; padding: 10px; border-radius: 12px; font-size: 12px; font-weight: bold;
                cursor: pointer; transition: all 0.2s; font-family: 'Battambang'; text-align: center;
                display: flex; justify-content: center; align-items: center; gap: 5px; height: 42px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid transparent;
            }
            .skm-btn-hold-action:active { transform: scale(0.95); }
            
            .skm-btn-hold { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border-color: rgba(139, 92, 246, 0.3); }
            .skm-btn-hold:hover { background: #8b5cf6; color: white; box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3); }
            
            .skm-btn-view-hold { background: rgba(6, 182, 212, 0.1); color: #06b6d4; border-color: rgba(6, 182, 212, 0.3); }
            .skm-btn-view-hold:hover { background: #06b6d4; color: white; box-shadow: 0 5px 15px rgba(6, 182, 212, 0.3); }
        `;
        document.head.appendChild(style);

        const actionGroup = document.createElement('div');
        actionGroup.id = 'skm-hold-action-group';
        actionGroup.className = 'skm-hold-action-group';
        
        actionGroup.innerHTML = `
            <button class="skm-btn-hold-action skm-btn-hold" onclick="window.holdCurrentCart()">
                📥 ផ្អាកកន្ត្រក
            </button>
            <button class="skm-btn-hold-action skm-btn-view-hold" onclick="window.openHeldOrdersModal()">
                📂 ទាញកន្ត្រក
            </button>
        `;

        // ដាក់ខាងលើប៊ូតុងទូទាត់ ឬ ក្រុម Quick Actions បើមាន
        const targetDiv = cartSummary.querySelector('#skm-quick-actions-panel') || cartSummary.querySelector('div[style*="display: flex; gap: 10px;"]');
        if (targetDiv) cartSummary.insertBefore(actionGroup, targetDiv);
        else cartSummary.appendChild(actionGroup);
    }

    // ២. មុខងារផ្អាកកន្ត្រក
    window.holdCurrentCart = function() {
        if (!window.cart || window.cart.length === 0) {
            if(typeof window.showToast === 'function') window.showToast('កន្ត្រកទទេ គ្មានអីត្រូវផ្អាកទេ!', true);
            else alert('កន្ត្រកទទេ គ្មានអីត្រូវផ្អាកទេ!');
            return;
        }
        let heldOrders = JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_held_orders`) || '[]');
        const customerName = document.getElementById('posCustomerName') ? document.getElementById('posCustomerName').value : 'អតិថិជនទូទៅ';
        
        heldOrders.unshift({
            id: 'HOLD-' + Date.now().toString().slice(-4),
            time: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}),
            date: new Date().toLocaleDateString(),
            customer: customerName || 'អតិថិជនទូទៅ',
            items: [...window.cart],
            total: window.cartFinalUsd || 0
        });

        localStorage.setItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_held_orders`, JSON.stringify(heldOrders));
        window.cart = [];
        if(typeof window.renderCart === 'function') window.renderCart();
        if(typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
        
        if(typeof window.showToast === 'function') window.showToast('បានផ្អាកកន្ត្រកជោគជ័យ!');
        else alert('បានផ្អាកកន្ត្រកជោគជ័យ!');
    };

    window.skmCloseHeldOrders = function() {
        const modal = document.getElementById('skmHoldModal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-hold-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 250);
        }
    };

    // ៣. បង្កើត Premium Ultra-Compact Modal
    window.openHeldOrdersModal = function() {
        // បិទ Modal ផ្សេងៗសិន បើមានមុខងារនេះ
        if(typeof window.skmCloseAllModals === 'function') window.skmCloseAllModals();

        let modal = document.getElementById('skmHoldModal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-hold-glass, .skm-hold-glass * { box-sizing: border-box; }
                
                .skm-hold-glass {
                    background: var(--bg-card, rgba(255, 255, 255, 0.98));
                    color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 450px;
                    max-height: 90vh; display: flex; flex-direction: column;
                    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-hold-glass {
                        background: var(--bg-card, rgba(15, 23, 42, 0.98));
                        color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-hold-item {
                    background: var(--bg-input, #f8fafc);
                    padding: 12px 15px; border-radius: 12px; margin-bottom: 8px;
                    border: 1px solid var(--border, rgba(128,128,128,0.15));
                    display: flex; justify-content: space-between; align-items: center;
                    transition: all 0.2s;
                }
                @media (prefers-color-scheme: dark) { .skm-hold-item { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                .skm-hold-item:hover { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.05); }
                
                .skm-hold-btn-restore {
                    background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; border: none;
                    padding: 8px 12px; border-radius: 8px; font-size: 12px; cursor: pointer;
                    font-family: 'Battambang'; font-weight: bold; transition: 0.2s;
                    box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3); white-space: nowrap;
                }
                .skm-hold-btn-restore:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(14, 165, 233, 0.4); }
                .skm-hold-btn-restore:active { transform: translateY(0); }
                
                .skm-hold-btn-del {
                    background: rgba(239,68,68,0.1); color: #ef4444; border: none;
                    padding: 8px; border-radius: 8px; font-size: 14px; cursor: pointer;
                    transition: 0.2s; display: flex; align-items: center; justify-content: center;
                }
                .skm-hold-btn-del:hover { background: #ef4444; color: white; }
                
                .skm-hold-list { overflow-y: auto; flex: 1; padding-right: 5px; min-height: 200px; }
                .skm-hold-list::-webkit-scrollbar { width: 4px; }
                .skm-hold-list::-webkit-scrollbar-track { background: transparent; }
                .skm-hold-list::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skmHoldModal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                opacity: 0; transition: opacity 0.2s ease; backdrop-filter: blur(3px);
            `;
            
            modal.innerHTML = `
                <div class="skm-hold-glass">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h3 style="margin:0; font-size:16px; font-weight:600; display:flex; align-items:center; gap:8px;">
                            <span style="color:#8b5cf6; font-size: 18px;">📥</span> កន្ត្រកដែលបានផ្អាក (Held Orders)
                        </h3>
                        <div onclick="window.skmCloseHeldOrders()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:28px; height:28px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                    </div>

                    <div id="skmHeldListContent" class="skm-hold-list"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // ចុចខាងក្រៅ ឬ Esc ដើម្បីបិទ
            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseHeldOrders(); });
            document.addEventListener('keydown', function(e) { if(e.key === 'Escape' && modal.style.display !== 'none') window.skmCloseHeldOrders(); });
            
        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-hold-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        setTimeout(() => { modal.style.opacity = '1'; }, 50);
        window.loadHeldOrdersList();
    };

    window.loadHeldOrdersList = function() {
        const content = document.getElementById('skmHeldListContent');
        if(!content) return;
        let heldOrders = JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_held_orders`) || '[]');
        
        if (heldOrders.length === 0) {
            content.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:12px;">មិនមានកន្ត្រកដែលបានផ្អាកទេ!</div>';
        } else {
            const exchangeRate = window.EXCHANGE_RATE || 4000;
            content.innerHTML = heldOrders.map((h, idx) => {
                const amtUsd = parseFloat(h.total || 0);
                const amtKhr = amtUsd * exchangeRate;
                
                return `
                <div class="skm-hold-item">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                            <span style="font-weight:bold; font-size:14px; color:var(--text-main);">👤 ${h.customer}</span>
                            <span style="font-size:10px; background:rgba(139, 92, 246, 0.1); color:#8b5cf6; padding:2px 6px; border-radius:4px; font-weight:bold; font-family:'Arial';">#${h.id}</span>
                        </div>
                        <div style="display:flex; align-items:baseline; gap:8px; margin-bottom:4px;">
                            <span style="color:#10b981; font-weight:bold; font-size:15px; font-family:'Arial';">$${amtUsd.toFixed(2)}</span>
                            <span style="color:#0ea5e9; font-size:12px; font-weight:600; font-family:'Arial';">${Math.floor(amtKhr).toLocaleString('en-US')} ៛</span>
                            <span style="color:var(--text-muted); font-size:11px; margin-left:5px;">(🛍️ ${h.items.length} មុខ)</span>
                        </div>
                        <div style="font-size:10px; color:var(--text-muted); display:flex; gap:6px;">
                            <span>⏱️ ${h.time}</span> <span style="opacity:0.5;">|</span> <span>📅 ${h.date || ''}</span>
                        </div>
                    </div>
                    <div style="display:flex; gap:6px;">
                        <button class="skm-hold-btn-restore" onclick="window.restoreHeldOrder(${idx})">ទាញយក</button>
                        <button class="skm-hold-btn-del" onclick="window.deleteHeldOrder(${idx})">🗑️</button>
                    </div>
                </div>
                `;
            }).join('');
        }
    };

    window.restoreHeldOrder = function(idx) {
        let heldOrders = JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_held_orders`) || '[]');
        if (heldOrders[idx]) {
            window.cart = heldOrders[idx].items;
            if (document.getElementById('posCustomerName')) {
                document.getElementById('posCustomerName').value = heldOrders[idx].customer;
            }
            heldOrders.splice(idx, 1);
            localStorage.setItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_held_orders`, JSON.stringify(heldOrders));
            
            if(typeof window.renderCart === 'function') window.renderCart();
            if(typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
            
            window.skmCloseHeldOrders();
            if(typeof window.showToast === 'function') window.showToast('ទាញយកកន្ត្រកជោគជ័យ!');
        }
    };

    window.deleteHeldOrder = function(idx) {
        if(confirm('តើអ្នកពិតជាចង់លុបកន្ត្រកផ្អាកនេះចោលមែនទេ?')) {
            let heldOrders = JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_held_orders`) || '[]');
            heldOrders.splice(idx, 1);
            localStorage.setItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_held_orders`, JSON.stringify(heldOrders));
            window.loadHeldOrdersList();
        }
    };

    const initInt = setInterval(() => {
        if (document.getElementById('cartSummaryBody')) {
            injectHoldBtn();
            clearInterval(initInt);
            console.log("✅ Premium Hold Orders fully injected!");
        }
    }, 1000);
})();
});

;
// === [10/43] ម៉ាស៊ីនគិតលេខខ្នាតតូច (Mini Calculator).js ===
window.skmRegisterBundledPlugin('pos', "ម៉ាស៊ីនគិតលេខខ្នាតតូច (Mini Calculator).js", function() {
(function() {
    console.log("🧮 POS Ultra-Premium Mini Calculator Initialized!");
    
    function injectCalcBtn() {
        const headerDisplay = document.getElementById('currentUserDisplay');
        if (!headerDisplay || document.getElementById('skm-calc-btn')) return;
        
        const calcBtn = document.createElement('button');
        calcBtn.id = 'skm-calc-btn';
        calcBtn.innerHTML = '🧮'; 
        calcBtn.title = 'ម៉ាស៊ីនគិតលេខ (Calculator)';
        
        calcBtn.style.cssText = `
            background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4);
            width: 36px; height: 36px; border-radius: 50%; font-size: 16px; cursor: pointer;
            margin-left: 10px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: flex; 
            justify-content: center; align-items: center; padding: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05); flex-shrink: 0;
        `;
        calcBtn.onmouseover = () => { 
            calcBtn.style.background = '#f59e0b'; 
            calcBtn.style.color = '#fff';
            calcBtn.style.transform = 'scale(1.05)'; 
            calcBtn.style.boxShadow = '0 5px 15px rgba(245, 158, 11, 0.3)';
        };
        calcBtn.onmouseout = () => { 
            calcBtn.style.background = 'rgba(245, 158, 11, 0.15)'; 
            calcBtn.style.color = '#f59e0b';
            calcBtn.style.transform = 'scale(1)'; 
            calcBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
        };
        
        calcBtn.onclick = openCalculator;
        headerDisplay.parentNode.insertBefore(calcBtn, headerDisplay.nextSibling);
    }

    window.skmCloseCalculator = function() {
        const modal = document.getElementById('skm-calc-modal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-calc-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 200);
        }
    };

    function openCalculator() {
        if(typeof window.skmCloseAllModals === 'function') window.skmCloseAllModals();

        let modal = document.getElementById('skm-calc-modal');
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-calc-glass {
                    background: var(--bg-card, rgba(255, 255, 255, 0.98)); color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 300px;
                    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                    animation: skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Nunito', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-calc-glass {
                        background: var(--bg-card, rgba(15, 23, 42, 0.98)); color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-calc-screen {
                    width: 100%; height: 60px; font-size: 28px; font-weight: 800; text-align: right; 
                    margin-bottom: 15px; border-radius: 12px; border: 1px solid var(--border, rgba(128,128,128,0.2)); 
                    background: var(--bg-input, #f8fafc); color: var(--text-main); padding: 5px 15px; 
                    outline: none; font-family: 'Nunito', sans-serif; letter-spacing: 1px;
                }
                @media (prefers-color-scheme: dark) { .skm-calc-screen { background: rgba(0,0,0,0.3); color: #10b981; } }
                
                .skm-c-btn { 
                    height: 50px; border-radius: 12px; border: none; font-size: 20px; font-weight: 800; 
                    cursor: pointer; transition: 0.15s cubic-bezier(0.4, 0, 0.2, 1); font-family: 'Nunito', sans-serif;
                    background: var(--bg-alt, rgba(128,128,128,0.08)); color: var(--text-main);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                .skm-c-btn:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 5px 10px rgba(0,0,0,0.1); }
                .skm-c-btn:active { transform: translateY(0) scale(0.95); box-shadow: none; }
                
                .skm-c-btn.op { background: rgba(56, 189, 248, 0.15); color: #0ea5e9; }
                .skm-c-btn.clear { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
                .skm-c-btn.eq { background: linear-gradient(135deg, #10b981, #059669); color: white; box-shadow: 0 4px 15px rgba(16,185,129,0.3); }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skm-calc-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5); z-index: 100000; display: flex;
                justify-content: center; align-items: center; backdrop-filter: blur(3px);
                opacity: 0; transition: opacity 0.2s ease;
            `;
            
            // ⚡ FIX: កែពណ៌ប៊ូតុងខ្វែង (X) ឱ្យចេញជាពណ៌ក្រហមព្រាលៗ ដើម្បីមើលឃើញច្បាស់ជានិច្ច
            modal.innerHTML = `
                <div class="skm-calc-glass">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h3 style="margin:0; font-size:16px; font-weight:800; color:var(--text-muted);">🧮 Calculator</h3>
                        <div onclick="window.skmCloseCalculator()" style="background:rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color:#ef4444; width:28px; height:28px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'; this.style.color='#ef4444';">✕</div>
                    </div>
                    
                    <input type="text" id="skm-calc-screen" class="skm-calc-screen" readonly placeholder="0">
                    
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                        <button class="skm-c-btn clear" style="grid-column: span 2;" onclick="window.skmCalcAction('C')">C</button>
                        <button class="skm-c-btn op" onclick="window.skmCalcAction('/')">÷</button>
                        <button class="skm-c-btn op" onclick="window.skmCalcAction('*')">×</button>
                        
                        <button class="skm-c-btn" onclick="window.skmCalcAction('7')">7</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('8')">8</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('9')">9</button>
                        <button class="skm-c-btn op" onclick="window.skmCalcAction('-')">-</button>
                        
                        <button class="skm-c-btn" onclick="window.skmCalcAction('4')">4</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('5')">5</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('6')">6</button>
                        <button class="skm-c-btn op" onclick="window.skmCalcAction('+')">+</button>
                        
                        <button class="skm-c-btn" onclick="window.skmCalcAction('1')">1</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('2')">2</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('3')">3</button>
                        <button class="skm-c-btn eq" style="grid-row: span 2;" onclick="window.skmCalcAction('=')">=</button>
                        
                        <button class="skm-c-btn" style="grid-column: span 2;" onclick="window.skmCalcAction('0')">0</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('.')">.</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // ចុចខាងក្រៅ ឬចុច Esc ដើម្បីបិទ
            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseCalculator(); });
            document.addEventListener('keydown', function(e) { 
                if (modal.style.display !== 'none') {
                    if (e.key === 'Escape') window.skmCloseCalculator(); 
                    
                    // អនុញ្ញាតឱ្យវាយបញ្ចូលពី Keyboard បាន (NumPad)
                    const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/'];
                    if (allowedKeys.includes(e.key)) window.skmCalcAction(e.key);
                    if (e.key === 'Enter' || e.key === '=') window.skmCalcAction('=');
                    if (e.key === 'Backspace' || e.key === 'Delete') window.skmCalcAction('C');
                }
            });

            // មុខងារគណនាសុវត្ថិភាព (ជំនួស eval)
            window.skmCalcAction = function(val) {
                const screen = document.getElementById('skm-calc-screen');
                if (!screen) return;
                
                if (val === 'C') {
                    screen.value = '';
                } else if (val === '=') {
                    try {
                        if (screen.value.trim() === '') return;
                        const result = new Function('return ' + screen.value)();
                        screen.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(4)); 
                    } catch(e) {
                        screen.value = 'Error';
                        setTimeout(() => screen.value = '', 1000);
                    }
                } else {
                    if (screen.value === 'Error') screen.value = '';
                    screen.value += val;
                }
            };
            
        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-calc-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        setTimeout(() => { modal.style.opacity = '1'; }, 10);
    }

    const initInt = setInterval(() => {
        if (document.getElementById('currentUserDisplay')) {
            injectCalcBtn();
            clearInterval(initInt);
            console.log("✅ Ultra-Premium Mini Calculator successfully injected!");
        }
    }, 1000);
})();
});

;
// === [11/43] ⏰ កត់ត្រាម៉ោងការងារ (Time Clock).js ===
window.skmRegisterBundledPlugin('pos', "⏰ កត់ត្រាម៉ោងការងារ (Time Clock).js", function() {
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
            window.registerCustomTool('⏰', 'កត់ត្រាម៉ោងការងារ (Time Clock)', openTimeClockModal, "⏰ កត់ត្រាម៉ោងការងារ (Time Clock).js");
            clearInterval(initInt);
        }
    }, 300);
})();
});

;
// === [12/43] ☑️ កិច្ចការត្រូវធ្វើប្រចាំវេន daily_checklist.js ===
window.skmRegisterBundledPlugin('pos', "☑️ កិច្ចការត្រូវធ្វើប្រចាំវេន daily_checklist.js", function() {
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
            window.registerCustomTool('☑️', 'បញ្ជីកិច្ចការប្រចាំថ្ងៃ (Checklist)', openChecklistModal, "☑️ កិច្ចការត្រូវធ្វើប្រចាំវេន daily_checklist.js");
            clearInterval(initInt);
        }
    }, 300);
})();
});

;
// === [13/43] ⚖️ ផ្ទៀងផ្ទាត់លុយក្នុងទូរ (Cash Drawer Audit).js ===
window.skmRegisterBundledPlugin('pos', "⚖️ ផ្ទៀងផ្ទាត់លុយក្នុងទូរ (Cash Drawer Audit).js", function() {
/* STREAMING_CHUNK:Initializing Modern Cash Drawer Audit Plugin... */
(function() {
    console.log("⚖️ POS Modern Cash Drawer Variance Audit Plugin Initialized!");

    /* STREAMING_CHUNK:Building Refined Minimalist UI... */
    function openDrawerAuditModal() {
        if(document.getElementById('skmDrawerAuditModal')) {
            document.getElementById('skmDrawerAuditModal').style.display = 'flex';
            calcAuditData();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmDrawerAuditModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        /* STREAMING_CHUNK:Injecting Clean CSS and Layout... */
        modal.innerHTML = `
            <style>
                .skm-aud-input::-webkit-inner-spin-button, 
                .skm-aud-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                .skm-aud-input { -moz-appearance: textfield; }

                .skm-aud-box { background: var(--bg-card, #ffffff); color: var(--text-main, #1e293b); padding: 25px; border-radius: 20px; width: 100%; max-width: 440px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.2); border: 1px solid var(--border, #e2e8f0); display: flex; flex-direction: column; gap: 14px; box-sizing: border-box; }
                .skm-aud-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border, #f1f5f9); padding-bottom: 12px; margin-bottom: 2px; }
                .skm-aud-input { font-size: 16px; padding: 10px 14px; border-radius: 10px; border: 1.5px solid #cbd5e1; width: 100%; transition: all 0.2s ease; background: var(--store-bg, #f8fafc); outline: none; color: var(--text-main, #1e293b); font-family: 'Nunito', 'Battambang', sans-serif; box-sizing: border-box; font-weight: bold; }
                .skm-aud-input:focus { border-color: #f59e0b; background: #ffffff; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1); }
                .skm-aud-row { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 10px 14px; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; }
                .skm-aud-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; text-align: center; transition: 0.3s; }
                .skm-btn-print { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; flex: 1; transition: 0.2s; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25); font-family: inherit; }
                .skm-btn-print:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(245, 158, 11, 0.35); }
                .skm-btn-close { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; flex: 1; transition: 0.2s; text-align: center; font-family: inherit; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
            </style>
            
            <div class="skm-aud-box">
                <div class="skm-aud-header">
                    <h3 style="margin:0; font-size:16px; display: flex; align-items: center; gap: 8px; color: #f59e0b; font-weight: 800;">
                        <span>⚖️</span> ពិនិត្យប្រាក់លើស/ខ្វះក្នុងទូរ
                    </h3>
                    <button onclick="document.getElementById('skmDrawerAuditModal').style.display='none'" style="background: #fef2f2; border: 1px solid #fca5a5; color: #ef4444; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">✕</button>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div class="skm-aud-row">
                        <span style="color: var(--text-muted, #64748b);">ប្រាក់ដើមបើកវេន (Opening Float):</span>
                        <b id="auditOpening" style="color: var(--text-main, #1e293b);">$0.00</b>
                    </div>
                    <div class="skm-aud-row">
                        <span style="color: var(--text-muted, #64748b);">ប្រាក់ចំណូលលក់សុទ្ធ (Cash Sales):</span>
                        <b id="auditSales" style="color: #10b981;">$0.00</b>
                    </div>
                    <div class="skm-aud-row" style="background: rgba(14, 165, 233, 0.05); border-color: #bae6fd;">
                        <span style="color: #0369a1;">ទឹកប្រាក់រំពឹងទុក (Expected Cash):</span>
                        <b id="auditExpected" style="color: #0284c7; font-size: 15px;">$0.00</b>
                    </div>
                </div>

                <div>
                    <label style="font-size: 12px; font-weight: 700; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">ចំនួនប្រាក់រាប់ជាក់ស្តែងក្នុងទូរ ($) *</label>
                    <input type="number" id="auditActualInp" class="skm-aud-input" placeholder="0.00" oninput="window.calcAuditVariance()" step="any" style="color: #0ea5e9;">
                </div>

                <div id="auditResultBox" class="skm-aud-card">
                    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">លទ្ធផលគណនា (Variance)</div>
                    <div id="auditVarianceVal" style="font-size: 16px; font-weight: 800; color: var(--text-main, #1e293b); margin-top: 2px;">សូមបញ្ចូលប្រាក់រាប់ជាក់ស្តែង</div>
                </div>

                <div style="display:flex; gap:10px; margin-top: 4px;">
                    <button class="skm-btn-close" onclick="document.getElementById('skmDrawerAuditModal').style.display='none'">បិទ</button>
                    <button class="skm-btn-print" onclick="window.printDrawerAuditReport()">🖨️ បោះពុម្ព</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        calcAuditData();
    }

    /* STREAMING_CHUNK:Calculating Audit Data... */
    window.calcAuditData = function() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        const today = new Date().toLocaleDateString();
        
        let openingObj = JSON.parse(localStorage.getItem(`ks2_${branchId}_opening_cash`) || '{}');
        let openingAmt = (openingObj.date === today && openingObj.amount) ? parseFloat(openingObj.amount) : 50.00;
        
        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices_pro`) || '[]');
        let cashSales = 0;
        invoices.forEach(inv => {
            let invDate = inv.date ? inv.date.split(' ')[0] : '';
            if (inv.status === 'paid' && invDate === today) {
                cashSales += parseFloat(inv.totalAmount || 0);
            }
        });

        let cashLogs = JSON.parse(localStorage.getItem(`ks2_${branchId}_cash_inout`) || '[]');
        let totalIn = 0, totalOut = 0;
        cashLogs.forEach(l => {
            if (l.type === 'in') totalIn += parseFloat(l.amount || 0);
            if (l.type === 'out') totalOut += parseFloat(l.amount || 0);
        });

        let expected = openingAmt + cashSales + totalIn - totalOut;

        document.getElementById('auditOpening').innerText = `$${openingAmt.toFixed(2)}`;
        document.getElementById('auditSales').innerText = `$${cashSales.toFixed(2)}`;
        document.getElementById('auditExpected').innerText = `$${expected.toFixed(2)}`;
        
        window.skmExpectedCash = expected;
        window.skmOpeningAmt = openingAmt;
        window.skmCashSales = cashSales;
        window.calcAuditVariance();
    };

    /* STREAMING_CHUNK:Calculating Variance... */
    window.calcAuditVariance = function() {
        const actualInput = document.getElementById('auditActualInp');
        if(!actualInput) return;
        const actual = parseFloat(actualInput.value);
        const expected = window.skmExpectedCash || 0;
        const resBox = document.getElementById('auditResultBox');
        const varVal = document.getElementById('auditVarianceVal');

        if(isNaN(actual)) {
            resBox.style.background = '#f8fafc';
            resBox.style.borderColor = '#e2e8f0';
            varVal.style.color = '#1e293b';
            varVal.innerText = 'សូមបញ្ចូលប្រាក់រាប់ជាក់ស្តែង';
            window.skmAuditStatus = 'មិនទាន់បានបញ្ចូល';
            return;
        }

        let diff = actual - expected;
        if (Math.abs(diff) < 0.01) {
            resBox.style.background = 'rgba(16, 185, 129, 0.08)';
            resBox.style.borderColor = '#10b981';
            varVal.style.color = '#10b981';
            varVal.innerText = '✅ ត្រូវគ្នាត្រឹមត្រូវល្អ (Exact Match)!';
            window.skmAuditStatus = 'ត្រូវគ្នាត្រឹមត្រូវល្អ (Exact Match)';
        } else if (diff > 0) {
            resBox.style.background = 'rgba(14, 165, 233, 0.08)';
            resBox.style.borderColor = '#0ea5e9';
            varVal.style.color = '#0ea5e9';
            varVal.innerText = `📈 ប្រាក់លើស (Over): +$${diff.toFixed(2)}`;
            window.skmAuditStatus = `ប្រាក់លើស (Over): +$${diff.toFixed(2)}`;
        } else {
            resBox.style.background = 'rgba(239, 68, 68, 0.08)';
            resBox.style.borderColor = '#ef4444';
            varVal.style.color = '#ef4444';
            varVal.innerText = `📉 ប្រាក់ខ្វះ (Short): -$${Math.abs(diff).toFixed(2)}`;
            window.skmAuditStatus = `ប្រាក់ខ្វះ (Short): -$${Math.abs(diff).toFixed(2)}`;
        }
    };

    /* STREAMING_CHUNK:Implementing Isolated Report Printing... */
    window.printDrawerAuditReport = function() {
        const opening = document.getElementById('auditOpening').innerText;
        const sales = document.getElementById('auditSales').innerText;
        const expected = document.getElementById('auditExpected').innerText;
        const actualInput = document.getElementById('auditActualInp').value;
        const actual = actualInput ? `$${parseFloat(actualInput).toFixed(2)}` : '$0.00';
        const variance = document.getElementById('auditVarianceVal').innerText;
        const shopName = window.shopName || 'ហាងរបស់យើងខ្ញុំ';
        const timeStr = new Date().toLocaleString('km-KH');

        const printWin = window.open('', '', 'width=450,height=600');
        printWin.document.write(`
            <html>
                <head>
                    <title>Cash Drawer Audit Report</title>
                    <style>
                        body { font-family: 'Battambang', sans-serif; padding: 20px; color: #1e293b; margin: 0; }
                        .report-container { max-width: 350px; margin: 0 auto; border: 1px solid #cbd5e1; padding: 20px; border-radius: 12px; }
                        .title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 5px; color: #0f172a; }
                        .subtitle { text-align: center; font-size: 13px; color: #64748b; margin-bottom: 15px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 10px; }
                        .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
                        .row.total { font-weight: bold; border-top: 1px solid #cbd5e1; padding-top: 8px; margin-top: 8px; font-size: 14px; }
                        .status-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px; text-align: center; margin-top: 15px; font-weight: bold; font-size: 14px; }
                        .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 20px; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
                    </style>
                </head>
                <body>
                    <div class="report-container">
                        <div class="title">${shopName}</div>
                        <div class="subtitle">របាយការណ៍ពិនិត្យប្រាក់ក្នុងទូរ (Drawer Audit)</div>
                        
                        <div class="row"><span>កាលបរិច្ឆេទ:</span> <b>${timeStr}</b></div>
                        
                        <div style="margin: 12px 0; border-top: 1px solid #e2e8f0; padding-top: 8px;">
                            <div class="row"><span>ប្រាក់ដើមបើកវេន:</span> <b>${opening}</b></div>
                            <div class="row"><span>ប្រាក់លក់សុទ្ធ:</span> <b>${sales}</b></div>
                            <div class="row total"><span>ប្រាក់រំពឹងទុក:</span> <b>${expected}</b></div>
                        </div>

                        <div class="row" style="margin-top: 10px;"><span>ប្រាក់រាប់ជាក់ស្តែង:</span> <b>${actual}</b></div>

                        <div class="status-box">
                            ${variance}
                        </div>

                        <div class="footer">
                            អរគុណសម្រាប់ការប្រើប្រាស់ប្រព័ន្ធ POS!
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => {
            printWin.print();
            printWin.close();
        }, 600);
    };

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('⚖️', 'ពិនិត្យប្រាក់លើស/ខ្វះ (Drawer Audit)', openDrawerAuditModal, "⚖️ ផ្ទៀងផ្ទាត់លុយក្នុងទូរ (Cash Drawer Audit).js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [14/43] ⚠️ កត់ត្រាទំនិញខូចខាត (Wastage Log).js ===
window.skmRegisterBundledPlugin('pos', "⚠️ កត់ត្រាទំនិញខូចខាត (Wastage Log).js", function() {
/* STREAMING_CHUNK:Initializing Fixed Wastage Log Plugin... */
(function() {
    console.log("⚠️ POS Fixed Wastage Log Plugin Initialized!");

    function openWastageModal() {
        if (document.getElementById('skmWastageLogModal')) {
            document.getElementById('skmWastageLogModal').style.display = 'flex';
            resetWastageForm();
            loadWastageHistory();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmWastageLogModal';
        // កែសម្រួល Overlay ឱ្យត្រូវស្តង់ដារ និងមាន Font ខ្មែរពេញជើង
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.75); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        modal.innerHTML = `
            <div style="background: var(--bg-card, #ffffff); color: var(--text-main, #334155); padding: 0; border-radius: 20px; width: 100%; max-width: 500px; max-height: 90vh; display: flex; flex-direction: column; border: 1px solid var(--border, #e2e8f0); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; box-sizing: border-box;">
                
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 25px; border-bottom: 1px dashed var(--border, #cbd5e1); background: #fffbeb;">
                    <h3 style="color: #d97706; margin: 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 22px;">⚠️</span> កត់ត្រាទំនិញខូចខាត (Wastage)
                    </h3>
                    <button onclick="document.getElementById('skmWastageLogModal').style.display='none'" style="background: #fef2f2; border: 1px solid #fca5a5; color: #ef4444; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">✕</button>
                </div>

                <!-- Scrollable Content Body -->
                <div style="padding: 25px; overflow-y: auto; flex: 1; box-sizing: border-box;">
                    
                    <!-- Product Selection -->
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 14px; font-weight: 600; color: var(--text-muted, #64748b); margin-bottom: 8px;">ជ្រើសរើសទំនិញ <span style="color:#ef4444">*</span></label>
                        
                        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                            <div style="position: relative; flex: 1;">
                                <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 14px;">🔍</span>
                                <input type="text" id="skmWastageSearchInp" placeholder="ស្វែងរកឈ្មោះទំនិញ ឬកូដ..." style="width: 100%; padding: 12px 12px 12px 35px; border: 1px solid var(--border, #cbd5e1); border-radius: 10px; font-family: inherit; font-size: 14px; box-sizing: border-box; background: var(--bg-main, #f8fafc); color: var(--text-main, #334155); outline: none;">
                            </div>
                            <!-- 🌟 ប៊ូតុងដកចេញ (Clear) -->
                            <button id="skmBtnClearProd" onclick="window.resetWastageProductSelection()" style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #64748b; padding: 0 14px; height: 45px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 13px; display: none; align-items: center; justify-content: center; transition: 0.2s;" title="ដកការជ្រើសរើសចេញ">❌ ដកចេញ</button>
                        </div>

                        <!-- ប្រើប្រាស់ Dropdown ធម្មតាដែលងាយស្រួលចុច និងមិនបាំងផ្ទាំង -->
                        <select id="skmWastageProductSelect" size="4" style="width: 100%; padding: 8px; border: 1px solid var(--border, #cbd5e1); border-radius: 10px; font-family: inherit; font-size: 14px; box-sizing: border-box; background: var(--bg-card, #ffffff); color: var(--text-main, #334155); outline: none; cursor: pointer;">
                            <option value="">-- សូមស្វែងរក ឬជ្រើសរើសទំនិញខាងក្រោម --</option>
                        </select>

                        <div id="skmWastageSelectedProductInfo" style="margin-top: 8px; font-size: 13px; color: #64748b; display: none;">
                            ស្តុកបច្ចុប្បន្ន: <strong id="skmWastageCurrentStock" style="color: #10b981;">0</strong> | តម្លៃដើម: <strong id="skmWastageCostPrice" style="color: #64748b;">$0.00</strong>
                        </div>
                    </div>

                    <!-- Quantity -->
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 14px; font-weight: 600; color: var(--text-muted, #64748b); margin-bottom: 8px;">ចំនួនខូចខាត (Qty) <span style="color:#ef4444">*</span></label>
                        <input type="number" id="skmWastageQty" min="1" value="1" style="width: 100%; padding: 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 10px; font-family: inherit; font-size: 16px; font-weight: bold; color: #ef4444; box-sizing: border-box; background: var(--bg-main, #f8fafc); outline: none;">
                    </div>

                    <!-- Reason -->
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; font-size: 14px; font-weight: 600; color: var(--text-muted, #64748b); margin-bottom: 8px;">មូលហេតុ (Reason) <span style="color:#ef4444">*</span></label>
                        <textarea id="skmWastageReason" rows="2" placeholder="ឧ. ខូចគុណភាព, បែកបាក់..." style="width: 100%; padding: 12px; border: 1px solid #f59e0b; border-radius: 10px; font-family: inherit; font-size: 14px; box-sizing: border-box; background: #fffbeb; color: #b45309; outline: none; resize: none;"></textarea>
                    </div>

                    <!-- Action Button -->
                    <button id="skmBtnSaveWastage" style="width: 100%; padding: 14px; background: #d97706; color: white; border: none; border-radius: 12px; font-family: inherit; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(217, 119, 6, 0.2); transition: all 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px;">
                        <span>🗑️</span> កត់ត្រា និងកាត់ស្តុក
                    </button>

                    <!-- History Section -->
                    <div style="margin-top: 30px; border-top: 1px dashed var(--border, #cbd5e1); padding-top: 20px;">
                        <h4 style="font-size: 14px; font-weight: 600; color: var(--text-muted, #64748b); margin: 0 0 15px 0;">ប្រវត្តិទំនិញខូចខាតថ្ងៃនេះ</h4>
                        <div id="skmWastageHistoryList" style="display: flex; flex-direction: column; gap: 10px; padding-bottom: 10px;"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const searchInp = document.getElementById('skmWastageSearchInp');
        const selectProd = document.getElementById('skmWastageProductSelect');
        const btnSave = document.getElementById('skmBtnSaveWastage');

        searchInp.addEventListener('input', (e) => {
            populateProductSelect(e.target.value.toLowerCase());
        });

        selectProd.addEventListener('change', (e) => {
            const prodId = e.target.value;
            const infoDiv = document.getElementById('skmWastageSelectedProductInfo');
            const clearBtn = document.getElementById('skmBtnClearProd');
            if (prodId) {
                const inv = window.inventory || [];
                const prod = inv.find(p => String(p.id) === String(prodId) || String(p.customId) === String(prodId));
                if (prod) {
                    document.getElementById('skmWastageCurrentStock').textContent = prod.qty || 0;
                    document.getElementById('skmWastageCostPrice').textContent = `$${parseFloat(prod.cost || prod.price || 0).toFixed(2)}`;
                    infoDiv.style.display = 'block';
                    clearBtn.style.display = 'flex';
                }
            } else {
                infoDiv.style.display = 'none';
                clearBtn.style.display = 'none';
            }
        });

        btnSave.addEventListener('click', saveWastage);

        populateProductSelect('');
        resetWastageForm();
        loadWastageHistory();
    }

    window.resetWastageProductSelection = function() {
        const searchInp = document.getElementById('skmWastageSearchInp');
        const selectProd = document.getElementById('skmWastageProductSelect');
        const infoDiv = document.getElementById('skmWastageSelectedProductInfo');
        const clearBtn = document.getElementById('skmBtnClearProd');
        
        searchInp.value = '';
        selectProd.value = '';
        infoDiv.style.display = 'none';
        clearBtn.style.display = 'none';
        populateProductSelect('');
        searchInp.focus();
    };

    function populateProductSelect(filterTerm) {
        const select = document.getElementById('skmWastageProductSelect');
        const inv = window.inventory || [];
        
        let filtered = inv;
        if (filterTerm) {
            filtered = inv.filter(p => 
                (p.name && p.name.toLowerCase().includes(filterTerm)) || 
                (p.customId && p.customId.toLowerCase().includes(filterTerm))
            );
        }

        let html = '';
        if (filtered.length === 0) {
            html += '<option value="" disabled>រកមិនឃើញទំនិញទេ</option>';
        } else {
            filtered.slice(0, 30).forEach(p => {
                html += `<option value="${p.id || p.customId}">${p.name} (ស្តុក: ${p.qty || 0})</option>`;
            });
        }
        select.innerHTML = html;
    }

    function resetWastageForm() {
        window.resetWastageProductSelection();
        document.getElementById('skmWastageQty').value = 1;
        document.getElementById('skmWastageReason').value = '';
    }

    async function saveWastage() {
        const select = document.getElementById('skmWastageProductSelect');
        const qtyInp = document.getElementById('skmWastageQty');
        const reasonInp = document.getElementById('skmWastageReason');

        const prodId = select.value;
        const qty = parseInt(qtyInp.value);
        const reason = reasonInp.value.trim();

        if (!prodId) { alert("សូមជ្រើសរើសទំនិញជាមុនសិន!"); return; }
        if (isNaN(qty) || qty <= 0) { alert("សូមបញ្ចូលចំនួនឱ្យបានត្រឹមត្រូវ!"); return; }
        if (!reason) { alert("សូមបញ្ចូលមូលហេតុ!"); reasonInp.focus(); return; }

        let inv = window.inventory || [];
        let historyLog = window.historyLog || [];
        const prodIndex = inv.findIndex(p => String(p.id) === String(prodId) || String(p.customId) === String(prodId));
        
        if (prodIndex === -1) { alert("រកមិនឃើញទំនិញក្នុងប្រព័ន្ធទេ!"); return; }
        const prod = inv[prodIndex];

        if (prod.qty < qty) {
            alert(`ទំនិញនេះមានស្តុកតែ ${prod.qty} ប៉ុណ្ណោះ មិនអាចកាត់លើសស្តុកបានទេ!`);
            return;
        }

        let dateStr = new Date().toLocaleString('km-KH');
        let currentUser = window.userAccounts ? (window.userAccounts[0]?.fullName || 'Admin') : 'System';
        let costLost = parseFloat(prod.cost || prod.price || 0) * qty;

        // 1. Deduct Inventory
        prod.qty = Math.max(0, (parseInt(prod.qty) || 0) - qty);

        // 2. Add to System Activity Logs (ប្រព័ន្ធធំ)
        historyLog.unshift({
            id: Date.now(),
            date: dateStr,
            type: 'update',
            itemName: prod.name,
            qty: -qty,
            note: `[ខូចខាត/Wastage] ខាតបង់: $${costLost.toFixed(2)} | មូលហេតុ: ${reason} - ដោយ: ${currentUser}`
        });

        // 3. Save Local Plugin Log
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        const storageKey = `skm_${branchId}_wastage_logs`;
        let logs = JSON.parse(localStorage.getItem(storageKey) || '[]');
        logs.unshift({
            id: 'wst_' + Date.now(),
            date: new Date().toISOString(),
            productId: prod.id || prod.customId,
            productName: prod.name,
            qty: qty,
            costPrice: prod.cost || prod.price || 0,
            totalLoss: costLost,
            reason: reason,
            user: currentUser
        });
        localStorage.setItem(storageKey, JSON.stringify(logs));

        // 4. Save to Cloud/System Database
        if (typeof window.saveData === 'function') {
            await window.saveData(window.userAccounts);
        }

        // 5. Refresh UI Views
        resetWastageForm();
        loadWastageHistory();
        if(typeof window.renderHistory === 'function') window.renderHistory();
        if(typeof window.renderInventory === 'function') window.renderInventory();
        if(typeof window.renderDashboard === 'function') window.renderDashboard();
        
        // Visual feedback
        const btn = document.getElementById('skmBtnSaveWastage');
        const origText = btn.innerHTML;
        btn.innerHTML = '<span>✅</span> បានកត់ត្រាជោគជ័យ!';
        btn.style.background = '#10b981';
        setTimeout(() => {
            btn.innerHTML = origText;
            btn.style.background = '#d97706';
        }, 2000);
    }

    function loadWastageHistory() {
        const listDiv = document.getElementById('skmWastageHistoryList');
        if(!listDiv) return;
        
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        const storageKey = `skm_${branchId}_wastage_logs`;
        let logs = JSON.parse(localStorage.getItem(storageKey) || '[]');

        const today = new Date().toLocaleDateString();
        const todayLogs = logs.filter(log => new Date(log.date).toLocaleDateString() === today);

        if (todayLogs.length === 0) {
            listDiv.innerHTML = '<div style="text-align: center; color: var(--text-muted, #94a3b8); font-size: 13px; padding: 20px;">មិនទាន់មានការកត់ត្រាទេថ្ងៃនេះ</div>';
            return;
        }

        listDiv.innerHTML = todayLogs.map(log => {
            const timeStr = new Date(log.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            return `
                <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 12px; border-radius: 12px; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                        <div style="font-weight: 600; color: #92400e; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                            <span>⚠️</span> ${log.productName}
                        </div>
                        <div style="color: #ef4444; font-weight: bold; font-size: 14px; background: #fee2e2; padding: 2px 8px; border-radius: 6px;">
                            -${log.qty}
                        </div>
                    </div>
                    <div style="font-size: 12px; color: #b45309; margin-bottom: 4px;">មូលហេតុ: ${log.reason}</div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; color: #d97706;">
                        <span>ខាតបង់: <strong>$${parseFloat(log.totalLoss || 0).toFixed(2)}</strong></span>
                        <span>${timeStr}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('⚠️', 'កត់ត្រាទំនិញខូចខាត', openWastageModal, "⚠️ កត់ត្រាទំនិញខូចខាត (Wastage Log).js");
            clearInterval(initInt);
        }
    }, 500);

})();
});

;
// === [15/43] ⚡ ទំនិញរហ័ស.js ===
window.skmRegisterBundledPlugin('pos', "⚡ ទំនិញរហ័ស.js", function() {
(function() {
    console.log("⚡ POS Ultra-Compact Premium Quick Custom Item Initialized!");

    // មុខងារបិទផ្ទាំងចាស់ៗទាំងអស់ស្វ័យប្រវត្តិ (ជំនួយបន្ថែមបើមិនទាន់មានក្នុងប្រព័ន្ធ)
    if(typeof window.skmCloseAllModals !== 'function') {
        window.skmCloseAllModals = function() {
            const modals = ['skm-cash-inout-modal', 'skm-quick-exp-modal', 'skmDrawerCashModal', 'skmDailyModal', 'skmLastSalesModal', 'skmHoldModal', 'skmCustomItemModal'];
            modals.forEach(id => {
                let m = document.getElementById(id);
                if(m && m.style.display !== 'none') {
                    m.style.opacity = '0';
                    setTimeout(() => { m.style.display = 'none'; }, 200);
                }
            });
        };
    }

    function injectCustomItemBtn() {
        const searchInput = document.getElementById('posSearch');
        if (!searchInput || document.getElementById('skmQuickCustomBtn')) return;

        const btn = document.createElement('button');
        btn.id = 'skmQuickCustomBtn';
        btn.innerHTML = '⚡ ទំនិញរហ័ស';
        btn.style.cssText = `
            background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);
            padding: 0 15px; height: 38px; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer;
            margin-left: 10px; transition: all 0.2s; font-family: 'Battambang', sans-serif; white-space: nowrap; flex-shrink: 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        `;
        
        btn.onmouseover = () => { 
            btn.style.background = '#10b981'; btn.style.color = 'white'; 
            btn.style.boxShadow = '0 5px 15px rgba(16, 185, 129, 0.3)'; 
        };
        btn.onmouseout = () => { 
            btn.style.background = 'rgba(16, 185, 129, 0.1)'; btn.style.color = '#10b981'; 
            btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)'; 
        };
        
        btn.onclick = window.openCustomItemModal;
        
        // ដាក់ក្បែរប្រអប់ស្វែងរក និងបន្ទាប់ពីប៊ូតុង "លក់ចុងក្រោយ" បើមាន
        searchInput.parentNode.insertBefore(btn, searchInput.nextSibling);
    }

    window.skmCloseCustomItem = function() {
        const modal = document.getElementById('skmCustomItemModal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-cus-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 250);
        }
    };

    window.openCustomItemModal = function() {
        if(typeof window.skmCloseAllModals === 'function') window.skmCloseAllModals();

        let modal = document.getElementById('skmCustomItemModal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-cus-glass, .skm-cus-glass * { box-sizing: border-box; }
                
                .skm-cus-glass {
                    background: var(--bg-card, rgba(255, 255, 255, 0.98)); color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 400px;
                    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-cus-glass {
                        background: var(--bg-card, rgba(15, 23, 42, 0.98)); color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-cus-input, .skm-cus-select {
                    height: 42px; font-size: 14px; font-weight: 500;
                    border-radius: 10px; border: 1px solid var(--border, rgba(128,128,128,0.25));
                    background: var(--bg-input, #f8fafc); color: var(--text-main, inherit); 
                    padding: 0 12px; outline: none; transition: 0.2s; 
                    font-family: 'Battambang', 'Arial', sans-serif; width: 100%;
                }
                @media (prefers-color-scheme: dark) { .skm-cus-input, .skm-cus-select { background: var(--bg-input, rgba(0,0,0,0.3)); } }
                .skm-cus-input:focus, .skm-cus-select:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); }
                
                .skm-cus-btn {
                    height: 44px; border-radius: 10px; border: none; width: 100%; margin-top: 15px;
                    background: linear-gradient(135deg, #10b981, #059669); color: white;
                    font-size: 14px; font-weight: bold; cursor: pointer; transition: 0.2s;
                    font-family: 'Battambang'; box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3);
                }
                .skm-cus-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4); filter: brightness(1.1); }
                .skm-cus-btn:active { transform: translateY(0) scale(0.98); }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skmCustomItemModal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                opacity: 0; transition: opacity 0.2s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-cus-glass">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h3 style="margin:0; font-size:16px; font-weight:600; display:flex; align-items:center; gap:6px;">
                            <span style="color:#10b981; font-size: 18px;">⚡</span> ទំនិញរហ័ស (Custom Item)
                        </h3>
                        <div onclick="window.skmCloseCustomItem()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:28px; height:28px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="font-size:12px; color:var(--text-muted); margin-bottom:4px; display:block; font-family:'Battambang';">ឈ្មោះទំនិញ / សេវាកម្ម</label>
                        <input type="text" id="skmCusItemName" class="skm-cus-input" placeholder="ឧ. សេវាកម្មផ្សេងៗ...">
                    </div>
                    
                    <div style="display: flex; gap: 8px; align-items: flex-end;">
                        <div style="flex: 0 0 80px;">
                            <label style="font-size:12px; color:var(--text-muted); margin-bottom:4px; display:block; font-family:'Battambang';">ចំនួន</label>
                            <input type="number" id="skmCusItemQty" class="skm-cus-input" placeholder="1" value="1" min="1" style="text-align:center; font-family:'Arial';">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-size:12px; color:var(--text-muted); margin-bottom:4px; display:block; font-family:'Battambang';">តម្លៃលក់</label>
                            <input type="number" id="skmCusItemPrice" class="skm-cus-input" placeholder="0.00" style="font-family:'Arial';">
                        </div>
                        <div style="flex: 0 0 75px;">
                            <select id="skmCusItemCurrency" class="skm-cus-select" style="font-family:'Arial'; font-weight:bold; padding: 0 5px; text-align:center;">
                                <option value="USD">USD</option>
                                <option value="KHR">KHR</option>
                            </select>
                        </div>
                    </div>
                    
                    <button class="skm-cus-btn" onclick="window.addCustomItemToCart()">បញ្ជូលក្នុងកន្ត្រក (Add)</button>
                </div>
            `;
            document.body.appendChild(modal);

            // ចុចខាងក្រៅ ឬ Esc ដើម្បីបិទ
            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseCustomItem(); });
            document.addEventListener('keydown', function(e) { 
                if(modal.style.display === 'none') return;
                if(e.key === 'Escape') window.skmCloseCustomItem(); 
                if(e.key === 'Enter') window.addCustomItemToCart(); // ចុច Enter ដើម្បីបញ្ចូលរហ័ស
            });

            // Auto select
            document.getElementById('skmCusItemQty').addEventListener('focus', function() { this.select(); });
            document.getElementById('skmCusItemPrice').addEventListener('focus', function() { this.select(); });

        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-cus-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            
            // ជម្រះទិន្នន័យចាស់ចោល
            document.getElementById('skmCusItemName').value = '';
            document.getElementById('skmCusItemQty').value = '1';
            document.getElementById('skmCusItemPrice').value = '';
        }

        setTimeout(() => { 
            modal.style.opacity = '1'; 
            document.getElementById('skmCusItemName').focus(); 
        }, 50);
    };

    window.addCustomItemToCart = function() {
        const nameInput = document.getElementById('skmCusItemName').value.trim();
        const qtyInput = parseFloat(document.getElementById('skmCusItemQty').value);
        const priceInput = parseFloat(document.getElementById('skmCusItemPrice').value);
        const currency = document.getElementById('skmCusItemCurrency').value;
        const exchangeRate = window.EXCHANGE_RATE || 4000; // ស្តង់ដារប្តូរប្រាក់

        const name = nameInput || "ទំនិញ/សេវាកម្មផ្សេងៗ";
        const qty = (isNaN(qtyInput) || qtyInput <= 0) ? 1 : qtyInput;

        if (isNaN(priceInput) || priceInput <= 0) {
            const pEl = document.getElementById('skmCusItemPrice');
            pEl.style.borderColor = '#ef4444';
            setTimeout(() => pEl.style.borderColor = '', 1000);
            return;
        }

        // បម្លែងលុយទៅជា USD ជាប្រព័ន្ធខាងក្រោយ
        let finalUsdPrice = priceInput;
        if (currency === 'KHR') {
            finalUsdPrice = priceInput / exchangeRate;
        }

        if (!window.cart) window.cart = [];
        
        const customItem = {
            id: 'CUSTOM_' + Date.now(),
            name: name,
            price: finalUsdPrice,
            riel: finalUsdPrice * exchangeRate,
            unit: 'ឯកតា',
            qty: 999999, // អត់ខ្វល់ស្តុក
            image: '', // អត់មានរូបភាព
            cartQty: qty
        };

        window.cart.push(customItem);
        
        if(typeof window.renderCart === 'function') window.renderCart();
        if(typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
        
        window.skmCloseCustomItem();
        
        if(typeof window.showToast === 'function') {
            window.showToast(`បានបញ្ចូល "${name}" ចូលកន្ត្រក!`);
        } else {
            const btn = document.querySelector('#skmQuickCustomBtn');
            if(btn) {
                const oldTxt = btn.innerHTML;
                btn.innerHTML = '✅ បានបញ្ចូល!';
                btn.style.background = '#10b981'; btn.style.color = '#fff';
                setTimeout(() => { btn.innerHTML = oldTxt; btn.style.background = ''; btn.style.color = ''; }, 1500);
            }
        }
    };

    const initInt = setInterval(() => {
        if (document.getElementById('posSearch')) {
            injectCustomItemBtn();
            clearInterval(initInt);
            console.log("✅ Ultra-Compact Quick Custom Item successfully injected!");
        }
    }, 1000);
})();
});

;
// === [16/43] ⭐ ពិនិត្យពិន្ទុសមាជិក loyalty_points_checker.js ===
window.skmRegisterBundledPlugin('pos', "⭐ ពិនិត្យពិន្ទុសមាជិក loyalty_points_checker.js", function() {
/* STREAMING_CHUNK:Initializing Loyalty Checker Plugin with Print functionality... */
(function() {
    console.log("⭐ POS Loyalty Points Checker Plugin Initialized!");

    function getCurrentBranchId() {
        return window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    }

    function openLoyaltyModal() {
        if(document.getElementById('skmLoyaltyModal')) {
            document.getElementById('skmLoyaltyModal').style.display = 'flex';
            loadLoyaltyList('');
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmLoyaltyModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;`;
        
        modal.innerHTML = `
            <div style="background: var(--bg-card, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 16px; width: 480px; max-height: 85vh; display:flex; flex-direction:column; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px;">
                    <h3 style="color:#f59e0b; margin:0; font-size:18px; font-weight:900;">⭐ ពិនិត្យពិន្ទុសមាជិក (Loyalty)</h3>
                    <button onclick="document.getElementById('skmLoyaltyModal').style.display='none'" style="background:#ef4444; border:none; color:#fff; width:28px; height:28px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <input type="text" id="skmLoyaltySearchInp" class="form-control" placeholder="🔍 ស្វែងរកឈ្មោះ ឬលេខទូរស័ព្ទសមាជិក..." style="width:100%; padding:12px; border-radius:10px; border:1px solid #f59e0b; outline:none; font-family:'Battambang';">
                </div>

                <div id="skmLoyaltyList" style="flex:1; overflow-y:auto; max-height:45vh; padding-right:5px;"></div>

                <div style="display:flex; gap:10px; border-top: 1px solid var(--border); padding-top: 15px; margin-top: 10px;">
                    <button class="btn btn-outline" style="flex:1; padding:12px; border-radius:10px;" onclick="document.getElementById('skmLoyaltyModal').style.display='none'">បិទត្រឡប់</button>
                    <button class="btn btn-primary" style="flex:1; padding:12px; border-radius:10px; background:#f59e0b; border:none; color:#fff; font-weight:bold; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);" onclick="window.printLoyaltyList()">🖨️ បោះពុម្ព (Print)</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('skmLoyaltySearchInp').oninput = (e) => {
            loadLoyaltyList(e.target.value.toLowerCase());
        };
        loadLoyaltyList('');
    }

    /* STREAMING_CHUNK:Rendering Loyalty List... */
    function loadLoyaltyList(filter) {
        const list = document.getElementById('skmLoyaltyList');
        if(!list) return;

        const branchId = getCurrentBranchId();
        let customers = window.customers || JSON.parse(localStorage.getItem(`ks2_${branchId}_customers_pro`) || '[]');
        
        if(filter) {
            customers = customers.filter(c => (c.name && c.name.toLowerCase().includes(filter)) || (c.phone && c.phone.includes(filter)));
        }

        // រៀបចំសមាជិកមានពិន្ទុខ្ពស់មកលើគេ
        customers.sort((a, b) => parseFloat(b.totalPaid || b.paid || 0) - parseFloat(a.totalPaid || a.paid || 0));

        if(customers.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:13px; font-weight:bold;">រកមិនឃើញទិន្នន័យសមាជិកទេ 🥲</div>';
            return;
        }

        list.innerHTML = customers.map(c => {
            let totalSpent = parseFloat(c.totalPaid || c.paid || 0);
            let points = Math.floor(totalSpent); // ឧទាហរណ៍៖ ចំណាយ 1$ = 1 ពិន្ទុ
            let tier = points >= 500 ? '👑 VIP Gold' : (points >= 200 ? '⭐ Silver' : '🥉 Member');

            return `
                <div class="loyalty-print-item" style="background:rgba(245, 158, 11, 0.05); padding:12px 15px; border-radius:10px; margin-bottom:8px; border:1px dashed #f59e0b; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:900; color:var(--text-main); font-size:15px; margin-bottom:4px;">👤 ${c.name}</div>
                        <div style="font-size:12px; color:var(--text-muted);">📞 ${c.phone || 'គ្មានលេខ'} | កម្រិត: <b style="color:#f59e0b;">${tier}</b></div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:18px; font-weight:900; color:#10b981;">⭐ ${points} pts</div>
                        <div style="font-size:11px; color:var(--text-muted);">ចំណាយសរុប: $${totalSpent.toFixed(2)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* STREAMING_CHUNK:Implementing Print layout... */
    window.printLoyaltyList = function() {
        const printContent = document.getElementById('skmLoyaltyList').innerHTML;
        const branchName = getCurrentBranchId();
        
        const printWindow = window.open('', '_blank', 'width=700,height=900');
        
        printWindow.document.write(`
            <html>
            <head>
                <title>បញ្ជីពិន្ទុសមាជិកអតិថិជន</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Battambang', sans-serif; padding: 30px; color: #1e293b; background: #ffffff; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    h2 { text-align: center; color: #f59e0b; font-size: 24px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;}
                    p.subtitle { text-align: center; font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 30px;}
                    
                    /* CSS សម្រាប់ Print ឱ្យច្បាស់ល្អ */
                    [style*="rgba(245, 158, 11, 0.05)"] { background: #fffbeb !important; border: 1px solid #fcd34d !important; }
                    [style*="color:var(--text-main)"] { color: #1e293b !important; }
                    [style*="color:var(--text-muted)"] { color: #64748b !important; }
                </style>
            </head>
            <body>
                <h2>⭐ របាយការណ៍ពិន្ទុសមាជិកអតិថិជន (Loyalty Points)</h2>
                <p class="subtitle">កាលបរិច្ឆេទរបាយការណ៍៖ ${new Date().toLocaleDateString('km-KH')} | សាខា៖ ${branchName}</p>
                <div class="print-container">
                    ${printContent}
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 800);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('⭐', 'ពិនិត្យពិន្ទុសមាជិក (Loyalty)', openLoyaltyModal, "⭐ ពិនិត្យពិន្ទុសមាជិក loyalty_points_checker.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [17/43] 🍃 Natural Wind Effect.js ===
window.skmRegisterBundledPlugin('pos', "🍃 Natural Wind Effect.js", function() {
(function() {
    // ⚡ ការពារកុំឱ្យកូដនេះរត់ជាន់គ្នាបង្កើតព្រិលទ្វេដង
    if (window.skmSnowEffectLoaded) return;
    window.skmSnowEffectLoaded = true;

    console.log("🌸 POS Ultra-Premium 3D Snow/Petal Effect Initialized!");

    const style = document.createElement('style');
    style.innerHTML = `
        .skm-snowflake {
            position: fixed;
            top: -20px;
            z-index: 99999;
            user-select: none;
            pointer-events: none;
            /* ⚡ ជំនួយ GPU ឱ្យដើររលូន មិនស៊ីថ្ម (Hardware Acceleration) */
            will-change: transform; 
            /* ប្រើចលនា ២ ចូលគ្នា៖ ធ្លាក់ចុះក្រោម + រវិចសងខាង */
            animation: skmFall linear forwards, skmSway ease-in-out infinite alternate;
        }
        
        @keyframes skmFall {
            0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
        
        /* ⚡ បង្កើតចលនារវិចៗសងខាង ឱ្យមើលទៅដូចធ្លាក់តាមខ្យល់ធម្មជាតិ */
        @keyframes skmSway {
            0% { margin-left: 0px; }
            100% { margin-left: 35px; }
        }
    `;
    document.head.appendChild(style);

    // ⚡ កំណត់បរិមាណអតិបរមា កុំឱ្យទូរស័ព្ទភ្ញៀវគាំង ឬឡើងកម្តៅ (Anti-Lag)
    let activeFlakes = 0;
    const MAX_FLAKES = 35; 

    function createSnowflake() {
        if (activeFlakes >= MAX_FLAKES) return;

        const flake = document.createElement('div');
        flake.className = 'skm-snowflake';
        
        // 🌸✨❄️ រូបតំណាងចម្រុះ (អាចថែមរូបស្លឹកឈើ 🍃 បានទៀត)
        const symbols = ['🌸', '✨', '❄️', '🌸', '🤍'];
        flake.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        
        // កំណត់ទីតាំង និងល្បឿនដោយចៃដន្យ
        const startX = Math.random() * window.innerWidth;
        const durationFall = Math.random() * 5 + 4; // ធ្លាក់យឺតៗ ៤ ទៅ ៩ វិនាទី
        const durationSway = Math.random() * 2 + 2; // រវិចៗ ២ ទៅ ៤ វិនាទី
        const size = Math.random() * 12 + 10;
        
        // ⚡ ធ្វើឱ្យផ្កាខ្លះព្រិលៗ (Blur) ដើម្បីមើលទៅមានជម្រៅ 3D ដូចនៅឆ្ងាយ
        const blur = Math.random() > 0.6 ? 'blur(1.5px)' : 'none'; 
        
        flake.style.left = startX + 'px';
        flake.style.fontSize = size + 'px';
        flake.style.animationDuration = durationFall + 's, ' + durationSway + 's';
        flake.style.filter = blur;
        
        document.body.appendChild(flake);
        activeFlakes++;
        
        // លុបចោលវិញពេលធ្លាក់ដល់ដី ដើម្បីសន្សំសំចៃ Memory ទូរស័ព្ទ
        setTimeout(() => {
            if(flake.parentNode) {
                flake.remove();
                activeFlakes--;
            }
        }, durationFall * 1000);
    }

    // បង្កើតធ្លាក់រៀងរាល់ ៤០០ មីលីវិនាទី (ថយល្បឿនបន្តិចកុំឱ្យញឹកពេក)
    setInterval(createSnowflake, 400);
})();
});

;
// === [18/43] 🎂 អតិថិជន VIP & ថ្ងៃកំណើត (vip_birthday_reminder.js).js ===
window.skmRegisterBundledPlugin('pos', "🎂 អតិថិជន VIP & ថ្ងៃកំណើត (vip_birthday_reminder.js).js", function() {
/* STREAMING_CHUNK:Initializing VIP & Birthday Plugin with Telegram Sync... */
(function() {
    console.log("🎂 POS VIP Birthday & Special Reminders Plugin Initialized (With Telegram Sync)!");

    // 🔑 Supabase Config សម្រាប់ការអាន Telegram Settings បើចាំបាច់
    const S_URL = 'https://qlzyyfqjwudbapgwsugu.supabase.co';
    const S_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsenl5ZnFqd3VkYmFwZ3dzdWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwODk2MzUsImV4cCI6MjEwODY2NTYzNX0.XQxNiUn2ZhivOjbqcWj0T6W1Abtx1H3kWrzIwqJPVtQ';
    
    let pluginSupabase = window.supabaseClient || null;
    if (!pluginSupabase && window.supabase) {
        pluginSupabase = window.supabase.createClient(S_URL, S_KEY, {
            auth: { persistSession: false },
            global: { fetch: (...args) => fetch(args[0], { ...args[1], cache: 'no-store' }) }
        });
    }

    /* STREAMING_CHUNK:Utility functions for Branch and Telegram... */
    function getCurrentBranchId() {
        return window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    }

    // ទាញយក Telegram Token ពី Admin Settings ស្ដង់ដារ
    async function getTelegramCredentials() {
        const currentBranch = getCurrentBranchId();
        let token = ''; let cid = '';
        try {
            if (window.botToken && window.chatId) return { token: window.botToken, cid: window.chatId };
            
            let sysData = JSON.parse(localStorage.getItem(`ks2_${currentBranch}_sys_settings`) || '{}');
            token = sysData.telegramBotToken || sysData.sysSettings?.telegramBotToken || '';
            cid = sysData.telegramChatId || sysData.sysSettings?.telegramChatId || '';
            
            if (token && cid) return { token, cid };
            
            if (pluginSupabase) {
                let { data } = await pluginSupabase.from('branch_store').select('data_json').eq('branch_id', currentBranch).maybeSingle();
                if (data && data.data_json) {
                    let s = data.data_json.sysSettings || {};
                    token = s.telegramBotToken || data.data_json.telegramBotToken || '';
                    cid = s.telegramChatId || data.data_json.telegramChatId || '';
                }
            }
        } catch(e) { console.warn("Error fetching Telegram Credentials:", e); }
        return { token, cid };
    }

    /* STREAMING_CHUNK:Rendering VIP Modal... */
    function openVipBirthdayModal() {
        if(document.getElementById('skmVipModal')) {
            document.getElementById('skmVipModal').style.display = 'flex';
            loadVipList();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmVipModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;`;
        
        modal.innerHTML = `
            <div style="background: var(--bg-card, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 16px; width: 480px; max-height: 85vh; display:flex; flex-direction:column; border: 1px solid var(--border, #334155); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border, #334155); padding-bottom:10px;">
                    <h3 style="color:#ec4899; margin:0; font-size:18px; font-weight:900;">🎂 អតិថិជន VIP & ថ្ងៃកំណើត</h3>
                    <button onclick="document.getElementById('skmVipModal').style.display='none'" style="background:#ef4444; border:none; color:#fff; width:28px; height:28px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
                </div>
                
                <div style="font-size:13px; color:var(--text-muted, #94a3b8); margin-bottom:15px;">បញ្ជីអតិថិជន VIP ដែលមានការបញ្ចុះតម្លៃ ឬត្រូវផ្តល់ជូនកាដូ៖</div>
                
                <div id="skmVipContent" style="flex:1; overflow-y:auto; max-height:45vh; padding-right:5px; margin-bottom:15px; display:flex; flex-direction:column; gap:10px;">
                    <!-- Injected via JS -->
                </div>

                <div style="display:flex; gap:10px; border-top: 1px solid var(--border, #334155); padding-top: 15px;">
                    <button class="btn btn-outline" style="flex:1; padding:12px; border-radius:12px; background:transparent; color:var(--text-main, #fff); border:1px solid var(--border, #334155); cursor:pointer; font-weight:bold;" onclick="document.getElementById('skmVipModal').style.display='none'">បិទ</button>
                    <button id="skmBtnSendVipSms" class="btn btn-primary" style="flex:2; padding:12px; border-radius:12px; background:linear-gradient(135deg, #ec4899, #be185d); border:none; color:white; cursor:pointer; font-weight:bold; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);" onclick="window.sendVipSmsBroadcast()">💌 ផ្ញើសារជូនពរ (Send SMS & Report)</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        loadVipList();
    }

    let currentVipCount = 0;

    /* STREAMING_CHUNK:Loading VIP data... */
    function loadVipList() {
        const branchId = getCurrentBranchId();
        let customers = window.customers || JSON.parse(localStorage.getItem(`ks2_${branchId}_customers_pro`) || '[]');
        const container = document.getElementById('skmVipContent');
        if(!container) return;

        // ចម្រងយកអតិថិជនណាដែលចំណាយច្រើនជាង ឬស្មើ 100$ ដើម្បចាត់ជា VIP
        let vipCustomers = customers.filter(c => parseFloat(c.totalPaid || c.paid || 0) >= 100);
        
        // រៀបចំអ្នកចំណាយច្រើនជាងគេឱ្យនៅខាងលើ
        vipCustomers.sort((a, b) => parseFloat(b.totalPaid || b.paid || 0) - parseFloat(a.totalPaid || a.paid || 0));
        
        currentVipCount = vipCustomers.length;

        if (vipCustomers.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted, #94a3b8); font-size:14px; background:rgba(0,0,0,0.2); border-radius:12px;">មិនទាន់មានអតិថិជន VIP ទេ 🥲</div>';
            return;
        }

        container.innerHTML = vipCustomers.map(c => {
            let totalSpent = parseFloat(c.totalPaid || c.paid || 0);
            return `
                <div style="background:rgba(236, 72, 153, 0.05); padding:12px 15px; border-radius:12px; border:1px dashed #ec4899; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:900; color:var(--text-main, #fff); font-size:15px; margin-bottom:4px;">👑 ${c.name}</div>
                        <div style="font-size:12px; color:var(--text-muted, #94a3b8);">📞 ${c.phone || 'គ្មានលេខទូរស័ព្ទ'} | VIP Tier: <b style="color:#ec4899;">Gold Member</b></div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:18px; font-weight:900; color:#10b981;">$${totalSpent.toFixed(2)}</div>
                        <div style="font-size:10px; color:var(--text-muted, #94a3b8); text-transform:uppercase;">ចំណាយសរុប</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* STREAMING_CHUNK:Implementing Telegram SMS broadcast reporter... */
    window.sendVipSmsBroadcast = async function() {
        if(currentVipCount === 0) {
            if(typeof window.showToast === 'function') window.showToast("គ្មានអតិថិជន VIP សម្រាប់ផ្ញើសារទេ!", true);
            else alert("គ្មានអតិថិជន VIP សម្រាប់ផ្ញើសារទេ!");
            return;
        }

        const btn = document.getElementById('skmBtnSendVipSms');
        btn.innerText = "⏳ កំពុងដំណើរការ...";
        btn.disabled = true;

        try {
            const { token, cid } = await getTelegramCredentials();
            
            if (token && cid) {
                // ផ្ញើសាររាយការណ៍ចូល Telegram ថៅកែ (អក្សរធំដិត)
                let msg = `📢 <b><BIG>របាយការណ៍ទីផ្សារ (Marketing)</BIG></b>\n\n🎯 <b>សកម្មភាព:</b> បុគ្គលិកបានចុចផ្ញើសារ SMS (ជូនពរ/ប្រូម៉ូសិន)\n👥 <b>ចំនួនអតិថិជន VIP ទទួលបាន:</b> <b>${currentVipCount} នាក់</b>\n🕒 <b>ពេលវេលា:</b> ${new Date().toLocaleString('km-KH')}`;
                
                await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({chat_id: cid, text: msg, parse_mode: 'HTML'})
                });
            } else {
                console.warn("មិនមាន Telegram Token សម្រាប់រាយការណ៍ទេ!");
            }

            // បង្ហាញ UI ថាផ្ញើជោគជ័យ
            if(typeof window.showToast === 'function') window.showToast(`✅ បានផ្ញើសារជូនពរដល់អតិថិជន VIP ទាំង ${currentVipCount} នាក់រួចរាល់!`);
            else alert(`✅ បានផ្ញើសារជូនពរដល់អតិថិជន VIP ទាំង ${currentVipCount} នាក់រួចរាល់!`);
            
            document.getElementById('skmVipModal').style.display = 'none';

        } catch (e) {
            console.error("Error sending VIP Broadcast:", e);
            if(typeof window.showToast === 'function') window.showToast("❌ មានបញ្ហាក្នុងការផ្ញើសារ!", true);
        }

        btn.innerText = "💌 ផ្ញើសារជូនពរ (Send SMS & Report)";
        btn.disabled = false;
    };

    /* STREAMING_CHUNK:Registering plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🎂', 'អតិថិជន VIP & ថ្ងៃកំណើត', openVipBirthdayModal, "🎂 អតិថិជន VIP & ថ្ងៃកំណើត (vip_birthday_reminder.js).js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [19/43] 🏆 គណនាកម្រៃជើងសារបុគ្គលិក staff_commission.js ===
window.skmRegisterBundledPlugin('pos', "🏆 គណនាកម្រៃជើងសារបុគ្គលិក staff_commission.js", function() {
/* STREAMING_CHUNK:Initializing Staff Commission Plugin with Print Fix... */
(function() {
    console.log("🏆 POS Staff Commission & Performance Plugin Initialized!");

    function openCommissionModal() {
        if(document.getElementById('skmCommissionModal')) {
            document.getElementById('skmCommissionModal').style.display = 'flex';
            calcCommissionData();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmCommissionModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;`;
        
        modal.innerHTML = `
            <div style="background: var(--bg-card, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 16px; width: 480px; max-height: 85vh; display:flex; flex-direction:column; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px;">
                    <h3 style="color:#f59e0b; margin:0; font-size:18px; font-weight:900;">🏆 គណនាកម្រៃជើងសារបុគ្គលិក (Commission)</h3>
                    <button onclick="document.getElementById('skmCommissionModal').style.display='none'" style="background:#ef4444; border:none; color:#fff; width:28px; height:28px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
                </div>
                
                <div style="display:flex; gap:10px; margin-bottom:15px; align-items:center; background: rgba(245, 158, 11, 0.1); padding: 10px; border-radius: 10px; border: 1px dashed #f59e0b;">
                    <label style="font-size:13px; font-weight:bold; color: #f59e0b; white-space:nowrap;">ភាគរយភាគលាភ (%):</label>
                    <input type="number" id="skmCommRate" class="form-control" value="2" style="width:80px; text-align:center; font-weight:bold; font-size:14px; border:1px solid #f59e0b;" oninput="window.calcCommissionData()">
                    <span style="font-size:12px; color:var(--text-muted);">(ឧ. ២% នៃការលក់សរុប)</span>
                </div>

                <div id="skmCommissionContent" style="flex:1; overflow-y:auto; max-height:45vh; padding-right:5px; margin-bottom:15px; display:flex; flex-direction:column; gap:8px;">
                    <!-- Injected via JS -->
                </div>

                <div style="display:flex; gap:10px; border-top: 1px solid var(--border); padding-top: 15px;">
                    <button class="btn btn-outline" style="flex:1; border-color:var(--border); color:var(--text-main); font-weight:bold;" onclick="document.getElementById('skmCommissionModal').style.display='none'">បិទ</button>
                    <button class="btn btn-primary" style="flex:1; background:#f59e0b; border:none; font-weight:bold; color:#fff; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);" onclick="window.printCommissionSummary()">🖨️ បោះពុម្ព (Print)</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        calcCommissionData();
    }

    /* STREAMING_CHUNK:Calculating and rendering commission data... */
    window.calcCommissionData = function() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices_pro`) || '[]');
        let rateInput = document.getElementById('skmCommRate');
        let commRate = rateInput ? parseFloat(rateInput.value) || 0 : 2;
        let today = new Date().toLocaleDateString();

        let staffSales = {};
        let totalCommissionAll = 0;

        invoices.forEach(inv => {
            let invDate = inv.date ? inv.date.split(' ')[0] : '';
            if (inv.status === 'paid' && invDate === today) {
                let seller = inv.seller || inv.cashier || 'បុគ្គលិកទូទៅ';
                let amount = parseFloat(inv.totalAmount || 0);
                if (!staffSales[seller]) staffSales[seller] = 0;
                staffSales[seller] += amount;
            }
        });

        const container = document.getElementById('skmCommissionContent');
        if(!container) return;

        let keys = Object.keys(staffSales);
        if (keys.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted); font-size:14px; font-weight:bold;">គ្មានទិន្នន័យការលក់ថ្ងៃនេះទេ</div>';
            return;
        }

        let htmlContent = keys.map(seller => {
            let sales = staffSales[seller];
            let commission = sales * (commRate / 100);
            totalCommissionAll += commission;
            
            return `
                <div style="background:rgba(245, 158, 11, 0.05); padding:12px 15px; border-radius:10px; border:1px solid rgba(245, 158, 11, 0.2); display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:900; color:var(--text-main); font-size:15px; margin-bottom:4px;">👤 ${seller}</div>
                        <div style="font-size:12px; color:var(--text-muted);">យតលក់សរុបថ្ងៃនេះ: <b style="color:#10b981;">$${sales.toFixed(2)}</b></div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:18px; font-weight:900; color:#f59e0b;">$${commission.toFixed(2)}</div>
                        <div style="font-size:10px; color:var(--text-muted);">កម្រៃជើងសារ (${commRate}%)</div>
                    </div>
                </div>
            `;
        }).join('');
        
        // បន្ថែមប្រអប់សរុបរួមនៅខាងក្រោម
        htmlContent += `
            <div style="background:rgba(245, 158, 11, 0.1); border:2px dashed #f59e0b; padding:15px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                <div style="font-size:14px; font-weight:bold; color:#f59e0b;">ប្រាក់រង្វាន់សរុបត្រូវបើក:</div>
                <b style="color:#f59e0b; font-size:20px; font-weight:900;">$${totalCommissionAll.toFixed(2)}</b>
            </div>
        `;
        
        container.innerHTML = htmlContent;
    };

    /* STREAMING_CHUNK:Implementing print logic with CSS injection for backgrounds... */
    window.printCommissionSummary = function() {
        const printContent = document.getElementById('skmCommissionContent').innerHTML;
        const branchName = window.SHOP_BRANCH_ID || 'សាខាទី ១';
        const rateInput = document.getElementById('skmCommRate');
        const commRate = rateInput ? rateInput.value : 2;
        
        const printWindow = window.open('', '_blank', 'width=600,height=800');
        
        // សរសេរកូដ HTML ចូលទៅក្នុងផ្ទាំងថ្មី ព្រមទាំងបង្ខំឱ្យ Printer គូរ Background (print-color-adjust)
        printWindow.document.write(`
            <html>
            <head>
                <title>របាយការណ៍កម្រៃជើងសារ - ${branchName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Battambang', sans-serif;
                        padding: 30px;
                        color: #1e293b;
                        background: #ffffff;
                    }
                    /* បង្ខំ Printer ឱ្យព្រីនចេញពណ៌ Background ទាំងអស់ */
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .no-print { display: none !important; }
                    }
                    h2 { text-align: center; color: #f59e0b; font-size: 22px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;}
                    p.subtitle { text-align: center; font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 30px;}
                    
                    /* លុបធាតុ UI ងងឹត (Dark Mode) ទៅជាពណ៌ភ្លឺ (Light Mode) សម្រាប់ព្រីនលើក្រដាសស */
                    [style*="rgba(245, 158, 11, 0.05)"] { background: #fffbeb !important; border-color: #fde68a !important; }
                    [style*="rgba(245, 158, 11, 0.1)"] { background: #fef3c7 !important; }
                    [style*="color:var(--text-main)"] { color: #1e293b !important; }
                    [style*="color:var(--text-muted)"] { color: #64748b !important; }
                </style>
            </head>
            <body>
                <h2>🏆 របាយការណ៍កម្រៃជើងសារបុគ្គលិក</h2>
                <p class="subtitle">ប្រចាំថ្ងៃទី៖ ${new Date().toLocaleDateString('km-KH')} | សាខា៖ ${branchName} | អត្រា៖ ${commRate}%</p>
                
                <div class="print-container">
                    ${printContent}
                </div>
                
                <div style="text-align:center; font-size:10px; color:gray; margin-top:30px;">បោះពុម្ពនៅម៉ោង៖ ${new Date().toLocaleString('km-KH')}</div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // ទុកពេលឱ្យ Font ដើរ និងរូបភាព Render សិន ទើបហៅ Print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 800);
    };

    /* STREAMING_CHUNK:Registering plugin to the system... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🏆', 'កម្រៃជើងសារបុគ្គលិក (Commission)', openCommissionModal, "🏆 គណនាកម្រៃជើងសារបុគ្គលិក staff_commission.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [20/43] 🏷️ គណនាលក់បញ្ចុះតម្លៃរហ័ស (discount_helper.js).js ===
window.skmRegisterBundledPlugin('pos', "🏷️ គណនាលក់បញ្ចុះតម្លៃរហ័ស (discount_helper.js).js", function() {
/* STREAMING_CHUNK:Initializing POS Discount Helper with Fixed KHR Conversion Pro... */
(function() {
    console.log("🏷️ POS Discount Helper Pro Initialized!");

    // 🌟 បង្កប់ CSS ផ្ទាល់ខ្លួនសម្រាប់ Modal ឱ្យមានសោភ័ណភាពស្អាតទំនើប
    if (!document.getElementById('skm-discount-style')) {
        const style = document.createElement('style');
        style.id = 'skm-discount-style';
        style.innerHTML = `
            .skm-disc-bg {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
                z-index: 100000; display: flex; justify-content: center; align-items: center;
                font-family: 'Battambang', sans-serif; opacity: 0; transition: opacity 0.3s ease;
                pointer-events: none;
            }
            .skm-disc-bg.skm-show {
                opacity: 1; pointer-events: auto;
            }
            .skm-disc-content {
                background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b);
                max-width: 440px; width: 92%; padding: 25px; border-radius: 28px;
                max-height: 88vh; display: flex; flex-direction: column;
                box-shadow: 0 25px 60px -15px rgba(0,0,0,0.3);
                transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid var(--border-color, #e2e8f0);
            }
            .skm-disc-bg.skm-show .skm-disc-content {
                transform: translateY(0) scale(1);
            }
        `;
        document.head.appendChild(style);
    }

    /* STREAMING_CHUNK:Opening Discount Helper Modal with Fixed KHR Support... */
    function openDiscountHelper() {
        let modal = document.getElementById('skmDiscountModal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('skm-show'), 10);
            return;
        }

        modal = document.createElement('div');
        modal.className = 'skm-disc-bg';
        modal.id = 'skmDiscountModal';
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('skm-show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };

        modal.innerHTML = `
            <div class="skm-disc-content" onclick="event.stopPropagation()">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border-color, #e2e8f0); padding-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width: 42px; height: 42px; background: rgba(56, 189, 248, 0.12); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                            🏷️
                        </div>
                        <div>
                            <h3 style="color:var(--text-dark, #1e293b); margin:0; font-size:16px; font-weight:900;">គណនាលក់បញ្ចុះតម្លៃរហ័ស</h3>
                            <div style="font-size:11px; color:var(--text-muted, #64748b); font-weight:700;">Quick Discount Calculator (USD & KHR)</div>
                        </div>
                    </div>
                    <div onclick="document.getElementById('skmDiscountModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmDiscountModal').style.display='none', 300);" style="color: var(--text-muted, #9ca3af); font-size: 16px; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; background: var(--store-bg, #f1f5f9); display: flex; align-items: center; justify-content: center; font-weight: bold;">✕</div>
                </div>
                
                <!-- តម្លៃដើមទំនិញ (អាចជ្រើសរើស USD ឬ KHR) -->
                <div style="margin-bottom:14px;">
                    <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800; color:var(--text-dark, #1e293b);">តម្លៃដើមទំនិញ៖</label>
                    <div style="display:flex; gap:8px;">
                        <input type="number" id="skmOrigPrice" class="input-st" placeholder="0.00" style="margin-bottom:0; flex:1; padding:12px; font-size:16px; font-weight:bold;" oninput="window.calcDiscountResult()">
                        <select id="skmOrigCurr" class="input-st" style="margin-bottom:0; width:120px; padding:12px; font-size:13px; cursor:pointer; font-weight:bold;" onchange="window.calcDiscountResult()">
                            <option value="USD">USD ($)</option>
                            <option value="KHR">KHR (៛)</option>
                        </select>
                    </div>
                </div>
                
                <!-- អត្រាបញ្ចុះតម្លៃ -->
                <div style="margin-bottom:15px;">
                    <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800; color:var(--text-dark, #1e293b);">អត្រាបញ្ចុះតម្លៃ (% ឬ រូបិយប័ណ្ណ)៖</label>
                    <div style="display:flex; gap:8px;">
                        <input type="number" id="skmDiscVal" class="input-st" placeholder="10" style="margin-bottom:0; flex:1; padding:12px; font-size:16px; font-weight:bold;" oninput="window.calcDiscountResult()">
                        <select id="skmDiscType" class="input-st" style="margin-bottom:0; width:120px; padding:12px; font-size:13px; cursor:pointer; font-weight:bold;" onchange="window.calcDiscountResult()">
                            <option value="percent">% ភាគរយ</option>
                            <option value="amount">ចំនួនប្រាក់</option>
                        </select>
                    </div>
                </div>

                <button style="width:100%; margin-bottom:18px; background:linear-gradient(135deg, #0ea5e9, #0284c7); color:white; border:none; border-radius:14px; padding:13px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.35); font-family:'Battambang'; font-size:14px;" onclick="window.calcDiscountResult()">🧮 គណនារកតម្លៃលក់ចុងក្រោយ</button>

                <div style="background: rgba(56,189,248,0.06); border: 1px dashed #38bdf8; padding: 16px; border-radius: 16px; text-align: center; margin-bottom: 18px;">
                    <div style="font-size:12px; color:var(--text-muted, #64748b); font-weight:800;">តម្លៃត្រូវបង់ក្រោយបញ្ចុះតម្លៃ:</div>
                    <div id="skmFinalPriceDisplay" style="font-size:24px; font-weight:900; color:#0284c7; margin-top:4px;">$0.00 (0 ៛)</div>
                    <div id="skmSavedDisplay" style="font-size:12px; color:#10b981; font-weight:900; margin-top:4px;">ចំណេញបាន: $0.00 (0 ៛)</div>
                </div>

                <div style="display:flex; justify-content:flex-end; border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 15px;">
                    <button style="border:1px solid var(--border-color, #e2e8f0); color:var(--text-dark, #1e293b); border-radius:12px; padding:10px 22px; font-weight:bold; cursor:pointer; background:transparent; font-family:'Battambang'; font-size:13px;" onclick="document.getElementById('skmDiscountModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmDiscountModal').style.display='none', 300);">បិទ</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('skm-show'), 10);
    }

    /* STREAMING_CHUNK:Calculating discount with proper currency handling... */
    window.calcDiscountResult = function() {
        const origInput = parseFloat(document.getElementById('skmOrigPrice').value);
        const val = parseFloat(document.getElementById('skmDiscVal').value);
        const type = document.getElementById('skmDiscType').value;
        const curr = document.getElementById('skmOrigCurr').value;
        const exRate = 4000; // អត្រាប្តូរប្រាក់រៀលស្ដង់ដារ

        if(isNaN(origInput) || origInput <= 0) { 
            document.getElementById('skmFinalPriceDisplay').innerText = `$0.00 (0 ៛)`;
            document.getElementById('skmSavedDisplay').innerText = `ចំណេញបាន: $0.00 (0 ៛)`;
            return; 
        }

        // បម្លែងតម្លៃដើមទៅជា USD សម្រាប់ការគណនា
        let origUsd = curr === 'KHR' ? origInput / exRate : origInput;
        let valNum = isNaN(val) ? 0 : val;

        let finalUsd = 0;
        let savedUsd = 0;

        if (type === 'percent') {
            savedUsd = origUsd * (valNum / 100);
            finalUsd = origUsd - savedUsd;
        } else {
            // បើបញ្ចុះជាចំនួនប្រាក់ ផ្អែកតាម Currency ដែលបានរើស
            let discountUsd = curr === 'KHR' ? valNum / exRate : valNum;
            savedUsd = discountUsd;
            finalUsd = Math.max(0, origUsd - savedUsd);
        }

        const finalKhr = Math.round(finalUsd * exRate).toLocaleString();
        const savedKhr = Math.round(savedUsd * exRate).toLocaleString();

        document.getElementById('skmFinalPriceDisplay').innerText = `$${finalUsd.toFixed(2)} (${finalKhr} ៛)`;
        document.getElementById('skmSavedDisplay').innerText = `ចំណេញបាន: $${savedUsd.toFixed(2)} (${savedKhr} ៛)`;
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🏷️️', 'គណនាលក់បញ្ចុះតម្លៃរហ័ស', openDiscountHelper, "🏷️ គណនាលក់បញ្ចុះតម្លៃរហ័ស (discount_helper.js).js");
            clearInterval(initInt);
        }
    }, 300);
})();
});

;
// === [21/43] 🏷️ បង្កើតស្លាកតម្លៃទំនិញ price_tag.js ===
window.skmRegisterBundledPlugin('pos', "🏷️ បង្កើតស្លាកតម្លៃទំនិញ price_tag.js", function() {
/* STREAMING_CHUNK:Initializing POS Price Tag Generator Pro V6... */
(function() {
    console.log("🏷️ POS Price Tag Generator Pro V6 (Auto-Add & Bulk Category) Initialized!");

    let printList = []; // ផ្ទុកទិន្នន័យទំនិញដែលត្រូវព្រីន

    // 🌟 បង្កប់ CSS ផ្ទាល់ខ្លួនសម្រាប់ Modal & Smart Search
    if (!document.getElementById('skm-pricetag-style')) {
        const style = document.createElement('style');
        style.id = 'skm-pricetag-style';
        style.innerHTML = `
            .skm-tag-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.65); backdrop-filter: blur(6px); z-index: 100000; display: flex; justify-content: center; align-items: center; font-family: 'Battambang', sans-serif; opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
            .skm-tag-bg.skm-show { opacity: 1; pointer-events: auto; }
            .skm-tag-content { background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b); max-width: 600px; width: 95%; padding: 22px; border-radius: 24px; max-height: 88vh; display: flex; flex-direction: column; box-shadow: 0 25px 60px -15px rgba(0,0,0,0.3); transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 1px solid var(--border-color, #e2e8f0); overflow: hidden; }
            .skm-tag-bg.skm-show .skm-tag-content { transform: translateY(0) scale(1); }
            
            /* រចនា Search Box & Results */
            .tag-search-item { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s; }
            .tag-search-item:hover { background: #f8fafc; }
            
            /* រចនាបញ្ជីរង់ចាំព្រីន */
            .tag-list-container { flex: 1; overflow-y: auto; margin-top: 15px; border: 1px solid #cbd5e1; border-radius: 12px; padding: 10px; background: #f8fafc; min-height: 150px; max-height: 350px; }
            .tag-list-item { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 10px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
            .tag-qty-input { width: 60px; text-align: center; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px; font-weight: bold; outline: none; }
            .tag-qty-input:focus { border-color: #10b981; }
        `;
        document.head.appendChild(style);
    }

    function openPriceTagModal() {
        let modal = document.getElementById('skmPriceTagModal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('skm-show'), 10);
            loadTagCategories();
            return;
        }

        modal = document.createElement('div');
        modal.className = 'skm-tag-bg';
        modal.id = 'skmPriceTagModal';
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('skm-show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };

        modal.innerHTML = `
            <div class="skm-tag-content" onclick="event.stopPropagation()">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border-color, #e5e7eb); padding-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width: 40px; height: 40px; background: rgba(245, 158, 11, 0.12); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🏷️</div>
                        <div>
                            <h3 style="color:var(--text-dark, #1e293b); margin:0; font-size:16px; font-weight:900;">ព្រីនស្លាកតម្លៃ (Ultimate Batch)</h3>
                            <div style="font-size:11px; color:var(--text-muted, #64748b); font-weight:700;">ទាញចូលម្ដង១ប្រភេទ ឬស្កេនចូលអូតូ</div>
                        </div>
                    </div>
                    <div onclick="document.getElementById('skmPriceTagModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmPriceTagModal').style.display='none', 300);" style="color: var(--text-muted, #9ca3af); font-size: 16px; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; background: var(--store-bg, #f1f5f9); display: flex; align-items: center; justify-content: center; font-weight: bold;">✕</div>
                </div>
                
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <!-- ជួរទី១: ចំណងជើង & ខ្នាត -->
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 150px;">
                            <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800;">ចំណងជើងស្លាក:</label>
                            <input type="text" id="skmTagHeaderInput" class="input-st" value="${window.shopName || localStorage.getItem('ks2_' + (window.SHOP_BRANCH_ID || 'branch_1') + '_shop_name') || 'SKM INTEGRATE'}" style="margin-bottom:0; padding:10px; font-size:13px; width:100%; border-radius: 8px; border: 1px solid #cbd5e1;">
                        </div>
                        <div style="flex: 1; min-width: 120px;">
                            <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800;">ខ្នាតក្រដាស៖</label>
                            <select id="skmTagSizeSelect" class="input-st" style="margin-bottom:0; padding:10px; font-size:13px; cursor:pointer; width:100%; border-radius: 8px; border: 1px solid #cbd5e1;">
                                <option value="50x30">👉 50mm x 30mm</option>
                                <option value="40x30">👉 40mm x 30mm</option>
                                <option value="30x20">👉 30mm x 20mm</option>
                                <option value="25x15">👉 25mm x 15mm</option>
                            </select>
                        </div>
                        <div style="width: 80px;">
                            <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800;">គម្លាត (mm):</label>
                            <input type="number" id="skmTagMarginInput" class="input-st" value="1" min="0" max="10" step="0.5" style="margin-bottom:0; padding:10px; font-size:13px; width:100%; border-radius: 8px; border: 1px solid #cbd5e1;">
                        </div>
                    </div>
                    
                    <!-- ជួរទី២: Search & Bulk Add -->
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 5px;">
                        <!-- ស្កេន ឬស្វែងរក -->
                        <div style="flex: 1.5; min-width: 200px; position: relative;">
                            <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800; color: #10b981;">ស្វែងរក ឬស្កេនបាកូដ 🔍</label>
                            <input type="text" id="skmTagSearchInput" class="input-st" placeholder="ស្កេន ឬវាយឈ្មោះ (លោតចូលបញ្ជីភ្លាមៗ)..." style="margin-bottom:0; padding:10px; font-size:13px; width:100%; border-radius: 8px; border: 2px solid #10b981;" oninput="window.filterTagProducts(this.value)" onfocus="window.filterTagProducts(this.value)" onkeypress="window.handleTagBarcodeScan(event)" autocomplete="off">
                            
                            <div id="skmTagSearchResults" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:100%; max-height:220px; overflow-y:auto; background:#fff; border:1px solid #cbd5e1; border-radius:8px; z-index:100; box-shadow:0 10px 25px rgba(0,0,0,0.1);"></div>
                        </div>
                        
                        <!-- ទាញម្ដង១ប្រភេទ (Bulk Add) -->
                        <div style="flex: 1; min-width: 150px;">
                            <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800; color: #0ea5e9;">បន្ថែមម្ដង ១ ប្រភេទ 📦</label>
                            <div style="display: flex; gap: 5px;">
                                <select id="skmTagCategorySelect" class="input-st" style="margin-bottom:0; padding:10px; font-size:13px; cursor:pointer; flex: 1; border-radius: 8px; border: 1px solid #0ea5e9;">
                                    <option value="">-- រើសប្រភេទ --</option>
                                </select>
                                <button style="background:#0ea5e9; color:white; border:none; border-radius:8px; padding:0 12px; font-weight:bold; cursor:pointer; font-family:'Battambang'; font-size:13px;" onclick="window.addCategoryToTagList()" title="ទាញទំនិញទាំងអស់ក្នុងប្រភេទនេះចូលបញ្ជី">➕ បន្ថែម</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- បញ្ជីរង់ចាំព្រីន -->
                <div class="tag-list-container">
                    <div style="font-size: 12px; font-weight: bold; color: var(--text-muted); margin-bottom: 8px; display: flex; justify-content: space-between;">
                        <span>បញ្ជីរង់ចាំព្រីន៖</span>
                        <span style="color: #10b981; font-weight: normal;">* អាចកែប្រែចំនួនសន្លឹក (Qty) តាមចិត្ត</span>
                    </div>
                    <div id="skmTagPrintListBody">
                        <div style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">មិនទាន់មានទំនិញទេ។ សូមស្កេន បញ្ចូលឈ្មោះ ឬជ្រើសរើសប្រភេទ។</div>
                    </div>
                </div>

                <!-- Footer ប៊ូតុងបញ្ជា -->
                <div style="display:flex; justify-content: space-between; align-items: center; margin-top: 15px; border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 15px;">
                    <div style="font-size: 13px; font-weight: bold; color: #1e293b;">សរុបស្លាក: <span id="skmTotalTagsCount" style="color: #d97706; font-size: 18px; font-weight: 900;">0</span></div>
                    <div style="display:flex; gap:10px;">
                        <button style="border:1px solid var(--border-color, #e2e8f0); color:var(--text-dark, #1e293b); border-radius:10px; padding:10px 15px; font-weight:bold; cursor:pointer; background:transparent; font-family:'Battambang'; font-size:13px;" onclick="window.clearTagPrintList()">សម្អាត</button>
                        <button style="background:linear-gradient(135deg, #f59e0b, #d97706); color:white; border:none; border-radius:10px; padding:10px 20px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35); font-family:'Battambang'; font-size:13px;" onclick="window.printPriceTagProBatch()">🖨️ បោះពុម្ពបញ្ជីនេះ</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('skm-show'), 10);
        
        loadTagCategories();
        printList = []; 
        renderTagPrintList();
    }

    // ទាញយកប្រភេទ (Categories) ចូល Dropdown Bulk Add
    function loadTagCategories() {
        const select = document.getElementById('skmTagCategorySelect');
        if(!select) return;
        let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_inv_pro`) || '[]');
        
        let categories = [...new Set(inv.filter(p => p && p.category).map(p => String(p.category).trim()).filter(Boolean))];
        
        select.innerHTML = '<option value="">-- រើសប្រភេទ --</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    // 🌟 មុខងារ Search ទំនិញឆ្លាតវៃ
    window.filterTagProducts = function(keyword) {
        const resBox = document.getElementById('skmTagSearchResults');
        if(!resBox) return;
        
        keyword = keyword.toLowerCase().trim();
        let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_inv_pro`) || '[]');
        
        let filtered = inv;
        if (keyword !== '') {
            filtered = inv.filter(p => 
                (p.name && p.name.toLowerCase().includes(keyword)) || 
                (p.customId && String(p.customId).toLowerCase().includes(keyword)) ||
                (p.id && String(p.id).toLowerCase().includes(keyword))
            );
        }
        
        filtered = filtered.slice(0, 30); // ការពារគាំង

        if (filtered.length === 0) {
            resBox.innerHTML = '<div style="padding: 12px; text-align: center; color: #94a3b8; font-size: 13px;">រកមិនឃើញទំនិញទេ</div>';
        } else {
            resBox.innerHTML = filtered.map(p => `
                <div class="tag-search-item" onclick="window.selectAndAutoAddTag('${p.id}')">
                    <div style="flex:1; min-width:0; padding-right:10px;">
                        <div style="font-size: 13px; font-weight: bold; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
                        <div style="font-size: 10px; color: #64748b;">SKU/Barcode: ${p.customId || p.id}</div>
                    </div>
                    <div style="font-size: 13px; font-weight: 900; color: #10b981;">$${parseFloat(p.price||0).toFixed(2)}</div>
                </div>
            `).join('');
        }
        resBox.style.display = 'block';
    };

    // 🌟 Auto-Add ពេលចុចរើសពីបញ្ជី Search
    window.selectAndAutoAddTag = function(id) {
        document.getElementById('skmTagSearchResults').style.display = 'none';
        document.getElementById('skmTagSearchInput').value = '';
        executeAddTagToList(id);
    };

    // 🌟 Auto-Add ពេលស្កេនបាកូដ ឬវាយកូដចុច Enter
    window.handleTagBarcodeScan = function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const input = document.getElementById('skmTagSearchInput');
            const code = input.value.trim().toLowerCase();
            if (!code) return;

            let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_inv_pro`) || '[]');
            const found = inv.find(p => p && (
                String(p.customId || '').toLowerCase() === code ||
                String(p.id || '').toLowerCase() === code
            ));

            if (found) {
                input.value = '';
                document.getElementById('skmTagSearchResults').style.display = 'none';
                executeAddTagToList(found.id);
            } else {
                alert('រកមិនឃើញបាកូដនេះទេ!');
            }
        }
    };

    // 🌟 Bulk Add: ទាញម្ដង១ប្រភេទចូលបញ្ជី
    window.addCategoryToTagList = function() {
        const catSelect = document.getElementById('skmTagCategorySelect');
        const selectedCat = catSelect.value;
        if (!selectedCat) return alert('សូមជ្រើសរើសប្រភេទជាមុនសិន!');

        let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_inv_pro`) || '[]');
        let itemsInCat = inv.filter(p => p && String(p.category).trim() === selectedCat);

        if (itemsInCat.length === 0) return alert('មិនមានទំនិញក្នុងប្រភេទនេះទេ!');

        itemsInCat.forEach(p => {
            const existingIdx = printList.findIndex(item => String(item.id) === String(p.id));
            if (existingIdx === -1) {
                printList.push({ id: p.id, name: p.name, price: parseFloat(p.price || 0).toFixed(2), code: p.customId || p.id, qty: 1 });
            }
        });

        catSelect.value = '';
        renderTagPrintList();
    };

    // Function ស្នូលសម្រាប់ Push ចូលបញ្ជី
    function executeAddTagToList(id) {
        let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_inv_pro`) || '[]');
        const p = inv.find(x => String(x.id) === String(id));
        if(!p) return;

        const existingIdx = printList.findIndex(item => String(item.id) === String(id));
        if (existingIdx > -1) {
            printList[existingIdx].qty += 1;
        } else {
            printList.push({ id: p.id, name: p.name, price: parseFloat(p.price || 0).toFixed(2), code: p.customId || p.id, qty: 1 });
        }
        renderTagPrintList();
    }

    // បិទប្រអប់ Search ពេលចុចក្រៅ
    document.addEventListener('click', function(e) {
        const resBox = document.getElementById('skmTagSearchResults');
        const searchInput = document.getElementById('skmTagSearchInput');
        if (resBox && e.target !== searchInput && !resBox.contains(e.target)) {
            resBox.style.display = 'none';
        }
    });

    window.updateTagQty = function(index, newQty) {
        newQty = parseInt(newQty);
        if(isNaN(newQty) || newQty < 1) newQty = 1;
        printList[index].qty = newQty;
        renderTagPrintList();
    };

    window.removeTagFromList = function(index) {
        printList.splice(index, 1);
        renderTagPrintList();
    };

    window.clearTagPrintList = function() {
        printList = [];
        renderTagPrintList();
    };

    function renderTagPrintList() {
        const listBody = document.getElementById('skmTagPrintListBody');
        const countDisplay = document.getElementById('skmTotalTagsCount');
        if(!listBody || !countDisplay) return;

        let totalTags = 0;
        if (printList.length === 0) {
            listBody.innerHTML = '<div style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">មិនទាន់មានទំនិញទេ។ សូមស្កេន បញ្ចូលឈ្មោះ ឬជ្រើសរើសប្រភេទ។</div>';
        } else {
            listBody.innerHTML = printList.map((item, idx) => {
                totalTags += item.qty;
                return `
                <div class="tag-list-item">
                    <div style="flex: 1; min-width: 0; padding-right: 10px;">
                        <div style="font-size: 13px; font-weight: bold; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
                        <div style="font-size: 11px; color: #10b981; font-weight: bold;">$${item.price} <span style="color:#64748b;font-size:10px;">(SKU: ${item.code})</span></div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <span style="font-size: 9px; color: #64748b; font-weight: bold;">ចំនួន</span>
                            <input type="number" class="tag-qty-input" value="${item.qty}" min="1" onchange="window.updateTagQty(${idx}, this.value)">
                        </div>
                        <button style="background: transparent; color: #ef4444; border: none; cursor: pointer; padding: 5px; margin-top: 12px;" onclick="window.removeTagFromList(${idx})"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `}).join('');
        }
        countDisplay.innerText = totalTags;
        
        // រំកិលចុះក្រោមស្វ័យប្រវត្តិពេលថែមថ្មី
        const container = document.querySelector('.tag-list-container');
        if (container) container.scrollTop = container.scrollHeight;
    }

    // មុខងារព្រីនដោយគណនាខ្នាតក្រដាសស្វ័យប្រវត្តិ និងមានគម្លាត
    window.printPriceTagProBatch = function() {
        if (printList.length === 0) {
            alert('សូមបន្ថែមទំនិញចូលបញ្ជីជាមុនសិន!');
            return;
        }

        const headerInp = document.getElementById('skmTagHeaderInput');
        const header = (headerInp && headerInp.value.trim()) ? headerInp.value.trim() : (window.shopName || 'SKM INTEGRATE');
        
        const sizeSelect = document.getElementById('skmTagSizeSelect');
        const tagSize = sizeSelect ? sizeSelect.value : '50x30';

        const marginInp = document.getElementById('skmTagMarginInput');
        const customMargin = marginInp && marginInp.value ? marginInp.value : '0';

        // កំណត់ Configuration តាមខ្នាតដែលបានជ្រើសរើស (ទំហំក្រដាស និងអក្សរ)
        let conf = {
            '50x30': { w: '50mm', h: '30mm', fh: '7.5px', fn: '11px', fp: '18px', fc: '7px', pad: '2mm', bw: '4px' },
            '40x30': { w: '40mm', h: '30mm', fh: '6px', fn: '9.5px', fp: '15px', fc: '6px', pad: '1.5mm', bw: '3px' },
            '30x20': { w: '30mm', h: '20mm', fh: '4.5px', fn: '7px', fp: '11px', fc: '4.5px', pad: '1mm', bw: '2px' },
            '25x15': { w: '25mm', h: '15mm', fh: '3.5px', fn: '5.5px', fp: '8.5px', fc: '3.5px', pad: '0.5mm', bw: '1.5px' }
        }[tagSize];

        let tagsHtml = '';
        printList.forEach(item => {
            for (let i = 0; i < item.qty; i++) {
                tagsHtml += `
                    <div class="tag-page">
                        <div class="tag-card">
                            <div style="font-size: ${conf.fh}; font-weight: 900; color: #d97706; letter-spacing: 0.5px; margin-bottom: 2px;">${header}</div>
                            <div style="font-size: ${conf.fn}; font-weight: 900; color: #1e293b; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
                            <div style="font-size: ${conf.fp}; font-weight: 900; color: #10b981; margin-bottom: 2px;">$${item.price}</div>
                            <div style="font-size: ${conf.fc}; font-family: monospace; color: #64748b; font-weight: bold;">SKU: ${item.code}</div>
                        </div>
                    </div>
                `;
            }
        });

        const printWin = window.open('', '_blank', 'width=400,height=400');
        printWin.document.write(`
            <html>
                <head>
                    <title>Print Price Tags (${tagSize})</title>
                    <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                    <style>
                        /* បង្ខំទំហំក្រដាសតាមការជ្រើសរើសរបស់ User */
                        @page { size: ${conf.w} ${conf.h}; margin: 0; }
                        body { font-family: 'Battambang', sans-serif; margin: 0; padding: 0; background: #fff; }
                        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                        
                        /* tag-page កំណត់ទំហំ Width/Height ពិតប្រាកដ និងចាក់គម្លាត (Padding) ចូលកណ្តាល */
                        .tag-page { 
                            width: ${conf.w}; height: ${conf.h}; 
                            padding: ${customMargin}mm; /* គម្លាតពីគែម (Margin Adjuster) */
                            display: flex; justify-content: center; align-items: center; 
                            page-break-after: always; box-sizing: border-box; overflow: hidden; 
                        }
                        
                        /* tag-card នឹងរួមតូចស្វ័យប្រវត្តិដោយរុញតាមទំហំ Padding ខាងលើ */
                        .tag-card { 
                            border: 1px solid #1e293b; padding: ${conf.pad}; border-radius: 4px; text-align: center; 
                            width: 100%; height: 100%; position: relative; overflow: hidden; box-sizing: border-box; 
                            display: flex; flex-direction: column; justify-content: center; 
                        }
                        .tag-card::before { content: ''; position: absolute; top: 0; left: 0; width: ${conf.bw}; height: 100%; background: #d97706; }
                    </style>
                </head>
                <body>
                    ${tagsHtml}
                </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); printWin.close(); }, 500);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🏷️', 'ព្រីនឡាប៊ែល (Multi-Size)', openPriceTagModal, "🏷️ បង្កើតស្លាកតម្លៃទំនិញ price_tag.js");
            clearInterval(initInt);
        }
    }, 300);
})();
});

;
// === [22/43] 💬 សាររំលឹកទារប្រាក់ (Debt Reminder & SMS).js ===
window.skmRegisterBundledPlugin('pos', "💬 សាររំលឹកទារប្រាក់ (Debt Reminder & SMS).js", function() {
/* STREAMING_CHUNK:Initializing Unpaid Invoices Reminder Plugin... */
(function() {
    console.log("💬 POS Unpaid Invoices Reminder & SMS Generator Plugin Initialized!");

    /* STREAMING_CHUNK:Building Refined Minimalist UI... */
    function openDebtReminderModal() {
        if(document.getElementById('skmDebtReminderModal')) {
            document.getElementById('skmDebtReminderModal').style.display = 'flex';
            loadUnpaidInvoices();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmDebtReminderModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        /* STREAMING_CHUNK:Injecting Clean CSS and Layout... */
        modal.innerHTML = `
            <style>
                .skm-debt-box { background: var(--bg-card, #ffffff); color: var(--text-main, #1e293b); padding: 25px; border-radius: 20px; width: 100%; max-width: 480px; height: 85vh; max-height: 600px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.2); border: 1px solid var(--border, #e2e8f0); display: flex; flex-direction: column; box-sizing: border-box; overflow: hidden; }
                .skm-debt-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border, #f1f5f9); padding-bottom: 12px; margin-bottom: 12px; flex-shrink: 0; }
                .skm-debt-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 4px; box-sizing: border-box; }
                .skm-debt-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; display: flex; justify-content: space-between; align-items: center; transition: 0.2s; box-sizing: border-box; }
                .skm-debt-card:hover { border-color: #f59e0b; background: #fffbeb; }
                .skm-btn-telegram { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; transition: 0.2s; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25); font-family: inherit; }
                .skm-btn-telegram:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35); }
                .skm-btn-close { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; width: 100%; transition: 0.2s; text-align: center; font-family: inherit; flex-shrink: 0; margin-top: 10px; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
            </style>
            
            <div class="skm-debt-box">
                <div class="skm-debt-header">
                    <h3 style="margin:0; font-size:16px; display: flex; align-items: center; gap: 8px; color: #f59e0b; font-weight: 800;">
                        <span>💬</span> សាររំលឹកវិក្កយបត្ររង់ចាំទូទាត់
                    </h3>
                    <button onclick="document.getElementById('skmDebtReminderModal').style.display='none'" style="background: #fef2f2; border: 1px solid #fca5a5; color: #ef4444; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">✕</button>
                </div>
                
                <div style="font-size: 12px; font-weight: 600; color: var(--text-muted, #64748b); margin-bottom: 8px; flex-shrink: 0;">
                    ជ្រើសរើសវិក្កយបត្រដើម្បីផ្ញើសាររំលឹកតាម Telegram៖
                </div>

                <div class="skm-debt-body" id="skmUnpaidInvoiceList">
                    <!-- Injected via JS -->
                </div>

                <button class="skm-btn-close" onclick="document.getElementById('skmDebtReminderModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        loadUnpaidInvoices();
    }

    /* STREAMING_CHUNK:Loading Unpaid Invoices from POS System... */
    function loadUnpaidInvoices() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices_pro`) || '[]');
        const container = document.getElementById('skmUnpaidInvoiceList');
        if(!container) return;

        // ត្រងយកតែវិក្កយបត្រណាដែលមានស្ថានភាព "រង់ចាំទូទាត់" (unpaid / pending)
        let unpaidInvoices = invoices.filter(inv => {
            let status = String(inv.status || '').toLowerCase();
            return status === 'unpaid' || status === 'pending' || status === 'រង់ចាំទូទាត់';
        });

        if (unpaidInvoices.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:40px 20px; color:var(--text-muted, #94a3b8); font-size:13px;">🎉 គ្មានវិក្កយបត្ររង់ចាំទូទាត់ទេ!</div>';
            return;
        }

        container.innerHTML = unpaidInvoices.map(inv => {
            let customerName = inv.customerName || inv.customer || 'អតិថិជនទូទៅ';
            let phone = inv.phone || inv.customerPhone || 'គ្មានលេខទូរស័ព្ទ';
            let amount = parseFloat(inv.totalAmount || inv.total || 0);
            let invNo = inv.id || inv.invoiceNo || 'វិក្កយបត្រ';
            let shopName = window.shopName || 'ហាងរបស់យើងខ្ញុំ';
            
            let smsText = `សួស្តីអតិថិជន ${customerName}, ពីហាង ${shopName}។ សូមរំលឹកការទូទាត់ប្រាក់សម្រាប់វិក្កយបត្រលេខ ${invNo} ចំនួន $${amount.toFixed(2)}។ សូមអរគុណ!`;
            let encodedSms = encodeURIComponent(smsText);

            return `
                <div class="skm-debt-card">
                    <div>
                        <div style="font-weight: 700; color: var(--text-main, #1e293b); font-size: 14px;">👤 ${customerName}</div>
                        <div style="font-size: 11px; color: var(--text-muted, #64748b); margin-top: 2px;">📄 លេខ: ${invNo} | 📞 ${phone}</div>
                    </div>
                    <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
                        <div style="font-size: 14px; font-weight: 800; color: #f59e0b;">$${amount.toFixed(2)}</div>
                        <a href="https://t.me/share/url?url=${encodedSms}" target="_blank" class="skm-btn-telegram">
                            <span>📤</span> ផ្ញើ Telegram
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('💬', 'សាររំលឹកវិក្កយបត្ររង់ចាំទូទាត់', openDebtReminderModal, "💬 សាររំលឹកទារប្រាក់ (Debt Reminder & SMS).js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [23/43] 💰 គណនាតម្លៃលក់ & ចំណេញ (Margin Calculator).js ===
window.skmRegisterBundledPlugin('pos', "💰 គណនាតម្លៃលក់ & ចំណេញ (Margin Calculator).js", function() {
/* STREAMING_CHUNK:Initializing Precise Dual-Currency Margin Calculator Plugin... */
(function() {
    console.log("💰 POS Precise Dual-Currency Margin Calculator Plugin Initialized!");

    let isSyncing = false;

    /* STREAMING_CHUNK:Building Refined Minimalist UI with Precise Inputs... */
    function openProfitModal() {
        if(document.getElementById('skmProfitModal')) {
            document.getElementById('skmProfitModal').style.display = 'flex';
            syncExchangeRate();
            window.calcProfitFromUsd();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmProfitModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        /* STREAMING_CHUNK:Injecting Clean CSS and Layout... */
        modal.innerHTML = `
            <style>
                .skm-prof-input::-webkit-inner-spin-button, 
                .skm-prof-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                .skm-prof-input { -moz-appearance: textfield; }

                .skm-prof-box { background: var(--bg-card, #ffffff); color: var(--text-main, #1e293b); padding: 25px; border-radius: 20px; width: 100%; max-width: 440px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.2); border: 1px solid var(--border, #e2e8f0); display: flex; flex-direction: column; gap: 12px; box-sizing: border-box; }
                .skm-prof-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border, #f1f5f9); padding-bottom: 12px; margin-bottom: 2px; }
                .skm-prof-input { font-size: 14px; padding: 10px 12px; border-radius: 10px; border: 1.5px solid #cbd5e1; width: 100%; transition: all 0.2s ease; background: var(--store-bg, #f8fafc); outline: none; color: var(--text-main, #1e293b); font-family: 'Nunito', 'Battambang', sans-serif; box-sizing: border-box; font-weight: bold; }
                .skm-prof-input:focus { border-color: #10b981; background: #ffffff; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }
                .skm-prof-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; text-align: center; }
                .skm-btn-close { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; width: 100%; transition: 0.2s; text-align: center; font-family: inherit; margin-top: 4px; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
            </style>
            
            <div class="skm-prof-box">
                <div class="skm-prof-header">
                    <h3 style="margin:0; font-size:16px; display: flex; align-items: center; gap: 8px; color: #10b981; font-weight: 800;">
                        <span>💰</span> គណនាតម្លៃលក់ & ចំណេញ
                    </h3>
                    <button onclick="document.getElementById('skmProfitModal').style.display='none'" style="background: #fef2f2; border: 1px solid #fca5a5; color: #ef4444; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">✕</button>
                </div>
                
                <!-- តម្លៃដើម USD និង KHR -->
                <div style="display: flex; gap: 10px;">
                    <div style="flex: 1;">
                        <label style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">តម្លៃដើម ($ USD) *</label>
                        <input type="number" id="skmProfCostUsd" class="skm-prof-input" placeholder="0.00" oninput="window.calcProfitFromUsd()" step="any">
                    </div>
                    <div style="flex: 1;">
                        <label style="font-size: 11px; font-weight: 700; color: #0284c7; display: block; margin-bottom: 4px;">តម្លៃដើម (៛ KHR) *</label>
                        <input type="number" id="skmProfCostRiel" class="skm-prof-input" placeholder="0" oninput="window.calcProfitFromRiel()" style="color: #0284c7;">
                    </div>
                </div>

                <div style="display: flex; gap: 10px;">
                    <div style="flex: 1;">
                        <label style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">ភាគរយចង់បាន (%) *</label>
                        <input type="number" id="skmProfMargin" class="skm-prof-input" value="30" oninput="window.calcProfitFromUsd()" step="any">
                    </div>
                    <div style="flex: 1;">
                        <label style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">អត្រាដូរប្រាក់ (Rate)</label>
                        <input type="number" id="skmProfRate" class="skm-prof-input" value="4000" oninput="window.calcProfitFromUsd()" style="color: #d97706; font-weight: bold;">
                    </div>
                </div>

                <div class="skm-prof-card">
                    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">តម្លៃលក់ណែនាំ (Suggested Price)</div>
                    <div id="skmProfSellPrice" style="font-size: 24px; font-weight: 900; color: #10b981; line-height: 1.2;">$0.00</div>
                    <div id="skmProfSellRiel" style="font-size: 13px; font-weight: 700; color: #059669; margin-top: 1px;">0 ៛</div>
                    
                    <div style="border-top: 1px dashed #cbd5e1; margin: 10px 0; padding-top: 8px;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; letter-spacing: 0.5px;">ប្រាក់ចំណេញសុទ្ធ (Net Profit)</div>
                        <div id="skmProfProfitAmt" style="font-size: 15px; font-weight: 800; color: #0284c7; margin-top: 1px;">$0.00</div>
                        <div id="skmProfProfitRiel" style="font-size: 11px; font-weight: 700; color: #0369a1;">0 ៛</div>
                    </div>
                </div>

                <button class="skm-btn-close" onclick="document.getElementById('skmProfitModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        syncExchangeRate();
        window.calcProfitFromUsd();
    }

    /* STREAMING_CHUNK:Syncing Global Rate... */
    function syncExchangeRate() {
        const rateInp = document.getElementById('skmProfRate');
        if(!rateInp) return;
        const globalRate = document.getElementById('globalExchangeRate');
        if(globalRate && globalRate.value) {
            rateInp.value = globalRate.value;
        }
    }

    /* STREAMING_CHUNK:Implementing Precise Two-Way Calculation... */
    window.calcProfitFromUsd = function() {
        if (isSyncing) return;
        isSyncing = true;

        const costUsd = parseFloat(document.getElementById('skmProfCostUsd').value) || 0;
        const rate = parseFloat(document.getElementById('skmProfRate').value) || 4000;
        
        // គណនារៀលដោយរក្សាភាពជាក់លាក់ (មិនកាត់ទសភាគមុនពេលគណនា)
        let costRiel = Math.round(costUsd * rate);
        document.getElementById('skmProfCostRiel').value = costUsd > 0 ? costRiel : '';

        executeCalculation(costUsd, rate);
        isSyncing = false;
    };

    window.calcProfitFromRiel = function() {
        if (isSyncing) return;
        isSyncing = true;

        const costRiel = parseFloat(document.getElementById('skmProfCostRiel').value) || 0;
        const rate = parseFloat(document.getElementById('skmProfRate').value) || 4000;
        
        // គណនាដុល្លារដោយរក្សាទសភាគខ្ពស់ (High Precision)
        let costUsd = rate > 0 ? costRiel / rate : 0;
        document.getElementById('skmProfCostUsd').value = costRiel > 0 ? costUsd : '';

        executeCalculation(costUsd, rate);
        isSyncing = false;
    };

    function executeCalculation(costUsd, rate) {
        const margin = parseFloat(document.getElementById('skmProfMargin').value) || 0;
        
        const sellDisp = document.getElementById('skmProfSellPrice');
        const sellRielDisp = document.getElementById('skmProfSellRiel');
        const profDisp = document.getElementById('skmProfProfitAmt');
        const profRielDisp = document.getElementById('skmProfProfitRiel');

        if(costUsd <= 0) {
            sellDisp.innerText = '$0.00';
            sellRielDisp.innerText = '0 ៛';
            profDisp.innerText = '$0.00';
            profRielDisp.innerText = '0 ៛';
            return;
        }

        // គណនាប្រាក់ចំណេញ និងតម្លៃលក់
        let profitUsd = costUsd * (margin / 100);
        let sellUsd = costUsd + profitUsd;

        let sellRielVal = Math.round(sellUsd * rate);
        let profitRielVal = Math.round(profitUsd * rate);

        sellDisp.innerText = `$${sellUsd.toFixed(2)}`;
        sellRielDisp.innerText = `${sellRielVal.toLocaleString('en-US')} ៛`;

        profDisp.innerText = `$${profitUsd.toFixed(2)} (${margin}%)`;
        profRielDisp.innerText = `${profitRielVal.toLocaleString('en-US')} ៛`;
    }

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('💰', 'គណនាតម្លៃលក់ & ចំណេញ (Margin)', openProfitModal, "💰 គណនាតម្លៃលក់ & ចំណេញ (Margin Calculator).js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [24/43] 💳 សង្ខេបចំណូលតាមប្រភេទបង់ប្រាក់ payment_breakdown.js ===
window.skmRegisterBundledPlugin('pos', "💳 សង្ខេបចំណូលតាមប្រភេទបង់ប្រាក់ payment_breakdown.js", function() {
/* STREAMING_CHUNK:Initializing Fixed Payment Breakdown Plugin... */
(function() {
    console.log("💳 Fixed POS Payment Breakdown Plugin Initialized!");

    function getCurrentBranchId() {
        return window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    }

    // មុខងារគណនា និងបង្ហាញទិន្នន័យ
    window.calcBreakdownDataStandard = function() {
        const branchId = getCurrentBranchId();
        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices_pro`) || '[]');
        let today = new Date().toLocaleDateString();

        let cashTotal = 0, qrTotal = 0, unpaidTotal = 0, totalCount = 0;

        invoices.forEach(inv => {
            let invDate = inv.date ? inv.date.split(' ')[0] : '';
            if (invDate === today) {
                totalCount++;
                let amount = parseFloat(inv.totalAmount || 0);
                if (inv.status === 'paid') {
                    if (inv.note && (inv.note.includes('QR') || inv.note.includes('ABA') || inv.note.includes('វីង') || inv.note.includes('ACLEDA'))) {
                        qrTotal += amount;
                    } else {
                        cashTotal += amount;
                    }
                } else {
                    unpaidTotal += amount;
                }
            }
        });

        const container = document.getElementById('skmPayBreakdownContent');
        if(!container) return;

        container.innerHTML = `
            <div style="background:var(--store-bg, #f8fafc); padding:15px; border-radius:14px; display:flex; justify-content:space-between; align-items:center; border: 1px solid var(--border-color, #e5e7eb); margin-bottom:10px;">
                <div>
                    <div style="font-weight:900; color:var(--text-dark, #1e293b); font-size:14px; margin-bottom:4px;">💵 ប្រាក់សុទ្ធ (Cash)</div>
                    <div style="font-size:12px; color:var(--text-muted, #64748b);">លុយចូលទូរគិតប្រាក់ផ្ទាល់</div>
                </div>
                <div style="font-size:18px; font-weight:900; color:#10b981;">$${cashTotal.toFixed(2)}</div>
            </div>

            <div style="background:var(--store-bg, #f8fafc); padding:15px; border-radius:14px; display:flex; justify-content:space-between; align-items:center; border: 1px solid var(--border-color, #e5e7eb); margin-bottom:10px;">
                <div>
                    <div style="font-weight:900; color:var(--text-dark, #1e293b); font-size:14px; margin-bottom:4px;">📱 ស្កេន QR / ធនាគារ</div>
                    <div style="font-size:12px; color:var(--text-muted, #64748b);">លុយចូលកុងធនាគារ</div>
                </div>
                <div style="font-size:18px; font-weight:900; color:#06b6d4;">$${qrTotal.toFixed(2)}</div>
            </div>

            <div style="background:rgba(239, 68, 68, 0.05); padding:15px; border-radius:14px; display:flex; justify-content:space-between; align-items:center; border: 1px dashed #ef4444; margin-bottom:10px;">
                <div>
                    <div style="font-weight:900; color:#ef4444; font-size:14px; margin-bottom:4px;">📝 ជំពាក់ (Unpaid)</div>
                    <div style="font-size:12px; color:#ef4444; opacity:0.8;">មិនទាន់បានបង់ប្រាក់នៅឡើយ</div>
                </div>
                <div style="font-size:18px; font-weight:900; color:#ef4444;">$${unpaidTotal.toFixed(2)}</div>
            </div>

            <div style="text-align:center; margin-top:15px; font-size:13px; color:var(--text-muted, #64748b); font-weight:800; padding:10px; background:var(--store-bg, #f8fafc); border-radius:10px;">
                ចំនួនវិក្កយបត្រសរុបថ្ងៃនេះ: <span style="color:var(--text-dark, #1e293b); font-weight:900; font-size:15px;">${totalCount} ប័ណ្ណ</span>
            </div>
        `;
    };

    // មុខងារបើក Modal សង្ខេបចំណូល (ច្បាស់លាស់ ១០០%)
    window.openPaymentBreakdownModalStandard = function() {
        let modalBg = document.getElementById('skmPayBreakdownModal');
        if(modalBg) {
            modalBg.style.display = 'flex';
            setTimeout(() => modalBg.classList.add('show'), 10);
            window.calcBreakdownDataStandard();
            return;
        }

        modalBg = document.createElement('div');
        modalBg.className = 'modal-bg';
        modalBg.id = 'skmPayBreakdownModal';
        modalBg.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 999999; display: flex; justify-content: center; align-items: center; font-family: 'Battambang', sans-serif;`;
        
        // ចុចក្រៅប្រអប់ដើម្បីបិទ
        modalBg.onclick = function(e) {
            if (e.target === modalBg) {
                modalBg.classList.remove('show');
                setTimeout(() => modalBg.style.display = 'none', 300);
            }
        };

        modalBg.innerHTML = `
            <div class="modal-content" style="background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b); max-width: 420px; width: 90%; padding: 25px; border-radius: 24px; max-height: 85vh; display:flex; flex-direction:column; box-shadow: 0 20px 50px rgba(0,0,0,0.25);" onclick="event.stopPropagation()">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border-color, #e5e7eb); padding-bottom:12px;">
                    <h3 style="color: #06b6d4; margin:0; font-size:18px; font-weight:900;"><i class="fa-solid fa-wallet"></i> សង្ខេបចំណូលប្រចាំថ្ងៃ</h3>
                    <i class="fa-solid fa-xmark modal-close" onclick="document.getElementById('skmPayBreakdownModal').classList.remove('show'); setTimeout(() => document.getElementById('skmPayBreakdownModal').style.display='none', 300);" style="color: #9ca3af; font-size: 22px; cursor: pointer; padding: 5px;"></i>
                </div>
                
                <div id="skmPayBreakdownContent" style="flex:1; overflow-y:auto; padding-right:5px; margin-bottom:20px; display:flex; flex-direction:column; gap:5px;">
                    <!-- ទិន្នន័យ -->
                </div>

                <div style="display:flex; gap:10px;">
                    <button class="btn-act btn-outline" style="flex:1; border:1px solid var(--border-color, #e5e7eb); color:var(--text-dark, #1e293b); border-radius:14px; padding:12px; font-weight:bold; cursor:pointer; background:transparent;" onclick="document.getElementById('skmPayBreakdownModal').classList.remove('show'); setTimeout(() => document.getElementById('skmPayBreakdownModal').style.display='none', 300);">បិទ</button>
                    <button class="btn-act" style="flex:1; background:#06b6d4; color:white; border:none; border-radius:14px; padding:12px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);" onclick="window.printPayBreakdownStandard()">🖨️ បោះពុម្ព</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalBg);
        
        modalBg.style.display = 'flex';
        setTimeout(() => modalBg.classList.add('show'), 10);
        window.calcBreakdownDataStandard();
    };

    // មុខងារ Print ស្តង់ដារ
    window.printPayBreakdownStandard = function() {
        const printContent = document.getElementById('skmPayBreakdownContent').innerHTML;
        const branchName = getCurrentBranchId();
        
        const printWin = window.open('', '_blank', 'width=450,height=650');
        printWin.document.write(`
            <html>
            <head>
                <title>Payment Breakdown - ${branchName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Battambang', sans-serif; padding: 25px; color: #1e293b; background: #ffffff; margin: 0; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    h2 { text-align: center; color: #06b6d4; font-size: 20px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px solid #06b6d4; padding-bottom: 10px;}
                    p.subtitle { text-align: center; font-size: 12px; color: #64748b; margin-top: 0; margin-bottom: 25px;}
                </style>
            </head>
            <body>
                <h2>របាយការណ៍សង្ខេបចំណូល</h2>
                <p class="subtitle">ថ្ងៃទី៖ ${new Date().toLocaleDateString('km-KH')} | សាខា៖ ${branchName}</p>
                <div>${printContent}</div>
                <div style="text-align:center; font-size:11px; color:#94a3b8; margin-top:40px;">បោះពុម្ពចេញពីប្រព័ន្ធនៅម៉ោង៖ ${new Date().toLocaleTimeString('km-KH')}</div>
            </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); printWin.close(); }, 600);
    };

    // ចុះឈ្មោះចូលក្នុង Toolbox ទាំង POS និង Menu Hub
    const registerToolInterval = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💳', 'សង្ខេបចំណូលប្រចាំថ្ងៃ', window.openPaymentBreakdownModalStandard);
            clearInterval(registerToolInterval);
        } else if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('💳', 'សង្ខេបចំណូលប្រចាំថ្ងៃ', window.openPaymentBreakdownModalStandard, "💳 សង្ខេបចំណូលតាមប្រភេទបង់ប្រាក់ payment_breakdown.js");
            clearInterval(registerToolInterval);
        }
    }, 200);
})();
});

;
// === [25/43] 💵 ប្រអប់រាប់សាច់ប្រាក់បិទវេន (Cash Count).js ===
window.skmRegisterBundledPlugin('pos', "💵 ប្រអប់រាប់សាច់ប្រាក់បិទវេន (Cash Count).js", function() {
(function() {
    console.log("💵 POS Ultra-Compact Cash Drawer Counter (Performance & Touch Ready)!");

    // មុខងារបិទផ្ទាំងចាស់ៗទាំងអស់ស្វ័យប្រវត្តិ (ការពារបញ្ហាជាន់ Z-Index)
    window.skmCloseAllModals = function() {
        const modals = ['skm-cash-inout-modal', 'skm-quick-exp-modal', 'skmDrawerCashModal', 'skmDailyModal', 'skmLastSalesModal'];
        modals.forEach(id => {
            let m = document.getElementById(id);
            if(m && m.style.display !== 'none') {
                m.style.opacity = '0';
                setTimeout(() => { m.style.display = 'none'; }, 200);
            }
        });
    };

    // មុខងាររាប់លេខមានចលនា គាំទ្រ USD និង KHR
    function animateValue(obj, start, end, duration, currency = 'USD') {
        let startTimestamp = null;
        const formatMoney = (val, cur) => {
            if (cur === 'USD') return '$' + val.toFixed(2);
            return Math.floor(val).toLocaleString('en-US') + ' ៛';
        };

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = (progress * (end - start) + start);
            obj.innerHTML = formatMoney(currentVal, currency);
            if (progress < 1) window.requestAnimationFrame(step);
            else obj.innerHTML = formatMoney(end, currency);
        };
        window.requestAnimationFrame(step);
    }

    // ១. បញ្ចូលប៊ូតុងទៅក្នុងកន្ត្រក (Cart Summary) ជាមួយ Premium Style
    function injectCounterBtn() {
        const cartSummary = document.getElementById('cartSummaryBody');
        if (!cartSummary || document.getElementById('skmCashCountBtn')) return;
        
        const btn = document.createElement('button');
        btn.id = 'skmCashCountBtn';
        btn.innerHTML = '💵 រាប់សាច់ប្រាក់បិទវេន (Cash Count)';
        btn.style.cssText = `
            background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981;
            font-weight: 700; font-size: 14px; padding: 12px; border-radius: 12px; cursor: pointer;
            transition: all 0.2s; width: 100%; margin-top: 10px; font-family: 'Battambang', sans-serif;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: flex; justify-content: center; align-items: center; height: 44px;
        `;
        
        btn.onmouseover = () => { 
            btn.style.background = '#10b981'; btn.style.color = 'white'; 
            btn.style.boxShadow = '0 5px 15px rgba(16, 185, 129, 0.3)';
        };
        btn.onmouseout = () => { 
            btn.style.background = 'rgba(16, 185, 129, 0.1)'; btn.style.color = '#10b981'; 
            btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
        };
        
        btn.onclick = openCashCounterModal;
        
        const targetDiv = cartSummary.querySelector('div[style*="display: flex; gap: 10px;"]');
        if (targetDiv) cartSummary.insertBefore(btn, targetDiv);
        else cartSummary.appendChild(btn);
    }

    window.skmCloseDrawerCounter = function() {
        const modal = document.getElementById('skmDrawerCashModal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-draw-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 250);
        }
    };

    // ២. បង្កើតផ្ទាំង Modal រាប់លុយបែប Ultra-Compact
    function openCashCounterModal() {
        // បិទផ្ទាំងផ្សេងៗសិន
        window.skmCloseAllModals();

        let modal = document.getElementById('skmDrawerCashModal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-draw-glass, .skm-draw-glass * { box-sizing: border-box; }
                
                /* Performance Mode: Blur 8px ជួយម៉ាស៊ីនឱ្យដើររលូន */
                .skm-draw-glass {
                    background: var(--bg-card, rgba(255, 255, 255, 0.98)); color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 480px;
                    max-height: 95vh; display: flex; flex-direction: column;
                    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-draw-glass {
                        background: var(--bg-card, rgba(15, 23, 42, 0.98)); color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-draw-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
                
                .skm-draw-item {
                    display: flex; align-items: center; justify-content: space-between;
                    background: var(--bg-input, #f8fafc);
                    padding: 8px 12px; border-radius: 12px;
                    border: 1px solid var(--border, rgba(128,128,128,0.15));
                    transition: 0.2s;
                }
                @media (prefers-color-scheme: dark) { .skm-draw-item { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                
                .skm-draw-item.usd:focus-within { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
                .skm-draw-item.khr:focus-within { border-color: #0ea5e9; background: rgba(14, 165, 233, 0.05); }
                
                .skm-draw-label { font-size: 14px; font-weight: 600; font-family: 'Arial'; display: flex; align-items: center; gap: 8px; }
                
                /* Touch Friendly Input: ធំល្មមម្រាមដៃចុច 38px */
                .skm-draw-input {
                    width: 75px; height: 38px; text-align: center; font-size: 15px; font-weight: bold;
                    border-radius: 8px; border: 1px solid var(--border, rgba(128,128,128,0.2));
                    background: var(--bg-card, #ffffff); color: var(--text-main, inherit);
                    outline: none; transition: 0.2s; font-family: 'Arial';
                }
                @media (prefers-color-scheme: dark) { .skm-draw-input { background: rgba(255,255,255,0.05); border-color: transparent; } }
                .skm-draw-item.usd .skm-draw-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); }
                .skm-draw-item.khr .skm-draw-input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2); }
                
                .skm-draw-list { overflow-y: auto; flex: 1; padding-right: 5px; min-height: 200px; max-height: 50vh;}
                .skm-draw-list::-webkit-scrollbar { width: 4px; }
                .skm-draw-list::-webkit-scrollbar-track { background: transparent; }
                .skm-draw-list::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
                
                input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skmDrawerCashModal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                opacity: 0; transition: opacity 0.2s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-draw-glass">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h3 style="margin:0; font-size:16px; font-weight:600; display:flex; align-items:center; gap:8px;">
                            <span style="color:#10b981; font-size: 18px;">💵</span> រាប់ប្រាក់ក្នុងទូរ (Cash Count)
                        </h3>
                        <div style="display:flex; gap:10px;">
                            <button id="skm-btn-reset-drawer" style="background:rgba(239, 68, 68, 0.1); border:none; color:#ef4444; padding:6px 12px; border-radius:8px; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s; font-family:'Battambang';">សម្អាត</button>
                            <div onclick="window.skmCloseDrawerCounter()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 14px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                        </div>
                    </div>

                    <div style="background: var(--bg-alt, #f8fafc); border-radius: 12px; padding: 15px; margin-bottom: 15px; border: 1px solid var(--border, rgba(128,128,128,0.15)); display: flex; justify-content: space-around; align-items: center;">
                        <div style="text-align: center; flex:1;">
                            <div style="font-size: 12px; color: #10b981; font-weight: bold; margin-bottom: 6px;">សរុបដុល្លារ (USD)</div>
                            <div id="skm-drawer-total-usd" style="font-size: 24px; font-weight: bold; color: var(--text-main); font-family: 'Arial';">$0.00</div>
                        </div>
                        <div style="width: 1px; height: 40px; background: rgba(128,128,128,0.2);"></div>
                        <div style="text-align: center; flex:1;">
                            <div style="font-size: 12px; color: #0ea5e9; font-weight: bold; margin-bottom: 6px;">សរុបរៀល (KHR)</div>
                            <div id="skm-drawer-total-khr" style="font-size: 20px; font-weight: bold; color: #0ea5e9; font-family: 'Arial';">0 ៛</div>
                        </div>
                    </div>
                    
                    <div class="skm-draw-list">
                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 10px; color: #10b981; font-family:'Battambang';">🇺🇸 ប្រាក់ដុល្លារ (USD)</div>
                        <div class="skm-draw-grid">
                            <div class="skm-draw-item usd"><span class="skm-draw-label"><span style="color:#10b981;">$</span>100</span><input type="number" min="0" value="0" class="skm-draw-input usd-input" data-val="100"></div>
                            <div class="skm-draw-item usd"><span class="skm-draw-label"><span style="color:#10b981;">$</span>50</span><input type="number" min="0" value="0" class="skm-draw-input usd-input" data-val="50"></div>
                            <div class="skm-draw-item usd"><span class="skm-draw-label"><span style="color:#10b981;">$</span>20</span><input type="number" min="0" value="0" class="skm-draw-input usd-input" data-val="20"></div>
                            <div class="skm-draw-item usd"><span class="skm-draw-label"><span style="color:#10b981;">$</span>10</span><input type="number" min="0" value="0" class="skm-draw-input usd-input" data-val="10"></div>
                            <div class="skm-draw-item usd"><span class="skm-draw-label"><span style="color:#10b981;">$</span>5</span><input type="number" min="0" value="0" class="skm-draw-input usd-input" data-val="5"></div>
                            <div class="skm-draw-item usd"><span class="skm-draw-label"><span style="color:#10b981;">$</span>1</span><input type="number" min="0" value="0" class="skm-draw-input usd-input" data-val="1"></div>
                        </div>

                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 10px; margin-top: 15px; color: #0ea5e9; font-family:'Battambang';">🇰🇭 ប្រាក់រៀល (KHR)</div>
                        <div class="skm-draw-grid">
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>100,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="100000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>50,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="50000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>20,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="20000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>10,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="10000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>5,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="5000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>2,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="2000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>1,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="1000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>500</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="500"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>100</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="100"></div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseDrawerCounter(); });
            document.addEventListener('keydown', function(e) { if(e.key === 'Escape' && modal.style.display !== 'none') window.skmCloseDrawerCounter(); });

            let curUsd = 0, curKhr = 0;
            const usdInputs = modal.querySelectorAll('.usd-input');
            const khrInputs = modal.querySelectorAll('.khr-input');
            
            const calculateSum = () => {
                let newUsd = 0, newKhr = 0;
                usdInputs.forEach(i => newUsd += (parseInt(i.value) || 0) * parseFloat(i.getAttribute('data-val')));
                khrInputs.forEach(i => newKhr += (parseInt(i.value) || 0) * parseFloat(i.getAttribute('data-val')));
                
                if(newUsd !== curUsd) { animateValue(document.getElementById('skm-drawer-total-usd'), curUsd, newUsd, 300, 'USD'); curUsd = newUsd; }
                if(newKhr !== curKhr) { animateValue(document.getElementById('skm-drawer-total-khr'), curKhr, newKhr, 300, 'KHR'); curKhr = newKhr; }
            };

            const allInputs = modal.querySelectorAll('.skm-draw-input');
            allInputs.forEach(input => {
                input.addEventListener('input', calculateSum);
                input.addEventListener('focus', function() { if(this.value === '0') this.select(); }); // Select 0 ឱ្យស្រេច
            });

            document.getElementById('skm-btn-reset-drawer').addEventListener('click', () => {
                allInputs.forEach(i => i.value = '0');
                calculateSum();
            });

        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-draw-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        setTimeout(() => { modal.style.opacity = '1'; }, 50);
    }

    const initInt = setInterval(() => {
        if (document.getElementById('cartSummaryBody')) {
            injectCounterBtn();
            clearInterval(initInt);
            console.log("✅ Ultra-Compact Cash Drawer Counter (Cart Button) successfully injected!");
        }
    }, 1000);
})();
});

;
// === [26/43] 💼 ចរន្តសាច់ប្រាក់ (Cash InOut).js ===
window.skmRegisterBundledPlugin('pos', "💼 ចរន្តសាច់ប្រាក់ (Cash InOut).js", function() {
(function() {
    console.log("💼 POS Ultra-Compact Cash In/Out Initialized!");

    function animateValue(obj, start, end, duration, currency = 'USD') {
        let startTimestamp = null;
        const formatMoney = (val, cur) => {
            let sign = val < 0 ? '-' : '';
            let absVal = Math.abs(val);
            if (cur === 'USD') return sign + '$' + absVal.toFixed(2);
            return sign + Math.floor(absVal).toLocaleString('en-US') + ' ៛';
        };

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = (progress * (end - start) + start);
            
            obj.innerHTML = formatMoney(currentVal, currency);
            
            if (progress < 1) window.requestAnimationFrame(step);
            else obj.innerHTML = formatMoney(end, currency);
        };
        window.requestAnimationFrame(step);
    }

    window.skmCloseCashInOut = function() {
        const modal = document.getElementById('skm-cash-inout-modal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-io-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    };

    function openCashInOutModal() {
        let modal = document.getElementById('skm-cash-inout-modal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-io-glass, .skm-io-glass * { box-sizing: border-box; }
                
                .skm-io-glass {
                    background: var(--bg-card, #ffffff);
                    color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 400px;
                    max-height: 95vh; display: flex; flex-direction: column;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-io-glass {
                        background: var(--bg-card, #1e293b);
                        color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-io-input, .skm-io-select {
                    height: 36px; font-size: 13px; font-weight: 500;
                    border-radius: 8px; border: 1px solid var(--border, rgba(128,128,128,0.25));
                    background: var(--bg-input, #ffffff);
                    color: var(--text-main, inherit); padding: 0 8px;
                    outline: none; transition: 0.2s; font-family: 'Battambang', 'Arial', sans-serif;
                }
                @media (prefers-color-scheme: dark) { .skm-io-input, .skm-io-select { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                .skm-io-input:focus, .skm-io-select:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15); }
                
                .skm-io-btn {
                    height: 36px; border-radius: 8px; border: none;
                    background: #0ea5e9; color: white; padding: 0 10px;
                    font-size: 13px; font-weight: bold; cursor: pointer; transition: 0.2s;
                    font-family: 'Battambang'; white-space: nowrap;
                }
                .skm-io-btn:hover { background: #0284c7; }
                .skm-io-btn:active { transform: scale(0.95); }
                
                .skm-log-item {
                    background: var(--bg-input, #f8fafc);
                    padding: 8px 12px; border-radius: 10px; margin-bottom: 6px;
                    border: 1px solid var(--border, rgba(128,128,128,0.15));
                    display: flex; justify-content: space-between; align-items: center;
                }
                @media (prefers-color-scheme: dark) { .skm-log-item { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                
                .skm-btn-del {
                    background: rgba(239,68,68,0.1); color: #ef4444; border: none;
                    padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;
                    font-family: 'Battambang'; font-weight: bold; transition: 0.2s;
                }
                .skm-btn-del:hover { background: #ef4444; color: white; }
                
                .skm-io-list { overflow-y: auto; flex: 1; padding-right: 4px; min-height: 150px; }
                .skm-io-list::-webkit-scrollbar { width: 4px; }
                .skm-io-list::-webkit-scrollbar-track { background: transparent; }
                .skm-io-list::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skm-cash-inout-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                backdrop-filter: blur(3px); opacity: 0; transition: opacity 0.3s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-io-glass">
                    <!-- ក្បាល (Header) ប្តូរឈ្មោះ -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                        <h3 style="margin:0; font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px;">
                            <span style="color:#0ea5e9; font-size: 18px;">💼</span> ចរន្តសាច់ប្រាក់ (In/Out)
                        </h3>
                        <div onclick="window.skmCloseCashInOut()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:26px; height:26px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                    </div>

                    <div style="background: var(--bg-alt, #f8fafc); border-radius: 12px; padding: 12px; margin-bottom: 12px; border: 1px solid var(--border, rgba(128,128,128,0.15));">
                        <div style="text-align: center; margin-bottom: 10px;">
                            <div style="font-size: 11px; color: #0ea5e9; font-weight: bold; margin-bottom: 4px;">💰 ប្រាក់នៅសល់ក្នុងទូរ (Net Balance)</div>
                            <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
                                <span id="skm-net-usd" style="font-size: 18px; font-weight: bold; color: var(--text-main); font-family: 'Arial';">$0.00</span>
                                <span style="color: var(--border, rgba(128,128,128,0.3)); font-size: 14px;">|</span>
                                <span id="skm-net-khr" style="font-size: 14px; font-weight: bold; color: #0ea5e9; font-family: 'Arial';">0 ៛</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; border-top: 1px dashed var(--border, rgba(128,128,128,0.2)); padding-top: 10px;">
                            <div style="flex: 1; text-align: center; border-right: 1px dashed var(--border, rgba(128,128,128,0.2));">
                                <div style="font-size: 10px; color: #10b981; font-weight: bold;">📥 ចូលសរុប</div>
                                <div id="skm-in-usd" style="font-size: 13px; font-weight: bold; color: var(--text-main); font-family: 'Arial'; margin-top: 2px;">$0.00</div>
                                <div id="skm-in-khr" style="font-size: 11px; color: #10b981; font-family: 'Arial';">0 ៛</div>
                            </div>
                            <div style="flex: 1; text-align: center;">
                                <div style="font-size: 10px; color: #ef4444; font-weight: bold;">📤 ចេញសរុប</div>
                                <div id="skm-out-usd" style="font-size: 13px; font-weight: bold; color: var(--text-main); font-family: 'Arial'; margin-top: 2px;">$0.00</div>
                                <div id="skm-out-khr" style="font-size: 11px; color: #ef4444; font-family: 'Arial';">0 ៛</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: var(--bg-alt, #f1f5f9); padding: 10px; border-radius: 12px; border: 1px solid var(--border, rgba(128,128,128,0.1)); margin-bottom: 12px;">
                        <div style="display: flex; gap: 6px; margin-bottom: 6px; width: 100%;">
                            <select id="skmIOType" class="skm-io-select" style="flex: 0 0 95px;">
                                <option value="in">📥 ដាក់ចូល</option>
                                <option value="out">📤 ដកចេញ</option>
                            </select>
                            <input type="number" id="skmIOAmount" class="skm-io-input" placeholder="ទឹកប្រាក់" style="flex: 1; min-width: 0;">
                            <select id="skmIOCurrency" class="skm-io-select" style="flex: 0 0 65px; font-family: 'Arial'; font-weight: bold; padding: 0 5px;">
                                <option value="USD">USD</option>
                                <option value="KHR">KHR</option>
                            </select>
                        </div>
                        
                        <div style="display: flex; gap: 6px; width: 100%;">
                            <input type="text" id="skmIONote" class="skm-io-input" placeholder="មូលហេតុ (ឧ. អាប់...)" style="flex: 1; min-width: 0;">
                            <button class="skm-io-btn" onclick="window.saveCashInOut()" style="flex: 0 0 85px;">កត់ត្រា</button>
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; flex: 1; overflow: hidden;">
                        <div style="font-size:11px; font-weight:600; color:var(--text-muted); margin-bottom:6px;">ប្រវត្តិថ្ងៃនេះ (Today's Logs)</div>
                        <div id="skmCashInOutList" class="skm-io-list"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseCashInOut(); });
            document.addEventListener('keydown', function(e) { if(e.key === 'Escape' && modal.style.display !== 'none') window.skmCloseCashInOut(); });
            
        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-io-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            
            document.getElementById('skmIOAmount').value = '';
            document.getElementById('skmIONote').value = '';
        }

        setTimeout(() => { 
            modal.style.opacity = '1'; 
            document.getElementById('skmIOAmount').focus(); 
        }, 50);

        window.loadCashInOutList();
    }

    window.saveCashInOut = function() {
        const type = document.getElementById('skmIOType').value;
        const currency = document.getElementById('skmIOCurrency').value;
        const amtInput = document.getElementById('skmIOAmount');
        const amt = parseFloat(amtInput.value);
        const note = document.getElementById('skmIONote').value.trim();
        
        if(isNaN(amt) || amt <= 0) { 
            amtInput.style.borderColor = '#ef4444';
            setTimeout(() => amtInput.style.borderColor = '', 1000);
            return; 
        }
        
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let logs = JSON.parse(localStorage.getItem(`ks2_${branchId}_cash_inout`) || '[]');
        
        logs.unshift({
            id: 'IO-' + Date.now(),
            type: type,
            amount: amt,
            currency: currency,
            note: note || (type === 'in' ? 'ដាក់ប្រាក់បន្ថែម' : 'ដកប្រាក់ចេញ'),
            date: new Date().toLocaleString('km-KH'),
            dateIso: new Date().toLocaleDateString()
        });
        
        localStorage.setItem(`ks2_${branchId}_cash_inout`, JSON.stringify(logs));
        
        document.getElementById('skmIOAmount').value = '';
        document.getElementById('skmIONote').value = '';
        document.getElementById('skmIOAmount').focus();
        
        window.loadCashInOutList();
        
        const btn = document.querySelector('.skm-io-btn');
        const oldText = btn.innerText;
        btn.innerText = 'ជោគជ័យ!';
        btn.style.background = '#10b981';
        setTimeout(() => { btn.innerText = oldText; btn.style.background = ''; }, 1000);
    };

    window.deleteCashLog = function(id) {
        if(confirm('តើអ្នកពិតជាចង់លុបប្រតិបត្តិការនេះមែនទេ?')) {
            const branchId = window.SHOP_BRANCH_ID || 'branch_1';
            let logs = JSON.parse(localStorage.getItem(`ks2_${branchId}_cash_inout`) || '[]');
            logs = logs.filter(l => l.id !== id);
            localStorage.setItem(`ks2_${branchId}_cash_inout`, JSON.stringify(logs));
            window.loadCashInOutList();
        }
    };

    let cInUsd = 0, cInKhr = 0, cOutUsd = 0, cOutKhr = 0, cNetUsd = 0, cNetKhr = 0;
    
    window.loadCashInOutList = function() {
        const list = document.getElementById('skmCashInOutList');
        if(!list) return;
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let logs = JSON.parse(localStorage.getItem(`ks2_${branchId}_cash_inout`) || '[]');
        
        const todayStr = new Date().toLocaleDateString();
        const todayLogs = logs.filter(l => {
            if(l.dateIso) return l.dateIso === todayStr;
            if(l.date) return l.date.includes(todayStr);
            return false;
        });

        let tInUsd = 0, tInKhr = 0, tOutUsd = 0, tOutKhr = 0;
        
        if(todayLogs.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:15px; color:var(--text-muted); font-size:11px;">គ្មានប្រតិបត្តិការថ្ងៃនេះទេ!</div>';
        } else {
            list.innerHTML = todayLogs.map(l => {
                const curr = l.currency || 'USD'; 
                const amt = parseFloat(l.amount);
                
                if(l.type === 'in') {
                    if(curr === 'USD') tInUsd += amt; else tInKhr += amt;
                } else {
                    if(curr === 'USD') tOutUsd += amt; else tOutKhr += amt;
                }
                
                const amtDisplay = curr === 'USD' ? `$${amt.toFixed(2)}` : `${Math.floor(amt).toLocaleString('en-US')} ៛`;
                
                return `
                <div class="skm-log-item">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                            <span style="font-size:13px; font-weight:bold; color:${l.type==='in'?'#10b981':'#ef4444'}; font-family:'Arial';">
                                ${l.type==='in'?'+':'-'} ${amtDisplay}
                            </span>
                            <span style="font-size:12px; color:var(--text-main); font-weight:500;">(${l.note})</span>
                        </div>
                        <div style="font-size:10px; color:var(--text-muted);">${l.date}</div>
                    </div>
                    <button class="skm-btn-del" onclick="window.deleteCashLog('${l.id}')">លុប</button>
                </div>
                `;
            }).join('');
        }

        let tNetUsd = tInUsd - tOutUsd;
        let tNetKhr = tInKhr - tOutKhr;

        if(tNetUsd !== cNetUsd) { animateValue(document.getElementById('skm-net-usd'), cNetUsd, tNetUsd, 400, 'USD'); cNetUsd = tNetUsd; }
        if(tNetKhr !== cNetKhr) { animateValue(document.getElementById('skm-net-khr'), cNetKhr, tNetKhr, 400, 'KHR'); cNetKhr = tNetKhr; }
        
        if(tInUsd !== cInUsd) { animateValue(document.getElementById('skm-in-usd'), cInUsd, tInUsd, 300, 'USD'); cInUsd = tInUsd; }
        if(tInKhr !== cInKhr) { animateValue(document.getElementById('skm-in-khr'), cInKhr, tInKhr, 300, 'KHR'); cInKhr = tInKhr; }
        
        if(tOutUsd !== cOutUsd) { animateValue(document.getElementById('skm-out-usd'), cOutUsd, tOutUsd, 300, 'USD'); cOutUsd = tOutUsd; }
        if(tOutKhr !== cOutKhr) { animateValue(document.getElementById('skm-out-khr'), cOutKhr, tOutKhr, 300, 'KHR'); cOutKhr = tOutKhr; }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('💼', 'ចរន្តសាច់ប្រាក់ (In/Out)', openCashInOutModal, "💼 ចរន្តសាច់ប្រាក់ (Cash InOut).js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [27/43] 📈 សង្ខេបការចំណាយតាមប្រភេទ expense_summary.js ===
window.skmRegisterBundledPlugin('pos', "📈 សង្ខេបការចំណាយតាមប្រភេទ expense_summary.js", function() {
/* STREAMING_CHUNK:Initializing Expense Summary Plugin with Print Fix... */
(function() {
    console.log("📈 POS Expense Summary Plugin Initialized!");

    function openExpenseSummaryModal() {
        if(document.getElementById('skmExpSummaryModal')) {
            document.getElementById('skmExpSummaryModal').style.display = 'flex';
            calcExpenseData();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmExpSummaryModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;`;
        
        modal.innerHTML = `
            <div id="skmExpSummaryPrintArea" style="background: var(--bg-card, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 16px; width: 450px; max-height: 85vh; display:flex; flex-direction:column; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px;">
                    <h3 style="color:#ef4444; margin:0; font-size:18px; font-weight:900;">📈 សង្ខេបការចំណាយប្រចាំថ្ងៃ</h3>
                    <button id="skmExpCloseBtn" onclick="document.getElementById('skmExpSummaryModal').style.display='none'" style="background:#ef4444; border:none; color:#fff; width:28px; height:28px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
                </div>
                
                <div style="font-size:13px; color:var(--text-muted); margin-bottom:15px; font-weight:bold;">ការបែងចែកប្រាក់ចំណាយថ្ងៃនេះតាមប្រភេទ៖</div>
                
                <div id="skmExpSummaryContent" style="flex:1; overflow-y:auto; max-height:45vh; padding-right:5px; margin-bottom:15px; display:flex; flex-direction:column; gap:10px;">
                    <!-- Injected via JS -->
                </div>

                <div id="skmExpActionBtns" style="display:flex; gap:10px; border-top: 1px solid var(--border); padding-top: 15px;">
                    <button class="btn btn-outline" style="flex:1; border-color:var(--border); color:var(--text-main); font-weight:bold;" onclick="document.getElementById('skmExpSummaryModal').style.display='none'">បិទត្រឡប់ក្រោយ</button>
                    <button class="btn btn-primary" style="flex:1; background:#ef4444; border:none; font-weight:bold; color:#fff; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);" onclick="window.printExpenseSummary()">🖨️ បោះពុម្ព (Print)</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        calcExpenseData();
    }

    /* STREAMING_CHUNK:Calculating and rendering expense data... */
    function calcExpenseData() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let expenses = window.expenses || JSON.parse(localStorage.getItem(`ks2_${branchId}_expenses_pro`) || '[]');
        let today = new Date().toLocaleDateString();

        let categoryTotals = {};
        let totalExp = 0;

        expenses.forEach(exp => {
            let expDate = exp.date ? exp.date.split(' ')[0] : '';
            if (expDate === today) {
                let cat = exp.category || 'ចំណាយផ្សេងៗ';
                let amt = parseFloat(exp.amount || 0);
                totalExp += amt;
                if (!categoryTotals[cat]) categoryTotals[cat] = 0;
                categoryTotals[cat] += amt;
            }
        });

        const container = document.getElementById('skmExpSummaryContent');
        if(!container) return;

        let keys = Object.keys(categoryTotals);
        if (keys.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted); font-size:14px; font-weight:bold;">គ្មានទិន្នន័យចំណាយថ្ងៃនេះទេ</div>';
            return;
        }

        container.innerHTML = keys.map(cat => `
            <div style="background:rgba(255, 255, 255, 0.05); padding:15px; border-radius:12px; border:1px solid rgba(255, 255, 255, 0.1); display:flex; justify-content:space-between; align-items:center;">
                <div style="font-weight:bold; color:var(--text-main, #333); font-size:14px; display:flex; align-items:center; gap:8px;">
                    <span style="background:rgba(239, 68, 68, 0.1); color:#ef4444; padding:4px 8px; border-radius:6px; font-size:12px;">🏷️</span> ${cat}
                </div>
                <div style="font-size:18px; font-weight:900; color:#ef4444;">$${categoryTotals[cat].toFixed(2)}</div>
            </div>
        `).join('') + `
            <div style="background:rgba(239,68,68,0.1); border:2px dashed #ef4444; padding:15px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                <div style="font-size:14px; font-weight:bold; color:#ef4444;">សរុបរួមប្រចាំថ្ងៃ (Total):</div>
                <b style="color:#ef4444; font-size:24px; font-weight:900;">$${totalExp.toFixed(2)}</b>
            </div>
            <div style="text-align:center; font-size:10px; color:gray; margin-top:15px;">កាលបរិច្ឆេទរបាយការណ៍៖ ${new Date().toLocaleString('km-KH')}</div>
        `;
    }

    /* STREAMING_CHUNK:Implementing print logic with CSS injection for backgrounds... */
    window.printExpenseSummary = function() {
        // ចម្លងតែផ្នែកសំខាន់ចេញមកក្រៅ ដើម្បីកុំឱ្យជាប់ Background ខ្មៅពេញេអេក្រង់
        const printContent = document.getElementById('skmExpSummaryContent').innerHTML;
        const branchName = window.SHOP_BRANCH_ID || 'សាខាទី ១';
        
        const printWindow = window.open('', '_blank', 'width=600,height=800');
        
        // សរសេរកូដ HTML ចូលទៅក្នុងផ្ទាំងថ្មី ព្រមទាំងបង្ខំឱ្យ Printer គូរ Background (print-color-adjust)
        printWindow.document.write(`
            <html>
            <head>
                <title>របាយការណ៍ចំណាយប្រចាំថ្ងៃ - ${branchName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Battambang', sans-serif;
                        padding: 30px;
                        color: #1e293b;
                        background: #ffffff;
                    }
                    /* បង្ខំ Printer ឱ្យព្រីនចេញពណ៌ Background និងស្រមោលទាំងអស់ */
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .no-print { display: none !important; }
                    }
                    h2 { text-align: center; color: #ef4444; font-size: 22px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px solid #ef4444; padding-bottom: 10px;}
                    p.subtitle { text-align: center; font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 30px;}
                    
                    /* តម្រឹមពណ៌ក្នុងពេលព្រីនឡើងវិញឱ្យភ្លឺច្បាស់លើក្រដាសស */
                    .print-card {
                        background: #f8fafc !important;
                        padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;
                        display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
                    }
                    .print-label { font-weight: bold; font-size: 14px; display: flex; align-items: center; gap: 8px; }
                    .print-badge { background: #fee2e2 !important; color: #ef4444; padding: 4px 8px; border-radius: 6px; font-size: 12px; }
                    .print-val { font-size: 18px; font-weight: 900; color: #ef4444; }
                    
                    .print-total-box {
                        background: #fee2e2 !important; border: 2px dashed #ef4444 !important;
                        padding: 20px; border-radius: 12px; display: flex; justify-content: space-between;
                        align-items: center; margin-top: 20px;
                    }
                    .print-total-label { font-size: 16px; font-weight: bold; color: #ef4444; }
                    .print-total-val { color: #ef4444; font-size: 26px; font-weight: 900; }
                    
                    /* លុបធាតុ UI ដែលចម្លងមកពី Dark Mode */
                    [style*="rgba(255, 255, 255, 0.05)"] { background: #f8fafc !important; border-color: #e2e8f0 !important; }
                    [style*="rgba(239,68,68,0.1)"] { background: #fee2e2 !important; }
                    [style*="color:var(--text-main, #333)"] { color: #1e293b !important; }
                </style>
            </head>
            <body>
                <h2>📈 របាយការណ៍សង្ខេបការចំណាយ (Expense Report)</h2>
                <p class="subtitle">ប្រចាំថ្ងៃទី៖ ${new Date().toLocaleDateString('km-KH')} | សាខា៖ ${branchName}</p>
                
                <div class="print-container">
                    ${printContent}
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // ទុកពេលឱ្យ Font ដើរ និងរូបភាព Render សិន ទើបហៅ Print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 800);
    };

    /* STREAMING_CHUNK:Registering plugin to the system... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📈', 'សង្ខេបការចំណាយតាមប្រភេទ', openExpenseSummaryModal, "📈 សង្ខេបការចំណាយតាមប្រភេទ expense_summary.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [28/43] 📉 កត់ត្រាចំណាយរហ័ស.js ===
window.skmRegisterBundledPlugin('pos', "📉 កត់ត្រាចំណាយរហ័ស.js", function() {
(function() {
    console.log("📉 POS Ultra-Compact Premium Expense (USD+KHR) Initialized!");

    // មុខងាររាប់លេខមានចលនា
    function animateValue(obj, start, end, duration, currency = 'USD') {
        let startTimestamp = null;
        const formatMoney = (val, cur) => {
            if (cur === 'USD') return '$' + val.toFixed(2);
            return Math.floor(val).toLocaleString('en-US') + ' ៛';
        };

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = (progress * (end - start) + start);
            
            obj.innerHTML = formatMoney(currentVal, currency);
            
            if (progress < 1) window.requestAnimationFrame(step);
            else obj.innerHTML = formatMoney(end, currency);
        };
        window.requestAnimationFrame(step);
    }

    window.skmCloseQuickExpense = function() {
        const modal = document.getElementById('skm-quick-exp-modal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-exp-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    };

    function openQuickExpense() {
        let modal = document.getElementById('skm-quick-exp-modal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-exp-glass, .skm-exp-glass * { box-sizing: border-box; }
                
                .skm-exp-glass {
                    background: var(--bg-card, #ffffff);
                    color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 420px;
                    max-height: 95vh; display: flex; flex-direction: column;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-exp-glass {
                        background: var(--bg-card, #1e293b);
                        color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-exp-input, .skm-exp-select {
                    height: 38px; font-size: 13px; font-weight: 500;
                    border-radius: 10px; border: 1px solid var(--border, rgba(128,128,128,0.25));
                    background: var(--bg-input, #f8fafc);
                    color: var(--text-main, inherit); padding: 0 8px;
                    outline: none; transition: 0.2s; font-family: 'Battambang', 'Arial', sans-serif;
                }
                @media (prefers-color-scheme: dark) { .skm-exp-input, .skm-exp-select { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                .skm-exp-input:focus, .skm-exp-select:focus { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15); background: transparent; }
                
                .skm-exp-btn {
                    height: 38px; border-radius: 10px; border: none;
                    background: #ef4444; color: white; padding: 0 15px;
                    font-size: 13px; font-weight: bold; cursor: pointer; transition: 0.2s;
                    font-family: 'Battambang'; white-space: nowrap;
                    box-shadow: 0 5px 15px rgba(239, 68, 68, 0.2);
                }
                .skm-exp-btn:hover { background: #dc2626; box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3); }
                .skm-exp-btn:active { transform: scale(0.96); }
                
                .skm-stat-box {
                    padding: 12px; border-radius: 12px;
                    background: rgba(239, 68, 68, 0.05);
                    border: 1px solid rgba(239, 68, 68, 0.15);
                    text-align: center; margin-bottom: 12px;
                }
                
                .skm-log-item {
                    background: var(--bg-input, #f8fafc);
                    padding: 8px 12px; border-radius: 10px; margin-bottom: 6px;
                    border: 1px solid var(--border, rgba(128,128,128,0.15));
                    display: flex; justify-content: space-between; align-items: center;
                }
                @media (prefers-color-scheme: dark) { .skm-log-item { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                
                .skm-btn-del {
                    background: rgba(128,128,128,0.1); color: var(--text-muted); border: none;
                    padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;
                    font-family: 'Battambang'; font-weight: bold; transition: 0.2s;
                }
                .skm-btn-del:hover { background: #ef4444; color: white; }
                
                .skm-exp-list { overflow-y: auto; flex: 1; padding-right: 4px; min-height: 150px; }
                .skm-exp-list::-webkit-scrollbar { width: 4px; }
                .skm-exp-list::-webkit-scrollbar-track { background: transparent; }
                .skm-exp-list::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skm-quick-exp-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                backdrop-filter: blur(3px); opacity: 0; transition: opacity 0.3s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-exp-glass">
                    <!-- ក្បាល (Header) -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h3 style="margin:0; font-size:16px; font-weight:600; display:flex; align-items:center; gap:6px;">
                            <span style="color:#ef4444; font-size: 18px;">📉</span> កត់ត្រាចំណាយរហ័ស
                        </h3>
                        <div onclick="window.skmCloseQuickExpense()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:26px; height:26px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                    </div>

                    <!-- 📊 ផ្ទាំងបង្ហាញចំណាយសរុប -->
                    <div class="skm-stat-box">
                        <div style="font-size: 12px; color: #ef4444; font-weight: bold; margin-bottom: 4px;">💸 ចំណាយសរុបថ្ងៃនេះ (Total Expenses)</div>
                        <div style="display: flex; justify-content: center; align-items: center; gap: 15px;">
                            <span id="skm-exp-usd" style="font-size: 20px; font-weight: 700; font-family: 'Arial'; color: #ef4444;">$0.00</span>
                            <span style="color: rgba(239, 68, 68, 0.3); font-size: 14px;">|</span>
                            <span id="skm-exp-khr" style="font-size: 15px; font-weight: 600; font-family: 'Arial'; color: #f43f5e;">0 ៛</span>
                        </div>
                    </div>
                    
                    <!-- ✍️ ទម្រង់បញ្ចូលទិន្នន័យ (Compact Layout) -->
                    <div style="background: var(--bg-alt, #f1f5f9); padding: 12px; border-radius: 12px; border: 1px solid var(--border, rgba(128,128,128,0.1)); margin-bottom: 15px;">
                        
                        <!-- ជួរទី១: ប្រភេទ + ទឹកប្រាក់ + រូបិយប័ណ្ណ -->
                        <div style="display: flex; gap: 6px; margin-bottom: 8px; width: 100%;">
                            <select id="skmQEType" class="skm-exp-select" style="flex: 0 0 120px;">
                                <option value="ទិញសម្ភារៈ/ស្តុក">📦 ទិញសម្ភារៈ/ស្តុក</option>
                                <option value="ថ្លៃទឹក/ភ្លើង">⚡ ថ្លៃទឹក/ភ្លើង</option>
                                <option value="ថ្លៃម្ហូប/បាយ">🍛 ថ្លៃម្ហូប/បាយ</option>
                                <option value="ចំណាយផ្សេងៗ">🏷️ ចំណាយផ្សេងៗ</option>
                            </select>
                            <input type="number" id="skmQEAmount" class="skm-exp-input" placeholder="ទឹកប្រាក់" style="flex: 1; min-width: 0;">
                            <select id="skmQECurrency" class="skm-exp-select" style="flex: 0 0 65px; font-family: 'Arial'; font-weight: bold; padding: 0 5px;">
                                <option value="USD">USD</option>
                                <option value="KHR">KHR</option>
                            </select>
                        </div>
                        
                        <!-- ជួរទី២: ចំណាំ + ប៊ូតុង -->
                        <div style="display: flex; gap: 6px; width: 100%;">
                            <input type="text" id="skmQENote" class="skm-exp-input" placeholder="មូលហេតុ (ឧ. ទិញទឹកសុទ្ធ...)" style="flex: 1; min-width: 0;">
                            <button class="skm-exp-btn" onclick="window.saveQuickExpense()" style="flex: 0 0 85px;">កត់ត្រា</button>
                        </div>
                    </div>
                    
                    <!-- 📜 ប្រវត្តិ (History List) -->
                    <div style="display: flex; flex-direction: column; flex: 1; overflow: hidden;">
                        <div style="font-size:11px; font-weight:600; color:var(--text-muted); margin-bottom:6px;">ប្រវត្តិថ្ងៃនេះ (Today's Expenses)</div>
                        <div id="skmExpenseList" class="skm-exp-list"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseQuickExpense(); });
            document.addEventListener('keydown', function(e) { if(e.key === 'Escape' && modal.style.display !== 'none') window.skmCloseQuickExpense(); });
            
        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-exp-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            
            document.getElementById('skmQEAmount').value = '';
            document.getElementById('skmQENote').value = '';
        }

        setTimeout(() => { 
            modal.style.opacity = '1'; 
            document.getElementById('skmQEAmount').focus(); 
        }, 50);

        window.loadExpenseList();
    }

    // មុខងារកត់ត្រា
    window.saveQuickExpense = function() {
        const cat = document.getElementById('skmQEType').value;
        const currency = document.getElementById('skmQECurrency').value;
        const amtInput = document.getElementById('skmQEAmount');
        const amt = parseFloat(amtInput.value);
        const note = document.getElementById('skmQENote').value.trim();
        
        if(isNaN(amt) || amt <= 0) { 
            amtInput.style.borderColor = '#ef4444';
            setTimeout(() => amtInput.style.borderColor = '', 1000);
            return; 
        }
        
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let expenses = window.expenses || JSON.parse(localStorage.getItem(`ks2_${branchId}_expenses_pro`) || '[]');
        
        const rate = parseFloat(document.getElementById('globalExchangeRate')?.value) || window.cartRate || 4000;
        const usdAmt = currency === 'KHR' ? parseFloat((amt / rate).toFixed(4)) : amt;
        const displayNote = currency === 'KHR' ? `${note || cat} (${Math.round(amt).toLocaleString()} ៛)` : (note || cat);

        const newExp = {
            id: 'EXP-' + Date.now(),
            date: new Date().toLocaleString('km-KH'),
            dateIso: new Date().toLocaleDateString(),
            timestamp: Date.now(),
            category: cat,
            amount: usdAmt,
            originalAmount: amt,
            currency: currency,
            note: displayNote
        };

        expenses.unshift(newExp);
        window.expenses = expenses;
        localStorage.setItem(`ks2_${branchId}_expenses_pro`, JSON.stringify(expenses));

        if (window.supabaseClient && navigator.onLine) {
            window.supabaseClient.from('pos_expenses').upsert({
                id: String(newExp.id),
                branch_id: branchId,
                category: newExp.category,
                amount: newExp.amount,
                note: newExp.note,
                timestamp: newExp.timestamp,
                date: newExp.date
            }, { onConflict: 'id' }).then().catch(() => {});
        }
        
        // ធានាការរក្សាទុកទិន្នន័យទៅ Cloud បើប្រព័ន្ធមានគាំទ្រ
        if (typeof window.saveData === 'function' && window.userAccounts) {
            window.saveData(window.userAccounts);
        }
        if (typeof window.renderExpenses === 'function') window.renderExpenses();
        if (typeof window.renderDashboard === 'function') window.renderDashboard();
        
        document.getElementById('skmQEAmount').value = '';
        document.getElementById('skmQENote').value = '';
        document.getElementById('skmQEAmount').focus();
        
        window.loadExpenseList();
        
        const btn = document.querySelector('.skm-exp-btn');
        const oldText = btn.innerText;
        btn.innerText = 'ជោគជ័យ!';
        btn.style.background = '#10b981';
        btn.style.boxShadow = 'none';
        setTimeout(() => { btn.innerText = oldText; btn.style.background = ''; btn.style.boxShadow = ''; }, 1000);
    };

    window.deleteQuickExpense = function(id) {
        if(confirm('តើអ្នកពិតជាចង់លុបចំណាយនេះមែនទេ?')) {
            const branchId = window.SHOP_BRANCH_ID || 'branch_1';
            let expenses = window.expenses || JSON.parse(localStorage.getItem(`ks2_${branchId}_expenses_pro`) || '[]');
            expenses = expenses.filter(e => e.id !== id);
            window.expenses = expenses;
            localStorage.setItem(`ks2_${branchId}_expenses_pro`, JSON.stringify(expenses));
            window.loadExpenseList();
        }
    };

    let cExpUsd = 0, cExpKhr = 0;
    
    window.loadExpenseList = function() {
        const list = document.getElementById('skmExpenseList');
        if(!list) return;
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let expenses = window.expenses || JSON.parse(localStorage.getItem(`ks2_${branchId}_expenses_pro`) || '[]');
        
        const todayStr = new Date().toLocaleDateString();
        const todayLogs = expenses.filter(e => {
            if(e.dateIso) return e.dateIso === todayStr;
            if(e.date) return e.date.includes(todayStr);
            return false;
        });

        let tExpUsd = 0, tExpKhr = 0;
        
        if(todayLogs.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:15px; color:var(--text-muted); font-size:11px;">មិនទាន់មានចំណាយទេ!</div>';
        } else {
            list.innerHTML = todayLogs.map(e => {
                const curr = e.currency || 'USD'; 
                const amt = parseFloat(e.amount);
                
                if(curr === 'USD') tExpUsd += amt; else tExpKhr += amt;
                
                const amtDisplay = curr === 'USD' ? `$${amt.toFixed(2)}` : `${Math.floor(amt).toLocaleString('en-US')} ៛`;
                
                // រក្សាទម្រង់ Icon តាមប្រភេទ
                let icon = '🏷️';
                if(e.category.includes('ទិញសម្ភារៈ') || e.category.includes('ស្តុក')) icon = '📦';
                else if(e.category.includes('ទឹក') || e.category.includes('ភ្លើង')) icon = '⚡';
                else if(e.category.includes('ម្ហូប') || e.category.includes('បាយ')) icon = '🍛';
                
                return `
                <div class="skm-log-item">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                            <span style="font-size:14px; font-weight:bold; color:#ef4444; font-family:'Arial';">
                                - ${amtDisplay}
                            </span>
                            <span style="font-size:12px; color:var(--text-main); font-weight:500;">(${icon} ${e.note})</span>
                        </div>
                        <div style="font-size:10px; color:var(--text-muted);">${e.date}</div>
                    </div>
                    <button class="skm-btn-del" onclick="window.deleteQuickExpense('${e.id}')">លុប</button>
                </div>
                `;
            }).join('');
        }

        // Update Animations
        if(tExpUsd !== cExpUsd) { animateValue(document.getElementById('skm-exp-usd'), cExpUsd, tExpUsd, 400, 'USD'); cExpUsd = tExpUsd; }
        if(tExpKhr !== cExpKhr) { animateValue(document.getElementById('skm-exp-khr'), cExpKhr, tExpKhr, 400, 'KHR'); cExpKhr = tExpKhr; }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📉', 'កត់ត្រាចំណាយរហ័ស', openQuickExpense, "📉 កត់ត្រាចំណាយរហ័ស.js");
            clearInterval(initInt);
            console.log("✅ Ultra-Compact Expense Modal successfully registered!");
        }
    }, 500);
})();
});

;
// === [29/43] 📊 របាយការណ៍ម៉ោងការងារប្រចាំខែ monthly_staff_report.js ===
window.skmRegisterBundledPlugin('pos', "📊 របាយការណ៍ម៉ោងការងារប្រចាំខែ monthly_staff_report.js", function() {
(function() {
    console.log("📊 POS Monthly Staff Attendance Report Plugin Initialized!");

    // 🌟 បង្កប់ CSS ផ្ទាល់ខ្លួនសម្រាប់ Modal ឱ្យមានសោភ័ណភាពស្អាតទំនើប
    if (!document.getElementById('skm-monthly-report-style')) {
        const style = document.createElement('style');
        style.id = 'skm-monthly-report-style';
        style.innerHTML = `
            .skm-mr-bg {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
                z-index: 100000; display: flex; justify-content: center; align-items: center;
                font-family: 'Battambang', sans-serif; opacity: 0; transition: opacity 0.3s ease;
                pointer-events: none;
            }
            .skm-mr-bg.skm-show {
                opacity: 1; pointer-events: auto;
            }
            .skm-mr-content {
                background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b);
                max-width: 650px; width: 94%; padding: 25px; border-radius: 28px;
                max-height: 90vh; display: flex; flex-direction: column;
                box-shadow: 0 25px 60px -15px rgba(0,0,0,0.3);
                transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid var(--border-color, #e2e8f0);
            }
            .skm-mr-bg.skm-show .skm-mr-content {
                transform: translateY(0) scale(1);
            }
            .skm-mr-table {
                width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px;
            }
            .skm-mr-table th, .skm-mr-table td {
                border: 1px solid var(--border-color, #e2e8f0); padding: 10px 12px; text-align: left;
            }
            .skm-mr-table th {
                background: var(--store-bg, #f8fafc); font-weight: 900; color: var(--text-dark, #1e293b);
            }
        `;
        document.head.appendChild(style);
    }

    function openMonthlyReportModal() {
        let modal = document.getElementById('skmMonthlyReportModal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('skm-show'), 10);
            populateMonthYearSelectors();
            loadMonthlyReportData();
            return;
        }

        modal = document.createElement('div');
        modal.className = 'skm-mr-bg';
        modal.id = 'skmMonthlyReportModal';
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('skm-show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        modal.innerHTML = `
            <div class="skm-mr-content" onclick="event.stopPropagation()">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border-color, #e2e8f0); padding-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.12); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                            📊
                        </div>
                        <div>
                            <h3 style="color:var(--text-dark, #1e293b); margin:0; font-size:16px; font-weight:900;">របាយការណ៍ម៉ោងការងារប្រចាំខែ</h3>
                            <div style="font-size:11px; color:var(--text-muted, #64748b); font-weight:700;">Monthly Staff Attendance Report</div>
                        </div>
                    </div>
                    <div onclick="document.getElementById('skmMonthlyReportModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmMonthlyReportModal').style.display='none', 300);" style="color: var(--text-muted, #9ca3af); font-size: 16px; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; background: var(--store-bg, #f1f5f9); display: flex; align-items: center; justify-content: center; font-weight: bold;">✕</div>
                </div>
                
                <!-- Filter Controls -->
                <div style="display:flex; gap:10px; margin-bottom:15px; flex-wrap:wrap;">
                    <div style="flex:1; min-width: 140px;">
                        <label style="font-size:11px; display:block; margin-bottom:4px; font-weight:800; color:var(--text-muted);">ជ្រើសរើសខែ៖</label>
                        <select id="skmFilterMonth" class="input-st" style="margin-bottom:0; padding:10px; font-size:13px; cursor:pointer;" onchange="window.loadMonthlyReportData()">
                            <option value="0">មករា (January)</option>
                            <option value="1">កុម្ភៈ (February)</option>
                            <option value="2">មីនា (March)</option>
                            <option value="3">មេសា (April)</option>
                            <option value="4">ឧសភា (May)</option>
                            <option value="5">មិថុនា (June)</option>
                            <option value="6">កក្កដា (July)</option>
                            <option value="7">សីហា (August)</option>
                            <option value="8">កញ្ញា (September)</option>
                            <option value="9">តុលា (October)</option>
                            <option value="10">វិច្ឆិកា (November)</option>
                            <option value="11">ធ្នូ (December)</option>
                        </select>
                    </div>
                    <div style="width: 120px;">
                        <label style="font-size:11px; display:block; margin-bottom:4px; font-weight:800; color:var(--text-muted);">ឆ្នាំ៖</label>
                        <select id="skmFilterYear" class="input-st" style="margin-bottom:0; padding:10px; font-size:13px; cursor:pointer;" onchange="window.loadMonthlyReportData()">
                            <option value="${currentYear}">${currentYear}</option>
                            <option value="${currentYear-1}">${currentYear-1}</option>
                            <option value="${currentYear-2}">${currentYear-2}</option>
                        </select>
                    </div>
                </div>

                <!-- Report Container -->
                <div id="skmMonthlyReportContainer" style="flex:1; overflow-y:auto; max-height:45vh; padding-right:5px; margin-bottom:15px;">
                    <!-- Table inject here -->
                </div>

                <div style="display:flex; gap:12px; border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 15px;">
                    <button style="flex:1; border:1px solid var(--border-color, #e2e8f0); color:var(--text-dark, #1e293b); border-radius:14px; padding:12px; font-weight:bold; cursor:pointer; background:transparent; font-family:'Battambang'; font-size:13px;" onclick="document.getElementById('skmMonthlyReportModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmMonthlyReportModal').style.display='none', 300);">បិទ</button>
                    <button style="flex:1; background:linear-gradient(135deg, #3b82f6, #2563eb); color:white; border:none; border-radius:14px; padding:12px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.35); font-family:'Battambang'; font-size:13px;" onclick="window.printMonthlyReport()">🖨️ បោះពុម្ពរបាយការណ៍</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('skm-show'), 10);
        
        populateMonthYearSelectors();
        loadMonthlyReportData();
    }

    function populateMonthYearSelectors() {
        const monthSel = document.getElementById('skmFilterMonth');
        if(monthSel) {
            monthSel.value = new Date().getMonth();
        }
    }

    window.loadMonthlyReportData = function() {
        const container = document.getElementById('skmMonthlyReportContainer');
        if(!container) return;

        const monthSel = document.getElementById('skmFilterMonth');
        const yearSel = document.getElementById('skmFilterYear');
        
        const targetMonth = monthSel ? parseInt(monthSel.value) : new Date().getMonth();
        const targetYear = yearSel ? parseInt(yearSel.value) : new Date().getFullYear();

        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        let allLogs = JSON.parse(localStorage.getItem(`ks2_${branchId}_time_clock`) || '[]');

        let filteredLogs = allLogs.filter(l => {
            if (l.id && l.id.startsWith('TC-')) {
                let timestamp = parseInt(l.id.replace('TC-', ''));
                if (!isNaN(timestamp)) {
                    let d = new Date(timestamp);
                    return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
                }
            }
            return true;
        });

        if (filteredLogs.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:13px; font-weight:800;">📉 គ្មានទិន្នន័យម៉ោងការងារសម្រាប់ខែនេះទេ</div>';
            return;
        }

        // Group logs by staff and calculate total working hours
        let staffSummary = {};
        let logsByStaff = {};
        
        filteredLogs.forEach(l => {
            if (!logsByStaff[l.staffName]) logsByStaff[l.staffName] = [];
            logsByStaff[l.staffName].push(l);
        });

        for (let name in logsByStaff) {
            // Sort logs chronologically (oldest to newest)
            let sLogs = [...logsByStaff[name]].sort((a, b) => {
                let tA = a.id && a.id.startsWith('TC-') ? parseInt(a.id.replace('TC-', '')) : 0;
                let tB = b.id && b.id.startsWith('TC-') ? parseInt(b.id.replace('TC-', '')) : 0;
                return tA - tB;
            });

            let totalWorkMs = 0;
            let lastInTime = null;
            let punchInCount = 0;
            let punchOutCount = 0;
            let breakCount = 0;

            sLogs.forEach(l => {
                let t = l.id && l.id.startsWith('TC-') ? parseInt(l.id.replace('TC-', '')) : Date.now();
                if (l.action.includes('In')) {
                    punchInCount++;
                    lastInTime = t;
                } else if (l.action.includes('Out')) {
                    punchOutCount++;
                    if (lastInTime) {
                        totalWorkMs += (t - lastInTime);
                        lastInTime = null;
                    }
                } else if (l.action.includes('សម្រាក')) {
                    breakCount++;
                    if (lastInTime) {
                        totalWorkMs += (t - lastInTime);
                        lastInTime = null;
                    }
                } else if (l.action.includes('វិញ')) {
                    lastInTime = t;
                }
            });

            let totalHours = (totalWorkMs / (1000 * 60 * 60)).toFixed(1);

            staffSummary[name] = {
                punchIn: punchInCount,
                punchOut: punchOutCount,
                breaks: breakCount,
                totalHours: totalHours
            };
        }

        let summaryCardsHtml = `
            <div style="font-size:13px; font-weight:900; color:var(--text-dark); margin-bottom:8px;">📌 តារាងសង្ខេបម៉ោងការងារសរុបតាមបុគ្គលិក៖</div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin-bottom:15px;">
        `;

        for (let name in staffSummary) {
            let s = staffSummary[name];
            summaryCardsHtml += `
                <div class="skm-mr-sum-card">
                    <div style="font-weight:900; color:#3b82f6; font-size:14px; margin-bottom:2px;">👤 ${name}</div>
                    <div style="font-size:14px; font-weight:900; color:#10b981; margin-bottom:6px;">⏱️ ម៉ោងសរុប: ${s.totalHours} ម៉ោង</div>
                    <div style="font-size:11px; color:var(--text-muted); display:flex; gap:8px; font-weight:bold;">
                        <span>📥 ចូល: ${s.punchIn}</span>
                        <span>📤 ចេញ: ${s.punchOut}</span>
                        <span>☕ សម្រាក: ${s.breaks}</span>
                    </div>
                </div>
            `;
        }
        summaryCardsHtml += `</div>`;

        container.innerHTML = `
            ${summaryCardsHtml}
            <div style="font-size:13px; font-weight:900; color:var(--text-dark); margin-bottom:8px;">📋 ប្រវត្តិសកម្មភាពលម្អិត៖</div>
            <table class="skm-mr-table">
                <thead>
                    <tr>
                        <th>ល.រ</th>
                        <th>ឈ្មោះបុគ្គលិក</th>
                        <th>សកម្មភាព (Action)</th>
                        <th>កាលបរិច្ឆេទ & ម៉ោង</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredLogs.map((l, i) => `
                        <tr>
                            <td style="text-align:center; width:40px;">${i+1}</td>
                            <td style="font-weight:900;">👤 ${l.staffName}</td>
                            <td><span style="font-weight:bold; color:${l.action.includes('In')?'#10b981':l.action.includes('Out')?'#ef4444':'#f59e0b'};">${l.action}</span></td>
                            <td>⏱️ ${l.time}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    };

    window.printMonthlyReport = function() {
        const monthSel = document.getElementById('skmFilterMonth');
        const yearSel = document.getElementById('skmFilterYear');
        const monthName = monthSel ? monthSel.options[monthSel.selectedIndex].text : '';
        const yearVal = yearSel ? yearSel.value : '';

        const container = document.getElementById('skmMonthlyReportContainer').innerHTML;
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';

        const printWin = window.open('', '_blank', 'width=650,height=750');
        printWin.document.write(`
            <html>
            <head>
                <title>Monthly Attendance Report - ${monthName} ${yearVal}</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Battambang', sans-serif; padding: 25px; color: #1e293b; background: #ffffff; margin: 0; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    h2 { text-align: center; color: #3b82f6; font-size: 20px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;}
                    p.subtitle { text-align: center; font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 25px; font-weight: bold;}
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th, td { border: 1px solid #cbd5e1; padding: 10px 12px; font-size: 12px; text-align: left; }
                    th { background: #f8fafc; font-weight: 900; }
                </style>
            </head>
            <body>
                <h2>📊 របាយការណ៍ម៉ោងការងារប្រចាំខែ</h2>
                <p class="subtitle">ខែ៖ ${monthName} ឆ្នាំ ${yearVal} | សាខា៖ ${branchId}</p>
                <div>${container}</div>
                <div style="text-align:center; font-size:11px; color:#94a3b8; margin-top:50px;">បោះពុម្ពចេញពីប្រព័ន្ធគិតលុយ POS ហាងកាហ្វេ</div>
            </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); printWin.close(); }, 600);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📊', 'របាយការណ៍ម៉ោងការងារប្រចាំខែ', openMonthlyReportModal, "📊 របាយការណ៍ម៉ោងការងារប្រចាំខែ monthly_staff_report.js");
            clearInterval(initInt);
        }
    }, 300);
})();
});

;
// === [30/43] 📊 សង្ខេបការលក់ថ្ងៃនេះ.js ===
window.skmRegisterBundledPlugin('pos', "📊 សង្ខេបការលក់ថ្ងៃនេះ.js", function() {
(function() {
    console.log("📊 POS Premium Ultra-Compact Daily Summary Initialized!");
    
    // មុខងាររាប់លេខឱ្យមានចលនា (គាំទ្រលេខធម្មតា, USD និង KHR)
    function animateValue(obj, start, end, duration, format = 'INT') {
        let startTimestamp = null;
        const formatNumber = (val, fmt) => {
            if (fmt === 'USD') return '$' + val.toFixed(2);
            if (fmt === 'KHR') return Math.floor(val).toLocaleString('en-US') + ' ៛';
            return Math.floor(val); // សម្រាប់ចំនួនវិក្កយបត្រ និងទំនិញ
        };

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // រត់លឿន រួចយឺតនៅចុងបញ្ចប់
            const currentVal = (easeProgress * (end - start) + start);
            
            obj.innerHTML = formatNumber(currentVal, format);
            
            if (progress < 1) window.requestAnimationFrame(step);
            else obj.innerHTML = formatNumber(end, format);
        };
        window.requestAnimationFrame(step);
    }

    window.skmCloseDailySummary = function() {
        const modal = document.getElementById('skmDailyModal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-sum-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    };

    function openDailySummary() {
        let modal = document.getElementById('skmDailyModal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-sum-glass, .skm-sum-glass * { box-sizing: border-box; }
                
                .skm-sum-glass {
                    background: var(--bg-card, #ffffff);
                    color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 400px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-sum-glass {
                        background: var(--bg-card, #1e293b);
                        color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-stat-box {
                    padding: 12px; border-radius: 12px;
                    background: var(--bg-alt, #f8fafc);
                    border: 1px solid var(--border, rgba(128,128,128,0.15));
                    text-align: center; display: flex; flex-direction: column; justify-content: center;
                }
                @media (prefers-color-scheme: dark) { .skm-stat-box { background: var(--bg-alt, rgba(255,255,255,0.05)); } }
                
                .skm-stat-rev {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(56, 189, 248, 0.05));
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skmDailyModal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                backdrop-filter: blur(3px); opacity: 0; transition: opacity 0.3s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-sum-glass">
                    <!-- ក្បាល (Header) -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <div>
                            <h3 style="margin:0; font-size:16px; font-weight:600; display:flex; align-items:center; gap:6px;">
                                <span style="color:#0ea5e9; font-size: 18px;">📊</span> សង្ខេបការលក់ថ្ងៃនេះ
                            </h3>
                            <div id="skm-sum-date" style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-top: 2px;">...</div>
                        </div>
                        <div onclick="window.skmCloseDailySummary()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:26px; height:26px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                    </div>

                    <!-- ជួរទី១: ចំនួនវិក្កយបត្រ និង ទំនិញ -->
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <div class="skm-stat-box" style="flex: 1;">
                            <div style="font-size: 11px; color: #0ea5e9; font-weight: bold; margin-bottom: 4px;">🧾 វិក្កយបត្រចេញ</div>
                            <div id="skm-val-inv" style="font-size: 20px; font-weight: bold; font-family: 'Arial'; color: var(--text-main);">0</div>
                        </div>
                        <div class="skm-stat-box" style="flex: 1;">
                            <div style="font-size: 11px; color: #a78bfa; font-weight: bold; margin-bottom: 4px;">📦 ទំនិញលក់ដាច់</div>
                            <div id="skm-val-qty" style="font-size: 20px; font-weight: bold; font-family: 'Arial'; color: var(--text-main);">0</div>
                        </div>
                    </div>

                    <!-- ជួរទី២: ចំណូលសរុប (USD + KHR) -->
                    <div class="skm-stat-box skm-stat-rev" style="margin-bottom: 15px;">
                        <div style="font-size: 12px; color: #10b981; font-weight: bold; margin-bottom: 4px;">💵 ចំណូលសរុបប្រចាំថ្ងៃ (Total Revenue)</div>
                        <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 5px;">
                            <span id="skm-val-rev-usd" style="font-size: 24px; font-weight: 800; font-family: 'Arial'; color: #10b981;">$0.00</span>
                            <span style="color: rgba(16, 185, 129, 0.3); font-size: 16px;">|</span>
                            <span id="skm-val-rev-khr" style="font-size: 16px; font-weight: 600; font-family: 'Arial'; color: #0ea5e9;">0 ៛</span>
                        </div>
                    </div>
                    
                    <button onclick="window.skmCloseDailySummary()" style="width:100%; background:var(--bg-alt, #f8fafc); border:1px solid var(--border, rgba(128,128,128,0.15)); color:inherit; padding:10px; border-radius:10px; font-family:'Battambang'; cursor:pointer; font-weight:600; font-size:13px; transition:0.2s;" onmouseover="this.style.background='rgba(128,128,128,0.1)';">បិទរបាយការណ៍</button>
                </div>
            `;
            document.body.appendChild(modal);

            // ចុចខាងក្រៅ និង Esc ដើម្បីបិទ
            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseDailySummary(); });
            document.addEventListener('keydown', function(e) { if(e.key === 'Escape' && modal.style.display !== 'none') window.skmCloseDailySummary(); });
            
        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-sum-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        setTimeout(() => { modal.style.opacity = '1'; }, 50);
        window.calculateDailySummary();
    }

    // អថេរទុកសម្រាប់កុំឱ្យវាលោត Animation ញឹកញាប់បើទិន្នន័យនៅដដែល
    let curInv = 0, curQty = 0, curRevUsd = 0;

    window.calculateDailySummary = function() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('skm-sum-date').innerText = now.toLocaleDateString('km-KH', options);

        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_invoices_pro`) || '[]');
        
        const todayStr1 = now.toLocaleDateString(); 
        const todayStr2 = now.toISOString().split('T')[0];
        const exchangeRate = window.EXCHANGE_RATE || 4000; // យក ៤០០០ ជាស្តង់ដារប្តូរប្រាក់ បើគ្មានកំណត់ក្នុងប្រព័ន្ធ
        
        let count = 0, totalRevUsd = 0, itemsCount = 0;
        
        invoices.forEach(inv => {
            let invDate = inv.date ? inv.date.split(' ')[0] : '';
            if (inv.status === 'paid' && (invDate === todayStr1 || invDate === todayStr2 || (inv.date && inv.date.includes(todayStr2)))) {
                count++;
                totalRevUsd += parseFloat(inv.totalAmount || 0);
                if (inv.items) {
                    inv.items.forEach(it => itemsCount += (parseInt(it.cartQty || it.qty) || 1));
                }
            }
        });

        let totalRevKhr = totalRevUsd * exchangeRate;

        // ចាប់ផ្តើម Animation
        const elInv = document.getElementById('skm-val-inv');
        const elQty = document.getElementById('skm-val-qty');
        const elRevUsd = document.getElementById('skm-val-rev-usd');
        const elRevKhr = document.getElementById('skm-val-rev-khr');

        if(count !== curInv) { animateValue(elInv, curInv, count, 800, 'INT'); curInv = count; }
        if(itemsCount !== curQty) { animateValue(elQty, curQty, itemsCount, 800, 'INT'); curQty = itemsCount; }
        
        if(totalRevUsd !== curRevUsd) { 
            animateValue(elRevUsd, curRevUsd, totalRevUsd, 1000, 'USD'); 
            animateValue(elRevKhr, curRevUsd * exchangeRate, totalRevKhr, 1000, 'KHR');
            curRevUsd = totalRevUsd; 
        } else {
            // បើទិន្នន័យដដែល បង្ហាញយកតែម្តងអត់លេងចលនា
            elRevUsd.innerText = '$' + totalRevUsd.toFixed(2);
            elRevKhr.innerText = Math.floor(totalRevKhr).toLocaleString('en-US') + ' ៛';
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📊', 'របាយការណ៍ថ្ងៃនេះ', openDailySummary, "📊 សង្ខេបការលក់ថ្ងៃនេះ.js");
            clearInterval(initInt);
            console.log("✅ Premium Ultra-Compact Daily Summary successfully registered!");
        }
    }, 500);
})();
});

;
// === [31/43] 📋 វិក្កយបត្រលក់ចុងក្រោយ (10 ចុងក្រោយ).js ===
window.skmRegisterBundledPlugin('pos', "📋 វិក្កយបត្រលក់ចុងក្រោយ (10 ចុងក្រោយ).js", function() {
(function() {
    console.log("📋 POS Premium Ultra-Compact Last Sales Loaded!");

    // មុខងារបញ្ចូលប៊ូតុងទៅក្បែរប្រអប់ Search
    function injectLastSaleBtn() {
        const searchInput = document.getElementById('posSearch');
        if (!searchInput || document.getElementById('skmLastSaleBtn')) return;
        
        const btn = document.createElement('button');
        btn.id = 'skmLastSaleBtn';
        btn.innerHTML = '📋 លក់ចុងក្រោយ';
        btn.style.cssText = `
            background: rgba(14, 165, 233, 0.1); color: #0ea5e9; border: 1px solid rgba(14, 165, 233, 0.3);
            padding: 0 15px; height: 38px; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer;
            margin-left: 10px; transition: all 0.2s; font-family: 'Battambang', sans-serif; white-space: nowrap; flex-shrink: 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        `;
        
        btn.onmouseover = () => { 
            btn.style.background = '#0ea5e9'; btn.style.color = 'white'; 
            btn.style.boxShadow = '0 5px 15px rgba(14, 165, 233, 0.3)'; 
        };
        btn.onmouseout = () => { 
            btn.style.background = 'rgba(14, 165, 233, 0.1)'; btn.style.color = '#0ea5e9'; 
            btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)'; 
        };
        
        btn.onclick = window.openLastSalesModal;
        
        // ដាក់ក្បែរប្រអប់ស្វែងរក
        searchInput.parentNode.insertBefore(btn, searchInput.nextSibling);
    }

    window.skmCloseLastSales = function() {
        const modal = document.getElementById('skmLastSalesModal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-sales-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    };

    window.openLastSalesModal = function() {
        let modal = document.getElementById('skmLastSalesModal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-sales-glass, .skm-sales-glass * { box-sizing: border-box; }
                
                .skm-sales-glass {
                    background: var(--bg-card, #ffffff);
                    color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 480px;
                    max-height: 90vh; display: flex; flex-direction: column;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-sales-glass {
                        background: var(--bg-card, #1e293b);
                        color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-sale-item {
                    background: var(--bg-input, #f8fafc);
                    padding: 12px 15px; border-radius: 12px; margin-bottom: 8px;
                    border: 1px solid var(--border, rgba(128,128,128,0.15));
                    display: flex; justify-content: space-between; align-items: center;
                    transition: all 0.2s;
                }
                @media (prefers-color-scheme: dark) { .skm-sale-item { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                .skm-sale-item:hover { border-color: #0ea5e9; background: rgba(14, 165, 233, 0.05); }
                
                .skm-btn-view {
                    background: rgba(14, 165, 233, 0.1); color: #0ea5e9; border: none;
                    padding: 8px 12px; border-radius: 8px; font-size: 12px; cursor: pointer;
                    font-family: 'Battambang'; font-weight: bold; transition: 0.2s; white-space: nowrap;
                }
                .skm-btn-view:hover { background: #0ea5e9; color: white; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3); }
                .skm-btn-view:active { transform: scale(0.95); }
                
                .skm-badge-paid {
                    background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2);
                    padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: bold;
                }
                .skm-badge-unpaid {
                    background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);
                    padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: bold;
                }
                
                .skm-sales-list { overflow-y: auto; flex: 1; padding-right: 5px; min-height: 200px; }
                .skm-sales-list::-webkit-scrollbar { width: 5px; }
                .skm-sales-list::-webkit-scrollbar-track { background: transparent; }
                .skm-sales-list::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skmLastSalesModal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                backdrop-filter: blur(3px); opacity: 0; transition: opacity 0.3s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-sales-glass">
                    <!-- ក្បាល (Header) -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h3 style="margin:0; font-size:16px; font-weight:600; display:flex; align-items:center; gap:8px;">
                            <span style="color:#0ea5e9; font-size: 18px;">📋</span> វិក្កយបត្រលក់ (10 ចុងក្រោយ)
                        </h3>
                        <div onclick="window.skmCloseLastSales()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:28px; height:28px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                    </div>

                    <!-- បញ្ជីវិក្កយបត្រ -->
                    <div id="skmLastSalesList" class="skm-sales-list"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // ចុចខាងក្រៅ ឬ Esc ដើម្បីបិទ
            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseLastSales(); });
            document.addEventListener('keydown', function(e) { if(e.key === 'Escape' && modal.style.display !== 'none') window.skmCloseLastSales(); });
            
        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-sales-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        setTimeout(() => { modal.style.opacity = '1'; }, 50);
        window.loadLastSalesContent();
    };

    window.loadLastSalesContent = function() {
        let invs = window.invoices || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_invoices_pro`) || '[]');
        const list = document.getElementById('skmLastSalesList');
        
        if(invs.length === 0) { 
            list.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:12px;">មិនទាន់មានទិន្នន័យលក់នៅឡើយទេ!</div>'; 
            return; 
        }
        
        const exchangeRate = window.EXCHANGE_RATE || 4000;

        list.innerHTML = invs.slice(0, 10).map(inv => {
            const amtUsd = parseFloat(inv.totalAmount || 0);
            const amtKhr = amtUsd * exchangeRate;
            
            // ពណ៌ Badge តាមស្ថានភាពបង់ប្រាក់
            const isPaid = (inv.status === 'paid' || !inv.status);
            const statusBadge = isPaid 
                ? '<span class="skm-badge-paid">បង់រួច</span>' 
                : '<span class="skm-badge-unpaid">ជំពាក់</span>';
            
            return `
            <div class="skm-sale-item">
                <div style="flex:1;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                        <b style="color:var(--text-main); font-size:14px; font-family:'Arial';">#${inv.id || inv.invoiceNo}</b>
                        ${statusBadge}
                    </div>
                    <div style="display:flex; align-items:baseline; gap:8px; margin-bottom:4px;">
                        <span style="color:#10b981; font-weight:bold; font-size:16px; font-family:'Arial';">$${amtUsd.toFixed(2)}</span>
                        <span style="color:#0ea5e9; font-size:13px; font-weight:600; font-family:'Arial';">${Math.floor(amtKhr).toLocaleString('en-US')} ៛</span>
                    </div>
                    <div style="font-size:11px; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
                        <span>🕒 ${inv.date}</span>
                        <span style="color:rgba(128,128,128,0.3);">|</span>
                        <span>👤 ${inv.customer || 'អតិថិជនទូទៅ'}</span>
                    </div>
                </div>
                <button class="skm-btn-view" onclick="if(typeof window.viewInvoiceDetails==='function'){window.viewInvoiceDetails('${inv.id||inv.invoiceNo}'); window.skmCloseLastSales();}">
                    👁️ មើល
                </button>
            </div>
            `;
        }).join('');
    };

    // ភ្ជាប់ទៅប្រព័ន្ធ
    const initInt = setInterval(() => {
        if (document.getElementById('posSearch')) {
            injectLastSaleBtn();
            clearInterval(initInt);
            console.log("✅ Premium Ultra-Compact Last Sales Viewer successfully injected!");
        }
    }, 1000);
})();
});

;
// === [32/43] 📌 ក្ដារខៀនប្រកាសព័ត៌មានហាង noticeboard.js ===
window.skmRegisterBundledPlugin('pos', "📌 ក្ដារខៀនប្រកាសព័ត៌មានហាង noticeboard.js", function() {
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
            window.registerCustomTool('📌', 'ប្រកាសព័ត៌មាន', openNoticeboard, "📌 ក្ដារខៀនប្រកាសព័ត៌មានហាង noticeboard.js");
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
});

;
// === [33/43] 📑 របាយការណ៍បិទវេនលក់ (Z-Report).js ===
window.skmRegisterBundledPlugin('pos', "📑 របាយការណ៍បិទវេនលក់ (Z-Report).js", function() {
(function() {
    console.log("📑 POS Z-Report & Shift Handover Plugin Initialized!");

    // មុខងារទាញយកឈ្មោះអ្នកប្រើប្រាស់
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

    let currentZReportData = {};

    function openZReportModal() {
        let modal = document.getElementById('skmZReportModal');
        
        if (modal) {
            modal.style.display = 'flex';
            calcZReportData();
            return;
        }

        modal = document.createElement('div');
        modal.id = 'skmZReportModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.6); z-index: 100000; display: flex; 
            justify-content: center; align-items: center; 
            backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;
        `;
        
        // 💡 កំណត់សម្គាល់៖ បានលុប onclick="..." ចេញទាំងអស់ ដើម្បីការពារការ Block ពីប្រព័ន្ធសុវត្ថិភាព
        modal.innerHTML = `
            <div id="skmZReportContentBox" style="background: #ffffff; color: #333333; padding: 25px; border-radius: 16px; width: 480px; max-height: 90vh; display:flex; flex-direction:column; border: 1px solid #e2e8f0; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
                    <h3 style="color:#10b981; margin:0; font-size:16px; display: flex; align-items: center; gap: 8px;">
                        📑 របាយការណ៍បិទវេនលក់ (Z-Report)
                    </h3>
                    <button id="skmBtnCloseModal" style="background:#ef4444; border:none; color:#fff; width:26px; height:26px; border-radius:50%; cursor:pointer; font-weight:bold; display: flex; justify-content: center; align-items: center; font-size: 12px;">✕</button>
                </div>
                
                <div id="skmZReportContent" style="flex:1; overflow-y:auto; max-height:60vh; padding-right:5px; display:flex; flex-direction:column; gap:10px; font-size:14px;">
                    <!-- ទិន្នន័យនឹងលោតចូលទីនេះ -->
                </div>

                <div style="margin-top: 15px; display:flex; gap:10px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                    <button id="skmBtnCloseReport" style="flex:1; padding: 10px; border-radius: 8px; cursor: pointer; background: white; border: 1px solid #cbd5e1; color: #475569; font-family: 'Battambang'; font-size: 14px; font-weight: bold;">បិទ</button>
                    <button id="skmBtnPrintReport" style="flex:1; padding: 10px; border-radius: 8px; cursor: pointer; background: #10b981; border: none; color: white; font-family: 'Battambang'; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">🖨️ បោះពុម្ព (Print)</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 💡 ចាប់យកការចុចប៊ូតុងតាមរយៈ Event Listener វិញ (វិធីនេះមិនត្រូវគេ Block ទេ)
        document.getElementById('skmBtnCloseModal').addEventListener('click', () => modal.style.display = 'none');
        document.getElementById('skmBtnCloseReport').addEventListener('click', () => modal.style.display = 'none');
        
        document.getElementById('skmBtnPrintReport').addEventListener('click', function() {
            executePrintZReport(); // ហៅមុខងារ Print នៅពេលចុច
        });

        // មុខងារចុចខាងក្រៅដើម្បីបិទ
        modal.addEventListener('mousedown', function(event) {
            const content = document.getElementById('skmZReportContentBox');
            if (event.target === modal && !content.contains(event.target)) {
                modal.style.display = 'none';
            }
        });

        calcZReportData();
    }

    function calcZReportData() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices_pro`) || '[]');
        let cashLogs = JSON.parse(localStorage.getItem(`ks2_${branchId}_cash_inout`) || '[]');
        let savedFloat = JSON.parse(localStorage.getItem(`ks2_${branchId}_opening_cash`) || '{}');
        
        let today = new Date().toLocaleDateString();
        let cashSales = 0, totalSalesCount = 0;

        invoices.forEach(inv => {
            let invDate = inv.date ? inv.date.split(' ')[0] : '';
            if (inv.status === 'paid' && invDate === today) {
                totalSalesCount++;
                cashSales += parseFloat(inv.totalAmount || 0);
            }
        });

        let totalCashIn = 0, totalCashOut = 0;
        cashLogs.forEach(l => {
            let logDate = l.date ? l.date.split(' ')[0] : '';
            if (logDate === today) {
                if (l.type === 'in') totalCashIn += parseFloat(l.amount || 0);
                if (l.type === 'out') totalCashOut += parseFloat(l.amount || 0);
            }
        });

        let openingCash = (savedFloat.date === today && savedFloat.amount !== undefined) ? parseFloat(savedFloat.amount) : 0;
        let expectedCashInDrawer = openingCash + cashSales + totalCashIn - totalCashOut;
        let currentUser = getCurrentUser();
        let currentTime = new Date().toLocaleString('km-KH');

        currentZReportData = {
            date: currentTime,
            user: currentUser,
            count: totalSalesCount,
            opening: openingCash,
            sales: cashSales,
            cashIn: totalCashIn,
            cashOut: totalCashOut,
            expected: expectedCashInDrawer
        };

        const content = document.getElementById('skmZReportContent');
        if(!content) return;

        content.innerHTML = `
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">កាលបរិច្ឆេទ / ម៉ោង៖</span><b style="color:#334155;">${currentTime}</b>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">បុគ្គលិកបិទវេន៖</span><b style="color:#334155;">${currentUser}</b>
            </div>
            <hr style="border: 0; border-top: 1px dashed #cbd5e1; margin: 5px 0;">
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">វិក្កយបត្រថ្ងៃនេះ៖</span><b style="color:#334155;">${totalSalesCount} វិក្កយបត្រ</b>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">ប្រាក់ដើមក្នុងទូរ (Opening):</span><b style="color:#f59e0b;">$${openingCash.toFixed(2)}</b>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">ចំណូលលក់សុទ្ធ (Sales):</span><b style="color:#10b981;">+$${cashSales.toFixed(2)}</b>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">ប្រាក់ដាក់បន្ថែម (Cash In):</span><b style="color:#0ea5e9;">+$${totalCashIn.toFixed(2)}</b>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">ប្រាក់ដកចេញ (Cash Out):</span><b style="color:#ef4444;">-$${totalCashOut.toFixed(2)}</b>
            </div>
            
            <div style="background:rgba(16,185,129,0.1); border:2px solid #10b981; padding:15px; border-radius:10px; display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
                <span style="color:#047857; font-weight:bold; font-size:15px;">💵 ប្រាក់សរុបក្នុងទូរ (Expected):</span>
                <span style="font-size:22px; font-weight:900; color:#047857;">$${expectedCashInDrawer.toFixed(2)}</span>
            </div>
        `;
    }

    // 💡 មុខងារ Print ប្រើ Iframe ដែលមាន Opacity 0 (មានន័យថាវាលោតចេញមកមែន តែគ្រាន់តែយើងមើលមិនឃើញ)
    function executePrintZReport() {
        const d = currentZReportData;
        
        // លុប Iframe ចាស់ចោលសិន (បើមាន) ដើម្បីកុំឱ្យជាន់គ្នា
        let oldIframe = document.getElementById('skmZReportPrintFrame');
        if (oldIframe) { oldIframe.remove(); }

        // បង្កើត Iframe ថ្មី
        let iframe = document.createElement('iframe');
        iframe.id = 'skmZReportPrintFrame';
        
        // លាក់ដោយប្រើ opacity: 0 (មិនប្រើ display:none ទើប Browser ព្រមព្រីនឱ្យ)
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '350px';
        iframe.style.height = '500px';
        iframe.style.opacity = '0';
        iframe.style.pointerEvents = 'none'; // កុំឱ្យប៉ះពាល់ការចុចរបស់ User
        
        document.body.appendChild(iframe);

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Z-Report - ${d.date}</title>
                <style>
                    body { font-family: 'Battambang', Arial, sans-serif; padding: 10px; color: #000; font-size: 14px; margin: 0; }
                    .header { text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 5px; }
                    .sub-header { text-align: center; font-size: 12px; margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
                    .divider { border-bottom: 1px dashed #000; margin: 10px 0; }
                    .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 10px 0; margin-top: 10px; }
                    .footer { text-align: center; font-size: 12px; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="header">របាយការណ៍បិទវេន (Z-Report)</div>
                <div class="sub-header">
                    កាលបរិច្ឆេទ: ${d.date}<br>
                    អ្នកបោះពុម្ព: ${d.user}
                </div>
                
                <div class="row"><span>ចំនួនវិក្កយបត្រ:</span> <span>${d.count}</span></div>
                <div class="divider"></div>
                
                <div class="row"><span>ប្រាក់ដើម (Opening):</span> <span>$${d.opening.toFixed(2)}</span></div>
                <div class="row"><span>ចំណូលលក់ (Sales):</span> <span>+$${d.sales.toFixed(2)}</span></div>
                <div class="row"><span>ដាក់បន្ថែម (Cash In):</span> <span>+$${d.cashIn.toFixed(2)}</span></div>
                <div class="row"><span>ដកចេញ (Cash Out):</span> <span>-$${d.cashOut.toFixed(2)}</span></div>
                
                <div class="total-row">
                    <span>ប្រាក់ក្នុងទូរ:</span>
                    <span>$${d.expected.toFixed(2)}</span>
                </div>
                
                <div class="footer">
                    ហត្ថលេខាអ្នកគ្រប់គ្រង<br><br><br>
                    ....................................
                </div>
            </body>
            </html>
        `;
        
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(htmlContent);
        doc.close();

        // ទុកពេលឱ្យ Browser render ទិន្នន័យ 0.5 វិនាទី ទើបបញ្ជា Print
        setTimeout(() => {
            try {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
            } catch (e) {
                console.error("Print Error:", e);
                window.print(); // ជម្រើសចុងក្រោយ បើ Iframe នៅតែ Error
            }
        }, 500);
    }

    let attempts = 0;
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📑', 'របាយការណ៍បិទវេន (Z-Report)', openZReportModal, "📑 របាយការណ៍បិទវេនលក់ (Z-Report).js");
            clearInterval(initInt);
            console.log("✅ Z-Report successfully registered!");
        }
        attempts++;
        if (attempts > 20) {
            clearInterval(initInt);
            console.warn("⚠️ Z-Report failed to register: Smart Toolbox not found.");
        }
    }, 500);
})();
});

;
// === [34/43] 📝 កំណត់ចំណាំរហ័ស (Cashier Notes).js ===
window.skmRegisterBundledPlugin('pos', "📝 កំណត់ចំណាំរហ័ស (Cashier Notes).js", function() {
(function() {
    console.log("📝 POS Scratchpad Plugin Initialized!");

    function openScratchpad() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let savedNote = localStorage.getItem(`ks2_${branchId}_scratchpad`) || '';

        let modal = document.getElementById('skmScratchModal');
        
        // ប្រសិនបើធ្លាប់បើកហើយ គ្រាន់តែបង្ហាញវាវិញ ហើយទាញទិន្នន័យចុងក្រោយមកដាក់
        if(modal) {
            modal.style.display = 'flex';
            const textArea = document.getElementById('skmScratchText');
            textArea.value = savedNote;
            setTimeout(() => textArea.focus(), 100);
            return;
        }

        // បង្កើត Modal ថ្មី
        modal = document.createElement('div');
        modal.id = 'skmScratchModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.6); z-index: 100000; display: flex; 
            justify-content: center; align-items: center; 
            backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;
        `;
        
        // ប្រើរចនាបថ UI ពណ៌ស ទំនើប ស្រឡះភ្នែក (ដូច Opening Float)
        modal.innerHTML = `
            <div id="skmScratchContent" style="background: #ffffff; color: #333333; padding: 25px; border-radius: 16px; width: 420px; display:flex; flex-direction:column; border: 1px solid #e2e8f0; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
                    <h3 style="color:#f97316; margin:0; font-size:16px; display: flex; align-items: center; gap: 8px;">
                        📝 កំណត់ចំណាំរហ័ស (Cashier Notes)
                    </h3>
                    <button onclick="document.getElementById('skmScratchModal').style.display='none'" style="background:#ef4444; border:none; color:#fff; width:26px; height:26px; border-radius:50%; cursor:pointer; font-weight:bold; display: flex; justify-content: center; align-items: center; font-size: 12px;">✕</button>
                </div>
                
                <!-- មិនដាក់ទិន្នន័យត្រង់នេះផ្ទាល់ទេ ដើម្បីការពារ XSS Security -->
                <textarea id="skmScratchText" placeholder="សរសេរចំណាំ ឬការងារត្រូវធ្វើទីនេះ..." style="width:100%; height:160px; resize:none; padding:12px; background:#f8fafc; color:#333; border:1px solid #cbd5e1; border-radius:8px; outline:none; font-family:'Battambang', sans-serif; box-sizing:border-box; font-size:14px; line-height: 1.6;"></textarea>

                <div style="margin-top: 15px; display:flex; gap:10px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                    <button style="flex:1; padding: 10px; border-radius: 8px; cursor: pointer; background: white; border: 1px solid #cbd5e1; color: #475569; font-family: 'Battambang'; font-size: 14px;" onclick="document.getElementById('skmScratchModal').style.display='none'">បិទ</button>
                    <button style="flex:1; padding: 10px; border-radius: 8px; cursor: pointer; background: #f97316; border: none; color: white; font-family: 'Battambang'; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.2);" onclick="window.saveScratchpad()">💾 រក្សាទុក</button>
                </div>
            </div>
        `;
        
        // មុខងារចុចលើផ្ទៃខាងក្រៅ (Background) ដើម្បីបិទ Modal
        modal.addEventListener('mousedown', function(event) {
            const content = document.getElementById('skmScratchContent');
            if (event.target === modal && !content.contains(event.target)) {
                modal.style.display = 'none';
            }
        });

        document.body.appendChild(modal);
        
        // បញ្ចូលទិន្នន័យដោយសុវត្ថិភាព តាមរយៈ .value 
        const textArea = document.getElementById('skmScratchText');
        textArea.value = savedNote;
        
        // Auto-focus ឱ្យកន្ត្រក Mouse លោតចូលប្រអប់ស្រាប់
        setTimeout(() => textArea.focus(), 100);
    }

    // មុខងាររក្សាទុក
    window.saveScratchpad = function() {
        const val = document.getElementById('skmScratchText').value;
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        
        localStorage.setItem(`ks2_${branchId}_scratchpad`, val);
        document.getElementById('skmScratchModal').style.display = 'none';
        
        if(typeof window.showToast === 'function') {
            window.showToast('បានរក្សាទុកកំណត់ចំណាំរហ័ស!');
        }
    };

    // រង់ចាំភ្ជាប់ជាមួយ Smart Toolbox ត្រឹមតែ ២០ ដង (១០ វិនាទី)
    let attempts = 0;
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📝', 'កំណត់ចំណាំរហ័ស', openScratchpad, "📝 កំណត់ចំណាំរហ័ស (Cashier Notes).js");
            clearInterval(initInt);
            console.log("✅ Scratchpad successfully registered to Toolbox!");
        }
        attempts++;
        if (attempts > 20) {
            clearInterval(initInt);
            console.warn("⚠️ Scratchpad failed to register: Smart Toolbox not found.");
        }
    }, 500);

})();
});

;
// === [35/43] 📱 បង្កើត QR ដាក់តុ Table QR Generator.js ===
window.skmRegisterBundledPlugin('pos', "📱 បង្កើត QR ដាក់តុ Table QR Generator.js", function() {
/* STREAMING_CHUNK:Initializing Super Premium Table QR Generator... */
(function() {
    console.log("📱 POS Super Premium QR Code Generator Plugin Initialized!");

    /* STREAMING_CHUNK:Building Flawless Premium UI... */
    function openTableQrModal() {
        if(document.getElementById('skmTableQrModal')) {
            document.getElementById('skmTableQrModal').style.display = 'flex';
            window.updateTableQrPreview();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmTableQrModal';
        // Glassmorphism Backdrop
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.65); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        /* STREAMING_CHUNK:Injecting Flawless CSS and Layout (Fixed Clipping)... */
        modal.innerHTML = `
            <style>
                .skm-qr-box { background: #ffffff; color: #1e293b; padding: 25px 30px; border-radius: 28px; width: 100%; max-width: 460px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); display: flex; flex-direction: column; gap: 18px; box-sizing: border-box; max-height: 95vh; }
                .skm-qr-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; flex-shrink: 0; }
                
                .skm-qr-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; padding-right: 4px; }
                .skm-qr-body::-webkit-scrollbar { width: 5px; }
                .skm-qr-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

                .skm-input-group { display: flex; flex-direction: column; gap: 6px; }
                .skm-input-label { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                .skm-qr-input { font-size: 15px; font-weight: 700; padding: 14px 16px; border-radius: 16px; border: 1.5px solid transparent; width: 100%; transition: all 0.3s ease; color: #0f172a; background: #f8fafc; outline: none; font-family: 'Nunito', 'Battambang', sans-serif; box-sizing: border-box; }
                .skm-qr-input:focus { border-color: #3b82f6; background: #ffffff; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); }
                
                /* Super Premium Card Preview Style - FIXED CLIPPING */
                .skm-qr-card { background: #ffffff; border-radius: 20px; padding: 35px 20px 25px 20px; text-align: center; box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08); display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; margin: 5px auto; position: relative; border: 1px solid #e2e8f0; }
                .skm-qr-card::before { content: ''; position: absolute; top: -1px; left: -1px; right: -1px; height: 6px; background: linear-gradient(90deg, #0ea5e9, #8b5cf6, #ec4899); border-radius: 20px 20px 0 0; }
                
                .skm-qr-shop-title { font-size: 16px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin-top: 0; margin-bottom: 12px; letter-spacing: 0.5px; line-height: 1.4; padding: 0 10px; }
                .skm-qr-table-title { font-size: 14px; font-weight: 800; color: #4338ca; background: #e0e7ff; padding: 8px 22px; border-radius: 30px; margin-bottom: 22px; display: inline-block; border: 1px solid #c7d2fe; letter-spacing: 0.5px; }
                
                .skm-qr-img-wrapper { padding: 12px; border-radius: 20px; border: 2px solid #e0f2fe; background: #ffffff; margin-bottom: 20px; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 8px 25px rgba(14, 165, 233, 0.1); }
                .skm-qr-img-wrapper:hover { border-color: #3b82f6; transform: scale(1.05) translateY(-2px); box-shadow: 0 15px 35px rgba(59, 130, 246, 0.2); }
                .skm-qr-img { width: 180px; height: 180px; object-fit: contain; display: block; border-radius: 8px; }
                
                .skm-qr-scan-kh { font-size: 15px; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
                .skm-qr-scan-en { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                .skm-qr-url-text { font-size: 9px; color: #94a3b8; margin-top: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90%; background: #f8fafc; padding: 5px 10px; border-radius: 6px; }
                
                /* Modern Buttons */
                .skm-btn-print { background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; border: none; padding: 16px; border-radius: 16px; font-size: 15px; font-weight: bold; cursor: pointer; flex: 1.5; transition: 0.3s; box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3); font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 8px; }
                .skm-btn-print:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4); }
                .skm-btn-close { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 16px; border-radius: 16px; font-size: 15px; font-weight: bold; cursor: pointer; flex: 1; transition: 0.3s; text-align: center; font-family: inherit; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
            </style>
            
            <div class="skm-qr-box">
                <div class="skm-qr-header">
                    <h3 style="margin:0; font-size:18px; display: flex; align-items: center; gap: 10px; color: #0f172a; font-weight: 900;">
                        <span style="font-size: 24px; background: #e0f2fe; padding: 8px; border-radius: 14px; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.1);">📱</span> បង្កើត QR Code
                    </h3>
                    <button onclick="document.getElementById('skmTableQrModal').style.display='none'" style="background: #fef2f2; border: 1px solid #fca5a5; color: #ef4444; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">✕</button>
                </div>
                
                <div class="skm-qr-body">
                    <div style="display: flex; gap: 15px;">
                        <div class="skm-input-group" style="flex: 1;">
                            <label class="skm-input-label">ឈ្មោះទីតាំង / លេខតុ</label>
                            <input type="text" id="skmQrTableName" class="skm-qr-input" value="ទីតាំង 01" oninput="window.updateTableQrPreview()">
                        </div>
                        <div class="skm-input-group" style="flex: 1.5;">
                            <label class="skm-input-label">អក្សរណែនាំខាងក្រោម</label>
                            <input type="text" id="skmQrSubText" class="skm-qr-input" value="ស្កេនដើម្បីមើលបញ្ជីទំនិញ" oninput="window.updateTableQrPreview()">
                        </div>
                    </div>

                    <!-- Super Premium QR Code Preview Box (FIXED CLIPPING) -->
                    <div class="skm-qr-card">
                        <div class="skm-qr-shop-title" id="qrPrevShopName">SHOP NAME</div>
                        <div class="skm-qr-table-title" id="qrPrevTitle">ទីតាំង 01</div>
                        
                        <div class="skm-qr-img-wrapper">
                            <img id="qrPrevImg" src="" class="skm-qr-img">
                        </div>
                        
                        <div class="skm-qr-scan-kh" id="qrPrevScanKh">ស្កេនដើម្បីមើលបញ្ជីទំនិញ</div>
                        <div class="skm-qr-scan-en">Scan QR code to view our products & order</div>
                        <div class="skm-qr-url-text" id="qrPrevUrlText">...</div>
                    </div>

                    <div style="display:flex; gap:12px; margin-top: 5px; flex-shrink: 0;">
                        <button class="skm-btn-close" onclick="document.getElementById('skmTableQrModal').style.display='none'">បិទផ្ទាំង</button>
                        <button class="skm-btn-print" onclick="window.printTableQr()"><span>🖨️</span> បោះពុម្ព (Print)</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        // Set Shop Name for preview
        document.getElementById('qrPrevShopName').innerText = window.shopName || 'SHOP NAME';

        window.updateTableQrPreview();
    }

    /* STREAMING_CHUNK:Implementing Link & Text Generation... */
    window.updateTableQrPreview = function() {
        const name = document.getElementById('skmQrTableName').value.trim() || 'ទីតាំង 01';
        const subText = document.getElementById('skmQrSubText').value.trim() || 'ស្កេនដើម្បីមើលបញ្ជីទំនិញ';
        
        document.getElementById('qrPrevTitle').innerText = name;
        document.getElementById('qrPrevScanKh').innerText = subText;
        
        let path = window.location.pathname;
        let lastSlash = path.lastIndexOf('/');
        let menuBaseUrl = window.location.origin + path.substring(0, lastSlash + 1) + 'menu.html';
        
        let branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        let fullUrl = `${menuBaseUrl}?branch=${branchId}&table=${encodeURIComponent(name)}`;
        
        let encodedUrl = encodeURIComponent(fullUrl);
        // Using a slightly higher resolution for crisper image in the premium card
        document.getElementById('qrPrevImg').src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`;
        
        document.getElementById('qrPrevUrlText').innerText = `${menuBaseUrl}?table=${name}`;
    };

    /* STREAMING_CHUNK:Implementing Premium Print Layout... */
    window.printTableQr = function() {
        const name = document.getElementById('skmQrTableName').value.trim() || 'ទីតាំង 01';
        const subText = document.getElementById('skmQrSubText').value.trim() || 'ស្កេនដើម្បីមើលបញ្ជីទំនិញ';
        const qrSrc = document.getElementById('qrPrevImg').src;
        const shopName = window.shopName || 'SHOP NAME';
        
        const printWin = window.open('', '', 'width=600,height=800');
        printWin.document.write(`
            <html>
                <head>
                    <title>Print QR - ${name}</title>
                    <style>
                        body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f8fafc; font-family: 'Helvetica Neue', Arial, sans-serif; }
                        .print-card { 
                            background: #ffffff;
                            border: 2px solid #e2e8f0; 
                            padding: 45px 35px; 
                            border-radius: 24px; 
                            text-align: center; 
                            width: 340px; 
                            box-shadow: 0 15px 40px rgba(0,0,0,0.08);
                            box-sizing: border-box;
                            position: relative;
                            overflow: hidden;
                        }
                        /* Top Accent Line for Print */
                        .print-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: #0ea5e9; }
                        
                        .shop-name { font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.3; }
                        .table-name { font-size: 16px; font-weight: 800; color: #2563eb; background: #eff6ff; padding: 6px 20px; border-radius: 20px; border: 1px solid #bfdbfe; display: inline-block; margin-bottom: 25px; }
                        
                        .qr-wrapper { border: 2px solid #e2e8f0; padding: 15px; border-radius: 16px; display: inline-block; margin-bottom: 20px; }
                        .qr-image { width: 220px; height: 220px; object-fit: contain; display: block; }
                        
                        .scan-kh { font-size: 18px; font-weight: 900; color: #1e293b; margin-bottom: 6px; }
                        .scan-en { font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
                        
                        /* Print Specific Overrides */
                        @media print {
                            body { background: #fff; }
                            .print-card { box-shadow: none; border: 3px solid #000; padding: 40px 30px; width: 100%; max-width: 380px; }
                            .print-card::before { background: #000; }
                            .shop-name { color: #000; }
                            .table-name { color: #000; background: #fff; border-color: #000; }
                            .qr-wrapper { border-color: #000; border-style: solid; }
                            .scan-kh { color: #000; }
                            .scan-en { color: #333; }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-card">
                        <div class="shop-name">${shopName}</div>
                        <div class="table-name">${name}</div>
                        
                        <div class="qr-wrapper">
                            <img src="${qrSrc}" class="qr-image">
                        </div>
                        
                        <div class="scan-kh">${subText}</div>
                        <div class="scan-en">Scan QR code to view our products & order</div>
                    </div>
                </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        
        // រង់ចាំឱ្យរូបភាព Load ពេញសិន ទើបបញ្ជាឱ្យ Print
        setTimeout(() => { 
            printWin.print(); 
            printWin.close(); 
        }, 800);
    };

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📱', 'បង្កើត QR Code (ទម្រង់ទូទៅ)', openTableQrModal, "📱 បង្កើត QR ដាក់តុ Table QR Generator.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [36/43] 🔄 បង្វិលសងប្រាក់ (Quick Refund).js ===
window.skmRegisterBundledPlugin('pos', "🔄 បង្វិលសងប្រាក់ (Quick Refund).js", function() {
/* STREAMING_CHUNK:Initializing Smart Strict Refund System... */
(function() {
    console.log("🔄 POS Quick Refund & Return Plugin Initialized (Anti-Double Refund)!");

    let currentRefundInvoice = null;

    /* STREAMING_CHUNK:Building Refined Advanced Modal UI... */
    function openRefundModal() {
        if(document.getElementById('skmRefundModal')) {
            document.getElementById('skmRefundModal').style.display = 'flex';
            resetRefundForm();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmRefundModal';
        // Glassmorphism Backdrop
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        /* STREAMING_CHUNK:Injecting Clean CSS and Flexbox Layout... */
        modal.innerHTML = `
            <style>
                /* Remove Number Spinners */
                .skm-ref-input::-webkit-inner-spin-button, 
                .skm-ref-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                .skm-ref-input { -moz-appearance: textfield; }

                /* Main Box Structure */
                .skm-ref-box { background: var(--bg-card, #ffffff); color: var(--text-main, #1e293b); padding: 25px; border-radius: 20px; width: 100%; max-width: 460px; height: 85vh; max-height: 650px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.2); border: 1px solid var(--border, #e2e8f0); display: flex; flex-direction: column; box-sizing: border-box; overflow: hidden; }
                .skm-ref-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border, #f1f5f9); padding-bottom: 12px; margin-bottom: 12px; flex-shrink: 0; }
                
                /* Scrollable Body */
                .skm-ref-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; padding-right: 4px; box-sizing: border-box; }
                .skm-ref-body::-webkit-scrollbar { width: 5px; }
                .skm-ref-body::-webkit-scrollbar-track { background: transparent; }
                .skm-ref-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                
                /* Inputs & Buttons */
                .skm-ref-input { font-size: 14px; padding: 10px 14px; border-radius: 10px; border: 1.5px solid #cbd5e1; width: 100%; transition: all 0.2s ease; background: var(--store-bg, #f8fafc); outline: none; color: var(--text-main, #1e293b); font-family: 'Nunito', 'Battambang', sans-serif; font-weight: bold; box-sizing: border-box; }
                .skm-ref-input:focus { border-color: #ef4444; background: #ffffff; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
                .skm-btn-search { background: #0ea5e9; color: white; border: none; padding: 0 16px; border-radius: 10px; font-size: 13px; font-weight: bold; cursor: pointer; transition: 0.2s; white-space: nowrap; font-family: inherit; box-shadow: 0 2px 6px rgba(14, 165, 233, 0.2); }
                .skm-btn-search:hover { background: #0284c7; }
                .skm-btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; width: 100%; transition: 0.2s; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25); font-family: inherit; flex-shrink: 0; }
                .skm-btn-danger:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(239, 68, 68, 0.35); }
                .skm-btn-danger:disabled { background: #94a3b8; box-shadow: none; cursor: not-allowed; transform: none; }
                .skm-item-row { display: flex; justify-content: space-between; align-items: center; background: #ffffff; padding: 10px 12px; border-radius: 10px; border: 1px solid #cbd5e1; margin-bottom: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
            </style>
            
            <div class="skm-ref-box">
                <div class="skm-ref-header">
                    <h3 style="margin:0; font-size:16px; display: flex; align-items: center; gap: 8px; color: #ef4444; font-weight: 800;">
                        <span>🔄</span> បង្វិលសងប្រាក់ & ដូរទំនិញ
                    </h3>
                    <button onclick="document.getElementById('skmRefundModal').style.display='none'" style="background: #fef2f2; border: 1px solid #fca5a5; color: #ef4444; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">✕</button>
                </div>
                
                <div class="skm-ref-body">
                    <div>
                        <label style="font-size: 12px; font-weight: 700; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">វាយលេខវិក្កយបត្រដើម្បីស្វែងរក *</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="skmRefInvoiceId" class="skm-ref-input" placeholder="ឧ. INV-260929-002">
                            <button class="skm-btn-search" onclick="window.searchInvoiceForRefund()">🔍 ស្វែងរក</button>
                        </div>
                    </div>

                    <!-- កន្លែងបង្ហាញទំនិញពេលរកឃើញវិក្កយបត្រ -->
                    <div id="skmRefItemsArea" style="display:none; background: #f8fafc; padding: 12px; border-radius: 14px; border: 1px solid var(--border, #e2e8f0);">
                        <label style="font-size:11px; font-weight:700; color:#0ea5e9; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom:8px; display:block;">👇 កំណត់ចំនួនទំនិញដែលត្រូវដូរវិញ</label>
                        <div id="skmRefItemsList" style="display:flex; flex-direction:column;"></div>
                    </div>
                    
                    <div>
                        <label style="font-size: 12px; font-weight: 700; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">ទឹកប្រាក់ត្រូវសងវិញ ($) *</label>
                        <input type="number" id="skmRefAmount" class="skm-ref-input" placeholder="0.00" style="color:#ef4444; font-size:18px;">
                    </div>

                    <div>
                        <label style="font-size: 12px; font-weight: 700; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">មូលហេតុនៃការសងប្រាក់ / ដូរទំនិញ *</label>
                        <input type="text" id="skmRefReason" class="skm-ref-input" placeholder="ឧ. ទំនិញខូចគុណភាព, អតិថិជនដូរចិត្ត...">
                    </div>

                    <button class="skm-btn-danger" onclick="window.processIntegratedRefund()" id="btnProcessRefund">🔄 បញ្ជាក់ការសងប្រាក់</button>

                    <div style="border-top: 1px dashed #cbd5e1; padding-top: 12px; margin-top: 4px;">
                        <div style="font-size:12px; font-weight:700; color:var(--text-muted, #64748b); margin-bottom:8px;">ប្រវត្តិសងប្រាក់ថ្ងៃនេះ៖</div>
                        <div id="skmRefundList" style="display: flex; flex-direction: column; gap: 8px;"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        loadRefundLogs();
    }

    /* STREAMING_CHUNK:Implementing Search with Anti-Double Refund Checks... */
    window.searchInvoiceForRefund = function() {
        let invId = document.getElementById('skmRefInvoiceId').value.trim();
        if(!invId) { alert("សូមវាយបញ្ចូលលេខវិក្កយបត្រសិន!"); return; }
        
        let invoices = window.invoices || [];
        let inv = invoices.find(i => String(i.id).toLowerCase() === String(invId).toLowerCase() || String(i.invoiceNo).toLowerCase() === String(invId).toLowerCase());
        
        if(!inv) { alert('❌ រកមិនឃើញវិក្កយបត្រនេះទេ!'); return; }
        
        currentRefundInvoice = inv;
        let listHtml = '';
        let hasRefundableItems = false;
        
        (inv.items || []).forEach((item, idx) => {
            let soldQty = parseInt(item.cartQty || item.qty || 0);
            if(soldQty <= 0) return; // លាក់ទំនិញដែលបានដូររួចរាល់ចេញ
            
            hasRefundableItems = true;
            let price = parseFloat(item.price || 0);
            
            listHtml += `
                <div class="skm-item-row">
                    <div style="flex:1; padding-right:8px;">
                        <div style="font-size:13px; font-weight:bold; color:var(--text-main, #1e293b); line-height:1.2;">${item.name}</div>
                        <div style="font-size:11px; color:#64748b; margin-top:4px;">
                            ទិញ: <b style="color:#10b981;">${soldQty}</b> | តម្លៃ: $${price.toFixed(2)}
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <span style="font-size:11px; color:#ef4444; font-weight:bold;">សង:</span>
                        <input type="number" id="refQty_${idx}" class="skm-ref-input" style="width:65px; padding:6px; text-align:center; font-weight:bold; color:#ef4444; border-color:#fca5a5;" min="0" max="${soldQty}" value="0" oninput="window.autoCalcRefundAmount()">
                    </div>
                </div>
            `;
        });
        
        if(!hasRefundableItems) {
            alert('⚠️ ទំនិញក្នុងវិក្កយបត្រនេះត្រូវបានសងប្រាក់វិញអស់ហើយ!');
            return;
        }

        document.getElementById('skmRefItemsList').innerHTML = listHtml;
        document.getElementById('skmRefItemsArea').style.display = 'block';
        document.getElementById('skmRefAmount').value = '0.00';
    };

    window.autoCalcRefundAmount = function() {
        if(!currentRefundInvoice) return;
        let totalRefund = 0;
        (currentRefundInvoice.items || []).forEach((item, idx) => {
            let inputEl = document.getElementById(`refQty_${idx}`);
            if(!inputEl) return;

            let returnQty = parseInt(inputEl.value) || 0;
            let maxQty = parseInt(item.cartQty || item.qty || 0);
            
            if(returnQty > maxQty) {
                returnQty = maxQty;
                inputEl.value = maxQty;
            }
            if(returnQty < 0) {
                returnQty = 0;
                inputEl.value = 0;
            }
            
            let price = parseFloat(item.price || 0);
            totalRefund += (returnQty * price);
        });
        document.getElementById('skmRefAmount').value = totalRefund.toFixed(2);
    };

    function resetRefundForm() {
        if(document.getElementById('skmRefInvoiceId')) document.getElementById('skmRefInvoiceId').value = '';
        if(document.getElementById('skmRefAmount')) document.getElementById('skmRefAmount').value = '';
        if(document.getElementById('skmRefReason')) document.getElementById('skmRefReason').value = '';
        if(document.getElementById('skmRefItemsArea')) document.getElementById('skmRefItemsArea').style.display = 'none';
        currentRefundInvoice = null;
    }

    /* STREAMING_CHUNK:Processing Accurate Partial Refund & Strict Stock Deduction... */
    window.processIntegratedRefund = async function() {
        if(!currentRefundInvoice) { alert('សូមស្វែងរកវិក្កយបត្រជាមុនសិន!'); return; }
        
        const inv = currentRefundInvoice;
        const amt = parseFloat(document.getElementById('skmRefAmount').value);
        const reason = document.getElementById('skmRefReason').value.trim();
        const btn = document.getElementById('btnProcessRefund');

        if(isNaN(amt) || amt < 0) { alert('សូមជ្រើសរើសចំនួនទំនិញដែលត្រូវសងវិញ!'); return; }
        if(!reason) { alert('សូមបញ្ចូលមូលហេតុ!'); return; }

        btn.innerText = '⏳ កំពុងដំណើរការ...';
        btn.disabled = true;

        try {
            let inventory = window.inventory || [];
            let historyLog = window.historyLog || [];
            let dateStr = new Date().toLocaleString('km-KH');
            let currentUser = window.userAccounts ? (window.userAccounts[0]?.fullName || 'Admin') : 'System';

            let totalReturnedItems = 0;

            // 1. បូកស្តុកចូលវិញ និងដកចំនួនចេញពីវិក្កយបត្រ
            (inv.items || []).forEach((soldItem, idx) => {
                let inputEl = document.getElementById(`refQty_${idx}`);
                if(!inputEl) return; 
                
                let returnQty = parseInt(inputEl.value) || 0;
                let soldQty = parseInt(soldItem.cartQty || soldItem.qty || 0);

                if (returnQty > 0) {
                    totalReturnedItems += returnQty;
                    let stockItem = inventory.find(p => p.id === soldItem.id || p.name === soldItem.name);
                    
                    if (stockItem) {
                        stockItem.qty = (parseInt(stockItem.qty) || 0) + returnQty;
                    }
                    
                    // កាត់ចំនួនចេញពីវិក្កយបត្រ (ការពារការបូកជាន់គ្នាពេលចុចប៊ូតុងលុប)
                    if(soldItem.cartQty !== undefined) soldItem.cartQty = soldQty - returnQty;
                    if(soldItem.qty !== undefined) soldItem.qty = soldQty - returnQty;

                    historyLog.unshift({
                        id: Date.now() + Math.random(),
                        date: dateStr,
                        type: 'update',
                        itemName: soldItem.name || 'ទំនិញទូទៅ',
                        qty: returnQty,
                        note: `បង្វិលចូលស្តុកវិញ (Refund: ${inv.id || inv.invoiceNo}) មូលហេតុ: ${reason} - ដោយ: ${currentUser}`
                    });
                }
            });

            if(totalReturnedItems === 0 && amt === 0) {
                alert('សូមជ្រើសរើសចំនួនទំនិញ ឬបញ្ចូលទឹកប្រាក់ដើម្បីសង!');
                btn.innerText = '🔄 បញ្ជាក់ការសងប្រាក់';
                btn.disabled = false;
                return;
            }

            // 2. 🚀 ច្រោះយកតែទំនិញណាដែលនៅសល់ចំនួន (Qty > 0)
            inv.items = inv.items.filter(item => parseInt(item.cartQty || item.qty) > 0);

            // 3. កាត់ទឹកប្រាក់ក្នុងវិក្កយបត្រ
            inv.totalAmount = Math.max(0, (parseFloat(inv.totalAmount) || 0) - amt);
            if(inv.paidUsd !== undefined) inv.paidUsd = Math.max(0, (parseFloat(inv.paidUsd) || 0) - amt);

            // 4. 🚀 បើវិក្កយបត្រនោះអស់ទំនិញ ឬអស់លុយជំពាក់ហើយ ឱ្យវាបាត់ពីបញ្ជី "រង់ចាំទូទាត់"
            if(inv.items.length === 0 || inv.totalAmount <= 0) {
                inv.status = 'paid';
                inv.isRefunded = true;
            } else {
                inv.isPartialRefund = true;
            }

            inv.refundReason = (inv.refundReason ? inv.refundReason + ' | ' : '') + reason;
            inv.refundAmount = (parseFloat(inv.refundAmount) || 0) + amt;

            // 5. កត់ត្រាប្រវត្តិសងប្រាក់ទុកមើល
            const branchId = window.SHOP_BRANCH_ID || 'branch_1';
            let localLogs = JSON.parse(localStorage.getItem(`ks2_${branchId}_refund_logs`) || '[]');
            localLogs.unshift({
                id: 'REF-' + Date.now(),
                invoiceId: inv.id || inv.invoiceNo,
                amount: amt,
                reason: reason,
                time: dateStr
            });
            localStorage.setItem(`ks2_${branchId}_refund_logs`, JSON.stringify(localLogs));

            // 6. Save ទិន្នន័យចូលប្រព័ន្ធ
            if (typeof window.saveData === 'function') {
                await window.saveData(window.userAccounts);
            }

            // Refresh UI
            if(typeof window.renderUnpaid === 'function') window.renderUnpaid();
            if(typeof window.renderHistory === 'function') window.renderHistory();
            if(typeof window.renderInventory === 'function') window.renderInventory();
            if(typeof window.renderDashboard === 'function') window.renderDashboard();

            resetRefundForm();
            loadRefundLogs();
            
            if(typeof window.showToast === 'function') window.showToast('✅ បានកត់ត្រាការសងប្រាក់ និងបូកស្តុកវិញជោគជ័យ!');
            else alert('✅ បានកត់ត្រាការសងប្រាក់ និងបូកស្តុកវិញជោគជ័យ!');

        } catch (error) {
            console.error("Refund Error:", error);
            alert("មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ!");
        } finally {
            btn.innerText = '🔄 បញ្ជាក់ការសងប្រាក់';
            btn.disabled = false;
        }
    };

    /* STREAMING_CHUNK:Loading Logs to UI... */
    function loadRefundLogs() {
        const list = document.getElementById('skmRefundList');
        if(!list) return;

        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let logs = JSON.parse(localStorage.getItem(`ks2_${branchId}_refund_logs`) || '[]');

        if(logs.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:15px; color:var(--text-muted, #94a3b8); font-size:13px;">គ្មានប្រវត្តិសងប្រាក់ទេថ្ងៃនេះ</div>';
            return;
        }

        list.innerHTML = logs.slice(0, 15).map(l => `
            <div style="background: var(--store-bg, #f8fafc); padding:10px 12px; border-radius:12px; border:1px solid var(--border, #e2e8f0);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <b style="color:#ef4444; font-size:13px;">${l.invoiceId}</b>
                    <span style="font-size:11px; color:var(--text-muted, #94a3b8);">${l.time}</span>
                </div>
                <div style="font-size:12px; color:var(--text-main, #334155); margin-bottom:2px;">សងប្រាក់: <b style="color:#ef4444;">$${parseFloat(l.amount||0).toFixed(2)}</b></div>
                <div style="font-size:11px; color:var(--text-muted, #64748b);">មូលហេតុ: ${l.reason}</div>
            </div>
        `).join('');
    }

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🔄', 'បង្វិលសងប្រាក់ (Quick Refund)', openRefundModal, "🔄 បង្វិលសងប្រាក់ (Quick Refund).js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [37/43] 🔤 បង្កើត BarcodeSKU (Barcode Generator).js ===
window.skmRegisterBundledPlugin('pos', "🔤 បង្កើត BarcodeSKU (Barcode Generator).js", function() {
/* STREAMING_CHUNK:Initializing Modern Barcode & SKU Generator Plugin... */
(function() {
    console.log("🔤 POS Modern Barcode & SKU Generator Plugin Initialized!");

    /* STREAMING_CHUNK:Building Refined Minimalist UI... */
    function openBarcodeModal() {
        if(document.getElementById('skmBarcodeModal')) {
            document.getElementById('skmBarcodeModal').style.display = 'flex';
            window.generateNewBarcode();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmBarcodeModal';
        // Glassmorphism Backdrop & Standard Font
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        /* STREAMING_CHUNK:Injecting Clean CSS and Layout... */
        modal.innerHTML = `
            <style>
                .skm-bar-box { background: var(--bg-card, #ffffff); color: var(--text-main, #1e293b); padding: 25px; border-radius: 20px; width: 100%; max-width: 420px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.2); border: 1px solid var(--border, #e2e8f0); display: flex; flex-direction: column; gap: 14px; box-sizing: border-box; }
                .skm-bar-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border, #f1f5f9); padding-bottom: 12px; margin-bottom: 2px; }
                .skm-bar-input { font-size: 14px; padding: 10px 12px; border-radius: 10px; border: 1.5px solid #cbd5e1; width: 100%; transition: all 0.2s ease; background: var(--store-bg, #f8fafc); outline: none; color: var(--text-main, #1e293b); font-family: inherit; box-sizing: border-box; font-weight: bold; }
                .skm-bar-input:focus { border-color: #38bdf8; background: #ffffff; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1); }
                .skm-bar-card { background: #f8fafc; border: 1.5px dashed #38bdf8; border-radius: 16px; padding: 18px; text-align: center; }
                .skm-btn-action { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; width: 100%; transition: 0.2s; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25); font-family: inherit; }
                .skm-btn-action:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(14, 165, 233, 0.35); }
                .skm-btn-copy { background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; flex: 1; transition: 0.2s; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25); font-family: inherit; }
                .skm-btn-copy:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(16, 185, 129, 0.35); }
                .skm-btn-close { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; flex: 1; transition: 0.2s; text-align: center; font-family: inherit; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
            </style>
            
            <div class="skm-bar-box">
                <div class="skm-bar-header">
                    <h3 style="margin:0; font-size:16px; display: flex; align-items: center; gap: 8px; color: #0ea5e9; font-weight: 800;">
                        <span>🔤</span> បង្កើត Barcode / SKU
                    </h3>
                    <button onclick="document.getElementById('skmBarcodeModal').style.display='none'" style="background: #fef2f2; border: 1px solid #fca5a5; color: #ef4444; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">✕</button>
                </div>
                
                <div>
                    <label style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">បុព្វបទកូដ (Prefix)</label>
                    <input type="text" id="skmBarPrefix" class="skm-bar-input" value="SKM">
                </div>

                <button class="skm-btn-action" onclick="window.generateNewBarcode()">✨ បង្កើតលេខកូដថ្មី</button>

                <div class="skm-bar-card">
                    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">លេខកូដបង្កើតបាន</div>
                    <div id="skmGeneratedBarResult" style="font-size: 24px; font-weight: 900; color: #0284c7; font-family: monospace; letter-spacing: 1px;">SKM-882910</div>
                </div>

                <div style="display:flex; gap:10px; margin-top: 2px;">
                    <button class="skm-btn-close" onclick="document.getElementById('skmBarcodeModal').style.display='none'">បិទ</button>
                    <button class="skm-btn-copy" onclick="window.copyGeneratedBarcode()">📋 ចម្លង (Copy)</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        window.generateNewBarcode();
    }

    /* STREAMING_CHUNK:Implementing Generator Logic... */
    window.generateNewBarcode = function() {
        const prefixInput = document.getElementById('skmBarPrefix');
        const resultBox = document.getElementById('skmGeneratedBarResult');
        if(!prefixInput || !resultBox) return;

        const prefix = prefixInput.value.trim() || 'SKM';
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        resultBox.innerText = `${prefix}-${randomNum}`;
    };

    /* STREAMING_CHUNK:Implementing Copy to Clipboard... */
    window.copyGeneratedBarcode = function() {
        const code = document.getElementById('skmGeneratedBarResult').innerText;
        navigator.clipboard.writeText(code).then(() => {
            if(typeof window.showToast === 'function') {
                window.showToast('✅ បានចម្លងលេខកូដចូល Clipboard!');
            } else {
                alert('បានចម្លងលេខកូដ: ' + code);
            }
        });
    };

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🔤', 'បង្កើត Barcode/SKU រហ័ស', openBarcodeModal, "🔤 បង្កើត BarcodeSKU (Barcode Generator).js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [38/43] 🕒 នាឡិកាមានជីវិត (Blinking Colon).js ===
window.skmRegisterBundledPlugin('pos', "🕒 នាឡិកាមានជីវិត (Blinking Colon).js", function() {
(function() {
    console.log("🕒 POS Ultra-Premium Live Clock Initialized!");

    function injectClock() {
        if (document.getElementById('skm-live-clock')) return;
        
        const defaultClock = document.getElementById('currentDate');
        if (defaultClock) {
            defaultClock.style.display = 'none'; // លាក់ម៉ោងចាស់
            
            const clock = document.createElement('div');
            clock.id = 'skm-live-clock';
            
            // ⚡ រចនាម៉ូតកម្រិត Premium (Glassmorphism + Hover Effect)
            clock.style.cssText = `
                background: rgba(0, 0, 0, 0.2); 
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                color: #fff; 
                padding: 4px 12px; 
                border-radius: 12px; 
                border: 1px solid rgba(255,255,255,0.15); 
                margin-left: 10px; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center;
                line-height: 1.1;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                flex-shrink: 0;
                font-family: 'Nunito', 'Arial', sans-serif;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: default;
            `;
            
            // បន្ថែម Effect ពេលយក Mouse ដាក់ពីលើ
            clock.onmouseover = () => {
                clock.style.background = 'rgba(0, 0, 0, 0.4)';
                clock.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                clock.style.boxShadow = '0 5px 15px rgba(56, 189, 248, 0.3)';
                clock.style.transform = 'translateY(-2px)';
            };
            clock.onmouseout = () => {
                clock.style.background = 'rgba(0, 0, 0, 0.2)';
                clock.style.borderColor = 'rgba(255,255,255,0.15)';
                clock.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                clock.style.transform = 'translateY(0)';
            };

            defaultClock.parentNode.insertBefore(clock, defaultClock.nextSibling);
            
            setInterval(() => {
                const now = new Date();
                const dStr = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
                
                let h = now.getHours();
                let m = now.getMinutes();
                let ampm = h >= 12 ? 'PM' : 'AM';
                h = h % 12;
                h = h ? h : 12; // ប្តូរម៉ោង 0 ទៅជាម៉ោង 12
                m = m < 10 ? '0' + m : m;
                
                // ⚡ បង្កើតចលនាសញ្ញាចុចពីរ (:) ភ្លឹបភ្លែតៗរៀងរាល់វិនាទី
                const s = now.getSeconds();
                const colon = s % 2 === 0 ? ':' : '<span style="opacity: 0.3;">:</span>';
                
                // បង្ហាញម៉ោងធំ (ពណ៌ខៀវស្រាលមានពន្លឺ) និង ថ្ងៃខែតូចពីក្រោម
                clock.innerHTML = `
                    <span style="font-size: 14px; font-weight: 900; color: #38bdf8; text-shadow: 0 0 8px rgba(56,189,248,0.4); letter-spacing: 0.5px;">
                        ${h}${colon}${m} <span style="font-size: 10px; color: #fff;">${ampm}</span>
                    </span>
                    <span style="font-size: 10px; color: #cbd5e1; font-weight: 700; margin-top: 2px;">
                        📅 ${dStr}
                    </span>
                `;
            }, 1000);
        }
    }

    const initInterval = setInterval(() => {
        if (document.getElementById('currentDate')) {
            injectClock();
            clearInterval(initInterval);
        }
    }, 1000);
})();
});

;
// === [39/43] 🚚 គ្រប់គ្រងការដឹកជញ្ជូនអនឡាញ (Delivery).js ===
window.skmRegisterBundledPlugin('pos', "🚚 គ្រប់គ្រងការដឹកជញ្ជូនអនឡាញ (Delivery).js", function() {
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
            window.registerCustomTool('🚚', 'គ្រប់គ្រងដឹកជញ្ជូន', openDeliveryModal, "🚚 គ្រប់គ្រងការដឹកជញ្ជូនអនឡាញ (Delivery).js");
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
});

;
// === [40/43] 🛒 បញ្ជីទំនិញត្រូវបញ្ជាទិញបន្ថែម reorder_list.js ===
window.skmRegisterBundledPlugin('pos', "🛒 បញ្ជីទំនិញត្រូវបញ្ជាទិញបន្ថែម reorder_list.js", function() {
/* STREAMING_CHUNK:Initializing POS Reorder Shopping List Plugin Pro... */
(function() {
    console.log("🛒 POS Reorder Shopping List Plugin Pro Initialized!");

    // 🌟 បង្កប់ CSS ផ្ទាល់ខ្លួនដើម្បីធានាថា Modal លេចចេញមកស្អាត និងទំនើប ១០០%
    if (!document.getElementById('skm-reorder-style')) {
        const style = document.createElement('style');
        style.id = 'skm-reorder-style';
        style.innerHTML = `
            .skm-reorder-bg {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
                z-index: 100000; display: flex; justify-content: center; align-items: center;
                font-family: 'Battambang', sans-serif; opacity: 0; transition: opacity 0.3s ease;
                pointer-events: none;
            }
            .skm-reorder-bg.skm-show {
                opacity: 1; pointer-events: auto;
            }
            .skm-reorder-content {
                background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b);
                max-width: 500px; width: 92%; padding: 25px; border-radius: 28px;
                max-height: 88vh; display: flex; flex-direction: column;
                box-shadow: 0 25px 60px -15px rgba(0,0,0,0.3);
                transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid var(--border-color, #e2e8f0);
            }
            .skm-reorder-bg.skm-show .skm-reorder-content {
                transform: translateY(0) scale(1);
            }
            .skm-reorder-item-card {
                background: var(--store-bg, #f8fafc); padding: 12px 16px; border-radius: 16px;
                border: 1px solid var(--border-color, #e2e8f0); display: flex; justify-content: space-between; align-items: center;
                transition: all 0.25s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            }
            .skm-reorder-item-card:hover {
                border-color: #f59e0b; background: rgba(245, 158, 11, 0.04);
                transform: translateY(-1px); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    /* STREAMING_CHUNK:Opening Reorder Modal... */
    function openReorderModal() {
        let modal = document.getElementById('skmReorderModal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('skm-show'), 10);
            loadReorderItems();
            return;
        }

        modal = document.createElement('div');
        modal.className = 'skm-reorder-bg';
        modal.id = 'skmReorderModal';
        
        // ចុចក្រៅប្រអប់ដើម្បីបិទ
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('skm-show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };

        modal.innerHTML = `
            <div class="skm-reorder-content" onclick="event.stopPropagation()">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border-color, #e2e8f0); padding-bottom:15px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width: 44px; height: 44px; background: rgba(245, 158, 11, 0.12); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px;">
                            🛒
                        </div>
                        <div>
                            <h3 style="color:var(--text-dark, #1e293b); margin:0; font-size:17px; font-weight:900;">បញ្ជីទំនិញត្រូវបញ្ជាទិញបន្ថែម</h3>
                            <div style="font-size:11px; color:var(--text-muted, #64748b); font-weight:700;" id="skmReorderDateDisplay">កាលបរិច្ឆេទ: ...</div>
                        </div>
                    </div>
                    <div onclick="document.getElementById('skmReorderModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmReorderModal').style.display='none', 300);" style="color: var(--text-muted, #9ca3af); font-size: 16px; cursor: pointer; width: 34px; height: 34px; border-radius: 50%; background: var(--store-bg, #f1f5f9); display: flex; align-items: center; justify-content: center; font-weight: bold;">✕</div>
                </div>
                
                <div style="font-size:12px; color:var(--text-muted, #64748b); margin-bottom:10px; font-weight:800;">ទំនិញដែលមានស្តុកតិចជាង ឬស្មើ 5 ឯកតា៖</div>
                
                <div id="skmReorderListContent" style="flex:1; overflow-y:auto; max-height:45vh; padding-right:5px; margin-bottom:20px; display:flex; flex-direction:column; gap:10px;">
                    <!-- Items inject here -->
                </div>

                <div style="display:flex; gap:12px; border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 18px;">
                    <button style="flex:1; border:1px solid var(--border-color, #e2e8f0); color:var(--text-dark, #1e293b); border-radius:14px; padding:13px; font-weight:bold; cursor:pointer; background:transparent; font-family:'Battambang';" onclick="document.getElementById('skmReorderModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmReorderModal').style.display='none', 300);">បិទ</button>
                    <button style="flex:1; background:linear-gradient(135deg, #f59e0b, #d97706); color:white; border:none; border-radius:14px; padding:13px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35); font-family:'Battambang';" onclick="window.printReorderListPro()">🖨️ បោះពុម្ពបញ្ជីទិញ</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        
        loadReorderItems();
    }

    /* STREAMING_CHUNK:Loading Reorder Items with Khmer date formatting... */
    function loadReorderItems() {
        const content = document.getElementById('skmReorderListContent');
        if(!content) return;

        let branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        let todayStr = new Date().toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
        const dateDisp = document.getElementById('skmReorderDateDisplay');
        if(dateDisp) dateDisp.innerText = `ថ្ងៃទី: ${todayStr}`;

        let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${branchId}_inv_pro`) || '[]');
        let lowItems = inv.filter(p => (parseInt(p.qty) || 0) <= 5);

        if(lowItems.length === 0) {
            content.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted, #64748b); font-size:13px; font-weight:800;">🎉 គ្មានទំនិញណាខ្វះស្តុកទេ! ស្តុកសុទ្ធតែមានគ្រប់គ្រាន់។</div>';
            return;
        }

        content.innerHTML = lowItems.map((p) => `
            <div class="skm-reorder-item-card">
                <div>
                    <div style="font-weight:900; color:var(--text-dark, #1e293b); font-size:13px; margin-bottom:3px;">📦 ${p.name}</div>
                    <div style="font-size:11px; color:#ef4444; font-weight:800;">ស្តុកបច្ចុប្បន្ន: ${p.qty} ${p.unit || ''}</div>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:12px; color:var(--text-muted, #64748b); font-weight:800;">ណែនាំទិញ: <b style="color:#f59e0b; font-size:14px;">10</b> ឯកតា</span>
                </div>
            </div>
        `).join('');
    }

    // មុខងារ Print បញ្ជីទិញស្តុកដាច់ដោយឡែកយ៉ាងស្អាត
    window.printReorderListPro = function() {
        let branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${branchId}_inv_pro`) || '[]');
        let lowItems = inv.filter(p => (parseInt(p.qty) || 0) <= 5);

        if(lowItems.length === 0) {
            alert('គ្មានទំនិញត្រូវបញ្ជាទិញទេ!');
            return;
        }

        const printWin = window.open('', '_blank', 'width=500,height=700');
        printWin.document.write(`
            <html>
            <head>
                <title>Reorder Shopping List</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Battambang', sans-serif; padding: 25px; color: #1e293b; background: #ffffff; margin: 0; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    h2 { text-align: center; color: #f59e0b; font-size: 20px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;}
                    p.subtitle { text-align: center; font-size: 12px; color: #64748b; margin-top: 0; margin-bottom: 25px;}
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th, td { border: 1px solid #cbd5e1; padding: 10px 12px; font-size: 13px; text-align: left; }
                    th { background: #f8fafc; font-weight: 900; }
                </style>
            </head>
            <body>
                <h2>🛒 បញ្ជីទំនិញត្រូវបញ្ជាទិញបន្ថែម (Reorder List)</h2>
                <p class="subtitle">ថ្ងៃទី៖ ${new Date().toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' })} | សាខា៖ ${branchId}</p>
                <table>
                    <thead>
                        <tr>
                            <th>ល.រ</th>
                            <th>ឈ្មោះទំនិញ</th>
                            <th>ស្តុកសល់</th>
                            <th>ចំនួនណែនាំទិញ</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lowItems.map((p, i) => `
                            <tr>
                                <td style="text-align:center; width:40px;">${i+1}</td>
                                <td style="font-weight:bold;">${p.name}</td>
                                <td style="color:#ef4444; font-weight:bold;">${p.qty}${p.unit || ''}</td>
                                <td style="font-weight:bold; color:#d97706;">10 ឯកតា</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div style="text-align:center; font-size:11px; color:#94a3b8; margin-top:50px;">បោះពុម្ពចេញពីប្រព័ន្ធគិតលុយ POS ហាងកាហ្វេ</div>
            </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); printWin.close(); }, 600);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🛒', 'បញ្ជីទំនិញត្រូវបញ្ជាទិញបន្ថែម', openReorderModal, "🛒 បញ្ជីទំនិញត្រូវបញ្ជាទិញបន្ថែម reorder_list.js");
            clearInterval(initInt);
        }
    }, 300);
})();
});

;
// === [41/43] 🤝 កំណត់ហេតុផ្ទេរវេន (Shift Handover Log).js ===
window.skmRegisterBundledPlugin('pos', "🤝 កំណត់ហេតុផ្ទេរវេន (Shift Handover Log).js", function() {
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
            window.registerCustomTool('🤝', 'កំណត់ហេតុផ្ទេរវេន (Handover)', openHandoverModal, "🤝 កំណត់ហេតុផ្ទេរវេន (Shift Handover Log).js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [42/43] 🪙 គណនាប្រាក់អាប់ (Change Denomination Helper).js ===
window.skmRegisterBundledPlugin('pos', "🪙 គណនាប្រាក់អាប់ (Change Denomination Helper).js", function() {
/* STREAMING_CHUNK:Initializing Smart Change Helper Plugin... */
(function() {
    console.log("🪙 POS Smart Change Helper Plugin Initialized!");

    /* STREAMING_CHUNK:Defining Modal UI and Structure... */
    function openChangeHelperModal() {
        if(document.getElementById('skmChangeHelperModal')) {
            document.getElementById('skmChangeHelperModal').style.display = 'flex';
            
            // ព្យាយាមទាញយកអត្រាដូរប្រាក់ពីប្រព័ន្ធដើម (បើមាន)
            const globalRateEl = document.getElementById('globalExchangeRate');
            if(globalRateEl && document.getElementById('skmChgRate')) {
                document.getElementById('skmChgRate').value = globalRateEl.value;
            }
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmChangeHelperModal';
        // ផ្ទៃខាងក្រោយពណ៌ខ្មៅព្រាល (Glassmorphism)
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); font-family: 'Battambang', 'Nunito', sans-serif;`;
        
        /* STREAMING_CHUNK:Injecting Minimalist CSS and Layout... */
        modal.innerHTML = `
            <style>
                .skm-chg-box { background: var(--bg-card, #ffffff); padding: 30px; border-radius: 24px; width: 420px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); color: var(--text-main, #1e293b); border: 1px solid var(--border, #e2e8f0); }
                .skm-chg-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border, #cbd5e1); padding-bottom: 15px; margin-bottom: 20px; }
                .skm-chg-title { font-size: 18px; font-weight: bold; color: #10b981; margin: 0; display:flex; align-items:center; gap:8px;}
                .skm-chg-row { display: flex; gap: 15px; margin-bottom: 15px; }
                .skm-chg-group { flex: 1; }
                .skm-chg-label { font-size: 13px; font-weight: bold; color: var(--text-muted, #64748b); margin-bottom: 6px; display: block; }
                .skm-chg-input { width: 100%; padding: 12px 15px; border-radius: 12px; border: 2px solid #e2e8f0; font-size: 16px; font-weight: bold; outline: none; transition: 0.3s; background: var(--store-bg, #f8fafc); color: var(--text-main, #0f172a); font-family: 'Nunito', sans-serif; }
                .skm-chg-input:focus { border-color: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); background: #ffffff; }
                .skm-chg-result-box { background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); padding: 20px; border-radius: 16px; text-align: center; margin-top: 20px; transition: 0.3s; }
                .skm-chg-total { font-size: 32px; font-weight: 900; color: #10b981; margin-bottom: 5px; font-family: 'Nunito', sans-serif; }
                .skm-chg-mix { font-size: 14px; font-weight: bold; color: #0ea5e9; padding: 6px 12px; background: #ffffff; border-radius: 20px; display: inline-block; border: 1px dashed #bae6fd; }
                .skm-btn-close { background: var(--store-bg, #f1f5f9); color: var(--text-main, #475569); border: 1px solid var(--border, #cbd5e1); padding: 14px; border-radius: 12px; font-size: 15px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 20px; transition: 0.2s; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
            </style>
            
            <div class="skm-chg-box">
                <div class="skm-chg-header">
                    <h3 class="skm-chg-title"><span style="font-size: 24px;">🪙</span> គណនាប្រាក់អាប់</h3>
                    <button onclick="document.getElementById('skmChangeHelperModal').style.display='none'" style="background: rgba(239, 68, 68, 0.1); border: none; color: #ef4444; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 16px; transition: 0.2s;">✕</button>
                </div>

                <div class="skm-chg-row">
                    <div class="skm-chg-group" style="flex: 2;">
                        <label class="skm-chg-label">សរុបត្រូវបង់ (Total $)</label>
                        <input type="number" id="skmChgTotal" class="skm-chg-input" placeholder="0.00" oninput="window.calcSmartChange()">
                    </div>
                    <div class="skm-chg-group" style="flex: 1;">
                        <label class="skm-chg-label">អត្រាដូរប្រាក់ (Rate)</label>
                        <input type="number" id="skmChgRate" class="skm-chg-input" value="4000" oninput="window.calcSmartChange()" style="color: #f59e0b;">
                    </div>
                </div>

                <div class="skm-chg-row">
                    <div class="skm-chg-group">
                        <label class="skm-chg-label">ប្រាក់ទទួល ($)</label>
                        <input type="number" id="skmChgRecvUsd" class="skm-chg-input" placeholder="0.00" oninput="window.calcSmartChange()" style="border-color: #bae6fd;">
                    </div>
                    <div class="skm-chg-group">
                        <label class="skm-chg-label">ប្រាក់ទទួល (៛)</label>
                        <input type="number" id="skmChgRecvRiel" class="skm-chg-input" placeholder="0" oninput="window.calcSmartChange()" style="border-color: #bae6fd;">
                    </div>
                </div>

                <div id="skmChgResultBox" class="skm-chg-result-box">
                    <div class="skm-chg-label" id="skmChgStatusText" style="color:#10b981; margin-bottom:8px;">ប្រាក់ត្រូវអាប់សរុប៖</div>
                    <div id="skmChgTotalDisp" class="skm-chg-total">$0.00</div>
                    <div id="skmChgMixDisp" class="skm-chg-mix">អាប់លាយគ្នា: $0 និង 0 ៛</div>
                </div>

                <button class="skm-btn-close" onclick="document.getElementById('skmChangeHelperModal').style.display='none'">បិទផ្ទាំង</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // ចុចខាងក្រៅដើម្បីបិទ
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        // ព្យាយាមទាញយកអត្រាដូរប្រាក់ពីប្រព័ន្ធដើម
        const globalRateEl = document.getElementById('globalExchangeRate');
        if(globalRateEl) {
            document.getElementById('skmChgRate').value = globalRateEl.value;
        }
    }

    /* STREAMING_CHUNK:Implementing Smart Dual-Currency Calculation... */
    window.calcSmartChange = function() {
        let total = parseFloat(document.getElementById('skmChgTotal').value) || 0;
        let rate = parseFloat(document.getElementById('skmChgRate').value) || 4000;
        let recvUsd = parseFloat(document.getElementById('skmChgRecvUsd').value) || 0;
        let recvRiel = parseFloat(document.getElementById('skmChgRecvRiel').value) || 0;

        let resBox = document.getElementById('skmChgResultBox');
        let statusText = document.getElementById('skmChgStatusText');
        let totalDisp = document.getElementById('skmChgTotalDisp');
        let mixDisp = document.getElementById('skmChgMixDisp');

        // បម្លែងលុយទទួលសរុបទៅជាដុល្លារ
        let totalRecvUsd = recvUsd + (recvRiel / rate);
        let changeUsd = totalRecvUsd - total;

        // ករណីមិនទាន់វាយបញ្ជូល
        if (total === 0 && recvUsd === 0 && recvRiel === 0) {
            resBox.style.background = 'rgba(16, 185, 129, 0.05)';
            resBox.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            statusText.innerText = 'ប្រាក់ត្រូវអាប់សរុប៖';
            statusText.style.color = '#10b981';
            totalDisp.innerText = '$0.00';
            totalDisp.style.color = '#10b981';
            mixDisp.innerText = 'អាប់លាយគ្នា: $0 និង 0 ៛';
            mixDisp.style.color = '#0ea5e9';
            mixDisp.style.borderColor = '#bae6fd';
            return;
        }

        if (changeUsd < 0) {
            // ករណីខ្វះលុយ
            let shortUsd = Math.abs(changeUsd);
            let shortRiel = Math.round(shortUsd * rate);
            
            resBox.style.background = 'rgba(239, 68, 68, 0.05)';
            resBox.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            statusText.innerText = 'ខ្វះប្រាក់ចំនួន៖';
            statusText.style.color = '#ef4444';
            totalDisp.innerText = `-$${shortUsd.toFixed(2)}`;
            totalDisp.style.color = '#ef4444';
            mixDisp.innerText = `ជាលុយរៀល: ${shortRiel.toLocaleString('en-US')} ៛`;
            mixDisp.style.color = '#ef4444';
            mixDisp.style.borderColor = '#fca5a5';
        } else {
            // ករណីអាប់លុយធម្មតា
            resBox.style.background = 'rgba(16, 185, 129, 0.05)';
            resBox.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            statusText.innerText = 'ប្រាក់ត្រូវអាប់សរុប៖';
            statusText.style.color = '#10b981';
            totalDisp.innerText = `$${changeUsd.toFixed(2)}`;
            totalDisp.style.color = '#10b981';

            // បំបែកជាលុយដុល្លារគត់ និង លុយរៀលសេស
            changeUsd = Math.round(changeUsd * 100) / 100; // កែបញ្ហាទសភាគ (Precision Fix)
            let wholeUsd = Math.floor(changeUsd);
            let fractionUsd = changeUsd - wholeUsd;
            let rielChange = Math.round(fractionUsd * rate);

            // ធ្វើឱ្យលុយរៀលគត់ត្រឹម 100 ៛ (ឧទាហរណ៍ 1199 ទៅជា 1200)
            rielChange = Math.round(rielChange / 100) * 100;

            // បើកាត់កងរួច លុយរៀលឡើងដល់អត្រាដូរប្រាក់ (ឧទាហរណ៍ 4000) អោយបូកចូលដុល្លារវិញ
            if (rielChange >= rate) {
                let addUsd = Math.floor(rielChange / rate);
                wholeUsd += addUsd;
                rielChange = rielChange % rate;
            }

            mixDisp.innerText = `អាប់ជូន: $${wholeUsd} និង ${rielChange.toLocaleString('en-US')} ៛`;
            mixDisp.style.color = '#0ea5e9';
            mixDisp.style.borderColor = '#bae6fd';
        }
    };

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🪙', 'គណនាប្រាក់អាប់រហ័ស', openChangeHelperModal, "🪙 គណនាប្រាក់អាប់ (Change Denomination Helper).js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [43/43] 🪙 ប្រាក់ដើមក្នុងទូរពេលបើកវេន opening_float.js ===
window.skmRegisterBundledPlugin('pos', "🪙 ប្រាក់ដើមក្នុងទូរពេលបើកវេន opening_float.js", function() {
(function() {
    console.log("🪙 POS Opening Float Plugin Initialized!");

    // ១. មុខងារទាញយកឈ្មោះអ្នកប្រើប្រាស់បច្ចុប្បន្ន (សម្រាប់តាមដានអ្នកបញ្ចូលលុយ)
    function getCurrentUser() {
        let username = '';
        
        // ស្វែងរកក្នុង localStorage
        const keys = ['pos_current_user', 'username', 'user_role', 'role', 'user_name'];
        for (let key of keys) {
            let val = localStorage.getItem(key);
            if (val) { username = val; break; }
        }
        
        // ស្កេនទាញយកពីអេក្រង់ផ្ទាល់ (ក្បែរម៉ោង) បើកកក្នុង localStorage អត់ឃើញ
        if (!username) {
            const elements = document.querySelectorAll('*');
            for (let el of elements) {
                if (el.innerText && (el.innerText.includes('👤') || el.innerHTML.includes('fa-user'))) {
                    let text = el.innerText.replace('👤', '').trim();
                    if (text.length > 0 && text.length < 25) { username = text; break; }
                }
            }
        }
        
        // ជម្រើសចុងក្រោយ
        if (!username) {
            const pageText = document.body.innerText;
            if (pageText.includes('អ្នកគ្រប់គ្រងប្រព័ន្ធ')) username = 'អ្នកគ្រប់គ្រងប្រព័ន្ធ';
            else if (pageText.includes('👑 Admin') || pageText.includes('Admin')) username = 'admin';
        }
        
        return username || 'មិនស្គាល់ឈ្មោះ';
    }

    // ២. មុខងារបើកផ្ទាំងបញ្ចូលប្រាក់ដើម
    function openOpeningCashModal() {
        if(document.getElementById('skmOpeningCashModal')) {
            document.getElementById('skmOpeningCashModal').style.display = 'flex';
            loadOpeningCashVal();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmOpeningCashModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.6); z-index: 100000; display: flex; 
            justify-content: center; align-items: center; 
            backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;
        `;
        
        modal.innerHTML = `
            <div id="skmOpeningCashContent" style="background: #ffffff; color: #333333; padding: 25px; border-radius: 16px; width: 400px; display:flex; flex-direction:column; border: 1px solid #e2e8f0; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                
                <!-- ផ្នែកក្បាល -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
                    <h3 style="color:#0284c7; margin:0; font-size:16px; display: flex; align-items: center; gap: 8px;">
                        🪙 ប្រាក់ដើមក្នុងទូរពេលបើកវេន
                    </h3>
                    <button onclick="document.getElementById('skmOpeningCashModal').style.display='none'" style="background:#ef4444; border:none; color:#fff; width:26px; height:26px; border-radius:50%; cursor:pointer; font-weight:bold; display: flex; justify-content: center; align-items: center; font-size: 12px;">✕</button>
                </div>
                
                <!-- ផ្នែកបញ្ចូលទិន្នន័យ -->
                <div style="font-size:13px; color:#64748b; margin-bottom:12px;">កត់ត្រាទឹកប្រាក់ដែលមានស្រាប់ក្នុងទូរមុនពេលចាប់ផ្តើមលក់ថ្ងៃនេះ៖</div>
                <div style="margin-bottom:8px;">
                    <input type="number" id="skmOpeningCashInp" placeholder="0.00" style="width:100%; box-sizing:border-box; padding: 12px; font-size:22px; text-align:center; font-weight:bold; color:#10b981; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; font-family: 'Battambang', sans-serif;">
                </div>
                
                <!-- ផ្នែកបង្ហាញព័ត៌មានអ្នកបញ្ចូល -->
                <div id="skmOpeningCashInfo" style="font-size:11px; color:#94a3b8; text-align:center; margin-bottom:15px; min-height:16px;"></div>

                <!-- ផ្នែកប៊ូតុងខាងក្រោម -->
                <div style="display:flex; gap:10px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                    <button style="flex:1; padding: 10px; border-radius: 8px; cursor: pointer; background: white; border: 1px solid #cbd5e1; color: #475569; font-family: 'Battambang'; font-size: 14px;" onclick="document.getElementById('skmOpeningCashModal').style.display='none'">បិទ</button>
                    <button style="flex:1; padding: 10px; border-radius: 8px; cursor: pointer; background: #0284c7; border: none; color: white; font-family: 'Battambang'; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(2, 132, 199, 0.2);" onclick="window.saveOpeningCash()">💾 កត់ត្រាទុក</button>
                </div>
            </div>
        `;

        // អនុញ្ញាតឱ្យចុចផ្ទៃខាងក្រៅ (Background) ដើម្បីបិទ Modal
        modal.addEventListener('mousedown', function(event) {
            const content = document.getElementById('skmOpeningCashContent');
            if (event.target === modal && !content.contains(event.target)) {
                modal.style.display = 'none';
            }
        });

        document.body.appendChild(modal);
        loadOpeningCashVal();
    }

    // ៣. មុខងារទាញយកទិន្នន័យចាស់មកបង្ហាញ
    function loadOpeningCashVal() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        const today = new Date().toLocaleDateString();
        let saved = JSON.parse(localStorage.getItem(`ks2_${branchId}_opening_cash`) || '{}');
        
        const inputField = document.getElementById('skmOpeningCashInp');
        const infoField = document.getElementById('skmOpeningCashInfo');

        if(saved.date === today && saved.amount !== undefined) {
            inputField.value = saved.amount;
            if(saved.recordedBy && saved.time) {
                infoField.innerHTML = `បញ្ចូលចុងក្រោយដោយ៖ <b>${saved.recordedBy}</b> (ម៉ោង ${saved.time})`;
            } else {
                infoField.innerHTML = '';
            }
        } else {
            inputField.value = ''; // ទុកចំហឱ្យវាយបញ្ចូលថ្មីជានិច្ច
            infoField.innerHTML = '';
        }
        
        // ដាក់ Mouse ឱ្យលោតចូលប្រអប់វាយលេខដោយស្វ័យប្រវត្តិ
        setTimeout(() => inputField.focus(), 100);
    }

    // ៤. មុខងាររក្សាទុកទឹកប្រាក់
    window.saveOpeningCash = function() {
        const inputVal = document.getElementById('skmOpeningCashInp').value;
        const amt = parseFloat(inputVal);
        
        if(inputVal === '' || isNaN(amt) || amt < 0) { 
            alert('សូមបញ្ចូលចំនួនទឹកប្រាក់ដើមឱ្យបានត្រឹមត្រូវ!'); 
            return; 
        }
        
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        const today = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString('km-KH');
        const currentUser = getCurrentUser();
        
        // រក្សាទុកទិន្នន័យរួមបញ្ចូលទាំងអ្នកបញ្ចូល និងម៉ោង
        localStorage.setItem(`ks2_${branchId}_opening_cash`, JSON.stringify({ 
            date: today, 
            amount: amt,
            recordedBy: currentUser,
            time: currentTime
        }));
        
        document.getElementById('skmOpeningCashModal').style.display = 'none';
        if(typeof window.showToast === 'function') {
            window.showToast('បានកត់ត្រាប្រាក់ដើមបើកវេនរួចរាល់!');
        } else {
            alert('បានកត់ត្រាប្រាក់ដើមបើកវេនរួចរាល់!');
        }
    };

    // ៥. រង់ចាំភ្ជាប់ជាមួយ Smart Toolbox Hub (ការពារ Infinite Loop)
    let attempts = 0;
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🪙', 'ប្រាក់ដើមបើកវេន (Opening Float)', openOpeningCashModal, "🪙 ប្រាក់ដើមក្នុងទូរពេលបើកវេន opening_float.js");
            clearInterval(initInt);
            console.log("✅ Opening Float successfully registered to Toolbox!");
        }
        attempts++;
        if (attempts > 20) { // ឈប់ស្វែងរកក្រោយ ១០ វិនាទី
            clearInterval(initInt);
            console.warn("⚠️ Opening Float failed to register: Smart Toolbox not found.");
        }
    }, 500);

})();
});
