(function() {
    console.log("🧾 Menu Customer Order History Plugin Initialized!");

    function openOrderHistoryModal() {
        if(document.getElementById('skmHistoryModal')) {
            document.getElementById('skmHistoryModal').style.display = 'flex';
            loadCustomerOrders();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmHistoryModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">🧾</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ប្រវត្តិការកុម្មង់របស់ខ្ញុំ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">វិក្កយបត្រដែលបានកុម្មង់ពីឧបករណ៍នេះ៖</p>
                
                <div id="skmCustomerOrdersList" style="max-height: 220px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px; text-align: left;">
                    <!-- Injected via JS -->
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmHistoryModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        loadCustomerOrders();
    }

    function loadCustomerOrders() {
        const list = document.getElementById('skmCustomerOrdersList');
        if (!list) return;

        let orders = JSON.parse(localStorage.getItem('skm_my_orders_history') || '[]');

        if (orders.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">មិនទាន់មានប្រវត្តិការកុម្មង់ទេ</div>';
            return;
        }

        list.innerHTML = orders.map(o => `
            <div style="background: rgba(128,128,128,0.08); padding: 10px; border-radius: 10px; border: 1px solid var(--border-color); font-size: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <b style="color: #38bdf8;">${o.id}</b>
                    <span style="color: #10b981; font-weight: 900;">$${parseFloat(o.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div style="color: var(--text-muted); font-size: 11px; margin-bottom: 4px;">⏱️ ${o.date}</div>
                <div style="color: var(--text-dark); font-size: 11px;">🛍️ ${o.itemsCount} មុខទំនិញ | ស្ថានភាព: <b style="color: #f59e0b;">${o.status || 'កំពុងរៀបចំ'}</b></div>
            </div>
        `).join('');
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🧾', 'ប្រវត្តិការកុម្មង់របស់ខ្ញុំ', openOrderHistoryModal);
            clearInterval(initInt);
        }
    }, 500);
})();