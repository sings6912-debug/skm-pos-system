/* STREAMING_CHUNK:Initializing Super Premium Table QR Generator... */
(function() {
    console.log("📱 POS Super Premium QR Code Generator Plugin Initialized!");

    /* STREAMING_CHUNK:Building Flawless Premium UI... */
    function openTableQrModal() {
        if(document.getElementById('skmTableQrModal')) {
            document.getElementById('skmTableQrModal').style.display = 'flex';
            window.updateTableQrPreview();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmTableQrModal';
        // Glassmorphism Backdrop
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.65); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 20px; box-sizing: border-box;`;
        
        /* STREAMING_CHUNK:Injecting Flawless CSS and Layout (Fixed Clipping)... */
        modal.innerHTML = `
            <style>
                .skm-qr-box { background: #ffffff; color: #1e293b; padding: 25px 30px; border-radius: 28px; width: 100%; max-width: 460px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); display: flex; flex-direction: column; gap: 18px; box-sizing: border-box; max-height: 95vh; }
                .skm-qr-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; flex-shrink: 0; }
                
                .skm-qr-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; padding-right: 4px; }
                .skm-qr-body::-webkit-scrollbar { width: 5px; }
                .skm-qr-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

                .skm-input-group { display: flex; flex-direction: column; gap: 6px; }
                .skm-input-label { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                .skm-qr-input { font-size: 15px; font-weight: 700; padding: 14px 16px; border-radius: 16px; border: 1.5px solid transparent; width: 100%; transition: all 0.3s ease; color: #0f172a; background: #f8fafc; outline: none; font-family: 'Nunito', 'Battambang', sans-serif; box-sizing: border-box; }
                .skm-qr-input:focus { border-color: #3b82f6; background: #ffffff; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); }
                
                /* Super Premium Card Preview Style - FIXED CLIPPING */
                .skm-qr-card { background: #ffffff; border-radius: 20px; padding: 35px 20px 25px 20px; text-align: center; box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08); display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; margin: 5px auto; position: relative; border: 1px solid #e2e8f0; }
                .skm-qr-card::before { content: ''; position: absolute; top: -1px; left: -1px; right: -1px; height: 6px; background: linear-gradient(90deg, #0ea5e9, #8b5cf6, #ec4899); border-radius: 20px 20px 0 0; }
                
                .skm-qr-shop-title { font-size: 16px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin-top: 0; margin-bottom: 12px; letter-spacing: 0.5px; line-height: 1.4; padding: 0 10px; }
                .skm-qr-table-title { font-size: 14px; font-weight: 800; color: #4338ca; background: #e0e7ff; padding: 8px 22px; border-radius: 30px; margin-bottom: 22px; display: inline-block; border: 1px solid #c7d2fe; letter-spacing: 0.5px; }
                
                .skm-qr-img-wrapper { padding: 12px; border-radius: 20px; border: 2px solid #e0f2fe; background: #ffffff; margin-bottom: 20px; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 8px 25px rgba(14, 165, 233, 0.1); }
                .skm-qr-img-wrapper:hover { border-color: #3b82f6; transform: scale(1.05) translateY(-2px); box-shadow: 0 15px 35px rgba(59, 130, 246, 0.2); }
                .skm-qr-img { width: 180px; height: 180px; object-fit: contain; display: block; border-radius: 8px; }
                
                .skm-qr-scan-kh { font-size: 15px; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
                .skm-qr-scan-en { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                .skm-qr-url-text { font-size: 9px; color: #94a3b8; margin-top: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90%; background: #f8fafc; padding: 5px 10px; border-radius: 6px; }
                
                /* Modern Buttons */
                .skm-btn-print { background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; border: none; padding: 16px; border-radius: 16px; font-size: 15px; font-weight: bold; cursor: pointer; flex: 1.5; transition: 0.3s; box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3); font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 8px; }
                .skm-btn-print:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4); }
                .skm-btn-close { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 16px; border-radius: 16px; font-size: 15px; font-weight: bold; cursor: pointer; flex: 1; transition: 0.3s; text-align: center; font-family: inherit; }
                .skm-btn-close:hover { background: #e2e8f0; color: #1e293b; }
            </style>
            
            <div class="skm-qr-box">
                <div class="skm-qr-header">
                    <h3 style="margin:0; font-size:18px; display: flex; align-items: center; gap: 10px; color: #0f172a; font-weight: 900;">
                        <span style="font-size: 24px; background: #e0f2fe; padding: 8px; border-radius: 14px; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.1);">📱</span> បង្កើត QR Code
                    </h3>
                    <button onclick="document.getElementById('skmTableQrModal').style.display='none'" style="background: #fef2f2; border: 1px solid #fca5a5; color: #ef4444; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">✕</button>
                </div>
                
                <div class="skm-qr-body">
                    <div style="display: flex; gap: 15px;">
                        <div class="skm-input-group" style="flex: 1;">
                            <label class="skm-input-label">ឈ្មោះទីតាំង / លេខតុ</label>
                            <input type="text" id="skmQrTableName" class="skm-qr-input" value="ទីតាំង 01" oninput="window.updateTableQrPreview()">
                        </div>
                        <div class="skm-input-group" style="flex: 1.5;">
                            <label class="skm-input-label">អក្សរណែនាំខាងក្រោម</label>
                            <input type="text" id="skmQrSubText" class="skm-qr-input" value="ស្កេនដើម្បីមើលបញ្ជីទំនិញ" oninput="window.updateTableQrPreview()">
                        </div>
                    </div>

                    <!-- Super Premium QR Code Preview Box (FIXED CLIPPING) -->
                    <div class="skm-qr-card">
                        <div class="skm-qr-shop-title" id="qrPrevShopName">SHOP NAME</div>
                        <div class="skm-qr-table-title" id="qrPrevTitle">ទីតាំង 01</div>
                        
                        <div class="skm-qr-img-wrapper">
                            <img id="qrPrevImg" src="" class="skm-qr-img">
                        </div>
                        
                        <div class="skm-qr-scan-kh" id="qrPrevScanKh">ស្កេនដើម្បីមើលបញ្ជីទំនិញ</div>
                        <div class="skm-qr-scan-en">Scan QR code to view our products & order</div>
                        <div class="skm-qr-url-text" id="qrPrevUrlText">...</div>
                    </div>

                    <div style="display:flex; gap:12px; margin-top: 5px; flex-shrink: 0;">
                        <button class="skm-btn-close" onclick="document.getElementById('skmTableQrModal').style.display='none'">បិទផ្ទាំង</button>
                        <button class="skm-btn-print" onclick="window.printTableQr()"><span>🖨️</span> បោះពុម្ព (Print)</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });

        // Set Shop Name for preview
        document.getElementById('qrPrevShopName').innerText = window.shopName || 'SHOP NAME';

        window.updateTableQrPreview();
    }

    /* STREAMING_CHUNK:Implementing Link & Text Generation... */
    window.updateTableQrPreview = function() {
        const name = document.getElementById('skmQrTableName').value.trim() || 'ទីតាំង 01';
        const subText = document.getElementById('skmQrSubText').value.trim() || 'ស្កេនដើម្បីមើលបញ្ជីទំនិញ';
        
        document.getElementById('qrPrevTitle').innerText = name;
        document.getElementById('qrPrevScanKh').innerText = subText;
        
        let path = window.location.pathname;
        let lastSlash = path.lastIndexOf('/');
        let menuBaseUrl = window.location.origin + path.substring(0, lastSlash + 1) + 'menu.html';
        
        let branchId = window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
        let fullUrl = `${menuBaseUrl}?branch=${branchId}&table=${encodeURIComponent(name)}`;
        
        let encodedUrl = encodeURIComponent(fullUrl);
        // Using a slightly higher resolution for crisper image in the premium card
        document.getElementById('qrPrevImg').src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`;
        
        document.getElementById('qrPrevUrlText').innerText = `${menuBaseUrl}?table=${name}`;
    };

    /* STREAMING_CHUNK:Implementing Premium Print Layout... */
    window.printTableQr = function() {
        const name = document.getElementById('skmQrTableName').value.trim() || 'ទីតាំង 01';
        const subText = document.getElementById('skmQrSubText').value.trim() || 'ស្កេនដើម្បីមើលបញ្ជីទំនិញ';
        const qrSrc = document.getElementById('qrPrevImg').src;
        const shopName = window.shopName || 'SHOP NAME';
        
        const printWin = window.open('', '', 'width=600,height=800');
        printWin.document.write(`
            <html>
                <head>
                    <title>Print QR - ${name}</title>
                    <style>
                        body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f8fafc; font-family: 'Helvetica Neue', Arial, sans-serif; }
                        .print-card { 
                            background: #ffffff;
                            border: 2px solid #e2e8f0; 
                            padding: 45px 35px; 
                            border-radius: 24px; 
                            text-align: center; 
                            width: 340px; 
                            box-shadow: 0 15px 40px rgba(0,0,0,0.08);
                            box-sizing: border-box;
                            position: relative;
                            overflow: hidden;
                        }
                        /* Top Accent Line for Print */
                        .print-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: #0ea5e9; }
                        
                        .shop-name { font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.3; }
                        .table-name { font-size: 16px; font-weight: 800; color: #2563eb; background: #eff6ff; padding: 6px 20px; border-radius: 20px; border: 1px solid #bfdbfe; display: inline-block; margin-bottom: 25px; }
                        
                        .qr-wrapper { border: 2px solid #e2e8f0; padding: 15px; border-radius: 16px; display: inline-block; margin-bottom: 20px; }
                        .qr-image { width: 220px; height: 220px; object-fit: contain; display: block; }
                        
                        .scan-kh { font-size: 18px; font-weight: 900; color: #1e293b; margin-bottom: 6px; }
                        .scan-en { font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
                        
                        /* Print Specific Overrides */
                        @media print {
                            body { background: #fff; }
                            .print-card { box-shadow: none; border: 3px solid #000; padding: 40px 30px; width: 100%; max-width: 380px; }
                            .print-card::before { background: #000; }
                            .shop-name { color: #000; }
                            .table-name { color: #000; background: #fff; border-color: #000; }
                            .qr-wrapper { border-color: #000; border-style: solid; }
                            .scan-kh { color: #000; }
                            .scan-en { color: #333; }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-card">
                        <div class="shop-name">${shopName}</div>
                        <div class="table-name">${name}</div>
                        
                        <div class="qr-wrapper">
                            <img src="${qrSrc}" class="qr-image">
                        </div>
                        
                        <div class="scan-kh">${subText}</div>
                        <div class="scan-en">Scan QR code to view our products & order</div>
                    </div>
                </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        
        // រង់ចាំឱ្យរូបភាព Load ពេញសិន ទើបបញ្ជាឱ្យ Print
        setTimeout(() => { 
            printWin.print(); 
            printWin.close(); 
        }, 800);
    };

    /* STREAMING_CHUNK:Registering Plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('📱', 'បង្កើត QR Code (ទម្រង់ទូទៅ)', openTableQrModal);
            clearInterval(initInt);
        }
    }, 500);
})();