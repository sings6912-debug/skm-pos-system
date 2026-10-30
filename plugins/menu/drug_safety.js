(function() {
    console.log("🩺 Menu Drug Safety & Storage Plugin Initialized!");

    function openDrugSafetyModal() {
        if(document.getElementById('skmSafetyModal')) {
            document.getElementById('skmSafetyModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmSafetyModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(239,68,68,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🩺</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #ef4444;">សុវត្ថិភាពថ្នាំ & ការរក្សាទុក</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ការណែនាំអំពីការរក្សាទុកឱសថឱ្យបានត្រឹមត្រូវ និងមានសុវត្ថិភាព៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(239,68,68,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #ef4444; display: block; margin-bottom: 2px;">🌡️ សីតុណ្ហភាពរក្សាទុក (Storage)</b>
                        <span style="color: var(--text-muted);">រក្សាទុកនៅកន្លែងស្ងួត និងមានសីតុណ្ហភាពក្រោម ៣០អង្សាសេ ផុតពីពន្លឺព្រះអាទិត្យផ្ទាល់។</span>
                    </div>
                    <div style="background: rgba(245,158,11,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #f59e0b; display: block; margin-bottom: 2px;">👶 សុវត្ថិភាពកុមារ (Keep Away)</b>
                        <span style="color: var(--text-muted);">ត្រូវដាក់ទុកដាក់ឱ្យឆ្ងាយពីដៃក្មេង និងសត្វចិញ្ចឹម ដើម្បីការពារគ្រោះថ្នាក់។</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(239,68,68,0.1); color:#ef4444; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmSafetyModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🩺', 'សុវត្ថិភាពថ្នាំ & រក្សាទុក (Safety)', openDrugSafetyModal);
            clearInterval(initInt);
        }
    }, 500);
})();