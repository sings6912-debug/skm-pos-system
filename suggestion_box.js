(function() {
    console.log("💡 Menu Suggestion Box Plugin Initialized!");

    function openSuggestionModal() {
        if(document.getElementById('skmSuggModal')) {
            document.getElementById('skmSuggModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmSuggModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">💡</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ស្នើសុំមុខទំនិញ / ម្ហូបថ្មី</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">តើអ្នកចង់ឱ្យហាងយើងខ្ញុំបន្ថែមទំនិញ ឬមុខម្ហូបអ្វីនៅពេលក្រោយ?</p>
                
                <textarea id="suggTextInp" placeholder="សរសេរឈ្មោះទំនិញ ឬសំណូមពររបស់អ្នកនៅទីនេះ..." style="width: 100%; height: 80px; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-family: 'Battambang'; font-size: 12px; resize: none; outline: none; margin-bottom: 15px;"></textarea>

                <button class="btn-act btn-green" style="width: 100%; background: #38bdf8; margin-bottom: 10px;" onclick="window.submitMenuSuggestion()">📤 ផ្ញើសំណើជូនហាង</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmSuggModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.submitMenuSuggestion = function() {
        const txt = document.getElementById('suggTextInp').value.trim();
        if(!txt) { alert('សូមសរសេរសំណូមពររបស់អ្នកសិន!'); return; }
        
        let suggestions = JSON.parse(localStorage.getItem('skm_customer_suggestions') || '[]');
        suggestions.unshift({
            suggestion: txt,
            time: new Date().toLocaleString('km-KH')
        });
        localStorage.setItem('skm_customer_suggestions', JSON.stringify(suggestions));

        document.getElementById('suggTextInp').value = '';
        document.getElementById('skmSuggModal').style.display = 'none';
        if (typeof showToast === 'function') showToast('បានផ្ញើសំណើជូនហាងជោគជ័យ!');
        else alert('បានផ្ញើសំណើជូនហាងជោគជ័យ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💡', 'ស្នើសុំមុខទំនិញថ្មី (Suggestions)', openSuggestionModal);
            clearInterval(initInt);
        }
    }, 500);
})();