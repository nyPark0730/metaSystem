var db = require('/metaSystem/db/info.js');
var path = require('path');
var excel = require('excel4node');
var listCount = 30;  // 한 페이지에 표시될 데이터 개수

/* 기능별 모듈 생성, /metaSystem/routes/word/index.js 에서 require 하여 사용 */

/**
 * 리스트 조회
 */
exports.list = function (request, response, next) {
    var page = path.parse(request.params.page).base;                // 페이지번호
    var orderTarget = path.parse(request.params.orderTarget).base;  // seq, name, abbreviation, fullname
    var order = path.parse(request.params.order).base;              // asc, desc
    
    if (orderTarget != 'seq' && orderTarget != 'name' && orderTarget != 'abbreviation' && orderTarget != 'fullname') {
      orderTarget = 'seq';
    }
    if (order != 'asc' && order != 'desc') {
      order = 'asc';
    }
    var orderBy = orderTarget + " " + order;
  
    db.query( // 페이징 처리를 위해 총 개수 조회
        `SELECT COUNT(*) COUNT 
         FROM   WORD`, function (error, result) {
            if (error) {
                next(error);
            }
            var totalCount = result[0]['COUNT'];
            var limitStart = (page-1) * listCount;  // 조회될 LIMIT START
            db.query(
                `SELECT  (SELECT COUNT(*)FROM WORD W1 where W1.NAME=W2.NAME) WORDSAMECOUNT
                        ,(SELECT COUNT(*)FROM WORD W1 where W1.ABBREVIATION=W2.ABBREVIATION) ABBREVIATIONSAMECOUNT
                        ,(SELECT COUNT(*)FROM WORD W1 where W1.FULLNAME=W2.FULLNAME) FULLNAMESAMECOUNT
                        ,SEQ
                        ,NAME
                        ,ABBREVIATION
                        ,FULLNAME
                        ,SORTATION
                        ,IFNULL(DEFINITION, '') DEFINITION
                        ,DATE_FORMAT(WRITEDATE, '%Y-%m-%d') WRITEDATE 
                FROM    WORD W2
               ORDER BY ${orderBy}
                LIMIT   ?, ?`, [limitStart, listCount],  function (error, list) {
                    if (error) {
                        next(error);
                    }
                    response.render('/metaSystem/views/word.ejs', {list : JSON.stringify(list), totalCount : totalCount, currentPage : page, mode : 'word'});
                }
            );
        }
    );
}

/**
 * 키워드 검색
 */
exports.keywordSearch = function (request, response, next) {
    var post = request.body;
    var condition = 'NAME';
    var keyword = post.keyword;
    var whereMode = post.whereMode;
    var page = post.page;
    var orderTarget = '';
    var order = '';
  
    if (typeof(post.order) != 'undefined') {
      orderTarget = post.order.split("/")[0];
      order = post.order.split("/")[1];
    }
  
    if (orderTarget != 'seq' && orderTarget != 'name' && orderTarget != 'abbreviation' && orderTarget != 'fullname') {
      orderTarget = 'seq';
    }
    if (order != 'asc' && order != 'desc') {
      order = 'asc';
    }
    var orderBy = orderTarget + " " + order;
    if ('equal' == whereMode) {
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
  
    if ('=' == whereMode) {
    db.query(
        `SELECT  (SELECT  COUNT(*)FROM WORD W1 where W1.NAME=W2.NAME) WORDSAMECOUNT
                ,(SELECT  COUNT(*)FROM WORD W1 where W1.ABBREVIATION=W2.ABBREVIATION) ABBREVIATIONSAMECOUNT
                ,(SELECT  COUNT(*)FROM WORD W1 where W1.FULLNAME=W2.FULLNAME) FULLNAMESAMECOUNT
                ,SEQ
                ,NAME
                ,ABBREVIATION
                ,FULLNAME
                ,SORTATION
                ,IFNULL(DEFINITION, '') DEFINITION
                ,DATE_FORMAT(WRITEDATE, '%Y-%m-%d') WRITEDATE 
        FROM    WORD W2
        WHERE   upper(${condition}) = upper(?)`, [keyword], function (error, list) {
            if (error) {
                next(error);
            }
            response.json(list);
            }
        );
    } else {
        db.query( // 페이징 처리를 위해 총 개수 조회
            `SELECT COUNT(*) COUNT 
             FROM   WORD 
             WHERE  upper(${condition}) ${whereMode} upper(?)`, [keyword], function (error, result) {
            if (error) {
                next(error);
            }
            var totalCount = result[0]['COUNT'];
            var limitStart = (page-1) * listCount;  // 조회될 LIMIT START

            db.query(
                `SELECT  (SELECT  COUNT(*)FROM WORD W1 where W1.NAME=W2.NAME) WORDSAMECOUNT
                        ,(SELECT  COUNT(*)FROM WORD W1 where W1.ABBREVIATION=W2.ABBREVIATION) ABBREVIATIONSAMECOUNT
                        ,(SELECT  COUNT(*)FROM WORD W1 where W1.FULLNAME=W2.FULLNAME) FULLNAMESAMECOUNT
                        ,SEQ
                        ,NAME
                        ,ABBREVIATION
                        ,FULLNAME
                        ,SORTATION
                        ,IFNULL(DEFINITION, '') DEFINITION
                        ,DATE_FORMAT(WRITEDATE, '%Y-%m-%d') WRITEDATE 
                 FROM   WORD W2
                WHERE   upper(${condition}) ${whereMode} upper(?)
               ORDER BY ${orderBy}
                LIMIT   ?, ?`, [keyword, limitStart, listCount], function (error, list) {
                    if (error) {
                        next(error);
                    }
                    var result = new Object();
                    result.list = list;
                    result.totalCount = totalCount;
                    result.currentPage = page;
                    result.mode = 'word';
                    response.json(result);
                    }
                );
            }
        );
    }
}

/**
 * 추가
 * 1. WORD 
 * 2. WORDHISTORY
 */
exports.create = function (request, response, next) {
    var post = request.body;
    var totalCount = post.hdnTotalCount;
    var listCount = post.hdnListCount;
    var totalPage = Math.ceil(totalCount / listCount);
    
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
                    response.redirect(`/word/list/${totalPage}/seq/asc`);
                }
            );
        }
    );
}

