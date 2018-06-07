var code;//获取产品code
var cruiseId;//获取游轮id
var title;//获取产品title
var crusieLimit;//获取产品crusieLimit
var days;
var cabin;
var id;
var type;
var productType;
 var totalNumOld,houseNumOld,allTotalNumOld,allHouseNumOld,allTotalPersonNumOld,allHousePersonNumOld,allLimitNumOld;
var insideTotalNumOld,insideCruiseNumOld,sunTotalNumOld,sunCruiseNumOld,seaTotalNumOld,seaCruiseNumOld,suiltTotalNumOld,suitCruiseNumOld;
var  cruiseTotalNumOld,allCruiseTotalNumOld ;

//初始化页面
function initPage() {
	id = getUrlParam("id");
	type = getUrlParam("type");
	code = getUrlParam("code");//获取产品code
	cruiseId = getUrlParam("cruiseId");//获取游轮id
	title = getUrlParam("title");//获取产品title
	crusieLimit = getUrlParam("crusieLimit");//获取产品title
	$("#crusieLimit").val(crusieLimit);
	days = getUrlParam("days");
	var titleArr = title.split("-");//之前名称
    wayCity=titleArr.slice(2,titleArr.length-1);
    $("#wayCity").val(wayCity);
	productType = getUrlParam("productType");

		if(id == 1){
			$(".baocunversion").hide();
			//如果是发布航次，默认生成5条
			var list='';
			for(var i=0;i<5;i++) {
				list=list+
					"<li>"
					+'<div class="cabin-type-name">'
					+'<h1>舱位类型：</h1>'
					+'<select name="" type="text" class="form-control cabinName">'

					+'</select>'
					+'</div>'
					+'<div class="cabin-name">'
					+'<h1>舱位：</h1>'
					+'<select name="" type="text" class="form-control shipping-space">'

					+'</select>'
					+'</div>'
					+"<div class='cabin cabinNum'>"+"<h1>单间人数：</h1>"
					+"<input type='text' class='form-control housePersonNum' placeholder='请输入单间人数'>"
					+"</div>"
					+"<div class='cabin cabinNum'>"+"<h1>船方切仓<font color=red>*</font>：</h1>"
					+"<input type='text' class='form-control cruiseTotalNum' placeholder='请输入船方切仓'>"
					+"</div>"
					+"<div class='cabin cabinNum'>"+"<h1>线上间数<font color=red>*</font>：</h1>"
					+"<input type='text' class='form-control totalNum' placeholder='请输入线上间数'>"
					+"</div>"
					+"<div class='cabin cabinNum' style='display:none'>"+"<h1>线上剩余<font color=red>*</font>：</h1>"
					+"<input type='text' class='form-control houseNum'>"
					+"</div>"
					+"<div class='cabin cabinPrice'>"+"<h1>同行价：</h1>"
					+"<input type='text' class='form-control traderPrice' placeholder='请输入同行价'>"
					+"</div>"
					+"<div class='cabin cabinPrice'>"+"<h1>规划师价：</h1>"
					+"<input type='text' class='form-control umPrice' placeholder='请输入规划师价'>"
					+"</div>"
					+"<div class='cabin cabinPrice'>"+"<h1>直客价<font color=red>*</font>：</h1>"
					+"<input type='text' class='form-control customerPrice' placeholder='请输入直客价'>"
					+"</div>"
					+"<div class='removecabin'>"
					+"</div>"
					+"</li>";
			}
			$("#cruiseHouse").html(list);
			$(".addVersionGoods").hide();
			//根据邮轮id加载邮轮舱型
			loadCabin(cruiseId);
		}else{
			$("#voyage").text("编辑班期");
			$(".addVersionGoods").show();
			//编辑航次
			loadResourceVersionGoods(id);
			loadResourceVersion(id);
			//编辑附加产品
		}


}

//加载邮轮舱位
function loadShippingSpace(cabinId,div){
	var shippSpaceDiv = div;
	$.ajax({
		url:getContextPath()+"/resource/searchShippingSpaceList.do",
		data:{'cabinId':cabinId},
		type:"post",
		dataType:"json",
		async: false,
		success:function(data){
			if(data.success==1){
				var datas = data.datas;
				var list = "<option>请选择</option>";
				for(var i = 0; i < datas.length; i++){
					//获取邮轮舱位id
					var id = datas[i].id;
					//获取邮轮舱位名称
					var name = datas[i].name;
					//将邮轮信息加入到option
					list = list +"<option value="+id+">"+name+"</option>";
				}
				shippSpaceDiv.children(".shipping-space").html(list);
			}
		}
	});
}

//加载邮轮舱型
function loadCabin(id){
	$.ajax({
		url:getContextPath()+"/resource/searchCabinList.do",
		type:'post',
		async: false,
		data: {
			'cruiseId':id
		},
		dataType:'json',
		success:function(data){
			if(data.success == 1){
				datas = data.datas;
				cabin = datas;
				if(datas.length == 0){
					alert("未加载出该邮轮的舱型信息，请联系管理员！")
				}else{
					var dropDownBox="<option>请选择</option>";
					for(var i = 0 ; i < datas.length; i++){
						var cabinId = datas[i].id;
						var cabinName = datas[i].name;

						//将舱型信息加入到舱型select所在的option
						dropDownBox=dropDownBox+"<option value='"+cabinId+"'>"+cabinName+"</option>";
					}
					$(".cabinName").html(dropDownBox);
				}

			}else{
				Jalert("系统出错，请联系管理员");
				commitRemove();
			}
		}
	});

	//根据邮轮舱型获取游轮舱位列表
	$(".cabinName").change(function(){
		//移除之前加载的信息
		var shippSpaceDiv = $(this).parent("div").next("div");
		var personNumDiv = shippSpaceDiv.next("div");
		shippSpaceDiv.children(".shipping-space option:gt(0)").remove();
		personNumDiv.children(".housePersonNum").val("");
		//获取游轮公司id
		var cabinId = this.value;

		loadShippingSpace(cabinId,shippSpaceDiv);

	});

	//根据邮轮舱位获取单间人数
	$(".shipping-space").change(function(){
		var personNumDiv = $(this).parent("div").next("div");
		//移除之前加载的信息
		personNumDiv.children(".housePersonNum").text("");
		//获取邮轮舱位id
		var shippingSpaceId = this.value;
		$.ajax({
			url:getContextPath()+"/resource/searchShippingSpacePersonNum.do",
			data:{'shippingSpaceId':shippingSpaceId},
			type:"post",
			dataType:"json",
			success:function(data){
				if(data.success==1){
					var datas = data.datas;
					personNumDiv.children(".housePersonNum").val(datas.house_person_num);
				}else{
					Jalert("系统出错，请联系管理员");
					commitRemove();
				}
			}
		});

	});
}

function changeCabin(node){
	var shippSpaceDiv = $(node).parent("div").next("div");
	var personNumDiv = shippSpaceDiv.next("div");
	shippSpaceDiv.children(".shipping-space option:gt(0)").remove();
	personNumDiv.children(".housePersonNum").val("");
	//获取游轮公司id
	var cabinId = node.value;
	$.ajax({
		 url:getContextPath()+"/resource/searchShippingSpaceList.do",
		 data:{'cabinId':cabinId},
		 type:"post",
		 dataType:"json",
		 success:function(data){
			 if(data.success==1){
				 var datas = data.datas;
				 var list = "<option>请选择</option>";
				 for(var i = 0; i < datas.length; i++){
				 //获取邮轮舱位id
				 var id = datas[i].id;
				 //获取邮轮舱位名称
				 var name = datas[i].name;
				 //将邮轮信息加入到option
				 list = list +"<option value="+id+">"+name+"</option>";
				 }
				 shippSpaceDiv.children(".shipping-space").html(list);
			 }
		  }
	 });

	//根据邮轮舱位获取单间人数
	$(".shipping-space").change(function(){
		var personNumDiv = $(this).parent("div").next("div");
		//移除之前加载的信息
		personNumDiv.children(".housePersonNum").text("");
		//获取邮轮舱位id
		var shippingSpaceId = this.value;
		$.ajax({
			url:getContextPath()+"/resource/searchShippingSpacePersonNum.do",
			data:{'shippingSpaceId':shippingSpaceId},
			type:"post",
			dataType:"json",
			success:function(data){
				if(data.success==1){
					var datas = data.datas;
					personNumDiv.children(".housePersonNum").val(datas.house_person_num);
				}else{
					Jalert("系统出错，请联系管理员");
					commitRemove();
				}
			}
		});

	});
}
function changeCabin1(node){
	var shippSpaceDiv = $(node).parent("div").next("div");
	var personNumDiv = shippSpaceDiv.next("div");
	shippSpaceDiv.children(".shipping-space option:gt(0)").remove();
	personNumDiv.children(".housePersonNum").val("");
	//获取游轮公司id
	var cabinId = node.value;
	$.ajax({
		url:getContextPath()+"/resource/searchShippingSpaceList.do",
		data:{'cabinId':cabinId},
		type:"post",
		dataType:"json",
		success:function(data){
			if(data.success==1){
				var datas = data.datas;
				var list = "<option>请选择</option>";
				for(var i = 0; i < datas.length; i++){
					//获取邮轮舱位id
					var id = datas[i].id;
					//获取邮轮舱位名称
					var name = datas[i].name;
					//将邮轮信息加入到option
					list = list +"<option value="+id+">"+name+"</option>";
				}
				list = list +'<option value="">手动输入</option>';
				shippSpaceDiv.children(".shipping-space").html(list);
			}
		}
	});
	
	//根据邮轮舱位获取单间人数
	$(".shipping-space").change(function(){
		var personNumDiv = $(this).parents("li").next().find("div:eq(0)");
		//移除之前加载的信息
		personNumDiv.children(".housePersonNum").text("");
		//获取邮轮舱位id
		var shippingSpaceId = this.value;
		$.ajax({
			url:getContextPath()+"/resource/searchShippingSpacePersonNum.do",
			data:{'shippingSpaceId':shippingSpaceId},
			type:"post",
			dataType:"json",
			success:function(data){
				if(data.success==1){
					var datas = data.datas;
					personNumDiv.children(".housePersonNum").val(datas.house_person_num);
				}else{
					Jalert("系统出错，请联系管理员");
					commitRemove();
				}
			}
		});
		
	});
}

