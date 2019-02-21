var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "sidd",
  password: "password",
  database: "master"
});

exports.con = con;

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });