(function() {
    console.log("💵 POS Premium Auto-Theme Cash Counter (USD + KHR) Initialized!");

    // មុខងាររាប់លេខឱ្យមានចលនារលូន (គាំទ្រទាំង USD និង KHR)
    function animateValue(obj, start, end, duration, currency) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = (progress * (end - start) + start);
            
            if (currency === 'USD') {
                obj.innerHTML = '$' + currentVal.toFixed(2);
            } else {
                obj.innerHTML = Math.floor(currentVal).toLocaleString('en-US') + ' ៛';
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                if (currency === 'USD') obj.innerHTML = '$' + end.toFixed(2);
                else obj.innerHTML = Math.floor(end).toLocaleString('en-US') + ' ៛';
            }
        };
        window.requestAnimationFrame(step);
    }

    window.skmCloseCashModal = function() {
        const modal = document.getElementById('skm-cash-modal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-cash-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(20px)';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    };

    function openCashCounter() {
        let modal = document.getElementById('skm-cash-modal');
        
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(20px); opacity: 0; filter: blur(10px); }
                    100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
                }
                
                .skm-cash-glass {
                    background: var(--bg-card, rgba(255, 255, 255, 0.95));
                    color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.1));
                    backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
                    border-radius: 24px; padding: 25px 30px; width: 100%; max-width: 520px;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.15);
                    animation: skmModalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    transition: all 0.3s ease;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-cash-glass {
                        background: var(--bg-card, rgba(15, 23, 42, 0.85));
                        color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);
                    }
                }
                
                /* Scroll Area សម្រាប់ក្រដាសប្រាក់ច្រើន */
                .skm-cash-scroll-area {
                    max-height: 45vh; overflow-y: auto; padding-right: 10px; margin-bottom: 20px;
                }
                .skm-cash-scroll-area::-webkit-scrollbar { width: 6px; }
                .skm-cash-scroll-area::-webkit-scrollbar-track { background: var(--bg-alt, rgba(128,128,128,0.1)); border-radius: 10px; }
                .skm-cash-scroll-area::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
                
                .skm-cash-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
                
                .skm-cash-item {
                    display: flex; align-items: center; justify-content: space-between;
                    background: var(--bg-alt, rgba(128, 128, 128, 0.05));
                    padding: 6px 12px; border-radius: 12px;
                    border: 1px solid var(--border, rgba(128, 128, 128, 0.1));
                    transition: 0.2s;
                }
                .skm-cash-item.usd:hover { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
                .skm-cash-item.khr:hover { border-color: #38bdf8; background: rgba(56, 189, 248, 0.05); }
                
                .skm-cash-label { font-size: 14px; font-weight: 600; font-family: 'Arial', sans-serif; display: flex; align-items: center; gap: 8px; }
                
                .skm-cash-input {
                    width: 65px; height: 32px; text-align: center; font-size: 15px; font-weight: bold;
                    border-radius: 8px; border: 1px solid var(--border, rgba(128,128,128,0.2));
                    background: var(--bg-input, rgba(255,255,255,0.5));
                    color: var(--text-main, inherit);
                    outline: none; transition: 0.2s; font-family: 'Arial', sans-serif;
                }
                @media (prefers-color-scheme: dark) { .skm-cash-input { background: var(--bg-input, rgba(0,0,0,0.3)); } }
                
                .skm-cash-item.usd .skm-cash-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); background: transparent; }
                .skm-cash-item.khr .skm-cash-input:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2); background: transparent; }
                
                .skm-total-box {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(56, 189, 248, 0.08));
                    border: 1px solid rgba(128, 128, 128, 0.2);
                    padding: 15px; border-radius: 16px; margin-bottom: 20px;
                    display: flex; justify-content: space-around; align-items: center;
                }
                
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skm-cash-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.6); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                backdrop-filter: blur(5px); opacity: 0; transition: opacity 0.3s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-cash-glass">
                    
                    <!-- Header -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                        <h3 style="margin:0; font-size:18px; font-weight:600; display:flex; align-items:center; gap:8px; font-family: 'Battambang';">
                            <span style="color:#10b981; font-size: 22px;">💵</span> រាប់ប្រាក់បិទវេន (USD/KHR)
                        </h3>
                        <div style="display:flex; gap:10px;">
                            <button id="skm-btn-reset-cash" style="background:rgba(239, 68, 68, 0.1); border:none; color:#ef4444; padding:5px 12px; border-radius:8px; cursor:pointer; font-weight:bold; font-family: 'Battambang'; font-size: 12px; transition:0.2s;">សម្អាត</button>
                            <button onclick="window.skmCloseCashModal()" style="background:rgba(128,128,128,0.2); border:none; color:inherit; width:30px; height:30px; border-radius:50%; cursor:pointer; font-weight:bold; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='rgba(128,128,128,0.2)'; this.style.color='inherit';">✕</button>
                        </div>
                    </div>
                    
                    <!-- Scrollable Area -->
                    <div class="skm-cash-scroll-area">
                        <!-- ផ្នែកដុល្លារ (USD) -->
                        <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #10b981; font-family: 'Battambang';">🇺🇸 ប្រាក់ដុល្លារ (USD)</div>
                        <div class="skm-cash-grid">
                            <div class="skm-cash-item usd"><span class="skm-cash-label"><span style="color:#10b981;">$</span>100</span><input type="number" min="0" value="0" class="skm-cash-input usd-input" data-val="100"></div>
                            <div class="skm-cash-item usd"><span class="skm-cash-label"><span style="color:#10b981;">$</span>50</span><input type="number" min="0" value="0" class="skm-cash-input usd-input" data-val="50"></div>
                            <div class="skm-cash-item usd"><span class="skm-cash-label"><span style="color:#10b981;">$</span>20</span><input type="number" min="0" value="0" class="skm-cash-input usd-input" data-val="20"></div>
                            <div class="skm-cash-item usd"><span class="skm-cash-label"><span style="color:#10b981;">$</span>10</span><input type="number" min="0" value="0" class="skm-cash-input usd-input" data-val="10"></div>
                            <div class="skm-cash-item usd"><span class="skm-cash-label"><span style="color:#10b981;">$</span>5</span><input type="number" min="0" value="0" class="skm-cash-input usd-input" data-val="5"></div>
                            <div class="skm-cash-item usd"><span class="skm-cash-label"><span style="color:#10b981;">$</span>1</span><input type="number" min="0" value="0" class="skm-cash-input usd-input" data-val="1"></div>
                        </div>

                        <!-- ផ្នែកលុយខ្មែរ (KHR) -->
                        <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; margin-top: 15px; color: #38bdf8; font-family: 'Battambang';">🇰🇭 ប្រាក់រៀល (KHR)</div>
                        <div class="skm-cash-grid">
                            <div class="skm-cash-item khr"><span class="skm-cash-label"><span style="color:#38bdf8;">៛</span>100,000</span><input type="number" min="0" value="0" class="skm-cash-input khr-input" data-val="100000"></div>
                            <div class="skm-cash-item khr"><span class="skm-cash-label"><span style="color:#38bdf8;">៛</span>50,000</span><input type="number" min="0" value="0" class="skm-cash-input khr-input" data-val="50000"></div>
                            <div class="skm-cash-item khr"><span class="skm-cash-label"><span style="color:#38bdf8;">៛</span>20,000</span><input type="number" min="0" value="0" class="skm-cash-input khr-input" data-val="20000"></div>
                            <div class="skm-cash-item khr"><span class="skm-cash-label"><span style="color:#38bdf8;">៛</span>10,000</span><input type="number" min="0" value="0" class="skm-cash-input khr-input" data-val="10000"></div>
                            <div class="skm-cash-item khr"><span class="skm-cash-label"><span style="color:#38bdf8;">៛</span>5,000</span><input type="number" min="0" value="0" class="skm-cash-input khr-input" data-val="5000"></div>
                            <div class="skm-cash-item khr"><span class="skm-cash-label"><span style="color:#38bdf8;">៛</span>2,000</span><input type="number" min="0" value="0" class="skm-cash-input khr-input" data-val="2000"></div>
                            <div class="skm-cash-item khr"><span class="skm-cash-label"><span style="color:#38bdf8;">៛</span>1,000</span><input type="number" min="0" value="0" class="skm-cash-input khr-input" data-val="1000"></div>
                            <div class="skm-cash-item khr"><span class="skm-cash-label"><span style="color:#38bdf8;">៛</span>500</span><input type="number" min="0" value="0" class="skm-cash-input khr-input" data-val="500"></div>
                            <div class="skm-cash-item khr"><span class="skm-cash-label"><span style="color:#38bdf8;">៛</span>100</span><input type="number" min="0" value="0" class="skm-cash-input khr-input" data-val="100"></div>
                        </div>
                    </div>
                    
                    <!-- Total Box (សរុបពីរផ្នែក) -->
                    <div class="skm-total-box">
                        <div style="text-align: center;">
                            <div style="font-size: 13px; opacity: 0.8; font-family: 'Battambang'; margin-bottom: 5px;">សរុបដុល្លារ</div>
                            <div id="skmTotalUSD" style="font-size: 26px; font-weight: 800; color: #10b981; font-family: 'Arial';">$0.00</div>
                        </div>
                        <div style="width: 1px; height: 40px; background: rgba(128,128,128,0.3);"></div>
                        <div style="text-align: center;">
                            <div style="font-size: 13px; opacity: 0.8; font-family: 'Battambang'; margin-bottom: 5px;">សរុបរៀល</div>
                            <div id="skmTotalKHR" style="font-size: 26px; font-weight: 800; color: #38bdf8; font-family: 'Arial';">0 ៛</div>
                        </div>
                    </div>
                    
                    <button onclick="window.skmCloseCashModal()" style="width:100%; background:var(--bg-alt, rgba(128,128,128,0.1)); border:1px solid var(--border, rgba(128,128,128,0.2)); color:inherit; padding:12px; border-radius:12px; font-family:'Battambang'; cursor:pointer; font-weight:600; font-size:15px; transition:0.2s;" onmouseover="this.style.background='rgba(128,128,128,0.2)';" onmouseout="this.style.background='var(--bg-alt, rgba(128,128,128,0.1))';">បិទ (Close)</button>
                </div>
            `;
            document.body.appendChild(modal);

            // 💡 ចុចខាងក្រៅដើម្បីបិទ
            modal.addEventListener('mousedown', function(e) {
                if (e.target === modal) window.skmCloseCashModal();
            });

            // 💡 ចុច Esc ដើម្បីបិទ
            document.addEventListener('keydown', function(e) {
                if(e.key === 'Escape' && modal.style.display !== 'none') window.skmCloseCashModal();
            });

            let currentUsd = 0;
            let currentKhr = 0;
            const usdInputs = modal.querySelectorAll('.usd-input');
            const khrInputs = modal.querySelectorAll('.khr-input');
            const usdDisplay = document.getElementById('skmTotalUSD');
            const khrDisplay = document.getElementById('skmTotalKHR');
            
            const calculateSum = () => {
                let newUsd = 0;
                usdInputs.forEach(i => newUsd += (parseInt(i.value) || 0) * parseFloat(i.getAttribute('data-val')));
                
                let newKhr = 0;
                khrInputs.forEach(i => newKhr += (parseInt(i.value) || 0) * parseFloat(i.getAttribute('data-val')));
                
                if(newUsd !== currentUsd) {
                    animateValue(usdDisplay, currentUsd, newUsd, 300, 'USD');
                    currentUsd = newUsd;
                }
                if(newKhr !== currentKhr) {
                    animateValue(khrDisplay, currentKhr, newKhr, 300, 'KHR');
                    currentKhr = newKhr;
                }
            };

            const allInputs = modal.querySelectorAll('.skm-cash-input');
            allInputs.forEach(input => {
                input.addEventListener('input', calculateSum);
                input.addEventListener('focus', function() {
                    if(this.value === '0') this.select(); // Auto-Select ពេលយក Mouse ទៅចុច
                });
            });

            // មុខងារសម្អាត (Reset)
            document.getElementById('skm-btn-reset-cash').addEventListener('click', () => {
                allInputs.forEach(i => i.value = '0');
                calculateSum();
            });

        } else {
            modal.style.display = 'flex';
            setTimeout(() => { modal.style.opacity = '1'; }, 10);
            
            const glassPanel = modal.querySelector('.skm-cash-glass');
            glassPanel.style.animation = 'none';
            void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        setTimeout(() => { modal.style.opacity = '1'; }, 10);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('💵', 'រាប់សាច់ប្រាក់ (USD/KHR)', openCashCounter);
            clearInterval(initInt);
            console.log("✅ Adaptive Theme Cash Counter (USD + KHR) successfully registered!");
        }
    }, 500);
})();