////删除船舱行
//$('div').on('click','.removecabin',function(){
//	 if(confirm("确定删除吗?")){
//		 $(this).parent().remove();
//	 }
//});
/**
 * 查询附加产品
 * @param id
 */
function loadResourceVersionGoods(id){
	$.ajax({
		url:getContextPath()+"/resource/searchCruiseHouseListAllInfo.do",
		type:'post',
		data:{'productVersion.id':id,
			'productVersion.cabinId':0
			},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				fillGoodsData(data.datas);
				commitRemove();
			}else{
				Jalert("系统出错，请联系管理员");
				commitRemove();
			}
		}
	});
}
//填充附加产品信息
function fillGoodsData(housesInfo){
	var list = "";
	for(var i=0; i<housesInfo.length; i++) {
		
		if(housesInfo[i].shipping_space_id == 1){//如果是挂舱
			$("#addSpaceName").val(housesInfo[i].house_type);//产品名称（shippingSpace）
			$("#addSpaceTotalNum").val(housesInfo[i].total_num);//产品数量（totalNum）
			$("#addSpaceNum").val(housesInfo[i].house_num);//产品数量（totalNum）
			$("#addSpacePrice").val(housesInfo[i].customer_price);//产品价格（traderPrice umPrice customerPrice）
			$("#addSpaceId").val(housesInfo[i].id);//产品价格（traderPrice umPrice customerPrice）
		}else{
			list = list +
			'<li style="margin-bottom: 10px;">'+
		 	'<div class="cabin-type-name goodName"><input class="form-control" value="'+housesInfo[i].house_type+'" type="text"></div>'+
		 	'<div class="cabin-name goodsTotalNum"><input class="form-control" value="'+housesInfo[i].total_num+'" type="text"></div>'+
		 	'<div class="cabin-name goodsNum"><input class="form-control" value="'+housesInfo[i].house_num+'" type="text"></div>'+
		 	'<div class="cabin cabinNum goodsPrice"><input class="form-control" value="'+housesInfo[i].customer_price+'" type="text"></div>'+
		 	'<div class="cabin cabinNum goodsId" style="display:none"><input class="form-control" value="'+housesInfo[i].id+'" type="text"></div>'+
		 	'<button type="submit" class="btn btn-primary fleft editGoods" style="margin: 0px 0 0 10px;">修改</button>'+
		 	'</li>';
		}
	}
	$("#goodsInfo").append(list);
}

