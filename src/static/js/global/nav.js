// panel de navegación con autocompletado (estilo Arc/Zen browser)
// shortcut: / (como GitHub, Slack, etc.)
const NAV_PANEL_ID = "nav-panel";
const NAV_INPUT_ID = "nav-input";
const NAV_RESULTS_ID = "nav-results";

let navPanel = null;
let navInput = null;
let navResults = null;
let selectedIndex = -1;
let filteredPages = [];

const isIndexPage = () =>
  window.location.pathname === "/" ||
  window.location.pathname === "/index.html";

function createNavPanel() {
  if (document.getElementById(NAV_PANEL_ID)) return;

  const panel = document.createElement("div");
  panel.id = NAV_PANEL_ID;
  panel.className = isIndexPage() ? "nav-centered" : "nav-breadcrumb";

  const container = document.createElement("div");
  container.className = "nav-container";

  const prefix = document.createElement("div");
  prefix.className = "nav-prefix";
  prefix.textContent = "/";

  const input = document.createElement("input");
  input.type = "text";
  input.id = NAV_INPUT_ID;
  input.autocomplete = "off";
  input.spellcheck = false;
  input.placeholder = "navigate...";

  const results = document.createElement("ul");
  results.id = NAV_RESULTS_ID;

  container.appendChild(prefix);
  container.appendChild(input);
  panel.appendChild(container);
  panel.appendChild(results);
  document.body.appendChild(panel);

  navPanel = panel;
  navInput = input;
  navResults = results;

  navInput.addEventListener("input", handleInput);
  navInput.addEventListener("keydown", handleKeydown);
  panel.addEventListener("click", handlePanelClick);
}

function showNavPanel() {
  if (!navPanel) createNavPanel();

  navPanel.classList.add("active");
  navInput.value = "";
  selectedIndex = -1;
  filteredPages = window.__NAV_PAGES__ || [];
  renderResults();
  navInput.focus();

  document.body.style.overflow = "hidden";
}

function hideNavPanel() {
  if (!navPanel) return;

  navPanel.classList.remove("active");
  document.body.style.overflow = "";
}

function isNavPanelActive() {
  return navPanel?.classList.contains("active");
}

function handleInput() {
  const query = navInput.value.toLowerCase().trim();
  const allPages = window.__NAV_PAGES__ || [];

  if (!query) {
    filteredPages = allPages;
  } else {
    // filtra y ordena: coincidencias exactas primero, luego parciales
    const matches = allPages.filter((page) => page.searchText.includes(query));

    matches.sort((a, b) => {
      const aKey = a.key.toLowerCase();
      const bKey = b.key.toLowerCase();
      const aSlug = a.slug.toLowerCase();
      const bSlug = b.slug.toLowerCase();

      // prioridad 1: coincidencia exacta en key o slug
      const aExact = aKey === query || aSlug === query;
      const bExact = bKey === query || bSlug === query;
      if (aExact && !bExact) return -1;
      if (bExact && !aExact) return 1;

      // prioridad 2: key/slug empieza con el query
      const aStarts = aKey.startsWith(query) || aSlug.startsWith(query);
      const bStarts = bKey.startsWith(query) || bSlug.startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (bStarts && !aStarts) return 1;

      // prioridad 3: páginas sin parent (top-level) primero
      const aTopLevel = !a.parent;
      const bTopLevel = !b.parent;
      if (aTopLevel && !bTopLevel) return -1;
      if (bTopLevel && !aTopLevel) return 1;

      // fallback: orden alfabético
      return aKey.localeCompare(bKey);
    });

    filteredPages = matches;
  }

  selectedIndex = filteredPages.length > 0 ? 0 : -1;
  renderResults();
}

function handleKeydown(event) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (selectedIndex < filteredPages.length - 1) {
        selectedIndex++;
        renderResults();
        scrollToSelected();
      }
      break;

    case "ArrowUp":
      event.preventDefault();
      if (selectedIndex > 0) {
        selectedIndex--;
        renderResults();
        scrollToSelected();
      }
      break;

    case "Enter":
      event.preventDefault();
      if (selectedIndex >= 0 && filteredPages[selectedIndex]) {
        navigateTo(filteredPages[selectedIndex].url);
      }
      break;

    case "Escape":
      event.preventDefault();
      hideNavPanel();
      break;

    case "Tab":
      event.preventDefault();
      if (selectedIndex >= 0 && filteredPages[selectedIndex]) {
        navInput.value = filteredPages[selectedIndex].key;
        handleInput();
      }
      break;
  }
}

function handlePanelClick(event) {
  if (event.target === navPanel) {
    hideNavPanel();
  }
}

function scrollToSelected() {
  const selectedItem = navResults.querySelector(".nav-item.selected");
  if (selectedItem) {
    selectedItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

function createNavItem(page, index) {
  const li = document.createElement("li");
  li.className = "nav-item" + (index === selectedIndex ? " selected" : "");
  li.dataset.url = page.url;

  if (page.parent) {
    const parentSpan = document.createElement("span");
    parentSpan.className = "nav-parent";
    parentSpan.textContent = page.parent + "/";
    li.appendChild(parentSpan);
  }

  if (page.emoji) {
    const emojiSpan = document.createElement("span");
    emojiSpan.className = "nav-emoji";
    emojiSpan.textContent = page.emoji + " ";
    li.appendChild(emojiSpan);
  }

  const keySpan = document.createElement("span");
  keySpan.className = "nav-key";
  keySpan.textContent = page.key;
  li.appendChild(keySpan);

  li.addEventListener("click", () => navigateTo(page.url));
  li.addEventListener("mouseenter", () => {
    selectedIndex = index;
    updateSelection();
  });

  return li;
}

function updateSelection() {
  const items = navResults.querySelectorAll(".nav-item");
  items.forEach((item, i) => {
    item.classList.toggle("selected", i === selectedIndex);
  });
}

function renderResults() {
  if (!navResults) return;

  while (navResults.firstChild) {
    navResults.removeChild(navResults.firstChild);
  }

  if (filteredPages.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "nav-empty";
    emptyLi.textContent = "no pages found";
    navResults.appendChild(emptyLi);
    return;
  }

  filteredPages.forEach((page, index) => {
    navResults.appendChild(createNavItem(page, index));
  });
}

function navigateTo(url) {
  hideNavPanel();
  window.location.href = url;
}

function initNavigation() {
  document.addEventListener("keydown", (event) => {
    // "/" para abrir (solo si no está en un input/textarea)
    if (event.key === "/" && !isNavPanelActive()) {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        activeEl.isContentEditable;

      if (!isTyping) {
        event.preventDefault();
        showNavPanel();
      }
    }

    // Escape para cerrar
    if (event.key === "Escape" && isNavPanelActive()) {
      hideNavPanel();
    }
  });

  // click en el cursor de breadcrumbs también abre el panel
  const breadcrumbsCursor = document.querySelector(".bc-cursor");
  if (breadcrumbsCursor) {
    breadcrumbsCursor.style.cursor = "pointer";
    breadcrumbsCursor.addEventListener("click", showNavPanel);
  }
}

document.addEventListener("DOMContentLoaded", initNavigation);

export { showNavPanel, hideNavPanel };
