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
            window.registerCustomTool('🔄', 'បង្វិលសងប្រាក់ (Quick Refund)', openRefundModal);
            clearInterval(initInt);
        }
    }, 500);
})();