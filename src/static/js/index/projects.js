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
