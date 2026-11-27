/**
 * ============================================================================
 * SKM ADMIN SETTINGS — PACK 2 & PACK 3 MASTER TOGGLE CONTROLLER
 * File: pack23_admin_toggles.js (Include ONLY in admin_settings.html!)
 * Usage: Add 1 line before </body> in admin_settings.html:
 *        <script src="pack23_admin_toggles.js" defer></script>
 *
 * Benefits:
 *   - Keeps POS client interface 100% clean (clients NEVER see toggle gears/controls)
 *   - Per-branch ON/OFF for all 11 Pro modules (Pack 2 [8] + Pack 3 [3]) + 1-Click Industry Presets
 *   - Ultra-Low Supabase Egress: ZERO background polling; reads/writes ONLY when Admin opens/saves
 * ============================================================================
 */
(function () {
    'use strict';
    if (window.__SKM_ADMIN_PACK23_TOGGLES_READY__) return;
    window.__SKM_ADMIN_PACK23_TOGGLES_READY__ = true;

    const FALLBACK_SB_URL = 'https://qlzyyfqjwudbapgwsugu.supabase.co';
    const FALLBACK_SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsenl5ZnFqd3VkYmFwZ3dzdWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwODk2MzUsImV4cCI6MjEwODY2NTYzNX0.XQxNiUn2ZhivOjbqcWj0T6W1Abtx1H3kWrzIwqJPVtQ';

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
        consignmentPro: true
    };

    const MODULE_META_P2 = [
        ['attendancePro', '🕒 វត្តមានបុគ្គលិក Pro (QR + GPS + Telegram)'],
        ['stickerPro', '🏷️ ស្ទីកគ័របាកូដទំនិញ & កែវកាហ្វេ (Code-128/39)'],
        ['powerShareHub', '🔗 ចែករំលែកម៉ឺនុយ & ទំនិញ (Power QR + Share Menu)'],
        ['multiUnitWholesale', '📦 លក់ច្រើនឯកតា & លក់ដុំថែម (Multi-Unit)'],
        ['dualReceiptBarcode', '🧾 ព្រីន ២ សន្លឹក & បាកូដវិក្កយបត្រ (Dual Receipt)'],
        ['stockHealthAnalytics', '📊 វិភាគទំនិញលក់ដាច់ & កប់ស្តុក (Dead Stock)'],
        ['autoLowStockAlert', '🚨 ដាស់តឿនស្តុកជិតអស់អូតូ (Telegram Alert)'],
        ['offlineSyncQueue', '🔄 Offline Order Queue & Smart TTL Cache']
    ];

    const MODULE_META_P3 = [
        ['serialWarranty', '📱 លេខ Serial / IMEI & ធានាទំនិញ (Warranty Pro)'],
        ['landedAvgCost', '🚢 ថ្លៃដើមនាំចូល & មធ្យមភាគ (Landed & Avg Cost)'],
        ['consignmentPro', '🤝 គ្រប់គ្រងទំនិញផ្ញើលក់ (Consignment In/Out)']
    ];

    const INDUSTRY_PRESETS = {
        basic_280: {
            name: '🔒 ឈុតគោល $280 (បិទមុខងារបន្ថែម)',
            p2: { attendancePro: false, stickerPro: false, powerShareHub: false, multiUnitWholesale: false, dualReceiptBarcode: false, stockHealthAnalytics: false, autoLowStockAlert: false, offlineSyncQueue: true },
            p3: { serialWarranty: false, landedAvgCost: false, consignmentPro: false }
        },
        fnb: {
            name: '🍜 ហាងមីហឹរ / កាហ្វេ',
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
            name: '📱 ទូរស័ព្ទ / អេឡិចត្រូនិច',
            p2: { attendancePro: true, stickerPro: true, powerShareHub: true, multiUnitWholesale: false, dualReceiptBarcode: true, stockHealthAnalytics: true, autoLowStockAlert: true, offlineSyncQueue: true },
            p3: { serialWarranty: true, landedAvgCost: true, consignmentPro: false }
        },
        importer: {
            name: '🚢 ដេប៉ូនាំចូល / ផ្ញើលក់',
            p2: { attendancePro: true, stickerPro: true, powerShareHub: false, multiUnitWholesale: true, dualReceiptBarcode: true, stockHealthAnalytics: true, autoLowStockAlert: true, offlineSyncQueue: true },
            p3: { serialWarranty: true, landedAvgCost: true, consignmentPro: true }
        },
        all_on: {
            name: '👑 បើកទាំងអស់ (១១ មុខ)',
            p2: Object.assign({}, PACK2_DEFAULTS),
            p3: Object.assign({}, PACK3_DEFAULTS)
        }
    };

    function getAdminBranchId() {
        const selectors = ['#branchSelect', '#currentBranchSelect', '#branchIdInput', '#targetBranch', 'select[id*="branch" i]'];
        for (const s of selectors) {
            const el = document.querySelector(s);
            if (el && el.value && String(el.value).trim()) return String(el.value).trim();
        }
        return (
            window.CURRENT_BRANCH_ID ||
            window.SHOP_BRANCH_ID ||
            new URLSearchParams(window.location.search).get('branch') ||
            localStorage.getItem('skm_last_branch') ||
            'branch_1'
        ).trim();
    }

    let cachedSb = null;
    function getSb() {
        if (window.supabaseClient) return window.supabaseClient;
        if (cachedSb) return cachedSb;
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            cachedSb = window.supabase.createClient(FALLBACK_SB_URL, FALLBACK_SB_KEY);
            return cachedSb;
        }
        return null;
    }

    function showToast(msg, isErr) {
        if (typeof window.showToast === 'function') return window.showToast(msg, Boolean(isErr));
        const t = document.createElement('div');
        t.textContent = msg;
        t.style.cssText = `position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:999999;padding:10px 20px;border-radius:999px;font-weight:800;font-size:13px;font-family:'Battambang',sans-serif;color:#fff;background:${isErr ? '#ef4444' : '#10b981'};box-shadow:0 10px 28px rgba(0,0,0,0.4);`;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3200);
    }

    function injectStyles() {
        if (document.getElementById('skmAdmP23Styles')) return;
        const st = document.createElement('style');
        st.id = 'skmAdmP23Styles';
        st.textContent = `
            #skmAdmP23Fab { position:fixed; bottom:22px; right:22px; z-index:99500; border:none; border-radius:999px; padding:12px 18px; background:linear-gradient(135deg,#4f46e5,#0284c7); color:#fff; font-family:'Battambang','Nunito',sans-serif; font-size:13.5px; font-weight:800; cursor:pointer; box-shadow:0 14px 32px rgba(37,99,235,0.45); display:flex; align-items:center; gap:8px; transition:transform 0.2s ease; }
            #skmAdmP23Fab:hover { transform:translateY(-2px) scale(1.03); }
            #skmAdmP23Overlay { display:none; position:fixed; inset:0; z-index:100080; background:rgba(2,6,23,0.78); backdrop-filter:blur(6px); justify-content:center; align-items:center; padding:14px; font-family:'Battambang','Nunito',sans-serif; }
            #skmAdmP23Overlay.open { display:flex; }
            .skm-adm23-box { background:#0f172a; color:#f8fafc; width:96vw; max-width:920px; max-height:92vh; border-radius:20px; border:1px solid rgba(99,102,241,0.45); box-shadow:0 28px 65px rgba(0,0,0,0.62); display:flex; flex-direction:column; overflow:hidden; }
            .skm-adm23-head { padding:14px 20px; background:linear-gradient(135deg,#0f172a,#1e1b4b); border-bottom:1px solid rgba(148,163,184,0.22); display:flex; justify-content:space-between; align-items:center; gap:10px; }
            .skm-adm23-body { padding:16px 20px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:14px; }
            .skm-adm23-card { background:#1e293b; border:1px solid rgba(148,163,184,0.22); border-radius:14px; padding:14px; min-width:0; }
            .skm-adm23-2col { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,0.95fr); gap:14px; }
            @media (max-width:740px) { .skm-adm23-2col { grid-template-columns:minmax(0,1fr); } }
            .skm-adm23-preset { border:1px solid rgba(99,102,241,0.5); background:rgba(99,102,241,0.16); color:#e0e7ff; padding:6px 11px; border-radius:10px; font-size:12px; font-weight:800; cursor:pointer; font-family:inherit; }
            .skm-adm23-preset:hover { background:rgba(99,102,241,0.34); }
            .skm-adm23-row { display:flex; justify-content:space-between; align-items:center; gap:10px; padding:8px 11px; border-radius:10px; background:#0f172a; border:1px solid rgba(148,163,184,0.18); cursor:pointer; font-size:12.5px; }
            .skm-adm23-row:hover { border-color:#38bdf8; }
            .skm-adm23-btn { border:none; border-radius:11px; padding:10px 16px; font-size:13.5px; font-weight:800; cursor:pointer; color:#fff; font-family:inherit; }
        `;
        document.head.appendChild(st);
    }

    async function loadBranchToggles(branchId) {
        let p2 = Object.assign({}, PACK2_DEFAULTS);
        let p3 = Object.assign({}, PACK3_DEFAULTS);
        try {
            const localSys = JSON.parse(localStorage.getItem(`ks2_${branchId}_sys_settings`) || '{}');
            if (localSys.pos2Enabled) p2 = Object.assign(p2, localSys.pos2Enabled);
            if (localSys.pos3Enabled) p3 = Object.assign(p3, localSys.pos3Enabled);
        } catch (e) {}

        const sb = getSb();
        if (sb && navigator.onLine) {
            try {
                const { data } = await sb.from('branch_store')
                    .select('sys_settings')
                    .eq('branch_id', branchId)
                    .maybeSingle();
                if (data && data.sys_settings) {
                    if (data.sys_settings.pos2Enabled) p2 = Object.assign(p2, data.sys_settings.pos2Enabled);
                    if (data.sys_settings.pos3Enabled) p3 = Object.assign(p3, data.sys_settings.pos3Enabled);
                }
            } catch (e) {}
        }
        return { p2, p3 };
    }

    async function saveBranchToggles(branchId, nextP2, nextP3) {
        const sysKey = `ks2_${branchId}_sys_settings`;
        let localSys = {};
        try { localSys = JSON.parse(localStorage.getItem(sysKey) || '{}'); } catch (e) {}
        localSys.pos2Enabled = nextP2;
        localSys.pos3Enabled = nextP3;
        localStorage.setItem(sysKey, JSON.stringify(localSys));
        localStorage.setItem(`ks2_${branchId}_pos2_enabled`, JSON.stringify(nextP2));
        localStorage.setItem(`ks2_${branchId}_pos3_enabled`, JSON.stringify(nextP3));

        // Keep admin_settings.html in-memory sysSettings synced so clicking the page's own Save button won't overwrite our toggles!
        if (window.sysSettings && typeof window.sysSettings === 'object') {
            window.sysSettings.pos2Enabled = nextP2;
            window.sysSettings.pos3Enabled = nextP3;
        }
        if (window.currentSysSettings && typeof window.currentSysSettings === 'object') {
            window.currentSysSettings.pos2Enabled = nextP2;
            window.currentSysSettings.pos3Enabled = nextP3;
        }

        const sb = getSb();
        if (!sb || !navigator.onLine) {
            showToast('⚠️ រក្សាទុកក្នុងម៉ាស៊ីនរួច (គ្មានអ៊ីនធឺណិតដើម្បី Sync ទៅ Cloud)!', true);
            return false;
        }

        try {
            const { data } = await sb.from('branch_store')
                .select('sys_settings')
                .eq('branch_id', branchId)
                .maybeSingle();
            const merged = Object.assign({}, (data && data.sys_settings) || localSys, {
                pos2Enabled: nextP2,
                pos3Enabled: nextP3
            });
            const nowIso = new Date().toISOString();
            const { error } = await sb.from('branch_store')
                .update({ sys_settings: merged, updated_at: nowIso })
                .eq('branch_id', branchId);
            if (error) throw error;
            localStorage.setItem(`ks2_${branchId}_last_update`, new Date(nowIso).getTime().toString());
            showToast(`✅ រក្សាទុកការបិទ/បើក Pack 2 & 3 សម្រាប់សាខា "${branchId}" ឡើង Cloud ជោគជ័យ!`);
            return true;
        } catch (err) {
            showToast(`❌ រក្សាទុក Cloud បរាជ័យ៖ ${err.message || err}`, true);
            return false;
        }
    }

    function ensureModal() {
        if (document.getElementById('skmAdmP23Overlay')) return;
        injectStyles();
        const ov = document.createElement('div');
        ov.id = 'skmAdmP23Overlay';
        ov.onclick = (e) => { if (e.target === ov) ov.classList.remove('open'); };
        ov.innerHTML = `
            <div class="skm-adm23-box">
                <div class="skm-adm23-head">
                    <div>
                        <div style="font-size:16.5px;font-weight:900;color:#a5b4fc;">🎛️ កំណត់បិទ/បើកមុខងារ Pro (Pack 2 & Pack 3)</div>
                        <div style="font-size:12px;color:#94a3b8;">សម្រាប់តែ Admin Settings — ភ្ញៀវមិនឃើញប៊ូតុងកំណត់ទាំងនេះលើផ្ទាំង POS ឡើយ</div>
                    </div>
                    <button type="button" class="skm-adm23-btn" style="background:#ef4444;padding:7px 14px;" onclick="document.getElementById('skmAdmP23Overlay').classList.remove('open')">✕ បិទ</button>
                </div>
                <div class="skm-adm23-body">
                    <div class="skm-adm23-card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
                        <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:220px;">
                            <strong style="font-size:13px;color:#38bdf8;white-space:nowrap;">🏪 សាខាគោលដៅ៖</strong>
                            <input id="skmAdm23BranchInp" type="text" style="flex:1;max-width:240px;padding:7px 11px;border-radius:9px;border:1px solid rgba(56,189,248,0.45);background:#0f172a;color:#fff;font-size:13px;font-weight:800;font-family:inherit;">
                            <button type="button" class="skm-adm23-btn" style="background:#0284c7;padding:7px 12px;font-size:12px;" onclick="window.SKM_ADMIN_PACK23.reloadBranch()">🔄 ទាញការកំណត់សាខានេះ</button>
                        </div>
                        <span id="skmAdm23Status" style="font-size:12px;color:#34d399;font-weight:700;"></span>
                    </div>

                    <div class="skm-adm23-card">
                        <div style="font-size:12.5px;font-weight:800;color:#fbbf24;margin-bottom:8px;">⚡ គំរូមុខរបរ ១ ចុច (1-Click Industry Presets)៖</div>
                        <div style="display:flex;flex-wrap:wrap;gap:6px;">
                            ${Object.keys(INDUSTRY_PRESETS).map(k => `<button type="button" class="skm-adm23-preset" onclick="window.SKM_ADMIN_PACK23.applyPreset('${k}')">${INDUSTRY_PRESETS[k].name}</button>`).join('')}
                        </div>
                    </div>

                    <div class="skm-adm23-2col">
                        <div class="skm-adm23-card">
                            <div style="font-size:13.5px;font-weight:900;color:#38bdf8;margin-bottom:8px;">📦 Pack 2 — មុខងារលក់ & ប្រតិបត្តិការ (៨ មុខ)</div>
                            <div style="display:flex;flex-direction:column;gap:7px;">
                                ${MODULE_META_P2.map(([k, lbl]) => `
                                    <label class="skm-adm23-row">
                                        <span>${lbl}</span>
                                        <input type="checkbox" data-pack="p2" data-key="${k}" style="width:18px;height:18px;accent-color:#10b981;flex-shrink:0;">
                                    </label>`).join('')}
                            </div>
                        </div>

                        <div class="skm-adm23-card" style="display:flex;flex-direction:column;justify-content:space-between;">
                            <div>
                                <div style="font-size:13.5px;font-weight:900;color:#a5b4fc;margin-bottom:8px;">🏢 Pack 3 — មុខងារជំនាញ & នាំចូល (៣ មុខ)</div>
                                <div style="display:flex;flex-direction:column;gap:7px;">
                                    ${MODULE_META_P3.map(([k, lbl]) => `
                                        <label class="skm-adm23-row">
                                            <span>${lbl}</span>
                                            <input type="checkbox" data-pack="p3" data-key="${k}" style="width:18px;height:18px;accent-color:#6366f1;flex-shrink:0;">
                                        </label>`).join('')}
                                </div>
                            </div>
                            <div style="margin-top:12px;padding:10px 12px;border-radius:10px;background:rgba(16,185,129,0.1);border:1px dashed rgba(16,185,129,0.45);font-size:12px;color:#6ee7b7;line-height:1.5;">
                                💡 <b>ចំណាំ៖</b> ក្រោយពេលចុចរក្សាទុក ភ្ញៀវគ្រាន់តែ Refresh ទំព័រ POS ឬ `menu.html` នឹងឃើញតែមុខងារដែលអ្នកបានធីកបើកប៉ុណ្ណោះ (ស្អាត អត់រញ៉េរញ៉ៃ)។
                            </div>
                        </div>
                    </div>

                    <button type="button" id="skmAdm23SaveBtn" class="skm-adm23-btn" style="width:100%;background:linear-gradient(135deg,#10b981,#059669);padding:13px;font-size:14.5px;" onclick="window.SKM_ADMIN_PACK23.save()">💾 រក្សាទុកការបិទ/បើកទៅ Cloud (សាខានេះ)</button>
                </div>
            </div>
        `;
        document.body.appendChild(ov);
    }

    window.SKM_ADMIN_PACK23 = {
        async open() {
            ensureModal();
            const br = getAdminBranchId();
            document.getElementById('skmAdm23BranchInp').value = br;
            document.getElementById('skmAdmP23Overlay').classList.add('open');
            await this.reloadBranch();
        },
        async reloadBranch() {
            const br = (document.getElementById('skmAdm23BranchInp')?.value || getAdminBranchId()).trim();
            const stEl = document.getElementById('skmAdm23Status');
            if (stEl) stEl.textContent = '⏳ កំពុងផ្ទុក...';
            const { p2, p3 } = await loadBranchToggles(br);
            const ov = document.getElementById('skmAdmP23Overlay');
            ov.querySelectorAll('input[data-pack="p2"]').forEach(c => { c.checked = p2[c.getAttribute('data-key')] !== false; });
            ov.querySelectorAll('input[data-pack="p3"]').forEach(c => { c.checked = p3[c.getAttribute('data-key')] !== false; });
            if (stEl) stEl.textContent = `✅ បានទាញការកំណត់សាខា ${br}`;
        },
        applyPreset(key) {
            const preset = INDUSTRY_PRESETS[key];
            const ov = document.getElementById('skmAdmP23Overlay');
            if (!preset || !ov) return;
            ov.querySelectorAll('input[data-pack="p2"]').forEach(c => { c.checked = Boolean(preset.p2[c.getAttribute('data-key')]); });
            ov.querySelectorAll('input[data-pack="p3"]').forEach(c => { c.checked = Boolean(preset.p3[c.getAttribute('data-key')]); });
            showToast(`⚡ បានរើសគំរូ៖ ${preset.name} — សូមចុច "រក្សាទុក"!`);
        },
        async save() {
            const btn = document.getElementById('skmAdm23SaveBtn');
            const br = (document.getElementById('skmAdm23BranchInp')?.value || getAdminBranchId()).trim();
            if (!br) return showToast('⚠️ សូមបញ្ចូលឈ្មោះសាខា (Branch ID)!', true);
            const ov = document.getElementById('skmAdmP23Overlay');
            const nextP2 = {};
            const nextP3 = {};
            ov.querySelectorAll('input[data-pack="p2"]').forEach(c => { nextP2[c.getAttribute('data-key')] = c.checked; });
            ov.querySelectorAll('input[data-pack="p3"]').forEach(c => { nextP3[c.getAttribute('data-key')] = c.checked; });

            btn.disabled = true;
            btn.textContent = '⏳ កំពុងរក្សាទុកទៅ Cloud...';
            try {
                await saveBranchToggles(br, nextP2, nextP3);
            } finally {
                btn.disabled = false;
                btn.textContent = '💾 រក្សាទុកការបិទ/បើកទៅ Cloud (សាខានេះ)';
            }
        }
    };

    function mountAdminButton() {
        if (document.getElementById('skmAdmP23Fab')) return;
        injectStyles();
        const fab = document.createElement('button');
        fab.id = 'skmAdmP23Fab';
        fab.type = 'button';
        fab.innerHTML = '🎛️ បិទ/បើក Pack 2 & 3';
        fab.onclick = () => window.SKM_ADMIN_PACK23.open();
        document.body.appendChild(fab);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountAdminButton);
    } else {
        mountAdminButton();
    }
})();
