# pangpuriye6 — Claude Project Instructions

You are working on **pangpuriye6**: an Awwwards-tier scroll-snap digital yearbook for **House Pangpuriye** (Super AI Engineer Season 6, Level 2, AIAT). Bootcamp assignment, 1-month window through ~2026-06-08, deployed to Vercel.

This file is the project-local Claude charter. Read it on every session start. Tew's global rules at `/Users/tew/Desktop/tos/CLAUDE.md` (parent) still apply — this file extends them, doesn't replace them.

---

## What we're building (one paragraph)

A single-page **scroll-snap full-viewport** yearbook in the **Studio Namma / Obys.agency** school of editorial web design — handcrafted motion, restraint-first red palette ("Red Sniper" — 92% cream/black, red surgical), grotesk + dual-mono typography. Built on **Next.js 16 App Router · React 19 · Tailwind v4 · GSAP · Lenis · OGL**. Tier B ambition: **Awwwards Honorable** (Tier A first by week 2, WebGL effects layered weeks 3–4). Required sections per AIAT brief: **Home · About · Members · Gallery · Recognition · Clips · Others (optional)**. Public GitHub + public Vercel.

Reference plan: `/Users/tew/.claude/plans/i-wanted-to-create-snazzy-taco.md`. Plan §5 (vanilla stack) is **superseded** by the Next.js pivot logged in `decisions/log.md` (2026-05-10 entry).

---

## Locked decisions (do NOT re-litigate without flagging)

| Domain | Locked value |
|---|---|
| Framework | **Next.js 16** App Router · React 19 · TypeScript strict |
| Styling | **Tailwind v4** (CSS-first config via `@theme` in `app/globals.css`, no `tailwind.config.ts`) |
| CSS methodology | CUBE CSS (Composition · Utility · Block · Exception). NOT Atomic Design. See `docs/atomic-design-eval.md`. |
| Layout | Scroll-snap full-viewport sections (`scroll-snap-type: y mandatory` on `<html>`) + Lenis smooth scroll. |
| Motion | GSAP + ScrollTrigger via `@gsap/react`'s `useGSAP()` hook. Lenis for smooth scroll. Custom magnetic cursor. |
| WebGL (Phase 07+) | OGL (lighter than three.js) |
| Reference DNA | studionamma.com + obys.agency |
| Ambition tier | Tier B (Tier A ships week 2, WebGL on top weeks 3–4) |
| Color story | "Red Sniper" — 92% cream/charcoal, red surgical |
| Palette | `#FAF7F2` cream · `#1A1A1A` charcoal · `#C1121F` red · `#780000` red-deep · `#D4A373` gold (corner crops only) · `#4A4A4A` gray-700 · `#C9C5BE` gray-300 |
| Display + body | Space Grotesk variable 300–700 via `next/font/google` (OFL) |
| Mono primary | IBM Plex Mono 400 + 400-italic via `next/font/google` (OFL) |
| Mono accent | PP Supply Mono via `next/font/local` once downloaded — see "License risk" below |
| Photos | Placeholders now, real cohort photos drop weeks 3–4 |
| Roster data | `lib/site-data.ts` placeholder, hydrate from API in Phase 04 |
| Backend | Internal API. Base URL lives in `.env.local` as `NEXT_PUBLIC_API_BASE_URL` (gitignored — never commit). Contract docs in local-only `api/` folder (gitignored). Pattern from `pangpuriye-site/`'s `hydrate.js` is **inspiration only — DO NOT copy code, rewrite clean** in TS. |
| Repo | Public github.com/maybethereisone-C/pangpuriye6, MIT license |
| Existing pangpuriye-site/ | OUT OF SCOPE. Do not read source, do not port code. Different design language. |

If a request would override any of the above, **stop and ask**. The 95% rule from parent CLAUDE.md applies hard — no silent re-litigation.

---

## Asset inventory (pre-existing in this folder, treat as fixtures)

| Path | What it is | How we use it |
|---|---|---|
| `api/api_guide.md` (gitignored) | Internal API endpoint contract — LOCAL ONLY, never commit | Reference for `lib/api.ts` fetcher |
| `api/swagger.json` (gitignored) | OpenAPI/Swagger spec — LOCAL ONLY, never commit | Source of truth for response schemas |
| `public/blendr.mp4` | 17-second video, ~9 MB | Hero scroll-driven sequence asset (plan §3.3 Tier B) |
| `public/blendr-t00.jpeg` ... `public/blendr-t17.jpeg` | Frame extracts at 0/2/5/8/11/14/17 sec | Pre-extracted scroll-sequence frames for hero — cheaper than the video on slow connections |

---

## License risk — PP Supply Mono (LIVE)

PP Supply Mono is a Pangram Pangram trial font. Trial license is **personal use only** — embedding on a public website without buying a Web License (~$40+) violates Pangram EULA §2.4 and §3.7(i)(ii). Tew has chosen to **proceed without a license**, accepting takedown risk. Decision logged at `../../decisions/log.md` (2026-05-10 entry).

