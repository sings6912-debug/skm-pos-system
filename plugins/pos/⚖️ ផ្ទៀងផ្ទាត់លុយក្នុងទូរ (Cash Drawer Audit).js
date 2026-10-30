/* STREAMING_CHUNK:Initializing Modern Cash Drawer Audit Plugin... */
(function() {
    console.log("⚖️ POS Modern Cash Drawer Variance Audit Plugin Initialized!");

    /* STREAMING_CHUNK:Building Refined Minimalist UI... */
    function openDrawerAuditModal() {
        if(document.getElementById('skmDrawerAuditModal')) {
            document.getElementById('skmDrawerAuditModal').style.display = 'flex';
            calcAuditData();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmDrawerAuditModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        /* STREAMING_CHUNK:Injecting Clean CSS and Layout... */
        modal.innerHTML = `
            <style>
                .skm-aud-input::-webkit-inner-spin-button, 
                .skm-aud-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                .skm-aud-input { -moz-appearance: textfield; }

                .skm-aud-box { background: var(--bg-card, #ffffff); color: var(--text-main, #1e293b); padding: 25px; border-radius: 20px; width: 100%; max-width: 440px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.2); border: 1px solid var(--border, #e2e8f0); display: flex; flex-direction: column; gap: 14px; box-sizing: border-box; }
                .skm-aud-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border, #f1f5f9); padding-bottom: 12px; margin-bottom: 2px; }
                .skm-aud-input { font-size: 16px; padding: 10px 14px; border-radius: 10px; border: 1.5px solid #cbd5e1; width: 100%; transition: all 0.2s ease; background: var(--store-bg, #f8fafc); outline: none; color: var(--text-main, #1e293b); font-family: 'Nunito', 'Battambang', sans-serif; box-sizing: border-box; font-weight: bold; }
                .skm-aud-input:focus { border-color: #f59e0b; background: #ffffff; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1); }
                .skm-aud-row { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 10px 14px; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; }
                .skm-aud-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; text-align: center; transition: 0.3s; }
                .skm-btn-print { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; flex: 1; transition: 0.2s; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25); font-family: inherit; }
                .skm-btn-print:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(245, 158, 11, 0.35); }
                .skm-btn-close { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; flex: 1; transition: 0.2s; text-align: center; font-family: inherit; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
            </style>
            
            <div class="skm-aud-box">
                <div class="skm-aud-header">
                    <h3 style="margin:0; font-size:16px; display: flex; align-items: center; gap: 8px; color: #f59e0b; font-weight: 800;">
                        <span>⚖️</span> ពិនិត្យប្រាក់លើស/ខ្វះក្នុងទូរ
                    </h3>
                    <button onclick="document.getElementById('skmDrawerAuditModal').style.display='none'" style="background: #fef2f2; border: 1px solid #fca5a5; color: #ef4444; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">✕</button>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div class="skm-aud-row">
                        <span style="color: var(--text-muted, #64748b);">ប្រាក់ដើមបើកវេន (Opening Float):</span>
                        <b id="auditOpening" style="color: var(--text-main, #1e293b);">$0.00</b>
                    </div>
                    <div class="skm-aud-row">
                        <span style="color: var(--text-muted, #64748b);">ប្រាក់ចំណូលលក់សុទ្ធ (Cash Sales):</span>
                        <b id="auditSales" style="color: #10b981;">$0.00</b>
                    </div>
                    <div class="skm-aud-row" style="background: rgba(14, 165, 233, 0.05); border-color: #bae6fd;">
                        <span style="color: #0369a1;">ទឹកប្រាក់រំពឹងទុក (Expected Cash):</span>
                        <b id="auditExpected" style="color: #0284c7; font-size: 15px;">$0.00</b>
                    </div>
                </div>

                <div>
                    <label style="font-size: 12px; font-weight: 700; color: var(--text-muted, #64748b); display: block; margin-bottom: 4px;">ចំនួនប្រាក់រាប់ជាក់ស្តែងក្នុងទូរ ($) *</label>
                    <input type="number" id="auditActualInp" class="skm-aud-input" placeholder="0.00" oninput="window.calcAuditVariance()" step="any" style="color: #0ea5e9;">
                </div>

                <div id="auditResultBox" class="skm-aud-card">
                    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">លទ្ធផលគណនា (Variance)</div>
                    <div id="auditVarianceVal" style="font-size: 16px; font-weight: 800; color: var(--text-main, #1e293b); margin-top: 2px;">សូមបញ្ចូលប្រាក់រាប់ជាក់ស្តែង</div>
                </div>

                <div style="display:flex; gap:10px; margin-top: 4px;">
                    <button class="skm-btn-close" onclick="document.getElementById('skmDrawerAuditModal').style.display='none'">បិទ</button>
                    <button class="skm-btn-print" onclick="window.printDrawerAuditReport()">🖨️ បោះពុម្ព</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        calcAuditData();
    }

    /* STREAMING_CHUNK:Calculating Audit Data... */
    window.calcAuditData = function() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        const today = new Date().toLocaleDateString();
        
        let openingObj = JSON.parse(localStorage.getItem(`ks2_${branchId}_opening_cash`) || '{}');
        let openingAmt = (openingObj.date === today && openingObj.amount) ? parseFloat(openingObj.amount) : 50.00;
        
        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices_pro`) || '[]');
        let cashSales = 0;
        invoices.forEach(inv => {
            let invDate = inv.date ? inv.date.split(' ')[0] : '';
            if (inv.status === 'paid' && invDate === today) {
                cashSales += parseFloat(inv.totalAmount || 0);
            }
        });

        let cashLogs = JSON.parse(localStorage.getItem(`ks2_${branchId}_cash_inout`) || '[]');
        let totalIn = 0, totalOut = 0;
        cashLogs.forEach(l => {
            if (l.type === 'in') totalIn += parseFloat(l.amount || 0);
            if (l.type === 'out') totalOut += parseFloat(l.amount || 0);
        });

        let expected = openingAmt + cashSales + totalIn - totalOut;

        document.getElementById('auditOpening').innerText = `$${openingAmt.toFixed(2)}`;
        document.getElementById('auditSales').innerText = `$${cashSales.toFixed(2)}`;
        document.getElementById('auditExpected').innerText = `$${expected.toFixed(2)}`;
        
        window.skmExpectedCash = expected;
        window.skmOpeningAmt = openingAmt;
        window.skmCashSales = cashSales;
        window.calcAuditVariance();
    };

    /* STREAMING_CHUNK:Calculating Variance... */
    window.calcAuditVariance = function() {
        const actualInput = document.getElementById('auditActualInp');
        if(!actualInput) return;
        const actual = parseFloat(actualInput.value);
        const expected = window.skmExpectedCash || 0;
        const resBox = document.getElementById('auditResultBox');
        const varVal = document.getElementById('auditVarianceVal');

        if(isNaN(actual)) {
            resBox.style.background = '#f8fafc';
            resBox.style.borderColor = '#e2e8f0';
            varVal.style.color = '#1e293b';
            varVal.innerText = 'សូមបញ្ចូលប្រាក់រាប់ជាក់ស្តែង';
            window.skmAuditStatus = 'ยังไม่ได้ระบุ';
            return;
        }

        let diff = actual - expected;
        if (Math.abs(diff) < 0.01) {
            resBox.style.background = 'rgba(16, 185, 129, 0.08)';
            resBox.style.borderColor = '#10b981';
            varVal.style.color = '#10b981';
            varVal.innerText = '✅ ត្រូវគ្នាត្រឹមត្រូវល្អ (Exact Match)!';
            window.skmAuditStatus = 'ត្រូវគ្នាត្រឹមត្រូវល្អ (Exact Match)';
        } else if (diff > 0) {
            resBox.style.background = 'rgba(14, 165, 233, 0.08)';
            resBox.style.borderColor = '#0ea5e9';
            varVal.style.color = '#0ea5e9';
            varVal.innerText = `📈 ប្រាក់លើស (Over): +$${diff.toFixed(2)}`;
            window.skmAuditStatus = `ប្រាក់លើស (Over): +$${diff.toFixed(2)}`;
        } else {
            resBox.style.background = 'rgba(239, 68, 68, 0.08)';
            resBox.style.borderColor = '#ef4444';
            varVal.style.color = '#ef4444';
            varVal.innerText = `📉 ប្រាក់ខ្វះ (Short): -$${Math.abs(diff).toFixed(2)}`;
            window.skmAuditStatus = `ប្រាក់ខ្វះ (Short): -$${Math.abs(diff).toFixed(2)}`;
        }
    };

    /* STREAMING_CHUNK:Implementing Isolated Report Printing... */
    window.printDrawerAuditReport = function() {
        const opening = document.getElementById('auditOpening').innerText;
        const sales = document.getElementById('auditSales').innerText;
        const expected = document.getElementById('auditExpected').innerText;
        const actualInput = document.getElementById('auditActualInp').value;
        const actual = actualInput ? `$${parseFloat(actualInput).toFixed(2)}` : '$0.00';
        const variance = document.getElementById('auditVarianceVal').innerText;
        const shopName = window.shopName || 'ហាងរបស់យើងខ្ញុំ';
        const timeStr = new Date().toLocaleString('km-KH');

        const printWin = window.open('', '', 'width=450,height=600');
        printWin.document.write(`
            <html>
                <head>
                    <title>Cash Drawer Audit Report</title>
                    <style>
                        body { font-family: 'Battambang', sans-serif; padding: 20px; color: #1e293b; margin: 0; }
                        .report-container { max-width: 350px; margin: 0 auto; border: 1px solid #cbd5e1; padding: 20px; border-radius: 12px; }
                        .title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 5px; color: #0f172a; }
                        .subtitle { text-align: center; font-size: 13px; color: #64748b; margin-bottom: 15px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 10px; }
                        .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
                        .row.total { font-weight: bold; border-top: 1px solid #cbd5e1; padding-top: 8px; margin-top: 8px; font-size: 14px; }
                        .status-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px; text-align: center; margin-top: 15px; font-weight: bold; font-size: 14px; }
                        .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 20px; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
                    </style>
                </head>
                <body>
                    <div class="report-container">
                        <div class="title">${shopName}</div>
                        <div class="subtitle">របាយការណ៍ពិនិត្យប្រាក់ក្នុងទូរ (Drawer Audit)</div>
                        
                        <div class="row"><span>កាលបរិច្ឆេទ:</span> <b>${timeStr}</b></div>
                        
                        <div style="margin: 12px 0; border-top: 1px solid #e2e8f0; padding-top: 8px;">
                            <div class="row"><span>ប្រាក់ដើមបើកវេន:</span> <b>${opening}</b></div>
                            <div class="row"><span>ប្រាក់លក់សុទ្ធ:</span> <b>${sales}</b></div>
                            <div class="row total"><span>ប្រាក់រំពឹងទុក:</span> <b>${expected}</b></div>
                        </div>

                        <div class="row" style="margin-top: 10px;"><span>ប្រាក់រាប់ជាក់ស្តែង:</span> <b>${actual}</b></div>

                        <div class="status-box">
                            ${variance}
                        </div>

                        <div class="footer">
                            អរគុណសម្រាប់ការប្រើប្រាស់ប្រព័ន្ធ POS!
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => {
            printWin.print();
            printWin.close();
        }, 600);
    };

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('⚖️', 'ពិនិត្យប្រាក់លើស/ខ្វះ (Drawer Audit)', openDrawerAuditModal);
            clearInterval(initInt);
        }
    }, 500);
})();