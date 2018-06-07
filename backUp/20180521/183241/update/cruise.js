var productType=21, boardCity, cruiseComp, travelDate, days, key, buyArray,currendData;
var sortField,sortType,startCity,startDate,price,shippingLine;
var operation=3, resourceCode, resourceName, providerCode, providerName;
var totalPrice=0;	//订单总价
var totalNum=0;
var originaltotalPrice=0;	//订单原价总和
var xuhao=0;//所有客户信息序号
var UPLOAD_RESOURCE_IMG = '/upload/resource/img/';
var finance,payType,contact,contactPhone,email,status,array;
var payment = 0;
var vid,title;
//页面初加载
function load() {
	
	loadWait();	
	searchCruiseDestList();
	searchCruiseCompList();
	createSTime();
	//将查询过滤字段都设置为null
	boardCity=null;startCity=null; cruiseComp=null; travelDate=null; days=null; key=null;price=null;
	pageNum=1;
	//searchResource(pageNum);
	searchResourceVersionList(pageNum);
}

//获取用户信息
function getUserInfo(id){
	var obj=$("#myModal_xq");
	$.post(getContextPath() +"/user/searchCurrentUser.do",null,function(result){
		 if(result.success == 1) {
			 var data=result.datas;
			 var msg=result.msg;
			// console.log(data);
			 if(msg=='trader'){
				 $("#contact").val(data.linkman||data.name);
				 $("#contactPhone").val(data.phone);
				 $("#email").val(data.email);
			 }else if(msg =='user'){
				 $("#contact").val(data.linkman||data.name);
				 $("#contactPhone").val(data.mobile);
				 $("#email").val(data.email);
			 }
		 }
	}),"json";
}
//筛选超链接的查询条件
function toFilter(type, cons) {
	
	loadWait();	
	if(type == 'boardCity') {
		if(cons == 0) boardCity=null;
		else  boardCity = cons;
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
	//searchResource(1);
	searchResourceVersionList(1);
}
//查询所有已审核班期
function searchResourceVersionList(pageNum){
	$.ajax({
		url:getContextPath()+"/resource/searchResourceVersionListToProduce.do",
		type: 'post',
		data: {
			'productVersion.cabinId':1,
			'productVersion.productType':21,
			'productVersion.status':1,
			'productVersion.sortField': sortField,
			'productVersion.sortType': sortType,
			'productVersion.startDate': startDate,
			'productVersion.startCity': startCity,
			'productVersion.shippingLine': shippingLine,
			'productVersion.cruiseCompanyId': cruiseComp,
			'productVersion.customerType': 2,
			'productVersion.price': price,
			'productVersion.days': days,
			'pager.pageNum':pageNum,
			'pager.pageSize':10
		},
		dataType: 'json',
		success: function(data) {
			if(data==null || data.datas==null) return;
			if(data.success == 1) {
				if(data.datas == null || data.datas.length == 0) {
					$('#list').empty();
					$('#pager').empty();
					$('#noresult').show();
				} else {
					$('#list').empty();
					$('#noresult').hide();
					rendResourceVersionList(data);
					renderPager(data.pager, "searchResourceVersionList");
				}
			} else {
				Jalert('获取失败, code:' + data.msg);
			}
			commitRemove();
		}
	});
}

//根据分类查询资源
/*function searchResource(pageNum) {
	$.ajax({
		url: getContextPath() + '/resource/searchResourceList.do',
		type: 'post',
		data: {
			'resource.productType': productType,
			'resource.boardCity': boardCity,
			'resource.cruiseCompany':cruiseComp,
			'resource.travelDate': travelDate,
			'resource.status': 1,
			'resource.days': days,
			'resource.key': key,
			'resource.filter': 1,
			'pager.pageNum': pageNum,
			'pager.pageSize': 10
		},
		dataType: 'json',
		success: function(data) {
//			alert(data.datas);
			if(data==null || data.datas==null) return;
			if(data.success == 1) {
				if(data.datas == null || data.datas.length == 0) {
					$('#list').empty();
					$('#pager').empty();
					$('#noresult').show();
				} else {
					$('#list').empty();
					$('#noresult').hide();
					rendList(data);
					renderPager(data.pager, "searchResource");
				}
			} else {
				Jalert('获取失败, code:' + data.msg);
			}
			commitRemove();
		}
	});
}*/

function rendResourceVersionList(data) {
	var datas = data.datas;
	var list="";
	for(var i=0;i<datas.length;i++) {
		list = list +
			'<li>'+
			'<a href="'+getContextPath()+'/operator/travel/cruise-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruiseId+'&productType=21" target="right" class="detail-title'+i+'">'+datas[i].title+'</a>'+
			'<div class="shop-list-info"><img src="'+getContextPath()+UPLOAD_RESOURCE_IMG+datas[i].picPath+'">'+
			'<div class="hot-list-info-p">'+
			'<p><b>登船城市：</b> '+datas[i].startCity+'</p>'+
			'<p><b>目的地：</b> '+datas[i].endCity+'</p>'+
			'<p><b>出发日期：</b>'+datas[i].startDate+'</p>'+
			'<p><b>行程天数：</b>'+datas[i].days+'</p>'+
			'<p><b>邮轮公司：</b>'+datas[i].cruiseCompany+'</p>'+
			'<div class="shop-list-price">'+
				'<span><small>￥</small>'+datas[i].minPrice+'<small>起</small></span>'+
//			'<button id="hqyd'+i+'" class="btn btn-success" type="button" onclick="toBuy(\''+escape(JSON.stringify(datas[i]))+'\')">预订</button>'+
			'<button id="hqyd'+i+'" class="btn btn-success" type="button" onclick="quickToBuy(\''+datas[i].code+'\',\''+datas[i].cruiseId+'\',21)">预订</button>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</li>';
	}
	$('#list').html(list);
}
//查询结果
/*function rendList(data) {
	var datas = data.datas;
	var list="";
	for(var i=0;i<datas.length;i++) {
			var price = '暂无';
			if(!datas[i].price ==  null || !datas[i].price == '' ||typeof (datas[i].price) == 'number')
				price = datas[i].price;
		list = list +
			'<li>'+
			'<a href="'+getContextPath()+'/operator/travel/cruise-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruise_id+'&productType=21" target="right" class="detail-title'+i+'">'+datas[i].title+'</a>'+
			'<div class="shop-list-info"><img src="'+getContextPath()+UPLOAD_RESOURCE_IMG+datas[i].pic_path+'">'+
			'<div class="hot-list-info-p">'+
			'<p><b>登船城市：</b> '+datas[i].start_city+'</p>'+
			'<p><b>目的地：</b> '+datas[i].end_city+'</p>'+
	/!*		'<p><b>出发日期：</b>'+datas[i].travel_date+'</p>'+*!/
			'<p><b>行程天数：</b>'+datas[i].days+'</p>'+
			'<p><b>邮轮公司：</b>'+datas[i].cruise_company+'</p>'+
			'<p><b>'+/!*班期：<input style="width: 100px;" value="">' *!/
			' 班期：</b><span id="hq" class="hq'+i+'"><select class="hangqi'+i+'"></select> </span>本产品共<span class="hqgs'+i+'"></span>个班期'+
			'</p>'+
			'<div class="shop-list-price">'+
			/!*'<span><small>￥</small>'+price+'<small>起</small></span>'+*!/
			'<span><small>￥</small><small style="color: #ff7f05" id="minHousePrice'+i+'"></small><small>起/人</small></span>'+
			'<button id="hqyd'+i+'" class="btn btn-success" type="button">预订</button>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</li>';
		voyageList(datas[i].code,1,i,datas[i]);
	}
	$('#list').html(list);
}*/
function closeModel(modelid) {
	if(!confirm('确认放弃入库？')) return;
	
	$('#'+modelid).modal('hide');
	var fatherBody = $(parent.document.body);
	fatherBody.find('#backdropId').remove();
}
function showDetail(code) {
	$.ajax({
		url:getContextPath()+"/resource/searchWordContentByResourceInfo.do",
		type:'post',
		data:{'resource.code':code},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				$("#detail_id").html(data.datas);
				$("#modal_detail").modal("show");
			}else{
				Jalert(data.msg);
			}
		}
	});
}
//显示详情 --已不用 
/*
function showDetail_bak(code) {
	loadWait();
	$.ajax({
		url: getContextPath() + '/resource/searchDetail.do',
		type: 'post',
		data: {
			'resource.code': code
		},
		dataType: 'json',
		success: function(data) {
			if(data.success == 1) {
				var datas = data.datas;
				$("#m_code").html(datas.code);
				$("#m_resource").html(datas.title);
				$("#m_cruise_company").html(datas.cruise_company);
				$("#m_trader_price").html(datas.trader_price);
				$("#m_provider").html(datas.provider_name);
				$("#m_board_city").html(datas.board_city);
				$("#m_phone").html(datas.phone);
				if(datas.um_price && datas.um_price!=undefined)
					$("#m_um_price").html(datas.um_price);
				else
					$("#m_um_price").html('暂无');
				if(datas.word_content != undefined)
					$('#m_content').html(datas.word_content);
				
				commitRemove();
				
				$('#modal_detail').modal('show');
			} else {
				Jalert('入库失败, code:' + data.msg);
			}
		}
	});
}
*/
/////// ===================   预定    ==========================

