(function() {
    // ⚡ ការពារមិនឱ្យកូដដំណើរការជាន់គ្នា (Anti-Duplicate & Anti-Lag Guard)
    if (window.skmCgiLockV5) return;
    window.skmCgiLockV5 = true;

    console.log("🚀 POS OS-Level CGI Lock (VVIP MacOS Style) Initialized!");

    const DEFAULT_PIN = "1234"; 
    // ⚡ វានឹងទាញយកនាទីដែលមេធ្លាប់បានកំណត់ បើអត់មាន វាប្រើ ៥ នាទីជាស្តង់ដារ
    let IDLE_TIMEOUT_MINUTES = parseFloat(localStorage.getItem('pos_idle_time')) || 5; 

    let idleTimer, clockInterval, sleepTimer;
    let isLocked = false, isLoginMode = false;
    let currentEnteredPin = ""; 
    
    let cgiAnimationId;
    let isWarpSpeed = false;
    let canvas, ctx;
    let stars = [];
    let w, h;

    // ==========================================
    // 🎨 1. បញ្ចូលរចនាប័ទ្ម (VVIP Glassmorphism CSS)
    // ==========================================
    if(document.getElementById('skm-cgi-lock-style')) document.getElementById('skm-cgi-lock-style').remove();
    const style = document.createElement('style');
    style.id = 'skm-cgi-lock-style';
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500&display=swap');
        
        @keyframes osLockEnter { 0% { transform: scale(1.15); filter: blur(20px); opacity: 0; } 100% { transform: scale(1); filter: blur(0px); opacity: 1; } }
        @keyframes osWarpExit { 0% { transform: scale(1); filter: blur(0px); opacity: 1; } 100% { transform: scale(4); filter: blur(25px); opacity: 0; } }
        @keyframes numpadDrop { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(120px) scale(0.9); opacity: 0; } }
        @keyframes numpadRise { 0% { transform: translateY(40px) scale(0.95); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes skmBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes skmPulseTap { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-8px); opacity: 1; } }
        @keyframes iconBounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.5); } }
        @keyframes skmShakeError { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-12px); } 40%, 80% { transform: translateX(12px); } }
        
        .skm-error-shake { animation: skmShakeError 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
        
        /* Premium Compact Numpad */
        .skm-numpad-btn {
            width: 65px; height: 65px; border-radius: 50%;
            background: rgba(255, 255, 255, 0.03); 
            border: 1px solid rgba(255, 255, 255, 0.08);
            display: flex; justify-content: center; align-items: center;
            font-size: 28px; font-weight: 300; color: #fff; cursor: pointer; 
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none; font-family: 'Outfit', sans-serif;
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.05);
        }
        .skm-numpad-btn:hover { background: rgba(255,255,255,0.12); transform: scale(1.08); border-color: rgba(255,255,255,0.2); }
        .skm-numpad-btn:active { background: rgba(255,255,255,0.3); transform: scale(0.9); box-shadow: 0 0 15px rgba(255,255,255,0.4); }
        
        .skm-pin-dot { 
            width: 14px; height: 14px; border-radius: 50%; 
            border: 1.5px solid rgba(255,255,255,0.3); 
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        .skm-pin-dot.filled { 
            background: #fff; border-color: #fff; 
            box-shadow: 0 0 15px rgba(255,255,255,0.8); 
            transform: scale(1.3); 
        }
        
        .skm-glass-panel {
            background: rgba(10, 15, 25, 0.55); 
            backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
            border: 1px solid rgba(255,255,255,0.15); border-radius: 40px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.2); 
            padding: 40px 35px;
        }

        #skm-cgi-canvas { transition: filter 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 🖥️ 2. បង្កើត UI ទុកជាមុន (Pre-build HTML)
    // ==========================================
    if(document.getElementById('skm-master-lock-overlay')) document.getElementById('skm-master-lock-overlay').remove();
    const overlay = document.createElement('div');
    overlay.id = 'skm-master-lock-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        z-index: 100000; display: none; flex-direction: column; 
        justify-content: center; align-items: center; color: white; 
        font-family: 'Outfit', 'Battambang', sans-serif; overflow: hidden;
        background: #000;
    `;
    
    overlay.innerHTML = `
        <!-- HTML5 Canvas Background -->
        <canvas id="skm-cgi-canvas" style="position: absolute; top:0; left:0; width:100%; height:100%; z-index: 1;"></canvas>
        
        <!-- ⚙️ នេះជាប៊ូតុងកង់ស្ពឺសម្រាប់ចុចដូរនាទី Auto-Lock -->
        <div id="skm-btn-autolock-setup" style="position: absolute; top: 30px; right: 30px; cursor: pointer; color: rgba(255,255,255,0.4); font-size: 26px; z-index: 30; padding: 10px; transition: 0.3s;" onmouseover="this.style.color='#fff'; this.style.transform='rotate(90deg)';" onmouseout="this.style.color='rgba(255,255,255,0.4)'; this.style.transform='rotate(0deg)';">⚙️</div>

        <!-- ដំណាក់កាលទី១: Screensaver (Apple Style) -->
        <div id="skm-stage1-wrapper" style="position: absolute; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; cursor: pointer; transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);">
            <div id="skm-lock-icon" style="font-size: 40px; margin-bottom: 15px; filter: drop-shadow(0 0 15px rgba(255,255,255,0.4));">🔒</div>
            <div class="skm-lock-time" style="font-size: 130px; font-weight: 200; line-height: 1; letter-spacing: -4px; text-shadow: 0 10px 40px rgba(0,0,0,0.5);">--:--</div>
            <div class="skm-lock-date" style="font-size: 16px; color: rgba(255,255,255,0.8); letter-spacing: 4px; margin-top: 15px; font-weight: 400; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">...</div>
            <div style="margin-top: 80px; font-size: 15px; font-weight: 400; letter-spacing: 1.5px; animation: skmPulseTap 2.5s infinite; font-family: 'Battambang'; color: rgba(255,255,255,0.9); display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); padding: 10px 25px; border-radius: 30px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);">
                <span style="font-size: 22px;">👆</span> ប៉ះអេក្រង់ដើម្បីដោះសោរ
            </div>
        </div>

        <!-- ដំណាក់កាលទី២: ផ្ទាំងក្ដារចុច (Glassmorphism Numpad) -->
        <div id="skm-stage2-wrapper" class="skm-glass-panel" style="position: absolute; z-index: 20; display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 320px; opacity: 0; transform: translateY(40px) scale(0.95); pointer-events: none; transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);">
            
            <div style="font-size: 14px; font-weight: bold; letter-spacing: 1px; margin-bottom: 30px; color: #fff; font-family: 'Battambang'; text-shadow: 0 2px 5px rgba(0,0,0,0.5);">សូមបញ្ចូលលេខសម្ងាត់</div>
            
            <div id="skm-pin-dots-container" style="display: flex; gap: 20px; margin-bottom: 35px;">
                <div class="skm-pin-dot" id="dot-1"></div>
                <div class="skm-pin-dot" id="dot-2"></div>
                <div class="skm-pin-dot" id="dot-3"></div>
                <div class="skm-pin-dot" id="dot-4"></div>
            </div>
            
            <div id="skm-lock-error" style="color: #ef4444; font-size: 12px; height: 16px; opacity: 0; transition: 0.3s; margin-bottom: 20px; font-family: 'Battambang'; font-weight: bold; text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);">លេខសម្ងាត់មិនត្រឹមត្រូវ!</div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px 22px; justify-items: center;">
                <div class="skm-numpad-btn" data-val="1">1</div>
                <div class="skm-numpad-btn" data-val="2">2</div>
                <div class="skm-numpad-btn" data-val="3">3</div>
                <div class="skm-numpad-btn" data-val="4">4</div>
                <div class="skm-numpad-btn" data-val="5">5</div>
                <div class="skm-numpad-btn" data-val="6">6</div>
                <div class="skm-numpad-btn" data-val="7">7</div>
                <div class="skm-numpad-btn" data-val="8">8</div>
                <div class="skm-numpad-btn" data-val="9">9</div>
                <div class="skm-numpad-btn" id="skm-btn-cancel" style="font-size: 13px; font-family: 'Battambang'; font-weight: bold; color: rgba(255,255,255,0.6); background: transparent; border: none; box-shadow: none;">បោះបង់</div>
                <div class="skm-numpad-btn" data-val="0">0</div>
                <div class="skm-numpad-btn" id="skm-btn-delete" style="font-size: 22px; color: #fca5a5; background: transparent; border: none; box-shadow: none;">⌫</div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // ==========================================
    // ⏱️ 3. មុខងារនាឡិកា និង CGI Canvas
    // ==========================================
    function startClock() {
        const timeEls = document.querySelectorAll('.skm-lock-time');
        const dateEls = document.querySelectorAll('.skm-lock-date');
        
        function updateTime() {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            hours = hours % 12; hours = hours ? hours : 12; 
            let hStr = hours < 10 ? '0' + hours : hours;
            let mStr = minutes < 10 ? '0' + minutes : minutes;
            
            timeEls.forEach(el => {
                el.innerHTML = `${hStr}<span style="opacity: 0.3; animation: skmBlink 2s infinite;">:</span>${mStr}`;
            });
            
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEls.forEach(el => {
                el.innerText = now.toLocaleDateString('km-KH', options) + " | " + now.toLocaleDateString('en-US', options).toUpperCase();
            });
        }
        updateTime();
        clearInterval(clockInterval);
        clockInterval = setInterval(updateTime, 1000);
    }

    /* ⚡ Optimized CGI Wallpaper ធានាថាមិនស៊ីថ្ម និងមិនគាំង */
    function startCGIWallpaper() {
        canvas = document.getElementById('skm-cgi-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            if(!isLocked) return;
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        });

        // បង្កើតគ្រាប់ផ្កាយ ៣០០ គ្រាប់
        stars = Array(300).fill().map(() => ({
            x: Math.random() * w - w/2,
            y: Math.random() * h - h/2,
            z: Math.random() * 1000
        }));

        function drawCGI() {
            if(!isLocked) return; // ⚡ បញ្ឈប់ការ Render ដាច់ខាតពេលដោះសោររួច (Anti-Lag / Battery Saver)
            
            // ពណ៌ Background លំហអាកាស (Dark Navy)
            ctx.fillStyle = 'rgba(2, 6, 23, 0.6)'; 
            ctx.fillRect(0, 0, w, h);
            
            let cx = w / 2;
            let cy = h / 2;
            let speed = isWarpSpeed ? 80 : 1.5; 

            stars.forEach(star => {
                star.z -= speed;
                if (star.z <= 0) {
                    star.x = Math.random() * w - w/2;
                    star.y = Math.random() * h - h/2;
                    star.z = 1000;
                }

                let x = cx + star.x / (star.z / 200);
                let y = cy + star.y / (star.z / 200);
                let radius = (1 - star.z / 1000) * 2.8;

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                
                if (isWarpSpeed) {
                    // ពន្លឺ Warp Speed
                    ctx.fillStyle = `rgba(255, 255, 255, ${1 - star.z/1000})`;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#fff';
                } else {
                    // ពន្លឺផ្កាយធម្មតា (Cyan/Blue)
                    ctx.fillStyle = `rgba(56, 189, 248, ${1 - star.z/1000})`; 
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#38bdf8';
                }
                ctx.fill();

                if (isWarpSpeed) {
                    let prevX = cx + star.x / ((star.z + speed*2.5) / 200);
                    let prevY = cy + star.y / ((star.z + speed*2.5) / 200);
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(prevX, prevY);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 - star.z/1000})`;
                    ctx.lineWidth = radius;
                    ctx.stroke();
                }
            });

            cgiAnimationId = requestAnimationFrame(drawCGI);
        }
        
        cancelAnimationFrame(cgiAnimationId);
        drawCGI();
    }

    // ==========================================
    // ⚙️ 4. គ្រប់គ្រង Stage 1 ទៅ Stage 2
    // ==========================================
    const stage1 = document.getElementById('skm-stage1-wrapper');
    const stage2 = document.getElementById('skm-stage2-wrapper');
    const bglayer = document.getElementById('skm-cgi-canvas');

    function showLoginPanel() {
        if(isLoginMode) return;
        isLoginMode = true;
        
        bglayer.style.filter = 'blur(18px)';
        
        stage1.style.opacity = '0';
        stage1.style.transform = 'translateY(-15vh) scale(0.9)';
        stage1.style.pointerEvents = 'none';
        
        stage2.style.animation = 'numpadRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        stage2.style.pointerEvents = 'auto';
        
        resetSleepTimer(); 
    }

    function hideLoginPanel() {
        if(!isLoginMode) return;
        isLoginMode = false;
        
        bglayer.style.filter = 'blur(0px)';
        
        stage1.style.opacity = '1';
        stage1.style.transform = 'translateY(0) scale(1)';
        stage1.style.pointerEvents = 'auto';
        
        stage2.style.animation = 'none';
        stage2.style.opacity = '0';
        stage2.style.transform = 'translateY(40px) scale(0.95)';
        stage2.style.pointerEvents = 'none';
        
        clearPin();
        clearTimeout(sleepTimer);
    }

    stage1.addEventListener('click', showLoginPanel);
    document.getElementById('skm-btn-cancel').addEventListener('click', (e) => {
        e.stopPropagation();
        hideLoginPanel();
    });

    // ==========================================
    // ⌨️ 5. ប្រព័ន្ធបញ្ចូលលេខសម្ងាត់ (Numpad)
    // ==========================================
    function updateDots() {
        for(let i = 1; i <= 4; i++) {
            const dot = document.getElementById(`dot-${i}`);
            if(!dot) continue;
            if(i <= currentEnteredPin.length) dot.classList.add('filled');
            else dot.classList.remove('filled');
        }
    }

    function clearPin() {
        currentEnteredPin = ""; updateDots();
        const err = document.getElementById('skm-lock-error');
        if(err) err.style.opacity = '0';
    }

    function handlePinSubmit() {
        const savedPin = localStorage.getItem('pos_lock_pin') || DEFAULT_PIN;
        const errorMsg = document.getElementById('skm-lock-error');
        const dotsContainer = document.getElementById('skm-pin-dots-container');
        const lockIcon = document.getElementById('skm-lock-icon');
        
        if (currentEnteredPin === savedPin || (savedPin.length > 4 && currentEnteredPin === DEFAULT_PIN.substring(0,4))) {
            // 🎬 ចាប់ផ្តើម Warp Speed Sequence
            lockIcon.innerText = '🔓';
            lockIcon.style.animation = 'iconBounce 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            
            setTimeout(() => {
                stage2.style.animation = 'numpadDrop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
                isWarpSpeed = true; 
            }, 200);

            setTimeout(() => {
                overlay.style.animation = 'osWarpExit 0.6s cubic-bezier(0.5, 0, 0, 1) forwards';
            }, 600);

            setTimeout(() => {
                overlay.style.display = 'none';
                cancelAnimationFrame(cgiAnimationId); // ⚡ បិទ GPU Rendering
                isLocked = false; 
                clearInterval(clockInterval); 
                currentEnteredPin = "";
                updateDots();
                resetIdleTimer();
            }, 1200);

        } else {
            if(errorMsg) errorMsg.style.opacity = '1';
            if(dotsContainer) {
                dotsContainer.classList.remove('skm-error-shake');
                void dotsContainer.offsetWidth;
                dotsContainer.classList.add('skm-error-shake');
            }
            setTimeout(() => { clearPin(); }, 400);
        }
    }

    // On-Screen Numpad
    overlay.addEventListener('click', (e) => {
        const btn = e.target.closest('.skm-numpad-btn[data-val]');
        if (btn && isLocked && !isWarpSpeed) {
            resetSleepTimer();
            const val = btn.getAttribute('data-val');
            if (currentEnteredPin.length < 4) {
                currentEnteredPin += val;
                updateDots();
                if (currentEnteredPin.length === 4) handlePinSubmit();
            }
        }
    });

    document.getElementById('skm-btn-delete').addEventListener('click', () => {
        if (currentEnteredPin.length > 0 && !isWarpSpeed) {
            resetSleepTimer();
            currentEnteredPin = currentEnteredPin.slice(0, -1);
            updateDots();
        }
    });

    // Physical Keyboard
    document.addEventListener('keydown', (e) => {
        if (!isLocked || isWarpSpeed) return;
        
        if (!isLoginMode && (e.key === 'Enter' || e.key === ' ')) {
            showLoginPanel();
            return;
        }

        if(!isLoginMode) return;
        resetSleepTimer();
        
        if (e.key >= '0' && e.key <= '9' && currentEnteredPin.length < 4) {
            currentEnteredPin += e.key;
            updateDots();
            if (currentEnteredPin.length === 4) handlePinSubmit();
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            if (currentEnteredPin.length > 0) {
                currentEnteredPin = currentEnteredPin.slice(0, -1);
                updateDots();
            }
        } else if (e.key === 'Escape') {
            hideLoginPanel();
        }
    });

    // ==========================================
    // ⚙️ 6. ការកំណត់ (Settings) និង Idle Timer
    // ==========================================
    // ⚡ នេះជាកន្លែងដែលមេអាចចុចលើកង់ស្ពឺ ដើម្បីកែចំនួននាទី!
    document.getElementById('skm-btn-autolock-setup').addEventListener('click', function() {
        const pin = prompt("🔒 សូមបញ្ចូលលេខសម្ងាត់ (PIN) ដើម្បីចូលទៅការកំណត់៖");
        if (pin === (localStorage.getItem('pos_lock_pin') || DEFAULT_PIN)) {
            let mins = prompt(`⏱️ តើចង់ឱ្យប្រព័ន្ធចាក់សោរដោយស្វ័យប្រវត្តិ បើទុកចោលប៉ុន្មាននាទី?\n(បច្ចុប្បន្ន: ${IDLE_TIMEOUT_MINUTES} នាទី | វាយលេខ 0 ដើម្បីបិទ Auto-Lock)`);
            if(mins !== null && !isNaN(mins) && mins >= 0) {
                IDLE_TIMEOUT_MINUTES = parseFloat(mins);
                localStorage.setItem('pos_idle_time', IDLE_TIMEOUT_MINUTES);
                alert(`✅ បានកំណត់ Auto-Lock រយៈពេល ${IDLE_TIMEOUT_MINUTES} នាទី រួចរាល់!`);
                resetIdleTimer();
            }
        } else if (pin !== null) alert("❌ លេខសម្ងាត់មិនត្រឹមត្រូវ!");
    });

    // បិទក្ដារចុច បើទុកចោល ២០ វិនាទី
    function resetSleepTimer() {
        clearTimeout(sleepTimer);
        if (isLocked && isLoginMode) {
            sleepTimer = setTimeout(() => {
                document.getElementById('skm-btn-cancel').click(); 
            }, 20000); 
        }
    }

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        if (IDLE_TIMEOUT_MINUTES > 0 && !isLocked) {
            let timeoutMS = IDLE_TIMEOUT_MINUTES * 60 * 1000; 
            idleTimer = setTimeout(() => {
                if (!isLocked) window.openLockScreen();
            }, timeoutMS);
        }
    }

    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    events.forEach(event => document.addEventListener(event, resetIdleTimer, true));

    // ==========================================
    // 🚀 7. ដំណើរការប្រព័ន្ធបញ្ជា (Main Executor)
    // ==========================================
    window.openLockScreen = function() {
        if (isLocked) return;
        isLocked = true;
        isLoginMode = false;
        currentEnteredPin = "";
        isWarpSpeed = false; 

        overlay.style.display = 'flex';
        
        // Reset ទៅ Stage 1
        bglayer.style.filter = 'blur(0px)';
        stage1.style.opacity = '1';
        stage1.style.transform = 'translateY(0) scale(1)';
        stage1.style.pointerEvents = 'auto';
        
        stage2.style.animation = 'none';
        stage2.style.opacity = '0';
        stage2.style.transform = 'translateY(40px) scale(0.95)';
        stage2.style.pointerEvents = 'none';
        
        // លោតចូល
        const lockIcon = document.getElementById('skm-lock-icon');
        overlay.style.animation = 'none';
        lockIcon.innerText = '🔒';
        lockIcon.style.animation = 'none';
        void overlay.offsetWidth; 
        overlay.style.animation = 'osLockEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';

        startClock(); 
        startCGIWallpaper();
    };

    let attempts = 0;
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🔒', 'ចាក់សោរ (Lock)', window.openLockScreen);
            clearInterval(initInt);
            resetIdleTimer();
            console.log("🚀 VVIP OS-Level CGI Lock successfully registered!");
        }
        attempts++;
        if(attempts > 20) clearInterval(initInt);
    }, 500);
})();