(function() {
    console.log("🎙️ Menu Voice Search Plugin Initialized!");

    function openVoiceSearchModal() {
        if(document.getElementById('skmVoiceModal')) {
            document.getElementById('skmVoiceModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmVoiceModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 42px; margin-bottom: 10px;">🎙️</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ស្វែងរកទំនិញដោយសំឡេង</h3>
                <p id="voiceStatusText" style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 20px;">ចុចប៊ូតុងខាងក្រោមរួចនិយាយឈ្មោះទំនិញ៖</p>
                
                <button id="startVoiceBtn" class="btn-act btn-green" style="width: 100%; background: #38bdf8; margin-bottom: 10px;" onclick="window.startSpeechRecognition()">🎙️ ចាប់ផ្តើមនិយាយ (Start)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmVoiceModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.startSpeechRecognition = function() {
        const statusEl = document.getElementById('voiceStatusText');
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            if (statusEl) statusEl.innerText = '⚠️ កម្មវិធីរុករករបស់អ្នកមិនគាំទ្រ Voice Search ទេ!';
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'km-KH';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        if (statusEl) statusEl.innerText = 'Listening... កំពុងស្តាប់សំឡេងរបស់អ្នក...';

        recognition.onresult = function(event) {
            const speechResult = event.results[0][0].transcript;
            if (statusEl) statusEl.innerText = `✅ បានឮ: "${speechResult}"`;
            
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = speechResult;
                if (typeof renderMenu === 'function') renderMenu();
                window.scrollTo({top: 300, behavior: 'smooth'});
            }
            setTimeout(() => {
                document.getElementById('skmVoiceModal').style.display = 'none';
            }, 1000);
        };

        recognition.onerror = function(event) {
            if (statusEl) statusEl.innerText = '❌ មានបញ្ហាក្នុងការស្តាប់ សូមព្យាយាមម្តងទៀត!';
        };

        recognition.start();
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎙️', 'ស្វែងរកដោយសំឡេង (Voice Search)', openVoiceSearchModal);
            clearInterval(initInt);
        }
    }, 500);
})();