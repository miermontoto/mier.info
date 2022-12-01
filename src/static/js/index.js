window.onload = marqueeString();

function marqueeString() {
    var strings = [
        "still celebrating Homework 25th anniversary.",
        "the prime time of your life. now, live it.",
        "something's in the air.",
        "we are human, after all.",
        "WDPK 83.7, the sound of tomorrow the music of today, brings you exclusively the essential mix.",
        "if love is the answer, you're home.",
        "the perfect song is framed with silence.",
        "make love.",
        "and we will never be alone again.",
        "many rooms to explore but the doors look the same.",
        "ROCK. ROBOT ROCK.",
        "touch it. bring it. pay it. watch it. turn it. leave it. stop. format it."
    ];

    let randomString = strings[Math.floor(Math.random() * strings.length)];
    document.getElementById('scroll-string').innerHTML = randomString;
}

function toggleSection(id) {
    let dom = document.getElementById(id);
    let about = document.getElementById('about-section');
    let projects = document.getElementById('project-section');

    toggleVisibility(id);
    if (dom == about) { projects.hidden = true; } else { about.hidden = true; }
}

function toggleVisibility(id) {
    let dom = document.getElementById(id);
    dom.hidden = !dom.hidden;
}
