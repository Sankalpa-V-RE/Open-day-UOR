const fs = require('fs');
const path = require('path');

const files = [
  'public/index.html',
  'public/admin.html',
  'server.js',
  'routes/api.js',
  'README.md'
];

for (const f of files) {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    content = content.replace(/2025/g, '2026');
    fs.writeFileSync(p, content, 'utf-8');
  }
}

// Make it more prominent
let indexHtml = fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf-8');
indexHtml = indexHtml.replace(
  'class="hero-eyebrow" style="background: rgba(212,175,55,0.2); border-color: var(--gold); color: var(--gold);"',
  'class="hero-eyebrow" style="background: var(--gold); border-color: var(--gold); color: var(--navy); font-size: 1.2rem; font-weight: 800; padding: 0.6rem 2rem; box-shadow: 0 4px 15px rgba(212,175,55,0.4);"'
);
fs.writeFileSync(path.join(__dirname, 'public/index.html'), indexHtml, 'utf-8');
console.log('Done 2026 update');
