<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="renderer" content="webkit|ie-comp|ie-stand">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">
<title>班期管理</title>
<link href="${ctx}/resource/bootstrap-3.3.5-dist/css/bootstrap.min.css" title="" rel="stylesheet" />
<link title="" href="${ctx}/resource/css/style.css" rel="stylesheet" type="text/css"/>
<link title="blue" href="${ctx}/resource/css/dermadefault.css" rel="stylesheet" type="text/css"/>
<link href="${ctx}/resource/css/templatecss.css" rel="stylesheet" title="" type="text/css" />
<link type="text/css" rel="stylesheet" href="${ctx}/resource/jedate/skin/jedate.css">
<script src="${ctx}/resource/script/jquery-2.0.3.min.js" type="text/javascript"></script>
<script src="${ctx}/resource/script/jquery.cookie.js" type="text/javascript"></script>
<script type="text/javascript" src="${ctx}/resource/jedate/jquery.jedate.js"></script>
<script src="${ctx}/resource/bootstrap-3.3.5-dist/js/bootstrap.min.js" type="text/javascript"></script>
</head>
<body>
  <div class="container-fluid" >
  <div class="zcgl-title"><span id="voyage">班期信息</span></div>
      <div class="over-hidden">
        <div class="release-date" style="width:10%">
              <h1>出发时间：</h1>
              <input id="startDate" placeholder="出发时间" class="form-control" type="text" >
        </div>
        <div class="release-passcity">
          <h1>班期名称<span style="color:red">*</span>：</h1>
          <input id="title" class="form-control" placeholder="请输入班期名称" value="" type="text">
        </div>
        <div class="release-passcity" style="width: 7%;">
              <h1>船舱额度<span style="color:red">*</span>：</h1>
              <input id="crusieLimit" class="form-control" placeholder="请输入船舱额度" value="" type="text">
          </div>

      </div>
	<div class="zcgl-title"><span>发布船舱</span></div>
	<ul class="cabinli" id="cruiseHouse">

    </ul>	
    <div class="addcabin">
	  <%--  <button id="addLi" type="submit" class="btn btn-primary fleft" onclick="addRow()">添加一行</button>--%>
	    <button id="cancel" type="button" class="btn btn-default fright " onclick="toResourceVersion()">返回</button>
	   <%-- <button id="publishHouse" onclick="publishHouse()" style=""  type="button" class="btn btn-primary fright modal-tianjia-footer-mr">保存</button>--%>
    </div>
  </div>
  <script type="text/javascript" src="${ctx}/resource/js/base.js"></script>
  <script type="text/javascript" src="${ctx}/resource/js/common.js"></script>
  <script type="text/javascript" src="${ctx}/manager/resource/js/voyage.js"></script>
<script>

$('div').on('click','.removecabin',function(){
	 var flag = confirm("确定删除吗?");
	 if(flag){
		 $(this).parent().remove();
	 }
});
	$(".release-date input").jeDate({
    isinitVal:false,
    festival:false,
    ishmsVal:false,
    minDate: $.nowDate(1),
    maxDate: '2099-06-16 23:59:59',
    format:"YYYY-MM-DD",
    zIndex:3000,
})

$("body").click(function(){
    var startDate = $("#startDate").val();
    $("#title").val(startDate+" "+title);
});


</script>

<script>
    $(document).ready(function(){
        initPage();
    });
</script>
</body>
</html>
