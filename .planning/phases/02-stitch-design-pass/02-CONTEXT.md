# Phase 02: Stitch Design Pass - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning
**Mode:** `--auto` — gray areas auto-resolved with recommended defaults

## Phase Boundary

Lock visual frames for the 7 yearbook sections (Home, About, Members, Red Wall, Gallery, Recognition, Clips) in Google Stitch. Output is design-only — desktop / tablet / mobile PNG exports per section, saved to `assets/raw/stitch/<section>/`. No production code is modified. Tew greenlights each section before lock (max 2 iterations).

## Requirements (locked via SPEC.md)

**7 requirements are locked.** See `02-SPEC.md` for full requirements, boundaries, and acceptance criteria.

Downstream agents MUST read `02-SPEC.md` before planning or implementing. Requirements are not duplicated here.

**In scope (from SPEC.md):**
- Running Stitch prompts 1–7 (Home → Clips)
- Iterating prompts based on Tew's feedback (max 2 cycles per section)
- Exporting desktop / tablet / mobile frames per section
- Saving frames + exported HTML/CSS (if Stitch provides) to `assets/raw/stitch/<section>/`
- Updating `docs/stitch-prompts.md` with the final prompt that produced each lock

**Out of scope (from SPEC.md):**
- Writing or modifying production code in `app/`, `components/`, `lib/`, `styles/`
- Optimizing fonts, perf, accessibility (Phase 08)
- WebGL / shader exploration (Phase 07)
- Cohort photography or real photo selection (placeholders remain)
- Section 07 Others (creative wall) — not part of the required 7
- Live API integration testing (Phase 04)
- Updating design system tokens in `app/globals.css`

## Implementation Decisions

### Stitch Project Structure

- **D-01**: **One Stitch project for all 7 sections.** Single project keeps the design system tokens (palette, type, grid) consistent across sections — Stitch reuses the @theme block across prompts within the same project. Switching projects per section risks token drift.
  - `[auto] Q: "One project or 7 projects in Stitch?" → Selected: "One project (Recommended)" — design system stays consistent`

- **D-02**: **Section order = 1 → 7.** Home first locks the design system; remaining sections inherit. Out-of-order risks Tew approving a Members frame that conflicts with a still-undecided Hero pattern.
  - `[auto] Q: "Run prompts in declared order or open?" → Selected: "Declared order 1→7" — Home sets the system, others inherit`

### Iteration Cadence

- **D-03**: **Review after EACH section (not batched).** Tew reviews + greenlights or rejects after each Stitch run. Batching 3 sections at a time risks compounding bad decisions — if Home is wrong, About and Members built on it inherit the wrongness.
  - `[auto] Q: "Review per-section or in batches of 3?" → Selected: "Per-section (Recommended)" — catch drift early`

- **D-04**: **Max 2 iterations per section.** Iteration 1 = first Stitch run with the locked prompt. Iteration 2 = re-prompt with Tew's corrections. If Iteration 3 is needed, escalate — the prompt itself is wrong, return to `docs/stitch-prompts.md` and rewrite before re-running.
  - `[auto] Q: "Iteration budget per section?" → Selected: "Max 2 iterations" — third try means the prompt is broken`

### Reference Images

- **D-05**: **Attach obys.agency + studionamma.com screenshots to Stitch prompts.** Stitch supports image inputs alongside prose. Sending 2 reference screenshots per prompt (one Obys, one Namma) anchors Stitch's "luxury editorial" baseline. Same 2 screenshots reused across all 7 sections.
  - `[auto] Q: "Attach reference screenshots to prompts?" → Selected: "Yes — obys.agency + studionamma.com homepage" — anchors taste`

- **D-06**: **Reference screenshots stored at** `assets/raw/references/obys-home.png` + `assets/raw/references/namma-home.png` (gitignored — `assets/raw/` already excluded). Tew captures these once before Phase 02 starts.

### Output Format & Naming

- **D-07**: **Export PNG + HTML/CSS (when Stitch offers).** PNG is the canonical lock; HTML/CSS export is reference for Phase 03 coders. If Stitch only exports PNG, that's fine — Phase 03 hand-codes from the PNG anyway.
  - `[auto] Q: "Export format?" → Selected: "PNG + HTML/CSS if available (Recommended)" — PNG is canonical`

- **D-08**: **File naming convention:** `{section-slug}-{viewport}.{ext}` per frame. Examples:
  ```
  assets/raw/stitch/01-home/01-home-desktop.png
  assets/raw/stitch/01-home/01-home-tablet.png
  assets/raw/stitch/01-home/01-home-mobile.png
  assets/raw/stitch/01-home/01-home-desktop.html       (if Stitch exported)
  assets/raw/stitch/01-home/01-home-stitch-url.txt     (Stitch project URL for re-edits)
  ```
  - `[auto] Q: "File naming convention?" → Selected: "{section-slug}-{viewport}.{ext}" — readable, sortable`

### Review Channel

- **D-09**: **Tew reviews in-chat (Claude Code session) by image attachment.** Stitch frames pasted into the active session. Tew responds inline with greenlight or revision asks. Faster than Notion / Telegram / Slack roundtrip.
  - `[auto] Q: "Where does Tew review?" → Selected: "In-chat image paste (Recommended)" — zero-friction`

- **D-10**: **Greenlight tag:** Tew types "lock" or "approved" to confirm. Plain English — no ceremony. Commit message tag will record: `Reviewed-by: Tew`.

### Failed Iterations

