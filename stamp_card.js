(function() {
    console.log("🎫 Menu Digital Stamp Card Plugin Initialized!");

    function openStampCardModal() {
        if(document.getElementById('skmStampModal')) {
            document.getElementById('skmStampModal').style.display = 'flex';
            updateStampDisplay();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmStampModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">🎫</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">កាតប្រមូលស្ដាំ & រង្វាន់ (Stamp Card)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ប្រមូលស្ដាំគ្រប់ ១០ ដង ថែមជូន ១ កែវ/មុខ Free!</p>
                
                <div id="stampGrid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 15px; background: rgba(245,158,11,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                    <!-- Stamps injected via JS -->
                </div>

                <div style="font-size: 12px; font-weight: bold; color: var(--text-muted); margin-bottom: 15px;">
                    សរុបស្ដាំប្រមូលបាន: <b id="stampCountText" style="color: #f59e0b; font-size: 16px;">0 / 10</b>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #f59e0b; margin-bottom: 10px;" onclick="window.addDemoStamp()">➕ ចុចប្រមូលស្ដាំ ($10 = 1 ស្ដាំ)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmStampModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        updateStampDisplay();
    }

    window.updateStampDisplay = function() {
        const grid = document.getElementById('stampGrid');
        const txt = document.getElementById('stampCountText');
        if(!grid) return;

        let stamps = parseInt(localStorage.getItem('skm_user_stamps') || '0');
        if(txt) txt.innerText = `${stamps} / 10`;

        let html = '';
        for(let i=1; i<=10; i++) {
            let filled = i <= stamps;
            html += `
                <div style="aspect-ratio: 1; background: ${filled ? '#f59e0b' : 'rgba(128,128,128,0.1)'}; border: 1px solid ${filled ? '#f59e0b' : 'var(--border-color)'}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; color: ${filled ? '#fff' : 'var(--text-muted)'};">
                    ${filled ? '⭐' : i}
                </div>
            `;
        }
        grid.innerHTML = html;
    };

    window.addDemoStamp = function() {
        let stamps = parseInt(localStorage.getItem('skm_user_stamps') || '0');
        if(stamps >= 10) {
            alert('អបអរសាទរ! អ្នកបានគ្រប់ ១០ ស្ដាំហើយ សូមបង្ហាញកាតនេះជូនអ្នកលក់ដើម្បីបើករង្វាន់!');
            return;
        }
        stamps++;
        localStorage.setItem('skm_user_stamps', stamps);
        updateStampDisplay();
        if(stamps === 10) {
            if (typeof showToast === 'function') showToast('🎉 អបអរសាទរ! អ្នកទទួលបានរង្វាន់ Free ១ មុខ!');
            else alert('🎉 អបអរសាទរ! អ្នកទទួលបានរង្វាន់ Free ១ មុខ!');
        } else {
            if (typeof showToast === 'function') showToast('បានបន្ថែម ១ ស្ដាំជោគជ័យ!');
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎫', 'កាតប្រមូលស្ដាំ & រង្វាន់ (Stamp Card)', openStampCardModal);
            clearInterval(initInt);
        }
    }, 500);
})();