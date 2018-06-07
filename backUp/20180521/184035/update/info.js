//初始化页面
var UPLOAD_RESOURCE_IMG = '/upload/resource/img/';
var UPLOAD_NOTICE_IMG='/upload/notice/img/';
var ctx = getContextPath();
var sortField,sortType,startCity,startDate,price,days,cruiseComp,shippingLine;
function initPage(){
	showNotice();
	searchOrderCountByStatus();
	resourceInfo();
	turnoverInfo();
	financeInfo();
	searchNoticeCount();
}
//财务审核信息
function financeInfo(){
	$.ajax({
		url:getContextPath()+"/finance/statisticsFinanceCheck.do",
		type:'post',
		data:{},
		dataType:'json',
		success:function(data){
			if(data.success== 1){
				var checkCount = (data.datas.chechCount == null ||data.datas.chechCount == null)?0:data.datas.chechCount;
				$('#jzsh').text(checkCount);
			}else{
				Jalert(data.msg);
			}
		}
	});
}
//跳转到订单页面
function toPageSearch(status){
	window.location = getContextPath()+"/manager/order/myorder_right.jsp?&status="+status;
}
//营业额信息
function turnoverInfo(){
	$.ajax({
		url:getContextPath()+"/order/turnoverInfo.do",
		type:'post',
		data:{},
		dataType:'json',
		success:function(data){
			if(data.success == 1){
				var datas = data.datas;
				//今日收客（人）
				var dayGuset = (datas[0].dayGuset == null || datas[0].dayGuset == '')?0:datas[0].dayGuset;
				//本月收客（人）
				var monGuset = (datas[0].monGuset == null || datas[0].monGuset == '')?0:datas[0].monGuset;
				//今日营业额（元）
				var dayTurnOver = (datas[0].dayTurnOver == null || datas[0].dayTurnOve == '')?0:datas[0].dayTurnOver;
				//今日订单数
				var dayOrder = (datas[0].dayOrder == null || datas[0].dayOrder == '')?0:datas[0].dayOrder;
				//本月营业额
				var monthTurnOver = (datas[0].monthTurnOver == null || datas[0].monthTurnOver == '')?0:datas[0].monthTurnOver;
				//本月订单数
				var monthOrder = (datas[0].monthOrder == null || datas[0].monthOrder == '')?0:datas[0].monthOrder;
				//本月未收账款
				var monthDebt = (datas[0].monthDebt == null || datas[0].monthDebt == '')?0:datas[0].monthDebt;
				//今日未收账款
				var dayDebt = (datas[0].dayDebt == null || datas[0].dayDebt == '')?0:datas[0].dayDebt;
				$('#dayGuest').text(dayGuset);
				$('#monGuest').text(monGuset);
				$('#dayTurnOver').text(dayTurnOver);
				$('#monthTurnOver').text(monthTurnOver);
				$('#dayDebt').text(dayDebt);
				$('#monthDebt').text(monthDebt);
				$('#dayOrder').text(dayOrder);
				$('#monthOrder').text(monthOrder);
			}else{
				Jalert(data.msg);
			}
		}
	});
}
//
function showNotice(){
	$.ajax({
		url:getContextPath()+"/system/searchNoticeListToUser.do",
		type:'post',
		data:{'notice.title':$("#queryTitle").val(),
			  'notice.createTime':$("#inpstart").val(),
			  'notice.deadline':$("#inpend").val(),
			  'pager.pageNum':1,
			  'pager.pageSize':2,
			  'notice.status':1
		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
              renderNoticesTitle(data.datas,data.pager);
			}else{
				Jalert(data.msg);
			}
		}
	});
}

//排序条件
function orderBy(field, type) {
	loadWait();
	sortField = field;
	sortType = type;
	showProductIsHot();
}

