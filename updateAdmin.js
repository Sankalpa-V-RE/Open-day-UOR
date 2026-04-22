const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'admin.html');
let html = fs.readFileSync(file, 'utf-8');

// Replace Table headers
const oldHeaders = `
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>City / Address</th>
            <th>School</th>
            <th>Attending</th>
            <th>Distance</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Registered At</th>
          </tr>`;
          
const newHeaders = `
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>School / District</th>
            <th>Rank</th>
            <th>Participating</th>
            <th>Guardian</th>
            <th>Phone / Email</th>
            <th>Registered At</th>
          </tr>`;
html = html.replace(oldHeaders, newHeaders);

// Replace renderTable body
const oldRow = `      <tr>
        <td style="color:var(--muted);font-size:0.78rem">\${start + i + 1}</td>
        <td><strong>\${esc(r.full_name)}</strong></td>
        <td>\${esc(r.address)}</td>
        <td>\${esc(r.school_name)}</td>
        <td>
          <span class="badge \${r.attendance_confirmed == 1 ? 'badge-yes' : 'badge-no'}">
            \${r.attendance_confirmed == 1 ? '✓ Yes' : '— No'}
          </span>
        </td>
        <td>\${r.distance_km ? r.distance_km + ' km' : '—'}</td>
        <td>\${esc(r.contact_number)}</td>
        <td style="font-size:0.8rem">\${esc(r.email)}</td>
        <td style="font-size:0.78rem;color:var(--muted)">\${formatDate(r.registered_at)}</td>
      </tr>`;
      
const newRow = `      <tr>
        <td style="color:var(--muted);font-size:0.78rem">\${start + i + 1}</td>
        <td><strong>\${esc(r.full_name)}</strong></td>
        <td>\${esc(r.school_name)}<br><span style="font-size:0.75rem;color:var(--muted)">\${esc(r.district)}</span></td>
        <td>\${r.district_rank}</td>
        <td>
          <span class="badge \${r.participating == 1 ? 'badge-yes' : 'badge-no'}">
            \${r.participating == 1 ? '✓ Yes' : '— No'}
          </span>
        </td>
        <td>\${r.participating == 1 ? esc(r.guardian || 'None') : '—'}</td>
        <td>\${esc(r.mobile_number)}<br><span style="font-size:0.75rem;color:var(--muted)">\${esc(r.email)}</span></td>
        <td style="font-size:0.78rem;color:var(--muted)">\${formatDate(r.registered_at)}</td>
      </tr>`;
html = html.replace(oldRow, newRow);

// Change stats calculation
html = html.replace('const confirmed = allData.filter(r => r.attendance_confirmed == 1).length;', 'const confirmed = allData.filter(r => r.participating == 1).length;');
// Change avg distance calculation to just omit it or change label to Top 10 Ranks
html = html.replace('const avgDist = allData.length', 'const avgRank = allData.length');
html = html.replace('? (allData.reduce((s, r) => s + (r.distance_km || 0), 0) / allData.length).toFixed(1)', '? Math.round(allData.reduce((s, r) => s + (r.district_rank || 0), 0) / allData.length)');
html = html.replace('document.getElementById(\'s-avg-dist\').textContent = avgDist;', 'document.getElementById(\'s-avg-dist\').textContent = avgRank;');
html = html.replace('<div class="lbl">Avg Distance (km)</div>', '<div class="lbl">Avg Rank</div>');

// Change search filter logic
const oldSearch = `!q || [r.full_name, r.address, r.school_name, r.email, r.contact_number]
        .some(v => (v || '').toLowerCase().includes(q));`;
const newSearch = `!q || [r.full_name, r.district, r.school_name, r.email, r.mobile_number]
        .some(v => (v || '').toLowerCase().includes(q));`;
html = html.replace(oldSearch, newSearch);

html = html.replace('String(r.attendance_confirmed) === att;', 'String(r.participating) === att;');

fs.writeFileSync(file, html, 'utf-8');
console.log('Admin Update OK');
