(function() {
    console.log("📸 Menu Virtual Photo Booth Plugin Initialized!");

    function openPhotoBoothModal() {
        if(document.getElementById('skmPhotoBoothModal')) {
            document.getElementById('skmPhotoBoothModal').style.display = 'flex';
            startCameraStream();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmPhotoBoothModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 38px; margin-bottom: 5px;">📸</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">ថតរូបអនុស្សាវរីយ៍ប្រចាំហាង</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ថតរូបជាមួយស៊ុមឌីជីថលដ៏ស្រស់ស្អាតប្រចាំហាង៖</p>
                
                <div style="position: relative; width: 100%; height: 240px; background: #000; border-radius: 16px; overflow: hidden; margin-bottom: 15px; border: 2px solid #38bdf8;">
                    <video id="boothVideo" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
                    <div style="position: absolute; bottom: 10px; left: 0; width: 100%; text-align: center; color: #fff; font-size: 12px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.8); pointer-events: none;">✨ Digital Menu Store Experience ✨</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #38bdf8; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.captureBoothPhoto()">📸 ថតរូប (Capture)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="window.closePhotoBooth()">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        startCameraStream();
    }

    function startCameraStream() {
        const video = document.getElementById('boothVideo');
        if (!video) return;

        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
            .then(stream => {
                video.srcObject = stream;
                window.boothStream = stream;
            })
            .catch(err => {
                console.warn("Camera access denied or unavailable:", err);
                video.style.display = 'none';
                video.parentElement.innerHTML += `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#94a3b8; font-size:12px; padding:20px;">📷 កាមេរ៉ាមិនអាចដំណើរការបាន ឬមិនមានការអនុញ្ញាត</div>`;
            });
    }

    window.captureBoothPhoto = function() {
        if (typeof showToast === 'function') showToast('📸 ថតរូបអនុស្សាវរីយ៍ជោគជ័យ!');
        else alert('📸 ថតរូបអនុស្សាវរីយ៍ជោគជ័យ!');
    };

    window.closePhotoBooth = function() {
        if (window.boothStream) {
            window.boothStream.getTracks().forEach(track => track.stop());
        }
        document.getElementById('skmPhotoBoothModal').style.display = 'none';
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📸', 'ថតរូបអនុស្សាវរីយ៍ (Photo Booth)', openPhotoBoothModal);
            clearInterval(initInt);
        }
    }, 500);
})();