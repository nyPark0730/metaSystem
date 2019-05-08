var express = require('express');
var app = express();
var path = require('path');
var db = require('./lib/db.js');
var template = require('./lib/template.js');
var bodyParser = require('body-parser');
var excel = require('excel4node');


app.use(express.static(path.join(__dirname, 'www')));
app.use('/bootstrap', express.static('bootstrap-3.3.2'));
app.use('/js', express.static(path.join(__dirname,  'bootstrap-3.3.2', 'dist', 'js')));
app.use('/css', express.static(path.join(__dirname, 'bootstrap-3.3.2', 'dist', 'css')));
app.use('/commonJs', express.static(path.join(__dirname, 'views', 'js')));
app.use('/nodeModules', express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', './views');

/**
 * root 접근 → 표준단어를 default 페이지로 설정
 */
app.get('/', function (request, response) {
  response.redirect('/word');
});


/**
 * 메뉴별 접근
 * mode : word, domain
 */ 
app.get('/:mode/:pageNum', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
  var page = path.parse(request.params.pageNum).base;

  if ("word" == mode) {

    db.query(
      `SELECT COUNT(*) COUNT FROM WORD`, function (error, result) {
          if (error) {
            next(error);
          }
          var totalCount = result[0]['COUNT'];
          var listCount = 2;
          var limitStart = (page-1) * listCount;

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
            LIMIT ?, ?`, [limitStart, listCount],  function (error, list) {
                if (error) {
                  next(error);
                }
                //var html = template.theme("word", list);
                console.log(list[0]);
                response.render('word.ejs', {list : JSON.stringify(list), totalCount : totalCount, page:page} );
            }
          );
          //response.send('test');
      }
    );




/*
    

*/



    /*db.query(
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
          //var html = template.theme("word", list);
          response.render('word.ejs', {list : JSON.stringify(list)});
      }
    );*/
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
          //var html = template.theme("domain", list);
          response.render('domain.ejs', {list : JSON.stringify(list)});
          //response.send(html);
      }
    );
  } else {
    response.render('index.ejs');
    //next();
    //response.send("Comming Soon..");
  }
});

/**
 * 추가
 * mode : word, domain
 */
app.post('/create/:mode', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
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
  } 

});

/**
 * 수정
 * mode : word, domain
 */
app.post('/update/:mode', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
  var post = request.body;

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
    db.query(
      `
      UPDATE DOMAIN 
      SET
        GROUPNAME = ?,
        NAME = ?, 
        DATATYPE = ?,
        DATALENGTH = ?,
        DATADECIMAL = ?,
        ABBREVIATION = ?, 
        FULLNAME = ?, 
        DEFINITION = ?, 
        WRITEDATE = now()
      WHERE
        SEQ = ?`, 
      [post.domainGroupName, post.domainName, post.domainDataType, post.domainDataLength, post.domainDataDecimal, post.domainAbbreviation, post.domainFullName, post.domainDefinition, post.domainSeq],
      function (error, result) {
        if(error) {
          next(error);
        }
        db.query(
          `
          INSERT INTO DOMAINHISTORY (DOMAINSEQ, GROUPNAME, NAME, DATATYPE, DATALENGTH, DATADECIMAL, ABBREVIATION, FULLNAME, DEFINITION, WRITEID, WRITEDATE, SYSTEM)
          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), '0')`, 
          [post.domainSeq, post.domainGroupName, post.domainName, post.domainDataType, post.domainDataLength, post.domainDataDecimal, post.domainAbbreviation, post.domainFullName, post.domainDefinition, post.id],
          function (error, result) {
            if(error) {
              next(error);
            }
            response.redirect(`/domain`);
          }
        );
      }
    );
  } 

  
});

/**
 * 삭제
 * mode : word, domain
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
app.post('/keywordSearch/:mode', function (request, response, next) {
  var post = request.body;
  var condition = 'NAME';
  var keyword = post.keyword;
  var whereMode = post.whereMode;
  if ('equal' == whereMode) {
    whereMode = '=';
  } else {
    whereMode = 'LIKE';
    keyword = '%'+keyword+'%';
  }
  var mode = path.parse(request.params.mode).base;

  if ("name" == post.condition) {
    condition = "NAME";
  } else if ("abbreviation" == post.condition) {
    condition = "ABBREVIATION";
  } if ("fullName" == post.condition) {
    condition = "FULLNAME";
  } 

  if ('word' == mode) {
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
        `, [keyword], function (error, list) {
        if (error) {
          next(error);
        }
        response.json(list);
      });
  } else if ('domain' == mode) {
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
        DOMAIN
      WHERE
        upper(${condition}) ${whereMode} upper(?)
        `, [keyword], function (error, list) {
        if (error) {
          next(error);
        }
        response.json(list);
      });
  }
});

/**
 * 이력 조회
 * mode : word, domain
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
 * 엑셀 다운로드
 */
app.get('/excelDownload/:mode/', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
  if ('word' == mode) {
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
         
          var wb = new excel.Workbook();
          var ws = wb.addWorksheet('표준단어');
          
          ws.cell(1, 1).string('순번');
          ws.cell(1, 2).string('단어명');
          ws.cell(1, 3).string('영문약어명');
          ws.cell(1, 4).string('영문명');
          ws.cell(1, 5).string('구분');
          ws.cell(1, 6).string('정의');
          ws.cell(1, 7).string('작성일');

          list.forEach(function(value, index){
            ws.cell(index+2, 1).number(index+1);
            ws.cell(index+2, 2).string(value['NAME']);
            ws.cell(index+2, 3).string(value['ABBREVIATION']);
            ws.cell(index+2, 4).string(value['FULLNAME']);
            ws.cell(index+2, 5).string(value['SORTATION']);
            ws.cell(index+2, 6).string(value['DEFINITION']);
            ws.cell(index+2, 7).string(value['WRITEDATE']);
          });
          wb.write('word.xlsx', response);

      }
    );
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