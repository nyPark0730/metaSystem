var express = require('express');
var app = express();
var path = require('path');
var db = require('./lib/db');
var template = require('./lib/template.js');
var bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, 'www')));
app.use('/bootstrap', express.static('bootstrap-3.3.2'));
app.use('/js', express.static(path.join(__dirname,  'bootstrap-3.3.2', 'dist', 'js')));
app.use('/css', express.static(path.join(__dirname, 'bootstrap-3.3.2', 'dist', 'css')));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/mode/:mode', function (request, response) {
  db.query(
  `SELECT 
    SEQ, 
    NAME, 
    ABBREVIATION, 
    FULLNAME, 
    SORTATION, 
    IFNULL(DEFINITION, '') DEFINITION, 
    DATE_FORMAT(WRITEDATE, '%Y-%m-%d') WRITEDATE 
  FROM 
    WORD`, function (error, words) {
    if (error) {
      throw error;
    }
    var mode = path.parse(request.params.mode).base;
    var html = template.theme(words);
    response.send(html);
  });
});

app.post('/createWord', function (request, response) {
  var post = request.body;
  console.log(post);
  db.query(
    `
    INSERT INTO WORD (NAME, ABBREVIATION, FULLNAME, SORTATION, DEFINITION, WRITEDATE)
    VALUES(?, ?, ?, ?, ?,  now())`, 
    [post.name, post.abbreviation, post.fullName, post.sortation, post.definition],
    function (error, result) {
      if(error) {
        throw error;
      }
      response.redirect(`/mode/word`);
    }
  );
});

app.post('/updateWord', function (request, response) {
  var post = request.body;
  console.log(post);
  db.query(
    `
    UPDATE WORD 
    SET
      NAME = ?, 
      ABBREVIATION = ?, 
      FULLNAME = ?, 
      SORTATION = ?, 
      DEFINITION = ?, 
      WRITEDATE = now()
    WHERE
      SEQ = ?`, 
    [post.name, post.abbreviation, post.fullName, post.sortation, post.definition, post.seq],
    function (error, result) {
      if(error) {
        throw error;
      }
      response.redirect(`/mode/word`);
    }
  );
});

app.get('/deleteWord/:seq', function (request, response) {
  var seq = path.parse(request.params.seq).base;
  db.query('DELETE FROM WORD WHERE SEQ=?', [seq], function(error, result) {
    if (error) {
      throw error;
    } 
    response.redirect(`/mode/word`);
  });
});

app.listen(3000, function () {
    console.log('test');
  });