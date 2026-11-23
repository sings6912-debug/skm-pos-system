/**
 * menu_pro_addons.js — Modular Customer Pro Features for Digital Menu (menu.html)
 * Strictly gated by Admin Settings (admin_settings.html -> Tab 9: sysSettings.proFeatures)
 * Modules:
 *  1. Upload Payment Slip (Compress + Supabase Storage + Telegram Photo)
 *  2. 1-Click Share GPS Delivery Location (Google Maps link)
 *  3. Customer Digital Receipt PNG Download after Checkout (Offline Canvas Renderer)
 *  4. Group Split Bill Calculator in Cart
 *  5. Product Tags Badges & Quick Filter (🔥 លក់ដាច់ / 🆕 ថ្មី / 🌶️ ហឹរ / 🌱 បួស)
 */
(function() {
    if (window.__SKM_MENU_PRO_LOADED__) return;
    window.__SKM_MENU_PRO_LOADED__ = true;

    const BRANCH = new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    const getPF = () => (window.sysSettings && window.sysSettings.proFeatures) ? window.sysSettings.proFeatures : {};
    const TAG_META = {
        best:  { label: '🔥 លក់ដាច់', bg: 'rgba(239,68,68,0.92)', color: '#fff' },
        new:   { label: '🆕 ថ្មី',     bg: 'rgba(14,165,233,0.92)', color: '#fff' },
        spicy: { label: '🌶️ ហឹរ',     bg: 'rgba(234,88,12,0.92)', color: '#fff' },
        veg:   { label: '🌱 បួស',     bg: 'rgba(22,163,74,0.92)', color: '#fff' }
    };

    window.__skmPendingPaymentSlip = null; // { dataUrl, blob }
    window.__skmPendingGpsUrl = '';
    let activeTagFilter = 'all';

    // =========================================================
    // 1. INJECT CART PRO WIDGETS (Slip Upload, GPS, Split Bill)
    // =========================================================
    window.syncMenuProFeatures = function() {
        const pf = getPF();
        const qrBox = document.getElementById('qrBoxContainer');
        if (!qrBox) return;

        // A. Payment Slip Upload Box
        let slipBox = document.getElementById('skmMenuSlipBox');
        if (pf.paymentSlip) {
            if (!slipBox) {
                slipBox = document.createElement('div');
                slipBox.id = 'skmMenuSlipBox';
                slipBox.style.cssText = 'margin-bottom:12px; padding:12px; border-radius:14px; background:rgba(16,185,129,0.08); border:1px dashed var(--success); text-align:center;';
                slipBox.innerHTML = `
                    <div style="font-size:12.5px; font-weight:800; color:var(--text-dark); margin-bottom:8px;">📸 ផ្ទុករូបវិក្កយបត្របង់ប្រាក់ (Upload Payment Slip)</div>
                    <input type="file" id="skmSlipFileInp" accept="image/*" style="display:none;" onchange="window.handleMenuSlipFile(event)">
                    <div style="display:flex; gap:8px; justify-content:center;">
                        <button type="button" class="btn-act btn-outline" style="padding:8px 14px; font-size:12px; flex:none;" onclick="document.getElementById('skmSlipFileInp').click()"><i class="fa-solid fa-camera"></i> ជ្រើសរើសរូប Slip</button>
                        <button type="button" id="skmClearSlipBtn" class="btn-act btn-outline" style="padding:8px 10px; font-size:12px; flex:none; color:var(--danger); display:none;" onclick="window.clearMenuSlip()">✕ លុប</button>
                    </div>
                    <img id="skmSlipPreview" src="" style="display:none; max-height:140px; max-width:100%; border-radius:10px; margin:10px auto 0; border:1px solid var(--border-color);">`;
                qrBox.after(slipBox);
            }
            slipBox.style.display = 'block';
        } else if (slipBox) {
            slipBox.style.display = 'none';
        }

        // B. 1-Click GPS Share Location Box
        let gpsBox = document.getElementById('skmMenuGpsBox');
        const cPhoneEl = document.getElementById('cPhone');
        if (pf.gpsLocation && cPhoneEl) {
            if (!gpsBox) {
                gpsBox = document.createElement('div');
                gpsBox.id = 'skmMenuGpsBox';
                gpsBox.style.cssText = 'margin-bottom:12px; display:flex; flex-direction:column; gap:6px;';
                gpsBox.innerHTML = `
                    <button type="button" id="skmGpsBtn" class="btn-act btn-outline" style="width:100%; padding:10px; font-size:12.5px; border-style:dashed; border-color:var(--lux-accent); color:var(--lux-accent);" onclick="window.captureMenuGpsLocation()">
                        <i class="fa-solid fa-location-crosshairs"></i> 📍 យកទីតាំងបច្ចុប្បន្នសម្រាប់ដឹកជញ្ជូន (1-Click GPS)
                    </button>
                    <div id="skmGpsStatus" style="display:none; font-size:11.5px; font-weight:800; color:var(--success); text-align:center;"></div>`;
                cPhoneEl.after(gpsBox);
            }
            gpsBox.style.display = 'flex';
        } else if (gpsBox) {
            gpsBox.style.display = 'none';
        }

        // C. Customer Split Bill Calculator inside Cart
        let splitBox = document.getElementById('skmMenuSplitBox');
        const totalRow = document.getElementById('cTotal')?.parentElement;
        if (pf.splitBill && totalRow) {
            if (!splitBox) {
                splitBox = document.createElement('div');
                splitBox.id = 'skmMenuSplitBox';
                splitBox.style.cssText = 'margin-bottom:12px; padding:10px 12px; border-radius:12px; background:var(--store-bg); border:1px solid var(--border-color);';
                splitBox.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                        <span style="font-size:12px; font-weight:800; color:var(--text-dark);">👥 គណនាចែកលុយគ្នា (Split Bill):</span>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <input type="number" id="skmMenuSplitPeople" min="1" max="30" value="1" class="input-st" style="width:58px; margin:0; padding:5px; text-align:center; font-size:13px;" oninput="window.updateMenuSplitCalc()">
                            <span style="font-size:12px; font-weight:700;">នាក់</span>
                        </div>
                    </div>
                    <div id="skmMenuSplitOut" style="display:none; margin-top:6px; font-size:13px; font-weight:900; color:var(--lux-accent); text-align:right;"></div>`;
                totalRow.before(splitBox);
            }
            splitBox.style.display = 'block';
            window.updateMenuSplitCalc();
        } else if (splitBox) {
            splitBox.style.display = 'none';
        }

        // D. Product Tags Bar & Card Badges
        renderMenuTagFilterBar();
        injectMenuCardTagBadges();
    };

    window.updateMenuSplitCalc = function() {
        const out = document.getElementById('skmMenuSplitOut');
        const inp = document.getElementById('skmMenuSplitPeople');
        if (!out || !inp) return;
        const n = parseInt(inp.value) || 1;
        if (n <= 1) { out.style.display = 'none'; return; }
        const totTxt = document.getElementById('cTotal')?.innerText || '$0';
        const rawNum = parseFloat(totTxt.replace(/[^0-9.]/g, '')) || 0;
        const isKhr = totTxt.includes('៛');
        const each = rawNum / n;
        out.innerText = isKhr
            ? `≈ ${Math.round(each).toLocaleString()} ៛ / ម្នាក់`
            : `≈ $${each.toFixed(2)} / ម្នាក់`;
        out.style.display = 'block';
    };

    // =========================================================
    // 2. PAYMENT SLIP COMPRESSION & CLOUD UPLOAD HELPER
    // =========================================================
    window.handleMenuSlipFile = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxW = 900;
                let w = img.width, h = img.height;
                if (w > maxW) { h = Math.round(h * (maxW / w)); w = maxW; }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
                canvas.toBlob((blob) => {
                    window.__skmPendingPaymentSlip = { dataUrl, blob };
                    const prev = document.getElementById('skmSlipPreview');
                    if (prev) { prev.src = dataUrl; prev.style.display = 'block'; }
                    const clr = document.getElementById('skmClearSlipBtn');
                    if (clr) clr.style.display = 'inline-block';
                    if (typeof showToast === 'function') showToast('✅ បានភ្ជាប់រូប Slip បង់ប្រាក់រួចរាល់!');
                }, 'image/jpeg', 0.72);
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };

    window.clearMenuSlip = function() {
        window.__skmPendingPaymentSlip = null;
        const prev = document.getElementById('skmSlipPreview');
        if (prev) { prev.src = ''; prev.style.display = 'none'; }
        const clr = document.getElementById('skmClearSlipBtn');
        if (clr) clr.style.display = 'none';
        const inp = document.getElementById('skmSlipFileInp');
        if (inp) inp.value = '';
    };

    window.uploadMenuPaymentSlipIfAny = async function(sbClient, orderId) {
        const slip = window.__skmPendingPaymentSlip;
        if (!slip) return { slipUrl: '', blob: null };
        if (sbClient && navigator.onLine && slip.blob) {
            try {
                const path = `payment_slips/${BRANCH}_${orderId}_${Date.now()}.jpg`;
                const { error } = await sbClient.storage.from('shop_assets').upload(path, slip.blob, { contentType: 'image/jpeg', upsert: true });
                if (!error) {
                    const { data } = sbClient.storage.from('shop_assets').getPublicUrl(path);
                    if (data && data.publicUrl) return { slipUrl: data.publicUrl, blob: slip.blob };
                }
            } catch(e) {}
        }
        return { slipUrl: slip.dataUrl, blob: slip.blob };
    };

    window.sendMenuSlipToTelegram = async function(botToken, chatId, caption, blob) {
        if (!botToken || !chatId || !blob || !navigator.onLine) return;
        try {
            const fd = new FormData();
            fd.append('chat_id', chatId);
            fd.append('caption', caption);
            fd.append('photo', blob, 'payment_slip.jpg');
            await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method: 'POST', body: fd });
        } catch(e) {}
    };

    // =========================================================
    // 3. 1-CLICK GPS SHARE LOCATION
    // =========================================================
    window.captureMenuGpsLocation = function() {
        if (!navigator.geolocation) {
            if (typeof showToast === 'function') showToast('⚠️ ឧបករណ៍នេះមិនគាំទ្រ GPS ទេ!', true);
            return;
        }
        const btn = document.getElementById('skmGpsBtn');
        const st = document.getElementById('skmGpsStatus');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> កំពុងស្វែងរកទីតាំង GPS...';
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(6);
                const lng = pos.coords.longitude.toFixed(6);
                window.__skmPendingGpsUrl = `https://maps.google.com/?q=${lat},${lng}`;
                if (btn) btn.innerHTML = '<i class="fa-solid fa-check"></i> ✅ បានភ្ជាប់ទីតាំង GPS រួចរាល់ (ចុចដើម្បីយកម្ដងទៀត)';
                if (st) {
                    st.innerHTML = `📍 <a href="${window.__skmPendingGpsUrl}" target="_blank" style="color:var(--success); text-decoration:underline;">មើលទីតាំងលើ Google Maps (${lat}, ${lng})</a>`;
                    st.style.display = 'block';
                }
                if (typeof showToast === 'function') showToast('📍 បានយកទីតាំង GPS ជោគជ័យ!');
            },
            () => {
                if (btn) btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> 📍 យកទីតាំងបច្ចុប្បន្ន (សូមអនុញ្ញាត GPS)';
                if (typeof showToast === 'function') showToast('⚠️ សូមបើក Allow Location លើ Browser!', true);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // =========================================================
    // 4. CUSTOMER DIGITAL RECEIPT PNG AFTER CHECKOUT
    // =========================================================
    let lastReceiptOrder = null;
    window.showCustomerDigitalReceipt = function(ord) {
        const pf = getPF();
        if (!pf.digitalReceipt || !ord) return;
        lastReceiptOrder = ord;
        let modal = document.getElementById('skmMenuReceiptModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skmMenuReceiptModal';
            modal.className = 'modal-bg';
            modal.style.zIndex = '5000';
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            modal.innerHTML = `
                <div class="modal-content" style="max-width:440px;">
                    <div class="modal-header">
                        <h3>🧾 វិក្កយបត្រកុម្ម៉ង់ជោគជ័យ</h3>
                        <i class="fa-solid fa-xmark modal-close" onclick="document.getElementById('skmMenuReceiptModal').style.display='none'"></i>
                    </div>
                    <div id="skmMenuReceiptBody" style="background:#ffffff; color:#111827; padding:18px; border-radius:16px; border:1px dashed #cbd5e1; font-size:13px; line-height:1.6;"></div>
                    <div style="display:flex; gap:10px; margin-top:14px;">
                        <button type="button" class="btn-act btn-outline" onclick="document.getElementById('skmMenuReceiptModal').style.display='none'">បិទ</button>
                        <button type="button" class="btn-act btn-green" onclick="window.downloadMenuReceiptPNG()"><i class="fa-solid fa-download"></i> ទាញយករូបវិក្កយបត្រ (PNG)</button>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }

        const shopNm = document.getElementById('lpName')?.innerText || 'SKM SHOP';
        const itemsHtml = (ord.items || []).map((it, i) => `
            <div style="display:flex; justify-content:space-between; border-bottom:1px dotted #e2e8f0; padding:4px 0;">
                <span>${i+1}. ${String(it.name||'').replace(/</g,'&lt;')} ×${it.qty}</span>
                <b>$${(Number(it.price||0) * Number(it.qty||1)).toFixed(2)}</b>
            </div>`).join('');

        document.getElementById('skmMenuReceiptBody').innerHTML = `
            <div style="text-align:center; border-bottom:1px dashed #94a3b8; padding-bottom:10px; margin-bottom:10px;">
                <div style="font-size:18px; font-weight:900;">${shopNm}</div>
                <div style="font-size:12px; color:#64748b;">បង្កាន់ដៃកុម្ម៉ង់ឌីជីថល / Digital Receipt</div>
                <div style="font-family:monospace; font-weight:900; color:#0284c7; margin-top:4px;">#${ord.id}</div>
            </div>
            <div><b>អតិថិជន:</b> ${String(ord.customerName||'').replace(/</g,'&lt;')} ${ord.customerPhone ? '(' + ord.customerPhone + ')' : ''}</div>
            <div><b>កាលបរិច្ឆេទ:</b> ${ord.date || ''}</div>
            <div style="margin:10px 0;">${itemsHtml}</div>
            <div style="display:flex; justify-content:space-between; font-size:17px; font-weight:900; border-top:1px dashed #94a3b8; padding-top:8px;">
                <span>សរុបទឹកប្រាក់:</span>
                <span style="color:#059669;">$${Number(ord.totalAmount||0).toFixed(2)} (${Math.round(ord.totalRiel||0).toLocaleString()} ៛)</span>
            </div>
            <div style="text-align:center; font-size:11.5px; color:#64748b; margin-top:10px;">សូមអរគុណសម្រាប់ការកុម្ម៉ង់! 🙏</div>`;

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    };

    window.downloadMenuReceiptPNG = function() {
        const ord = lastReceiptOrder;
        if (!ord) return;
        const items = ord.items || [];
        const width = 540;
        const height = 290 + items.length * 36;
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 26px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(document.getElementById('lpName')?.innerText || 'SKM SHOP', width / 2, 48);
        ctx.fillStyle = '#64748b'; ctx.font = '15px sans-serif';
        ctx.fillText('Digital Order Receipt', width / 2, 74);
        ctx.fillStyle = '#0284c7'; ctx.font = 'bold 18px monospace';
        ctx.fillText('#' + ord.id, width / 2, 102);

        ctx.strokeStyle = '#cbd5e1'; ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(28, 120); ctx.lineTo(width - 28, 120); ctx.stroke();
        ctx.setLineDash([]);

        ctx.textAlign = 'left'; ctx.fillStyle = '#1e293b'; ctx.font = '15px sans-serif';
        ctx.fillText(`Customer: ${ord.customerName || ''} ${ord.customerPhone ? '(' + ord.customerPhone + ')' : ''}`, 30, 148);
        ctx.fillText(`Date: ${ord.date || ''}`, 30, 174);

        let y = 212;
        items.forEach((it, idx) => {
            ctx.textAlign = 'left'; ctx.fillStyle = '#0f172a'; ctx.font = '15px sans-serif';
            ctx.fillText(`${idx + 1}. ${String(it.name || '').slice(0, 32)} x${it.qty}`, 30, y);
            ctx.textAlign = 'right'; ctx.font = 'bold 15px sans-serif';
            ctx.fillText(`$${(Number(it.price || 0) * Number(it.qty || 1)).toFixed(2)}`, width - 30, y);
            y += 34;
        });

        ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(28, y); ctx.lineTo(width - 28, y); ctx.stroke();
        ctx.setLineDash([]);

        y += 34;
        ctx.textAlign = 'left'; ctx.fillStyle = '#0f172a'; ctx.font = 'bold 20px sans-serif';
        ctx.fillText('TOTAL:', 30, y);
        ctx.textAlign = 'right'; ctx.fillStyle = '#059669';
        ctx.fillText(`$${Number(ord.totalAmount || 0).toFixed(2)} (${Math.round(ord.totalRiel || 0).toLocaleString()} KHR)`, width - 30, y);

        const a = document.createElement('a');
        a.download = `Receipt_${ord.id}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
        if (typeof showToast === 'function') showToast('✅ បានទាញយករូបវិក្កយបត្រ PNG រួចរាល់!');
    };

    // =========================================================
    // 5. PRODUCT TAGS BADGES & FILTER PILLS
    // =========================================================
    function renderMenuTagFilterBar() {
        const pf = getPF();
        const catTabs = document.getElementById('catTabs');
        let bar = document.getElementById('skmMenuTagFilterBar');
        if (!pf.productTags || !catTabs) {
            if (bar) bar.style.display = 'none';
            return;
        }
        const tagMap = (window.sysSettings && window.sysSettings.productTagsMap) || {};
        if (Object.keys(tagMap).length === 0) {
            if (bar) bar.style.display = 'none';
            return;
        }
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'skmMenuTagFilterBar';
            bar.style.cssText = 'display:flex; gap:7px; overflow-x:auto; padding:0 18px 14px 18px; scrollbar-width:none;';
            catTabs.after(bar);
        }
        bar.style.display = 'flex';
        const pills = [{ id: 'all', label: '✨ ទាំងអស់' }, ...Object.entries(TAG_META).map(([id, m]) => ({ id, label: m.label }))];
        bar.innerHTML = pills.map(p => `
            <button type="button" onclick="window.setMenuTagFilter('${p.id}')" style="padding:5px 12px; border-radius:999px; border:1px solid var(--border-color); background:${activeTagFilter===p.id ? 'var(--lux-grad)' : 'var(--card-bg)'}; color:${activeTagFilter===p.id ? '#14110B' : 'var(--text-dark)'}; font-size:11.5px; font-weight:800; white-space:nowrap; cursor:pointer;">${p.label}</button>`).join('');
    }

    window.setMenuTagFilter = function(tagId) {
        activeTagFilter = tagId;
        renderMenuTagFilterBar();
        injectMenuCardTagBadges();
    };

    function injectMenuCardTagBadges() {
        const pf = getPF();
        if (!pf.productTags) return;
        const tagMap = (window.sysSettings && window.sysSettings.productTagsMap) || {};
        document.querySelectorAll('#productGrid .p-card').forEach(card => {
            const oc = card.getAttribute('onclick') || '';
            const m = oc.match(/openDet\('([^']+)'\)/);
            if (!m) return;
            const pid = m[1];
            const tags = Array.isArray(tagMap[pid]) ? tagMap[pid] : [];
            card.style.display = (activeTagFilter === 'all' || tags.includes(activeTagFilter)) ? '' : 'none';
            const imgBox = card.querySelector('.p-img-box');
            if (!imgBox) return;
            let badgeWrap = imgBox.querySelector('.skm-tag-badges');
            if (tags.length === 0) { if (badgeWrap) badgeWrap.remove(); return; }
            if (!badgeWrap) {
                badgeWrap = document.createElement('div');
                badgeWrap.className = 'skm-tag-badges';
                badgeWrap.style.cssText = 'position:absolute; bottom:8px; right:8px; display:flex; gap:4px; flex-wrap:wrap; justify-content:flex-end; z-index:11;';
                imgBox.appendChild(badgeWrap);
            }
            badgeWrap.innerHTML = tags.map(tid => {
                const meta = TAG_META[tid];
                return meta ? `<span style="background:${meta.bg}; color:${meta.color}; font-size:9px; font-weight:800; padding:2px 7px; border-radius:999px; box-shadow:0 2px 6px rgba(0,0,0,0.3);">${meta.label}</span>` : '';
            }).join('');
        });
    }

    // Observe productGrid re-renders & total changes automatically
    function bootMenuPro() {
        window.syncMenuProFeatures();
        const grid = document.getElementById('productGrid');
        if (grid) {
            new MutationObserver(() => {
                renderMenuTagFilterBar();
                injectMenuCardTagBadges();
            }).observe(grid, { childList: true });
        }
        const cTot = document.getElementById('cTotal');
        if (cTot) {
            new MutationObserver(() => window.updateMenuSplitCalc()).observe(cTot, { childList: true, characterData: true, subtree: true });
        }
        // Re-check once cloud init finishes
        setTimeout(() => window.syncMenuProFeatures(), 1200);
        setTimeout(() => window.syncMenuProFeatures(), 3000);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(bootMenuPro, 200));
    else setTimeout(bootMenuPro, 200);
})();
