var finance,busCode;
function load() {
	loadWait();
	
	pageNum=1;
	searchFinaceInfo(pageNum);
}

function searchFinaceInfo(pageNum) {
	$.ajax({
		url:getContextPath()+"/finance/searchFinaceInfo.do",
		type:'post',
		data: {
			'finance.operation': $('#operation').val(),
			'finance.auStatus': $('#auStatus').val(),
			'finance.traderName': $('#traderName').val(),
			'finance.busCode': $('#orderCode').val(),
			'finance.accoutType': $('#accoutType').val(),
			'finance.startTime': $('#startTime').val(),
			'finance.endTime': $('#endTime').val(),
			'pager.pageNum': pageNum,
			'pager.pageSize': 10
		},
		dataType:'json',
		success:function(data) {
			if(data.success==1) {
				if(data.datas == null || data.datas.length == 0) {
					$('#list').empty();
					$('#pager').empty();
					$('#noresult').show();
				} else {
					$('#list').empty();
					$('#noresult').hide();
					rendData(data);
					rendPage(data);
				}
			}else{
				alert(data.msg);
			}
			commitRemove();
		}
	});
}

function rendData(data) {
	var datas = data.datas;
	var list = '';
	var money = '';
	var arr = new Array();
	for(var i=0; i<datas.length; i++) {
		money =parseMoney(datas[i].operation, datas[i].op_money, datas[i].deposit);
		if(datas[i].bus_code !=null && datas[i].bus_code !=undefined && datas[i].bus_code !=""){
			var busCode = datas[i].bus_code;
		}else{
			var busCode = "--";
		}
		var pic_or=datas[i].pic;
		if(pic_or && pic_or.indexOf("http")>-1){
			var pic ='<img onclick="javascript:showPic(\''+datas[i].pic+'\');" src="'+datas[i].pic+'" />';
		}else{
			var pic = (datas[i].pic == "")?'--':'<img onclick="javascript:showPic(\''+getContextPath()+"/"+datas[i].pic+'\');" src="'+getContextPath()+"/"+datas[i].pic+'" />';
		}
		var comment = (datas[i].comment == "" || datas[i].comment == undefined)?'--':datas[i].comment;
		var operator = '';
		//如果处理中的业务，就增加审核按钮
		if(datas[i].au_status == 1) {
			operator = operator+
		     '<a href=\"javascript:approve(\''+escape(JSON.stringify(datas[i]))+'\')\">审核</a></br>';
		}
		//如果是支付业务，就是查询对应订单
		if(datas[i].operation == 3 || datas[i].operation == 4 || datas[i].operation == 9 || datas[i].operation == 10) {
			operator = operator+
		     '<a href=javascript:showOrder(\"'+datas[i].operation+'","'+datas[i].bus_code+'\")>对应订单</a>';
		}
		if(i>0 && busCode != "--" && datas[i].bus_code == datas[i-1].bus_code){
			arr.push(datas[i].bus_code);
			list = list+
				'<tr>'+
				//'<td class="'+datas[i].bus_code+'" rowspan="">'+datas[i].trader_name+'</td>'+
				'<td>'+parseOperation(datas[i].operation)+'</td>'+
				'<td>'+money+'</td>';
			if(datas[i].account_type !=null && datas[i].account_type !=""){
				list = list+
					'<td>'+parseAccountType(datas[i].account_type)+'</td>';
			}else{
				list = list + '<td>--</td>';
			}
			list = list+
				'<td>'+datas[i].op_time+'</td>';
			if(datas[i].operation == 9 || datas[i].operation == 10){
				list = list+'<td>'+comment+'</td>'
			}else{
				list = list+'<td>'+pic+'</td>';
			}
			list = list +
				'<td>'+parseAuStatus(datas[i].au_status)+'</td>';
			if(operator !=null && operator !=""){
				list = list +'<td>'+operator+'</td></tr>';
			}else{
				list = list +'<td>--</td></tr>';
			}
	   }else{
	   	
			list = list+
				'<tr>'+
				'<td id="'+datas[i].bus_code+'" class="J_busCode" rowspan=""><p class="'+datas[i].bus_code+'name"></p><p>'+busCode+'</p></td>'+
				'<td class="sale'+datas[i].bus_code+'" rowspan=""></td>'+
				'<td>'+parseOperation(datas[i].operation)+'</td>'+
				'<td>'+money+'</td>';
			if(datas[i].account_type !=null && datas[i].account_type !=""){
				list = list+
					'<td>'+parseAccountType(datas[i].account_type)+'</td>';
			}else{
				list = list + '<td>--</td>';
			}
			list = list+
			'<td>'+datas[i].op_time+'</td>';
			if(datas[i].operation == 9 || datas[i].operation == 10){
				list = list+'<td>'+comment+'</td>'
			}else{
				list = list+'<td>'+pic+'</td>';
			}
			list = list +
				'<td>'+parseAuStatus(datas[i].au_status)+'</td>';
			if(operator !=null && operator !=""){
				list = list +'<td>'+operator+'</td></tr>';
			}else{
				list = list +'<td>--</td></tr>';
			}
		}

	}
	$('#list').html(list);
	//遍历一个数组相同数的个数
	var numArr = new Array();
	for(var i=0; i< arr.length; i++){
		var num = 2;
		if(i > 0 && arr[i] != arr[i-1] || i==0){//与上一个是否相同或者第一个
			for(var j=i; j< arr.length; j++){//和下一个比较是否相等，相等就叠加
				if(arr[i]==arr[j+1]){
					num = num +1;
				}
			}
			$("#"+arr[i]).attr("rowspan",num);
			$(".sale"+arr[i]).attr("rowspan",num);
		}
	}
	
	$('#list').find(".J_busCode").each(function(){
		var orderCodeId=$(this).attr("id");
		if(orderCodeId)searchOrderDetail2(orderCodeId);
	});
}
//审核
function approve(data) {
	finance = JSON.parse(unescape(data));
	//操作类型，1：资金充值，2：申请信任付，3：产品支付，4：产品支付申请，5：入库支付，6：入库支付申请
	if(finance.operation == 2) {	//申请信用付
		$('#recharge').val(finance.op_money);
		$('#myModal_shtg').modal('show');
	} else if(finance.operation == 2) {	//资金充值
		$('#myModal_sh').modal('show');
	}else{//是支付类业务
		busCode = finance.bus_code;
		$('#myModal_sh').modal('show');
	}
}

