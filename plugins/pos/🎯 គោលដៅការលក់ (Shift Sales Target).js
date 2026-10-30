/* STREAMING_CHUNK:Initializing Modern Sales Target Plugin... */
(function() {
    console.log("🎯 POS Modern Shift Sales Target Tracker Plugin Initialized!");

    /* STREAMING_CHUNK:Building Refined Minimalist UI... */
    function openTargetModal() {
        if(document.getElementById('skmTargetModal')) {
            document.getElementById('skmTargetModal').style.display = 'flex';
            window.calcTargetProgress();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmTargetModal';
        // Glassmorphism Backdrop
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        /* STREAMING_CHUNK:Injecting Clean CSS and Modern HTML Layout... */
        modal.innerHTML = `
            <style>
                /* Remove Number Spinners */
                .skm-tgt-input::-webkit-inner-spin-button, 
                .skm-tgt-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                .skm-tgt-input { -moz-appearance: textfield; }

                .skm-tgt-box { background: var(--bg-card, #ffffff); color: var(--text-main, #1e293b); padding: 25px; border-radius: 20px; width: 100%; max-width: 420px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.2); border: 1px solid var(--border, #e2e8f0); display: flex; flex-direction: column; gap: 14px; box-sizing: border-box; }
                .skm-tgt-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border, #f1f5f9); padding-bottom: 12px; margin-bottom: 5px; }
                
                .skm-tgt-input { font-size: 20px; font-weight: 800; text-align: center; padding: 12px; border-radius: 10px; border: 1.5px solid #cbd5e1; width: 100%; transition: all 0.2s ease; color: #0ea5e9; background: var(--store-bg, #f8fafc); outline: none; font-family: 'Nunito', 'Battambang', sans-serif; box-sizing: border-box; }
                .skm-tgt-input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); background: #ffffff; }
                
                .skm-tgt-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; text-align: center; position: relative; overflow: hidden; }
                .skm-tgt-sales { font-size: 38px; font-weight: 900; color: #10b981; line-height: 1.2; margin: 5px 0; font-family: 'Nunito', sans-serif; text-shadow: 0 1px 2px rgba(16, 185, 129, 0.1); }
                .skm-tgt-remaining { font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 15px; }
                
                .skm-tgt-bar-bg { width: 100%; height: 10px; background: #e2e8f0; border-radius: 10px; margin-top: 15px; overflow: hidden; }
                .skm-tgt-bar-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #10b981, #0ea5e9); border-radius: 10px; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
                
                .skm-tgt-msg { font-size: 13px; font-weight: bold; margin-top: 15px; color: #f59e0b; transition: 0.3s; }
                .skm-btn-close { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; width: 100%; transition: 0.2s; text-align: center; font-family: inherit; margin-top: 5px; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
            </style>
            
            <div class="skm-tgt-box">
                <div class="skm-tgt-header">
                    <h3 style="margin:0; font-size:16px; display: flex; align-items: center; gap: 8px; color: #0ea5e9; font-weight: 800;">
                        <span>🎯</span> គោលដៅការលក់ប្រចាំថ្ងៃ
                    </h3>
                    <button onclick="document.getElementById('skmTargetModal').style.display='none'" style="background: #fef2f2; border: 1px solid #fca5a5; color: #ef4444; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">✕</button>
                </div>
                
                <div>
                    <label style="font-size: 11px; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px; text-align: center;">កំណត់គោលដៅសម្រាប់ថ្ងៃនេះ ($ USD):</label>
                    <input type="number" id="skmDailyTargetInput" class="skm-tgt-input" placeholder="ឧ. 200" oninput="window.saveTargetAndCalc()">
                </div>

                <div class="skm-tgt-card">
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; letter-spacing: 0.5px;">លក់បានជាក់ស្តែង</div>
                    <div id="skmCurrentSalesDisp" class="skm-tgt-sales">$0.00</div>
                    <div id="skmRemainingDisp" class="skm-tgt-remaining">នៅខ្វះ: <span style="color:#ef4444">$0.00</span></div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px; font-weight: 800;">
                        <span id="skmTargetPercentText" style="color: #0ea5e9;">0%</span>
                        <span style="color: var(--text-muted, #94a3b8); font-size: 11px; text-transform: uppercase;">គោលដៅ: <span id="skmGoalText">$0</span></span>
                    </div>
                    
                    <div class="skm-tgt-bar-bg">
                        <div id="skmTargetProgressBar" class="skm-tgt-bar-fill"></div>
                    </div>
                    
                    <div id="skmMotivationMsg" class="skm-tgt-msg">🔥 ខិតខំបន្តទៀត...</div>
                </div>

                <button class="skm-btn-close" onclick="document.getElementById('skmTargetModal').style.display='none'">បិទផ្ទាំង</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // ភ្ជាប់ Event សម្រាប់ចុចចេញក្រៅបិទផ្ទាំង
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });
        
        // ទាញយកគោលដៅចាស់ដែលធ្លាប់បាន Save ក្នុង LocalStorage
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let savedTarget = localStorage.getItem(`skm_sales_target_${branchId}`);
        if(savedTarget) {
            document.getElementById('skmDailyTargetInput').value = savedTarget;
        } else {
            document.getElementById('skmDailyTargetInput').value = 200; // Default $200
        }

        window.calcTargetProgress();
    }

    /* STREAMING_CHUNK:Implementing Calculation & Persistence Logic... */
    window.saveTargetAndCalc = function() {
        const targetInput = document.getElementById('skmDailyTargetInput');
        if(!targetInput) return;
        
        let target = parseFloat(targetInput.value) || 0;
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        
        // រក្សាទុកក្នុងប្រព័ន្ធ ដើម្បីកុំឱ្យបាត់ពេល Refresh
        localStorage.setItem(`skm_sales_target_${branchId}`, target);
        
        window.calcTargetProgress();
    };

    window.calcTargetProgress = function() {
        const targetInput = document.getElementById('skmDailyTargetInput');
        const salesDisp = document.getElementById('skmCurrentSalesDisp');
        const remainingDisp = document.getElementById('skmRemainingDisp');
        const percentText = document.getElementById('skmTargetPercentText');
        const progressBar = document.getElementById('skmTargetProgressBar');
        const motivationMsg = document.getElementById('skmMotivationMsg');
        const goalText = document.getElementById('skmGoalText');
        if(!targetInput) return;

        let target = parseFloat(targetInput.value) || 0;
        
        // ទាញយកទិន្នន័យការលក់ថ្ងៃនេះពីប្រព័ន្ធ POS ដើម
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let invoices = window.invoices || JSON.parse(localStorage.getItem(`ks2_${branchId}_invoices_pro`) || '[]');
        let today = new Date().toLocaleDateString();
        let totalSales = 0;

        invoices.forEach(inv => {
            let invDate = inv.date ? inv.date.split(' ')[0] : '';
            if (inv.status === 'paid' && invDate === today) {
                totalSales += parseFloat(inv.totalAmount || 0);
            }
        });

        // ធ្វើបច្ចុប្បន្នភាព UI (លក់បាន និង គោលដៅ)
        salesDisp.innerText = `$${totalSales.toFixed(2)}`;
        goalText.innerText = `$${target > 0 ? target.toFixed(2) : '0.00'}`;
        
        // គណនាប្រាក់នៅខ្វះ
        let remaining = target - totalSales;
        if(remaining > 0) {
            remainingDisp.innerHTML = `នៅខ្វះ: <span style="color:#ef4444; font-weight:800;">$${remaining.toFixed(2)}</span> ដើម្បីដល់គោលដៅ`;
        } else if (remaining < 0) {
            remainingDisp.innerHTML = `<span style="color:#10b981; font-weight:800;">📈 លើសគោលដៅ: +$${Math.abs(remaining).toFixed(2)}</span>`;
        } else {
            remainingDisp.innerHTML = `<span style="color:#f59e0b; font-weight:800;">✅ ដល់គោលដៅល្មម!</span>`;
        }

        // គណនាភាគរយ (Percent)
        let pct = target > 0 ? (totalSales / target) * 100 : 0;
        let displayPct = Math.min(100, pct); // Limit visual bar to 100%
        
        percentText.innerText = `${pct.toFixed(1)}%`;
        progressBar.style.width = `${displayPct}%`;

        // ផ្លាស់ប្តូរពណ៌ និងសារលើកទឹកចិត្ត
        if (pct >= 100 && target > 0) {
            progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            progressBar.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.4)';
            salesDisp.style.color = '#f59e0b';
            motivationMsg.innerHTML = '🎉 អបអរសាទរ! អ្នកបានសម្រេចគោលដៅហើយ!';
            motivationMsg.style.color = '#10b981';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #10b981, #0ea5e9)';
            progressBar.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.3)';
            salesDisp.style.color = '#10b981';
            motivationMsg.innerHTML = '🔥 ខិតខំបន្តទៀត...';
            motivationMsg.style.color = '#64748b';
        }
    };

    /* STREAMING_CHUNK:Registering Plugin to System... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🎯', 'គោលដៅការលក់ប្រចាំថ្ងៃ', openTargetModal);
            clearInterval(initInt);
        }
    }, 500);
})();