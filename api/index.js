const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const webDir = path.join(process.cwd(), 'web');
  let projects = [];
  try {
    projects = fs.readdirSync(webDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort();
  } catch (e) {
    // no web directory
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  let host = req.headers.host || 'code-vault-sable.vercel.app';
  let out = 'CODE VAULT - WEB PROJECTS\n\n';
  if (projects.length === 0) {
    out += 'No web projects found.\n';
  } else {
    projects.forEach(p => {
      out += `${p}\n  curl -L https://${host}/web/${p}/index.html\n  curl -L https://${host}/web/${p}/style.css\n`;
    });
  }

  out += '\nNotes:\n- Use `-L` with curl to follow redirects (Vercel).\n- To view a file in the terminal, run the curl command above.\n';
  res.statusCode = 200;
  res.end(out);
};
