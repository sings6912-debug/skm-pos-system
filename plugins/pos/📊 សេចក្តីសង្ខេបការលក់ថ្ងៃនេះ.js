(function() {
    console.log("📊 POS Premium Daily Summary Plugin Initialized!");

    // មុខងាររាប់លេខឱ្យមានចលនា (Number Counter Animation)
    function animateValue(obj, start, end, duration, isCurrency = false) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // ប្រើ ease-out effect ដើម្បីឱ្យវារត់លឿនរួចយឺតនៅចុងបញ្ចប់
            const easeProgress = 1 - Math.pow(1 - progress, 3); 
            const currentVal = (progress * (end - start) + start);
            
            if (isCurrency) {
                obj.innerHTML = '$' + currentVal.toFixed(2);
            } else {
                obj.innerHTML = Math.floor(currentVal);
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = isCurrency ? '$' + end.toFixed(2) : end;
            }
        };
        window.requestAnimationFrame(step);
    }

    window.openDailySummary = function() {
        let modal = document.getElementById('skm-premium-daily-modal');
        
        if(!modal) {
            // បន្ថែម CSS Animations និង UI លំដាប់ខ្ពស់
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9); opacity: 0; filter: blur(10px); }
                    100% { transform: scale(1); opacity: 1; filter: blur(0); }
                }
                
                .skm-summary-glass {
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);
                }
                
                .skm-stat-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    transition: transform 0.2s;
                }
                .skm-stat-card:hover {
                    transform: translateY(-2px);
                    background: rgba(255, 255, 255, 0.05);
                }
                
                .skm-stat-icon {
                    width: 45px; height: 45px;
                    border-radius: 12px;
                    display: flex; justify-content: center; align-items: center;
                    font-size: 20px;
                }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skm-premium-daily-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.6); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif;
            `;
            
            modal.innerHTML = `
                <div class="skm-summary-glass" style="color: white; padding: 30px; width: 100%; max-width: 400px; animation: skmModalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
                    
                    <!-- Header -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                        <div>
                            <h3 style="color:#fff; margin:0; font-size:18px; font-weight: 600; display:flex; align-items:center; gap:8px;">
                                <span style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">📊 របាយការណ៍ថ្ងៃនេះ</span>
                            </h3>
                            <div id="skm-summary-date" style="color:#94a3b8; font-size:12px; margin-top:4px;">...</div>
                        </div>
                        <button id="skm-btn-close-summary" style="background:rgba(255,255,255,0.1); border:none; color:#fff; width:32px; height:32px; border-radius:50%; cursor:pointer; font-weight:bold; transition:0.2s;">✕</button>
                    </div>
                    
                    <!-- Content (Stat Cards) -->
                    <div style="display:flex; flex-direction:column; gap:15px; margin-bottom:30px;">
                        
                        <!-- កាតចំនួនវិក្កយបត្រ -->
                        <div class="skm-stat-card">
                            <div class="skm-stat-icon" style="background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.2);">🧾</div>
                            <div style="flex:1;">
                                <div style="color: #94a3b8; font-size: 13px; margin-bottom: 2px;">ចំនួនវិក្កយបត្រលក់ចេញ</div>
                                <div style="color: #fff; font-size: 20px; font-weight: 600; font-family: 'Arial', sans-serif;"><span id="skm-val-inv">0</span></div>
                            </div>
                        </div>
                        
                        <!-- កាតចំនួនទំនិញ -->
                        <div class="skm-stat-card">
                            <div class="skm-stat-icon" style="background: rgba(167, 139, 250, 0.1); color: #a78bfa; border: 1px solid rgba(167, 139, 250, 0.2);">📦</div>
                            <div style="flex:1;">
                                <div style="color: #94a3b8; font-size: 13px; margin-bottom: 2px;">ចំនួនទំនិញលក់ដាច់សរុប</div>
                                <div style="color: #fff; font-size: 20px; font-weight: 600; font-family: 'Arial', sans-serif;"><span id="skm-val-qty">0</span></div>
                            </div>
                        </div>
                        
                        <!-- កាតចំណូលសរុប (Highlight) -->
                        <div class="skm-stat-card" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.05)); border: 1px solid rgba(16, 185, 129, 0.3);">
                            <div class="skm-stat-icon" style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); font-size: 24px;">💵</div>
                            <div style="flex:1;">
                                <div style="color: #10b981; font-size: 13px; margin-bottom: 2px; font-weight: 600;">ចំណូលសរុបប្រចាំថ្ងៃ</div>
                                <div style="color: #10b981; font-size: 28px; font-weight: 700; font-family: 'Arial', sans-serif; text-shadow: 0 0 15px rgba(16, 185, 129, 0.4);"><span id="skm-val-rev">$0.00</span></div>
                            </div>
                        </div>

                    </div>
                    
                    <button id="skm-btn-close-summary-full" style="width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; padding:12px; border-radius:12px; font-family:'Battambang'; cursor:pointer; font-weight:500; transition:0.2s;">បិទរបាយការណ៍</button>
                </div>
            `;
            document.body.appendChild(modal);

            // មុខងារបិទ Modal
            const closeFunc = () => {
                modal.style.opacity = '0';
                modal.style.pointerEvents = 'none';
                setTimeout(() => { modal.style.display = 'none'; }, 300);
            };

            document.getElementById('skm-btn-close-summary').addEventListener('click', closeFunc);
            document.getElementById('skm-btn-close-summary-full').addEventListener('click', closeFunc);
            
            // Hover effect លើប៊ូតុងបិទ
            const btnClose = document.getElementById('skm-btn-close-summary');
            btnClose.onmouseover = () => btnClose.style.background = '#ef4444';
            btnClose.onmouseout = () => btnClose.style.background = 'rgba(255,255,255,0.1)';
            
            const btnCloseFull = document.getElementById('skm-btn-close-summary-full');
            btnCloseFull.onmouseover = () => btnCloseFull.style.background = 'rgba(255,255,255,0.1)';
            btnCloseFull.onmouseout = () => btnCloseFull.style.background = 'rgba(255,255,255,0.05)';
        } else {
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            modal.style.pointerEvents = 'auto';
            // បញ្ជាឱ្យ Animation លោតម្តងទៀត
            const glassPanel = modal.querySelector('.skm-summary-glass');
            glassPanel.style.animation = 'none';
            void glassPanel.offsetWidth;
            glassPanel.style.animation = 'skmModalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        }

        calcAndAnimateSum();
    };

    function calcAndAnimateSum() {
        // ទាញកាលបរិច្ឆេទថ្ងៃនេះ និងបង្ហាញនៅលើ Header
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('skm-summary-date').innerText = now.toLocaleDateString('km-KH', options);

        // ការទាញយកទិន្នន័យ (គាំទ្រទម្រង់កាលបរិច្ឆេទច្រើនប្រភេទ)
        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_invoices_pro`) || '[]');
        
        const todayStr1 = now.toLocaleDateString(); 
        const todayStr2 = now.toISOString().split('T')[0]; // YYYY-MM-DD
        
        let count = 0, totalRev = 0, itemsCount = 0;
        
        invoices.forEach(inv => {
            let invDate = inv.date ? inv.date.split(' ')[0] : '';
            // ផ្ទៀងផ្ទាត់កាលបរិច្ឆេទឱ្យបានច្បាស់លាស់
            if (inv.status === 'paid' && (invDate === todayStr1 || invDate === todayStr2 || (inv.date && inv.date.includes(todayStr2)))) {
                count++;
                totalRev += parseFloat(inv.totalAmount || 0);
                if (inv.items) {
                    inv.items.forEach(it => itemsCount += (parseInt(it.cartQty || it.qty) || 1));
                }
            }
        });

        // ចាប់ផ្តើមចលនាលោតលេខ (Animation Duration: 1វិនាទី)
        const elInv = document.getElementById('skm-val-inv');
        const elQty = document.getElementById('skm-val-qty');
        const elRev = document.getElementById('skm-val-rev');

        animateValue(elInv, 0, count, 1000, false);
        animateValue(elQty, 0, itemsCount, 1000, false);
        animateValue(elRev, 0, totalRev, 1200, true); // លុយលោតយូរជាងគេបន្តិចដើម្បីទាក់ទាញ
    }

    // ភ្ជាប់ជាមួយប្រព័ន្ធ Custom Tool
    let attempts = 0;
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📊', 'របាយការណ៍ថ្ងៃនេះ', window.openDailySummary);
            clearInterval(initInt);
            console.log("✅ Premium Daily Summary successfully registered!");
        }
        attempts++;
        if(attempts > 20) clearInterval(initInt);
    }, 500);
})();