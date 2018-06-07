var datas = getUrlParam("datas");
var dt = JSON.parse(unescape(datas));
var orderCode = dt.code;
var bookType = dt.book_type;
var customerType = dt.customer_type;
var contact = dt.contact;
var tel = dt.contact_phone;
var status =  dt.status;
var createTime = dt.create_time;
var price = dt.price;
var applyPrice = dt.apply_price;
var payPrice = dt.pay_price;
var refundPrice = dt.refund_price;
var traderCode = dt.trader_code;
var resCode = dt.resource_code;
var comment = dt.comment;
var vid = dt.vid;
//产品类型
var productType = dt.category_sub;
//产品名称
var productName = dt.resource_name;
//保险价
var insurance = 0;
//大巴价
var bus = 0;
//销售
var sell = dt.op_name;
var datas = getUrlParam("datas");
//用于存放预定的舱型
var houseIdArr = [];
var houseArr = [];
// 单间人数
var housePersonNumArray = [];
//用于存放每种舱型可容纳的总人数
var personAmountArr = [];
//用于存放该类房型已住人数
var personArr = [];
var houseType1;
var insuranceAndBusPrice;//单个旅客的保险价和大巴价之和
function load(){
	if(status == 5 || status == 14 || status == 2 || status == 7 || status == 11){//订单取消或者退款完成或者中间状态
		$(".specialPrice").removeClass("btn-primary");
		$(".changeHourse").removeClass("btn-primary");
		$(".outName").removeClass("btn-primary");
		$(".intoName").removeClass("btn-primary");
		$(".addName").removeClass("btn-primary");
		$('.specialPrice').attr('onclick', '');
		$('.changeHourse').attr('onclick', '');
		$('.outName').attr('onclick', '');
		$('.intoName').attr('onclick', '');
		$('.addName').attr('onclick', '');
	}
    //订单详情
    searchOrderSchedule();

    /*订单信息
     */
    orderInfo();
    /*	船舱信息
     */
    getCruisesInfo();
    /*	资金信息
     */
    capitalInfo();

    /*产品信息
     */
    productInfo();
    //订单明细
    //收款详情
    //退款详情
    //开票详情
    getOrderHouse();
    //旅客信息
    //getCustomerInfo();
    //延时加载
    setTimeout(getCustomerInfo,1000);
    $('#myModal_xq').modal('show');
}
/**
 * 根据房型获取已住人数
 */
function setHouseNum(arr){
    for(var i = 0; i < houseArr.length;i++){
        var num = getCustomerAmountByHouseType(houseArr[i]);
        personArr.push(num);
    }
}

/**
 * 订单详情跟踪
 * @param code
 */
function searchOrderSchedule() {
    clearStyle();
    loadModalWait();
    $.ajax({
        url: getContextPath() + '/order/searchOrderSchedule.do',
        type: 'post',
        data: {
            'order.code': orderCode
        },
        dataType: 'json',
        success: function(data) {
            if(data.success==1){
                var arr = [];
                //操作信息
                operateInfo(data);
                //订单明细
//                orderDetails(data);
                for(var i = data.datas.length-1; i >= 0; i--){
                    arr.push(data.datas[i].status);
                    if(data.datas[i].status == 1 || data.datas[i].status == 2 || data.datas[i].status == 7 ||data.datas[i].status == 9){
                        $("#div2_1").hide();
                        $("#div2").hide();
                        displayDetail('#status1','提交订单','#date1','#time1',data.datas[i].DATE,data.datas[i].TIME);
                        $("#div1").removeClass("order-follow-icon order-tijiao-icon-hui");
                        $("#div1").addClass("order-follow-icon order-tijiao-icon");
                    }else if(data.datas[i].status == 11){
                        displayDetail('#status1','申请特价','#date1','#time1',data.datas[i].DATE,data.datas[i].TIME);
                        $("#div1").removeClass("order-follow-icon order-tijiao-icon-hui");
                        $("#div1").addClass("order-follow-icon order-tijiao-icon");
                    }else if(data.datas[i].status == 12){
                        $("#status1").removeAttr('style');
                        displayDetail('#status2','特价申请通过','#date2','#time2',data.datas[i].DATE,data.datas[i].TIME);
                        $("#div2_1").removeClass("order-liuc-icon-hui");
                        $("#div2_1").addClass("order-liuc-icon");
                        $("#div2").removeClass("order-follow-icon order-dingjin-icon-hui");
                        $("#div2").addClass("order-follow-icon order-dingjin-icon");
                    }else if(data.datas[i].status == 8){
                        $("#status1").removeAttr('style');
                        $("#div3_1").removeClass("order-liuc-icon-hui");
                        $("#div3_1").addClass("order-liuc-icon");
                        $("#status3").text('已支付全款');
                        $("#date3").text(data.datas[i].DATE);
                        $("#time3").text(data.datas[i].TIME);
                        $("#div3").removeClass("order-follow-icon order-quane-icon-hui");
                        $("#div3").addClass("order-follow-icon order-quane-icon");
                        $("#status4").text('财务审核通过');
                        $("#date4").text(data.datas[i].DATE);
                        $("#time4").text(data.datas[i].TIME);
                        $("#div4_1").removeClass("order-liuc-icon-hui");
                        $("#div4_1").addClass("order-liuc-icon");
                        $("#div4").removeClass("order-follow-icon order-caiwu-icon-hui");
                        $("#div4").addClass("order-follow-icon order-caiwu-icon");
                        $("#status5").text('完成');
                        $("#status5").css({"color": "#ff7f05","font-weight": "bold"});
                        $("#div5_1").removeClass("order-liuc-icon-hui");
                        $("#div5_1").addClass("order-liuc-icon");
                        $("#div5").removeClass("order-follow-icon order-wancheng-icon-hui");
                        $("#div5").addClass("order-follow-icon order-wancheng-icon");
                    }else if(data.datas[i].status == 4){

                        if($.inArray(8,arr) == -1){
                            $("#div3_1").hide();
                            $("#div3").hide();
                        }
                        if($.inArray(12,arr) == -1){
                            $("#div2_1").hide();
                            $("#div2").hide();
                        }
                        $("#status1").removeAttr('style');
                        $("#status4").text('财务已拒绝');
                        $("#date4").text(data.datas[i].DATE);
                        $("#time4").text(data.datas[i].TIME);
                        $("#div4_1").removeClass("order-liuc-icon-hui");
                        $("#div4_1").addClass("order-liuc-icon");
                        $("#div4").removeClass("order-follow-icon order-caiwu-icon-hui");
                        $("#div4").addClass("order-follow-icon order-caiwu-icon");
                        $("#status5").text('完成');
                        $("#status5").css({"color": "#ff7f05","font-weight": "bold"});
                        $("#div5_1").removeClass("order-liuc-icon-hui");
                        $("#div5_1").addClass("order-liuc-icon");
                        $("#div5").removeClass("order-follow-icon order-wancheng-icon-hui");
                        $("#div5").addClass("order-follow-icon order-wancheng-icon");
                    }else if(data.datas[i].status == 5){
                        if($.inArray(4,arr) == -1){
                            $("#div4_1").hide();
                            $("#div4").hide();
                        }
                        if($.inArray(8,arr) == -1){
                            $("#div3_1").hide();
                            $("#div3").hide();
                        }
                        if($.inArray(12,arr) == -1){
                            $("#div2_1").hide();
                            $("#div2").hide();
                        }
                        $("#status1").removeAttr('style');
                        displayDetail('#status5','已取消','#date5','#time5',data.datas[i].DATE,data.datas[i].TIME);
                        $("#div5_1").removeClass("order-liuc-icon-hui");
                        $("#div5_1").addClass("order-liuc-icon");
                        $("#div5").removeClass("order-follow-icon order-wancheng-icon-hui");
                        $("#div5").addClass("order-follow-icon order-wancheng-icon");
                    }

                }
                commitRemove();
            }else {
                Jalert('获取失败, code:' + data.msg);
            }
        }

    });
}
/**
 * 详情流程图展示
 */
function displayDetail(status,text,date,time,dData,Tdata){
    $(status).text(text);
    $(status).css({"color": "#ff7f05","font-weight": "bold"});
    $(date).text(dData);
    $(time).text(Tdata);

}
/**
 * 清除样式
 */
function clearStyle(){
    $("#status1").removeAttr('style');
    $("#status1").text('提交订单');
    $("#div1").removeClass("order-follow-icon order-tijiao-icon");
    $("#div1").addClass("order-follow-icon order-tijiao-icon-hui");
    $("#div2_1").show();
    $("#div2_1").removeClass("order-liuc-icon");
    $("#div2_1").addClass("order-liuc-icon-hui");
    $("#div2").show();
    $("#div2").removeClass("order-follow-icon order-dingjin-icon");
    $("#div2").addClass("order-follow-icon order-dingjin-icon-hui");
    $("#status2").removeAttr('style');
    $("#status2").text('审核');
    $("#div3_1").show();
    $("#div3_1").removeClass("order-liuc-icon");
    $("#div3_1").addClass("order-liuc-icon-hui");
    $("#div3").show();
    $("#div3").removeClass("order-follow-icon order-quane-icon");
    $("#div3").addClass("order-follow-icon order-quane-icon-hui");
    $("#status3").removeAttr('style');
    $("#status3").text('已支付全款');
    $("#div4_1").show();
    $("#div4_1").removeClass("order-liuc-icon");
    $("#div4_1").addClass("order-liuc-icon-hui");
    $("#div4").show();
    $("#div4").removeClass("order-follow-icon order-caiwu-icon");
    $("#div4").addClass("order-follow-icon order-caiwu-icon-hui");
    $("#status4").removeAttr('style');
    $("#status4").text('财务审核');
    $("#status5").removeAttr('style');
    $("#status5").text('完成');
    $("#div5_1").removeClass("order-liuc-icon");
    $("#div5_1").addClass("order-liuc-icon-hui");
    $("#div5").removeClass("order-follow-icon order-wancheng-icon");
    $("#div5").addClass("order-follow-icon order-wancheng-icon-hui");
}


