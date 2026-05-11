# Font Research — pangpuriye6

**Date:** 2026-05-10
**Author:** Claude (Phase 00 research output)
**Status:** Findings complete · ⚠️ ONE BLOCKER (PP Supply Mono license incompatible with public deploy) · awaiting Tew's choice on replacement.

---

## TL;DR

| Font | Decision | Why |
|---|---|---|
| **Space Grotesk** | ✅ KEEP | SIL OFL 1.1 — free for any use including commercial public sites. Variable, weights 300–700, has latin-ext + vietnamese subsets. Will pair against itself (display + body same family). |
| **IBM Plex Mono** | ✅ KEEP | SIL OFL 1.1 — same. Weights 100–700, italics available, broader subsets. Use as "quiet" mono for captions / IDs / metadata. |
| **PP Supply Mono** | 🛑 BLOCKED — needs replacement | Pangram trial license: free for personal use only. EULA §3.7 prohibits embedding on a public website. Site is public-Vercel + public-GitHub → would violate Pangram's terms. Buying a Web License (~$40+) is the only way to keep PP Supply Mono. |

**Action required:** pick a PP Supply Mono replacement from §4 below, OR confirm willingness to spend ~$40+ on a Pangram Web License.

---

## 1. Space Grotesk — VERIFIED

**License:** SIL Open Font License v1.1
> *"The OFL allows the licensed fonts to be used, studied, modified and redistributed freely as long as they are not sold by themselves. The fonts, including any derivative works, can be bundled, embedded, redistributed and/or sold with any software."*
> — IBM Plex `LICENSE.txt`, identical wording in Space Grotesk `OFL.txt`

**Source:** https://github.com/floriankarsten/space-grotesk
**Designer:** Florian Karsten (2018) — proportional sans variant of Colophon Foundry's Space Mono (2016)
**Foundry:** Independent
**Variable font:** ✅ yes (weight axis 300–700)
**Static weights available:** 300, 400, 500, 600, 700
**Style:** normal only (no native italic — see risk below)
**Subsets:** latin, latin-ext, vietnamese
**Files:** WOFF2 / WOFF / TTF (via Google Fonts CDN OR fontsource.org self-host)
**Last updated:** 2025-09-05 (version v22)

### Loading strategy

```html
<!-- Google Fonts CDN — easiest, but extra DNS hop -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
```

OR self-host (faster, recommended for Awwwards-tier perf):

```html
<link rel="preload" href="/assets/fonts/space-grotesk-variable.woff2" as="font" type="font/woff2" crossorigin>
```

```css
@font-face {
  font-family: "Space Grotesk";
  font-style: normal;
  font-weight: 300 700;
  font-display: swap;
  src: url("/assets/fonts/space-grotesk-variable.woff2") format("woff2-variations");
}
```

Self-host the **variable** woff2 — single ~70 KB file covers all weights vs ~25–30 KB per static weight × 3 weights = same byte budget but more flexibility.

### Risk
**No native italic.** Fontsource confirms `styles: ["normal"]` only. CSS `font-style: italic` will synthesize via skew — usually fine, but real italic is missing. For mottoes / pull-quotes, options:
1. Accept synthetic italic (browser slants the glyph ~12°)
2. Use small-caps (`font-variant-caps: all-small-caps`) instead of italic for emphasis
3. Use IBM Plex Mono italic for mottoes (mono italic exists, mid feels different)
4. Add Space Grotesk Light Italic from a third-party port if community has one

Recommend #2 for the Obys vibe — small-caps reads more "editorial" than synthetic italic.

---

## 2. IBM Plex Mono — VERIFIED

**License:** SIL Open Font License v1.1
**Source:** https://github.com/IBM/plex
**Owner:** IBM Corp. (released open source 2017)
**Variable font:** ❌ no — static weights only
**Static weights available:** 100, 200, 300, 400, 500, 600, 700
**Styles:** normal, italic ✅
**Subsets:** latin, latin-ext, cyrillic, cyrillic-ext, vietnamese
**Files:** WOFF2 / WOFF / TTF / OTF
**Last updated:** 2025-09-16 (version v20)

### Loading strategy

```css
@font-face {
  font-family: "IBM Plex Mono";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/assets/fonts/ibm-plex-mono-400.woff2") format("woff2");
}
@font-face {
  font-family: "IBM Plex Mono";
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("/assets/fonts/ibm-plex-mono-400-italic.woff2") format("woff2");
}
```

For "quiet mono" role (captions, IDs, metadata), only the 400 weight in normal + italic is needed — total budget ~28 KB self-hosted, ~10 KB if subset to latin only with `unicode-range`.

### Visual fit

