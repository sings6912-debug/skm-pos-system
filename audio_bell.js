(function() {
    console.log("🔔 Menu Audio Bell & Sound Effects Plugin Initialized!");

    function openAudioModal() {
        if(document.getElementById('skmAudioModal')) {
            document.getElementById('skmAudioModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmAudioModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🔔</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">សំឡេងកណ្ដឹង & ផលិផលសំឡេង</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">សាកល្បងចុចប៊ូតុងសំឡេងកណ្ដឹងរហ័ស៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
                    <button onclick="window.playMenuBellSound(880)" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">🔔 កណ្ដឹងហៅបុគ្គលិក (Service Bell)</button>
                    <button onclick="window.playMenuBellSound(523)" style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; text-align: left;">🎵 សំឡេងអបអរសាទរ (Success Tone)</button>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b;" onclick="document.getElementById('skmAudioModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.playMenuBellSound = function(freq) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.6);
            if (typeof showToast === 'function') showToast('🎵 បានចាក់សំឡេងកណ្ដឹងរហ័ស!');
        } catch(e) {
            if (typeof showToast === 'function') showToast('កម្មវិធីរុករកមិនអនុញ្ញាតឱ្យលេងសំឡេងដោយស្វ័យប្រវត្តិទេ', true);
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔔', 'សំឡេងកណ្ដឹងរហ័ស (Audio Bell)', openAudioModal);
            clearInterval(initInt);
        }
    }, 500);
})();