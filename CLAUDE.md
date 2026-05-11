# pangpuriye6 — Project Charter (Claude Code)

This file is the project-level AI charter for Claude Code. Read it at every session start. `AGENTS.md` is the Codex equivalent.

---

## What we're building

A single-page **JS-paginated full-viewport** digital yearbook for **Pangpuriye** (Super AI Engineer Season 6, Level 2, AIAT). Awwwards-tier editorial web design — **Studio Namma / Obys.agency** school: handcrafted motion, restraint-first red palette ("Red Sniper" — 92% cream/black, red surgical), grotesk + dual-mono typography. **English-only copy.** Built on **Next.js 16 App Router · React 19 · Tailwind v4 · GSAP · Lenis · OGL**. Tier B ambition: **Awwwards Honorable** (Tier A ships week 2, WebGL layered weeks 3–4). Required sections per AIAT brief: **Home · About · Members · Gallery · Recognition · Clips · Others (optional)**. Public GitHub + public Vercel.

---

## Locked decisions — do not re-litigate without team consensus

| Domain | Locked value |
|---|---|
| Framework | **Next.js 16** App Router · React 19 · TypeScript strict |
| Styling | **Tailwind v4** (CSS-first config via `@theme` in `src/app/globals.css`, no `tailwind.config.ts`) |
| CSS methodology | CUBE CSS (Composition · Utility · Block · Exception). NOT Atomic Design. See `docs/atomic-design-eval.md`. |
| Layout | Full-viewport sections paginated by `src/components/motion/SnapPaginator.tsx` (JS-driven). CSS scroll-snap intentionally OFF — JS engine owns scroll. Tall sections (Members / Gallery / Recognition / Others) allow native Lenis scroll inside until top/bottom edge, then snap to next/prev. |
| Motion | GSAP + ScrollTrigger via `@gsap/react`'s `useGSAP()` hook. Lenis for smooth scroll. Custom magnetic cursor. |
| WebGL (Phase 07+) | OGL (lighter than three.js) |
| Reference DNA | studionamma.com + obys.agency |
| Ambition tier | Tier B (Tier A ships week 2, WebGL on top weeks 3–4) |
| Color story | "Red Sniper" — 92% cream/charcoal, red surgical |
| Palette | `#FAF7F2` cream · `#1A1A1A` charcoal · `#C1121F` red · `#780000` red-deep · `#D4A373` gold (corner crops only) · `#4A4A4A` gray-700 · `#C9C5BE` gray-300 |
| Display + body | Space Grotesk variable 300–700 via `next/font/google` (OFL) |
| Mono primary | IBM Plex Mono 400 + 400-italic via `next/font/google` (OFL) |
| Mono accent | IBM Plex Mono (same as mono primary — no third font) |
| Photos | Placeholders now, real cohort photos added weeks 3–4 |
| Roster data | `src/lib/site-data.ts` placeholder, hydrated from API in Phase 04 |
| Backend | Internal API. Base URL in `.env.local` as `NEXT_PUBLIC_API_BASE_URL` (gitignored — never commit). Contract docs in local-only `api/` folder (gitignored). |
| Repo | Public github.com/maybethereisone-C/pangpuriye6, MIT license |

If a change would override any of the above, **stop and confirm with the team** before proceeding.

---

## Asset inventory (local fixtures — do not modify)

| Path | What it is | How we use it |
|---|---|---|
| `api/api_guide.md` (gitignored) | Internal API endpoint contract — local only, never commit | Reference for `src/lib/api.ts` fetcher |
| `api/swagger.json` (gitignored) | OpenAPI/Swagger spec — local only, never commit | Source of truth for response schemas |
| `public/blendr.mp4` | 17-second video, ~9 MB | Hero scroll-driven sequence asset |
| `public/blendr-t00.jpeg` … `public/blendr-t17.jpeg` | Frame extracts at 0/2/5/8/11/14/17 sec | Pre-extracted scroll-sequence frames for hero |

---

