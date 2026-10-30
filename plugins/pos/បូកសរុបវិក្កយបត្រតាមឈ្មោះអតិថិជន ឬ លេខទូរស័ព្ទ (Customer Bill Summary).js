/* STREAMING_CHUNK:Initializing POS Pending Invoices Summary Pro v20 */
(function() {
    console.log("🧾 POS Pending Invoices Summary Pro v20 Initialized!");

    if (document.getElementById('skm-pos-custbill-style')) {
        document.getElementById('skm-pos-custbill-style').remove();
    }

    const style = document.createElement('style');
    style.id = 'skm-pos-custbill-style';
    style.innerHTML = `
        .skm-pos-cb-bg {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(30, 20, 15, 0.75); backdrop-filter: blur(6px);
            z-index: 100000; display: flex; justify-content: center; align-items: center;
            font-family: 'Battambang', sans-serif; opacity: 0; transition: opacity 0.3s ease;
            pointer-events: none; padding: 20px;
        }
        .skm-pos-cb-bg.skm-show {
            opacity: 1; pointer-events: auto;
        }
        .skm-pos-cb-content {
            background: #FAF6F0; color: #4A3B32; max-width: 520px; width: 100%;
            padding: 25px; border-radius: 28px; border: 2px solid #E8D8C8;
            box-shadow: 0 25px 60px -15px rgba(74, 59, 50, 0.35);
            transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex; flex-direction: column; max-height: 90vh; overflow-y: auto;
        }
        .skm-pos-cb-bg.skm-show .skm-pos-cb-content {
            transform: translateY(0) scale(1);
        }
        .skm-inv-pill {
            background: #F3EBE1; border: 1px solid #D4B89F;
            color: #4A3B32; padding: 8px 14px; border-radius: 12px;
            font-size: 12px; font-weight: 900; cursor: pointer; transition: all 0.2s;
            display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }
        .skm-inv-pill:hover {
            background: #B85D19; color: white; border-color: #B85D19; transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(184,93,25,0.3);
        }
    `;
    document.head.appendChild(style);

    async function openCustomerBillModal() {
        let modal = document.getElementById('skmPosCustomerBillModal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('skm-show'), 10);
            document.getElementById('posCustBillResultArea').style.display = 'none';
            document.getElementById('posTargetCustomerInput').value = '';
            await renderPendingInvoicesList();
            return;
        }

        modal = document.createElement('div');
        modal.className = 'skm-pos-cb-bg';
        modal.id = 'skmPosCustomerBillModal';
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('skm-show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };
        
        modal.innerHTML = `
            <div class="skm-pos-cb-content" onclick="event.stopPropagation()">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #E8D8C8; padding-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 42px; height: 42px; background: rgba(184, 93, 25, 0.12); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                            🧾
                        </div>
                        <div>
                            <h3 style="color: #B85D19; font-weight: 900; font-size: 16px; margin: 0;">វិក្កយបត្ររង់ចាំគិតលុយ</h3>
                            <div style="font-size: 11px; color: #8C7A6B; font-weight: 700;">Pending Invoices Bill Summary</div>
                        </div>
                    </div>
                    <div onclick="document.getElementById('skmPosCustomerBillModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmPosCustomerBillModal').style.display='none', 300);" style="color: #8C7A6B; font-size: 16px; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; background: #F3EBE1; display: flex; align-items: center; justify-content: center; font-weight: bold;">✕</div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="font-size: 11px; display: block; margin-bottom: 6px; font-weight: 800; color: #8C7A6B; text-transform: uppercase;">📌 វិក្កយបត្រមិនទាន់គិតលុយ / រង់ចាំទូទាត់ (CLICK ដើម្បីមើលភ្លាមៗ):</label>
                    <div id="skmActiveInvoicesContainer" style="display: flex; gap: 8px; flex-wrap: wrap; max-height: 150px; overflow-y: auto; padding-bottom: 4px;">
                        <span style="font-size:12px; color:#8C7A6B; font-weight:bold;">⏳ កំពុងទាញយកវិក្កយបត្ររង់ចាំ...</span>
                    </div>
                </div>

                <label style="font-size: 12px; display: block; margin-bottom: 6px; font-weight: 800; color: #4A3B32;">ស្វែងរកតាម លេខវិក្កយបត្រ (INV-... / ORD-...)៖</label>
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <input type="text" id="posTargetCustomerInput" class="input-st" placeholder="ឧ. INV-260930-003..." style="margin-bottom:0; flex: 1; padding: 12px; font-size: 13px; background: #fff; border-color: #D4B89F;" onkeypress="if(event.key === 'Enter') window.calculateCustomerBill()">
                    <button onclick="window.calculateCustomerBill()" style="background: #6F4E37; color: white; border: none; padding: 10px 18px; border-radius: 12px; font-weight: bold; cursor: pointer; font-family:'Battambang'; box-shadow: 0 4px 12px rgba(111,78,55,0.3); font-size: 13px;">🔍 រកមើល</button>
                </div>

                <div id="posCustBillResultArea" style="background: #F3EBE1; border: 1px solid #D4B89F; padding: 15px; border-radius: 16px; margin-bottom: 15px; text-align: left; max-height: 220px; overflow-y: auto; display: none; font-size: 12px;">
                </div>

                <div style="display: flex; gap: 12px; border-top: 1px solid #E8D8C8; padding-top: 15px;">
                    <button style="flex: 1; border: 1px solid #E8D8C8; color: #4A3B32; border-radius: 14px; padding: 12px; font-weight: bold; cursor: pointer; background: transparent; font-family:'Battambang'; font-size: 13px;" onclick="document.getElementById('skmPosCustomerBillModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmPosCustomerBillModal').style.display='none', 300);">បិទ</button>
                    <button id="btnPosPrintCustBill" style="flex: 1; background: linear-gradient(135deg, #B85D19, #8B4513); color: white; border: none; border-radius: 14px; padding: 12px; font-weight: bold; cursor: pointer; font-family:'Battambang'; display: none; box-shadow: 0 4px 15px rgba(184,93,25,0.35); font-size: 13px;" onclick="window.printCustomerBillSummary()">🖨 បោះពុម្ពវិក្កយបត្រ</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('skm-show'), 10);
        await renderPendingInvoicesList();
    }

    async function fetchAllInvoicesSystem() {
        let allOrders = [];
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';

        // 1. Fetch from Supabase Cloud Database
        if (window.supabase) {
            try {
                const supabaseClient = window.supabase.createClient('https://uynmpjykedjjjyxczsja.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bm1wanlrZWRqamp5eGN6c2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MDc1NjIsImV4cCI6MjEwMjE4MzU2Mn0.vw8UpBoEWvbQwl2J5alfTB0nvv7EizB8EpwEsp4ugCg');
                let { data } = await supabaseClient.from('branch_store').select('data_json').eq('branch_id', branchId).maybeSingle();
                if (data && data.data_json) {
                    let d = data.data_json;
                    if (d.invoices && Array.isArray(d.invoices)) allOrders = [...allOrders, ...d.invoices];
                    if (d.orders && Array.isArray(d.orders)) allOrders = [...allOrders, ...d.orders];
                }
            } catch(err) {
                console.warn("Cloud fetch warning:", err);
            }
        }

        // 2. Fetch from LocalStorage
        try {
            let localInv = JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices`) || '[]');
            if(Array.isArray(localInv)) allOrders = [...allOrders, ...localInv];
        } catch(e) {}

        try {
            let localOrders = JSON.parse(localStorage.getItem('skm_my_orders_history') || '[]');
            if(Array.isArray(localOrders)) allOrders = [...allOrders, ...localOrders];
        } catch(e) {}

        // Filter valid invoices
        let realInvoices = allOrders.filter(o => {
            if (!o) return false;
            let oid = String(o.id || o.invoice_id || o.code || '');
            if (!oid || oid.startsWith('pjs_') || oid.startsWith('mjs_') || oid.startsWith('skm_')) return false;
            return oid.includes('INV') || oid.includes('ORD');
        });

        let uniqueMap = new Map();
        realInvoices.forEach(o => {
            let oid = String(o.id || o.invoice_id || o.code);
            uniqueMap.set(oid, { ...o, id: oid });
        });

        let results = Array.from(uniqueMap.values());
        results.sort((a, b) => b.id.localeCompare(a.id));
        return results;
    }

    async function fetchPendingInvoices() {
        let allInvoices = await fetchAllInvoicesSystem();
        
        let pending = allInvoices.filter(o => {
            let status = String(o.status || '').toLowerCase();
            let isPending = status.includes('រង់ចាំ') || status.includes('pending') || status.includes('processing') || status === '';
            let isPaid = status.includes('paid') || status.includes('completed') || status.includes('ទូទាត់រួច') || status.includes('ជោគជ័យ');
            return isPending && !isPaid;
        });

        if (pending.length === 0 && allInvoices.length > 0) {
            return allInvoices;
        }

        return pending;
    }

    async function renderPendingInvoicesList() {
        const container = document.getElementById('skmActiveInvoicesContainer');
        if(!container) return;

        container.innerHTML = '<span style="font-size:12px; color:#8C7A6B; font-weight:bold;">⏳ កំពុងទាញយកវិក្កយបត្ររង់ចាំ...</span>';
        
        let orders = await fetchPendingInvoices();

        if (orders.length === 0) {
            container.innerHTML = '<span style="font-size:11px; color:#8C7A6B; font-weight:bold;">មិនមានវិក្កយបត្ររង់ចាំគិតលុយទេក្នុងប្រព័ន្ធ</span>';
            return;
        }

        let html = '';
        orders.forEach(o => {
            if (o.id) {
                let custName = o.customer || o.name || 'អតិថិជនទូទៅ';
                let label = `${o.id} (${custName})`;
                html += `<div class="skm-inv-pill" onclick="window.selectInvoiceQuick('${o.id}')">🧾 ${label}</div>`;
            }
        });
        container.innerHTML = html;
    }

    window.selectInvoiceQuick = function(invId) {
        document.getElementById('posTargetCustomerInput').value = invId;
        window.calculateCustomerBill();
    };

    window.calculateCustomerBill = async function() {
        const inputVal = document.getElementById('posTargetCustomerInput').value.trim().toLowerCase();
        const resultArea = document.getElementById('posCustBillResultArea');
        const printBtn = document.getElementById('btnPosPrintCustBill');
        
        if (!inputVal) {
            if(typeof showToast === 'function') showToast('សូមបញ្ចូលលេខវិក្កយបត្រ ឬឈ្មោះអតិថិជនសិន!', true);
            else alert('សូមបញ្ចូលលេខវិក្កយបត្រ ឬឈ្មោះអតិថិជនសិន!');
            return;
        }

        resultArea.style.display = 'block';
        resultArea.innerHTML = '<div style="text-align:center; color:#8C7A6B; padding: 10px;">🔍 កំពុងស្វែងរកទិន្នន័យ...</div>';

        let orders = await fetchAllInvoicesSystem();

        let matchedOrders = orders.filter(o => {
            let oid = String(o.id || '').toLowerCase();
            let cust = String(o.customer || o.name || '').toLowerCase();
            return oid.includes(inputVal) || cust.includes(inputVal);
        });

        if (matchedOrders.length === 0) {
            resultArea.innerHTML = `<div style="text-align:center; color:#8C7A6B; padding: 15px; font-weight: bold;">❌ រកមិនឃើញវិក្កយបត្រ "${inputVal}" ទេ</div>`;
            printBtn.style.display = 'none';
            return;
        }

        let grandTotal = 0;
        let allItemsMap = {};

        matchedOrders.forEach(o => {
            grandTotal += parseFloat(o.totalAmount || o.total || o.total_amount || 0);
            let items = o.items || o.cart || o.products || [];
            if (Array.isArray(items)) {
                items.forEach(item => {
                    let name = item.name || item.title || 'ទំនិញ';
                    let qty = parseInt(item.qty || item.quantity || 1);
                    if (allItemsMap[name]) allItemsMap[name] += qty;
                    else allItemsMap[name] = qty;
                });
            } else if (o.name) {
                let name = o.name;
                let qty = parseInt(o.qty || 1);
                if (allItemsMap[name]) allItemsMap[name] += qty;
                else allItemsMap[name] = qty;
            }
        });

        let itemsHtml = Object.keys(allItemsMap).map(key => `<div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:700;"><span>• ${key}</span> <span>x${allItemsMap[key]}</span></div>`).join('');
        let exRate = 4000;
        let totalKhr = Math.round(grandTotal * exRate).toLocaleString();

        resultArea.innerHTML = `
            <div style="border-bottom: 1px dashed #D4B89F; padding-bottom: 8px; margin-bottom: 8px; font-weight:900; color:#4A3B32;">
                📋 បញ្ជីទំនិញសរុប (វិក្កយបត្រ: ${inputVal}):<br>
            </div>
            <div style="margin-bottom: 10px; color: #4A3B32; max-height: 120px; overflow-y: auto;">
                ${itemsHtml || '<i>(មិនមានព័ត៌មានលម្អិតមុខទំនិញ)</i>'}
            </div>
            <div style="border-top: 1px solid #D4B89F; padding-top: 8px; display: flex; justify-content: space-between; font-weight: 900; color: #B85D19; font-size: 14px;">
                <span>ទឹកប្រាក់សរុបរួម:</span>
                <span>$${grandTotal.toFixed(2)} (${totalKhr} ៛)</span>
            </div>
        `;
        printBtn.style.display = 'block';
    };

    window.printCustomerBillSummary = function() {
        const resultHtml = document.getElementById('posCustBillResultArea').innerHTML;
        const searchKey = document.getElementById('posTargetCustomerInput').value;
        const printWin = window.open('', '_blank', 'width=450,height=650');
        printWin.document.write(`
            <html>
            <head>
                <title>Bill - ${searchKey}</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Battambang', sans-serif; padding: 25px; color: #4A3B32; background: #FAF6F0; margin: 0; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    h2 { text-align: center; color: #B85D19; font-size: 18px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px dashed #B85D19; padding-bottom: 8px;}
                    p.subtitle { text-align: center; font-size: 11px; color: #64748b; margin-top: 0; margin-bottom: 15px; font-weight: bold;}
                </style>
            </head>
            <body>
                <h2>🧾 សេចក្តីសង្ខេបវិក្កយបត្រ</h2>
                <p class="subtitle">លេខវិក្កយបត្រ៖ ${searchKey} | កាលបរិច្ឆេទ៖ ${new Date().toLocaleString('km-KH')}</p>
                <div>${resultHtml}</div>
                <div style="text-align:center; font-size:10px; color:#94a3b8; margin-top:30px;">បោះពុម្ពចេញពីប្រព័ន្ធគិតលុយ POS ហាងកាហ្វេ</div>
            </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); printWin.close(); }, 500);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🧾', 'វិក្កយបត្ររង់ចាំគិតលុយ (Bill Summary)', openCustomerBillModal);
            clearInterval(initInt);
        }
    }, 300);
})();