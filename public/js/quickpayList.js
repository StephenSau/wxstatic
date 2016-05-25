/**
 * Created by Administrator on 2015/11/25 0025.
 *
 */
(function () {
    'use strict';

    var QuickpayList = function(){
        this.dialog = new Dialog({
            content: "初始化"
        });
        this.hasPost = false;
        this.payList = document.getElementById("payList");
        this.init();
    }

    QuickpayList.prototype = {
        onloading: false,
        isOver: false,
        currentPage: 1,
        init: function () {
            this.listenScroll();
            this.getNewsList();
        },

        listenScroll: function () {
            var that = this,
                point = document.getElementById('loadingPoint');
                
            window.onscroll = function () {
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                if (! that.isOver && !that.onloading && scrollTop + window.screen.height >= point.offsetTop + point.offsetHeight) {
                    that.getNewsList();
                }
            };


            
        },

        ajaxListener : function(){

            var  aLi = this.payList.getElementsByTagName("li"),
                that =this;

                for(var i = 0 ,len = aLi.length ; i < len ; i++){
                    aLi[i].getElementsByTagName("button")[0].onclick = function(){
                        // console.log(1213);
                        that.goPay(this);
                    }
                }
        },

        getNewsList: function () {
            var that = this,
                xhr = new xhrFactory(),
                params = {
                    'pageSize': 10,
                    'pageNumber': this.currentPage
                };
            this.onloading = true;
            xhr.post('/order/getNeedPayOrderList.htm', params, function (data) {
                if (data.status === "200") {
                    that.pageNewsList(data.re);
                } else {

                }
            });
        },

        pageNewsList: function (data) {
            var i = 0,
                list = document.getElementById('payList'),
                items = data.orderList,
                length = items.length,
                totalPage = data.totalPage,
                li = null;
            if (length) {
                for (i = 0; i < length; i += 1) {
                    var sdnameArr = [],
                        html = [],
                        item = items[i],
                        serviceItemsList = item.list[0].serviceItemsList;
                    
                    li = document.createElement('li');

                    for(var j = 0 ,len =serviceItemsList.length;j < len ; j++){

                        sdnameArr.push(serviceItemsList[j][0].sdname);
                    }
                    html.push('<p data-orderno="'+item.orderno+'">订单号：'+item.orderno+'</p>');
                    html.push('<p data-serviceNames="'+sdnameArr.join(",")+'">购买服务：'+sdnameArr.join(",")+'</p>');
                    html.push('<p data-amounts="'+item.remainamount+'">应付金额：'+item.remainamount+' 元</p>');
                    html.push('<p>下单日期：'+item.created+'</p>');
                    html.push('<span data-orderpayid="'+item.list[0].orderpayid+'">待支付</span>');
                    html.push('<div class="btn-list clearfix">');
                    html.push('<a href="tel:4008-310-866" class="btn btn_success">呼叫客服</a>');
                    html.push('<button type="submit" class="btn btn_warning">马上支付</button>');
                    html.push("</div>");
                    li.innerHTML = html.join('');
                    list.appendChild(li);
                }
                this.ajaxListener();
                this.onloading = false;
                this.currentPage += 1;
                this.isOver = false;
                if(totalPage == 1){
                    document.getElementById('loadingPoint').style.display = "none";
                }
            } else {
                this.isOver = true;
                document.getElementById('loadingPoint').style.display = "none";
                if(totalPage == 0){
                    var newP = document.createElement("div");
                        newP.className = "empty";
                        newP.innerHTML = "<p>您暂时没有需要支付的订单。</p><p><a href='/shop/showServiceList.htm'>进入壹商城逛逛？</a></p>";
                    document.querySelectorAll(".list")[0].appendChild(newP);
                }
            }
            
        },

        goPay : function(obj){
             var that = this,
                $this = obj,
                xhr = new xhrFactory(),
                $li = $this.parentNode.parentNode,
                orderno = $li.querySelectorAll("[data-orderno]")[0].getAttribute("data-orderno"),
                orderPayId = $li.querySelectorAll("[data-orderpayid]")[0].getAttribute("data-orderpayid"),
                amount = $li.querySelectorAll("[data-amounts]")[0].getAttribute("data-amounts"),
                serviceNames = $li.querySelectorAll("[data-serviceNames]")[0].getAttribute("data-serviceNames"),
                params = {
                    'orderno': orderno,
                    'orderPayId': orderPayId,
                    'amount':amount,
                    'serviceNames' : serviceNames
                };
                this.dialog.show({
                    content: "处理中，请稍后"
                });
                 this.hasPost = true;
            xhr.post('/order/payOrder.htm', params, function (data) {
                 that.dialog.close();
                if (data.status === "200") {
                    that.onBridgeReady({
                        "appId": data.appxId,
                        "timeStamp": data.timeStamp,
                        "nonceStr": data.nonceStr,
                        "package": data.package,
                        "signType": data.signType,
                        "paySign": data.paySign
                    }, data.listOrderNoAmount, data.serviceName);
                } else {
                    that.dialog.show({
                        content: "出问题了，请重新购买"
                    });
                }
            });
        },

        onBridgeReady: function (data, orderNo, serviceName) {
            var that = this;
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', data,
                function (res) {
                    if (res.err_msg === "get_brand_wcpay_request:ok") {
                        window.location.href = "/forward/go2PageByCode.htm?pageCode=quickpayList";
                    } else if (res.err_msg === "get_brand_wcpay_request:cancel" ||
                               res.err_msg === "get_brand_wcpay_request:fail") {
                        that.hasPost = false;
                    }
               });
        }

    }

    var quickpayList = new QuickpayList();

})()