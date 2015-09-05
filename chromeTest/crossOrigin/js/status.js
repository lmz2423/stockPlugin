/**
 * Created by creditease on 2015/9/1.
 */
(function () {
    'use strict';
    var apikey = "0c61838ff9999db64547975a79354c69";
    var url = "http://apis.baidu.com/apistore/stockservice/stock";
    var ShangHaiIndex = "sh";//���ָ�Ϻ�ָ��
    var ShenZhunIndex = "sz";//���ָ����ָ����
    var stockArray = ["sh601318"];
    function httpRequest(url, callback, stockArray) {
        var xhr = new XMLHttpRequest();
        var stockstring = stockArray.join(",");
        var stockForm = new FormData();
        url= url + "?" + "stockid=" + stockstring + "&" + "list=1";
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
            if(repsonse.errNum == 0){
                var stockinfo = repsonse.retData.stockinfo;
                pushNotification(stockinfo[0].currentPrice);
            }
            else{
            }
            console.log(repsonse);
        }, stockArray);
    }, 4000);

    function pushNotification(price) {
        if (price > 29.86) {
            chrome.notifications.create(
                {
                    type: "basic",
                    iconUrl: "../image/happy.png",
                    title:"中国平安",
                    message:"股价已达到"+ price + "了，注意止损",
                    contextMessage:"目前盈利多少",
                    priority:2,
                    eventTime:Date.now()
                })
        }
        if (price <20.76) {
            chrome.notifications.create(
                {
                    type: "basic",
                    iconUrl: "../image/sad.png",
                    title:"中国平安",
                    message:"股价已低到"+ price + "了，注意止损",
                    contextMessage:"目前亏损多少",
                    priority:2,
                    eventTime:Date.now()
                })
        }
    }
}());