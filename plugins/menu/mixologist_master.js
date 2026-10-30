(function() {
    console.log("🍹 Menu Mixologist & Recipe Pairing Master Plugin Initialized!");

    function openMixologistModal() {
        if(document.getElementById('skmMixologistModal')) {
            document.getElementById('skmMixologistModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmMixologistModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(236,72,153,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">🍹</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #ec4899;">មេជាងលាយភេសជ្ជៈ (Mixologist)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">រូបមន្តលាយភេសជ្ជៈពិសេស និងការจับคู่គ្រឿងផ្សំ៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px; text-align: left;">
                    <div style="background: rgba(236,72,153,0.08); border: 1px solid #ec4899; padding: 12px; border-radius: 14px;">
                        <b style="color: #ec4899; font-size: 13px; display: block; margin-bottom: 2px;">🍊 វីតាមីន ស៊ី ស្រស់ស្រាយ (Citrus Blast)</b>
                        <span style="font-size: 11px; color: var(--text-muted);">ទឹកក្រូចឆ្មា + ទឹកឃ្មុំធម្មជាតិ + សូដាត្រជាក់</span>
                    </div>
                    <div style="background: rgba(56,189,248,0.08); border: 1px solid #38bdf8; padding: 12px; border-radius: 14px;">
                        <b style="color: #38bdf8; font-size: 13px; display: block; margin-bottom: 2px;">☕ កាហ្វេទឹកដោះគោសូកូឡា (Mocha Chill)</b>
                        <span style="font-size: 11px; color: var(--text-muted);">អេសប្រ៉េសូ + ទឹកដោះគោสด + សូកូឡាស្ងោរ</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(236,72,153,0.1); color:#ec4899; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmMixologistModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🍹', 'មេជាងលាយភេសជ្ជៈ (Mixologist)', openMixologistModal);
            clearInterval(initInt);
        }
    }, 500);
})();