## Folder structure (canonical)

```text
.
├── src/
│   ├── app/
│   │   ├── layout.tsx              # root html, fonts, MotionProvider mount
│   │   ├── page.tsx                # composes the 7 sections + chrome
│   │   └── globals.css             # CUBE Utility (tokens) + Composition (reset, base type)
│   ├── components/
│   │   ├── motion/                 # 'use client' — GSAP/Lenis lifecycle
│   │   │   ├── MotionProvider.tsx  # Lenis init, GSAP ticker bridge
│   │   │   ├── SnapPaginator.tsx   # JS scroll engine
│   │   │   ├── Cursor.tsx          # custom magnetic cursor
│   │   │   └── ProgressBar.tsx     # red hairline scroll progress
│   │   ├── blocks/                 # reusable Blocks (CUBE)
│   │   │   ├── TopBar.tsx          # 'P' sigil + section spy + menu trigger
│   │   │   └── Footer.tsx
│   │   └── sections/               # one Block + Exception per section
│   │       ├── Hero.tsx
│   │       ├── About.tsx
│   │       ├── Members.tsx
│   │       ├── RedWall.tsx
│   │       ├── Gallery.tsx
│   │       ├── Recognition.tsx
│   │       ├── Clips.tsx
│   │       └── Others.tsx
│   └── lib/
│       ├── api.ts                  # AIAT API fetcher
│       └── site-data.ts            # placeholder content + TS types
├── public/
│   ├── fonts/                      # self-hosted fonts (trial fonts gitignored)
│   ├── data/                       # JSON data files served at runtime
│   ├── blendr.mp4                  # hero scroll-sequence video
│   └── blendr-t*.jpeg              # hero frame extracts
├── api/                            # AIAT API contract docs (gitignored, local only)
├── docs/                           # design specs, motion notes, font research
├── k8s/                            # Kubernetes manifests
├── pipeline/                       # CI/CD pipeline definitions
├── CLAUDE.md                       # this file
├── AGENTS.md                       # Codex equivalent of this file
├── README.md
├── LICENSE
├── LICENSE.fonts.md
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
├── vercel.json
├── Dockerfile
├── .gitignore
├── .vercelignore
└── .nvmrc
```

---

## Next.js patterns

**Server vs client boundaries:**

- All sections are **Server Components by default**. Data from `src/lib/site-data.ts` rendered at build time.
- **Only motion-bearing components** are `'use client'`: `MotionProvider`, `SnapPaginator`, `Cursor`, `ProgressBar`, `TopBar`. Anything using `useEffect`, `useState`, or `gsap` must be client.
- Fetch in Server Components, pass data DOWN as props. No fetch calls inside client components.

**Async API rules (Next.js 16):**

- `params`, `searchParams`, `cookies()`, `headers()` are **async**. Always `await` them.

**Fonts:**

- `next/font/google` for Space Grotesk + IBM Plex Mono (wired in `src/app/layout.tsx`).
- CSS vars: `--font-display-loaded` (Space Grotesk), `--font-mono-loaded` (IBM Plex Mono).

**Images:**

- Always `next/image`, never `<img>`. Add `priority` to LCP images (Hero).
- Remote hostname in `process.env.NEXT_PUBLIC_API_HOSTNAME` → `next.config.ts`.

**Motion lifecycle:**

- Use `@gsap/react` `useGSAP()` for all GSAP timelines. Never raw `useEffect`.
- Lenis initialized once in `MotionProvider`. Do NOT start a second RAF loop.
- Bridge already wired: `gsap.ticker.add((t) => lenis.raf(t * 1000))`.

**Error boundaries:**

- Add `src/app/error.tsx` and `src/app/not-found.tsx` before first prod deploy.

**Cache:**

- Static by default. When AIAT API wires in, use `use cache` + `cacheLife('hours')` for Members + Gallery fetches.

---

## Development workflow

For **each section** (Home → Others, in order):

