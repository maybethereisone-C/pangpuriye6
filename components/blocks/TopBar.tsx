"use client";

import { useEffect, useState } from "react";

export function TopBar({ total }: { total: number }) {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[data-section]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const idx = Number((entry.target as HTMLElement).dataset.sectionIndex);
            if (!Number.isNaN(idx)) setCurrent(idx);
          }
        }
      },
      { threshold: [0.5] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-[var(--grid-margin-mobile)] py-4 md:px-[var(--grid-margin-desktop)]">
      <span className="font-[family-name:var(--font-display-loaded)] text-2xl font-bold text-[var(--color-accent-red)]">
        P
      </span>
      <span className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-ink-charcoal)]">
        {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <span className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-ink-charcoal)]">
        Menu
      </span>
    </header>
  );
}
