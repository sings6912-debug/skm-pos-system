(function() {
    console.log("📅 Menu Table Reservation Plugin Initialized!");

    function openReservationModal() {
        if(document.getElementById('skmResModal')) {
            document.getElementById('skmResModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmResModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">📅</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">កក់តុល่วงหน้า (Table Reservation)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">បំពេញព័ត៌មានដើម្បីកក់តុសម្រាប់មកពិសា៖</p>
                
                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">ឈ្មោះអ្នកកក់:</div>
                <input type="text" id="resName" placeholder="ឈ្មោះរបស់អ្នក..." style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 12px; outline: none; margin-bottom: 10px; font-family:'Battambang';">

                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">លេខទូរស័ព្ទ:</div>
                <input type="text" id="resPhone" placeholder="012 345 678" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 12px; outline: none; margin-bottom: 10px; font-family:'Battambang';">

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
                    <div style="text-align:left;">
                        <label style="font-size:11px; font-weight:bold; color:var(--text-muted); display:block; margin-bottom:4px;">ចំនួនភ្ញៀវ:</label>
                        <input type="number" id="resGuests" value="2" min="1" style="width:100%; background:var(--store-bg); color:var(--text-dark); border:1px solid var(--border-color); padding:8px; border-radius:8px; font-size:12px; outline:none;">
                    </div>
                    <div style="text-align:left;">
                        <label style="font-size:11px; font-weight:bold; color:var(--text-muted); display:block; margin-bottom:4px;">ម៉ោងចូលមក:</label>
                        <input type="time" id="resTime" value="18:00" style="width:100%; background:var(--store-bg); color:var(--text-dark); border:1px solid var(--border-color); padding:8px; border-radius:8px; font-size:12px; outline:none;">
                    </div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #38bdf8; margin-bottom: 10px;" onclick="window.submitTableReservation()">📥 បញ្ជូនការកក់តុ</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmResModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.submitTableReservation = function() {
        const name = document.getElementById('resName').value.trim();
        const phone = document.getElementById('resPhone').value.trim();
        const guests = document.getElementById('resGuests').value;
        const time = document.getElementById('resTime').value;

        if(!name || !phone) { alert('សូមបំពេញឈ្មោះ និងលេខទូរស័ព្ទឱ្យបានត្រឹមត្រូវ!'); return; }

        let reservations = JSON.parse(localStorage.getItem('skm_table_reservations') || '[]');
        reservations.unshift({
            id: 'RES-' + Date.now().toString().slice(-4),
            name: name,
            phone: phone,
            guests: guests,
            time: time,
            date: new Date().toLocaleDateString('km-KH'),
            status: 'pending'
        });
        localStorage.setItem('skm_table_reservations', JSON.stringify(reservations));

        document.getElementById('skmResModal').style.display = 'none';
        if (typeof showToast === 'function') showToast('ការកក់តុរបស់អ្នកត្រូវបានបញ្ជូនជោគជ័យ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📅', 'កក់តុល่วงหน้า (Reservation)', openReservationModal);
            clearInterval(initInt);
        }
    }, 500);
})();