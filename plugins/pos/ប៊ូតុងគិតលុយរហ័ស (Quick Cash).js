(function() {
    // ⚡ ការពារមិនឱ្យកូដនេះរត់ជាន់គ្នា ២ដង
    if (window.skmQuickCashLoaded) return;
    window.skmQuickCashLoaded = true;

    console.log("💵 POS Ultra-Premium Quick Cash Buttons (Compact) Initialized!");

    const style = document.createElement('style');
    style.innerHTML = `
        .skm-quick-cash-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px; /* បង្រួមចន្លោះ (Gap) */
            margin-top: 10px;
            margin-bottom: 15px; /* កាត់បន្ថយគម្លាតខាងក្រោម */
            padding: 0;
        }
        .skm-qc-btn {
            background: var(--bg-alt, rgba(16, 185, 129, 0.05));
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #10b981;
            font-family: 'Arial', 'Battambang', sans-serif;
            font-weight: bold;
            font-size: 14px; /* បង្រួមទំហំអក្សរ */
            height: 36px; /* ⚡ បង្រួមកម្ពស់ប៊ូតុងឱ្យស្តើងជាងមុន */
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            user-select: none;
        }
        .skm-qc-btn:hover { 
            background: linear-gradient(135deg, #10b981, #059669); 
            color: #fff; 
            border-color: #059669;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
        }
        .skm-qc-btn:active { transform: translateY(0) scale(0.95); box-shadow: none; }
        
        .skm-qc-btn.exact {
            background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3); color: #0ea5e9; font-size: 13px;
        }
        .skm-qc-btn.exact:hover { 
            background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; border-color: #0284c7; 
            box-shadow: 0 4px 8px rgba(56, 189, 248, 0.2); 
        }
        
        .skm-qc-btn.clear {
            background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #ef4444; font-size: 13px;
        }
        .skm-qc-btn.clear:hover { 
            background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; border-color: #dc2626; 
            box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2); 
        }
    `;
    document.head.appendChild(style);

    function injectQuickCashUI() {
        const receivedInput = document.getElementById('checkoutReceivedUsd');
        const receivedRiel = document.getElementById('checkoutReceivedRiel');
        if (!receivedInput) return;

        // ការពារការបង្កើតប្រអប់ជាន់គ្នា
        if (document.getElementById('skmQuickCashGrid')) return; 

        const gridContainer = document.createElement('div');
        gridContainer.id = 'skmQuickCashGrid';
        gridContainer.className = 'skm-quick-cash-grid';
        
        // បង្កើតប៊ូតុងទឹកប្រាក់
        const amounts = [1, 5, 10, 20, 50, 100];
        amounts.forEach(amt => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'skm-qc-btn';
            btn.innerText = `$${amt}`;
            btn.addEventListener('click', () => {
                receivedInput.value = amt.toFixed(2);
                if(receivedRiel) receivedRiel.value = ''; 
                if (typeof window.calculateChange === 'function') window.calculateChange();
            });
            gridContainer.appendChild(btn);
        });

        // ប៊ូតុងប្រាក់ល្មម (Exact) - ប្រើកន្លែងស្មើនឹង ២ប៊ូតុង
        const exactBtn = document.createElement('button');
        exactBtn.type = 'button';
        exactBtn.className = 'skm-qc-btn exact';
        exactBtn.style.gridColumn = 'span 2';
        exactBtn.innerText = '💵 ល្មម (Exact)';
        exactBtn.addEventListener('click', () => {
            const totalDisplay = document.getElementById('checkoutTotalDisplay');
            if (totalDisplay) {
                let match = totalDisplay.innerText.match(/\$([0-9,]+\.[0-9]{2})/);
                if (match && match[1]) {
                    receivedInput.value = match[1].replace(/,/g, '');
                    if(receivedRiel) receivedRiel.value = '';
                    if (typeof window.calculateChange === 'function') window.calculateChange();
                }
            }
        });
        gridContainer.appendChild(exactBtn);

        // ប៊ូតុងសម្អាត (Clear) - ⚡ ពង្រីកឱ្យពេញបន្ទាត់ (Span 4) ដើម្បីកុំឱ្យសល់ចន្លោះប្រហោង
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'skm-qc-btn clear';
        clearBtn.style.gridColumn = 'span 4';
        clearBtn.innerText = '⌫ សម្អាតទិន្នន័យ (Clear)';
        clearBtn.addEventListener('click', () => {
            receivedInput.value = '';
            if(receivedRiel) receivedRiel.value = '';
            if (typeof window.calculateChange === 'function') window.calculateChange();
            receivedInput.focus();
        });
        gridContainer.appendChild(clearBtn);

        const inputFlexContainer = receivedInput.parentElement.parentElement;
        if (inputFlexContainer && inputFlexContainer.parentNode) {
            inputFlexContainer.parentNode.insertBefore(gridContainer, inputFlexContainer.nextSibling);
        }
    }

    // ត្រួតពិនិត្យរៀងរាល់ ៥០០ មីលីវិនាទី
    setInterval(injectQuickCashUI, 500);
})();