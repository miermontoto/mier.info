fetch('index.data.json').then(response => response.json()).then(data => {
    let strings = data.marquee;
    let string = strings[Math.floor(Math.random() * strings.length)];
    let marquee = document.getElementById('marquee');
    marquee.innerHTML = string.text;
    if (string.url && string.url !== '') {
        marquee.addEventListener('click', () => {
            window.open(string.url, '_blank');
        });
        marquee.style.cursor = 'help';
    }
});

const sections = [
    { button: document.getElementById('project-button'), section: document.getElementById('project-section') },
    { button: document.getElementById('about-button'), section: document.getElementById('about-section') }
];

const projects = document.getElementById('projects');

sections.forEach(({ button, section }) => {
    button.addEventListener('click', () => {
        toggleSection(section);
    });
});

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
