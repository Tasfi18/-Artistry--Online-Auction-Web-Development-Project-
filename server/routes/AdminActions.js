const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router();

router.post('/verify/artist/:id', (req, res) => {
  const artistID = req.params.id;
  const query = 'UPDATE artists SET Verified = 1 WHERE artistID = ?';

  db.query(query, [artistID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });

    res.json({ success: true, message: 'artist verified successfully' });
  });
});

router.post('/verify/buyer/:id', (req, res) => {
  const buyerID = req.params.id;
  const query = 'UPDATE buyers SET Verified = 1 WHERE BuyerID = ?';

  db.query(query, [buyerID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });

    res.json({ success: true, message: 'Buyer verified successfully' });
  });
});


router.post('/verify/artwork/:id', (req, res) => {
  const artworkID = req.params.id;
  const query = 'UPDATE artworks SET ApprovalStatus = "Approved" WHERE ArtworkID = ?';

  db.query(query, [artworkID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });

    res.json({ success: true, message: 'Artwork approved successfully' });
  });
});

module.exports = router;
