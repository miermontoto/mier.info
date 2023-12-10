import {randArray} from './randomize.js';

let videoElement = document.getElementById('background');

let timeout;
let sources;
let index = 0;

await fetch('/content/data/backgrounds.json').then(response => response.json()).then(data => sources = randArray(data)); // load sources
load(); // load first video
videoElement.addEventListener('ended', () => load()); // load next video on end

export function load() { // needs to be exported for the 'next' button to work
    let nowplaying = document.getElementById('bg-nowplaying');
    index = (index + 1) % sources.length;
    try {
        clearTimeout(timeout); // clear previous timeout (if exists)
        nowplaying.innerHTML = `now playing: ${sources[index].name}`;
        const temp_timeout = setTimeout(() => {
            nowplaying.innerHTML = '';
        }, 4000);
        timeout = temp_timeout; // save timeout to clear it later
    }
    catch {} // will throw error on first load (nowplaying is not on dom yet)
    videoElement.innerHTML = `<source src="/assets/media/background/${sources[index].src}" type="video/mp4">`;
    videoElement.load();
    videoElement.play();
}
