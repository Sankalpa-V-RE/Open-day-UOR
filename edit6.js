const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public/index.html');
let content = fs.readFileSync(file, 'utf-8');

// 1. Make the eyebrow bigger without changing the H1 title
const oldEyebrow = `<div class="hero-eyebrow" style="background: transparent; border: 1.5px solid rgba(212,175,55,0.6); color: var(--gold2); font-size: 1.8rem; font-weight: 800; padding: 0.5rem 1.5rem; margin: 0 auto 1.5rem auto; text-align: center; letter-spacing: 0.15em;">Open Day 2026</div>`;
const newEyebrow = `<div class="hero-eyebrow" style="background: rgba(212,175,55,0.1); border: 2px solid rgba(212,175,55,0.8); color: var(--gold2); font-size: clamp(2.2rem, 5vw, 3.2rem); font-weight: 900; padding: 0.6rem 2rem; margin: 0 auto 1.5rem auto; text-align: center; letter-spacing: 0.08em; display: inline-block; filter: drop-shadow(0 4px 15px rgba(212,175,55,0.4));">Open Day 2026</div>`;

if(content.includes(oldEyebrow)) {
    content = content.replace(oldEyebrow, newEyebrow);
} else {
    // try to match using substring
    content = content.replace(/<div class="hero-eyebrow" style="[^"]*">Open Day 2026<\/div>/g, newEyebrow);
}

// 2. Change formal attire text & visibility
const oldAttire = `<li>We kindly request all participants to dress in formal attire.</li>`;
const oldAttireAlternative = `<li style="margin-bottom: 6px;">We kindly request all participants to dress in formal attire.</li>`;

const newAttire = `<li style="margin-bottom: 8px; font-size: 1.05rem; color: var(--navy); font-weight: 600;">We kindly request all participants to dress in <span style="color: var(--success); font-weight: 800;">formal or smart casual attire</span>.</li>`;

if(content.includes(oldAttireAlternative)) {
    content = content.replace(oldAttireAlternative, newAttire);
} else if(content.includes(oldAttire)) {
    content = content.replace(oldAttire, newAttire);
}

// 3. Make Notice Box slightly more prominent
const oldNoticeStyle = `style="background: rgba(26,122,74,0.08); border-left: 4px solid var(--success); padding: 1.25rem 1.5rem; border-radius: 8px; margin: 1.5rem auto 2rem auto; max-width: 500px; font-size: 0.95rem; color: var(--navy); text-align: left;"`;
const newNoticeStyle = `style="background: #f0fdf4; border: 2px solid var(--success); border-left: 6px solid var(--success); padding: 1.5rem; border-radius: 8px; margin: 1.5rem auto 2rem auto; max-width: 550px; font-size: 1rem; color: var(--navy); text-align: left; box-shadow: 0 4px 15px rgba(26,122,74,0.15);"`;

if(content.includes(oldNoticeStyle)) {
    content = content.replace(oldNoticeStyle, newNoticeStyle);
}

// 4. Remove stray \n near Registration ID
content = content.replace('</div>\\n        <div class="success-id">', '</div>\\n        <div class="success-id">'); // just ensure it outputs real \n instead of string

const stray1 = '</div>\\\\n        <div class="success-id">';
if(content.includes(stray1)) {
    content = content.replace(stray1, '</div>\\n        <div class="success-id">');
}

fs.writeFileSync(file, content, 'utf-8');
console.log('Update finished!');
