# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Shopper (primary, highest volume).** Someone who follows a creator on Instagram or TikTok, sees a reel or photo, and wants the thing in it. They arrive by tapping the creator's bio link and land **inside the social app's in-app browser** — on a phone, mid-scroll, with low patience and a session that dies if they leave for email. Their job: get from "I saw it" to "I'm on the retailer's page" in about three taps. They are never required to hold an account. An optional account exists only for acting as themselves — follow, comment, report.

**Creator.** An influencer who already makes content and wants it to earn. Their job: turn an existing post into a shoppable one by pasting a product URL and pinning their affiliate or own-store link, then learn which content actually drove taps. They work across up to 5 profiles on one account and may delegate to up to 3 Managers per profile.

**Business / brand.** A company hunting creators to promote products. Their job: describe a requirement to an open board or approach a creator directly from their page, then negotiate to agreed terms in a thread. Payment settles off-platform.

**Operator (internal).** Plugfolio's own trust-and-safety and ops team, working a private admin console: moderation, username disputes, report triage, feature flags, platform analytics, audit trail. A distinct, hardened account type — a product-auth bug must not reach admin.

**One account, many hats.** A single email can be shopper, creator, and business owner at once. Roles are capabilities layered on one identity, not separate logins. A "shopper account" is just an account with no profiles and no business.

## Product Purpose

Plugfolio turns a creator's content into a page where every post is shoppable, and lets their followers buy what they saw — at the retailer, with no account and no checkout.

The core loop is the whole product:

```
Creator makes content → tags the products in it → publishes a shoppable page
        ↓
Follower taps the bio link → taps a post → sees the products → taps Buy → retailer
        ↓
Every tap is recorded → the creator sees "this post drove N taps"
```

Everything else supports, protects, or extends that loop. Success is a shopper reaching the retailer without friction, and a creator being able to point at a specific post and say "that one worked."

## Positioning

The shoppable home base for creators: **one link, everything shoppable.**

The mechanism a neighboring product could not truthfully copy is the combination of three commitments held simultaneously:

1. **Post-level product tagging, not a link list.** The unit is the post the follower already saw, with the exact products in it — not a generic list of links divorced from content.
2. **Zero-account shopping, enforced as a rule.** Competitors gate follows, wishlists, or checkout behind sign-up. Plugfolio guarantees no wall ever appears between arriving and reaching the retailer.
3. **Honest attribution.** Every number shown is directly measured and labeled *tracked*. Nothing is estimated or inferred in v1. Where something cannot be measured, the product says so out loud.

Plugfolio is deliberately **cool and credible to creators, professional and trustworthy to brands** — both audiences at once, neither sacrificed.

## Operating Context

- **The in-app browser is the real usage scene**, not a desktop browser. Most shoppers arrive inside Instagram's or TikTok's embedded browser: phone-sized, no hover, taps that double-fire, and a session lost the moment the user leaves for a mail app. Mobile-first is a factual constraint, not a preference; desktop scales up from it.
- **Auth can never depend on an email round-trip to log in.** Login is email + password in one step. Email is used only to verify once at registration, to reset a password, and to invite a Manager who has no password yet.
- **Speed is a feature.** Public pages are server-rendered and must feel instant on a mid-range phone over mobile data.
- **Three distinct chromes exist**: a persistent shopper chrome (top bar + a four-tab mobile bottom bar — HOME / SHOP / FOLLOWING / ACCOUNT) wrapping public and shopper-account screens; a creator dashboard shell (top bar, profile switcher, section-tab row, with an active `?profile=` carried through URLs); and a light business chrome. The landing page uses its own nav and footer, not the shopper chrome.
- **Buying happens elsewhere.** The outbound tap hands the shopper to a retailer — Amazon, Nykaa, Myntra, a brand's own store, or the creator's own storefront. Plugfolio's job ends at the handoff and resumes at the attribution event.
- **Collab payment settles off-platform**, between brand and creator directly.

## Capabilities and Constraints

**The four rules that define the product.** These are not features; they are constraints every feature respects.

1. **Shopping never requires an account.** No login wall, modal, or "sign up to continue" may ever appear between arriving at a creator page and landing on the retailer. Accounts gate only act-as-yourself actions: follow, comment, report, sell, hire.
2. **v1 handles no money.** No cart, checkout, wallet, payout, price total, or on-platform payment — ever. Buy forwards out through the creator's own link.
3. **Attribution is honest.** Every number is *tracked* (directly measured). Where something cannot be measured — in-store coupon redemption — it is labeled "redemption not tracked." Nothing is fabricated or estimated in v1.
4. **Double-tap tolerance.** In-app browsers double-fire taps. Action buttons show a busy state (disabled + label change) after the first tap; the backend absorbs duplicates via idempotency keys.