//提交审核结果
function submitApprove(no) {
	loadWait();
	var chk = $('input:radio[name="pay_2"]:checked').val();
	var auDesc = $('#auDesc_2').val();
	var recharge = null;
	//审核信用付的弹出框
	if(no == 1) {
		auDesc = $('#auDesc_1').val();
		chk = $('input:radio[name="pay_1"]:checked').val();
		if(chk == 2) {	//如果选择通过
			//获取信用付金额
			recharge = $('#recharge').val().trim();
			if(recharge == '') {
				Jalert('请输入授信金额');
				return false;
			}
			if(isNaN(recharge)) {
				Jalert('授信金额只能是数字');
				return false;
			}
		}
	}
	if(!confirm('确认提交吗？')) return;
	$('#appBtn_'+no).attr('onclick', '');
	//提交审核结果
	$.ajax({
		url:getContextPath()+"/finance/financeApprove.do",
		type:'post',
		data: {
//			'order.code':busCode,
//			'order.status':14,
//			'order.refundPrice':finance.opMoney,
//			'finance.operation': 10,
			'finance.id': finance.id,
			'finance.auStatus': chk,
			'finance.auMoney': recharge,
			'finance.auDesc': auDesc,
			'finance.traderCode': finance.trader_code
		},
		dataType:'json',
		success:function(data) {
			if(data.success==1) {
				searchFinaceInfo(1);
				alert('审核完成');
				$('#myModal_shtg').modal('hide');
				$('#myModal_sh').modal('hide');
			}else{
				alert('审核失败，请联系管理员');
			}
			$('#appBtn_'+no).attr('onclick', 'submitApprove('+no+')');
			commitRemove();
		}
	});
}

