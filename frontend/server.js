const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 5173;
const rootDir = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const requestPath = req.url.split('?')[0];
  let resolvedPath = requestPath;

  if (requestPath === '/' || requestPath === '/index.html') {
    resolvedPath = '/user.html';
  } else if (requestPath === '/admin' || requestPath === '/admin/' || requestPath === '/admin/login' || requestPath === '/admin/dashboard') {
    resolvedPath = '/admin.html';
  }

  const filePath = path.join(rootDir, resolvedPath);

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile(path.join(rootDir, 'index.html'), (indexError, indexContent) => {
          if (indexError) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Server error');
            return;
          }

          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(indexContent, 'utf-8');
        });
        return;
      }

      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  });
});

server.listen(port, () => {
  console.log(`Frontend running on http://localhost:${port}`);
});
