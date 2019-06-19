var express = require('express');
var app = express();
var controller = require('/metaSystem/routes/domain/controller.js');

/**
 * 리스트 조회
 * page : 페이지 번호
 * orderTarget : seq, name, abbreviation, fullname
 * order : asc, desc
 */
app.get('/list/:page/:orderTarget/:order', controller.list);

/**
 * 키워드 검색
 */
app.post('/keywordSearch', controller.keywordSearch);

/**
 * 추가
 */
app.post('/create', controller.create);

/**
 * 수정
 * page : 페이지 번호
 */
app.post('/update/:page', controller.update);

/**
 * 삭제
 * seq : 삭제할 고유번호
 * page : 페이지번호
 */
app.get('/delete/:seq/:page', controller.delete);

/**
 * 이력 조회
 * seq : 이력 조회할 고유번호
 */
app.get('/getHistory/:seq', controller.getHistory);
/**
 * 전체 엑셀 다운로드
 */
app.get('/excelDownload', controller.excelDownload);


module.exports = app;
