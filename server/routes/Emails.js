const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router(); 

router.post('/check-email', (req, res) => {
    const { email } = req.body;
  
    const queryArtist = "SELECT Email FROM artist WHERE Email = ?";
    const queryBuyer = "SELECT Email FROM buyer WHERE Email = ?";
  
    db.query(queryArtist, [email], (err, resultArtist) => {
      if (err) return res.status(500).json(err);
  
      if (resultArtist.length > 0) {
        return res.status(400).json({ message: 'This email is already in use by an artist.' });
      }
  
      db.query(queryBuyer, [email], (err, resultBuyer) => {
        if (err) return res.status(500).json(err);
  
        if (resultBuyer.length > 0) {
          return res.status(400).json({ message: 'This email is already in use by a buyer.' });
        }
  
        res.json({ message: 'Email is available.' });
      });
    });
  });
  



module.exports = router;