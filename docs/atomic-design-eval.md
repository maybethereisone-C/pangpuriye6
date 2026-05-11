# Atomic Design — Evaluation for pangpuriye6

**Date:** 2026-05-10
**Question:** Should pangpuriye6 use Atomic Design (Brad Frost methodology)? Should we adopt the danilowoz/react-atomic-design boilerplate?
**Verdict:** **No to both.** Use **CUBE CSS** instead, with a lightweight component layer borrowing atomic vocabulary (atoms/molecules) only where it earns its keep. Details below.

---

## 1. What is Atomic Design?

Brad Frost (2013) — a methodology for organizing UI into a five-tier hierarchy:

| Tier | What lives there | Example |
|---|---|---|
| **Atoms** | Indivisible UI primitives | Button, input, label, icon, color token |
| **Molecules** | Atoms combined for one purpose | Search bar (input + button + label) |
| **Organisms** | Molecules + atoms forming distinct UI sections | Header (logo + nav molecule + search molecule) |
| **Templates** | Page-level layout articulating content structure | Homepage skeleton without real content |
| **Pages** | Templates with real content + state | Logged-in homepage with real user data |

The chemistry analogy is a mental scaffold for "build small things first, compose upward." It's framework-agnostic — Brad Frost paired it with **Pattern Lab** (his static site generator), not React.

## 2. What it helps with

- **Design-system thinking** — forces explicit "what's reusable" vs "what's bespoke" decisions
- **Cross-team handoff** — designers and developers share vocabulary
- **Storybook-friendly** — atoms and molecules become natural "stories" in isolation
- **Component documentation** — clear taxonomy maps to a documentable hierarchy

## 3. What it costs

- **Ceremony tax** — every UI bit gets a tier label, even if it's used once
- **Premature abstraction** — tempts devs to make atoms "configurable" before they need to be, exploding prop surface
- **Folder explosion** — `atoms/Button/Button.tsx + Button.module.css + Button.stories.js + Button.test.js` × 50 atoms = 200 files for trivial UI
- **Editorial / bespoke design fights it** — when each page is meant to be visually distinct (think Studio Namma, Obys, magazine sites), forcing component reuse starves the design of identity
- **Templates tier is muddy** — in practice teams skip it or rename it
- **The chemistry metaphor is leaky** — a button with a tooltip is a "molecule" but a `<button>` with an inline `<svg>` icon is also a "molecule" by a strict reading. Spend time arguing tier boundaries instead of shipping.

## 4. What is danilowoz/react-atomic-design?

Source: https://github.com/danilowoz/react-atomic-design — a 2017-era React boilerplate demonstrating Atomic Design principles.

**Stack:** Webpack · Babel (ES2015 preset) · Flow types · Storybook · CSS Modules · Autoprefixer · ESLint · Prettier.

**Status assessment (2026-05-10):**

- **Stale stack**. Flow types are effectively dead — community migrated to TypeScript years ago. Webpack 4-era setup. Babel preset-es2015 is ancient.
- **Storybook overkill** for a 7-section yearbook site that has no design system to externalize.
- **React-coupled**. Our project is vanilla HTML/CSS/JS. The boilerplate's atomic structure is encoded in JSX component imports — porting it to vanilla would mean re-implementing every concept while losing the boilerplate's main value (working examples).
- **Educational value still useful.** The README is a clear explainer of how the five tiers map to a React folder layout. Worth reading once, not worth cloning.

**Verdict on the repo:** Don't use as a starting point. It's a teaching artifact, not a production starter. Read the README, internalize the vocabulary, move on.

### Are there better atomic-design starters?

If we were in React land, more current options would be:

- **Bulletproof React** — feature-folder structure, not strictly atomic, but Brad Frost-influenced
- **Refine.dev** + atomic folders — modern, TypeScript, MUI-ready (but heavyweight)
- **shadcn/ui pattern** — radically simpler than atomic. Components copied into your repo, owned, modified freely. The dominant 2025–2026 React idiom.

None of these apply here — we're not in React.

## 5. Why Atomic Design is the wrong fit for pangpuriye6

| Criterion | Atomic Design | Reality of pangpuriye6 |
|---|---|---|
| **Project size** | Best for 50+ unique components | We have ~10–15 reusable components (button, chip, photo-frame, member-card, eyebrow, drop-cap, cursor, progress-bar, photo-overlay, clip-card, award-card). Five tiers is too granular. |
| **Component reuse rate** | High — atoms reused 50+ times | Low — most "components" appear in 1–2 sections only. The section IS the unit. |
| **Per-section uniqueness** | Discouraged — atomic pushes toward consistency | Required — Awwwards aesthetic depends on sections feeling DIFFERENT. Hero ≠ Members ≠ Gallery in motion, layout, photo treatment. |
| **Framework fit** | Best with React/Vue (boundary-enforced via component imports) | Vanilla HTML/CSS/JS — we'd be enforcing tiers via folder discipline only, costly with no boundary enforcement |
| **Team size** | Designed for cross-team handoff (designers + multiple devs) | Solo build by Tew, ~1 month |
| **Design-system maturity goal** | Build a documented system | Goal is the SHIPPED yearbook; docs are secondary |

