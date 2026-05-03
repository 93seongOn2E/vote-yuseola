const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const rootDir = __dirname;
const dataDir = path.join(rootDir, 'data');
const supportFile = path.join(dataDir, 'support.json');
const port = Number(process.env.PORT || 3000);
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

let writeQueue = Promise.resolve();

async function ensureSupportFile() {
    await fs.mkdir(dataDir, { recursive: true });

    try {
        await fs.access(supportFile);
    } catch {
        await fs.writeFile(supportFile, JSON.stringify({ count: 516 }, null, 2));
    }
}

async function readSupportCount() {
    await ensureSupportFile();
    const raw = await fs.readFile(supportFile, 'utf8');
    const data = JSON.parse(raw);
    const count = Number(data.count);

    return Number.isFinite(count) ? count : 516;
}

async function incrementSupportCount() {
    writeQueue = writeQueue.then(async () => {
        const count = await readSupportCount();
        const nextCount = count + 1;

        await fs.writeFile(supportFile, JSON.stringify({ count: nextCount }, null, 2));
        return nextCount;
    });

    return writeQueue;
}

function sendJson(response, statusCode, body) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    response.end(JSON.stringify(body));
}

async function handleApi(request, response) {
    if (request.url === '/api/support' && request.method === 'GET') {
        const count = await readSupportCount();
        sendJson(response, 200, { count });
        return true;
    }

    if (request.url === '/api/support' && request.method === 'POST') {
        const count = await incrementSupportCount();
        sendJson(response, 200, { count });
        return true;
    }

    return false;
}

async function serveStatic(request, response) {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);
    const pathname = decodeURIComponent(requestUrl.pathname);
    const requestedPath = pathname === '/' ? '/index.html' : pathname;
    const filePath = path.normalize(path.join(rootDir, requestedPath));

    if (!filePath.startsWith(rootDir)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
    }

    try {
        const content = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();

        response.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'application/octet-stream'
        });
        response.end(content);
    } catch {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
    }
}

const server = http.createServer(async (request, response) => {
    try {
        if (await handleApi(request, response)) {
            return;
        }

        await serveStatic(request, response);
    } catch (error) {
        console.error(error);
        sendJson(response, 500, { error: 'server_error' });
    }
});

server.listen(port, () => {
    console.log(`VCompany election site running at http://localhost:${port}`);
});

