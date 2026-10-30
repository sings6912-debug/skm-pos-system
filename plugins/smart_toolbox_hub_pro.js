/* STREAMING_CHUNK:Initializing Premium Smart Toolbox Hub with Text Fix... */
(function() {
    console.log("🛠️ POS Premium Smart Toolbox Pro Initialized (Fixed Text Color)!");
    if(document.getElementById('skm-toolbox')) return;

    /* STREAMING_CHUNK:Injecting Fixed CSS Styles... */
    const style = document.createElement('style');
    style.innerHTML = `
        .skm-toolbox-container { position: fixed; bottom: 25px; right: 25px; z-index: 99000; transition: opacity 0.3s ease; font-family: 'Kantumruy Pro', 'Battambang', 'Nunito', sans-serif; }
        
        /* Master FAB Button */
        .skm-master-fab { width: 62px; height: 62px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #2563eb); color: #fff; border: none; font-size: 28px; cursor: grab; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4); display: flex; justify-content: center; align-items: center; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); user-select: none; }
        .skm-master-fab:active { cursor: grabbing; transform: scale(0.9); }
        .skm-master-fab:hover:not(:active) { transform: scale(1.08) rotate(10deg); box-shadow: 0 15px 35px rgba(37, 99, 235, 0.5); }
        
        /* Popup Menu Box - Explicit White Background */
        .skm-toolbox-popup { position: absolute; bottom: 80px; right: 0; z-index: 99995; background: #ffffff !important; border: 1px solid #cbd5e1 !important; width: 330px; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); display: none; flex-direction: column; overflow: hidden; }
        .skm-toolbox-popup.show { display: flex; animation: popUpMenu 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes popUpMenu { 0% { opacity: 0; transform: translateY(30px) scale(0.85); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        
        /* Header */
        .skm-toolbox-header { padding: 18px 20px; border-bottom: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center; background: rgba(248, 250, 252, 0.9); }
        .skm-toolbox-title { font-size: 16px; font-weight: 900; color: #0284c7 !important; display: flex; align-items: center; gap: 8px; margin: 0; }
        
        /* Header Action Buttons */
        .skm-header-actions { display:flex; gap: 8px; align-items: center; }
        .skm-action-btn { width: 34px; height: 34px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; font-size: 14px; user-select: none; }
        .skm-action-btn:hover { background: #e0f2fe; color: #0ea5e9; border-color: #bae6fd; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15); }
        .skm-action-btn.skm-close-btn:hover { background: #fee2e2; color: #ef4444; border-color: #fca5a5; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.15); }
        .skm-pin-btn.active { background: #fee2e2; color: #ef4444; border-color: #fca5a5; transform: rotate(-15deg); box-shadow: 0 4px 10px rgba(239, 68, 68, 0.15); }
        
        /* Body & Scrollbar */
        .skm-toolbox-body { padding: 15px; display: flex; flex-direction: column; gap: 10px; max-height: 55vh; overflow-y: auto; background: #ffffff !important; }
        .skm-toolbox-body::-webkit-scrollbar { width: 6px; }
        .skm-toolbox-body::-webkit-scrollbar-track { background: transparent; }
        .skm-toolbox-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .skm-toolbox-body::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        /* List Items - 🌟 FIX: Explicit Dark Text Color & Clean White Background */
        .skm-tool-wrapper { position: relative; display: flex; align-items: center; width: 100%; box-sizing: border-box; }
        .skm-tool-item { flex: 1; background: #f8fafc !important; border: 1px solid #cbd5e1 !important; color: #1e293b !important; padding: 12px 16px; border-radius: 16px; cursor: pointer; text-align: left; font-size: 14px; font-weight: 800 !important; display: flex; align-items: center; gap: 12px; transition: 0.3s; font-family: 'Battambang', sans-serif !important; box-shadow: 0 2px 4px rgba(0,0,0,0.03); }
        .skm-tool-item:hover { background: #ffffff !important; border-color: #38bdf8 !important; color: #0284c7 !important; transform: translateY(-2px) translateX(2px); box-shadow: 0 6px 15px rgba(56, 189, 248, 0.15); }
        .skm-tool-icon-wrap { font-size: 20px; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; background: #ffffff !important; border: 1px solid #cbd5e1 !important; border-radius: 12px; transition: 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.04); flex-shrink: 0; }
        .skm-tool-item:hover .skm-tool-icon-wrap { background: #e0f2fe !important; border-color: #bae6fd !important; transform: scale(1.1) rotate(5deg); }
        
        /* Edit Mode Styles */
        .skm-toolbox-body.edit-mode .skm-tool-wrapper { border: 1.5px dashed #cbd5e1; border-radius: 16px; padding-right: 90px; background: #f8fafc; transition: 0.2s; }
        .skm-toolbox-body.edit-mode .skm-tool-wrapper:hover { border-color: #94a3b8; background: #f1f5f9; }
        .skm-toolbox-body.edit-mode .skm-tool-item { box-shadow: none; pointer-events: none; border: none; background: transparent !important; color: #1e293b !important; transform: none !important; }
        .skm-toolbox-body.edit-mode .skm-tool-controls { display: flex; }
        .skm-tool-controls { display: none; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); gap: 6px; }
        .skm-tool-ctrl-btn { width: 34px; height: 34px; border-radius: 10px; border: 1px solid #cbd5e1; background: #ffffff; cursor: pointer; font-size: 14px; transition: 0.2s; display: flex; align-items: center; justify-content: center; opacity: 0.6; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .skm-tool-ctrl-btn:hover { opacity: 1; border-color: #94a3b8; background: #f1f5f9; transform: translateY(-1px); }
        .skm-tool-ctrl-btn.active { opacity: 1; border-color: #f59e0b; background: #fffbeb; color: #d97706; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.2); }
        .skm-tool-wrapper.hidden-tool { opacity: 0.45; filter: grayscale(1); }
        .skm-tool-wrapper.hidden-tool .skm-tool-item { text-decoration: line-through; }
        body:not(.skm-edit-active) .skm-tool-wrapper.hidden-tool { display: none !important; }
        
        /* Mini Hidden FAB */
        .skm-mini-fab { position: fixed; right: -15px; top: 50%; transform: translateY(-50%); width: 45px; height: 60px; background: rgba(14, 165, 233, 0.9); border-radius: 14px 0 0 14px; display: none; justify-content: flex-start; align-items: center; padding-left: 8px; color: white; cursor: pointer; z-index: 99000; box-shadow: -4px 0 15px rgba(14, 165, 233, 0.4); backdrop-filter: blur(5px); transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); font-size: 22px; }
        .skm-mini-fab:hover { right: 0; background: #0284c7; padding-left: 12px; }
    `;
    document.head.appendChild(style);

    /* STREAMING_CHUNK:Building DOM Structure... */
    const container = document.createElement('div');
    container.className = 'skm-toolbox-container';
    container.id = 'skm-toolbox';
    container.innerHTML = `
        <button class="skm-master-fab" id="skmMasterFab" title="ប្រអប់ឧបករណ៍ POS">⚙️</button>
        <div class="skm-toolbox-popup" id="skmToolboxPopup">
            <div class="skm-toolbox-header">
                <h3 class="skm-toolbox-title">
                    <span style="font-size: 20px;">⚡</span> ឧបករណ៍ (Tools)
                </h3>
                <div class="skm-header-actions">
                    <div class="skm-action-btn" id="skmEditBtn" title="រៀបចំមុខងារ (Edit)" onclick="window.skmToggleEditMode(event)">🛠️</div>
                    <div class="skm-action-btn skm-pin-btn" id="skmPinBtn" title="Pin ឱ្យជាប់ (Pin)" onclick="window.skmTogglePin(event)">📌</div>
                    <div class="skm-action-btn" title="លាក់ប្រអប់ (Hide)" onclick="window.skmHideFab(event)">👁️</div>
                    <div class="skm-action-btn skm-close-btn" title="បិទ (Close)" onclick="document.getElementById('skmToolboxPopup').classList.remove('show')">✕</div>
                </div>
            </div>
            <div class="skm-toolbox-body" id="skmToolboxMenuBody"></div>
        </div>
    `;
    document.body.appendChild(container);

    const miniFab = document.createElement('div');
    miniFab.className = 'skm-mini-fab';
    miniFab.id = 'skm-mini-fab';
    miniFab.innerHTML = '⚙️️';
    miniFab.title = 'បង្ហាញប្រអប់ឧបករណ៍វិញ (Show Toolbox)';
    document.body.appendChild(miniFab);

    const fab = document.getElementById('skmMasterFab');
    const popup = document.getElementById('skmToolboxPopup');

    let isDragging = false, hasMoved = false, startX, startY, initialLeft, initialTop;
    let isPinned = localStorage.getItem('skm_toolbox_pinned') === 'true';

    if(isPinned) document.getElementById('skmPinBtn').classList.add('active');

    // Load saved position
    const savedPos = JSON.parse(localStorage.getItem('skm_fab_pos'));
    if(savedPos) {
        container.style.right = 'auto'; container.style.bottom = 'auto';
        container.style.left = savedPos.left; container.style.top = savedPos.top;
    }

    /* STREAMING_CHUNK:Implementing Drag and Drop Logic... */
    fab.addEventListener('mousedown', (e) => {
        isDragging = true; hasMoved = false;
        startX = e.clientX; startY = e.clientY;
        const rect = container.getBoundingClientRect();
        initialLeft = rect.left; initialTop = rect.top;
        
        container.style.right = 'auto'; container.style.bottom = 'auto';
        container.style.left = initialLeft + 'px'; container.style.top = initialTop + 'px';
        container.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if(!isDragging) return;
        const dx = e.clientX - startX; const dy = e.clientY - startY;
        if(Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved = true;

        let newLeft = initialLeft + dx; let newTop = initialTop + dy;
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 65));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - 65));
        
        container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';

        if (newLeft > window.innerWidth / 2) { popup.style.left = 'auto'; popup.style.right = '0'; } 
        else { popup.style.right = 'auto'; popup.style.left = '0'; }
        if (newTop > window.innerHeight / 2) { popup.style.top = 'auto'; popup.style.bottom = '75px'; } 
        else { popup.style.bottom = 'auto'; popup.style.top = '75px'; }
    });

    document.addEventListener('mouseup', () => {
        if(isDragging) {
            container.style.transition = 'opacity 0.3s ease';
            if(hasMoved) localStorage.setItem('skm_fab_pos', JSON.stringify({left: container.style.left, top: container.style.top}));
        }
        isDragging = false;
    });

    // Touch Support
    fab.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        isDragging = true; hasMoved = false;
        startX = touch.clientX; startY = touch.clientY;
        const rect = container.getBoundingClientRect();
        initialLeft = rect.left; initialTop = rect.top;
        
        container.style.right = 'auto'; container.style.bottom = 'auto';
        container.style.left = initialLeft + 'px'; container.style.top = initialTop + 'px';
        container.style.transition = 'none';
    }, {passive: true});

    document.addEventListener('touchmove', (e) => {
        if(!isDragging) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX; const dy = touch.clientY - startY;
        if(Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved = true;
        
        let newLeft = initialLeft + dx; let newTop = initialTop + dy;
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 65));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - 65));
        container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';
    }, {passive: true});

    document.addEventListener('touchend', () => {
        if(isDragging && hasMoved) localStorage.setItem('skm_fab_pos', JSON.stringify({left: container.style.left, top: container.style.top}));
        container.style.transition = 'opacity 0.3s ease';
        isDragging = false;
    });

    fab.onclick = (e) => {
        e.stopPropagation();
        if(hasMoved) return;
        popup.classList.toggle('show');
    };

    window.skmTogglePin = function(e) {
        e.stopPropagation();
        isPinned = !isPinned;
        localStorage.setItem('skm_toolbox_pinned', isPinned);
        document.getElementById('skmPinBtn').classList.toggle('active', isPinned);
    };

    window.skmHideFab = function(e) {
        e.stopPropagation();
        popup.classList.remove('show');
        container.style.display = 'none';
        miniFab.style.display = 'flex';
    };

    miniFab.onclick = () => {
        miniFab.style.display = 'none';
        container.style.display = 'block';
    };

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && popup.classList.contains('show') && !isPinned) {
            popup.classList.remove('show');
        }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            popup.classList.remove('show');
            document.querySelectorAll('div[style*="z-index: 100000"]').forEach(m => {
                if(m.style.display !== 'none') m.style.display = 'none';
            });
        }
    });

    /* STREAMING_CHUNK:Implementing Tool Preferences & Rendering... */
    let toolPrefs = JSON.parse(localStorage.getItem('skm_tool_prefs')) || {};
    let isEditMode = false;
    let allRegisteredTools = [];

    window.skmToggleEditMode = function(e) {
        e.stopPropagation();
        isEditMode = !isEditMode;
        const body = document.getElementById('skmToolboxMenuBody');
        const editBtn = document.getElementById('skmEditBtn');
        if (isEditMode) {
            body.classList.add('edit-mode');
            document.body.classList.add('skm-edit-active');
            editBtn.style.background = '#e0f2fe';
            editBtn.style.color = '#0ea5e9';
            editBtn.style.borderColor = '#bae6fd';
        } else {
            body.classList.remove('edit-mode');
            document.body.classList.remove('skm-edit-active');
            editBtn.style.background = '';
            editBtn.style.color = '';
            editBtn.style.borderColor = '';
        }
        renderToolboxList();
    };

    window.skmToggleToolPref = function(toolText, type, e) {
        e.stopPropagation();
        if (!toolPrefs[toolText]) toolPrefs[toolText] = { hidden: false, pinned: false };
        toolPrefs[toolText][type] = !toolPrefs[toolText][type];
        localStorage.setItem('skm_tool_prefs', JSON.stringify(toolPrefs));
        renderToolboxList();
    };

    function renderToolboxList() {
        const menuBody = document.getElementById('skmToolboxMenuBody');
        if(!menuBody) return;
        menuBody.innerHTML = '';
        
        let sortedTools = [...allRegisteredTools].sort((a, b) => {
            let aPin = toolPrefs[a.text]?.pinned ? 1 : 0;
            let bPin = toolPrefs[b.text]?.pinned ? 1 : 0;
            return bPin - aPin;
        });

        sortedTools.forEach(tool => {
            const pref = toolPrefs[tool.text] || { hidden: false, pinned: false };
            
            const wrapper = document.createElement('div');
            wrapper.className = 'skm-tool-wrapper';
            if (pref.hidden) wrapper.classList.add('hidden-tool');

            const btn = document.createElement('button');
            btn.className = 'skm-tool-item';
            btn.innerHTML = `
                <div class="skm-tool-icon-wrap">${tool.icon}</div>
                <span style="flex:1;">${tool.text}</span>
            `;
            btn.onclick = () => {
                if (isEditMode) return;
                popup.classList.remove('show'); 
                tool.onClickFunc(); 
            };

            const controls = document.createElement('div');
            controls.className = 'skm-tool-controls';
            
            controls.innerHTML = `
                <button class="skm-tool-ctrl-btn ${pref.pinned ? 'active' : ''}" title="Pin ទាញទៅលើគេ" onclick="window.skmToggleToolPref('${tool.text}', 'pinned', event)">📌</button>
                <button class="skm-tool-ctrl-btn ${pref.hidden ? 'active' : ''}" title="លាក់ / បង្ហាញ" onclick="window.skmToggleToolPref('${tool.text}', 'hidden', event)">${pref.hidden ? '🙈' : '👁️'}</button>
            `;

            wrapper.appendChild(btn);
            wrapper.appendChild(controls);
            menuBody.appendChild(wrapper);
        });
    }

    window.registerCustomTool = function(icon, text, onClickFunc) {
        if (allRegisteredTools.find(t => t.text === text)) return;
        allRegisteredTools.push({ icon, text, onClickFunc });
        renderToolboxList();
    };
})();