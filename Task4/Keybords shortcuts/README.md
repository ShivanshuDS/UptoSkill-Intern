# ⌨️ Keyboard Shortcuts 
### Task 11 Documentation

---

## Overview

**Key Shortcut** is an interactive web demo that showcases real-time keyboard shortcut detection, a searchable command palette, live key visualization, and action logging — all built with **vanilla HTML, CSS, and JavaScript** (no frameworks, no build step required).

The app captures every key the user presses, matches it against a registry of 18 registered shortcuts, and provides instant visual + toast feedback for each action.

---

## Project Structure

| File | Description |
|------|-------------|
| `index.html` | Main HTML layout — structure, sections, and template containers |
| `style.css` | All visual styles — dark/light theme variables, animations, component styling |
| `script.js` | Core logic — shortcut registry, key detection, palette, actions, logging |
| `README.md` | This documentation file |

---

## How It Works

### 1. Key Detection (`script.js`)

The browser's `keydown` event is listened to on the `document`. Every time a key is pressed, the event object provides:

```js
document.addEventListener('keydown', (event) => {
  const key     = event.key;        // e.g. "s", "Shift", "ArrowDown"
  const isCtrl  = event.ctrlKey;    // true if Ctrl is held
  const isShift = event.shiftKey;   // true if Shift is held
  const isAlt   = event.altKey;     // true if Alt is held
  const isMeta  = event.metaKey;    // true if Cmd (Mac) is held
});
```

Keys pressed inside `<input>` or `<textarea>` elements are **ignored** so the user can type normally:

```js
const inInput = tag === 'INPUT' || tag === 'TEXTAREA';
if (inInput) return;
```

---

### 2. Shortcut Matching

After capturing the key event, the handler builds a `parts[]` array of modifier labels (`Ctrl`, `Shift`, `Alt`, `⌘`) and then checks each combination:

```js
if (e.ctrlKey && e.key.toLowerCase() === 's') {
  matched = shortcuts.find(s => s.id === 'save');
}
```

When a match is found:
- `event.preventDefault()` stops the browser's default behavior
- The matching shortcut card **glows green** (`fireCard()`)
- A **toast notification** appears
- The **action log** is updated with a timestamp
- The **stats counters** increment

---

### 3. Shortcut Registry (Data-Driven)

All shortcuts are defined in a single `shortcuts[]` array at the top of `script.js`. Each entry looks like:

```js
{ 
  id: 'save',
  keys: ['Ctrl', 's'],
  name: 'Save Document',
  desc: 'Saving the current document',
  cat: 'edit',
  icon: '💾',
  color: 'cat-edit'
}
```

This array drives **all three** rendered components — the shortcuts grid, the help panel, and the command palette — so adding a new shortcut only requires one entry here.

---

### 4. Live Key Visualizer

Every keypress (shortcut or not) renders the pressed key combination in the "Live Key Detection" display:

```js
function showKeyDisplay(parts, action) {
  // parts = ['Ctrl', 'S']  →  renders as pill-shaped key chips
  // action = 'Save Document'  →  shown as "→ Save Document"
}
```

---

### 5. Command Palette (`Ctrl + K`)

The palette overlays the page and allows **searching all commands by name or description**:

```js
function renderPaletteResults(query) {
  paletteFiltered = commands.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.desc.toLowerCase().includes(q)
  );
}
```

Keyboard navigation inside the palette:
- `↑` / `↓` — move selection up/down
- `Enter` — run the highlighted command
- `ESC` — close palette

---

### 6. Actions Map

Each shortcut ID maps to a named function in the `actions` object:

```js
const actions = {
  'save':  () => { showToast('Saved ✓', 'Document saved.', 'var(--accent3)'); addLog('Document saved', 'Ctrl+S'); },
  'theme': () => toggleTheme(),
  'help':  () => openHelp(),
  // ...
};
```

When a shortcut fires (via keyboard or palette), `actions[matched.id]()` is called.

---

### 7. Theme Toggle (`Ctrl + I`)

Switches between **dark** and **light** mode by updating CSS custom properties at runtime:

