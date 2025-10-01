const span = document.getElementById('messages-span');
const DISPLAY_TIME = 4000;
const queue = [];
let timeout;


export function addMessage(msg) {
    queue.push(msg);
    if (!timeout) {
        showMessage(queue.shift());
    }
}

export function showMessage(msg) {
    if (!msg) return;

    span.innerHTML = msg;
    span.style.display = 'block';

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        span.style.display = 'none';
        timeout = null;
        if (queue.length > 0) {
            showMessage(queue.shift());
        }
    }, DISPLAY_TIME);
}
