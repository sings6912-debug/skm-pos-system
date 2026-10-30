(function() {
    console.log("💊 Menu Product Specification & Guide Plugin Initialized!");

    function openProductGuideModal() {
        if(document.getElementById('skmGuideModal')) {
            document.getElementById('skmGuideModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmGuideModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">📋</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ការណែនាំ & ព័ត៌មានផលិតផល</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">សម្រាប់ឱសថ, គ្រឿងសម្អាង ឬរបស់លេង (Toys & Pharmacy)</p>
                
                <div style="background: rgba(56,189,248,0.08); border: 1px solid var(--border-color); padding: 12px; border-radius: 12px; margin-bottom: 15px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 8px;">
                    <div>💊 <b>ឱសថ / ថ្នាំពេទ្យ:</b> សូមអានកម្រិតប្រើប្រាស់លើសំបក ឬពិគ្រោះជាមួយអ្នកលក់មុនពេលប្រើ។</div>
                    <div>🧸 <b>របស់លេង (Toys):</b> សមស្របសម្រាប់ក្មេងអាយុចាប់ពី ៣ ឆ្នាំឡើងទៅ (មានសុវត្ថិភាពគ្មានជាតិពុល)។</div>
                    <div>📦 <b>ទំនិញទូទៅ:</b> មានការធានាគុណភាពត្រឹមត្រូវពីហាង។</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmGuideModal').style.display='none'">យល់ព្រម / បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📋', 'ការណែនាំការប្រើប្រាស់ & ព័ត៌មានទំនិញ', openProductGuideModal);
            clearInterval(initInt);
        }
    }, 500);
})();