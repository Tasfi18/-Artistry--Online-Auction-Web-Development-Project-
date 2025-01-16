const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.memoryStorage();
const buyerUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } 
});

router.post('/buyer', buyerUpload.single('file'), (req, res) => {
  const { ID } = req.body;
  const filename = `B${ID}.jpg`;
  databasePath = `/images/buyers/${filename}`
  updateProfileQuery = "UPDATE buyer SET ProfilePicture = ? WHERE BuyerID = ?;"
  if (!ID) {
    return res.status(400).send('Buyer ID is required');
  }
  
  const filePath = path.join(__dirname, '../../client/public/images/buyers/', filename);
  console.log(__dirname)

  fs.writeFile(filePath, req.file.buffer, (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).send("File upload failed");
    }
    
  });

  db.query(updateProfileQuery, [databasePath, ID], (err, result) => {
    if (err) return res.status(500).json(err);

    res.send("Upload completed");
  });
});


router.post('/artist', buyerUpload.single('file'), (req, res) => {
  const { ID } = req.body;
  const filename = `A${ID}.jpg`;
  databasePath = `/images/artists/${filename}`
  updateProfileQuery = "UPDATE artist SET ProfilePicture = ? WHERE ArtistID = ?;"

  if (!ID) {
    return res.status(400).send('Artist ID is required');
  }

  
  const filePath = path.join(__dirname, '../../client/public/images/artists/', filename);
  console.log(__dirname)

  fs.writeFile(filePath, req.file.buffer, (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).send("File upload failed");
    }
  });

  db.query(updateProfileQuery, [databasePath, ID], (err, result) => {
    if (err) return res.status(500).json(err);

    res.send("Upload completed");
  });

  
});





module.exports = router;
