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
<link href="${ctx}/resource/jedate/skin/jedate.css" rel="stylesheet" title="" type="text/css" />
<link title="" href="${ctx}/resource/css/style.css" rel="stylesheet" type="text/css"  />
<link title="blue" href="${ctx}/resource/css/dermadefault.css" rel="stylesheet" type="text/css"/>
<link href="${ctx}/resource/css/templatecss.css" rel="stylesheet" title="" type="text/css" />

</head>
<body onload="loadList(1)">
<input type="hidden" id="currentPageNum" />
  <div class="container-fluid">
      <div class="zcgl-title"><span>直属分销商管理</span></div>
       <form id="form_condition" action="" method="post">
		<div class="order-top" onkeyup="if(event.keyCode==13)loadList(1);">
             <div class="order-top-1">
               <div class="order-fenlei">
                <h1>分销商类型：</h1>
                <select id="queryType" name="trader.type"  class="form-control" >                  
                  <option value="0">全部分类</option> 
                  <option value="1">机票业务</option>
                  <option value="2">旅游业务</option>               
                 </select>
               </div>
              </div> 
              <div class="order-top-1">
              <div class="order-fenlei">
                <h1>分销商状态：</h1>
                <select id="queryStatus" name="trader.status"  class="form-control"  >                  
                  <option value="4" >全部状态</option>
                  <option value="0" >待审核</option> 
                  <option value="1" >正常</option>
                  <option value="2" >过期</option>
                  <option value="3" >已注销</option>              
                 </select>
              </div>
             </div>
             <div class="order-top-2">
               <div class="order-danhao">
               <h1>分销商编号：</h1>
               <input id="queryCode" name="trader.code" type="text" class="form-control" placeholder="请输入分销商编号" >
              </div>
             </div>
              <div class="order-top-2">
               <div class="order-danhao">
               <h1>分销商名称：</h1>
               <input id="queryName" name="trader.name" type="text" class="form-control" placeholder="请输入分销商名称" >
              </div>
             </div>
             <div class="order-top-3">
               <div class="zsfx-shijian">
              <h1>注册时间：</h1>
                <input class="form-control" id="dateinfo" name="trader.createDate" type="text" placeholder="起始时间" >
                 <p>至</p>
                <input class="form-control" id="dateinfo1" name="trader.expireDate" type="text" placeholder="截止时间" >
              </div>
             </div>
             <div class="order-top-4">
              <div class="order-anniu">
                <button class="btn btn-primary" id="destroy" onclick="loadList(1)" type="button">搜索</button>
                <button class="btn btn-primary" id="destroy2" onclick="exportExcel()" type="button">导出</button>
              </div>
             </div>
             </div>
             </form>
               <div class="zsfx-tianjia">
               <!-- data-toggle="modal" data-target="#myModal_tjfxs" -->
               <button class="btn btn-primary" id="destroy" type="button" onclick="checkAddOrEditTraderPermission()">添加分销商</button></div>
				<div class="info-center">
					<div class="table-margin">
                      <table class="table table-bordered table-header zsfx-table">
                      <thead>
                         <tr>
                           <td class="w10">分销商编号</td>
                           <td class="w20">分销商名称</td>
                           <td class="w10">联系电话</td>
                           <td class="w10">类型</td>
                           <td class="w10">级别</td>
                           <td class="w10">注册日期</td>
                           <td class="w10">到期日期</td>
                           <td class="w10">账号状态</td>
                           <td class="w10">操作</td>
                         </tr>
                         </thead>
                         <tbody id="list">
<%-- 							<c:forEach items="${returnObj.datas}" var="datas" varStatus="category">
	                         	<tr>
									<td>${datas.code}</td>
									<td>${datas.name}</td>
									<td>${datas.phone}</td>
									<td>
										<c:if test="${datas.type == 1}">机票业务</c:if>
										<c:if test="${datas.type == 2}">旅游业务</c:if>
									</td>
									<td>
										<c:if test="${datas.level == 1}">联盟成员</c:if>
										<c:if test="${datas.level == 2}">一般同业</c:if>
									</td>
									<td>${datas.createDate}</td>
									<td>${datas.expireDate}</td>
									<td>
									    <c:if test="${datas.status == 0}"><span style="color:red">待审核</span></c:if>
										<c:if test="${datas.status == 1}"><span style="color:#00ce3f">正常</span></c:if>
										<c:if test="${datas.status == 2}"><span style="color:#999">过期</span></c:if>
										<c:if test="${datas.status == 3}"><span style="color:#ff9900">已注销</span></c:if>
									</td>
									<td>
										<a onclick="javascript:detailsTrader('${datas.code}')">详情</a><br/>
										<a onclick="javascript:checkAddOrEditTraderPermission('${datas.code}')">编辑</a>
									</td>
								</tr>
							</c:forEach> --%>
                         </tbody>
                      </table>
                    </div>
				</div>
				<div class="show-page">
					<ul class="pagination" id="hotPage">

                 </ul> 
				</div>
     </div>
