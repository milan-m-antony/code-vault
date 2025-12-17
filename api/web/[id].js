const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  const id = (req.query && req.query.id) || (req.url && req.url.split('/').pop()) || '';
  const dir = path.join(process.cwd(), 'web', id.toString());

  try {
    const entries = await fs.readdir(dir);
    let out = `Program: ${id}\n\n`;

    for (const name of entries) {
      const p = path.join(dir, name);
      const stat = await fs.stat(p);
      if (stat.isFile()) {
        const content = await fs.readFile(p, 'utf8');
        out += `---- ${name} ----\n${content}\n\n`;
      }
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.statusCode = 200;
    res.end(out);
  } catch (err) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.statusCode = 404;
    res.end('Not found\n');
  }
};
