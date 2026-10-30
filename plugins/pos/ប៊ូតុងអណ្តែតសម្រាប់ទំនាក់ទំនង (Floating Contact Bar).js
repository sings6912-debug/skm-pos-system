(function() {
    // ⚡ ការពារមិនឱ្យកូដនេះរត់ជាន់គ្នាបង្កើតប៊ូតុង ២ដង
    if (document.getElementById('skm-floating-bar-container')) return;

    console.log("💬 POS Ultra-Premium Smart Floating Contact Bar (Text Visible) Initialized!");

    // ទាញយកលេខទូរស័ព្ទហាង
    const branchId = window.SHOP_BRANCH_ID || 'branch_1';
    let shopPhone = window.shopPhone || localStorage.getItem('skm_' + branchId + '_shop_phone') || '';
    
    // ទាញយក Link ចេញពី Settings របស់មេ
    let sysSettings = {};
    try {
        sysSettings = JSON.parse(localStorage.getItem('skm_' + branchId + '_sys_settings')) || {};
    } catch(e) {}
    
    let tgLink = sysSettings.floatingChatLink || sysSettings.floatingChat || sysSettings.telegramContact || 'https://t.me/Jheng6912';

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes skmSlideInRight {
            0% { transform: translateX(50px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        .skm-floating-bar-v3 {
            position: fixed;
            bottom: 100px; /* លើកឱ្យផុតពីប៊ូតុងកង់ស្ពឺខាងក្រោម */
            right: 20px;   /* នៅជាប់គែមខាងស្តាំ មិនបាំងកណ្តាលអេក្រង់ */
            z-index: 9998;
            display: flex;
            flex-direction: column; /* តម្រៀបលើក្រោម */
            gap: 12px;
            animation: skmSlideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .skm-fc-btn-v3 {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #fff;
            text-decoration: none;
            font-size: 13px; /* ទំហំអក្សរល្មមអានដាច់ */
            font-weight: bold;
            font-family: 'Battambang', 'Nunito', sans-serif;
            padding: 10px 16px; /* រាងទ្រវែង (Pill shape) ឃើញអក្សរច្បាស់ជានិច្ច */
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .skm-fc-btn-v3:active { transform: scale(0.95); }
        
        .skm-fc-tel-v3 { 
            background: linear-gradient(135deg, #10b981, #059669); 
        }
        .skm-fc-tel-v3:hover { box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4); transform: translateY(-2px); }
        
        .skm-fc-tg-v3 { 
            background: linear-gradient(135deg, #38bdf8, #0284c7); 
        }
        .skm-fc-tg-v3:hover { box-shadow: 0 6px 18px rgba(56, 189, 248, 0.4); transform: translateY(-2px); }
    `;
    document.head.appendChild(style);

    const barContainer = document.createElement('div');
    barContainer.id = 'skm-floating-bar-container';
    barContainer.className = 'skm-floating-bar-v3';
    
    let htmlContent = '';
    
    // បង្កើតប៊ូតុង Telegram 
    htmlContent += `<a href="${tgLink}" target="_blank" class="skm-fc-btn-v3 skm-fc-tg-v3">
                        <i class="fa-brands fa-telegram" style="font-size: 16px;"></i> Telegram
                    </a>`;

    // បង្កើតប៊ូតុងទូរស័ព្ទ
    let phoneHref = shopPhone ? shopPhone.replace(/\s+/g, '') : '012345678';
    htmlContent += `<a href="tel:${phoneHref}" class="skm-fc-btn-v3 skm-fc-tel-v3">
                        <i class="fa-solid fa-phone" style="font-size: 14px;"></i> ខលទូរស័ព្ទ
                    </a>`;

    barContainer.innerHTML = htmlContent;
    document.body.appendChild(barContainer);
})();