//生成热门产品推荐
function showProductIsHot(){
	$.ajax({
		url:getContextPath()+"/resource/searchResourceVersionListToProduce.do",
		type:'post',
		data:{
			  'productVersion.cabinId':1,
			  'productVersion.productType':21,
			  'productVersion.generalHot':1,
			  'productVersion.status':1,
			  'productVersion.sortField': sortField,
			  'productVersion.sortType': sortType,
			  'productVersion.startDate': startDate,
			  'productVersion.startCity': startCity,
			  'productVersion.shippingLine': shippingLine,
			  'productVersion.cruiseCompany': cruiseComp,
			  'productVersion.customerType': 1,
			  'productVersion.price': price,
			  'productVersion.days': days,
			  'pager.pageNum':1,
			  'pager.pageSize':9
		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
              renderProductIsHot(data.datas);
			}else{
				Jalert(data.msg);
			}
		}
	});
}

//生成热门产品推荐html
function renderProductIsHot(datas){
	var list1 = '';
	var list2 = '';
	for(var i = 0; i < datas.length; i++){
		//var minPrice = selectMinPriceByResourceCode(datas[i].code);
		/*var minPrice = minHousePrice(datas[i].id);
		if(minPrice == null){
			minPrice = "--";
		}*/
		if(i < 3){
			list1 = list1+'<div class="rc_box">'
				+'<a href="'+ctx+'/index/login-hot-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruiseId+'&vid='+datas[i].id+'&from=51Cruise" target="_blank" class="pic_link">'
				+'<img src="'+getContextPath()+UPLOAD_RESOURCE_IMG+datas[i].picPath+'">'
				+'</a>'
				+'<div class="index-special-menu-content">'
				+'<a href="'+ctx+'/index/login-hot-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruiseId+'&vid='+datas[i].id+'&from=51Cruise" target="_blank"><h3>'+datas[i].title+'</h3></a>'
				/*+'<span class="cost-price">￥'+datas[i].price+'</span>'*/
				+'<div class="w100 over-hidden">'
				+'<span class="fleft index-special-menu-date">'+datas[i].startCity+'出发</span>'
				+'<span class="fright index-special-menu-price">￥'+datas[i].minPrice+'元/人起</span>'
				//+'<span class="fright index-special-menu-price">￥'+datas[i].umPrice+'元/人起</span>'
				+'</div>'
				+'</div>'
				+'</div>'
		}
		if(i >= 3 && i < 6){
			list2 = list2+'<div class="rc_box">'
				+'<a href="'+ctx+'/index/login-hot-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruiseId+'&vid='+datas[i].id+'&from=51Cruise" target="_blank" class="pic_link">'
				+'<img src="'+getContextPath()+UPLOAD_RESOURCE_IMG+datas[i].picPath+'">'
				+'</a>'
				+'<div class="index-special-menu-content">'
				+'<a href="'+ctx+'/index/login-hot-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruiseId+'&vid='+datas[i].id+'&from=51Cruise" target="_blank"><h3>'+datas[i].title+'</h3></a>'
				/*+'<span class="cost-price">￥'+datas[i].price+'</span>'*/
				+'<div class="w100 over-hidden">'
				+'<span class="fleft index-special-menu-date">'+datas[i].startCity+'出发</span>'
				+'<span class="fright index-special-menu-price">￥'+datas[i].minPrice
				+'元/人起</span>'
				//+'<span class="fright index-special-menu-price">￥'+datas[i].umPrice+'元/人起</span>'
				+'</div>'
				+'</div>'
				+'</div>'
		}
	}
	 $('#product1').html(list1);
	 $('#product2').html(list2);

	/*轮播图*/

	/*var list1='<div class="item active index-special-menu-box">';
	var list2='<div class="item index-special-menu-box">';
	var list3='<div class="item index-special-menu-box">';
	for(var i=0;i<datas.length;i++){
	if(i<3){
		list1=list1+
		
			'<div class="index-special-menu">'+
			'<a href="'+ctx+'/index/login-hot-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruiseId+'&from=51Cruise" target="_blank" class="fleft">'+
				'<img src="'+getContextPath()+UPLOAD_RESOURCE_IMG+datas[i].picPath+'"/>'+
				'<div class="index-special-menu-content">'+
					'<h3>'+datas[i].title+'</h3>'+
					'<span class="cost-price">'+datas[i].umPrice+'</span>'+
					'<div class="w100 over-hidden" style="margin-top: 26px;">'+
						'<span class="fleft index-special-menu-date">'+datas[i].travelDate+datas[i].startCity+'出发</span>'+
						'<span class="fright index-special-menu-price">￥'+datas[i].price+'元/人起</span>'+
					'</div>'+
				'</div>'+
				'</a>'+
			'</div>'
		;
	}
		if(i>=3 && i<6){
			list2=list2+
			
				'<div class="index-special-menu">'+
				'<a href="'+ctx+'/index/login-hot-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruiseId+'&from=51Cruise" target="_blank" class="fleft">'+
					'<img src="'+getContextPath()+UPLOAD_RESOURCE_IMG+datas[i].picPath+'"/>'+
					'<div class="index-special-menu-content">'+
						'<h3>'+datas[i].title+'</h3>'+
						'<span class="cost-price">'+datas[i].umPrice+'</span>'+
						'<div class="w100 over-hidden" style="margin-top: 26px;">'+
						'<span class="fleft index-special-menu-date">'+datas[i].travelDate+datas[i].startCity+'出发</span>'+
						'<span class="fright index-special-menu-price">￥'+datas[i].price+'元/人起</span>'+
						'</div>'+
					'</div>'+
					'</a>'+
				'</div>'
			;
		}
		if(i>=6 && i<9){
			list3=list3+
			'<div class="index-special-menu">'+
			'<a href="'+ctx+'/index/login-hot-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruiseId+'&from=51Cruise" target="_blank" class="fleft">'+
				'<img src="'+getContextPath()+UPLOAD_RESOURCE_IMG+datas[i].picPath+'"/>'+
				'<div class="index-special-menu-content">'+
					'<h3>'+datas[i].title+'</h3>'+
					'<span class="cost-price">'+datas[i].umPrice+'</span>'+
					'<div class="w100 over-hidden" style="margin-top: 26px;">'+
					'<span class="fleft index-special-menu-date">'+datas[i].travelDate+datas[i].startCity+'出发</span>'+
					'<span class="fright index-special-menu-price">￥'+datas[i].price+'元/人起</span>'+
					'</div>'+
				'</div>'+
				'</a>'+
			'</div>'
			;
		}
		
	}
	list1=list1+'</div>';
	list2=list2+'</div>';
	list3=list3+'</div>';
	$("#productIsHot").append(list1);
	$("#productIsHot").append(list2);
	$("#productIsHot").append(list3);*/
}

