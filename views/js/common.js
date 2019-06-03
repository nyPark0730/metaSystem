$(document).ready(function () {
  var mode = $("#mode").val();  // word: 표준단어, domain: 표준도메인
  if (mode != 'word' && mode != 'domain') {
    mode = 'word';
  }

  // 메뉴바 하이라이트 표기
  if ("word" == mode) {
    $("#navWord").addClass("active");
    $("#navDomain").removeClass("active");
  } else if ("domain" == mode) {
    $("#navWord").removeClass("active");
    $("#navDomain").addClass("active");
  }

  var pathName = $(location).attr('pathname');
  var path = pathName.split("/");
  $("#orderTarget").val(path[3]+"/"+path[4]);

  if (path[3] == "name") {
    if (path[4] == "asc") {
      if (mode == "word") {
        $("#nameOrder").text("단어명▲");
      } else {
        $("#nameOrder").text("도메인명▲");
      }
    } else {
      if (mode == "word") {
        $("#nameOrder").text("단어명▼");
      } else {
        $("#nameOrder").text("도메인명▼");
      }
    }
  } else if (path[3] == "abbreviation") {
    if (path[4] == "asc") {
      $("#abbreviationOrder").text("영문약어명▲");
    } else {
      $("#abbreviationOrder").text("영문약어명▼");
    }
  } else if (path[3] == "fullname") {
    if (path[4] == "asc") {
      $("#fullNameOrder").text("영문명▲");
    } else {
      $("#fullNameOrder").text("영문명▼");
    }
  } else if (path[3] == "groupname") {
    if (path[4] == "asc") {
      $("#groupNameOrder").text("그룹명▲");
    } else {
      $("#groupNameOrder").text("그룹명▼");
    }
  }

  $(".order").click(function () {
    var id = $(this).attr("id");
    var value = $(this).text();
    var orderTarget = "seq";
    var order = "asc";

    if (id == "nameOrder") {
      orderTarget = "name";
    } else if (id == "abbreviationOrder") {
      orderTarget = "abbreviation";
    } else if (id == "fullNameOrder") {
      orderTarget = "fullname";
    } else if (id == "groupNameOrder") {
      orderTarget = "groupname";
    }
    if (value.search("▼") >= 0) {
      order = "asc";
    } else if (value.search("▲") >= 0) {
      order = "desc";
    }
    location.replace("/"+mode+"/"+$("#currentPage").val()+"/"+orderTarget+"/"+order); 
  });

  // 페이징 함수 호출
  paging($("#totalCount").val(), $("#listCount").val(), $("#pageCount").val(), $("#currentPage").val(), mode);  

  // 추가 버튼 클릭
  $("#addBtn").click(function() {
    // modal 내 내용 초기화
    $(".modal-body").children(".form-group").children("div").children("input[type=text]").val("");
    $(".modal-body").children("input[type=hidden]").val("");
    if ("word" == mode) {
      $("#wordSortation").val("수식어");
    }
    $("#myModalLabel").text("추가");
    $("#executeBtn").text("추가");
    $("#executeForm").append("<input type='hidden' id='hdnTotalCount' name='hdnTotalCount' value='"+$("#totalCount").val()+"'/>");
    $("#executeForm").append("<input type='hidden' id='hdnListCount' name='hdnListCount' value='"+$("#listCount").val()+"'/>");
    $("#executeForm").attr("action", "/create/" + mode);
    $("#myModal").modal("show");
  });

  // 전체 엑셀 다운로드 버튼 클릭
  $("#totalExcelDownBtn").click(function() {
    location.replace("/excelDownload/" + mode);
  });

  // 현재 페이지 엑셀 다운로드 버튼 클릭
  $("#currentExcelDownBtn").click(function() {
    $('#listTbl').tableExport({fileName:mode, type:'xls', ignoreColumn: ["deleteAndHistory"]});
  });

  // 모달 내 추가/수정 버튼 클릭
  $("#executeBtn").click(function() {
    if(checkValidation()) {
      $("#executeForm").submit();
    }
  });

  // 키워드 검색
  $("#searchBtn").click(function () {
    var data = new Object();
    var searchCondition = $("#searchCondition").val();  // 조회 조건
    var keyword = $("#keyword").val();                  // 조회 키워드
    data.condition =  searchCondition;
    data.keyword = keyword;
    data.page = 1;
    data.order = $("#orderTarget").val();
    getSeachKeyword (data);   // 키워드에 맞는 목록 조회
  });

  $("#keyword").keydown(function(key) {
   if (key.keyCode == 13) {
      var data = new Object();
      var searchCondition = $("#searchCondition").val();  // 조회 조건
      var keyword = $("#keyword").val();                  // 조회 키워드
      data.condition =  searchCondition;
      data.keyword = keyword;
      data.page = 1;
      data.order = $("#orderTarget").val();
      getSeachKeyword (data);   // 키워드에 맞는 목록 조회
    }
  });
});

