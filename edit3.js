const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public/index.html');
let content = fs.readFileSync(file, 'utf-8');

// Replace hero eyebrow/title
const oldHero = `<div class="hero-eyebrow" style="background: transparent; border: 1.5px solid rgba(212,175,55,0.6); color: var(--gold2); font-size: 1.8rem; font-weight: 800; padding: 0.5rem 1.5rem; margin: 0 auto 1.5rem auto; text-align: center; letter-spacing: 0.15em;">Open Day 2026</div>`;
const oldHeroTitleStart = `<h1 class="hero-title">`;
const oldHeroTitleEnd = `</h1>`;

const startIdx = content.indexOf(oldHero);
if (startIdx !== -1) {
  const endIdx = content.indexOf(oldHeroTitleEnd, startIdx) + oldHeroTitleEnd.length;
  
  const newHeroContent = `<h1 class="hero-eyebrow" style="background: transparent; border: 1.5px solid rgba(212,175,55,0.6); color: var(--gold2); font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; padding: 1rem 2.5rem; margin: 0 auto 1.5rem auto; text-align: center; letter-spacing: 0.05em; display: inline-block; filter: drop-shadow(0 4px 15px rgba(212,175,55,0.4));">Open Day 2026</h1>
    <h3 class="hero-title" style="font-size: 1.8rem; font-weight: 400; margin-bottom: 2rem; opacity: 0.9;">
      Experience <span class="accent" style="color: var(--gold2); font-style: italic;">Engineering</span> at Ruhuna
    </h3>`;
  
  content = content.substring(0, startIdx) + newHeroContent + content.substring(endIdx);
}
fs.writeFileSync(file, content, 'utf-8');
console.log('Done!');
