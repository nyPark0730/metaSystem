var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user     : 'metasystem',
    password : 'metasystem',
    database : 'METASYSTEM'
  });

db.connect();
module.exports = db;