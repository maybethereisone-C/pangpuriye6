# Stitch Prompts — pangpuriye6

Seven Google Stitch prompts (one per section) ready to paste. Each prompt references the locked design system from `docs/design.md`. Run in order, save outputs to `assets/raw/stitch/<section>/` (gitignored).

**Caveat:** Stitch outputs static frames. Motion is layered in code afterward — see `docs/motion.md`.

---

## Shared prompt header (paste before each section's brief)

```text
Design <SECTION_NAME> for "Pangpuriye" — a digital yearbook for Super AI
Engineer Season 6 cohort. Single-page scroll-snap full-viewport site in the
Studio Namma / Obys.agency school of editorial web design.

STRICT design system (use exactly):
  Background: #FAF7F2 cream with 5% film grain
  Text:       #1A1A1A charcoal primary, #4A4A4A secondary
  Hairlines:  #C9C5BE
  Accent:     #C1121F red — used SURGICALLY (max one big red word per slide,
              red on numbers/links/drop-caps only). 92% cream/charcoal.
  Gold rare:  #D4A373 — only on photo corner crop marks
  Display:    Space Grotesk 700 — clamp(56px, 9vw, 144px), tracking -0.03em
  Body:       Space Grotesk 400, 18px / 1.6
  Mono primary (quiet): IBM Plex Mono 400 — 13px captions, 14px inline
  Mono accent (loud):   PP Supply Mono uppercase — 12px eyebrows, tracking 0.18em
  Layout:     12-col desktop, 80px margin, 32px gutter, max 1440px

VIBE markers (must show all):
  - PP Supply Mono eyebrow above every title (e.g. "SEC.0X · <CODE>")
  - Drop cap on first paragraph (Space Grotesk 700, 5 lines tall, charcoal)
  - Photo with thin gold corner crop marks (4 small L-shapes)
  - IBM Plex Mono caption under every photo: "FIG.0X · <CODE> · <DATE>"
  - Number indicator top-right "0X / 07"
  - Hairline divider between major blocks
  - Generous negative space — confident, quiet, expensive

HARD NOs:
  - No gradients
  - No glassmorphism
  - No neon, no rainbow
  - No rounded buttons (corners 0–2px max)
  - No drop shadows on anything
  - No Material Design chips/cards
  - Photo treatment: high-contrast, slight grayscale OK, NO Instagram filters
  - No serifs anywhere — system is grotesk + dual-mono only

OUTPUT: 3 frames — desktop 1440×900, tablet 834×1194, mobile 390×844.
```

---

## Prompt #1 — Home (Hero)

(Append to shared header)

```text
SECTION: Home / Hero — first scroll-snap section, the cover.

Layout (desktop 16:9):
- Left 55% : huge serif-feeling title "HOUSE PANGPURIYE" stacked over 3 lines,
  with the middle word "PANGPURIYE" in #C1121F. Above title: tiny PP Supply
  Mono eyebrow "SS6 · LEVEL 2 · DIGITAL YEARBOOK · 2026". Below title: motto
  in Space Grotesk italic with a vertical gold #D4A373 left border. Below
  motto: two CTAs — solid charcoal "Enter Yearbook" + ghost outline "About
  the House". Both buttons have 0px corners.
- Right 45% : single full-bleed cohort hero photo (placeholder), framed inside
  a thin 1px charcoal border with 4 gold L-shape corner crop marks. Caption
  underneath in IBM Plex Mono small caps "FIG.01 · COHORT_PRIME · 2026.05".
- Top bar: P sigil top-left in red, slide indicator top-right "01 / 07" in
  PP Supply Mono uppercase, "MENU" trigger.
- Bottom: scroll cue centered — chevron + tiny label "Scroll to descend".

Responsive:
- Tablet portrait: photo above copy, title shrinks ~70%, CTAs full-width.
- Mobile: single column, photo first (full-width 4:5), then eyebrow / title /
  motto / CTAs stacked. Slide indicator moves to bottom right.
```

---

## Prompt #2 — About

```text
SECTION: About — two-column manifesto.

Layout (desktop):
- Header band: PP Supply Mono eyebrow "SEC.02 · ABOUT // PANG-A-001". Below:
  Space Grotesk 700 H2 "About House" sized clamp(40px, 6vw, 88px).
- Body: 7-col left = manifesto. First paragraph leads with a giant red drop
  cap (5 lines tall). Second paragraph standard body. Below: motto pull-quote
  with vertical gold left border + Space Grotesk italic.
- Aside: 5-col right = 2x2 grid of 4 small framed cards each labeled in PP
  Supply Mono — "ASSET: LOGO" / "ASSET: SYMBOL" / "ASSET: UNIFORM" / "DOC:
  SYS_REV". Each card aspect-ratio 1:1, charcoal hairline border, asset
  illustration centered, asset name below.

Responsive:
- Tablet: body stacks above aside; aside grid becomes 4-wide horizontal.
- Mobile: single column, aside grid 2x2 below body.
```

---

## Prompt #3 — Members

```text
SECTION: Members / Cohort Roster — full-bleed grid.

Layout (desktop):
- Header: PP Supply Mono eyebrow "SEC.03 · MEMBERS // PANGPURIYE_ROSTER_v1".
  H2 "Cohort Roster". Member count in IBM Plex Mono right-aligned ("6 members").
- Toolbar: 5 filter chips uppercase mono — "All" / "ML" / "NLP" / "CV" /
  "Ethics" / "GenAI". Active chip = solid charcoal bg, white text. Hover =
  red border.
- Grid: 4 columns desktop, 3 tablet, 2 large-mobile, 1 small-mobile. Each
  card ~360px tall.
  - Top strip: charcoal hairline border, mono row "ID: AIAT-00X" left + red
    "ACTIVE" right.
  - Photo: aspect 4:5, b&w grayscale.
  - Body: name in Space Grotesk 700 22px, nickname in mono 12px italic,
    slogan in Space Grotesk italic 14px. Below: AI interest tags as small
    bordered chips (one per interest).

Hover state (show 1 card hovered):
- Photo dims slightly
- ID strip background slides red C1121F left-to-right
- Card border becomes red

Responsive:
- Tablet: 3 cols.
- Mobile: 2 cols, gap reduces, card height shrinks proportionally.
```