**Shipped capabilities.** Shop-from-a-post; product pages; coupon offers (online code, in-store code with a redemption note, or both); own-store vs affiliate signalling ("Buy" vs "Shop their store", with own products marked as a trust cue); explore/discovery; optional-account follow via an inline claim sheet; comments and replies under a chosen `@handle` (never an email); account-free reporting; email+password registration with one-time verification; Google/YouTube connect for identity (not social login); up to 5 profiles per account; instant-live profiles with a temporary random username; posts by media URL + caption, hideable without deletion; product tagging by URL with title/image/price fetch; a product library; categories ("shelves"); tracked earnings attribution by post and product plus coupon copy counts; profile identity and a social links row; up to 3 Managers per profile; collabs from both doors (open requirement board and direct request from a creator page) negotiated to mutually accepted terms; and a full internal admin console with an append-only audit trail.

**Hard exclusions from v1** (do not design these in): on-platform payments, payouts, checkout, cart, or totals · referral/share-to-earn · anonymous wishlists and price alerts · an aggregated "My Creators" feed (Following is a plain list) · tracked in-store redemption or QR (the *untracked* in-store coupon channel IS in v1) · star ratings and "actually uses this" badges · media kits and campaign suites · drops, bundles, availability windows · TikTok connect · AI tag suggestions · more than 5 profiles, more than 3 Managers, or finer-grained roles · vanity/free-form usernames · creator-to-creator collabs · in-app support threads (support replies go by email).

**Designed-for but not yet live [LATER].** Meta/Instagram connect · the creator username picker for claiming a real social handle · automatic post import and re-sync · video and reels playback · claim-sheet auto-resume after verification · a dead/broken-affiliate-link shopper state and a link-health flag · product title editing · picture upload (paste-a-URL only today) · a dedicated Earnings route with time ranges and "estimated" figures alongside the tracked ones · explore filters, niche chips, trending sort, pagination · a report affordance on the post view · richer collab inbox states (incoming vs approached, "new" badge, decline/archive) · shopper-surface loading skeletons.

**Terminology.** *Profile* = one creator page with its own username (up to 5 per account). *Post* = a piece of content. *Product* = a tagged item with a pinned outbound link. *Shelf* = a named category grouping posts and products. *Tap* = a recorded outbound click, the unit of attribution. *Manager* = a delegated helper on a profile. *Collab* = a negotiated brand-creator engagement. *Requirement* = a brand's posted brief on the open board.

**Technical seam.** Engineering consumes **semantic design tokens** — components never hardcode values, so one delivered palette or scale restyles the whole product. Component base is **shadcn/ui**; any new primitive a screen needs must be flagged explicitly. This repo (`plugfolio-design`) produces the design system and built screens; the running product lives in the sibling `plugfolio/` monorepo, where the token contract is already implemented at `packages/tokens/src/tokens.css` and consumed through a Tailwind preset. Token *names* are the seam; values are the deliverable.

**Market — both from day one.** v1 serves Indian and US/global creators and shoppers simultaneously. Multi-currency and multi-region retailers are in scope, so no content, copy, price format, or example may silently assume a single market. Budgets on collab requirements are deliberately free text, never a currency-validated field. Prices of unknown value are hidden — never rendered as "$0".

## Brand Commitments

**Binding.** A complete brand system exists and is authoritative: **Plugfolio Brand Guidelines v1.1 (2026)**, at `Plugfolio Brand.html`, with the symbol's parametric source at `PlugMark.dc.html`. Design work honors it rather than reinventing it. The record below is the durable identity truth; the guidelines file remains the authority for construction and usage detail.

