var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/bootstrap', express.static('/metaSystem/views/bootstrap-3.3.2'));
app.use('/views', express.static('/metaSystem/views/'));
//app.set('view engine', 'ejs');
app.set('views', '/metaSystem/views');

/**
 * root 접근 → index 페이지 호출
 */
app.get('/', function (request, response) {
  response.render('index.ejs');
});

/* 표준단어, 표준도메인 라우터 분리 */

/**
 * 표준 단어 처리
 */
app.use('/word', require('/metaSystem/routes/word/index.js'));

/**
 * 표준 도메인 처리
 */
app.use('/domain', require('/metaSystem/routes/domain/index.js'));

/**
 * 404 에러 발생시
 */
app.use(function(request, response, next) {
  response.status(404).send('경로를 찾을 수 없습니다!');
});

/**
 * 500 에러 발생시
 */
app.use(function (error, request, response, next) {
  console.error(error.stack);
  response.status(500).send('500: Something broke!');
});

app.listen(3000);