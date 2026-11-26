/**
 * SKM POS Desktop App (Windows / macOS / Linux) — Electron Main Process
 * បង្រួមទាំងប្រព័ន្ធ POS + ម៉ាស៊ីនព្រីនស្វ័យប្រវត្តិ (USB/Windows & LAN IP:9100) + អេក្រង់ទី២ ក្នុង App តែមួយ!
 */
const { app, BrowserWindow, ipcMain, Menu, screen, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const net = require('net');

const WEB_PORT = 4580;
const BRIDGE_PORT = 9191;
const HOST = '127.0.0.1';

let mainWindow = null;
let displayWindow = null;
let kdsWindow = null;
let webServer = null;
let bridgeServer = null;

// កំណត់ទីតាំងឯកសារ Web (គាំទ្រទាំងពេល Run Dev និងពេល Build ជា .exe រួច)
function getWebRoot() {
    if (app.isPackaged) {
        const resWeb = path.join(process.resourcesPath, 'web');
        if (fs.existsSync(resWeb)) return resWeb;
    }
    return path.resolve(__dirname, '..');
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.sql': 'text/plain; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8'
};

// 1. ម៉ាស៊ីនមេ Local HTTP ដើម្បីឱ្យ LocalStorage, Supabase & Offline ដំណើរការ 100% លើ Desktop App
function startLocalWebServer() {
    return new Promise((resolve) => {
        const webRoot = getWebRoot();
        webServer = http.createServer((req, res) => {
            const urlPath = (req.url || '/').split('?')[0];
            let relPath = decodeURIComponent(urlPath === '/' ? '/welcome.html' : urlPath);
            relPath = path.normalize(relPath).replace(/^(\.\.[/\\])+/, '');
            let fullPath = path.join(webRoot, relPath);

            if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
                fullPath = path.join(webRoot, 'welcome.html');
            }
            const ext = path.extname(fullPath).toLowerCase();
            res.writeHead(200, {
                'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
                'Cache-Control': 'no-cache'
            });
            fs.createReadStream(fullPath).pipe(res);
        });

        webServer.on('error', () => resolve());
        webServer.listen(WEB_PORT, HOST, () => {
            console.log(`✅ SKM POS Desktop Server: http://${HOST}:${WEB_PORT}`);
            resolve();
        });
    });
}

// 2. ម៉ាស៊ីនព្រីន ESC/POS LAN IP:9100 បង្កប់ស្រាប់ក្នុង PC App (មិនបាច់បើកផ្ទាំងខ្មៅដាច់ដោយឡែក!)
const ESC = 0x1b;
const GS = 0x1d;
const CMD_INIT = Buffer.from([ESC, 0x40]);
const CMD_ALIGN_LEFT = Buffer.from([ESC, 0x61, 0x00]);
const CMD_BOLD_ON = Buffer.from([ESC, 0x45, 0x01]);
const CMD_BOLD_OFF = Buffer.from([ESC, 0x45, 0x00]);
const CMD_CUT_PARTIAL = Buffer.from([GS, 0x56, 0x42, 0x00]);
const CMD_OPEN_DRAWER = Buffer.from([ESC, 0x70, 0x00, 0x19, 0xfa]);

function buildEscPosBuffer(job) {
    const chunks = [CMD_INIT, CMD_ALIGN_LEFT];
    const lines = String(job.text || '').split(/\r?\n/);
    lines.forEach((line, idx) => {
        if (idx === 0 || line.startsWith('*** ') || line.startsWith('TOTAL:')) {
            chunks.push(CMD_BOLD_ON, Buffer.from(line + '\n', 'utf8'), CMD_BOLD_OFF);
        } else {
            chunks.push(Buffer.from(line + '\n', 'utf8'));
        }
    });
    chunks.push(Buffer.from('\n\n\n', 'utf8'));
    if (job.cutPaper !== false) chunks.push(CMD_CUT_PARTIAL);
    if (job.openDrawer) chunks.push(CMD_OPEN_DRAWER);
    return Buffer.concat(chunks);
}

