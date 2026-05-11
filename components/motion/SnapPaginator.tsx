"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "./MotionProvider";

// Luxury timing — tuned to feel closer to obys.agency / studionamma.com.
// Bigger numbers = heavier, more "weighted" feel.
const SCROLL_DURATION = 1.6;
const COOLDOWN_MS = 400;
const WHEEL_THRESHOLD = 30;
const TOUCH_THRESHOLD_PX = 60;
const EDGE_TOLERANCE_PX = 4;

// easeInOutQuart — symmetric smooth curve. Eases out of the previous section,
// glides through the middle, eases into the next. Apple product page feel.
const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

/**
 * JS-driven section paginator with edge-aware overflow handling.
 *
 * Behavior:
 *   - At section EDGES (top or bottom of viewport): wheel/touch triggers a
 *     1.6s eased glide to the prev/next section via Lenis.scrollTo.
 *   - In the MIDDLE of a tall section (content > 100svh): scroll passes
 *     through to Lenis natively so user can read every card / member /
 *     gallery item.
 *   - One snap per gesture — during the 1.6s animation + 400ms cooldown,
 *     all wheel events are swallowed.
 *
 * Mounts only when prefers-reduced-motion: no-preference.
 */
export function SnapPaginator() {
  const lenis = useLenis();
  const indexRef = useRef(0);
  const animatingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    if (!lenis) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[data-section]"),
    );
    if (sections.length === 0) return;

    const goTo = (delta: 1 | -1) => {
      if (animatingRef.current) return;
      const target = Math.min(
        Math.max(indexRef.current + delta, 0),
        sections.length - 1,
      );
      if (target === indexRef.current) return;

      animatingRef.current = true;
      indexRef.current = target;
      const targetEl = sections[target];

      lenis.scrollTo(targetEl, {
        duration: SCROLL_DURATION,
        easing: easeInOutQuart,
        onComplete: () => {
          setTimeout(() => {
            animatingRef.current = false;
          }, COOLDOWN_MS);
        },
      });
    };

    /**
     * Returns true if the current wheel/touch gesture should consume the
     * section snap (i.e. user is at the section's top or bottom edge).
     * Returns false if the gesture should pass through to native scroll.
     */
    const isAtEdge = (goingDown: boolean): boolean => {
      const current = sections[indexRef.current];
      if (!current) return true;
      const rect = current.getBoundingClientRect();
      const overflows = current.scrollHeight > window.innerHeight + 1;
      if (!overflows) return true;
      if (goingDown) {
        return rect.bottom <= window.innerHeight + EDGE_TOLERANCE_PX;
      }
      return rect.top >= -EDGE_TOLERANCE_PX;
    };

    /**
     * Find the section that occupies the most of the current viewport, in case
     * native scroll has changed which section the user is in.
     */
    const refreshCurrentIndex = () => {
      const mid = window.innerHeight / 2;
      let bestIdx = indexRef.current;
      let bestDist = Infinity;
      sections.forEach((s, idx) => {
        const r = s.getBoundingClientRect();
        const center = (r.top + r.bottom) / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });
      indexRef.current = bestIdx;
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      if (animatingRef.current) {
        e.preventDefault();
        return;
      }

      refreshCurrentIndex();
      const goingDown = e.deltaY > 0;

      if (!isAtEdge(goingDown)) {
        // Mid-section overflow — let Lenis handle native smooth scroll
        // through the section's interior. Do NOT preventDefault.
        return;
      }

      e.preventDefault();
      goTo(goingDown ? 1 : -1);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      touchStartYRef.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const start = touchStartYRef.current;
      touchStartYRef.current = null;
      if (start === null) return;
      const endY = e.changedTouches[0]?.clientY;
      if (endY === undefined) return;
      const delta = start - endY;
      if (Math.abs(delta) < TOUCH_THRESHOLD_PX) return;
      if (animatingRef.current) return;

      refreshCurrentIndex();
      const goingDown = delta > 0;
      if (!isAtEdge(goingDown)) return;

      goTo(goingDown ? 1 : -1);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (animatingRef.current) e.preventDefault();
    };

    const jumpTo = (target: number) => {
      if (animatingRef.current) return;
      if (target === indexRef.current) return;
      animatingRef.current = true;
      indexRef.current = target;
      lenis.scrollTo(sections[target], {
        duration: SCROLL_DURATION,
        easing: easeInOutQuart,
        onComplete: () => {
          setTimeout(() => (animatingRef.current = false), COOLDOWN_MS);
        },
      });
    };

    const onKey = (e: KeyboardEvent) => {
      if (animatingRef.current) return;
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          refreshCurrentIndex();
          if (isAtEdge(true)) goTo(1);
          else lenis.scrollTo(window.scrollY + window.innerHeight * 0.6, { duration: 0.8 });
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          refreshCurrentIndex();
          if (isAtEdge(false)) goTo(-1);
          else lenis.scrollTo(window.scrollY - window.innerHeight * 0.6, { duration: 0.8 });
          break;
        case "Home":
          e.preventDefault();
          jumpTo(0);
          break;
        case "End":
          e.preventDefault();
          jumpTo(sections.length - 1);
          break;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [lenis]);

  return null;
}
