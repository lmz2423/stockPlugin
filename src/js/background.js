/**
 * Created by luomingzhong on 15/9/2.
 * @description 该脚本是用来监控股价的变化，默认每隔3秒更新数据，根据用户设置的价格，通过推送，发送数据
 */
(function () {
    'use strict';
    //首先从本地储存中获取配置数据和股票数据,获取股票数据，通过消息机制来传给popup页面
    var stockList = [];//用来临时储存股票数据,与storage中的数据保此同步。
    var systemSet = null;//用来临时储存用户的配置数据。
    var queryStockData = null;//用来临时存储股票的请求数据。
    var baseurl = 'http://apis.baidu.com/apistore/stockservice/stock?stockid=';
    var url = "";
    var Background = {};
    var parma = "&list=1";
    var questime = 5000;//请求数据过慢
    /**
     * @description 初始化,启动后台程序。*/
    Background.init = function () {
        this.getStockList();
        this.startquest();
    };

    Background.setdefaultColor = function () {
        chrome.storage.sync.set({
            stockList: null,
            timeStart: "09:30",
            timeEnd: "15:00",
            upColor: "#ff0000",
            downColor: "#00ff00",
            openNotifications: true
        })
    };

    Background.getStockList = function () {
        chrome.storage.sync.get("stockList", function (result) {
            if (result.stockList) {
                stockList = result.stockList;
                var length = stockList.length;
                var tempdata = [];
                for (var i = 0; i < length; i = i + 1) {
                    tempdata.push(stockList[i].stockIndex);
                }
                queryStockData = tempdata.join(',');
                url = baseurl + queryStockData + parma;
            }
            else {
                Background.setdefaultColor();
            }
        });
    };
    //设置股票代码。
    Background.setStockList = function (callback) {
        chrome.storage.sync.set({
            stockList: stockList
        }, function () {
            callback('添加成功');
        });
    };

    //发送桌面推送
    Background.pushNotification = function (data) {
        var resonse = JSON.parse(data);
        if (repsonse.errNum === 0) {
            var stockInfo = resonse.retData.stockinfo;
            this.showPushNotification(stockInfo);
        }
        else {

        }
    };


    /**
     * @description 显示股票数据，实时显示。
     * @param stockinfo
     */
    Background.showPushNotification = function (stockinfo) {
        var length = stockinfo.length;
        if (length > 0) {
            for (var i = 0; i < length; i = i + 1) {
                var currentPrice = stockinfo[i].currentPrice;
                var downPrice = stockList[i].downPrice;
                var upPrice = stockList[i].upPrice;
                if (currentPrice) {
                    if (downPrice > 0) {
                        //如果没有数据
                        if (currentPrice <= downPrice) {
                            chrome.openNotifications.create({
                                type: "basic",
                                iconUrl: "../image/sad.png",
                                title: stockinfo[i].name + '(' + stockinfo[i].code + ')',
                                message: "股价已低到" + currentPrice + "了，注意止损",
                                priority: 2,
                                eventTime: Date.now()
                            });

                        }
                    }
                    if (upPrice > 0) {
                        if (currentPrice >= upPrice) {
                            chrome.openNotifications.create({
                                type: "basic",
                                iconUrl: "../image/sad.png",
                                title: stockinfo[i].name + '(' + stockinfo[i].code + ')',
                                message: "股价已涨到" + currentPrice + "了，注意止盈",
                                priority: 2,
                                eventTime: Date.now()
                            });

                        }
                    }

                }
            }
        }
    };
    // 显示错误的信息
    Background.showErrorNotification = function () {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: '../images/pusherror.png',
            title: '系统错误',
            message: '抱歉，系统发生错误，',
            priority: 2,
            eventTime: Date.now()
        });
    };

    Background.sendQuest = function () {
        utils.send({
            url: url,
            success: null,
            apikey: "0c61838ff9999db64547975a79354c69"
        });
    };


    Background.success = function (data) {
        console.log(data);
    };
    Background.startquest = function () {
        setInterval(function () {
            if (stockList.length > 0) {
                Background.sendQuest();
            }
        }, questime);
    };

    //增加股票
    Background.addStock = function (stockid, callback) {


        if (queryStockData) {
            var result = queryStockData.match(stockid);
            if (result) {
                callback('该股票已添加');
                return false;
            }
            queryStockData = stockid + ',' + queryStockData;
        }
        else {
            queryStockData = stockid;
        }
        stockList.push({stockIndex: stockid});
        url = baseurl + queryStockData + parma;
        this.setStockList(callback);
    };

    //删除股票
    Background.deleteStock = function (stockid, callback) {
        //删除内存中的数据，使内存中变量保持同步，没有必要每次都去获取数据。
        queryStockData = queryStockData.replace(stockid + ',', "");
        url = baseurl + queryStockData + parma;
        //删除storage的对应的数据
        chrome.storage.sync.get('stockList', function (result) {
            if (result.stockList) {
                stockList = result.stockList;
                var length = stockList.length;
                for (var i = 0; i < length; i = i + 1) {
                    if (stockList[i].stockIndex === stockid) {
                        stockList.splice(i, 1);
                        break;
                    }
                }
                //设置储存数据。
                chrome.storage.sync.set({stockList: stockList}, function () {
                });
            }
        });
    };
    //更新股票，如修改上涨和下跌数据
    Background.updateStock = function (stockCode, upPrice, downPrice, callback) {
        chrome.storage.sync.get('stockList', function (result) {
            if (result.stockList) {
                stockList = result.stockList;
                var length = stockList.length;
                for (var i = 0; i < length; i = i + 1) {
                    if (stockList[i].stockIndex === stockid) {
                        if (upPrice) {
                            stockList[i].upPrice = upPrice;
                        }
                        if (downPrice) {
                            stockList[i].downPrice = downPrice;

                        }
                        break;
                    }
                }
                url = baseurl + queryStockData + parma;
                //设置储存数据。
                chrome.storage.sync.set({stockList: stockList}, function () {
                });
            }
        });
    };
    Background.handleData = function (message, callback) {
        //为股票的话
        if (message.id === 1) {
            switch (message.stockStatus) {
                //添加股票
                case 1:
                    this.addStock(message.stockCode, callback);
                    break;
                //删除股票
                case 2:
                    this.deleteStock(message.stockCode);
                    break;
                //更新股票
                case 3:
                    this.updateStock(message.stockCode, message.upPrice, message.downPrice);
                    break;
                default:
                    console.log("something wrong");
            }
        }
        //为系统设置的话
        if (message.id === 2) {
        }
    };
    /**
     * @param message {Object}
     * message.id= 1 0r 2 ; 1表示 股票数据，2表示系统设置
     * message.stockCode;表示股票的id
     * message.stockStatus; 表示股票的状态，1表示添加股票 ,2表示删除 3表示更新
     * message.upPrice  表示股价上升通知价位
     * message.downPrice 表示股价下降时候的通知价位
     * message.timestart 指的是推送开始时间
     * message.timeend  指的是推送结束时间。
     * message.upColor 指的是上升颜色
     * message.downColor  指的是下跌颜色
     * message.backgroundColor 指的是背景颜色
     * message.openNotifications true 开启 false 关闭
     */
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        Background.handleData(message, sendResponse);
    });
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for(var key in changes) {
            var storageChange = changes[key];
            console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
        }
    });

    Background.init();

}());
