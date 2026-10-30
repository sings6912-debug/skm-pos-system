(function() {
    console.log("🎫 Menu Scratch & Win Card Plugin Initialized!");

    function openScratchModal() {
        if(document.getElementById('skmScratchCardModal')) {
            document.getElementById('skmScratchCardModal').style.display = 'flex';
            resetScratchCanvas();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmScratchCardModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🎫</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">កាតកោសឈ្នះរង្វាន់អាថ៌កំបាំង</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">កោសលើកាតខាងក្រោមដើម្បីស្វែងរកកូដបញ្ចុះតម្លៃពិសេសរបស់អ្នក៖</p>
                
                <div style="position: relative; width: 280px; height: 120px; margin: 0 auto 15px auto; border-radius: 14px; overflow: hidden; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 15px rgba(0,0,0,0.3);">
                    <div id="scratchRewardText" style="font-size: 18px; font-weight: 900; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🎉 កូដ: SCRATCH15 (-$1.50)</div>
                    <canvas id="scratchCanvas" width="280" height="120" style="position: absolute; top: 0; left: 0; cursor: pointer; border-radius: 14px;"></canvas>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #f59e0b; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px;" onclick="window.applyScratchReward()">🎟️ យកកូដនេះទៅប្រើប្រាស់</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px;" onclick="document.getElementById('skmScratchCardModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(resetScratchCanvas, 100);
    }

    function resetScratchCanvas() {
        const canvas = document.getElementById('scratchCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 14px Battambang, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🖱️ កោសត្រង់នេះដើម្បីមើលរង្វាន់', canvas.width / 2, canvas.height / 2 + 5);

        let isDrawing = false;

        function scratch(e) {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
            const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2, false);
            ctx.fill();
        }

        canvas.onmousedown = () => { isDrawing = true; };
        canvas.onmousemove = scratch;
        window.onmouseup = () => { isDrawing = false; };

        canvas.ontouchstart = () => { isDrawing = true; };
        canvas.ontouchmove = scratch;
        canvas.ontouchend = () => { isDrawing = false; };
    }

    window.applyScratchReward = function() {
        const promoInput = document.getElementById('cPromo');
        if (!promoInput) {
            if (typeof showToast === 'function') showToast('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!', true);
            else alert('សូមបើកកន្ត្រកទំនិញ (Cart) សិន!');
            document.getElementById('skmScratchCardModal').style.display = 'none';
            return;
        }
        promoInput.value = 'SCRATCH15';
        document.getElementById('skmScratchCardModal').style.display = 'none';
        if (typeof applyPromo === 'function') applyPromo();
        if (typeof showToast === 'function') showToast('បានដាក់កូដ SCRATCH15 ជោគជ័យ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎫', 'កាតកោសឈ្នះរង្វាន់ (Scratch Card)', openScratchModal);
            clearInterval(initInt);
        }
    }, 500);
})();