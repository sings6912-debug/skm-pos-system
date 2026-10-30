(function() {
    console.log("☕ Menu Coffee & Beverage Customizer Plugin Initialized!");

    function openCoffeeCustomizerModal() {
        if(document.getElementById('skmCoffeeModal')) {
            document.getElementById('skmCoffeeModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmCoffeeModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">☕</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">កែតម្រូវកាហ្វេ & ភេសជ្ជៈ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើសកម្រិតផ្អែម និងទឹកកកសម្រាប់ភេសជ្ជៈ៖</p>
                
                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 6px;">🧊 កម្រិតទឹកកក (Ice Level):</div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 12px;">
                    <button onclick="window.appendCoffeeOption('ទឹកកកធម្មតា / Normal Ice')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">ធម្មតា</button>
                    <button onclick="window.appendCoffeeOption('កន្លះទឹកកក / Less Ice')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">កន្លះ</button>
                    <button onclick="window.appendCoffeeOption('អត់ទឹកកក / No Ice')" style="background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid #38bdf8; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">អត់កក</button>
                </div>

                <div style="text-align: left; font-size: 12px; font-weight: bold; margin-bottom: 6px;">🥤 កម្រិតផ្អែម (Sweetness):</div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 20px;">
                    <button onclick="window.appendCoffeeOption('ផ្អែមធម្មតា / 100%')" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">100%</button>
                    <button onclick="window.appendCoffeeOption('កាត់ផ្អែម 50% / Less Sweet')" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">50%</button>
                    <button onclick="window.appendCoffeeOption('អត់ផ្អែម 0% / No Sugar')" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">0%</button>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b;" onclick="document.getElementById('skmCoffeeModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.appendCoffeeOption = function(optText) {
        const noteInput = document.getElementById('cNote');
        if (!noteInput) {
            alert('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!');
            document.getElementById('skmCoffeeModal').style.display = 'none';
            return;
        }

        let currentVal = noteInput.value.trim();
        noteInput.value = currentVal ? `${currentVal}, ${optText}` : optText;
        document.getElementById('skmCoffeeModal').style.display = 'none';
        
        if (typeof showToast === 'function') showToast(`បានបន្ថែមជម្រើស: ${optText}`);
        else alert(`បានបន្ថែមជម្រើស: ${optText}`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('☕', 'កែតម្រូវកាហ្វេ & ភេសជ្ជៈ (Coffee)', openCoffeeCustomizerModal);
            clearInterval(initInt);
        }
    }, 500);
})();