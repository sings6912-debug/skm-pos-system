(function() {
    // ⚡ ការពារកុំឱ្យកូដដំណើរការជាន់គ្នា២ដង
    if (window.skmPrivacyLockActive) return;
    window.skmPrivacyLockActive = true;

    console.log("🔒 POS Ultra-Premium Privacy Lock (V5 Smart Setup) Initialized!");

    // ==========================================
    // ⏱ ទាញយកនាទីដែលមេធ្លាប់កំណត់ពីប្រព័ន្ធ (បើអត់មាន យក ១០ នាទី)
    // ==========================================
    let LOCK_MINUTES = parseFloat(localStorage.getItem('skm_privacy_idle_time')) || 10; 
    
    let idleTimer;
    let isLocked = false;
    let pinCode = '';

    function getValidPin() {
        let validPin = '1234'; 
        if (window.activeUser && window.activeUser.pin && window.activeUser.pin !== '0000') {
            validPin = String(window.activeUser.pin).trim();
        } else if (window.sysSettings && window.sysSettings.storePin) {
            validPin = String(window.sysSettings.storePin).trim();
        }
        return validPin;
    }

    // ១. បញ្ចូលប៊ូតុងចាក់សោ
    function injectLockBtn() {
        const headerDisplay = document.getElementById('currentUserDisplay');
        if (!headerDisplay || document.getElementById('skm-privacy-btn-trigger')) return;
        
        const lockBtn = document.createElement('button');
        lockBtn.id = 'skm-privacy-btn-trigger';
        lockBtn.innerHTML = '🔒';
        lockBtn.title = 'ចាក់សោរអេក្រង់ (Lock Screen) - ចុច Ctrl+L';
        
        lockBtn.style.cssText = `
            background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4);
            width: 36px; height: 36px; border-radius: 50%; font-size: 14px; cursor: pointer;
            margin-left: 10px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: flex; 
            justify-content: center; align-items: center; padding: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05); flex-shrink: 0;
        `;
        lockBtn.onmouseover = () => { 
            lockBtn.style.background = '#ef4444'; lockBtn.style.color = '#fff';
            lockBtn.style.transform = 'scale(1.05)'; lockBtn.style.boxShadow = '0 5px 15px rgba(239, 68, 68, 0.3)';
        };
        lockBtn.onmouseout = () => { 
            lockBtn.style.background = 'rgba(239, 68, 68, 0.15)'; lockBtn.style.color = '#ef4444';
            lockBtn.style.transform = 'scale(1)'; lockBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
        };
        
        lockBtn.addEventListener('click', lockScreen);
        headerDisplay.parentNode.insertBefore(lockBtn, headerDisplay.nextSibling);
    }

    // ២. បង្កើតផ្ទាំង Lock Screen
    function createLockModal() {
        if(document.getElementById('skm-privacy-lock-modal')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            .skm-privacy-glass {
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.98));
                backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
                border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 28px; padding: 35px 30px; 
                width: 340px; box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.2); 
                text-align: center; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-family: 'Battambang', sans-serif; position: relative;
            }
            .skm-privacy-glass.shake { animation: skmPrivacyShake 0.4s both; border-color: #ef4444; }
            @keyframes skmPrivacyShake {
                10%, 90% { transform: translate3d(-2px, 0, 0); }
                20%, 80% { transform: translate3d(4px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
                40%, 60% { transform: translate3d(6px, 0, 0); }
            }
            .skm-privacy-icon {
                width: 70px; height: 70px; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1);
                border-radius: 50%; display: flex; justify-content: center; align-items: center;
                font-size: 30px; margin: 0 auto 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            }
            .skm-privacy-dots-container {
                display: flex; justify-content: center; gap: 15px; margin-bottom: 30px; height: 20px;
            }
            .skm-privacy-dot {
                width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2);
                transition: all 0.2s ease;
            }
            .skm-privacy-dot.filled {
                background: #10b981; border-color: #10b981; box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
            }
            .skm-privacy-dot.error {
                background: #ef4444; border-color: #ef4444; box-shadow: 0 0 12px rgba(239, 68, 68, 0.6);
            }
            .skm-privacy-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; justify-items: center; }
            .skm-privacy-btn {
                background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #fff;
                width: 65px; height: 65px; border-radius: 50%; font-size: 22px; font-weight: bold; 
                cursor: pointer; transition: all 0.2s; font-family: 'Nunito', sans-serif;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: flex; justify-content: center; align-items: center;
                user-select: none;
            }
            .skm-privacy-btn:hover { background: rgba(16, 185, 129, 0.2); border-color: #10b981; transform: translateY(-2px); }
            .skm-privacy-btn:active { transform: scale(0.9); }
            .skm-privacy-btn.clear { color: #f59e0b; font-size: 20px; }
            
            /* ⚡ រចនាប័ទ្មប៊ូតុងកង់ស្ពឺ (Settings) */
            .skm-privacy-settings-btn {
                position: absolute; top: 20px; right: 20px; font-size: 22px; cursor: pointer;
                color: rgba(255,255,255,0.3); transition: all 0.3s ease; padding: 5px; border-radius: 50%;
            }
            .skm-privacy-settings-btn:hover {
                color: #fff; background: rgba(255,255,255,0.1); transform: rotate(90deg);
            }
        `;
        document.head.appendChild(style);

        const modal = document.createElement('div');
        modal.id = 'skm-privacy-lock-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); 
            backdrop-filter: blur(8px); z-index: 2000000; display: none; justify-content: center; align-items: center;
            opacity: 0; transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="skm-privacy-glass" id="skm-privacy-box">
                <!-- ⚡ ប៊ូតុងកង់ស្ពឺសម្រាប់ដូរនាទី -->
                <div class="skm-privacy-settings-btn" id="skm-privacy-btn-setup" title="កំណត់នាទី Auto-Lock">⚙️</div>
                
                <div class="skm-privacy-icon">🔒</div>
                <h3 style="color:#fff; margin-bottom:5px; font-size:16px;">អេក្រង់ត្រូវបានចាក់សោរ</h3>
                <p id="skm-privacy-msg" style="color:#94a3b8; font-size:12px; margin-bottom:25px;">សូមបញ្ចូល PIN កូដដើម្បីបើកវិញ</p>
                
                <div class="skm-privacy-dots-container" id="skm-privacy-display">
                    <div class="skm-privacy-dot"></div>
                    <div class="skm-privacy-dot"></div>
                    <div class="skm-privacy-dot"></div>
                    <div class="skm-privacy-dot"></div>
                </div>
                
                <div class="skm-privacy-grid" id="skm-pin-keypad">
                    <button class="skm-privacy-btn" data-val="1">1</button>
                    <button class="skm-privacy-btn" data-val="2">2</button>
                    <button class="skm-privacy-btn" data-val="3">3</button>
                    <button class="skm-privacy-btn" data-val="4">4</button>
                    <button class="skm-privacy-btn" data-val="5">5</button>
                    <button class="skm-privacy-btn" data-val="6">6</button>
                    <button class="skm-privacy-btn" data-val="7">7</button>
                    <button class="skm-privacy-btn" data-val="8">8</button>
                    <button class="skm-privacy-btn" data-val="9">9</button>
                    <button class="skm-privacy-btn clear" data-val="clear">⌫</button>
                    <button class="skm-privacy-btn" data-val="0">0</button>
                    <button class="skm-privacy-btn" style="visibility:hidden;"></button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // ចាប់យកការចុចលើ Numpad
        const keypad = document.getElementById('skm-pin-keypad');
        if (keypad) {
            keypad.addEventListener('click', function(e) {
                const btn = e.target.closest('.skm-privacy-btn');
                if (!btn) return;
                
                const val = btn.getAttribute('data-val');
                if (val === 'clear') {
                    clearPin();
                } else if (val !== null) {
                    enterPin(parseInt(val));
                }
            });
        }

        // ⚡ ចាប់យកការចុចលើប៊ូតុងកង់ស្ពឺ (Settings)
        const setupBtn = document.getElementById('skm-privacy-btn-setup');
        if (setupBtn) {
            setupBtn.addEventListener('click', function() {
                const currentValidPin = getValidPin();
                const pin = prompt("🔒 សូមបញ្ចូលលេខសម្ងាត់ (PIN) ដើម្បីចូលទៅការកំណត់៖");
                
                if (pin === currentValidPin) {
                    let mins = prompt(`⏱️ តើចង់ឱ្យប្រព័ន្ធចាក់សោរដោយស្វ័យប្រវត្តិ បើទុកចោលប៉ុន្មាននាទី?\n(បច្ចុប្បន្ន: ${LOCK_MINUTES} នាទី | វាយលេខ 0 ដើម្បីបិទ)`);
                    if (mins !== null && !isNaN(mins) && mins >= 0) {
                        LOCK_MINUTES = parseFloat(mins);
                        localStorage.setItem('skm_privacy_idle_time', LOCK_MINUTES); // Save ទុក
                        alert(`✅ បានកំណត់ Auto-Lock រយៈពេល ${LOCK_MINUTES} នាទី រួចរាល់!`);
                        resetIdleTimer();
                    }
                } else if (pin !== null) {
                    alert("❌ លេខសម្ងាត់មិនត្រឹមត្រូវ!");
                }
            });
        }
    }

    // ៣. ចាប់យកការចុចលើ Keyboard តែម្តងគត់
    document.addEventListener('keydown', function(e) {
        if (isLocked) {
            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault(); 
                enterPin(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                e.preventDefault(); 
                clearPin();
            }
        } else {
            // ចុច Ctrl + L ដើម្បី Lock
            if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
                e.preventDefault();
                lockScreen();
            }
        }
    });

    // ៤. មុខងារចាក់សោ និង ដោះសោ
    function lockScreen() {
        createLockModal();
        isLocked = true;
        pinCode = '';
        updatePinDisplay();
        
        const msg = document.getElementById('skm-privacy-msg');
        if(msg) {
            msg.innerText = 'សូមបញ្ចូល PIN កូដដើម្បីបើកវិញ';
            msg.style.color = '#94a3b8';
        }

        const modal = document.getElementById('skm-privacy-lock-modal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => { modal.style.opacity = '1'; }, 10);
            document.getElementById('skm-privacy-box').classList.remove('shake');
        }
    }

    function enterPin(num) {
        if (!isLocked) return;
        if (pinCode.length < 4) {
            pinCode += num;
            updatePinDisplay();
            if (pinCode.length === 4) {
                setTimeout(verifyPin, 150);
            }
        }
    }

    function clearPin() {
        if (!isLocked) return;
        pinCode = pinCode.slice(0, -1);
        updatePinDisplay();
    }

    function updatePinDisplay() {
        const modal = document.getElementById('skm-privacy-lock-modal');
        if(!modal) return;
        const dots = modal.querySelectorAll('.skm-privacy-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('error'); 
            if (index < pinCode.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    function verifyPin() {
        try {
            let validPin = getValidPin();
            const msg = document.getElementById('skm-privacy-msg');
            const dots = document.getElementById('skm-privacy-lock-modal').querySelectorAll('.skm-privacy-dot');

            if (pinCode === validPin) {
                msg.innerText = '✅ បានដោះសោរជោគជ័យ';
                msg.style.color = '#38bdf8';
                setTimeout(() => {
                    isLocked = false;
                    const modal = document.getElementById('skm-privacy-lock-modal');
                    if(modal) {
                        modal.style.opacity = '0';
                        setTimeout(() => { modal.style.display = 'none'; }, 300);
                    }
                    resetIdleTimer();
                }, 300);
            } else {
                const box = document.getElementById('skm-privacy-box');
                box.classList.add('shake');
                msg.innerText = '❌ ខុសលេខកូដហើយ!';
                msg.style.color = '#ef4444';
                
                dots.forEach(dot => dot.classList.add('error'));

                setTimeout(() => {
                    pinCode = '';
                    box.classList.remove('shake');
                    msg.innerText = 'សូមបញ្ចូល PIN កូដដើម្បីបើកវិញ';
                    msg.style.color = '#94a3b8';
                    updatePinDisplay();
                }, 800);
            }
        } catch(err) {
            pinCode = ''; 
            updatePinDisplay();
        }
    }

    // ៥. មុខងារចាក់សោរស្វ័យប្រវត្តិ (Auto-Lock)
    function resetIdleTimer() {
        if (isLocked) return;
        clearTimeout(idleTimer);
        
        // បើ LOCK_MINUTES = 0 គឺមិនបាច់ Lock ទេ
        if (LOCK_MINUTES > 0) {
            const timeoutMS = LOCK_MINUTES * 60 * 1000;
            idleTimer = setTimeout(lockScreen, timeoutMS);
        }
    }

    // តាមដានសកម្មភាពអូសទាញចុចរបស់អ្នកប្រើ
    ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
        document.addEventListener(evt, resetIdleTimer);
    });

    // ៦. ដំណើរការប្រព័ន្ធ
    const initInt = setInterval(() => {
        if (document.getElementById('currentUserDisplay')) {
            injectLockBtn();
            resetIdleTimer();
            clearInterval(initInt);
        }
    }, 1000);
})();