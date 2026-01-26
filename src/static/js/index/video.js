import { addMessage, showMessage } from './messages.js';
import { randArray } from './randomize.js';

const videoElement = document.getElementById('background');

let sources;
let index = 0;

await fetch('/content/data/backgrounds.json').then(response => response.json()).then(data => sources = randArray(data)); // load sources
load(); // load first video
// Only show help message on non-touch devices
if (!('ontouchstart' in window) && !navigator.maxTouchPoints) {
    addMessage('press "?" for help')
}
videoElement.addEventListener('ended', () => load()); // load next video on end

export function load() {
    index = (index + 1) % sources.length;
    const basePath = `/assets/media/background/${sources[index].src}`;
    const h264Path = basePath.replace('.mp4', '-h264.mp4');

    videoElement.innerHTML = `
        <source src="${basePath}" type="video/mp4; codecs=av01.0.05M.08">
        <source src="${h264Path}" type="video/mp4; codecs=avc1.42E01E">
    `;
    videoElement.load();
    videoElement.play();
    addMessage(`<b>now playing:</b> ${sources[index].name}`);
}

// registrar shortcuts de video
if (window.shortcuts) {
    window.shortcuts.register('n', () => load(), 'next video', 'background');
    window.shortcuts.register('s', () => {
        if (videoElement.paused) {
            videoElement.play();
            videoElement.hidden = false;
            showMessage('video resumed.');
        } else {
            videoElement.pause();
            videoElement.hidden = true;
            showMessage('video paused. press s to resume.');
        }
    }, 'stop video', 'background');
}
