/**
 * Created by creditease on 2015/9/1.
 */
(function () {
    'use strict';
    var apikey = "0c61838ff9999db64547975a79354c69";
    var url = "http://apis.baidu.com/apistore/stockservice/stock?stockid=";
    var ShangHaiIndex = "sh";//���ָ�Ϻ�ָ��
    var ShenZhunIndex = "sz";//���ָ����ָ����
    var stockArray = ["sh601318"];
    var zgpa = document.getElementById("zgpa");

    function httpRequest(url, callback, stockArray) {
        var xhr = new XMLHttpRequest();
        var stockstring = stockArray.join(",");
        var stockForm = new FormData();
        url = url + "?" + "stockid=" + stockstring + "&" + "list=1";
        stockForm.append("stockid", stockstring);
        stockForm.append("list", "1");
        xhr.open("GET", url);
        xhr.setRequestHeader("apikey", apikey);
        xhr.send(stockForm);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr.responseText);
            }
        }
    }

    setInterval(function () {
        httpRequest(url, function (data) {
            var repsonse = JSON.parse(data);
            if (repsonse.errNum == 0) {
                var stockinfo = repsonse.retData.stockinfo;
                zgpa.innerText = stockinfo[0].name + ":" + stockinfo[0].currentPrice;
                //pushNotification(stockinfo[0].currentPrice);
            }
            else {
                zgpa.innerText = "系统错误";
            }
            console.log(repsonse);
        }, stockArray);
    }, 4000);

    function pushNotification(price) {
        //采用了html5的通知，只能显示文字
        /*if(price>29.86){
         var myNotification = new Notification("股价已到"+ price,{tag:"中国平安",icon:'../image/48.png'});
         }
         if(price<20.76){
         var myNotification = new Notification("股价当前价"+price,{tag:"中国平安",icon:"../image/48.png"});
         }*/
        //采用chrome  浏览器的通知
        if (price > 29.86) {
            chrome.notifications.create(
                {
                    type: "basic",
                    iconUrl: "../image/happy.png",
                    title: "中国平安",
                    message: "股价已达到" + price + "了，注意止损",
                    contextMessage: "目前盈利多少",
                    priority: 2,
                    eventTime: Date.now()
                })
        }
        if (price < 20.76) {
            chrome.notifications.create(
                {
                    type: "basic",
                    iconUrl: "../image/sad.png",
                    title: "中国平安",
                    message: "股价已低到" + price + "了，注意止损",
                    contextMessage: "目前亏损多少",
                    priority: 2,
                    eventTime: Date.now()
                })
        }
    }
}());