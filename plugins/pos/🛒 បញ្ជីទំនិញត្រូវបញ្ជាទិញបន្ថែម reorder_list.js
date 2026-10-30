/* STREAMING_CHUNK:Initializing POS Reorder Shopping List Plugin Pro... */
(function() {
    console.log("🛒 POS Reorder Shopping List Plugin Pro Initialized!");

    // 🌟 បង្កប់ CSS ផ្ទាល់ខ្លួនដើម្បីធានាថា Modal លេចចេញមកស្អាត និងទំនើប ១០០%
    if (!document.getElementById('skm-reorder-style')) {
        const style = document.createElement('style');
        style.id = 'skm-reorder-style';
        style.innerHTML = `
            .skm-reorder-bg {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
                z-index: 100000; display: flex; justify-content: center; align-items: center;
                font-family: 'Battambang', sans-serif; opacity: 0; transition: opacity 0.3s ease;
                pointer-events: none;
            }
            .skm-reorder-bg.skm-show {
                opacity: 1; pointer-events: auto;
            }
            .skm-reorder-content {
                background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b);
                max-width: 500px; width: 92%; padding: 25px; border-radius: 28px;
                max-height: 88vh; display: flex; flex-direction: column;
                box-shadow: 0 25px 60px -15px rgba(0,0,0,0.3);
                transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid var(--border-color, #e2e8f0);
            }
            .skm-reorder-bg.skm-show .skm-reorder-content {
                transform: translateY(0) scale(1);
            }
            .skm-reorder-item-card {
                background: var(--store-bg, #f8fafc); padding: 12px 16px; border-radius: 16px;
                border: 1px solid var(--border-color, #e2e8f0); display: flex; justify-content: space-between; align-items: center;
                transition: all 0.25s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            }
            .skm-reorder-item-card:hover {
                border-color: #f59e0b; background: rgba(245, 158, 11, 0.04);
                transform: translateY(-1px); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    /* STREAMING_CHUNK:Opening Reorder Modal... */
    function openReorderModal() {
        let modal = document.getElementById('skmReorderModal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('skm-show'), 10);
            loadReorderItems();
            return;
        }

        modal = document.createElement('div');
        modal.className = 'skm-reorder-bg';
        modal.id = 'skmReorderModal';
        
        // ចុចក្រៅប្រអប់ដើម្បីបិទ
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('skm-show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };

        modal.innerHTML = `
            <div class="skm-reorder-content" onclick="event.stopPropagation()">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border-color, #e2e8f0); padding-bottom:15px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width: 44px; height: 44px; background: rgba(245, 158, 11, 0.12); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px;">
                            🛒
                        </div>
                        <div>
                            <h3 style="color:var(--text-dark, #1e293b); margin:0; font-size:17px; font-weight:900;">បញ្ជីទំនិញត្រូវបញ្ជាទិញបន្ថែម</h3>
                            <div style="font-size:11px; color:var(--text-muted, #64748b); font-weight:700;" id="skmReorderDateDisplay">កាលបរិច្ឆេទ: ...</div>
                        </div>
                    </div>
                    <div onclick="document.getElementById('skmReorderModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmReorderModal').style.display='none', 300);" style="color: var(--text-muted, #9ca3af); font-size: 16px; cursor: pointer; width: 34px; height: 34px; border-radius: 50%; background: var(--store-bg, #f1f5f9); display: flex; align-items: center; justify-content: center; font-weight: bold;">✕</div>
                </div>
                
                <div style="font-size:12px; color:var(--text-muted, #64748b); margin-bottom:10px; font-weight:800;">ទំនិញដែលមានស្តុកតិចជាង ឬស្មើ 5 ឯកតា៖</div>
                
                <div id="skmReorderListContent" style="flex:1; overflow-y:auto; max-height:45vh; padding-right:5px; margin-bottom:20px; display:flex; flex-direction:column; gap:10px;">
                    <!-- Items inject here -->
                </div>

                <div style="display:flex; gap:12px; border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 18px;">
                    <button style="flex:1; border:1px solid var(--border-color, #e2e8f0); color:var(--text-dark, #1e293b); border-radius:14px; padding:13px; font-weight:bold; cursor:pointer; background:transparent; font-family:'Battambang';" onclick="document.getElementById('skmReorderModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmReorderModal').style.display='none', 300);">បិទ</button>
                    <button style="flex:1; background:linear-gradient(135deg, #f59e0b, #d97706); color:white; border:none; border-radius:14px; padding:13px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35); font-family:'Battambang';" onclick="window.printReorderListPro()">🖨️ បោះពុម្ពបញ្ជីទិញ</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        
        loadReorderItems();
    }

    /* STREAMING_CHUNK:Loading Reorder Items with Khmer date formatting... */
    function loadReorderItems() {
        const content = document.getElementById('skmReorderListContent');
        if(!content) return;

        let branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        let todayStr = new Date().toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
        const dateDisp = document.getElementById('skmReorderDateDisplay');
        if(dateDisp) dateDisp.innerText = `ថ្ងៃទី: ${todayStr}`;

        let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${branchId}_inv_pro`) || '[]');
        let lowItems = inv.filter(p => (parseInt(p.qty) || 0) <= 5);

        if(lowItems.length === 0) {
            content.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted, #64748b); font-size:13px; font-weight:800;">🎉 គ្មានទំនិញណាខ្វះស្តុកទេ! ស្តុកសុទ្ធតែមានគ្រប់គ្រាន់។</div>';
            return;
        }

        content.innerHTML = lowItems.map((p) => `
            <div class="skm-reorder-item-card">
                <div>
                    <div style="font-weight:900; color:var(--text-dark, #1e293b); font-size:13px; margin-bottom:3px;">📦 ${p.name}</div>
                    <div style="font-size:11px; color:#ef4444; font-weight:800;">ស្តុកបច្ចុប្បន្ន: ${p.qty} ${p.unit || ''}</div>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:12px; color:var(--text-muted, #64748b); font-weight:800;">ណែនាំទិញ: <b style="color:#f59e0b; font-size:14px;">10</b> ឯកតា</span>
                </div>
            </div>
        `).join('');
    }

    // មុខងារ Print បញ្ជីទិញស្តុកដាច់ដោយឡែកយ៉ាងស្អាត
    window.printReorderListPro = function() {
        let branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${branchId}_inv_pro`) || '[]');
        let lowItems = inv.filter(p => (parseInt(p.qty) || 0) <= 5);

        if(lowItems.length === 0) {
            alert('គ្មានទំនិញត្រូវបញ្ជាទិញទេ!');
            return;
        }

        const printWin = window.open('', '_blank', 'width=500,height=700');
        printWin.document.write(`
            <html>
            <head>
                <title>Reorder Shopping List</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Battambang', sans-serif; padding: 25px; color: #1e293b; background: #ffffff; margin: 0; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    h2 { text-align: center; color: #f59e0b; font-size: 20px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;}
                    p.subtitle { text-align: center; font-size: 12px; color: #64748b; margin-top: 0; margin-bottom: 25px;}
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th, td { border: 1px solid #cbd5e1; padding: 10px 12px; font-size: 13px; text-align: left; }
                    th { background: #f8fafc; font-weight: 900; }
                </style>
            </head>
            <body>
                <h2>🛒 បញ្ជីទំនិញត្រូវបញ្ជាទិញបន្ថែម (Reorder List)</h2>
                <p class="subtitle">ថ្ងៃទី៖ ${new Date().toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' })} | សាខា៖ ${branchId}</p>
                <table>
                    <thead>
                        <tr>
                            <th>ល.រ</th>
                            <th>ឈ្មោះទំនិញ</th>
                            <th>ស្តុកសល់</th>
                            <th>ចំនួនណែនាំទិញ</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lowItems.map((p, i) => `
                            <tr>
                                <td style="text-align:center; width:40px;">${i+1}</td>
                                <td style="font-weight:bold;">${p.name}</td>
                                <td style="color:#ef4444; font-weight:bold;">${p.qty}${p.unit || ''}</td>
                                <td style="font-weight:bold; color:#d97706;">10 ឯកតា</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div style="text-align:center; font-size:11px; color:#94a3b8; margin-top:50px;">បោះពុម្ពចេញពីប្រព័ន្ធគិតលុយ POS ហាងកាហ្វេ</div>
            </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); printWin.close(); }, 600);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🛒', 'បញ្ជីទំនិញត្រូវបញ្ជាទិញបន្ថែម', openReorderModal);
            clearInterval(initInt);
        }
    }, 300);
})();