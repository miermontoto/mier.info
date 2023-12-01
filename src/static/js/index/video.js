import randomize from './randomize.js';

fetch('/content/data/backgrounds.json').then(response => response.json()).then(data => {
    let source = document.createElement('source');
    source.src = `/assets/media/background/${randomize(data)}`;
    source.type = 'video/mp4';

	let videoElement = document.getElementById('background');
    videoElement.appendChild(source);
    videoElement.play();
});