**What this means for you (Claude) when working in this project:**

- ✅ Drop PP Supply Mono `.woff2` into `public/fonts/` and load via `next/font/local` once Tew has the file.
- ⚠️ **Pre-commit a Space Mono swap branch.** If Tew gets a takedown notice, we need a 30-min hot-fix path. Keep `public/fonts/space-mono-*.woff2` available + a token-level swap in `app/globals.css` that swaps `--font-mono-accent` between the two.
- 🚫 Never tell Tew the embedding is "fine" or "low-risk-no-action-needed." It IS a license violation. If he asks a question that suggests he's forgotten, remind him of the standby.
- 🚫 Don't commit Pangram fonts to any other repo from this kit without separate evaluation.

---

## Folder structure (canonical)

```text
.
├── app/
│   ├── layout.tsx              # root html, fonts, MotionProvider mount
│   ├── page.tsx                # composes the 7 sections + chrome
│   └── globals.css             # CUBE Utility (tokens) + Composition (reset, scroll-snap, base type)
├── components/
│   ├── motion/                 # 'use client' components — GSAP/Lenis lifecycle
│   │   ├── MotionProvider.tsx  # Lenis init, GSAP ticker bridge
│   │   ├── Cursor.tsx          # custom magnetic cursor
│   │   └── ProgressBar.tsx     # red hairline scroll progress
│   ├── blocks/                 # reusable Blocks (CUBE)
│   │   ├── TopBar.tsx          # 'P' sigil + section spy + menu trigger
│   │   └── Footer.tsx
│   └── sections/               # one Block + Exception per section
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── Members.tsx
│       ├── RedWall.tsx
│       ├── Gallery.tsx
│       ├── Recognition.tsx
│       ├── Clips.tsx
│       └── Others.tsx
├── lib/
│   └── site-data.ts            # placeholder content + TS types
├── public/
│   ├── fonts/                  # PP Supply Mono self-hosted (when downloaded)
│   ├── images/                 # placeholder svgs + brand assets
│   ├── blendr.mp4              # hero scroll-sequence
│   ├── blendr-t*.jpeg          # frame extracts
│   ├── api-config.json         # backend wiring mode flag
│   └── site.json               # runtime placeholder mirror
├── api/                        # AIAT API contract (docs only, NOT deployed)
│   ├── api_guide.md
│   └── swagger.json
├── docs/
│   ├── design.md               # design system spec
│   ├── stitch-prompts.md       # 7 prompts for Google Stitch
│   ├── motion.md               # GSAP/Lenis/OGL implementation notes
│   ├── font-research.md        # Phase-00 license + perf research
│   └── atomic-design-eval.md   # why CUBE, not Atomic
├── CLAUDE.md                   # this file
├── README.md
├── LICENSE                     # MIT (code only)
├── LICENSE.fonts.md            # font attributions
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
├── vercel.json
├── .gitignore
├── .vercelignore
└── .nvmrc
```

---

## Next.js patterns we follow (from vercel:nextjs skill)

**Server vs client boundaries:**

- All sections are **Server Components by default**. They render placeholder data from `lib/site-data.ts` at build time.
- **Only motion-bearing components** are `'use client'`: `MotionProvider`, `Cursor`, `ProgressBar`, `TopBar`. Anything that uses `useEffect`, `useState`, or `gsap` must be marked client.
- Pass server-rendered data DOWN as props. Don't put fetch calls inside client components — fetch in a Server Component above and pass results.

**Async API rules (Next.js 15+):**

- `params`, `searchParams`, `cookies()`, `headers()` are now **async** in Next.js 16. Always `await` them.
- We have no dynamic routes yet, so this rule isn't exercised — but is non-negotiable when it lands.

**Fonts:**

- Use `next/font/google` for Space Grotesk + IBM Plex Mono. Already wired in `app/layout.tsx`.
- Use `next/font/local` for PP Supply Mono once the `.woff2` lands in `public/fonts/`. Add a `localFont(...)` call in `layout.tsx` then.
- Font-family CSS vars: `--font-display-loaded` (Space Grotesk), `--font-mono-loaded` (IBM Plex Mono), `--font-mono-accent-loaded` (PP Supply Mono — TBD).

**Images:**

- Always `next/image`, never `<img>`. Add `priority` to LCP images (the Hero photo).
- Remote images: hostname read from `process.env.NEXT_PUBLIC_API_HOSTNAME` in `next.config.ts`. Empty env → no remote images allowed.

**Motion lifecycle:**

- Use `@gsap/react`'s `useGSAP()` hook for any GSAP timeline. It auto-cleans on unmount and plays nice with Strict Mode.
- Lenis is initialized once in `MotionProvider` (high in the tree). All children inherit smooth scroll.
- Bridge: `gsap.ticker.add((t) => lenis.raf(t * 1000))` is already wired — DO NOT initialize a separate Lenis RAF loop.

**Error boundaries:**

- Add `app/error.tsx` and `app/not-found.tsx` before first prod deploy.

**Cache:**