<!-- 模态框（Modal）1 编辑和添加-->   
<div class="modal fade" id="myModal_tjfxs" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
            <div class="modal-header bg-title">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 class="modal-title">
                    <span id="lblAddTitle">添加分销商</span>
                </h4>
            </div>
                <div class="modal-center-1">
                  <ul>
                  <li>
                  <div class="modal-jsmc">
                     <h1>分销商名称<span style="color:red">*</span>：</h1>
                     <input  type="text" id="name" class="form-control" placeholder="请输入分销商名称"/>
                  </div>
                  <div class="modal-jsmc">
                     <h1>公司邮箱<span style="color:red">*</span>：</h1>
                     <input type="text" id="email" class="form-control" placeholder="请输入公司邮箱">
                  </div>
                  </li>
                  <li>
                  <div class="modal-jsmc">
                     <h1>联系人<span style="color:red">*</span>：</h1>
                     <input type="text"  id="linkman" class="form-control" placeholder="请输入联系人姓名">
                  </div>
                  <div class="modal-jsmc">
                     <h1>联系电话<span style="color:red">*</span>：</h1>
                     <input type="text"  id="phone" class="form-control" placeholder="请输入联系电话">
                  </div>
                  </li>
                  <li>
                  <div class="modal-qiyong">
                    <h1>类型：</h1>
                    <select id="type" name="" type="text" class="form-control" >                  
                      <option value="2">旅游同业</option>
                      <option value="1">机票同业</option> 
                     </select>
                  </div> 
                  <div class="modal-qiyong">
                    <h1>级别：</h1>
                    <select id="level" name="" type="text" class="form-control" >                  
                      <option value="0">华美欧</option>                 
                      <option value="1">规划师</option>                 
                      <option value="2">一般同业</option>                     
                     </select>
                  </div>
                  </li>
                  <li>
                  <div class="modal-qiyong">
                    <h1>账户状态：</h1>
                    <select id="status" name="" type="text" class="form-control" >                  
                      <option value="0">待审核</option> 
                      <option value="1">正常</option>
                      <option value="2">过期</option>
                      <option value="3">已注销</option>
                     </select>
                  </div>
                  <div class="modal-dqsj">
                   <h1>到期时间<span style="color:red">*</span>：</h1>
                   <input class="form-control" id="dateinfo2" type="text" placeholder="选择到期时间">
                    <label id="lab_time"></label>
                 </div>
                 </li>
                 <li>
                  <div class="modal-adr">
                     <h1>公司地址<span style="color:red">*</span>：</h1>
                     <input type="text" id="address" class="form-control" placeholder="请输入公司地址">
                  </div>
                 </li>
                 <li>
                 <div class="modal-yyzz">
                    <h1>营业执照<span style="color:red" id="traderImg">*</span>：</h1>
                     
                  <div class="inputFileWrapper">
                    <label for="inputFile">
                         <input type="file" id="inputFile" name="inputFile" accept="image/*" />
                         <span class="custorm-style">
                             <span class="left-button">浏览</span>
                            <span class="form-control right-text tianjia-bg" id="rightText" placeholder="选择上传图片"></span>
                            <input type="hidden" id="picPath" value=""></input>
                         </span>
                     </label>
                 </div>  
                </div>
                </li>
                </ul>
        </div>
               <div class="modal-tianjia-footer ">
                <input type="hidden" id="code" value=""></input>
                <input type="hidden" id="traderPicUrl" value=""></input>
                   <button type="button" id="cancel" class="btn btn-default" data-dismiss="modal">取消</button>                  
                   <button type="button" id="addtrader" onclick="addTrader()" class="btn btn-primary modal-tianjia-footer-mr">添加</button>
                </div>
<!-- /.modal-content -->
	</div><!-- /.modal -->
