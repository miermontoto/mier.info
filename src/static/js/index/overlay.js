import {load} from './video.js';
const videoElement = document.getElementById('background');

// create elements
let overlayContainer = document.createElement('div');
let overlay_box = document.createElement('div');
let fullscreen = document.createElement('span');
let stop = document.createElement('span');
let next = document.createElement('span');

// set attributes
overlayContainer.setAttribute('id', 'overlay-container');
overlay_box.setAttribute('id', 'overlay-box');
fullscreen.setAttribute('id', 'bg-fullscreen');
stop.setAttribute('id', 'bg-stop');
next.setAttribute('id', 'bg-next');

// set innerHTML
fullscreen.innerHTML = '⛶';
stop.innerHTML = '⏹';
next.innerHTML = '⏭';

// set classes
[fullscreen, stop, next].forEach(element => {
    element.classList.add('button');
    element.classList.add('light');
});

// add functionality
fullscreen.addEventListener('click', () => {
    if (videoElement.classList.contains('fullscreen')) {
        videoElement.classList.remove('fullscreen');
        fullscreen.classList.remove('active');
        overlay_box.classList.remove('active');
        overlayContainer.style.zIndex = '2';
    } else {
        videoElement.classList.add('fullscreen');
        fullscreen.classList.add('active');
        overlay_box.classList.add('active');
        overlayContainer.style.zIndex = '4';
    }
});

stop.addEventListener('click', () => {
    videoElement.remove();
    overlayContainer.remove();
});

next.addEventListener('click', load);

// append elements
overlay_box.appendChild(fullscreen);
overlay_box.appendChild(stop);
overlay_box.appendChild(next);
overlayContainer.appendChild(overlay_box);
document.body.appendChild(overlayContainer);
