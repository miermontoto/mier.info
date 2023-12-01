let date = new Date();
let month = date.getMonth();

if (month == 11 || month == 0 && date.getDate() < 7) {
	let script = document.createElement('script');
    script.src = '/static/js/global/snow.js';

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
