var before_loadtime = new Date().getTime();
window.onload = Pageloadtime;
function Pageloadtime() {
    var aftr_loadtime = new Date().getTime();
    // Time calculating in seconds  
    pgloadtime = (aftr_loadtime - before_loadtime) / 1000

    document.getElementById("loadtime").innerHTML = " <a href=\"https://blog.denne.com.au/2022/01/28/performance-timing-stats/\">Page load time</a> - <b>" + pgloadtime + "</b></font> seconds";
} 