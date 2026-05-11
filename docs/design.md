# pangpuriye6 — Design System

**Status:** Phase-01 spec, lifted from approved plan §3 + Next.js stack pivot.
**Source of truth:** This file. When code drifts from this, update this file or the code — don't let them disagree.

---

## 1. Vibe (one paragraph)

A scroll-snap full-viewport editorial yearbook in the **Studio Namma / Obys.agency** school. Cream paper, surgical red, dual-mono typography, generous negative space, hand-tuned motion. Each section is a standalone "spread" — visually distinct, never a repeat of the previous template. Restraint everywhere except one Red Wall punctuation slide between Members and Gallery. Built like a designer-craft site, not a generic AI-template site.

---

## 2. Color

### 2.1 Tokens

```css
--color-ink-cream:       #FAF7F2;  /* primary background — warm ivory paper */
--color-ink-charcoal:    #1A1A1A;  /* primary text */
--color-ink-gray-700:    #4A4A4A;  /* body / secondary text */
--color-ink-gray-300:    #C9C5BE;  /* hairlines, dividers */
--color-accent-red:      #C1121F;  /* the surgical red — house theme */
--color-accent-red-deep: #780000;  /* hover / pressed states, drop shadows */
--color-accent-gold:     #D4A373;  /* RARE — corner crop marks ONLY */
```

### 2.2 The Red Sniper rule

**92% of any frame = cream + charcoal + gray hairlines. Red is surgical.**

Red appears in:

- Section numbers (`SEC.01`)
- One big red word per slide max (e.g. `PANGPURIYE` in Hero)
- Link hovers + active filter chip backgrounds
- Drop-cap first letter of each section's first paragraph
- Page-progress hairline at top of viewport (1px)
- Member-card ID strip on hover
- The **Red Wall** punctuation slide between Members → Gallery (sole exception — that whole slide is full-bleed red)

Red does NOT appear in: backgrounds, body copy, secondary buttons, photo treatments. If you're tempted to add a red drop-shadow or red border to a card, stop — you've broken the rule.

---

## 3. Typography

### 3.1 Families

| Role | Family | Source | Loaded via |
|---|---|---|---|
| Display + Body | **Space Grotesk** (variable 300–700) | Google Fonts (OFL-1.1) | `next/font/google` |
| Mono primary (quiet) | **IBM Plex Mono** 400 + 400-italic | Google Fonts (OFL-1.1) | `next/font/google` |
| Mono accent (loud) | **PP Supply Mono** | Pangram Pangram (trial) | `next/font/local` after manual download |

CSS variables wired by `next/font`:

- `--font-display-loaded` — Space Grotesk
- `--font-mono-loaded` — IBM Plex Mono
- `--font-mono-accent-loaded` — PP Supply Mono (after Phase 02)

### 3.2 Scale

| Token | Value | Where it's used |
|---|---|---|
| `--text-hero-min` / `--text-hero-max` | 56px / 144px (clamp 9vw) | H1 in Hero |
| `--text-h2-min` / `--text-h2-max` | 40px / 88px (clamp 6vw) | Section headings |
| `--text-lead` | 22px / 1.5 | Section lead paragraph |
| `--text-body` | 18px / 1.6 | Body copy |
| `--text-mono-body` | 14px / 1.5 | Inline mono text |
| `--text-mono-caption` | 13px / 1.4 | Photo captions, IDs |
| `--text-eyebrow` | 12px / 1.0, tracking 0.18em, uppercase | Section eyebrows |

### 3.3 Rules

- All-caps **PP Supply Mono** for "loud" mono moments: section eyebrows (`SEC.01 · MEMBERS // PANGPURIYE_ROSTER_v1`), top-bar `01 / 07` indicator, full-bleed transition labels.
- **IBM Plex Mono** for "quiet" mono: photo captions, member ID strings, metadata, code snippets if any.
- **Drop cap** on first paragraph of every section (Space Grotesk 700, charcoal, ~5 lines tall).
- Pull-quotes / mottoes set in **Space Grotesk italic** (Space Grotesk has no native italic — use synthetic italic OR small-caps `font-variant-caps: all-small-caps` for a more editorial feel; pick per section, document the choice).
- NEVER use mono for long body. NEVER use a serif anywhere — system is grotesk + dual-mono only.
- **Pairing rule:** PP Supply Mono and IBM Plex Mono must NEVER touch in the same line. Always separated by Space Grotesk body or whitespace block.

---

## 4. Layout grid

```text
Desktop  (≥1024px): 12 col, 80px outer margin, 32px gutter, max-width 1440px
Tablet   (768–1023): 8 col, 40px margin, 24px gutter
Mobile   (<768)    : 4 col, 24px margin, 16px gutter
```

CSS variables:

```css
--grid-margin-desktop: 80px;
--grid-margin-tablet:  40px;
--grid-margin-mobile:  24px;
--grid-gutter-desktop: 32px;
--grid-gutter-tablet:  24px;
--grid-gutter-mobile:  16px;
--grid-max-width:      1440px;
```

Visible grid for design QA: append `?grid=1` to URL to render 1px column hairlines (Phase 03 implementation).

---

## 5. Scroll-snap shell

Implemented in `app/globals.css`:

```css
html {
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  height: 100%;
}

section[data-section] {
  height: 100svh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  position: relative;
  overflow: hidden;
}
```

`100svh` (small viewport height) handles iOS Safari URL bar correctly.

`scroll-snap-stop: always` forces the browser to stop on every section — cannot fly past with fast scroll.