- **D-11**: **Discard rejected Stitch outputs.** Only the locked frame ships to `assets/raw/stitch/<section>/`. Failed iterations are not committed — they bloat the repo and confuse Phase 03 coders looking for the source of truth.
  - `[auto] Q: "Keep failed iteration files?" → Selected: "Discard — only locked frame ships" — repo stays clean`

- **D-12**: **Iteration log lives in commit messages.** Each section's lock commit notes how many iterations + what Tew rejected. Example:
  ```
  design(02-home): lock Hero Stitch frames after 2 iterations

  Iteration 1 rejected: title too small, photo crop too tight.
  Iteration 2 fixed: title scaled to clamp(56px, 9vw, 144px),
  photo aspect changed 4:5 → 3:4.

  Reviewed-by: Tew
  ```

### Updating docs/stitch-prompts.md

- **D-13**: **Final-locked prompts overwrite `docs/stitch-prompts.md`.** After Tew locks Section N's frame, the prompt that produced it replaces the Prompt #N section in `docs/stitch-prompts.md`. Old drafts are version-controlled in git history — no need to keep them in the file.
  - `[auto] Q: "Update stitch-prompts.md per section or at end?" → Selected: "Per-section" — file always reflects current truth`

### Section 7 (Others) — Optional

- **D-14**: **Defer Section 7 Others until 7 required sections are locked.** If time permits after Section 6 (Clips) lock, optionally run Prompt #8 for Others creative wall. Otherwise drop — `Others.tsx` already has `data.others.enabled = false` defaulting to hidden.
  - `[auto] Q: "Run Section 7 in this phase?" → Selected: "Defer — optional after 1–7 lock" — protects time budget`

### Claude's Discretion

- Stitch UI navigation specifics (where to click, how to access export menu) — Claude figures out via browser-harness or screenshots. Not a decision Tew needs to make.
- Whether to chain prompts in one Stitch conversation or paste each fresh — Claude decides based on Stitch's context retention behavior at runtime.
- How to handle Stitch API errors / rate limits — Claude retries with backoff. Not a decision Tew needs to make.

## Canonical References

**Downstream agents (gsd-phase-researcher, gsd-planner) MUST read these before planning or implementing.**

### Design system (locked in Phase 01)

- `app/globals.css` — Tailwind v4 `@theme` block with all design tokens (palette hex codes, font families, type scale, grid margins, breakpoints)
- `docs/design.md` — Design system spec: palette §2, typography §3, layout grid §4, scroll-snap shell §5, motion §6, per-section vibe brief §8
- `docs/stitch-prompts.md` — Existing prompt drafts for sections 1–8 with shared header + per-section bodies + hard NOs

### Section component scaffolds

- `components/sections/Hero.tsx` — Phase-01 scaffold for Section 01
- `components/sections/About.tsx` — Section 02
- `components/sections/Members.tsx` — Section 03
- `components/sections/RedWall.tsx` — Section TR
- `components/sections/Gallery.tsx` — Section 04
- `components/sections/Recognition.tsx` — Section 05
- `components/sections/Clips.tsx` — Section 06
- `components/sections/Others.tsx` — Section 07 (optional)

### Brand & content data

- `lib/site-data.ts` — TypeScript types + EN-only placeholders for all sections
- `public/data/hero.json`, `about.json`, `members.json`, `gallery.json`, `recognition.json`, `clips.json`, `red-wall.json` — editable JSON templates
- `LICENSE.fonts.md` — Font legal notes (PP Supply Mono trial caveat, OFL fonts safe)

### Reference DNA (external)

- https://obys.agency — primary reference for editorial-motion DNA
- https://studionamma.com — secondary reference
- Tew will save screenshots to `assets/raw/references/obys-home.png` and `assets/raw/references/namma-home.png` before Phase 02 starts

### Decisions log

- `/Users/tew/Desktop/tos/decisions/log.md` — parent project decisions log (Pangram trial accepted, stack pivot to Next.js, CUBE CSS chosen)
- `~/.claude/projects/-Users-tew-Desktop-tos/memory/feedback_no_leaked_data.md` — privacy rule (never leak internal URLs to public surfaces)

## Deferred Ideas

(Captured from auto-mode analysis but moved out of Phase 02 scope.)

- **Section 7 Others creative wall** — optional add-on after sections 1–6 lock. Roadmap entry: Phase 06 already covers Others coding; Stitch frame for Others can attach there or stay deferred.
- **Reference-site deep-style extraction** — using `extract-design` skill to programmatically pull obys/namma design tokens. Not needed — we already have locked tokens. Skip.
- **Stitch HTML/CSS → Tailwind class translation** — Phase 03 work, not Phase 02. Phase 02 owns visual locks only.

## What Comes Next

1. `/gsd-plan-phase 02` — gsd-planner reads SPEC + this CONTEXT, produces PLAN.md per Stitch wave (likely 3 plans: 02-01 sections 1–4, 02-02 sections 5–7, 02-03 optional Others)
2. After plan checker validates: Tew runs Stitch with each section's prompt, pastes results in chat, locks per-section
3. Frames land in `assets/raw/stitch/<section>/` via Claude saving the paste-images
4. After all 7 sections locked → `/gsd-verify-work 02` → `/gsd-ship 02`
5. Then Phase 03 (Home coding) starts

---

*Phase: 02-stitch-design-pass*
*Context gathered: 2026-05-11 (auto-mode single pass)*
*Next: `/gsd-plan-phase 02` — wave-based PLAN.md per section batch*
