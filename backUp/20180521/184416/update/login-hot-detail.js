var code = getUrlParam("code");
var cruiseId = getUrlParam("cruiseId");
var from = getUrlParam("from");
var productType = getUrlParam("productType");
var ctx = getContextPath();
var UPLOAD_RESOURCE_IMG = '/upload/resource/img/';
var buyArray,resourceName,totalPrice,providerCode,providerName;
var vid,title;
var x;
var y;
var z;
var s;
function load() {
    showDetail();
    //showSchedule();
    showProductIsHot();
    var id = getUrlParam('vid');
    voyageList(code,id,1);
    totalSize();
}

//生成热门产品推荐
function showProductIsHot(){
    $.ajax({
        url:getContextPath()+"/resource/searchResourceVersionListToProduce.do",
        type:'post',
        data:{
            'pager.pageNum':1,
            'pager.pageSize':9,
            'productVersion.cabinId':1,
			'productVersion.generalHot':1,
			'productVersion.status':1
           // 'resource.isHot':1,
           // 'resource.status':1,
           //'resource.showLevel':1
        },
        dataType:'json',
        success:function(data){
            if(data.success==1){
                renderList(data.datas);
            }else{
                Jalert(data.msg);                                     
            }
        }
    });
}

function renderList(datas){
    var list = '';
    for(var i = 0; i < datas.length; i++){
        list =list +
        '<li>'+
        '<img src="'+getContextPath()+UPLOAD_RESOURCE_IMG+datas[i].picPath+'">'+
        '<h1><a href="'+ctx+'/index/login-hot-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruiseId+'&vid='+datas[i].id+'&from=51Cruise" target="_blank">'+datas[i].title+'</a></h1>'+
        '<span class="detail-menu-price">￥'+datas[i].minPrice+'元/人起</span>'+
        '</li>'
    }
    $('#productList').html(list);
}

//班期行程安排
function showSchedule(vid){
    var type = 0;
    $.ajax({
        url: getContextPath() + '/resource/searchSchedule.do',
        type: 'post',
        async: false,
        data: {
            'scheDescribe.resourceCode':code,
            'scheDescribe.vid':vid
        },
        async:false,
        dataType: 'json',
        success: function(data) {
            if(data==null || data.datas==null) return;
            if(data.success == 1) {
                if(data.datas.length > 0){
                    rendScheduleList(data);
                    type = 1;
                }
            } else {
                Jalert('获取失败, code:' + data.msg);
            }
        }
    });
    return type;
}

//产品行程安排
function showProductSchedule(type){
    $.ajax({
        url: getContextPath() + '/resource/searchSchedule.do',
        type: 'post',
        async: false,
        data: {
            'scheDescribe.resourceCode':code,
            'scheDescribe.type':type,
        },
        dataType: 'json',
        success: function(data) {
            if(data==null || data.datas==null) return;
            if(data.success == 1) {
                rendScheduleList(data);
            } else {
                Jalert('获取失败, code:' + data.msg);
            }
        }
    });
}
//行程安排
function rendScheduleList(data){
    var datas = data.datas;
    var list = '';
    var breakfast = '';
    var lunch = '';
    var dinner = '';
    var hotel = '';
    for(var i = 0; i< datas.length; i++){
        list = list + '<div class="anchor" id="xcts"></div>'
            +'<div class="detail-days">'
            +'<h1>第'+datas[i].days_order+'天<span>'+datas[i].title+'</a></span></h1>'
            +'<p>'+datas[i].outline+'</p>'
            +'<br/>';
                //是否包含早餐，1：包含，0：不包含
                if(datas[i].breakfast == 1){
                    breakfast = '早餐（√）'
                }else{
                    breakfast = '早餐（×）'
                }
                if(datas[i].lunch == 1){
                    lunch = '午餐（√）'
                }else{
                    lunch = '午餐（×）'
                }
                if(datas[i].dinner == 1){
                    dinner = '晚餐（√）'
                }else{
                    dinner = '晚餐（×）'
                }
                //住宿，1：邮轮，0：酒店
                if(datas[i].hotel == 1){
                    hotel = '邮轮'
                }else{
                    hotel = '酒店'
                }
            list = list +'<p>餐食：'+breakfast+'&nbsp;'+lunch+'&nbsp;'+dinner+'&nbsp; 住宿：'+hotel+'</p>';
                    if(datas[i].pic1 != 'undefined' && datas[i].pic1 !='' && datas[i].pic1 != null){
                     list =   list +'<img src="'+getContextPath()+UPLOAD_RESOURCE_IMG+datas[i].pic1+'" onMouseOver="toolTip(\''+getContextPath()+UPLOAD_RESOURCE_IMG+datas[i].pic1+'\')" onMouseOut="toolTip()">'
                    }

        list = list +'</div>'
    }
    $("#schedule").html(list);
    var scheduleHeight = $("#schedule").height();
    x =scheduleHeight;
}

