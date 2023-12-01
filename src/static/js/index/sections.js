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
