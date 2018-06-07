var productType=21, cruiseComp, startDate, days, price,pageNum,title,sortField,sortType,startCity,shippingLine;
var UPLOAD_RESOURCE_IMG = '/upload/resource/img/';
var ctx = getContextPath();
var from = getUrlParam("from");
//邮轮公司ID
var cpId = getUrlParam("cpid");
function load() {
    loadWait();
    searchCruiseDestList();
    searchCruiseCompList();
    createSTime();
    pageNum=1;
    if(from == 'eventown'){
        url = '/index/eventown-hot-detail.jsp';
    }else if(from == 'china60'){
        url = '/index/china60-hot-detail.jsp';
    }else{
        from = '51Cruise';
        url='/index/login-hot-detail.jsp';
    }
    //将查询过滤字段都设置为null
    startCity=null; cruiseComp=null; startDate=null; days=null; key=null,price=null,title=null;
    toFilter('cruiseComp', cpId);

    //searchResource(pageNum);
    searchResourceVersionList(pageNum);
}

//查询邮轮登船城市
function searchCruiseDestList() {
    $.ajax({
        url: getContextPath() + '/resource/searchCruiseDestList.do',
        type: 'post',
        dataType: 'json',
        success: function(data) {
            if(data==null || data.datas==null) return;
            if(data.success == 1) {
                var datas = data.datas;
                var list = '<a class="addbg-1 addbg" href="javascript:toFilter(\'startCity\', \'0\');">全部</a>';
                for(var i=0; i<datas.length; i++) {
                    list =list+
                        '<a href="javascript:toFilter(\'startCity\', \''+datas[i].id+'\');">'+datas[i].name+'</a>';
                }
                $('#destination').html(list);
            } else {
                Jalert('获取失败, code:' + data.msg);
            }
        }
    });
}

//查询邮轮公司
function searchCruiseCompList() {
    $.ajax({
        url: getContextPath() + '/resource/searchCruiseCompList.do',
        type: 'post',
        dataType: 'json',
        success: function(data) {
            if(data==null || data.datas==null) return;
            if(data.success == 1) {
                var datas = data.datas;
                var list = '<a class="addbg-1 addbg" href="javascript:toFilter(\'cruiseComp\', \'0\');">全部</a>';
                for(var i=0; i<datas.length; i++) {
                    list =list+
                        '<a href="javascript:toFilter(\'cruiseComp\', \''+datas[i].id+'\');">'+datas[i].name+'</a>';
                }
                $('#cruiseComp').html(list);

            } else {
                Jalert('获取失败, code:' + data.msg);
            }
        }
    });
}


function search(){
    var title = $("#title").val();
    toFilter('title',title);
}


//筛选超链接的查询条件
function toFilter(type, cons) {
    loadWait();
    if(type == 'title') {
        if(cons == '') title=null;
        else  title = cons;
    }
    if(type == 'startCity') {
        if(cons == 0) startCity=null;
        else  startCity = cons;
    }
    if(type == 'cruiseComp') {
        if(cons == 0) cruiseComp=null;
        else  cruiseComp = cons;
    }
    if(type == 'startDate') {
        if(cons == 0) startDate=null;
        else  startDate = cons;
    }
    if(type == 'days') {
        if(cons == 0) days=null;
        else days = cons;
    }
    if(type == 'price') {
        if(cons == 0) price=null;
        else price = cons;
    }
    if(type == 'key') {
        if(cons != 0) {
            key = cons;
        } else {
            key = $('#serach').val().trim();
        }
        if(key == '' || key == null) {
            alert('请输入关键字');
            $('#key').focus();
            return;
        }
    } else {
        key = null;
    }

    //searchResource(1);
    searchResourceVersionList(1);
}
//查询所有已审核班期
function searchResourceVersionList(pageNum){
    $.ajax({
        url:getContextPath()+"/resource/searchResourceVersionListToProduce.do",
        type: 'post',
        data: {
        	'productVersion.cabinId':1,
            'productVersion.productType':21,
            'productVersion.status':1,
            'productVersion.sortField': sortField,
            'productVersion.sortType': sortType,
            'productVersion.title': title,
            'productVersion.startDate': startDate,
            'productVersion.startCity': startCity,
            'productVersion.shippingLine': shippingLine,
            'productVersion.cruiseCompanyId': cruiseComp,
            'productVersion.price': price,
            'productVersion.days': days,
            'pager.pageNum':pageNum,
            'pager.pageSize':10
        },
        dataType: 'json',
        success: function(data) {
            if(data==null || data.datas==null) return;
            if(data.success == 1) {
                if(data.datas == null || data.datas.length == 0) {
                    $('#list').empty();
                    $('#pager').empty();
                    $('#noresult').show();
                } else {
                    $('#list').empty();
                    $('#noresult').hide();
                    rendResourceVersionList(data);
                    renderPager(data.pager, "searchResourceVersionList");
                }
            } else {
                Jalert('获取失败, code:' + data.msg);
            }
            commitRemove();
        }
    });
}

