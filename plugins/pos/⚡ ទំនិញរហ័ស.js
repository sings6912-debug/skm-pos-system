(function() {
    console.log("⚡ POS Ultra-Compact Premium Quick Custom Item Initialized!");

    // មុខងារបិទផ្ទាំងចាស់ៗទាំងអស់ស្វ័យប្រវត្តិ (ជំនួយបន្ថែមបើមិនទាន់មានក្នុងប្រព័ន្ធ)
    if(typeof window.skmCloseAllModals !== 'function') {
        window.skmCloseAllModals = function() {
            const modals = ['skm-cash-inout-modal', 'skm-quick-exp-modal', 'skmDrawerCashModal', 'skmDailyModal', 'skmLastSalesModal', 'skmHoldModal', 'skmCustomItemModal'];
            modals.forEach(id => {
                let m = document.getElementById(id);
                if(m && m.style.display !== 'none') {
                    m.style.opacity = '0';
                    setTimeout(() => { m.style.display = 'none'; }, 200);
                }
            });
        };
    }

    function injectCustomItemBtn() {
        const searchInput = document.getElementById('posSearch');
        if (!searchInput || document.getElementById('skmQuickCustomBtn')) return;

        const btn = document.createElement('button');
        btn.id = 'skmQuickCustomBtn';
        btn.innerHTML = '⚡ ទំនិញរហ័ស';
        btn.style.cssText = `
            background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);
            padding: 0 15px; height: 38px; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer;
            margin-left: 10px; transition: all 0.2s; font-family: 'Battambang', sans-serif; white-space: nowrap; flex-shrink: 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        `;
        
        btn.onmouseover = () => { 
            btn.style.background = '#10b981'; btn.style.color = 'white'; 
            btn.style.boxShadow = '0 5px 15px rgba(16, 185, 129, 0.3)'; 
        };
        btn.onmouseout = () => { 
            btn.style.background = 'rgba(16, 185, 129, 0.1)'; btn.style.color = '#10b981'; 
            btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)'; 
        };
        
        btn.onclick = window.openCustomItemModal;
        
        // ដាក់ក្បែរប្រអប់ស្វែងរក និងបន្ទាប់ពីប៊ូតុង "លក់ចុងក្រោយ" បើមាន
        searchInput.parentNode.insertBefore(btn, searchInput.nextSibling);
    }

    window.skmCloseCustomItem = function() {
        const modal = document.getElementById('skmCustomItemModal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-cus-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 250);
        }
    };

    window.openCustomItemModal = function() {
        if(typeof window.skmCloseAllModals === 'function') window.skmCloseAllModals();

        let modal = document.getElementById('skmCustomItemModal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-cus-glass, .skm-cus-glass * { box-sizing: border-box; }
                
                .skm-cus-glass {
                    background: var(--bg-card, rgba(255, 255, 255, 0.98)); color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 400px;
                    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-cus-glass {
                        background: var(--bg-card, rgba(15, 23, 42, 0.98)); color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-cus-input, .skm-cus-select {
                    height: 42px; font-size: 14px; font-weight: 500;
                    border-radius: 10px; border: 1px solid var(--border, rgba(128,128,128,0.25));
                    background: var(--bg-input, #f8fafc); color: var(--text-main, inherit); 
                    padding: 0 12px; outline: none; transition: 0.2s; 
                    font-family: 'Battambang', 'Arial', sans-serif; width: 100%;
                }
                @media (prefers-color-scheme: dark) { .skm-cus-input, .skm-cus-select { background: var(--bg-input, rgba(0,0,0,0.3)); } }
                .skm-cus-input:focus, .skm-cus-select:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); }
                
                .skm-cus-btn {
                    height: 44px; border-radius: 10px; border: none; width: 100%; margin-top: 15px;
                    background: linear-gradient(135deg, #10b981, #059669); color: white;
                    font-size: 14px; font-weight: bold; cursor: pointer; transition: 0.2s;
                    font-family: 'Battambang'; box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3);
                }
                .skm-cus-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4); filter: brightness(1.1); }
                .skm-cus-btn:active { transform: translateY(0) scale(0.98); }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skmCustomItemModal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                opacity: 0; transition: opacity 0.2s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-cus-glass">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h3 style="margin:0; font-size:16px; font-weight:600; display:flex; align-items:center; gap:6px;">
                            <span style="color:#10b981; font-size: 18px;">⚡</span> ទំនិញរហ័ស (Custom Item)
                        </h3>
                        <div onclick="window.skmCloseCustomItem()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:28px; height:28px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="font-size:12px; color:var(--text-muted); margin-bottom:4px; display:block; font-family:'Battambang';">ឈ្មោះទំនិញ / សេវាកម្ម</label>
                        <input type="text" id="skmCusItemName" class="skm-cus-input" placeholder="ឧ. សេវាកម្មផ្សេងៗ...">
                    </div>
                    
                    <div style="display: flex; gap: 8px; align-items: flex-end;">
                        <div style="flex: 0 0 80px;">
                            <label style="font-size:12px; color:var(--text-muted); margin-bottom:4px; display:block; font-family:'Battambang';">ចំនួន</label>
                            <input type="number" id="skmCusItemQty" class="skm-cus-input" placeholder="1" value="1" min="1" style="text-align:center; font-family:'Arial';">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-size:12px; color:var(--text-muted); margin-bottom:4px; display:block; font-family:'Battambang';">តម្លៃលក់</label>
                            <input type="number" id="skmCusItemPrice" class="skm-cus-input" placeholder="0.00" style="font-family:'Arial';">
                        </div>
                        <div style="flex: 0 0 75px;">
                            <select id="skmCusItemCurrency" class="skm-cus-select" style="font-family:'Arial'; font-weight:bold; padding: 0 5px; text-align:center;">
                                <option value="USD">USD</option>
                                <option value="KHR">KHR</option>
                            </select>
                        </div>
                    </div>
                    
                    <button class="skm-cus-btn" onclick="window.addCustomItemToCart()">បញ្ជូលក្នុងកន្ត្រក (Add)</button>
                </div>
            `;
            document.body.appendChild(modal);

            // ចុចខាងក្រៅ ឬ Esc ដើម្បីបិទ
            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseCustomItem(); });
            document.addEventListener('keydown', function(e) { 
                if(modal.style.display === 'none') return;
                if(e.key === 'Escape') window.skmCloseCustomItem(); 
                if(e.key === 'Enter') window.addCustomItemToCart(); // ចុច Enter ដើម្បីបញ្ចូលរហ័ស
            });

            // Auto select
            document.getElementById('skmCusItemQty').addEventListener('focus', function() { this.select(); });
            document.getElementById('skmCusItemPrice').addEventListener('focus', function() { this.select(); });

        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-cus-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            
            // ជម្រះទិន្នន័យចាស់ចោល
            document.getElementById('skmCusItemName').value = '';
            document.getElementById('skmCusItemQty').value = '1';
            document.getElementById('skmCusItemPrice').value = '';
        }

        setTimeout(() => { 
            modal.style.opacity = '1'; 
            document.getElementById('skmCusItemName').focus(); 
        }, 50);
    };

    window.addCustomItemToCart = function() {
        const nameInput = document.getElementById('skmCusItemName').value.trim();
        const qtyInput = parseFloat(document.getElementById('skmCusItemQty').value);
        const priceInput = parseFloat(document.getElementById('skmCusItemPrice').value);
        const currency = document.getElementById('skmCusItemCurrency').value;
        const exchangeRate = window.EXCHANGE_RATE || 4000; // ស្តង់ដារប្តូរប្រាក់

        const name = nameInput || "ទំនិញ/សេវាកម្មផ្សេងៗ";
        const qty = (isNaN(qtyInput) || qtyInput <= 0) ? 1 : qtyInput;

        if (isNaN(priceInput) || priceInput <= 0) {
            const pEl = document.getElementById('skmCusItemPrice');
            pEl.style.borderColor = '#ef4444';
            setTimeout(() => pEl.style.borderColor = '', 1000);
            return;
        }

        // បម្លែងលុយទៅជា USD ជាប្រព័ន្ធខាងក្រោយ
        let finalUsdPrice = priceInput;
        if (currency === 'KHR') {
            finalUsdPrice = priceInput / exchangeRate;
        }

        if (!window.cart) window.cart = [];
        
        const customItem = {
            id: 'CUSTOM_' + Date.now(),
            name: name,
            price: finalUsdPrice,
            riel: finalUsdPrice * exchangeRate,
            unit: 'ឯកតា',
            qty: 999999, // អត់ខ្វល់ស្តុក
            image: '', // អត់មានរូបភាព
            cartQty: qty
        };

        window.cart.push(customItem);
        
        if(typeof window.renderCart === 'function') window.renderCart();
        if(typeof window.renderPOSProducts === 'function') window.renderPOSProducts();
        
        window.skmCloseCustomItem();
        
        if(typeof window.showToast === 'function') {
            window.showToast(`បានបញ្ចូល "${name}" ចូលកន្ត្រក!`);
        } else {
            const btn = document.querySelector('#skmQuickCustomBtn');
            if(btn) {
                const oldTxt = btn.innerHTML;
                btn.innerHTML = '✅ បានបញ្ចូល!';
                btn.style.background = '#10b981'; btn.style.color = '#fff';
                setTimeout(() => { btn.innerHTML = oldTxt; btn.style.background = ''; btn.style.color = ''; }, 1500);
            }
        }
    };

    const initInt = setInterval(() => {
        if (document.getElementById('posSearch')) {
            injectCustomItemBtn();
            clearInterval(initInt);
            console.log("✅ Ultra-Compact Quick Custom Item successfully injected!");
        }
    }, 1000);
})();