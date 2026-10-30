(function() {
    console.log("🎁 Menu Gift Wrapping & Special Packaging Plugin Initialized!");

    function openGiftWrapModal() {
        if(document.getElementById('skmGiftModal')) {
            document.getElementById('skmGiftModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmGiftModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">🎁</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #ec4899;">សេវាខ្ចប់កាដូ & ថង់ប្រណិត</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើសទម្រង់វេចខ្ចប់សម្រាប់កាដូ ឬ ថង់ពិសេស៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
                    <button onclick="window.appendGiftOption('🎀 ខ្ចប់កាដូស្អាត (Gift Wrap)')" style="background: rgba(236,72,153,0.1); color: #ec4899; border: 1px solid #ec4899; padding: 12px; border-radius: 12px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">🎀 ខ្ចប់កាដូស្អាត (Gift Wrap)</button>
                    <button onclick="window.appendGiftOption('🛍️ ថង់ក្រដាសប្រណិតហាង')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 12px; border-radius: 12px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">🛍️ ថង់ក្រដាសប្រណិតហាង</button>
                    <button onclick="window.appendGiftOption('💌 សរសេរសំបុត្រជូនពរ Free')" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 12px; border-radius: 12px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">💌 សរសេរសំបុត្រជូនពរ Free</button>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(128,128,128,0.1);" onclick="document.getElementById('skmGiftModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.appendGiftOption = function(giftText) {
        const noteInput = document.getElementById('cNote');
        if (!noteInput) {
            alert('សូមបើកកន្ត្រកទំនិញ (Cart) សិន ដើម្បីកត់ចំណាំវេចខ្ចប់!');
            document.getElementById('skmGiftModal').style.display = 'none';
            return;
        }

        let currentVal = noteInput.value.trim();
        noteInput.value = currentVal ? `${currentVal}, ${giftText}` : giftText;
        document.getElementById('skmGiftModal').style.display = 'none';
        
        if (typeof showToast === 'function') showToast(`បានបន្ថែមជម្រើស: ${giftText}`);
        else alert(`បានបន្ថែមជម្រើស: ${giftText}`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎁', 'សេវាខ្ចប់កាដូ & ថង់ពិសេស', openGiftWrapModal);
            clearInterval(initInt);
        }
    }, 500);
})();