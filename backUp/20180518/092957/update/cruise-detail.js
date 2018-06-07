var code = getUrlParam("code");
var cruiseId = getUrlParam("cruiseId");
var from = getUrlParam("from");
var productType = getUrlParam("productType");
//var addSpace_price = getUrlParam("addSpace_price");
//var insurance_price = getUrlParam("insurance_price");
var ctx = getContextPath();
var UPLOAD_RESOURCE_IMG = '/upload/resource/img/';
var currendData,orderInfo,providerName,providerCode,totalPrice,perPrice;
var buyArray;
var operation = 3;
var cruiseTable;
var vid,title,vnum;
var k = 1;
//存放房型id
var houseIdArr = [];
//存放每个房型的直客价
var customerPriceArr = [];
var customerPrice;
//同行价
var peerPriceArr = [];
var umPrice;
var voyageData;
var finance,payType,contact,contactTel,email,customerType,bookType,status,array,payPrice ;
var payment=0;
var jointDatas={}; //申请拼舱
function load() {
    showDetail(productType);
}

//班期行程安排
function showSchedule(vid){
    var type = 0;
    $.ajax({
        url: getContextPath() + '/resource/searchSchedule.do',
        type: 'post',
        data: {
            'scheDescribe.resourceCode':code,
            'scheDescribe.vid':vid,
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
        data: {
            'scheDescribe.resourceCode':code,
            'scheDescribe.type':type
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
}

//查看详情
function showDetail(type){
    var url;
    if(type == 21){
        url = getContextPath() + '/resource/searchDetail.do';
    }else{
        url = getContextPath() + '/resource/searchResourceDetail.do';
    }
    $.ajax({
        url:url,
        type: 'post',
        data: {
            'resource.code':code,
            'resource.cruiseId':cruiseId,
        },
        dataType: 'json',
        success: function(data) {
            if(data==null || data.datas==null) return;
            if(data.success == 1) {
                rendList(data);
                voyageList(code,1);
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
    list = list +'<div style="height:120px;">'
        +'<ul>'
        +'<li class="cf_city">出发城市：'+datas.start_city+'</li>'
        +'<li class="xc_day">行程天数：'+datas.days+'天</li>'
        +'<li class="md_di">目的地：' +datas.end_city+ '</li>';
            if(datas.product_type == 21){
              list = list
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
                +'<input data-toggle="modal" data-target="#myModal_yuding"  value="立即预定" type="submit" class="yuding-btn" onclick=\"showInfo(\''+escape(JSON.stringify(datas))+'\',\''+vid+'\')\"/>';

            }else{
                list = list
                    +'<li style="padding: 0;"><span class="glyphicon glyphicon-calendar" style="margin: 0 4px;color: #666;"></span>'
                    +' 班期：<span id="hq"><select class="hangqi"></select> </span>'
                    +'</li></ul>'
                +'<input data-toggle="modal" data-target="#myModal_yuding"  value="立即预定" type="submit" class="yuding-btn" onclick=\"showInfo(\''+escape(JSON.stringify(datas))+'\',\''+vid+'\')\"/>';

            }

        list = list+'</div>';

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
				 $("#contactName").val(data.linkman||data.name);
				 $("#contactPhone").val(data.phone);
				 $("#email").val(data.email);
			 }else if(msg =='user'){
				 $("#contactName").val(data.linkman||data.name);
				 $("#contactPhone").val(data.mobile);
				 $("#email").val(data.email);
			 }
		 }
	}),"json";
}
//显示详情
function showInfo(data){
	console.log(vid);
    if(vid == undefined){
        alert("暂无班期！");
        return;
    }
     getUserInfo();
    var dt = JSON.parse(unescape(data));
    currendData = dt;
    productType = dt.product_type;
    if(productType == 21){
        var resCode = dt.code;
        providerName = dt.provider_name;
        providerCode = dt.provider_code;
        //获取舱型信息
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
                     var str1='',str2='',str3='',str4='',str5='';
                   
                    for(var i=0; i<datas.length; i++) {
	                    var list = '';
                    	/*if((datas[i] && i!=0 && datas[i].cabin_name!=datas[i-1].cabin_name) || (i+1)==datas.length){
                    		 list +='<tr class="J_tr'+datas[i].id+'" style="border-top: 1px solid #ccc;">';
                    	}else{
                    		 list +='<tr class="J_tr'+datas[i].id+'">';
                    	}*/
                    	list +='<tr class="J_tr'+datas[i].id+'">';
                     
                        list +='<td class="yuding-name">'+datas[i].house_type+'</td>'+
                            '<td id="price'+i+'">'+datas[i].traderPrice+'</td>'+
                            '<td class="houseNum">'+datas[i].house_num+'</td>'+
                            '<td style="color:#ff7f05;font-weight: 800;" id ="price'+datas[i].id+'">0</td>'+
                            '<td><div class="addreduce"><span class="reduce"></span>'+
                            '<input class="addnumber" type="text" value="0"  disabled="disabled"/>'+
                            '<span class="add"></span></div>'+
                            '</td>';
                            if(datas[i].house_person_num==2){
                            	jointDatas[datas[i].id]=datas[i];
                         		list +='<td><a class="J_addJoin" href="javascript:;" onclick="spellTank(this,\''+datas[i].id+'\')">申请拼舱</a></td><td></td>';
                            }else{
                            	list +='<td class=""></td><td></td>';
                            }
                         list +='<input id="_'+datas[i].id+'" class="house_id" type="hidden" value="'+datas[i].id+'"/>'+
                            '<input type="hidden" class="resource_code" value="'+datas[i].resource_code+'"/>'+
                            '<input type="hidden" class="resCode" value="'+resCode+'"/>'+
                            '<input type="hidden" class="providerName" value="'+providerName+'"/>'+
                            '<input type="hidden" class="versionFlag" value="'+datas[i].versionFlag+'"/>'+
                            '<input type="hidden" class="house_person_num" value="'+(datas[i].house_person_num||1)+'"/>'+
                            '</tr>';
                        houseIdArr.push(datas[i].id);
                        customerPriceArr.push(datas[i].price);
                        peerPriceArr.push(datas[i].traderPrice);
                        
                        //內舱房 海景房 阳台房 套房
                    	if(datas[i].cabin_name=='內舱房'){
                    		 str1 +=list;
                    	}else if(datas[i].cabin_name=='海景房'){
                    		 str2 +=list;
                    	}else if(datas[i].cabin_name=='阳台房'){
                    		 str3 +=list;
                    	}else if(datas[i].cabin_name=='套房'){
                    		 str4 +=list;
                    	}else{
                    		 str5 +=list;
                    	}
                    }
                    var dataIndex=datas.length;
                   
                	var str6 ='<tr class="J_tr_bus" style="border-top: 1px solid #ccc;">'+
                    	'<td class="yuding-name">大巴</td>'+
                        '<td id="price'+(dataIndex+1)+'">'+(currendData.bus_price||0)+'</td>'+
                        '<td class="houseNum"><a class="hidden">1000</a></td>'+
                        '<td style="color:#ff7f05;font-weight: 800;" id ="price_bus">0</td>'+
                        '<td><div class="addreduce"><span class="reduce"></span>'+
                        '<input class="addnumber" type="text" value="0"  disabled="disabled"/>'+
                        '<span class="add"></span></div>'+
                        '</td>'+
                        '<td class=""></td>'+
                        '<td class=""></td>'+
                        '<input class="house_id" type="hidden" value="bus"/>'+
                        '<input type="hidden" class="house_person_num" value="1"/>'+
                        '</tr>';
                    
                  /*  if(currendData.addSpace_price){
                	var str7 ='<tr class="J_tr_addSpace">'+
                    	'<td class="yuding-name">挂舱</td>'+
                        '<td id="price'+(dataIndex+1)+'">'+(currendData.addSpace_price||0)+'</td>'+
                        '<td class="houseNum"><a class="hidden">1000</a></td>'+
                        '<td style="color:#ff7f05;font-weight: 800;" id ="price_addSpace">0</td>'+
                        '<td><div class="addreduce"><span class="reduce"></span>'+
                        '<input class="addnumber" type="text" value="0"  disabled="disabled"/>'+
                        '<span class="add"></span></div>'+
                        '</td>'+
                        '<td class=""></td>'+
                        '<td class=""></td>'+
                        '<input class="house_id" type="hidden" value="addSpace"/>'+
                        '<input type="hidden" class="house_person_num" value="1"/>'+
                        '</tr>';
                    }*/
                        
                	var str8 ='<tr class="J_tr_insurance" style="border-bottom: 1px solid #ccc;">'+
                    	'<td class="yuding-name">保险</td>'+
                        '<td id="price'+(dataIndex+1)+'">'+(currendData.insurance_price||0)+'</td>'+
                        '<td class="houseNum"><a class="hidden">1000</a></td>'+
                        '<td style="color:#ff7f05;font-weight: 800;" id ="price_insurance">0</td>'+
                        '<td><div class="addreduce"><span class="reduce"></span>'+
                        '<input class="addnumber" type="text" value="0"  disabled="disabled"/>'+
                        '<span class="add"></span></div>'+
                        '</td>'+
                        '<td class=""></td>'+
                        '<td class=""></td>'+
                        '<input class="house_id" type="hidden" value="insurance"/>'+
                        '<input type="hidden" class="house_person_num" value="1"/>'+
                        '</tr>';
                    
                    $('#houseList').html(str1+str2+str3+str4+str5+str6+str8);
                  //  $('#houseList').html(list);
                    $('#myModal_xq').removeData("bs.modal");
                    $('#myModal_xq').modal('show');

                    //加减人数
                    $(".add").click(
                        function(){
                            var addVal=$(this).parent().find(".addnumber").val();
                            addVal++;
                            $(this).parent().find(".addnumber").val(addVal);
                            //舱型
                            var houseType = $(this).parents("tr").find("td:eq(0)").html();
                            countPrice();
                            //画表格
                            //房型id
                            var hourseId = $(this).parents("tr").find("input:eq(1)").val();
                            //单间人数
                            //var personNum = $(this).parents("tr").find("input:eq(6)").val();
                            var personNum = $(this).parents("tr").find(".house_person_num").val();
                            //单人价格
                            var price =  $(this).parents("tr").find("td:eq(1)").text();
                            //房间剩余量
                            var amount = $(this).parents("tr").find("td:eq(2)").text();
                            //预定间数
                            var n = $(this).parent().find(".addnumber").val();
                            if(amount >= addVal){
                                drawCruiseTable(hourseId,houseType,personNum);
                                $("#bm_tb").append(cruiseTable);
                            }
                        });
                    $(".reduce").click(
                        function(){
                            var addVal=$(this).parent().find(".addnumber").val();
                            if(addVal > 0) addVal--;
                            $(this).parent().find(".addnumber").val(addVal);
                            countPrice();

                            //删表格
                            var hourseId = $(this).parents("tr").find("input:eq(1)").val();
                            var lTable = $("."+hourseId).last();
                            lTable.remove();
                        });
                    commitRemove();
                } else {
                    Jalert('获取失败, code:' + data.msg);
                }
            }
        });
        setPriceByCustomer();
    }else{
        if(productType == 22) $(".yuding-title span").text("自驾预定");
        if(productType == 23) $(".yuding-title span").text("精品游预定");
        //根据班期获取自驾精品游
        $.ajax({
            url:getContextPath()+"/resource/searchResourceVersion.do",
            type:'post',
            data: {"productVersion.id":vid,
            },
            dataType:'json',
            success:function(data){
                if(data.success==1){
                    var datas = data.datas;
                    $("#title").text(datas.title);
                    $("#price").text(datas.price);
                    $("#num").text(datas.num);
                    vnum = datas.num;
                    vid = datas.id;
                    customerPrice = datas.price;
                    umPrice = datas.traderPrice;
                }else{
                    Jalert(data.msg);
                }
            }
        });
        $('#customerType').find("option[value='1']").prop("selected","selected");
        $('#bookType').find("option[value='1']").prop("selected","selected");
        setPriceByCustomer();
        $("#myModal_zijia").modal('show');
    }


}
//根据用户输入的数量，计算价格
function countPrice() {
    var price = 0;	//单价
    var tPrice = 0;	//单个销售总价
    var tNum = 0;	//每次的总人数
    var reg = /^[0-9]*[1-9][0-9]*$/;
    buyArray = [];
    $('#houseList').find('tr').each(function() {
    	var me=$(this);
        var tdArr = $(this).children();
        price = tdArr.eq(1).html();//单价
        var txtPrice = tdArr.eq(3);
        var txtNum = tdArr.eq(4).find("input");
        var num = txtNum.val();//预定人数
      //  var personNum = tdArr.eq(10).val();//每间人数
        var personNum = $(this).find('.house_person_num').val();//每间人数
        if($.trim(num) == '') {
            Jalert('请选择预定间数');
            return;
        }
        //剩余间量
        var house_num = parseInt(tdArr.eq(2).html());
        //房型id
        var house_id = me.find('.house_id').val();
        //资源编号
        var resource_code =  me.find('.resource_code').val();
        var versionFlag =me.find('.versionFlag').val();
        
	    var genderPin=me.find('.J_gender') ? me.find('.J_gender :selected').val() : null;
        if(num != '0' && num != '0.5' && !reg.test(num)) {
            Jalert('预定间数必须是整数');
            return;
        }
        console.log(price+"-----"+num+"-----"+personNum+"-----");
        if(num > house_num) {
            $(".add").attr("onclick", "null");
            Jalert('余量不足');
            txtNum.val(house_num);
            num = house_num;
            var bb = Decimal.mul(price,num*personNum);
            txtPrice.text(number_format(bb,2,"."));
        }
        //每种房间类型的总价
        var aa = Decimal.mul(price,num*personNum);
        txtPrice.text(number_format(aa,2,"."));
        //整个订单的总价
        tPrice = Decimal.add(tPrice,aa);
        totalPrice = tPrice;
        //订单所有人数
        tNum = tNum + (num * personNum);
        if(num == 0) {
            return;
        }
        if(num > 0) {	//已选预定数量的房型
            //组织数据，添加到后台库存表
            var obj = {};
            obj.gender = genderPin;
            obj.resourceCode = resource_code;
            obj.providerCode = providerCode;
            obj.providerName = providerName;
            obj.versionFlag = versionFlag;	//当前资源tb_resource的版本号
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
    $('#totalPrice').html('￥'+number_format(totalPrice,2,"."));

}




//身份证号验证
function isCardID(sId){
    var aCity={
        11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
        21:"辽宁",22:"吉林",23:"黑龙江",
        31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
        41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",
        50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",
        61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",
        71:"台湾",81:"香港",82:"澳门",91:"国外"
    };
    var iSum=0 ;
    var info="" ;
    if(!/^\d{17}(\d|x)$/i.test(sId)) return false;
    //return "你输入的身份证长度或格式错误";
    sId=sId.replace(/x$/i,"a");
    if(aCity[parseInt(sId.substr(0,2))]==null) return false;
    //return "你的身份证地区非法";
    sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
    var d=new Date(sBirthday.replace(/-/g,"/")) ;
    if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())) return false;
    //return "身份证上的出生日期非法";
    for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
    if(iSum%11!=1) return false;
    //return "你输入的身份证号非法";
    //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
    return true;
}




//订单预订
function commitBook(){
    var salesPriceReg = /^([1-9]\d*|[0]{1,1})$/; //含0正整数
    var regFloat = /^[0-9]+(.[0-9]{2})?$/;//只能输入有两位小数的正实数
    var contactReg = /^[\u4E00-\u9FA5A-Za-z_]+$/;
    var telephoneReg =/^1[0-9]{10}$/;
    var emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    if(productType == 21){
        if(totalPrice == null || totalPrice == 0) {
            Jalert('请选择预定间数');
            return;
        }
        payment = $('#pay_price1').val().trim();	//实际支付金额
        if(!salesPriceReg.test(payment) && !regFloat.test(payment)){
            Jalert('请输入正确的支付金额');
            return;
        }

        //客户类型*：客户类型，1：直客，2：同行
        customerType  = $('#customerType1').val();
        //预定类型*：预定类型，1：占位，2：报名
        bookType = $('#book_Type').val();

        //联系人姓名*：
        contact = $("#contactName").val();
        if(!contactReg.test(contact)){
            Jalert("请输入联系人姓名!");
            return false;
        }

        //联系方式*
        contactTel = $("#contactPhone").val();
        if(!telephoneReg.test(contactTel)){
            Jalert("请输入正确的手机号!");
            return false;
        }
        email = $("#email").val();
        if(!emailReg.test(email)){
            Jalert("请输入正确的邮箱!");
        }
    }else{
        if($(".addnumber").val() == null || $(".addnumber").val() == 0){
            Jalert('请选择预订人数');
            return;
        }
        if(!salesPriceReg.test($("#pay_price").val())&& !regFloat.test($("#pay_price").val())){
            Jalert('请输入定金金额');
            return;
        }
        if($("#pay_price").val() == null || $("#pay_price").val() == ''){
            $("#pay_price").val(0);
        }
        payPrice = $('#pay_price').val().trim();	//实际支付金额

        //客户类型*：客户类型，1：直客，2：同行
        customerType  = $('#customerType').val();
        //预定类型*：预定类型，1：占位，2：报名
        bookType = $('#bookType').val();
        //联系人姓名*：
        contact = $("#contact").val();
        if(!contactReg.test(contact)){
            Jalert("请输入联系人姓名!");
            return false;
        }

        //联系方式*
        contactTel = $("#contactTel").val();
        if(!telephoneReg.test(contactTel)){
            Jalert("请输入正确的手机号!");
            return false;
        }

    }

//-------------------保存订单客户信息--------------------
    if(bookType != 1){

        // 姓名
        var userNameArr= [];	//联系人姓名*：
        var flag = true;
        $(".userName").each(function(i){
            if(!contactReg.test($(this).val())){
                Jalert("请输入客户"+(i+1)+"的姓名!");
                flag = false;
                return false;
            }else{
                userNameArr.push($(this).val())
            }

        });
        if(!flag){
            $("#book_submit").attr("onclick","commitBook()");
            return false;
        }

        // 类型 报名用户类型：0：成人 1：儿童
        var userTypeArr = [];

        $(".userType").each(function(){
            if($(this).val() == '成人') userType = 0;
            if($(this).val() == '儿童') userType = 1;
            userTypeArr.push(userType);
        });
        // 舱型
        var houseTypeArr = [];
        var tankType = $('.tankType').val();
        $(".tankType").each(function(){
            houseTypeArr.push($(this).val())
        });

        // 手机
        var telephoneArr = [];
        //联系方式*
        var telephone = $(".telephone").val();
        $(".telephone").each(function(i){
            if(!telephoneReg.test($(this).val())){
                Jalert("客户"+(i+1)+"手机号有误，请输入正确的手机号!");
                flag = false;
                return false;
            }else{
                telephoneArr.push($(this).val())
            }
        });
        if(!flag){
            $("#book_submit").attr("onclick","commitBook()");
            return false;
        }

        //证件类型
        // 证件 ：护照
        var passportArr = [];
        //身份证
        var identityCardArr = [];
        //姓
        var pinyinFname = [];
        //名
        var pinyinLname = [];
        // 出生地
        var bornProvinceArr = [];
        // 国籍
        var nationalityArr = [];
        // 生日
        var birthdayArr = [];
        // 签发地
        var passportProvinceArr = [];
        // 签发时间
        var passportDateArr = [];
        // 签发有效时间
        var validDateArr = [];
        var passportReg = /(P\d{7})|(G\d{8})/;
        $(".ID").each(function(i){
            //获取证件类型
            var credType = $(this).prev(".idcard").val();
            if(credType == '护照'){

                if(!passportReg.test($(this).val())){
                    Jalert("客户"+(i+1)+"护照号有误，请输入正确的护照号!");
                    flag = false;
                    return false;
                }else{
                    passportArr.push($(this).val());
                    identityCardArr.push(null);
                }
            }else if(credType == '身份证'){
                if(!isCardID($(this).val())){
                    Jalert("请输入客户"+(i+1)+"正确的身份证号");
                    flag = false;
                    return false;
                }else{
                    identityCardArr.push($(this).val());
                    passportArr.push(null);
                }
            }


        });


        if(!flag){
            $("#book_submit").attr("onclick","commitBook()");
            return false;
        }

        // 拼音：
        //姓
        var fName = $('.fName').val();
        $(".fName").each(function(i){
            var credType = getCredType(this);
            if(credType == '护照'){
                if($(this).val()!=""){
                    pinyinLname.push($(this).val().toUpperCase());
                }else{
                    Jalert("请输入客户"+(i+1)+"姓氏拼音");
                    flag=false;
                    return false;
                }

            }else if(credType == '身份证'){
                pinyinLname.push(null);
            }

        });

        if(!flag){
            $("#book_submit").attr("onclick","commitBook()");
            return false;
        }

        //名
        $(".lName").each(function(i){
            var credType = getCredType(this);
            if(credType == '护照'){
                if($(this).val()!=""){
                    pinyinFname.push($(this).val().toUpperCase());
                }else{
                    Jalert("请输入客户"+(i+1)+"名字拼音");
                    flag=false;
                    return false;
                }
            }else if(credType == '身份证'){
                pinyinFname.push(null);
            }

        });
        if(!flag){
            $("#book_submit").attr("onclick","commitBook()");
            return false;
        }

        //出生地
        $(".born_province").each(function(i){
            var credType = getCredType(this);
            if(credType == '护照'){
                if($(this).val() != ""){
                    bornProvinceArr.push($(this).val());
                }else{
                    Jalert("请输入客户"+(i+1)+"出生省份");
                    flag=false;
                    return false;
                }
            }else if(credType == '身份证'){
                bornProvinceArr.push(null);
            }

        });

        if(!flag){
            $("#book_submit").attr("onclick","commitBook()");
            return false;
        }

        // 国籍
        $(".nationality").each(function(i){
            var credType = getCredType(this);
            if(credType == '护照'){
                if($(this).val() != ""){
                    nationalityArr.push($(this).val());
                }else{
                    Jalert("请输入客户"+(i+1)+"的国籍");
                    flag=false;
                    return false;
                }
            }else if(credType == '身份证'){
                nationalityArr.push(null);
            }

        });


        if(!flag){
            $("#book_submit").attr("onclick","commitBook()");
            return false;
        }
        // 生日
        $(".birthday").each(function(i){
            var credType = getCredType(this);
            if(credType == '护照'){
                if($(this).val()!=""){
                    birthdayArr.push($(this).val());
                }else{
                    Jalert("请输入客户"+(i+1)+"的出生日期");
                    flag=false;
                    return false;
                }
            }else if(credType == '身份证'){
                birthdayArr.push(null);
            }

        });

        if(!flag){
            $("#book_submit").attr("onclick","commitBook()");
            return false;
        }
        // 签发地
        $(".passport_province").each(function(i){
            var credType = getCredType(this);
            if(credType == '护照'){
                if($(this).val()!=""){
                    passportProvinceArr.push($(this).val());
                }else{
                    Jalert("请输入客户"+(i+1)+"的护照签发省份");
                    flag=false;
                    return false;
                }
            }else if(credType == '身份证'){
                passportProvinceArr.push(null);
            }

        });
        if(!flag){
            $("#book_submit").attr("onclick","commitBook()");
            return false;
        }
        // 签发时间
        $(".passport_date").each(function(i){
            var credType = getCredType(this);
            if(credType == '护照'){
                if($(this).val()!=""){
                    passportDateArr.push($(this).val());
                }else{
                    Jalert("请输入客户"+(i+1)+"的发证日期");
                    flag=false;
                    return false;
                }
            }else if(credType == '身份证'){
                passportDateArr.push(null);
            }

        });
        if(!flag){
            $("#book_submit").attr("onclick","commitBook()");
            return false;
        }
        // 签发有效时间
        $(".valid_date").each(function(i){
            var credType = getCredType(this);
            if(credType == '护照'){
                if($(this).val()!=""){
                    validDateArr.push($(this).val());
                }else{
                    Jalert("请输入客户"+(i+1)+"的签发有效时间");
                    flag=false;
                    return false;
                }
            }else if(credType == '身份证'){
                validDateArr.push(null);
            }

        });
        if(!flag){
            $("#book_submit").attr("onclick","commitBook()");
            return false;
        }


        // 性别:1：男，0：女
        var genderArr = [];

        $(".gender").each(function(){
            if($(this).val() == '男') gender = 1;
            if($(this).val() == '女') gender = 0;
            genderArr.push(gender);
        });

        //大巴
        var busPriceArr = [];
        $(".bus").each(function(){
            if(this.checked){
                //busPriceArr.push(this.value)
                busPriceArr.push(currendData.bus_price)
            }else{
                busPriceArr.push(null)
            }

        });
        //保险
        var insurancePriceArr = [];
        $(".insurance").each(function(){
            if(this.checked){
                //insurancePriceArr.push(this.value)
                insurancePriceArr.push(currendData.insurance_price)
            }else{
                insurancePriceArr.push(null)
            }
        });
        // 备注
        var memoArr = [];
        var memo = $('.memo').val();
        $(".memo").each(function(){
            memoArr.push($(this).val())
        });

        //将页面输入的信息组装到对象数组中
        array = [];
        for(var j=0;j<userNameArr.length;j++){
            var orderUser={};
            //姓名
            orderUser.username=userNameArr[j];
            //用户类型
            orderUser.userType = userTypeArr[j];
            //房型
            orderUser.houseType = houseTypeArr[j];
            //手机
            orderUser.phone = telephoneArr[j];
            //护照
            orderUser.passport=passportArr[j];
            //身份证号
            orderUser.identityCard = identityCardArr[j];
            //性别
            orderUser.gender=genderArr[j];
            //大巴
            orderUser.busPrice = busPriceArr[j];
            //保险
            orderUser.insurancePrice = insurancePriceArr[j];
            //备注
            orderUser.memo = memoArr[j];
            //姓
            orderUser.pinyinFname=pinyinFname[j];
            //名
            orderUser.pinyinLname=pinyinLname[j];
            //出生地
            orderUser.bornProvince=bornProvinceArr[j];
            //国籍
            orderUser.nationality = nationalityArr[j];
            //生日
            orderUser.birthday=birthdayArr[j];
            //签发地
            orderUser.passportProvince=passportProvinceArr[j];
            //签发时间
            orderUser.passportDate=passportDateArr[j];
            //签发有效时间
            orderUser.validDate = validDateArr[j];
            array.push(orderUser);
        }
    }
    //订单状态默认为“待支付”
    //	2：已支付定金待审核，3：已支付定金
    //	7：已支付全款待审核，8：已支付全款
    //支付价等于订单总价
    if(productType == 21){
        //订单状态默认为“待支付”
        status = 1;
        //支付价等于订单总价
        if(totalPrice >= payment) status = 7;
        //支付价不为0，并且支付价不等于订单总价
        if(payment != 0 && totalPrice != payment) status = 2;
        if(!confirm('确认预定吗？')) return;
        if(payment == 0){
            $('#book_submit').attr('onclick', '');
           
            console.log(buyArray);
            console.log(array);
           // if(1==1)return;
            commitWait();
            $.ajax({
                url: getContextPath() + '/order/buyCruiseResource.do',
                type: 'post',
                data: {
                    'buyArray': JSON.stringify(buyArray),
                    'dataJSON': JSON.stringify(array),
                    'order.resCode': currendData.code,
                    'order.resName':$(".detail-title").text(),
                    'order.vid': vid,
                    'order.category': 2,
                    'order.categorySub': 21,
                    'order.providerName': currendData.provider_name,
                    'order.contact': contact,
                    'order.contactPhone': contactTel,
                    'order.email':email,
                    'order.customerType': customerType,
                    'order.bookType': bookType,
                    'order.price': totalPrice+'',	//订单总价格
//                    'order.payPrice': payment+'',	//实际（价格）定金
                    'order.opMoney':payment+'',	//实际（价格）定金
                    'order.status': status,
                    'resource.num':currendData.num,//当前此资源剩余房间总量
                    'resource.code':currendData.code,
                    'resource.versionFlag':currendData.resVersionFlag
                },
                dataType: 'json',
                success: function(data) {
                    if(data.success == 1) {
                        if(bookType == 1){//占位
                            alert('占位成功,请等待财务审核');
                        }
                        if(bookType == 2){//预定
                            alert('报名成功,请等待财务审核');
                        }
                        $('#pay_price1').val(0);
                        $('#totalPrice').text('');
                        $('#contactName').val('');
                        $('#contactPhone').val('');
                        $('#bm_tb thead').remove();
                        $('#bm_tb tbody').remove();
                        buyArray = [];
                    } else {
                        alert('预定失败，请稍后重试');
                    }
                    //重新加载
                    load();
                    //关闭弹出框
                    $('#myModal_xq').modal('hide');
                    $('#btn_buy').attr('onclick', 'commitBook();');
                    commitRemove();
                }
            });
        }else{
            toPay(payment);
        }

    }else{
        status = 1;
        if(payPrice == totalPrice) status = 7;
        //支付价不为0，并且支付价不等于订单总价
        if(payPrice != 0 && totalPrice != payPrice)status = 2;
        if(!confirm('确认预定吗？')) return;
        if(payPrice == 0){
            $('#book_submit').attr('onclick', '');
            commitWait();
            $.ajax({
                url: getContextPath() + '/order/bookDriverFromResource.do',
                type: 'post',
                data: {
                    "dataJSON":JSON.stringify(array),
                    'order.vid':vid,
                    'order.customerType':customerType,//客户类型
                    'order.bookType':bookType,//订单类型
                    'order.contact':contact,//联系人姓名
                    'order.contactPhone':contactTel,//联系人电话
                    'order.resName' : $("#title").text(),
                    'order.resCode' : currendData.code,
                    'order.providerName':currendData.provider_name,
                    'order.category' : 2,	//旅游业务
                    'order.categorySub' : productType,//自驾游
                    'order.price' : totalPrice+"",	//订单总价
                    'order.payPrice' : payPrice+"",	//实际支付
                    'order.perPrice':$("#price").text(),
                    'order.status' : status, //订单状态
                    'order.num': orderInfo.opNum, //预订人数
                    'resource.num':vnum,
                    'resource.code':currendData.code,
                    'resource.versionFlag':currendData.versionFlag
                },
                dataType: 'json',
                success: function(data) {
                    if(data.success == 1) {
                        //清空提交的数据
                        //预定人数
                        var addnumber  = $(".addnumber").val(0);
                        //总价
                        $(".price-color").html(0);
                        //实际支付定金
                        $('#pay_price').val('');
                        //联系人
                        $('#contact').val('');
                        $('#contactTel').val('');
                        $('#tb thead').remove();
                        $('#tb tbody').remove();
                        alert('预定成功，请尽快付款！');
                        if(confirm("是否下载确认单")){
                        	 $("#form_condition").attr("action",getContextPath()+"/order/orderConfirmExcel.do");
            				 $("#form_condition").submit();
                        }
                        	
                    } else {
                        alert('预定失败, 请稍后重试');
                    }
                    $('#pay_price').val('');
                    $("#addnumber").val(0);
                    showDetail();
                    $("#myModal_zijia").modal('hide');
                    $('#book_submit').attr('onclick', 'commitBook()');
                    commitRemove();
                }
            });
        }else{
            toPay(payPrice);
        }

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
 * 处理订单支付
 */
function deposit(){
    if(productType == 21){
        $.ajax({
            url: getContextPath() + '/order/buyCruiseResource.do',
            type: 'post',
            data: {
                'buyArray': JSON.stringify(buyArray),
                'dataJSON': JSON.stringify(array),
                'order.resCode': currendData.code,
                'order.resName':$(".detail-title").text(),
                'order.vid': vid,
                'order.category': 2,
                'order.categorySub': 21,
                'order.providerName': currendData.provider_name,
                'order.contact': contact,
                'order.contactPhone': contactTel,
                'order.customerType': customerType,
                'order.bookType': bookType,
                'order.price': totalPrice+'',	//订单总价格
//                'order.payPrice': payment+'',	//实际（价格）定金
                'order.opMoney':payment+'',	//实际（价格）定金
                'order.status': status,
                'resource.num':currendData.num,//当前此资源剩余房间总量
                'resource.code':currendData.code,
                'resource.versionFlag':currendData.resVersionFlag,
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
                //重新加载
                load();
                $('#btn_buy').attr('onclick', 'commitBook();');
                $('#sbmit').attr('onclick', 'toSubmit()');
                $('#pay_price1').val(0);
                $('#totalPrice').text('');
                $('#contactName').val('');
                $('#contactPhone').val('');
                $('#bm_tb thead').remove();
                $('#bm_tb tbody').remove();
                buyArray = [];
                //关闭弹出框
                $('#myModal_xq').modal('hide');
                commitRemove();
            }
        });
    }else{
        $.ajax({
            url: getContextPath() + '/order/bookDriverFromResource.do',
            type: 'post',
            data: {
                "dataJSON":JSON.stringify(array),
                'order.vid':vid,
                'order.customerType':customerType,//客户类型
                'order.bookType':bookType,//订单类型
                'order.contact':contact,//联系人姓名
                'order.contactPhone':contactTel,//联系人电话
                'order.resName' : $("#title").text(),
                'order.resCode' : currendData.code,
                'order.providerName':currendData.provider_name,
                'order.category' : 2,	//旅游业务
                'order.categorySub' : productType,//自驾游
                'order.price' : totalPrice+"",	//订单总价
                'order.payPrice' : payPrice+"",	//实际支付
                'order.perPrice':$("#price").text(),
                'order.status' : status, //订单状态
                'order.num': orderInfo.opNum, //预订人数
                'resource.num':vnum,
                'resource.code':currendData.code,
                'resource.versionFlag':currendData.versionFlag,
                'finance.operation': 3,	//产品支付
                'finance.accountType': accountType,
                'finance.account': finance.account,
                'finance.payType': payType,
                'finance.opMoney': finance.opMoney,
                'finance.opCompany': finance.opCompany,
                'finance.accountTime': finance.accountTime,
                'finance.pic': $("#financePicUrl").val()
            },
            dataType: 'json',
            success: function(data) {
                if(data.success == 1) {
                    alert('预定成功，请尽快付款！');
                    $('#myModal_recharge').modal('hide');
                    //清空提交的数据
                    //预定人数
                    var addnumber  = $(".addnumber").val(0);
                    //总价
                    $(".price-color").html(0);
                    //实际支付定金
                    $('#pay_price').val('');
                    //联系人
                    $('#contact').val('');
                    $('#contactTel').val('');
                    $('#tb thead').remove();
                    $('#tb tbody').remove();
                } else {
                    alert('预定失败, 请稍后重试');
                }
                $('#pay_price').val('');
                $("#addnumber").val(0);
                showDetail();
                $("#myModal_zijia").modal('hide');
                $('#book_submit').attr('onclick', 'commitBook()');
                $('#sbmit').attr('onclick', 'toSubmit()');
                commitRemove();
            }
        });
    }

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
    //finance.busCode = $('#busCode').val();//订单编号
    if(accountType == 1 ||accountType == 2){
        finance.opCompany = $('#opCompany_'+accountType).val().trim();//汇款单位
    }
    return true;
}

//把图片转成base64编码，并压缩
function zipImg() {
    var docObj=document.getElementById("inputFile");

    //压缩图片
    lrz(docObj.files[0], {width: 800}).then(function (rst) {
        $('#pic').val(rst.base64);
    });

    return true;
}


//获取证件类型
function getCredType(node){
    var tr1 = $(node).parent().parent().prev();
    var tr2 = tr1.prev();
    //获取类型
    var credType = tr2.children().children(".idcard").val();
    return credType;
}


//根据客户类型定义产品单价
function setPriceByCustomer(){
    if(productType == 21){
        $('#customerType1').change(function(){
            //根据客户类型设置产品单价（直客价 同行价）
            var customerType1 = $('#customerType1 option:selected').val();
            if(customerType1 == 1) {
              for(var i = 0; i< houseIdArr.length;i++){
                  $('#price'+i).text(customerPriceArr[i]);
              }
            }
            if(customerType1 == 2) {
                for(var i = 0; i< houseIdArr.length;i++){
                    $('#price'+i).text(peerPriceArr[i]);
                }
            }
            //同行，直客
            $(".J_joint").find(".price").each(function(){
            	 if(customerType1 == 1){
            		$(this).html($(this).attr("data1"));
            	 }
            	 if(customerType1 == 2){
            		$(this).html($(this).attr("data2"));
            	 }

            });
            
            countPrice();
        });
    }else{
        $('#customerType').change(function(){
            //根据客户类型设置产品单价（直客价 同行价）
            customerType = $('#customerType option:selected').val();
            var price;
            if(customerType == 1) {
               price = customerPrice;
            }
            if(customerType == 2) {
                price = umPrice;
            }
            $("#price").text(price);
            regFun();
        });
    }


}
//画游轮预定客户信息表格
function drawCruiseTable(hourseId,houseType,personNum){
    //舱型id
    var hourseId = typeof (hourseId) =="undefined"?'':hourseId;
    //舱型
    var houseType = typeof (houseType) =="undefined"?'':houseType;
    //单间人数
    var personNum = typeof (personNum) =="undefined"?'':personNum;

    var list = '';

        list = list+'<table  class="table table-bordered table-header yuding-baoming '+hourseId+'" data="">'+
            '<thead>'+
            '<tr>'+
                '<td class="w8">舱型</td>'+
                '<td class="w5">序号</td>'+
                '<td class="w5">姓名</td>'+
                '<td class="w5">类型</td>'+
                '<td class="w8">手机</td>'+
                '<td colspan="2" class="w12">证件</td>'+
                '<td class="w5">性别</td>'+
                '<td class="w5">大巴</td>'+
                '<td class="w5">保险</td>'+
                '<td class="w10">备注</td>'+
                '<td class="w5">操作</td>'+
            '</tr>'+
            '</thead>'+
            '<tbody>';
        list = list+'<tr>'+
            '<td rowspan="'+(personNum)+'">'+houseType+'</td>';
            var count = 0;
            for(var j = 1; j <= personNum; j++){
                count = parseInt(j);
                list = list+'<td>'+count+'</td>'+
                '<td><input class="form-control tankType" type="hidden" disabled="disabled" value="'+houseType+'">' +
                    '<input class="form-control userName" type="text"></td>'+
                '<td>'+
                '<select id="" name="" type="text" class="form-control userType">'+
                '<option>成人</option>'+
                '<option>儿童</option>'+
                '</select>'+
                '</td>'+
                '<td><input class="form-control telephone" type="text"></td>'+
                '<td colspan="2">'+
                '<select id="" name="" type="text" class="form-control w30 fleft idcard">'+
                '<option>护照</option>'+
                '<option>身份证</option>'+
                '</select><input class="form-control w68 fleft margin-left-w2 ID" type="text"></td>'+
                '<td>'+
                '<select id="" name="" type="text" class="form-control gender">'+
                '<option>男</option>'+
                '<option>女</option>'+
                '</select>'+
                '</td>'+
                '<td><label><input class="margin-small-right bus" type="checkbox" value="'+currendData.bus_price+'">'+currendData.bus_price+'元</label></td>'+
                '<td><label><input class="margin-small-right insurance" type="checkbox" value="'+currendData.insurance_price+'">'+currendData.insurance_price+'元</label></td>'+
                '<td><input class="form-control memo" type="text"></td>'+
                '<td>'+
                    '<input class="form-control personNum" type="hidden" value="'+personNum+'">'+
                    '<a class="del">删除</a><br>'+
                    '<input class="form-control hourseId" type="hidden" value="'+hourseId+'">'+
                '</td>'+
                '</tr>'

            }
            list = list+'</tbody>'+
                '</table>';



    cruiseTable = list;

}
//画自驾游和精品游预定客户信息表格
function drawDriverTable(num){
    var count = 0;
    var trs = '<table class="table table-bordered table-header yuding-baoming">';
    for(var i = 0; i < num; i++){
        count = parseInt(i)+1;
        trs = trs+ '<thead>'+
                    '<tr>'+
                        '<td class="w5">序号</td>'+
                        '<td class="w5">姓名</td>'+
                        '<td class="w5">类型</td>'+
                        '<td class="w8">手机</td>'+
                        '<td colspan="2" class="w12">证件</td>'+
                        '<td class="w5">性别</td>'+
                        '<td class="w5">保险</td>'+
                        '<td class="w10">备注</td>'+
                        '<td class="w5">操作</td>'+
                    '</tr>'+
               '</thead>'+
               '<tbody>'+
                    '<tr>'+
                    '<td>'+count+'</td>'+
                    '<td><input class="form-control userName" type="text"></td>'+
                    '<td>'+
                    '<select id="" name="" type="text" class="form-control userType">'+
                    '<option>成人</option>'+
                    '<option>儿童</option>'+
                    '</select>'+
                    '</td>'+
                    '<td><input class="form-control telephone" type="text"></td>'+
                    '<td colspan="2">'+
                    '<select id="" name="" type="text" class="form-control w30 fleft idcard">'+
                    '<option>护照</option>'+
                    '<option>身份证</option>'+
                    '</select><input class="form-control w68 fleft margin-left-w2 ID" type="text"></td>'+
                    '<td>'+
                    '<select id="" name="" type="text" class="form-control gender">'+
                    '<option>男</option>'+
                    '<option>女</option>'+
                    '</select>'+
                    '</td>'+
                    '<td><label><input class="margin-small-right insurance" type="checkbox" value="'+currendData.insurance_price+'">'+currendData.insurance_price+'元</label></td>'+
                    '<td><input class="form-control" type="text"></td>'+
                    '<td>'+
                    '<a class="del">删除</a><br>'+
                    '</td>'+
                    '</tr>'+
                '</tbody>';
    }
    trs = trs+ '</table>';
    $('#tb').html(trs);
}



//验证输入的数字是否合法
function regFun(){
    //单价
    var price= $('#price').text();
    var addnumber  = $(".addnumber").val();
    var pay_price = $("#pay_price").val();
    var totalNum = parseInt($("#num").text());
    var num = parseInt($(".addnumber").val());
    var addnumberReg = /^[0-9]{1,5}$/;
    if(addnumber <= totalNum){
        drawDriverTable(addnumber);
    }else{
        Jalert("请产品余量不足!");
        $(".addnumber").val(totalNum);
    }


    if(!addnumberReg.test(addnumber)){
        Jalert("请输入预订人数!");
        $(".addnumber").val(0);
        $(".price-color").html(0);
        return false;
    }


    if(num > totalNum){
        Jalert("产品余量不足");
        $(".addnumber").val(totalNum);
        //totalPrice = price*totalNum;
        totalPrice = Decimal.mul(price,totalNum);
        $(".price-color").html(number_format(totalPrice,2,"."));
        return false;
    }
    //totalPrice = price*addnumber;
    totalPrice = Decimal.mul(price,addnumber);

    $(".price-color").html('￥'+number_format(totalPrice,2,"."));

    //组织数据，添加到后台库存表
    orderInfo = {};
    orderInfo.opMoney = totalPrice;	//总价格
    orderInfo.opNum = num;//预订人数
}

//减少预订人数
function reduce(){

    var num = parseInt($(".addnumber").val());
    //最后一行
    var lTr1 = $('.trs tr:last');
    var tbody = lTr1.parent();
    var thead = tbody.prev();

    tbody.remove();
    thead.remove();
    num--;
    if(num <0){
        $(".addnumber").val(0);
    }else{
        $(".addnumber").val(num);
    }
    regFun();

}

//增加预订人数
function add(){
    var totalNum = parseInt($("#num").text());
    var num = parseInt($(".addnumber").val());
    if(num < totalNum){
        num++;
        $(".addnumber").val(num);
    }else{
        Jalert("请产品余量不足!");
        $(".addnumber").val(totalNum);
    }

    regFun();

}



//删除行
function delTr(aNode){

    //房型id
    var houseId = $(aNode).parent().find('input:eq(1)').val();
    //单间人数
    var personNum = $(aNode).parent().find('input:eq(0)').val();
    //价格
    var price = $(aNode).prev('input').prev('input').val();


    if(confirm("确定要删除吗？")){

        if(productType == 21){
            var tbody = $(aNode).closest('tbody');
            var table = $(aNode).closest('table');
            //房型id
            var houseId = $(aNode).parent().find('input:eq(1)').val();
            //房型数量
            var num =$('#_'+houseId).prev('td').children('div').children('input').val();
            var x = $(aNode).parent().parent().index();//删除行的索引
            if(x==0){//删除的是第一行
                personNum = tbody.find('tr:eq(0)').find('td:eq(0)').attr("rowspan");
                var houseType = tbody.find('tr:eq(0)').find('td:eq(0)').text();
                $(aNode).parent().parent().remove();
                tbody.find('tr:eq(0)').find('td:eq(0)').before('<td class="houseType trs" rowspan="'+personNum+'">'+houseType+'</td>');
                personNum--;
                tbody.find('tr:eq(0)').find('td:eq(0)').attr("rowspan",personNum);
            }else{//删除非第一行
                personNum = tbody.find('tr:eq(0)').find('td:eq(0)').attr("rowspan");
                $(aNode).parent().parent().remove();
                personNum--;
                tbody.find('tr:eq(0)').find('td:eq(0)').attr("rowspan",personNum);
            }
            if(tbody.text() == ""){
                table.remove();
                num--;
                $('#_'+houseId).prev('td').children('div').children('input').val(num);
                countPrice();
            }


        }else{
            var trNode1 = $(aNode).parent().parent();
            var tbody = trNode1.parent();
            var thead = tbody.prev();
            tbody.remove();
            thead.remove();

            var num = parseInt($(".addnumber").val());
            var price = $("#price").text();
            num--;
            $(".addnumber").val(num);
            $(".price-color").html('￥'+price*num);

            //组织数据，添加到后台库存表
            orderInfo = {};
            orderInfo.opMoney = totalPrice;	//总价格
            orderInfo.opNum = num;//预订人数
        }

    }
    return false;
}

//选择大巴和保险

function chooseBus(node){
    var flag = node.checked;
    //获取大巴价
    //var busPrice = Decimal(node.value);
    var busPrice = Decimal(currendData.bus_price);
    if(flag){
     //选中
     //   totalPrice +=parseInt(busPrice);
        totalPrice = Decimal.add(totalPrice,busPrice);
        $(".price-color").html('￥'+number_format(totalPrice,2,'.'));
    }else{
    //未选中
    //    totalPrice -=busPrice;
        totalPrice = Decimal.sub(totalPrice,busPrice);
        $(".price-color").html('￥'+number_format(totalPrice,2,'.'));
    }


}

function chooseInsurance(node){
    var flag = node.checked;
    //获取保险价
    //var insurancePrice = Decimal(node.value);
    var insurancePrice = Decimal(currendData.insurance_price);
    if(flag){
        //选中
        //totalPrice +=parseInt(insurancePrice);
        totalPrice = Decimal.add(totalPrice,insurancePrice);
        $(".price-color").html('￥'+number_format(totalPrice,2,'.'));
    }else{
        //未选中
        //totalPrice -=insurancePrice;
        totalPrice = Decimal.sub(totalPrice,insurancePrice);
        $(".price-color").html('￥'+number_format(totalPrice,2,'.'));
    }
}


/**
 * 班期列表
 */
function voyageList(rescode,pageNum){
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
                    showProductSchedule(0);
                } else {
                    voyageData =data.datas;
                    rendVoyageList(data.datas);
                     //跳转
	                var reservationMain = getUrlParam("reservationMain");
				    if(reservationMain=='1'){
				    	$(".yuding-btn").click();
				    }
                }
            }else{
                Jalert(data.msg);
            }
        }
    })
}

