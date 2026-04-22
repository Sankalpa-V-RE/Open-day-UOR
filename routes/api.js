const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDb, saveDb } = require('../db/database');

// POST /api/register
router.post('/register', [
  body('full_name').trim().isLength({ min: 2, max: 150 }).withMessage('Full name must be 2-150 characters'),
  body('address').trim().isLength({ min: 2, max: 300 }).withMessage('Address is required'),
  body('school_name').trim().isLength({ min: 2, max: 200 }).withMessage('School name is required'),
  body('attendance_confirmed').isBoolean().withMessage('Attendance confirmation required'),
  body('distance_km').isFloat({ min: 0, max: 5000 }).withMessage('Distance must be a positive number'),
  body('contact_number').trim().matches(/^[\d\s\+\-\(\)]{7,20}$/).withMessage('Invalid contact number'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const db = await getDb();
    const { full_name, address, school_name, attendance_confirmed, distance_km, contact_number, email } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    // Check duplicate email
    const existing = db.exec(`SELECT id FROM registrations WHERE email = ?`, [email]);
    if (existing.length > 0 && existing[0].values.length > 0) {
      return res.status(409).json({ success: false, message: 'This email is already registered.' });
    }

    db.run(
      `INSERT INTO registrations (id, full_name, address, school_name, attendance_confirmed, distance_km, contact_number, email, registered_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, full_name, address, school_name, attendance_confirmed ? 1 : 0, parseFloat(distance_km), contact_number, email, now]
    );
    saveDb();

    return res.json({ success: true, message: 'Registration successful!', id });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/admin/registrations  (simple password protection via query param)
router.get('/admin/registrations', async (req, res) => {
  const { password } = req.query;
  if (password !== (process.env.ADMIN_PASSWORD || 'openday2025')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const db = await getDb();
    const result = db.exec(`SELECT * FROM registrations ORDER BY registered_at DESC`);
    if (result.length === 0) return res.json({ success: true, data: [], total: 0 });
    const cols = result[0].columns;
    const rows = result[0].values.map(row => {
      const obj = {};
      cols.forEach((c, i) => obj[c] = row[i]);
      return obj;
    });
    return res.json({ success: true, data: rows, total: rows.length });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/export-csv
router.get('/admin/export-csv', async (req, res) => {
  const { password } = req.query;
  if (password !== (process.env.ADMIN_PASSWORD || 'openday2025')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const db = await getDb();
    const result = db.exec(`SELECT full_name, address, school_name, attendance_confirmed, distance_km, contact_number, email, registered_at FROM registrations ORDER BY registered_at DESC`);
    if (result.length === 0) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="registrations.csv"');
      return res.send('full_name,address,school_name,attendance_confirmed,distance_km,contact_number,email,registered_at\n');
    }
    const cols = result[0].columns;
    const rows = result[0].values;
    let csv = cols.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',') + '\n';
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="openday_registrations.csv"');
    return res.send(csv);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/stats (public stats for display)
router.get('/stats', async (req, res) => {
  try {
    const db = await getDb();
    const total = db.exec(`SELECT COUNT(*) as count FROM registrations`);
    const confirmed = db.exec(`SELECT COUNT(*) as count FROM registrations WHERE attendance_confirmed = 1`);
    return res.json({
      success: true,
      total: total[0]?.values[0][0] || 0,
      confirmed: confirmed[0]?.values[0][0] || 0
    });
  } catch {
    return res.json({ success: true, total: 0, confirmed: 0 });
  }
});

module.exports = router;
