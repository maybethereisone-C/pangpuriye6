# Roadmap: pangpuriye6

**Milestone:** v1 — cohort-ready ship
**Target ship date:** ~2026-06-08 (Super AI Engineer S6 bootcamp end)
**Granularity:** Standard
**Parallelization:** Enabled (wave-based via gsd-executor)

---

## Phase Timeline

```text
Phase 01 ✅ Scaffold + Repo + Decisions       [SHIPPED 2026-05-10..11]
Phase 02 ⏳ Stitch Design Pass (7 sections)    [next up, ~3 days]
Phase 03 ⏳ Home + global motion polish        [~2 days]
Phase 04 ⏳ About + Members + Red Wall          [~4 days]
Phase 05 ⏳ Gallery + Recognition + Clips       [~3 days]
Phase 06 ⏳ Others (optional)                   [~1 day]
Phase 07 ⏳ Tier-B WebGL upgrades                [~4 days, stretch]
Phase 08 ⏳ Perf + a11y + ship                  [~2 days]

Total: ~19 days of focused work in a 28-day window.
```

---

## Phase 01 — Scaffold + Decisions ✅ DONE

**Status:** SHIPPED (retroactively imported into gsd).
**Commits:** 305eaaf, 918c4d0, 1ff01f7, eb66c29 (4 commits, ~60 files, ~10,400 LOC)

**Requirements satisfied:**
- CHROME-01 through CHROME-06
- MOTION-01 through MOTION-05
- MEMBERS-01 through MEMBERS-03 (scaffold)
- HOME-01 (scaffold)
- ABOUT-01, REDWALL-01, GALLERY-01, RECOG-01, CLIPS-01, OTHERS-01 (scaffolds)
- DATA-01 through DATA-03
- SEC-01 through SEC-03
- A11Y-01 through A11Y-03

**Plans (already executed, retrofit):**
- 01-01: Next.js + Tailwind config + scaffold
- 01-02: Section components (Hero / About / Members / Red Wall / Gallery / Recognition / Clips / Others)
- 01-03: Motion engine (MotionProvider / SnapPaginator / Cursor / ProgressBar / TopBar)
- 01-04: Data pipeline (lib/api.ts + JSON templates + env-var URL)
- 01-05: Privacy + license decisions (gitignore api/, Pangram trial accepted, swap branch staged)

---

## Phase 02 — Stitch Design Pass

**Goal:** Lock visual design for all 7 sections in Google Stitch before code. Frames define the bar for Phases 03–06.

**Requirements:**
- DESIGN-01 through DESIGN-07

**Plans:**
- 02-01: Run Stitch prompts 1–4 (Home, About, Members, Red Wall) — iterate with Tew, lock frames
- 02-02: Run Stitch prompts 5–7 (Gallery, Recognition, Clips) — iterate, lock frames
- 02-03: Optional Stitch prompt 8 (Others creative wall)

**Verification:** Three frame sizes per section (desktop 1440, tablet 834, mobile 390) saved to `assets/raw/stitch/<section>/`. Tew greenlights each before locking.

**Depends on:** Phase 01.

---

## Phase 03 — Home + Global Motion Polish

**Goal:** Hero section coded to Stitch lock. Global motion details (GSAP reveals, magnetic CTAs) shipped.

**Requirements:**
- HOME-02, HOME-03
- MOTION-06 (split-letter reveals), MOTION-07 (magnetic CTA)

**Plans:**
- 03-01: Hero coded to locked Stitch frames — typography, photo frame, caption, scroll cue, mobile reveal
- 03-02: GSAP ScrollTrigger reveals on every section H2 + body
- 03-03: Magnetic CTA — `[data-magnetic]` pull ring effect

**Depends on:** Phase 02 (Home locked).

---

## Phase 04 — About + Members + Red Wall

**Goal:** Sections 02–03 + TR transition coded. Members filter logic live.

**Requirements:**
- ABOUT-02, ABOUT-03
- MEMBERS-04, MEMBERS-05
- REDWALL-02, REDWALL-03
- DATA-04 (live API verification)

**Plans:**
- 04-01: About coded to Stitch — manifesto + 4-card aside
- 04-02: Members coded — filter chip logic, card hover (ID strip slides red)
- 04-03: Red Wall coded — curtain wipe in/out + split-letter quote reveal
- 04-04: Live API integration — set NEXT_PUBLIC_API_BASE_URL, switch mode to "live", verify members + gallery hydrate

