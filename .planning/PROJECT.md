# pangpuriye6

## What This Is

A single-page JS-paginated full-viewport digital yearbook for the **Pangpuriye** cohort of Super AI Engineer Season 6 Level 2 (AIAT). Awwwards-tier editorial site in the Studio Namma / Obys.agency school of web design — handcrafted motion, restraint-first red palette, grotesk + dual-mono typography, EN-only copy. Deployed publicly to Vercel.

## Core Value

**The site must feel hand-crafted, not AI-generated.** When opened next to obys.agency, it cannot lose by more than 30% on motion fidelity or editorial polish. Every section pull-quote, transition, and photo treatment is judged by that bar.

## Requirements

### Validated

<!-- Shipped and confirmed in commits 305eaaf → eb66c29. -->

- ✅ **CHROME-01**: Next.js 16 + React 19 + Tailwind v4 + TypeScript strict scaffold builds and runs (`npm run dev`)
- ✅ **CHROME-02**: Self-hosted fonts (Space Grotesk + IBM Plex Mono OFL + PP Supply Mono trial) load via `next/font/google` + `next/font/local`
- ✅ **MOTION-01**: Lenis smooth scroll initialized with `lerp: 0.06` + `syncTouch: false`
- ✅ **MOTION-02**: JS-driven section paginator (no native CSS scroll-snap) — one gesture per section, 1.6s `easeInOutQuart` glide, 400ms cooldown
- ✅ **MOTION-03**: Edge-aware overflow — tall sections (Members / Gallery / Recognition / Others) allow native scroll inside until top/bottom edge, then snap to next
- ✅ **MOTION-04**: Custom magnetic cursor + scroll progress hairline + top-bar section spy
- ✅ **DATA-01**: Server-side fetcher (`lib/api.ts`) — reads `public/api-config.json` mode flag, env-driven `NEXT_PUBLIC_API_BASE_URL`, graceful placeholder fallback chain
- ✅ **DATA-02**: Per-card JSON templates in `public/data/` (members, gallery, clips, recognition, about, hero, red-wall) — editable without code change
- ✅ **DATA-03**: Single mock placeholder when no API + no JSON data (aiat_id `000000` → `MOCK` badge, hides on real data)
- ✅ **SEC-01**: AIAT internal URL + API contract gitignored — `api/` folder, `swagger.json`, `api_guide.md`, `.env.local`. Public repo audited zero-leak.

### Active

<!-- Phase 02 → Phase 08 scope. -->

- [ ] **DESIGN-01**: Stitch design pass for all 7 sections — desktop / tablet / mobile frames locked
- [ ] **HOME-01**: Hero coded to Stitch lock — title + photo + corner crop marks + scroll cue + reveal animations
- [ ] **HOME-02**: Tier-B WebGL — Hero scroll-driven sequence using `public/blendr-t*.jpeg` (7 frames)
- [ ] **ABOUT-01**: About — 4-card aside (Logo / Symbol / Uniform / Motto) + manifesto with drop cap
- [ ] **MEMBERS-01**: Members grid with filter chips (ML / NLP / CV / Ethics / GenAI)
- [ ] **MEMBERS-02**: Member-card WebGL ripple hover (Tier B)
- [ ] **REDWALL-01**: Red Wall full-bleed crimson transition slide
- [ ] **GALLERY-01**: Gallery editorial photo grid + horizontal-scroll rail
- [ ] **GALLERY-02**: Gallery hero RGB-shift WebGL on snap-into-view (Tier B)
- [ ] **RECOG-01**: Recognition awards (1 hero + 3 secondary) + milestones numbered list
- [ ] **CLIPS-01**: Clips featured YouTube embed + horizontal rail of secondary clips + topic chips
- [ ] **OTHERS-01**: Others creative wall — bento, sticky-note rotation (optional, last)
- [ ] **A11Y-01**: `prefers-reduced-motion: reduce` disables Lenis + paginator + WebGL
- [ ] **A11Y-02**: Keyboard nav — Arrow keys / PageUp/Down / Space / Home / End — works
- [ ] **PERF-01**: Lighthouse Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90 on prod URL
- [ ] **SHIP-01**: Vercel production deploy at `pangpuriye6.vercel.app` (greenlight gate)

### Out of Scope

