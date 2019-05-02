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
  }, theme:function (mode, list) {
    var thDataList = [];
    if ("word" == mode) {
      thDataList = ['순번', '단어명', '영문약어명', '영문명', '구분', '정의', '작성일', '삭제/이력관리'];
    } else if ("domain" == mode) {
      thDataList = ['순번', '그룹명', '도메인명', '영문약어명', '영문명', '데이터타입', '정의', '작성일', '삭제/이력관리'];
    }

    var data = '<tr>';
    thDataList.forEach(function (item, index, array) {
      data += '<th class="text-center">' + item + '</td>';
    });
    data += '</tr>';

    var num = 1;
    var modalContent = "";
    if ("word" == mode) {
      modalContent = `
        <input type="hidden" id="seq" name="seq" />
        <div class="form-group">
          <label class="col-sm-2 control-label">단어명</label>
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
                `;
    } else if ("domain" == mode) {
      modalContent = `
        <input type="hidden" id="seq" name="seq" />
        <div class="form-group">
          <label class="col-sm-2 control-label">그룹명</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="groupName" name="groupName" placeholder="그룹명"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">도메인명</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="name" name="name" placeholder="도메인명"></div>
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
          <label for="inputEmail3" class="col-sm-2 control-label">데이터타입</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="dataType" name="dataType" placeholder="데이터타입"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">길이</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="dataLength" name="dataLength" placeholder="길이"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">소수</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="dataDecimal" name="dataDecimal" placeholder="소수"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">정의</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="definition" name="definition" placeholder="정의"></div>
        </div>
        `;
    }
    for (var i=0;i<list.length;i++) {
      if ("word" == mode) {
        data += 
      `
        <tr>
          <td class="text-center" onclick="getWordInfoForUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${num}</td>
          <td onclick="getWordInfoForUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['NAME']}</td>
          <td onclick="getWordInfoForUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['ABBREVIATION']}</td>
          <td onclick="getWordInfoForUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['FULLNAME']}</td>
          <td class="text-center" onclick="getWordInfoForUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['SORTATION']}</td>
          <td onclick="getWordInfoForUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['DEFINITION']}</td>
          <td class="text-center" onclick="getWordInfoForUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['WRITEDATE']}</td>
          <td class="text-center"><button type="button" class="btn btn-danger" onclick="deleteProcess(${list[i]['SEQ']});">삭제</button>&nbsp;<button type="button" class="btn btn-default" onclick="getHistory(${list[i]['SEQ']});">이력</button></th>
        </tr>
      `;
      
      } else if ("domain" == mode) {
        data += 
        `
          <tr>
            <td class="text-center">${num}</td>
            <td onclick="">${list[i]['GROUPNAME']}</td>
            <td>${list[i]['NAME']}</td>
            <td>${list[i]['ABBREVIATION']}</td>
            <td>${list[i]['FULLNAME']}</td>
            <td>${list[i]['DATATYPE']}(${list[i]['DATALENGTH']}, ${list[i]['DATADECIMAL']})</td>
            <td>${list[i]['DEFINITION']}</td>
            <td>${list[i]['WRITEDATE']}</td>
            <td class="text-center"><button type="button" class="btn btn-danger" onclick="deleteProcess(${list[i]['SEQ']});">삭제</button>&nbsp;<button type="button" class="btn btn-default" onclick="getHistory(${list[i]['SEQ']});">이력</button></th>
            </tr>
        `;
      }
      num++;
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
                <li class="active" id="navWord"><a href="/word">표준단어</a></li>
                <li id="navDomain"><a href="/domain">표준도메인</a></li>
                <li id="navAttribute"><a href="#">표준속성</a></li>
                <li id="navEntity"><a href="#">표준엔티티</a></li>
              </ul>
            </div><!--/.nav-collapse -->
          </div>
        </nav>

        <div class="container" style="margin-top:60px;">
          <form class="form-inline pull-right" style="margin-bottom:10px;">
            <div class="form-group">
              <select class="form-control" id="searchCondition">
                <option value="name">단어명</option>
                <option value="abbreviation">영문약어명</option>
                <option value="fullName">영문명</option>
              </select>
              <input type="text" id="keyword" placeholder="키워드" class="form-control">
              <button type="button" class="btn btn-success" id="searchBtn">검색</button>
            </div>
          </form>
          <table class="table table-bordered table-hover" id="listTbl">
            ${data}
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
                <form class="form-horizontal" id="executeForm" action="/create" method="post">
                  <div class="modal-body">
                    ${modalContent}
                  </div>
                  <div class="modal-footer">
                    <label for="ID" class="col-sm-2 control-label">ID</label>
                    <div class="col-sm-5"><input type="text" class=" form-control" id="id" name="id" placeholder="ID"></div>
                    <button type="button" class="btn btn-primary" id="executeBtn">추가</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <!-- Modal -->
          <div class="modal fade" id="historyModal" tabindex="-1" role="dialog" aria-labelledby="historyModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 class="modal-title" id="historyModalLabel"></h4>
                </div>
                <div class="modal-body">
                  <table class="table table-bordered table-hover" id="historyTbl">
                  </table>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div><!-- /.container -->
        <script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha384-nvAa0+6Qg9clwYCGGPpDQLVpLNn0fRaROjHqs13t4Ggj3Ez50XnGQqc/r8MhnRDZ" crossorigin="anonymous"></script>
        <script src="/js/bootstrap.min.js"></script>
        <script>
          $(document).ready(function () {
            
            var pathName = $(location).attr('pathname').split('/')[1];
            if ("word" == pathName) {
              $("#navWord").addClass("active");
              $("#navDomain").removeClass("active");
              $("#navAttribute").removeClass("active");
              $("#navEntity").removeClass("active");
            } else if ("domain" == pathName) {
              $("#navWord").removeClass("active");
              $("#navDomain").addClass("active");
              $("#navAttribute").removeClass("active");
              $("#navEntity").removeClass("active");
            } else if ("attribute" == pathName) {
              $("#navWord").removeClass("active");
              $("#navDomain").removeClass("active");
              $("#navAttribute").addClass("active");
              $("#navEntity").removeClass("active");
            } else if ("entity" == pathName) {
              $("#navWord").removeClass("active");
              $("#navDomain").removeClass("active");
              $("#navAttribute").removeClass("active");
              $("#navEntity").addClass("active");
            }

            $("#addBtn").click(function() {
              $("#name").val(name);
              $("#abbreviation").val("");
              $("#fullName").val("");
              $("#sortation").val("수식어");
              $("#definition").val("");
              $("#myModalLabel").text("추가");
              $("#executeBtn").text("추가");
              $("#executeForm").attr("action", "/create");
              $('#myModal').modal('show'); 
            });
            $("#executeBtn").click(function() {
              $("#executeForm").attr("action", "/create/"+pathName);
              $("#executeForm").submit();
            });
            
            $("#searchBtn").click(function () {
              var data = new Object();
              data.condition =  $("#searchCondition").val();
              data.keyword = $("#keyword").val();
              console.log(data);
              $.ajax({
                url:"/keywordSearch",
                type:'post',
                data: data,
                dataType:'json',
                success:function(data){
                  var list = '<tr>'
                    +'<th class="text-center">순번</td>'
                    +'<th class="text-center">단어명</td>'
                    +'<th class="text-center">영문약어명</td>'
                    +'<th class="text-center">영문명</td>'
                    +'<th class="text-center">구분</td>'
                    +'<th class="text-center">정의</td>'
                    +'<th class="text-center">작성일</td>'
                    +'<th class="text-center">삭제/이력관리</th>'
                  +'<tr>';
                  var number = 1;
                  $.each(data, function(key, value){
                    list += '<tr>';
                    list += '<td class="text-center">'+ number + '</td>';
                    list += '<td>'+ value.NAME + '</td>';
                    list += '<td>'+ value.ABBREVIATION + '</td>';
                    list += '<td>'+ value.FULLNAME + '</td>';
                    list += '<td class="text-center">'+ value.SORTATION + '</td>';
                    list += '<td>'+ value.DEFINITION + '</td>';
                    list += '<td class="text-center">'+ value.WRITEDATE + '</td>';
                    list += '<td class="text-center"><button type="button" class="btn btn-danger" onclick="deleteProcess(' + value.SEQ + ');">삭제</button>&nbsp;<button type="button" class="btn btn-default" onclick="getHistory(' + value.SEQ + ');">이력</button></td>';
                    list += '</tr>';
                    number++;
                  });
                  $("#listTbl").html(list);
                }
              });
            });
          });

          function getWordInfoForUpdate(seq, name, abbreviation, fullName, sortation, definition) {
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

          function getHistory(seq) {
            $.ajax({
              url:"/getHistory/word/"+seq,
              dataType:'json',
              success:function(data){
                var list = '<tr>'
                  +'<th class="text-center">단어명</td>'
                  +'<th class="text-center">영문약어명</td>'
                  +'<th class="text-center">영문명</td>'
                  +'<th class="text-center">구분</td>'
                  +'<th class="text-center">정의</td>'
                  +'<th class="text-center">작성자</td>'
                  +'<th class="text-center">작성일</th>'
                +'<tr>';
                var name = "";
                $.each(data, function(key, value){
                  list += '<tr>';
                  list += '<td>'+ value.NAME + '</td>';
                  list += '<td>'+ value.ABBREVIATION + '</td>';
                  list += '<td>'+ value.FULLNAME + '</td>';
                  list += '<td class="text-center">'+ value.SORTATION + '</td>';
                  list += '<td>'+ value.DEFINITION + '</td>';
                  list += '<td class="text-center">'+ value.WRITEID + '</td>';
                  list += '<td class="text-center">'+ value.WRITEDATE + '</td>';
                  list += '</tr>';
                  name = value.NAME;
                });
                $("#historyModalLabel").text(name+" 이력");
                $("#historyTbl").html(list);
                $("#historyModal").modal('show');
              }
            });
          }
        </script>
      </body>
    </html>`;
  }
}