/*订单信息
 * */
function  orderInfo(){
    //订单编号：aLPHMBNwrr
    $('#orderCode').text(orderCode);
    //预定类型：1：占位，2：报名
    if(bookType == undefined){
        $('#bookType').parent().hide();
    }else{
        $('#bookType').parent().show();
        if(bookType == 1) bookType = '占位';
        if(bookType == 2) bookType = '报名';
        $('#bookType').text(bookType);
    }

    //客户类型：1：直客，2：同行
    if(customerType == undefined){
        $('#customerType').parent().hide();
    }else{
        $('#customerType').parent().show();
        if(customerType == 1) customerType = '直客';
        if(customerType == 2) customerType = '同行';
        $('#customerType').text(customerType);
    }

    //联系人：
    if(typeof(contact) == undefined){
        $('#customer').parent().hide();
    }else{
        $('#customer').parent().show();
        $('#customer').text(contact);
    }

    //联系方式：13928383939
    if(typeof(tel) == undefined){
        $('#tel').parent().hide();
    }else{
        $('#tel').parent().show();
        $('#tel').text(tel);
    }

    //当前状态：已付定金
    $('#stat').append(orderStatus(status));
    //下单时间
    $('#creatTime').text(createTime);
    $('#J_saleMan').text(sell);
}

/**
 * 获取船舱信息
 * */
function getCruisesInfo(){
    $.ajax({
        url:getContextPath()+'/order/searchCruiseHouseListByOrderCode.do',
        type:'POST',
        data:{
            'order.code':orderCode,
        },
        dataType:'json',
        success:function(data){
            if(data.success == 1){
                var datas = data.datas;
                var list = '';
                //总人数
                var count = 0;
                orderDetails(data);
                if(datas[0] == null || datas.length == 0 || datas[0].cruise_house_id == undefined){
                    $('#house').empty();
                    $('#No_Result').show();
                    $('#num').text(datas[0].num);
                }else{
                    $('#house').empty();
                    $('#No_Result').hide();
                    for(var i = 0; i < datas.length; i++){
                    	if(datas[i].num==0)continue;
                    	if(datas[i].cruise_house_id=="bus"){
                    	}else if(datas[i].cruise_house_id=="addSpace"){
                    	}else if(datas[i].cruise_house_id=="insurance"){
                    	}else{
	                        list = list + '<li>'+datas[i].house_type+':<span>'+datas[i].num+'间</span></li>';
	                        houseIdArr.push(datas.cruise_house_id);//房型Id
	                        houseArr.push(datas[i].house_type);//房型
	                        housePersonNumArray.push(datas[i].house_person_num);//单间人数
	                        personAmountArr.push(Number(datas[i].house_person_num)*Number(datas[i].num));//可住人数
	                        count +=Number(datas[i].house_person_num)*Number(datas[i].num);
                    	}
                    }
                    setHouseNum(houseArr);
                    list = list +'<li>总人数：<span id="count">'+count+'</span></li>';
                    $('#house').html(list);
                    if(count > 0){
                        $('#num').text(count);
                        $('#price').text('');
                    }
                }

            }else{
                Jalert('获取失败, code:' + data.msg);
            }
        }
    })

}
/*	资金信息
 * */
function capitalInfo(){
    //订单金额：6999
    $('#orderPrice').text(number_format(price,2,"."));
    //订单申请价格 5000
    $('#applyPrice').text(number_format(applyPrice,2,"."));
    //已收金额：1000
    if(payPrice == undefined) {
        $('#pay1').text(number_format(0,2,"."));
    }else{
        $('#pay1').text(number_format(payPrice,2,"."));
    }
    //应收金额：4000
    var receivable = 0 ;
    if(applyPrice !=undefined && applyPrice !=""){
    	receivable = $('#applyPrice').text() - $('#pay1').text();
    }else{
    	receivable = $('#orderPrice').text() - $('#pay1').text();
    }
    if(receivable > 0){
        $('#pay2').text(number_format(receivable,2,"."));//应收金额
    }else{
        $('#pay2').text(number_format(0,2,"."));//实际支付大于订单价应收金额为0，还需退回多余的金额
    }
    //已收待审核 2000
    var opMoney = parseInt(selectOpMoney());//最近操作金额
    if(status == 2 || status == 7 || status == 11){//支付金额待审核
	    if(opMoney > 0){
	        $('#pay3').text(number_format(opMoney,2,"."));
	    }else{
	    	$('#pay3').text(number_format(0,2,"."));
	    }
	    $('#back1').text(number_format(0,2,"."));
    	$('#back2').text(number_format(0,2,"."));
    }else if(status == 13){//退款待审核
    	$('#back1').text(number_format(opMoney,2,"."));
    	$('#back2').text(number_format(0,2,"."));
    	$('#pay3').text(number_format(0,2,"."));
    }else if(status == 14){//已退款
    	$('#back1').text(number_format(0,2,"."));
    	$('#back2').text(number_format(refundPrice,2,"."));
    	$('#pay3').text(number_format(0,2,"."));
    }else{
    	$('#back1').text(number_format(0,2,"."));
    	$('#back2').text(number_format(0,2,"."));
    	$('#pay3').text(number_format(0,2,"."));
    }
}
/*	换房申请特价之后，更新资金信息
 * */
function changeCapitalInfo(){
	 $.ajax({
	        url:getContextPath()+'/order/searchOrderList.do',
	        type:'POST',
	        data:{
	            'order.code':orderCode,
	        },
	        dataType:'json',
	        success:function(data){
	            if(data.success == 1){
	                var datas = data.datas;
	                for(var i = 0; i < datas.length; i++){
	                	price = datas[i].price;
	                	applyPrice = datas[i].apply_price;
	                	payPrice = datas[i].pay_price;
	                	refundPrice = datas[i].refund_price;
	                	status = datas[i].status;
	                }
	              //当前状态：
	                $('#stat').text("");
	                $('#stat').append(orderStatus(status));
	                //订单金额：6999
	                $('#orderPrice').text(number_format(price,2,"."));
	                //订单申请价格 5000
	                $('#applyPrice').text(number_format(applyPrice,2,"."));
	                //已收金额：1000
	                if(payPrice == undefined) {
	                	$('#pay1').text(number_format(0,2,"."));
	                }else{
	                	$('#pay1').text(number_format(payPrice,2,"."));
	                }
	                //应收金额：4000
	                var receivable = 0 ;
	                if(applyPrice !=undefined && applyPrice !=""){
	                	receivable = $('#applyPrice').text() - $('#pay1').text();
	                }else{
	                	receivable = $('#orderPrice').text() - $('#pay1').text();
	                }
	                if(receivable > 0){
	                	$('#pay2').text(number_format(receivable,2,"."));//应收金额
	                }else{
	                	$('#pay2').text(number_format(0,2,"."));//实际支付大于订单价应收金额为0，还需退回多余的金额
	                }
	                //已收待审核 2000
	                var opMoney = parseInt(selectOpMoney());//最近操作金额
	             
	                if(status == 2 || status == 7 || status == 11){//支付金额待审核
	                	if(opMoney > 0){
	                		$('#pay3').text(number_format(opMoney,2,"."));
	                	}else{
	                		$('#pay3').text(number_format(0,2,"."));
	                	}
	                	$('#back1').text(number_format(0,2,"."));
	                	$('#back2').text(number_format(0,2,"."));
	                }else if(status == 13){//退款待审核
	                	$('#back1').text(number_format(opMoney,2,"."));
	                	$('#back2').text(number_format(0,2,"."));
	                	$('#pay3').text(number_format(0,2,"."));
	                }else if(status == 14){//已退款
	                	$('#back1').text(number_format(0,2,"."));
	                	$('#back2').text(number_format(refundPrice,2,"."));
	                	$('#pay3').text(number_format(0,2,"."));
	                }else{
	                	$('#back1').text(number_format(0,2,"."));
	                	$('#back2').text(number_format(0,2,"."));
	                	$('#pay3').text(number_format(0,2,"."));
	                }
	            }
	        }
	 });
}

/*
 产品信息
 产品名称：2017年6月28日 诺唯真游轮 上海-北九州-上海 4晚5天
 剩余间数：10
 */