//查看详情
function showDetail(){
    $.ajax({
        url: getContextPath() + '/resource/searchDetail.do',
        type: 'post',
        async: false,
        data: {
            'resource.code':code,
            'resource.cruiseId':cruiseId
        },
        dataType: 'json',
        success: function(data) {
            if(data==null || data.datas==null) return;
            if(data.success == 1) {
                rendList(data);
                rendCruiseDetail(data);
            } else {
                Jalert('获取失败, code:' + data.msg);
            }
        }
    });
}
function rendList(data){
    var datas = data.datas;
    $(".detail-title").html(datas.title);
    var imgList = '';
    if(typeof(datas.pic_path) == 'undefined'){
        imgList = imgList + '<img src="'+getContextPath()+UPLOAD_RESOURCE_IMG+'list_1.jpg" />'
    }else {
        imgList = imgList + '<img src="'+getContextPath()+UPLOAD_RESOURCE_IMG+datas.pic_path+'" style="display: inline;">'
    }
    $("#bigImgBox").html(imgList);
    var list = "<h3>单价: <span>￥</span><span style='color: #ff7f05' id='minHousePrice'></span><small>起/人</small></span> </h3>";
    /*if(typeof (datas.price) == 'number'){
        list = list +'<h3>单价: <span><b>￥</b>'+datas.price+'<small>起/人</small></span> </h3>';
    }
   else if(typeof (datas.trader_price) == 'number'){

        list = list +'<h3>单价: <span><b>￥</b>'+datas.trader_price+'<small>起/人</small></span> </h3>';
    }
    else {
        list = list +'<h3>单价: <span><b>￥</b>'+datas.um_price+'<small>起/人</small></span> </h3>';
    }*/

   list = list +'<div><ul>'
        +'<li class="cf_city">出发城市：'+datas.start_city+'</li>'
        +'<li class="xc_day">行程天数：'+datas.days+'天</li>'
        +'<li class="md_di">目的地：' +datas.end_city+ '</li>'
        +'<li class="yl_gs">邮轮公司：' +datas.cruise_company+"-"+datas.name+ '</li>'
        +'<li style="padding: 0;"><span class="glyphicon glyphicon-calendar" style="margin: 0 4px;color: #666;"></span>'/*班期：<input style="width: 100px;" value="">' */
        +' 班期：<span id="hq"><select class="hangqi"></select> </span>'
        +'</li>'
        +'</ul>'
        +'<div class="index-supplier-content-top" style="border: none;">'
        +'<span>首航：'+datas.first_flight+'年</span>'
        +'<span>楼层：'+datas.floor+'层</span><br>'
        +'<span>总重：'+datas.weight+'吨</span>'
        +'<span>载客：'+datas.guests+'人</span>'
        +'</div>'
        +'</div>'


    +'<input data-toggle="modal" value="立即预定" type="submit" class="yuding-btn" onclick=\"showInfo(\''+escape(JSON.stringify(datas))+'\')\"/>';
    $(".xq_text_top").html(list);
    //预订须知
    var reservation = '';
    if(typeof (datas.reservation) == 'undefined'){
        reservation = reservation+'<p><div id="No_Result" style="width: 100%; height: 30px; background: rgba(0, 0, 0, 0) url(&quot;/eyoub2b/resource/img/exclamation.png&quot;) no-repeat scroll left center / 30px auto; padding-left: 36px; line-height: 25px;">暂无相关数据！</div></p>'
    }else{
        reservation = reservation+'<p>'+datas.reservation+'</p>'
    }

    $(".text_box").html(reservation);
    //费用说明
    var price_contain = '';
    if(typeof (datas.price_contain) == 'undefined'){
        price_contain = price_contain+'<p><div id="No_Result" style="width: 100%; height: 30px; background: rgba(0, 0, 0, 0) url(&quot;/eyoub2b/resource/img/exclamation.png&quot;) no-repeat scroll left center / 30px auto; padding-left: 36px; line-height: 25px;">暂无相关数据！</div></p>'
    }else{
        price_contain = price_contain +'<p>'+datas.price_contain+'</p>'
    }
    $(".fysm_box").html(price_contain);
    var text_boxHeight = $(".text_box").height();
    y = text_boxHeight;
    var fysm_boxHeight = $(".fysm_box").height();
    z = fysm_boxHeight;
}
//展示航班号详情
function rendCruiseDetail(resource){
	var cruiseDetail = resource.datas;
	var flightNumId = cruiseDetail.flight_num_id;
	if(flightNumId == "" || flightNumId == undefined){
		$("#cruiseDetail").html("");
	}else{
		$.ajax({
			url:getContextPath()+"/resource/searchFlightNum.do",
			type:'post',
			data:{
				'resource.flightNumId':flightNumId
			},
			dataType:'json',
			success: function(data) {
				if(data==null || data.datas==null) return;
				var list = "";
				if(data.success == 1){
					var datas = data.datas;
					for(var i = 0; i < datas.length; i++){
						list = list+
						'<span>首航：'+datas[i].first_flight+'年</span>'+
						'<span>楼层：'+datas[i].floor+'层</span><br/>'+
						'<span>总重：'+datas[i].weight+'吨</span>'+
						'<span>载客：'+datas[i].guests+'人</span>';
					}
				}
				$("#cruiseDetail").html(list);
			}
		});
	}
}
/**
 * 显示房型信息
 */
