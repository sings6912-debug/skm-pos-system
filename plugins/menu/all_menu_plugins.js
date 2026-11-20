/**

 * ============================================================================

 * SKM INTEGRATE MENU - ALL-IN-ONE MENU PLUGINS BUNDLE (51 Toggleable Plugins)

 * File: plugins/menu/all_menu_plugins.js

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

    // Smart Promo Helper: pulls real active promo code from Admin Settings if created, else fallback
    window.skmGetRealPromo = function(fallbackCode, fallbackDesc) {
        try {
            const list = (window.sysSettings && Array.isArray(window.sysSettings.promoCodes)) ? window.sysSettings.promoCodes : [];
            const active = list.filter(p => p && p.code && (!p.limit || (p.usedCount || 0) < p.limit));
            if (active.length > 0) {
                const picked = active[Math.floor(Math.random() * active.length)];
                const desc = picked.type === 'percent'
                    ? `បញ្ចុះតម្លៃ ${picked.value}%`
                    : (picked.type === 'fixed' ? `បញ្ចុះតម្លៃ $${parseFloat(picked.value || 0).toFixed(2)}` : 'ដឹកជញ្ជូនឥតគិតថ្លៃ');
                return { code: picked.code, desc };
            }
        } catch(e) {}
        return { code: fallbackCode, desc: fallbackDesc };
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
// === [CORE] Universal Toolbox Hub.js ===
(function() {
    console.log("⚡ Universal Toolbox Hub (Core System + Global Helpers) Initialized!");
    if(document.getElementById('skm-menu-toolbox')) return;

    /* -------------------------------------------------------------------------
       ១. ប្រព័ន្ធទាញយកពណ៌របស់ហាង (Dynamic Theming) 
       ------------------------------------------------------------------------- */
    const urlParams = new URLSearchParams(window.location.search);
    const branchId = urlParams.get('branch') || 'branch_1';
    
    let sysPrimaryColor = '#0072FF'; // Default ពណ៌ខៀវ
    try {
        const localSys = JSON.parse(localStorage.getItem(`ks2_${branchId}_sys_settings`));
        if (localSys && localSys.primaryColor) sysPrimaryColor = localSys.primaryColor;
    } catch(e) {}

    /* -------------------------------------------------------------------------
       ២. បង្កើតអថេរ CSS សកល (Global CSS Variables) សម្រាប់ឲ្យ Plugin ផ្សេងៗខ្ចីប្រើ
       (ចំណេញកូដខ្លាំង មិនបាច់សរសេរពណ៌ និង Dark Mode រាល់ដងទេ)
       ------------------------------------------------------------------------- */
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            /* អថេរពណ៌ដែលអាចយកទៅប្រើគ្រប់ Plugin ទាំងអស់ */
            --skm-primary: ${sysPrimaryColor};
            
            /* Light Mode Default */
            --skm-bg-glass: rgba(255, 255, 255, 0.85);
            --skm-bg-solid: #ffffff;
            --skm-text-main: #0F172A;
            --skm-text-sub: #64748B;
            --skm-border: rgba(226, 232, 240, 0.8);
            --skm-hover-bg: #F8FAFC;
            --skm-shadow-light: 0 4px 15px rgba(0,0,0,0.03);
            --skm-shadow-heavy: 0 30px 60px rgba(15, 23, 42, 0.15);
        }

        /* Auto Dark Mode (សម្របតាមទូរស័ព្ទភ្ញៀវ) */
        @media (prefers-color-scheme: dark) {
            :root {
                --skm-bg-glass: rgba(30, 41, 59, 0.85);
                --skm-bg-solid: #1E293B;
                --skm-text-main: #F8FAFC;
                --skm-text-sub: #94A3B8;
                --skm-border: rgba(51, 65, 85, 0.8);
                --skm-hover-bg: #334155;
                --skm-shadow-light: 0 4px 15px rgba(0,0,0,0.2);
                --skm-shadow-heavy: 0 30px 60px rgba(0, 0, 0, 0.5);
            }
        }

        /* -------------------------------------------------------------------------
           ៣. រចនាប័ទ្មរបស់ Toolbox ផ្ទាល់ (ប្រើប្រាស់អថេរខាងលើ)
           ------------------------------------------------------------------------- */
        .skm-menu-toolbox-container {
            position: fixed; bottom: 95px; left: 20px; z-index: 88000;
            font-family: 'Inter', 'Battambang', sans-serif;
        }
        
        .skm-menu-master-fab {
            width: 58px; height: 58px; border-radius: 50%; 
            background: var(--skm-primary);
            color: #fff; border: 2px solid rgba(255,255,255,0.2); font-size: 24px; cursor: pointer;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25); display: flex;
            justify-content: center; align-items: center; 
            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.1);
        }
        .skm-menu-master-fab:active { transform: scale(0.9) !important; }

        .skm-menu-toolbox-popup {
            position: absolute; bottom: calc(100% + 15px); left: 0; z-index: 88995;
            background: var(--skm-bg-glass);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--skm-border);
            width: 340px; max-width: 90vw; max-height: calc(100vh - 190px); border-radius: 28px; 
            box-shadow: var(--skm-shadow-heavy);
            display: none; flex-direction: column; overflow: hidden;
            transform-origin: bottom left;
            opacity: 0;
        }
        .skm-menu-toolbox-popup.show { 
            display: flex; 
            animation: skmMenuPopUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.05) forwards; 
        }
        @keyframes skmMenuPopUp {
            0% { opacity: 0; transform: scale(0.85) translateY(20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .skm-menu-toolbox-header {
            padding: 16px 20px; font-weight: 700; font-size: 15px; color: var(--skm-text-main);
            border-bottom: 1px solid var(--skm-border); 
            display: flex; justify-content: space-between; align-items: center;
            flex-shrink: 0; background: rgba(0,0,0,0.02);
        }

        .skm-close-btn {
            cursor: pointer; width: 32px; height: 32px; display: flex; 
            align-items: center; justify-content: center; background: rgba(100,116,139,0.1); 
            border-radius: 50%; transition: all 0.2s ease; font-size: 14px; color: var(--skm-text-sub);
        }
        .skm-close-btn:active { transform: scale(0.9); }

        .skm-scroll-area { 
            padding: 12px; display: flex; flex-direction: column; gap: 10px; 
            overflow-y: auto; flex: 1; min-height: 0; scroll-behavior: smooth;
        }
        .skm-scroll-area::-webkit-scrollbar { width: 4px; }
        .skm-scroll-area::-webkit-scrollbar-thumb { background: var(--skm-border); border-radius: 10px; }

        .skm-tool-row {
            display: flex; align-items: center; justify-content: space-between;
            background: var(--skm-bg-solid); border: 1px solid var(--skm-border); 
            border-radius: 18px; padding: 10px 14px; 
            transition: transform 0.15s ease, border-color 0.2s;
            box-shadow: var(--skm-shadow-light);
        }
        .skm-tool-row:active { transform: scale(0.98); border-color: var(--skm-primary); }

        .skm-tool-main-btn {
            background: transparent; border: none; color: var(--skm-text-main);
            padding: 4px 0; cursor: pointer; text-align: left;
            font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 14px;
            font-family: inherit; flex: 1; outline: none;
        }
        
        .skm-tool-actions { display: flex; gap: 8px; align-items: center; }
        .skm-action-btn {
            width: 30px; height: 30px; border-radius: 10px; border: none; background: rgba(100,116,139,0.1);
            cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;
            transition: all 0.2s; color: var(--skm-text-sub); outline: none;
        }
        .skm-action-btn:active { transform: scale(0.9); }
        .skm-action-btn.active-pin { color: #F59E0B; background: rgba(245, 158, 11, 0.15); }
        .skm-action-btn.active-hide { color: #EF4444; background: rgba(239, 68, 68, 0.15); }

        .skm-section-title {
            font-size: 11px; font-weight: 800; color: var(--skm-text-sub);
            margin: 12px 0 4px 8px; text-transform: uppercase; letter-spacing: 1px;
        }
        
        .skm-hidden-toggle {
            background: transparent; border: 1.5px dashed var(--skm-border); color: var(--skm-text-sub);
            padding: 12px; border-radius: 16px; font-size: 13px; font-weight: 600;
            cursor: pointer; font-family: inherit; margin-top: 10px; transition: all 0.2s;
        }
        .skm-hidden-toggle:active { transform: scale(0.98); background: var(--skm-hover-bg); }
        
        #skmHiddenZone { display: none; flex-direction: column; gap: 10px; margin-top: 10px; }
        #skmHiddenZone.show { display: flex; }
    `;
    document.head.appendChild(style);

    /* -------------------------------------------------------------------------
       ៤. បង្កើត UI របស់ Toolbox
       ------------------------------------------------------------------------- */
    const container = document.createElement('div');
    container.className = 'skm-menu-toolbox-container';
    container.id = 'skm-menu-toolbox';
    container.innerHTML = `
        <button class="skm-menu-master-fab" id="skmMenuMasterFab" title="បណ្ដុំមុខងារពិសេស">
            <span style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">⚡</span>
        </button>
        <div class="skm-menu-toolbox-popup" id="skmMenuToolboxPopup">
            <div class="skm-menu-toolbox-header">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="color: var(--skm-primary); font-size: 18px;">✦</span>
                    <span>Quick Tools</span>
                </div>
                <span class="skm-close-btn" id="skmMenuCloseBtn">✕</span>
            </div>
            
            <div class="skm-scroll-area" id="skmMenuToolboxMenuBody">
                <div id="skmPinnedSection" style="display:none;">
                    <div class="skm-section-title">📌 បានខ្ទាស់ (Pinned)</div>
                    <div id="skmPinnedZone" style="display: flex; flex-direction: column; gap: 10px;"></div>
                </div>
                
                <div id="skmNormalSection">
                    <div class="skm-section-title" id="skmNormalTitle" style="display:none;">✨ មុខងារផ្សេងៗ</div>
                    <div id="skmNormalZone" style="display: flex; flex-direction: column; gap: 10px;"></div>
                </div>

                <div id="skmHiddenSection" style="display:none;">
                    <button class="skm-hidden-toggle" id="btnToggleHidden">👁️ បង្ហាញមុខងារដែលបានលាក់</button>
                    <div id="skmHiddenZone"></div>
                </div>
            </div>
        </div>
    `;
    container.style.display = 'none';
    document.body.appendChild(container);

    /* -------------------------------------------------------------------------
       ៥. MASKING & LOGIC: ចងក្រងបញ្ជី និង Render
       ------------------------------------------------------------------------- */
    window.skmRegisteredToolsList = [];

    function getToolPrefs() {
        try { return JSON.parse(localStorage.getItem('skm_universal_toolbox_prefs')) || {}; } 
        catch(e) { return {}; }
    }
    
    function saveToolPref(toolName, state) {
        let prefs = getToolPrefs();
        if (state === 'normal') delete prefs[toolName];
        else prefs[toolName] = state;
        localStorage.setItem('skm_universal_toolbox_prefs', JSON.stringify(prefs));
        renderToolboxUI(); 
    }

    function renderToolboxUI() {
        const pinnedZone = document.getElementById('skmPinnedZone');
        const normalZone = document.getElementById('skmNormalZone');
        const hiddenZone = document.getElementById('skmHiddenZone');
        
        pinnedZone.innerHTML = ''; normalZone.innerHTML = ''; hiddenZone.innerHTML = '';
        let prefs = getToolPrefs();
        let hasPinned = false, hasNormal = false, hasHidden = false;

        const enabledMenuSet = window.__SKM_ENABLED_SETS__ && window.__SKM_ENABLED_SETS__.menu;
        let visibleToolsCount = 0;
        window.skmRegisteredToolsList.forEach((tool, index) => {
            if (tool.pluginKey && enabledMenuSet && !enabledMenuSet.has(tool.pluginKey)) return;
            visibleToolsCount++;
            let state = prefs[tool.text] || 'normal';
            
            const row = document.createElement('div');
            row.className = 'skm-tool-row';
            
            let pinIcon = state === 'pinned' ? '📌' : '📍';
            let pinClass = state === 'pinned' ? 'active-pin' : '';
            let pinAction = state === 'pinned' ? 'normal' : 'pinned';
            
            let hideIcon = state === 'hidden' ? '🔄' : '👁️‍🗨️';
            let hideClass = state === 'hidden' ? 'active-hide' : '';
            let hideAction = state === 'hidden' ? 'normal' : 'hidden';

            row.innerHTML = `
                <button class="skm-tool-main-btn" onclick="window.skmRunToolAction(${index})">
                    <span style="font-size:18px;">${tool.icon}</span> 
                    <span>${tool.text}</span>
                </button>
                <div class="skm-tool-actions">
                    <button class="skm-action-btn ${pinClass}" onclick="event.stopPropagation(); window.skmSetToolState('${tool.text}', '${pinAction}')">${pinIcon}</button>
                    <button class="skm-action-btn ${hideClass}" onclick="event.stopPropagation(); window.skmSetToolState('${tool.text}', '${hideAction}')">${hideIcon}</button>
                </div>
            `;

            if (state === 'pinned') { pinnedZone.appendChild(row); hasPinned = true; }
            else if (state === 'hidden') { hiddenZone.appendChild(row); hasHidden = true; }
            else { normalZone.appendChild(row); hasNormal = true; }
        });

        document.getElementById('skmPinnedSection').style.display = hasPinned ? 'block' : 'none';
        document.getElementById('skmNormalTitle').style.display = hasPinned && hasNormal ? 'block' : 'none';
        document.getElementById('skmHiddenSection').style.display = hasHidden ? 'block' : 'none';
        container.style.display = visibleToolsCount > 0 ? 'block' : 'none';
        const popupEl = document.getElementById('skmMenuToolboxPopup'); if (visibleToolsCount === 0 && popupEl) popupEl.classList.remove('show');
    }

    window.skmRunToolAction = function(index) {
        const popup = document.getElementById('skmMenuToolboxPopup');
        if(popup) popup.classList.remove('show');
        if(window.skmRegisteredToolsList[index] && typeof window.skmRegisteredToolsList[index].onClickFunc === 'function') {
            window.skmRegisteredToolsList[index].onClickFunc();
        }
    };

    window.skmSetToolState = function(toolName, newState) { saveToolPref(toolName, newState); };

    window.__SKM_REFRESH_MENU_TOOLBOX__ = renderToolboxUI;
    window.registerMenuTool = function(icon, text, onClickFunc, explicitKey) {
        const pluginKey = explicitKey || window.__SKM_CURRENT_PLUGIN_KEY__ || null;
        if (window.skmRegisteredToolsList.some(t => t.text === text)) return;
        window.skmRegisteredToolsList.push({ icon, text, onClickFunc, pluginKey });
        renderToolboxUI(); 
    };

    /* -------------------------------------------------------------------------
       ៦. ប្រព័ន្ធ Drag & Drop (រំកិលបាន)
       ------------------------------------------------------------------------- */
    const fab = document.getElementById('skmMenuMasterFab');
    const popup = document.getElementById('skmMenuToolboxPopup');
    
    let isDragging = false, dragMoved = false;
    let startX, startY, initialLeft, initialTop;

    try {
        const savedPos = JSON.parse(localStorage.getItem('skm_toolbox_pos'));
        if (savedPos && savedPos.left && savedPos.top) {
            container.style.bottom = 'auto';
            container.style.left = savedPos.left;
            container.style.top = savedPos.top;
            updatePopupPosition(parseFloat(savedPos.left), parseFloat(savedPos.top));
        }
    } catch(e) {}

    function updatePopupPosition(x, y) {
        if (x > window.innerWidth / 2) {
            popup.style.left = 'auto'; popup.style.right = '0';
            popup.style.transformOrigin = popup.style.transformOrigin.replace('left', 'right') || 'bottom right';
        } else {
            popup.style.left = '0'; popup.style.right = 'auto';
            popup.style.transformOrigin = popup.style.transformOrigin.replace('right', 'left') || 'bottom left';
        }
        
        if (y < window.innerHeight / 2) {
            popup.style.bottom = 'auto'; popup.style.top = 'calc(100% + 15px)';
            popup.style.transformOrigin = popup.style.transformOrigin.replace('bottom', 'top');
        } else {
            popup.style.top = 'auto'; popup.style.bottom = 'calc(100% + 15px)';
            popup.style.transformOrigin = popup.style.transformOrigin.replace('top', 'bottom');
        }
    }

    function dragStart(e) {
        if(e.button !== 0 && e.type !== 'touchstart') return; 
        isDragging = true; dragMoved = false;
        const rect = container.getBoundingClientRect();
        container.style.bottom = 'auto'; container.style.right = 'auto';
        container.style.left = rect.left + 'px'; container.style.top = rect.top + 'px';
        if (e.type === 'touchstart') { startX = e.touches[0].clientX; startY = e.touches[0].clientY; } 
        else { startX = e.clientX; startY = e.clientY; }
        initialLeft = rect.left; initialTop = rect.top;
        fab.style.transition = 'none'; 
    }

    function drag(e) {
        if (!isDragging) return;
        let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        let clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const dx = clientX - startX, dy = clientY - startY;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            dragMoved = true;
            if(e.cancelable) e.preventDefault(); 
        }

        if (dragMoved) {
            let newLeft = initialLeft + dx, newTop = initialTop + dy;
            const maxX = window.innerWidth - fab.offsetWidth, maxY = window.innerHeight - fab.offsetHeight;
            newLeft = Math.min(Math.max(0, newLeft), maxX);
            newTop = Math.min(Math.max(0, newTop), maxY);
            container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';
            updatePopupPosition(newLeft, newTop);
        }
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        fab.style.transition = 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.1)'; 
        if (dragMoved) {
            localStorage.setItem('skm_toolbox_pos', JSON.stringify({ left: container.style.left, top: container.style.top }));
        }
    }

    fab.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    fab.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);

    /* -------------------------------------------------------------------------
       ៧. GLOBAL UTILITIES: មុខងារទប់ការចុចខាងក្រៅ (កុំឲ្យ Plugin ក្រោយៗសរសេរកូដដដែលៗ)
       ------------------------------------------------------------------------- */
    
    // បើក/បិទ ផ្ទាំង Toolbox នេះផ្ទាល់
    fab.onclick = (e) => { e.stopPropagation(); if (!dragMoved) popup.classList.toggle('show'); };
    document.getElementById('skmMenuCloseBtn').onclick = () => popup.classList.remove('show');
    
    // មុខងារចុចលើផ្ទៃខាងក្រៅ (Click Outside) សម្រាប់បិទផ្ទាំង Toolbox នេះ
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) popup.classList.remove('show');
    });

    document.getElementById('btnToggleHidden').onclick = function(e) {
        e.stopPropagation();
        const hz = document.getElementById('skmHiddenZone');
        hz.classList.toggle('show');
        this.innerText = hz.classList.contains('show') ? 'បង្រួមមុខងារដែលបានលាក់ ⬆️' : '👁️ បង្ហាញមុខងារដែលបានលាក់';
    };

    // មុខងារសកល (Global Tool) ដែលអនុញ្ញាតឲ្យ Plugin ផ្សេងៗហៅប្រើដើម្បីបិទ Modal
    // ឧទាហរណ៍៖ window.skmRegisterOutsideClick('modalBgId', មុខងារបិទ)
    window.skmRegisterOutsideClick = function(bgId, closeFunction) {
        const bg = document.getElementById(bgId);
        if (bg) {
            bg.onclick = function(e) {
                // បើចុចចំផ្ទៃព្រាលៗខាងក្រៅ វានឹងដំណើរការមុខងារបិទដែលផ្តល់ឲ្យ
                if (e.target === bg && typeof closeFunction === 'function') {
                    closeFunction();
                }
            };
        }
    };

})();

;
// === [1/51] 3d_3d_hologram_showcase.js ===
window.skmRegisterBundledPlugin('menu', "3d_3d_hologram_showcase.js", function() {
(function() {
    console.log("🔮 Menu 3D Hologram & Particle Showcase Plugin Initialized!");

    function openHologramModal() {
        if(document.getElementById('skmHologramModal')) {
            document.getElementById('skmHologramModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmHologramModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(10px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: rgba(15,23,42,0.9); color: #fff; padding: 20px; border-radius: 24px; width: 100%; max-width: 440px; text-align: center; border: 1px solid rgba(6,182,212,0.4); box-shadow: 0 0 50px rgba(6,182,212,0.3); position: relative;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #06b6d4; margin:0;"><i class="fa-solid fa-cube"></i> ផ្ទាំងបង្ហាញទំនិញ 3D ហូឡូក្រាម</h3>
                    <button onclick="document.getElementById('skmHologramModal').style.display='none'" style="background:rgba(239,68,68,0.2); border:1px solid #ef4444; color:#ef4444; width:28px; height:28px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
                </div>
                <p style="font-size: 11px; color: #94a3b8; margin-bottom: 12px;">ប្រើប្រាស់ Mouse ដើម្បីបង្វិលមើលទំនិញក្នុងលំហ 3D ហូឡូក្រាម៖</p>
                
                <div id="threeJsCanvasContainer" style="width: 100%; height: 300px; border-radius: 16px; background: #090d16; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px; position: relative;"></div>

                <button class="btn-act btn-green" style="width: 100%; background: linear-gradient(135deg, #06b6d4, #2563eb); border: none; border-radius: 14px; padding: 12px; font-weight: bold;" onclick="document.getElementById('skmHologramModal').style.display='none'">បិទផ្ទាំង 3D</button>
            </div>
        `;
        document.body.appendChild(modal);

        loadThreeJsAndInit();
    }

    function loadThreeJsAndInit() {
        if (window.THREE) {
            initThreeScene();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => {
            initThreeScene();
        };
        document.head.appendChild(script);
    }

    function initThreeScene() {
        const container = document.getElementById('threeJsCanvasContainer');
        if (!container || container.children.length > 0) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x06b6d4, 2, 50);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Create a glowing 3D Hologram Cube / Product Shape
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            roughness: 0.2,
            metalness: 0.8,
            wireframe: false
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Add wireframe outer shell
        const wireGeometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
        const wireMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.4 });
        const wireCube = new THREE.Mesh(wireGeometry, wireMaterial);
        scene.add(wireCube);

        camera.position.z = 5;

        // Mouse interaction for rotation
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        container.onmousedown = (e) => { isDragging = true; previousMousePosition = { x: e.clientX, y: e.clientY }; };
        container.onmousemove = (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            cube.rotation.y += deltaX * 0.01;
            cube.rotation.x += deltaY * 0.01;
            wireCube.rotation.y = cube.rotation.y;
            wireCube.rotation.x = cube.rotation.x;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        };
        window.onmouseup = () => { isDragging = false; };

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            if (!isDragging) {
                cube.rotation.y += 0.01;
                cube.rotation.x += 0.005;
                wireCube.rotation.y = cube.rotation.y;
                wireCube.rotation.x = cube.rotation.x;
            }
            renderer.render(scene, camera);
        }
        animate();
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔮', 'បង្ហាញទំនិញ 3D ហូឡូក្រាម', openHologramModal, "3d_3d_hologram_showcase.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [2/51] achievement_badges.js ===
window.skmRegisterBundledPlugin('menu', "achievement_badges.js", function() {
(function() {
    console.log("🏅 Menu Loyalty Achievement Badges Plugin Initialized!");

    function openBadgesModal() {
        if(document.getElementById('skmBadgesModal')) {
            document.getElementById('skmBadgesModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmBadgesModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">🏅</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">ពានរង្វាន់ & មដាល់សមិទ្ធផល</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">មដាល់ដែលអ្នកទទួលបានពីការកុម្មង់ប្រចាំហាង៖</p>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px; text-align: left;">
                    <div style="background: rgba(245,158,11,0.08); border: 1px solid #f59e0b; padding: 12px; border-radius: 14px; text-align: center;">
                        <div style="font-size: 28px; margin-bottom: 4px;">☕</div>
                        <b style="color: #f59e0b; font-size: 12px; display: block;">Coffee Master</b>
                        <span style="font-size: 10px; color: #10b981; font-weight: bold;">[ដោះសោររួច]</span>
                    </div>
                    <div style="background: rgba(128,128,128,0.06); border: 1px solid var(--border-color); padding: 12px; border-radius: 14px; text-align: center; opacity: 0.6;">
                        <div style="font-size: 28px; margin-bottom: 4px;">🍜</div>
                        <b style="color: var(--text-dark); font-size: 12px; display: block;">Spicy King</b>
                        <span style="font-size: 10px; color: var(--text-muted);">[បន្តកុម្មង់ ៥ ដង]</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmBadgesModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🏅', 'ពានរង្វាន់ & សមិទ្ធផល (Badges)', openBadgesModal, "achievement_badges.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [3/51] ai_gemini_ai_concierge.js ===
window.skmRegisterBundledPlugin('menu', "ai_gemini_ai_concierge.js", function() {
(function() {
    console.log("🤖 Menu Gemini AI Concierge Plugin Initialized!");

    function openGeminiConciergeModal() {
        if(document.getElementById('skmGeminiModal')) {
            document.getElementById('skmGeminiModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmGeminiModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 420px; text-align: center; border: 1px solid rgba(56,189,248,0.3); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px; animation: aiPulse 2s infinite;">✨</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ជំនួយការ AI ឆ្លាតវៃ (Gemini Concierge)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">សួរសំណួរ ឬប្រាប់ពីអារម្មណ៍/ចំណង់ចំណូលចិត្តរបស់អ្នកថ្ងៃនេះ៖</p>
                
                <div id="aiConciergeChatBox" style="background: rgba(15,23,42,0.6); border: 1px solid var(--border-color); padding: 12px; border-radius: 16px; height: 180px; overflow-y: auto; margin-bottom: 12px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 8px;">
                    <div style="background: rgba(56,189,248,0.15); padding: 10px; border-radius: 12px; border: 1px solid rgba(56,189,248,0.3);">🤖 សួស្តី! ខ្ញុំជាជំនួយការ AI ផ្ទាល់ខ្លួនរបស់អ្នក។ តើថ្ងៃនេះលោកអ្នកចង់ញ៉ាំអ្វី ឬរកទំនិញបែបណាដែរ?</div>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <input type="text" id="aiConciergeInput" placeholder="ឧ. ចង់រកកាហ្វេផ្អែមស្រទន់ ឬម្ហូបជួយឱ្យស្រស់ស្រាយ..." style="flex: 1; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 12px; color: #fff; font-size: 12px; outline: none; font-family: 'Battambang';" onkeydown="if(event.key==='Enter') window.sendGeminiConciergeQuery()">
                    <button onclick="window.sendGeminiConciergeQuery()" style="background: linear-gradient(135deg, #38bdf8, #2563eb); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">បញ្ជូន</button>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmGeminiModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes aiPulse {
                0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(56,189,248,0.5)); }
                50% { transform: scale(1.1); filter: drop-shadow(0 0 20px rgba(56,189,248,0.9)); }
            }
        `;
        document.head.appendChild(style);
    }

    window.sendGeminiConciergeQuery = async function() {
        const inp = document.getElementById('aiConciergeInput');
        const box = document.getElementById('aiConciergeChatBox');
        const q = inp.value.trim();
        if(!q) return;

        box.innerHTML += `<div style="background: rgba(56,189,248,0.25); padding: 10px; border-radius: 12px; align-self: flex-end; max-width: 85%;">👤 ${q}</div>`;
        inp.value = '';
        box.scrollTop = box.scrollHeight;

        const loadingId = 'aiLoading_' + Date.now();
        box.innerHTML += `<div id="${loadingId}" style="background: rgba(255,255,255,0.08); padding: 10px; border-radius: 12px; max-width: 85%;">🤖 កំពុងគិត និងវិភាគ...</div>`;
        box.scrollTop = box.scrollHeight;

        function getDynamicGeminiKey() {
            if (window.GEMINI_API_KEY && String(window.GEMINI_API_KEY).trim()) return String(window.GEMINI_API_KEY).trim();
            const br = new URLSearchParams(window.location.search).get('branch') || 'HENG';
            try {
                const localSys = JSON.parse(localStorage.getItem(`ks2_${br}_sys_settings`) || '{}');
                const k = (window.sysSettings && (window.sysSettings.geminiApiKey || window.sysSettings.aiApiKey)) || localSys.geminiApiKey || localSys.aiApiKey || '';
                return String(k || '').trim();
            } catch (err) {
                return '';
            }
        }

        function buildSmartMenuFallback(queryText) {
            const items = Array.isArray(window.inventory) ? window.inventory.filter(p => p && (Number(p.qty ?? 1) > 0)) : [];
            if (!items.length) {
                return "ថ្ងៃនេះយើងខ្ញុំសូមណែនាំមុខទំនិញពិសេស និងភេសជ្ជៈស្រស់ប្រចាំហាងដែលពេញនិយមបំផុត!";
            }
            const ql = queryText.toLowerCase();
            const matched = items.filter(p => {
                const n = String(p.name || '').toLowerCase();
                const c = String(p.category || '').toLowerCase();
                return n.includes(ql) || c.includes(ql) ||
                    ((ql.includes('កាហ្វេ') || ql.includes('coffee')) && (n.includes('coffee') || n.includes('latte') || n.includes('កាហ្វេ'))) ||
                    ((ql.includes('តែ') || ql.includes('tea')) && (n.includes('tea') || n.includes('matcha') || n.includes('តែ'))) ||
                    ((ql.includes('ត្រជាក់') || ql.includes('iced')) && (n.includes('iced') || n.includes('ត្រជាក់')));
            });
            const picks = (matched.length ? matched : items).slice(0, 3);
            const listStr = picks.map((p, idx) => `${idx + 1}. <b>${p.name}</b> ($${Number(p.price || 0).toFixed(2)})`).join('<br>');
            return `សូមណែនាំមុខទំនិញដែលស័ក្តិសមបំផុតសម្រាប់អ្នក៖<br>${listStr}`;
        }

        try {
            const itemsList = Array.isArray(window.inventory) ? window.inventory.filter(p => p && (Number(p.qty ?? 1) > 0)) : [];
            let invSummary = itemsList.slice(0, 25).map(p => `${p.name} ($${Number(p.price || 0).toFixed(2)})`).join(', ');
            const apiKey = getDynamicGeminiKey();

            if (!apiKey) {
                const fallbackHtml = buildSmartMenuFallback(q);
                document.getElementById(loadingId)?.remove();
                box.innerHTML += `<div style="background: rgba(255,255,255,0.08); padding: 10px; border-radius: 12px; max-width: 85%;">🤖 ${fallbackHtml}</div>`;
                box.scrollTop = box.scrollHeight;
                return;
            }

            const systemPrompt = "Act as an expert culinary sommelier and shop concierge for a digital menu store. Recommend 2-3 items in natural Khmer based on customer request. Available items: " + (invSummary || "Coffee, Food, Drinks");
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

            const payload = {
                contents: [{ parts: [{ text: q }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            };

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            const candidate = result.candidates?.[0];
            let replyText = buildSmartMenuFallback(q);

            if (candidate && candidate.content?.parts?.[0]?.text) {
                replyText = candidate.content.parts[0].text;
            }

            document.getElementById(loadingId)?.remove();
            box.innerHTML += `<div style="background: rgba(255,255,255,0.08); padding: 10px; border-radius: 12px; max-width: 85%;">🤖 ${replyText}</div>`;
            box.scrollTop = box.scrollHeight;
        } catch(e) {
            document.getElementById(loadingId)?.remove();
            const fallbackHtml = buildSmartMenuFallback(q);
            box.innerHTML += `<div style="background: rgba(255,255,255,0.08); padding: 10px; border-radius: 12px; max-width: 85%;">🤖 ${fallbackHtml}</div>`;
            box.scrollTop = box.scrollHeight;
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('✨', 'ជំនួយការ AI ឆ្លាតវៃ (Gemini)', openGeminiConciergeModal, "ai_gemini_ai_concierge.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [4/51] ar_ar_guide.js ===
window.skmRegisterBundledPlugin('menu', "ar_ar_guide.js", function() {
(function() {
    console.log("📱 Menu AR Preview & Simulation Guide Plugin Initialized!");

    function openArPreviewModal() {
        if(document.getElementById('skmArModal')) {
            document.getElementById('skmArModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmArModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">📱</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">មើលមុខម្ហូបបែប AR (Augmented Reality)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">សាកល្បងដាក់បង្ហាញមុខម្ហូបនៅលើតុរបស់អ្នកតាមរយៈកាមេរ៉ា AR៖</p>
                
                <div style="background: rgba(56,189,248,0.08); border: 1px dashed #38bdf8; padding: 20px; border-radius: 16px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 6px;">📷</div>
                    <div style="font-size: 12px; font-weight: bold; color: #38bdf8;">ស្កេនកូដ ឬចុចប៊ូតុងខាងក្រោមដើម្បីបើក AR View</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #38bdf8; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.launchArCameraSimulation()">✨ បើកកាមេរ៉ា AR លើតុ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmArModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.launchArCameraSimulation = function() {
        if (typeof showToast === 'function') showToast('📱 កំពុងបើកប្រព័ន្ធ AR លើតុរបស់អ្នក...');
        document.getElementById('skmArModal').style.display = 'none';
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📱', 'មើលម្ហូបបែប AR (AR View)', openArPreviewModal, "ar_ar_guide.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [5/51] budget_finder.js ===
window.skmRegisterBundledPlugin('menu', "budget_finder.js", function() {
(function() {
    console.log("💵 Menu Budget Finder Plugin Initialized!");

    function openBudgetModal() {
        if(document.getElementById('skmBudgetModal')) {
            document.getElementById('skmBudgetModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmBudgetModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">💵</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">ស្វែងរកទំនិញតាមថវិកា</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">បញ្ចូលទឹកប្រាក់ថវិកាដែលអ្នកចង់ចំណាយថ្ងៃនេះ៖</p>
                
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <input type="number" id="budgetInput" placeholder="ឧ. 5.00 ឬ 10.00..." style="flex: 1; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 12px; color: #fff; font-size: 13px; outline: none; font-family: 'Battambang';" onkeydown="if(event.key==='Enter') window.filterByBudget()">
                    <button onclick="window.filterByBudget()" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">ស្វែងរក</button>
                </div>

                <div id="budgetResultContainer" style="max-height: 220px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 6px; text-align: left; font-size: 12px;">
                    <div style="text-align:center; padding:20px; color:var(--text-muted);">សូមបញ្ចូលថវិកាខាងលើដើម្បីស្វែងរកទំនិញ</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmBudgetModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.filterByBudget = function() {
        const inp = document.getElementById('budgetInput');
        const container = document.getElementById('budgetResultContainer');
        const maxBudget = parseFloat(inp.value);

        if (isNaN(maxBudget) || maxBudget <= 0) {
            container.innerHTML = '<div style="text-align:center; color:#ef4444; padding:15px;">សូមបញ្ចូលទឹកប្រាក់ថវិកាឱ្យបានត្រឹមត្រូវ!</div>';
            return;
        }

        let inv = window.inventory || [];
        let matching = inv.filter(p => (parseFloat(p.price) || 0) <= maxBudget);

        if (matching.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:15px;">គ្មានទំនិញក្នុងថវិកានេះទេ (ទំនិញទាំងអស់មានតម្លៃថ្លៃជាងនេះ)</div>';
            return;
        }

        container.innerHTML = matching.map(p => `
            <div style="background: rgba(16,185,129,0.06); border: 1px solid var(--border-color); padding: 10px 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${p.image || 'https://placehold.co/40'}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 8px; background: #fff;">
                    <div>
                        <b style="color: #10b981; display: block; font-size: 12px; max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</b>
                        <span style="font-size: 11px; color: var(--text-dark); font-weight: 900;">$${parseFloat(p.price || 0).toFixed(2)}</span>
                    </div>
                </div>
                <button onclick="window.openProductByName('${p.name}'); document.getElementById('skmBudgetModal').style.display='none';" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">មើល</button>
            </div>
        `).join('');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💵', 'ស្វែងរកទំនិញតាមថវិកា (Budget Finder)', openBudgetModal, "budget_finder.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [6/51] calorie_burn_calculator.js ===
window.skmRegisterBundledPlugin('menu', "calorie_burn_calculator.js", function() {
(function() {
    console.log("🏃 Menu Calorie Burn Calculator Plugin Initialized!");

    function openCalorieBurnModal() {
        if(document.getElementById('skmBurnModal')) {
            document.getElementById('skmBurnModal').style.display = 'flex';
            calcBurnTime();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmBurnModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 38px; margin-bottom: 5px;">🏃</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">គណនាពេលវេលាដុតកាឡូរី</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ពេលវេលាត្រូវហាត់ប្រាណដើម្បីដុតកាឡូរីក្នុងកន្ត្រក៖</p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 8px;" id="burnDetailsBox">
                    <div>🚶 <b>ដើរលឿន (Walking):</b> <span id="burnWalk" style="color: #10b981; font-weight: bold;">0 នាទី</span></div>
                    <div>🏃 <b>រត់ហាត់ប្រាណ (Jogging):</b> <span id="burnRun" style="color: #f59e0b; font-weight: bold;">0 នាទី</span></div>
                    <div>🚴 <b>ជិះកង់ (Cycling):</b> <span id="burnCycle" style="color: #38bdf8; font-weight: bold;">0 នាទី</span></div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px; text-align: left;">
                    💡 ការគណនានេះផ្អែកលើបរិមាណកាឡូរីប៉ាន់ស្មាននៃទំនិញសរុបក្នុងកន្ត្រករបស់អ្នក។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmBurnModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        calcBurnTime();
    }

    function calcBurnTime() {
        let totalItems = 0;
        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
            cart.forEach(item => {
                totalItems += parseInt(item.qty || 1);
            });
        }

        // ឧបមា ១ មុខ = 250 kcal
        let totalCals = totalItems * 250;
        if (totalCals === 0) totalCals = 250; // Default 1 item equivalent

        // Burn rates: Walk ~4 kcal/min, Run ~10 kcal/min, Cycle ~7 kcal/min
        let walkMins = Math.round(totalCals / 4);
        let runMins = Math.round(totalCals / 10);
        let cycleMins = Math.round(totalCals / 7);

        const walkEl = document.getElementById('burnWalk');
        const runEl = document.getElementById('burnRun');
        const cycleEl = document.getElementById('burnCycle');

        if (walkEl) walkEl.innerText = `${walkMins} នាទី`;
        if (runEl) runEl.innerText = `${runMins} នាទី`;
        if (cycleEl) cycleEl.innerText = `${cycleMins} នាទី`;
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🏃', 'គណនាពេលវេលាដុតកាឡូរី (Calorie Burn)', openCalorieBurnModal, "calorie_burn_calculator.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [7/51] camera_barcode_scanner.js ===
window.skmRegisterBundledPlugin('menu', "camera_barcode_scanner.js", function() {
(function() {
    console.log("📷 Menu Camera Barcode Scanner Plugin Initialized!");

    function openCameraScannerModal() {
        if(document.getElementById('skmScanModal')) {
            document.getElementById('skmScanModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmScanModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">📷</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">ស្វែងរកទំនិញតាមបាកូដ (Scanner)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">បញ្ចូលលេខកូដទំនិញ ឬ Barcode ដើម្បីស្វែងរកភ្លាមៗ៖</p>
                
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <input type="text" id="scanCodeInput" placeholder="ឧ. SKM-102938..." style="flex: 1; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 12px; color: #fff; font-size: 12px; outline: none; font-family: 'Battambang';" onkeydown="if(event.key==='Enter') window.executeScanLookup()">
                    <button onclick="window.executeScanLookup()" style="background: linear-gradient(135deg, #38bdf8, #2563eb); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">ស្វែងរក</button>
                </div>

                <div id="scanResultBox" style="background: rgba(56,189,248,0.08); border: 1px dashed #38bdf8; padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: center; display: none;">
                    <img id="scanResImg" src="https://placehold.co/60" style="width: 50px; height: 50px; object-fit: contain; border-radius: 8px; background: #fff; margin-bottom: 4px;">
                    <div id="scanResName" style="font-size: 13px; font-weight: 900; color: #38bdf8;">---</div>
                    <div id="scanResPrice" style="font-size: 14px; font-weight: 900; color: #10b981; margin-top: 2px;">$0.00</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 10px;" onclick="document.getElementById('skmScanModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.executeScanLookup = function() {
        const inp = document.getElementById('scanCodeInput');
        const code = inp.value.trim().toLowerCase();
        const box = document.getElementById('scanResultBox');
        if (!code) return;

        let inv = window.inventory || [];
        let match = inv.find(p => String(p.id).toLowerCase() === code || (p.customId && String(p.customId).toLowerCase() === code) || String(p.name).toLowerCase().includes(code));

        if (!match) {
            box.style.display = 'block';
            document.getElementById('scanResName').innerText = 'រកមិនឃើញទំនិញជាមួយកូដនេះទេ';
            document.getElementById('scanResPrice').innerText = '---';
            document.getElementById('scanResImg').src = 'https://placehold.co/60';
            return;
        }

        box.style.display = 'block';
        document.getElementById('scanResName').innerText = match.name;
        document.getElementById('scanResPrice').innerText = `$${parseFloat(match.price || 0).toFixed(2)}`;
        document.getElementById('scanResImg').src = match.image || 'https://placehold.co/60';

        if (typeof window.openProductByName === 'function') {
            window.openProductByName(match.name);
            document.getElementById('skmScanModal').style.display = 'none';
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📷', 'ស្វែងរកទំនិញតាមបាកូដ (Scanner)', openCameraScannerModal, "camera_barcode_scanner.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [8/51] care_recipe_guide.js ===
window.skmRegisterBundledPlugin('menu', "care_recipe_guide.js", function() {
(function() {
    console.log("📖 Menu Care & Recipe Guide Plugin Initialized!");

    function openCareModal() {
        if(document.getElementById('skmCareModal')) {
            document.getElementById('skmCareModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmCareModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">📖</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">មគ្គុទ្ទេសក៍ថែទាំ & រូបមន្ត</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">គន្លឹះថែទាំទំនិញ និងរបៀបទទួលទានឱ្យបានឆ្ងាញ់ពិសា៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(56,189,248,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #38bdf8; display: block; margin-bottom: 2px;">👕 ការថែទាំសម្លៀកបំពាក់</b>
                        <span style="color: var(--text-muted);">បោកគក់ជាមួយទឹកត្រជាក់ និងហាលកន្លែងម្លប់ដើម្បីរក្សាពណ៌សាច់ក្រណាត់។</span>
                    </div>
                    <div style="background: rgba(16,185,129,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #10b981; display: block; margin-bottom: 2px;">☕ គន្លឹះពិសាកាហ្វេកំប៉ុង</b>
                        <span style="color: var(--text-muted);">កូរឱ្យសព្វមុនពេលពិសា ដើម្បីទទួលបានរសជាតិឆ្ងាញ់ស្រទន់ពេញលេញ។</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmCareModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📖', 'មគ្គុទ្ទេសក៍ថែទាំ & រូបមន្ត (Care Guide)', openCareModal, "care_recipe_guide.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [9/51] code_artifact (2).js ===
window.skmRegisterBundledPlugin('menu', "code_artifact (2).js", function() {
(function() {
    console.log("🎧 Menu Ambient Cafe & Relaxing Sounds Plugin Initialized!");

    function openAmbientModal() {
        if(document.getElementById('skmAmbientModal')) {
            document.getElementById('skmAmbientModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmAmbientModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🎧</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">សំឡេងផ្ទៃខាងក្រោយ & សម្រាកលំហែ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ស្តាប់សំឡេងតន្ត្រីកាហ្វេ ឬសំឡេងធម្មជាតិក្នុងពេលរង់ចាំ៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
                    <button onclick="window.playAmbientSound('cafe')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">☕ សំឡេងបរិយាកាសហាងកាហ្វេ (Cafe Vibes)</button>
                    <button onclick="window.playAmbientSound('rain')" style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">🌧️ សំឡេងទឹកភ្លៀងធ្លាក់ (Gentle Rain)</button>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmAmbientModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.playAmbientSound = function(type) {
        try {
            let ctx = typeof window.getSharedAudioContext === 'function' ? window.getSharedAudioContext() : window._sharedAudioCtx;
            if (!ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    window._sharedAudioCtx = new AudioCtx();
                    ctx = window._sharedAudioCtx;
                }
            }
            if (!ctx) throw new Error('AudioContext unsupported');
            if (ctx.state === 'suspended') {
                ctx.resume().catch(() => {});
            }
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type === 'cafe' ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(type === 'cafe' ? 440 : 220, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.5);
            if (typeof showToast === 'function') showToast(`🎧 កំពុងចាក់សំឡេង: ${type === 'cafe' ? 'Cafe Vibes' : 'Gentle Rain'}!`);
        } catch(e) {
            if (typeof showToast === 'function') showToast('កម្មវិធីរុករកមិនអនុញ្ញាតឱ្យលេងសំឡេងដោយស្វ័យប្រវត្តិទេ', true);
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎧', 'សំឡេងបរិយាកាសហាង (Ambient)', openAmbientModal, "code_artifact (2).js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [10/51] code_artifact (3).js ===
window.skmRegisterBundledPlugin('menu', "code_artifact (3).js", function() {
(function() {
    console.log("🐱 Menu Virtual Mascot & Promo Greeter Plugin Initialized!");

    function openMascotModal() {
        if(document.getElementById('skmMascotModal')) {
            document.getElementById('skmMascotModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmMascotModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 50px; margin-bottom: 5px; animation: mascotBounce 1.5s infinite;">🐱</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">សួស្តី! ខ្ញុំជាម៉ាស្កូតប្រចាំហាង</h3>
                <p id="mascotSpeechText" style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; background: rgba(245,158,11,0.08); padding: 12px; border-radius: 12px; border: 1px dashed #f59e0b; text-align: left;">
                    "សូមអរគុណដែលបានអញ្ជើញមកកាន់ហាងយើងខ្ញុំ! ថ្ងៃនេះខ្ញុំមានកូដបញ្ចុះតម្លៃពិសេសជូនអ្នកណា!"
                </p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px solid #10b981; padding: 12px; border-radius: 12px; margin-bottom: 15px; font-size: 12px;">
                    🎁 កូដពិសេសរបស់អ្នក: <b style="color: #10b981; font-size: 15px;">MASCOT5</b> (បញ្ចុះ $5)
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #f59e0b; margin-bottom: 10px;" onclick="window.applyMascotPromoCode()">🎟️ យកកូដបញ្ចុះតម្លៃនេះ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmMascotModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.applyMascotPromoCode = function() {
        const promoInput = document.getElementById('cPromo');
        if (!promoInput) {
            if (typeof showToast === 'function') showToast('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!', true);
            else alert('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!');
            document.getElementById('skmMascotModal').style.display = 'none';
            return;
        }
        const rp = window.skmGetRealPromo('MASCOT5', 'បញ្ចុះ $5'); promoInput.value = rp.code;
        document.getElementById('skmMascotModal').style.display = 'none';
        if (typeof applyPromo === 'function') applyPromo();
        if (typeof showToast === 'function') showToast('បានដាក់កូដ MASCOT5 ជោគជ័យ!');
    };

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes mascotBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
    `;
    document.head.appendChild(style);

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🐱', 'ម៉ាស្កូតហាង & កូដពិសេស', openMascotModal, "code_artifact (3).js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [11/51] code_artifact (4).js ===
window.skmRegisterBundledPlugin('menu', "code_artifact (4).js", function() {
(function() {
    console.log("📏 Menu Portion & Size Guide Plugin Initialized!");

    function openPortionModal() {
        if(document.getElementById('skmPortionModal')) {
            document.getElementById('skmPortionModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmPortionModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">📏</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">មគ្គុទ្ទេសក៍ទំហំចំណែក (Size Guide)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ស្វែងយល់ពីទំហំ និងបរិមាណមុនពេលកុម្មង់៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(56,189,248,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #38bdf8; display: block; margin-bottom: 2px;">🥤 ទំហំ S (Small / តូច)</b>
                        <span style="color: var(--text-muted);">សមស្របសម្រាប់ពិសា ១ នាក់ (កម្រិតស្តង់ដារ)។</span>
                    </div>
                    <div style="background: rgba(16,185,129,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #10b981; display: block; margin-bottom: 2px;">🥤 ទំហំ M (Medium / មធ្យម)</b>
                        <span style="color: var(--text-muted);">ចំណុះច្រើនជាង ៣០% (ជាទីនិយមបំផុត)។</span>
                    </div>
                    <div style="background: rgba(245,158,11,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #f59e0b; display: block; margin-bottom: 2px;">🥤 ទំហំ L / Family (ធំ / គ្រួសារ)</b>
                        <span style="color: var(--text-muted);">ចំណុះធំ សមស្របសម្រាប់ញ៉ាំជុំគ្នា ២-៣ នាក់។</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmPortionModal').style.display='none'">យល់ព្រម / បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📏', 'មគ្គុទ្ទេសក៍ទំហំចំណែក (Size Guide)', openPortionModal, "code_artifact (4).js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [12/51] custom_item_builder.js ===
window.skmRegisterBundledPlugin('menu', "custom_item_builder.js", function() {
(function() {
    console.log("🛠️ Menu Custom Item Builder Plugin Initialized!");

    function openCustomBuilderModal() {
        if(document.getElementById('skmBuilderModal')) {
            document.getElementById('skmBuilderModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmBuilderModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🛠️</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">ច្នៃប្រឌិតម្ហូប/ភេសជ្ជៈតាមចិត្ត</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើសគ្រឿងផ្សំ និង Toppings តាមចំណូលចិត្តរបស់អ្នក៖</p>
                
                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 6px;">1. រើសមូលដ្ឋាន (Base Item):</div>
                <select id="builderBaseSelect" class="input-st" style="background: var(--store-bg, #0f172a); color: #fff; width: 100%; padding: 10px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 12px; font-family: 'Battambang'; font-size: 12px;" onchange="window.calcBuilderTotal()">
                    <option value="កាហ្វេដូងក្រអូប ($3.50)" data-price="3.50">☕ កាហ្វេដូងក្រអូប - $3.50</option>
                    <option value="តែបៃតងទឹកដោះគោ ($3.00)" data-price="3.00">🍵 តែបៃតងទឹកដោះគោ - $3.00</option>
                    <option value="មីហឹរកូរ៉េពិសេស ($4.50)" data-price="4.50">🍜 មីហឹរកូរ៉េពិសេស - $4.50</option>
                </select>

                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 6px;">2. បន្ថែម Toppings ពិសេស ($0.50 ក្នុងមួយមុខ):</div>
                <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;"><input type="checkbox" class="builder-topping" value="គុជខ្យង (Pearl)" data-price="0.50" onchange="window.calcBuilderTotal()"> 🧋 គុជខ្យង (Pearl) [+$0.50]</label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;"><input type="checkbox" class="builder-topping" value="ផុឌីងសូកូឡា (Pudding)" data-price="0.50" onchange="window.calcBuilderTotal()"> 🍮 ផុឌីងសូកូឡា (Pudding) [+$0.50]</label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;"><input type="checkbox" class="builder-topping" value="ឈីសពីងលើ (Cheese Foam)" data-price="0.50" onchange="window.calcBuilderTotal()"> 🧀 ឈីសពីងលើ (Cheese Foam) [+$0.50]</label>
                </div>

                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 12px; border-radius: 14px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted);">តម្លៃសរុបការច្នៃប្រឌិត:</div>
                    <div id="builderTotalPrice" style="font-size: 22px; font-weight: 900; color: #10b981; margin-top: 4px;">$3.50</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #10b981; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px;" onclick="window.addCustomBuiltItemToCart()">🛒 បន្ថែមចូលកន្ត្រក</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 10px;" onclick="document.getElementById('skmBuilderModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        window.calcBuilderTotal();
    }

    window.calcBuilderTotal = function() {
        const baseSel = document.getElementById('builderBaseSelect');
        if (!baseSel) return;
        const basePrice = parseFloat(baseSel.options[baseSel.selectedIndex].getAttribute('data-price')) || 0;
        
        let toppingTotal = 0;
        document.querySelectorAll('.builder-topping:checked').forEach(chk => {
            toppingTotal += parseFloat(chk.getAttribute('data-price')) || 0;
        });

        let total = basePrice + toppingTotal;
        const totalEl = document.getElementById('builderTotalPrice');
        if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
    };

    window.addCustomBuiltItemToCart = function() {
        const baseSel = document.getElementById('builderBaseSelect');
        const baseName = baseSel.value.split(' (')[0];
        const basePrice = parseFloat(baseSel.options[baseSel.selectedIndex].getAttribute('data-price')) || 0;

        let toppings = [];
        let toppingExtra = 0;
        document.querySelectorAll('.builder-topping:checked').forEach(chk => {
            toppings.push(chk.value);
            toppingExtra += parseFloat(chk.getAttribute('data-price')) || 0;
        });

        let finalPrice = basePrice + toppingExtra;
        let customVariant = toppings.length > 0 ? toppings.join(', ') : 'ស្តង់ដារ';

        let cartItem = {
            id: 'CUSTOM-' + Date.now(),
            name: `✨ [Custom] ${baseName}`,
            price: finalPrice,
            image: 'https://placehold.co/200/0f172a/10b981?text=Custom+Item',
            cartId: 'cust_' + Date.now(),
            cartVar: customVariant,
            qty: 1
        };

        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
            cart.push(cartItem);
            if (typeof updateCartBadges === 'function') updateCartBadges();
            if (typeof renderCart === 'function') renderCart();
            if (typeof updateTotal === 'function') updateTotal();
        }

        document.getElementById('skmBuilderModal').style.display = 'none';
        if (typeof showToast === 'function') showToast('បានបន្ថែមម្ហូបច្នៃប្រឌិតថ្មីចូលកន្ត្រក!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🛠️', 'ច្នៃប្រឌិតម្ហូបតាមចិត្ត (Custom Builder)', openCustomBuilderModal, "custom_item_builder.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [13/51] daily_combo.js ===
window.skmRegisterBundledPlugin('menu', "daily_combo.js", function() {
(function() {
    console.log("🍱 Menu Daily Combo & Set Deals Plugin Initialized!");

    function openDailyComboModal() {
        if(document.getElementById('skmComboModal')) {
            document.getElementById('skmComboModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmComboModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🍱</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">កញ្ចប់កុម្មង់ពិសេសប្រចាំថ្ងៃ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើសកញ្ចប់ Combo ចំណេញច្រើនជាងមុន៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px; text-align: left;">
                    <div style="background: rgba(245,158,11,0.08); border: 1px dashed #f59e0b; padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <b style="color: #f59e0b; font-size: 13px; display: block;">Combo A (ម្ហូប + ភេសជ្ជៈ)</b>
                            <span style="font-size: 11px; color: var(--text-muted);">តម្លៃពិសេស: $5.00 (បញ្ចុះ 20%)</span>
                        </div>
                        <button onclick="window.applyComboDeal('Combo A - $5.00')" style="background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">រើស</button>
                    </div>
                    <div style="background: rgba(16,185,129,0.08); border: 1px dashed #10b981; padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <b style="color: #10b981; font-size: 13px; display: block;">Combo B (គ្រួសារសប្បាយ)</b>
                            <span style="font-size: 11px; color: var(--text-muted);">តម្លៃពិសេស: $15.00 (ហ្វ្រីសេវាដឹក)</span>
                        </div>
                        <button onclick="window.applyComboDeal('Combo B - $15.00')" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">រើស</button>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b;" onclick="document.getElementById('skmComboModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.applyComboDeal = function(comboName) {
        const noteInput = document.getElementById('cNote');
        if (!noteInput) {
            if (typeof showToast === 'function') showToast('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!', true);
            else alert('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!');
            document.getElementById('skmComboModal').style.display = 'none';
            return;
        }
        let currentVal = noteInput.value.trim();
        noteInput.value = currentVal ? `${currentVal}, [កញ្ចប់: ${comboName}]` : `[កញ្ចប់: ${comboName}]`;
        document.getElementById('skmComboModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`បានជ្រើសរើស: ${comboName}!`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🍱', 'កញ្ចប់ពិសេសប្រចាំថ្ងៃ (Daily Combo)', openDailyComboModal, "daily_combo.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [14/51] daily_motivation.js ===
window.skmRegisterBundledPlugin('menu', "daily_motivation.js", function() {
(function() {
    console.log("🌟 Menu Daily Motivation & Affirmation Plugin Initialized!");

    function openMotivationModal() {
        if(document.getElementById('skmMotivationModal')) {
            document.getElementById('skmMotivationModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmMotivationModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(168,85,247,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">🌟</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #a855f7;">កាតលើកទឹកចិត្តប្រចាំថ្ងៃ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ពាក្យពេចន៍លើកទឹកចិត្ត និងថាមពលវិជ្ជមានថ្ងៃនេះ៖</p>
                
                <div style="background: rgba(168,85,247,0.08); border: 1px dashed #a855f7; padding: 18px; border-radius: 16px; margin-bottom: 15px; text-align: center; min-height: 90px; display: flex; align-items: center; justify-content: center;">
                    <span id="motivationQuoteText" style="font-size: 13px; font-weight: bold; color: var(--text-dark, #fff); line-height: 1.5;">"ជោគជ័យកើតចេញពីការតស៊ូព្យាយាមបន្តិចម្តងៗរាល់ថ្ងៃ!"</span>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #a855f7; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.getRandomMotivationQuote()">✨ ប្តូរពាក្យពេចន៍ថ្មី</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(168,85,247,0.1); color:#a855f7; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmMotivationModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.getRandomMotivationQuote = function() {
        const quotes = [
            "✨ ជោគជ័យកើតចេញពីការតស៊ូព្យាយាមបន្តិចម្តងៗរាល់ថ្ងៃ!",
            "🌟 រាល់ថ្ងៃគឺជាឱកាសថ្មីដើម្បីធ្វើរឿងអស្ចារ្យសម្រាប់ខ្លួនឯង!",
            "💫 ភាពវិជ្ជមានក្នុងចិត្តនាំមកនូវភាពរុងរឿងក្នុងជីវិត!",
            "🍀 មិនថាមានរឿងអ្វីកើតឡើងទេ ញញឹមស្វាគមន៍ថ្ងៃថ្មីទាំងអស់គ្នា!",
            "🚀 ការខិតខំប្រឹងប្រែងរបស់អ្នកថ្ងៃនេះ គឺជាអនាគតដ៏ល្អថ្ងៃស្អែក!"
        ];
        let rand = quotes[Math.floor(Math.random() * quotes.length)];
        const txt = document.getElementById('motivationQuoteText');
        if (txt) txt.innerText = rand;
        if (typeof showToast === 'function') showToast('🌟 បានទទួលថាមពលវិជ្ជមានថ្មី!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🌟', 'កាតលើកទឹកចិត្តប្រចាំថ្ងៃ (Motivation)', openMotivationModal, "daily_motivation.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [15/51] delivery_notes.js ===
window.skmRegisterBundledPlugin('menu', "delivery_notes.js", function() {
(function() {
    console.log("📍 Menu Delivery Address & Landmark Notes Plugin Initialized!");

    function openDeliveryNoteModal() {
        if(document.getElementById('skmDelivNoteModal')) {
            document.getElementById('skmDelivNoteModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmDelivNoteModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">📍</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">កត់ចំណាំទីតាំងដឹកជញ្ជូន</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">បំពេញព័ត៌មានទីតាំងលម្អិតដើម្បីងាយស្រួលដល់អ្នកដឹកជញ្ជូន៖</p>
                
                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">ផ្ទះលេខ / ផ្លូវ / បុរី:</div>
                <input type="text" id="delivStreet" placeholder="ឧ. ផ្ទះលេខ 12, ផ្លូវ 271..." style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 12px; outline: none; margin-bottom: 10px; font-family:'Battambang';">

                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">អគារ / ជាន់ / បន្ទប់ (បើមាន):</div>
                <input type="text" id="delivBuilding" placeholder="ឧ. អាគារ A, ជាន់ទី 2, បន្ទប់ 204" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 12px; outline: none; margin-bottom: 10px; font-family:'Battambang';">

                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">ទីកន្លែងសម្គាល់ជិតផ្ទះ:</div>
                <input type="text" id="delivLandmark" placeholder="ឧ. ជិតផ្សារទួលទំពូង, ផ្ទះពណ៌ខៀវ..." style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 12px; outline: none; margin-bottom: 15px; font-family:'Battambang';">

                <button class="btn-act btn-green" style="width: 100%; background: #38bdf8; margin-bottom: 10px;" onclick="window.submitDeliveryNote()">📥 រក្សាទុកចំណាំទីតាំង</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmDelivNoteModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.submitDeliveryNote = function() {
        const street = document.getElementById('delivStreet').value.trim();
        const bld = document.getElementById('delivBuilding').value.trim();
        const mark = document.getElementById('delivLandmark').value.trim();

        if(!street) {
            alert('សូមបំពេញទីតាំងផ្ទះលេខ និងផ្លូវសិន!');
            return;
        }

        let noteStr = `[ទីតាំងដឹក: ${street}${bld ? ', ' + bld : ''}${mark ? ' (កន្លែងសម្គាល់: ' + mark + ')' : ''}]`;
        
        const noteInput = document.getElementById('cNote');
        if (noteInput) {
            let currentVal = noteInput.value.replace(/\[ទីតាំងដឹក:.*?\]/g, '').trim();
            noteInput.value = currentVal ? `${currentVal}, ${noteStr}` : noteStr;
        }

        localStorage.setItem('skm_saved_delivery_address', noteStr);
        document.getElementById('skmDelivNoteModal').style.display = 'none';

        if (typeof showToast === 'function') showToast('បានរក្សាទុកចំណាំទីតាំងដឹកជញ្ជូនជោគជ័យ!');
        else alert('បានរក្សាទុកចំណាំទីតាំងដឹកជញ្ជូនជោគជ័យ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📍', 'កត់ចំណាំទីតាំងដឹកជញ្ជូន (Delivery)', openDeliveryNoteModal, "delivery_notes.js");
            clearInterval(initInt);
        }
    }, 500);
})();

});

;
// === [16/51] digital_jukebox.js ===
window.skmRegisterBundledPlugin('menu', "digital_jukebox.js", function() {
(function() {
    console.log("🎵 Menu Digital Jukebox & Song Request Plugin Initialized!");

    function openJukeboxModal() {
        if(document.getElementById('skmJukeboxModal')) {
            document.getElementById('skmJukeboxModal').style.display = 'flex';
            loadPlaylist();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmJukeboxModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(236,72,153,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🎵</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #ec4899;">សំណូមពរបទចម្រៀង (Digital Jukebox)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើស ឬស្នើសុំបទចម្រៀងសម្រាប់ចាក់កំសាន្តក្នុងហាង៖</p>
                
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <input type="text" id="songRequestInput" placeholder="ឈ្មោះបទចម្រៀង ឬតន្ត្រី..." style="flex: 1; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 12px; color: #fff; font-size: 12px; outline: none; font-family: 'Battambang';">
                    <button onclick="window.requestSong()" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">ស្នើសុំ</button>
                </div>

                <div style="font-size: 12px; font-weight: bold; text-align: left; margin-bottom: 6px;">🎶 បទចម្រៀងពេញនិយមក្នុងបញ្ជី៖</div>
                <div id="playlistContainer" style="max-height: 200px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 6px; text-align: left; font-size: 12px;">
                    <!-- Playlist injected via JS -->
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(236,72,153,0.1); color:#ec4899; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmJukeboxModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        loadPlaylist();
    }

    function loadPlaylist() {
        const container = document.getElementById('playlistContainer');
        if (!container) return;

        let songs = JSON.parse(localStorage.getItem('skm_jukebox_songs') || JSON.stringify([
            { title: 'រាត្រីខែធ្នូ - Original Song', votes: 12 },
            { title: 'ស្រលាញ់ស្រីស្រស់ - Acoustic Cover', votes: 9 },
            { title: 'មនោសញ្ចេតនាថ្ងៃខុស - Slow Live', votes: 7 },
            { title: 'កាហ្វេពេលព្រឹក - Chill Instrumental', votes: 15 }
        ]));

        container.innerHTML = songs.map((s, idx) => `
            <div style="background: rgba(236,72,153,0.06); border: 1px solid var(--border-color); padding: 10px 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <b style="color: #ec4899; display: block; font-size: 12px;">🎵 ${s.title}</b>
                    <span style="font-size: 10px; color: var(--text-muted);">សំឡេងបោះឆ្នោត: ${s.votes} votes</span>
                </div>
                <button onclick="window.voteSong(${idx})" style="background: rgba(236,72,153,0.15); color: #ec4899; border: 1px solid #ec4899; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">👍 VOTE</button>
            </div>
        `).join('');
    }

    window.requestSong = function() {
        const inp = document.getElementById('songRequestInput');
        const title = inp.value.trim();
        if (!title) { alert('សូមសរសេរឈ្មោះបទចម្រៀងសិន!'); return; }

        let songs = JSON.parse(localStorage.getItem('skm_jukebox_songs') || '[]');
        songs.unshift({ title: title, votes: 1 });
        localStorage.setItem('skm_jukebox_songs', JSON.stringify(songs));

        inp.value = '';
        loadPlaylist();
        if (typeof showToast === 'function') showToast('បានស្នើសុំបទចម្រៀងជោគជ័យ!');
    };

    window.voteSong = function(idx) {
        let songs = JSON.parse(localStorage.getItem('skm_jukebox_songs') || '[]');
        if (songs[idx]) {
            songs[idx].votes++;
            localStorage.setItem('skm_jukebox_songs', JSON.stringify(songs));
            loadPlaylist();
            if (typeof showToast === 'function') showToast('បាន VOTE បទចម្រៀងជោគជ័យ!');
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎵', 'សំណូមពរបទចម្រៀង (Jukebox)', openJukeboxModal, "digital_jukebox.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [17/51] digital_member_id.js ===
window.skmRegisterBundledPlugin('menu', "digital_member_id.js", function() {
(function() {
    console.log("🪪 Menu Digital Member ID Card Plugin Initialized!");

    function openDigitalIdModal() {
        if(document.getElementById('skmDigitalIdModal')) {
            document.getElementById('skmDigitalIdModal').style.display = 'flex';
            updateDigitalIdDetails();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmDigitalIdModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 38px; margin-bottom: 5px;">🪪</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">កាតសមាជិកឌីជីថល (Digital ID)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">បង្ហាញកាតនេះពេលទូទាត់ប្រាក់ដើម្បីទទួលបានសិទ្ធិពិសេស៖</p>
                
                <div style="background: linear-gradient(135deg, #0284c7, #06b6d4); color: white; padding: 20px; border-radius: 16px; margin-bottom: 15px; text-align: left; box-shadow: 0 10px 25px rgba(6,182,212,0.4); position: relative; overflow: hidden;">
                    <div style="font-size: 10px; opacity: 0.8; letter-spacing: 1px;">DIGITAL VIP MEMBER CARD</div>
                    <div id="digCardName" style="font-size: 16px; font-weight: 900; margin: 10px 0 4px 0;">អតិថិជនកិត្តិយស</div>
                    <div id="digCardId" style="font-size: 11px; font-family: monospace; opacity: 0.9; margin-bottom: 15px;">ID: SKM-VIP-88921</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                        <span>ពិន្ទុ: <b id="digCardPoints">0 pts</b></span>
                        <span style="background: rgba(255,255,255,0.25); padding: 2px 8px; border-radius: 6px; font-weight: bold;">PLATINUM</span>
                    </div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(56,189,248,0.06); padding: 10px; border-radius: 10px; border: 1px solid var(--border-color);">
                    💡 កាតនេះត្រូវបានភ្ជាប់ដោយស្វ័យប្រវត្តិជាមួយប្រព័ន្ធគិតលុយ (POS) របស់ហាង។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmDigitalIdModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        updateDigitalIdDetails();
    }

    function updateDigitalIdDetails() {
        const nameEl = document.getElementById('digCardName');
        const ptsEl = document.getElementById('digCardPoints');
        if (!nameEl) return;

        let vipData = JSON.parse(localStorage.getItem('skm_vip_member_data') || 'null');
        if (vipData && vipData.name) {
            nameEl.innerText = vipData.name;
        } else {
            nameEl.innerText = 'អតិថិជនទូទៅ (Guest)';
        }

        let pts = localStorage.getItem('skm_pts') || '0';
        if (ptsEl) ptsEl.innerText = `${pts} pts`;
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🪪', 'កាតសមាជិកឌីជីថល (Digital ID)', openDigitalIdModal, "digital_member_id.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [18/51] dish_anatomy.js ===
window.skmRegisterBundledPlugin('menu', "dish_anatomy.js", function() {
(function() {
    console.log("🔬 Menu Dish Anatomy & Ingredient Inspector Plugin Initialized!");

    function openAnatomyModal() {
        if(document.getElementById('skmAnatomyModal')) {
            document.getElementById('skmAnatomyModal').style.display = 'flex';
            loadAnatomyDetails();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmAnatomyModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 420px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🔬</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">វិភាគគ្រឿងផ្សំ & ស្រទាប់ម្ហូប</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ពិនិត្យមើលសមាសធាតុ និងគុណតម្លៃអាហារូបត្ថម្ភ៖</p>
                
                <div id="anatomyContentBox" style="background: rgba(15,23,42,0.6); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 10px;">
                    <div><b>🥗 មូលដ្ឋាន (Base Layer):</b> គ្រាប់កាហ្វេអារ៉ាប៊ីកា ឬស្រូវសាលីធម្មជាតិ</div>
                    <div><b>🍯 រសជាតិកណ្តាល (Flavor Profile):</b> ផ្អែមស្រទន់ ក្រអូបឈ្ងុយជាប់មាត់</div>
                    <div><b>🌿 កម្រិតសរីរាង្គ (Organic Score):</b> <span style="color: #10b981; font-weight: 900;">98.5% សុទ្ធសាធ</span></div>
                    <div><b>⚡ ពិន្ទុថាមពល (Energy Rating):</b> កម្រិតមធ្យម ស្រស់ស្រាយពេញមួយថ្ងៃ</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmAnatomyModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        loadAnatomyDetails();
    }

    function loadAnatomyDetails() {
        const box = document.getElementById('anatomyContentBox');
        if (!box) return;
        let inv = window.inventory || [];
        if (inv.length > 0) {
            let sample = inv[0];
            box.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
                    <img src="${sample.image || 'https://placehold.co/40'}" style="width:40px; height:40px; object-fit:contain; border-radius:8px; background:#fff;">
                    <div>
                        <b style="color:#38bdf8; font-size:13px;">${sample.name}</b>
                        <span style="display:block; font-size:10px; color:var(--text-muted);">តម្លៃ: $${parseFloat(sample.price||0).toFixed(2)}</span>
                    </div>
                </div>
                <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:4px 0;">
                <div><b>🥗 គ្រឿងផ្សំចម្បង:</b> វត្ថុធាតុដើមគុណភាពខ្ពស់ ស្រស់ស្អាតប្រចាំហាង</div>
                <div><b>🌿 កម្រិតសរីរាង្គ (Organic):</b> <span style="color: #10b981; font-weight: 900;">100% ធម្មជាតិ</span></div>
                <div><b>🛡️ សុវត្ថិភាព:</b> គ្មានជាតិគីមី និងគ្មានសារធាតុរក្សាទុកយូរ</div>
            `;
        }
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔬', 'វិភាគគ្រឿងផ្សំ & ស្រទាប់ម្ហូប (Anatomy)', openAnatomyModal, "dish_anatomy.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [19/51] dosage_guide.js ===
window.skmRegisterBundledPlugin('menu', "dosage_guide.js", function() {
(function() {
    console.log("💊 Menu Pharmacy Dosage & Usage Guide Plugin Initialized!");

    function openDosageModal() {
        if(document.getElementById('skmDosageModal')) {
            document.getElementById('skmDosageModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmDosageModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">💊</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">ណែនាំកម្រិតប្រើប្រាស់ថ្នាំ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">គន្លឹះ និងកម្រិតប្រើប្រាស់ឱសថទូទៅតាមវេជ្ជបញ្ជា៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(16,185,129,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #10b981; display: block; margin-bottom: 2px;">🌅 ថ្នាំញ៉ាំពេលព្រឹក (Before/After Meal)</b>
                        <span style="color: var(--text-muted);">ភាគច្រើនញ៉ាំមុនបាយ ៣០នាទី ជាមួយទឹកស្អាត ១កែវពេញ។</span>
                    </div>
                    <div style="background: rgba(56,189,248,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #38bdf8; display: block; margin-bottom: 2px;">🌙 ថ្នាំញ៉ាំពេលល្ងាច / មុនចូលគេង</b>
                        <span style="color: var(--text-muted);">សម្រាប់ថ្នាំបំបាត់ការឈឺចាប់ ឬថ្នាំងងុយគេង តាមវេជ្ជបញ្ជាគ្រូពេទ្យ។</span>
                    </div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px; text-align: left;">
                    ⚠️ ចាំបាច់ត្រូវអានស្លាកសញ្ញា ឬពិគ្រោះជាមួយឱសថការីមុនពេលប្រើប្រាស់។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmDosageModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💊', 'ណែនាំកម្រិតប្រើប្រាស់ថ្នាំ (Dosage)', openDosageModal, "dosage_guide.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [20/51] drug_safety.js ===
window.skmRegisterBundledPlugin('menu', "drug_safety.js", function() {
(function() {
    console.log("🩺 Menu Drug Safety & Storage Plugin Initialized!");

    function openDrugSafetyModal() {
        if(document.getElementById('skmSafetyModal')) {
            document.getElementById('skmSafetyModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmSafetyModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(239,68,68,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🩺</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #ef4444;">សុវត្ថិភាពថ្នាំ & ការរក្សាទុក</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ការណែនាំអំពីការរក្សាទុកឱសថឱ្យបានត្រឹមត្រូវ និងមានសុវត្ថិភាព៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(239,68,68,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #ef4444; display: block; margin-bottom: 2px;">🌡️ សីតុណ្ហភាពរក្សាទុក (Storage)</b>
                        <span style="color: var(--text-muted);">រក្សាទុកនៅកន្លែងស្ងួត និងមានសីតុណ្ហភាពក្រោម ៣០អង្សាសេ ផុតពីពន្លឺព្រះអាទិត្យផ្ទាល់។</span>
                    </div>
                    <div style="background: rgba(245,158,11,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #f59e0b; display: block; margin-bottom: 2px;">👶 សុវត្ថិភាពកុមារ (Keep Away)</b>
                        <span style="color: var(--text-muted);">ត្រូវដាក់ទុកដាក់ឱ្យឆ្ងាយពីដៃក្មេង និងសត្វចិញ្ចឹម ដើម្បីការពារគ្រោះថ្នាក់។</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(239,68,68,0.1); color:#ef4444; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmSafetyModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🩺', 'សុវត្ថិភាពថ្នាំ & រក្សាទុក (Safety)', openDrugSafetyModal, "drug_safety.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [21/51] e_gift_card.js ===
window.skmRegisterBundledPlugin('menu', "e_gift_card.js", function() {
(function() {
    console.log("🎁 Menu E-Gift Card Plugin Initialized!");

    function openEGiftModal() {
        if(document.getElementById('skmGiftCardModal')) {
            document.getElementById('skmGiftCardModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmGiftCardModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">🎁</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">កាតអំណោយឌីជីថល (E-Gift Card)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">បង្កើតកាតអំណោយសម្រាប់មិត្តភក្តិ ឬមនុស្សពិសេស៖</p>
                
                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">ឈ្មោះអ្នកទទួល (Recipient Name):</div>
                <input type="text" id="giftRecipient" placeholder="ឧ. នរៈ..." style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: #fff; font-size: 12px; outline: none; margin-bottom: 10px; font-family:'Battambang';">

                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">ទឹកប្រាក់កាតអំណោយ ($):</div>
                <select id="giftAmount" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: #fff; font-size: 12px; outline: none; margin-bottom: 10px; font-family:'Battambang';">
                    <option value="5">🎁 កាតអំណោយ $5.00</option>
                    <option value="10" selected>🎁 កាតអំណោយ $10.00</option>
                    <option value="20">🎁 កាតអំណោយ $20.00</option>
                    <option value="50">🎁 កាតអំណោយ $50.00</option>
                </select>

                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">សារជូនពរ (Message):</div>
                <input type="text" id="giftMessage" placeholder="ឧ. រីករាយថ្ងៃខួបកំណើត!" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: #fff; font-size: 12px; outline: none; margin-bottom: 15px; font-family:'Battambang';">

                <button class="btn-act btn-green" style="width: 100%; background: #f59e0b; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.generateGiftCardCode()">✨ បង្កើតកូដកាតអំណោយ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmGiftCardModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.generateGiftCardCode = function() {
        const recip = document.getElementById('giftRecipient').value.trim();
        const amt = document.getElementById('giftAmount').value;
        const msg = document.getElementById('giftMessage').value.trim();

        if(!recip) { alert('សូមបញ្ចូលឈ្មោះអ្នកទទួលសិន!'); return; }

        let cardCode = 'GIFT-' + amt + '-' + Math.floor(1000 + Math.random() * 9000);
        
        const promoInput = document.getElementById('cPromo');
        if (promoInput) promoInput.value = cardCode;

        document.getElementById('skmGiftCardModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`បង្កើតកាតអំណោយ $${amt} ជោគជ័យ! កូដ: ${cardCode}`);
        else alert(`បង្កើតកាតអំណោយជោគជ័យ! កូដ: ${cardCode}`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎁', 'កាតអំណោយឌីជីថល (E-Gift Card)', openEGiftModal, "e_gift_card.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [22/51] events_schedule.js ===
window.skmRegisterBundledPlugin('menu', "events_schedule.js", function() {
(function() {
    console.log("🎶 Menu Live Events & Music Schedule Plugin Initialized!");

    function openEventsModal() {
        if(document.getElementById('skmEventsModal')) {
            document.getElementById('skmEventsModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmEventsModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🎶</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #ec4899;">កាលវិភាគតន្ត្រី & ព្រឹត្តិការណ៍</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">កម្សាន្តសប្បាយជាមួយតន្ត្រីផ្ទាល់ (Acoustic Night) ប្រចាំសប្តាហ៍៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(236,72,153,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #ec4899; display: block; margin-bottom: 2px;">🎸 តន្ត្រីអាគូស្ទិក (Acoustic Night)</b>
                        <span style="color: var(--text-muted);">រៀងរាល់ថ្ងៃសុក្រ និងសៅរ៍ | ម៉ោង ០៧:០០ យប់</span>
                    </div>
                    <div style="background: rgba(56,189,248,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #38bdf8; display: block; margin-bottom: 2px;">🎤 កម្មវិធីចម្រៀងតាមសំណូមពរ</b>
                        <span style="color: var(--text-muted);">រៀងរាល់ថ្ងៃអាទិត្យ | ម៉ោង ០៦:០០ ល្ងាច</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(236,72,153,0.1); color:#ec4899;" onclick="document.getElementById('skmEventsModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎶', 'កាលវិភាគតន្ត្រី & ព្រឹត្តិការណ៍ (Events)', openEventsModal, "events_schedule.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [23/51] flash_sale.js ===
window.skmRegisterBundledPlugin('menu', "flash_sale.js", function() {
(function() {
    console.log("⏳ Menu Flash Deal Countdown Plugin Initialized!");

    function openFlashDealModal() {
        if(document.getElementById('skmFlashModal')) {
            document.getElementById('skmFlashModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmFlashModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">⏳</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #ef4444;">Flash Sale រាប់ថយក្រោយ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ប្រូម៉ូសិនពិសេសនឹងបញ្ចប់ក្នុងពេលឆាប់ៗ៖</p>
                
                <div style="background: rgba(239,68,68,0.08); border: 1px dashed #ef4444; padding: 15px; border-radius: 14px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">ពេលវេលានៅសល់:</div>
                    <div id="flashTimerDisplay" style="font-size: 24px; font-weight: 900; color: #ef4444; font-family: monospace;">02:45:30</div>
                </div>

                <div style="background: rgba(16,185,129,0.08); border: 1px solid #10b981; padding: 12px; border-radius: 12px; margin-bottom: 15px; text-align: center; font-size: 12px;">
                    🔥 កូដបញ្ចុះតម្លៃពិសេស: <b style="color: #10b981; font-size: 14px;">FLASH20</b> (បញ្ចុះ 20%)
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #ef4444; margin-bottom: 10px;" onclick="window.applyFlashDealCode()">🎟️ យកកូដ Flash Sale</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmFlashModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.applyFlashDealCode = function() {
        const promoInput = document.getElementById('cPromo');
        if (!promoInput) {
            if (typeof showToast === 'function') showToast('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!', true);
            else alert('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!');
            document.getElementById('skmFlashModal').style.display = 'none';
            return;
        }
        const rp = window.skmGetRealPromo('FLASH20', 'បញ្ចុះ 20%'); promoInput.value = rp.code;
        document.getElementById('skmFlashModal').style.display = 'none';
        if (typeof applyPromo === 'function') applyPromo();
        if (typeof showToast === 'function') showToast('បានដាក់កូដ Flash Sale ជោគជ័យ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('⏳', 'Flash Sale រាប់ថយក្រោយ', openFlashDealModal, "flash_sale.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [24/51] flavor_matchmaker.js ===
window.skmRegisterBundledPlugin('menu', "flavor_matchmaker.js", function() {
(function() {
    console.log("🍹 Menu Flavor Matchmaker Plugin Initialized!");

    function openFlavorModal() {
        if(document.getElementById('skmFlavorModal')) {
            document.getElementById('skmFlavorModal').style.display = 'flex';
            document.getElementById('flavorResultBox').style.display = 'none';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmFlavorModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(236,72,153,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🍹</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #ec4899;">ស្វែងរករសជាតិត្រូវចិត្ត</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">តើថ្ងៃនេះអ្នកចង់បានរសជាតិបែបណាដែរ?</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
                    <button onclick="window.matchFlavor('ផ្អែម')" style="background: rgba(236,72,153,0.1); color: #ec4899; border: 1px solid #ec4899; padding: 12px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">🍯 ផ្អែមស្រទន់ (Sweet)</button>
                    <button onclick="window.matchFlavor('ជូរ')" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 12px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">🍋 ជូរអែម (Sour)</button>
                    <button onclick="window.matchFlavor('ហឹរ')" style="background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid #ef4444; padding: 12px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">🌶️ ហឹរឆ្ងាញ់ (Spicy)</button>
                    <button onclick="window.matchFlavor('ស្រស់ស្រាយ')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 12px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">🌿 ស្រស់ស្រាយ (Fresh)</button>
                </div>

                <div id="flavorResultBox" style="background: rgba(236,72,153,0.08); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: center; display: none;">
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">ការណែនាំរសជាតិសម្រាប់អ្នក:</div>
                    <div id="flavorRecName" style="font-size: 15px; font-weight: 900; color: #ec4899; margin-bottom: 2px;">---</div>
                    <div id="flavorRecDesc" style="font-size: 11px; color: var(--text-dark);">---</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(236,72,153,0.1); color:#ec4899; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmFlavorModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.matchFlavor = function(flavorType) {
        const box = document.getElementById('flavorResultBox');
        const nameEl = document.getElementById('flavorRecName');
        const descEl = document.getElementById('flavorRecDesc');
        if (!box) return;

        box.style.display = 'block';

        let inv = window.inventory || [];
        let match = inv.find(p => String(p.name).toLowerCase().includes(flavorType) || String(p.category).toLowerCase().includes(flavorType));

        if (!match && inv.length > 0) {
            match = inv[Math.floor(Math.random() * inv.length)];
        }

        if (match) {
            nameEl.innerText = `✨ ${match.name} ($${parseFloat(match.price || 0).toFixed(2)})`;
            descEl.innerText = `មុខទំនិញនេះមានរសជាតិត្រូវនឹងចំណូលចិត្ត "${flavorType}" របស់អ្នកថ្ងៃនេះខ្លាំងបំផុត!`;
        } else {
            nameEl.innerText = 'កាហ្វេដូងក្រអូបប្រចាំហាង';
            descEl.innerText = `រសជាតិ "${flavorType}" ដ៏ពេញនិយម និងស្រស់ស្រាយបំផុត!`;
        }

        if (typeof showToast === 'function') showToast(`បានរកឃើញរសជាតិ: ${flavorType}!`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🍹', 'ស្វែងរករសជាតិត្រូវចិត្ត (Flavor Match)', openFlavorModal, "flavor_matchmaker.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [25/51] fortune_cookie.js ===
window.skmRegisterBundledPlugin('menu', "fortune_cookie.js", function() {
(function() {
    console.log("🥠 Menu Fortune Cookie & Daily Lucky Plugin Initialized!");

    function openFortuneModal() {
        if(document.getElementById('skmFortuneModal')) {
            document.getElementById('skmFortuneModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmFortuneModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 44px; margin-bottom: 5px; animation: fortuneBounce 2s infinite;">🥠</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">គុកឃីទស្សន៍ទាយសំណាង</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">បើកខូឃីដើម្បីស្វែងយល់ពីសំណាង និងកូដបញ្ចុះតម្លៃថ្ងៃនេះ៖</p>
                
                <div id="fortuneBox" style="background: rgba(245,158,11,0.08); border: 1px dashed #f59e0b; padding: 16px; border-radius: 16px; margin-bottom: 15px; text-align: center; min-height: 80px; display: flex; align-items: center; justify-content: center;">
                    <span id="fortuneText" style="font-size: 13px; font-weight: bold; color: var(--text-dark);">ចុចប៊ូតុងខាងក្រោមដើម្បីបំបែកខូឃី!</span>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #f59e0b; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px;" onclick="window.crackFortuneCookie()">🥠 បំបែកខូឃីទស្សន៍ទាយ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px;" onclick="document.getElementById('skmFortuneModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fortuneBounce {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.1) rotate(5deg); }
            }
        `;
        document.head.appendChild(style);
    }

    window.crackFortuneCookie = function() {
        const txt = document.getElementById('fortuneText');
        if(!txt) return;

        const fortunes = [
            "✨ សំណាងល្អកំពុងរង់ចាំអ្នកថ្ងៃនេះ! កូដបញ្ចុះតម្លៃ: FORTUNE10 (-10%)",
            "🌟 ការខិតខំប្រឹងប្រែងរបស់អ្នកនឹងទទួលបានផលផ្លែផ្កា! កូដ: LUCKY15 (-$1.50)",
            "💫 ថ្ងៃនេះជាថ្ងៃដ៏ល្អបំផុតសម្រាប់ការចាប់ផ្តើមថ្មី! កូដ: SMILE5 (-$0.50)",
            "🍀 ភាពរុងរឿង និងសុខភាពល្អនឹងមានដល់អ្នក! កូដ: FREESHIP (ហ្វ្រីសេវាដឹក)"
        ];

        let randomMsg = fortunes[Math.floor(Math.random() * fortunes.length)];
        txt.innerHTML = `<span style="color: #f59e0b; font-size: 13px; line-height: 1.4;">${randomMsg}</span>`;
        
        if (typeof showToast === 'function') showToast('🎉 បំបែកខូឃីជោគជ័យ បានទទួលកូដសំណាង!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🥠', 'គុកឃីទស្សន៍ទាយសំណាង (Fortune)', openFortuneModal, "fortune_cookie.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [26/51] group_order.js ===
window.skmRegisterBundledPlugin('menu', "group_order.js", function() {
(function() {
    console.log("👥 Menu Group Order & Shared Cart Plugin Initialized!");

    function openGroupOrderModal() {
        if(document.getElementById('skmGroupModal')) {
            document.getElementById('skmGroupModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmGroupModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        let sessionCode = localStorage.getItem('skm_group_session_code');
        if (!sessionCode) {
            sessionCode = 'GRP-' + Math.floor(1000 + Math.random() * 9000);
            localStorage.setItem('skm_group_session_code', sessionCode);
        }

        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">👥</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #10b981;">កន្ត្រកក្រុម (Group Order)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">សហការគ្នាកុម្មង់ទំនិញជាមួយមិត្តភក្តិនៅតុតែមួយ៖</p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px dashed #10b981; padding: 15px; border-radius: 12px; margin-bottom: 15px;">
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">កូដវគ្គកុម្មង់ (Session Code):</div>
                    <div style="font-size: 22px; font-weight: 900; color: #10b981; font-family: monospace;" id="groupCodeDisplay">${sessionCode}</div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px; text-align: left;">
                    💡 បញ្ជូនកូដនេះ ឬតំណភ្ជាប់កន្ត្រកជូនមិត្តភក្តិ ដើម្បីបូកសរុបការកុម្មង់ចូលគ្នាតែមួយ។
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #10b981; margin-bottom: 10px;" onclick="window.copyGroupCode('${sessionCode}')">📋 ចម្លងកូដក្រុម (Copy Code)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmGroupModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.copyGroupCode = function(code) {
        navigator.clipboard.writeText(code).then(() => {
            document.getElementById('skmGroupModal').style.display = 'none';
            if (typeof showToast === 'function') showToast('បានចម្លងកូដក្រុមចូល Clipboard ជោគជ័យ!');
            else alert('បានចម្លងកូដក្រុមជោគជ័យ!');
        });
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('👥', 'កន្ត្រកក្រុម (Group Order)', openGroupOrderModal, "group_order.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [27/51] hydration_tracker.js ===
window.skmRegisterBundledPlugin('menu', "hydration_tracker.js", function() {
(function() {
    console.log("💧 Menu Hydration & Water Intake Tracker Plugin Initialized!");

    function openHydrationModal() {
        if(document.getElementById('skmHydrationModal')) {
            document.getElementById('skmHydrationModal').style.display = 'flex';
            updateWaterDisplay();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmHydrationModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 44px; margin-bottom: 5px;">💧</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">តាមដានការផឹកទឹកប្រចាំថ្ងៃ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">គោលដៅសុខភាព: ផឹកទឹកឱ្យបាន ៨ កែវក្នុងមួយថ្ងៃ៖</p>
                
                <div style="background: rgba(56,189,248,0.08); border: 1px solid var(--border-color); padding: 16px; border-radius: 16px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted);">ចំនួនទឹកបានផឹកថ្ងៃនេះ:</div>
                    <div id="waterCountDisplay" style="font-size: 32px; font-weight: 900; color: #38bdf8; margin: 6px 0;">0 / 8 កែវ</div>
                    <div style="font-size: 11px; color: #10b981;" id="waterStatusText">ព្យាយាមផឹកទឹកបន្ថែមដើម្បីសុខភាពល្អ!</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #38bdf8; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px;" onclick="window.addWaterGlass()">🥤 ផឹកទឹក ១ កែវ (+1)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 10px;" onclick="document.getElementById('skmHydrationModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        updateWaterDisplay();
    }

    window.updateWaterDisplay = function() {
        const disp = document.getElementById('waterCountDisplay');
        const stat = document.getElementById('waterStatusText');
        if(!disp) return;

        let glasses = parseInt(localStorage.getItem('skm_water_glasses') || '0');
        disp.innerText = `${glasses} / 8 កែវ`;

        if (glasses >= 8) {
            stat.innerHTML = '🎉 អស្ចារ្យណាស់! អ្នកសម្រេចគោលដៅផឹកទឹកថ្ងៃនេះរួចរាល់!';
        } else {
            stat.innerHTML = `ខ្វះ ${8 - glasses} កែវទៀតដើម្បីសម្រេចគោលដៅ!`;
        }
    };

    window.addWaterGlass = function() {
        let glasses = parseInt(localStorage.getItem('skm_water_glasses') || '0');
        glasses++;
        localStorage.setItem('skm_water_glasses', glasses);
        updateWaterDisplay();
        if (typeof showToast === 'function') showToast('🥤 បានកត់ត្រាការផឹកទឹក ១ កែវ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💧', 'តាមដានការផឹកទឹក (Hydration)', openHydrationModal, "hydration_tracker.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [28/51] live_kitchen_tracker.js ===
window.skmRegisterBundledPlugin('menu', "live_kitchen_tracker.js", function() {
(function() {
    console.log("🍜 Menu Live Kitchen Order Tracker Plugin Initialized!");

    function openKitchenTrackerModal() {
        if(document.getElementById('skmKitchenModal')) {
            document.getElementById('skmKitchenModal').style.display = 'flex';
            loadActiveKitchenOrders();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmKitchenModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 440px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 0 50px rgba(245,158,11,0.2);">
                <div style="font-size: 40px; margin-bottom: 5px;">🍜</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">តាមដានស្ថានភាពម្ហូបក្នុងផ្ទះបាយ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ពិនិត្យដំណើរការចម្អិនការកុម្មង់របស់អ្នកតាមពេលវេលាពិត៖</p>
                
                <div id="kitchenOrdersContainer" style="max-height: 280px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 10px; text-align: left;">
                    <!-- Injected via JS -->
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmKitchenModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        loadActiveKitchenOrders();
    }

    function loadActiveKitchenOrders() {
        const container = document.getElementById('kitchenOrdersContainer');
        if (!container) return;

        let orders = JSON.parse(localStorage.getItem('skm_my_orders_history') || '[]');
        if (orders.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:12px;">មិនទាន់មានការកុម្មង់សកម្មក្នុងប្រព័ន្ធទេ</div>';
            return;
        }

        container.innerHTML = orders.slice(0, 3).map((o, idx) => `
            <div style="background: rgba(245,158,11,0.06); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <b style="color: #f59e0b; font-size: 13px;">${o.id}</b>
                    <span style="font-size: 10px; color: var(--text-muted);">${o.date || 'ទើបកុម្មង់'}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 11px;">
                    <span>ដំណាក់កាល: <b style="color: #10b981;">កំពុងចម្អិន (Cooking)</b></span>
                    <span>$${parseFloat(o.totalAmount || 0).toFixed(2)}</span>
                </div>

                <!-- Animated Progress Bar -->
                <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; position: relative;">
                    <div style="width: ${idx === 0 ? '75%' : '40%'}; height: 100%; background: linear-gradient(90deg, #f59e0b, #10b981); border-radius: 3px; animation: progressGlow 2s infinite;"></div>
                </div>
            </div>
        `).join('');
    }

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes progressGlow {
            0% { opacity: 0.6; }
            50% { opacity: 1; filter: drop-shadow(0 0 6px #10b981); }
            100% { opacity: 0.6; }
        }
    `;
    document.head.appendChild(style);

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🍜', 'តាមដានស្ថានភាពម្ហូប (Kitchen Tracker)', openKitchenTrackerModal, "live_kitchen_tracker.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [29/51] loyalty_wallet.js ===
window.skmRegisterBundledPlugin('menu', "loyalty_wallet.js", function() {
(function() {
    console.log("💳 Menu Loyalty Points & Rewards Wallet Plugin Initialized!");

    function openLoyaltyWalletModal() {
        if(document.getElementById('skmLoyaltyWalletModal')) {
            document.getElementById('skmLoyaltyWalletModal').style.display = 'flex';
            updateLoyaltyDisplay();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmLoyaltyWalletModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">💳</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #10b981;">កាបូបពិន្ទុ & រង្វាន់សមាជិក</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ពិនិត្យពិន្ទុសន្សំ និងប្តូរយករង្វាន់ពិសេស៖</p>
                
                <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 14px; margin-bottom: 15px; text-align: center; box-shadow: 0 10px 20px rgba(16,185,129,0.3);">
                    <div style="font-size: 11px; opacity: 0.9;">ពិន្ទុសរុបរបស់អ្នក (TOTAL POINTS)</div>
                    <div id="walletPointsDisplay" style="font-size: 32px; font-weight: 900; margin: 6px 0;">0 pts</div>
                    <div style="font-size: 11px; background: rgba(255,255,255,0.2); display: inline-block; padding: 2px 10px; border-radius: 6px; font-weight: bold;">GOLD TIER MEMBER</div>
                </div>

                <div style="font-size: 12px; font-weight: bold; text-align: left; margin-bottom: 6px;">🎁 រង្វាន់អាចប្តូរបាន៖</div>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left;">
                    <div style="background: rgba(16,185,129,0.08); border: 1px dashed #10b981; padding: 10px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                        <div>
                            <b style="color: #10b981; display: block;">ប័ណ្ណបញ្ចុះតម្លៃ $2</b>
                            <span style="font-size: 10px; color: var(--text-muted);">ប្រើប្រាស់ 50 ពិន្ទុ</span>
                        </div>
                        <button onclick="window.redeemLoyaltyReward(50, 'SKM2USD')" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">ប្តូរ</button>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981;" onclick="document.getElementById('skmLoyaltyWalletModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        updateLoyaltyDisplay();
    }

    function updateLoyaltyDisplay() {
        const disp = document.getElementById('walletPointsDisplay');
        if (!disp) return;
        let pts = localStorage.getItem('skm_pts') || '0';
        disp.innerText = `${pts} pts`;
    }

    window.redeemLoyaltyReward = function(cost, promoCode) {
        let pts = parseInt(localStorage.getItem('skm_pts') || '0');
        if (pts < cost) {
            alert('ពិន្ទុរបស់អ្នកមិនទាន់គ្រប់គ្រាន់សម្រាប់ប្តូររង្វាន់នេះទេ!');
            return;
        }

        pts -= cost;
        localStorage.setItem('skm_pts', pts);
        updateLoyaltyDisplay();

        const promoInput = document.getElementById('cPromo');
        if (promoInput) promoInput.value = promoCode;

        document.getElementById('skmLoyaltyWalletModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`ប្តូររង្វាន់ជោគជ័យ! បានដាក់កូដ: ${promoCode}`);
        else alert(`ប្តូររង្វាន់ជោគជ័យ! បានដាក់កូដ: ${promoCode}`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💳', 'កាបូបពិន្ទុ & រង្វាន់សមាជិក', openLoyaltyWalletModal, "loyalty_wallet.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [30/51] medication_reminder.js ===
window.skmRegisterBundledPlugin('menu', "medication_reminder.js", function() {
(function() {
    console.log("⏰ Menu Medication & Vitamin Reminder Plugin Initialized!");

    function openMedAlarmModal() {
        if(document.getElementById('skmMedAlarmModal')) {
            document.getElementById('skmMedAlarmModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmMedAlarmModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">⏰</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">មគ្គុទ្ទេសក៍ដាស់តឿនលេបថ្នាំ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">គន្លឹះក្នុងការកំណត់ម៉ោងដាស់តឿនខ្លួនឯងឱ្យលេបថ្នាំ ឬវីតាមីន៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(56,189,248,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #38bdf8; display: block; margin-bottom: 2px;">🌅 ពេលព្រឹក (07:00 AM)</b>
                        <span style="color: var(--text-muted);">ថ្នាំ ឬវីតាមីនញ៉ាំក្រោយពេលអាហារពេលព្រឹកភ្លាម។</span>
                    </div>
                    <div style="background: rgba(245,158,11,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #f59e0b; display: block; margin-bottom: 2px;">🌙 ពេលល្ងាច / មុនគេង (08:00 PM)</b>
                        <span style="color: var(--text-muted);">ថ្នាំបំបាត់ការឈឺចាប់ ឬថ្នាំពង្រឹងសុខភាពពេលយប់។</span>
                    </div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px; text-align: left;">
                    💡 អ្នកអាចប្រើប្រាស់កម្មវិធីនាឡិកា (Clock Alarm) ក្នុងទូរស័ព្ទដៃរបស់អ្នកដើម្បីកំណត់ម៉ោងដាស់តឿន។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmMedAlarmModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('⏰', 'មគ្គុទ្ទេសក៍ដាស់តឿនលេបថ្នាំ (Alarm Guide)', openMedAlarmModal, "medication_reminder.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [31/51] mixologist_master.js ===
window.skmRegisterBundledPlugin('menu', "mixologist_master.js", function() {
(function() {
    console.log("🍹 Menu Mixologist & Recipe Pairing Master Plugin Initialized!");

    function openMixologistModal() {
        if(document.getElementById('skmMixologistModal')) {
            document.getElementById('skmMixologistModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmMixologistModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(236,72,153,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">🍹</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #ec4899;">មេជាងលាយភេសជ្ជៈ (Mixologist)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">រូបមន្តលាយភេសជ្ជៈពិសេស និងការផ្សំគូគ្រឿងផ្សំ៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px; text-align: left;">
                    <div style="background: rgba(236,72,153,0.08); border: 1px solid #ec4899; padding: 12px; border-radius: 14px;">
                        <b style="color: #ec4899; font-size: 13px; display: block; margin-bottom: 2px;">🍊 វីតាមីន ស៊ី ស្រស់ស្រាយ (Citrus Blast)</b>
                        <span style="font-size: 11px; color: var(--text-muted);">ទឹកក្រូចឆ្មា + ទឹកឃ្មុំធម្មជាតិ + សូដាត្រជាក់</span>
                    </div>
                    <div style="background: rgba(56,189,248,0.08); border: 1px solid #38bdf8; padding: 12px; border-radius: 14px;">
                        <b style="color: #38bdf8; font-size: 13px; display: block; margin-bottom: 2px;">☕ កាហ្វេទឹកដោះគោសូកូឡា (Mocha Chill)</b>
                        <span style="font-size: 11px; color: var(--text-muted);">អេសប្រ៉េសូ + ទឹកដោះគោស្រស់ + សូកូឡាស្ងោរ</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(236,72,153,0.1); color:#ec4899; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmMixologistModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🍹', 'មេជាងលាយភេសជ្ជៈ (Mixologist)', openMixologistModal, "mixologist_master.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [32/51] mystery_box.js ===
window.skmRegisterBundledPlugin('menu', "mystery_box.js", function() {
(function() {
    console.log("🎁 Menu Mystery Box Plugin Initialized!");

    function openMysteryBoxModal() {
        if(document.getElementById('skmMysteryModal')) {
            document.getElementById('skmMysteryModal').style.display = 'flex';
            resetBoxes();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmMysteryModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 44px; margin-bottom: 5px;">🎁</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">ប្រអប់រង្វាន់អាថ៌កំបាំង (Mystery Box)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ជ្រើសរើសប្រអប់ ១ ក្នុងចំណោម ៣ ដើម្បីបើកយករង្វាន់អាថ៌កំបាំង៖</p>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px;" id="mysteryBoxGrid">
                    <button onclick="window.openMysteryBox(0)" class="m-box-btn" style="background: rgba(245,158,11,0.1); border: 1px solid #f59e0b; padding: 15px 10px; border-radius: 12px; font-size: 28px; cursor: pointer; transition: 0.2s;">📦</button>
                    <button onclick="window.openMysteryBox(1)" class="m-box-btn" style="background: rgba(245,158,11,0.1); border: 1px solid #f59e0b; padding: 15px 10px; border-radius: 12px; font-size: 28px; cursor: pointer; transition: 0.2s;">📦</button>
                    <button onclick="window.openMysteryBox(2)" class="m-box-btn" style="background: rgba(245,158,11,0.1); border: 1px solid #f59e0b; padding: 15px 10px; border-radius: 12px; font-size: 28px; cursor: pointer; transition: 0.2s;">📦</button>
                </div>

                <div id="mysteryResultBox" style="background: rgba(245,158,11,0.08); border: 1px dashed #f59e0b; padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: center; display: none;">
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">🎉 លទ្ធផលរង្វាន់របស់អ្នក:</div>
                    <div id="mysteryRewardText" style="font-size: 15px; font-weight: 900; color: #f59e0b;">---</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmMysteryModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function resetBoxes() {
        const resBox = document.getElementById('mysteryResultBox');
        if (resBox) resBox.style.display = 'none';
        document.querySelectorAll('.m-box-btn').forEach(btn => {
            btn.disabled = false;
            btn.innerText = '📦';
            btn.style.background = 'rgba(245,158,11,0.1)';
            btn.style.borderColor = '#f59e0b';
            btn.style.opacity = '1';
        });
    }

    window.openMysteryBox = function(idx) {
        const rewards = [
            { code: 'MYSTERY10', desc: 'ប័ណ្ណបញ្ចុះតម្លៃ 10%' },
            { code: 'MYSTERY5', desc: 'បញ្ចុះតម្លៃ $5.00' },
            { code: 'FREESHIP', desc: 'សេវាដឹកជញ្ជូនឥតគិតថ្លៃ' }
        ];
        
        const fallbackChosen = rewards[Math.floor(Math.random() * rewards.length)]; const chosen = window.skmGetRealPromo(fallbackChosen.code, fallbackChosen.desc);
        const resBox = document.getElementById('mysteryResultBox');
        const rewText = document.getElementById('mysteryRewardText');

        document.querySelectorAll('.m-box-btn').forEach((btn, i) => {
            btn.disabled = true;
            if (i === idx) {
                btn.innerText = '✨';
                btn.style.background = 'rgba(16,185,129,0.2)';
                btn.style.borderColor = '#10b981';
            } else {
                btn.innerText = '🎁';
                btn.style.opacity = '0.5';
            }
        });

        if (resBox && rewText) {
            resBox.style.display = 'block';
            rewText.innerHTML = `អបអរសាទរ! បានទទួលកូដ: <span style="color: #10b981;">${chosen.code}</span> (${chosen.desc})`;
            
            const promoInput = document.getElementById('cPromo');
            if (promoInput) promoInput.value = chosen.code;
            if (typeof showToast === 'function') showToast(`🎉 បើកប្រអប់រង្វាន់ជោគជ័យ បានកូដ: ${chosen.code}!`);
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎁', 'ប្រអប់រង្វាន់អាថ៌កំបាំង (Mystery Box)', openMysteryBoxModal, "mystery_box.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [33/51] photo_booth.js ===
window.skmRegisterBundledPlugin('menu', "photo_booth.js", function() {
(function() {
    console.log("📸 Menu Virtual Photo Booth Plugin Initialized!");

    function openPhotoBoothModal() {
        if(document.getElementById('skmPhotoBoothModal')) {
            document.getElementById('skmPhotoBoothModal').style.display = 'flex';
            startCameraStream();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmPhotoBoothModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 38px; margin-bottom: 5px;">📸</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">ថតរូបអនុស្សាវរីយ៍ប្រចាំហាង</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ថតរូបជាមួយស៊ុមឌីជីថលដ៏ស្រស់ស្អាតប្រចាំហាង៖</p>
                
                <div style="position: relative; width: 100%; height: 240px; background: #000; border-radius: 16px; overflow: hidden; margin-bottom: 15px; border: 2px solid #38bdf8;">
                    <video id="boothVideo" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
                    <div style="position: absolute; bottom: 10px; left: 0; width: 100%; text-align: center; color: #fff; font-size: 12px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.8); pointer-events: none;">✨ Digital Menu Store Experience ✨</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #38bdf8; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.captureBoothPhoto()">📸 ថតរូប (Capture)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="window.closePhotoBooth()">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        startCameraStream();
    }

    function startCameraStream() {
        const video = document.getElementById('boothVideo');
        if (!video) return;

        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
            .then(stream => {
                video.srcObject = stream;
                window.boothStream = stream;
            })
            .catch(err => {
                console.warn("Camera access denied or unavailable:", err);
                video.style.display = 'none';
                video.parentElement.innerHTML += `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#94a3b8; font-size:12px; padding:20px;">📷 កាមេរ៉ាមិនអាចដំណើរការបាន ឬមិនមានការអនុញ្ញាត</div>`;
            });
    }

    window.captureBoothPhoto = function() {
        if (typeof showToast === 'function') showToast('📸 ថតរូបអនុស្សាវរីយ៍ជោគជ័យ!');
        else alert('📸 ថតរូបអនុស្សាវរីយ៍ជោគជ័យ!');
    };

    window.closePhotoBooth = function() {
        if (window.boothStream) {
            window.boothStream.getTracks().forEach(track => track.stop());
        }
        document.getElementById('skmPhotoBoothModal').style.display = 'none';
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📸', 'ថតរូបអនុស្សាវរីយ៍ (Photo Booth)', openPhotoBoothModal, "photo_booth.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [34/51] quick_price_check.js ===
window.skmRegisterBundledPlugin('menu', "quick_price_check.js", function() {
(function() {
    console.log("🔍 Menu Quick Price Check Plugin Initialized!");

    function openPriceCheckModal() {
        if(document.getElementById('skmPriceCheckModal')) {
            document.getElementById('skmPriceCheckModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmPriceCheckModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🔍</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ពិនិត្យតម្លៃទំនិញរហ័ស</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">វាយឈ្មោះ ឬលេខកូដទំនិញដើម្បីពិនិត្យតម្លៃ៖</p>
                
                <input type="text" id="priceCheckInput" placeholder="ឈ្មោះ ឬលេខកូដ..." style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 12px; outline: none; margin-bottom: 12px; font-family:'Battambang';" oninput="window.executePriceCheck()">

                <div id="priceCheckResultBox" style="background: rgba(56,189,248,0.08); border: 1px solid var(--border-color); padding: 15px; border-radius: 14px; margin-bottom: 15px; text-align: center; display: none;">
                    <img id="pcImg" src="https://placehold.co/60" style="width: 60px; height: 60px; object-fit: contain; border-radius: 8px; background: #fff; margin-bottom: 6px;">
                    <div id="pcName" style="font-size: 13px; font-weight: 900; color: var(--text-dark); margin-bottom: 4px;">---</div>
                    <div id="pcPrice" style="font-size: 15px; font-weight: 900; color: #10b981;">$0.00</div>
                    <div id="pcStock" style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">ស្តុក: ---</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmPriceCheckModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.executePriceCheck = function() {
        const query = document.getElementById('priceCheckInput').value.trim().toLowerCase();
        const resBox = document.getElementById('priceCheckResultBox');
        if (!query) {
            resBox.style.display = 'none';
            return;
        }

        let inv = window.inventory || [];
        let match = inv.find(p => String(p.name).toLowerCase().includes(query) || String(p.id).toLowerCase().includes(query) || (p.customId && String(p.customId).toLowerCase().includes(query)));

        if (!match) {
            resBox.style.display = 'block';
            document.getElementById('pcName').innerText = 'រកមិនឃើញទំនិញនេះទេ';
            document.getElementById('pcPrice').innerText = '---';
            document.getElementById('pcStock').innerText = '---';
            document.getElementById('pcImg').src = 'https://placehold.co/60';
            return;
        }

        resBox.style.display = 'block';
        document.getElementById('pcName').innerText = match.name;
        document.getElementById('pcPrice').innerText = `$${parseFloat(match.price || 0).toFixed(2)}`;
        document.getElementById('pcStock').innerText = `ស្តុកនៅសល់: ${match.qty} ឯកតា`;
        document.getElementById('pcImg').src = match.image || 'https://placehold.co/60';
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔍', 'ពិនិត្យតម្លៃទំនិញរហ័ស (Price Check)', openPriceCheckModal, "quick_price_check.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [35/51] quick_reorder.js ===
window.skmRegisterBundledPlugin('menu', "quick_reorder.js", function() {
(function() {
    console.log("🔄 Menu Quick Reorder Plugin Initialized!");

    function openQuickReorderModal() {
        if(document.getElementById('skmReorderModalMenu')) {
            document.getElementById('skmReorderModalMenu').style.display = 'flex';
            loadPastOrders();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmReorderModalMenu';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🔄</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #10b981;">កុម្មង់ឡើងវិញរហ័ស (Quick Reorder)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ទំនិញដែលអ្នកធ្លាប់បានកុម្មង់ពីមុន៖</p>
                
                <div id="skmPastOrdersList" style="max-height: 240px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px; text-align: left;">
                    <!-- Injected via JS -->
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981;" onclick="document.getElementById('skmReorderModalMenu').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        loadPastOrders();
    }

    function loadPastOrders() {
        const list = document.getElementById('skmPastOrdersList');
        if (!list) return;

        let orders = JSON.parse(localStorage.getItem('skm_my_orders_history') || '[]');
        if (orders.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">មិនទាន់មានប្រវត្តិការកុម្មង់ទេ</div>';
            return;
        }

        let itemsMap = {};
        orders.forEach(o => {
            if (o.items && Array.isArray(o.items)) {
                o.items.forEach(it => {
                    itemsMap[it.name] = it;
                });
            }
        });

        let uniqueItems = Object.values(itemsMap);
        if (uniqueItems.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">គ្មានទំនិញក្នុងប្រវត្តិទេ</div>';
            return;
        }

        list.innerHTML = uniqueItems.map(p => `
            <div style="background: rgba(16,185,129,0.08); padding: 10px; border-radius: 10px; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${p.image || 'https://placehold.co/40'}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #fff;">
                    <div>
                        <b style="color: var(--text-dark); display: block; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</b>
                        <span style="color: #10b981; font-weight: 900;">$${parseFloat(p.price || 0).toFixed(2)}</span>
                    </div>
                </div>
                <button onclick="window.openProductByName('${p.name}'); document.getElementById('skmReorderModalMenu').style.display='none';" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">មើល</button>
            </div>
        `).join('');
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔄', 'កុម្មង់ឡើងវិញរហ័ស (Quick Reorder)', openQuickReorderModal, "quick_reorder.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [36/51] savings_calculator.js ===
window.skmRegisterBundledPlugin('menu', "savings_calculator.js", function() {
(function() {
    console.log("💰 Menu Savings & Cash Back Goal Calculator Plugin Initialized modularly!");

    function openSavingsModal() {
        if(document.getElementById('skmSavingsModal')) {
            document.getElementById('skmSavingsModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmSavingsModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">💰</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">គណនាសន្សំប្រាក់ & កម្រិតសន្សំ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">គណនាប្រាក់ដែលអ្នកសន្សំបានពីការកុម្មង់ជាមួយប្រេនយើងខ្ញុំ៖</p>
                
                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">ចំនួនដងដែលទិញក្នុងមួយខែ:</div>
                <input type="number" id="savingsVisits" value="4" min="1" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: #fff; font-size: 12px; outline: none; margin-bottom: 12px; font-family:'Battambang';" oninput="window.calcSavingsResult()">

                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted);">ប្រាក់សន្សំបានប៉ាន់ស្មានក្នុងមួយឆ្នាំ:</div>
                    <div id="savingsResultDisplay" style="font-size: 26px; font-weight: 900; color: #10b981; margin-top: 5px;">$48.00</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 12px; cursor: pointer;" onclick="document.getElementById('skmSavingsModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        window.calcSavingsResult();
    }

    window.calcSavingsResult = function() {
        const vis = parseInt(document.getElementById('savingsVisits').value) || 4;
        const disp = document.getElementById('savingsResultDisplay');
        if (!disp) return;

        let yearlySavings = vis * 1 * 12;
        disp.innerText = `$${yearlySavings.toFixed(2)}`;
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💰', 'គណនាសន្សំប្រាក់ (Savings Calculator)', openSavingsModal, "savings_calculator.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [37/51] scheduled_pickup.js ===
window.skmRegisterBundledPlugin('menu', "scheduled_pickup.js", function() {
(function() {
    console.log("⏰ Menu Scheduled Pickup & Arrival Time Plugin Initialized!");

    function openSchedulePickupModal() {
        if(document.getElementById('skmScheduleModal')) {
            document.getElementById('skmScheduleModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmScheduleModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        let savedTime = localStorage.getItem('skm_scheduled_pickup_time') || '15 នាទីទៀត (15 mins)';

        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">⏰</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">កុម្មង់ទុកមុន & កំណត់ម៉ោងមកយក</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">តើលោកអ្នកចង់មកយកទំនិញនៅពេលណា?</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
                    <button class="skm-sched-btn" onclick="window.setPickupTime('10 នាទីទៀត')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">⚡ មកយកក្នុងពេល ១០ នាទីទៀត</button>
                    <button class="skm-sched-btn" onclick="window.setPickupTime('20 នាទីទៀត')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">⚡ មកយកក្នុងពេល ២០ នាទីទៀត</button>
                    <button class="skm-sched-btn" onclick="window.setPickupTime('30 នាទីទៀត')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">⏰ មកយកក្នុងពេល ៣០ នាទីទៀត</button>
                    <button class="skm-sched-btn" onclick="window.setPickupTime('1 ម៉ោងទៀត')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">🕐 មកយកក្នុងពេល ១ ម៉ោងទៀត</button>
                </div>

                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">ឬកំណត់ម៉ោងជាក់លាក់៖</div>
                <input type="time" id="schedCustomTime" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 14px; outline: none; margin-bottom: 15px; font-family:'Battambang';" onchange="window.setCustomPickupTime(this.value)">

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmScheduleModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.setPickupTime = function(timeText) {
        localStorage.setItem('skm_scheduled_pickup_time', timeText);
        updateCartNoteWithSchedule(timeText);
        document.getElementById('skmScheduleModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`បានកំណត់ម៉ោងមកយក: ${timeText}`);
    };

    window.setCustomPickupTime = function(timeVal) {
        if (!timeVal) return;
        let text = `មកយកនៅម៉ោង ${timeVal}`;
        localStorage.setItem('skm_scheduled_pickup_time', text);
        updateCartNoteWithSchedule(text);
        document.getElementById('skmScheduleModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`បានកំណត់ម៉ោងមកយក: ${text}`);
    };

    function updateCartNoteWithSchedule(scheduleText) {
        const noteInput = document.getElementById('cNote');
        if (!noteInput) return;

        let currentVal = noteInput.value.replace(/\[មកយកម៉ោង:.*?\]/g, '').trim();
        noteInput.value = `[មកយកម៉ោង: ${scheduleText}] ${currentVal}`.trim();
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('⏰', 'កុម្មង់ទុកមុន & កំណត់ម៉ោងមកយក', openSchedulePickupModal, "scheduled_pickup.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [38/51] scratch_card.js ===
window.skmRegisterBundledPlugin('menu', "scratch_card.js", function() {
(function() {
    console.log("🎫 Menu Scratch & Win Card Plugin Initialized!");

    function openScratchModal() {
        if(document.getElementById('skmScratchCardModal')) {
            document.getElementById('skmScratchCardModal').style.display = 'flex';
            resetScratchCanvas();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmScratchCardModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🎫</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">កាតកោសឈ្នះរង្វាន់អាថ៌កំបាំង</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">កោសលើកាតខាងក្រោមដើម្បីស្វែងរកកូដបញ្ចុះតម្លៃពិសេសរបស់អ្នក៖</p>
                
                <div style="position: relative; width: 280px; height: 120px; margin: 0 auto 15px auto; border-radius: 14px; overflow: hidden; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 15px rgba(0,0,0,0.3);">
                    <div id="scratchRewardText" style="font-size: 18px; font-weight: 900; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🎉 កូដ: SCRATCH15 (-$1.50)</div>
                    <canvas id="scratchCanvas" width="280" height="120" style="position: absolute; top: 0; left: 0; cursor: pointer; border-radius: 14px;"></canvas>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #f59e0b; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px;" onclick="window.applyScratchReward()">🎟️ យកកូដនេះទៅប្រើប្រាស់</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px;" onclick="document.getElementById('skmScratchCardModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(resetScratchCanvas, 100);
    }

    function resetScratchCanvas() {
        const canvas = document.getElementById('scratchCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 14px Battambang, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🖱️ កោសត្រង់នេះដើម្បីមើលរង្វាន់', canvas.width / 2, canvas.height / 2 + 5);

        let isDrawing = false;

        function scratch(e) {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
            const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2, false);
            ctx.fill();
        }

        canvas.onmousedown = () => { isDrawing = true; };
        canvas.onmousemove = scratch;
        window.onmouseup = () => { isDrawing = false; };

        canvas.ontouchstart = () => { isDrawing = true; };
        canvas.ontouchmove = scratch;
        canvas.ontouchend = () => { isDrawing = false; };
    }

    window.applyScratchReward = function() {
        const promoInput = document.getElementById('cPromo');
        if (!promoInput) {
            if (typeof showToast === 'function') showToast('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!', true);
            else alert('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!');
            document.getElementById('skmScratchCardModal').style.display = 'none';
            return;
        }
        const rp = window.skmGetRealPromo('SCRATCH15', 'បញ្ចុះ $1.50'); promoInput.value = rp.code;
        document.getElementById('skmScratchCardModal').style.display = 'none';
        if (typeof applyPromo === 'function') applyPromo();
        if (typeof showToast === 'function') showToast('បានដាក់កូដ SCRATCH15 ជោគជ័យ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎫', 'កាតកោសឈ្នះរង្វាន់ (Scratch Card)', openScratchModal, "scratch_card.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [39/51] smart_pairing.js ===
window.skmRegisterBundledPlugin('menu', "smart_pairing.js", function() {
(function() {
    console.log("🥐 Menu Smart Food Pairing Plugin Initialized!");

    function openPairingModal() {
        if(document.getElementById('skmPairingModal')) {
            document.getElementById('skmPairingModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmPairingModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🥐</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">ការណែនាំម្ហូបញ៉ាំគូគ្នា (Smart Pairing)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">មុខម្ហូប ឬភេសជ្ជៈដែលញ៉ាំគូគ្នាឆ្ងាញ់ខ្លាំង៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(245,158,11,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #f59e0b; display: block; margin-bottom: 2px;">☕ កាហ្វេទឹកកក + នំប៉័ងអាំង</b>
                        <span style="color: var(--text-muted);">រសជាតិផ្អែមស្រទន់ ញ៉ាំពេលព្រឹកត្រូវគ្នាខ្លាំង!</span>
                    </div>
                    <div style="background: rgba(56,189,248,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #38bdf8; display: block; margin-bottom: 2px;">🍜 មីហឹរ + តែក្រូចឆ្មាត្រជាក់</b>
                        <span style="color: var(--text-muted);">កាត់បន្ថយភាពហឹរបានយ៉ាងល្អ ស្រស់ស្រាយមាត់។</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b;" onclick="document.getElementById('skmPairingModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🥐', 'ការណែនាំម្ហូបគូគ្នា (Smart Pairing)', openPairingModal, "smart_pairing.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [40/51] spin_the_bottle.js ===
window.skmRegisterBundledPlugin('menu', "spin_the_bottle.js", function() {
(function() {
    console.log("🍾 Menu Spin the Bottle Plugin Initialized!");

    function openBottleSpinModal() {
        if(document.getElementById('skmBottleModal')) {
            document.getElementById('skmBottleModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmBottleModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(236,72,153,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 38px; margin-bottom: 5px;">🍾</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #ec4899;">ល្បែងបង្វិលដបឈ្នះរង្វាន់</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">បង្វិលដបដើម្បីសាកល្បងសំណាង និងឈ្នះរង្វាន់ពិសេស៖</p>
                
                <div style="background: rgba(236,72,153,0.08); border: 1px dashed #ec4899; padding: 20px; border-radius: 16px; margin-bottom: 15px; text-align: center;">
                    <div id="bottleIcon" style="font-size: 48px; margin-bottom: 8px; transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);">🍾</div>
                    <div id="bottleResultText" style="font-size: 14px; font-weight: 900; color: #ec4899;">ចុចប៊ូតុងខាងក្រោមដើម្បីបង្វិល!</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #ec4899; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.spinTheBottleGame()">🍾 បង្វិលដប (Spin)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(236,72,153,0.1); color:#ec4899; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmBottleModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.spinTheBottleGame = function() {
        const bottle = document.getElementById('bottleIcon');
        const text = document.getElementById('bottleResultText');
        if (!bottle) return;

        bottle.style.transform = `rotate(${Math.floor(720 + Math.random() * 1080)}deg)`;
        text.innerText = 'កំពុងបង្វិលដបសំណាង...';

        setTimeout(() => {
            const rewards = [
                '🎉 អបអរសាទរ! បានទទួលកូដ BOTTLE10 (-10%)',
                '🌟 ឈ្នះកូដបញ្ចុះតម្លៃ $2.00!',
                '💫 ឈ្នះសេវាដឹកជញ្ជូនឥតគិតថ្លៃ!',
                '🍀 ទទួលបានពិន្ទុបន្ថែម ២០ ពិន្ទុ!'
            ];
            let randReward = rewards[Math.floor(Math.random() * rewards.length)];
            text.innerHTML = `<span style="color: #10b981; font-size: 13px;">${randReward}</span>`;
            if (typeof showToast === 'function') showToast('🎉 បង្វិលដបឈ្នះរង្វាន់ជោគជ័យ!');
        }, 1000);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🍾', 'ល្បែងបង្វិលដបឈ្នះរង្វាន់ (Spin)', openBottleSpinModal, "spin_the_bottle.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [41/51] store_status.js ===
window.skmRegisterBundledPlugin('menu', "store_status.js", function() {
(function() {
    console.log("🕒 Menu Store Status & Operating Hours Plugin Initialized!");

    function openStoreStatusModal() {
        const s = window.sysSettings || {};
        const openT = s.openTime || '08:00';
        const closeT = s.closeTime || '21:00';
        const now = new Date();
        const curT = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        const isClosed = Boolean(s.toggleStoreHours) && (curT < openT || curT > closeT);
        const statusHtml = isClosed
            ? '<span style="color:#ef4444; font-weight:bold;">បិទសម្រាកបណ្តោះអាសន្ន (CLOSED)</span>'
            : '<span style="color:#10b981; font-weight:bold;">កំពុងបើកដំណើរការ (OPEN)</span>';
        const dotIcon = isClosed ? '🔴' : '🟢';

        let modal = document.getElementById('skmStatusModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmStatusModal';
            modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🕒</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #10b981;">ស្ថានភាពហាង & ម៉ោងបើក</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ពិនិត្យម៉ោងបម្រើការងាររបស់ហាងយើងខ្ញុំ៖</p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 15px; border-radius: 14px; margin-bottom: 15px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 8px;">
                    <div>${dotIcon} <b>ស្ថានភាពបច្ចុប្បន្ន:</b> ${statusHtml}</div>
                    <div>🕒 <b>ម៉ោងបើកហាង:</b> ${openT} - ${closeT}</div>
                    <div>📅 <b>ថ្ងៃធ្វើការ:</b> បើកបម្រើការរាល់ថ្ងៃ (ច័ន្ទ - អាទិត្យ)</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981;" onclick="document.getElementById('skmStatusModal').style.display='none'">បិទ</button>
            </div>
        `;
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🕒', 'ស្ថានភាពហាង & ម៉ោងបើក (Status)', openStoreStatusModal, "store_status.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [42/51] substitute_finder.js ===
window.skmRegisterBundledPlugin('menu', "substitute_finder.js", function() {
(function() {
    console.log("🔄 Menu Substitute & Alternative Finder Plugin Initialized!");

    function openSubstituteModal() {
        if(document.getElementById('skmSubModal')) {
            document.getElementById('skmSubModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmSubModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🔄</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">ស្វែងរកទំនិញ ឬថ្នាំជំនួស</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">វាយឈ្មោះទំនិញ ឬថ្នាំដែលអស់ស្តុក ដើម្បីរកមុខទំនិញស្រដៀងគ្នា៖</p>
                
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <input type="text" id="subQueryInput" placeholder="ឧ. ប៉ារ៉ាសេតាមុល ឬកាហ្វេ..." style="flex: 1; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 12px; color: #fff; font-size: 12px; outline: none; font-family: 'Battambang';" onkeydown="if(event.key==='Enter') window.findSubstituteItems()">
                    <button onclick="window.findSubstituteItems()" style="background: linear-gradient(135deg, #38bdf8, #2563eb); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">ស្វែងរក</button>
                </div>

                <div id="subResultContainer" style="max-height: 220px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 6px; text-align: left; font-size: 12px;">
                    <div style="text-align:center; padding:20px; color:var(--text-muted);">សូមវាយឈ្មោះទំនិញខាងលើដើម្បីស្វែងរកជំនួស</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 12px; cursor: pointer;" onclick="document.getElementById('skmSubModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.findSubstituteItems = function() {
        const inp = document.getElementById('subQueryInput');
        const container = document.getElementById('subResultContainer');
        const query = inp.value.trim().toLowerCase();

        if (!query) {
            container.innerHTML = '<div style="text-align:center; color:#ef4444; padding:15px;">សូមវាយឈ្មោះទំនិញសិន!</div>';
            return;
        }

        let inv = window.inventory || [];
        // Find alternative items in inventory
        let matching = inv.filter(p => String(p.name).toLowerCase().includes(query) || String(p.category).toLowerCase().includes(query));

        if (matching.length === 0 && inv.length > 0) {
            // Fallback to random similar items
            matching = inv.slice(0, 3);
        }

        if (matching.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:15px;">រកមិនឃើញទំនិញជំនួសក្នុងស្តុកទេ</div>';
            return;
        }

        container.innerHTML = matching.map(p => `
            <div style="background: rgba(56,189,248,0.06); border: 1px solid var(--border-color); padding: 10px 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${p.image || 'https://placehold.co/40'}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 8px; background: #fff;">
                    <div>
                        <b style="color: #38bdf8; display: block; font-size: 12px; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</b>
                        <span style="font-size: 11px; color: var(--text-dark); font-weight: 900;">$${parseFloat(p.price || 0).toFixed(2)} (ស្តុក: ${p.qty})</span>
                    </div>
                </div>
                <button onclick="window.openProductByName('${p.name}'); document.getElementById('skmSubModal').style.display='none';" style="background: #38bdf8; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">រើស</button>
            </div>
        `).join('');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔄', 'ស្វែងរកទំនិញ/ថ្នាំជំនួស (Substitute)', openSubstituteModal, "substitute_finder.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [43/51] table_notes_board.js ===
window.skmRegisterBundledPlugin('menu', "table_notes_board.js", function() {
(function() {
    console.log("📝 Menu Table Notes & Greetings Board Plugin Initialized!");

    function openTableNotesModal() {
        if(document.getElementById('skmTableNotesModal')) {
            document.getElementById('skmTableNotesModal').style.display = 'flex';
            loadTableNotes();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmTableNotesModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">📝</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">ក្ដារខៀនសារលើតុ (Table Board)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ទុកសរសេរសារស្វាគមន៍ ឬកំណត់ចំណាំសម្រាប់តុរបស់អ្នក៖</p>
                
                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <input type="text" id="tableNoteInput" placeholder="ឧ. តុលេខ ៥ ញ៉ាំឱ្យឆ្ងាញ់ណា..." style="flex: 1; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 12px; color: #fff; font-size: 12px; outline: none; font-family: 'Battambang';" onkeydown="if(event.key==='Enter') window.addTableNote()">
                    <button onclick="window.addTableNote()" style="background: linear-gradient(135deg, #38bdf8, #2563eb); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">រក្សាទុក</button>
                </div>

                <div id="tableNotesContainer" style="max-height: 200px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 6px; text-align: left; font-size: 12px;">
                    <div style="text-align:center; padding:15px; color:var(--text-muted);">មិនទាន់មានសារនៅលើក្ដារខៀនតុទេ</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 12px; cursor: pointer;" onclick="document.getElementById('skmTableNotesModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        loadTableNotes();
    }

    function loadTableNotes() {
        const container = document.getElementById('tableNotesContainer');
        if (!container) return;

        let notes = JSON.parse(localStorage.getItem('skm_table_notes_board') || '[]');
        if (notes.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:15px; color:var(--text-muted);">មិនទាន់មានសារនៅលើក្ដារខៀនតុទេ</div>';
            return;
        }

        let savedTable = localStorage.getItem('skm_selected_table') || 'តុលេខ ១';
        container.innerHTML = notes.map((n, idx) => `
            <div style="background: rgba(56,189,248,0.06); border: 1px solid var(--border-color); padding: 10px 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <b style="color: #38bdf8; display: block; font-size: 12px;">📌 [${savedTable}] ${n.text}</b>
                    <span style="font-size: 10px; color: var(--text-muted);">${n.time}</span>
                </div>
                <button onclick="window.removeTableNote(${idx})" style="background: rgba(239,68,68,0.1); color: #ef4444; border: none; padding: 6px 10px; border-radius: 8px; font-size: 11px; cursor: pointer;">✕</button>
            </div>
        `).join('');
    }

    window.addTableNote = function() {
        const inp = document.getElementById('tableNoteInput');
        const text = inp.value.trim();
        if (!text) { alert('សូមសរសេរសារសិន!'); return; }

        let notes = JSON.parse(localStorage.getItem('skm_table_notes_board') || '[]');
        notes.unshift({
            text: text,
            time: new Date().toLocaleString('km-KH')
        });
        localStorage.setItem('skm_table_notes_board', JSON.stringify(notes));

        inp.value = '';
        loadTableNotes();
        if (typeof showToast === 'function') showToast('បានរក្សាទុកសារនៅលើក្ដារខៀនតុជោគជ័យ!');
    };

    window.removeTableNote = function(idx) {
        let notes = JSON.parse(localStorage.getItem('skm_table_notes_board') || '[]');
        notes.splice(idx, 1);
        localStorage.setItem('skm_table_notes_board', JSON.stringify(notes));
        loadTableNotes();
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📝', 'ក្ដារខៀនសារលើតុ (Table Board)', openTableNotesModal, "table_notes_board.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [44/51] tip_jar.js ===
window.skmRegisterBundledPlugin('menu', "tip_jar.js", function() {
(function() {
    console.log("💌 Menu Digital Tip Jar & Compliment Plugin Initialized!");

    function openTipJarModal() {
        if(document.getElementById('skmTipJarModal')) {
            document.getElementById('skmTipJarModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmTipJarModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(236,72,153,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 44px; margin-bottom: 5px;">💌</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #ec4899;">ប្រអប់ធីប និងសរសើរអ្នកបំរើ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ផ្ញើទឹកចិត្ត ឬសរសើរដល់បុគ្គលិកដែលបម្រើការងារប្រចាំតុរបស់អ្នក៖</p>
                
                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">ជ្រើសរើសទឹកប្រាក់ធីប ($):</div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 12px;">
                    <button onclick="window.selectTipAmount(1)" class="tip-amt-btn" style="background: rgba(236,72,153,0.1); color: #ec4899; border: 1px solid #ec4899; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: bold; cursor: pointer;">$1.00</button>
                    <button onclick="window.selectTipAmount(2)" class="tip-amt-btn" style="background: rgba(236,72,153,0.1); color: #ec4899; border: 1px solid #ec4899; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: bold; cursor: pointer;">$2.00</button>
                    <button onclick="window.selectTipAmount(5)" class="tip-amt-btn" style="background: rgba(236,72,153,0.1); color: #ec4899; border: 1px solid #ec4899; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: bold; cursor: pointer;">$5.00</button>
                    <button onclick="window.selectTipAmount(10)" class="tip-amt-btn" style="background: rgba(236,72,153,0.1); color: #ec4899; border: 1px solid #ec4899; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: bold; cursor: pointer;">$10.00</button>
                </div>

                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">សារសរសើរ / ជូនពរ:</div>
                <textarea id="tipMessageInp" placeholder="ឧ. បុគ្គលិកបម្រើការបានល្អរាក់ទាក់ខ្លាំងណាស់..." style="width: 100%; height: 75px; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: #fff; font-family: 'Battambang'; font-size: 12px; resize: none; outline: none; margin-bottom: 15px;"></textarea>

                <button class="btn-act btn-green" style="width: 100%; background: #ec4899; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.submitTipAndCompliment()">💖 ផ្ញើធីប & សារសរសើរ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(236,72,153,0.1); color:#ec4899; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmTipJarModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        window.selectedTipVal = 2.00;
    }

    window.selectTipAmount = function(amt) {
        window.selectedTipVal = amt;
        if (typeof showToast === 'function') showToast(`បានជ្រើសរើសប្រាក់ធីប: $${amt.toFixed(2)}`);
    };

    window.submitTipAndCompliment = function() {
        const msg = document.getElementById('tipMessageInp').value.trim();
        const amt = window.selectedTipVal || 2.00;
        let savedTable = localStorage.getItem('skm_selected_table') || 'តុលេខ ១';

        let tips = JSON.parse(localStorage.getItem('skm_shop_tips_log') || '[]');
        tips.unshift({
            table: savedTable,
            amount: amt,
            message: msg || 'សរសើរការបម្រើការងារល្អ',
            time: new Date().toLocaleString('km-KH')
        });
        localStorage.setItem('skm_shop_tips_log', JSON.stringify(tips));

        document.getElementById('skmTipJarModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`❤️ អរគុណច្រើន! បានផ្ញើធីប $${amt.toFixed(2)} ជូនបុគ្គលិកជោគជ័យ!`);
        else alert(`❤️ អរគុណច្រើន! បានផ្ញើធីប $${amt.toFixed(2)} ជូនបុគ្គលិកជោគជ័យ!`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💌', 'ប្រអប់ធីប និងសរសើរអ្នកបំរើ (Tip Jar)', openTipJarModal, "tip_jar.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [45/51] trivia_challenge.js ===
window.skmRegisterBundledPlugin('menu', "trivia_challenge.js", function() {
(function() {
    console.log("🧠 Menu Table Trivia & Quiz Challenge Plugin Initialized!");

    function openTriviaModal() {
        if(document.getElementById('skmTriviaModal')) {
            document.getElementById('skmTriviaModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmTriviaModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🧠</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">ល្បែងសំណួរចំណេះដឹងពេលរង់ចាំ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ឆ្លើយសំណួរឱ្យត្រូវដើម្បីឈ្នះកូដបញ្ចុះតម្លៃពិសេស!</p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <b style="color: #10b981; display: block; margin-bottom: 8px;">សំណួរ៖ តើកាហ្វេប្រភេទណាដែលល្បីល្បាញជាងគេលើពិភពលោក?</b>
                    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px;">
                        <button onclick="window.answerTrivia(false)" style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid var(--border-color); padding: 10px; border-radius: 10px; cursor: pointer; text-align: left; font-family:'Battambang'; font-size:11px;">ក. កាហ្វេបៃតងឆៅ</button>
                        <button onclick="window.answerTrivia(true)" style="background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid #10b981; padding: 10px; border-radius: 10px; cursor: pointer; text-align: left; font-family:'Battambang'; font-size:11px; font-weight:bold;">ខ. កាហ្វេអារ៉ាប៊ីកា (Arabica)</button>
                        <button onclick="window.answerTrivia(false)" style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid var(--border-color); padding: 10px; border-radius: 10px; cursor: pointer; text-align: left; font-family:'Battambang'; font-size:11px;">គ. តែបៃតងក្រអូប</button>
                    </div>
                </div>

                <div id="triviaResultMsg" style="font-size: 12px; font-weight: bold; margin-bottom: 15px; display: none;"></div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmTriviaModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.answerTrivia = function(isCorrect) {
        const msg = document.getElementById('triviaResultMsg');
        if (!msg) return;
        msg.style.display = 'block';

        if (isCorrect) {
            msg.innerHTML = `<span style="color: #10b981;">🎉 ត្រឹមត្រូវស្ដូក! អ្នកឈ្នះកូដ: <b style="font-size:14px;">TRIVIA15</b> (បញ្ចុះ $1.50)</span>`;
            const promoInput = document.getElementById('cPromo');
            if (promoInput) { const rp = window.skmGetRealPromo('TRIVIA15', 'បញ្ចុះ $1.50'); promoInput.value = rp.code; }
            if (typeof showToast === 'function') showToast('អបអរសាទរ! បានដាក់កូដ TRIVIA15 ជោគជ័យ!');
        } else {
            msg.innerHTML = `<span style="color: #ef4444;">❌ ខុសហើយ! ចម្លើយដែលត្រឹមត្រូវគឺ ខ. អារ៉ាប៊ីកា។</span>`;
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🧠', 'ល្បែងសំណួរចំណេះដឹង (Trivia Challenge)', openTriviaModal, "trivia_challenge.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [46/51] vip_subscription_pass.js ===
window.skmRegisterBundledPlugin('menu', "vip_subscription_pass.js", function() {
(function() {
    console.log("🎫 Menu VIP Subscription Pass Plugin Initialized!");

    function openVipSubModal() {
        if(document.getElementById('skmVipSubModal')) {
            document.getElementById('skmVipSubModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmVipSubModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">🎫</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">កាតសមាជិកប្រចាំខែ (VIP Pass)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ទិញកញ្ចប់សមាជិកប្រចាំខែដើម្បីសន្សំសំចៃកាន់តែច្រើន៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px; text-align: left;">
                    <div style="background: rgba(245,158,11,0.08); border: 1px solid #f59e0b; padding: 12px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <b style="color: #f59e0b; font-size: 13px; display: block;">☕ កញ្ចប់កាហ្វេ ៣០ កែវ/ខែ</b>
                            <span style="font-size: 10px; color: var(--text-muted);">តម្លៃពិសេស: $45.00 (ចំណេញ $30)</span>
                        </div>
                        <button onclick="window.subscribeVipPass('Coffee Pass 30 Days', 45)" style="background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">ទិញ</button>
                    </div>
                    <div style="background: rgba(16,185,129,0.08); border: 1px solid #10b981; padding: 12px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <b style="color: #10b981; font-size: 13px; display: block;">🍜 កញ្ចប់ម្ហូបប្រចាំខែ VIP</b>
                            <span style="font-size: 10px; color: var(--text-muted);">តម្លៃពិសេស: $80.00 (ហ្វ្រីសេវាដឹក)</span>
                        </div>
                        <button onclick="window.subscribeVipPass('Food Pass 30 Days', 80)" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">ទិញ</button>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px;" onclick="document.getElementById('skmVipSubModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.subscribeVipPass = function(passName, price) {
        let cartItem = {
            id: 'SUB-' + Date.now(),
            name: `🎫 [VIP Pass] ${passName}`,
            price: price,
            image: 'https://placehold.co/200/0f172a/f59e0b?text=VIP+Pass',
            cartId: 'sub_' + Date.now(),
            cartVar: 'សមាជិកប្រចាំខែ',
            qty: 1
        };

        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
            cart.push(cartItem);
            if (typeof updateCartBadges === 'function') updateCartBadges();
            if (typeof renderCart === 'function') renderCart();
            if (typeof updateTotal === 'function') updateTotal();
        }

        document.getElementById('skmVipSubModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`បានទិញកញ្ចប់ ${passName} ជោគជ័យ!`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎫', 'កាតសមាជិកប្រចាំខែ (VIP Pass)', openVipSubModal, "vip_subscription_pass.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [47/51] virtual_pet.js ===
window.skmRegisterBundledPlugin('menu', "virtual_pet.js", function() {
(function() {
    console.log("🐾 Menu Virtual Pet & Mascot Companion Plugin Initialized!");

    function openVirtualPetModal() {
        if(document.getElementById('skmPetModal')) {
            document.getElementById('skmPetModal').style.display = 'flex';
            updatePetStats();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmPetModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 50px; margin-bottom: 5px; animation: petBounce 1.5s infinite;" id="petAvatar">🐶</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">សត្វចិញ្ចឹមកំសាន្តប្រចាំហាង</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ចិញ្ចឹម និងលេងជាមួយសត្វចិញ្ចឹមកំសាន្តដើម្បីទទួលបានកូដពិសេស៖</p>
                
                <div style="background: rgba(245,158,11,0.08); border: 1px dashed #f59e0b; padding: 15px; border-radius: 16px; margin-bottom: 15px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 6px;">
                    <div>❤️ <b>កម្រិតក្ដីស្រលាញ់ (Love):</b> <span id="petLoveScore" style="color: #10b981; font-weight: bold;">80%</span></div>
                    <div>🍖 <b>កម្រិតឆ្អែត (Hunger):</b> <span id="petHungerScore" style="color: #f59e0b; font-weight: bold;">90%</span></div>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <button onclick="window.feedVirtualPet()" style="flex: 1; background: #f59e0b; color: white; border: none; padding: 10px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">🍖 បញ្ចុកអាហារ</button>
                    <button onclick="window.playVirtualPet()" style="flex: 1; background: #38bdf8; color: white; border: none; padding: 10px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">🎾 លេងជាមួយគ្នា</button>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmPetModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes petBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
        `;
        document.head.appendChild(style);
    }

    window.feedVirtualPet = function() {
        let love = parseInt(localStorage.getItem('skm_pet_love') || '80');
        love = Math.min(100, love + 10);
        localStorage.setItem('skm_pet_love', love);
        updatePetStats();
        if (typeof showToast === 'function') showToast('🍖 បានបញ្ចុកអាហារដល់សត្វចិញ្ចឹមរួចរាល់!');
    };

    window.playVirtualPet = function() {
        let love = parseInt(localStorage.getItem('skm_pet_love') || '80');
        love = Math.min(100, love + 15);
        localStorage.setItem('skm_pet_love', love);
        updatePetStats();
        if (typeof showToast === 'function') showToast('🎾 លេងជាមួយសត្វចិញ្ចឹមយ៉ាងសប្បាយរីករាយ!');
    };

    function updatePetStats() {
        const loveEl = document.getElementById('petLoveScore');
        if (loveEl) {
            let love = localStorage.getItem('skm_pet_love') || '80';
            loveEl.innerText = love + '%';
        }
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🐾', 'សត្វចិញ្ចឹមកំសាន្ត (Virtual Pet)', openVirtualPetModal, "virtual_pet.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [48/51] vitamin_tracker.js ===
window.skmRegisterBundledPlugin('menu', "vitamin_tracker.js", function() {
(function() {
    console.log("💊 Menu Vitamin & Nutrient Tracker Plugin Initialized!");

    function openVitaminModal() {
        if(document.getElementById('skmVitaminModal')) {
            document.getElementById('skmVitaminModal').style.display = 'flex';
            calcCartNutrients();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmVitaminModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 38px; margin-bottom: 5px;">💊</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">ត្រួតពិនិត្យវីតាមីន & ជីវជាតិ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ប៉ាន់ស្មានសារធាតុចិញ្ចឹមពីមុខទំនិញក្នុងកន្ត្រករបស់អ្នក៖</p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 8px;" id="vitaminDetailsBox">
                    <div>🥩 <b>ប្រូតេអ៊ីន (Protein):</b> <span id="vitProtein" style="color: #10b981; font-weight: bold;">0 g</span></div>
                    <div>🍊 <b>វីតាមីន C (Vitamin C):</b> <span id="vitC" style="color: #f59e0b; font-weight: bold;">0 mg</span></div>
                    <div>🥛 <b>កាល់ស្យូម (Calcium):</b> <span id="vitCalcium" style="color: #38bdf8; font-weight: bold;">0 mg</span></div>
                    <div>⚡ <b>កាបូអ៊ីដ្រាត (Carbs):</b> <span id="vitCarbs" style="color: #ec4899; font-weight: bold;">0 g</span></div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px; text-align: left;">
                    💡 ការគណនានេះប៉ាន់ស្មានផ្អែកលើបរិមាណ និងប្រភេទមុខទំនិញសរុបក្នុងកន្ត្រក។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmVitaminModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        calcCartNutrients();
    }

    function calcCartNutrients() {
        let count = 0;
        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
            cart.forEach(item => {
                count += parseInt(item.qty || 1);
            });
        }

        const pEl = document.getElementById('vitProtein');
        const cEl = document.getElementById('vitC');
        const calEl = document.getElementById('vitCalcium');
        const carbEl = document.getElementById('vitCarbs');

        if (pEl) pEl.innerText = `${count * 12} g`;
        if (cEl) cEl.innerText = `${count * 25} mg`;
        if (calEl) calEl.innerText = `${count * 120} mg`;
        if (carbEl) carbEl.innerText = `${count * 35} g`;
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💊', 'ត្រួតពិនិត្យវីតាមីន & ជីវជាតិ (Vitamins)', openVitaminModal, "vitamin_tracker.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [49/51] voice_search.js ===
window.skmRegisterBundledPlugin('menu', "voice_search.js", function() {
(function() {
    console.log("🎙️ Menu Voice Search Plugin Initialized!");

    function openVoiceSearchModal() {
        if(document.getElementById('skmVoiceModal')) {
            document.getElementById('skmVoiceModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmVoiceModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 42px; margin-bottom: 10px;">🎙️</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ស្វែងរកទំនិញដោយសំឡេង</h3>
                <p id="voiceStatusText" style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 20px;">ចុចប៊ូតុងខាងក្រោមរួចនិយាយឈ្មោះទំនិញ៖</p>
                
                <button id="startVoiceBtn" class="btn-act btn-green" style="width: 100%; background: #38bdf8; margin-bottom: 10px;" onclick="window.startSpeechRecognition()">🎙️ ចាប់ផ្តើមនិយាយ (Start)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmVoiceModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.startSpeechRecognition = function() {
        const statusEl = document.getElementById('voiceStatusText');
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            if (statusEl) statusEl.innerText = '⚠️ កម្មវិធីរុករករបស់អ្នកមិនគាំទ្រ Voice Search ទេ!';
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'km-KH';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        if (statusEl) statusEl.innerText = 'Listening... កំពុងស្តាប់សំឡេងរបស់អ្នក...';

        recognition.onresult = function(event) {
            const speechResult = event.results[0][0].transcript;
            if (statusEl) statusEl.innerText = `✅ បានឮ: "${speechResult}"`;
            
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = speechResult;
                if (typeof renderMenu === 'function') renderMenu();
                window.scrollTo({top: 300, behavior: 'smooth'});
            }
            setTimeout(() => {
                document.getElementById('skmVoiceModal').style.display = 'none';
            }, 1000);
        };

        recognition.onerror = function(event) {
            if (statusEl) statusEl.innerText = '❌ មានបញ្ហាក្នុងការស្តាប់ សូមព្យាយាមម្តងទៀត!';
        };

        recognition.start();
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎙️', 'ស្វែងរកដោយសំឡេង (Voice Search)', openVoiceSearchModal, "voice_search.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [50/51] who_pays_game.js ===
window.skmRegisterBundledPlugin('menu', "who_pays_game.js", function() {
(function() {
    console.log("🎮 Menu Who Pays Game & Table Battle Plugin Initialized!");

    function openWhoPaysModal() {
        if(document.getElementById('skmWhoPaysModal')) {
            document.getElementById('skmWhoPaysModal').style.display = 'flex';
            document.getElementById('whoPaysResultBox').style.display = 'none';
            document.getElementById('whoPaysNameInput').value = '';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmWhoPaysModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 44px; margin-bottom: 5px;">🎮</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">ល្បែងអ្នកណាចេញលុយ? (Who Pays?)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">បញ្ចូលឈ្មោះអ្នកញ៉ាំទាំងអស់គ្នា (ខណ្ឌដោយសញ្ញាក្បៀស ",") ដើម្បីចាប់ឆ្នោតរើសអ្នកចេញលុយថ្ងៃនេះ៖</p>
                
                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">ឈ្មោះអ្នកចូលរួម៖</div>
                <input type="text" id="whoPaysNameInput" placeholder="ឧ. Dara, Vanna, Srey Nich, Borey" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: #fff; font-size: 12px; outline: none; margin-bottom: 15px; font-family:'Battambang';">

                <div id="whoPaysResultBox" style="background: rgba(56,189,248,0.08); border: 1px dashed #38bdf8; padding: 16px; border-radius: 16px; margin-bottom: 15px; text-align: center; display: none;">
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">🎉 លទ្ធផលអ្នកត្រូវចេញប្រាក់វិក្កយបត្រថ្ងៃនេះ:</div>
                    <div id="whoPaysWinnerName" style="font-size: 20px; font-weight: 900; color: #38bdf8;">---</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #38bdf8; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.runWhoPaysBattle()">🎲 ចាប់ឆ្នោតរើសអ្នកចេញលុយ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmWhoPaysModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.runWhoPaysBattle = function() {
        const inp = document.getElementById('whoPaysNameInput').value.trim();
        const box = document.getElementById('whoPaysResultBox');
        const winnerEl = document.getElementById('whoPaysWinnerName');

        if (!inp) {
            alert('សូមបញ្ចូលឈ្មោះអ្នកចូលរួមយ៉ាងហោចណាស់ ២ នាក់!');
            return;
        }

        let names = inp.split(',').map(n => n.trim()).filter(Boolean);
        if (names.length < 2) {
            alert('សូមបញ្ចូលឈ្មោះយ៉ាងហោចណាស់ ២ នាក់ ដោយខណ្ឌដោយសញ្ញាក្បៀស (,)!');
            return;
        }

        box.style.display = 'block';
        winnerEl.innerText = '🎲 កំពុងចាប់ឆ្នោតរើស...';

        let count = 0;
        const interval = setInterval(() => {
            let randName = names[Math.floor(Math.random() * names.length)];
            winnerEl.innerText = randName;
            count++;

            if (count > 12) {
                clearInterval(interval);
                let finalWinner = names[Math.floor(Math.random() * names.length)];
                winnerEl.innerHTML = `🏆 <span style="color: #10b981; font-size: 22px;">${finalWinner}</span> ត្រូវចេញលុយថ្ងៃនេះ!`;
                if (typeof showToast === 'function') showToast(`🎉 ${finalWinner} ត្រូវចេញប្រាក់វិក្កយបត្រ!`);
            }
        }, 100);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎮', 'ល្បែងអ្នកណាចេញលុយ (Who Pays?)', openWhoPaysModal, "who_pays_game.js");
            clearInterval(initInt);
        }
    }, 500);
})();
});

;
// === [51/51] zodiac_lucky_food.js ===
window.skmRegisterBundledPlugin('menu', "zodiac_lucky_food.js", function() {
(function() {
    console.log("🔮 Menu Zodiac & Horoscope Lucky Food Matcher Plugin Initialized!");

    function openZodiacModal() {
        if(document.getElementById('skmZodiacModal')) {
            document.getElementById('skmZodiacModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmZodiacModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(168,85,247,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">🔮</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #a855f7;">ហុងស៊ុយម្ហូបនាំលាភសំណាង</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ជ្រើសរើសឆ្នាំកំណើតរបស់អ្នកដើម្បីស្វែងរកម្ហូបត្រូវជើងថ្ងៃនេះ៖</p>
                
                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">ជ្រើសរើសឆ្នាំកំណើត (Zodiac):</div>
                <select id="zodiacSelect" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px; color: #fff; font-size: 12px; outline: none; margin-bottom: 15px; font-family:'Battambang';">
                    <option value="ជូត">🐀 ឆ្នាំជូត (កណ្តុរ)</option>
                    <option value="ឆ្លូវ">🐂 ឆ្នាំឆ្លូវ (គោ)</option>
                    <option value="ខាល">🐅 ឆ្នាំខាល (ខ្លា)</option>
                    <option value="ថោះ">🐇 ឆ្នាំថោះ (ទន្សាយ)</option>
                    <option value="រោង">🐉 ឆ្នាំរោង (នាគ)</option>
                    <option value="ម្សាញ់">🐍 ឆ្នាំម្សាញ់ (ពស់)</option>
                    <option value="មមី">🐎 ឆ្នាំមមី (សេះ)</option>
                    <option value="មមែ">🐐 ឆ្នាំមមែ (ពពែ)</option>
                    <option value="វក">🐒 ឆ្នាំវក (ស្វា)</option>
                    <option value="រកា">🐓 ឆ្នាំរកា (មាន់)</option>
                    <option value="ចរ">🐕 ឆ្នាំចរ (ឆ្កែ)</option>
                    <option value="កុរ" selected>🐖 ឆ្នាំកុរ (ជ្រូក)</option>
                </select>

                <div id="zodiacResultBox" style="background: rgba(168,85,247,0.08); border: 1px dashed #a855f7; padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: center; display: none;">
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">✨ មុខម្ហូបនាំសំណាងថ្ងៃនេះរបស់អ្នក:</div>
                    <div id="zodiacFoodName" style="font-size: 15px; font-weight: 900; color: #a855f7; margin-bottom: 2px;">---</div>
                    <div id="zodiacLuckyInfo" style="font-size: 11px; color: var(--text-dark);">---</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #a855f7; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.calculateZodiacFortune()">🔮 ទស្សន៍ទាយហុងស៊ុយម្ហូប</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(168,85,247,0.1); color:#a855f7; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmZodiacModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.calculateZodiacFortune = function() {
        const zodiac = document.getElementById('zodiacSelect').value;
        const box = document.getElementById('zodiacResultBox');
        const foodEl = document.getElementById('zodiacFoodName');
        const infoEl = document.getElementById('zodiacLuckyInfo');
        if (!box) return;

        box.style.display = 'block';

        let inv = window.inventory || [];
        let match = inv[Math.floor(Math.random() * inv.length)];
        let foodName = match ? match.name : 'កាហ្វេដូងក្រអូបប្រចាំហាង';
        let price = match ? `$${parseFloat(match.price || 0).toFixed(2)}` : '$3.50';

        const luckyColors = ['ពណ៌ក្រហម', 'ពណ៌មាស', 'ពណ៌បៃតង', 'ពណ៌ខៀវ'];
        const luckyNums = ['៨៨', '៩', '១៦៨', '២៤'];
        let color = luckyColors[Math.floor(Math.random() * luckyColors.length)];
        let num = luckyNums[Math.floor(Math.random() * luckyNums.length)];

        foodEl.innerText = `🌟 ${foodName} (${price})`;
        infoEl.innerHTML = `សម្រាប់ឆ្នាំ <b>${zodiac}</b> | ពណ៌នាំលាភ: <b>${color}</b> | លេខសំណាង: <b>${num}</b>`;

        if (typeof showToast === 'function') showToast(`🔮 ទស្សន៍ទាយហុងស៊ុយឆ្នាំ ${zodiac} ជោគជ័យ!`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔮', 'ហុងស៊ុយម្ហូបតាមឆ្នាំកំណើត (Zodiac)', openZodiacModal, "zodiac_lucky_food.js");
            clearInterval(initInt);
        }
    }, 500);
})();

});
