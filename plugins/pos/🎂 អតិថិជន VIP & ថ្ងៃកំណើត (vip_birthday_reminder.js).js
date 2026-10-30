/* STREAMING_CHUNK:Initializing VIP & Birthday Plugin with Telegram Sync... */
(function() {
    console.log("🎂 POS VIP Birthday & Special Reminders Plugin Initialized (With Telegram Sync)!");

    // 🔑 Supabase Config សម្រាប់ការអាន Telegram Settings បើចាំបាច់
    const S_URL = 'https://uynmpjykedjjjyxczsja.supabase.co';
    const S_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bm1wanlrZWRqamp5eGN6c2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MDc1NjIsImV4cCI6MjEwMjE4MzU2Mn0.vw8UpBoEWvbQwl2J5alfTB0nvv7EizB8EpwEsp4ugCg';
    
    let pluginSupabase = null;
    if (window.supabase) {
        pluginSupabase = window.supabase.createClient(S_URL, S_KEY, {
            auth: { persistSession: false },
            global: { fetch: (...args) => fetch(args[0], { ...args[1], cache: 'no-store' }) }
        });
    }

    /* STREAMING_CHUNK:Utility functions for Branch and Telegram... */
    function getCurrentBranchId() {
        return window.SHOP_BRANCH_ID || new URLSearchParams(window.location.search).get('branch') || 'branch_1';
    }

    // ទាញយក Telegram Token ពី Admin Settings ស្ដង់ដារ
    async function getTelegramCredentials() {
        const currentBranch = getCurrentBranchId();
        let token = ''; let cid = '';
        try {
            if (window.botToken && window.chatId) return { token: window.botToken, cid: window.chatId };
            
            let sysData = JSON.parse(localStorage.getItem(`ks2_${currentBranch}_sys_settings`) || '{}');
            token = sysData.telegramBotToken || sysData.sysSettings?.telegramBotToken || '';
            cid = sysData.telegramChatId || sysData.sysSettings?.telegramChatId || '';
            
            if (token && cid) return { token, cid };
            
            if (pluginSupabase) {
                let { data } = await pluginSupabase.from('branch_store').select('data_json').eq('branch_id', currentBranch).maybeSingle();
                if (data && data.data_json) {
                    let s = data.data_json.sysSettings || {};
                    token = s.telegramBotToken || data.data_json.telegramBotToken || '';
                    cid = s.telegramChatId || data.data_json.telegramChatId || '';
                }
            }
        } catch(e) { console.warn("Error fetching Telegram Credentials:", e); }
        return { token, cid };
    }

    /* STREAMING_CHUNK:Rendering VIP Modal... */
    function openVipBirthdayModal() {
        if(document.getElementById('skmVipModal')) {
            document.getElementById('skmVipModal').style.display = 'flex';
            loadVipList();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmVipModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); font-family: 'Battambang', sans-serif;`;
        
        modal.innerHTML = `
            <div style="background: var(--bg-card, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 16px; width: 480px; max-height: 85vh; display:flex; flex-direction:column; border: 1px solid var(--border, #334155); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border, #334155); padding-bottom:10px;">
                    <h3 style="color:#ec4899; margin:0; font-size:18px; font-weight:900;">🎂 អតិថិជន VIP & ថ្ងៃកំណើត</h3>
                    <button onclick="document.getElementById('skmVipModal').style.display='none'" style="background:#ef4444; border:none; color:#fff; width:28px; height:28px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
                </div>
                
                <div style="font-size:13px; color:var(--text-muted, #94a3b8); margin-bottom:15px;">បញ្ជីអតិថិជន VIP ដែលមានការបញ្ចុះតម្លៃ ឬត្រូវផ្តល់ជូនកាដូ៖</div>
                
                <div id="skmVipContent" style="flex:1; overflow-y:auto; max-height:45vh; padding-right:5px; margin-bottom:15px; display:flex; flex-direction:column; gap:10px;">
                    <!-- Injected via JS -->
                </div>

                <div style="display:flex; gap:10px; border-top: 1px solid var(--border, #334155); padding-top: 15px;">
                    <button class="btn btn-outline" style="flex:1; padding:12px; border-radius:12px; background:transparent; color:var(--text-main, #fff); border:1px solid var(--border, #334155); cursor:pointer; font-weight:bold;" onclick="document.getElementById('skmVipModal').style.display='none'">បិទ</button>
                    <button id="skmBtnSendVipSms" class="btn btn-primary" style="flex:2; padding:12px; border-radius:12px; background:linear-gradient(135deg, #ec4899, #be185d); border:none; color:white; cursor:pointer; font-weight:bold; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);" onclick="window.sendVipSmsBroadcast()">💌 ផ្ញើសារជូនពរ (Send SMS & Report)</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        loadVipList();
    }

    let currentVipCount = 0;

    /* STREAMING_CHUNK:Loading VIP data... */
    function loadVipList() {
        const branchId = getCurrentBranchId();
        let customers = window.customers || JSON.parse(localStorage.getItem(`ks2_${branchId}_customers_pro`) || '[]');
        const container = document.getElementById('skmVipContent');
        if(!container) return;

        // ចម្រងយកអតិថិជនណាដែលចំណាយច្រើនជាង ឬស្មើ 100$ ដើម្បចាត់ជា VIP
        let vipCustomers = customers.filter(c => parseFloat(c.totalPaid || c.paid || 0) >= 100);
        
        // រៀបចំអ្នកចំណាយច្រើនជាងគេឱ្យនៅខាងលើ
        vipCustomers.sort((a, b) => parseFloat(b.totalPaid || b.paid || 0) - parseFloat(a.totalPaid || a.paid || 0));
        
        currentVipCount = vipCustomers.length;

        if (vipCustomers.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted, #94a3b8); font-size:14px; background:rgba(0,0,0,0.2); border-radius:12px;">មិនទាន់មានអតិថិជន VIP ទេ 🥲</div>';
            return;
        }

        container.innerHTML = vipCustomers.map(c => {
            let totalSpent = parseFloat(c.totalPaid || c.paid || 0);
            return `
                <div style="background:rgba(236, 72, 153, 0.05); padding:12px 15px; border-radius:12px; border:1px dashed #ec4899; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:900; color:var(--text-main, #fff); font-size:15px; margin-bottom:4px;">👑 ${c.name}</div>
                        <div style="font-size:12px; color:var(--text-muted, #94a3b8);">📞 ${c.phone || 'គ្មានលេខទូរស័ព្ទ'} | VIP Tier: <b style="color:#ec4899;">Gold Member</b></div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:18px; font-weight:900; color:#10b981;">$${totalSpent.toFixed(2)}</div>
                        <div style="font-size:10px; color:var(--text-muted, #94a3b8); text-transform:uppercase;">ចំណាយសរុប</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* STREAMING_CHUNK:Implementing Telegram SMS broadcast reporter... */
    window.sendVipSmsBroadcast = async function() {
        if(currentVipCount === 0) {
            if(typeof window.showToast === 'function') window.showToast("គ្មានអតិថិជន VIP សម្រាប់ផ្ញើសារទេ!", true);
            else alert("គ្មានអតិថិជន VIP សម្រាប់ផ្ញើសារទេ!");
            return;
        }

        const btn = document.getElementById('skmBtnSendVipSms');
        btn.innerText = "⏳ កំពុងដំណើរការ...";
        btn.disabled = true;

        try {
            const { token, cid } = await getTelegramCredentials();
            
            if (token && cid) {
                // ផ្ញើសាររាយការណ៍ចូល Telegram ថៅកែ (អក្សរធំដិត)
                let msg = `📢 <b><BIG>របាយការណ៍ទីផ្សារ (Marketing)</BIG></b>\n\n🎯 <b>សកម្មភាព:</b> បុគ្គលិកបានចុចផ្ញើសារ SMS (ជូនពរ/ប្រូម៉ូសិន)\n👥 <b>ចំនួនអតិថិជន VIP ទទួលបាន:</b> <b>${currentVipCount} នាក់</b>\n🕒 <b>ពេលវេលា:</b> ${new Date().toLocaleString('km-KH')}`;
                
                await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({chat_id: cid, text: msg, parse_mode: 'HTML'})
                });
            } else {
                console.warn("មិនមាន Telegram Token សម្រាប់រាយការណ៍ទេ!");
            }

            // បង្ហាញ UI ថាផ្ញើជោគជ័យ
            if(typeof window.showToast === 'function') window.showToast(`✅ បានផ្ញើសារជូនពរដល់អតិថិជន VIP ទាំង ${currentVipCount} នាក់រួចរាល់!`);
            else alert(`✅ បានផ្ញើសារជូនពរដល់អតិថិជន VIP ទាំង ${currentVipCount} នាក់រួចរាល់!`);
            
            document.getElementById('skmVipModal').style.display = 'none';

        } catch (e) {
            console.error("Error sending VIP Broadcast:", e);
            if(typeof window.showToast === 'function') window.showToast("❌ មានបញ្ហាក្នុងការផ្ញើសារ!", true);
        }

        btn.innerText = "💌 ផ្ញើសារជូនពរ (Send SMS & Report)";
        btn.disabled = false;
    };

    /* STREAMING_CHUNK:Registering plugin... */
    const initInt = setInterval(() => {
        if (typeof window.registerCustomTool === 'function') {
            window.registerCustomTool('🎂', 'អតិថិជន VIP & ថ្ងៃកំណើត', openVipBirthdayModal);
            clearInterval(initInt);
        }
    }, 500);
})();