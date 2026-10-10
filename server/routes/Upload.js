const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.memoryStorage();
const buyerUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
});

// Saves an uploaded profile picture as <prefix><ID>.jpg and records its path.
function saveProfilePicture(req, res, { prefix, folder, query, label }) {
  const ID = String(req.body.ID || '');
  if (!/^\d+$/.test(ID)) {
    return res.status(400).send(`${label} ID is required`);
  }
  if (!req.file) {
    return res.status(400).send('An image file is required');
  }

  const filename = `${prefix}${ID}.jpg`;
  const databasePath = `/images/${folder}/${filename}`;
  const filePath = path.join(__dirname, '../../client/public/images', folder, filename);

  fs.writeFile(filePath, req.file.buffer, (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).send('File upload failed');
    }
    db.query(query, [databasePath, ID], (err) => {
      if (err) return res.status(500).json(err);
      res.send('Upload completed');
    });
  });
}

router.post('/buyer', buyerUpload.single('file'), (req, res) => {
  saveProfilePicture(req, res, {
    prefix: 'B',
    folder: 'buyers',
    query: 'UPDATE buyer SET ProfilePicture = ? WHERE BuyerID = ?;',
    label: 'Buyer',
  });
});


router.post('/artist', buyerUpload.single('file'), (req, res) => {
  saveProfilePicture(req, res, {
    prefix: 'A',
    folder: 'artists',
    query: 'UPDATE artist SET ProfilePicture = ? WHERE ArtistID = ?;',
    label: 'Artist',
  });
});





module.exports = router;
