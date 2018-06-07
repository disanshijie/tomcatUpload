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
<title>直属分销商管理</title>
<link href="${ctx}/resource/bootstrap-3.3.5-dist/css/bootstrap.min.css" title="" rel="stylesheet" />
<link title="" href="${ctx}/resource/css/style.css" rel="stylesheet" type="text/css"/>
<link title="blue" href="${ctx}/resource/css/dermadefault.css" rel="stylesheet" type="text/css"/>
<link href="${ctx}/resource/css/templatecss.css" rel="stylesheet" title="" type="text/css" />
<link type="text/css" rel="stylesheet" href="${ctx}/resource/jedate/skin/jedate.css">
<script src="${ctx}/resource/script/jquery-2.0.3.min.js" type="text/javascript"></script>
<script src="${ctx}/resource/script/jquery.cookie.js" type="text/javascript"></script>
<script type="text/javascript" src="${ctx}/resource/jedate/jquery.jedate.js"></script>
<script src="${ctx}/resource/bootstrap-3.3.5-dist/js/bootstrap.min.js" type="text/javascript"></script>
<style type="">
	.cabin {
    width: 9%;
    float: left;
    margin-left: 1%;
}
.cabinNum {
    width: 8% !important;
}
.cabinPrice {
    width: 5.5% !important;
}
</style>
</head>
<body>
  <div class="container-fluid" >
  <div class="zcgl-title"><span id="voyage">添加班期</span></div>
      <div class="over-hidden">
          <div class="release-date" style="width:10%">
              <h1>出发时间：</h1>
              <input id="startDate" placeholder="出发时间" class="form-control" type="text" >
          </div>
          <div class="release-passcity" style="width: 25%;">
                <h1>途经城市：</h1>
                <input id="wayCity" type="text" class="form-control" placeholder="多个城市用，隔开">
           </div>
          <div class="release-passcity" style="width: 7%;">
              <h1>船舱额度<span style="color:red">*</span>：</h1>
              <input id="crusieLimit" class="form-control" placeholder="请输入船舱额度" value="" type="text">
          </div>
          <div class="release-passcity" style="width: 30%;">
              <h1>班期名称<span style="color:red">*</span>：</h1>
              <input id="title" class="form-control" placeholder="请输入产品名称" value="" type="text">
          </div>
         <!--   <div class="release-passcity"> 
               <h1>班期描述<span style="color:red"></span>：</h1>
               <input id="description" class="form-control" placeholder="请输入航期描述" value="" type="text"> 
          </div> -->
          <button id="gxhc" type="button" class="btn btn-primary baocunversion" style="margin: 34px 0 0 0;">保存</button>
      </div>
      <ul class="cabinli addVersionGoods" style="display: none">
      <div class="info-content" style="margin-top: 10px;">
	 	<div class="yuding-title"><span>附加产品</span></div>
	 	<div style="padding:  10px 12px 15px 12px;overflow: hidden;" id="goodsInfo">
		 	<li>
		 	<div class="cabin-type-name "><h1>名称：</h1></div>
		 	<div class="cabin-name"><h1>总量：</h1></div>
		 	<div class="cabin-name"><h1>剩余：</h1></div>
		 	<div class="cabin cabinNum "><h1>价格：</h1></div>
		 	</li>
		 	<li style="margin-bottom: 10px;">
		 	<div class="cabin-type-name "><input class="form-control" value="保险" readonly="true" type="text"></div>
		 	<div class="cabin-name"><input class="form-control" value="不限" readonly="true" type="text"></div>
		 	<div class="cabin-name"><input class="form-control" value="不限" readonly="true" type="text"></div>
		 	<div class="cabin cabinNum "><input class="form-control" placeholder="未设定" readonly="true" type="text" id="insurance"></div>
		 	</li>
		 	<li style="margin-bottom: 10px;">
		 	<div class="cabin-type-name "><input class="form-control" value="大巴" readonly="true" type="text"></div>
		 	<div class="cabin-name"><input class="form-control" value="不限" readonly="true" type="text"></div>
		 	<div class="cabin-name"><input class="form-control" value="不限" readonly="true" type="text"></div>
		 	<div class="cabin cabinNum "><input class="form-control" placeholder="未设定" readonly="true" type="text" id="bus"></div>
		 	</li>
		 	<li style="margin-bottom: 10px;">
		 	<div class="cabin-type-name "><input class="form-control" value="挂舱" readonly="true" type="text"></div>
		 	<div class="cabin-name"><input class="form-control" placeholder="未设定"  type="text" id="addSpaceTotalNum"></div>
		 	<div class="cabin-name"><input class="form-control" placeholder="未设定"  type="text" id="addSpaceNum"></div>
		 	<div class="cabin cabinNum "><input class="form-control" placeholder="未设定" type="text" id="addSpacePrice"></div>
		 	<div class="cabin cabinNum" style="display:none"><input class="form-control" value="" type="text" id="addSpaceId"></div>
		 	<button type="submit" class="btn btn-primary fleft" onclick="saveAddSpace();"style="margin: 0px 0 0 10px;">保存</button>
		 	<button type="submit" class="btn btn-primary fleft editGoods" style="margin: 0px 0 0 10px;">修改</button>
		 	</li>
	 	</div>
		 	<button onclick="toAddgoods();" type="submit" class="btn btn-primary fleft addGoods">添加附加产品</button>
	 	</div>
	 	</ul>	