function productInfo(){
    //产品名称
    $('#productName').text(productName);
  /*  //剩余间数：10
    $('#hourseNum').text(0);*/
    //总价
    var totalPrice = parseInt(price);
    $.ajax({
        url:getContextPath()+'/resource/searchResourceDetail.do',
        type:'POST',
        data:{
            'resource.code':resCode
        },
        dataType:'json',
        success:function(data){
            if(data.success == 1){
                var datas = data.datas;
                insurance =datas.insurance_price;
                bus = datas.bus_price;
                var count = $('#count').text();
                if(count > 0){
                    $('#num').text(count);
                    $('#price').text('');
                }else{
                    //自驾游
                    //单价
                    //客户类型，1：直客，2：同行
                    var price = 0;
                    //直客价
                    if(customerType == '直客')price = datas.price;
                    if(customerType == undefined)price = datas.price;
                    //同业价
                    if(customerType == '同行')price = datas.trader_price;
                    //数量
                    //var num =  totalPrice/price;
                    $('#price').text(price);
                    //$('#num').text(num);
                }
            }
        }
    })
}

//申请换房,加仓
function applyChangeHourse(index){
	if(status == 2 || status == 7){
		Jalert("订单审核之后再申请");
	}else{
		$.ajax({
			url:getContextPath()+'/order/searchCruiseHouseListByOrderCode.do',
			type:'POST',
			data:{
				'order.code':orderCode
			},
			dataType:'json',
			success:function(data){
				if(data.success == 1){
					var datas = data.datas;
					if(index==2){
						getAllHourse2(datas);
					}else{
						getAllHourse(datas);
					}
				}else{
					Jalert('获取失败, code:' + data.msg);
				}
			}
		});
		if(index==2){
			$("#myModal_addHourse").modal('show');
		}else{
			$("#myModal_changeHourse").modal('show');
		}
	}
}
//换房 获取所有舱型
var _versionHouseList={};
function getAllHourse(orderHouseList){
	var boxBody= $("#hourseItem");
	//console.log(vid);
	 $.ajax({
        url:getContextPath()+'/resource/searcHourseByVersion.do',
        type:'POST',
        data:{
            'resource.code':vid
        },
        dataType:'json',
        success:function(data){
            if(data.success == 1){
               var datas = data.datas;
              // console.log(orderHouseList);
               var str ='';
               for (var i = 0; i < orderHouseList.length; i++) {
	               	var cruise_house_id_o=orderHouseList[i].cruise_house_id;
	               	console.log(cruise_house_id_o);
	               	if(cruise_house_id_o=="bus"||cruise_house_id_o=="addSpace"||cruise_house_id_o=="insurance"){
	               		continue;
	               	}
               	   str +='<tr data="'+orderHouseList[i].id+'">';
               	   str +='<td>';
               	   str +='<select name="" class="J_versionHourseList">';
               	   for(var j = 0; j < datas.length; j++){
               		   if(orderHouseList[i].cruise_house_id==datas[j].id){
               			   str +='	<option value="'+datas[j].id+'" selected="selected">'+datas[j].house_type+'';
               		   }else{
               			   str +='	<option value="'+datas[j].id+'" >'+datas[j].house_type+'';
               		   }
               	   }
               	   str +='</select>';
               	   str +='</td>';
               	   str +='<td class="salePrice">'+orderHouseList[i].price+'</td>'; //价格
               	   str +='<td class="persionNum">'+orderHouseList[i].house_person_num+'</td>';	//人数
               	   str +='<td class="hourseLeave">---</td>'; //剩余
               	  // str +='<td class="perNum">'+orderHouseList[i].num+'</td>';   //预订间书
               	   str +='<td class="perNum"><input type="text" name="" value="'+orderHouseList[i].num+'" class="t_perNum" style="width:50px;height:25px;"></td>';   //预订间书
               	   var oldPrice=Number(orderHouseList[i].price)*Number(orderHouseList[i].num)*Number(orderHouseList[i].house_person_num);
               	   str +='<td class="needPrice" data="'+oldPrice+'"></td>';
               	   str +='</tr>';
                  }
               	//console.log(str);
                  $("#hourseItem").html(str);
                  
				  //直客价
                  if(customerType == '直客' ||customerType == undefined){
                	  for(var k = 0; k < datas.length; k++){
                		  var compensation=""; //补差价
                		  var arrTemp=[datas[k].house_type,datas[k].customer_price,datas[k].house_person_num,datas[k].house_num];
                		 // _versionHouseList.put(datas[k].id,arrTemp);
                		  _versionHouseList[datas[k].id]=arrTemp;
    				  }
                  }
                  //同业价
                  if(customerType == '同行'){
                	  for(var k = 0; k < datas.length; k++){
                		  var compensation=""; //补差价
                		  var arrTemp=[datas[k].house_type,datas[k].trader_price,datas[k].house_person_num,datas[k].house_num];
                		  _versionHouseList[datas[k].id]=arrTemp;
    				  }
                  }
                  //绑定事件
                  //console.log(_versionHouseList);
                  $(".J_versionHourseList").bind("change",function(){
					  var obj=$(this).parent().parent();
					  var keyId=$(this).val();
					  //console.log(keyId);
					  var hourseInfo=_versionHouseList[keyId];
					  $(".salePrice",obj).html(hourseInfo[1]);
					  $(".persionNum",obj).html(hourseInfo[2]);
					  $(".hourseLeave",obj).html(hourseInfo[3]);
					 // $(".perNum",obj).html(hourseInfo[4]);
					 // $(".perNum",obj).find('input').val(hourseInfo[4]);
					  var needPrice=Number(hourseInfo[1])*Number($(".perNum",obj).find("input").val())*Number($(".persionNum",obj).html())-Number($(".needPrice",obj).attr("data"));
					 // var needPrice=Number(hourseInfo[1])*Number($(".perNum",obj).html())*Number($(".persionNum",obj).html())-Number($(".needPrice",obj).attr("data"));
					 // console.log("需要差价"+needPrice);
					  $(".needPrice",obj).html(Number(needPrice).toFixed(2));
				  });
                  //换数量
                   $('.t_perNum').bind('input propertychange', function() {  
                	  var obj=$(this).parent().parent();
                	  var inputNum=$(this).val();
                	  var needPrice=Number($(".salePrice",obj).html())*Number($(".perNum",obj).find("input").val())*Number($(".persionNum",obj).html())-Number($(".needPrice",obj).attr("data"));
 					   $(".needPrice",obj).html(Number(needPrice).toFixed(2));
                   });
				   $(".J_versionHourseList",boxBody).find("option:selected").change();
            }else{
                Jalert('获取失败, code:' + data.msg);
            }
        }
    });
}
function getAllHourse2(orderHouseList){
	var box= $("#myModal_addHourse");
	//console.log(orderHouseList);
	var contantType=function(sorceId,orderHouseList){
  		for (var i = 0; i < orderHouseList.length; i++) {
   		   if(orderHouseList[i].cruise_house_id==sorceId){
   			  return false;
   		   }
   		 }
   		 return true;
  	 }
	
	 $.ajax({
        url:getContextPath()+'/resource/searcHourseByVersion.do',
        type:'POST',
        data:{
            'resource.code':vid
        },
        
        dataType:'json',
        success:function(data){
            if(data.success == 1){
               var datas = data.datas;
               var str ='';
               	   str +='<tr data="'+orderHouseList[0].id+'">';
               	   str +='<td>';
               	   str +='<select name="" class="J_versionHourseList">';
               	   for(var j = 0; j < datas.length; j++){
               	   		if(contantType(datas[j].id,orderHouseList)){
               	   			 str +='<option value="'+datas[j].id+'" >'+datas[j].house_type+'';
               	   		}
               	   }
               	   
               	   str +='</select>';
               	   str +='</td>';
               	   str +='<td class="salePrice">---</td>'; //价格
               	   str +='<td class="persionNum">---</td>';	//人数
               	   str +='<td class="hourseLeave">---</td>'; //剩余
               	  // str +='<td class="perNum">'+orderHouseList[i].num+'</td>';   //预订间书
               	   str +='<td class="perNum"><input type="text" name="" value="1" class="t_perNum" style="width:50px;height:25px;"></td>';   //预订间书
               	   str +='<td class="needPrice" data="0"></td>';
               	   str +='</tr>';
                $(".addHourseItem",box).html(str);
				  //直客价
                  if(customerType == '直客' ||customerType == undefined){
                	  for(var k = 0; k < datas.length; k++){
                		  var compensation=""; //补差价
                		  var arrTemp=[datas[k].house_type,datas[k].customer_price,datas[k].house_person_num,datas[k].house_num];
                		 // _versionHouseList.put(datas[k].id,arrTemp);
                		  _versionHouseList[datas[k].id]=arrTemp;
    				  }
                  }
                  //同业价
                  if(customerType == '同行'){
                	  for(var k = 0; k < datas.length; k++){
                		  var compensation=""; //补差价
                		  var arrTemp=[datas[k].house_type,datas[k].trader_price,datas[k].house_person_num,datas[k].house_num];
                		  _versionHouseList[datas[k].id]=arrTemp;
    				  }
                  }
                  //绑定事件
                  //console.log(_versionHouseList);
                  $(".J_versionHourseList",box).bind("change",function(){
					  var obj=$(this).parent().parent();
					  var keyId=$(this).val();
					  //console.log(keyId);
					  var hourseInfo=_versionHouseList[keyId];
					  $(".salePrice",obj).html(hourseInfo[1]);
					  $(".persionNum",obj).html(hourseInfo[2]);
					  $(".hourseLeave",obj).html(hourseInfo[3]);
					 // $(".perNum",obj).html(hourseInfo[4]);
					 // $(".perNum",obj).find('input').val(hourseInfo[4]);
					  var needPrice=Number(hourseInfo[1])*Number($(".perNum",obj).find("input").val())*Number($(".persionNum",obj).html())-Number($(".needPrice",obj).attr("data"));
					 // var needPrice=Number(hourseInfo[1])*Number($(".perNum",obj).html())*Number($(".persionNum",obj).html())-Number($(".needPrice",obj).attr("data"));
					 // console.log("需要差价"+needPrice);
					  $(".needPrice",obj).html(Number(needPrice).toFixed(2));
				  });
                  //换数量
                   $('.t_perNum',box).bind('input propertychange', function() {
                	  var obj=$(this).parent().parent();
                	  var inputNum=$(this).val();
                	  var needPrice=Number($(".salePrice",obj).html())*Number($(".perNum",obj).find("input").val())*Number($(".persionNum",obj).html())-Number($(".needPrice",obj).attr("data"));
 					   $(".needPrice",obj).html(Number(needPrice).toFixed(2));
                   }); 
                   
				  $(".J_versionHourseList",box).find("option").eq(0).change();
            }else{
                Jalert('获取失败, code:' + data.msg);
            }
        }
    });
}
//加房请求提交
function hourdeAddApply(){
	var box=$("#myModal_addHourse");
    //只能输入非零的正整数：
    var regNum = /^\+?[1-9][0-9]*$/;
    var arr = [];
    var validateFlag=false;
   $(".addHourseItem",box).find("tr").each(function(){
        var obj = $(this);
        var orderInfoId = $(this).attr("data");
        var hourseId=$(".J_versionHourseList",obj).find(":selected").val();
        var cruiseHouseType=$(".J_versionHourseList",obj).find(":selected").html().trim();
        var salePrice=$(".salePrice",obj).html();
        var housePersonNum=$(".persionNum",obj).html();
        var hourseLeave=$(".hourseLeave",obj).html();
        var perNum=$(".perNum",obj).find("input").val();
        
       // if(regNum.test(perNum)){
        	if(Number(hourseLeave) && Number(hourseLeave)>0 && Number(hourseLeave)>=Number(perNum)){
        	validateFlag=true;
        	}
      //  }
        var obj = {};
        obj.id = orderInfoId;
        obj.orderCode=orderCode;
        obj.resCode=resCode;
		obj.traderCode=traderCode;
		obj.vid=vid;
		
        obj.cruiseHouseId = hourseId;
        obj.cruiseHouseType= cruiseHouseType;
        obj.price= salePrice;
        obj.housePersonNum= housePersonNum;
        obj.num=perNum;
        //obj. = ;
        arr.push(obj);
    });
    //验证
    if(!validateFlag){
    	Jalert('库存不足');
    	return;
    }
    
    if(!confirm('确认增加舱型吗？')) return;
    $('#hourseAddSubmit').attr('onclick', '');
    $.ajax({
    	url:getContextPath()+'/order/addOrderHourse.do',
        type: 'post',
        data: {
            'buyArray': JSON.stringify(arr),
            'order.code':orderCode
           // 'order.status' : status, //订单状态
        },
        dataType: 'json',
        success: function(data) {
            if(data.success == 1) {
                alert('增加船舱成功');
                searchOrderSchedule();
                getCruisesInfo();
                changeCapitalInfo();
            } else {
                alert('增加船舱失败');
            }
            
            $("#myModal_addHourse").modal('hide');
        	$("#myModal_addHourse").find(".addHourseItem").html('');
            $('#hourseAddSubmit').attr('onclick', 'hourdeAddApply()');
            commitRemove();
        }
    });
	 
}
//换房请求提交
function hourdeApply(){
	var obj=$("#hourseItem");

    //只能输入非零的正整数：
    var regNum = /^\+?[0-9][0-9]*$/;
    var arr = [];
    var validateFlag=false;
    $("#hourseItem").find("tr").each(function(){
        var obj = $(this);
        var orderInfoId = $(this).attr("data");
        var hourseId=$(".J_versionHourseList",obj).find(":selected").val();
        var cruiseHouseType=$(".J_versionHourseList",obj).find(":selected").html().trim();
        var salePrice=$(".salePrice",obj).html();
        var housePersonNum=$(".persionNum",obj).html();
        
        var hourseLeave=$(".hourseLeave",obj).html();
        var perNum=$(".perNum",obj).find("input").val();
       // if(regNum.test(perNum)){
        //	if(Number(hourseLeave) && Number(hourseLeave)>0 && Number(hourseLeave)>=Number(perNum)){
        //	validateFlag=true;
        //	}
      //  }
        var obj = {};
        obj.id = orderInfoId;
        obj.cruiseHouseId = hourseId;
        obj.cruiseHouseType= cruiseHouseType;
        obj.price= salePrice;
        obj.housePersonNum= housePersonNum;
        obj.num=perNum;
        //obj. = ;
        arr.push(obj);
    });
    //验证
    if(!validateFlag){
    	//Jalert('库存不足');
    	//return;
    }
    //申请换房
    if(!confirm('确认换房吗？')) return;
    $('#hourseChangeSubmit').attr('onclick', '');
    $.ajax({
    	url:getContextPath()+'/order/updateOrderHourse.do',
        type: 'post',
        data: {
            'buyArray': JSON.stringify(arr),
            'order.code':orderCode,
            'order.status':status
           // 'order.status' : status, //订单状态
        },
        dataType: 'json',
        success: function(data) {
            if(data.success == 1) {
                alert('换房成功');
                searchOrderSchedule();
                getCruisesInfo();
                changeCapitalInfo();
            } else {
                alert('换房失败');
            }
            $("#myModal_changeHourse").modal('hide');
            $("#myModal_changeHourse").find(".hourseItem").html('');
            $('#hourseChangeSubmit').attr('onclick', 'hourdeApply()');
            commitRemove();
        }
    });
	 
}
//申请特价
function applySpecialPrice(){
	if(status == 2 || status == 7){
		Jalert("订单审核之后再申请");
	}else{
		$.ajax({
			url:getContextPath()+'/order/searchCruiseHouseListByOrderCode.do',
			type:'POST',
			data:{
				'order.code':orderCode
			},
			dataType:'json',
			success:function(data){
				if(data.success == 1){
					var datas = data.datas;
					var list = '',applyTd = '';
					for(var i = 0; i < datas.length; i++){
						var applyPrice = datas[i].apply_price == undefined?"":datas[i].apply_price;
						if(applyPrice == ''){
							applyTd = '<td><input class="form-control" type="text" value="'+datas[i].price+'"></td>';
						}else{
							applyTd = '<td><input class="form-control" type="text" value="'+applyPrice+'"></td>';
						}
						list = list+'<tr>'+
						'<input type="hidden" id="'+datas[i].cruise_house_id+'" value="'+datas[i].cruise_house_id+'">'+
						'<td>'+datas[i].house_type+'</td>'+
						'<td>'+datas[i].price+'</td>'+
						'<td>'+datas[i].house_person_num+'</td>'+
						'<td>'+datas[i].num+'</td>'+
						/*'<td><input class="form-control" type="text"></td>'+*/
						applyTd+
//                        '<td>'+
//                        '<a class="order-mx-remove">删除</a>'+
//                        '</td>'+
						'</tr>';
					}
					$("#applyItem").html(list);
				}else{
					Jalert('获取失败, code:' + data.msg);
				}
			}
		});
		
		$("#myModal_add_mx").modal('show');
	}

}

