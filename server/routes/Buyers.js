const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router();
const { hashPassword, verifyPassword, withoutPassword } = require('../lib/passwords');

router.get('/user/:buyerID', (req, res) => {
    
    const { buyerID } = req.params;
    const query = "SELECT * FROM buyer WHERE BuyerID = ?";
    db.query(query, [buyerID], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result.map(withoutPassword));
    });
});
router.get('/email', (req, res) => {
    
    const query = "SELECT Email FROM buyer ";
    db.query(query, [], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    });
  });
  
router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const query = "SELECT BuyerID, Password FROM buyer WHERE Email = ?";

    db.query(query, [email], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0 || !verifyPassword(password, result[0].Password)) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const buyerID = result[0].BuyerID;
        res.json({ message: 'Sign-in successful', buyerID });  
    });
});



router.post('/signup', (req, res) => {
    const { name, email,  password, shippingAddress, businessDetails, yearlyWage } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    const approvalStatus = "approved";
    const query = `
        INSERT INTO buyer ( Name, Email,  Password, ShippingAddress, BusinessDetails, YearlyWage, ApprovalStatus)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [ name, email,  hashPassword(password), shippingAddress, businessDetails, yearlyWage, approvalStatus];
    
    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Buyer created successfully', buyerID: result.insertId });
    });
});


router.get('/cart/:buyerID', async (req, res) => {
    const { buyerID } = req.params;
    const q = `
    SELECT a.AuctionID, b.Title, a.HighestBid,b.ArtworkID
    FROM auction a
    JOIN artwork b ON a.ArtworkID = b.ArtworkID
    WHERE a.WinnerID = ? AND a.AuctionStatus = 'closed'
  `
    db.query(q,buyerID,(err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});
router.get('/auction/:buyerID', async (req, res) => {
    const { buyerID } = req.params;
    const q =  `SELECT 
    auction.AuctionID, 
    artwork.Title,
    artwork.ArtworkID, 
    MAX(bid.BidAmount) AS MaxBid
FROM 
    auction
JOIN 
    artwork ON auction.ArtworkID = artwork.ArtworkID
JOIN 
    bid ON auction.AuctionID = bid.AuctionID
WHERE 
    bid.BuyerID = ? AND auction.AuctionStatus = 'active'
GROUP BY 
    auction.AuctionID, artwork.Title;
`;
    db.query(q,buyerID,(err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});




module.exports = router;