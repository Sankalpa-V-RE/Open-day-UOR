const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(file, 'utf-8');

// 1. Fix district_rank to be an integer field that encourages typing
html = html.replace('<input type="number" id="district_rank" placeholder="e.g. 15" min="1" />', '<input type="text" inputmode="numeric" pattern="[0-9]*" id="district_rank" placeholder="e.g. 15" />');

// 2. Fix the broken submitForm wrapper
const brokenSubmit = `    document.getElementById('rv-guardian').textContent = isParticipating && document.getElementById('guardian').value ? document.getElementById('guardian').value : 'None / N/A';
  }
        document.getElementById('form-body').style.display = 'none';
        document.querySelector('.form-progress').style.display = 'none';`;

const fixedSubmit = `    document.getElementById('rv-guardian').textContent = isParticipating && document.getElementById('guardian').value ? document.getElementById('guardian').value : 'None / N/A';
  }

  // ─── SUBMIT ───
  async function submitForm() {
    const btn = document.getElementById('submit-btn');
    const errDiv = document.getElementById('submit-error');
    errDiv.style.display = 'none';
    btn.disabled = true;
    document.getElementById('submit-text').textContent = '⏳ Submitting…';

    const distSel = document.getElementById('district_select').value;
    const distOtr = document.getElementById('district_other').value.trim();
    const payload = {
      full_name: document.getElementById('full_name').value.trim(),
      mobile_number: document.getElementById('mobile_number').value.trim(),
      email: document.getElementById('email').value.trim(),
      school_name: document.getElementById('school_name').value.trim(),
      district: (distSel === 'Other') ? distOtr : distSel,
      district_rank: parseInt(document.getElementById('district_rank').value, 10),
      participating: isParticipating,
      guardian: isParticipating ? document.getElementById('guardian').value : null
    };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        document.getElementById('form-body').style.display = 'none';
        document.querySelector('.form-progress').style.display = 'none';`;

html = html.replace(brokenSubmit, fixedSubmit);

fs.writeFileSync(file, html, 'utf-8');
console.log('Fixed submitForm and input types');
