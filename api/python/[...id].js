const fs = require('fs');
const path = require('path');

function contentTypeFor(ext) {
  switch (ext) {
    case '.py': return 'text/x-python; charset=utf-8';
    case '.txt': return 'text/plain; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    default: return 'text/plain; charset=utf-8';
  }
}

module.exports = (req, res) => {
  let rel = '';
  if (req.query && req.query.id) {
    const id = req.query.id || [];
    const parts = Array.isArray(id) ? id : [id];
    rel = parts.join('/');
  } else {
    const prefix = '/api/python/';
    const urlPath = req.url || '';
    const idx = urlPath.indexOf(prefix);
    if (idx >= 0) rel = decodeURIComponent(urlPath.slice(idx + prefix.length));
    else rel = urlPath.replace(/^\//, '');
  }

  if (rel.includes('..')) {
    res.statusCode = 400;
    res.end('Invalid path');
    return;
  }

  const base = path.join(process.cwd(), 'python');
  let full = path.join(base, rel);

  try {
    const stat = fs.existsSync(full) ? fs.statSync(full) : null;
    if (stat && stat.isDirectory()) {
      const txt = path.join(full, 'index.txt');
      if (fs.existsSync(txt)) full = txt;
    }

    if (fs.existsSync(full)) {
      const ext = path.extname(full).toLowerCase();
      res.statusCode = 200;
      res.setHeader('Content-Type', contentTypeFor(ext));
      const stream = fs.createReadStream(full);
      stream.pipe(res);
      stream.on('error', () => {
        res.statusCode = 500;
        res.end('Server error');
      });
      return;
    }

    // fallback to GitHub raw
    const owner = 'milan-m-antony';
    const repo = 'code-vault';
    const branch = 'main';
    const https = require('https');
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/python/${rel}`;

    https.get(rawUrl, (ghRes) => {
      if (ghRes.statusCode >= 200 && ghRes.statusCode < 300) {
        const ext = path.extname(rel).toLowerCase();
        const ctype = ghRes.headers['content-type'] || contentTypeFor(ext);
        res.statusCode = 200;
        res.setHeader('Content-Type', ctype);
        ghRes.pipe(res);
      } else if (ghRes.statusCode === 404) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('NOT_FOUND');
      } else {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Upstream error');
      }
    }).on('error', () => {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Upstream error');
    });

  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Server error');
  }
};
const fs = require('fs');
const path = require('path');

function contentTypeFor(ext) {
  switch (ext) {
    case '.py': return 'text/plain; charset=utf-8';
    case '.txt': return 'text/plain; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    default: return 'text/plain; charset=utf-8';
  }
}

module.exports = (req, res) => {
  let rel = '';
  if (req.query && req.query.id) {
    const id = req.query.id || [];
    const parts = Array.isArray(id) ? id : [id];
    rel = parts.join('/');
  } else {
    const prefix = '/api/python/';
    const urlPath = req.url || '';
    const idx = urlPath.indexOf(prefix);
    if (idx >= 0) rel = decodeURIComponent(urlPath.slice(idx + prefix.length));
    else rel = urlPath.replace(/^\//, '');
  }

  if (rel.includes('..')) {
    res.statusCode = 400;
    res.end('Invalid path');
    return;
  }

  const base = path.join(process.cwd(), 'python');
  let full = path.join(base, rel);

  try {
    const stat = fs.existsSync(full) ? fs.statSync(full) : null;
    if (stat && stat.isDirectory()) {
      const idxTxt = path.join(full, 'index.txt');
      if (fs.existsSync(idxTxt)) full = idxTxt;
      else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('NOT_FOUND');
        return;
      }
    }

    if (fs.existsSync(full)) {
      const ext = path.extname(full).toLowerCase();
      res.statusCode = 200;
      res.setHeader('Content-Type', contentTypeFor(ext));
      const stream = fs.createReadStream(full);
      stream.pipe(res);
      stream.on('error', () => {
        res.statusCode = 500;
        res.end('Server error');
      });
      return;
    }

    // Fallback to GitHub raw
    const owner = 'milan-m-antony';
    const repo = 'code-vault';
    const branch = 'main';
    const https = require('https');
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/python/${rel}`;

    https.get(rawUrl, (ghRes) => {
      if (ghRes.statusCode >= 200 && ghRes.statusCode < 300) {
        const ext = path.extname(rel).toLowerCase();
        const ctype = ghRes.headers['content-type'] || contentTypeFor(ext);
        res.statusCode = 200;
        res.setHeader('Content-Type', ctype);
        ghRes.pipe(res);
      } else if (ghRes.statusCode === 404) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('NOT_FOUND');
      } else {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Upstream error');
      }
    }).on('error', () => {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Upstream error');
    });

  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Server error');
  }
};
