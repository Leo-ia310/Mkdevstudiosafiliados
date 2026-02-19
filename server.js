const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT       = 3000;
const SRC_DIR    = path.join(__dirname, 'src');
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  // Archivos en /public/ se sirven directamente
  let filePath;
  if (urlPath.startsWith('/public/')) {
    filePath = path.join(PUBLIC_DIR, urlPath.replace('/public/', '/'));
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
  } else {
    filePath = path.join(SRC_DIR, urlPath);
    if (!filePath.startsWith(SRC_DIR)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
  }

  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h2>404 Not Found</h2>');
      return;
    }
    res.writeHead(200, {
      'Content-Type':                mime,
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('MK Dev Studio server running on http://localhost:' + PORT);
});
