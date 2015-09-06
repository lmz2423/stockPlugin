/**
 * Created by luomingzhong on 15/9/4.
 * @description 该代码为工具类代码。
 * @date 2015 年
 */
var utils = {};
(function (utilsTool) {
    var regPatternForSH = /60[0-3][0-9]{3}/; //上交所
    var regPatternForSZ = /0{3}[0-9]{3}/;    /*深交所*/

    var shangHai = 'sh';//上交所股票的前缀
    var shengZhun = 'sz';//深证股票的前缀
    var open = null;
    /**
     *
     * @stockCode {String} 为用户输入的股票代码添加上前缀。
     */
    utilsTool.getStockCode = function (stockCode) {

    };
    utilsTool.toggle = function (element) {
        if(open){
            open.classList.remove('open');
            open = null;
        }
        var nextElement = element.nextElementSibling;
        var className = nextElement.className;
        if( className.match(/open/)){
            nextElement.classList.remove('open');
        }
        else{
            nextElement.classList.add('open');
            open = nextElement;
        }
    };
    utilsTool.saveData = function(codeNumber){

    };
    utilsTool.inputRex = function(string){
        if(string.match(regPatternForSH)){
            return 'sh'+string;
        }
        if(string.match(regPatternForSZ)){
            return 'sz' + string;
        }
        return false;
    };
    //删除股票
    utilsTool.removeStock = function(string){

    };
    //添加股票
    utilsTool.addStock = function(string){

    };


}(utils));

