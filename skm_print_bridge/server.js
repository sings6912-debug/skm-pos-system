/**
 * SKM POS Local Silent Print Bridge (v1.0)
 * Zero-dependency Node.js server — បាញ់ ESC/POS ត្រង់ទៅម៉ាស៊ីនព្រីន LAN IP (Port 9100)
 * គាំទ្រ Multi-Printer (Cashier + Kitchen + Bar ក្នុងពេលតែមួយ), កាត់ក្រដាសអូតូ និងបើកថតដាក់លុយ
 * វិធីប្រើ៖ ដំឡើង Node.js រួចចុច ២ ដងលើ START_BRIDGE.bat (ឬ run: node server.js)
 */
const http = require('http');
const net = require('net');

const PORT = process.env.SKM_BRIDGE_PORT || 9191;
const HOST = '127.0.0.1';

// ESC/POS Control Bytes
const ESC = 0x1b;
const GS = 0x1d;
const CMD_INIT = Buffer.from([ESC, 0x40]);                    // Initialize printer
const CMD_ALIGN_LEFT = Buffer.from([ESC, 0x61, 0x00]);
const CMD_ALIGN_CENTER = Buffer.from([ESC, 0x61, 0x01]);
const CMD_BOLD_ON = Buffer.from([ESC, 0x45, 0x01]);
const CMD_BOLD_OFF = Buffer.from([ESC, 0x45, 0x00]);
const CMD_CUT_PARTIAL = Buffer.from([GS, 0x56, 0x42, 0x00]);  // Feed & Partial Cut
const CMD_OPEN_DRAWER = Buffer.from([ESC, 0x70, 0x00, 0x19, 0xfa]); // Kick Cash Drawer Pin 2

function buildEscPosBuffer(job) {
    const chunks = [CMD_INIT, CMD_ALIGN_LEFT];
    const text = String(job.text || '');
    const lines = text.split(/\r?\n/);

    lines.forEach((line, idx) => {
        if (idx === 0 || line.startsWith('*** ') || line.startsWith('TOTAL:')) {
            chunks.push(CMD_BOLD_ON);
            chunks.push(Buffer.from(line + '\n', 'utf8'));
            chunks.push(CMD_BOLD_OFF);
        } else {
            chunks.push(Buffer.from(line + '\n', 'utf8'));
        }
    });

    // Extra feed lines before cut
    chunks.push(Buffer.from('\n\n\n', 'utf8'));
    if (job.cutPaper !== false) chunks.push(CMD_CUT_PARTIAL);
    if (job.openDrawer) chunks.push(CMD_OPEN_DRAWER);
    return Buffer.concat(chunks);
}

function sendRawTcp(ip, port, buffer, timeoutMs = 4000) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        let finished = false;
        const done = (err) => {
            if (finished) return;
            finished = true;
            try { socket.destroy(); } catch (e) {}
            if (err) reject(err); else resolve();
        };
        socket.setTimeout(timeoutMs);
        socket.on('timeout', () => done(new Error(`Timeout connecting to ${ip}:${port}`)));
        socket.on('error', (err) => done(err));
        socket.connect(port, ip, () => {
            socket.write(buffer, () => {
                setTimeout(() => done(null), 120);
            });
        });
    });
}

function setCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer((req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, version: '1.0.0', host: HOST, port: PORT }));
        return;
    }

    if (req.method === 'POST' && (req.url === '/print-batch' || req.url === '/print')) {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > 2 * 1024 * 1024) req.destroy();
        });
        req.on('end', async () => {
            try {
                const payload = JSON.parse(body || '{}');
                const jobs = Array.isArray(payload.jobs) ? payload.jobs : (payload.ip ? [payload] : []);
                if (!jobs.length) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ ok: false, error: 'No print jobs provided' }));
                    return;
                }

                const results = await Promise.all(jobs.map(async (job) => {
                    const ip = String(job.ip || '').trim();
                    const port = parseInt(job.port) || 9100;
                    if (!ip) return { targetName: job.targetName, ok: false, error: 'Missing IP' };
                    try {
                        const buf = buildEscPosBuffer(job);
                        await sendRawTcp(ip, port, buf);
                        console.log(`✅ Printed [${job.targetName || 'Printer'}] -> ${ip}:${port}`);
                        return { targetName: job.targetName, ip, port, ok: true };
                    } catch (err) {
                        console.error(`❌ Print failed [${job.targetName}] -> ${ip}:${port}:`, err.message);
                        return { targetName: job.targetName, ip, port, ok: false, error: err.message };
                    }
                }));

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

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Not Found' }));
});

server.listen(PORT, HOST, () => {
    console.log('=======================================================');
    console.log(`🖨️  SKM POS Silent Print Bridge កំពុងដំណើរការ!`);
    console.log(`🌐  URL: http://${HOST}:${PORT}`);
    console.log(`✅  ត្រៀមបាញ់វិក្កយបត្រ & ផ្ទះបាយទៅ LAN IP (Port 9100)`);
    console.log('=======================================================');
});