function rendVoyageList(data){
    title = $(".detail-title").text();
    var startDate;
    var list = '';
    var type = 0;
    for(var i = 0; i < data.length; i++){
        startDate = data[0].startDate;
        vid = data[0].id;
        list = list+"<option id='"+data[i].id+"' value='"+data[i].id+"'>"+data[i].startDate+"</option>";
    }
    if(productType == 21){
        minHousePrice(vid);
        type = showSchedule(vid);
        if(type == 0){
            showProductSchedule(0);
        }
    }else{
         getDriverPrice(vid);
    }
    $(".hangqi").html(list);
    $("#hq").append('本产品共<span>'+data.length+'</span>个班期');
    $(".detail-title").text(startDate+" "+title);
    $(".hangqi").change(function(){
        $(".detail-title").text("");
       vid = this.value;
        var time = $("#"+vid).text();
        var hq_title =time+" "+title;
        $(".detail-title").text(hq_title);
        if(productType == 21){
            minHousePrice(vid);
        }else{
            getDriverPrice(vid);
        }
        type = showSchedule(vid);
        if(type == 0){
            showProductSchedule(0);
        }
    })
}

//根据班期获取自驾精品游
function getDriverPrice(vid){
    $.ajax({
        url:getContextPath()+"/resource/searchResourceVersion.do",
        type:'post',
        data: {"productVersion.id":vid,
        },
        dataType:'json',
        success:function(data){
            if(data.success==1){
                if(data.datas == null || data.datas.length == 0) {
                    $('#minHousePrice').html("---");

                } else {
                    $('#minHousePrice').html(data.datas.price);
                }
            }else{
                Jalert(data.msg);
            }
        }
    });
}

