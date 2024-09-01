import { randArray } from './randomize.js';
import { addMessage, showMessage } from './messages.js';

const videoElement = document.getElementById('background');

let sources;
let index = 0;

await fetch('/content/data/backgrounds.json').then(response => response.json()).then(data => sources = randArray(data)); // load sources
load(); // load first video
addMessage('press "?" for help')
videoElement.addEventListener('ended', () => load()); // load next video on end

export function load() { // needs to be exported for the 'next' button to work
    index = (index + 1) % sources.length;
    videoElement.innerHTML = `<source src="/assets/media/background/${sources[index].src}" type="video/mp4">`;
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
