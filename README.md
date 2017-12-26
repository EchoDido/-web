### 一、需求
要求同时固定表头和操作栏，方便用户操作。
![效果](http://upload-images.jianshu.io/upload_images/7226169-eb5c1c78f4852ba2.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)       
<br>   
### 二、实现思路
1. js控制表格宽高自适应，溢出滚动
2. 表头、操作栏独立放置，表头横向溢出滚动，纵向溢出隐藏，操作栏纵向溢出滚动，横向溢出隐藏
3. 表格滚动时同步滚动表头和操作栏
<br>
### 三、布局
![布局](http://upload-images.jianshu.io/upload_images/7226169-318eeb5aa64e7712.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
<br>
### 四、实现过程
###### 1. 传统方法监听滚动并实现同步滚动（这是最容易想到，也是网上最常见的同步滚动实现方法）
```javascript
$(".page-table-body-scroll").scroll(function (event) {
    event.preventDefault();
    //表头跟随表格同步横向滚动
    $(".page-table-header-scroll").scrollLeft($(".page-table-body-scroll").scrollLeft());
    //操作栏跟随表格同步纵向滚动
    $(".page-table-fixed-scroll").scrollTop($(".page-table-body-scroll").scrollTop());
});
$(".page-table-header-scroll").scroll(function (event) {
    event.preventDefault();
    //表格跟随表头同步横向滚动
    $(".page-table-body-scroll").scrollLeft($(".page-table-header-scroll").scrollLeft());
});
$(".page-table-fixed-scroll").scroll(function (event) {
    event.preventDefault();
    //表格跟随操作栏同步纵向滚动
    $(".page-table-body-scroll").scrollTop($(".page-table-fixed-scroll").scrollTop());
});
```
> 问题：
这种方法在使用鼠标拖动滚动条和滚轮滚动时都没有问题可以实现平滑同步，但在macbook下使用触摸板则遇到了错位问题。

![mac下触摸板错位](http://upload-images.jianshu.io/upload_images/7226169-9c9d2d32b42cfed1.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
###### 问题分析：
经调试，当去掉表格跟随表头或操作栏同步滚动时，不再出现错位现象。考虑可能是跟代码反复互相调用scroll事件有关。
![重复调用](http://upload-images.jianshu.io/upload_images/7226169-669a31293dfc8645.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
###### 解决思路：
1. 区分表格横向纵向滚动，减少冗余
2. 通过鼠标滑过事件判断当前滚动区域触发是否为用户主动触发，鼠标滑过当前区域时，认为当前区域滚动事件为主动触发。如果是被动触发（即跟随滚动）则不再反向触发滚动。
<br>
##### 2. 改进方法

```javascript
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
```
> 问题：
当用户进入页面，未移动鼠标时，直接滚动无法触发hover事件。
 
###### 解决思路：
当用户进入页面为移动鼠标时，三个区域都有【disScroll】，可通过判断【disScroll】数量对此情况单独处理。

```javascript
//单独处理进入页面直接滚动的情况
if($(".disScroll").length==3){
    $(this).removeClass("disScroll");
}
```
### 三、总结
至此，需求中遇到的问题全部解决，完整demo见（demo中表格是宽高自适应的，因此还涉及函数节流，网上此类分享文章很多，这里就不赘述）。本次遇到的问题比较罕见，因验收方使用macbook并且不习惯使用鼠标才遇到此类问题，但这个问题的出现也是由于我的最初解决方案过于粗糙。这是作为初学者常犯的错误，在开发过程中由于对基础知识模棱两可的掌握，写出了很多效率低下的代码。

这是我作为一个工作了多年的前端开发第一篇比较完整的有关技术总结的分享文字，其实我个人觉得自己还不到分享的水平。在网上看了很多技术分享的文章，但是自己真正去写的时候才知道要写出一篇透彻的技术分享文是多么不容易的一件事。在写这篇文章的过程中，也发现自己的诸多不足，对很多JS语言的特性还是一知半解，文章中一定存在很多错漏之处，还请多多批评指正，希望这是一个好的开始，重新出发，终身学习。