function quickToBuy(code,cruiseId,productType){
	var url='/operator/travel/cruise-detail.jsp?code='+code+'&cruiseId='+cruiseId+'&productType='+productType+'&reservationMain=1';
	window.open(getContextPath()+url,"_self");
}
//点击预定
function toBuy(data) {
	loadWait();
	$("#baoming").html("");
	$('#price').empty();
	$('#contact').val("");
	$('#contactPhone').val("");
	$('#email').val("");
	$("#order").hide();
	$('#customerType').find("option[value='2']").prop("selected","selected");
	$('#bookType').find("option[value='1']").prop("selected","selected");
	totalPrice = 0;
	totalNum = 0;
	xuhao = 0 ;
	buyArray = [];
	var dt = JSON.parse(unescape(data));
	currendData = dt;
	var code = dt.code; 
	resourceCode = dt.code;
	resourceName = dt.title;
	providerCode = dt.providerCode;
	providerName = dt.providerName;
	vid = dt.id;
	//查询邮轮房型
	$.ajax({
		url: getContextPath() + '/resource/searchCruiseHouseList.do',
		type: 'post',
		data: {
			'resource.code': vid
		},
		dataType: 'json',
		success: function(data) {
			if(data==null || data.datas==null) return;
			if(data.success == 1) {
				var datas = data.datas;				
				var list = '';
				var price = '';
				var traderPrice = '';
				for(var i=0; i<datas.length; i++) {
					datas[i].price==undefined?'暂无':datas[i].price;
					datas[i].traderPrice==undefined?'暂无':datas[i].traderPrice;
					price = datas[i].price;
					traderPrice = datas[i].traderPrice;
					list =list+
					'<tr>'+
					  '<td class="yuding-name">'+datas[i].house_type+'</td>';
					  if($('#customerType').val() == 1) list =list+'<td id="yuding-price'+i+'">'+price+'</td>';
					  if($('#customerType').val() == 2) list =list+'<td id="yuding-price'+i+'">'+traderPrice+'</td>';
					list =list+
					  '<td>'+datas[i].house_num+'</td>'+
					  '<td style="color:#ff7f05;font-weight: 800;">0</td>'+
                      '<td><div class="addreduce">'+
					  	'<span class="reduce"></span>'+
                    	'<input class="addnumber" type="text" value="0"/>'+
                		'<span class="add"></span>'+
                      '</div></td>'+
                      '<input id="_'+datas[i].id+'" type="hidden" value="'+datas[i].id+'"/>'+
                      '<input type="hidden" value="'+datas[i].resource_code+'"/>'+
                      '<input type="hidden" value="'+resourceCode+'"/>'+
                      '<input type="hidden" value="'+providerName+'"/>'+
                      '<input type="hidden" value="'+datas[i].versionFlag+'"/>'+
                      '<input type="hidden" value="'+datas[i].house_person_num+'"/>'+
	                '</tr>';
				}
				$('#houseList').html(list);
				$('#myModal_xq').removeData("bs.modal");
				$('#myModal_xq').modal('show');
				var personNum = 1;
				$(".addnumber").blur(
					function(){
						var allNum = $(this).val();
	                    var houseType = $(this).parents("tr").find("td:eq(0)").html();//舱型
	                    personNum = $(this).parents("tr").children().eq(10).val();
	                    var hourseId = $(this).parents("tr").find("input:eq(1)").val();//房型id
	              	    var price = $(this).parents("tr").children().eq(1).html();//房型价格
	              	    var num = $(this).parents("tr").find("td:eq(4)").find("input").val();//预定人数
					    var house_num = $(this).parents("tr").find("td:eq(2)").html();//剩余间量
					    $("table."+hourseId).remove();
					    if(num <= house_num) {
					    	for(i=0;i<allNum;i++){
					    		showCustomer(houseType,personNum,hourseId,price);//增加相应的客户信息表
					    		countPrice();
					    	}
					    }else{
					    	$(this).val(house_num);
					    	for(i=0;i<house_num;i++){
					    		showCustomer(houseType,personNum,hourseId,price);//增加相应的客户信息表
					    		countPrice();
					    	}
					    }
				});
				//加减人数
				$(".add").click(
				  function(){
					  var addVal=$(this).parent().find(".addnumber").val();
					  addVal++;
					  $(this).parent().find(".addnumber").val(addVal);
					//舱型
	                  var houseType = $(this).parents("tr").find("td:eq(0)").html();
	                  personNum = $(this).parents("tr").children().eq(10).val();
	                //房型id
	                  var hourseId = $(this).parents("tr").find("input:eq(1)").val();
	              	 //房型价格
	              	  var price = $(this).parents("tr").children().eq(1).html();
					  var num = $(this).parents("tr").find("td:eq(4)").find("input").val();//预定人数
					  var house_num = $(this).parents("tr").find("td:eq(2)").html();//剩余间量
					  if(num <= house_num) {
						  showCustomer(houseType,personNum,hourseId,price);//增加相应的客户信息表
						}
					  countPrice();
				});
				$(".reduce").click(
				  function(){
					  var addVal=$(this).parent().find(".addnumber").val();
					  if(addVal > 0) addVal--;
					  $(this).parent().find(".addnumber").val(addVal);
                    //房型id
                      var hourseId = $(this).parents("tr").find("input:eq(1)").val();
					  countPrice();
					  var lTable = $("table."+hourseId).last();
                      lTable.remove();//减少相应的客户信息表
				  });
				$("#customerType").change(
					function(){
						for(var i=0; i<datas.length; i++) {
							datas[i].price==undefined?'暂无':datas[i].price;
							datas[i].traderPrice==undefined?'暂无':datas[i].traderPrice;
							price = datas[i].price;
							traderPrice = datas[i].traderPrice;
							if($("#customerType").val() == "1"){
								$("#yuding-price"+i).text(price);
								countPrice();
							}else if($("#customerType").val() == "2"){
								$("#yuding-price"+i).text(traderPrice);
								countPrice();
							}
						}
				});
				commitRemove();
			} else {
				Jalert('获取失败, code:' + data.msg);
			}
		}
	});
	getUserInfo();
}
//根据用户输入的数量，计算价格
function countPrice() {
	var price = 0;	//单价
	var tPrice = 0;	//单个销售总价
	var tNum = 0;	//每次的总人数
	var reg = /^[0-9]*[1-9][0-9]*$/;
	buyArray = [];
	$('#houseList').find('tr').each(function() {
		var tdArr = $(this).children();	
		price = tdArr.eq(1).html();//单价
		var txtPrice = tdArr.eq(3);
		var txtNum = tdArr.eq(4).find("input");
		var num = txtNum.val();//预定间数
		var personNum = tdArr.eq(10).val();//每间人数
		if($.trim(num) == '') {
			Jalert('请选择预定间数');
			return;
		}

		//剩余间量
		var house_num = parseInt(tdArr.eq(2).html());
		//房型id
		var house_id = tdArr.eq(5).val();
		//资源编号
		var resource_code = tdArr.eq(6).val();
		if(num != '0' && !reg.test(num)) {
			Jalert('预定间数必须是整数');
			return;
		}
		if(num > house_num) {
			$(".add").attr("onclick", "null");
			Jalert('余量不足');
			txtNum.val(house_num);
			num = house_num;
			//txtPrice.val(price * num * personNum);
			var bb = Decimal.mul(price,num*personNum);
			txtPrice.text(number_format(bb,2,"."));
		}
		//每种房间类型的总价
		//txtPrice.text(price * num * personNum);
		var aa = Decimal.mul(price,num*personNum);
		txtPrice.text(number_format(aa,2,"."));
		//整个订单的总价
		//tPrice = tPrice + (price * num * personNum);
		tPrice = Decimal.add(tPrice,aa);
		totalPrice = tPrice;
		//订单所有人数
		tNum = tNum + (num * personNum);
		totalNum = tNum;
		if(num == 0){
			return;
		}
		if(num > 0) {	//已选预定数量的房型
			//组织数据，添加到后台库存表
			var obj = {};
			obj.resourceCode = resource_code;
			obj.providerCode = providerCode;
			obj.providerName = providerName;
			obj.versionFlag = tdArr.eq(9).val();	//当前资源tb_resource的版本号
			obj.houseId = house_id;
			obj.housePersonNum = personNum;//单间人数
			obj.type = productType;
			obj.opNum = num;
			obj.operation = 3;	//预定-占舱
			obj.stockPrice = price;		//实际销售单价
			obj.opMoney = (price * num * personNum);	//当前舱型的总价
			buyArray.push(obj);
		}

	});
	$('#price').html('￥'+number_format(totalPrice,2,"."));
}
//报名用户信息展示
function showCustomer(houseType,personNum,hourseId,price){
	var count=1;//客户信息序号
	var list='<table class="table table-bordered table-header yuding-baoming '+hourseId+'">'+
		'<thead>'+
			'<tr>'+
				'<td class="w8">舱型</td>'+
				'<td class="w5">序号</td>'+
				'<td class="w8">姓名</td>'+
				'<td class="w5">类型</td>'+
				'<td class="w8">手机</td>'+
				'<td colspan="2" class="w15">证件</td>'+
				'<td class="w5">性别</td>'+
				'<td class="w5">大巴</td>'+
                '<td class="w5">保险</td>'+
				'<td class="w12">备注（非必填项）</td>'+
				'<td class="w5">操作</td>'+
			'</tr>'+
		'</thead>'+
		'<tbody>';
		for(var i=0;i<personNum;i++){
			list=list+'<tr id="customer'+count+'">';
			if(personNum >= 1 && count == 1){
				list=list+'<td class="houseType trs" rowspan="'+personNum+'">'+houseType+'</td>';
			}
			list=list+
				'<td class="count">'+count+'</td>'+
				'<td><input class="form-control userName" id="userName'+xuhao+'" type="text"></td>'+
				'<td>'+
					'<select id="" name="" type="text" class="form-control userType">'+
						'<option value="0">成人</option>'+
						'<option value="1">儿童</option>'+
					'</select>'+
				'</td>'+
				'<td><input class="form-control phone" type="text"></td>'+
				'<td colspan="2">'+
					'<select id="card'+xuhao+'" name="card" type="text" class="form-control w30 fleft idcard">'+
						'<option value="0">护照</option>'+
						'<option value="1">身份证</option>'+
					'</select><input class="form-control w68 fleft margin-left-w2 passport" type="text"></td>'+
				'<td>'+
					'<select id="sex" name="" type="text" class="form-control gender">'+
						'<option value="1" selected="selected">男</option>'+
						'<option value="0">女</option>'+
					'</select>'+
				'</td>'+
				'<td><label><input class="margin-small-right bus" type="checkbox" value="'+currendData.bus_price+'">'+currendData.bus_price+'元</label></td>'+
                '<td><label><input class="margin-small-right insurance" type="checkbox" value="'+currendData.insurance_price+'">'+currendData.insurance_price+'元</label></td>'+
				'<td><input class="form-control memo" type="text"></td>'+
				'<td>'+
					'<input class="form-control " type="hidden" value="'+(count++)+'">'+
					'<a class="dele">删除</a><br>'+
					'<input class="form-control " type="hidden" value="'+hourseId+'">'+
				'</td>'+
			'</tr>';

		xuhao++;
  }
	list = list+"</tbody></table>";
	$("#baoming").append(list);
//身份证和护照
	$(".idcard").change(function(){
		for (var i = 0; i < totalNum; i++) {
			if($("#card"+i).val()==1) {
				$('#huzhao-info-head'+i).hide();
				$('#huzhao-info-body'+i).hide();
			}else{
				$('#huzhao-info-head'+i).show(); 
				$('#huzhao-info-body'+i).show();
			}	
		}   
	});
//删除报名用户行
	$('.dele').unbind();
	$('.dele').click(function(){
		var tbody = $(this).closest('tbody');
		var table = $(this).closest('table');
		//房型id
	    var houseId = $(this).parent().find('input:eq(1)').val();
		//房型数量
		var num =$('#_'+houseId).prev('td').children('div').children('input').val();
		var x = $(this).parent().parent().index();//删除行的索引
		if(x==0){//删除的是第一行
		    personNum = tbody.find('tr:eq(0)').find('td:eq(0)').attr("rowspan");
		    var houseType = tbody.find('tr:eq(0)').find('td:eq(0)').text();
		    $(this).parent().parent().remove();
		    tbody.find('tr:eq(0)').find('td:eq(0)').before('<td class="houseType trs" rowspan="'+personNum+'">'+houseType+'</td>');
		    personNum--;
		    tbody.find('tr:eq(0)').find('td:eq(0)').attr("rowspan",personNum);
		}else{//删除非第一行
			personNum = tbody.find('tr:eq(0)').find('td:eq(0)').attr("rowspan");
			$(this).parent().parent().remove();
			personNum--;
			tbody.find('tr:eq(0)').find('td:eq(0)').attr("rowspan",personNum);
		}
		 	var flag = $(this).closest('tr').find('.bus').is(':checked');
			var busPrice = $(this).closest('tr').find('.bus').val();//获取大巴价
			if(flag){//选中
				totalPrice -= parseInt(busPrice);
				$(".price-color").html('￥'+totalPrice);
			}
			var flag = $(this).closest('tr').find('.insurance').is(':checked');
			var insurancePrice = $(this).closest('tr').find('.insurance').val();//获取保险价
			if(flag){//选中
				totalPrice -= parseInt(insurancePrice);
				$(".price-color").html('￥'+totalPrice);
			}
		 if(tbody.text() == ""){
			 table.remove();
			 num--;
			 $('#_'+houseId).prev('td').children('div').children('input').val(num);
			 countPrice();
		 }
	});
}
	//更改预定类型
	$('div').on('change',"#bookType",function(){
		if($("#bookType").val() == "1"){
			$("#order").hide();
		}else if($("#bookType").val() == "2"){
			$("#order").show();
		}
	});

