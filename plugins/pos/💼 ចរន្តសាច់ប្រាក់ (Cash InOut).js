(function() {
    console.log("💼 POS Ultra-Compact Cash In/Out Initialized!");

    function animateValue(obj, start, end, duration, currency = 'USD') {
        let startTimestamp = null;
        const formatMoney = (val, cur) => {
            let sign = val < 0 ? '-' : '';
            let absVal = Math.abs(val);
            if (cur === 'USD') return sign + '$' + absVal.toFixed(2);
            return sign + Math.floor(absVal).toLocaleString('en-US') + ' ៛';
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

    window.skmCloseCashInOut = function() {
        const modal = document.getElementById('skm-cash-inout-modal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-io-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    };

    function openCashInOutModal() {
        let modal = document.getElementById('skm-cash-inout-modal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-io-glass, .skm-io-glass * { box-sizing: border-box; }
                
                .skm-io-glass {
                    background: var(--bg-card, #ffffff);
                    color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 400px;
                    max-height: 95vh; display: flex; flex-direction: column;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-io-glass {
                        background: var(--bg-card, #1e293b);
                        color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-io-input, .skm-io-select {
                    height: 36px; font-size: 13px; font-weight: 500;
                    border-radius: 8px; border: 1px solid var(--border, rgba(128,128,128,0.25));
                    background: var(--bg-input, #ffffff);
                    color: var(--text-main, inherit); padding: 0 8px;
                    outline: none; transition: 0.2s; font-family: 'Battambang', 'Arial', sans-serif;
                }
                @media (prefers-color-scheme: dark) { .skm-io-input, .skm-io-select { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                .skm-io-input:focus, .skm-io-select:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15); }
                
                .skm-io-btn {
                    height: 36px; border-radius: 8px; border: none;
                    background: #0ea5e9; color: white; padding: 0 10px;
                    font-size: 13px; font-weight: bold; cursor: pointer; transition: 0.2s;
                    font-family: 'Battambang'; white-space: nowrap;
                }
                .skm-io-btn:hover { background: #0284c7; }
                .skm-io-btn:active { transform: scale(0.95); }
                
                .skm-log-item {
                    background: var(--bg-input, #f8fafc);
                    padding: 8px 12px; border-radius: 10px; margin-bottom: 6px;
                    border: 1px solid var(--border, rgba(128,128,128,0.15));
                    display: flex; justify-content: space-between; align-items: center;
                }
                @media (prefers-color-scheme: dark) { .skm-log-item { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                
                .skm-btn-del {
                    background: rgba(239,68,68,0.1); color: #ef4444; border: none;
                    padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;
                    font-family: 'Battambang'; font-weight: bold; transition: 0.2s;
                }
                .skm-btn-del:hover { background: #ef4444; color: white; }
                
                .skm-io-list { overflow-y: auto; flex: 1; padding-right: 4px; min-height: 150px; }
                .skm-io-list::-webkit-scrollbar { width: 4px; }
                .skm-io-list::-webkit-scrollbar-track { background: transparent; }
                .skm-io-list::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skm-cash-inout-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                backdrop-filter: blur(3px); opacity: 0; transition: opacity 0.3s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-io-glass">
                    <!-- ក្បាល (Header) ប្តូរឈ្មោះ -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                        <h3 style="margin:0; font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px;">
                            <span style="color:#0ea5e9; font-size: 18px;">💼</span> ចរន្តសាច់ប្រាក់ (In/Out)
                        </h3>
                        <div onclick="window.skmCloseCashInOut()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:26px; height:26px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                    </div>

                    <div style="background: var(--bg-alt, #f8fafc); border-radius: 12px; padding: 12px; margin-bottom: 12px; border: 1px solid var(--border, rgba(128,128,128,0.15));">
                        <div style="text-align: center; margin-bottom: 10px;">
                            <div style="font-size: 11px; color: #0ea5e9; font-weight: bold; margin-bottom: 4px;">💰 ប្រាក់នៅសល់ក្នុងទូរ (Net Balance)</div>
                            <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
                                <span id="skm-net-usd" style="font-size: 18px; font-weight: bold; color: var(--text-main); font-family: 'Arial';">$0.00</span>
                                <span style="color: var(--border, rgba(128,128,128,0.3)); font-size: 14px;">|</span>
                                <span id="skm-net-khr" style="font-size: 14px; font-weight: bold; color: #0ea5e9; font-family: 'Arial';">0 ៛</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; border-top: 1px dashed var(--border, rgba(128,128,128,0.2)); padding-top: 10px;">
                            <div style="flex: 1; text-align: center; border-right: 1px dashed var(--border, rgba(128,128,128,0.2));">
                                <div style="font-size: 10px; color: #10b981; font-weight: bold;">📥 ចូលសរុប</div>
                                <div id="skm-in-usd" style="font-size: 13px; font-weight: bold; color: var(--text-main); font-family: 'Arial'; margin-top: 2px;">$0.00</div>
                                <div id="skm-in-khr" style="font-size: 11px; color: #10b981; font-family: 'Arial';">0 ៛</div>
                            </div>
                            <div style="flex: 1; text-align: center;">
                                <div style="font-size: 10px; color: #ef4444; font-weight: bold;">📤 ចេញសរុប</div>
                                <div id="skm-out-usd" style="font-size: 13px; font-weight: bold; color: var(--text-main); font-family: 'Arial'; margin-top: 2px;">$0.00</div>
                                <div id="skm-out-khr" style="font-size: 11px; color: #ef4444; font-family: 'Arial';">0 ៛</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: var(--bg-alt, #f1f5f9); padding: 10px; border-radius: 12px; border: 1px solid var(--border, rgba(128,128,128,0.1)); margin-bottom: 12px;">
                        <div style="display: flex; gap: 6px; margin-bottom: 6px; width: 100%;">
                            <select id="skmIOType" class="skm-io-select" style="flex: 0 0 95px;">
                                <option value="in">📥 ដាក់ចូល</option>
                                <option value="out">📤 ដកចេញ</option>
                            </select>
                            <input type="number" id="skmIOAmount" class="skm-io-input" placeholder="ទឹកប្រាក់" style="flex: 1; min-width: 0;">
                            <select id="skmIOCurrency" class="skm-io-select" style="flex: 0 0 65px; font-family: 'Arial'; font-weight: bold; padding: 0 5px;">
                                <option value="USD">USD</option>
                                <option value="KHR">KHR</option>
                            </select>
                        </div>
                        
                        <div style="display: flex; gap: 6px; width: 100%;">
                            <input type="text" id="skmIONote" class="skm-io-input" placeholder="មូលហេតុ (ឧ. អាប់...)" style="flex: 1; min-width: 0;">
                            <button class="skm-io-btn" onclick="window.saveCashInOut()" style="flex: 0 0 85px;">កត់ត្រា</button>
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; flex: 1; overflow: hidden;">
                        <div style="font-size:11px; font-weight:600; color:var(--text-muted); margin-bottom:6px;">ប្រវត្តិថ្ងៃនេះ (Today's Logs)</div>
                        <div id="skmCashInOutList" class="skm-io-list"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseCashInOut(); });
            document.addEventListener('keydown', function(e) { if(e.key === 'Escape' && modal.style.display !== 'none') window.skmCloseCashInOut(); });
            
        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-io-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            
            document.getElementById('skmIOAmount').value = '';
            document.getElementById('skmIONote').value = '';
        }

        setTimeout(() => { 
            modal.style.opacity = '1'; 
            document.getElementById('skmIOAmount').focus(); 
        }, 50);

        window.loadCashInOutList();
    }

    window.saveCashInOut = function() {
        const type = document.getElementById('skmIOType').value;
        const currency = document.getElementById('skmIOCurrency').value;
        const amtInput = document.getElementById('skmIOAmount');
        const amt = parseFloat(amtInput.value);
        const note = document.getElementById('skmIONote').value.trim();
        
        if(isNaN(amt) || amt <= 0) { 
            amtInput.style.borderColor = '#ef4444';
            setTimeout(() => amtInput.style.borderColor = '', 1000);
            return; 
        }
        
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let logs = JSON.parse(localStorage.getItem(`ks2_${branchId}_cash_inout`) || '[]');
        
        logs.unshift({
            id: 'IO-' + Date.now(),
            type: type,
            amount: amt,
            currency: currency,
            note: note || (type === 'in' ? 'ដាក់ប្រាក់បន្ថែម' : 'ដកប្រាក់ចេញ'),
            date: new Date().toLocaleString('km-KH'),
            dateIso: new Date().toLocaleDateString()
        });
        
        localStorage.setItem(`ks2_${branchId}_cash_inout`, JSON.stringify(logs));
        
        document.getElementById('skmIOAmount').value = '';
        document.getElementById('skmIONote').value = '';
        document.getElementById('skmIOAmount').focus();
        
        window.loadCashInOutList();
        
        const btn = document.querySelector('.skm-io-btn');
        const oldText = btn.innerText;
        btn.innerText = 'ជោគជ័យ!';
        btn.style.background = '#10b981';
        setTimeout(() => { btn.innerText = oldText; btn.style.background = ''; }, 1000);
    };

    window.deleteCashLog = function(id) {
        if(confirm('តើអ្នកពិតជាចង់លុបប្រតិបត្តិការនេះមែនទេ?')) {
            const branchId = window.SHOP_BRANCH_ID || 'branch_1';
            let logs = JSON.parse(localStorage.getItem(`ks2_${branchId}_cash_inout`) || '[]');
            logs = logs.filter(l => l.id !== id);
            localStorage.setItem(`ks2_${branchId}_cash_inout`, JSON.stringify(logs));
            window.loadCashInOutList();
        }
    };

    let cInUsd = 0, cInKhr = 0, cOutUsd = 0, cOutKhr = 0, cNetUsd = 0, cNetKhr = 0;
    
    window.loadCashInOutList = function() {
        const list = document.getElementById('skmCashInOutList');
        if(!list) return;
        const branchId = window.SHOP_BRANCH_ID || 'branch_1';
        let logs = JSON.parse(localStorage.getItem(`ks2_${branchId}_cash_inout`) || '[]');
        
        const todayStr = new Date().toLocaleDateString();
        const todayLogs = logs.filter(l => {
            if(l.dateIso) return l.dateIso === todayStr;
            if(l.date) return l.date.includes(todayStr);
            return false;
        });

        let tInUsd = 0, tInKhr = 0, tOutUsd = 0, tOutKhr = 0;
        
        if(todayLogs.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:15px; color:var(--text-muted); font-size:11px;">គ្មានប្រតិបត្តិការថ្ងៃនេះទេ!</div>';
        } else {
            list.innerHTML = todayLogs.map(l => {
                const curr = l.currency || 'USD'; 
                const amt = parseFloat(l.amount);
                
                if(l.type === 'in') {
                    if(curr === 'USD') tInUsd += amt; else tInKhr += amt;
                } else {
                    if(curr === 'USD') tOutUsd += amt; else tOutKhr += amt;
                }
                
                const amtDisplay = curr === 'USD' ? `$${amt.toFixed(2)}` : `${Math.floor(amt).toLocaleString('en-US')} ៛`;
                
                return `
                <div class="skm-log-item">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                            <span style="font-size:13px; font-weight:bold; color:${l.type==='in'?'#10b981':'#ef4444'}; font-family:'Arial';">
                                ${l.type==='in'?'+':'-'} ${amtDisplay}
                            </span>
                            <span style="font-size:12px; color:var(--text-main); font-weight:500;">(${l.note})</span>
                        </div>
                        <div style="font-size:10px; color:var(--text-muted);">${l.date}</div>
                    </div>
                    <button class="skm-btn-del" onclick="window.deleteCashLog('${l.id}')">លុប</button>
                </div>
                `;
            }).join('');
        }

        let tNetUsd = tInUsd - tOutUsd;
        let tNetKhr = tInKhr - tOutKhr;

        if(tNetUsd !== cNetUsd) { animateValue(document.getElementById('skm-net-usd'), cNetUsd, tNetUsd, 400, 'USD'); cNetUsd = tNetUsd; }
        if(tNetKhr !== cNetKhr) { animateValue(document.getElementById('skm-net-khr'), cNetKhr, tNetKhr, 400, 'KHR'); cNetKhr = tNetKhr; }
        
        if(tInUsd !== cInUsd) { animateValue(document.getElementById('skm-in-usd'), cInUsd, tInUsd, 300, 'USD'); cInUsd = tInUsd; }
        if(tInKhr !== cInKhr) { animateValue(document.getElementById('skm-in-khr'), cInKhr, tInKhr, 300, 'KHR'); cInKhr = tInKhr; }
        
        if(tOutUsd !== cOutUsd) { animateValue(document.getElementById('skm-out-usd'), cOutUsd, tOutUsd, 300, 'USD'); cOutUsd = tOutUsd; }
        if(tOutKhr !== cOutKhr) { animateValue(document.getElementById('skm-out-khr'), cOutKhr, tOutKhr, 300, 'KHR'); cOutKhr = tOutKhr; }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('💼', 'ចរន្តសាច់ប្រាក់ (In/Out)', openCashInOutModal);
            clearInterval(initInt);
        }
    }, 500);
})();