//提交申请
function submitApply(){
    //只能输入非零的正整数：
    var regNum = /^\+?[1-9][0-9]*$/;
    var totalApplyPrice = 0;
    var arr = [];
    $("#applyItem").find("tr").each(function(){
        var tds = $(this).children();
        var houseTypeId = $(this).find("input").val();
        var housePersonNum = tds.eq(3).text();
        var num = tds.eq(4).text();
        var applyPrice = tds.eq(5).find("input").val();
        var obj = {};
        obj.orderCode = orderCode;
        obj.cruiseHouseId = houseTypeId;
        obj.applyPrice = applyPrice;
        obj.vid = vid;
        arr.push(obj);
        totalApplyPrice = totalApplyPrice+(applyPrice*num*housePersonNum);
    });

    //申请的总金额
    //11：申请特价
    var status = 11;
    if(!confirm('确认申请吗？')) return;
    $('#submitOrder').attr('onclick', '');
    $.ajax({

        url: getContextPath() + '/order/addDetail.do',
        type: 'post',
        data: {
            'buyArray': JSON.stringify(arr),
            'order.code':orderCode,
//            'order.applyPrice' : totalApplyPrice,//申请总价
            'order.status' : status, //订单状态
            'order.opMoney':totalApplyPrice//订单操作表
        },
        dataType: 'json',
        success: function(data) {
            if(data.success == 1) {
                alert('申请成功，请等审核！');
                searchOrderSchedule();
                getCruisesInfo();
                changeCapitalInfo();
            } else {
                alert('申请失败, 请稍后重试');
            }
            $("#myModal_add_mx").modal('hide');
            $('#submitOrder').attr('onclick', 'submitApply()');
            commitRemove();
        }
    });

}
//订单明细
function orderDetails(data){
    var datas = data.datas;
    var list = '';
    //总价
//    var totalPrice = $('#orderPrice').text();
    //备注
    var remark = (typeof(comment)=='undefined')?'':comment;
    //摘要
//    var memo;
    //单价
//    var op_unit_price;
    //数量
//    var op_num;
    //总价
//    var op_price;
    //操作人
//    var op_name;
    if(datas == null || datas.length == 0){
        list = list +'<tr>'+
            ' <td colspan="4">暂无数据</td>'+
            '</tr>'
    }else{
       /* list = list +'<tr>'+
                '<td>下单</td>'+
                '<td></td>'+
                '<td id="price"></td>'+
                '<td id="num"></td>'+
                '<td>'+number_format(datas[0].op_price,2,".")+'</td>'+
                '<td>'+sell+'</td>'+
                '<td>待支付<td>'
                '<td></td></tr>';*/
        for(var i = 0; i < datas.length; i++){
//            op_price = (typeof(datas[i].op_price) == 'undefined') ?'':datas[i].op_price;
//            if(op_price == 0){
//                continue;
//            }
//            memo = (typeof(datas[i].memo) == 'undefined') ?'':datas[i].memo;
//            op_unit_price = (typeof(datas[i].op_unit_price) == 'undefined') ?'':datas[i].op_unit_price;
//            op_num = (typeof(datas[i].op_num) == 'undefined') ?'':datas[i].op_num;
//            op_name = (typeof(datas[i].op_name) == 'undefined') ?'':datas[i].op_name;
        	var personNum = Number(datas[i].house_person_num)*Number(datas[i].num);
            var price = (typeof(datas[i].price) == 'undefined') ?'--':number_format(datas[i].price,2,".");
            var apply_price = (typeof(datas[i].apply_price) == 'undefined') ?'--':number_format(datas[i].apply_price,2,".");
            var allPrice;
            if(typeof(datas[i].apply_price) == 'undefined'){
            	allPrice = personNum * price;
            }else{
            	allPrice = personNum * apply_price;
            }
            list = list+'<tr><td>'+datas[i].house_type+'</td>'+//房型
                        '<td>'+datas[i].house_person_num+'</td>'+//单间人数
                        '<td>'+datas[i].num+'</td>'+//间数
                        '<td>'+personNum+'</td>'+//人数
                        '<td>'+price+'</td>'+//单价
                        '<td>'+apply_price+'</td>'+//申请价
                        '<td>'+allPrice+'</td>'	+//总价
//                        '<td></td>'+
                        '</tr>';
        }
    }
    list = list+'<tr>'+
        '<td colspan="8" style="text-align: left;">备注：<span id="beizhu">'+remark+'</span>'+
        '<button type="submit" class="btn btn-primary margin-big-left" data-toggle="modal" onclick="showMemo()">更新备注</button>'+
        '</td>'+
        '</tr>'+
        '<tr>'+
        '<td colspan="8" style="text-align: left;background: #FFFCF7;">订单总金额：<span style="color: #FF7F05;">0</span>元</td>'+
        '</tr>';
    $('#orderDetails').html(list);
}
//显示备注
function showMemo(){
    //备注
    $('#memo').val($('#beizhu').text());
    $('#myModal_beizhu').modal('show');
}
//更新备注
function updateMemo(){
    var comment = $('#memo').val();
    $.ajax({
        url:getContextPath()+'/order/editOrder.do',
        type:'POST',
        data:{
            //订单编号
            'order.code':orderCode,
            //'order.status':status,
            //订单备注
            'order.comment':comment
        },
        dataType:'json',
        success:function(data){
            if(data.success == 1){
                Jalert('更新成功！');
                $('#beizhu').text(comment);
            }else{
                Jalert('更新失败, code:' + data.msg);
            }
            $('#comment_submit').attr('onclick','updateMemo()');
            $('#myModal_beizhu').modal('hide');
            commitRemove();
        }
    })
}
//操作信息
function operateInfo(data){
    var datas = data.datas;
    var list = '';
    if(datas == null || datas.length == 0){
        list = list +'<tr>'+
            ' <td colspan="4">暂无数据</td>'+
            '</tr>';
    }else{
        for(var i = 0; i < datas.length; i++){
            var memo = (typeof(datas[i].memo) == 'undefined') ?'':datas[i].memo;
            var op_price = (typeof(datas[i].op_price) == 'undefined') ?'--':datas[i].op_price;
            list = list +'<tr>'+
                '<td>'+datas[i].op_name+'</td>'+
                '<td>'+orderStatus(datas[i].status)+'</td>'	+
                '<td>'+number_format(op_price,2,".")+'</td>'	+
                '<td>'+memo+'</td>'	+
                '<td>'+datas[i].DATE+' '+datas[i].TIME+'</td>'	+
                '</tr>';
        }
    }
    $('#operator').html(list);

}

