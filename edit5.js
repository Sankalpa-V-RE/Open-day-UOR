const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public/index.html');
let content = fs.readFileSync(file, 'utf-8');

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

const targetAnchor = '<div class="success-id">';
if(content.includes(targetAnchor)) {
    content = content.replace(targetAnchor, noticeBoxSuccess + '\\n        ' + targetAnchor);
}

fs.writeFileSync(file, content, 'utf-8');
console.log('Added to success screen');
