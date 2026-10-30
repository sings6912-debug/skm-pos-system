(function() {
    console.log("🎊 Menu Festive & Seasonal Greeting Plugin Initialized!");

    function openFestiveModal() {
        if(document.getElementById('skmFestiveModal')) {
            document.getElementById('skmFestiveModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmFestiveModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🎊</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">សេចក្តីជូនពរ & រដូវកាល</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">អបអរសាទរពិធីបុណ្យជាតិ និងរដូវកាលថ្មីៗជាមួយហាងយើងខ្ញុំ៖</p>
                
                <div style="background: rgba(245,158,11,0.08); border: 1px dashed #f59e0b; padding: 15px; border-radius: 12px; margin-bottom: 15px; text-align: left; font-size: 12px; color: var(--text-dark);">
                    <b>🌸 សារជូនពរប្រចាំរដូវកាល៖</b><br>
                    សូមជូនពរអតិថិជនទាំងអស់គ្នា ជួបតែសេចក្តីសុខ សេចក្តីចម្រើន សុខភាពល្អ និងរកស៊ីមានបានគ្រប់ៗគ្នា! ហាងយើងខ្ញុំមានការបញ្ចុះតម្លៃពិសេសសម្រាប់ឱកាសបុណ្យជាតិខាងមុខនេះ។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b;" onclick="document.getElementById('skmFestiveModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎊', 'សារជូនពរ & រដូវកាល (Greetings)', openFestiveModal);
            clearInterval(initInt);
        }
    }, 500);
})();