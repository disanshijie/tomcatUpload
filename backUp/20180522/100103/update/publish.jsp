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
<title>公告管理</title>
<link href="bootstrap-3.3.5-dist/css/bootstrap.min.css" title="" rel="stylesheet" />
<link title="" href="css/style.css" rel="stylesheet" type="text/css"  />
<link title="blue" href="css/dermadefault.css" rel="stylesheet" type="text/css"/>
<link href="css/templatecss.css" rel="stylesheet" title="" type="text/css" />
<link type="text/css" rel="stylesheet" href="jedate/skin/jedate.css">
<link rel="Stylesheet" type="text/css" href="style/jqueryui/ui-lightness/jquery-ui-1.7.2.custom.css" />
<link rel="Stylesheet" type="text/css" href="style/jHtmlArea.css" />

 </head>
<body>
<input id="resourceCode" type="hidden" value="${returnObj.datas.code }"/>
<input id="versionFlag" type="hidden"/>
     <div class="container-fluid">
         <div class="zcgl-title"><span>发布产品</span></div>
         <div class="release">
              <div style="overflow:hidden;">
               <div class="release-city">
                <h1>产品类型：</h1>
                <select id="productType" name="" type="text" class="form-control" onclick="showCruiseCompany()">                                   
                  <option value="21">邮轮</option>
                  <option value="22">自驾游</option>
                  <option value="23">精品游</option>
                 </select>
              </div>

              <div class="release-company">
                  <h1>显示级别：</h1>
                  <select id="showLevel" name="" type="text" class="form-control" onclick="showLevelClick()">
                      <option value="1">所有分销商</option>
                      <option value="0">当前分销商</option>
                  </select>
              </div>

              <div class="release-company" id="YouLun">
                  <h1>邮轮公司：</h1>
                  <select id="cruiseCompany" name="" type="text" class="form-control">

                  </select>
              </div>

              <div class="release-city" id="ship">
                  <h1>邮轮：</h1>
                  <select id="cruise" name="" type="text" class="form-control">

                  </select>
              </div>

              <%--<div class="release-passcity">
               <h1>产品名称<span style="color:red">*</span>：</h1>
               <input id="title" type="text" class="form-control" placeholder="请输入产品名称">
              </div>--%>
                <%--<div class="release-date" id="startDate">
                     <h1>出发时间<span style="color:red">*</span>：</h1>
                     <input class="form-control" id="travelDate" type="text" placeholder="选择出发时间">
                </div>--%>
                <div class="release-time">
                 <h1>天数<span style="color:red">*</span>：</h1>
                 <input id="days" onkeyup="this.value=this.value.replace(/\D/g,'')"  onafterpaste="this.value=this.value.replace(/\D/g,'')"  type="text" class="form-control" placeholder="请输入天数">
                </div>

                  <div class="release-company" id="HangXian" style="display: block;">
                      <h1>航线：</h1>
                      <select id="shippingLine" name="" type="text" class="form-control">
                          <option>请选择</option>
                          <option value="1">日韩航线</option>
                          <option value="2">东南亚航线</option>
                          <option value="3">地中海航线</option>
                          <option value="4">加勒比航线</option>
                          <option value="5">爱琴海航线</option>
                          <option value="6">北欧航线</option>
                          <option value="7">极地航线</option>
                      </select>
                  </div>

                <div class="release-city">
                    <h1 id="city">登船城市<span style="color:red;line-height:0;margin-left:0;">*</span>：</h1>
                    <input onclick="hide('HMF-1')" type="text" value="请选择" id="boardCity" class="form-control select-down" />
                    <input type="text" id="boardCityId" style="display:none;" />
                    <div id="HMF-1" style="display: none " class="bm">
                    </div>
                </div>

                <div class="release-city">
                    <h1>目的地<span style="color:red;line-height:0;margin-left:0;">*</span>：</h1>
                    <input onclick="hide('HMF-2')" type="text" value="请选择" id="endCity" class="form-control select-down" />
                    <div id="HMF-2" style="display: none " class="bm">
                    </div>
                </div>

                  <div class="release-passcity">
                      <h1>途经城市：</h1>
                      <input id="wayCity" type="text" class="form-control" placeholder="多个城市用，隔开">
                  </div>
                  <div class="release-passcity"></div>
                <%--<div class="release-price" id="div_price">
                 <h1>直客价(元)<span style="color:red;line-height:0;margin-left:0;">*</span>：</h1>
                 <input id="price" type="text" class="form-control" placeholder="请输入直客价">
                </div>--%>

                <%--<div class="release-price" id="tongYe">
                 <h1>同业价(元)<span style="color:red;line-height:0;margin-left:0;">*</span>：</h1>
                 <!-- <h1>同业价<span style="color:red;line-height:12px;">*</span>：</h1> -->
                 <input id="traderPrice" type="text" class="form-control" placeholder="请输入同业价">
                </div>--%>