//加载航次信息
function loadResourceVersion(id){
	searchResourceVersion(id);
	loadResourceList();
	//根据航次id查询航次舱型
	$.ajax({
		url:getContextPath()+"/resource/searchCruiseHouseListAllInfo.do",
		type:'post',
		data:{'productVersion.id':id,
			'productVersion.cabinId':1
			},
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
				var wayCity = datas.wayCity;
				if(wayCity !=null){
					$("#wayCity").val(datas.wayCity);
				}
				$("#gxhc").attr('onclick','updateProductVersion(\''+datas.id+'\')');
			}else{
				Jalert("系统出错，请联系管理员");
				commitRemove();
			}
		}
	});
}
//查询保险和大巴在产品里
function loadResourceList(){
	loadWait();
	$.ajax({
		url:getContextPath()+"/resource/searchResourceListToProduce.do",
		type:'post',
		data:{'resource.code':code,
			  'pager.pageNum': 1,
			  'pager.pageSize': 10
		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				var datas = data.datas;
				var insurancePrice,busPrice;
				for(var i=0; i<datas.length; i++) {
					insurancePrice = datas[i].insurance_price;
					busPrice = datas[i].bus_price;
				}
				if(insurancePrice != null && insurancePrice !=""){
					$("#insurance").val(insurancePrice);
				}
				if(busPrice != null && busPrice !=""){
					$("#bus").val(busPrice);
				}
			}else{
				Jalert(data.msg);
				commitRemove();
			}
		}
	});
}
//填充房间信息
function fillHouseData(housesInfo){
	
	var perHousePersonNum =0;
	var perTotalNum =0;
	var perCruiseTotalNum =0;
	var perHouseNum =0;
	var perLimitNum =0;
	var perCruiseLimitNum =0;
	var allTotalNum =0;//总间数
	var allHouseNum =0;//总剩余间数
	var allTotalPersonNum =0;//总人数
	var allHousePersonNum =0;//总剩余人数
	var allLimitNum =0;//使用额度
	var allCruiseTotalNum =0;//总原切舱间数
//	var allCruiseLimitNum =0;//总切舱额度
	var cabinName;
	var insideTotalNum = 0,insideCruiseNum = 0,sunTotalNum= 0,sunCruiseNum= 0,seaTotalNum= 0,seaCruiseNum= 0,suitTotalNum= 0,suitCruiseNum= 0;
	var insideList = '<div class="info-content">'+
	 	'<div class="yuding-title"><span>內舱房</span></div>'+
	 	'<div style="padding:  10px 12px 15px 12px;overflow: hidden;">'+
	 	'<li><div class="cabin-type-name ">'
		+'<h1>舱位类型：</h1>'
		+'</div>'
		+'<div class="cabin-name">'
		+'<h1>舱位：</h1>'
	    +'</div>'
	    +"<div class='cabin cabinNum '>"+"<h1>单间人数：</h1>"
	    +"</div>"
	    +"<div class='cabin cabinNum '>"+"<h1>船方切仓<font color=red>*</font>：</h1>"
		+"</div>"
	    +"<div class='cabin cabinNum'>"+"<h1>线上间数<font color=red>*</font>：</h1>"
	    +"</div>"
	    +"<div class='cabin cabinNum '>"+"<h1>线上剩余<font color=red>*</font>：</h1>"
	    +"</div>"
	    +"<div class='cabin cabinPrice'>"+"<h1>同行价：</h1>"
	    +"</div>"
	    +"<div class='cabin cabinPrice'>"+"<h1>规划师价：</h1>"
	    +"</div>"
	    +"<div class='cabin cabinPrice'>"+"<h1>直客价<font color=red>*</font>：</h1>"		
	    +"</div>"
	+"</li>";

	var sunList = '<div class="info-content">'+
 	'<div class="yuding-title"><span>阳台房</span></div>'+
 	'<div style="padding:  10px 12px 15px 12px;overflow: hidden;">'+
 	'<li><div class="cabin-type-name ">'
	+'<h1>舱位类型：</h1>'
	+'</div>'
	+'<div class="cabin-name">'
	+'<h1>舱位：</h1>'
    +'</div>'
    +"<div class='cabin cabinNum '>"+"<h1>单间人数：</h1>"
    +"</div>"
    +"<div class='cabin cabinNum '>"+"<h1>船方切仓<font color=red>*</font>：</h1>"
	+"</div>"
    +"<div class='cabin cabinNum'>"+"<h1>线上间数<font color=red>*</font>：</h1>"
    +"</div>"
    +"<div class='cabin cabinNum '>"+"<h1>线上剩余<font color=red>*</font>：</h1>"
    +"</div>"
    +"<div class='cabin cabinPrice'>"+"<h1>同行价：</h1>"
    +"</div>"
    +"<div class='cabin cabinPrice'>"+"<h1>规划师价：</h1>"
    +"</div>"
    +"<div class='cabin cabinPrice'>"+"<h1>直客价<font color=red>*</font>：</h1>"		
    +"</div>"
+"</li>";

	var seaList = '<div class="info-content">'+
 	'<div class="yuding-title"><span>海景房</span></div>'+
 	'<div style="padding:  10px 12px 15px 12px;overflow: hidden;">'+
 	'<li><div class="cabin-type-name ">'
	+'<h1>舱位类型：</h1>'
	+'</div>'
	+'<div class="cabin-name">'
	+'<h1>舱位：</h1>'
    +'</div>'
    +"<div class='cabin cabinNum '>"+"<h1>单间人数：</h1>"
    +"</div>"
    +"<div class='cabin cabinNum '>"+"<h1>船方切仓<font color=red>*</font>：</h1>"
	+"</div>"
    +"<div class='cabin cabinNum'>"+"<h1>线上间数<font color=red>*</font>：</h1>"
    +"</div>"
    +"<div class='cabin cabinNum '>"+"<h1>线上剩余<font color=red>*</font>：</h1>"
    +"</div>"
    +"<div class='cabin cabinPrice'>"+"<h1>同行价：</h1>"
    +"</div>"
    +"<div class='cabin cabinPrice'>"+"<h1>规划师价：</h1>"
    +"</div>"
    +"<div class='cabin cabinPrice'>"+"<h1>直客价<font color=red>*</font>：</h1>"		
    +"</div>"
+"</li>";
	var suitList = '<div class="info-content">'+
 	'<div class="yuding-title"><span>套房</span></div>'+
 	'<div style="padding:  10px 12px 15px 12px;overflow: hidden;">'+
 	'<li><div class="cabin-type-name ">'
	+'<h1>舱位类型：</h1>'
	+'</div>'
	+'<div class="cabin-name">'
	+'<h1>舱位：</h1>'
    +'</div>'
    +"<div class='cabin cabinNum '>"+"<h1>单间人数：</h1>"
    +"</div>"
    +"<div class='cabin cabinNum '>"+"<h1>船方切仓<font color=red>*</font>：</h1>"
	+"</div>"
    +"<div class='cabin cabinNum'>"+"<h1>线上间数<font color=red>*</font>：</h1>"
    +"</div>"
    +"<div class='cabin cabinNum '>"+"<h1>线上剩余<font color=red>*</font>：</h1>"
    +"</div>"
    +"<div class='cabin cabinPrice'>"+"<h1>同行价：</h1>"
    +"</div>"
    +"<div class='cabin cabinPrice'>"+"<h1>规划师价：</h1>"
    +"</div>"
    +"<div class='cabin cabinPrice'>"+"<h1>直客价<font color=red>*</font>：</h1>"		
    +"</div>"
+"</li>";
	
	var insideSum='<li><div class="cabin-type-name"><h1>合计</h1></div><div class="cabin-name"><h1></h1></div>'+
	'<div class="cabin cabinNum"><h1></h1></div><div class="cabin cabinNum "><h1><span id="insideCruiseNum" style="color: #ff7c00;"></span></h1></div>'+
	'<div class="cabin cabinNum "><h1><span id="insideTotalNum" style="color: #ff7c00;"></span></h1></div>'+
	'<div class="cabin cabinNum "><h1></h1></div><div class="cabin"><h1></h1></div><div class="cabin"><h1></h1></div></li></div></div>';
	var sunSum='<li><div class="cabin-type-name"><h1>合计</h1></div><div class="cabin-name"><h1></h1></div>'+
	'<div class="cabin cabinNum"><h1></h1></div><div class="cabin cabinNum "><h1><span id="sunCruiseNum" style="color: #ff7c00;"></h1></span></div>'+
	'<div class="cabin cabinNum "><h1><span id="sunTotalNum" style="color: #ff7c00;"></span></h1></div>'+
	'<div class="cabin cabinNum "><h1></h1></div><div class="cabin"><h1></h1></div><div class="cabin"><h1></h1></div></li></div></div>';
	var seaSum='<li><div class="cabin-type-name"><h1>合计</h1></div><div class="cabin-name"><h1></h1></div>'+
	'<div class="cabin cabinNum"><h1></h1></div><div class="cabin cabinNum "><h1><span id="seaCruiseNum" style="color: #ff7c00;"></h1></span></div>'+
	'<div class="cabin cabinNum "><h1><span id="seaTotalNum" style="color: #ff7c00;"></span></h1></div>'+
	'<div class="cabin cabinNum "><h1></h1></div><div class="cabin"><h1></h1></div><div class="cabin"><h1></h1></div></li></div></h1></div>';
	var suitSum='<li><div class="cabin-type-name"><h1>合计</h1></div><div class="cabin-name"><h1></h1></div>'+
	'<div class="cabin cabinNum"><h1></h1></div><div class="cabin cabinNum "><h1><span id="suitCruiseNum" style="color: #ff7c00;"></h1></span></div>'+
	'<div class="cabin cabinNum "><h1><span id="suitTotalNum" style="color: #ff7c00;"></span></h1></div>'+
	'<div class="cabin cabinNum "><h1></h1></div><div class="cabin"><h1></h1></div><div class="cabin"><h1></h1></div></li></div></div>';
	var newInsideList = insideList+insideSum,newSunList = sunList+sunSum,newSeaList = seaList+seaSum,newSuitList = suitList+suitSum;
	for(var i=0; i<housesInfo.length; i++) {
		var um_price = '';
		var list = "";
		if(housesInfo[i].um_price != undefined) {
			um_price = housesInfo[i].um_price;
		}
		perHousePersonNum = parseInt(housesInfo[i].house_person_num);
		perTotalNum = housesInfo[i].total_num;
		perCruiseTotalNum = housesInfo[i].cruise_total_num;
		perHouseNum = housesInfo[i].house_num;
		if(perHousePersonNum >2){
			perLimitNum = (perHousePersonNum -2)*perTotalNum;
			allLimitNum = allLimitNum +perLimitNum;
			perCruiseLimitNum = (perHousePersonNum -2)*perCruiseTotalNum;
//			allCruiseLimitNum = allCruiseLimitNum + perCruiseLimitNum;
		}
		allTotalNum = allTotalNum + perTotalNum;
		allHouseNum = allHouseNum + perHouseNum;
		allCruiseTotalNum = allCruiseTotalNum +perCruiseTotalNum;
		allTotalPersonNum = allTotalPersonNum + perHousePersonNum * perTotalNum;
		allHousePersonNum = allHousePersonNum + perHousePersonNum * perHouseNum;
		
		list=list+
		
		'<li style="margin-bottom: 10px;">'
			+'<div class="cabin-type-name cabinNameDiv">'
			+'<select id="cabinName'+i+'" name="" type="text" class="form-control cabinName"  disabled="disabled">'
			+'</select>'
			+'</div>'
			+'<div class="cabin-name">'
		    +'<select id="shipping-space'+i+'" name="" type="text" class="form-control shipping-space"  disabled="disabled">'
		    +'</select>'
		    +'</div>'
			/*+"<div class='cabin-name'>"+"<h1>舱型<font color=red>*</font>：</h1>"
				+"<input type='text' class='form-control houseType' placeholder='请输入舱型' value='"+housesInfo[i].house_type+"'>"+"</div>"*/
		   +"<div class='cabin cabinNum housePersonNumDiv'>"
				+"<input type='text' class='form-control housePersonNum' placeholder='请输入单间人数' value='"+housesInfo[i].house_person_num+"' readonly='true'>"
		   +"</div>"
		   +"<div class='cabin cabinNum cruiseTotalNumDiv'>"
			+"<input type='text' class='form-control cruiseTotalNum' value='"+perCruiseTotalNum+"' placeholder='请输入船方切仓'>"
			+"</div>"
		   +"<div class='cabin cabinNum'>"
		   		+"<input type='text' class='form-control totalNum' value='"+perTotalNum+"' placeholder='请输入线上间数'>"
		   		+"<input type='hidden' value="+perTotalNum+">"
		   +"</div>"
		   +"<div class='cabin cabinNum houseNumDiv'>"
		   		+"<input type='text' class='form-control houseNum' value='"+perHouseNum+"' readonly='true'>"
		   		+"<input type='hidden' value="+perHouseNum+">"
		   +"</div>"
		   +"<div class='cabin cabinPrice'>"
		   +"<input type='text' class='form-control traderPrice' value='"+housesInfo[i].trader_price+"' placeholder='请输入同行价'>"
		   +"</div>"
		   +"<div class='cabin cabinPrice'>"
		   		+"<input type='text' class='form-control umPrice' value='"+um_price+"' placeholder='请输入规划师价'>"
		   +"</div>"
		   
		   +"<div class='cabin cabinPrice'>"
		   		+"<input type='text' class='form-control customerPrice' value='"+housesInfo[i].customer_price+"' placeholder='请输入直客价'>"				
		   +"</div>"
		   +"<div class='baocunversion'>"
				+"<input type='hidden' value="+housesInfo[i].id+">"
				+"<button id='gxhc' type='button' class='btn btn-primary editCruiseHouse' style='margin: 0px 0 0 10px;'>保存</button>"
		   +"</div>"
		+"</li>";
		cabinName = housesInfo[i].cabin_name;
	
		if(cabinName == "內舱房"){
			insideTotalNum = insideTotalNum + perTotalNum;
			insideCruiseNum = insideCruiseNum + perCruiseTotalNum;
			insideList = insideList +list;
		}else{
			insideList = insideList + "";
		}
		if(cabinName == "阳台房"){
			sunTotalNum = sunTotalNum + perTotalNum;
			sunCruiseNum = sunCruiseNum + perCruiseTotalNum;
			sunList = sunList + list;
		}else{
			sunList = sunList + "";
		}
		if(cabinName == "海景房"){
			seaTotalNum = seaTotalNum + perTotalNum;
			seaCruiseNum = seaCruiseNum + perCruiseTotalNum;
			seaList = seaList + list;
		}else{
			seaList = seaList + "";
		}
		if(cabinName == "套房"){
			suitTotalNum = suitTotalNum + perTotalNum;
			suitCruiseNum = suitCruiseNum + perCruiseTotalNum;
			suitList = suitList + list;
		}else{
			suitList = suitList + "";
		}
	}
	var addSpaceTotalNum = $("#addSpaceTotalNum").val();
	if(isNaN(addSpaceTotalNum) || addSpaceTotalNum ==""){
		addSpaceTotalNum = 0 ; 
	}
	allLimitNum = allLimitNum +parseInt(addSpaceTotalNum);//加上挂舱额度
	insideList=insideList+insideSum;
	sunList=sunList+sunSum;
	seaList=seaList+seaSum;
	suitList=suitList+suitSum;	
	if(insideList == newInsideList) insideList = "";
	if(sunList == newSunList) sunList = "";
	if(seaList == newSeaList) seaList = "";
	if(suitList == newSuitList) suitList = "";
	$("#cruiseHouse").append(insideList);
	$("#cruiseHouse").append(sunList);
	$("#cruiseHouse").append(seaList);
	$("#cruiseHouse").append(suitList);
	$("#insideTotalNum").text(insideTotalNum);
	$("#insideCruiseNum").text(insideCruiseNum);
	$("#sunTotalNum").text(sunTotalNum);
	$("#sunCruiseNum").text(sunCruiseNum);
	$("#seaTotalNum").text(seaTotalNum);
	$("#seaCruiseNum").text(seaCruiseNum);
	$("#suitTotalNum").text(suitTotalNum);
	$("#suitCruiseNum").text(suitCruiseNum);
	var addlist='<li>'
	+'<div class="cabin-type-name">'
	+'<h1>统计</h1>'
	+'</div>'
	+"<div class='cabin-name allTotalPersonNum'>"+"<h1>总线上人数:"+allTotalPersonNum+"</h1>"
	+"</div>"
	+"<div class='cabin cabinNum  allHousePersonNum'>"+"<h1>总剩余人数:"+allHousePersonNum+"</h1>"
	+"</div>"
	+"<div class='cabin cabinNum  allCruiseTotalNum'>"+"<h1>总船方切仓:"+allCruiseTotalNum+"</h1>"
	+"</div>"
	+"<div class='cabin cabinNum  allTotalNum'>"+"<h1>总线上间数:"+allTotalNum+"</h1>"
	+"</div>"
	+"<div class='cabin cabinNum  allHouseNum'>"+"<h1>总线上剩余:"+allHouseNum+"</h1>"
	+"</div>"
//	+"<div class='cabin allCruiseLimitNum'>"+"<h1>总额度:"+allCruiseLimitNum+"</h1>"
//	+"</div>"
	+"<div class='cabin allLimitNum'>"+"<h1>使用额度:"+allLimitNum+"</h1>"
	+"</div>"
	+"</li>";

	$("#cruiseHouse").append(addlist);
	//根据邮轮id加载邮轮舱型
	loadCabin(cruiseId);

	for(var i = 0; i < housesInfo.length;i++){
		$('#cabinName'+i).val(housesInfo[i].cabin_id);
		var shippingSpaceDiv = $('#cabinName'+i).parent("div").next("div");
		loadShippingSpace(housesInfo[i].cabin_id,shippingSpaceDiv);
		$('#shipping-space'+i).val(housesInfo[i].shipping_space_id);
		//console.log(housesInfo[i].shipping_space_id+"----"+housesInfo[i].house_type);
		if(housesInfo[i].shipping_space_id=='0000000'){
			$('#shipping-space'+i).html('<option value="'+housesInfo[i].shipping_space_id+'" selected="true">'+housesInfo[i].house_type+'</option>');
		}
		
	}
	$(".cruiseTotalNum").focus(//点击的时候获取触发的总切仓间数和总剩余数
			  function(){
				  //单个的之前的数字
				  cruiseTotalNumOld = Number($(this).val());//旧的总间数
				  //每种房型的数量（不会因为聚焦而影响）
				 
				  insideCruiseNumOld =  Number($("#insideCruiseNum").text());//获取内舱船方总切仓
				  sunCruiseNumOld =  Number($("#sunCruiseNum").text());//获取阳台船方总切仓
				  seaCruiseNumOld =  Number($("#seaCruiseNum").text());//获取海洋船方总切仓
				  suitCruiseNumOld =  Number($("#suitCuiseNum").text());//获取套房船方总切仓
				  
				//总计的之前的数字（不会因为聚焦而影响）
				  allCruiseTotalNumOld =  Number($(".allCruiseTotalNum").find("h1:eq(0)").text().substring(6));//原总切舱数
//				  allCruiseLimitNumOld =  Number($(".allCruiseLimitNum").find("h1:eq(0)").text().substring(4));//旧的总额度 
			  
	});

	$(".cruiseTotalNum").keyup(
			function(){
				
				  var cruiseTotalNum = Number($(this).val());//新的总间数
				  cruiseTotalNum = isNaN(cruiseTotalNum)?0:cruiseTotalNum;
				  var housePersonNum = parseInt($(this).parent("div").siblings(".housePersonNumDiv").find("input:eq(0)").val());//单间人数
				  var diffNum = cruiseTotalNum - Number(cruiseTotalNumOld);//新旧差额间数
				  
				  //下面是总计的新变化
//				  if(housePersonNum >2){//新的总额
//					  allCruiseLimitNumOld = allCruiseLimitNumOld +(housePersonNum-2)*diffNum
//				  }

				  //修改之后的额度
				  var allCruiseTotalNum = allCruiseTotalNumOld+diffNum;
				
				  if(cruiseTotalNum >=0){
					  
					  $(".allCruiseTotalNum").html("<h1>总船方切仓:"+allCruiseTotalNum+"</h1>");//总计新的总间数
//					  $(".allCruiseLimitNum").html("<h1>总额度:"+allCruiseLimitNumOld+"</h1>");//总计新的剩余间数
					  var cabin = $(this).parent("div").siblings(".cabinNameDiv").find(".cabinName option:selected").text();//单个改动的房型
				
					  if(cabin == "內舱房"){//操作的哪种房型
						  insideCruiseNumOld = insideCruiseNumOld+diffNum;//获取内舱船方总切舱
						  $("#insideCruiseNum").text(insideCruiseNumOld);
					  }
					  if(cabin == "阳台房"){//操作的哪种房型
						  sunCruiseNumOld = sunCruiseNumOld+diffNum;//获取阳台船方总切舱
						  $("#sunCruiseNum").text(sunCruiseNumOld);
					  }
					  if(cabin == "海景房"){//操作的哪种房型
						  seaCruiseNumOld = seaCruiseNumOld+diffNum;//获取海洋船方总切舱
						  $("#seaCruiseNum").text(seaCruiseNumOld);
					  }
					  if(cabin == "套房房"){//操作的哪种房型
						  suitCruiseNumOld = suitCruiseNumOld+diffNum;//获取套房船方总切舱
						  $("#suitCruiseNum").text(suitCruiseNumOld);
					  }
					  //把所有的更改记录
					  //下面都是单个总计的
					  cruiseTotalNumOld = cruiseTotalNum;
					 //下面都是总计的
					  allCruiseTotalNumOld = allCruiseTotalNum;//旧的总间数
				}
		});
	//加减总间数
	$(".totalNum").focus(//点击的时候获取触发的总切舱间数和总剩余数
			  function(){
				  //单个的之前的数字
				  totalNumOld = Number($(this).val());//旧的总间数
				  houseNumOld =  Number($(this).parent("div").siblings(".houseNumDiv").find("input:eq(0)").val());//旧的剩余间数
				  //每种房型的数量（不会因为聚焦而影响）
				  insideTotalNumOld =  Number($("#insideTotalNum").text());//获取内舱实际总切舱
				  sunTotalNumOld =  Number($("#sunTotalNum").text());//获取阳台实际总切舱
				  seaTotalNumOld =  Number($("#seaTotalNum").text());//获取海洋实际总切舱
				  suiltTotalNumOld =  Number($("#suiltTotalNum").text());//获取套房实际总切舱
				  
				//总计的之前的数字（不会因为聚焦而影响）
				  allTotalNumOld =  Number($(".allTotalNum").find("h1:eq(0)").text().substring(6));
			      allHouseNumOld =  Number($(".allHouseNum").find("h1:eq(0)").text().substring(6));
			      
				  allTotalPersonNumOld =  Number($(".allTotalPersonNum").find("h1:eq(0)").text().substring(6));//旧的总人数
				  allHousePersonNumOld =  Number($(".allHousePersonNum").find("h1:eq(0)").text().substring(6));//旧的剩余人数
				  
				  allLimitNumOld =  Number($(".allLimitNum").find("h1:eq(0)").text().substring(5));//旧的总额度

	});
	$(".totalNum").keyup(
	  function(){
//		  alert(allTotalPersonNumOld+"---"+allHousePersonNumOld+"--"+allLimitNumOld);
		  //下面是单个的变化总间数，总剩余间数
		  var houseNum ;//新的剩余间数(根据差额算出来)
		  var totalNum = Number($(this).val());//新的总间数
		  totalNum = isNaN(totalNum)?0:totalNum;
		  var housePersonNum = parseInt($(this).parent("div").siblings(".housePersonNumDiv").find("input:eq(0)").val());//单间人数
		  var diffNum = totalNum - Number(totalNumOld);//新旧差额间数
		  houseNum = Number(houseNumOld) +diffNum;//新的剩余间数
		  
		  //下面是总计的新变化
		  if(housePersonNum >2){//新的总额
			  allLimitNumOld = allLimitNumOld +(housePersonNum-2)*diffNum
		  }

		  //修改之后的额度
		  var allTotalPersonNum = allTotalPersonNumOld+diffNum*housePersonNum;
		  var allHousePersonNum = allHousePersonNumOld+diffNum*housePersonNum;
		  var allTotalNum = allTotalNumOld+diffNum;
		  var allHouseNum = allHouseNumOld+diffNum;
		  
		  if(totalNum < 0 || houseNum < 0){
			  $(this).parent("div").siblings(".houseNumDiv").find("input:eq(0)").val(0);//单个新的剩余间数
		  }else{
			  $(this).parent("div").siblings(".houseNumDiv").find("input:eq(0)").val(houseNum);//单个新的剩余间数
			  $(".allTotalPersonNum").html("<h1>总线上人数:"+allTotalPersonNum+"</h1>");//总计新的总人数
			  $(".allHousePersonNum").html("<h1>总剩余人数:"+allHousePersonNum+"</h1>");//总计新的剩余人数
			  $(".allTotalNum").html("<h1>总线上间数:"+allTotalNum+"</h1>");//总计新的总间数
			  $(".allHouseNum").html("<h1>总剩余间数:"+allHouseNum+"</h1>");//总计新的剩余间数
			  $(".allLimitNum").html("<h1>使用额度:"+allLimitNumOld+"</h1>");//总计新的剩余间数
			  var cabin = $(this).parent("div").siblings(".cabinNameDiv").find(".cabinName option:selected").text();//单个改动的房型
		
			  if(cabin == "內舱房"){//操作的哪种房型
				  insideTotalNumOld = insideTotalNumOld+diffNum;//获取内舱实际总切舱
				  $("#insideTotalNum").text(insideTotalNumOld);
			  }
			  if(cabin == "阳台房"){//操作的哪种房型
				  sunTotalNumOld = sunTotalNumOld+diffNum;//获取阳台实际总切舱
				  $("#sunTotalNum").text(sunTotalNumOld);
			  }
			  if(cabin == "海景房"){//操作的哪种房型
				  seaTotalNumOld = seaTotalNumOld+diffNum;//获取海洋实际总切舱
				  $("#seaTotalNum").text(seaTotalNumOld);
			  }
			  if(cabin == "套房房"){//操作的哪种房型
				  suiltTotalNumOld = suitTotalNumOld+diffNum;//获取套房实际总切舱
				  $("#suitTotalNum").text(suitTotalNumOld);
			  }
			  //把所有的更改记录
			  //下面都是单个总计的
			  totalNumOld = totalNum;
			  houseNumOld =houseNum;
			 //下面都是总计的
			  allTotalNumOld = allTotalNum;//旧的总间数
			  allHouseNumOld = allHouseNum;//旧的剩余间数
			  allTotalPersonNumOld = allTotalPersonNum;//旧的总人数
			  allHousePersonNumOld = allHousePersonNum;//旧的剩余人数
			
		  }
	});
	$("#publishHouse").hide();
}
//计算剩余间数
function countNum(){
	$('#cruiseHouse').find('li').each(function() {
		var divArr = $(this).children();
		var txthousePersonNum = divArr.eq(1).find("input");
		var txthouseNum = divArr.eq(2).find("input");
		var txtpersonNum = divArr.eq(3).find("input");
		
		var housePersonNum = txthousePersonNum.val();//每间人数
		var houseNum = txthouseNum.val();//剩余房间
		if(housePersonNum !=null && housePersonNum !=''){
			if(houseNum !=null && houseNum !=''){			
				var personNum = housePersonNum * houseNum;//剩余间数
				txtpersonNum.val(Math.round(personNum));
			}
		}
	});
}

