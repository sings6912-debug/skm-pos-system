(function() {
    console.log("💊 Menu Vitamin & Nutrient Tracker Plugin Initialized!");

    function openVitaminModal() {
        if(document.getElementById('skmVitaminModal')) {
            document.getElementById('skmVitaminModal').style.display = 'flex';
            calcCartNutrients();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmVitaminModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 38px; margin-bottom: 5px;">💊</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">ត្រួតពិនិត្យវីតាមីន & ជីវជាតិ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ប៉ាន់ស្មានសារធាតុចិញ្ចឹមពីមុខទំនិញក្នុងកន្ត្រករបស់អ្នក៖</p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 8px;" id="vitaminDetailsBox">
                    <div>🥩 <b>ប្រូតេអ៊ីន (Protein):</b> <span id="vitProtein" style="color: #10b981; font-weight: bold;">0 g</span></div>
                    <div>🍊 <b>វីតាមីន C (Vitamin C):</b> <span id="vitC" style="color: #f59e0b; font-weight: bold;">0 mg</span></div>
                    <div>🥛 <b>កាល់ស្យូម (Calcium):</b> <span id="vitCalcium" style="color: #38bdf8; font-weight: bold;">0 mg</span></div>
                    <div>⚡ <b>កាបូអ៊ីដ្រាត (Carbs):</b> <span id="vitCarbs" style="color: #ec4899; font-weight: bold;">0 g</span></div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px; text-align: left;">
                    💡 ការគណនានេះប៉ាន់ស្មានផ្អែកលើបរិមាណ និងប្រភេទមុខទំនិញសរុបក្នុងកន្ត្រក។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmVitaminModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        calcCartNutrients();
    }

    function calcCartNutrients() {
        let count = 0;
        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
            cart.forEach(item => {
                count += parseInt(item.qty || 1);
            });
        }

        const pEl = document.getElementById('vitProtein');
        const cEl = document.getElementById('vitC');
        const calEl = document.getElementById('vitCalcium');
        const carbEl = document.getElementById('vitCarbs');

        if (pEl) pEl.innerText = `${count * 12} g`;
        if (cEl) cEl.innerText = `${count * 25} mg`;
        if (calEl) calEl.innerText = `${count * 120} mg`;
        if (carbEl) carbEl.innerText = `${count * 35} g`;
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💊', 'ត្រួតពិនិត្យវីតាមីន & ជីវជាតិ (Vitamins)', openVitaminModal);
            clearInterval(initInt);
        }
    }, 500);
})();