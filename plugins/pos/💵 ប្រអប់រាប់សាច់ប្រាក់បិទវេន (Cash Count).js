(function() {
    console.log("💵 POS Ultra-Compact Cash Drawer Counter (Performance & Touch Ready)!");

    // មុខងារបិទផ្ទាំងចាស់ៗទាំងអស់ស្វ័យប្រវត្តិ (ការពារបញ្ហាជាន់ Z-Index)
    window.skmCloseAllModals = function() {
        const modals = ['skm-cash-inout-modal', 'skm-quick-exp-modal', 'skmDrawerCashModal', 'skmDailyModal', 'skmLastSalesModal'];
        modals.forEach(id => {
            let m = document.getElementById(id);
            if(m && m.style.display !== 'none') {
                m.style.opacity = '0';
                setTimeout(() => { m.style.display = 'none'; }, 200);
            }
        });
    };

    // មុខងាររាប់លេខមានចលនា គាំទ្រ USD និង KHR
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

    // ១. បញ្ចូលប៊ូតុងទៅក្នុងកន្ត្រក (Cart Summary) ជាមួយ Premium Style
    function injectCounterBtn() {
        const cartSummary = document.getElementById('cartSummaryBody');
        if (!cartSummary || document.getElementById('skmCashCountBtn')) return;
        
        const btn = document.createElement('button');
        btn.id = 'skmCashCountBtn';
        btn.innerHTML = '💵 រាប់សាច់ប្រាក់បិទវេន (Cash Count)';
        btn.style.cssText = `
            background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981;
            font-weight: 700; font-size: 14px; padding: 12px; border-radius: 12px; cursor: pointer;
            transition: all 0.2s; width: 100%; margin-top: 10px; font-family: 'Battambang', sans-serif;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: flex; justify-content: center; align-items: center; height: 44px;
        `;
        
        btn.onmouseover = () => { 
            btn.style.background = '#10b981'; btn.style.color = 'white'; 
            btn.style.boxShadow = '0 5px 15px rgba(16, 185, 129, 0.3)';
        };
        btn.onmouseout = () => { 
            btn.style.background = 'rgba(16, 185, 129, 0.1)'; btn.style.color = '#10b981'; 
            btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
        };
        
        btn.onclick = openCashCounterModal;
        
        const targetDiv = cartSummary.querySelector('div[style*="display: flex; gap: 10px;"]');
        if (targetDiv) cartSummary.insertBefore(btn, targetDiv);
        else cartSummary.appendChild(btn);
    }

    window.skmCloseDrawerCounter = function() {
        const modal = document.getElementById('skmDrawerCashModal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-draw-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 250);
        }
    };

    // ២. បង្កើតផ្ទាំង Modal រាប់លុយបែប Ultra-Compact
    function openCashCounterModal() {
        // បិទផ្ទាំងផ្សេងៗសិន
        window.skmCloseAllModals();

        let modal = document.getElementById('skmDrawerCashModal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-draw-glass, .skm-draw-glass * { box-sizing: border-box; }
                
                /* Performance Mode: Blur 8px ជួយម៉ាស៊ីនឱ្យដើររលូន */
                .skm-draw-glass {
                    background: var(--bg-card, rgba(255, 255, 255, 0.98)); color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 95%; max-width: 480px;
                    max-height: 95vh; display: flex; flex-direction: column;
                    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Battambang', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-draw-glass {
                        background: var(--bg-card, rgba(15, 23, 42, 0.98)); color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-draw-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
                
                .skm-draw-item {
                    display: flex; align-items: center; justify-content: space-between;
                    background: var(--bg-input, #f8fafc);
                    padding: 8px 12px; border-radius: 12px;
                    border: 1px solid var(--border, rgba(128,128,128,0.15));
                    transition: 0.2s;
                }
                @media (prefers-color-scheme: dark) { .skm-draw-item { background: var(--bg-input, rgba(0,0,0,0.2)); } }
                
                .skm-draw-item.usd:focus-within { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
                .skm-draw-item.khr:focus-within { border-color: #0ea5e9; background: rgba(14, 165, 233, 0.05); }
                
                .skm-draw-label { font-size: 14px; font-weight: 600; font-family: 'Arial'; display: flex; align-items: center; gap: 8px; }
                
                /* Touch Friendly Input: ធំល្មមម្រាមដៃចុច 38px */
                .skm-draw-input {
                    width: 75px; height: 38px; text-align: center; font-size: 15px; font-weight: bold;
                    border-radius: 8px; border: 1px solid var(--border, rgba(128,128,128,0.2));
                    background: var(--bg-card, #ffffff); color: var(--text-main, inherit);
                    outline: none; transition: 0.2s; font-family: 'Arial';
                }
                @media (prefers-color-scheme: dark) { .skm-draw-input { background: rgba(255,255,255,0.05); border-color: transparent; } }
                .skm-draw-item.usd .skm-draw-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); }
                .skm-draw-item.khr .skm-draw-input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2); }
                
                .skm-draw-list { overflow-y: auto; flex: 1; padding-right: 5px; min-height: 200px; max-height: 50vh;}
                .skm-draw-list::-webkit-scrollbar { width: 4px; }
                .skm-draw-list::-webkit-scrollbar-track { background: transparent; }
                .skm-draw-list::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
                
                input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skmDrawerCashModal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                opacity: 0; transition: opacity 0.2s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-draw-glass">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h3 style="margin:0; font-size:16px; font-weight:600; display:flex; align-items:center; gap:8px;">
                            <span style="color:#10b981; font-size: 18px;">💵</span> រាប់ប្រាក់ក្នុងទូរ (Cash Count)
                        </h3>
                        <div style="display:flex; gap:10px;">
                            <button id="skm-btn-reset-drawer" style="background:rgba(239, 68, 68, 0.1); border:none; color:#ef4444; padding:6px 12px; border-radius:8px; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s; font-family:'Battambang';">សម្អាត</button>
                            <div onclick="window.skmCloseDrawerCounter()" style="background:var(--bg-alt, #f1f5f9); border: 1px solid var(--border, rgba(0,0,0,0.05)); color:inherit; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 14px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='var(--bg-alt, #f1f5f9)'; this.style.color='inherit';">✕</div>
                        </div>
                    </div>

                    <div style="background: var(--bg-alt, #f8fafc); border-radius: 12px; padding: 15px; margin-bottom: 15px; border: 1px solid var(--border, rgba(128,128,128,0.15)); display: flex; justify-content: space-around; align-items: center;">
                        <div style="text-align: center; flex:1;">
                            <div style="font-size: 12px; color: #10b981; font-weight: bold; margin-bottom: 6px;">សរុបដុល្លារ (USD)</div>
                            <div id="skm-drawer-total-usd" style="font-size: 24px; font-weight: bold; color: var(--text-main); font-family: 'Arial';">$0.00</div>
                        </div>
                        <div style="width: 1px; height: 40px; background: rgba(128,128,128,0.2);"></div>
                        <div style="text-align: center; flex:1;">
                            <div style="font-size: 12px; color: #0ea5e9; font-weight: bold; margin-bottom: 6px;">សរុបរៀល (KHR)</div>
                            <div id="skm-drawer-total-khr" style="font-size: 20px; font-weight: bold; color: #0ea5e9; font-family: 'Arial';">0 ៛</div>
                        </div>
                    </div>
                    
                    <div class="skm-draw-list">
                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 10px; color: #10b981; font-family:'Battambang';">🇺🇸 ប្រាក់ដុល្លារ (USD)</div>
                        <div class="skm-draw-grid">
                            <div class="skm-draw-item usd"><span class="skm-draw-label"><span style="color:#10b981;">$</span>100</span><input type="number" min="0" value="0" class="skm-draw-input usd-input" data-val="100"></div>
                            <div class="skm-draw-item usd"><span class="skm-draw-label"><span style="color:#10b981;">$</span>50</span><input type="number" min="0" value="0" class="skm-draw-input usd-input" data-val="50"></div>
                            <div class="skm-draw-item usd"><span class="skm-draw-label"><span style="color:#10b981;">$</span>20</span><input type="number" min="0" value="0" class="skm-draw-input usd-input" data-val="20"></div>
                            <div class="skm-draw-item usd"><span class="skm-draw-label"><span style="color:#10b981;">$</span>10</span><input type="number" min="0" value="0" class="skm-draw-input usd-input" data-val="10"></div>
                            <div class="skm-draw-item usd"><span class="skm-draw-label"><span style="color:#10b981;">$</span>5</span><input type="number" min="0" value="0" class="skm-draw-input usd-input" data-val="5"></div>
                            <div class="skm-draw-item usd"><span class="skm-draw-label"><span style="color:#10b981;">$</span>1</span><input type="number" min="0" value="0" class="skm-draw-input usd-input" data-val="1"></div>
                        </div>

                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 10px; margin-top: 15px; color: #0ea5e9; font-family:'Battambang';">🇰🇭 ប្រាក់រៀល (KHR)</div>
                        <div class="skm-draw-grid">
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>100,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="100000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>50,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="50000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>20,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="20000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>10,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="10000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>5,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="5000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>2,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="2000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>1,000</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="1000"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>500</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="500"></div>
                            <div class="skm-draw-item khr"><span class="skm-draw-label"><span style="color:#0ea5e9;">៛</span>100</span><input type="number" min="0" value="0" class="skm-draw-input khr-input" data-val="100"></div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseDrawerCounter(); });
            document.addEventListener('keydown', function(e) { if(e.key === 'Escape' && modal.style.display !== 'none') window.skmCloseDrawerCounter(); });

            let curUsd = 0, curKhr = 0;
            const usdInputs = modal.querySelectorAll('.usd-input');
            const khrInputs = modal.querySelectorAll('.khr-input');
            
            const calculateSum = () => {
                let newUsd = 0, newKhr = 0;
                usdInputs.forEach(i => newUsd += (parseInt(i.value) || 0) * parseFloat(i.getAttribute('data-val')));
                khrInputs.forEach(i => newKhr += (parseInt(i.value) || 0) * parseFloat(i.getAttribute('data-val')));
                
                if(newUsd !== curUsd) { animateValue(document.getElementById('skm-drawer-total-usd'), curUsd, newUsd, 300, 'USD'); curUsd = newUsd; }
                if(newKhr !== curKhr) { animateValue(document.getElementById('skm-drawer-total-khr'), curKhr, newKhr, 300, 'KHR'); curKhr = newKhr; }
            };

            const allInputs = modal.querySelectorAll('.skm-draw-input');
            allInputs.forEach(input => {
                input.addEventListener('input', calculateSum);
                input.addEventListener('focus', function() { if(this.value === '0') this.select(); }); // Select 0 ឱ្យស្រេច
            });

            document.getElementById('skm-btn-reset-drawer').addEventListener('click', () => {
                allInputs.forEach(i => i.value = '0');
                calculateSum();
            });

        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-draw-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        setTimeout(() => { modal.style.opacity = '1'; }, 50);
    }

    const initInt = setInterval(() => {
        if (document.getElementById('cartSummaryBody')) {
            injectCounterBtn();
            clearInterval(initInt);
            console.log("✅ Ultra-Compact Cash Drawer Counter (Cart Button) successfully injected!");
        }
    }, 1000);
})();