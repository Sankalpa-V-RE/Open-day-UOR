const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public/index.html');
let content = fs.readFileSync(file, 'utf-8');

// Regex replace exactly the literal '\n' before '<div class="success-id">'
content = content.replace(/<\/div>\\n\s*<div class="success-id">/g, '</div>\\n        <div class="success-id">');
fs.writeFileSync(file, content, 'utf-8');