function rendResourceVersionList(data) {
    var datas = data.datas;
    var list="";
    for(var i = 0; i < datas.length; i++){
        list = list +
            '<li>'+
            '<a href="'+getContextPath()+'/index/login-hot-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruiseId+'&vid='+datas[i].id+'&from='+from+'" target="_blank" class="pic_link">'+datas[i].title+'</a>'+
            '<div class="shop-list-info"><img src="'+getContextPath()+UPLOAD_RESOURCE_IMG+datas[i].picPath+'">'+
            '<div class="hot-list-info-p">'+
            '<p><b>登船城市：</b> '+datas[i].startCity+'</p>'+
            '<p><b>目的地：</b> '+datas[i].endCity+'</p>'+
            '<p><b>出发日期：</b>'+datas[i].startDate+'</p>'+
            '<p><b>行程天数：</b>'+datas[i].days+'</p>'+
            '<p><b>邮轮公司：</b>'+datas[i].cruiseCompany+'</p>'+
            '<div class="shop-list-price">'+
            '<span><small>￥</small>'+datas[i].minPrice+'<small>起</small></span>'+
            '<button class="btn btn-success" type="button" onclick="window.open(\''+getContextPath()+'/index/login-hot-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruiseId+'&vid='+datas[i].id+'&from='+from+'\',\'_blank\')">预订</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</li>';

    }
    $('#list').html(list);
    var iframeHeight = 350+$("#list").height();
    $(window.parent.document).find("#myiframe").height(iframeHeight);
}
//根据分类查询资源
/*function searchResource(pageNum) {
    $.ajax({
        url: getContextPath() + '/resource/searchResourceList.do',
        type: 'post',
        data: {
            'resource.productType': productType,
            'resource.showLevel': 1,
            'resource.status': 1,
            'resource.cruiseCompany': cruiseComp,
            'resource.startCity': startCity,
            'resource.startDate': startDate,
            'resource.days': days,
            'resource.price': price,
            'resource.title': title,
            'pager.pageNum': pageNum,
            'pager.pageSize': 10
        },
        dataType: 'json',
        success: function(data) {
            if(data==null || data.datas==null) return;
            if(data.success == 1) {
                if(data.datas == null || data.datas.length == 0) {
                    $('#list').empty();
                    $('#pager').empty();
                    $('#noresult').show();
                    commitRemove();
                    return;
                } else {
                    $('#list').empty();
                    $('#noresult').hide();
                }
                rendList(data);
                renderPager(data.pager, 'searchResource');
            } else {
                Jalert('获取失败, code:' + data.msg);
            }
            commitRemove();
        }
    });
}
function rendList(data) {
    var datas = data.datas;
    var list="";
    for(var i=0;i<datas.length;i++) {
        var minPrice = selectMinPriceByResourceCode(datas[i].code);
        if(minPrice == null){
            minPrice = '--';
        }
        list = list +'<li>'
            //+'<a href="'+ctx+'/index/login-hot-detail.jsp?code='+datas[i].code+'&cruiseId='+datas[i].cruise_id+'&from=51Cruise" target="_blank">'+datas[i].title+'</a>'
            +'<a href="'+ctx+url+'?code='+datas[i].code+'&cruiseId='+datas[i].cruise_id+'&from='+from+'" target="_blank">'+datas[i].title+'</a>'
            +'<div class="shop-list-info">'
        if(datas[i].pic_path == null ||datas[i].pic_path == ''||typeof (datas[i].pic_path) == 'undefined'){
            list = list + '<img src="'+ctx+UPLOAD_RESOURCE_IMG+'list_1.jpg" />'
        }else{
            list = list +'<img src="'+ctx+UPLOAD_RESOURCE_IMG+datas[i].pic_path+'" />'
        }
           list = list +'<div class="hot-list-info-p">'
            +'<p><b>出发港口：</b> '+datas[i].start_city
            +'</p>'
            +'<p><b>目的地：</b>' +datas[i].end_city
            +'</p>'
         /!*   +'<p><b>出发团期：</b>'+datas[i].travel_date+'</p>'*!/
            +'<p><b>行程天数：</b>'+datas[i].days+'天</p>'
            +'<p><b>邮轮公司：</b>'+datas[i].cruise_company+'</p>'
            +'<div class="shop-list-price">';
               /!* if(typeof(datas[i].price) =='number'){
                    list = list +'<span><small>￥</small>'+datas[i].price+'<small>起</small></span>'
                }else if(typeof (datas[i].trader_price) =='number'){
                    list = list +'<span><small>￥</small>'+datas[i].trader_price+'<small>起</small></span>'
                }else{
                    list = list +'<span><small>￥</small>'+datas[i].um_price+'<small>起</small></span>'
                }*!/
        list = list +'<span><small>￥</small>'+minPrice+'<small>起</small></span>'
        list = list +'<a href="'+ctx+url+'?code='+datas[i].code+'&cruiseId='+datas[i].cruise_id+'&from='+from+'" target="_blank"><button  class="btn btn-success"  >查看详情</button></a>'
            +'</div>'
        +'</div>'

            +'</div>'
            +'</li>'

    }
    $('#list').html(list);
    var iframeHeight = 350+$("#list").height();
    $(window.parent.document).find("#myiframe").height(iframeHeight);
}

//查询产品房型最低价
function selectMinPriceByResourceCode(code){
    var minPrice = "";
    $.ajax({
        url:getContextPath()+"/resource/selectMinPriceByResourceCode.do",
        type:'post',
        async:false,
        data:{
            'resource.code':code,
        },
        dataType:'json',
        success:function(data){
            if(data.success==1){
              minPrice =  data.datas;
            }else{
                Jalert(data.msg);
            }
        }
    });
    return minPrice;
}*/
//从本月起，生成10个月的月份
function createSTime() {
    var time='<a class="addbg-1 addbg" href="javascript:toFilter(\'startDate\', \'0\');">全部</a>';
    var str = '', year = [];
    for(var i=1; i<11; i++) {
        var d = new Date();
        var m = d.getMonth()+i;
        d.setMonth(m);
        var y = d.getFullYear();
        if(parseInt(m) < 10) m = '0'+m;
        if (m == 12) {m = 12; y = y-1}
        if (m >= 13) {m = m - 12;m = '0'+m}
        var s = y + '-' + m;
        time = time + '<a href="javascript:toFilter(\'startDate\', \''+s+'\');">'+s+'</a>';
    }
    $('#startTime').html(time);


}



