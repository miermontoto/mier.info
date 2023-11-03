const sections = [
    { button: document.getElementById('project-button'), section: document.getElementById('project-section') },
    { button: document.getElementById('about-button'), section: document.getElementById('about-section') }
];

const projects = document.querySelector('table#projects');

const strings = [
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
    "touch it. bring it. pay it. watch it. turn it. leave it. stop. format it.",
    "around the world.",
    "music sounds better with you.",
    "one more time."
];

sections.forEach(({ button, section }) => {
    button.addEventListener('click', () => {
        toggleSection(section);
    });
});

document.getElementById('title').addEventListener('click', () => {
    marqueeString();
});

marqueeString();

// order projects by starred
projects.querySelectorAll('.project').forEach((project) => {
    if (project.classList.contains('star')) {
        projects.append(project);

        project.querySelector('.project-title').innerHTML += ' ⭐';
    }
});

projects.querySelectorAll('.project').forEach((project) => {
    if (!project.classList.contains('star')) {
        projects.append(project);
    }
});

// --------------------------------------------- //

function toggleSection(section) {
    // if section is already active, save to constant
    const sectionIsActive = section.classList.contains('active');

    // remove active class from all sections
    document.querySelectorAll('.section').forEach((s) => {
        s.classList.remove('active');
    });

    // add active class to the selected section if it wasn't active before
    if (!sectionIsActive) {
        section.classList.add('active');
    }
}


function marqueeString() {
    let randomString = strings[Math.floor(Math.random() * strings.length)];
    document.getElementById('marquee').innerHTML = randomString;
}
