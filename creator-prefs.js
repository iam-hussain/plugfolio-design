/* ═══════════════════════════════════════════════════════════════════
   Creator page preferences — a PRODUCT feature, not review chrome.

   What the creator sets on their own page (§5.23 lives in Settings; this
   is the subset worth editing in place, where they can see the result):
   layout, header treatment, accent, greeting, bio, which socials show,
   and the profile photo.

   The same choices are read by every creator-owned surface — the profile,
   the post view, and the product page when it lands — so a creator sets
   their look once and it follows their content. That is why this is a
   shared file and not a block inside creator.html.

   Persisted to localStorage here; in the product these are profile
   columns written through Settings' save endpoint.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  var KEY = 'plugfolio-creator';

  var DEFAULTS = {
    header: 'balanced',
    layout: 'grid',
    accent: '#7C3AED',
    greeting: 'Hey — glad you found me.',
    bio: 'Everyday things that actually work — desk, gym, skin, home. Everything in my posts is tagged, so you can just tap it.',
    avatar: '',
    socials: { instagram: true, youtube: true, tiktok: true, site: true }
  };

  /* Contrast against white label text, measured: violet 5.70, indigo 7.90,
     coral 5.09, forest 6.50, magenta 6.28. A creator cannot pick a colour
     that makes their own Buy button fail AA. */
  var ACCENTS = [
    { id: '#7C3AED', name: 'Violet' },
    { id: '#4338CA', name: 'Indigo' },
    { id: '#CC3626', name: 'Coral' },
    { id: '#146B4A', name: 'Forest' },
    { id: '#B31D74', name: 'Magenta' }
  ];

  var HEADERS = [
    { id: 'minimal',  name: 'Compact',  note: 'Goods first. Bio and socials stand down.' },
    { id: 'balanced', name: 'Balanced', note: 'Identity, then shelves, then posts.' },
    { id: 'identity', name: 'Centred',  note: 'Big avatar, centred. Reads as a profile.' }
  ];

  var LAYOUTS = [
    { id: 'grid', name: 'Grid',  note: 'Tight photo grid. Most posts on screen.' },
    { id: 'card', name: 'Cards', note: 'Roomier, with the post title under each.' },
    { id: 'list', name: 'List',  note: 'One per row. Easiest to scan on a phone.' }
  ];

  var SOCIALS = [
    { id: 'instagram', name: 'Instagram' },
    { id: 'youtube',   name: 'YouTube' },
    { id: 'tiktok',    name: 'TikTok' },
    { id: 'site',      name: 'Website' }
  ];

  var p = Object.assign({}, DEFAULTS);
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    Object.assign(p, saved);
    p.socials = Object.assign({}, DEFAULTS.socials, saved.socials || {});
  } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }

  /* ── Apply. Runs on every page that includes this file. ────────── */
  function apply() {
    var b = document.body;
    if (b.getAttribute('data-page') !== 'post') b.dataset.header = p.header;
    b.dataset.layout = p.layout;
    document.documentElement.style.setProperty('--accent', p.accent);

    var greet = document.getElementById('greet');
    if (greet) {
      greet.textContent = p.greeting;
      greet.hidden = !p.greeting.trim();   /* an empty greeting leaves no gap */
    }
    var bio = document.querySelector('.ch-bio');
    if (bio) { bio.textContent = p.bio; bio.hidden = !p.bio.trim(); }

    SOCIALS.forEach(function (s) {
      document.querySelectorAll('[data-social="' + s.id + '"]').forEach(function (el) {
        el.hidden = !p.socials[s.id];
      });
    });
    if (p.avatar) {
      document.querySelectorAll('.ch-av, .pc-av, .ctx-av').forEach(function (img) { img.src = p.avatar; });
    }
  }
  apply();

  /* ── The customiser. Only the owner, only where a mount exists. ── */
  var mount = document.getElementById('customise');
  if (!mount) return;

  function seg(label, items, get, set) {
    var wrap = document.createElement('div');
    wrap.className = 'cz-row';
    wrap.innerHTML = '<span class="cz-lab">' + label + '</span>';
    var row = document.createElement('div');
    row.className = 'cz-seg';
    items.forEach(function (it) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'cz-opt';
      b.setAttribute('aria-pressed', get() === it.id ? 'true' : 'false');
      b.innerHTML = '<s>' + it.name + '</s>' + (it.note ? '<em>' + it.note + '</em>' : '');
      b.addEventListener('click', function () {
        set(it.id); save(); apply();
        row.querySelectorAll('.cz-opt').forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
      });
      row.appendChild(b);
    });
    wrap.appendChild(row);
    return wrap;
  }

  function field(label, value, placeholder, multiline, set) {
    var wrap = document.createElement('div');
    wrap.className = 'cz-row';
    var id = 'cz-' + label.toLowerCase().replace(/\W+/g, '-');
    wrap.innerHTML = '<label class="cz-lab" for="' + id + '">' + label + '</label>';
    var el = document.createElement(multiline ? 'textarea' : 'input');
    el.id = id; el.className = 'cz-input'; el.value = value; el.placeholder = placeholder;
    if (!multiline) el.type = 'text';
    /* Live: the page is the preview, so there is no Save button to miss. */
    el.addEventListener('input', function () { set(el.value); save(); apply(); });
    wrap.appendChild(el);
    return wrap;
  }

  var panel = document.createElement('div');
  panel.className = 'cz v-owner'; panel.id = 'czPanel'; panel.hidden = true;
  panel.innerHTML = '<p class="cz-note">Changes save as you type and show on your post and product pages too. ' +
    'Everything else — username, connections, managers — stays in <a href="/dashboard/settings">Settings</a>.</p>';

  panel.appendChild(field('Greeting', p.greeting, 'Hi, I\'m Maya — here\'s what I actually use.', false,
    function (v) { p.greeting = v; }));
  panel.appendChild(field('About you', p.bio, 'What you post, and why someone should tap it.', true,
    function (v) { p.bio = v; }));
  panel.appendChild(seg('Header', HEADERS, function () { return p.header; }, function (v) { p.header = v; }));
  panel.appendChild(seg('Post layout', LAYOUTS, function () { return p.layout; }, function (v) { p.layout = v; }));

  /* Accent */
  var acc = document.createElement('div');
  acc.className = 'cz-row';
  acc.innerHTML = '<span class="cz-lab">Your colour</span>';
  var accRow = document.createElement('div');
  accRow.className = 'cz-sw';
  ACCENTS.forEach(function (a) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'cz-chip'; b.style.background = a.id;
    b.setAttribute('aria-label', a.name);
    b.setAttribute('aria-pressed', p.accent === a.id ? 'true' : 'false');
    b.addEventListener('click', function () {
      p.accent = a.id; save(); apply();
      accRow.querySelectorAll('.cz-chip').forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
    });
    accRow.appendChild(b);
  });
  acc.appendChild(accRow); panel.appendChild(acc);

  /* Socials — removing one hides the link, it never deletes the connection. */
  var soc = document.createElement('div');
  soc.className = 'cz-row';
  soc.innerHTML = '<span class="cz-lab">Show links</span>';
  var socRow = document.createElement('div');
  socRow.className = 'cz-seg';
  SOCIALS.forEach(function (s) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'cz-opt cz-opt--tog';
    b.setAttribute('aria-pressed', p.socials[s.id] ? 'true' : 'false');
    b.innerHTML = '<s>' + s.name + '</s>';
    b.addEventListener('click', function () {
      p.socials[s.id] = !p.socials[s.id]; save(); apply();
      b.setAttribute('aria-pressed', p.socials[s.id] ? 'true' : 'false');
    });
    socRow.appendChild(b);
  });
  soc.appendChild(socRow); panel.appendChild(soc);

  /* Profile photo — the one Settings field a Manager may also change (§4). */
  var pic = document.createElement('div');
  pic.className = 'cz-row';
  pic.innerHTML = '<span class="cz-lab">Profile photo</span>';
  var picRow = document.createElement('div');
  picRow.className = 'cz-seg';
  var file = document.createElement('input');
  file.type = 'file'; file.accept = 'image/*'; file.id = 'czPic'; file.className = 'cz-file';
  var lab = document.createElement('label');
  lab.className = 'btn btn--ghost'; lab.setAttribute('for', 'czPic'); lab.textContent = 'Change photo';
  var reset = document.createElement('button');
  reset.type = 'button'; reset.className = 'cz-link'; reset.textContent = 'Reset';
  reset.addEventListener('click', function () {
    p.avatar = ''; save();
    document.querySelectorAll('.ch-av, .pc-av, .ctx-av').forEach(function (i) { i.src = 'images/avatars/maya.jpg'; });
  });
  file.addEventListener('change', function () {
    var f = file.files && file.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function () { p.avatar = r.result; save(); apply(); };
    r.readAsDataURL(f);
  });
  picRow.appendChild(file); picRow.appendChild(lab); picRow.appendChild(reset);
  pic.appendChild(picRow); panel.appendChild(pic);

  var band = mount.closest('.band-v') || mount;
  band.parentNode.insertBefore(panel, band.nextSibling);

  /* ── Two presentations, one panel ──────────────────────────────────
     On a phone the controls arrive as a dragged sheet; on a desktop they
     open inline under the band. The SAME node moves between the two, so
     a value edited in one can never disagree with the other. */
  var sheet = document.getElementById('czSheet');
  var sheetBody = document.getElementById('czBody');
  var home = panel.parentNode, anchor = panel.nextSibling;
  var phone = window.matchMedia('(max-width: 780px)');

  function label(open) {
    mount.setAttribute('aria-expanded', open ? 'true' : 'false');
    mount.textContent = open ? 'Done customising' : 'Customise page';
  }

  /* Idempotent: safe to call on close, on Escape, and on a breakpoint
     change — whichever happens first, the panel ends up back in the page. */
  function restore() {
    if (panel.parentNode !== home) home.insertBefore(panel, anchor);
    panel.hidden = true;
    if (sheet) { sheet.style.transform = ''; sheet.style.transition = ''; }
    label(false);
  }

  function closeSheet() { if (sheet.open) sheet.close(); restore(); }

  mount.addEventListener('click', function () {
    if (phone.matches && sheet) {
      if (sheet.open) { closeSheet(); return; }
      panel.hidden = false;
      sheetBody.appendChild(panel);
      sheet.showModal();
      label(true);
    } else {
      /* Self-heal: if a close was ever missed the panel is still parked
         inside a dialog that no longer opens at this width, so pull it
         back before deciding what the toggle means. */
      if (panel.parentNode !== home) { restore(); }
      panel.hidden = !panel.hidden;
      label(!panel.hidden);
    }
  });

  if (sheet) {
    document.getElementById('czClose').addEventListener('click', closeSheet);
    sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
    sheet.addEventListener('close', restore);
    sheet.addEventListener('cancel', function () { setTimeout(restore, 0); });
    /* Escape is handled natively by <dialog>, but the panel lives outside
       it — one missed close event would strand the controls in a closed
       dialog, so the key is handled here too. restore() is idempotent. */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.parentNode === sheetBody) closeSheet();
    });
    /* Rotating a phone or resizing must not strand the panel inside a
       dialog that no longer opens at this width. */
    phone.addEventListener('change', function () { if (sheet.open) closeSheet(); else restore(); });

    var grab = document.getElementById('czGrab'), y0 = null;
    grab.addEventListener('pointerdown', function (e) { y0 = e.clientY; grab.setPointerCapture(e.pointerId); });
    grab.addEventListener('pointermove', function (e) {
      if (y0 === null) return;
      sheet.style.transition = 'none';
      sheet.style.transform = 'translateY(' + Math.max(0, e.clientY - y0) + 'px)';
    });
    function release(e) {
      if (y0 === null) return;
      var dy = Math.max(0, e.clientY - y0); y0 = null;
      sheet.style.transition = 'transform .26s cubic-bezier(.2,.9,.25,1)';
      if (dy > 120) { sheet.style.transform = 'translateY(100%)'; setTimeout(closeSheet, 220); }
      else { sheet.style.transform = ''; }
    }
    grab.addEventListener('pointerup', release);
    grab.addEventListener('pointercancel', release);
  }
})();
