/**
 * Shared GSAP utilities.
 *
 * Rules (per ui-ux-pro-max + docs/motion.md):
 * - Transform + opacity only (no width/height/top/left animation)
 * - Duration 150-300ms micro, 400-800ms macro, ≤1100ms hero
 * - Ease-out for enter, ease-in for exit (~60-70% of enter duration)
 * - Stagger 30-50ms per list item
 * - prefers-reduced-motion: snap to end state, no animation
 */

export const EASE = {
  out: "power3.out",
  in: "power2.in",
  inOut: "power3.inOut",
  expo: "expo.out",
  back: "back.out(1.4)",
} as const;

export const DURATION = {
  micro: 0.22,
  short: 0.5,
  medium: 0.8,
  long: 1.1,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Split a heading into per-WORD spans (faster + cleaner than per-letter for
 * long headings). Words are inline-block so they can translate independently.
 */
export function splitWords(el: HTMLElement): HTMLSpanElement[] {
  if (el.dataset.wordSplit === "done") {
    return Array.from(el.querySelectorAll<HTMLSpanElement>(":scope > span.word"));
  }
  const text = el.textContent ?? "";
  el.textContent = "";
  const fragment = document.createDocumentFragment();
  const spans: HTMLSpanElement[] = [];
  const tokens = text.split(/(\s+)/);
  for (const tok of tokens) {
    if (tok.trim() === "") {
      fragment.appendChild(document.createTextNode(tok));
      continue;
    }
    const span = document.createElement("span");
    span.className = "word";
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity";
    span.textContent = tok;
    fragment.appendChild(span);
    spans.push(span);
  }
  el.appendChild(fragment);
  el.dataset.wordSplit = "done";
  return spans;
}