- **CMS** — `lib/api.ts` + `public/data/*.json` covers content updates without a CMS. Avoids backend ops cost.
- **Server-side auth / member-only routes** — site is fully public, no login.
- **Admin dashboard** — content edited via JSON template files committed to git.
- **i18n / Thai translation** — explicit EN-only rule. Brief is bilingual but cohort site is EN.
- **Native mobile app** — responsive web is enough.
- **Analytics beyond Vercel built-in** — out of scope unless team asks.
- **Comments / member chat / social features** — yearbook is read-only.

## Context

- **Cohort window**: 2026-05-08 → 2026-06-08 (Super AI Engineer S6 L2 bootcamp). Site ships before window closes.
- **Audience**: Cohort members + AIAT staff + public portfolio viewers (eventually employers).
- **Backend reality**: AIAT internal API exists; current uptime is patchy (live endpoint returned 502 during scaffold). Site must work as standalone static even if backend is dead.
- **Photography**: Real cohort photos not yet shot. Placeholders used Phases 02–06. Hot-swap once shoot done.
- **Roster data**: Cohort members not all known yet. Form submissions roll in during bootcamp. JSON templates editable per-member.
- **Prior art**: `projects/pangpuriye-site/` (separate, scroll-bento style) is explicitly out of scope per Tew. Different design language.
- **Reference DNA**: https://studionamma.com + https://obys.agency — the editorial-motion bar to hit.

## Constraints

- **Tech stack**: Next.js 16 App Router + React 19 + Tailwind v4 + TypeScript strict — locked. Decision logged in `/Users/tew/Desktop/tos/decisions/log.md` (2026-05-10 entry: stack pivot from vanilla).
- **CSS methodology**: CUBE CSS (Composition · Utility · Block · Exception). NOT Atomic Design. See `docs/atomic-design-eval.md`.
- **Motion libs**: Lenis (smooth scroll) + GSAP + ScrollTrigger (motion) + OGL (Tier B WebGL, not three.js). All via npm, no CDN.
- **Fonts**: Space Grotesk + IBM Plex Mono (both OFL — commercial-safe). PP Supply Mono (Pangram trial — license-risk accepted, see `decisions/log.md`).
- **Language**: English only. Even though AIAT cohort form is bilingual, rendered site stays EN.
- **Color**: "Red Sniper" — 92% cream/charcoal, red surgical. One Red Wall slide is the sole exception (full-bleed red).
- **Timeline**: ~4 weeks from 2026-05-11 to 2026-06-08. Tier A motion ships week 2. Tier B WebGL is stretch — gate weekly.
- **Privacy**: No internal URLs / API keys / private docs committed to public repo. Memory rule active (`~/.claude/projects/-Users-tew-Desktop-tos/memory/feedback_no_leaked_data.md`).
- **Deploy gate**: Production deploy to `pangpuriye6.vercel.app` requires explicit Tew greenlight.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Stack: Next.js 16 + React 19 (not vanilla) | Skill-leverage for AI-engineer career > raw motion ceiling. Tew chose explicitly after tradeoff briefing. | ✓ Shipped scaffold |
| CSS methodology: CUBE not Atomic Design | Editorial bespoke + 10–15 components + solo dev = wrong fit for Atomic's tier ceremony. CUBE's Exception layer legitimizes per-section bespoke. | ✓ Folder structure done |
| Fonts: Space Grotesk + IBM Plex Mono + PP Supply Mono (trial) | First two OFL safe. PP Supply trial license-risk accepted by Tew. Standby Space Mono swap branch staged. | ⚠️ Revisit if Pangram takedown |
| Color story: "Red Sniper" (92% cream/charcoal, surgical red) | Closest to Obys/Namma restraint. One Red Wall slide is allowed exception. | ✓ Token-locked |
| Layout: JS paginator (not CSS scroll-snap) | One-gesture lock + edge-aware overflow for tall sections. Native CSS snap fights animated scrollTo. | ✓ SnapPaginator shipped |
| Brand: "Pangpuriye" not "House Pangpuriye" | Tew's explicit rule. Even in code, comments, and docs. | ✓ Globally renamed |
| Content: 1 mock card by default | UX clarity — empty state has signal (MOCK badge), API data hides mock. | ✓ Logic in Members.tsx |
| Backend URL: env-var only, never committed | Privacy rule — internal AIAT endpoint stays out of public repo. | ✓ `.env.local` gitignored |

---
*Last updated: 2026-05-11 after gsd retrofit (Phase 01 already shipped manually before gsd ceremony).*