---

## Prompt #4 — Red Wall (transition)

```text
SECTION: Red Wall — single full-bleed crimson slide. Sole exception to the
Red Sniper rule. Punctuation between Members and Gallery.

Layout:
- Background: solid #C1121F red, no grain
- Foreground: white #FAF7F2 cream text
- Single sentence centered, Space Grotesk 700, clamp(48px, 7vw, 96px),
  line-height 1.1: "We forged this house in code."
- Below sentence (gap 64px): PP Supply Mono uppercase tracking 0.3em,
  cream color: "— PANGPURIYE, 2026"
- No other elements. NO photo, NO chrome (top bar is on top of red but white).

Responsive: same single column, type clamps down. On mobile aim for ~36px
font for sentence to keep it on 2 lines max.
```

---

## Prompt #5 — Gallery

```text
SECTION: Gallery / House Activities — editorial photo grid.

Layout (desktop):
- Header: eyebrow "SEC.04 · GALLERY // /records/pangpuriye/2026". H2
  "House Activities". Right-aligned mono pills "QUERY: SUCCESS" + "42 RECORDS".
- First event divider: full-width hairline with mono left tag "SEC.ID:
  HACK-01" + center title "Lorem Hackathon Title" Space Grotesk 700 + right
  date.
- Featured grid: 8-col big photo (aspect 16:9, b&w) with overlay top-left
  carrying mono badge "OBJ.ID: 0001 · LOC: TBD". Caption below in mono. To the
  right (4-col): vertical stack of one smaller photo + house metrics card
  (two progress bars labeled "Models Shipped" + "Hackathons Joined", red
  fill).
- Second event divider, then asymmetric two-photo row (4 col tall portrait +
  8 col wide landscape).

Responsive:
- Tablet: photos stack to 6+6 and 12 wide.
- Mobile: all photos full-width, single column, captions below each.
```

---

## Prompt #6 — Recognition

```text
SECTION: Recognition / Hall of Fame — award trophy display.

Layout (desktop):
- Header: tiny eyebrow "DIRECTORY / HALL_OF_FAME". H2 "Recognition Archive".
  Lead paragraph below.
- 8-col hero award (large card, charcoal hairline border): mono code
  "AWD-XX-01" red, lightbulb icon outline. Title Space Grotesk 700 28px
  "Innovation Award". Description body. Two pill tags below.
- 4-col stacked: 2 smaller award cards, each with class badge "CLASS-X" red
  + medal icon + title + recipient line "Recipient: <name>".
- Below (12-col): 6+6 row.
  - 6-col Best Team Project card with progress bar.
  - 6-col Milestones numbered list (01/02), big red 01/02 numerals on left,
    title + description on right.

Responsive:
- Tablet: hero stays 8-col, secondary collapse below.
- Mobile: all cards stack single column.
```

---

## Prompt #7 — Clips

```text
SECTION: Clips / Knowledge Clips — featured + horizontal rail.

Layout (desktop):
- Header: eyebrow "SEC.06 · CLIPS // KB.LOG · VIDEO_ARCHIVE". H2
  "Knowledge Clips". Right-aligned mono "6 clips".
- Topic chips row (mono uppercase): All / LLM / Computer Vision / RL /
  MLOps / Ethics / Data.
- Featured clip block: 8-col 16:9 video frame thumbnail with red overlay
  badge "FEATURED" top-right + duration "12:34" bottom-right + center play
  button (charcoal disk, white triangle). Right 4-col: topic tag, date,
  title Space Grotesk 700, speaker line, lead paragraph.
- Horizontal scroll rail: 3-4 secondary clip cards visible, each with thumb
  + duration + topic chip + title + speaker + date. Cards 320px wide.

Responsive:
- Tablet: featured collapses to 12-col; rail shows 2.5 cards.
- Mobile: featured stacks (thumb above body); rail shows 1.5 cards, gives
  swipe affordance.
```

---

## Prompt #8 — Others (optional, generate last)

```text
SECTION: Others / Memes & Brainstorms — creative wall (optional).

Layout: 4-col bento on desktop with 6+ tiles of varying aspect ratio. Mix of
square, portrait, landscape. Each tile bg cream with charcoal hairline border,
mono label top-left ("MEME" or "BRAINSTORM" in red), playful caption below.
Sticky-note vibe — slight rotation on alternating tiles (-2° / +1° / -1°),
red push-pin dot top-center on a few.

Responsive: 2-col tablet, 1-col mobile (rotation removed for stack legibility).
```

---

## Workflow per prompt

1. Copy shared header + the section's prompt
2. Paste into Google Stitch
3. Export desktop / tablet / mobile frames
4. Save to `assets/raw/stitch/<section>/` (e.g. `01-home/`)
5. Review with Tew — iterate prompt 1–2× max if visuals miss
6. When locked, code the section: `components/sections/<Name>.tsx` + Tailwind utilities + per-section `.module.css` if bespoke CSS needed
7. Layer motion in via `useGSAP()` companion if interactive — see `docs/motion.md`