/**
 * 삭제
 * @param {string} mode : word, domain
 * @param {number} seq : 삭제할 고유번호
 * @param {number} page : 페이지번호
 */
function deleteProcess(mode, seq, page) {
  if(confirm("삭제하시겠습니까?")) {
    if ('word' == mode) {
      location.replace('/delete/word/'+seq+'/'+page);   // 표준단어 데이터 삭제
    } else if ('domain' == mode) {
      location.replace('/delete/domain/'+seq+'/'+page); // 표준도메인 데이터 삭제
    }
  }
}

/**
 * 이력 조회
 * @param {string} mode : word, domain
 * @param {number} seq : 이력 조회할 고유번호
 */
function getHistory(mode, seq) {
  $.ajax({
    url:"/getHistory/"+mode+"/"+seq,
    dataType:'json',
    success:function(data){
      var name = "";
      if ("word" == mode) {
        var list = '<tr>'
                    + '<th class="text-center">단어명</th>'
                    + '<th class="text-center">영문약어명</th>'
                    + '<th class="text-center">영문명</th>'
                    + '<th class="text-center">구분</th>'
                    + '<th class="text-center">정의</th>'
                    + '<th class="text-center">작성자</th>'
                    + '<th class="text-center">수정일</th>'
                 + '<tr>';
        $.each(data, function(key, value){
          list += '<tr>'
                  + '<td>'+ value.NAME + '</td>'
                  + '<td>'+ value.ABBREVIATION + '</td>'
                  + '<td>'+ value.FULLNAME + '</td>'
                  + '<td class="text-center">'+ value.SORTATION + '</td>'
                  + '<td>'+ value.DEFINITION + '</td>'
                  + '<td class="text-center">'+ value.WRITEID + '</td>'
                  + '<td class="text-center">'+ value.WRITEDATE + '</td>'
                +'</tr>';
          name = value.NAME;
       });
      } else if ("domain" == mode) {
        var list = '<tr>'
                    + '<th class="text-center">그룹명</th>'
                    + '<th class="text-center">도메인명</th>'
                    + '<th class="text-center">영문약어명</th>'
                    + '<th class="text-center">영문명</th>'
                    + '<th class="text-center">데이터타입</th>'
                    + '<th class="text-center">정의</th>'
                    + '<th class="text-center">작성자</th>'
                    + '<th class="text-center">수정일</th>'
                  +'<tr>';
        $.each(data, function(key, value){
          list += '<tr>'
                    + '<td>'+ value.GROUPNAME + '</td>'
                    + '<td>'+ value.NAME + '</td>'
                    + '<td>'+ value.ABBREVIATION + '</td>'
                    + '<td>'+ value.FULLNAME + '</td>'
                    + '<td class="text-center">'+ value.DATATYPE + '('+ value.DATALENGTH +','+value.DATADECIMAL+')</td>'
                    + '<td>'+ value.DEFINITION + '</td>'
                    + '<td class="text-center">'+ value.WRITEID + '</td>'
                    + '<td class="text-center">'+ value.WRITEDATE + '</td>'
                  + '</tr>';
          name = value.NAME;
        });
      }
      $("#historyModalLabel").text(name+" 이력");
      $("#historyTbl").html(list);
      $("#historyModal").modal('show');
    }
  });
}

/**
 * 업데이트를 위한 모달창 띄우기
 * @param {object} obj 
 */
