/**
 * ============================================================================
 * SKM INTEGRATE MENU - PLUGINS BUNDLE PACK 2 v7.1 (Power QR Share + Ultra-Low-Egress TTL Cache)
 * File: all_menu_plugins_2.js (Root Folder — alongside all_menu_plugins.js)
 * Features:
 *   1. Adds 1-Click Share to Facebook & Telegram buttons inside Menu Toolbox & Product Modals
 *   2. Auto-searches product when customer opens a shared link with ?q=ProductName (waits for Cloud inventory)
 *   3. Ultra-Low-Egress Smart TTL Cache (5-Min lightweight `updated_at` check ~40B; skipped on boot & hidden tabs)
 *   4. Offline Status Banner — lets guests keep browsing cached menu seamlessly if table Wi-Fi drops
 * ============================================================================
 */
(function () {
    'use strict';
    if (window.__SKM_MENU_PLUGINS_2_READY__) return;
    window.__SKM_MENU_PLUGINS_2_READY__ = true;

    const BRANCH_ID = (new URLSearchParams(window.location.search).get('branch') || localStorage.getItem('skm_last_branch') || 'branch_1').trim();
    const MENU_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL (saves Supabase Egress)
    const TTL_META_KEY = `ks2_${BRANCH_ID}_menu_ttl_meta`;

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function getShareUrl(productName) {
        const u = new URL(window.location.href);
        if (productName) u.searchParams.set('q', productName);
        else u.searchParams.delete('q');
        return u.toString();
    }

    function openShareModal(productName, productPrice) {
        const url = getShareUrl(productName);
        const shop = document.getElementById('lpName')?.textContent?.trim() || document.getElementById('shopName')?.textContent?.trim() || document.title || 'SKM Store';
        const title = productName ? `${productName}${productPrice ? ' (' + productPrice + ')' : ''}` : shop;
        const text = productName
            ? `✨ ${title} — មើល & កុម្ម៉ង់នៅ ${shop}៖`
            : `🛍️ មើលម៉ឺនុយទំនិញទាំងអស់របស់ ${shop} នៅទីនេះ៖`;

        let m = document.getElementById('skmMenu2ShareModal');
        if (!m) {
            m = document.createElement('div');
            m.id = 'skmMenu2ShareModal';
            m.style.cssText = "display:none;position:fixed;inset:0;z-index:100050;background:rgba(2,6,23,0.78);backdrop-filter:blur(6px);justify-content:center;align-items:center;padding:18px;font-family:'Battambang','Nunito',sans-serif;";
            m.onclick = (e) => { if (e.target === m) m.style.display = 'none'; };
            document.body.appendChild(m);
        }
        m.innerHTML = `
            <div style="background:#1e293b;color:#f8fafc;width:100%;max-width:360px;border-radius:22px;padding:22px;border:1px solid rgba(56,189,248,0.35);text-align:center;box-shadow:0 24px 55px rgba(0,0,0,0.5);">
                <div style="font-size:34px;margin-bottom:6px;">📤</div>
                <h3 style="margin:0 0 6px;font-size:17px;color:#38bdf8;">ចែករំលែកទៅមិត្តភក្តិ (Share)</h3>
                <div style="font-size:13px;color:#cbd5e1;margin-bottom:14px;font-weight:700;">${esc(title)}</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener" style="background:#1877f2;color:#fff;text-decoration:none;padding:11px;border-radius:12px;font-weight:800;font-size:13px;">📘 Facebook</a>
                    <a href="https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}" target="_blank" rel="noopener" style="background:#0088cc;color:#fff;text-decoration:none;padding:11px;border-radius:12px;font-weight:800;font-size:13px;">✈️ Telegram</a>
                </div>
                <button type="button" id="skmM2CopyBtn" style="width:100%;background:#10b981;color:#fff;border:none;padding:11px;border-radius:12px;font-weight:800;font-size:13px;cursor:pointer;margin-bottom:8px;font-family:inherit;">📋 ចម្លង Link ទំនិញ</button>
                <button type="button" onclick="document.getElementById('skmMenu2ShareModal').style.display='none'" style="width:100%;background:transparent;color:#94a3b8;border:1px solid rgba(148,163,184,0.3);padding:9px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;">បិទ</button>
            </div>
        `;
        m.style.display = 'flex';
        document.getElementById('skmM2CopyBtn').onclick = () => {
            navigator.clipboard?.writeText(url).then(() => {
                if (typeof window.showToast === 'function') window.showToast('📋 បានចម្លង Link រួចរាល់!');
                m.style.display = 'none';
            }).catch(() => prompt('Copy Link:', url));
        };
    }

    // 1. Register inside Menu Toolbox Hub
    const tmr = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📤', 'ចែករំលែកម៉ឺនុយ (FB / Telegram)', () => openShareModal('', ''), null);
            clearInterval(tmr);
        }
    }, 450);
    setTimeout(() => clearInterval(tmr), 15000);

    // 2. Auto-inject Facebook + Telegram Share buttons into product detail modal on menu.html
    function attachProductModalShareBar() {
        const modal = document.getElementById('detailModal') || document.getElementById('prodModal') || document.getElementById('productModal') || document.getElementById('itemDetailModal');
        if (!modal || document.getElementById('skmM2ProdShareBar')) return;
        const target = modal.querySelector('.modal-content, .modal-box, .modal-body') || modal;
        const bar = document.createElement('div');
        bar.id = 'skmM2ProdShareBar';
        bar.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;margin-top:10px;padding-top:8px;border-top:1px dashed rgba(148,163,184,0.28);';
        bar.innerHTML = `
            <button type="button" id="skmM2BtnFb" style="background:#1877f2;color:#fff;border:none;padding:7px 12px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;font-family:'Battambang',sans-serif;">📘 Share FB</button>
            <button type="button" id="skmM2BtnTg" style="background:#0088cc;color:#fff;border:none;padding:7px 12px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;font-family:'Battambang',sans-serif;">✈️ Telegram</button>
            <button type="button" id="skmM2BtnCopy" style="background:#10b981;color:#fff;border:none;padding:7px 11px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;font-family:'Battambang',sans-serif;">📋 Link</button>
        `;
        target.appendChild(bar);

        const getCurProd = () => {
            if (window.__skmCurrentDetailProd && window.__skmCurrentDetailProd.name) {
                return window.__skmCurrentDetailProd;
            }
            const dContent = document.getElementById('dContent');
            if (dContent) {
                const divs = dContent.querySelectorAll(':scope > div');
                const name = divs[1]?.textContent?.trim() || '';
                const price = divs[2]?.textContent?.trim() || '';
                if (name && name !== 'Product Detail') return { name, price };
            }
            const fallbackName = (document.getElementById('mName') || document.getElementById('modalProdName'))?.textContent?.trim() || '';
            const fallbackPrice = (document.getElementById('mPrice') || document.getElementById('modalProdPrice'))?.textContent?.trim() || '';
            return { name: fallbackName, price: fallbackPrice };
        };

        document.getElementById('skmM2BtnFb').onclick = () => {
            const p = getCurProd();
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl(p.name))}`, '_blank');
        };
        document.getElementById('skmM2BtnTg').onclick = () => {
            const p = getCurProd();
            const txt = p.name ? `✨ ${p.name}${p.price ? ' (' + p.price + ')' : ''}` : '🛍️ មើលម៉ឺនុយទំនិញនៅទីនេះ៖';
            window.open(`https://t.me/share/url?url=${encodeURIComponent(getShareUrl(p.name))}&text=${encodeURIComponent(txt)}`, '_blank');
        };
        document.getElementById('skmM2BtnCopy').onclick = () => {
            const p = getCurProd();
            const url = getShareUrl(p.name);
            navigator.clipboard?.writeText(url).then(() => {
                if (typeof window.showToast === 'function') window.showToast('📋 បានចម្លង Link ទំនិញរួចរាល់!');
            }).catch(() => prompt('Copy Link:', url));
        };
    }

    // 3. Auto-fill search query if opened via shared link (?q=...) and wait until inventory is loaded
    function handleIncomingQueryParam() {
        const q = new URLSearchParams(window.location.search).get('q');
        if (!q) return;
        let appliedWithInv = false;
        const trySearch = setInterval(() => {
            const inp = document.getElementById('searchInput');
            const hasInv = Array.isArray(window.inventory) && window.inventory.length > 0;
            if (inp) {
                if (inp.value !== q) {
                    inp.value = q;
                    inp.dispatchEvent(new Event('input', { bubbles: true }));
                }
                if (typeof window.renderMenu === 'function') window.renderMenu();
                if (hasInv) {
                    appliedWithInv = true;
                    clearInterval(trySearch);
                }
            }
        }, 450);
        setTimeout(() => { if (!appliedWithInv) clearInterval(trySearch); }, 10000);
    }

    // 4. Ultra-Low-Egress Smart TTL Cache Guard (checks ONLY branch_store.updated_at ~40 bytes after 5 mins of active use)
    function showTopNoticeBanner(id, bg, html, onClick) {
        let b = document.getElementById(id);
        if (!b) {
            b = document.createElement('div');
            b.id = id;
            b.style.cssText = `position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:100040;background:${bg};color:#fff;padding:9px 16px;border-radius:999px;font-family:'Battambang',sans-serif;font-size:12.5px;font-weight:800;box-shadow:0 10px 28px rgba(0,0,0,0.35);cursor:${onClick ? 'pointer' : 'default'};max-width:92vw;text-align:center;`;
            document.body.appendChild(b);
        }
        b.innerHTML = html;
        b.style.display = 'block';
        if (onClick) b.onclick = onClick;
    }

    async function checkMenuFreshness() {
        if (!navigator.onLine || document.hidden) return;
        const sb = window.supabaseClient;
        if (!sb) return;
        let meta = {};
        try { meta = JSON.parse(localStorage.getItem(TTL_META_KEY) || '{}'); } catch (e) {}
        const now = Date.now();
        if (meta.lastCheck && (now - meta.lastCheck) < MENU_TTL_MS) return;

        try {
            const { data } = await sb.from('branch_store').select('updated_at').eq('branch_id', BRANCH_ID).maybeSingle();
            if (!data || !data.updated_at) return;
            const prev = meta.updatedAt || '';
            meta.lastCheck = now;
            meta.updatedAt = data.updated_at;
            localStorage.setItem(TTL_META_KEY, JSON.stringify(meta));

            if (prev && prev !== data.updated_at) {
                const hasCart = Array.isArray(window.cart) && window.cart.length > 0;
                showTopNoticeBanner(
                    'skmM2FreshBanner',
                    hasCart ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#0284c7,#10b981)',
                    hasCart ? '🔄 មានការកែប្រែតម្លៃ/ស្តុកថ្មី! ចុចដើម្បីអាប់ដេតម៉ឺនុយ' : '🔄 ហាងទើបអាប់ដេតតម្លៃ/មុខទំនិញថ្មី! ចុចដើម្បីមើលម៉ឺនុយថ្មី',
                    () => location.reload()
                );
            }
        } catch (e) {}
    }

    // 5. Offline browsing indicator for guests
    function updateOfflineBanner() {
        const el = document.getElementById('skmM2OfflineBanner');
        if (!navigator.onLine) {
            showTopNoticeBanner('skmM2OfflineBanner', 'linear-gradient(135deg,#dc2626,#991b1b)', '📡 គ្មានអ៊ីនធឺណិត — កំពុងបង្ហាញម៉ឺនុយពី Cache លើទូរស័ព្ទ', null);
        } else if (el) {
            el.style.display = 'none';
        }
    }

    function bootMenuPack2() {
        setTimeout(attachProductModalShareBar, 600);
        // Mark boot time so we don't fire a redundant Supabase request right after menu.html's init()!
        try {
            const meta = JSON.parse(localStorage.getItem(TTL_META_KEY) || '{}');
            meta.lastCheck = Date.now();
            localStorage.setItem(TTL_META_KEY, JSON.stringify(meta));
        } catch (e) {}
        handleIncomingQueryParam();
        updateOfflineBanner();
        window.addEventListener('online', () => { updateOfflineBanner(); checkMenuFreshness(); });
        window.addEventListener('offline', updateOfflineBanner);
        document.addEventListener('visibilitychange', () => { if (!document.hidden) checkMenuFreshness(); });
        setInterval(checkMenuFreshness, MENU_TTL_MS);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootMenuPack2);
    } else {
        bootMenuPack2();
    }
})();
