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
            window.registerCustomTool('⚠️', 'កត់ត្រាទំនិញខូចខាត', openWastageModal);
            clearInterval(initInt);
        }
    }, 500);

})();