function showInfo(data){
        var dt = JSON.parse(unescape(data));
        var code = dt.code;
        resourceName = dt.title;
        providerCode = dt.provider_code;
        providerName = dt.provider_name;
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
                    for(var i=0; i<datas.length; i++) {
                        list =list
                            +'<tr>'
                            +'<td class="yuding-name">'+datas[i].house_type+'</td>'
                            +'<td id="price">'+datas[i].price+'</td>'
                            +'<td id="house_num">'+datas[i].house_person_num+'</td>'
                            +'<td id="Person_num">'+datas[i].house_num+'</td>'
                            +'<td id="num">'+datas[i].person_num+'</td>'
                            +'<td><div class="addreduce"><span class="reduce reducePerson"></span><input id="addNum" class="addnumber"  type="text" value="0" onchange="regFun()" oninput="regFun()" onblur="setDefautVal()"/><span class="add addPerson"></span></div></td>'
                            +'<td><div class="addreduce"><span class="reduce reduceHouse"></span><input id="addHouseNum" class="addnumber"  type="text" value="0"/><span class="add addHouse"></span></div></td>'
                            +'<input type="hidden" value="'+datas[i].id+'"/>'
                            +'<input type="hidden" value="'+datas[i].resource_code+'"/>'
                            +'<input type="hidden" value="'+datas[i].versionFlag+'"/>'
                            +'<input type="hidden" value="'+datas[i].house_person_num+'"/>'
                            +'<input type="hidden" value="'+datas[i].house_num+'"/>'
                            +'</tr>'
                    }
                    $('#houseList').html(list);
                    if(datas.length > 0){
                        $('#myModal_yuding').modal('show');
                    }else{
                        Jalert("本产品暂无可预订班期");
                    }

                    //加人数
                    $(".addPerson").click(
                        function(){
                            var housePersonNum = parseInt($(this).parents("tr").find("td:eq(2)").html());//单间人数
                            var houseNum = parseInt($(this).parents("tr").find("td:eq(3)").html());//剩余房间数
                            var personNum = parseInt($(this).parents("tr").find("td:eq(4)").html());//剩余人数
                            var addVal=parseInt($(this).prev("#addNum").val());
                            addVal++;
                            //所需房间数
                            var num = 0;
                            if(addVal % housePersonNum == 0){
                                num = addVal/housePersonNum;
                            }else{
                                num = parseInt(addVal/housePersonNum)+1;
                            }

                            $(this).prev("#addNum").val(addVal);//预定人数
                            $(this).parents("td").next().find("#addHouseNum").val(num);//所需房间数

                            if(addVal > personNum){
                                Jalert("请产品余量不足!");
                                $(this).parent().find("#addNum").val(personNum);
                                $(this).parents("td").next().find("#addHouseNum").val(personNum/housePersonNum);//所需房间数
                            }
                            regFun();
                        });

                    $(".reducePerson").click(
                        function(){
                            var housePersonNum = parseInt($(this).parents("tr").find("td:eq(2)").html());//单间人数
                            var addVal=parseInt($(this).next("#addNum").val());
                            if(addVal > 0) addVal--;
                            $(this).next("#addNum").val(addVal);
                            var num = 0;
                            if(addVal % housePersonNum == 0){
                                num = addVal/housePersonNum;
                            }else{
                                num = parseInt(addVal/housePersonNum)+1;
                            }
                            $(this).parents("td").next().find("#addHouseNum").val(num);//所需房间数
                            regFun();
                        });


                    commitRemove();
                } else {
                    Jalert('获取失败, code:' + data.msg);
                }
            }
        });

}

