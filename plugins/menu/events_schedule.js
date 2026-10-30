(function() {
    console.log("🎶 Menu Live Events & Music Schedule Plugin Initialized!");

    function openEventsModal() {
        if(document.getElementById('skmEventsModal')) {
            document.getElementById('skmEventsModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmEventsModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🎶</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #ec4899;">កាលវិភាគតន្ត្រី & ព្រឹត្តិការណ៍</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">កម្សាន្តសប្បាយជាមួយតន្ត្រីផ្ទាល់ (Acoustic Night) ប្រចាំសប្តាហ៍៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(236,72,153,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #ec4899; display: block; margin-bottom: 2px;">🎸 តន្ត្រីអាគូស្ទិក (Acoustic Night)</b>
                        <span style="color: var(--text-muted);">រៀងរាល់ថ្ងៃសុក្រ និងសៅរ៍ | ម៉ោង ០៧:០០ យប់</span>
                    </div>
                    <div style="background: rgba(56,189,248,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #38bdf8; display: block; margin-bottom: 2px;">🎤 កម្មវិធីចម្រៀងតាមសំណូមពរ</b>
                        <span style="color: var(--text-muted);">រៀងរាល់ថ្ងៃអាទិត្យ | ម៉ោង ០៦:០០ ល្ងាច</span>
                    </div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(236,72,153,0.1); color:#ec4899;" onclick="document.getElementById('skmEventsModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎶', 'កាលវិភាគតន្ត្រី & ព្រឹត្តិការណ៍ (Events)', openEventsModal);
            clearInterval(initInt);
        }
    }, 500);
})();