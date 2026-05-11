"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type JourneyStep = { date: string; title: string; desc: string; side: "left" | "right"; dot: "red" | "gold" | "now" };

const JOURNEY: JourneyStep[] = [
  { date: "March 2026", title: "Level 1", desc: "Foundation of AI engineering — algorithms, models, and the first lines we called our own.", side: "left", dot: "red" },
  { date: "May 2026", title: "Level 2", desc: "Advanced model development. Peer review. Real industry briefs.", side: "right", dot: "gold" },
  { date: "May 2026", title: "Level 3", desc: "Industry-level challenges, partner organisations, production deployments.", side: "left", dot: "red" },
  { date: "Now", title: "First hackathon win", desc: "Coming soon.", side: "right", dot: "now" },
];

export function JourneyTimeline() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const spine = root.current?.querySelector<HTMLElement>(".j-spine");
      const dots = root.current?.querySelectorAll<HTMLElement>(".j-dot");
      const cards = root.current?.querySelectorAll<HTMLElement>(".j-card");

      if (!spine || !dots || !cards) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      });

      // Spine draws down
      tl.fromTo(spine, { scaleY: 0, transformOrigin: "top center" }, { scaleY: 1, ease: "none", duration: 4 });

      // Each dot pops in + card slides in, staggered along the scrub
      dots.forEach((dot, i) => {
        const card = cards[i];
        const isLeft = JOURNEY[i]?.side === "left";

        tl.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, ease: "back.out(2)", duration: 0.6 },
          i * 0.9 + 0.2,
        );

        if (card) {
          tl.fromTo(
            card,
            { opacity: 0, x: isLeft ? -32 : 32 },
            { opacity: 1, x: 0, ease: "power3.out", duration: 0.8 },
            i * 0.9 + 0.35,
          );
        }
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mt-24">
      <div className="mb-16 border-b border-[var(--color-hairline)] pb-12 text-center">
        <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.25em] text-[var(--color-accent-red)]">
          Timeline
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-display-loaded)] text-4xl font-bold md:text-5xl">
          Our Journey
        </h3>
      </div>

      <div className="relative">
        {/* Animated spine */}
        <div
          aria-hidden
          className="j-spine absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 md:block"
          style={{
            background: "linear-gradient(to bottom, var(--color-accent-gold), var(--color-accent-red) 60%, transparent)",
            opacity: 0.45,
          }}
        />

        <ol className="flex flex-col gap-8">
          {JOURNEY.map((step, i) => {
            const isLeft = step.side === "left";
            const accentColor =
              step.dot === "gold"
                ? "var(--color-accent-gold)"
                : step.dot === "now"
                ? "var(--color-fg)"
                : "var(--color-accent-red)";
            const cardBorder =
              step.dot === "now"
                ? "2px dashed var(--color-fg)"
                : `1px solid ${step.dot === "gold" ? "rgba(212,163,115,0.3)" : "rgba(193,18,31,0.18)"}`;
            const dotBg = step.dot === "now" ? "var(--color-bg)" : accentColor;

            const card = (
              <div
                className={`j-card p-5 ${isLeft ? "text-right" : ""}`}
                style={{ border: cardBorder }}
              >
                <p
                  className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em]"
                  style={{ color: accentColor }}
                >
                  {step.date}
                </p>
                <p className="mt-1.5 font-[family-name:var(--font-display-loaded)] text-base font-bold text-[var(--color-fg)]">
                  {step.title}
                </p>
                <p className="mt-1 text-sm text-[var(--color-fg-soft)]">{step.desc}</p>
              </div>
            );

            return (
              <li
                key={`${step.title}-${i}`}
                className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] md:items-start"
              >
                <div className={isLeft ? "md:pr-8" : ""}>{isLeft ? card : null}</div>

                {/* Dot */}
                <div className="hidden md:flex md:justify-center md:pt-4">
                  <span
                    className="j-dot h-4 w-4 shrink-0 rounded-full"
                    style={{
                      background: dotBg,
                      boxShadow: `0 0 0 2px var(--color-bg), 0 0 0 3px ${accentColor}`,
                    }}
                  />
                </div>

                <div className={!isLeft ? "md:pl-8" : ""}>{!isLeft ? card : null}</div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