//提交预定信息
function submitBuy() {
	if(totalPrice == null || totalPrice == 0) {
		Jalert('请选择预定间数');
		return;
	}
	var reg = /^[0-9]*[1-9][0-9]*$/;
	var regFloat = /^[0-9]+(.[0-9]{2})?$/;//只能输入有两位小数的正实数

	payment = $('#pay_price').val();	//实际支付价格待审核

	if(payment != '0' && !reg.test(payment) && !regFloat.test(payment)) {
		Jalert('请输入正确的支付金额');
		return;
	} 
	var reg1=/^[\u4e00-\u9fa5]{2,}$/;
	contact=$('#contact').val();
	if(reg1.test(contact.trim())){
		contact=$('#contact').val();
	}else{
		Jalert("请输入正确的联系人姓名");
		return false;
	}
	var reg2=/^1[0-9]{10}$/;
	contactPhone=$('#contactPhone').val();
	if(reg2.test(contactPhone.trim())){
		contactPhone=$('#contactPhone').val();
	}else{
		Jalert("请输入正确的联系人手机号");
		return false;
	}
	var emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
	email = $("#email").val();
	if(!emailReg.test(email)){
		Jalert("请输入正确的邮箱");
		return false;
	}
	$('#btn_buy').attr('onclick', '');
	var userType=[];
	var userName=[];
	var houseType=[];//房型数组
	var phone=[];
	var passport=[];
	var identityCard=[];
	var gender=[];
	var memo=[];
    var busPrice =[];
    var insurancePrice =[];
    i=0;// 舱型
    var istrue=true;
    $(".dele").each(function(){
    	var tbody = $(this).closest('tbody');
    	var house = tbody.find('tr:eq(0)').find('td:eq(0)').text();
        if($("#bookType").val() == "2"){
			houseType[i++]=house;
		}else{
			i++;
		}
    });
    if(!istrue){
		$("#btn_buy").attr("onclick","submitBuy()");
		return false;
	}
	var i=0;//类型
	$(".userType").each(function(){
		userType[i++]=$(this).val();
		});
	i=0;//用户姓名
	$(".userName").each(function(){
		if($("#bookType").val() == "2"){//报名
			var reg=/^[\u4e00-\u9fa5]{2,}$/;
			var param=$(this).val();
			if(reg.test(param.trim())){
				userName[i++]=$(this).val();
			}else{
				Jalert("请输入正确的报名姓名");
				istrue=false;
				return false;
			}
		}
	});
	if(!istrue){
		$("#btn_buy").attr("onclick","submitBuy()");
		return false;
	}
	i=0;//用户手机号
	$(".phone").each(function(){
		if($("#bookType").val() == "2"){
			var reg=/^1[0-9]{10}$/;
			var param=$(this).val();
			if(reg.test(param.trim())){
				phone[i++]=$(this).val();
			}else{
				Jalert("请输入用户"+userName[i++]+"正确的报名手机号");
				istrue=false;
				return false;
			}
		}else{
			i++;
		}
	});
	if(!istrue){
		$("#btn_buy").attr("onclick","submitBuy()");
		return false;
	}
	i=0;//用户护照号或身份证号
	$(".passport").each(function(){
		if($("#bookType").val() == "2"){
			var param=$(this).val();
			var idcard = $(this).prev(".idcard").val();
			if(idcard == "0"){//护照
//				var reg=/^1[45][0-9]{7}|([P|p|S|s]\{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8,10})$/;
//				if(reg.test(param.trim())){
					passport[i++]=$(this).val();
//				}else{
//					Jalert("请输入用户"+userName[i++]+"正确的护照号");
//					istrue=false;
//					return false;
//				}	
			}else if(idcard == "1"){//身份证
				if(IdentityCodeValid(param.trim()) ){
					identityCard[i++]=$(this).val();
				}else{
					Jalert("请输入用户"+userName[i++]+"正确的身份证号");
					istrue=false;
					return false;
				}	
		   }else{
			   i++;
		   }
		}	
	});
	if(!istrue){
		$("#btn_buy").attr("onclick","submitBuy()");
		return false;
	}
	i=0;//用户性别
	$(".gender").each(function(){
		gender[i++]=$(this).val();
	});
	i=0;//备注
	$(".memo").each(function(){	
		if($(this).val() !=''){
			memo[i++]=$(this).val();
		}	
	});
	if(!istrue){
		$("#btn_buy").attr("onclick","submitBuy()");
		return false;
	}
	i=0;//大巴
	$(".bus").each(function(){	
		if($("#bookType").val() == "2" && $(this).is(':checked') == true){
			//busPrice[i++]=$(this).val();
			busPrice[i++]=currendData.bus_price;
		}else{
			i++;
		}
	});
	if(!istrue){
		$("#btn_buy").attr("onclick","submitBuy()");
		return false;
	}
	i=0;//保险
	$(".insurance").each(function(){
		if($("#bookType").val() == "2" && $(this).is(':checked') == true){
			//insurancePrice[i++]=$(this).val();
			insurancePrice[i++]=currendData.insurance_price;
		}else{
			i++;
		}
	});
	if(!istrue){
		$("#btn_buy").attr("onclick","submitBuy()");
		return false;
	}

	//将页面信息组装到对象数组中
	array=[];
	for(var j=0;j<userName.length;j++){
		if(userName[j]!=null && userName.length>0){
			var orderUser={};
			orderUser.resCode=resourceCode;
			orderUser.userType=userType[j];
			orderUser.username=userName[j];
			orderUser.houseType=houseType[j];
			orderUser.phone=phone[j];
			orderUser.passport=passport[j];
			orderUser.identityCard=identityCard[j];
			orderUser.gender=gender[j];
			orderUser.memo=memo[j];
			orderUser.busPrice=busPrice[j];
			orderUser.insurancePrice=insurancePrice[j];
			array.push(orderUser);
		}
	}
	//订单状态默认为“待支付”
	status = 1;
	//支付价等于订单总价
	if(totalPrice == payment) status = 7;
	console.log(payment);
	//支付价不为0，并且支付价不等于订单总价
	if(payment != 0 && totalPrice != payment) status = 2;
	if(payment == 0){
		$.ajax({
			url: getContextPath() + '/order/buyCruiseResource.do',
			type: 'post',
			data: {
				'buyArray': JSON.stringify(buyArray),
				'dataJSON': JSON.stringify(array),
				'order.resCode': resourceCode,
				'order.resName': resourceName,
				'order.vid': vid,
				'order.category': 2,
				'order.categorySub': 21,
				'order.providerName': providerName,
				'order.contact': contact,
				'order.contactPhone': contactPhone,
				'order.email':email,
				'order.customerType': $('#customerType').val(),
				'order.bookType': $('#bookType').val(),
				'order.price': totalPrice+'',	//订单总价格
//				'order.payPrice': payment+'',	//实际（价格）定金
				'order.opMoney':payment+'',
				'order.status': status,
				'resource.code':currendData.code

			},
			dataType: 'json',
			success: function(data) {
				if(data.success == 1) {
					alert('预定成功，请等待财务审核！');
					buyArray = [];
				} else {
					alert('预定失败，请稍后重试');
				}
				//从新加载
				load();
				//关闭弹出框
				$('#myModal_xq').modal('hide');
				var fatherBody = $(parent.document.body);
				fatherBody.find('#backdropId').remove();
				$('#btn_buy').attr('onclick', 'submitBuy();');
				commitRemove();
			}
		});
	}else{
		toPay(payment);
	}

}