/**
 * 수정
 * 1. WORD 테이블 UPDATE
 * 2. WORDHISTORY 테이블 INSERT (이력 추가)
 */
exports.update = function (request, response, next) {
    var page = path.parse(request.params.page).base;    // 페이지 번호
    var post = request.body;
  
    db.query(
        `
        UPDATE WORD 
        SET  NAME = ?
            ,ABBREVIATION = ?
            ,FULLNAME = ?
            ,SORTATION = ?
            ,DEFINITION = ?
            ,WRITEDATE = now()
        WHERE SEQ = ?`, 
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
                    response.redirect(`/word/list/${page}/seq/asc`);
                }
            );
        }
    );
};

/**
 * 삭제
 * 1. WORDHISTORY
 * 2. WORD
 */
exports.delete = function (request, response, next) {
    var seq = path.parse(request.params.seq).base;      // 삭제할 고유번호
    var page = path.parse(request.params.page).base;    // 페이지번호
    
    db.query('DELETE FROM WORDHISTORY WHERE WORDSEQ=?', [seq], function(error, result) {  // 단어 이력 테이블 삭제
        if (error) {
            next(error);
        } 
        db.query('DELETE FROM WORD WHERE SEQ=?', [seq], function(error, result) { // 단어 테이블 삭제
            if (error) {
                next(error);
            } 
            response.redirect(`/word/list/${page}/seq/asc`);
        });
    });
}

/**
 * 이력 조회
 */
exports.getHistory = function (request, response, next) {
    var seq = path.parse(request.params.seq).base;  // 이력 조회할 고유번호
    db.query(   // 단어 이력 테이블 조회
        `SELECT  SEQ
                ,WORDSEQ
                ,NAME
                ,ABBREVIATION
                ,FULLNAME
                ,SORTATION
                ,IFNULL(DEFINITION, '') DEFINITION
                ,WRITEID
                ,DATE_FORMAT(WRITEDATE, '%Y-%m-%d') WRITEDATE 
        FROM     WORDHISTORY
        WHERE    WORDSEQ = ?
        ORDER BY SEQ DESC`, [seq], function (error, historyList) {
            if (error) {
                next(error);
            }
            response.json(historyList);
        }
    );
}

/**
 * 전체 엑셀 다운로드
 */
exports.excelDownload = function (request, response, next) {
    db.query(
    `SELECT  (SELECT  COUNT(*)FROM WORD W1 where W1.NAME=W2.NAME) WORDSAMECOUNT
            ,(SELECT  COUNT(*)FROM WORD W1 where W1.ABBREVIATION=W2.ABBREVIATION) ABBREVIATIONSAMECOUNT
            ,(SELECT  COUNT(*)FROM WORD W1 where W1.FULLNAME=W2.FULLNAME) FULLNAMESAMECOUNT
            ,NAME
            ,ABBREVIATION
            ,FULLNAME
            ,SORTATION
            ,IFNULL(DEFINITION, '') DEFINITION
            ,DATE_FORMAT(WRITEDATE, '%Y-%m-%d') WRITEDATE 
     FROM    WORD W2`, function (error, list) {
            if (error) {
                next(error);
            }
            var wb = new excel.Workbook();
            var ws = wb.addWorksheet('표준단어');
            
            ws.cell(1, 1).string('표준단어 중복체크');
            ws.cell(1, 2).string('영문약어 중복체크');
            ws.cell(1, 3).string('영문명 중복체크');
            ws.cell(1, 4).string('순번');
            ws.cell(1, 5).string('단어명');
            ws.cell(1, 6).string('영문약어명');
            ws.cell(1, 7).string('영문명');
            ws.cell(1, 8).string('구분');
            ws.cell(1, 9).string('정의');
            ws.cell(1, 10).string('수정일');

            list.forEach(function(value, index){
                ws.cell(index+2, 1).number(value['WORDSAMECOUNT']);
                ws.cell(index+2, 2).number(value['ABBREVIATIONSAMECOUNT']);
                ws.cell(index+2, 3).number(value['FULLNAMESAMECOUNT']);
                ws.cell(index+2, 4).number(index+1);
                ws.cell(index+2, 5).string(value['NAME']);
                ws.cell(index+2, 6).string(value['ABBREVIATION']);
                ws.cell(index+2, 7).string(value['FULLNAME']);
                ws.cell(index+2, 8).string(value['SORTATION']);
                ws.cell(index+2, 9).string(value['DEFINITION']);
                ws.cell(index+2, 10).string(value['WRITEDATE']);
            });
            wb.write('word.xlsx', response);
        }
    );
}