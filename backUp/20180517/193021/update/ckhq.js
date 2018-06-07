/**
 * Created by Administrator on 2018/1/8.
 */
var code,cruiseId,days,title,productType,str;
var pageNum = 1;
function initPage(){
    title = getUrlParam("title");//获取产品名称
    cruiseId = getUrlParam("cruiseId");//获取游轮id
    days = getUrlParam("days");//获取出行天数
    code = getUrlParam("code");
    str = getUrlParam("str");//查看产品的班期管理还是审核班期
    if(str == "checkVersion") $("#addVoyage").hide();
    productType = getUrlParam("productType");
    $("#title").text("产品名称："+ unescape(title));
    voyageList(pageNum);
    $("#myModal_add_banqi_info").hide();
}


/**
 *添加班期
 */
function addSailing(){
        if(productType == 21){
           window.location.href=getContextPath() + '/manager/resource/addVoyage.jsp?id=1&code='+code+'&cruiseId='+cruiseId+"&title="+escape(title)+"&days="+days+"&productType="+productType;
        }else{
            $("#myModal_add_banqi_info input").val('');
            $("#update_bq").attr('onclick','save_bq()');
            $("#myModal_add_banqi_info").modal('show');
        }
}

//取消body滚动条取消，加上模态框滚动条
function dismissModel() {
    $("#myModal_add_banqi_info").modal('hide');
}
/**
 * 保存班期
 */
function save_bq(vid){
    var startDate = $("#bq_startDate").val();
    if(startDate == null || startDate ==""){
        Jalert("选择出发时间");
        return false;
    }
    var date  = new Date(startDate);
    date.setDate(date.getDate()+parseInt(days));
    var endDate = date.Format("yyyy-MM-dd");
    var bq_title = $("#bq_title").val();
    var description = $("#bq_description").val();
    var totalNum = $("#num").val();
    var num = $("#sy_num").val();
    var umPrice = $("#um_price").val();
    var traderPrice = $("#trader_price").val();
    var price = $("#price").val();
    $.ajax({
        url:getContextPath()+"/resource/saveVoyage.do",
        type:'post',
        data:{
            "productVersion.id":vid,
            "productVersion.resCode":code,
            'productVersion.startDate':startDate,
            'productVersion.endDate':endDate,
            'productVersion.title':bq_title,
            'productVersion.description':description,
            'productVersion.totalNum':totalNum,
            'productVersion.num':num,
            'productVersion.umPrice':umPrice,
            'productVersion.traderPrice':traderPrice,
            'productVersion.price':price,
            'productVersion.status':0
        },
        dataType:'json',
        success:function(data){
            if(data.success == 1){
                $("#myModal_add_banqi_info input").val('');
                $("#myModal_add_banqi_info").hide();
                Jalert("添加成功");
            }else{
                Jalert("添加失败");
            }
            window.location.href=getContextPath()+"/manager/resource/ckhq.jsp?code="+code+"&cruiseId="+cruiseId+"&title="+escape(title)+"&days="+days+"&productType="+productType;
        }
    })
}
/**
 * 班期列表
 */
function voyageList(pageNum){
    $.ajax({
        url:getContextPath()+"/resource/searchVoyageList.do",
        type:'post',
        data: {"resource.code":code,
            'pager.pageNum': pageNum,
            'pager.pageSize': 10
        },
        dataType:'json',
        success:function(data){
            if(data.success==1){
                if(data.datas == null || data.datas.length == 0) {
                    $('#resourceVersionList').empty();
                    $('#pager').empty();
                    $('#noresult').show();
                    return;
                } else {
                    $('#resourceVersionList').empty();
                    $('#noresult').hide();
                }
                rendList(data);
                renderPager(data.pager, 'voyageList');
            }else{
                Jalert(data.msg);
            }
        }
    })
}

