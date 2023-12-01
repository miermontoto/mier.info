import randomize from './randomize.js';

fetch('/content/data/marquee.json').then(response => response.json()).then(data => {
    let string = randomize(data);
    let marquee = document.getElementById('marquee-main');
    marquee.innerHTML = string.text;
    if (string.url && string.url !== '') {
        marquee.addEventListener('click', () => window.open(string.url, '_blank'));
        marquee.style.cursor = 'help';
    }
});
