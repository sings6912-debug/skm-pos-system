/**
 * ============================================================================
 * SKM INTEGRATE — ALL-IN-ONE 52 LUXURY THEMES + PRO EXTRAS (ROOT FILE)
 * File: all_luxury_themes.js (Place directly in Root folder — No themes/ subfolder needed)
 * Contains: 52 Industry Luxury Themes, Catalog, Custom Brand-from-Logo Renderer,
 *           Menu Layout Switcher (Grid/List/Magazine), Seasonal Overlays & Live Showroom
 * ============================================================================
 */

/**
 * SKM INTEGRATE — 52 Luxury Business Themes Catalog
 * Loaded by admin_settings.html for instant browsing, live preview, apply & download
 */
window.SKM_LUXURY_CATEGORIES = [{"id": "all", "icon": "👑", "label": "ទាំងអស់ (52)"}, {"id": "cafe", "icon": "☕", "label": "កាហ្វេ & ភេសជ្ជៈ"}, {"id": "restaurant", "icon": "🍽️", "label": "ភោជនីយដ្ឋាន"}, {"id": "bakery", "icon": "🧁", "label": "នំខេក & បង្អែម"}, {"id": "medical", "icon": "💊", "label": "ឱសថស្ថាន & គ្លីនិក"}, {"id": "beauty", "icon": "💄", "label": "សម្រស់ & ម៉ូដ"}, {"id": "jewelry", "icon": "💎", "label": "អលង្ការ & VIP"}, {"id": "tech", "icon": "📱", "label": "បច្ចេកវិទ្យា & Hobby"}, {"id": "mart", "icon": "🛒", "label": "ម៉ាត, ផ្កា & ផ្ទះ"}];
window.SKM_52_LUXURY_THEMES = [{"num": 1, "id": "01_royal_espresso", "file": "01_royal_espresso.js", "cat": "cafe", "nameKm": "កាហ្វេរាជវាំង", "nameEn": "Royal Espresso", "tag": "Specialty Coffee & Roastery", "isDark": true, "accent": "#D69A5A", "accent2": "#F2CBA0", "accentSoft": "rgba(214, 154, 90, 0.14)", "accentGlow": "rgba(214, 154, 90, 0.4)", "grad": "linear-gradient(135deg, #BC884F 0%, #F2CBA0 52%, #D69A5A 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #46321E 0%, #130D09 60%, #0B0805 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #39281A 0%, #1F1610 100%)", "bgMain": "#130D09", "bgCard": "#1F1610", "bgSidebar": "#0F0A07", "bgInput": "#2A221C", "textMain": "#F8F6F0", "textMuted": "#9C9896", "btnText": "#12100C", "border": "rgba(214, 154, 90, 0.24)", "glass": "rgba(31, 22, 16, 0.86)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "20px", "btnRadius": "999px", "pattern": "radial"}, {"num": 2, "id": "02_kyoto_matcha", "file": "02_kyoto_matcha.js", "cat": "cafe", "nameKm": "តែបៃតងក្យូតូ", "nameEn": "Kyoto Matcha Zen", "tag": "Matcha & Japanese Tea House", "isDark": false, "accent": "#4E7A51", "accent2": "#85B187", "accentSoft": "rgba(78, 122, 81, 0.12)", "accentGlow": "rgba(78, 122, 81, 0.32)", "grad": "linear-gradient(135deg, #456B47 0%, #85B187 52%, #4E7A51 100%)", "surfaceGrad": "linear-gradient(155deg, #1E2522 0%, #100E13 58%, #293225 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F1F5EE 100%)", "bgMain": "#F1F5EE", "bgCard": "#FFFFFF", "bgSidebar": "#FAFCF9", "bgInput": "#F7FAF6", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(78, 122, 81, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "18px", "btnRadius": "14px", "pattern": "silk"}, {"num": 3, "id": "03_velvet_milktea", "file": "03_velvet_milktea.js", "cat": "cafe", "nameKm": "តែទឹកដោះគោវល្លិ៍", "nameEn": "Velvet Milk Tea", "tag": "Boba & Bubble Tea Bar", "isDark": false, "accent": "#B87A4B", "accent2": "#DFAC82", "accentSoft": "rgba(184, 122, 75, 0.12)", "accentGlow": "rgba(184, 122, 75, 0.32)", "grad": "linear-gradient(135deg, #A26B42 0%, #DFAC82 52%, #B87A4B 100%)", "surfaceGrad": "linear-gradient(155deg, #322521 0%, #100E13 58%, #463223 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F9F3EB 100%)", "bgMain": "#F9F3EB", "bgCard": "#FFFFFF", "bgSidebar": "#FDFBF8", "bgInput": "#FCF8F4", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#12100C", "border": "rgba(184, 122, 75, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Fraunces', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:wght@600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "24px", "btnRadius": "999px", "pattern": "dot"}, {"num": 4, "id": "04_nordic_latte", "file": "04_nordic_latte.js", "cat": "cafe", "nameKm": "ឡាតេស្កែនឌីណាវី", "nameEn": "Nordic Oat Latte", "tag": "Minimalist Specialty Cafe", "isDark": false, "accent": "#7E6651", "accent2": "#B0967E", "accentSoft": "rgba(126, 102, 81, 0.12)", "accentGlow": "rgba(126, 102, 81, 0.32)", "grad": "linear-gradient(135deg, #6F5A47 0%, #B0967E 52%, #7E6651 100%)", "surfaceGrad": "linear-gradient(155deg, #272122 0%, #100E13 58%, #362C25 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F5F2EC 100%)", "bgMain": "#F5F2EC", "bgCard": "#FFFFFF", "bgSidebar": "#FCFAF8", "bgInput": "#FAF8F5", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(126, 102, 81, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Outfit', 'Kantumruy Pro', sans-serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "16px", "btnRadius": "12px", "pattern": "silk"}, {"num": 5, "id": "05_caramel_atelier", "file": "05_caramel_atelier.js", "cat": "cafe", "nameKm": "ការ៉ាមែលប្រណីត", "nameEn": "Caramel Atelier", "tag": "Artisan Coffee Lounge", "isDark": true, "accent": "#E2A159", "accent2": "#F7CFA0", "accentSoft": "rgba(226, 161, 89, 0.14)", "accentGlow": "rgba(226, 161, 89, 0.4)", "grad": "linear-gradient(135deg, #C78E4E 0%, #F7CFA0 52%, #E2A159 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #4D3620 0%, #18110C 60%, #0E0A07 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #3F2D1D 0%, #241A13 100%)", "bgMain": "#18110C", "bgCard": "#241A13", "bgSidebar": "#130D09", "bgInput": "#2F251F", "textMain": "#F8F6F0", "textMuted": "#9F9A97", "btnText": "#12100C", "border": "rgba(226, 161, 89, 0.24)", "glass": "rgba(36, 26, 19, 0.86)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "22px", "btnRadius": "999px", "pattern": "radial"}, {"num": 6, "id": "06_emerald_roast", "file": "06_emerald_roast.js", "cat": "cafe", "nameKm": "មរកតកាហ្វេ", "nameEn": "Emerald Roastery", "tag": "Heritage Coffee House", "isDark": true, "accent": "#C9A255", "accent2": "#EAD093", "accentSoft": "rgba(201, 162, 85, 0.14)", "accentGlow": "rgba(201, 162, 85, 0.4)", "grad": "linear-gradient(135deg, #B18F4B 0%, #EAD093 52%, #C9A255 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #3A3D25 0%, #081914 60%, #050F0C 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #2A3827 0%, #102720 100%)", "bgMain": "#081914", "bgCard": "#102720", "bgSidebar": "#061410", "bgInput": "#1C322B", "textMain": "#F8F6F0", "textMuted": "#96A09D", "btnText": "#12100C", "border": "rgba(201, 162, 85, 0.24)", "glass": "rgba(16, 39, 32, 0.86)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "18px", "btnRadius": "12px", "pattern": "grid"}, {"num": 7, "id": "07_citrus_coldbrew", "file": "07_citrus_coldbrew.js", "cat": "cafe", "nameKm": "កាហ្វេក្រូចស្រស់", "nameEn": "Citrus Cold Brew", "tag": "Daytime Cafe & Juice Bar", "isDark": false, "accent": "#D97724", "accent2": "#F4AC62", "accentSoft": "rgba(217, 119, 36, 0.12)", "accentGlow": "rgba(217, 119, 36, 0.32)", "grad": "linear-gradient(135deg, #BF6920 0%, #F4AC62 52%, #D97724 100%)", "surfaceGrad": "linear-gradient(155deg, #37241A 0%, #100E13 58%, #4F3118 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #FAF6EE 100%)", "bgMain": "#FAF6EE", "bgCard": "#FFFFFF", "bgSidebar": "#FDFCF9", "bgInput": "#FCFAF6", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#12100C", "border": "rgba(217, 119, 36, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Outfit', 'Kantumruy Pro', sans-serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "22px", "btnRadius": "999px", "pattern": "dot"}, {"num": 8, "id": "08_obsidian_michelin", "file": "08_obsidian_michelin.js", "cat": "restaurant", "nameKm": "ខ្មៅមាសមីស្លាំង", "nameEn": "Obsidian Michelin", "tag": "Fine Dining & Steakhouse", "isDark": true, "accent": "#D9B150", "accent2": "#F3D98B", "accentSoft": "rgba(217, 177, 80, 0.14)", "accentGlow": "rgba(217, 177, 80, 0.4)", "grad": "linear-gradient(135deg, #BF9C46 0%, #F3D98B 52%, #D9B150 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #403620 0%, #0A0B0F 60%, #060709 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #302C24 0%, #14161D 100%)", "bgMain": "#0A0B0F", "bgCard": "#14161D", "bgSidebar": "#08090C", "bgInput": "#202228", "textMain": "#F8F6F0", "textMuted": "#98989C", "btnText": "#12100C", "border": "rgba(217, 177, 80, 0.24)", "glass": "rgba(20, 22, 29, 0.86)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "18px", "btnRadius": "999px", "pattern": "radial"}, {"num": 9, "id": "09_angkor_heritage", "file": "09_angkor_heritage.js", "cat": "restaurant", "nameKm": "មាសអង្គរប្រណីត", "nameEn": "Angkor Royal Gold", "tag": "Khmer Royal Cuisine", "isDark": true, "accent": "#E0B341", "accent2": "#F8DA85", "accentSoft": "rgba(224, 179, 65, 0.14)", "accentGlow": "rgba(224, 179, 65, 0.4)", "grad": "linear-gradient(135deg, #C59E39 0%, #F8DA85 52%, #E0B341 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #4B3A18 0%, #16100A 60%, #0D0A06 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #3D2E16 0%, #22180F 100%)", "bgMain": "#16100A", "bgCard": "#22180F", "bgSidebar": "#110C08", "bgInput": "#2D241B", "textMain": "#F8F6F0", "textMuted": "#9E9995", "btnText": "#12100C", "border": "rgba(224, 179, 65, 0.24)", "glass": "rgba(34, 24, 15, 0.86)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "16px", "btnRadius": "10px", "pattern": "radial"}, {"num": 10, "id": "10_tokyo_izakaya", "file": "10_tokyo_izakaya.js", "cat": "restaurant", "nameKm": "តូក្យូអ៊ីហ្សាកាយ៉ា", "nameEn": "Tokyo Izakaya", "tag": "Japanese Sushi & Ramen", "isDark": true, "accent": "#E05A4F", "accent2": "#F5988E", "accentSoft": "rgba(224, 90, 79, 0.14)", "accentGlow": "rgba(224, 90, 79, 0.4)", "grad": "linear-gradient(135deg, #C54F46 0%, #F5988E 52%, #E05A4F 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #482120 0%, #120D10 60%, #0B080A 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #391F21 0%, #1E151A 100%)", "bgMain": "#120D10", "bgCard": "#1E151A", "bgSidebar": "#0E0A0C", "bgInput": "#292125", "textMain": "#F8F6F0", "textMuted": "#9C989A", "btnText": "#12100C", "border": "rgba(224, 90, 79, 0.24)", "glass": "rgba(30, 21, 26, 0.86)", "fontHeading": "'Outfit', 'Kantumruy Pro', sans-serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "14px", "btnRadius": "10px", "pattern": "grid"}, {"num": 11, "id": "11_tuscan_trattoria", "file": "11_tuscan_trattoria.js", "cat": "restaurant", "nameKm": "អ៊ីតាលីតាស្កានី", "nameEn": "Tuscan Terracotta", "tag": "Italian Pizza & Pasta", "isDark": false, "accent": "#B85337", "accent2": "#DC8267", "accentSoft": "rgba(184, 83, 55, 0.12)", "accentGlow": "rgba(184, 83, 55, 0.32)", "grad": "linear-gradient(135deg, #A24930 0%, #DC8267 52%, #B85337 100%)", "surfaceGrad": "linear-gradient(155deg, #321E1E 0%, #100E13 58%, #46271E 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F8F2EA 100%)", "bgMain": "#F8F2EA", "bgCard": "#FFFFFF", "bgSidebar": "#FDFAF8", "bgInput": "#FBF8F3", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(184, 83, 55, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Fraunces', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:wght@600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "20px", "btnRadius": "999px", "pattern": "silk"}, {"num": 12, "id": "12_aegean_seafood", "file": "12_aegean_seafood.js", "cat": "restaurant", "nameKm": "សមុទ្រអេជៀន", "nameEn": "Aegean Pearl", "tag": "Seafood & Coastal Grill", "isDark": false, "accent": "#1B6B93", "accent2": "#56A3C7", "accentSoft": "rgba(27, 107, 147, 0.12)", "accentGlow": "rgba(27, 107, 147, 0.32)", "grad": "linear-gradient(135deg, #185E81 0%, #56A3C7 52%, #1B6B93 100%)", "surfaceGrad": "linear-gradient(155deg, #15222E 0%, #100E13 58%, #1A2E38 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F1F6FA 100%)", "bgMain": "#F1F6FA", "bgCard": "#FFFFFF", "bgSidebar": "#FAFCFD", "bgInput": "#F7FAFC", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(27, 107, 147, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "20px", "btnRadius": "999px", "pattern": "silk"}, {"num": 13, "id": "13_parisian_bistro", "file": "13_parisian_bistro.js", "cat": "restaurant", "nameKm": "ប៊ីស្ត្រូប៉ារីស", "nameEn": "Parisian Emerald", "tag": "French & European Bistro", "isDark": true, "accent": "#D4B062", "accent2": "#EFE0B0", "accentSoft": "rgba(212, 176, 98, 0.14)", "accentGlow": "rgba(212, 176, 98, 0.4)", "grad": "linear-gradient(135deg, #BB9B56 0%, #EFE0B0 52%, #D4B062 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #3C4029 0%, #071915 60%, #040F0D 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #2B3C2B 0%, #0F2922 100%)", "bgMain": "#071915", "bgCard": "#0F2922", "bgSidebar": "#051410", "bgInput": "#1B342D", "textMain": "#F8F6F0", "textMuted": "#95A19E", "btnText": "#12100C", "border": "rgba(212, 176, 98, 0.24)", "glass": "rgba(15, 41, 34, 0.86)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "18px", "btnRadius": "12px", "pattern": "radial"}, {"num": 14, "id": "14_charcoal_ember", "file": "14_charcoal_ember.js", "cat": "restaurant", "nameKm": "ភ្លើងធ្យូងរាជ", "nameEn": "Charcoal Ember", "tag": "BBQ, Hotpot & Smokehouse", "isDark": true, "accent": "#E86A33", "accent2": "#F7A072", "accentSoft": "rgba(232, 106, 51, 0.14)", "accentGlow": "rgba(232, 106, 51, 0.4)", "grad": "linear-gradient(135deg, #CC5D2D 0%, #F7A072 52%, #E86A33 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #4B2617 0%, #140E0D 60%, #0C0808 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #3D2319 0%, #211715 100%)", "bgMain": "#140E0D", "bgCard": "#211715", "bgSidebar": "#100B0A", "bgInput": "#2C2321", "textMain": "#F8F6F0", "textMuted": "#9D9998", "btnText": "#12100C", "border": "rgba(232, 106, 51, 0.24)", "glass": "rgba(33, 23, 21, 0.86)", "fontHeading": "'Outfit', 'Kantumruy Pro', sans-serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "16px", "btnRadius": "12px", "pattern": "diagonal"}, {"num": 15, "id": "15_pearl_patisserie", "file": "15_pearl_patisserie.js", "cat": "bakery", "nameKm": "សគុជខ្យងប៉ាទីសឺរី", "nameEn": "Pearl Patisserie", "tag": "French Bakery & Cake", "isDark": false, "accent": "#C59B38", "accent2": "#E6C775", "accentSoft": "rgba(197, 155, 56, 0.12)", "accentGlow": "rgba(197, 155, 56, 0.32)", "grad": "linear-gradient(135deg, #AD8831 0%, #E6C775 52%, #C59B38 100%)", "surfaceGrad": "linear-gradient(155deg, #342B1E 0%, #100E13 58%, #4A3B1E 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F6F3EC 100%)", "bgMain": "#F6F3EC", "bgCard": "#FFFFFF", "bgSidebar": "#FCFBF8", "bgInput": "#FAF8F5", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#12100C", "border": "rgba(197, 155, 56, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "22px", "btnRadius": "999px", "pattern": "silk"}, {"num": 16, "id": "16_rose_macaron", "file": "16_rose_macaron.js", "cat": "bakery", "nameKm": "ផ្កាឈូកម៉ាការ៉ុង", "nameEn": "Rose Champagne", "tag": "Macaron & Dessert Salon", "isDark": true, "accent": "#E8A298", "accent2": "#F8D7D0", "accentSoft": "rgba(232, 162, 152, 0.14)", "accentGlow": "rgba(232, 162, 152, 0.4)", "grad": "linear-gradient(135deg, #CC8F86 0%, #F8D7D0 52%, #E8A298 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #4B3234 0%, #140B11 60%, #0C070A 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #3C272D 0%, #20131C 100%)", "bgMain": "#140B11", "bgCard": "#20131C", "bgSidebar": "#10090D", "bgInput": "#2B1F27", "textMain": "#F8F6F0", "textMuted": "#9D979B", "btnText": "#12100C", "border": "rgba(232, 162, 152, 0.24)", "glass": "rgba(32, 19, 28, 0.86)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "24px", "btnRadius": "999px", "pattern": "radial"}, {"num": 17, "id": "17_sicilian_pistachio", "file": "17_sicilian_pistachio.js", "cat": "bakery", "nameKm": "ភីស្តាស៊ីអូស៊ីស៊ីលី", "nameEn": "Sicilian Pistachio", "tag": "Gelato & Ice Cream Bar", "isDark": false, "accent": "#6A9955", "accent2": "#A2C98D", "accentSoft": "rgba(106, 153, 85, 0.12)", "accentGlow": "rgba(106, 153, 85, 0.32)", "grad": "linear-gradient(135deg, #5D874B 0%, #A2C98D 52%, #6A9955 100%)", "surfaceGrad": "linear-gradient(155deg, #232A23 0%, #100E13 58%, #303B26 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F4F7F0 100%)", "bgMain": "#F4F7F0", "bgCard": "#FFFFFF", "bgSidebar": "#FBFCFA", "bgInput": "#F9FBF7", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#12100C", "border": "rgba(106, 153, 85, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Fraunces', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:wght@600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "24px", "btnRadius": "999px", "pattern": "dot"}, {"num": 18, "id": "18_belgian_truffle", "file": "18_belgian_truffle.js", "cat": "bakery", "nameKm": "សូកូឡាបែលហ្សិក", "nameEn": "Belgian Truffle", "tag": "Artisan Chocolate House", "isDark": true, "accent": "#D49B6A", "accent2": "#F0C8A2", "accentSoft": "rgba(212, 155, 106, 0.14)", "accentGlow": "rgba(212, 155, 106, 0.4)", "grad": "linear-gradient(135deg, #BB885D 0%, #F0C8A2 52%, #D49B6A 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #473224 0%, #150D0B 60%, #0D0807 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #3C291F 0%, #231613 100%)", "bgMain": "#150D0B", "bgCard": "#231613", "bgSidebar": "#100A09", "bgInput": "#2E221F", "textMain": "#F8F6F0", "textMuted": "#9E9897", "btnText": "#12100C", "border": "rgba(212, 155, 106, 0.24)", "glass": "rgba(35, 22, 19, 0.86)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "20px", "btnRadius": "14px", "pattern": "radial"}, {"num": 19, "id": "19_honey_brioche", "file": "19_honey_brioche.js", "cat": "bakery", "nameKm": "ទឹកឃ្មុំនំប៉័ងមាស", "nameEn": "Honey Brioche", "tag": "Artisan Bread & Brunch", "isDark": false, "accent": "#C98A2B", "accent2": "#EAB96B", "accentSoft": "rgba(201, 138, 43, 0.12)", "accentGlow": "rgba(201, 138, 43, 0.32)", "grad": "linear-gradient(135deg, #B17926 0%, #EAB96B 52%, #C98A2B 100%)", "surfaceGrad": "linear-gradient(155deg, #35281B 0%, #100E13 58%, #4B361A 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #FBF6EC 100%)", "bgMain": "#FBF6EC", "bgCard": "#FFFFFF", "bgSidebar": "#FEFCF8", "bgInput": "#FDFAF5", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#12100C", "border": "rgba(201, 138, 43, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Fraunces', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:wght@600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "22px", "btnRadius": "999px", "pattern": "silk"}, {"num": 20, "id": "20_berry_velvet", "file": "20_berry_velvet.js", "cat": "bakery", "nameKm": "ប៊ឺរីវល្លិ៍ក្រែម", "nameEn": "Berry Velvet", "tag": "Custom Cake & Pastry Studio", "isDark": false, "accent": "#B5486F", "accent2": "#DF83A3", "accentSoft": "rgba(181, 72, 111, 0.12)", "accentGlow": "rgba(181, 72, 111, 0.32)", "grad": "linear-gradient(135deg, #9F3F62 0%, #DF83A3 52%, #B5486F 100%)", "surfaceGrad": "linear-gradient(155deg, #311C28 0%, #100E13 58%, #45242D 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #FAF2F5 100%)", "bgMain": "#FAF2F5", "bgCard": "#FFFFFF", "bgSidebar": "#FDFAFC", "bgInput": "#FCF8FA", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(181, 72, 111, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "24px", "btnRadius": "999px", "pattern": "dot"}, {"num": 21, "id": "21_swiss_clinical", "file": "21_swiss_clinical.js", "cat": "medical", "nameKm": "ស្វីសមរកតគ្លីនិក", "nameEn": "Swiss Clinical", "tag": "Modern Pharmacy & Apothecary", "isDark": false, "accent": "#0F766E", "accent2": "#2DD4BF", "accentSoft": "rgba(15, 118, 110, 0.12)", "accentGlow": "rgba(15, 118, 110, 0.32)", "grad": "linear-gradient(135deg, #0D6861 0%, #2DD4BF 52%, #0F766E 100%)", "surfaceGrad": "linear-gradient(155deg, #132427 0%, #100E13 58%, #17312D 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #EFF7F4 100%)", "bgMain": "#EFF7F4", "bgCard": "#FFFFFF", "bgSidebar": "#F9FCFB", "bgInput": "#F6FBF9", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(15, 118, 110, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Outfit', 'Kantumruy Pro', sans-serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "16px", "btnRadius": "12px", "pattern": "silk"}, {"num": 22, "id": "22_alabaster_clinic", "file": "22_alabaster_clinic.js", "cat": "medical", "nameKm": "គ្លីនិកសុទ្ធស្អាត", "nameEn": "Alabaster Clinic", "tag": "Dental & Aesthetic Clinic", "isDark": false, "accent": "#2563EB", "accent2": "#60A5FA", "accentSoft": "rgba(37, 99, 235, 0.12)", "accentGlow": "rgba(37, 99, 235, 0.32)", "grad": "linear-gradient(135deg, #2157CF 0%, #60A5FA 52%, #2563EB 100%)", "surfaceGrad": "linear-gradient(155deg, #17213E 0%, #100E13 58%, #1D2C50 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F5F7FA 100%)", "bgMain": "#F5F7FA", "bgCard": "#FFFFFF", "bgSidebar": "#FCFCFD", "bgInput": "#FAFBFC", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(37, 99, 235, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Outfit', 'Kantumruy Pro', sans-serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "18px", "btnRadius": "12px", "pattern": "silk"}, {"num": 23, "id": "23_botanical_herb", "file": "23_botanical_herb.js", "cat": "medical", "nameKm": "ឱសថធម្មជាតិ", "nameEn": "Botanical Herb", "tag": "Herbal & Organic Pharmacy", "isDark": true, "accent": "#5CC595", "accent2": "#9EE6C3", "accentSoft": "rgba(92, 197, 149, 0.14)", "accentGlow": "rgba(92, 197, 149, 0.4)", "grad": "linear-gradient(135deg, #51AD83 0%, #9EE6C3 52%, #5CC595 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #204636 0%, #0B1914 60%, #070F0C 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #1D3E30 0%, #132820 100%)", "bgMain": "#0B1914", "bgCard": "#132820", "bgSidebar": "#091410", "bgInput": "#1F332B", "textMain": "#F8F6F0", "textMuted": "#97A09D", "btnText": "#12100C", "border": "rgba(92, 197, 149, 0.24)", "glass": "rgba(19, 40, 32, 0.86)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "18px", "btnRadius": "14px", "pattern": "radial"}, {"num": 24, "id": "24_glacier_care", "file": "24_glacier_care.js", "cat": "medical", "nameKm": "ទឹកកកបរិសុទ្ធ", "nameEn": "Glacier Care", "tag": "Medical & Wellness Center", "isDark": false, "accent": "#0284C7", "accent2": "#38BDF8", "accentSoft": "rgba(2, 132, 199, 0.12)", "accentGlow": "rgba(2, 132, 199, 0.32)", "grad": "linear-gradient(135deg, #0274AF 0%, #38BDF8 52%, #0284C7 100%)", "surfaceGrad": "linear-gradient(155deg, #112738 0%, #100E13 58%, #133546 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F0F8FC 100%)", "bgMain": "#F0F8FC", "bgCard": "#FFFFFF", "bgSidebar": "#FAFDFE", "bgInput": "#F7FBFD", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#12100C", "border": "rgba(2, 132, 199, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Outfit', 'Kantumruy Pro', sans-serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "16px", "btnRadius": "12px", "pattern": "dot"}, {"num": 25, "id": "25_serenity_spa", "file": "25_serenity_spa.js", "cat": "medical", "nameKm": "ស្ប៉ាខ្សាច់សុខសាន្ត", "nameEn": "Serenity Spa Sand", "tag": "Spa, Massage & Retreat", "isDark": false, "accent": "#9C7B56", "accent2": "#C8AB87", "accentSoft": "rgba(156, 123, 86, 0.12)", "accentGlow": "rgba(156, 123, 86, 0.32)", "grad": "linear-gradient(135deg, #896C4C 0%, #C8AB87 52%, #9C7B56 100%)", "surfaceGrad": "linear-gradient(155deg, #2C2523 0%, #100E13 58%, #3E3226 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F5F0E8 100%)", "bgMain": "#F5F0E8", "bgCard": "#FFFFFF", "bgSidebar": "#FCFAF7", "bgInput": "#FAF7F2", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#12100C", "border": "rgba(156, 123, 86, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "24px", "btnRadius": "999px", "pattern": "silk"}, {"num": 26, "id": "26_vital_mint", "file": "26_vital_mint.js", "cat": "medical", "nameKm": "វីតាមីនមីនស្រស់", "nameEn": "Vital Mint Pro", "tag": "Vitamins & Supplements", "isDark": false, "accent": "#059669", "accent2": "#34D399", "accentSoft": "rgba(5, 150, 105, 0.12)", "accentGlow": "rgba(5, 150, 105, 0.32)", "grad": "linear-gradient(135deg, #04845C 0%, #34D399 52%, #059669 100%)", "surfaceGrad": "linear-gradient(155deg, #112A27 0%, #100E13 58%, #143A2C 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F0FBF7 100%)", "bgMain": "#F0FBF7", "bgCard": "#FFFFFF", "bgSidebar": "#FAFEFC", "bgInput": "#F7FDFB", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#12100C", "border": "rgba(5, 150, 105, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Outfit', 'Kantumruy Pro', sans-serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "20px", "btnRadius": "999px", "pattern": "dot"}, {"num": 27, "id": "27_champagne_couture", "file": "27_champagne_couture.js", "cat": "beauty", "nameKm": "សាំប៉ាញកូធួរ", "nameEn": "Champagne Couture", "tag": "Luxury Fashion Boutique", "isDark": false, "accent": "#B08952", "accent2": "#D9BA89", "accentSoft": "rgba(176, 137, 82, 0.12)", "accentGlow": "rgba(176, 137, 82, 0.32)", "grad": "linear-gradient(135deg, #9B7948 0%, #D9BA89 52%, #B08952 100%)", "surfaceGrad": "linear-gradient(155deg, #302722 0%, #100E13 58%, #443625 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F7F3EE 100%)", "bgMain": "#F7F3EE", "bgCard": "#FFFFFF", "bgSidebar": "#FCFBF9", "bgInput": "#FBF8F6", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#12100C", "border": "rgba(176, 137, 82, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "12px", "btnRadius": "8px", "pattern": "silk"}, {"num": 28, "id": "28_blush_silk", "file": "28_blush_silk.js", "cat": "beauty", "nameKm": "សូត្រផ្កាឈូក", "nameEn": "Blush Silk Salon", "tag": "Beauty Salon & Nail Bar", "isDark": false, "accent": "#C96A7D", "accent2": "#EB9FAD", "accentSoft": "rgba(201, 106, 125, 0.12)", "accentGlow": "rgba(201, 106, 125, 0.32)", "grad": "linear-gradient(135deg, #B15D6E 0%, #EB9FAD 52%, #C96A7D 100%)", "surfaceGrad": "linear-gradient(155deg, #35222A 0%, #100E13 58%, #4B2E31 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #FCF4F6 100%)", "bgMain": "#FCF4F6", "bgCard": "#FFFFFF", "bgSidebar": "#FEFBFC", "bgInput": "#FDF9FA", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#12100C", "border": "rgba(201, 106, 125, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Fraunces', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:wght@600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "24px", "btnRadius": "999px", "pattern": "dot"}, {"num": 29, "id": "29_noir_barber", "file": "29_noir_barber.js", "cat": "beauty", "nameKm": "បាប៊ើរមាសខ្មៅ", "nameEn": "Noir Barber Brass", "tag": "Gentlemen's Barbershop", "isDark": true, "accent": "#C89B54", "accent2": "#E9C589", "accentSoft": "rgba(200, 155, 84, 0.14)", "accentGlow": "rgba(200, 155, 84, 0.4)", "grad": "linear-gradient(135deg, #B0884A 0%, #E9C589 52%, #C89B54 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #3E321F 0%, #0E0D0C 60%, #080807 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #322A1F 0%, #1A1816 100%)", "bgMain": "#0E0D0C", "bgCard": "#1A1816", "bgSidebar": "#0B0A09", "bgInput": "#252422", "textMain": "#F8F6F0", "textMuted": "#9A9998", "btnText": "#12100C", "border": "rgba(200, 155, 84, 0.24)", "glass": "rgba(26, 24, 22, 0.86)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "12px", "btnRadius": "8px", "pattern": "diagonal"}, {"num": 30, "id": "30_velvet_cosmetics", "file": "30_velvet_cosmetics.js", "cat": "beauty", "nameKm": "គ្រឿងសម្អាងវល្លិ៍", "nameEn": "Velvet Cosmetics", "tag": "Makeup & Skincare Store", "isDark": true, "accent": "#D882B8", "accent2": "#F2B8DC", "accentSoft": "rgba(216, 130, 184, 0.14)", "accentGlow": "rgba(216, 130, 184, 0.4)", "grad": "linear-gradient(135deg, #BE72A2 0%, #F2B8DC 52%, #D882B8 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #492D44 0%, #170F1B 60%, #0E0910 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #3D273E 0%, #24182A 100%)", "bgMain": "#170F1B", "bgCard": "#24182A", "bgSidebar": "#120C15", "bgInput": "#2F2435", "textMain": "#F8F6F0", "textMuted": "#9F99A1", "btnText": "#12100C", "border": "rgba(216, 130, 184, 0.24)", "glass": "rgba(36, 24, 42, 0.86)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "20px", "btnRadius": "999px", "pattern": "radial"}, {"num": 31, "id": "31_ivory_bridal", "file": "31_ivory_bridal.js", "cat": "beauty", "nameKm": "គុជខ្យងកូនក្រមុំ", "nameEn": "Ivory Bridal", "tag": "Bridal & Evening Gown", "isDark": false, "accent": "#A68A64", "accent2": "#D2BC9D", "accentSoft": "rgba(166, 138, 100, 0.12)", "accentGlow": "rgba(166, 138, 100, 0.32)", "grad": "linear-gradient(135deg, #927958 0%, #D2BC9D 52%, #A68A64 100%)", "surfaceGrad": "linear-gradient(155deg, #2E2826 0%, #100E13 58%, #41362A 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #FAF7F2 100%)", "bgMain": "#FAF7F2", "bgCard": "#FFFFFF", "bgSidebar": "#FDFCFA", "bgInput": "#FCFBF8", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#12100C", "border": "rgba(166, 138, 100, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "22px", "btnRadius": "999px", "pattern": "silk"}, {"num": 32, "id": "32_amber_parfums", "file": "32_amber_parfums.js", "cat": "beauty", "nameKm": "ទឹកអប់អាំប៊ើរ", "nameEn": "Oud & Amber Parfums", "tag": "Luxury Perfume House", "isDark": true, "accent": "#D99B43", "accent2": "#F4C97E", "accentSoft": "rgba(217, 155, 67, 0.14)", "accentGlow": "rgba(217, 155, 67, 0.4)", "grad": "linear-gradient(135deg, #BF883B 0%, #F4C97E 52%, #D99B43 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #473319 0%, #140E0A 60%, #0C0806 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #3B2917 0%, #211710 100%)", "bgMain": "#140E0A", "bgCard": "#211710", "bgSidebar": "#100B08", "bgInput": "#2C231C", "textMain": "#F8F6F0", "textMuted": "#9D9996", "btnText": "#12100C", "border": "rgba(217, 155, 67, 0.24)", "glass": "rgba(33, 23, 16, 0.86)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "14px", "btnRadius": "8px", "pattern": "radial"}, {"num": 33, "id": "33_monochrome_street", "file": "33_monochrome_street.js", "cat": "beauty", "nameKm": "ម៉ូដស្ទ្រីតសខ្មៅ", "nameEn": "Monochrome Studio", "tag": "Streetwear & Sneakers", "isDark": false, "accent": "#18181B", "accent2": "#52525B", "accentSoft": "rgba(24, 24, 27, 0.12)", "accentGlow": "rgba(24, 24, 27, 0.32)", "grad": "linear-gradient(135deg, #151518 0%, #52525B 52%, #18181B 100%)", "surfaceGrad": "linear-gradient(155deg, #151319 0%, #100E13 58%, #191716 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F4F4F5 100%)", "bgMain": "#F4F4F5", "bgCard": "#FFFFFF", "bgSidebar": "#FBFBFC", "bgInput": "#F9F9FA", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(24, 24, 27, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Space Grotesk', 'Kantumruy Pro', sans-serif", "fontBody": "'Inter', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap", "cardRadius": "10px", "btnRadius": "8px", "pattern": "grid"}, {"num": 34, "id": "34_black_diamond", "file": "34_black_diamond.js", "cat": "jewelry", "nameKm": "ពេជ្រខ្មៅអមតៈ", "nameEn": "Black Diamond Vault", "tag": "Diamond & Fine Jewelry", "isDark": true, "accent": "#E5C158", "accent2": "#F9E29C", "accentSoft": "rgba(229, 193, 88, 0.14)", "accentGlow": "rgba(229, 193, 88, 0.4)", "grad": "linear-gradient(135deg, #CAAA4D 0%, #F9E29C 52%, #E5C158 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #41381F 0%, #07080B 60%, #040507 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #2F2B23 0%, #11131A 100%)", "bgMain": "#07080B", "bgCard": "#11131A", "bgSidebar": "#050609", "bgInput": "#1D1F25", "textMain": "#F8F6F0", "textMuted": "#96979A", "btnText": "#12100C", "border": "rgba(229, 193, 88, 0.24)", "glass": "rgba(17, 19, 26, 0.86)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "12px", "btnRadius": "8px", "pattern": "radial"}, {"num": 35, "id": "35_geneva_horology", "file": "35_geneva_horology.js", "cat": "jewelry", "nameKm": "នាឡិកាហ្សឺណែវ", "nameEn": "Geneva Horology", "tag": "Luxury Watch Gallery", "isDark": true, "accent": "#D1A954", "accent2": "#EED394", "accentSoft": "rgba(209, 169, 84, 0.14)", "accentGlow": "rgba(209, 169, 84, 0.4)", "grad": "linear-gradient(135deg, #B8954A 0%, #EED394 52%, #D1A954 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #3D382B 0%, #09101D 60%, #050A11 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #2D3035 0%, #121C30 100%)", "bgMain": "#09101D", "bgCard": "#121C30", "bgSidebar": "#070C17", "bgInput": "#1E273A", "textMain": "#F8F6F0", "textMuted": "#979BA4", "btnText": "#12100C", "border": "rgba(209, 169, 84, 0.24)", "glass": "rgba(18, 28, 48, 0.86)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "12px", "btnRadius": "8px", "pattern": "grid"}, {"num": 36, "id": "36_imperial_jade", "file": "36_imperial_jade.js", "cat": "jewelry", "nameKm": "ថ្មគុជមរកតរាជ", "nameEn": "Imperial Jade Gold", "tag": "Gold & Gemstone Boutique", "isDark": true, "accent": "#E2B94F", "accent2": "#F7DE93", "accentSoft": "rgba(226, 185, 79, 0.14)", "accentGlow": "rgba(226, 185, 79, 0.4)", "grad": "linear-gradient(135deg, #C7A346 0%, #F7DE93 52%, #E2B94F 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #3F4122 0%, #061712 60%, #040E0B 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #2B3B26 0%, #0D261F 100%)", "bgMain": "#061712", "bgCard": "#0D261F", "bgSidebar": "#05120E", "bgInput": "#19312A", "textMain": "#F8F6F0", "textMuted": "#95A09C", "btnText": "#12100C", "border": "rgba(226, 185, 79, 0.24)", "glass": "rgba(13, 38, 31, 0.86)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "14px", "btnRadius": "10px", "pattern": "radial"}, {"num": 37, "id": "37_platinum_gallery", "file": "37_platinum_gallery.js", "cat": "jewelry", "nameKm": "ប្លាទីនប្រណីត", "nameEn": "Platinum Gallery", "tag": "Designer Bags & Luxury", "isDark": false, "accent": "#334155", "accent2": "#64748B", "accentSoft": "rgba(51, 65, 85, 0.12)", "accentGlow": "rgba(51, 65, 85, 0.32)", "grad": "linear-gradient(135deg, #2D394B 0%, #64748B 52%, #334155 100%)", "surfaceGrad": "linear-gradient(155deg, #1A1A23 0%, #100E13 58%, #212226 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F3F4F6 100%)", "bgMain": "#F3F4F6", "bgCard": "#FFFFFF", "bgSidebar": "#FBFBFC", "bgInput": "#F8F9FA", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(51, 65, 85, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "10px", "btnRadius": "6px", "pattern": "silk"}, {"num": 38, "id": "38_satin_sovereign", "file": "38_satin_sovereign.js", "cat": "jewelry", "nameKm": "សាតាំងមាសរាជ", "nameEn": "Champagne Satin VIP", "tag": "VIP Showroom & Private Club", "isDark": true, "accent": "#E0BC75", "accent2": "#F6DFB0", "accentSoft": "rgba(224, 188, 117, 0.14)", "accentGlow": "rgba(224, 188, 117, 0.4)", "grad": "linear-gradient(135deg, #C5A567 0%, #F6DFB0 52%, #E0BC75 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #483D29 0%, #12100E 60%, #0B0A08 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #393224 0%, #1E1B17 100%)", "bgMain": "#12100E", "bgCard": "#1E1B17", "bgSidebar": "#0E0C0B", "bgInput": "#292623", "textMain": "#F8F6F0", "textMuted": "#9C9B99", "btnText": "#12100C", "border": "rgba(224, 188, 117, 0.24)", "glass": "rgba(30, 27, 23, 0.86)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "18px", "btnRadius": "999px", "pattern": "radial"}, {"num": 39, "id": "39_titanium_pro", "file": "39_titanium_pro.js", "cat": "tech", "nameKm": "ទីតាញ៉ូមប្រូ", "nameEn": "Titanium Studio Pro", "tag": "Mobile & Apple-Style Store", "isDark": false, "accent": "#1D1D1F", "accent2": "#4B5563", "accentSoft": "rgba(29, 29, 31, 0.12)", "accentGlow": "rgba(29, 29, 31, 0.32)", "grad": "linear-gradient(135deg, #1A1A1B 0%, #4B5563 52%, #1D1D1F 100%)", "surfaceGrad": "linear-gradient(155deg, #161419 0%, #100E13 58%, #1B1817 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F5F5F7 100%)", "bgMain": "#F5F5F7", "bgCard": "#FFFFFF", "bgSidebar": "#FCFCFC", "bgInput": "#FAFAFB", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(29, 29, 31, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Outfit', 'Kantumruy Pro', sans-serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "18px", "btnRadius": "12px", "pattern": "silk"}, {"num": 40, "id": "40_sapphire_cyber", "file": "40_sapphire_cyber.js", "cat": "tech", "nameKm": "ខៀវរាត្រីប្លាទីន", "nameEn": "Sapphire Platinum", "tag": "Computer & Gaming Gear", "isDark": true, "accent": "#60A5FA", "accent2": "#A78BFA", "accentSoft": "rgba(96, 165, 250, 0.14)", "accentGlow": "rgba(96, 165, 250, 0.4)", "grad": "linear-gradient(135deg, #5491DC 0%, #A78BFA 52%, #60A5FA 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #1E3454 0%, #070C1A 60%, #040710 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #1C2D4C 0%, #111A30 100%)", "bgMain": "#070C1A", "bgCard": "#111A30", "bgSidebar": "#050914", "bgInput": "#1D253A", "textMain": "#F8F6F0", "textMuted": "#969AA4", "btnText": "#12100C", "border": "rgba(96, 165, 250, 0.24)", "glass": "rgba(17, 26, 48, 0.86)", "fontHeading": "'Space Grotesk', 'Kantumruy Pro', sans-serif", "fontBody": "'Inter', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap", "cardRadius": "16px", "btnRadius": "12px", "pattern": "grid"}, {"num": 41, "id": "41_akihabara_collector", "file": "41_akihabara_collector.js", "cat": "tech", "nameKm": "អាគីហាបារ៉ា Figure", "nameEn": "Akihabara Collector", "tag": "Anime, Figure & Toy Shop", "isDark": true, "accent": "#A855F7", "accent2": "#38BDF8", "accentSoft": "rgba(168, 85, 247, 0.14)", "accentGlow": "rgba(168, 85, 247, 0.4)", "grad": "linear-gradient(135deg, #944BD9 0%, #38BDF8 52%, #A855F7 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #361E53 0%, #0E0B1A 60%, #080710 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #2D1C4A 0%, #19132E 100%)", "bgMain": "#0E0B1A", "bgCard": "#19132E", "bgSidebar": "#0B0914", "bgInput": "#241F38", "textMain": "#F8F6F0", "textMuted": "#9A97A3", "btnText": "#12100C", "border": "rgba(168, 85, 247, 0.24)", "glass": "rgba(25, 19, 46, 0.86)", "fontHeading": "'Space Grotesk', 'Kantumruy Pro', sans-serif", "fontBody": "'Inter', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap", "cardRadius": "18px", "btnRadius": "14px", "pattern": "grid"}, {"num": 42, "id": "42_carbon_apex", "file": "42_carbon_apex.js", "cat": "tech", "nameKm": "កាបូនស្ព័រ", "nameEn": "Carbon Apex Sport", "tag": "Auto, Moto & Detailing", "isDark": true, "accent": "#EF4444", "accent2": "#F97316", "accentSoft": "rgba(239, 68, 68, 0.14)", "accentGlow": "rgba(239, 68, 68, 0.4)", "grad": "linear-gradient(135deg, #D23C3C 0%, #F97316 52%, #EF4444 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #471B1E 0%, #0C0D10 60%, #07080A 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #351F24 0%, #17191F 100%)", "bgMain": "#0C0D10", "bgCard": "#17191F", "bgSidebar": "#090A0C", "bgInput": "#23242A", "textMain": "#F8F6F0", "textMuted": "#999A9C", "btnText": "#12100C", "border": "rgba(239, 68, 68, 0.24)", "glass": "rgba(23, 25, 31, 0.86)", "fontHeading": "'Space Grotesk', 'Kantumruy Pro', sans-serif", "fontBody": "'Inter', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap", "cardRadius": "12px", "btnRadius": "8px", "pattern": "diagonal"}, {"num": 43, "id": "43_leica_mono", "file": "43_leica_mono.js", "cat": "tech", "nameKm": "កាមេរ៉ាឡៃកា", "nameEn": "Leica Monochrome", "tag": "Camera & Audio Studio", "isDark": true, "accent": "#E5E7EB", "accent2": "#9CA3AF", "accentSoft": "rgba(229, 231, 235, 0.14)", "accentGlow": "rgba(229, 231, 235, 0.4)", "grad": "linear-gradient(135deg, #CACBCF 0%, #9CA3AF 52%, #E5E7EB 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #444446 0%, #0B0B0C 60%, #070707 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #333336 0%, #161618 100%)", "bgMain": "#0B0B0C", "bgCard": "#161618", "bgSidebar": "#090909", "bgInput": "#222224", "textMain": "#F8F6F0", "textMuted": "#989899", "btnText": "#12100C", "border": "rgba(229, 231, 235, 0.24)", "glass": "rgba(22, 22, 24, 0.86)", "fontHeading": "'Space Grotesk', 'Kantumruy Pro', sans-serif", "fontBody": "'Inter', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap", "cardRadius": "10px", "btnRadius": "6px", "pattern": "grid"}, {"num": 44, "id": "44_aurora_prism", "file": "44_aurora_prism.js", "cat": "tech", "nameKm": "អូរ៉ូរ៉ាព្រីស", "nameEn": "Aurora Prism Glass", "tag": "Smart Gadget & Lifestyle", "isDark": true, "accent": "#2DD4BF", "accent2": "#818CF8", "accentSoft": "rgba(45, 212, 191, 0.14)", "accentGlow": "rgba(45, 212, 191, 0.4)", "grad": "linear-gradient(135deg, #28BBA8 0%, #818CF8 52%, #2DD4BF 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #124145 0%, #090E1A 60%, #050810 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #163542 0%, #121B2E 100%)", "bgMain": "#090E1A", "bgCard": "#121B2E", "bgSidebar": "#070B14", "bgInput": "#1E2638", "textMain": "#F8F6F0", "textMuted": "#979BA3", "btnText": "#12100C", "border": "rgba(45, 212, 191, 0.24)", "glass": "rgba(18, 27, 46, 0.86)", "fontHeading": "'Outfit', 'Kantumruy Pro', sans-serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "22px", "btnRadius": "999px", "pattern": "radial"}, {"num": 45, "id": "45_cobalt_precision", "file": "45_cobalt_precision.js", "cat": "tech", "nameKm": "ខូបាល់ប្រូ", "nameEn": "Cobalt Precision", "tag": "Electronics & Smart Home", "isDark": false, "accent": "#1E40AF", "accent2": "#3B82F6", "accentSoft": "rgba(30, 64, 175, 0.12)", "accentGlow": "rgba(30, 64, 175, 0.32)", "grad": "linear-gradient(135deg, #1A389A 0%, #3B82F6 52%, #1E40AF 100%)", "surfaceGrad": "linear-gradient(155deg, #161A33 0%, #100E13 58%, #1B223F 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F1F5FA 100%)", "bgMain": "#F1F5FA", "bgCard": "#FFFFFF", "bgSidebar": "#FAFCFD", "bgInput": "#F7FAFC", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(30, 64, 175, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Space Grotesk', 'Kantumruy Pro', sans-serif", "fontBody": "'Inter', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap", "cardRadius": "14px", "btnRadius": "10px", "pattern": "grid"}, {"num": 46, "id": "46_organic_harvest", "file": "46_organic_harvest.js", "cat": "mart", "nameKm": "ម៉ាតសរីរាង្គ", "nameEn": "Organic Harvest", "tag": "Premium Minimart & Grocer", "isDark": false, "accent": "#2F7A4D", "accent2": "#62B07F", "accentSoft": "rgba(47, 122, 77, 0.12)", "accentGlow": "rgba(47, 122, 77, 0.32)", "grad": "linear-gradient(135deg, #296B44 0%, #62B07F 52%, #2F7A4D 100%)", "surfaceGrad": "linear-gradient(155deg, #192522 0%, #100E13 58%, #203224 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F4F7F2 100%)", "bgMain": "#F4F7F2", "bgCard": "#FFFFFF", "bgSidebar": "#FBFCFA", "bgInput": "#F9FBF8", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(47, 122, 77, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Outfit', 'Kantumruy Pro', sans-serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "18px", "btnRadius": "14px", "pattern": "dot"}, {"num": 47, "id": "47_flora_atelier", "file": "47_flora_atelier.js", "cat": "mart", "nameKm": "ហាងផ្កាបូតានិក", "nameEn": "Botanical Florist", "tag": "Flower & Gift Studio", "isDark": false, "accent": "#9D5C63", "accent2": "#D18D94", "accentSoft": "rgba(157, 92, 99, 0.12)", "accentGlow": "rgba(157, 92, 99, 0.32)", "grad": "linear-gradient(135deg, #8A5157 0%, #D18D94 52%, #9D5C63 100%)", "surfaceGrad": "linear-gradient(155deg, #2D1F26 0%, #100E13 58%, #3F2A2A 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F9F4F2 100%)", "bgMain": "#F9F4F2", "bgCard": "#FFFFFF", "bgSidebar": "#FDFBFA", "bgInput": "#FCF9F8", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(157, 92, 99, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Cormorant Garamond', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "22px", "btnRadius": "999px", "pattern": "silk"}, {"num": 48, "id": "48_nordic_oak", "file": "48_nordic_oak.js", "cat": "mart", "nameKm": "ឈើអូកស្កែនឌី", "nameEn": "Nordic Oak Living", "tag": "Furniture & Home Decor", "isDark": false, "accent": "#8B6A4A", "accent2": "#BC9A77", "accentSoft": "rgba(139, 106, 74, 0.12)", "accentGlow": "rgba(139, 106, 74, 0.32)", "grad": "linear-gradient(135deg, #7A5D41 0%, #BC9A77 52%, #8B6A4A 100%)", "surfaceGrad": "linear-gradient(155deg, #292221 0%, #100E13 58%, #3A2E23 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F5F1EB 100%)", "bgMain": "#F5F1EB", "bgCard": "#FFFFFF", "bgSidebar": "#FCFAF8", "bgInput": "#FAF7F4", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(139, 106, 74, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "14px", "btnRadius": "10px", "pattern": "silk"}, {"num": 49, "id": "49_velvet_paws", "file": "49_velvet_paws.js", "cat": "mart", "nameKm": "សត្វចិញ្ចឹមវល្លិ៍", "nameEn": "Velvet Paws Cream", "tag": "Pet Shop & Grooming", "isDark": false, "accent": "#D98245", "accent2": "#F2B382", "accentSoft": "rgba(217, 130, 69, 0.12)", "accentGlow": "rgba(217, 130, 69, 0.32)", "grad": "linear-gradient(135deg, #BF723D 0%, #F2B382 52%, #D98245 100%)", "surfaceGrad": "linear-gradient(155deg, #372620 0%, #100E13 58%, #4F3422 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #FBF7F0 100%)", "bgMain": "#FBF7F0", "bgCard": "#FFFFFF", "bgSidebar": "#FEFCFA", "bgInput": "#FDFBF7", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#12100C", "border": "rgba(217, 130, 69, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Fraunces', 'Kantumruy Pro', serif", "fontBody": "'DM Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:wght@600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&display=swap", "cardRadius": "24px", "btnRadius": "999px", "pattern": "dot"}, {"num": 50, "id": "50_bordeaux_cellar", "file": "50_bordeaux_cellar.js", "cat": "mart", "nameKm": "ស្រាក្រហមប័រដូ", "nameEn": "Bordeaux Cellar", "tag": "Wine, Liquor & Lounge Bar", "isDark": true, "accent": "#C84B61", "accent2": "#E7A977", "accentSoft": "rgba(200, 75, 97, 0.14)", "accentGlow": "rgba(200, 75, 97, 0.4)", "grad": "linear-gradient(135deg, #B04255 0%, #E7A977 52%, #C84B61 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #431B24 0%, #140A0E 60%, #0C0608 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #391922 0%, #221118 100%)", "bgMain": "#140A0E", "bgCard": "#221118", "bgSidebar": "#10080B", "bgInput": "#2D1D24", "textMain": "#F8F6F0", "textMuted": "#9E9699", "btnText": "#FFFFFF", "border": "rgba(200, 75, 97, 0.24)", "glass": "rgba(34, 17, 24, 0.86)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "16px", "btnRadius": "10px", "pattern": "radial"}, {"num": 51, "id": "51_heritage_library", "file": "51_heritage_library.js", "cat": "mart", "nameKm": "បណ្ណាល័យវ៉លណាត់", "nameEn": "Heritage Walnut", "tag": "Bookstore & Stationery", "isDark": false, "accent": "#6F4E37", "accent2": "#A47E5E", "accentSoft": "rgba(111, 78, 55, 0.12)", "accentGlow": "rgba(111, 78, 55, 0.32)", "grad": "linear-gradient(135deg, #624530 0%, #A47E5E 52%, #6F4E37 100%)", "surfaceGrad": "linear-gradient(155deg, #241D1E 0%, #100E13 58%, #32261E 100%)", "cardStage": "radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F6F1E7 100%)", "bgMain": "#F6F1E7", "bgCard": "#FFFFFF", "bgSidebar": "#FCFAF7", "bgInput": "#FAF7F2", "textMain": "#17151C", "textMuted": "#6B655D", "btnText": "#FFFFFF", "border": "rgba(111, 78, 55, 0.26)", "glass": "rgba(255, 255, 255, 0.88)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "14px", "btnRadius": "10px", "pattern": "silk"}, {"num": 52, "id": "52_royal_saffron", "file": "52_royal_saffron.js", "cat": "mart", "nameKm": "រាជសាហ្វ្រុន VIP", "nameEn": "Royal Saffron VIP", "tag": "All-Purpose Sovereign VIP", "isDark": true, "accent": "#EAB308", "accent2": "#FDE047", "accentSoft": "rgba(234, 179, 8, 0.14)", "accentGlow": "rgba(234, 179, 8, 0.4)", "grad": "linear-gradient(135deg, #CE9E07 0%, #FDE047 52%, #EAB308 100%)", "surfaceGrad": "radial-gradient(circle at 50% 18%, #483811 0%, #0F0D14 60%, #09080C 100%)", "cardStage": "radial-gradient(circle at 50% 36%, #372D20 0%, #1A1724 100%)", "bgMain": "#0F0D14", "bgCard": "#1A1724", "bgSidebar": "#0C0A10", "bgInput": "#25232F", "textMain": "#F8F6F0", "textMuted": "#9A999F", "btnText": "#12100C", "border": "rgba(234, 179, 8, 0.24)", "glass": "rgba(26, 23, 36, 0.86)", "fontHeading": "'Playfair Display', 'Kantumruy Pro', serif", "fontBody": "'Plus Jakarta Sans', 'Kantumruy Pro', 'Battambang', sans-serif", "fontUrl": "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap", "cardRadius": "20px", "btnRadius": "999px", "pattern": "radial"}];



// ============================================================================
// SKM INTEGRATE — ALL-IN-ONE 52 LUXURY THEMES ENGINE (ROOT SINGLE FILE)
// Replaces entire themes/ folder (54 files -> 1 lightweight file ~92KB)
// ============================================================================
(function() {
    const LEGACY_MAP = {
        obsidian: '08_obsidian_michelin',
        ivory: '15_pearl_patisserie',
        emerald: '13_parisian_bistro',
        sapphire: '40_sapphire_cyber',
        rose_champagne: '16_rose_macaron',
        royal_espresso: '01_royal_espresso'
    };

    function getPatternCss(t) {
        const c = t.accentSoft || 'rgba(217,177,80,0.09)';
        if (t.pattern === 'dot') return `background-image: radial-gradient(${c} 1px, transparent 1px); background-size: 22px 22px;`;
        if (t.pattern === 'grid') return `background-image: linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px); background-size: 28px 28px;`;
        if (t.pattern === 'diagonal') return `background-image: repeating-linear-gradient(135deg, ${c} 0, ${c} 1px, transparent 1px, transparent 14px);`;
        if (t.pattern === 'silk') return `background-image: radial-gradient(circle at 85% 12%, ${c} 0%, transparent 45%), radial-gradient(circle at 15% 88%, ${c} 0%, transparent 45%);`;
        return `background-image: radial-gradient(circle at 50% 0%, ${c} 0%, transparent 55%);`;
    }

    function buildPosCss(t) {
        const pat = getPatternCss(t);
        const shCard = t.isDark
            ? '0 14px 34px -12px rgba(0,0,0,0.58), inset 0 1px 0 rgba(255,255,255,0.06)'
            : '0 12px 28px -10px rgba(20,16,10,0.10), 0 2px 6px rgba(20,16,10,0.04)';
        return `
:root, body, [data-theme="dark"], [data-theme="light"] {
  --bg-main: ${t.bgMain} !important; --bg-body: ${t.bgMain} !important; --store-bg: ${t.bgMain} !important;
  --bg-card: ${t.bgCard} !important; --card-bg: ${t.bgCard} !important; --bg-sidebar: ${t.bgSidebar} !important;
  --bg-alt: ${t.bgInput} !important; --bg-input: ${t.bgInput} !important;
  --text-main: ${t.textMain} !important; --text-dark: ${t.textMain} !important; --text-muted: ${t.textMuted} !important;
  --border: ${t.border} !important; --border-color: ${t.border} !important;
  --primary: ${t.accent} !important; --brand-cyan: ${t.accent} !important;
}
body, html { background-color: ${t.bgMain} !important; ${pat} color: ${t.textMain} !important; font-family: ${t.fontBody} !important; }
#appSidebar, .sidebar { background: ${t.bgSidebar} !important; border-right: 1px solid ${t.border} !important; box-shadow: 8px 0 36px rgba(0,0,0,${t.isDark ? '0.48' : '0.08'}) !important; }
#topHeaderBar, header.top-header, .top-header { background: ${t.glass} !important; backdrop-filter: blur(22px) saturate(160%) !important; -webkit-backdrop-filter: blur(22px) saturate(160%) !important; border-bottom: 1px solid ${t.border} !important; color: ${t.textMain} !important; }
#pageTitle, #displayShopName, h1, h2 { font-family: ${t.fontHeading} !important; letter-spacing: 0.3px; }
.nav-item { border-radius: ${t.btnRadius} !important; margin: 3px 8px !important; transition: all 0.25s ease !important; }
.nav-item:hover { background: ${t.accentSoft} !important; color: ${t.accent} !important; }
.nav-item.active { background: ${t.grad} !important; color: ${t.btnText} !important; font-weight: 800 !important; box-shadow: 0 8px 22px -4px ${t.accentGlow} !important; }
.card, .stat-card, .dashboard-card, .product-card, .pos-cart, .cart-panel, .modal { background: ${t.bgCard} !important; border: 1px solid ${t.border} !important; border-radius: ${t.cardRadius} !important; box-shadow: ${shCard} !important; }
.product-card { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease !important; }
.product-card:hover { transform: translateY(-3px) !important; border-color: ${t.accent} !important; box-shadow: 0 18px 36px -10px ${t.accentGlow} !important; }
.btn-primary, .btn-success { background: ${t.grad} !important; color: ${t.btnText} !important; border: none !important; font-weight: 800 !important; border-radius: ${t.btnRadius} !important; box-shadow: 0 8px 20px -5px ${t.accentGlow} !important; }
.btn-outline { background: ${t.bgInput} !important; border: 1px solid ${t.border} !important; color: ${t.textMain} !important; border-radius: ${t.btnRadius} !important; }
.form-control, input[type="text"], input[type="number"], input[type="date"], input[type="datetime-local"], select, textarea { background: ${t.bgInput} !important; color: ${t.textMain} !important; border: 1px solid ${t.border} !important; border-radius: 12px !important; }
.form-control:focus, input:focus, select:focus, textarea:focus { border-color: ${t.accent} !important; box-shadow: 0 0 0 3px ${t.accentSoft} !important; }
table thead th { background: ${t.bgInput} !important; color: ${t.accent} !important; border-bottom: 1px solid ${t.border} !important; }
table tbody tr:hover { background: ${t.accentSoft} !important; }
.p-price { color: ${t.accent} !important; }
.product-card .badge-cat, #mainInventoryTable .badge-cat { background: ${t.grad} !important; color: ${t.btnText} !important; font-weight: 800 !important; text-shadow: none !important; }`;
    }

    function buildMenuCss(t) {
        const pat = getPatternCss(t);
        const shCard = t.isDark
            ? '0 14px 34px -12px rgba(0,0,0,0.58), inset 0 1px 0 rgba(255,255,255,0.06)'
            : '0 12px 28px -10px rgba(20,16,10,0.10), 0 2px 6px rgba(20,16,10,0.04)';
        return `
:root, body, [data-theme="dark"], [data-theme="light"], [data-lux-palette] {
  --lux-accent: ${t.accent} !important; --lux-accent-2: ${t.accent2} !important;
  --lux-accent-soft: ${t.accentSoft} !important; --lux-accent-glow: ${t.accentGlow} !important;
  --lux-grad: ${t.grad} !important; --lux-surface-grad: ${t.surfaceGrad} !important;
  --brand-dark: ${t.bgSidebar} !important; --brand-cyan: ${t.accent} !important;
  --store-bg: ${t.bgMain} !important; --card-bg: ${t.bgCard} !important; --card-stage: ${t.cardStage} !important;
  --glass-bg: ${t.glass} !important; --glass-border: ${t.border} !important;
  --text-dark: ${t.textMain} !important; --text-muted: ${t.textMuted} !important; --border-color: ${t.border} !important;
}
body, #storePage { background-color: ${t.bgMain} !important; ${pat} color: ${t.textMain} !important; font-family: ${t.fontBody} !important; }
.lp-title, .top-bar .title, .cat-section-title, .modal-header h3, #splashScreen h2 { font-family: ${t.fontHeading} !important; }
.p-card { background: ${t.bgCard} !important; border: 1px solid ${t.border} !important; border-radius: ${t.cardRadius} !important; box-shadow: ${shCard} !important; }
.p-img-box { background: ${t.cardStage} !important; }
.p-price { color: ${t.accent} !important; }
.p-add-btn, .lp-btn-cyan, .cat-pill.active, .nav-fab, .btn-green, .v-btn.active, .floating-chat { background: ${t.grad} !important; color: ${t.btnText} !important; border-radius: ${t.btnRadius} !important; }
.bottom-nav, .top-bar { background: ${t.glass} !important; backdrop-filter: blur(22px) saturate(160%) !important; -webkit-backdrop-filter: blur(22px) saturate(160%) !important; border-color: ${t.border} !important; }`;
    }

    window.applyLuxuryThemeById = function(themeId, forceScope) {
        const resolved = LEGACY_MAP[themeId] || themeId;
        const catalog = Array.isArray(window.SKM_52_LUXURY_THEMES) ? window.SKM_52_LUXURY_THEMES : [];
        const t = catalog.find(x => x.id === resolved);
        if (!t) return false;

        const fontId = 'skm-lux-font-' + t.id;
        if (t.fontUrl && !document.getElementById(fontId)) {
            const link = document.createElement('link');
            link.id = fontId;
            link.rel = 'stylesheet';
            link.href = t.fontUrl;
            document.head.appendChild(link);
        }

        const isMenu = forceScope ? (forceScope === 'menu') : (Boolean(document.getElementById('storePage')) || /menu\.html/i.test(location.pathname));
        const styleId = isMenu ? 'skm-menu-luxury-theme-style' : 'skm-pos-luxury-theme-style';
        let st = document.getElementById(styleId);
        if (!st) {
            st = document.createElement('style');
            st.id = styleId;
            document.head.appendChild(st);
        }
        st.textContent = isMenu ? buildMenuCss(t) : buildPosCss(t);
        document.documentElement.setAttribute(isMenu ? 'data-menu-lux-theme' : 'data-pos-lux-theme', t.id);
        if (isMenu && document.body) {
            document.body.setAttribute('data-theme', t.isDark ? 'dark' : 'light');
        }
        return true;
    };

    // Pre-register all 52 themes into __SKM_LOADED_THEMES__ so any legacy caller gets instant 0ms apply
    window.__SKM_LOADED_THEMES__ = window.__SKM_LOADED_THEMES__ || {};
    (window.SKM_52_LUXURY_THEMES || []).forEach(t => {
        window.__SKM_LOADED_THEMES__[t.id] = (scope) => window.applyLuxuryThemeById(t.id, scope);
    });
})();


/**
 * SKM INTEGRATE — Luxury Theme Extras Engine
 * Includes: Custom Brand Theme Renderer, Menu Layout Engine, Seasonal Overlays (Auto-Expiry),
 * and Live Client Showroom (?showroom=1 or ?preview_theme=...)
 */
(function() {
    window.SKM_THEME_EXTRAS = window.SKM_THEME_EXTRAS || {};

    function getPatternCss(t) {
        const c = t.accentSoft || 'rgba(217,177,80,0.09)';
        if (t.pattern === 'dot') return `background-image: radial-gradient(${c} 1px, transparent 1px); background-size: 22px 22px;`;
        if (t.pattern === 'grid') return `background-image: linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px); background-size: 28px 28px;`;
        if (t.pattern === 'diagonal') return `background-image: repeating-linear-gradient(135deg, ${c} 0, ${c} 1px, transparent 1px, transparent 14px);`;
        if (t.pattern === 'silk') return `background-image: radial-gradient(circle at 85% 12%, ${c} 0%, transparent 45%), radial-gradient(circle at 15% 88%, ${c} 0%, transparent 45%);`;
        return `background-image: radial-gradient(circle at 50% 0%, ${c} 0%, transparent 55%);`;
    }

    // ------------------------------------------------------------------
    // 1. CUSTOM BRAND-FROM-LOGO THEME RENDERER (Dual POS & Menu)
    // ------------------------------------------------------------------
    window.applyCustomBrandTheme = function(brandCfg, forceScope) {
        if (!brandCfg || typeof brandCfg !== 'object') return;
        const isMenu = forceScope ? (forceScope === 'menu') : (Boolean(document.getElementById('storePage')) || /menu\.html/i.test(location.pathname));
        const fontUrl = brandCfg.fontUrl || 'https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap';

        if (!document.getElementById('skm-custom-brand-font')) {
            const fl = document.createElement('link');
            fl.id = 'skm-custom-brand-font';
            fl.rel = 'stylesheet';
            fl.href = fontUrl;
            document.head.appendChild(fl);
        }

        const styleId = isMenu ? 'skm-menu-luxury-theme-style' : 'skm-pos-luxury-theme-style';
        let st = document.getElementById(styleId);
        if (!st) {
            st = document.createElement('style');
            st.id = styleId;
            document.head.appendChild(st);
        }

        const t = brandCfg;
        const pat = getPatternCss(t);
        const rad = t.cardRadius || '20px';
        const brad = t.btnRadius || '999px';
        const shCard = `0 14px 34px -12px rgba(0,0,0,${t.isDark ? '0.58' : '0.10'})`;

        if (isMenu) {
            st.textContent = `
:root, body, [data-theme="dark"], [data-theme="light"], [data-lux-palette] {
  --lux-accent: ${t.accent} !important; --lux-accent-2: ${t.accent2} !important;
  --lux-accent-soft: ${t.accentSoft} !important; --lux-accent-glow: ${t.accentGlow} !important;
  --lux-grad: ${t.grad} !important; --lux-surface-grad: ${t.surfaceGrad} !important;
  --brand-dark: ${t.bgSidebar} !important; --brand-cyan: ${t.accent} !important;
  --store-bg: ${t.bgMain} !important; --card-bg: ${t.bgCard} !important; --card-stage: ${t.cardStage} !important;
  --glass-bg: ${t.glass} !important; --glass-border: ${t.border} !important;
  --text-dark: ${t.textMain} !important; --text-muted: ${t.textMuted} !important; --border-color: ${t.border} !important;
}
body, #storePage { background-color: ${t.bgMain} !important; ${pat} color: ${t.textMain} !important; font-family: ${t.fontBody || "'Plus Jakarta Sans','Kantumruy Pro',sans-serif"} !important; }
.lp-title, .top-bar .title, .cat-section-title, .modal-header h3, #splashScreen h2 { font-family: ${t.fontHeading || "'Playfair Display','Kantumruy Pro',serif"} !important; }
.p-card { background: ${t.bgCard} !important; border: 1px solid ${t.border} !important; border-radius: ${rad} !important; box-shadow: ${shCard} !important; }
.p-img-box { background: ${t.cardStage} !important; }
.p-price { color: ${t.accent} !important; }
.p-add-btn, .lp-btn-cyan, .cat-pill.active, .nav-fab, .btn-green, .v-btn.active, .floating-chat { background: ${t.grad} !important; color: ${t.btnText} !important; border-radius: ${brad} !important; }
.bottom-nav, .top-bar { background: ${t.glass} !important; backdrop-filter: blur(22px) saturate(160%) !important; -webkit-backdrop-filter: blur(22px) saturate(160%) !important; border-color: ${t.border} !important; }`;
            document.documentElement.setAttribute('data-menu-lux-theme', 'custom_brand');
            if (document.body) document.body.setAttribute('data-theme', t.isDark ? 'dark' : 'light');
        } else {
            st.textContent = `
:root, body, [data-theme="dark"], [data-theme="light"] {
  --bg-main: ${t.bgMain} !important; --bg-body: ${t.bgMain} !important; --store-bg: ${t.bgMain} !important;
  --bg-card: ${t.bgCard} !important; --card-bg: ${t.bgCard} !important; --bg-sidebar: ${t.bgSidebar} !important;
  --bg-alt: ${t.bgInput} !important; --bg-input: ${t.bgInput} !important;
  --text-main: ${t.textMain} !important; --text-dark: ${t.textMain} !important; --text-muted: ${t.textMuted} !important;
  --border: ${t.border} !important; --border-color: ${t.border} !important;
  --primary: ${t.accent} !important; --brand-cyan: ${t.accent} !important;
}
body, html { background-color: ${t.bgMain} !important; ${pat} color: ${t.textMain} !important; font-family: ${t.fontBody || "'Plus Jakarta Sans','Kantumruy Pro',sans-serif"} !important; }
#appSidebar, .sidebar { background: ${t.bgSidebar} !important; border-right: 1px solid ${t.border} !important; }
#topHeaderBar, header.top-header, .top-header { background: ${t.glass} !important; backdrop-filter: blur(22px) saturate(160%) !important; border-bottom: 1px solid ${t.border} !important; color: ${t.textMain} !important; }
#pageTitle, #displayShopName, h1, h2 { font-family: ${t.fontHeading || "'Playfair Display','Kantumruy Pro',serif"} !important; }
.nav-item { border-radius: ${brad} !important; margin: 3px 8px !important; }
.nav-item.active { background: ${t.grad} !important; color: ${t.btnText} !important; font-weight: 800 !important; box-shadow: 0 8px 22px -4px ${t.accentGlow} !important; }
.card, .stat-card, .dashboard-card, .product-card, .pos-cart, .cart-panel, .modal { background: ${t.bgCard} !important; border: 1px solid ${t.border} !important; border-radius: ${rad} !important; box-shadow: ${shCard} !important; }
.btn-primary, .btn-success { background: ${t.grad} !important; color: ${t.btnText} !important; border: none !important; font-weight: 800 !important; border-radius: ${brad} !important; }
.btn-outline { background: ${t.bgInput} !important; border: 1px solid ${t.border} !important; color: ${t.textMain} !important; border-radius: ${brad} !important; }
.form-control, input[type="text"], input[type="number"], input[type="date"], select, textarea { background: ${t.bgInput} !important; color: ${t.textMain} !important; border: 1px solid ${t.border} !important; border-radius: 12px !important; }
table thead th { background: ${t.bgInput} !important; color: ${t.accent} !important; border-bottom: 1px solid ${t.border} !important; }
.p-price { color: ${t.accent} !important; }
.product-card .badge-cat, #mainInventoryTable .badge-cat { background: ${t.grad} !important; color: ${t.btnText} !important; font-weight: 800 !important; text-shadow: none !important; }`;
            document.documentElement.setAttribute('data-pos-lux-theme', 'custom_brand');
        }
    };

    // ------------------------------------------------------------------
    // 2. MENU LAYOUT ENGINE (grid | list | magazine)
    // ------------------------------------------------------------------
    window.applyMenuLayoutStyle = function(layoutMode) {
        const mode = ['grid', 'list', 'magazine'].includes(layoutMode) ? layoutMode : 'grid';
        document.documentElement.setAttribute('data-menu-layout', mode);
        try { localStorage.setItem('skm_menu_layout_pref', mode); } catch(e) {}

        let st = document.getElementById('skm-menu-layout-css');
        if (!st) {
            st = document.createElement('style');
            st.id = 'skm-menu-layout-css';
            document.head.appendChild(st);
        }
        st.textContent = `
            /* Editorial List Layout */
            [data-menu-layout="list"] .product-grid {
                grid-template-columns: 1fr !important;
                gap: 12px !important;
            }
            [data-menu-layout="list"] .p-card {
                flex-direction: row !important;
                align-items: stretch !important;
                min-height: 112px !important;
            }
            [data-menu-layout="list"] .p-img-box {
                width: 112px !important;
                min-width: 112px !important;
                aspect-ratio: 1 / 1 !important;
                padding: 8px !important;
            }
            [data-menu-layout="list"] .p-badge {
                top: 6px !important; left: 6px !important; font-size: 8px !important; padding: 2px 6px !important;
            }
            [data-menu-layout="list"] .p-fav-btn {
                top: 6px !important; right: 6px !important; width: 26px !important; height: 26px !important; font-size: 11px !important;
            }
            [data-menu-layout="list"] .p-info {
                padding: 12px 14px !important;
                justify-content: space-between !important;
            }
            [data-menu-layout="list"] .p-title {
                font-size: 14.5px !important;
                -webkit-line-clamp: 2 !important;
            }
            /* Magazine Hero Layout (1st card per section spans full width hero) */
            [data-menu-layout="magazine"] .product-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 14px !important;
            }
            [data-menu-layout="magazine"] .product-grid .p-card:first-child {
                grid-column: 1 / -1 !important;
                flex-direction: row !important;
                min-height: 175px !important;
            }
            [data-menu-layout="magazine"] .product-grid .p-card:first-child .p-img-box {
                width: 48% !important;
                min-width: 48% !important;
                aspect-ratio: auto !important;
                padding: 14px !important;
            }
            [data-menu-layout="magazine"] .product-grid .p-card:first-child .p-info {
                padding: 18px 16px !important;
                justify-content: center !important;
                gap: 14px !important;
            }
            [data-menu-layout="magazine"] .product-grid .p-card:first-child .p-title {
                font-size: 17px !important;
                line-height: 1.35 !important;
            }
            [data-menu-layout="magazine"] .product-grid .p-card:first-child .p-price {
                font-size: 19px !important;
            }
        `;

        document.querySelectorAll('.lux-layout-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-layout') === mode);
        });
    };

    // ------------------------------------------------------------------
    // 3. SEASONAL OVERLAY ENGINE (With Auto-Expiry Date)
    // ------------------------------------------------------------------
    const SEASONAL_PRESETS = {
        khmer_new_year: {
            label: '🌸 សួស្តីឆ្នាំថ្មីប្រពៃណីជាតិ (Khmer New Year)',
            particles: ['🌼', '✨', '🌸', '🪷', '✨'],
            bannerBg: 'linear-gradient(90deg, rgba(180,120,20,0.92), rgba(230,175,55,0.94), rgba(180,120,20,0.92))',
            bannerColor: '#1a1103',
            count: 14
        },
        water_festival: {
            label: '🏮 រីករាយព្រះរាជពិធីបុណ្យអុំទូក (Water Festival)',
            particles: ['🏮', '✨', '🪷', '🌟', '🕯️'],
            bannerBg: 'linear-gradient(90deg, rgba(15,35,75,0.92), rgba(190,140,40,0.92), rgba(15,35,75,0.92))',
            bannerColor: '#fff7e0',
            count: 14
        },
        chinese_new_year: {
            label: '🧧 សួស្តីឆ្នាំថ្មីចិន — ហេងហេង (Lunar New Year)',
            particles: ['🏮', '🧧', '✨', '🌸', '🪙'],
            bannerBg: 'linear-gradient(90deg, rgba(153,27,27,0.94), rgba(220,38,38,0.94), rgba(153,27,27,0.94))',
            bannerColor: '#fef08a',
            count: 14
        },
        christmas: {
            label: '❄️ Merry Christmas & Happy Holidays',
            particles: ['❄️', '✨', '🎄', '❄️', '⭐'],
            bannerBg: 'linear-gradient(90deg, rgba(15,65,45,0.92), rgba(185,28,28,0.92), rgba(15,65,45,0.92))',
            bannerColor: '#ffffff',
            count: 16
        }
    };

    window.applySeasonalOverlay = function(effectId, expiryDateStr) {
        const old = document.getElementById('skm-seasonal-overlay-root');
        if (old) old.remove();

        if (!effectId || effectId === 'none' || !SEASONAL_PRESETS[effectId]) return;

        // Check Auto-Expiry Date (YYYY-MM-DD)
        if (expiryDateStr && /^\d{4}-\d{2}-\d{2}$/.test(expiryDateStr)) {
            const expEnd = new Date(expiryDateStr + 'T23:59:59').getTime();
            if (Date.now() > expEnd) {
                console.log('[SKM Seasonal] Overlay expired on', expiryDateStr);
                return;
            }
        }

        const cfg = SEASONAL_PRESETS[effectId];

        if (!document.getElementById('skm-seasonal-css')) {
            const st = document.createElement('style');
            st.id = 'skm-seasonal-css';
            st.textContent = `
                #skm-seasonal-overlay-root {
                    position: fixed; inset: 0; pointer-events: none; z-index: 4500; overflow: hidden;
                }
                .skm-s-particle {
                    position: absolute; top: -40px; user-select: none; opacity: 0;
                    animation: skmSeasonalFall linear infinite;
                    filter: drop-shadow(0 2px 6px rgba(0,0,0,0.28));
                }
                @keyframes skmSeasonalFall {
                    0% { transform: translate3d(0, -10px, 0) rotate(0deg); opacity: 0; }
                    12% { opacity: 0.85; }
                    88% { opacity: 0.75; }
                    100% { transform: translate3d(42px, 105vh, 0) rotate(260deg); opacity: 0; }
                }
                .skm-s-ribbon {
                    position: fixed; top: 0; left: 50%; transform: translateX(-50%);
                    width: 100%; max-width: 900px; text-align: center;
                    font-size: 11px; font-weight: 800; padding: 4px 12px;
                    letter-spacing: 0.4px; pointer-events: none; z-index: 4501;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.18);
                }
            `;
            document.head.appendChild(st);
        }

        const root = document.createElement('div');
        root.id = 'skm-seasonal-overlay-root';

        // Show subtle festive ribbon on Menu only
        const isMenu = Boolean(document.getElementById('storePage')) || /menu\.html/i.test(location.pathname);
        if (isMenu) {
            const ribbon = document.createElement('div');
            ribbon.className = 'skm-s-ribbon';
            ribbon.style.background = cfg.bannerBg;
            ribbon.style.color = cfg.bannerColor;
            ribbon.textContent = cfg.label;
            root.appendChild(ribbon);
        }

        for (let i = 0; i < cfg.count; i++) {
            const p = document.createElement('span');
            p.className = 'skm-s-particle';
            p.textContent = cfg.particles[i % cfg.particles.length];
            p.style.left = ((i * 7.3 + (i % 3) * 2.5) % 98) + '%';
            p.style.fontSize = (13 + (i % 4) * 4) + 'px';
            p.style.animationDuration = (8 + (i % 5) * 2.4) + 's';
            p.style.animationDelay = ((i * 0.75) % 7) + 's';
            root.appendChild(p);
        }
        document.body.appendChild(root);
    };

    // ------------------------------------------------------------------
    // 4. LIVE CLIENT SHOWROOM BAR (?showroom=1 or ?preview_theme=...)
    // ------------------------------------------------------------------
    function mountShowroomBar() {
        const params = new URLSearchParams(window.location.search);
        const isShowroom = params.get('showroom') === '1' || params.get('showroom') === 'true';
        const previewTheme = params.get('preview_theme') || '';
        const previewLayout = params.get('preview_layout') || '';
        const previewSeason = params.get('preview_season') || '';

        if (!isShowroom && !previewTheme && !previewLayout && !previewSeason) return;

        const isMenu = Boolean(document.getElementById('storePage')) || /menu\.html/i.test(location.pathname);

        // Apply initial preview overrides immediately (non-destructive, does NOT save to DB)
        const applyPreviewTheme = (tid) => {
            if (!tid) return;
            if (isMenu) {
                if (typeof window.loadOnDemandMenuTheme === 'function') window.loadOnDemandMenuTheme(tid);
                else if (typeof window.applyLuxuryThemeById === 'function') {
                    window.applyLuxuryThemeById(tid, 'menu');
                }
            } else {
                window.__SKM_SHOWROOM_ACTIVE__ = true; if (typeof window.applyPosLuxuryTheme === 'function') window.applyPosLuxuryTheme(tid, true);
            }
        };

        if (previewTheme) setTimeout(() => applyPreviewTheme(previewTheme), 180);
        if (previewLayout && isMenu) setTimeout(() => window.applyMenuLayoutStyle(previewLayout), 200);
        if (previewSeason) setTimeout(() => window.applySeasonalOverlay(previewSeason, ''), 220);

        // Load catalog dynamically if not loaded yet so Showroom dropdown has all 52 themes
        const renderBar = () => {
            if (document.getElementById('skm-showroom-bar')) return;
            const catalog = Array.isArray(window.SKM_52_LUXURY_THEMES) ? window.SKM_52_LUXURY_THEMES : [];
            const cats = Array.isArray(window.SKM_LUXURY_CATEGORIES) ? window.SKM_LUXURY_CATEGORIES : [];
            let curIdx = Math.max(0, catalog.findIndex(t => t.id === previewTheme));

            const bar = document.createElement('div');
            bar.id = 'skm-showroom-bar';
            bar.style.cssText = 'position:fixed; top:10px; left:50%; transform:translateX(-50%); z-index:99999; width:calc(100% - 20px); max-width:860px; background:rgba(12,14,20,0.94); color:#f8f6f0; border:1.5px solid rgba(217,177,80,0.55); border-radius:18px; padding:10px 14px; box-shadow:0 18px 45px rgba(0,0,0,0.65); backdrop-filter:blur(16px); font-family:"Plus Jakarta Sans","Kantumruy Pro",sans-serif; font-size:12px;';

            const optsHtml = catalog.map((t, i) => `<option value="${t.id}" ${i === curIdx ? 'selected' : ''}>#${String(t.num).padStart(2,'0')} ${t.nameKm} — ${t.nameEn} (${t.tag})</option>`).join('');

            bar.innerHTML = `
                <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap;">
                    <div style="display:flex; align-items:center; gap:7px; font-weight:900; color:#F3D98B;">
                        <span>👑 LIVE SHOWROOM</span>
                        <span style="font-size:10px; background:rgba(217,177,80,0.2); padding:2px 8px; border-radius:999px;">52 Themes</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px; flex:1; min-width:210px;">
                        <button type="button" id="srPrevBtn" style="padding:6px 10px; border-radius:10px; border:1px solid rgba(217,177,80,0.4); background:#1a1d26; color:#f8f6f0; cursor:pointer; font-weight:900;">◀</button>
                        <select id="srThemeSel" style="flex:1; min-width:140px; padding:6px 10px; border-radius:10px; border:1px solid rgba(217,177,80,0.45); background:#1a1d26; color:#f8f6f0; font-size:12px; font-weight:700; outline:none;">${optsHtml}</select>
                        <button type="button" id="srNextBtn" style="padding:6px 10px; border-radius:10px; border:1px solid rgba(217,177,80,0.4); background:#1a1d26; color:#f8f6f0; cursor:pointer; font-weight:900;">▶</button>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                        ${isMenu ? `
                        <select id="srLayoutSel" style="padding:6px 8px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:#1a1d26; color:#f8f6f0; font-size:11px; font-weight:700;">
                            <option value="grid" ${previewLayout==='grid'?'selected':''}>⊞ Grid</option>
                            <option value="list" ${previewLayout==='list'?'selected':''}>☰ List</option>
                            <option value="magazine" ${previewLayout==='magazine'?'selected':''}>📰 Magazine</option>
                        </select>` : ''}
                        <select id="srSeasonSel" style="padding:6px 8px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:#1a1d26; color:#f8f6f0; font-size:11px; font-weight:700;">
                            <option value="none">✨ គ្មានបុណ្យ</option>
                            <option value="khmer_new_year" ${previewSeason==='khmer_new_year'?'selected':''}>🌸 ចូលឆ្នាំខ្មែរ</option>
                            <option value="water_festival" ${previewSeason==='water_festival'?'selected':''}>🏮 បុណ្យអុំទូក</option>
                            <option value="chinese_new_year" ${previewSeason==='chinese_new_year'?'selected':''}>🧧 ចូលឆ្នាំចិន</option>
                            <option value="christmas" ${previewSeason==='christmas'?'selected':''}>❄️ Christmas</option>
                        </select>
                        <button type="button" id="srCopyBtn" style="padding:6px 11px; border-radius:10px; border:none; background:linear-gradient(135deg,#C29634,#F2D684); color:#14110B; font-weight:900; cursor:pointer; font-size:11px;">📋 Copy កូដផ្ញើ Admin</button>
                        <button type="button" id="srMinBtn" title="បង្រួម/ពង្រីក" style="padding:6px 9px; border-radius:10px; border:1px solid rgba(217,177,80,0.4); background:#1a1d26; color:#F3D98B; cursor:pointer; font-weight:900;">➖</button>
                        <button type="button" id="srCloseBtn" style="padding:6px 9px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:transparent; color:#ccc; cursor:pointer;">✕</button>
                    </div>
                </div>
            `;
            document.body.appendChild(bar);

            const sel = document.getElementById('srThemeSel');
            const applyByIdx = (idx) => {
                if (!catalog.length) return;
                curIdx = (idx + catalog.length) % catalog.length;
                const t = catalog[curIdx];
                sel.value = t.id;
                applyPreviewTheme(t.id);
            };

            if (!previewTheme && catalog.length > 0) applyByIdx(0);

            sel.onchange = () => {
                const idx = catalog.findIndex(t => t.id === sel.value);
                if (idx >= 0) applyByIdx(idx);
            };
            document.getElementById('srPrevBtn').onclick = () => applyByIdx(curIdx - 1);
            document.getElementById('srNextBtn').onclick = () => applyByIdx(curIdx + 1);
            const laySel = document.getElementById('srLayoutSel');
            if (laySel) laySel.onchange = () => window.applyMenuLayoutStyle(laySel.value);
            const seaSel = document.getElementById('srSeasonSel');
            if (seaSel) seaSel.onchange = () => window.applySeasonalOverlay(seaSel.value, '');

            document.getElementById('srCopyBtn').onclick = () => {
                const t = catalog[curIdx];
                const lay = laySel ? laySel.value : 'grid';
                const sea = seaSel ? seaSel.value : 'none';
                const msg = t ? `ខ្ញុំពេញចិត្តស្បែក #${String(t.num).padStart(2,'0')} ${t.nameEn} (${t.nameKm}) | Code: ${t.id} | Layout: ${lay} | Season: ${sea}` : sel.value;
                try {
                    const ta = document.createElement('textarea');
                    ta.value = msg; ta.style.position = 'fixed'; document.body.appendChild(ta);
                    ta.select(); document.execCommand('copy'); ta.remove();
                    if (typeof window.showToast === 'function') window.showToast('✅ បាន Copy កូដម៉ូដែលស្បែករួចរាល់! ផ្ញើជូន Admin បានភ្លាម។');
                } catch(e) {}
            };
            document.getElementById('srMinBtn').onclick = () => {
                bar.style.display = 'none';
                let pill = document.getElementById('skm-showroom-mini-pill');
                if (!pill) {
                    pill = document.createElement('button');
                    pill.id = 'skm-showroom-mini-pill';
                    pill.type = 'button';
                    pill.innerHTML = '👑 Showroom (52)';
                    pill.style.cssText = 'position:fixed; top:12px; left:50%; transform:translateX(-50%); z-index:99999; padding:7px 14px; border-radius:999px; border:1px solid rgba(217,177,80,0.6); background:rgba(12,14,20,0.92); color:#F3D98B; font-size:11.5px; font-weight:900; cursor:pointer; box-shadow:0 10px 24px rgba(0,0,0,0.5);';
                    pill.onclick = () => { pill.style.display = 'none'; bar.style.display = 'block'; };
                    document.body.appendChild(pill);
                } else {
                    pill.style.display = 'block';
                }
            };
            document.getElementById('srCloseBtn').onclick = () => {
                bar.remove();
                const pill = document.getElementById('skm-showroom-mini-pill');
                if (pill) pill.remove();
            };
        };

        if (Array.isArray(window.SKM_52_LUXURY_THEMES) && window.SKM_52_LUXURY_THEMES.length > 0) {
            renderBar();
        } else {
            const sc = document.createElement('script');
            sc.src = './all_luxury_themes.js';
            sc.onload = renderBar;
            document.head.appendChild(sc);
        }
    }

    function bootExtras() {
        try {
            const qp = new URLSearchParams(window.location.search);
            const isMenu = Boolean(document.getElementById('storePage')) || /menu\.html/i.test(location.pathname);
            if (isMenu && !qp.get('preview_layout')) {
                const pref = localStorage.getItem('skm_menu_layout_pref');
                if (pref && ['grid', 'list', 'magazine'].includes(pref)) {
                    window.applyMenuLayoutStyle(pref);
                }
            }
        } catch(e) {}
        setTimeout(mountShowroomBar, 250);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootExtras);
    } else {
        bootExtras();
    }
})();
