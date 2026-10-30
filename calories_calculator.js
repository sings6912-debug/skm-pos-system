(function() {
    console.log("🥗 Menu Calories & Nutrition Calculator Plugin Initialized!");

    function openCaloriesModal() {
        if(document.getElementById('skmCaloriesModal')) {
            document.getElementById('skmCaloriesModal').style.display = 'flex';
            calcCartCalories();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmCaloriesModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">🥗</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #10b981;">គណនាជាតិកាឡូរី & សុខភាព</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ប៉ាន់ស្មានជាតិកាឡូរីសរុបនៃមុខទំនិញក្នុងកន្ត្រក៖</p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 15px; border-radius: 12px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted);">កាឡូរីប៉ាន់ស្មានសរុប:</div>
                    <div id="caloriesTotalDisplay" style="font-size: 24px; font-weight: 900; color: #10b981; margin-top: 5px;">0 kcal</div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px; text-align: left;">
                    💡 ការគណនានេះផ្អែកលើមធ្យភាគទំនិញក្នុងកន្ត្រករបស់អ្នក (ប្រហែល 250 kcal ក្នុងមួយមុខទំនិញ)។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981;" onclick="document.getElementById('skmCaloriesModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        calcCartCalories();
    }

    function calcCartCalories() {
        const display = document.getElementById('caloriesTotalDisplay');
        if (!display) return;

        let totalCals = 0;
        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
            cart.forEach(item => {
                let q = parseInt(item.qty || 1);
                // สมมติ 250 kcal ต่อหน่วย
                totalCals += (250 * q);
            });
        }
        display.innerText = `${totalCals} kcal`;
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🥗', 'គណនាជាតិកាឡូរី & សុខភាព (Calories)', openCaloriesModal);
            clearInterval(initInt);
        }
    }, 500);
})();