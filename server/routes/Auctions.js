const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router(); 

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
          WHERE a.AuctionStatus = 'active' 
          AND AuctionStatus = 'pending'
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
                      console.log(`AuctionID ${AuctionID} has been set to 'active' from bid.`);
                  });
              }
          });



        }
    
          
    
    });
  

    const { auctionId } = req.params;
    const { BuyerID, BidAmount } = req.body;
    //const auctionId = 1; 
    //const buyerId = 2;   
    //const newBidAmount = 700000; 
    const auctionStatusQuery = 'SELECT EndTime, AuctionStatus FROM auction WHERE AuctionID = ?';
    db.query(auctionStatusQuery, [auctionId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Auction not found.' });

        const { EndTime, AuctionStatus} = result[0];
        const currentTime = new Date();
        if(AuctionStatus == 'pending'){
          return res.status(400).json({ message: 'Auction is not online.' });
        }
        else{
          if (currentTime > EndTime || AuctionStatus == 'closed') {        
            newAucStatQuery = 'UPDATE auction set AuctionStatus = ? where AuctionID = ?;'
            db.query(newAucStatQuery,["closed",auctionId],(err,result)=>{
              if(err) return res.status(500).json(err);
              return res.status(400).json({ message: 'Auction is closed. No more bids allowed.' });

            })   
            
          }
          const HighestBidQuery = 'SELECT HighestBid AS sb FROM auction where AuctionID = ?';
          db.query(HighestBidQuery,[auctionId],(err,result) =>{
            if (err) return res.status(500).json(err);
            const HighestBid = result[0].sb;
            
            if(BidAmount>HighestBid){
                const maxBidQuery = 'SELECT MAX(BidAmount) AS maxBidAmount FROM bid WHERE AuctionID = ?';
            
                db.query(maxBidQuery, [auctionId], (err, result) => {
                    if (err) throw err;
        
                    const maxBidAmount = result[0].maxBidAmount || 0; 
                    console.log(maxBidAmount)
                    if (BidAmount > maxBidAmount) {
                        const insertBidQuery = 'INSERT INTO bid (AuctionID, BuyerID, BidAmount, BidTime) VALUES (?, ?, ?, NOW())';
                        db.query(insertBidQuery, [auctionId, BuyerID, BidAmount], (err, result) => {
                            if (err) throw err;
                            console.log('New bid inserted successfully.');
                            const updateAuctionQuery = 'UPDATE auction SET HighestBid = ?, WinnerID = ? WHERE AuctionID = ?';
                            db.query(updateAuctionQuery, [BidAmount, BuyerID, auctionId], (err, result) => {
                                if (err) return res.status(500).json({ error: err.message });
                                
                                console.log('Auction table updated with new highest bid and winner.');
                                console.log('Bid placed successfully and auction updated.');
                            });
                        });
                    } else {
                        console.log('Bid amount is too low.');
                        res.status(201).json({ message: 'Bid amount is too low.' });
                    }
                });
            }
            else{
              console.log('lower than Highest bid.');
              res.status(201).json({ message: 'lower than Highest bid.' });
            }                   

          }); 

        }
           
    });

});

  router.post('/:artworkID/new', (req, res) => {
    const { artworkID } = req.params;
    AuctionStatus = 'active';
   // const {  StartTime, EndTime,HighestBid } = req.body;
     StartTime = '2024-10-15 04:59:24';
     EndTime = '2024-10-15 05:39:24';
     StartingBid = 222;
     
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