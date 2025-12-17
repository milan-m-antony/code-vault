const fs = require('fs');
const path = require('path');

function contentTypeFor(ext) {
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    default: return 'text/plain; charset=utf-8';
  }
}

module.exports = (req, res) => {
  const id = req.query.id || [];
  const parts = Array.isArray(id) ? id : [id];
  const rel = parts.join('/');

  if (rel.includes('..')) {
    res.statusCode = 400;
    res.end('Invalid path');
    return;
  }

  const base = path.join(process.cwd(), 'web');
  let full = path.join(base, rel);

  // If path is a directory, try index.html
  try {
    const stat = fs.existsSync(full) ? fs.statSync(full) : null;
    if (stat && stat.isDirectory()) {
      full = path.join(full, 'index.html');
    }
    if (!fs.existsSync(full)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('NOT_FOUND');
      return;
    }

    const ext = path.extname(full).toLowerCase();
    res.statusCode = 200;
    res.setHeader('Content-Type', contentTypeFor(ext));
    const stream = fs.createReadStream(full);
    stream.pipe(res);
    stream.on('error', () => {
      res.statusCode = 500;
      res.end('Server error');
    });
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Server error');
  }
};
