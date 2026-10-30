(function() {
    console.log("👑 Menu VIP Membership Signup Plugin Initialized!");

    function openMembershipModal() {
        if(document.getElementById('skmVipCardModal')) {
            document.getElementById('skmVipCardModal').style.display = 'flex';
            checkExistingMember();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmVipCardModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">👑</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">ក្លឹបសមាជិក VIP (VIP Club)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ចុះឈ្មោះជាសមាជិកដើម្បីទទួលបានសិទ្ធិពិសេស និងប្រមូលពិន្ទុ៖</p>
                
                <div id="vipFormBox">
                    <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">ឈ្មោះរបស់អ្នក:</div>
                    <input type="text" id="vipRegName" placeholder="ឈ្មោះពេញ..." style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 12px; outline: none; margin-bottom: 10px; font-family:'Battambang';">

                    <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">លេខទូរស័ព្ទ:</div>
                    <input type="text" id="vipRegPhone" placeholder="012 345 678" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 12px; outline: none; margin-bottom: 15px; font-family:'Battambang';">

                    <button class="btn-act btn-green" style="width: 100%; background: #f59e0b; margin-bottom: 10px;" onclick="window.registerVipMember()">⭐ ចុះឈ្មោះជាសមាជិក VIP</button>
                </div>

                <div id="vipCardDisplayBox" style="display: none; background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; padding: 20px; border-radius: 14px; margin-bottom: 15px; text-align: left; box-shadow: 0 10px 20px rgba(245,158,11,0.3);">
                    <div style="font-size:11px; opacity:0.8;">SKM VIP MEMBER CARD</div>
                    <div id="cardHolderName" style="font-size:16px; font-weight:900; margin: 8px 0;">---</div>
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px;">
                        <span id="cardHolderPhone">---</span>
                        <span style="background:rgba(255,255,255,0.2); padding:2px 8px; border-radius:6px; font-weight:bold;">GOLD</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmVipCardModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        checkExistingMember();
    }

    function checkExistingMember() {
        let member = JSON.parse(localStorage.getItem('skm_vip_member_data') || 'null');
        const formBox = document.getElementById('vipFormBox');
        const cardBox = document.getElementById('vipCardDisplayBox');

        if (member && formBox && cardBox) {
            formBox.style.display = 'none';
            cardBox.style.display = 'block';
            document.getElementById('cardHolderName').innerText = member.name;
            document.getElementById('cardHolderPhone').innerText = member.phone;
        }
    }

    window.registerVipMember = function() {
        const name = document.getElementById('vipRegName').value.trim();
        const phone = document.getElementById('vipRegPhone').value.trim();

        if(!name || !phone) { alert('សូមបំពេញឈ្មោះ និងលេខទូរស័ព្ទឱ្យបានត្រឹមត្រូវ!'); return; }

        let member = { name, phone, date: new Date().toLocaleDateString('km-KH') };
        localStorage.setItem('skm_vip_member_data', JSON.stringify(member));

        checkExistingMember();
        if (typeof showToast === 'function') showToast('🎉 អបអរសាទរ! អ្នកបានចុះឈ្មោះជាសមាជិក VIP ជោគជ័យ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('👑', 'ចុះឈ្មោះសមាជិក VIP (VIP Club)', openMembershipModal);
            clearInterval(initInt);
        }
    }, 500);
})();