(function() {
    console.log("🍽️ Menu Dining Option Selector Plugin Initialized!");

    const style = document.createElement('style');
    style.innerHTML = `
        .skm-dining-bar {
            display: flex; gap: 8px; padding: 10px 20px; overflow-x: auto; scrollbar-width: none;
            background: var(--card-bg, #1e293b); border-bottom: 1px solid var(--border-color, #334155);
        }
        .skm-dining-btn {
            background: var(--store-bg, #0f172a); color: var(--text-muted, #94a3b8);
            border: 1px solid var(--border-color, #334155); padding: 6px 14px; border-radius: 20px;
            font-size: 12px; font-weight: 800; white-space: nowrap; cursor: pointer; transition: 0.2s;
        }
        .skm-dining-btn.active {
            background: var(--brand-cyan, #06b6d4); color: white; border-color: var(--brand-cyan, #06b6d4);
            box-shadow: 0 2px 10px rgba(6,182,212,0.3);
        }
    `;
    document.head.appendChild(style);

    function injectDiningBar() {
        const searchWrapper = document.querySelector('.search-wrapper');
        if (!searchWrapper || document.getElementById('skmDiningBar')) return;

        const bar = document.createElement('div');
        bar.id = 'skmDiningBar';
        bar.className = 'skm-dining-bar';
        
        const options = [
            { id: 'takeaway', label: '🏃 ខ្ចប់យកតាមខ្លួន (Takeaway)' },
            { id: 'dinein', label: '🪑 ញ៉ាំនៅហាង (Dine-in)' },
            { id: 'delivery', label: '🛵 ដឹកជញ្ជូនដល់ផ្ទះ (Delivery)' }
        ];

        let savedOpt = localStorage.getItem('skm_dining_option') || 'takeaway';

        bar.innerHTML = options.map(o => `
            <button class="skm-dining-btn ${o.id === savedOpt ? 'active' : ''}" data-val="${o.label}" onclick="window.setDiningOption('${o.id}', this)">${o.label}</button>
        `).join('');

        searchWrapper.parentNode.insertBefore(bar, searchWrapper);
        updateOrderNoteWithDining(savedOpt);
    }

    window.setDiningOption = function(id, btn) {
        document.querySelectorAll('.skm-dining-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        localStorage.setItem('skm_dining_option', id);
        updateOrderNoteWithDining(id, btn.innerText);
        if (typeof showToast === 'function') showToast(`បានជ្រើសរើស: ${btn.innerText}`);
    };

    function updateOrderNoteWithDining(id, labelText) {
        const noteInput = document.getElementById('cNote');
        if (!noteInput) return;
        
        if(!labelText) {
            const activeBtn = document.querySelector('.skm-dining-btn.active');
            labelText = activeBtn ? activeBtn.getAttribute('data-val') : 'ខ្ចប់យកតាមខ្លួន';
        }

        let currentVal = noteInput.value.replace(/\[ប្រភេទ:.*?\]/g, '').trim();
        noteInput.value = `[ប្រភេទ: ${labelText}] ${currentVal}`.trim();
    }

    const initInterval = setInterval(() => {
        if (document.querySelector('.search-wrapper')) {
            injectDiningBar();
            clearInterval(initInterval);
        }
    }, 500);
})();