//查询产品房型最低价
function selectMinPriceByResourceCode(code){
	var minPrice="";
	$.ajax({
		url:getContextPath()+"/resource/selectMinPriceByResourceCode.do",
		type:'post',
		async:false,
		data:{
			'resource.code':code,
		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
			minPrice = data.datas;
			}else{
				Jalert(data.msg);
			}
		}
	});
	return minPrice;
}

//获取航期房型最低价
function minHousePrice(vid){
	var minPrice="";
	$.ajax({
		url:getContextPath()+"/resource/getMinHousePriceByVid.do",
		type:'post',
		async:false,
		data: {"productVersion.id":vid,
		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				if(data.datas == null || data.datas.length == 0) {
					minPrice = '';

				} else {
					minPrice = data.datas;
				}
			}else{
				Jalert(data.msg);
			}
		}
	});
	return minPrice;
}

//产品详情
function showDetail(code){

	$.ajax({
		url:getContextPath()+"/resource/searchWordContentByResourceInfo.do",
		type:'post',
		data:{'resource.code':code},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				$("#modal_detail").html(data.datas);
				$("#modal_reserve_button").html('<button id="" onclick="reserve(\''+code+'\')" type="button" class="btn btn-primary modal-tianjia-footer-mr fright">预定</button>');
				$("#myModal_xq").modal("show");
			}else{
				Jalert(data.msg);
			}
		}
	});
}
//首页预定产品
function reserve(code){
	window.location.href = getContextPath() + '/resource/toSearchOfIndex.do?ret=list'+
													'&resource.code='+code;
}									
//生成最新公告内容
function showNoticeIsNew(){
	$.ajax({
		url:getContextPath()+"/system/searchNoticeListToUser.do",
		type:'post',
		data:{
			  'pager.pageNum':1,
			  'pager.pageSize':6,
			  'notice.status':1
		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
              renderNoticesIsNew(data.datas);
			}else{
				Jalert(data.msg);
			}
		}
	});
}
//生成最新公告内容html
function renderNoticesIsNew(datas){
	var list="";
	String.prototype.stripHTML = function() {
		var reTag = /<(?:.|\s)*?>/g;
		return this.replace(reTag,"");
	};

	for(var i=0;i<datas.length;i++){
		var stringHtml = datas[i].content;
		var content = stringHtml.stripHTML();
		content=content.replace(/&nbsp;/ig, "");
		list = list+'<li>'
			+'<img src="'+getContextPath()+datas[i].picNotice+'" title="'+datas[i].title+'">'
			+'<h1>'+content.substr(0,43)+'<a style="color: #06C;" onclick="renderNoticeDetail(\''+escape(JSON.stringify(datas[i]))+'\')">...详情>></a></h1>'
			+'</li>'
	}
	$("#noticeIsNew").html(list);
}
//生成公告题目行
function renderNoticesTitle(datas,pager){
	var list="";
	for(var i=0;i<datas.length;i++){
		list=list+'<a onclick="renderNoticeDetail(\''+escape(JSON.stringify(datas[i]))+'\')"><span>['+datas[i].createTime+']</span>'+datas[i].title+'</a>';
	}
	if(pager.totalPages>1){
		list=list+"<a onclick='loadNoticeList(1)'>更多>></a>";
		}
	$("#hotNoticeTitle").html(list);
}
//得到公告信息
function loadNoticeList(pageNum){
	$.ajax({
		url:getContextPath()+"/system/searchNoticeListToUser.do",
		type:'post',
		data:{'notice.title':$("#queryTitle").val(),
			  'notice.createTime':$("#inpstart").val(),
			  'notice.deadline':$("#inpend").val(),
			  'pager.pageNum': pageNum,
			  'pager.pageSize': 5,
			  'notice.status':1
		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
              renderNoticesInfo(data.datas);
              renderPager(data.pager,"loadNoticeList");
              $("#myModal_notice_list").modal("show");
			}else{
				Jalert(data.msg);
			}
		}
	});
}
//生成公告信息表
function renderNoticesInfo(data){
	var list="";
	for(var i=0;i<data.length;i++){
		list=list+'<tr>'+
		'<td >'+data[i].title+'</td>';

		String.prototype.stripHTML = function() {
			var reTag = /<(?:.|\s)*?>/g;
			return this.replace(reTag,"");
		};
		var stringHtml = data[i].content;
		var content = stringHtml.stripHTML();
		list=list+'<td>'+content.substring(0,96)+'...<a onclick="renderNoticeDetail(\''+escape(JSON.stringify(data[i]))+'\')">详情>></a></td></tr>';
		
	}
	$("#hotNoticeListToUser").html(list);
}
//生成公告详情
function renderNoticeDetail(data){
	var dataStore = JSON.parse(unescape(data));
	$("#lblAddTitle").text(dataStore.title);
	$("#lblContent").html(dataStore.content);
	$("#lblCreateTime").text("发布时间："+dataStore.createTime);
	$("#businessImg").attr("src",getContextPath()+dataStore.picNotice);
	$("#myModal_notice_list").modal("hide");
	$("#myModal_notice_xq").modal('show');
}

