const sections = [
    { buttonId: 'project-button', sectionId: 'project-section', key: 'p', label: 'projects' },
    { buttonId: 'about-button', sectionId: 'about-section', key: 'a', label: 'about' }
].map(({ buttonId, sectionId, key, label }) => ({
    button: document.getElementById(buttonId),
    section: document.getElementById(sectionId),
    key,
    label
}));

const projects = document.getElementById('projects');

function initializeSections() {
    sections.forEach(({ button, section, key, label }) => {
        if (!section) {
            console.error(`section not found:`, section?.id);
            return;
        }

        // add event listeners for the buttons that toggle the sections
        if (button) {
            ['click', 'touchend'].forEach(eventType => {
                button.addEventListener(eventType, (event) => {
                    event.preventDefault();
                    toggleSection(section);
                });
            });
        }

        // registrar shortcut en el manager global
        if (key && window.shortcuts) {
            window.shortcuts.register(key, () => toggleSection(section), label, 'sections');
        }
    });

    // registrar escape para cerrar secciones (hidden)
    if (window.shortcuts) {
        window.shortcuts.register('Escape', () => clearSections(), 'close', 'sections', true);
    }

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
