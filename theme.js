// theme.js
window.darkenHex = function(hex, percent) {
    let r = parseInt(hex.substring(1,3),16); 
    let g = parseInt(hex.substring(3,5),16); 
    let b = parseInt(hex.substring(5,7),16);
    r = parseInt(r * (100 - percent) / 100); 
    g = parseInt(g * (100 - percent) / 100); 
    b = parseInt(b * (100 - percent) / 100);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

window.handleCustomColor = function(hexColor) { 
    let hoverColor = window.darkenHex(hexColor, 20); 
    window.setAccentColor(hexColor, hoverColor); 
};

window.setAccentColor = function(primary, hover) {
    document.documentElement.style.setProperty('--primary', primary); 
    document.documentElement.style.setProperty('--primary-hover', hover);
    let colorData = { primary: primary, hover: hover }; 
    localStorage.setItem(window.getBranchKey('accent_color'), JSON.stringify(colorData));
    document.querySelectorAll('.color-swatch').forEach(el => { 
        if(el.getAttribute('data-color') === primary) el.classList.add('active'); 
        else el.classList.remove('active'); 
    });
    const picker = document.getElementById('customColorPicker'); 
    if(picker) picker.value = primary;
};

window.setThemeMode = function(mode) {
    if(mode === 'light') document.documentElement.classList.add('light-theme'); 
    else document.documentElement.classList.remove('light-theme');
    localStorage.setItem(window.getBranchKey('theme'), mode); 
    window.updateThemeUI(mode);
};

window.updateThemeUI = function(mode) {
    const darkBtn = document.getElementById('themeModeDarkBtn'); 
    const lightBtn = document.getElementById('themeModeLightBtn'); 
    if(!darkBtn || !lightBtn) return;
    if(mode === 'light') { 
        lightBtn.classList.add('active'); 
        darkBtn.classList.remove('active'); 
    } else { 
        darkBtn.classList.add('active'); 
        lightBtn.classList.remove('active'); 
    }
};

window.loadThemeSettings = function() {
    let mode = localStorage.getItem(window.getBranchKey('theme')) || 'dark'; 
    window.setThemeMode(mode);
    let savedAccent = localStorage.getItem(window.getBranchKey('accent_color'));
    if(savedAccent) { 
        try { 
            let color = JSON.parse(savedAccent); 
            window.setAccentColor(color.primary, color.hover); 
        } catch(e){} 
    } else { 
        window.setAccentColor('#10b981', '#059669'); 
    }
};

window.toggleTheme = function() { 
    const isLight = document.documentElement.classList.contains('light-theme'); 
    window.setThemeMode(isLight ? 'dark' : 'light'); 
};