IBM Plex Mono runs slightly tall and narrow vs JetBrains Mono. Pairs well with Space Grotesk because both share humanist tension despite Plex being mono (Mike Abbink designed both Plex Sans and Plex Mono with the same skeleton).

---

## 3. PP Supply Mono — 🛑 BLOCKED

**Foundry:** Pangram Pangram (Mat Desjardins, Quebec)
**License model:** Trial fonts are downloadable for free with purpose `for personal use only`. Commercial licenses start at **$40 USD**.
**File formats offered (paid):** OTF, TTF, WOFF, WOFF2

### Why this blocks our project

Pangram About page (verbatim):
> *"Compared to its peers, it gives free access to quality fonts to everyone **for personal use**. Licenses are available to purchase for **commercial projects**. The idea is to allow those who use fonts the most (mostly designers) to play and work with them in their entirety and at the time of a commercial project, let their client/employer purchase the commercial license."*

EULA §3.7 — Prohibited Uses:
> *"The Licensee is prohibited from:*
> *(i) Distributing copies of the Fonts or making the Fonts available to any unauthorized third-party;*
> *(ii) Uploading or downloading the Fonts on the internet or making it available publicly in any other way, which include uploading the Font to a public internet file transfer or storing channel;*
> *(iii) Reselling, renting, giving, leasing, transferring, passing title, sublicensing the Fonts through any medium..."*

EULA §2.4 — Web License:
> *"To use a Font on a website, the Licensee needs to purchase a Web License for each individual domain or subdomain on which the Font is embedded, limited to a certain number of page views per month."*

### Conflict matrix

| Our intent | EULA verdict |
|---|---|
| Embed PP Supply Mono in CSS `@font-face` on `pangpuriye6.vercel.app` | ❌ Requires paid Web License per domain (~$40+ each) |
| Commit PP Supply Mono `.woff2` to public GitHub repo | ❌ §3.7(ii) — prohibits making fonts publicly available |
| Use PP Supply Mono as part of a public bootcamp project visible to other students / public | ❌ §3.7(i) — distributing copies to third parties |
| Use PP Supply Mono in private Figma mockups for personal exploration | ✅ allowed under "personal use" |

Verdict: keeping PP Supply Mono = need to (a) buy Web License, AND (b) keep the font file out of the public repo (`.gitignore` it, deploy with private build pipeline). Both possible but adds friction + cost.

---

## 4. Replacement Candidates for "Loud Mono / Modular Accent"

All four below are SIL OFL — safe to embed publicly, commit to public repo, no purchase, no domain limits.

### Option A — Space Mono (Colophon Foundry)
- **License:** SIL OFL 1.1
- **Pairing logic:** Space Grotesk's parent family. Maximum unity — same skeleton, same designer pedigree.
- **Vibe:** Geometric monospace, NASA-mission-control coded. Less "modular Pangram" but very clean.
- **Weights:** 400, 700
- **Italics:** yes
- **Source:** https://github.com/googlefonts/spacemono
- **Risk:** Reads slightly retro (1960s engineering). If you want sharper modern, see Geist Mono.

### Option B — Geist Mono (Vercel)
- **License:** SIL OFL 1.1
- **Pairing logic:** Vercel's official mono companion to Geist Sans. Modern dev-tool aesthetic.
- **Vibe:** Most "current AI tooling" — used by Vercel / v0 / Next.js docs. Awwwards-tier, sharp angles.
- **Weights:** 100–900 (variable)
- **Italics:** no native italic
- **Source:** https://github.com/vercel/geist-font
- **Risk:** Overlaps with the Geist Sans we'd see across Vercel ecosystem — could read "I copied Vercel's homepage."

### Option C — JetBrains Mono
- **License:** SIL OFL 1.1
- **Pairing logic:** Default for IDEs, hacker portfolios, GitHub README hero images.
- **Vibe:** Sturdy, slightly rounded, very legible. Less "designed" than Geist Mono but more "lived-in dev culture."
- **Weights:** 100–800 (variable)
- **Italics:** yes
- **Source:** https://github.com/JetBrains/JetBrainsMono
- **Risk:** Very common — risks looking like every other dev portfolio.

### Option D — Departure Mono
- **License:** SIL OFL 1.1
- **Pairing logic:** Retro pixelated CRT mono. Strong contrast vs IBM Plex Mono — would carve out clear "loud accent" role.
- **Vibe:** 1980s terminal, brutalist, lo-fi. High personality.
- **Weights:** single weight
- **Italics:** no
- **Source:** https://github.com/dse/departure-mono
- **Risk:** Strong personality — could either elevate or overwhelm depending on use. If used surgically (only on `SEC.0X` codes / page numbers), perfect tension against the cool Space Grotesk + Plex pairing.

---

## 5. Recommended Final Stack (one option only — not pre-locked)

