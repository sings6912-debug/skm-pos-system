(function() {
    console.log("📝 Menu Customer Feedback Plugin Initialized!");

    function openFeedbackModal() {
        if(document.getElementById('skmFeedbackModal')) {
            document.getElementById('skmFeedbackModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmFeedbackModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="font-size: 36px; margin-bottom: 10px;">⭐</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #f59e0b;">ផ្ដល់មតិយោបល់ & វាយតម្លៃ</h3>
                <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-bottom: 15px;">រាល់មតិយោបល់របស់លោកអ្នកគឺមានតម្លៃខ្លាំងណាស់!</p>
                
                <div style="font-size: 24px; margin-bottom: 15px; cursor: pointer;" id="starRatingContainer">
                    <span onclick="window.setMenuRating(1)" style="opacity:0.4;" class="star-s" data-val="1">⭐</span>
                    <span onclick="window.setMenuRating(2)" style="opacity:0.4;" class="star-s" data-val="2">⭐</span>
                    <span onclick="window.setMenuRating(3)" style="opacity:0.4;" class="star-s" data-val="3">⭐</span>
                    <span onclick="window.setMenuRating(4)" style="opacity:0.4;" class="star-s" data-val="4">⭐</span>
                    <span onclick="window.setMenuRating(5)" style="opacity:1;" class="star-s" data-val="5">⭐</span>
                </div>

                <textarea id="menuFeedbackText" placeholder="សរសេរមតិយោបល់ ឬសំណូមពរនៅទីនេះ..." style="width: 100%; height: 80px; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; color: var(--text-dark, #fff); font-family: 'Battambang'; font-size: 12px; resize: none; outline: none; margin-bottom: 15px;"></textarea>

                <button class="btn-act btn-green" style="width: 100%; background: #f59e0b; margin-bottom: 10px;" onclick="window.submitMenuFeedback()">📩 បញ្ជូនមតិយោបល់</button>
                <button class="btn-act btn-outline" style="width: 100%; border:none;" onclick="document.getElementById('skmFeedbackModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        window.selectedMenuStars = 5;
    }

    window.setMenuRating = function(n) {
        window.selectedMenuStars = n;
        document.querySelectorAll('.star-s').forEach((el, idx) => {
            el.style.opacity = idx < n ? '1' : '0.4';
        });
    };

    window.submitMenuFeedback = function() {
        const txt = document.getElementById('menuFeedbackText').value.trim();
        if(!txt) { alert('សូមសរសេរមតិយោបល់សិន!'); return; }
        
        let feedbacks = JSON.parse(localStorage.getItem('skm_menu_feedbacks') || '[]');
        feedbacks.unshift({
            stars: window.selectedMenuStars,
            comment: txt,
            time: new Date().toLocaleString('km-KH')
        });
        localStorage.setItem('skm_menu_feedbacks', JSON.stringify(feedbacks));

        document.getElementById('menuFeedbackText').value = '';
        document.getElementById('skmFeedbackModal').style.display = 'none';
        if (typeof showToast === 'function') showToast('អរគុណសម្រាប់ការវាយតម្លៃ!');
        else alert('អរគុណសម្រាប់ការវាយតម្លៃ!');
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('📝', 'ផ្ដល់មតិយោបល់ / វាយតម្លៃហាង', openFeedbackModal);
            clearInterval(initInt);
        }
    }, 500);
})();