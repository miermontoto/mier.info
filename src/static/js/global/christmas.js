let date = new Date();
let month = date.getMonth();

if (month == 11 || month == 0 && date.getDate() < 7) {
	let script = document.createElement('script');
    script.src = '/static/js/global/snow-fall.js';
    document.head.appendChild(script);

    let snowFall = document.createElement('snow-fall');
    let isLand = document.getElementById('snow-container');
    isLand.appendChild(snowFall);
}
