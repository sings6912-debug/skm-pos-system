(function() {
    console.log("⚡ Menu Happy Hour & Flash Deals Plugin Initialized!");

    function openHappyHourModal() {
        if(document.getElementById('skmHappyModal')) {
            document.getElementById('skmHappyModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmHappyModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">⚡</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">ម៉ោងមាសបញ្ចុះតម្លៃ (Happy Hour)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ប្រូម៉ូសិនពិសេសប្រចាំថ្ងៃ កំពុងទទួលបានការបញ្ចុះតម្លៃ៖</p>
                
                <div style="background: rgba(245,158,11,0.08); border: 1px dashed #f59e0b; padding: 15px; border-radius: 14px; margin-bottom: 15px; text-align: left;">
                    <div style="font-size: 13px; font-weight: bold; color: #f59e0b; margin-bottom: 4px;">⏰ រយៈពេលម៉ោងមាស:</div>
                    <div style="font-size: 12px; color: var(--text-dark); margin-bottom: 8px;">រៀងរាល់ម៉ោង <b>02:00 ថ្ងៃត្រង់ - 05:00 ល្ងាច</b></div>
                    <div style="font-size: 11px; color: #10b981; font-weight: bold;">🔥 បញ្ចុះតម្លៃពិសេស ២០% លើគ្រប់ភេសជ្ជៈ និងមុខម្ហូបសម្រុះ!</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #f59e0b; margin-bottom: 10px;" onclick="document.getElementById('skmHappyModal').style.display='none'">✨ ទាញយកប្រយោជន៍ពីម៉ោងមាស</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmHappyModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('⚡', 'ម៉ោងមាសបញ្ចុះតម្លៃ (Happy Hour)', openHappyHourModal);
            clearInterval(initInt);
        }
    }, 500);
})();