**Best fit for the locked design direction (Studio Namma / Obys / Red Sniper / scroll-snap):**

```text
Display + Body : Space Grotesk (variable 300–700)        — OFL ✅
Mono primary   : IBM Plex Mono 400 + 400-italic           — OFL ✅
Mono accent    : Space Mono 700 OR Departure Mono regular — OFL ✅
```

**Trade-off:**
- Space Mono = elegant, unified family-tree with Space Grotesk. Safer.
- Departure Mono = bold, punchier, more "Awwwards smell" via tension. Riskier.

User picks one. No default — Tew was burned by my last self-pick (PP Editorial New).

---

## 6. Performance Budget (target: Lighthouse Perf ≥ 85)

| Asset | Self-hosted woff2 size (latin only) |
|---|---|
| Space Grotesk variable 300–700 (latin) | ~28 KB |
| IBM Plex Mono 400 (latin) | ~17 KB |
| IBM Plex Mono 400-italic (latin) | ~16 KB |
| Mono accent (Space Mono 700 OR Departure Mono) | ~15 KB |
| **Total font payload** | **~76 KB** preload-eligible |

Compare to Google Fonts CDN: same files but +1 DNS lookup + CDN latency from Bangkok ~80 ms vs Vercel edge ~10 ms. **Recommend self-host all three** in `assets/fonts/`. Subset to latin via fonttools / glyphhanger — saves ~30% size.

Add to `<head>`:

```html
<link rel="preload" href="/assets/fonts/space-grotesk-variable-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/ibm-plex-mono-latin-400.woff2" as="font" type="font/woff2" crossorigin>
<!-- mono accent only preloaded if used in Hero / above-fold -->
```

---

## 7. Fallback Stack

CSS `font-family` declarations that survive font load failure / FOUT:

```css
:root {
  --font-display : "Space Grotesk", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-body    : "Space Grotesk", "Inter", system-ui, -apple-system, sans-serif;
  --font-mono    : "IBM Plex Mono", "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --font-accent  : "<MONO-ACCENT-PICK>", "IBM Plex Mono", ui-monospace, monospace;
}
```

Use `font-display: swap` everywhere — text is visible immediately in fallback, swaps when web font ready. Avoid `optional` (can permanently keep fallback on slow connections).

---

## 8. Open Questions for Tew

1. **PP Supply Mono replacement** — pick A / B / C / D from §4, OR confirm "I'll buy the Pangram Web License for $40+ and we keep PP Supply Mono out of the public repo." I lean toward **Option A (Space Mono)** for family unity, but Tew picks.
2. **Variable vs static weights for Space Grotesk** — variable saves bytes + lets motion sequences animate weight. Recommend variable. Tew confirms?
3. **Self-host all fonts vs Google Fonts CDN** — self-host wins on perf + privacy + no third-party dependency. Costs: one-time download + commit. Recommend self-host. Tew confirms?

---

## 9. Sources Indexed (during this research)

| Source | URL | Status |
|---|---|---|
| Pangram About page | https://pangrampangram.com/pages/about | ✅ |
| Pangram EULA (full) | https://pangrampangram.com/pages/eula | ✅ |
| PP Supply product page | https://pangrampangram.com/products/supply | ✅ |
| Space Grotesk repo | https://github.com/floriankarsten/space-grotesk | ✅ |
| Space Grotesk OFL | https://raw.githubusercontent.com/floriankarsten/space-grotesk/master/OFL.txt | ✅ |
| Space Grotesk README | https://raw.githubusercontent.com/floriankarsten/space-grotesk/master/README.md | ✅ |
| Space Grotesk fontsource API | https://api.fontsource.org/v1/fonts/space-grotesk | ✅ |
| IBM Plex LICENSE | https://raw.githubusercontent.com/IBM/plex/master/LICENSE.txt | ✅ |
| IBM Plex README | https://raw.githubusercontent.com/IBM/plex/master/README.md | ✅ |
| IBM Plex Mono fontsource API | https://api.fontsource.org/v1/fonts/ibm-plex-mono | ✅ |
| Google Fonts Knowledge index | https://fonts.google.com/knowledge | ⚠️ JS-rendered, fetched empty |
| Google Fonts choose-type article | https://fonts.google.com/knowledge/choosing_type | ⚠️ JS-rendered, fetched empty |
| Google Fonts pairing article | https://fonts.google.com/knowledge/using_type/pairing_typefaces | ⚠️ JS-rendered, fetched empty |

Google Fonts knowledge articles are SPA — rendered client-side, server returns empty shell. Synthesis above leans on training data + the verifiable license/spec sources (GitHub OFL, fontsource API). If Tew wants the actual Google Fonts knowledge prose (e.g. their official pairing guidance), need a headless browser fetch via `browser-harness` — can run in a follow-up phase.
