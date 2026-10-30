(function() {
    console.log("🥐 Menu Smart Food Pairing Plugin Initialized!");

    function openPairingModal() {
        if(document.getElementById('skmPairingModal')) {
            document.getElementById('skmPairingModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmPairingModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🥐</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">ការណែនាំម្ហូបញ៉ាំគូគ្នា (Smart Pairing)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">មុខម្ហូប ឬភេសជ្ជៈដែលញ៉ាំគូគ្នាឆ្ងាញ់ខ្លាំង៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(245,158,11,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #f59e0b; display: block; margin-bottom: 2px;">☕ កាហ្វេទឹកកក + នំប៉័ងអាំង</b>
                        <span style="color: var(--text-muted);">រសជាតិផ្អែមស្រទន់ ញ៉ាំពេលព្រឹកត្រូវគ្នាខ្លាំង!</span>
                    </div>
                    <div style="background: rgba(56,189,248,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #38bdf8; display: block; margin-bottom: 2px;">🍜 មីហឹរ + តែក្រូចឆ្មាត្រជាក់</b>
                        <span style="color: var(--text-muted);">កាត់បន្ថយភាពហឹរបានយ៉ាងល្អ ស្រស់ស្រាយមាត់។</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b;" onclick="document.getElementById('skmPairingModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🥐', 'ការណែនាំម្ហូបគូគ្នា (Smart Pairing)', openPairingModal);
            clearInterval(initInt);
        }
    }, 500);
})();