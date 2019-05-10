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

  //$("#executeBtn").click(function() {
  //  $("#executeForm").submit();
  //});
  
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

function paging(totalCount, listCount, pageCount, currentPage, mode){
            
  var totalPage = Math.ceil(totalCount/listCount);    // 총 페이지 수
  var pageGroup = Math.ceil(currentPage/pageCount);    // 페이지 그룹
  
  var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
  if(last > totalPage) {
      last = totalPage;
  }

  var first = last - (pageCount-1);    // 화면에 보여질 첫번째 페이지 번호
  var next = last+1;
  var prev = first-1;
  
  /*
  console.log("totalPage : " + totalPage);
  console.log("pageGroup : " + pageGroup);
  console.log("currentPage : " + currentPage);
  console.log("last : " + last);
  console.log("first : " + first);
  console.log("next : " + next);
  console.log("prev : " + prev);
  */

  var html = "<nav aria-label='Page navigation example'><ul class='pagination'>";

  if(prev > 0) {
    html += "<li class='page-item'><a class='page-link' href='/"+mode+"/"+prev+"' id='prev'>Previous</a></li>";
  }
  
  for(var i=first; i <= last; i++){
      if (i==currentPage) {
        html += "<li class='page-item active'><a class='page-link' href='#'>" + i + "</a></li>";
      } else {
        html += "<li class='page-item'><a class='page-link' href='/"+mode+"/"+i+"' id=" + i + ">" + i + "</a></li>";
      }
  }
  
  if(last < totalPage) {
    html += "<li class='page-item'><a class='page-link' href='/"+mode+"/"+next+"' id='next'>Next</a></li>";
  }
  html += "</ul></nav>";
   
  $("#paging").html(html);    // 페이지 목록 생성
}