/**
 * 获取客户信息
 */
function getCustomerInfo(){
    $.ajax({
        url:getContextPath()+'/order/searchOrderCustomer.do',
        type:'POST',
        data:{
            'order.code':orderCode
        },
        dataType:'json',
        success:function(data){
            if(data.success == 1){
                var datas = data.datas;
                var list = '';
                //成人人数
                var adultAmount = 0;
                //儿童人数
                var childAmount = 0;
                if(datas == null || datas.length == 0){
                    list = list +'<tr>'+
                        ' <td colspan="11">暂无数据</td>'+
                        '</tr>'

                }else{
                    var j = 0;
                    for(var i = 0; i < datas.length; i++){
                        //客户类型
                        if(datas[i].user_type == undefined){
                            var userType = '成人';
                        }else{
                            var userType = (datas[i].user_type == 0)?'成人':'儿童';
                        }


                        if(userType == '成人') adultAmount++;

                        if(userType == '儿童') childAmount++;
                        //性别
                        var gender = (datas[i].gender == 0)?'女':'男';
                        //预定舱型
                        var houseType = (typeof (datas[i].house_type) == 'undefined')?'':datas[i].house_type;
                        var busPrice = (typeof (datas[i].bus_price) == 'undefined')?'无':datas[i].bus_price;
                        var insurancePrice = (typeof (datas[i].insurance_price) == 'undefined')?'无':datas[i].insurance_price;
                        //备注
                        var memo = (typeof(datas[i].memo) == 'undefined')?'':datas[i].memo;
                        list = list+'<tr>'+
                            '<td>'+(datas[i].username || "")+'</td>'+
                            '<td>'+(datas[i].phone || "")+'</td>'+
                            '<td>'+userType+'</td>';
                        if(productType == 21){
                            //已录入人数
                            var Amount  = getCustomerAmountByHouseType(houseType);

                            //获取该房型在房型数组中的位置
                            var index = $.inArray(houseType,houseArr);
                            //单间人数
                            var number = housePersonNumArray[index];
                            //获取该房型的总容量
                            var totalPersonCount = personAmountArr[index];

                            if(houseType && houseType.indexOf('拼舱')>0){
                            	number = 1;
                            }
                            if(i == 0  || number == 1){
                                list = list +'<td rowspan="'+number+'">'+houseType+'</td>';
                            }else if(datas[i-1].house_type != datas[i].house_type){
                                list = list +'<td rowspan="'+number+'">'+houseType+'</td>';
                                j = i;
                                j = j+number;
                            }else if(j == i) {
                                list = list + '<td rowspan="' + number + '">' + houseType + '</td>';
                                j = j+number;
                            }

                        }else{
                            $("#cangxing").remove();
                        }

                        var identityCard = (typeof(datas[i].identity_card) == 'undefined')?"":datas[i].identity_card;
                        var passport = (typeof(datas[i].passport) == 'undefined')?"":datas[i].passport;
                        if(identityCard != ""){
                            list = list +'<td>身份证 '+identityCard+'</td>'
                        }else if(passport !=""){
                            list = list +'<td>护照 '+passport+'</td>'
                        }else{
                            list = list +'<td></td>'
                        }

                        list = list +'<td>'+gender+'</td>'+
                            '<td>'+userType+'</td>'+
                            '<td>'+insurancePrice+'</td>'+
                            '<td>'+busPrice+'</td>'+
                            '<td>'+memo+'</td>'+
                            '<td>'+
                            '<a class="mt" onclick="editCustomer(\''+datas[i].id+'\')">修改</a><a class="margin-left-15" onclick="deleteCustomer(\''+datas[i].id+'\',\''+datas[i].username+'\')">删除</a>'+
                            '</td>'+
                            '</tr>';
                        var y = 0;
                        //该类房型未满员
                        if(totalPersonCount - Amount > 0){
                            var x = totalPersonCount -Amount;
                            if(x >= number){
                                x = x%number;
                            }
                            //获取不空行的位置(上一房型入住人数+本房型入住人数-1)
                            if(index > 0){
                                for(var t = 0; t < index; t++){
                                    y += personArr[t];
                                }
                                y +=Amount;
                            }else{
                                y +=Amount;
                            }
                            if(i == y - 1 ){
                                for(var k = 0; k < x; k++){
                                    list = list+"<tr>"+
                                        "<td> -- </td>"+
                                        "<td> -- </td>"+
                                        "<td> -- </td>"+
                                        "<td> -- </td>"+
                                        "<td> -- </td>"+
                                        "<td> -- </td>"+
                                        "<td> -- </td>"+
                                        "<td> -- </td>"+
                                        "<td> -- </td>"+
                                        "<td> -- </td>"+
                                        "</tr>";
                                }

                            }
                        }


                    }
                }
                list= list+	'<tr>'+
                    '<td colspan="11" style="text-align: left;background: #FFFCF7;" id="heji">'+
                    '<p class="fright">合计：<span style="color: #FF7F05;" id="adultAmount">'+adultAmount+'</span>成人<span style="color: #FF7F05;" id="childAmount">'+childAmount+'</span>儿童</p>'+
                    '</td>'+
                    '</tr>';
                $('#customerList').html(list);
                if(productType !=21){
                    $("#heji").attr("colspan","10");
                }
            }else{
                Jalert('获取失败, code:' + data.msg);
            }
        }
    })
}
/**
 * 获取订单预定的房型
 */
