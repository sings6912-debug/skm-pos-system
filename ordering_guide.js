(function() {
    console.log("📖 Menu Ordering Guide Plugin Initialized!");

    function openOrderingGuideModal() {
        if(document.getElementById('skmGuideModal2')) {
            document.getElementById('skmGuideModal2').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmGuideModal2';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">📖</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">មគ្គុទ្ទេសក៍ការកុម្មង់ (How to Order)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជំហានងាយៗក្នុងការកុម្មង់ទំនិញតាម Digital Menu៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(56,189,248,0.08); padding: 10px; border-radius: 10px; border: 1px solid var(--border-color);">
                        <b>១. រើសទំនិញ/ម្ហូប៖</b> ចុចមើលប្រភេទ និងមុខទំនិញដែលលោកអ្នកពេញចិត្ត។
                    </div>
                    <div style="background: rgba(56,189,248,0.08); padding: 10px; border-radius: 10px; border: 1px solid var(--border-color);">
                        <b>២. បន្ថែមចូលកន្ត្រក៖</b> ជ្រើសរើសជម្រើស (Variant/Note) រួចចុច Add to Cart។
                    </div>
                    <div style="background: rgba(56,189,248,0.08); padding: 10px; border-radius: 10px; border: 1px solid var(--border-color);">
                        <b>៣. បញ្ជាក់តុ និងបង់ប្រាក់៖</b> បំពេញឈ្មោះ លេខតុ និងស្កេន QR បង់ប្រាក់ជាការស្រេច!
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmGuideModal2').style.display='none'">យល់ព្រម / បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📖', 'មគ្គុទ្ទេសក៍ការកុម្មង់ (How to Order)', openOrderingGuideModal);
            clearInterval(initInt);
        }
    }, 500);
})();