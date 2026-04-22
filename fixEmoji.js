const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(file, 'utf-8');

// First replace the nav crest with the logo image
html = html.replace(
  '<div class="nav-crest">🎓</div>', 
  '<img src="images/logo.png" alt="University of Ruhuna Logo" style="height: 42px; margin-right: 12px; border-radius: 50%;" />'
);

// Emojis to strip out globally
const emojisToRemove = [
  '🏆', '🔬', '🗣️', '🗣', '️', '🏗️', '🏗', '⚡', '⚙️', '⚙', '🚢', '💻', 
  '🎓', '🎉', '🚀', '🌱', '✨', '✅', '🚫'
];

for (const emoji of emojisToRemove) {
  html = html.split(emoji).join('');
}

fs.writeFileSync(file, html, 'utf-8');
console.log('Emojis removed and logo updated!');
