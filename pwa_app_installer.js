/**
 * pwa_app_installer.js — ប្រព័ន្ធដំឡើង SKM POS ជា App លើ Android / iOS / Windows (PWA + APK Bridge Ready)
 * បិទ/បើកប៊ូតុងដំឡើងបានក្នុង Admin Settings -> Tab 9 (pfInstallAppBtn)
 */
(function () {
    'use strict';

    let deferredPrompt = null;
    window.SKM_IS_STANDALONE_APP = Boolean(
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        typeof window.SKMAndroidBridge !== 'undefined' || Boolean(window.SKMDesktopBridge && window.SKMDesktopBridge.isDesktopApp)
    );

    function isInstallBtnEnabled() {
        try {
            const br = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
            let sys = window.sysSettings || {};
            if (!sys.proFeatures) {
                const raw = localStorage.getItem(`ks2_${br}_sys_settings`);
                if (raw) sys = JSON.parse(raw);
            }
            if (sys && sys.proFeatures && sys.proFeatures.installAppBtn !== undefined) {
                return Boolean(sys.proFeatures.installAppBtn);
            }
            return true; // Default On so shops can install App easily
        } catch (e) {
            return true;
        }
    }

    function isIosDevice() {
        return /iphone|ipad|ipod/i.test(navigator.userAgent || '');
    }

    function showInstallGuideModal() {
        let m = document.getElementById('skmAppInstallGuideModal');
        if (!m) {
            m = document.createElement('div');
            m.id = 'skmAppInstallGuideModal';
            m.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.72); backdrop-filter:blur(6px); z-index:12050; justify-content:center; align-items:center; padding:18px;';
            m.innerHTML = `
                <div style="background:#1e293b; color:#f8fafc; max-width:420px; width:100%; border-radius:20px; padding:22px; border:1px solid rgba(56,189,248,0.35); box-shadow:0 24px 60px rgba(0,0,0,0.45); font-family:'Kantumruy Pro','Battambang',sans-serif;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <h3 style="margin:0; font-size:17px; color:#38bdf8;">📲 ដំឡើង SKM POS ជា App លើម៉ាស៊ីន</h3>
                        <button type="button" onclick="document.getElementById('skmAppInstallGuideModal').style.display='none'" style="background:rgba(255,255,255,0.1); border:none; color:#fff; width:30px; height:30px; border-radius:50%; cursor:pointer;">✕</button>
                    </div>
                    <div id="skmAppInstallGuideBody" style="font-size:13.5px; line-height:1.65; color:#cbd5e1;"></div>
                    <button type="button" onclick="document.getElementById('skmAppInstallGuideModal').style.display='none'" style="margin-top:16px; width:100%; padding:11px; border:none; border-radius:12px; background:linear-gradient(135deg,#06b6d4,#10b981); color:#fff; font-weight:800; cursor:pointer;">យល់ព្រម</button>
                </div>
            `;
            document.body.appendChild(m);
        }
        const body = document.getElementById('skmAppInstallGuideBody');
        if (isIosDevice()) {
            body.innerHTML = `
                <p><b>សម្រាប់ iPhone / iPad (Safari)៖</b></p>
                <ol style="padding-left:18px; margin-top:6px;">
                    <li>ចុចលើសញ្ញា <b>Share (⬆️ ប្រអប់ព្រួញឡើងលើ)</b> នៅខាងក្រោមអេក្រង់។</li>
                    <li>អូសចុះក្រោម រួចចុច <b>"Add to Home Screen"</b>។</li>
                    <li>ចុច <b>"Add"</b> ដើម្បីប្រើជា App ពេញអេក្រង់!</li>
                </ol>`;
        } else {
            body.innerHTML = `
                <p><b>សម្រាប់ Android (Chrome) ឬ កុំព្យូទ័រ (Chrome/Edge)៖</b></p>
                <ol style="padding-left:18px; margin-top:6px;">
                    <li>ចុចលើម៉ឺនុយ <b>⋮ (៣ ចំណុច)</b> ខាងស្តាំផ្នែកលើនៃ Browser។</li>
                    <li>ជ្រើសរើស <b>"Install app"</b> ឬ <b>"Add to Home screen"</b>។</li>
                    <li>App <b>SKM POS</b> នឹងលោតលើអេក្រង់ដើម ហើយដំណើរការបានទោះដាច់អ៊ីនធឺណិត!</li>
                </ol>`;
        }
        m.style.display = 'flex';
    }

    window.triggerSkmAppInstall = async function () {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;
            deferredPrompt = null;
            if (choice && choice.outcome === 'accepted') {
                const btn = document.getElementById('skmPwaInstallBtn');
                if (btn) btn.style.display = 'none';
                if (typeof window.showToast === 'function') window.showToast('🎉 កំពុងដំឡើង SKM POS App...');
            }
        } else {
            showInstallGuideModal();
        }
    };

    window.syncPwaInstallButton = function () {
        const existing = document.getElementById('skmPwaInstallBtn');
        if (window.SKM_IS_STANDALONE_APP || !isInstallBtnEnabled()) {
            if (existing) existing.style.display = 'none';
            return;
        }
        // Inject into POS topHeaderBar if present
        const headerControls = document.querySelector('#topHeaderBar .header-controls');
        if (headerControls) {
            let btn = existing;
            if (!btn) {
                btn = document.createElement('button');
                btn.id = 'skmPwaInstallBtn';
                btn.type = 'button';
                btn.className = 'btn btn-outline';
                btn.style.cssText = 'border-color:#38bdf8; color:#38bdf8; padding:4px 12px; font-size:12px; border-radius:20px; display:inline-flex; align-items:center; gap:5px; background:rgba(0,0,0,0.28); font-weight:800; cursor:pointer;';
                btn.innerHTML = '📲 ដំឡើង App';
                btn.onclick = window.triggerSkmAppInstall;
                headerControls.prepend(btn);
            }
            btn.style.display = 'inline-flex';
            return;
        }

        // Otherwise floating compact pill on welcome.html
        if (!existing && /welcome\.html/i.test(window.location.pathname)) {
            const btn = document.createElement('button');
            btn.id = 'skmPwaInstallBtn';
            btn.type = 'button';
            btn.style.cssText = 'position:fixed; bottom:16px; right:16px; z-index:9000; padding:9px 15px; border-radius:999px; border:1px solid rgba(56,189,248,0.5); background:rgba(15,23,42,0.92); color:#38bdf8; font-weight:800; font-size:12.5px; cursor:pointer; box-shadow:0 10px 25px rgba(0,0,0,0.35); backdrop-filter:blur(8px);';
            btn.innerHTML = '📲 ដំឡើង App';
            btn.onclick = window.triggerSkmAppInstall;
            document.body.appendChild(btn);
        }
    };

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        window.syncPwaInstallButton();
    });

    window.addEventListener('appinstalled', () => {
        window.SKM_IS_STANDALONE_APP = true;
        const btn = document.getElementById('skmPwaInstallBtn');
        if (btn) btn.style.display = 'none';
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(window.syncPwaInstallButton, 500));
    } else {
        setTimeout(window.syncPwaInstallButton, 500);
    }
})();
