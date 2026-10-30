(function() {
    console.log("🧠 Menu Table Trivia & Quiz Challenge Plugin Initialized!");

    function openTriviaModal() {
        if(document.getElementById('skmTriviaModal')) {
            document.getElementById('skmTriviaModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmTriviaModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(16,185,129,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🧠</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #10b981;">ល្បែងសំណួរចំណេះដឹងពេលរង់ចាំ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ឆ្លើយសំណួរឱ្យត្រូវដើម្បីឈ្នះកូដបញ្ចុះតម្លៃพิเศษ!</p>
                
                <div style="background: rgba(16,185,129,0.08); border: 1px solid var(--border-color); padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <b style="color: #10b981; display: block; margin-bottom: 8px;">សំណួរ៖ តើកាហ្វេប្រភេទណាដែលល្បីល្បាញជាងគេលើពិភពលោក?</b>
                    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px;">
                        <button onclick="window.answerTrivia(false)" style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid var(--border-color); padding: 10px; border-radius: 10px; cursor: pointer; text-align: left; font-family:'Battambang'; font-size:11px;">ក. កាហ្វេបៃតងឆៅ</button>
                        <button onclick="window.answerTrivia(true)" style="background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid #10b981; padding: 10px; border-radius: 10px; cursor: pointer; text-align: left; font-family:'Battambang'; font-size:11px; font-weight:bold;">ខ. កាហ្វេអារ៉ាប៊ីកា (Arabica)</button>
                        <button onclick="window.answerTrivia(false)" style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid var(--border-color); padding: 10px; border-radius: 10px; cursor: pointer; text-align: left; font-family:'Battambang'; font-size:11px;">គ. តែបៃតងក្រអូប</button>
                    </div>
                </div>

                <div id="triviaResultMsg" style="font-size: 12px; font-weight: bold; margin-bottom: 15px; display: none;"></div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(16,185,129,0.1); color:#10b981; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmTriviaModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.answerTrivia = function(isCorrect) {
        const msg = document.getElementById('triviaResultMsg');
        if (!msg) return;
        msg.style.display = 'block';

        if (isCorrect) {
            msg.innerHTML = `<span style="color: #10b981;">🎉 ត្រឹមត្រូវស្ដូក! អ្នកឈ្នះកូដ: <b style="font-size:14px;">TRIVIA15</b> (បញ្ចុះ $1.50)</span>`;
            const promoInput = document.getElementById('cPromo');
            if (promoInput) promoInput.value = 'TRIVIA15';
            if (typeof showToast === 'function') showToast('អបអរសាទរ! បានដាក់កូដ TRIVIA15 ជោគជ័យ!');
        } else {
            msg.innerHTML = `<span style="color: #ef4444;">❌ ខុសហើយ! ចម្លើយដែលត្រឹមត្រូវគឺ ខ. អារ៉ាប៊ីកា។</span>`;
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🧠', 'ល្បែងសំណួរចំណេះដឹង (Trivia Challenge)', openTriviaModal);
            clearInterval(initInt);
        }
    }, 500);
})();