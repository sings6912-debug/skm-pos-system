(function() {
    console.log("🌤️ Menu Weather-based Recommendation Plugin Initialized!");

    function openWeatherModal() {
        if(document.getElementById('skmWeatherModal')) {
            document.getElementById('skmWeatherModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmWeatherModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">☀️</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ការណែនាំម្ហូបតាមអាកាសធាតុ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើសស្ថានភាពអាកាសធាតុថ្ងៃនេះដើម្បីទទួលការណែនាំម្ហូប៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
                    <button onclick="window.recommendWeatherFood('sunny')" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">☀️ អាកាសធាតុក្តៅ (ណែនាំ: ភេសជ្ជៈត្រជាក់ៗ)</button>
                    <button onclick="window.recommendWeatherFood('rainy')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">🌧️ អាកាសធាតុភ្លៀង / ត្រជាក់ (ណែនាំ: ស៊ុបក្តៅៗ)</button>
                </div>

                <div id="weatherRecResult" style="font-size: 12px; color: #10b981; margin-bottom: 15px; background: rgba(16,185,129,0.08); padding: 10px; border-radius: 8px; display: none;"></div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmWeatherModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.recommendWeatherFood = function(type) {
        const res = document.getElementById('weatherRecResult');
        if(!res) return;
        res.style.display = 'block';
        if(type === 'sunny') {
            res.innerText = '💡 ថ្ងៃនេះអាកាសធាតុក្តៅ ពួកយើងសូមណែនាំ៖ ទឹកកាកាវត្រជាក់, តែទឹកកក ឬកាហ្វេទឹកកក!';
        } else {
            res.innerText = '💡 ថ្ងៃនេះអាកាសធាតុត្រជាក់ ពួកយើងសូមណែនាំ៖ មីក្ដៅ, ស៊ុបក្តៅៗ ឬកាហ្វេក្តៅ!';
        }
        if (typeof showToast === 'function') showToast('បានទទួលការណែនាំម្ហូបតាមអាកាសធាតុ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('☀️', 'ណែនាំម្ហូបតាមអាកាសធាតុ (Weather)', openWeatherModal);
            clearInterval(initInt);
        }
    }, 500);
})();