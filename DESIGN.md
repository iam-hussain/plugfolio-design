---
name: Plugfolio
description: Bright, warm, photo-led creator commerce — cool near-white canvas, saturated colour tiles, and product tags pinned straight onto the post.
colors:
  canvas: "#FCFBFE"
  surface: "#FFFFFF"
  ink: "#12101C"
  ink-2: "#56506A"
  ink-3: "#8B8499"
  violet: "#7C3AED"
  violet-deep: "#5B21B6"
  violet-wash: "#EFEAFB"
  lime: "#C6FF3D"
  butter: "#FFD84D"
  mint: "#96E6BC"
  sky: "#A9D8FF"
  lavender: "#C9B6FF"
  coral: "#FF8A73"
  blush: "#FFC9DE"
  line: "#E9E4F0"
typography:
  display:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6.2vw, 5rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3.6vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  copy:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.01em"
  micro:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.06em"
  price:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    fontFeature: "tnum"
rounded:
  paper: "3px"
  chip: "999px"
  image: "16px"
  tile: "20px"
  card: "26px"
  bay: "34px"
spacing:
  hair: "4px"
  tight: "8px"
  snug: "14px"
  room: "24px"
  band: "40px"
  district: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "16px 28px"
  button-primary-hover:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "15px 27px"
  chip-eyebrow:
    backgroundColor: "{colors.violet-wash}"
    textColor: "{colors.violet-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "8px 16px"
  product-tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.price}"
    rounded: "{rounded.chip}"
    padding: "7px 12px"
  post-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "10px"
---

# Design System: Plugfolio

## Overview

**Creative North Star: "The Tagged Feed"**

Plugfolio looks like the daylight side of the creator economy: a cool violet-tinted near-white canvas, oversized confident headlines, and real photography living inside saturated colour tiles. The product's whole mechanism is *a post with the things inside it made tappable*, so the system's defining move is a **product tag pinned directly onto a photograph** — a small white pill carrying a price and a retailer, sitting on the image the way a creator's finger points at the thing you wanted.

The register is bright, generous, and confident — never corporate, never loud. Content leads; chrome recedes. Photographs are the largest objects on every screen, colour is carried by the tiles those photographs sit in, and typography does the persuading in two heavy lines rather than a paragraph. Cards are generously rounded (26px) and frequently tilted a degree or two, so a row of posts reads as something laid out by hand rather than dealt by a grid.

Density is low and airy in marketing surfaces and tightens considerably in product surfaces, but the vocabulary is shared: same tile radii, same tag pill, same colour roles. Brand Violet stays the primary action and identity colour; Electric Lime is the accent that flags a live deal.