//根据订单状态查出订单数量

function searchOrderCountByStatus(){
	$.ajax({
		url:getContextPath()+'/order/searchOrderCountByStatus.do',
		type:'post',
		data:{
			'order.status':status
		},
		dataType:'json',
		success:function(data){
			if(data==null || data.datas==null) return;
			if(data.success == 1) {
				var datas = data.datas;
				var count = 0;
				for (var i = 0; i < datas.length; i++) {
					if (datas[i].STATUS == 1) $("#dzf").text(datas[i].COUNT);
					if (datas[i].STATUS == 2) $("#djdsp").text(datas[i].COUNT);
					if (datas[i].STATUS == 7) $("#qkdsp").text(datas[i].COUNT);
					if (datas[i].STATUS == 11) $("#tjsp").text(datas[i].COUNT);

					/*if (datas[i].STATUS == 2||datas[i].STATUS == 7) {
						count +=parseInt(datas[i].COUNT);
						$("#dsp").text(count);
					};*/
				}
			}else{
				Jalert('获取失败, code:' + data.msg);
			}
		}
	});
}

//得到已催单条数
function searchNoticeCount(){
	//已催单条数
	var nCount = 0;
	$.ajax({
		url:getContextPath()+"/system/searchIsEnableNoticeCount.do",
		type:'post',
		data:{},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				for(var i = 0; i < data.datas.length; i++){
					if(data.datas[i].busType == 1)nCount++;
				}
				$("#ycd").text(nCount);
			}else{
				Jalert(data.msg);
			}
		}
	});

}

