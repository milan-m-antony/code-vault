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
  const pyDirRoot = path.join(process.cwd(), 'python');
  try {
    if (fs.existsSync(pyDirRoot)) {
      let pout = 'PYTHON PROJECTS\n\n';
      const entries = fs.readdirSync(pyDirRoot, { withFileTypes: true });
      const files = entries
        .filter(d => d.isFile())
        .map(d => d.name)
        .filter(n => (n.endsWith('.py') || n.endsWith('.txt')) && n.toLowerCase() !== 'index.txt')
        .sort();
      const dirs = entries.filter(d => d.isDirectory()).map(d => d.name).sort();

      if (files.length > 0) {
        pout += 'Files in python/:\n';
        files.forEach(f => pout += `  curl -L https://${host}/python/${f}\n`);
        pout += '\n';
      }

      if (dirs.length > 0) {
        dirs.forEach((d, i) => {
          pout += `${i + 1}) ${d}\n  Path: python/${d}/\n`;
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
    // When .hide_web exists, show python projects/files instead of the disabled message
    out = 'PYTHON PROJECTS\n\n';
    const pyDir = path.join(process.cwd(), 'python');
    try {
      const entries = fs.readdirSync(pyDir, { withFileTypes: true });
      const dirs = entries.filter(d => d.isDirectory()).map(d => d.name).sort();
      const files = entries.filter(d => d.isFile()).map(d => d.name).filter(n => n.endsWith('.py') || n.endsWith('.txt')).sort();

      if (files.length > 0) {
        out += 'Files in python/:\n';
        files.forEach(f => {
          out += `  curl -L https://${req.headers.host || 'code-vault-sable.vercel.app'}/python/${f}\n`;
        });
        out += '\n';
      }

      if (dirs.length > 0) {
        dirs.forEach((d, i) => {
          out += `${i + 1}) ${d}\n  Path: python/${d}/\n`;
          // list txt/py files inside each subdir
          try {
            const sub = fs.readdirSync(path.join(pyDir, d)).filter(n => n.endsWith('.py') || n.endsWith('.txt')).sort();
            if (sub.length === 0) out += '  (no source files)\n';
            else sub.forEach(f => out += `  curl -L https://${req.headers.host || 'code-vault-sable.vercel.app'}/python/${d}/${f}\n`);
          } catch (e) {
            out += '  (error reading directory)\n';
          }
          out += '\n';
        });
      }
    } catch (e) {
      out += 'No python folder found.\n';
    }

    out += `Updated: ${new Date().toISOString()}\n`;
    res.statusCode = 200;
    try {
      if (fs.existsSync(pyDirRoot)) {
        let pout = 'PYTHON PROJECTS\n\n';
        const entries = fs.readdirSync(pyDirRoot, { withFileTypes: true });
        // only show .txt viewable program files at root
        const files = entries
          .filter(d => d.isFile())
          .map(d => d.name)
          .filter(n => n.endsWith('.txt') && n.toLowerCase() !== 'index.txt')
          .sort();
        const dirs = entries.filter(d => d.isDirectory()).map(d => d.name).sort();

        // simple descriptions for known programs
        const descriptions = {
          'bank_account.txt': 'BankAccount class - simple banking operations',
          'list_compare.txt': 'Compare two integer lists: length, sum, common values'
        };

        if (files.length > 0) {
          files.forEach((f, i) => {
            const name = f.replace(/\.txt$/i, '');
            const desc = descriptions[f] || '';
            pout += `${i + 1}) ${name}` + (desc ? ` - ${desc}` : '') + `\n`;
            pout += `   curl -L https://${host}/python/${f}\n\n`;
          });
        }

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
