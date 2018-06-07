
//添加分销商:如果code为空则添加分销商，如果code不为空则是，修改分销商
function addTrader(){
	$("#addtrader").attr("onclick","#");
	//获取分销商名称、电话号码、类型、级别、到期时间、账户是否可用、执照的图片名字
	var code=$("#code").val();
	var name = $("#name").val();
	var phone = $("#phone").val();
	var type = $("#type").val();
	var level = $("#level").val();
	var expireDate = $("#dateinfo2").val();
	var status =$("#status").val();
	var picTrader = $("#picPath").val();
	var address=$("#address").val();
	var email=$("#email").val();
	var linkman=$("linkman").val();
    if(checkTraderInfo()){
	var data={"name":name,
			  "phone":phone,
			  "type":type,
			  "level":level,
			  "expireDate":expireDate,
			  "status":status,
			  "code":code,
			  "linkman":linkman,
			  "address":address,
			  "email":email
			  };
	//上传图片以及分销商其他信息
	if(picTrader!=""){
		 uploadImg(data);
	}
	if(picTrader=="" && code==""){
		uploadImg(data);
	}
	if(picTrader=="" && code!=""){
		upTraderInfo(data);
	}
    }else{
    	$("#addtrader").attr("onclick","addTrader()");
    }
}
//验证添加分销商
function checkTraderInfo(){
	var name = $("#name").val();
	var phone = $("#phone").val();
	var expireDate = $("#dateinfo2").val();
	var address=$("#address").val();
	var email=$("#email").val();
	var linkman=$("#linkman").val();
	if(name==""){
		Aalert("名称不能为空");
		   return false;
		}else{		
			if(name.length>100){
				Aalert("名称字段过长");
				return false;
			}
		}
	var reg=/^\d{3,20}$/;
	if(!reg.test(phone)){
		Aalert("请填写正确的电话号码");
		return false;
	}
	if(expireDate==""){
		Aalert("截止时间不能为空");
		   return false;
		}
	reg=/^\w+([-+.]\w+)*@\w+([-.]\\w+)*\.\w+([-.]\w+)*$/;
	if(!reg.test(email)){
		Aalert("邮箱格式错误");
		return false;
	}
	if(address==""){
		Aalert("公司地址不能为空");
		return false;
	}
	if(linkman==""){
		Aalert("联系人不能为空");
		return false;
	}
	return true;
}
//发出导出分销商信息Excel表的请求
function exportExcel(){
	$.ajax({
		url:getContextPath()+"/trader/checkExportTraderPermission.do",
	    data:{},
	    dataType:'json',
	    type:'post',
	    success:function(data){
	        if(data.success==1){
	        	Jalert("正在导出");
				$("#form_condition").attr("action",getContextPath()+"/trader/exportTraderInfo.do");
				$("#form_condition").submit();
	        	    }
	        	else{
	        		Jalert(data.msg);
	        	}	       
	    }
	});
}
//上传trader信息
function upTraderInfo(trader){
	commitWait();
	var url= getContextPath() + "/trader/addTrader.do";
	var data={"trader.code":trader.code,
			  "trader.name":trader.name,
			  "trader.phone":trader.phone,
			  "trader.type":trader.type,
			  "trader.level":trader.level,
			  "trader.expireDate":trader.expireDate,
			  "trader.status":trader.status,
			  "trader.linkman":trader.linkman,
			  "trader.email":trader.email,
			  "trader.address":trader.address,
			  "trader.picTrader":$("#traderPicUrl").val()};	
	var callback=function(data){
		if(data.success==0){
			commitRemove();
		    Aalert("操作失败");
		    $("#addtrader").attr("onclick","addTrader()");
		}else{
			commitRemove();
			$("#myModal_tjfxs").modal("hide");
		    Jalert("操作成功");
		    $("#addtrader").attr("onclick","addTrader()");
			loadList($("#currentPageNum").val());
		}		
	};
	var type="JSON";
	$.post(url,data,callback,type);
}

//加载分销商信息
function loadList(pagerNum) {
	loadWait();
	$.ajax({
		url: getContextPath() + '/trader/searchTraderList.do',
		type: 'post',
		data: {
			'trader.code':$("#queryCode").val(),
			'trader.name':$("#queryName").val(),
			'trader.type':$("#queryType").val(),
			'trader.createDate':$("#dateinfo").val(),
			'trader.expireDate':$("#dateinfo1").val(),
			'trader.status':$("#queryStatus option:selected").val(),
			'pager.pageNum': pagerNum,
			'pager.pageSize': 10
		},
		dataType: 'json',
		success: function(data) {
			if(data.success == 1) {
				$("#currentPageNum").val(pagerNum);
				rendTraderList(data.datas);
				renderPager(data.pager,"loadList");
				commitRemove();
			} else {
				Jalert(data.msg);
				commitRemove();
			}
		}
	});
}


