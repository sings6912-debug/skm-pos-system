/* STREAMING_CHUNK:Initializing POS Discount Helper with Fixed KHR Conversion Pro... */
(function() {
    console.log("🏷️ POS Discount Helper Pro Initialized!");

    // 🌟 បង្កប់ CSS ផ្ទាល់ខ្លួនសម្រាប់ Modal ឱ្យមានសោភ័ណភាពស្អាតទំនើប
    if (!document.getElementById('skm-discount-style')) {
        const style = document.createElement('style');
        style.id = 'skm-discount-style';
        style.innerHTML = `
            .skm-disc-bg {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
                z-index: 100000; display: flex; justify-content: center; align-items: center;
                font-family: 'Battambang', sans-serif; opacity: 0; transition: opacity 0.3s ease;
                pointer-events: none;
            }
            .skm-disc-bg.skm-show {
                opacity: 1; pointer-events: auto;
            }
            .skm-disc-content {
                background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b);
                max-width: 440px; width: 92%; padding: 25px; border-radius: 28px;
                max-height: 88vh; display: flex; flex-direction: column;
                box-shadow: 0 25px 60px -15px rgba(0,0,0,0.3);
                transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid var(--border-color, #e2e8f0);
            }
            .skm-disc-bg.skm-show .skm-disc-content {
                transform: translateY(0) scale(1);
            }
        `;
        document.head.appendChild(style);
    }

    /* STREAMING_CHUNK:Opening Discount Helper Modal with Fixed KHR Support... */
    function openDiscountHelper() {
        let modal = document.getElementById('skmDiscountModal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('skm-show'), 10);
            return;
        }

        modal = document.createElement('div');
        modal.className = 'skm-disc-bg';
        modal.id = 'skmDiscountModal';
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('skm-show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };

        modal.innerHTML = `
            <div class="skm-disc-content" onclick="event.stopPropagation()">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border-color, #e2e8f0); padding-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width: 42px; height: 42px; background: rgba(56, 189, 248, 0.12); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                            🏷️
                        </div>
                        <div>
                            <h3 style="color:var(--text-dark, #1e293b); margin:0; font-size:16px; font-weight:900;">គណនាលក់បញ្ចុះតម្លៃរហ័ស</h3>
                            <div style="font-size:11px; color:var(--text-muted, #64748b); font-weight:700;">Quick Discount Calculator (USD & KHR)</div>
                        </div>
                    </div>
                    <div onclick="document.getElementById('skmDiscountModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmDiscountModal').style.display='none', 300);" style="color: var(--text-muted, #9ca3af); font-size: 16px; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; background: var(--store-bg, #f1f5f9); display: flex; align-items: center; justify-content: center; font-weight: bold;">✕</div>
                </div>
                
                <!-- តម្លៃដើមទំនិញ (អាចជ្រើសរើស USD ឬ KHR) -->
                <div style="margin-bottom:14px;">
                    <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800; color:var(--text-dark, #1e293b);">តម្លៃដើមទំនិញ៖</label>
                    <div style="display:flex; gap:8px;">
                        <input type="number" id="skmOrigPrice" class="input-st" placeholder="0.00" style="margin-bottom:0; flex:1; padding:12px; font-size:16px; font-weight:bold;" oninput="window.calcDiscountResult()">
                        <select id="skmOrigCurr" class="input-st" style="margin-bottom:0; width:120px; padding:12px; font-size:13px; cursor:pointer; font-weight:bold;" onchange="window.calcDiscountResult()">
                            <option value="USD">USD ($)</option>
                            <option value="KHR">KHR (៛)</option>
                        </select>
                    </div>
                </div>
                
                <!-- អត្រាបញ្ចុះតម្លៃ -->
                <div style="margin-bottom:15px;">
                    <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800; color:var(--text-dark, #1e293b);">អត្រាបញ្ចុះតម្លៃ (% ឬ រូបិយប័ណ្ណ)៖</label>
                    <div style="display:flex; gap:8px;">
                        <input type="number" id="skmDiscVal" class="input-st" placeholder="10" style="margin-bottom:0; flex:1; padding:12px; font-size:16px; font-weight:bold;" oninput="window.calcDiscountResult()">
                        <select id="skmDiscType" class="input-st" style="margin-bottom:0; width:120px; padding:12px; font-size:13px; cursor:pointer; font-weight:bold;" onchange="window.calcDiscountResult()">
                            <option value="percent">% ភាគរយ</option>
                            <option value="amount">ចំនួនប្រាក់</option>
                        </select>
                    </div>
                </div>

                <button style="width:100%; margin-bottom:18px; background:linear-gradient(135deg, #0ea5e9, #0284c7); color:white; border:none; border-radius:14px; padding:13px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.35); font-family:'Battambang'; font-size:14px;" onclick="window.calcDiscountResult()">🧮 គណនារកតម្លៃលក់ចុងក្រោយ</button>

                <div style="background: rgba(56,189,248,0.06); border: 1px dashed #38bdf8; padding: 16px; border-radius: 16px; text-align: center; margin-bottom: 18px;">
                    <div style="font-size:12px; color:var(--text-muted, #64748b); font-weight:800;">តម្លៃត្រូវបង់ក្រោយបញ្ចុះតម្លៃ:</div>
                    <div id="skmFinalPriceDisplay" style="font-size:24px; font-weight:900; color:#0284c7; margin-top:4px;">$0.00 (0 ៛)</div>
                    <div id="skmSavedDisplay" style="font-size:12px; color:#10b981; font-weight:900; margin-top:4px;">ចំណេញបាន: $0.00 (0 ៛)</div>
                </div>

                <div style="display:flex; justify-content:flex-end; border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 15px;">
                    <button style="border:1px solid var(--border-color, #e2e8f0); color:var(--text-dark, #1e293b); border-radius:12px; padding:10px 22px; font-weight:bold; cursor:pointer; background:transparent; font-family:'Battambang'; font-size:13px;" onclick="document.getElementById('skmDiscountModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmDiscountModal').style.display='none', 300);">បិទ</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('skm-show'), 10);
    }

    /* STREAMING_CHUNK:Calculating discount with proper currency handling... */
    window.calcDiscountResult = function() {
        const origInput = parseFloat(document.getElementById('skmOrigPrice').value);
        const val = parseFloat(document.getElementById('skmDiscVal').value);
        const type = document.getElementById('skmDiscType').value;
        const curr = document.getElementById('skmOrigCurr').value;
        const exRate = 4000; // អត្រាប្តូរប្រាក់រៀលស្ដង់ដារ

        if(isNaN(origInput) || origInput <= 0) { 
            document.getElementById('skmFinalPriceDisplay').innerText = `$0.00 (0 ៛)`;
            document.getElementById('skmSavedDisplay').innerText = `ចំណេញបាន: $0.00 (0 ៛)`;
            return; 
        }

        // បម្លែងតម្លៃដើមទៅជា USD សម្រាប់ការគណនា
        let origUsd = curr === 'KHR' ? origInput / exRate : origInput;
        let valNum = isNaN(val) ? 0 : val;

        let finalUsd = 0;
        let savedUsd = 0;

        if (type === 'percent') {
            savedUsd = origUsd * (valNum / 100);
            finalUsd = origUsd - savedUsd;
        } else {
            // បើបញ្ចុះជាចំនួនប្រាក់ ផ្អែកតាម Currency ដែលបានរើស
            let discountUsd = curr === 'KHR' ? valNum / exRate : valNum;
            savedUsd = discountUsd;
            finalUsd = Math.max(0, origUsd - savedUsd);
        }

        const finalKhr = Math.round(finalUsd * exRate).toLocaleString();
        const savedKhr = Math.round(savedUsd * exRate).toLocaleString();

        document.getElementById('skmFinalPriceDisplay').innerText = `$${finalUsd.toFixed(2)} (${finalKhr} ៛)`;
        document.getElementById('skmSavedDisplay').innerText = `ចំណេញបាន: $${savedUsd.toFixed(2)} (${savedKhr} ៛)`;
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🏷️️', 'គណនាលក់បញ្ចុះតម្លៃរហ័ស', openDiscountHelper);
            clearInterval(initInt);
        }
    }, 300);
})();