function getInfoForUpdate(obj) {
  var content = new Array();
  var mode = $("#mode").val();
  if ("word" == mode) {
    $("#wordSeq").val(obj['SEQ']);
    $("#wordSortation").val(obj['SORTATION']);
    content = ['NAME', 'ABBREVIATION', 'FULLNAME', 'DEFINITION'];
  } else {
    $("#domainSeq").val(obj['SEQ']);
    content = ['GROUPNAME', 'NAME', 'ABBREVIATION', 'FULLNAME', 'DATATYPE', 'DATALENGTH', 'DATADECIMAL', 'DEFINITION'];
  }
  $(".modal-body").children(".form-group").children(".formContent").children("input[type=text]").each(function(index, elem) {
    $(this).val(obj[content[index]]);
  });
  $("#myModalLabel").text("수정");
  $("#executeBtn").text("수정");
  $("#executeForm").attr("action", "/update/" + mode + "/" + $("#currentPage").val());
  $('#myModal').modal('show'); 
}

/**
 * 페이징 처리
 * @param {number} totalCount 총 데이터 개수
 * @param {number} listCount 한 목록에 보여질 개수
 * @param {number} pageCount 화면에 보여질 페이지숫자 개수
 * @param {number} currentPage 현재 페이지
 * @param {string or object} mode word : 표준단어, domain: 도메인, object : 키워드 검색
 */
function paging(totalCount, listCount, pageCount, currentPage, mode){

  var totalPage = Math.ceil(totalCount / listCount);    // 총 페이지 수
  var pageGroup = Math.ceil(currentPage / pageCount);   // 페이지 그룹
  var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
  if(last > totalPage) {
      last = totalPage;
  }
  var first = (pageGroup - 1) * pageCount + 1;    // 화면에 보여질 첫번째 페이지 번호
  var next = last + 1;    // next 눌렀을때 페이지 번호
  var prev = first - 1;   // prev 눌렀을때 페이지 번호
  
  /*
  console.log("총 데이터 개수 : " + totalCount);
  console.log("총 페이지수 : " + totalPage);
  console.log("한 목록에 보여질 개수 : " + listCount);
  console.log("화면에 보여질 페이지숫자 개수 : " + pageCount);
  console.log("페이지 그룹 : " + pageGroup);
  console.log("현재페이지 : " + currentPage);
  console.log("화면에 보여질 마지막 페이지 번호 : " + last);
  console.log("화면에 보여질 첫번째 페이지 번호 : " + first);
  console.log("next 눌렀을때 페이지 번호 : " + next);
  console.log("prev 눌렀을때 페이지 번호: " + prev);
  */

  var html = "<nav aria-label='Page navigation example'><ul class='pagination'>";

  // prev 표기
  if (prev > 0) {
    html += "<li class='page-item'>";
    if (typeof mode == "object") {  // 키워드 검색일때
      html += "<span class='page-link' onClick=keywordPageNumClick(\'"+mode.condition+"\',\'"+mode.keyword+"\',"+prev+");>Previous</span>";
    } else {
      html += "<a class='page-link' href='/"+mode+"/1"+"/"+$("#orderTarget").val()+"' id='first'><<</a>";
      html += "<a class='page-link' href='/"+mode+"/"+prev+"/"+$("#orderTarget").val()+"' id='prev'><</a>";
    }
    html += "</li>";
  }

  // 페이지 숫자 표기
  for(var i=first; i<=last; i++){
    if (i == currentPage) { // 현재 페이지는 active 클래스 추가
      html += "<li class='page-item active'><span class='page-link'>" + i + "</span></li>";
    } else {
      html += "<li class='page-item'>";
      if (typeof mode == "object") {  // 키워드 검색일때
        html += "<span class='page-link' onClick=keywordPageNumClick(\'"+mode.condition+"\',\'"+mode.keyword+"\',"+i+"); >" + i + "</span>";
      } else {
        html += "<a class='page-link' href='/"+mode+"/"+i+"/"+$("#orderTarget").val()+"' id=" + i + ">" + i + "</span>";
      }
      html += "</li>";
    }
  }
  
  // next 표기
  if (last < totalPage) {
    html += "<li class='page-item'>";
    if (typeof mode == "object") {  // 키워드 검색일때
      html += "<span class='page-link' onClick=keywordPageNumClick(\'"+mode.condition+"\',\'"+mode.keyword+"\',"+next+"); >></span>";
    } else {
      html += "<a class='page-link' href='/"+mode+"/"+next+"/"+$("#orderTarget").val()+"' id='next'>></a>";
      html += "<a class='page-link' href='/"+mode+"/"+totalPage+"/"+$("#orderTarget").val()+"' id='totalPage'>>></a>";
    }
    html += "</li>";
  }
  html += "</ul></nav>";
  $("#paging").html(html);    // 페이지 목록 생성
}

