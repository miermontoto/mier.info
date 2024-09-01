import { randElement } from './randomize.js';

const marquee = document.getElementById('marquee');
const data = await fetch('/content/data/marquee.json').then(response => response.json());
let listener;

function fetchMarquee() {
    let string = randElement(data);
    marquee.innerHTML = string.text;
    marquee.style.cursor = 'default';

    if (string.url && string.url !== '') {
        if (listener) {
            marquee.removeEventListener('click', listener);
        }

        listener = () => window.open(string.url, '_blank');
        marquee.addEventListener('click', listener);
        marquee.style.cursor = 'help';
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'm') {
        fetchMarquee();
    }
});

fetchMarquee();
