(function() {
    console.log("🗺️ Menu Store Branch Locator Plugin Initialized!");

    function openStoreMapModal() {
        if(document.getElementById('skmMapModal')) {
            document.getElementById('skmMapModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmMapModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">🗺️</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ទីតាំងសាខា & ផែនទីហាង</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">អញ្ជើញមកលេងហាងផ្ទាល់តាមទីតាំងខាងក្រោម៖</p>
                
                <div style="background: rgba(56,189,248,0.08); border: 1px solid var(--border-color); padding: 14px; border-radius: 12px; margin-bottom: 15px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 8px;">
                    <div>📍 <b>សាខាទី ១ (ទីស្នាក់ការកណ្តាល):</b> ផ្ទះលេខ ១២៣, ផ្លូវ មុនីវង្ស, រាជធានីភ្នំពេញ។</div>
                    <div>📞 <b>ទូរស័ព្ទទំនាក់ទំនង:</b> 012 345 678 / 098 765 432</div>
                    <div>🕒 <b>ម៉ោងបើកបំរើការងារ:</b> 08:00 ព្រឹក - 09:00 យប់</div>
                </div>

                <a href="https://maps.google.com" target="_blank" class="btn-act btn-green" style="display:block; background:#38bdf8; color:#fff; text-decoration:none; margin-bottom:10px; padding:12px; border-radius:12px; font-size:13px; font-weight:800;">🚗 បើកមើលក្នុង Google Maps</a>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(128,128,128,0.1);" onclick="document.getElementById('skmMapModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🗺️', 'ទីតាំងសាខា & ផែនទីហាង', openStoreMapModal);
            clearInterval(initInt);
        }
    }, 500);
})();