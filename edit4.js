const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public/index.html');
let content = fs.readFileSync(file, 'utf-8');

// 1. Revert Hero Section
const newHeroContent = `<h1 class="hero-eyebrow" style="background: transparent; border: 1.5px solid rgba(212,175,55,0.6); color: var(--gold2); font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; padding: 1rem 2.5rem; margin: 0 auto 1.5rem auto; text-align: center; letter-spacing: 0.05em; display: inline-block; filter: drop-shadow(0 4px 15px rgba(212,175,55,0.4));">Open Day 2026</h1>
    <h3 class="hero-title" style="font-size: 1.8rem; font-weight: 400; margin-bottom: 2rem; opacity: 0.9;">
      Experience <span class="accent" style="color: var(--gold2); font-style: italic;">Engineering</span> at Ruhuna
    </h3>`;

const revertedHeroContent = `<div class="hero-eyebrow" style="background: transparent; border: 1.5px solid rgba(212,175,55,0.6); color: var(--gold2); font-size: 1.8rem; font-weight: 800; padding: 0.5rem 1.5rem; margin: 0 auto 1.5rem auto; text-align: center; letter-spacing: 0.15em;">Open Day 2026</div>
    <h1 class="hero-title">
      Experience<br>
      <span class="accent">Engineering</span><br>
      at Ruhuna
    </h1>`;

content = content.replace(newHeroContent, revertedHeroContent);

// 2. Remove notice and \n from form start
const noticeTextSnippet = `\\n
    <div class="notice-box reveal" style="background: rgba(26,122,74,0.08); border-left: 4px solid var(--success); padding: 1.25rem 1.5rem; border-radius: 8px; margin: 2rem auto; max-width: 720px; font-size: 0.95rem; color: var(--navy);">
      <h4 style="margin-bottom: 8px; font-size: 1.05rem; font-weight: 700; color: var(--success); display: flex; align-items: center; gap: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        Important Notice
      </h4>
      <ul style="margin: 0; padding-left: 1.5rem; line-height: 1.6; color: var(--muted);">
        <li style="margin-bottom: 6px;">We kindly request all participants to dress in formal attire.</li>
        <li>Refreshments will be provided for all participants.</li>
      </ul>
    </div>`;

if (content.includes(noticeTextSnippet)) {
   content = content.replace(noticeTextSnippet, '');
} else {
   // Fallback using substring search
   const noticeStartStr = '<div class="notice-box reveal"';
   const noticeEndStr = '</div>\\n\\n\\n    <div class="form-wrapper reveal"';
   const idx1 = content.indexOf(noticeStartStr);
   if (idx1 !== -1) {
       const sliceToRemove = content.substring(idx1 - 3, content.indexOf('</div>', idx1 + 100) + 6);
       content = content.replace(sliceToRemove, '');
   }
}

// Ensure the stray \n is removed from line 805
const strayNewline = `less than 2 minutes.</p>\\n`;
if (content.includes(strayNewline)) {
   content = content.replace(strayNewline, `less than 2 minutes.</p>`);
}

// 3. Move notice to Success Screen
const successMessageHTML = `<p class="success-msg">
          Thank you for registering for the Faculty of Engineering Open Day 2026.<br>
          We look forward to welcoming you at the University of Ruhuna. 
        </p>`;

const noticeBoxSuccess = `
        <div class="notice-box" style="background: rgba(26,122,74,0.08); border-left: 4px solid var(--success); padding: 1.25rem 1.5rem; border-radius: 8px; margin: 1.5rem auto 2rem auto; max-width: 500px; font-size: 0.95rem; color: var(--navy); text-align: left;">
          <h4 style="margin-bottom: 8px; font-size: 1.05rem; font-weight: 700; color: var(--success); display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            Important Notice
          </h4>
          <ul style="margin: 0; padding-left: 1.5rem; line-height: 1.6; color: var(--muted);">
            <li style="margin-bottom: 6px;">We kindly request all participants to dress in formal attire.</li>
            <li>Refreshments will be provided for all participants.</li>
          </ul>
        </div>`;

if(content.includes(successMessageHTML)) {
    content = content.replace(successMessageHTML, successMessageHTML + noticeBoxSuccess);
}

fs.writeFileSync(file, content, 'utf-8');
console.log('Update finished!');
