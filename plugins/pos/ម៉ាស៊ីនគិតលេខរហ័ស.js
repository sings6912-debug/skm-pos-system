(function() {
    console.log("🧮 POS Premium Quick Calculator Plugin Initialized!");

    // មុខងារគណនាលទ្ធផល
    window.skmCalcResult = function() {
        const screen = document.getElementById('skm-calc-screen');
        try {
            if(screen.value.trim() === '') return;
            // គណនា និងបង្កត់ទសភាគបើវែងពេក
            let result = eval(screen.value);
            if (!Number.isInteger(result)) {
                result = parseFloat(result.toFixed(6)); // យក ៦ ខ្ទង់ក្រោយក្បៀស
            }
            screen.value = result;
        } catch(e) {
            screen.value = 'Error';
            setTimeout(() => { screen.value = ''; }, 1000);
        }
    };

    // មុខងារបិទម៉ាស៊ីនគិតលេខ
    window.skmCloseCalc = function() {
        const modal = document.getElementById('skm-calc-modal');
        if(modal) {
            modal.style.opacity = '0';
            modal.querySelector('.skm-calc-glass').style.transform = 'scale(0.95) translateY(20px)';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    };

    function openCalculator() {
        let modal = document.getElementById('skm-calc-modal');
        
        if(!modal) {
            // CSS រចនាបថ Premium
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes skmCalcEnter {
                    0% { transform: scale(0.9) translateY(20px); opacity: 0; filter: blur(10px); }
                    100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
                }
                
                .skm-calc-glass {
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(35px) saturate(150%);
                    -webkit-backdrop-filter: blur(35px) saturate(150%);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 28px;
                    padding: 30px;
                    width: 320px;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2);
                    animation: skmCalcEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    transition: transform 0.3s ease;
                }
                
                .skm-calc-screen {
                    width: 100%; height: 75px;
                    font-size: 36px; text-align: right;
                    margin-bottom: 25px; border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05); 
                    background: rgba(0,0,0,0.4); color: #10b981; 
                    padding: 10px 20px; outline: none;
                    font-family: 'Arial', monospace; letter-spacing: 2px;
                    box-shadow: inset 0 5px 15px rgba(0,0,0,0.5);
                    box-sizing: border-box;
                    text-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
                }
                
                .c-btn {
                    height: 65px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.05);
                    font-size: 24px; font-weight: 400; cursor: pointer; color: #f8fafc;
                    background: rgba(255,255,255,0.03); transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
                    font-family: 'Arial', sans-serif; display: flex; justify-content: center; align-items: center;
                    box-shadow: inset 0 0 0 rgba(255,255,255,0);
                }
                .c-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.15); transform: translateY(-2px); }
                .c-btn:active { background: rgba(255,255,255,0.2); transform: translateY(0) scale(0.92); box-shadow: inset 0 4px 10px rgba(0,0,0,0.2); }
                
                .c-btn.operator { color: #38bdf8; background: rgba(56, 189, 248, 0.08); border-color: rgba(56, 189, 248, 0.2); }
                .c-btn.operator:hover { background: rgba(56, 189, 248, 0.15); }
                
                .c-btn.clear { color: #ef4444; background: rgba(239, 68, 68, 0.08); border-color: rgba(239, 68, 68, 0.2); }
                .c-btn.clear:hover { background: rgba(239, 68, 68, 0.15); }
                
                .c-btn.equal { 
                    background: linear-gradient(135deg, #10b981, #059669); 
                    color: white; border: none; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); 
                }
                .c-btn.equal:hover { transform: translateY(-2px); box-shadow: 0 15px 25px rgba(16, 185, 129, 0.4); filter: brightness(1.1); }
            `;
            document.head.appendChild(style);

            modal = document.createElement('div');
            modal.id = 'skm-calc-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0, 0, 0, 0.5); z-index: 100000; 
                display: flex; justify-content: center; align-items: center; 
                backdrop-filter: blur(8px); opacity: 0; transition: opacity 0.3s ease;
            `;
            
            modal.innerHTML = `
                <div class="skm-calc-glass" id="skm-calc-container">
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <div style="color: #94a3b8; font-family: 'Battambang', sans-serif; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 18px;">🧮</span> ម៉ាស៊ីនគិតលេខ
                        </div>
                        <!-- ប៊ូតុង X តូចល្មម -->
                        <div onclick="window.skmCloseCalc()" style="color: rgba(255,255,255,0.4); cursor: pointer; font-size: 18px; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; background: rgba(255,255,255,0.05); transition: 0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='#fff';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.color='rgba(255,255,255,0.4)';">✕</div>
                    </div>

                    <input type="text" id="skm-calc-screen" readonly class="skm-calc-screen" placeholder="0">
                    
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                        <button class="c-btn clear" style="grid-column: span 2;" onclick="document.getElementById('skm-calc-screen').value=''">AC</button>
                        <button class="c-btn clear" onclick="let s=document.getElementById('skm-calc-screen'); s.value=s.value.slice(0,-1);">⌫</button>
                        <button class="c-btn operator" onclick="document.getElementById('skm-calc-screen').value+='/'">÷</button>
                        
                        <button class="c-btn num" onclick="document.getElementById('skm-calc-screen').value+='7'">7</button>
                        <button class="c-btn num" onclick="document.getElementById('skm-calc-screen').value+='8'">8</button>
                        <button class="c-btn num" onclick="document.getElementById('skm-calc-screen').value+='9'">9</button>
                        <button class="c-btn operator" onclick="document.getElementById('skm-calc-screen').value+='*'">×</button>
                        
                        <button class="c-btn num" onclick="document.getElementById('skm-calc-screen').value+='4'">4</button>
                        <button class="c-btn num" onclick="document.getElementById('skm-calc-screen').value+='5'">5</button>
                        <button class="c-btn num" onclick="document.getElementById('skm-calc-screen').value+='6'">6</button>
                        <button class="c-btn operator" onclick="document.getElementById('skm-calc-screen').value+='-'">-</button>
                        
                        <button class="c-btn num" onclick="document.getElementById('skm-calc-screen').value+='1'">1</button>
                        <button class="c-btn num" onclick="document.getElementById('skm-calc-screen').value+='2'">2</button>
                        <button class="c-btn num" onclick="document.getElementById('skm-calc-screen').value+='3'">3</button>
                        <button class="c-btn operator" onclick="document.getElementById('skm-calc-screen').value+='+'">+</button>
                        
                        <button class="c-btn num" style="grid-column: span 2;" onclick="document.getElementById('skm-calc-screen').value+='0'">0</button>
                        <button class="c-btn num" onclick="document.getElementById('skm-calc-screen').value+='.'">.</button>
                        <button class="c-btn equal" onclick="window.skmCalcResult()">=</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // 💡 មុខងារចុចខាងក្រៅដើម្បីបិទ (Click Outside)
            modal.addEventListener('mousedown', function(e) {
                // ប្រសិនបើកន្លែងដែលចុច គឺចំពីលើផ្ទៃខ្មៅ (modal background) មិនមែនចំក្ដារចុច
                if (e.target === modal) {
                    window.skmCloseCalc();
                }
            });

            // 💡 មុខងារទទួលការវាយពី Keyboard កុំព្យូទ័រ
            document.addEventListener('keydown', function(e) {
                const mod = document.getElementById('skm-calc-modal');
                if(!mod || mod.style.display === 'none') return; // បើម៉ាស៊ីនគិតលេខបិទ មិនបាច់ខ្វល់ទេ
                
                const screen = document.getElementById('skm-calc-screen');
                const key = e.key;
                
                // អនុញ្ញាតតែលេខ និងសញ្ញាគណិតវិទ្យា
                if (/[0-9\.\+\-\*\/]/.test(key)) {
                    screen.value += key;
                    e.preventDefault();
                } 
                // ចុច Enter ដើម្បីស្មើ
                else if (key === 'Enter' || key === '=') {
                    window.skmCalcResult();
                    e.preventDefault();
                } 
                // ចុច Backspace ដើម្បីលុបម្តងមួយខ្ទង់
                else if (key === 'Backspace') {
                    screen.value = screen.value.slice(0, -1);
                    e.preventDefault();
                } 
                // ចុច Esc ដើម្បីបិទម៉ាស៊ីនគិតលេខ
                else if (key === 'Escape') {
                    window.skmCloseCalc();
                    e.preventDefault();
                }
            });

        } else {
            // បើមានស្រាប់ គ្រាន់តែ Show និងលេងចលនាឡើងវិញ
            modal.style.display = 'flex';
            setTimeout(() => { modal.style.opacity = '1'; }, 10);
            
            const glassPanel = document.getElementById('skm-calc-container');
            glassPanel.style.animation = 'none';
            void glassPanel.offsetWidth; // Trigger reflow
            glassPanel.style.animation = 'skmCalcEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            
            // clear អេក្រង់ចោលពេលបើកថ្មី
            document.getElementById('skm-calc-screen').value = '';
        }

        // Delay តិចៗដើម្បីឱ្យ Animation opacity ដើរ
        setTimeout(() => { modal.style.opacity = '1'; }, 10);
    }

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🧮', 'ម៉ាស៊ីនគិតលេខរហ័ស', openCalculator);
            clearInterval(initInt);
            console.log("✅ Premium Quick Calculator successfully registered!");
        }
    }, 500);
})();