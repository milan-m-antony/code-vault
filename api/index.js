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
      const projectDir = path.join(webDir, p);
      
      // list all .txt files in this project
      let txtFiles = [];
      try {
        const files = fs.readdirSync(projectDir);
        txtFiles = files.filter(f => f.endsWith('.txt')).sort();
      } catch (e) {
        // error reading project dir
      }

      out += `${idx + 1}) ${display}\n  Path: web/${p}/\n`;
      if (txtFiles.length === 0) {
        out += '  (no source files)\n';
      } else {
        txtFiles.forEach(f => {
          out += `  curl -L https://${host}/web/${p}/${f}\n`;
        });
      }
      out += '\n';
    });
  }

  out += '\nNotes:\n- Use -L with curl to follow redirects (Vercel).\n- If the site cannot serve static files, the API will fallback to the GitHub raw file URLs so the code still displays.\n';
  res.statusCode = 200;
  res.end(out);
};