//定金不为零时进入支付界面进行支付
function toPay(dep){
	if(dep != 0){
		$('#opMoney_1').val(dep);
		$('#opMoney_2').val(dep);
		$('#opMoney_3').val(dep);
		$('#sub_money').html('￥'+dep);
		$.ajax({
			url:getContextPath()+"/finance/loadFinaceSummary.do",
			type:'post',
			dataType:'json',
			success:function(data) {
				if(data.success==1) {
					if(data.datas == null) {
						commitRemove();
						return;
					}
					var datas = data.datas;

					if(datas.total_money != undefined)
						$('#total_money').html('￥'+datas.total_money);
					if(datas.cash != undefined)
						$('#cash').html('￥'+datas.cash);
					if(datas.credit_money != undefined)
						$('#credit_money').html('￥'+datas.credit_money);
				}else{
					alert(data.msg);
				}
				commitRemove();
			}
		});
		$('#myModal_recharge').modal('show');
	}
}

//提交支付订单
function toSubmit() {
	if(!check()) return;
	$('#sbmit').attr('onclick', '');
	commitWait();
	var pic = $('#pic').val().trim();
	if(pic !=""){
		uploadImg();
	}else{

		deposit();
	}
}
/**
 * 资产处理（支付定金或支付全款）
 */
