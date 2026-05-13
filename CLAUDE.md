# pangpuriye6 — Claude Code Charter

Mirror of `AGENTS.md` (Codex charter). Same guardrails, Claude-specific notes added.

---

## Operating guardrails

- Frontend work only. Do not touch backend, deploy, CI/CD, Kubernetes, Docker, or API contract files unless Tew explicitly names the file.
- Protected backend/deploy files (commits `79c4c512` + `41eae86b`): `.dockerignore`, `Dockerfile`, `k8s/`, `pipeline/`, `next.config.ts`. Stop and confirm before touching these.
- 95% confidence rule: if intent on scope, copy, color, behavior, or implementation is below 95%, ask before acting.
- No silent feature additions. Build only what was asked.
- Research from official docs / existing code patterns first. No guessing best practices.

---

## What we're building

Single-page **JS-paginated full-viewport** digital yearbook for **Pangpuriye** (Super AI Engineer Season 6, Level 2, AIAT).

Awwwards-tier editorial design — Studio Namma / Obys.agency DNA. "Red Sniper" palette: 92% cream/charcoal, red surgical. English-only copy.

Stack: **Next.js 16 App Router · React 19 · TypeScript strict · Tailwind v4 · GSAP · Lenis · OGL**

Required sections: Home · About · Members · Gallery · Recognition · Clips · Others (optional)

Ambition: Tier B → Awwwards Honorable Mention. Tier A ships week 2. WebGL layered weeks 3–4.

---

## Locked decisions — do not re-litigate without team consensus

| Domain | Value |
|---|---|
| Framework | Next.js 16 App Router · React 19 · TypeScript strict |
| Styling | Tailwind v4 — CSS-first via `@theme` in `globals.css`. No `tailwind.config.ts`. |
| CSS methodology | CUBE CSS. NOT Atomic Design. |
| Layout | Full-viewport sections, JS-paginated via `SnapPaginator.tsx`. CSS scroll-snap OFF. Tall sections allow Lenis scroll inside until edge then snap. |
| Motion | GSAP + ScrollTrigger via `useGSAP()`. Lenis smooth scroll. Magnetic cursor. |
| WebGL | OGL (Phase 07+) |
| Palette | `#FAF7F2` cream · `#1A1A1A` charcoal · `#C1121F` red · `#780000` red-deep · `#D4A373` gold · `#4A4A4A` gray-700 · `#C9C5BE` gray-300 |
| Display font | Space Grotesk variable 300–700 via `next/font/google` |
| Mono font | IBM Plex Mono 400 + 400-italic via `next/font/google` |
| Roster data | `src/lib/site-data.ts` placeholder → API in Phase 04 |
| Backend | Internal API. `NEXT_PUBLIC_API_BASE_URL` in `.env.local` (gitignored). |

---

## Refactor task — `new/` folder (active work)

**First prompt context (2026-05-13):** Refactor entire codebase to plain HTML · CSS · Vanilla JS. Goals: readable structure, clean vanilla JS, UX/UI/animation/design preserved, responsive design verified on all devices.

**Rules:**
- Do NOT delete old files first.
- All refactored files go into `new/` folder.
- Wait for Tew to say **"Go"** before swapping `new/` into root and removing old files.
- Never auto-remove without explicit permission.

---

## Next.js patterns

- Sections = Server Components by default. Motion components only are `'use client'`.
- Async: `params`, `searchParams`, `cookies()`, `headers()` must be `await`ed (Next.js 16).
- Fonts: CSS vars `--font-display-loaded` (Space Grotesk), `--font-mono-loaded` (IBM Plex Mono).
- Images: always `next/image`, never `<img>`. `priority` on LCP.
- GSAP: `useGSAP()` always. Never raw `useEffect` for GSAP. Single Lenis RAF loop via `MotionProvider`.

---

## Dev workflow (per section)

1. Read `docs/design.md` §3.5 + matching prompt in `docs/stitch-prompts.md`
2. Stitch → export 3 frames: 1440 / 834 / 390
3. Lock visuals → code section component
4. `npm run dev` → verify at 1440 / 834 / 390
5. `npm run typecheck && npm run lint` clean
6. Atomic commit per section

---

## Project rules

1. Confirm before ambiguous scope. Ask.
2. No silent scope expansion.
3. Test UI in browser: 390 / 834 / 1440.
4. Read before edit. Grep callers before modifying a function.
5. No local machine paths — all refs relative to repo root.
6. `api/` is gitignored. Never commit `api_guide.md`, `swagger.json`, or credentials.

---

## Verification checklist (v1 ship)

1. `npm install && npm run dev` → localhost:3000 loads clean
2. Cream cover with red "Pangpuriye" renders in Hero
3. Scroll snaps through all 7 sections with Lenis
4. All sections render placeholder content from `site-data.ts`
5. Responsive at 390 / 834 / 1440
6. GSAP text reveals fire on section enter
7. Custom cursor visible desktop, magnetic on `[data-magnetic]`
8. `npm run build` clean; `npm run start` serves prod
9. `npm run typecheck && npm run lint` clean
10. Vercel preview 200; prod approved by team lead
11. Repo public, MIT, README + LICENSE.fonts.md present
12. Smell test: open beside obys.agency — loses by < 30%?
13. Lighthouse: Performance ≥ 85 · Accessibility ≥ 90 · Best Practices ≥ 90

---

## Success definition

Opens next to obys.agency without making the team flinch. Ships before bootcamp ends (~2026-06-08).
