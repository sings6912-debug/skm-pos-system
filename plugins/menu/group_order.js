(function() {
    console.log("👥 Menu Group Order & Shared Cart Plugin Initialized!");

    function openGroupOrderModal() {
        if(document.getElementById('skmGroupModal')) {
            document.getElementById('skmGroupModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmGroupModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        let sessionCode = localStorage.getItem('skm_group_session_code');
        if (!sessionCode) {
            sessionCode = 'GRP-' + Math.floor(1000 + Math.random() * 9000);
            localStorage.setItem('skm_group_session_code', sessionCode);
        }

        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">👥</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #10b981;">កន្ត្រកក្រុម (Group Order)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">សហការគ្នាកុម្មង់ទំនិញជាមួយមិត្តភក្តិនៅតុតែមួយ៖</p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px dashed #10b981; padding: 15px; border-radius: 12px; margin-bottom: 15px;">
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">កូដវគ្គកុម្មង់ (Session Code):</div>
                    <div style="font-size: 22px; font-weight: 900; color: #10b981; font-family: monospace;" id="groupCodeDisplay">${sessionCode}</div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px; text-align: left;">
                    💡 បញ្ជូនកូដនេះ ឬតំណភ្ជាប់កន្ត្រកជូនមិត្តភក្តិ ដើម្បីបូកសរុបការកុម្មង់ចូលគ្នាតែមួយ។
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #10b981; margin-bottom: 10px;" onclick="window.copyGroupCode('${sessionCode}')">📋 ចម្លងកូដក្រុម (Copy Code)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmGroupModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.copyGroupCode = function(code) {
        navigator.clipboard.writeText(code).then(() => {
            document.getElementById('skmGroupModal').style.display = 'none';
            if (typeof showToast === 'function') showToast('បានចម្លងកូដក្រុមចូល Clipboard ជោគជ័យ!');
            else alert('បានចម្លងកូដក្រុមជោគជ័យ!');
        });
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('👥', 'កន្ត្រកក្រុម (Group Order)', openGroupOrderModal);
            clearInterval(initInt);
        }
    }, 500);
})();