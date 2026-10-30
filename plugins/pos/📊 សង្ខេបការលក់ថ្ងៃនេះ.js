(function() {
    console.log("📊 POS Premium Ultra-Compact Daily Summary Initialized!");
    
    // មុខងាររាប់លេខឱ្យមានចលនា (គាំទ្រលេខធម្មតា, USD និង KHR)
    function animateValue(obj, start, end, duration, format = 'INT') {
        let startTimestamp = null;
        const formatNumber = (val, fmt) => {
            if (fmt === 'USD') return '$' + val.toFixed(2);
            if (fmt === 'KHR') return Math.floor(val).toLocaleString('en-US') + ' ៛';
            return Math.floor(val); // សម្រាប់ចំនួនវិក្កយបត្រ និងទំនិញ
        };

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // រត់លឿន រួចយឺតនៅចុងបញ្ចប់
            const currentVal = (easeProgress * (end - start) + start);
            
            obj.innerHTML = formatNumber(currentVal, format);
            
            if (progress < 1) window.requestAnimationFrame(step);
            else obj.innerHTML = formatNumber(end, format);
        };
        window.requestAnimationFrame(step);
    }

    window.skmCloseDailySummary = function() {
        const modal = document.getElementById('skmDailyModal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-sum-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    };

    function openDailySummary() {
        let modal = document.getElementById('skmDailyModal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-sum-glass, .skm-sum-glass * { box-sizing: border-box; }
                
                .skm-sum-glass {
                    background: var(--bg-card, #ffffff);
                    color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 400px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-sum-glass {
                        background: var(--bg-card, #1e293b);
                        color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-stat-box {
                    padding: 12px; border-radius: 12px;
                    background: var(--bg-alt, #f8fafc);
                    border: 1px solid var(--border, rgba(128,128,128,0.15));
                    text-align: center; display: flex; flex-direction: column; justify-content: center;
                }
                @media (prefers-color-scheme: dark) { .skm-stat-box { background: var(--bg-alt, rgba(255,255,255,0.05)); } }
                
                .skm-stat-rev {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(56, 189, 248, 0.05));
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skmDailyModal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                backdrop-filter: blur(3px); opacity: 0; transition: opacity 0.3s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-sum-glass">
                    <!-- ក្បាល (Header) -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <div>
                            <h3 style="margin:0; font-size:16px; font-weight:600; display:flex; align-items:center; gap:6px;">
                                <span style="color:#0ea5e9; font-size: 18px;">📊</span> សង្ខេបការលក់ថ្ងៃនេះ
                            </h3>
                            <div id="skm-sum-date" style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-top: 2px;">...</div>
                        </div>
                        <div onclick="window.skmCloseDailySummary()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:26px; height:26px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                    </div>

                    <!-- ជួរទី១: ចំនួនវិក្កយបត្រ និង ទំនិញ -->
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <div class="skm-stat-box" style="flex: 1;">
                            <div style="font-size: 11px; color: #0ea5e9; font-weight: bold; margin-bottom: 4px;">🧾 វិក្កយបត្រចេញ</div>
                            <div id="skm-val-inv" style="font-size: 20px; font-weight: bold; font-family: 'Arial'; color: var(--text-main);">0</div>
                        </div>
                        <div class="skm-stat-box" style="flex: 1;">
                            <div style="font-size: 11px; color: #a78bfa; font-weight: bold; margin-bottom: 4px;">📦 ទំនិញលក់ដាច់</div>
                            <div id="skm-val-qty" style="font-size: 20px; font-weight: bold; font-family: 'Arial'; color: var(--text-main);">0</div>
                        </div>
                    </div>

                    <!-- ជួរទី២: ចំណូលសរុប (USD + KHR) -->
                    <div class="skm-stat-box skm-stat-rev" style="margin-bottom: 15px;">
                        <div style="font-size: 12px; color: #10b981; font-weight: bold; margin-bottom: 4px;">💵 ចំណូលសរុបប្រចាំថ្ងៃ (Total Revenue)</div>
                        <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 5px;">
                            <span id="skm-val-rev-usd" style="font-size: 24px; font-weight: 800; font-family: 'Arial'; color: #10b981;">$0.00</span>
                            <span style="color: rgba(16, 185, 129, 0.3); font-size: 16px;">|</span>
                            <span id="skm-val-rev-khr" style="font-size: 16px; font-weight: 600; font-family: 'Arial'; color: #0ea5e9;">0 ៛</span>
                        </div>
                    </div>
                    
                    <button onclick="window.skmCloseDailySummary()" style="width:100%; background:var(--bg-alt, #f8fafc); border:1px solid var(--border, rgba(128,128,128,0.15)); color:inherit; padding:10px; border-radius:10px; font-family:'Battambang'; cursor:pointer; font-weight:600; font-size:13px; transition:0.2s;" onmouseover="this.style.background='rgba(128,128,128,0.1)';">បិទរបាយការណ៍</button>
                </div>
            `;
            document.body.appendChild(modal);

            // ចុចខាងក្រៅ និង Esc ដើម្បីបិទ
            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseDailySummary(); });
            document.addEventListener('keydown', function(e) { if(e.key === 'Escape' && modal.style.display !== 'none') window.skmCloseDailySummary(); });
            
        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-sum-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        setTimeout(() => { modal.style.opacity = '1'; }, 50);
        window.calculateDailySummary();
    }

    // អថេរទុកសម្រាប់កុំឱ្យវាលោត Animation ញឹកញាប់បើទិន្នន័យនៅដដែល
    let curInv = 0, curQty = 0, curRevUsd = 0;

    window.calculateDailySummary = function() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('skm-sum-date').innerText = now.toLocaleDateString('km-KH', options);

        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_invoices_pro`) || '[]');
        
        const todayStr1 = now.toLocaleDateString(); 
        const todayStr2 = now.toISOString().split('T')[0];
        const exchangeRate = window.EXCHANGE_RATE || 4000; // យក ៤០០០ ជាស្តង់ដារប្តូរប្រាក់ បើគ្មានកំណត់ក្នុងប្រព័ន្ធ
        
        let count = 0, totalRevUsd = 0, itemsCount = 0;
        
        invoices.forEach(inv => {
            let invDate = inv.date ? inv.date.split(' ')[0] : '';
            if (inv.status === 'paid' && (invDate === todayStr1 || invDate === todayStr2 || (inv.date && inv.date.includes(todayStr2)))) {
                count++;
                totalRevUsd += parseFloat(inv.totalAmount || 0);
                if (inv.items) {
                    inv.items.forEach(it => itemsCount += (parseInt(it.cartQty || it.qty) || 1));
                }
            }
        });

        let totalRevKhr = totalRevUsd * exchangeRate;

        // ចាប់ផ្តើម Animation
        const elInv = document.getElementById('skm-val-inv');
        const elQty = document.getElementById('skm-val-qty');
        const elRevUsd = document.getElementById('skm-val-rev-usd');
        const elRevKhr = document.getElementById('skm-val-rev-khr');

        if(count !== curInv) { animateValue(elInv, curInv, count, 800, 'INT'); curInv = count; }
        if(itemsCount !== curQty) { animateValue(elQty, curQty, itemsCount, 800, 'INT'); curQty = itemsCount; }
        
        if(totalRevUsd !== curRevUsd) { 
            animateValue(elRevUsd, curRevUsd, totalRevUsd, 1000, 'USD'); 
            animateValue(elRevKhr, curRevUsd * exchangeRate, totalRevKhr, 1000, 'KHR');
            curRevUsd = totalRevUsd; 
        } else {
            // បើទិន្នន័យដដែល បង្ហាញយកតែម្តងអត់លេងចលនា
            elRevUsd.innerText = '$' + totalRevUsd.toFixed(2);
            elRevKhr.innerText = Math.floor(totalRevKhr).toLocaleString('en-US') + ' ៛';
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📊', 'របាយការណ៍ថ្ងៃនេះ', openDailySummary);
            clearInterval(initInt);
            console.log("✅ Premium Ultra-Compact Daily Summary successfully registered!");
        }
    }, 500);
})();