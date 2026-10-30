(function() {
    console.log("🔬 Menu Dish Anatomy & Ingredient Inspector Plugin Initialized!");

    function openAnatomyModal() {
        if(document.getElementById('skmAnatomyModal')) {
            document.getElementById('skmAnatomyModal').style.display = 'flex';
            loadAnatomyDetails();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmAnatomyModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 420px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🔬</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">វិភាគគ្រឿងផ្សំ & ស្រទាប់ម្ហូប</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ពិនិត្យមើលសមាសធាតុ និងគុណតម្លៃអាហារូបត្ថម្ភ៖</p>
                
                <div id="anatomyContentBox" style="background: rgba(15,23,42,0.6); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 10px;">
                    <div><b>🥗 មូលដ្ឋាន (Base Layer):</b> គ្រាប់កាហ្វេអារ៉ាប៊ីកា ឬស្រូវសាលីធម្មជាតិ</div>
                    <div><b>🍯 រសជាតិកណ្តាល (Flavor Profile):</b> ផ្អែមស្រទន់ ក្រអូបឈ្ងុយជាប់មាត់</div>
                    <div><b>🌿 កម្រិតសរីរាង្គ (Organic Score):</b> <span style="color: #10b981; font-weight: 900;">98.5% សុទ្ធសាធ</span></div>
                    <div><b>⚡ ពិន្ទុថាមពល (Energy Rating):</b> កម្រិតមធ្យម ស្រស់ស្រាយពេញមួយថ្ងៃ</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmAnatomyModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        loadAnatomyDetails();
    }

    function loadAnatomyDetails() {
        const box = document.getElementById('anatomyContentBox');
        if (!box) return;
        let inv = window.inventory || [];
        if (inv.length > 0) {
            let sample = inv[0];
            box.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
                    <img src="${sample.image || 'https://placehold.co/40'}" style="width:40px; height:40px; object-fit:contain; border-radius:8px; background:#fff;">
                    <div>
                        <b style="color:#38bdf8; font-size:13px;">${sample.name}</b>
                        <span style="display:block; font-size:10px; color:var(--text-muted);">តម្លៃ: $${parseFloat(sample.price||0).toFixed(2)}</span>
                    </div>
                </div>
                <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:4px 0;">
                <div><b>🥗 គ្រឿងផ្សំចម្បង:</b> វត្ថុធាតុដើមគុណភាពខ្ពស់ ស្រស់ស្អាតប្រចាំហាង</div>
                <div><b>🌿 កម្រិតសរីរាង្គ (Organic):</b> <span style="color: #10b981; font-weight: 900;">100% ធម្មជាតិ</span></div>
                <div><b>🛡️ សុវត្ថិភាព:</b> គ្មានជាតិគីមី និងគ្មានសារធាតុរក្សាទុកយូរ</div>
            `;
        }
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔬', 'វិភាគគ្រឿងផ្សំ & ស្រទាប់ម្ហូប (Anatomy)', openAnatomyModal);
            clearInterval(initInt);
        }
    }, 500);
})();