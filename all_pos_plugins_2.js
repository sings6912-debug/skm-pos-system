/**
 * ============================================================================
 * SKM INTEGRATE POS - PLUGINS BUNDLE PACK 2 v7.4 (8 Pro Plugins — Default OFF per Branch • Admin Tab 9 Opt-In)
 * File: all_pos_plugins_2.js (Root Folder — alongside all_pos_plugins.js)
 * Hosted on GitHub Pages (0 Bytes Supabase Egress/Storage)
 *
 * Included Plugins:
 *   [1/8] 🕒 វត្តមានបុគ្គលិក Pro (QR + GPS + Leave + Telegram Alert)
 *   [2/8] 🏷️ ស្ទីកគ័របាកូដទំនិញ & កែវកាហ្វេ (Code-128/Code-39 Barcode Sticker Pro + USB Silent Print)
 *   [3/8] 🔗 ចែករំលែកម៉ឺនុយ & ទំនិញរហ័ស (Power QR + Telegram/Facebook Share Hub)
 *   [4/8] 📦 លក់ច្រើនឯកតា & លក់ដុំថែម (Multi-Unit & Wholesale Bonus + Auto Stock Multiplier)
 *   [5/8] 🧾 ព្រីន ២ សន្លឹក & បាកូដវិក្កយបត្រ (Dual-Copy Receipt + Invoice Barcode Scanner)
 *   [6/8] 📊 វិភាគទំនិញលក់ដាច់ & កប់ស្តុក (Fast-Moving & Dead Stock 30/60/90 Days + Trapped Cash)
 *   [7/8] 🚨 ដាស់តឿនស្តុកជិតអស់អូតូ (Auto Low-Stock & Out-of-Stock Telegram Alert)
 *   [8/8] 🔄 Offline Order Queue & Smart TTL Cache (ធានាវិក្កយបត្រមិនបាត់ពេលដាច់អ៊ីនធឺណិត + កាត់បន្ថយ Egress)
 * ============================================================================
 */

