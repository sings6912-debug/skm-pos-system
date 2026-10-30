(function() {
    console.log("🎫 Menu VIP Subscription Pass Plugin Initialized!");

    function openVipSubModal() {
        if(document.getElementById('skmVipSubModal')) {
            document.getElementById('skmVipSubModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmVipSubModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">🎫</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">កាតសមាជិកប្រចាំខែ (VIP Pass)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ទិញកញ្ចប់សមាជិកប្រចាំខែដើម្បីសន្សំសំចៃកាន់តែច្រើន៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px; text-align: left;">
                    <div style="background: rgba(245,158,11,0.08); border: 1px solid #f59e0b; padding: 12px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <b style="color: #f59e0b; font-size: 13px; display: block;">☕ កញ្ចប់កាហ្វេ ៣០ កែវ/ខែ</b>
                            <span style="font-size: 10px; color: var(--text-muted);">តម្លៃពិសេស: $45.00 (ចំណេញ $30)</span>
                        </div>
                        <button onclick="window.subscribeVipPass('Coffee Pass 30 Days', 45)" style="background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">ទិញ</button>
                    </div>
                    <div style="background: rgba(16,185,129,0.08); border: 1px solid #10b981; padding: 12px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <b style="color: #10b981; font-size: 13px; display: block;">🍜 កញ្ចប់ម្ហូបប្រចាំខែ VIP</b>
                            <span style="font-size: 10px; color: var(--text-muted);">តម្លៃពិសេស: $80.00 (ហ្វ្រីសេវាដឹក)</span>
                        </div>
                        <button onclick="window.subscribeVipPass('Food Pass 30 Days', 80)" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">ទិញ</button>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px;" onclick="document.getElementById('skmVipSubModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.subscribeVipPass = function(passName, price) {
        let cartItem = {
            id: 'SUB-' + Date.now(),
            name: `🎫 [VIP Pass] ${passName}`,
            price: price,
            image: 'https://placehold.co/200/0f172a/f59e0b?text=VIP+Pass',
            cartId: 'sub_' + Date.now(),
            cartVar: 'សមាជិកប្រចាំខែ',
            qty: 1
        };

        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
            cart.push(cartItem);
            if (typeof updateCartBadges === 'function') updateCartBadges();
            if (typeof renderCart === 'function') renderCart();
            if (typeof updateTotal === 'function') updateTotal();
        }

        document.getElementById('skmVipSubModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`បានទិញកញ្ចប់ ${passName} ជោគជ័យ!`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎫', 'កាតសមាជិកប្រចាំខែ (VIP Pass)', openVipSubModal);
            clearInterval(initInt);
        }
    }, 500);
})();