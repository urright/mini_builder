#!/usr/bin/env node
/**
 * Mini Builder Backend Server
 * Listens on port 3000
 * 
 * Endpoints:
 *   POST /favorites    - receives {action:'add'|'remove', id:'timestamp'}
 *   GET  /favorites   - returns current favorites list
 *   GET  /login       - returns auth info
 */

const http = require('http');
const url = require('url');
const crypto = require('crypto');

const PORT = 3000;
const AUTH = { username: 'admin', password: 'Mini728!' };

// In-memory favorites store
let favorites = [];

function authenticate(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) return false;
    const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
    return credentials === `${AUTH.username}:${AUTH.password}`;
}

function sendJSON(res, status, data) {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type'
    });
    res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;

    // CORS preflight
    if (req.method === 'OPTIONS') {
        sendJSON(res, 204, {});
        return;
    }

    // GET /login - verify credentials work
    if (pathname === '/login' && req.method === 'GET') {
        if (!authenticate(req)) {
            sendJSON(res, 401, { error: 'Unauthorized' });
            return;
        }
        sendJSON(res, 200, { ok: true, user: AUTH.username });
        return;
    }

    // GET /favorites - get current list
    if (pathname === '/favorites' && req.method === 'GET') {
        if (!authenticate(req)) {
            sendJSON(res, 401, { error: 'Unauthorized' });
            return;
        }
        sendJSON(res, 200, { favorites, count: favorites.length, timestamp: new Date().toISOString() });
        return;
    }

    // POST /favorites - add or remove
    if (pathname === '/favorites' && req.method === 'POST') {
        if (!authenticate(req)) {
            sendJSON(res, 401, { error: 'Unauthorized' });
            return;
        }
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { action, id } = JSON.parse(body);
                const ts = new Date().toISOString();
                if (action === 'add') {
                    if (!favorites.includes(id)) favorites.push(id);
                    console.log(`[${ts}] ⭐ Added: ${id}`);
                } else if (action === 'remove') {
                    favorites = favorites.filter(f => f !== id);
                    console.log(`[${ts}] ☆ Removed: ${id}`);
                }
                sendJSON(res, 200, { ok: true, favorites, action, id, timestamp: ts });
            } catch(e) {
                sendJSON(res, 400, { error: 'Invalid JSON' });
            }
        });
        return;
    }

    // GET / - health check
    if (pathname === '/' && req.method === 'GET') {
        sendJSON(res, 200, { 
            service: 'Mini Builder Backend',
            status: 'running',
            endpoints: ['GET /login', 'GET /favorites', 'POST /favorites'],
            favorites_count: favorites.length
        });
        return;
    }

    sendJSON(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║         Mini Builder Backend Server          ║
║══════════════════════════════════════════════║
║  Status:  ✅ Running                        ║
║  Port:    ${PORT}                              ║
║  User:    ${AUTH.username.padEnd(31)}║
║                                              ║
║  Endpoints:                                  ║
║    GET  /          Health check              ║
║    GET  /login     Verify credentials       ║
║    GET  /favorites  Get favorites list       ║
║    POST /favorites  Add/Remove favorite      ║
║                                              ║
║  Usage (add favorite):                       ║
║    curl -X POST http://localhost:${PORT}/favorites \\  ║
║      -u ${AUTH.username}:${AUTH.password} \\     ║
║      -H "Content-Type: application/json"    \\  ║
║      -d '{"action":"add","id":"202603271630"}'  ║
╚══════════════════════════════════════════════╝
    `);
});

server.on('error', err => {
    console.error('Server error:', err.message);
});
