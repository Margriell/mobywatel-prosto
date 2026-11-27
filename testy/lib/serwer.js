/* Mały serwer plików aplikacji (tylko na tym komputerze, adres 127.0.0.1). */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const TYPY = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8' };

function uruchomSerwer(katalog) {
  katalog = path.resolve(katalog);
  const serwer = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const plik = path.join(katalog, p);
    if (!plik.startsWith(katalog)) { res.writeHead(403); res.end(); return; }
    fs.readFile(plik, (blad, dane) => {
      if (blad) { res.writeHead(404); res.end('nie ma'); return; }
      res.writeHead(200, { 'Content-Type': TYPY[path.extname(plik)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(dane);
    });
  });
  return new Promise((ok) => {
    serwer.listen(0, '127.0.0.1', () => ok({ port: serwer.address().port, zamknij: () => new Promise((z) => serwer.close(z)) }));
  });
}

module.exports = { uruchomSerwer };
