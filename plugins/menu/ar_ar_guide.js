(function() {
    console.log("📱 Menu AR Preview & Simulation Guide Plugin Initialized!");

    function openArPreviewModal() {
        if(document.getElementById('skmArModal')) {
            document.getElementById('skmArModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmArModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">📱</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">មើលមុខម្ហូបបែប AR (Augmented Reality)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">សាកល្បងដាក់បង្ហាញមុខម្ហូបនៅលើតុរបស់អ្នកតាមរយៈកាមេរ៉ា AR៖</p>
                
                <div style="background: rgba(56,189,248,0.08); border: 1px dashed #38bdf8; padding: 20px; border-radius: 16px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 6px;">📷</div>
                    <div style="font-size: 12px; font-weight: bold; color: #38bdf8;">ស្កេនកូដ ឬចុចប៊ូតុងខាងក្រោមដើម្បីបើក AR View</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #38bdf8; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.launchArCameraSimulation()">✨ បើកកាមេរ៉ា AR លើតុ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmArModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.launchArCameraSimulation = function() {
        if (typeof showToast === 'function') showToast('📱 កំពុងបើកប្រព័ន្ធ AR លើតុរបស់អ្នក...');
        document.getElementById('skmArModal').style.display = 'none';
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📱', 'មើលម្ហូបបែប AR (AR View)', openArPreviewModal);
            clearInterval(initInt);
        }
    }, 500);
})();