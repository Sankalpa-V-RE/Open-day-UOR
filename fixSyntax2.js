const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(file, 'utf-8');

// Fix district_rank input type to text for typing
html = html.replace('<input type="number" id="district_rank" placeholder="e.g. 15" min="1" />', '<input type="text" inputmode="numeric" pattern="[0-9]*" id="district_rank" placeholder="e.g. 15" />');

// Entirely replace the script tag content for a pristine state
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.indexOf('</script>') + 9;

const newScript = `<script>
  // ─── STATE ───
  let currentStep = 1;
  let isParticipating = true;

  // ─── STATS ───
  fetch('/api/stats').then(r => r.json()).then(d => {
    if (d.total > 0) document.getElementById('stat-registered').textContent = d.total;
    else document.getElementById('stat-registered').textContent = '0';
  }).catch(() => { document.getElementById('stat-registered').textContent = '0'; });

  // ─── ATTENDANCE ───
  function setParticipating(val) {
    isParticipating = val;
    document.getElementById('att-yes').classList.toggle('selected', val);
    document.getElementById('att-no').classList.toggle('selected', !val);
    document.getElementById('guardian_wrapper').style.display = val ? 'block' : 'none';
    if (!val) document.getElementById('guardian').value = '';
  }
  
  function toggleOtherDistrict() {
    const sel = document.getElementById('district_select').value;
    document.getElementById('district_other').style.display = (sel === 'Other') ? 'block' : 'none';
  }

  // ─── VALIDATION ───
  function showError(id, msg) {
    const el = document.getElementById('err-' + id);
    const input = document.getElementById(id);
    if (el) { el.textContent = msg || el.textContent; el.classList.add('show'); }
    if (input) input.classList.add('error');
  }
  function clearError(id) {
    const el = document.getElementById('err-' + id);
    const input = document.getElementById(id);
    if (el) el.classList.remove('show');
    if (input) input.classList.remove('error');
  }

  function validateStep(step) {
    let valid = true;
    if (step === 1) {
      const name = document.getElementById('full_name').value.trim();
      const phone = document.getElementById('mobile_number').value.trim();
      const email = document.getElementById('email').value.trim();
      clearError('full_name'); clearError('mobile_number'); clearError('email');
      
      if (name.length < 2) { showError('full_name', 'Full name required.'); valid = false; }
      if (!/^[\\d\\s\\+\\-\\(\\)]{7,20}$/.test(phone)) { showError('mobile_number', 'Valid phone required.'); valid = false; }
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { showError('email', 'Valid email required.'); valid = false; }
    }
    if (step === 2) {
      const school = document.getElementById('school_name').value.trim();
      const distSel = document.getElementById('district_select').value;
      const distOtr = document.getElementById('district_other').value.trim();
      const dist = (distSel === 'Other') ? distOtr : distSel;
      const rank = parseInt(document.getElementById('district_rank').value, 10);
      
      clearError('school_name'); clearError('district'); clearError('district_rank');
      if (school.length < 2) { showError('school_name', 'School name required.'); valid = false; }
      if (!dist) { showError('district', 'District required.'); valid = false; }
      if (isNaN(rank) || rank < 1) { showError('district_rank', 'Valid rank required.'); valid = false; }
    }
    if (step === 3) {
      // Nothing strict to validate as guardian is optional and select exists.
    }
    return valid;
  }
  // ─── STEPS ───
  function goToStep(n) {
    document.getElementById('step-' + currentStep).classList.remove('active');
    document.getElementById('step-' + n).classList.add('active');

    for (let i = 1; i <= 4; i++) {
      const circle = document.getElementById('sc-' + i);
      const label = document.getElementById('slabel-' + i);
      if (i < n) { circle.className = 'step-circle done'; circle.textContent = '✓'; label.className = 'step-label done'; }
      else if (i === n) { circle.className = 'step-circle active'; circle.textContent = i; label.className = 'step-label active'; }
      else { circle.className = 'step-circle'; circle.textContent = i; label.className = 'step-label'; }
      if (i < 4) document.getElementById('sl-' + i).classList.toggle('done', i < n);
    }
    currentStep = n;
    if (n === 4) populateReview();
  }

  function nextStep(from) {
    if (!validateStep(from)) return;
    goToStep(from + 1);
  }
  function prevStep(from) { goToStep(from - 1); }

  // ─── REVIEW ───
  function populateReview() {
    document.getElementById('rv-name').textContent = document.getElementById('full_name').value.trim();
    document.getElementById('rv-phone').textContent = document.getElementById('mobile_number').value.trim();
    document.getElementById('rv-email').textContent = document.getElementById('email').value.trim();
    
    document.getElementById('rv-school').textContent = document.getElementById('school_name').value.trim();
    const distSel = document.getElementById('district_select').value;
    document.getElementById('rv-district').textContent = (distSel === 'Other') ? document.getElementById('district_other').value.trim() : distSel;
    document.getElementById('rv-rank').textContent = document.getElementById('district_rank').value;
    
    document.getElementById('rv-attend').textContent = isParticipating ? 'Yes' : 'No';
    document.getElementById('rv-guardian').textContent = isParticipating && document.getElementById('guardian').value ? document.getElementById('guardian').value : 'None / N/A';
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
        document.querySelector('.form-progress').style.display = 'none';
        document.getElementById('success-id-val').textContent = data.id;
        document.getElementById('success-screen').classList.add('show');
        // Refresh stat counter
        fetch('/api/stats').then(r=>r.json()).then(d=>{ document.getElementById('stat-registered').textContent=d.total; });
      } else {
        errDiv.textContent = data.message || 'Submission failed. Please try again.';
        errDiv.style.display = 'block';
        btn.disabled = false;
        document.getElementById('submit-text').textContent = '🎓 Submit Registration';
      }
    } catch {
      errDiv.textContent = 'Network error. Please check your connection and try again.';
      errDiv.style.display = 'block';
      btn.disabled = false;
      document.getElementById('submit-text').textContent = '🎓 Submit Registration';
    }
  }

  // ─── SCROLL REVEAL ───
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
</script>`;

html = html.substring(0, scriptStart) + newScript + html.substring(scriptEnd);
fs.writeFileSync(file, html, 'utf-8');
console.log('Fixed syntax and pristine script replacement!');
