/* ═══════════════════════════════════════════════════════════
   Plugfolio — prototype state panel (review chrome only).

   Replaces the old `.vbar` top rail, which set its background to
   var(--ink). In dark that token inverts to near-white while the
   bar's links stayed white-at-62% — a white-on-white bar with
   unreadable text. This panel hardcodes its own light colours and
   never reads a design token, so it stays legible in every
   appearance and can't be broken by a palette change.

   Declarative: a page sets window.PROTO before loading this file.

     window.PROTO = {
       title: 'auth',
       groups: [{
         label: 'Screen',
         options: [{ name: 'Join', note: 'Register', set: { screen: 'join' } }]
       }]
     };

   Each option's `set` is a map of body dataset keys. An option reads
   as active when every key in its `set` matches the body. That is
   what lets one option carry two keys at once (a screen AND an error
   state) without a second control.

   Ships with the prototype, never with the product.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var cfg = window.PROTO;
  if (!cfg) return;

  var body = document.body;

  /* Appearance override. styles.css drives dark from a media query;
     [data-appearance] on <html> lets a reviewer pin either one. */
  var APPEARANCE = [
    { name: 'Auto',  note: 'Follow the operating system', val: 'auto'  },
    { name: 'Light', note: 'Force the light appearance',  val: 'light' },
    { name: 'Dark',  note: 'Force the dark appearance',   val: 'dark'  }
  ];

  var css = document.createElement('style');
  css.textContent = [
    '#pp-open{position:fixed;right:18px;bottom:18px;z-index:9999;border:0;cursor:pointer;',
      'background:#12101C;color:#fff;border-radius:999px;padding:13px 20px;',
      'font:700 13px/1 Manrope,system-ui,sans-serif;min-height:44px;',
      'box-shadow:0 10px 30px -8px rgba(0,0,0,.45);display:inline-flex;align-items:center;gap:9px}',
    '#pp-open:hover{background:#7C3AED}',
    '#pp-open i{width:8px;height:8px;border-radius:50%;background:#C6FF3D;display:block}',
    '#pp{position:fixed;right:18px;bottom:18px;z-index:10000;width:min(340px,calc(100vw - 36px));',
      'max-height:min(82vh,760px);overflow-y:auto;background:#fff;color:#12101C;border-radius:22px;',
      'box-shadow:0 30px 70px -20px rgba(0,0,0,.5);padding:18px;display:none;',
      'font-family:Manrope,system-ui,sans-serif}',
    '#pp[data-open="1"]{display:block}',
    '#pp h4{margin:16px 0 10px;font:700 11px/1 Manrope,system-ui,sans-serif;letter-spacing:.1em;',
      'text-transform:uppercase;color:#8B8499}',
    '#pp h4:first-of-type{margin-top:0}',
    '#pp .row{display:flex;align-items:center;justify-content:space-between;margin:-4px 0 14px}',
    '#pp .row b{font:800 15px/1 Manrope,system-ui,sans-serif}',
    '#pp .x{border:0;background:#F2F0F7;width:34px;height:34px;border-radius:50%;cursor:pointer;',
      'font-size:15px;color:#56506A}',
    '#pp .x:hover{background:#E9E4F0}',
    '#pp .opt{display:block;width:100%;text-align:left;border:1px solid #E9E4F0;background:#fff;',
      'color:#12101C;border-radius:14px;padding:10px 12px;margin-bottom:7px;cursor:pointer;',
      'font-family:inherit;min-height:44px}',
    '#pp .opt:hover{border-color:#7C3AED}',
    '#pp .opt[aria-pressed="true"]{border-color:#12101C;background:#FCFBFE;box-shadow:inset 0 0 0 1px #12101C}',
    '#pp .opt s{display:block;font:700 13px/1.3 Manrope,system-ui,sans-serif;text-decoration:none}',
    '#pp .opt em{display:block;font:500 11px/1.4 Manrope,system-ui,sans-serif;color:#8B8499;',
      'font-style:normal;margin-top:2px}',
    '#pp .note{font:500 11px/1.5 Manrope,system-ui,sans-serif;color:#8B8499;margin:14px 0 0}'
  ].join('');
  document.head.appendChild(css);

  var panel = document.createElement('div');
  panel.id = 'pp';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Prototype states');

  var head = document.createElement('div');
  head.className = 'row';
  head.innerHTML = '<b>' + cfg.title + '</b>';
  var close = document.createElement('button');
  close.className = 'x'; close.type = 'button';
  close.setAttribute('aria-label', 'Close panel');
  close.textContent = '✕';
  head.appendChild(close);
  panel.appendChild(head);

  var allOptions = [];

  function matches(set) {
    for (var k in set) { if (body.dataset[k] !== set[k]) return false; }
    return true;
  }
  function refresh() {
    allOptions.forEach(function (o) {
      o.el.setAttribute('aria-pressed', String(o.test()));
    });
  }
  function option(label, note, test, onPick) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'opt';
    b.innerHTML = '<s></s><em></em>';
    b.querySelector('s').textContent = label;
    b.querySelector('em').textContent = note || '';
    b.addEventListener('click', function () { onPick(); refresh(); });
    allOptions.push({ el: b, test: test });
    return b;
  }

  (cfg.groups || []).forEach(function (g) {
    var sec = document.createElement('section');
    var h = document.createElement('h4');
    h.textContent = g.label;
    sec.appendChild(h);
    g.options.forEach(function (it) {
      sec.appendChild(option(it.name, it.note,
        function () { return matches(it.set); },
        function () { for (var k in it.set) { body.dataset[k] = it.set[k]; } }));
    });
    panel.appendChild(sec);
  });

  /* Appearance last — it applies to every page, not just this one. */
  var appSec = document.createElement('section');
  var appH = document.createElement('h4');
  appH.textContent = 'Appearance';
  appSec.appendChild(appH);
  APPEARANCE.forEach(function (a) {
    appSec.appendChild(option(a.name, a.note,
      function () { return (document.documentElement.dataset.appearance || 'auto') === a.val; },
      function () {
        if (a.val === 'auto') delete document.documentElement.dataset.appearance;
        else document.documentElement.dataset.appearance = a.val;
      }));
  });
  panel.appendChild(appSec);

  var foot = document.createElement('p');
  foot.className = 'note';
  foot.textContent = 'Review tool only — not part of the product.';
  panel.appendChild(foot);

  var open = document.createElement('button');
  open.id = 'pp-open'; open.type = 'button';
  open.setAttribute('aria-expanded', 'false');
  open.innerHTML = '<i></i> ' + cfg.title;

  function setOpen(v) {
    panel.setAttribute('data-open', v ? '1' : '0');
    open.style.display = v ? 'none' : 'inline-flex';
    open.setAttribute('aria-expanded', v ? 'true' : 'false');
    if (v) { refresh(); close.focus(); } else { open.focus(); }
  }
  open.addEventListener('click', function () { setOpen(true); });
  close.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.getAttribute('data-open') === '1') setOpen(false);
  });

  document.body.appendChild(open);
  document.body.appendChild(panel);
  refresh();
})();
