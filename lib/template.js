module.exports = {
  theme:function (mode, list) {
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
    var selectOption = "";
    if ("word" == mode) {
      selectOption = `
      <option value="name">단어명</option>
      <option value="abbreviation">영문약어명</option>
      <option value="fullName">영문명</option>
      `;

      modalContent = `
        <input type="hidden" id="wordSeq" name="wordSeq" />
        <div class="form-group">
          <label class="col-sm-2 control-label">단어명</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="wordName" name="wordName" placeholder="단어"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">영문약어명</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="wordAbbreviation" name="wordAbbreviation" placeholder="영문약어명"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">영문명</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="wordFullName" name="wordFullName" placeholder="영문명"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">구분</label>
          <div class="col-sm-10">
            <select class="form-control" id="wordSortation" name="wordSortation">
              <option value="수식어">수식어</option>
              <option value="도메인">도메인</option>
            </select>
          </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">정의</label>
            <div class="col-sm-10"><input type="text" class="form-control" id="wordDefinition" name="wordDefinition" placeholder="정의"></div>
          </div>
                `;
    } else if ("domain" == mode) {
      selectOption = `
      <option value="groupName">그룹명</option>
      <option value="name">도메인명</option>
      <option value="abbreviation">영문약어명</option>
      <option value="fullName">영문명</option>
      `;
      modalContent = `
        <input type="hidden" id="domainSeq" name="domainSeq" />
        <div class="form-group">
          <label class="col-sm-2 control-label">그룹명</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="domainGroupName" name="domainGroupName" placeholder="그룹명"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">도메인명</label>
          <div class="col-sm-8"><input type="text" class="form-control" id="domainName" name="domainName" placeholder="도메인명"></div>
          <button type="button" class="btn btn-default" id="checkDomainNameBtn">확인</button>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">영문약어명</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="domainAbbreviation" name="domainAbbreviation" placeholder="영문약어명"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">영문명</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="domainFullName" name="domainFullName" placeholder="영문명"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">데이터타입</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="domainDataType" name="domainDataType" placeholder="데이터타입"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">길이</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="domainDataLength" name="domainDataLength" placeholder="길이"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">소수</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="domainDataDecimal" name="domainDataDecimal" placeholder="소수"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">정의</label>
          <div class="col-sm-10"><input type="text" class="form-control" id="domainDefinition" name="domainDefinition" placeholder="정의"></div>
        </div>
        `;
    }
    for (var i=0;i<list.length;i++) {
      if ("word" == mode) {
        data += 
      `
          <td class="text-center" onclick="getInfoForUpdate('word', ${num})">${num}</td>
          <td onclick="getInfoForUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['NAME']}</td>
          <td onclick="getInfoForUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['ABBREVIATION']}</td>
          <td onclick="getInfoForUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['FULLNAME']}</td>
          <td class="text-center" onclick="getInfoForUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['SORTATION']}</td>
          <td onclick="getInfoForUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['DEFINITION']}</td>
          <td class="text-center" onclick="getInfoForUpdate(${list[i]['SEQ']}, '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['SORTATION']}', '${list[i]['DEFINITION']}')">${list[i]['WRITEDATE']}</td>
          <td class="text-center"><button type="button" class="btn btn-danger" onclick="deleteProcess('word', ${list[i]['SEQ']});">삭제</button>&nbsp;<button type="button" class="btn btn-default" onclick="getHistory('word', ${list[i]['SEQ']});">이력</button></th>
        </tr>
      `;
      
      } else if ("domain" == mode) {
        data += 
        `
          <tr>
            <td class="text-center" onclick="getDomainInfoForUpdate(${list[i]['SEQ']}, '${list[i]['GROUPNAME']}', '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['DATATYPE']}', ${list[i]['DATALENGTH']}, ${list[i]['DATADECIMAL']}, '${list[i]['DEFINITION']}')";>${num}</td>
            <td onclick="getDomainInfoForUpdate(${list[i]['SEQ']}, '${list[i]['GROUPNAME']}', '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['DATATYPE']}', ${list[i]['DATALENGTH']}, ${list[i]['DATADECIMAL']}, '${list[i]['DEFINITION']}')";>${list[i]['GROUPNAME']}</td>
            <td onclick="getDomainInfoForUpdate(${list[i]['SEQ']}, '${list[i]['GROUPNAME']}', '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['DATATYPE']}', ${list[i]['DATALENGTH']}, ${list[i]['DATADECIMAL']}, '${list[i]['DEFINITION']}')";>${list[i]['NAME']}</td>
            <td onclick="getDomainInfoForUpdate(${list[i]['SEQ']}, '${list[i]['GROUPNAME']}', '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['DATATYPE']}', ${list[i]['DATALENGTH']}, ${list[i]['DATADECIMAL']}, '${list[i]['DEFINITION']}')";>${list[i]['ABBREVIATION']}</td>
            <td onclick="getDomainInfoForUpdate(${list[i]['SEQ']}, '${list[i]['GROUPNAME']}', '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['DATATYPE']}', ${list[i]['DATALENGTH']}, ${list[i]['DATADECIMAL']}, '${list[i]['DEFINITION']}')";>${list[i]['FULLNAME']}</td>
            <td onclick="getDomainInfoForUpdate(${list[i]['SEQ']}, '${list[i]['GROUPNAME']}', '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['DATATYPE']}', ${list[i]['DATALENGTH']}, ${list[i]['DATADECIMAL']}, '${list[i]['DEFINITION']}')";>${list[i]['DATATYPE']}(${list[i]['DATALENGTH']}, ${list[i]['DATADECIMAL']})</td>
            <td onclick="getDomainInfoForUpdate(${list[i]['SEQ']}, '${list[i]['GROUPNAME']}', '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['DATATYPE']}', ${list[i]['DATALENGTH']}, ${list[i]['DATADECIMAL']}, '${list[i]['DEFINITION']}')";>${list[i]['DEFINITION']}</td>
            <td class="text-center" onclick="getDomainInfoForUpdate(${list[i]['SEQ']}, '${list[i]['GROUPNAME']}', '${list[i]['NAME']}', '${list[i]['ABBREVIATION']}', '${list[i]['FULLNAME']}', '${list[i]['DATATYPE']}', ${list[i]['DATALENGTH']}, ${list[i]['DATADECIMAL']}, '${list[i]['DEFINITION']}')";>${list[i]['WRITEDATE']}</td>
            <td class="text-center"><button type="button" class="btn btn-danger" onclick="deleteProcess('domain', ${list[i]['SEQ']});">삭제</button>&nbsp;<button type="button" class="btn btn-default" onclick="getHistory('domain', ${list[i]['SEQ']});">이력</button></th>
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
        <link rel="icon" href="/bootstrap/docs/shinsegae.JPG">
        <title>Meta System</title>

        <!-- Bootstrap core CSS -->
        <link href="/css/bootstrap.min.css" rel="stylesheet">
      </head>

      <body>
        <nav class="navbar navbar-inverse navbar-fixed-top">
          <div class="container">
            <div class="navbar-header">
              <a class="navbar-brand" href="/">데이터 표준화</a>
            </div>
            <div id="navbar" class="collapse navbar-collapse">
              <ul class="nav navbar-nav">
                <li id="navWord"><a href="/word">표준단어</a></li>
                <li id="navDomain"><a href="/domain">표준도메인</a></li>
              </ul>
            </div><!--/.nav-collapse -->
          </div>
        </nav>

        <div class="container" style="margin-top:60px;">
          <form class="form-inline pull-right" style="margin-bottom:10px;">
            <div class="form-group">
              <select class="form-control" id="searchCondition">
                ${selectOption}
              </select>
              <input type="text" id="keyword" placeholder="키워드" class="form-control">
              <button type="button" class="btn btn-success" id="searchBtn">검색</button>
            </div>
          </form>
          <table class="table table-bordered table-hover" id="listTbl">
            ${data}
          </table>
          <!-- Button trigger modal -->
          <button type="button" class="btn btn-default pull-right" style="margin-right:5px;">엑셀 다운로드</button>
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
            
            // 메뉴바 하이라이트 표기
            var pathName = $(location).attr('pathname').split('/')[1];
            if ("word" == pathName) {
              $("#navWord").addClass("active");
              $("#navDomain").removeClass("active");
            } else if ("domain" == pathName) {
              $("#navWord").removeClass("active");
              $("#navDomain").addClass("active");
            }

            // 추가 버튼 클릭
            $("#addBtn").click(function() {
              $("#wordName").val("");
              $("#wordAbbreviation").val("");
              $("#wordFullName").val("");
              $("#wordSortation").val("수식어");
              $("#wordDefinition").val("");
              $("#myModalLabel").text("추가");
              $("#executeBtn").text("추가");
              $("#executeForm").attr("action", "/create/"+pathName);
              $('#myModal').modal('show'); 
            });

            $("#executeBtn").click(function() {
              $("#executeForm").submit();
            });
            
            $("#checkDomainNameBtn").click(function () {
              var data = new Object();
              data.condition =  "name";
              data.keyword = $("#domainName").val();
              data.whereMode = "equal";
              $.ajax({
                url:"/keywordSearch",
                type:'post',
                data: data,
                dataType:'json',
                success:function(data){
                  $.each(data, function(key, value){
                  });

                  if (0 >= data.length) {
                    alert('표준 단어명에 있는 단어만 입력가능합니다.');
                    $("#domainName").val("");
                    $("#domainName").focus();
                  } else {
                    $("#domainAbbreviation").val(data[0].ABBREVIATION);
                    $("#domainFullName").val(data[0].FULLNAME);
                  }
                }
              });
            }); 

            $("#searchBtn").click(function () {
              var pathName = $(location).attr('pathname').split('/')[1];
              var data = new Object();
              data.condition =  $("#searchCondition").val();
              data.keyword = $("#keyword").val();

              if ('word' == pathName) {
                $.ajax({
                  url:"/keywordSearch/word",
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
                    var mode = "'word'";
                    $.each(data, function(key, value){
                      list += '<tr>';
                      list += '<td class="text-center">'+ number + '</td>';
                      list += '<td>'+ value.NAME + '</td>';
                      list += '<td>'+ value.ABBREVIATION + '</td>';
                      list += '<td>'+ value.FULLNAME + '</td>';
                      list += '<td class="text-center">'+ value.SORTATION + '</td>';
                      list += '<td>'+ value.DEFINITION + '</td>';
                      list += '<td class="text-center">'+ value.WRITEDATE + '</td>';
                      list += '<td class="text-center"><button type="button" class="btn btn-danger" onclick="deleteProcess('+mode+','+  value.SEQ + ');">삭제</button>&nbsp;<button type="button" class="btn btn-default" onclick="getHistory('+mode+','+  value.SEQ + ');">이력</button></td>';
                      list += '</tr>';
                      number++;
                    });
                    $("#listTbl").html(list);
                  }
                });
              } else if ('domain' == pathName) {
                $.ajax({
                  url:"/keywordSearch/domain",
                  type:'post',
                  data: data,
                  dataType:'json',
                  success:function(data){
                    var list = '<tr>'
                      +'<th class="text-center">순번</td>'
                      +'<th class="text-center">그룹명</td>'
                      +'<th class="text-center">도메인명</td>'
                      +'<th class="text-center">영문약어명</td>'
                      +'<th class="text-center">영문명</td>'
                      +'<th class="text-center">데이터타입</td>'
                      +'<th class="text-center">정의</td>'
                      +'<th class="text-center">작성일</td>'
                      +'<th class="text-center">삭제/이력관리</th>'
                    +'<tr>';
                    var number = 1;
                    var mode = "'domain'";
                    $.each(data, function(key, value){
                      list += '<tr>';
                      list += '<td class="text-center">'+ number + '</td>';
                      list += '<td>'+ value.GROUPNAME + '</td>';
                      list += '<td>'+ value.NAME + '</td>';
                      list += '<td>'+ value.ABBREVIATION + '</td>';
                      list += '<td>'+ value.FULLNAME + '</td>';
                      list += '<td class="text-center">'+ value.DATATYPE + '('+ value.DATALENGTH +','+value.DATADECIMAL+')</td>';
                      list += '<td>'+ value.DEFINITION + '</td>';
                      list += '<td class="text-center">'+ value.WRITEDATE + '</td>';
                      list += '<td class="text-center"><button type="button" class="btn btn-danger" onclick="deleteProcess('+mode+','+  value.SEQ + ');">삭제</button>&nbsp;<button type="button" class="btn btn-default" onclick="getHistory('+mode+','+  value.SEQ + ');">이력</button></td>';
                      list += '</tr>';
                      number++;
                    });
                    $("#listTbl").html(list);
                  }
                });
              }
            });
          });
  
          
          function getInfoForUpdate(seq, name, abbreviation, fullName, sortation, definition) {
            $("#wordSeq").val(seq);
            $("#wordName").val(name);
            $("#wordAbbreviation").val(abbreviation);
            $("#wordFullName").val(fullName);
            $("#wordSortation").val(sortation);
            $("#wordDefinition").val(definition);
            $("#myModalLabel").text("수정");
            $("#executeBtn").text("수정");
            $("#executeForm").attr("action", "/update/word");
            $('#myModal').modal('show'); 
          }


          function getDomainInfoForUpdate(seq, groupName, name, abbreviation, fullName, dataType, dataLength, dataDecimal, definition) {
            $("#domainSeq").val(seq);
            $("#domainGroupName").val(groupName);
            $("#domainName").val(name);
            $("#domainAbbreviation").val(abbreviation);
            $("#domainFullName").val(fullName);
            $("#domainDataType").val(dataType);
            $("#domainDataLength").val(dataLength);
            $("#domainDataDecimal").val(dataDecimal);
            $("#domainDefinition").val(definition);
            $("#myModalLabel").text("수정");
            $("#executeBtn").text("수정");
            $("#executeForm").attr("action", "/update/domain");
            $('#myModal').modal('show'); 
          }

          function deleteProcess(mode, seq) {
            if(confirm("삭제하시겠습니까?")) { 
              if ('word' == mode) {
                location.replace('/delete/word/'+seq); 
              } else if ('domain' == mode) {
                location.replace('/delete/domain/'+seq); 
              }
            }
          }

          function getHistory(mode, seq) {
            $.ajax({
              url:"/getHistory/"+mode+"/"+seq,
              dataType:'json',
              success:function(data){
                var name = "";
                if ("word" == mode) {
                  var list = '<tr>'
                  +'<th class="text-center">단어명</td>'
                  +'<th class="text-center">영문약어명</td>'
                  +'<th class="text-center">영문명</td>'
                  +'<th class="text-center">구분</td>'
                  +'<th class="text-center">정의</td>'
                  +'<th class="text-center">작성자</td>'
                  +'<th class="text-center">작성일</th>'
                +'<tr>';
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
                } else if ("domain" == mode) {
                  var list = '<tr>'
                  +'<th class="text-center">그룹명</td>'
                  +'<th class="text-center">도메인명</td>'
                  +'<th class="text-center">영문약어명</td>'
                  +'<th class="text-center">영문명</td>'
                  +'<th class="text-center">데이터타입</td>'
                  +'<th class="text-center">정의</td>'
                  +'<th class="text-center">작성자</td>'
                  +'<th class="text-center">작성일</th>'
                  +'<tr>';
                  $.each(data, function(key, value){
                    list += '<tr>';
                    list += '<td>'+ value.GROUPNAME + '</td>';
                    list += '<td>'+ value.NAME + '</td>';
                    list += '<td>'+ value.ABBREVIATION + '</td>';
                    list += '<td>'+ value.FULLNAME + '</td>';
                    list += '<td class="text-center">'+ value.DATATYPE + '('+ value.DATALENGTH +','+value.DATADECIMAL+')</td>';
                    list += '<td>'+ value.DEFINITION + '</td>';
                    list += '<td class="text-center">'+ value.WRITEID + '</td>';
                    list += '<td class="text-center">'+ value.WRITEDATE + '</td>';
                    list += '</tr>';
                    name = value.NAME;
                  });
                }

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
