const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router();
const { evaluateBid } = require('../lib/bids');

//things to implement : api/auction/ call korle start time er agey "pending" thakbe ar pore active thakbe

router.get('/active', (req, res) => {


  const timeExpirationQuery = "UPDATE auction SET AuctionStatus = 'closed' WHERE EndTime < NOW()"
  db.query(timeExpirationQuery, (err, results) => {
    if (err) return res.status(500).json(err);
  }); 
  
  const pendingCheckQuery = "SELECT AuctionID, StartTime, AuctionStatus FROM auction WHERE AuctionStatus = 'pending'";
  db.query(pendingCheckQuery, [], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length > 0) {
      const currentTime = new Date();
      result.forEach(auction => {
        const { AuctionID, StartTime } = auction;

        if (currentTime >= new Date(StartTime)) {
          const updateStatusQuery = "UPDATE auction SET AuctionStatus = 'active' WHERE AuctionID = ?";
          
          db.query(updateStatusQuery, [AuctionID], (err, updateResult) => {
            if (err) return res.status(500).json({ error: err.message });
            console.log(`AuctionID ${AuctionID} has been set to 'active'.`);
          });
        }
      });

    }
   
  });

  const activeAuctionsQuery = `
    SELECT 
      a.AuctionID, 
      a.StartTime, 
      a.EndTime, 
      a.StartingBid, 
      a.HighestBid, 
      a.AuctionStatus, 
      aw.Title, 
      aw.ImageURL, 
      art.Name AS ArtistName, 
      art.ArtistID AS ArtistID 
    FROM 
      auction a 
    JOIN 
      artwork aw ON a.ArtworkID = aw.ArtworkID 
    JOIN 
      artist art ON aw.ArtistID = art.ArtistID  -- Join the artist table to get the name
    WHERE 
      a.AuctionStatus = 'active' OR a.AuctionStatus = 'pending'` ;

  db.query(activeAuctionsQuery, [], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'No active auctions found.' });

    res.json(results);
  });
});



router.get('/active/:categoryID', (req, res) => {
  const { categoryID } = req.params;

  const timeExpirationQuery = "UPDATE auction SET AuctionStatus = 'closed' WHERE EndTime < NOW()";
  db.query(timeExpirationQuery, (err, updateResults) => {
      if (err) return res.status(500).json(err);
    
      const query = `
          SELECT a.* 
          FROM auction a
          JOIN artwork aw ON a.ArtworkID = aw.ArtworkID
          WHERE a.AuctionStatus IN ('active', 'pending')
          AND aw.CategoryID = ?
      `;
      db.query(query, [categoryID], (err, results) => {
          if (err) return res.status(500).json(err);
          res.json(results);
      });
  });
});

router.get('/:auctionId', (req, res) => {

  
  const timeExpirationQuery = "UPDATE auction SET AuctionStatus = 'closed' WHERE EndTime < NOW()"
  db.query(timeExpirationQuery, (err, results) => {
    if (err) return res.status(500).json(err);
  
    const { auctionId } = req.params;
 
    const query = `
        SELECT 
              a.AuctionID, 
              a.StartTime, 
              a.EndTime, 
              a.StartingBid, 
              a.HighestBid, 
              a.AuctionStatus, 
              aw.Title, 
              aw.ImageURL, 
              aw.Description,  
              art.Name AS ArtistName  ,  
              art.ArtistID AS ArtistID
        FROM 
            auction a 
        JOIN 
            artwork aw ON a.ArtworkID = aw.ArtworkID 
        JOIN 
            artist art ON aw.ArtistID = art.ArtistID  
        WHERE 
            a.AuctionID = ?; ` ;
    db.query(query, [auctionId], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    });
  });
}); 

router.post('/:auctionId/bid', (req, res) => {
  const { auctionId } = req.params;
  const { BuyerID, BidAmount } = req.body;
  if (!BuyerID) return res.status(400).json({ message: 'BuyerID is required.' });

  // Bring statuses up to date first: close finished auctions, open ones that have started.
  const refreshStatuses = `
    UPDATE auction
    SET AuctionStatus = CASE
      WHEN EndTime < NOW() THEN 'closed'
      WHEN AuctionStatus = 'pending' AND StartTime <= NOW() THEN 'active'
      ELSE AuctionStatus
    END
    WHERE AuctionID = ?`;
  db.query(refreshStatuses, [auctionId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const auctionQuery = `
      SELECT a.EndTime, a.AuctionStatus, a.HighestBid,
             (SELECT MAX(BidAmount) FROM bid WHERE AuctionID = a.AuctionID) AS MaxBid
      FROM auction a WHERE a.AuctionID = ?`;
    db.query(auctionQuery, [auctionId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.status(404).json({ message: 'Auction not found.' });

      const { EndTime, AuctionStatus, HighestBid, MaxBid } = rows[0];
      const decision = evaluateBid({
        auctionStatus: AuctionStatus,
        endTime: EndTime,
        highestBid: HighestBid,
        maxBid: MaxBid,
        bidAmount: BidAmount,
      });
      if (!decision.ok) return res.status(decision.status).json({ message: decision.message });

      const insertBid = 'INSERT INTO bid (AuctionID, BuyerID, BidAmount, BidTime) VALUES (?, ?, ?, NOW())';
      db.query(insertBid, [auctionId, BuyerID, decision.amount], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        const updateAuction = 'UPDATE auction SET HighestBid = ?, WinnerID = ? WHERE AuctionID = ?';
        db.query(updateAuction, [decision.amount, BuyerID, auctionId], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: 'Bid placed.', highestBid: decision.amount });
        });
      });
    });
  });
});

  router.post('/:artworkID/new', (req, res) => {
    const { artworkID } = req.params;
    const AuctionStatus = 'active';
    // Test helper: creates a short sample auction with fixed values.
    const StartTime = '2024-10-15 04:59:24';
    const EndTime = '2024-10-15 05:39:24';
    const StartingBid = 222;
     
    const query = 'INSERT INTO auction (ArtworkID, StartTime, EndTime,StartingBid,AuctionStatus) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [artworkID, StartTime, EndTime,StartingBid,AuctionStatus], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ auctionId: result.insertId });
    });
  });


  router.post('/create', (req, res) => {
    const { artworkID, startTime, endTime, startingBid, auctionStatus } = req.body;
    const highestBid = startingBid;
    if (!artworkID || !startTime || !endTime || !startingBid) {
      return res.status(400).send('All fields are required');
    }
  
    const query = `
      INSERT INTO auction (ArtworkID, StartTime, EndTime, StartingBid, AuctionStatus,HighestBid)
      VALUES (?, ?, ?, ?, ?,?)
    `;
  
    db.query(query, [artworkID, startTime, endTime, startingBid, auctionStatus,highestBid], (err, result) => {
      if (err) {
        console.error('Error creating auction:', err);
        return res.status(500).send('Failed to create auction');
      }
  
      const updateArtworkQuery = `
        UPDATE artwork 
        SET ApprovalStatus = 'approved' 
        WHERE ArtworkID = ?
      `;
  
      db.query(updateArtworkQuery, [artworkID], (err, result) => {
        if (err) {
          console.error('Error updating artwork status:', err);
          return res.status(500).send('Failed to update artwork status');
        }
  
        res.status(201).send('Auction created and artwork approved successfully');
      });
    });
  });
  
module.exports = router;