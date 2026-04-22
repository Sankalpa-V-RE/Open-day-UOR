const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(file, 'utf-8');

// Replace the <div class="form-body" id="form-body"> ... </div> block
const formBodyStart = html.indexOf('<div class="form-body" id="form-body">');
const formBodyEnd = html.indexOf('<!-- Success Screen -->');

if (formBodyStart > -1 && formBodyEnd > -1) {
  const newFormBody = `
      <div class="form-body" id="form-body">
        <!-- Step 1: Personal -->
        <div class="form-step active" id="step-1">
          <h3 class="step-heading">Personal Information</h3>
          <p class="step-sub">Let us know who you are.</p>
          <div class="field-group">
            <label>Full Name <span class="req">*</span></label>
            <input type="text" id="full_name" placeholder="e.g. Kavindu Perera" autocomplete="name" />
            <div class="field-error" id="err-full_name">Please enter your full name.</div>
          </div>
          <div class="field-row">
            <div class="field-group">
              <label>Contact Number <span class="req">*</span></label>
              <input type="tel" id="mobile_number" placeholder="07X XXXXXXX" autocomplete="tel" />
              <div class="field-error" id="err-mobile_number">Enter a valid phone number.</div>
            </div>
            <div class="field-group">
              <label>Email Address <span class="req">*</span></label>
              <input type="email" id="email" placeholder="you@example.com" autocomplete="email" />
              <div class="field-error" id="err-email">Enter a valid email address.</div>
            </div>
          </div>
          <div class="form-nav">
            <span></span>
            <button class="btn-next" onclick="nextStep(1)">Continue <span>→</span></button>
          </div>
        </div>

        <!-- Step 2: Academic -->
        <div class="form-step" id="step-2">
          <h3 class="step-heading">Academic Information</h3>
          <p class="step-sub">Tell us about your school.</p>
          <div class="field-group">
            <label>School Name <span class="req">*</span></label>
            <input type="text" id="school_name" placeholder="e.g. Mahinda College, Galle" />
            <div class="field-error" id="err-school_name">Please enter your school name.</div>
          </div>
          <div class="field-row">
            <div class="field-group">
              <label>District (Sat for G.C.E. A/L) <span class="req">*</span></label>
              <select id="district_select" class="form-select" onchange="toggleOtherDistrict()" style="width: 100%; padding: 12px 16px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: var(--text); background: var(--cream); outline: none;">
                <option value="">Select District</option>
                <option value="Galle">Galle</option>
                <option value="Matara">Matara</option>
                <option value="Hambanthota">Hambanthota</option>
                <option value="Other">Other</option>
              </select>
              <input type="text" id="district_other" placeholder="Specify your district" style="display:none; margin-top:10px;" />
              <div class="field-error" id="err-district">Please select or enter your district.</div>
            </div>
            <div class="field-group">
              <label>District Rank <span class="req">*</span></label>
              <input type="number" id="district_rank" placeholder="e.g. 15" min="1" />
              <div class="field-error" id="err-district_rank">Please enter a valid district rank.</div>
            </div>
          </div>
          <div class="form-nav">
            <button class="btn-back" onclick="prevStep(2)">← Back</button>
            <button class="btn-next" onclick="nextStep(2)">Continue →</button>
          </div>
        </div>

        <!-- Step 3: Event -->
        <div class="form-step" id="step-3">
          <h3 class="step-heading">Event Details</h3>
          <p class="step-sub">Attendance confirmation and guardian details.</p>
          <div class="field-group">
            <label>To participate on April 29 <span class="req">*</span></label>
            <div class="attendance-toggle">
              <button type="button" class="toggle-btn selected" id="att-yes" onclick="setParticipating(true)">
                <span>✅</span> Yes
              </button>
              <button type="button" class="toggle-btn" id="att-no" onclick="setParticipating(false)">
                <span>🚫</span> No
              </button>
            </div>
          </div>
          <div class="field-group" id="guardian_wrapper">
            <label>Accompanying guardian (if attending)</label>
            <select id="guardian" class="form-select" style="width: 100%; padding: 12px 16px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: var(--text); background: var(--cream); outline: none;">
              <option value="">None</option>
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-nav">
            <button class="btn-back" onclick="prevStep(3)">← Back</button>
            <button class="btn-next" onclick="nextStep(3)">Review →</button>
          </div>
        </div>

        <!-- Step 4: Review -->
        <div class="form-step" id="step-4">
          <h3 class="step-heading">Review & Confirm</h3>
          <p class="step-sub">Please check your details before submitting.</p>
          <div class="review-card">
            <div class="review-header">Personal Information</div>
            <div class="review-row"><span class="rl">Full Name</span><span class="rv" id="rv-name">—</span></div>
            <div class="review-row"><span class="rl">Phone</span><span class="rv" id="rv-phone">—</span></div>
            <div class="review-row"><span class="rl">Email</span><span class="rv" id="rv-email">—</span></div>
          </div>
          <div class="review-card">
            <div class="review-header">Academic Information</div>
            <div class="review-row"><span class="rl">School</span><span class="rv" id="rv-school">—</span></div>
            <div class="review-row"><span class="rl">District</span><span class="rv" id="rv-district">—</span></div>
            <div class="review-row"><span class="rl">District Rank</span><span class="rv" id="rv-rank">—</span></div>
          </div>
          <div class="review-card">
            <div class="review-header">Event Details</div>
            <div class="review-row"><span class="rl">Participating</span><span class="rv" id="rv-attend">—</span></div>
            <div class="review-row"><span class="rl">Guardian</span><span class="rv" id="rv-guardian">—</span></div>
          </div>
          <div id="submit-error" style="display:none;background:#fef0f0;border:1px solid #f5c5c5;border-radius:10px;padding:12px 16px;color:var(--error);font-size:0.88rem;margin-bottom:1rem;"></div>
          <div class="form-nav">
            <button class="btn-back" onclick="prevStep(4)">← Back</button>
            <button class="btn-submit" id="submit-btn" onclick="submitForm()">
              <span id="submit-text">🎓 Submit Registration</span>
            </button>
          </div>
        </div>
      </div>

      `;
  
  html = html.substring(0, formBodyStart) + newFormBody + html.substring(formBodyEnd);
}

