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
  res.setHeader('Cache-Control', 'no-cache');
  const host = req.headers.host || 'code-vault-sable.vercel.app';

  // friendly names for projects (folder -> display name)
  const names = { '1': 'Calculator', '2': 'Exam question' };

  let out = 'CODE VAULT - WEB PROJECTS\n\n';
  if (projects.length === 0) {
    out += 'No web projects found.\n';
  } else {
    projects.forEach((p, idx) => {
      const display = names[p] || `project-${p}`;
      out += `${idx + 1}) ${display}\n  Path: web/${p}/\n`;
      // list available .txt files for this project
      try {
        const files = fs.readdirSync(path.join(webDir, p));
        files.filter(f => f.endsWith('.txt')).forEach(f => {
          out += `  curl -L https://${host}/web/${p}/${f}\n`;
        });
      } catch (e) {
        // ignore
      }
      out += `\n`;
    });
  }

  out += '\nNotes:\n- Use -L with curl to follow redirects (Vercel).\n- If the site cannot serve static files, the API will fallback to the GitHub raw file URLs so the code still displays.\n';
  res.statusCode = 200;
  res.end(out);
};
