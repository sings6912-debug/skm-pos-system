(function() {
    console.log("📏 Menu Portion & Size Guide Plugin Initialized!");

    function openPortionModal() {
        if(document.getElementById('skmPortionModal')) {
            document.getElementById('skmPortionModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmPortionModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">📏</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">មគ្គុទ្ទេសក៍ទំហំចំណែក (Size Guide)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ស្វែងយល់ពីទំហំ និងបរិមាណមុនពេលកុម្មង់៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(56,189,248,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #38bdf8; display: block; margin-bottom: 2px;">🥤 ទំហំ S (Small / តូច)</b>
                        <span style="color: var(--text-muted);">សមស្របសម្រាប់ពិសា ១ នាក់ (កម្រិតស្តង់ដារ)។</span>
                    </div>
                    <div style="background: rgba(16,185,129,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #10b981; display: block; margin-bottom: 2px;">🥤 ទំហំ M (Medium / មធ្យម)</b>
                        <span style="color: var(--text-muted);">ចំណុះច្រើនជាង ៣០% (ជាទីនិយមបំផុត)។</span>
                    </div>
                    <div style="background: rgba(245,158,11,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #f59e0b; display: block; margin-bottom: 2px;">🥤 ទំហំ L / Family (ធំ / គ្រួសារ)</b>
                        <span style="color: var(--text-muted);">ចំណុះធំ សមស្របសម្រាប់ញ៉ាំជុំគ្នា ២-៣ នាក់។</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmPortionModal').style.display='none'">យល់ព្រម / បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📏', 'មគ្គុទ្ទេសក៍ទំហំចំណែក (Size Guide)', openPortionModal);
            clearInterval(initInt);
        }
    }, 500);
})();