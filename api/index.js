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
  const names = { '1': 'Calculator', '2': 'Exam question', '3': 'PHP CRUD (student)', '4': 'Curriculum Vitae (Milan M Antony)' };

  let out = 'CODE VAULT - WEB PROJECTS\n\n';
  // temporary disable toggle: create a file named `.hide_web` in the repo root
  // to hide the web listing (useful when you want to add/modify projects privately).
  const hideFile = path.join(process.cwd(), '.hide_web');
  if (fs.existsSync(hideFile)) {
    out += 'Web listing is temporarily disabled.\n';
    out += 'To re-enable the listing, remove the file `.hide_web` from the project root.\n\n';
    out += 'You can still access individual files directly if you know their URLs.\n';
    out += `Updated: ${new Date().toISOString()}\n`;
    res.statusCode = 200;
    res.end(out);
    return;
  }

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
  // runtime timestamp to help force fresh content and debugging
  out += `Updated: ${new Date().toISOString()}\n`;
  res.statusCode = 200;
  res.end(out);
};