```js
function toggleTheme() {
  isLight = !isLight;
  document.documentElement.style.setProperty('--bg', isLight ? '#f4f4f8' : '#0a0a0f');
  document.documentElement.style.setProperty('--text', isLight ? '#111118' : '#e8e8f0');
  // ... and more variables
}
```

All colors in `style.css` use `var(--variable)`, so changing one property updates the entire UI instantly.

---

### 8. Toast Notifications

Context-aware pop-ups that auto-dismiss after 2.5 seconds:

```js
function showToast(title, msg, accent) {
  // Creates a .toast div, appends to #toast-container
  // Adds .out class after 2500ms → CSS fade-out → removes element
}
```

---

### 9. Action Log

Keeps a rolling history of the last 6 actions with timestamps:

```js
function addLog(text, shortcut) {
  const time = new Date().toTimeString().slice(0, 8); // "HH:MM:SS"
  logEntries.unshift({ time, text, shortcut });
  if (logEntries.length > 6) logEntries.pop();
}
```

---

### 10. Browser-Reserved Shortcuts Warning

On load, a floating warning banner automatically appears, noting that `Ctrl+N` (new window) and `Ctrl+W` (close tab) are **reserved by the browser** and cannot be intercepted by any website. The banner can be dismissed by clicking ✕.

---

## Registered Shortcuts

| Shortcut | Action | Category |
|----------|--------|----------|
| `Ctrl + K` | Open Command Palette | Navigation |
| `Ctrl + S` | Save Document | Edit |
| `Ctrl + Z` | Undo | Edit |
| `Ctrl + Y` | Redo | Edit |
| `Ctrl + F` | Find | Search |
| `Ctrl + N` | New File *(browser-reserved)* | System |
| `Ctrl + W` | Close Tab *(browser-reserved)* | Navigation |
| `Ctrl + B` | Bold Text | Edit |
| `Ctrl + A` | Select All | Edit |
| `Ctrl + C` | Copy | Edit |
| `Ctrl + V` | Paste | Edit |
| `Ctrl + I` | Toggle Theme | UI |
| `Ctrl + +` | Zoom In | UI |
| `Ctrl + -` | Zoom Out | UI |
| `Ctrl + R` | Reload | System |
| `Shift + ?` | Open Help Panel | Navigation |
| `Home` | Scroll to Top | Navigation |
| `End` | Scroll to Bottom | Navigation |

---

## UI Components

| Component | Description |
|-----------|-------------|
| **Live Key Display** | Shows every key combination pressed in real time as styled pill chips |
| **Shortcut Cards Grid** | All 18 shortcuts rendered as cards with icon, name, description, and key caps; cards glow green when triggered |
| **Command Palette** | Fullscreen overlay (Ctrl+K) with live-search and keyboard navigation |
| **Help Panel** | Side panel (Shift+?) listing all shortcuts in a compact reference format |
| **Toast Notifications** | Auto-dismissing pop-ups with color-coded accents per action type |
| **Action Log** | Timestamped rolling log of the last 6 keyboard actions |
| **Stats Bar** | Live counters for total keys pressed, shortcuts triggered, and palette opens |
| **Theme Toggle** | Instant dark ↔ light mode switch via CSS variable overrides |
| **Browser Note Banner** | Auto-shown warning about browser-reserved shortcuts with dismiss button |

---

## How to Run

1. Download or clone all four files into the same folder
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge)
3. **No build step, no server, no dependencies** — fully self-contained
4. Start pressing keys!

---

## Acceptance Criteria Checklist

- [x] Documented (this file)
- [x] Demonstrated (working HTML demo)
- [x] Reproducible (open `index.html` directly, no server needed)
- [x] 18 keyboard shortcuts registered and functional
- [x] Live key visualizer working
- [x] Command palette with search and keyboard navigation
- [x] Toast notifications per action
- [x] Action log with timestamps
- [x] Stats counters
- [x] Dark / Light theme toggle
- [x] Browser-reserved shortcut warning

---

> Task 11 — Keyboard Shortcuts · Difficulty: Easy to Moderate · Duration: 3 days