</div>
</div>
<!-- 模态框（Modal）2 详情-->  
<div class="modal fade" id="myModal_xq" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
            <div class="modal-header bg-title">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 class="modal-title">
                    <span id="lblAddTitle">分销商详情</span>
                </h4>
            </div>
               
                <div class="modal-center-2">
                  <div class="modal-zsfx-xq-left">
                   <div class="modal-zsfx-xq">
                    <h1>分销商编号：</h1>
                     <p id="codeDe">0102823233</p>
                  </div>
                  <div class="modal-zsfx-xq">
                     <h1>分销商名称：</h1>
                     <p id="nameDe">北京华美欧环球邮轮俱乐部环球邮轮俱乐部</p>
                  </div>
                  <div class="modal-zsfx-xq">
                     <h1>公司邮箱：</h1>
                     <p id="emailDe"></p>
                  </div>
                  <div class="modal-zsfx-xq">
                     <h1>联系人：</h1>
                     <p id="linkmanDe"></p>
                  </div>
                  <div class="modal-zsfx-xq">
                     <h1>联系电话：</h1>
                     <p id="phoneDe">0102823233</p>
                  </div>  
                  <div class="modal-zsfx-xq">
                     <h1>公司地址：</h1>
                     <p id="addressDe"></p>
                  </div>           
                  <div class="modal-zsfx-xq">
                    <h1>类型：</h1>
                    <p id="typeDe">旅游同业</p>
                  </div> 
                  <div class="modal-zsfx-xq">
                    <h1>级别：</h1>
                    <p id="levelDe">联盟成员</p>
                  </div> 
                   <div class="modal-zsfx-xq">
                  <h1>上级分销商编号：</h1>
                    <p id="pCodeDe"></p>
                  </div>               
                  <div class="modal-zsfx-xq">
                   <h1>注册时间：</h1>
                   <p id="createDateDe">2017-12-20</p>
                  </div>
                  <div class="modal-zsfx-xq">
                   <h1>到期时间：</h1>
                   <p id="expireDateDe">2017-12-20</p>
                  </div>
                  <div class="modal-zsfx-xq">
                    <h1>账户状态：</h1>
                    <p id="statusDe"></p>
                  </div>
                 </div>
                 <div class="modal-zsfx-xq-right">
                  <div class="modal-zsfx-xq-img">
                    <h1>营业执照：</h1>
                    <img id="businessImg" src="#" /> 
                 </div>
                 </div>
                </div>
                <div class="modal-tianjia-footer ">
                   <!-- <button type="button" class="btn btn-default" data-dismiss="modal">返回</button> -->
                    <button type="button" data-dismiss="modal" class="btn btn-primary">返回</button>
                </div>
        </div>
<!-- /.modal-content -->
	</div><!-- /.modal -->
</div>
<script src="${ctx}/resource/script/jquery-2.0.3.min.js" type="text/javascript"></script>
<script src="${ctx}/resource/script/jqury.cookie.js" type="text/javascript"></script>
<script src="${ctx}/resource/bootstrap-3.3.5-dist/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${ctx}/resource/js/common.js" type="text/javascript"></script>
<script src="${ctx}/resource/script/jquery.ajaxfileupload.js" type="text/javascript"></script> 
<script type="text/javascript" src="${ctx}/resource/jedate/jquery.jedate.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/base.js"></script>
<script type="text/javascript" src="${ctx}/manager/trader/js/trader.js"></script>
<script>
    var fileBtn = $("input[type=file]");
    fileBtn.on("change", function(){
        var index = $(this).val().lastIndexOf("\\");
        var sFileName = $(this).val().substr((index+1));
        $("#rightText").text(sFileName);
        $("#picPath").val(sFileName);
    });
    $("#rightText").click(
    		function(){
    			$(this).removeClass("tianjia-bg");
    			$(this).removeClass("xiugai-bg");
    			}
    		);
    		
	$(".left-button").click(
	function(){
		$("#rightText").removeClass("tianjia-bg");
		$("#rightText").removeClass("xiugai-bg");
		}
	)
</script> 

<script type="text/javascript">
   var start = {
    format: 'YYYY-MM-DD',
    minDate: '2014-06-16 23:59:59', //设定最小日期为当前日期
    festival:false,
    //isinitVal:true,
    maxDate: $.nowDate(0), //最大日期
    choosefun: function(elem,datas){
        end.minDate = datas; //开始日选好后，重置结束日的最小日期
    }
};
var end = {
    format: 'YYYY-MM-DD',
    minDate: $.nowDate(0), //设定最小日期为当前日期
    festival:false,
    //isinitVal:true,
    maxDate: '2099-06-16 23:59:59', //最大日期
    choosefun: function(elem,datas){
        start.maxDate = datas; //将结束日的初始值设定为开始日的最大日期
    }
};
$("#dateinfo").jeDate(start);
$("#dateinfo1").jeDate(end);

$("#dateinfo2").jeDate({
    isinitVal:true,
    festival:false,
    ishmsVal:false,
    minDate: $.nowDate(0),
    maxDate: '2099-06-16 23:59:59',
    format:"YYYY-MM-DD",
    zIndex:3000,
})
</script>
</body>
</html>