//资源概况
function resourceInfo(){
	$.ajax({
		url:getContextPath()+'/resource/statisticsResource.do',
		type:'post',
		data:{},
		dataType:'json',
		success:function(data){
			if(data == null || data.datas == null) return;
			if(data.success == 1){
				var datas = data.datas;
				var list = '';
				var totalCount = 0;
				for(var i = 0; i < datas.length; i++){
					var pid = datas[i].board_city_id.substr(0,3);
					if((i)%3 == 0){
						list = list +'<div><p>'+getDistrict(pid)+'<span>'+datas[i].COUNT+'</span></p>';
					}else if((i+1)%3 == 0){
						list = list +'<p>'+getDistrict(pid)+'<span>'+datas[i].COUNT+'</span></p></div>';
					}else{
						list = list +'<p>'+getDistrict(pid)+'<span>'+datas[i].COUNT+'</span></p>';
					}
					totalCount +=datas[i].COUNT;
				}
				$('#totalCount').text(totalCount);
				$('#startCity').html(list);
			}else{
				Jalert('获取失败, code:' + data.msg);
			}
		}
	});
}

//区域
function getDistrict(pid){
	var district;
	if(pid == 100) district = "国内";
	if(pid == 101) district = "港澳";
	if(pid == 102) district = "日韩";
	if(pid == 103) district = "欧洲";
	if(pid == 104) district = "北美";
	if(pid == 105) district = "南美";
	if(pid == 106) district = "东南亚";
	if(pid == 107) district = "大西洋";
	if(pid == 108) district = "中美洲";
	if(pid == 109) district = "太平洋";
	if(pid == 110) district = "澳新";
	if(pid == 111) district = "地中海";
	if(pid == 112) district = "南北极";
	if(pid == 113) district = "印度洋";
	if(pid == 114) district = "中东非";
	return district;
}
//获取优惠产品
function getGoods(cruiseCompId,cruiseId){
	$.ajax({
		url:getContextPath()+"/resource/searchResourceVersionListToProduce.do",
		type:'post',
		data:{
			  'pager.pageNum':1,
			  'pager.pageSize':9,
			  'productVersion.cruiseCompanyId':cruiseCompId,
			  'productVersion.cruiseId':cruiseId,
			  'productVersion.cabinId':1,
			  'productVersion.generalHot':1,
			  'productVersion.customerType': 1,
			  'productVersion.status':1
//			  'resource.isHot':1,
//			  'productVersion.showLevel':1,
			  
		},
		dataType:'json',
		success:function(data){
			if(data == null || data.datas == null) return;
			if(data.success == 1){
				var datas = data.datas;
				var list = "";
				for(var i = 0; i < datas.length; i++){
					if(i <= 2){
					list = list+'<li>'+
						'<img src="'+getContextPath()+UPLOAD_RESOURCE_IMG+datas[i].picPath+'"/>'+
						'<h1><a href="'+ctx+'/index/login-hot-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruiseId+'&vid='+datas[i].id+'&from=51Cruise" target="_blank">'+datas[i].title+'</a></h1>'+
						'<span class="index-special-menu-price">￥'+datas[i].minPrice+'元/人起</span>'+
						'<button class="btn fright" onclick="window.open(\''+ctx+'/index/login-hot-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruiseId+'&vid='+datas[i].id+'&from=51Cruise\',\'_blank\')">立即预定</button>'+
					'</li>';
					}
				}
				$("#goods"+cruiseCompId).html(list);
			}
		}
	});
}
//获取游轮航班号
function getFlightNum(cruiseCompId){
	var cruiseId = "";
	$.ajax({
		url:getContextPath()+"/resource/searchFlightNum.do",
		type:'post',
		data:{
			  'cruise.cruiseCompanyId':cruiseCompId
		},
		dataType:'json',
		success:function(data){
			if(data == null || data.datas == null) return;
			if(data.success == 1){
				var datas = data.datas;
				var list = "";
				for(var i = 0; i < datas.length; i++){
					if(i <= 3){
						list = list+
						'<li><a class="cruiseId" href="#" id="'+datas[i].id+'">'+datas[i].name+'</a></li>';
					}
				}
				list = list+'<li><a href="51cruise-hot.jsp" target="content">更多>></a></li>';
				$("#flightNum"+cruiseCompId).html(list);
				$('.cruiseId').unbind();
				$(".cruiseId").click(function(){
					cruiseId = $(this).attr("id");
					getFlightDetail(cruiseId);//获取航班号的详细信息
					getGoods(cruiseCompId,cruiseId);//获取优惠产品详情
				});
				if(cruiseId == "" || cruiseId == undefined){
					cruiseId = $("#flightNum"+cruiseCompId).find('li:eq(0)').find('a:eq(0)').attr("id");//默认第一个航班号
					getFlightDetail(cruiseId);//获取航班号的详细信息
					getGoods(cruiseCompId,cruiseId);//获取优惠产品详情
				}
				
			}
		}
	});
}
//点击航班号获取详细信息
function getFlightDetail(id){
	var cruiseId = id;

	$(".index-supplier-content-top").children("span").remove();
	$(".index-supplier-content-top").children("br").remove();
	$.ajax({
		url:getContextPath()+"/resource/searchFlightNum.do",
		type:'post',
		data:{
			'cruise.id':cruiseId
		},
		dataType:'json',
		success:function(data){
			if(data==null || data.datas==null) return;
			var list = "";
			if(data.success == 1){
				var datas = data.datas;
				var cruiseCompanyId ="";
				for(var i = 0; i < datas.length; i++){
					list = list+
					'<span>首航：'+datas[i].first_flight+'年</span>'+
					'<span>楼层：'+datas[i].floor+'层</span><br/>'+
					'<span>总重：'+datas[i].weight+'吨</span>'+
					'<span>载客：'+datas[i].guests+'人</span>';
					cruiseCompanyId = datas[i].cruise_company_id;
				}
				$("#flightNum"+cruiseCompanyId).after(list);
			}
		}
	});
}
//获取邮轮信息
function getAllDetail(data){
	var list="";
	var list = list+
	'<li class="index-supplier-xq" id="'+data+'">'+
	'<div class="index-supplier-content-left">'+
		'<div class="index-supplier-content-top">'+
			'<img src="./resource/img/'+data+'-logo.png" />'+
			'<ul id="flightNum'+data+'">'+
			'</ul>'+
		'</div>'+
		'<div class="index-supplier-content-bottom">'+
			'<div class="index-supplier-content-youhui">'+
				'<h1>优惠产品</h1>'+
				'<span><a href="51cruise-hot.jsp?from=51Cruise" target="_blank">更多>></a></span>'+
			'</div>'+
			'<div class="index-supplier-content-product">'+
				'<ul id="goods'+data+'">'+
				'</ul>'+
			'</div>'+
		'</div>'+
	'</div>'+
	'<div class="index-supplier-content-right"><img src="./resource/images/73118782756077831.png"/></div>'+
'</li>';
	var cruiseDetail = $('#'+data+'').html();
	if(cruiseDetail == "" || cruiseDetail == null){
		$("#cruiseDetail").append(list);
	}
	var cruiseCompId = 0;
	if(data !="" && data !=null){
		cruiseCompId = data;//点击的油轮公司id
	}
	getFlightNum(cruiseCompId);//显示所有的航班号
}