1. Read the brief in `docs/design.md` §3.5 + the matching prompt in `docs/stitch-prompts.md`
2. Run prompt in **Google Stitch**, export 3 frames (desktop 1440 / tablet 834 / mobile 390)
3. Save Stitch HTML + frames to `assets/raw/stitch/<section>/` (gitignored)
4. Review with the team, iterate prompt 1–2× max
5. Lock visuals → write code:
   - Update section component in `src/components/sections/<Name>.tsx`
   - Add reusable components to `src/components/blocks/`
   - Add motion via `useGSAP()` in a `'use client'` component (e.g. `src/components/motion/HeroSequence.tsx`)
   - Tailwind utilities inline; bespoke CSS in a `.module.css` next to the component
6. Verify: `npm run dev` → check 1440 / 834 / 390 widths in DevTools
7. Run `npm run typecheck` + `npm run lint` before committing
8. Commit atomically per section: `feat(home): hero scroll-snap shell + Lenis init`

WebGL (Tier B) layered in Phase 07 only.

---

## Project rules

1. **Confirm before acting on ambiguous scope.** Don't pick fonts, colors, copy, or features without clear direction from the team. Ask.
2. **No silent scope expansion.** "Fix hero spacing" is not permission to refactor `globals.css`. Stay in scope.
3. **Headed-work.** Test UI in browser at 390 / 834 / 1440. `npm run typecheck` + `npm run lint` prove code, not feature correctness.
4. **Read before edit.** Grep for callers before modifying a function. Read the section before changing it.
5. **No local machine paths.** Keep all file references relative to this repo root.
6. **API contracts are local-only.** `api/` folder is gitignored. Never commit `api_guide.md`, `swagger.json`, or any credentials.

---

## Verification checklist (v1 ship)

1. `npm install && npm run dev` → http://localhost:3000 loads without errors
2. Cream cover with red "Pangpuriye" word renders in Hero
3. Scroll snaps through all 7 sections cleanly with Lenis
4. All sections render placeholder content from `src/lib/site-data.ts`
5. Responsive at 390 / 834 / 1440 viewport widths
6. GSAP scroll-triggered text reveals fire on section enter (Phase 03+)
7. Custom cursor visible on desktop, magnetic on `[data-magnetic]` (Phase 03+)
8. `npm run build` succeeds with no warnings; `npm run start` serves the prod build
9. `npm run typecheck` clean; `npm run lint` clean
10. Vercel preview URL responds 200; production URL approved by team lead
11. Repo public on GitHub, MIT, README + LICENSE.fonts.md present
12. **Smell test:** open beside obys.agency in two tabs — does it lose by < 30%?
13. Lighthouse on `pangpuriye6.vercel.app`: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90

---

## Risk register

| Risk | Mitigation | Status |
|---|---|---|
| Next.js bundle size hurts Lighthouse | Tree-shake GSAP plugins, lazy-load OGL via dynamic import, server-render everything except motion | OPEN — monitor |
| GSAP fights React Strict Mode | Use `@gsap/react` `useGSAP()` exclusively, never raw `useEffect` | OPEN — implement |
| WebGL battery drain on mobile | `prefers-reduced-motion` + viewport `<480px` disables WebGL | OPEN — Phase 07 |
| Cohort photo shoot slips past week 4 | Editorial b&w stock placeholders, hot-swap later | OPEN — monitor |
| Tier B exceeds 1-month window | Tier A is the safe ship; Tier B is stretch | OPEN — gate weekly |

---

## What success looks like

A site that, when opened next to obys.agency in two browser tabs, doesn't make the team flinch. Specifically:

- Hand-tuned GSAP timing (ear-test, not stock easings)
- Editorial restraint everywhere except the Red Wall punctuation slide
- Type so consistent the eye stops noticing it
- 7 sections that each feel like their own page, not 7 variations of the same template
- Ships before bootcamp ends (~2026-06-08), polished enough for the team's portfolio
- Lighthouse Performance ≥ 85 even with Tier B WebGL on
