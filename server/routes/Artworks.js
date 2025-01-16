const express = require('express');
const db = require('../db_connection/Connect_db'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();



router.get('/pending', (req, res) => {
  const query = `
  SELECT 
  a.ArtworkID, 
  a.Title, 
  a.Description, 
  a.ImageURL, 
  a.BasePrice, 
  c.CategoryName AS Category, 
  a.ArtistID, 
  art.Name AS ArtistName, 
  a.ApprovalStatus
FROM artwork a
LEFT JOIN category c ON a.CategoryID = c.CategoryID
LEFT JOIN artist art ON a.ArtistID = art.ArtistID
    WHERE a.ApprovalStatus = 'pending';
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });

    res.json(results);
  });
});


router.get('/:artworkID', (req, res) => {
  const { artworkID } = req.params;
  const query = `
    SELECT 
      a.ArtworkID, 
      a.Title, 
      a.Description, 
      a.ImageURL, 
      a.BasePrice, 
      c.CategoryName AS Category, 
      a.ArtistID, 
      art.Name AS ArtistName, 
      a.ApprovalStatus
    FROM artwork a
    LEFT JOIN category c ON a.CategoryID = c.CategoryID
    LEFT JOIN artist art ON a.ArtistID = art.ArtistID
    WHERE a.ArtworkID = ?;
  `;

  db.query(query, [artworkID], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).send('Artwork not found');
    res.json(result[0]);
  });
});


  



router.post('/upload', (req, res) => {
  const { artistID, title, description, basePrice, category, status } = req.body;

  if (!artistID || !title || !description || !basePrice || !category || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const addArtworkQuery = `
    INSERT INTO artwork (ArtistID, Title, Description, BasePrice, CategoryID, ApprovalStatus)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  db.query(
    addArtworkQuery,
    [artistID, title, description, basePrice, category, status],
    (err, results) => {
      if (err) {
        console.error('Error inserting artwork:', err);
        return res.status(500).json({ error: 'Failed to insert artwork into the database' });
      }

      res.status(201).json({ message: 'Artwork uploaded successfully', artworkID: results.insertId });
    }
  );
});



const storage = multer.memoryStorage();
const artworkUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});


router.post('/upload-image', artworkUpload.single('file'), (req, res) => {
  const { artworkID } = req.body;
  if (!artworkID) {
    return res.status(400).send('Artwork ID is required');
  }

  const filename = `Art${artworkID}.jpg`;
  const databasePath = `/images/artworks/${filename}`;
  const filePath = path.join(__dirname, '../../client/public/images/artworks/', filename);

  fs.writeFile(filePath, req.file.buffer, (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).send('File upload failed');
    }

    const updateArtworkQuery = 'UPDATE artwork SET ImageURL = ? WHERE ArtworkID = ?;';
    db.query(updateArtworkQuery, [databasePath, artworkID], (dbErr) => {
      if (dbErr) return res.status(500).json(dbErr);

      res.send('Image uploaded successfully');
    });
  });
});


router.delete('/:artworkID', (req, res) => {
  const { artworkID } = req.params;
  const deleteQuery = 'DELETE FROM artwork WHERE ArtworkID = ?';

  db.query(deleteQuery, [artworkID], (err) => {
    if (err) return res.status(500).json(err);
    res.send('Artwork deleted successfully');
  });
});







module.exports = router;
