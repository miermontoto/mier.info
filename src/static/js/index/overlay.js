let fullscreen = document.getElementById('fullscreen-background');
let overlay = document.getElementById('overlay');
fullscreen.addEventListener('click', () => {
    let videoElement = document.getElementById('background');

    if (videoElement.classList.contains('fullscreen')) {
        videoElement.classList.remove('fullscreen');
        fullscreen.classList.remove('active');
        overlay.style.zIndex = '2';
    } else {
        videoElement.classList.add('fullscreen');
        fullscreen.classList.add('active');
        overlay.style.zIndex = '4';
    }
});

document.getElementById('stop-background').addEventListener('click', () => {
    document.getElementById('background').src = '';
    document.getElementById('overlay').innerHTML = '';
    document.getElementById('background').style.zIndex = '-1';
});