function deposit(){
	$.ajax({
		url: getContextPath() + '/order/buyCruiseResource.do',
		type: 'post',
		data: {
			'buyArray': JSON.stringify(buyArray),
			'dataJSON': JSON.stringify(array),
			'order.resCode': resourceCode,
			'order.resName': resourceName,
			'order.vid': vid,
			'order.category': 2,
			'order.categorySub': 21,
			'order.providerName': providerName,
			'order.contact': contact,
			'order.contactPhone': contactPhone,
			'order.customerType': $('#customerType').val(),
			'order.bookType': $('#bookType').val(),
			'order.price': totalPrice+'',	//订单总价格
//			'order.payPrice': payment+'',	//实际（价格）定金待审核
			'order.opMoney':payment+'',
			'order.status': status,
			'resource.code':currendData.code,
			'finance.operation': 3,	//产品支付
			'finance.accountType': accountType,
			'finance.account': finance.account,
			'finance.payType': payType,
			'finance.opMoney': finance.opMoney,
			'finance.opCompany': finance.opCompany,
			'finance.accountTime': finance.accountTime,
			'finance.pic': $("#financePicUrl").val()
		},
		dataType:'json',
		success:function(data) {
			if(data.success==1) {
				alert('提交成功，请等待财务审核');
				$('#myModal_recharge').modal('hide');
			}else{
				alert('支付失败，请联系管理员');
			}
			//从新加载
			load();
			//关闭弹出框
			$('#myModal_xq').modal('hide');
			var fatherBody = $(parent.document.body);
			fatherBody.find('#backdropId').remove();
			$('#btn_buy').attr('onclick', 'submitBuy();');
			$('#sbmit').attr('onclick', 'toSubmit();');
			commitRemove();
		}
	});
}