<!-- 	<div class="zcgl-title"><span>发布船舱</span></div> -->
	<ul class="cabinli" id="cruiseHouse">

    </ul>	
    <div class="addcabin">
	    <button id="addLi" type="submit" class="btn btn-primary fleft" >添加一行</button>
	    <button id="cancel" type="button" class="btn btn-default fright " onclick="toResourceVersion();">取消</button>
	    <button id="publishHouse" onclick="publishHouse()" style=""  type="button" class="btn fright btn-primary modal-tianjia-footer-mr" >保存</button>
    </div>
  </div>
  

<!-- 批量添加一条房型  -->
<div class="modal fade" id="myModal_house" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
             <div class="modal-header bg-title">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 class="modal-title">
                    <i class="icon-pencil"></i>
                    <span id="lblAddTitle">添加船舱</span>
                </h4>
              </div>
              <div class="modal-center-4" id="house">
               
              </div>
              <div class="modal-quanxian-footer ">
                  <input type="hidden" id="hiddenCode"></input>
                  <button type="button" class="btn btn-default " data-dismiss="modal">取消</button>
                  <button  type="button" class="btn btn-primary modal-tianjia-footer-mr"onclick="addCruiseHouse()" id="addHouse">确定</button>                 
              </div>
        </div>
	</div>
</div>
<!-- 批量添加附加产品  -->
<div class="modal fade" id="myModal_goods" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
             <div class="modal-header bg-title">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 class="modal-title">
                    <i class="icon-pencil"></i>
                    <span id="addGoods">添加附加产品</span>
                </h4>
              </div>
              <div class="modal-center-4">
               <ul>
				<li style="width: 100%;overflow: hidden;">
				<div class="modal-jsmc" style="width: 50%;">
				<h1>产品名称：</h1>
				<input type='text' class='form-control' placeholder='请输入产品名称' id="goodsName">
				</div>
				<div class="modal-jsmc" style="width: 50%;">
				<h1>产品总量：</h1>
				<input type='text' class='form-control' placeholder='请输入产品数量' id="goodsTotalNum">
				</div>
				</li>
				<li style="width: 100%;overflow: hidden;">
				<div class="modal-jsmc" style="width: 50%;">
				<h1>产品剩余：</h1>
		 		<input type='text' class='form-control' placeholder='请输入产品价格' id="goodsNum">
				</div>
				<div class="modal-jsmc" style="width: 50%;">
				<h1>产品价格：</h1>
		 		<input type='text' class='form-control' placeholder='请输入产品价格' id="goodsPrice">
				</div>
				</li>
			  </ul>
              </div>
              <div class="modal-quanxian-footer ">
                  <input type="hidden" id="hiddenCode"></input>
                  <button type="button" class="btn btn-default " data-dismiss="modal">取消</button>
                  <button  type="button" class="btn btn-primary modal-tianjia-footer-mr"onclick="saveGoods()">确定</button>                 
              </div>
        </div>
	</div>
</div>
  <script type="text/javascript" src="${ctx}/resource/js/base.js"></script>
  <script type="text/javascript" src="${ctx}/resource/js/common.js"></script>
  <script type="text/javascript" src="${ctx}/manager/resource/js/addVoyage.js"></script>
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
	//班期名称问题
    var startDate = $("#startDate").val();
    var titleArr = title.split("-");//之前名称
    var index = titleArr.length-3;//需要删除的元素途径城市个数
    titleArr.splice(2,index);//删除过去的途径城市
    var wayCityArr = $("#wayCity").val().split(",");//途径城市数组
    for(var i=0;i<wayCityArr.length;i++){//插入新的途径城市
    	titleArr.splice(titleArr.length-1,0,wayCityArr[i]);
    }
    var relTitle = titleArr.join("-"); 
    $("#title").val(startDate+" "+relTitle);
});

  document.getElementById('addLi').onclick=function(){
        if(id==1){
            addRow();
        }else{
            addRow1();
        }
    }
</script>

<script>
    $(document).ready(function(){
        initPage();
    });
</script>
</body>
</html>
