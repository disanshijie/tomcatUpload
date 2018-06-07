var code;//获取产品code
var cruiseId;//获取游轮id
var title;//获取产品title
var days;
var cabin;
var id;
var productType;
var crusieLimit;
//初始化页面
function initPage() {
	id = getUrlParam("id");
	code = getUrlParam("code");//获取产品code
	cruiseId = getUrlParam("cruiseId");//获取游轮id
	title = getUrlParam("title");//获取产品title
	crusieLimit = getUrlParam("crusieLimit");//获取产品title
	days = getUrlParam("days");
	productType = getUrlParam("productType");
	//加载航次信息
	loadResourceVersion(id);
}


//加载航次信息
function loadResourceVersion(id){
	searchResourceVersion(id);
	//根据航次id查询航次舱型
	$.ajax({
		url:getContextPath()+"/resource/searchCruiseHouseListAllInfo.do",
		type:'post',
		data:{'productVersion.id':id},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				fillHouseData(data.datas);
				commitRemove();
			}else{
				Jalert("系统出错，请联系管理员");
				commitRemove();
			}
		}
	});
}
/**
 * 查询航次
 * @param id
 */
function searchResourceVersion(id){
	$.ajax({
		url:getContextPath()+"/resource/searchResourceVersion.do",
		type:'post',
		data:{'productVersion.id':id},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				var datas = data.datas;
				$("#startDate").val(datas.startDate);
				$("#title").val(datas.title);
				$("#crusieLimit").val(datas.crusie_limit);
				$("#gxhc").attr('onclick','updateResourceVersion(\''+datas.id+'\')');
			}else{
				Jalert("系统出错，请联系管理员");
				commitRemove();
			}
		}
	});
}


//填充房间信息
function fillHouseData(housesInfo){
	var list = "";
	for(var i=0; i<housesInfo.length; i++) {
		var um_price = '';
		if(housesInfo[i].um_price != undefined) {
			um_price = housesInfo[i].um_price;
		}
		list=list+
		'<li>'
			+"<div class='cabin-type-name'>"+"<h1>舱型：</h1>"
			+"<input type='text' class='form-control' placeholder='请输入舱型' value='"+housesInfo[i].cabin_name+"'>"
			+"</div>"
			+"<div class='cabin-name'>"+"<h1>舱位：</h1>"
			+"<input type='text' class='form-control' placeholder='请输入舱位' value='"+housesInfo[i].house_type+"'>"
			+"</div>"
		    +"<div class='cabin'>"+"<h1>单间人数：</h1>"
		 		+"<input type='text' class='form-control housePersonNum' placeholder='请输入单间人数' value='"+housesInfo[i].house_person_num+"'>"
		    +"</div>"
		    +"<div class='cabin'>"+"<h1>切舱间数<font color=red>*</font>：</h1>"
		    		+"<input type='text' class='form-control totalNum' value='"+housesInfo[i].total_num+"' placeholder='请输入切舱间数' onchange='resetNum(this)' onblur='resetNum(this)'>"
		    +"</div>"
		    +"<div class='cabin'>"+"<h1>剩余间数<font color=red>*</font>：</h1>"
		    		+"<input type='text' class='form-control houseNum' value='"+housesInfo[i].house_num+"'>"
		    +"</div>"
		    +"<div class='cabin'>"+"<h1>成本价：</h1>"
		    		+"<input type='text' class='form-control umPrice' value='"+um_price+"' placeholder='请输入成本价'>"
		    +"</div>"
		    +"<div class='cabin'>"+"<h1>同行价：</h1>"
		    +"<input type='text' class='form-control traderPrice' value='"+housesInfo[i].trader_price+"' placeholder='请输入同行价'>"
		    +"</div>"
		    +"<div class='cabin'>"+"<h1>直客价<font color=red>*</font>：</h1>"
		    		+"<input type='text' class='form-control customerPrice' value='"+housesInfo[i].customer_price+"' placeholder='请输入直客价'>"
		    +"</div>"
		+"</li>";
	}
	$(".cabinli").html(list);
	//根据邮轮id加载邮轮舱型
	loadCabin(cruiseId);

	for(var i = 0; i < housesInfo.length;i++){
		$('#cabinName'+i).val(housesInfo[i].cabin_id);
		var shippingSpaceDiv = $('#cabinName'+i).parent("div").next("div");
		loadShippingSpace(housesInfo[i].cabin_id,shippingSpaceDiv);
		$('#shipping-space'+i).val(housesInfo[i].shipping_space_id);
	}

	$("#publishHouse").hide();
}



//跳转到发布产品页面
function toSaveResource(){
	window.location.href = getContextPath() + '/resource/toSaveResource.do?ret=list';
}
//跳转到查询页面
function toSearchResource(){
	window.location.href=getContextPath()+'/resource/toSearchResource.do?ret=list';
}
//跳转到航次列表页面
function toResourceVersion(){
	window.location.href=getContextPath()+"/manager/resource/checkhq.jsp?code="+code+"&cruiseId="+cruiseId+"&title="+escape(title)+"&days="+days+"&productType="+productType;
}
