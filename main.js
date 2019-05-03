var express = require('express');
var app = express();
var path = require('path');
var db = require('./lib/db.js');
var template = require('./lib/template.js');
var bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, 'www')));
app.use('/bootstrap', express.static('bootstrap-3.3.2'));
app.use('/js', express.static(path.join(__dirname,  'bootstrap-3.3.2', 'dist', 'js')));
app.use('/css', express.static(path.join(__dirname, 'bootstrap-3.3.2', 'dist', 'css')));
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * root 접근 → 표준단어를 default 페이지로 설정
 */
app.get('/', function (request, response) {
  response.redirect('/word');
});

/**
 * 메뉴별 접근
 * mode : word, domain, attribute, entity
 */ 
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
    //response.send("Comming Soon..");
  }
});

/**
 * 추가
 * mode : word, domain, attribute, entity
 */
app.post('/create/:mode', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
  console.log(mode);
  var post = request.body;

  if ("word" == mode) {
    db.query(
      `
      INSERT INTO WORD (NAME, ABBREVIATION, FULLNAME, SORTATION, DEFINITION, WRITEDATE, SYSTEM)
      VALUES(?, ?, ?, ?, ?,  now(), '0')`, 
      [post.wordName, post.wordAbbreviation, post.wordFullName, post.wordSortation, post.wordDefinition],
      function (error, result) {
        if(error) {
          next(error);
        }
        
        db.query(
          `
          INSERT INTO WORDHISTORY (WORDSEQ, NAME, ABBREVIATION, FULLNAME, SORTATION, DEFINITION, WRITEID, WRITEDATE, SYSTEM)
          VALUES(?, ?, ?, ?, ?, ?, ?, now(), '0')`, 
          [result.insertId, post.wordName, post.wordAbbreviation, post.wordFullName, post.wordSortation, post.wordDefinition, post.id],
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
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, NOW(), '0')`, 
      [post.domainGroupName, post.domainName, post.domainDataType, post.domainDataLength, post.domainDataDecimal, post.domainAbbreviation, post.domainFullName, post.domainDefinition],
      function (error, result) {
        if(error) {
          next(error);
        }
        
        db.query(
          `
          INSERT INTO DOMAINHISTORY (DOMAINSEQ, GROUPNAME, NAME, DATATYPE, DATALENGTH, DATADECIMAL, ABBREVIATION, FULLNAME, DEFINITION, WRITEID, WRITEDATE, SYSTEM)
          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), '0')`, 
          [result.insertId, post.domainGroupName, post.domainName, post.domainDataType, post.domainDataLength, post.domainDataDecimal, post.domainAbbreviation, post.domainFullName, post.domainDefinition, post.id],
          function (error, result) {
            if(error) {
              next(error);
            }
            response.redirect(`/domain`);
          }
        );
      }
    );
    response.redirect(`/domain`);
  } 

});

/**
 * 수정
 * mode : word, domain, attribute, entity
 */
app.post('/update/:mode', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
  console.log(mode);
  var post = request.body;
  console.log(post);

  if ("word" == mode) {
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
      [post.wordName, post.wordAbbreviation, post.wordFullName, post.wordSortation, post.wordDefinition, post.wordSeq],
      function (error, result) {
        if(error) {
          next(error);
        }
  
        db.query(
          `
          INSERT INTO WORDHISTORY (WORDSEQ, NAME, ABBREVIATION, FULLNAME, SORTATION, DEFINITION, WRITEID, WRITEDATE, SYSTEM)
          VALUES(?, ?, ?, ?, ?, ?, ?, now(), '0')`, 
          [post.wordSeq, post.wordName, post.wordAbbreviation, post.wordFullName, post.wordSortation, post.wordDefinition, post.id],
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

  } 

  
});

/**
 * 삭제
 * mode : word, domain, attribute, entity
 */

app.get('/delete/:mode/:seq', function (request, response, next) {
  var seq = path.parse(request.params.seq).base;
  var mode = path.parse(request.params.mode).base;

  if ('word' == mode) {
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
  } else if ('domain' == mode) {
    db.query('DELETE FROM DOMAINHISTORY WHERE DOMAINSEQ=?', [seq], function(error, result) {
      if (error) {
        next(error);
      } 
      db.query('DELETE FROM DOMAIN WHERE SEQ=?', [seq], function(error, result) {
        if (error) {
          next(error);
        } 
        response.redirect(`/domain`);
      });
    });
  } else {
    next(error);
  }

});

/**
 * 키워드 검색
 */
app.post('/keywordSearch', function (request, response, next) {
  var post = request.body;
  var condition = 'NAME';
  var keyword = post.keyword;
  var mode = post.mode;
  var whereMode = '';
  if ('equal' == mode) {
    whereMode = '=';
  } else {
    whereMode = 'LIKE';
    keyword = '%'+keyword+'%';
  }

  if ("name" == post.condition) {
    condition = "NAME";
  } else if ("abbreviation" == post.condition) {
    condition = "ABBREVIATION";
  } if ("fullName" == post.condition) {
    condition = "FULLNAME";
  } 

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
      upper(${condition}) ${whereMode} upper(?)
      `, [keyword], function (error, words) {
      if (error) {
        next(error);
      }
      response.json(words);
    });
});

/**
 * 이력 조회
 * mode : word, domain, attribute, entity
 */
app.get('/getHistory/:mode/:seq', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
  var seq = path.parse(request.params.seq).base;
  if ("word" == mode) {
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
        WRITEID,
        DATE_FORMAT(WRITEDATE, '%Y-%m-%d') WRITEDATE 
      FROM 
        DOMAINHISTORY
      WHERE 
        DOMAINSEQ = ?
      ORDER BY SEQ DESC`, [seq], function (error, historyList) {
        if (error) {
          next(error);
        }
        response.json(historyList);
    });
  } 
});

/**
 * 404 에러 발생시
 */
app.use(function(request, response, next) {
  response.status(404).send('Sorry cant find that!');
});

/**
 * 500 에러 발생시
 */
app.use(function (error, request, response, next) {
  console.error(error.stack);
  response.status(500).send('Something broke!');
});

app.listen(3000);