**Key Characteristics:**
- Cool violet-tinted near-white canvas (#FCFBFE), never pure white at page level.
- Oversized Sora headlines at -0.045em, two lines maximum.
- Photography inside saturated colour tiles; the tile supplies the colour, the photo supplies the subject.
- Product tags are white pills pinned onto photographs — the system's signature.
- Pill buttons in near-black; violet on hover.
- Cards tilt 1–2° at rest. Nothing is perfectly square to the grid.

## Colors

> **Deliberate departures from Brand Guidelines v1.1.** PRODUCT.md records the brand book as binding; the user explicitly reopened it for this work. Three values intentionally differ and engineering should follow *this* file: body/UI type is **Manrope**, not Inter; the page ground is **Canvas #FCFBFE**, not #F5F4F8; the warm alt is **Coral #FF8A73**, not #FF6B5C. The mark, Brand Violet, and Electric Lime are unchanged.


A warm neutral canvas carrying one brand violet, one fluoro accent, and a six-hue tile palette that belongs to content rather than to chrome.

### Primary
- **Brand Violet** (#7C3AED): the identity and action colour — links, active states, focus rings, the hover state of every primary button, and the brand mark. Used at small area, high frequency.
- **Violet Deep** (#5B21B6): text on violet-wash fields, and the pressed state.
- **Violet Wash** (#EFEAFB): the eyebrow chip field and any quiet violet-tinted panel.

### Secondary
- **Electric Lime** (#C6FF3D): fill only, always beneath ink text. Reserved for one thing — flagging a live coupon or deal. It never becomes a general accent, because its whole job is to mean *there is an offer here*.

### Tertiary — the tile palette
Six content hues that colour the tiles photographs sit in, and the step and door panels: **Butter** (#FFD84D), **Mint** (#96E6BC), **Sky** (#A9D8FF), **Lavender** (#C9B6FF), **Coral** (#FF8A73), **Blush** (#FFC9DE). All are light enough to carry ink text at AA. They are assigned by position in a sequence, never by category meaning — a mint tile does not mean "success."

### Neutral
- **Canvas** (#FCFBFE): the page. A cool near-white carrying the faintest violet cast, so the ground relates to Brand Violet rather than sitting neutral against it. The whole system sits on this; it is never pure #FFF at page level, because white is reserved for lifted objects.
- **Surface** (#FFFFFF): raised cards, tag pills, and floating panels — white is a *lift*, not a ground.
- **Ink** (#12101C): headlines and body text.
- **Ink 2** (#56506A): supporting copy and subheads.
- **Ink 3** (#8B8499): captions, handles, metadata.
- **Line** (#E9E4F0): hairlines and card borders at 1px.

### Role colour — the chrome says which hat is on

One email is shopper, creator and business at once, so a colour can never describe the *person*. It describes the **surface they are currently standing on**. Four modes, each carrying one hue:

| Mode | Solid | OKLCH | Deep (text) | Wash (field) |
|---|---|---|---|---|
| **Shopper / public** | Lavender `#C9B6FF` | L .818 · C .103 · H 296 | Violet Deep `#5B21B6` | Violet Wash `#EFEAFB` |
| **Creator** | Sky `#A9D8FF` | L .863 · C .073 · H 244 | `#14507A` | `#E5F1FC` |
| **Business** | Mint `#9CDCB2` | L .840 · C .088 · H 155 | `#215D3B` | `#E8FCEE` |
| **Operator (admin)** | Ink `#12101C` | — | Ink | Line `#E9E4F0` |

The three hues are separated by **89° or more** — mint sits 141° from lavender and 89° from sky, which is the widest spacing available once two of the three are fixed. Teal was rejected for business at 54° from sky: too close to tell apart at rail size.

Shopper stays in the violet family because the public surface most people see should wear the brand's own colour, not a third-party hue. Creator runs warm and business runs cool, which is the positioning line — *cool and credible to creators, professional and trustworthy to brands* — made visible.

**The Same-Tone Rule.** The three hues are a set, and a set is tuned in a perceptual space, not picked by eye. All three sit at **L ≈ 0.82–0.86** with **C ≈ 0.07–0.10** — near-identical lightness and chroma, separated only by hue. That shared tone is what makes them read as siblings rather than one shouting over the others. Butter `#FFD84D` was tried and rejected for exactly this: at **C 0.157** it carried nearly double lavender's chroma and dominated any screen it shared. Any future role hue must land inside the same L/C window before its hue is even considered.

Measured against WCAG AA: creator deep on its wash **7.57**, on canvas **7.95**; business deep on its wash **7.45**, on canvas **8.29**; shopper deep on wash **7.63**. Ink on each solid: lavender **10.41**, sand **11.51**, sky **12.50** — a tight band, which is itself a symptom of the tone matching. Dark inversions: creator `#EECD87` on `#3A2B07` **8.97**, business `#9FCDF0` on `#14304A` **8.03**.

Role colour is carried by three objects: a **5px rail fixed to the top of the viewport on every page**, the **mode slot** — a pill in the top-right of every chrome that names the current mode and opens the switcher — and the **immersive pane** on auth. The rail is fixed rather than in-flow so it is the one constant across all four chromes; sticky headers sit 5px below it. Rail and slot are flat fills; neither carries body text.

### The immersive pane (auth only)

Auth is the one surface with no content of its own to look at, so it gets a full-bleed pane in a **deep** tone of the role hue, carrying white type and the mark set huge and translucent at its foot. The deep tones are matched to Brand Violet's lightness so they read as one set, exactly as the pastels are:

| Mode | Gradient from → to | White on lightest stop | White on deepest stop |
|---|---|---|---|
| **Shopper** | `#7C3AED` → `#5D01C0` | 5.70 | 9.41 |
| **Creator** | `#0375B6` → `#015383` | 4.97 | 8.18 |
| **Business** | `#047A45` → `#01552E` | 5.42 | 8.97 |

Mint opens one lightness step deeper than the shared match would give. At the same lightness as the others its opening stop measured **4.71** — over the 4.5 minimum but under the 4.97 the set holds — because green's gamut runs out of chroma sooner. Deepening it one step restores the band.

The pane **does not theme** — identical in light and dark — so the mode reads the same in both. Cards lifted onto it stay true white with ink text.

**Measure the lightest stop, not the base.** A first pass opened these gradients on a lighter tint of each hue (`#9262FE` / `#A58335` / `#398FCD`) and verified white against the *base* colour only. On the actual opening stop white measured **3.51–3.89** — under the 4.5 floor, on exactly the pixels headings and labels sit on. The gradient now starts at the base tone so every stop clears AA. Any new role hue is checked at its lightest stop before anything else.

**No alpha-reduced type on a gradient.** At the lightest stop, white needs **0.85–0.93 alpha** just to reach AA, which leaves no usable range for "quieter" text. All type on a role pane is therefore solid white, and hierarchy is carried by size and weight. Translucent white is fine for non-text — hairlines, borders, the mark at the foot.

**The gradient exception.** *Don't use gradients* below still holds everywhere else. It is lifted for this one object, on three conditions: the gradient runs between two tones of a **single** hue (never across hues), it sits **behind** content rather than beneath body text on a content surface, and it **never touches the mark** — the mark at the foot is one flat white at low alpha, because a gradient on the mark is a documented brand misuse. A gradient anywhere outside the auth pane is still wrong.

### Named Rules
**The White-Is-A-Lift Rule.** The page is canvas; white belongs only to things that sit *on* it. A white section background flattens the whole system and is never correct.

**The Role-Colour-Is-Chrome-Only Rule.** A role hue may touch the rail, the mode slot and the shell around a working surface. It may never touch a post, a photograph, a tag, a price or a Buy button — because `/[handle]` is read by an anonymous shopper, a signed-in shopper, a business and the owner *at the same moment*, and the shop must look identical to all four. Public surfaces are therefore always in **shopper** colour regardless of who is signed in; the mode slot is the only thing on them that knows who you are. This is a deliberate exception to the Tile-Carries-Colour rule below, which assigns tile hues by position in content: **in content, hue is positional; in chrome, hue is role-coded.** Electric Lime is never a role — it still only means *there is an offer here*.

**The Lime-Means-Offer Rule.** Electric Lime appears only where there is a real coupon or deal, always as a fill under ink text, never as type. If nothing is on offer, there is no lime on the screen.

**The Tile-Carries-Colour Rule.** Saturated colour arrives as a tile behind or around content. It is never a text colour, a border, or a gradient wash across the page.

## Typography

**Display Font:** Sora (with system-ui, sans-serif)
**Body Font:** Manrope (with system-ui, sans-serif)

**Character:** Sora is an even, geometric display sans that goes genuinely heavy without turning into a slab — at 800 with -0.045em tracking it gives the two-line headline the reference world runs on. Manrope does everything else, with tabular figures wherever a price or a count appears.

### Hierarchy
- **Display** (Sora 800, clamp(2.25rem, 6.2vw, 5rem), 1.02, -0.045em): the page's one headline. Two lines, balanced.
- **Headline** (Sora 700, clamp(1.875rem, 3.6vw, 3rem), 1.08, -0.035em): section openers.
- **Title** (Sora 700, 1.375rem, 1.2, -0.02em): card and panel titles.
- **Body** (Manrope 400, 1.0625rem, 1.6): lead paragraphs, measured at 46–60ch under a centred headline.
- **Copy** (Manrope 400, 0.9375rem, 1.55): supporting copy inside tiles and cards.
- **Label** (Manrope 600, 0.8125rem): buttons, chips, nav, and handles.
- **Micro** (Manrope 600, 0.75rem, 0.06em, uppercase, in **Ink 2**): honesty labels, retailer lines, and metadata on a tag. Micro carries product-critical copy ("tracked", "redemption not tracked", "no cart, no checkout"), so it is set in Ink 2 at 7.25:1 — never Ink 3, which fails AA at this size.
- **Price** (Manrope 700, 0.9375rem, tabular): every price and measured number.

### Named Rules
**The Two-Line Rule.** The display headline breaks to exactly two lines at every breakpoint. Three lines means the copy is too long, not that the type is too big.

**The Tabular-Money Rule.** Prices, tap counts, and any measured figure use `font-variant-numeric: tabular-nums`, so a number that updates never reflows its neighbour.

## Layout

A centred column on a canvas ground: content holds a 1200px measure with a 20px gutter, opening to 40px from the large breakpoint. Hero content centres; section content alternates between centred openers and left-aligned tile grids.

The vertical rhythm is a 4px base — 4 / 8 / 14 / 24 / 40 / 96 — with 96px between sections on desktop and 56px on phones. Space above a heading always exceeds the space below it.

The signature arrangement is **the fan**: a horizontal row of post cards, each tilted 1–2° in alternating directions, overlapping slightly at the edges. On phones the fan becomes a horizontally scrollable rail with the same tilts preserved and snap points on each card, because the tilt is the character and flattening it to a plain stack loses the world.

### Named Rules

- **Viewer-Swaps-The-Chrome** — a page with more than one audience varies only its frame: the action slot, any viewer-specific band, and whether the comment footer is a composer or a claim band. The buy path — shelves, grid, tiles, tags — is byte-identical for an anonymous shopper, a signed-in shopper, a business and the owner. If a viewer state changes what someone can buy or how they buy it, the state is wrong, not the layout.
- **Hide-By-Exclusion** — swap visibility with `body:not([data-viewer="x"]) .v-x { display: none }`, never `.v-x { display: none }` plus a re-show. A flat hide is outranked by whatever display the element already carries, and the re-show has to guess `flex` / `inline-grid` / `block` correctly for every element it touches. Excluding leaves the matching state matching no rule at all, so each element keeps its own display.
- **Creator-Sets-The-Frame** — layout, header treatment, accent, greeting, bio and which links show are the creator's, not the page's. They are set in place on the profile — where the result is visible — and read by every surface that creator owns: profile, post, product. A creator styles once and their content carries it. The accent is the only colour they control; the Plugfolio violet, the tile palette and the neutrals stay the system's.
- **Every-Accent-Clears-AA** — a creator-selectable colour is a contrast decision made by someone who cannot measure it. Each option in the picker is verified against white label text before it ships, because the accent lands on Buy. Measured: violet 5.70, indigo 7.90, coral 5.09, forest 6.50, magenta 6.28.
- **Hidden-Beats-Display** — `[hidden] { display: none !important }` is declared once, globally. Without it every `el.hidden = true` written in JS silently loses to whatever `display` a class already set, and the bug looks like broken logic rather than broken cascade.
- **Actions-Take-A-Row** — on phones a header's action slot wraps to its own full-width row. Held beside the identity block it never shrinks, so the name and bio absorb the whole loss and collapse to one word per line as soon as a viewer carries two buttons.

Mobile-first is a hard product constraint: most visitors arrive inside Instagram's in-app browser. No interaction depends on hover, every tag and action is a first-tap target of at least 44px, and the fan's scroll works with touch momentum.

## Elevation & Depth

Soft and diffuse. Objects sit slightly above the canvas on wide, low-opacity shadows — nothing is dramatically lifted, and there is no glass, no blur, and no inner glow. Depth comes from the combination of a shadow, a rounded corner, and a slight rotation.

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 12px 30px -12px rgba(18, 16, 28, 0.16)`): post cards and panels at rest.
- **Tag** (`box-shadow: 0 4px 12px -2px rgba(18, 16, 28, 0.22)`): product tag pills pinned onto a photograph, which need to separate from busy imagery.
- **Raise** (`box-shadow: 0 22px 44px -16px rgba(18, 16, 28, 0.24)`): the hover state of a card, paired with a lift and a de-rotation to 0°.

### Named Rules
**The Straighten-On-Hover Rule.** A tilted card returns to 0° when hovered or focused, and lifts. The tilt is the resting personality; attention is what straightens it.

## Shapes

Generously rounded throughout — this system's warmth lives in its corners. The one exception is **paper** (3px, `--r-paper`, on **Paper** `#FFFDF6` — warmer than Surface, so a note or a brief reads as stock rather than another white card): photo prints, tape and pinned notes are cut near-square, so any surface standing in for a physical print uses that step rather than a card radius. Radii climb with the size of the object: images 16px, tiles 20px, cards 26px, large bays 34px, and anything interactive that carries a label is a full pill (999px). Buttons, chips, tags, and nav pills are all pills; nothing interactive is a rectangle.

Borders are 1px in Line (#E9E4F0), used on white cards sitting on canvas where the shadow alone is not enough separation. There are no thick or coloured left-borders anywhere.

## Components

### Buttons
- **Shape:** full pill (999px), no border on primary.
- **Primary:** ink fill, white label, 16px/28px padding. Hovers to Brand Violet — the colour arrives on interaction rather than at rest.
- **Secondary:** white fill, ink label, 1px Line border. Used for the second action in a pair.
- **Focus:** 3px Brand Violet ring at 2px offset.
- **Disabled / Busy:** fill drops to Line with Ink 3 label, and the label changes to the busy verb. Because in-app browsers double-fire taps, every action button must show a busy state.

### Product Tag (signature component)
The system's defining object. A white pill pinned onto a photograph at a coordinate, carrying the product name, its price in tabular figures, and a micro retailer line ("opens Amazon"). It has a small circular anchor dot connecting it to the point on the image it refers to. A tag with a live coupon carries a lime dot; a creator's own product carries a violet dot. Tags are real links to the product page — never decoration — and every tag is a 44px-minimum tap target.

### Post Card
White surface, 26px radius, 10px padding, holding a 16px-radius photograph with tags pinned on it and a creator row beneath (avatar, @handle, product count). Tilts 1–2° at rest, straightens and lifts on hover or focus.

### Tagged Product Card (post & product surfaces)
A surface card in a two-column grid: a square 96/120px product photo on the left, and on the right the title, the price in tabular figures, and a micro kind-and-destination line ("affiliate pick · opens Amazon"). A coupon block sits **above** the button — copy the code, then go — with the code always printed in full on the copy button so a clipboard denial still leaves it readable. The creator's own products carry a violet-wash "their own product" chip; affiliate ones carry nothing.

The card is never wrapped in a single link. It holds two competing actions — copy a code, leave for the retailer — and one enclosing link is how a shopper copies a code by accident. Cards size to their own content: in a multi-column grid they must not stretch to the tallest sibling, or a short card floats its button and strands its footnote.

### Colour Tile
A 20px-radius panel in one of the six tile hues, carrying ink text and optionally a photograph or a floating white card. Used for the step sequence and the three role doors. Never nested inside another tile.

### Eyebrow Chip
A violet-wash pill with violet-deep label text, sitting above the display headline. Exactly one per page — it is the page's one kicker, not a section grammar.

### Navigation
Ink labels at Label size, no containers, sitting directly on canvas. The account actions are pills — a ghost "Log in" and a solid ink CTA. Active state is Brand Violet text. On mobile the nav collapses to the mark plus a single ink pill; the product's four-tab bottom bar uses Label type with a violet active state.

## Do's and Don'ts

### Do:
- **Do** keep the page on canvas (#FCFBFE) and reserve white for lifted objects.
- **Do** pin product tags onto photographs — that is the mechanism made visible, and it is the one thing this system has that a generic bright SaaS page does not.
- **Do** tilt cards 1–2° at rest and straighten them on interaction.
- **Do** give every price and count tabular figures.
- **Do** keep the honesty labels ("tracked", "redemption not tracked", "no account needed") visible in Micro type. They are product features, not fine print.
- **Do** give every action button a visible busy state; the in-app browser double-fires taps.

### Don't:
- **Don't** use Electric Lime for anything except flagging a real offer, and never as a text colour.
- **Don't** put a saturated colour behind body text as a full-bleed page section; colour arrives as tiles.
- **Don't** let the display headline run to three lines.
- **Don't** nest a tile inside a tile, or a card inside a card.
- **Don't** use gradients, glass, or blur as decoration — with one scoped exception, the auth immersive pane (see *The gradient exception* above). Glass and blur have no exception anywhere.
- **Don't** show a number the product cannot measure, and never render an unknown price as a zero.
- **Don't** render an in-store-only product as a broken card. It has no link, so it gets no outbound button — the code *is* the action, and the redemption note is the instruction.
- **Don't** let an ended offer take its product down with it: the coupon collapses to "Offer ended", the card reverts to its no-coupon variant, and the product stays buyable.
