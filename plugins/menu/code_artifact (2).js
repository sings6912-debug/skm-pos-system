(function() {
    console.log("🎧 Menu Ambient Cafe & Relaxing Sounds Plugin Initialized!");

    function openAmbientModal() {
        if(document.getElementById('skmAmbientModal')) {
            document.getElementById('skmAmbientModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmAmbientModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🎧</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">សំឡេងផ្ទៃខាងក្រោយ & សម្រាកលំហែ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ស្តាប់សំឡេងតន្ត្រីកាហ្វេ ឬសំឡេងธรรมชาติក្នុងពេលរង់ចាំ៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
                    <button onclick="window.playAmbientSound('cafe')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">☕ សំឡេងបរិយាកាសហាងកាហ្វេ (Cafe Vibes)</button>
                    <button onclick="window.playAmbientSound('rain')" style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">🌧️ សំឡេងទឹកភ្លៀងធ្លាក់ (Gentle Rain)</button>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmAmbientModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.playAmbientSound = function(type) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type === 'cafe' ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(type === 'cafe' ? 440 : 220, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.5);
            if (typeof showToast === 'function') showToast(`🎧 កំពុងចាក់សំឡេង: ${type === 'cafe' ? 'Cafe Vibes' : 'Gentle Rain'}!`);
        } catch(e) {
            if (typeof showToast === 'function') showToast('កម្មវិធីរុករកមិនអនុញ្ញាតឱ្យលេងសំឡេងដោយស្វ័យប្រវត្តិទេ', true);
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎧', 'សំឡេងបរិយាកាសហាង (Ambient)', openAmbientModal);
            clearInterval(initInt);
        }
    }, 500);
})();