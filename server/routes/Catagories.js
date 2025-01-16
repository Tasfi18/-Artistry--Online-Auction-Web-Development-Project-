const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router();

router.get('/', (req, res) => {
  const query = 'SELECT CategoryID, CategoryName FROM category';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).send('Failed to fetch categories');
    }

    res.status(200).json(results);
  });
});

module.exports = router;
