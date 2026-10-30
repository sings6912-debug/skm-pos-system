(function() {
    console.log("📑 POS Z-Report & Shift Handover Plugin Initialized!");

    // មុខងារទាញយកឈ្មោះអ្នកប្រើប្រាស់
    function getCurrentUser() {
        let username = '';
        const keys = ['pos_current_user', 'username', 'user_role', 'role', 'user_name'];
        for (let key of keys) {
            let val = localStorage.getItem(key);
            if (val) { username = val; break; }
        }
        if (!username) {
            const elements = document.querySelectorAll('*');
            for (let el of elements) {
                if (el.innerText && (el.innerText.includes('👤') || el.innerHTML.includes('fa-user'))) {
                    let text = el.innerText.replace('👤', '').trim();
                    if (text.length > 0 && text.length < 25) { username = text; break; }
                }
            }
        }
        if (!username) {
            const pageText = document.body.innerText;
            if (pageText.includes('អ្នកគ្រប់គ្រងប្រព័ន្ធ')) username = 'អ្នកគ្រប់គ្រងប្រព័ន្ធ';
            else if (pageText.includes('👑 Admin') || pageText.includes('Admin')) username = 'admin';
        }
        return username || 'មិនស្គាល់ឈ្មោះ';
    }

    let currentZReportData = {};

    function openZReportModal() {
        let modal = document.getElementById('skmZReportModal');
        
        if (modal) {
            modal.style.display = 'flex';
            calcZReportData();
            return;
        }

        modal = document.createElement('div');
        modal.id = 'skmZReportModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.6); z-index: 100000; display: flex; 
            justify-content: center; align-items: center; 
            backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;
        `;
        
        // 💡 កំណត់សម្គាល់៖ បានលុប onclick="..." ចេញទាំងអស់ ដើម្បីការពារការ Block ពីប្រព័ន្ធសុវត្ថិភាព
        modal.innerHTML = `
            <div id="skmZReportContentBox" style="background: #ffffff; color: #333333; padding: 25px; border-radius: 16px; width: 480px; max-height: 90vh; display:flex; flex-direction:column; border: 1px solid #e2e8f0; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
                    <h3 style="color:#10b981; margin:0; font-size:16px; display: flex; align-items: center; gap: 8px;">
                        📑 របាយការណ៍បិទវេនលក់ (Z-Report)
                    </h3>
                    <button id="skmBtnCloseModal" style="background:#ef4444; border:none; color:#fff; width:26px; height:26px; border-radius:50%; cursor:pointer; font-weight:bold; display: flex; justify-content: center; align-items: center; font-size: 12px;">✕</button>
                </div>
                
                <div id="skmZReportContent" style="flex:1; overflow-y:auto; max-height:60vh; padding-right:5px; display:flex; flex-direction:column; gap:10px; font-size:14px;">
                    <!-- ទិន្នន័យនឹងលោតចូលទីនេះ -->
                </div>

                <div style="margin-top: 15px; display:flex; gap:10px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                    <button id="skmBtnCloseReport" style="flex:1; padding: 10px; border-radius: 8px; cursor: pointer; background: white; border: 1px solid #cbd5e1; color: #475569; font-family: 'Battambang'; font-size: 14px; font-weight: bold;">បិទ</button>
                    <button id="skmBtnPrintReport" style="flex:1; padding: 10px; border-radius: 8px; cursor: pointer; background: #10b981; border: none; color: white; font-family: 'Battambang'; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">🖨️ បោះពុម្ព (Print)</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 💡 ចាប់យកការចុចប៊ូតុងតាមរយៈ Event Listener វិញ (វិធីនេះមិនត្រូវគេ Block ទេ)
        document.getElementById('skmBtnCloseModal').addEventListener('click', () => modal.style.display = 'none');
        document.getElementById('skmBtnCloseReport').addEventListener('click', () => modal.style.display = 'none');
        
        document.getElementById('skmBtnPrintReport').addEventListener('click', function() {
            executePrintZReport(); // ហៅមុខងារ Print នៅពេលចុច
        });

        // មុខងារចុចខាងក្រៅដើម្បីបិទ
        modal.addEventListener('mousedown', function(event) {
            const content = document.getElementById('skmZReportContentBox');
            if (event.target === modal && !content.contains(event.target)) {
                modal.style.display = 'none';
            }
        });

        calcZReportData();
    }

    function calcZReportData() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices_pro`) || '[]');
        let cashLogs = JSON.parse(localStorage.getItem(`ks2_${branchId}_cash_inout`) || '[]');
        let savedFloat = JSON.parse(localStorage.getItem(`ks2_${branchId}_opening_cash`) || '{}');
        
        let today = new Date().toLocaleDateString();
        let cashSales = 0, totalSalesCount = 0;

        invoices.forEach(inv => {
            let invDate = inv.date ? inv.date.split(' ')[0] : '';
            if (inv.status === 'paid' && invDate === today) {
                totalSalesCount++;
                cashSales += parseFloat(inv.totalAmount || 0);
            }
        });

        let totalCashIn = 0, totalCashOut = 0;
        cashLogs.forEach(l => {
            let logDate = l.date ? l.date.split(' ')[0] : '';
            if (logDate === today) {
                if (l.type === 'in') totalCashIn += parseFloat(l.amount || 0);
                if (l.type === 'out') totalCashOut += parseFloat(l.amount || 0);
            }
        });

        let openingCash = (savedFloat.date === today && savedFloat.amount !== undefined) ? parseFloat(savedFloat.amount) : 0;
        let expectedCashInDrawer = openingCash + cashSales + totalCashIn - totalCashOut;
        let currentUser = getCurrentUser();
        let currentTime = new Date().toLocaleString('km-KH');

        currentZReportData = {
            date: currentTime,
            user: currentUser,
            count: totalSalesCount,
            opening: openingCash,
            sales: cashSales,
            cashIn: totalCashIn,
            cashOut: totalCashOut,
            expected: expectedCashInDrawer
        };

        const content = document.getElementById('skmZReportContent');
        if(!content) return;

        content.innerHTML = `
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">កាលបរិច្ឆេទ / ម៉ោង៖</span><b style="color:#334155;">${currentTime}</b>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">បុគ្គលិកបិទវេន៖</span><b style="color:#334155;">${currentUser}</b>
            </div>
            <hr style="border: 0; border-top: 1px dashed #cbd5e1; margin: 5px 0;">
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">វិក្កយបត្រថ្ងៃនេះ៖</span><b style="color:#334155;">${totalSalesCount} វិក្កយបត្រ</b>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">ប្រាក់ដើមក្នុងទូរ (Opening):</span><b style="color:#f59e0b;">$${openingCash.toFixed(2)}</b>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">ចំណូលលក់សុទ្ធ (Sales):</span><b style="color:#10b981;">+$${cashSales.toFixed(2)}</b>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">ប្រាក់ដាក់បន្ថែម (Cash In):</span><b style="color:#0ea5e9;">+$${totalCashIn.toFixed(2)}</b>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; border:1px solid #e2e8f0;">
                <span style="color:#64748b;">ប្រាក់ដកចេញ (Cash Out):</span><b style="color:#ef4444;">-$${totalCashOut.toFixed(2)}</b>
            </div>
            
            <div style="background:rgba(16,185,129,0.1); border:2px solid #10b981; padding:15px; border-radius:10px; display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
                <span style="color:#047857; font-weight:bold; font-size:15px;">💵 ប្រាក់សរុបក្នុងទូរ (Expected):</span>
                <span style="font-size:22px; font-weight:900; color:#047857;">$${expectedCashInDrawer.toFixed(2)}</span>
            </div>
        `;
    }

    // 💡 មុខងារ Print ប្រើ Iframe ដែលមាន Opacity 0 (មានន័យថាវាលោតចេញមកមែន តែគ្រាន់តែយើងមើលមិនឃើញ)
    function executePrintZReport() {
        const d = currentZReportData;
        
        // លុប Iframe ចាស់ចោលសិន (បើមាន) ដើម្បីកុំឱ្យជាន់គ្នា
        let oldIframe = document.getElementById('skmZReportPrintFrame');
        if (oldIframe) { oldIframe.remove(); }

        // បង្កើត Iframe ថ្មី
        let iframe = document.createElement('iframe');
        iframe.id = 'skmZReportPrintFrame';
        
        // លាក់ដោយប្រើ opacity: 0 (មិនប្រើ display:none ទើប Browser ព្រមព្រីនឱ្យ)
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '350px';
        iframe.style.height = '500px';
        iframe.style.opacity = '0';
        iframe.style.pointerEvents = 'none'; // កុំឱ្យប៉ះពាល់ការចុចរបស់ User
        
        document.body.appendChild(iframe);

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Z-Report - ${d.date}</title>
                <style>
                    body { font-family: 'Battambang', Arial, sans-serif; padding: 10px; color: #000; font-size: 14px; margin: 0; }
                    .header { text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 5px; }
                    .sub-header { text-align: center; font-size: 12px; margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
                    .divider { border-bottom: 1px dashed #000; margin: 10px 0; }
                    .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 10px 0; margin-top: 10px; }
                    .footer { text-align: center; font-size: 12px; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="header">របាយការណ៍បិទវេន (Z-Report)</div>
                <div class="sub-header">
                    កាលបរិច្ឆេទ: ${d.date}<br>
                    អ្នកបោះពុម្ព: ${d.user}
                </div>
                
                <div class="row"><span>ចំនួនវិក្កយបត្រ:</span> <span>${d.count}</span></div>
                <div class="divider"></div>
                
                <div class="row"><span>ប្រាក់ដើម (Opening):</span> <span>$${d.opening.toFixed(2)}</span></div>
                <div class="row"><span>ចំណូលលក់ (Sales):</span> <span>+$${d.sales.toFixed(2)}</span></div>
                <div class="row"><span>ដាក់បន្ថែម (Cash In):</span> <span>+$${d.cashIn.toFixed(2)}</span></div>
                <div class="row"><span>ដកចេញ (Cash Out):</span> <span>-$${d.cashOut.toFixed(2)}</span></div>
                
                <div class="total-row">
                    <span>ប្រាក់ក្នុងទូរ:</span>
                    <span>$${d.expected.toFixed(2)}</span>
                </div>
                
                <div class="footer">
                    ហត្ថលេខាអ្នកគ្រប់គ្រង<br><br><br>
                    ....................................
                </div>
            </body>
            </html>
        `;
        
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(htmlContent);
        doc.close();

        // ទុកពេលឱ្យ Browser render ទិន្នន័យ 0.5 វិនាទី ទើបបញ្ជា Print
        setTimeout(() => {
            try {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
            } catch (e) {
                console.error("Print Error:", e);
                window.print(); // ជម្រើសចុងក្រោយ បើ Iframe នៅតែ Error
            }
        }, 500);
    }

    let attempts = 0;
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📑', 'របាយការណ៍បិទវេន (Z-Report)', openZReportModal);
            clearInterval(initInt);
            console.log("✅ Z-Report successfully registered!");
        }
        attempts++;
        if (attempts > 20) {
            clearInterval(initInt);
            console.warn("⚠️ Z-Report failed to register: Smart Toolbox not found.");
        }
    }, 500);
})();