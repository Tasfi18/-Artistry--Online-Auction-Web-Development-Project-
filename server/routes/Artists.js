const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router();
const { hashPassword, verifyPassword, withoutPassword } = require('../lib/passwords');

router.get('/user/:artistID', (req, res) => {
    
      const { artistID } = req.params;
      const query = "SELECT * FROM artist WHERE ArtistID = ?";
      db.query(query, [artistID], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result.map(withoutPassword));
      });
});
router.get('/email', (req, res) => {
    
  const query = "SELECT Email FROM artist ";
  db.query(query, [], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const query = "SELECT ArtistID, Password FROM artist WHERE Email = ?";
    db.query(query, [email], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (result.length === 0 || !verifyPassword(password, result[0].Password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const artistID = result[0].ArtistID;
      res.json({ artistID }); 
    });
  });
  

  router.post('/signup', (req, res) => {
     const {name , email, password, bio, portfolioURL } = req.body;
     if (!name || !email || !password) {
         return res.status(400).json({ error: 'Name, email and password are required' });
     }
     const approvalStatus = "approved";  
  
     const query = `
         INSERT INTO artist (Name, Email, Password, Bio, PortfolioURL, ApprovalStatus)
         VALUES (?, ?, ?, ?, ?, ?)
     `;
  
     const values = [name, email, hashPassword(password), bio, portfolioURL, approvalStatus];
  
     db.query(query, values, (err, result) => {
         if (err) return res.status(500).json({ error: err.message });
         res.status(201).json({ message: 'Artist created successfully', artistID: result.insertId });
     });
  });


  router.get('/user/:artistID/artwork', (req, res) => {
    const { artistID } = req.params;

    const query = `
        SELECT 
            ArtworkID, 
            Title, 
            Description, 
            ImageURL, 
            BasePrice, 
            CategoryID, 
            ApprovalStatus 
        FROM artwork 
        WHERE ArtistID = ?
    `;

    db.query(query, [artistID], (err, results) => {
        if (err) {
            console.error('Error retrieving artworks:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        res.status(200).json(results);
    });
});




module.exports = router;