(function() {
    console.log("🕒 POS Ultra-Premium Live Clock Initialized!");

    function injectClock() {
        if (document.getElementById('skm-live-clock')) return;
        
        const defaultClock = document.getElementById('currentDate');
        if (defaultClock) {
            defaultClock.style.display = 'none'; // លាក់ម៉ោងចាស់
            
            const clock = document.createElement('div');
            clock.id = 'skm-live-clock';
            
            // ⚡ រចនាម៉ូតកម្រិត Premium (Glassmorphism + Hover Effect)
            clock.style.cssText = `
                background: rgba(0, 0, 0, 0.2); 
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                color: #fff; 
                padding: 4px 12px; 
                border-radius: 12px; 
                border: 1px solid rgba(255,255,255,0.15); 
                margin-left: 10px; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center;
                line-height: 1.1;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                flex-shrink: 0;
                font-family: 'Nunito', 'Arial', sans-serif;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: default;
            `;
            
            // បន្ថែម Effect ពេលយក Mouse ដាក់ពីលើ
            clock.onmouseover = () => {
                clock.style.background = 'rgba(0, 0, 0, 0.4)';
                clock.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                clock.style.boxShadow = '0 5px 15px rgba(56, 189, 248, 0.3)';
                clock.style.transform = 'translateY(-2px)';
            };
            clock.onmouseout = () => {
                clock.style.background = 'rgba(0, 0, 0, 0.2)';
                clock.style.borderColor = 'rgba(255,255,255,0.15)';
                clock.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                clock.style.transform = 'translateY(0)';
            };

            defaultClock.parentNode.insertBefore(clock, defaultClock.nextSibling);
            
            setInterval(() => {
                const now = new Date();
                const dStr = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
                
                let h = now.getHours();
                let m = now.getMinutes();
                let ampm = h >= 12 ? 'PM' : 'AM';
                h = h % 12;
                h = h ? h : 12; // ប្តូរម៉ោង 0 ទៅជាម៉ោង 12
                m = m < 10 ? '0' + m : m;
                
                // ⚡ បង្កើតចលនាសញ្ញាចុចពីរ (:) ភ្លឹបភ្លែតៗរៀងរាល់វិនាទី
                const s = now.getSeconds();
                const colon = s % 2 === 0 ? ':' : '<span style="opacity: 0.3;">:</span>';
                
                // បង្ហាញម៉ោងធំ (ពណ៌ខៀវស្រាលមានពន្លឺ) និង ថ្ងៃខែតូចពីក្រោម
                clock.innerHTML = `
                    <span style="font-size: 14px; font-weight: 900; color: #38bdf8; text-shadow: 0 0 8px rgba(56,189,248,0.4); letter-spacing: 0.5px;">
                        ${h}${colon}${m} <span style="font-size: 10px; color: #fff;">${ampm}</span>
                    </span>
                    <span style="font-size: 10px; color: #cbd5e1; font-weight: 700; margin-top: 2px;">
                        📅 ${dStr}
                    </span>
                `;
            }, 1000);
        }
    }

    const initInterval = setInterval(() => {
        if (document.getElementById('currentDate')) {
            injectClock();
            clearInterval(initInterval);
        }
    }, 1000);
})();