function getOrderHouse(){
    $.ajax({
        url:getContextPath()+'/order/searchCruiseHouseListByOrderCode.do',
        type:'POST',
        data:{
            'order.code':orderCode
        },
        dataType:'json',
        success:function(data){
            if(data.success == 1){
                var datas = data.datas;
                var options='';
                for(var i = 0; i < datas.length; i++){
                    options = options +' <option value="'+datas[i].house_type+'">'+datas[i].house_type+'</option>'
                }
                $("#houseType").html(options);
                $("#houseType2").html(options);

            }else{
                Jalert('获取失败, code:' + data.msg);
            }
        }
    });
}



/**
 * 添加旅客信息
 */
function addCustomer(){
    if(productType == 21){
        getOrderHouse('add');

    }else{
        $("#type").text('备注');
        $(".category_sub").html('<input class="form-control memo" type="text"/>')
    }


    $("#myModal_add_lvke_info").modal("show");
}

// 根据房型获取该房型已录入的客户数量
function getCustomerAmountByHouseType(houseType){
    var customerAmount = 0;
    $.ajax({
        url:getContextPath()+"/order/getCustomerAmountByHouseType.do",
        type:"post",
        async:false,
        data:{
            "orderUser.orderCode":orderCode,
            "orderUser.houseType":houseType
        },
        dataType:'JSON',
        success:function(data){
            if(data.success == 1){
                customerAmount = data.datas;
            }else{
                Jalert('获取失败, code:' + data.msg);
            }
        }

    });
    return customerAmount;
}

/**
 * 保存旅客信息
 * @returns {boolean}
 */