//生成分销商列表函数
function rendTraderList(datas){
	var list="";
	$(".nodata").remove();
	for(var i=0;i<datas.length;i++){
		list=list+'<tr>'+
		'<td >'+datas[i].code+'</td>'+
		'<td style="text-align:center;vertical-align:middle;">'+datas[i].name+'</td>'+
		'<td >'+datas[i].phone+'</td>'+
		'<td >'+rendCategory(datas[i].type)+'</td>'+
		'<td >'+renderLevel(datas[i].level)+'</td>'+
		'<td >'+datas[i].createDate+'</td>'+
		'<td >'+datas[i].expireDate+'</td>';
		if(datas[i].status==0){
			list=list+'<td ><span style="color:red">待审核</span></td>';
		}
		if(datas[i].status==1){
			list=list+'<td ><span style="color:#00ce3f">正常</span></td>';
			}
		if(datas[i].status==2){
			list=list+'<td ><span style="color:#999">过期</span></td>';
			}
		if(datas[i].status==3){
			list=list+'<td ><span style="color:#ff9900">已注销</span></td>';
			}
		list=list+'<td ><a onclick=\"detailsTrader(\''+escape(JSON.stringify(datas[i]))+'\')\">详情</a><br/>'+
		'<a onclick=\"checkAddOrEditTraderPermission(\''+escape(JSON.stringify(datas[i]))+'\')\">编辑</a><br/>'                  	                             
		+'</td></tr>';
	}
	$('#list').html(list);	
	if(list.length==0)
		$(".table-margin").append('<div class="nodata">暂无相关结果！</div>');
}
//初始化分销商详情模态框
function detailsTrader(traderInfo){
	var data= JSON.parse(unescape(traderInfo));
				$("#codeDe").text(data.code);
				$("#nameDe").text(data.name);
				$("#phoneDe").text(data.phone);
				$("#typeDe").text(rendCategory(data.type));
				$("#levelDe").text(renderLevel(data.level));
				$("#expireDateDe").text(data.expireDate);
				$("#pCodeDe").text(data.pCode);
				$("#linkmanDe").text(data.linkman);
				$("#addressDe").text(data.address);
				$("#emailDe").text(data.email);
				$("#createDateDe").text(data.createDate);
				$("#statusDe").text(renderStatus(data.status));
				$("#businessImg").attr("src",getContextPath()+data.picTrader);
				$('#myModal_xq').modal('show');
}
//检查是否有编辑和添加分销商权限
function checkAddOrEditTraderPermission(traderInfo){
	var code=null;
	if(traderInfo!=null)
		code=1111;
	$.ajax({
		url:getContextPath()+"/trader/checkAddOrEditTraderPermission.do",
		type:'post',
		data:{'trader.code':code},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				if(code==''||code==null)
					initAddTrader();
				else
					initEditTrader(traderInfo);
			}else{
				Jalert(data.msg);
			}
		}
	});
}
//初始化添加分销商模态框
function initAddTrader(){
	$("#lblAddTitle").text("添加分销商");
	$("#addtrader").text("添加");
	$("#traderImg").show();
	$("#rightText").attr("class","form-control right-text tianjia-bg");		
	$("#code").val(null);
	$("#name").val(null);
	$("#phone").val(null);
	$("#type").find("option[value='"+2+"']").prop("selected","selected");
	$("#level").find("option[value='"+1+"']").prop("selected","selected");
	$("#dateinfo2").val(null);
	$("#status").find("option[value='"+1+"']").prop("selected","selected");
	$("#rightText").text("");
	$("#picPath").val(null);
	$("#linkman").val(null);
	$("#address").val(null);
	$("#email").val(null);
	$('#myModal_tjfxs').modal('show');
}
//初始化编辑分销商
function initEditTrader(data){
	var data= JSON.parse(unescape(data));
				$("#lblAddTitle").text("编辑分销商");
				$("#addtrader").text("编辑");
				$("#traderImg").hide();
				$("#rightText").attr("class","form-control right-text xiugai-bg");
				$("#code").val(data.code);
				$("#name").val(data.name);
				$("#phone").val(data.phone);
				$("#type").find("option").prop("selected",false);
				$("#type").find("option[value='"+data.type+"']").prop("selected","selected");
				$("#level").find("option").prop("selected",false);
				$("#level").find("option[value=''"+data.level+"']").prop("selected","selected");
				$("#dateinfo2").val(data.expireDate);
				$("#status").find("option").prop("selected",false);
				$("#status").find("option[value='"+data.status+"']").prop("selected","selected");
				$("#rightText").text("");
				$("#linkman").val(data.linkman);
				$("#address").val(data.address);
				$("#email").val(data.email);
				$("#picPath").val(data.picPath);
				$('#myModal_tjfxs').modal('show');
}
//上传图片以及上传分销商“trader”的信息
function uploadImg(traderInfo){		
		// 验证图片格式
		var ext = '.jpg.jpeg.gif.bmp.png.';
		var f0 = $("#picPath").val();
		var f = $("#picPath").val();
		if (f =="") {
			Aalert("请上传营业执照！");
			$("#addtrader").attr("onclick","addTrader()");
			return false;
		}
		f = f.substr(f.lastIndexOf('.') + 1).toLowerCase();
		if (ext.indexOf('.' + f + '.') == -1) {
			alert("图片格式不正确！");
			$("#addtrader").attr("onclick","addTrader()");
			return false;
		}
		commitWait();
		$.ajaxFileUpload({
			 url:getContextPath() + "/trader/uploadFile.do?pathDirect=traderImg&fileFileName="+f0,
		 	 dataType:"json",
		 	 fileElementId:"inputFile",		 	 
		 	 success:function(data){
		 		// 接收图片路径，给隐藏域赋值		 		
		 		 $("#traderPicUrl").val(data);
			 		upTraderInfo(traderInfo);
		 	 },
		 	 error:function(data){
		 		commitRemove();
		 		alert("图片上传失败");
		 		$("#addtrader").attr("onclick","addTrader()");
		 	 }
		 });
}

function renderStatus(data){
	if(data==0)return "待审核";
	if(data==1)return "正常";
	if(data==2)return "过期";
	if(data==3)return "已注销";
}
function renderLevel(data){
	if(data==0)return Constants.LEVEL0;
	if(data==1)return Constants.LEVEL1;
	if(data==2)return Constants.LEVEL2;
}