<!--                 <div class="release-price" id="daba"> -->
<!--                         <h1>大巴(元)<span style="color:red;line-height:0;margin-left:0;">*</span>：</h1> -->
<!--                         <input id="busPrice" class="form-control" placeholder="大巴" type="text"> -->
<!--                 </div> -->
<!--                   <div class="release-price"> -->
<!--                           <h1>保险(元)<span style="color:red;line-height:0;margin-left:0;">*</span>：</h1> -->
<!--                           <input id="insurancePrice" class="form-control" placeholder="保险" type="text"> -->
<!--                   </div> -->
<!-- 				<div class="release-price"> -->
<!--                           <h1>挂舱(元)：</h1> -->
<!--                           <input id="addSpacePrice" class="form-control" placeholder="挂舱" type="text"> -->
<!--                   </div> -->

                 <%--<div class="release-price" id="remainNum" >
                 <h1>剩余总量：</h1>
                 <!--  <h1>剩余总量<span style="color:red;line-height:12px;">*</span>：</h1> -->
					<input id="num" type="text" class="form-control" placeholder="剩余总量">
                </div>--%>
              </div>
              
              <div class="release-name" >
              <!--  <h1>文档内容<span style="color:red">*</span>：</h1>  -->
               <h1>文档内容：</h1>
               <textarea id="txtDefaultHtmlArea" style="min-height:350px; width:100%"></textarea>
               <!--文本编辑器-->
              </div>
              <div class="release-name" style="width:50%;float:left;margin:10px 0 20px 0;">
               <h1>上传文档（word）：</h1>
               <!-- <h1>上传文档（word）<span style="color:red">*</span>：</h1> -->
               <div class="inputFileWrapper">
                    <label for="inputFile">
                         <input id="inputFile" name="inputFile" type="file"/>
                         <span class="custorm-style">
                             <span class="left-button" id="wordButton">浏览</span>
                            <span class="form-control right-text tianjia-word-bg" id="rightText"></span>
                            <input type="hidden" id="wordPath" value=""/>
                         </span>
                     </label>
                 </div>
              </div>
             <div class="release-name" style="width:50%;float:left;margin:10px 0 20px 0;">
               <h1>上传图片<span style="color:red">*</span>：</h1>
               <div class="inputFileWrapper">
                    <label for="inputFilePic">
                         <input id="inputFilePic" type="file"/>
                         <span class="custorm-style">
                             <span class="left-button" id="picButton">浏览</span>
                            <span class="form-control right-text tianjia-img-bg" id="rightTextPic"></span>
                            <input type="hidden" id="picPath" value=""/>
                         </span>
                     </label>
                 </div>
              </div>
              <div class="release-name" >
               <h1>预定须知<span style="color:red">*</span>：</h1>
               <textarea id="reservation" style="min-height:150px; width:100%"></textarea>
              </div>
              <div class="release-name" >
               <h1>费用说明<span style="color:red">*</span>：</h1>
               <textarea id="priceContain" style="min-height:150px; width:100%"></textarea>
              </div>
              <div class="release-footer ">
                <input type="hidden" id="wordPathUrl" value=""/>
                    <button type="button" onclick="cancel()" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" id="publishProduce" onclick="publishProduce()" class="btn btn-primary modal-tianjia-footer-mr ">发布</button>
              </div>
          </div>
     </div>
   <%-- <!--城市-->
    <div id="jsContainer" class="jsContainer" style="height:0">
        <div id="tuna_alert" style="display:none;position:absolute;z-index:999;overflow:hidden;"></div>
        <div id="tuna_jmpinfo" style="visibility:hidden;position:absolute;z-index:120;"></div>
    </div>
    <script type="text/javascript" src="${ctx}/resource/js/fixdiv.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/address.js"></script>
    <!--城市结束-->--%>
