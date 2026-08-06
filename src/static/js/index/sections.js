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

// niveles del historial: 0 = índice desnudo, 1 = una sección abierta. las secciones son
// hermanas entre sí, así que saltar de una a otra reemplaza la entrada en vez de apilarla:
// "atrás" siempre cierra y nunca vuelve a la sección anterior
const BASE_LEVEL = 0;
const SECTION_LEVEL = 1;

const activeLabel = () => sections.find(({ section }) => section.classList.contains('active'))?.label ?? null;
const labelFromHash = () => sections.find(({ label }) => label === decodeURIComponent(location.hash.slice(1)))?.label ?? null;
const isSectionEntry = () => history.state?.level === SECTION_LEVEL;

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
                    toggleSection(label);
                });
            });
        }

        // registrar shortcut en el manager global
        if (key && window.shortcuts) {
            window.shortcuts.register(key, () => toggleSection(label), label, 'sections');
        }
    });

    // botón "back" (solo visible en móvil): cierra la sección que lo contiene
    document.querySelectorAll('.section-back').forEach((back) => {
        ['click', 'touchend'].forEach(eventType => {
            back.addEventListener(eventType, (event) => {
                event.preventDefault();
                event.stopPropagation();
                clearSections();
            });
        });
    });

    // registrar escape para cerrar secciones (hidden)
    if (window.shortcuts) {
        window.shortcuts.register('Escape', () => clearSections(), 'close', 'sections', true);
    }

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchend', handleOutsideClick);

    initializeHistory();
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

// engancha las secciones al historial del navegador. atrás/adelante (teclado, gesto táctil
// o los botones laterales del ratón, que el navegador traduce a navegación de historial)
// abren y cierran secciones en vez de sacarte del sitio
function initializeHistory() {
    // el estado manda; si falta (hash escrito a mano) caemos al fragmento de la url
    window.addEventListener('popstate', ({ state }) => render(state?.section ?? labelFromHash()));

    // recarga o bfcache sobre una sección: el historial ya está normalizado, solo repintamos
    if (isSectionEntry()) {
        render(history.state.section);
        return;
    }

    // enlace directo (/#about): dejamos debajo una entrada base sin sección para que
    // "atrás" cierre en vez de abandonar la página
    const deepLink = labelFromHash();
    history.replaceState({ level: BASE_LEVEL, section: null }, '', location.pathname + location.search);
    if (deepLink) navigate(deepLink);
}

// punto único de navegación: toda apertura o cierre pasa por el historial
function navigate(label) {
    if (label === activeLabel()) return;

    if (!label) {
        // la entrada abierta la apilamos nosotros, así que retrocedemos en vez de apilar otra:
        // "adelante" reabre la sección y el historial no crece a cada toggle
        if (isSectionEntry()) history.back();
        else render(null);
        return;
    }

    const state = { level: SECTION_LEVEL, section: label };
    const url = `#${label}`;

    // pushState nunca hace scroll al fragmento, a diferencia de asignar location.hash
    if (isSectionEntry()) history.replaceState(state, '', url);
    else history.pushState(state, '', url);

    render(label);
}

// aplica el estado visual sin tocar el historial
function render(label) {
    sections.forEach(({ section, label: name }) => section.classList.toggle('active', name === label));
}

function toggleSection(label) {
    navigate(activeLabel() === label ? null : label);
}

function clearSections() {
    navigate(null);
}

// init when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeSections);