(function () {
    'use strict';
    if (window.__SKM_POS_PLUGINS_2_READY__) return;
    window.__SKM_POS_PLUGINS_2_READY__ = true;

    function getBranchId() {
        try {
            return (window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || localStorage.getItem('skm_last_branch') || 'branch_1').trim();
        } catch (e) {
            return 'branch_1';
        }
    }

    function getPack2StateKey() {
        return `ks2_${getBranchId()}_pos2_enabled`;
    }

    // Default OFF for ALL branches — Admin enables per branch in Admin Settings -> Tab 9 (Section 9.5)
    const PACK2_DEFAULTS = {
        attendancePro: false,
        stickerPro: false,
        powerShareHub: false,
        multiUnitWholesale: false,
        dualReceiptBarcode: false,
        stockHealthAnalytics: false,
        autoLowStockAlert: false,
        offlineSyncQueue: false
    };

    function getPack2State() {
        const st = Object.assign({}, PACK2_DEFAULTS);
        try {
            // Single Source of Truth: sys_settings.pos2Enabled (synced from Admin Settings Tab 9)
            const localSys = JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_sys_settings`) || '{}');
            const sys = Object.assign({}, localSys, window.sysSettings || {});
            if (sys && sys.pos2Enabled && typeof sys.pos2Enabled === 'object') {
                Object.keys(PACK2_DEFAULTS).forEach(k => {
                    st[k] = sys.pos2Enabled[k] === true;
                });
            }
        } catch (e) {}
        return st;
    }

    async function savePack2State(nextState) {
        const br = getBranchId();
        localStorage.setItem(getPack2StateKey(), JSON.stringify(nextState));
        try {
            const sysKey = `ks2_${br}_sys_settings`;
            const sys = Object.assign({}, window.sysSettings || JSON.parse(localStorage.getItem(sysKey) || '{}'));
            sys.pos2Enabled = nextState;
            window.sysSettings = sys;
            localStorage.setItem(sysKey, JSON.stringify(sys));

            if (window.supabaseClient && navigator.onLine) {
                const cleanSys = typeof window.stripLocalThemeForCloud === 'function' ? window.stripLocalThemeForCloud(sys) : sys;
                const nowIso = new Date().toISOString();
                localStorage.setItem(`ks2_${br}_last_update`, new Date(nowIso).getTime().toString());
                await window.supabaseClient.from('branch_store').update({
                    sys_settings: cleanSys,
                    updated_at: nowIso
                }).eq('branch_id', br);
            }
        } catch (e) {}
    }

    function showPack2Toast(msg, isErr) {
        if (typeof window.showToast === 'function') {
            window.showToast(msg, Boolean(isErr));
            return;
        }
        const t = document.createElement('div');
        t.textContent = msg;
        t.style.cssText = `position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:999999;padding:10px 20px;border-radius:999px;font-weight:800;font-size:13px;font-family:'Battambang',sans-serif;color:#fff;background:${isErr ? '#ef4444' : '#10b981'};box-shadow:0 10px 28px rgba(0,0,0,0.35);`;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    function getTelegramCreds(overrideCfg) {
        const br = getBranchId();
        let sys = window.sysSettings || {};
        try {
            sys = Object.assign({}, JSON.parse(localStorage.getItem(`ks2_${br}_sys_settings`) || '{}'), sys);
        } catch (e) {}
        const lsTok = localStorage.getItem(`ks2_${br}_telegram_bot_token`) || '';
        const lsCid = localStorage.getItem(`ks2_${br}_telegram_chat_id`) || '';
        const token = (overrideCfg?.telegramToken || window.botToken || window.telegramBotToken || window.orderBotToken || sys.orderTelegramBotToken || sys.telegramBotToken || sys.tgBotToken || sys.telegramToken || lsTok || '').trim();
        const chatId = (overrideCfg?.telegramChatId || window.chatId || window.telegramChatId || window.orderChatId || sys.orderTelegramChatId || sys.telegramChatId || sys.tgChatId || lsCid || '').trim();
        return { token, chatId };
    }

    function escHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // Register cleanly into smart_toolbox_hub_pro.js without being blocked by Pack 1 activePlugins array
    function registerInPosToolbox(icon, title, fn) {
        const timer = setInterval(() => {
            if (typeof window.registerCustomTool === 'function') {
                window.registerCustomTool(icon, title, fn, null);
                clearInterval(timer);
            }
        }, 400);
        setTimeout(() => clearInterval(timer), 15000);
    }

    // Inject shared modern modal styles once
    function injectPack2Styles() {
        if (document.getElementById('skmPosPack2Styles')) return;
        const st = document.createElement('style');
        st.id = 'skmPosPack2Styles';
        st.textContent = `
            .skm-p2-overlay { display:none; position:fixed; inset:0; z-index:100020; background:rgba(2,6,23,0.74); backdrop-filter:blur(6px); justify-content:center; align-items:center; padding:14px; font-family:'Battambang','Nunito',sans-serif; }
            .skm-p2-overlay.open { display:flex; }
            .skm-p2-box { background:#0f172a; color:#f8fafc; width:100%; max-width:940px; max-height:92vh; border-radius:20px; border:1px solid rgba(56,189,248,0.32); box-shadow:0 28px 65px rgba(0,0,0,0.55); display:flex; flex-direction:column; overflow:hidden; }
            .skm-p2-head { padding:14px 20px; background:linear-gradient(135deg,#0f172a,#1e293b); border-bottom:1px solid rgba(148,163,184,0.2); display:flex; justify-content:space-between; align-items:center; gap:10px; }
            .skm-p2-tabs { display:flex; gap:6px; padding:10px 18px; background:#1e293b; border-bottom:1px solid rgba(148,163,184,0.16); flex-wrap:wrap; }
            .skm-p2-tab { border:1px solid rgba(148,163,184,0.25); background:rgba(15,23,42,0.75); color:#cbd5e1; padding:7px 13px; border-radius:10px; font-size:12.5px; font-weight:700; cursor:pointer; font-family:inherit; }
            .skm-p2-tab.active { background:linear-gradient(135deg,#0284c7,#10b981); color:#fff; border-color:transparent; }
            .skm-p2-body { padding:16px 20px; overflow-y:auto; flex:1; }
            .skm-p2-card { background:#1e293b; border:1px solid rgba(148,163,184,0.2); border-radius:14px; padding:14px; min-width:0; box-sizing:border-box; }
            .skm-p2-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:11px; }
            .skm-p2-input, .skm-p2-select { width:100%; padding:9px 11px; border-radius:10px; border:1px solid rgba(148,163,184,0.3); background:#0f172a; color:#fff; font-size:13px; outline:none; font-family:inherit; box-sizing:border-box; }
            .skm-p2-label { display:block; font-size:11.5px; color:#cbd5e1; margin-bottom:4px; font-weight:700; }
            .skm-p2-btn { border:none; border-radius:10px; padding:8px 14px; font-size:12.5px; font-weight:800; cursor:pointer; color:#fff; background:#0284c7; font-family:inherit; display:inline-flex; align-items:center; justify-content:center; gap:5px; }
            .skm-p2-btn.green { background:#10b981; }
            .skm-p2-btn.amber { background:#f59e0b; }
            .skm-p2-btn.red { background:#ef4444; }
            .skm-p2-btn.gray { background:#334155; }
            .skm-p2-btn.fb { background:#1877f2; }
            .skm-p2-btn.tg { background:#0088cc; }
            .skm-p2-table { width:100%; border-collapse:collapse; font-size:12.5px; margin-top:10px; }
            .skm-p2-table th, .skm-p2-table td { padding:9px 10px; border-bottom:1px solid rgba(148,163,184,0.16); text-align:left; }
            .skm-p2-table th { background:#1e293b; color:#38bdf8; position:sticky; top:0; }
            .skm-p2-chip { border:1px solid rgba(245,158,11,0.45); background:rgba(245,158,11,0.12); color:#fcd34d; padding:4px 9px; border-radius:999px; font-size:11.5px; font-weight:700; cursor:pointer; font-family:inherit; }
            .skm-p2-2col { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,0.95fr); gap:14px; align-items:start; }
            .skm-p2-qr-layout { display:grid; grid-template-columns:300px minmax(0,1fr); gap:16px; align-items:stretch; }
            @media (max-width:780px) { .skm-p2-2col, .skm-p2-qr-layout { grid-template-columns:minmax(0,1fr); } }
            .skm-toolbox-popup { max-height:calc(100vh - 110px) !important; }
            .skm-toolbox-body { max-height:calc(100vh - 190px) !important; }
        `;
        document.head.appendChild(st);
    }

    // Expose Pack 2 Manager API
    window.SKM_POS_PACK2 = {
        getState: getPack2State,
        saveState: savePack2State,
        openManager() {
            if (window.SKM_POS_PACK3 && typeof window.SKM_POS_PACK3.openControlCenter === 'function') {
                window.SKM_POS_PACK3.openControlCenter();
                return;
            }
            injectPack2Styles();
            let m = document.getElementById('skmPack2ManagerModal');
            if (!m) {
                m = document.createElement('div');
                m.id = 'skmPack2ManagerModal';
                m.className = 'skm-p2-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p2-box" style="max-width:460px;">
                        <div class="skm-p2-head">
                            <div style="font-size:15.5px;font-weight:900;color:#38bdf8;">⚡ បិទ/បើកមុខងារ All POS Pack 2</div>
                            <button class="skm-p2-btn red" onclick="document.getElementById('skmPack2ManagerModal').classList.remove('open')">✕</button>
                        </div>
                        <div class="skm-p2-body" style="display:flex;flex-direction:column;gap:10px;">
                            <p style="font-size:12px;color:#94a3b8;margin:0;">កំណត់មុខងារដែលត្រូវបើកប្រើសម្រាប់សាខា <b style="color:#38bdf8;" id="skmP2MgrBr"></b> (បិទដើម្បីលាក់ពី Toolbox របស់ហាងនេះ)៖</p>
                            <label class="skm-p2-card" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;">
                                <span>🕒 វត្តមានបុគ្គលិក Pro (QR + GPS + Telegram)</span>
                                <input type="checkbox" id="skmP2ChkAtt" style="width:20px;height:20px;accent-color:#10b981;">
                            </label>
                            <label class="skm-p2-card" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;">
                                <span>🏷️ ស្ទីកគ័របាកូដទំនិញ & កែវកាហ្វេ (Barcode Sticker Pro)</span>
                                <input type="checkbox" id="skmP2ChkStk" style="width:20px;height:20px;accent-color:#10b981;">
                            </label>
                            <label class="skm-p2-card" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;">
                                <span>🔗 ចែករំលែកម៉ឺនុយ & ទំនិញ (Power QR)</span>
                                <input type="checkbox" id="skmP2ChkShr" style="width:20px;height:20px;accent-color:#10b981;">
                            </label>
                            <label class="skm-p2-card" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;">
                                <span>📦 លក់ច្រើនឯកតា & លក់ដុំថែម (Multi-Unit)</span>
                                <input type="checkbox" id="skmP2ChkMu" style="width:20px;height:20px;accent-color:#10b981;">
                            </label>
                            <label class="skm-p2-card" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;">
                                <span>🧾 ព្រីន ២ សន្លឹក & បាកូដវិក្កយបត្រ (Dual Receipt)</span>
                                <input type="checkbox" id="skmP2ChkDr" style="width:20px;height:20px;accent-color:#10b981;">
                            </label>
                            <label class="skm-p2-card" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;">
                                <span>📊 វិភាគទំនិញលក់ដាច់ & កប់ស្តុក (Dead Stock)</span>
                                <input type="checkbox" id="skmP2ChkSh" style="width:20px;height:20px;accent-color:#10b981;">
                            </label>
                            <label class="skm-p2-card" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;">
                                <span>🚨 ដាស់តឿនស្តុកជិតអស់អូតូ (Telegram Alert)</span>
                                <input type="checkbox" id="skmP2ChkLs" style="width:20px;height:20px;accent-color:#10b981;">
                            </label>
                            <label class="skm-p2-card" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;">
                                <span>🔄 Offline Order Queue & Smart TTL Cache</span>
                                <input type="checkbox" id="skmP2ChkOq" style="width:20px;height:20px;accent-color:#10b981;">
                            </label>
                            <button class="skm-p2-btn green" style="width:100%;padding:11px;" id="skmP2MgrSaveBtn">💾 រក្សាទុក & អាប់ដេត</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
                document.getElementById('skmP2MgrSaveBtn').onclick = async () => {
                    const next = {
                        attendancePro: document.getElementById('skmP2ChkAtt').checked,
                        stickerPro: document.getElementById('skmP2ChkStk').checked,
                        powerShareHub: document.getElementById('skmP2ChkShr').checked,
                        multiUnitWholesale: document.getElementById('skmP2ChkMu').checked,
                        dualReceiptBarcode: document.getElementById('skmP2ChkDr').checked,
                        stockHealthAnalytics: document.getElementById('skmP2ChkSh').checked,
                        autoLowStockAlert: document.getElementById('skmP2ChkLs').checked,
                        offlineSyncQueue: document.getElementById('skmP2ChkOq').checked
                    };
                    await savePack2State(next);
                    showPack2Toast('✅ រក្សាទុកជោគជ័យ! កំពុងអាប់ដេតផ្ទាំង...');
                    setTimeout(() => location.reload(), 650);
                };
            }
            const st = getPack2State();
            document.getElementById('skmP2MgrBr').textContent = getBranchId();
            document.getElementById('skmP2ChkAtt').checked = st.attendancePro === true;
            document.getElementById('skmP2ChkStk').checked = st.stickerPro === true;
            document.getElementById('skmP2ChkShr').checked = st.powerShareHub === true;
            document.getElementById('skmP2ChkMu').checked = st.multiUnitWholesale === true;
            document.getElementById('skmP2ChkDr').checked = st.dualReceiptBarcode === true;
            document.getElementById('skmP2ChkSh').checked = st.stockHealthAnalytics === true;
            document.getElementById('skmP2ChkLs').checked = st.autoLowStockAlert === true;
            document.getElementById('skmP2ChkOq').checked = st.offlineSyncQueue === true;
            m.classList.add('open');
        }
    };

    // Auto-expand POS Toolbox height so it only scrolls when tools truly fill the screen
    (function fixPosToolboxHeight() {
        if (document.getElementById('skmPosToolboxHeightFix')) return;
        const s = document.createElement('style');
        s.id = 'skmPosToolboxHeightFix';
        s.textContent = `.skm-toolbox-popup{max-height:calc(100vh - 110px)!important;}.skm-toolbox-body{max-height:calc(100vh - 190px)!important;}`;
        document.head.appendChild(s);
    })();

    const PACK2_TOOL_TITLES = {
        attendancePro: 'វត្តមានបុគ្គលិក Pro (QR/GPS)',
        stickerPro: 'ស្ទីកគ័របាកូដទំនិញ & កែវកាហ្វេ (Sticker Pro)',
        powerShareHub: 'ចែករំលែកម៉ឺនុយ & ទំនិញ (Power QR)',
        multiUnitWholesale: 'លក់ច្រើនឯកតា & លក់ដុំថែម (Multi-Unit)',
        dualReceiptBarcode: 'ព្រីន ២ សន្លឹក & បាកូដវិក្កយបត្រ (Dual Receipt)',
        stockHealthAnalytics: 'វិភាគលក់ដាច់ & កប់ស្តុក (Stock Health)',
        autoLowStockAlert: 'ដាស់តឿនស្តុកជិតអស់អូតូ (Telegram Alert)',
        offlineSyncQueue: 'Offline Queue & Smart Cache'
    };

    const p2Registry = {};
    const p2Started = new Set();

    function registerPack2Module(key, initFn) {
        p2Registry[key] = initFn;
        const st = getPack2State();
        if (st[key] === true && !p2Started.has(key)) {
            p2Started.add(key);
            try { initFn(); } catch (e) { console.error('[SKM Pack2 Init Error]', key, e); }
        }
    }

    function syncPack2ToolboxVisibility() {
        const st = getPack2State();
        // Lazy-start any module enabled on Cloud after initial boot
        Object.keys(p2Registry).forEach(k => {
            if (st[k] === true && !p2Started.has(k)) {
                p2Started.add(k);
                try { p2Registry[k](); } catch (e) { console.error('[SKM Pack2 Lazy Init Error]', k, e); }
            }
        });
        const body = document.getElementById('skmToolboxMenuBody');
        if (!body) return;
        const disabledTitles = new Set(
            Object.keys(PACK2_TOOL_TITLES).filter(k => st[k] !== true).map(k => PACK2_TOOL_TITLES[k])
        );
        const enabledTitles = new Set(
            Object.keys(PACK2_TOOL_TITLES).filter(k => st[k] === true).map(k => PACK2_TOOL_TITLES[k])
        );
        body.querySelectorAll('.skm-tool-wrapper').forEach(w => {
            const label = w.querySelector('.skm-tool-item span')?.textContent?.trim() || '';
            if (disabledTitles.has(label)) w.style.setProperty('display', 'none', 'important');
            else if (enabledTitles.has(label)) w.style.removeProperty('display');
        });
    }
    window.__SKM_SYNC_PACK2__ = syncPack2ToolboxVisibility;
    setTimeout(syncPack2ToolboxVisibility, 1800);
    setTimeout(syncPack2ToolboxVisibility, 4800);
    if (typeof window.skmApplyActivePlugins === 'function' && !window.skmApplyActivePlugins.__skmP2Wrapped) {
        const _origApplyP2 = window.skmApplyActivePlugins;
        window.skmApplyActivePlugins = function () {
            const r = _origApplyP2.apply(this, arguments);
            setTimeout(syncPack2ToolboxVisibility, 80);
            return r;
        };
        window.skmApplyActivePlugins.__skmP2Wrapped = true;
    }

    // ========================================================================
    // [1/8] 🕒 វត្តមានបុគ្គលិក Pro (QR + GPS + Leave + Telegram Alert)
    // ========================================================================
    registerPack2Module('attendancePro', function initAttendanceProPlugin() {
            const getCfgKey = () => `ks2_${getBranchId()}_attendance_cfg`;
            const getLocalAttKey = () => `ks2_${getBranchId()}_staff_attendance_logs`;
            const getLocalLeaveKey = () => `ks2_${getBranchId()}_staff_leave_requests`;

            function loadCfg() {
                let cfg = {
                    shopLat: '', shopLng: '', radiusMeters: 150, requireGpsInside: false,
                    workStart: '08:00', workEnd: '17:00', graceMinutes: 10, requirePin: false,
                    telegramEnabled: true, telegramToken: '', telegramChatId: ''
                };
                try {
                    const sys = window.sysSettings || JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_sys_settings`) || '{}');
                    if (sys && sys.attendanceConfig) cfg = Object.assign(cfg, sys.attendanceConfig);
                    const raw = localStorage.getItem(getCfgKey());
                    if (raw) cfg = Object.assign(cfg, JSON.parse(raw));
                } catch (e) {}
                return cfg;
            }

            async function saveCfg(cfg) {
                const br = getBranchId();
                localStorage.setItem(getCfgKey(), JSON.stringify(cfg));
                try {
                    const sysKey = `ks2_${br}_sys_settings`;
                    const sys = Object.assign({}, window.sysSettings || JSON.parse(localStorage.getItem(sysKey) || '{}'));
                    sys.attendanceConfig = cfg;
                    window.sysSettings = sys;
                    localStorage.setItem(sysKey, JSON.stringify(sys));
                    if (window.supabaseClient && navigator.onLine) {
                        const cleanSys = typeof window.stripLocalThemeForCloud === 'function' ? window.stripLocalThemeForCloud(sys) : sys;
                        const nowIso = new Date().toISOString();
                        localStorage.setItem(`ks2_${br}_last_update`, new Date(nowIso).getTime().toString());
                        await window.supabaseClient.from('branch_store').update({
                            sys_settings: cleanSys, updated_at: nowIso
                        }).eq('branch_id', br);
                    }
                } catch (e) {}
            }

            function getAttendanceUrl() {
                const isLocal = /^https?:\/\/(127\.0\.0\.1|localhost)/i.test(window.location.href) || window.location.protocol === 'file:';
                const customBase = (window.sysSettings && window.sysSettings.publicBaseUrl) ? String(window.sysSettings.publicBaseUrl).replace(/\/*$/, '/') : '';
                const base = isLocal
                    ? (customBase || 'https://sings6912-debug.github.io/skm-pos-system/')
                    : window.location.href.split('?')[0].replace(/[^/]*$/, '');
                return `${base}attendance.html?branch=${encodeURIComponent(getBranchId())}`;
            }

            function fmtTime(iso) {
                if (!iso) return '--:--';
                return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            }

            function getTodayMonth() {
                const d = new Date();
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            }

            async function sendTg(text) {
                const cfg = loadCfg();
                if (!cfg.telegramEnabled) return;
                const { token, chatId } = getTelegramCreds(cfg);
                if (!token || !chatId) return;
                try {
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
                    });
                } catch (e) {}
            }

            function ensureModal() {
                if (document.getElementById('skmP2AttModal')) return;
                injectPack2Styles();
                const m = document.createElement('div');
                m.id = 'skmP2AttModal';
                m.className = 'skm-p2-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p2-box">
                        <div class="skm-p2-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#38bdf8;">🕒 វត្តមានបុគ្គលិក Pro (QR + GPS + Telegram)</div>
                                <div style="font-size:11.5px;color:#94a3b8;">Pack 2 • បុគ្គលិកស្កេន QR លើទូរស័ព្ទ ចាប់ GPS និងផ្ញើសារជូនម្ចាស់ហាងអូតូ</div>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <button class="skm-p2-btn red" onclick="document.getElementById('skmP2AttModal').classList.remove('open')">✕ បិទ</button>
                            </div>
                        </div>
                        <div class="skm-p2-tabs">
                            <button class="skm-p2-tab active" data-t="logs" onclick="window.SKMP2Att.tab('logs')">📋 បញ្ជីវត្តមាន</button>
                            <button class="skm-p2-tab" data-t="leaves" onclick="window.SKMP2Att.tab('leaves')">📝 សំណើសុំច្បាប់</button>
                            <button class="skm-p2-tab" data-t="qr" onclick="window.SKMP2Att.tab('qr')">📱 ផ្ទាំង QR ស្កេន</button>
                            <button class="skm-p2-tab" data-t="cfg" onclick="window.SKMP2Att.tab('cfg')">⚙️ កំណត់ GPS & ម៉ោង</button>
                        </div>
                        <div class="skm-p2-body">
                            <div id="skmP2Att_logs">
                                <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center;">
                                    <div style="display:flex;gap:8px;align-items:center;">
                                        <input type="month" id="skmP2AttMonth" class="skm-p2-input" style="width:auto;">
                                        <button class="skm-p2-btn" onclick="window.SKMP2Att.loadLogs()">🔄 ផ្ទុក</button>
                                    </div>
                                    <div style="display:flex;gap:8px;">
                                        <button class="skm-p2-btn green" onclick="window.SKMP2Att.openScanPage()">📱 បើកទំព័រស្កេន</button>
                                        <button class="skm-p2-btn gray" onclick="window.SKMP2Att.exportCsv()">📥 CSV</button>
                                    </div>
                                </div>
                                <div id="skmP2AttStats" class="skm-p2-grid" style="margin-top:12px;"></div>
                                <div style="overflow-x:auto;">
                                    <table class="skm-p2-table">
                                        <thead><tr><th>ថ្ងៃទី</th><th>បុគ្គលិក</th><th>ចូល</th><th>ចេញ</th><th>ម៉ោងសរុប</th><th>GPS</th><th>ស្ថានភាព</th></tr></thead>
                                        <tbody id="skmP2AttBody"></tbody>
                                    </table>
                                </div>
                            </div>
                            <div id="skmP2Att_leaves" style="display:none;">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                                    <strong>📝 សំណើសុំច្បាប់ឈប់ & សុំកែម៉ោង</strong>
                                    <button class="skm-p2-btn" onclick="window.SKMP2Att.loadLeaves()">🔄 អាប់ដេត</button>
                                </div>
                                <div id="skmP2LeavesBox" style="display:flex;flex-direction:column;gap:10px;"></div>
                            </div>
                            <div id="skmP2Att_qr" style="display:none;text-align:center;">
                                <p style="font-size:13px;color:#cbd5e1;margin:0 0 12px;">បោះពុម្ពផ្ទាំង QR នេះបិទនៅបញ្ជរគិតលុយ ដើម្បីឱ្យបុគ្គលិកស្កេនចូល/ចេញធ្វើការលើទូរស័ព្ទ៖</p>
                                <div style="display:inline-block;background:#fff;color:#0f172a;padding:20px 26px;border-radius:18px;">
                                    <div id="skmP2AttQrShop" style="font-size:17px;font-weight:900;"></div>
                                    <div style="font-size:12px;color:#475569;margin:4px 0 10px;">ស្កេនកត់ត្រាវត្តមាន (Clock In / Out)</div>
                                    <img id="skmP2AttQrImg" src="" style="width:210px;height:210px;border-radius:10px;border:1px solid #e2e8f0;">
                                    <div id="skmP2AttQrLink" style="font-size:10px;color:#64748b;margin-top:8px;max-width:250px;word-break:break-all;"></div>
                                </div>
                                <div style="margin-top:14px;display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
                                    <button class="skm-p2-btn green" onclick="window.SKMP2Att.printQr()">🖨️ ព្រីនផ្ទាំង QR (A4)</button>
                                    <button class="skm-p2-btn" onclick="window.SKMP2Att.copyQr()">📋 ចម្លង Link</button>
                                </div>
                            </div>
                            <div id="skmP2Att_cfg" style="display:none;">
                                <div class="skm-p2-grid">
                                    <div><label class="skm-p2-label">ម៉ោងចូលស្តង់ដារ</label><input type="time" id="skmP2CfgStart" class="skm-p2-input" value="08:00"></div>
                                    <div><label class="skm-p2-label">ម៉ោងចេញស្តង់ដារ</label><input type="time" id="skmP2CfgEnd" class="skm-p2-input" value="17:00"></div>
                                    <div><label class="skm-p2-label">អនុគ្រោះយឺត (នាទី)</label><input type="number" id="skmP2CfgGrace" class="skm-p2-input" value="10"></div>
                                    <div><label class="skm-p2-label">ដែន GPS (ម៉ែត្រ)</label><input type="number" id="skmP2CfgRad" class="skm-p2-input" value="150"></div>
                                    <div><label class="skm-p2-label">Latitude ហាង</label><input type="text" id="skmP2CfgLat" class="skm-p2-input" placeholder="11.556374"></div>
                                    <div><label class="skm-p2-label">Longitude ហាង</label><input type="text" id="skmP2CfgLng" class="skm-p2-input" placeholder="104.928209"></div>
                                    <div><label class="skm-p2-label">តឹងរ៉ឹង GPS</label>
                                        <select id="skmP2CfgStrict" class="skm-p2-select">
                                            <option value="false">⚠️ អនុញ្ញាតតែផ្ញើ Alert ដាស់តឿន</option>
                                            <option value="true">🔒 ហាមដាច់ខាតបើនៅក្រៅហាង</option>
                                        </select>
                                    </div>
                                    <div><label class="skm-p2-label">តម្រូវវាយ PIN បុគ្គលិក</label>
                                        <select id="skmP2CfgReqPin" class="skm-p2-select">
                                            <option value="false">❌ មិនតម្រូវ (ស្កេនលឿន)</option>
                                            <option value="true">🔐 តម្រូវឱ្យវាយ PIN</option>
                                        </select>
                                    </div>
                                    <div><label class="skm-p2-label">ផ្ញើ Alert ចូល Telegram</label>
                                        <select id="skmP2CfgTg" class="skm-p2-select">
                                            <option value="true">✅ បើក (ប្រើ Bot របស់ POS អូតូ)</option>
                                            <option value="false">❌ បិទ</option>
                                        </select>
                                    </div>
                                    <div><label class="skm-p2-label">Bot Token ផ្សេង (ទុកទទេ = ប្រើរបស់ POS)</label><input type="text" id="skmP2CfgTok" class="skm-p2-input"></div>
                                    <div><label class="skm-p2-label">Chat ID ផ្សេង (ទុកទទេ = ប្រើរបស់ POS)</label><input type="text" id="skmP2CfgChat" class="skm-p2-input"></div>
                                </div>
                                <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;">
                                    <button class="skm-p2-btn" onclick="window.SKMP2Att.grabGps()">📍 យកទីតាំង GPS ហាងបច្ចុប្បន្ន</button>
                                    <button class="skm-p2-btn green" onclick="window.SKMP2Att.saveForm()">💾 រក្សាទុកការកំណត់</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
                document.getElementById('skmP2AttMonth').value = getTodayMonth();
            }

            let monthCache = [];
            window.SKMP2Att = {
                open(defaultTab = 'logs') {
                    ensureModal();
                    document.getElementById('skmP2AttModal').classList.add('open');
                    this.tab(defaultTab);
                },
                tab(t) {
                    ['logs', 'leaves', 'qr', 'cfg'].forEach(k => {
                        const el = document.getElementById(`skmP2Att_${k}`);
                        if (el) el.style.display = (k === t) ? 'block' : 'none';
                    });
                    document.querySelectorAll('#skmP2AttModal .skm-p2-tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-t') === t));
                    if (t === 'logs') this.loadLogs();
                    if (t === 'leaves') this.loadLeaves();
                    if (t === 'qr') this.renderQr();
                    if (t === 'cfg') this.fillCfg();
                },
                async loadLogs() {
                    const br = getBranchId();
                    const ym = document.getElementById('skmP2AttMonth').value || getTodayMonth();
                    let logs = [];
                    try { logs = JSON.parse(localStorage.getItem(getLocalAttKey()) || '[]').filter(x => String(x.work_date || '').startsWith(ym)); } catch (e) {}
                    if (window.supabaseClient && navigator.onLine) {
                        try {
                            const { data } = await window.supabaseClient.from('pos_staff_attendance')
                                .select('id,work_date,staff_name,clock_in,clock_out,clock_in_lat,clock_in_lng,clock_in_distance_m,late_minutes,worked_minutes,status')
                                .eq('branch_id', br).like('work_date', `${ym}%`).order('work_date', { ascending: false }).limit(150);
                            if (Array.isArray(data) && data.length) logs = data;
                        } catch (e) {}
                    }
                    monthCache = logs;
                    const mins = logs.reduce((s, x) => s + Number(x.worked_minutes || 0), 0);
                    const lates = logs.filter(x => Number(x.late_minutes || 0) > 0).length;
                    const outs = logs.filter(x => x.status === 'outside_gps').length;
                    document.getElementById('skmP2AttStats').innerHTML = `
                        <div class="skm-p2-card"><div style="font-size:11px;color:#94a3b8;">វត្តមានសរុប</div><div style="font-size:19px;font-weight:900;color:#38bdf8;">${logs.length} ដង</div></div>
                        <div class="skm-p2-card"><div style="font-size:11px;color:#94a3b8;">ម៉ោងសរុប</div><div style="font-size:19px;font-weight:900;color:#34d399;">${Math.floor(mins/60)}ម៉ ${mins%60}ន</div></div>
                        <div class="skm-p2-card"><div style="font-size:11px;color:#94a3b8;">ចូលយឺត</div><div style="font-size:19px;font-weight:900;color:#fbbf24;">${lates} ដង</div></div>
                        <div class="skm-p2-card"><div style="font-size:11px;color:#94a3b8;">ក្រៅ GPS</div><div style="font-size:19px;font-weight:900;color:#f87171;">${outs} ដង</div></div>
                    `;
                    const tb = document.getElementById('skmP2AttBody');
                    tb.innerHTML = logs.length ? logs.map(r => {
                        const hrs = r.worked_minutes ? `${Math.floor(r.worked_minutes/60)}ម៉ ${r.worked_minutes%60}ន` : '-';
                        const gps = (r.clock_in_lat && r.clock_in_lng) ? `<a href="https://maps.google.com/?q=${r.clock_in_lat},${r.clock_in_lng}" target="_blank" style="color:#38bdf8;text-decoration:none;">📍 ${r.clock_in_distance_m != null ? r.clock_in_distance_m + 'm' : 'Map'}</a>` : '-';
                        const st = r.status === 'outside_gps' ? '⚠️ ក្រៅ GPS' : (r.late_minutes > 0 ? `⏰ យឺត ${r.late_minutes}ន` : '✅ ទាន់ម៉ោង');
                        return `<tr><td>${escHtml(r.work_date)}</td><td><b>${escHtml(r.staff_name)}</b></td><td>${fmtTime(r.clock_in)}</td><td>${fmtTime(r.clock_out)}</td><td>${hrs}</td><td>${gps}</td><td>${st}</td></tr>`;
                    }).join('') : '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:18px;">មិនទាន់មានទិន្នន័យវត្តមានទេ។</td></tr>';
                },
                async loadLeaves() {
                    const br = getBranchId();
                    let list = [];
                    try { list = JSON.parse(localStorage.getItem(getLocalLeaveKey()) || '[]'); } catch (e) {}
                    if (window.supabaseClient && navigator.onLine) {
                        try {
                            const { data } = await window.supabaseClient.from('pos_leave_requests')
                                .select('*').eq('branch_id', br).order('created_at', { ascending: false }).limit(50);
                            if (Array.isArray(data) && data.length) list = data;
                        } catch (e) {}
                    }
                    const box = document.getElementById('skmP2LeavesBox');
                    box.innerHTML = list.length ? list.map(it => {
                        const btns = it.status === 'pending'
                            ? `<div style="display:flex;gap:6px;margin-top:8px;">
                                <button class="skm-p2-btn green" onclick="window.SKMP2Att.decide('${it.id}','approved','${escHtml(it.staff_name)}')">✅ អនុម័ត</button>
                                <button class="skm-p2-btn red" onclick="window.SKMP2Att.decide('${it.id}','rejected','${escHtml(it.staff_name)}')">❌ បដិសេធ</button>
                               </div>` : `<div style="font-size:11.5px;margin-top:6px;color:${it.status==='approved'?'#34d399':'#f87171'};font-weight:800;">${it.status==='approved'?'✅ អនុម័តរួច':'❌ បដិសេធ'}</div>`;
                        return `<div class="skm-p2-card"><strong>👤 ${escHtml(it.staff_name)} (${escHtml(it.request_type)})</strong><div style="font-size:12px;color:#94a3b8;margin-top:3px;">📅 ${escHtml(it.from_date)} → ${escHtml(it.to_date)} ${it.requested_time ? '| 🕒 ' + escHtml(it.requested_time) : ''}</div><div style="font-size:13px;margin-top:5px;">💬 ${escHtml(it.reason)}</div>${btns}</div>`;
                    }).join('') : '<div style="color:#94a3b8;text-align:center;padding:18px;">មិនទាន់មានសំណើសុំច្បាប់ទេ។</div>';
                },
                async decide(id, status, name) {
                    const reviewer = (window.activeUser && (window.activeUser.fullName || window.activeUser.name || window.activeUser.username)) || 'Admin';
                    try {
                        const list = JSON.parse(localStorage.getItem(getLocalLeaveKey()) || '[]');
                        const idx = list.findIndex(x => String(x.id) === String(id));
                        if (idx >= 0) { list[idx].status = status; list[idx].reviewed_by = reviewer; localStorage.setItem(getLocalLeaveKey(), JSON.stringify(list)); }
                    } catch (e) {}
                    if (window.supabaseClient && navigator.onLine) {
                        try { await window.supabaseClient.from('pos_leave_requests').update({ status, reviewed_by: reviewer, reviewed_at: new Date().toISOString() }).eq('id', id); } catch (e) {}
                    }
                    await sendTg(`${status === 'approved' ? '✅ <b>អនុម័តសំណើបុគ្គលិក</b>' : '❌ <b>បដិសេធសំណើបុគ្គលិក</b>'}\n🏪 សាខា៖ <b>${getBranchId()}</b>\n👤 បុគ្គលិក៖ <b>${name}</b>\n🛡️ ដោយ៖ <b>${reviewer}</b>`);
                    showPack2Toast(status === 'approved' ? '✅ បានអនុម័តសំណើ!' : '❌ បានបដិសេធសំណើ!');
                    this.loadLeaves();
                },
                renderQr() {
                    const u = getAttendanceUrl();
                    const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || getBranchId();
                    document.getElementById('skmP2AttQrShop').textContent = shop;
                    document.getElementById('skmP2AttQrLink').textContent = u;
                    document.getElementById('skmP2AttQrImg').src = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encodeURIComponent(u)}`;
                },
                printQr() {
                    const u = getAttendanceUrl();
                    const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || getBranchId();
                    const w = window.open('', '_blank', 'width=680,height=860');
                    if (!w) return;
                    w.document.write(`<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>QR វត្តមាន</title><link href="https://fonts.googleapis.com/css2?family=Battambang:wght@700&display=swap" rel="stylesheet"><style>body{font-family:'Battambang',sans-serif;text-align:center;padding:40px;}.box{border:4px solid #10b981;border-radius:26px;padding:34px;max-width:480px;margin:0 auto;}img{width:300px;height:300px;margin:18px 0;}@media print{.np{display:none;}}</style></head><body><div class="box"><h1 style="margin:0;color:#059669;">${escHtml(shop)}</h1><h2 style="margin:8px 0 0;">📱 ស្កេន QR កត់ត្រាវត្តមានបុគ្គលិក</h2><p style="color:#475569;">ស្កេនដើម្បីចុច ចូល/ចេញធ្វើការ ឬសុំច្បាប់</p><img src="https://api.qrserver.com/v1/create-qr-code/?size=340x340&margin=10&data=${encodeURIComponent(u)}"><div style="font-weight:700;color:#0284c7;">សាខា៖ ${escHtml(getBranchId())}</div></div><button class="np" onclick="window.print()" style="margin-top:18px;padding:10px 22px;background:#10b981;color:#fff;border:none;border-radius:10px;font-size:15px;cursor:pointer;">🖨️ បោះពុម្ព</button></body></html>`);
                    w.document.close();
                },
                copyQr() {
                    const u = getAttendanceUrl();
                    navigator.clipboard?.writeText(u).then(() => showPack2Toast('📋 បានចម្លង Link ស្កេនវត្តមាន!')).catch(() => prompt('Copy Link:', u));
                },
                openScanPage() { window.open(getAttendanceUrl(), '_blank'); },
                fillCfg() {
                    const c = loadCfg();
                    document.getElementById('skmP2CfgStart').value = c.workStart || '08:00';
                    document.getElementById('skmP2CfgEnd').value = c.workEnd || '17:00';
                    document.getElementById('skmP2CfgGrace').value = c.graceMinutes ?? 10;
                    document.getElementById('skmP2CfgRad').value = c.radiusMeters ?? 150;
                    document.getElementById('skmP2CfgLat').value = c.shopLat || '';
                    document.getElementById('skmP2CfgLng').value = c.shopLng || '';
                    document.getElementById('skmP2CfgStrict').value = String(Boolean(c.requireGpsInside));
                    document.getElementById('skmP2CfgReqPin').value = String(Boolean(c.requirePin));
                    document.getElementById('skmP2CfgTg').value = String(c.telegramEnabled !== false);
                    document.getElementById('skmP2CfgTok').value = c.telegramToken || '';
                    document.getElementById('skmP2CfgChat').value = c.telegramChatId || '';
                },
                grabGps() {
                    if (!navigator.geolocation) return showPack2Toast('⚠️ ឧបករណ៍មិនគាំទ្រ GPS!', true);
                    navigator.geolocation.getCurrentPosition(
                        p => {
                            document.getElementById('skmP2CfgLat').value = p.coords.latitude.toFixed(6);
                            document.getElementById('skmP2CfgLng').value = p.coords.longitude.toFixed(6);
                            showPack2Toast('✅ ចាប់ទីតាំង GPS ហាងជោគជ័យ! សូមចុចរក្សាទុក។');
                        },
                        () => showPack2Toast('❌ មិនអាចចាប់ GPS បានទេ!', true),
                        { enableHighAccuracy: true, timeout: 10000 }
                    );
                },
                async saveForm() {
                    await saveCfg({
                        workStart: document.getElementById('skmP2CfgStart').value || '08:00',
                        workEnd: document.getElementById('skmP2CfgEnd').value || '17:00',
                        graceMinutes: Number(document.getElementById('skmP2CfgGrace').value || 10),
                        radiusMeters: Number(document.getElementById('skmP2CfgRad').value || 150),
                        shopLat: document.getElementById('skmP2CfgLat').value.trim(),
                        shopLng: document.getElementById('skmP2CfgLng').value.trim(),
                        requireGpsInside: document.getElementById('skmP2CfgStrict').value === 'true',
                        requirePin: document.getElementById('skmP2CfgReqPin').value === 'true',
                        telegramEnabled: document.getElementById('skmP2CfgTg').value === 'true',
                        telegramToken: document.getElementById('skmP2CfgTok').value.trim(),
                        telegramChatId: document.getElementById('skmP2CfgChat').value.trim()
                    });
                    showPack2Toast('✅ រក្សាទុកការកំណត់វត្តមានជោគជ័យ!');
                },
                exportCsv() {
                    if (!monthCache.length) return showPack2Toast('⚠️ គ្មានទិន្នន័យទេ!', true);
                    const rows = [['Date', 'Staff', 'ClockIn', 'ClockOut', 'LateMin', 'WorkedMin', 'DistanceM', 'Status'],
                        ...monthCache.map(r => [r.work_date, r.staff_name, r.clock_in || '', r.clock_out || '', r.late_minutes || 0, r.worked_minutes || 0, r.clock_in_distance_m ?? '', r.status || ''])];
                    const blob = new Blob(['\uFEFF' + rows.map(x => x.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Attendance_${getBranchId()}.csv`; a.click();
                }
            };

            registerInPosToolbox('🕒', 'វត្តមានបុគ្គលិក Pro (QR/GPS)', () => window.SKMP2Att.open('logs'));
    });

    // ========================================================================
    // [2/8] 🏷️ ស្ទីកគ័របាកូដទំនិញ & កែវកាហ្វេ (Code-128 / Code-39 Scannable Barcode Sticker Pro)
    // ព្រីនស្ទីកគ័រតម្លៃមានខ្សែបាកូដស្កេនបានពិត (100% Offline SVG, crispEdges) សម្រាប់ប្រអប់ស្គីនខែ/ថ្នាំ/ម៉ាត
    // ព្រមទាំងរក្សាទម្រង់ស្ទីកគ័របិទកែវកាហ្វេ/តែគុជ និងគាំទ្រ Silent Print ទៅ USB Sticker Printer ក្នុង PC App
    // ========================================================================
    registerPack2Module('stickerPro', function initStickerProPlugin() {
            const getCfgKey = () => `ks2_${getBranchId()}_sticker_cfg`;

            // ISO/IEC 15417 Code-128 patterns (0..106) — 100% offline & laser-scanner ready
            const C128_PAT = [
                '212222','222122','222221','121223','121322','131222','122213','122312','132212','221213',
                '221312','231212','112232','122132','122231','113222','123122','123221','223211','221132',
                '221231','213212','223112','312131','311222','321122','321221','312212','322112','322211',
                '212123','212321','232121','111323','131123','131321','112313','132113','132311','211313',
                '231113','231311','112133','112331','132131','113123','113321','133121','313121','211331',
                '231131','213113','213311','213131','311123','311321','331121','312113','312311','332111',
                '314111','221411','431111','111224','111422','121124','121421','141122','141221','112214',
                '112412','122114','122411','142112','142211','241211','221114','413111','241112','134111',
                '111242','121142','121241','114212','124112','124211','411212','421112','421211','212141',
                '214121','412121','111143','111341','131141','114113','114311','411113','411311','113141',
                '114131','311141','411131','211412','211214','211232','2331112'
            ];

            const C39_PAT = {
                '0':'nnnwwnwnn','1':'wnnwnnnnw','2':'nnwwnnnnw','3':'wnwwnnnnn','4':'nnnwwnnnw',
                '5':'wnnwwnnnn','6':'nnwwwnnnn','7':'nnnwnnwnw','8':'wnnwnnwnn','9':'nnwwnnwnn',
                'A':'wnnnnwnnw','B':'nnwnnwnnw','C':'wnwnnwnnn','D':'nnnnwwnnw','E':'wnnnwwnnn',
                'F':'nnwnwwnnn','G':'nnnnnwwnw','H':'wnnnnwwnn','I':'nnwnnwwnn','J':'nnnnwwwnn',
                'K':'wnnnnnnww','L':'nnwnnnnww','M':'wnwnnnnwn','N':'nnnnwnnww','O':'wnnnwnnwn',
                'P':'nnwnwnnwn','Q':'nnnnnnwww','R':'wnnnnnwwn','S':'nnwnnnwwn','T':'nnnnwnwwn',
                'U':'wwnnnnnnw','V':'nwwnnnnnw','W':'wwwnnnnnn','X':'nwnnwnnnw','Y':'wwnnwnnnn',
                'Z':'nwwnwnnnn','-':'nwnnnnwnw','.':'wwnnnnwnn',' ':'nwwnnnwnn','$':'nwnwnwnnn',
                '/':'nwnwnnnwn','+':'nwnnnwnwn','%':'nnnwnwnwn','*':'nwnnwnwnn'
            };

            function renderCode128Svg(rawCode, heightPx = 34) {
                const str = String(rawCode || 'SKM001').replace(/[^\x20-\x7E]/g, '').trim() || 'SKM001';
                const useC = /^\d+$/.test(str) && str.length >= 6 && (str.length % 2 === 0);
                const codes = [];
                if (useC) {
                    codes.push(105); // Start C (double density for pure numeric barcodes)
                    for (let i = 0; i < str.length; i += 2) {
                        codes.push(parseInt(str.slice(i, i + 2), 10));
                    }
                } else {
                    codes.push(104); // Start B (full ASCII alphanumeric)
                    for (let i = 0; i < str.length; i++) {
                        codes.push(str.charCodeAt(i) - 32);
                    }
                }
                let sum = codes[0];
                for (let i = 1; i < codes.length; i++) sum += codes[i] * i;
                codes.push(sum % 103); // Modulo-103 checksum
                codes.push(106);       // Stop pattern

                const quiet = 10;
                let x = quiet;
                const rects = [];
                codes.forEach(c => {
                    const pat = C128_PAT[c] || C128_PAT[0];
                    for (let i = 0; i < pat.length; i++) {
                        const w = Number(pat[i]);
                        if (i % 2 === 0) {
                            rects.push(`<rect x="${x}" y="0" width="${w}" height="${heightPx}" fill="#000"/>`);
                        }
                        x += w;
                    }
                });
                const totalW = x + quiet;
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${heightPx}" preserveAspectRatio="none" shape-rendering="crispEdges" style="width:100%;height:${heightPx}px;display:block;">${rects.join('')}</svg>`;
            }

            function renderCode39Svg(rawCode, heightPx = 34) {
                const clean = String(rawCode || 'SKM001').toUpperCase().replace(/[^0-9A-Z\-\.\ \$\/\+%]/g, '').trim() || 'SKM001';
                const full = `*${clean}*`;
                const narrow = 1, wide = 2.6, gap = 1, quiet = 8;
                let x = quiet;
                const rects = [];
                for (let ch of full) {
                    const pat = C39_PAT[ch] || C39_PAT['-'];
                    for (let i = 0; i < 9; i++) {
                        const w = pat[i] === 'w' ? wide : narrow;
                        if (i % 2 === 0) {
                            rects.push(`<rect x="${x.toFixed(1)}" y="0" width="${w.toFixed(1)}" height="${heightPx}" fill="#000"/>`);
                        }
                        x += w;
                    }
                    x += gap;
                }
                const totalW = Math.ceil(x + quiet);
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${heightPx}" preserveAspectRatio="none" shape-rendering="crispEdges" style="width:100%;height:${heightPx}px;display:block;">${rects.join('')}</svg>`;
            }

            function renderBarcodeSvg(code, format = 'code128', heightPx = 34) {
                return format === 'code39' ? renderCode39Svg(code, heightPx) : renderCode128Svg(code, heightPx);
            }

            function loadCfg() {
                let c = {
                    size: '40x30',
                    barcodeFormat: 'code128',
                    printerName: '',
                    splitByQty: true,
                    showShopName: true,
                    showPrice: true,
                    showKhr: false,
                    showExpiry: true,
                    gapMm: 0
                };
                try {
                    const raw = localStorage.getItem(getCfgKey());
                    if (raw) c = Object.assign(c, JSON.parse(raw));
                } catch (e) {}
                return c;
            }

            function parseSize(s) {
                const p = String(s || '40x30').split('x');
                return { w: Number(p[0]) || 40, h: Number(p[1]) || 30 };
            }

            function getInvList() {
                if (Array.isArray(window.inventory) && window.inventory.length) return window.inventory;
                try { return JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_inv_pro`) || '[]'); } catch (e) { return []; }
            }

            // 1. Build Real Scannable Barcode Price Sticker HTML (for Skincare / Pharmacy / Mart / Retail)
            function buildBarcodeStickerHtml(items, cfg) {
                const { w, h } = parseSize(cfg.size);
                const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || 'SKM STORE';
                const rate = parseFloat(document.getElementById('globalExchangeRate')?.value) || window.cartRate || window.EXCHANGE_RATE || 4000;
                const padMm = Math.max(0.8, Number(cfg.gapMm || 0) + (w <= 30 ? 1.0 : 1.4));

                // Proportional sizing by sticker dimensions
                const fShop = w <= 30 ? 6.5 : (w <= 35 ? 7.2 : (w <= 40 ? 8.0 : 9.2));
                const fName = w <= 30 ? 7.8 : (w <= 35 ? 8.8 : (w <= 40 ? 9.8 : 11.2));
                const fPrice = w <= 30 ? 9.5 : (w <= 35 ? 10.8 : (w <= 40 ? 12.2 : 14.0));
                const fCode = w <= 30 ? 6.8 : (w <= 35 ? 7.5 : (w <= 40 ? 8.2 : 9.2));
                const bcH = h <= 20 ? 22 : (h <= 25 ? 28 : (h <= 30 ? 34 : 46));

                const expanded = [];
                items.forEach(it => {
                    const q = Math.max(1, Number(it.qty || 1));
                    for (let i = 0; i < q; i++) expanded.push(it);
                });

                const labelsHtml = expanded.map((it, idx) => {
                    const code = String(it.code || it.customId || it.id || 'SKM001').trim();
                    const priceUsd = Number(it.price || 0);
                    const priceKhr = Math.round(priceUsd * rate).toLocaleString();
                    const expTxt = (cfg.showExpiry && it.expiry) ? `EXP: ${it.expiry}` : '';
                    const priceHtml = cfg.showPrice
                        ? `<span class="bc-pr">$${priceUsd.toFixed(2)}${cfg.showKhr ? ` <small>(${priceKhr}៛)</small>` : ''}</span>`
                        : '';
                    return `
                        <div class="bc-lbl" style="${idx === expanded.length - 1 ? '' : 'page-break-after:always;break-after:page;'}">
                            <div class="bc-top">
                                <span class="bc-shop">${cfg.showShopName ? escHtml(shop) : ''}</span>
                                ${expTxt ? `<span class="bc-exp">${escHtml(expTxt)}</span>` : priceHtml}
                            </div>
                            <div class="bc-name">${escHtml(it.name || 'Product')}</div>
                            ${expTxt && cfg.showPrice ? `<div class="bc-mid-pr">${priceHtml}</div>` : ''}
                            <div class="bc-bars">${renderBarcodeSvg(code, cfg.barcodeFormat || 'code128', bcH)}</div>
                            <div class="bc-num">${escHtml(code)}</div>
                        </div>`;
                }).join('');

                return `<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>SKM Barcode Sticker</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@700&display=swap" rel="stylesheet">
                <style>
                    @page { size: ${w}mm ${h}mm; margin: 0; }
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    html, body { width: ${w}mm; font-family: 'Battambang', Arial, sans-serif; background: #fff; color: #000; -webkit-print-color-adjust: exact; }
                    .bc-lbl { width: ${w}mm; height: ${h}mm; padding: ${padMm.toFixed(1)}mm ${(padMm + 0.4).toFixed(1)}mm; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
                    .bc-top { display: flex; justify-content: space-between; align-items: baseline; gap: 2px; line-height: 1.05; }
                    .bc-shop { font-size: ${fShop}px; font-weight: 700; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 58%; text-transform: uppercase; }
                    .bc-exp { font-size: ${(fShop * 0.95).toFixed(1)}px; font-weight: 700; white-space: nowrap; }
                    .bc-pr { font-size: ${fPrice}px; font-weight: 900; font-family: Arial, sans-serif; white-space: nowrap; }
                    .bc-pr small { font-size: ${(fPrice * 0.68).toFixed(1)}px; font-weight: 700; }
                    .bc-name { font-size: ${fName}px; font-weight: 700; line-height: 1.15; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin-top: 0.3mm; }
                    .bc-mid-pr { text-align: center; line-height: 1.05; }
                    .bc-bars { width: 100%; margin: 0.4mm auto 0; background: #fff; }
                    .bc-num { text-align: center; font-family: 'Courier New', monospace; font-size: ${fCode}px; font-weight: 700; letter-spacing: 0.8px; line-height: 1.05; }
                </style></head><body>${labelsHtml}</body></html>`;
            }

            // 2. Build Cup / Medicine Order Sticker HTML (preserved 100%)
            function buildCupStickerHtml(items, meta, cfg) {
                const { w, h } = parseSize(cfg.size);
                const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || 'SKM POS';
                const nowStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                const expanded = [];
                let total = items.reduce((s, it) => s + Math.max(1, Number(it.qty || 1)), 0);
                let idx = 0;
                items.forEach(it => {
                    const q = Math.max(1, Number(it.qty || 1));
                    for (let i = 0; i < q; i++) {
                        idx++;
                        expanded.push({ name: it.name || 'Item', note: it.note || '', price: Number(it.price || 0), tag: `${idx}/${total}` });
                    }
                });
                const fBase = w <= 35 ? 8.5 : (w <= 40 ? 9.5 : 10.5);
                const fTitle = w <= 35 ? 10.5 : (w <= 40 ? 11.5 : 13);
                const body = expanded.map((l, i) => `
                    <div class="lbl" style="${i === expanded.length - 1 ? '' : 'page-break-after:always;break-after:page;'}">
                        <div class="top"><span class="sh">${cfg.showShopName !== false ? escHtml(shop) : ''}</span><span>${escHtml(meta.orderNo || '#001')} (${l.tag})</span></div>
                        <div class="nm">${escHtml(l.name)}</div>
                        ${l.note ? `<div class="nt">${escHtml(l.note)}</div>` : ''}
                        <div class="ft"><span>${escHtml(meta.table || nowStr)}</span><span>${cfg.showPrice ? '$' + l.price.toFixed(2) : nowStr}</span></div>
                    </div>`).join('');
                return `<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Battambang:wght@700&display=swap" rel="stylesheet"><style>@page{size:${w}mm ${h}mm;margin:0;}*{box-sizing:border-box;margin:0;padding:0;}body{width:${w}mm;font-family:'Battambang',sans-serif;background:#fff;color:#000;}.lbl{width:${w}mm;height:${h}mm;padding:1.5mm 2mm;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;}.top{display:flex;justify-content:space-between;font-size:${(fBase*0.82).toFixed(1)}px;font-weight:700;border-bottom:1px dashed #000;padding-bottom:.5mm;}.sh{max-width:56%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.nm{font-size:${fTitle}px;font-weight:700;line-height:1.18;margin-top:.7mm;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}.nt{font-size:${(fBase*0.9).toFixed(1)}px;background:#000;color:#fff;padding:.4mm 1.2mm;border-radius:1mm;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-top:.5mm;}.ft{display:flex;justify-content:space-between;font-size:${(fBase*0.8).toFixed(1)}px;font-weight:700;border-top:1px dotted #000;padding-top:.4mm;margin-top:auto;}</style></head><body>${body}</body></html>`;
            }

            async function sendHtmlToStickerPrinter(html, cfg, toastText) {
                const { w, h } = parseSize(cfg.size);
                if (window.SKMDesktopBridge && typeof window.SKMDesktopBridge.printSilentHtml === 'function') {
                    try {
                        const r = await window.SKMDesktopBridge.printSilentHtml({
                            html, deviceName: cfg.printerName || '', paperMm: w, paperHeightMm: h, fullDocument: true, title: 'SKM Sticker'
                        });
                        if (r && r.ok) return showPack2Toast(toastText || '🏷️ បានព្រីនស្ទីកគ័រស្វ័យប្រវត្តិជោគជ័យ!');
                    } catch (e) {}
                }
                const old = document.getElementById('skmP2StkFrame'); if (old) old.remove();
                const fr = document.createElement('iframe');
                fr.id = 'skmP2StkFrame'; fr.style.cssText = 'position:fixed;width:0;height:0;border:0;visibility:hidden;';
                document.body.appendChild(fr);
                fr.contentWindow.document.open(); fr.contentWindow.document.write(html); fr.contentWindow.document.close();
                setTimeout(() => { fr.contentWindow.focus(); fr.contentWindow.print(); }, 340);
            }

            function grabOrderItems() {
                if (Array.isArray(window.cart) && window.cart.length) {
                    return {
                        src: 'កន្ត្រកបច្ចុប្បន្ន', orderNo: '#CART', table: '',
                        items: window.cart.map(c => ({ name: c.name || c.title, qty: c.cartQty || c.qty || 1, price: c.price || 0, note: c.note || c.variant || '' }))
                    };
                }
                const invs = Array.isArray(window.invoices) ? window.invoices : [];
                if (invs.length && Array.isArray(invs[0].items) && invs[0].items.length) {
                    const last = invs[0];
                    return {
                        src: `វិក្កយបត្រចុងក្រោយ (${last.id || ''})`, orderNo: String(last.id || '#LAST').slice(-6), table: last.customer || '',
                        items: last.items.map(c => ({ name: c.name || c.title, qty: c.cartQty || c.qty || 1, price: c.price || 0, note: c.note || '' }))
                    };
                }
                return {
                    src: 'គំរូសាកល្បង', orderNo: '#008', table: 'តុ 2',
                    items: [{ name: 'កាហ្វេទឹកដោះគោទឹកកក', qty: 2, price: 2.5, note: 'ស្ករ 50% • ទឹកកកតិច • គុជខ្មៅ' }]
                };
            }

            let bcQueue = []; // [{ id, code, name, price, expiry, qty }]
            let curStkTab = 'barcode';
            let curOrderBundle = null;

            function ensureModal() {
                if (document.getElementById('skmP2StkModal')) return;
                injectPack2Styles();
                const m = document.createElement('div');
                m.id = 'skmP2StkModal';
                m.className = 'skm-p2-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p2-box" style="max-width:960px;">
                        <div class="skm-p2-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#fbbf24;">🏷️ ស្ទីកគ័របាកូដទំនិញ & កែវកាហ្វេ (Sticker Pro)</div>
                                <div style="font-size:11.5px;color:#94a3b8;">ខ្សែបាកូដស្កេនបានពិត (Code-128 / Code-39 Offline) + ស្ទីកគ័រកែវ + USB Silent Printer</div>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <button class="skm-p2-btn red" onclick="document.getElementById('skmP2StkModal').classList.remove('open')">✕ បិទ</button>
                            </div>
                        </div>
                        <div class="skm-p2-tabs">
                            <button class="skm-p2-tab active" data-t="barcode" onclick="window.SKMP2Stk.tab('barcode')">🏷️ ស្ទីកគ័របាកូដទំនិញ (ស្គីនខែ / ថ្នាំ / ម៉ាត)</button>
                            <button class="skm-p2-tab" data-t="cup" onclick="window.SKMP2Stk.tab('cup')">🧋 ស្ទីកគ័របិទកែវ & ថ្នាំតាមវិក្កយបត្រ</button>
                        </div>
                        <div class="skm-p2-body skm-p2-2col">
                            <!-- LEFT PANEL -->
                            <div>
                                <!-- TAB 1: BARCODE PRICE STICKER -->
                                <div id="skmP2StkPanel_barcode" class="skm-p2-card" style="display:flex;flex-direction:column;gap:10px;">
                                    <div style="display:flex;gap:6px;flex-wrap:wrap;">
                                        <input id="skmP2BcSearch" class="skm-p2-input" style="flex:1.4;min-width:160px;" placeholder="🔍 ស្វែងរកទំនិញពីស្តុក POS..." oninput="window.SKMP2Stk.renderBcSearch(this.value)">
                                        <select id="skmP2BcCatSel" class="skm-p2-select" style="flex:1;min-width:130px;"></select>
                                        <button class="skm-p2-btn" onclick="window.SKMP2Stk.addCategoryToQueue()" title="ទាញទំនិញទាំងអស់ក្នុងប្រភេទនេះ">➕ ទាញប្រភេទ</button>
                                    </div>
                                    <div id="skmP2BcSearchBox" style="max-height:115px;overflow-y:auto;display:flex;flex-direction:column;gap:5px;background:#0f172a;padding:7px;border-radius:10px;border:1px solid rgba(148,163,184,0.2);"></div>

                                    <!-- Single Sticker Editor -->
                                    <div style="border-top:1px dashed rgba(148,163,184,0.28);padding-top:9px;">
                                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                            <strong style="font-size:12.5px;color:#38bdf8;">✏️ ព័ត៌មានលើស្ទីកគ័រ (Preview / ព្រីនរហ័ស)</strong>
                                            <button class="skm-p2-btn gray" style="padding:4px 9px;font-size:11px;" onclick="window.SKMP2Stk.genRandomCode()">🎲 បង្កើតកូដថ្មី</button>
                                        </div>
                                        <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:7px;margin-bottom:7px;">
                                            <div><label class="skm-p2-label">ឈ្មោះទំនិញ</label><input id="skmP2BcName" class="skm-p2-input" value="Serum Vitamin C 30ml" oninput="window.SKMP2Stk.preview()"></div>
                                            <div><label class="skm-p2-label">លេខបាកូដស្កេន (SKU / Barcode)</label><input id="skmP2BcCode" class="skm-p2-input" value="8850012345" oninput="window.SKMP2Stk.preview()"></div>
                                        </div>
                                        <div style="display:grid;grid-template-columns:1fr 1fr 0.7fr;gap:7px;margin-bottom:8px;">
                                            <div><label class="skm-p2-label">តម្លៃលក់ ($)</label><input type="number" step="0.01" id="skmP2BcPrice" class="skm-p2-input" value="12.50" oninput="window.SKMP2Stk.preview()"></div>
                                            <div><label class="skm-p2-label">ថ្ងៃផុតកំណត់ (ជម្រើស)</label><input id="skmP2BcExp" class="skm-p2-input" placeholder="ឧ. 12/2027" oninput="window.SKMP2Stk.preview()"></div>
                                            <div><label class="skm-p2-label">ចំនួនសន្លឹក</label><input type="number" min="1" max="500" id="skmP2BcQty" class="skm-p2-input" value="1"></div>
                                        </div>
                                        <div style="display:flex;gap:7px;flex-wrap:wrap;">
                                            <button class="skm-p2-btn green" style="flex:1;" onclick="window.SKMP2Stk.printSingleBarcode()">🖨️ ព្រីនស្ទីកគ័រនេះ</button>
                                            <button class="skm-p2-btn" onclick="window.SKMP2Stk.addFormToQueue()">➕ ដាក់ចូលបញ្ជីព្រីន</button>
                                        </div>
                                    </div>

                                    <!-- Batch Queue -->
                                    <div style="border-top:1px dashed rgba(148,163,184,0.28);padding-top:8px;">
                                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                            <strong style="font-size:12.5px;color:#fbbf24;">📦 បញ្ជីរង់ចាំព្រីនច្រើនមុខ (<span id="skmP2BcQueueTot">0</span> សន្លឹក)</strong>
                                            <div style="display:flex;gap:6px;">
                                                <button class="skm-p2-btn gray" style="padding:4px 9px;font-size:11px;" onclick="window.SKMP2Stk.clearBcQueue()">សម្អាត</button>
                                                <button class="skm-p2-btn amber" style="padding:4px 11px;font-size:11.5px;" onclick="window.SKMP2Stk.printBcQueue()">🖨️ ព្រីនបញ្ជីទាំងអស់</button>
                                            </div>
                                        </div>
                                        <div id="skmP2BcQueueBox" style="max-height:110px;overflow-y:auto;display:flex;flex-direction:column;gap:5px;font-size:12px;"></div>
                                    </div>
                                </div>

                                <!-- TAB 2: CUP / MED ORDER STICKER -->
                                <div id="skmP2StkPanel_cup" class="skm-p2-card" style="display:none;">
                                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                        <strong style="font-size:13px;color:#38bdf8;" id="skmP2StkSrc">🥤 មុខទំនិញ</strong>
                                        <button class="skm-p2-btn" style="padding:5px 10px;font-size:11.5px;" onclick="window.SKMP2Stk.reload()">🔄 ទាញពី POS</button>
                                    </div>
                                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                                        <div><label class="skm-p2-label">Order #</label><input id="skmP2StkOrd" class="skm-p2-input" oninput="window.SKMP2Stk.preview()"></div>
                                        <div><label class="skm-p2-label">តុ / ភ្ញៀវ</label><input id="skmP2StkTbl" class="skm-p2-input" oninput="window.SKMP2Stk.preview()"></div>
                                    </div>
                                    <div style="margin-bottom:8px;"><label class="skm-p2-label">ឈ្មោះភេសជ្ជៈ ឬ ថ្នាំពេទ្យ</label><input id="skmP2StkNm" class="skm-p2-input" oninput="window.SKMP2Stk.preview()"></div>
                                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                                        <div><label class="skm-p2-label">ចំនួនកែវ / សន្លឹក</label><input type="number" id="skmP2StkQty" min="1" value="1" class="skm-p2-input"></div>
                                        <div><label class="skm-p2-label">តម្លៃ ($)</label><input type="number" step="0.01" id="skmP2StkPr" class="skm-p2-input" oninput="window.SKMP2Stk.preview()"></div>
                                    </div>
                                    <div style="margin-bottom:8px;"><label class="skm-p2-label">កំណត់ចំណាំ (ស្ករ / ទឹកកក / កម្រិតលេបថ្នាំ)</label><input id="skmP2StkNt" class="skm-p2-input" oninput="window.SKMP2Stk.preview()"></div>
                                    <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;">
                                        <button class="skm-p2-chip" onclick="window.SKMP2Stk.addChip('ស្ករ 100%')">ស្ករ 100%</button>
                                        <button class="skm-p2-chip" onclick="window.SKMP2Stk.addChip('ស្ករ 50%')">ស្ករ 50%</button>
                                        <button class="skm-p2-chip" onclick="window.SKMP2Stk.addChip('ស្ករ 0%')">ស្ករ 0%</button>
                                        <button class="skm-p2-chip" onclick="window.SKMP2Stk.addChip('ទឹកកកតិច')">ទឹកកកតិច</button>
                                        <button class="skm-p2-chip" onclick="window.SKMP2Stk.addChip('+គុជខ្មៅ')">+គុជខ្មៅ</button>
                                        <button class="skm-p2-chip" onclick="window.SKMP2Stk.addChip('ព្រឹក១ ល្ងាច១ ក្រោយបាយ')">💊 ព្រឹក១ ល្ងាច១</button>
                                    </div>
                                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                                        <button class="skm-p2-btn green" style="flex:1;" onclick="window.SKMP2Stk.printOne()">🖨️ ព្រីនស្ទីកគ័រនេះ</button>
                                        <button class="skm-p2-btn amber" style="flex:1;" onclick="window.SKMP2Stk.printAll()">🖨️ ព្រីនទាំងអស់ក្នុងវិក្កយបត្រ</button>
                                    </div>
                                </div>
                            </div>

                            <!-- RIGHT PANEL: LIVE PREVIEW & PRINTER SETTINGS -->
                            <div style="display:flex;flex-direction:column;gap:12px;">
                                <div class="skm-p2-card" style="text-align:center;">
                                    <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">👁️ គំរូស្ទីកគ័រជាក់ស្តែង (Live Preview — ស្កេនបានពិត!)</div>
                                    <div style="display:flex;justify-content:center;align-items:center;padding:12px;background:#020617;border-radius:10px;min-height:142px;">
                                        <iframe id="skmP2StkPrev" style="border:2px dashed #f59e0b;border-radius:6px;background:#fff;width:168px;height:126px;"></iframe>
                                    </div>
                                </div>
                                <div class="skm-p2-card">
                                    <div style="font-size:12.5px;font-weight:800;color:#fbbf24;margin-bottom:8px;">⚙️ កំណត់ខ្នាត ប្រភេទបាកូដ & ម៉ាស៊ីនព្រីន</div>
                                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                                        <div><label class="skm-p2-label">ខ្នាតស្ទីកគ័រ</label>
                                            <select id="skmP2StkSz" class="skm-p2-select" onchange="window.SKMP2Stk.preview()">
                                                <option value="40x30">40 × 30 mm (ស្គីនខែ / កែវ)</option>
                                                <option value="50x30">50 × 30 mm (ប្រអប់ធំ / ថ្នាំ)</option>
                                                <option value="35x25">35 × 25 mm (មធ្យម)</option>
                                                <option value="30x20">30 × 20 mm (តូច / គ្រឿងសំអាង)</option>
                                                <option value="58x40">58 × 40 mm (ធំ)</option>
                                            </select>
                                        </div>
                                        <div><label class="skm-p2-label">ប្រភេទខ្សែបាកូដ</label>
                                            <select id="skmP2StkFmt" class="skm-p2-select" onchange="window.SKMP2Stk.preview()">
                                                <option value="code128">Code-128 (ណែនាំ • ស្កេនលឿន)</option>
                                                <option value="code39">Code-39 (ស្តង់ដារ)</option>
                                            </select>
                                        </div>
                                        <div><label class="skm-p2-label">បង្ហាញតម្លៃលើស្ទីកគ័រ</label>
                                            <select id="skmP2StkShowPr" class="skm-p2-select" onchange="window.SKMP2Stk.preview()">
                                                <option value="true">✅ បង្ហាញតម្លៃ ($)</option>
                                                <option value="false">❌ លាក់តម្លៃ</option>
                                            </select>
                                        </div>
                                        <div><label class="skm-p2-label">បង្ហាញតម្លៃជារៀល (៛)</label>
                                            <select id="skmP2StkShowKhr" class="skm-p2-select" onchange="window.SKMP2Stk.preview()">
                                                <option value="false">❌ តែដុល្លារ ($)</option>
                                                <option value="true">✅ ដុល្លារ + រៀល (៛)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <label class="skm-p2-label">ឈ្មោះម៉ាស៊ីនព្រីនស្ទីកគ័រ USB (PC Desktop App)</label>
                                    <div style="display:flex;gap:6px;margin-bottom:10px;">
                                        <input id="skmP2StkPrn" class="skm-p2-input" placeholder="ឧ. Xprinter XP-365B / XP-350B">
                                        <button class="skm-p2-btn" onclick="window.SKMP2Stk.findPrinters()">🔍 រក</button>
                                    </div>
                                    <button class="skm-p2-btn green" style="width:100%;" onclick="window.SKMP2Stk.saveCfg()">💾 រក្សាទុកការកំណត់</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
            }

            function readUiCfg() {
                return Object.assign(loadCfg(), {
                    size: document.getElementById('skmP2StkSz')?.value || '40x30',
                    barcodeFormat: document.getElementById('skmP2StkFmt')?.value || 'code128',
                    showPrice: document.getElementById('skmP2StkShowPr')?.value !== 'false',
                    showKhr: document.getElementById('skmP2StkShowKhr')?.value === 'true',
                    printerName: document.getElementById('skmP2StkPrn')?.value.trim() || ''
                });
            }

            window.SKMP2Stk = {
                open(defaultTab = 'barcode') {
                    ensureModal();
                    const c = loadCfg();
                    document.getElementById('skmP2StkSz').value = c.size || '40x30';
                    document.getElementById('skmP2StkFmt').value = c.barcodeFormat || 'code128';
                    document.getElementById('skmP2StkShowPr').value = String(c.showPrice !== false);
                    document.getElementById('skmP2StkShowKhr').value = String(Boolean(c.showKhr));
                    document.getElementById('skmP2StkPrn').value = c.printerName || '';
                    this.loadBcCategories();
                    this.renderBcSearch('');
                    this.renderBcQueue();
                    this.reload();
                    document.getElementById('skmP2StkModal').classList.add('open');
                    this.tab(defaultTab);
                },
                tab(t) {
                    curStkTab = t;
                    ['barcode', 'cup'].forEach(k => {
                        const el = document.getElementById(`skmP2StkPanel_${k}`);
                        if (el) el.style.display = (k === t) ? (k === 'barcode' ? 'flex' : 'block') : 'none';
                    });
                    document.querySelectorAll('#skmP2StkModal .skm-p2-tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-t') === t));
                    this.preview();
                },
                loadBcCategories() {
                    const sel = document.getElementById('skmP2BcCatSel');
                    if (!sel) return;
                    const cats = [...new Set(getInvList().filter(p => p && p.category).map(p => String(p.category).trim()).filter(Boolean))];
                    sel.innerHTML = '<option value="">-- ប្រភេទទំនិញ --</option>' + cats.map(c => `<option value="${escHtml(c)}">${escHtml(c)}</option>`).join('');
                },
                renderBcSearch(q) {
                    const box = document.getElementById('skmP2BcSearchBox');
                    if (!box) return;
                    const inv = getInvList().filter(p => p && p.name);
                    const ql = String(q || '').trim().toLowerCase();
                    const list = (ql ? inv.filter(p =>
                        String(p.name).toLowerCase().includes(ql) ||
                        String(p.customId || '').toLowerCase().includes(ql) ||
                        String(p.id || '').toLowerCase().includes(ql) ||
                        String(p.category || '').toLowerCase().includes(ql)
                    ) : inv).slice(0, 25);
                    if (!list.length) {
                        box.innerHTML = '<div style="text-align:center;color:#94a3b8;font-size:11.5px;padding:10px;">រកមិនឃើញទំនិញក្នុងស្តុកទេ។</div>';
                        return;
                    }
                    box.innerHTML = list.map((p, idx) => {
                        const code = String(p.customId || p.barcode || p.id || '');
                        const pidEsc = escHtml(String(p.id || p.customId || idx));
                        return `
                            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding:5px 8px;border-radius:8px;background:#1e293b;font-size:12px;">
                                <div style="min-width:0;cursor:pointer;flex:1;" onclick="window.SKMP2Stk.pickProduct('${pidEsc}', false)">
                                    <div style="font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(p.name)}</div>
                                    <div style="font-size:10.5px;color:#94a3b8;">កូដ៖ <b style="color:#38bdf8;">${escHtml(code)}</b> • $${Number(p.price||0).toFixed(2)} • ស្តុក ${Number(p.qty||0)}</div>
                                </div>
                                <button class="skm-p2-btn green" style="padding:4px 8px;font-size:11px;" onclick="window.SKMP2Stk.pickProduct('${pidEsc}', true)">➕ បញ្ជី</button>
                            </div>`;
                    }).join('');
                },
                pickProduct(pid, alsoQueue) {
                    const p = getInvList().find(x => x && (String(x.id) === String(pid) || String(x.customId) === String(pid)));
                    if (!p) return;
                    const code = String(p.customId || p.barcode || p.id || ('SKM' + String(Date.now()).slice(-6)));
                    const exp = p.expiry || p.expDate || p.expiryDate || '';
                    document.getElementById('skmP2BcName').value = p.name || '';
                    document.getElementById('skmP2BcCode').value = code;
                    document.getElementById('skmP2BcPrice').value = Number(p.price || 0).toFixed(2);
                    document.getElementById('skmP2BcExp').value = exp;
                    document.getElementById('skmP2BcQty').value = 1;
                    this.preview();
                    if (alsoQueue) {
                        const ex = bcQueue.find(x => x.code === code && x.name === p.name);
                        if (ex) ex.qty += 1;
                        else bcQueue.push({ code, name: p.name, price: Number(p.price || 0), expiry: exp, qty: 1 });
                        this.renderBcQueue();
                        showPack2Toast(`➕ បានបន្ថែម "${p.name}" ចូលបញ្ជីព្រីន!`);
                    }
                },
                addCategoryToQueue() {
                    const cat = document.getElementById('skmP2BcCatSel')?.value || '';
                    if (!cat) return showPack2Toast('⚠️ សូមជ្រើសរើសប្រភេទទំនិញជាមុនសិន!', true);
                    const items = getInvList().filter(p => p && String(p.category || '').trim() === cat);
                    if (!items.length) return showPack2Toast('⚠️ គ្មានទំនិញក្នុងប្រភេទនេះទេ!', true);
                    items.forEach(p => {
                        const code = String(p.customId || p.barcode || p.id || ('SKM' + Math.floor(100000 + Math.random() * 900000)));
                        const exp = p.expiry || p.expDate || p.expiryDate || '';
                        if (!bcQueue.some(x => x.code === code)) {
                            bcQueue.push({ code, name: p.name, price: Number(p.price || 0), expiry: exp, qty: 1 });
                        }
                    });
                    this.renderBcQueue();
                    showPack2Toast(`✅ បានទាញទំនិញ ${items.length} មុខក្នុង "${cat}" ចូលបញ្ជីព្រីន!`);
                },
                addFormToQueue() {
                    const name = document.getElementById('skmP2BcName').value.trim() || 'Product';
                    const code = document.getElementById('skmP2BcCode').value.trim() || ('SKM' + String(Date.now()).slice(-6));
                    const price = Number(document.getElementById('skmP2BcPrice').value || 0);
                    const expiry = document.getElementById('skmP2BcExp').value.trim();
                    const qty = Math.max(1, Number(document.getElementById('skmP2BcQty').value || 1));
                    const ex = bcQueue.find(x => x.code === code && x.name === name);
                    if (ex) ex.qty += qty;
                    else bcQueue.push({ code, name, price, expiry, qty });
                    this.renderBcQueue();
                },
                updateBcQueueQty(idx, val) {
                    if (!bcQueue[idx]) return;
                    bcQueue[idx].qty = Math.max(1, Number(val || 1));
                    document.getElementById('skmP2BcQueueTot').textContent = bcQueue.reduce((s, x) => s + x.qty, 0);
                },
                removeBcQueueItem(idx) {
                    bcQueue.splice(idx, 1);
                    this.renderBcQueue();
                },
                clearBcQueue() {
                    bcQueue = [];
                    this.renderBcQueue();
                },
                renderBcQueue() {
                    const box = document.getElementById('skmP2BcQueueBox');
                    const totEl = document.getElementById('skmP2BcQueueTot');
                    if (!box || !totEl) return;
                    const tot = bcQueue.reduce((s, x) => s + x.qty, 0);
                    totEl.textContent = tot;
                    if (!bcQueue.length) {
                        box.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:10px;">មិនទាន់មានទំនិញក្នុងបញ្ជីព្រីនទេ (ចុច ➕ បញ្ជី ឬ ➕ ទាញប្រភេទ)។</div>';
                        return;
                    }
                    box.innerHTML = bcQueue.map((it, i) => `
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;background:#0f172a;padding:5px 8px;border-radius:8px;border:1px solid rgba(148,163,184,0.2);">
                            <div style="min-width:0;flex:1;">
                                <div style="font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(it.name)}</div>
                                <div style="font-size:10.5px;color:#94a3b8;">${escHtml(it.code)} • $${Number(it.price).toFixed(2)}</div>
                            </div>
                            <input type="number" min="1" max="500" value="${it.qty}" onchange="window.SKMP2Stk.updateBcQueueQty(${i}, this.value)" class="skm-p2-input" style="width:58px;padding:4px 6px;text-align:center;font-size:12px;">
                            <button class="skm-p2-btn red" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP2Stk.removeBcQueueItem(${i})">✕</button>
                        </div>`).join('');
                },
                genRandomCode() {
                    const rnd = '885' + String(Math.floor(100000000 + Math.random() * 900000000));
                    document.getElementById('skmP2BcCode').value = rnd;
                    this.preview();
                },
                printSingleBarcode() {
                    const cfg = readUiCfg();
                    const item = {
                        name: document.getElementById('skmP2BcName').value.trim() || 'Product',
                        code: document.getElementById('skmP2BcCode').value.trim() || 'SKM001',
                        price: Number(document.getElementById('skmP2BcPrice').value || 0),
                        expiry: document.getElementById('skmP2BcExp').value.trim(),
                        qty: Math.max(1, Number(document.getElementById('skmP2BcQty').value || 1))
                    };
                    sendHtmlToStickerPrinter(buildBarcodeStickerHtml([item], cfg), cfg, `🏷️ ព្រីនស្ទីកគ័របាកូដ (${item.qty} សន្លឹក) ជោគជ័យ!`);
                },
                printBcQueue() {
                    if (!bcQueue.length) return showPack2Toast('⚠️ សូមបន្ថែមទំនិញចូលបញ្ជីព្រីនសិន!', true);
                    const cfg = readUiCfg();
                    const tot = bcQueue.reduce((s, x) => s + x.qty, 0);
                    sendHtmlToStickerPrinter(buildBarcodeStickerHtml(bcQueue, cfg), cfg, `🏷️ ព្រីនស្ទីកគ័របាកូដសរុប ${tot} សន្លឹកជោគជ័យ!`);
                },
                reload() {
                    curOrderBundle = grabOrderItems();
                    document.getElementById('skmP2StkSrc').textContent = `🥤 ${curOrderBundle.src} (${curOrderBundle.items.length} មុខ)`;
                    document.getElementById('skmP2StkOrd').value = curOrderBundle.orderNo;
                    document.getElementById('skmP2StkTbl').value = curOrderBundle.table;
                    const it = curOrderBundle.items[0] || { name: 'Iced Latte', qty: 1, price: 2.5, note: '' };
                    document.getElementById('skmP2StkNm').value = it.name;
                    document.getElementById('skmP2StkQty').value = it.qty;
                    document.getElementById('skmP2StkPr').value = it.price;
                    document.getElementById('skmP2StkNt').value = it.note;
                    if (curStkTab === 'cup') this.preview();
                },
                addChip(txt) {
                    const el = document.getElementById('skmP2StkNt');
                    el.value = el.value.trim() ? `${el.value.trim()} • ${txt}` : txt;
                    this.preview();
                },
                preview() {
                    const cfg = readUiCfg();
                    const { w, h } = parseSize(cfg.size);
                    const fr = document.getElementById('skmP2StkPrev');
                    if (!fr) return;
                    fr.style.width = `${Math.round(w * 4.4)}px`;
                    fr.style.height = `${Math.round(h * 4.4)}px`;
                    let html = '';
                    if (curStkTab === 'barcode') {
                        html = buildBarcodeStickerHtml([{
                            name: document.getElementById('skmP2BcName')?.value || 'Product',
                            code: document.getElementById('skmP2BcCode')?.value || '8850012345',
                            price: Number(document.getElementById('skmP2BcPrice')?.value || 0),
                            expiry: document.getElementById('skmP2BcExp')?.value || '',
                            qty: 1
                        }], cfg);
                    } else {
                        html = buildCupStickerHtml([{
                            name: document.getElementById('skmP2StkNm')?.value || 'Item',
                            qty: 1,
                            price: Number(document.getElementById('skmP2StkPr')?.value || 0),
                            note: document.getElementById('skmP2StkNt')?.value || ''
                        }], {
                            orderNo: document.getElementById('skmP2StkOrd')?.value || '#001',
                            table: document.getElementById('skmP2StkTbl')?.value || ''
                        }, cfg);
                    }
                    fr.contentWindow.document.open(); fr.contentWindow.document.write(html); fr.contentWindow.document.close();
                },
                printOne() {
                    const cfg = readUiCfg();
                    const item = {
                        name: document.getElementById('skmP2StkNm').value.trim() || 'Item',
                        qty: Math.max(1, Number(document.getElementById('skmP2StkQty').value || 1)),
                        price: Number(document.getElementById('skmP2StkPr').value || 0),
                        note: document.getElementById('skmP2StkNt').value.trim()
                    };
                    sendHtmlToStickerPrinter(buildCupStickerHtml([item], {
                        orderNo: document.getElementById('skmP2StkOrd').value,
                        table: document.getElementById('skmP2StkTbl').value
                    }, cfg), cfg, '🧋 បានព្រីនស្ទីកគ័រកែវជោគជ័យ!');
                },
                printAll() {
                    const cfg = readUiCfg();
                    const b = curOrderBundle || grabOrderItems();
                    sendHtmlToStickerPrinter(buildCupStickerHtml(b.items, {
                        orderNo: document.getElementById('skmP2StkOrd').value,
                        table: document.getElementById('skmP2StkTbl').value
                    }, cfg), cfg, '🧋 បានព្រីនស្ទីកគ័រទាំងអស់ក្នុងវិក្កយបត្រជោគជ័យ!');
                },
                async findPrinters() {
                    if (!window.SKMDesktopBridge || !window.SKMDesktopBridge.getPrinters) {
                        return showPack2Toast('ℹ️ មុខងាររក USB Printer ដំណើរការតែក្នុង PC Desktop App!', true);
                    }
                    const r = await window.SKMDesktopBridge.getPrinters();
                    const list = (r && r.printers) || [];
                    if (!list.length) return showPack2Toast('⚠️ រកមិនឃើញម៉ាស៊ីនព្រីនទេ!', true);
                    const pick = prompt('រើសលេខរៀងម៉ាស៊ីនព្រីនស្ទីកគ័រ:\n' + list.map((p, i) => `${i + 1}. ${p.name}`).join('\n'), '1');
                    if (list[Number(pick) - 1]) document.getElementById('skmP2StkPrn').value = list[Number(pick) - 1].name;
                },
                saveCfg() {
                    localStorage.setItem(getCfgKey(), JSON.stringify(readUiCfg()));
                    showPack2Toast('✅ រក្សាទុកការកំណត់ស្ទីកគ័រជោគជ័យ!');
                }
            };

            registerInPosToolbox('🏷️', 'ស្ទីកគ័របាកូដទំនិញ & កែវកាហ្វេ (Sticker Pro)', () => window.SKMP2Stk.open('barcode'));
    });
    // ========================================================================
    // [3/8] 🔗 ចែករំលែកម៉ឺនុយ & ទំនិញរហ័ស (Power QR & Telegram/Facebook Share Hub)
    // ជំនួសការផ្ញើរូបភាពម្ដងមួយៗក្នុង Chat — ចុច ១ ដងស៊ែរ Link ម៉ឺនុយ ឬទំនិញទៅ Telegram/FB
    // ========================================================================
    registerPack2Module('powerShareHub', function initPowerSharePlugin() {
            function getMenuUrl(extraQuery = '') {
                const br = getBranchId();
                const isLocal = /^https?:\/\/(127\.0\.0\.1|localhost)/i.test(window.location.href);
                const publicBase = isLocal
                    ? 'https://sings6912-debug.github.io/skm-pos-system/'
                    : window.location.href.split('?')[0].replace(/[^/]*$/, '');
                return `${publicBase}menu.html?branch=${encodeURIComponent(br)}${extraQuery}`;
            }

            function ensureModal() {
                if (document.getElementById('skmP2ShareModal')) return;
                injectPack2Styles();
                const m = document.createElement('div');
                m.id = 'skmP2ShareModal';
                m.className = 'skm-p2-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p2-box" style="max-width:1040px;width:96vw;">
                        <div class="skm-p2-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#38bdf8;">🔗 ចែករំលែកម៉ឺនុយ & ទំនិញរហ័ស (Power QR Hub)</div>
                                <div style="font-size:11.5px;color:#94a3b8;">ឈប់ផ្ញើរូបភាពម្ដងមួយៗ — ចុច ១ ដងស៊ែរ Link ម៉ឺនុយ ឬទំនិញទៅ Telegram / Facebook</div>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <button class="skm-p2-btn red" onclick="document.getElementById('skmP2ShareModal').classList.remove('open')">✕ បិទ</button>
                            </div>
                        </div>
                        <div class="skm-p2-body skm-p2-qr-layout">
                            <!-- LEFT: STORE LINK + QR -->
                            <div class="skm-p2-card" style="text-align:center;display:flex;flex-direction:column;justify-content:space-between;">
                                <div>
                                    <div style="font-size:14.5px;font-weight:900;color:#34d399;margin-bottom:8px;" id="skmP2ShShop">🏪 ម៉ឺនុយអនឡាញហាង</div>
                                    <img id="skmP2ShQr" src="" style="width:190px;height:190px;background:#fff;padding:8px;border-radius:14px;margin:6px auto;display:block;">
                                    <input id="skmP2ShUrl" class="skm-p2-input" readonly style="font-size:11px;text-align:center;margin:10px 0;">
                                </div>
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;">
                                    <button class="skm-p2-btn tg" style="padding:9px 8px;font-size:12px;" onclick="window.SKMP2Share.shareShop('tg')">✈️ Telegram</button>
                                    <button class="skm-p2-btn fb" style="padding:9px 8px;font-size:12px;" onclick="window.SKMP2Share.shareShop('fb')">📘 Facebook</button>
                                    <button class="skm-p2-btn green" style="padding:9px 8px;font-size:12px;" onclick="window.SKMP2Share.copyShopPitch()">📋 Copy សារ</button>
                                    <button class="skm-p2-btn amber" style="padding:9px 8px;font-size:12px;" onclick="window.SKMP2Share.printQrCard()">🖨️ ព្រីន QR</button>
                                </div>
                            </div>

                            <!-- RIGHT: SEARCH & SHARE SPECIFIC PRODUCT (Auto-fit height, zero horizontal clip) -->
                            <div class="skm-p2-card" style="display:flex;flex-direction:column;min-width:0;overflow:hidden;">
                                <strong style="font-size:13.5px;color:#38bdf8;margin-bottom:8px;">🛍️ ស៊ែរទំនិញណាមួយទៅភ្ញៀវភ្លាមៗ</strong>
                                <input id="skmP2ShSearch" class="skm-p2-input" placeholder="🔍 វាយឈ្មោះទំនិញ ឬប្រភេទ..." oninput="window.SKMP2Share.renderList(this.value)" style="margin-bottom:10px;">
                                <div id="skmP2ShList" style="flex:1;max-height:calc(88vh - 190px);overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;gap:8px;padding-right:2px;"></div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
            }

            window.SKMP2Share = {
                open() {
                    ensureModal();
                    const url = getMenuUrl();
                    const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || getBranchId();
                    document.getElementById('skmP2ShShop').textContent = `🏪 ${shop}`;
                    document.getElementById('skmP2ShUrl').value = url;
                    document.getElementById('skmP2ShQr').src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=6&data=${encodeURIComponent(url)}`;
                    this.renderList('');
                    document.getElementById('skmP2ShareModal').classList.add('open');
                },
                renderList(q) {
                    const box = document.getElementById('skmP2ShList');
                    let inv = Array.isArray(window.inventory) ? window.inventory : [];
                    if (!inv.length) {
                        try { inv = JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_inv_pro`) || '[]'); } catch (e) {}
                    }
                    const ql = String(q || '').toLowerCase().trim();
                    const items = (ql ? inv.filter(p => String(p.name || '').toLowerCase().includes(ql) || String(p.category || '').toLowerCase().includes(ql)) : inv).slice(0, 35);
                    if (!items.length) {
                        box.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:24px;font-size:12.5px;">រកមិនឃើញទំនិញក្នុងស្តុកទេ។</div>';
                        return;
                    }
                    box.innerHTML = items.map(p => {
                        const pr = Number(p.price || 0).toFixed(2);
                        const safeName = escHtml(p.name || 'Item');
                        const encName = encodeURIComponent(p.name || '');
                        return `
                            <div style="background:#0f172a;border:1px solid rgba(148,163,184,0.2);border-radius:12px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;box-sizing:border-box;min-width:0;">
                                <div style="flex:1;min-width:0;overflow:hidden;">
                                    <div style="font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${safeName}">${safeName}</div>
                                    <div style="font-size:11.5px;color:#34d399;font-weight:800;">$${pr} <span style="color:#94a3b8;font-weight:400;">(${escHtml(p.category || 'ទូទៅ')})</span></div>
                                </div>
                                <div style="display:flex;gap:6px;flex-shrink:0;">
                                    <button class="skm-p2-btn tg" style="padding:6px 9px;font-size:12px;min-width:34px;" title="ស៊ែរ Telegram" onclick="window.SKMP2Share.shareItem('tg', decodeURIComponent('${encName}'), '${pr}')">✈️</button>
                                    <button class="skm-p2-btn fb" style="padding:6px 9px;font-size:12px;min-width:34px;" title="ស៊ែរ Facebook" onclick="window.SKMP2Share.shareItem('fb', decodeURIComponent('${encName}'), '${pr}')">📘</button>
                                    <button class="skm-p2-btn green" style="padding:6px 9px;font-size:12px;min-width:34px;" title="ចម្លង Link" onclick="window.SKMP2Share.shareItem('copy', decodeURIComponent('${encName}'), '${pr}')">📋</button>
                                </div>
                            </div>`;
                    }).join('');
                },
                shareShop(platform) {
                    const url = getMenuUrl();
                    const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || getBranchId();
                    const txt = `🛍️ សួស្តីបង! អាចចុចមើលទំនិញ និងកុម្ម៉ង់ផ្ទាល់តាមម៉ឺនុយអនឡាញរបស់ ${shop} នៅទីនេះបាន៖`;
                    if (platform === 'tg') window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(txt)}`, '_blank');
                    if (platform === 'fb') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                },
                copyShopPitch() {
                    const url = getMenuUrl();
                    const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || getBranchId();
                    const msg = `🛍️ សួស្តីបង! ដើម្បីងាយស្រួលមើលម៉ូដ និងតម្លៃទំនិញទាំងអស់របស់ ${shop} បងអាចចុចចូលមើលតាម Link ខាងក្រោម ហើយជ្រើសរើសកុម្ម៉ង់បានភ្លាមៗ៖\n👉 ${url}`;
                    navigator.clipboard?.writeText(msg).then(() => showPack2Toast('📋 បានចម្លងសារ & Link ម៉ឺនុយរួចរាល់!')).catch(() => prompt('Copy:', msg));
                },
                shareItem(platform, name, price) {
                    const url = getMenuUrl(`&q=${encodeURIComponent(name)}`);
                    const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || getBranchId();
                    const txt = `✨ ${name}\n💵 តម្លៃ៖ $${price}\n🏪 ហាង៖ ${shop}\n👉 ចុចមើល & កុម្ម៉ង់៖`;
                    if (platform === 'tg') window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(txt)}`, '_blank');
                    else if (platform === 'fb') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                    else navigator.clipboard?.writeText(`${txt} ${url}`).then(() => showPack2Toast(`📋 បានចម្លង Link "${name}" ជោគជ័យ!`));
                },
                printQrCard() {
                    const url = getMenuUrl();
                    const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || getBranchId();
                    const w = window.open('', '_blank', 'width=540,height=720');
                    if (!w) return;
                    w.document.write(`<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>QR Menu — ${escHtml(shop)}</title><link href="https://fonts.googleapis.com/css2?family=Battambang:wght@700&display=swap" rel="stylesheet"><style>body{font-family:'Battambang',sans-serif;text-align:center;padding:30px;}.card{border:4px solid #0284c7;border-radius:24px;padding:28px;max-width:400px;margin:0 auto;}img{width:260px;height:260px;margin:16px 0;}@media print{.np{display:none;}}</style></head><body><div class="card"><h1 style="margin:0;color:#0284c7;">${escHtml(shop)}</h1><p style="margin:6px 0 0;color:#334155;">📱 ស្កេន QR ដើម្បីមើលទំនិញ និងកុម្ម៉ង់ភ្លាមៗ</p><img src="https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(url)}"><div style="font-size:12px;color:#64748b;word-break:break-all;">${escHtml(url)}</div></div><button class="np" onclick="window.print()" style="margin-top:16px;padding:10px 22px;background:#0284c7;color:#fff;border:none;border-radius:10px;font-size:15px;cursor:pointer;">🖨️ បោះពុម្ព</button></body></html>`);
                    w.document.close();
                }
            };

            registerInPosToolbox('🔗', 'ចែករំលែកម៉ឺនុយ & ទំនិញ (Power QR)', () => window.SKMP2Share.open());
    });

    // ========================================================================
    // [4/8] 📦 លក់ច្រើនឯកតា & លក់ដុំថែម (Multi-Unit & Wholesale Bonus + Auto Stock Multiplier)
    // ស័ក្តិសមបំផុតសម្រាប់ ហាងបោះដុំ, ម៉ាត, គ្រឿងសំអាង (រាយ/កន្លះឡូ+១/១ឡូ+២/១កេះ) និង ឱសថស្ថាន (គ្រាប់/បន្ទះ/ប្រអប់)
    // ========================================================================
    registerPack2Module('multiUnitWholesale', function initMultiUnitWholesalePlugin() {
            const getMuCfgKey = () => `ks2_${getBranchId()}_multi_unit_cfg`;
            const getMuDoneInvKey = () => `ks2_${getBranchId()}_multi_unit_deducted_ids`;

            function loadMuData() {
                let data = { interceptBarcode: true, products: {} };
                try {
                    const sys = window.sysSettings || JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_sys_settings`) || '{}');
                    if (sys && sys.multiUnitConfig && typeof sys.multiUnitConfig === 'object') {
                        data = Object.assign(data, sys.multiUnitConfig);
                    }
                    const raw = localStorage.getItem(getMuCfgKey());
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        if (parsed && typeof parsed === 'object') {
                            data.interceptBarcode = parsed.interceptBarcode !== false;
                            data.products = Object.assign({}, data.products || {}, parsed.products || {});
                        }
                    }
                } catch (e) {}
                if (!data.products || typeof data.products !== 'object') data.products = {};
                return data;
            }

            async function saveMuData(data) {
                const br = getBranchId();
                localStorage.setItem(getMuCfgKey(), JSON.stringify(data));
                try {
                    const sysKey = `ks2_${br}_sys_settings`;
                    const sys = Object.assign({}, window.sysSettings || JSON.parse(localStorage.getItem(sysKey) || '{}'));
                    sys.multiUnitConfig = data;
                    window.sysSettings = sys;
                    localStorage.setItem(sysKey, JSON.stringify(sys));

                    if (window.supabaseClient && navigator.onLine) {
                        const cleanSys = typeof window.stripLocalThemeForCloud === 'function' ? window.stripLocalThemeForCloud(sys) : sys;
                        const nowIso = new Date().toISOString();
                        localStorage.setItem(`ks2_${br}_last_update`, new Date(nowIso).getTime().toString());
                        await window.supabaseClient.from('branch_store').update({
                            sys_settings: cleanSys, updated_at: nowIso
                        }).eq('branch_id', br);
                    }
                } catch (e) {}
            }

            function getInventoryList() {
                if (Array.isArray(window.inventory) && window.inventory.length) return window.inventory;
                try {
                    return JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_inv_pro`) || '[]');
                } catch (e) { return []; }
            }

            function findProductByCodeOrId(code) {
                const c = String(code || '').trim().toLowerCase();
                if (!c) return null;
                return getInventoryList().find(p => p && (
                    String(p.id || '').toLowerCase() === c ||
                    String(p.customId || '').toLowerCase() === c ||
                    String(p.barcode || '').toLowerCase() === c
                )) || null;
            }

            function getTiersForProduct(prod) {
                if (!prod) return [];
                const cfg = loadMuData();
                const pid = String(prod.id || prod.customId || '');
                const customKey = String(prod.customId || '');
                return cfg.products[pid] || (customKey && cfg.products[customKey]) || [];
            }

            // Deduct base stock strictly ONCE per invoice for any MU_ multi-unit items
            function processPendingMultiUnitDeductions() {
                const br = getBranchId();
                const invs = Array.isArray(window.invoices) ? window.invoices : [];
                if (!invs.length) return;
                let doneIds = [];
                try { doneIds = JSON.parse(localStorage.getItem(getMuDoneInvKey()) || '[]'); } catch (e) {}
                const doneSet = new Set(doneIds);
                const inventory = getInventoryList();
                let changed = false;
                const cloudDeductBatch = []; // [{ id, deductQty, newQty }]

                // Check latest 25 invoices
                invs.slice(0, 25).forEach(inv => {
                    if (!inv || !inv.id || doneSet.has(String(inv.id))) return;
                    const st = String(inv.status || '').toLowerCase();
                    if (st === 'cancelled' || st === 'void' || st === 'refunded') return;
                    const items = Array.isArray(inv.items) ? inv.items : (Array.isArray(inv.cart) ? inv.cart : []);
                    const muItems = items.filter(it => it && (it.skmMultiUnit || String(it.id || '').startsWith('MU_')));
                    if (!muItems.length) return;

                    let deductedAny = false;
                    muItems.forEach(it => {
                        let meta = it.skmMultiUnit;
                        if (!meta && String(it.id || '').startsWith('MU_')) {
                            // Parse fallback MU_<baseId>_<deductPerPack>
                            const parts = String(it.id).split('__');
                            if (parts.length >= 3) {
                                meta = { baseProductId: parts[1], deductPerPack: Number(parts[2]) || 1, unitLabel: it.unit || 'ឈុត' };
                            }
                        }
                        if (!meta || !meta.baseProductId) return;
                        const packQty = Math.max(1, Number(it.cartQty || it.qty || 1));
                        const totalDeduct = packQty * Math.max(1, Number(meta.deductPerPack || 1));
                        const baseProd = inventory.find(p => p && (String(p.id) === String(meta.baseProductId) || String(p.customId) === String(meta.baseProductId)));
                        if (baseProd) {
                            baseProd.qty = Math.max(0, (Number(baseProd.qty) || 0) - totalDeduct);
                            cloudDeductBatch.push({ id: baseProd.id, deductQty: totalDeduct, newQty: baseProd.qty });
                            deductedAny = true;
                            if (Array.isArray(window.historyLog)) {
                                window.historyLog.unshift({
                                    id: Date.now() + Math.floor(Math.random() * 100),
                                    date: new Date().toLocaleString('km-KH'),
                                    type: 'sale',
                                    itemName: baseProd.name,
                                    qty: -totalDeduct,
                                    note: `[Multi-Unit] លក់ ${packQty} x ${meta.unitLabel || 'ឈុត'} (កាត់ស្តុក -${totalDeduct}) • វិក្កយបត្រ ${inv.id}`
                                });
                            }
                        }
                    });

                    doneSet.add(String(inv.id));
                    if (deductedAny) changed = true;
                });

                if (changed) {
                    const nextDone = Array.from(doneSet).slice(-300);
                    localStorage.setItem(getMuDoneInvKey(), JSON.stringify(nextDone));
                    try { localStorage.setItem(`ks2_${br}_inv_pro`, JSON.stringify(inventory)); } catch (e) {}
                    if (typeof window.renderInventory === 'function') window.renderInventory();
                    if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();

                    // Ultra-Low-Egress Cloud Sync: update ONLY the exact deducted product row(s) in pos_products (~60B each)
                    if (window.supabaseClient && navigator.onLine && cloudDeductBatch.length) {
                        (async () => {
                            try {
                                const nowIso = new Date().toISOString();
                                for (const item of cloudDeductBatch) {
                                    const { error: rpcErr } = await window.supabaseClient.rpc('deduct_stock_safely', {
                                        p_product_id: item.id,
                                        p_branch_id: br,
                                        deduct_qty: item.deductQty
                                    });
                                    if (rpcErr) {
                                        await window.supabaseClient.from('pos_products')
                                            .update({ qty: item.newQty, updated_at: nowIso })
                                            .eq('id', item.id)
                                            .eq('branch_id', br);
                                    }
                                }
                                if (typeof window.touchCloudSync === 'function') await window.touchCloudSync();
                            } catch (e) {}
                        })();
                    }
                    showPack2Toast('📦 បានកាត់ស្តុកច្រើនឯកតា (Multi-Unit) & Sync ឡើង Cloud ជោគជ័យ!');
                } else if (doneSet.size > doneIds.length) {
                    localStorage.setItem(getMuDoneInvKey(), JSON.stringify(Array.from(doneSet).slice(-300)));
                }
            }

            // Watch checkout completion safely
            setInterval(processPendingMultiUnitDeductions, 2500);
            window.addEventListener('skm:order-paid', () => setTimeout(processPendingMultiUnitDeductions, 400));

            function addTierToCart(prod, tier, packQty = 1) {
                const qtyPacks = Math.max(1, Number(packQty || 1));
                const baseQty = Math.max(1, Number(tier.baseQty || 1));
                const bonusQty = Math.max(0, Number(tier.bonusQty || 0));
                const deductPerPack = baseQty + bonusQty;
                const needStock = qtyPacks * deductPerPack;
                const availStock = Number(prod.qty || 0);

                if (availStock < needStock) {
                    showPack2Toast(`⚠️ ស្តុកមិនគ្រប់! ត្រូវការ ${needStock} (ស្តុកនៅសល់ ${availStock})`, true);
                    return false;
                }

                const rate = parseFloat(document.getElementById('globalExchangeRate')?.value) || window.cartRate || window.EXCHANGE_RATE || 4000;
                const priceUsd = Math.max(0, Number(tier.price || 0));
                const bonusTxt = bonusQty > 0 ? ` + ថែម ${bonusQty}` : '';
                const unitLabel = `${tier.label}${bonusTxt}`;
                const muCartId = `MU__${prod.id || prod.customId}__${deductPerPack}__${encodeURIComponent(tier.label)}`;

                if (!Array.isArray(window.cart)) window.cart = [];
                const existing = window.cart.find(c => c && c.id === muCartId);
                if (existing) {
                    const nextNeed = ((Number(existing.cartQty || 1) + qtyPacks) * deductPerPack);
                    if (availStock < nextNeed) {
                        showPack2Toast(`⚠️ ស្តុកមិនគ្រប់សម្រាប់បន្ថែមទៀត! (សល់ ${availStock})`, true);
                        return false;
                    }
                    existing.cartQty = Number(existing.cartQty || 1) + qtyPacks;
                } else {
                    window.cart.push({
                        id: muCartId,
                        name: `${prod.name} [${unitLabel}]`,
                        price: priceUsd,
                        cost: Number(prod.cost || prod.costPrice || 0) * deductPerPack,
                        riel: priceUsd * rate,
                        unit: tier.label,
                        qty: Math.floor(availStock / deductPerPack),
                        image: prod.image || '',
                        cartQty: qtyPacks,
                        skmMultiUnit: {
                            baseProductId: String(prod.id || prod.customId),
                            baseProductName: prod.name,
                            unitLabel: unitLabel,
                            baseQty: baseQty,
                            bonusQty: bonusQty,
                            deductPerPack: deductPerPack
                        }
                    });
                }

                if (typeof window.renderCart === 'function') window.renderCart();
                if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
                showPack2Toast(`✅ បន្ថែម ${prod.name} (${unitLabel}) x${qtyPacks} ➔ កាត់ស្តុក ${needStock}`);
                return true;
            }

            // Fast-Pick Unit Popup when scanning barcode in #posSearch!
            let activeQuickPick = null;
            function openQuickUnitPicker(prod, tiers) {
                injectPack2Styles();
                let m = document.getElementById('skmP2MuPickModal');
                if (!m) {
                    m = document.createElement('div');
                    m.id = 'skmP2MuPickModal';
                    m.className = 'skm-p2-overlay';
                    m.onclick = (e) => { if (e.target === m) { m.classList.remove('open'); activeQuickPick = null; } };
                    document.body.appendChild(m);
                }
                activeQuickPick = { prod, tiers };
                const rate = parseFloat(document.getElementById('globalExchangeRate')?.value) || window.cartRate || window.EXCHANGE_RATE || 4000;
                m.innerHTML = `
                    <div class="skm-p2-box" style="max-width:520px;">
                        <div class="skm-p2-head">
                            <div>
                                <div style="font-size:15.5px;font-weight:900;color:#34d399;">📦 ជ្រើសរើសឯកតាលក់ (Quick Unit Pick)</div>
                                <div style="font-size:12px;color:#cbd5e1;">${escHtml(prod.name)} • ស្តុកដើមសល់៖ <b style="color:#fbbf24;">${Number(prod.qty || 0)}</b></div>
                            </div>
                            <button class="skm-p2-btn red" onclick="document.getElementById('skmP2MuPickModal').classList.remove('open')">✕</button>
                        </div>
                        <div class="skm-p2-body">
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                                <label class="skm-p2-label" style="margin:0;white-space:nowrap;">ចំនួនលក់ (Qty)៖</label>
                                <input type="number" id="skmP2MuPickQty" class="skm-p2-input" value="1" min="1" style="width:90px;text-align:center;font-weight:900;">
                                <span style="font-size:11.5px;color:#94a3b8;">💡 អាចចុចលេខ 1–${tiers.length} លើ Keyboard ដើម្បីរើសលឿន!</span>
                            </div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                                ${tiers.map((t, idx) => {
                                    const totDeduct = Number(t.baseQty || 1) + Number(t.bonusQty || 0);
                                    const khr = Math.round(Number(t.price || 0) * rate).toLocaleString();
                                    const canSell = Number(prod.qty || 0) >= totDeduct;
                                    return `
                                    <button type="button" ${canSell ? '' : 'disabled'} onclick="window.SKMP2Mu.pickTier(${idx})"
                                        style="text-align:left;padding:13px;border-radius:14px;border:1.5px solid ${canSell ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.35)'};background:${canSell ? '#1e293b' : 'rgba(30,41,59,0.5)'};color:#fff;cursor:${canSell ? 'pointer' : 'not-allowed'};opacity:${canSell ? '1' : '0.55'};font-family:inherit;transition:0.15s;">
                                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                                            <span style="font-size:11px;background:#0284c7;padding:1px 7px;border-radius:999px;font-weight:900;">[${idx + 1}]</span>
                                            <span style="font-size:11px;color:#fbbf24;font-weight:800;">កាត់ស្តុក -${totDeduct}</span>
                                        </div>
                                        <div style="font-size:14px;font-weight:900;color:#f8fafc;">${escHtml(t.label)} ${Number(t.bonusQty || 0) > 0 ? `<span style="color:#34d399;">+ថែម ${t.bonusQty}</span>` : ''}</div>
                                        <div style="font-size:16px;font-weight:900;color:#34d399;margin-top:4px;">$${Number(t.price || 0).toFixed(2)} <span style="font-size:11px;color:#94a3b8;font-weight:600;">(${khr}៛)</span></div>
                                    </button>`;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                `;
                m.classList.add('open');
            }

            // Keyboard shortcut 1..9 inside Quick Unit Picker
            document.addEventListener('keydown', (e) => {
                const m = document.getElementById('skmP2MuPickModal');
                if (!m || !m.classList.contains('open') || !activeQuickPick) return;
                if (e.key === 'Escape') { m.classList.remove('open'); activeQuickPick = null; return; }
                if (document.activeElement && document.activeElement.id === 'skmP2MuPickQty') return;
                const n = parseInt(e.key, 10);
                if (n >= 1 && n <= activeQuickPick.tiers.length) {
                    e.preventDefault();
                    window.SKMP2Mu.pickTier(n - 1);
                }
            });

            // Intercept USB Barcode Scan inside #posSearch (capture phase so we catch Enter before normal search adds 1 unit)
            function bindBarcodeIntercept() {
                const inp = document.getElementById('posSearch');
                if (!inp || inp.__skmMuBound) return;
                inp.__skmMuBound = true;
                inp.addEventListener('keydown', (e) => {
                    if (e.key !== 'Enter') return;
                    const cfg = loadMuData();
                    if (!cfg.interceptBarcode) return;
                    const code = inp.value.trim();
                    if (!code) return;
                    const prod = findProductByCodeOrId(code);
                    if (!prod) return;
                    const tiers = getTiersForProduct(prod);
                    if (tiers && tiers.length > 0) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        inp.value = '';
                        if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
                        openQuickUnitPicker(prod, tiers);
                    }
                }, true);
            }
            setInterval(bindBarcodeIntercept, 1200);

            // Main Multi-Unit Manager & Quick-Sell Modal
            let editingProdId = '';
            let editingTiers = [];

            function ensureMainModal() {
                if (document.getElementById('skmP2MuModal')) return;
                injectPack2Styles();
                const m = document.createElement('div');
                m.id = 'skmP2MuModal';
                m.className = 'skm-p2-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p2-box">
                        <div class="skm-p2-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#34d399;">📦 លក់ច្រើនឯកតា & លក់ដុំថែម (Multi-Unit & Wholesale)</div>
                                <div style="font-size:11.5px;color:#94a3b8;">បាញ់បាកូដ ១ លោតតម្លៃច្រើនឯកតា (រាយ / បន្ទះ / ឡូ+ថែម / កេះ) & កាត់ស្តុកស្វ័យប្រវត្តិ</div>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <button class="skm-p2-btn red" onclick="document.getElementById('skmP2MuModal').classList.remove('open')">✕ បិទ</button>
                            </div>
                        </div>
                        <div class="skm-p2-tabs">
                            <button class="skm-p2-tab active" data-t="sell" onclick="window.SKMP2Mu.tab('sell')">🛒 លក់ដុំ / លក់ច្រើនឯកតា</button>
                            <button class="skm-p2-tab" data-t="setup" onclick="window.SKMP2Mu.tab('setup')">⚙️ កំណត់តម្លៃឯកតា & ថែម</button>
                        </div>
                        <div class="skm-p2-body">
                            <!-- TAB 1: QUICK SELL -->
                            <div id="skmP2Mu_sell">
                                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
                                    <input id="skmP2MuSellSearch" class="skm-p2-input" style="flex:1;min-width:220px;" placeholder="🔍 ស្កេនបាកូដ ឬវាយឈ្មោះទំនិញ..." oninput="window.SKMP2Mu.renderSellList(this.value)">
                                    <label class="skm-p2-card" style="padding:7px 12px;display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;">
                                        <input type="checkbox" id="skmP2MuAutoPop" onchange="window.SKMP2Mu.toggleAutoPop(this.checked)" style="accent-color:#10b981;width:16px;height:16px;">
                                        <span>⚡ លោតរើសឯកតាអូតូពេលបាញ់បាកូដលើ POS</span>
                                    </label>
                                </div>
                                <div id="skmP2MuSellGrid" style="display:flex;flex-direction:column;gap:10px;"></div>
                            </div>

                            <!-- TAB 2: SETUP TIERS -->
                            <div id="skmP2Mu_setup" style="display:none;">
                                <div class="skm-p2-2col">
                                    <div class="skm-p2-card">
                                        <strong style="font-size:13px;color:#38bdf8;display:block;margin-bottom:8px;">1️⃣ ជ្រើសរើសទំនិញពីស្តុក</strong>
                                        <input id="skmP2MuSetupSearch" class="skm-p2-input" placeholder="🔍 ស្វែងរកឈ្មោះ ឬកូដ..." oninput="window.SKMP2Mu.renderSetupProducts(this.value)" style="margin-bottom:8px;">
                                        <div id="skmP2MuProdList" style="max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;"></div>
                                    </div>
                                    <div class="skm-p2-card">
                                        <strong style="font-size:13px;color:#34d399;display:block;margin-bottom:6px;">2️⃣ កំណត់ឯកតា តម្លៃ និងចំនួនកាត់ស្តុក</strong>
                                        <div id="skmP2MuSelectedInfo" style="font-size:12px;color:#94a3b8;margin-bottom:10px;">សូមជ្រើសរើសទំនិញនៅខាងឆ្វេងជាមុនសិន...</div>
                                        <div id="skmP2MuEditorWrap" style="display:none;">
                                            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
                                                <button type="button" class="skm-p2-chip" onclick="window.SKMP2Mu.applyPreset('wholesale')">📦 គំរូលក់ដុំ (រាយ / កន្លះឡូ+១ / ១ឡូ+២ / កេះ)</button>
                                                <button type="button" class="skm-p2-chip" onclick="window.SKMP2Mu.applyPreset('pharmacy')">💊 គំរូឱសថស្ថាន (គ្រាប់ / បន្ទះ x10 / ប្រអប់ x100)</button>
                                            </div>
                                            <div id="skmP2MuTierRows" style="display:flex;flex-direction:column;gap:8px;max-height:220px;overflow-y:auto;margin-bottom:10px;"></div>
                                            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                                                <button type="button" class="skm-p2-btn" onclick="window.SKMP2Mu.addTierRow()">➕ ថែមឯកតាថ្មី</button>
                                                <button type="button" class="skm-p2-btn green" style="flex:1;" onclick="window.SKMP2Mu.saveEditingTiers()">💾 រក្សាទុកឯកតាទំនិញនេះ</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
            }

            window.SKMP2Mu = {
                open(defaultTab = 'sell') {
                    ensureMainModal();
                    document.getElementById('skmP2MuAutoPop').checked = loadMuData().interceptBarcode !== false;
                    document.getElementById('skmP2MuModal').classList.add('open');
                    this.tab(defaultTab);
                },
                tab(t) {
                    ['sell', 'setup'].forEach(k => {
                        const el = document.getElementById(`skmP2Mu_${k}`);
                        if (el) el.style.display = (k === t) ? 'block' : 'none';
                    });
                    document.querySelectorAll('#skmP2MuModal .skm-p2-tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-t') === t));
                    if (t === 'sell') this.renderSellList(document.getElementById('skmP2MuSellSearch')?.value || '');
                    if (t === 'setup') this.renderSetupProducts(document.getElementById('skmP2MuSetupSearch')?.value || '');
                },
                async toggleAutoPop(isOn) {
                    const cfg = loadMuData();
                    cfg.interceptBarcode = Boolean(isOn);
                    await saveMuData(cfg);
                    showPack2Toast(isOn ? '⚡ បើកការលោតរើសឯកតាអូតូពេលបាញ់បាកូដ!' : 'បិទការលោតអូតូ!');
                },
                pickTier(idx) {
                    if (!activeQuickPick) return;
                    const tier = activeQuickPick.tiers[idx];
                    const qty = Number(document.getElementById('skmP2MuPickQty')?.value || 1);
                    if (tier && addTierToCart(activeQuickPick.prod, tier, qty)) {
                        document.getElementById('skmP2MuPickModal').classList.remove('open');
                        activeQuickPick = null;
                    }
                },
                renderSellList(q) {
                    const box = document.getElementById('skmP2MuSellGrid');
                    const cfg = loadMuData();
                    const inv = getInventoryList();
                    const ql = String(q || '').toLowerCase().trim();

                    const configured = inv.filter(p => {
                        if (!p) return false;
                        const tiers = getTiersForProduct(p);
                        if (!tiers || !tiers.length) return false;
                        if (!ql) return true;
                        return String(p.name || '').toLowerCase().includes(ql) ||
                            String(p.customId || '').toLowerCase().includes(ql) ||
                            String(p.id || '').toLowerCase().includes(ql);
                    });

                    if (!configured.length) {
                        box.innerHTML = `<div class="skm-p2-card" style="text-align:center;color:#94a3b8;padding:24px;">
                            មិនទាន់មានទំនិញណាកំណត់លក់ច្រើនឯកតាទេ។<br>
                            <button class="skm-p2-btn green" style="margin-top:10px;" onclick="window.SKMP2Mu.tab('setup')">⚙️ ចូលកំណត់តម្លៃឯកតាដំបូង</button>
                        </div>`;
                        return;
                    }

                    box.innerHTML = configured.map(p => {
                        const tiers = getTiersForProduct(p);
                        const pidEsc = escHtml(String(p.id || p.customId));
                        return `
                            <div class="skm-p2-card">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
                                    <div>
                                        <strong style="font-size:14px;color:#f8fafc;">${escHtml(p.name)}</strong>
                                        <span style="font-size:11px;color:#94a3b8;margin-left:6px;">SKU: ${escHtml(p.customId || p.id)}</span>
                                    </div>
                                    <span style="font-size:12px;font-weight:800;color:#fbbf24;">ស្តុកដើម៖ ${Number(p.qty || 0)}</span>
                                </div>
                                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                                    ${tiers.map((t, idx) => {
                                        const tot = Number(t.baseQty || 1) + Number(t.bonusQty || 0);
                                        return `<button class="skm-p2-btn" style="background:#0f172a;border:1px solid rgba(16,185,129,0.5);padding:8px 12px;" onclick="window.SKMP2Mu.quickAdd('${pidEsc}', ${idx})">
                                            <span>${escHtml(t.label)}${Number(t.bonusQty||0)>0 ? ' (+'+t.bonusQty+')' : ''}</span>
                                            <b style="color:#34d399;">$${Number(t.price||0).toFixed(2)}</b>
                                            <span style="font-size:10.5px;color:#94a3b8;">[-${tot}]</span>
                                        </button>`;
                                    }).join('')}
                                </div>
                            </div>`;
                    }).join('');
                },
                quickAdd(pid, tierIdx) {
                    const prod = findProductByCodeOrId(pid);
                    if (!prod) return;
                    const tiers = getTiersForProduct(prod);
                    if (tiers[tierIdx]) addTierToCart(prod, tiers[tierIdx], 1);
                },
                renderSetupProducts(q) {
                    const box = document.getElementById('skmP2MuProdList');
                    const inv = getInventoryList();
                    const ql = String(q || '').toLowerCase().trim();
                    const list = (ql ? inv.filter(p => String(p.name||'').toLowerCase().includes(ql) || String(p.customId||'').toLowerCase().includes(ql)) : inv).slice(0, 40);
                    if (!list.length) {
                        box.innerHTML = '<div style="color:#94a3b8;font-size:12px;text-align:center;padding:16px;">រកមិនឃើញទំនិញក្នុងស្តុកទេ។</div>';
                        return;
                    }
                    box.innerHTML = list.map(p => {
                        const pid = String(p.id || p.customId);
                        const tiers = getTiersForProduct(p);
                        const active = pid === editingProdId;
                        return `
                            <div onclick="window.SKMP2Mu.selectProdForSetup('${escHtml(pid)}')"
                                style="padding:8px 10px;border-radius:10px;cursor:pointer;border:1px solid ${active ? '#34d399' : 'rgba(148,163,184,0.2)'};background:${active ? 'rgba(16,185,129,0.16)' : '#0f172a'};display:flex;justify-content:space-between;align-items:center;gap:6px;">
                                <div style="min-width:0;">
                                    <div style="font-size:12.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(p.name)}</div>
                                    <div style="font-size:11px;color:#94a3b8;">$${Number(p.price||0).toFixed(2)} • ស្តុក ${Number(p.qty||0)}</div>
                                </div>
                                ${tiers.length ? `<span style="font-size:10.5px;background:#10b981;color:#fff;padding:2px 7px;border-radius:999px;font-weight:800;">${tiers.length} ឯកតា</span>` : ''}
                            </div>`;
                    }).join('');
                },
                selectProdForSetup(pid) {
                    const prod = findProductByCodeOrId(pid);
                    if (!prod) return;
                    editingProdId = String(prod.id || prod.customId);
                    const existing = getTiersForProduct(prod);
                    editingTiers = existing.length ? JSON.parse(JSON.stringify(existing)) : [
                        { label: '១ ឯកតា (រាយ)', price: Number(prod.price || 0), baseQty: 1, bonusQty: 0 }
                    ];
                    document.getElementById('skmP2MuSelectedInfo').innerHTML = `កំពុងកំណត់៖ <b style="color:#38bdf8;">${escHtml(prod.name)}</b> (តម្លៃរាយដើម $${Number(prod.price||0).toFixed(2)} • ស្តុក ${Number(prod.qty||0)})`;
                    document.getElementById('skmP2MuEditorWrap').style.display = 'block';
                    this.renderTierRows();
                    this.renderSetupProducts(document.getElementById('skmP2MuSetupSearch')?.value || '');
                },
                applyPreset(type) {
                    const prod = findProductByCodeOrId(editingProdId);
                    const p = Number(prod?.price || 1);
                    if (type === 'pharmacy') {
                        editingTiers = [
                            { label: '១ គ្រាប់', price: Number((p / 10).toFixed(2)), baseQty: 1, bonusQty: 0 },
                            { label: '១ បន្ទះ (១០ គ្រាប់)', price: Number(p.toFixed(2)), baseQty: 10, bonusQty: 0 },
                            { label: '១ ប្រអប់ (១០០ គ្រាប់)', price: Number((p * 9.5).toFixed(2)), baseQty: 100, bonusQty: 0 }
                        ];
                    } else {
                        editingTiers = [
                            { label: '១ កំប៉ុង (រាយ)', price: Number(p.toFixed(2)), baseQty: 1, bonusQty: 0 },
                            { label: 'កន្លះឡូ (៦)', price: Number((p * 5.5).toFixed(2)), baseQty: 6, bonusQty: 1 },
                            { label: '១ ឡូ (១២)', price: Number((p * 10.5).toFixed(2)), baseQty: 12, bonusQty: 2 },
                            { label: '១ កេះ (២៤)', price: Number((p * 20).toFixed(2)), baseQty: 24, bonusQty: 0 }
                        ];
                    }
                    this.renderTierRows();
                },
                addTierRow() {
                    editingTiers.push({ label: 'ឈុតថ្មី', price: 0, baseQty: 1, bonusQty: 0 });
                    this.renderTierRows();
                },
                removeTierRow(i) {
                    editingTiers.splice(i, 1);
                    this.renderTierRows();
                },
                syncTierInputs() {
                    document.querySelectorAll('.skm-mu-tier-row').forEach((row, i) => {
                        if (!editingTiers[i]) return;
                        editingTiers[i] = {
                            label: row.querySelector('.mu-lbl').value.trim() || 'ឯកតា',
                            price: Number(row.querySelector('.mu-prc').value || 0),
                            baseQty: Math.max(1, Number(row.querySelector('.mu-bq').value || 1)),
                            bonusQty: Math.max(0, Number(row.querySelector('.mu-bn').value || 0))
                        };
                    });
                },
                renderTierRows() {
                    const box = document.getElementById('skmP2MuTierRows');
                    box.innerHTML = editingTiers.map((t, i) => `
                        <div class="skm-mu-tier-row" style="background:#0f172a;border:1px solid rgba(148,163,184,0.22);border-radius:10px;padding:8px;display:grid;grid-template-columns:1.5fr 0.85fr 0.7fr 0.7fr auto;gap:6px;align-items:end;">
                            <div><label class="skm-p2-label" style="font-size:10px;">ឈ្មោះឯកតា</label><input class="skm-p2-input mu-lbl" style="padding:6px 8px;font-size:12px;" value="${escHtml(t.label)}"></div>
                            <div><label class="skm-p2-label" style="font-size:10px;">តម្លៃ ($)</label><input type="number" step="0.01" class="skm-p2-input mu-prc" style="padding:6px 8px;font-size:12px;" value="${t.price}"></div>
                            <div><label class="skm-p2-label" style="font-size:10px;">កាត់ស្តុក</label><input type="number" min="1" class="skm-p2-input mu-bq" style="padding:6px 8px;font-size:12px;" value="${t.baseQty}"></div>
                            <div><label class="skm-p2-label" style="font-size:10px;">ថែមហ្វ្រី</label><input type="number" min="0" class="skm-p2-input mu-bn" style="padding:6px 8px;font-size:12px;" value="${t.bonusQty}"></div>
                            <button type="button" class="skm-p2-btn red" style="padding:6px 9px;" onclick="window.SKMP2Mu.removeTierRow(${i})">🗑️</button>
                        </div>`).join('');
                },
                async saveEditingTiers() {
                    if (!editingProdId) return;
                    this.syncTierInputs();
                    const cfg = loadMuData();
                    if (editingTiers.length === 0) {
                        delete cfg.products[editingProdId];
                    } else {
                        cfg.products[editingProdId] = editingTiers;
                    }
                    await saveMuData(cfg);
                    showPack2Toast('✅ រក្សាទុកតម្លៃច្រើនឯកតា & កាត់ស្តុកជោគជ័យ!');
                    this.renderSetupProducts(document.getElementById('skmP2MuSetupSearch')?.value || '');
                }
            };

            registerInPosToolbox('📦', 'លក់ច្រើនឯកតា & លក់ដុំថែម (Multi-Unit)', () => window.SKMP2Mu.open('sell'));
    });

    // ========================================================================
    // [5/8] 🧾 ព្រីនវិក្កយបត្រ ២ សន្លឹក & បាកូដស្កេនឆែក (Dual-Copy Receipt + Barcode Scanner)
    // ព្រីនច្បាប់អតិថិជន + ច្បាប់បញ្ជីហាង ភ្ជាប់បាកូដនៅបាតវិក្កយបត្រ ងាយស្រួលបាញ់ស្កេនឆែក/ដូរទំនិញវិញ
    // ========================================================================
    registerPack2Module('dualReceiptBarcode', function initDualReceiptBarcodePlugin() {
            const getDrCfgKey = () => `ks2_${getBranchId()}_dual_receipt_cfg`;
            const getDrAutoPrintedKey = () => `ks2_${getBranchId()}_dual_receipt_printed_ids`;

            function loadDrCfg() {
                let c = {
                    copies: 2,
                    paperMm: 80,
                    showBarcode: true,
                    autoPrintOnCheckout: false,
                    showSignatureOnStoreCopy: true,
                    printerName: '',
                    copy1Title: 'ច្បាប់ដើម — សម្រាប់អតិថិជន (CUSTOMER COPY)',
                    copy2Title: 'ច្បាប់ចម្លង — សម្រាប់បញ្ជីហាង (STORE COPY)'
                };
                try {
                    const raw = localStorage.getItem(getDrCfgKey());
                    if (raw) c = Object.assign(c, JSON.parse(raw));
                } catch (e) {}
                return c;
            }

            // Pure-JS Offline Code-39 SVG Barcode Generator (supports 0-9 A-Z - . $ / + % space)
            const CODE39_MAP = {
                '0':'nnnwwnwnn','1':'wnnwnnnnw','2':'nnwwnnnnw','3':'wnwwnnnnn','4':'nnnwwnnnw',
                '5':'wnnwwnnnn','6':'nnwwwnnnn','7':'nnnwnnwnw','8':'wnnwnnwnn','9':'nnwwnnwnn',
                'A':'wnnnnwnnw','B':'nnwnnwnnw','C':'wnwnnwnnn','D':'nnnnwwnnw','E':'wnnnwwnnn',
                'F':'nnwnwwnnn','G':'nnnnnwwnw','H':'wnnnnwwnn','I':'nnwnnwwnn','J':'nnnnwwwnn',
                'K':'wnnnnnnww','L':'nnwnnnnww','M':'wnwnnnnwn','N':'nnnnwnnww','O':'wnnnwnnwn',
                'P':'nnwnwnnwn','Q':'nnnnnnwww','R':'wnnnnnwwn','S':'nnwnnnwwn','T':'nnnnwnwwn',
                'U':'wwnnnnnnw','V':'nwwnnnnnw','W':'wwwnnnnnn','X':'nwnnwnnnw','Y':'wwnnwnnnn',
                'Z':'nwwnwnnnn','-':'nwnnnnwnw','.':'wwnnnnwnn',' ':'nwwnnnwnn','$':'nwnwnwnnn',
                '/':'nwnwnnnwn','+':'nwnnnwnwn','%':'nnnwnwnwn','*':'nwnnwnwnn'
            };

            function renderBarcodeSvg(rawText, heightPx = 42) {
                const clean = String(rawText || 'INV-000').toUpperCase().replace(/[^0-9A-Z\-\.\ \$\/\+%]/g, '');
                const full = `*${clean}*`;
                const narrow = 1.6, wide = 3.8, gap = 1.6;
                let x = 4;
                const rects = [];
                for (let ch of full) {
                    const pat = CODE39_MAP[ch] || CODE39_MAP['-'];
                    for (let i = 0; i < 9; i++) {
                        const w = pat[i] === 'w' ? wide : narrow;
                        if (i % 2 === 0) {
                            rects.push(`<rect x="${x.toFixed(1)}" y="0" width="${w.toFixed(1)}" height="${heightPx}" fill="#000"/>`);
                        }
                        x += w;
                    }
                    x += gap;
                }
                const totalW = Math.ceil(x + 4);
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${heightPx}" style="width:94%;max-width:250px;height:${heightPx}px;display:block;margin:4px auto 2px;">${rects.join('')}</svg>`;
            }

            function getAllInvoices() {
                const br = getBranchId();
                let list = Array.isArray(window.invoices) ? window.invoices : [];
                if (!list.length) {
                    try { list = JSON.parse(localStorage.getItem(`ks2_${br}_invoices_pro`) || '[]'); } catch (e) {}
                }
                return list;
            }

            function buildDualReceiptHtml(inv, cfgOverride = null) {
                const cfg = Object.assign({}, loadDrCfg(), cfgOverride || {});
                const br = getBranchId();
                const shopName = localStorage.getItem(`ks2_${br}_shop_name`) || window.shopName || 'SKM INTEGRATE';
                const shopPhone = localStorage.getItem(`ks2_${br}_shop_phone`) || window.shopPhone || '';
                const shopAddr = localStorage.getItem(`ks2_${br}_shop_address`) || '';
                const rate = parseFloat(document.getElementById('globalExchangeRate')?.value) || window.cartRate || window.EXCHANGE_RATE || 4000;
                const paperW = cfg.paperMm === 58 ? '58mm' : (cfg.paperMm === 210 ? '210mm' : '80mm');
                const items = Array.isArray(inv.items) ? inv.items : (Array.isArray(inv.cart) ? inv.cart : []);
                const totalUsd = Number(inv.totalAmount ?? inv.total ?? 0);
                const totalKhr = Math.round(totalUsd * rate).toLocaleString();
                const copiesCount = Number(cfg.copies || 2) >= 2 ? 2 : 1;

                const makeSingleCopy = (copyNum) => {
                    const isStoreCopy = copyNum === 2;
                    const badgeTitle = isStoreCopy ? cfg.copy2Title : cfg.copy1Title;
                    const rowsHtml = items.map((it, idx) => {
                        const q = Number(it.cartQty || it.qty || 1);
                        const p = Number(it.price || 0);
                        const sub = q * p;
                        return `<tr>
                            <td style="padding:3px 0;vertical-align:top;">${idx + 1}. ${escHtml(it.name || it.title || 'Item')}</td>
                            <td style="padding:3px 4px;text-align:center;vertical-align:top;white-space:nowrap;">x${q}</td>
                            <td style="padding:3px 0;text-align:right;vertical-align:top;white-space:nowrap;">$${sub.toFixed(2)}</td>
                        </tr>`;
                    }).join('');

                    return `
                        <div class="rcpt-page" style="${copyNum < copiesCount ? 'page-break-after:always;' : ''}">
                            <div class="copy-banner">${escHtml(badgeTitle)}</div>
                            <div class="shop-h">${escHtml(shopName)}</div>
                            ${shopPhone ? `<div class="sub-h">Tel: ${escHtml(shopPhone)}</div>` : ''}
                            ${shopAddr ? `<div class="sub-h">${escHtml(shopAddr)}</div>` : ''}
                            <div class="dash"></div>
                            <div class="meta">
                                <div>លេខវិក្កយបត្រ៖ <b>${escHtml(inv.id || 'N/A')}</b></div>
                                <div>កាលបរិច្ឆេទ៖ ${escHtml(inv.date || new Date().toLocaleString('km-KH'))}</div>
                                <div>អតិថិជន៖ ${escHtml(inv.customerName || inv.customer || 'ទូទៅ')}</div>
                                ${inv.seller || inv.cashier ? `<div>អ្នកលក់៖ ${escHtml(inv.seller || inv.cashier)}</div>` : ''}
                            </div>
                            <div class="dash"></div>
                            <table class="tbl">
                                <thead><tr><th style="text-align:left;">ទំនិញ</th><th style="text-align:center;">ចំនួន</th><th style="text-align:right;">សរុប</th></tr></thead>
                                <tbody>${rowsHtml || '<tr><td colspan="3" style="text-align:center;">-</td></tr>'}</tbody>
                            </table>
                            <div class="dash"></div>
                            <div class="tot-row"><span>សរុបដុល្លារ (USD)៖</span><span>$${totalUsd.toFixed(2)}</span></div>
                            <div class="tot-row khr"><span>សរុបរៀល (KHR)៖</span><span>${totalKhr} ៛</span></div>
                            ${inv.note ? `<div class="sub-h" style="text-align:left;margin-top:4px;">ចំណាំ៖ ${escHtml(inv.note)}</div>` : ''}
                            ${isStoreCopy && cfg.showSignatureOnStoreCopy ? `
                                <div class="sig-grid">
                                    <div>អ្នកប្រគល់ទំនិញ<br><br>....................</div>
                                    <div>អ្នកទទួលទំនិញ<br><br>....................</div>
                                </div>` : ''}
                            ${cfg.showBarcode ? `
                                <div class="bc-wrap">
                                    ${renderBarcodeSvg(inv.id || 'INV-000', 38)}
                                    <div class="bc-txt">${escHtml(inv.id || '')}</div>
                                </div>` : ''}
                            <div class="foot">សូមអរគុណ! ស្កេនបាកូដខាងលើដើម្បីឆែកវិក្កយបត្រ</div>
                        </div>`;
                };

                let allCopies = makeSingleCopy(1);
                if (copiesCount === 2) allCopies += makeSingleCopy(2);

                return `<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>Receipt ${escHtml(inv.id || '')}</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap" rel="stylesheet">
                <style>
                    @page { size: ${paperW} auto; margin: 0; }
                    * { box-sizing: border-box; }
                    body { margin: 0; padding: 0; width: ${paperW}; font-family: 'Battambang', sans-serif; color: #000; background: #fff; font-size: ${cfg.paperMm === 58 ? '10.5px' : '12px'}; }
                    .rcpt-page { padding: 3mm 3.5mm 6mm; width: 100%; }
                    .copy-banner { text-align: center; font-weight: 700; font-size: 10.5px; border: 1.5px solid #000; padding: 2px 4px; margin-bottom: 5px; }
                    .shop-h { text-align: center; font-size: 15px; font-weight: 700; }
                    .sub-h { text-align: center; font-size: 10.5px; }
                    .dash { border-top: 1px dashed #000; margin: 5px 0; }
                    .meta { font-size: 11px; line-height: 1.45; }
                    .tbl { width: 100%; border-collapse: collapse; font-size: 11px; }
                    .tbl th { border-bottom: 1px solid #000; padding-bottom: 3px; }
                    .tot-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 13.5px; margin-top: 2px; }
                    .tot-row.khr { font-size: 12px; }
                    .sig-grid { display: flex; justify-content: space-between; text-align: center; font-size: 10.5px; margin-top: 12px; padding: 0 6px; }
                    .bc-wrap { text-align: center; margin-top: 8px; padding-top: 4px; border-top: 1px dotted #000; }
                    .bc-txt { font-family: monospace; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; }
                    .foot { text-align: center; font-size: 10px; margin-top: 6px; }
                </style></head><body>${allCopies}</body></html>`;
            }

            async function printDualInvoice(inv, cfgOverride = null) {
                if (!inv) return showPack2Toast('⚠️ រកមិនឃើញវិក្កយបត្រសម្រាប់ព្រីនទេ!', true);
                const cfg = Object.assign({}, loadDrCfg(), cfgOverride || {});
                const html = buildDualReceiptHtml(inv, cfg);

                if (window.SKMDesktopBridge && typeof window.SKMDesktopBridge.printSilentHtml === 'function') {
                    try {
                        const r = await window.SKMDesktopBridge.printSilentHtml({
                            html, deviceName: cfg.printerName || '', paperMm: Number(cfg.paperMm || 80), fullDocument: true, title: `Receipt ${inv.id}`
                        });
                        if (r && r.ok) return showPack2Toast(`🖨️ ព្រីនវិក្កយបត្រ ${inv.id} (${cfg.copies} សន្លឹក + បាកូដ) ជោគជ័យ!`);
                    } catch (e) {}
                }

                const old = document.getElementById('skmP2DualRcptFrame'); if (old) old.remove();
                const fr = document.createElement('iframe');
                fr.id = 'skmP2DualRcptFrame'; fr.style.cssText = 'position:fixed;width:0;height:0;border:0;visibility:hidden;';
                document.body.appendChild(fr);
                fr.contentWindow.document.open(); fr.contentWindow.document.write(html); fr.contentWindow.document.close();
                setTimeout(() => { fr.contentWindow.focus(); fr.contentWindow.print(); }, 350);
            }

            // Optional Auto-Print 2 copies ONLY for freshly created paid checkouts (within last 90s, never old synced history)
            const bootTimeMs = Date.now();
            let seenAtBoot = new Set(getAllInvoices().slice(0, 30).map(x => String(x.id)));
            setInterval(() => {
                const cfg = loadDrCfg();
                if (!cfg.autoPrintOnCheckout) return;
                const invs = getAllInvoices();
                if (!invs.length) return;
                const latest = invs[0];
                if (!latest || !latest.id || seenAtBoot.has(String(latest.id))) return;
                seenAtBoot.add(String(latest.id));
                const invTs = typeof latest.timestamp === 'number' ? latest.timestamp : Date.parse(latest.timestamp || latest.created_at || '');
                if (!invTs || isNaN(invTs) || invTs < bootTimeMs || (Date.now() - invTs) > 90000) return;
                const st = String(latest.status || '').toLowerCase();
                if (st === 'paid' || st === 'completed' || st === '') {
                    printDualInvoice(latest, cfg);
                }
            }, 2200);

            function ensureModal() {
                if (document.getElementById('skmP2DrModal')) return;
                injectPack2Styles();
                const m = document.createElement('div');
                m.id = 'skmP2DrModal';
                m.className = 'skm-p2-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p2-box" style="max-width:880px;">
                        <div class="skm-p2-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#38bdf8;">🧾 ព្រីនវិក្កយបត្រ ២ សន្លឹក & បាកូដស្កេនឆែក</div>
                                <div style="font-size:11.5px;color:#94a3b8;">បាញ់បាកូដបាតវិក្កយបត្រដើម្បីឆែក/ដូរទំនិញវិញ • ព្រីន ១ ឬ ២ សន្លឹក (អតិថិជន + បញ្ជីហាង)</div>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <button class="skm-p2-btn red" onclick="document.getElementById('skmP2DrModal').classList.remove('open')">✕ បិទ</button>
                            </div>
                        </div>
                        <div class="skm-p2-body skm-p2-2col">
                            <!-- LEFT: BARCODE SCANNER LOOKUP -->
                            <div class="skm-p2-card" style="display:flex;flex-direction:column;gap:10px;">
                                <strong style="font-size:13.5px;color:#34d399;">🔍 ស្កេនបាកូដវិក្កយបត្រ (Scan Receipt Barcode)</strong>
                                <div style="display:flex;gap:6px;">
                                    <input id="skmP2DrScanInp" class="skm-p2-input" placeholder="បាញ់បាកូដ INV-... ឬវាយលេខវិក្កយបត្រ..." onkeydown="if(event.key==='Enter') window.SKMP2Dr.lookup()">
                                    <button class="skm-p2-btn green" onclick="window.SKMP2Dr.lookup()">រក</button>
                                </div>
                                <div id="skmP2DrResult" style="background:#0f172a;border:1px solid rgba(148,163,184,0.22);border-radius:12px;padding:12px;min-height:190px;font-size:12.5px;"></div>
                                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                                    <button class="skm-p2-btn" style="flex:1;" onclick="window.SKMP2Dr.printCurrent(1)">🖨️ ព្រីន ១ សន្លឹក</button>
                                    <button class="skm-p2-btn green" style="flex:1;" onclick="window.SKMP2Dr.printCurrent(2)">🖨️ ព្រីន ២ សន្លឹក + បាកូដ</button>
                                </div>
                            </div>

                            <!-- RIGHT: SETTINGS & RECENT INVOICES -->
                            <div style="display:flex;flex-direction:column;gap:12px;">
                                <div class="skm-p2-card">
                                    <strong style="font-size:13px;color:#fbbf24;display:block;margin-bottom:8px;">⚙️ កំណត់ការព្រីន ២ សន្លឹក & បាកូដ</strong>
                                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                                        <div><label class="skm-p2-label">ចំនួនសន្លឹកលំនាំដើម</label>
                                            <select id="skmP2DrCopies" class="skm-p2-select">
                                                <option value="2">២ សន្លឹក (អតិថិជន + ហាង)</option>
                                                <option value="1">១ សន្លឹក (មានបាកូដ)</option>
                                            </select>
                                        </div>
                                        <div><label class="skm-p2-label">ខ្នាតក្រដាស</label>
                                            <select id="skmP2DrPaper" class="skm-p2-select">
                                                <option value="80">80mm (ស្តង់ដារ)</option>
                                                <option value="58">58mm (តូច)</option>
                                                <option value="210">A4 (លក់ដុំ)</option>
                                            </select>
                                        </div>
                                        <div><label class="skm-p2-label">បាកូដបាតវិក្កយបត្រ</label>
                                            <select id="skmP2DrShowBc" class="skm-p2-select">
                                                <option value="true">✅ បង្ហាញបាកូដ</option>
                                                <option value="false">❌ មិនបង្ហាញ</option>
                                            </select>
                                        </div>
                                        <div><label class="skm-p2-label">ព្រីន ២ សន្លឹកអូតូពេលគិតលុយ</label>
                                            <select id="skmP2DrAuto" class="skm-p2-select">
                                                <option value="false">❌ ចុចព្រីនតាមតម្រូវការ</option>
                                                <option value="true">⚡ ព្រីន ២ សន្លឹកអូតូ</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button class="skm-p2-btn green" style="width:100%;" onclick="window.SKMP2Dr.saveCfg()">💾 រក្សាទុកការកំណត់</button>
                                </div>

                                <div class="skm-p2-card">
                                    <strong style="font-size:12.5px;color:#38bdf8;display:block;margin-bottom:6px;">📋 វិក្កយបត្រចុងក្រោយ (ចុចដើម្បីមើល/ព្រីន)</strong>
                                    <div id="skmP2DrRecent" style="max-height:150px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
            }

            let selectedInv = null;
            window.SKMP2Dr = {
                open() {
                    ensureModal();
                    const c = loadDrCfg();
                    document.getElementById('skmP2DrCopies').value = String(c.copies || 2);
                    document.getElementById('skmP2DrPaper').value = String(c.paperMm || 80);
                    document.getElementById('skmP2DrShowBc').value = String(c.showBarcode !== false);
                    document.getElementById('skmP2DrAuto').value = String(Boolean(c.autoPrintOnCheckout));
                    this.renderRecent();
                    const invs = getAllInvoices();
                    if (invs.length) this.showInvoice(invs[0]);
                    else document.getElementById('skmP2DrResult').innerHTML = '<div style="text-align:center;color:#94a3b8;padding:30px;">មិនទាន់មានវិក្កយបត្រក្នុងប្រព័ន្ធទេ។</div>';
                    document.getElementById('skmP2DrModal').classList.add('open');
                    setTimeout(() => document.getElementById('skmP2DrScanInp')?.focus(), 80);
                },
                renderRecent() {
                    const box = document.getElementById('skmP2DrRecent');
                    const invs = getAllInvoices().slice(0, 10);
                    box.innerHTML = invs.length ? invs.map((inv, idx) => `
                        <div onclick="window.SKMP2Dr.selectRecent(${idx})" style="padding:7px 10px;border-radius:9px;background:#0f172a;border:1px solid rgba(148,163,184,0.2);cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:12px;">
                            <span><b>${escHtml(inv.id)}</b> • ${escHtml(inv.customerName || inv.customer || 'ទូទៅ')}</span>
                            <b style="color:#34d399;">$${Number(inv.totalAmount ?? inv.total ?? 0).toFixed(2)}</b>
                        </div>`).join('') : '<div style="color:#94a3b8;font-size:12px;text-align:center;">គ្មានទិន្នន័យ</div>';
                },
                selectRecent(idx) {
                    const inv = getAllInvoices()[idx];
                    if (inv) this.showInvoice(inv);
                },
                lookup() {
                    const q = (document.getElementById('skmP2DrScanInp').value || '').trim().toLowerCase();
                    if (!q) return;
                    const found = getAllInvoices().find(x => String(x.id || '').toLowerCase() === q || String(x.id || '').toLowerCase().includes(q));
                    if (!found) {
                        document.getElementById('skmP2DrResult').innerHTML = `<div style="text-align:center;color:#f87171;padding:30px;">❌ រកមិនឃើញវិក្កយបត្រ "${escHtml(q)}" ទេ!</div>`;
                        selectedInv = null;
                        return;
                    }
                    this.showInvoice(found);
                    document.getElementById('skmP2DrScanInp').select();
                },
                showInvoice(inv) {
                    selectedInv = inv;
                    const items = Array.isArray(inv.items) ? inv.items : (Array.isArray(inv.cart) ? inv.cart : []);
                    const tot = Number(inv.totalAmount ?? inv.total ?? 0);
                    document.getElementById('skmP2DrResult').innerHTML = `
                        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px dashed rgba(148,163,184,0.3);padding-bottom:6px;margin-bottom:8px;">
                            <strong style="color:#38bdf8;font-size:14px;">🧾 ${escHtml(inv.id)}</strong>
                            <span style="font-size:11px;background:rgba(16,185,129,0.2);color:#34d399;padding:2px 8px;border-radius:999px;font-weight:800;">${escHtml(inv.status || 'paid')}</span>
                        </div>
                        <div style="font-size:11.5px;color:#cbd5e1;margin-bottom:8px;">
                            👤 ${escHtml(inv.customerName || inv.customer || 'ទូទៅ')} • 📅 ${escHtml(inv.date || '')}
                        </div>
                        <div style="max-height:95px;overflow-y:auto;margin-bottom:8px;font-size:12px;">
                            ${items.map(it => `<div style="display:flex;justify-content:space-between;padding:2px 0;"><span>• ${escHtml(it.name || it.title)} x${it.cartQty || it.qty || 1}</span><b>$${(Number(it.price||0)*Number(it.cartQty||it.qty||1)).toFixed(2)}</b></div>`).join('')}
                        </div>
                        <div style="display:flex;justify-content:space-between;border-top:1px solid rgba(148,163,184,0.25);padding-top:6px;font-weight:900;color:#34d399;font-size:14px;">
                            <span>សរុបទឹកប្រាក់៖</span><span>$${tot.toFixed(2)}</span>
                        </div>
                        <div style="background:#fff;border-radius:8px;padding:4px;margin-top:8px;text-align:center;">
                            ${renderBarcodeSvg(inv.id, 30)}
                        </div>
                    `;
                },
                printCurrent(copies) {
                    if (!selectedInv) return showPack2Toast('⚠️ សូមជ្រើសរើស ឬស្កេនវិក្កយបត្រសិន!', true);
                    printDualInvoice(selectedInv, { copies: Number(copies || 2) });
                },
                saveCfg() {
                    const cfg = Object.assign(loadDrCfg(), {
                        copies: Number(document.getElementById('skmP2DrCopies').value || 2),
                        paperMm: Number(document.getElementById('skmP2DrPaper').value || 80),
                        showBarcode: document.getElementById('skmP2DrShowBc').value === 'true',
                        autoPrintOnCheckout: document.getElementById('skmP2DrAuto').value === 'true'
                    });
                    localStorage.setItem(getDrCfgKey(), JSON.stringify(cfg));
                    showPack2Toast('✅ រក្សាទុកការកំណត់ព្រីន ២ សន្លឹកជោគជ័យ!');
                }
            };

            registerInPosToolbox('🧾', 'ព្រីន ២ សន្លឹក & បាកូដវិក្កយបត្រ (Dual Receipt)', () => window.SKMP2Dr.open());
    });

    // ========================================================================
    // [6/8] 📊 វិភាគទំនិញលក់ដាច់ & ទំនិញកប់ស្តុកយូរ (Fast-Moving & Dead Stock 30/60/90 Days)
    // គណនាទឹកប្រាក់ជាប់គាំងក្នុងឃ្លាំង, ទំនិញលក់ដាច់ខ្លាំង, ថ្ងៃស្តុកនៅសល់ + ផ្ញើសង្ខេបចូល Telegram ម្ចាស់ហាង
    // ========================================================================
    registerPack2Module('stockHealthAnalytics', function initStockHealthPlugin() {
            function getInv() {
                if (Array.isArray(window.inventory) && window.inventory.length) return window.inventory;
                try { return JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_inv_pro`) || '[]'); } catch (e) { return []; }
            }

            function getInvs() {
                if (Array.isArray(window.invoices) && window.invoices.length) return window.invoices;
                try { return JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_invoices_pro`) || '[]'); } catch (e) { return []; }
            }

            function parseInvTimestamp(inv) {
                if (!inv) return 0;
                if (typeof inv.timestamp === 'number' && inv.timestamp > 0) return inv.timestamp;
                if (inv.timestamp) {
                    const t = Date.parse(inv.timestamp);
                    if (!isNaN(t)) return t;
                }
                if (inv.created_at) {
                    const t = Date.parse(inv.created_at);
                    if (!isNaN(t)) return t;
                }
                if (inv.date) {
                    const t = Date.parse(inv.date);
                    if (!isNaN(t)) return t;
                    // Try DD/MM/YYYY fallback
                    const m = String(inv.date).match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
                    if (m) {
                        const y = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
                        return new Date(y, Number(m[2]) - 1, Number(m[1])).getTime();
                    }
                }
                return 0;
            }

            function normalizeItemMatch(it, prodMapById, prodMapByName) {
                if (!it) return { prod: null, qtySold: 0 };
                const rawQty = Math.max(1, Number(it.cartQty || it.qty || 1));

                // Support Multi-Unit Pack 2 items seamlessly!
                if (it.skmMultiUnit && it.skmMultiUnit.baseProductId) {
                    const p = prodMapById.get(String(it.skmMultiUnit.baseProductId).toLowerCase()) || null;
                    const mult = Math.max(1, Number(it.skmMultiUnit.deductPerPack || 1));
                    return { prod: p, qtySold: rawQty * mult };
                }
                if (String(it.id || '').startsWith('MU__')) {
                    const parts = String(it.id).split('__');
                    if (parts.length >= 3) {
                        const p = prodMapById.get(String(parts[1]).toLowerCase()) || null;
                        const mult = Math.max(1, Number(parts[2]) || 1);
                        return { prod: p, qtySold: rawQty * mult };
                    }
                }
                const byId = prodMapById.get(String(it.id || '').toLowerCase()) ||
                    (it.customId ? prodMapById.get(String(it.customId).toLowerCase()) : null);
                if (byId) return { prod: byId, qtySold: rawQty };

                const nm = String(it.name || it.title || '').trim().toLowerCase();
                if (nm && prodMapByName.has(nm)) return { prod: prodMapByName.get(nm), qtySold: rawQty };
                return { prod: null, qtySold: rawQty };
            }

            function computeReport(daysWindow = 30, searchQuery = '') {
                const inv = getInv().filter(p => p && p.name);
                const invoices = getInvs();
                const now = Date.now();
                const cutoff = daysWindow > 0 ? (now - daysWindow * 86400000) : 0;

                const prodMapById = new Map();
                const prodMapByName = new Map();
                const statsByKey = new Map();

                inv.forEach((p, idx) => {
                    const key = String(p.id || p.customId || ('idx_' + idx));
                    const cost = Number(p.cost || p.costPrice || 0);
                    const price = Number(p.price || 0);
                    const unitVal = cost > 0 ? cost : price;
                    const qty = Math.max(0, Number(p.qty || 0));

                    const entry = {
                        key,
                        id: p.customId || p.id || '-',
                        name: String(p.name || 'Item'),
                        category: String(p.category || 'ទូទៅ'),
                        qty,
                        cost,
                        price,
                        unitVal,
                        stockValue: qty * unitVal,
                        soldQty: 0,
                        revenue: 0,
                        lastSoldTs: 0,
                        orderCount: 0
                    };
                    statsByKey.set(key, entry);
                    if (p.id != null) prodMapById.set(String(p.id).toLowerCase(), entry);
                    if (p.customId) prodMapById.set(String(p.customId).toLowerCase(), entry);
                    prodMapByName.set(String(p.name).trim().toLowerCase(), entry);
                });

                let validInvoicesInWindow = 0;
                invoices.forEach(order => {
                    if (!order) return;
                    const st = String(order.status || '').toLowerCase();
                    if (st === 'cancelled' || st === 'void' || st === 'refunded') return;
                    const ts = parseInvTimestamp(order);
                    const inWindow = (daysWindow === 0) || (ts === 0) || (ts >= cutoff);
                    if (inWindow) validInvoicesInWindow++;

                    const items = Array.isArray(order.items) ? order.items : (Array.isArray(order.cart) ? order.cart : []);
                    items.forEach(it => {
                        const { prod, qtySold } = normalizeItemMatch(it, prodMapById, prodMapByName);
                        if (!prod) return;
                        if (ts > prod.lastSoldTs) prod.lastSoldTs = ts;
                        if (inWindow) {
                            prod.soldQty += qtySold;
                            prod.revenue += Number(it.price || prod.price || 0) * Math.max(1, Number(it.cartQty || it.qty || 1));
                            prod.orderCount += 1;
                        }
                    });
                });

                const ql = String(searchQuery || '').trim().toLowerCase();
                let allRows = Array.from(statsByKey.values());
                if (ql) {
                    allRows = allRows.filter(r =>
                        r.name.toLowerCase().includes(ql) ||
                        r.category.toLowerCase().includes(ql) ||
                        String(r.id).toLowerCase().includes(ql)
                    );
                }

                const effDays = daysWindow > 0 ? daysWindow : 30;
                allRows.forEach(r => {
                    r.dailyVelocity = r.soldQty / effDays;
                    r.daysOfStockLeft = r.dailyVelocity > 0 ? Math.round(r.qty / r.dailyVelocity) : (r.qty > 0 ? 999 : 0);
                    r.daysIdle = r.lastSoldTs > 0 ? Math.max(0, Math.floor((now - r.lastSoldTs) / 86400000)) : null;
                });

                const fastMoving = allRows
                    .filter(r => r.soldQty > 0)
                    .sort((a, b) => (b.soldQty - a.soldQty) || (b.revenue - a.revenue));

                const deadStock = allRows
                    .filter(r => r.qty > 0 && r.soldQty === 0)
                    .sort((a, b) => (b.stockValue - a.stockValue) || (b.qty - a.qty));

                const slowStock = allRows
                    .filter(r => r.qty > 0 && r.soldQty > 0 && r.soldQty <= 2)
                    .sort((a, b) => b.stockValue - a.stockValue);

                // Category breakdown
                const catMap = new Map();
                allRows.forEach(r => {
                    if (!catMap.has(r.category)) {
                        catMap.set(r.category, { category: r.category, skuCount: 0, stockQty: 0, stockValue: 0, deadCount: 0, deadValue: 0, soldQty: 0, revenue: 0 });
                    }
                    const c = catMap.get(r.category);
                    c.skuCount++;
                    c.stockQty += r.qty;
                    c.stockValue += r.stockValue;
                    c.soldQty += r.soldQty;
                    c.revenue += r.revenue;
                    if (r.qty > 0 && r.soldQty === 0) {
                        c.deadCount++;
                        c.deadValue += r.stockValue;
                    }
                });
                const categories = Array.from(catMap.values()).sort((a, b) => b.stockValue - a.stockValue);

                const totalStockValue = allRows.reduce((s, r) => s + r.stockValue, 0);
                const deadStockValue = deadStock.reduce((s, r) => s + r.stockValue, 0);
                const totalRevenue = fastMoving.reduce((s, r) => s + r.revenue, 0);

                return {
                    daysWindow,
                    validInvoicesInWindow,
                    totalSkus: allRows.length,
                    totalStockValue,
                    deadStockValue,
                    deadStockPct: totalStockValue > 0 ? Math.round((deadStockValue / totalStockValue) * 100) : 0,
                    totalRevenue,
                    fastMoving,
                    deadStock,
                    slowStock,
                    categories
                };
            }

            function ensureModal() {
                if (document.getElementById('skmP2StockHealthModal')) return;
                injectPack2Styles();
                const m = document.createElement('div');
                m.id = 'skmP2StockHealthModal';
                m.className = 'skm-p2-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p2-box" style="max-width:980px;">
                        <div class="skm-p2-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#38bdf8;">📊 វិភាគទំនិញលក់ដាច់ & ទំនិញកប់ស្តុក (Stock Health Pro)</div>
                                <div style="font-size:11.5px;color:#94a3b8;">ដឹងភ្លាមៗថាទំនិញណាលក់ដាច់ខ្លាំង ទំនិញណាកប់ស្តុកជាប់លុយក្នុងឃ្លាំង និងថ្ងៃស្តុកនៅសល់</div>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <button class="skm-p2-btn red" onclick="document.getElementById('skmP2StockHealthModal').classList.remove('open')">✕ បិទ</button>
                            </div>
                        </div>
                        <div class="skm-p2-tabs">
                            <button class="skm-p2-tab active" data-t="dead" onclick="window.SKMP2Stock.tab('dead')">🧊 ទំនិញកប់ស្តុក (Dead Stock)</button>
                            <button class="skm-p2-tab" data-t="fast" onclick="window.SKMP2Stock.tab('fast')">🔥 ទំនិញលក់ដាច់ខ្លាំង (Fast-Moving)</button>
                            <button class="skm-p2-tab" data-t="cat" onclick="window.SKMP2Stock.tab('cat')">📦 សុខភាពស្តុកតាមប្រភេទ</button>
                        </div>
                        <div class="skm-p2-body">
                            <!-- CONTROLS BAR -->
                            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:12px;">
                                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;flex:1;">
                                    <select id="skmP2ShDays" class="skm-p2-select" style="width:auto;min-width:155px;" onchange="window.SKMP2Stock.refresh()">
                                        <option value="7">📅 ៧ ថ្ងៃចុងក្រោយ</option>
                                        <option value="30" selected>📅 ៣០ ថ្ងៃចុងក្រោយ</option>
                                        <option value="60">📅 ៦០ ថ្ងៃចុងក្រោយ</option>
                                        <option value="90">📅 ៩០ ថ្ងៃចុងក្រោយ</option>
                                        <option value="0">📅 ទិន្នន័យទាំងអស់</option>
                                    </select>
                                    <input id="skmP2StockSearch" class="skm-p2-input" style="flex:1;min-width:170px;" placeholder="🔍 ស្វែងរកឈ្មោះទំនិញ ឬប្រភេទ..." oninput="window.SKMP2Stock.refresh()">
                                </div>
                                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                                    <button class="skm-p2-btn tg" onclick="window.SKMP2Stock.sendTelegramReport()">✈️ ផ្ញើ Telegram ម្ចាស់ហាង</button>
                                    <button class="skm-p2-btn green" onclick="window.SKMP2Stock.printReport()">🖨️ ព្រីន A4</button>
                                    <button class="skm-p2-btn gray" onclick="window.SKMP2Stock.exportCsv()">📥 CSV</button>
                                </div>
                            </div>

                            <!-- KPI SUMMARY -->
                            <div id="skmP2ShKpis" class="skm-p2-grid" style="margin-bottom:14px;"></div>

                            <!-- TAB CONTENTS -->
                            <div id="skmP2ShTab_dead">
                                <div style="font-size:12px;color:#fca5a5;margin-bottom:6px;font-weight:700;">
                                    ⚠️ បញ្ជីទំនិញដែលមានស្តុកក្នុងឃ្លាំង ប៉ុន្តែគ្មានការលក់ចេញសោះក្នុងអំឡុងពេលជ្រើសរើស (គួរដាក់ប្រូម៉ូសិនបញ្ចេញស្តុក ដើម្បីប្រមូលលុយវិលជុំវិញ)៖
                                </div>
                                <div style="overflow-x:auto;max-height:330px;">
                                    <table class="skm-p2-table">
                                        <thead><tr><th>ទំនិញ</th><th>ប្រភេទ</th><th>ស្តុកសល់</th><th>តម្លៃដើម/លក់</th><th>លុយជាប់គាំង</th><th>លក់ចុងក្រោយ</th><th>អនុសាសន៍</th></tr></thead>
                                        <tbody id="skmP2ShDeadBody"></tbody>
                                    </table>
                                </div>
                            </div>

                            <div id="skmP2ShTab_fast" style="display:none;">
                                <div style="font-size:12px;color:#6ee7b7;margin-bottom:6px;font-weight:700;">
                                    🔥 បញ្ជីទំនិញលក់ដាច់ខ្លាំងបំផុត ភ្ជាប់ការព្យាករណ៍ថ្ងៃស្តុកនៅសល់ (ដើម្បីបញ្ជាទិញទាន់ពេល កុំឱ្យដាច់ស្តុក)៖
                                </div>
                                <div style="overflow-x:auto;max-height:330px;">
                                    <table class="skm-p2-table">
                                        <thead><tr><th>#</th><th>ទំនិញ</th><th>ប្រភេទ</th><th>លក់ចេញ</th><th>ចំណូលលក់</th><th>ស្តុកសល់</th><th>ព្យាករណ៍ស្តុក</th></tr></thead>
                                        <tbody id="skmP2ShFastBody"></tbody>
                                    </table>
                                </div>
                            </div>

                            <div id="skmP2ShTab_cat" style="display:none;">
                                <div style="overflow-x:auto;max-height:340px;">
                                    <table class="skm-p2-table">
                                        <thead><tr><th>ប្រភេទទំនិញ</th><th>ចំនួនមុខ</th><th>ស្តុកសរុប</th><th>តម្លៃស្តុកសរុប</th><th>មុខកប់ស្តុក</th><th>លុយកប់ស្តុក</th><th>ចំណូលលក់</th></tr></thead>
                                        <tbody id="skmP2ShCatBody"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
            }

            let curTab = 'dead';
            let lastReport = null;

            window.SKMP2Stock = {
                open(defaultTab = 'dead') {
                    ensureModal();
                    document.getElementById('skmP2StockHealthModal').classList.add('open');
                    this.tab(defaultTab);
                },
                tab(t) {
                    curTab = t;
                    ['dead', 'fast', 'cat'].forEach(k => {
                        const el = document.getElementById(`skmP2ShTab_${k}`);
                        if (el) el.style.display = (k === t) ? 'block' : 'none';
                    });
                    document.querySelectorAll('#skmP2StockHealthModal .skm-p2-tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-t') === t));
                    this.refresh();
                },
                refresh() {
                    const days = Number(document.getElementById('skmP2ShDays')?.value ?? 30);
                    const q = document.getElementById('skmP2StockSearch')?.value || '';
                    const rep = computeReport(days, q);
                    lastReport = rep;

                    const rate = parseFloat(document.getElementById('globalExchangeRate')?.value) || window.cartRate || window.EXCHANGE_RATE || 4000;
                    const deadKhr = Math.round(rep.deadStockValue * rate).toLocaleString();
                    const topName = rep.fastMoving.length ? `${rep.fastMoving[0].name} (${rep.fastMoving[0].soldQty})` : 'គ្មាន';

                    document.getElementById('skmP2ShKpis').innerHTML = `
                        <div class="skm-p2-card" style="border-color:rgba(239,68,68,0.45);">
                            <div style="font-size:11px;color:#fca5a5;">🧊 លុយជាប់គាំងក្នុងទំនិញកប់ស្តុក</div>
                            <div style="font-size:20px;font-weight:900;color:#f87171;">$${rep.deadStockValue.toFixed(2)}</div>
                            <div style="font-size:11px;color:#94a3b8;">${rep.deadStock.length} មុខ (${rep.deadStockPct}% នៃស្តុក) • ${deadKhr} ៛</div>
                        </div>
                        <div class="skm-p2-card" style="border-color:rgba(16,185,129,0.45);">
                            <div style="font-size:11px;color:#6ee7b7;">🔥 ចំណូលទំនិញលក់ដាច់</div>
                            <div style="font-size:20px;font-weight:900;color:#34d399;">$${rep.totalRevenue.toFixed(2)}</div>
                            <div style="font-size:11px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Top 1: ${escHtml(topName)}</div>
                        </div>
                        <div class="skm-p2-card" style="border-color:rgba(56,189,248,0.45);">
                            <div style="font-size:11px;color:#7dd3fc;">📦 តម្លៃស្តុកសរុបក្នុងឃ្លាំង</div>
                            <div style="font-size:20px;font-weight:900;color:#38bdf8;">$${rep.totalStockValue.toFixed(2)}</div>
                            <div style="font-size:11px;color:#94a3b8;">សរុប ${rep.totalSkus} មុខទំនិញ</div>
                        </div>
                        <div class="skm-p2-card" style="border-color:rgba(245,158,11,0.45);">
                            <div style="font-size:11px;color:#fcd34d;">🐢 ទំនិញលក់យឺត (១-២ ឯកតា)</div>
                            <div style="font-size:20px;font-weight:900;color:#fbbf24;">${rep.slowStock.length} មុខ</div>
                            <div style="font-size:11px;color:#94a3b8;">វិក្កយបត្រវិភាគ៖ ${rep.validInvoicesInWindow} ប័ណ្ណ</div>
                        </div>
                    `;

                    // Render Dead Stock Table
                    const deadTb = document.getElementById('skmP2ShDeadBody');
                    deadTb.innerHTML = rep.deadStock.length ? rep.deadStock.slice(0, 100).map(r => {
                        const lastTxt = r.lastSoldTs > 0
                            ? `${new Date(r.lastSoldTs).toLocaleDateString('en-GB')} (${r.daysIdle}ថ្ងៃ)`
                            : '<span style="color:#f87171;">មិនទាន់លក់សោះ</span>';
                        const sug = r.stockValue >= 50
                            ? '<span style="background:rgba(239,68,68,0.2);color:#fca5a5;padding:2px 7px;border-radius:999px;font-size:11px;font-weight:800;">🔥 គួរដាក់បញ្ចុះតម្លៃ</span>'
                            : '<span style="background:rgba(245,158,11,0.2);color:#fcd34d;padding:2px 7px;border-radius:999px;font-size:11px;font-weight:800;">🎁 ដាក់លក់ជា Combo</span>';
                        return `<tr>
                            <td><b>${escHtml(r.name)}</b><div style="font-size:10.5px;color:#94a3b8;">${escHtml(r.id)}</div></td>
                            <td>${escHtml(r.category)}</td>
                            <td><b style="color:#fbbf24;">${r.qty}</b></td>
                            <td>$${r.unitVal.toFixed(2)}</td>
                            <td><b style="color:#f87171;">$${r.stockValue.toFixed(2)}</b></td>
                            <td style="font-size:11.5px;">${lastTxt}</td>
                            <td>${sug}</td>
                        </tr>`;
                    }).join('') : '<tr><td colspan="7" style="text-align:center;color:#34d399;padding:22px;">🎉 អស្ចារ្យ! គ្មានទំនិញកប់ស្តុកក្នុងអំឡុងពេលនេះទេ។</td></tr>';

                    // Render Fast-Moving Table
                    const fastTb = document.getElementById('skmP2ShFastBody');
                    fastTb.innerHTML = rep.fastMoving.length ? rep.fastMoving.slice(0, 100).map((r, i) => {
                        let stockBadge = `<span style="color:#34d399;font-weight:800;">~${r.daysOfStockLeft} ថ្ងៃ</span>`;
                        if (r.qty <= 0) stockBadge = '<span style="background:rgba(239,68,68,0.25);color:#fca5a5;padding:2px 7px;border-radius:999px;font-size:11px;font-weight:800;">🚨 អស់ស្តុក!</span>';
                        else if (r.daysOfStockLeft <= 7) stockBadge = `<span style="background:rgba(245,158,11,0.25);color:#fcd34d;padding:2px 7px;border-radius:999px;font-size:11px;font-weight:800;">⚠️ សល់ ~${r.daysOfStockLeft} ថ្ងៃ</span>`;
                        return `<tr>
                            <td><b>#${i + 1}</b></td>
                            <td><b>${escHtml(r.name)}</b><div style="font-size:10.5px;color:#94a3b8;">${escHtml(r.id)}</div></td>
                            <td>${escHtml(r.category)}</td>
                            <td><b style="color:#38bdf8;font-size:14px;">${r.soldQty}</b></td>
                            <td><b style="color:#34d399;">$${r.revenue.toFixed(2)}</b></td>
                            <td><b>${r.qty}</b></td>
                            <td>${stockBadge}</td>
                        </tr>`;
                    }).join('') : '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:22px;">មិនទាន់មានទិន្នន័យលក់ក្នុងអំឡុងពេលនេះទេ។</td></tr>';

                    // Render Category Health Table
                    const catTb = document.getElementById('skmP2ShCatBody');
                    catTb.innerHTML = rep.categories.length ? rep.categories.map(c => `
                        <tr>
                            <td><b>${escHtml(c.category)}</b></td>
                            <td>${c.skuCount}</td>
                            <td>${c.stockQty}</td>
                            <td><b style="color:#38bdf8;">$${c.stockValue.toFixed(2)}</b></td>
                            <td><span style="color:${c.deadCount > 0 ? '#f87171' : '#34d399'};font-weight:800;">${c.deadCount} មុខ</span></td>
                            <td><b style="color:#f87171;">$${c.deadValue.toFixed(2)}</b></td>
                            <td><b style="color:#34d399;">$${c.revenue.toFixed(2)}</b></td>
                        </tr>`).join('') : '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:20px;">គ្មានទិន្នន័យ</td></tr>';
                },
                async sendTelegramReport() {
                    const rep = lastReport || computeReport(30, '');
                    const { token, chatId } = getTelegramCreds();
                    if (!token || !chatId) {
                        return showPack2Toast('⚠️ សូមកំណត់ Telegram Bot Token & Chat ID ក្នុង Admin Settings សិន!', true);
                    }
                    const winTxt = rep.daysWindow > 0 ? `${rep.daysWindow} ថ្ងៃចុងក្រោយ` : 'ទិន្នន័យទាំងអស់';
                    const top5Fast = rep.fastMoving.slice(0, 5).map((r, i) => `${i + 1}. ${r.name} — លក់ <b>${r.soldQty}</b> ($${r.revenue.toFixed(2)}) | សល់ ${r.qty}`).join('\n') || '- គ្មាន';
                    const top5Dead = rep.deadStock.slice(0, 5).map((r, i) => `${i + 1}. ${r.name} — សល់ <b>${r.qty}</b> (កប់លុយ $${r.stockValue.toFixed(2)})`).join('\n') || '- គ្មាន';
                    const msg =
                        `📊 <b>របាយការណ៍សុខភាពស្តុក (Stock Health)</b>\n` +
                        `🏪 សាខា៖ <b>${getBranchId()}</b> | 📅 ${winTxt}\n\n` +
                        `📦 តម្លៃស្តុកសរុប៖ <b>$${rep.totalStockValue.toFixed(2)}</b> (${rep.totalSkus} មុខ)\n` +
                        `🧊 លុយកប់ក្នុងស្តុកមិនដើរ៖ <b>$${rep.deadStockValue.toFixed(2)}</b> (${rep.deadStock.length} មុខ / ${rep.deadStockPct}%)\n` +
                        `🔥 ចំណូលលក់សរុប៖ <b>$${rep.totalRevenue.toFixed(2)}</b>\n\n` +
                        `<b>🏆 Top 5 លក់ដាច់ខ្លាំង៖</b>\n${top5Fast}\n\n` +
                        `<b>🧊 Top 5 កប់ស្តុកជាប់លុយច្រើន៖</b>\n${top5Dead}`;
                    try {
                        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' })
                        });
                        showPack2Toast('✈️ បានផ្ញើរបាយការណ៍ស្តុកចូល Telegram ម្ចាស់ហាងជោគជ័យ!');
                    } catch (e) {
                        showPack2Toast('❌ ផ្ញើ Telegram មិនជោគជ័យទេ!', true);
                    }
                },
                exportCsv() {
                    const rep = lastReport || computeReport(30, '');
                    let rows = [];
                    let fname = `SKM_StockHealth_${getBranchId()}.csv`;
                    if (curTab === 'fast') {
                        fname = `SKM_FastMoving_${getBranchId()}_${rep.daysWindow}d.csv`;
                        rows = [['Rank', 'SKU', 'Name', 'Category', 'SoldQty', 'RevenueUSD', 'StockLeft', 'EstDaysLeft'],
                            ...rep.fastMoving.map((r, i) => [i + 1, r.id, r.name.replace(/,/g, ' '), r.category.replace(/,/g, ' '), r.soldQty, r.revenue.toFixed(2), r.qty, r.daysOfStockLeft])];
                    } else if (curTab === 'cat') {
                        fname = `SKM_CategoryHealth_${getBranchId()}.csv`;
                        rows = [['Category', 'SKUs', 'StockQty', 'StockValueUSD', 'DeadSKUs', 'DeadValueUSD', 'SalesRevenueUSD'],
                            ...rep.categories.map(c => [c.category.replace(/,/g, ' '), c.skuCount, c.stockQty, c.stockValue.toFixed(2), c.deadCount, c.deadValue.toFixed(2), c.revenue.toFixed(2)])];
                    } else {
                        fname = `SKM_DeadStock_${getBranchId()}_${rep.daysWindow}d.csv`;
                        rows = [['SKU', 'Name', 'Category', 'StockQty', 'UnitCostOrPrice', 'TrappedCashUSD', 'DaysIdle'],
                            ...rep.deadStock.map(r => [r.id, r.name.replace(/,/g, ' '), r.category.replace(/,/g, ' '), r.qty, r.unitVal.toFixed(2), r.stockValue.toFixed(2), r.daysIdle ?? 'NeverSold'])];
                    }
                    const blob = new Blob(['\uFEFF' + rows.map(x => x.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fname; a.click();
                },
                printReport() {
                    const rep = lastReport || computeReport(30, '');
                    const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || getBranchId();
                    const winTxt = rep.daysWindow > 0 ? `${rep.daysWindow} ថ្ងៃចុងក្រោយ` : 'ទិន្នន័យទាំងអស់';
                    const w = window.open('', '_blank', 'width=820,height=920');
                    if (!w) return;
                    w.document.write(`<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>Stock Health Report</title>
                        <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap" rel="stylesheet">
                        <style>body{font-family:'Battambang',sans-serif;padding:24px;color:#0f172a;} h1,h2{margin:0 0 6px;} table{width:100%;border-collapse:collapse;margin:12px 0 22px;font-size:12px;} th,td{border:1px solid #cbd5e1;padding:6px 8px;text-align:left;} th{background:#f1f5f9;} .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:12px 0 18px;} .kpi{border:1px solid #cbd5e1;border-radius:10px;padding:10px;} @media print{.np{display:none;}}</style></head><body>
                        <h1>📊 របាយការណ៍វិភាគទំនិញលក់ដាច់ & កប់ស្តុក — ${escHtml(shop)}</h1>
                        <div style="font-size:12.5px;color:#475569;">សាខា៖ ${escHtml(getBranchId())} • រយៈពេល៖ ${winTxt} • បោះពុម្ព៖ ${new Date().toLocaleString('km-KH')}</div>
                        <div class="kpis">
                            <div class="kpi"><div>តម្លៃស្តុកសរុប</div><b style="font-size:18px;">$${rep.totalStockValue.toFixed(2)}</b> (${rep.totalSkus} មុខ)</div>
                            <div class="kpi"><div>លុយកប់ក្នុងស្តុកមិនដើរ</div><b style="font-size:18px;color:#dc2626;">$${rep.deadStockValue.toFixed(2)}</b> (${rep.deadStock.length} មុខ)</div>
                            <div class="kpi"><div>ចំណូលលក់សរុប</div><b style="font-size:18px;color:#059669;">$${rep.totalRevenue.toFixed(2)}</b></div>
                        </div>
                        <h2>🔥 Top 15 ទំនិញលក់ដាច់ខ្លាំង (Fast-Moving)</h2>
                        <table><thead><tr><th>#</th><th>ទំនិញ</th><th>ប្រភេទ</th><th>លក់ចេញ</th><th>ចំណូល</th><th>ស្តុកសល់</th></tr></thead>
                        <tbody>${rep.fastMoving.slice(0, 15).map((r, i) => `<tr><td>${i+1}</td><td>${escHtml(r.name)}</td><td>${escHtml(r.category)}</td><td>${r.soldQty}</td><td>$${r.revenue.toFixed(2)}</td><td>${r.qty}</td></tr>`).join('') || '<tr><td colspan="6">គ្មាន</td></tr>'}</tbody></table>
                        <h2>🧊 Top 25 ទំនិញកប់ស្តុកជាប់លុយ (Dead Stock)</h2>
                        <table><thead><tr><th>#</th><th>ទំនិញ</th><th>ប្រភេទ</th><th>ស្តុកសល់</th><th>តម្លៃដើម/លក់</th><th>លុយជាប់គាំង</th></tr></thead>
                        <tbody>${rep.deadStock.slice(0, 25).map((r, i) => `<tr><td>${i+1}</td><td>${escHtml(r.name)}</td><td>${escHtml(r.category)}</td><td>${r.qty}</td><td>$${r.unitVal.toFixed(2)}</td><td><b>$${r.stockValue.toFixed(2)}</b></td></tr>`).join('') || '<tr><td colspan="6">គ្មានទំនិញកប់ស្តុក</td></tr>'}</tbody></table>
                        <button class="np" onclick="window.print()" style="padding:10px 20px;background:#0284c7;color:#fff;border:none;border-radius:10px;font-size:14px;cursor:pointer;">🖨️ បោះពុម្ព A4</button>
                        </body></html>`);
                    w.document.close();
                }
            };

            registerInPosToolbox('📊', 'វិភាគលក់ដាច់ & កប់ស្តុក (Stock Health)', () => window.SKMP2Stock.open('dead'));
    });

    // ========================================================================
    // [7/8] 🚨 ដាស់តឿនស្តុកជិតអស់អូតូ (Auto Low-Stock & Out-of-Stock Telegram Alert)
    // តាមដានស្តុកដោយស្វ័យប្រវត្តិពេលលក់ចេញ ➔ បាញ់ដំណឹងចូល Telegram ម្ចាស់ហាងភ្លាមៗពេលស្តុកធ្លាក់ទាបជាងកម្រិតកំណត់
    // មានប្រព័ន្ធការពារ Spam (Cooldown per item), កំណត់កម្រិតផ្ទាល់ខ្លួនតាមទំនិញ និង Reset អូតូពេលបញ្ចូលស្តុកវិញ
    // ========================================================================
    registerPack2Module('autoLowStockAlert', function initAutoLowStockAlertPlugin() {
            const getLsCfgKey = () => `ks2_${getBranchId()}_low_stock_alert_cfg`;
            const getLsStateKey = () => `ks2_${getBranchId()}_low_stock_alert_state`;
            const getLsLogKey = () => `ks2_${getBranchId()}_low_stock_alert_logs`;

            function getDefaultLsCfg() {
                return {
                    autoEnabled: true,
                    threshold: 5,
                    alertOutOfStock: true,
                    cooldownHours: 12,
                    autoResetOnRestock: true,
                    ignoreZeroPriceServices: true,
                    telegramToken: '',
                    telegramChatId: '',
                    customThresholds: {} // { [prodKey]: number }
                };
            }

            function loadLsCfg() {
                let cfg = getDefaultLsCfg();
                try {
                    const sys = window.sysSettings || JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_sys_settings`) || '{}');
                    if (sys && sys.lowStockAlertConfig && typeof sys.lowStockAlertConfig === 'object') {
                        cfg = Object.assign(cfg, sys.lowStockAlertConfig);
                    }
                    const raw = localStorage.getItem(getLsCfgKey());
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        if (parsed && typeof parsed === 'object') {
                            cfg = Object.assign(cfg, parsed);
                            if (parsed.customThresholds && typeof parsed.customThresholds === 'object') {
                                cfg.customThresholds = Object.assign({}, cfg.customThresholds || {}, parsed.customThresholds);
                            }
                        }
                    }
                } catch (e) {}
                if (!cfg.customThresholds || typeof cfg.customThresholds !== 'object') cfg.customThresholds = {};
                return cfg;
            }

            async function saveLsCfg(cfg) {
                const br = getBranchId();
                localStorage.setItem(getLsCfgKey(), JSON.stringify(cfg));
                try {
                    const sysKey = `ks2_${br}_sys_settings`;
                    const sys = Object.assign({}, window.sysSettings || JSON.parse(localStorage.getItem(sysKey) || '{}'));
                    sys.lowStockAlertConfig = cfg;
                    window.sysSettings = sys;
                    localStorage.setItem(sysKey, JSON.stringify(sys));

                    if (window.supabaseClient && navigator.onLine) {
                        const cleanSys = typeof window.stripLocalThemeForCloud === 'function' ? window.stripLocalThemeForCloud(sys) : sys;
                        const nowIso = new Date().toISOString();
                        localStorage.setItem(`ks2_${br}_last_update`, new Date(nowIso).getTime().toString());
                        await window.supabaseClient.from('branch_store').update({
                            sys_settings: cleanSys, updated_at: nowIso
                        }).eq('branch_id', br);
                    }
                } catch (e) {}
            }

            function loadAlertState() {
                try { return JSON.parse(localStorage.getItem(getLsStateKey()) || '{}'); } catch (e) { return {}; }
            }
            function saveAlertState(st) {
                try { localStorage.setItem(getLsStateKey(), JSON.stringify(st)); } catch (e) {}
            }
            function loadAlertLogs() {
                try { return JSON.parse(localStorage.getItem(getLsLogKey()) || '[]'); } catch (e) { return []; }
            }
            function appendAlertLog(entry) {
                const logs = loadAlertLogs();
                logs.unshift(entry);
                try { localStorage.setItem(getLsLogKey(), JSON.stringify(logs.slice(0, 60))); } catch (e) {}
            }

            function getInvList() {
                if (Array.isArray(window.inventory) && window.inventory.length) return window.inventory;
                try { return JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_inv_pro`) || '[]'); } catch (e) { return []; }
            }

            function getProdKey(p) {
                return String(p.id != null ? p.id : (p.customId || p.name || '')).trim();
            }

            function getEffectiveThreshold(p, cfg) {
                const key = getProdKey(p);
                if (cfg.customThresholds && cfg.customThresholds[key] != null && cfg.customThresholds[key] !== '') {
                    const v = Number(cfg.customThresholds[key]);
                    if (!isNaN(v) && v >= 0) return v;
                }
                if (p.minStock != null && !isNaN(Number(p.minStock))) return Number(p.minStock);
                if (p.lowStock != null && !isNaN(Number(p.lowStock))) return Number(p.lowStock);
                return Math.max(0, Number(cfg.threshold ?? 5));
            }

            async function sendTelegramMessage(htmlText, cfg) {
                const { token, chatId } = getTelegramCreds(cfg);
                if (!token || !chatId) return { ok: false, reason: 'no_creds' };
                try {
                    const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: htmlText,
                            parse_mode: 'HTML',
                            disable_web_page_preview: true
                        })
                    });
                    const data = await resp.json().catch(() => ({}));
                    return { ok: Boolean(resp.ok && data.ok !== false), reason: data.description || '' };
                } catch (e) {
                    return { ok: false, reason: e.message || 'network_error' };
                }
            }

            // Background Stock Drop Monitor (No Spam on Page Load!)
            let baselineReady = false;
            const prevQtyMap = new Map();
            let isCheckingNow = false;

            function captureBaseline() {
                const inv = getInvList();
                if (!inv.length) return false;
                inv.forEach(p => {
                    if (!p || !p.name) return;
                    prevQtyMap.set(getProdKey(p), Number(p.qty ?? 0));
                });
                baselineReady = true;
                return true;
            }

            async function runAutoStockCheck(forceImmediate = false) {
                if (isCheckingNow) return;
                const inv = getInvList();
                if (!inv.length) return;

                if (!baselineReady) {
                    captureBaseline();
                    return;
                }

                const cfg = loadLsCfg();
                if (!cfg.autoEnabled && !forceImmediate) {
                    // Keep baseline synced even when paused
                    inv.forEach(p => { if (p && p.name) prevQtyMap.set(getProdKey(p), Number(p.qty ?? 0)); });
                    return;
                }

                const alertState = loadAlertState();
                const now = Date.now();
                const cooldownMs = Math.max(0.5, Number(cfg.cooldownHours || 12)) * 3600000;
                const triggeredItems = [];
                let stateChanged = false;

                inv.forEach(p => {
                    if (!p || !p.name) return;
                    if (String(p.id || '').startsWith('CUSTOM_')) return;
                    if (cfg.ignoreZeroPriceServices && Number(p.qty || 0) >= 99999) return;

                    const key = getProdKey(p);
                    const curQty = Math.max(0, Number(p.qty ?? 0));
                    const prevQty = prevQtyMap.has(key) ? prevQtyMap.get(key) : curQty;
                    prevQtyMap.set(key, curQty);

                    const minLimit = getEffectiveThreshold(p, cfg);
                    const st = alertState[key] || null;

                    // 1. Auto-reset cooldown if restocked above threshold
                    if (cfg.autoResetOnRestock && st && curQty > minLimit) {
                        delete alertState[key];
                        stateChanged = true;
                        return;
                    }

                    // 2. Only trigger automatically when stock ACTUALLY DROPPED (sale/wastage/deduction)
                    if (curQty >= prevQty) return;
                    if (curQty > minLimit) return;

                    const isOutNow = curQty === 0;
                    const crossedToZero = isOutNow && prevQty > 0 && cfg.alertOutOfStock;
                    const lastAlertTs = st ? Number(st.ts || 0) : 0;
                    const lastAlertLevel = st ? st.level : '';

                    const inCooldown = (now - lastAlertTs) < cooldownMs;
                    const shouldNotify = (!inCooldown) || (crossedToZero && lastAlertLevel !== 'out');

                    if (shouldNotify) {
                        triggeredItems.push({
                            key,
                            sku: p.customId || p.id || '-',
                            name: String(p.name),
                            category: String(p.category || 'ទូទៅ'),
                            prevQty,
                            curQty,
                            minLimit,
                            level: isOutNow ? 'out' : 'low'
                        });
                        alertState[key] = {
                            ts: now,
                            qty: curQty,
                            level: isOutNow ? 'out' : 'low'
                        };
                        stateChanged = true;
                    }
                });

                if (stateChanged) saveAlertState(alertState);
                if (!triggeredItems.length) return;

                isCheckingNow = true;
                try {
                    const br = getBranchId();
                    const shop = localStorage.getItem(`ks2_${br}_shop_name`) || window.shopName || br;
                    const outCount = triggeredItems.filter(x => x.level === 'out').length;
                    const headerTitle = outCount > 0
                        ? `🚨 <b>ដំណឹងបន្ទាន់៖ ទំនិញអស់ស្តុក / ជិតអស់ស្តុក!</b>`
                        : `⚠️ <b>ដំណឹងដាស់តឿន៖ ទំនិញជិតអស់ស្តុក (Low Stock)</b>`;

                    const lines = triggeredItems.slice(0, 15).map((it, idx) => {
                        const icon = it.curQty === 0 ? '🔴 <b>អស់ស្តុក (0)</b>' : `🟠 នៅសល់ <b>${it.curQty}</b> (កម្រិត ≤ ${it.minLimit})`;
                        return `${idx + 1}. <b>${escHtml(it.name)}</b>\n   └ ${icon} <i>(ធ្លាក់ពី ${it.prevQty} ➔ ${it.curQty})</i>`;
                    }).join('\n');

                    const moreTxt = triggeredItems.length > 15 ? `\n... និង ${triggeredItems.length - 15} មុខទៀត` : '';
                    const msg =
                        `${headerTitle}\n` +
                        `🏪 ហាង៖ <b>${escHtml(shop)}</b> (សាខា៖ ${escHtml(br)})\n` +
                        `🕒 ពេលវេលា៖ ${new Date().toLocaleString('km-KH')}\n\n` +
                        `${lines}${moreTxt}\n\n` +
                        `👉 <i>សូមពិនិត្យបញ្ជាទិញចូលបន្ថែម ដើម្បីកុំឱ្យដាច់ស្តុកលក់!</i>`;

                    const res = await sendTelegramMessage(msg, cfg);
                    appendAlertLog({
                        time: new Date().toLocaleString('km-KH'),
                        mode: 'auto',
                        count: triggeredItems.length,
                        ok: res.ok,
                        reason: res.reason || '',
                        items: triggeredItems.map(x => `${x.name} (${x.curQty})`).slice(0, 6).join(', ')
                    });

                    if (res.ok) {
                        showPack2Toast(`🚨 បានផ្ញើដំណឹងស្តុកជិតអស់ (${triggeredItems.length} មុខ) ចូល Telegram ម្ចាស់ហាង!`);
                    }
                } finally {
                    isCheckingNow = false;
                }
            }

            // Initialize baseline after initial sync settles, then poll gently
            setTimeout(() => {
                captureBaseline();
                setInterval(() => runAutoStockCheck(false), 4000);
            }, 4200);
            window.addEventListener('skm:order-paid', () => setTimeout(() => runAutoStockCheck(false), 900));

            function ensureModal() {
                if (document.getElementById('skmP2LowStockModal')) return;
                injectPack2Styles();
                const m = document.createElement('div');
                m.id = 'skmP2LowStockModal';
                m.className = 'skm-p2-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p2-box" style="max-width:940px;">
                        <div class="skm-p2-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#fbbf24;">🚨 ដាស់តឿនស្តុកជិតអស់អូតូ (Auto Low-Stock Telegram Alert)</div>
                                <div style="font-size:11.5px;color:#94a3b8;">ផ្ញើដំណឹងចូល Telegram ម្ចាស់ហាងស្វ័យប្រវត្តិភ្លាមៗ ពេលបុគ្គលិកលក់ដល់ស្តុកទាបជាងកម្រិតកំណត់</div>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <button class="skm-p2-btn red" onclick="document.getElementById('skmP2LowStockModal').classList.remove('open')">✕ បិទ</button>
                            </div>
                        </div>
                        <div class="skm-p2-tabs">
                            <button class="skm-p2-tab active" data-t="watch" onclick="window.SKMP2LowStock.tab('watch')">⚠️ ទំនិញជិតអស់ស្តុកឥឡូវនេះ</button>
                            <button class="skm-p2-tab" data-t="custom" onclick="window.SKMP2LowStock.tab('custom')">🎯 កំណត់កម្រិតតាមមុខទំនិញ</button>
                            <button class="skm-p2-tab" data-t="cfg" onclick="window.SKMP2LowStock.tab('cfg')">⚙️ កំណត់ការផ្ញើ Telegram អូតូ</button>
                            <button class="skm-p2-tab" data-t="logs" onclick="window.SKMP2LowStock.tab('logs')">📜 ប្រវត្តិផ្ញើដំណឹង</button>
                        </div>
                        <div class="skm-p2-body">
                            <!-- TAB 1: CURRENT LOW STOCK -->
                            <div id="skmP2LsTab_watch">
                                <div id="skmP2LsSummary" class="skm-p2-grid" style="margin-bottom:12px;"></div>
                                <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:10px;">
                                    <input id="skmP2LsFilter" class="skm-p2-input" style="flex:1;min-width:200px;" placeholder="🔍 ស្វែងរកឈ្មោះទំនិញ ឬប្រភេទ..." oninput="window.SKMP2LowStock.renderWatch()">
                                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                                        <button class="skm-p2-btn tg" onclick="window.SKMP2LowStock.sendCurrentSummaryNow()">✈️ ផ្ញើបញ្ជីស្តុកជិតអស់ចូល Telegram ឥឡូវ</button>
                                        <button class="skm-p2-btn gray" onclick="window.SKMP2LowStock.resetCooldowns()">🔄 Reset Cooldown</button>
                                    </div>
                                </div>
                                <div style="overflow-x:auto;max-height:320px;">
                                    <table class="skm-p2-table">
                                        <thead><tr><th>ទំនិញ</th><th>ប្រភេទ</th><th>ស្តុកសល់</th><th>កម្រិតដាស់តឿន</th><th>ស្ថានភាព</th><th>ប្រវត្តិ Alert</th></tr></thead>
                                        <tbody id="skmP2LsWatchBody"></tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- TAB 2: PER-PRODUCT CUSTOM THRESHOLDS -->
                            <div id="skmP2LsTab_custom" style="display:none;">
                                <p style="font-size:12px;color:#cbd5e1;margin:0 0 10px;">
                                    កំណត់កម្រិតស្តុកទាបផ្ទាល់ខ្លួនសម្រាប់ទំនិញពិសេសៗ (ឧ. ទឹកសុទ្ធដាស់តឿនពេលសល់ <b>≤ 20</b>, ថ្នាំថ្លៃដាស់តឿនពេលសល់ <b>≤ 3</b>)។ បើទុកទទេ វានឹងប្រើកម្រិតស្តង់ដាររួម។
                                </p>
                                <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
                                    <input id="skmP2LsCustomSearch" class="skm-p2-input" style="flex:1;min-width:200px;" placeholder="🔍 វាយឈ្មោះ ឬកូដទំនិញ..." oninput="window.SKMP2LowStock.renderCustomList(this.value)">
                                    <button class="skm-p2-btn green" onclick="window.SKMP2LowStock.saveCustomThresholds()">💾 រក្សាទុកកម្រិតទាំងអស់</button>
                                </div>
                                <div style="overflow-x:auto;max-height:330px;">
                                    <table class="skm-p2-table">
                                        <thead><tr><th>ទំនិញ</th><th>ស្តុកបច្ចុប្បន្ន</th><th>កម្រិតដាស់តឿនផ្ទាល់ខ្លួន (ទទេ = លំនាំដើម)</th></tr></thead>
                                        <tbody id="skmP2LsCustomBody"></tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- TAB 3: SETTINGS -->
                            <div id="skmP2LsTab_cfg" style="display:none;">
                                <div class="skm-p2-grid">
                                    <div><label class="skm-p2-label">បើកដំណើរការផ្ញើអូតូ (Auto Alert)</label>
                                        <select id="skmP2LsCfgAuto" class="skm-p2-select">
                                            <option value="true">✅ បើក (ផ្ញើអូតូភ្លាមៗពេលស្តុកធ្លាក់ទាប)</option>
                                            <option value="false">❌ បិទជាបណ្តោះអាសន្ន</option>
                                        </select>
                                    </div>
                                    <div><label class="skm-p2-label">កម្រិតស្តុកទាបស្តង់ដារ (≤ ចំនួនឯកតា)</label>
                                        <input type="number" id="skmP2LsCfgThresh" min="0" max="9999" class="skm-p2-input" value="5">
                                    </div>
                                    <div><label class="skm-p2-label">ដាស់តឿនបន្ទាន់ពេលអស់ស្តុក (0)</label>
                                        <select id="skmP2LsCfgOut" class="skm-p2-select">
                                            <option value="true">🚨 បើក (បាញ់ភ្លាមពេលដល់ 0 ទោះជាប់ Cooldown)</option>
                                            <option value="false">❌ មិនបាច់បាញ់ផ្ទួន</option>
                                        </select>
                                    </div>
                                    <div><label class="skm-p2-label">រយៈពេលកុំឱ្យផ្ញើផ្ទួនដដែលៗ (Cooldown)</label>
                                        <select id="skmP2LsCfgCool" class="skm-p2-select">
                                            <option value="1">១ ម៉ោង / ម្តង</option>
                                            <option value="6">៦ ម៉ោង / ម្តង</option>
                                            <option value="12">១២ ម៉ោង / ម្តង (ណែនាំ)</option>
                                            <option value="24">២៤ ម៉ោង / ម្តង</option>
                                        </select>
                                    </div>
                                    <div><label class="skm-p2-label">Reset អូតូពេលបញ្ចូលស្តុកវិញ</label>
                                        <select id="skmP2LsCfgReset" class="skm-p2-select">
                                            <option value="true">✅ Reset អូតូ (លើកក្រោយធ្លាក់ទាប បាញ់ទៀត)</option>
                                            <option value="false">❌ មិន Reset</option>
                                        </select>
                                    </div>
                                    <div><label class="skm-p2-label">Telegram Bot Token (ទទេ = ប្រើរបស់ POS អូតូ)</label>
                                        <input type="text" id="skmP2LsCfgTok" class="skm-p2-input" placeholder="ទុកទទេដើម្បីប្រើ Bot របស់ POS">
                                    </div>
                                    <div><label class="skm-p2-label">Telegram Chat ID (ទទេ = ប្រើរបស់ POS អូតូ)</label>
                                        <input type="text" id="skmP2LsCfgChat" class="skm-p2-input" placeholder="ទុកទទេដើម្បីប្រើ Chat ID របស់ POS">
                                    </div>
                                </div>
                                <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;">
                                    <button class="skm-p2-btn green" onclick="window.SKMP2LowStock.saveCfgFromForm()">💾 រក្សាទុកការកំណត់</button>
                                    <button class="skm-p2-btn tg" onclick="window.SKMP2LowStock.sendTestPing()">🧪 សាកល្បងផ្ញើសារតេស្ត Telegram</button>
                                </div>
                            </div>

                            <!-- TAB 4: ALERT LOGS -->
                            <div id="skmP2LsTab_logs" style="display:none;">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                                    <strong style="font-size:13.5px;">📜 ប្រវត្តិការផ្ញើដំណឹងស្តុកជិតអស់</strong>
                                    <button class="skm-p2-btn gray" onclick="window.SKMP2LowStock.clearLogs()">🗑️ សម្អាតប្រវត្តិ</button>
                                </div>
                                <div id="skmP2LsLogsList" style="display:flex;flex-direction:column;gap:8px;max-height:340px;overflow-y:auto;"></div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
            }

            window.SKMP2LowStock = {
                open(defaultTab = 'watch') {
                    ensureModal();
                    document.getElementById('skmP2LowStockModal').classList.add('open');
                    this.tab(defaultTab);
                },
                tab(t) {
                    ['watch', 'custom', 'cfg', 'logs'].forEach(k => {
                        const el = document.getElementById(`skmP2LsTab_${k}`);
                        if (el) el.style.display = (k === t) ? 'block' : 'none';
                    });
                    document.querySelectorAll('#skmP2LowStockModal .skm-p2-tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-t') === t));
                    if (t === 'watch') this.renderWatch();
                    if (t === 'custom') this.renderCustomList(document.getElementById('skmP2LsCustomSearch')?.value || '');
                    if (t === 'cfg') this.fillCfgForm();
                    if (t === 'logs') this.renderLogs();
                },
                renderWatch() {
                    const cfg = loadLsCfg();
                    const alertState = loadAlertState();
                    const inv = getInvList().filter(p => p && p.name && !String(p.id || '').startsWith('CUSTOM_'));
                    const ql = (document.getElementById('skmP2LsFilter')?.value || '').trim().toLowerCase();

                    const lowItems = [];
                    let outCount = 0, lowOnlyCount = 0;
                    inv.forEach(p => {
                        const qty = Math.max(0, Number(p.qty ?? 0));
                        const limit = getEffectiveThreshold(p, cfg);
                        if (qty <= limit) {
                            if (qty === 0) outCount++; else lowOnlyCount++;
                            if (!ql || String(p.name).toLowerCase().includes(ql) || String(p.category || '').toLowerCase().includes(ql)) {
                                lowItems.push({ p, key: getProdKey(p), qty, limit, st: alertState[getProdKey(p)] || null });
                            }
                        }
                    });
                    lowItems.sort((a, b) => (a.qty - b.qty) || a.p.name.localeCompare(b.p.name));

                    const { token, chatId } = getTelegramCreds(cfg);
                    const tgReady = Boolean(token && chatId);

                    document.getElementById('skmP2LsSummary').innerHTML = `
                        <div class="skm-p2-card" style="border-color:rgba(239,68,68,0.45);">
                            <div style="font-size:11px;color:#fca5a5;">🔴 អស់ស្តុកទាំងស្រុង (0)</div>
                            <div style="font-size:20px;font-weight:900;color:#f87171;">${outCount} មុខ</div>
                        </div>
                        <div class="skm-p2-card" style="border-color:rgba(245,158,11,0.45);">
                            <div style="font-size:11px;color:#fcd34d;">🟠 ជិតអស់ស្តុក (≤ កម្រិត)</div>
                            <div style="font-size:20px;font-weight:900;color:#fbbf24;">${lowOnlyCount} មុខ</div>
                        </div>
                        <div class="skm-p2-card" style="border-color:${cfg.autoEnabled ? 'rgba(16,185,129,0.45)' : 'rgba(148,163,184,0.3)'};">
                            <div style="font-size:11px;color:#94a3b8;">⚡ ស្ថានភាព Auto Alert</div>
                            <div style="font-size:15px;font-weight:900;color:${cfg.autoEnabled ? '#34d399' : '#94a3b8'};margin-top:4px;">${cfg.autoEnabled ? '🟢 កំពុងតាមដានអូតូ' : '⚪ បិទជាបណ្តោះអាសន្ន'}</div>
                            <div style="font-size:10.5px;color:${tgReady ? '#38bdf8' : '#f87171'};">${tgReady ? '✅ Telegram ភ្ជាប់រួច' : '⚠️ មិនទាន់មាន Telegram Token'}</div>
                        </div>
                    `;

                    const tb = document.getElementById('skmP2LsWatchBody');
                    tb.innerHTML = lowItems.length ? lowItems.slice(0, 120).map(x => {
                        const badge = x.qty === 0
                            ? '<span style="background:rgba(239,68,68,0.22);color:#fca5a5;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:800;">🔴 អស់ស្តុក</span>'
                            : '<span style="background:rgba(245,158,11,0.22);color:#fcd34d;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:800;">🟠 ជិតអស់</span>';
                        const alertTxt = x.st ? `✅ ផ្ញើហើយ (${new Date(x.st.ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })})` : '<span style="color:#94a3b8;">មិនទាន់ផ្ញើ</span>';
                        return `<tr>
                            <td><b>${escHtml(x.p.name)}</b><div style="font-size:10.5px;color:#94a3b8;">${escHtml(x.p.customId || x.p.id || '-')}</div></td>
                            <td>${escHtml(x.p.category || 'ទូទៅ')}</td>
                            <td><b style="color:${x.qty === 0 ? '#f87171' : '#fbbf24'};font-size:14px;">${x.qty}</b></td>
                            <td>≤ ${x.limit}</td>
                            <td>${badge}</td>
                            <td style="font-size:11.5px;">${alertTxt}</td>
                        </tr>`;
                    }).join('') : '<tr><td colspan="6" style="text-align:center;color:#34d399;padding:22px;">🎉 ស្តុកទំនិញទាំងអស់នៅមានគ្រប់គ្រាន់ (លើសកម្រិតកំណត់)!</td></tr>';
                },
                renderCustomList(q) {
                    const cfg = loadLsCfg();
                    const inv = getInvList().filter(p => p && p.name && !String(p.id || '').startsWith('CUSTOM_'));
                    const ql = String(q || '').trim().toLowerCase();
                    const list = (ql ? inv.filter(p => String(p.name).toLowerCase().includes(ql) || String(p.customId || '').toLowerCase().includes(ql)) : inv).slice(0, 60);
                    const tb = document.getElementById('skmP2LsCustomBody');
                    tb.innerHTML = list.length ? list.map(p => {
                        const key = getProdKey(p);
                        const customVal = cfg.customThresholds[key] != null ? cfg.customThresholds[key] : '';
                        return `<tr>
                            <td><b>${escHtml(p.name)}</b><div style="font-size:10.5px;color:#94a3b8;">${escHtml(p.category || 'ទូទៅ')} • SKU: ${escHtml(p.customId || p.id || '-')}</div></td>
                            <td><b>${Number(p.qty ?? 0)}</b></td>
                            <td><input type="number" min="0" class="skm-p2-input skm-ls-custom-inp" data-key="${escHtml(key)}" value="${escHtml(customVal)}" placeholder="លំនាំដើម (${cfg.threshold})" style="max-width:160px;padding:6px 10px;"></td>
                        </tr>`;
                    }).join('') : '<tr><td colspan="3" style="text-align:center;color:#94a3b8;padding:18px;">រកមិនឃើញទំនិញទេ។</td></tr>';
                },
                async saveCustomThresholds() {
                    const cfg = loadLsCfg();
                    document.querySelectorAll('.skm-ls-custom-inp').forEach(inp => {
                        const k = inp.getAttribute('data-key');
                        const v = inp.value.trim();
                        if (v === '') delete cfg.customThresholds[k];
                        else {
                            const num = Number(v);
                            if (!isNaN(num) && num >= 0) cfg.customThresholds[k] = num;
                        }
                    });
                    await saveLsCfg(cfg);
                    showPack2Toast('✅ រក្សាទុកកម្រិតដាស់តឿនតាមមុខទំនិញជោគជ័យ!');
                },
                fillCfgForm() {
                    const c = loadLsCfg();
                    document.getElementById('skmP2LsCfgAuto').value = String(c.autoEnabled !== false);
                    document.getElementById('skmP2LsCfgThresh').value = c.threshold ?? 5;
                    document.getElementById('skmP2LsCfgOut').value = String(c.alertOutOfStock !== false);
                    document.getElementById('skmP2LsCfgCool').value = String(c.cooldownHours || 12);
                    document.getElementById('skmP2LsCfgReset').value = String(c.autoResetOnRestock !== false);
                    document.getElementById('skmP2LsCfgTok').value = c.telegramToken || '';
                    document.getElementById('skmP2LsCfgChat').value = c.telegramChatId || '';
                },
                async saveCfgFromForm() {
                    const cfg = Object.assign(loadLsCfg(), {
                        autoEnabled: document.getElementById('skmP2LsCfgAuto').value === 'true',
                        threshold: Math.max(0, Number(document.getElementById('skmP2LsCfgThresh').value || 5)),
                        alertOutOfStock: document.getElementById('skmP2LsCfgOut').value === 'true',
                        cooldownHours: Number(document.getElementById('skmP2LsCfgCool').value || 12),
                        autoResetOnRestock: document.getElementById('skmP2LsCfgReset').value === 'true',
                        telegramToken: document.getElementById('skmP2LsCfgTok').value.trim(),
                        telegramChatId: document.getElementById('skmP2LsCfgChat').value.trim()
                    });
                    await saveLsCfg(cfg);
                    showPack2Toast('✅ រក្សាទុកការកំណត់ Auto Low-Stock Alert ជោគជ័យ!');
                },
                async sendCurrentSummaryNow() {
                    const cfg = loadLsCfg();
                    const inv = getInvList().filter(p => p && p.name && !String(p.id || '').startsWith('CUSTOM_'));
                    const low = inv.filter(p => Math.max(0, Number(p.qty ?? 0)) <= getEffectiveThreshold(p, cfg))
                        .sort((a, b) => Number(a.qty ?? 0) - Number(b.qty ?? 0));
                    if (!low.length) return showPack2Toast('🎉 គ្មានទំនិញជិតអស់ស្តុកសម្រាប់ផ្ញើទេ!');

                    const br = getBranchId();
                    const shop = localStorage.getItem(`ks2_${br}_shop_name`) || window.shopName || br;
                    const lines = low.slice(0, 20).map((p, i) => {
                        const q = Math.max(0, Number(p.qty ?? 0));
                        const lim = getEffectiveThreshold(p, cfg);
                        return `${i + 1}. <b>${escHtml(p.name)}</b> — ${q === 0 ? '🔴 អស់ស្តុក (0)' : `🟠 សល់ <b>${q}</b> (≤${lim})`}`;
                    }).join('\n');
                    const extra = low.length > 20 ? `\n... និង ${low.length - 20} មុខទៀត` : '';
                    const msg =
                        `🚨 <b>បញ្ជីទំនិញជិតអស់ស្តុកបច្ចុប្បន្ន (${low.length} មុខ)</b>\n` +
                        `🏪 ហាង៖ <b>${escHtml(shop)}</b> (សាខា៖ ${escHtml(br)})\n` +
                        `🕒 ${new Date().toLocaleString('km-KH')}\n\n${lines}${extra}`;

                    const res = await sendTelegramMessage(msg, cfg);
                    appendAlertLog({
                        time: new Date().toLocaleString('km-KH'),
                        mode: 'manual',
                        count: low.length,
                        ok: res.ok,
                        reason: res.reason || '',
                        items: low.slice(0, 5).map(p => `${p.name} (${p.qty})`).join(', ')
                    });
                    if (res.ok) showPack2Toast(`✈️ បានផ្ញើបញ្ជីស្តុកជិតអស់ (${low.length} មុខ) ចូល Telegram ជោគជ័យ!`);
                    else showPack2Toast(res.reason === 'no_creds' ? '⚠️ សូមបញ្ចូល Telegram Bot Token & Chat ID ជាមុនសិន!' : `❌ ផ្ញើមិនជោគជ័យ៖ ${res.reason}`, true);
                },
                async sendTestPing() {
                    const cfg = Object.assign(loadLsCfg(), {
                        telegramToken: document.getElementById('skmP2LsCfgTok')?.value.trim() || '',
                        telegramChatId: document.getElementById('skmP2LsCfgChat')?.value.trim() || ''
                    });
                    const res = await sendTelegramMessage(
                        `✅ <b>តេស្តភ្ជាប់ Auto Low-Stock Alert ជោគជ័យ!</b>\n🏪 សាខា៖ <b>${escHtml(getBranchId())}</b>\n🎯 កម្រិតដាស់តឿន៖ ≤ <b>${cfg.threshold}</b>\n🕒 ${new Date().toLocaleString('km-KH')}`,
                        cfg
                    );
                    if (res.ok) showPack2Toast('✅ បានផ្ញើសារតេស្តចូល Telegram ជោគជ័យ!');
                    else showPack2Toast(res.reason === 'no_creds' ? '⚠️ មិនទាន់មាន Telegram Bot Token / Chat ID!' : `❌ តេស្តមិនជោគជ័យ៖ ${res.reason}`, true);
                },
                resetCooldowns() {
                    saveAlertState({});
                    showPack2Toast('🔄 បានសម្អាត Cooldown រួចរាល់! លើកក្រោយស្តុកធ្លាក់ទាបនឹងបាញ់ភ្លាម។');
                    this.renderWatch();
                },
                renderLogs() {
                    const logs = loadAlertLogs();
                    const box = document.getElementById('skmP2LsLogsList');
                    box.innerHTML = logs.length ? logs.map(l => `
                        <div class="skm-p2-card" style="padding:10px 12px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;">
                                <strong>${l.mode === 'auto' ? '⚡ ផ្ញើអូតូ' : '✈️ ផ្ញើដោយដៃ'} (${l.count} មុខ)</strong>
                                <span style="color:${l.ok ? '#34d399' : '#f87171'};font-weight:800;">${l.ok ? '✅ ជោគជ័យ' : '❌ បរាជ័យ ' + escHtml(l.reason)}</span>
                            </div>
                            <div style="font-size:11px;color:#94a3b8;margin-top:3px;">🕒 ${escHtml(l.time)}</div>
                            <div style="font-size:12px;color:#e2e8f0;margin-top:4px;">📦 ${escHtml(l.items)}</div>
                        </div>`).join('') : '<div style="text-align:center;color:#94a3b8;padding:24px;">មិនទាន់មានប្រវត្តិផ្ញើដំណឹងទេ។</div>';
                },
                clearLogs() {
                    localStorage.removeItem(getLsLogKey());
                    this.renderLogs();
                    showPack2Toast('🗑️ បានសម្អាតប្រវត្តិដំណឹង!');
                }
            };

            registerInPosToolbox('🚨', 'ដាស់តឿនស្តុកជិតអស់អូតូ (Telegram Alert)', () => window.SKMP2LowStock.open('watch'));
    });

    // ========================================================================
    // [8/8] 🔄 Offline Order Sync Queue & Smart TTL Cache (Anti-Data-Loss + Low-Egress)
    // 1. ធានាថាវិក្កយបត្រ និងចំណាយដែលបង្កើតពេលដាច់អ៊ីនធឺណិត/សេវាយឺត មិនបាត់ឡើយ (តម្រៀបក្នុង FIFO Queue ហើយបាញ់ឡើង Supabase អូតូពេលមានសេវាវិញ)
    // 2. ប្រើ Smart TTL Cache ឆែកតែ `branch_store.updated_at` (~40 bytes) ដើម្បីដឹងថាមានតម្លៃ/ស្តុកថ្មី ដោយមិនស៊ី Supabase Egress
    // ========================================================================
    registerPack2Module('offlineSyncQueue', function initOfflineSyncQueuePlugin() {
            const getQKey = () => `ks2_${getBranchId()}_offline_sync_queue`;
            const getCfgKey = () => `ks2_${getBranchId()}_sync_cache_cfg`;
            const getLogKey = () => `ks2_${getBranchId()}_sync_queue_logs`;
            const getMetaKey = () => `ks2_${getBranchId()}_ttl_cache_meta`;

            function loadCfg() {
                let c = {
                    autoFlushOnline: true,
                    ttlMinutes: 5,
                    autoRefreshOnCloudUpdate: false,
                    showFloatingStatusWhenPending: true
                };
                try {
                    const raw = localStorage.getItem(getCfgKey());
                    if (raw) c = Object.assign(c, JSON.parse(raw));
                } catch (e) {}
                return c;
            }
            function saveCfg(c) {
                try { localStorage.setItem(getCfgKey(), JSON.stringify(c)); } catch (e) {}
            }

            function loadQueue() {
                try {
                    const arr = JSON.parse(localStorage.getItem(getQKey()) || '[]');
                    return Array.isArray(arr) ? arr : [];
                } catch (e) { return []; }
            }
            function saveQueue(q) {
                try { localStorage.setItem(getQKey(), JSON.stringify(q.slice(0, 500))); } catch (e) {}
                updateFloatingBadge();
            }

            function loadLogs() {
                try {
                    const arr = JSON.parse(localStorage.getItem(getLogKey()) || '[]');
                    return Array.isArray(arr) ? arr : [];
                } catch (e) { return []; }
            }
            function pushLog(entry) {
                const logs = loadLogs();
                logs.unshift(entry);
                try { localStorage.setItem(getLogKey(), JSON.stringify(logs.slice(0, 80))); } catch (e) {}
            }

            function loadMeta() {
                try { return JSON.parse(localStorage.getItem(getMetaKey()) || '{}'); } catch (e) { return {}; }
            }
            function saveMeta(m) {
                try { localStorage.setItem(getMetaKey(), JSON.stringify(m)); } catch (e) {}
            }

            // Build exact Supabase payload matching SKM POS `pos_orders` schema (strips heavy base64 images for Low Egress!)
            function mapInvoiceToRow(inv) {
                const br = getBranchId();
                const rawItems = Array.isArray(inv.items) ? inv.items : (Array.isArray(inv.cart) ? inv.cart : []);
                const cleanItems = rawItems.map(it => {
                    if (!it || typeof it !== 'object') return it;
                    const { image: _stripImg, ...rest } = it;
                    return rest;
                });
                const totAmt = Number(inv.totalAmount ?? inv.total ?? 0);
                const st = String(inv.status || 'paid');
                const paidAmt = inv.paidUsd != null ? Number(inv.paidUsd) : (inv.paidAmount != null ? Number(inv.paidAmount) : (st === 'paid' ? totAmt : 0));
                return {
                    id: String(inv.id),
                    branch_id: br,
                    customer_name: String(inv.customerName || inv.customer || 'អតិថិជនទូទៅ'),
                    customer_phone: String(inv.customerPhone || inv.phone || ''),
                    total_amount: totAmt,
                    paid_amount: paidAmt,
                    status: st,
                    seller: String(inv.seller || inv.cashier || (window.activeUser && (window.activeUser.fullName || window.activeUser.username)) || 'POS'),
                    order_data: cleanItems,
                    note: String(inv.note || ''),
                    timestamp: typeof inv.timestamp === 'number' ? inv.timestamp : (Date.parse(inv.timestamp || '') || Date.now())
                };
            }

            function mapExpenseToRow(exp) {
                const br = getBranchId();
                return {
                    id: String(exp.id),
                    branch_id: br,
                    category: String(exp.category || 'ចំណាយផ្សេងៗ'),
                    amount: Number(exp.amount || 0),
                    note: String(exp.note || ''),
                    timestamp: typeof exp.timestamp === 'number' ? exp.timestamp : Date.now(),
                    date: String(exp.date || new Date().toLocaleString('km-KH'))
                };
            }

            function enqueueJob(table, recordId, payload, label) {
                const q = loadQueue();
                const key = `${table}::${recordId}`;
                const existingIdx = q.findIndex(x => x.key === key);
                const job = {
                    key,
                    table,
                    recordId: String(recordId),
                    label: label || `${table} #${recordId}`,
                    payload,
                    createdAt: new Date().toISOString(),
                    attempts: 0,
                    lastError: ''
                };
                if (existingIdx >= 0) q[existingIdx] = Object.assign(q[existingIdx], { payload, label: job.label });
                else q.push(job);
                saveQueue(q);
            }

            // Watch for new invoices & expenses created while Offline (or newly minted)
            let bootDone = false;
            const knownInvMap = new Map(); // id -> status
            const knownExpIds = new Set();

            function seedKnownRecords() {
                const br = getBranchId();
                const invs = Array.isArray(window.invoices) ? window.invoices : JSON.parse(localStorage.getItem(`ks2_${br}_invoices_pro`) || '[]');
                invs.forEach(x => { if (x && x.id) knownInvMap.set(String(x.id), String(x.status || '')); });
                const exps = Array.isArray(window.expenses) ? window.expenses : JSON.parse(localStorage.getItem(`ks2_${br}_expenses_pro`) || '[]');
                exps.forEach(x => { if (x && x.id) knownExpIds.add(String(x.id)); });
                bootDone = true;
            }

            function scanForNewOfflineRecords() {
                if (!bootDone) { seedKnownRecords(); return; }
                const br = getBranchId();
                const isOffline = !navigator.onLine;
                let addedCount = 0;

                const invs = Array.isArray(window.invoices) ? window.invoices : [];
                invs.slice(0, 25).forEach(inv => {
                    if (!inv || !inv.id) return;
                    const idStr = String(inv.id);
                    const stStr = String(inv.status || '');
                    const isNew = !knownInvMap.has(idStr);
                    const isStatusChanged = !isNew && knownInvMap.get(idStr) !== stStr;
                    if (isNew || isStatusChanged) {
                        knownInvMap.set(idStr, stStr);
                        // Always queue if offline, or if newly created without cloud confirmation
                        if (isOffline) {
                            enqueueJob('pos_orders', idStr, mapInvoiceToRow(inv), `🧾 វិក្កយបត្រ ${idStr} ($${Number(inv.totalAmount ?? inv.total ?? 0).toFixed(2)})`);
                            addedCount++;
                        }
                    }
                });

                const exps = Array.isArray(window.expenses) ? window.expenses : [];
                exps.slice(0, 20).forEach(exp => {
                    if (!exp || !exp.id) return;
                    const idStr = String(exp.id);
                    if (!knownExpIds.has(idStr)) {
                        knownExpIds.add(idStr);
                        if (isOffline) {
                            enqueueJob('pos_expenses', idStr, mapExpenseToRow(exp), `💸 ចំណាយ ${exp.category || ''} ($${Number(exp.amount || 0).toFixed(2)})`);
                            addedCount++;
                        }
                    }
                });

                if (addedCount > 0) {
                    showPack2Toast(`📥 គ្មានអ៊ីនធឺណិត៖ បានរក្សាទុក ${addedCount} ប្រតិបត្តិការក្នុង Offline Queue រួចរាល់!`);
                }
            }

            let flushing = false;
            async function flushQueue(manual = false) {
                if (flushing) return;
                const q = loadQueue();
                if (!q.length) {
                    if (manual) showPack2Toast('✅ គ្មានទិន្នន័យកកស្ទះក្នុង Queue ទេ (Sync រួចរាល់ ១០០%)!');
                    return;
                }
                if (!navigator.onLine) {
                    if (manual) showPack2Toast('📡 កំពុងដាច់អ៊ីនធឺណិត! Queue នឹងបាញ់ឡើងអូតូពេលមានសេវាវិញ។', true);
                    return;
                }
                const sb = window.supabaseClient;
                if (!sb) {
                    if (manual) showPack2Toast('⚠️ មិនទាន់ភ្ជាប់ Supabase Client ទេ!', true);
                    return;
                }

                flushing = true;
                let successCount = 0;
                const remaining = [];
                try {
                    for (const job of q) {
                        try {
                            const { error } = await sb.from(job.table).upsert(job.payload, { onConflict: 'id' });
                            if (error) throw new Error(error.message || 'Supabase error');
                            successCount++;
                            pushLog({
                                time: new Date().toLocaleString('km-KH'),
                                label: job.label,
                                table: job.table,
                                ok: true,
                                err: ''
                            });
                        } catch (err) {
                            job.attempts = Number(job.attempts || 0) + 1;
                            job.lastError = String(err.message || err || 'Network error').slice(0, 120);
                            remaining.push(job);
                            pushLog({
                                time: new Date().toLocaleString('km-KH'),
                                label: job.label,
                                table: job.table,
                                ok: false,
                                err: job.lastError
                            });
                        }
                    }
                    saveQueue(remaining);

                    if (successCount > 0) {
                        // Touch branch_store.updated_at once for the whole batch (Low-Egress!)
                        try {
                            if (typeof window.touchCloudSync === 'function') {
                                window.touchCloudSync();
                            } else {
                                await sb.from('branch_store').upsert({
                                    branch_id: getBranchId(),
                                    updated_at: new Date().toISOString()
                                }, { onConflict: 'branch_id' });
                            }
                        } catch (e) {}

                        const meta = loadMeta();
                        meta.lastFlushAt = new Date().toLocaleString('km-KH');
                        meta.totalFlushed = Number(meta.totalFlushed || 0) + successCount;
                        saveMeta(meta);
                        showPack2Toast(`☁️ Sync ជោគជ័យ ${successCount} ប្រតិបត្តិការពី Offline Queue ឡើង Cloud!`);
                    } else if (manual && remaining.length) {
                        showPack2Toast(`⚠️ នៅសល់ ${remaining.length} ប្រតិបត្តិការមិនទាន់ Sync បាន — នឹងសាកម្តងទៀតអូតូ!`, true);
                    }
                } finally {
                    flushing = false;
                    if (document.getElementById('skmP2OqModal')?.classList.contains('open')) {
                        window.SKMP2Sync.refreshUi();
                    }
                }
            }

            // Ultra-Low-Egress Smart TTL Cache Freshness Check (queries ONLY updated_at ~40 bytes; avoids duplicating main.js sync!)
            let lastTtlCheckMs = Date.now();
            async function checkCloudFreshness(manual = false) {
                if (!manual && document.hidden) return;
                const cfg = loadCfg();
                const ttlMs = Math.max(1, Number(cfg.ttlMinutes || 5)) * 60000;
                const now = Date.now();
                if (!manual && (now - lastTtlCheckMs) < ttlMs) return;
                // If main.js already checked cloud recently, skip redundant query!
                const br = getBranchId();
                const mainLastTs = parseInt(localStorage.getItem(`ks2_${br}_last_update`) || '0', 10);
                if (!manual && mainLastTs > 0 && (now - mainLastTs) < ttlMs) {
                    lastTtlCheckMs = now;
                    return;
                }
                if (!navigator.onLine || !window.supabaseClient) {
                    if (manual) showPack2Toast('📡 គ្មានអ៊ីនធឺណិត — កំពុងប្រើទិន្នន័យ Cache ក្នុងម៉ាស៊ីន!', true);
                    return;
                }
                lastTtlCheckMs = now;
                try {
                    const { data, error } = await window.supabaseClient
                        .from('branch_store')
                        .select('updated_at')
                        .eq('branch_id', br)
                        .maybeSingle();
                    if (error || !data) return;

                    const meta = loadMeta();
                    const prevRemote = meta.remoteUpdatedAt || '';
                    const newRemote = data.updated_at || '';
                    meta.lastCheckAt = new Date().toLocaleString('km-KH');
                    meta.remoteUpdatedAt = newRemote;
                    saveMeta(meta);

                    if (prevRemote && newRemote && prevRemote !== newRemote) {
                        showPack2Toast('🔄 រកឃើញការអាប់ដេតតម្លៃ/ស្តុកថ្មីលើ Cloud!');
                        if (cfg.autoRefreshOnCloudUpdate && typeof window.manualCloudSync === 'function') {
                            try { await window.manualCloudSync(true); } catch (e) {}
                        }
                    } else if (manual) {
                        showPack2Toast('✅ Cache ក្នុងម៉ាស៊ីនថ្មីបំផុតដូច Cloud ហើយ (ស៊ីទិន្នន័យតិចបំផុត)!');
                    }
                } catch (e) {}
                if (document.getElementById('skmP2OqModal')?.classList.contains('open')) {
                    window.SKMP2Sync.refreshUi();
                }
            }

            // Subtle corner status pill (ONLY shown when offline OR pending queue > 0)
            function updateFloatingBadge() {
                const cfg = loadCfg();
                const q = loadQueue();
                const isOffline = !navigator.onLine;
                let pill = document.getElementById('skmP2OfflinePill');
                const shouldShow = cfg.showFloatingStatusWhenPending !== false && (isOffline || q.length > 0);
                if (!shouldShow) {
                    if (pill) pill.style.display = 'none';
                    return;
                }
                if (!pill) {
                    pill = document.createElement('button');
                    pill.id = 'skmP2OfflinePill';
                    pill.type = 'button';
                    pill.style.cssText = "position:fixed;bottom:20px;left:20px;z-index:98500;border:none;border-radius:999px;padding:8px 14px;font-family:'Battambang',sans-serif;font-size:12px;font-weight:800;color:#fff;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,0.35);display:flex;align-items:center;gap:6px;";
                    pill.onclick = () => window.SKMP2Sync.open('queue');
                    document.body.appendChild(pill);
                }
                pill.style.display = 'flex';
                if (isOffline) {
                    pill.style.background = 'linear-gradient(135deg,#dc2626,#b91c1c)';
                    pill.innerHTML = `📡 Offline${q.length ? ` • រង់ចាំ Sync (${q.length})` : ''}`;
                } else {
                    pill.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)';
                    pill.innerHTML = `🔄 កំពុងរង់ចាំ Sync (${q.length})`;
                }
            }

            // Network events & gentle timers
            window.addEventListener('online', () => {
                updateFloatingBadge();
                showPack2Toast('🟢 មានអ៊ីនធឺណិតវិញហើយ! កំពុងពិនិត្យ Offline Queue...');
                if (loadCfg().autoFlushOnline !== false) {
                    setTimeout(() => flushQueue(false), 1200);
                }
            });
            window.addEventListener('offline', () => {
                updateFloatingBadge();
                showPack2Toast('📡 ដាច់អ៊ីនធឺណិត — ប្រព័ន្ធបន្តលក់ Offline ហើយរក្សាទុកក្នុង Queue អូតូ!', true);
            });

            setTimeout(() => {
                seedKnownRecords();
                updateFloatingBadge();
                setInterval(scanForNewOfflineRecords, 2500);
                setInterval(() => {
                    if (navigator.onLine && loadCfg().autoFlushOnline !== false && loadQueue().length > 0) {
                        flushQueue(false);
                    }
                }, 15000);
                setInterval(() => checkCloudFreshness(false), 60000);
            }, 3500);

            function ensureModal() {
                if (document.getElementById('skmP2OqModal')) return;
                injectPack2Styles();
                const m = document.createElement('div');
                m.id = 'skmP2OqModal';
                m.className = 'skm-p2-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p2-box" style="max-width:920px;">
                        <div class="skm-p2-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#38bdf8;">🔄 Offline Order Queue & Smart TTL Cache</div>
                                <div style="font-size:11.5px;color:#94a3b8;">ធានាវិក្កយបត្រមិនបាត់ពេលដាច់អ៊ីនធឺណិត (Auto-Retry FIFO) + កាត់បន្ថយ Supabase Egress ៨០%+</div>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <button class="skm-p2-btn red" onclick="document.getElementById('skmP2OqModal').classList.remove('open')">✕ បិទ</button>
                            </div>
                        </div>
                        <div class="skm-p2-tabs">
                            <button class="skm-p2-tab active" data-t="queue" onclick="window.SKMP2Sync.tab('queue')">📋 បញ្ជីរង់ចាំ Sync (Queue)</button>
                            <button class="skm-p2-tab" data-t="cache" onclick="window.SKMP2Sync.tab('cache')">⚡ Smart TTL Cache & កំណត់</button>
                            <button class="skm-p2-tab" data-t="logs" onclick="window.SKMP2Sync.tab('logs')">📜 ប្រវត្តិ Sync</button>
                        </div>
                        <div class="skm-p2-body">
                            <div id="skmP2OqKpis" class="skm-p2-grid" style="margin-bottom:12px;"></div>

                            <!-- TAB 1: QUEUE -->
                            <div id="skmP2OqTab_queue">
                                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
                                    <button class="skm-p2-btn green" onclick="window.SKMP2Sync.flushNow()">⚡ បាញ់ Sync ឡើង Cloud ឥឡូវ</button>
                                    <button class="skm-p2-btn" onclick="window.SKMP2Sync.queueLatestToday()">📥 ផ្ទៀងផ្ទាត់បញ្ចូលវិក្កយបត្រថ្ងៃនេះ</button>
                                    <button class="skm-p2-btn gray" onclick="window.SKMP2Sync.exportQueueJson()">💾 Backup Queue (JSON)</button>
                                </div>
                                <div style="overflow-x:auto;max-height:310px;">
                                    <table class="skm-p2-table">
                                        <thead><tr><th>ប្រតិបត្តិការ</th><th>តារាង Cloud</th><th>សាកល្បង</th><th>ស្ថានភាព/កំហុស</th><th>សកម្មភាព</th></tr></thead>
                                        <tbody id="skmP2OqBody"></tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- TAB 2: SMART CACHE & SETTINGS -->
                            <div id="skmP2OqTab_cache" style="display:none;">
                                <div class="skm-p2-grid">
                                    <div><label class="skm-p2-label">បាញ់ Sync អូតូពេលមានអ៊ីនធឺណិតវិញ</label>
                                        <select id="skmP2OqCfgAuto" class="skm-p2-select">
                                            <option value="true">✅ បើក (ណែនាំ • ធានា Order មិនបាត់)</option>
                                            <option value="false">❌ បិទ (ចុច Sync ដោយដៃ)</option>
                                        </select>
                                    </div>
                                    <div><label class="skm-p2-label">អាយុ Cache (TTL ឆែក updated_at)</label>
                                        <select id="skmP2OqCfgTtl" class="skm-p2-select">
                                            <option value="1">១ នាទី (ឆែកញឹក)</option>
                                            <option value="3">៣ នាទី (ស្តង់ដារ ណែនាំ)</option>
                                            <option value="5">៥ នាទី (សន្សំ Egress ខ្លាំង)</option>
                                            <option value="10">១០ នាទី</option>
                                        </select>
                                    </div>
                                    <div><label class="skm-p2-label">ទាញទិន្នន័យអូតូពេល Cloud មានការកែប្រែ</label>
                                        <select id="skmP2OqCfgRef" class="skm-p2-select">
                                            <option value="false">🔔 ត្រឹមលោតសារដាស់តឿន (សន្សំ Egress)</option>
                                            <option value="true">⚡ ទាញអាប់ដេតអូតូភ្លាមៗ</option>
                                        </select>
                                    </div>
                                    <div><label class="skm-p2-label">បង្ហាញស្លាក Offline នៅជ្រុងក្រោមឆ្វេង</label>
                                        <select id="skmP2OqCfgPill" class="skm-p2-select">
                                            <option value="true">✅ បង្ហាញតែពេលដាច់សេវា ឬមាន Queue</option>
                                            <option value="false">❌ លាក់ជានិច្ច</option>
                                        </select>
                                    </div>
                                </div>
                                <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;">
                                    <button class="skm-p2-btn green" onclick="window.SKMP2Sync.saveCfgForm()">💾 រក្សាទុកការកំណត់</button>
                                    <button class="skm-p2-btn" onclick="window.SKMP2Sync.pingCloudNow()">🔎 ឆែក Cloud updated_at ឥឡូវ (~40B)</button>
                                    <button class="skm-p2-btn amber" onclick="window.SKMP2Sync.clearStaleCacheSafely()">🧹 លាង Cache តម្លៃចាស់ (រក្សា Queue & Login)</button>
                                </div>
                            </div>

                            <!-- TAB 3: SYNC LOGS -->
                            <div id="skmP2OqTab_logs" style="display:none;">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                    <strong>📜 ប្រវត្តិការ Sync ពី Offline Queue</strong>
                                    <button class="skm-p2-btn gray" onclick="window.SKMP2Sync.clearLogs()">🗑️ សម្អាតប្រវត្តិ</button>
                                </div>
                                <div id="skmP2OqLogsBox" style="display:flex;flex-direction:column;gap:7px;max-height:310px;overflow-y:auto;"></div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
            }

            window.SKMP2Sync = {
                open(defaultTab = 'queue') {
                    ensureModal();
                    document.getElementById('skmP2OqModal').classList.add('open');
                    this.tab(defaultTab);
                },
                tab(t) {
                    ['queue', 'cache', 'logs'].forEach(k => {
                        const el = document.getElementById(`skmP2OqTab_${k}`);
                        if (el) el.style.display = (k === t) ? 'block' : 'none';
                    });
                    document.querySelectorAll('#skmP2OqModal .skm-p2-tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-t') === t));
                    this.refreshUi();
                },
                refreshUi() {
                    const q = loadQueue();
                    const meta = loadMeta();
                    const cfg = loadCfg();
                    const online = navigator.onLine;

                    document.getElementById('skmP2OqKpis').innerHTML = `
                        <div class="skm-p2-card" style="border-color:${online ? 'rgba(16,185,129,0.45)' : 'rgba(239,68,68,0.5)'};">
                            <div style="font-size:11px;color:#94a3b8;">🌐 ស្ថានភាពអ៊ីនធឺណិត</div>
                            <div style="font-size:17px;font-weight:900;color:${online ? '#34d399' : '#f87171'};margin-top:3px;">${online ? '🟢 Online (ភ្ជាប់ Cloud)' : '🔴 Offline (កំពុងប្រើ Cache)'}</div>
                        </div>
                        <div class="skm-p2-card" style="border-color:${q.length ? 'rgba(245,158,11,0.5)' : 'rgba(56,189,248,0.35)'};">
                            <div style="font-size:11px;color:#94a3b8;">📋 រង់ចាំ Sync ក្នុង Queue</div>
                            <div style="font-size:20px;font-weight:900;color:${q.length ? '#fbbf24' : '#34d399'};">${q.length} ប្រតិបត្តិការ</div>
                        </div>
                        <div class="skm-p2-card">
                            <div style="font-size:11px;color:#94a3b8;">☁️ Sync ចុងក្រោយ</div>
                            <div style="font-size:13px;font-weight:800;color:#38bdf8;margin-top:4px;">${escHtml(meta.lastFlushAt || meta.lastCheckAt || 'មិនទាន់មាន')}</div>
                            <div style="font-size:10.5px;color:#94a3b8;">TTL Cache៖ រៀងរាល់ ${cfg.ttlMinutes} នាទី</div>
                        </div>
                    `;

                    // Fill Queue Table
                    const tb = document.getElementById('skmP2OqBody');
                    if (tb) {
                        tb.innerHTML = q.length ? q.map((job, idx) => `
                            <tr>
                                <td><b>${escHtml(job.label)}</b><div style="font-size:10.5px;color:#94a3b8;">${escHtml(job.createdAt)}</div></td>
                                <td><code>${escHtml(job.table)}</code></td>
                                <td>${job.attempts || 0} ដង</td>
                                <td style="font-size:11.5px;color:${job.lastError ? '#fca5a5' : '#fcd34d'};">${job.lastError ? escHtml(job.lastError) : '⏳ រង់ចាំបាញ់ឡើង Cloud'}</td>
                                <td><button class="skm-p2-btn red" style="padding:4px 8px;font-size:11px;" onclick="window.SKMP2Sync.dropJob(${idx})">លុប</button></td>
                            </tr>`).join('') : '<tr><td colspan="5" style="text-align:center;color:#34d399;padding:22px;">✅ គ្មានវិក្កយបត្រកកស្ទះក្នុង Queue ទេ — ទិន្នន័យទាំងអស់ត្រូវបាន Sync រួចរាល់!</td></tr>';
                    }

                    // Fill Settings
                    if (document.getElementById('skmP2OqCfgAuto')) {
                        document.getElementById('skmP2OqCfgAuto').value = String(cfg.autoFlushOnline !== false);
                        document.getElementById('skmP2OqCfgTtl').value = String(cfg.ttlMinutes || 3);
                        document.getElementById('skmP2OqCfgRef').value = String(Boolean(cfg.autoRefreshOnCloudUpdate));
                        document.getElementById('skmP2OqCfgPill').value = String(cfg.showFloatingStatusWhenPending !== false);
                    }

                    // Fill Logs
                    const lbox = document.getElementById('skmP2OqLogsBox');
                    if (lbox) {
                        const logs = loadLogs();
                        lbox.innerHTML = logs.length ? logs.map(l => `
                            <div class="skm-p2-card" style="padding:9px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px;">
                                <div><b>${escHtml(l.label)}</b><div style="font-size:10.5px;color:#94a3b8;">🕒 ${escHtml(l.time)} • ${escHtml(l.table)}</div></div>
                                <span style="color:${l.ok ? '#34d399' : '#f87171'};font-weight:800;">${l.ok ? '✅ Sync រួច' : '❌ ' + escHtml(l.err)}</span>
                            </div>`).join('') : '<div style="text-align:center;color:#94a3b8;padding:22px;">មិនទាន់មានប្រវត្តិ Sync ទេ។</div>';
                    }
                },
                enqueue(table, id, payload, label) {
                    enqueueJob(table, id, payload, label);
                },
                flushNow() { flushQueue(true); },
                queueLatestToday() {
                    const today = new Date().toLocaleDateString();
                    const invs = Array.isArray(window.invoices) ? window.invoices : [];
                    const todays = invs.filter(x => x && x.id && (String(x.date || '').includes(today) || (typeof x.timestamp === 'number' && (Date.now() - x.timestamp) < 86400000))).slice(0, 30);
                    if (!todays.length) return showPack2Toast('ℹ️ គ្មានវិក្កយបត្រថ្ងៃនេះសម្រាប់ផ្ទៀងផ្ទាត់ទេ!');
                    todays.forEach(inv => enqueueJob('pos_orders', inv.id, mapInvoiceToRow(inv), `🧾 វិក្កយបត្រ ${inv.id} ($${Number(inv.totalAmount ?? inv.total ?? 0).toFixed(2)})`));
                    this.refreshUi();
                    showPack2Toast(`📥 បានបញ្ចូលវិក្កយបត្រថ្ងៃនេះ (${todays.length} ប័ណ្ណ) ចូល Queue — ចុច "បាញ់ Sync ឥឡូវ" ដើម្បីធានាឡើង Cloud ១០០%!`);
                },
                dropJob(idx) {
                    const q = loadQueue();
                    q.splice(idx, 1);
                    saveQueue(q);
                    this.refreshUi();
                },
                exportQueueJson() {
                    const q = loadQueue();
                    const blob = new Blob([JSON.stringify({ branch: getBranchId(), exportedAt: new Date().toISOString(), queue: q }, null, 2)], { type: 'application/json' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `SKM_OfflineQueue_${getBranchId()}.json`; a.click();
                },
                saveCfgForm() {
                    saveCfg({
                        autoFlushOnline: document.getElementById('skmP2OqCfgAuto').value === 'true',
                        ttlMinutes: Number(document.getElementById('skmP2OqCfgTtl').value || 3),
                        autoRefreshOnCloudUpdate: document.getElementById('skmP2OqCfgRef').value === 'true',
                        showFloatingStatusWhenPending: document.getElementById('skmP2OqCfgPill').value === 'true'
                    });
                    updateFloatingBadge();
                    showPack2Toast('✅ រក្សាទុកការកំណត់ Offline Queue & TTL Cache ជោគជ័យ!');
                },
                pingCloudNow() { checkCloudFreshness(true); },
                clearStaleCacheSafely() {
                    const meta = loadMeta();
                    meta.remoteUpdatedAt = '';
                    saveMeta(meta);
                    showPack2Toast('🧹 បានសម្អាតត្រា Cache ចាស់រួចរាល់ (រក្សា Queue និងគណនី Login ទាំងអស់)! កំពុងផ្ទុកទិន្នន័យថ្មី...');
                    setTimeout(() => location.reload(), 700);
                },
                clearLogs() {
                    localStorage.removeItem(getLogKey());
                    this.refreshUi();
                }
            };

            registerInPosToolbox('🔄', 'Offline Queue & Smart Cache', () => window.SKMP2Sync.open('queue'));
    });
})();
