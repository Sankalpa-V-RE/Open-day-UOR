const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public/index.html');
let content = fs.readFileSync(file, 'utf-8');

// Replace hero-eyebrow
content = content.replace(
  '<div class="hero-eyebrow" style="background: var(--gold); border-color: var(--gold); color: var(--navy); font-size: 1.2rem; font-weight: 800; padding: 0.6rem 2rem; box-shadow: 0 4px 15px rgba(212,175,55,0.4);">Open Day 2026</div>',
  '<div class="hero-eyebrow" style="background: transparent; border: 1.5px solid rgba(212,175,55,0.6); color: var(--gold2); font-size: 1.8rem; font-weight: 800; padding: 0.5rem 1.5rem; margin: 0 auto 1.5rem auto; text-align: center; letter-spacing: 0.15em;">Open Day 2026</div>'
);

// Insert Important Notice
const targetAnchor = '<p class="section-lead reveal">Secure your spot at the most exciting engineering open day in Sri Lanka. It takes less than 2 minutes.</p>';
const noticeHTML = `
    <div class="notice-box reveal" style="background: rgba(26,122,74,0.08); border-left: 4px solid var(--success); padding: 1.25rem 1.5rem; border-radius: 8px; margin: 2rem auto; max-width: 720px; font-size: 0.95rem; color: var(--navy);">
      <h4 style="margin-bottom: 8px; font-size: 1.05rem; font-weight: 700; color: var(--success); display: flex; align-items: center; gap: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        Important Notice
      </h4>
      <ul style="margin: 0; padding-left: 1.5rem; line-height: 1.6; color: var(--muted);">
        <li style="margin-bottom: 6px;">We kindly request all participants to dress in formal attire.</li>
        <li>Refreshments will be provided for all participants.</li>
      </ul>
    </div>
`;
content = content.replace(targetAnchor, targetAnchor + '\\n' + noticeHTML);

fs.writeFileSync(file, content, 'utf-8');
console.log('Done!');