function check() {
	finance = {};

	var opMoney = $('#opMoney_'+accountType).val().trim();
	finance.opMoney = opMoney;//操作金额
	var accountTime = $('#accountTime_'+accountType).val().trim();
	finance.accountTime = accountTime;//汇款时间
	if(opMoney == '') {
		Jalert('请输入充值金额');
		$('#opMoney_'+accountType).focus();
		return false;
	}
	if(isNaN(opMoney)) {
		Jalert('充值金额必须为数字');
		$('#opMoney_'+accountType).focus();
		return false;
	}
	if(accountTime == '') {
		Jalert('请选择充值日期');
		return false;
	}
	//如果是银行转账
	if(accountType == 2) {
		var pic = $('#pic').val().trim();
		if(pic == '') {
			Jalert('请上传充值水单');
			return false;
		}
		finance.pic = pic;//银行水单
	}
	var totalMoney = parseFloat($('#total_money').text().substr(1));
	var cash = parseFloat($('#cash').text().substr(1));
	if(accountType == 3 ){
		if( totalMoney >= opMoney){//全部资产大于操作资金
			if(cash >= opMoney){//现金支付
				payType = 1 ;
			}else if(cash > 0 && cash < opMoney){//先支付现金，剩余信用
				payType = 3 ;
			}else{//信用支付
				payType = 2 ;
			}
		}else{
			Jalert('请充值账户或采用其他支付方式');
			return false;
		}
	}
	if(accountType == 1 ||accountType == 2){
		finance.opCompany = $('#opCompany_'+accountType).val().trim();//汇款单位
	}
	return true;
}


