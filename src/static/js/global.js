christmas();
getAgent();
getTime();
setInterval(getTime, 1000);
addEventListener('mousemove', reloadInfo);

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

function getAgent() {
    document.getElementById('general-info').innerHTML = navigator.userAgent; // get user agent
    let wInfo = document.getElementById('window-info');
    wInfo.innerHTML = '<br>' + window.screen.width + 'x' + window.screen.height; // get window size
    wInfo.innerHTML += ', ' + window.innerWidth + 'px ' + window.innerHeight + 'px'; // get window size
    wInfo.innerHTML += ', ' + window.scrollY + 'px,';
}

function reloadInfo(event) {
    let dom = document.getElementById('mouse-info');
    dom.innerHTML = event.clientX + 'px ' + event.clientY + 'px';
}

function getTime() {
    let dom = document.getElementById('time-info');
    let date = new Date();
    let time = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
    let day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    dom.innerHTML = day + ' ' + time;
    try {
        dom.innerHTML += ', ' + (new Date().getTime() - loadTime) + 'ms';
    } catch (e) {}
}
