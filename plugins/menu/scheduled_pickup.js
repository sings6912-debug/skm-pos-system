(function() {
    console.log("⏰ Menu Scheduled Pickup & Arrival Time Plugin Initialized!");

    function openSchedulePickupModal() {
        if(document.getElementById('skmScheduleModal')) {
            document.getElementById('skmScheduleModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmScheduleModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        let savedTime = localStorage.getItem('skm_scheduled_pickup_time') || '15 នាទីទៀត (15 mins)';

        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">⏰</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">កុម្មង់ទុកមុន & កំណត់ម៉ោងមកយក</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">តើលោកអ្នកចង់មកយកទំនិញនៅពេលណា?</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
                    <button class="skm-sched-btn" onclick="window.setPickupTime('10 នាទីទៀត')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">⚡ មកយកក្នុងពេល ១០ នាទីទៀត</button>
                    <button class="skm-sched-btn" onclick="window.setPickupTime('20 នាទីទៀត')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">⚡ មកយកក្នុងពេល ២០ នាទីទៀត</button>
                    <button class="skm-sched-btn" onclick="window.setPickupTime('30 នាទីទៀត')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">⏰ មកយកក្នុងពេល ៣០ នាទីទៀត</button>
                    <button class="skm-sched-btn" onclick="window.setPickupTime('1 ម៉ោងទៀត')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; text-align: left;">🕐 មកយកក្នុងពេល ១ ម៉ោងទៀត</button>
                </div>

                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 4px;">ឬកំណត់ម៉ោងជាក់លាក់៖</div>
                <input type="time" id="schedCustomTime" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-size: 14px; outline: none; margin-bottom: 15px; font-family:'Battambang';" onchange="window.setCustomPickupTime(this.value)">

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmScheduleModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.setPickupTime = function(timeText) {
        localStorage.setItem('skm_scheduled_pickup_time', timeText);
        updateCartNoteWithSchedule(timeText);
        document.getElementById('skmScheduleModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`បានកំណត់ម៉ោងមកយក: ${timeText}`);
    };

    window.setCustomPickupTime = function(timeVal) {
        if (!timeVal) return;
        let text = `មកយកនៅម៉ោង ${timeVal}`;
        localStorage.setItem('skm_scheduled_pickup_time', text);
        updateCartNoteWithSchedule(text);
        document.getElementById('skmScheduleModal').style.display = 'none';
        if (typeof showToast === 'function') showToast(`បានកំណត់ម៉ោងមកយក: ${text}`);
    };

    function updateCartNoteWithSchedule(scheduleText) {
        const noteInput = document.getElementById('cNote');
        if (!noteInput) return;

        let currentVal = noteInput.value.replace(/\[មកយកម៉ោង:.*?\]/g, '').trim();
        noteInput.value = `[មកយកម៉ោង: ${scheduleText}] ${currentVal}`.trim();
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('⏰', 'កុម្មង់ទុកមុន & កំណត់ម៉ោងមកយក', openSchedulePickupModal);
            clearInterval(initInt);
        }
    }, 500);
})();