const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const query = 'SELECT * FROM admin WHERE Email = ? AND Password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({ success: true, admin: results[0] });
  });
});

module.exports = router;
