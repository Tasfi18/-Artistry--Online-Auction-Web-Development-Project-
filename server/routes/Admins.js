const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router();
const { verifyPassword, withoutPassword } = require('../lib/passwords');

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const query = 'SELECT * FROM admin WHERE Email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });

    const admin = results[0];
    if (!admin || !verifyPassword(password, admin.Password)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({ success: true, admin: withoutPassword(admin) });
  });
});

module.exports = router;
