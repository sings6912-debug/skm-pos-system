(function() {
    console.log("✍️ Menu Kitchen Special Notes Plugin Initialized!");

    function openSpecialNotesModal() {
        if(document.getElementById('skmNotesModal')) {
            document.getElementById('skmNotesModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmNotesModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">✍️</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">កត់ចំណាំការចម្អិនពិសេស</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើសចំណាំរហ័សសម្រាប់ម្ហូបរបស់អ្នក៖</p>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 15px;">
                    <button class="skm-note-chip" onclick="window.appendKitchenNote('កាត់ផ្អែម / Less Sweet')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 10px; border-radius: 10px; font-size: 11px; font-weight: 800; cursor: pointer;">🥤 កាត់ផ្អែម</button>
                    <button class="skm-note-chip" onclick="window.appendKitchenNote('អត់ទឹកកក / No Ice')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 10px; border-radius: 10px; font-size: 11px; font-weight: 800; cursor: pointer;">🧊 អត់ទឹកកក</button>
                    <button class="skm-note-chip" onclick="window.appendKitchenNote('មិនដាក់ម្ទេស / No Spicy')" style="background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid #ef4444; padding: 10px; border-radius: 10px; font-size: 11px; font-weight: 800; cursor: pointer;">🌶️ មិនដាក់ម្ទេស</button>
                    <button class="skm-note-chip" onclick="window.appendKitchenNote('ម្ហូបរសជាតិហឹរខ្លាំង / Extra Spicy')" style="background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid #ef4444; padding: 10px; border-radius: 10px; font-size: 11px; font-weight: 800; cursor: pointer;">🔥 ហឹរខ្លាំង</button>
                    <button class="skm-note-chip" onclick="window.appendKitchenNote('មិនដាក់ប៊ីចេង / No MSG')" style="background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid #22c55e; padding: 10px; border-radius: 10px; font-size: 11px; font-weight: 800; cursor: pointer;">🌿 មិនដាក់ប៊ីចេង</button>
                    <button class="skm-note-chip" onclick="window.appendKitchenNote('ថែមសាច់ / Extra Meat')" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 10px; border-radius: 10px; font-size: 11px; font-weight: 800; cursor: pointer;">🥩 ថែមសាច់</button>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmNotesModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.appendKitchenNote = function(noteText) {
        const noteInput = document.getElementById('cNote');
        if (!noteInput) {
            alert('សូមបើកកន្ត្រកទំនិញ (Cart) សិន ដើម្បីកត់ចំណាំ!');
            document.getElementById('skmNotesModal').style.display = 'none';
            return;
        }

        let currentVal = noteInput.value.trim();
        noteInput.value = currentVal ? `${currentVal}, ${noteText}` : noteText;
        document.getElementById('skmNotesModal').style.display = 'none';
        
        if (typeof showToast === 'function') showToast(`បានបន្ថែមចំណាំ: ${noteText}`);
        else alert(`បានបន្ថែមចំណាំ: ${noteText}`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('✍️', 'កត់ចំណាំការចម្អិនพิเศษ (Notes)', openSpecialNotesModal);
            clearInterval(initInt);
        }
    }, 500);
})();