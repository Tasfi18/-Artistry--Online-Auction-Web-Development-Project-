const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router(); 

router.get('/user/:artistID', (req, res) => {
    
      const { artistID } = req.params;
      const query = "SELECT * FROM artist WHERE ArtistID = ?";
      db.query(query, [artistID], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
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
    
    const query = "SELECT ArtistID FROM artist WHERE Email = ? AND Password = ?";
    db.query(query, [email, password], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (result.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const artistID = result[0].ArtistID;
      res.json({ artistID }); 
    });
  });
  

  router.post('/signup', (req, res) => {
     const {name , email, password, bio, portfolioURL } = req.body;
     const approvalStatus = "approved";  
  
     const query = `
         INSERT INTO artist (Name, Email, Password, Bio, PortfolioURL, ApprovalStatus)
         VALUES (?, ?, ?, ?, ?, ?)
     `;
  
     const values = [name, email, password, bio, portfolioURL, approvalStatus];
  
     db.query(query, values, (err, result) => {
         if (err) return res.status(500).json({ error: err });
         res.status(201).json({ message: 'Artist created successfully', result });
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