// Update the javascript logic
// We can use string replacement to update the javascript
html = html.replace("let attendanceConfirmed = true;", "let isParticipating = true;");

// Fix setAttendance function
html = html.replace(`function setAttendance(val) {
    attendanceConfirmed = val;
    document.getElementById('att-yes').classList.toggle('selected', val);
    document.getElementById('att-no').classList.toggle('selected', !val);
  }`, `function setParticipating(val) {
    isParticipating = val;
    document.getElementById('att-yes').classList.toggle('selected', val);
    document.getElementById('att-no').classList.toggle('selected', !val);
    document.getElementById('guardian_wrapper').style.display = val ? 'block' : 'none';
    if(!val) document.getElementById('guardian').value = '';
  }
  function toggleOtherDistrict() {
    const sel = document.getElementById('district_select').value;
    document.getElementById('district_other').style.display = (sel === 'Other') ? 'block' : 'none';
  }`);
  
// Fix form validation step 1 2 3
const oldValidateStep = html.substring(html.indexOf('function validateStep(step) {'), html.indexOf('// ─── STEPS ───'));
const newValidateStep = `function validateStep(step) {
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
      const rank = parseInt(document.getElementById('district_rank').value);
      
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
  `;

html = html.replace(oldValidateStep, newValidateStep);

// Fix populateReview
const oldPopulate = html.substring(html.indexOf('function populateReview() {'), html.indexOf('// ─── SUBMIT ───'));
const newPopulate = `function populateReview() {
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
  `;
html = html.replace(oldPopulate, newPopulate);

// Fix submitForm payload
const oldSubmit = `const payload = {
      full_name: document.getElementById('full_name').value.trim(),
      address: document.getElementById('address').value.trim(),
      school_name: document.getElementById('school_name').value.trim(),
      attendance_confirmed: attendanceConfirmed,
      distance_km: parseFloat(document.getElementById('distance_km').value),
      contact_number: document.getElementById('contact_number').value.trim(),
      email: document.getElementById('email').value.trim(),
    };`;
const newSubmit = `
    const distSel = document.getElementById('district_select').value;
    const payload = {
      full_name: document.getElementById('full_name').value.trim(),
      mobile_number: document.getElementById('mobile_number').value.trim(),
      email: document.getElementById('email').value.trim(),
      school_name: document.getElementById('school_name').value.trim(),
      district: (distSel === 'Other') ? document.getElementById('district_other').value.trim() : distSel,
      district_rank: parseInt(document.getElementById('district_rank').value),
      participating: isParticipating,
      guardian: isParticipating ? document.getElementById('guardian').value : null
    };`;
html = html.replace(oldSubmit, newSubmit);

// Change Step Labels Array
html = html.replace('<span class="step-label" id="slabel-2">School</span>', '<span class="step-label" id="slabel-2">Academic</span>');
html = html.replace('<span class="step-label" id="slabel-3">Contact</span>', '<span class="step-label" id="slabel-3">Event</span>');

fs.writeFileSync(file, html, 'utf-8');
console.log('Update OK');