**Depends on:** Phase 03 (motion patterns established).

---

## Phase 05 — Gallery + Recognition + Clips

**Goal:** Sections 04–06 coded. Tier-A complete (excluding WebGL).

**Requirements:**
- GALLERY-02, GALLERY-03
- RECOG-02
- CLIPS-02, CLIPS-03, CLIPS-04

**Plans:**
- 05-01: Gallery coded — featured photo + vertical stack + horizontal rail + clip-path reveals
- 05-02: Recognition coded — hero award + secondary stack + numbered milestone list
- 05-03: Clips coded — featured YouTube + topic chips + horizontal rail + auto-play-on-snap

**Depends on:** Phase 04.

---

## Phase 06 — Others (optional)

**Goal:** Optional creative wall section. Skip if Tew opts out, ship if time permits.

**Requirements:**
- OTHERS-02, OTHERS-03

**Plans:**
- 06-01: Others coded — bento layout, sticky-note rotation, toggleable via `placeholderSiteData.others.enabled`

**Depends on:** Phase 05. Skippable.

---

## Phase 07 — Tier-B WebGL Upgrades

**Goal:** Awwwards-tier WebGL effects layered on top of Tier-A complete site. Stretch goal — drop if week 3+ still in Phase 06.

**Requirements:**
- MOTION-08 (Hero scroll-driven sequence)
- MOTION-09 (Member-card ripple)
- MOTION-10 (Gallery hero RGB-shift)
- HOME-04, MEMBERS-06, GALLERY-04

**Plans:**
- 07-01: Hero scroll-driven sequence — OGL canvas pulls `blendr-t*.jpeg` frames as scroll progresses 0–100vh
- 07-02: Member-card hover ripple shader (OGL fragment shader, gated on viewport >= 480px + no reduced-motion)
- 07-03: Gallery hero RGB-shift on snap-into-view (OGL, one-shot)

**Depends on:** Phase 05 (Gallery shipped). Gated by Tier-B time budget.

---

## Phase 08 — Perf + A11y + Ship

**Goal:** Production-ready. Lighthouse targets hit. Vercel prod deploy.

**Requirements:**
- A11Y-04, A11Y-05
- PERF-01 through PERF-06
- SEC-04 (Space Mono standby ready)
- SHIP-01, SHIP-02, SHIP-03

**Plans:**
- 08-01: Skip-to-content + focus-visible outlines + a11y audit (axe-core)
- 08-02: LCP image preload, font preload, dead-code elimination, bundle analysis
- 08-03: Space Mono swap branch staged + tested
- 08-04: Vercel preview deploys verified on every push, production deploy with greenlight, smell test beside obys.agency

**Depends on:** Phases 06 + 07 (or just 06 if 07 dropped).

---

## Risk Register

| Risk | Mitigation | Severity |
|------|-----------|----------|
| Pangram takedown for PP Supply Mono | Space Mono swap branch pre-staged (Phase 08-03). 30-min hot fix. | Medium |
| Cohort photo shoot slips past Week 4 | Editorial b&w stock placeholders → hot-swap later | Low |
| Tier B WebGL exceeds 1-month window | Tier A alone ships safely. Phase 07 gated weekly — drop if behind. | Medium |
| Bootcamp work eats motion-tuning hours | Tier A is the safe ship. Aim for week 2 ship-readiness. | Medium |
| Live AIAT API stays 502 | `lib/api.ts` graceful fallback chain. Site works fully standalone. | Low |
| GSAP fights React Strict Mode | Use `@gsap/react`'s `useGSAP()` exclusively. No raw `useEffect` + GSAP. | Low |
| Vercel deploy gates require token | Plan/discuss/execute don't ship to prod without Tew's manual `vercel --prod`. | Low |

---

## Auto-advance settings

- `workflow.research`: true — Phases 02+ get gsd-phase-researcher before planning
- `workflow.plan_check`: true — gsd-plan-checker validates each PLAN.md before execution
- `workflow.verifier`: true — gsd-verifier confirms each phase delivers
- `workflow.nyquist_validation`: true — auto-generated tests per phase requirement
- `workflow.parallelization`: true — independent plans inside a phase run as a wave

---
*Roadmap defined: 2026-05-11 (gsd retrofit)*
*Phase 01 was shipped before gsd workflow imported. Phases 02–08 follow full gsd ceremony.*
