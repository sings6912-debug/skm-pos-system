/**
 * ============================================================================
 * SKM INTEGRATE POS - PLUGINS BUNDLE PACK 3 v2.0 (6 Enterprise Modules — Payroll + Member Pass/Booking + Rental Billing • Admin Tab 9 Controlled)
 * File: all_pos_plugins_3.js (Root Folder — alongside all_pos_plugins.js & all_pos_plugins_2.js)
 * Hosted on GitHub Pages (0 Bytes Supabase Egress/Storage)
 *
 * Included Modules (Per-Branch Toggleable + 1-Click Industry Presets):
 *   [1/6] 📱 លេខ Serial / IMEI & ធានាទំនិញ (Serial / IMEI & Warranty Pro)
 *   [2/6] 🚢 ថ្លៃដើមនាំចូល & មធ្យមភាគ (Landed Cost & Moving Average Stock-In)
 *   [3/6] 🤝 ទំនិញផ្ញើលក់ (Consignment Management Pro — In & Out)
 *   [4/6] 💵 បើកប្រាក់ខែបុគ្គលិក Pro (Payroll Auto-Calc + Payslip + Telegram)
 *   [5/6] 🏋️ កាតសមាជិក & កក់ម៉ោង (Member Pass QR Check-in & Court/Spa Booking)
 *   [6/6] 🏠 គ្រប់គ្រងផ្ទះជួល / បន្ទប់ជួល (Rental & Utility Meter Billing + KHQR)
 *   [HUB] 🎛️ ផ្ទាំងបិទ/បើកមុខងារ Pro ទាំងអស់ (Unified Pack 2 & Pack 3 Control Center + Industry Presets)
 * ============================================================================
 */

