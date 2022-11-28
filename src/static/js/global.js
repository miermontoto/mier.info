window.onload = christmas();

function christmas() {
    if (getChristmas()) {
        document.body.style.cursor = "url('/assets/util/xmas.png'), auto";
    }
}

function getChristmas() {
    return new Date().getMonth() == 10;
}