/**
 * 키워드 검색 후 페이지숫자 클릭시 호출
 * @param {string} condition : 검색 조건
 * @param {string} keyword : 검색 키워드
 * @param {number} page : 페이지
 */
function keywordPageNumClick(condition, keyword, page) {
  var data = new Object();
  data.condition =  condition;
  data.keyword = keyword;
  data.page = page;
  getSeachKeyword(data);  // 키워드 검색
}

/**
 * 키워드 검색
 * @param {object} postData 
 */
function getSeachKeyword (postData) {
  var mode = $("#mode").val();
  $.ajax({
    url:"/keywordSearch/"+mode,
    type:'post',
    data: postData,
    dataType:'json',
    success:function(data){
      var list = "";
      if ("word" == $("#mode").val()) { // 표준단어 키워드 검색
        list += '<tr>'
                + '<th class="text-center active" width="5%" style="vertical-align: middle;">표준단어<br>중복체크</td>'
                + '<th class="text-center active" width="5%" style="vertical-align: middle;">영문약어<br>중복체크</td>'
                + '<th class="text-center active" width="5%" style="vertical-align: middle;">영문명<br>중복체크</td>'
                + '<th class="text-center active" width="4%" style="vertical-align: middle;">순번</td>'
                + '<th class="text-center active" width="8%" style="vertical-align: middle;">단어명</td>'
                + '<th class="text-center active" width="12%" style="vertical-align: middle;">영문약어명</td>'
                + '<th class="text-center active" width="15%" style="vertical-align: middle;">영문명</td>'
                + '<th class="text-center active" width="5%" style="vertical-align: middle;">구분</td>'
                + '<th class="text-center active" width="24%" style="vertical-align: middle;">정의</td>'
                + '<th class="text-center active" width="8%" style="vertical-align: middle;">수정일</td>'
                + '<th class="text-center active" width="8%" style="vertical-align: middle;">삭제/이력관리</th>'
              + '<tr>';
        var number = 1;
        var mode = "'"+$("#mode").val()+"'";

        if (data.list.length == 0) {
          list += '<tr><td colspan="11" class="text-center">조회된 데이터가 없습니다.</td></tr>';
        } else {
          $.each(data.list, function(key, value){
            list += '<tr>'
                    + "<td class='text-center' onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.WORDSAMECOUNT + '</td>'
                    + "<td class='text-center' onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.ABBREVIATIONSAMECOUNT + '</td>'
                    + "<td class='text-center' onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.FULLNAMESAMECOUNT + '</td>'
                    + "<td class='text-center' onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ number + '</td>'
                    + "<td onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.NAME + '</td>'
                    + "<td onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.ABBREVIATION + '</td>'
                    + "<td onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.FULLNAME + '</td>'
                    + "<td class='text-center' onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.SORTATION + '</td>'
                    + "<td onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.DEFINITION + '</td>'
                    + "<td class='text-center' onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.WRITEDATE + '</td>'
                    + '<td class="text-center"><button type="button" class="btn btn-danger" onclick="deleteProcess('+mode+','+  value.SEQ + ','+$("#currentPage").val()+');">삭제</button>&nbsp;<button type="button" class="btn btn-default" onclick="getHistory('+mode+','+  value.SEQ + ');">이력</button></td>'
                  + '</tr>';
            number++;
          });
        }
      } else if ("domain" == $("#mode").val()) {  // 표준도메인 키워드 검색
        list += '<tr>'
                +'<th width="3%" class="text-center active">순번</td>'
                +'<th width="9%" class="text-center active">그룹명</td>'
                +'<th width="9%" class="text-center active">도메인명</td>'
                +'<th width="10%" class="text-center active">영문약어명</td>'
                +'<th width="10%" class="text-center active">영문명</td>'
                +'<th width="9%" class="text-center active">데이터타입</td>'
                +'<th width="32%" class="text-center active">정의</td>'
                +'<th width="9%" class="text-center active">수정일</td>'
                +'<th width="9%" class="text-center active">삭제/이력관리</th>'
              + '<tr>';
        var number = 1;
        var mode = "'"+$("#mode").val()+"'";
        if (data.list.length == 0) {
          list += '<tr><td colspan="9" class="text-center">조회된 데이터가 없습니다.</td></tr>';
        } else {
          $.each(data.list, function(key, value){
            list += '<tr>'
                    +  "<td class='text-center' onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ number + '</td>'
                    + "<td onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.GROUPNAME + '</td>'
                    + "<td onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.NAME + '</td>'
                    + "<td onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.ABBREVIATION + '</td>'
                    + "<td onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.FULLNAME + '</td>'
                    + "<td class='text-center' onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.DATATYPE + '('+ value.DATALENGTH +','+value.DATADECIMAL+')</td>'
                    + "<td onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.DEFINITION + '</td>'
                    +  "<td class='text-center' onclick='getInfoForUpdate("+JSON.stringify(value)+")'>"+ value.WRITEDATE + '</td>'
                    + '<td class="text-center"><button type="button" class="btn btn-danger" onclick="deleteProcess('+mode+','+  value.SEQ + ','+$("#currentPage").val()+');">삭제</button>&nbsp;<button type="button" class="btn btn-default" onclick="getHistory('+mode+','+  value.SEQ + ');">이력</button></td>'
                  + '</tr>';
            number++;
          });
        }
      }
      $("#listTbl").html(list);
      var mode = new Object();
      mode.mode = mode;
      mode.condition = postData.condition;
      mode.keyword = postData.keyword;
      paging(data.totalCount, $("#listCount").val(), $("#pageCount").val(), data.currentPage, mode);  // 페이징 함수 호출
    }
  });
}

