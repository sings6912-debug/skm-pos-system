(function() {
    console.log("🎲 Menu Surprise Me & Random Picker Plugin Initialized!");

    function openRandomPickerModal() {
        if(document.getElementById('skmRandomModal')) {
            document.getElementById('skmRandomModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmRandomModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🎲</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">ចៃដន្យរើសទំនិញ / ម្ហូប (Surprise Me)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 20px;">មិនដឹងញ៉ាំអ្វី ឬទិញអ្វីមែនទេ? ให้យើងជួយរើសជូន!</p>
                
                <div id="randomPickCardBox" style="background: rgba(245,158,11,0.08); border: 1px solid var(--border-color); padding: 15px; border-radius: 14px; margin-bottom: 20px; text-align: center;">
                    <img id="randPickImg" src="https://placehold.co/80" style="width: 80px; height: 80px; object-fit: contain; border-radius: 10px; background: #fff; margin-bottom: 8px;">
                    <div id="randPickName" style="font-size: 14px; font-weight: 900; color: var(--text-dark); margin-bottom: 4px;">ចុចប៊ូតុងខាងក្រោមដើម្បីចាប់ផ្តើម</div>
                    <div id="randPickPrice" style="font-size: 14px; font-weight: 900; color: #10b981;">---</div>
                </div>

                <button id="spinRandBtn" class="btn-act btn-green" style="width: 100%; background: #f59e0b; margin-bottom: 10px;" onclick="window.executeRandomPick()">✨ រើសមុខទំនិញចៃដន្យ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmRandomModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.executeRandomPick = function() {
        if (typeof window.inventory === 'undefined' || !Array.isArray(window.inventory) || window.inventory.length === 0) {
            if (typeof showToast === 'function') showToast('មិនទាន់មានទំនិញក្នុងស្តុកទេ!', true);
            return;
        }

        const btn = document.getElementById('spinRandBtn');
        const nameEl = document.getElementById('randPickName');
        const priceEl = document.getElementById('randPickPrice');
        const imgEl = document.getElementById('randPickImg');

        btn.disabled = true;
        btn.innerText = '🎲 កំពុងចៃដន្យរើស...';

        let count = 0;
        const interval = setInterval(() => {
            const randItem = window.inventory[Math.floor(Math.random() * window.inventory.length)];
            nameEl.innerText = randItem.name;
            priceEl.innerText = `$${parseFloat(randItem.price || 0).toFixed(2)}`;
            imgEl.src = randItem.image || 'https://placehold.co/80';
            count++;

            if (count > 12) {
                clearInterval(interval);
                btn.disabled = false;
                btn.innerText = '✨ រើសមុខទំនិញចៃដន្យទៀត';
                
                // Save picked item reference for quick viewing
                window.lastRandomPickedProduct = randItem.name;
                if (typeof showToast === 'function') showToast(`🎉 រើសបាន: ${randItem.name}!`);
            }
        }, 100);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎲', 'ចៃដន្យរើសទំនិញ (Surprise Me)', openRandomPickerModal);
            clearInterval(initInt);
        }
    }, 500);
})();