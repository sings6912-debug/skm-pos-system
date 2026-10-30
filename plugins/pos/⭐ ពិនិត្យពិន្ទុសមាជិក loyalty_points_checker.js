/* STREAMING_CHUNK:Initializing Loyalty Checker Plugin with Print functionality... */
(function() {
    console.log("⭐ POS Loyalty Points Checker Plugin Initialized!");

    function getCurrentBranchId() {
        return window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    }

    function openLoyaltyModal() {
        if(document.getElementById('skmLoyaltyModal')) {
            document.getElementById('skmLoyaltyModal').style.display = 'flex';
            loadLoyaltyList('');
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmLoyaltyModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;`;
        
        modal.innerHTML = `
            <div style="background: var(--bg-card, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 16px; width: 480px; max-height: 85vh; display:flex; flex-direction:column; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px;">
                    <h3 style="color:#f59e0b; margin:0; font-size:18px; font-weight:900;">⭐ ពិនិត្យពិន្ទុសមាជិក (Loyalty)</h3>
                    <button onclick="document.getElementById('skmLoyaltyModal').style.display='none'" style="background:#ef4444; border:none; color:#fff; width:28px; height:28px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <input type="text" id="skmLoyaltySearchInp" class="form-control" placeholder="🔍 ស្វែងរកឈ្មោះ ឬលេខទូរស័ព្ទសមាជិក..." style="width:100%; padding:12px; border-radius:10px; border:1px solid #f59e0b; outline:none; font-family:'Battambang';">
                </div>

                <div id="skmLoyaltyList" style="flex:1; overflow-y:auto; max-height:45vh; padding-right:5px;"></div>

                <div style="display:flex; gap:10px; border-top: 1px solid var(--border); padding-top: 15px; margin-top: 10px;">
                    <button class="btn btn-outline" style="flex:1; padding:12px; border-radius:10px;" onclick="document.getElementById('skmLoyaltyModal').style.display='none'">បិទត្រឡប់</button>
                    <button class="btn btn-primary" style="flex:1; padding:12px; border-radius:10px; background:#f59e0b; border:none; color:#fff; font-weight:bold; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);" onclick="window.printLoyaltyList()">🖨️ បោះពុម្ព (Print)</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('skmLoyaltySearchInp').oninput = (e) => {
            loadLoyaltyList(e.target.value.toLowerCase());
        };
        loadLoyaltyList('');
    }

    /* STREAMING_CHUNK:Rendering Loyalty List... */
    function loadLoyaltyList(filter) {
        const list = document.getElementById('skmLoyaltyList');
        if(!list) return;

        const branchId = getCurrentBranchId();
        let customers = window.customers || JSON.parse(localStorage.getItem(`ks2_${branchId}_customers_pro`) || '[]');
        
        if(filter) {
            customers = customers.filter(c => (c.name && c.name.toLowerCase().includes(filter)) || (c.phone && c.phone.includes(filter)));
        }

        // រៀបចំសមាជិកមានពិន្ទុខ្ពស់មកលើគេ
        customers.sort((a, b) => parseFloat(b.totalPaid || b.paid || 0) - parseFloat(a.totalPaid || a.paid || 0));

        if(customers.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:13px; font-weight:bold;">រកមិនឃើញទិន្នន័យសមាជិកទេ 🥲</div>';
            return;
        }

        list.innerHTML = customers.map(c => {
            let totalSpent = parseFloat(c.totalPaid || c.paid || 0);
            let points = Math.floor(totalSpent); // ឧទាហរណ៍៖ ចំណាយ 1$ = 1 ពិន្ទុ
            let tier = points >= 500 ? '👑 VIP Gold' : (points >= 200 ? '⭐ Silver' : '🥉 Member');

            return `
                <div class="loyalty-print-item" style="background:rgba(245, 158, 11, 0.05); padding:12px 15px; border-radius:10px; margin-bottom:8px; border:1px dashed #f59e0b; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:900; color:var(--text-main); font-size:15px; margin-bottom:4px;">👤 ${c.name}</div>
                        <div style="font-size:12px; color:var(--text-muted);">📞 ${c.phone || 'គ្មានលេខ'} | កម្រិត: <b style="color:#f59e0b;">${tier}</b></div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:18px; font-weight:900; color:#10b981;">⭐ ${points} pts</div>
                        <div style="font-size:11px; color:var(--text-muted);">ចំណាយសរុប: $${totalSpent.toFixed(2)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* STREAMING_CHUNK:Implementing Print layout... */
    window.printLoyaltyList = function() {
        const printContent = document.getElementById('skmLoyaltyList').innerHTML;
        const branchName = getCurrentBranchId();
        
        const printWindow = window.open('', '_blank', 'width=700,height=900');
        
        printWindow.document.write(`
            <html>
            <head>
                <title>បញ្ជីពិន្ទុសមាជិកអតិថិជន</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Battambang', sans-serif; padding: 30px; color: #1e293b; background: #ffffff; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    h2 { text-align: center; color: #f59e0b; font-size: 24px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;}
                    p.subtitle { text-align: center; font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 30px;}
                    
                    /* CSS សម្រាប់ Print ឱ្យច្បាស់ល្អ */
                    [style*="rgba(245, 158, 11, 0.05)"] { background: #fffbeb !important; border: 1px solid #fcd34d !important; }
                    [style*="color:var(--text-main)"] { color: #1e293b !important; }
                    [style*="color:var(--text-muted)"] { color: #64748b !important; }
                </style>
            </head>
            <body>
                <h2>⭐ របាយការណ៍ពិន្ទុសមាជិកអតិថិជន (Loyalty Points)</h2>
                <p class="subtitle">កាលបរិច្ឆេទរបាយការណ៍៖ ${new Date().toLocaleDateString('km-KH')} | សាខា៖ ${branchName}</p>
                <div class="print-container">
                    ${printContent}
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 800);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('⭐', 'ពិនិត្យពិន្ទុសមាជិក (Loyalty)', openLoyaltyModal);
            clearInterval(initInt);
        }
    }, 500);
})();