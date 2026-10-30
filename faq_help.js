(function() {
    console.log("❓ Menu FAQ & Help Center Plugin Initialized!");

    function openFaqModal() {
        if(document.getElementById('skmFaqModal')) {
            document.getElementById('skmFaqModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmFaqModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">❓</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #10b981;">សំណួរញឹកញាប់ (FAQ & Help)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ចម្ងល់ផ្សេងៗអំពីសេវាកម្ម និងការកុម្មង់៖</p>
                
                <div style="max-height: 240px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(128,128,128,0.08); padding: 10px; border-radius: 10px; border: 1px solid var(--border-color);">
                        <b>Q: តើត្រូវចំណាយពេលប៉ុន្មានទើបបានម្ហូប/ទំនិញ?</b><br>
                        <span style="color:var(--text-muted);">A: ជាទូទៅចំណាយពេលប្រហែល ១0 ទៅ ១៥ នាទីប៉ុណ្ណោះ។</span>
                    </div>
                    <div style="background: rgba(128,128,128,0.08); padding: 10px; border-radius: 10px; border: 1px solid var(--border-color);">
                        <b>Q: តើអាចបង់ប្រាក់តាមអនឡាញបានដែរឬទេ?</b><br>
                        <span style="color:var(--text-muted);">A: បាន! លោកអ្នកអាចស្កេន QR Code របស់ហាងដើម្បីទូទាត់។</span>
                    </div>
                    <div style="background: rgba(128,128,128,0.08); padding: 10px; border-radius: 10px; border: 1px solid var(--border-color);">
                        <b>Q: តើមានសេវាដឹកជញ្ជូនដល់ផ្ទះទេ?</b><br>
                        <span style="color:var(--text-muted);">A: មាន ហាងយើងខ្ញុំមានសេវាដឹកជញ្ជូនគ្រប់ទីកន្លែង។</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981;" onclick="document.getElementById('skmFaqModal').style.display='none'">យល់ព្រម / បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('❓', 'សំណួរញឹកញាប់ (FAQ & Help)', openFaqModal);
            clearInterval(initInt);
        }
    }, 500);
})();