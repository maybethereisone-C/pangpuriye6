# Roadmap: pangpuriye6

## Overview

A 4-week journey from scaffold to cohort-ready Awwwards-tier yearbook site. Phase 01 (Scaffold) was shipped manually before gsd workflow retrofitted on 2026-05-11 — Phases 02–08 follow full gsd ceremony. Target ship: ~2026-06-08 (Super AI Engineer S6 bootcamp end).

## Phases

- [x] **Phase 1: Scaffold** - Next.js 16 scaffold, motion engine, data pipeline, repo
- [ ] **Phase 2: Stitch Design Pass** - Lock visual frames for 7 sections in Google Stitch
- [ ] **Phase 3: Home + Global Motion** - Hero coded + GSAP reveals + magnetic CTAs
- [ ] **Phase 4: About + Members + Red Wall** - Sections 02, 03, TR coded
- [ ] **Phase 5: Gallery + Recognition + Clips** - Sections 04, 05, 06 coded
- [ ] **Phase 6: Others (optional)** - Section 07 creative wall
- [ ] **Phase 7: Tier-B WebGL** - Scroll-driven sequence, ripple shader, RGB-shift
- [ ] **Phase 8: Perf + A11y + Ship** - Lighthouse targets, production deploy

## Phase Details

### Phase 1: Scaffold
**Goal**: Working Next.js 16 single-page yearbook scaffold with motion engine, data pipeline, public repo, and locked design tokens.
**Depends on**: Nothing (first phase)
**Requirements**: CHROME-01, CHROME-02, CHROME-03, CHROME-04, CHROME-05, CHROME-06, MOTION-01, MOTION-02, MOTION-03, MOTION-04, MOTION-05, MEMBERS-01, MEMBERS-02, MEMBERS-03, DATA-01, DATA-02, DATA-03, SEC-01, SEC-02, SEC-03, A11Y-01, A11Y-02, A11Y-03
**Success Criteria** (what must be TRUE):
  1. `npm run dev` boots http://localhost:3000 without errors
  2. All 7 sections render from placeholder data
  3. SnapPaginator + Lenis paginate sections with 1.6s easeInOutQuart glide
  4. Tall sections (Members, Gallery, Recognition, Others) allow internal scroll until edge
  5. Public GitHub repo at maybethereisone-C/pangpuriye6 with zero leaked URLs
**Plans**: 5 plans (retroactively imported from git history + decisions log)

Plans:
- [x] 01-01: Next.js + Tailwind config + scaffold
- [x] 01-02: Section components (Hero / About / Members / Red Wall / Gallery / Recognition / Clips / Others)
- [x] 01-03: Motion engine (MotionProvider / SnapPaginator / Cursor / ProgressBar / TopBar)
- [x] 01-04: Data pipeline (lib/api.ts + JSON templates + env-driven URL)
- [x] 01-05: Privacy + license decisions (gitignore api/, PP Supply trial risk accepted, Space Mono swap branch staged)

### Phase 2: Stitch Design Pass
**Goal**: Visual frames for all 7 sections locked in Google Stitch (desktop 1440, tablet 834, mobile 390) — frames become the bar for Phases 3–6 implementation. No production code written this phase, only design exports.
**Depends on**: Phase 1
**Requirements**: DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04, DESIGN-05, DESIGN-06, DESIGN-07
**Success Criteria** (what must be TRUE):
  1. `assets/raw/stitch/01-home/`, `02-about/`, `03-members/`, `tr-red-wall/`, `04-gallery/`, `05-recognition/`, `06-clips/` each contain desktop + tablet + mobile frame exports
  2. Each section's frames passed Tew's review (max 2 iterations per section)
  3. `docs/stitch-prompts.md` updated with the final prompt that produced each lock
  4. Design tokens used in Stitch match `app/globals.css` exactly (palette, type, grid)
  5. No code in `app/` or `components/` modified during this phase
**Plans**: 3 plans

Plans:
- [ ] 02-01: Stitch prompts 1–4 (Home, About, Members, Red Wall) — generate, iterate, lock
- [ ] 02-02: Stitch prompts 5–7 (Gallery, Recognition, Clips) — generate, iterate, lock
- [ ] 02-03: Stitch prompt 8 (Others creative wall) — optional, only if time

### Phase 3: Home + Global Motion
**Goal**: Hero section coded to locked Stitch frames + global GSAP reveal patterns established (split-letter H2, body fade-up, magnetic CTAs) so Phases 4–6 reuse them.
**Depends on**: Phase 2
**Requirements**: HOME-02, HOME-03, MOTION-06, MOTION-07
**Success Criteria** (what must be TRUE):
  1. Hero matches locked Stitch frames pixel-close at 1440 / 834 / 390 widths
  2. H2 split-letter reveal fires on every section enter (not just Hero)
  3. Body copy fade-up runs 60ms after H2 with stagger
  4. Photo clip-path inset reveal animates over 800ms cubic-bezier
  5. `[data-magnetic]` elements pull the cursor ring 60px on mouseenter
**Plans**: 3 plans

Plans:
- [ ] 03-01: Hero coded to locked Stitch frames
- [ ] 03-02: GSAP ScrollTrigger reveals abstracted into reusable hooks
- [ ] 03-03: Magnetic CTA + cursor refinement

