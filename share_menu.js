(function() {
    console.log("🔗 Menu Share Card & Bookmark Plugin Initialized!");

    function openShareModal() {
        if(document.getElementById('skmShareModal')) {
            document.getElementById('skmShareModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmShareModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        let currentUrl = window.location.href;

        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">🔗</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ចែករំលែកតំណភ្ជាប់ហាង</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ចម្លងតំណភ្ជាប់ Digital Menu ដើម្បីផ្ញើជូនមិត្តភក្តិ ឬក្រុមគ្រួសារ៖</p>
                
                <div style="background: rgba(128,128,128,0.08); border: 1px solid var(--border-color); padding: 10px; border-radius: 10px; font-size: 11px; word-break: break-all; color: var(--text-muted); margin-bottom: 15px; font-family: monospace;">
                    ${currentUrl}
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #38bdf8; margin-bottom: 10px;" onclick="window.copyMenuLinkToClipboard('${currentUrl}')">📋 ចម្លងតំណភ្ជាប់ (Copy Link)</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmShareModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.copyMenuLinkToClipboard = function(url) {
        navigator.clipboard.writeText(url).then(() => {
            document.getElementById('skmShareModal').style.display = 'none';
            if (typeof showToast === 'function') showToast('បានចម្លងតំណភ្ជាប់ចូល Clipboard ជោគជ័យ!');
            else alert('បានចម្លងតំណភ្ជាប់ជោគជ័យ!');
        });
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔗', 'ចែករំលែកតំណភ្ជាប់ហាង (Share)', openShareModal);
            clearInterval(initInt);
        }
    }, 500);
})();