/* STREAMING_CHUNK:Initializing POS Price Tag Generator Pro V6... */
(function() {
    console.log("🏷️ POS Price Tag Generator Pro V6 (Auto-Add & Bulk Category) Initialized!");

    let printList = []; // ផ្ទុកទិន្នន័យទំនិញដែលត្រូវព្រីន

    // 🌟 បង្កប់ CSS ផ្ទាល់ខ្លួនសម្រាប់ Modal & Smart Search
    if (!document.getElementById('skm-pricetag-style')) {
        const style = document.createElement('style');
        style.id = 'skm-pricetag-style';
        style.innerHTML = `
            .skm-tag-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.65); backdrop-filter: blur(6px); z-index: 100000; display: flex; justify-content: center; align-items: center; font-family: 'Battambang', sans-serif; opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
            .skm-tag-bg.skm-show { opacity: 1; pointer-events: auto; }
            .skm-tag-content { background: var(--card-bg, #ffffff); color: var(--text-dark, #1e293b); max-width: 600px; width: 95%; padding: 22px; border-radius: 24px; max-height: 88vh; display: flex; flex-direction: column; box-shadow: 0 25px 60px -15px rgba(0,0,0,0.3); transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 1px solid var(--border-color, #e2e8f0); overflow: hidden; }
            .skm-tag-bg.skm-show .skm-tag-content { transform: translateY(0) scale(1); }
            
            /* រចនា Search Box & Results */
            .tag-search-item { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s; }
            .tag-search-item:hover { background: #f8fafc; }
            
            /* រចនាបញ្ជីរង់ចាំព្រីន */
            .tag-list-container { flex: 1; overflow-y: auto; margin-top: 15px; border: 1px solid #cbd5e1; border-radius: 12px; padding: 10px; background: #f8fafc; min-height: 150px; max-height: 350px; }
            .tag-list-item { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 10px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
            .tag-qty-input { width: 60px; text-align: center; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px; font-weight: bold; outline: none; }
            .tag-qty-input:focus { border-color: #10b981; }
        `;
        document.head.appendChild(style);
    }

    function openPriceTagModal() {
        let modal = document.getElementById('skmPriceTagModal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('skm-show'), 10);
            loadTagCategories();
            return;
        }

        modal = document.createElement('div');
        modal.className = 'skm-tag-bg';
        modal.id = 'skmPriceTagModal';
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('skm-show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };

        modal.innerHTML = `
            <div class="skm-tag-content" onclick="event.stopPropagation()">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border-color, #e5e7eb); padding-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width: 40px; height: 40px; background: rgba(245, 158, 11, 0.12); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🏷️</div>
                        <div>
                            <h3 style="color:var(--text-dark, #1e293b); margin:0; font-size:16px; font-weight:900;">ព្រីនស្លាកតម្លៃ (Ultimate Batch)</h3>
                            <div style="font-size:11px; color:var(--text-muted, #64748b); font-weight:700;">ទាញចូលម្ដង១ប្រភេទ ឬស្កេនចូលអូតូ</div>
                        </div>
                    </div>
                    <div onclick="document.getElementById('skmPriceTagModal').classList.remove('skm-show'); setTimeout(() => document.getElementById('skmPriceTagModal').style.display='none', 300);" style="color: var(--text-muted, #9ca3af); font-size: 16px; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; background: var(--store-bg, #f1f5f9); display: flex; align-items: center; justify-content: center; font-weight: bold;">✕</div>
                </div>
                
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <!-- ជួរទី១: ចំណងជើង & ខ្នាត -->
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 150px;">
                            <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800;">ចំណងជើងស្លាក:</label>
                            <input type="text" id="skmTagHeaderInput" class="input-st" value="THE TIMES MALL" style="margin-bottom:0; padding:10px; font-size:13px; width:100%; border-radius: 8px; border: 1px solid #cbd5e1;">
                        </div>
                        <div style="flex: 1; min-width: 120px;">
                            <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800;">ខ្នាតក្រដាស៖</label>
                            <select id="skmTagSizeSelect" class="input-st" style="margin-bottom:0; padding:10px; font-size:13px; cursor:pointer; width:100%; border-radius: 8px; border: 1px solid #cbd5e1;">
                                <option value="50x30">👉 50mm x 30mm</option>
                                <option value="40x30">👉 40mm x 30mm</option>
                                <option value="30x20">👉 30mm x 20mm</option>
                                <option value="25x15">👉 25mm x 15mm</option>
                            </select>
                        </div>
                        <div style="width: 80px;">
                            <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800;">គម្លាត (mm):</label>
                            <input type="number" id="skmTagMarginInput" class="input-st" value="1" min="0" max="10" step="0.5" style="margin-bottom:0; padding:10px; font-size:13px; width:100%; border-radius: 8px; border: 1px solid #cbd5e1;">
                        </div>
                    </div>
                    
                    <!-- ជួរទី២: Search & Bulk Add -->
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 5px;">
                        <!-- ស្កេន ឬស្វែងរក -->
                        <div style="flex: 1.5; min-width: 200px; position: relative;">
                            <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800; color: #10b981;">ស្វែងរក ឬស្កេនបាកូដ 🔍</label>
                            <input type="text" id="skmTagSearchInput" class="input-st" placeholder="ស្កេន ឬវាយឈ្មោះ (លោតចូលបញ្ជីភ្លាមៗ)..." style="margin-bottom:0; padding:10px; font-size:13px; width:100%; border-radius: 8px; border: 2px solid #10b981;" oninput="window.filterTagProducts(this.value)" onfocus="window.filterTagProducts(this.value)" onkeypress="window.handleTagBarcodeScan(event)" autocomplete="off">
                            
                            <div id="skmTagSearchResults" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:100%; max-height:220px; overflow-y:auto; background:#fff; border:1px solid #cbd5e1; border-radius:8px; z-index:100; box-shadow:0 10px 25px rgba(0,0,0,0.1);"></div>
                        </div>
                        
                        <!-- ទាញម្ដង១ប្រភេទ (Bulk Add) -->
                        <div style="flex: 1; min-width: 150px;">
                            <label style="font-size:12px; display:block; margin-bottom:5px; font-weight:800; color: #0ea5e9;">បន្ថែមម្ដង ១ ប្រភេទ 📦</label>
                            <div style="display: flex; gap: 5px;">
                                <select id="skmTagCategorySelect" class="input-st" style="margin-bottom:0; padding:10px; font-size:13px; cursor:pointer; flex: 1; border-radius: 8px; border: 1px solid #0ea5e9;">
                                    <option value="">-- រើសប្រភេទ --</option>
                                </select>
                                <button style="background:#0ea5e9; color:white; border:none; border-radius:8px; padding:0 12px; font-weight:bold; cursor:pointer; font-family:'Battambang'; font-size:13px;" onclick="window.addCategoryToTagList()" title="ទាញទំនិញទាំងអស់ក្នុងប្រភេទនេះចូលបញ្ជី">➕ បន្ថែម</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- បញ្ជីរង់ចាំព្រីន -->
                <div class="tag-list-container">
                    <div style="font-size: 12px; font-weight: bold; color: var(--text-muted); margin-bottom: 8px; display: flex; justify-content: space-between;">
                        <span>បញ្ជីរង់ចាំព្រីន៖</span>
                        <span style="color: #10b981; font-weight: normal;">* អាចកែប្រែចំនួនសន្លឹក (Qty) តាមចិត្ត</span>
                    </div>
                    <div id="skmTagPrintListBody">
                        <div style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">មិនទាន់មានទំនិញទេ។ សូមស្កេន បញ្ចូលឈ្មោះ ឬជ្រើសរើសប្រភេទ។</div>
                    </div>
                </div>

                <!-- Footer ប៊ូតុងបញ្ជា -->
                <div style="display:flex; justify-content: space-between; align-items: center; margin-top: 15px; border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 15px;">
                    <div style="font-size: 13px; font-weight: bold; color: #1e293b;">សរុបស្លាក: <span id="skmTotalTagsCount" style="color: #d97706; font-size: 18px; font-weight: 900;">0</span></div>
                    <div style="display:flex; gap:10px;">
                        <button style="border:1px solid var(--border-color, #e2e8f0); color:var(--text-dark, #1e293b); border-radius:10px; padding:10px 15px; font-weight:bold; cursor:pointer; background:transparent; font-family:'Battambang'; font-size:13px;" onclick="window.clearTagPrintList()">សម្អាត</button>
                        <button style="background:linear-gradient(135deg, #f59e0b, #d97706); color:white; border:none; border-radius:10px; padding:10px 20px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35); font-family:'Battambang'; font-size:13px;" onclick="window.printPriceTagProBatch()">🖨️ បោះពុម្ពបញ្ជីនេះ</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('skm-show'), 10);
        
        loadTagCategories();
        printList = []; 
        renderTagPrintList();
    }

    // ទាញយកប្រភេទ (Categories) ចូល Dropdown Bulk Add
    function loadTagCategories() {
        const select = document.getElementById('skmTagCategorySelect');
        if(!select) return;
        let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_inv_pro`) || '[]');
        
        let categories = [...new Set(inv.filter(p => p && p.category).map(p => String(p.category).trim()).filter(Boolean))];
        
        select.innerHTML = '<option value="">-- រើសប្រភេទ --</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    // 🌟 មុខងារ Search ទំនិញឆ្លាតវៃ
    window.filterTagProducts = function(keyword) {
        const resBox = document.getElementById('skmTagSearchResults');
        if(!resBox) return;
        
        keyword = keyword.toLowerCase().trim();
        let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_inv_pro`) || '[]');
        
        let filtered = inv;
        if (keyword !== '') {
            filtered = inv.filter(p => 
                (p.name && p.name.toLowerCase().includes(keyword)) || 
                (p.customId && String(p.customId).toLowerCase().includes(keyword)) ||
                (p.id && String(p.id).toLowerCase().includes(keyword))
            );
        }
        
        filtered = filtered.slice(0, 30); // ការពារគាំង

        if (filtered.length === 0) {
            resBox.innerHTML = '<div style="padding: 12px; text-align: center; color: #94a3b8; font-size: 13px;">រកមិនឃើញទំនិញទេ</div>';
        } else {
            resBox.innerHTML = filtered.map(p => `
                <div class="tag-search-item" onclick="window.selectAndAutoAddTag('${p.id}')">
                    <div style="flex:1; min-width:0; padding-right:10px;">
                        <div style="font-size: 13px; font-weight: bold; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
                        <div style="font-size: 10px; color: #64748b;">SKU/Barcode: ${p.customId || p.id}</div>
                    </div>
                    <div style="font-size: 13px; font-weight: 900; color: #10b981;">$${parseFloat(p.price||0).toFixed(2)}</div>
                </div>
            `).join('');
        }
        resBox.style.display = 'block';
    };

    // 🌟 Auto-Add ពេលចុចរើសពីបញ្ជី Search
    window.selectAndAutoAddTag = function(id) {
        document.getElementById('skmTagSearchResults').style.display = 'none';
        document.getElementById('skmTagSearchInput').value = '';
        executeAddTagToList(id);
    };

    // 🌟 Auto-Add ពេលស្កេនបាកូដ ឬវាយកូដចុច Enter
    window.handleTagBarcodeScan = function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const input = document.getElementById('skmTagSearchInput');
            const code = input.value.trim().toLowerCase();
            if (!code) return;

            let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_inv_pro`) || '[]');
            const found = inv.find(p => p && (
                String(p.customId || '').toLowerCase() === code ||
                String(p.id || '').toLowerCase() === code
            ));

            if (found) {
                input.value = '';
                document.getElementById('skmTagSearchResults').style.display = 'none';
                executeAddTagToList(found.id);
            } else {
                alert('រកមិនឃើញបាកូដនេះទេ!');
            }
        }
    };

    // 🌟 Bulk Add: ទាញម្ដង១ប្រភេទចូលបញ្ជី
    window.addCategoryToTagList = function() {
        const catSelect = document.getElementById('skmTagCategorySelect');
        const selectedCat = catSelect.value;
        if (!selectedCat) return alert('សូមជ្រើសរើសប្រភេទជាមុនសិន!');

        let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_inv_pro`) || '[]');
        let itemsInCat = inv.filter(p => p && String(p.category).trim() === selectedCat);

        if (itemsInCat.length === 0) return alert('មិនមានទំនិញក្នុងប្រភេទនេះទេ!');

        itemsInCat.forEach(p => {
            const existingIdx = printList.findIndex(item => String(item.id) === String(p.id));
            if (existingIdx === -1) {
                printList.push({ id: p.id, name: p.name, price: parseFloat(p.price || 0).toFixed(2), code: p.customId || p.id, qty: 1 });
            }
        });

        catSelect.value = '';
        renderTagPrintList();
    };

    // Function ស្នូលសម្រាប់ Push ចូលបញ្ជី
    function executeAddTagToList(id) {
        let inv = window.inventory || JSON.parse(localStorage.getItem(`ks2_${window.SHOP_BRANCH_ID || 'branch_1'}_inv_pro`) || '[]');
        const p = inv.find(x => String(x.id) === String(id));
        if(!p) return;

        const existingIdx = printList.findIndex(item => String(item.id) === String(id));
        if (existingIdx > -1) {
            printList[existingIdx].qty += 1;
        } else {
            printList.push({ id: p.id, name: p.name, price: parseFloat(p.price || 0).toFixed(2), code: p.customId || p.id, qty: 1 });
        }
        renderTagPrintList();
    }

    // បិទប្រអប់ Search ពេលចុចក្រៅ
    document.addEventListener('click', function(e) {
        const resBox = document.getElementById('skmTagSearchResults');
        const searchInput = document.getElementById('skmTagSearchInput');
        if (resBox && e.target !== searchInput && !resBox.contains(e.target)) {
            resBox.style.display = 'none';
        }
    });

    window.updateTagQty = function(index, newQty) {
        newQty = parseInt(newQty);
        if(isNaN(newQty) || newQty < 1) newQty = 1;
        printList[index].qty = newQty;
        renderTagPrintList();
    };

    window.removeTagFromList = function(index) {
        printList.splice(index, 1);
        renderTagPrintList();
    };

    window.clearTagPrintList = function() {
        printList = [];
        renderTagPrintList();
    };

    function renderTagPrintList() {
        const listBody = document.getElementById('skmTagPrintListBody');
        const countDisplay = document.getElementById('skmTotalTagsCount');
        if(!listBody || !countDisplay) return;

        let totalTags = 0;
        if (printList.length === 0) {
            listBody.innerHTML = '<div style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">មិនទាន់មានទំនិញទេ។ សូមស្កេន បញ្ចូលឈ្មោះ ឬជ្រើសរើសប្រភេទ។</div>';
        } else {
            listBody.innerHTML = printList.map((item, idx) => {
                totalTags += item.qty;
                return `
                <div class="tag-list-item">
                    <div style="flex: 1; min-width: 0; padding-right: 10px;">
                        <div style="font-size: 13px; font-weight: bold; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
                        <div style="font-size: 11px; color: #10b981; font-weight: bold;">$${item.price} <span style="color:#64748b;font-size:10px;">(SKU: ${item.code})</span></div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <span style="font-size: 9px; color: #64748b; font-weight: bold;">ចំនួន</span>
                            <input type="number" class="tag-qty-input" value="${item.qty}" min="1" onchange="window.updateTagQty(${idx}, this.value)">
                        </div>
                        <button style="background: transparent; color: #ef4444; border: none; cursor: pointer; padding: 5px; margin-top: 12px;" onclick="window.removeTagFromList(${idx})"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `}).join('');
        }
        countDisplay.innerText = totalTags;
        
        // រំកិលចុះក្រោមស្វ័យប្រវត្តិពេលថែមថ្មី
        const container = document.querySelector('.tag-list-container');
        if (container) container.scrollTop = container.scrollHeight;
    }

    // មុខងារព្រីនដោយគណនាខ្នាតក្រដាសស្វ័យប្រវត្តិ និងមានគម្លាត
    window.printPriceTagProBatch = function() {
        if (printList.length === 0) {
            alert('សូមបន្ថែមទំនិញចូលបញ្ជីជាមុនសិន!');
            return;
        }

        const headerInp = document.getElementById('skmTagHeaderInput');
        const header = headerInp ? headerInp.value : 'THE TIMES MALL';
        
        const sizeSelect = document.getElementById('skmTagSizeSelect');
        const tagSize = sizeSelect ? sizeSelect.value : '50x30';

        const marginInp = document.getElementById('skmTagMarginInput');
        const customMargin = marginInp && marginInp.value ? marginInp.value : '0';

        // កំណត់ Configuration តាមខ្នាតដែលបានជ្រើសរើស (ទំហំក្រដាស និងអក្សរ)
        let conf = {
            '50x30': { w: '50mm', h: '30mm', fh: '7.5px', fn: '11px', fp: '18px', fc: '7px', pad: '2mm', bw: '4px' },
            '40x30': { w: '40mm', h: '30mm', fh: '6px', fn: '9.5px', fp: '15px', fc: '6px', pad: '1.5mm', bw: '3px' },
            '30x20': { w: '30mm', h: '20mm', fh: '4.5px', fn: '7px', fp: '11px', fc: '4.5px', pad: '1mm', bw: '2px' },
            '25x15': { w: '25mm', h: '15mm', fh: '3.5px', fn: '5.5px', fp: '8.5px', fc: '3.5px', pad: '0.5mm', bw: '1.5px' }
        }[tagSize];

        let tagsHtml = '';
        printList.forEach(item => {
            for (let i = 0; i < item.qty; i++) {
                tagsHtml += `
                    <div class="tag-page">
                        <div class="tag-card">
                            <div style="font-size: ${conf.fh}; font-weight: 900; color: #d97706; letter-spacing: 0.5px; margin-bottom: 2px;">${header}</div>
                            <div style="font-size: ${conf.fn}; font-weight: 900; color: #1e293b; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
                            <div style="font-size: ${conf.fp}; font-weight: 900; color: #10b981; margin-bottom: 2px;">$${item.price}</div>
                            <div style="font-size: ${conf.fc}; font-family: monospace; color: #64748b; font-weight: bold;">SKU: ${item.code}</div>
                        </div>
                    </div>
                `;
            }
        });

        const printWin = window.open('', '_blank', 'width=400,height=400');
        printWin.document.write(`
            <html>
                <head>
                    <title>Print Price Tags (${tagSize})</title>
                    <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                    <style>
                        /* បង្ខំទំហំក្រដាសតាមការជ្រើសរើសរបស់ User */
                        @page { size: ${conf.w} ${conf.h}; margin: 0; }
                        body { font-family: 'Battambang', sans-serif; margin: 0; padding: 0; background: #fff; }
                        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                        
                        /* tag-page កំណត់ទំហំ Width/Height ពិតប្រាកដ និងចាក់គម្លាត (Padding) ចូលកណ្តាល */
                        .tag-page { 
                            width: ${conf.w}; height: ${conf.h}; 
                            padding: ${customMargin}mm; /* គម្លាតពីគែម (Margin Adjuster) */
                            display: flex; justify-content: center; align-items: center; 
                            page-break-after: always; box-sizing: border-box; overflow: hidden; 
                        }
                        
                        /* tag-card នឹងរួមតូចស្វ័យប្រវត្តិដោយរុញតាមទំហំ Padding ខាងលើ */
                        .tag-card { 
                            border: 1px solid #1e293b; padding: ${conf.pad}; border-radius: 4px; text-align: center; 
                            width: 100%; height: 100%; position: relative; overflow: hidden; box-sizing: border-box; 
                            display: flex; flex-direction: column; justify-content: center; 
                        }
                        .tag-card::before { content: ''; position: absolute; top: 0; left: 0; width: ${conf.bw}; height: 100%; background: #d97706; }
                    </style>
                </head>
                <body>
                    ${tagsHtml}
                </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); printWin.close(); }, 500);
    };

    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🏷️', 'ព្រីនឡាប៊ែល (Multi-Size)', openPriceTagModal);
            clearInterval(initInt);
        }
    }, 300);
})();