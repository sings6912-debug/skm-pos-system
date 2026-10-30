(function() {
    console.log("🍱 Menu Daily Combo & Set Deals Plugin Initialized!");

    function openDailyComboModal() {
        if(document.getElementById('skmComboModal')) {
            document.getElementById('skmComboModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmComboModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🍱</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">កញ្ចប់កុម្មង់ពិសេសប្រចាំថ្ងៃ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើសកញ្ចប់ Combo ចំណេញច្រើនជាងមុន៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px; text-align: left;">
                    <div style="background: rgba(245,158,11,0.08); border: 1px dashed #f59e0b; padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <b style="color: #f59e0b; font-size: 13px; display: block;">Combo A (ម្ហូប + ភេសជ្ជៈ)</b>
                            <span style="font-size: 11px; color: var(--text-muted);">តម្លៃពិសេស: $5.00 (បញ្ចុះ 20%)</span>
                        </div>
                        <button onclick="window.applyComboDeal('Combo A - $5.00')" style="background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">រើស</button>
                    </div>
                    <div style="background: rgba(16,185,129,0.08); border: 1px dashed #10b981; padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <b style="color: #10b981; font-size: 13px; display: block;">Combo B (គ្រួសារសប្បាយ)</b>
                            <span style="font-size: 11px; color: var(--text-muted);">តម្លៃពិសេស: $15.00 (ហ្វ្រីសេវាដឹក)</span>
                        </div>
                        <button onclick="window.applyComboDeal('Combo B - $15.00')" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">រើស</button>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b;" onclick="document.getElementById('skmComboModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.applyComboDeal = function(comboName) {
        const noteInput = document.getElementById('cNote');
        if (!noteInput) {
            if (typeof showToast === 'function') showToast('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!', true);
            else alert('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!');
            document.getElementById('skmComboModal').style.display = 'none';
            return;
        }
        let currentVal = noteInput.value.trim();
        noteInput.value = currentVal ? `${currentVal}, [កញ្ចប់: ${comboName}]` : `[កញ្ចប់: ${comboName}]`;
        document.getElementById('skmComboModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`បានជ្រើសរើស: ${comboName}!`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🍱', 'កញ្ចប់ពិសេសប្រចាំថ្ងៃ (Daily Combo)', openDailyComboModal);
            clearInterval(initInt);
        }
    }, 500);
})();