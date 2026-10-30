(function() {
    console.log("🎁 Menu Referral & Invite Program Plugin Initialized!");

    function openReferralModal() {
        if(document.getElementById('skmReferralModal')) {
            document.getElementById('skmReferralModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmReferralModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        let userRefCode = localStorage.getItem('skm_user_referral_code');
        if (!userRefCode) {
            userRefCode = 'SKM-' + Math.floor(100000 + Math.random() * 900000);
            localStorage.setItem('skm_user_referral_code', userRefCode);
        }

        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🎁</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #ec4899;">ណែនាំមិត្តភក្តិ (Refer & Earn)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ចែករំលែកកូដរបស់អ្នកជូនមិត្តភក្តិ ដើម្បីទទួលបានពិន្ទុរង្វាន់ទាំងអស់គ្នា!</p>
                
                <div style="background: rgba(236,72,153,0.08); border: 1px dashed #ec4899; padding: 15px; border-radius: 12px; margin-bottom: 15px;">
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">កូដណែនាំផ្ទាល់ខ្លួនរបស់អ្នក:</div>
                    <div style="font-size: 20px; font-weight: 900; color: #ec4899; font-family: monospace;" id="refCodeDisplay">${userRefCode}</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #ec4899; margin-bottom: 10px;" onclick="window.copyReferralCode('${userRefCode}')">📋 ចម្លងកូដណែនាំ (Copy Code)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmReferralModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.copyReferralCode = function(code) {
        navigator.clipboard.writeText(code).then(() => {
            document.getElementById('skmReferralModal').style.display = 'none';
            if (typeof showToast === 'function') showToast('បានចម្លងកូដណែនាំចូល Clipboard ជោគជ័យ!');
            else alert('បានចម្លងកូដណែនាំជោគជ័យ!');
        });
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎁', 'ណែនាំមិត្តភក្តិ (Refer & Earn)', openReferralModal);
            clearInterval(initInt);
        }
    }, 500);
})();