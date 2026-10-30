(function() {
    console.log("📉 POS Ultra-Compact Premium Expense (USD+KHR) Initialized!");

    // មុខងាររាប់លេខមានចលនា
    function animateValue(obj, start, end, duration, currency = 'USD') {
        let startTimestamp = null;
        const formatMoney = (val, cur) => {
            if (cur === 'USD') return '$' + val.toFixed(2);
            return Math.floor(val).toLocaleString('en-US') + ' ៛';
        };

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = (progress * (end - start) + start);
            
            obj.innerHTML = formatMoney(currentVal, currency);
            
            if (progress < 1) window.requestAnimationFrame(step);
            else obj.innerHTML = formatMoney(end, currency);
        };
        window.requestAnimationFrame(step);
    }

    window.skmCloseQuickExpense = function() {
        const modal = document.getElementById('skm-quick-exp-modal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-exp-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    };

    function openQuickExpense() {
        let modal = document.getElementById('skm-quick-exp-modal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-exp-glass, .skm-exp-glass * { box-sizing: border-box; }
                
                .skm-exp-glass {
                    background: var(--bg-card, #ffffff);
                    color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 420px;
                    max-height: 95vh; display: flex; flex-direction: column;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-exp-glass {
                        background: var(--bg-card, #1e293b);
                        color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-exp-input, .skm-exp-select {
                    height: 38px; font-size: 13px; font-weight: 500;
                    border-radius: 10px; border: 1px solid var(--border, rgba(128,128,128,0.25));
                    background: var(--bg-input, #f8fafc);
                    color: var(--text-main, inherit); padding: 0 8px;
                    outline: none; transition: 0.2s; font-family: 'Battambang', 'Arial', sans-serif;
                }
                @media (prefers-color-scheme: dark) { .skm-exp-input, .skm-exp-select { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                .skm-exp-input:focus, .skm-exp-select:focus { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15); background: transparent; }
                
                .skm-exp-btn {
                    height: 38px; border-radius: 10px; border: none;
                    background: #ef4444; color: white; padding: 0 15px;
                    font-size: 13px; font-weight: bold; cursor: pointer; transition: 0.2s;
                    font-family: 'Battambang'; white-space: nowrap;
                    box-shadow: 0 5px 15px rgba(239, 68, 68, 0.2);
                }
                .skm-exp-btn:hover { background: #dc2626; box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3); }
                .skm-exp-btn:active { transform: scale(0.96); }
                
                .skm-stat-box {
                    padding: 12px; border-radius: 12px;
                    background: rgba(239, 68, 68, 0.05);
                    border: 1px solid rgba(239, 68, 68, 0.15);
                    text-align: center; margin-bottom: 12px;
                }
                
                .skm-log-item {
                    background: var(--bg-input, #f8fafc);
                    padding: 8px 12px; border-radius: 10px; margin-bottom: 6px;
                    border: 1px solid var(--border, rgba(128,128,128,0.15));
                    display: flex; justify-content: space-between; align-items: center;
                }
                @media (prefers-color-scheme: dark) { .skm-log-item { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                
                .skm-btn-del {
                    background: rgba(128,128,128,0.1); color: var(--text-muted); border: none;
                    padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;
                    font-family: 'Battambang'; font-weight: bold; transition: 0.2s;
                }
                .skm-btn-del:hover { background: #ef4444; color: white; }
                
                .skm-exp-list { overflow-y: auto; flex: 1; padding-right: 4px; min-height: 150px; }
                .skm-exp-list::-webkit-scrollbar { width: 4px; }
                .skm-exp-list::-webkit-scrollbar-track { background: transparent; }
                .skm-exp-list::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skm-quick-exp-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                backdrop-filter: blur(3px); opacity: 0; transition: opacity 0.3s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-exp-glass">
                    <!-- ក្បាល (Header) -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h3 style="margin:0; font-size:16px; font-weight:600; display:flex; align-items:center; gap:6px;">
                            <span style="color:#ef4444; font-size: 18px;">📉</span> កត់ត្រាចំណាយរហ័ស
                        </h3>
                        <div onclick="window.skmCloseQuickExpense()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:26px; height:26px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                    </div>

                    <!-- 📊 ផ្ទាំងបង្ហាញចំណាយសរុប -->
                    <div class="skm-stat-box">
                        <div style="font-size: 12px; color: #ef4444; font-weight: bold; margin-bottom: 4px;">💸 ចំណាយសរុបថ្ងៃនេះ (Total Expenses)</div>
                        <div style="display: flex; justify-content: center; align-items: center; gap: 15px;">
                            <span id="skm-exp-usd" style="font-size: 20px; font-weight: 700; font-family: 'Arial'; color: #ef4444;">$0.00</span>
                            <span style="color: rgba(239, 68, 68, 0.3); font-size: 14px;">|</span>
                            <span id="skm-exp-khr" style="font-size: 15px; font-weight: 600; font-family: 'Arial'; color: #f43f5e;">0 ៛</span>
                        </div>
                    </div>
                    
                    <!-- ✍️ ទម្រង់បញ្ចូលទិន្នន័យ (Compact Layout) -->
                    <div style="background: var(--bg-alt, #f1f5f9); padding: 12px; border-radius: 12px; border: 1px solid var(--border, rgba(128,128,128,0.1)); margin-bottom: 15px;">
                        
                        <!-- ជួរទី១: ប្រភេទ + ទឹកប្រាក់ + រូបិយប័ណ្ណ -->
                        <div style="display: flex; gap: 6px; margin-bottom: 8px; width: 100%;">
                            <select id="skmQEType" class="skm-exp-select" style="flex: 0 0 120px;">
                                <option value="ទិញសម្ភារៈ/ស្តុក">📦 ទិញសម្ភារៈ/ស្តុក</option>
                                <option value="ថ្លៃទឹក/ភ្លើង">⚡ ថ្លៃទឹក/ភ្លើង</option>
                                <option value="ថ្លៃម្ហូប/បាយ">🍛 ថ្លៃម្ហូប/បាយ</option>
                                <option value="ចំណាយផ្សេងៗ">🏷️ ចំណាយផ្សេងៗ</option>
                            </select>
                            <input type="number" id="skmQEAmount" class="skm-exp-input" placeholder="ទឹកប្រាក់" style="flex: 1; min-width: 0;">
                            <select id="skmQECurrency" class="skm-exp-select" style="flex: 0 0 65px; font-family: 'Arial'; font-weight: bold; padding: 0 5px;">
                                <option value="USD">USD</option>
                                <option value="KHR">KHR</option>
                            </select>
                        </div>
                        
                        <!-- ជួរទី២: ចំណាំ + ប៊ូតុង -->
                        <div style="display: flex; gap: 6px; width: 100%;">
                            <input type="text" id="skmQENote" class="skm-exp-input" placeholder="មូលហេតុ (ឧ. ទិញទឹកសុទ្ធ...)" style="flex: 1; min-width: 0;">
                            <button class="skm-exp-btn" onclick="window.saveQuickExpense()" style="flex: 0 0 85px;">កត់ត្រា</button>
                        </div>
                    </div>
                    
                    <!-- 📜 ប្រវត្តិ (History List) -->
                    <div style="display: flex; flex-direction: column; flex: 1; overflow: hidden;">
                        <div style="font-size:11px; font-weight:600; color:var(--text-muted); margin-bottom:6px;">ប្រវត្តិថ្ងៃនេះ (Today's Expenses)</div>
                        <div id="skmExpenseList" class="skm-exp-list"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseQuickExpense(); });
            document.addEventListener('keydown', function(e) { if(e.key === 'Escape' && modal.style.display !== 'none') window.skmCloseQuickExpense(); });
            
        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-exp-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            
            document.getElementById('skmQEAmount').value = '';
            document.getElementById('skmQENote').value = '';
        }

        setTimeout(() => { 
            modal.style.opacity = '1'; 
            document.getElementById('skmQEAmount').focus(); 
        }, 50);

        window.loadExpenseList();
    }

    // មុខងារកត់ត្រា
    window.saveQuickExpense = function() {
        const cat = document.getElementById('skmQEType').value;
        const currency = document.getElementById('skmQECurrency').value;
        const amtInput = document.getElementById('skmQEAmount');
        const amt = parseFloat(amtInput.value);
        const note = document.getElementById('skmQENote').value.trim();
        
        if(isNaN(amt) || amt <= 0) { 
            amtInput.style.borderColor = '#ef4444';
            setTimeout(() => amtInput.style.borderColor = '', 1000);
            return; 
        }
        
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let expenses = window.expenses || JSON.parse(localStorage.getItem(`ks2_${branchId}_expenses_pro`) || '[]');
        
        const newExp = {
            id: 'EXP-' + Date.now(),
            date: new Date().toLocaleString('km-KH'),
            dateIso: new Date().toLocaleDateString(),
            timestamp: Date.now(),
            category: cat,
            amount: amt,
            currency: currency,
            note: note || cat // បើអត់សរសេរយកឈ្មោះប្រភេទមកដាក់
        };

        expenses.unshift(newExp);
        window.expenses = expenses;
        localStorage.setItem(`ks2_${branchId}_expenses_pro`, JSON.stringify(expenses));
        
        // ធានាការរក្សាទុកទិន្នន័យទៅ Cloud បើប្រព័ន្ធមានគាំទ្រ
        if (typeof window.saveData === 'function' && window.userAccounts) {
            window.saveData(window.userAccounts);
        }
        
        document.getElementById('skmQEAmount').value = '';
        document.getElementById('skmQENote').value = '';
        document.getElementById('skmQEAmount').focus();
        
        window.loadExpenseList();
        
        const btn = document.querySelector('.skm-exp-btn');
        const oldText = btn.innerText;
        btn.innerText = 'ជោគជ័យ!';
        btn.style.background = '#10b981';
        btn.style.boxShadow = 'none';
        setTimeout(() => { btn.innerText = oldText; btn.style.background = ''; btn.style.boxShadow = ''; }, 1000);
    };

    window.deleteQuickExpense = function(id) {
        if(confirm('តើអ្នកពិតជាចង់លុបចំណាយនេះមែនទេ?')) {
            const branchId = window.SHOP_BRANCH_ID || 'branch_1';
            let expenses = window.expenses || JSON.parse(localStorage.getItem(`ks2_${branchId}_expenses_pro`) || '[]');
            expenses = expenses.filter(e => e.id !== id);
            window.expenses = expenses;
            localStorage.setItem(`ks2_${branchId}_expenses_pro`, JSON.stringify(expenses));
            window.loadExpenseList();
        }
    };

    let cExpUsd = 0, cExpKhr = 0;
    
    window.loadExpenseList = function() {
        const list = document.getElementById('skmExpenseList');
        if(!list) return;
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let expenses = window.expenses || JSON.parse(localStorage.getItem(`ks2_${branchId}_expenses_pro`) || '[]');
        
        const todayStr = new Date().toLocaleDateString();
        const todayLogs = expenses.filter(e => {
            if(e.dateIso) return e.dateIso === todayStr;
            if(e.date) return e.date.includes(todayStr);
            return false;
        });

        let tExpUsd = 0, tExpKhr = 0;
        
        if(todayLogs.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:15px; color:var(--text-muted); font-size:11px;">មិនទាន់មានចំណាយទេ!</div>';
        } else {
            list.innerHTML = todayLogs.map(e => {
                const curr = e.currency || 'USD'; 
                const amt = parseFloat(e.amount);
                
                if(curr === 'USD') tExpUsd += amt; else tExpKhr += amt;
                
                const amtDisplay = curr === 'USD' ? `$${amt.toFixed(2)}` : `${Math.floor(amt).toLocaleString('en-US')} ៛`;
                
                // រក្សាទម្រង់ Icon តាមប្រភេទ
                let icon = '🏷️';
                if(e.category.includes('ទិញសម្ភារៈ') || e.category.includes('ស្តុក')) icon = '📦';
                else if(e.category.includes('ទឹក') || e.category.includes('ភ្លើង')) icon = '⚡';
                else if(e.category.includes('ម្ហូប') || e.category.includes('បាយ')) icon = '🍛';
                
                return `
                <div class="skm-log-item">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                            <span style="font-size:14px; font-weight:bold; color:#ef4444; font-family:'Arial';">
                                - ${amtDisplay}
                            </span>
                            <span style="font-size:12px; color:var(--text-main); font-weight:500;">(${icon} ${e.note})</span>
                        </div>
                        <div style="font-size:10px; color:var(--text-muted);">${e.date}</div>
                    </div>
                    <button class="skm-btn-del" onclick="window.deleteQuickExpense('${e.id}')">លុប</button>
                </div>
                `;
            }).join('');
        }

        // Update Animations
        if(tExpUsd !== cExpUsd) { animateValue(document.getElementById('skm-exp-usd'), cExpUsd, tExpUsd, 400, 'USD'); cExpUsd = tExpUsd; }
        if(tExpKhr !== cExpKhr) { animateValue(document.getElementById('skm-exp-khr'), cExpKhr, tExpKhr, 400, 'KHR'); cExpKhr = tExpKhr; }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📉', 'កត់ត្រាចំណាយរហ័ស', openQuickExpense);
            clearInterval(initInt);
            console.log("✅ Ultra-Compact Expense Modal successfully registered!");
        }
    }, 500);
})();