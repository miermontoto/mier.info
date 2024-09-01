const sections = [
    { buttonId: 'project-button', sectionId: 'project-section', key: 'p' },
    { buttonId: 'about-button', sectionId: 'about-section', key: 'a' },
    { sectionId: 'shortcuts-section', key: '?' }
].map(({ buttonId, sectionId, key }) => ({
    button: document.getElementById(buttonId),
    section: document.getElementById(sectionId),
    key
}));

const projects = document.getElementById('projects');

function initializeSections() {
    sections.forEach(({ button, section, key }) => {
        if (!section) {
            console.error(`section not found:`, section?.id);
            return;
        }

        // add event listeners for the buttons that toggle the sections
        // (if the button exists)
        if (button) {
            ['click', 'touchend'].forEach(eventType => {
                button.addEventListener(eventType, (event) => {
                    event.preventDefault();
                    toggleSection(section);
                });
            });
        }

        if (!key) {
            return;
        }

        // add event listener for the key that toggles the section (optional)
        document.addEventListener('keydown', (event) => {
            if (event.key === key) {
                toggleSection(section);
            }
        });
    });

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchend', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
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

function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        clearSections();
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
