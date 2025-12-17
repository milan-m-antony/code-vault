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
  // Vercel may pass params as req.query.id (array) or the path
  // could be available in req.url when rewrites are used. Build a
  // robust `rel` from either source.
  let rel = '';
  if (req.query && req.query.id) {
    const id = req.query.id || [];
    const parts = Array.isArray(id) ? id : [id];
    rel = parts.join('/');
  } else {
    // attempt to extract path after '/api/web/' from req.url
    const prefix = '/api/web/';
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

  const base = path.join(process.cwd(), 'web');
  let full = path.join(base, rel);

  // If path is a directory, try index.txt first then index.html
  try {
    const stat = fs.existsSync(full) ? fs.statSync(full) : null;
    if (stat && stat.isDirectory()) {
      // prefer index.txt (plain-text source), then index.html
      const txt = path.join(full, 'index.txt');
      const html = path.join(full, 'index.html');
      if (fs.existsSync(txt)) full = txt;
      else full = html;
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

    // Fallback: fetch from GitHub raw URL (owner/repo/branch)
    const owner = 'milan-m-antony';
    const repo = 'code-vault';
    const branch = 'main';
    const https = require('https');
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/web/${rel}`;

    https.get(rawUrl, (ghRes) => {
      if (ghRes.statusCode >= 200 && ghRes.statusCode < 300) {
        // set content-type from response or infer from ext
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
