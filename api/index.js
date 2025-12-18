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

  // If a top-level `python/` folder exists, show python programs at root
  try {
    // If a top-level `c/` folder exists, show C projects at root
    const cDirRoot = path.join(process.cwd(), 'c');
    if (fs.existsSync(cDirRoot)) {
      let cout = 'C PROJECTS\n\n';
      const entriesC = fs.readdirSync(cDirRoot, { withFileTypes: true });
      const filesC = entriesC
        .filter(d => d.isFile())
        .map(d => d.name)
        .filter(n => (n.endsWith('.txt') || n.endsWith('.c')) && n.toLowerCase() !== 'index.txt')
        .sort();
      const dirsC = entriesC.filter(d => d.isDirectory()).map(d => d.name).sort();

      filesC.forEach((f, i) => {
        const name = f.replace(/\.(txt|c)$/i, '');
        cout += `------------------------------\n`;
        cout += `${i + 1}. ${name}\n`;
        cout += `\n`;
        cout += `View: curl -L https://${host}/c/${f}\n`;
        cout += `------------------------------\n\n`;
      });

      if (dirsC.length > 0) {
        dirsC.forEach((d, i) => {
          cout += `${filesC.length + i + 1}) ${d}\n  Path: c/${d}/\n`;
          try {
            const sub = fs.readdirSync(path.join(cDirRoot, d))
              .filter(n => (n.endsWith('.c') || n.endsWith('.txt')) && n.toLowerCase() !== 'index.txt')
              .sort();
            if (sub.length === 0) cout += '  (no source files)\n';
            else sub.forEach(f => cout += `  curl -L https://${host}/c/${d}/${f}\n`);
          } catch (e) {
            cout += '  (error reading directory)\n';
          }
          cout += '\n';
        });
      }

      cout += `Updated: ${new Date().toISOString()}\n`;
      res.statusCode = 200;
      res.end(cout);
      return;
    }

    // If a top-level `python/` folder exists, show python programs at root
    const pyDirRoot = path.join(process.cwd(), 'python');
    if (fs.existsSync(pyDirRoot)) {
      let pout = 'PYTHON PROJECTS\n\n';
      const entries = fs.readdirSync(pyDirRoot, { withFileTypes: true });
      const files = entries
        .filter(d => d.isFile())
        .map(d => d.name)
        .filter(n => n.endsWith('.txt') && n.toLowerCase() !== 'index.txt')
        .sort();
      const dirs = entries.filter(d => d.isDirectory()).map(d => d.name).sort();

      const descriptions = {
        'bank_account.txt': 'BankAccount class - simple banking operations',
        'list_compare.txt': 'Compare two integer lists: length, sum, common values'
      };

      files.forEach((f, i) => {
        const name = f.replace(/\.txt$/i, '');
        const desc = descriptions[f] || '';
        pout += `------------------------------\n`;
        pout += `${i + 1}. ${name}\n`;
        if (desc) pout += `${desc}\n`;
        pout += `\n`;
        pout += `View: curl -L https://${host}/python/${f}\n`;
        pout += `------------------------------\n\n`;
      });

      if (dirs.length > 0) {
        dirs.forEach((d, i) => {
          pout += `${files.length + i + 1}) ${d}\n  Path: python/${d}/\n`;
          try {
            const sub = fs.readdirSync(path.join(pyDirRoot, d))
              .filter(n => (n.endsWith('.py') || n.endsWith('.txt')) && n.toLowerCase() !== 'index.txt')
              .sort();
            if (sub.length === 0) pout += '  (no source files)\n';
            else sub.forEach(f => pout += `  curl -L https://${host}/python/${d}/${f}\n`);
          } catch (e) {
            pout += '  (error reading directory)\n';
          }
          pout += '\n';
        });
      }

      pout += `Updated: ${new Date().toISOString()}\n`;
      res.statusCode = 200;
      res.end(pout);
      return;
    }
  } catch (e) {
    // fall through to web listing if python folder read fails
  }

  // friendly names for projects (folder -> display name)
    const names = { '1': 'Calculator', '2': 'Exam question', '3': 'PHP CRUD (student)', '4': 'Curriculum Vitae (Milan M Antony)' };

    let out = 'CODE VAULT - WEB PROJECTS\n\n';
    // temporary disable toggle: create a file named `.hide_web` in the repo root
    // to hide the web listing (useful when you want to add/modify projects privately).
    const hideFile = path.join(process.cwd(), '.hide_web');
    if (fs.existsSync(hideFile)) {
      out += 'Web listing temporarily disabled (create .hide_web to hide).\n\n';
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
    out += `Updated: ${new Date().toISOString()}\n`;
    res.statusCode = 200;
    res.end(out);
  };
