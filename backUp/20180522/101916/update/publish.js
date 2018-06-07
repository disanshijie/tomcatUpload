
function initPage(){
	loadCruiseCompany();
	loadStartCity();
//	$("#div_price").hide();
//	$("#startDate").hide();
	//$("#remainNum").hide();
	if($("#resourceCode").val()!=null && $("#resourceCode").val()!=""){
		loadProductInfo($("#resourceCode").val());
	}
	//参数判断编辑还是发布产品
	var a = getUrlParam("a");
	if(a =="edit"){
		$("#publishProduce").text("保存");
	} 
}
//载入产品信息          
function loadProductInfo(code){
	loadWait();
	$.ajax({
		url:getContextPath()+"/resource/searchProductByResourceInfo.do",
		data:{'resource.code':code},
		type:"post",
		dataType:"json",
		success:function(data){
			if(data.success==1){
				$("#title").val(data.datas.title);
				//$("#travelDate").val(data.datas.travelDate);
				$("#days").val(data.datas.days);
				//$("#price").val(data.datas.price);
//				$("#busPrice").val(data.datas.busPrice);
//				$("#insurancePrice").val(data.datas.insurancePrice);
//				$("#addSpacePrice").val(data.datas.addSpacePrice);
				$("#boardCity").val(data.datas.boardCity);
				$("#boardCityId").val(data.datas.boardCityId);
				$("#endCity").val(data.datas.endCity);

				$("#wayCity").val(data.datas.wayCity);
				$("#showLevel").find("option[value='"+data.datas.showLevel+"']").prop("selected","selected");
				//$("#traderPrice").val(data.datas.traderPrice);
				$("#cruiseCompany option:selected").val(data.datas.cruiseCompany);
				$("#cruiseCompany").find("option[value='"+data.datas.cruiseCompanyId+"']").prop("selected","selected");
				$("#shippingLine option:selected").val(data.datas.shippingLine);
				$("#shippingLine").find("option[value='"+data.datas.shippingLineId+"']").prop("selected","selected");
				$("#cruise").append("<option value='"+data.datas.cruiseId+"'>"+data.datas.cruiseName+"</option>");
				//$("#cruise").find("option[value='"+data.datas.cruiseId+"']").prop("selected","selected");
				$("#txtDefaultHtmlArea").htmlarea("html",data.datas.wordContent);
				$("#productType").find("option[value='"+data.datas.productType+"']").prop("selected","selected");
				//$("#num").val(data.datas.num);
				//$("#umPrice").val(data.datas.umPrice);
				$("#versionFlag").val(data.datas.versionFlag);
				$("#picPath").val(data.datas.picPath);
				$("#rightTextPic").html(data.datas.picPath);
				$("#reservation").htmlarea("html",data.datas.reservation);
				$("#priceContain").htmlarea("html",data.datas.priceContain);
				showCruiseCompany();
//				showLevelClick();
				if($("#picPath").val() != '' || $("#picPath").val() != null){
					$("#rightTextPic").removeClass("tianjia-img-bg");
				}
				commitRemove();
			}else{
			   Jalert("出现错误，请联系管理员");
			   commitRemove();
			}
		}
	});
}


