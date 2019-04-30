module.exports = {
    HTML:function(title, list, body, control){
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
      </body>
      </html>
      `;
    },list:function(filelist){
      var list = '<ul>';
      var i = 0;
      while(i < filelist.length){
        list = list + `<li><a href="/page/${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
      }
      list = list+'</ul>';
      return list;
    },theme:function (list) {
      var wordList = '';
      for (var i=0;i<list.length;i++) {
        wordList += 
        `
          <tr>
            <td class="text-center" onclick="clickUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['SEQ']}</td>
            <td onclick="clickUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['NAME']}</td>
            <td onclick="clickUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['ABBREVIATION']}</td>
            <td onclick="clickUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['FULLNAME']}</td>
            <td class="text-center" onclick="clickUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['SORTATION']}</td>
            <td onclick="clickUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['DEFINITION']}</td>
            <td class="text-center" onclick="clickUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['WRITEDATE']}</td>
            <td class="text-center"><button type="button" class="btn btn-danger" onclick="deleteProcess(${list[i]['SEQ']});">삭제</button>&nbsp;<button type="button" class="btn btn-default">이력</button></th>
          </tr>
        `;
      }
      return `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="icon" href="/bootstrap/docs/favicon.ico">
          <title>Meta System</title>
  
          <!-- Bootstrap core CSS -->
          <link href="/css/bootstrap.min.css" rel="stylesheet">
        </head>
  
        <body>
          <nav class="navbar navbar-inverse navbar-fixed-top">
            <div class="container">
              <div class="navbar-header">
                <a class="navbar-brand" href="#">데이터 표준화</a>
              </div>
              <div id="navbar" class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                  <li class="active"><a href="/mode/word">표준단어</a></li>
                  <li><a href="#">표준도메인</a></li>
                  <li><a href="#">표준속성</a></li>
                  <li><a href="#">표준용어</a></li>
                </ul>
              </div><!--/.nav-collapse -->
            </div>
          </nav>
  
          <div class="container" style="margin-top:60px;">
            <table class="table table-bordered table-hover">
              <tr>
                <th class="text-center">순번</td>
                <th class="text-center">단어명</td>
                <th class="text-center">영문약어명</td>
                <th class="text-center">영문명</td>
                <th class="text-center">구분</td>
                <th class="text-center">정의</td>
                <th class="text-center">작성일</td>
                <th class="text-center">삭제/이력관리</th>
              <tr>
              ${wordList}
            </table>
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-default pull-right" style="margin-right:5px;">엑셀 Import</button>
            <button type="button" class="btn btn-primary pull-right" data-toggle="modal" id="addBtn" style="margin-right:5px;">추가</button>
            <!-- Modal -->
            <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">추가</h4>
                  </div>
                  <form class="form-horizontal" id="executeForm" action="/createWord" method="post">
                  <div class="modal-body">
                    <input type="hidden" id="seq" name="seq" />
                    <div class="form-group">
                      <label for="inputEmail3" class="col-sm-2 control-label">단어명</label>
                      <div class="col-sm-10"><input type="text" class="form-control" id="name" name="name" placeholder="단어"></div>
                    </div>
                    <div class="form-group">
                      <label for="inputEmail3" class="col-sm-2 control-label">영문약어명</label>
                      <div class="col-sm-10"><input type="text" class="form-control" id="abbreviation" name="abbreviation" placeholder="영문약어명"></div>
                    </div>
                    <div class="form-group">
                      <label for="inputEmail3" class="col-sm-2 control-label">영문명</label>
                      <div class="col-sm-10"><input type="text" class="form-control" id="fullName" name="fullName" placeholder="영문명"></div>
                    </div>
                    <div class="form-group">
                      <label for="inputEmail3" class="col-sm-2 control-label">구분</label>
                      <div class="col-sm-10">
                        <select class="form-control" id="sortation" name="sortation">
                          <option value="수식어">수식어</option>
                          <option value="도메인">도메인</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="inputEmail3" class="col-sm-2 control-label">정의</label>
                      <div class="col-sm-10"><input type="text" class="form-control" id="definition" name="definition" placeholder="정의"></div>
                    </div>
                  
                  </div>
                  <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" id="executeBtn">추가</button>
                  </div>
                  </form>
                </div>
              </div>
            </div>
          </div><!-- /.container -->
          <script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha384-nvAa0+6Qg9clwYCGGPpDQLVpLNn0fRaROjHqs13t4Ggj3Ez50XnGQqc/r8MhnRDZ" crossorigin="anonymous"></script>
          <script src="/js/bootstrap.min.js"></script>
          <script>
            $(document).ready(function () {
              $("#addBtn").click(function() {
                $("#name").val(name);
                $("#abbreviation").val("");
                $("#fullName").val("");
                $("#sortation").val("수식어");
                $("#definition").val("");
                $("#myModalLabel").text("추가");
                $("#executeBtn").text("추가");
                $("#executeForm").attr("action", "/createWord");
                $('#myModal').modal('show'); 
              });
            });
  
            function clickUpdate(seq, name, abbreviation, fullName, sortation, definition) {
              $("#seq").val(seq);
              $("#name").val(name);
              $("#abbreviation").val(abbreviation);
              $("#fullName").val(fullName);
              $("#sortation").val(sortation);
              $("#definition").val(definition);
              $("#myModalLabel").text("수정");
              $("#executeBtn").text("수정");
              $("#executeForm").attr("action", "/updateWord");
              $('#myModal').modal('show'); 
            }
  
            function deleteProcess(seq) {
              if(confirm("선택한 단어를 삭제하시겠습니까?")) { 
                location.replace('/deleteWord/'+seq); 
              }
  
            }
          </script>
        </body>
        
      </html>`;
    }
  }
  