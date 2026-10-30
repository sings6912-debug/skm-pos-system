(function() {
    console.log("🪑 Menu Table & Seat Number Selector Plugin Initialized!");

    function openTableSelectorModal() {
        if(document.getElementById('skmTableModal')) {
            document.getElementById('skmTableModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmTableModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        let savedTable = localStorage.getItem('skm_selected_table') || 'តុលេខ ១';

        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">🪑</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ជ្រើសរើសលេខតុអង្គុយ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 20px;">សូមជ្រើសរើសតុដែលលោកអ្នកកំពុងអង្គុយពិសា៖</p>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                    ${['តុលេខ ១', 'តុលេខ ២', 'តុលេខ ៣', 'តុលេខ ៤', 'តុលេខ ៥', 'VIP 1', 'VIP 2', 'ខ្ចប់យកផ្ទះ', 'ដឹកជញ្ជូន'].map(t => `
                        <button class="skm-table-chip ${t === savedTable ? 'active' : ''}" onclick="window.selectTableNumber('${t}')" style="background: ${t === savedTable ? '#38bdf8' : 'rgba(128,128,128,0.1)'}; color: ${t === savedTable ? '#fff' : 'var(--text-dark)'}; border: 1px solid var(--border-color); padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; transition: 0.2s;">${t}</button>
                    `).join('')}
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(239,68,68,0.1); color:#ef4444;" onclick="document.getElementById('skmTableModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.selectTableNumber = function(tableName) {
        localStorage.setItem('skm_selected_table', tableName);
        updateOrderNoteWithTable(tableName);
        document.getElementById('skmTableModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`បានជ្រើសរើស: ${tableName}`);
    };

    function updateOrderNoteWithTable(tableText) {
        const noteInput = document.getElementById('cNote');
        if (!noteInput) return;

        let currentVal = noteInput.value.replace(/\[តុ:.*?\]/g, '').trim();
        noteInput.value = `[តុ: ${tableText}] ${currentVal}`.trim();
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🪑', 'ជ្រើសរើសលេខតុ / កន្លែងអង្គុយ', openTableSelectorModal);
            clearInterval(initInt);
        }
    }, 500);
})();