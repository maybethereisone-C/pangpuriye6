# Phase 02: Stitch Design Pass — Specification

**Created:** 2026-05-11
**Ambiguity score:** 0.10 (gate: ≤ 0.20) — ✅ PASS
**Requirements:** 7 locked

## Goal

Produce locked Google Stitch frame exports (desktop 1440×900, tablet 834×1194, mobile 390×844) for each of the 7 yearbook sections — Home, About, Members, Red Wall, Gallery, Recognition, Clips — using the prompts already drafted in `docs/stitch-prompts.md`. Each section's frames must pass Tew's review (max 2 iterations) and be saved to `assets/raw/stitch/<section>/`. No production code is modified during this phase — output is design assets only.

## Background

Phase 01 shipped a working scaffold with placeholder UI for all 7 sections (see commit `eb66c29` and earlier). The scaffold is intentionally bare — it renders structural skeletons (border boxes, placeholder photo frames, mock data) without polished typography, photo treatment, or layout nuance. Each section component (`components/sections/Hero.tsx`, etc.) is a SCAFFOLD marker explicitly tagged in JSDoc with "Phase-01 SCAFFOLD only. Real visuals locked in Phase 02 (Stitch), coded in Phase 03..."

The design system is locked in `docs/design.md` (palette, type, grid, vibe brief per section) and `app/globals.css` (Tailwind v4 `@theme` tokens). The Stitch prompts in `docs/stitch-prompts.md` reference these tokens by hex value and font name. Stitch is Google's AI design tool (https://stitch.withgoogle.com) — it converts prose prompts into Figma-style frames with optional HTML/CSS export.

The gap: scaffold renders bare boxes; Phase 03+ implementation requires a locked visual to target. Without the Stitch pass, Phase 03 coders are guessing at typography weight, image crop ratios, exact spacing, hover affordances, and section-specific embellishments.

## Requirements

1. **Stitch frames for Home (DESIGN-01)**: Three frames produced and locked.
   - Current: `docs/stitch-prompts.md` Prompt #1 drafted but never run in Stitch
   - Target: Three exported frames at 1440×900 / 834×1194 / 390×844 saved to `assets/raw/stitch/01-home/`
   - Acceptance: Files exist at the listed paths; Tew has reviewed and approved them (max 2 iterations of prompt + re-export)

2. **Stitch frames for About (DESIGN-02)**: Three frames produced and locked.
   - Current: `docs/stitch-prompts.md` Prompt #2 drafted, not yet run
   - Target: Three exported frames saved to `assets/raw/stitch/02-about/`
   - Acceptance: Files at listed paths; Tew approved

3. **Stitch frames for Members (DESIGN-03)**: Three frames produced and locked.
   - Current: `docs/stitch-prompts.md` Prompt #3 drafted, not run
   - Target: Three exported frames saved to `assets/raw/stitch/03-members/`
   - Acceptance: Files at listed paths; Tew approved

4. **Stitch frames for Red Wall (DESIGN-04)**: Three frames produced and locked.
   - Current: `docs/stitch-prompts.md` Prompt #4 drafted, not run
   - Target: Three exported frames saved to `assets/raw/stitch/tr-red-wall/`
   - Acceptance: Files at listed paths; Tew approved

5. **Stitch frames for Gallery (DESIGN-05)**: Three frames produced and locked.
   - Current: `docs/stitch-prompts.md` Prompt #5 drafted, not run
   - Target: Three exported frames saved to `assets/raw/stitch/04-gallery/`
   - Acceptance: Files at listed paths; Tew approved

6. **Stitch frames for Recognition (DESIGN-06)**: Three frames produced and locked.
   - Current: `docs/stitch-prompts.md` Prompt #6 drafted, not run
   - Target: Three exported frames saved to `assets/raw/stitch/05-recognition/`
   - Acceptance: Files at listed paths; Tew approved

7. **Stitch frames for Clips (DESIGN-07)**: Three frames produced and locked.
   - Current: `docs/stitch-prompts.md` Prompt #7 drafted, not run
   - Target: Three exported frames saved to `assets/raw/stitch/06-clips/`
   - Acceptance: Files at listed paths; Tew approved

## Boundaries

**In scope:**
- Running Stitch prompts 1–7 (Home → Clips)
- Iterating prompts based on Tew's feedback (max 2 cycles per section)
- Exporting desktop / tablet / mobile frames per section
- Saving frames + exported HTML/CSS (if Stitch provides) to `assets/raw/stitch/<section>/`
- Updating `docs/stitch-prompts.md` with the final prompt that produced the locked frame
- Section 7 (Others) is **optional** — only run Stitch Prompt #8 if remaining time allows after the 7 required sections

**Out of scope:**
- Writing or modifying production code in `app/`, `components/`, `lib/`, `styles/` — frames are review-only deliverables this phase
- Optimizing fonts, perf, accessibility — Phase 08 handles those
- WebGL / shader exploration — Phase 07 handles those
- Cohort photography or real photo selection — placeholders remain until shoot day
- Section 07 Others (creative wall) — not part of the required 7 sections; deferred to optional add-on
- Live API integration testing — Phase 04 handles that
- Updating design system tokens in `app/globals.css` — tokens are LOCKED from Phase 01; if a Stitch output violates a token, the prompt is wrong, not the token