function rendList(data){
    var datas = data.datas;
    var list = "";
    for(var i = 0; i < datas.length; i++){
    	//通过id查询行程
    	var id = datas[i].id;
    	var type = selectDescribeType(id);
        var logo = '';
        if(productType ==21){
            logo = '<td><span class="type-icon glyphicon type-icon-youlun"></span>邮轮</td>';
        }else if(productType == 22){
            logo = '<td><span class="type-icon glyphicon type-icon-zijia"></span>自驾</td>';
        }else if(productType == 23){
            logo = '<td><span class="type-icon glyphicon glyphicon-star type-icon-jingpin"></span>精品游</td>';
        }else{
            logo = '<td></td>';
        }
        list = list +
            '<tr>';
            if(productType == 21){
               list = list+'<td><a href="'+getContextPath()+'/manager/resource/voyage.jsp?id='+datas[i].id+'&code='+code+'&cruiseId='+cruiseId+'&days='+days+'&crusieLimit='+datas[i].crusie_limit+'&title='+escape(title)+'&productType='+productType+'" target="right">'+datas[i].id+'</a></td>'+
                    '<td style="text-align:center;vertical-align:middle;">'+datas[i].versionTitle+'</td>'+
                     logo+
                    '<td>'+datas[i].startDate+'</td>';
            }else{
                list = list+'<td><a onclick="serarch_bq(\''+datas[i].id+'\')">'+datas[i].id+'</a><br></td>'+
                '<td style="text-align:center;vertical-align:middle;">'+datas[i].versionTitle+'</td>'+
                 logo+
                '<td>'+datas[i].startDate+'</td>';
            }
            if(datas[i].status== 0){
                list=list+'<td ><span style="color:red">待审核<span></td>';
            }else if(datas[i].status== 1)
                list=list+'<td ><span style="color:#00ce3f">审核通过<span></td>';
            else{
                list=list+'<td ><span style="color:#999">下线<span></td>';
            }
        list = list+
            '<td>';
        if(str == "proSearch"){
        	if(productType == 21){
        		list = list+'<a href="'+getContextPath()+'/manager/resource/addVoyage.jsp?id='+datas[i].id+'&code='+code+'&cruiseId='+cruiseId+'&days='+days+'&crusieLimit='+datas[i].crusie_limit+'&title='+escape(title)+'&productType='+productType+'">编辑班期</a><br>';
        	}else{
        		list = list+'<a onclick="serarch_bq(\''+datas[i].id+'\')">编辑班期</a><br>';
        	}
        	list=list+'<a onclick="checkEditDescribePermission(\''+datas[i].resCode+'\',\''+datas[i].days+'\')">&nbsp;编辑产品行程</a><br />';
        	if(type == 0){//新增班期行程
        		list=list+'<a onclick="checkVersionEditDescribePermission(\''+datas[i].resCode+'\',\''+datas[i].id+'\',\''+datas[i].days+'\')">&nbsp;新增班期行程</a><br />';
        	}else{//编辑班期行程
        		list=list+'<a onclick="checkVersionEditDescribePermission(\''+datas[i].resCode+'\',\''+datas[i].id+'\',\''+datas[i].days+'\')">&nbsp;编辑班期行程</a><br />';
        	}
        }
        if(str == "checkVersion"){

            if(datas[i].status== 0){
                list=list+'<a onclick="checkCheckPermission(\''+datas[i].status+'\',\''+datas[i].id+'\')"><span style="color:red">审核班期</span></a><br />'
            }else{
                list=list+'<a onclick="checkCheckPermission(\''+datas[i].status+'\',\''+datas[i].id+'\')"><span style="color:#0032bd">审核班期</span></a><br />'
            }
        }
            list = list+'</td>'+
            '</tr>';
    }
    $("#resourceVersionList").html(list);
}
/*
 * 查询行程
 */
