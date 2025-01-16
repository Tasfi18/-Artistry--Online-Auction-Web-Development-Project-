const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router(); 

router.get('/:buyerID', (req, res) => {
    const { buyerID } = req.params;
    const auctionStatus = "active";
    const showCartQuery = `
        SELECT a.AuctionID, a.AuctionStatus, b.BidAmount, b.BidTime 
        FROM auction a 
        JOIN bid b ON a.AuctionID = b.AuctionID 
        WHERE b.BuyerID = ? 
        AND a.AuctionStatus = ? 
        AND b.BidTime = (
            SELECT MAX(b2.BidTime) 
            FROM bid b2 
            WHERE b2.AuctionID = a.AuctionID 
            AND b2.BuyerID = b.BuyerID
        );
    `;
    db.query(showCartQuery, [buyerID, auctionStatus], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

router.get('/:buyerID/winning', (req, res) => {
    const { buyerID } = req.params;
    const auctionStatus = "active";
    const showWinningQuery = `
        SELECT a.AuctionID, a.AuctionStatus, b.BidAmount, b.BidTime 
        FROM auction a 
        JOIN bid b ON a.AuctionID = b.AuctionID 
        WHERE b.BuyerID = a.WinnerID 
        AND b.BuyerID = ? 
        AND a.AuctionStatus = ? 
        AND b.BidTime = (
            SELECT MAX(b2.BidTime) 
            FROM bid b2 
            WHERE b2.AuctionID = a.AuctionID 
            AND b2.BuyerID = b.BuyerID
        );
    `;
    db.query(showWinningQuery, [buyerID, auctionStatus], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

router.get('/:buyerID/won', (req, res) => {
    const { buyerID } = req.params;
    const auctionStatus = "closed";
    const showWonQuery = `
        SELECT a.AuctionID, a.AuctionStatus, b.BidAmount, b.BidTime 
        FROM auction a 
        JOIN bid b ON a.AuctionID = b.AuctionID 
        WHERE b.BuyerID = a.WinnerID 
        AND b.BuyerID = ? 
        AND a.AuctionStatus = ? 
        AND b.BidTime = (
            SELECT MAX(b2.BidTime) 
            FROM bid b2 
            WHERE b2.AuctionID = a.AuctionID 
            AND b2.BuyerID = b.BuyerID
        );
    `;
    db.query(showWonQuery, [buyerID, auctionStatus], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});




module.exports = router;