function addRow() {//新增页面
var addLi = $("#cruiseHouse");
	var optionStr = "<option>请选择</option>";
	var button = "";
	if(id == 1){
		button = "<div class='removecabin'>";
	}
	for(var i = 0; i < cabin.length;i++){
		optionStr =optionStr +'<option value="'+cabin[i].id+'">'+cabin[i].name+'</option>';
	}
	addLi.append(
		"<li>"
			+'<div class="cabin-type-name">'
			+'<h1>舱位类型：</h1>'
			+'<select name="" type="text" class="form-control cabinName" onchange="changeCabin(this)">'
		    +optionStr
			+'</select>'
			+'</div>'
			+'<div class="cabin-name">'
			+'<h1>舱位：</h1>'
			+'<select name="" type="text" class="form-control shipping-space">'
			+'</select>'
			+'</div>'
		    +"<div class='cabin cabinNum'>"+"<h1>单间人数：</h1>"
		 		+"<input type='text' class='form-control housePersonNum' placeholder='请输入单间人数'>"
		    +"</div>"
		    +"<div class='cabin cabinNum'>"+"<h1>船方切仓<font color=red>*</font>：</h1>"
		    		+"<input type='text' class='form-control cruiseTotalNum' placeholder='请输入船方切仓'>"
		    +"</div>"
		    +"<div class='cabin cabinNum'>"+"<h1>线上间数<font color=red>*</font>：</h1>"
		    +"<input type='text' class='form-control totalNum' placeholder='请输入线上间数'>"
		    +"</div>"
		    +"<div class='cabin cabinNum' style='display:none'>"+"<h1>线上剩余<font color=red>*</font>：</h1>"
		    		+"<input type='text' class='form-control houseNum'>"
		    +"</div>"
		    +"<div class='cabin cabinPrice'>"+"<h1>同行价：</h1>"
		    +"<input type='text' class='form-control traderPrice' placeholder='请输入同行价'>"
		    +"</div>"
		    +"<div class='cabin cabinPrice'>"+"<h1>规划师价：</h1>"
		    		+"<input type='text' class='form-control umPrice' placeholder='请输入规划师价'>"
		    +"</div>"
		    +"<div class='cabin cabinPrice'>"+"<h1>直客价<font color=red>*</font>：</h1>"
		    		+"<input type='text' class='form-control customerPrice' placeholder='请输入直客价'>"
		    +"</div>"
		    +button
		    +"</div>"
		+"</li>");
}

