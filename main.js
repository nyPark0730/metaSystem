var express = require('express');
var app = express();
var path = require('path');
var db = require('./lib/db.js');
//var template = require('./lib/template.js');
var bodyParser = require('body-parser');
var excel = require('excel4node');
var listCount = 5;  // 한 페이지에 표시될 데이터 개수
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
  response.redirect('/word/1');
});

/**
 * 전체 엑셀 다운로드
 * mode : word, domain
 */
app.get('/excelDownload/:mode/', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
  if ('word' == mode) { // 단어 전체 조회
    db.query(
      `SELECT 
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
          wb.write(mode+'.xlsx', response);
        }
    );
  } else if ('domain' == mode) {
    db.query(  // 도메인 전체 조회
      `SELECT 
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
          var wb = new excel.Workbook();
          var ws = wb.addWorksheet('표준단어');
          
          ws.cell(1, 1).string('순번');
          ws.cell(1, 2).string('그룹명');
          ws.cell(1, 3).string('도메인명');
          ws.cell(1, 4).string('영문약어명');
          ws.cell(1, 5).string('영문명');
          ws.cell(1, 6).string('데이터타입');
          ws.cell(1, 7).string('정의');
          ws.cell(1, 8).string('작성일');

          list.forEach(function(value, index){
            ws.cell(index+2, 1).number(index+1);
            ws.cell(index+2, 2).string(value['GROUPNAME']);
            ws.cell(index+2, 3).string(value['NAME']);
            ws.cell(index+2, 4).string(value['ABBREVIATION']);
            ws.cell(index+2, 5).string(value['FULLNAME']);
            ws.cell(index+2, 6).string(value['DATATYPE']+"("+value['DATALENGTH']+","+value['DATADECIMAL']+")");
            ws.cell(index+2, 7).string(value['DEFINITION']);
            ws.cell(index+2, 8).string(value['WRITEDATE']);
          });
          wb.write(mode+'.xlsx', response);
        } 
    );
  }
});

/**
 * 메뉴별 접근
 * mode : word, domain
 * page : 페이지 번호
 */ 
