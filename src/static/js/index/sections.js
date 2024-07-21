const sections = [
    { button: document.getElementById('project-button'), section: document.getElementById('project-section') },
    { button: document.getElementById('about-button'), section: document.getElementById('about-section') }
];

const projects = document.getElementById('projects');

sections.forEach(({ button, section }) => {
    button.addEventListener('click', () => {
        toggleSection(section);
    });

    window.addEventListener('click', (event) => {
        if (!section.classList.contains('active')) return;

        if (
            event.target !== section &&     // si se hace click fuera del section
            event.target !== button &&      // y no es al botón (al invocarlo)
            !section.contains(event.target) // y no está dentro de la section
        ) {clearSections();}                // cerrar todas las secciones
    });
});

function toggleSection(section) {
    // if section is already active, save to constant
    const sectionIsActive = section.classList.contains('active');

    // remove active class from all sections
    clearSections();

    // add active class to the selected section if it wasn't active before
    if (!sectionIsActive) {
        section.classList.add('active');
    }
}

function clearSections() {
    sections.forEach(({ section }) => {
        section.classList.remove('active');
    });
}