### Phase 4: About + Members + Red Wall
**Goal**: Sections 02 (About), 03 (Members), and TR (Red Wall) coded to Stitch lock. Members filter chips functional. Live AIAT API integration verified.
**Depends on**: Phase 3
**Requirements**: ABOUT-02, ABOUT-03, MEMBERS-04, MEMBERS-05, REDWALL-02, REDWALL-03, DATA-04
**Success Criteria** (what must be TRUE):
  1. About manifesto renders with drop cap + 4-card aside (Logo / Symbol / Uniform / Motto)
  2. Members filter chips filter cards live with URL state (?filter=ml)
  3. Member card hover slides ID strip red left-to-right
  4. Red Wall curtain-wipe transition (700ms cubic-bezier) on entry + exit
  5. With `NEXT_PUBLIC_API_BASE_URL` set + `mode: live`, members hydrate from real API
**Plans**: 4 plans

Plans:
- [ ] 04-01: About coded to Stitch
- [ ] 04-02: Members coded + filter logic
- [ ] 04-03: Red Wall coded + curtain wipe
- [ ] 04-04: Live API verification

### Phase 5: Gallery + Recognition + Clips
**Goal**: Sections 04, 05, 06 coded to Stitch lock. Tier-A motion complete (excluding WebGL).
**Depends on**: Phase 4
**Requirements**: GALLERY-02, GALLERY-03, RECOG-02, CLIPS-02, CLIPS-03, CLIPS-04
**Success Criteria** (what must be TRUE):
  1. Gallery renders featured photo + vertical stack + horizontal-scroll rail
  2. All gallery photos animate clip-path inset reveal on scroll-into-view
  3. Recognition shows 1 hero award + 3 secondary + numbered milestone list per Stitch frame
  4. Clips section auto-plays featured YouTube embed muted on snap-into-view
  5. Horizontal-scroll rail of secondary clips works on touch + mouse-drag + wheel
**Plans**: 3 plans

Plans:
- [ ] 05-01: Gallery coded
- [ ] 05-02: Recognition coded
- [ ] 05-03: Clips coded

### Phase 6: Others (optional)
**Goal**: Optional creative wall section. Bento layout with sticky-note rotation. Skippable if Phase 5 runs over.
**Depends on**: Phase 5
**Requirements**: OTHERS-02, OTHERS-03
**Success Criteria** (what must be TRUE):
  1. Others section renders bento grid with alternating -2° / +1° / -1° tile rotation
  2. Section is toggleable via `placeholderSiteData.others.enabled = true|false`
  3. Section is the 8th snap target when enabled, hidden when disabled
**Plans**: 1 plan

Plans:
- [ ] 06-01: Others coded + toggle

### Phase 7: Tier-B WebGL
**Goal**: Awwwards-tier WebGL effects layered on Tier-A complete site. Stretch goal — gated by remaining time budget; drop if behind.
**Depends on**: Phase 5
**Requirements**: MOTION-08, MOTION-09, MOTION-10, HOME-04, MEMBERS-06, GALLERY-04
**Success Criteria** (what must be TRUE):
  1. Hero scroll-driven sequence uses `public/blendr-t*.jpeg` frames as `scrollY` progresses 0–100vh
  2. Member-card hover triggers OGL ripple shader, restricted to viewport ≥480px and prefers-reduced-motion: no-preference
  3. Gallery hero RGB-shift fires on snap-into-view, one-shot per visit
  4. All WebGL canvases pause when `document.hidden` or section out of viewport
  5. WebGL bundle adds ≤ 15 KB gzipped to the initial JS payload
**Plans**: 3 plans

Plans:
- [ ] 07-01: Hero scroll-driven sequence (OGL canvas)
- [ ] 07-02: Member-card ripple shader
- [ ] 07-03: Gallery hero RGB-shift

### Phase 8: Perf + A11y + Ship
**Goal**: Production-ready. Lighthouse targets hit. Vercel production deploy.
**Depends on**: Phase 6, Phase 7 (or Phase 5 if 6+7 dropped)
**Requirements**: A11Y-04, A11Y-05, PERF-01, PERF-02, PERF-03, PERF-04, PERF-05, PERF-06, SEC-04, SHIP-01, SHIP-02, SHIP-03
**Success Criteria** (what must be TRUE):
  1. Lighthouse on production URL: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90
  2. First Contentful Paint < 1.5s on 4G simulation
  3. Skip-to-content link visible on Tab from top of page
  4. All interactive elements show focus-visible outline
  5. Space Mono swap branch staged + tested (PP Supply Mono takedown insurance)
  6. Production URL `pangpuriye6.vercel.app` responds 200 with cache headers
  7. Smell test passed: opened beside obys.agency in two tabs, doesn't lose by >30%
**Plans**: 4 plans

Plans:
- [ ] 08-01: A11y audit (skip-link, focus-visible, axe-core sweep)
- [ ] 08-02: Perf pass (LCP image preload, font preload, bundle analysis, dead code elimination)
- [ ] 08-03: Space Mono swap branch ready
- [ ] 08-04: Production deploy + smell test

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Scaffold | 5/5 | ✅ Complete | 2026-05-11 |
| 2. Stitch Design Pass | 0/3 | Not started | - |
| 3. Home + Global Motion | 0/3 | Not started | - |
| 4. About + Members + Red Wall | 0/4 | Not started | - |
| 5. Gallery + Recognition + Clips | 0/3 | Not started | - |
| 6. Others (optional) | 0/1 | Not started | - |
| 7. Tier-B WebGL | 0/3 | Not started | - |
| 8. Perf + A11y + Ship | 0/4 | Not started | - |

---
*Roadmap defined: 2026-05-11 (gsd retrofit)*
*Phase 1 was shipped manually before gsd workflow imported. Phases 2–8 follow full gsd ceremony.*