Sections taller than viewport (Members grid, Gallery list) override `height: 100svh` to `min-height: 100svh; height: auto` so they scroll naturally inside the snap stop, then snap to the next section on exit.

---

## 6. Motion

### 6.1 Tier A (ship by week 2)

| Effect | Implementation |
|---|---|
| Smooth scroll | Lenis, `lerp: 0.1`, `smoothWheel: true`, `syncTouch: false` |
| Section enter | GSAP ScrollTrigger; H2 split-letter fade-up (stagger 30 ms), body copy fade-up 60 ms after H2 |
| Photo reveal | clip-path `inset(0 100% 0 0)` → `inset(0 0 0 0)`, 800 ms `cubic-bezier(0.65, 0, 0.35, 1)` |
| Custom cursor | 8px charcoal dot follows mouse, 40px outline ring lerps with 0.18 |
| Magnetic CTA | `[data-magnetic]` elements pull cursor 60 px radius |
| Page progress | 1px red bar, top of viewport, `scaleX` = scroll % |
| Top bar section spy | `01 / 07` indicator updates via IntersectionObserver |
| Underline draw | Links draw underline left→right 250 ms `ease-out` on hover |

All motion is gated by `prefers-reduced-motion: reduce` — if the user opts out, Lenis disables, scroll-snap disables, GSAP timelines fast-forward to end state.

### 6.2 Tier B (weeks 3–4)

| Effect | Library | Notes |
|---|---|---|
| Hover ripple on member cards | OGL fragment shader | One shader, attached on `[data-magnetic]` photo containers |
| RGB-shift glitch on Gallery hero | OGL | Triggered on snap-into-view, plays once |
| Curtain wipe between section groups | GSAP timeline | Hero→About and Recognition→Clips |
| Hero scroll-driven sequence | GSAP ScrollTrigger | Maps `scrollY` 0–100vh to `blendr-t00.jpeg` ... `blendr-t17.jpeg` (7 frames) |
| Cream noise shader bg | OGL | Replaces static SVG grain with very slow-drifting WebGL noise |

WebGL is disabled when `(prefers-reduced-motion: reduce)` OR viewport `< 480px` (mobile battery savings).

---

## 7. Components (CUBE: Block layer)

The site has ~10 reusable Blocks beyond per-section organisms:

| Block | File | Purpose |
|---|---|---|
| Button | inside Hero / About | Primary (charcoal) + ghost (outlined) — Tailwind utilities, no separate component yet |
| Chip | inside Members / Clips | Filter chip — Phase 03 promotion |
| Photo frame | inside Hero | Aspect-ratio box + 4 gold L-shape corner crop marks + caption |
| Eyebrow | inside every section | All-caps mono `SEC.0X · <CODE>` line |
| Drop cap | inside every section | First-letter big serif on first paragraph |
| Cursor | `components/motion/Cursor.tsx` | Custom magnetic cursor |
| Progress bar | `components/motion/ProgressBar.tsx` | Top hairline scroll % |
| Top bar | `components/blocks/TopBar.tsx` | P sigil + section spy + menu trigger |
| Footer | `components/blocks/Footer.tsx` | Contacts + credit |
| Member card | inside `Members.tsx` | ID strip + photo + name + slogan + interest tags |

Promote inline blocks to standalone files when used in 2+ places. Don't pre-extract.

---

## 8. Per-section vibe brief (REQUIRED reading before Stitch prompts)

| # | Section | Slide vibe | Hero element | Red moment |
|---|---|---|---|---|
| 01 | Home | Editorial cover. Big serif title left, b&w photo right with corner crop marks | "PANGPURIYE" — middle word red | The word PANGPURIYE |
| 02 | About | Two-column manifesto. Long body left, House Symbol + Logo + Uniform + Motto stack right (4 small framed cards) | House motto in italic | Section number `SEC.02` + drop cap |
| 03 | Members | Full-bleed grid 6/8/12 members (responsive). Hover: ripple + ID strip slides red | Filter chips for AI interests | ID strip on hover, active chip bg |
| TR | Red Wall | Single full-bleed crimson slide with white grotesk quote. Sole exception to Sniper rule. | One sentence: `"We forged this house in code."` | Entire slide |
| 04 | Gallery | Editorial photo grid + horizontal-scroll rail. Captions in mono, locations as overlay tags | Featured photo full-bleed first viewport | Photo overlay tag accents, caption code IDs |
| 05 | Recognition | Award trophy display. Hero award left (large), 3 secondary right stacked. Numbered milestone list below | "Innovation Award" hero card | Award class badge, milestone numbers |
| 06 | Clips | Featured YouTube embed left, horizontal rail of secondary clips right. Topic chips above | Featured clip auto-plays on snap-into-view (muted) | Topic chip active state, play button hover |
| 07 | Others | Optional — AI Memes + Project Brainstorms creative wall. Bento-ish, off-grid | (skip until 6 done) | Sticky note red flags |

---

## 9. Verification (smell test)

When a section is "done", open it next to obys.agency in two browser tabs. Ask:

1. Does ours feel quieter or louder than Obys at rest? (Should feel quieter — we're more editorial, less WebGL-heavy.)
2. Does the type breathe? (Tracking, line-height, paragraph width — read it out loud.)
3. Does motion feel hand-tuned or stock? (If easings feel like default `ease-in-out`, retune.)
4. Is there ONE moment per section that feels surprising? (A drop cap, a clip-path reveal, a magnetic CTA, a red word.)
5. Does the section work at 390px width? (Most Awwwards sites half-fail mobile — we don't.)

If 4/5 are yes, ship the section. If 3/5 or below, iterate.
