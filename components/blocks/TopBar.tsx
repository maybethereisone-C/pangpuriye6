"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMenu } from "./MenuProvider";

export function TopBar({ total }: { total: number }) {
  const [current, setCurrent] = useState(1);
  const { toggle } = useMenu();

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
      <a
        href="#home"
        aria-label="Pangpuriye home"
        className="flex items-center gap-2 text-[var(--color-accent-red)]"
      >
        <Image
          src="/images/logo.svg"
          alt=""
          aria-hidden
          width={28}
          height={28}
          unoptimized
          className="block h-7 w-7"
        />
        <span className="font-[family-name:var(--font-mono-loaded)] sr-only text-xs uppercase tracking-[0.2em]">
          Pangpuriye
        </span>
      </a>
      <span className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg)]">
        {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <button
        type="button"
        onClick={toggle}
        aria-label="Open menu"
        className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg)] hover:text-[var(--color-accent-red)]"
      >
        Menu
      </button>
    </header>
  );
}
