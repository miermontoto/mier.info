window.onload = christmas();

function christmas() {
    if (getChristmas()) {
        snow();
    }
}

function getChristmas() {
    let date = new Date();
    let month = date.getMonth();
    return month == 11 || month == 0 && date.getDate() < 7;
}

function snow() {
    let script = document.createElement('script');
    script.src = '/static/js/snow.js';

    script.onload = function() { // configure snowstorm
        snowStorm.excludeMobile = false;
        snowStorm.flakesMaxActive = 128;
        snowStorm.flakesMax = 256;
        snowStorm.followMouse = false;
        snowStorm.vMaxX = 2;
        snowStorm.vMaxY = 3;
        snowStorm.zIndex = -1;
    }

    document.head.appendChild(script);
}