//编辑添加船舱列（模态框）
function addRow1() {
	var addLi = $("#house");
	$("#myModal_house").modal("show");
	var optionStr = "<option>请选择</option>";
	for(var i = 0; i < cabin.length;i++){
		optionStr =optionStr +'<option value="'+cabin[i].id+'">'+cabin[i].name+'</option>';
	}
	addLi.html(
			'<ul>'
			+'<li style="width: 100%;overflow: hidden;">'
			+'<div class="modal-jsmc">'
			+'<h1>舱位类型：</h1>'
			+'<select name="" type="text" style="width: 90%;" class="form-control cabinName" onchange="changeCabin1(this)">'+optionStr+'</select>'
			+'</div>'
			+'<div class="modal-jsmc">'
			+'<h1>舱位：</h1>'
			+'<select name="" type="text" style="width: 90%;"  class="form-control shipping-space"></select>'
			+'</div>'
			+'</li>'
			+'<li style="width: 100%;overflow: hidden;">'
			+'<div class="modal-jsmc">'
			+"<h1>单间人数：</h1>"
	 		+"<input type='text' class='form-control housePersonNum' placeholder='请输入单间人数'>"
			+'</div>'
			+"<div class='modal-jsmc'>"+"<h1>船方切仓<font color=red>*</font>：</h1>"
	    	+"<input type='text' class='form-control cruiseTotalNum' placeholder='请输入船方切仓'>"
	    	+"</div>"
			+'</li>'
			+'<li style="width: 100%;overflow: hidden;">'
//			+'<div class="modal-jsmc">'
//			+"<h1>剩余间数<font color=red>*</font>：</h1>"
//	    	+"<input type='text' class='form-control houseNum'  readonly='true'>"
//			+'</div> '
			+'<div class="modal-jsmc">'
			+"<h1>线上间数<font color=red>*</font>：</h1>"
			+"<input type='text' class='form-control totalNum' placeholder='请输入线上间数'>"
			+'</div>'
			+'<div class="modal-jsmc">'
			+"<h1>同行价：</h1>"
			+"<input type='text' class='form-control traderPrice' placeholder='请输入同行价'>"
			+' </div> '
			+' </li>'
			+' <li style="width: 100%;overflow: hidden;">'
			+'<div class="modal-jsmc">'
			+"<h1>规划师价：</h1>"
	    	+"<input type='text' class='form-control umPrice' placeholder='请输入规划师价'>"
			+'</div> '
			+' <div class="modal-jsmc">'
			+"<h1>直客价<font color=red>*</font>：</h1>"
	    	+"<input type='text' class='form-control customerPrice' placeholder='请输入直客价'>"
			+'</div>'
			+'</li>'
			+' <li>'
			+' </li>'
			+'</ul>'
	);
	
	$(".shipping-space",addLi).bind("change",function(){
		var me=$(this);
		var txt=me.find("option:selected").text();
			//console.log("-----9-----");
		if(txt=='手动输入'){
			//console.log("----------");
			var str='<input type="text" name="" style="width: 90%;" class="form-control shipping-space user-defined">';
			//var str='<option value="" selected="true"><input type="text" name="" style="width: 90%;" class="user-defined"></option>';
			me.after(str);
			me.remove();
		}else{
			me.parent().find(".user-defined").remove();
		}
	});
}
//编辑添加附加产品（模态框）
function toAddgoods() {
	var addLi = $("#goods");
	$("#myModal_goods").modal("show");
}	
//保存挂舱
function saveAddSpace() {
	var cabinId = "0"//添加附加产品（）
	var shippingSpaceId = "0000001"//添加附加产品（）
	var addSpaceName = "挂舱";//产品名称（shippingSpace）
	var addSpaceTotalNum = $("#addSpaceTotalNum").val();//产品数量（totalNum）
	var addSpaceNum = $("#addSpaceNum").val();//产品数量（houseNum）
	var addSpacePrice = $("#addSpacePrice").val();//产品价格（traderPrice umPrice customerPrice）

	var reg=/^\d{1,5}$/;
	var regFloat = /^[0-9]+(.[0-9]{2})?$/;
	var regTotalNmu=/^\+?[0-9][0-9]*$/;
	
	if(addSpaceName==null || addSpaceName=='') {
		Jalert('产品名称为空或不合法');
		return false;
	}
	if(addSpaceTotalNum==null || addSpaceTotalNum=='' || !regTotalNmu.test(addSpaceTotalNum)) {
		Jalert('挂舱总量为空或不合法');
		return false;
	}
	if(addSpaceNum==null || addSpaceNum=='' || !regTotalNmu.test(addSpaceNum)) {
		Jalert('挂舱剩余为空或不合法');
		return false;
	}
	if(addSpacePrice==null || addSpacePrice=='' || (!reg.test(addSpacePrice) && !regFloat.test(addSpacePrice))) {
		Jalert('挂舱价格为空或不合法');
		return false;
	}
	
	$.ajax({
		url:getContextPath()+"/resource/saveCruiseHouse.do",
		type:'post',
		data:{
			'cruiseHouse.resourceCode':code,
			'cruiseHouse.vid':id,
			'cruiseHouse.cabinId':cabinId,
			'cruiseHouse.shippingSpaceId':shippingSpaceId,
			'cruiseHouse.houseType':addSpaceName,
			'cruiseHouse.totalNum':addSpaceTotalNum,
			'cruiseHouse.housePersonNum':1,
			'cruiseHouse.houseNum':addSpaceNum,
			'cruiseHouse.umPrice':addSpacePrice,
			'cruiseHouse.traderPrice':addSpacePrice,
			'cruiseHouse.customerPrice':addSpacePrice,
			
			'cruiseHouse.totalPerson':addSpaceTotalNum,
			'cruiseHouse.personNum':addSpaceNum,

		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				updateProductVersionStatus();
				Jalert("添加成功！");
				$("#myModal_house").modal("hide");
				window.location.href =getContextPath()+'/manager/resource/addVoyage.jsp?id='+id+'&code='+code+'&cruiseId='+cruiseId+'&days='+days+'&title='+escape(title)+"&productType="+productType;

			}else{
				Jalert("系统出错，请联系管理员");
				commitRemove();
			}
		}
	});
}	
function saveGoods() {
	var cabinId = 0//添加附加产品（）
	var shippingSpaceId = 0//添加附加产品（）
	var goodsName = $("#goodsName").val();//产品名称（shippingSpace）
	var goodsTotalNum = $("#goodsTotalNum").val();//产品数量（totalNum）
	var goodsNum = $("#goodsNum").val();//产品数量（totalNum）
	var goodsPrice = $("#goodsPrice").val();//产品价格（traderPrice umPrice customerPrice）
	
	var reg=/^\d{1,5}$/;
	var regFloat = /^[0-9]+(.[0-9]{2})?$/;
	var regTotalNmu=/^\+?[0-9][0-9]*$/;
	
	if(goodsName==null || goodsName=='') {
		Jalert('产品名称为空或不合法');
		return false;
	}
	if(goodsTotalNum==null || goodsTotalNum=='' || !regTotalNmu.test(goodsTotalNum)) {
		Jalert('产品总量为空或不合法');
		return false;
	}
	if(goodsNum==null || goodsNum=='' || !regTotalNmu.test(goodsNum)) {
		Jalert('产品剩余为空或不合法');
		return false;
	}
	if(goodsPrice==null || goodsPrice=='' || (!reg.test(goodsPrice) && !regFloat.test(goodsPrice))) {
		Jalert('产品价格为空或不合法');
		return false;
	}
	
	$.ajax({
		url:getContextPath()+"/resource/saveCruiseHouse.do",
		type:'post',
		data:{
			'cruiseHouse.resourceCode':code,
			'cruiseHouse.vid':id,
			'cruiseHouse.cabinId':cabinId,
			'cruiseHouse.shippingSpaceId':shippingSpaceId,
			'cruiseHouse.houseType':goodsName,
			'cruiseHouse.totalNum':goodsTotalNum,
			'cruiseHouse.housePersonNum':1,
			'cruiseHouse.houseNum':goodsNum,
			'cruiseHouse.umPrice':goodsPrice,
			'cruiseHouse.traderPrice':goodsPrice,
			'cruiseHouse.customerPrice':goodsPrice,
			
			'cruiseHouse.totalPerson':goodsTotalNum,
			'cruiseHouse.personNum':goodsNum,

		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				updateProductVersionStatus();
				Jalert("添加成功！");
				$("#myModal_house").modal("hide");
				window.location.href =getContextPath()+'/manager/resource/addVoyage.jsp?id='+id+'&code='+code+'&cruiseId='+cruiseId+'&days='+days+'&title='+escape(title)+"&productType="+productType;
				
			}else{
				Jalert("系统出错，请联系管理员");
				commitRemove();
			}
		}
	});
}	
$("div").on('click','.editGoods',function(){
//	var cabinId = 0//添加附加产品（）
//	var shippingSpaceId = 0//添加附加产品（）
	var goodsName = $(this).parents("li").find("input:eq(0)").val();//产品名称（shippingSpace）
	var goodsTotalNum = $(this).parents("li").find("input:eq(1)").val();//产品数量（totalNum）
	var goodsNum = $(this).parents("li").find("input:eq(2)").val();//产品数量（totalNum）
	var goodsPrice = $(this).parents("li").find("input:eq(3)").val();//产品价格（traderPrice umPrice customerPrice）
	var cruiseHouseId = $(this).parents("li").find("input:eq(4)").val();//产品价格（traderPrice umPrice customerPrice）
	
	var reg=/^\d{1,5}$/;
	var regFloat = /^[0-9]+(.[0-9]{2})?$/;
	var regTotalNmu=/^\+?[0-9][0-9]*$/;
	
	if(goodsName==null || goodsName=='') {
		Jalert('产品名称为空或不合法');
		return false;
	}
	if(goodsTotalNum==null || goodsTotalNum=='' || !regTotalNmu.test(goodsTotalNum)) {
		Jalert('产品总量为空或不合法');
		return false;
	}
	if(goodsNum==null || goodsNum=='' || !regTotalNmu.test(goodsNum)) {
		Jalert('产品剩余为空或不合法');
		return false;
	}
	if(goodsPrice==null || goodsPrice=='' || (!reg.test(goodsPrice) && !regFloat.test(goodsPrice))) {
		Jalert('产品价格为空或不合法');
		return false;
	}
	$.ajax({
		 url:getContextPath()+"/resource/editCruiseHouse.do",
		 type:'post',
		 data:{'cruiseHouse.id':cruiseHouseId,
			'cruiseHouse.houseType':goodsName,
			'cruiseHouse.totalNum':goodsTotalNum,
			'cruiseHouse.houseNum':goodsNum,
			'cruiseHouse.umPrice':goodsPrice,
			'cruiseHouse.traderPrice':goodsPrice,
			'cruiseHouse.customerPrice':goodsPrice
		 },
		 dataType:'json',
			 success:function(data){
				 if(data.success==1){
					 updateProductVersionStatus();
					Jalert("修改成功！");
				 }else{
					Jalert("系统出错，请联系管理员");
					commitRemove();
				 }
			 }
		 });
});	
//发布船舱
function publishHouse() {
	var startDate = $("#startDate").val();
	if(startDate == null || startDate ==""){
		Jalert("选择出发时间");
		return false;
	}
	var date  = new Date(startDate);
	date.setDate(date.getDate()+parseInt(days));
	var endDate = date.Format("yyyy-MM-dd");
	var versionTitle = $("#title").val();
	var wayCity=$("#wayCity").val();
	var crusieLimit=$("#crusieLimit").val();
	if(crusieLimit == null || crusieLimit ==""){
		Jalert("选择船方额度");
		return false;
	}
//	var description = $("#description").val();
	$("#publishHouse").attr("onclick","");
	//将页面信息组装到对象数组中
	var array=[];
	var canCommit = false;
	var reg=/^\d{1,5}$/;
	var regFloat = /^[0-9]+(.[0-9]{2})?$/;//只能输入有两位小数的正实数
	var regTotalNmu=/^\+?[0-9][0-9]*$/;
	$('#cruiseHouse li').each(function(ix, el) {
		//如果当前行的舱型不为空，就循环每个div
		var cabinId = $(this).find('div').eq(0).find('.cabinName option:selected').val();//舱型id
		var cabinName = $(this).find('div').eq(0).find('.cabinName option:selected').text();//舱型名称
		if(cabinId == '' || cabinId == null || cabinId == "请选择") {
			Jalert('请选择舱型信息');
			return false;
		}else{  //如果舱型不为空
			//舱位
			var shippingSpaceId =  $(this).find('div').eq(1).find('.shipping-space option:selected').val();//舱位id
			//舱位
			var shippingSpace = $(this).find('div').eq(1).find('.shipping-space option:selected').text();//舱位名称
			//单间人数
			var housePersonNum = $(this).find('div').eq(2).find('input[type=text]').val().trim();
			//原切舱总间数
			var cruiseTotalNum = $(this).find('div').eq(3).find('input[type=text]').val().trim();
			//切舱总间数
			var totalNum = $(this).find('div').eq(4).find('input[type=text]').val().trim();
			//剩余房间数
			var houseNum = $(this).find('div').eq(4).find('input[type=text]').val().trim();
			//同行价
			var traderPrice = $(this).find('div').eq(6).find('input[type=text]').val().trim();
			//规划师价
			var umPrice = $(this).find('div').eq(7).find('input[type=text]').val().trim();
			//直客价
			var customerPrice = $(this).find('div').eq(8).find('input[type=text]').val().trim();
		
			//切舱总人数
			var total_person = housePersonNum*totalNum;
			//剩余人数
			var person_num = housePersonNum*houseNum;

			if(housePersonNum==null || housePersonNum=='' || !reg.test(housePersonNum)) {
				Jalert('单间人数为空或不合法');
				canCommit = false;
				return false;
			}
			if(totalNum==null || totalNum=='' || !regTotalNmu.test(totalNum)) {
				Jalert('线上间数为空或不合法');
				canCommit = false;
				return false;
			}
			if(cruiseTotalNum==null || cruiseTotalNum=='' || !regTotalNmu.test(cruiseTotalNum)) {
				Jalert('船方切仓为空或不合法');
				canCommit = false;
				return false;
			}
//			if(houseNum==null || houseNum=='' || !reg.test(houseNum)||parseInt(totalNum) < parseInt(houseNum)) {
//				Jalert('剩余间数为空或不合法');
//				canCommit = false;
//				return false;
//			}

			if(umPrice==null || umPrice=='' || (!reg.test(umPrice) && !regFloat.test(umPrice))) {
				Jalert('规划师价为空或不合法');
				canCommit = false;
				return false;
			}
			if(traderPrice==null || traderPrice=='' || (!reg.test(traderPrice) && !regFloat.test(traderPrice))) {
				Jalert('同行价为空或不合法');
				canCommit = false;
				return false;
			}
			if(customerPrice==null || customerPrice=='' || (!reg.test(customerPrice) && !regFloat.test(customerPrice))) {
				Jalert('直客价为空或不合法');
				canCommit = false;
				return false;
			}
			canCommit = true;
			
			var cruiseHouse={};
			cruiseHouse.cruiseId = cruiseId;
			cruiseHouse.cabinId = cabinId;
			cruiseHouse.cabinName = cabinName;
			cruiseHouse.shippingSpaceId = shippingSpaceId;
			cruiseHouse.houseType = shippingSpace;
			cruiseHouse.totalPerson = total_person;
			cruiseHouse.personNum = person_num;
			cruiseHouse.housePersonNum = housePersonNum;
			cruiseHouse.totalNum = totalNum;
			cruiseHouse.cruiseTotalNum = cruiseTotalNum;
			cruiseHouse.houseNum = houseNum;
			cruiseHouse.umPrice = umPrice;
			cruiseHouse.traderPrice = traderPrice;
			cruiseHouse.customerPrice = customerPrice;
			cruiseHouse.resourceCode=code;
			array.push(cruiseHouse);
		}
	});
	if(!canCommit) {
		$("#publishHouse").attr("onclick","publishHouse()");
		return false;
	} else {
		commitBodyWait();
		$.ajax({
			url:getContextPath()+"/resource/publishHouse.do",
			data:{
				  "productVersion.resCode":code,
				  "productVersion.title":versionTitle,
				  "productVersion.startDate":startDate,
				  "productVersion.endDate":endDate,
				  "productVersion.wayCity":wayCity,
				  "productVersion.crusieLimit":crusieLimit,
				  "data":JSON.stringify(array),
				  },
			traditional: true,
			type:'post',
			dataType:'json',
			success:function(data) {
				if(data.success==1) {
					if(id == 1 ) {
						Jalert("航次添加成功");

					}else{
		    			alert("航次编辑成功！");
		    		}
					toResourceVersion();
				}else{
					$("#publishHouse").attr("onclick","publishHouse()");
					Jalert("发布失败,请联系管理员");
				}
			}
		});
	}
}
/**
 * 修改航期
 */
