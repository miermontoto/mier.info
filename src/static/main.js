function chooseRandomString() {
    var strings = [
        "still celebrating Homework 25th anniversary",
        "the prime time of your life. now, live it.",
        "something's in the air.",
        "we are human, after all.",
        "WDPK 83.7, the sound of tomorrow the music of today, brings you exclusively the essential mix.",
        "if love is the answer, you're home.",
        "the perfect song is framed with silence.",
        "make love.",
        "and we will never be alone again.",
    ];
    var randomString = strings[Math.floor(Math.random() * strings.length)];
    document.getElementById('scroll-string').innerHTML = randomString;
}