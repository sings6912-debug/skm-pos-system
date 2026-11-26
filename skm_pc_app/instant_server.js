/**
 * SKM POS Instant PC App Server (Zero npm install required!)
 * បើក SKM POS ជា App លើ PC ភ្លាមៗ + បង្កប់ម៉ាស៊ីនព្រីន LAN IP:9100 ក្នុងពេលតែមួយ
 */
const http = require('http');
const net = require('net');
const fs = require('fs');
const path = require('path');

const WEB_PORT = 4580;
const BRIDGE_PORT = 9191;
const HOST = '127.0.0.1';
const WEB_ROOT = path.resolve(__dirname, '..');

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
    const cleanUrl = (req.url || '/').split('?')[0];
    let rel = decodeURIComponent(cleanUrl === '/' ? '/welcome.html' : cleanUrl);
    rel = path.normalize(rel).replace(/^(\.\.[/\\])+/, '');
    let full = path.join(WEB_ROOT, rel);
    if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) full = path.join(WEB_ROOT, 'welcome.html');
    const ext = path.extname(full).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(full).pipe(res);
}).listen(WEB_PORT, HOST, () => {
    console.log(`✅ SKM POS PC App Server running at http://${HOST}:${WEB_PORT}`);
});

// Embedded LAN IP:9100 Print Bridge
const CMD_INIT = Buffer.from([0x1b, 0x40]);
const CMD_CUT = Buffer.from([0x1d, 0x56, 0x42, 0x00]);
const CMD_DRAWER = Buffer.from([0x1b, 0x70, 0x00, 0x19, 0xfa]);

function sendTcp(ip, port, buf) {
    return new Promise((resolve, reject) => {
        const s = new net.Socket();
        let done = false;
        const fin = (e) => { if (done) return; done = true; try { s.destroy(); } catch (_) {} e ? reject(e) : resolve(); };
        s.setTimeout(4000);
        s.on('timeout', () => fin(new Error('Timeout')));
        s.on('error', fin);
        s.connect(port, ip, () => s.write(buf, () => setTimeout(() => fin(null), 120)));
    });
}

http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, version: '1.0.0-instant' }));
        return;
    }
    if (req.method === 'POST' && (req.url === '/print-batch' || req.url === '/print')) {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', async () => {
            try {
                const p = JSON.parse(body || '{}');
                const jobs = Array.isArray(p.jobs) ? p.jobs : (p.ip ? [p] : []);
                const results = await Promise.all(jobs.map(async (j) => {
                    try {
                        const chunks = [CMD_INIT, Buffer.from(String(j.text || '') + '\n\n\n', 'utf8')];
                        if (j.cutPaper !== false) chunks.push(CMD_CUT);
                        if (j.openDrawer) chunks.push(CMD_DRAWER);
                        await sendTcp(String(j.ip).trim(), parseInt(j.port) || 9100, Buffer.concat(chunks));
                        return { ok: true, targetName: j.targetName };
                    } catch (err) {
                        return { ok: false, targetName: j.targetName, error: err.message };
                    }
                }));
                res.writeHead(results.some(r => r.ok) ? 200 : 502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: results.some(r => r.ok), results }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: false, error: e.message }));
            }
        });
        return;
    }
    res.writeHead(404); res.end();
}).listen(BRIDGE_PORT, HOST, () => {
    console.log(`🖨️  SKM Print Bridge running at http://${HOST}:${BRIDGE_PORT}`);
});
