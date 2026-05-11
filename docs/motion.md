# Motion — Implementation Notes

How to wire GSAP / Lenis / OGL into Next.js 16 + React 19 without the usual hydration / Strict Mode pitfalls.

---

## Lifecycle architecture

```
app/layout.tsx
└─ <MotionProvider> (client component, mounted once)
   ├─ Lenis instance (smooth scroll)
   ├─ GSAP ticker bridge (lenis.raf via gsap.ticker)
   └─ children
      ├─ <Cursor> (client) — magnetic cursor
      ├─ <ProgressBar> (client) — scroll progress hairline
      ├─ <TopBar> (client) — section spy via IntersectionObserver
      └─ Server Components — Hero, About, Members, ...
         └─ where motion is needed, a small client island wraps the static markup
            (e.g. <HeroSequence> wraps the Hero photo, runs scroll-driven sequence)
```

`MotionProvider` is the **only** place Lenis is initialized. Children read from the global Lenis instance via the `gsap.ticker` bridge — they don't need a context.

---

## GSAP rules

1. **Always use `@gsap/react`'s `useGSAP()` hook**, never raw `useEffect` for GSAP timelines.
   - It auto-cleans timelines on unmount.
   - It plays nice with React Strict Mode (which double-mounts in dev).
   - It scopes selectors to a ref (no global selector pollution).

```tsx
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HeroAnim() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-title-line", {
        scrollTrigger: { trigger: scope.current, start: "top 80%" },
        y: 40,
        opacity: 0,
        stagger: 0.03,
        ease: "power3.out",
      });
    },
    { scope },
  );

  return <div ref={scope}>{/* children with .hero-title-line */}</div>;
}
```

2. **Register plugins ONCE at module top, not inside components.**

```tsx
gsap.registerPlugin(ScrollTrigger);
```

If you register inside a component, Strict Mode will register twice → ScrollTrigger global state conflicts.

3. **ScrollTrigger refresh on Lenis scroll.** Already wired in `MotionProvider`:

```tsx
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

DO NOT add a separate Lenis RAF loop — that would double-tick.

4. **Use `gsap.context()` only when you need cross-component cleanup.** `useGSAP()` already wraps in a context.

---

## Lenis rules

- Single instance, lifetime = component mount of `MotionProvider`.
- Disable on `prefers-reduced-motion: reduce` (already handled in `MotionProvider`).
- Don't call `lenis.scrollTo()` from anywhere except a `useGSAP()` callback or a click handler — you need the instance reference.

---

## Custom cursor rules (Cursor.tsx)

- Hidden on touch devices via `(hover: none)` media query.
- Hidden on `prefers-reduced-motion: reduce`.
- Renders two divs: 8px charcoal dot + 40px outline ring.
- Dot position = mouse position (no smoothing).
- Ring position = lerped (`0.18` factor) toward mouse — feels weighted.
- Both divs use `mix-blend-mode: difference` so they invert against red sections (visible on Red Wall).

Magnetic pull (Phase 04+): on `[data-magnetic]` mouseenter, store ring center, lerp ring toward `(elementCenter - 60px from mouse)` until mouseleave.

---

## OGL / WebGL rules (Phase 07+)

Don't import OGL at the top of a Server Component — three.js / OGL touch `window` and break SSR.

Use dynamic import inside a client component:

```tsx
"use client";
import { useEffect, useRef } from "react";

export function MemberCardRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.innerWidth < 480) return;

      const { Renderer, Triangle, Program, Mesh } = await import("ogl");
      // ... shader setup ...
      cleanup = () => { /* dispose */ };
    })();

    return () => cleanup();
  }, []);

  return <canvas ref={canvasRef} />;
}
```

Canvas-bearing components MUST:

- Pause when `document.hidden` (visibility API)
- Disconnect when removed from viewport (IntersectionObserver)
- Cap DPR at 2 (`Math.min(window.devicePixelRatio, 2)`)
- Disable on mobile `< 480px` width (battery)
- Disable on `prefers-reduced-motion: reduce`

---

## Reduced motion

Centralized check in `MotionProvider`. Children components check the same flag at mount.

If `(prefers-reduced-motion: reduce)`:

- Lenis is destroyed
- `<html>` `scroll-snap-type` set to `none` (already in `globals.css` via media query)
- All GSAP timelines fast-forward to end state (use `.progress(1)` on creation)
- WebGL canvases are not initialized
- Cursor is hidden

Test by enabling Reduce Motion in macOS System Settings → Accessibility → Display.

---

## Performance budget

| Bundle | Size budget | Current |
|---|---|---|
| Server-rendered HTML (FCP) | ~10 KB | TBD after first build |
| Client JS (initial) | ~80 KB gzipped | TBD |
| GSAP + ScrollTrigger | ~70 KB gzipped | locked |
| Lenis | ~3 KB gzipped | locked |
| OGL (Phase 07+, lazy) | ~12 KB gzipped | locked, dynamic import |
| Total fonts | ~76 KB woff2 (latin only) | locked |
| Total LCP image | ~100 KB AVIF (Hero photo) | TBD |

Lighthouse target: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90.

---

## Phase mapping

| Phase | Motion work |
|---|---|
| 03 — Hero | Lenis init, custom cursor stub, ScrollTrigger setup, hero split-letter reveal |
| 04 — About + Members | Drop-cap reveal, member-card hover scale, magnetic CTAs |
| 05 — Gallery + Recognition + Clips | Photo clip-path reveals, horizontal-scroll rail, featured-clip auto-mute-play on snap-into-view |
| 06 — Red Wall + Others | Curtain wipe transitions, Others bento sticky-note rotation |
| 07 — WebGL | OGL ripple shader on member cards, RGB-shift on Gallery hero, scroll-driven hero sequence (blendr-t*.jpeg), cream noise shader bg |
| 08 — Polish | Timing pass with ear-test, perf audit, mobile QA, prefers-reduced-motion sweep |