//加载邮轮公司下拉框
function loadCruiseCompany(){
	$.ajax({
		url:getContextPath()+"/resource/searchCruiseCompList.do",
		data:{},
		type:"post",
		dataType:"json",
		success:function(data){
			if(data.success==1){
				renderCruiseCompany(data.datas);
			}
		}
	});
	//根据邮轮公司获取游轮列表
	$("#cruiseCompany").change(function(){
		//移除之前加载的信息
		$("#cruise option:gt(0)").remove();
		//获取游轮公司id
		var cruiseCompId = this.value;
		$.ajax({
			url:getContextPath()+"/resource/searchCruiseList.do",
			data:{'cruiseCompId':cruiseCompId},
			type:"post",
			dataType:"json",
			success:function(data){
				if(data.success==1){
					var datas = data.datas;
					var list = "<option>请选择</option>"
					for(var i = 0; i < datas.length; i++){
						//获取邮轮id
						var id = datas[i].id;
						//获取邮轮名称
						var name = datas[i].name;
						//将邮轮信息加入到option
						list = list +"<option value="+id+">"+name+"</option>";
					}
					$("#cruise").html(list);
				}
			}
		});

	});
}
//生成邮轮公司下拉框
function renderCruiseCompany(companys){
	var dropDownBox="<option>请选择</option>";
	for(var i=0;i<companys.length;i++){		
		dropDownBox=dropDownBox+"<option value='"+companys[i].id+"'>"+companys[i].name+"</option>";	   
	}
	$("#cruiseCompany").html(dropDownBox);
}
//加载登录城市下拉框
function loadStartCity(){
	$.ajax({
		url:getContextPath()+"/resource/searchStartCity.do",
		data:{},
		type:"post",
		dataType:"json",
		success:function(data){
			if(data.success==1){
				renderBoardCity(data.datas);	
				renderBoardCity1(data.datas);
			}
		}
	});
}
//生成出发城市菜单下拉框
function renderBoardCity(area){
	var dropDownBox="";
	//地区Id
	var areaId = '';
	for(var i=0;i<area.length;i++){	
		dropDownBox=dropDownBox+"<div class='select-1'>";
		if(area[i].pid==0){
			dropDownBox=dropDownBox+"<span id='"+area[i].id+"' onclick='pick(this)' class='select-title'>"+area[i].name+"</span>";
			areaId = area[i].id;
		}else if(areaId == area[i].pid){
			dropDownBox=dropDownBox+"<div class='select-2'>"+
			    "<span id=\""+area[i].id+"\" onclick='pick(this)'>"+area[i].name+"</span>"
			    +"</div>";
		}		
		dropDownBox=dropDownBox+"</div>";
	}	
	$("#HMF-1").html(dropDownBox);
} 
//生成目的地城市菜单下拉框
function renderBoardCity1(area){
	var dropDownBox="";
	for(var i=0;i<area.length;i++){	
		dropDownBox=dropDownBox+"<div class='select-1'>";
		if(area[i].pid==0){
			dropDownBox=dropDownBox+"<span id='"+area[i].id+"' onclick='pick1(this)' class='select-title'>"+area[i].name+"</span>";	
		}else{
			dropDownBox=dropDownBox+"<div class='select-2'>"+
			    "<span id=\""+area[i].id+"\" onclick='pick1(this)'>"+area[i].name+"</span>"
			    +"</div>";
		}		
		dropDownBox=dropDownBox+"</div>";
	}	
	$("#HMF-2").html(dropDownBox);
}
//发布产品
function publishProduce(){
	$("#publishProduce").attr("onclick","#");
	var code=$("#resourceCode").val();
	//var travelDate=$("#travelDate").val();
	var days=parseInt($("#days").val());
	//var price=$("#price").val();
	var boardCity=$("#boardCity").val();
	var boardCityId=$("#boardCityId").val();
	var startCity=$("#boardCity").val();
	var endCity=$("#endCity").val();
	var wayCity=$("#wayCity").val();
	var showLevel=$("#showLevel").val();
//	var busPrice = $("#busPrice").val();
//	var insurancePrice = $("#insurancePrice").val();
//	var addSpacePrice = $("#addSpacePrice").val();
	//var traderPrice=$("#traderPrice").val();
	//var umPrice=$("#traderPrice").val();
	var productType=$("#productType").val();
	var cruiseCompanyId;
	var cruiseCompany;
	var cruiseId;
	var cruise;
	var title;
	var shippingLineId;
	var shippingLine;
	var wayCityArr = wayCity.split("，");
	var wayCityStr = "";
	if(wayCityArr.length > 0){
		for(var i = 0; i < wayCityArr.length; i++){
			wayCityStr = wayCityStr+wayCityArr[i]+"-";
		}
	}
	if(productType == 21){
		cruiseCompanyId=$("#cruiseCompany").val();
		cruiseCompany=$("#cruiseCompany").find("option[value='"+$("#cruiseCompany").val()+"']").text();
		cruiseId = $("#cruise").val();
		cruise=$("#cruise").find("option[value='"+$("#cruise").val()+"']").text();
		shippingLineId = $("#shippingLine").val();
		shippingLine = $("#shippingLine").find("option[value='"+$("#shippingLine").val()+"']").text();
		title=cruiseCompany+"-"+cruise+" "+startCity+"-"+wayCityStr+endCity+" "+(days-1)+"晚"+days+"日 ";
	}else if(productType == 22){
		title = startCity+"-"+wayCityStr+endCity+" "+(days-1)+"晚"+days+"日";
	}else{
		title = startCity+"-"+wayCityStr+endCity+" "+(days-1)+"晚"+days+"日";
	}

	var wordContent=$("#txtDefaultHtmlArea").val();
	var regex=/<img\b[^>]*>/;
	wordContent=wordContent.replace(/<img\b[^>]*>/g,"");
	//var num=$("#num").val();
	var wordPath=$("#wordPath").val();
	var picPath=$("#picPath").val();
	var reservation=$("#reservation").val();
	var priceContain=$("#priceContain").val();
	if(showLevel==0){
	var	status=1;
	}else{
	var	status=0;
	}
	if(checkPublishProduceInfo(wordContent)) {
		var resourceInfo={
				"title":title,
				//"travelDate":travelDate,
				"days":days,
				//"price":price,
				"boardCity":boardCity,
				"boardCityId":boardCityId,
				"startCity":startCity,
				"endCity":endCity,
				"wayCity":wayCity,
				"showLevel":showLevel,
//				"busPrice":busPrice,
//				"insurancePrice":insurancePrice,
//				"addSpacePrice":addSpacePrice,
				//"traderPrice":traderPrice,
				"picPath":picPath,
				"cruiseCompanyId":cruiseCompanyId,
				"cruiseCompany":cruiseCompany,
			    "shippingLineId":shippingLineId,
			    "shippingLine":shippingLine,
				"cruiseId":cruiseId,
				"cruiseName":cruise,
				"wordContent":wordContent,
				"productType":productType,
				"status":status,
				//"num":num,
				"code":code,
				//"umPrice":umPrice,
				"priceContain": priceContain,
				"reservation": reservation
		};
		if(wordPath!=""){
			uploadWord(resourceInfo);
		}
		if(wordPath=="" && code==""){
			//uploadWord(resourceInfo);
			upResourceInfo(resourceInfo);
		}
		if(wordPath=="" && code!=""){
			upResourceInfo(resourceInfo);
		}
	}else{
		$("#publishProduce").attr("onclick","publishProduce()");
	}
}

