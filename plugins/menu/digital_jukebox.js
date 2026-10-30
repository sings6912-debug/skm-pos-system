(function() {
    console.log("🎵 Menu Digital Jukebox & Song Request Plugin Initialized!");

    function openJukeboxModal() {
        if(document.getElementById('skmJukeboxModal')) {
            document.getElementById('skmJukeboxModal').style.display = 'flex';
            loadPlaylist();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmJukeboxModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg, #1e293b); color: var(--text-main, #fff); padding: 25px; border-radius: 24px; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(236,72,153,0.4); box-shadow: 0 25px 50px rgba(0,0,0,0.6);">
                <div style="font-size: 40px; margin-bottom: 5px;">🎵</div>
                <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px; color: #ec4899;">សំណូមពរបទចម្រៀង (Digital Jukebox)</h3>
                <p style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-bottom: 15px; text-align: left;">ជ្រើសរើស ឬស្នើសុំបទចម្រៀងសម្រាប់ចាក់កំសាន្តក្នុងហាង៖</p>
                
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <input type="text" id="songRequestInput" placeholder="ឈ្មោះបទចម្រៀង ឬតន្ត្រី..." style="flex: 1; background: var(--store-bg, #0f172a); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 12px; color: #fff; font-size: 12px; outline: none; font-family: 'Battambang';">
                    <button onclick="window.requestSong()" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-size: 12px; font-weight: bold; cursor: pointer;">ស្នើសុំ</button>
                </div>

                <div style="font-size: 12px; font-weight: bold; text-align: left; margin-bottom: 6px;">🎶 បទចម្រៀងពេញនិយមក្នុងបញ្ជី៖</div>
                <div id="playlistContainer" style="max-height: 200px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 6px; text-align: left; font-size: 12px;">
                    <!-- Playlist injected via JS -->
                </div>

                <button class="btn-act btn-outline" style="width: 100%; border:none; background:rgba(236,72,153,0.1); color:#ec4899; border-radius: 12px; padding: 12px;" onclick="document.getElementById('skmJukeboxModal').style.display='none'">បិទ</button>
            </div>
        `;
        document.body.appendChild(modal);
        loadPlaylist();
    }

    function loadPlaylist() {
        const container = document.getElementById('playlistContainer');
        if (!container) return;

        let songs = JSON.parse(localStorage.getItem('skm_jukebox_songs') || JSON.stringify([
            { title: 'រាត្រីខែធ្នូ - Original Song', votes: 12 },
            { title: 'ស្រលាញ់ស្រីស្រស់ - Acoustic Cover', votes: 9 },
            { title: 'មនោសញ្ចេតនាថ្ងៃខុស - Slow Live', votes: 7 },
            { title: 'កាហ្វេពេលព្រឹក - Chill Instrumental', votes: 15 }
        ]));

        container.innerHTML = songs.map((s, idx) => `
            <div style="background: rgba(236,72,153,0.06); border: 1px solid var(--border-color); padding: 10px 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <b style="color: #ec4899; display: block; font-size: 12px;">🎵 ${s.title}</b>
                    <span style="font-size: 10px; color: var(--text-muted);">คะแนนโหวต: ${s.votes} votes</span>
                </div>
                <button onclick="window.voteSong(${idx})" style="background: rgba(236,72,153,0.15); color: #ec4899; border: 1px solid #ec4899; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">👍 VOTE</button>
            </div>
        `).join('');
    }

    window.requestSong = function() {
        const inp = document.getElementById('songRequestInput');
        const title = inp.value.trim();
        if (!title) { alert('សូមសរសេរឈ្មោះបទចម្រៀងសិន!'); return; }

        let songs = JSON.parse(localStorage.getItem('skm_jukebox_songs') || '[]');
        songs.unshift({ title: title, votes: 1 });
        localStorage.setItem('skm_jukebox_songs', JSON.stringify(songs));

        inp.value = '';
        loadPlaylist();
        if (typeof showToast === 'function') showToast('បានស្នើសុំបទចម្រៀងជោគជ័យ!');
    };

    window.voteSong = function(idx) {
        let songs = JSON.parse(localStorage.getItem('skm_jukebox_songs') || '[]');
        if (songs[idx]) {
            songs[idx].votes++;
            localStorage.setItem('skm_jukebox_songs', JSON.stringify(songs));
            loadPlaylist();
            if (typeof showToast === 'function') showToast('បាន VOTE បទចម្រៀងជោគជ័យ!');
        }
    };

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🎵', 'សំណូមពរបទចម្រៀង (Jukebox)', openJukeboxModal);
            clearInterval(initInt);
        }
    }, 500);
})();