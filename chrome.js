/* ═══════════════════════════════════════════════════════════
   Plugfolio — the shopper chrome, rendered once (§5.1).

   The top bar and the bottom tab bar were copy-pasted into every public
   page. That is how /support shipped without an account menu and how
   .v-anon/.v-signedin went missing from a page that needed them: five
   copies, and a fix lands in one.

   A page opts in with two placeholders and a config:

     <div data-chrome="top"></div>
     ...
     <div data-chrome="tabs"></div>
     <script>window.CHROME = { tab: 'shop', nav: 'explore' };</script>
     <script src="chrome.js" defer></script>

   Viewer state still comes from body[data-viewer], so the review panel
   keeps driving it and the CSS in styles.css keeps doing the hiding.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var cfg = window.CHROME || {};
  var top = document.querySelector('[data-chrome="top"]');
  var tabsSlot = document.querySelector('[data-chrome="tabs"]');
  if (!top && !tabsSlot) return;

  var MARK =
    '<svg class="mark-glyph" viewBox="0 0 100 100" aria-hidden="true"><g stroke-linejoin="round">' +
    '<polygon points="33,53 33,27 39.5,15 46,27 46,53" fill="currentColor" stroke="currentColor" stroke-width="3"/>' +
    '<polygon points="54,53 54,27 60.5,15 67,27 67,53" fill="currentColor" stroke="currentColor" stroke-width="3"/>' +
    '<rect x="18" y="43" width="64" height="44" rx="13" fill="#7C3AED" stroke="#7C3AED" stroke-width="3"/>' +
    '</g></svg><span class="mark-name">plugfolio</span>';

  function cur(v) { return cfg.nav === v ? ' aria-current="page"' : ''; }

  /* ── top bar ─────────────────────────────────────────────
     Signed out carries the acquisition doors; signed in they stand down
     for Following, and "For business" reappears in the menu as an action
     rather than a pitch. */
  if (top) {
    top.outerHTML =
      '<header class="inner">' +
        '<nav class="nav" aria-label="Primary">' +
          '<a class="mark" href="/" aria-label="Plugfolio home">' + MARK + '</a>' +
          '<div class="nav-mid">' +
            '<a class="nav-link" href="/explore"' + cur('explore') + '>Explore</a>' +
            /* These point at the real marketing pages now. They used to go to
               a landing anchor and to /collabs — the logged-out product
               surface — which dropped a stranger into an app screen. */
            '<a class="nav-link v-anon" href="/how-it-works"' + cur('how') + '>How it works</a>' +
            '<a class="nav-link v-anon" href="/for-creators"' + cur('creators') + '>For creators</a>' +
            '<a class="nav-link v-anon" href="/for-business"' + cur('business') + '>For business</a>' +
            '<a class="nav-link v-signedin" href="/following"' + cur('following') + '>Following</a>' +
          '</div>' +
          '<div class="nav-end">' +
            '<a class="btn btn--ghost v-anon" href="/signin">Log in</a>' +
            '<a class="btn btn--primary v-anon" href="/join?as=creator">Create your page</a>' +
            '<span class="acctwrap v-signedin">' +
              '<button class="acctbtn" type="button" aria-expanded="false" aria-haspopup="true" ' +
                      'aria-controls="acctmenu" data-acct>' +
                '<img src="images/avatars/nia.jpg" alt="">' +
                '<span class="acctbtn-c"><span class="roleslot-dot" aria-hidden="true"></span>Shopping ' +
                  '<span aria-hidden="true">&#9662;</span></span>' +
                '<span class="skip">Your account and roles</span>' +
              '</button>' +
              '<div class="acctmenu" id="acctmenu" role="menu" hidden>' +
                '<div class="acctmenu-id"><b>Nia Okafor</b>' +
                  '<span>@niaeveryday &middot; nia@email.com</span></div>' +
                '<h6>You are here</h6>' +
                '<a role="menuitem" href="/following"><span class="dot dot--shop"></span>Shopping' +
                  '<span class="sub">Following</span></a>' +
                '<h6>Creator &middot; 2 of 5 profiles</h6>' +
                '<a role="menuitem" href="/dashboard?profile=maya">' +
                  '<img class="av" src="images/avatars/maya.jpg" alt="">@mayamoves' +
                  '<span class="sub">Dashboard</span></a>' +
                '<a role="menuitem" href="/dashboard?profile=rhea">' +
                  '<img class="av" src="images/avatars/rhea.jpg" alt="">@rheamakes' +
                  '<span class="sub">Manager</span></a>' +
                '<hr>' +
                '<a role="menuitem" href="/join?as=business">' +
                  '<span class="dot dot--business"></span>Create a business</a>' +
                '<a role="menuitem" href="/account">Account settings</a>' +
                '<a role="menuitem" href="/support">Help</a>' +
                '<hr>' +
                '<button role="menuitem" type="button" data-signout>Sign out</button>' +
              '</div>' +
            '</span>' +
          '</div>' +
        '</nav>' +
      '</header>';

    /* A page may own one element inside the shared bar — /[handle] puts the
       creator's avatar and Follow button there once you scroll past the
       header. It is authored in the page (it carries page state and page
       behaviour) and moved in here, so adopting the shared chrome never
       costs a page its one bespoke affordance. */
    var slot = document.querySelector('[data-chrome-slot]');
    var mark = document.querySelector('header.inner .mark');
    if (slot && mark) mark.parentNode.insertBefore(slot, mark.nextSibling);
  }

  /* ── bottom tabs (phones) ────────────────────────────────
     SHOP is active across /explore AND every creator surface — all of that
     is shopping. A page that is neither passes no tab and lights none. */
  if (tabsSlot) {
    var TABS = [
      ['home', '/', 'Home', '<path d="M3 10.5L12 3l9 7.5V21H3z"/>'],
      ['shop', '/explore', 'Shop', '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'],
      ['following', '/following', 'Following',
        '<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z"/>'],
      ['account', '/account', 'Account',
        '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>']
    ];
    tabsSlot.outerHTML =
      '<nav class="tabs" aria-label="Sections">' +
      TABS.map(function (t) {
        return '<a class="tab" href="' + t[1] + '"' + (cfg.tab === t[0] ? ' aria-current="page"' : '') + '>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
          t[3] + '</svg>' + t[2] + '</a>';
      }).join('') +
      '</nav>';
  }

  /* ── the account menu's behaviour ────────────────────────
     Lives with the markup it belongs to, so a page cannot get one without
     the other. */
  var btn = document.querySelector('[data-acct]');
  var menu = document.getElementById('acctmenu');
  if (!btn || !menu) return;

  function open(v) {
    menu.hidden = !v;
    btn.setAttribute('aria-expanded', String(v));
  }
  btn.addEventListener('click', function (e) { e.stopPropagation(); open(menu.hidden); });
  document.addEventListener('click', function (e) {
    if (!menu.hidden && !menu.contains(e.target)) open(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) { open(false); btn.focus(); }
  });
  var out = menu.querySelector('[data-signout]');
  out.addEventListener('click', function () {
    out.textContent = 'Signing out…';
    out.setAttribute('aria-disabled', 'true');
  });
})();