//查询邮轮登船城市
function searchCruiseDestList() {
	$.ajax({
		url: getContextPath() + '/resource/searchCruiseDestList.do',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data==null || data.datas==null) return;
			if(data.success == 1) {
				var datas = data.datas;
				var list = '<a class="addbg-1 addbg" href="javascript:toFilter(\'startCity\', \'0\');">全部</a>';
				for(var i=0; i<datas.length; i++) {
					list =list+
						'<a href="javascript:toFilter(\'startCity\', \''+datas[i].id+'\');">'+datas[i].name+'</a>';
				}
				$('#destination').html(list);
			} else {
				Jalert('获取失败, code:' + data.msg);
			}
		}
	});
}

//查询邮轮公司
function searchCruiseCompList() {
	$.ajax({
		url: getContextPath() + '/resource/searchCruiseCompList.do',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data==null || data.datas==null) return;
			if(data.success == 1) {
				var datas = data.datas;
				var list = '<a class="addbg-1 addbg" href="javascript:toFilter(\'cruiseComp\', \'0\');">全部</a>';
				for(var i=0; i<datas.length; i++) {
					list =list+
						'<a href="javascript:toFilter(\'cruiseComp\', \''+datas[i].id+'\');">'+datas[i].name+'</a>';
				}
				$('#cruiseComp').html(list);

			} else {
				Jalert('获取失败, code:' + data.msg);
			}
		}
	});
}

