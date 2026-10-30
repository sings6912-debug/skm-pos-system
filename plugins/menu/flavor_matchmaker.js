(function() {
    console.log("🍹 Menu Flavor Matchmaker Plugin Initialized!");

    function openFlavorModal() {
        if(document.getElementById('skmFlavorModal')) {
            document.getElementById('skmFlavorModal').style.display = 'flex';
            document.getElementById('flavorResultBox').style.display = 'none';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmFlavorModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(236,72,153,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🍹</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #ec4899;">ស្វែងរករសជាតិត្រូវចិត្ត</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">តើថ្ងៃនេះអ្នកចង់បានរសជាតិបែបណាដែរ?</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
                    <button onclick="window.matchFlavor('ផ្អែម')" style="background: rgba(236,72,153,0.1); color: #ec4899; border: 1px solid #ec4899; padding: 12px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">🍯 ផ្អែមស្រទន់ (Sweet)</button>
                    <button onclick="window.matchFlavor('ជូរ')" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 12px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">🍋 ជូរអែម (Sour)</button>
                    <button onclick="window.matchFlavor('ហឹរ')" style="background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid #ef4444; padding: 12px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">🌶️ ហឹរឆ្ងាញ់ (Spicy)</button>
                    <button onclick="window.matchFlavor('ស្រស់ស្រាយ')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 12px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">🌿 ស្រស់ស្រាយ (Fresh)</button>
                </div>

                <div id="flavorResultBox" style="background: rgba(236,72,153,0.08); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: center; display: none;">
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">ការណែនាំរសជាតិសម្រាប់អ្នក:</div>
                    <div id="flavorRecName" style="font-size: 15px; font-weight: 900; color: #ec4899; margin-bottom: 2px;">---</div>
                    <div id="flavorRecDesc" style="font-size: 11px; color: var(--text-dark);">---</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(236,72,153,0.1); color:#ec4899; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmFlavorModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.matchFlavor = function(flavorType) {
        const box = document.getElementById('flavorResultBox');
        const nameEl = document.getElementById('flavorRecName');
        const descEl = document.getElementById('flavorRecDesc');
        if (!box) return;

        box.style.display = 'block';

        let inv = window.inventory || [];
        let match = inv.find(p => String(p.name).toLowerCase().includes(flavorType) || String(p.category).toLowerCase().includes(flavorType));

        if (!match && inv.length > 0) {
            match = inv[Math.floor(Math.random() * inv.length)];
        }

        if (match) {
            nameEl.innerText = `✨ ${match.name} ($${parseFloat(match.price || 0).toFixed(2)})`;
            descEl.innerText = `មុខទំនិញនេះមានរសជាតិត្រូវនឹងចំណូលចិត្ត "${flavorType}" របស់អ្នកថ្ងៃនេះខ្លាំងបំផុត!`;
        } else {
            nameEl.innerText = 'កាហ្វេដូងក្រអូបប្រចាំហាង';
            descEl.innerText = `រសជាតិ "${flavorType}" ដ៏ពេញនិយម និងស្រស់ស្រាយបំផុត!`;
        }

        if (typeof showToast === 'function') showToast(`បានរកឃើញរសជាតិ: ${flavorType}!`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🍹', 'ស្វែងរករសជាតិត្រូវចិត្ត (Flavor Match)', openFlavorModal);
            clearInterval(initInt);
        }
    }, 500);
})();