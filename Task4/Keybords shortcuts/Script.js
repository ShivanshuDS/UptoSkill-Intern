// ── DATA ───────────────────────────────────────────────────────────────────
const shortcuts = [
  { id:'palette',   keys:['Ctrl','k'],               name:'Command Palette',    desc:'Open the command search palette',           cat:'nav',    icon:'⌕',  color:'cat-nav'    },
  { id:'save',      keys:['Ctrl','s'],               name:'Save Document',      desc:'Saving the current document',               cat:'edit',   icon:'💾', color:'cat-edit'   },
  { id:'undo',      keys:['Ctrl','z'],               name:'Undo',               desc:'Undo the last action',                      cat:'edit',   icon:'↩',  color:'cat-edit'   },
  { id:'redo',      keys:['Ctrl','y'],               name:'Redo',               desc:'Redo the previously undone action',         cat:'edit',   icon:'↪',  color:'cat-edit'   },
  { id:'find',      keys:['Ctrl','f'],               name:'Find',               desc:'Open the find / search bar',                cat:'search', icon:'🔍', color:'cat-search' },
  { id:'new',       keys:['Ctrl','n'],               name:'New File',           desc:'Create a new file or document',             cat:'sys',    icon:'📄', color:'cat-sys'    },
  { id:'close',     keys:['Ctrl','w'],               name:'Close Tab',          desc:'Close the current tab or panel',            cat:'nav',    icon:'✕',  color:'cat-nav'    },
  { id:'bold',      keys:['Ctrl','b'],               name:'Bold Text',          desc:'Toggle bold on selected text',              cat:'edit',   icon:'B',  color:'cat-edit'   },
  { id:'selectall', keys:['Ctrl','a'],               name:'Select All',         desc:'Select all content in the active area',     cat:'edit',   icon:'▣',  color:'cat-edit'   },
  { id:'copy',      keys:['Ctrl','c'],               name:'Copy',               desc:'Copy selected content to clipboard',        cat:'edit',   icon:'⧉',  color:'cat-edit'   },
  { id:'paste',     keys:['Ctrl','v'],               name:'Paste',              desc:'Paste content from clipboard',              cat:'edit',   icon:'📋', color:'cat-edit'   },
  { id:'theme',     keys:['Ctrl','i'],       name:'Toggle Theme',       desc:'Switch between dark and light mode',        cat:'ui',     icon:'◑',  color:'cat-ui'     },
  { id:'zoom-in',   keys:['Ctrl','+'],               name:'Zoom In',            desc:'Increase the zoom / font size',             cat:'ui',     icon:'＋', color:'cat-ui'     },
  { id:'zoom-out',  keys:['Ctrl','-'],       name:'Zoom Out',           desc:'Decrease the zoom / font size',             cat:'ui',     icon:'－', color:'cat-ui'     },
  { id:'reload',    keys:['Ctrl','r'],               name:'Reload',             desc:'Simulate a page reload',                    cat:'sys',    icon:'↻',  color:'cat-sys'    },
  { id:'help',      keys:['Shift','?'],              name:'Help / Reference',   desc:'Open the keyboard shortcuts reference',     cat:'nav',    icon:'?',  color:'cat-nav'    },
  { id:'scroll-top',  keys:['Home'], name:'Scroll to Top',    desc:'Jump to the top of the page',  cat:'nav', icon:'🔝', color:'cat-nav' },
  { id:'scroll-bot',  keys:['End'],  name:'Scroll to Bottom', desc:'Jump to the bottom of the page', cat:'nav', icon:'👇', color:'cat-nav' },
];

const commands = [
  ...shortcuts,
];

