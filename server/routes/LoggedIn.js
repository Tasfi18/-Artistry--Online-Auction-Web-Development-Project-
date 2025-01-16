const express = require('express');
const db = require('../db_connection/Connect_db');
const router = express.Router(); 

router.get('/', (req, res) => {
    
    const query = "SELECT * FROM loggedin";
    db.query(query, [], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    });
  });

  router.post('/', (req, res) => {
    const { ID, Status, UserType } = req.body;

    //const id = 3
    //const statusac  = 0
    //const usertype = 'buyer'
    const query = "UPDATE loggedin SET ID = ?, Status = ?,UserType = ? WHERE verify = 1";
    db.query(query, [ID, Status, UserType], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      res.json({result}); 
    });
  });

  router.post('/signout', (req, res) => {
    //const { id, statusac, usertype } = req.body;

    const statusac  = 0
    const query = "UPDATE loggedin SET Status = ? WHERE verify = 1";
    db.query(query, [statusac], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      res.json({result}); 
    });
  });

module.exports = router;