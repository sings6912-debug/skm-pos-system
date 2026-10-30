(function() {
    console.log("🔮 Menu Zodiac & Horoscope Lucky Food Matcher Plugin Initialized!");

    function openZodiacModal() {
        if(document.getElementById('skmZodiacModal')) {
            document.getElementById('skmZodiacModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmZodiacModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 380px; text-align: center; border: 1px solid rgba(168,85,247,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">🔮</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #a855f7;">ហុងស៊ុយម្ហូបនាំលាភសំណាង</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">ជ្រើសរើសឆ្នាំកំណើតរបស់អ្នកដើម្បីស្វែងរកម្ហូបត្រូវជើងថ្ងៃនេះ៖</p>
                
                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">ជ្រើសរើសឆ្នាំកំណើត (Zodiac):</div>
                <select id="zodiacSelect" style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px; color: #fff; font-size: 12px; outline: none; margin-bottom: 15px; font-family:'Battambang';">
                    <option value="ជូត">🐀 ឆ្នាំជូត (កណ្តុរ)</option>
                    <option value="ឆ្លូវ">🐂 ឆ្នាំឆ្លូវ (គោ)</option>
                    <option value="ខាល">🐅 ឆ្នាំខាល (ខ្លា)</option>
                    <option value="ថោះ">🐇 ឆ្នាំថោះ (ទន្សាយ)</option>
                    <option value="រោង">🐉 ឆ្នាំរោង (នាគ)</option>
                    <option value="ម្សាញ់">🐍 ឆ្នាំម្សាញ់ (ពស់)</option>
                    <option value="មមី">🐎 ឆ្នាំមមី (សេះ)</option>
                    <option value="មមែ">🐐 ឆ្នាំមមែ (ពะដី)</option>
                    <option value="វក">🐒 ឆ្នាំវក (ស្វា)</option>
                    <option value="រកា">🐓 ឆ្នាំរកា (មាន់)</option>
                    <option value="ចរ">🐕 ឆ្នាំចរ (ឆ្កែ)</option>
                    <option value="កុរ" selected>🐖 ឆ្នាំកុរ (ជ្រូក)</option>
                </select>

                <div id="zodiacResultBox" style="background: rgba(168,85,247,0.08); border: 1px dashed #a855f7; padding: 14px; border-radius: 16px; margin-bottom: 15px; text-align: center; display: none;">
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">✨ មុខម្ហូបនាំសំណាងថ្ងៃនេះរបស់អ្នក:</div>
                    <div id="zodiacFoodName" style="font-size: 15px; font-weight: 900; color: #a855f7; margin-bottom: 2px;">---</div>
                    <div id="zodiacLuckyInfo" style="font-size: 11px; color: var(--text-dark);">---</div>
                </div>

                <button class="btn-act btn-green" style="width: 100%; background: #a855f7; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.calculateZodiacFortune()">🔮 ទស្សន៍ទាយហុងស៊ុយម្ហូប</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(168,85,247,0.1); color:#a855f7; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmZodiacModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.calculateZodiacFortune = function() {
        const zodiac = document.getElementById('zodiacSelect').value;
        const box = document.getElementById('zodiacResultBox');
        const foodEl = document.getElementById('zodiacFoodName');
        const infoEl = document.getElementById('zodiacLuckyInfo');
        if (!box) return;

        box.style.display = 'block';

        let inv = window.inventory || [];
        let match = inv[Math.floor(Math.random() * inv.length)];
        let foodName = match ? match.name : 'កាហ្វេដូងក្រអូបប្រចាំហាង';
        let price = match ? `$${parseFloat(match.price || 0).toFixed(2)}` : '$3.50';

        const luckyColors = ['ពណ៌ក្រហម', 'ពណ៌មាស', 'ពណ៌បៃតង', 'ពណ៌ខៀវ'];
        const luckyNums = ['៨៨', '៩', '១៦៨', '២៤'];
        let color = luckyColors[Math.floor(Math.random() * luckyColors.length)];
        let num = luckyNums[Math.floor(Math.random() * luckyNums.length)];

        foodEl.innerText = `🌟 ${foodName} (${price})`;
        infoEl.innerHTML = `សម្រាប់ឆ្នាំ <b>${zodiac}</b> | ពណ៌នាំលាភ: <b>${color}</b> | លេខសំណាង: <b>${num}</b>`;

        if (typeof showToast === 'function') showToast(`🔮 ទស្សន៍ទាយហុងស៊ុយឆ្នាំ ${zodiac} ជោគជ័យ!`);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔮', 'ហុងស៊ុយម្ហូបតាមឆ្នាំកំណើត (Zodiac)', openZodiacModal);
            clearInterval(initInt);
        }
    }, 500);
})();
```
eof

```javascript:កាតសំណូមពរពិសេសជូនមេចុងភៅ (Chef Request Card):menu_chef_request_card.js
(function() {
    console.log("👨‍🍳 Menu Chef Request Card Generator Plugin Initialized!");

    function openChefCardModal() {
        if(document.getElementById('skmChefCardModal')) {
            document.getElementById('skmChefCardModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmChefCardModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 390px; text-align: center; border: 1px solid rgba(245,158,11,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 42px; margin-bottom: 5px;">👨‍🍳</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #f59e0b;">កាតសំណូមពរជូនមេចុងភៅ</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើសសំណូមពរពិសេសសម្រាប់ការចម្អិន៖</p>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; text-align: left; font-size: 12px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;"><input type="checkbox" class="chef-req-chk" value="មិនដាក់ប៊ីចេង (No MSG)"> 🌿 មិនដាក់ប៊ីចេង (No MSG)</label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;"><input type="checkbox" class="chef-req-chk" value="កាត់ផ្អែម / មិនសូវផ្អែម (Less Sweet)"> 🥤 កាត់ផ្អែម / មិនសូវផ្អែម</label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;"><input type="checkbox" class="chef-req-chk" value="មិនដាក់ម្ទេស / មិនហឹរ (No Spicy)"> 🌶️ មិនដាក់ម្ទេស / មិនហឹរ</label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;"><input type="checkbox" class="chef-req-chk" value="ចម្អិនឱ្យឆ្អិនល្អ (Well Done)"> 🔥 ចម្អិនឱ្យឆ្អិនល្អ (Well Done)</label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;"><input type="checkbox" class="chef-req-chk" value="សុំទឹកស៊ុបបន្ថែម (Extra Soup)"> 🍲 សុំទឹកស៊ុបបន្ថែម (Extra Soup)</label>
                </div>

                <div style="text-align: left; font-size: 11px; font-weight: bold; margin-bottom: 4px;">សំណូមពរបន្ថែម (Custom Note):</div>
                <input type="text" id="chefCustomNoteInp" placeholder="ឧ. សូមដាក់ក្នុងប្រអប់ដាច់ដោយឡែក..." style="width: 100%; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: #fff; font-size: 12px; outline: none; margin-bottom: 15px; font-family:'Battambang';">

                <button class="btn-act btn-green" style="width: 100%; background: #f59e0b; border: none; border-radius: 12px; padding: 12px; font-weight: bold; margin-bottom: 8px; cursor: pointer;" onclick="window.applyChefRequestCard()">📥 បញ្ចូលកាតសំណូមពរក្នុងកន្ត្រក</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(245,158,11,0.1); color:#f59e0b; border-radius: 12px; padding: 10px; cursor: pointer;" onclick="document.getElementById('skmChefCardModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.applyChefRequestCard = function() {
        let selected = [];
        document.querySelectorAll('.chef-req-chk:checked').forEach(chk => {
            selected.push(chk.value);
        });

        const custom = document.getElementById('chefCustomNoteInp').value.trim();
        if (custom) selected.push(custom);

        if (selected.length === 0) {
            alert('សូមជ្រើសរើសសំណូមពរយ៉ាងហោចណាស់ ១!');
            return;
        }

        let cardText = `[👨‍🍳 សំណូមពរមេចុងភៅ: ${selected.join(', ')}]`;
        const noteInput = document.getElementById('cNote');
        
        if (noteInput) {
            let currentVal = noteInput.value.replace(/\[👨‍🍳 សំណូមពរមេចុងភៅ:.*?\]/g, '').trim();
            noteInput.value = currentVal ? `${currentVal}, ${cardText}` : cardText;
        }

        document.getElementById('skmChefCardModal').style.display = 'none';
        if (typeof showToast === 'function') showToast('បានបង្កើត និងបញ្ចូលកាតសំណូមពរជូនមេចុងភៅជោគជ័យ!');
        else alert('បានបង្កើតកាតសំណូមពរជោគជ័យ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('👨‍🍳', 'កាតសំណូមពរជូនមេចុងភៅ (Chef Card)', openChefCardModal);
            clearInterval(initInt);
        }
    }, 500);
})();
```
eof

### របៀបដាក់បញ្ចូល៖
1. Save កូដទាំងពីរនេះជា File ឈ្មោះ **`menu_zodiac_lucky_food.js`** និង **`menu_chef_request_card.js`**។
2. ចូលទៅកាន់ Menu Admin ប្រអប់ទី 6 (**Menu Custom JS**) រួច Upload File ទាំងពីរនេះបញ្ចូលគ្នា។
3. ចុច **Save Changes** ជាការស្រេច! ប្រសិនបើបងចង់បន្ថែមមុខងារផ្សេងទៀត អាចបន្តពាក្យ **"ត"** មកបានគ្រប់ពេល!