(function() {
    console.log("🛠️ Menu Custom Item Builder Plugin Initialized!");

    function openCustomBuilderModal() {
        if(document.getElementById('skmBuilderModal')) {
            document.getElementById('skmBuilderModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmBuilderModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🛠️</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">ច្នៃប្រឌិតម្ហូប/ភេសជ្ជៈតាមចិត្ត</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើសគ្រឿងផ្សំ និង Toppings តាមចំណូលចិត្តរបស់អ្នក៖</p>
                
                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 6px;">1. រើសមូលដ្ឋាន (Base Item):</div>
                <select id="builderBaseSelect" class="input-st" style="background: var(--store-bg, #0f172a); color: #fff; width: 100%; padding: 10px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 12px; font-family: 'Battambang'; font-size: 12px;" onchange="window.calcBuilderTotal()">
                    <option value="កាហ្វេដូងក្រអូប ($3.50)" data-price="3.50">☕ កាហ្វេដូងក្រអូប - $3.50</option>
                    <option value="តែបៃតងទឹកដោះគោ ($3.00)" data-price="3.00">🍵 តែបៃតងទឹកដោះគោ - $3.00</option>
                    <option value="មីហឹរកូរ៉េពិសេស ($4.50)" data-price="4.50">🍜 មីហឹរកូរ៉េពិសេស - $4.50</option>
                </select>

                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 6px;">2. បន្ថែម Toppings ពិសេស ($0.50 ក្នុងមួយមុខ):</div>
                <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;"><input type="checkbox" class="builder-topping" value="គុជខ្យង (Pearl)" data-price="0.50" onchange="window.calcBuilderTotal()"> 🧋 គុជខ្យង (Pearl) [+$0.50]</label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;"><input type="checkbox" class="builder-topping" value="ផុឌីងសូកូឡា (Pudding)" data-price="0.50" onchange="window.calcBuilderTotal()"> 🍮 ផុឌីងសូកូឡា (Pudding) [+$0.50]</label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;"><input type="checkbox" class="builder-topping" value="ឈីសពីងលើ (Cheese Foam)" data-price="0.50" onchange="window.calcBuilderTotal()"> 🧀 ឈីសពីងលើ (Cheese Foam) [+$0.50]</label>
                </div>

                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 12px; border-radius: 14px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted);">តម្លៃសរុបការច្នៃប្រឌិត:</div>
                    <div id="builderTotalPrice" style="font-size: 22px; font-weight: 900; color: #10b981; margin-top: 4px;">$3.50</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #10b981; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px;" onclick="window.addCustomBuiltItemToCart()">🛒 បន្ថែមចូលកន្ត្រក</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 10px;" onclick="document.getElementById('skmBuilderModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        window.calcBuilderTotal();
    }

    window.calcBuilderTotal = function() {
        const baseSel = document.getElementById('builderBaseSelect');
        if (!baseSel) return;
        const basePrice = parseFloat(baseSel.options[baseSel.selectedIndex].getAttribute('data-price')) || 0;
        
        let toppingTotal = 0;
        document.querySelectorAll('.builder-topping:checked').forEach(chk => {
            toppingTotal += parseFloat(chk.getAttribute('data-price')) || 0;
        });

        let total = basePrice + toppingTotal;
        const totalEl = document.getElementById('builderTotalPrice');
        if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
    };

    window.addCustomBuiltItemToCart = function() {
        const baseSel = document.getElementById('builderBaseSelect');
        const baseName = baseSel.value.split(' (')[0];
        const basePrice = parseFloat(baseSel.options[baseSel.selectedIndex].getAttribute('data-price')) || 0;

        let toppings = [];
        let toppingExtra = 0;
        document.querySelectorAll('.builder-topping:checked').forEach(chk => {
            toppings.push(chk.value);
            toppingExtra += parseFloat(chk.getAttribute('data-price')) || 0;
        });

        let finalPrice = basePrice + toppingExtra;
        let customVariant = toppings.length > 0 ? toppings.join(', ') : 'ស្តង់ដារ';

        let cartItem = {
            id: 'CUSTOM-' + Date.now(),
            name: `✨ [Custom] ${baseName}`,
            price: finalPrice,
            image: 'https://placehold.co/200/0f172a/10b981?text=Custom+Item',
            cartId: 'cust_' + Date.now(),
            cartVar: customVariant,
            qty: 1
        };

        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
            cart.push(cartItem);
            if (typeof updateCartBadges === 'function') updateCartBadges();
            if (typeof renderCart === 'function') renderCart();
            if (typeof updateTotal === 'function') updateTotal();
        }

        document.getElementById('skmBuilderModal').style.display = 'none';
        if (typeof showToast === 'function') showToast('បានបន្ថែមម្ហូបច្នៃប្រឌិតថ្មីចូលកន្ត្រក!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🛠️', 'ច្នៃប្រឌិតម្ហូបតាមចិត្ត (Custom Builder)', openCustomBuilderModal);
            clearInterval(initInt);
        }
    }, 500);
})();