The honest truth: atomic design optimizes for the wrong axis here. Our axis is **per-section bespoke editorial polish**. Atomic optimizes for **cross-section component consistency**. Wrong tool.

## 6. Better methodology — CUBE CSS

Andy Bell (2020), https://cube.fyi/ — **C**omposition · **U**tility · **B**lock · **E**xception.

| CUBE layer | What it is | Maps to in our stack |
|---|---|---|
| **C — Composition** | Macro layout / spacing primitives that compose blocks | `snap.css`, `base.css` reset + grid + scroll-snap shell |
| **U — Utility** | Single-purpose tokenized classes (color, spacing, type-scale) | `tokens.css` + utility classes derived from CSS vars |
| **B — Block** | Self-contained components, BEM-named | `components/*.css` — button, chip, photo-frame, member-card, etc. |
| **E — Exception** | Local rule-breakers, scoped via `data-*` attributes | Per-section `sections/*.css` — overrides for that section's bespoke needs |

**Why CUBE wins for us:**

1. **Built for the cascade**, not against it. Vanilla CSS friendly. No build step required.
2. **Embraces tokens** (already locked in `tokens.css`).
3. **Explicit "Exception" layer** means bespoke per-section design isn't a code smell — it's a first-class concept.
4. **Smaller surface area** — four layers vs five tiers, and the layers map directly to CSS file roles.
5. **Doesn't need Storybook** — works in plain HTML rendered by `python3 -m http.server`.
6. **2020-era + still relevant** — Andy Bell's writing is current, methodology mature.

**What we keep from atomic design:**

- The vocabulary "atom / molecule / organism" is useful in conversation. We'll informally call buttons "atoms" and photo-frames "molecules" without enforcing the taxonomy in folders.
- The instinct to **build the smallest reusable thing first**. A hero is composed of: photo-frame + drop-cap + button + eyebrow + progress-bar. Build those before the hero.

## 7. Concrete folder structure (replaces plan §6 styles/ section)

```text
projects/pangpuriye6/styles/
├── tokens.css                    # design tokens (CUBE: Utility — palette, type, space, breakpoints)
├── base.css                      # reset, global typography, cream bg + grain (CUBE: Composition + Block primitives)
├── snap.css                      # scroll-snap shell, section sizing (CUBE: Composition)
├── utilities.css                 # token-derived utility classes (CUBE: Utility)
├── components/                   # reusable Blocks (CUBE: Block layer)
│   ├── button.css
│   ├── chip.css                  # filter chip for Members & Clips
│   ├── photo-frame.css           # gold corner-mark photo frame
│   ├── eyebrow.css               # mono section eyebrow
│   ├── drop-cap.css              # first-paragraph drop cap
│   ├── cursor.css                # custom magnetic cursor
│   ├── progress-bar.css          # red hairline scroll progress
│   ├── photo-overlay.css         # tag overlays on gallery photos
│   ├── member-card.css
│   ├── clip-card.css
│   └── award-card.css
└── sections/                     # per-section Blocks + Exceptions
    ├── 01-home.css
    ├── 02-about.css
    ├── 03-members.css
    ├── 04-gallery.css
    ├── 05-recognition.css
    ├── 06-clips.css
    ├── 07-others.css
    └── tr-red-wall.css
```

Naming convention:
- **BEM** for blocks: `.member-card`, `.member-card__id-strip`, `.member-card--featured`
- **Section overrides** scoped via attribute: `[data-section="03-members"] .member-card` — keeps section-specific tweaks in `sections/` not `components/`

## 8. Decision summary

- ❌ **Don't use Atomic Design as a methodology** — wrong fit for editorial bespoke + small component count + vanilla stack
- ❌ **Don't clone danilowoz/react-atomic-design** — stale stack, React-coupled, educational only
- ✅ **Use CUBE CSS** as primary CSS organization methodology
- ✅ **Borrow Atomic vocabulary informally** — "atom" / "molecule" as conversation shortcuts, not folder enforcement
- ✅ **Components live in `styles/components/`** — flat, BEM-named, one file per block (already a small upgrade vs plan §6's monolithic `components.css`)
- ✅ **Sections live in `styles/sections/`** — handle per-section Exceptions

## 9. Sources

| Source | URL | Used for |
|---|---|---|
| Brad Frost — Atomic Design Methodology Ch.2 | https://atomicdesign.bradfrost.com/chapter-2/ | Definition of atoms / molecules / organisms / templates / pages |
| Brad Frost — Tools of the Trade Ch.3 | https://atomicdesign.bradfrost.com/chapter-3/ | Pattern Lab + responsive testing context |
| danilowoz/react-atomic-design | https://github.com/danilowoz/react-atomic-design | Stack assessment + boilerplate evaluation |
| LogRocket — Atomic Design in React Native | https://blog.logrocket.com/atomic-design-react/ | Modern (2024) practitioner perspective |
| Andy Bell — CUBE CSS | https://piccalil.li/blog/cube-css/ | Recommended alternative methodology |
| CUBE CSS docs | https://cube.fyi/ | Official methodology reference |
| ITCSS (Harry Roberts) | https://itcss.io/ | Compared briefly — CUBE wins for our scale |