//把图片转成base64编码，并压缩
function zipImg() {
	var docObj=document.getElementById("inputFilePic");
  //压缩图片
  lrz(docObj.files[0], {width: 800}).then(function (rst) {
      $('#picPath').val(rst.base64);
  });
	return true;
}
//提交资源信息
function upResourceInfo(resourceInfo){
	commitBodyWait();
	$.ajax({
		url:getContextPath()+'/resource/publishProduce.do',
	    type:'post',
	    data:{
	    	"resource.title":resourceInfo.title,
	    	//"resource.travelDate":resourceInfo.travelDate,
	    	"resource.days":resourceInfo.days,
	    	"resource.boardCity":resourceInfo.boardCity,
	    	"resource.boardCityId":resourceInfo.boardCityId,
	    	"resource.startCity":resourceInfo.startCity,
	    	"resource.endCity":resourceInfo.endCity,
	    	"resource.wayCity":resourceInfo.wayCity,
	    	"resource.showLevel":resourceInfo.showLevel,
	    	//"resource.traderPrice":resourceInfo.traderPrice,
	    	"resource.cruiseCompanyId":resourceInfo.cruiseCompanyId,
	    	"resource.cruiseCompany":resourceInfo.cruiseCompany,
			"resource.shippingLineId":resourceInfo.shippingLineId,
			"resource.shippingLine":resourceInfo.shippingLine,
	    	"resource.cruiseId":resourceInfo.cruiseId,
	    	"resource.cruiseName":resourceInfo.cruiseName,
	    	//"resource.price":resourceInfo.price,
//			"resource.busPrice":resourceInfo.busPrice,
//			"resource.insurancePrice":resourceInfo.insurancePrice,
//			"resource.addSpacePrice":resourceInfo.addSpacePrice,
	    	"resource.wordContent":resourceInfo.wordContent,
	    	"resource.wordPath":$("#wordPathUrl").val(),
	    	"resource.picPath":$("#picPath").val(),
	    	"resource.productType":resourceInfo.productType,
	    	"resource.status":resourceInfo.status,
	    	"resource.num":resourceInfo.num,
	    	"resource.code":resourceInfo.code,
	    	//"resource.umPrice":resourceInfo.umPrice,
	    	"resource.versionFlag":$("#versionFlag").val(),
	    	"resource.reservation":resourceInfo.reservation,
	    	"resource.priceContain":resourceInfo.priceContain
	    	},
	    dataType:'json',
	    success:function(data){
	    	if(data.success==1){
	    		/*if((resourceInfo.code=="" || resourceInfo.code==null)&&resourceInfo.productType==21){
	    			commitRemove();
	    			alert("产品发布成功，跳转到船舱发布页！");
	    			publishHouse(data.datas);
	    		}
	    		else if((resourceInfo.code=="" || resourceInfo.code==null)&&resourceInfo.productType!=21){
	    			commitRemove();
	    			/!*alert("发布成功");
	    			refresh();*!/
					toDesResource(data.datas);
	    		}*/
				if(resourceInfo.code=="" || resourceInfo.code==null){
					commitRemove();
					alert("产品发布成功，跳转行程发布页！");
					toDesResource(data.datas);
				}else{
	    			commitRemove();
	    			alert("编辑完成！");
	    			window.location.href=getContextPath()+'/resource/toSearchResource.do?ret=list';
	    		}
	    	}else{
	    		$("#publishProduce").attr("onclick","publishProduce()");
	    		Jalert("发布失败");
	    	}
	    }
	});
}
//跳转到船舱发布
function publishHouse(code) {
	var cruiseId = $('#cruise option:selected').val();
	window.location.href=getContextPath() + '/resource/toPublishHouse.do?ret=list&resource.code='+code+'&code='+code+'&days='+$("#days").val()+"&cruiseId="+cruiseId;
}
//跳转到详情发布
function toDesResource(code){
	//window.location.href = getContextPath() + '/resource/toDesResource.do?ret=list&days='+days+'&code='+code;
	window.location.href = getContextPath() + '/manager/resource/describe.jsp?days='+$('#days').val()+'&code='+code;
}
//上传word文档以及产品的信息
function uploadWord(resourceInfo){
		var ext = '.doc.docx.';
		var f0 = $("#wordPath").val();
		var f = $("#wordPath").val();
		if (f =="") {
			Jalert("请上传word！");
			$("#publishProduce").attr("onclick","publishProduce()");
			return false;
		}
		f = f.substr(f.lastIndexOf('.') + 1).toLowerCase();
		if (ext.indexOf('.' + f + '.') == -1) {
			Jalert("word格式不正确！");
			$("#publishProduce").attr("onclick","publishProduce()");
			return false;
		}
		commitWait();
		$.ajaxFileUpload({
			 url:getContextPath() + "/trader/uploadFile.do?pathDirect=productWord&fileFileName="+f0,
		 	 dataType:"json",
		 	 fileElementId:"inputFile",		 	 
		 	 success:function(data){		 	
		 		// 接收图片路径，给隐藏域赋值	
		 		 if(data!="上传失败"){
		 			 $("#wordPathUrl").val(data);
		 			 upResourceInfo(resourceInfo);
		 		 }else{
		 			 commitRemove();
		 			 Jalert("word上传失败");
		 		 }
		 	 }
		 });
}

