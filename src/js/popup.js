/**
 * Created by creditease on 2015/9/6.
 * @description 该脚本主要是popup页面的脚本，提供股票数据的刷新，添加并与background.html页面的通信。
 *     启动动画的开启，
 */
(function () {
    'use strict';
    var stockContent = document.querySelector(".stockContent");
    var form = document.getElementById('submit');
    var inputCode = document.getElementById('search');


    stockContent.addEventListener("click",function (e) {
        var target = e.target;
        if (target.className.match(/(stockName)|(stockCode)|(stockPrice)|(upOrRise)|(header)/)) {
            utils.toggle(target.parentElement);
        }
    });
    form.addEventListener('submit',function(e){
        e.preventDefault();
        var inputValue = inputCode.value.trim();
        inputValue = utils.inputRex(inputValue);
        if(inputValue){
            console.log(inputValue);
        }
        else{
            alert("ok");
        }
    });

}());