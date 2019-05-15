$(document).ready(function () {
  var mode = $("#mode").val();  // word: 표준단어, domain: 표준도메인

  // 메뉴바 하이라이트 표기
  if ("word" == mode) {
    $("#navWord").addClass("active");
    $("#navDomain").removeClass("active");
  } else if ("domain" == mode) {
    $("#navWord").removeClass("active");
    $("#navDomain").addClass("active");
  }

  // 페이징 함수 호출
  paging($("#totalCount").val(), $("#listCount").val(), $("#pageCount").val(), $("#currentPage").val(), mode);  

  // 추가 버튼 클릭
  $("#addBtn").click(function() {
    // modal 내 내용 초기화
    $(".modal-body").children(".form-group").children(".col-sm-10").children("input[type=text]").val("");
    $(".modal-body").children(".form-group").children(".col-sm-10").children("input[type=hidden]").val("");
    if ("word" == mode) {
      $("#wordSortation").val("수식어");
    }
    $("#myModalLabel").text("추가");
    $("#executeBtn").text("추가");
    $("#executeForm").attr("action", "/create/" + mode);
    $('#myModal').modal('show');
  });

  // 전체 엑셀 다운로드 버튼 클릭
  $("#totalExcelDownBtn").click(function() {
    location.replace("/excelDownload/" + mode); 
  });

  // 현재 페이지 엑셀 다운로드 버튼 클릭
  $("#currentExcelDownBtn").click(function() {
    $('#listTbl').tableExport({fileName:mode, type:'xlsx', ignoreColumn: [0, 2]});
  });

  // 모달 내 추가/수정 버튼 클릭
  $("#executeBtn").click(function() {
    $("#executeForm").submit();
  });

  // 키워드 검색
  $("#searchBtn").click(function () {
    var data = new Object();
    var searchCondition = $("#searchCondition").val();  // 조회 조건
    var keyword = $("#keyword").val();                  // 조회 키워드
    data.condition =  searchCondition;
    data.keyword = keyword;
    data.page = 1;
    getSeachKeyword (data);   // 키워드에 맞는 목록 조회
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
                    + '<th class="text-center">단어명</td>'
                    + '<th class="text-center">영문약어명</td>'
                    + '<th class="text-center">영문명</td>'
                    + '<th class="text-center">구분</td>'
                    + '<th class="text-center">정의</td>'
                    + '<th class="text-center">작성자</td>'
                    + '<th class="text-center">작성일</th>'
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
                    + '<th class="text-center">그룹명</td>'
                    + '<th class="text-center">도메인명</td>'
                    + '<th class="text-center">영문약어명</td>'
                    + '<th class="text-center">영문명</td>'
                    + '<th class="text-center">데이터타입</td>'
                    + '<th class="text-center">정의</td>'
                    + '<th class="text-center">작성자</td>'
                    + '<th class="text-center">작성일</th>'
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
      html += "<a class='page-link' href='/"+mode+"/"+prev+"' id='prev'>Previous</a>";
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
        html += "<a class='page-link' href='/"+mode+"/"+i+"' id=" + i + ">" + i + "</span>";
      }
      html += "</li>";
    }
  }
  
  // next 표기
  if (last < totalPage) {
    html += "<li class='page-item'>";
    if (typeof mode == "object") {  // 키워드 검색일때
      html += "<span class='page-link' onClick=keywordPageNumClick(\'"+mode.condition+"\',\'"+mode.keyword+"\',"+next+"); >Next</span>";
    } else {
      html += "<a class='page-link' href='/"+mode+"/"+next+"' id='next'>Next</a>";
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
                + '<th class="text-center">순번</td>'
                + '<th class="text-center">단어명</td>'
                + '<th class="text-center">영문약어명</td>'
                + '<th class="text-center">영문명</td>'
                + '<th class="text-center">구분</td>'
                + '<th class="text-center">정의</td>'
                + '<th class="text-center">작성일</td>'
                + '<th class="text-center">삭제/이력관리</th>'
              + '<tr>';
        var number = 1;
        var mode = "'"+$("#mode").val()+"'";
        $.each(data.list, function(key, value){
          list += '<tr>'
                  + '<td class="text-center">'+ number + '</td>'
                  + '<td>'+ value.NAME + '</td>'
                  + '<td>'+ value.ABBREVIATION + '</td>'
                  + '<td>'+ value.FULLNAME + '</td>'
                  + '<td class="text-center">'+ value.SORTATION + '</td>'
                  + '<td>'+ value.DEFINITION + '</td>'
                  + '<td class="text-center">'+ value.WRITEDATE + '</td>'
                  + '<td class="text-center"><button type="button" class="btn btn-danger" onclick="deleteProcess('+mode+','+  value.SEQ + ','+$("#currentPage").val()+');">삭제</button>&nbsp;<button type="button" class="btn btn-default" onclick="getHistory('+mode+','+  value.SEQ + ');">이력</button></td>'
                + '</tr>';
          number++;
        });
      } else if ("domain" == $("#mode").val()) {  // 표준도메인 키워드 검색
        list += '<tr>'
                +'<th class="text-center">순번</td>'
                +'<th class="text-center">그룹명</td>'
                +'<th class="text-center">도메인명</td>'
                +'<th class="text-center">영문약어명</td>'
                +'<th class="text-center">영문명</td>'
                +'<th class="text-center">데이터타입</td>'
                +'<th class="text-center">정의</td>'
                +'<th class="text-center">작성일</td>'
                +'<th class="text-center">삭제/이력관리</th>'
              + '<tr>';
        var number = 1;
        var mode = "'"+$("#mode").val()+"'";
        $.each(data.list, function(key, value){
          list += '<tr>'
                  + '<td class="text-center">'+ number + '</td>'
                  + '<td>'+ value.GROUPNAME + '</td>'
                  + '<td>'+ value.NAME + '</td>'
                  + '<td>'+ value.ABBREVIATION + '</td>'
                  + '<td>'+ value.FULLNAME + '</td>'
                  + '<td class="text-center">'+ value.DATATYPE + '('+ value.DATALENGTH +','+value.DATADECIMAL+')</td>'
                  + '<td>'+ value.DEFINITION + '</td>'
                  + '<td class="text-center">'+ value.WRITEDATE + '</td>'
                  + '<td class="text-center"><button type="button" class="btn btn-danger" onclick="deleteProcess('+mode+','+  value.SEQ + ','+$("#currentPage").val()+');">삭제</button>&nbsp;<button type="button" class="btn btn-default" onclick="getHistory('+mode+','+  value.SEQ + ');">이력</button></td>'
                + '</tr>';
          number++;
        });
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