//input失去焦点时如果值为空或不是数字设置默认值为0
function setDefautVal(){

    var val = $('.addnumber').val();
    if(val == '' || typeof(val) == null ){
        $('.addnumber').val(0);
        $('.price-color').text(0);
    }
}

//验证提交的数据
function regFun(){
    buyArray = [];
    totalPrice = 0;
    $("#houseList").find("tr").each(function(){
        var tdArr = $(this).children();
        //舱型
        var house_type = tdArr.eq(0).html();

        //价格
        var price = tdArr.eq(1).html();
        //每间房住多少人
        var house_person_num = tdArr.eq(2).html();
        //剩余房间数
        var house_num = tdArr.eq(3).html();
        //剩余人数
        var person_num = parseInt(tdArr.eq(4).html());
        // 预定人数
        var num = parseInt(tdArr.eq(5).find("input").val());

        if(num % house_person_num == 0){
            var  houseNum = num/house_person_num;
        }else{
            houseNum = parseInt(num/house_person_num)+1;
        }
        tdArr.eq(6).find("input").val(houseNum);
        houseNum = parseInt(tdArr.eq(6).find("input").val());
        //邮轮舱型id
        var cruise_house_id = tdArr.eq(7).val();
        //资源编号
        var resource_code = tdArr.eq(8).val();
        //版本
        var versionFlag = tdArr.eq(9).val();
        //totalPrice +=price*houseNum*house_person_num;
        var aa = Decimal.mul(price,houseNum*house_person_num);
        totalPrice = Decimal.add(totalPrice,aa);
        if(houseNum > house_num){
            Jalert("请产品余量不足!");
            tdArr.eq(3).find("input").val(0);
        }
        if(num > 0){
            var obj = {};
            obj.resourceCode = resource_code;
            obj.providerCode = providerCode;
			obj.providerName = providerName;
            obj.houseId = cruise_house_id ;
            obj.stockPrice = price;
            obj.opNum = houseNum;
            obj.housePersonNum = house_person_num;//单间人数
            obj.opPersonNum = num;
            obj.versionFlag = versionFlag;
            buyArray.push(obj);
        }

    });

    $(".price-color").text(number_format(totalPrice,2,"."));
}

