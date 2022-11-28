window.onload = christmas();

function christmas() {
    if (getChristmas()) {
        document.body.style.cursor = "url('/assets/util/xmas.png'), auto";
        snow();
    }
}

function getChristmas() {
    let date = new Date();
    let month = date.getMonth();
    return month == 11 || month == 0 && date.getDay() < 7;
}

function snow() {
    var script = document.createElement('script');    script.src = 'static/js/snow.js';
    script.src = 'static/js/snow.js';
    // configure snowstorm
    script.onload = function() {
        snowStorm.excludeMobile = false;
        snowStorm.flakesMaxActive = 128;
        snowStorm.falkesMax = 256;
        snowStorm.followMouse = false;
        snowStorm.snowStick = true;
        snowStorm.vMaxX = 2;
        snowStorm.vMaxY = 3;
    }
    document.head.appendChild(script);
}