function saveCustomer(){
    // 姓名
    var userNameArr= [];	//联系人姓名*：
    var usernameReg = /^[\u4E00-\u9FA5A-Za-z_]+$/;
    var flag = true;
    $(".userName").each(function(){
        if(!usernameReg.test($(this).val())){
            Jalert("请输入客户姓名!");
            flag = false;
            return false;
        }else{
            userNameArr.push($(this).val())
        }

    });
    if(!flag){
        $("#commit").attr("onclick","saveCustomer()");
        return false;
    }

    // 类型 报名用户类型：0：成人 1：儿童
    var userTypeArr = [];

    $(".userType").each(function(){
        if($(this).val() == '成人') userType = 0;
        if($(this).val() == '儿童') userType = 1;
        userTypeArr.push(userType);
    });

    // 手机
    var telephoneArr = [];
    //联系方式*
    var telephone = $(".telephone").val();
    var telephoneReg =/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    $(".telephone").each(function(i){
        if(!telephoneReg.test($(this).val())){
            Jalert("请输入正确的手机号!");
            flag = false;
            return false;
        }else{
            telephoneArr.push($(this).val())
        }
    });
    if(!flag){
        $("#commit").attr("onclick","saveCustomer()");
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
    //var passportReg = /(P\d{7})|(G\d{8})/;
    $(".ID").each(function(i){
        //获取证件类型
        var credType = $(this).prev(".idcard").val();
        if(credType == 0){
            if($(this).val() != ''){
                passportArr.push($(this).val());
                identityCardArr.push(null);
            }else{
                Jalert("请输入正确护照号");
                flag = false;
                return false;
            }
        }else if(credType == 1){
            if(!isCardID($(this).val())){
                Jalert("请输入正确的身份证号");
                flag = false;
                return false;
            }else{
                identityCardArr.push($(this).val());
                passportArr.push(null);
            }
        }


    });


    if(!flag){
        $("#commit").attr("onclick","saveCustomer()");
        return false;
    }

    // 拼音：
    //姓
    var fName = $('.fName').val();
    $(".fName").each(function(i){
        var credType = getCredType(this);
        if(credType == 0){
            if($(this).val()!=""){
                pinyinLname.push($(this).val().toUpperCase());
            }else{
                Jalert("请输入姓氏拼音");
                flag=false;
                return false;
            }

        }else if(credType == 1){
            pinyinLname.push(null);
        }

    });

    if(!flag){
        $("#commit").attr("onclick","saveCustomer()");
        return false;
    }

    //名
    $(".lName").each(function(i){
        var credType = getCredType(this);
        if(credType == 0){
            if($(this).val()!=""){
                pinyinFname.push($(this).val().toUpperCase());
            }else{
                Jalert("请输入名字拼音");
                flag=false;
                return false;
            }
        }else if(credType == 1){
            pinyinFname.push(null);
        }

    });
    if(!flag){
        $("#commit").attr("onclick","saveCustomer()");
        return false;
    }

    //出生地
    $("#bornProvince").each(function(i){
        var credType = getCredType(this);
        if(credType == 0){
            if($(this).val() != ""){
                bornProvinceArr.push($(this).val());
            }else{
                Jalert("请输入出生省份");
                flag=false;
                return false;
            }
        }else if(credType == 1){
            bornProvinceArr.push(null);
        }

    });

    if(!flag){
        $("#commit").attr("onclick","saveCustomer()");
        return false;
    }

    // 国籍
    $(".nationality").each(function(i){
        var credType = getCredType(this);
        if(credType == 0){
            if($(this).val() != ""){
                nationalityArr.push($(this).val());
            }else{
                Jalert("请输入国籍");
                flag=false;
                return false;
            }
        }else if(credType == 1){
            nationalityArr.push(null);
        }

    });


    if(!flag){
        $("#commit").attr("onclick","saveCustomer()");
        return false;
    }
    // 生日
    $(".birthday").each(function(i){
        var credType = getCredType(this);
        if(credType == 0){
            if($(this).val()!=""){
                birthdayArr.push($(this).val());
            }else{
                Jalert("请输入出生日期");
                flag=false;
                return false;
            }
        }else if(credType == 1){
            birthdayArr.push(null);
        }

    });

    if(!flag){
        $("#commit").attr("onclick","saveCustomer()");
        return false;
    }
    // 签发地
    $("#passportProvince").each(function(i){
        var credType = getCredType(this);
        if(credType == 0){
            if($(this).val()!=""){
                passportProvinceArr.push($(this).val());
            }else{
                Jalert("请输入护照签发省份");
                flag=false;
                return false;
            }
        }else if(credType == 1){
            passportProvinceArr.push(null);
        }

    });
    if(!flag){
        $("#commit").attr("onclick","saveCustomer()");
        return false;
    }
    // 签发时间
    $(".passport_date").each(function(i){
        var credType = getCredType(this);
        if(credType == 0){
            if($(this).val()!=""){
                passportDateArr.push($(this).val());
            }else{
                Jalert("请输入发证日期");
                flag=false;
                return false;
            }
        }else if(credType == 1){
            passportDateArr.push(null);
        }

    });
    if(!flag){
        $("#commit").attr("onclick","saveCustomer()");
        return false;
    }
    // 签发有效时间
    $(".valid_date").each(function(i){
        var credType = getCredType(this);
        if(credType == 0){
            if($(this).val()!=""){
                validDateArr.push($(this).val());
            }else{
                Jalert("请输入签发有效时间");
                flag=false;
                return false;
            }
        }else if(credType == 1){
            validDateArr.push(null);
        }

    });
    if(!flag){
        $("#commit").attr("onclick","saveCustomer()");
        return false;
    }


    // 性别:1：男，0：女
    var genderArr = [];

    $(".gender").each(function(){
        if($(this).val() == '男') gender = 1;
        if($(this).val() == '女') gender = 0;
        genderArr.push(gender);
    });
    if(productType == 21){
        //预定舱型
        var houseTypeArr = [];
        //根据房型获取该房型已录入的客户数量
        var houseType = $("#houseType option:selected").val();
        //已录入人数
        var Amount  = getCustomerAmountByHouseType(houseType);
        //获取该房型在房型数组中的位置
        var index = $.inArray(houseType,houseArr);
        //获取该房型的总容量
        var totalPersonCount = personAmountArr[index];
        if(totalPersonCount - Amount > 0){
            houseTypeArr.push(houseType)
        }else{
            alert("该舱型已满员，请选择其他舱型！");
            return false;
        }
    }else{
        // 备注
        var memoArr = [];
        var memo = $('.memo').val();
        $(".memo").each(function(){
            memoArr.push($(this).val())
        });
    }



    //将页面输入的信息组装到对象数组中
    var array = [];
    for(var j=0;j<userNameArr.length;j++){
        var orderUser={};
        //姓名
        orderUser.username=userNameArr[j];
        //用户类型
        orderUser.userType = userTypeArr[j];
        //手机
        orderUser.phone = telephoneArr[j];
        //护照
        orderUser.passport=passportArr[j];
        //身份证号
        orderUser.identityCard = identityCardArr[j];
        //性别
        orderUser.gender=genderArr[j];
        if(productType == 21){   // 预定舱型
            if(houseTypeArr.length  == 0){
                return false;
            }else{
                orderUser.houseType = houseTypeArr[j];
            }

        }else{
            // 备注
            orderUser.memo = memoArr[j];
        }

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
    //可容纳总人数
    //var totalCount = 0;
    //已有客户人数
    var amount = parseInt($("#childAmount").text())+parseInt($('#adultAmount').text());
    if(productType == 21){
        var totalCount = $("#count").text();
        //还能容纳人数
        var number = totalCount - amount;
        if(array.length > number){
            alert('预定舱型已满员，请删减人数后再添加！');
            return false;
        }
    }else{
        var totalCount = $("#num").text();
        var number = totalCount - amount;
        if(array.length > number){
            alert('超出预定人数，请删减人数后再添加！');
            return false;
        }
    }
    $.ajax({
        url:getContextPath()+"/order/saveCustomer.do",
        type:"post",
        data:{
            "dataJSON":JSON.stringify(array),
            "order.code":orderCode
        },
        dataType:"JSON",
        success:function(data){
            if(data.success == 1){
                Jalert("添加旅客信息成功！");
                $('#myModal_add_lvke_info').modal('hide');
                //load();
                getCustomerInfo();
            }else{
                Jalert("添加旅客信息失败！");
                commitRemove();
            }
        }
    });
}

//获取证件类型
function getCredType(node){
    var tr1 = $(node).parent().parent().prev();
    var tr2 = tr1.prev();
    //获取类型
    var credType = tr2.children().children(".idcard").val();
    return credType;
}

/**
 * 删除旅客信息
 * @param id
 */
function deleteCustomer(id,name){

    if(confirm("确定要删除旅客 ("+name+")  吗？")){
        searchCustomerById(id);
        //删除
        $.ajax({
            url:getContextPath()+"/order/delectOrderUserById.do",
            type:"post",
            data:{
                'orderUser.id':id,
            },
            dataType:"JSON",
            success:function(data){
                if(data.success== 1){
                    Jalert("删除成功！");
                    //load();
                    getCustomerInfo();
                }else{
                    Jalert("删除失败！");
                }
            }
        });
        updateOrder();
    }
    return false;
}


/**
 * 显示或隐藏护照信息
 */
function showOrHideHuZhaoInfo(){
    if($('.idcard').val() == 0){
        $('.huzhao-info-head').show();
        $('.huzhao-info-body').show();
    }else{
        $('.huzhao-info-head').hide();
        $('.huzhao-info-body').hide();
    }

    if($('#passportType').val() == 0){
        $('.huzhao-info-head:eq(1)').show();
        $('.huzhao-info-body:eq(1)').show();
    }else{
        $('.huzhao-info-head:eq(1)').hide();
        $('.huzhao-info-body:eq(1)').hide();
    }
}
/**
 * 查询旅客信息
 * @param id
 */
function searchCustomerById(id){
    $.ajax({
        url:getContextPath()+'/order/selectOrderUserById.do',
        data:{
            'orderUser.id':id
        },
        async: false,
        type:'POST',
        dataType:'JSON',
        success:function(data){
            if(data.success == 1){
                var datas = data.datas;
                var insurance_price = (datas.insurance_price == undefined)?0:datas.insurance_price;
                var bus_price = (datas.bus_price == undefined)?0:datas.bus_price;
                var insuranceAndBusPrice = parseInt(insurance_price)+parseInt(bus_price);
                var total_price =$('#orderPrice').text();
                total_price = total_price - insuranceAndBusPrice;
                $('#orderPrice').text(total_price);
                $('#pay2').text(total_price);
                price = total_price;
            }

        }

    });
}

/**
 * 修改旅客信息
 * @param id
 */
function editCustomer(id){

    $.ajax({
        url:getContextPath()+'/order/selectOrderUserById.do',
        data:{
            'orderUser.id':id
        },
        type:'POST',
        dataType:'JSON',
        success:function(data){
            if(data.success == 1){
                var datas = data.datas;
                //房型
                houseType1 = datas.house_type;
                if(datas.house_type == undefined){
                    $(".category_sub").html("- - - -");
                }else{
                    $("#houseType2").val(datas.house_type);
                }
                $('#hideId').val(datas.id);
                //姓名
                $('#name').val(datas.username);
                //类型
                var userType = datas.user_type;
                if(userType == 0){
                    $('#userType').val(0);
                }
                if(userType == 1){
                    $('#userType').val(1);
                }
                //手机
                $('#phone').val(datas.phone);
                //证件
                var passport =(typeof (datas.passport) == 'undefined')?"":datas.passport;
                if(passport != ""){
                    //证件类型
                    $('#passportType').val(0);
                    //证件号
                    $("#passport").val(datas.passport);
                    $('.huzhao-info-head:eq(1)').show();
                    $('.huzhao-info-body:eq(1)').show();
                    //拼音
                    $('#xing').val(datas.pinyin_lname);
                    $('#ming').val(datas.pinyin_fname);
                    //出生地
                    $('#csd').val(datas.born_province);
                    //国籍
                    $('#guoji').val(datas.nationality);
                    //生日
                    $('#birthday').val(datas.birthday);
                    //签发地
                    $('#qfd').val(datas.passport_province);
                    //签发时间
                    $('#qfsj').val(datas.passport_date);
                    //签发有效时间
                    $('#qf_valid_date').val(datas.valid_date);
                }
                var identity_card =(typeof (datas.identity_card) == 'undefined')?"":datas.identity_card;
                if(identity_card != ""){
                    //证件类型
                    $('#passportType').val(1);
                    //证件号
                    $("#passport").val(datas.identity_card);
                    $('#xing').val('');
                    $('#ming').val('');
                    //出生地
                    $('#csd').val('');
                    //国籍
                    $('#guoji').val('');
                    //生日
                    $('#birthday').val('');
                    //签发地
                    $('#qfd').val('');
                    //签发时间
                    $('#qfsj').val('');
                    //签发有效时间
                    $('#qf_valid_date').val('');
                    $('.huzhao-info-head:eq(1)').hide();
                    $('.huzhao-info-body:eq(1)').hide();
                }
                //性别
                if(datas.gender == 1){
                    $('#gender').val(1);
                }else{
                    $('#gender').val(0);
                }

                //大巴
                var busPrice = datas.bus_price;
                if(busPrice != null){
                    $("#bus").prop("checked",true);
                }else{
                    $("#bus").prop("checked",false);
                }
                $("#bus").val(bus);
                $(".busPrice").text(bus);
                //保险
                var insurancePrice = datas.insurance_price;
                if(insurancePrice != null){
                    $("#insurance").prop("checked",true);
                }else{
                    $("#insurance").prop("checked",false);
                }
                $("#insurance").val(insurance);
                $(".insurancePrice").text(insurance);
                // 备注
                $('#bz').val(datas.memo);
                $('#myModal_revise_lvke_info').modal('show');
            }else{
                Jalert('获取失败, code:' + data.msg);
                commitRemove();
            }
        }

    });
}


/**
 * 保存编辑后的旅客信息
 */
function saveEdit(){
    //获取修改后的信息
    //预定舱型
    var houseType = $("#houseType2 option:selected").val();

    //已录入人数
    var Amount  = getCustomerAmountByHouseType(houseType);
    //获取该房型在房型数组中的位置
    var index = $.inArray(houseType,houseArr);
    //获取该房型的总容量
    var totalPersonCount = personAmountArr[index];
    if(totalPersonCount - Amount <= 0 && houseType!=houseType1){
        alert("该舱型已满员，请选择其他舱型！");
        return false;
    }
    var userId = $('#hideId').val();
    //姓名
    var name = $('#name').val();
    var usernameReg = /^[\u4E00-\u9FA5A-Za-z_]+$/;
    if(!usernameReg.test(name)){
        Jalert("请输入客户姓名!");
        return false;
    }
    //类型
    var userType = $('#userType option:selected').val();
    // 	手机
    var phone = $('#phone').val();
    var telephoneReg =/^1[0-9]{10}$/;
    if(!telephoneReg.test(phone)){
        Jalert("请输入正确的手机号!");
        return false;
    }
    // 	证件
    //获取证件类型
    var passportType = $('#passportType option:selected').val();
    if(passportType == 0){

        var passport = $('#passport').val();
//        var passportReg = /(P\d{7})|(G\d{8})/;
//        if(!passportReg.test(passport)){
//            Jalert("请输入正确的护照号!");
//            return false;
//        }
        //拼音
        var lastName = $('#xing').val().toLocaleUpperCase();
        var pingyinReg =  /^[A-Za-z]+$/;
        if(!pingyinReg.test(lastName)){
            Jalert("请输入姓氏的拼音!");
            return false;
        }
        var firstNname = $('#ming').val().toLocaleUpperCase();
        if(!pingyinReg.test(firstNname)){
            Jalert("请输入名的拼音!");
            return false;
        }
        // 	出生地
        var born_province = $('#csd').val();
        if(born_province == null || born_province == ''){
            Jalert("请输入出生地!");
            return false;
        }
        // 	国籍
        var nationality = $('#guoji').val();
        if(nationality == null || nationality == ''){
            Jalert("请输入国籍!");
            return false;
        }
        // 生日
        var birthday = $('#birthday').val();
        if(birthday == null || birthday == ''){
            Jalert("请输入生日!");
            return false;
        }
        // 	签发地
        var passport_province = $('#qfd').val();
        if(passport_province == null || passport_province == ''){
            Jalert("请输入签发地!");
            return false;
        }
        // 	签发时间
        var passport_date = $('#qfsj').val();
        if(passport_date == null || passport_date == ''){
            Jalert("请输入签发时间!");
            return false;
        }
        // 	签发有效时间
        var valid_date = $('#qf_valid_date').val();
        if(valid_date == null || valid_date == ''){
            Jalert("请输入签发有效时间!");
            return false;
        }

    }else{
        var identity_card = $('#passport').val();
        if(!isCardID(identity_card)){
            Jalert("请输入正确的身份证号");
            return false;
        }
    }
    // 	性别
    var gender = $("#gender").val();
    //保险
    var insurancePrice = "";
    if( $("#insurance").is(":checked")){
        insurancePrice = $("#insurance").val();
    }else{
        insurancePrice = "";
    }
    //大巴
    var busPrice = "";
    if( $("#bus").is(":checked") ){
        busPrice = $("#bus").val();
    }else{
        busPrice = "";
    }
    // 	备注
    var memo = $('#bz').val();
    updateOrder();
    //修改客户信息
    $.ajax({
        url:getContextPath()+'/order/updateOrderUserById.do',
        data:{
            'orderUser.houseType':houseType,
            'orderUser.id':userId,
            'orderUser.username':name,
            'orderUser.userType':userType,
            'orderUser.phone':phone,
            'orderUser.passport':passport,
            'orderUser.identityCard':identity_card,
            'orderUser.pinyinLname':lastName,
            'orderUser.pinyinFname':firstNname,
            'orderUser.bornProvince':born_province,
            'orderUser.nationality':nationality,
            'orderUser.passportProvince':passport_province,
            'orderUser.passportDate':passport_date,
            'orderUser.validDate':valid_date,
            'orderUser.gender':gender,
            'orderUser.insurancePrice':insurancePrice,
            'orderUser.busPrice':busPrice,
            'orderUser.memo':memo,
            'orderUser.birthday':birthday
        },
        type:'POST',
        dataType:'',
        success:function(data){
            if(data.success==1){
                Jalert('修改成功！');
                $('#myModal_revise_lvke_info').modal('hide');
                load();
            }else{
                Jalert('修改失败, code:' + data.msg);
                commitRemove();
            }
        }

    });


}
/**
 * 修改订单价格
 */
function updateOrder(){
    $.ajax({
        url:getContextPath()+'/order/editOrder.do' ,
        type:'POST',
        data:{
            'order.code':orderCode,
            'order.Price':price
        },
        dataType:'JSON',
        success:function(data){

        }
    });
}
//取消或选择保险大巴时重新计算价格

function chooseCheckbox(node){
    var flag = node.checked;
    var busPrice = node.value;
    if(flag){
        //选中
        price +=parseInt(busPrice);
    }else{
        //未选中
        price -=busPrice;
    }


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

function orderStatus(s){
    var status = '';
    if (s == 1)status = '待支付';
    if (s == 2)status = '已支付定金待审核';
    if (s == 3)status = '<font color="green">已支付定金</font>';
    if (s == 4)status = '已拒绝';
    if (s == 5)status = '已取消';
    if (s == 7)status = '已支付全款待审核';
    if (s == 8)status = '<font color="green">已支付全款</font>';
    if (s == 9)status = '直客订单';
    if (s == 11)status = '申请特价';
    if (s == 12)status = '申请特价通过';
    if (s == 13)status = '退款待审核';
    if (s == 14)status = '<font color="red">退款完成</font>';
    if (s == 15)status = '换房型';
    if (s == 16)status = '订单激活';
    return status;
}


//审核
function check(data){
    var datas = JSON.parse(unescape(data));
    $('#order_code').val(datas.order_code);
    $('#myModal_order_sh').modal('show');
}
//审核通过或不通过
function passOrNoPass(){
//	订单编号
    var code = $('#order_code').val();
    var flag = $('input:radio:checked').val();
    if(flag == '通过') approve(code);
    if(flag == '不通过') reject(code);
}


//审核通过
function approve(code){
    if(confirm("确认审核通过?")){
        $.ajax({
            url:getContextPath()+"/order/editOrderStatus.do",
            type:'post',
            data:{"order.code":code,
                "order.status": 12
            },
            dataType:'json',
            success:function(data){
                if(data.success==1){
                    alert("审核完成！");
                    searchOrderSchedule(code);
                    orderInfo();
                }else{
                    alert("审核失败！");
                    searchOrderSchedule(code);
                    orderInfo();
                }
                $('#myModal_order_sh').modal('hide');
                $("body").css("overflow-y", "auto");
            }
        });
    }
}
//审批拒绝
function reject(code) {
    if(confirm("确认拒绝?")) {
        $.ajax({
            url:getContextPath()+"/order/orderApprove.do",
            type:'post',
            data:{
                "order.code":code,
                "order.status": 4
            },
            dataType:'json',
            success:function(data){
                if(data.success==1){
                    alert("审核完成！");
                    searchOrderSchedule(code);
                    orderInfo();
                }else{
                    alert("审核失败！");
                    searchOrderSchedule(code);
                    orderInfo();
                }
                $('#myModal_order_sh').modal('hide');
                $("body").css("overflow-y", "auto");
            }
        });
    }
}


/**
 * 获取客户信息
 */
function getCustomerList(){
    var customerList = null;
    $.ajax({
        url:getContextPath()+'/order/searchOrderCustomer.do',
        type:'POST',
        async: false,
        data:{
            'order.code':orderCode
        },
        dataType:'json',
        success:function(data){
            if(data.success == 1){
                customerList = data.datas;
            }else{
                Jalert('获取失败, code:' + data.msg);
            }
        }
    });
    return customerList;
}


//导出旅客名单
function exportCustomerExcel(){
    var list = getCustomerList();
    if(list.length == 0){
        alert("该订单还未录入旅客信息，请录入后再进行导出！");
        return false;
    }
    var resName = $("#productName").text();
    var orderCode = $("#orderCode").text();
    var customerType = ($("#customerType").text() == '直客')?1:2;
    var flag= confirm("确定导出【"+resName+"】的旅客信息吗？");
    if(flag){
        Jalert("正在导出");
        $("#categorySub").val(productType);
        $("#code").val(orderCode);//订单号
        $("#opName").val(sell);//销售
        $("#customer_type").val(customerType);//客户类型
        if(flag){
            Jalert("正在导出");
            $("#form_condition").attr("action",getContextPath()+"/order/exportCustomerExcel.do");
            $("#form_condition").submit();
        }
    }
}


//导入旅客名单
function importCustomerExcel(){
    $("#myModal_mddr").modal("show");
}

//下载模板
function downloadCustomerExcel(){
    $("#importExcel").attr("action",getContextPath()+"/order/downloadCustomerExcel.do");
    $("#importExcel").submit();
}

//导入
function importExcel() {
    //获取预定总人数
    var count = 0;
    if(productType == 21){
        count = $("#count").text();
    }else{
        count = $("#num").text();
    }
    $("#importExcel").attr("action","");
    var fileName = document.getElementById("inputFile").value;
    var postfix = fileName.substring(fileName.lastIndexOf("."),fileName.length);
    if(postfix!=".xls" && postfix!=".xlsx"){
        alert("格式错误，请按照模板格式上传");
        return false;
    }else{
        $.ajaxFileUpload({
            url:getContextPath() + "/order/importCustomerExcel.do",
            data: {
                'order.code':orderCode,
                'order.categorySub':productType, // 产品类型
                'order.num':count
            },
            dataType:"json",
            fileElementId:"inputFile",
            success:function(data){
                if(data.success==1){
                    /* $("input[type=file]").on("change",fileBtnChange);
                     commitRemove();*/
                    alert("导入成功!");
                    $("#myModal_mddr").modal('hide');
                    load();
                }else{
                    if(data.msg != null && data.msg != ''){
                        alert(data.msg);
                    }else{
                        Jalert("导入失败!");
                    }
                    commitRemove();
                }
            }
        });


    }


}
function selectOpMoney(){
	var opMoney;
	$.ajax({
		url:getContextPath()+"/order/searchOrderSchedule.do",
		type:'post',
		async: false,
		data: {
			'order.code': orderCode
		},
		dataType:'json',
		success:function(data) {
			if(data.success==1) {
				var datas = data.datas;
				opMoney = datas[0].op_price;
			}
		}
	});
	return opMoney;
}