// ── BROWSER-RESERVED NOTE ─────────────────────────────────────────────────
(function showBrowserNote() {
  const note = document.createElement('div');
  note.id = 'browser-note';
  note.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:10px;">
      <span style="font-size:1.1rem;margin-top:1px;">⚠️</span>
      <div>
        <div style="font-weight:600;font-size:0.82rem;color:#ffc850;margin-bottom:4px;font-family:'Space Mono',monospace;">Browser-Reserved Shortcuts</div>
        <div style="font-size:0.76rem;color:#a0a0b8;line-height:1.6;">
          <span style="color:#e8e8f0;"><kbd style="background:#1e1e2e;border:1px solid #3a3a5c;border-radius:4px;padding:1px 6px;font-size:0.7rem;">Ctrl+N</kbd></span>and
          <span style="color:#e8e8f0;"><kbd style="background:#1e1e2e;border:1px solid #3a3a5c;border-radius:4px;padding:1px 6px;font-size:0.7rem;">Ctrl+W</kbd></span>cannot be used in this web application because they are reserved by the browser for security reasons. These shortcuts always perform browser actions (opening a new window or closing the current tab) and cannot be overridden by websites..
        </div>
      </div>
      <span id="browser-note-close" style="margin-left:auto;cursor:pointer;color:#6b6b8a;font-size:1rem;padding-left:8px;line-height:1;" title="Dismiss">✕</span>
    </div>
  `;
  Object.assign(note.style, {
    position:     'fixed',
    top:           '100px',
    left:          '24px',
    transform:    'translateX(-10%)',
    background:   '#1a1a26',
    border:       '1px solid rgba(255,200,80,0.3)',
    borderLeft:   '3px solid #ffc850',
    borderRadius: '12px',
    padding:      '14px 18px',
    maxWidth:     '360px',
    width:        'calc(100% - 48px)',
    zIndex:       '9998',
    boxShadow:    '0 8px 32px rgba(0,0,0,0.5)',
    animation:    'noteFloat 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards, noteBob 3s ease-in-out 0.5s infinite',
  });

  const style = document.createElement('style');
//   style.textContent = `@keyframes noteFloat { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`;
style.textContent = `
      @keyframes noteBob {
      60%      { transform:translateX(-20px); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(note);

  document.getElementById('browser-note-close').addEventListener('click', () => note.remove());
})();
// ── STATE ──────────────────────────────────────────────────────────────────
let stats = { total: 0, shortcuts: 0, palette: 0 };
let logEntries = [];
let paletteOpen = false;
let helpOpen = false;
let paletteIndex = -1;
let paletteFiltered = [];
let isLight = false;

// ── RENDER SHORTCUTS GRID ──────────────────────────────────────────────────
function renderGrid() {
  const grid = document.getElementById('shortcuts-grid');
  grid.innerHTML = shortcuts.map(s => `
    <div class="shortcut-card" id="card-${s.id}">
      <div class="sc-icon ${s.color}">${s.icon}</div>
      <div class="sc-info">
        <div class="sc-name">${s.name}</div>
        <div class="sc-desc">${s.desc}</div>
      </div>
      <div class="sc-keys">
        ${s.keys.map((k,i) => `
          <span class="key-cap">${k}</span>
          ${i < s.keys.length - 1 ? '<span class="key-sep">+</span>' : ''}
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ── RENDER HELP ─────────────────────────────────────────────────────────────
function renderHelp() {
  const list = document.getElementById('help-list');
  list.innerHTML = shortcuts.map(s => `
    <div class="help-row">
      <span class="help-action">${s.name}</span>
      <div class="help-keys">
        ${s.keys.map((k,i) => `
          <span class="key-cap" style="font-size:0.65rem;padding:3px 8px">${k}</span>
          ${i < s.keys.length - 1 ? '<span class="key-sep">+</span>' : ''}
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ── LIVE KEY DISPLAY ───────────────────────────────────────────────────────
function showKeyDisplay(parts, action) {
  const out = document.getElementById('key-output');
  out.innerHTML = parts.map((p, i) => `
    <div class="key-chip">
      ${i > 0 ? '<span class="key-plus">+</span>' : ''}
      <span class="key-pill">${p}</span>
    </div>
  `).join('');
  document.getElementById('key-action').textContent = action ? `→ ${action}` : '';
}

// ── STATS ──────────────────────────────────────────────────────────────────
function updateStats() {
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-shortcuts').textContent = stats.shortcuts;
  document.getElementById('stat-palette').textContent = stats.palette;
}

// ── LOG ────────────────────────────────────────────────────────────────────
function addLog(text, shortcut) {
  const now = new Date();
  const time = now.toTimeString().slice(0,8);
  logEntries.unshift({ time, text, shortcut });
  if (logEntries.length > 6) logEntries.pop();

  const container = document.getElementById('log-entries');
  container.innerHTML = logEntries.map(e => `
    <div class="log-entry">
      <span class="log-time">${e.time}</span>
      <span class="log-text">${e.text}</span>
      ${e.shortcut ? `<span class="log-shortcut">${e.shortcut}</span>` : ''}
    </div>
  `).join('');
}

// ── TOAST ──────────────────────────────────────────────────────────────────
function showToast(title, msg, accent) {
  const tc = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast';
  t.style.borderLeftColor = accent || 'var(--accent)';
  t.innerHTML = `<div class="toast-title">${title}</div><div class="toast-msg">${msg}</div>`;
  tc.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 2500);
}

// ── FIRE CARD ─────────────────────────────────────────────────────────────
function fireCard(id) {
  const card = document.getElementById('card-' + id);
  if (!card) return;
  card.classList.add('fired');
  setTimeout(() => card.classList.remove('fired'), 500);
}

// ── SHORTCUT ACTIONS ──────────────────────────────────────────────────────
const actions = {
  'palette':   () => openPalette(),
  'save':      () => { showToast('Saved ✓', 'Document saved successfully.', 'var(--accent3)'); addLog('Document saved', 'Ctrl+S'); },
  'undo':      () => { showToast('Undo', 'Last action undone.', 'var(--accent2)'); addLog('Undo action', 'Ctrl+Z'); },
  'redo':      () => { showToast('Redo', 'Action redone.', 'var(--accent2)'); addLog('Redo action', 'Ctrl+Y'); },
  'find':      () => { showToast('Find', 'Search bar activated.', '#ffc850'); addLog('Find opened', 'Ctrl+F'); },
  'new':       () => { showToast('New File', 'New document created.', 'var(--accent)'); addLog('New file created', 'Ctrl+N'); },
  'close':     () => { showToast('Close Tab', 'Tab closed (simulated).', 'var(--accent)'); addLog('Tab closed', 'Ctrl+W'); },
  'bold':      () => { showToast('Bold', 'Text formatted as bold.', 'var(--accent2)'); addLog('Bold applied', 'Ctrl+B'); },
  'selectall': () => { showToast('Select All', 'All content selected.', 'var(--accent)'); addLog('Select all triggered', 'Ctrl+A'); },
  'copy':      () => { showToast('Copy', 'Content copied to clipboard.', 'var(--accent3)'); addLog('Copy triggered', 'Ctrl+C'); },
  'paste':     () => { showToast('Paste', 'Content pasted from clipboard.', 'var(--accent3)'); addLog('Paste triggered', 'Ctrl+V'); },
  'theme':     () => toggleTheme(),
  'zoom-in':   () => { showToast('Zoom In', 'Zoom increased.', 'var(--accent3)'); addLog('Zoom in', 'Ctrl++'); },
  'zoom-out':  () => { showToast('Zoom Out', 'Zoom decreased.', 'var(--accent3)'); addLog('Zoom out', 'Ctrl+-'); },
  'reload':    () => { showToast('Reload', 'Page reload simulated.', '#96b4ff'); addLog('Reload triggered', 'Ctrl+R'); },
  'help':      () => openHelp(),
  'scroll-top': () => { window.scrollTo({ top: 0, behavior: 'smooth' }); showToast('Top', 'Reached in Top page.', 'var(--accent3)'); addLog('Scrolled to top', 'Home'); },
  'scroll-bot': () => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });showToast('Bottom', 'Reached in Bottom Page.', 'var(--accent3)');addLog('Scrolled to bottom', 'End'); },
};

// ── THEME TOGGLE ──────────────────────────────────────────────────────────
function toggleTheme() {
  isLight = !isLight;
  document.documentElement.style.setProperty('--bg', isLight ? '#f4f4f8' : '#0a0a0f');
  document.documentElement.style.setProperty('--surface', isLight ? '#ffffff' : '#111118');
  document.documentElement.style.setProperty('--surface2', isLight ? '#f0f0f5' : '#1a1a26');
  document.documentElement.style.setProperty('--border', isLight ? '#d8d8e8' : '#2a2a3d');
  document.documentElement.style.setProperty('--text', isLight ? '#111118' : '#e8e8f0');
  document.documentElement.style.setProperty('--muted', isLight ? '#8888aa' : '#6b6b8a');
  document.documentElement.style.setProperty('--key-bg', isLight ? '#e8e8f0' : '#1e1e2e');
  document.documentElement.style.setProperty('--key-border', isLight ? '#c8c8d8' : '#3a3a5c');
  document.documentElement.style.setProperty('--key-shadow', isLight ? '#c0c0d0' : '#0a0a15');
  showToast('Theme', `Switched to ${isLight ? 'light' : 'dark'} mode.`, 'var(--accent3)');
  addLog(`Theme → ${isLight ? 'Light' : 'Dark'}`, 'Ctrl+i');
}

// ── COMMAND PALETTE ───────────────────────────────────────────────────────
function openPalette() {
  paletteOpen = true;
  paletteIndex = -1;
  document.getElementById('palette-overlay').classList.add('open');
  document.getElementById('palette-input').value = '';
  renderPaletteResults('');
  setTimeout(() => document.getElementById('palette-input').focus(), 50);
  stats.palette++;
  updateStats();
  addLog('Command palette opened', 'Ctrl+K');
}

function closePalette() {
  paletteOpen = false;
  document.getElementById('palette-overlay').classList.remove('open');
}

function renderPaletteResults(query) {
  const q = query.toLowerCase().trim();
  paletteFiltered = q
    ? commands.filter(c => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
    : commands;

  const el = document.getElementById('palette-results');
  if (!paletteFiltered.length) {
    el.innerHTML = `<div style="padding:24px;text-align:center;color:var(--muted);font-size:0.85rem">No commands found for "${query}"</div>`;
    return;
  }
  el.innerHTML = paletteFiltered.map((c, i) => `
    <div class="palette-item ${i === paletteIndex ? 'active' : ''}" data-i="${i}" onclick="runPaletteItem(${i})">
      <div class="palette-item-icon ${c.color}">${c.icon}</div>
      <div class="palette-item-info">
        <div class="palette-item-name">${c.name}</div>
        <div class="palette-item-desc">${c.desc}</div>
      </div>
      <div class="palette-item-shortcut">${c.keys.join('+')}</div>
    </div>
  `).join('');
}

function runPaletteItem(i) {
  const cmd = paletteFiltered[i];
  if (!cmd) return;
  closePalette();
  setTimeout(() => {
    if (actions[cmd.id]) actions[cmd.id]();
    fireCard(cmd.id);
  }, 100);
}

document.getElementById('palette-input').addEventListener('input', e => {
  paletteIndex = -1;
  renderPaletteResults(e.target.value);
});

// ── HELP PANEL ───────────────────────────────────────────────────────────
function openHelp() {
  helpOpen = true;
  document.getElementById('help-panel').classList.add('open');
  addLog('Help panel opened', '?');
}

function closeHelp() {
  helpOpen = false;
  document.getElementById('help-panel').classList.remove('open');
}

// ── KEYBOARD HANDLER ─────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  // Prevent default for our registered shortcuts (except ?/Help)
  const tag = e.target.tagName;
  const inInput = tag === 'INPUT' || tag === 'TEXTAREA';

  // Palette navigation
  if (paletteOpen) {
    if (e.key === 'Escape') { e.preventDefault(); closePalette(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      paletteIndex = Math.min(paletteIndex + 1, paletteFiltered.length - 1);
      renderPaletteResults(document.getElementById('palette-input').value);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      paletteIndex = Math.max(paletteIndex - 1, 0);
      renderPaletteResults(document.getElementById('palette-input').value);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (paletteIndex >= 0) runPaletteItem(paletteIndex);
      else if (paletteFiltered.length > 0) runPaletteItem(0);
      return;
    }
    return; // Let input handle other keys
  }

  if (helpOpen) {
    if (e.key === 'Escape' || e.key === '?') { e.preventDefault(); closeHelp(); return; }
    return;
  }

  if (inInput) return;

  stats.total++;
  updateStats();

  // Build display
  const parts = [];
  if (e.ctrlKey)  parts.push('Ctrl');
  if (e.metaKey)  parts.push('⌘');
  if (e.altKey)   parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');
  const keyLabel = e.key === ' ' ? 'Space' : e.key;
  if (!['Control','Meta','Alt','Shift'].includes(e.key)) parts.push(keyLabel);

  // Match shortcuts
  let matched = null;

  if (e.ctrlKey      && e.key.toLowerCase() === 'i') { matched = shortcuts.find(s=>s.id==='theme'); }
  else if (e.ctrlKey && e.key.toLowerCase() === 'k') { matched = shortcuts.find(s=>s.id==='palette'); }
  else if (e.ctrlKey && e.key.toLowerCase() === 's') { matched = shortcuts.find(s=>s.id==='save'); }
  else if (e.ctrlKey && e.key.toLowerCase() === 'z') { matched = shortcuts.find(s=>s.id==='undo'); }
  else if (e.ctrlKey && (e.key.toLowerCase() === 'y')) { matched = shortcuts.find(s=>s.id==='redo'); }
  else if (e.ctrlKey && e.key.toLowerCase() === 'f') { matched = shortcuts.find(s=>s.id==='find'); }
  else if (e.ctrlKey && e.key.toLowerCase() === 'n') { matched = shortcuts.find(s=>s.id==='new'); }
  else if (e.ctrlKey && e.key.toLowerCase() === 'w') { matched = shortcuts.find(s=>s.id==='close'); }
  else if (e.ctrlKey && e.key.toLowerCase() === 'b') { matched = shortcuts.find(s=>s.id==='bold'); }
  else if (e.ctrlKey && e.key.toLowerCase() === 'a') { matched = shortcuts.find(s=>s.id==='selectall'); }
  else if (e.ctrlKey && e.key.toLowerCase() === 'c') { matched = shortcuts.find(s=>s.id==='copy'); }
  else if (e.ctrlKey && e.key.toLowerCase() === 'v') { matched = shortcuts.find(s=>s.id==='paste'); }
  else if (e.ctrlKey && (e.key === '+' || e.key === '=')) { matched = shortcuts.find(s=>s.id==='zoom-in'); }
  else if (e.ctrlKey && e.key === '-') { matched = shortcuts.find(s=>s.id==='zoom-out'); }
  else if (e.ctrlKey && e.key.toLowerCase() === 'r') { matched = shortcuts.find(s=>s.id==='reload'); }
  else if (e.key === '?') { matched = shortcuts.find(s=>s.id==='help'); }
  else if (e.key === 'Home') { matched = commands.find(s=>s.id==='scroll-top'); }
  else if (e.key === 'End') { matched = commands.find(s=>s.id==='scroll-bot'); }

  if (matched) {
    e.preventDefault();
    showKeyDisplay(parts, matched.name);
    fireCard(matched.id);
    stats.shortcuts++;
    updateStats();
    if (actions[matched.id]) actions[matched.id]();
  } else {
    showKeyDisplay(parts, null);
    addLog(`Key pressed: ${parts.join('+')}`, null);
  }
});

// ── INIT ──────────────────────────────────────────────────────────────────
renderGrid();
renderHelp();

// Welcome toast
setTimeout(() => {
  showToast('Welcome to KeyForge ⌨', 'Press Ctrl+K to open the command palette or ? for help.', 'var(--accent)');
}, 600);