import { addMessage, showMessage } from './messages.js';
import { randArray } from './randomize.js';

const videoElement = document.getElementById('background');

let sources;
let index = 0;

await fetch('/content/data/backgrounds.json').then(response => response.json()).then(data => sources = randArray(data)); // load sources
load(); // load first video
addMessage('press "?" for help')
videoElement.addEventListener('ended', () => load()); // load next video on end

// Handle video loading errors
videoElement.addEventListener('error', (e) => {
    const error = videoElement.error;
    let errorMessage = 'Error playing video';

    if (error) {
        switch (error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
                errorMessage = 'Video playback was aborted';
                break;
            case MediaError.MEDIA_ERR_NETWORK:
                errorMessage = 'Network error while loading video';
                break;
            case MediaError.MEDIA_ERR_DECODE:
                errorMessage = 'Video decode error';
                break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = 'Video format not supported';
                break;
        }
    }

    showMessage(`${errorMessage}: ${sources[index].name}`);
});

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
    addMessage(`now playing: ${sources[index].name}`);
}

// add event listener for 'n' key to load next video
document.addEventListener('keydown', (event) => {
    if (event.key === 'n') {
        load();
    }
});

// add event listener for 's' to start/stop video
document.addEventListener('keydown', (event) => {
    if (event.key === 's') {
        if (videoElement.paused) {
            videoElement.play();
            videoElement.hidden = false;
            showMessage('video resumed.');
        } else {
            videoElement.pause();
            videoElement.hidden = true;
            showMessage('video paused. press s to resume.');
        }
    }
});
