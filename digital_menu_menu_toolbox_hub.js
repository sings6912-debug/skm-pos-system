(function() {
    console.log("🛍️ Digital Menu Master Toolbox Hub Initialized!");
    if(document.getElementById('skm-menu-toolbox')) return;

    // 1. Styling for FAB and Popup Menu
    const style = document.createElement('style');
    style.innerHTML = `
        .skm-menu-toolbox-container {
            position: fixed; bottom: 95px; left: 20px; z-index: 88000;
        }
        .skm-menu-master-fab {
            width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #ef4444);
            color: #fff; border: none; font-size: 22px; cursor: pointer;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.5); display: flex;
            justify-content: center; align-items: center; transition: transform 0.2s;
            animation: menuToolPulse 2s infinite;
        }
        @keyframes menuToolPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.08); box-shadow: 0 0 20px rgba(245, 158, 11, 0.8); }
            100% { transform: scale(1); }
        }
        .skm-menu-master-fab:active { transform: scale(0.95); }

        .skm-menu-toolbox-popup {
            position: fixed; bottom: 155px; left: 20px; z-index: 88995;
            background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155);
            width: 280px; max-height: calc(100vh - 180px); border-radius: 16px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            display: none; flex-direction: column; overflow: hidden;
            font-family: 'Battambang', sans-serif;
        }
        .skm-menu-toolbox-popup.show { display: flex; animation: menuPopUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes menuPopUp {
            0% { opacity: 0; transform: translateY(15px) scale(0.9); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .skm-menu-toolbox-header {
            background: rgba(245, 158, 11, 0.15); color: #f59e0b;
            padding: 12px 15px; font-weight: bold; font-size: 13px;
            border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;
            flex-shrink: 0;
        }
        .skm-menu-toolbox-body { 
            padding: 8px; display: flex; flex-direction: column; gap: 6px; 
            overflow-y: auto; flex: 1; min-height: 0;
        }
        .skm-menu-tool-item {
            background: transparent; border: none; color: var(--text-dark, #fff);
            padding: 10px 12px; border-radius: 10px; cursor: pointer; text-align: left;
            font-size: 12px; font-weight: bold; display: flex; align-items: center; gap: 10px;
            transition: 0.2s; font-family: 'Battambang', sans-serif; flex-shrink: 0;
        }
        .skm-menu-tool-item:hover { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'skm-menu-toolbox-container';
    container.id = 'skm-menu-toolbox';
    container.innerHTML = `
        <button class="skm-menu-master-fab" id="skmMenuMasterFab" title="ប្រអប់ឧបករណ៍ពិសេស Menu">🎁</button>
        <div class="skm-menu-toolbox-popup" id="skmMenuToolboxPopup">
            <div class="skm-menu-toolbox-header">
                <span>🎁 មុខងារពិសេស Digital Menu</span>
                <span style="cursor:pointer;" onclick="document.getElementById('skmMenuToolboxPopup').classList.remove('show')">✕</span>
            </div>
            <div class="skm-menu-toolbox-body" id="skmMenuToolboxMenuBody">
                <!-- Plugins will register here automatically -->
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const fab = document.getElementById('skmMenuMasterFab');
    const popup = document.getElementById('skmMenuToolboxPopup');

    fab.onclick = (e) => {
        e.stopPropagation();
        popup.classList.toggle('show');
    };

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) popup.classList.remove('show');
    });

    window.registerMenuTool = function(icon, text, onClickFunc) {
        const menuBody = document.getElementById('skmMenuToolboxMenuBody');
        if(!menuBody) return;
        
        // Prevent duplicates
        const existingButtons = Array.from(menuBody.children);
        if (existingButtons.some(el => el.innerText.includes(text))) return;

        const btn = document.createElement('button');
        btn.className = 'skm-menu-tool-item';
        btn.innerHTML = `<span style="font-size:16px;">${icon}</span> ${text}`;
        btn.onclick = () => {
            popup.classList.remove('show');
            onClickFunc();
        };
        menuBody.appendChild(btn);
    };
})();