//提交订单
function submitOrder(){
    if($(".price-color").text() == '' || $(".price-color").text() == 0.00){
        Jalert("请选择预定人数!");
        return false;
    }
    //联系人
    var contact = $("#contact").val();
    var contactReg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
    if(!contactReg.test(contact)){
        Jalert("请输入联系人姓名!");
        return false;
    }

    //联系人电话
    var contactTel = $("#contactTel").val();
    var contactTelReg =/^1[0-9]{10}$/;
    if(!contactTelReg.test(contactTel)){
        Jalert("请输入正确的手机号!");
        return false;
    }
    //邮箱
    var email = $("#email").val();
    var emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    if(!emailReg.test(email)){
        Jalert("请输入正确的邮箱");
        return false;
    }

    $.ajax({
        url: getContextPath() + '/order/bookCruiseResource.do',
        type: 'post',
        data:{
            'buyArray': JSON.stringify(buyArray),
            'order.resCode':code,
            //'order.resName': resourceName,
            'order.resName': $(".detail-title").text(),
            'order.vid':vid,
            'order.providerName': providerName,
            'order.providerCode': providerCode,
            'order.category':2,
            'order.categorySub':21,
            'order.customerType':1,
            'order.contact':contact,
            'order.contactPhone':contactTel,
            'order.email':email,
            'order.payPrice': 0,
            'order.status':1,
            'order.price':totalPrice+'',
            'order.partnerCode':from
        },
        dataType:'json',
        success: function(data) {
            if(data.success == 1) {
                alert('预定成功！');
            } else {
                alert('预定失败, 请稍后重试');
            }
            $("#contact").val('');
            $("#contactTel").val('');
            $("#email").val('');
            $(".price-color").text('');
            load();
            //关闭弹出框
            $('#myModal_yuding').modal('hide');

            $('#btn_buy').attr('onclick', 'submitOrder();');
            commitRemove();
        }
    });
}

/**
 * 班期列表
 */
function voyageList(rescode,id,pageNum){
    $.ajax({
        url:getContextPath()+"/resource/searchVoyageList.do",
        type:'post',
        data: {'resource.code':rescode,
            'resource.status':1,
            'resource.productStatus':1,
            'pager.pageNum': pageNum,
            'pager.pageSize': 10
        },
        dataType:'json',
        success:function(data){
            if(data.success==1){
                if(data.datas == null || data.datas.length == 0) {
                    $('#hq').html("暂无班期");
                    $('#minHousePrice').html("--");

                } else {
                    voyageData =data.datas;
                    rendVoyageList(data.datas,id);
                }
            }else{
                Jalert(data.msg);
            }
        }
    })
}

function rendVoyageList(data,id){
    title = $(".detail-title").text();
    var startDate;
    var list = '';
    var type = 0;
    if(id != '' && id != null){
        for(var i = 0; i < data.length; i++){
            if(id == data[i].id){
                list = list+"<option id='"+data[i].id+"' value='"+data[i].id+"' selected='selected'>"+data[i].startDate+"</option>";
                startDate = data[i].startDate;
            }else{
                list = list+"<option id='"+data[i].id+"' value='"+data[i].id+"'>"+data[i].startDate+"</option>";
            }
        }
        $(".hangqi").html(list);
        $("#hq").append('本产品共<span>'+data.length+'</span>个班期');
        minHousePrice(id);
        $(".detail-title").text(startDate+title);
        vid = id;
        type = showSchedule(vid);
        if(type == 0){
            showProductSchedule(0);
        }
    }/*else{
        for(var i = 0; i < data.length; i++){
            startDate = data[0].startDate;
            vid = data[0].id;
            list = list+"<option id='"+data[i].id+"' value='"+data[i].id+"'>"+data[i].startDate+"</option>";
        }
        $(".hangqi").html(list);
        $("#hq").append('本产品共<span>'+data.length+'</span>个班期');
        minHousePrice(vid);

        $(".detail-title").text(startDate+title);
        type = showSchedule(vid);
        if(type == 0){
            showProductSchedule(0);
        }
    }*/


    $(".hangqi").change(function(){
        $(".detail-title").text("");
        vid = this.value;
        var time = $("#"+vid).text();
        var hq_title =time+" "+title;
        $(".detail-title").text(hq_title);
        minHousePrice(vid);
        type = showSchedule(vid);
        if(type == 0){
            showProductSchedule(0);
        }
    })
}



//获取航期房型最低价
function minHousePrice(vid){
    $.ajax({
        url:getContextPath()+"/resource/getMinHousePriceByVid.do",
        type:'post',
        data: {"productVersion.id":vid,
            'productVersion.cabinId':1
        },
        dataType:'json',
        success:function(data){
            if(data.success==1){
                if(data.datas == null || data.datas.length == 0) {
                    $('#minHousePrice').html("---");

                } else {
                    $('#minHousePrice').html(data.datas);
                }
            }else{
                Jalert(data.msg);
            }
        }
    })
}


//计算总高度
function totalSize(){
    s = (x+y+z)*1+710;
    $(window.parent.document).find("#myiframe").height(s);
}

