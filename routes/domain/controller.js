var db = require('/metaSystem/db/info.js');
var path = require('path');
var excel = require('excel4node');
var listCount = 30;  // 한 페이지에 표시될 데이터 개수

/**
 * 리스트 조회
 */
exports.list = function (request, response, next) {
  var page = path.parse(request.params.page).base;                // 페이지 번호
  var orderTarget = path.parse(request.params.orderTarget).base;  // seq, name, abbreviation, fullname
  var order = path.parse(request.params.order).base;              // asc, desc

  if (orderTarget != 'seq' && orderTarget != 'name' && orderTarget != 'abbreviation' && orderTarget != 'fullname' && orderTarget != 'groupname') {
    orderTarget = 'seq';
  }
  if (order != 'asc' && order != 'desc') {
    order = 'asc';
  }
  var orderBy = orderTarget + " " + order;

  // 표준 도메인 조회
  db.query( // 페이징 처리를 위해 총 개수 조회
    `SELECT COUNT(*) COUNT 
     FROM   DOMAIN`, function (error, result) {
      if (error) {
        next(error);
      }
      var totalCount = result[0]['COUNT'];
      var limitStart = (page-1) * listCount;

      db.query(
        `SELECT  SEQ
                ,GROUPNAME
                ,NAME
                ,DATATYPE
                ,DATALENGTH
                ,DATADECIMAL
                ,ABBREVIATION
                ,FULLNAME
                ,IFNULL(DEFINITION, '') DEFINITION
                ,DATE_FORMAT(WRITEDATE, '%Y-%m-%d') WRITEDATE 
        FROM     DOMAIN
        ORDER BY ${orderBy}
        LIMIT    ?, ?`, [limitStart, listCount],  function (error, list) {
          if (error) {
            next(error);
          }
          response.render('/metaSystem/views/domain.ejs', {list : JSON.stringify(list), totalCount : totalCount, currentPage : page, mode : 'domain'});
        }
      );
    }
  );
};

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
  } else if ("groupName" == post.condition) {
    condition = "GROUPNAME";
  } else if ("abbreviation" == post.condition) {
    condition = "ABBREVIATION";
  } else if ("fullName" == post.condition) {
    condition = "FULLNAME";
  } 

  db.query( // 페이징 처리를 위해 총 개수 조회
    `SELECT COUNT(*) COUNT 
     FROM   DOMAIN 
     WHERE  upper(${condition}) LIKE upper(?)`, [keyword], function (error, result) {
      if (error) {
        next(error);
      }
      var totalCount = result[0]['COUNT'];
      var limitStart = (page-1) * listCount;  // 조회될 LIMIT START
      db.query(
        `SELECT  SEQ
                ,GROUPNAME
                ,NAME
                ,DATATYPE
                ,DATALENGTH
                ,DATADECIMAL
                ,ABBREVIATION
                ,FULLNAME
                ,IFNULL(DEFINITION, '') DEFINITION
                ,DATE_FORMAT(WRITEDATE, '%Y-%m-%d') WRITEDATE 
        FROM     DOMAIN
        WHERE    UPPER(${condition}) LIKE UPPER(?)
        ORDER BY ${orderBy}
        LIMIT    ?, ?
          `, [keyword, limitStart, listCount], function (error, list) {
          if (error) {
            next(error);
          }
          var result = new Object();
          result.list = list;
          result.totalCount = totalCount;
          result.currentPage = page;
          result.mode = 'domain';
          response.json(result);
        }
      );
    }
  );
}

/**
 * 추가
 * 1. DOMAIN
 * 2. DOMAINHISTORY
 */
exports.create = function (request, response, next) {
  var post = request.body;
  var totalCount = post.hdnTotalCount;
  var listCount = post.hdnListCount;
  var totalPage = Math.ceil(totalCount / listCount);
  
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
          response.redirect(`/domain/list/${totalPage}/seq/asc`);
        }
      );
    }
  );
}

/**
 * 수정
 * 1. DOMAIN 테이블 UPDATE
 * 2. DOMAINHISTORY 테이블 INSERT (이력 추가)
 */
exports.update = function (request, response, next) {
  var page = path.parse(request.params.page).base;  // 페이지 번호
  var post = request.body;

  db.query(
    `
    UPDATE DOMAIN 
    SET    GROUPNAME = ?
          ,NAME = ?
          ,DATATYPE = ?
          ,DATALENGTH = ?
          ,DATADECIMAL = ?
          ,ABBREVIATION = ?
          ,FULLNAME = ?
          ,DEFINITION = ?
          ,WRITEDATE = now()
    WHERE SEQ = ?`, 
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
          response.redirect(`/domain/list/${page}/seq/asc`);
        }
      );
    }
  );
}

/**
 * 삭제
 * 1. DOMAINHISTORY
 * 2. DOMAIN
 */
exports.delete = function (request, response, next) {
  var seq = path.parse(request.params.seq).base;    // 삭제할 고유번호
  var page = path.parse(request.params.page).base;  // 페이지번호
  
  db.query('DELETE FROM DOMAINHISTORY WHERE DOMAINSEQ=?', [seq], function(error, result) {  // 도메인 이력 테이블 삭제
    if (error) {
      next(error);
    } 
    db.query('DELETE FROM DOMAIN WHERE SEQ=?', [seq], function(error, result) { // 도메인 테이블 삭제
      if (error) {
        next(error);
      } 
      response.redirect(`/domain/list/${page}/seq/asc`);
    });
  });
}

/**
 * 이력 조회
 */
exports.getHistory = function (request, response, next) {
    var seq = path.parse(request.params.seq).base;  // 이력 조회할 고유번호
    db.query(  // 도메인 이력 테이블 조회
      `SELECT  SEQ
              ,GROUPNAME
              ,NAME
              ,DATATYPE
              ,DATALENGTH
              ,DATADECIMAL
              ,ABBREVIATION
              ,FULLNAME
              ,IFNULL(DEFINITION, '') DEFINITION
              ,WRITEID
              ,DATE_FORMAT(WRITEDATE, '%Y-%m-%d') WRITEDATE 
      FROM     DOMAINHISTORY
      WHERE    DOMAINSEQ = ?
      ORDER BY SEQ DESC`, [seq], function (error, historyList) {
        if (error) {
          next(error);
        }
        response.json(historyList);
    });
}

/**
 * 전체 엑셀 다운로드
 */
exports.excelDownload = function (request, response, next) {
  db.query(  // 도메인 전체 조회
    `SELECT  GROUPNAME
            ,NAME
            ,DATATYPE
            ,DATALENGTH
            ,DATADECIMAL
            ,ABBREVIATION
            ,FULLNAME
            ,IFNULL(DEFINITION, '') DEFINITION
            ,DATE_FORMAT(WRITEDATE, '%Y-%m-%d') WRITEDATE 
    FROM    DOMAIN`, function (error, list) {
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
        ws.cell(1, 8).string('수정일');

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
        wb.write('domain.xlsx', response);
      } 
  );
}
