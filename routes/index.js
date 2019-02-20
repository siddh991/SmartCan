const express = require('express');
const router = express.Router();
const db_test_conn = require('./db_test_conn');
var uniqid = require('uniqid');
const bcrypt = require('bcryptjs');
var http = require('http');
var fs = require('fs');
const path = require('path');

// router.get('/', (req, res) => {
//   console.log("reached router.get");
//   res.send('It works!');
//   res.sendFile(path.join(__dirname, '../views/test.html'));
// });

router.post('/signup', (req, res) => {
  console.log('signup hit');
  console.log(req.body);
  var uid = uniqid();

  var hash = bcrypt.hashSync(req.body.password, 10);
  console.log(hash);
  console.log(String(hash));

  db_test_conn.con.connect(function(err) {
    if (err) throw err;
    console.log("test conn again: Connected!");
  
    var sql = 'INSERT INTO users (uniqid, name, username, password) VALUES("'+uid+'","'+req.body.firstname+'", "'+req.body.username+'", "'+String(hash)+'")';
    
    db_test_conn.con.query(sql, function(err, result) {
        if(err) throw err;
        console.log("Inserted into users");
    });

    sql = `CREATE TABLE ${uid} (id INT AUTO_INCREMENT PRIMARY KEY, uniqid VARCHAR(255), item_type VARCHAR(10))`;
    
    db_test_conn.con.query(sql, function(err, result) {
        if(err) throw err;
        console.log("Table created");
    });
  });
});


router.post('/login', (req, res) => {
  console.log('login hit');
  console.log(req.body);
  
  db_test_conn.con.connect(function(err) {
    if (err) throw err;
    console.log("test conn again: Connected!");
  
    var sql = `SELECT password FROM users WHERE username='${req.body.username}'`;
    
    db_test_conn.con.query(sql, function(err, result) {
        if(err) throw err;
        console.log(result[0].password);
        console.log(bcrypt.compareSync(req.body.password, result[0].password));

        if(bcrypt.compareSync(req.body.password, result[0].password)) {
          console.log("works!");
        }
        else {
          console.log("wasteee");
        }
    });
  });
});

router.post('/upload', (req, res) => {
  console.log('upload hit');
  console.log(req.body);
});
 
module.exports = router;