function updateProductVersion(id){
	var startDate = $("#startDate").val();
	var title = $("#title").val();
	var wayCity = $("#wayCity").val();
	var crusieLimit = $("#crusieLimit").val();
	var description = $("#description").val();
	var date  = new Date(startDate);
	date.setDate(date.getDate()+parseInt(days));
	var endDate = date.Format("yyyy-MM-dd");
	$.ajax({
		url:getContextPath()+"/resource/updateProductVersion.do",
		type:'post',
		data:{'productVersion.id':id,
			  'productVersion.startDate':startDate,
			  'productVersion.endDate':endDate,
			  'productVersion.title':title,
			  'productVersion.crusieLimit':crusieLimit,
			  "productVersion.wayCity":wayCity

		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				Jalert("航期修改成功！");
			}else{
				Jalert("系统出错，请联系管理员");
				commitRemove();
			}
		}
	});
}
/**
 * 修改航次舱型信息
 */

$("div").on('click','.editCruiseHouse',function(){
	var cruiseHouseId = $(this).prev().val();
	var divArr = $(this).parent(".baocunversion").parent().children();
	var housePersonNum = divArr.eq(2).find("input").val();
	var cruiseTotalNum = divArr.eq(3).find("input").val();
	var totalNum = divArr.eq(4).find("input").val();
	var houseNum = divArr.eq(5).find("input").val();
	var traderPrice = divArr.eq(6).find("input").val();
	var umPrice = divArr.eq(7).find("input").val();
	var customerPrice = divArr.eq(8).find("input").val();
	var regTotalNmu=/^\+?[0-9][0-9]*$/;
	if(Number(totalNum) < Number(houseNum)){
		Jalert("线上剩余不能大于线上间数");
		return false;
	}
	if(cruiseTotalNum==null || cruiseTotalNum=='' || !regTotalNmu.test(cruiseTotalNum)) {
		Jalert('船方切仓为空或不合法');
		return false;
	}
	if(totalNum==null || totalNum=='' || !regTotalNmu.test(totalNum)) {
		Jalert('线上间数为空或不合法');
		return false;
	}
	var totalPerson = housePersonNum*totalNum;
	var personNum = housePersonNum*houseNum;
	$.ajax({
	 url:getContextPath()+"/resource/editCruiseHouse.do",
	 type:'post',
	 data:{'cruiseHouse.id':cruiseHouseId,
	 'cruiseHouse.cruiseTotalNum':cruiseTotalNum,
	 'cruiseHouse.totalNum':totalNum,
	 'cruiseHouse.houseNum':houseNum,
	 'cruiseHouse.totalPerson':totalPerson,
	 'cruiseHouse.personNum':personNum,
	 'cruiseHouse.umPrice':umPrice,
	 'cruiseHouse.traderPrice':traderPrice,
	 'cruiseHouse.customerPrice':customerPrice,
	 },
	 dataType:'json',
		 success:function(data){
			 if(data.success==1){
				 updateProductVersionStatus();
				Jalert("修改成功！");
			 }else{
				Jalert("系统出错，请联系管理员");
				commitRemove();
			 }
		 }
	 });
});
/**
 *修改班期状态
 */
