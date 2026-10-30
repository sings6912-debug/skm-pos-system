(function() {
    console.log("📊 POS Monthly Staff Attendance Report Plugin Initialized!");

    // 🌟 បង្កប់ CSS ផ្ទាល់ខ្លួនសម្រាប់ Modal ឱ្យមានសោភ័ណភាពស្អាតទំនើប
    if (!document.getElementById('skm-monthly-report-style')) {
        const style = document.createElement('style');
        style.id = 'skm-monthly-report-style';
        style.innerHTML = `
            .skm-mr-bg {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
                z-index: 100000; display: flex; justify-content: center; align-items: center;
                font-family: 'Battambang', sans-serif; opacity: 0; transition: opacity 0.3s ease;
                pointer-events: none;
            }
            .skm-mr-bg.skm-show {
                opacity: 1; pointer-events: auto;
            }
            .skm-mr-content {
                background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b);
                max-width: 650px; width: 94%; padding: 25px; border-radius: 28px;
                max-height: 90vh; display: flex; flex-direction: column;
                box-shadow: 0 25px 60px -15px rgba(0,0,0,0.3);
                transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid var(--border-color, #e2e8f0);
            }
            .skm-mr-bg.skm-show .skm-mr-content {
                transform: translateY(0) scale(1);
            }
            .skm-mr-table {
                width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px;
            }
            .skm-mr-table th, .skm-mr-table td {
                border: 1px solid var(--border-color, #e2e8f0); padding: 10px 12px; text-align: left;
            }
            .skm-mr-table th {
                background: var(--store-bg, #f8fafc); font-weight: 900; color: var(--text-dark, #1e293b);
            }
        `;
        document.head.appendChild(style);
    }

    function openMonthlyReportModal() {
        let modal = document.getElementById('skmMonthlyReportModal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('skm-show'), 10);
            populateMonthYearSelectors();
            loadMonthlyReportData();
            return;
        }

        modal = document.createElement('div');
        modal.className = 'skm-mr-bg';
        modal.id = 'skmMonthlyReportModal';
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('skm-show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        modal.innerHTML = `
            <div class="skm-mr-content" onclick="event.stopPropagation()">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border-color, #e2e8f0); padding-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width: 42px; height: 42px; background: rgba(59, 130, 246, 0.12); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                            📊
                        </div>
                        <div>
                            <h3 style="color:var(--text-dark, #1e293b); margin:0; font-size:16px; font-weight:900;">របាយការណ៍ម៉ោងការងារប្រចាំខែ</h3>
                            <div style="font-size:11px; color:var(--text-muted, #64748b); font-weight:700;">Monthly Staff Attendance Report</div>
                        </div>
                    </div>
                    <div onclick="document.getElementById('skmMonthlyReportModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmMonthlyReportModal').style.display='none', 300);" style="color: var(--text-muted, #9ca3af); font-size: 16px; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; background: var(--store-bg, #f1f5f9); display: flex; align-items: center; justify-content: center; font-weight: bold;">✕</div>
                </div>
                
                <!-- Filter Controls -->
                <div style="display:flex; gap:10px; margin-bottom:15px; flex-wrap:wrap;">
                    <div style="flex:1; min-width: 140px;">
                        <label style="font-size:11px; display:block; margin-bottom:4px; font-weight:800; color:var(--text-muted);">ជ្រើសរើសខែ៖</label>
                        <select id="skmFilterMonth" class="input-st" style="margin-bottom:0; padding:10px; font-size:13px; cursor:pointer;" onchange="window.loadMonthlyReportData()">
                            <option value="0">មករា (January)</option>
                            <option value="1">កុម្ភៈ (February)</option>
                            <option value="2">មីនា (March)</option>
                            <option value="3">មេសា (April)</option>
                            <option value="4">ឧសភា (May)</option>
                            <option value="5">មិថុនា (June)</option>
                            <option value="6">កក្កដា (July)</option>
                            <option value="7">សីហា (August)</option>
                            <option value="8">កញ្ញា (September)</option>
                            <option value="9">តុលា (October)</option>
                            <option value="10">វិច្ឆិកា (November)</option>
                            <option value="11">ធ្នូ (December)</option>
                        </select>
                    </div>
                    <div style="width: 120px;">
                        <label style="font-size:11px; display:block; margin-bottom:4px; font-weight:800; color:var(--text-muted);">ឆ្នាំ៖</label>
                        <select id="skmFilterYear" class="input-st" style="margin-bottom:0; padding:10px; font-size:13px; cursor:pointer;" onchange="window.loadMonthlyReportData()">
                            <option value="${currentYear}">${currentYear}</option>
                            <option value="${currentYear-1}">${currentYear-1}</option>
                            <option value="${currentYear-2}">${currentYear-2}</option>
                        </select>
                    </div>
                </div>

                <!-- Report Container -->
                <div id="skmMonthlyReportContainer" style="flex:1; overflow-y:auto; max-height:45vh; padding-right:5px; margin-bottom:15px;">
                    <!-- Table inject here -->
                </div>

                <div style="display:flex; gap:12px; border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 15px;">
                    <button style="flex:1; border:1px solid var(--border-color, #e2e8f0); color:var(--text-dark, #1e293b); border-radius:14px; padding:12px; font-weight:bold; cursor:pointer; background:transparent; font-family:'Battambang'; font-size:13px;" onclick="document.getElementById('skmMonthlyReportModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmMonthlyReportModal').style.display='none', 300);">បិទ</button>
                    <button style="flex:1; background:linear-gradient(135deg, #3b82f6, #2563eb); color:white; border:none; border-radius:14px; padding:12px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.35); font-family:'Battambang'; font-size:13px;" onclick="window.printMonthlyReport()">🖨️ បោះពុម្ពរបាយការណ៍</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('skm-show'), 10);
        
        populateMonthYearSelectors();
        loadMonthlyReportData();
    }

    function populateMonthYearSelectors() {
        const monthSel = document.getElementById('skmFilterMonth');
        if(monthSel) {
            monthSel.value = new Date().getMonth();
        }
    }

    window.loadMonthlyReportData = function() {
        const container = document.getElementById('skmMonthlyReportContainer');
        if(!container) return;

        const monthSel = document.getElementById('skmFilterMonth');
        const yearSel = document.getElementById('skmFilterYear');
        
        const targetMonth = monthSel ? parseInt(monthSel.value) : new Date().getMonth();
        const targetYear = yearSel ? parseInt(yearSel.value) : new Date().getFullYear();

        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        let allLogs = JSON.parse(localStorage.getItem(`ks2_${branchId}_time_clock`) || '[]');

        let filteredLogs = allLogs.filter(l => {
            if (l.id && l.id.startsWith('TC-')) {
                let timestamp = parseInt(l.id.replace('TC-', ''));
                if (!isNaN(timestamp)) {
                    let d = new Date(timestamp);
                    return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
                }
            }
            return true;
        });

        if (filteredLogs.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:13px; font-weight:800;">📉 គ្មានទិន្នន័យម៉ោងការងារសម្រាប់ខែនេះទេ</div>';
            return;
        }

        // Group logs by staff and calculate total working hours
        let staffSummary = {};
        let logsByStaff = {};
        
        filteredLogs.forEach(l => {
            if (!logsByStaff[l.staffName]) logsByStaff[l.staffName] = [];
            logsByStaff[l.staffName].push(l);
        });

        for (let name in logsByStaff) {
            // Sort logs chronologically (oldest to newest)
            let sLogs = [...logsByStaff[name]].sort((a, b) => {
                let tA = a.id && a.id.startsWith('TC-') ? parseInt(a.id.replace('TC-', '')) : 0;
                let tB = b.id && b.id.startsWith('TC-') ? parseInt(b.id.replace('TC-', '')) : 0;
                return tA - tB;
            });

            let totalWorkMs = 0;
            let lastInTime = null;
            let punchInCount = 0;
            let punchOutCount = 0;
            let breakCount = 0;

            sLogs.forEach(l => {
                let t = l.id && l.id.startsWith('TC-') ? parseInt(l.id.replace('TC-', '')) : Date.now();
                if (l.action.includes('In')) {
                    punchInCount++;
                    lastInTime = t;
                } else if (l.action.includes('Out')) {
                    punchOutCount++;
                    if (lastInTime) {
                        totalWorkMs += (t - lastInTime);
                        lastInTime = null;
                    }
                } else if (l.action.includes('សម្រាក')) {
                    breakCount++;
                    if (lastInTime) {
                        totalWorkMs += (t - lastInTime);
                        lastInTime = null;
                    }
                } else if (l.action.includes('វិញ')) {
                    lastInTime = t;
                }
            });

            let totalHours = (totalWorkMs / (1000 * 60 * 60)).toFixed(1);

            staffSummary[name] = {
                punchIn: punchInCount,
                punchOut: punchOutCount,
                breaks: breakCount,
                totalHours: totalHours
            };
        }

        let summaryCardsHtml = `
            <div style="font-size:13px; font-weight:900; color:var(--text-dark); margin-bottom:8px;">📌 តារាងសង្ខេបម៉ោងការងារសរុបតាមបុគ្គលិក៖</div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin-bottom:15px;">
        `;

        for (let name in staffSummary) {
            let s = staffSummary[name];
            summaryCardsHtml += `
                <div class="skm-mr-sum-card">
                    <div style="font-weight:900; color:#3b82f6; font-size:14px; margin-bottom:2px;">👤 ${name}</div>
                    <div style="font-size:14px; font-weight:900; color:#10b981; margin-bottom:6px;">⏱️ ម៉ោងសរុប: ${s.totalHours} ម៉ោង</div>
                    <div style="font-size:11px; color:var(--text-muted); display:flex; gap:8px; font-weight:bold;">
                        <span>📥 ចូល: ${s.punchIn}</span>
                        <span>📤 ចេញ: ${s.punchOut}</span>
                        <span>☕ សម្រាក: ${s.breaks}</span>
                    </div>
                </div>
            `;
        }
        summaryCardsHtml += `</div>`;

        container.innerHTML = `
            ${summaryCardsHtml}
            <div style="font-size:13px; font-weight:900; color:var(--text-dark); margin-bottom:8px;">📋 ប្រវត្តិសកម្មភាពលម្អិត៖</div>
            <table class="skm-mr-table">
                <thead>
                    <tr>
                        <th>ល.រ</th>
                        <th>ឈ្មោះបុគ្គលិក</th>
                        <th>សកម្មភាព (Action)</th>
                        <th>កាលបរិច្ឆេទ & ម៉ោង</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredLogs.map((l, i) => `
                        <tr>
                            <td style="text-align:center; width:40px;">${i+1}</td>
                            <td style="font-weight:900;">👤 ${l.staffName}</td>
                            <td><span style="font-weight:bold; color:${l.action.includes('In')?'#10b981':l.action.includes('Out')?'#ef4444':'#f59e0b'};">${l.action}</span></td>
                            <td>⏱️ ${l.time}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    };

    window.printMonthlyReport = function() {
        const monthSel = document.getElementById('skmFilterMonth');
        const yearSel = document.getElementById('skmFilterYear');
        const monthName = monthSel ? monthSel.options[monthSel.selectedIndex].text : '';
        const yearVal = yearSel ? yearSel.value : '';

        const container = document.getElementById('skmMonthlyReportContainer').innerHTML;
        const branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';

        const printWin = window.open('', '_blank', 'width=650,height=750');
        printWin.document.write(`
            <html>
            <head>
                <title>Monthly Attendance Report - ${monthName} ${yearVal}</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Battambang', sans-serif; padding: 25px; color: #1e293b; background: #ffffff; margin: 0; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    h2 { text-align: center; color: #3b82f6; font-size: 20px; font-weight: 900; margin-bottom: 5px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;}
                    p.subtitle { text-align: center; font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 25px; font-weight: bold;}
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th, td { border: 1px solid #cbd5e1; padding: 10px 12px; font-size: 12px; text-align: left; }
                    th { background: #f8fafc; font-weight: 900; }
                </style>
            </head>
            <body>
                <h2>📊 របាយការណ៍ម៉ោងការងារប្រចាំខែ</h2>
                <p class="subtitle">ខែ៖ ${monthName} ឆ្នាំ ${yearVal} | សាខា៖ ${branchId}</p>
                <div>${container}</div>
                <div style="text-align:center; font-size:11px; color:#94a3b8; margin-top:50px;">បោះពុម្ពចេញពីប្រព័ន្ធគិតលុយ POS ហាងកាហ្វេ</div>
            </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); printWin.close(); }, 600);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📊', 'របាយការណ៍ម៉ោងការងារប្រចាំខែ', openMonthlyReportModal);
            clearInterval(initInt);
        }
    }, 300);
})();