## Constraints

- **Tool:** Google Stitch (https://stitch.withgoogle.com). Phase 02 does not introduce a different design tool.
- **Output format:** PNG screenshots of frames + (if Stitch supports it) HTML/CSS export per frame. Stored locally under `assets/raw/stitch/` (gitignored).
- **Design system fidelity:** Frames MUST respect the locked tokens in `app/globals.css` — palette hex codes, font families, type scale, grid margins. Stitch outputs that violate tokens are rejected; re-prompt.
- **Iteration budget:** Max 2 iterations per section. If a third revision is needed, escalate to Tew — there is a problem with the prompt itself, not the Stitch run.
- **No code commits this phase.** Only `assets/raw/stitch/` exports + `docs/stitch-prompts.md` text updates may be committed. The production code stays at commit `eb66c29` (or whatever Phase 01's last commit is) throughout Phase 02.
- **EN-only:** All frame copy is English. Even if Stitch suggests Thai placeholder text, reject and re-prompt.

## Acceptance Criteria

- [ ] `assets/raw/stitch/01-home/` contains desktop, tablet, mobile frames
- [ ] `assets/raw/stitch/02-about/` contains desktop, tablet, mobile frames
- [ ] `assets/raw/stitch/03-members/` contains desktop, tablet, mobile frames
- [ ] `assets/raw/stitch/tr-red-wall/` contains desktop, tablet, mobile frames
- [ ] `assets/raw/stitch/04-gallery/` contains desktop, tablet, mobile frames
- [ ] `assets/raw/stitch/05-recognition/` contains desktop, tablet, mobile frames
- [ ] `assets/raw/stitch/06-clips/` contains desktop, tablet, mobile frames
- [ ] `docs/stitch-prompts.md` reflects the final-locked prompt per section (matches what produced the saved frames)
- [ ] Tew has explicitly approved each section's frames (verified via chat or commit message tag `Reviewed-by: Tew`)
- [ ] No code under `app/`, `components/`, `lib/`, `styles/` has been modified since the start of this phase (verified via `git diff <phase-start-sha>..HEAD app/ components/ lib/ styles/` returning empty)
- [ ] Every committed Stitch artifact uses English copy only — no Thai characters in any frame screenshot or exported HTML/CSS

## Ambiguity Report

| Dimension          | Score | Min  | Status | Notes                                                            |
|--------------------|-------|------|--------|------------------------------------------------------------------|
| Goal Clarity       | 0.95  | 0.75 | ✓      | Exact deliverable per section (3 frames × 7 sections), tool locked, prompt source already in repo |
| Boundary Clarity   | 0.90  | 0.70 | ✓      | "No code modification" rule explicit. Section 7 marked optional. |
| Constraint Clarity | 0.85  | 0.65 | ✓      | Tool, iteration budget, fidelity rule, EN-only rule all stated   |
| Acceptance Criteria| 0.85  | 0.70 | ✓      | All criteria are file-exists or token-match checks               |
| **Ambiguity**      | 0.10  | ≤0.20| ✓      | Gate passed — ready for discuss-phase                            |

## Interview Log

Phase 02 spec was written **without a Socratic interview** because Phase 01 + `docs/stitch-prompts.md` + `docs/design.md` together already lock the WHAT and WHY of this phase at >80% weighted clarity (computed ambiguity = 0.10).

| Round | Perspective | Decision source | Decision locked |
|-------|------------|-----------------|------------------|
| 0 | Researcher (auto) | Read `docs/stitch-prompts.md` + `docs/design.md` + `app/globals.css` | Tool = Google Stitch; output dir = `assets/raw/stitch/<section>/`; 3 frame sizes per section |
| 0 | Simplifier (auto) | Phase 01 scaffold shows the SECTIONS exist as React components — Stitch design fills them in | Phase 02 scope is exactly 7 sections (8th is optional) |
| 0 | Boundary Keeper (auto) | Plan §11 + ROADMAP.md Phase 02 description | No code modification this phase. Only `assets/raw/stitch/` + `docs/stitch-prompts.md` text updates |
| 0 | Failure Analyst (auto) | Anticipated risk: Stitch outputs Thai text or violates design tokens | Reject Stitch outputs that violate tokens; reject Thai copy outputs |
| 0 | Seed Closer (auto) | Iteration budget: how many tries per section? | Max 2 iterations per section — third try means the prompt is wrong, escalate |

If Tew disagrees with any auto-locked decision above, run `/gsd-spec-phase 02` again with `--update` to re-open the interview.

---

*Phase: 02-stitch-design-pass*
*Spec created: 2026-05-11*
*Next step: `/gsd-discuss-phase 02` — implementation decisions (how to run Stitch productively for our prompts)*
