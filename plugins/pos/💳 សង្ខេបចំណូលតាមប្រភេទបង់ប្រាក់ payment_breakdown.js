/* STREAMING_CHUNK:Initializing Fixed Payment Breakdown Plugin... */
(function() {
    console.log("💳 Fixed POS Payment Breakdown Plugin Initialized!");

    function getCurrentBranchId() {
        return window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    }

    // មុខងារគណនា និងបង្ហាញទិន្នន័យ
    window.calcBreakdownDataStandard = function() {
        const branchId = getCurrentBranchId();
        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices_pro`) || '[]');
        let today = new Date().toLocaleDateString();

        let cashTotal = 0, qrTotal = 0, unpaidTotal = 0, totalCount = 0;

        invoices.forEach(inv => {
            let invDate = inv.date ? inv.date.split(' ')[0] : '';
            if (invDate === today) {
                totalCount++;
                let amount = parseFloat(inv.totalAmount || 0);
                if (inv.status === 'paid') {
                    if (inv.note && (inv.note.includes('QR') || inv.note.includes('ABA') || inv.note.includes('វីង') || inv.note.includes('ACLEDA'))) {
                        qrTotal += amount;
                    } else {
                        cashTotal += amount;
                    }
                } else {
                    unpaidTotal += amount;
                }
            }
        });

        const container = document.getElementById('skmPayBreakdownContent');
        if(!container) return;

        container.innerHTML = `
            <div style="background:var(--store-bg, #f8fafc); padding:15px; border-radius:14px; display:flex; justify-content:space-between; align-items:center; border: 1px solid var(--border-color, #e5e7eb); margin-bottom:10px;">
                <div>
                    <div style="font-weight:900; color:var(--text-dark, #1e293b); font-size:14px; margin-bottom:4px;">💵 ប្រាក់សុទ្ធ (Cash)</div>
                    <div style="font-size:12px; color:var(--text-muted, #64748b);">លុយចូលទូរគិតប្រាក់ផ្ទាល់</div>
                </div>
                <div style="font-size:18px; font-weight:900; color:#10b981;">$${cashTotal.toFixed(2)}</div>
            </div>

            <div style="background:var(--store-bg, #f8fafc); padding:15px; border-radius:14px; display:flex; justify-content:space-between; align-items:center; border: 1px solid var(--border-color, #e5e7eb); margin-bottom:10px;">
                <div>
                    <div style="font-weight:900; color:var(--text-dark, #1e293b); font-size:14px; margin-bottom:4px;">📱 ស្កេន QR / ធនាគារ</div>
                    <div style="font-size:12px; color:var(--text-muted, #64748b);">លុយចូលកុងធនាគារ</div>
                </div>
                <div style="font-size:18px; font-weight:900; color:#06b6d4;">$${qrTotal.toFixed(2)}</div>
            </div>

            <div style="background:rgba(239, 68, 68, 0.05); padding:15px; border-radius:14px; display:flex; justify-content:space-between; align-items:center; border: 1px dashed #ef4444; margin-bottom:10px;">
                <div>
                    <div style="font-weight:900; color:#ef4444; font-size:14px; margin-bottom:4px;">📝 ជំពាក់ (Unpaid)</div>
                    <div style="font-size:12px; color:#ef4444; opacity:0.8;">មិនទាន់បានបង់ប្រាក់នៅឡើយ</div>
                </div>
                <div style="font-size:18px; font-weight:900; color:#ef4444;">$${unpaidTotal.toFixed(2)}</div>
            </div>

            <div style="text-align:center; margin-top:15px; font-size:13px; color:var(--text-muted, #64748b); font-weight:800; padding:10px; background:var(--store-bg, #f8fafc); border-radius:10px;">
                ចំនួនវិក្កយបត្រសរុបថ្ងៃនេះ: <span style="color:var(--text-dark, #1e293b); font-weight:900; font-size:15px;">${totalCount} ប័ណ្ណ</span>
            </div>
        `;
    };

    // មុខងារបើក Modal សង្ខេបចំណូល (ច្បាស់លាស់ ១០០%)
    window.openPaymentBreakdownModalStandard = function() {
        let modalBg = document.getElementById('skmPayBreakdownModal');
        if(modalBg) {
            modalBg.style.display = 'flex';
            setTimeout(() => modalBg.classList.add('show'), 10);
            window.calcBreakdownDataStandard();
            return;
        }

        modalBg = document.createElement('div');
        modalBg.className = 'modal-bg';
        modalBg.id = 'skmPayBreakdownModal';
        modalBg.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 999999; display: flex; justify-content: center; align-items: center; font-family: 'Battambang', sans-serif;`;
        
        // ចុចក្រៅប្រអប់ដើម្បីបិទ
        modalBg.onclick = function(e) {
            if (e.target === modalBg) {
                modalBg.classList.remove('show');
                setTimeout(() => modalBg.style.display = 'none', 300);
            }
        };

        modalBg.innerHTML = `
            <div class="modal-content" style="background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b); max-width: 420px; width: 90%; padding: 25px; border-radius: 24px; max-height: 85vh; display:flex; flex-direction:column; box-shadow: 0 20px 50px rgba(0,0,0,0.25);" onclick="event.stopPropagation()">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border-color, #e5e7eb); padding-bottom:12px;">
                    <h3 style="color: #06b6d4; margin:0; font-size:18px; font-weight:900;"><i class="fa-solid fa-wallet"></i> សង្ខេបចំណូលប្រចាំថ្ងៃ</h3>
                    <i class="fa-solid fa-xmark modal-close" onclick="document.getElementById('skmPayBreakdownModal').classList.remove('show'); setTimeout(() => document.getElementById('skmPayBreakdownModal').style.display='none', 300);" style="color: #9ca3af; font-size: 22px; cursor: pointer; padding: 5px;"></i>
                </div>
                
                <div id="skmPayBreakdownContent" style="flex:1; overflow-y:auto; padding-right:5px; margin-bottom:20px; display:flex; flex-direction:column; gap:5px;">
                    <!-- ទិន្នន័យ -->
                </div>

                <div style="display:flex; gap:10px;">
                    <button class="btn-act btn-outline" style="flex:1; border:1px solid var(--border-color, #e5e7eb); color:var(--text-dark, #1e293b); border-radius:14px; padding:12px; font-weight:bold; cursor:pointer; background:transparent;" onclick="document.getElementById('skmPayBreakdownModal').classList.remove('show'); setTimeout(() => document.getElementById('skmPayBreakdownModal').style.display='none', 300);">បិទ</button>
                    <button class="btn-act" style="flex:1; background:#06b6d4; color:white; border:none; border-radius:14px; padding:12px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);" onclick="window.printPayBreakdownStandard()">🖨️ បោះពុម្ព</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalBg);
        
        modalBg.style.display = 'flex';
        setTimeout(() => modalBg.classList.add('show'), 10);
        window.calcBreakdownDataStandard();
    };

    // មុខងារ Print ស្តង់ដារ
    window.printPayBreakdownStandard = function() {
        const printContent = document.getElementById('skmPayBreakdownContent').innerHTML;
        const branchName = getCurrentBranchId();
        
        const printWin = window.open('', '_blank', 'width=450,height=650');
        printWin.document.write(`
            <html>
            <head>
                <title>Payment Breakdown - ${branchName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Battambang', sans-serif; padding: 25px; color: #1e293b; background: #ffffff; margin: 0; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    h2 { text-align: center; color: #06b6d4; font-size: 20px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px solid #06b6d4; padding-bottom: 10px;}
                    p.subtitle { text-align: center; font-size: 12px; color: #64748b; margin-top: 0; margin-bottom: 25px;}
                </style>
            </head>
            <body>
                <h2>របាយការណ៍សង្ខេបចំណូល</h2>
                <p class="subtitle">ថ្ងៃទី៖ ${new Date().toLocaleDateString('km-KH')} | សាខា៖ ${branchName}</p>
                <div>${printContent}</div>
                <div style="text-align:center; font-size:11px; color:#94a3b8; margin-top:40px;">បោះពុម្ពចេញពីប្រព័ន្ធនៅម៉ោង៖ ${new Date().toLocaleTimeString('km-KH')}</div>
            </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); printWin.close(); }, 600);
    };

    // ចុះឈ្មោះចូលក្នុង Toolbox ទាំង POS និង Menu Hub
    const registerToolInterval = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💳', 'សង្ខេបចំណូលប្រចាំថ្ងៃ', window.openPaymentBreakdownModalStandard);
            clearInterval(registerToolInterval);
        } else if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('💳', 'សង្ខេបចំណូលប្រចាំថ្ងៃ', window.openPaymentBreakdownModalStandard);
            clearInterval(registerToolInterval);
        }
    }, 200);
})();