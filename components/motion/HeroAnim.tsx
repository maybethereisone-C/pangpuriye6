"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { DURATION, EASE, prefersReducedMotion, splitWords } from "@/lib/anim";

/**
 * Hero entrance choreography — runs once on mount.
 *
 * Sequence (cause-effect):
 *   0.00s eyebrow fade-up + slight slide
 *   0.15s title words rise from below with stagger
 *   0.55s motto fade-in with gold-bar growth
 *   0.75s CTAs fade-up stagger
 *   0.90s photo/logo frame scale-in
 *
 * Wraps the Hero JSX as-is — no markup change, just targets via [data-anim].
 */
export function HeroAnim({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = scope.current;
      if (!root) return;

      const eyebrow = root.querySelector<HTMLElement>("[data-anim='hero-eyebrow']");
      const titleEl = root.querySelector<HTMLElement>("[data-anim='hero-title']");
      const motto = root.querySelector<HTMLElement>("[data-anim='hero-motto']");
      const ctas = root.querySelectorAll<HTMLElement>("[data-anim='hero-cta']");
      const photo = root.querySelector<HTMLElement>("[data-anim='hero-photo']");

      // Split title h1 children spans into words (preserves <span class="block">)
      const titleSpans = titleEl
        ? Array.from(titleEl.querySelectorAll<HTMLElement>(":scope > span"))
        : [];
      const allWords: HTMLElement[] = [];
      titleSpans.forEach((line) => {
        allWords.push(...splitWords(line));
      });

      const tl = gsap.timeline({ defaults: { ease: EASE.out } });

      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: DURATION.short },
          0,
        );
      }

      if (allWords.length) {
        tl.fromTo(
          allWords,
          { opacity: 0, y: 60, rotateX: -30 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: DURATION.long,
            stagger: 0.04,
            ease: EASE.expo,
          },
          0.15,
        );
      }

      if (motto) {
        tl.fromTo(
          motto,
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: DURATION.medium },
          0.55,
        );
      }

      if (ctas.length) {
        tl.fromTo(
          Array.from(ctas),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.short,
            stagger: 0.08,
            ease: EASE.out,
          },
          0.75,
        );
      }

      if (photo) {
        tl.fromTo(
          photo,
          { opacity: 0, scale: 0.92, filter: "blur(8px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: DURATION.long,
          },
          0.9,
        );
      }
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
