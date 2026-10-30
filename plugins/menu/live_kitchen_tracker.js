(function() {
    console.log("🍜 Menu Live Kitchen Order Tracker Plugin Initialized!");

    function openKitchenTrackerModal() {
        if(document.getElementById('skmKitchenModal')) {
            document.getElementById('skmKitchenModal').style.display = 'flex';
            loadActiveKitchenOrders();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmKitchenModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 440px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 0 50px rgba(245,158,11,0.2);">
                <div style="font-size: 40px; margin-bottom: 5px;">🍜</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">តាមដានស្ថានភាពម្ហូបក្នុងផ្ទះបាយ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ពិនិត្យដំណើរការចម្អិនការកុម្មង់របស់អ្នកតាមពេលវេលាពិត៖</p>
                
                <div id="kitchenOrdersContainer" style="max-height: 280px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 10px; text-align: left;">
                    <!-- Injected via JS -->
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmKitchenModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        loadActiveKitchenOrders();
    }

    function loadActiveKitchenOrders() {
        const container = document.getElementById('kitchenOrdersContainer');
        if (!container) return;

        let orders = JSON.parse(localStorage.getItem('skm_my_orders_history') || '[]');
        if (orders.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:12px;">មិនទាន់មានការកុម្មង់សកម្មក្នុងប្រព័ន្ធទេ</div>';
            return;
        }

        container.innerHTML = orders.slice(0, 3).map((o, idx) => `
            <div style="background: rgba(245,158,11,0.06); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <b style="color: #f59e0b; font-size: 13px;">${o.id}</b>
                    <span style="font-size: 10px; color: var(--text-muted);">${o.date || 'ទើបកុម្មង់'}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 11px;">
                    <span>ដំណាក់កាល: <b style="color: #10b981;">កំពុងចម្អិន (Cooking)</b></span>
                    <span>$${parseFloat(o.totalAmount || 0).toFixed(2)}</span>
                </div>

                <!-- Animated Progress Bar -->
                <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; position: relative;">
                    <div style="width: ${idx === 0 ? '75%' : '40%'}; height: 100%; background: linear-gradient(90deg, #f59e0b, #10b981); border-radius: 3px; animation: progressGlow 2s infinite;"></div>
                </div>
            </div>
        `).join('');
    }

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes progressGlow {
            0% { opacity: 0.6; }
            50% { opacity: 1; filter: drop-shadow(0 0 6px #10b981); }
            100% { opacity: 0.6; }
        }
    `;
    document.head.appendChild(style);

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🍜', 'តាមដានស្ថានភាពម្ហូប (Kitchen Tracker)', openKitchenTrackerModal);
            clearInterval(initInt);
        }
    }, 500);
})();