function showPic(pic) {
	$('#modal_pic').attr('src', pic);
	$('#myModal_ls').modal('show');
}
//打开资金业务订单
function showOrder(operation, bus_code) {
	if(operation == 3 || operation == 4) {	//查询订单
		searchOrderDetail(bus_code);
	} else if(operation == 5) {	//查询库存
		
	}
}
//查询订单详情
function searchOrderDetail2(bus_code) {
	$.ajax({
		url:getContextPath()+"/order/searchOrderDetail.do",
		async:false,
		cache:false,
		type:'post',
		data: {
			'code': bus_code
		},
		dataType:'json',
		success:function(data) {
			if(data.success==1) {
				if(data.datas == null || data.datas.length == 0) {
					return "";
				}
				var datas = data.datas;
				var str='<p>'+(datas.resName||"")+'</p>';
				$("#"+datas.code).append(str);
				$(".sale"+datas.code).html(datas.opName);
				return (datas.resName || '');
			}else{
				//alert(data.msg);
			}
		}
	});
	return "";
}
//查询订单详情
function searchOrderDetail(bus_code) {
	$.ajax({
		url:getContextPath()+"/order/searchOrderDetail.do",
		type:'post',
		data: {
			'code': bus_code
		},
		dataType:'json',
		success:function(data) {
			if(data.success==1) {
				if(data.datas == null || data.datas.length == 0) {
					return;
				}
				var datas = data.datas;
				$("#m_code").html(datas.code);
				$("#m_contact").html(datas.contact);
				$("#m_provider").html(datas.providerName);
				$("#m_resource").html(datas.resName);
				$("#m_status").html(rendStatus(datas.status));
				$("#m_phone").html(datas.phone);
				$("#m_time").html(datas.createTime);
				
				$('#modalDetail').modal('show');
			}else{
				alert(data.msg);
			}
		}
	});
}
//生成页码序列
function rendPage(data) {
	renderPager(data.pager, "searchFinaceInfo");
}
//解析操作类型,操作类型，1：资金充值，2：申请信任付，3：产品支付，4：产品支付申请，5：入库支付，6：入库支付申请
function parseOperation(operation) {
	if(operation == 1) return '资金充值';
	if(operation == 2) return '申请信用付';
	if(operation == 3) return '产品支付';
	if(operation == 4) return '产品支付申请';
	if(operation == 5) return '入库支付';
	if(operation == 6) return '入库支付申请';
	if(operation == 7) return '入库定金支付';
	if(operation == 8) return '占舱';
	if(operation == 9) return '退款完成';
	if(operation == 10) return '产品退款';
}
//如果是资金增加，就用+，减少就用-
function parseMoney(operation, money, deposit) {
	if(operation == 1) 
		return '<font color="green"> + '+money+'</font>';
	if(operation == 2 || operation == 3 || operation == 4) 
		return '+ ' + money;
	if(operation == 3 || operation == 5) return '<font color="red"> - '+money+'</font>';
	if(operation == 7) return '<font color="red"> - 定金'+deposit+'</font>';
	if(operation == 8) return '<font color="red"> - '+money+'</font>';
	if(operation == 9 || operation == 10) return '<font color="red"> - '+money+'</font>';
	return money;
}
function parseAccountType(type) {
	if(type == undefined) return '';
	if(type == 1) return '扫码支付';
	if(type == 2) return '银行转账';
	if(type == 3) return '余额支付';
	if(type == 4) return '支付宝支付';
}
//审核状态，1：处理中，2：已完成，3：驳回复审，4：拒绝
function parseAuStatus(auStatus) {
	if(auStatus == 1) return '待审核';
	if(auStatus == 2) return '<font color="#00ce3f">已通过</font>';
	if(auStatus == 3) return '<font color="red">已拒绝</font>';
	return '';
}
