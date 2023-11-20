christmas();

document.querySelectorAll('.topbtn').forEach((btn) => {
    btn.addEventListener('click', () => {
        window.scrollTo(0, 0);
    });
});

document.querySelectorAll('.bordered').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(-x, y);

        card.style.setProperty('--rotation', angle + 'rad')
    });
});

function christmas() {
    let date = new Date();
    let month = date.getMonth();

    if (month == 11 || month == 0 && date.getDate() < 7) {
        letitsnow();
        return true;
    }

    return false;
}

function letitsnow() {
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
