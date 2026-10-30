(function() {
    console.log("📝 Menu Table Notes & Greetings Board Plugin Initialized!");

    function openTableNotesModal() {
        if(document.getElementById('skmTableNotesModal')) {
            document.getElementById('skmTableNotesModal').style.display = 'flex';
            loadTableNotes();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmTableNotesModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">📝</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">ក្ដារខៀនសារលើតុ (Table Board)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ទុកសរសេរសារស្វាគមន៍ ឬកំណត់ចំណាំសម្រាប់តុរបស់អ្នក៖</p>
                
                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <input type="text" id="tableNoteInput" placeholder="ឧ. តុលេខ ៥ ញ៉ាំឱ្យឆ្ងាញ់ណា..." style="flex: 1; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 12px; color: #fff; font-size: 12px; outline: none; font-family: 'Battambang';" onkeydown="if(event.key==='Enter') window.addTableNote()">
                    <button onclick="window.addTableNote()" style="background: linear-gradient(135deg, #38bdf8, #2563eb); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">រក្សាទុក</button>
                </div>

                <div id="tableNotesContainer" style="max-height: 200px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 6px; text-align: left; font-size: 12px;">
                    <div style="text-align:center; padding:15px; color:var(--text-muted);">មិនទាន់មានសារនៅលើក្ដារខៀនតុទេ</div>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 12px; cursor: pointer;" onclick="document.getElementById('skmTableNotesModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        loadTableNotes();
    }

    function loadTableNotes() {
        const container = document.getElementById('tableNotesContainer');
        if (!container) return;

        let notes = JSON.parse(localStorage.getItem('skm_table_notes_board') || '[]');
        if (notes.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:15px; color:var(--text-muted);">មិនទាន់មានសារនៅលើក្ដារខៀនតុទេ</div>';
            return;
        }

        let savedTable = localStorage.getItem('skm_selected_table') || 'តុលេខ ១';
        container.innerHTML = notes.map((n, idx) => `
            <div style="background: rgba(56,189,248,0.06); border: 1px solid var(--border-color); padding: 10px 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <b style="color: #38bdf8; display: block; font-size: 12px;">📌 [${savedTable}] ${n.text}</b>
                    <span style="font-size: 10px; color: var(--text-muted);">${n.time}</span>
                </div>
                <button onclick="window.removeTableNote(${idx})" style="background: rgba(239,68,68,0.1); color: #ef4444; border: none; padding: 6px 10px; border-radius: 8px; font-size: 11px; cursor: pointer;">✕</button>
            </div>
        `).join('');
    }

    window.addTableNote = function() {
        const inp = document.getElementById('tableNoteInput');
        const text = inp.value.trim();
        if (!text) { alert('សូមសរសេរសារសិន!'); return; }

        let notes = JSON.parse(localStorage.getItem('skm_table_notes_board') || '[]');
        notes.unshift({
            text: text,
            time: new Date().toLocaleString('km-KH')
        });
        localStorage.setItem('skm_table_notes_board', JSON.stringify(notes));

        inp.value = '';
        loadTableNotes();
        if (typeof showToast === 'function') showToast('បានរក្សាទុកសារនៅលើក្ដារខៀនតុជោគជ័យ!');
    };

    window.removeTableNote = function(idx) {
        let notes = JSON.parse(localStorage.getItem('skm_table_notes_board') || '[]');
        notes.splice(idx, 1);
        localStorage.setItem('skm_table_notes_board', JSON.stringify(notes));
        loadTableNotes();
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📝', 'ក្ដារខៀនសារលើតុ (Table Board)', openTableNotesModal);
            clearInterval(initInt);
        }
    }, 500);
})();