//类型触发邮轮厂商消失
function showCruiseCompany(){
	var x=$('#productType option:selected').text();
	var y='邮轮';
		if(x!=y){
			 $("#YouLun").hide();
			 $("#ship").hide();
//			 $("#daba").hide();
			 $("#HangXian").hide();
			 //$("#startDate").show();
			 //$("#remainNum").show();
			 $("#startCityText").text("出发城市：");
			}
		else{
			 $("#YouLun").show();
			 $("#ship").show();
//			 $("#daba").show();
			$("#HangXian").show();
			 //$("#remainNum").hide();
			//$("#startDate").hide();
			 $("#startCityText").text("登船城市：");
			}
}
//类型触发登陆城市改为出发城市
function showCruiseCompany(){
	var x=$('#productType option:selected').text();
	var y='邮轮';
	if(x!=y){
		$("#YouLun").hide();
		$("#ship").hide();
//		$("#daba").hide();
		$("#HangXian").hide();
		//$("#startDate").show();
		//$("#remainNum").show();
		$("#city").html("出发城市<span style='color:red;line-height:0;margin-left:0;'>*</span>：");
	}
	else{
		$("#YouLun").show();
		$("#ship").show();
//		$("#daba").show();
		$("#HangXian").show();
		//$("#startDate").hide();
		//$("#remainNum").hide();
		$("#city").html("登船城市<span style='color:red;line-height:0;margin-left:0;'>*</span>：");
	}
	
}
//验证产品信息
function checkPublishProduceInfo(wordContent){

	var title=$("#title").val();
	//var travelDate=$("#travelDate").val();
	var days=$("#days").val();
	//var price=$("#price").val();
	var showLevel=$("#showLevel").val();
	//var traderPrice=$("#traderPrice").val();
	//var umPrice=$("#umPrice").val();
	//var num=$("#num").val();
	var type=$("#productType").val();
	var wayCity=$("#wayCity").val();
	var boardCity=$("#boardCity").val();
	var endCity=$("#endCity").val();
	var cruiseCompany=$("#cruiseCompany").val();
	var cruise=$("#cruise").val();
	var shippingLine=$("#shippingLine").val();
//	var busPrice = $("#busPrice").val();
//	var insurancePrice = $("#insurancePrice").val();
//	var addSpacePrice = $("#addSpacePrice").val();
	var picPath=$("#picPath").val();
	var reservation=$("#reservation").val();
	var priceContain=$("#priceContain").val();
	if(title=="" && title.length<1000){
		Jalert("请输入正确的产品名称");
		return false;
	}
	//reg=/^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/;
	/*if(!reg.test(travelDate)){
		Jalert("请输入正确的出发时间");
		return false;
	}*/
	reg=/^\d{1,3}$/;
	if(!reg.test(days) || days>127){
		Jalert("请输入正确的天数");
		return false;
	}
	reg='请选择';
	if(reg == boardCity){
		Jalert("请输入正确的城市名称");
		return false;
	}
	reg='请选择';
	if(reg == endCity){
		Jalert("请输入正确的城市名称");
		return false;
	}
	if(type == 21){

		if(reg == cruiseCompany){
			Jalert("请选择邮轮公司");
			return false;
		}
		if(reg == cruise){
			Jalert("请选择邮轮");
			return false;
		}
		if(reg == shippingLine){
			Jalert("请选择邮轮航线");
			return false;
		}
	}
	/*reg=/^[0-9]+\.{0,1}[0-9]{0,2}$/;
	//判断直客价为空，和不为空
	if(price!="" || (price=="" && price.length<1000)){
		if(showLevel==1 && !reg.test(price)){
			Jalert("请输入正确的直客价格");
			return false;
		}
	}
	//判断同业价为空，和不为空
	if(traderPrice!="" || (traderPrice=="" && traderPrice.length<1000)){		
		if(showLevel==1 && !reg.test(traderPrice)){
			Jalert("请输入正确的同业价格");
			return false;
		}
	}*/

	/*reg=/^\d{1,4}$/;
	if(num!=""){
		if(!reg.test(num) && type!=21){
			Jalert("请输入正确的余量");
			return false;
		}
	}*/
	reg=/^\d{1,4}$/;
//	if(type == 21){
//
//		if(!reg.test(busPrice)){
//			Jalert("请输入正确的大巴价");
//			return false;
//
//		}
//	}
//	if(!reg.test(insurancePrice)){
//		Jalert("请输入正确的保险价");
//		return false;
//
//	}
//	if(addSpacePrice != "" && !reg.test(addSpacePrice)){
//		Jalert("请输入正确的挂舱价");
//		return false;
//		
//	}

	if(picPath==""){
		Jalert("图片不能为空");
		return false;
	}
	if(wayCity.length>2000){
		Jalert("途径城市字符超出长度");
		return false;
	}
	if(reservation.trim()==""){
		Jalert("请输入预定须知");
		return false;
	}
	if(priceContain.trim()==""){
		Jalert("请输入费用说明");
		return false;
	}
	return true;
}
//取消
function cancel(){
	if($("#resourceCode").val()==null || $("#resourceCode").val()==""){
		refresh();
	}else{
		window.location.href=getContextPath()+'/resource/toSearchResource.do?ret=list';
	}
}
//刷新页面
function refresh(){
	window.location.href = getContextPath() + '/resource/toSaveResource.do?ret=list';
}