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

// root 접근
app.get('/', function (request, response) {
  response.redirect('/word');
});

// 메뉴별 접근
app.get('/:mode', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;

  if ("word" == mode) {
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
        WORD`, function (error, list) {
          if (error) {
            next(error);
          }
          var html = template.theme("word", list);
          response.send(html);
      }
    );
  } else if ("domain" == mode) {
    db.query(
      `SELECT 
        SEQ, 
        GROUPNAME, 
        NAME, 
        DATATYPE, 
        DATALENGTH, 
        DATADECIMAL,
        ABBREVIATION,
        FULLNAME,
        IFNULL(DEFINITION, '') DEFINITION, 
        DATE_FORMAT(WRITEDATE, '%Y-%m-%d') WRITEDATE 
      FROM 
        DOMAIN`, function (error, list) {
          if (error) {
            next(error);
          }
          var html = template.theme("domain", list);
          response.send(html);
      }
    );
  } else {
    next();
  }
});

/**
 * 추가
 */
app.post('/create/:mode', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
  console.log(mode);
  var post = request.body;

  if ("word" == mode) {
    db.query(
      `
      INSERT INTO WORD (NAME, ABBREVIATION, FULLNAME, SORTATION, DEFINITION, WRITEDATE, SYSTEM)
      VALUES(?, ?, ?, ?, ?,  now(), 'SUPER')`, 
      [post.name, post.abbreviation, post.fullName, post.sortation, post.definition],
      function (error, result) {
        if(error) {
          next(error);
        }
        
        db.query(
          `
          INSERT INTO WORDHISTORY (WORDSEQ, NAME, ABBREVIATION, FULLNAME, SORTATION, DEFINITION, WRITEID, WRITEDATE, SYSTEM)
          VALUES(?, ?, ?, ?, ?, ?, ?, now(), 'SUPER')`, 
          [result.insertId, post.name, post.abbreviation, post.fullName, post.sortation, post.definition, post.id],
          function (error, result) {
            if(error) {
              next(error);
            }
            response.redirect(`/word`);
          }
        );
      }
    );
  } else if ("domain" == mode) {

    db.query(
      `
      INSERT INTO DOMAIN (GROUPNAME, NAME, DATATYPE, DATALENGTH, DATADECIMAL, ABBREVIATION, FULLNAME, DEFINITION, WRITEDATE, SYSTEM)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'SUPER')`, 
      [post.groupName, post.name, post.dataType, post.dataLength, post.dataDecimal, post.abbreviation, post.fullName, post.definition],
      function (error, result) {
        if(error) {
          next(error);
        }
        
        db.query(
          `
          INSERT INTO DOMAINHISTORY (DOMAINSEQ, GROUPNAME, NAME, DATATYPE, DATALENGTH, DATADECIMAL, ABBREVIATION, FULLNAME, DEFINITION, WRITEID, WRITEDATE, SYSTEM)
          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'SUPER')`, 
          [result.insertId, post.groupName, post.name, post.dataType, post.dataLength, post.dataDecimal, post.abbreviation, post.fullName, post.definition, post.id],
          function (error, result) {
            if(error) {
              next(error);
            }
            response.redirect(`/domain`);
          }
        );
      }
    );
    console.log(post);
    response.redirect(`/domain`);
  } 

});

/**
 * 수정
 */
app.post('/updateWord', function (request, response, next) {
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
        next(error);
      }

      db.query(
        `
        INSERT INTO WORDHISTORY (WORDSEQ, NAME, ABBREVIATION, FULLNAME, SORTATION, DEFINITION, WRITEID, WRITEDATE, SYSTEM)
        VALUES(?, ?, ?, ?, ?, ?, ?, now(), 'SUPER')`, 
        [post.seq, post.name, post.abbreviation, post.fullName, post.sortation, post.definition, post.id],
        function (error, result) {
          if(error) {
            next(error);
          }
          response.redirect(`/word`);
        }
      );
    }
  );
});

/**
 * 삭제
 */
app.get('/deleteWord/:seq', function (request, response, next) {
  var seq = path.parse(request.params.seq).base;
  db.query('DELETE FROM WORDHISTORY WHERE WORDSEQ=?', [seq], function(error, result) {
    if (error) {
      next(error);
    } 
    db.query('DELETE FROM WORD WHERE SEQ=?', [seq], function(error, result) {
      if (error) {
        next(error);
      } 
      response.redirect(`/word`);
    });
  });
});

/**
 * 키워드 검색
 */
app.post('/keywordSearch', function (request, response, next) {
  var post = request.body;
  var condition = 'NAME';
  var keyword = post.keyword;
  if ("name" == post.condition) {
    condition = "NAME";
  } else if ("abbreviation" == post.condition) {
    condition = "ABBREVIATION";
  } if ("fullName" == post.condition) {
    condition = "FULLNAME";
  } 

  //console.log('condition : '+condition);
  //console.log('keyword : '+keyword);
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
      WORD
    WHERE
      ${condition} LIKE ?
      `, ['%'+keyword+'%'], function (error, words) {
      if (error) {
        next(error);
      }
      response.json(words);
    });
});

/**
 * 이력 조회
 */
app.get('/getHistory/:mode/:seq', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
  var seq = path.parse(request.params.seq).base;

  db.query(
    `SELECT 
      SEQ,
      WORDSEQ, 
      NAME, 
      ABBREVIATION, 
      FULLNAME, 
      SORTATION, 
      IFNULL(DEFINITION, '') DEFINITION, 
      WRITEID,
      DATE_FORMAT(WRITEDATE, '%Y-%m-%d') WRITEDATE 
    FROM 
      WORDHISTORY
    WHERE 
      WORDSEQ = ?
    ORDER BY SEQ DESC`, [seq], function (error, historyList) {
      if (error) {
        next(error);
      }
      response.json(historyList);
    });
});

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});
app.listen(3000);