app.get('/:mode/:page', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
  var page = path.parse(request.params.page).base;
  
  if ("word" == mode) { // 표준 단어 조회
    db.query( // 페이징 처리를 위해 총 개수 조회
      `SELECT COUNT(*) COUNT FROM WORD`, function (error, result) {
        if (error) {
          next(error);
        }
        var totalCount = result[0]['COUNT'];
        var limitStart = (page-1) * listCount;  // 조회될 LIMIT START

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
            response.render('word.ejs', {list : JSON.stringify(list), totalCount : totalCount, currentPage : page, mode : mode});
          }
        );
      }
    );
  } else if ("domain" == mode) {  // 표준 도메인 조회
    db.query( // 페이징 처리를 위해 총 개수 조회
      `SELECT COUNT(*) COUNT FROM DOMAIN`, function (error, result) {
        if (error) {
          next(error);
        }
        var totalCount = result[0]['COUNT'];
        var limitStart = (page-1) * listCount;

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
            LIMIT ?, ?`, [limitStart, listCount],  function (error, list) {
            if (error) {
              next(error);
            }
            //var html = template.theme("word", list);
            response.render('domain.ejs', {list : JSON.stringify(list), totalCount : totalCount, currentPage : page, mode : mode});
          }
        );
      }
    );
  } else {
    response.status(404).send('404: Sorry cant find that!');
  }
});

/**
 * 추가
 * mode : word, domain
 */
app.post('/create/:mode', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
  var post = request.body;

  if ("word" == mode) { // 표준 단어 추가
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
            response.redirect(`/word/1`);
          }
        );
      }
    );
  } else if ("domain" == mode) {  // 표준 도메인 추가
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
            response.redirect(`/domain/1`);
          }
        );
      }
    );
  } 
});

/**
 * 수정
 * mode : word, domain
 * page : 페이지 번호
 */
app.post('/update/:mode/:page', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
  var page = path.parse(request.params.page).base;
  var post = request.body;

  if ("word" == mode) { // 표준 단어 수정
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
  
        db.query( // 단어 이력 테이블에 이력 추가
          `
          INSERT INTO WORDHISTORY (WORDSEQ, NAME, ABBREVIATION, FULLNAME, SORTATION, DEFINITION, WRITEID, WRITEDATE, SYSTEM)
          VALUES(?, ?, ?, ?, ?, ?, ?, now(), '0')`, 
          [post.wordSeq, post.wordName, post.wordAbbreviation, post.wordFullName, post.wordSortation, post.wordDefinition, post.id],
          function (error, result) {
            if(error) {
              next(error);
            }
            response.redirect(`/word/${page}`);
          }
        );
      }
    );
  } else if ("domain" == mode) {  // 표준 도메인 수정
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
        db.query( // 도메인 이력 테이블에 이력 추가
          `
          INSERT INTO DOMAINHISTORY (DOMAINSEQ, GROUPNAME, NAME, DATATYPE, DATALENGTH, DATADECIMAL, ABBREVIATION, FULLNAME, DEFINITION, WRITEID, WRITEDATE, SYSTEM)
          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), '0')`, 
          [post.domainSeq, post.domainGroupName, post.domainName, post.domainDataType, post.domainDataLength, post.domainDataDecimal, post.domainAbbreviation, post.domainFullName, post.domainDefinition, post.id],
          function (error, result) {
            if(error) {
              next(error);
            }
            response.redirect(`/domain/${page}`);
          }
        );
      }
    );
  } 
});

/**
 * 삭제
 * mode : word, domain
 * seq : 삭제할 고유번호
 * page : 페이지번호
 */

app.get('/delete/:mode/:seq/:page', function (request, response, next) {
  var seq = path.parse(request.params.seq).base;
  var mode = path.parse(request.params.mode).base;
  var page = path.parse(request.params.page).base;

  if ('word' == mode) {
    db.query('DELETE FROM WORDHISTORY WHERE WORDSEQ=?', [seq], function(error, result) {  // 단어 이력 테이블 삭제
      if (error) {
        next(error);
      } 
      db.query('DELETE FROM WORD WHERE SEQ=?', [seq], function(error, result) { // 단어 테이블 삭제
        if (error) {
          next(error);
        } 
        response.redirect(`/word/${page}`);
      });
    });
  } else if ('domain' == mode) {
    db.query('DELETE FROM DOMAINHISTORY WHERE DOMAINSEQ=?', [seq], function(error, result) {  // 도메인 이력 테이블 삭제
      if (error) {
        next(error);
      } 
      db.query('DELETE FROM DOMAIN WHERE SEQ=?', [seq], function(error, result) { // 도메인 테이블 삭제
        if (error) {
          next(error);
        } 
        response.redirect(`/domain/${page}`);
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
  var page = post.page;

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
    db.query( // 페이징 처리를 위해 총 개수 조회
      `SELECT COUNT(*) COUNT FROM WORD WHERE
      upper(${condition}) ${whereMode} upper(?)`, [keyword], function (error, result) {
        if (error) {
          next(error);
        }
        var totalCount = result[0]['COUNT'];
        var limitStart = (page-1) * listCount;  // 조회될 LIMIT START

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
          LIMIT ?, ?
            `, [keyword, limitStart, listCount], function (error, list) {
            if (error) {
              next(error);
            }

            var result = new Object();
            result.list = list;
            result.totalCount = totalCount;
            result.currentPage = page;
            result.mode = mode;
            response.json(result);
          });
      }
    );
  } else if ('domain' == mode) {

    db.query( // 페이징 처리를 위해 총 개수 조회
      `SELECT COUNT(*) COUNT FROM DOMAIN WHERE
      upper(${condition}) ${whereMode} upper(?)`, [keyword], function (error, result) {
        if (error) {
          next(error);
        }
        var totalCount = result[0]['COUNT'];
        var limitStart = (page-1) * listCount;  // 조회될 LIMIT START

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
          LIMIT ?, ?
            `, [keyword, limitStart, listCount], function (error, list) {
            if (error) {
              next(error);
            }

            var result = new Object();
            result.list = list;
            result.totalCount = totalCount;
            result.currentPage = page;
            result.mode = mode;
            response.json(result);
          });
      }
    );
  }
});

/**
 * 이력 조회
 * mode : word, domain
 * seq : 이력 조회할 고유번호
 */
app.get('/getHistory/:mode/:seq', function (request, response, next) {
  var mode = path.parse(request.params.mode).base;
  var seq = path.parse(request.params.seq).base;

  if ("word" == mode) {
    db.query(   // 단어 이력 테이블 조회
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
    db.query(  // 도메인 이력 테이블 조회
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
  response.status(404).send('404: Sorry cant find that!');
});

/**
 * 500 에러 발생시
 */
app.use(function (error, request, response, next) {
  console.error(error.stack);
  response.status(500).send('500: Something broke!');
});

app.listen(3000);