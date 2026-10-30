(function() {
    console.log("🤖 Menu Gemini AI Concierge Plugin Initialized!");

    function openGeminiConciergeModal() {
        if(document.getElementById('skmGeminiModal')) {
            document.getElementById('skmGeminiModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmGeminiModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 420px; text-align: center; border: 1px solid rgba(56,189,248,0.3); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px; animation: aiPulse 2s infinite;">✨</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ជំនួយការ AI ឆ្លាតវៃ (Gemini Concierge)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">សួរសំណួរ ឬប្រាប់ពីអារម្មណ៍/ចំណង់ចំណូលចិត្តរបស់អ្នកថ្ងៃនេះ៖</p>
                
                <div id="aiConciergeChatBox" style="background: rgba(15,23,42,0.6); border: 1px solid var(--border-color); padding: 12px; border-radius: 16px; height: 180px; overflow-y: auto; margin-bottom: 12px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 8px;">
                    <div style="background: rgba(56,189,248,0.15); padding: 10px; border-radius: 12px; border: 1px solid rgba(56,189,248,0.3);">🤖 សួស្តី! ខ្ញុំជាជំនួយការ AI ផ្ទាល់ខ្លួនរបស់អ្នក។ តើថ្ងៃនេះលោកអ្នកចង់ញ៉ាំអ្វី ឬរកទំនិញបែបណាដែរ?</div>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <input type="text" id="aiConciergeInput" placeholder="ឧ. ចង់រកកាហ្វេផ្អែមស្រទន់ ឬម្ហូបជួយឱ្យស្រស់ស្រាយ..." style="flex: 1; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 12px; color: #fff; font-size: 12px; outline: none; font-family: 'Battambang';" onkeydown="if(event.key==='Enter') window.sendGeminiConciergeQuery()">
                    <button onclick="window.sendGeminiConciergeQuery()" style="background: linear-gradient(135deg, #38bdf8, #2563eb); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">បញ្ជូន</button>
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(56,189,248,0.1); color:#38bdf8; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmGeminiModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes aiPulse {
                0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(56,189,248,0.5)); }
                50% { transform: scale(1.1); filter: drop-shadow(0 0 20px rgba(56,189,248,0.9)); }
            }
        `;
        document.head.appendChild(style);
    }

    window.sendGeminiConciergeQuery = async function() {
        const inp = document.getElementById('aiConciergeInput');
        const box = document.getElementById('aiConciergeChatBox');
        const q = inp.value.trim();
        if(!q) return;

        box.innerHTML += `<div style="background: rgba(56,189,248,0.25); padding: 10px; border-radius: 12px; align-self: flex-end; max-width: 85%;">👤 ${q}</div>`;
        inp.value = '';
        box.scrollTop = box.scrollHeight;

        const loadingId = 'aiLoading_' + Date.now();
        box.innerHTML += `<div id="${loadingId}" style="background: rgba(255,255,255,0.08); padding: 10px; border-radius: 12px; max-width: 85%;">🤖 កំពុងគិត និងវិភាគ...</div>`;
        box.scrollTop = box.scrollHeight;

        try {
            let invSummary = (window.inventory || []).slice(0, 10).map(p => `${p.name} ($${p.price})`).join(', ');
            const systemPrompt = "Act as an expert culinary sommelier and shop concierge for a digital menu store. Recommend items based on customer request. Available items: " + (invSummary || "Coffee, Food, Drinks");
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

            const payload = {
                contents: [{ parts: [{ text: q }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            };

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            const candidate = result.candidates?.[0];
            let replyText = "សូមអភ័យទោស មានបញ្ហាបន្តិចបន្តួចក្នុងការតភ្ជាប់។ ប៉ុន្តែយើងសូមណែនាំ កាហ្វេទឹកកក និងមុខម្ហូបប្រចាំហាងយើងខ្ញុំ!";

            if (candidate && candidate.content?.parts?.[0]?.text) {
                replyText = candidate.content.parts[0].text;
            }

            document.getElementById(loadingId).remove();
            box.innerHTML += `<div style="background: rgba(255,255,255,0.08); padding: 10px; border-radius: 12px; max-width: 85%;">🤖 ${replyText}</div>`;
            box.scrollTop = box.scrollHeight;
        } catch(e) {
            document.getElementById(loadingId).remove();
            box.innerHTML += `<div style="background: rgba(255,255,255,0.08); padding: 10px; border-radius: 12px; max-width: 85%;">🤖 ថ្ងៃនេះយើងខ្ញុំសូមណែនាំមុខម្ហូបពិសេស និងកាហ្វេស្រស់ប្រចាំហាងដែលឆ្ងាញ់ដាច់គេ!</div>`;
            box.scrollTop = box.scrollHeight;
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('✨', 'ជំនួយការ AI ឆ្លាតវៃ (Gemini)', openGeminiConciergeModal);
            clearInterval(initInt);
        }
    }, 500);
})();