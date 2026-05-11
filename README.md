# pangpuriye6

The digital yearbook of **Pangpuriye** — Super AI Engineer Season 6 · Level 2 · AIAT.

A scroll-snap full-viewport editorial site in the **Studio Namma / Obys.agency** school of web design. **Next.js 16 · React 19 · Tailwind v4 · GSAP · Lenis · OGL.**

🌐 **Live:** https://pangpuriye6.vercel.app *(after first deploy)*
📐 **Design system:** [`docs/design.md`](docs/design.md)
🎨 **Stitch prompts:** [`docs/stitch-prompts.md`](docs/stitch-prompts.md)
🤖 **Claude charter:** [`CLAUDE.md`](CLAUDE.md)

---

## Quick start

```bash
nvm use            # Node 20.18+
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve production build locally
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

---

## Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** App Router (Turbopack-first, React 19, Cache Components-ready) |
| Styling | **Tailwind v4** (`@theme` in `app/globals.css`, no config file) + per-component CSS Modules where bespoke |
| CSS methodology | [CUBE CSS](https://cube.fyi/) — Composition · Utility · Block · Exception |
| Smooth scroll | [Lenis](https://github.com/darkroomengineering/lenis) |
| Motion | [GSAP](https://greensock.com/gsap/) + ScrollTrigger via `@gsap/react`'s `useGSAP()` hook |
| WebGL (Phase 07+) | [OGL](https://github.com/oframe/ogl) — image shaders, lighter than three.js |
| Fonts | Space Grotesk + IBM Plex Mono via `next/font/google` + PP Supply Mono via `next/font/local` |
| Backend | Internal API (URL in `.env.local`, gitignored). Contract docs in local `api/` folder (gitignored). |
| Deploy | Vercel (auto preview on every PR) |

---

## Sections (per AIAT brief)

| ID | Section | Component |
|---|---|---|
| 01 | Home | `components/sections/Hero.tsx` |
| 02 | About | `components/sections/About.tsx` |
| 03 | Members | `components/sections/Members.tsx` |
| TR | Red Wall (transition) | `components/sections/RedWall.tsx` |
| 04 | Gallery | `components/sections/Gallery.tsx` |
| 05 | Recognition | `components/sections/Recognition.tsx` |
| 06 | Clips | `components/sections/Clips.tsx` |
| 07 | Others (memes / brainstorms) | `components/sections/Others.tsx` |

Each section is full-viewport, scroll-snap-locked, designed standalone. Bespoke per-section CSS via Tailwind + CSS Modules where Tailwind utilities run out.

---

## Folder structure

```text
.
├── app/
│   ├── layout.tsx              # root html, fonts, MotionProvider mount
│   ├── page.tsx                # composes the 7 sections + chrome
│   └── globals.css             # CUBE Utility (tokens) + Composition (reset, scroll-snap)
├── components/
│   ├── motion/                 # client components — GSAP/Lenis lifecycle
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
│   └── site-data.ts            # placeholder content + TS types (replace with API fetch in Phase 04)
├── public/
│   ├── fonts/                  # PP Supply Mono self-hosted
│   ├── images/                 # placeholder svgs + uploaded brand assets
│   ├── blendr.mp4              # hero scroll-sequence asset
│   ├── blendr-t*.jpeg          # 7 pre-extracted frames at sec 0/2/5/8/11/14/17
│   ├── api-config.json         # backend wiring mode flag
│   └── site.json               # public mirror of placeholder data (read by hydrate later)
├── api/                        # AIAT API contract (docs only, not deployed code)
│   ├── api_guide.md
│   └── swagger.json
├── docs/
│   ├── design.md               # design system spec
│   ├── stitch-prompts.md       # 7 prompts for Google Stitch
│   ├── motion.md               # GSAP/Lenis/OGL implementation notes
│   ├── font-research.md        # Phase-00 license + perf research
│   └── atomic-design-eval.md   # why CUBE, not Atomic
├── CLAUDE.md                   # Claude project charter
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

## Editing placeholder content

`lib/site-data.ts` exports `placeholderSiteData` — the seed content rendered until the AIAT API goes live. Edit values in that file, save, dev server hot-reloads.

For runtime override (e.g. test data without recompiling), drop `public/site.json` and add a fetch in Phase 04. Right now data is build-time only.

---

## Backend wiring

Frontend will read two JSON files at runtime (Phase 04+):

| File | Purpose |
|---|---|
| `public/api-config.json` | mode flag (`placeholder` or `live`), `baseUrl`, endpoints. Committed. |
| `public/api-config.local.json` | local override (deep-merged). Bearer tokens go here. **Gitignored.** |

Quickest path to live data (after Phase 04):

1. Open `public/api-config.json`
2. Flip `"mode": "placeholder"` → `"mode": "live"`
3. Reload — Members + Gallery hydrate from the AIAT API

Endpoint details: see [`api/api_guide.md`](api/api_guide.md).

---

## Deploy

```bash
npx vercel --prod --yes
```

`assets/raw/` is excluded via `.vercelignore`. **Don't run prod deploy without a greenlight from Tew** — the URL is shared with the cohort.

Preview deploys auto-fire on every push to a non-`main` branch.

---

## License

[MIT](LICENSE) — code only. Fonts have separate licenses, see [`LICENSE.fonts.md`](LICENSE.fonts.md).