function sendRawTcp(ip, port, buffer, timeoutMs = 4000) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        let doneFlag = false;
        const finish = (err) => {
            if (doneFlag) return;
            doneFlag = true;
            try { socket.destroy(); } catch (e) {}
            if (err) reject(err); else resolve();
        };
        socket.setTimeout(timeoutMs);
        socket.on('timeout', () => finish(new Error(`Timeout ${ip}:${port}`)));
        socket.on('error', (err) => finish(err));
        socket.connect(port, ip, () => {
            socket.write(buffer, () => setTimeout(() => finish(null), 120));
        });
    });
}

async function runRawIpJobs(jobs) {
    return Promise.all((jobs || []).map(async (job) => {
        const ip = String(job.ip || '').trim();
        const port = parseInt(job.port) || 9100;
        if (!ip) return { targetName: job.targetName, ok: false, error: 'Missing IP' };
        try {
            await sendRawTcp(ip, port, buildEscPosBuffer(job));
            return { targetName: job.targetName, ip, port, ok: true };
        } catch (err) {
            return { targetName: job.targetName, ip, port, ok: false, error: err.message };
        }
    }));
}

function startEmbeddedPrintBridge() {
    return new Promise((resolve) => {
        bridgeServer = http.createServer((req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
            if (req.method === 'GET' && req.url === '/health') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true, version: '1.0.0-desktop', embedded: true }));
                return;
            }
            if (req.method === 'POST' && (req.url === '/print-batch' || req.url === '/print')) {
                let body = '';
                req.on('data', c => { body += c; if (body.length > 2 * 1024 * 1024) req.destroy(); });
                req.on('end', async () => {
                    try {
                        const payload = JSON.parse(body || '{}');
                        const jobs = Array.isArray(payload.jobs) ? payload.jobs : (payload.ip ? [payload] : []);
                        const results = await runRawIpJobs(jobs);
                        const anyOk = results.some(r => r.ok);
                        res.writeHead(anyOk ? 200 : 502, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ ok: anyOk, results }));
                    } catch (err) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ ok: false, error: err.message }));
                    }
                });
                return;
            }
            res.writeHead(404); res.end();
        });
        bridgeServer.on('error', () => resolve());
        bridgeServer.listen(BRIDGE_PORT, HOST, () => resolve());
    });
}

// 3. ព្រីន HTML ស្វ័យប្រវត្តិ (Silent USB / Windows Thermal Printer — ស្គាល់អក្សរខ្មែរ, Logo, KHQR 100%)
function printHtmlSilently({ html, deviceName = '', paperMm = 80, title = 'SKM Receipt' }) {
    return new Promise((resolve) => {
        const printWin = new BrowserWindow({
            show: false,
            width: paperMm >= 150 ? 900 : 420,
            height: 700,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false
            }
        });

        const pageCss = paperMm >= 150
            ? `@page { size: A4 portrait; margin: 8mm; }`
            : `@page { size: ${paperMm}mm auto; margin: 0; }`;

        const fullDoc = `<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>${title}</title>
            <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Kantumruy+Pro:wght@400;700&display=swap" rel="stylesheet">
            <style>
                ${pageCss}
                * { box-sizing: border-box; }
                body { margin: 0; padding: 0; background: #fff; color: #000; font-family: 'Kantumruy Pro', 'Battambang', sans-serif; }
                #receipt-container { width: ${Math.max(48, paperMm - 4)}mm; max-width: 100%; margin: 0 auto; padding: 2mm; font-size: ${paperMm <= 60 ? 10 : 12}px; line-height: 1.4; }
                .print-dashed-line { border-top: 1px dashed #000; margin: 6px 0; }
                .skm-page-break { page-break-after: always; break-after: page; }
            </style></head><body><div id="receipt-container">${html || ''}</div></body></html>`;

        printWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(fullDoc));

        printWin.webContents.once('did-finish-load', () => {
            setTimeout(() => {
                const opts = {
                    silent: true,
                    printBackground: true,
                    margins: { marginType: 'none' }
                };
                if (deviceName && String(deviceName).trim()) {
                    opts.deviceName = String(deviceName).trim();
                }
                printWin.webContents.print(opts, (success, failureReason) => {
                    try { printWin.close(); } catch (e) {}
                    resolve({ ok: Boolean(success), error: failureReason || '' });
                });
            }, 350);
        });

        printWin.webContents.once('did-fail-load', (_, __, desc) => {
            try { printWin.close(); } catch (e) {}
            resolve({ ok: false, error: desc || 'Load failed' });
        });
    });
}

