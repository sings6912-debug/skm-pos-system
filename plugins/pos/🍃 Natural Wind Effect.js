(function() {
    // ⚡ ការពារកុំឱ្យកូដនេះរត់ជាន់គ្នាបង្កើតព្រិលទ្វេដង
    if (window.skmSnowEffectLoaded) return;
    window.skmSnowEffectLoaded = true;

    console.log("🌸 POS Ultra-Premium 3D Snow/Petal Effect Initialized!");

    const style = document.createElement('style');
    style.innerHTML = `
        .skm-snowflake {
            position: fixed;
            top: -20px;
            z-index: 99999;
            user-select: none;
            pointer-events: none;
            /* ⚡ ជំនួយ GPU ឱ្យដើររលូន មិនស៊ីថ្ម (Hardware Acceleration) */
            will-change: transform; 
            /* ប្រើចលនា ២ ចូលគ្នា៖ ធ្លាក់ចុះក្រោម + រវិចសងខាង */
            animation: skmFall linear forwards, skmSway ease-in-out infinite alternate;
        }
        
        @keyframes skmFall {
            0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
        
        /* ⚡ បង្កើតចលនារវិចៗសងខាង ឱ្យមើលទៅដូចធ្លាក់តាមខ្យល់ធម្មជាតិ */
        @keyframes skmSway {
            0% { margin-left: 0px; }
            100% { margin-left: 35px; }
        }
    `;
    document.head.appendChild(style);

    // ⚡ កំណត់បរិមាណអតិបរមា កុំឱ្យទូរស័ព្ទភ្ញៀវគាំង ឬឡើងកម្តៅ (Anti-Lag)
    let activeFlakes = 0;
    const MAX_FLAKES = 35; 

    function createSnowflake() {
        if (activeFlakes >= MAX_FLAKES) return;

        const flake = document.createElement('div');
        flake.className = 'skm-snowflake';
        
        // 🌸✨❄️ រូបតំណាងចម្រុះ (អាចថែមរូបស្លឹកឈើ 🍃 បានទៀត)
        const symbols = ['🌸', '✨', '❄️', '🌸', '🤍'];
        flake.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        
        // កំណត់ទីតាំង និងល្បឿនដោយចៃដន្យ
        const startX = Math.random() * window.innerWidth;
        const durationFall = Math.random() * 5 + 4; // ធ្លាក់យឺតៗ ៤ ទៅ ៩ វិនាទី
        const durationSway = Math.random() * 2 + 2; // រវិចៗ ២ ទៅ ៤ វិនាទី
        const size = Math.random() * 12 + 10;
        
        // ⚡ ធ្វើឱ្យផ្កាខ្លះព្រិលៗ (Blur) ដើម្បីមើលទៅមានជម្រៅ 3D ដូចនៅឆ្ងាយ
        const blur = Math.random() > 0.6 ? 'blur(1.5px)' : 'none'; 
        
        flake.style.left = startX + 'px';
        flake.style.fontSize = size + 'px';
        flake.style.animationDuration = durationFall + 's, ' + durationSway + 's';
        flake.style.filter = blur;
        
        document.body.appendChild(flake);
        activeFlakes++;
        
        // លុបចោលវិញពេលធ្លាក់ដល់ដី ដើម្បីសន្សំសំចៃ Memory ទូរស័ព្ទ
        setTimeout(() => {
            if(flake.parentNode) {
                flake.remove();
                activeFlakes--;
            }
        }, durationFall * 1000);
    }

    // បង្កើតធ្លាក់រៀងរាល់ ៤០០ មីលីវិនាទី (ថយល្បឿនបន្តិចកុំឱ្យញឹកពេក)
    setInterval(createSnowflake, 400);
})();