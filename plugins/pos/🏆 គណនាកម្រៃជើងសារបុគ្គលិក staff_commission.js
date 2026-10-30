/* STREAMING_CHUNK:Initializing Staff Commission Plugin with Print Fix... */
(function() {
    console.log("🏆 POS Staff Commission & Performance Plugin Initialized!");

    function openCommissionModal() {
        if(document.getElementById('skmCommissionModal')) {
            document.getElementById('skmCommissionModal').style.display = 'flex';
            calcCommissionData();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmCommissionModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;`;
        
        modal.innerHTML = `
            <div style="background: var(--bg-card, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 16px; width: 480px; max-height: 85vh; display:flex; flex-direction:column; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px;">
                    <h3 style="color:#f59e0b; margin:0; font-size:18px; font-weight:900;">🏆 គណនាកម្រៃជើងសារបុគ្គលិក (Commission)</h3>
                    <button onclick="document.getElementById('skmCommissionModal').style.display='none'" style="background:#ef4444; border:none; color:#fff; width:28px; height:28px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
                </div>
                
                <div style="display:flex; gap:10px; margin-bottom:15px; align-items:center; background: rgba(245, 158, 11, 0.1); padding: 10px; border-radius: 10px; border: 1px dashed #f59e0b;">
                    <label style="font-size:13px; font-weight:bold; color: #f59e0b; white-space:nowrap;">ភាគរយភាគលាភ (%):</label>
                    <input type="number" id="skmCommRate" class="form-control" value="2" style="width:80px; text-align:center; font-weight:bold; font-size:14px; border:1px solid #f59e0b;" oninput="window.calcCommissionData()">
                    <span style="font-size:12px; color:var(--text-muted);">(ឧ. ២% នៃការលក់សរុប)</span>
                </div>

                <div id="skmCommissionContent" style="flex:1; overflow-y:auto; max-height:45vh; padding-right:5px; margin-bottom:15px; display:flex; flex-direction:column; gap:8px;">
                    <!-- Injected via JS -->
                </div>

                <div style="display:flex; gap:10px; border-top: 1px solid var(--border); padding-top: 15px;">
                    <button class="btn btn-outline" style="flex:1; border-color:var(--border); color:var(--text-main); font-weight:bold;" onclick="document.getElementById('skmCommissionModal').style.display='none'">បិទ</button>
                    <button class="btn btn-primary" style="flex:1; background:#f59e0b; border:none; font-weight:bold; color:#fff; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);" onclick="window.printCommissionSummary()">🖨️ បោះពុម្ព (Print)</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        calcCommissionData();
    }

    /* STREAMING_CHUNK:Calculating and rendering commission data... */
    window.calcCommissionData = function() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices_pro`) || '[]');
        let rateInput = document.getElementById('skmCommRate');
        let commRate = rateInput ? parseFloat(rateInput.value) || 0 : 2;
        let today = new Date().toLocaleDateString();

        let staffSales = {};
        let totalCommissionAll = 0;

        invoices.forEach(inv => {
            let invDate = inv.date ? inv.date.split(' ')[0] : '';
            if (inv.status === 'paid' && invDate === today) {
                let seller = inv.seller || inv.cashier || 'បុគ្គលិកទូទៅ';
                let amount = parseFloat(inv.totalAmount || 0);
                if (!staffSales[seller]) staffSales[seller] = 0;
                staffSales[seller] += amount;
            }
        });

        const container = document.getElementById('skmCommissionContent');
        if(!container) return;

        let keys = Object.keys(staffSales);
        if (keys.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted); font-size:14px; font-weight:bold;">គ្មានទិន្នន័យការលក់ថ្ងៃនេះទេ</div>';
            return;
        }

        let htmlContent = keys.map(seller => {
            let sales = staffSales[seller];
            let commission = sales * (commRate / 100);
            totalCommissionAll += commission;
            
            return `
                <div style="background:rgba(245, 158, 11, 0.05); padding:12px 15px; border-radius:10px; border:1px solid rgba(245, 158, 11, 0.2); display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:900; color:var(--text-main); font-size:15px; margin-bottom:4px;">👤 ${seller}</div>
                        <div style="font-size:12px; color:var(--text-muted);">យតលក់សរុបថ្ងៃនេះ: <b style="color:#10b981;">$${sales.toFixed(2)}</b></div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:18px; font-weight:900; color:#f59e0b;">$${commission.toFixed(2)}</div>
                        <div style="font-size:10px; color:var(--text-muted);">កម្រៃជើងសារ (${commRate}%)</div>
                    </div>
                </div>
            `;
        }).join('');
        
        // បន្ថែមប្រអប់សរុបរួមនៅខាងក្រោម
        htmlContent += `
            <div style="background:rgba(245, 158, 11, 0.1); border:2px dashed #f59e0b; padding:15px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                <div style="font-size:14px; font-weight:bold; color:#f59e0b;">ប្រាក់រង្វាន់សរុបត្រូវបើក:</div>
                <b style="color:#f59e0b; font-size:20px; font-weight:900;">$${totalCommissionAll.toFixed(2)}</b>
            </div>
        `;
        
        container.innerHTML = htmlContent;
    };

    /* STREAMING_CHUNK:Implementing print logic with CSS injection for backgrounds... */
    window.printCommissionSummary = function() {
        const printContent = document.getElementById('skmCommissionContent').innerHTML;
        const branchName = window.SHOP_BRANCH_ID || 'សាខាទី ១';
        const rateInput = document.getElementById('skmCommRate');
        const commRate = rateInput ? rateInput.value : 2;
        
        const printWindow = window.open('', '_blank', 'width=600,height=800');
        
        // សរសេរកូដ HTML ចូលទៅក្នុងផ្ទាំងថ្មី ព្រមទាំងបង្ខំឱ្យ Printer គូរ Background (print-color-adjust)
        printWindow.document.write(`
            <html>
            <head>
                <title>របាយការណ៍កម្រៃជើងសារ - ${branchName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Battambang', sans-serif;
                        padding: 30px;
                        color: #1e293b;
                        background: #ffffff;
                    }
                    /* បង្ខំ Printer ឱ្យព្រីនចេញពណ៌ Background ទាំងអស់ */
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .no-print { display: none !important; }
                    }
                    h2 { text-align: center; color: #f59e0b; font-size: 22px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;}
                    p.subtitle { text-align: center; font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 30px;}
                    
                    /* លុបធាតុ UI ងងឹត (Dark Mode) ទៅជាពណ៌ភ្លឺ (Light Mode) សម្រាប់ព្រីនលើក្រដាសស */
                    [style*="rgba(245, 158, 11, 0.05)"] { background: #fffbeb !important; border-color: #fde68a !important; }
                    [style*="rgba(245, 158, 11, 0.1)"] { background: #fef3c7 !important; }
                    [style*="color:var(--text-main)"] { color: #1e293b !important; }
                    [style*="color:var(--text-muted)"] { color: #64748b !important; }
                </style>
            </head>
            <body>
                <h2>🏆 របាយការណ៍កម្រៃជើងសារបុគ្គលិក</h2>
                <p class="subtitle">ប្រចាំថ្ងៃទី៖ ${new Date().toLocaleDateString('km-KH')} | សាខា៖ ${branchName} | អត្រា៖ ${commRate}%</p>
                
                <div class="print-container">
                    ${printContent}
                </div>
                
                <div style="text-align:center; font-size:10px; color:gray; margin-top:30px;">បោះពុម្ពនៅម៉ោង៖ ${new Date().toLocaleString('km-KH')}</div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // ទុកពេលឱ្យ Font ដើរ និងរូបភាព Render សិន ទើបហៅ Print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 800);
    };

    /* STREAMING_CHUNK:Registering plugin to the system... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🏆', 'កម្រៃជើងសារបុគ្គលិក (Commission)', openCommissionModal);
            clearInterval(initInt);
        }
    }, 500);
})();