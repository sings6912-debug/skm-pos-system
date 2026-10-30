(function() {
    console.log("🧮 POS Ultra-Premium Mini Calculator Initialized!");
    
    function injectCalcBtn() {
        const headerDisplay = document.getElementById('currentUserDisplay');
        if (!headerDisplay || document.getElementById('skm-calc-btn')) return;
        
        const calcBtn = document.createElement('button');
        calcBtn.id = 'skm-calc-btn';
        calcBtn.innerHTML = '🧮'; 
        calcBtn.title = 'ម៉ាស៊ីនគិតលេខ (Calculator)';
        
        calcBtn.style.cssText = `
            background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4);
            width: 36px; height: 36px; border-radius: 50%; font-size: 16px; cursor: pointer;
            margin-left: 10px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: flex; 
            justify-content: center; align-items: center; padding: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05); flex-shrink: 0;
        `;
        calcBtn.onmouseover = () => { 
            calcBtn.style.background = '#f59e0b'; 
            calcBtn.style.color = '#fff';
            calcBtn.style.transform = 'scale(1.05)'; 
            calcBtn.style.boxShadow = '0 5px 15px rgba(245, 158, 11, 0.3)';
        };
        calcBtn.onmouseout = () => { 
            calcBtn.style.background = 'rgba(245, 158, 11, 0.15)'; 
            calcBtn.style.color = '#f59e0b';
            calcBtn.style.transform = 'scale(1)'; 
            calcBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
        };
        
        calcBtn.onclick = openCalculator;
        headerDisplay.parentNode.insertBefore(calcBtn, headerDisplay.nextSibling);
    }

    window.skmCloseCalculator = function() {
        const modal = document.getElementById('skm-calc-modal');
        if(modal) {
            modal.style.opacity = '0';
            const glass = modal.querySelector('.skm-calc-glass');
            if(glass) glass.style.transform = 'scale(0.95) translateY(15px)';
            setTimeout(() => { modal.style.display = 'none'; }, 200);
        }
    };

    function openCalculator() {
        if(typeof window.skmCloseAllModals === 'function') window.skmCloseAllModals();

        let modal = document.getElementById('skm-calc-modal');
        if(!modal) {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmModalEnter {
                    0% { transform: scale(0.9) translateY(15px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                .skm-calc-glass {
                    background: var(--bg-card, rgba(255, 255, 255, 0.98)); color: var(--text-main, #1e293b);
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
                    border-radius: 20px; padding: 20px; width: 300px;
                    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                    animation: skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: 'Nunito', sans-serif;
                }
                
                @media (prefers-color-scheme: dark) {
                    .skm-calc-glass {
                        background: var(--bg-card, rgba(15, 23, 42, 0.98)); color: var(--text-main, #f8fafc);
                        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    }
                }
                
                .skm-calc-screen {
                    width: 100%; height: 60px; font-size: 28px; font-weight: 800; text-align: right; 
                    margin-bottom: 15px; border-radius: 12px; border: 1px solid var(--border, rgba(128,128,128,0.2)); 
                    background: var(--bg-input, #f8fafc); color: var(--text-main); padding: 5px 15px; 
                    outline: none; font-family: 'Nunito', sans-serif; letter-spacing: 1px;
                }
                @media (prefers-color-scheme: dark) { .skm-calc-screen { background: rgba(0,0,0,0.3); color: #10b981; } }
                
                .skm-c-btn { 
                    height: 50px; border-radius: 12px; border: none; font-size: 20px; font-weight: 800; 
                    cursor: pointer; transition: 0.15s cubic-bezier(0.4, 0, 0.2, 1); font-family: 'Nunito', sans-serif;
                    background: var(--bg-alt, rgba(128,128,128,0.08)); color: var(--text-main);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                .skm-c-btn:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 5px 10px rgba(0,0,0,0.1); }
                .skm-c-btn:active { transform: translateY(0) scale(0.95); box-shadow: none; }
                
                .skm-c-btn.op { background: rgba(56, 189, 248, 0.15); color: #0ea5e9; }
                .skm-c-btn.clear { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
                .skm-c-btn.eq { background: linear-gradient(135deg, #10b981, #059669); color: white; box-shadow: 0 4px 15px rgba(16,185,129,0.3); }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skm-calc-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5); z-index: 100000; display: flex;
                justify-content: center; align-items: center; backdrop-filter: blur(3px);
                opacity: 0; transition: opacity 0.2s ease;
            `;
            
            // ⚡ FIX: កែពណ៌ប៊ូតុងខ្វែង (X) ឱ្យចេញជាពណ៌ក្រហមព្រាលៗ ដើម្បីមើលឃើញច្បាស់ជានិច្ច
            modal.innerHTML = `
                <div class="skm-calc-glass">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h3 style="margin:0; font-size:16px; font-weight:800; color:var(--text-muted);">🧮 Calculator</h3>
                        <div onclick="window.skmCloseCalculator()" style="background:rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color:#ef4444; width:28px; height:28px; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size: 12px; transition:0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'; this.style.color='#ef4444';">✕</div>
                    </div>
                    
                    <input type="text" id="skm-calc-screen" class="skm-calc-screen" readonly placeholder="0">
                    
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                        <button class="skm-c-btn clear" style="grid-column: span 2;" onclick="window.skmCalcAction('C')">C</button>
                        <button class="skm-c-btn op" onclick="window.skmCalcAction('/')">÷</button>
                        <button class="skm-c-btn op" onclick="window.skmCalcAction('*')">×</button>
                        
                        <button class="skm-c-btn" onclick="window.skmCalcAction('7')">7</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('8')">8</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('9')">9</button>
                        <button class="skm-c-btn op" onclick="window.skmCalcAction('-')">-</button>
                        
                        <button class="skm-c-btn" onclick="window.skmCalcAction('4')">4</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('5')">5</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('6')">6</button>
                        <button class="skm-c-btn op" onclick="window.skmCalcAction('+')">+</button>
                        
                        <button class="skm-c-btn" onclick="window.skmCalcAction('1')">1</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('2')">2</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('3')">3</button>
                        <button class="skm-c-btn eq" style="grid-row: span 2;" onclick="window.skmCalcAction('=')">=</button>
                        
                        <button class="skm-c-btn" style="grid-column: span 2;" onclick="window.skmCalcAction('0')">0</button>
                        <button class="skm-c-btn" onclick="window.skmCalcAction('.')">.</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // ចុចខាងក្រៅ ឬចុច Esc ដើម្បីបិទ
            modal.addEventListener('mousedown', function(e) { if (e.target === modal) window.skmCloseCalculator(); });
            document.addEventListener('keydown', function(e) { 
                if (modal.style.display !== 'none') {
                    if (e.key === 'Escape') window.skmCloseCalculator(); 
                    
                    // អនុញ្ញាតឱ្យវាយបញ្ចូលពី Keyboard បាន (NumPad)
                    const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/'];
                    if (allowedKeys.includes(e.key)) window.skmCalcAction(e.key);
                    if (e.key === 'Enter' || e.key === '=') window.skmCalcAction('=');
                    if (e.key === 'Backspace' || e.key === 'Delete') window.skmCalcAction('C');
                }
            });

            // មុខងារគណនាសុវត្ថិភាព (ជំនួស eval)
            window.skmCalcAction = function(val) {
                const screen = document.getElementById('skm-calc-screen');
                if (!screen) return;
                
                if (val === 'C') {
                    screen.value = '';
                } else if (val === '=') {
                    try {
                        if (screen.value.trim() === '') return;
                        const result = new Function('return ' + screen.value)();
                        screen.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(4)); 
                    } catch(e) {
                        screen.value = 'Error';
                        setTimeout(() => screen.value = '', 1000);
                    }
                } else {
                    if (screen.value === 'Error') screen.value = '';
                    screen.value += val;
                }
            };
            
        } else {
            modal.style.display = 'flex';
            const glassPanel = modal.querySelector('.skm-calc-glass');
            glassPanel.style.animation = 'none'; void glassPanel.offsetWidth; 
            glassPanel.style.animation = 'skmModalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        setTimeout(() => { modal.style.opacity = '1'; }, 10);
    }

    const initInt = setInterval(() => {
        if (document.getElementById('currentUserDisplay')) {
            injectCalcBtn();
            clearInterval(initInt);
            console.log("✅ Ultra-Premium Mini Calculator successfully injected!");
        }
    }, 1000);
})();