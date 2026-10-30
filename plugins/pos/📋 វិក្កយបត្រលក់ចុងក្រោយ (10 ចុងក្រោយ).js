(function() {
    console.log("📋 POS Premium Ultra-Compact Last Sales Loaded!");

    // មុខងារបញ្ចូលប៊ូតុងទៅក្បែរប្រអប់ Search
    function injectLastSaleBtn() {
        const searchInput = document.getElementById('posSearch');
        if (!searchInput || document.getElementById('skmLastSaleBtn')) return;
        
        const btn = document.createElement('button');
        btn.id = 'skmLastSaleBtn';
        btn.innerHTML = '📋 លក់ចុងក្រោយ';
        btn.style.cssText = `
            background: rgba(14, 165, 233, 0.1); color: #0ea5e9; border: 1px solid rgba(14, 165, 233, 0.3);
            padding: 0 15px; height: 38px; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer;
            margin-left: 10px; transition: all 0.2s; font-family: 'Battambang', sans-serif; white-space: nowrap; flex-shrink: 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        `;
        
        btn.onmouseover = () => { 
            btn.style.background = '#0ea5e9'; btn.style.color = 'white'; 
            btn.style.boxShadow = '0 5px 15px rgba(14, 165, 233, 0.3)'; 
        };
        btn.onmouseout = () => { 
            btn.style.background = 'rgba(14, 165, 233, 0.1)'; btn.style.color = '#0ea5e9'; 
            btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)'; 
        };
        
        btn.onclick = window.openLastSalesModal;
        
        // ដាក់ក្បែរប្រអប់ស្វែងរក
        searchInput.parentNode.insertBefore(btn, searchInput.nextSibling);
    }

    window.skmCloseLastSales = function() {
        const modal = document.getElementById('skmLastSalesModal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-sales-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    };

    window.openLastSalesModal = function() {
        let modal = document.getElementById('skmLastSalesModal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-sales-glass, .skm-sales-glass * { box-sizing: border-box; }
                
                .skm-sales-glass {
                    background: var(--bg-card, #ffffff);
                    color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 480px;
                    max-height: 90vh; display: flex; flex-direction: column;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-sales-glass {
                        background: var(--bg-card, #1e293b);
                        color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-sale-item {
                    background: var(--bg-input, #f8fafc);
                    padding: 12px 15px; border-radius: 12px; margin-bottom: 8px;
                    border: 1px solid var(--border, rgba(128,128,128,0.15));
                    display: flex; justify-content: space-between; align-items: center;
                    transition: all 0.2s;
                }
                @media (prefers-color-scheme: dark) { .skm-sale-item { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                .skm-sale-item:hover { border-color: #0ea5e9; background: rgba(14, 165, 233, 0.05); }
                
                .skm-btn-view {
                    background: rgba(14, 165, 233, 0.1); color: #0ea5e9; border: none;
                    padding: 8px 12px; border-radius: 8px; font-size: 12px; cursor: pointer;
                    font-family: 'Battambang'; font-weight: bold; transition: 0.2s; white-space: nowrap;
                }
                .skm-btn-view:hover { background: #0ea5e9; color: white; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3); }
                .skm-btn-view:active { transform: scale(0.95); }
                
                .skm-badge-paid {
                    background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2);
                    padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: bold;
                }
                .skm-badge-unpaid {
                    background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);
                    padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: bold;
                }
                
                .skm-sales-list { overflow-y: auto; flex: 1; padding-right: 5px; min-height: 200px; }
                .skm-sales-list::-webkit-scrollbar { width: 5px; }
                .skm-sales-list::-webkit-scrollbar-track { background: transparent; }
                .skm-sales-list::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skmLastSalesModal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                backdrop-filter: blur(3px); opacity: 0; transition: opacity 0.3s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-sales-glass">
                    <!-- ក្បាល (Header) -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h3 style="margin:0; font-size:16px; font-weight:600; display:flex; align-items:center; gap:8px;">
                            <span style="color:#0ea5e9; font-size: 18px;">📋</span> វិក្កយបត្រលក់ (10 ចុងក្រោយ)
                        </h3>
                        <div onclick="window.skmCloseLastSales()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:28px; height:28px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                    </div>

                    <!-- បញ្ជីវិក្កយបត្រ -->
                    <div id="skmLastSalesList" class="skm-sales-list"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // ចុចខាងក្រៅ ឬ Esc ដើម្បីបិទ
            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseLastSales(); });
            document.addEventListener('keydown', function(e) { if(e.key === 'Escape' && modal.style.display !== 'none') window.skmCloseLastSales(); });
            
        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-sales-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        setTimeout(() => { modal.style.opacity = '1'; }, 50);
        window.loadLastSalesContent();
    };

    window.loadLastSalesContent = function() {
        let invs = window.invoices || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_invoices_pro`) || '[]');
        const list = document.getElementById('skmLastSalesList');
        
        if(invs.length === 0) { 
            list.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:12px;">មិនទាន់មានទិន្នន័យលក់នៅឡើយទេ!</div>'; 
            return; 
        }
        
        const exchangeRate = window.EXCHANGE_RATE || 4000;

        list.innerHTML = invs.slice(0, 10).map(inv => {
            const amtUsd = parseFloat(inv.totalAmount || 0);
            const amtKhr = amtUsd * exchangeRate;
            
            // ពណ៌ Badge តាមស្ថានភាពបង់ប្រាក់
            const isPaid = (inv.status === 'paid' || !inv.status);
            const statusBadge = isPaid 
                ? '<span class="skm-badge-paid">បង់រួច</span>' 
                : '<span class="skm-badge-unpaid">ជំពាក់</span>';
            
            return `
            <div class="skm-sale-item">
                <div style="flex:1;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                        <b style="color:var(--text-main); font-size:14px; font-family:'Arial';">#${inv.id || inv.invoiceNo}</b>
                        ${statusBadge}
                    </div>
                    <div style="display:flex; align-items:baseline; gap:8px; margin-bottom:4px;">
                        <span style="color:#10b981; font-weight:bold; font-size:16px; font-family:'Arial';">$${amtUsd.toFixed(2)}</span>
                        <span style="color:#0ea5e9; font-size:13px; font-weight:600; font-family:'Arial';">${Math.floor(amtKhr).toLocaleString('en-US')} ៛</span>
                    </div>
                    <div style="font-size:11px; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
                        <span>🕒 ${inv.date}</span>
                        <span style="color:rgba(128,128,128,0.3);">|</span>
                        <span>👤 ${inv.customer || 'អតិថិជនទូទៅ'}</span>
                    </div>
                </div>
                <button class="skm-btn-view" onclick="if(typeof window.viewInvoiceDetails==='function'){window.viewInvoiceDetails('${inv.id||inv.invoiceNo}'); window.skmCloseLastSales();}">
                    👁️ មើល
                </button>
            </div>
            `;
        }).join('');
    };

    // ភ្ជាប់ទៅប្រព័ន្ធ
    const initInt = setInterval(() => {
        if (document.getElementById('posSearch')) {
            injectLastSaleBtn();
            clearInterval(initInt);
            console.log("✅ Premium Ultra-Compact Last Sales Viewer successfully injected!");
        }
    }, 1000);
})();