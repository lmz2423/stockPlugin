/**
 * Created by luomingzhong on 15/8/30.
 */
function my_clock(el) {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = m > 10 ? m : ('0' + m);
    s = s > 10 ? s : ('0' + s);
    el.innerHTML = h + ":" + m + ":" + s;
}
var clock_div = document.getElementById('clock_div');
setInterval(function(){
    my_clock(clock_div);
},1000);