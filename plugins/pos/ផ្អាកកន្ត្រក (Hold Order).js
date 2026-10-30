(function() {
    console.log("📌 POS Ultra-Compact Premium Hold Orders Initialized!");

    // ១. បញ្ចូលប៊ូតុង Hold/View ក្នុងកន្ត្រក ជារាងជួរដេក (Compact Inline)
    function injectHoldBtn() {
        const cartSummary = document.getElementById('cartSummaryBody');
        if (!cartSummary || document.getElementById('skm-hold-action-group')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            .skm-hold-action-group {
                display: flex; gap: 8px; margin-top: 10px; width: 100%;
            }
            .skm-btn-hold-action {
                flex: 1; padding: 10px; border-radius: 12px; font-size: 12px; font-weight: bold;
                cursor: pointer; transition: all 0.2s; font-family: 'Battambang'; text-align: center;
                display: flex; justify-content: center; align-items: center; gap: 5px; height: 42px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid transparent;
            }
            .skm-btn-hold-action:active { transform: scale(0.95); }
            
            .skm-btn-hold { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border-color: rgba(139, 92, 246, 0.3); }
            .skm-btn-hold:hover { background: #8b5cf6; color: white; box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3); }
            
            .skm-btn-view-hold { background: rgba(6, 182, 212, 0.1); color: #06b6d4; border-color: rgba(6, 182, 212, 0.3); }
            .skm-btn-view-hold:hover { background: #06b6d4; color: white; box-shadow: 0 5px 15px rgba(6, 182, 212, 0.3); }
        `;
        document.head.appendChild(style);

        const actionGroup = document.createElement('div');
        actionGroup.id = 'skm-hold-action-group';
        actionGroup.className = 'skm-hold-action-group';
        
        actionGroup.innerHTML = `
            <button class="skm-btn-hold-action skm-btn-hold" onclick="window.holdCurrentCart()">
                📥 ផ្អាកកន្ត្រក
            </button>
            <button class="skm-btn-hold-action skm-btn-view-hold" onclick="window.openHeldOrdersModal()">
                📂 ទាញកន្ត្រក
            </button>
        `;

        // ដាក់ខាងលើប៊ូតុងទូទាត់ ឬ ក្រុម Quick Actions បើមាន
        const targetDiv = cartSummary.querySelector('#skm-quick-actions-panel') || cartSummary.querySelector('div[style*="display: flex; gap: 10px;"]');
        if (targetDiv) cartSummary.insertBefore(actionGroup, targetDiv);
        else cartSummary.appendChild(actionGroup);
    }

    // ២. មុខងារផ្អាកកន្ត្រក
    window.holdCurrentCart = function() {
        if (!window.cart || window.cart.length === 0) {
            if(typeof window.showToast === 'function') window.showToast('កន្ត្រកទទេ គ្មានអីត្រូវផ្អាកទេ!', true);
            else alert('កន្ត្រកទទេ គ្មានអីត្រូវផ្អាកទេ!');
            return;
        }
        let heldOrders = JSON.parse(localStorage.getItem('skm_held_orders') || '[]');
        const customerName = document.getElementById('posCustomerName') ? document.getElementById('posCustomerName').value : 'អតិថិជនទូទៅ';
        
        heldOrders.unshift({
            id: 'HOLD-' + Date.now().toString().slice(-4),
            time: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}),
            date: new Date().toLocaleDateString(),
            customer: customerName || 'អតិថិជនទូទៅ',
            items: [...window.cart],
            total: window.cartFinalUsd || 0
        });

        localStorage.setItem('skm_held_orders', JSON.stringify(heldOrders));
        window.cart = [];
        if(typeof window.renderCart === 'function') window.renderCart();
        if(typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
        
        if(typeof window.showToast === 'function') window.showToast('បានផ្អាកកន្ត្រកជោគជ័យ!');
        else alert('បានផ្អាកកន្ត្រកជោគជ័យ!');
    };

    window.skmCloseHeldOrders = function() {
        const modal = document.getElementById('skmHoldModal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-hold-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 250);
        }
    };

    // ៣. បង្កើត Premium Ultra-Compact Modal
    window.openHeldOrdersModal = function() {
        // បិទ Modal ផ្សេងៗសិន បើមានមុខងារនេះ
        if(typeof window.skmCloseAllModals === 'function') window.skmCloseAllModals();

        let modal = document.getElementById('skmHoldModal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-hold-glass, .skm-hold-glass * { box-sizing: border-box; }
                
                .skm-hold-glass {
                    background: var(--bg-card, rgba(255, 255, 255, 0.98));
                    color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 450px;
                    max-height: 90vh; display: flex; flex-direction: column;
                    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-hold-glass {
                        background: var(--bg-card, rgba(15, 23, 42, 0.98));
                        color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-hold-item {
                    background: var(--bg-input, #f8fafc);
                    padding: 12px 15px; border-radius: 12px; margin-bottom: 8px;
                    border: 1px solid var(--border, rgba(128,128,128,0.15));
                    display: flex; justify-content: space-between; align-items: center;
                    transition: all 0.2s;
                }
                @media (prefers-color-scheme: dark) { .skm-hold-item { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                .skm-hold-item:hover { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.05); }
                
                .skm-hold-btn-restore {
                    background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; border: none;
                    padding: 8px 12px; border-radius: 8px; font-size: 12px; cursor: pointer;
                    font-family: 'Battambang'; font-weight: bold; transition: 0.2s;
                    box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3); white-space: nowrap;
                }
                .skm-hold-btn-restore:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(14, 165, 233, 0.4); }
                .skm-hold-btn-restore:active { transform: translateY(0); }
                
                .skm-hold-btn-del {
                    background: rgba(239,68,68,0.1); color: #ef4444; border: none;
                    padding: 8px; border-radius: 8px; font-size: 14px; cursor: pointer;
                    transition: 0.2s; display: flex; align-items: center; justify-content: center;
                }
                .skm-hold-btn-del:hover { background: #ef4444; color: white; }
                
                .skm-hold-list { overflow-y: auto; flex: 1; padding-right: 5px; min-height: 200px; }
                .skm-hold-list::-webkit-scrollbar { width: 4px; }
                .skm-hold-list::-webkit-scrollbar-track { background: transparent; }
                .skm-hold-list::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skmHoldModal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                opacity: 0; transition: opacity 0.2s ease; backdrop-filter: blur(3px);
            `;
            
            modal.innerHTML = `
                <div class="skm-hold-glass">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h3 style="margin:0; font-size:16px; font-weight:600; display:flex; align-items:center; gap:8px;">
                            <span style="color:#8b5cf6; font-size: 18px;">📥</span> កន្ត្រកដែលបានផ្អាក (Held Orders)
                        </h3>
                        <div onclick="window.skmCloseHeldOrders()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:28px; height:28px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                    </div>

                    <div id="skmHeldListContent" class="skm-hold-list"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // ចុចខាងក្រៅ ឬ Esc ដើម្បីបិទ
            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseHeldOrders(); });
            document.addEventListener('keydown', function(e) { if(e.key === 'Escape' && modal.style.display !== 'none') window.skmCloseHeldOrders(); });
            
        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-hold-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        setTimeout(() => { modal.style.opacity = '1'; }, 50);
        window.loadHeldOrdersList();
    };

    window.loadHeldOrdersList = function() {
        const content = document.getElementById('skmHeldListContent');
        if(!content) return;
        let heldOrders = JSON.parse(localStorage.getItem('skm_held_orders') || '[]');
        
        if (heldOrders.length === 0) {
            content.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:12px;">មិនមានកន្ត្រកដែលបានផ្អាកទេ!</div>';
        } else {
            const exchangeRate = window.EXCHANGE_RATE || 4000;
            content.innerHTML = heldOrders.map((h, idx) => {
                const amtUsd = parseFloat(h.total || 0);
                const amtKhr = amtUsd * exchangeRate;
                
                return `
                <div class="skm-hold-item">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                            <span style="font-weight:bold; font-size:14px; color:var(--text-main);">👤 ${h.customer}</span>
                            <span style="font-size:10px; background:rgba(139, 92, 246, 0.1); color:#8b5cf6; padding:2px 6px; border-radius:4px; font-weight:bold; font-family:'Arial';">#${h.id}</span>
                        </div>
                        <div style="display:flex; align-items:baseline; gap:8px; margin-bottom:4px;">
                            <span style="color:#10b981; font-weight:bold; font-size:15px; font-family:'Arial';">$${amtUsd.toFixed(2)}</span>
                            <span style="color:#0ea5e9; font-size:12px; font-weight:600; font-family:'Arial';">${Math.floor(amtKhr).toLocaleString('en-US')} ៛</span>
                            <span style="color:var(--text-muted); font-size:11px; margin-left:5px;">(🛍️ ${h.items.length} មុខ)</span>
                        </div>
                        <div style="font-size:10px; color:var(--text-muted); display:flex; gap:6px;">
                            <span>⏱️ ${h.time}</span> <span style="opacity:0.5;">|</span> <span>📅 ${h.date || ''}</span>
                        </div>
                    </div>
                    <div style="display:flex; gap:6px;">
                        <button class="skm-hold-btn-restore" onclick="window.restoreHeldOrder(${idx})">ទាញយក</button>
                        <button class="skm-hold-btn-del" onclick="window.deleteHeldOrder(${idx})">🗑️</button>
                    </div>
                </div>
                `;
            }).join('');
        }
    };

    window.restoreHeldOrder = function(idx) {
        let heldOrders = JSON.parse(localStorage.getItem('skm_held_orders') || '[]');
        if (heldOrders[idx]) {
            window.cart = heldOrders[idx].items;
            if (document.getElementById('posCustomerName')) {
                document.getElementById('posCustomerName').value = heldOrders[idx].customer;
            }
            heldOrders.splice(idx, 1);
            localStorage.setItem('skm_held_orders', JSON.stringify(heldOrders));
            
            if(typeof window.renderCart === 'function') window.renderCart();
            if(typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
            
            window.skmCloseHeldOrders();
            if(typeof window.showToast === 'function') window.showToast('ទាញយកកន្ត្រកជោគជ័យ!');
        }
    };

    window.deleteHeldOrder = function(idx) {
        if(confirm('តើអ្នកពិតជាចង់លុបកន្ត្រកផ្អាកនេះចោលមែនទេ?')) {
            let heldOrders = JSON.parse(localStorage.getItem('skm_held_orders') || '[]');
            heldOrders.splice(idx, 1);
            localStorage.setItem('skm_held_orders', JSON.stringify(heldOrders));
            window.loadHeldOrdersList();
        }
    };

    const initInt = setInterval(() => {
        if (document.getElementById('cartSummaryBody')) {
            injectHoldBtn();
            clearInterval(initInt);
            console.log("✅ Premium Hold Orders fully injected!");
        }
    }, 1000);
})();