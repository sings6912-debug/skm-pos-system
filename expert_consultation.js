(function() {
    console.log("💬 Menu Expert Consultation & Pharmacist Advice Plugin Initialized!");

    function openConsultModal() {
        if(document.getElementById('skmConsultModal')) {
            document.getElementById('skmConsultModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmConsultModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">💬</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #10b981;">សាកសួរព័ត៌មាន & ប្រឹក្សាយោបល់</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">មានចម្ងល់ពីផលិតផល ឬត្រូវការជំនួយពីអ្នកជំនាញ/ឱសថការី?</p>
                
                <textarea id="consultQueryText" placeholder="សរសេរសំណួរ ឬបញ្ហារបស់អ្នកនៅទីនេះ..." style="width: 100%; height: 80px; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-family: 'Battambang'; font-size: 12px; resize: none; outline: none; margin-bottom: 15px;"></textarea>

                <button class="btn-act btn-green" style="width: 100%; background: #10b981; margin-bottom: 10px;" onclick="window.submitConsultQuery()">📤 ផ្ញើសំណួរទៅហាង</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmConsultModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.submitConsultQuery = function() {
        const txt = document.getElementById('consultQueryText').value.trim();
        if(!txt) { alert('សូមសរសេរសំណួររបស់អ្នកសិន!'); return; }
        
        let queries = JSON.parse(localStorage.getItem('skm_consult_queries') || '[]');
        queries.unshift({
            question: txt,
            time: new Date().toLocaleString('km-KH'),
            status: 'pending'
        });
        localStorage.setItem('skm_consult_queries', JSON.stringify(queries));

        document.getElementById('consultQueryText').value = '';
        document.getElementById('skmConsultModal').style.display = 'none';
        if (typeof showToast === 'function') showToast('បានផ្ញើសំណួរជូនអ្នកលក់ជោគជ័យ!');
        else alert('បានផ្ញើសំណួរជូនអ្នកលក់ជោគជ័យ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('💬', 'ប្រឹក្សាយោបល់ / សាកសួរព័ត៌មាន', openConsultModal);
            clearInterval(initInt);
        }
    }, 500);
})();