/////// ===================   申请    ==========================
//点击申请
function toApply(data) {
	loadWait();
	$('#applyPay_price').val(0);
	totalPrice = 0;
	buyArray = [];
	var dt = JSON.parse(unescape(data));
	var code = dt.code;
	resourceCode = dt.code;
	resourceName = dt.title;
	providerCode = dt.provider_code;
	providerName = dt.provider_name;
	//查询邮轮房型
	$.ajax({
		url: getContextPath() + '/resource/searchCruiseHouseList.do',
		type: 'post',
		data: {
			'resource.code': code
		},
		dataType: 'json',
		success: function(data) {
			if(data==null || data.datas==null) return;
			if(data.success == 1) {
				var datas = data.datas;				
				var list = '';
				for(var i=0; i<datas.length; i++) {
					list =list+
					  '<tr>'+
	                    '<td class="yuding-name">'+datas[i].house_type+'</td>'+
	                    '<td>'+datas[i].price+'</td>'+
	                    '<td>'+datas[i].house_num+'</td>'+
                        '<td><input class="price-input" onblur="countApply()" value="0"/></td>'+
	                    '<td><div class="addreduce"><span class="reduce"></span>'+
	                    	'<input class="addnumber" type="text" value="0"  oninput="countApply()"'+
                    		'onchange="countApply()" onblur="countApply()" onpropertychange="countApply()"/>'+
                    		'<span class="add"></span></div>'+
	                    '</td>'+
	                    '<input type="hidden" value="'+datas[i].id+'"/>'+
	                    '<input type="hidden" value="'+datas[i].resource_code+'"/>'+
	                    '<input type="hidden" value="'+resourceCode+'"/>'+
	                    '<input type="hidden" value="'+providerName+'"/>'+
	                    '<input type="hidden" value="'+datas[i].versionFlag+'"/>'+
	                    '<input type="hidden" value="'+datas[i].house_person_num+'"/>'+
	                  '</tr>';
				}
				$('#houseList1').html(list);
				$('#modal_apply').modal('show');
				
				//加减人数
				$(".add").click(
				  function(){
					  var addVal=$(this).parent().find(".addnumber").val();
					  addVal++;
					  $(this).parent().find(".addnumber").val(addVal);
					  countApply();
				});
				$(".reduce").click(
				  function(){
					  var addVal=$(this).parent().find(".addnumber").val();
					  if(addVal > 0) addVal--;
					  $(this).parent().find(".addnumber").val(addVal);
					  countApply();
				  });
				commitRemove();
			} else {
				Jalert('获取失败, code:' + data.msg);
			}
		}
	});
}
//根据用户输入的数量和申请价格，计算总价
function countApply() {
	var price = 0;	//原单价
	var tPrice = 0;	//单个舱型销售总价
	var oPrice = 0;	//单个舱型原价格总和
	buyArray = [];
	$('#houseList1').find('tr').each(function() {
		var tdArr = $(this).children();	
		price = parseInt(tdArr.eq(1).html());//原单价
		var txtApplyPrice = tdArr.eq(3).find("input");
		var applyPrice = txtApplyPrice.val();//申请价格
		var txtNum = tdArr.eq(4).find("input");
		var num = txtNum.val();//预定人数
		var personNum = tdArr.eq(10).val();//每间人数
		
		//正整数 
		var reg = /^[0-9]*[1-9][0-9]*$/;
		if(applyPrice != '0' && !reg.test(applyPrice)) {
			Jalert('申请价格必须是整数');

		} else {
			//剩余间量
			var house_num = parseInt(tdArr.eq(2).html());
			//房型id
			var house_id = tdArr.eq(5).val();
			//资源编号
			var resource_code = tdArr.eq(6).val();
			if($.trim(num) == '') {
				Jalert('请选择申请间数');
				return;
			}
			if(num != '0' && !reg.test(num)) {
				Jalert('申请间数必须是整数');
				return;
			}
			if(num > house_num) {
				$(".add").attr("onclick", "null"); 
				Jalert('余量不足');
				txtNum.val(house_num);
				num = house_num;
				txtPrice.val(applyPrice * num * personNum);
			}
			//整个订单的总价
			tPrice = tPrice + (applyPrice * num * personNum);//申请价
			totalPrice = tPrice;
			oPrice = oPrice + (price * num * personNum);//原价
			originaltotalPrice = oPrice;
			if(num > 0) {	//已选预定数量的房型
				if(applyPrice == 0 || applyPrice == '' || applyPrice == null){
					txtNum.val(0);
					Jalert('请输入申请价格');
					return;
				}
				//组织数据，添加到后台库存表
				var obj = {};
				obj.resourceCode = resource_code;
				obj.providerCode = providerCode;
				obj.providerName = providerName;
				obj.versionFlag = tdArr.eq(9).val();	//当前资源tb_resource的版本号
				obj.houseId = house_id;
				obj.type = productType;
				obj.opNum = num;
				obj.operation = 8;	//预定-占舱
				obj.stockPrice = applyPrice;		//实际销售单价
				obj.opMoney = (applyPrice * num * personNum);	//当前舱型的总价
				buyArray.push(obj);
			}
		}
	});
	$('#applyPrice').html('￥'+totalPrice);
	$('#applyPay_price').val(totalPrice);
}
//提交申请信息
function submitApply() {
	if(totalPrice == null || totalPrice == 0) {
		Jalert('请选择申请间数');
		return;
	}
	var reg = /^[0-9]*[1-9][0-9]*$/;
	var deposit = $('#applyPay_price').val();//实际申请总价
	if(deposit == 0 || deposit == '') {
		Jalert('请输入申请总价');
		return;
	}
	if(deposit != '0' && !reg.test(deposit)) {
		Jalert('申请总价必须是整数');
		return;
	} 
	$('#btn_apply').attr('onclick', '');
	var status = 11;	//订单状态默认为“申请降价”
	$.ajax({
		url: getContextPath() + '/order/buyCruiseResource.do',
		type: 'post',
		data: {
			'buyArray': JSON.stringify(buyArray),
			'order.resCode': resourceCode,
			'order.resName': resourceName,
			'order.category': 2,
			'order.categorySub': 21,
			'order.providerName': providerName,
			//'order.perPrice': price,	//邮轮按舱型取单价
			'order.price': originaltotalPrice,	//订单原价总和
//			'order.payPrice': deposit,	//实际（价格）定金
			'order.opMoney':deposit,
			'order.status': status,
			'finance.operation': 8,		//3：预定产品支付  8：占舱
			'finance.deposit': deposit,			//实际支付定金
			'finance.payType': 2	//2：银行转账
		},
		dataType: 'json',
		success: function(data) {
			if(data.success == 1) {
				alert('申请成功');
				buyArray = [];
			} else {
				alert('申请失败，请稍后重试');
			}
			//从新加载
			searchResource(1);
			//关闭弹出框
    		$('#modal_apply').modal('hide');
    		var fatherBody = $(parent.document.body);
    		fatherBody.find('#backdropId').remove();
    		$('#btn_apply').attr('onclick', 'submitApply();');
			commitRemove();
		}
	});
}
/////// ===================   申请    ==========================
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
				var list ='<a class="addbg-1 addbg" href="javascript:toFilter(\'startCity\', \'0\');" >全部</a>';
				var name = '';
				for(var i=0; i<datas.length; i++) {
					if(datas[i].id.length == 3)	{	//一级城市
						name = '<font style="font-weight:bold">'+datas[i].name+'</font>';
					} else {
						name = datas[i].name;
					}
					list =list+
					'<a href="javascript:toFilter(\'startCity\',\''+datas[i].id+'\')" >'+name+'</a>';
				}
				$('#boardCity').html(list);
				
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
				var list ='<a class="addbg-1 addbg" href="javascript:toFilter(\'cruiseComp\', \'0\');" >全部</a>';
				for(var i=0; i<datas.length; i++) {
					list =list+
					'<a href="javascript:toFilter(\'cruiseComp\',\''+datas[i].id+'\');" >'+datas[i].name+'</a>';
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
	var time ='<a class="addbg-1 addbg" href="javascript:toFilter(\'startDate\', \'0\');" >全部</a>';
	var str = '', year = [];
	for(var i=1; i<11; i++) {
		var d = new Date();
		var m = d.getMonth()+i;
		d.setMonth(m);
		var y = d.getFullYear();
		
		if(parseInt(m) < 10) m = '0'+m;
		if (m == 12) {m = 12; y = y-1;}
		if (m >= 13) {m = m - 12;m = '0'+m}
		var s = y + '-' + m;
		time = time + 
		'<a href="javascript:toFilter(\'startDate\',\''+s+'\');" >'+s+'</a>';
	}
	$('#travelDate').html(time);
}
//选中保险或车票，总价变化（增加）
function chooseBus(node){
    var flag = node.checked;
    //获取大巴价
    //var busPrice = node.value;
    //var busPrice = Decimal(node.value);
    var busPrice = Decimal(currendData.bus_price);
    if(flag){
     //选中
		totalPrice = Decimal.add(totalPrice,busPrice);
        $(".price-color").html('￥'+number_format(totalPrice,2,'.'));
    }else{
    //未选中
		totalPrice = Decimal.sub(totalPrice,busPrice);
        $(".price-color").html('￥'+number_format(totalPrice,2,'.'));
    }
}
function chooseInsurance(node){
    var flag = node.checked;
    //获取保险价
    //var insurancePrice = node.value;
    //var insurancePrice = Decimal(node.value);
    var insurancePrice = Decimal(currendData.insurance_price);
    if(flag){
        //选中
		totalPrice = Decimal.add(totalPrice,insurancePrice);
        $(".price-color").html('￥'+number_format(totalPrice,2,'.'));
    }else{
        //未选中
        totalPrice = Decimal.sub(totalPrice,insurancePrice);
        $(".price-color").html('￥'+number_format(totalPrice,2,'.'));
    }
}


