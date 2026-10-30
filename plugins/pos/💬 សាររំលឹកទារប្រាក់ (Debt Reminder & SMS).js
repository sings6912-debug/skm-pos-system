/* STREAMING_CHUNK:Initializing Unpaid Invoices Reminder Plugin... */
(function() {
    console.log("💬 POS Unpaid Invoices Reminder & SMS Generator Plugin Initialized!");

    /* STREAMING_CHUNK:Building Refined Minimalist UI... */
    function openDebtReminderModal() {
        if(document.getElementById('skmDebtReminderModal')) {
            document.getElementById('skmDebtReminderModal').style.display = 'flex';
            loadUnpaidInvoices();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmDebtReminderModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        /* STREAMING_CHUNK:Injecting Clean CSS and Layout... */
        modal.innerHTML = `
            <style>
                .skm-debt-box { background: var(--bg-card, #ffffff); color: var(--text-main, #1e293b); padding: 25px; border-radius: 20px; width: 100%; max-width: 480px; height: 85vh; max-height: 600px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.2); border: 1px solid var(--border, #e2e8f0); display: flex; flex-direction: column; box-sizing: border-box; overflow: hidden; }
                .skm-debt-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border, #f1f5f9); padding-bottom: 12px; margin-bottom: 12px; flex-shrink: 0; }
                .skm-debt-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 4px; box-sizing: border-box; }
                .skm-debt-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; display: flex; justify-content: space-between; align-items: center; transition: 0.2s; box-sizing: border-box; }
                .skm-debt-card:hover { border-color: #f59e0b; background: #fffbeb; }
                .skm-btn-telegram { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; transition: 0.2s; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25); font-family: inherit; }
                .skm-btn-telegram:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35); }
                .skm-btn-close { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; width: 100%; transition: 0.2s; text-align: center; font-family: inherit; flex-shrink: 0; margin-top: 10px; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
            </style>
            
            <div class="skm-debt-box">
                <div class="skm-debt-header">
                    <h3 style="margin:0; font-size:16px; display: flex; align-items: center; gap: 8px; color: #f59e0b; font-weight: 800;">
                        <span>💬</span> សាររំលឹកវិក្កយបត្ររង់ចាំទូទាត់
                    </h3>
                    <button onclick="document.getElementById('skmDebtReminderModal').style.display='none'" style="background: #fef2f2; border: 1px solid #fca5a5; color: #ef4444; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">✕</button>
                </div>
                
                <div style="font-size: 12px; font-weight: 600; color: var(--text-muted, #64748b); margin-bottom: 8px; flex-shrink: 0;">
                    ជ្រើសរើសវិក្កយបត្រដើម្បីផ្ញើសាររំលឹកតាម Telegram៖
                </div>

                <div class="skm-debt-body" id="skmUnpaidInvoiceList">
                    <!-- Injected via JS -->
                </div>

                <button class="skm-btn-close" onclick="document.getElementById('skmDebtReminderModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        loadUnpaidInvoices();
    }

    /* STREAMING_CHUNK:Loading Unpaid Invoices from POS System... */
    function loadUnpaidInvoices() {
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices_pro`) || '[]');
        const container = document.getElementById('skmUnpaidInvoiceList');
        if(!container) return;

        // ត្រងយកតែវិក្កយបត្រណាដែលមានស្ថានភាព "រង់ចាំទូទាត់" (unpaid / pending)
        let unpaidInvoices = invoices.filter(inv => {
            let status = String(inv.status || '').toLowerCase();
            return status === 'unpaid' || status === 'pending' || status === 'រង់ចាំទូទាត់';
        });

        if (unpaidInvoices.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:40px 20px; color:var(--text-muted, #94a3b8); font-size:13px;">🎉 គ្មានវិក្កយបត្ររង់ចាំទូទាត់ទេ!</div>';
            return;
        }

        container.innerHTML = unpaidInvoices.map(inv => {
            let customerName = inv.customerName || inv.customer || 'អតិថិជនទូទៅ';
            let phone = inv.phone || inv.customerPhone || 'គ្មានលេខទូរស័ព្ទ';
            let amount = parseFloat(inv.totalAmount || inv.total || 0);
            let invNo = inv.id || inv.invoiceNo || 'វិក្កយបត្រ';
            let shopName = window.shopName || 'ហាងរបស់យើងខ្ញុំ';
            
            let smsText = `សួស្តីអតិថិជន ${customerName}, ពីហាង ${shopName}។ សូមរំលឹកការទូទាត់ប្រាក់សម្រាប់វិក្កយបត្រលេខ ${invNo} ចំនួន $${amount.toFixed(2)}។ សូមអរគុណ!`;
            let encodedSms = encodeURIComponent(smsText);

            return `
                <div class="skm-debt-card">
                    <div>
                        <div style="font-weight: 700; color: var(--text-main, #1e293b); font-size: 14px;">👤 ${customerName}</div>
                        <div style="font-size: 11px; color: var(--text-muted, #64748b); margin-top: 2px;">📄 លេខ: ${invNo} | 📞 ${phone}</div>
                    </div>
                    <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
                        <div style="font-size: 14px; font-weight: 800; color: #f59e0b;">$${amount.toFixed(2)}</div>
                        <a href="https://t.me/share/url?url=${encodedSms}" target="_blank" class="skm-btn-telegram">
                            <span>📤</span> ផ្ញើ Telegram
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('💬', 'សាររំលឹកវិក្កយបត្ររង់ចាំទូទាត់', openDebtReminderModal);
            clearInterval(initInt);
        }
    }, 500);
})();