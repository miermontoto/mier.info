// global shortcuts manager
class ShortcutsManager {
  constructor() {
    this.shortcuts = new Map();
    this.panel = null;
    this.visible = false;
    this._init();
  }

  _init() {
    document.addEventListener("keydown", (e) => this._handleKey(e));
  }

  // registra un shortcut: key, callback, label, categoria, hidden
  register(key, callback, label, category = "general", hidden = false) {
    this.shortcuts.set(key, { callback, label, category, hidden });
    this._updatePanel();
  }

  // elimina un shortcut
  unregister(key) {
    this.shortcuts.delete(key);
    this._updatePanel();
  }

  _handleKey(e) {
    // ignorar si el usuario esta escribiendo en un input
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) {
      return;
    }

    // escape siempre cierra el panel si esta visible
    if (e.key === "Escape" && this.visible) {
      e.preventDefault();
      this.hide();
      return;
    }

    const shortcut = this.shortcuts.get(e.key);
    if (shortcut) {
      e.preventDefault();
      shortcut.callback();
    }
  }

  _createPanel() {
    const panel = document.createElement("div");
    panel.id = "shortcuts-panel";
    panel.style.display = "none";
    document.body.appendChild(panel);
    return panel;
  }

  _updatePanel() {
    if (!this.panel) return;
    this.panel.replaceChildren();

    const title = document.createElement("h3");
    title.textContent = "keyboard shortcuts.";
    this.panel.appendChild(title);

    // agrupar por categoria (excluyendo hidden)
    const grouped = {};
    for (const [key, { label, category, hidden }] of this.shortcuts) {
      if (hidden) continue;
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push({ key, label });
    }

    // generar elementos
    for (const [category, items] of Object.entries(grouped)) {
      const header = document.createElement("h4");
      header.textContent = category;
      this.panel.appendChild(header);

      for (const { key, label } of items) {
        const div = document.createElement("div");
        div.className = "shortcut";

        const keySpan = document.createElement("span");
        keySpan.className = "key";
        keySpan.textContent = key === " " ? "space" : key;

        div.appendChild(keySpan);
        div.appendChild(document.createTextNode(` ${label}`));
        this.panel.appendChild(div);
      }
    }
  }

  toggle() {
    if (!this.panel) {
      this.panel = this._createPanel();
      this._updatePanel();
    }
    this.visible = !this.visible;
    this.panel.style.display = this.visible ? "block" : "none";
  }

  show() {
    if (!this.panel) {
      this.panel = this._createPanel();
      this._updatePanel();
    }
    this.visible = true;
    this.panel.style.display = "block";
  }

  hide() {
    if (!this.panel) return;
    this.visible = false;
    this.panel.style.display = "none";
  }
}

// instancia global
window.shortcuts = new ShortcutsManager();

// registrar shortcuts globales (disponibles en todas las paginas)
window.shortcuts.register(".", () => window.open("https://github.com/miermontoto/mier.info", "_blank"), "source", "links");
window.shortcuts.register("c", () => window.open("/changelog", "_self"), "changelog", "links");
window.shortcuts.register("t", () => window.open("/treemap", "_self"), "treemap", "links");
window.shortcuts.register("?", () => window.shortcuts.toggle(), "show shortcuts", "general", true);

// ir al index solo si no estamos ahi
if (window.location.pathname !== "/") {
  window.shortcuts.register("i", () => window.open("/", "_self"), "index", "links");
}
