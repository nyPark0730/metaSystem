var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/bootstrap', express.static('/metaSystem/views/bootstrap-3.3.2'));
app.use('/views', express.static('/metaSystem/views/'));
app.set('view engine', 'ejs');
app.set('views', '/metaSystem/views');

/**
 * root 접근 → 표준단어를 default 페이지로 설정
 */
app.get('/', function (request, response) {
  response.render('index.ejs');
});

/**
 * 단어
 */
app.use('/word', require('/metaSystem/routes/word/index.js'));

/**
 * 도메인
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