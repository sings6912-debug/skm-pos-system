(function() {
    console.log("🤖 Menu AI Shop Assistant Plugin Initialized!");

    function openAiChatModal() {
        if(document.getElementById('skmAiChatModal')) {
            document.getElementById('skmAiChatModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmAiChatModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 38px; margin-bottom: 10px;">🤖</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #38bdf8;">ជំនួយការហាងឆ្លាតវៃ (AI Assistant)</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">សួរសំណួរទាក់ទងនឹងហាង ពួកយើងជួយឆ្លើយជូន៖</p>
                
                <div id="aiChatBox" style="background: rgba(56,189,248,0.06); border: 1px solid var(--border-color); padding: 12px; border-radius: 12px; height: 120px; overflow-y: auto; margin-bottom: 12px; text-align: left; font-size: 11px; display: flex; flex-direction: column; gap: 6px;">
                    <div style="background: rgba(255,255,255,0.08); padding: 8px; border-radius: 8px;">🤖 សួស្តី! តើខ្ញុំអាចជួយអ្វីដល់លោកអ្នកថ្ងៃនេះ?</div>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <input type="text" id="aiUserQ" placeholder="សរសេរសំណួរ..." style="flex: 1; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 8px 10px; color: #fff; font-size: 11px; outline: none; font-family: 'Battambang';">
                    <button onclick="window.sendAiQuery()" style="background: #38bdf8; color: white; border: none; padding: 8px 14px; border-radius: 10px; font-size: 11px; font-weight: bold; cursor: pointer;">បញ្ជូន</button>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8;" onclick="document.getElementById('skmAiChatModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.sendAiQuery = function() {
        const inp = document.getElementById('aiUserQ');
        const box = document.getElementById('aiChatBox');
        const q = inp.value.trim();
        if(!q) return;

        box.innerHTML += `<div style="background: rgba(56,189,248,0.2); padding: 8px; border-radius: 8px; align-self: flex-end; max-width: 85%;">👤 ${q}</div>`;
        inp.value = '';

        setTimeout(() => {
            let ans = "ហាងយើងខ្ញុំបើកបំរើការរាល់ថ្ងៃពីម៉ោង ០៨:០០ ព្រឹក ដល់ ០៩:០០ យប់!";
            if (q.includes('តម្លៃ') || q.includes('ថ្លៃ')) ans = "តម្លៃទំនិញមានបង្ហាញជូនយ៉ាងច្បាស់លាស់លើមុខទំនិញនីមួយៗ!";
            else if (q.includes('ទីតាំង') || q.includes('នៅឯណា')) ans = "ហាងស្ថិតនៅផ្ទះលេខ ១២៣ ផ្លូវមុនីវង្ស រាជធានីភ្នំពេញ។";
            
            box.innerHTML += `<div style="background: rgba(255,255,255,0.08); padding: 8px; border-radius: 8px; max-width: 85%;">🤖 ${ans}</div>`;
            box.scrollTop = box.scrollHeight;
        }, 500);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🤖', 'ជំនួយការហាងឆ្លាតវៃ (AI Assistant)', openAiChatModal);
            clearInterval(initInt);
        }
    }, 500);
})();