</body>
<script src="script/jquery-2.0.3.min.js" type="text/javascript"></script>
<script src="script/jquery.cookie.js" type="text/javascript"></script>
<script src="script/jtablesite.js" type="text/javascript"></script>
<script src="bootstrap-3.3.5-dist/js/bootstrap.min.js" type="text/javascript"></script>
<script type="text/javascript" src="jedate/jquery.jedate.js"></script>
<script type="text/javascript" src="script/jquery-ui-1.7.2.custom.min.js"></script>
<script type="text/javascript" src="script/jHtmlArea-0.8.js"></script>

<script type="text/javascript" src="${ctx}/resource/js/base.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/common.js"></script>
<script src="${ctx}/resource/script/jquery.ajaxfileupload.js" type="text/javascript"></script>
<script src="${ctx}/resource/js/lrz.all.bundle.js" type="text/javascript"></script> 
<script type="text/javascript" src="${ctx}/manager/resource/js/publish.js"></script>
<script type="text/javascript" >
function $$$$$(_sId){
 return document.getElementById(_sId);
 }
function hide(_sId)
 {$$$$$(_sId).style.display = $$$$$(_sId).style.display == "none" ? "" : "none";}
function pick(v) {
 document.getElementById('boardCity').value=$(v).text();
 document.getElementById('boardCityId').value=$(v).attr("id");
hide('HMF-1');
}
function pick1(v) {
    document.getElementById('endCity').value=$(v).text();
	hide('HMF-2');
	}
</script>
<script>
$("#2 option").click(
  function(){
	var x=$('#2 option:selected').text();
    var y='当前分销商';
	if(x==y){
		 $("#1").hide(); 
		}
	else{
		 $("#1").show();
		}
	  }
);
$(document).ready(function() {
	initPage();
});
   	
	$("#travelDate").jeDate({
    isinitVal:false,
    festival:false,
    ishmsVal:false,
    minDate: $.nowDate(1),
    maxDate: '2099-06-16 23:59:59',
    format:"YYYY-MM-DD",
    zIndex:3000,
});
</script>
<script>
	//上传word
    var fileBtn = $("#inputFile");
    fileBtn.on("change", function(){
        var index = $(this).val().lastIndexOf("\\");
        var sFileName = $(this).val().substr((index+1));
        $("#rightText").html(sFileName);
        $("#wordPath").val(sFileName);
    });
	$("#rightText").click(
	function(){
		$(this).removeClass("tianjia-word-bg");
		}
	);
	$("#wordButton").click(
	function(){
		$("#rightText").removeClass("tianjia-word-bg");
		}
	);
	
	//上传图片
    var fileBtn1 = $("#inputFilePic");
    fileBtn1.on("change", function(){
        var index = $(this).val().lastIndexOf("\\");
        var sFileName = $(this).val().substr((index+1));
        $("#rightTextPic").html(sFileName);
        $("#picPath").val(sFileName);
    	zipImg();
    });
	
	$("#rightTextPic").click(function() {
		$(this).removeClass("tianjia-img-bg");
	});
	$("#picButton").click(function() {
		$("#rightTextPic").removeClass("tianjia-img-bg");
	});
</script>
<script type="text/javascript">    
        $(function() {
            $("#txtDefaultHtmlArea").htmlarea();
            $("#reservation").htmlarea();
            $("#priceContain").htmlarea();
        });
    </script>
</html>