/* STREAMING_CHUNK:Initializing Expense Summary Plugin with Print Fix... */
(function() {
    console.log("📈 POS Expense Summary Plugin Initialized!");

    function openExpenseSummaryModal() {
        if(document.getElementById('skmExpSummaryModal')) {
            document.getElementById('skmExpSummaryModal').style.display = 'flex';
            calcExpenseData();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmExpSummaryModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;`;
        
        modal.innerHTML = `
            <div id="skmExpSummaryPrintArea" style="background: var(--bg-card, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 16px; width: 450px; max-height: 85vh; display:flex; flex-direction:column; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px;">
                    <h3 style="color:#ef4444; margin:0; font-size:18px; font-weight:900;">📈 សង្ខេបការចំណាយប្រចាំថ្ងៃ</h3>
                    <button id="skmExpCloseBtn" onclick="document.getElementById('skmExpSummaryModal').style.display='none'" style="background:#ef4444; border:none; color:#fff; width:28px; height:28px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
                </div>
                
                <div style="font-size:13px; color:var(--text-muted); margin-bottom:15px; font-weight:bold;">ការបែងចែកប្រាក់ចំណាយថ្ងៃនេះតាមប្រភេទ៖</div>
                
                <div id="skmExpSummaryContent" style="flex:1; overflow-y:auto; max-height:45vh; padding-right:5px; margin-bottom:15px; display:flex; flex-direction:column; gap:10px;">
                    <!-- Injected via JS -->
                </div>

                <div id="skmExpActionBtns" style="display:flex; gap:10px; border-top: 1px solid var(--border); padding-top: 15px;">
                    <button class="btn btn-outline" style="flex:1; border-color:var(--border); color:var(--text-main); font-weight:bold;" onclick="document.getElementById('skmExpSummaryModal').style.display='none'">បិទត្រឡប់ក្រោយ</button>
                    <button class="btn btn-primary" style="flex:1; background:#ef4444; border:none; font-weight:bold; color:#fff; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);" onclick="window.printExpenseSummary()">🖨️ បោះពុម្ព (Print)</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        calcExpenseData();
    }

    /* STREAMING_CHUNK:Calculating and rendering expense data... */
    function calcExpenseData() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let expenses = window.expenses || JSON.parse(localStorage.getItem(`ks2_${branchId}_expenses_pro`) || '[]');
        let today = new Date().toLocaleDateString();

        let categoryTotals = {};
        let totalExp = 0;

        expenses.forEach(exp => {
            let expDate = exp.date ? exp.date.split(' ')[0] : '';
            if (expDate === today) {
                let cat = exp.category || 'ចំណាយផ្សេងៗ';
                let amt = parseFloat(exp.amount || 0);
                totalExp += amt;
                if (!categoryTotals[cat]) categoryTotals[cat] = 0;
                categoryTotals[cat] += amt;
            }
        });

        const container = document.getElementById('skmExpSummaryContent');
        if(!container) return;

        let keys = Object.keys(categoryTotals);
        if (keys.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted); font-size:14px; font-weight:bold;">គ្មានទិន្នន័យចំណាយថ្ងៃនេះទេ</div>';
            return;
        }

        container.innerHTML = keys.map(cat => `
            <div style="background:rgba(255, 255, 255, 0.05); padding:15px; border-radius:12px; border:1px solid rgba(255, 255, 255, 0.1); display:flex; justify-content:space-between; align-items:center;">
                <div style="font-weight:bold; color:var(--text-main, #333); font-size:14px; display:flex; align-items:center; gap:8px;">
                    <span style="background:rgba(239, 68, 68, 0.1); color:#ef4444; padding:4px 8px; border-radius:6px; font-size:12px;">🏷️</span> ${cat}
                </div>
                <div style="font-size:18px; font-weight:900; color:#ef4444;">$${categoryTotals[cat].toFixed(2)}</div>
            </div>
        `).join('') + `
            <div style="background:rgba(239,68,68,0.1); border:2px dashed #ef4444; padding:15px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                <div style="font-size:14px; font-weight:bold; color:#ef4444;">សរុបរួមប្រចាំថ្ងៃ (Total):</div>
                <b style="color:#ef4444; font-size:24px; font-weight:900;">$${totalExp.toFixed(2)}</b>
            </div>
            <div style="text-align:center; font-size:10px; color:gray; margin-top:15px;">កាលបរិច្ឆេទរបាយការណ៍៖ ${new Date().toLocaleString('km-KH')}</div>
        `;
    }

    /* STREAMING_CHUNK:Implementing print logic with CSS injection for backgrounds... */
    window.printExpenseSummary = function() {
        // ចម្លងតែផ្នែកសំខាន់ចេញមកក្រៅ ដើម្បីកុំឱ្យជាប់ Background ខ្មៅពេញេអេក្រង់
        const printContent = document.getElementById('skmExpSummaryContent').innerHTML;
        const branchName = window.SHOP_BRANCH_ID || 'សាខាទី ១';
        
        const printWindow = window.open('', '_blank', 'width=600,height=800');
        
        // សរសេរកូដ HTML ចូលទៅក្នុងផ្ទាំងថ្មី ព្រមទាំងបង្ខំឱ្យ Printer គូរ Background (print-color-adjust)
        printWindow.document.write(`
            <html>
            <head>
                <title>របាយការណ៍ចំណាយប្រចាំថ្ងៃ - ${branchName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Battambang', sans-serif;
                        padding: 30px;
                        color: #1e293b;
                        background: #ffffff;
                    }
                    /* បង្ខំ Printer ឱ្យព្រីនចេញពណ៌ Background និងស្រមោលទាំងអស់ */
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .no-print { display: none !important; }
                    }
                    h2 { text-align: center; color: #ef4444; font-size: 22px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px solid #ef4444; padding-bottom: 10px;}
                    p.subtitle { text-align: center; font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 30px;}
                    
                    /* តម្រឹមពណ៌ក្នុងពេលព្រីនឡើងវិញឱ្យភ្លឺច្បាស់លើក្រដាសស */
                    .print-card {
                        background: #f8fafc !important;
                        padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;
                        display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
                    }
                    .print-label { font-weight: bold; font-size: 14px; display: flex; align-items: center; gap: 8px; }
                    .print-badge { background: #fee2e2 !important; color: #ef4444; padding: 4px 8px; border-radius: 6px; font-size: 12px; }
                    .print-val { font-size: 18px; font-weight: 900; color: #ef4444; }
                    
                    .print-total-box {
                        background: #fee2e2 !important; border: 2px dashed #ef4444 !important;
                        padding: 20px; border-radius: 12px; display: flex; justify-content: space-between;
                        align-items: center; margin-top: 20px;
                    }
                    .print-total-label { font-size: 16px; font-weight: bold; color: #ef4444; }
                    .print-total-val { color: #ef4444; font-size: 26px; font-weight: 900; }
                    
                    /* លុបធាតុ UI ដែលចម្លងមកពី Dark Mode */
                    [style*="rgba(255, 255, 255, 0.05)"] { background: #f8fafc !important; border-color: #e2e8f0 !important; }
                    [style*="rgba(239,68,68,0.1)"] { background: #fee2e2 !important; }
                    [style*="color:var(--text-main, #333)"] { color: #1e293b !important; }
                </style>
            </head>
            <body>
                <h2>📈 របាយការណ៍សង្ខេបការចំណាយ (Expense Report)</h2>
                <p class="subtitle">ប្រចាំថ្ងៃទី៖ ${new Date().toLocaleDateString('km-KH')} | សាខា៖ ${branchName}</p>
                
                <div class="print-container">
                    ${printContent}
                </div>
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
            window.registerCustomTool('📈', 'សង្ខេបការចំណាយតាមប្រភេទ', openExpenseSummaryModal);
            clearInterval(initInt);
        }
    }, 500);
})();