- Static by default (App Router + RSC). When the AIAT API wires in, evaluate Cache Components (`use cache` + `cacheLife('hours')`) for the Members + Gallery fetches.

---

## Development workflow (Phase 02+)

For **each section** (Home → Others, in order):

1. Read the brief in `docs/design.md` §3.5 + the matching prompt in `docs/stitch-prompts.md`
2. Run prompt in **Google Stitch**, export 3 frames (desktop 1440 / tablet 834 / mobile 390)
3. Save Stitch HTML + frames to `assets/raw/stitch/<section>/` (gitignored)
4. Review with Tew, iterate prompt 1–2× max
5. Lock visuals → write code:
   - Update the section component in `components/sections/<Name>.tsx`
   - Add any new reusable components to `components/blocks/`
   - Add motion via `useGSAP()` in a `'use client'` companion if needed (e.g. `components/motion/HeroSequence.tsx`)
   - Add Tailwind utilities or custom classes inline; bespoke CSS goes in a `.module.css` next to the component
6. Verify: `npm run dev` → check 1440 / 834 / 390 viewport widths in browser DevTools
7. Run `npm run typecheck` + `npm run lint` before committing
8. Commit atomically per section: `feat(home): hero scroll-snap shell + Lenis init`

WebGL (Tier B) layered on top in Phase 07 only.

---

## Tew's hard rules for this project

These come from parent `CLAUDE.md` and session context. Re-stated for emphasis:

1. **95% rule.** No font picks, color picks, copy picks, scope picks on Tew's behalf when there's a real choice and you're below 95% confidence. Ask.
2. **Don't read `projects/pangpuriye-site/`.** Tew said "do not ever use or read it." Different design language, parallel effort. Only the AIAT API contract is acknowledged (already mirrored at `api/api_guide.md`).
3. **Headed-work.** When testing UI, open the browser, click around. `npm run typecheck` + `npm run lint` prove code, not feature correctness.
4. **Cost guardrails.** Deliverable upfront — name it before starting. 2-retry cap on failed fixes. Read before edit.
5. **Voice gate.** Public-facing copy (README, GitHub repo description) — show Tew a draft before committing. Match `references/voice.md` only on external content (LinkedIn, Facebook, TikTok, client messages).
6. **No silent expansion.** A request to "fix the hero spacing" isn't permission to refactor `app/globals.css`. Stay in scope.

---

## Verification checklist (v1 ship)

1. `npm install && npm run dev` → http://localhost:3000 loads without errors
2. Cream cover with red "Pangpuriye" word renders in Hero
3. Scroll snaps through all 7 sections cleanly with Lenis
4. All sections render placeholder content from `lib/site-data.ts`
5. Responsive at 390 / 834 / 1440 viewport widths
6. GSAP scroll-triggered text reveals fire on each section enter (Phase 03+)
7. Custom cursor visible on desktop, magnetic on `[data-magnetic]` (Phase 03+)
8. `npm run build` succeeds with no warnings; `npm run start` serves the prod build
9. `npm run typecheck` clean; `npm run lint` clean
10. Vercel preview URL responds 200; production URL on greenlight from Tew
11. Repo public on GitHub, MIT, README + LICENSE.fonts.md present
12. **Smell test:** open beside obys.agency in two tabs — does it lose by < 30%?
13. Lighthouse on `pangpuriye6.vercel.app`: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90

If a verification step fails, mark the phase incomplete and re-iterate. Don't claim "done" with failing checks.

---

## Living risk register

| Risk | Owner | Mitigation | Status |
|---|---|---|---|
| Pangram takedown for PP Supply Mono | Tew (decision), Claude (standby branch) | Pre-stage Space Mono swap | OPEN — accepted |
| Next.js bundle size hurts Lighthouse | Claude | Tree-shake GSAP plugins, lazy-load OGL via dynamic import, server-render everything except motion | OPEN — monitor |
| GSAP fights React Strict Mode | Claude | Use `@gsap/react` `useGSAP()` exclusively, never raw `useEffect` | OPEN — implement |
| WebGL battery drain on mobile | Claude | `prefers-reduced-motion` + viewport `<480px` disables WebGL | OPEN — Phase 07 |
| Cohort photo shoot slips past week 4 | Tew | Editorial b&w stock placeholders, hot-swap later | OPEN — monitor |
| Tier B exceeds 1-month window | Both | Tier A is the safe ship; Tier B is stretch | OPEN — gate weekly |

---

## What success looks like

A site that, when opened next to obys.agency in two browser tabs, **doesn't make Tew flinch**. Specifically:

- Hand-tuned GSAP timing (timings are an ear-test, not stock easings)
- Editorial restraint everywhere except the one Red Wall punctuation slide
- Type so consistent that the eye stops noticing it
- 7 sections that each feel like their own page, not 7 variations of the same template
- A v1 that ships **before bootcamp ends** (~2026-06-08), polished enough that Tew is willing to put it on his portfolio
- Lighthouse Performance ≥ 85 even with Tier B WebGL on

That's the bar. Don't ship below it.
