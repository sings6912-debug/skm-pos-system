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
            window.registerCustomTool('🧾', 'បូកសរុបវិក្កយបត្រតុ/ភ្ញៀវ', openTableBillModal);
            clearInterval(initInt);
        }
    }, 300);
})();