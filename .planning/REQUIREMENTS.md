# Requirements: pangpuriye6

**Defined:** 2026-05-11
**Core Value:** Hand-crafted Awwwards-tier feel — must not lose to obys.agency by more than 30% on motion + editorial polish.

## v1 Requirements

Requirements for the cohort-ship release (~2026-06-08).

### Chrome (CHROME)

Site skeleton — scaffolding, configs, base UX layer. **Phase 01 — SHIPPED.**

- [x] **CHROME-01**: Next.js 16 + React 19 + Tailwind v4 + TypeScript scaffold runs (`npm run dev` → http://localhost:3000)
- [x] **CHROME-02**: Self-hosted Space Grotesk + IBM Plex Mono + PP Supply Mono via `next/font/google` + `next/font/local`
- [x] **CHROME-03**: Top bar — P sigil left, section spy `0X / 07` center, MENU trigger right
- [x] **CHROME-04**: Scroll-progress red hairline at top of viewport, width tracks scroll %
- [x] **CHROME-05**: Footer — © line + contact icons (email / GitHub / Instagram / YouTube)
- [x] **CHROME-06**: Single-page `app/page.tsx` composes 7 section components in order

### Motion (MOTION)

Scroll engine + interaction. **Phase 01 — SHIPPED.** Phase 07 layers WebGL on top.

- [x] **MOTION-01**: Lenis smooth scroll, `lerp: 0.06`, `wheelMultiplier: 0.9`, `syncTouch: false`
- [x] **MOTION-02**: SnapPaginator — JS-driven section pagination, `scrollTo` duration 1.6s `easeInOutQuart`, 400ms cooldown after settle
- [x] **MOTION-03**: One-gesture-per-section lock — wheel/touch events `preventDefault`'d during animation; trackpad inertia bursts collapsed to single snap
- [x] **MOTION-04**: Edge-aware overflow — tall sections (Members / Gallery / Recognition / Others) allow native Lenis scroll inside until top/bottom edge, then snap
- [x] **MOTION-05**: Custom magnetic cursor — 8px charcoal dot + 40px outline ring lerping, `mix-blend-mode: difference` (visible against red)
- [ ] **MOTION-06**: GSAP ScrollTrigger reveals on section enter — split-letter H2 fade-up (stagger 30ms), body copy fade-up after 60ms, photo clip-path inset reveal 800ms
- [ ] **MOTION-07**: Magnetic CTA — `[data-magnetic]` elements pull ring 60px radius on mouseenter
- [ ] **MOTION-08**: Tier-B WebGL — Hero scroll-driven sequence using `public/blendr-t*.jpeg` (7 frames), `prefers-reduced-motion` gated
- [ ] **MOTION-09**: Tier-B WebGL — Member-card hover ripple shader via OGL
- [ ] **MOTION-10**: Tier-B WebGL — Gallery hero RGB-shift on snap-into-view via OGL

### Design (DESIGN)

Visual contract before code. **Phase 02 — gates Phases 03–06.**

- [ ] **DESIGN-01**: Stitch prompt #1 (Home) — desktop 1440 / tablet 834 / mobile 390 frames exported, reviewed, locked
- [ ] **DESIGN-02**: Stitch prompt #2 (About) — same 3 frames
- [ ] **DESIGN-03**: Stitch prompt #3 (Members) — same
- [ ] **DESIGN-04**: Stitch prompt #4 (Red Wall) — same
- [ ] **DESIGN-05**: Stitch prompt #5 (Gallery) — same
- [ ] **DESIGN-06**: Stitch prompt #6 (Recognition) — same
- [ ] **DESIGN-07**: Stitch prompt #7 (Clips) — same

### Home (HOME)

Section 01 — editorial cover. **Phase 03.**

- [x] **HOME-01**: Hero scaffold renders with placeholder data (Pangpuriye red word, eyebrow, motto, two CTAs)
- [ ] **HOME-02**: Hero coded to locked Stitch frames — title typography + photo frame + corner crop marks + caption + scroll cue
- [ ] **HOME-03**: Hero photo reveal animation on mount (clip-path inset 800ms)
- [ ] **HOME-04**: Hero scroll-driven sequence (Tier B WebGL, MOTION-08)

### About (ABOUT)

Section 02 — manifesto. **Phase 04.**

- [x] **ABOUT-01**: About scaffold renders manifesto + 4-card aside (Logo / Symbol / Uniform / Motto)
- [ ] **ABOUT-02**: Coded to locked Stitch frames — drop cap, motto pull-quote with gold left border
- [ ] **ABOUT-03**: Reveal animations on scroll-into-view

### Members (MEMBERS)

Section 03 — cohort grid. **Phase 04.**

- [x] **MEMBERS-01**: Members grid with filter chips (ML / NLP / CV / Ethics / GenAI) — chips render, no filter logic yet
- [x] **MEMBERS-02**: Member card renders all form fields — fullname, nickname, slogan, AI skill, AI interests, other skills, contact icons (mail / phone / video / GitHub / LinkedIn)
- [x] **MEMBERS-03**: Single mock card with `MOCK` badge when `aiat_id === '000000'` and only 1 entry
- [ ] **MEMBERS-04**: Filter chip click filters cards live (`is-active` state + URL `?filter=ml`)
- [ ] **MEMBERS-05**: Coded to locked Stitch frames — photo treatment + ID strip slide-red hover
- [ ] **MEMBERS-06**: Member-card WebGL ripple hover (Tier B, MOTION-09)

### Red Wall (REDWALL)

Section TR — transition slide. **Phase 04.**

- [x] **REDWALL-01**: Full-bleed crimson slide renders with quote + attribution
- [ ] **REDWALL-02**: Curtain wipe transition entering/exiting Red Wall (700ms cubic-bezier)
- [ ] **REDWALL-03**: Quote split-letter reveal on snap-into-view

### Gallery (GALLERY)

Section 04 — house activities. **Phase 05.**

- [x] **GALLERY-01**: Gallery scaffold renders with placeholder slots
- [ ] **GALLERY-02**: Coded to locked Stitch frames — featured photo + 4-col vertical stack + horizontal rail
- [ ] **GALLERY-03**: Photo clip-path reveals on scroll-into-view
- [ ] **GALLERY-04**: Gallery hero RGB-shift WebGL (Tier B, MOTION-10)

### Recognition (RECOG)

Section 05 — awards + milestones. **Phase 05.**

- [x] **RECOG-01**: Recognition scaffold renders 1 hero award + secondary stack + milestone list
- [ ] **RECOG-02**: Coded to locked Stitch frames

### Clips (CLIPS)

Section 06 — YouTube knowledge clips. **Phase 05.**

- [x] **CLIPS-01**: Clips scaffold renders featured + topic chips + secondary placeholder
- [ ] **CLIPS-02**: Coded to locked Stitch frames
- [ ] **CLIPS-03**: Featured clip auto-plays muted on snap-into-view
- [ ] **CLIPS-04**: Horizontal-scroll rail for secondary clips

### Others (OTHERS)

Section 07 — optional creative wall. **Phase 06.**

- [x] **OTHERS-01**: Others scaffold renders bento layout
- [ ] **OTHERS-02**: Sticky-note rotation on alternating tiles (-2° / +1° / -1°)
- [ ] **OTHERS-03**: Toggleable via `placeholderSiteData.others.enabled`

### Data (DATA)

Content pipeline + API integration. **Phase 04+ as needed.**

- [x] **DATA-01**: `lib/api.ts` Server-side fetcher with placeholder fallback chain (live API → public/data/*.json → in-memory)
- [x] **DATA-02**: `public/data/{members,gallery,clips,recognition,about,hero,red-wall}.json` editable templates
- [x] **DATA-03**: `public/api-config.json` mode flag (`placeholder` | `live`), no URL leak
- [ ] **DATA-04**: Live API integration verified — `NEXT_PUBLIC_API_BASE_URL` set, `mode: live`, members + gallery hydrate from real endpoint
- [ ] **DATA-05**: ETag / cache headers on JSON template files via `vercel.json`

### Menu (MENU)

Full-screen overlay menu, triggered by TopBar's MENU button. **Phase 02 (Stitch frame) + Phase 03 (code).**

- [ ] **MENU-01**: MENU button in TopBar opens full-screen overlay (curtain wipe down)
- [ ] **MENU-02**: Overlay shows section list `01 / HOME`, `02 / ABOUT`, ... in big serif
- [ ] **MENU-03**: Overlay shows contact info (email + social links) at bottom
- [ ] **MENU-04**: Click section item → overlay closes + SnapPaginator scrollTo that section
- [ ] **MENU-05**: ESC key closes overlay; click backdrop closes overlay
- [ ] **MENU-06**: Built with Headless UI `Disclosure` for keyboard nav + ARIA states

### Member Modal (MODAL)

Member card click opens detail modal with full bio + all contacts + intro video.

- [ ] **MODAL-01**: Member card click opens HU `Dialog` with full member detail
- [ ] **MODAL-02**: Modal shows larger photo, full name, nickname, slogan, AI skill, all AI interests, all contacts, intro video link
- [ ] **MODAL-03**: ESC key + backdrop click + close button all dismiss modal
- [ ] **MODAL-04**: Focus trapped inside modal while open
- [ ] **MODAL-05**: Modal works keyboard-only (Tab cycles inside, Shift+Tab reverses)
- [ ] **MODAL-06**: Mobile: modal becomes full-screen sheet

### Theme (THEME)

Light + dark theme toggle. Light = Red Sniper (cream/charcoal). Dark = inverted (charcoal/cream). Red and gold stay identical across themes.

- [ ] **THEME-01**: Light theme is default (matches existing `app/globals.css` tokens)
- [ ] **THEME-02**: Dark theme inverts cream ↔ charcoal; red and gold tokens unchanged
- [ ] **THEME-03**: Theme toggle lives in MenuOverlay (visible only when overlay open)
- [ ] **THEME-04**: Choice persists in `localStorage` as `pangpuriye6-theme: light|dark|system`
- [ ] **THEME-05**: Initial render respects `prefers-color-scheme` if no user choice stored
- [ ] **THEME-06**: Theme swap takes <100ms, no flash of unstyled content
- [ ] **THEME-07**: All photo treatments work on both bg colors (grayscale photos look fine on both)

### Accessibility (A11Y)

- [x] **A11Y-01**: `prefers-reduced-motion: reduce` disables Lenis + SnapPaginator (page falls back to native scroll)
- [x] **A11Y-02**: Keyboard nav — Arrow Up/Down, PageUp/Down, Space, Home, End — paginate
- [x] **A11Y-03**: All contact icons have `aria-label` + `title` attrs
- [ ] **A11Y-04**: Skip-to-content link in top bar for screen readers
- [ ] **A11Y-05**: Focus-visible outline on all interactive elements (CTA buttons, filter chips, contact icons)

### Performance (PERF)

- [ ] **PERF-01**: Lighthouse Performance ≥ 85 on production URL
- [ ] **PERF-02**: Lighthouse Accessibility ≥ 90 on production URL
- [ ] **PERF-03**: Lighthouse Best Practices ≥ 90 on production URL
- [ ] **PERF-04**: First Contentful Paint < 1.5s on 4G
- [ ] **PERF-05**: Largest Contentful Paint (Hero photo) preloaded via `next/image` `priority`
- [ ] **PERF-06**: Tier-B WebGL disabled on viewport < 480px or reduced-motion (battery savings)

### Security (SEC)

- [x] **SEC-01**: AIAT internal URL gitignored — `api/`, `swagger.json`, `api_guide.md`, `.env.local` all excluded from public repo
- [x] **SEC-02**: API key model — env-var only (`NEXT_PUBLIC_API_BASE_URL`, `API_AUTH_VALUE`); `.env.local` gitignored; `.env.example` ships with placeholders
- [x] **SEC-03**: Vercel headers — `X-Content-Type-Options nosniff`, `X-Frame-Options DENY`, `Referrer-Policy strict-origin-when-cross-origin`, `Permissions-Policy` locks camera/mic/geo
- [ ] **SEC-04**: PP Supply Mono — Space Mono swap branch pre-staged in case of Pangram takedown

### Ship (SHIP)

- [ ] **SHIP-01**: Vercel preview deploy passes on every push to non-main branch
- [ ] **SHIP-02**: Vercel production deploy at `pangpuriye6.vercel.app` (greenlight from Tew)
- [ ] **SHIP-03**: Smell test — site opened beside obys.agency in two tabs, doesn't lose by more than 30%

## v2 Requirements

Deferred. Tracked but not in v1 roadmap.

### Live cohort data

- **DATA-v2-01**: Real cohort photos integrated (shot day after bootcamp Week 3)
- **DATA-v2-02**: Live API pulls all members + gallery + clips at production
- **DATA-v2-03**: Real-time member additions via webhook from AIAT API

### Awwwards SOTD push

- **MOTION-v2-01**: Page-transition curtain wipe between section groups (700ms cubic-bezier)
- **MOTION-v2-02**: Cream noise shader background (replaces static SVG grain)
- **MOTION-v2-03**: Audio-reactive WebGL on Red Wall slide
- **MOTION-v2-04**: Magnetic cursor scales on text hover (read affordance)

## Out of Scope

| Feature | Reason |
|---------|--------|
| CMS / admin dashboard | JSON templates + git editing covers content. Avoids ops cost. |
| Server-side auth / member-only routes | Site is fully public, no login. |
| i18n / Thai translation | Explicit EN-only rule. |
| Native mobile app | Responsive web is enough. |
| Analytics beyond Vercel built-in | Out of scope unless team asks |
| Comments / member chat / social features | Yearbook is read-only. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CHROME-01–06 | Phase 01 | ✅ Shipped |
| MOTION-01–05 | Phase 01 | ✅ Shipped |
| MEMBERS-01–03 | Phase 01 | ✅ Shipped (scaffold) |
| DATA-01–03 | Phase 01 | ✅ Shipped |
| SEC-01–03 | Phase 01 | ✅ Shipped |
| A11Y-01–03 | Phase 01 | ✅ Shipped |
| DESIGN-01–07 | Phase 02 | Pending |
| HOME-02–03 | Phase 03 | Pending |
| ABOUT-02–03 | Phase 04 | Pending |
| MEMBERS-04–05 | Phase 04 | Pending |
| REDWALL-02–03 | Phase 04 | Pending |
| GALLERY-02–03 | Phase 05 | Pending |
| RECOG-02 | Phase 05 | Pending |
| CLIPS-02–04 | Phase 05 | Pending |
| OTHERS-02–03 | Phase 06 | Pending |
| MOTION-06–07 | Phase 03–06 | Pending |
| MENU-01–06 | Phase 02 (frame) + 03 (code) | Pending |
| MODAL-01–06 | Phase 02 (frame) + 04 (code) | Pending |
| THEME-01–07 | Phase 02 (frames doubled) + 03 (toggle wiring) | Pending |
| MOTION-08–10, HOME-04, MEMBERS-06, GALLERY-04 | Phase 07 (Tier B WebGL) | Pending |
| DATA-04–05 | Phase 04 + 08 | Pending |
| A11Y-04–05 | Phase 08 | Pending |
| PERF-01–06 | Phase 08 | Pending |
| SEC-04 | Phase 08 | Pending |
| SHIP-01–03 | Phase 08 | Pending |

**Coverage:**
- v1 requirements: 70 total (was 51, +19 from MENU + MODAL + THEME)
- Mapped to phases: 70
- Unmapped: 0 ✅

---
*Requirements defined: 2026-05-11 (gsd retrofit)*
*Last updated: 2026-05-11 — Phase 01 completed before gsd workflow imported*
