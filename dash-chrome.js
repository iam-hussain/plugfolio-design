/* ═══════════════════════════════════════════════════════════
   Plugfolio — the creator dashboard shell, rendered once (§5.17).

   "Screens never invent their own header" is only true if there is one
   header. Post editing and product editing now have their own pages, and
   three hand-written copies of a mark + profile switcher + tab row is
   exactly how a shell stops being one thing.

   A page opts in with a placeholder and a config:

     <div data-dash="shell"></div>
     <script>window.DASH = { tab: 'posts', profile: '@mayamoves' };</script>
     <script src="dash-chrome.js" defer></script>

   `tab` lights a section. Detail routes pass their PARENT tab — the post
   editor is a Posts detail route, not a seventh section, and a shell that
   lights nothing there reads as having lost its place.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var cfg = window.DASH || {};
  var slot = document.querySelector('[data-dash="shell"]');
  if (!slot) return;

  var handle = cfg.profile || '@mayamoves';

  var MARK =
    '<svg class="mark-glyph" viewBox="0 0 100 100" aria-hidden="true"><g stroke-linejoin="round">' +
    '<polygon points="33,53 33,27 39.5,15 46,27 46,53" fill="currentColor" stroke="currentColor" stroke-width="3"/>' +
    '<polygon points="54,53 54,27 60.5,15 67,27 67,53" fill="currentColor" stroke="currentColor" stroke-width="3"/>' +
    '<rect x="18" y="43" width="64" height="44" rx="13" fill="#7C3AED" stroke="#7C3AED" stroke-width="3"/>' +
    '</g></svg><span class="mark-name">plugfolio</span>';

  var TABS = [
    ['home',       '/dashboard',            'Home'],
    ['analytics',  '/dashboard/analytics',  'Analytics'],
    ['posts',      '/dashboard/posts',      'Posts'],
    ['products',   '/dashboard/products',   'Products'],
    ['categories', '/dashboard/categories', 'Categories'],
    ['collabs',    '/dashboard/collabs',    'Collabs'],
    ['settings',   '/dashboard/settings',   'Settings']
  ];

  /* Profiles the account can act on. In the product this is the session's
     membership list; here it stands in for it. */
  var PROFILES = [
    { h: '@mayamoves',     av: 'images/avatars/maya.jpg', q: 'maya' },
    { h: '@mayamoves.fit', av: 'images/avatars/nia.jpg',  q: 'fit'  },
    { h: '@rheamakes',     av: 'images/avatars/rhea.jpg', q: 'rhea', manager: true }
  ];
  var MAX = 5;

  function tabHref(t) {
    /* Dashboard tabs live on one page in this prototype; the real routes
       are in TABS above and are what the product will use. */
    /* Analytics is its own page — the range selector and the two tables
       need a URL you can send to a Manager. */
    if (t[0] === 'analytics') return '/analytics.html';
    return '/dashboard.html?tab=' + t[0];
  }

  slot.outerHTML =
    '<div class="dsh">' +
      '<div class="inner">' +
        '<div class="dsh-top">' +
          '<a class="mark" href="/dashboard.html" aria-label="Plugfolio dashboard">' + MARK + '</a>' +
          '<div class="psw">' +
            '<button class="psw-btn" type="button" data-psw aria-expanded="false" ' +
                    'aria-haspopup="true" aria-controls="pswMenu">' +
              '<img src="' + PROFILES[0].av + '" alt="">' + handle +
              ' <i aria-hidden="true">&#9662;</i>' +
              '<span class="skip">Switch profile</span>' +
            '</button>' +
            '<div class="psw-menu" id="pswMenu" hidden>' +
              '<h6>Profiles &middot; ' + PROFILES.length + ' of ' + MAX + '</h6>' +
              PROFILES.map(function (p) {
                var on = p.h === handle;
                return '<a href="?profile=' + p.q + '"' + (on ? ' aria-current="true"' : '') + '>' +
                  '<img src="' + p.av + '" alt="">' + p.h +
                  (on ? '<span class="sub">Active</span>'
                      : p.manager ? '<span class="sub">Manager</span>' : '') +
                  '</a>';
              }).join('') +
              '<hr>' +
              '<button class="psw-new" type="button"' +
                (PROFILES.length >= MAX ? ' disabled title="Profile limit reached"' : '') +
                '>+ New profile</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<nav class="dtabs" aria-label="Dashboard sections">' +
          TABS.map(function (t) {
            return '<a class="dtab" href="' + tabHref(t) + '" data-t="' + t[0] + '"' +
              (cfg.tab === t[0] ? ' aria-current="page"' : '') + '>' + t[2] + '</a>';
          }).join('') +
        '</nav>' +
      '</div>' +
    '</div>';

  /* The switcher's behaviour ships with its markup, so a page cannot get
     one without the other. */
  var b = document.querySelector('[data-psw]');
  var m = document.getElementById('pswMenu');
  if (!b || !m) return;
  function open(v) { m.hidden = !v; b.setAttribute('aria-expanded', String(v)); }
  b.addEventListener('click', function (e) { e.stopPropagation(); open(m.hidden); });
  document.addEventListener('click', function (e) {
    if (!m.hidden && !m.contains(e.target)) open(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !m.hidden) { open(false); b.focus(); }
  });
})();
