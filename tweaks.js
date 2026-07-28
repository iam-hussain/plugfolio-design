/* ═══════════════════════════════════════════════════════════
   Plugfolio — Tweaks controller (prototype chrome only).

   Switches header treatment, content state, appearance and
   palette live. Choices persist in localStorage.

   This is a review tool. It ships with the prototype, never with
   the product — nothing in here belongs in the app.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var STATES = [
    { id: 'full',           name: 'Populated',        note: '12 posts, 6 categories, 3 comments. The everyday case.' },
    { id: 'no-posts',       name: 'No posts yet',     note: 'A brand-new profile. The first thing a creator sees.' },
    { id: 'empty-category', name: 'Empty category',   note: 'Filtered to “Under ₹1,000” with nothing in it.' },
    { id: 'no-categories',  name: 'No categories',    note: 'Creator defined none — the chip row vanishes entirely.' },
    { id: 'no-comments',    name: 'No comments',      note: 'Empty thread plus the signed-out claim band.' }
  ];

  /* The post page has no header treatments and its own two states. */
  var POST_STATES = [
    { id: 'full',  name: 'Products tagged', note: 'Five products — every kind and coupon variant.' },
    { id: 'empty', name: 'Nothing tagged',  note: 'Reachable: untagged posts still show in the grid.' }
  ];

  var FONTS = [
    { id: 'sora', name: 'Sora + Manrope', note: 'The committed pairing.',
      display: 'Sora, system-ui, sans-serif', body: 'Manrope, system-ui, sans-serif',
      google: 'family=Sora:wght@600;700;800&family=Manrope:wght@400;500;600;700;800' },
    { id: 'bricolage', name: 'Bricolage + Manrope', note: 'More voice in the name; warmer.',
      display: '"Bricolage Grotesque", system-ui, sans-serif', body: 'Manrope, system-ui, sans-serif',
      google: 'family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Manrope:wght@400;500;600;700;800' },
    { id: 'archivo', name: 'Archivo', note: 'One family throughout — the Operate default.',
      display: 'Archivo, system-ui, sans-serif', body: 'Archivo, system-ui, sans-serif',
      google: 'family=Archivo:wght@400;500;600;700;800;900' },
    { id: 'poppins', name: 'Poppins + Manrope', note: 'Rounder and friendlier.',
      display: 'Poppins, system-ui, sans-serif', body: 'Manrope, system-ui, sans-serif',
      google: 'family=Poppins:wght@600;700;800&family=Manrope:wght@400;500;600;700;800' }
  ];

  var PALETTES = [
    { id: 'violet', name: 'Charged Violet', swatch: ['#7C3AED', '#C6FF3D', '#FFD84D'], note: 'The brand palette.',
      light: {},
      dark: { '--violet': '#8B5CF6', '--violet-deep': '#C4B5FD', '--violet-wash': '#2A2440',
              '--tile-1': '#6B5320', '--tile-2': '#1B5A42', '--tile-3': '#1B3E63', '--tile-4': '#463175', '--tile-5': '#5C2A44' } },
    { id: 'indigo', name: 'Deep Indigo', swatch: ['#4F46E5', '#C6FF3D', '#A9D8FF'], note: 'Cooler, more institutional.',
      light: { '--violet': '#4F46E5', '--violet-deep': '#3730A3', '--violet-wash': '#EAE9FD',
               '--tile-1': '#C7D2FE', '--tile-2': '#BAE6FD', '--tile-3': '#DDD6FE', '--tile-4': '#A5F3FC', '--tile-5': '#E0E7FF' },
      dark: { '--violet': '#7C74F2', '--violet-deep': '#C7C3FB', '--violet-wash': '#232145',
              '--tile-1': '#2E3480', '--tile-2': '#17496E', '--tile-3': '#2C1F5E', '--tile-4': '#144F5E', '--tile-5': '#242C6B' } },
    { id: 'coral', name: 'Coral Heat', swatch: ['#E8482F', '#FFD84D', '#FF8A73'], note: 'Warmest, most retail.',
      light: { '--violet': '#E8482F', '--violet-deep': '#B4301C', '--violet-wash': '#FDEAE6', '--lime': '#FFD84D',
               '--tile-1': '#FFD8A8', '--tile-2': '#FFC9BC', '--tile-3': '#FFE3A3', '--tile-4': '#FFB4A2', '--tile-5': '#FFD9CE' },
      dark: { '--violet': '#FF7A63', '--violet-deep': '#FFB9A6', '--violet-wash': '#3A1A14', '--lime': '#FFD84D',
              '--tile-1': '#5A340F', '--tile-2': '#3E1410', '--tile-3': '#6A4412', '--tile-4': '#4A1A14', '--tile-5': '#33200F' } },
    { id: 'forest', name: 'Deep Forest', swatch: ['#0E7C5A', '#C6FF3D', '#96E6BC'], note: 'Calm; leans wellness.',
      light: { '--violet': '#0E7C5A', '--violet-deep': '#0A5741', '--violet-wash': '#E2F3EC',
               '--tile-1': '#BBF7D0', '--tile-2': '#D9F99D', '--tile-3': '#A7F3D0', '--tile-4': '#CCFBF1', '--tile-5': '#E7F5C9' },
      dark: { '--violet': '#2FB287', '--violet-deep': '#96E6BC', '--violet-wash': '#102E24',
              '--tile-1': '#0F3524', '--tile-2': '#2E4A10', '--tile-3': '#0A2A20', '--tile-4': '#134A3C', '--tile-5': '#3A5417' } },
    { id: 'magenta', name: 'Hot Magenta', swatch: ['#D6248C', '#FFD84D', '#FFC9DE'], note: 'Loudest; beauty and fashion.',
      light: { '--violet': '#D6248C', '--violet-deep': '#9E1266', '--violet-wash': '#FCE7F3', '--lime': '#FFD84D',
               '--tile-1': '#FBCFE8', '--tile-2': '#FDE68A', '--tile-3': '#F5D0FE', '--tile-4': '#FECDD3', '--tile-5': '#FBD5E8' },
      dark: { '--violet': '#F45CAE', '--violet-deep': '#FBB6DA', '--violet-wash': '#3A1230', '--lime': '#FFD84D',
              '--tile-1': '#4E1441', '--tile-2': '#6E5518', '--tile-3': '#33103C', '--tile-4': '#7A2740', '--tile-5': '#4A1B3B' } }
  ];

  var DARK = {
    '--canvas': '#14121C', '--surface': '#231F33',
    '--ink': '#F5F3FA', '--ink-2': '#C2BBD1', '--ink-3': '#9A93A9',
    '--line': '#39334E', '--shadow-ink': '0 0 0',
    '--card-edge': 'rgb(245 243 250 / .11)',
    '--on-tile': '#F5F3FA',
    '--on-tile-dim': 'rgb(245 243 250 / .74)',
    '--on-tile-line': 'rgb(245 243 250 / .20)'
  };
  /* Light must be asserted, not merely un-asserted: styles.css carries a
     prefers-color-scheme block, so removing inline overrides hands control
     back to the OS rather than to the panel. */
  var LIGHT = {
    '--canvas': '#FCFBFE', '--surface': '#FFFFFF',
    '--ink': '#12101C', '--ink-2': '#56506A', '--ink-3': '#8B8499',
    '--line': '#E9E4F0', '--shadow-ink': '18 16 28',
    '--card-edge': 'transparent',
    '--on-tile': '#12101C',
    '--on-tile-dim': 'rgb(18 16 28 / .72)',
    '--on-tile-line': 'rgb(18 16 28 / .16)',
    '--tile-1': '#FFD84D', '--tile-2': '#96E6BC', '--tile-3': '#A9D8FF',
    '--tile-4': '#C9B6FF', '--tile-5': '#FFC9DE',
    '--violet': '#7C3AED', '--violet-deep': '#5B21B6', '--violet-wash': '#EFEAFB',
    '--lime': '#C6FF3D'
  };

  var MODES = [
    { id: 'light', name: 'Light', note: 'Cool near-white canvas. The committed default.' },
    { id: 'dark',  name: 'Dark',  note: 'Dark canvas; tag pills stay white.' }
  ];

  var THEME_KEYS = ['--canvas','--surface','--ink','--ink-2','--ink-3','--violet','--violet-deep',
    '--violet-wash','--lime','--line','--shadow-ink','--card-edge',
    '--tile-1','--tile-2','--tile-3','--tile-4','--tile-5',
    '--on-tile','--on-tile-dim','--on-tile-line'];

  var VIEWERS = [
    { id: 'anon',     name: 'Anonymous shopper', note: 'No account — the default arrival' },
    { id: 'shopper',  name: 'Signed-in shopper', note: 'Follows and comments for real' },
    { id: 'business', name: 'Business',          note: 'Signed in, owns a brand — can request a collab' },
    { id: 'owner',    name: 'Creator (owner)',   note: 'Their own page — tools, not Follow' }
  ];

  var KEY = 'plugfolio-tweaks';
  var state = { viewer: 'anon', view: 'full', font: 'sora', theme: 'violet', mode: 'light' };
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  var PAGE = document.body.getAttribute('data-page') || 'creator';
  /* Each page keeps its own content state — the creator page's
     "no comments" must not follow you onto the post page and back. */
  var VIEWKEY = 'view';
  if (PAGE === 'post') { STATES = POST_STATES; VIEWKEY = 'viewPost'; if (!state.viewPost) state.viewPost = 'full'; }

  var loaded = {};
  function applyFont(id) {
    var f = FONTS.filter(function (x) { return x.id === id; })[0] || FONTS[0];
    if (f.id !== 'sora' && !loaded[f.id]) {
      loaded[f.id] = true;
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?' + f.google + '&display=swap';
      document.head.appendChild(l);
    }
    var r = document.documentElement;
    r.style.setProperty('--font-display', f.display);
    r.style.setProperty('--font-body', f.body);
  }
  function applyTheme() {
    var t = PALETTES.filter(function (x) { return x.id === state.theme; })[0] || PALETTES[0];
    var dark = state.mode === 'dark', r = document.documentElement;
    THEME_KEYS.forEach(function (k) { r.style.removeProperty(k); });
    var basis = dark ? DARK : LIGHT;
    Object.keys(basis).forEach(function (k) { r.style.setProperty(k, basis[k]); });
    var v = dark ? t.dark : t.light;
    Object.keys(v).forEach(function (k) { r.style.setProperty(k, v[k]); });
    r.style.setProperty('color-scheme', dark ? 'dark' : 'light');
  }
  function applyPage() {
    document.body.dataset.state = state[VIEWKEY];
    document.body.dataset.viewer = state.viewer;
  }
  function apply() { applyTheme(); applyFont(state.font); applyPage(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
  applyTheme(); applyFont(state.font);

  /* ── panel ─────────────────────────────────────────────── */
  var css = document.createElement('style');
  css.textContent = [
    '.ch-name,.sec-h,.mark-name,.empty b{font-family:var(--font-display,Sora,system-ui,sans-serif)!important}',
    'body{font-family:var(--font-body,Manrope,system-ui,sans-serif)!important}',
    '#tw-open{position:fixed;right:18px;bottom:18px;z-index:9999;border:0;cursor:pointer;',
      'background:#12101C;color:#fff;border-radius:999px;padding:13px 20px;font:700 13px/1 Manrope,system-ui,sans-serif;',
      'box-shadow:0 10px 30px -8px rgba(0,0,0,.45);display:inline-flex;align-items:center;gap:9px}',
    '#tw-open:hover{background:#7C3AED}',
    '#tw-open i{width:8px;height:8px;border-radius:50%;background:#C6FF3D;display:block}',
    '#tw{position:fixed;right:18px;bottom:18px;z-index:10000;width:min(340px,calc(100vw - 36px));',
      'max-height:min(82vh,760px);overflow-y:auto;background:#fff;color:#12101C;border-radius:22px;',
      'box-shadow:0 30px 70px -20px rgba(0,0,0,.5);padding:18px;display:none;font-family:Manrope,system-ui,sans-serif}',
    '#tw[data-open="1"]{display:block}',
    '#tw h4{margin:16px 0 10px;font:700 11px/1 Manrope,system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#8B8499}',
    '#tw h4:first-of-type{margin-top:0}',
    '#tw .row{display:flex;align-items:center;justify-content:space-between;margin:-4px 0 14px}',
    '#tw .row b{font:800 15px/1 Manrope,system-ui,sans-serif}',
    '#tw .x{border:0;background:#F2F0F7;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:15px;color:#56506A}',
    '#tw .x:hover{background:#E9E4F0}',
    '#tw .opt{display:flex;align-items:center;gap:2px;width:100%;text-align:left;border:1px solid #E9E4F0;background:#fff;color:#12101C;',
      'border-radius:14px;padding:10px 12px;margin-bottom:7px;cursor:pointer;font-family:inherit}',
    '#tw .opt:hover{border-color:#7C3AED}',
    '#tw .opt[aria-pressed="true"]{border-color:#12101C;background:#FCFBFE;box-shadow:inset 0 0 0 1px #12101C}',
    '#tw .opt s{display:block;font:700 13px/1.3 Manrope,system-ui,sans-serif;text-decoration:none}',
    '#tw .opt em{display:block;font:500 11px/1.4 Manrope,system-ui,sans-serif;color:#8B8499;font-style:normal;margin-top:2px}',
    '#tw .sw{display:inline-flex;gap:3px;margin-right:9px}',
    '#tw .sw i{width:13px;height:13px;border-radius:4px;display:block}',
    '#tw .note{font:500 11px/1.5 Manrope,system-ui,sans-serif;color:#8B8499;margin:14px 0 0}'
  ].join('');
  document.head.appendChild(css);

  function opt(pressed, label, note, swatch) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'opt';
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    b.innerHTML = (swatch ? '<span class="sw">' + swatch.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span>' : '')
      + '<span><s>' + label + '</s><em>' + note + '</em></span>';
    return b;
  }
  function section(title, items, key, onPick, swatchOf) {
    var s = document.createElement('section');
    s.innerHTML = '<h4>' + title + '</h4>';
    items.forEach(function (it) {
      var b = opt(state[key] === it.id, it.name, it.note, swatchOf ? swatchOf(it) : null);
      b.addEventListener('click', function () {
        state[key] = it.id; save(); onPick();
        Array.prototype.forEach.call(s.querySelectorAll('.opt'), function (o) { o.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
      });
      s.appendChild(b);
    });
    return s;
  }

  var panel = document.createElement('div');
  panel.id = 'tw'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Prototype tweaks');
  var head = document.createElement('div');
  head.className = 'row'; head.innerHTML = '<b>Tweaks</b>';
  var close = document.createElement('button');
  close.className = 'x'; close.type = 'button'; close.setAttribute('aria-label', 'Close tweaks'); close.textContent = '✕';
  head.appendChild(close); panel.appendChild(head);

  panel.appendChild(section('Who is looking', VIEWERS, 'viewer', applyPage));
  panel.appendChild(section('Content state', STATES, VIEWKEY, applyPage));
  panel.appendChild(section('Appearance', MODES, 'mode', applyTheme));
  panel.appendChild(section('Palette', PALETTES, 'theme', applyTheme, function (t) { return t.swatch; }));
  panel.appendChild(section('Type pairing', FONTS, 'font', function () { applyFont(state.font); }));

  var foot = document.createElement('p');
  foot.className = 'note';
  foot.textContent = 'Review tool only — not part of the product.';
  panel.appendChild(foot);

  var open = document.createElement('button');
  open.id = 'tw-open'; open.type = 'button'; open.setAttribute('aria-expanded', 'false');
  open.innerHTML = '<i></i> Tweaks';
  function setOpen(v) {
    panel.setAttribute('data-open', v ? '1' : '0');
    open.style.display = v ? 'none' : 'inline-flex';
    open.setAttribute('aria-expanded', v ? 'true' : 'false');
    if (v) close.focus(); else open.focus();
  }
  open.addEventListener('click', function () { setOpen(true); });
  close.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.getAttribute('data-open') === '1') setOpen(false);
  });

  function mount() { document.body.appendChild(open); document.body.appendChild(panel); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
