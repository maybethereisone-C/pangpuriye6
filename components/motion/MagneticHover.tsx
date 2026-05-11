"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/anim";

/**
 * Global magnetic hover for elements with [data-magnetic].
 *
 * On mouseenter the element translates a fraction of cursor distance,
 * giving a "pull" feel without dragging it far. Returns to origin on
 * mouseleave with eased recovery.
 *
 * Mount once at app root.
 */
export function MagneticHover() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    const PULL = 0.18;
    const RANGE = 80; // px — only pull while pointer is inside element + this halo
    const targets = new WeakMap<Element, { rect: DOMRect; raf: number }>();

    const closest = (raw: EventTarget | null): HTMLElement | null => {
      if (!raw || !(raw instanceof Element)) return null;
      return raw.closest<HTMLElement>("[data-magnetic]");
    };

    const onPointerMove = (e: PointerEvent) => {
      const target = closest(e.target);
      if (!target) return;
      let entry = targets.get(target);
      if (!entry) {
        entry = { rect: target.getBoundingClientRect(), raf: 0 };
        targets.set(target, entry);
      }
      const cx = entry.rect.left + entry.rect.width / 2;
      const cy = entry.rect.top + entry.rect.height / 2;
      const dx = (e.clientX - cx) * PULL;
      const dy = (e.clientY - cy) * PULL;
      target.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    };

    const onPointerEnter = (e: PointerEvent) => {
      const target = closest(e.target);
      if (!target) return;
      targets.set(target, { rect: target.getBoundingClientRect(), raf: 0 });
      target.style.transition = "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)";
    };

    const onPointerLeave = (e: PointerEvent) => {
      const target = closest(e.target);
      if (!target) return;
      target.style.transform = "translate3d(0, 0, 0)";
      target.style.transition = "";
    };

    const onResize = () => {
      // Invalidate cached rects on resize so re-enter recomputes
      const els = document.querySelectorAll<HTMLElement>("[data-magnetic]");
      els.forEach((el) => targets.delete(el));
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerenter", onPointerEnter, true);
    document.addEventListener("pointerleave", onPointerLeave, true);
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerenter", onPointerEnter, true);
      document.removeEventListener("pointerleave", onPointerLeave, true);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // No DOM output — global behavior only
  return null;
}