/**
 * 유효성 체크
 */
function checkValidation() {
  var mode = $("#mode").val();
  var targetArray = new Array();
  if (mode == "word") {
    targetArray.push(['wordName', 'varchar', 20, 'N']);
    targetArray.push(['wordAbbreviation', 'varchar', 100, 'N']);
    targetArray.push(['wordFullName', 'varchar', 150, 'N']);
    targetArray.push(['wordDefinition', 'varchar', 500, 'N']);
    targetArray.push(['id', 'varchar', 50, 'N']);
    
  } else if (mode == "domain") {
    targetArray.push(['domainGroupName', 'varchar', 10, 'N']);
    targetArray.push(['domainGroupName', 'varchar', 20, 'N']);
    targetArray.push(['domainAbbreviation', 'varchar', 200, 'N']);
    targetArray.push(['domainFullName', 'varchar', 255, 'N']);
    targetArray.push(['domainDataType', 'varchar', 16, 'N']);
    targetArray.push(['domainDataLength', 'number', 65535, 'Y']);
    targetArray.push(['domainDataDecimal', 'number', 255, 'Y']);
    targetArray.push(['domainDefinition', 'varchar', 500, 'Y']);
    targetArray.push(['id', 'varchar', 50, 'N']);
  }

  var result = true;
  for (var i=0; i<targetArray.length;i++) {
    if (result) {
      var value = $("#"+targetArray[i][0]).val();
      var placeholder = $("#"+targetArray[i][0]).attr("placeholder");
      var dataType = targetArray[i][1];
      var maxLength = targetArray[i][2];
      var nullYn = targetArray[i][3];

      if (dataType == 'number') { // 데이터타입이 NUMBER 인 경우 숫자인지 체크
        if (isNaN(value)) {
          alert(placeholder + ' 은/는 숫자만 입력 가능합니다.');
          $("#"+targetArray[i][0]).focus();
          result = false;
        } else if (value > maxLength) {
          alert(placeholder + " 은/는 " + maxLength + "이하만 입력 가능합니다.");
          $("#"+targetArray[i][0]).focus();
          result = false;
        }
      } else if (value.length > maxLength) {  // 최대 길이 체크
        alert(placeholder + " 은/는 " + maxLength + "자까지 입력 가능합니다.");
        $("#"+targetArray[i][0]).focus();
        result = false;
      }
      if (nullYn == "N" && value.length == 0) {  // NULL 가능 여부 체크
        alert(placeholder + " 을/를 입력하세요.");
        $("#"+targetArray[i][0]).focus();
        result = false;
      }
    }
  }
  return result;
}