//获取航期房型最低价
function minHousePrice(vid){
    $.ajax({
        url:getContextPath()+"/resource/getMinHousePriceByVid.do",
        type:'post',
        data: {"productVersion.id":vid,
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
//拼舱
function spellTank(obj,dataId){
	console.log(dataId);
    $(obj).attr("onclick",'');
	
    var houseNum=$(".J_tr"+dataId).find(".houseNum");
    if(!houseNum.text() || houseNum.text()<0.5){
    	return false;
    }
	houseNum.html(Number(houseNum.text())-0.5);
    
	houseData=jointDatas[dataId];
	console.log(houseData);
	var str=createHtmlJoint(houseData);
	$('#houseList').append(str);
	
	jointDatas["nPrice_"+dataId]=houseData.price;
	jointDatas["tPrice_"+dataId]=houseData.traderPrice;
	
    countPrice();
	
    //画表格
	drawCruiseTable("joint_"+houseData.id,houseData.house_type,1);
    $("#bm_tb").append(cruiseTable);
  
}
function createHtmlJoint(houseData){
	//根据客户类型设置产品单价（直客价 同行价）
    customerType = $('#customerType option:selected').val();
    var price;
    if(customerType == 1) {
       price = houseData.price;
    }
    if(customerType == 2) {
        price = houseData.traderPrice;
    }
    var list =list+
        '<tr class="J_joint">'+
        '<td class="yuding-name">'+houseData.house_type+'(拼舱)</td>'+
        '<td class="price" data1="'+houseData.price+'" data2="'+houseData.traderPrice+'">'+houseData.traderPrice+'</td>'+
        '<td>--</td>'+
        '<td style="color:#ff7f05;font-weight: 800;" id ="price'+houseData.id+'">'+(houseData.price)+'</td>'+
        '<td><div class="addreduce"><span class="reduce"></span>'+
        '<input class="addnumber" type="text" value="0.5"  disabled="disabled"/>'+
        '<span class="add"></span></div>'+
        '</td>'+
        '<td id=""><a class="" href="JavaScript:;" onclick="joinDetel(this,\''+houseData.id+'\')">删除</a></td>'+
        '<td>'+
        '<select name="" type="text" class="form-control J_gender" onchange="countPrice()">'+
        '<option value="1">男</option>'+
        '<option value="0">女</option>'+
        '</select>'+
        '</td>'+

     	'<input id="_'+houseData.id+'" class="house_id" type="hidden" value="'+houseData.id+'"/>'+
        '<input type="hidden" class="resource_code" value="'+houseData.resource_code+'"/>'+
       // '<input type="hidden" value="'+resCode+'"/>'+
       // '<input type="hidden" value="'+providerName+'"/>'+
        '<input type="hidden" class="versionFlag" value="'+houseData.versionFlag+'"/>'+
        '<input type="hidden" class="house_person_num" value="'+houseData.house_person_num+'"/>'+
        '</tr>';
      return list;
}
//删除
function joinDetel(obj,id){
	$(obj).parents('tr').remove();
	var houseNum=$(".J_tr"+id).find('.houseNum');
	houseNum.html(Number(houseNum.text())+0.5);
	 countPrice();
	//删除表格
	$(".joint_"+id).last().remove();
	$(".J_tr"+id).find('.J_addJoin').attr("onclick",'spellTank(this,"'+id+'")');
	
}