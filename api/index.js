const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  const webDir = path.join(process.cwd(), 'web');

  try {
    const entries = await fs.readdir(webDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(d => d.name).sort();

    let out = 'CODE VAULT\nAvailable programs:\n\n';

    for (const id of dirs) {
      let title = id;
      try {
        const idxPath = path.join(webDir, id, 'index.html');
        const html = await fs.readFile(idxPath, 'utf8');
        const m = html.match(/<title>([^<]+)<\/title>/i);
        if (m && m[1]) title = m[1].trim();
      } catch (e) {
        // ignore, keep id as title
      }
      out += `[${id}] ${title}\n    curl <your-host>/web/${id}    (view files for ${id})\n\n`;
    }

    out += 'End of list\n';

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.statusCode = 200;
    res.end(out);
  } catch (err) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.statusCode = 500;
    res.end('Server error\n');
  }
};
