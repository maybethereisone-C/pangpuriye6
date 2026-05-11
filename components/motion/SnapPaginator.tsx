"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "./MotionProvider";

const SCROLL_DURATION = 1.0;
const COOLDOWN_MS = 200;
const WHEEL_THRESHOLD = 5;
const TOUCH_THRESHOLD_PX = 30;

const easeOutExpo = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

/**
 * JS-driven section paginator. Replaces CSS scroll-snap with explicit
 * `lenis.scrollTo()` glides + one-gesture-per-section lock.
 *
 * Hooked into the global Lenis instance via the MotionProvider context.
 * Mounts only when `prefers-reduced-motion: no-preference` — otherwise the
 * page falls back to default browser scroll behavior.
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
      const targetEl = sections[target];
      indexRef.current = target;

      lenis.scrollTo(targetEl, {
        duration: SCROLL_DURATION,
        easing: easeOutExpo,
        lock: true,
        onComplete: () => {
          setTimeout(() => {
            animatingRef.current = false;
          }, COOLDOWN_MS);
        },
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      e.preventDefault();
      if (animatingRef.current) return;
      goTo(e.deltaY > 0 ? 1 : -1);
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
      goTo(delta > 0 ? 1 : -1);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (animatingRef.current) e.preventDefault();
    };

    const onKey = (e: KeyboardEvent) => {
      if (animatingRef.current) return;
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          goTo(1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          goTo(-1);
          break;
        case "Home":
          e.preventDefault();
          if (indexRef.current !== 0) {
            animatingRef.current = true;
            indexRef.current = 0;
            lenis.scrollTo(sections[0], {
              duration: SCROLL_DURATION,
              easing: easeOutExpo,
              lock: true,
              onComplete: () => {
                setTimeout(() => (animatingRef.current = false), COOLDOWN_MS);
              },
            });
          }
          break;
        case "End":
          e.preventDefault();
          if (indexRef.current !== sections.length - 1) {
            animatingRef.current = true;
            indexRef.current = sections.length - 1;
            lenis.scrollTo(sections[sections.length - 1], {
              duration: SCROLL_DURATION,
              easing: easeOutExpo,
              lock: true,
              onComplete: () => {
                setTimeout(() => (animatingRef.current = false), COOLDOWN_MS);
              },
            });
          }
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
