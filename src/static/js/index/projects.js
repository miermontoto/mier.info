let projects = document.getElementById('project-list');

// order projects by starred
projects.querySelectorAll('.project').forEach((project) => {
    if (project.classList.contains('star')) {
        project.querySelector('.project-title').innerHTML += ' ⭐';
    }
});
