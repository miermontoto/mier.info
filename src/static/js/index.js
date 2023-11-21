fetch('index.data.json').then(response => response.json()).then(data => {
    let string = randomize(data.marquee);
    let marquee = document.getElementById('marquee');
    marquee.innerHTML = string.text;
    if (string.url && string.url !== '') {
        marquee.addEventListener('click', () => {
            window.open(string.url, '_blank');
        });
        marquee.style.cursor = 'help';
    }

    let videoElement = document.getElementById('background');

    let source = document.createElement('source');
    source.src = `/assets/media/${randomize(data.videos)}`;
    source.type = 'video/mp4';
    videoElement.appendChild(source);
    videoElement.play();
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

let fullscreen = document.getElementById('fullscreen-background');
let overlay = document.getElementById('overlay');
fullscreen.addEventListener('click', () => {
    let videoElement = document.getElementById('background');

    if (videoElement.classList.contains('fullscreen')) {
        videoElement.classList.remove('fullscreen');
        fullscreen.classList.remove('active');
        overlay.style.zIndex = '2';
    } else {
        videoElement.classList.add('fullscreen');
        fullscreen.classList.add('active');
        overlay.style.zIndex = '4';
    }
});

document.getElementById('stop-background').addEventListener('click', () => {
    document.getElementById('background').src = '';
    document.getElementById('overlay').innerHTML = '';
    document.getElementById('background').style.zIndex = '-1';
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

function randomize(col) {
    return col[Math.floor(Math.random() * col.length)];
}