//从本月起，生成10个月的月份
function createSTime() {
	var time='<a class="addbg-1 addbg" href="javascript:toFilter(\'startDate\', \'0\');">全部</a>';
	var str = '', year = [];
	for(var i=1; i<11; i++) {
		var d = new Date();
		var m = d.getMonth()+i;
		d.setMonth(m);
		var y = d.getFullYear();
		if(parseInt(m) < 10) m = '0'+m;
		if (m == 12) {m = 12; y = y-1}
		if (m >= 13) {m = m - 12;m = '0'+m}
		var s = y + '-' + m;
		time = time + '<a href="javascript:toFilter(\'startDate\', \''+s+'\');">'+s+'</a>';
	}
	$('#startTime').html(time);


}

//筛选超链接的查询条件
function toFilter(type, cons) {
	loadWait();
	if(type == 'title') {
		if(cons == '') title=null;
		else  title = cons;
	}
	if(type == 'shippingLine') {
		if(cons == 0) shippingLine=null;
		else  shippingLine = cons;
	}
	if(type == 'startCity') {
		if(cons == 0) startCity=null;
		else  startCity = cons;
	}
	if(type == 'cruiseComp') {
		if(cons == 0) cruiseComp=null;
		else  cruiseComp = cons;
	}
	if(type == 'startDate') {
		if(cons == 0) startDate=null;
		else  startDate = cons;
	}
	if(type == 'days') {
		if(cons == 0) days=null;
		else days = cons;
	}
	if(type == 'price') {
		if(cons == 0) price=null;
		else price = cons;
	}
	if(type == 'key') {
		if(cons != 0) {
			key = cons;
		} else {
			key = $('#serach').val().trim();
		}
		if(key == '' || key == null) {
			alert('请输入关键字');
			$('#key').focus();
			return;
		}
	} else {
		key = null;
	}

	showProductIsHot(1);
}