import {randElement} from './randomize.js';

fetch('/content/data/marquee.json').then(response => response.json()).then(data => {
    let string = randElement(data);
    let marquee = document.getElementById('marquee');
    marquee.innerHTML = string.text;
    if (string.url && string.url !== '') {
        marquee.addEventListener('click', () => window.open(string.url, '_blank'));
        marquee.style.cursor = 'help';
    }
});
