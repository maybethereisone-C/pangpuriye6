"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE, prefersReducedMotion, splitWords } from "@/lib/anim";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reveal-on-view wrapper for section content. Single ScrollTrigger fires
 * when section enters viewport.
 *
 * Targets (data attributes inside the wrapped subtree):
 *   [data-anim="reveal-eyebrow"] — fade-up + slight slide
 *   [data-anim="reveal-title"]   — word-by-word rise (stagger 40ms)
 *   [data-anim="reveal-body"]    — fade-up
 *   [data-anim="reveal-item"]    — stagger fade-up (for grid/list items)
 *   [data-anim="reveal-photo"]   — clip-path inset reveal
 *
 * Each fires once on first enter; no replay on scroll back (cleaner feel).
 */
export function RevealOnView({
  children,
  start = "top 75%",
}: {
  children: React.ReactNode;
  start?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = scope.current;
      if (!root) return;

      const eyebrow = root.querySelector<HTMLElement>("[data-anim='reveal-eyebrow']");
      const titleEl = root.querySelector<HTMLElement>("[data-anim='reveal-title']");
      const bodyEls = root.querySelectorAll<HTMLElement>("[data-anim='reveal-body']");
      const itemEls = root.querySelectorAll<HTMLElement>("[data-anim='reveal-item']");
      const photoEls = root.querySelectorAll<HTMLElement>("[data-anim='reveal-photo']");

      const titleWords = titleEl ? splitWords(titleEl) : [];

      // Set initial hidden state immediately so elements start invisible.
      // Without this, GSAP's fromTo fires AFTER a frame where elements are
      // already visible, causing the jarring "snap to hidden then animate" flash.
      if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: -8 });
      if (titleWords.length) gsap.set(titleWords, { opacity: 0, y: 40 });
      if (bodyEls.length) gsap.set(Array.from(bodyEls), { opacity: 0, y: 20 });
      if (itemEls.length) gsap.set(Array.from(itemEls), { opacity: 0, y: 24 });
      if (photoEls.length) gsap.set(Array.from(photoEls), { clipPath: "inset(0 100% 0 0)" });

      const ctx = ScrollTrigger.create({
        trigger: root,
        start,
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: EASE.out } });

          if (eyebrow) {
            tl.fromTo(
              eyebrow,
              { opacity: 0, y: -8 },
              { opacity: 1, y: 0, duration: DURATION.short },
              0,
            );
          }
          if (titleWords.length) {
            tl.fromTo(
              titleWords,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: DURATION.medium,
                stagger: 0.04,
                ease: EASE.expo,
              },
              0.1,
            );
          }
          if (bodyEls.length) {
            tl.fromTo(
              Array.from(bodyEls),
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: DURATION.medium, stagger: 0.08 },
              0.35,
            );
          }
          if (itemEls.length) {
            tl.fromTo(
              Array.from(itemEls),
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: DURATION.medium,
                stagger: 0.05,
                ease: EASE.out,
              },
              0.45,
            );
          }
          if (photoEls.length) {
            tl.fromTo(
              Array.from(photoEls),
              { clipPath: "inset(0 100% 0 0)" },
              {
                clipPath: "inset(0 0% 0 0)",
                duration: DURATION.long,
                stagger: 0.1,
                ease: "cubic-bezier(0.65, 0, 0.35, 1)",
              },
              0.5,
            );
          }
        },
      });

      return () => ctx.kill();
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
