window.addEventListener('load', () => {
    const sections = [
        { button: document.querySelector('#project-button'), section: document.querySelector('#project-section') },
        { button: document.querySelector('#about-button'), section: document.querySelector('#about-section') }
    ];

    const projects = document.querySelector('table#projects');

    sections.forEach(({ button, section }) => {
        button.addEventListener('click', () => {
            toggleSection(section);
        });
    });

    document.querySelector('#title').addEventListener('click', () => {
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
    fetch('index.data.json').then(response => response.json()).then(data => {
        let strings = data.marquee;
        let randomString = strings[Math.floor(Math.random() * strings.length)];
        document.getElementById('marquee').innerHTML = randomString;
    });
}