- **Name:** `plugfolio`, set lowercase in the wordmark.
- **Positioning line:** cool and credible to creators; professional and trustworthy to brands. Confident, modern, energetic, premium, mobile-first.
- **Symbol:** a two-prong plug whose prongs rise into upward arrows — plug meets growth. Pictorial, monochrome-safe, no letterform. Built on a 100×100 grid; prongs and body must read as one continuous silhouette that flattens to a single shape in one color.
- **Locked prong/spark color rule:** on light, a violet body with **ink** prongs (`#12101C`) — never lime. On dark or violet, a white or violet body with **lime** prongs and a lime spark. Under 24px the mark collapses to one flat color.
- **Lockups:** four approved locks only — horizontal (primary), stacked, symbol, reversed. The wordmark is never re-spaced, re-weighted, or re-typeset.
- **Clear space & minimums:** clear space equals one prong width on every side (for the horizontal lockup, x = the symbol's height). Digital minimum 16px; 24px UI; 44px app icon.
- **Palette — "Charged Violet":** Brand Violet `#7C3AED` (primary) · Violet Deep `#5B21B6` (hover/dark) · Violet Tint `#A78BFA` (accents) · Ink `#12101C` (text, prongs, dark UI) · Electric Lime `#C6FF3D` (**fill only**, always with dark text — never lime type on white) · Coral `#FF6B5C` (warm alt) · Violet Wash `#EFEAFB` (tint field) · Canvas `#F5F4F8` (page bg). An Ink+Lime alt colorway was reviewed and **not adopted**; violet stays primary because violet equity is stronger for a trust-first commerce brand.
- **Typography:** **Sora** is *locked* for the wordmark and headlines (weights 500–800, tracking −2% to −5% at display sizes); Space Grotesk was evaluated and rejected. **Inter** for UI and the data-heavy product (weights 400–700, body 16/1.6, tabular numerals for data). A mono face carries captions/eyebrow labels.
- **Six documented misuses, never allowed:** stretching or distorting · off-system colors · gradients or shadows on the mark · outlining the mark · rotating or tilting · lime prongs on light.
- **Voice:** direct, confident, creator-native. Short lines. No hype, no jargon. Primary tagline **"Turn your content into commerce."**; short line **"Plug in. Sell more."** Approved register: "Tag it once. Sell it everywhere." / "One link. Everything shoppable." Rejected register: corporate synergy-speak and exclamation-point hype.
- **Product copy voice** (from the product spec, compatible with the above): plain and confident; the personality is *removing* friction. Say the quiet parts loudly — "shopping never needs an account," "tracked," "redemption not tracked," "payment settles off-platform." Errors are specific and human ("A profile has at most 3 Managers"), never codes — except auth and admin failures, which stay deliberately generic because that is a security requirement, not a tone choice.

## Evidence on Hand

- **Brand system — real and binding.** `Plugfolio Brand.html` (Brand Guidelines v1.1) and `PlugMark.dc.html` (the symbol's parametric SVG source, with `body` and `prong` color props).
- **Product specification — real and current.** `product-overview.md` (what the product is, feature catalogue by role, use cases, the attribution model) and `design-handoff.md` (the complete screen-by-screen spec: every role, flow, screen, state, control, and permission rule, plus the admin console, email assets, and the component inventory). Both are dated July 2026 and describe what actually ships.
- **A running v1 implementation** in the sibling `plugfolio/` monorepo (`apps/web`, `apps/admin`, `apps/api`; `packages/tokens`, `packages/ui`, `packages/db`, `packages/core`, `packages/config`), including a token layer already built against Brand Guidelines v1.1. It is available as reference for product truth and for the token contract.
- **Explicitly absent — must not be fabricated.** There is no real creator content, no real product catalogue, no real post imagery, no real handles, no usage metrics, no testimonials, no customer names, no press, no pricing, and no case studies. Any such content in a design must be visibly placeholder or clearly labeled, never presented as a real creator, brand, product, or number. Because attribution honesty is a product rule, invented metrics are a correctness failure, not just a content shortcut.

## Product Principles

1. **The shopper's path is sacred.** Nothing — no account prompt, no interstitial, no slow asset, no failed analytics call — may stand between arriving and reaching the retailer. When attribution recording fails, the redirect still happens. The shopper's experience always wins.
2. **Design for the in-app browser on a phone.** The real scene is a mid-range phone inside Instagram's embedded browser. No interaction may depend on hover; every action works on first tap and tolerates a second; weight on the shopper path is a defect.
3. **Say what is true, out loud.** Label measured things *tracked* and unmeasurable things as unmeasured. Hide unknown prices rather than showing zero. The honesty labels are product features that earn creator trust — never quiet them for visual tidiness.
4. **Two audiences, one surface.** Every creator-facing decision is read by brands as a credibility signal, and every brand-facing decision is read by creators as a coolness signal. Serve both; sacrifice neither.
5. **Every state is designed.** Empty, loading, error, busy, permission-denied, and rate-limited are specified for every screen and are not afterthoughts. A screen is not done until its unhappy paths are.

## Accessibility & Inclusion

- **WCAG AA contrast** is a stated non-negotiable across the product, in both light and dark appearances (both must exist).
- Every control is **keyboard-reachable and labeled**, with semantic document structure.
- **`prefers-reduced-motion` is respected.**
- **Electric Lime is a fill only, always beneath dark text** — it fails contrast as a text color on light and must never be used as type on white.
- Touch targets must suit one-handed phone use in an in-app browser, where the OS chrome eats screen edges.
- Content must not assume a single market or currency (see *Market* above).