(function () {
    'use strict';
    if (window.__SKM_POS_PLUGINS_3_READY__) return;
    window.__SKM_POS_PLUGINS_3_READY__ = true;

    function getBranchId() {
        try {
            return (window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || localStorage.getItem('skm_last_branch') || 'branch_1').trim();
        } catch (e) {
            return 'branch_1';
        }
    }

    function escHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function showPack3Toast(msg, isErr) {
        if (typeof window.showToast === 'function') {
            window.showToast(msg, Boolean(isErr));
            return;
        }
        const t = document.createElement('div');
        t.textContent = msg;
        t.style.cssText = `position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:999999;padding:10px 20px;border-radius:999px;font-weight:800;font-size:13px;font-family:'Battambang',sans-serif;color:#fff;background:${isErr ? '#ef4444' : '#10b981'};box-shadow:0 10px 28px rgba(0,0,0,0.35);`;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3200);
    }

    function getTelegramCreds() {
        const br = getBranchId();
        let sys = window.sysSettings || {};
        try {
            sys = Object.assign({}, JSON.parse(localStorage.getItem(`ks2_${br}_sys_settings`) || '{}'), sys);
        } catch (e) {}
        const lsTok = localStorage.getItem(`ks2_${br}_telegram_bot_token`) || '';
        const lsCid = localStorage.getItem(`ks2_${br}_telegram_chat_id`) || '';
        const token = (window.botToken || window.telegramBotToken || window.orderBotToken || sys.orderTelegramBotToken || sys.telegramBotToken || sys.tgBotToken || sys.telegramToken || lsTok || '').trim();
        const chatId = (window.chatId || window.telegramChatId || window.orderChatId || sys.orderTelegramChatId || sys.telegramChatId || sys.tgChatId || lsCid || '').trim();
        return { token, chatId };
    }

    async function sendTgMsg(htmlText) {
        const { token, chatId } = getTelegramCreds();
        if (!token || !chatId) return { ok: false, reason: 'no_creds' };
        try {
            const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: htmlText, parse_mode: 'HTML', disable_web_page_preview: true })
            });
            const data = await resp.json().catch(() => ({}));
            return { ok: Boolean(resp.ok && data.ok !== false), reason: data.description || '' };
        } catch (e) {
            return { ok: false, reason: e.message || 'network_error' };
        }
    }

    function getInvList() {
        if (Array.isArray(window.inventory) && window.inventory.length) return window.inventory;
        try { return JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_inv_pro`) || '[]'); } catch (e) { return []; }
    }

    function registerInPosToolbox(icon, title, fn) {
        const timer = setInterval(() => {
            if (typeof window.registerCustomTool === 'function') {
                window.registerCustomTool(icon, title, fn, null);
                clearInterval(timer);
            }
        }, 420);
        setTimeout(() => clearInterval(timer), 16000);
    }

    function injectPack3Styles() {
        if (document.getElementById('skmPosPack3Styles')) return;
        const st = document.createElement('style');
        st.id = 'skmPosPack3Styles';
        st.textContent = `
            .skm-p3-overlay { display:none; position:fixed; inset:0; z-index:100030; background:rgba(2,6,23,0.76); backdrop-filter:blur(6px); justify-content:center; align-items:center; padding:14px; font-family:'Battambang','Nunito',sans-serif; }
            .skm-p3-overlay.open { display:flex; }
            .skm-p3-box { background:#0f172a; color:#f8fafc; width:100%; max-width:980px; max-height:92vh; border-radius:20px; border:1px solid rgba(99,102,241,0.38); box-shadow:0 28px 65px rgba(0,0,0,0.58); display:flex; flex-direction:column; overflow:hidden; }
            .skm-p3-head { padding:14px 20px; background:linear-gradient(135deg,#0f172a,#1e1b4b); border-bottom:1px solid rgba(148,163,184,0.22); display:flex; justify-content:space-between; align-items:center; gap:10px; }
            .skm-p3-tabs { display:flex; gap:6px; padding:10px 18px; background:#1e293b; border-bottom:1px solid rgba(148,163,184,0.16); flex-wrap:wrap; }
            .skm-p3-tab { border:1px solid rgba(148,163,184,0.25); background:rgba(15,23,42,0.75); color:#cbd5e1; padding:7px 13px; border-radius:10px; font-size:12.5px; font-weight:700; cursor:pointer; font-family:inherit; }
            .skm-p3-tab.active { background:linear-gradient(135deg,#6366f1,#0ea5e9); color:#fff; border-color:transparent; }
            .skm-p3-body { padding:16px 20px; overflow-y:auto; flex:1; }
            .skm-p3-card { background:#1e293b; border:1px solid rgba(148,163,184,0.2); border-radius:14px; padding:14px; min-width:0; box-sizing:border-box; }
            .skm-p3-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(195px,1fr)); gap:10px; }
            .skm-p3-2col { display:grid; grid-template-columns:minmax(0,1.1fr) minmax(0,1fr); gap:14px; }
            @media (max-width:760px) { .skm-p3-2col { grid-template-columns:1fr; } }
            .skm-p3-input, .skm-p3-select, .skm-p3-textarea { width:100%; padding:8px 11px; border-radius:10px; border:1px solid rgba(148,163,184,0.3); background:#0f172a; color:#fff; font-size:13px; outline:none; font-family:inherit; box-sizing:border-box; }
            .skm-p3-label { display:block; font-size:11.5px; color:#cbd5e1; margin-bottom:4px; font-weight:700; }
            .skm-p3-btn { border:none; border-radius:10px; padding:8px 14px; font-size:12.5px; font-weight:800; cursor:pointer; color:#fff; background:#6366f1; font-family:inherit; display:inline-flex; align-items:center; justify-content:center; gap:5px; }
            .skm-p3-btn.green { background:#10b981; }
            .skm-p3-btn.blue { background:#0284c7; }
            .skm-p3-btn.amber { background:#f59e0b; }
            .skm-p3-btn.red { background:#ef4444; }
            .skm-p3-btn.gray { background:#334155; }
            .skm-p3-btn.tg { background:#0088cc; }
            .skm-p3-table { width:100%; border-collapse:collapse; font-size:12.5px; margin-top:8px; }
            .skm-p3-table th, .skm-p3-table td { padding:8px 9px; border-bottom:1px solid rgba(148,163,184,0.16); text-align:left; }
            .skm-p3-table th { background:#1e293b; color:#a5b4fc; position:sticky; top:0; }
            .skm-p3-preset { border:1px solid rgba(99,102,241,0.45); background:rgba(99,102,241,0.14); color:#e0e7ff; padding:6px 11px; border-radius:10px; font-size:12px; font-weight:800; cursor:pointer; font-family:inherit; }
            .skm-p3-preset:hover { background:rgba(99,102,241,0.32); }
            .skm-p3-badge { padding:2px 8px; border-radius:999px; font-size:11px; font-weight:800; display:inline-block; white-space:nowrap; }
        `;
        document.head.appendChild(st);
    }

    // ========================================================================
    // UNIFIED TOGGLE ENGINE (Controls Pack 2 [8 modules] + Pack 3 [3 modules])
    // ========================================================================
    const PACK2_DEFAULTS = {
        attendancePro: true,
        stickerPro: true,
        powerShareHub: true,
        multiUnitWholesale: true,
        dualReceiptBarcode: true,
        stockHealthAnalytics: true,
        autoLowStockAlert: true,
        offlineSyncQueue: true
    };
    const PACK3_DEFAULTS = {
        serialWarranty: true,
        landedAvgCost: true,
        consignmentPro: true,
        payrollPro: true,
        memberPassBooking: true,
        rentalBilling: true
    };

    const getPack2Key = () => `ks2_${getBranchId()}_pos2_enabled`;
    const getPack3Key = () => `ks2_${getBranchId()}_pos3_enabled`;

    function getPack2State() {
        let st = Object.assign({}, PACK2_DEFAULTS);
        try {
            const sys = window.sysSettings || JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_sys_settings`) || '{}');
            if (sys && sys.pos2Enabled) st = Object.assign(st, sys.pos2Enabled);
            const raw = localStorage.getItem(getPack2Key());
            if (raw) st = Object.assign(st, JSON.parse(raw));
        } catch (e) {}
        return st;
    }

    function getPack3State() {
        let st = Object.assign({}, PACK3_DEFAULTS);
        try {
            const raw = localStorage.getItem(getPack3Key());
            if (raw) st = Object.assign(st, JSON.parse(raw));
            const localSys = JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_sys_settings`) || '{}');
            const sys = Object.assign({}, localSys, window.sysSettings || {});
            if (sys && sys.pos3Enabled && typeof sys.pos3Enabled === 'object') {
                st = Object.assign(st, sys.pos3Enabled);
            }
        } catch (e) {}
        return st;
    }

    async function saveUnifiedStates(nextP2, nextP3) {
        const br = getBranchId();
        localStorage.setItem(getPack2Key(), JSON.stringify(nextP2));
        localStorage.setItem(getPack3Key(), JSON.stringify(nextP3));
        try {
            const sysKey = `ks2_${br}_sys_settings`;
            const sys = Object.assign({}, window.sysSettings || JSON.parse(localStorage.getItem(sysKey) || '{}'));
            sys.pos2Enabled = nextP2;
            sys.pos3Enabled = nextP3;
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

    const INDUSTRY_PRESETS = {
        fnb: {
            name: '🍜 ហាងមីហឹរ / កាហ្វេ / ភោជនីយដ្ឋាន',
            p2: { attendancePro: true, stickerPro: true, powerShareHub: true, multiUnitWholesale: false, dualReceiptBarcode: false, stockHealthAnalytics: false, autoLowStockAlert: true, offlineSyncQueue: true },
            p3: { serialWarranty: false, landedAvgCost: false, consignmentPro: false }
        },
        pharmacy: {
            name: '💊 ឱសថស្ថាន',
            p2: { attendancePro: true, stickerPro: true, powerShareHub: false, multiUnitWholesale: true, dualReceiptBarcode: true, stockHealthAnalytics: true, autoLowStockAlert: true, offlineSyncQueue: true },
            p3: { serialWarranty: false, landedAvgCost: true, consignmentPro: false }
        },
        cosmetics: {
            name: '💄 ស្គីនខែ / ម៉ាត / លក់ដុំ',
            p2: { attendancePro: true, stickerPro: true, powerShareHub: true, multiUnitWholesale: true, dualReceiptBarcode: true, stockHealthAnalytics: true, autoLowStockAlert: true, offlineSyncQueue: true },
            p3: { serialWarranty: false, landedAvgCost: true, consignmentPro: true }
        },
        electronics: {
            name: '📱 ហាងទូរស័ព្ទ / កុំព្យូទ័រ / អេឡិចត្រូនិច',
            p2: { attendancePro: true, stickerPro: true, powerShareHub: true, multiUnitWholesale: false, dualReceiptBarcode: true, stockHealthAnalytics: true, autoLowStockAlert: true, offlineSyncQueue: true },
            p3: { serialWarranty: true, landedAvgCost: true, consignmentPro: false }
        },
        importer: {
            name: '🚢 ដេប៉ូនាំចូល / ផ្ញើលក់',
            p2: { attendancePro: true, stickerPro: true, powerShareHub: false, multiUnitWholesale: true, dualReceiptBarcode: true, stockHealthAnalytics: true, autoLowStockAlert: true, offlineSyncQueue: true },
            p3: { serialWarranty: true, landedAvgCost: true, consignmentPro: true }
        },
        all_on: {
            name: '👑 បើកទាំងអស់ (១១ មុខងារ)',
            p2: Object.assign({}, PACK2_DEFAULTS),
            p3: Object.assign({}, PACK3_DEFAULTS)
        },
        basic_280: {
            name: '🔒 ឈុតគោល $280 (បិទមុខងារបន្ថែមទាំងអស់)',
            p2: { attendancePro: false, stickerPro: false, powerShareHub: false, multiUnitWholesale: false, dualReceiptBarcode: false, stockHealthAnalytics: false, autoLowStockAlert: false, offlineSyncQueue: true },
            p3: { serialWarranty: false, landedAvgCost: false, consignmentPro: false }
        }
    };

    const MODULE_META_P2 = [
        ['attendancePro', '🕒 វត្តមានបុគ្គលិក Pro (QR + GPS + Telegram)'],
        ['stickerPro', '🏷️ ស្ទីកគ័របាកូដទំនិញ & កែវកាហ្វេ (Code-128/39)'],
        ['powerShareHub', '🔗 ចែករំលែកម៉ឺនុយ & ទំនិញ (Power QR)'],
        ['multiUnitWholesale', '📦 លក់ច្រើនឯកតា & លក់ដុំថែម (Multi-Unit)'],
        ['dualReceiptBarcode', '🧾 ព្រីន ២ សន្លឹក & បាកូដវិក្កយបត្រ (Dual Receipt)'],
        ['stockHealthAnalytics', '📊 វិភាគទំនិញលក់ដាច់ & កប់ស្តុក (Dead Stock)'],
        ['autoLowStockAlert', '🚨 ដាស់តឿនស្តុកជិតអស់អូតូ (Telegram Alert)'],
        ['offlineSyncQueue', '🔄 Offline Order Queue & Smart TTL Cache']
    ];

    const MODULE_META_P3 = [
        ['serialWarranty', '📱 លេខ Serial / IMEI & ធានាទំនិញ (Warranty Pro)'],
        ['landedAvgCost', '🚢 ថ្លៃដើមនាំចូល & មធ្យមភាគ (Landed & Avg Cost)'],
        ['consignmentPro', '🤝 គ្រប់គ្រងទំនិញផ្ញើលក់ (Consignment In/Out)'],
        ['payrollPro', '💵 ប្រព័ន្ធបើកប្រាក់ខែបុគ្គលិក (Payroll Auto-Calc)'],
        ['memberPassBooking', '🏋️ កាតសមាជិក & កក់ម៉ោង (Gym / Spa / តារាង)'],
        ['rentalBilling', '🏠 គ្រប់គ្រងផ្ទះជួល / បន្ទប់ជួល (Rental Billing)']
    ];

    window.SKM_POS_PACK3 = {
        getState: getPack3State,
        openControlCenter() {
            injectPack3Styles();
            let m = document.getElementById('skmP3ControlModal');
            if (!m) {
                m = document.createElement('div');
                m.id = 'skmP3ControlModal';
                m.className = 'skm-p3-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p3-box" style="max-width:740px;">
                        <div class="skm-p3-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#a5b4fc;">🎛️ មជ្ឈមណ្ឌលបិទ/បើកមុខងារ Pro (Pack 2 & Pack 3)</div>
                                <div style="font-size:11.5px;color:#94a3b8;">បិទ/បើកមុខងារតាមប្រភេទហាងសម្រាប់សាខា <b style="color:#38bdf8;" id="skmP3CcBranch"></b> (Sync ឡើង Cloud គ្រប់ឧបករណ៍)</div>
                            </div>
                            <button class="skm-p3-btn red" onclick="document.getElementById('skmP3ControlModal').classList.remove('open')">✕ បិទ</button>
                        </div>
                        <div class="skm-p3-body" style="display:flex;flex-direction:column;gap:14px;">
                            <div class="skm-p3-card">
                                <div style="font-size:12.5px;font-weight:800;color:#fbbf24;margin-bottom:8px;">⚡ រើសគំរូមុខរបរ ១ ចុច (1-Click Industry Presets)៖</div>
                                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                                    ${Object.keys(INDUSTRY_PRESETS).map(k => `<button type="button" class="skm-p3-preset" onclick="window.SKM_POS_PACK3.applyPreset('${k}')">${INDUSTRY_PRESETS[k].name}</button>`).join('')}
                                </div>
                            </div>
                            <div class="skm-p3-2col">
                                <div class="skm-p3-card">
                                    <div style="font-size:13px;font-weight:900;color:#38bdf8;margin-bottom:8px;">📦 Pack 2 — មុខងារលក់ & ប្រតិបត្តិការ (៨ មុខ)</div>
                                    <div style="display:flex;flex-direction:column;gap:7px;">
                                        ${MODULE_META_P2.map(([k, lbl]) => `
                                            <label style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:7px 9px;border-radius:10px;background:#0f172a;border:1px solid rgba(148,163,184,0.18);cursor:pointer;font-size:12px;">
                                                <span>${lbl}</span>
                                                <input type="checkbox" data-pack="p2" data-key="${k}" style="width:18px;height:18px;accent-color:#10b981;flex-shrink:0;">
                                            </label>`).join('')}
                                    </div>
                                </div>
                                <div class="skm-p3-card">
                                    <div style="font-size:13px;font-weight:900;color:#a5b4fc;margin-bottom:8px;">🏢 Pack 3 — មុខងារជំនាញ & នាំចូល (៣ មុខ)</div>
                                    <div style="display:flex;flex-direction:column;gap:7px;">
                                        ${MODULE_META_P3.map(([k, lbl]) => `
                                            <label style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:7px 9px;border-radius:10px;background:#0f172a;border:1px solid rgba(148,163,184,0.18);cursor:pointer;font-size:12px;">
                                                <span>${lbl}</span>
                                                <input type="checkbox" data-pack="p3" data-key="${k}" style="width:18px;height:18px;accent-color:#6366f1;flex-shrink:0;">
                                            </label>`).join('')}
                                    </div>
                                    <div style="margin-top:12px;padding:10px;border-radius:10px;background:rgba(16,185,129,0.1);border:1px dashed rgba(16,185,129,0.4);font-size:11.5px;color:#6ee7b7;line-height:1.5;">
                                        💡 <b>គន្លឹះលក់៖</b> ពេលភ្ញៀវទិញឈុតគោល $280 ចុច <b>🔒 ឈុតគោល $280</b> ដើម្បីលាក់មុខងារបន្ថែម។ ពេលភ្ញៀវទិញថែមមុខងារណា គ្រាន់តែធីកបើក ហើយចុចរក្សាទុក!
                                    </div>
                                </div>
                            </div>
                            <button type="button" class="skm-p3-btn green" style="width:100%;padding:12px;font-size:14px;" onclick="window.SKM_POS_PACK3.saveControlCenter()">💾 រក្សាទុកការកំណត់ & អាប់ដេតផ្ទាំង POS</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
            }
            const p2 = getPack2State();
            const p3 = getPack3State();
            document.getElementById('skmP3CcBranch').textContent = getBranchId();
            m.querySelectorAll('input[data-pack="p2"]').forEach(chk => {
                chk.checked = p2[chk.getAttribute('data-key')] !== false;
            });
            m.querySelectorAll('input[data-pack="p3"]').forEach(chk => {
                chk.checked = p3[chk.getAttribute('data-key')] !== false;
            });
            m.classList.add('open');
        },
        applyPreset(key) {
            const preset = INDUSTRY_PRESETS[key];
            const m = document.getElementById('skmP3ControlModal');
            if (!preset || !m) return;
            m.querySelectorAll('input[data-pack="p2"]').forEach(chk => {
                chk.checked = Boolean(preset.p2[chk.getAttribute('data-key')]);
            });
            m.querySelectorAll('input[data-pack="p3"]').forEach(chk => {
                chk.checked = Boolean(preset.p3[chk.getAttribute('data-key')]);
            });
            showPack3Toast(`⚡ បានជ្រើសគំរូ៖ ${preset.name} — សូមចុច "រក្សាទុក"!`);
        },
        async saveControlCenter() {
            const m = document.getElementById('skmP3ControlModal');
            if (!m) return;
            const nextP2 = {};
            const nextP3 = {};
            m.querySelectorAll('input[data-pack="p2"]').forEach(chk => { nextP2[chk.getAttribute('data-key')] = chk.checked; });
            m.querySelectorAll('input[data-pack="p3"]').forEach(chk => { nextP3[chk.getAttribute('data-key')] = chk.checked; });
            await saveUnifiedStates(nextP2, nextP3);
            showPack3Toast('✅ បានរក្សាទុកមុខងារសាខាជោគជ័យ! កំពុងអាប់ដេតផ្ទាំង...');
            setTimeout(() => location.reload(), 650);
        }
    };

    // Toggle Control Center is managed strictly inside admin_settings.html (hidden from POS client Toolbox)

    const PACK3_TOOL_TITLES = {
        serialWarranty: 'លេខ Serial / IMEI & ធានាទំនិញ',
        landedAvgCost: 'ថ្លៃដើមនាំចូល & មធ្យមភាគ (Landed Cost)',
        consignmentPro: 'គ្រប់គ្រងទំនិញផ្ញើលក់ (Consignment)',
        payrollPro: 'ប្រព័ន្ធបើកប្រាក់ខែបុគ្គលិក (Payroll)',
        memberPassBooking: 'កាតសមាជិក & កក់ម៉ោង (Gym/Spa/តារាង)',
        rentalBilling: 'គ្រប់គ្រងផ្ទះជួល / បន្ទប់ជួល (Rental)'
    };

    function syncPack3ToolboxVisibility() {
        const st = getPack3State();
        try { localStorage.setItem(getPack3Key(), JSON.stringify(st)); } catch (e) {}
        const body = document.getElementById('skmToolboxMenuBody');
        if (!body) return;
        const disabledTitles = new Set(
            Object.keys(PACK3_TOOL_TITLES).filter(k => st[k] === false).map(k => PACK3_TOOL_TITLES[k])
        );
        body.querySelectorAll('.skm-tool-wrapper').forEach(w => {
            const label = w.querySelector('.skm-tool-item span')?.textContent?.trim() || '';
            if (disabledTitles.has(label)) w.style.setProperty('display', 'none', 'important');
        });
    }
    setTimeout(syncPack3ToolboxVisibility, 2800);
    setTimeout(syncPack3ToolboxVisibility, 6800);
    if (typeof window.skmApplyActivePlugins === 'function' && !window.skmApplyActivePlugins.__skmP3Wrapped) {
        const _origApplyP3 = window.skmApplyActivePlugins;
        window.skmApplyActivePlugins = function () {
            const r = _origApplyP3.apply(this, arguments);
            setTimeout(syncPack3ToolboxVisibility, 100);
            return r;
        };
        window.skmApplyActivePlugins.__skmP3Wrapped = true;
    }

    const pack3State = getPack3State();

    // Helper: save branch-scoped Pack 3 dataset locally + sync to Supabase branch_store.sys_settings[key]
    function loadP3Data(localSuffix, cloudField, fallback) {
        const key = `ks2_${getBranchId()}_${localSuffix}`;
        try {
            const raw = localStorage.getItem(key);
            if (raw) return JSON.parse(raw);
            const sys = window.sysSettings || JSON.parse(localStorage.getItem(`ks2_${getBranchId()}_sys_settings`) || '{}');
            if (sys && sys[cloudField]) return sys[cloudField];
        } catch (e) {}
        return fallback;
    }

    // Ultra-Low-Egress: Keep Serial/Landed/Consignment logs local (0 Bytes Supabase Egress; never bloats branch_store for menu.html guests!)
    async function saveP3Data(localSuffix, cloudField, value) {
        const br = getBranchId();
        try {
            localStorage.setItem(`ks2_${br}_${localSuffix}`, JSON.stringify(value));
        } catch (e) {}
    }

    // ========================================================================
    // [1/3] 📱 លេខ Serial / IMEI & ធានាទំនិញ (Serial / IMEI & Warranty Pro)
    // សម្រាប់ហាងទូរស័ព្ទ, កុំព្យូទ័រ, អេឡិចត្រូនិច, គ្រឿងបន្លាស់ និងម៉ាស៊ីនប្រើប្រាស់
    // ========================================================================
    if (pack3State.serialWarranty !== false) {
        (function initSerialWarrantyPlugin() {
            const loadSerials = () => loadP3Data('p3_serials', 'p3SerialRecords', []);
            const saveSerials = (arr) => saveP3Data('p3_serials', 'p3SerialRecords', arr.slice(0, 1500));

            function addMonthsIso(startDateStr, months) {
                const d = startDateStr ? new Date(startDateStr) : new Date();
                if (isNaN(d.getTime())) return '';
                d.setMonth(d.getMonth() + Number(months || 0));
                return d.toISOString().slice(0, 10);
            }

            function daysRemaining(expDateStr) {
                if (!expDateStr) return null;
                const diff = Math.ceil((new Date(expDateStr).getTime() - Date.now()) / 86400000);
                return isNaN(diff) ? null : diff;
            }

            function ensureModal() {
                if (document.getElementById('skmP3SerialModal')) return;
                injectPack3Styles();
                const m = document.createElement('div');
                m.id = 'skmP3SerialModal';
                m.className = 'skm-p3-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p3-box">
                        <div class="skm-p3-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#38bdf8;">📱 លេខ Serial / IMEI & ការធានាទំនិញ (Warranty Pro)</div>
                                <div style="font-size:11.5px;color:#94a3b8;">កត់ត្រាលេខ IMEI/Serial • ស្កេនឆែកថ្ងៃផុតធានា • ព្រីនប័ណ្ណធានា • កត់ត្រាជួសជុល</div>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <button class="skm-p3-btn red" onclick="document.getElementById('skmP3SerialModal').classList.remove('open')">✕ បិទ</button>
                            </div>
                        </div>
                        <div class="skm-p3-tabs">
                            <button class="skm-p3-tab active" data-t="check" onclick="window.SKMP3Serial.tab('check')">🔍 ស្កេនឆែកធានា (Lookup)</button>
                            <button class="skm-p3-tab" data-t="add" onclick="window.SKMP3Serial.tab('add')">➕ ចុះបញ្ជីលក់ / ចូលស្តុក IMEI</button>
                            <button class="skm-p3-tab" data-t="list" onclick="window.SKMP3Serial.tab('list')">📋 បញ្ជី Serial ទាំងអស់</button>
                        </div>
                        <div class="skm-p3-body">
                            <!-- TAB 1: WARRANTY LOOKUP -->
                            <div id="skmP3SerTab_check">
                                <div class="skm-p3-card" style="margin-bottom:12px;">
                                    <label class="skm-p3-label">🔍 បាញ់បាកូដ ឬវាយលេខ Serial / IMEI / លេខទូរស័ព្ទភ្ញៀវ ដើម្បីឆែកការធានាភ្លាមៗ៖</label>
                                    <div style="display:flex;gap:8px;">
                                        <input id="skmP3SerLookupInp" class="skm-p3-input" placeholder="ឧ. 358912098765432 ឬ 012345678..." onkeydown="if(event.key==='Enter') window.SKMP3Serial.lookup()">
                                        <button class="skm-p3-btn green" onclick="window.SKMP3Serial.lookup()">ឆែកធានា</button>
                                    </div>
                                </div>
                                <div id="skmP3SerLookupRes"></div>
                            </div>

                            <!-- TAB 2: ADD / REGISTER SERIAL -->
                            <div id="skmP3SerTab_add" style="display:none;">
                                <div class="skm-p3-card">
                                    <div class="skm-p3-grid" style="margin-bottom:10px;">
                                        <div>
                                            <label class="skm-p3-label">ជ្រើសទំនិញពីស្តុក POS (ឬវាយថ្មី)</label>
                                            <select id="skmP3SerProdSel" class="skm-p3-select" onchange="window.SKMP3Serial.onProdPick(this.value)"></select>
                                        </div>
                                        <div>
                                            <label class="skm-p3-label">ឈ្មោះទំនិញ / ម៉ូដែល *</label>
                                            <input id="skmP3SerProdName" class="skm-p3-input" placeholder="ឧ. iPhone 16 Pro Max 256GB">
                                        </div>
                                        <div>
                                            <label class="skm-p3-label">ស្ថានភាព</label>
                                            <select id="skmP3SerStatus" class="skm-p3-select">
                                                <option value="sold">✅ លក់ចេញហើយ (ចាប់ផ្តើមគិតធានា)</option>
                                                <option value="in_stock">📦 នៅក្នុងស្តុក (មិនទាន់លក់)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="skm-p3-label">រយៈពេលធានា (ខែ)</label>
                                            <select id="skmP3SerMonths" class="skm-p3-select">
                                                <option value="1">១ ខែ</option>
                                                <option value="3">៣ ខែ</option>
                                                <option value="6">៦ ខែ</option>
                                                <option value="12" selected>១២ ខែ (១ ឆ្នាំ)</option>
                                                <option value="24">២៤ ខែ (២ ឆ្នាំ)</option>
                                                <option value="0">គ្មានធានា</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="skm-p3-label">ឈ្មោះអតិថិជន</label>
                                            <input id="skmP3SerCust" class="skm-p3-input" placeholder="ឈ្មោះភ្ញៀវ">
                                        </div>
                                        <div>
                                            <label class="skm-p3-label">លេខទូរស័ព្ទអតិថិជន</label>
                                            <input id="skmP3SerPhone" class="skm-p3-input" placeholder="012 345 678">
                                        </div>
                                        <div>
                                            <label class="skm-p3-label">លេខវិក្កយបត្រ (Invoice #)</label>
                                            <input id="skmP3SerInv" class="skm-p3-input" placeholder="INV-...">
                                        </div>
                                        <div>
                                            <label class="skm-p3-label">ថ្ងៃលក់ / ថ្ងៃចាប់ផ្តើមធានា</label>
                                            <input type="date" id="skmP3SerDate" class="skm-p3-input">
                                        </div>
                                    </div>
                                    <div style="margin-bottom:10px;">
                                        <label class="skm-p3-label">លេខ Serial / IMEI * (អាចស្កេនច្រើនគ្រឿង ១ បន្ទាត់ ១ លេខ)</label>
                                        <textarea id="skmP3SerCodes" rows="3" class="skm-p3-textarea" placeholder="បាញ់បាកូដ ឬវាយលេខ Serial / IMEI នៅទីនេះ..."></textarea>
                                    </div>
                                    <div style="margin-bottom:12px;">
                                        <label class="skm-p3-label">លក្ខខណ្ឌធានា / ចំណាំ (ឧ. មិនធានាបែកអេក្រង់ ឬចូលទឹក)</label>
                                        <input id="skmP3SerNote" class="skm-p3-input" value="ធានាម៉ាស៊ីន មិនធានាបែកបាក់ ឆេះ ឬចូលទឹក">
                                    </div>
                                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                                        <button class="skm-p3-btn green" style="flex:1;" onclick="window.SKMP3Serial.saveNew(false)">💾 រក្សាទុក Serial / IMEI</button>
                                        <button class="skm-p3-btn blue" style="flex:1;" onclick="window.SKMP3Serial.saveNew(true)">🖨️ រក្សាទុក & ព្រីនប័ណ្ណធានា</button>
                                    </div>
                                </div>
                            </div>

                            <!-- TAB 3: ALL SERIALS -->
                            <div id="skmP3SerTab_list" style="display:none;">
                                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
                                    <input id="skmP3SerListFilter" class="skm-p3-input" style="flex:1;min-width:190px;" placeholder="🔍 ស្វែងរកលេខ Serial, ម៉ូដែល ឬឈ្មោះភ្ញៀវ..." oninput="window.SKMP3Serial.renderList()">
                                    <select id="skmP3SerStatusFilter" class="skm-p3-select" style="width:auto;" onchange="window.SKMP3Serial.renderList()">
                                        <option value="all">ទាំងអស់</option>
                                        <option value="in_stock">📦 នៅក្នុងស្តុក</option>
                                        <option value="sold">✅ លក់រួច (កំពុងធានា)</option>
                                        <option value="expired">⌛ ផុតធានា</option>
                                    </select>
                                    <button class="skm-p3-btn gray" onclick="window.SKMP3Serial.exportCsv()">📥 CSV</button>
                                </div>
                                <div style="overflow-x:auto;max-height:340px;">
                                    <table class="skm-p3-table">
                                        <thead><tr><th>Serial / IMEI</th><th>ទំនិញ</th><th>ភ្ញៀវ</th><th>ថ្ងៃផុតធានា</th><th>ស្ថានភាព</th><th>សកម្មភាព</th></tr></thead>
                                        <tbody id="skmP3SerListBody"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
            }

            function renderStatusBadge(rec) {
                if (rec.status === 'in_stock') return '<span class="skm-p3-badge" style="background:rgba(56,189,248,0.2);color:#38bdf8;">📦 ក្នុងស្តុក</span>';
                const left = daysRemaining(rec.warrantyExpiry);
                if (left === null || Number(rec.warrantyMonths || 0) === 0) return '<span class="skm-p3-badge" style="background:rgba(148,163,184,0.2);color:#cbd5e1;">គ្មានធានា</span>';
                if (left < 0) return `<span class="skm-p3-badge" style="background:rgba(239,68,68,0.22);color:#fca5a5;">⌛ ផុតធានា (${Math.abs(left)}ថ្ងៃ)</span>`;
                if (left <= 30) return `<span class="skm-p3-badge" style="background:rgba(245,158,11,0.22);color:#fcd34d;">⚠️ សល់ ${left} ថ្ងៃ</span>`;
                return `<span class="skm-p3-badge" style="background:rgba(16,185,129,0.22);color:#34d399;">✅ នៅធានា (${left} ថ្ងៃ)</span>`;
            }

            window.SKMP3Serial = {
                open(defaultTab = 'check') {
                    ensureModal();
                    const inv = getInvList().filter(p => p && p.name);
                    const sel = document.getElementById('skmP3SerProdSel');
                    sel.innerHTML = '<option value="">-- ជ្រើសរើសទំនិញពីស្តុក --</option>' +
                        inv.slice(0, 200).map(p => `<option value="${escHtml(p.name)}">${escHtml(p.name)} ($${Number(p.price||0).toFixed(2)})</option>`).join('');
                    document.getElementById('skmP3SerDate').value = new Date().toISOString().slice(0, 10);
                    const invs = Array.isArray(window.invoices) ? window.invoices : [];
                    if (invs.length && !document.getElementById('skmP3SerInv').value) {
                        document.getElementById('skmP3SerInv').value = invs[0].id || '';
                    }
                    document.getElementById('skmP3SerialModal').classList.add('open');
                    this.tab(defaultTab);
                },
                tab(t) {
                    ['check', 'add', 'list'].forEach(k => {
                        const el = document.getElementById(`skmP3SerTab_${k}`);
                        if (el) el.style.display = (k === t) ? 'block' : 'none';
                    });
                    document.querySelectorAll('#skmP3SerialModal .skm-p3-tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-t') === t));
                    if (t === 'check') setTimeout(() => document.getElementById('skmP3SerLookupInp')?.focus(), 60);
                    if (t === 'list') this.renderList();
                },
                onProdPick(val) {
                    if (val) document.getElementById('skmP3SerProdName').value = val;
                },
                async saveNew(alsoPrint) {
                    const prodName = document.getElementById('skmP3SerProdName').value.trim();
                    const rawCodes = document.getElementById('skmP3SerCodes').value.trim();
                    if (!prodName) return showPack3Toast('⚠️ សូមបញ្ចូលឈ្មោះទំនិញ/ម៉ូដែល!', true);
                    const codes = rawCodes.split(/[\n,;]+/).map(x => x.trim()).filter(Boolean);
                    if (!codes.length) return showPack3Toast('⚠️ សូមស្កេន ឬវាយលេខ Serial / IMEI!', true);

                    const status = document.getElementById('skmP3SerStatus').value;
                    const months = Number(document.getElementById('skmP3SerMonths').value || 0);
                    const saleDate = document.getElementById('skmP3SerDate').value || new Date().toISOString().slice(0, 10);
                    const expiry = (status === 'sold' && months > 0) ? addMonthsIso(saleDate, months) : '';
                    const cust = document.getElementById('skmP3SerCust').value.trim();
                    const phone = document.getElementById('skmP3SerPhone').value.trim();
                    const invNo = document.getElementById('skmP3SerInv').value.trim();
                    const note = document.getElementById('skmP3SerNote').value.trim();

                    const list = loadSerials();
                    const added = [];
                    codes.forEach(sn => {
                        const rec = {
                            id: 'SN_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                            serial: sn,
                            productName: prodName,
                            status,
                            warrantyMonths: months,
                            saleDate: status === 'sold' ? saleDate : '',
                            warrantyExpiry: expiry,
                            customer: cust,
                            phone,
                            invoiceId: invNo,
                            note,
                            claims: [],
                            updatedAt: new Date().toISOString()
                        };
                        const exIdx = list.findIndex(x => String(x.serial).toLowerCase() === sn.toLowerCase());
                        if (exIdx >= 0) list[exIdx] = Object.assign(list[exIdx], rec);
                        else list.unshift(rec);
                        added.push(rec);
                    });

                    await saveSerials(list);
                    document.getElementById('skmP3SerCodes').value = '';
                    showPack3Toast(`✅ បានរក្សាទុក ${added.length} លេខ Serial / IMEI ជោគជ័យ!`);
                    if (alsoPrint && added.length) this.printWarrantySlip(added[0].serial);
                    this.tab('list');
                },
                lookup() {
                    const q = (document.getElementById('skmP3SerLookupInp').value || '').trim().toLowerCase();
                    const box = document.getElementById('skmP3SerLookupRes');
                    if (!q) return;
                    const matches = loadSerials().filter(r =>
                        String(r.serial || '').toLowerCase().includes(q) ||
                        String(r.phone || '').toLowerCase().includes(q) ||
                        String(r.invoiceId || '').toLowerCase().includes(q) ||
                        String(r.customer || '').toLowerCase().includes(q)
                    );
                    if (!matches.length) {
                        box.innerHTML = `<div class="skm-p3-card" style="text-align:center;color:#fca5a5;padding:24px;">❌ រកមិនឃើញលេខ Serial / IMEI "${escHtml(q)}" ក្នុងប្រព័ន្ធទេ!</div>`;
                        return;
                    }
                    box.innerHTML = matches.slice(0, 10).map(r => {
                        const claimsHtml = (r.claims && r.claims.length)
                            ? r.claims.map(c => `<div style="font-size:11.5px;color:#cbd5e1;padding:3px 0;">• ${escHtml(c.date)}: ${escHtml(c.text)}</div>`).join('')
                            : '<div style="font-size:11.5px;color:#94a3b8;">មិនទាន់មានប្រវត្តិជួសជុល/ធានាទេ</div>';
                        return `
                            <div class="skm-p3-card" style="margin-bottom:10px;border-color:rgba(56,189,248,0.4);">
                                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
                                    <div>
                                        <strong style="font-size:15px;color:#38bdf8;">🔢 ${escHtml(r.serial)}</strong>
                                        <span style="margin-left:8px;font-weight:800;">${escHtml(r.productName)}</span>
                                    </div>
                                    ${renderStatusBadge(r)}
                                </div>
                                <div class="skm-p3-grid" style="font-size:12px;color:#cbd5e1;margin-bottom:10px;">
                                    <div>👤 អតិថិជន៖ <b>${escHtml(r.customer || '-')}</b> (${escHtml(r.phone || '-')})</div>
                                    <div>🧾 វិក្កយបត្រ៖ <b>${escHtml(r.invoiceId || '-')}</b></div>
                                    <div>📅 ថ្ងៃលក់៖ <b>${escHtml(r.saleDate || '-')}</b> (${r.warrantyMonths || 0} ខែ)</div>
                                    <div>⏳ ផុតធានា៖ <b style="color:#fbbf24;">${escHtml(r.warrantyExpiry || '-')}</b></div>
                                </div>
                                <div style="background:#0f172a;padding:8px 10px;border-radius:10px;margin-bottom:10px;">
                                    <div style="font-size:11px;color:#94a3b8;font-weight:800;margin-bottom:4px;">🛠️ ប្រវត្តិយកមកធានា / ជួសជុល៖</div>
                                    ${claimsHtml}
                                </div>
                                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                                    <button class="skm-p3-btn blue" onclick="window.SKMP3Serial.printWarrantySlip('${escHtml(r.serial)}')">🖨️ ព្រីនប័ណ្ណធានា</button>
                                    <button class="skm-p3-btn amber" onclick="window.SKMP3Serial.addClaim('${escHtml(r.serial)}')">🛠️ កត់ត្រាជួសជុល/ធានា</button>
                                    ${r.status === 'in_stock' ? `<button class="skm-p3-btn green" onclick="window.SKMP3Serial.markSold('${escHtml(r.serial)}')">✅ ប្តូរជាលក់ចេញ</button>` : ''}
                                </div>
                            </div>`;
                    }).join('');
                },
                async addClaim(serial) {
                    const txt = prompt(`កត់ត្រាការយកមកធានា / ជួសជុលសម្រាប់ ${serial}៖`, 'ដូរថ្ម / ឆែកម៉ាស៊ីនក្នុងលក្ខខណ្ឌធានា');
                    if (!txt) return;
                    const list = loadSerials();
                    const rec = list.find(x => x.serial === serial);
                    if (!rec) return;
                    if (!Array.isArray(rec.claims)) rec.claims = [];
                    rec.claims.unshift({ date: new Date().toLocaleDateString('en-GB'), text: txt.trim() });
                    await saveSerials(list);
                    showPack3Toast('🛠️ បានកត់ត្រាប្រវត្តិជួសជុល/ធានា!');
                    this.lookup();
                },
                async markSold(serial) {
                    const cust = prompt('ឈ្មោះអតិថិជន៖', 'អតិថិជនទូទៅ') || 'អតិថិជនទូទៅ';
                    const phone = prompt('លេខទូរស័ព្ទអតិថិជន៖', '') || '';
                    const months = Number(prompt('រយៈពេលធានា (ខែ)៖', '12') || 12);
                    const list = loadSerials();
                    const rec = list.find(x => x.serial === serial);
                    if (!rec) return;
                    const today = new Date().toISOString().slice(0, 10);
                    rec.status = 'sold';
                    rec.customer = cust;
                    rec.phone = phone;
                    rec.saleDate = today;
                    rec.warrantyMonths = months;
                    rec.warrantyExpiry = months > 0 ? addMonthsIso(today, months) : '';
                    await saveSerials(list);
                    showPack3Toast(`✅ បានបើកការធានា ${months} ខែសម្រាប់ ${serial}!`);
                    this.renderList();
                },
                renderList() {
                    const q = (document.getElementById('skmP3SerListFilter')?.value || '').trim().toLowerCase();
                    const sf = document.getElementById('skmP3SerStatusFilter')?.value || 'all';
                    let list = loadSerials();
                    if (sf === 'in_stock') list = list.filter(x => x.status === 'in_stock');
                    else if (sf === 'sold') list = list.filter(x => x.status === 'sold' && (daysRemaining(x.warrantyExpiry) ?? 0) >= 0);
                    else if (sf === 'expired') list = list.filter(x => x.status === 'sold' && (daysRemaining(x.warrantyExpiry) ?? 1) < 0);
                    if (q) {
                        list = list.filter(x =>
                            String(x.serial || '').toLowerCase().includes(q) ||
                            String(x.productName || '').toLowerCase().includes(q) ||
                            String(x.customer || '').toLowerCase().includes(q) ||
                            String(x.phone || '').toLowerCase().includes(q)
                        );
                    }
                    const tb = document.getElementById('skmP3SerListBody');
                    tb.innerHTML = list.length ? list.slice(0, 120).map(r => `
                        <tr>
                            <td><b style="color:#38bdf8;font-family:monospace;">${escHtml(r.serial)}</b><div style="font-size:10.5px;color:#94a3b8;">${escHtml(r.invoiceId || '')}</div></td>
                            <td><b>${escHtml(r.productName)}</b></td>
                            <td>${escHtml(r.customer || '-')}<div style="font-size:10.5px;color:#94a3b8;">${escHtml(r.phone || '')}</div></td>
                            <td>${escHtml(r.warrantyExpiry || '-')}</td>
                            <td>${renderStatusBadge(r)}</td>
                            <td style="white-space:nowrap;">
                                <button class="skm-p3-btn blue" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Serial.printWarrantySlip('${escHtml(r.serial)}')">🖨️</button>
                                <button class="skm-p3-btn red" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Serial.remove('${escHtml(r.serial)}')">🗑️</button>
                            </td>
                        </tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:22px;">មិនទាន់មានទិន្នន័យ Serial / IMEI ទេ។</td></tr>';
                },
                async remove(serial) {
                    if (!confirm(`លុបលេខ Serial "${serial}" ចេញពីបញ្ជី?`)) return;
                    const list = loadSerials().filter(x => x.serial !== serial);
                    await saveSerials(list);
                    this.renderList();
                },
                printWarrantySlip(serial) {
                    const r = loadSerials().find(x => x.serial === serial);
                    if (!r) return;
                    const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || 'SKM STORE';
                    const phone = localStorage.getItem(`ks2_${getBranchId()}_shop_phone`) || window.shopPhone || '';
                    const w = window.open('', '_blank', 'width=520,height=680');
                    if (!w) return;
                    w.document.write(`<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>ប័ណ្ណធានា ${escHtml(r.serial)}</title>
                        <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap" rel="stylesheet">
                        <style>body{font-family:'Battambang',sans-serif;padding:24px;color:#0f172a;} .card{border:3px solid #0284c7;border-radius:18px;padding:22px;max-width:440px;margin:0 auto;} .row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px dashed #cbd5e1;font-size:13px;} @media print{.np{display:none;}}</style></head><body>
                        <div class="card">
                            <h2 style="text-align:center;margin:0;color:#0284c7;">🛡️ ប័ណ្ណធានាផលិតផល (WARRANTY CARD)</h2>
                            <div style="text-align:center;font-weight:700;margin:4px 0 12px;">${escHtml(shop)} ${phone ? '• ' + escHtml(phone) : ''}</div>
                            <div class="row"><span>ម៉ូដែល / ទំនិញ៖</span><b>${escHtml(r.productName)}</b></div>
                            <div class="row"><span>Serial / IMEI៖</span><b style="font-family:monospace;font-size:14px;">${escHtml(r.serial)}</b></div>
                            <div class="row"><span>អតិថិជន៖</span><b>${escHtml(r.customer || '-')} (${escHtml(r.phone || '-')})</b></div>
                            <div class="row"><span>លេខវិក្កយបត្រ៖</span><b>${escHtml(r.invoiceId || '-')}</b></div>
                            <div class="row"><span>ថ្ងៃទិញ៖</span><b>${escHtml(r.saleDate || '-')}</b></div>
                            <div class="row"><span>រយៈពេលធានា៖</span><b>${r.warrantyMonths || 0} ខែ (ដល់ ${escHtml(r.warrantyExpiry || '-')})</b></div>
                            <div style="margin-top:12px;font-size:11.5px;color:#475569;background:#f8fafc;padding:8px;border-radius:8px;"><b>លក្ខខណ្ឌធានា៖</b> ${escHtml(r.note || 'ធានាម៉ាស៊ីន មិនធានាបែកបាក់ ឬចូលទឹក')}</div>
                            <div style="display:flex;justify-content:space-between;margin-top:26px;text-align:center;font-size:12px;">
                                <div>ហត្ថលេខាហាង<br><br>..................</div>
                                <div>ហត្ថលេខាអតិថិជន<br><br>..................</div>
                            </div>
                        </div>
                        <div style="text-align:center;margin-top:14px;"><button class="np" onclick="window.print()" style="padding:10px 22px;background:#0284c7;color:#fff;border:none;border-radius:10px;font-size:14px;cursor:pointer;">🖨️ បោះពុម្ពប័ណ្ណធានា</button></div>
                        </body></html>`);
                    w.document.close();
                },
                exportCsv() {
                    const list = loadSerials();
                    if (!list.length) return showPack3Toast('⚠️ គ្មានទិន្នន័យទេ!', true);
                    const rows = [['Serial', 'Product', 'Status', 'Customer', 'Phone', 'Invoice', 'SaleDate', 'WarrantyMonths', 'WarrantyExpiry'],
                        ...list.map(r => [r.serial, r.productName.replace(/,/g, ' '), r.status, (r.customer || '').replace(/,/g, ' '), r.phone || '', r.invoiceId || '', r.saleDate || '', r.warrantyMonths || 0, r.warrantyExpiry || ''])];
                    const blob = new Blob(['\uFEFF' + rows.map(x => x.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `SKM_Serial_Warranty_${getBranchId()}.csv`; a.click();
                }
            };

            registerInPosToolbox('📱', 'លេខ Serial / IMEI & ធានាទំនិញ', () => window.SKMP3Serial.open('check'));
        })();
    }

    // ========================================================================
    // [2/3] 🚢 ថ្លៃដើមនាំចូល & មធ្យមភាគ (Landed Cost & Moving Average Stock-In)
    // បូកបញ្ចូលថ្លៃដឹកជញ្ជូន + ពន្ធគយ ចូលថ្លៃដើម ១ ឯកតា ➔ គណនាថ្លៃដើមមធ្យម (Moving Average) ➔ អាប់ដេតស្តុក POS ១ ចុច!
    // ========================================================================
    if (pack3State.landedAvgCost !== false) {
        (function initLandedCostPlugin() {
            const loadBatches = () => loadP3Data('p3_landed_batches', 'p3LandedBatches', []);
            const saveBatches = (arr) => saveP3Data('p3_landed_batches', 'p3LandedBatches', arr.slice(0, 120));

            let draftLines = []; // [{ prodId, name, oldQty, oldCost, inQty, unitCost }]

            function computeAllocatedLines() {
                const freight = Math.max(0, Number(document.getElementById('skmP3LcFreight')?.value || 0));
                const tax = Math.max(0, Number(document.getElementById('skmP3LcTax')?.value || 0));
                const other = Math.max(0, Number(document.getElementById('skmP3LcOther')?.value || 0));
                const method = document.getElementById('skmP3LcMethod')?.value || 'value';
                const extraTotal = freight + tax + other;

                const totalBaseVal = draftLines.reduce((s, l) => s + (l.inQty * l.unitCost), 0);
                const totalInQty = draftLines.reduce((s, l) => s + l.inQty, 0);

                return {
                    freight, tax, other, extraTotal, method, totalBaseVal, totalInQty,
                    lines: draftLines.map(l => {
                        const lineBase = l.inQty * l.unitCost;
                        let share = 0;
                        if (extraTotal > 0) {
                            if (method === 'qty' && totalInQty > 0) share = extraTotal * (l.inQty / totalInQty);
                            else if (totalBaseVal > 0) share = extraTotal * (lineBase / totalBaseVal);
                            else if (totalInQty > 0) share = extraTotal * (l.inQty / totalInQty);
                        }
                        const landedUnit = l.inQty > 0 ? (lineBase + share) / l.inQty : l.unitCost;
                        const newQty = l.oldQty + l.inQty;
                        const avgCost = newQty > 0 ? ((l.oldQty * l.oldCost) + (l.inQty * landedUnit)) / newQty : landedUnit;
                        return Object.assign({}, l, {
                            allocatedExtra: share,
                            landedUnitCost: Number(landedUnit.toFixed(4)),
                            newQty,
                            newAvgCost: Number(avgCost.toFixed(4))
                        });
                    })
                };
            }

            function ensureModal() {
                if (document.getElementById('skmP3LandedModal')) return;
                injectPack3Styles();
                const m = document.createElement('div');
                m.id = 'skmP3LandedModal';
                m.className = 'skm-p3-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p3-box">
                        <div class="skm-p3-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#34d399;">🚢 ថ្លៃដើមនាំចូល & មធ្យមភាគ (Landed & Moving Average Cost)</div>
                                <div style="font-size:11.5px;color:#94a3b8;">បញ្ចូលស្តុក + បែងចែកថ្លៃដឹកជញ្ជូន/ពន្ធគយ ➔ គណនាថ្លៃដើមមធ្យមអូតូ & អាប់ដេតស្តុក POS</div>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <button class="skm-p3-btn red" onclick="document.getElementById('skmP3LandedModal').classList.remove('open')">✕ បិទ</button>
                            </div>
                        </div>
                        <div class="skm-p3-tabs">
                            <button class="skm-p3-tab active" data-t="new" onclick="window.SKMP3Landed.tab('new')">📦 បង្កើតប័ណ្ណនាំចូលស្តុកថ្មី</button>
                            <button class="skm-p3-tab" data-t="hist" onclick="window.SKMP3Landed.tab('hist')">📜 ប្រវត្តិប័ណ្ណនាំចូល</button>
                        </div>
                        <div class="skm-p3-body">
                            <div id="skmP3LcTab_new">
                                <div class="skm-p3-card" style="margin-bottom:12px;">
                                    <div class="skm-p3-grid">
                                        <div><label class="skm-p3-label">លេខកុងតឺន័រ / វិក្កយបត្រផ្គត់ផ្គង់</label><input id="skmP3LcRef" class="skm-p3-input" placeholder="ឧ. SHV-2026-01 ឬ PO-001"></div>
                                        <div><label class="skm-p3-label">អ្នកផ្គត់ផ្គង់ / ក្រុមហ៊ុនដឹក</label><input id="skmP3LcSup" class="skm-p3-input" placeholder="ឧ. JWD / CEVA / Supplier"></div>
                                        <div><label class="skm-p3-label">ថ្លៃដឹកជញ្ជូន (Freight $)</label><input type="number" step="0.01" id="skmP3LcFreight" class="skm-p3-input" value="0" oninput="window.SKMP3Landed.renderDraft()"></div>
                                        <div><label class="skm-p3-label">ពន្ធគយ / CIPL Tax ($)</label><input type="number" step="0.01" id="skmP3LcTax" class="skm-p3-input" value="0" oninput="window.SKMP3Landed.renderDraft()"></div>
                                        <div><label class="skm-p3-label">ចំណាយផ្សេងៗ ($)</label><input type="number" step="0.01" id="skmP3LcOther" class="skm-p3-input" value="0" oninput="window.SKMP3Landed.renderDraft()"></div>
                                        <div><label class="skm-p3-label">របៀបបែងចែកថ្លៃដឹក/ពន្ធ</label>
                                            <select id="skmP3LcMethod" class="skm-p3-select" onchange="window.SKMP3Landed.renderDraft()">
                                                <option value="value">📊 តាមភាគរយតម្លៃទំនិញ (By Value)</option>
                                                <option value="qty">🔢 តាមចំនួនឯកតា (By Quantity)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="skm-p3-card" style="margin-bottom:12px;">
                                    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:end;">
                                        <div style="flex:2;min-width:190px;"><label class="skm-p3-label">ជ្រើសទំនិញពីស្តុក POS</label><select id="skmP3LcProdSel" class="skm-p3-select"></select></div>
                                        <div style="width:105px;"><label class="skm-p3-label">ចំនួនចូល</label><input type="number" min="1" id="skmP3LcInQty" class="skm-p3-input" value="10"></div>
                                        <div style="width:130px;"><label class="skm-p3-label">តម្លៃទិញ ($/ឯកតា)</label><input type="number" step="0.01" min="0" id="skmP3LcInCost" class="skm-p3-input" value="1.00"></div>
                                        <button class="skm-p3-btn blue" onclick="window.SKMP3Landed.addLine()">➕ បន្ថែម</button>
                                    </div>
                                    <div style="overflow-x:auto;max-height:220px;margin-top:10px;">
                                        <table class="skm-p3-table">
                                            <thead><tr><th>ទំនិញ</th><th>ស្តុកចាស់ (ថ្លៃដើមចាស់)</th><th>ចូលថ្មី × តម្លៃទិញ</th><th>ថ្លៃដើមនាំចូល/ឯកតា</th><th>ថ្លៃដើមមធ្យមថ្មី (MAC)</th><th></th></tr></thead>
                                            <tbody id="skmP3LcDraftBody"></tbody>
                                        </table>
                                    </div>
                                </div>

                                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                                    <div id="skmP3LcTotals" style="font-size:13px;font-weight:800;color:#38bdf8;"></div>
                                    <button class="skm-p3-btn green" style="padding:11px 18px;" onclick="window.SKMP3Landed.commitStockIn()">✅ បញ្ចូលស្តុក & អាប់ដេតថ្លៃដើមមធ្យមលើ POS</button>
                                </div>
                            </div>

                            <div id="skmP3LcTab_hist" style="display:none;">
                                <div id="skmP3LcHistBox" style="display:flex;flex-direction:column;gap:8px;max-height:420px;overflow-y:auto;"></div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
            }

            window.SKMP3Landed = {
                open(defaultTab = 'new') {
                    ensureModal();
                    const inv = getInvList().filter(p => p && p.name);
                    const sel = document.getElementById('skmP3LcProdSel');
                    sel.innerHTML = inv.slice(0, 250).map(p => `<option value="${escHtml(String(p.id || p.customId))}">${escHtml(p.name)} (សល់ ${Number(p.qty||0)} • ដើម $${Number(p.cost||0).toFixed(2)})</option>`).join('');
                    if (!document.getElementById('skmP3LcRef').value) {
                        document.getElementById('skmP3LcRef').value = 'PO-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + String(Date.now()).slice(-3);
                    }
                    document.getElementById('skmP3LandedModal').classList.add('open');
                    this.tab(defaultTab);
                },
                tab(t) {
                    ['new', 'hist'].forEach(k => {
                        const el = document.getElementById(`skmP3LcTab_${k}`);
                        if (el) el.style.display = (k === t) ? 'block' : 'none';
                    });
                    document.querySelectorAll('#skmP3LandedModal .skm-p3-tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-t') === t));
                    if (t === 'new') this.renderDraft();
                    if (t === 'hist') this.renderHistory();
                },
                addLine() {
                    const pid = document.getElementById('skmP3LcProdSel').value;
                    const p = getInvList().find(x => x && (String(x.id) === pid || String(x.customId) === pid));
                    if (!p) return showPack3Toast('⚠️ សូមជ្រើសរើសទំនិញ!', true);
                    const inQty = Math.max(1, Number(document.getElementById('skmP3LcInQty').value || 1));
                    const unitCost = Math.max(0, Number(document.getElementById('skmP3LcInCost').value || 0));
                    const ex = draftLines.find(x => x.prodId === pid);
                    if (ex) { ex.inQty += inQty; ex.unitCost = unitCost; }
                    else {
                        draftLines.push({
                            prodId: pid,
                            name: p.name,
                            oldQty: Math.max(0, Number(p.qty || 0)),
                            oldCost: Math.max(0, Number(p.cost || p.costPrice || 0)),
                            inQty,
                            unitCost
                        });
                    }
                    this.renderDraft();
                },
                removeLine(idx) {
                    draftLines.splice(idx, 1);
                    this.renderDraft();
                },
                renderDraft() {
                    const calc = computeAllocatedLines();
                    const tb = document.getElementById('skmP3LcDraftBody');
                    tb.innerHTML = calc.lines.length ? calc.lines.map((l, i) => `
                        <tr>
                            <td><b>${escHtml(l.name)}</b></td>
                            <td>${l.oldQty} ($${l.oldCost.toFixed(2)})</td>
                            <td><b>+${l.inQty}</b> × $${l.unitCost.toFixed(2)}</td>
                            <td style="color:#fbbf24;font-weight:800;">$${l.landedUnitCost.toFixed(2)} <div style="font-size:10px;color:#94a3b8;">(បូកដឹក/ពន្ធ +$${l.allocatedExtra.toFixed(2)})</div></td>
                            <td style="color:#34d399;font-weight:900;">$${l.newAvgCost.toFixed(2)} <div style="font-size:10px;color:#94a3b8;">ស្តុកថ្មី៖ ${l.newQty}</div></td>
                            <td><button class="skm-p3-btn red" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Landed.removeLine(${i})">✕</button></td>
                        </tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:18px;">សូមបន្ថែមមុខទំនិញនាំចូលខាងលើ ដើម្បីគណនាថ្លៃដើម Landed & Moving Average។</td></tr>';
                    document.getElementById('skmP3LcTotals').innerHTML =
                        `តម្លៃទិញទំនិញ៖ $${calc.totalBaseVal.toFixed(2)} + ថ្លៃដឹក/ពន្ធ៖ $${calc.extraTotal.toFixed(2)} ➔ <span style="color:#34d399;">សរុបដើមទុននាំចូល៖ $${(calc.totalBaseVal + calc.extraTotal).toFixed(2)}</span>`;
                },
                async commitStockIn() {
                    if (!draftLines.length) return showPack3Toast('⚠️ សូមបន្ថែមទំនិញយ៉ាងតិច ១ មុខ!', true);
                    const calc = computeAllocatedLines();
                    const ref = document.getElementById('skmP3LcRef').value.trim() || ('PO-' + Date.now());
                    const supplier = document.getElementById('skmP3LcSup').value.trim() || 'Supplier';
                    const inv = getInvList();

                    calc.lines.forEach(l => {
                        const prod = inv.find(x => x && (String(x.id) === l.prodId || String(x.customId) === l.prodId));
                        if (prod) {
                            prod.qty = l.newQty;
                            prod.cost = Number(l.newAvgCost.toFixed(2));
                            if (Array.isArray(window.historyLog)) {
                                window.historyLog.unshift({
                                    id: Date.now() + Math.floor(Math.random() * 100),
                                    date: new Date().toLocaleString('km-KH'),
                                    type: 'restock',
                                    itemName: prod.name,
                                    qty: l.inQty,
                                    note: `[Landed Cost ${ref}] ទិញ $${l.unitCost.toFixed(2)} ➔ Landed $${l.landedUnitCost.toFixed(2)} ➔ ថ្លៃដើមមធ្យម $${l.newAvgCost.toFixed(2)}`
                                });
                            }
                        }
                    });

                    const br = getBranchId();
                    try { localStorage.setItem(`ks2_${br}_inv_pro`, JSON.stringify(inv)); } catch (e) {}
                    if (typeof window.renderInventory === 'function') window.renderInventory();
                    if (typeof window.renderPOSProducts === 'function') window.renderPOSProducts();

                    // Ultra-Low-Egress Cloud Sync: update ONLY the exact restocked product rows in pos_products (~80B each)
                    if (window.supabaseClient && navigator.onLine) {
                        try {
                            const nowIso = new Date().toISOString();
                            for (const l of calc.lines) {
                                const prod = inv.find(x => x && (String(x.id) === l.prodId || String(x.customId) === l.prodId));
                                if (prod && prod.id != null) {
                                    await window.supabaseClient.from('pos_products')
                                        .update({ qty: l.newQty, cost: Number(l.newAvgCost.toFixed(2)), updated_at: nowIso })
                                        .eq('id', prod.id)
                                        .eq('branch_id', br);
                                }
                            }
                            if (typeof window.touchCloudSync === 'function') await window.touchCloudSync();
                        } catch (e) {}
                    }

                    const batches = loadBatches();
                    batches.unshift({
                        id: ref,
                        supplier,
                        date: new Date().toLocaleString('km-KH'),
                        freight: calc.freight,
                        tax: calc.tax,
                        other: calc.other,
                        grandTotal: Number((calc.totalBaseVal + calc.extraTotal).toFixed(2)),
                        lines: calc.lines
                    });
                    await saveBatches(batches);

                    draftLines = [];
                    document.getElementById('skmP3LcFreight').value = 0;
                    document.getElementById('skmP3LcTax').value = 0;
                    document.getElementById('skmP3LcOther').value = 0;
                    showPack3Toast(`✅ បញ្ចូលស្តុក ${ref} & អាប់ដេតថ្លៃដើមមធ្យមជោគជ័យ!`);
                    this.tab('hist');
                },
                renderHistory() {
                    const batches = loadBatches();
                    const box = document.getElementById('skmP3LcHistBox');
                    box.innerHTML = batches.length ? batches.map((b, idx) => `
                        <div class="skm-p3-card">
                            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:6px;">
                                <div><strong style="color:#38bdf8;">🚢 ${escHtml(b.id)}</strong> • ${escHtml(b.supplier)} <span style="font-size:11px;color:#94a3b8;">(${escHtml(b.date)})</span></div>
                                <div style="display:flex;gap:8px;align-items:center;">
                                    <b style="color:#34d399;">$${Number(b.grandTotal || 0).toFixed(2)}</b>
                                    <button class="skm-p3-btn blue" style="padding:4px 9px;font-size:11px;" onclick="window.SKMP3Landed.printBatch(${idx})">🖨️ A4</button>
                                </div>
                            </div>
                            <div style="font-size:11.5px;color:#cbd5e1;">
                                ដឹក៖ $${Number(b.freight||0).toFixed(2)} | ពន្ធ៖ $${Number(b.tax||0).toFixed(2)} | ផ្សេងៗ៖ $${Number(b.other||0).toFixed(2)} • ទំនិញ ${(b.lines||[]).length} មុខ
                            </div>
                        </div>`).join('') : '<div style="text-align:center;color:#94a3b8;padding:24px;">មិនទាន់មានប្រវត្តិប័ណ្ណនាំចូលស្តុកទេ។</div>';
                },
                printBatch(idx) {
                    const b = loadBatches()[idx];
                    if (!b) return;
                    const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || 'SKM STORE';
                    const w = window.open('', '_blank', 'width=820,height=900');
                    if (!w) return;
                    w.document.write(`<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>Landed Cost ${escHtml(b.id)}</title>
                        <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap" rel="stylesheet">
                        <style>body{font-family:'Battambang',sans-serif;padding:24px;color:#0f172a;} table{width:100%;border-collapse:collapse;margin:14px 0;font-size:12.5px;} th,td{border:1px solid #cbd5e1;padding:7px;} th{background:#f1f5f9;} @media print{.np{display:none;}}</style></head><body>
                        <h2 style="margin:0;">🚢 ប័ណ្ណគណនាថ្លៃដើមនាំចូល & មធ្យមភាគ — ${escHtml(shop)}</h2>
                        <div style="font-size:13px;color:#475569;margin-top:4px;">លេខប័ណ្ណ៖ <b>${escHtml(b.id)}</b> • អ្នកផ្គត់ផ្គង់៖ ${escHtml(b.supplier)} • កាលបរិច្ឆេទ៖ ${escHtml(b.date)}</div>
                        <div style="font-size:13px;margin-top:6px;">ថ្លៃដឹក៖ $${Number(b.freight||0).toFixed(2)} | ពន្ធគយ/CIPL៖ $${Number(b.tax||0).toFixed(2)} | ផ្សេងៗ៖ $${Number(b.other||0).toFixed(2)} | <b>សរុបដើមទុន៖ $${Number(b.grandTotal||0).toFixed(2)}</b></div>
                        <table><thead><tr><th>#</th><th>ទំនិញ</th><th>ចូលថ្មី</th><th>តម្លៃទិញ</th><th>បូកដឹក/ពន្ធ</th><th>Landed Cost/ឯកតា</th><th>ថ្លៃដើមមធ្យមថ្មី (MAC)</th></tr></thead>
                        <tbody>${(b.lines||[]).map((l, i) => `<tr><td>${i+1}</td><td>${escHtml(l.name)}</td><td>${l.inQty}</td><td>$${Number(l.unitCost).toFixed(2)}</td><td>$${Number(l.allocatedExtra).toFixed(2)}</td><td><b>$${Number(l.landedUnitCost).toFixed(2)}</b></td><td><b>$${Number(l.newAvgCost).toFixed(2)}</b></td></tr>`).join('')}</tbody></table>
                        <button class="np" onclick="window.print()" style="padding:10px 20px;background:#0284c7;color:#fff;border:none;border-radius:10px;cursor:pointer;">🖨️ បោះពុម្ព A4</button>
                        </body></html>`);
                    w.document.close();
                }
            };

            registerInPosToolbox('🚢', 'ថ្លៃដើមនាំចូល & មធ្យមភាគ (Landed Cost)', () => window.SKMP3Landed.open('new'));
        })();
    }

    // ========================================================================
    // [3/3] 🤝 គ្រប់គ្រងទំនិញផ្ញើលក់ (Consignment Management Pro — In & Out)
    // តាមដានទំនិញទទួលផ្ញើលក់ពីអ្នកផ្គត់ផ្គង់ ឬផ្ញើឱ្យហាងដៃគូលក់ • កត់ត្រាលក់បាន/ដកវិញ • ទូទាត់លុយ + Telegram
    // ========================================================================
    if (pack3State.consignmentPro !== false) {
        (function initConsignmentPlugin() {
            const loadConsign = () => loadP3Data('p3_consignments', 'p3Consignments', []);
            const saveConsign = (arr) => saveP3Data('p3_consignments', 'p3Consignments', arr.slice(0, 600));

            function calcRow(r) {
                const qty = Math.max(0, Number(r.consignedQty || 0));
                const sold = Math.max(0, Number(r.soldQty || 0));
                const ret = Math.max(0, Number(r.returnedQty || 0));
                const rem = Math.max(0, qty - sold - ret);
                const unitCost = Math.max(0, Number(r.unitSettlePrice || 0));
                const grossDue = sold * unitCost;
                const paid = Math.max(0, Number(r.paidAmount || 0));
                const balance = Math.max(0, grossDue - paid);
                return { qty, sold, ret, rem, unitCost, grossDue, paid, balance };
            }

            function ensureModal() {
                if (document.getElementById('skmP3ConsignModal')) return;
                injectPack3Styles();
                const m = document.createElement('div');
                m.id = 'skmP3ConsignModal';
                m.className = 'skm-p3-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p3-box">
                        <div class="skm-p3-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#fbbf24;">🤝 គ្រប់គ្រងទំនិញផ្ញើលក់ (Consignment Pro)</div>
                                <div style="font-size:11.5px;color:#94a3b8;">ទំនិញទទួលផ្ញើលក់ (In) & ផ្ញើឱ្យដៃគូលក់ (Out) • កត់ត្រាចំនួនលក់/ដកវិញ • ទូទាត់លុយច្បាស់លាស់</div>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <button class="skm-p3-btn red" onclick="document.getElementById('skmP3ConsignModal').classList.remove('open')">✕ បិទ</button>
                            </div>
                        </div>
                        <div class="skm-p3-tabs">
                            <button class="skm-p3-tab active" data-t="list" onclick="window.SKMP3Consign.tab('list')">📋 បញ្ជីទំនិញផ្ញើលក់</button>
                            <button class="skm-p3-tab" data-t="add" onclick="window.SKMP3Consign.tab('add')">➕ បន្ថែមទំនិញផ្ញើលក់ថ្មី</button>
                        </div>
                        <div class="skm-p3-body">
                            <div id="skmP3ConTab_list">
                                <div id="skmP3ConKpis" class="skm-p3-grid" style="margin-bottom:12px;"></div>
                                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
                                    <select id="skmP3ConDirFilter" class="skm-p3-select" style="width:auto;" onchange="window.SKMP3Consign.renderList()">
                                        <option value="all">ទាំងអស់ (In & Out)</option>
                                        <option value="in">📥 ទទួលគេផ្ញើលក់ (ពី Supplier)</option>
                                        <option value="out">📤 ផ្ញើឱ្យដៃគូលក់ (ទៅហាងដៃគូ)</option>
                                    </select>
                                    <input id="skmP3ConSearch" class="skm-p3-input" style="flex:1;min-width:170px;" placeholder="🔍 ស្វែងរកឈ្មោះដៃគូ ឬទំនិញ..." oninput="window.SKMP3Consign.renderList()">
                                    <button class="skm-p3-btn tg" onclick="window.SKMP3Consign.sendTgSummary()">✈️ ផ្ញើសង្ខេប Telegram</button>
                                </div>
                                <div style="overflow-x:auto;max-height:330px;">
                                    <table class="skm-p3-table">
                                        <thead><tr><th>ប្រភេទ / ដៃគូ</th><th>ទំនិញ</th><th>ផ្ញើ / លក់ / ដក / សល់</th><th>តម្លៃទូទាត់</th><th>ត្រូវទូទាត់នៅសល់</th><th>សកម្មភាព</th></tr></thead>
                                        <tbody id="skmP3ConBody"></tbody>
                                    </table>
                                </div>
                            </div>

                            <div id="skmP3ConTab_add" style="display:none;">
                                <div class="skm-p3-card">
                                    <div class="skm-p3-grid" style="margin-bottom:12px;">
                                        <div><label class="skm-p3-label">ប្រភេទផ្ញើលក់</label>
                                            <select id="skmP3ConDir" class="skm-p3-select">
                                                <option value="in">📥 ទទួលទំនិញគេផ្ញើលក់ (Consignment In)</option>
                                                <option value="out">📤 ផ្ញើទំនិញឱ្យដៃគូលក់ (Consignment Out)</option>
                                            </select>
                                        </div>
                                        <div><label class="skm-p3-label">ឈ្មោះដៃគូ / អ្នកផ្គត់ផ្គង់ *</label><input id="skmP3ConPartner" class="skm-p3-input" placeholder="ឧ. ហាងដៃគូ A ឬ អ្នកផ្គត់ផ្គង់ B"></div>
                                        <div><label class="skm-p3-label">លេខទូរស័ព្ទដៃគូ</label><input id="skmP3ConPhone" class="skm-p3-input" placeholder="012 345 678"></div>
                                        <div><label class="skm-p3-label">ជ្រើសទំនិញពីស្តុក (ឬវាយថ្មី)</label><select id="skmP3ConProdSel" class="skm-p3-select" onchange="if(this.value) document.getElementById('skmP3ConItem').value=this.value"></select></div>
                                        <div><label class="skm-p3-label">ឈ្មោះទំនិញ *</label><input id="skmP3ConItem" class="skm-p3-input" placeholder="ឈ្មោះទំនិញផ្ញើលក់"></div>
                                        <div><label class="skm-p3-label">ចំនួនផ្ញើលក់ *</label><input type="number" min="1" id="skmP3ConQty" class="skm-p3-input" value="10"></div>
                                        <div><label class="skm-p3-label">តម្លៃទូទាត់/ឯកតា ($)</label><input type="number" step="0.01" min="0" id="skmP3ConPrice" class="skm-p3-input" value="5.00"></div>
                                        <div><label class="skm-p3-label">កំណត់ចំណាំ</label><input id="skmP3ConNote" class="skm-p3-input" placeholder="លក្ខខណ្ឌទូទាត់ប្រចាំខែ..."></div>
                                    </div>
                                    <button class="skm-p3-btn green" style="width:100%;padding:11px;" onclick="window.SKMP3Consign.addRecord()">💾 រក្សាទុកទំនិញផ្ញើលក់</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
            }

            window.SKMP3Consign = {
                open(defaultTab = 'list') {
                    ensureModal();
                    const inv = getInvList().filter(p => p && p.name);
                    document.getElementById('skmP3ConProdSel').innerHTML = '<option value="">-- ជ្រើសពីស្តុក POS --</option>' +
                        inv.slice(0, 200).map(p => `<option value="${escHtml(p.name)}">${escHtml(p.name)} ($${Number(p.price||0).toFixed(2)})</option>`).join('');
                    document.getElementById('skmP3ConsignModal').classList.add('open');
                    this.tab(defaultTab);
                },
                tab(t) {
                    ['list', 'add'].forEach(k => {
                        const el = document.getElementById(`skmP3ConTab_${k}`);
                        if (el) el.style.display = (k === t) ? 'block' : 'none';
                    });
                    document.querySelectorAll('#skmP3ConsignModal .skm-p3-tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-t') === t));
                    if (t === 'list') this.renderList();
                },
                async addRecord() {
                    const partner = document.getElementById('skmP3ConPartner').value.trim();
                    const itemName = document.getElementById('skmP3ConItem').value.trim();
                    if (!partner || !itemName) return showPack3Toast('⚠️ សូមបញ្ចូលឈ្មោះដៃគូ និងឈ្មោះទំនិញ!', true);
                    const list = loadConsign();
                    list.unshift({
                        id: 'CON_' + Date.now(),
                        direction: document.getElementById('skmP3ConDir').value,
                        partner,
                        phone: document.getElementById('skmP3ConPhone').value.trim(),
                        itemName,
                        consignedQty: Math.max(1, Number(document.getElementById('skmP3ConQty').value || 1)),
                        soldQty: 0,
                        returnedQty: 0,
                        unitSettlePrice: Math.max(0, Number(document.getElementById('skmP3ConPrice').value || 0)),
                        paidAmount: 0,
                        note: document.getElementById('skmP3ConNote').value.trim(),
                        date: new Date().toLocaleDateString('en-GB')
                    });
                    await saveConsign(list);
                    document.getElementById('skmP3ConItem').value = '';
                    showPack3Toast('✅ បានកត់ត្រាទំនិញផ្ញើលក់ជោគជ័យ!');
                    this.tab('list');
                },
                renderList() {
                    const dir = document.getElementById('skmP3ConDirFilter')?.value || 'all';
                    const q = (document.getElementById('skmP3ConSearch')?.value || '').trim().toLowerCase();
                    const all = loadConsign();

                    let payableIn = 0, receivableOut = 0, remValue = 0;
                    all.forEach(r => {
                        const c = calcRow(r);
                        if (r.direction === 'in') payableIn += c.balance;
                        else receivableOut += c.balance;
                        remValue += c.rem * c.unitCost;
                    });

                    document.getElementById('skmP3ConKpis').innerHTML = `
                        <div class="skm-p3-card" style="border-color:rgba(245,158,11,0.45);">
                            <div style="font-size:11px;color:#fcd34d;">📥 ត្រូវសងអ្នកផ្គត់ផ្គង់ (Consign In)</div>
                            <div style="font-size:19px;font-weight:900;color:#fbbf24;">$${payableIn.toFixed(2)}</div>
                        </div>
                        <div class="skm-p3-card" style="border-color:rgba(16,185,129,0.45);">
                            <div style="font-size:11px;color:#6ee7b7;">📤 ត្រូវទារពីហាងដៃគូ (Consign Out)</div>
                            <div style="font-size:19px;font-weight:900;color:#34d399;">$${receivableOut.toFixed(2)}</div>
                        </div>
                        <div class="skm-p3-card" style="border-color:rgba(56,189,248,0.45);">
                            <div style="font-size:11px;color:#7dd3fc;">📦 តម្លៃទំនិញផ្ញើលក់នៅសល់</div>
                            <div style="font-size:19px;font-weight:900;color:#38bdf8;">$${remValue.toFixed(2)}</div>
                        </div>
                    `;

                    let filtered = all;
                    if (dir !== 'all') filtered = filtered.filter(x => x.direction === dir);
                    if (q) filtered = filtered.filter(x => String(x.partner || '').toLowerCase().includes(q) || String(x.itemName || '').toLowerCase().includes(q));

                    const tb = document.getElementById('skmP3ConBody');
                    tb.innerHTML = filtered.length ? filtered.map(r => {
                        const c = calcRow(r);
                        const dirBadge = r.direction === 'in'
                            ? '<span class="skm-p3-badge" style="background:rgba(245,158,11,0.2);color:#fcd34d;">📥 ទទួលផ្ញើ</span>'
                            : '<span class="skm-p3-badge" style="background:rgba(56,189,248,0.2);color:#38bdf8;">📤 ផ្ញើចេញ</span>';
                        return `<tr>
                            <td>${dirBadge}<div style="font-weight:800;margin-top:2px;">${escHtml(r.partner)}</div><div style="font-size:10.5px;color:#94a3b8;">${escHtml(r.phone || '')} • ${escHtml(r.date || '')}</div></td>
                            <td><b>${escHtml(r.itemName)}</b><div style="font-size:10.5px;color:#94a3b8;">${escHtml(r.note || '')}</div></td>
                            <td>ផ្ញើ <b>${c.qty}</b> | លក់ <b style="color:#34d399;">${c.sold}</b> | ដក ${c.ret} | សល់ <b style="color:#fbbf24;">${c.rem}</b></td>
                            <td>$${c.unitCost.toFixed(2)}</td>
                            <td><b style="color:${c.balance > 0 ? '#f87171' : '#34d399'};font-size:14px;">$${c.balance.toFixed(2)}</b><div style="font-size:10px;color:#94a3b8;">ទូទាត់ហើយ $${c.paid.toFixed(2)}</div></td>
                            <td style="white-space:nowrap;">
                                <button class="skm-p3-btn green" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Consign.updateSold('${escHtml(r.id)}')" title="កត់ត្រាចំនួនលក់">+លក់</button>
                                <button class="skm-p3-btn amber" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Consign.settlePay('${escHtml(r.id)}')" title="ទូទាត់ប្រាក់">$ទូទាត់</button>
                                <button class="skm-p3-btn gray" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Consign.returnStock('${escHtml(r.id)}')" title="ដកទំនិញវិញ">↩️</button>
                                <button class="skm-p3-btn red" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Consign.remove('${escHtml(r.id)}')">🗑️</button>
                            </td>
                        </tr>`;
                    }).join('') : '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:22px;">មិនទាន់មានបញ្ជីទំនិញផ្ញើលក់ទេ។</td></tr>';
                },
                async updateSold(id) {
                    const list = loadConsign();
                    const r = list.find(x => x.id === id);
                    if (!r) return;
                    const c = calcRow(r);
                    const add = Number(prompt(`បន្ថែមចំនួនដែលលក់ដាច់សម្រាប់ "${r.itemName}" (នៅសល់ ${c.rem})៖`, '1') || 0);
                    if (add <= 0 || add > c.rem) return showPack3Toast(`⚠️ ចំនួនមិនត្រឹមត្រូវ (អតិបរមា ${c.rem})!`, true);
                    r.soldQty = c.sold + add;
                    await saveConsign(list);
                    showPack3Toast(`✅ កត់ត្រាលក់ចេញ +${add} ជោគជ័យ!`);
                    this.renderList();
                },
                async returnStock(id) {
                    const list = loadConsign();
                    const r = list.find(x => x.id === id);
                    if (!r) return;
                    const c = calcRow(r);
                    const ret = Number(prompt(`ចំនួនទំនិញដកត្រឡប់វិញសម្រាប់ "${r.itemName}" (នៅសល់ ${c.rem})៖`, String(c.rem)) || 0);
                    if (ret <= 0 || ret > c.rem) return showPack3Toast(`⚠️ ចំនួនមិនត្រឹមត្រូវ!`, true);
                    r.returnedQty = c.ret + ret;
                    await saveConsign(list);
                    showPack3Toast(`↩️ កត់ត្រាដកទំនិញវិញ ${ret} ជោគជ័យ!`);
                    this.renderList();
                },
                async settlePay(id) {
                    const list = loadConsign();
                    const r = list.find(x => x.id === id);
                    if (!r) return;
                    const c = calcRow(r);
                    if (c.balance <= 0) return showPack3Toast('✅ មិនមានប្រាក់ជំពាក់ត្រូវទូទាត់ទេ!');
                    const pay = Number(prompt(`ទឹកប្រាក់ទូទាត់សម្រាប់ ${r.partner} (ត្រូវទូទាត់នៅសល់ $${c.balance.toFixed(2)})៖`, c.balance.toFixed(2)) || 0);
                    if (pay <= 0) return;
                    r.paidAmount = Number((c.paid + pay).toFixed(2));
                    await saveConsign(list);
                    showPack3Toast(`💵 បានកត់ត្រាទូទាត់ $${pay.toFixed(2)} ជោគជ័យ!`);
                    this.renderList();
                },
                async remove(id) {
                    if (!confirm('លុបកំណត់ត្រាផ្ញើលក់នេះ?')) return;
                    await saveConsign(loadConsign().filter(x => x.id !== id));
                    this.renderList();
                },
                async sendTgSummary() {
                    const all = loadConsign();
                    if (!all.length) return showPack3Toast('⚠️ គ្មានទិន្នន័យផ្ញើលក់ទេ!', true);
                    let inDue = 0, outDue = 0;
                    const lines = all.slice(0, 12).map((r, i) => {
                        const c = calcRow(r);
                        if (r.direction === 'in') inDue += c.balance; else outDue += c.balance;
                        return `${i + 1}. [${r.direction === 'in' ? 'ទទួល' : 'ផ្ញើ'}] <b>${escHtml(r.partner)}</b> — ${escHtml(r.itemName)} (លក់ ${c.sold}/${c.qty}, នៅសល់ទូទាត់ <b>$${c.balance.toFixed(2)}</b>)`;
                    }).join('\n');
                    const res = await sendTgMsg(
                        `🤝 <b>របាយការណ៍ទំនិញផ្ញើលក់ (Consignment)</b>\n🏪 សាខា៖ <b>${escHtml(getBranchId())}</b>\n` +
                        `📥 ត្រូវសង Supplier៖ <b>$${inDue.toFixed(2)}</b>\n📤 ត្រូវទារពីដៃគូ៖ <b>$${outDue.toFixed(2)}</b>\n\n${lines}`
                    );
                    if (res.ok) showPack3Toast('✈️ បានផ្ញើរបាយការណ៍ផ្ញើលក់ចូល Telegram ជោគជ័យ!');
                    else showPack3Toast('⚠️ សូមកំណត់ Telegram Bot Token & Chat ID ជាមុនសិន!', true);
                }
            };

            registerInPosToolbox('🤝', 'គ្រប់គ្រងទំនិញផ្ញើលក់ (Consignment)', () => window.SKMP3Consign.open('list'));
        })();
    }

    // ========================================================================
    // [4/6] 💵 ប្រព័ន្ធបើកប្រាក់ខែបុគ្គលិក Pro (Payroll Auto-Calc + Payslip + Telegram)
    // ទាញបុគ្គលិកពី user_accounts + ទិន្នន័យវត្តមាន/នាទីយឺតពី Attendance Pro + លក់ពី POS (Commission)
    // គ្មាន Query ទៅ Supabase បន្ថែម (0 Bytes Supabase Egress)
    // ========================================================================
    if (pack3State.payrollPro !== false) {
        (function initPayrollProPlugin() {
            const loadProfiles = () => loadP3Data('p3_payroll_profiles', 'p3PayrollProfiles', {});
            const saveProfiles = (obj) => saveP3Data('p3_payroll_profiles', 'p3PayrollProfiles', obj);
            const loadRuns = () => loadP3Data('p3_payroll_runs', 'p3PayrollRuns', {});
            const saveRuns = (obj) => saveP3Data('p3_payroll_runs', 'p3PayrollRuns', obj);
            const loadCfg = () => loadP3Data('p3_payroll_cfg', 'p3PayrollCfg', { latePenaltyPerMin: 0.05, defaultCommPct: 0, currencyRate: 4000 });
            const saveCfg = (obj) => saveP3Data('p3_payroll_cfg', 'p3PayrollCfg', obj);

            function getCurMonth() {
                const d = new Date();
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            }

            function getStaffAccounts() {
                const br = getBranchId();
                let list = Array.isArray(window.userAccounts) ? window.userAccounts : [];
                if (!list.length) {
                    try { list = JSON.parse(localStorage.getItem(`ks2_${br}_auth_users_pro`) || '[]'); } catch (e) {}
                }
                const profiles = loadProfiles();
                const merged = [];
                const seen = new Set();
                list.forEach(u => {
                    if (!u) return;
                    const nm = String(u.fullName || u.name || u.username || '').trim();
                    if (!nm || seen.has(nm.toLowerCase())) return;
                    seen.add(nm.toLowerCase());
                    merged.push({ id: String(u.id || nm), name: nm, username: String(u.username || ''), role: String(u.role || 'staff') });
                });
                Object.keys(profiles).forEach(k => {
                    const p = profiles[k];
                    if (p && p.name && !seen.has(p.name.toLowerCase())) {
                        seen.add(p.name.toLowerCase());
                        merged.push({ id: k, name: p.name, username: '', role: p.role || 'staff' });
                    }
                });
                return merged;
            }

            function computePayrollRows(ym) {
                const br = getBranchId();
                const staff = getStaffAccounts();
                const profiles = loadProfiles();
                const cfg = loadCfg();
                const runs = loadRuns();
                const monthPaidMap = runs[ym] || {};

                let attLogs = [];
                try { attLogs = JSON.parse(localStorage.getItem(`ks2_${br}_staff_attendance_logs`) || '[]'); } catch (e) {}
                const monthAtt = attLogs.filter(x => x && String(x.work_date || '').startsWith(ym));

                let invs = Array.isArray(window.invoices) ? window.invoices : [];
                if (!invs.length) {
                    try { invs = JSON.parse(localStorage.getItem(`ks2_${br}_invoices_pro`) || '[]'); } catch (e) {}
                }

                return staff.map(u => {
                    const prof = profiles[u.id] || profiles[u.name] || {
                        name: u.name, role: u.role, baseSalary: 200, allowance: 0, commPct: Number(cfg.defaultCommPct || 0), advance: 0, bonus: 0
                    };
                    const uLower = u.name.toLowerCase();
                    const uUser = u.username.toLowerCase();

                    // Match attendance logs for this month
                    const myAtt = monthAtt.filter(a => {
                        const sn = String(a.staff_name || '').toLowerCase();
                        return sn === uLower || (uUser && sn === uUser) || String(a.staff_id || '') === u.id;
                    });
                    const daysWorked = myAtt.length;
                    const workedMins = myAtt.reduce((s, a) => s + Number(a.worked_minutes || 0), 0);
                    const lateMins = myAtt.reduce((s, a) => s + Number(a.late_minutes || 0), 0);

                    // Match paid sales for this month
                    let salesTotal = 0;
                    invs.forEach(inv => {
                        if (!inv) return;
                        const st = String(inv.status || '').toLowerCase();
                        if (st === 'cancelled' || st === 'void' || st === 'refunded') return;
                        const ts = typeof inv.timestamp === 'number' ? inv.timestamp : Date.parse(inv.date || '');
                        if (!ts || isNaN(ts)) return;
                        const d = new Date(ts);
                        const invYm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                        if (invYm !== ym) return;
                        const seller = String(inv.seller || inv.cashier || '').toLowerCase();
                        if (seller && (seller === uLower || (uUser && seller === uUser))) {
                            salesTotal += Number(inv.totalAmount ?? inv.total ?? 0);
                        }
                    });

                    const base = Math.max(0, Number(prof.baseSalary || 0));
                    const allowance = Math.max(0, Number(prof.allowance || 0));
                    const bonus = Math.max(0, Number(prof.bonus || 0));
                    const commPct = Math.max(0, Number(prof.commPct || 0));
                    const commission = Number((salesTotal * commPct / 100).toFixed(2));
                    const lateDeduct = Number((lateMins * Math.max(0, Number(cfg.latePenaltyPerMin || 0))).toFixed(2));
                    const advance = Math.max(0, Number(prof.advance || 0));
                    const netSalary = Math.max(0, Number((base + allowance + bonus + commission - lateDeduct - advance).toFixed(2)));
                    const paidInfo = monthPaidMap[u.id] || null;

                    return {
                        id: u.id, name: u.name, role: u.role,
                        daysWorked, workedHrs: (workedMins / 60).toFixed(1), lateMins,
                        salesTotal: Number(salesTotal.toFixed(2)), commPct, commission,
                        base, allowance, bonus, lateDeduct, advance, netSalary,
                        paid: Boolean(paidInfo && paidInfo.paid),
                        paidAt: paidInfo ? paidInfo.paidAt : ''
                    };
                });
            }

            function ensureModal() {
                if (document.getElementById('skmP3PayModal')) return;
                injectPack3Styles();
                const m = document.createElement('div');
                m.id = 'skmP3PayModal';
                m.className = 'skm-p3-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p3-box" style="max-width:1020px;">
                        <div class="skm-p3-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#34d399;">💵 ប្រព័ន្ធបើកប្រាក់ខែបុគ្គលិក Pro (Payroll Auto-Calc)</div>
                                <div style="font-size:11.5px;color:#94a3b8;">ទាញវត្តមាន & នាទីយឺត + កម្រៃជើងសារលក់អូតូ ➔ គណនាប្រាក់ខែសុទ្ធ & ព្រីនក្រដាសបើកប្រាក់ខែ (Payslip)</div>
                            </div>
                            <button class="skm-p3-btn red" onclick="document.getElementById('skmP3PayModal').classList.remove('open')">✕ បិទ</button>
                        </div>
                        <div class="skm-p3-tabs">
                            <button class="skm-p3-tab active" data-t="sheet" onclick="window.SKMP3Payroll.tab('sheet')">📋 តារាងបើកប្រាក់ខែ</button>
                            <button class="skm-p3-tab" data-t="staff" onclick="window.SKMP3Payroll.tab('staff')">👤 កំណត់ប្រាក់ខែគោល & ថែមបុគ្គលិក</button>
                            <button class="skm-p3-tab" data-t="cfg" onclick="window.SKMP3Payroll.tab('cfg')">⚙️ កំណត់កាត់យឺត & អត្រា</button>
                        </div>
                        <div class="skm-p3-body">
                            <!-- TAB 1: PAYROLL SHEET -->
                            <div id="skmP3PayTab_sheet">
                                <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:12px;">
                                    <div style="display:flex;gap:8px;align-items:center;">
                                        <label style="font-size:12.5px;font-weight:800;">ខែបើកប្រាក់ខែ៖</label>
                                        <input type="month" id="skmP3PayMonth" class="skm-p3-input" style="width:auto;" onchange="window.SKMP3Payroll.renderSheet()">
                                    </div>
                                    <div style="display:flex;gap:7px;flex-wrap:wrap;">
                                        <button class="skm-p3-btn tg" onclick="window.SKMP3Payroll.sendTgSummary()">✈️ ផ្ញើសង្ខេប Telegram</button>
                                        <button class="skm-p3-btn gray" onclick="window.SKMP3Payroll.exportCsv()">📥 CSV</button>
                                    </div>
                                </div>
                                <div id="skmP3PayKpis" class="skm-p3-grid" style="margin-bottom:12px;"></div>
                                <div style="overflow-x:auto;max-height:340px;">
                                    <table class="skm-p3-table">
                                        <thead><tr><th>បុគ្គលិក</th><th>វត្តមាន/យឺត</th><th>គោល + ថែម</th><th>Commission</th><th>កាត់យឺត/បើកមុន</th><th>ប្រាក់ខែសុទ្ធ</th><th>សកម្មភាព</th></tr></thead>
                                        <tbody id="skmP3PayBody"></tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- TAB 2: STAFF SALARY PROFILES -->
                            <div id="skmP3PayTab_staff" style="display:none;">
                                <div class="skm-p3-card" style="margin-bottom:12px;">
                                    <strong style="font-size:13px;color:#38bdf8;display:block;margin-bottom:8px;">➕ បន្ថែមបុគ្គលិកក្រៅបញ្ជី POS (បើមាន ឧ. ចុងភៅ / សន្តិសុខ)</strong>
                                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                                        <input id="skmP3PayNewName" class="skm-p3-input" style="flex:1.5;min-width:150px;" placeholder="ឈ្មោះបុគ្គលិក...">
                                        <input id="skmP3PayNewRole" class="skm-p3-input" style="flex:1;min-width:110px;" placeholder="តួនាទី (ឧ. ចុងភៅ)">
                                        <input type="number" id="skmP3PayNewBase" class="skm-p3-input" style="width:120px;" placeholder="ប្រាក់ខែ ($)" value="200">
                                        <button class="skm-p3-btn green" onclick="window.SKMP3Payroll.addExtraStaff()">➕ បន្ថែម</button>
                                    </div>
                                </div>
                                <div style="overflow-x:auto;max-height:310px;">
                                    <table class="skm-p3-table">
                                        <thead><tr><th>ឈ្មោះបុគ្គលិក</th><th>ប្រាក់ខែគោល ($)</th><th>ប្រាក់ឧបត្ថម្ភ ($)</th><th>ប្រាក់រង្វាន់ ($)</th><th>Commission (%)</th><th>បើកមុន/កាត់ ($)</th></tr></thead>
                                        <tbody id="skmP3PayStaffBody"></tbody>
                                    </table>
                                </div>
                                <button class="skm-p3-btn green" style="width:100%;margin-top:10px;padding:11px;" onclick="window.SKMP3Payroll.saveStaffProfiles()">💾 រក្សាទុកប្រាក់ខែបុគ្គលិកទាំងអស់</button>
                            </div>

                            <!-- TAB 3: SETTINGS -->
                            <div id="skmP3PayTab_cfg" style="display:none;">
                                <div class="skm-p3-card">
                                    <div class="skm-p3-grid">
                                        <div><label class="skm-p3-label">កាត់ប្រាក់ពេលមកយឺត ($ ក្នុង ១ នាទី)</label><input type="number" step="0.01" min="0" id="skmP3PayLatePen" class="skm-p3-input" value="0.05"></div>
                                        <div><label class="skm-p3-label">ភាគរយ Commission លំនាំដើម (%)</label><input type="number" step="0.1" min="0" id="skmP3PayDefComm" class="skm-p3-input" value="0"></div>
                                        <div><label class="skm-p3-label">អត្រាប្តូរប្រាក់បង្ហាញលើ Payslip (៛/$)</label><input type="number" id="skmP3PayRate" class="skm-p3-input" value="4000"></div>
                                    </div>
                                    <button class="skm-p3-btn green" style="margin-top:14px;" onclick="window.SKMP3Payroll.saveCfgForm()">💾 រក្សាទុកការកំណត់</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
                document.getElementById('skmP3PayMonth').value = getCurMonth();
            }

            window.SKMP3Payroll = {
                open(defaultTab = 'sheet') {
                    ensureModal();
                    document.getElementById('skmP3PayModal').classList.add('open');
                    this.tab(defaultTab);
                },
                tab(t) {
                    ['sheet', 'staff', 'cfg'].forEach(k => {
                        const el = document.getElementById(`skmP3PayTab_${k}`);
                        if (el) el.style.display = (k === t) ? 'block' : 'none';
                    });
                    document.querySelectorAll('#skmP3PayModal .skm-p3-tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-t') === t));
                    if (t === 'sheet') this.renderSheet();
                    if (t === 'staff') this.renderStaffSetup();
                    if (t === 'cfg') {
                        const c = loadCfg();
                        document.getElementById('skmP3PayLatePen').value = c.latePenaltyPerMin ?? 0.05;
                        document.getElementById('skmP3PayDefComm').value = c.defaultCommPct ?? 0;
                        document.getElementById('skmP3PayRate').value = c.currencyRate || 4000;
                    }
                },
                renderSheet() {
                    const ym = document.getElementById('skmP3PayMonth')?.value || getCurMonth();
                    const rows = computePayrollRows(ym);
                    const totalNet = rows.reduce((s, r) => s + r.netSalary, 0);
                    const paidTot = rows.filter(r => r.paid).reduce((s, r) => s + r.netSalary, 0);
                    const unpaidTot = totalNet - paidTot;
                    const rate = Number(loadCfg().currencyRate || 4000);

                    document.getElementById('skmP3PayKpis').innerHTML = `
                        <div class="skm-p3-card" style="border-color:rgba(56,189,248,0.45);">
                            <div style="font-size:11px;color:#7dd3fc;">💵 សរុបប្រាក់ខែខែ ${escHtml(ym)}</div>
                            <div style="font-size:20px;font-weight:900;color:#38bdf8;">$${totalNet.toFixed(2)}</div>
                            <div style="font-size:11px;color:#94a3b8;">${Math.round(totalNet * rate).toLocaleString()} ៛ • ${rows.length} នាក់</div>
                        </div>
                        <div class="skm-p3-card" style="border-color:rgba(16,185,129,0.45);">
                            <div style="font-size:11px;color:#6ee7b7;">✅ បើករួចរាល់</div>
                            <div style="font-size:20px;font-weight:900;color:#34d399;">$${paidTot.toFixed(2)}</div>
                        </div>
                        <div class="skm-p3-card" style="border-color:rgba(245,158,11,0.45);">
                            <div style="font-size:11px;color:#fcd34d;">⏳ នៅសល់ត្រូវបើក</div>
                            <div style="font-size:20px;font-weight:900;color:#fbbf24;">$${unpaidTot.toFixed(2)}</div>
                        </div>
                    `;

                    const tb = document.getElementById('skmP3PayBody');
                    tb.innerHTML = rows.length ? rows.map(r => `
                        <tr>
                            <td><b>${escHtml(r.name)}</b><div style="font-size:10.5px;color:#94a3b8;">${escHtml(r.role)}</div></td>
                            <td>${r.daysWorked} ថ្ងៃ (${r.workedHrs}ម៉)<div style="font-size:10.5px;color:${r.lateMins > 0 ? '#fbbf24' : '#34d399'};">${r.lateMins > 0 ? 'យឺត ' + r.lateMins + ' នាទី' : 'ទាន់ម៉ោង'}</div></td>
                            <td>$${r.base.toFixed(2)}<div style="font-size:10.5px;color:#94a3b8;">+ឧប ${r.allowance} | រង្វាន់ ${r.bonus}</div></td>
                            <td><b style="color:#38bdf8;">$${r.commission.toFixed(2)}</b><div style="font-size:10.5px;color:#94a3b8;">${r.commPct}% នៃ $${r.salesTotal}</div></td>
                            <td style="color:#fca5a5;">-$${(r.lateDeduct + r.advance).toFixed(2)}<div style="font-size:10px;color:#94a3b8;">យឺត $${r.lateDeduct} | មុន $${r.advance}</div></td>
                            <td><b style="color:#34d399;font-size:15px;">$${r.netSalary.toFixed(2)}</b><div style="font-size:10px;color:#94a3b8;">${r.paid ? '✅ បើកហើយ' : '⏳ មិនទាន់បើក'}</div></td>
                            <td style="white-space:nowrap;">
                                <button class="skm-p3-btn ${r.paid ? 'gray' : 'green'}" style="padding:4px 8px;font-size:11px;" onclick="window.SKMP3Payroll.togglePaid('${escHtml(r.id)}')">${r.paid ? '↩️ ដកវិញ' : '✅ បើករួច'}</button>
                                <button class="skm-p3-btn blue" style="padding:4px 8px;font-size:11px;" onclick="window.SKMP3Payroll.printPayslip('${escHtml(r.id)}')">🖨️ Slip</button>
                            </td>
                        </tr>`).join('') : '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:22px;">មិនទាន់មានបញ្ជីបុគ្គលិកទេ (សូមបន្ថែមក្នុង Tab បុគ្គលិក)។</td></tr>';
                },
                renderStaffSetup() {
                    const staff = getStaffAccounts();
                    const profiles = loadProfiles();
                    const cfg = loadCfg();
                    const tb = document.getElementById('skmP3PayStaffBody');
                    tb.innerHTML = staff.map(u => {
                        const p = profiles[u.id] || profiles[u.name] || { baseSalary: 200, allowance: 0, bonus: 0, commPct: cfg.defaultCommPct || 0, advance: 0 };
                        return `<tr class="skm-p3-pay-row" data-id="${escHtml(u.id)}" data-name="${escHtml(u.name)}" data-role="${escHtml(u.role)}">
                            <td><b>${escHtml(u.name)}</b><div style="font-size:10.5px;color:#94a3b8;">${escHtml(u.role)}</div></td>
                            <td><input type="number" step="1" class="skm-p3-input p-base" value="${Number(p.baseSalary || 0)}" style="width:95px;padding:6px;"></td>
                            <td><input type="number" step="1" class="skm-p3-input p-allow" value="${Number(p.allowance || 0)}" style="width:85px;padding:6px;"></td>
                            <td><input type="number" step="1" class="skm-p3-input p-bonus" value="${Number(p.bonus || 0)}" style="width:85px;padding:6px;"></td>
                            <td><input type="number" step="0.1" class="skm-p3-input p-comm" value="${Number(p.commPct || 0)}" style="width:75px;padding:6px;"></td>
                            <td><input type="number" step="1" class="skm-p3-input p-adv" value="${Number(p.advance || 0)}" style="width:85px;padding:6px;"></td>
                        </tr>`;
                    }).join('');
                },
                addExtraStaff() {
                    const nm = document.getElementById('skmP3PayNewName').value.trim();
                    if (!nm) return showPack3Toast('⚠️ សូមវាយឈ្មោះបុគ្គលិក!', true);
                    const role = document.getElementById('skmP3PayNewRole').value.trim() || 'staff';
                    const base = Math.max(0, Number(document.getElementById('skmP3PayNewBase').value || 200));
                    const profiles = loadProfiles();
                    const id = 'STF_' + Date.now();
                    profiles[id] = { name: nm, role, baseSalary: base, allowance: 0, bonus: 0, commPct: 0, advance: 0 };
                    saveProfiles(profiles);
                    document.getElementById('skmP3PayNewName').value = '';
                    this.renderStaffSetup();
                    showPack3Toast(`✅ បានបន្ថែមបុគ្គលិក "${nm}"!`);
                },
                saveStaffProfiles() {
                    const profiles = loadProfiles();
                    document.querySelectorAll('.skm-p3-pay-row').forEach(tr => {
                        const id = tr.getAttribute('data-id');
                        profiles[id] = {
                            name: tr.getAttribute('data-name'),
                            role: tr.getAttribute('data-role'),
                            baseSalary: Math.max(0, Number(tr.querySelector('.p-base').value || 0)),
                            allowance: Math.max(0, Number(tr.querySelector('.p-allow').value || 0)),
                            bonus: Math.max(0, Number(tr.querySelector('.p-bonus').value || 0)),
                            commPct: Math.max(0, Number(tr.querySelector('.p-comm').value || 0)),
                            advance: Math.max(0, Number(tr.querySelector('.p-adv').value || 0))
                        };
                    });
                    saveProfiles(profiles);
                    showPack3Toast('✅ បានរក្សាទុកប្រាក់ខែគោលបុគ្គលិកជោគជ័យ!');
                    this.tab('sheet');
                },
                saveCfgForm() {
                    saveCfg({
                        latePenaltyPerMin: Math.max(0, Number(document.getElementById('skmP3PayLatePen').value || 0)),
                        defaultCommPct: Math.max(0, Number(document.getElementById('skmP3PayDefComm').value || 0)),
                        currencyRate: Math.max(100, Number(document.getElementById('skmP3PayRate').value || 4000))
                    });
                    showPack3Toast('✅ រក្សាទុកការកំណត់ Payroll ជោគជ័យ!');
                },
                togglePaid(staffId) {
                    const ym = document.getElementById('skmP3PayMonth')?.value || getCurMonth();
                    const runs = loadRuns();
                    if (!runs[ym]) runs[ym] = {};
                    const isPaid = Boolean(runs[ym][staffId] && runs[ym][staffId].paid);
                    runs[ym][staffId] = { paid: !isPaid, paidAt: !isPaid ? new Date().toLocaleDateString('en-GB') : '' };
                    saveRuns(runs);
                    this.renderSheet();
                },
                printPayslip(staffId) {
                    const ym = document.getElementById('skmP3PayMonth')?.value || getCurMonth();
                    const r = computePayrollRows(ym).find(x => x.id === staffId);
                    if (!r) return;
                    const rate = Number(loadCfg().currencyRate || 4000);
                    const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || 'SKM STORE';
                    const w = window.open('', '_blank', 'width=520,height=700');
                    if (!w) return;
                    w.document.write(`<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>Payslip ${escHtml(r.name)}</title>
                        <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap" rel="stylesheet">
                        <style>body{font-family:'Battambang',sans-serif;padding:24px;color:#0f172a;} .box{border:2px solid #059669;border-radius:16px;padding:20px;max-width:440px;margin:0 auto;} .row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px dashed #cbd5e1;font-size:13px;} .tot{display:flex;justify-content:space-between;font-size:16px;font-weight:700;margin-top:10px;padding-top:8px;border-top:2px solid #0f172a;color:#059669;} @media print{.np{display:none;}}</style></head><body>
                        <div class="box">
                            <h2 style="text-align:center;margin:0;color:#059669;">💵 ប័ណ្ណបើកប្រាក់ខែ (PAYSLIP)</h2>
                            <div style="text-align:center;font-weight:700;margin:4px 0 12px;">${escHtml(shop)} • ខែ ${escHtml(ym)}</div>
                            <div class="row"><span>ឈ្មោះបុគ្គលិក៖</span><b>${escHtml(r.name)} (${escHtml(r.role)})</b></div>
                            <div class="row"><span>វត្តមាន / ម៉ោងធ្វើការ៖</span><b>${r.daysWorked} ថ្ងៃ (${r.workedHrs} ម៉ោង)</b></div>
                            <div class="row"><span>ប្រាក់ខែគោល (Base)៖</span><b>$${r.base.toFixed(2)}</b></div>
                            <div class="row"><span>ប្រាក់ឧបត្ថម្ភ (Allowance)៖</span><b>+$${r.allowance.toFixed(2)}</b></div>
                            <div class="row"><span>ប្រាក់រង្វាន់ (Bonus)៖</span><b>+$${r.bonus.toFixed(2)}</b></div>
                            <div class="row"><span>កម្រៃជើងសារ (${r.commPct}%)៖</span><b>+$${r.commission.toFixed(2)}</b></div>
                            <div class="row"><span>កាត់មកយឺត (${r.lateMins} នាទី)៖</span><b style="color:#dc2626;">-$${r.lateDeduct.toFixed(2)}</b></div>
                            <div class="row"><span>បើកប្រាក់មុន / កាត់ផ្សេងៗ៖</span><b style="color:#dc2626;">-$${r.advance.toFixed(2)}</b></div>
                            <div class="tot"><span>ប្រាក់ខែសុទ្ធត្រូវបើក៖</span><span>$${r.netSalary.toFixed(2)} (${Math.round(r.netSalary * rate).toLocaleString()} ៛)</span></div>
                            <div style="display:flex;justify-content:space-between;margin-top:28px;text-align:center;font-size:12px;">
                                <div>អ្នកបើកប្រាក់<br><br>..................</div>
                                <div>អ្នកទទួលប្រាក់<br><br>..................</div>
                            </div>
                        </div>
                        <div style="text-align:center;margin-top:14px;"><button class="np" onclick="window.print()" style="padding:10px 22px;background:#059669;color:#fff;border:none;border-radius:10px;font-size:14px;cursor:pointer;">🖨️ បោះពុម្ព Payslip</button></div>
                        </body></html>`);
                    w.document.close();
                },
                async sendTgSummary() {
                    const ym = document.getElementById('skmP3PayMonth')?.value || getCurMonth();
                    const rows = computePayrollRows(ym);
                    if (!rows.length) return showPack3Toast('⚠️ គ្មានទិន្នន័យបុគ្គលិកទេ!', true);
                    const tot = rows.reduce((s, r) => s + r.netSalary, 0);
                    const lines = rows.map((r, i) => `${i + 1}. <b>${escHtml(r.name)}</b> — <b>$${r.netSalary.toFixed(2)}</b> ${r.paid ? '✅' : '⏳'} (${r.daysWorked}ថ្ងៃ)`).join('\n');
                    const res = await sendTgMsg(`💵 <b>សង្ខេបប្រាក់ខែបុគ្គលិក ខែ ${escHtml(ym)}</b>\n🏪 សាខា៖ <b>${escHtml(getBranchId())}</b>\n💰 សរុបត្រូវបើក៖ <b>$${tot.toFixed(2)}</b>\n\n${lines}`);
                    if (res.ok) showPack3Toast('✈️ បានផ្ញើសង្ខេបប្រាក់ខែចូល Telegram ជោគជ័យ!');
                    else showPack3Toast('⚠️ សូមកំណត់ Telegram Bot Token & Chat ID ជាមុនសិន!', true);
                },
                exportCsv() {
                    const ym = document.getElementById('skmP3PayMonth')?.value || getCurMonth();
                    const rows = computePayrollRows(ym);
                    const csvRows = [['Month', 'Staff', 'Role', 'Days', 'LateMins', 'Base', 'Allowance', 'Bonus', 'Commission', 'LateDeduct', 'Advance', 'NetSalary', 'Status'],
                        ...rows.map(r => [ym, r.name.replace(/,/g, ' '), r.role, r.daysWorked, r.lateMins, r.base, r.allowance, r.bonus, r.commission, r.lateDeduct, r.advance, r.netSalary, r.paid ? 'PAID' : 'UNPAID'])];
                    const blob = new Blob(['\uFEFF' + csvRows.map(x => x.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `SKM_Payroll_${getBranchId()}_${ym}.csv`; a.click();
                }
            };

            registerInPosToolbox('💵', 'ប្រព័ន្ធបើកប្រាក់ខែបុគ្គលិក (Payroll)', () => window.SKMP3Payroll.open('sheet'));
        })();
    }

    // ========================================================================
    // [5/6] 🏋️ កាតសមាជិក & កក់ម៉ោង (Member Pass QR Check-in & Court/Spa Booking)
    // សម្រាប់ Gym, តារាងវាយសី / Pickleball, Spa, សាឡន, បន្ទប់ KTV (0 Bytes Supabase Egress)
    // ========================================================================
    if (pack3State.memberPassBooking !== false) {
        (function initMemberPassBookingPlugin() {
            const loadMembers = () => loadP3Data('p3_members', 'p3Members', []);
            const saveMembers = (arr) => saveP3Data('p3_members', 'p3Members', arr.slice(0, 1000));
            const loadBookings = () => loadP3Data('p3_bookings', 'p3Bookings', []);
            const saveBookings = (arr) => saveP3Data('p3_bookings', 'p3Bookings', arr.slice(0, 800));
            const loadCheckins = () => loadP3Data('p3_member_checkins', 'p3MemberCheckins', []);
            const saveCheckins = (arr) => saveP3Data('p3_member_checkins', 'p3MemberCheckins', arr.slice(0, 500));
            const loadVenues = () => loadP3Data('p3_booking_venues', 'p3BookingVenues', ['តារាង 1 (Court 1)', 'តារាង 2 (Court 2)', 'តារាង 3 (Court 3)', 'បន្ទប់ VIP / Spa 1']);
            const saveVenues = (arr) => saveP3Data('p3_booking_venues', 'p3BookingVenues', arr);

            function addDaysIso(dateStr, days) {
                const d = dateStr ? new Date(dateStr) : new Date();
                d.setDate(d.getDate() + Number(days || 30));
                return d.toISOString().slice(0, 10);
            }

            function daysLeft(exp) {
                if (!exp) return null;
                return Math.ceil((new Date(exp).getTime() - Date.now()) / 86400000);
            }

            function ensureModal() {
                if (document.getElementById('skmP3MemModal')) return;
                injectPack3Styles();
                const m = document.createElement('div');
                m.id = 'skmP3MemModal';
                m.className = 'skm-p3-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p3-box" style="max-width:1020px;">
                        <div class="skm-p3-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#38bdf8;">🏋️ កាតសមាជិក & កក់ម៉ោង (Member Pass & Booking Pro)</div>
                                <div style="font-size:11.5px;color:#94a3b8;">កាតសមាជិក Gym/Spa (តាមខែ ឬតាមដង) • ស្កេន QR Check-in • តារាងកក់ម៉ោងតារាងវាយសី/បន្ទប់</div>
                            </div>
                            <button class="skm-p3-btn red" onclick="document.getElementById('skmP3MemModal').classList.remove('open')">✕ បិទ</button>
                        </div>
                        <div class="skm-p3-tabs">
                            <button class="skm-p3-tab active" data-t="checkin" onclick="window.SKMP3Member.tab('checkin')">✅ ស្កេន Check-in & សមាជិក</button>
                            <button class="skm-p3-tab" data-t="add_mem" onclick="window.SKMP3Member.tab('add_mem')">➕ ចុះឈ្មោះកាតសមាជិកថ្មី</button>
                            <button class="skm-p3-tab" data-t="booking" onclick="window.SKMP3Member.tab('booking')">📅 តារាងកក់ម៉ោង (Court/Spa)</button>
                            <button class="skm-p3-tab" data-t="logs" onclick="window.SKMP3Member.tab('logs')">📜 ប្រវត្តិ Check-in</button>
                        </div>
                        <div class="skm-p3-body">
                            <!-- TAB 1: CHECK-IN & MEMBERS -->
                            <div id="skmP3MemTab_checkin">
                                <div id="skmP3MemKpis" class="skm-p3-grid" style="margin-bottom:12px;"></div>
                                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
                                    <input id="skmP3MemScanInp" class="skm-p3-input" style="flex:1.5;min-width:200px;" placeholder="🔍 បាញ់បាកូដ/QR កាត ឬវាយឈ្មោះ/លេខទូរស័ព្ទ រួចចុច Enter ដើម្បី Check-in..." oninput="window.SKMP3Member.renderMembers()" onkeydown="if(event.key==='Enter') window.SKMP3Member.quickCheckinByInput()">
                                    <button class="skm-p3-btn green" onclick="window.SKMP3Member.quickCheckinByInput()">⚡ Check-in រហ័ស</button>
                                    <button class="skm-p3-btn gray" onclick="window.SKMP3Member.exportMembersCsv()">📥 CSV</button>
                                </div>
                                <div style="overflow-x:auto;max-height:310px;">
                                    <table class="skm-p3-table">
                                        <thead><tr><th>លេខកាត / ឈ្មោះ</th><th>កញ្ចប់</th><th>សុពលភាព / ចំនួនដង</th><th>ស្ថានភាព</th><th>សកម្មភាព</th></tr></thead>
                                        <tbody id="skmP3MemBody"></tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- TAB 2: ADD MEMBER -->
                            <div id="skmP3MemTab_add_mem" style="display:none;">
                                <div class="skm-p3-card">
                                    <div class="skm-p3-grid" style="margin-bottom:12px;">
                                        <div><label class="skm-p3-label">ឈ្មោះសមាជិក *</label><input id="skmP3MemName" class="skm-p3-input" placeholder="ឈ្មោះអតិថិជន"></div>
                                        <div><label class="skm-p3-label">លេខទូរស័ព្ទ *</label><input id="skmP3MemPhone" class="skm-p3-input" placeholder="012 345 678"></div>
                                        <div><label class="skm-p3-label">ប្រភេទកាតសមាជិក</label>
                                            <select id="skmP3MemType" class="skm-p3-select" onchange="window.SKMP3Member.onTypeChange()">
                                                <option value="time">📅 គិតតាមថ្ងៃ/ខែ (Unlimited Check-in)</option>
                                                <option value="visits">🎟️ គិតតាមចំនួនដង (Session Pass ឧ. ១០ ដង)</option>
                                            </select>
                                        </div>
                                        <div><label class="skm-p3-label">ឈ្មោះកញ្ចប់</label><input id="skmP3MemPlan" class="skm-p3-input" value="កញ្ចប់ ១ ខែ (30 Days)"></div>
                                        <div><label class="skm-p3-label">រយៈពេលសុពលភាព (ថ្ងៃ)</label><input type="number" min="1" id="skmP3MemDays" class="skm-p3-input" value="30"></div>
                                        <div id="skmP3MemVisitsWrap" style="display:none;"><label class="skm-p3-label">ចំនួនដងប្រើបាន (Visits)</label><input type="number" min="1" id="skmP3MemVisits" class="skm-p3-input" value="10"></div>
                                        <div><label class="skm-p3-label">តម្លៃកញ្ចប់ ($)</label><input type="number" step="0.01" id="skmP3MemPrice" class="skm-p3-input" value="35"></div>
                                        <div><label class="skm-p3-label">ថ្ងៃចាប់ផ្តើម</label><input type="date" id="skmP3MemStart" class="skm-p3-input"></div>
                                    </div>
                                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                                        <button class="skm-p3-btn green" style="flex:1;" onclick="window.SKMP3Member.saveMember(false)">💾 រក្សាទុកសមាជិកថ្មី</button>
                                        <button class="skm-p3-btn blue" style="flex:1;" onclick="window.SKMP3Member.saveMember(true)">🪪 រក្សាទុក & ព្រីនកាត QR</button>
                                    </div>
                                </div>
                            </div>

                            <!-- TAB 3: COURT / SPA BOOKING -->
                            <div id="skmP3MemTab_booking" style="display:none;">
                                <div class="skm-p3-card" style="margin-bottom:12px;">
                                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
                                        <strong style="font-size:13px;color:#fbbf24;">📅 កក់ម៉ោងតារាង / បន្ទប់ Spa</strong>
                                        <button class="skm-p3-btn gray" style="padding:4px 9px;font-size:11px;" onclick="window.SKMP3Member.editVenues()">⚙️ កែឈ្មោះតារាង/បន្ទប់</button>
                                    </div>
                                    <div class="skm-p3-grid" style="margin-bottom:10px;">
                                        <div><label class="skm-p3-label">ថ្ងៃកក់</label><input type="date" id="skmP3BkDate" class="skm-p3-input" onchange="window.SKMP3Member.renderBookings()"></div>
                                        <div><label class="skm-p3-label">តារាង / បន្ទប់</label><select id="skmP3BkVenue" class="skm-p3-select"></select></div>
                                        <div><label class="skm-p3-label">ម៉ោងចាប់ផ្តើម</label><input type="time" id="skmP3BkStart" class="skm-p3-input" value="17:00"></div>
                                        <div><label class="skm-p3-label">ម៉ោងបញ្ចប់</label><input type="time" id="skmP3BkEnd" class="skm-p3-input" value="18:00"></div>
                                        <div><label class="skm-p3-label">ឈ្មោះភ្ញៀវ *</label><input id="skmP3BkCust" class="skm-p3-input" placeholder="ឈ្មោះភ្ញៀវ"></div>
                                        <div><label class="skm-p3-label">លេខទូរស័ព្ទ</label><input id="skmP3BkPhone" class="skm-p3-input" placeholder="012..."></div>
                                        <div><label class="skm-p3-label">តម្លៃ ($)</label><input type="number" step="0.5" id="skmP3BkPrice" class="skm-p3-input" value="8"></div>
                                        <div style="display:flex;align-items:end;"><button class="skm-p3-btn green" style="width:100%;" onclick="window.SKMP3Member.addBooking()">➕ កក់ម៉ោងនេះ</button></div>
                                    </div>
                                </div>
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                    <strong style="font-size:12.5px;color:#38bdf8;">📋 បញ្ជីកក់ម៉ោងប្រចាំថ្ងៃ</strong>
                                    <button class="skm-p3-btn tg" style="padding:5px 10px;font-size:11.5px;" onclick="window.SKMP3Member.sendBookingTg()">✈️ ផ្ញើកាលវិភាគថ្ងៃនេះ Telegram</button>
                                </div>
                                <div style="overflow-x:auto;max-height:240px;">
                                    <table class="skm-p3-table">
                                        <thead><tr><th>តារាង/បន្ទប់</th><th>ម៉ោង</th><th>ភ្ញៀវ</th><th>តម្លៃ</th><th>ស្ថានភាព</th><th>សកម្មភាព</th></tr></thead>
                                        <tbody id="skmP3BkBody"></tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- TAB 4: CHECK-IN LOGS -->
                            <div id="skmP3MemTab_logs" style="display:none;">
                                <div id="skmP3MemLogsBox" style="display:flex;flex-direction:column;gap:7px;max-height:380px;overflow-y:auto;"></div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
            }

            window.SKMP3Member = {
                open(defaultTab = 'checkin') {
                    ensureModal();
                    const today = new Date().toISOString().slice(0, 10);
                    if (!document.getElementById('skmP3MemStart').value) document.getElementById('skmP3MemStart').value = today;
                    if (!document.getElementById('skmP3BkDate').value) document.getElementById('skmP3BkDate').value = today;
                    this.populateVenues();
                    document.getElementById('skmP3MemModal').classList.add('open');
                    this.tab(defaultTab);
                },
                tab(t) {
                    ['checkin', 'add_mem', 'booking', 'logs'].forEach(k => {
                        const el = document.getElementById(`skmP3MemTab_${k}`);
                        if (el) el.style.display = (k === t) ? 'block' : 'none';
                    });
                    document.querySelectorAll('#skmP3MemModal .skm-p3-tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-t') === t));
                    if (t === 'checkin') { this.renderMembers(); setTimeout(() => document.getElementById('skmP3MemScanInp')?.focus(), 60); }
                    if (t === 'booking') this.renderBookings();
                    if (t === 'logs') this.renderLogs();
                },
                onTypeChange() {
                    const isVisits = document.getElementById('skmP3MemType').value === 'visits';
                    document.getElementById('skmP3MemVisitsWrap').style.display = isVisits ? 'block' : 'none';
                    document.getElementById('skmP3MemPlan').value = isVisits ? 'កញ្ចប់ ១០ ដង (10 Visits)' : 'កញ្ចប់ ១ ខែ (30 Days)';
                },
                saveMember(alsoPrint) {
                    const name = document.getElementById('skmP3MemName').value.trim();
                    const phone = document.getElementById('skmP3MemPhone').value.trim();
                    if (!name) return showPack3Toast('⚠️ សូមបញ្ចូលឈ្មោះសមាជិក!', true);
                    const type = document.getElementById('skmP3MemType').value;
                    const days = Math.max(1, Number(document.getElementById('skmP3MemDays').value || 30));
                    const start = document.getElementById('skmP3MemStart').value || new Date().toISOString().slice(0, 10);
                    const visits = type === 'visits' ? Math.max(1, Number(document.getElementById('skmP3MemVisits').value || 10)) : 0;
                    const code = 'MEM-' + String(Date.now()).slice(-6);
                    const rec = {
                        id: code,
                        code,
                        name,
                        phone,
                        type,
                        planName: document.getElementById('skmP3MemPlan').value.trim() || 'Membership',
                        price: Number(document.getElementById('skmP3MemPrice').value || 0),
                        startDate: start,
                        expiryDate: addDaysIso(start, days),
                        totalVisits: visits,
                        remainingVisits: visits,
                        checkinCount: 0,
                        lastCheckin: ''
                    };
                    const list = loadMembers();
                    list.unshift(rec);
                    saveMembers(list);
                    document.getElementById('skmP3MemName').value = '';
                    document.getElementById('skmP3MemPhone').value = '';
                    showPack3Toast(`✅ ចុះឈ្មោះសមាជិក ${name} (${code}) ជោគជ័យ!`);
                    if (alsoPrint) this.printMemberCard(code);
                    this.tab('checkin');
                },
                renderMembers() {
                    const all = loadMembers();
                    const q = (document.getElementById('skmP3MemScanInp')?.value || '').trim().toLowerCase();
                    const activeCnt = all.filter(m => (daysLeft(m.expiryDate) ?? 0) >= 0 && (m.type !== 'visits' || m.remainingVisits > 0)).length;
                    const expSoonCnt = all.filter(m => { const d = daysLeft(m.expiryDate); return d !== null && d >= 0 && d <= 5; }).length;
                    const todayStr = new Date().toLocaleDateString('en-GB');
                    const todayChecks = loadCheckins().filter(c => c.date === todayStr).length;

                    document.getElementById('skmP3MemKpis').innerHTML = `
                        <div class="skm-p3-card" style="border-color:rgba(16,185,129,0.45);"><div style="font-size:11px;color:#6ee7b7;">🏋️ សមាជិកសកម្ម</div><div style="font-size:20px;font-weight:900;color:#34d399;">${activeCnt} / ${all.length}</div></div>
                        <div class="skm-p3-card" style="border-color:rgba(245,158,11,0.45);"><div style="font-size:11px;color:#fcd34d;">⚠️ ជិតផុតសុពលភាព (≤ 5 ថ្ងៃ)</div><div style="font-size:20px;font-weight:900;color:#fbbf24;">${expSoonCnt} នាក់</div></div>
                        <div class="skm-p3-card" style="border-color:rgba(56,189,248,0.45);"><div style="font-size:11px;color:#7dd3fc;">✅ ចូលហាត់/ប្រើថ្ងៃនេះ</div><div style="font-size:20px;font-weight:900;color:#38bdf8;">${todayChecks} ដង</div></div>
                    `;

                    const list = q ? all.filter(m => String(m.code).toLowerCase().includes(q) || String(m.name).toLowerCase().includes(q) || String(m.phone || '').includes(q)) : all;
                    const tb = document.getElementById('skmP3MemBody');
                    tb.innerHTML = list.length ? list.slice(0, 100).map(m => {
                        const dl = daysLeft(m.expiryDate);
                        const expired = (dl !== null && dl < 0) || (m.type === 'visits' && m.remainingVisits <= 0);
                        const badge = expired
                            ? '<span class="skm-p3-badge" style="background:rgba(239,68,68,0.22);color:#fca5a5;">❌ ផុតកំណត់</span>'
                            : (dl <= 5
                                ? `<span class="skm-p3-badge" style="background:rgba(245,158,11,0.22);color:#fcd34d;">⚠️ សល់ ${dl} ថ្ងៃ</span>`
                                : `<span class="skm-p3-badge" style="background:rgba(16,185,129,0.22);color:#34d399;">✅ សកម្ម (${dl}ថ្ងៃ)</span>`);
                        const sub = m.type === 'visits' ? `សល់ <b>${m.remainingVisits}/${m.totalVisits} ដង</b> • ដល់ ${m.expiryDate}` : `ដល់ <b>${m.expiryDate}</b> (ចូល ${m.checkinCount || 0} ដង)`;
                        return `<tr>
                            <td><b style="color:#38bdf8;font-family:monospace;">${escHtml(m.code)}</b> • <b>${escHtml(m.name)}</b><div style="font-size:10.5px;color:#94a3b8;">📞 ${escHtml(m.phone || '-')}</div></td>
                            <td>${escHtml(m.planName)}</td>
                            <td style="font-size:12px;">${sub}</td>
                            <td>${badge}</td>
                            <td style="white-space:nowrap;">
                                <button class="skm-p3-btn green" style="padding:4px 8px;font-size:11px;" onclick="window.SKMP3Member.checkin('${escHtml(m.code)}')">✅ Check-in</button>
                                <button class="skm-p3-btn amber" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Member.renew('${escHtml(m.code)}')" title="បន្តកាត">🔄</button>
                                <button class="skm-p3-btn blue" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Member.printMemberCard('${escHtml(m.code)}')" title="ព្រីនកាត QR">🪪</button>
                                <button class="skm-p3-btn red" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Member.removeMember('${escHtml(m.code)}')">🗑️</button>
                            </td>
                        </tr>`;
                    }).join('') : '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:22px;">មិនទាន់មានកាតសមាជិកទេ។</td></tr>';
                },
                quickCheckinByInput() {
                    const q = (document.getElementById('skmP3MemScanInp')?.value || '').trim().toLowerCase();
                    if (!q) return;
                    const match = loadMembers().find(m => String(m.code).toLowerCase() === q || String(m.phone || '').toLowerCase() === q || String(m.name).toLowerCase().includes(q));
                    if (!match) return showPack3Toast(`❌ រកមិនឃើញសមាជិក "${q}" ទេ!`, true);
                    this.checkin(match.code);
                    document.getElementById('skmP3MemScanInp').value = '';
                },
                checkin(code) {
                    const list = loadMembers();
                    const m = list.find(x => x.code === code);
                    if (!m) return;
                    const dl = daysLeft(m.expiryDate);
                    if (dl !== null && dl < 0) return showPack3Toast(`❌ កាតសមាជិក "${m.name}" ផុតកំណត់តាំងពី ${m.expiryDate} ហើយ! សូមបន្តកាត។`, true);
                    if (m.type === 'visits') {
                        if (m.remainingVisits <= 0) return showPack3Toast(`❌ កាតសមាជិក "${m.name}" អស់ចំនួនដងហើយ (0)! សូមបន្តកាត។`, true);
                        m.remainingVisits -= 1;
                    }
                    m.checkinCount = Number(m.checkinCount || 0) + 1;
                    m.lastCheckin = new Date().toLocaleString('km-KH');
                    saveMembers(list);

                    const logs = loadCheckins();
                    logs.unshift({ code: m.code, name: m.name, plan: m.planName, left: m.type === 'visits' ? `សល់ ${m.remainingVisits} ដង` : `សល់ ${dl} ថ្ងៃ`, date: new Date().toLocaleDateString('en-GB'), time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) });
                    saveCheckins(logs);
                    showPack3Toast(`✅ Check-in ជោគជ័យ៖ ${m.name} (${m.type === 'visits' ? 'សល់ ' + m.remainingVisits + ' ដង' : 'សល់ ' + dl + ' ថ្ងៃ'})!`);
                    this.renderMembers();
                },
                renew(code) {
                    const list = loadMembers();
                    const m = list.find(x => x.code === code);
                    if (!m) return;
                    const addDays = Number(prompt(`បន្តសុពលភាពសម្រាប់ "${m.name}" បន្ថែមប៉ុន្មានថ្ងៃ?`, '30') || 0);
                    if (addDays <= 0) return;
                    const baseDate = (daysLeft(m.expiryDate) ?? -1) > 0 ? m.expiryDate : new Date().toISOString().slice(0, 10);
                    m.expiryDate = addDaysIso(baseDate, addDays);
                    if (m.type === 'visits') {
                        const addV = Number(prompt('បន្ថែមចំនួនដងប្រើបាន (Visits)៖', String(m.totalVisits || 10)) || 0);
                        m.remainingVisits = Number(m.remainingVisits || 0) + Math.max(0, addV);
                    }
                    saveMembers(list);
                    showPack3Toast(`🔄 បានបន្តកាត "${m.name}" ដល់ ${m.expiryDate}!`);
                    this.renderMembers();
                },
                removeMember(code) {
                    if (!confirm('លុបកាតសមាជិកនេះ?')) return;
                    saveMembers(loadMembers().filter(x => x.code !== code));
                    this.renderMembers();
                },
                printMemberCard(code) {
                    const m = loadMembers().find(x => x.code === code);
                    if (!m) return;
                    const shop = localStorage.getItem(`ks2_${getBranchId()}_shop_name`) || window.shopName || 'SKM CLUB';
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=6&data=${encodeURIComponent(m.code)}`;
                    const w = window.open('', '_blank', 'width=480,height=620');
                    if (!w) return;
                    w.document.write(`<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>Member Card ${escHtml(m.code)}</title>
                        <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@700&display=swap" rel="stylesheet">
                        <style>body{font-family:'Battambang',sans-serif;text-align:center;padding:24px;color:#0f172a;} .card{border:3px solid #0284c7;border-radius:20px;padding:22px;max-width:340px;margin:0 auto;background:linear-gradient(135deg,#f8fafc,#e0f2fe);} @media print{.np{display:none;}}</style></head><body>
                        <div class="card">
                            <div style="font-size:13px;font-weight:700;color:#0284c7;">🪪 VIP MEMBER PASS</div>
                            <h2 style="margin:4px 0 8px;">${escHtml(shop)}</h2>
                            <img src="${qrUrl}" style="width:170px;height:170px;background:#fff;padding:6px;border-radius:12px;">
                            <div style="font-family:monospace;font-size:16px;font-weight:900;margin-top:6px;">${escHtml(m.code)}</div>
                            <div style="font-size:16px;font-weight:900;margin-top:4px;">${escHtml(m.name)}</div>
                            <div style="font-size:12.5px;color:#475569;">${escHtml(m.planName)} • ដល់ ${escHtml(m.expiryDate)}</div>
                        </div>
                        <button class="np" onclick="window.print()" style="margin-top:16px;padding:10px 22px;background:#0284c7;color:#fff;border:none;border-radius:10px;cursor:pointer;">🖨️ បោះពុម្ពកាត QR</button>
                        </body></html>`);
                    w.document.close();
                },
                populateVenues() {
                    const sel = document.getElementById('skmP3BkVenue');
                    if (!sel) return;
                    sel.innerHTML = loadVenues().map(v => `<option value="${escHtml(v)}">${escHtml(v)}</option>`).join('');
                },
                editVenues() {
                    const cur = loadVenues().join(', ');
                    const next = prompt('បញ្ជីឈ្មោះតារាង / បន្ទប់ (ខណ្ឌដោយសញ្ញាក្បៀស ",")៖', cur);
                    if (!next) return;
                    const arr = next.split(',').map(x => x.trim()).filter(Boolean);
                    if (arr.length) { saveVenues(arr); this.populateVenues(); showPack3Toast('✅ បានកែឈ្មោះតារាង/បន្ទប់!'); }
                },
                addBooking() {
                    const date = document.getElementById('skmP3BkDate').value || new Date().toISOString().slice(0, 10);
                    const venue = document.getElementById('skmP3BkVenue').value;
                    const start = document.getElementById('skmP3BkStart').value || '17:00';
                    const end = document.getElementById('skmP3BkEnd').value || '18:00';
                    const cust = document.getElementById('skmP3BkCust').value.trim();
                    if (!cust) return showPack3Toast('⚠️ សូមបញ្ចូលឈ្មោះភ្ញៀវ!', true);
                    if (end <= start) return showPack3Toast('⚠️ ម៉ោងបញ្ចប់ត្រូវធំជាងម៉ោងចាប់ផ្តើម!', true);

                    const list = loadBookings();
                    const clash = list.find(b => b.date === date && b.venue === venue && b.status !== 'cancelled' && !(end <= b.start || start >= b.end));
                    if (clash) return showPack3Toast(`❌ ជាន់ម៉ោង! ${venue} មានភ្ញៀវ "${clash.cust}" កក់ម៉ោង ${clash.start}-${clash.end} រួចហើយ!`, true);

                    list.unshift({
                        id: 'BK_' + Date.now(), date, venue, start, end, cust,
                        phone: document.getElementById('skmP3BkPhone').value.trim(),
                        price: Number(document.getElementById('skmP3BkPrice').value || 0),
                        status: 'booked'
                    });
                    saveBookings(list);
                    document.getElementById('skmP3BkCust').value = '';
                    showPack3Toast(`✅ កក់ ${venue} (${start}-${end}) ជូន "${cust}" ជោគជ័យ!`);
                    this.renderBookings();
                },
                renderBookings() {
                    const date = document.getElementById('skmP3BkDate')?.value || new Date().toISOString().slice(0, 10);
                    const list = loadBookings().filter(b => b.date === date).sort((a, b) => a.start.localeCompare(b.start));
                    const tb = document.getElementById('skmP3BkBody');
                    tb.innerHTML = list.length ? list.map(b => {
                        const stMap = { booked: '🟡 បានកក់', active: '🟢 កំពុងលេង/ប្រើ', done: '✅ បញ្ចប់', cancelled: '❌ បោះបង់' };
                        return `<tr>
                            <td><b>${escHtml(b.venue)}</b></td>
                            <td><b style="color:#38bdf8;">${escHtml(b.start)} – ${escHtml(b.end)}</b></td>
                            <td>${escHtml(b.cust)} <span style="font-size:11px;color:#94a3b8;">${escHtml(b.phone || '')}</span></td>
                            <td><b style="color:#34d399;">$${Number(b.price || 0).toFixed(2)}</b></td>
                            <td>${stMap[b.status] || b.status}</td>
                            <td style="white-space:nowrap;">
                                <button class="skm-p3-btn green" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Member.setBkStatus('${b.id}','done')">✅</button>
                                <button class="skm-p3-btn red" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Member.delBooking('${b.id}')">🗑️</button>
                            </td>
                        </tr>`;
                    }).join('') : '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:18px;">មិនទាន់មានការកក់ម៉ោងសម្រាប់ថ្ងៃនេះទេ។</td></tr>';
                },
                setBkStatus(id, st) {
                    const list = loadBookings();
                    const b = list.find(x => x.id === id);
                    if (b) { b.status = st; saveBookings(list); this.renderBookings(); }
                },
                delBooking(id) {
                    saveBookings(loadBookings().filter(x => x.id !== id));
                    this.renderBookings();
                },
                async sendBookingTg() {
                    const date = document.getElementById('skmP3BkDate')?.value || new Date().toISOString().slice(0, 10);
                    const list = loadBookings().filter(b => b.date === date && b.status !== 'cancelled').sort((a, b) => a.start.localeCompare(b.start));
                    if (!list.length) return showPack3Toast('⚠️ គ្មានការកក់ម៉ោងថ្ងៃនេះទេ!', true);
                    const lines = list.map((b, i) => `${i + 1}. <b>${escHtml(b.venue)}</b> | ${b.start}-${b.end} | ${escHtml(b.cust)} ($${Number(b.price || 0).toFixed(2)})`).join('\n');
                    const res = await sendTgMsg(`📅 <b>កាលវិភាគកក់ម៉ោង ថ្ងៃ ${escHtml(date)}</b>\n🏪 សាខា៖ <b>${escHtml(getBranchId())}</b>\n\n${lines}`);
                    if (res.ok) showPack3Toast('✈️ បានផ្ញើកាលវិភាគកក់ម៉ោងចូល Telegram!');
                    else showPack3Toast('⚠️ សូមកំណត់ Telegram Bot Token & Chat ID សិន!', true);
                },
                renderLogs() {
                    const logs = loadCheckins();
                    const box = document.getElementById('skmP3MemLogsBox');
                    box.innerHTML = logs.length ? logs.slice(0, 60).map(l => `
                        <div class="skm-p3-card" style="padding:9px 12px;display:flex;justify-content:space-between;align-items:center;font-size:12px;">
                            <div><b>${escHtml(l.name)}</b> (<code>${escHtml(l.code)}</code>) • ${escHtml(l.plan)}</div>
                            <div><span style="color:#34d399;font-weight:800;">${escHtml(l.left)}</span> • <span style="color:#94a3b8;">${escHtml(l.date)} ${escHtml(l.time)}</span></div>
                        </div>`).join('') : '<div style="text-align:center;color:#94a3b8;padding:24px;">មិនទាន់មានប្រវត្តិ Check-in ទេ។</div>';
                },
                exportMembersCsv() {
                    const list = loadMembers();
                    const rows = [['Code', 'Name', 'Phone', 'Type', 'Plan', 'Price', 'Start', 'Expiry', 'VisitsLeft', 'Checkins'],
                        ...list.map(m => [m.code, m.name.replace(/,/g, ' '), m.phone || '', m.type, m.planName.replace(/,/g, ' '), m.price, m.startDate, m.expiryDate, m.remainingVisits, m.checkinCount || 0])];
                    const blob = new Blob(['\uFEFF' + rows.map(x => x.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `SKM_Members_${getBranchId()}.csv`; a.click();
                }
            };

            registerInPosToolbox('🏋️', 'កាតសមាជិក & កក់ម៉ោង (Gym/Spa/តារាង)', () => window.SKMP3Member.open('checkin'));
        })();
    }

    // ========================================================================
    // [6/6] 🏠 គ្រប់គ្រងផ្ទះជួល / បន្ទប់ជួល (Rental & Utility Meter Billing + KHQR)
    // កត់កុងទ័រភ្លើង-ទឹកចាស់/ថ្មី ➔ គណនាថ្លៃបន្ទប់ + ភ្លើង + ទឹក + សំរាមអូតូ ➔ វិក្កយបត្រភ្ជាប់ Bakong KHQR + Telegram
    // គ្មាន Query ទៅ Supabase បន្ថែម (0 Bytes Supabase Egress)
    // ========================================================================
    if (pack3State.rentalBilling !== false) {
        (function initRentalBillingPlugin() {
            const loadRooms = () => loadP3Data('p3_rental_rooms', 'p3RentalRooms', []);
            const saveRooms = (arr) => saveP3Data('p3_rental_rooms', 'p3RentalRooms', arr.slice(0, 500));
            const loadBills = () => loadP3Data('p3_rental_bills', 'p3RentalBills', []);
            const saveBills = (arr) => saveP3Data('p3_rental_bills', 'p3RentalBills', arr.slice(0, 1500));
            const loadRates = () => loadP3Data('p3_rental_rates', 'p3RentalRates', { elecKhr: 1000, waterKhr: 2500, trashUsd: 2, wifiUsd: 0, exchangeRate: 4000 });
            const saveRates = (obj) => saveP3Data('p3_rental_rates', 'p3RentalRates', obj);

            function getCurMonth() {
                const d = new Date();
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            }

            function ensureModal() {
                if (document.getElementById('skmP3RentModal')) return;
                injectPack3Styles();
                const m = document.createElement('div');
                m.id = 'skmP3RentModal';
                m.className = 'skm-p3-overlay';
                m.onclick = (e) => { if (e.target === m) m.classList.remove('open'); };
                m.innerHTML = `
                    <div class="skm-p3-box" style="max-width:1020px;">
                        <div class="skm-p3-head">
                            <div>
                                <div style="font-size:16px;font-weight:900;color:#fbbf24;">🏠 គ្រប់គ្រងផ្ទះជួល / បន្ទប់ជួល (Rental & Utility Billing)</div>
                                <div style="font-size:11.5px;color:#94a3b8;">កត់លេខកុងទ័រភ្លើង-ទឹកអូតូ • គណនាថ្លៃបន្ទប់ + ទឹក + ភ្លើង + សំរាម • ព្រីនវិក្កយបត្រភ្ជាប់ Bakong KHQR</div>
                            </div>
                            <button class="skm-p3-btn red" onclick="document.getElementById('skmP3RentModal').classList.remove('open')">✕ បិទ</button>
                        </div>
                        <div class="skm-p3-tabs">
                            <button class="skm-p3-tab active" data-t="billing" onclick="window.SKMP3Rental.tab('billing')">🧾 គិតលុយប្រចាំខែ</button>
                            <button class="skm-p3-tab" data-t="rooms" onclick="window.SKMP3Rental.tab('rooms')">🚪 បញ្ជីបន្ទប់ & អ្នកជួល</button>
                            <button class="skm-p3-tab" data-t="rates" onclick="window.SKMP3Rental.tab('rates')">⚙️ កំណត់តម្លៃភ្លើង-ទឹក</button>
                        </div>
                        <div class="skm-p3-body">
                            <!-- TAB 1: MONTHLY BILLING -->
                            <div id="skmP3RentTab_billing">
                                <div id="skmP3RentKpis" class="skm-p3-grid" style="margin-bottom:12px;"></div>
                                <div class="skm-p3-card" style="margin-bottom:12px;">
                                    <div class="skm-p3-grid" style="margin-bottom:8px;">
                                        <div><label class="skm-p3-label">ខែវិក្កយបត្រ</label><input type="month" id="skmP3RentMonth" class="skm-p3-input" onchange="window.SKMP3Rental.renderBilling()"></div>
                                        <div><label class="skm-p3-label">ជ្រើសរើសបន្ទប់</label><select id="skmP3RentRoomSel" class="skm-p3-select" onchange="window.SKMP3Rental.onPickRoomForBill()"></select></div>
                                        <div><label class="skm-p3-label">ភ្លើងចាស់ ➔ ភ្លើងថ្មី (kWh)</label>
                                            <div style="display:flex;gap:5px;">
                                                <input type="number" id="skmP3RentOldE" class="skm-p3-input" placeholder="ចាស់">
                                                <input type="number" id="skmP3RentNewE" class="skm-p3-input" placeholder="ថ្មី">
                                            </div>
                                        </div>
                                        <div><label class="skm-p3-label">ទឹកចាស់ ➔ ទឹកថ្មី (m³)</label>
                                            <div style="display:flex;gap:5px;">
                                                <input type="number" id="skmP3RentOldW" class="skm-p3-input" placeholder="ចាស់">
                                                <input type="number" id="skmP3RentNewW" class="skm-p3-input" placeholder="ថ្មី">
                                            </div>
                                        </div>
                                    </div>
                                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                                        <button class="skm-p3-btn green" onclick="window.SKMP3Rental.createBill()">🧾 បង្កើតវិក្កយបត្របន្ទប់នេះ</button>
                                        <button class="skm-p3-btn tg" onclick="window.SKMP3Rental.sendMonthTg()">✈️ ផ្ញើសង្ខេប Telegram</button>
                                        <button class="skm-p3-btn gray" onclick="window.SKMP3Rental.exportCsv()">📥 CSV</button>
                                    </div>
                                </div>
                                <div style="overflow-x:auto;max-height:260px;">
                                    <table class="skm-p3-table">
                                        <thead><tr><th>បន្ទប់ / អ្នកជួល</th><th>ថ្លៃបន្ទប់</th><th>ភ្លើង (kWh)</th><th>ទឹក (m³)</th><th>សរុបត្រូវបង់</th><th>ស្ថានភាព</th><th>សកម្មភាព</th></tr></thead>
                                        <tbody id="skmP3RentBillBody"></tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- TAB 2: ROOMS & TENANTS -->
                            <div id="skmP3RentTab_rooms" style="display:none;">
                                <div class="skm-p3-card" style="margin-bottom:12px;">
                                    <div class="skm-p3-grid" style="margin-bottom:10px;">
                                        <div><label class="skm-p3-label">លេខបន្ទប់ / តូប *</label><input id="skmP3RmNo" class="skm-p3-input" placeholder="ឧ. A-101 ឬ បន្ទប់ 1"></div>
                                        <div><label class="skm-p3-label">ឈ្មោះអ្នកជួល</label><input id="skmP3RmTenant" class="skm-p3-input" placeholder="ឈ្មោះអ្នកស្នាក់នៅ"></div>
                                        <div><label class="skm-p3-label">លេខទូរស័ព្ទ</label><input id="skmP3RmPhone" class="skm-p3-input" placeholder="012..."></div>
                                        <div><label class="skm-p3-label">ថ្លៃជួល/ខែ ($)</label><input type="number" step="1" id="skmP3RmRent" class="skm-p3-input" value="80"></div>
                                        <div><label class="skm-p3-label">ប្រាក់កក់ ($)</label><input type="number" step="1" id="skmP3RmDep" class="skm-p3-input" value="80"></div>
                                        <div><label class="skm-p3-label">កុងទ័រភ្លើងដើម / ទឹកដើម</label>
                                            <div style="display:flex;gap:5px;">
                                                <input type="number" id="skmP3RmInitE" class="skm-p3-input" value="0" placeholder="ភ្លើង">
                                                <input type="number" id="skmP3RmInitW" class="skm-p3-input" value="0" placeholder="ទឹក">
                                            </div>
                                        </div>
                                    </div>
                                    <button class="skm-p3-btn green" style="width:100%;" onclick="window.SKMP3Rental.saveRoom()">💾 បន្ថែម / អាប់ដេតបន្ទប់ជួល</button>
                                </div>
                                <div style="overflow-x:auto;max-height:260px;">
                                    <table class="skm-p3-table">
                                        <thead><tr><th>បន្ទប់</th><th>អ្នកជួល</th><th>ថ្លៃជួល/ខែ</th><th>ប្រាក់កក់</th><th>កុងទ័រចុងក្រោយ</th><th>សកម្មភាព</th></tr></thead>
                                        <tbody id="skmP3RmBody"></tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- TAB 3: UTILITY RATES -->
                            <div id="skmP3RentTab_rates" style="display:none;">
                                <div class="skm-p3-card">
                                    <div class="skm-p3-grid">
                                        <div><label class="skm-p3-label">តម្លៃភ្លើង (៛ / 1 kWh)</label><input type="number" id="skmP3RtElec" class="skm-p3-input" value="1000"></div>
                                        <div><label class="skm-p3-label">តម្លៃទឹក (៛ / 1 m³)</label><input type="number" id="skmP3RtWater" class="skm-p3-input" value="2500"></div>
                                        <div><label class="skm-p3-label">ថ្លៃសំរាម/អនាម័យ ($/ខែ)</label><input type="number" step="0.5" id="skmP3RtTrash" class="skm-p3-input" value="2"></div>
                                        <div><label class="skm-p3-label">ថ្លៃ Wi-Fi ឬ ចំណត ($/ខែ)</label><input type="number" step="0.5" id="skmP3RtWifi" class="skm-p3-input" value="0"></div>
                                        <div><label class="skm-p3-label">អត្រាប្តូរប្រាក់ (៛ / $)</label><input type="number" id="skmP3RtEx" class="skm-p3-input" value="4000"></div>
                                    </div>
                                    <button class="skm-p3-btn green" style="margin-top:14px;" onclick="window.SKMP3Rental.saveRatesForm()">💾 រក្សាទុកតម្លៃទឹក-ភ្លើង</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(m);
                document.getElementById('skmP3RentMonth').value = getCurMonth();
            }

            window.SKMP3Rental = {
                open(defaultTab = 'billing') {
                    ensureModal();
                    document.getElementById('skmP3RentModal').classList.add('open');
                    this.tab(defaultTab);
                },
                tab(t) {
                    ['billing', 'rooms', 'rates'].forEach(k => {
                        const el = document.getElementById(`skmP3RentTab_${k}`);
                        if (el) el.style.display = (k === t) ? 'block' : 'none';
                    });
                    document.querySelectorAll('#skmP3RentModal .skm-p3-tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-t') === t));
                    if (t === 'billing') this.renderBilling();
                    if (t === 'rooms') this.renderRooms();
                    if (t === 'rates') {
                        const r = loadRates();
                        document.getElementById('skmP3RtElec').value = r.elecKhr || 1000;
                        document.getElementById('skmP3RtWater').value = r.waterKhr || 2500;
                        document.getElementById('skmP3RtTrash').value = r.trashUsd ?? 2;
                        document.getElementById('skmP3RtWifi').value = r.wifiUsd ?? 0;
                        document.getElementById('skmP3RtEx').value = r.exchangeRate || 4000;
                    }
                },
                saveRoom() {
                    const roomNo = document.getElementById('skmP3RmNo').value.trim();
                    if (!roomNo) return showPack3Toast('⚠️ សូមបញ្ចូលលេខបន្ទប់!', true);
                    const rooms = loadRooms();
                    const rec = {
                        id: 'RM_' + roomNo.replace(/[^a-zA-Z0-9]/g, '_'),
                        roomNo,
                        tenant: document.getElementById('skmP3RmTenant').value.trim() || 'ទំនេរ',
                        phone: document.getElementById('skmP3RmPhone').value.trim(),
                        rentUsd: Math.max(0, Number(document.getElementById('skmP3RmRent').value || 0)),
                        depositUsd: Math.max(0, Number(document.getElementById('skmP3RmDep').value || 0)),
                        lastElec: Math.max(0, Number(document.getElementById('skmP3RmInitE').value || 0)),
                        lastWater: Math.max(0, Number(document.getElementById('skmP3RmInitW').value || 0))
                    };
                    const idx = rooms.findIndex(x => x.roomNo.toLowerCase() === roomNo.toLowerCase());
                    if (idx >= 0) rooms[idx] = Object.assign(rooms[idx], rec);
                    else rooms.push(rec);
                    saveRooms(rooms);
                    document.getElementById('skmP3RmNo').value = '';
                    document.getElementById('skmP3RmTenant').value = '';
                    showPack3Toast(`✅ រក្សាទុកបន្ទប់ "${roomNo}" ជោគជ័យ!`);
                    this.renderRooms();
                },
                renderRooms() {
                    const rooms = loadRooms();
                    const tb = document.getElementById('skmP3RmBody');
                    tb.innerHTML = rooms.length ? rooms.map(r => `<tr>
                        <td><b style="color:#fbbf24;">${escHtml(r.roomNo)}</b></td>
                        <td><b>${escHtml(r.tenant)}</b><div style="font-size:10.5px;color:#94a3b8;">${escHtml(r.phone || '-')}</div></td>
                        <td><b style="color:#34d399;">$${Number(r.rentUsd).toFixed(2)}</b></td>
                        <td>$${Number(r.depositUsd || 0).toFixed(2)}</td>
                        <td style="font-size:12px;">⚡ ${r.lastElec} kWh | 💧 ${r.lastWater} m³</td>
                        <td><button class="skm-p3-btn red" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Rental.delRoom('${escHtml(r.roomNo)}')">🗑️</button></td>
                    </tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:20px;">មិនទាន់មានបន្ទប់ជួលទេ — សូមបន្ថែមខាងលើ!</td></tr>';
                },
                delRoom(roomNo) {
                    if (!confirm(`លុបបន្ទប់ "${roomNo}"?`)) return;
                    saveRooms(loadRooms().filter(x => x.roomNo !== roomNo));
                    this.renderRooms();
                },
                onPickRoomForBill() {
                    const roomNo = document.getElementById('skmP3RentRoomSel')?.value || '';
                    const rm = loadRooms().find(x => x.roomNo === roomNo);
                    if (!rm) return;
                    document.getElementById('skmP3RentOldE').value = rm.lastElec || 0;
                    document.getElementById('skmP3RentNewE').value = rm.lastElec || 0;
                    document.getElementById('skmP3RentOldW').value = rm.lastWater || 0;
                    document.getElementById('skmP3RentNewW').value = rm.lastWater || 0;
                },
                createBill() {
                    const ym = document.getElementById('skmP3RentMonth').value || getCurMonth();
                    const roomNo = document.getElementById('skmP3RentRoomSel').value;
                    const rooms = loadRooms();
                    const rm = rooms.find(x => x.roomNo === roomNo);
                    if (!rm) return showPack3Toast('⚠️ សូមបង្កើត និងជ្រើសរើសបន្ទប់ជាមុនសិន!', true);

                    const oldE = Number(document.getElementById('skmP3RentOldE').value || 0);
                    const newE = Number(document.getElementById('skmP3RentNewE').value || 0);
                    const oldW = Number(document.getElementById('skmP3RentOldW').value || 0);
                    const newW = Number(document.getElementById('skmP3RentNewW').value || 0);
                    if (newE < oldE || newW < oldW) return showPack3Toast('⚠️ លេខកុងទ័រថ្មីមិនអាចតូចជាងលេខចាស់ទេ!', true);

                    const rt = loadRates();
                    const ex = Math.max(100, Number(rt.exchangeRate || 4000));
                    const usedE = newE - oldE;
                    const usedW = newW - oldW;
                    const elecKhr = usedE * Number(rt.elecKhr || 1000);
                    const waterKhr = usedW * Number(rt.waterKhr || 2500);
                    const extraUsd = Number(rt.trashUsd || 0) + Number(rt.wifiUsd || 0);
                    const totalUsd = Number((Number(rm.rentUsd || 0) + extraUsd + (elecKhr + waterKhr) / ex).toFixed(2));

                    const bill = {
                        id: `RENT_${ym}_${rm.roomNo.replace(/[^a-zA-Z0-9]/g, '_')}`,
                        month: ym, roomNo: rm.roomNo, tenant: rm.tenant, phone: rm.phone,
                        rentUsd: Number(rm.rentUsd || 0), oldE, newE, usedE, elecKhr,
                        oldW, newW, usedW, waterKhr, extraUsd, exRate: ex,
                        totalUsd, totalKhr: Math.round(totalUsd * ex), paid: false
                    };
                    const bills = loadBills();
                    const bIdx = bills.findIndex(x => x.id === bill.id);
                    if (bIdx >= 0) bills[bIdx] = bill; else bills.unshift(bill);
                    saveBills(bills);

                    // Advance room's latest meter readings automatically!
                    rm.lastElec = newE;
                    rm.lastWater = newW;
                    saveRooms(rooms);

                    showPack3Toast(`🧾 បង្កើតវិក្កយបត្របន្ទប់ ${rm.roomNo} ($${totalUsd.toFixed(2)}) ជោគជ័យ!`);
                    this.renderBilling();
                },
                renderBilling() {
                    const ym = document.getElementById('skmP3RentMonth')?.value || getCurMonth();
                    const rooms = loadRooms();
                    const sel = document.getElementById('skmP3RentRoomSel');
                    const curVal = sel.value;
                    sel.innerHTML = rooms.length
                        ? rooms.map(r => `<option value="${escHtml(r.roomNo)}">${escHtml(r.roomNo)} — ${escHtml(r.tenant)} ($${r.rentUsd})</option>`).join('')
                        : '<option value="">-- សូមបន្ថែមបន្ទប់ក្នុង Tab បញ្ជីបន្ទប់ --</option>';
                    if (curVal && rooms.some(r => r.roomNo === curVal)) sel.value = curVal;
                    this.onPickRoomForBill();

                    const monthBills = loadBills().filter(b => b.month === ym);
                    const totUsd = monthBills.reduce((s, b) => s + Number(b.totalUsd || 0), 0);
                    const paidUsd = monthBills.filter(b => b.paid).reduce((s, b) => s + Number(b.totalUsd || 0), 0);

                    document.getElementById('skmP3RentKpis').innerHTML = `
                        <div class="skm-p3-card" style="border-color:rgba(56,189,248,0.45);"><div style="font-size:11px;color:#7dd3fc;">🧾 សរុបវិក្កយបត្រខែ ${escHtml(ym)}</div><div style="font-size:20px;font-weight:900;color:#38bdf8;">$${totUsd.toFixed(2)}</div><div style="font-size:11px;color:#94a3b8;">${monthBills.length} / ${rooms.length} បន្ទប់</div></div>
                        <div class="skm-p3-card" style="border-color:rgba(16,185,129,0.45);"><div style="font-size:11px;color:#6ee7b7;">✅ ទូទាត់រួច</div><div style="font-size:20px;font-weight:900;color:#34d399;">$${paidUsd.toFixed(2)}</div></div>
                        <div class="skm-p3-card" style="border-color:rgba(245,158,11,0.45);"><div style="font-size:11px;color:#fcd34d;">⏳ នៅជំពាក់</div><div style="font-size:20px;font-weight:900;color:#fbbf24;">$${(totUsd - paidUsd).toFixed(2)}</div></div>
                    `;

                    const tb = document.getElementById('skmP3RentBillBody');
                    tb.innerHTML = monthBills.length ? monthBills.map(b => `<tr>
                        <td><b style="color:#fbbf24;">${escHtml(b.roomNo)}</b> • ${escHtml(b.tenant)}</td>
                        <td>$${b.rentUsd.toFixed(2)}</td>
                        <td style="font-size:11.5px;">${b.usedE} kWh<div style="color:#94a3b8;">${b.elecKhr.toLocaleString()} ៛</div></td>
                        <td style="font-size:11.5px;">${b.usedW} m³<div style="color:#94a3b8;">${b.waterKhr.toLocaleString()} ៛</div></td>
                        <td><b style="color:#34d399;font-size:14px;">$${b.totalUsd.toFixed(2)}</b><div style="font-size:10.5px;color:#94a3b8;">${b.totalKhr.toLocaleString()} ៛</div></td>
                        <td><span class="skm-p3-badge" style="background:${b.paid ? 'rgba(16,185,129,0.22);color:#34d399;' : 'rgba(245,158,11,0.22);color:#fcd34d;'}">${b.paid ? '✅ បង់រួច' : '⏳ មិនទាន់បង់'}</span></td>
                        <td style="white-space:nowrap;">
                            <button class="skm-p3-btn ${b.paid ? 'gray' : 'green'}" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Rental.toggleBillPaid('${escHtml(b.id)}')">${b.paid ? '↩️' : '✅ បង់'}</button>
                            <button class="skm-p3-btn blue" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Rental.printBill('${escHtml(b.id)}')" title="ព្រីនវិក្កយបត្រ + KHQR">🖨️</button>
                            <button class="skm-p3-btn tg" style="padding:4px 7px;font-size:11px;" onclick="window.SKMP3Rental.sendOneBillTg('${escHtml(b.id)}')" title="ផ្ញើវិក្កយបត្រ Telegram">✈️</button>
                        </td>
                    </tr>`).join('') : '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:20px;">មិនទាន់មានវិក្កយបត្រសម្រាប់ខែនេះទេ។</td></tr>';
                },
                toggleBillPaid(id) {
                    const bills = loadBills();
                    const b = bills.find(x => x.id === id);
                    if (b) { b.paid = !b.paid; saveBills(bills); this.renderBilling(); }
                },
                printBill(id) {
                    const b = loadBills().find(x => x.id === id);
                    if (!b) return;
                    const br = getBranchId();
                    const shop = localStorage.getItem(`ks2_${br}_shop_name`) || window.shopName || 'SKM RENTAL';
                    const phone = localStorage.getItem(`ks2_${br}_shop_phone`) || window.shopPhone || '';
                    const sys = window.sysSettings || JSON.parse(localStorage.getItem(`ks2_${br}_sys_settings`) || '{}');
                    let qrSrc = '';
                    if (sys.bakongId && typeof window.getBakongQrImageUrl === 'function') {
                        qrSrc = window.getBakongQrImageUrl(sys.bakongId, sys.bakongName || shop, b.totalUsd, 'USD');
                    } else {
                        qrSrc = sys.menuQR || localStorage.getItem(`ks2_${br}_shop_qr`) || window.shopQR || '';
                    }
                    const w = window.open('', '_blank', 'width=500,height=740');
                    if (!w) return;
                    w.document.write(`<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>វិក្កយបត្របន្ទប់ ${escHtml(b.roomNo)}</title>
                        <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap" rel="stylesheet">
                        <style>body{font-family:'Battambang',sans-serif;padding:22px;color:#0f172a;} .box{border:2px solid #0284c7;border-radius:16px;padding:20px;max-width:420px;margin:0 auto;} .row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px dashed #cbd5e1;font-size:13px;} .tot{display:flex;justify-content:space-between;font-size:16px;font-weight:700;margin-top:10px;padding-top:8px;border-top:2px solid #0f172a;color:#059669;} @media print{.np{display:none;}}</style></head><body>
                        <div class="box">
                            <h2 style="text-align:center;margin:0;color:#0284c7;">🏠 វិក្កយបត្រថ្លៃបន្ទប់ជួល</h2>
                            <div style="text-align:center;font-weight:700;margin:4px 0 12px;">${escHtml(shop)} ${phone ? '• ' + escHtml(phone) : ''}<br>ខែ ${escHtml(b.month)}</div>
                            <div class="row"><span>បន្ទប់ / អ្នកជួល៖</span><b>${escHtml(b.roomNo)} — ${escHtml(b.tenant)}</b></div>
                            <div class="row"><span>ថ្លៃជួលបន្ទប់ប្រចាំខែ៖</span><b>$${b.rentUsd.toFixed(2)}</b></div>
                            <div class="row"><span>⚡ ភ្លើង (${b.oldE} ➔ ${b.newE} = ${b.usedE} kWh)៖</span><b>${b.elecKhr.toLocaleString()} ៛</b></div>
                            <div class="row"><span>💧 ទឹក (${b.oldW} ➔ ${b.newW} = ${b.usedW} m³)៖</span><b>${b.waterKhr.toLocaleString()} ៛</b></div>
                            ${b.extraUsd > 0 ? `<div class="row"><span>🗑️ សំរាម / Wi-Fi៖</span><b>$${b.extraUsd.toFixed(2)}</b></div>` : ''}
                            <div class="tot"><span>សរុបត្រូវបង់៖</span><span>$${b.totalUsd.toFixed(2)} (${b.totalKhr.toLocaleString()} ៛)</span></div>
                            ${qrSrc ? `<div style="text-align:center;margin-top:14px;"><div style="font-size:12px;font-weight:700;color:#0284c7;margin-bottom:4px;">📱 ស្កេន KHQR ដើម្បីទូទាត់</div><img src="${qrSrc}" style="width:170px;height:170px;object-fit:contain;border:1px solid #e2e8f0;border-radius:10px;padding:4px;"></div>` : ''}
                        </div>
                        <div style="text-align:center;margin-top:14px;"><button class="np" onclick="window.print()" style="padding:10px 22px;background:#0284c7;color:#fff;border:none;border-radius:10px;font-size:14px;cursor:pointer;">🖨️ បោះពុម្ពវិក្កយបត្រ</button></div>
                        </body></html>`);
                    w.document.close();
                },
                async sendOneBillTg(id) {
                    const b = loadBills().find(x => x.id === id);
                    if (!b) return;
                    const msg = `🏠 <b>វិក្កយបត្របន្ទប់ ${escHtml(b.roomNo)} (ខែ ${escHtml(b.month)})</b>\n👤 អ្នកជួល៖ <b>${escHtml(b.tenant)}</b>\n🛏️ ថ្លៃបន្ទប់៖ $${b.rentUsd.toFixed(2)}\n⚡ ភ្លើង (${b.oldE}→${b.newE} = ${b.usedE} kWh)៖ ${b.elecKhr.toLocaleString()} ៛\n💧 ទឹក (${b.oldW}→${b.newW} = ${b.usedW} m³)៖ ${b.waterKhr.toLocaleString()} ៛\n${b.extraUsd > 0 ? `🗑️ សំរាម/Wi-Fi៖ $${b.extraUsd.toFixed(2)}\n` : ''}💰 <b>សរុប៖ $${b.totalUsd.toFixed(2)} (${b.totalKhr.toLocaleString()} ៛)</b>`;
                    const res = await sendTgMsg(msg);
                    if (res.ok) showPack3Toast(`✈️ បានផ្ញើវិក្កយបត្របន្ទប់ ${b.roomNo} ចូល Telegram!`);
                    else showPack3Toast('⚠️ សូមកំណត់ Telegram Bot Token & Chat ID សិន!', true);
                },
                async sendMonthTg() {
                    const ym = document.getElementById('skmP3RentMonth')?.value || getCurMonth();
                    const list = loadBills().filter(b => b.month === ym);
                    if (!list.length) return showPack3Toast('⚠️ គ្មានវិក្កយបត្រខែនេះទេ!', true);
                    const tot = list.reduce((s, b) => s + b.totalUsd, 0);
                    const lines = list.map((b, i) => `${i + 1}. <b>${escHtml(b.roomNo)}</b> (${escHtml(b.tenant)}) — <b>$${b.totalUsd.toFixed(2)}</b> ${b.paid ? '✅' : '⏳'}`).join('\n');
                    const res = await sendTgMsg(`🏠 <b>សង្ខេបបន្ទប់ជួល ខែ ${escHtml(ym)}</b>\n💰 សរុប៖ <b>$${tot.toFixed(2)}</b>\n\n${lines}`);
                    if (res.ok) showPack3Toast('✈️ បានផ្ញើសង្ខេបបន្ទប់ជួលចូល Telegram!');
                    else showPack3Toast('⚠️ សូមកំណត់ Telegram Bot Token & Chat ID សិន!', true);
                },
                saveRatesForm() {
                    saveRates({
                        elecKhr: Math.max(0, Number(document.getElementById('skmP3RtElec').value || 1000)),
                        waterKhr: Math.max(0, Number(document.getElementById('skmP3RtWater').value || 2500)),
                        trashUsd: Math.max(0, Number(document.getElementById('skmP3RtTrash').value || 0)),
                        wifiUsd: Math.max(0, Number(document.getElementById('skmP3RtWifi').value || 0)),
                        exchangeRate: Math.max(100, Number(document.getElementById('skmP3RtEx').value || 4000))
                    });
                    showPack3Toast('✅ រក្សាទុកតម្លៃភ្លើង-ទឹកជោគជ័យ!');
                },
                exportCsv() {
                    const ym = document.getElementById('skmP3RentMonth')?.value || getCurMonth();
                    const list = loadBills().filter(b => b.month === ym);
                    const rows = [['Month', 'Room', 'Tenant', 'RentUSD', 'UsedElec', 'ElecKHR', 'UsedWater', 'WaterKHR', 'ExtraUSD', 'TotalUSD', 'Paid'],
                        ...list.map(b => [b.month, b.roomNo, b.tenant.replace(/,/g, ' '), b.rentUsd, b.usedE, b.elecKhr, b.usedW, b.waterKhr, b.extraUsd, b.totalUsd, b.paid ? 'PAID' : 'UNPAID'])];
                    const blob = new Blob(['\uFEFF' + rows.map(x => x.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `SKM_Rental_${getBranchId()}_${ym}.csv`; a.click();
                }
            };

            registerInPosToolbox('🏠', 'គ្រប់គ្រងផ្ទះជួល / បន្ទប់ជួល (Rental)', () => window.SKMP3Rental.open('billing'));
        })();
    }
})();
