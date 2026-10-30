(function() {
    console.log("⏰ Menu Medication & Vitamin Reminder Plugin Initialized!");

    function openMedAlarmModal() {
        if(document.getElementById('skmMedAlarmModal')) {
            document.getElementById('skmMedAlarmModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmMedAlarmModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">⏰</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #38bdf8;">មគ្គុទ្ទេសក៍ដាស់តឿនលេបថ្នាំ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">គន្លឹះក្នុងការកំណត់ម៉ោងเตือนខ្លួនឯងឱ្យលេបថ្នាំ ឬវីតាមីន៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <div style="background: rgba(56,189,248,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #38bdf8; display: block; margin-bottom: 2px;">🌅 ពេលព្រឹក (07:00 AM)</b>
                        <span style="color: var(--text-muted);">ថ្នាំ ឬវីតាមីនញ៉ាំក្រោយពេលអាហារពេលព្រឹកភ្លាម។</span>
                    </div>
                    <div style="background: rgba(245,158,11,0.08); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <b style="color: #f59e0b; display: block; margin-bottom: 2px;">🌙 ពេលល្ងាច / មុនគេង (08:00 PM)</b>
                        <span style="color: var(--text-muted);">ថ្នាំបំបាត់ការឈឺចាប់ ឬថ្នាំពង្រឹងសុខភាពពេលយប់។</span>
                    </div>
                </div>

                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 15px; background: rgba(128,128,128,0.08); padding: 10px; border-radius: 8px; text-align: left;">
                    💡 អ្នកអាចប្រើប្រាស់កម្មវិធីนาฬิกา (Clock Alarm) ក្នុងទូរស័ព្ទដៃរបស់អ្នកដើម្បីកំណត់ម៉ោងเตือน។
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmMedAlarmModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('⏰', 'មគ្គុទ្ទេសក៍ដាស់តឿនលេបថ្នាំ (Alarm Guide)', openMedAlarmModal);
            clearInterval(initInt);
        }
    }, 500);
})();