function getCurrentBranchFromUrl(urlStr) {
    try {
        const u = new URL(urlStr);
        return u.searchParams.get('branch') || 'branch_1';
    } catch (e) {
        return 'branch_1';
    }
}

function openCustomerDisplayWindow(branch = 'branch_1') {
    const displays = screen.getAllDisplays();
    const externalDisplay = displays.find(d => d.bounds.x !== 0 || d.bounds.y !== 0) || displays[0];

    if (displayWindow && !displayWindow.isDestroyed()) {
        displayWindow.focus();
        return;
    }

    displayWindow = new BrowserWindow({
        x: externalDisplay.bounds.x + 40,
        y: externalDisplay.bounds.y + 40,
        width: 1024,
        height: 768,
        title: 'SKM POS — Customer Display',
        icon: path.join(getWebRoot(), 'logo.png'),
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    if (displays.length > 1) {
        displayWindow.setFullScreen(true);
    }
    displayWindow.loadURL(`http://${HOST}:${WEB_PORT}/display.html?branch=${encodeURIComponent(branch)}`);
    displayWindow.on('closed', () => { displayWindow = null; });
}

function openKdsDesktopWindow(branch = 'branch_1') {
    if (kdsWindow && !kdsWindow.isDestroyed()) {
        kdsWindow.focus();
        return;
    }
    kdsWindow = new BrowserWindow({
        width: 1180,
        height: 780,
        title: 'SKM POS — Kitchen Display (KDS)',
        icon: path.join(getWebRoot(), 'logo.png'),
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    kdsWindow.loadURL(`http://${HOST}:${WEB_PORT}/kds.html?branch=${encodeURIComponent(branch)}`);
    kdsWindow.on('closed', () => { kdsWindow = null; });
}

function buildAppMenu() {
    const getBr = () => mainWindow ? getCurrentBranchFromUrl(mainWindow.webContents.getURL()) : 'branch_1';
    const template = [
        {
            label: '🏪 SKM POS',
            submenu: [
                {
                    label: '🏠 ទំព័រដើម (Welcome)',
                    click: () => mainWindow && mainWindow.loadURL(`http://${HOST}:${WEB_PORT}/welcome.html?branch=${encodeURIComponent(getBr())}`)
                },
                {
                    label: '🛒 ផ្ទាំងលក់ (POS System)',
                    accelerator: 'CmdOrCtrl+1',
                    click: () => mainWindow && mainWindow.loadURL(`http://${HOST}:${WEB_PORT}/index.html?branch=${encodeURIComponent(getBr())}`)
                },
                {
                    label: '⚙️ ការកំណត់ Admin Settings',
                    accelerator: 'CmdOrCtrl+2',
                    click: () => mainWindow && mainWindow.loadURL(`http://${HOST}:${WEB_PORT}/admin_settings.html?branch=${encodeURIComponent(getBr())}`)
                },
                { type: 'separator' },
                {
                    label: '🖥️ បើកអេក្រង់ភ្ញៀវ (Monitor ទី២ / Display)',
                    accelerator: 'CmdOrCtrl+D',
                    click: () => openCustomerDisplayWindow(getBr())
                },
                {
                    label: '👨‍🍳 បើកអេក្រង់ផ្ទះបាយ (KDS Window)',
                    accelerator: 'CmdOrCtrl+K',
                    click: () => openKdsDesktopWindow(getBr())
                },
                { type: 'separator' },
                { role: 'quit', label: 'ចាកចេញពីកម្មវិធី (Exit)' }
            ]
        },
        {
            label: '🖥️ អេក្រង់ (View)',
            submenu: [
                { role: 'reload', label: 'ផ្ទុកទំព័រឡើងវិញ (Reload)' },
                { role: 'forceReload', label: 'សម្អាត Cache & Reload' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'ពេញអេក្រង់ (Fullscreen F11)' },
                { role: 'zoomIn', label: 'ពង្រីកអក្សរ (Zoom In)' },
                { role: 'zoomOut', label: 'បង្រួមអក្សរ (Zoom Out)' },
                { role: 'resetZoom', label: 'ទំហំដើម (Reset Zoom)' },
                { type: 'separator' },
                { role: 'toggleDevTools', label: 'ឧបករណ៍បច្ចេកទេស (DevTools)' }
            ]
        },
        {
            label: '🖨️ ម៉ាស៊ីនព្រីន (Printers)',
            submenu: [
                {
                    label: '🔍 មើលបញ្ជីម៉ាស៊ីនព្រីនលើ PC នេះ',
                    click: async () => {
                        if (!mainWindow) return;
                        const printers = await mainWindow.webContents.getPrintersAsync();
                        const listTxt = printers.length
                            ? printers.map((p, i) => `${i + 1}. ${p.name}${p.isDefault ? '  [Default]' : ''}`).join('\n')
                            : 'រកមិនឃើញម៉ាស៊ីនព្រីនដែលបានដំឡើងលើ PC នេះទេ។';
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'ម៉ាស៊ីនព្រីនលើកុំព្យូទ័រ (Installed Printers)',
                            message: 'បញ្ជីម៉ាស៊ីនព្រីនដែល SKM POS អាចព្រីនស្វ័យប្រវត្តិ (Silent Print)៖',
                            detail: listTxt
                        });
                    }
                }
            ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createMainWindow() {
    const iconPath = path.join(getWebRoot(), 'logo.png');
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 820,
        minWidth: 1024,
        minHeight: 650,
        title: 'SKM INTEGRATE POS — Desktop App',
        icon: fs.existsSync(iconPath) ? iconPath : undefined,
        backgroundColor: '#0f172a',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.maximize();
    mainWindow.loadURL(`http://${HOST}:${WEB_PORT}/welcome.html?branch=branch_1`);

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith(`http://${HOST}:${WEB_PORT}`)) {
            return {
                action: 'allow',
                overrideBrowserWindowOptions: {
                    width: 1200,
                    height: 780,
                    icon: fs.existsSync(iconPath) ? iconPath : undefined,
                    autoHideMenuBar: true,
                    webPreferences: {
                        preload: path.join(__dirname, 'preload.js'),
                        contextIsolation: true,
                        nodeIntegration: false
                    }
                }
            };
        }
        shell.openExternal(url);
        return { action: 'deny' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
        if (displayWindow && !displayWindow.isDestroyed()) displayWindow.close();
        if (kdsWindow && !kdsWindow.isDestroyed()) kdsWindow.close();
    });
}

// 4. IPC Bridge Handlers for Web UI (pos.js & admin_settings.html)
ipcMain.handle('skm:get-printers', async () => {
    if (!mainWindow) return [];
    try {
        const list = await mainWindow.webContents.getPrintersAsync();
        return list.map(p => ({
            name: p.name,
            displayName: p.displayName || p.name,
            isDefault: Boolean(p.isDefault),
            status: p.status
        }));
    } catch (e) {
        return [];
    }
});

ipcMain.handle('skm:print-silent-html', async (_, payload) => {
    return await printHtmlSilently(payload || {});
});

ipcMain.handle('skm:print-raw-ip', async (_, payload) => {
    const jobs = payload && Array.isArray(payload.jobs) ? payload.jobs : [];
    const results = await runRawIpJobs(jobs);
    return { ok: results.some(r => r.ok), results };
});

ipcMain.handle('skm:open-customer-display', async (_, branch) => {
    openCustomerDisplayWindow(branch || 'branch_1');
    return { ok: true };
});

ipcMain.handle('skm:open-kds-window', async (_, branch) => {
    openKdsDesktopWindow(branch || 'branch_1');
    return { ok: true };
});

ipcMain.handle('skm:get-app-info', async () => ({
    isDesktopApp: true,
    version: app.getVersion(),
    platform: process.platform,
    webPort: WEB_PORT,
    bridgePort: BRIDGE_PORT
}));

app.whenReady().then(async () => {
    await startLocalWebServer();
    await startEmbeddedPrintBridge();
    buildAppMenu();
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
});

app.on('window-all-closed', () => {
    try { if (webServer) webServer.close(); } catch (e) {}
    try { if (bridgeServer) bridgeServer.close(); } catch (e) {}
    if (process.platform !== 'darwin') app.quit();
});