function updateProductVersionStatus(){
	$.ajax({
		url:getContextPath()+"/resource/updateProductVersion.do",
		type:'post',
		data:{
			'productVersion.id':id,
			'productVersion.status':0
		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
			}else{
				Jalert("系统出错，请联系管理员");
				commitRemove();
			}
		}
	});
}

/**
 * 添加舱型（模态框）
 */
function addCruiseHouse(){
	var liArr = $("#addHouse").parent("div").siblings("div:eq(1)");//舱型信息
	var cabinId = liArr.find("li:eq(0)").find('.cabinName option:selected').val();//舱型id
	var cabinName = liArr.find("li:eq(0)").find('.cabinName option:selected').text();//舱型名称
	
	var userDefined=liArr.find("li:eq(0)").find('.user-defined');
	if(userDefined && userDefined.val()){
		var shippingSpaceId = '0000000';//舱位id
		var shippingSpace = userDefined.val();//舱位名称
	}else{
		var shippingSpaceId =  liArr.find("li:eq(0)").find('.shipping-space option:selected').val();//舱位id
		var shippingSpace = liArr.find("li:eq(0)").find('.shipping-space option:selected').text();//舱位名称
	}
	var housePersonNum = liArr.find("li:eq(1)").find(".housePersonNum").val();
	var cruiseTotalNum = liArr.find("li:eq(1)").find(".cruiseTotalNum").val();
	var totalNum = liArr.find("li:eq(2)").find(".totalNum").val();
	var houseNum = totalNum;
	var traderPrice = liArr.find("li:eq(2)").find(".traderPrice").val();
	var umPrice = liArr.find("li:eq(3)").find(".umPrice").val();
	var customerPrice = liArr.find("li:eq(3)").find(".customerPrice").val();
	
	if(shippingSpaceId!='0000000')
	if(checkCruiseHouseIsExit(id,shippingSpaceId)){
		Jalert("本航次已存在此种舱位");
		return;
	}
	if(shippingSpace=='请选择'){
		Jalert("请选择舱位");
		return ;
	}
	if(Number(totalNum) < Number(houseNum)){
		Jalert("剩余间数不能大于线上间数");
		return false;
	}
	var totalPerson = housePersonNum*totalNum;
	var personNum = housePersonNum*houseNum;
	var reg=/^\d{1,5}$/;
	var regFloat = /^[0-9]+(.[0-9]{2})?$/;
	var regTotalNmu=/^\+?[0-9][0-9]*$/;
	if(housePersonNum==null || housePersonNum=='' || !reg.test(housePersonNum)) {
		Jalert('单间人数为空或不合法');
		return false;
	}
	if(cruiseTotalNum==null || cruiseTotalNum=='' || !regTotalNmu.test(cruiseTotalNum)) {
		Jalert('船方切仓为空或不合法');
		return false;
	}
	if(totalNum==null || totalNum=='' || !regTotalNmu.test(totalNum)) {
		Jalert('线上间数为空或不合法');
		return false;
	}
//	if(houseNum==null || houseNum=='' || !reg.test(houseNum)||parseInt(totalNum) < parseInt(houseNum)) {
//		Jalert('剩余间数为空或不合法');
//		return false;
//	}
	if(umPrice==null || umPrice=='' || (!reg.test(umPrice) && !regFloat.test(umPrice))) {
		Jalert('规划师为空或不合法');
		return false;
	}
	if(traderPrice==null || traderPrice=='' || (!reg.test(traderPrice) && !regFloat.test(traderPrice))) {
		Jalert('同行价为空或不合法');
		return false;
	}
	if(customerPrice==null || customerPrice=='' || (!reg.test(customerPrice) && !regFloat.test(customerPrice))) {
		Jalert('直客价为空或不合法');
		return false;
	}

	$.ajax({
		url:getContextPath()+"/resource/saveCruiseHouse.do",
		type:'post',
		data:{
			'cruiseHouse.resourceCode':code,
			'cruiseHouse.vid':id,
			'cruiseHouse.cruiseId':cruiseId,
			'cruiseHouse.cabinId':cabinId,
			'cruiseHouse.cabinName':cabinName,
			'cruiseHouse.shippingSpaceId':shippingSpaceId,
			'cruiseHouse.houseType':shippingSpace,
			'cruiseHouse.housePersonNum':housePersonNum,
			'cruiseHouse.cruiseTotalNum':cruiseTotalNum,
			'cruiseHouse.totalNum':totalNum,
			'cruiseHouse.houseNum':houseNum,
			'cruiseHouse.totalPerson':totalPerson,
			'cruiseHouse.personNum':personNum,
			'cruiseHouse.umPrice':umPrice,
			'cruiseHouse.traderPrice':traderPrice,
			'cruiseHouse.customerPrice':customerPrice,
		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				updateProductVersionStatus();
				Jalert("添加成功！");
				$("#myModal_house").modal("hide");
				window.location.href =getContextPath()+'/manager/resource/addVoyage.jsp?id='+id+'&code='+code+'&cruiseId='+cruiseId+'&days='+days+'&title='+escape(title)+"&productType="+productType;

			}else{
				Jalert("系统出错，请联系管理员");
				commitRemove();
			}
		}
	});
}

/**
 * 检查该航次是否已存在此中舱位
 */
function checkCruiseHouseIsExit(vid,shippingSpaceId){
	var flag = true;
	$.ajax({
		url:getContextPath()+"/resource/checkCruiseHouseIsExit.do",
		type:'post',
		async:false,
		data:{
			'cruiseHouse.vid':vid,
			'cruiseHouse.shippingSpaceId':shippingSpaceId,
		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				if(data.datas == 0){
					flag = false;
				}

			}else{
				flag = false;
				Jalert("系统出错，请联系管理员");
				commitRemove();
			}
		}
	});
	return flag;
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

    //取消触发不同页面（version.jsp  ckhq.jsp）
    if(type == "version"){
    	window.location.href=getContextPath()+"/manager/resource/version.jsp";
    }else{
    	window.location.href=getContextPath()+"/manager/resource/ckhq.jsp?code="+code+"&cruiseId="+cruiseId+"&title="+escape(title)+"&days="+days+"&productType="+productType+"&str=proSearch";
    }
}
