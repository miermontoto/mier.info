const sections = [
    { buttonId: 'project-button', sectionId: 'project-section' },
    { buttonId: 'about-button', sectionId: 'about-section' }
].map(({ buttonId, sectionId }) => ({
    button: document.getElementById(buttonId),
    section: document.getElementById(sectionId)
}));

const projects = document.getElementById('projects');

function initializeSections() {
    sections.forEach(({ button, section }) => {
        if (!button || !section) {
            console.error(`button or section not found for ${button?.id || section?.id}`);
            return;
        }

        ['click', 'touchend'].forEach(eventType => {
            button.addEventListener(eventType, (event) => {
                event.preventDefault();
                toggleSection(section);
            });
        });
    });

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchend', handleOutsideClick);
}

function handleOutsideClick(event) {
    const activeSection = sections.find(({ section }) => section.classList.contains('active'));
    if (activeSection) {
        const { button, section } = activeSection;
        if (
            event.target !== section &&
            event.target !== button &&
            !section.contains(event.target)
        ) {
            clearSections();
        }
    }
}

function toggleSection(section) {
    const sectionIsActive = section.classList.contains('active');
    clearSections();
    if (!sectionIsActive) {
        section.classList.add('active');
    }
}

function clearSections() {
    sections.forEach(({ section }) => section.classList.remove('active'));
}

// init when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeSections);
