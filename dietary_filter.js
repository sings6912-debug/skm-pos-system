(function() {
    console.log("🥗 Menu Dietary & Feature Filter Plugin Initialized!");

    function openDietaryModal() {
        if(document.getElementById('skmDietaryModal')) {
            document.getElementById('skmDietaryModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmDietaryModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">🥗</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #22c55e;">ត្រងតាមប្រភេទអាហារពិសេស</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 20px;">ជ្រើសរើសចំណូលចិត្តអាហាររបស់អ្នក៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                    <button class="skm-diet-btn" onclick="window.filterByDiet('all')" style="background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid #22c55e; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">🌟 មុខម្ហូបទាំងអស់ (All Items)</button>
                    <button class="skm-diet-btn" onclick="window.filterByDiet('spicy')" style="background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid #ef4444; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">🌶️ ម្ហូបរសជាតិហឹរ (Spicy)</button>
                    <button class="skm-diet-btn" onclick="window.filterByDiet('veg')" style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">🥬 ម្ហូបបួស / សាឡាត់ (Vegetarian)</button>
                    <button class="skm-diet-btn" onclick="window.filterByDiet('chef')" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">⭐ មុខម្ហូបពិសេសប្រចាំហាង (Chef's Special)</button>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(128,128,128,0.1);" onclick="document.getElementById('skmDietaryModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.filterByDiet = function(type) {
        document.getElementById('skmDietaryModal').style.display = 'none';
        if (typeof window.inventory === 'undefined') return;

        let term = '';
        if (type === 'spicy') term = 'ហឹរ';
        else if (type === 'veg') term = 'បួស';
        else if (type === 'chef') term = 'ពិសេស';

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = type === 'all' ? '' : term;
            if (typeof renderMenu === 'function') renderMenu();
            window.scrollTo({top: 300, behavior: 'smooth'});
        }
        if (typeof showToast === 'function') showToast(`បានត្រងតាម: ${type === 'all' ? 'ទាំងអស់' : term}`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🥗', 'ត្រងតាមប្រភេទអាហារពិសេស', openDietaryModal);
            clearInterval(initInt);
        }
    }, 500);
})();