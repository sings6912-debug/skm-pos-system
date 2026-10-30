(function() {
    console.log("⚡ Universal Toolbox Hub (Core System + Global Helpers) Initialized!");
    if(document.getElementById('skm-menu-toolbox')) return;

    /* -------------------------------------------------------------------------
       ១. ប្រព័ន្ធទាញយកពណ៌របស់ហាង (Dynamic Theming) 
       ------------------------------------------------------------------------- */
    const urlParams = new URLSearchParams(window.location.search);
    const branchId = urlParams.get('branch') || 'branch_1';
    
    let sysPrimaryColor = '#0072FF'; // Default ពណ៌ខៀវ
    try {
        const localSys = JSON.parse(localStorage.getItem(`ks2_${branchId}_sys_settings`));
        if (localSys && localSys.primaryColor) sysPrimaryColor = localSys.primaryColor;
    } catch(e) {}

    /* -------------------------------------------------------------------------
       ២. បង្កើតអថេរ CSS សកល (Global CSS Variables) សម្រាប់ឲ្យ Plugin ផ្សេងៗខ្ចីប្រើ
       (ចំណេញកូដខ្លាំង មិនបាច់សរសេរពណ៌ និង Dark Mode រាល់ដងទេ)
       ------------------------------------------------------------------------- */
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            /* អថេរពណ៌ដែលអាចយកទៅប្រើគ្រប់ Plugin ទាំងអស់ */
            --skm-primary: ${sysPrimaryColor};
            
            /* Light Mode Default */
            --skm-bg-glass: rgba(255, 255, 255, 0.85);
            --skm-bg-solid: #ffffff;
            --skm-text-main: #0F172A;
            --skm-text-sub: #64748B;
            --skm-border: rgba(226, 232, 240, 0.8);
            --skm-hover-bg: #F8FAFC;
            --skm-shadow-light: 0 4px 15px rgba(0,0,0,0.03);
            --skm-shadow-heavy: 0 30px 60px rgba(15, 23, 42, 0.15);
        }

        /* Auto Dark Mode (សម្របតាមទូរស័ព្ទភ្ញៀវ) */
        @media (prefers-color-scheme: dark) {
            :root {
                --skm-bg-glass: rgba(30, 41, 59, 0.85);
                --skm-bg-solid: #1E293B;
                --skm-text-main: #F8FAFC;
                --skm-text-sub: #94A3B8;
                --skm-border: rgba(51, 65, 85, 0.8);
                --skm-hover-bg: #334155;
                --skm-shadow-light: 0 4px 15px rgba(0,0,0,0.2);
                --skm-shadow-heavy: 0 30px 60px rgba(0, 0, 0, 0.5);
            }
        }

        /* -------------------------------------------------------------------------
           ៣. រចនាប័ទ្មរបស់ Toolbox ផ្ទាល់ (ប្រើប្រាស់អថេរខាងលើ)
           ------------------------------------------------------------------------- */
        .skm-menu-toolbox-container {
            position: fixed; bottom: 95px; left: 20px; z-index: 88000;
            font-family: 'Inter', 'Battambang', sans-serif;
        }
        
        .skm-menu-master-fab {
            width: 58px; height: 58px; border-radius: 50%; 
            background: var(--skm-primary);
            color: #fff; border: 2px solid rgba(255,255,255,0.2); font-size: 24px; cursor: pointer;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25); display: flex;
            justify-content: center; align-items: center; 
            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.1);
        }
        .skm-menu-master-fab:active { transform: scale(0.9) !important; }

        .skm-menu-toolbox-popup {
            position: absolute; bottom: calc(100% + 15px); left: 0; z-index: 88995;
            background: var(--skm-bg-glass);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--skm-border);
            width: 340px; max-width: 90vw; max-height: calc(100vh - 190px); border-radius: 28px; 
            box-shadow: var(--skm-shadow-heavy);
            display: none; flex-direction: column; overflow: hidden;
            transform-origin: bottom left;
            opacity: 0;
        }
        .skm-menu-toolbox-popup.show { 
            display: flex; 
            animation: skmMenuPopUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.05) forwards; 
        }
        @keyframes skmMenuPopUp {
            0% { opacity: 0; transform: scale(0.85) translateY(20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .skm-menu-toolbox-header {
            padding: 16px 20px; font-weight: 700; font-size: 15px; color: var(--skm-text-main);
            border-bottom: 1px solid var(--skm-border); 
            display: flex; justify-content: space-between; align-items: center;
            flex-shrink: 0; background: rgba(0,0,0,0.02);
        }

        .skm-close-btn {
            cursor: pointer; width: 32px; height: 32px; display: flex; 
            align-items: center; justify-content: center; background: rgba(100,116,139,0.1); 
            border-radius: 50%; transition: all 0.2s ease; font-size: 14px; color: var(--skm-text-sub);
        }
        .skm-close-btn:active { transform: scale(0.9); }

        .skm-scroll-area { 
            padding: 12px; display: flex; flex-direction: column; gap: 10px; 
            overflow-y: auto; flex: 1; min-height: 0; scroll-behavior: smooth;
        }
        .skm-scroll-area::-webkit-scrollbar { width: 4px; }
        .skm-scroll-area::-webkit-scrollbar-thumb { background: var(--skm-border); border-radius: 10px; }

        .skm-tool-row {
            display: flex; align-items: center; justify-content: space-between;
            background: var(--skm-bg-solid); border: 1px solid var(--skm-border); 
            border-radius: 18px; padding: 10px 14px; 
            transition: transform 0.15s ease, border-color 0.2s;
            box-shadow: var(--skm-shadow-light);
        }
        .skm-tool-row:active { transform: scale(0.98); border-color: var(--skm-primary); }

        .skm-tool-main-btn {
            background: transparent; border: none; color: var(--skm-text-main);
            padding: 4px 0; cursor: pointer; text-align: left;
            font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 14px;
            font-family: inherit; flex: 1; outline: none;
        }
        
        .skm-tool-actions { display: flex; gap: 8px; align-items: center; }
        .skm-action-btn {
            width: 30px; height: 30px; border-radius: 10px; border: none; background: rgba(100,116,139,0.1);
            cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;
            transition: all 0.2s; color: var(--skm-text-sub); outline: none;
        }
        .skm-action-btn:active { transform: scale(0.9); }
        .skm-action-btn.active-pin { color: #F59E0B; background: rgba(245, 158, 11, 0.15); }
        .skm-action-btn.active-hide { color: #EF4444; background: rgba(239, 68, 68, 0.15); }

        .skm-section-title {
            font-size: 11px; font-weight: 800; color: var(--skm-text-sub);
            margin: 12px 0 4px 8px; text-transform: uppercase; letter-spacing: 1px;
        }
        
        .skm-hidden-toggle {
            background: transparent; border: 1.5px dashed var(--skm-border); color: var(--skm-text-sub);
            padding: 12px; border-radius: 16px; font-size: 13px; font-weight: 600;
            cursor: pointer; font-family: inherit; margin-top: 10px; transition: all 0.2s;
        }
        .skm-hidden-toggle:active { transform: scale(0.98); background: var(--skm-hover-bg); }
        
        #skmHiddenZone { display: none; flex-direction: column; gap: 10px; margin-top: 10px; }
        #skmHiddenZone.show { display: flex; }
    `;
    document.head.appendChild(style);

    /* -------------------------------------------------------------------------
       ៤. បង្កើត UI របស់ Toolbox
       ------------------------------------------------------------------------- */
    const container = document.createElement('div');
    container.className = 'skm-menu-toolbox-container';
    container.id = 'skm-menu-toolbox';
    container.innerHTML = `
        <button class="skm-menu-master-fab" id="skmMenuMasterFab" title="បណ្ដុំមុខងារពិសេស">
            <span style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">⚡</span>
        </button>
        <div class="skm-menu-toolbox-popup" id="skmMenuToolboxPopup">
            <div class="skm-menu-toolbox-header">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="color: var(--skm-primary); font-size: 18px;">✦</span>
                    <span>Quick Tools</span>
                </div>
                <span class="skm-close-btn" id="skmMenuCloseBtn">✕</span>
            </div>
            
            <div class="skm-scroll-area" id="skmMenuToolboxMenuBody">
                <div id="skmPinnedSection" style="display:none;">
                    <div class="skm-section-title">📌 បានខ្ទាស់ (Pinned)</div>
                    <div id="skmPinnedZone" style="display: flex; flex-direction: column; gap: 10px;"></div>
                </div>
                
                <div id="skmNormalSection">
                    <div class="skm-section-title" id="skmNormalTitle" style="display:none;">✨ មុខងារផ្សេងៗ</div>
                    <div id="skmNormalZone" style="display: flex; flex-direction: column; gap: 10px;"></div>
                </div>

                <div id="skmHiddenSection" style="display:none;">
                    <button class="skm-hidden-toggle" id="btnToggleHidden">👁️ បង្ហាញមុខងារដែលបានលាក់</button>
                    <div id="skmHiddenZone"></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    /* -------------------------------------------------------------------------
       ៥. MASKING & LOGIC: ចងក្រងបញ្ជី និង Render
       ------------------------------------------------------------------------- */
    window.skmRegisteredToolsList = [];

    function getToolPrefs() {
        try { return JSON.parse(localStorage.getItem('skm_universal_toolbox_prefs')) || {}; } 
        catch(e) { return {}; }
    }
    
    function saveToolPref(toolName, state) {
        let prefs = getToolPrefs();
        if (state === 'normal') delete prefs[toolName];
        else prefs[toolName] = state;
        localStorage.setItem('skm_universal_toolbox_prefs', JSON.stringify(prefs));
        renderToolboxUI(); 
    }

    function renderToolboxUI() {
        const pinnedZone = document.getElementById('skmPinnedZone');
        const normalZone = document.getElementById('skmNormalZone');
        const hiddenZone = document.getElementById('skmHiddenZone');
        
        pinnedZone.innerHTML = ''; normalZone.innerHTML = ''; hiddenZone.innerHTML = '';
        let prefs = getToolPrefs();
        let hasPinned = false, hasNormal = false, hasHidden = false;

        window.skmRegisteredToolsList.forEach((tool, index) => {
            let state = prefs[tool.text] || 'normal';
            
            const row = document.createElement('div');
            row.className = 'skm-tool-row';
            
            let pinIcon = state === 'pinned' ? '📌' : '📍';
            let pinClass = state === 'pinned' ? 'active-pin' : '';
            let pinAction = state === 'pinned' ? 'normal' : 'pinned';
            
            let hideIcon = state === 'hidden' ? '🔄' : '👁️‍🗨️';
            let hideClass = state === 'hidden' ? 'active-hide' : '';
            let hideAction = state === 'hidden' ? 'normal' : 'hidden';

            row.innerHTML = `
                <button class="skm-tool-main-btn" onclick="window.skmRunToolAction(${index})">
                    <span style="font-size:18px;">${tool.icon}</span> 
                    <span>${tool.text}</span>
                </button>
                <div class="skm-tool-actions">
                    <button class="skm-action-btn ${pinClass}" onclick="event.stopPropagation(); window.skmSetToolState('${tool.text}', '${pinAction}')">${pinIcon}</button>
                    <button class="skm-action-btn ${hideClass}" onclick="event.stopPropagation(); window.skmSetToolState('${tool.text}', '${hideAction}')">${hideIcon}</button>
                </div>
            `;

            if (state === 'pinned') { pinnedZone.appendChild(row); hasPinned = true; }
            else if (state === 'hidden') { hiddenZone.appendChild(row); hasHidden = true; }
            else { normalZone.appendChild(row); hasNormal = true; }
        });

        document.getElementById('skmPinnedSection').style.display = hasPinned ? 'block' : 'none';
        document.getElementById('skmNormalTitle').style.display = hasPinned && hasNormal ? 'block' : 'none';
        document.getElementById('skmHiddenSection').style.display = hasHidden ? 'block' : 'none';
    }

    window.skmRunToolAction = function(index) {
        const popup = document.getElementById('skmMenuToolboxPopup');
        if(popup) popup.classList.remove('show');
        if(window.skmRegisteredToolsList[index] && typeof window.skmRegisteredToolsList[index].onClickFunc === 'function') {
            window.skmRegisteredToolsList[index].onClickFunc();
        }
    };

    window.skmSetToolState = function(toolName, newState) { saveToolPref(toolName, newState); };

    window.registerMenuTool = function(icon, text, onClickFunc) {
        if (window.skmRegisteredToolsList.some(t => t.text === text)) return;
        window.skmRegisteredToolsList.push({ icon, text, onClickFunc });
        renderToolboxUI(); 
    };

    /* -------------------------------------------------------------------------
       ៦. ប្រព័ន្ធ Drag & Drop (រំកិលបាន)
       ------------------------------------------------------------------------- */
    const fab = document.getElementById('skmMenuMasterFab');
    const popup = document.getElementById('skmMenuToolboxPopup');
    
    let isDragging = false, dragMoved = false;
    let startX, startY, initialLeft, initialTop;

    try {
        const savedPos = JSON.parse(localStorage.getItem('skm_toolbox_pos'));
        if (savedPos && savedPos.left && savedPos.top) {
            container.style.bottom = 'auto';
            container.style.left = savedPos.left;
            container.style.top = savedPos.top;
            updatePopupPosition(parseFloat(savedPos.left), parseFloat(savedPos.top));
        }
    } catch(e) {}

    function updatePopupPosition(x, y) {
        if (x > window.innerWidth / 2) {
            popup.style.left = 'auto'; popup.style.right = '0';
            popup.style.transformOrigin = popup.style.transformOrigin.replace('left', 'right') || 'bottom right';
        } else {
            popup.style.left = '0'; popup.style.right = 'auto';
            popup.style.transformOrigin = popup.style.transformOrigin.replace('right', 'left') || 'bottom left';
        }
        
        if (y < window.innerHeight / 2) {
            popup.style.bottom = 'auto'; popup.style.top = 'calc(100% + 15px)';
            popup.style.transformOrigin = popup.style.transformOrigin.replace('bottom', 'top');
        } else {
            popup.style.top = 'auto'; popup.style.bottom = 'calc(100% + 15px)';
            popup.style.transformOrigin = popup.style.transformOrigin.replace('top', 'bottom');
        }
    }

    function dragStart(e) {
        if(e.button !== 0 && e.type !== 'touchstart') return; 
        isDragging = true; dragMoved = false;
        const rect = container.getBoundingClientRect();
        container.style.bottom = 'auto'; container.style.right = 'auto';
        container.style.left = rect.left + 'px'; container.style.top = rect.top + 'px';
        if (e.type === 'touchstart') { startX = e.touches[0].clientX; startY = e.touches[0].clientY; } 
        else { startX = e.clientX; startY = e.clientY; }
        initialLeft = rect.left; initialTop = rect.top;
        fab.style.transition = 'none'; 
    }

    function drag(e) {
        if (!isDragging) return;
        let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        let clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const dx = clientX - startX, dy = clientY - startY;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            dragMoved = true;
            if(e.cancelable) e.preventDefault(); 
        }

        if (dragMoved) {
            let newLeft = initialLeft + dx, newTop = initialTop + dy;
            const maxX = window.innerWidth - fab.offsetWidth, maxY = window.innerHeight - fab.offsetHeight;
            newLeft = Math.min(Math.max(0, newLeft), maxX);
            newTop = Math.min(Math.max(0, newTop), maxY);
            container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';
            updatePopupPosition(newLeft, newTop);
        }
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        fab.style.transition = 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.1)'; 
        if (dragMoved) {
            localStorage.setItem('skm_toolbox_pos', JSON.stringify({ left: container.style.left, top: container.style.top }));
        }
    }

    fab.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    fab.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);

    /* -------------------------------------------------------------------------
       ៧. GLOBAL UTILITIES: មុខងារទប់ការចុចខាងក្រៅ (កុំឲ្យ Plugin ក្រោយៗសរសេរកូដដដែលៗ)
       ------------------------------------------------------------------------- */
    
    // បើក/បិទ ផ្ទាំង Toolbox នេះផ្ទាល់
    fab.onclick = (e) => { e.stopPropagation(); if (!dragMoved) popup.classList.toggle('show'); };
    document.getElementById('skmMenuCloseBtn').onclick = () => popup.classList.remove('show');
    
    // មុខងារចុចលើផ្ទៃខាងក្រៅ (Click Outside) សម្រាប់បិទផ្ទាំង Toolbox នេះ
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) popup.classList.remove('show');
    });

    document.getElementById('btnToggleHidden').onclick = function(e) {
        e.stopPropagation();
        const hz = document.getElementById('skmHiddenZone');
        hz.classList.toggle('show');
        this.innerText = hz.classList.contains('show') ? 'បង្រួមមុខងារដែលបានលាក់ ⬆️' : '👁️ បង្ហាញមុខងារដែលបានលាក់';
    };

    // មុខងារសកល (Global Tool) ដែលអនុញ្ញាតឲ្យ Plugin ផ្សេងៗហៅប្រើដើម្បីបិទ Modal
    // ឧទាហរណ៍៖ window.skmRegisterOutsideClick('modalBgId', មុខងារបិទ)
    window.skmRegisterOutsideClick = function(bgId, closeFunction) {
        const bg = document.getElementById(bgId);
        if (bg) {
            bg.onclick = function(e) {
                // បើចុចចំផ្ទៃព្រាលៗខាងក្រៅ វានឹងដំណើរការមុខងារបិទដែលផ្តល់ឲ្យ
                if (e.target === bg && typeof closeFunction === 'function') {
                    closeFunction();
                }
            };
        }
    };

})();