function selectDescribeType(id){
	var type = 0;//没有班期行程
	$.ajax({
		url:getContextPath()+"/resource/searchSchedule.do",
		type:'post',
		async:false,
		data:{'scheDescribe.resourceCode':code,
			'scheDescribe.vid':id
		},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				if(data.datas != null && data.datas.length != 0){
					type = 1;//存在班期行程
				}
			}else{
				Jalert("系统出错，请联系管理员");
			}
		}
	});
	return type;
}
/*
 * 编辑产品行程
 */
//
function checkEditDescribePermission(code,days){
	$.ajax({
		url:getContextPath()+"/resource/checkEditDescribePermission.do",
		type:'post',
		data:{},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				window.location.href=getContextPath()+"/resource/toEditDescribe.do?a=edit&ret=list&days="+days+"&code="+code+"&resource.code="+code;
			}else{
				Jalert(data.msg);
			}
		}
	});
}
/*
 * 编辑班期行程
 */
//
function checkVersionEditDescribePermission(code,id,days){
	$.ajax({
		url:getContextPath()+"/resource/checkEditDescribePermission.do",
		type:'post',
		data:{},
		dataType:'json',
		success:function(data){
			if(data.success==1){
				window.location.href=getContextPath()+"/resource/toEditDescribe.do?a=edit&ret=list&days="+days+"&code="+code+"&vid="+id+"&resource.code="+code;
			}else{
				Jalert(data.msg);
			}
		}
	});
}
/**
 * 查询班期
 * @param vid
 */
function serarch_bq(vid){
    $.ajax({
        url:getContextPath()+"/resource/searchResourceVersion.do",
        type:'post',
        data:{'productVersion.id':vid},
        dataType:'json',
        success:function(data){
            var datas = data.datas;
            if(data.success==1){
                $("#bq_startDate").val(datas.startDate);
                $("#bq_title").val(datas.title);
                $("#bq_description").val(datas.description);
                $("#num").val(datas.totalNum);
                $("#sy_num").val(datas.num);
                $("#um_price").val(datas.umPrice);
                $("#trader_price").val(datas.traderPrice);
                $("#price").val(datas.price);
                $("#myModal_add_banqi_info").modal('show');
                $("#lblAddTitle").text("编辑班期信息");
                $("#update_bq").attr('onclick','save_bq(\''+datas.id+'\')');
            }else{
                Jalert("系统出错，请联系管理员");
                commitRemove();
            }
        }
    });
}
//检查是否具有审核权限
function checkCheckPermission(status,id){
	var flag=true;
	if(status==2 && id==''){
	  flag = confirm("确定下线吗?");
	}
	 if(flag){
		if(id!='')
		 initMyModal_check(status,id);	
		else
		 batchCheck(status);
	}
}
//初始化审核模态框
function initMyModal_check(status,code){
	$("#hiddenCode").val(code);
	$("input[type=radio]").prop("checked",false);
	$("input[value='"+status+"']").prop("checked",true);
	$("#myModal_check").modal("show");
}
//提交审核
function check(){
    $.ajax({
        url:getContextPath()+"/resource/passCheckByproductVersion.do",
        type:'post',
        data:{'productVersion.id':$("#hiddenCode").val(),
            'productVersion.status':$("input[type='radio']:checked").val()
        },
        dataType:'json',
        success:function(data){
            if(data.success==1){
                $("#myModal_check").modal("hide");
                Jalert("修改成功");
                voyageList(1);
            }else{
                Aalert(data.msg);
            }
        }
    });
}

//批量提交审核
function batchCheck(status){
	var ress=[];
	$("input[name='list']:checked").each(function(){
		var resource={};
		resource.code=$(this).val();
		resource.status=status;
		ress.push(resource);
	});
	if(ress.length==0){
		Jalert("没有勾选产品");
		return false;
	}
	$.ajax({
		url:getContextPath()+"/resource/passBatchCheckByResourceInfo.do",
		type:'post',
		data:{'data':JSON.stringify(ress)
			  },
		dataType:'json',
		success:function(data){
			if(data.success==1){
				voyageList(1);
				Jalert("修改成功");
			}else{
				Jalert(data.msg);
			}
		}
	});
}

