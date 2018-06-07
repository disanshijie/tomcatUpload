/**
 * 获取项目常量
 */
var Constants={
		ISENABLE:"可用",
		DISENABLE:"停用",
		
		STARTUSING:"启用",
		LOGOUT:"注销",
		
		LEVEL0:"超级管理员",
		LEVEL1:"联盟成员",
		LEVEL2:"一般同业",
		
		TYPE0:"机票业务",
		TYPE1:"旅游业务",
		
		STATUS0:"审核中",
		STATUS1:"发布中",
		STATUS2:"过期",
		
		TRADER_LEVEL0:"所有",
		TRADER_LEVEL1:"一级",
		TRADER_LEVEL2:"二级",
		TRADER_LEVEL3:"三级",
		
		SUPERADMIN:"superadmin"
		
};
//产品分类
function rendCategory(c) {
	if(c == 0) return '超级管理员';
	if(c == 1) return '机票业务';
	if(c == 2) return '旅游业务';
	
	if(c == 11) return '国际机票';
	if(c == 12) return '国内机票';
	
	if(c == 21) return '邮轮';
	if(c == 22) return '自驾游';
	if(c == 23) return '精品游';
}
//订单状态
function rendStatus(s) {
	if(s == 1) return '<font color="#FF7F05">待支付</font>';
	if(s == 2) return '<font color="#333">定金待审核</font>';
	if(s == 3) return '<font color="#00ce3f">已支付定金</font>';
	if(s == 4) return '<font color="red">已拒绝</font>';
	if(s == 5) return '<font color="#333">已取消</font>';
	if(s == 7) return '<font color="#333">全款待审核</font>';
	if(s == 8) return '<font color="#00ce3f">已支付全款</font>';
	if(s == 9) return '<font color="#333">第三方订单</font>';
	if(s == 11) return '<font color="#333">特价申请中</font>';
	if(s == 12) return '<font color="#333">申请特价通过</font>';
	if(s == 13) return '<font color="#333">退款待审核</font>';
	if(s == 14) return '<font color="#333">退款完成</font>';
}

/**
 * 获取项目的contextPath
 * 返回的结果是: '/triprice'
 */
function getContextPath() {
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0,index+1);
    return "";
    //return "";
}

/**
 * 获取URL传过来的参数
 * @param name 参数名
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
//校验手机号
function validPhone(phone) {
	var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
	return myreg.test(phone);
}
/**
 * 
 */
var fatherBody = $(parent.document.body);
$(".container-fluid").click(
  function(){
	  fatherBody.find(".li-border").removeClass("open");
	  }
);

//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
//例子： 
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
 var o = {
     "M+": this.getMonth() + 1, //月份 
     "d+": this.getDate(), //日 
     "h+": this.getHours(), //小时 
     "m+": this.getMinutes(), //分 
     "s+": this.getSeconds(), //秒 
     "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
     "S": this.getMilliseconds() //毫秒 
 };
 if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
 for (var k in o)
 if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
 return fmt;
}
//调用  var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss"); 

/**
 * 根据日期计算星期几
 * @param date
 * @returns {*}
 */
function getMyDay(date){
	var week;
	if(date.getDay()==0) week="周日"
	if(date.getDay()==1) week="周一"
	if(date.getDay()==2) week="周二"
	if(date.getDay()==3) week="周三"
	if(date.getDay()==4) week="周四"
	if(date.getDay()==5) week="周五"
	if(date.getDay()==6) week="周六"
	return week;
}

//得到公告的条数
function searchNoticeCount(){
	//待审批条数
	var aCount = 0;
	//已催单条数
	var nCount = 0
	$.ajax({
		url:getContextPath()+"/system/searchIsEnableNoticeCount.do",
		type:'post',
		data:{},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				for(var i = 0; i < data.datas.length; i++){
					if(data.datas[i].busType == 1)nCount++;
					if(data.datas[i].busType == 2)aCount++;
				}
				$("#noticeCount").text(nCount);
				$("#approveCount").text(aCount);
				var total = aCount+nCount;
				$("#total").text(total);
				var bell_Num = data.datas;
				if(bell_Num == 0){
					$("#bell").addClass("glyphicon-bell");
				}else{
					$("#bell").addClass("icon-bell");
				}
			}else{
				Jalert(data.msg);
			}
		}
	});

}


//上传水单图片
function uploadImg(){
	// 验证图片格式
	var ext = '.jpg.jpeg.gif.bmp.png.';
	var f0 = $("#pic").val();
	var f = $("#pic").val();
	if (f =="") {
		Aalert("请上水单图片！");
		return false;
	}
	f = f.substr(f.lastIndexOf('.') + 1).toLowerCase();
	if (ext.indexOf('.' + f + '.') == -1) {
		alert("图片格式不正确！");
		return false;
	}
	$.ajaxFileUpload({
		url:getContextPath() + "/trader/uploadFile.do?pathDirect=financeImg&fileFileName="+f0,
		dataType:"json",
		fileElementId:"inputFile",
		success:function(data){
			// 接收图片路径，给隐藏域赋值
			$("#financePicUrl").val(data);
			deposit();
			$("input[type=file]").on("change",fileBtnChange);
		}
	});
}

//格式化数字、金额、保留几位小数等
function number_format(number, decimals, dec_point,roundtag) {
	/*
	 * 参数说明：
	 * number：要格式化的数字
	 * decimals：保留几位小数
	 * dec_point：小数点符号
	 * thousands_sep：千分位符号
	 * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
	 * */
	number = (number + '').replace(/[^0-9+-Ee.]/g, '');
	roundtag = roundtag || "ceil"; //"ceil","floor","round"
	var n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	//sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function (n, prec) {

			var k = Math.pow(10, prec);
			//console.log();

			return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec*2))).toFixed(prec*2)) / k;
		};
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	//var re = /(-?\d+)(\d{3})/;
	//while (re.test(s[0])) {
	//    s[0] = s[0].replace(re, "$1" + sep + "$2");
	//}

	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}