/**
 * 班期列表
 */
/*function voyageList(rescode,pageNum,n,resData){
	$.ajax({
		url:getContextPath()+"/resource/searchVoyageList.do",
		type:'post',
		data: {'resource.code':rescode,
			'resource.status':1,
			'pager.pageNum': pageNum,
			'pager.pageSize': 10
		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				if(data.datas == null || data.datas.length == 0) {
					$('.hq'+n).html("暂无班期");
					$('#minHousePrice'+n).html("--");

				} else {
					voyageData =data.datas;
					rendVoyageList(data.datas,n,resData);
				}
			}else{
				Jalert(data.msg);
			}
		}
	})
}*/

/*
function rendVoyageList(data,n,resData){
	title = $(".detail-title"+n).text();
	var startDate;
	var list = '';
	for(var i = 0; i < data.length; i++){
		startDate = data[0].startDate;
		vid = data[0].id;
		list = list+"<option id='"+data[i].id+"' value='"+data[i].id+"'>"+data[i].startDate+"</option>";
	}
	$(".hangqi"+n).html(list);
	$(".hqgs"+n).text(data.length);
	minHousePrice(vid,n);
	$(".detail-title"+n).text(startDate+" "+title);
	var hqTitle = $(".detail-title"+n).text();
	$("#hqyd"+n).attr('onclick','toBuy(\''+escape(JSON.stringify(resData))+'\',\''+vid+'\',\''+hqTitle+'\')');
	$(".hangqi"+n).change(function(){
		$(".detail-title"+n).text("");
		vid = this.value;
		var time = $("#"+vid).text();
		var hq_title =time+" "+title;
		$(".detail-title"+n).text(hq_title);
		minHousePrice(vid,n);
		hqTitle = $(".detail-title"+n).text();
		$("#hqyd"+n).attr('onclick','toBuy(\''+escape(JSON.stringify(resData))+'\',\''+vid+'\',\''+hqTitle+'\')');
	})
}
*/



//获取航期房型最低价
/*function minHousePrice(vid,n){
	$.ajax({
		url:getContextPath()+"/resource/getMinHousePriceByVid.do",
		type:'post',
		data: {"productVersion.id":vid,
		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				if(data.datas == null || data.datas.length == 0) {
					$('#minHousePrice'+n).html("---");

				} else {
					$('#minHousePrice'+n).html(data.datas);
				}
			}else{
				Jalert(data.msg);
			}
		}
	})
}*/
