/**
 * Created by zjl on 17/11/3.
 */
if (!AFed) {
    var AFed = {};
}
$.extend(AFed, {
    tableInit: function () {
        if($(".page-table-content").length){
            $("html").addClass("freezeWin");
            var tableH = ($('.page-table-body-scroll').offset().top+$('.page-table-header').height()+15),
                tableW = $('.page-table-body-scroll .dataTable').width(),
                tableScrollW = $('.page-table-body-scroll').width();
            tableH = $(window).height()-tableH;
            if($('.page-table-body-scroll .dataTable').height()>tableH){
                $('.page-table-scroll').css('height',tableH);
                if(tableW>tableScrollW){
                    $('.page-table-fixed-scroll').css('height',(tableH-15));
                }
                $('.page-table-header-scroll').css("width",(tableScrollW-15) + "px");
            }else {
                $('.page-table-scroll').css('height','auto');
                $('.page-table-header-scroll').css("width",(tableScrollW) + "px");
            }
            $('.list-modify').css("border-left","none");
            $('.list-modify').prev('td,th').css("border-right","none");
            //三个区域默认加上禁止触发滚动样式【disScroll】，以鼠标滑过判定当前所在区域为用户主动触发移除【disScroll】
            $(".page-table-body-scroll,.page-table-fixed-scroll,.page-table-header-scroll").hover(function () {
                $(this).removeClass("disScroll");
            },function () {
                $(this).addClass("disScroll");
            });
            $(".page-table-body-scroll,.page-table-fixed-scroll,.page-table-header-scroll").each(function(){
                //记录scrollLeft,scrollTop初始值
                $(this).data('slt',{sl:this.scrollLeft,st:this.scrollTop});
            }).scroll(function (event) {
                event.preventDefault();
                var sl=this.scrollLeft,
                    st=this.scrollTop,
                    d=$(this).data('slt');
                //单独处理进入页面直接滚动的情况
                if($(".disScroll").length==3){
                    $(this).removeClass("disScroll");
                }
                //判断横向滚动
                if(sl!=d.sl){
                    //判断当前滚动区域是否为主动触发，只有当主动触发时才进行对应区域的滚动事件触发
                    if($(this).hasClass("page-table-body-scroll")&&!$(this).hasClass("disScroll")) {
                        $(".page-table-header-scroll").scrollLeft($(this).scrollLeft());
                    }else if($(this).hasClass("page-table-header-scroll")&&!$(this).hasClass("disScroll")) {
                        $(".page-table-body-scroll").scrollLeft($(this).scrollLeft());
                    }
                }
                //判断纵向滚动
                if(st!=d.st){
                    if($(this).hasClass("page-table-body-scroll")&&!$(this).hasClass("disScroll")){
                        $(".page-table-fixed-scroll").scrollTop($(this).scrollTop());
                    }else if($(this).hasClass("page-table-fixed-scroll")&&!$(this).hasClass("disScroll")){
                        $(".page-table-body-scroll").scrollTop($(this).scrollTop());
                    }
                }
                $(this).data('slt',{sl:sl,st:st});
            });
        }

    }
});
jQuery(function ($) {
    if($(".page-table-modify").length){
        $(".page-table-body-scroll tr").on("mouseenter",function() {
            $(".page-table-fixed-scroll tr").eq($(this).index()).addClass("hover");
        }).on("mouseleave",function () {
            $(".page-table-fixed-scroll tr").eq($(this).index()).removeClass("hover");
        });
        $(".page-table-fixed-scroll tr").on("mouseenter",function() {
            $(".page-table-body-scroll tr").eq($(this).index()).addClass("hover");
        }).on("mouseleave",function () {
            $(".page-table-body-scroll tr").eq($(this).index()).removeClass("hover");
        });
        AFed.tableInit();
        var resizeTimer = null;
        //函数节流
        $(window).on("resize",function () {
            if (resizeTimer) {
                clearTimeout(resizeTimer)
            }
            resizeTimer = setTimeout(function() {
                AFed.tableInit();
            },400);
        });
    }
});