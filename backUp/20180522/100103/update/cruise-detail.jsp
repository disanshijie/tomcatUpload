<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!doctype html>
<html>

	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="renderer" content="webkit|ie-comp|ie-stand">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">
		<title>热门线路</title>
		<link href="${ctx}/resource/bootstrap-3.3.5-dist/css/bootstrap.min.css" title="" rel="stylesheet" />
		<link title="" href="${ctx}/resource/css/style.css" rel="stylesheet" type="text/css" />
		<link title="blue" href="${ctx}/resource/css/dermadefault.css" rel="stylesheet" type="text/css" />
		<link href="${ctx}/resource/css/templatecss.css" rel="stylesheet" title="" type="text/css" />
		<link type="text/css" rel="stylesheet" href="${ctx}/resource/jedate/skin/jedate.css">
		<link rel="stylesheet" href="${ctx}/resource/calendar/css/calendar-pro.css"/>
		<script src="${ctx}/resource/calendar/js/jquery-2.1.4.min.js"></script>
		<script src="${ctx}/resource/script/jquery.cookie.js" type="text/javascript"></script>
		<script src="${ctx}/resource/bootstrap-3.3.5-dist/js/bootstrap.min.js" type="text/javascript"></script>
		<script src="${ctx}/resource/script/jquery.ajaxfileupload.js" type="text/javascript"></script>
		<script type="text/javascript" src="${ctx}/resource/jedate/jquery.jedate.js"></script>
		<script src="${ctx}/resource/js/base.js" type="text/javascript"></script>
		<script type="text/javascript" src="${ctx}/resource/js/common.js"></script>
		<script type="text/javascript" src="${ctx}/common/decimal.js"></script>
		<script type="text/javascript" src="${ctx}/operator/travel/js/cruise-detail.js"></script>
	</head>

	<body>
		<div class="modal-header bg-title">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
			<h4 class="modal-title">
                	<button type="submit" class="btn-back btn-default fleft glyphicon glyphicon-chevron-left"></button>
                    <span id="lblAddTitle">产品详情</span>
                </h4>
		</div>
		<div class="container-fluid">
			<div class="cruisedetailimgbox">
				<!-- 左边的图片-->
				<div class="imgShowBox" id="bigImgBox">
					<%--<img src="images/detail/1-880-550.jpg">--%>
				</div>
				<div class="xq_text">
					<h5 class="detail-title"></h5>
					<div class="xq_text_top">

					</div>
				</div>
			</div>
			<div class="cruise-detail-box">
				<div class="cruise-tabs" id="tabs">
					<ul>
						<li class="active">
							<a href="#xcts">行程安排</a>
						</li>
						<li>
							<a href="#xcxq" title="">预定须知</a>
						</li>
						<li>
							<a href="#fysm" title="">费用说明</a>
						</li>

					</ul>
				</div>
				<div class="detailed_cont">
					<div class="tabCont" id="schedule">
						<div class="anchor" id="xcts"></div>

					</div>
					<!--tabCont end-->
					<!--tabCont-->
					<div class="tabCont">
						<div class="anchor" id="xcxq"></div>
						<div class="hot-detail-title"><span>预订须知</span></div>
						<div class="text_box">

						</div>
					</div>
					<!--tabCont end-->
					<!--tabCont-->
					<div class="tabCont">
						<div class="anchor" id="fysm"></div>
						<div class="hot-detail-title"><span>费用说明</span></div>
						<div class="fysm_box">

						</div>
					</div>
				</div>
			</div>
		</div>

		<!--邮轮预定模态框-->
		<div class="modal fade" id="myModal_xq" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog-xq">
				<div class="modal-content-order">
					<div class="modal-header bg-title">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
						<h4 class="modal-title">
							<button type="submit" class="btn-back btn-default fleft glyphicon glyphicon-chevron-left"></button>
							<span id="lblAddTitle1">产品预定</span>
						</h4>
					</div>
					<div class="modal-order-xq-content">
						<div class="yuding-title"><span>预定舱型</span></div>
						<div class="pro-recommend">
							<table class="yuding-table">
								<thead>
								<tr>
									<td class="w25">舱型</td>
									<td class="w10">价格</td>
									<td class="w10">剩余间数</td>
									<td class="w10">销售价</td>
									<td class="w10">预定间数</td>
									<td class="w10">操作</td>
									<td class="w5">备注</td>
								</tr>
								</thead>
								<tbody id="houseList">
								</tbody>
							</table>
							<div class="zhan-fit-1 fright">
								<h1>实际支付：</h1><input class="form-control" id="pay_price1" value="0.00" placeholder="请输入定金" type="text"><span>元</span></div>
							<p class="fright" style="margin-top:3px; margin-bottom:0px; color:#333;">总价：<span class="price-color" id="totalPrice"></span></p>
						</div>
					</div>
					<div class="modal-order-xq-content">
						<div class="yuding-title"><span>预订信息</span></div>
						<div class="pro-recommend">
							<div class="over-hidden" style="margin-left: 13px;">
								<div class="yuding-xinxi">
									<h1>客户类型<span style="color:red">*</span>：</h1>
									<select id="customerType1" name="" type="text" class="form-control">
										<option value="2">同行</option>
										<option value="1" >直客</option>
									</select>
								</div>
								<div class="yuding-xinxi">
									<h1>预定类型<span style="color:red">*</span>：</h1>
									<select id="book_Type" name="" type="text" class="form-control">
										<option value="1" selected = "selected" >占位</option>
										<option value="2">报名</option>
									</select>
								</div>
							</div>
							<div class="yuding-xinxi">
								<h1>联系人姓名<span style="color:red">*</span>：</h1>
								<input type="text" class="form-control" id="contactName">
							</div>
							<div class="yuding-xinxi">
								<h1>联系方式<span style="color:red">*</span>：</h1>
								<input type="text" class="form-control" id="contactPhone">
							</div>
							<div class="yuding-xinxi">
								<h1>邮箱<span style="color:red">*</span>：</h1>
								<input type="text" style="width: 160px" class="form-control" id="email">
							</div>
						</div>
					</div>
					<div class="modal-order-xq-content" id="order" style="display: none;">
						<div class="yuding-title"><span>报名用户</span></div>
						<div class="pro-recommend" id="bm_tb">

						</div>
					</div>
					<div class="over-hidden">
						<button type="button" class="yuding-tijiao-button" onclick="commitBook();" id="btn_buy">确认提交</button>
						<button type="button" class="yuding-quxiao-button" data-dismiss="modal">取消</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal -->
		</div>

		<%--自驾预定、精品游模态框--%>
		<div class="modal fade" id="myModal_zijia" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog-xq">
				<div class="modal-content-order">
					<div class="modal-header bg-title">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
						<h4 class="modal-title">
							<button type="submit" class="btn-back btn-default fleft glyphicon glyphicon-chevron-left"></button>
							<span id="lblAddTitle_yd">产品预定</span>
						</h4>
					</div>
					<div class="modal-order-xq-content">
						<div class="yuding-title"><span></span></div>
						<div class="pro-recommend">
							<table class="yuding-table">
								<thead>
								<tr>
									<td class="w25">产品名称</td>
									<td class="w10">单价</td>
									<td class="w10">产品剩余</td>
									<%--<td class="w10">销售价</td>--%>
									<td class="w25">预定人数</td>
								</tr>
								</thead>
								<tbody>

								<tr>
									<td class="yuding-name" id="title"></td>
									<td id="price"></td>
									<td id="num"></td>
									<td>
										<div class="addreduce">
											<span class="reduce" onclick="reduce()"></span>
											<input class="addnumber" type="text" value="0" onchange="regFun()" onblur="regFun()" oninput="regFun()"/>
											<span class="add" onclick="add()"></span>
										</div>
									</td>
								</tr>
								</tbody>
							</table>
							<div class="zhan-fit-2 fright">
								<h1>实际支付：</h1><input id="pay_price" class="form-control" placeholder="请输入定金" type="text" value="0.00"><span>元</span></div>
							<p class="fright" style="margin-top:3px; margin-bottom:0px; color:#333;">总价：<span class="price-color"></span></p>
						</div>
					</div>
					<div class="modal-order-xq-content">
						<div class="yuding-title"><span>预订信息</span></div>

						<div class="pro-recommend">
							<div class="over-hidden" style="margin-left: 13px;">
								<div class="yuding-xinxi">
									<h1>客户类型<span style="color:red">*</span>：</h1>
									<select id="customerType" name="" type="text" class="form-control">
										<option value="1" selected = "selected" >直客</option>
										<option value="2">同行</option>
									</select>
								</div>
								<div class="yuding-xinxi">
									<h1>预定类型<span style="color:red">*</span>：</h1>
									<select id="bookType" name="" type="text" class="form-control">
										<option value="1" selected = "selected" >占位</option>
										<option value="2">报名</option>
									</select>
								</div>
							</div>
							<div class="yuding-xinxi">
								<h1>联系人姓名<span style="color:red">*</span>：</h1>
								<input id="contact" class="form-control w35" placeholder="请输入联系人" type="text" />
							</div>
							<div class="yuding-xinxi">
								<h1>联系方式<span style="color:red">*</span>：</h1>
								<input id="contactTel" class="form-control w50" placeholder="请输入手机号" type="text" />
							</div>

						</div>
					</div>

					<div class="modal-order-xq-content" id="order1" style="display: none;">
						<div class="yuding-title"><span>报名</span></div>
						<div class="pro-recommend">
							<table id="tb" class="table table-bordered table-header yuding-baoming">

							</table>
						</div>
					</div>
					<div class="over-hidden">
						<button id ="book_submit"  type="submit" class="yuding-tijiao-button" onclick="commitBook()">确认提交</button>
						<button type="button" class="yuding-quxiao-button" data-dismiss="modal">取消</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal -->
		</div>

		<!-- 订单支付 模态框（Modal） -->
		<div class="modal fade" id="myModal_recharge" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="recharge-header bg-title">
						<span class="pay-header-title fleft active">余额支付</span>
						<span class="pay-header-title fleft">微信支付</span>
						<span class="pay-header-title fleft">银行转账</span>
					</div>
					<div class="yue">
						<div class="modal-center-6">
							<div class="modal-yd-xq">
								<h1>现金余额：</h1>
								<p class="yue-p" id="cash">￥0</p>
							</div>
							<div class="modal-yd-xq">
								<h1>信用余额：</h1>
								<p class="yue-p" id="credit_money">￥0</p>
							</div>
							<div class="modal-yd-xq">
								<h1>总资产：</h1>
								<p class="yue-p" id="total_money">￥0</p>
							</div>
							<div class="recharge-date" style="display:none;">
								<h1>支付金额</h1>
								<input class="form-control" id="opMoney_3" name="recharge" placeholder="请输入支付金额" type="text" readOnly="true"/><span>元</span>
							</div>
							<div class="recharge-date" style="display:none;">
								<h1>汇款时间</h1>
								<input class="form-control" id="accountTime_3" placeholder="选择汇款时间" type="text"/>
							</div>

						</div>
					</div>
					<div class="yinhang">
						<div class="modal-center-6">
							<div class="pay-logo fleft"><img src="${ctx}/resource/images/pay.jpg" /></div>
							<div class="pay-account fleft">
								<p>公司名称：北京华美欧国际旅游有限责任公司</p>
								<p>开户行：中国民生银行北京三元支行</p>
								<p>账号：0129 0128 3000 1960</p>
							</div>
						</div>
						<div class="modal-center-6">
							<div class="release-price">
								<h1>支付金额(元)<font color="red">*</font>：</h1>
								<input class="form-control" id="opMoney_2" name="recharge" placeholder="请输入支付金额" type="text" readOnly="true"/>
							</div>
							<div class="recharge-unit">
								<h1>汇款单位：</h1>
								<input class="form-control" id="opCompany_2" placeholder="请输入汇款单位" type="text" />
							</div>
							<div class="recharge-date">
								<h1>汇款时间<font color="red">*</font>：</h1>
								<input class="form-control" id="accountTime_2" placeholder="选择汇款时间" type="text"/>
							</div>
							<div class="modal-yyzz">
								<h1>上传水单<font color="red">*</font>：</h1>
								<div class="inputFileWrapper">
									<label for="inputFile">
										<input id="inputFile" name="inputFile" accept="image/*" type="file"/>
										 <span class="custorm-style">
											 <span class="left-button">浏览</span>
											 <span class="form-control right-text tianjia-shuidan-bg" id="rightText"></span>
										     <input type="hidden" id="pic" value=""/>
										 </span>
									</label>
									<!-- 默认账号是民生银行账户 -->
									<!--                     <input type="hidden" id="account" /> -->
									<input type="hidden" id="busCode" />
								</div>
							</div>
						</div>
					</div>
					<div class="wei-pay">
						<div class="modal-center-6">
							<div class="weixin-pay">
								<p class="weixin-pay-p">支持微信和支付宝扫码</p>
								<img src="${ctx}/resource/images/pay_weixin.png"/>
								<p>北京华美欧国际旅游有限责任公司</p>
							</div>
							<div class="weixin-pay-account">
								<div class="weixin-price">
									<h1>支付金额(元)<font color="red">*</font>：</h1>
									<input name="recharge" id="opMoney_1" class="form-control" placeholder="请输入支付金额" type="text" readOnly="true">
								</div>
								<div class="weixin-recharge-unit">
									<h1>汇款单位：</h1>
									<input class="form-control" id="opCompany_1" placeholder="请输入汇款单位" type="text">
								</div>
								<div class="weixin-recharge-date">
									<h1>汇款时间<font color="red">*</font>：</h1>
									<input class="form-control" id="accountTime_1" placeholder="选择汇款时间" type="text">
								</div>
							</div>
						</div>
					</div>


					<div class="modal-footer modal-footer-margin-top">
						<input type="hidden" id="financePicUrl" value=""/>
						<p style=" float:left;">待支付金额：<span id="sub_money">￥0</span></p>
						<button type="button" class="btn btn-default" data-dismiss="modal" onclick="">取消</button>
						<button type="button" id="sbmit" onclick="toSubmit();" class="btn btn-primary modal-tianjia-footer-mr ">立即支付</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div><!-- /.modal -->
		</div>
		<!-- 申请拼舱 -->
		
		<form id="form_condition" method="post">
        	<input class="code" name="order.code" type="hidden">
        	<input class="opName" name="order.opName" type="hidden">
   		</form>
	</body>
	<script>
		$(document).ready(function(){
			load();
		});
		function dismissModel(){
			$("#myModal_recharge").modal("hide");
			$('#btn_buy').attr('onclick', 'commitBook();');
			$('#book_submit').attr('onclick', 'commitBook();');
			$('#sbmit').attr('onclick', 'toSubmit();');
		}
		//更改预定类型
		$('div').on('change',"#bookType",function(){
			if($("#bookType").val() == "1"){
				$("#order1").hide();
			}else if($("#bookType").val() == "2"){
				$("#order1").show();
			}
		});

		$('div').on('change',"#book_Type",function(){
			if($("#book_Type").val() == "1"){
				$("#order").hide();
			}else if($("#book_Type").val() == "2"){
				$("#order").show();
			}
		});


		/*$('div').on('click','#bookType option', function(){
			var type = $(this).text();
			if(type == '占位'){
				$('#tb').hide();
			}else{
				$('#tb').show();
			}
		});
		$('div').on('click','#book_Type option', function(){
			var type = $(this).text();
			if(type == '占位'){
				$('#bm_tb').hide();
			}else{
				$('#bm_tb').show();
			}
		});*/
		$('table').on('click','.idcard option',function(){
			var x = $(this).text();
			var y = '身份证';
			if(x == y) {

//          护照头
				var hzHead= $(this).parents('tr').next('.huzhao-info-head').hide();
				hzHead.next('.huzhao-info-body').hide();
			} else {

				var hzHead= $(this).parents('tr').next('.huzhao-info-head').show();
				hzHead.next('.huzhao-info-body').show();
			}
		});
		//自驾游和精品游
		$('#tb').on('click','.del',function(){
			return delTr(this);
		});

		$('#tb').on('click','.insurance',function(){
			return chooseInsurance(this);
		});
		//游轮预定
		//删除单人信息
		$('#bm_tb').on('click','.del',function(){
			return delTr(this);
		});

		$('#bm_tb').on('click','.bus',function(){
			return chooseBus(this);
		});

		$('#bm_tb').on('click','.insurance',function(){
			return chooseInsurance(this);
		});

		$('#bm_tb').on('click','.idcard option',function(){
			var x = $(this).text();
			var y = '身份证';
			if(x == y) {

//          护照头
				var hzHead= $(this).parents('tr').next('.huzhao-info-head').hide();
				hzHead.next('.huzhao-info-body').hide();
			} else {

				var hzHead= $(this).parents('tr').next('.huzhao-info-head').show();
				hzHead.next('.huzhao-info-body').show();
			}
		});


		$('#tb').on('click','.date',function(){
			$(this).jeDate({
				isinitVal: true,
				festival: false,
				ishmsVal: false,
				initAddVal: [0],
				minDate: '1900-01-01 00:00:00',
				maxDate: '2099-06-16 23:59:59',
				format: "YYYY-MM-DD",
				zIndex: 3000,
			})
		});

		$('#bm_tb').on('click','.date',function(){
			$(this).jeDate({
				isinitVal: true,
				festival: false,
				ishmsVal: false,
				initAddVal: [0],
				minDate: '1900-01-01 00:00:00',
				maxDate: '2099-06-16 23:59:59',
				format: "YYYY-MM-DD",
				zIndex: 3000,
			})
		});

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
		$("#startTime").jeDate(start);
		$("#endTime").jeDate(end);


		//支付需要的js
		//标志是扫码充值 还是 银行转账
		$("#accountTime_1").jeDate({
			isinitVal:true,
			festival:false,
			ishmsVal:false,
			//minDate: $.nowDate(0),
			maxDate: '2099-06-16 23:59:59',
			format:"YYYY-MM-DD",
			zIndex:3000,
		});
		$("#accountTime_2").jeDate({
			isinitVal:true,
			festival:false,
			ishmsVal:false,
			//minDate: $.nowDate(0),
			maxDate: '2099-06-16 23:59:59',
			format:"YYYY-MM-DD",
			zIndex:3000,
		});
		$("#accountTime_3").jeDate({
			isinitVal:true,
			festival:false,
			ishmsVal:false,
			format:"YYYY-MM-DD",
			zIndex:3000,
		});
		var fileBtn = $("input[type=file]");
		fileBtn.on("change", function(){
			var index = $(this).val().lastIndexOf("\\");
			var sFileName = $(this).val().substr((index+1));
			$("#rightText").html(sFileName);
			$("#pic").val(sFileName);
			//把图片转成base64编码，并压缩
//			zipImg();
		});
		$("#rightText").click(
				function(){
					$(this).removeClass("tianjia-shuidan-bg");
				}
		);
		$(".left-button").click(
				function(){
					$("#rightText").removeClass("tianjia-shuidan-bg");
				}
		);
		//支付
		$(".yinhang").hide();
		$(".wei-pay").hide();
		var accountType = 3;	//默认是扫码充值
		$(".pay-header-title").click(
				function(){
					$(this).addClass("active").siblings().removeClass("active");
					if($(this).index()===0){
						$(".yue").show();
						$(".yinhang").hide();
						$(".wei-pay").hide();
						accountType = 3;//余额
					}else if($(this).index()===1){
						$(".wei-pay").show();
						$(".yinhang").hide();
						$(".yue").hide();
						accountType = 1;//微信
					}else{
						$(".wei-pay").hide();
						$(".yinhang").show();
						$(".yue").hide();
						accountType = 2;//银行
					}
					$("input[name=recharge]").focus();
				}
		);


		var iframeHeight = $("body").height();
		$(window.parent.document).find("#myiframe").height(iframeHeight + 20);
		$(document).scroll(
			function() {
				var x = $(this).scrollTop();
				if(x > 667) {
					$("#tabs").addClass("tabs-scoll");

				} else {
					$("#tabs").removeClass("tabs-scoll");

				}
			}
		);
		$("#tabs ul li").click(
			function() {
				$(this).addClass("active").siblings().removeClass("active");
			}
		);
		$(".modal-title button").click(
			function() {
				location.href = document.referrer;
			}
		);
		var modalContentMinheight = window.screen.availHeight - 100;
		$(".modal-content-order").css("min-height", modalContentMinheight + "px");
	</script>
	<script src="${ctx}/resource/js/ToolTip.js" type="text/javascript"></script>

</html>